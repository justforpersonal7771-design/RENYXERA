"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

/**
 * ⚠️ Same status note as app/(auth)/login/page.tsx — built and build-verified, but the
 * actual signUp() round-trip needs a live Supabase project to test end-to-end.
 *
 * Deliberately does NOT attempt to migrate any existing guest (local-only) IndexedDB
 * data on signup yet — that migration is Module 4D ("Guest Walkthrough / Teaser Mode")
 * and needs the per-user namespacing plumbing (already built — see
 * lib/repository/storage/idb-manager.ts's setActiveNamespace) to be wired to a real
 * post-signup hook, which belongs with the rest of the guest-mode flow, not bolted on
 * here in isolation.
 */
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong while configuring sign-up. Is Supabase set up yet?");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card-glass rounded-2xl p-6 sm:p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <h1 className="text-lg font-display font-bold text-[var(--text-primary)] mb-1.5">Check your inbox</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          We sent a confirmation link to <span className="font-semibold text-[var(--text-primary)]">{email}</span>.
          Click it to finish creating your account.
        </p>
        <Link href="/login" className="inline-block mt-5 text-sm font-semibold text-[var(--accent)] hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="card-glass rounded-2xl p-6 sm:p-8">
      <h1 className="text-xl font-display font-bold text-[var(--text-primary)] mb-1">Create your account</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">Free forever, on the free plan — upgrade only if you want to.</p>

      <GoogleAuthButton label="Continue with Google" onError={setError} />

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
          <label htmlFor="password" className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              placeholder="At least 8 characters"
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
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--accent)] hover:underline">
          Sign in
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
