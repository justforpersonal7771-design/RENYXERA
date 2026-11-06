"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { Sparkles, X } from "lucide-react";
import { useUpgradeModalStore } from "@/store/use-upgrade-modal-store";
import { track } from "@/lib/growth/track";
import { PLANS } from "@/lib/billing/plans";

// "₹0.97/day": the monthly price spread over its 30 days, so a small number is shown honestly next to the real one.
const perDay = (id: string) => { const p = PLANS.find((x) => x.id === id); return p?.pricePaise ? `₹${(p.pricePaise / 100 / p.periodDays).toFixed(2)}` : null; };
const slug = (s: string | null) => (s ?? "menu").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40);

const PlansContent = dynamic(() => import("@/components/billing/plans-content").then((m) => m.PlansContent), { ssr: false, loading: () => <div className="skeleton-shimmer h-72 rounded-2xl" /> });

/** The Plans window, shown over whatever page you're on. Buying works here exactly as on the Plans page. */
export function UpgradeModalHost() {
  const { open, reason, close } = useUpgradeModalStore();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close]);
  // Which locked thing opened the sheet (counts in upgrade_clicks_by_surface as lock:modal_<reason>).
  useEffect(() => { if (open) track("upgrade_clicked", null, `modal_${slug(reason)}`); }, [open, reason]);
  if (!open || typeof document === "undefined") return null;
  const plus = perDay("plus_monthly"), pro = perDay("pro_monthly");
  return createPortal(
    <div className="fixed inset-0 z-[250] grid place-items-center p-3 sm:p-6">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={close} />
      <div role="dialog" aria-modal="true" aria-label="Choose a plan" className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-3">
          <p className="inline-flex min-w-0 items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]"><Sparkles className="h-4 w-4 shrink-0 text-amber-500" aria-hidden /> <span className="truncate">{reason ?? "Choose your plan"}</span></p>
          <button type="button" onClick={close} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] cursor-pointer"><X className="h-4 w-4" /></button>
        </div>
        {plus && pro && <p className="border-b border-[var(--border)] bg-[var(--tint-butter)] px-5 py-2 text-xs font-semibold text-[var(--tint-butter-ink)]">Plus is about {plus} a day and Pro about {pro} a day. One payment, no auto-renewal.</p>}
        <div className="overflow-y-auto overscroll-contain p-4 sm:p-6 custom-scrollbar"><PlansContent inModal onDone={close} /></div>
      </div>
    </div>,
    document.body,
  );
}
