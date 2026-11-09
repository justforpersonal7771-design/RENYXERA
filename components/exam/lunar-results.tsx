"use client";

/**
 * Lunar results scoreboard. One flowing page instead of a flip card:
 *  1. Hero: your marks, the verdict, and a three-part ring (right / wrong / skipped) that says exactly what happened.
 *  2. Tiles: time, attempted, penalty, average time per question.
 *  3. Fix these first: the subjects you missed most, each with a practise button.
 *  4. Breakdown by subject / section / difficulty / type.
 *  5. Question map: every question as a cell; tap one to open its review.
 * Every number comes from the same calculation the classic screen uses (passed in as props).
 */
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Clock, Flag, Gauge, Hourglass, ListChecks, MinusCircle, Target, Wrench } from "lucide-react";

export type Split = { label: string; attempted: number; correct: number; wrong: number; marks: number; max: number };
export type GridItem = { index: number; isAttempted: boolean; isCorrect: boolean; isPending: boolean; isMarked: boolean };
type Tab = "subject" | "section" | "difficulty" | "type";
const TABS: { id: Tab; label: string }[] = [{ id: "subject", label: "Subject" }, { id: "section", label: "Section" }, { id: "difficulty", label: "Difficulty" }, { id: "type", label: "Type" }];
const C = { right: "#16a34a", wrong: "#ef4444", skip: "color-mix(in srgb, var(--text-primary) 24%, transparent)" };
const r2 = (n: number) => Math.round(n * 100) / 100;

function Ring({ correct, wrong, skipped, total, accuracy }: { correct: number; wrong: number; skipped: number; total: number; accuracy: number }) {
  const R = 78, CIR = 2 * Math.PI * R, gap = total > 1 ? 3 : 0;
  const seg = (n: number) => Math.max(0, (n / Math.max(1, total)) * CIR - (n > 0 ? gap : 0));
  const parts = [{ n: correct, color: C.right, key: "c" }, { n: wrong, color: C.wrong, key: "w" }, { n: skipped, color: C.skip, key: "s" }];
  let start = 0;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px]">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" role="img" aria-label={`${correct} right, ${wrong} wrong, ${skipped} skipped out of ${total}`}>
        <circle cx="100" cy="100" r={R} fill="none" stroke="currentColor" strokeOpacity=".07" strokeWidth="20" className="text-[var(--text-primary)]" />
        {parts.map((p) => {
          const len = seg(p.n), off = -start; start += (p.n / Math.max(1, total)) * CIR;
          if (len <= 0) return null;
          return <motion.circle key={p.key} cx="100" cy="100" r={R} fill="none" stroke={p.color} strokeWidth="20" strokeLinecap="butt" strokeDashoffset={off}
            initial={{ strokeDasharray: `0 ${CIR}` }} animate={{ strokeDasharray: `${len} ${CIR - len}` }} transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} />;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><p className="font-display text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">{Math.round(accuracy)}<span className="text-2xl">%</span></p><p className="text-xs font-bold text-[var(--text-secondary)]">accuracy</p></div>
      </div>
    </div>
  );
}

export function LunarResults(p: {
  title: string; goalTag?: ReactNode; verdict: { label: string; message: string }; extraLine?: string | null;
  marks: number; max: number; accuracy: number; correct: number; wrong: number; skipped: number; attempted: number; totalQs: number;
  timeText: string; elapsedSeconds: number; penalty: number;
  splits: Record<Tab, Split[]>; grid: GridItem[]; actions: ReactNode; banner?: ReactNode;
  onOpenQuestion: (i: number) => void;
}) {
  const [tab, setTab] = useState<Tab>("subject");
  const rows = [...p.splits[tab]].sort((a, b) => b.wrong - a.wrong || a.label.localeCompare(b.label));
  const fix = [...p.splits.subject].filter((s) => s.wrong > 0).sort((a, b) => b.wrong - a.wrong || (a.correct / Math.max(1, a.attempted)) - (b.correct / Math.max(1, b.attempted))).slice(0, 4);
  const avg = p.attempted ? Math.round(p.elapsedSeconds / p.attempted) : 0;
  const pct = p.max ? Math.max(0, p.marks) / p.max : 0;

  return (
    <div className="w-full space-y-6 pb-6">
      {p.banner}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div><span className="section-label"><Target className="h-3.5 w-3.5" /> Results</span><h1 className="mt-2 font-display text-2xl font-extrabold text-[var(--text-primary)] sm:text-3xl">{p.title}</h1></div>
        {p.goalTag}
      </header>

      {/* 1. hero */}
      <section className="card-pastel p-5 sm:p-8" data-tint="sky" aria-label="Score">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <Ring correct={p.correct} wrong={p.wrong} skipped={p.skipped} total={p.totalQs} accuracy={p.accuracy} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--text-secondary)]">{p.verdict.label}</p>
            <p className="mt-1 font-display text-5xl font-extrabold leading-none tracking-tight text-[var(--text-primary)] sm:text-6xl"><span className="font-num">{r2(p.marks)}</span><span className="text-2xl font-bold text-[var(--text-muted)] sm:text-3xl"> / {p.max}</span></p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]"><motion.div className="h-full rounded-full bg-[var(--ink)]" initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} /></div>
            <p className="mt-4 max-w-xl text-[var(--text-primary)]">{p.extraLine ?? p.verdict.message}</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm font-bold text-[var(--text-secondary)]">
              <li className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: C.right }} />{p.correct} right</li>
              <li className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: C.wrong }} />{p.wrong} wrong</li>
              <li className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: C.skip }} />{p.skipped} skipped</li>
            </ul>
            <div className="mt-5">{p.actions}</div>
          </div>
        </div>
      </section>

      {/* 2. tiles */}
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([[Clock, "Time taken", p.timeText, "lilac"], [ListChecks, "Attempted", `${p.attempted} / ${p.totalQs}`, "mint"], [MinusCircle, "Penalty", p.penalty ? `-${r2(p.penalty)}` : "0", "peach"], [Hourglass, "Per question", avg ? `${avg}s` : "–", "butter"]] as const).map(([Icon, l, v, t]) => (
          <li key={l} className="card-pastel flex items-center gap-3 p-4" data-tint={t}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[var(--surface)]"><Icon className="h-5 w-5" aria-hidden /></span><span className="min-w-0"><span className="block font-display text-xl font-extrabold leading-tight text-[var(--text-primary)]"><span className="font-num">{v}</span></span><span className="block text-xs font-bold text-[var(--text-secondary)]">{l}</span></span></li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* 3. fix these first */}
        <section className="card-pastel p-5" data-tint="peach" aria-label="Fix these first">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-[var(--text-primary)]"><Wrench className="h-4 w-4" />Fix these first</h2>
          {fix.length === 0 ? <p className="mt-3 text-[var(--text-secondary)]">{p.attempted ? "Nothing wrong in this set. Try a harder one." : "Attempt some questions and your weak subjects show up here."}</p> : (
            <ul className="mt-3 space-y-2.5">{fix.map((s) => (
              <li key={s.label} className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-3">
                <span className="min-w-0 flex-1"><span className="block truncate font-bold text-[var(--text-primary)]">{s.label}</span><span className="text-xs text-[var(--text-secondary)]">{s.wrong} wrong of {s.attempted} attempted · {Math.round((s.correct / Math.max(1, s.attempted)) * 100)}% right</span></span>
                <Link href={`/setup?subject=${encodeURIComponent(s.label)}`} className="pill-ink shrink-0">Practise</Link>
              </li>))}</ul>)}
        </section>

        {/* 4. breakdown */}
        <section className="card-pastel p-5" data-tint="lilac" aria-label="Breakdown">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-[var(--text-primary)]"><Gauge className="h-4 w-4" />Breakdown</h2>
            <div className="flex gap-1 rounded-full bg-[var(--surface)] p-1" role="tablist" aria-label="Group by">{TABS.map((t) => <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`rounded-full px-3 py-1 text-xs font-bold ${tab === t.id ? "bg-[var(--ink)] text-[var(--background)]" : "text-[var(--text-secondary)]"}`}>{t.label}</button>)}</div>
          </div>
          <ul className="mt-4 space-y-3">{rows.map((s) => {
            const a = Math.max(1, s.attempted), cw = (s.correct / a) * 100, ww = (s.wrong / a) * 100;
            return (
              <li key={s.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm"><span className="min-w-0 truncate font-bold text-[var(--text-primary)]">{s.label}</span><span className="font-num shrink-0 text-xs text-[var(--text-secondary)]">{r2(s.marks)} / {s.max} marks</span></div>
                <div className="mt-1 flex h-2.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]" role="img" aria-label={`${s.correct} right, ${s.wrong} wrong`}>
                  <div style={{ width: `${cw}%`, background: C.right }} /><div style={{ width: `${ww}%`, background: C.wrong }} />
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{s.attempted ? `${s.correct} right · ${s.wrong} wrong · ${Math.round((s.correct / a) * 100)}%` : "Not attempted"}</p>
              </li>);
          })}</ul>
        </section>
      </div>

      {/* 5. question map */}
      <section className="card-pastel p-5" data-tint="mint" aria-label="Question map">
        <h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">Question map</h2>
        <p className="text-sm text-[var(--text-secondary)]">Tap a question to open its review.</p>
        <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(46px,1fr))] gap-2">
          {p.grid.map((g) => {
            const state = g.isPending ? "pending" : !g.isAttempted ? "skip" : g.isCorrect ? "right" : "wrong";
            const style = state === "right" ? { background: C.right, color: "#fff", border: "2px solid transparent" } : state === "wrong" ? { background: C.wrong, color: "#fff", border: "2px solid transparent" } : state === "pending" ? { border: "2px dashed #d97706", color: "var(--text-primary)", background: "transparent" } : { border: "2px solid color-mix(in srgb, var(--text-primary) 18%, transparent)", color: "var(--text-secondary)", background: "transparent" };
            return <li key={g.index}><button type="button" onClick={() => p.onOpenQuestion(g.index)} aria-label={`Question ${g.index + 1}: ${state === "right" ? "right" : state === "wrong" ? "wrong" : state === "pending" ? "pending" : "skipped"}${g.isMarked ? ", marked" : ""}`} style={style} className="relative grid h-11 w-full cursor-pointer place-items-center rounded-xl font-num text-sm font-bold transition-transform hover:-translate-y-0.5">{g.index + 1}{g.isMarked && <Flag className="absolute right-0.5 top-0.5 h-3 w-3 fill-amber-500 text-amber-500" />}</button></li>;
          })}
        </ul>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-bold text-[var(--text-secondary)]"><li className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: C.right }} />Right</li><li className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: C.wrong }} />Wrong</li><li className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2" style={{ borderColor: C.skip }} />Skipped</li><li className="inline-flex items-center gap-1.5"><Flag className="h-3 w-3 fill-amber-500 text-amber-500" />Marked</li></ul>
      </section>
    </div>
  );
}
