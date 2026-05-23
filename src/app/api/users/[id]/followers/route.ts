import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await params;
  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 20,
    50,
  );

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!user) return notFound("User not found");

    const followers = await prisma.follow.findMany({
      where: { followingId: id, status: "active" },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            isPrivate: true,
            isVerified: true,
            followers: {
              where: { followerId: userId },
              select: { id: true, status: true },
            },
            following: { where: { followingId: userId }, select: { id: true } },
          },
        },
      },
    });

    const hasMore = followers.length > limit;
    const items = hasMore ? followers.slice(0, limit) : followers;

    return NextResponse.json({
      users: items.map((f) => ({
        id: f.follower.id,
        username: f.follower.username,
        name: f.follower.name,
        avatarUrl: f.follower.avatarUrl,
        isPrivate: f.follower.isPrivate,
        isVerified: f.follower.isVerified,
        relation:
          f.follower.id === userId
            ? ("self" as const)
            : f.follower.followers.length > 0
              ? f.follower.followers[0].status === "pending"
                ? ("pending" as const)
                : ("following" as const)
              : ("none" as const),
        mutualFriends: f.follower.following.length,
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch followers" },
      { status: 500 },
    );
  }
}
