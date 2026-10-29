"use client";
/**
 * AI Mentor extras (rule-based, free, stored on this device): goals, the roadmap for the days left, things the Mentor has noticed,
 * a daily check-in and a focus timer. Goals and check-ins are also added to the learner brief so chat answers use them.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { toLocalDateStr } from "@/lib/utils";

export interface Goals { targetMarks: number; hoursPerDay: number }
export interface CheckIn { date: string; energy: number; hours: number }
export interface FocusLog { date: string; minutes: number }

export function useMemoryKey<T>(key: string, initial: T): [T, (v: T) => void, boolean] {
  const [v, setV] = useState<T>(initial);
  const [ok, setOk] = useState(false);
  useEffect(() => { void IDBManager.getAIMemory(key).then((x) => { if (x != null) setV(x as T); setOk(true); }); }, [key]);
  const set = useCallback((n: T) => { setV(n); void IDBManager.saveAIMemory(key, n); }, [key]);
  return [v, set, ok];
}

/** Lines appended to the learner brief from the extras. */
export function extrasBriefLines(goals: Goals | null, checkins: CheckIn[], focus: FocusLog[]): string[] {
  const out: string[] = [];
  if (goals) out.push(`Goal: ${goals.targetMarks} marks, ${goals.hoursPerDay} study hours a day.`);
  const today = toLocalDateStr(), c = checkins.find((x) => x.date === today);
  if (c) out.push(`Today's check-in: energy ${c.energy} of 5, ${c.hours} hours studied.`);
  const week = focus.filter((f) => f.date >= toLocalDateStr(new Date(Date.now() - 6 * 86400000))).reduce((a, f) => a + f.minutes, 0);
  if (week) out.push(`Focus timer minutes in the last 7 days: ${week}.`);
  return out;
}

const card = "card-pastel p-5";
const h2 = "font-display text-lg font-extrabold text-[var(--text-primary)]";
const inp = "h-10 w-full rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--tint-sky-ink)]";

export function GoalsPanel({ goals, setGoals }: { goals: Goals | null; setGoals: (g: Goals) => void }) {
  const [m, setM] = useState(String(goals?.targetMarks ?? 60)), [h, setH] = useState(String(goals?.hoursPerDay ?? 4));
  useEffect(() => { if (goals) { setM(String(goals.targetMarks)); setH(String(goals.hoursPerDay)); } }, [goals]);
  const save = () => setGoals({ targetMarks: Math.max(1, Math.min(100, Math.round(+m) || 60)), hoursPerDay: Math.max(0.5, Math.min(16, +h || 4)) });
  return (
    <section className={card} data-tint="sky" aria-label="Your goal">
      <h2 className={h2}>Your goal</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-xs font-semibold text-[var(--text-secondary)]">Target marks (of 100)<input className={inp} inputMode="numeric" value={m} onChange={(e) => setM(e.target.value)} /></label>
        <label className="text-xs font-semibold text-[var(--text-secondary)]">Study hours a day<input className={inp} inputMode="decimal" value={h} onChange={(e) => setH(e.target.value)} /></label>
      </div>
      <button type="button" onClick={save} className="btn-main mt-3 !h-10 !text-sm">{goals ? "Update goal" : "Save goal"}</button>
      {goals && <p className="mt-2 text-xs text-[var(--text-muted)]">The Mentor plans around {goals.targetMarks} marks and {goals.hoursPerDay} hours a day.</p>}
    </section>
  );
}

const PHASES = [
  { min: 150, name: "Build concepts", body: "Finish each subject once. One topic a day, then 10 questions on it.", mix: "70% study, 30% questions" },
  { min: 90, name: "Practise by topic", body: "Topic-wise sets and mistake review. Fix weak topics before they pile up.", mix: "30% study, 50% questions, 20% mistakes" },
  { min: 45, name: "Mocks and revision", body: "One full mock a week, and a day to go through every mistake from it.", mix: "20% study, 30% questions, 30% mocks, 20% revision" },
  { min: 14, name: "Exam mode", body: "Two mocks a week under exam timing, formula sheets, mistakes only.", mix: "50% mocks, 50% mistakes and revision" },
  { min: 0, name: "Final stretch", body: "Light revision, sleep and one easy mock. Do not start new topics.", mix: "Revision and rest" },
];
export function RoadmapPanel({ daysToExam, goals }: { daysToExam: number | null; goals: Goals | null }) {
  if (daysToExam == null || daysToExam < 0) return null;
  const idx = PHASES.findIndex((p) => daysToExam >= p.min); const ph = PHASES[idx < 0 ? PHASES.length - 1 : idx];
  const hrs = goals ? Math.round(goals.hoursPerDay * 7 * 10) / 10 : null;
  return (
    <section className={card} data-tint="butter" aria-label="Roadmap">
      <h2 className={h2}>Your roadmap: {ph.name}</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{daysToExam} days to go. {ph.body}</p>
      <p className="mt-2 text-xs font-semibold text-[var(--text-muted)]">Time split: {ph.mix}{hrs ? `. That is about ${hrs} hours this week.` : ""}</p>
      <ol className="mt-3 flex gap-1.5" aria-label="Phases">{PHASES.map((p, i) => <li key={p.name} title={p.name} className={`h-2 flex-1 rounded-full ${i < (idx < 0 ? PHASES.length - 1 : idx) ? "bg-[var(--tint-butter-ink)]/30" : i === (idx < 0 ? PHASES.length - 1 : idx) ? "bg-[var(--tint-butter-ink)]" : "bg-[var(--surface)]"}`} />)}</ol>
    </section>
  );
}

export interface NoticeInput { open: { topic: string; subject: string; occurrences?: number }[]; subjects: { subject: string; accuracy: number; attempted: number }[]; testsTaken: number }
export function NoticedPanel({ i }: { i: NoticeInput }) {
  const out: string[] = [];
  const rep = [...i.open].sort((a, b) => (b.occurrences ?? 1) - (a.occurrences ?? 1))[0];
  if (rep && (rep.occurrences ?? 1) >= 3) out.push(`You have missed ${rep.topic} ${rep.occurrences} times. It is worth one focused session, not more random practice.`);
  const att = i.subjects.filter((s) => s.attempted > 0);
  if (att.length >= 2) {
    const lo = [...att].sort((a, b) => a.accuracy - b.accuracy)[0], hi = [...att].sort((a, b) => b.accuracy - a.accuracy)[0];
    out.push(`${hi.subject} is your strongest subject at ${hi.accuracy}%. ${lo.subject} is the weakest at ${lo.accuracy}%.`);
  }
  const few = i.subjects.filter((s) => s.attempted < 5);
  if (few.length && i.subjects.some((s) => s.attempted >= 5)) out.push(`You have barely touched: ${few.slice(0, 3).map((s) => s.subject).join(", ")}. GATE tests every subject.`);
  if (i.testsTaken === 0) out.push("You have not taken a full test yet. One test tells me more than a week of reading.");
  return (
    <section className={card} data-tint="lilac" aria-label="Things I noticed">
      <h2 className={h2}>Things I noticed</h2>
      {out.length === 0 ? <p className="mt-2 text-sm text-[var(--text-secondary)]">Nothing stands out yet. Solve more questions and I will have something real to tell you.</p>
        : <ul className="mt-2 space-y-2">{out.map((t) => <li key={t} className="rounded-2xl bg-[var(--surface)] p-3 text-sm text-[var(--text-primary)]">{t}</li>)}</ul>}
    </section>
  );
}

export function CheckInPanel({ checkins, setCheckins }: { checkins: CheckIn[]; setCheckins: (c: CheckIn[]) => void }) {
  const today = toLocalDateStr(); const cur = checkins.find((c) => c.date === today);
  const [e, setE] = useState(cur?.energy ?? 3), [h, setH] = useState(String(cur?.hours ?? 0));
  const save = () => setCheckins([...checkins.filter((c) => c.date !== today), { date: today, energy: e, hours: Math.max(0, Math.min(16, +h || 0)) }].slice(-60));
  return (
    <section className={card} data-tint="mint" aria-label="Daily check-in">
      <h2 className={h2}>Daily check-in</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">How is your energy today, and how many hours have you studied?</p>
      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Energy">
        {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={e === n} onClick={() => setE(n)} className={`h-9 w-9 cursor-pointer rounded-xl text-sm font-bold ${e === n ? "bg-[var(--btn)] text-[var(--btn-fg)]" : "bg-[var(--surface)] text-[var(--text-secondary)]"}`}>{n}</button>)}
        <input className={`${inp} ml-3 !w-24`} inputMode="decimal" value={h} onChange={(x) => setH(x.target.value)} aria-label="Hours studied today" /><span className="text-xs text-[var(--text-muted)]">hours</span>
      </div>
      <button type="button" onClick={save} className="btn-soft mt-3 !h-10 !text-sm">{cur ? <><Check className="h-4 w-4" /> Saved, update</> : "Save check-in"}</button>
    </section>
  );
}

export function FocusTimer({ focus, setFocus }: { focus: FocusLog[]; setFocus: (f: FocusLog[]) => void }) {
  const [len, setLen] = useState(25); const [left, setLeft] = useState(25 * 60); const [run, setRun] = useState(false);
  const logged = useRef(false);
  useEffect(() => { if (!run) return; const t = setInterval(() => setLeft((s) => s - 1), 1000); return () => clearInterval(t); }, [run]);
  useEffect(() => {
    if (left > 0 || logged.current) return;
    logged.current = true; setRun(false);
    const today = toLocalDateStr(); const prev = focus.find((f) => f.date === today)?.minutes ?? 0;
    setFocus([...focus.filter((f) => f.date !== today), { date: today, minutes: prev + len }].slice(-60));
  }, [left, len, focus, setFocus]);
  const reset = (n = len) => { setRun(false); setLeft(n * 60); logged.current = false; };
  const mm = String(Math.floor(Math.max(0, left) / 60)).padStart(2, "0"), ss = String(Math.max(0, left) % 60).padStart(2, "0");
  const todayMin = focus.find((f) => f.date === toLocalDateStr())?.minutes ?? 0;
  return (
    <section className={card} data-tint="peach" aria-label="Focus timer">
      <h2 className={`${h2} flex items-center gap-2`}><Timer className="h-5 w-5" /> Focus timer</h2>
      <p className="mt-2 font-display text-4xl font-extrabold tabular-nums text-[var(--text-primary)]" role="timer" aria-live="off">{mm}:{ss}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setRun((r) => !r)} className="btn-main !h-10 !text-sm">{run ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> {left < len * 60 ? "Resume" : "Start"}</>}</button>
        <button type="button" onClick={() => reset()} className="btn-soft !h-10 !px-3" aria-label="Reset timer"><RotateCcw className="h-4 w-4" /></button>
        {[25, 45, 60].map((n) => <button key={n} type="button" onClick={() => { setLen(n); reset(n); }} className={`pill-soft cursor-pointer text-xs ${len === n ? "!bg-[var(--btn)] !text-[var(--btn-fg)]" : ""}`}>{n} min</button>)}
      </div>
      <p className="mt-2 text-xs text-[var(--text-muted)]">Focused today: {todayMin} min. A finished round is logged for you.</p>
    </section>
  );
}
