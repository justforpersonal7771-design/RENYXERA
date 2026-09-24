"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm card-glass rounded-2xl p-6 sm:p-8 shadow-xl animate-in zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

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
    </div>,
    document.body
  );
}
