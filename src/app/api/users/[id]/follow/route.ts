import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const targetId = (await params).id;
  if (userId === targetId) {
    return NextResponse.json(
      { error: "Cannot follow yourself" },
      { status: 400 },
    );
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id: targetId },
      select: { id: true, isPrivate: true },
    });
    if (!target) return notFound("User not found");

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId: userId, followingId: targetId },
      },
    });

    if (existing) {
      return NextResponse.json({
        status: existing.status === "pending" ? "pending" : "following",
      });
    }

    const status = target.isPrivate ? "pending" : "active";

    await prisma.follow.create({
      data: { followerId: userId, followingId: targetId, status },
    });

    return NextResponse.json({ status }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 },
    );
  }
}
