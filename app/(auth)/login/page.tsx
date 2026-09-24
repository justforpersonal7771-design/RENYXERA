"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

/**
 * ⚠️ This page is complete and typechecked/build-verified, but the actual sign-in
 * round-trip against Supabase's servers has NOT been live-tested yet — there is no
 * Supabase project configured as of this commit (env vars unset), so
 * `createClient()`/`signInWithPassword` cannot be exercised end-to-end until one
 * exists. Re-verify against the real project once NEXT_PUBLIC_SUPABASE_URL is set.
 *
 * Not yet linked from the app's navigation (topbar) — reachable by URL only, so it
 * can't be reached from a currently-live page until it's verified working.
 */
export default function LoginPage() {
  // useSearchParams() opts the subtree into client-side rendering during static
  // export, which Next.js requires to be wrapped in Suspense (it bails out of
  // prerendering that subtree at build time) — without this, `next build` fails.
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFormSkeleton() {
  return <div className="card-glass rounded-2xl p-6 sm:p-8 h-[420px] animate-pulse" />;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Something went wrong while configuring sign-in. Is Supabase set up yet?");
      setLoading(false);
    }
  }

  return (
    <div className="card-glass rounded-2xl p-6 sm:p-8">
      <h1 className="text-xl font-display font-bold text-[var(--text-primary)] mb-1">Welcome back</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">Sign in to sync your progress across devices.</p>

      <GoogleAuthButton onError={setError} />

      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">or</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-xs font-bold text-[var(--text-secondary)]">
              Password
            </label>
            <Link href="/reset-password" className="text-xs font-semibold text-[var(--accent)] hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)] font-bold text-sm px-4 py-2.5 transition-colors disabled:opacity-50 disabled:pointer-events-none mt-1"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-[var(--accent)] hover:underline">
          Create an account
        </Link>
      </p>
      <p className="text-center text-xs text-[var(--text-muted)] mt-3">
        <Link href="/" className="hover:text-[var(--text-secondary)] hover:underline">
          Continue as guest instead
        </Link>
      </p>
    </div>
  );
}
