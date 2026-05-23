import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (isDev) {
    const posts = Array.from({ length: 30 }, (_, i) => ({
      id: `explore-dev-${i}`,
      username: `explorer_${i + 1}`,
      avatarUrl: null,
      mediaUrls: [`https://picsum.photos/seed/explore${i}/600/600`],
      caption: `Explore post #${i + 1}`,
      likeCount: Math.floor(Math.random() * 1000),
      commentCount: Math.floor(Math.random() * 50),
      liked: i % 3 === 0,
    }));
    return NextResponse.json({ posts, nextCursor: null });
  }

  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 30,
    60,
  );

  try {
    const posts = await prisma.post.findMany({
      where: { isDeleted: false, mediaType: { not: "reel" } },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        mediaUrls: true,
        caption: true,
        likeCount: true,
        commentCount: true,
        user: { select: { id: true, username: true, avatarUrl: true } },
        likes: { where: { userId }, select: { id: true } },
      },
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, limit) : posts;

    return NextResponse.json({
      posts: items.map((p) => ({
        id: p.id,
        username: p.user.username,
        avatarUrl: p.user.avatarUrl,
        mediaUrls: p.mediaUrls,
        caption: p.caption ?? "",
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        liked: p.likes.length > 0,
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch explore posts" },
      { status: 500 },
    );
  }
}
