import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    });
    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: {
          userId,
          likes: true,
          comments: true,
          follows: true,
          dms: true,
          reminders: true,
        },
      });
    }
    return NextResponse.json({
      likes: prefs.likes,
      comments: prefs.comments,
      follows: prefs.follows,
      dms: prefs.dms,
      reminders: prefs.reminders,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const body = await req.json();
    await prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, ...body },
      update: body,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
