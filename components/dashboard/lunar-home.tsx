"use client";

/**
 * The Lunar dashboard (owner-approved mockup, docs/design/DASHBOARD-VARIANTS.md + dashboard-composite): greeting, one next step, tonight's
 * list, where the next marks are, a readiness gauge, the adaptive subject radar, the activity heat map, the All-India Mock and a Mentor shortcut.
 * Every number is the student's own (analytics, planner, streak); nothing is invented. Shown only under the Lunar look (see app/(dashboard)/page.tsx),
 * so Classic and the other looks keep their dashboard exactly as it was.
 */
import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BrainCircuit, CalendarClock, Check, Clock, Flame, RotateCcw, Sparkles, Target } from "lucide-react";
import { istHour } from "@/lib/time/ist";
import { useDisplayName, useAuthStore } from "@/store/use-auth-store";
import { useDaysToGate } from "@/lib/goals/use-days-to-gate";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { serverDate } from "@/lib/time/server-time";
import { toLocalDateStr } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Magnetic } from "@/components/ui/magnetic";
import { LunarGauge } from "./lunar-gauge";
import { MockStatusCard } from "./mock-status-card";
import { SubjectRadarCard } from "@/components/analytics/subject-radar-card";
import type { AnalyticsSnapshot, SubjectAnalytics, TopicAnalytics } from "@/types/analytics.types";

const noop = () => () => {};
const greeting = () => { const h = istHour(); return h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
const pct = (c: number, a: number) => (a > 0 ? Math.round((c / a) * 100) : 0);

type Props = {
  solved: number; accuracy: number; streak: number; pendingMistakes: number; weakest: TopicAnalytics | null;
  hasActiveSession: boolean; onResume: () => void; loading: boolean;
  topics: TopicAnalytics[]; subjects: SubjectAnalytics[]; snapshots: AnalyticsSnapshot[];
  sessions: { updatedAt: string; attempted: number; accuracy: number }[];
};

function Rise({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
  );
}

function Ring({ value, size = 96, caption }: { value: number; size?: number; caption?: string }) {
  const r = (size - 10) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={9} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--radar-line, #3a6fb8)" strokeWidth={9} strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - Math.min(100, Math.max(0, value)) / 100) }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-center"><span><span className="block font-num text-xl font-semibold leading-none text-[var(--text-primary)]">{value}%</span>{caption && <span className="mt-1 block text-[11px] text-[var(--text-muted)]">{caption}</span>}</span></span>
    </div>
  );
}

/** 26 weeks of activity, one square per day, shaded by how many questions were attempted. */
function Heat({ snapshots, streak }: { snapshots: AnalyticsSnapshot[]; streak: number }) {
  const cells = useMemo(() => {
    const by = new Map(snapshots.map((s) => [s.id, s.totalQuestionsAttempted]));
    const today = new Date();
    const back = (today.getDay() + 6) % 7;                  // weeks start on Monday
    return Array.from({ length: 26 * 7 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() - (26 * 7 - 1 - i) + (6 - back) * 0);
      const n = by.get(toLocalDateStr(d)) ?? 0;
      return { date: toLocalDateStr(d), n, lvl: n === 0 ? 0 : n < 10 ? 1 : n < 30 ? 2 : n < 60 ? 3 : 4 };
    });
  }, [snapshots]);
  const shade = ["var(--border)", "rgba(141,185,240,.38)", "rgba(141,185,240,.68)", "rgba(141,185,240,.95)", "#3a6fb8"];
  return (
    <div>
      <div className="grid auto-cols-fr grid-flow-col grid-rows-7 gap-[3px]" role="img" aria-label={`Activity over the last 26 weeks, ${streak}-day streak`}>
        {cells.map((c) => <i key={c.date} title={`${c.date}: ${c.n} question${c.n === 1 ? "" : "s"}`} className="block aspect-square rounded-[3px]" style={{ background: shade[c.lvl] }} />)}
      </div>
    </div>
  );
}

export function LunarHome(p: Props) {
  const { first } = useDisplayName();
  const days = useDaysToGate();
  const user = useAuthStore((s) => s.user);
  const ent = useEntitlements();
  const greet = useSyncExternalStore(noop, greeting, () => "Welcome");
  const { events, loaded, loadEvents } = useCalendarStore();
  useEffect(() => { void loadEvents(); }, [loadEvents]);

  const readiness = Math.round(Math.min(p.solved / 4, 25) + p.accuracy * 0.75);
  const fresh = !p.loading && p.solved === 0 && !p.hasActiveSession;

  // one recommended action, from the student's real state (same rules as the classic hero)
  const main = p.hasActiveSession
    ? { label: "Resume your test", why: "You have a test in progress.", onClick: p.onResume, icon: <RotateCcw className="h-4 w-4" /> }
    : fresh
      ? { label: "Set your goal and start", why: "A 20-question start test shows where you stand. About 30 minutes.", href: "#diagnostic", icon: <Target className="h-4 w-4" /> }
      : p.pendingMistakes >= 10
        ? { label: `Revise ${Math.min(p.pendingMistakes, 15)} mistakes`, why: `${p.pendingMistakes} questions you got wrong are waiting.`, href: "/revision", icon: <RotateCcw className="h-4 w-4" /> }
        : p.weakest
          ? { label: `Practise ${p.weakest.topic}`, why: `Your weakest topic right now (${pct(p.weakest.correct, p.weakest.attempted)}% correct).`, href: `/setup?subject=${encodeURIComponent(p.weakest.subject)}&topic=${encodeURIComponent(p.weakest.topic)}`, icon: <Target className="h-4 w-4" /> }
          : { label: "Start a practice session", why: "Pick a paper, subject or topic.", href: "/setup", icon: <Sparkles className="h-4 w-4" /> };
  const title = p.hasActiveSession ? "Your test is paused" : fresh ? "Start with a 20-question test" : p.pendingMistakes >= 10 ? `${p.pendingMistakes} mistakes are waiting` : p.weakest ? p.weakest.topic : "Pick your next practice";
  const visual = p.hasActiveSession || fresh ? null : p.pendingMistakes >= 10
    ? <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-center"><span><span className="block font-num text-3xl font-light leading-none text-[var(--text-primary)]">{Math.min(p.pendingMistakes, 99)}</span><span className="mt-1 block text-[11px] text-[var(--text-muted)]">waiting</span></span></span>
    : p.weakest ? <Ring value={pct(p.weakest.correct, p.weakest.attempted)} caption="correct" /> : null;

  // tonight: today's planner blocks when there are any, otherwise the day's three missions
  const today = toLocalDateStr(serverDate());
  const blocks = (ent.paid && loaded ? events.filter((e) => e.date === today && e.status !== "Skipped" && e.status !== "Cancelled") : [])
    .sort((a, b) => (a.startTime ?? "99").localeCompare(b.startTime ?? "99")).slice(0, 5);
  const todays = p.sessions.filter((s) => new Date(s.updatedAt).toDateString() === serverDate().toDateString());
  const solvedToday = todays.reduce((a, s) => a + s.attempted, 0);
  const rows = blocks.length
    ? blocks.map((b) => ({ key: b.id, time: b.startTime ?? "", title: b.title, sub: b.subject ?? b.category, done: b.completed, tag: b.estimatedDurationMin ?? b.durationMin ? `${b.estimatedDurationMin ?? b.durationMin} min` : "" }))
    : [
        { key: "m1", time: "", title: "Solve 10 questions", sub: `${Math.min(solvedToday, 10)} of 10 so far`, done: solvedToday >= 10, tag: "" },
        { key: "m2", time: "", title: "Finish a test at 60% or better", sub: "Any practice test counts", done: todays.some((s) => s.attempted >= 5 && s.accuracy >= 60), tag: "" },
        { key: "m3", time: "", title: "Keep your streak going", sub: p.streak > 0 ? `${p.streak}-day streak` : "Start one today", done: todays.length > 0, tag: "" },
      ];

  const weak3 = [...p.topics].filter((t) => t.attempted >= 2).sort((a, b) => a.correct / a.attempted - b.correct / b.attempted).slice(0, 3);
  const gap = Math.max(0, 70 - readiness);

  return (
    <div className="space-y-10">
      {/* greeting + next step + tonight | readiness */}
      <section aria-label="Your next step" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12">
        <div className="min-w-0">
          <h1 className="font-display text-[2rem] font-light leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-5xl">
            {greet}{first ? `, ${first}` : ""}.
            <span className="mt-1 block text-[var(--tint-lilac-ink)]">Here&apos;s your next step.</span>
          </h1>
          <p className="mt-3 text-base text-[var(--text-secondary)] sm:text-lg">{main.why}</p>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            {visual}
            <div className="min-w-0">
              <p className="font-display text-2xl font-medium leading-tight text-[var(--text-primary)] sm:text-3xl">{title}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <Magnetic>
                  {main.href ? <Link href={main.href} className="group btn-main">{main.icon}{main.label}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
                    : <button type="button" onClick={main.onClick} className="group btn-main">{main.icon}{main.label}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>}
                </Magnetic>
                <Link href="/ai-mentor" className="pill-soft"><BrainCircuit className="h-4 w-4" /> Ask AI Mentor</Link>
                <Link href="/setup" className="pill-soft">Choose something else</Link>
              </div>
            </div>
          </div>

          {user && !fresh && (
            <div className="mt-9">
              <h2 className="mb-1 text-lg font-medium text-[var(--text-primary)]">{blocks.length ? "Tonight" : "Today"}</h2>
              <ol className="relative ml-1 border-l-2 border-[var(--border)] pl-7">
                {rows.map((r) => (
                  <li key={r.key} className="relative flex items-center gap-4 py-3">
                    <span className={`absolute -left-[2.2rem] grid h-6 w-6 place-items-center rounded-full border-2 ${r.done ? "border-[#8db9f0] bg-[#8db9f0] text-[#1a1c29]" : "border-[#8db9f0] bg-[var(--background)]"}`}>{r.done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span>
                    {r.time && <span className="w-14 shrink-0 text-sm text-[var(--text-muted)]">{r.time}</span>}
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-base font-medium sm:text-lg ${r.done ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"}`}>{r.title}</span>
                      <span className="block truncate text-sm text-[var(--text-muted)]">{r.sub}</span>
                    </span>
                    {r.tag && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[rgba(141,185,240,.36)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]"><Clock className="h-3 w-3" />{r.tag}</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {weak3.length > 0 && (
            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <h2 className="mb-4 text-lg font-medium text-[var(--text-primary)]">Where your next marks are</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {weak3.map((t) => { const v = pct(t.correct, t.attempted); return (
                  <div key={t.topic} className="min-w-0">
                    <div className="flex justify-between gap-2 text-sm"><span className="truncate font-semibold text-[var(--text-primary)]" title={t.topic}>{t.topic}</span><span className="font-num text-[var(--text-muted)]">{v}%</span></div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--border)]"><motion.div className="h-full rounded-full bg-[#f5b69e]" initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} /></div>
                    <p className="mt-1.5 text-xs text-[var(--text-muted)]">{t.attempted} answered</p>
                  </div>); })}
              </div>
            </div>
          )}
        </div>

        {fresh ? (
          <ul className="card-pastel grid content-start gap-2 p-5" data-tint="sky" aria-label="After your start test">
            <li className="text-sm font-semibold text-[var(--text-secondary)]">After your start test you get</li>
            {[{ i: <Target className="h-4 w-4" />, t: "Your accuracy and readiness" }, { i: <Flame className="h-4 w-4" />, t: "Your weakest high-value topics" }, { i: <CalendarClock className="h-4 w-4" />, t: `A daily plan up to GATE${days != null ? `, ${days} days away` : ""}` }].map((x) => (
              <li key={x.t} className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-3 text-sm font-semibold text-[var(--text-primary)]"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[rgba(141,185,240,.36)]">{x.i}</span>{x.t}</li>
            ))}
          </ul>
        ) : (
          <Rise className="self-start">
            <aside className="card-pastel p-6 text-center" data-tint="sky" data-nowm aria-label="Readiness">
              <p className="text-sm text-[var(--text-secondary)]">Readiness estimate, out of 100</p>
              <div className="relative mx-auto mt-1 max-w-[420px]">
                <LunarGauge value={readiness} />
                <p className="absolute inset-x-0 bottom-3 font-num text-7xl font-extralight leading-none tracking-tight text-[var(--text-primary)] sm:text-8xl"><AnimatedNumber value={readiness} /></p>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-[rgba(141,185,240,.36)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">{Math.round(p.accuracy)}% accuracy</span>
                <span className="rounded-full bg-[rgba(245,182,158,.5)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">{gap > 0 ? `Target 70: ${gap} to go` : "Above the 70 target"}</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2.5 text-left">
                {[{ k: "Days to GATE", v: days ?? "–" }, { k: "Streak", v: `${p.streak}${p.streak === 1 ? " day" : " days"}` }, { k: "Solved", v: p.solved }].map((s) => (
                  <div key={s.k} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3"><p className="text-[11px] text-[var(--text-muted)]">{s.k}</p><p className="font-num text-xl font-light text-[var(--text-primary)] sm:text-2xl">{s.v}</p></div>
                ))}
              </div>
            </aside>
          </Rise>
        )}
      </section>

      {/* shape | activity, mock, mentor */}
      {!fresh && (
        <section className="grid gap-5 lg:grid-cols-2">
          <Rise><SubjectRadarCard subjects={p.subjects} /></Rise>
          <div className="flex min-w-0 flex-col gap-5">
            <Rise delay={0.05}>
              <div className="card-pastel p-5" data-tint="sky" data-nowm>
                <p className="text-sm text-[var(--text-secondary)]">Last 26 weeks{p.streak > 0 ? ` · ${p.streak}-day streak` : ""}</p>
                <div className="mt-3"><Heat snapshots={p.snapshots} streak={p.streak} /></div>
              </div>
            </Rise>
            <Rise delay={0.1}><MockStatusCard withUpcoming /></Rise>
            <Rise delay={0.15}>
              <div className="card-pastel p-5" data-tint="peri" data-nowm>
                <p className="text-sm text-[var(--text-secondary)]">AI Mentor</p>
                <p className="mt-1 font-display text-lg font-medium text-[var(--text-primary)]">{p.pendingMistakes > 0 ? `Ask the Mentor to explain your ${p.pendingMistakes} mistake${p.pendingMistakes === 1 ? "" : "s"}` : "Ask the Mentor anything about GATE"}</p>
                <Link href="/ai-mentor" className="pill-soft mt-3"><BrainCircuit className="h-4 w-4" /> Open Mentor <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </Rise>
          </div>
        </section>
      )}
    </div>
  );
}
