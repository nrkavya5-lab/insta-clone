import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await params;
  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 20,
    50,
  );

  try {
    const posts = await prisma.post.findMany({
      where: { userId: id, isDeleted: false },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        mediaUrls: true,
        mediaType: true,
        likeCount: true,
        commentCount: true,
        createdAt: true,
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId }, select: { id: true } },
      },
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, limit) : posts;

    return NextResponse.json({
      posts: items.map((p) => ({
        id: p.id,
        mediaUrls: p.mediaUrls,
        mediaType: p.mediaType,
        likeCount: p._count.likes,
        commentCount: p._count.comments,
        liked: p.likes.length > 0,
        createdAt: p.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch user posts" },
      { status: 500 },
    );
  }
}
