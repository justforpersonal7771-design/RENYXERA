"use client";

/**
 * Renders a study chapter from data (lib/study/schema.ts) in the blueprint order. One reading column, a sticky topic
 * outline on desktop, figures from the diagram engine, check questions you can answer in place.
 */
import { useState } from "react";
import { Check, Lightbulb, TriangleAlert, Zap, Target, Link2, Repeat } from "lucide-react";
import type { Block, Chapter, CheckQ, Topic } from "@/lib/study/schema";
import { Diagram } from "@/components/study/diagram";

const box = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5";

function CheckQuestion({ q, n }: { q: CheckQ; n: number }) {
  const [pick, setPick] = useState<string[]>([]);
  const [nat, setNat] = useState("");
  const [shown, setShown] = useState(false);
  const letters = ["A", "B", "C", "D"];
  const toggle = (l: string) => setPick((p) => (q.kind === "MSQ" ? (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]) : [l]));
  const mine = q.kind === "NAT" ? nat.trim() : [...pick].sort().join(", ");
  const right = shown && mine === q.answer;
  return (
    <li className={box}>
      <p className="text-xs font-bold text-[var(--text-secondary)]">Question {n} · {q.kind} · {q.marks} mark{q.marks > 1 ? "s" : ""}{q.kind === "MCQ" ? (q.marks === 1 ? " · −1/3 if wrong" : " · −2/3 if wrong") : " · no negative marks"}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-primary)]">{q.q}</p>
      {q.options ? (
        <ul className="mt-3 grid gap-2">{q.options.map((o, i) => (
          <li key={i}><button type="button" onClick={() => !shown && toggle(letters[i])} aria-pressed={pick.includes(letters[i])}
            className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${pick.includes(letters[i]) ? "border-[var(--text-primary)] bg-[var(--surface-secondary)]" : "border-[var(--border)]"}`}>
            <b className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--border)] text-xs">{letters[i]}</b><span className="text-[var(--text-primary)]">{o}</span></button></li>
        ))}</ul>
      ) : (
        <input value={nat} onChange={(e) => setNat(e.target.value)} inputMode="decimal" aria-label="Your answer" placeholder="Your answer" className="mt-3 h-10 w-40 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--text-primary)]" />
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setShown(true)} disabled={shown} className="btn-main !h-10 disabled:opacity-60">Check</button>
        {shown && <span className={`text-sm font-bold ${right ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--text-primary)]"}`}>{right ? "Correct" : `Answer: ${q.answer}`}</span>}
      </div>
      {shown && <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{q.solution}</p>}
    </li>
  );
}

function FadedStep({ s }: { s: { say: string; blank?: boolean; answer?: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="text-[15px] leading-relaxed text-[var(--text-primary)]">{s.say}
      {s.blank && (open ? <p className="mt-1 text-sm text-[var(--text-secondary)]">{s.answer}</p> : <button type="button" onClick={() => setOpen(true)} className="ml-2 text-sm font-bold underline underline-offset-4">Show answer</button>)}
    </li>
  );
}

function BlockView({ b, qStart }: { b: Block; qStart: number }) {
  switch (b.type) {
    case "hook": return <p className="text-lg font-semibold leading-relaxed text-[var(--text-primary)]">{b.text}</p>;
    case "objectives": return <div className={box}><p className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]"><Target className="h-4 w-4" aria-hidden /> What you will learn</p><ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-[var(--text-primary)]">{b.items.map((t) => <li key={t}>{t}</li>)}</ul></div>;
    case "intuition": return <section><h3 className="lesson-h">The idea</h3>{b.paras.map((p, i) => <p key={i} className="lesson-p mt-2">{p}</p>)}{b.analogyLimit && <p className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3 text-sm text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">Where the picture breaks: </b>{b.analogyLimit}</p>}</section>;
    case "definition": return <section className={`${box} border-l-0`}><h3 className="lesson-h !mb-1">{b.name}</h3><p className="lesson-p">{b.text}</p>{b.items && <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] text-[var(--text-primary)]">{b.items.map((t) => <li key={t}>{t}</li>)}</ol>}</section>;
    case "walkthrough": return <section><h3 className="lesson-h">Step by step</h3><ol className="mt-2 space-y-2">{b.steps.map((s, i) => <li key={i} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-xs font-bold text-[var(--background)]">{i + 1}</span><p className="lesson-p">{s}</p></li>)}</ol>{b.prompt && <details className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3"><summary className="cursor-pointer text-sm font-bold text-[var(--text-primary)]">Think: {b.prompt.q}</summary><p className="mt-2 text-sm text-[var(--text-secondary)]">{b.prompt.a}</p></details>}</section>;
    case "figure": return <figure className={`${box} grid justify-items-center gap-2`}><Diagram fig={b.fig} /><figcaption className="text-center text-sm text-[var(--text-secondary)]">{b.caption}</figcaption><span className="sr-only">{b.alt}</span></figure>;
    case "example": return <section className={box}><p className="text-xs font-bold text-[var(--text-secondary)]">Worked example{b.level === "edge" ? " · edge case" : b.level === "gate" ? " · GATE level" : ""}</p><h3 className="lesson-h !mt-1">{b.title}</h3><p className="lesson-p"><b>Given: </b>{b.given}</p><p className="lesson-p mt-1"><b>Find: </b>{b.find}</p><ol className="mt-3 space-y-2">{b.steps.map((s, i) => <li key={i} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--border)] text-xs font-bold">{i + 1}</span><p className="lesson-p">{s.say}{s.result && <b className="ml-1 text-[var(--text-primary)]">→ {s.result}</b>}</p></li>)}</ol><p className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3 font-bold text-[var(--text-primary)]">Answer: {b.answer}</p>{b.check && <p className="mt-2 text-sm text-[var(--text-secondary)]"><b>Check it another way: </b>{b.check}</p>}</section>;
    case "faded": return <section className={box}><p className="text-xs font-bold text-[var(--text-secondary)]">Try it</p><h3 className="lesson-h !mt-1">{b.title}</h3><p className="lesson-p">{b.given}</p><ol className="mt-2 list-decimal space-y-2 pl-5">{b.steps.map((s, i) => <FadedStep key={i} s={s} />)}</ol></section>;
    case "trap": return <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--st-accent)_7%,var(--surface))] p-4"><p className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]"><TriangleAlert className="h-4 w-4" aria-hidden /> Trap: {b.wrong}</p><p className="mt-2 text-sm text-[var(--text-secondary)]"><b>Why it feels right: </b>{b.tempting}</p><p className="mt-1 text-sm text-[var(--text-secondary)]"><b>Why it is wrong: </b>{b.whyWrong}</p><p className="mt-2 text-sm font-bold text-[var(--text-primary)]">Rule: {b.rule}</p></section>;
    case "shortcut": return <section className={box}><p className="flex items-center gap-2 text-sm font-bold"><Zap className="h-4 w-4" aria-hidden /> Shortcut</p><p className="lesson-p mt-1">{b.text}</p><p className="mt-1 text-sm text-[var(--text-secondary)]">Valid when: {b.validWhen}</p></section>;
    case "gate": return <section className={box}><p className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]"><Lightbulb className="h-4 w-4" aria-hidden /> How GATE asks it</p><p className="lesson-p mt-1">{b.text}</p></section>;
    case "recall": return <section className={box}><p className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]"><Repeat className="h-4 w-4" aria-hidden /> Recall cards</p><ul className="mt-2 grid gap-2 sm:grid-cols-3">{b.cards.map((c) => <li key={c.q}><details className="h-full rounded-xl bg-[var(--surface-secondary)] p-3"><summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)]">{c.q}</summary><p className="mt-1 text-sm text-[var(--text-secondary)]">{c.a}</p></details></li>)}</ul></section>;
    case "check": return <section><h3 className="lesson-h flex items-center gap-2"><Check className="h-5 w-5" aria-hidden /> Check yourself</h3><ol className="mt-2 grid gap-3">{b.questions.map((q, i) => <CheckQuestion key={q.id} q={q} n={qStart + i} />)}</ol></section>;
    case "links": return <section className={box}><p className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]"><Link2 className="h-4 w-4" aria-hidden /> How this connects</p><div className="mt-2 grid gap-3 text-sm sm:grid-cols-3">{([["Needs", b.prereq], ["Used later in", b.usedIn], ["Other subjects", b.cross]] as const).map(([h, l]) => l?.length ? <div key={h}><p className="font-bold text-[var(--text-primary)]">{h}</p><ul className="mt-1 list-disc pl-5 text-[var(--text-secondary)]">{l.map((x) => <li key={x}>{x}</li>)}</ul></div> : null)}</div></section>;
  }
}

function TopicView({ t, index }: { t: Topic; index: number }) {
  // question numbers run on across the topic's check blocks
  const starts = t.blocks.reduce<number[]>((acc, b, i) => { acc.push((acc[i - 1] ?? 1) + (i > 0 && t.blocks[i - 1].type === "check" ? (t.blocks[i - 1] as Extract<Block, { type: "check" }>).questions.length : 0)); return acc; }, []);
  return (
    <article id={t.id} className="scroll-mt-24 space-y-5">
      <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)] sm:text-3xl">{index + 1}. {t.title}</h2>
      {t.blocks.map((b, i) => <BlockView key={i} b={b} qStart={starts[i]} />)}
    </article>
  );
}

export function LessonRenderer({ chapter }: { chapter: Chapter }) {
  return (
    <div className="study-lesson grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]" style={{ ["--st-accent" as string]: "#c2410c" }}>
      <nav aria-label="Chapter topics" className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-bold text-[var(--text-secondary)]">{chapter.subject}</p>
        <p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{chapter.title}</p>
        <div className="mt-3"><Diagram fig={chapter.map} /></div>
      </nav>
      <div className="min-w-0 max-w-3xl space-y-12">
        {chapter.topics.map((t, i) => <TopicView key={t.id} t={t} index={i} />)}
      </div>
    </div>
  );
}
