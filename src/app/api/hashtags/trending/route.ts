import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";
  if (isDev) {
    return NextResponse.json({
      hashtags: Array.from({ length: 10 }, (_, i) => ({
        id: `tag-${i}`,
        name: [
          "love",
          "instagood",
          "photooftheday",
          "fashion",
          "beautiful",
          "art",
          "nature",
          "travel",
          "happy",
          "picoftheday",
        ][i],
        postCount: Math.floor(Math.random() * 1000000),
      })),
    });
  }

  try {
    const hashtags = await prisma.hashtag.findMany({
      orderBy: { postCount: "desc" },
      take: 20,
    });

    return NextResponse.json({
      hashtags: hashtags.map((h) => ({
        id: h.id,
        name: h.name,
        postCount: h.postCount,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch trending hashtags" },
      { status: 500 },
    );
  }
}
