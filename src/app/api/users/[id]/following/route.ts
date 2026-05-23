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

    const following = await prisma.follow.findMany({
      where: { followerId: id, status: "active" },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        following: {
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
          },
        },
      },
    });

    const hasMore = following.length > limit;
    const items = hasMore ? following.slice(0, limit) : following;

    return NextResponse.json({
      users: items.map((f) => ({
        id: f.following.id,
        username: f.following.username,
        name: f.following.name,
        avatarUrl: f.following.avatarUrl,
        isPrivate: f.following.isPrivate,
        isVerified: f.following.isVerified,
        relation:
          f.following.id === userId
            ? ("self" as const)
            : f.following.followers.length > 0
              ? f.following.followers[0].status === "pending"
                ? ("pending" as const)
                : ("following" as const)
              : ("none" as const),
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch following" },
      { status: 500 },
    );
  }
}
