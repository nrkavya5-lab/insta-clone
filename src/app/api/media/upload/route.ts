import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const isDev = req.nextUrl.searchParams.get("__dev") === "1";

  if (isDev) {
    const formData = await req.formData();
    const mediaFiles = formData.getAll("media") as File[];
    const count = mediaFiles.length || 1;
    const urls = Array.from({ length: count }, (_, i) =>
      `https://picsum.photos/seed/create${Date.now()}_${i}/600/600`,
    );
    const mediaType = count > 1 ? "carousel" : "photo";
    return NextResponse.json({ urls, mediaType }, { status: 201 });
  }

  try {
    const formData = await req.formData();
    const mediaFiles = formData.getAll("media") as File[];

    if (mediaFiles.length === 0) {
      return NextResponse.json(
        { error: "No media files provided" },
        { status: 400 },
      );
    }

    const urls: string[] = [];
    for (const file of mediaFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const ext = file.name.split(".").pop() ?? "jpg";

      const { writeFile, mkdir } = await import("fs/promises");
      const { join } = await import("path");
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const filepath = join(uploadDir, `${filename}.${ext}`);
      await writeFile(filepath, buffer);
      urls.push(`/uploads/${filename}.${ext}`);
    }

    const allImages = mediaFiles.every((f) => f.type.startsWith("image/"));
    const mediaType = allImages
      ? mediaFiles.length > 1
        ? "carousel"
        : "photo"
      : "video";

    return NextResponse.json({ urls, mediaType }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 },
    );
  }
}
