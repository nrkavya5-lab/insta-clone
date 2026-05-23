import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await params;

  try {
    const reel = await prisma.post.findUnique({
      where: { id, mediaType: "reel", isDeleted: false },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
        likes: userId ? { where: { userId }, select: { id: true } } : undefined,
        savedBy: userId
          ? { where: { userId }, select: { id: true } }
          : undefined,
      },
    });

    if (!reel) return notFound("Reel not found");

    return NextResponse.json({
      id: reel.id,
      username: reel.user.username,
      avatarUrl: reel.user.avatarUrl,
      mediaUrls: reel.mediaUrls,
      caption: reel.caption ?? "",
      likeCount: reel._count.likes,
      commentCount: reel._count.comments,
      liked: (reel.likes?.length ?? 0) > 0,
      saved: (reel.savedBy?.length ?? 0) > 0,
      createdAt: reel.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reel" },
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
    const reel = await prisma.post.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!reel) return notFound("Reel not found");
    if (reel.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: not your reel" },
        { status: 403 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.like.deleteMany({ where: { postId: id } });
      await tx.comment.deleteMany({ where: { postId: id } });
      await tx.savedPost.deleteMany({ where: { postId: id } });
      await tx.postHashtag.deleteMany({ where: { postId: id } });
      await tx.post.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete reel" },
      { status: 500 },
    );
  }
}
