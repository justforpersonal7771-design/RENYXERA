"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useAuthStore } from "@/store/use-auth-store";

/** 7A: a quiet upgrade path on the results screen — signed-in, non-Pro accounts only. */
export function UpgradeNudge() {
  const signedIn = useAuthStore((s) => !!s.user);
  const { pro, loading } = useEntitlements();
  if (!signedIn || loading || pro) return null;
  return (
    <Link href="/pro" className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-violet-600 transition-colors">
      <Crown className="w-3.5 h-3.5 text-amber-500" /> Want the AI Mentor to explain every mistake? See RENYXERA Pro
    </Link>
  );
}
