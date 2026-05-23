import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const requesterId = (await params).id;

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: userId,
        },
      },
    });
    if (!follow || follow.status !== "pending") {
      return notFound("No pending request");
    }

    await prisma.follow.update({
      where: { id: follow.id },
      data: { status: "active" },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to accept request" },
      { status: 500 },
    );
  }
}
