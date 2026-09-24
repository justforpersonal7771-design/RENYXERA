"use client";

import { Suspense } from "react";
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

  return (
    <div className="card-glass rounded-2xl p-6 sm:p-8">
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
