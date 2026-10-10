"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { fmtDate, useBillingHistory } from "@/components/profile/billing-history";
import { formatPrice } from "@/lib/billing/plans";

// Optional seller details for the receipt header (set in the deploy environment; nothing is invented).
const SELLER = process.env.NEXT_PUBLIC_SELLER_NAME || "RENYXERA";
const SELLER_ADDRESS = process.env.NEXT_PUBLIC_SELLER_ADDRESS || "";

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between gap-4 border-b border-[var(--border-subtle)] py-2.5 text-sm"><dt className="text-[var(--text-muted)]">{k}</dt><dd className="text-right font-semibold text-[var(--text-primary)] break-all">{v}</dd></div>;
}

function ReceiptInner() {
  const id = Number(useSearchParams().get("id"));
  const { data, error } = useBillingHistory();
  const p = data?.payments.find((x) => x.id === id && x.status === "paid");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 pb-10">
      <style>{`@media print { header, nav, [aria-label="Main"], .no-print { display: none !important; } body, main, main * { background: #fff !important; color: #111 !important; } main > div { position: static !important; overflow: visible !important; } }`}</style>
      <div className="no-print flex items-center justify-between">
        <Link href="/profile#billing" className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 dark:text-violet-400"><ArrowLeft className="h-4 w-4" /> Back to payments</Link>
        {p && <button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-bold text-white cursor-pointer"><Printer className="h-4 w-4" /> Print / Save as PDF</button>}
      </div>
      {!data && !error && <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><Loader2 className="h-4 w-4 animate-spin" /> Loading receipt…</p>}
      {error && <p className="text-sm text-rose-500">{error}</p>}
      {data && !p && <p className="text-sm text-[var(--text-secondary)]">We couldn&apos;t find a paid order with that number on your account.</p>}
      {p && (
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-5">
            <div>
              <p className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">{SELLER}</p>
              {SELLER_ADDRESS && <p className="mt-1 max-w-xs text-xs text-[var(--text-muted)] whitespace-pre-line">{SELLER_ADDRESS}</p>}
              <p className="mt-1 text-xs text-[var(--text-muted)]">renyxera@gmail.com · gate.renyxera.workers.dev</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Payment receipt</p>
              <p className="font-num text-sm font-bold text-[var(--text-primary)]">{p.receiptNo}</p>
              <p className="text-xs text-[var(--text-muted)]">{fmtDate(p.paidAt)}</p>
            </div>
          </header>
          <dl className="mt-2">
            <Row k="Billed to" v={<>{data!.buyer.name || data!.buyer.username || "RENYXERA member"}{data!.buyer.email && <span className="block text-xs font-normal text-[var(--text-muted)]">{data!.buyer.email}</span>}</>} />
            <Row k="Plan" v={p.plan} />
            {p.branch && <Row k="Branch" v={p.branch} />}
            <Row k="Valid from" v={fmtDate(p.validFrom)} />
            <Row k="Valid until" v={fmtDate(p.validUntil)} />
            {p.creditPaise > 0 && <Row k="Credit for unused Plus days" v={`− ${formatPrice(p.creditPaise)}`} />}
            <Row k="Payment method" v={p.method ? `${p.method}${p.methodDetail ? ` ${p.methodDetail}` : ""}` : "Online (Razorpay)"} />
            <Row k="Payment ID" v={p.paymentId ?? "—"} />
            <Row k="Order ID" v={p.orderId ?? "—"} />
          </dl>
          <div className="mt-5 flex items-baseline justify-between rounded-xl bg-[var(--surface-secondary)] px-4 py-3">
            <span className="text-sm font-bold text-[var(--text-secondary)]">Total paid (taxes included)</span>
            <span className="text-2xl font-extrabold font-num text-[var(--text-primary)]">{formatPrice(p.amountPaise)}</span>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-[var(--text-muted)]">
            This is a receipt for a one-time purchase that does not renew automatically. Purchases are final as described in our Refund &amp; Cancellation Policy; a failed or duplicate charge is always fixed.
            {p.mode === "test" && " This was a test-mode payment and no money was charged."}
          </p>
        </article>
      )}
    </div>
  );
}

export default function ReceiptPage() {
  return <Suspense fallback={null}><ReceiptInner /></Suspense>;
}
