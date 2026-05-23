import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  const q = req.nextUrl.searchParams.get("q") ?? "";
  const type = req.nextUrl.searchParams.get("type") ?? "all";

  if (!q.trim()) {
    return NextResponse.json({ users: [], hashtags: [] });
  }

  if (isDev) {
    const mockUsers = Array.from({ length: 5 }, (_, i) => ({
      id: `search-user-${i}`,
      username: `${q}_user${i + 1}`,
      name: `User ${i + 1}`,
      avatarUrl: null,
      isPrivate: i === 3,
      isVerified: i === 0,
      relation: (i === 1 ? "following" : "none") as "following" | "none",
    }));
    const mockHashtags = Array.from({ length: 3 }, (_, i) => ({
      id: `search-tag-${i}`,
      name: `${q}${i + 1}`,
      postCount: Math.floor(Math.random() * 5000),
    }));
    return NextResponse.json({ users: mockUsers, hashtags: mockHashtags });
  }

  if (!userId) return unauthorized();

  try {
    const [users, hashtags] = await Promise.all([
      type !== "hashtags"
        ? prisma.user.findMany({
            where: {
              OR: [
                { username: { contains: q, mode: "insensitive" } },
                { name: { contains: q, mode: "insensitive" } },
              ],
            },
            take: 10,
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
              isPrivate: true,
              isVerified: true,
              followers: {
                where: { followerId: userId },
                select: { id: true, status: true },
              },
            },
          })
        : Promise.resolve([]),
      type !== "users"
        ? prisma.hashtag.findMany({
            where: { name: { contains: q, mode: "insensitive" } },
            take: 10,
            orderBy: { postCount: "desc" },
          })
        : Promise.resolve([]),
    ]);

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        avatarUrl: u.avatarUrl,
        isPrivate: u.isPrivate,
        isVerified: u.isVerified,
        relation:
          u.followers.length > 0
            ? u.followers[0].status === "pending"
              ? ("pending" as const)
              : ("following" as const)
            : ("none" as const),
      })),
      hashtags: hashtags.map((h) => ({
        id: h.id,
        name: h.name,
        postCount: h.postCount,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
