"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { branchByCode } from "@/lib/branches";
import { TurnstileWidget, type TurnstileHandle } from "@/components/auth/turnstile-widget";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Crown, Loader2, Sparkles, X } from "lucide-react";
import { BILLING_MODE, FREE_FOREVER, PLANS, TIER_FEATURES, TIER_RANK, comparePrice, formatPrice, planById, seasonPlan, seasonYears, upcomingSeasonYear, type PlanId } from "@/lib/billing/plans";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { useEntitlements, waitForTier } from "@/lib/billing/use-entitlements";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { ReferralCard } from "@/components/profile/referral-card";
import { SponsorBreakCard } from "@/components/profile/sponsor-break-card";
import { ProCrown } from "@/components/brand/pro-crown";
import { serverNow } from "@/lib/time/server-time";

declare global { interface Window { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (event: string, cb: (r: { error?: { description?: string } }) => void) => void } } }

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
export function PlansContent({ onDone, inModal = false }: { onDone?: () => void; inModal?: boolean }) {
  const ent = useEntitlements();
  const signedIn = useAuthStore((s) => !!s.user);
  const [period, setPeriod] = useState<"monthly" | "yearly" | "season">("yearly");
  // GATE season pass: the exam year defaults to the account's target year, and can be any of the next five.
  const targetYear = useAuthStore((s) => s.profile?.target_year ?? null);
  const years = seasonYears(serverNow());
  const [pickedYear, setPickedYear] = useState<number | null>(null);
  const seasonYear = pickedYear ?? (targetYear && years.includes(targetYear) ? targetYear : upcomingSeasonYear(serverNow()));
  const pickPlan = (tier: "plus" | "pro") => (period === "season" ? seasonPlan(tier, seasonYear, serverNow()) : PLANS.find((p) => p.tier === tier && p.id.endsWith(period)))!;
  const [busy, setBusy] = useState<PlanId | null>(null);
  const [agreed, setAgreed] = useState(false);
  // Multi-branch §9.2: the plan is locked to the account's branch; typing the paper code is the signal.
  const branchPaper = useAuthStore((s) => branchByCode(s.profile?.target_branch ?? "CSE")?.paper ?? "CS");
  const [typedPaper, setTypedPaper] = useState("");
  const paperOk = typedPaper.trim().toUpperCase() === branchPaper;
  const [captcha, setCaptcha] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [interested, setInterested] = useState<PlanId[]>([]);
  const [confirm, setConfirm] = useState<PlanId | null>(null);
  // Coupon box in the confirm window: the server decides what the code is worth; the order checks it again.
  const [couponText, setCouponText] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; label: string; discountPaise: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const applyCoupon = async (planId: string) => {
    if (couponText.trim().length < 3) return;
    setCouponBusy(true); setCouponMsg(null);
    try {
      const r = await fetch("/api/billing/coupon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId, code: couponText }) });
      const j = await r.json();
      if (j.valid) { setCoupon({ code: j.code, label: j.label, discountPaise: j.discountPaise }); setCouponMsg(null); } else { setCoupon(null); setCouponMsg(j.reason || j.error || "That code isn't valid."); }
    } catch { setCouponMsg("Couldn't check the code. Try again."); } finally { setCouponBusy(false); }
  };
  const payments = BILLING_MODE !== "interest";

  const upgrade = async (planId: PlanId) => {
    setBusy(planId);
    try {
      const plan = planById(planId, serverNow())!;
      if (!payments || plan.pricePaise == null) {
        const r = await fetch("/api/billing/interest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId, source: "plans_page" }) });
        if (!r.ok) throw new Error("Couldn't save that right now.");
        setInterested((x) => [...x, planId]);
        useToastStore.getState().show(`Thanks! ${plan.tier === "pro" ? "Pro" : "Plus"} isn't open yet — we'll let you know the day it launches.`, "success");
        return;
      }
      if (!signedIn) { useToastStore.getState().show("Sign in first to upgrade.", "info"); return; }
      // First click opens the confirm window; its Pay button calls this again.
      if (confirm !== planId) { setAgreed(false); setTypedPaper(""); setCaptcha(null); setCoupon(null); setCouponText(""); setCouponMsg(null); setConfirm(planId); return; }
      if (!agreed || !paperOk || !captcha) return;
      const r = await fetch("/api/billing/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId, coupon: coupon?.code, acceptedTerms: true, turnstileToken: captcha ?? undefined, branchConfirm: typedPaper.trim().toUpperCase() }) });
      turnstileRef.current?.reset(); setCaptcha(null);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Couldn't start checkout.");
      if (!(await loadCheckout()) || !window.Razorpay) throw new Error("Couldn't load the payment window. Check your connection.");
      setConfirm(null);
      const rz = new window.Razorpay({
        key: j.keyId, order_id: j.orderId, amount: j.amount, currency: j.currency, name: "RENYXERA", description: j.planName,
        prefill: { email: j.email ?? undefined }, theme: { color: plan.tier === "pro" ? "#d97706" : "#64748b" },
        modal: { ondismiss: () => useToastStore.getState().show("Checkout closed. If you already paid, your plan appears within a minute.", "info") },
        handler: async (resp: { razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string }) => {
          const toast = useToastStore.getState();
          toast.show("Payment received — activating your plan…", "success");
          // Verify the payment signature on the server for instant activation (the webhook is the backup).
          try { await fetch("/api/billing/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: resp?.razorpay_order_id, paymentId: resp?.razorpay_payment_id, signature: resp?.razorpay_signature }) }); } catch { /* the webhook still activates it */ }
          const ok = await waitForTier(ent.accountKey, plan.tier);
          toast.show(ok ? `You're on ${plan.tier === "pro" ? "Pro" : "Plus"} — enjoy!` : "Payment received. Your plan will appear within a minute — no need to pay again.", ok ? "success" : "info");
          if (ok) onDone?.();
        },
      });
      rz.on("payment.failed", (r) => useToastStore.getState().show(r?.error?.description || "Payment failed. Please try again or use another method.", "error"));
      rz.open();
    } catch (e) {
      useToastStore.getState().show((e as Error).message, "error");
    } finally { setBusy(null); }
  };

  return (
    <div className={inModal ? "space-y-6 pb-2" : "space-y-8 pb-10"}>
      <header className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider"><Crown className="w-3.5 h-3.5" /> Plans</span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">Prepare smarter with <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Plus &amp; Pro</span></h1>
        <p className="mt-3 text-[var(--text-secondary)]">More AI help every day, deeper analytics, offline papers and a premium look — one payment, no auto-renewal. Pick a plan and get more out of every study hour.</p>
        {ent.paid && <p className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"><Check className="w-4 h-4" /> You&apos;re on {ent.tier === "pro" ? "Pro" : "Plus"}{ent.validUntil ? ` until ${new Date(ent.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]" role="radiogroup" aria-label="Billing period">
          {(["monthly", "yearly", "season"] as const).map((p) => (
            <button key={p} type="button" role="radio" aria-checked={period === p} onClick={() => setPeriod(p)}
              className={`relative px-5 h-9 rounded-xl text-sm font-bold cursor-pointer ${period === p ? "text-white" : "text-[var(--text-secondary)]"}`}>
              {period === p && <motion.span layoutId="period-pill" className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              <span className="relative">{p === "monthly" ? "Monthly" : p === "yearly" ? "Yearly" : "GATE season pass"}</span>
            </button>
          ))}
        </div>
          {period === "season" && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[var(--text-secondary)]">Preparing for</label>
              <CustomDropdown value={String(seasonYear)} onChange={(v) => setPickedYear(Number(v))} options={years.map((y) => ({ label: `GATE ${y}${y === upcomingSeasonYear(serverNow()) ? " (next exam)" : ""}`, value: String(y) }))} className="w-52 text-sm font-semibold" />
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)]">Free · forever</p>
          <p className="mt-2 text-3xl font-extrabold text-[var(--text-primary)]">₹0</p>
          <ul className="mt-5 space-y-2.5">{FREE_FOREVER.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"><Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />{f}</li>)}</ul>
        </section>
        {(["plus", "pro"] as const).map((tier, i) => {
          const plan = pickPlan(tier);
          const look = LOOK[tier];
          const have = TIER_RANK[ent.tier] >= TIER_RANK[tier];
          const current = ent.tier === tier;
          const done = interested.includes(plan.id);
          const cmp = comparePrice(plan);
          const upgrading = tier === "pro" && ent.tier === "plus" && plan.pricePaise != null;
          const credit = upgrading ? Math.min(ent.upgradeCreditPaise, plan.pricePaise! - 100) : 0;
          const daysLeft = upgrading && ent.validUntil ? Math.max(0, Math.floor((Date.parse(ent.validUntil) - serverNow()) / 86400_000)) : 0;
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
                {current ? "Your plan" : have ? "Included in Pro" : done ? "We'll notify you" : upgrading && payments ? `Upgrade to Pro · ${formatPrice(plan.pricePaise! - credit)}` : payments && plan.pricePaise != null ? `Get ${tier === "pro" ? "Pro" : "Plus"}` : `Notify me when ${tier === "pro" ? "Pro" : "Plus"} opens`}
              </button>
            </motion.section>
          );
        })}
      </div>

      {period === "season" && <p className="text-center text-xs text-[var(--text-muted)]">One payment covers you until 31 March {seasonYear}, after results. It doesn&apos;t renew. The longer the runway, the lower the monthly cost.</p>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SponsorBreakCard />
        <ReferralCard />
      </div>

      {/* Confirm step: plan, price, the three terms that matter, agreement + security check, Pay. */}
      {typeof document !== "undefined" && createPortal(
      <AnimatePresence>
        {confirm && (() => {
          const cp = planById(confirm, serverNow())!;
          const up = cp.tier === "pro" && ent.tier === "plus";
          const credit = up ? Math.min(ent.upgradeCreditPaise, (cp.pricePaise ?? 0) - 100) : 0;
          const total = Math.max(100, (cp.pricePaise ?? 0) - credit - (coupon?.discountPaise ?? 0));
          const gold = cp.tier === "pro";
          return (
            <motion.div className="fixed inset-0 z-[300] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button type="button" aria-label="Close" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirm(null)} />
              <motion.div role="dialog" aria-modal="true" aria-label={`Confirm ${cp.name}`} initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
                className={`relative w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl border bg-[var(--surface)] p-6 shadow-2xl ${gold ? "border-amber-400/60" : "border-slate-400/60"}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-black uppercase tracking-wider ${LOOK[cp.tier].kicker}`}>{gold ? "Pro · Gold" : "Plus · Silver"}</p>
                  <div className="flex items-center gap-1">
                    <ProCrown metal={LOOK[cp.tier].metal} className="is-inline" />
                    <button type="button" onClick={() => setConfirm(null)} aria-label="Close" className="group w-8 h-8 -mr-2 rounded-lg grid place-items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer"><X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" /></button>
                  </div>
                </div>
                <h2 className="mt-1 text-xl font-extrabold text-[var(--text-primary)]">Confirm {cp.name}</h2>
                <dl className="mt-4 space-y-2 rounded-2xl bg-[var(--surface-secondary)]/60 p-4 text-sm">
                  <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">{cp.name}</dt><dd className="font-num font-semibold text-[var(--text-primary)]">{formatPrice(cp.pricePaise)}</dd></div>
                  {coupon && <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Coupon {coupon.code} ({coupon.label})</dt><dd className="font-num font-semibold text-emerald-600 dark:text-emerald-400">− {formatPrice(coupon.discountPaise)}</dd></div>}
                  {credit > 0 && <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Credit for unused Plus days</dt><dd className="font-num font-semibold text-emerald-600 dark:text-emerald-400">−{formatPrice(credit)}</dd></div>}
                  <div className="flex justify-between border-t border-[var(--border-subtle)] pt-2"><dt className="font-bold text-[var(--text-primary)]">You pay today</dt><dd className="font-num text-lg font-extrabold text-[var(--text-primary)]">{formatPrice(total)}</dd></div>
                  <p className="text-[11px] text-[var(--text-muted)]">{cp.periodDays} days of {gold ? "Pro" : "Plus"} from today · taxes included</p>
                </dl>
                <ul className="mt-4 space-y-1.5 text-xs text-[var(--text-secondary)]">
                  <li>• Starts instantly once the payment is confirmed.</li>
                  <li>• Does <b className="text-[var(--text-primary)]">not</b> renew automatically — no surprise charges.</li>
                  <li>• Purchases are final: <b className="text-[var(--text-primary)]">no refunds</b> (a failed or duplicate charge is always fixed).</li>
                </ul>
                <div className="mt-4">
                  <div className="flex gap-2">
                    <input value={couponText} onChange={(e) => { setCouponText(e.target.value.toUpperCase()); setCoupon(null); setCouponMsg(null); }} placeholder="Coupon code (optional)" maxLength={32} autoComplete="off" spellCheck={false} aria-label="Coupon code"
                      className="h-10 min-w-0 flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm font-semibold uppercase tracking-wider placeholder:font-normal placeholder:normal-case placeholder:tracking-normal" />
                    <button type="button" onClick={() => applyCoupon(cp.id)} disabled={couponBusy || couponText.trim().length < 3} className="h-10 shrink-0 rounded-xl border border-[var(--border)] px-4 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] disabled:opacity-50 cursor-pointer">{couponBusy ? "Checking…" : "Apply"}</button>
                  </div>
                  {coupon && <p className="mt-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Code applied: {coupon.label}.</p>}
                  {couponMsg && <p className="mt-1.5 text-xs font-semibold text-rose-500">{couponMsg}</p>}
                </div>
                <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/5 p-3">
                  <p className="text-xs text-[var(--text-secondary)]">This plan is for <b className="text-[var(--text-primary)]">GATE {branchPaper}</b> only and stays locked to your account&apos;s branch. If you use your one branch change later, the plan moves with it.</p>
                  <label className="mt-2 block text-[11px] text-[var(--text-secondary)]">Type <b>{branchPaper}</b> to confirm
                    <input value={typedPaper} onChange={(e) => setTypedPaper(e.target.value)} maxLength={4} autoComplete="off" spellCheck={false} aria-label={`Type ${branchPaper} to confirm`}
                      className="mt-1 w-full h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm font-semibold uppercase tracking-widest" />
                  </label>
                </div>
                <label className="mt-4 flex items-start gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-violet-600" />
                  <span>I agree to the <Link href="/terms" target="_blank" className="font-semibold text-violet-600 dark:text-violet-400 underline">Terms</Link> and the <Link href="/refunds" target="_blank" className="font-semibold text-violet-600 dark:text-violet-400 underline">Refund &amp; Cancellation Policy</Link>.</span>
                </label>
                <div className="mt-3 flex justify-center min-h-[24px]"><TurnstileWidget ref={turnstileRef} onToken={setCaptcha} /></div>
                <button type="button" onClick={() => upgrade(cp.id)} disabled={!agreed || !paperOk || !captcha || !!busy}
                  className={`mt-4 w-full h-12 rounded-xl font-bold shadow-lg disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer ${LOOK[cp.tier].btn}`}>
                  {busy === cp.id && <Loader2 className="w-4 h-4 animate-spin" />} Pay {formatPrice(total)} securely
                </button>
                <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">{!paperOk ? `Type ${branchPaper} above to confirm your branch.` : !agreed ? "Tick the box to continue." : !captcha ? "Running a quick security check…" : "You'll finish on Razorpay — UPI, cards or net banking."}</p>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>,
        document.body)}
      <p className="text-center text-[11px] text-[var(--text-muted)]">{payments ? "Payments are processed securely by Razorpay (UPI, cards, net banking). Your plan unlocks once Razorpay confirms the payment." : "Plans aren't on sale yet. Tapping a button only tells us you're interested — no payment is taken."}</p>
    </div>
  );
}
