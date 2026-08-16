import Link from "next/link";
import { Clock, Eye, Play } from "lucide-react";
import { notFound } from "next/navigation";
import DownloadButton from "@/components/DownloadButton";
import { getDB } from "@/lib/db";
import type { Movie } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MoviePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await getDB();

  const movie = await db
    .prepare(
      `SELECT id, slug, title, original_title, description,
              poster_url, backdrop_url, download_name, category,
              year, duration_min, quality, published, featured,
              views, created_at, updated_at
       FROM movies
       WHERE slug = ? AND published = 1
       LIMIT 1`
    )
    .bind(slug)
    .first<Movie>();

  if (!movie) notFound();

  return (
    <main className="detail-page">
      <div
        className="detail-backdrop"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5,6,12,.35), #05060c 92%), url("${movie.backdrop_url || movie.poster_url}")`
        }}
      />

      <section className="detail-content">
        <img className="detail-poster" src={movie.poster_url} alt={movie.title} />

        <div className="detail-copy">
          <span className="hero-pill">{movie.category.toUpperCase()}</span>
          <h1>{movie.title}</h1>

          {movie.original_title && <h3>{movie.original_title}</h3>}

          <div className="detail-meta">
            <span>{movie.year}</span>
            <span>{movie.quality}</span>
            <span><Clock size={16} /> {movie.duration_min ?? "—"} min</span>
            <span><Eye size={16} /> {movie.views.toLocaleString()}</span>
          </div>

          <p>{movie.description}</p>

          <div className="hero-actions">
            <Link href={`/watch/${movie.id}`} className="primary-action">
              <Play size={20} fill="currentColor" /> Watch Now
            </Link>

            <DownloadButton id={movie.id} />
          </div>
        </div>
      </section>
    </main>
  );
}
