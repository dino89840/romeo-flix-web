import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Movie } from "./types";

export async function getDB(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

export async function getEnv(): Promise<CloudflareEnv> {
  const { env } = await getCloudflareContext({ async: true });
  return env as CloudflareEnv;
}

export async function getMovieById(
  id: string,
  includePrivate = false
): Promise<Movie | null> {
  const db = await getDB();

  const sql = includePrivate
    ? "SELECT * FROM movies WHERE id = ? LIMIT 1"
    : "SELECT * FROM movies WHERE id = ? AND published = 1 LIMIT 1";

  return (await db.prepare(sql).bind(id).first<Movie>()) ?? null;
}
