"use client";

/** Test Centre hub: a "start here" hero that picks the best next test, and a bento of doors that fills the screen. */
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, BarChart3, Layers, Play, RotateCcw, Settings, Swords, Timer } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";
import { TEST_CENTRE } from "@/lib/test-centre/brand";

const door = "card-pastel group flex min-w-0 flex-col p-5";
const Arrow = () => <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />;
const cta = "mt-4 inline-flex items-center gap-1 text-sm font-bold text-[var(--text-primary)]";
const h2 = "mt-3 font-display text-xl font-extrabold text-[var(--text-primary)]";

export default function TestCentrePage() {
  const { mistakes, loadStudyData } = useStudyStore();
  useEffect(() => { void loadStudyData(); }, [loadStudyData]);
  const open = mistakes.filter((m) => !m.mastered).length;
  const next = open > 0
    ? { href: "/revision", title: `Revise ${Math.min(open, 10)} mistakes`, why: `${open} questions you got wrong are waiting. Clearing a few now is the quickest gain.`, cta: "Start revising" }
    : { href: "/test-centre/build", title: "Build your next test", why: "Pick a source, the subjects and a length, and start a timed test.", cta: "Build a test" };

  return (
    <div className="flex w-full flex-col gap-5 lg:min-h-[calc(100dvh-9.5rem)]" data-fill-height="always">
      <section className="card-well shrink-0 p-5 sm:p-6" data-tint="mint" aria-label="Start here">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">{TEST_CENTRE} · start here</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-extrabold text-[var(--text-primary)]">{next.title}</h1>
            <p className="mt-1 max-w-2xl text-[var(--text-secondary)]">{next.why}</p>
          </div>
          <Link href={next.href} className="btn-main"><Play className="h-4 w-4" /> {next.cta}</Link>
        </div>
      </section>

      <div className="grid flex-1 grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2">
        <Link href="/test-centre/build" data-tint="mint" className={`${door} xl:col-span-2 xl:row-span-2`}>
          <Settings className="h-7 w-7 text-[var(--text-primary)]" aria-hidden />
          <h2 className="mt-3 font-display text-2xl font-extrabold text-[var(--text-primary)]">Build a test</h2>
          <p className="mt-1 text-[var(--text-secondary)]">Choose the questions and how you take them.</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--text-secondary)]">
            {["GATE PYQs, Forge, Spark or Blend as the source", "Official papers, topic tests or a custom mix", "Subjects, difficulty and length your way", "Timed like the real exam, with the calculator and palette"].map((t) => (
              <li key={t} className="rounded-2xl bg-[var(--surface)] px-3 py-2">{t}</li>
            ))}
          </ul>
          <span className={cta}>Build <Arrow /></span>
        </Link>
        <Link href="/test-centre/mocks" data-tint="peri" className={door}>
          <Timer className="h-6 w-6 text-[var(--text-primary)]" aria-hidden />
          <h2 className={h2}>Mocks</h2>
          <p className="mt-1 flex-1 text-sm text-[var(--text-secondary)]">All-India mocks under exam conditions, with a rank.</p>
          <span className={cta}>Open mocks <Arrow /></span>
        </Link>
        <Link href="/test-centre/practice" data-tint="rose" className={door}>
          <RotateCcw className="h-6 w-6 text-[var(--text-primary)]" aria-hidden />
          <h2 className={h2}>Practice</h2>
          <p className="mt-1 flex-1 text-sm text-[var(--text-secondary)]">{open ? `${open} mistakes waiting for revision.` : "Revise mistakes with spaced repetition."}</p>
          <span className={cta}>Practise <Arrow /></span>
        </Link>
        <Link href="/test-centre/build?view=flashcards" data-tint="butter" className={door}>
          <Layers className="h-6 w-6 text-[var(--text-primary)]" aria-hidden />
          <h2 className={h2}>Flashcards</h2>
          <p className="mt-1 flex-1 text-sm text-[var(--text-secondary)]">Quick recall cards, due ones first.</p>
          <span className={cta}>Open cards <Arrow /></span>
        </Link>
        <Link href="/challenge" data-tint="lilac" className={door}>
          <Swords className="h-6 w-6 text-[var(--text-primary)]" aria-hidden />
          <h2 className={h2}>Challenge a friend</h2>
          <p className="mt-1 flex-1 text-sm text-[var(--text-secondary)]">Same questions, compare scores.</p>
          <span className={cta}>Challenge <Arrow /></span>
        </Link>
      </div>

      <Link href="/test-centre/history" data-tint="sky" className="card-pastel group flex shrink-0 items-center gap-3 p-4">
        <BarChart3 className="h-6 w-6 shrink-0 text-[var(--text-primary)]" aria-hidden />
        <span className="min-w-0 flex-1"><span className="block font-display text-lg font-extrabold text-[var(--text-primary)]">History</span><span className="block text-sm text-[var(--text-secondary)]">Every test you have taken, with results and review.</span></span>
        <Arrow />
      </Link>
    </div>
  );
}
