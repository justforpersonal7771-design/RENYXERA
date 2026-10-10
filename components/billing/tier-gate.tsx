"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { PLANS, TIER_RANK, formatPrice } from "@/lib/billing/plans";
import { ProCrown } from "@/components/brand/pro-crown";
import { openUpgrade } from "@/store/use-upgrade-modal-store";

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
  const monthly = PLANS.find((p) => p.tier === tier && p.id.endsWith("monthly"));
  const price = monthly?.pricePaise != null ? formatPrice(monthly.pricePaise) : null;
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div aria-hidden="true" inert className={`select-none pointer-events-none blur-[6px] opacity-45 saturate-50 ${className}`}>{children}</div>
      <div className={`absolute inset-0 flex items-start justify-center p-4 pt-8 bg-gradient-to-b from-transparent ${gold ? "via-amber-50/30 to-amber-100/50 dark:via-amber-950/20 dark:to-amber-950/40" : "via-slate-50/30 to-slate-200/50 dark:via-slate-900/20 dark:to-slate-900/40"}`}>
        <div className={`sticky top-4 w-full max-w-sm rounded-2xl border p-5 text-center shadow-xl backdrop-blur-md bg-[var(--surface)]/90 ${gold ? "border-amber-400/60" : "border-slate-400/60"}`}>
          <div className="mx-auto mb-2 flex items-center justify-center"><ProCrown metal={gold ? "gold" : "silver"} className="is-inline" /></div>
          <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${gold ? "text-amber-700 dark:text-amber-300" : "text-slate-600 dark:text-slate-300"}`}>{gold ? "Pro · Gold" : "Plus · Silver"}</p>
          <h3 className="mt-1 text-base font-extrabold text-[var(--text-primary)] inline-flex items-center gap-1.5"><Lock className="w-4 h-4" /> {feature}</h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{perk}</p>
          <button type="button" onClick={() => openUpgrade(`${feature} is a ${gold ? "Pro" : "Plus"} feature`)} className={`mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-5 text-sm font-bold shadow-md ${gold ? "bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 text-amber-950" : "bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 text-slate-900"}`}>
            Unlock with {gold ? "Pro" : "Plus"}{price ? ` — ${price}/month` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Whole-screen lock for paid-only screens (7A). A Free account sees NO real metric: the
 * page is not rendered at all behind the card (just a decorative skeleton), and the card
 * compares Plus and Pro. Plus/Pro accounts see the screen normally.
 */
export function PaidScreen({ feature, perk, children }: { feature: string; perk: string; children: ReactNode }) {
  const ent = useEntitlements();
  if (ent.loading) return <div data-fill-height="always" className="w-full h-full grid place-items-center"><div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-violet-500 animate-spin" /></div>;
  if (ent.paid) return <>{children}</>;
  const plus = PLANS.find((p) => p.id === "plus_monthly"), pro = PLANS.find((p) => p.id === "pro_monthly");
  return (
    <div data-fill-height="always" className="relative w-full h-full overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-40 blur-[3px]">
        {Array.from({ length: 8 }, (_, i) => <div key={i} className={`rounded-2xl bg-gradient-to-br from-[var(--surface-secondary)] to-[var(--surface)] border border-[var(--border-subtle)] ${i % 3 === 0 ? "row-span-2" : ""}`} />)}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-transparent via-[var(--background)]/40 to-[var(--background)]/80">
        <div className="w-full max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md p-6 sm:p-8 shadow-2xl text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 text-[11px] font-black uppercase tracking-wider"><Lock className="w-3.5 h-3.5" /> Members only</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">{feature} is part of Plus &amp; Pro</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{perk}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[{ t: "plus" as const, plan: plus, lines: ["Mastery, trends & subject explorer", "Smart insights & daily adaptive path", "75 AI requests a day"] },
              { t: "pro" as const, plan: pro, lines: ["Everything in Plus", "Mock analytics, topic ladders, difficulty", "150 AI requests a day · offline downloads"] }].map(({ t, plan, lines }) => (
              <div key={t} className={`rounded-2xl border p-4 ${t === "pro" ? "border-amber-400/60 bg-amber-500/5" : "border-slate-400/60 bg-slate-500/5"}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-black uppercase tracking-wider ${t === "pro" ? "text-amber-700 dark:text-amber-300" : "text-slate-600 dark:text-slate-300"}`}>{t === "pro" ? "Pro · Gold" : "Plus · Silver"}</p>
                  <ProCrown metal={t === "pro" ? "gold" : "silver"} className="is-inline !w-8 !h-6" />
                </div>
                <p className="mt-1 text-xl font-extrabold text-[var(--text-primary)]">{plan?.pricePaise != null ? `${formatPrice(plan.pricePaise)}/month` : "Coming soon"}</p>
                <ul className="mt-2 space-y-1 text-xs text-[var(--text-secondary)]">{lines.map((l) => <li key={l}>• {l}</li>)}</ul>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => openUpgrade("Choose your plan")} className="cursor-pointer mt-6 inline-flex h-11 items-center justify-center rounded-xl px-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-500/30">See plans</button>
        </div>
      </div>
    </div>
  );
}
