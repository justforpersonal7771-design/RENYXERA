"use client";

/**
 * Test Centre hub. Top: today's mission (with your four numbers inside it) beside the upcoming mock and the next scheduled mocks.
 * Below: the doors, with Build a test as the one big tile on the left and the others on the right. Sources (GATE PYQs, Forge,
 * Spark, Blend) are chosen inside Build a test, so they are not repeated here.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { CountUp } from "@/components/ui/count-up";
import { ArrowRight, BarChart3, Check, Layers, Play, RotateCcw, Settings, Swords, Timer, Trophy } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { summarizeSession, type Attempt } from "@/features/test-centre/model";
import { MockStatusCard } from "@/components/dashboard/mock-status-card";
import { UpcomingMocks } from "@/components/test-centre/upcoming-mocks";
import { TEST_CENTRE } from "@/lib/test-centre/brand";

const tile = "card-pastel group relative flex min-w-0 flex-col justify-between overflow-hidden p-5";
const ink = "text-[var(--text-primary)]";
const Arrow = () => <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />;
const Mark = ({ I, size = "h-24 w-24" }: { I: typeof Timer; size?: string }) => <I aria-hidden className={`tile-mark pointer-events-none absolute bottom-3 right-3 ${size} -rotate-12 text-[var(--text-primary)] opacity-[0.07] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110`} />;
const Sticker = ({ children, tilt = "-rotate-2" }: { children: React.ReactNode; tilt?: string }) => <span className={`inline-block self-start ${tilt} rounded-full border-2 border-[var(--text-primary)]/70 bg-[var(--surface)] px-2.5 py-0.5 text-xs font-extrabold ${ink}`}>{children}</span>;

export default function TestCentrePage() {
  const { mistakes, loadStudyData } = useStudyStore();
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);
  useEffect(() => { void loadStudyData(); }, [loadStudyData]);
  useEffect(() => {
    let alive = true;
    void IDBManager.getAllExamSessions().then((r) => { if (alive) setAttempts(r.map((x) => summarizeSession(x.sessionData as never)).filter((a) => a.submitted).sort((a, b) => b.startedAt.localeCompare(a.startedAt))); });
    return () => { alive = false; };
  }, []);

  const open = mistakes.filter((m) => !m.mastered).length;
  const taken = attempts?.length ?? 0;
  const last = attempts?.[0];
  const lastPct = last && last.marks != null && last.maxMarks ? Math.round((last.marks / last.maxMarks) * 100) : null;

  // The mission: three steps in order. The first one not done is highlighted; the first is "revise" when mistakes are waiting.
  const steps = [
    { n: 1, label: open ? `Revise ${Math.min(open, 10)} mistakes` : "Revise (nothing waiting)", href: "/revision", done: open === 0 },
    { n: 2, label: "Take a timed test", href: "/test-centre/build", done: taken > 0 && !!last && Date.now() - Date.parse(last.startedAt) < 86400000 },
    { n: 3, label: "Check your results", href: "/test-centre/history", done: false },
  ];
  const current = steps.findIndex((s) => !s.done);
  const stats: { v: number | null; suffix?: string; l: string; t: string }[] = [
    { v: open, l: "mistakes waiting", t: "rose" }, { v: taken, l: "tests taken", t: "peri" },
    { v: lastPct, suffix: "%", l: "last test score", t: "butter" }, { v: attempts ? attempts.filter((a) => a.kind === "mock").length : 0, l: "mocks taken", t: "sky" },
  ];

  return (
    <div className="flex w-full flex-col gap-4 lg:min-h-[calc(100dvh-12rem)]">
      {/* Phone order: mission, then the doors (the actions), then mock info. From lg the two blocks sit side by side again. */}
      <div className="contents lg:grid lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-4">
        <section className="card-well relative order-1 flex flex-col overflow-hidden p-4 sm:p-5 lg:order-none" data-tint="mint" aria-label="Today's mission">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-[var(--tint-mint-ink)] opacity-10" />
          <Sticker>{TEST_CENTRE} · today&apos;s mission</Sticker>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">{current === 0 && open ? `Clear ${Math.min(open, 10)} mistakes first` : current === 1 ? "Now take a timed test" : "See how you did"}</h1>
            <Link href={steps[Math.max(current, 0)].href} className="btn-main !h-10 !text-sm"><Play className="h-4 w-4" /> Start step {steps[Math.max(current, 0)].n}</Link>
          </div>
          <ol className="relative mt-3 flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="Mission steps">
            {steps.map((s, i) => (
              <li key={s.n} className="flex items-center gap-2">
                <Link href={s.href} aria-current={i === current ? "step" : undefined}
                  className={`flex items-center gap-2 rounded-full border-2 py-1 pl-1 pr-3 text-sm font-bold transition-transform hover:-translate-y-0.5 ${i === current ? "border-[var(--text-primary)] bg-[var(--btn)] text-[var(--btn-fg)] shadow-[3px_3px_0_var(--text-primary)]" : "border-[var(--text-primary)]/30 bg-[var(--surface)] text-[var(--text-primary)]"}`}>
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-extrabold ${i === current ? "bg-[var(--btn-fg)] text-[var(--btn)]" : "bg-[var(--surface-secondary)]"}`}>{s.done ? <Check className="h-3.5 w-3.5" /> : s.n}</span>
                  {s.label}
                </Link>
                {i < steps.length - 1 && <span aria-hidden className="hidden h-0.5 w-4 rounded bg-[var(--text-primary)]/25 sm:block" />}
              </li>
            ))}
          </ol>
          {/* Your four numbers, inside the mission card. */}
          <div className="relative mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Your numbers">
            {stats.map((s) => (
              <div key={s.l} data-tint={s.t} className="card-pastel px-3 py-2">
                <p className={`font-display text-2xl font-extrabold leading-none tabular-nums ${ink}`}>{s.v == null ? "-" : <><CountUp value={s.v} />{s.suffix}</>}</p>
                <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">{s.l}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="order-3 flex min-w-0 flex-col gap-3 lg:order-none">
          <MockStatusCard />
          <UpcomingMocks />
        </div>
      </div>

      {/* Doors: Build a test is the one tall tile on the left, the others on the right. */}
      <div className="order-2 grid flex-1 grid-cols-2 gap-3 lg:order-none md:grid-cols-12 md:grid-rows-2 md:min-h-[15rem]">
        <Link href="/test-centre/build" data-tint="mint" className={`${tile} col-span-2 md:col-span-6 md:row-span-2`}>
          <Mark I={Settings} size="h-28 w-28" />
          <div>
            <Sticker tilt="rotate-2">Most used</Sticker>
            <h2 className={`mt-3 font-display text-3xl font-extrabold ${ink}`}>Build a test</h2>
            <p className="mt-1 max-w-md text-[var(--text-secondary)]">Pick the questions, the length and the rules. Timed like the real exam.</p>
          </div>
          <span className={`inline-flex items-center gap-1 text-sm font-bold ${ink}`}>Build a test <Arrow /></span>
        </Link>
        <Link href="/test-centre/practice" data-tint="rose" className={`${tile} md:col-span-3`}>
          <Mark I={RotateCcw} />
          <h2 className={`font-display text-xl font-extrabold ${ink}`}>Practice</h2>
          <span className={`inline-flex items-center gap-1 text-sm font-bold ${ink}`}>Open <Arrow /></span>
        </Link>
        <Link href="/test-centre/mocks" data-tint="peri" className={`${tile} md:col-span-3`}>
          <Mark I={Trophy} />
          <h2 className={`font-display text-xl font-extrabold ${ink}`}>Mocks</h2>
          <span className={`inline-flex items-center gap-1 text-sm font-bold ${ink}`}>Open <Arrow /></span>
        </Link>
        <Link href="/test-centre/build?view=flashcards" data-tint="butter" className={`${tile} md:col-span-2`}>
          <Mark I={Layers} />
          <h2 className={`font-display text-xl font-extrabold ${ink}`}>Flashcards</h2>
          <span className={`inline-flex items-center gap-1 text-sm font-bold ${ink}`}>Open <Arrow /></span>
        </Link>
        <Link href="/battles" data-tint="lilac" className={`${tile} md:col-span-2`}>
          <Mark I={Swords} />
          <h2 className={`font-display text-xl font-extrabold ${ink}`}>Challenge</h2>
          <span className={`inline-flex items-center gap-1 text-sm font-bold ${ink}`}>Go <Arrow /></span>
        </Link>
        <Link href="/test-centre/history" data-tint="sky" className={`${tile} col-span-2 md:col-span-2`}>
          <Mark I={BarChart3} />
          <h2 className={`font-display text-xl font-extrabold ${ink}`}>History</h2>
          <span className={`inline-flex items-center gap-1 text-sm font-bold ${ink}`}>Open <Arrow /></span>
        </Link>
      </div>
    </div>
  );
}
