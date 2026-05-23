import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isPrivate: true },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
