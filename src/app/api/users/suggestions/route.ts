import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const followingIds = await prisma.follow.findMany({
      where: { followerId: userId, status: "active" },
      select: { followingId: true },
    });
    const exclude = new Set([
      userId,
      ...followingIds.map((f) => f.followingId),
    ]);

    const suggestions = await prisma.user.findMany({
      where: { id: { notIn: [...exclude] } },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        isPrivate: true,
        isVerified: true,
      },
    });

    return NextResponse.json({ users: suggestions });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 },
    );
  }
}
