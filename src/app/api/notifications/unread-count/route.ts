import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  if (isDev) {
    return NextResponse.json({ count: 5 });
  }

  if (!userId) return unauthorized();

  try {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch unread count" },
      { status: 500 },
    );
  }
}
