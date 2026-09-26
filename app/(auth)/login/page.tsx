"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

/**
 * Standalone route, kept alongside the AuthModal (components/auth/auth-modal.tsx) for
 * deep links and redirects that need a real URL to land on — a shared "sign in to
 * continue" link, a bookmark, or /reset-password's own "back to sign in" link. The
 * everyday in-app entry point is the modal (opened from the topbar's AccountButton),
 * which renders this same LoginForm without a page navigation.
 *
 * ⚠️ Build-verified but the actual sign-in round-trip against Supabase's servers
 * depends on a live, configured Supabase project.
 */
export default function LoginPage() {
  // useSearchParams() opts the subtree into client-side rendering during static
  // export, which Next.js requires to be wrapped in Suspense (it bails out of
  // prerendering that subtree at build time) — without this, `next build` fails.
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginFormSkeleton() {
  return <div className="card-glass rounded-2xl p-6 sm:p-8 h-[420px] animate-pulse" />;
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [linkError, setLinkError] = useState<string | null>(null);

  // Auth links that fail land here with the reason in the query (?error=) and/or the
  // hash (#error_code=otp_expired&error_description=…). Show it in plain words instead
  // of leaving the reason only in the address bar.
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const code = hash.get("error_code") || "";
    const raw = hash.get("error_description") || searchParams.get("error") || "";
    if (!code && !raw) return;
    setLinkError(
      code === "otp_expired" || /expired|invalid/i.test(raw)
        ? "That email link has expired or was already used. Request a new one below — links work once, for a limited time, in the same browser you requested them from."
        : raw === "Missing auth code"
          ? "That link was incomplete. Request a new one and open it from the latest email."
          : raw
    );
  }, [searchParams]);

  return (
    <div className="card-glass rounded-2xl p-6 sm:p-8">
      {linkError && (
        <div role="alert" className="mb-5 flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {linkError}{" "}
            <Link href="/reset-password" className="font-semibold underline underline-offset-2">Send a new reset link</Link>
          </span>
        </div>
      )}
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
