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
    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      return NextResponse.json({ liked: true });
    }

    await prisma.$transaction([
      prisma.like.create({ data: { postId, userId } }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ liked: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}
