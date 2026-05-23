import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await params;

  try {
    const story = await prisma.story.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!story) return notFound("Story not found");
    if (story.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: not your story" },
        { status: 403 },
      );
    }

    await prisma.story.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 },
    );
  }
}
