"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";
import { BILLING_MODE, FREE_FOREVER, PLANS, TIER_FEATURES, TIER_RANK, comparePrice, formatPrice, type PlanId } from "@/lib/billing/plans";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { ReferralCard } from "@/components/profile/referral-card";
import { SponsorBreakCard } from "@/components/profile/sponsor-break-card";
import { ProCrown } from "@/components/brand/pro-crown";

declare global { interface Window { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void } } }

function loadCheckout() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const LOOK = {
  plus: { ring: "border-slate-400/60 bg-gradient-to-br from-slate-200/40 via-[var(--surface)] to-slate-400/10", kicker: "text-slate-600 dark:text-slate-300", btn: "bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 text-slate-900 shadow-slate-500/30", metal: "silver" as const, label: "Silver" },
  pro: { ring: "border-amber-400/70 bg-gradient-to-br from-amber-200/30 via-[var(--surface)] to-amber-500/10 shadow-[0_20px_50px_-24px_rgba(217,119,6,0.55)]", kicker: "text-amber-700 dark:text-amber-300", btn: "bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 text-amber-950 shadow-amber-500/30", metal: "gold" as const, label: "Gold" },
};

/**
 * 7A/7B: plans page — Free · Plus (silver) · Pro (gold). In "interest" mode (default) the
 * buttons record interest only; no money moves. In test/live mode they open Razorpay
 * checkout, and the tier is granted only by the verified webhook, never by this page.
 */
export default function PlansPage() {
  const ent = useEntitlements();
  const signedIn = useAuthStore((s) => !!s.user);
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [interested, setInterested] = useState<PlanId[]>([]);
  const payments = BILLING_MODE !== "interest";

  const upgrade = async (planId: PlanId) => {
    setBusy(planId);
    try {
      const plan = PLANS.find((p) => p.id === planId)!;
      if (!payments || plan.pricePaise == null) {
        const r = await fetch("/api/billing/interest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId, source: "plans_page" }) });
        if (!r.ok) throw new Error("Couldn't save that right now.");
        setInterested((x) => [...x, planId]);
        useToastStore.getState().show(`Thanks! ${plan.tier === "pro" ? "Pro" : "Plus"} isn't open yet — we'll let you know the day it launches.`, "success");
        return;
      }
      if (!signedIn) { useToastStore.getState().show("Sign in first to upgrade.", "info"); return; }
      if (!agreed) { useToastStore.getState().show("Please accept the no-refund terms first.", "info"); return; }
      const r = await fetch("/api/billing/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId, acceptedTerms: true }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Couldn't start checkout.");
      if (!(await loadCheckout()) || !window.Razorpay) throw new Error("Couldn't load the payment window. Check your connection.");
      new window.Razorpay({
        key: j.keyId, order_id: j.orderId, amount: j.amount, currency: j.currency, name: "RENYXERA", description: j.planName,
        prefill: { email: j.email ?? undefined }, theme: { color: plan.tier === "pro" ? "#d97706" : "#64748b" },
        handler: () => { useToastStore.getState().show("Payment received — your plan unlocks in a few seconds.", "success"); setTimeout(ent.refresh, 4000); },
      }).open();
    } catch (e) {
      useToastStore.getState().show((e as Error).message, "error");
    } finally { setBusy(null); }
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider"><Crown className="w-3.5 h-3.5" /> Plans</span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">Everything you need is <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">free</span>.</h1>
        <p className="mt-3 text-[var(--text-secondary)]">Papers, mocks, analytics and sync stay free for everyone. Plus and Pro add more AI and premium looks.</p>
        {ent.paid && <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"><Check className="w-4 h-4" /> You&apos;re on {ent.tier === "pro" ? "Pro" : "Plus"}{ent.validUntil ? ` until ${new Date(ent.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}</p>}
        <div className="mt-6 inline-flex p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]" role="radiogroup" aria-label="Billing period">
          {(["monthly", "yearly"] as const).map((p) => (
            <button key={p} type="button" role="radio" aria-checked={period === p} onClick={() => setPeriod(p)}
              className={`relative px-5 h-9 rounded-xl text-sm font-bold cursor-pointer ${period === p ? "text-white" : "text-[var(--text-secondary)]"}`}>
              {period === p && <motion.span layoutId="period-pill" className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              <span className="relative">{p === "monthly" ? "Monthly" : "Yearly"}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)]">Free · forever</p>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">₹0</p>
          <ul className="mt-5 space-y-2.5">{FREE_FOREVER.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"><Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />{f}</li>)}</ul>
        </section>
        {(["plus", "pro"] as const).map((tier, i) => {
          const plan = PLANS.find((p) => p.tier === tier && p.id.endsWith(period))!;
          const look = LOOK[tier];
          const have = TIER_RANK[ent.tier] >= TIER_RANK[tier];
          const done = interested.includes(plan.id);
          const cmp = comparePrice(plan);
          const upgrading = tier === "pro" && ent.tier === "plus" && plan.pricePaise != null;
          const credit = upgrading ? Math.min(ent.upgradeCreditPaise, plan.pricePaise! - 100) : 0;
          const daysLeft = upgrading && ent.validUntil ? Math.max(0, Math.floor((Date.parse(ent.validUntil) - Date.now()) / 86400_000)) : 0;
          return (
            <motion.section key={tier} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * (i + 1) }} className={`relative flex flex-col rounded-3xl p-6 border ${look.ring}`}>
              {tier === "pro" && <span className="absolute -top-3 left-6 px-2.5 py-1 rounded-full bg-gradient-to-b from-amber-200 to-amber-500 text-amber-950 text-[10px] font-black uppercase tracking-wider shadow">Most loved</span>}
              <div className="flex items-center justify-between">
                <p className={`text-sm font-black uppercase tracking-wider ${look.kicker}`}>{tier === "pro" ? "Pro" : "Plus"} · {look.label}</p>
                <ProCrown metal={look.metal} className="is-inline" />
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {cmp && <span className="text-lg font-bold text-[var(--text-muted)] line-through decoration-2 decoration-rose-500/70">{formatPrice(cmp.wasPaise)}</span>}
                <span className="text-3xl font-extrabold text-[var(--text-primary)]">{formatPrice(plan.pricePaise)}</span>
                {plan.pricePaise != null && <span className="text-sm font-semibold text-[var(--text-muted)]">{plan.periodLabel}</span>}
                {cmp && <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wide">Save {cmp.savePct}%</span>}
              </div>
              {upgrading && (
                <div className="mt-2 rounded-xl border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs text-[var(--text-primary)]">
                  <p className="font-extrabold">Upgrade from Plus: {credit > 0 ? <><span className="line-through text-[var(--text-muted)] mr-1">{formatPrice(plan.pricePaise)}</span>{formatPrice(plan.pricePaise! - credit)}</> : formatPrice(plan.pricePaise)}</p>
                  <p className="text-[var(--text-secondary)]">{credit > 0 ? `Includes ${formatPrice(credit)} credit for the ${daysLeft} unused days of your Plus plan. Pro starts today for the full ${plan.periodLabel.replace("per ", "")}.` : "Pro starts today for the full period."}</p>
                </div>
              )}
              {cmp?.perMonthPaise && <p className="text-xs font-semibold text-[var(--text-secondary)]">Just ≈ {formatPrice(Math.round(cmp.perMonthPaise / 100) * 100)}/month, billed yearly · {cmp.reason}</p>}
              <p className="text-xs text-[var(--text-muted)]">{tier === "pro" ? "Everything in Plus, and:" : "Everything in Free, and:"}</p>
              <ul className="mt-4 mb-6 flex-1 space-y-2.5">{TIER_FEATURES[tier].map((f) => <li key={f.title} className="flex items-start gap-2 text-sm"><Sparkles className={`w-4 h-4 mt-0.5 shrink-0 ${look.kicker}`} /><span><b className="text-[var(--text-primary)]">{f.title}</b><span className="block text-[var(--text-secondary)] text-xs">{f.body}</span></span></li>)}</ul>
              <button type="button" onClick={() => upgrade(plan.id)} disabled={!!busy || done || have}
                className={`mt-auto w-full h-11 rounded-xl font-bold shadow-lg disabled:opacity-60 inline-flex items-center justify-center gap-2 cursor-pointer ${look.btn}`}>
                {busy === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                {have ? "Your plan" : done ? "We'll notify you" : upgrading && payments ? `Upgrade to Pro · ${formatPrice(plan.pricePaise! - credit)}` : payments && plan.pricePaise != null ? `Get ${tier === "pro" ? "Pro" : "Plus"}` : `Notify me when ${tier === "pro" ? "Pro" : "Plus"} opens`}
              </button>
            </motion.section>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SponsorBreakCard />
        <ReferralCard />
      </div>

      {payments && (
        <label className="mx-auto max-w-2xl flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-violet-600" />
          <span>I understand my plan is delivered instantly and <b className="text-[var(--text-primary)]">purchases are final — no refunds</b>, as set out in the <Link href="/refunds" className="font-semibold text-violet-600 dark:text-violet-400 underline">Refund &amp; Cancellation Policy</Link> and <Link href="/terms" className="font-semibold text-violet-600 dark:text-violet-400 underline">Terms</Link>. A plan does not renew automatically.</span>
        </label>
      )}
      <p className="text-center text-[11px] text-[var(--text-muted)]">{payments ? "Payments are processed securely by Razorpay (UPI, cards, net banking). Your plan unlocks once Razorpay confirms the payment." : "Plans aren't on sale yet. Tapping a button only tells us you're interested — no payment is taken."}</p>
    </div>
  );
}
