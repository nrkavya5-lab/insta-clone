import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; cid: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id: postId, cid: commentId } = await params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true },
    });

    if (!comment || comment.postId !== postId)
      return notFound("Comment not found");
    if (comment.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: not your comment" },
        { status: 403 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.comment.delete({ where: { id: commentId } });
      await tx.post.update({
        where: { id: postId },
        data: { commentCount: { decrement: 1 } },
      });
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
