"use client";

/**
 * Study materials (R12): our own lessons per syllabus topic, sold as a separate study pass per branch.
 * One sample chapter (Deadlock) is free. Runs on sample data until Phase 0 ships (lib/preview/features.ts).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpenText, Check, Clock, Lightbulb, Lock, TriangleAlert } from "lucide-react";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { PlanCompare } from "@/components/preview/plan-compare";
import { FolderTabs } from "@/components/ui/folder-tabs";
import { UPCOMING } from "@/lib/preview/features";
import { SAMPLE_LESSON, STUDY_SUBJECTS, type StudyChapter } from "@/lib/preview/sample-data";

export default function StudyPage() {
  const [reading, setReading] = useState(false);
  return (
    <div className="space-y-6 pb-8">
      <PreviewFrame state={UPCOMING.study} name="Study materials" when="Lessons for every GATE CS topic, written by us and checked against official papers. Other branches follow.">
        {(tier) => reading ? <Lesson onBack={() => setReading(false)} /> : <Library owned={tier === "pro"} onRead={() => setReading(true)} />}
      </PreviewFrame>
    </div>
  );
}

function Library({ owned, onRead }: { owned: boolean; onRead: () => void }) {
  const [sub, setSub] = useState(STUDY_SUBJECTS[0].id);
  const s = STUDY_SUBJECTS.find((x) => x.id === sub)!;
  const total = STUDY_SUBJECTS.reduce((a, x) => a + x.chapters.length, 0);
  return (
    <>
      <section className="card-pastel overflow-hidden p-6 sm:p-8" data-tint="mint" aria-label="Study materials">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <span className="section-label"><BookOpenText className="h-3.5 w-3.5" /> Study materials</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] text-[var(--text-primary)] sm:text-5xl">Learn it once,<br />the way GATE asks it.</h1>
            <p className="mt-3 max-w-xl text-[var(--text-secondary)]">Every lesson starts with how often GATE asks the topic, then the idea, a worked example with our own numbers, the traps, a quick check and the real PYQs to try next.</p>
          </div>
          <div className="card-inset space-y-3 p-5">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{owned ? "Your study pass is active" : "Study pass for GATE CS"}</p>
            <p className="font-display text-2xl font-extrabold text-[var(--text-primary)]">{owned ? `${total} chapters unlocked` : "Price announced at launch"}</p>
            {owned ? <button type="button" onClick={onRead} className="btn-main">Continue: Deadlock</button>
              : <button type="button" onClick={onRead} className="btn-main">Read the free chapter</button>}
          </div>
        </div>
      </section>

      <FolderTabs label="Subjects" value={sub} onChange={setSub} tabs={STUDY_SUBJECTS.map((x) => ({ id: x.id, label: x.name, tint: x.tint }))}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">{s.name}</h2>
          <p className="text-sm text-[var(--text-muted)]">About <span className="font-num font-bold text-[var(--text-secondary)]">{s.marks}</span> marks a paper</p>
        </div>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {s.chapters.map((c, i) => <ChapterRow key={c.id} c={c} n={i + 1} tint={s.tint} locked={!owned && !c.free} onRead={onRead} />)}
        </ul>
      </FolderTabs>
      <PlanCompare title="Study materials by plan" rows={[
        ["Free sample chapter (Deadlock)", "✓", "✓", "✓"],
        ["Every chapter of your branch", "Study pass", "Study pass", "Study pass"],
        ["Check-yourself questions and linked PYQs", "Sample only", "✓", "✓"],
        ["Ask the AI Mentor about any lesson", "Free daily AI", "Plus daily AI", "Pro daily AI"],
        ["Read offline", "—", "—", "✓"],
      ]} />
      <p className="text-sm text-[var(--text-muted)]">The study pass is a separate one-time purchase per branch; its price is announced at launch.</p>
    </>
  );
}

function ChapterRow({ c, n, tint, locked, onRead }: { c: StudyChapter; n: number; tint: string; locked: boolean; onRead: () => void }) {
  const pct = Math.round((c.done / c.topics) * 100);
  return (
    <li className="min-w-0">
      <button type="button" disabled={locked} onClick={onRead}
        className="group flex w-full items-center gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition-colors hover:border-[var(--text-secondary)] disabled:cursor-not-allowed disabled:opacity-70">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-num text-lg font-extrabold" style={{ background: `var(--tint-${tint})`, color: `var(--tint-${tint}-ink)` }}>{n}</span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2"><span className="truncate font-bold text-[var(--text-primary)]">{c.title}</span>{c.free && <span className="rounded-full bg-[var(--tint-mint)] px-2 py-0.5 text-xs font-bold text-[var(--tint-mint-ink)]">Free</span>}</span>
          <span className="mt-0.5 flex items-center gap-3 text-xs text-[var(--text-muted)]"><span>{c.topics} topics</span><span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{c.minutes} min</span><span>{c.weight} marks a paper</span></span>
          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><span className="block h-full rounded-full bg-[var(--ink)]" style={{ width: `${pct}%` }} /></span>
        </span>
        {locked ? <Lock className="h-4 w-4 text-[var(--text-muted)]" /> : pct === 100 ? <Check className="h-4 w-4 text-emerald-500" /> : null}
      </button>
    </li>
  );
}

function Lesson({ onBack }: { onBack: () => void }) {
  const L = SAMPLE_LESSON;
  const [shown, setShown] = useState(false);
  const toc = ["Why it matters", "The idea", "Definition", "Worked example", "Trap", "Check yourself", "Try the real PYQs"];
  // The contents list follows the section being read (and the one clicked).
  const [active, setActive] = useState(0);
  useEffect(() => {
    const root = document.getElementById("app-scroll");
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(Number(vis.target.id.slice(2)));
    }, { root, rootMargin: "-10% 0px -60% 0px" });
    toc.forEach((_, i) => { const el = document.getElementById(`l-${i}`); if (el) io.observe(el); });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_300px]">
      <nav aria-label="In this lesson" className="lg:sticky lg:top-24 lg:self-start">
        <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><ArrowLeft className="h-4 w-4" /> All chapters</button>
        <ol className="hidden space-y-1 border-l border-[var(--border)] lg:block">
          {toc.map((t, i) => <li key={t}><a href={`#l-${i}`} onClick={(e) => { e.preventDefault(); setActive(i); document.getElementById(`l-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            aria-current={i === active ? "true" : undefined}
            className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm transition-colors ${i === active ? "border-[var(--ink)] font-semibold text-[var(--text-primary)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>{t}</a></li>)}
        </ol>
      </nav>
      <article className="min-w-0 max-w-none space-y-8">
        <header>
          <p className="text-sm font-semibold text-[var(--text-muted)]">{L.subject} · {L.chapter}</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">{L.topic}</h1>
        </header>
        <section id="l-0" className="card-pastel p-5" data-tint="butter"><p className="font-semibold text-[var(--text-primary)]">{L.why}</p></section>
        <section id="l-1"><h2 className="lesson-h">The idea</h2><p className="lesson-p">{L.intuition}</p></section>
        <section id="l-2" className="rounded-2xl border-l-4 border-[var(--ink)] bg-[var(--surface)] p-5"><p className="text-sm font-bold text-[var(--text-muted)]">Definition</p><p className="mt-1 leading-relaxed text-[var(--text-primary)]">{L.definition}</p></section>
        <section id="l-3">
          <h2 className="lesson-h">Worked example</h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full text-sm">
              <thead><tr className="bg-[var(--surface-secondary)]">{L.table.head.map((h) => <th key={h} scope="col" className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">{h}</th>)}</tr></thead>
              <tbody>{L.table.rows.map((r) => <tr key={r[0]} className="border-t border-[var(--border)]">{r.map((c, i) => <td key={i} className={`px-4 py-2.5 ${i ? "font-num" : "font-semibold"} text-[var(--text-primary)]`}>{c}</td>)}</tr>)}</tbody>
            </table>
            <p className="border-t border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text-secondary)]">Available: <span className="font-num font-bold text-[var(--text-primary)]">{L.table.available}</span></p>
          </div>
          <ol className="mt-4 space-y-3">{L.steps.map((s, i) => <li key={i} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--ink)] font-num text-xs font-bold text-[var(--background)]">{i + 1}</span><p className="lesson-p">{s}</p></li>)}</ol>
        </section>
        <section id="l-4" className="card-pastel flex gap-3 p-5" data-tint="rose"><TriangleAlert className="h-5 w-5 shrink-0 text-[var(--tint-rose-ink)]" /><p className="text-[var(--text-primary)]"><b>Trap:</b> {L.trap}</p></section>
        <section id="l-5" className="card-pastel p-5" data-tint="peri">
          <p className="flex items-center gap-2 font-bold text-[var(--text-primary)]"><Lightbulb className="h-4 w-4" /> Check yourself</p>
          <p className="mt-2 text-[var(--text-primary)]">{L.check.q}</p>
          {shown ? <p className="mt-3 rounded-xl bg-[var(--surface)] p-3 text-sm text-[var(--text-primary)]">{L.check.a}</p>
            : <button type="button" onClick={() => setShown(true)} className="pill-ink mt-3">Show answer</button>}
        </section>
        <section id="l-6">
          <h2 className="lesson-h">Try the real PYQs</h2>
          <div className="flex flex-wrap gap-2">{L.pyqs.map((p) => <Link key={p} href="/setup" className="pill-soft">{p}</Link>)}</div>
        </section>
      </article>
      {/* Side rail: progress, the PYQs, what's next and a quick AI ask, so the reading column has company. */}
      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start" aria-label="Lesson tools">
        <div className="card-pastel p-5" data-tint="mint">
          <p className="text-sm font-semibold text-[var(--text-secondary)]">This chapter</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-[var(--text-primary)]">3 of 7 topics</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface)]"><div className="h-full w-[43%] rounded-full bg-[var(--tint-mint-ink)]" /></div>
        </div>
        <div className="card-pastel p-5" data-tint="peri">
          <p className="font-bold text-[var(--text-primary)]">GATE asks this</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{L.pyqs.length} recent PYQs on the Banker&apos;s algorithm, mostly 2 marks.</p>
          <Link href="/setup" className="pill-ink mt-3 inline-flex">Practise them</Link>
        </div>
        <div className="card-pastel p-5" data-tint="butter">
          <p className="text-sm font-semibold text-[var(--text-secondary)]">Next lesson</p>
          <p className="mt-1 font-bold text-[var(--text-primary)]">Deadlock detection and recovery</p>
        </div>
        <div className="card-pastel p-5" data-tint="sky">
          <p className="font-bold text-[var(--text-primary)]">Stuck on a step?</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Ask the AI Mentor about this lesson.</p>
          <Link href="/ai-mentor" className="pill-soft mt-3 inline-flex">Ask the AI Mentor</Link>
        </div>
      </aside>
    </div>
  );
}
