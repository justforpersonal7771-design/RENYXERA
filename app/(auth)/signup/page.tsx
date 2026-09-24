"use client";

import { SignupForm } from "@/components/auth/signup-form";

/**
 * Standalone route, kept alongside the AuthModal (components/auth/auth-modal.tsx) for
 * deep links that need a real URL to land on. The everyday in-app entry point is the
 * modal (opened from the topbar's AccountButton, or by switching modes from the login
 * modal), which renders this same SignupForm without a page navigation.
 *
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
  return (
    <div className="card-glass rounded-2xl p-6 sm:p-8">
      <SignupForm />
    </div>
  );
}
