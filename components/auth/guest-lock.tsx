"use client";

import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";

interface GuestLockProps {
  feature: string;
  description: string;
  children: ReactNode;
}

/**
 * Master plan Module 4D: "Locked features render blurred-but-present with a real
 * preview — a guest must see the weakness heatmap they are missing, not an empty
 * state... never a wall on arrival... a contextual, specific unlock prompt."
 *
 * Renders `children` normally for a signed-in user. For a guest, renders the SAME
 * children underneath a blur + dim + non-interactive overlay, with a centered card
 * naming specifically what's locked and why, opening the login modal in place rather
 * than navigating away. Deliberately does not gate whether children even mount — the
 * wrapped page still runs its own data loading regardless; this is a presentation
 * layer only. The actual "guests get zero AI calls" enforcement lives server-side in
 * /api/ai/generate, not here — a client-side blur can always be bypassed by someone
 * determined enough, so it was never meant to be the real security boundary.
 */
export function GuestLock({ feature, description, children }: GuestLockProps) {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const openAuthModal = useAuthModalStore((s) => s.open);

  if (authLoading) {
    return (
      <div className="w-full h-full min-h-[50vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (user) return <>{children}</>;

  return (
    <div className="relative w-full h-full">
      {/* `inert` (not just pointer-events-none) also pulls this out of keyboard/
          screen-reader focus — a blurred, non-interactive preview shouldn't be
          tabbable. */}
      <div aria-hidden="true" inert className="select-none blur-md opacity-40 saturate-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-transparent via-[var(--background)]/40 to-[var(--background)]/70">
        <div className="card-glass rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-500 via-indigo-600 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold text-[var(--text-primary)] mb-1.5">{feature} is for signed-in students</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">{description}</p>
          <button
            onClick={() => openAuthModal("login")}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/25 transition-colors"
          >
            Sign In to Unlock
          </button>
        </div>
      </div>
    </div>
  );
}
