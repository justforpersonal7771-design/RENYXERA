"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Crown, X } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useAuthStore } from "@/store/use-auth-store";
import { acceptUpsell, dismissUpsell, markShown, pickUpsell, type Upsell, type UpsellContext } from "@/lib/growth/upsell";
import { openUpgrade } from "@/store/use-upgrade-modal-store";

/** One slim, dismissible Plus/Pro suggestion. Shows only when the rules in lib/growth/upsell.ts
 *  allow it (signed in, not paid, spaced out); otherwise renders `fallback`. */
export function SmartUpgrade({ context, pendingMistakes = 0, fallback = null }: { context: UpsellContext; pendingMistakes?: number; fallback?: React.ReactNode }) {
  const signedIn = useAuthStore((s) => !!s.user);
  const { paid, loading } = useEntitlements();
  const [pick, setPick] = useState<Upsell | null>(null);
  const marked = useRef(false);

  useEffect(() => {
    if (!signedIn || loading || paid) return;
    setPick(pickUpsell(context, pendingMistakes));
  }, [signedIn, loading, paid, context, pendingMistakes]);

  useEffect(() => {
    if (pick && !marked.current) { marked.current = true; markShown(pick.id); }
  }, [pick]);

  if (!pick) return <>{fallback}</>;
  return (
    <div role="note" className="mx-auto mt-2 flex w-full max-w-3xl items-center gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-3 py-2 text-xs animate-in fade-in slide-in-from-bottom-1 duration-300">
      <Crown className="h-4 w-4 shrink-0 text-amber-500" />
      <p className="min-w-0 flex-1 leading-snug text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">{pick.title}.</b> {pick.body}</p>
      <button type="button" onClick={() => { acceptUpsell(); openUpgrade(); }} className="cursor-pointer shrink-0 rounded-lg bg-amber-500/15 px-2.5 py-1 font-bold text-amber-700 transition hover:bg-amber-500/25 dark:text-amber-300">See plans</button>
      <button type="button" aria-label="Not now" onClick={() => { dismissUpsell(); setPick(null); }} className="shrink-0 rounded-md p-1 text-[var(--text-muted)] transition hover:text-[var(--text-primary)] cursor-pointer"><X className="h-3.5 w-3.5" /></button>
    </div>
  );
}
