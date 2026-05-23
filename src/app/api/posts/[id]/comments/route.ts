import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized, notFound } from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  const { id: postId } = await params;
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (!userId && !isDev) return unauthorized();

  if (isDev) {
    const comments = Array.from({ length: 3 }, (_, i) => ({
      id: `mc-${i}`,
      text: `Sample comment #${i + 1}`,
      username: `commenter_${i + 1}`,
      avatarUrl: null,
      createdAt: new Date(Date.now() - i * 60000).toISOString(),
    }));
    return NextResponse.json({ comments, nextCursor: null });
  }

  if (!userId) return unauthorized();

  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 10,
    50,
  );

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    const hasMore = comments.length > limit;
    const items = hasMore ? comments.slice(0, limit) : comments;

    return NextResponse.json({
      comments: items.map((c) => ({
        id: c.id,
        text: c.text,
        username: c.user.username,
        avatarUrl: c.user.avatarUrl,
        createdAt: c.createdAt.toISOString(),
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getSessionUserId();
  const { id: postId } = await params;
  if (!userId) return unauthorized();

  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 },
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId, isDeleted: false },
      select: { id: true },
    });
    if (!post) return notFound("Post not found");

    const comment = await prisma.$transaction(async (tx) => {
      const created = await tx.comment.create({
        data: { postId, userId, text: text.trim() },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: { commentCount: { increment: 1 } },
      });

      return created;
    });

    return NextResponse.json(
      {
        id: comment.id,
        text: comment.text,
        username: comment.user.username,
        avatarUrl: comment.user.avatarUrl,
        createdAt: comment.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
