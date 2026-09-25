"use client";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

/**
 * Standalone route, kept for deep links (e.g. a "reset password" link from an email or
 * bookmark) — the everyday entry point is the AuthModal's "forgot" mode (reached via
 * the login modal's "Forgot?" link), which renders this same ForgotPasswordForm without
 * a page navigation. See app/(auth)/login/page.tsx for the same pattern.
 */
export default function ResetPasswordPage() {
  return (
    <div className="card-glass rounded-2xl p-6 sm:p-8">
      <ForgotPasswordForm />
    </div>
  );
}
