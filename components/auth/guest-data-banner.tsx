"use client";

import { CloudOff } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";

/**
 * Master plan Module 4D: bookmarks/mistakes stay usable for a guest (not locked —
 * they're core to the "feel the product before signing up" teaser), but the data is
 * local-only until they sign in, so they should know that rather than discover it the
 * hard way (a cleared browser, a different device). Renders nothing for a signed-in
 * user or while auth is still resolving.
 */
export function GuestDataBanner() {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const openAuthModal = useAuthModalStore((s) => s.open);

  if (authLoading || user) return null;

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-400 shrink-0">
      <CloudOff className="w-4 h-4 shrink-0" />
      <span className="flex-1 min-w-0">Saved to this device only.</span>
      <button
        onClick={() => openAuthModal("login")}
        className="shrink-0 font-bold underline underline-offset-2 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
      >
        Sign in to sync
      </button>
    </div>
  );
}
