"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";
import { BILLING_MODE, FREE_FOREVER, PLANS, PRO_FEATURES, formatPrice, type PlanId } from "@/lib/billing/plans";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { ReferralCard } from "@/components/profile/referral-card";

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

/**
 * 7A/7B: Pro page. In "interest" mode (default) Upgrade records interest only — no money
 * moves. In test/live mode it opens Razorpay checkout; Pro is granted only by the verified
 * webhook, never by this page.
 */
export default function ProPage() {
  const ent = useEntitlements();
  const signedIn = useAuthStore((s) => !!s.user);
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [interested, setInterested] = useState<PlanId[]>([]);
  const payments = BILLING_MODE !== "interest";

  const upgrade = async (planId: PlanId) => {
    setBusy(planId);
    try {
      if (!payments || PLANS.find((p) => p.id === planId)?.pricePaise == null) {
        const r = await fetch("/api/billing/interest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId, source: "pro_page" }) });
        if (!r.ok) throw new Error("Couldn't save that right now.");
        setInterested((x) => [...x, planId]);
        useToastStore.getState().show("Thanks! Pro isn't open yet — we'll let you know the day it launches.", "success");
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
        prefill: { email: j.email ?? undefined }, theme: { color: "#7c3aed" },
        handler: () => { useToastStore.getState().show("Payment received — Pro unlocks in a few seconds.", "success"); setTimeout(ent.refresh, 4000); },
      }).open();
    } catch (e) {
      useToastStore.getState().show((e as Error).message, "error");
    } finally { setBusy(null); }
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider"><Crown className="w-3.5 h-3.5" /> RENYXERA Pro</span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">Everything you need is <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">free</span>. Pro adds more AI.</h1>
        <p className="mt-3 text-[var(--text-secondary)]">Papers, mocks, analytics and sync stay free for everyone. Pro is for students who lean on the AI Mentor every day.</p>
        {ent.pro && <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"><Check className="w-4 h-4" /> You&apos;re on Pro{ent.validUntil ? ` until ${new Date(ent.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}</p>}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)]">Free · forever</p>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">₹0</p>
          <ul className="mt-5 space-y-2.5">{FREE_FOREVER.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"><Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />{f}</li>)}</ul>
        </section>
        {PLANS.map((p, i) => {
          const done = interested.includes(p.id);
          return (
            <motion.section key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * (i + 1) }}
              className={`relative rounded-3xl p-6 border ${p.highlight ? "border-violet-500/50 bg-gradient-to-br from-violet-500/12 via-[var(--surface)] to-fuchsia-500/10 shadow-[0_20px_50px_-24px_rgba(124,58,237,0.6)]" : "border-[var(--border)] bg-[var(--surface)]"}`}>
              {p.highlight && <span className="absolute -top-3 left-6 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-black uppercase tracking-wider">Best value</span>}
              <p className="text-sm font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">{p.name}</p>
              <p className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">{formatPrice(p.pricePaise)}{p.pricePaise != null && <span className="text-sm font-semibold text-[var(--text-muted)]"> {p.periodLabel}</span>}</p>
              {p.note && <p className="text-xs text-[var(--text-muted)]">{p.note}</p>}
              <ul className="mt-5 space-y-2.5">{PRO_FEATURES.map((f) => <li key={f.key} className="flex items-start gap-2 text-sm"><Sparkles className="w-4 h-4 mt-0.5 text-violet-500 shrink-0" /><span><b className="text-[var(--text-primary)]">{f.title}</b><span className="block text-[var(--text-secondary)] text-xs">{f.body}</span></span></li>)}</ul>
              <button type="button" onClick={() => upgrade(p.id)} disabled={!!busy || done || ent.pro}
                className="mt-6 w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-500/30 disabled:opacity-60 inline-flex items-center justify-center gap-2 cursor-pointer">
                {busy === p.id && <Loader2 className="w-4 h-4 animate-spin" />}
                {ent.pro ? "You're on Pro" : done ? "We'll notify you" : payments && p.pricePaise != null ? "Upgrade" : "Notify me when Pro opens"}
              </button>
            </motion.section>
          );
        })}
      </div>

      <ReferralCard />

      {payments && (
        <label className="mx-auto max-w-2xl flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-violet-600" />
          <span>I understand Pro is delivered instantly and <b className="text-[var(--text-primary)]">purchases are final — no refunds</b>, as set out in the <Link href="/refunds" className="font-semibold text-violet-600 dark:text-violet-400 underline">Refund &amp; Cancellation Policy</Link> and <Link href="/terms" className="font-semibold text-violet-600 dark:text-violet-400 underline">Terms</Link>. A plan does not renew automatically.</span>
        </label>
      )}
      <p className="text-center text-[11px] text-[var(--text-muted)]">{payments ? "Payments are processed securely by Razorpay (UPI, cards, net banking). Pro unlocks once Razorpay confirms the payment." : "Pro isn't on sale yet. Tapping the button only tells us you're interested — no payment is taken."}</p>
    </div>
  );
}
