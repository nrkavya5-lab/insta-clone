import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
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

  const status = req.nextUrl.searchParams.get("status") ?? "pending";
  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 20,
    50,
  );

  const where = { status };

  const reports = await prisma.report.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { id: true, username: true, avatarUrl: true } },
      post: { select: { id: true, mediaUrls: true, caption: true } },
      comment: { select: { id: true, text: true } },
    },
  });

  const nextCursor =
    reports.length > limit ? reports[reports.length - 1].id : null;
  if (nextCursor) reports.pop();

  return NextResponse.json(reports);
}
