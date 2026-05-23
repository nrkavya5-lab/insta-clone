import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  if (isDev) {
    return NextResponse.json({
      reels: Array.from({ length: 5 }, (_, i) => ({
        id: `reel-dev-${i}`,
        username: `creator_${i + 1}`,
        avatarUrl: null,
        mediaUrls: ["https://www.w3schools.com/html/mov_bbb.mp4"],
        caption: `Reel #${i + 1} — Check out this awesome video! 🎬`,
        audioName: `Original Audio - Creator ${i + 1}`,
        likeCount: Math.floor(Math.random() * 5000),
        commentCount: Math.floor(Math.random() * 200),
        liked: i % 2 === 0,
        saved: i % 3 === 0,
      })),
    });
  }

  if (!userId) return unauthorized();

  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 10,
    50,
  );

  try {
    const reels = await prisma.post.findMany({
      where: { mediaType: "reel", isDeleted: false },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId }, select: { id: true } },
        savedBy: { where: { userId }, select: { id: true } },
      },
    });

    const hasMore = reels.length > limit;
    const items = hasMore ? reels.slice(0, limit) : reels;

    return NextResponse.json({
      reels: items.map((r) => ({
        id: r.id,
        username: r.user.username,
        avatarUrl: r.user.avatarUrl,
        mediaUrls: r.mediaUrls,
        caption: r.caption ?? "",
        audioName: `Original Audio - ${r.user.username}`,
        likeCount: r._count.likes,
        commentCount: r._count.comments,
        liked: r.likes.length > 0,
        saved: r.savedBy.length > 0,
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reels" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const { mediaUrls, caption } = await req.json();

    if (!mediaUrls?.length) {
      return NextResponse.json(
        { error: "At least one media URL is required" },
        { status: 400 },
      );
    }

    const reel = await prisma.post.create({
      data: {
        userId,
        caption,
        mediaUrls,
        mediaType: "reel",
      },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    return NextResponse.json(reel, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create reel" },
      { status: 500 },
    );
  }
}
