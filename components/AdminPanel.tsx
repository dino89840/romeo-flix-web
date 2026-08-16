"use client";

import { useMemo, useState } from "react";
import { Film, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import type { Movie } from "@/lib/types";

const emptyForm = {
  id: "",
  title: "",
  original_title: "",
  slug: "",
  description: "",
  poster_url: "",
  backdrop_url: "",
  source_url: "",
  download_name: "",
  category: "mmsub",
  year: "",
  duration_min: "",
  quality: "1080p",
  published: true,
  featured: false
};

export default function AdminPanel({
  initialMovies
}: {
  initialMovies: Movie[];
}) {
  const [movies, setMovies] = useState(initialMovies);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const editing = Boolean(form.id);

  const sorted = useMemo(
    () => [...movies].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [movies]
  );

  function edit(movie: Movie) {
    setForm({
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      slug: movie.slug,
      description: movie.description,
      poster_url: movie.poster_url,
      backdrop_url: movie.backdrop_url,
      source_url: movie.source_url ?? "",
      download_name: movie.download_name,
      category: movie.category,
      year: movie.year?.toString() ?? "",
      duration_min: movie.duration_min?.toString() ?? "",
      quality: movie.quality,
      published: Boolean(movie.published),
      featured: Boolean(movie.featured)
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const url = editing
      ? `/api/admin/movies/${form.id}`
      : "/api/admin/movies";

    const response = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        year: form.year ? Number(form.year) : null,
        duration_min: form.duration_min ? Number(form.duration_min) : null
      })
    });

    const data = await response.json().catch(() => null);
    setSaving(false);

    if (!response.ok) {
      alert(data?.error ?? "Save failed");
      return;
    }

    const movie = data.movie as Movie;

    setMovies((current) =>
      editing
        ? current.map((item) => (item.id === movie.id ? movie : item))
        : [movie, ...current]
    );

    setForm(emptyForm);
  }

  async function remove(id: string) {
    if (!confirm("ဒီ movie ကို အပြီးဖျက်မှာ သေချာပါသလား?")) return;

    const response = await fetch(`/api/admin/movies/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      setMovies((current) => current.filter((movie) => movie.id !== id));
      if (form.id === id) setForm(emptyForm);
    }
  }

  return (
    <main className="admin-layout">
      <div className="admin-topbar">
        <div>
          <span className="eyebrow">CONTROL CENTER</span>
          <h1>Romeo Flix Admin</h1>
        </div>

        <form action="/api/admin/logout" method="post">
          <button className="danger-ghost">
            <LogOut size={17} /> Logout
          </button>
        </form>
      </div>

      <section className="admin-grid">
        <form className="admin-form panel" onSubmit={save}>
          <div className="panel-heading">
            {editing ? <Pencil /> : <Plus />}
            <h2>{editing ? "Edit Movie" : "Add Movie"}</h2>
          </div>

          <label>
            Movie title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <label>
            Original title
            <input
              value={form.original_title}
              onChange={(e) =>
                setForm({ ...form, original_title: e.target.value })
              }
            />
          </label>

          <label>
            Slug
            <input
              required
              pattern="[a-z0-9-]+"
              placeholder="the-movie-name"
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                    .replace(/-+/g, "-")
                })
              }
            />
          </label>

          <label>
            Description
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>

          <label>
            Poster URL
            <input
              required
              type="url"
              value={form.poster_url}
              onChange={(e) =>
                setForm({ ...form, poster_url: e.target.value })
              }
            />
          </label>

          <label>
            Backdrop URL
            <input
              type="url"
              value={form.backdrop_url}
              onChange={(e) =>
                setForm({ ...form, backdrop_url: e.target.value })
              }
            />
          </label>

          <label>
            Private direct video URL
            <input
              required
              type="url"
              placeholder="https://media.example.com/movie.mp4"
              value={form.source_url}
              onChange={(e) =>
                setForm({ ...form, source_url: e.target.value })
              }
            />
          </label>

          <label>
            Download filename
            <input
              placeholder="Romeo-Flix-Movie.mp4"
              value={form.download_name}
              onChange={(e) =>
                setForm({ ...form, download_name: e.target.value })
              }
            />
          </label>

          <div className="form-row">
            <label>
              Category
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="mmsub">MMSub</option>
                <option value="nosub">NoSub</option>
                <option value="random">Random</option>
              </select>
            </label>

            <label>
              Quality
              <input
                value={form.quality}
                onChange={(e) =>
                  setForm({ ...form, quality: e.target.value })
                }
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Year
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </label>

            <label>
              Duration
              <input
                type="number"
                value={form.duration_min}
                onChange={(e) =>
                  setForm({ ...form, duration_min: e.target.value })
                }
              />
            </label>
          </div>

          <div className="check-row">
            <label>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Published
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
              />
              Featured
            </label>
          </div>

          <div className="admin-actions">
            <button className="primary-action" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Movie" : "Add Movie"}
            </button>

            {editing && (
              <button
                type="button"
                className="secondary-action"
                onClick={() => setForm(emptyForm)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="panel movie-manager">
          <div className="panel-heading">
            <Film />
            <h2>Movies ({movies.length})</h2>
          </div>

          <div className="admin-movie-list">
            {sorted.map((movie) => (
              <article className="admin-movie-item" key={movie.id}>
                <img src={movie.poster_url} alt="" />

                <div>
                  <strong>{movie.title}</strong>
                  <small>
                    {movie.category} · {movie.quality} ·{" "}
                    {movie.published ? "Published" : "Draft"}
                  </small>
                </div>

                <button onClick={() => edit(movie)} aria-label="Edit">
                  <Pencil size={17} />
                </button>

                <button
                  className="delete-button"
                  onClick={() => remove(movie.id)}
                  aria-label="Delete"
                >
                  <Trash2 size={17} />
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
