"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Anvil, Bot, Check, Send, X } from "lucide-react";
import { PLUS_AI_DAILY, PRO_AI_DAILY, FORGE } from "@/lib/billing/plans";

const KEY = "renyxera:welcome-tour"; // set to "plus" or "pro" right after a purchase activates
const EVENT = "renyxera:purchase-done";

/** Call right after a paid plan activates: the next render of <PostPurchaseTour /> shows the three-step welcome (R13-A6). */
export function startPurchaseTour(tier: "plus" | "pro") {
  try { localStorage.setItem(KEY, tier); } catch { /* storage blocked: skip the tour */ }
  window.dispatchEvent(new Event(EVENT));
}

/** A short welcome after paying: what was unlocked, where to use it first, and the Telegram features. Shown once; Esc or the close button dismisses it. */
export function PostPurchaseTour() {
  const [tier, setTier] = useState<"plus" | "pro" | null>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const read = () => { try { const v = localStorage.getItem(KEY); setTier(v === "plus" || v === "pro" ? v : null); } catch { /* ignore */ } };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);
  const close = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setTier(null); setStep(0); };
  useEffect(() => {
    if (!tier) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [tier]);
  if (!tier) return null;
  const name = tier === "pro" ? "Pro" : "Plus";
  const steps = [
    { icon: Anvil, title: "Forge is open", body: tier === "pro" ? "Unlimited original GATE-level questions, with worked solutions, the X tier and the archive of past Forge Mocks." : `${FORGE.plus.dailyLimit} original GATE-level questions a day, each with its worked solution, shortcut and trap.`, href: "/forge", cta: "Open Forge" },
    { icon: Bot, title: "More from the AI Mentor", body: `${tier === "pro" ? PRO_AI_DAILY : PLUS_AI_DAILY} AI requests every day, plus fresh practice sets on any topic.`, href: "/ai-mentor", cta: "Ask the Mentor" },
    { icon: Send, title: "Telegram reminders", body: tier === "pro" ? "Smart reminders, a weekly review, 10 alarms and 10 timers. Link your account from Profile, Telegram." : "A message before every study block, a morning digest, 3 alarms and 5 timers. Link your account from Profile, Telegram.", href: "/profile", cta: "Link Telegram" },
  ];
  const s = steps[step];
  const last = step === steps.length - 1;
  return (
    <div className="fixed inset-0 z-[260] grid place-items-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div role="dialog" aria-modal="true" aria-label={`Welcome to ${name}`} className="relative w-full max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <button type="button" onClick={close} aria-label="Close" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] cursor-pointer"><X className="h-4 w-4" /></button>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300"><Check className="h-3.5 w-3.5" /> You&apos;re on {name}</p>
        <div className="mt-4 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--tint-butter)] text-[var(--tint-butter-ink)]"><s.icon className="h-6 w-6" aria-hidden /></div>
        <h2 className="mt-3 text-xl font-extrabold text-[var(--text-primary)]">{s.title}</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{s.body}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="flex gap-1.5" aria-label={`Step ${step + 1} of ${steps.length}`}>{steps.map((_, i) => <span key={i} className={`h-1.5 w-6 rounded-full ${i === step ? "bg-[var(--text-primary)]" : "bg-[var(--border)]"}`} />)}</span>
          <div className="flex items-center gap-2">
            <Link href={s.href} onClick={close} className="h-9 rounded-xl border border-[var(--border)] px-3 text-sm font-bold text-[var(--text-primary)] inline-flex items-center hover:bg-[var(--surface-secondary)]">{s.cta}</Link>
            <button type="button" onClick={() => (last ? close() : setStep(step + 1))} className="h-9 rounded-xl bg-[var(--btn)] px-4 text-sm font-bold text-[var(--btn-fg)] cursor-pointer">{last ? "Done" : "Next"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
