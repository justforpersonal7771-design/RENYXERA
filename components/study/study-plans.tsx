"use client";

/**
 * Study packs and bundles, built like the Plus/Pro plans screen and the Mentor recharges: a hero deal, tiers that get cheaper
 * per subject as they grow, honest struck-through sums, and a nudge towards the next size up ("add Maths and Aptitude for ₹200
 * more"). Study is a separate product from Plus and Pro (docs/study-materials/13). Prices come from lib/study/packs.ts; the
 * amount charged always comes from /api/billing/study.
 */
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Bot, BookOpenText, Check, FlaskConical, Highlighter, History, ListChecks, ScrollText, type LucideIcon } from "lucide-react";
import { CS_SHELF } from "@/lib/study/catalog";
import { BUILD_YOUR_OWN_OFF, BUNDLES, FREE_TOPICS, PACKS, bestBundleFor, bundleSum, customPrice, packTotal, perPack, rupees, type Bundle } from "@/lib/study/packs";
import { useStudyCheckout } from "@/components/study/pack-checkout";
import { PriceRoll } from "@/components/ui/price-roll";
import type { ShopView } from "@/store/use-study-shop-store";

const LOOK = {
  silver: { deco: "var(--tint-sky-ink)", ring: "border-transparent bg-[var(--tint-sky)]", kicker: "text-slate-600 dark:text-slate-300", btn: "bg-[var(--btn)] text-[var(--btn-fg)]" },
  gold: { deco: "var(--tint-butter-ink)", ring: "border-transparent bg-[var(--tint-butter)] shadow-[0_20px_50px_-28px_rgba(12,34,75,0.35)]", kicker: "text-amber-700 dark:text-amber-300", btn: "bg-[var(--btn)] text-[var(--btn-fg)]" },
  rose: { deco: "var(--tint-rose-ink)", ring: "border-transparent bg-[var(--tint-rose)]", kicker: "text-[var(--tint-rose-ink)]", btn: "bg-[var(--btn)] text-[var(--btn-fg)]" },
  peri: { deco: "var(--tint-peri-ink)", ring: "border-transparent bg-[var(--tint-peri)]", kicker: "text-[var(--tint-peri-ink)]", btn: "bg-[var(--btn)] text-[var(--btn-fg)]" },
  plain: { deco: "var(--text-primary)", ring: "border-[var(--border)] bg-[var(--surface)]", kicker: "text-[var(--text-muted)]", btn: "bg-[var(--btn)] text-[var(--btn-fg)]" },
};
const packName = (id: string) => PACKS.find((p) => p.id === id)?.name ?? id;
const shortName = (id: string) => packName(id).replace(/^Computer /, "").replace(/ Management Systems?/, "").replace(/ & Data Structures/, " & DS").replace(/Linear Algebra, Probability & Calculus/, "LA, Prob & Calc");
const readyOf = (id: string) => { const p = PACKS.find((x) => x.id === id)!; const books = p.books.map((b) => CS_SHELF.find((x) => x.id === b)!).filter(Boolean); const r = books.filter((b) => b.chapters.some((c) => c.href)).length; return r === books.length ? "Ready" : r ? `${r} of ${books.length} books ready` : "Coming soon"; };
/** The individual books inside some packs, in shelf order ("Linear Algebra, Probability & Calculus" becomes three books). */
const booksOf = (ids: readonly string[]) => ids.flatMap((id) => PACKS.find((p) => p.id === id)?.books ?? []).map((b) => CS_SHELF.find((x) => x.id === b)?.title ?? b);
const pct = (sum: number, price: number) => Math.round(((sum - price) / sum) * 100);
/** What a pack really is: a study room, not a PDF. Every line is something the reader already has today. */
const FEATURES: { I: LucideIcon; t: string; d: string; tint: string }[] = [
  { I: FlaskConical, t: "Labs you can break", d: "Drag, step and tweak a live model in every topic. See the algorithm fail, then fix it.", tint: "mint" },
  { I: ListChecks, t: "Quiz after every topic", d: "Check yourself with GATE-style questions. Instant answers, and the traps explained.", tint: "butter" },
  { I: Highlighter, t: "Highlights and notes", d: "Select any line to save it. Your notes sit beside the lesson and stay with you.", tint: "sky" },
  { I: Bot, t: "Ask the Mentor", d: "Stuck on a line? Ask without leaving the page. It knows what you are reading.", tint: "lilac" },
  { I: ScrollText, t: "Past GATE questions", d: "The real PYQs for the topic, one tap away. Learn it, then see how GATE asked it.", tint: "rose" },
  { I: History, t: "Remembers everything", d: "Resumes where you stopped, tracks what you read, and splits two chapters side by side.", tint: "peach" },
];
const SKIN_OF = { silver: "plan-sky", gold: "plan-gold", rose: "plan-rose", peri: "plan-peri", plain: "plan-silver" } as const;
const B = (id: string) => BUNDLES.find((b) => b.id === id)!;

export function StudyPlans({ owned, all, onBought, initialView = "bundles" }: { owned: string[]; all: boolean; onBought: () => void; initialView?: ShopView }) {
  const [view, setView] = useState<ShopView>(initialView);
  const [pick, setPick] = useState<string[]>([]);
  const checkout = useStudyCheckout(onBought);
  const owns = (id: string) => all || owned.includes(id);
  const cta = (label: string) => (checkout.live ? label : "Notify me when it opens");
  const everything = B("everything"), core = B("core"), maths = B("maths");
  const apt = PACKS.find((p) => p.id === "apt")!;
  const extra = everything.pricePaise - core.pricePaise;
  const sectionsSum = core.pricePaise + maths.pricePaise + apt.pricePaise;

  /** One bundle as a plan column: struck sum, price, saving, price per subject, subjects as chips, a full-width button. */
  const bundleCard = (b: Bundle, look: keyof typeof LOOK, i: number, tag?: string, nudge?: React.ReactNode, big = false) => {
    const sum = bundleSum(b); const have = b.packs.every(owns); const marks = b.packs.reduce((t, id) => t + (PACKS.find((p) => p.id === id)?.marks ?? 0), 0);
    const L = LOOK[look];
    return (
      <motion.section key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className={`relative flex flex-col overflow-hidden rounded-3xl border ${big ? "p-7 sm:p-8" : "p-6"} ${SKIN_OF[look]} plan-card`}>
        <span aria-hidden className="shop-deco pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.12]" style={{ background: L.deco }} />
        {tag && <span className="absolute -top-3 left-6 z-[3] rounded-full border border-[color-mix(in_srgb,var(--tint-butter-ink)_25%,transparent)] bg-[var(--tint-butter)] px-2.5 py-1 text-xs font-black text-[var(--tint-butter-ink)] shadow">{tag}</span>}
        <p className={`${big ? "text-base" : "text-sm"} font-black plan-kicker`}>{b.name} · {booksOf(b.packs).length} {booksOf(b.packs).length === 1 ? "book" : "books"}</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {sum > b.pricePaise && <span className="text-lg font-bold text-[var(--text-muted)] line-through decoration-rose-500/70 decoration-2">{rupees(sum)}</span>}
          <span className={`${big ? "text-5xl" : "text-4xl"} font-extrabold text-[var(--text-primary)]`}><PriceRoll value={rupees(b.pricePaise)} /></span>
          
          {sum > b.pricePaise && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-black text-emerald-700 dark:text-emerald-300">Save {pct(sum, b.pricePaise)}%</span>}
        </div>
        <p className="mt-1 text-balance text-xs font-semibold text-[var(--text-secondary)]">{sum > b.pricePaise ? `Just ${rupees(Math.round(b.pricePaise / booksOf(b.packs).length / 100) * 100)} a book instead of ${rupees(Math.round(sum / booksOf(b.packs).length / 100) * 100)}` : "One pack covers the whole section"} · about {marks.toFixed(1)} marks a paper</p>
        <p className="mt-1 text-balance text-xs text-[var(--text-muted)]">{b.note}</p>
        <ul className="mb-4 mt-3 flex flex-1 flex-wrap content-start gap-1.5" aria-label={`Subjects in ${b.name}`}>
          {booksOf(b.packs).map((n) => <li key={n} className="shop-chip inline-flex items-center rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-bold text-[var(--text-primary)] shadow-sm">{n}</li>)}
        </ul>
        {nudge && <p className="shop-note mb-3 rounded-xl bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]">{nudge}</p>}
        <button type="button" disabled={have} onClick={() => void checkout.start(`bundle:${b.id}`)} className={`mt-auto inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-bold shadow-lg disabled:opacity-60 ${L.btn} shop-cta`}>{have ? "You own all of these" : cta(`Get ${b.name}`)}</button>
      </motion.section>
    );
  };

  return (
    <section id="packs" aria-label="Study packs and bundles" className="scroll-mt-24 space-y-8">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/12 px-3 py-1 text-xs font-bold text-violet-700 dark:text-violet-300"><BookOpenText className="h-3.5 w-3.5" /> Study packs</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">Every GATE subject, <span className="grad-brand bg-clip-text text-transparent">book by book</span></h2>
        <p className="mx-auto mt-3 max-w-xl text-balance text-[var(--text-secondary)]">Learn it, try it, test it, remember it. Separate from Plus and Pro, open until your GATE season ends. Every book opens with {FREE_TOPICS} free topics.</p>
        {owned.length > 0 && <p className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"><Check className="h-4 w-4" /> You own {owned.length} pack{owned.length === 1 ? "" : "s"}: {owned.map(packName).join(", ")}</p>}
      </header>

      <div>
        <p className="mb-3 text-center font-display text-xl font-extrabold text-[var(--text-primary)]">Not a PDF. A study room.</p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.t} className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `var(--tint-${f.tint})`, color: `var(--tint-${f.tint}-ink)` }}><f.I className="h-5 w-5" aria-hidden /></span>
              <span className="min-w-0"><b className="block text-[var(--text-primary)]">{f.t}</b><span className="mt-0.5 block text-sm leading-snug text-[var(--text-secondary)]">{f.d}</span></span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pointer-events-none sticky -top-2 z-20 flex justify-center py-3 sm:-top-3">
        <div role="radiogroup" aria-label="Study pack options" className="pointer-events-auto relative grid w-full max-w-md grid-cols-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[0_10px_24px_-12px_rgba(20,16,40,.45)]">
          <span aria-hidden className="absolute inset-y-1 left-1 rounded-xl border border-[color-mix(in_srgb,var(--tint-lilac-ink)_30%,transparent)] bg-[var(--tint-lilac)] transition-transform duration-300 motion-reduce:transition-none" style={{ width: "calc((100% - 0.5rem) / 3)", transform: `translateX(${(["bundles", "single", "custom"] as const).indexOf(view) * 100}%)`, transitionTimingFunction: "cubic-bezier(.23,1,.32,1)" }} />
          {(["bundles", "single", "custom"] as const).map((v) => (
            <button key={v} type="button" role="radio" aria-checked={view === v} onClick={() => setView(v)} className={`relative z-10 h-10 cursor-pointer rounded-xl px-1 text-xs font-bold leading-tight transition-colors duration-200 sm:text-sm ${view === v ? "text-[var(--tint-lilac-ink)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>{v === "bundles" ? "Bundles" : v === "single" ? "Single subjects" : "Build your own"}</button>
          ))}
        </div>
      </div>

      {view === "bundles" && (
        <div className="hub-in space-y-8">
          {/* the hero deal: the whole library */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="plan-card plan-gold relative grid gap-6 rounded-3xl border border-transparent p-6 shadow-[0_20px_50px_-28px_rgba(12,34,75,0.35)] sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-10">
            <span className="plan-badge plan-gold absolute -top-3 left-6 z-[3] rounded-full px-3 py-1 text-xs font-black">Best value</span>
            <div className="flex min-w-0 flex-col">
              <p className="plan-kicker text-sm font-black">Everything · the whole library</p>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl"><PriceRoll value={rupees(everything.pricePaise)} /></span>
                <span className="text-lg font-bold text-[var(--text-muted)] line-through decoration-rose-500/70 decoration-2">{rupees(bundleSum(everything))}</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-black text-emerald-700 dark:text-emerald-300">Save {pct(bundleSum(everything), everything.pricePaise)}%</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">Just {rupees(perPack(everything))} a subject.</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)] text-balance">Bought one section at a time it is {rupees(sectionsSum)}: you save {rupees(sectionsSum - everything.pricePaise)}.</p>
              <button type="button" disabled={everything.packs.every(owns)} onClick={() => void checkout.start("bundle:everything")} className="mt-5 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[var(--btn)] font-bold text-[var(--btn-fg)] shadow-lg disabled:opacity-60 lg:mt-auto shop-cta">{everything.packs.every(owns) ? "You own all of these" : cta("Get Everything")}</button>
            </div>
            <div className="grid min-w-0 content-start gap-3">
              {([["Core CS", core.packs, "rose"], ["Engineering Maths", maths.packs, "sky"], ["General Aptitude", ["apt"], "peri"]] as const).map(([label, ids, tint]) => {
                const names = booksOf(ids);
                return (
                  <div key={label} className="relative overflow-hidden rounded-2xl p-4" style={{ background: `var(--tint-${tint})` }}>
                    <span aria-hidden className="shop-deco pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.14]" style={{ background: `var(--tint-${tint}-ink)` }} />
                    <p className="flex items-baseline gap-2 text-base font-extrabold" style={{ color: `var(--tint-${tint}-ink)` }}>{label}<span className="shop-chip rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-black">{names.length} {names.length === 1 ? "book" : "books"}</span></p>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">{names.map((n) => <li key={n} className="shop-chip rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-bold text-[var(--text-primary)] shadow-sm">{n}</li>)}</ul>
                  </div>
                );
              })}
            </div>
          </motion.section>
          <div>
            <h3 className="mb-3 text-lg font-extrabold text-[var(--text-primary)]">Or take one section</h3>
            <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
              {bundleCard(core, "rose", 1, undefined, <>Add Maths and Aptitude for just {rupees(extra)} more: pick Everything.</>, true)}
              {bundleCard(maths, "silver", 2, undefined, <>Maths alone is {rupees(maths.pricePaise)}. With Core CS and Aptitude, Everything is {rupees(everything.pricePaise)}.</>, true)}
              {bundleCard(B("apt"), "peri", 3, undefined, <>With Core CS and Maths, Everything is {rupees(everything.pricePaise)}: about {rupees(perPack(everything))} a subject.</>, true)}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-extrabold text-[var(--text-primary)]">Themed bundles</h3>
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["marks5", "tough4", "systems", "theory"].map((id, i) => bundleCard(B(id), "plain", 3 + i))}
            </div>
          </div>
        </div>
      )}

      {view === "single" && (
        <div className="hub-in grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PACKS.map((p) => {
            const up = BUNDLES.find((b) => (b.id === "core" || b.id === "maths") && b.packs.includes(p.id));
            return (
              <section key={p.id} className="flex flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-sm font-black text-[var(--text-muted)]">{p.name}</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-extrabold text-[var(--text-primary)]">{rupees(p.pricePaise)}</span></div>
                <p className="text-xs font-semibold text-[var(--text-secondary)]">about {p.marks} marks a paper · ≈ {rupees(Math.round(p.pricePaise / p.marks / 100) * 100)} per mark</p>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">{readyOf(p.id)}</p>
                {up ? <button type="button" onClick={() => void checkout.start(`bundle:${up.id}`)} className="mb-5 mt-2 flex-1 text-left text-xs font-bold text-[var(--text-primary)] underline decoration-dotted underline-offset-4">Or all {up.packs.length} {up.name} subjects for {rupees(up.pricePaise)}: {rupees(perPack(up))} each. <ArrowRight className="inline h-3 w-3" aria-hidden /></button> : <span className="mb-5 flex-1" />}
                <button type="button" disabled={owns(p.id)} onClick={() => void checkout.start(`pack:${p.id}`)} className="mt-auto inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[var(--btn)] font-bold text-[var(--btn-fg)] disabled:opacity-60">{owns(p.id) ? "Owned" : cta(`Get ${shortName(p.id)}`)}</button>
              </section>
            );
          })}
        </div>
      )}

      {view === "custom" && (
        <section className="hub-in rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
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
          {(() => {
            const bb = pick.length >= 2 ? bestBundleFor(pick) : null; const mine = pick.length >= 3 ? customPrice(pick) : packTotal(pick);
            const diff = bb ? bb.pricePaise - mine : 0;
            return <>
              <p className="mt-3 text-xs text-[var(--text-secondary)]">{pick.length < 3 ? `Pick ${3 - pick.length} more to get ${BUILD_YOUR_OWN_OFF}% off.` : `${pick.length} packs: you save ${rupees(packTotal(pick) - customPrice(pick))}.`} A curated bundle is always at least as good a deal for the same subjects.</p>
              {bb && diff <= 30000 && <button type="button" onClick={() => void checkout.start(`bundle:${bb.id}`)} className="mt-3 w-full rounded-xl bg-[var(--tint-butter)] px-4 py-3 text-left text-sm font-bold text-[var(--tint-butter-ink)]">{diff > 0 ? `For ${rupees(diff)} more, ${bb.name} has all of these and ${bb.packs.length - pick.length} more subjects (${rupees(bb.pricePaise)} in all).` : `${bb.name} has all of these and ${bb.packs.length - pick.length} more subjects, for ${rupees(bb.pricePaise)}: less than this list.`} <ArrowRight className="inline h-3.5 w-3.5" aria-hidden /></button>}
            </>;
          })()}
          <button type="button" disabled={pick.length < 3} onClick={() => void checkout.start(`custom:${pick.join(",")}`)} className="mt-4 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[var(--btn)] font-bold text-[var(--btn-fg)] disabled:opacity-50 sm:w-auto sm:px-8">{cta(pick.length >= 3 ? `Get my bundle · ${rupees(customPrice(pick))}` : "Get my bundle")}</button>
        </section>
      )}
      <p className="text-center text-xs text-[var(--text-muted)]">Prices include taxes. Refunds only for our errors (double charge, a payment that did not activate, a fault we cannot fix), by email.{checkout.live ? " Payments are processed securely." : " No payment is taken yet."}</p>
      {checkout.modal}
    </section>
  );
}
