import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { getDB } from "@/lib/db";
import type { Movie } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const db = await getDB();

  const query = q.trim();

  const movies = query
    ? (
        await db
          .prepare(
            `SELECT id, slug, title, original_title, description,
                    poster_url, backdrop_url, download_name, category,
                    year, duration_min, quality, published, featured,
                    views, created_at, updated_at
             FROM movies
             WHERE published = 1
               AND (title LIKE ? OR original_title LIKE ? OR description LIKE ?)
             ORDER BY created_at DESC
             LIMIT 60`
          )
          .bind(`%${query}%`, `%${query}%`, `%${query}%`)
          .all<Movie>()
      ).results
    : (
        await db
          .prepare(
            `SELECT id, slug, title, original_title, description,
                    poster_url, backdrop_url, download_name, category,
                    year, duration_min, quality, published, featured,
                    views, created_at, updated_at
             FROM movies
             WHERE published = 1
             ORDER BY featured DESC, created_at DESC
             LIMIT 48`
          )
          .all<Movie>()
      ).results;

  const featured = movies.find((movie) => movie.featured) ?? movies[0];

  return (
    <main>
      {!query && featured && (
        <section
          className="hero"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(5,6,12,.98) 5%, rgba(5,6,12,.72) 48%, rgba(5,6,12,.2)), url("${featured.backdrop_url || featured.poster_url}")`
          }}
        >
          <div className="hero-content">
            <span className="hero-pill">
              <Sparkles size={15} /> Featured Premiere
            </span>

            <h1>{featured.title}</h1>

            <p>{featured.description || "Watch the latest movie on Romeo Flix."}</p>

            <div className="hero-meta">
              <span>{featured.year}</span>
              <span>{featured.quality}</span>
              <span>{featured.category.toUpperCase()}</span>
            </div>

            <div className="hero-actions">
              <Link href={`/watch/${featured.id}`} className="primary-action">
                <Play size={20} fill="currentColor" /> Watch Now
              </Link>

              <Link
                href={`/movie/${featured.slug}`}
                className="secondary-action"
              >
                More Details <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="content-shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {query ? "SEARCH RESULTS" : "JUST ADDED"}
            </span>
            <h2>{query ? `Results for “${query}”` : "Latest Movies"}</h2>
          </div>
        </div>

        {movies.length ? (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">Movie မတွေ့ပါ။</div>
        )}
      </section>
    </main>
  );
}
