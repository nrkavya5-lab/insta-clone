import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  const { id: conversationId } = await params;
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";

  if (!userId && !isDev) return unauthorized();

  if (isDev) {
    const mockUsers = ["user_1", "user_2", "user_3", "user_4"];
    const mockSender = userId || "dev-user";
    const otherUser = mockUsers.find((u) => u !== mockSender) || mockUsers[0];

    return NextResponse.json({
      messages: Array.from({ length: 8 }, (_, i) => ({
        id: `msg-dev-${i}`,
        text: [
          "Hey! How are you? 😊",
          "I'm doing great, thanks!",
          "Have you seen the new update? 🔥",
          "Not yet, what's new?",
          "They added dark mode and it looks amazing! 🌙",
          "That's awesome! I'll check it out.",
          "Want to grab coffee later? ☕",
          "Sure, sounds great! 🎉",
        ][i],
        mediaUrl: null,
        senderId: i % 2 === 0 ? otherUser : (userId || "dev-user"),
        createdAt: new Date(Date.now() - (8 - i) * 300000).toISOString(),
      })),
      nextCursor: null,
    });
  }

  if (!userId) return unauthorized();

  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 50,
    100,
  );

  try {
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant) return notFound("Conversation not found");

    const messages = await prisma.message.findMany({
      where: { conversationId, isDeleted: false },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        text: true,
        mediaUrl: true,
        senderId: true,
        createdAt: true,
      },
    });

    const hasMore = messages.length > limit;
    const items = hasMore ? messages.slice(0, limit) : messages;

    return NextResponse.json({
      messages: items.reverse().map((m) => ({
        id: m.id,
        text: m.text,
        mediaUrl: m.mediaUrl,
        senderId: m.senderId,
        createdAt: m.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? items[0].id : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id: conversationId } = await params;

  try {
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant) return notFound("Conversation not found");

    const { text, mediaUrl } = await req.json();

    if (!text?.trim() && !mediaUrl) {
      return NextResponse.json(
        { error: "Message text or media is required" },
        { status: 400 },
      );
    }

    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: {
          conversationId,
          senderId: userId,
          text: text?.trim() ?? null,
          mediaUrl,
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return msg;
    });

    return NextResponse.json(
      {
        id: message.id,
        text: message.text,
        mediaUrl: message.mediaUrl,
        senderId: message.senderId,
        createdAt: message.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
