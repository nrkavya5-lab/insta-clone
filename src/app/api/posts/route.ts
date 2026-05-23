import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  const { searchParams } = new URL(req.url);
  const isDev = searchParams.get("__dev") === "1";

  if (!userId && !isDev) return unauthorized();

  if (isDev) {
    const mockPosts = Array.from({ length: 5 }, (_, i) => ({
      id: `mock-${i}`,
      username: `user_${i + 1}`,
      avatarUrl: null,
      location: i % 2 === 0 ? "New York" : null,
      mediaUrls: [`https://picsum.photos/seed/${i + 1}/600/600`],
      caption: `Sample post #${i + 1} with some #hashtag and @mention`,
      likeCount: Math.floor(Math.random() * 500),
      commentCount: Math.floor(Math.random() * 30),
      liked: i % 2 === 0,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    }));
    return NextResponse.json({ posts: mockPosts, nextCursor: null });
  }

  if (!userId) return unauthorized();

  const tab = searchParams.get("tab") ?? "following";
  const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);
  const cursor = searchParams.get("cursor");

  try {
    const where =
      tab === "following"
        ? {
            user: {
              followers: { some: { followerId: userId } },
            },
            isDeleted: false,
          }
        : { isDeleted: false };

    const posts = await prisma.post.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId }, select: { id: true } },
      },
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, limit) : posts;

    const formatted = items.map((p) => ({
      id: p.id,
      username: p.user.username,
      avatarUrl: p.user.avatarUrl,
      location: p.location,
      mediaUrls: p.mediaUrls,
      caption: p.caption ?? "",
      likeCount: p._count.likes,
      commentCount: p._count.comments,
      liked: p.likes.length > 0,
      createdAt: p.createdAt.toISOString(),
    }));

    return NextResponse.json({
      posts: formatted,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    const body = await req.clone().json();
    return NextResponse.json(
      { id: "mock-post", ...body, createdAt: new Date().toISOString() },
      { status: 201 },
    );
  }

  try {
    const { caption, mediaUrls, mediaType, location } = await req.json();

    if (!mediaUrls?.length) {
      return NextResponse.json(
        { error: "At least one media URL is required" },
        { status: 400 },
      );
    }

    const hashtagRegex = /#(\w+)/g;
    const hashtagNames = [...caption.matchAll(hashtagRegex)].map((m) =>
      m[1].toLowerCase(),
    );

    const post = await prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          userId,
          caption,
          mediaUrls,
          mediaType: mediaType || "photo",
          location,
          hashtags: hashtagNames.length
            ? {
                create: await Promise.all(
                  hashtagNames.map(async (name) => {
                    const hashtag = await tx.hashtag.upsert({
                      where: { name },
                      create: { name },
                      update: { postCount: { increment: 1 } },
                    });
                    return { hashtagId: hashtag.id };
                  }),
                ),
              }
            : undefined,
        },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
          _count: { select: { likes: true, comments: true } },
        },
      });
      return created;
    });

    return NextResponse.json(
      {
        id: post.id,
        username: post.user.username,
        avatarUrl: post.user.avatarUrl,
        mediaUrls: post.mediaUrls,
        caption: post.caption ?? "",
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        createdAt: post.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
