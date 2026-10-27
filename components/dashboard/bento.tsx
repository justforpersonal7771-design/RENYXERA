"use client";

/**
 * R18 dashboard bento (27 Oct 2026). Pastel cards, one per question the student has:
 *   NextActionHero  — what should I do now? (one recommended action, two secondary)
 *   MarksLeakCard   — where am I losing marks? (weak topics weighted by how much GATE asks them)
 *   RevisionDueCard — what should I revise?
 *   SubjectTilesCard— how strong am I per subject?
 *   YearDotsCard    — how often does GATE ask my weakest topic, and have I solved those years?
 * Every number is real (the student's own attempts + the official question bank); nothing is invented.
 */
import { useDaysToGate } from "@/lib/goals/use-days-to-gate";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, BrainCircuit, CalendarClock, Flame, RotateCcw, Sparkles, Target, Trophy } from "lucide-react";
import { CountUp } from "@/components/ui/interactive";
import { useDisplayName, useTargetYear } from "@/store/use-auth-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { usePaperLabel } from "@/lib/branch/use-paper-label";
import type { SubjectAnalytics, TopicAnalytics } from "@/types/analytics.types";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import type { ExamSession, QuestionResponse } from "@/types/exam-runtime.types";
import { isResponseCorrect } from "@/lib/grading";
import { hasAnswer } from "@/lib/repository/answer-keys";

/** Ids of every question this student has answered correctly in any finished test (local data). */
export function useSolvedIds(ready: boolean): Set<string> {
  const [ids, setIds] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    if (!ready) return;
    let alive = true;
    IDBManager.getAllExamSessions().then((sessions) => {
      const out = new Set<string>();
      for (const rec of sessions) {
        const s = rec.sessionData as ExamSession | null;
        if (!s || s.status !== "SUBMITTED") continue;
        for (const [qid, r] of Object.entries(s.responses ?? {}) as [string, QuestionResponse][]) {
          if (r.status !== "ANSWERED" && r.status !== "MARKED_AND_ANSWERED") continue;
          const q = QuestionRepository.getQuestionById(qid);
          if (q && hasAnswer(qid, q) && isResponseCorrect(q, r.selectedOptions, r.natValue)) out.add(qid);
        }
      }
      if (alive) setIds(out);
    }).catch(() => null);
    return () => { alive = false; };
  }, [ready]);
  return ids;
}

const noopSubscribe = () => () => {};
const greeting = () => { const h = new Date().getHours(); return h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
const pct = (c: number, a: number) => (a > 0 ? Math.round((c / a) * 100) : 0);

/** Card entrance: rises once into view (B4); static for reduced motion. */
function Rise({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/** Bar that fills once when it scrolls into view. */
function Fill({ value, color }: { value: number; color: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="h-2 rounded-full bg-[color-mix(in_srgb,var(--tint-ink)_12%,transparent)] overflow-hidden">
      <motion.div className="h-full rounded-full" style={{ background: color }}
        initial={reduce ? { width: `${value}%` } : { width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
    </div>
  );
}

function useCountdown() {
  const targetYear = useTargetYear();
  const days = useDaysToGate();
  return { days, targetYear };
}

const MAIN_BTN = "group btn-main";

type Action = { label: string; why: string; href?: string; onClick?: () => void; icon: React.ReactNode };

export function NextActionHero({ solved, accuracy, streak, pendingMistakes, weakest, hasActiveSession, onResume, loading }: {
  solved: number; accuracy: number; streak: number; pendingMistakes: number; weakest: TopicAnalytics | null;
  hasActiveSession: boolean; onResume: () => void; loading: boolean;
}) {
  const { first } = useDisplayName();
  const { days, targetYear } = useCountdown();
  const paper = usePaperLabel();
  // Client clock only (hydration-safe: "Welcome" on the server and first client pass).
  const greet = useSyncExternalStore(noopSubscribe, greeting, () => "Welcome");

  // One recommended action, chosen from the student's real state.
  const main: Action = hasActiveSession
    ? { label: "Resume your test", why: "You have a test in progress.", onClick: onResume, icon: <RotateCcw className="w-4 h-4" /> }
    : solved === 0
      ? { label: "Set your goal and start", why: "A 20-question start test shows where you stand. About 30 minutes.", href: "#diagnostic", icon: <Target className="w-4 h-4" /> }
      : pendingMistakes >= 10
        ? { label: `Revise ${Math.min(pendingMistakes, 15)} mistakes`, why: `${pendingMistakes} questions you got wrong are waiting.`, href: "/revision", icon: <RotateCcw className="w-4 h-4" /> }
        : weakest
          ? { label: `Practise ${weakest.topic}`, why: `Your weakest topic right now (${pct(weakest.correct, weakest.attempted)}% correct).`, href: `/setup?subject=${encodeURIComponent(weakest.subject)}&topic=${encodeURIComponent(weakest.topic)}`, icon: <Target className="w-4 h-4" /> }
          : { label: "Start a practice session", why: "Pick a paper, subject or topic.", href: "/setup", icon: <Sparkles className="w-4 h-4" /> };

  const readiness = Math.round(Math.min(solved / 4, 25) + accuracy * 0.75);

  return (
    <section aria-label="Your next step" className="card-pastel overflow-hidden p-5 sm:p-7" data-tint="lilac">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--tint-lilac-ink)_25%,transparent),transparent_65%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="section-label">Today</span>
            {days !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)]/80 px-2.5 py-1 text-[11px] font-bold text-[var(--text-secondary)] border border-[var(--border)]">
                <CalendarClock className="w-3.5 h-3.5 text-[var(--tint-lilac-ink)]" /> <span className="font-num">{days}</span> days to GATE {targetYear}
              </span>
            )}
          </div>
          <h1 className="mt-3 font-display text-[1.75rem] sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]">
            {greet}{first ? `, ${first}` : ""}.
            <span className="block text-[var(--tint-lilac-ink)]">Here&apos;s your next step.</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">{main.why}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {main.href ? (
              <Link href={main.href} className={MAIN_BTN}>{main.icon}{main.label}<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></Link>
            ) : (
              <button type="button" onClick={main.onClick} className={MAIN_BTN}>{main.icon}{main.label}<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></button>
            )}
            <Link href="/ai-mentor" className="pill-soft"><BrainCircuit className="w-4 h-4" /> Ask AI Mentor</Link>
            <Link href="/mocks" className="pill-soft"><Trophy className="w-4 h-4" /> Mocks</Link>
          </div>
        </div>

        {/* New student: no empty 0% rings; show what the dashboard will hold after the first test. */}
        {!loading && solved === 0 && !hasActiveSession ? (
          <ul className="card-inset grid gap-2 p-4" aria-label="After your start test">
            <li className="text-sm font-semibold text-[var(--text-secondary)]">After your start test you get</li>
            {[
              { icon: <Target className="w-4 h-4" />, t: "Your accuracy and readiness", tint: "peri" },
              { icon: <Flame className="w-4 h-4" />, t: "Your weakest high-value topics", tint: "rose" },
              { icon: <CalendarClock className="w-4 h-4" />, t: "A daily plan up to GATE " + targetYear, tint: "mint" },
            ].map((x) => (
              <li key={x.t} className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-3 text-sm font-semibold text-[var(--text-primary)]">
                <span className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: `var(--tint-${x.tint})`, color: `var(--tint-${x.tint}-ink)` }}>{x.icon}</span>{x.t}
              </li>
            ))}
          </ul>
        ) : (
        <div className="card-inset grid grid-cols-3 gap-2 p-4">
          {[
            { label: "Accuracy", value: Math.round(accuracy), unit: "%", color: "#7c3aed" },
            { label: "Readiness", value: readiness, unit: "%", color: "#db2777", note: "estimate" },
            { label: "Streak", value: streak, unit: "d", color: "#ea580c", flame: true },
          ].map((r) => (
            <div key={r.label} className="flex flex-col items-center text-center">
              <Ring value={r.unit === "%" ? r.value : Math.min(100, r.value * 10)} color={r.color} loading={loading}>
                {r.flame ? <Flame className="w-4 h-4" style={{ color: r.color }} /> : null}
                <span className="font-num text-lg font-extrabold text-[var(--text-primary)]">{loading ? "–" : <CountUp value={r.value} />}<span className="text-xs">{r.unit}</span></span>
              </Ring>
              <span className="mt-1.5 text-xs font-bold tracking-normal text-[var(--text-muted)]">{r.label}</span>
              {r.note && <span className="text-[10px] text-[var(--text-muted)]">{r.note}</span>}
            </div>
          ))}
          <p className="col-span-3 mt-1 text-center text-xs text-[var(--text-muted)]"><span className="font-num font-bold text-[var(--text-secondary)]">{solved}</span> GATE {paper} questions solved</p>
        </div>
        )}
      </div>
    </section>
  );
}

function Ring({ value, color, loading, children }: { value: number; color: string; loading: boolean; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const R = 30, C = 2 * Math.PI * R;
  const v = loading ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div className="relative h-[76px] w-[76px]">
      <svg viewBox="0 0 76 76" className="absolute inset-0 -rotate-90">
        <circle cx="38" cy="38" r={R} fill="none" stroke="currentColor" strokeWidth="7" className="text-[var(--border)]" />
        <motion.circle cx="38" cy="38" r={R} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={C}
          initial={reduce ? false : { strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - v / 100) }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">{children}</div>
    </div>
  );
}

/** Average marks a topic carries per paper, from the official bank (how much GATE "pays" for it). */
function topicMarksPerPaper(topic: string): number {
  try {
    const qs = QuestionRepository.getQuestionsByTopic(topic);
    if (!qs.length) return 0;
    const papers = new Set(QuestionRepository.getAllQuestions().map((q) => q.year_shift)).size || 1;
    return qs.reduce((n, q) => n + (Number(q.marks) || 0), 0) / papers;
  } catch { return 0; }
}

export function MarksLeakCard({ topics }: { topics: TopicAnalytics[] }) {
  const rows = useMemo(() => topics
    .filter((t) => t.attempted >= 2)
    .map((t) => {
      const acc = pct(t.correct, t.attempted);
      const per = topicMarksPerPaper(t.topic);
      return { ...t, acc, per, leak: per * (1 - acc / 100) };
    })
    .sort((a, b) => b.leak - a.leak)
    .slice(0, 4), [topics]);
  return (
    <Rise className="h-full">
      <section className="card-metal metal h-full p-5 sm:p-6" aria-label="Where you lose marks">
        <span className="section-label">Where marks leak</span>
        <h2 className="mt-2 text-lg font-extrabold text-[var(--text-primary)]">Fix these first</h2>
        <p className="text-xs text-[var(--text-secondary)]">Topics ranked by how much GATE asks them × how often you miss them.</p>
        {rows.length === 0 ? (
          <p className="card-inset mt-4 p-4 text-sm text-[var(--text-secondary)]">Attempt a few tests and your weakest high-value topics appear here.</p>
        ) : (
          <ul className="card-inset mt-4 divide-y divide-[var(--border-subtle)] p-1.5">
            {rows.map((r) => (
              <li key={r.topic}>
                <Link href={`/setup?subject=${encodeURIComponent(r.subject)}&topic=${encodeURIComponent(r.topic)}`} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--tint-rose)]/60">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[var(--text-primary)]">{r.topic}</span>
                    <span className="mt-1 block"><Fill value={r.acc} color={r.acc < 40 ? "#e11d48" : r.acc < 65 ? "#f59e0b" : "#10b981"} /></span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-num text-sm font-extrabold text-[var(--tint-rose-ink)]">{r.acc}%</span>
                    <span className="block text-[10px] text-[var(--text-muted)]">{r.per ? `≈${r.per.toFixed(1)} marks/paper` : `${r.attempted} tried`}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Rise>
  );
}

export function RevisionDueCard({ pending, mastered }: { pending: number; mastered: number }) {
  const total = pending + mastered;
  return (
    <Rise className="h-full" delay={0.05}>
      <section className="card-metal metal flex h-full flex-col p-5 sm:p-6" aria-label="Revision due">
        <span className="section-label">Revision</span>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-num text-5xl font-extrabold leading-none text-[var(--text-primary)]"><CountUp value={pending} /></span>
          <span className="pb-1 text-sm font-semibold text-[var(--text-secondary)]">mistakes to revise</span>
        </div>
        <div className="card-inset mt-4 p-3">
          <div className="flex justify-between text-[11px] font-semibold text-[var(--text-muted)]"><span>Mastered</span><span className="font-num">{mastered}/{total || 0}</span></div>
          <div className="mt-1.5"><Fill value={total ? (mastered / total) * 100 : 0} color="#ea580c" /></div>
        </div>
        <div className="mt-auto pt-4">
          <Link href={pending ? "/revision" : "/setup"} className="pill-ink w-full">{pending ? "Start revision" : "Practise to fill it"} <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </Rise>
  );
}

const SUBJECT_TINTS = ["#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#e11d48", "#6366f1", "#14b8a6", "#d946ef"];

export function SubjectTilesCard({ subjects }: { subjects: SubjectAnalytics[] }) {
  const rows = useMemo(() => [...subjects].filter((s) => s.attempted > 0).sort((a, b) => b.attempted - a.attempted).slice(0, 8), [subjects]);
  return (
    <Rise className="h-full" delay={0.08}>
      <section className="card-metal metal h-full p-5 sm:p-6" aria-label="Subjects">
        <div className="flex items-center justify-between gap-2">
          <span className="section-label">Subjects</span>
          <Link href="/analytics" className="text-xs font-bold text-[var(--tint-sky-ink)] hover:underline">Analytics →</Link>
        </div>
        <h2 className="mt-2 text-lg font-extrabold text-[var(--text-primary)]">How strong you are</h2>
        {rows.length === 0 ? (
          <p className="card-inset mt-4 p-4 text-sm text-[var(--text-secondary)]">Your subjects light up as you practise.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {rows.map((s, i) => {
              const acc = pct(s.correct, s.attempted);
              return (
                <li key={s.subject} className="card-inset p-3">
                  <span className="block truncate text-[11px] font-bold text-[var(--text-secondary)]" title={s.subject}>{s.subject.replace(/\s*\(.*\)/, "")}</span>
                  <span className="mt-1 block font-num text-2xl font-extrabold" style={{ color: SUBJECT_TINTS[i % SUBJECT_TINTS.length] }}>{acc}%</span>
                  <span className="mt-1 block"><Fill value={acc} color={SUBJECT_TINTS[i % SUBJECT_TINTS.length]} /></span>
                  <span className="mt-1 block text-[10px] text-[var(--text-muted)]">{s.attempted} tried</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </Rise>
  );
}

/** Year dot-grid for the student's weakest topic: which GATE years asked it, and which of those the student has got right. */
export function YearDotsCard({ topic, solvedIds }: { topic: TopicAnalytics | null; solvedIds: Set<string> }) {
  const data = useMemo(() => {
    if (!topic) return null;
    let qs: { id: string; year: string }[] = [];
    try { qs = QuestionRepository.getQuestionsByTopic(topic.topic).map((q) => ({ id: q.question_id, year: String(q.year) })); } catch { qs = []; }
    const years = [...new Set(QuestionRepository.getAllQuestions().map((q) => String(q.year)))].sort();
    const byYear = years.map((y) => {
      const inY = qs.filter((q) => q.year === y);
      return { year: y, asked: inY.length, solved: inY.filter((q) => solvedIds.has(q.id)).length };
    });
    return { byYear, askedYears: byYear.filter((y) => y.asked).length, total: years.length };
  }, [topic, solvedIds]);
  if (!topic || !data) return null;
  return (
    <Rise className="h-full" delay={0.1}>
      <section className="card-metal metal h-full p-5 sm:p-6" aria-label="How often GATE asks your weakest topic">
        <span className="section-label">Every GATE year</span>
        <h2 className="mt-2 text-lg font-extrabold text-[var(--text-primary)] truncate" title={topic.topic}>{topic.topic}</h2>
        <div className="card-inset mt-4 p-4">
          <div className="flex flex-wrap gap-1.5">
            {data.byYear.map((y) => (
              <span key={y.year} title={`${y.year}: ${y.asked ? `${y.asked} question${y.asked > 1 ? "s" : ""}, you solved ${y.solved}` : "not asked"}`}
                className={`h-5 w-5 rounded-md ${y.asked === 0 ? "bg-[color-mix(in_srgb,var(--tint-mint-ink)_12%,transparent)]" : y.solved >= y.asked ? "bg-emerald-500" : y.solved > 0 ? "bg-amber-400" : "bg-rose-400"}`} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-[var(--text-muted)]"><span>{data.byYear[0]?.year}</span><span>{data.byYear.at(-1)?.year}</span></div>
          <p className="mt-2 text-sm text-[var(--text-secondary)]"><span className="font-num text-2xl font-extrabold text-[var(--text-primary)]">{data.askedYears}</span> of {data.total} years had a question on it</p>
          <p className="mt-1 flex flex-wrap gap-3 text-[10px] text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-emerald-500" />you solved all</span>
            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-amber-400" />some</span>
            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-rose-400" />not yet</span>
          </p>
        </div>
        <Link href={`/setup?subject=${encodeURIComponent(topic.subject)}&topic=${encodeURIComponent(topic.topic)}`} className="pill-ink mt-4 w-full">Practise these <ArrowRight className="w-4 h-4" /></Link>
      </section>
    </Rise>
  );
}
