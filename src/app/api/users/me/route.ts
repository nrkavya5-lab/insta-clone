import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, unauthorized } from "@/lib/auth-helpers";

export async function PUT(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    const { name, username, bio, website, gender } = await req.json();

    if (username) {
      const existing = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (existing && existing.id !== userId) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 },
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name, username, bio, website, gender },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        website: true,
        avatarUrl: true,
        gender: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
