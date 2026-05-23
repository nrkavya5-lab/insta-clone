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
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) return notFound("Report not found");

  await prisma.report.update({
    where: { id },
    data: { status: "resolved", resolvedAt: new Date(), resolvedById: userId },
  });

  return NextResponse.json({ success: true });
}
