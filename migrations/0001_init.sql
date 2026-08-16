PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  original_title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  poster_url TEXT NOT NULL,
  backdrop_url TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL,
  download_name TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK(category IN ('mmsub', 'nosub', 'random')),
  year INTEGER,
  duration_min INTEGER,
  quality TEXT NOT NULL DEFAULT 'HD',
  published INTEGER NOT NULL DEFAULT 1 CHECK(published IN (0, 1)),
  featured INTEGER NOT NULL DEFAULT 0 CHECK(featured IN (0, 1)),
  views INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_movies_category_published
ON movies(category, published, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_movies_featured
ON movies(featured, published, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_movies_slug
ON movies(slug);

CREATE INDEX IF NOT EXISTS idx_movies_created
ON movies(created_at DESC);
