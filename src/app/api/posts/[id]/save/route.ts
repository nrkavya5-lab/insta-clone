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
    const existing = await prisma.savedPost.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (existing) {
      return NextResponse.json({ saved: true });
    }

    await prisma.savedPost.create({
      data: { userId, postId },
    });

    return NextResponse.json({ saved: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}
