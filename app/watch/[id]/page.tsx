import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { getMovieById } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function WatchPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(id);

  if (!movie) notFound();

  return (
    <main className="watch-page">
      <div className="watch-heading">
        <Link href={`/movie/${movie.slug}`}>
          <ArrowLeft size={18} /> Back
        </Link>
        <div>
          <h1>{movie.title}</h1>
          <p>Secure temporary stream</p>
        </div>
      </div>

      <VideoPlayer
        id={movie.id}
        poster={movie.backdrop_url || movie.poster_url}
      />

      <section className="watch-description">
        <span className="quality-badge static">{movie.quality}</span>
        <span className="category-badge static">{movie.category}</span>
        <p>{movie.description}</p>
      </section>
    </main>
  );
}
