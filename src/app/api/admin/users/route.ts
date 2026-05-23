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

  const q = req.nextUrl.searchParams.get("q") ?? "";
  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 20,
    50,
  );

  const where = q
    ? {
        OR: [
          { username: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { name: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true } } },
  });

  const nextCursor = users.length > limit ? users[users.length - 1].id : null;
  if (nextCursor) users.pop();

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      name: u.name,
      avatarUrl: u.avatarUrl,
      isVerified: u.isVerified,
      isBanned: u.isBanned,
      postCount: u._count.posts,
      createdAt: u.createdAt.toISOString(),
    })),
  );
}
