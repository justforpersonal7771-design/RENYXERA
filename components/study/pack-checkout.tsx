"use client";

/** Buying study packs and bundles (doc 13, migration 0063). The price always comes from /api/billing/study (step-up credit applied there). */
import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import { BILLING_MODE } from "@/lib/billing/plans";
import { openCheckout } from "@/lib/billing/checkout-client";
import { track } from "@/lib/growth/track";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { bestBundleFor, bundleSum, productPacks, rupees } from "@/lib/study/packs";

type Quote = { pricePaise: number; creditPaise: number; amountPaise: number };

export function useStudyCheckout(onBought: () => void) {
  const live = BILLING_MODE !== "interest";
  const signedIn = useAuthStore((s) => !!s.user);
  const [product, setProduct] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);

  const start = async (p: string) => {
    track("upgrade_clicked", null, `study:${p}`);
    if (!live) { useToastStore.getState().show("Study pack checkout opens soon. We noted your interest.", "info"); return; }
    if (!signedIn) { useToastStore.getState().show("Sign in to buy study packs.", "info"); return; }
    setProduct(p); setQuote(null); setErr(null); setAgreed(false);
    try {
      const r = await fetch(`/api/billing/study?product=${encodeURIComponent(p)}`, { cache: "no-store" }); const j = await r.json();
      if (!r.ok) setErr(j.error || "This product isn't available."); else setQuote(j);
    } catch { setErr("Couldn't load the price. Please try again."); }
  };

  const pay = async () => {
    if (!product) return; const toast = useToastStore.getState(); setBusy(true);
    try {
      track("checkout_started", null, `study:${product}`);
      const r = await fetch("/api/billing/study", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product, acceptedTerms: true }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || "Couldn't start checkout.");
      await openCheckout(j, {
        onDismiss: () => toast.show("Checkout closed. If you already paid, your books open within a minute.", "info"),
        onFail: (m) => toast.show(m, "error"),
        onPaid: async () => {
          toast.show("Payment received. Opening your books...", "success");
          for (let i = 0; i < 6; i++) { await new Promise((res) => setTimeout(res, 2000)); onBought(); }
          setProduct(null);
        },
      });
    } catch (e) { toast.show((e as Error).message, "error"); } finally { setBusy(false); }
  };

  const info = product ? productPacks(product) : null;
  const modal = product && typeof document !== "undefined" ? createPortal(
    <div className="fixed inset-0 z-[300] grid place-items-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setProduct(null)} />
      <div role="dialog" aria-modal="true" aria-label={`Buy ${info?.name ?? "study pack"}`} className="relative w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">{info?.name}</h2>
          <button type="button" onClick={() => setProduct(null)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full border-2 border-[var(--text-primary)]/70 hover:bg-[var(--surface-secondary)]"><X className="h-4 w-4" /></button>
        </div>
        {err ? <p className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3 text-sm text-[var(--text-primary)]">{err}</p> : !quote ? <div className="skeleton-shimmer mt-4 h-24 rounded-2xl" /> : (
          <>
            <dl className="mt-4 space-y-2 rounded-2xl bg-[var(--surface-secondary)] p-4 text-sm">
              <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Price</dt><dd className="font-num font-semibold">{rupees(quote.pricePaise)}</dd></div>
              {quote.creditPaise > 0 && <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Credit for packs bought in the last 30 days</dt><dd className="font-num font-semibold text-emerald-700 dark:text-emerald-400">−{rupees(quote.creditPaise)}</dd></div>}
              <div className="flex justify-between border-t border-[var(--border)] pt-2"><dt className="font-bold">You pay</dt><dd className="font-num text-lg font-extrabold">{rupees(quote.amountPaise)}</dd></div>
            </dl>
            {(() => {
              const nb = info ? bestBundleFor(info.packs) : null; const diff = nb ? nb.pricePaise - quote.pricePaise : 0;
              if (!nb || diff <= 0) return null;
              return (
                <div className="mt-3 rounded-2xl bg-[var(--tint-butter)] p-3 text-sm text-[var(--tint-butter-ink)]">
                  <p className="font-extrabold">Add {nb.packs.length - (info?.packs.length ?? 0)} more subjects for {rupees(diff)} more</p>
                  <p className="text-xs">{nb.name} is {rupees(nb.pricePaise)} for {nb.packs.length} subjects (separately {rupees(bundleSum(nb))}).</p>
                  <button type="button" onClick={() => void start(`bundle:${nb.id}`)} className="mt-2 inline-flex h-8 items-center rounded-lg bg-[var(--btn)] px-3 text-xs font-bold text-[var(--btn-fg)]">Switch to {nb.name}</button>
                </div>
              );
            })()}
            <ul className="mt-3 space-y-1 text-xs text-[var(--text-secondary)]">
              <li>• Opens {info?.packs.length === 1 ? "this subject" : `${info?.packs.length} subjects`} until the end of your GATE season (31 March IST).</li>
              <li>• Separate from Plus and Pro; one-time payment, no renewal.</li>
              <li>• Refunds only for our errors (double charge, a payment that did not activate, a fault we cannot fix), by email.</li>
            </ul>
            <label className="mt-4 flex items-start gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-violet-600" />
              <span>I agree to the <Link href="/terms" target="_blank" className="font-semibold underline">Terms</Link> and the <Link href="/refunds" target="_blank" className="font-semibold underline">Refund policy</Link>.</span>
            </label>
            <button type="button" onClick={() => void pay()} disabled={!agreed || busy} className="btn-main mt-4 inline-flex w-full items-center justify-center gap-2 disabled:opacity-50">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Pay {rupees(quote.amountPaise)}</button>
          </>
        )}
      </div>
    </div>, document.body) : null;

  return { start, modal, live };
}
