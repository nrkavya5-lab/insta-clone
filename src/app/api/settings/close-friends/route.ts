import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const friends = await prisma.closeFriend.findMany({
      where: { userId },
      include: {
        closeFriend: {
          select: { id: true, username: true, name: true, avatarUrl: true },
        },
      },
    });
    return NextResponse.json({ users: friends.map((f) => f.closeFriend) });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const { userId: friendId } = await req.json();
    await prisma.closeFriend.upsert({
      where: { userId_closeFriendId: { userId, closeFriendId: friendId } },
      create: { userId, closeFriendId: friendId },
      update: {},
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
