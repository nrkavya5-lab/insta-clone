import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id: postId } = await params;

  try {
    await prisma.like.deleteMany({
      where: { postId, userId },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { likeCount: { decrement: 1 } },
    });

    return NextResponse.json({ liked: false });
  } catch {
    return NextResponse.json(
      { error: "Failed to unlike reel" },
      { status: 500 },
    );
  }
}
