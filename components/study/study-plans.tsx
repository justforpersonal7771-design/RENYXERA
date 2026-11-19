"use client";

/**
 * Study packs and bundles, laid out like the Plus/Pro plans screen (same header, period-style switch, tier columns, honest
 * struck-through sums). Study is a separate product from Plus and Pro (docs/study-materials/13); prices from lib/study/packs.ts,
 * the amount charged always from /api/billing/study.
 */
import { useState } from "react";
import { motion } from "motion/react";
import { BookOpenText, Check, Sparkles } from "lucide-react";
import { CS_SHELF } from "@/lib/study/catalog";
import { BUILD_YOUR_OWN_OFF, BUNDLES, FREE_TOPICS, PACKS, customPrice, packTotal, rupees } from "@/lib/study/packs";
import { useStudyCheckout } from "@/components/study/pack-checkout";
import { PriceRoll } from "@/components/ui/price-roll";

const LOOK = {
  silver: { ring: "border-transparent bg-[var(--tint-sky)]", kicker: "text-slate-600 dark:text-slate-300", btn: "bg-[var(--tint-sky)] text-[var(--tint-sky-ink)] border border-[color-mix(in_srgb,var(--tint-sky-ink)_25%,transparent)]" },
  gold: { ring: "border-transparent bg-[var(--tint-butter)] shadow-[0_20px_50px_-28px_rgba(12,34,75,0.35)]", kicker: "text-amber-700 dark:text-amber-300", btn: "bg-[var(--tint-butter)] text-[var(--tint-butter-ink)] border border-[color-mix(in_srgb,var(--tint-butter-ink)_25%,transparent)]" },
  plain: { ring: "border-[var(--border)] bg-[var(--surface)]", kicker: "text-[var(--text-muted)]", btn: "bg-[var(--btn)] text-[var(--btn-fg)]" },
};
const packName = (id: string) => PACKS.find((p) => p.id === id)?.name ?? id;
const readyOf = (id: string) => { const p = PACKS.find((x) => x.id === id)!; const books = p.books.map((b) => CS_SHELF.find((x) => x.id === b)!).filter(Boolean); const r = books.filter((b) => b.chapters.some((c) => c.href)).length; return r === books.length ? "Ready" : r ? `${r} of ${books.length} books ready` : "Coming soon"; };

export function StudyPlans({ owned, all, onBought }: { owned: string[]; all: boolean; onBought: () => void }) {
  const [view, setView] = useState<"bundles" | "single" | "custom">("bundles");
  const [pick, setPick] = useState<string[]>([]);
  const checkout = useStudyCheckout(onBought);
  const owns = (id: string) => all || owned.includes(id);
  const cta = (label: string) => (checkout.live ? label : "Notify me when it opens");

  return (
    <section id="packs" aria-label="Study packs and bundles" className="scroll-mt-24 space-y-8">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300"><BookOpenText className="h-3.5 w-3.5" /> Study packs</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">Every GATE CS subject, <span className="grad-brand bg-clip-text text-transparent">book by book</span></h2>
        <p className="mt-3 text-[var(--text-secondary)]">Study is bought separately from Plus and Pro: one pack per subject, or a bundle for less. One payment, no renewal, open until the end of your GATE season. Every book starts with {FREE_TOPICS} free sample topics.</p>
        {owned.length > 0 && <p className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"><Check className="h-4 w-4" /> You own {owned.length} pack{owned.length === 1 ? "" : "s"}: {owned.map(packName).join(", ")}</p>}
        <div className="mt-6 inline-flex rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1" role="radiogroup" aria-label="Study pack options">
          {(["bundles", "single", "custom"] as const).map((v) => (
            <button key={v} type="button" role="radio" aria-checked={view === v} onClick={() => setView(v)} className={`relative h-9 cursor-pointer rounded-xl px-4 text-sm font-bold sm:px-5 ${view === v ? "text-white" : "text-[var(--text-secondary)]"}`}>
              {view === v && <motion.span layoutId="study-view-pill" className="nav-active-pill absolute inset-0 rounded-xl" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              <span className="relative">{v === "bundles" ? "Bundles" : v === "single" ? "Single subjects" : "Build your own"}</span>
            </button>
          ))}
        </div>
      </header>

      {view === "bundles" && (
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          {BUNDLES.map((b, i) => {
            const sum = packTotal(b.packs); const save = Math.round(((sum - b.pricePaise) / sum) * 100); const look = b.id === "complete" ? LOOK.gold : b.id === "marks5" ? LOOK.silver : LOOK.plain; const have = b.packs.every(owns);
            const marks = b.packs.reduce((t, id) => t + (PACKS.find((p) => p.id === id)?.marks ?? 0), 0);
            return (
              <motion.section key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className={`relative flex flex-col rounded-3xl border p-6 ${look.ring} ${b.id === "complete" ? "lg:col-span-1" : ""}`}>
                {b.id === "complete" && <span className="absolute -top-3 left-6 rounded-full border border-[color-mix(in_srgb,var(--tint-butter-ink)_25%,transparent)] bg-[var(--tint-butter)] px-2.5 py-1 text-xs font-black text-[var(--tint-butter-ink)] shadow">Best value</span>}
                <p className={`text-sm font-black ${look.kicker}`}>{b.name}</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-lg font-bold text-[var(--text-muted)] line-through decoration-rose-500/70 decoration-2">{rupees(sum)}</span>
                  <span className="text-3xl font-extrabold text-[var(--text-primary)]"><PriceRoll value={rupees(b.pricePaise)} /></span>
                  <span className="text-sm font-semibold text-[var(--text-muted)]">one time</span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-black text-emerald-700 dark:text-emerald-300">Save {save}%</span>
                </div>
                <p className="text-xs font-semibold text-[var(--text-secondary)]">{b.note} · about {marks.toFixed(1)} marks a paper</p>
                <p className="mt-3 text-xs text-[var(--text-muted)]">{b.packs.length} subject packs (separately {rupees(sum)}):</p>
                <ul className="mb-6 mt-3 flex-1 space-y-2">{b.packs.map((id) => <li key={id} className="flex items-start gap-2 text-sm"><Sparkles className={`mt-0.5 h-4 w-4 shrink-0 ${look.kicker}`} /><span><b className="text-[var(--text-primary)]">{packName(id)}</b><span className="block text-xs text-[var(--text-secondary)]">{readyOf(id)}{owns(id) ? " · you own this" : ""}</span></span></li>)}</ul>
                <button type="button" disabled={have} onClick={() => void checkout.start(`bundle:${b.id}`)} className={`mt-auto inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-bold shadow-lg disabled:opacity-60 ${look.btn}`}>{have ? "You own all of these" : cta(`Get ${b.name}`)}</button>
              </motion.section>
            );
          })}
        </div>
      )}

      {view === "single" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PACKS.map((p) => (
            <section key={p.id} className="flex flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="text-sm font-black text-[var(--text-muted)]">{p.name}</p>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-extrabold text-[var(--text-primary)]">{rupees(p.pricePaise)}</span><span className="text-sm font-semibold text-[var(--text-muted)]">one time</span></div>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">about {p.marks} marks a paper · ≈ {rupees(Math.round(p.pricePaise / p.marks / 100) * 100)} per mark</p>
              <p className="mb-5 mt-3 flex-1 text-sm text-[var(--text-secondary)]">{readyOf(p.id)}</p>
              <button type="button" disabled={owns(p.id)} onClick={() => void checkout.start(`pack:${p.id}`)} className="mt-auto inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[var(--btn)] font-bold text-[var(--btn-fg)] disabled:opacity-60">{owns(p.id) ? "Owned" : cta(`Get ${p.name.split(" ")[0]}`)}</button>
            </section>
          ))}
        </div>
      )}

      {view === "custom" && (
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-black text-[var(--text-muted)]">Build your own · any 3 or more packs, {BUILD_YOUR_OWN_OFF}% off</p>
            <div className="flex flex-wrap items-baseline gap-x-2">
              {pick.length >= 3 && <span className="text-lg font-bold text-[var(--text-muted)] line-through decoration-rose-500/70 decoration-2">{rupees(packTotal(pick))}</span>}
              <span className="text-3xl font-extrabold text-[var(--text-primary)]">{rupees(pick.length >= 3 ? customPrice(pick) : packTotal(pick))}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PACKS.map((p) => { const on = pick.includes(p.id); const disabled = owns(p.id); return (
              <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm ${on ? "border-[var(--text-primary)] bg-[var(--surface-secondary)]" : "border-[var(--border)]"} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}>
                <input type="checkbox" disabled={disabled} checked={on} onChange={(e) => setPick((x) => (e.target.checked ? [...x, p.id] : x.filter((y) => y !== p.id)))} className="accent-violet-600" aria-label={`Pick ${p.name}`} />
                <span className="min-w-0 flex-1"><b className="text-[var(--text-primary)]">{p.name}</b><span className="block text-xs text-[var(--text-secondary)]">{disabled ? "Owned" : readyOf(p.id)}</span></span>
                <span className="font-num font-bold">{rupees(p.pricePaise)}</span>
              </label>
            ); })}
          </div>
          <p className="mt-3 text-xs text-[var(--text-secondary)]">{pick.length < 3 ? `Pick ${3 - pick.length} more to get ${BUILD_YOUR_OWN_OFF}% off.` : `${pick.length} packs: you save ${rupees(packTotal(pick) - customPrice(pick))}.`} A curated bundle is always at least as good a deal for the same subjects.</p>
          <button type="button" disabled={pick.length < 3} onClick={() => void checkout.start(`custom:${pick.join(",")}`)} className="mt-4 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[var(--btn)] font-bold text-[var(--btn-fg)] disabled:opacity-50 sm:w-auto sm:px-8">{cta(pick.length >= 3 ? `Get my bundle · ${rupees(customPrice(pick))}` : "Get my bundle")}</button>
        </section>
      )}
      <p className="text-center text-xs text-[var(--text-muted)]">Prices include taxes. Refunds only for our errors (double charge, a payment that did not activate, a fault we cannot fix), by email.{checkout.live ? " Payments are processed securely." : " No payment is taken yet."}</p>
      {checkout.modal}
    </section>
  );
}
