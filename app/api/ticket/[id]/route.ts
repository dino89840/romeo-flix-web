import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { createMediaSignature } from "@/lib/media";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const mode =
    request.nextUrl.searchParams.get("mode") === "download"
      ? "download"
      : "stream";

  const db = await getDB();

  const movie = await db
    .prepare("SELECT id FROM movies WHERE id = ? AND published = 1 LIMIT 1")
    .bind(id)
    .first<{ id: string }>();

  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 2;
  const signature = await createMediaSignature(id, mode, expires);

  if (mode === "stream") {
    await db
      .prepare("UPDATE movies SET views = views + 1 WHERE id = ?")
      .bind(id)
      .run();
  }

  const url = `/api/media/${id}?mode=${mode}&expires=${expires}&signature=${encodeURIComponent(signature)}`;

  return NextResponse.json(
    { url, expires },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0"
      }
    }
  );
}
