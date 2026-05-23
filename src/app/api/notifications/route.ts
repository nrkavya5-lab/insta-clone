import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  if (isDev) {
    const types = [
      "like",
      "comment",
      "follow",
      "follow_request",
      "mention",
      "reply",
    ] as const;
    return NextResponse.json({
      notifications: Array.from({ length: 12 }, (_, i) => ({
        id: `notif-dev-${i}`,
        type: types[i % types.length],
        actorUsername: `user_${(i % 5) + 1}`,
        actorAvatarUrl: null,
        text:
          types[i % types.length] === "like"
            ? "liked your post"
            : types[i % types.length] === "comment"
              ? 'commented: "Nice shot!"'
              : types[i % types.length] === "follow"
                ? "started following you"
                : types[i % types.length] === "follow_request"
                  ? "sent a follow request"
                  : types[i % types.length] === "mention"
                    ? "mentioned you in a comment"
                    : "replied to your comment",
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        isRead: i > 3,
        postId: i % 3 === 0 ? `post-${i}` : null,
      })),
      nextCursor: null,
    });
  }

  if (!userId) return unauthorized();

  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 20,
    50,
  );

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
    });

    const actorIds = [...new Set(notifications.map((n) => n.actorId))];
    const actors =
      actorIds.length > 0
        ? await prisma.user.findMany({
            where: { id: { in: actorIds } },
            select: { id: true, username: true, avatarUrl: true },
          })
        : [];
    const actorMap = new Map(actors.map((a) => [a.id, a]));

    const hasMore = notifications.length > limit;
    const items = hasMore ? notifications.slice(0, limit) : notifications;

    return NextResponse.json({
      notifications: items.map((n) => {
        const actor = actorMap.get(n.actorId);
        return {
          id: n.id,
          type: n.type,
          actorUsername: actor?.username ?? "unknown",
          actorAvatarUrl: actor?.avatarUrl ?? null,
          text: formatNotificationText(n.type),
          createdAt: n.createdAt.toISOString(),
          isRead: n.isRead,
          postId: n.postId,
        };
      }),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

function formatNotificationText(type: string): string {
  const texts: Record<string, string> = {
    like: "liked your post",
    comment: "commented on your post",
    follow: "started following you",
    follow_request: "sent a follow request",
    mention: "mentioned you in a comment",
    reply: "replied to your comment",
  };
  return texts[type] ?? "interacted with your post";
}
