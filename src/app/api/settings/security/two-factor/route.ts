import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true, twoFactorSecret: "placeholder-secret" },
    });
    return NextResponse.json({ enabled: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });
    return NextResponse.json({ enabled: false });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
