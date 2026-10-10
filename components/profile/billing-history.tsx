"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock, Crown, FileText, Loader2, RefreshCw } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useToastStore } from "@/store/use-toast-store";
import { formatPrice } from "@/lib/billing/plans";
import { serverNow } from "@/lib/time/server-time";

export type PaymentRow = {
  id: number; receiptNo: string; plan: string; planId: string; status: "created" | "paid" | "failed"; mode: string;
  amountPaise: number; creditPaise: number; createdAt: string; paidAt: string | null; validFrom: string | null; validUntil: string | null;
  periodDays: number; orderId: string | null; paymentId: string | null; method: string | null; methodDetail: string | null; branch: string | null;
};
export type HistoryResponse = { buyer: { name: string | null; username: string | null; email: string | null }; payments: PaymentRow[] };

export const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");

export function useBillingHistory() {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/billing/history", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Couldn't load your payments.");
      setData(j); setError(null);
    } catch (e) { setError((e as Error).message); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  return { data, error, reload: load };
}

/** Profile → Plan & payments: your current plan, every payment, and a receipt for each paid one. */
export function BillingHistoryCard() {
  const ent = useEntitlements();
  const { data, error, reload } = useBillingHistory();
  const [busy, setBusy] = useState<string | null>(null);

  const recheck = async (orderId: string) => {
    setBusy(orderId);
    try {
      const r = await fetch("/api/billing/recheck", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Couldn't check right now.");
      useToastStore.getState().show(j.result === "paid" ? "Found your payment — your plan is active." : "No completed payment found for that attempt. You haven't been charged.", j.result === "paid" ? "success" : "info");
      await reload();
    } catch (e) { useToastStore.getState().show((e as Error).message, "error"); }
    finally { setBusy(null); }
  };

  const paid = (data?.payments ?? []).filter((p) => p.status === "paid");
  const total = paid.reduce((n, p) => n + p.amountPaise, 0);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400"><Crown className="h-3.5 w-3.5" aria-hidden /> Current plan</p>
        <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{ent.loading ? "…" : ent.paid ? (ent.tier === "pro" ? "Pro" : "Plus") : "Free"}</p>
        <p className="text-sm text-[var(--text-secondary)]">
          {ent.paid && ent.validUntil ? `Active until ${fmtDate(ent.validUntil)} (${Math.max(0, Math.ceil((Date.parse(ent.validUntil) - serverNow()) / 86400_000))} days left). It doesn't renew automatically.` : "Papers, mocks, analytics and sync are free. Plus and Pro add more AI and premium looks."}
        </p>
        <Link href="/pro" className="mt-3 inline-flex h-9 items-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-xs font-bold text-white">{ent.paid ? "Extend or change plan" : "See plans"}</Link>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">Payments &amp; receipts</h3>
          {paid.length > 0 && <p className="text-xs text-[var(--text-muted)]">{paid.length} paid · {formatPrice(total)} in total</p>}
        </div>
        {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}
        {!data && !error && <p className="mt-3 flex items-center gap-2 text-sm text-[var(--text-muted)]"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>}
        {data && data.payments.length === 0 && <p className="mt-3 text-sm text-[var(--text-secondary)]">No payments yet. When you buy a plan, its receipt appears here.</p>}
        <ul className="mt-3 divide-y divide-[var(--border-subtle)]">
          {data?.payments.map((p) => {
            const stale = p.status === "created" && p.orderId && serverNow() - Date.parse(p.createdAt) > 5 * 60_000;
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--surface-secondary)]">
                  {p.status === "paid" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden /> : p.status === "failed" ? <AlertCircle className="h-4 w-4 text-rose-500" aria-hidden /> : <Clock className="h-4 w-4 text-amber-500" aria-hidden />}
                </span>
                <span className="min-w-0 flex-1 basis-48">
                  <span className="block text-sm font-bold text-[var(--text-primary)]">{p.plan}{p.mode === "test" && <span className="ml-2 rounded bg-amber-500/15 px-1.5 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300">test</span>}</span>
                  <span className="block text-xs text-[var(--text-muted)]">
                    {p.status === "paid" ? `Paid ${fmtDate(p.paidAt)} · valid until ${fmtDate(p.validUntil)}${p.method ? ` · ${p.method}${p.methodDetail ? ` ${p.methodDetail}` : ""}` : ""}` : p.status === "failed" ? `Attempt on ${fmtDate(p.createdAt)} failed — you were not charged` : `Started ${fmtDate(p.createdAt)} — not completed`}
                  </span>
                </span>
                <span className="text-sm font-extrabold font-num text-[var(--text-primary)]">{formatPrice(p.amountPaise)}</span>
                {p.status === "paid" && <Link href={`/receipt?id=${p.id}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"><FileText className="h-3.5 w-3.5" /> Receipt</Link>}
                {stale && (
                  <button type="button" disabled={busy === p.orderId} onClick={() => recheck(p.orderId!)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-amber-500/40 px-3 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 disabled:opacity-60 cursor-pointer">
                    {busy === p.orderId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} I paid — check
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-[var(--text-muted)]">Charged twice or something looks wrong? Email <a className="font-bold text-violet-600 dark:text-violet-400" href="mailto:renyxera@gmail.com">renyxera@gmail.com</a> with the receipt number — a failed or duplicate charge is always fixed.</p>
      </section>
    </div>
  );
}
