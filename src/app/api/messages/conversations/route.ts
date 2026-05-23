import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  if (isDev) {
    return NextResponse.json({
      conversations: Array.from({ length: 4 }, (_, i) => ({
        id: `conv-dev-${i}`,
        username: `user_${i + 1}`,
        avatarUrl: null,
        lastMessage: `Hey there! This is message #${i + 1}`,
        lastMessageAt: new Date(Date.now() - i * 3600000).toISOString(),
        unread: i === 0,
        isGroup: false,
        participants: `user_${i + 1}`,
      })),
    });
  }

  if (!userId) return unauthorized();

  try {
    const participations = await prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            messages: { orderBy: { createdAt: "desc" }, take: 1 },
            participants: {
              include: {
                user: { select: { id: true, username: true, avatarUrl: true } },
              },
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: "desc" } },
    });

    return NextResponse.json({
      conversations: participations.map((p) => {
        const other = p.conversation.participants.find(
          (pp) => pp.userId !== userId,
        );
        const lastMsg = p.conversation.messages[0];
        return {
          id: p.conversation.id,
          username: other?.user.username ?? "Unknown",
          avatarUrl: other?.user.avatarUrl ?? null,
          lastMessage: lastMsg?.text ?? null,
          lastMessageAt:
            lastMsg?.createdAt.toISOString() ??
            p.conversation.updatedAt.toISOString(),
          unread:
            !p.lastReadAt ||
            (lastMsg ? lastMsg.createdAt > p.lastReadAt : false),
          isGroup: p.conversation.isGroup,
          participants: other?.user.username ?? "Unknown",
        };
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const { participantIds, isGroup, name } = await req.json();

    if (!participantIds?.length) {
      return NextResponse.json(
        { error: "At least one participant is required" },
        { status: 400 },
      );
    }

    if (!isGroup && participantIds.length === 1) {
      const existing = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [
            { participants: { some: { userId } } },
            { participants: { some: { userId: participantIds[0] } } },
          ],
        },
      });
      if (existing) {
        return NextResponse.json({ id: existing.id });
      }
    }

    const allIds = [userId, ...participantIds];

    const conversation = await prisma.conversation.create({
      data: {
        isGroup: isGroup ?? false,
        name: name ?? null,
        participants: {
          create: allIds.map((id) => ({ userId: id })),
        },
      },
    });

    return NextResponse.json({ id: conversation.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 },
    );
  }
}
