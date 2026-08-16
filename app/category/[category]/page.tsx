import { notFound } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import { getDB } from "@/lib/db";
import type { Category, Movie } from "@/lib/types";

export const dynamic = "force-dynamic";

const categories: Category[] = ["mmsub", "nosub", "random"];

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!categories.includes(category as Category)) notFound();

  const db = await getDB();

  const movies = (
    await db
      .prepare(
        `SELECT id, slug, title, original_title, description,
                poster_url, backdrop_url, download_name, category,
                year, duration_min, quality, published, featured,
                views, created_at, updated_at
         FROM movies
         WHERE published = 1 AND category = ?
         ORDER BY featured DESC, created_at DESC
         LIMIT 80`
      )
      .bind(category)
      .all<Movie>()
  ).results;

  return (
    <main className="content-shell page-top">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ROMEO FLIX COLLECTION</span>
          <h1>{category.toUpperCase()}</h1>
        </div>
      </div>

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </main>
  );
}
