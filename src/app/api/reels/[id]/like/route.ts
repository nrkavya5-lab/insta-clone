import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id: postId } = await params;

  try {
    await prisma.like.upsert({
      where: { postId_userId: { postId, userId } },
      create: { postId, userId },
      update: {},
    });

    await prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });

    return NextResponse.json({ liked: true });
  } catch {
    return NextResponse.json({ error: "Failed to like reel" }, { status: 500 });
  }
}
