import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  if (isDev) {
    return NextResponse.json({
      users: [
        {
          id: "dev-alice",
          username: "alice_dev",
          avatarUrl: null,
          stories: Array.from({ length: 3 }, (_, i) => ({
            id: `story-mock-${i}`,
            mediaUrl: `https://picsum.photos/seed/story${i}/420/800`,
            mediaType: "photo",
            caption: i === 1 ? "Beautiful morning 🌅" : undefined,
            viewed: i === 0,
            createdAt: new Date().toISOString(),
          })),
        },
        {
          id: "dev-bob",
          username: "bob_dev",
          avatarUrl: null,
          stories: Array.from({ length: 2 }, (_, i) => ({
            id: `story-mock-b${i}`,
            mediaUrl: `https://picsum.photos/seed/storyb${i}/420/800`,
            mediaType: "photo",
            caption: undefined,
            viewed: false,
            createdAt: new Date().toISOString(),
          })),
        },
      ],
    });
  }

  if (!userId) return unauthorized();

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId, status: "active" },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    const usersWithStories = await prisma.user.findMany({
      where: {
        id: { in: [...followingIds, userId] },
        stories: {
          some: { expiresAt: { gt: new Date() } },
        },
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        stories: {
          where: { expiresAt: { gt: new Date() } },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            mediaUrl: true,
            mediaType: true,
            caption: true,
            createdAt: true,
            views: { where: { userId }, select: { id: true } },
          },
        },
      },
    });

    return NextResponse.json({
      users: usersWithStories.map((u) => ({
        id: u.id,
        username: u.username,
        avatarUrl: u.avatarUrl,
        stories: u.stories.map((s) => ({
          id: s.id,
          mediaUrl: s.mediaUrl,
          mediaType: s.mediaType,
          caption: s.caption ?? undefined,
          viewed: s.views.length > 0,
          createdAt: s.createdAt.toISOString(),
        })),
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const { mediaUrl, mediaType, caption } = await req.json();

    if (!mediaUrl) {
      return NextResponse.json(
        { error: "Media URL is required" },
        { status: 400 },
      );
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await prisma.story.create({
      data: {
        userId,
        mediaUrl,
        mediaType: mediaType ?? "photo",
        caption,
        expiresAt,
      },
    });

    return NextResponse.json(story, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 },
    );
  }
}
