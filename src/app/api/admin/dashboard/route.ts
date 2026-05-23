import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isVerified: true },
  });
  if (!user?.isVerified)
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );

  const [
    totalUsers,
    totalPosts,
    totalComments,
    pendingReports,
    bannedUsers,
    verifiedUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count({ where: { isDeleted: false } }),
    prisma.comment.count(),
    prisma.report.count({ where: { status: "pending" } }),
    prisma.user.count({ where: { isBanned: true } }),
    prisma.user.count({ where: { isVerified: true } }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalPosts,
    totalComments,
    pendingReports,
    bannedUsers,
    verifiedUsers,
  });
}
