"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { TIER_RANK } from "@/lib/billing/plans";
import { ProCrown } from "@/components/brand/pro-crown";

/**
 * Premium section lock (7A). Same idea as GuestLock (Module 4D): the section is rendered
 * blurred-but-present so a Free student sees what they're missing, with a specific unlock
 * card in the tier's metal — silver for Plus, gold for Pro — pointing to the Plans page.
 *
 * Presentation only: these sections are computed on the student's own device from their
 * own data, so nothing sensitive is exposed; server-side perks (AI allowance, premium
 * avatars) are enforced on the server.
 */
export function TierGate({ tier, feature, perk, children, className = "" }: { tier: "plus" | "pro"; feature: string; perk: string; children: ReactNode; className?: string }) {
  const ent = useEntitlements();
  if (ent.loading || TIER_RANK[ent.tier] >= TIER_RANK[tier]) return <div className={className}>{children}</div>;
  const gold = tier === "pro";
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <div aria-hidden="true" inert className="select-none pointer-events-none blur-[6px] opacity-45 saturate-50">{children}</div>
      <div className={`absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-transparent ${gold ? "via-amber-50/30 to-amber-100/50 dark:via-amber-950/20 dark:to-amber-950/40" : "via-slate-50/30 to-slate-200/50 dark:via-slate-900/20 dark:to-slate-900/40"}`}>
        <div className={`w-full max-w-sm rounded-2xl border p-5 text-center shadow-xl backdrop-blur-md bg-[var(--surface)]/90 ${gold ? "border-amber-400/60" : "border-slate-400/60"}`}>
          <div className="mx-auto mb-2 flex items-center justify-center"><ProCrown metal={gold ? "gold" : "silver"} className="is-inline" /></div>
          <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${gold ? "text-amber-700 dark:text-amber-300" : "text-slate-600 dark:text-slate-300"}`}>{gold ? "Pro · Gold" : "Plus · Silver"}</p>
          <h3 className="mt-1 text-base font-extrabold text-[var(--text-primary)] inline-flex items-center gap-1.5"><Lock className="w-4 h-4" /> {feature}</h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{perk}</p>
          <Link href="/pro" className={`mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-5 text-sm font-bold shadow-md ${gold ? "bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 text-amber-950" : "bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 text-slate-900"}`}>
            Unlock with {gold ? "Pro" : tier === "plus" ? "Plus" : ""} — {gold ? "₹99/mo" : "₹29/mo"}
          </Link>
        </div>
      </div>
    </div>
  );
}
