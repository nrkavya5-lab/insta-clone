import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  const { id } = await params;
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  if (isDev) {
    return NextResponse.json({
      user: {
        id: "dev-user",
        username: id,
        name: `Dev ${id}`,
        bio: "Building the next big thing",
        website: "https://example.com",
        avatarUrl: null,
        isPrivate: false,
        isVerified: false,
        postCount: 12,
        followerCount: 142,
        followingCount: 89,
      },
      relation: "self" as const,
      posts: Array.from({ length: 12 }, (_, i) => ({
        id: `profile-post-${i}`,
        mediaUrls: [`https://picsum.photos/seed/prof${i}/600/600`],
        mediaType: "photo",
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 20),
      })),
    });
  }

  if (!userId) return unauthorized();

  try {
    const isCuid = id.startsWith("c") && id.length > 20;
    const user = await prisma.user.findUnique({
      where: isCuid ? { id } : { username: id },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        website: true,
        avatarUrl: true,
        isPrivate: true,
        isVerified: true,
        _count: { select: { posts: true, followers: true, following: true } },
        followers: {
          where: { followerId: userId },
          select: { id: true, status: true },
        },
      },
    });

    if (!user) return notFound("User not found");

    const posts = await prisma.post.findMany({
      where: { userId: user.id, isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        mediaUrls: true,
        mediaType: true,
        likeCount: true,
        commentCount: true,
      },
    });

    let relation: "self" | "following" | "none" | "pending" = "none";
    if (user.id === userId) {
      relation = "self";
    } else if (user.followers.length > 0) {
      relation =
        user.followers[0].status === "pending" ? "pending" : "following";
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        bio: user.bio,
        website: user.website,
        avatarUrl: user.avatarUrl,
        isPrivate: user.isPrivate,
        isVerified: user.isVerified,
        postCount: user._count.posts,
        followerCount: user._count.followers,
        followingCount: user._count.following,
      },
      relation,
      posts,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
