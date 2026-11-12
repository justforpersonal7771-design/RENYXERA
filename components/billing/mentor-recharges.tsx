"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Zap } from "lucide-react";
import { TOPUP_EXPIRY_DAYS, TOPUP_PACKS, costInSmallPacksPaise, type TopupPack } from "@/lib/billing/ai-topups";
import { BILLING_MODE, formatPrice } from "@/lib/billing/plans";
import { formatTokens } from "@/lib/billing/ai-credits";
import { track } from "@/lib/growth/track";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";

import { openCheckout } from "@/lib/billing/checkout-client";

/** "AI Mentor recharges": small one-off packs for students who run out of daily Mentor messages. Buying works for any signed-in student (Free included); until payments are on, "Notify me". */
export function MentorRecharges(_props: { compact?: boolean }) {
  const signedIn = useAuthStore((s) => !!s.user);
  const live = BILLING_MODE !== "interest";
  const [noted, setNoted] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<TopupPack["id"] | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const loadBalance = useCallback(async () => {
    try { const r = await fetch("/api/billing/topup", { cache: "no-store" }); const j = await r.json(); setBalance(typeof j.balance === "number" ? j.balance : 0); return typeof j.balance === "number" ? (j.balance as number) : 0; } catch { return null; }
  }, []);
  useEffect(() => {
    if (!live || !signedIn) return;
    let alive = true;
    fetch("/api/billing/topup", { cache: "no-store" }).then((r) => r.json()).then((j) => { if (alive) setBalance(typeof j.balance === "number" ? j.balance : 0); }).catch(() => {});
    return () => { alive = false; };
  }, [live, signedIn]);

  const notify = (id: string) => { track("upgrade_clicked", null, `mentor_pack_${id}`); setNoted((n) => (n.includes(id) ? n : [...n, id])); };

  const pay = async (p: TopupPack) => {
    const toast = useToastStore.getState();
    setBusy(p.id);
    try {
      track("checkout_started", null, `topup_${p.id}`);
      const r = await fetch("/api/billing/topup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ packId: p.id, acceptedTerms: true }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Couldn't start checkout.");
      const before = balance ?? 0;
      await openCheckout(j, {
        onDismiss: () => toast.show("Checkout closed. If you already paid, your tokens appear within a minute.", "info"),
        onFail: (m) => toast.show(m, "error"),
        onPaid: async () => {
          toast.show("Payment received. Adding your tokens...", "success");
          let ok = false;
          for (let i = 0; i < 8 && !ok; i++) { const b = await loadBalance(); ok = b != null && b > before; if (!ok) await new Promise((res) => setTimeout(res, 2000)); }
          toast.show(ok ? `Added ${formatTokens(p.tokens)} tokens to your Mentor.` : "Payment received. Your tokens will appear within a minute. No need to pay again.", ok ? "success" : "info");
          setConfirm(null);
        },
      });
    } catch (e) {
      toast.show((e as Error).message, "error");
    } finally { setBusy(null); }
  };

  return (
    <section aria-labelledby="recharge-h" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="recharge-h" className="inline-flex items-center gap-2 text-lg font-extrabold text-[var(--text-primary)]"><Zap className="h-4 w-4 text-amber-500" aria-hidden /> AI Mentor recharges</h2>
        {live ? (balance != null && balance > 0 ? <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-black text-emerald-700 dark:text-emerald-300">You have {formatTokens(balance)} tokens</span> : null)
          : <span className="rounded-full bg-[var(--tint-butter)] px-2.5 py-0.5 text-[11px] font-black text-[var(--tint-butter-ink)]">Coming soon</span>}
      </div>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Ran out of Mentor messages for today? A recharge adds more, used after your daily allowance. It lasts {TOPUP_EXPIRY_DAYS} days and works on any plan, Free included. A recharge never unlocks Pro features.</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TOPUP_PACKS.map((p) => {
          const small = costInSmallPacksPaise(p);
          const done = noted.includes(p.id);
          const open = confirm === p.id;
          return (
            <div key={p.id} className={`relative flex flex-col rounded-2xl border p-4 ${p.tag ? "border-amber-400/60 bg-amber-500/5" : "border-[var(--border)]"}`}>
              {p.tag && <span className="absolute -top-2.5 left-4 rounded-full bg-[var(--tint-butter)] px-2 py-0.5 text-[10px] font-black text-[var(--tint-butter-ink)]">{p.tag}</span>}
              <p className="text-sm font-black text-[var(--text-muted)]">{p.name}</p>
              <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{formatPrice(p.pricePaise)}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{formatTokens(p.tokens)} tokens</p>
              <p className="text-xs text-[var(--text-secondary)]">about {p.questions} short questions</p>
              {small > p.pricePaise && <p className="mt-1 text-[11px] text-[var(--text-muted)]">The same in Small packs: {formatPrice(small)}</p>}
              <span className="min-h-3 flex-1" aria-hidden />
              {live ? (
                !signedIn ? <p className="mt-2 text-xs text-[var(--text-secondary)]">Sign in to buy.</p>
                : open ? (
                  <div className="mt-2 space-y-2">
                    <label className="flex items-start gap-2 text-[11px] text-[var(--text-secondary)] cursor-pointer">
                      <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-violet-600" />
                      <span>I agree to the <Link href="/terms" target="_blank" className="font-semibold underline">Terms</Link> and the <Link href="/refunds" target="_blank" className="font-semibold underline">Refund policy</Link>: recharges are not refundable except for our errors.</span>
                    </label>
                    <button type="button" onClick={() => void pay(p)} disabled={!agreed || !!busy} className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--btn)] text-sm font-bold text-[var(--btn-fg)] disabled:opacity-50 cursor-pointer">
                      {busy === p.id && <Loader2 className="h-4 w-4 animate-spin" />} Pay {formatPrice(p.pricePaise)}
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => { setAgreed(false); setConfirm(p.id); track("upgrade_clicked", null, `mentor_pack_${p.id}`); }} className="inline-flex h-9 items-center justify-center rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">Buy {p.name}</button>
                )
              ) : (
                <button type="button" onClick={() => notify(p.id)} disabled={done} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] disabled:opacity-70 cursor-pointer">
                  {done ? <><Check className="h-4 w-4 text-emerald-500" /> We&apos;ll tell you</> : "Notify me"}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-[var(--text-muted)]">A short question uses about 1.5K tokens. Long plans and long chats use more.{live ? " Payments are processed by Razorpay." : " No payment is taken yet."}</p>
    </section>
  );
}
