"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

/**
 * Mounted once in client-layout.tsx (dashboard shell only — the standalone /login and
 * /signup routes under (auth) render LoginForm/SignupForm directly, without this
 * wrapper, since they need to work as real pages for deep links, password-reset
 * redirects, and the OAuth callback flow). This is the everyday entry point: clicking
 * "Sign In" in the topbar opens this instead of navigating away from whatever the user
 * was doing.
 */
export function AuthModal() {
  const { isOpen, mode, redirectTo, close, setMode } = useAuthModalStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-md"
      onClick={close}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl p-7 sm:p-8 backdrop-blur-2xl bg-gradient-to-br from-white/95 via-indigo-50/95 to-fuchsia-50/95 dark:from-zinc-900/95 dark:via-indigo-950/95 dark:to-fuchsia-950/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_30px_80px_-24px_rgba(79,70,229,0.55)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_80px_-24px_rgba(0,0,0,0.8)]"
      >
        {/* Brand ribbon accent + soft color glows behind the glass */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#06c2fb] via-[#5b21e0] to-[#dd42fb]" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-16 w-56 h-56 rounded-full bg-cyan-400/25 dark:bg-cyan-500/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-fuchsia-400/25 dark:bg-fuchsia-600/15 blur-3xl" />

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark-light.png" alt="" className="h-9 w-auto mb-4 dark:hidden drop-shadow-[0_4px_14px_rgba(79,70,229,0.35)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark-dark.png" alt="" className="h-9 w-auto mb-4 hidden dark:block drop-shadow-[0_4px_14px_rgba(79,70,229,0.35)]" />

          {mode === "login" ? (
            <LoginForm
              redirectTo={redirectTo}
              onSuccess={close}
              onSwitchToSignup={() => setMode("signup")}
              onDismiss={close}
            />
          ) : (
            <SignupForm onSwitchToLogin={() => setMode("login")} onDismiss={close} />
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
