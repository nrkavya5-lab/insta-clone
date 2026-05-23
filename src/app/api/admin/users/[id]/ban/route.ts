import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const admin = await prisma.user.findUnique({
    where: { id: userId },
    select: { isVerified: true },
  });
  if (!admin?.isVerified)
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );

  const { id } = await params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return notFound("User not found");

  await prisma.user.update({
    where: { id },
    data: { isBanned: true, bannedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
