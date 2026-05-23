import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const userId = await getSessionUserId();
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  const { name } = await params;

  if (isDev) {
    return NextResponse.json({
      hashtag: { name, postCount: 1234 },
      posts: Array.from({ length: 12 }, (_, i) => ({
        id: `tag-post-${i}`,
        mediaUrls: [`https://picsum.photos/seed/tag${i}/600/600`],
        likeCount: Math.floor(Math.random() * 200),
        commentCount: Math.floor(Math.random() * 20),
      })),
    });
  }

  if (!userId) return unauthorized();

  try {
    const hashtag = await prisma.hashtag.findUnique({
      where: { name },
    });
    if (!hashtag) return notFound("Hashtag not found");

    const cursor = req.nextUrl.searchParams.get("cursor");
    const limit = Math.min(
      Number(req.nextUrl.searchParams.get("limit")) || 30,
      60,
    );

    const postHashtags = await prisma.postHashtag.findMany({
      where: { hashtagId: hashtag.id },
      take: limit + 1,
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              postId_hashtagId: { postId: cursor, hashtagId: hashtag.id },
            },
          }
        : {}),
      orderBy: { post: { createdAt: "desc" } },
      include: {
        post: {
          select: {
            id: true,
            mediaUrls: true,
            likeCount: true,
            commentCount: true,
            user: { select: { username: true } },
          },
        },
      },
    });

    const hasMore = postHashtags.length > limit;
    const items = hasMore ? postHashtags.slice(0, limit) : postHashtags;

    return NextResponse.json({
      hashtag: { name: hashtag.name, postCount: hashtag.postCount },
      posts: items.map((ph) => ({
        id: ph.post.id,
        mediaUrls: ph.post.mediaUrls,
        likeCount: ph.post.likeCount,
        commentCount: ph.post.commentCount,
        username: ph.post.user.username,
      })),
      nextCursor: hasMore ? items[items.length - 1].postId : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch hashtag" },
      { status: 500 },
    );
  }
}
