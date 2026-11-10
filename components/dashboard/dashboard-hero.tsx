"use client";

/**
 * The dashboard hero: one big, personal sentence that says what matters TODAY, the one action to take, and the readiness tracker against the goal.
 * The headline is chosen from the student's real state (active test, brand new, mistakes waiting, a streak, a weak topic); nothing is invented.
 * Layout (inverted pyramid): message and action on the left, the tracker on the right; on phones the message, then the action, then the tracker.
 */
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BrainCircuit, CalendarClock, RotateCcw, Sparkles, Target, Trophy } from "lucide-react";
import { istHour } from "@/lib/time/ist";
import { useDisplayName, useTargetYear } from "@/store/use-auth-store";
import { useDaysToGate } from "@/lib/goals/use-days-to-gate";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ReadinessGauge } from "./readiness-gauge";
import { MENTOR_NEW_CHAT } from "@/lib/mentor/links";
import type { TopicAnalytics } from "@/types/analytics.types";

const noop = () => () => {};
const greeting = () => { const h = istHour(); return h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
const pct = (c: number, a: number) => (a > 0 ? Math.round((c / a) * 100) : 0);
export const readinessOf = (solved: number, accuracy: number) => Math.round(Math.min(solved / 4, 25) + accuracy * 0.75);

type Props = {
  solved: number; accuracy: number; streak: number; pendingMistakes: number; weakest: TopicAnalytics | null;
  hasActiveSession: boolean; onResume: () => void; loading: boolean;
};

export function DashboardHero({ solved, accuracy, streak, pendingMistakes, weakest, hasActiveSession, onResume, loading }: Props) {
  const reduce = useReducedMotion();
  const { first } = useDisplayName();
  const year = useTargetYear();
  const days = useDaysToGate();
  const greet = useSyncExternalStore(noop, greeting, () => "Welcome");
  const readiness = readinessOf(solved, accuracy);
  const fresh = !loading && solved === 0 && !hasActiveSession;
  const gap = Math.max(0, 70 - readiness);

  // the headline: the one thing that matters today
  const head = hasActiveSession
    ? { a: "Your test is", b: "waiting for you." }
    : fresh
      ? { a: `Your GATE ${year}`, b: "starts with one test." }
      : pendingMistakes >= 10
        ? { a: "Turn", b: `${pendingMistakes} mistakes into marks.` }
        : streak >= 3
          ? { a: `${streak} days in a row.`, b: "Do not break it today." }
          : weakest
            ? { a: "Your next marks are in", b: `${weakest.topic}.` }
            : { a: "Make today", b: "count." };
  const why = hasActiveSession ? "You have a test in progress. Pick up exactly where you stopped."
    : fresh ? "A 20-question start test shows where you stand and builds your plan. About 30 minutes."
    : pendingMistakes >= 10 ? `${pendingMistakes} questions you got wrong are waiting. Fixing them is the fastest way to add marks.`
    : weakest ? `It is your weakest topic right now: ${pct(weakest.correct, weakest.attempted)}% correct over ${weakest.attempted} answers.`
    : "Pick a paper, a subject or a topic and keep the momentum.";
  const main = hasActiveSession
    ? { label: "Resume your test", onClick: onResume, icon: <RotateCcw className="h-4 w-4" /> }
    : fresh ? { label: "Set your goal and start", href: "#diagnostic", icon: <Target className="h-4 w-4" /> }
    : pendingMistakes >= 10 ? { label: `Revise ${Math.min(pendingMistakes, 15)} mistakes`, href: "/revision", icon: <RotateCcw className="h-4 w-4" /> }
    : weakest ? { label: `Practise ${weakest.topic}`, href: `/setup?subject=${encodeURIComponent(weakest.subject)}&topic=${encodeURIComponent(weakest.topic)}`, icon: <Target className="h-4 w-4" /> }
    : { label: "Start a practice session", href: "/setup", icon: <Sparkles className="h-4 w-4" /> };
  const btn = "group btn-main";

  return (
    <section aria-label="Your day" className="card-pastel overflow-hidden p-5 sm:p-8 lg:p-10" data-tint="lilac" data-nowm>
      {/* soft colour behind the message; decorative only */}
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--tint-peach-ink)_26%,transparent),transparent_66%)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--tint-peri-ink)_24%,transparent),transparent_66%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="section-label">{greet}{first ? `, ${first}` : ""}</span>
            {days !== null && <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-2.5 py-1 text-[11px] font-bold text-[var(--text-secondary)]"><CalendarClock className="h-3.5 w-3.5 text-[var(--tint-ink)]" /><span className="font-num">{days}</span> days to GATE {year}</span>}
          </div>
          <motion.h1 initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 font-display text-[2.15rem] font-extrabold leading-[1.04] tracking-tight text-[var(--text-primary)] sm:text-5xl xl:text-6xl">
            {head.a}<span className="block text-[var(--tint-ink)]">{head.b}</span>
          </motion.h1>
          <p className="mt-4 max-w-xl text-base text-[var(--text-secondary)] sm:text-lg">{why}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {"href" in main && main.href ? <Link href={main.href} className={btn}>{main.icon}{main.label}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
              : <button type="button" onClick={"onClick" in main ? main.onClick : undefined} className={btn}>{main.icon}{main.label}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>}
            <Link href={MENTOR_NEW_CHAT} className="pill-soft"><BrainCircuit className="h-4 w-4" /> Ask AI Mentor</Link>
            <Link href="/mocks" className="pill-soft"><Trophy className="h-4 w-4" /> Mocks</Link>
          </div>
        </div>

        {fresh ? (
          <ul className="card-inset grid gap-2 p-4" aria-label="After your start test">
            <li className="text-sm font-semibold text-[var(--text-secondary)]">After your start test you get</li>
            {["Your accuracy and readiness, out of 100", "Your weakest high-value topics", `A daily plan up to GATE ${year}`].map((t) => <li key={t} className="rounded-2xl bg-[var(--surface)] p-3 text-sm font-semibold text-[var(--text-primary)]">{t}</li>)}
          </ul>
        ) : (
          <div className="card-inset p-5 text-center" aria-label="Readiness against your goal">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Readiness estimate, out of 100</p>
            <div className="relative mx-auto mt-1 max-w-[400px]">
              <ReadinessGauge value={loading ? 0 : readiness} />
              <p className="absolute inset-x-0 bottom-3 font-num text-6xl font-extrabold leading-none tracking-tight text-[var(--text-primary)] sm:text-7xl"><AnimatedNumber value={loading ? 0 : readiness} /></p>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--text-primary)]">{Math.round(accuracy)}% accuracy</span>
              <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--text-primary)]">{gap > 0 ? `Goal 70: ${gap} to go` : "Above the goal of 70"}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
