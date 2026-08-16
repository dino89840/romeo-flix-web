import { redirect } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";
import { isAdmin } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { Movie } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const db = await getDB();
  const movies = (
    await db
      .prepare("SELECT * FROM movies ORDER BY created_at DESC LIMIT 500")
      .all<Movie>()
  ).results;

  return <AdminPanel initialMovies={movies} />;
}
