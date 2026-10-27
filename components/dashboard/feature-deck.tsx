"use client";

/**
 * "Your toolkit" deck on the dashboard: one large pastel card per part of the app, stacked with the
 * sticky deck effect. Left: what it does + the student's own numbers + action. Right: a live mini
 * preview drawn from real data (no invented figures).
 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { StackCards } from "./stack-cards";
import type { SubjectAnalytics, TopicAnalytics } from "@/types/analytics.types";

type Props = {
  solved: number; totalBank: number; paper: string; accuracy: number; pendingMistakes: number;
  subjects: SubjectAnalytics[]; topics: TopicAnalytics[]; studyHours: number; streak: number; daysToGate: number | null;
};

function Card({ tint, label, title, body, stats, cta, href, preview }: {
  tint: string; label: string; title: string; body: string; stats: { v: string; l: string }[]; cta: string; href: string; preview: React.ReactNode;
}) {
  return (
    <section className="card-pastel grid content-center gap-5 overflow-hidden p-5 sm:p-7 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center" data-tint={tint}>
      <div className="min-w-0">
        <span className="section-label">{label}</span>
        <h3 className="mt-3 font-display text-2xl sm:text-[1.7rem] font-extrabold leading-tight tracking-tight text-[var(--text-primary)]">{title}</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{body}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {stats.map((s) => (
            <div key={s.l}><p className="font-num text-2xl font-extrabold text-[var(--text-primary)] leading-none">{s.v}</p><p className="mt-1 text-[11px] text-[var(--text-muted)]">{s.l}</p></div>
          ))}
        </div>
        <Link href={href} className="pill-ink mt-5">{cta} <ArrowRight className="w-4 h-4" /></Link>
      </div>
      <div className="card-inset min-w-0 p-4">{preview}</div>
    </section>
  );
}

function Bars({ rows }: { rows: { label: string; value: number; tone?: string }[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between gap-3 text-xs font-semibold text-[var(--text-primary)]"><span className="truncate">{r.label}</span><span className={`font-num ${r.tone ?? ""}`}>{r.value}%</span></div>
          <div className="mt-1 h-2 rounded-full bg-[color-mix(in_srgb,var(--tint-ink)_12%,transparent)] overflow-hidden">
            <motion.div className="h-full rounded-full bg-[var(--tint-ink)]" initial={reduce ? false : { width: 0 }} whileInView={{ width: `${r.value}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function FeatureDeck(p: Props) {
  const acc = (c: number, a: number) => (a ? Math.round((c / a) * 100) : 0);
  const subj = [...p.subjects].filter((s) => s.attempted).sort((a, b) => b.attempted - a.attempted).slice(0, 4);
  const weak = [...p.topics].filter((t) => t.attempted >= 2).sort((a, b) => a.correct / a.attempted - b.correct / b.attempted).slice(0, 4);
  const coverage = p.totalBank ? Math.round((p.solved / p.totalBank) * 100) : 0;

  const items = [
    <Card key="pyq" tint="mint" label="PYQ bank" title="Every official GATE question, by topic" href="/browse" cta="Browse topics"
      body={`Every GATE ${p.paper} paper from 2017 to 2026, sorted into the exact topic it tests. Open a topic and practise it in the real exam screen.`}
      stats={[{ v: p.totalBank.toLocaleString("en-IN"), l: "official questions" }, { v: String(p.solved), l: "you've solved" }, { v: `${coverage}%`, l: "covered" }]}
      preview={<div><p className="text-xs font-bold tracking-normal text-[var(--text-muted)]">Your coverage</p>
        <div className="mt-3 grid grid-cols-10 gap-1">{Array.from({ length: 50 }, (_, i) => <span key={i} className={`aspect-square rounded-[4px] ${i < Math.round(coverage / 2) ? "bg-emerald-500" : "bg-[color-mix(in_srgb,var(--tint-ink)_12%,transparent)]"}`} />)}</div>
        <p className="mt-3 text-sm text-[var(--text-secondary)]"><span className="font-num text-xl font-extrabold text-[var(--text-primary)]">{p.solved}</span> of {p.totalBank.toLocaleString("en-IN")} done</p></div>} />,
    <Card key="mock" tint="peri" label="Mock tests" title="Practise the real paper, against the clock" href="/mocks" cta="See mocks"
      body="Full 65-question papers with the official timer, palette, calculator and marking. A free All-India mock every Sunday with your rank."
      stats={[{ v: "65", l: "questions" }, { v: "100", l: "marks" }, { v: "3 hrs", l: "timer" }]}
      preview={<div className="flex items-center gap-4">
        <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full border-[6px] border-[var(--tint-ink)]"><span className="font-num text-sm font-extrabold text-[var(--text-primary)]">{p.daysToGate ?? "–"}<span className="block text-[9px] font-semibold text-[var(--text-muted)] text-center">days</span></span></div>
        <div className="grid flex-1 grid-cols-8 gap-1">{Array.from({ length: 32 }, (_, i) => <span key={i} className={`h-3 rounded-sm ${i % 7 === 3 ? "bg-violet-500" : i < 20 ? "bg-emerald-500" : "bg-[color-mix(in_srgb,var(--tint-ink)_14%,transparent)]"}`} />)}</div>
      </div>} />,
    <Card key="weak" tint="lilac" label="Progress" title="See your weak spots before GATE does" href="/analytics" cta="Open analytics"
      body="Every answer is tracked by subject and topic. See what's strong, what's slipping and what to revise next."
      stats={[{ v: `${Math.round(p.accuracy)}%`, l: "accuracy" }, { v: String(p.pendingMistakes), l: "mistakes to revise" }]}
      preview={subj.length ? <Bars rows={subj.map((s, i) => ({ label: s.subject.replace(/\s*\(.*\)/, ""), value: acc(s.correct, s.attempted), tone: i === subj.length - 1 && acc(s.correct, s.attempted) < 40 ? "text-rose-600" : "" }))} />
        : <p className="text-sm text-[var(--text-secondary)]">Your subjects appear here after your first test.</p>} />,
    <Card key="revise" tint="rose" label="Fix it" title="Turn every mistake into marks" href="/revision" cta="Start revision"
      body="Wrong answers go to your revision queue automatically and come back at the right time, until you get them right."
      stats={[{ v: String(p.pendingMistakes), l: "waiting" }, { v: `${p.streak}d`, l: "streak" }]}
      preview={weak.length ? <Bars rows={weak.map((t) => ({ label: t.topic, value: acc(t.correct, t.attempted), tone: "text-rose-600" }))} />
        : <p className="text-sm text-[var(--text-secondary)]">Your weakest topics show up here.</p>} />,
    <Card key="mentor" tint="sky" label="AI Mentor" title="Ask why, at 1 AM, and get your exact mistake explained" href="/ai-mentor" cta="Ask AI Mentor"
      body="Eight expert coaches that read your attempts, explain step by step, and tell you what to do next."
      stats={[{ v: "8", l: "coaches" }, { v: "24×7", l: "available" }]}
      preview={<div className="space-y-2 text-xs">
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--tint-ink)] px-3 py-2 text-white">Why is my answer to this deadlock question wrong?</p>
        <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-[var(--surface)] px-3 py-2 text-[var(--text-primary)] border border-[var(--border)]">You checked only the current request. Banker&apos;s algorithm needs a safe sequence for <b>all</b> processes — let&apos;s find it step by step…</p>
      </div>} />,
    <Card key="plan" tint="peach" label="Study planner" title="A plan that fits your day" href="/calendar" cta="Open planner"
      body="Exact hours per subject, reminders on Telegram before each block, and a re-plan when you fall behind."
      stats={[{ v: `${p.studyHours}h`, l: "studied" }, { v: p.daysToGate != null ? String(p.daysToGate) : "–", l: "days left" }]}
      preview={<ul className="space-y-1.5 text-xs">{["Revise mistakes", "Practise weakest topic", "Full mock (Sunday)"].map((t, i) => (
        <li key={t} className="flex items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-2 border border-[var(--border)]"><span className={`h-4 w-4 rounded-md ${i === 0 ? "bg-[var(--tint-ink)]" : "border-2 border-[var(--tint-ink)]"}`} /><span className="flex-1 text-[var(--text-primary)]">{t}</span><span className="text-[var(--text-muted)]">{["30m", "1h", "3h"][i]}</span></li>))}</ul>} />,
  ];
  return (
    // Swaseekh-style pinned stack: heading at the top of the pinned area, cards filling the screen below it,
    // symbols in the heading row where cards can never cover them.
    <section aria-label="Your toolkit" className="deck-frame">
      <StackCards items={items} header={
        <div className="mb-2 flex shrink-0 items-center justify-center gap-4">
          <DeckCharacters side="left" />
          <div className="text-center"><span className="section-label mx-auto">Your toolkit</span><h2 className="mt-1.5 font-display text-2xl font-extrabold text-[var(--text-primary)] sm:text-3xl">Everything you need, in one place</h2></div>
          <DeckCharacters side="right" />
        </div>
      } />
    </section>
  );
}

/** GATE symbols as soft highlighter shapes beside the heading (decorative, hidden on phones). */
function DeckCharacters({ side }: { side: "left" | "right" }) {
  const C = side === "left"
    ? [{ g: "Σ", tint: "butter", cls: "rotate-[-12deg] rounded-[38%]" }, { g: "π", tint: "peri", cls: "rotate-[8deg] rounded-full" }]
    : [{ g: "∫", tint: "mint", cls: "rotate-[10deg] rounded-[30%_70%_60%_40%]" }, { g: "λ", tint: "rose", cls: "rotate-[-8deg] rounded-[45%]" }];
  return (
    <div aria-hidden className="pointer-events-none hidden gap-3 sm:flex">
      {C.map((c) => (
        <span key={c.g} className={`grid h-14 w-14 place-items-center font-display text-3xl font-extrabold shadow-[0_12px_28px_-16px_rgba(22,18,58,.4)] ${c.cls}`}
          style={{ background: `var(--tint-${c.tint})`, color: `var(--tint-${c.tint}-ink)` }}>{c.g}</span>
      ))}
    </div>
  );
}
