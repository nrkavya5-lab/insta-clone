import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  if (isDev) {
    const posts = Array.from({ length: 3 }, (_, i) => ({
      id: `saved-mock-${i}`,
      username: `user_${i + 1}`,
      avatarUrl: null,
      mediaUrls: [`https://picsum.photos/seed/saved${i}/600/600`],
      caption: `Saved post #${i + 1}`,
      likeCount: Math.floor(Math.random() * 200),
      commentCount: Math.floor(Math.random() * 15),
      liked: i % 2 === 0,
      savedAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));
    return NextResponse.json({ posts, nextCursor: null });
  }

  if (!userId) return unauthorized();

  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 10,
    50,
  );

  try {
    const saved = await prisma.savedPost.findMany({
      where: { userId },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
            _count: { select: { likes: true, comments: true } },
            likes: { where: { userId }, select: { id: true } },
          },
        },
      },
    });

    const hasMore = saved.length > limit;
    const items = hasMore ? saved.slice(0, limit) : saved;

    return NextResponse.json({
      posts: items.map((s) => ({
        id: s.post.id,
        username: s.post.user.username,
        avatarUrl: s.post.user.avatarUrl,
        mediaUrls: s.post.mediaUrls,
        caption: s.post.caption ?? "",
        likeCount: s.post._count.likes,
        commentCount: s.post._count.comments,
        liked: s.post.likes.length > 0,
        savedAt: s.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch saved posts" },
      { status: 500 },
    );
  }
}
