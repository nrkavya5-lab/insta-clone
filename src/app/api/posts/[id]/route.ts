import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  const { id } = await params;

  if (isDev) {
    return NextResponse.json({
      id,
      username: "dev_user",
      avatarUrl: null,
      mediaUrls: ["https://picsum.photos/seed/1/600/600"],
      caption: "Dev mode post with #hashtag",
      location: "San Francisco",
      likeCount: 42,
      commentCount: 7,
      liked: true,
      comments: [
        {
          id: "c1",
          text: "Great shot!",
          username: "commenter1",
          avatarUrl: null,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    });
  }

  if (!userId) return unauthorized();

  try {
    const post = await prisma.post.findUnique({
      where: { id, isDeleted: false },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
        likes: userId ? { where: { userId }, select: { id: true } } : undefined,
        comments: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!post) return notFound("Post not found");

    return NextResponse.json({
      id: post.id,
      username: post.user.username,
      avatarUrl: post.user.avatarUrl,
      mediaUrls: post.mediaUrls,
      caption: post.caption ?? "",
      location: post.location,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      liked: post.likes.length > 0,
      comments: post.comments.map((c) => ({
        id: c.id,
        text: c.text,
        username: c.user.username,
        avatarUrl: c.user.avatarUrl,
        createdAt: c.createdAt.toISOString(),
      })),
      createdAt: post.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await params;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return notFound("Post not found");
    if (post.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { caption, location } = await req.json();
    const updated = await prisma.post.update({
      where: { id },
      data: { caption, location },
    });

    return NextResponse.json({ id: updated.id, caption: updated.caption });
  } catch {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await params;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return notFound("Post not found");
    if (post.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.post.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
