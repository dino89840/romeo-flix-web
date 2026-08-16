import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { isAdmin } from "@/lib/auth";

export default async function AdminLogin({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");

  const { error } = await searchParams;

  return (
    <main className="login-page">
      <form action="/api/admin/login" method="post" className="login-card">
        <div className="login-icon">
          <LockKeyhole />
        </div>

        <span className="eyebrow">SECURE AREA</span>
        <h1>Admin Login</h1>

        {error && <p className="form-error">Username သို့ password မှားနေပါသည်။</p>}

        <label>
          Username
          <input name="username" required autoComplete="username" />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>

        <button className="primary-action">Sign in</button>
      </form>
    </main>
  );
}
