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
    await prisma.savedPost.deleteMany({
      where: { userId, postId },
    });

    return NextResponse.json({ saved: false });
  } catch {
    return NextResponse.json(
      { error: "Failed to unsave post" },
      { status: 500 },
    );
  }
}
