import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { validateMediaOrigin } from "@/lib/media";
import type { Movie } from "@/lib/types";

type MovieRequestBody = {
  title?: string;
  slug?: string;
  original_title?: string;
  description?: string;
  poster_url?: string;
  backdrop_url?: string;
  source_url?: string;
  download_name?: string;
  category?: string;
  year?: number | null;
  duration_min?: number | null;
  quality?: string;
  published?: boolean;
  featured?: boolean;
};

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as MovieRequestBody;

  if (!body.title || !body.slug || !body.poster_url || !body.source_url) {
    return NextResponse.json(
      { error: "Required fields are missing" },
      { status: 400 }
    );
  }

  if (!(await validateMediaOrigin(body.source_url))) {
    return NextResponse.json(
      { error: "Video host is not included in MEDIA_HOSTS" },
      { status: 400 }
    );
  }

  const db = await getDB();

  try {
    await db
      .prepare(
        `UPDATE movies SET
          slug = ?,
          title = ?,
          original_title = ?,
          description = ?,
          poster_url = ?,
          backdrop_url = ?,
          source_url = ?,
          download_name = ?,
          category = ?,
          year = ?,
          duration_min = ?,
          quality = ?,
          published = ?,
          featured = ?,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(
        body.slug,
        body.title,
        body.original_title ?? "",
        body.description ?? "",
        body.poster_url,
        body.backdrop_url ?? "",
        body.source_url,
        body.download_name ?? "",
        body.category,
        body.year ?? null,
        body.duration_min ?? null,
        body.quality ?? "HD",
        body.published ? 1 : 0,
        body.featured ? 1 : 0,
        id
      )
      .run();

    const movie = await db
      .prepare("SELECT * FROM movies WHERE id = ?")
      .bind(id)
      .first<Movie>();

    return NextResponse.json({ movie });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const db = await getDB();

  await db.prepare("DELETE FROM movies WHERE id = ?").bind(id).run();

  return NextResponse.json({ success: true });
}
