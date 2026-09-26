"use client";

import { HardDrive } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";

/** Module 4D: tells guests their bookmarks/mistakes live only in this browser. */
export function GuestLocalNotice({ what }: { what: string }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const open = useAuthModalStore((s) => s.open);
  if (user || loading) return null;
  return (
    <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
      <HardDrive className="w-4 h-4 shrink-0" />
      <span className="flex-1">Your {what} are saved only in this browser. Sign in to keep them safe and use them on any device.</span>
      <button onClick={() => open("signup")} className="shrink-0 rounded-lg bg-amber-500/20 px-2.5 py-1 font-semibold hover:bg-amber-500/30 cursor-pointer">Sign in</button>
    </div>
  );
}
