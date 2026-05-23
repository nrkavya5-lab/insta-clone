import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id: storyId } = await params;

  try {
    await prisma.storyView.upsert({
      where: { storyId_userId: { storyId, userId } },
      create: { storyId, userId },
      update: {},
    });

    return NextResponse.json({ viewed: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to mark story as viewed" },
      { status: 500 },
    );
  }
}
