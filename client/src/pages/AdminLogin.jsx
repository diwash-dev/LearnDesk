
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <ShieldCheck size={24} />
            </div>

            <h1 className="text-2xl font-bold text-ink">Admin Login</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to manage academic resources
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-ink"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-ink"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border border-line bg-white px-3 pr-11 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-brand-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-700 text-sm font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              <LockKeyhole size={17} />
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Admin access only
          </p>
        </div>
      </div>
    </main>
  );
}
