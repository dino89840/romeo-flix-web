import Link from "next/link";
import { Play, Star } from "lucide-react";
import type { Movie } from "@/lib/types";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movie/${movie.slug}`} className="movie-card">
      <div className="poster-wrap">
        <img
          src={movie.poster_url}
          alt={movie.title}
          loading="lazy"
          className="poster"
        />

        <div className="card-overlay">
          <span className="play-orb">
            <Play size={23} fill="currentColor" />
          </span>
        </div>

        <span className="quality-badge">{movie.quality}</span>
        <span className="category-badge">{movie.category}</span>
      </div>

      <div className="card-info">
        <h3>{movie.title}</h3>
        <div className="card-meta">
          <span>{movie.year ?? "—"}</span>
          <span>•</span>
          <span>{movie.duration_min ? `${movie.duration_min} min` : "Movie"}</span>
          <Star size={13} fill="currentColor" />
        </div>
      </div>
    </Link>
  );
}
