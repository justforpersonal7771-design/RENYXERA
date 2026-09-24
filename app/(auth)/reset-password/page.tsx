"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Requests a password-reset email. This is the "request" half only — clicking the
 * emailed link takes the user to /auth/callback with a recovery token, which currently
 * redirects home. The "set a new password" landing screen is a small follow-up once
 * this is live-tested; not building it speculatively before a real reset email can be
 * sent and its exact link shape observed against a live Supabase project.
 *
 * ⚠️ Not yet live-tested — see the note in app/(auth)/login/page.tsx.
 */
export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password/confirm`,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Is Supabase set up yet?");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card-glass rounded-2xl p-6 sm:p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <h1 className="text-lg font-display font-bold text-[var(--text-primary)] mb-1.5">Check your inbox</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          If an account exists for <span className="font-semibold text-[var(--text-primary)]">{email}</span>, a reset link is on its way.
        </p>
        <Link href="/login" className="inline-block mt-5 text-sm font-semibold text-[var(--accent)] hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="card-glass rounded-2xl p-6 sm:p-8">
      <h1 className="text-xl font-display font-bold text-[var(--text-primary)] mb-1">Reset your password</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">We'll email you a link to set a new one.</p>

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
          Send reset link
        </button>
      </form>

      <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
        <Link href="/login" className="font-semibold text-[var(--accent)] hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
