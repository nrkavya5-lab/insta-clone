import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPrivate: true, activityStatus: true, allowTagging: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch privacy settings" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const body = await req.json();
    await prisma.user.update({ where: { id: userId }, data: body });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update privacy" },
      { status: 500 },
    );
  }
}
