export type Category = "mmsub" | "nosub" | "random";

export interface Movie {
  id: string;
  slug: string;
  title: string;
  original_title: string;
  description: string;
  poster_url: string;
  backdrop_url: string;
  source_url?: string;
  download_name: string;
  category: Category;
  year: number | null;
  duration_min: number | null;
  quality: string;
  published: number;
  featured: number;
  views: number;
  created_at: string;
  updated_at: string;
}
