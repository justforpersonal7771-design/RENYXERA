"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/** Google's official four-color "G" mark, per their brand guidelines for sign-in
 *  buttons — an inline SVG rather than an image asset to avoid an extra network
 *  request for something this small. */
function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  );
}

/**
 * "Continue with Google" — the expected majority auth path for this audience (master
 * plan §4C: engineering students overwhelmingly already have a Google account).
 *
 * ⚠️ Needs live Supabase + Google OAuth configuration to actually complete a sign-in —
 * that's an account-owner step (Supabase Dashboard → Authentication → Providers →
 * Google, plus a Google Cloud OAuth client). Until then this renders and is clickable,
 * but `signInWithOAuth` will return an error from Supabase, surfaced via `onError`.
 */
export function GoogleAuthButton({
  label = "Continue with Google",
  onError,
}: {
  label?: string;
  onError?: (message: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  // If the browser navigated to Google and the user comes back via the back button
  // (rather than completing sign-in), Chrome/Firefox often restore this page from
  // bfcache instead of reloading it — resurrecting whatever React state was frozen
  // at the moment of navigating away, including the `loading: true` set right before
  // the redirect. Nothing else ever resets it after that, so the button is stuck
  // spinning forever. `pageshow`'s `persisted` flag is the standard signal for "this
  // page came back from bfcache, not a fresh load" — reset loading when it fires.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setLoading(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function handleClick() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        onError?.(error.message);
        setLoading(false);
      }
      // On success, Supabase redirects the browser away to Google — nothing left to do
      // here, and setLoading(false) deliberately doesn't run on that path (the
      // component unmounts via navigation before it would matter).
    } catch (err: any) {
      onError?.(err?.message || "Could not start Google sign-in.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-secondary)] text-[var(--text-primary)] font-semibold text-sm px-4 py-2.5 transition-colors disabled:opacity-50 disabled:pointer-events-none"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleGlyph />}
      {label}
    </button>
  );
}
