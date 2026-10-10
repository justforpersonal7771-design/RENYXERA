"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DatePicker } from "@/components/ui/date-picker";
import { motion } from "motion/react";
import { CalendarDays, Clock, Play, Target } from "lucide-react";
import { examDateFor } from "@/lib/goals/exam-year";
import { useTargetYear } from "@/store/use-auth-store";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { getCurrentBranch } from "@/lib/branch/current";
import { BRANCHES, type BranchCode } from "@/lib/branches";
import { syllabusHref } from "@/lib/seo/branch-links";
import { serverNow } from "@/lib/time/server-time";
import { ScheduleModal } from "@/components/planner/schedule-modal";

type Section = { title: string; share: number };
type Mark = "weak" | "normal" | "strong";

/**
 * Free tool (6A): GATE CS study plan + countdown. Hours per section follow real past-paper
 * weightage, adjusted for the student's weak/strong sections; the calendar runs
 * learn & practise → revision with PYQs → full mocks, compressing when the exam is close.
 */
export function StudyPlanTool({ byBranch }: { byBranch: Partial<Record<BranchCode, Section[]>> }) {
  const targetYear = useTargetYear();
  // Branch: the learner's own paper by default, switchable. Exam date: set automatically from the target year
  // (or the date picked in the Study Planner), and editable here.
  const [code, setCode] = useState<BranchCode>("CSE");
  useEffect(() => { const c = getCurrentBranch(); if (byBranch[c]) setCode(c); }, [byBranch]);
  const sections = byBranch[code] ?? byBranch.CSE ?? [];
  const [savedExam, setSavedExam] = useState<string | null>(null);
  const [pickedExam, setPickedExam] = useState<string | null>(null);
  useEffect(() => { void IDBManager.getMetadata("target_exam_date").then((r) => { if (r?.value) setSavedExam(String(r.value)); }).catch(() => null); }, []);
  const examDate = pickedExam ?? examDateFor(targetYear, savedExam);
  const setExamDate = (v: string) => { setPickedExam(v); if (v.startsWith(String(targetYear))) void IDBManager.setMetadata("target_exam_date", v); };
  const [scheduling, setScheduling] = useState(false);
  const [hours, setHours] = useState(3);
  const [days, setDays] = useState(6);
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  useEffect(() => setMarks({}), [code]);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(serverNow()); const t = setInterval(() => setNow(serverNow()), 60_000); return () => clearInterval(t); }, []);

  const plan = useMemo(() => {
    const start = now ?? Date.parse(`${examDate}T00:00:00+05:30`) - 120 * 86400_000;
    const daysLeft = Math.max(0, Math.ceil((Date.parse(`${examDate}T09:30:00+05:30`) - start) / 86400_000));
    const weeks = Math.max(1, Math.floor(daysLeft / 7));
    const total = Math.round(weeks * days * hours);
    const [learnShare, revShare] = weeks >= 16 ? [0.6, 0.25] : weeks >= 8 ? [0.5, 0.3] : [0.35, 0.35];
    const mockShare = 1 - learnShare - revShare;
    const factor = (t: string) => (marks[t] === "weak" ? 1.5 : marks[t] === "strong" ? 0.6 : 1);
    const raw = sections.map((s) => ({ ...s, w: Math.max(0.01, s.share) * factor(s.title) }));
    const sum = raw.reduce((n, s) => n + s.w, 0);
    const learnHours = total * learnShare;
    const bySection = raw.map((s) => ({ title: s.title, hours: Math.round((s.w / sum) * learnHours) })).sort((a, b) => b.hours - a.hours);
    // Week-by-week for the learning phase: fill weeks in order of hours.
    const learnWeeks = Math.max(1, Math.round(weeks * learnShare));
    const perWeek = learnHours / learnWeeks;
    const schedule: { week: number; items: string[] }[] = [];
    let week = 1, left = perWeek;
    for (const s of bySection) {
      let h = s.hours;
      while (h > 0 && week <= learnWeeks) {
        const take = Math.min(h, left);
        const slot = schedule.find((x) => x.week === week) ?? (schedule.push({ week, items: [] }), schedule[schedule.length - 1]);
        if (take >= 1 && !slot.items.includes(s.title)) slot.items.push(s.title);
        h -= take; left -= take;
        if (left <= 0.5) { week++; left = perWeek; }
      }
    }
    return { daysLeft, weeks, total, learnWeeks, revWeeks: Math.max(1, Math.round(weeks * revShare)), mockWeeks: Math.max(1, weeks - learnWeeks - Math.max(1, Math.round(weeks * revShare))), mockShare, bySection, schedule };
  }, [examDate, hours, days, marks, sections, now]);

  const cycle = (t: string) => setMarks((m) => ({ ...m, [t]: m[t] === "weak" ? "strong" : m[t] === "strong" ? "normal" : "weak" }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8 space-y-5">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Your paper">
          {BRANCHES.filter((x) => byBranch[x.code]).map((x) => (
            <button key={x.code} type="button" role="radio" aria-checked={x.code === code} onClick={() => setCode(x.code)}
              className={`h-9 rounded-full border px-4 text-sm font-bold cursor-pointer ${x.code === code ? "border-violet-600 bg-violet-600 text-white" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"}`}>GATE {x.paper}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block"><span className="text-sm font-bold text-[var(--text-secondary)]">Exam date <span className="font-normal text-[var(--text-muted)]">(set from your target year)</span></span>
            <div className="mt-2"><DatePicker value={examDate} onChange={setExamDate} /></div></label>
          <label className="block"><span className="text-sm font-bold text-[var(--text-secondary)]">Hours a day: <b className="font-num">{hours}</b></span>
            <input type="range" min={1} max={12} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-4 w-full accent-violet-600" /></label>
          <label className="block"><span className="text-sm font-bold text-[var(--text-secondary)]">Study days a week: <b className="font-num">{days}</b></span>
            <input type="range" min={3} max={7} value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-4 w-full accent-violet-600" /></label>
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text-secondary)]">Tap a section to mark it <span className="text-rose-600 dark:text-rose-400">weak</span> (more time) or <span className="text-emerald-600 dark:text-emerald-400">strong</span> (less time)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sections.map((s) => {
              const m = marks[s.title] ?? "normal";
              return (
                <button key={s.title} type="button" onClick={() => cycle(s.title)} aria-pressed={m !== "normal"}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-colors ${m === "weak" ? "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300" : m === "strong" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>
                  {s.title}{m !== "normal" ? ` · ${m}` : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([[CalendarDays, "Days left", plan.daysLeft], [Target, "Weeks", plan.weeks], [Clock, "Study hours", plan.total], [Play, "Mock weeks", plan.mockWeeks]] as const).map(([Icon, k, v], i) => (
          <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-500/20 p-4">
            <Icon className="w-4 h-4 text-violet-500" />
            <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{k}</p>
            <p className="text-2xl font-extrabold font-num text-[var(--text-primary)]">{Number(v).toLocaleString("en-IN")}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="font-extrabold text-[var(--text-primary)]">Your plan in three phases</h2>
        <div className="mt-3 flex h-9 w-full overflow-hidden rounded-xl text-[11px] font-bold text-white" aria-hidden>
          <span className="chart-grow-x flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-600 min-w-0 truncate px-1" style={{ width: `${(plan.learnWeeks / plan.weeks) * 100}%` }}>Learn · {plan.learnWeeks}w</span>
          <span className="chart-grow-x flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 min-w-0 truncate px-1" style={{ width: `${(plan.revWeeks / plan.weeks) * 100}%`, animationDelay: "120ms" }}>Revise · {plan.revWeeks}w</span>
          <span className="chart-grow-x flex items-center justify-center bg-gradient-to-r from-fuchsia-600 to-rose-500 min-w-0 truncate px-1 flex-1" style={{ animationDelay: "240ms" }}>Mocks · {plan.mockWeeks}w</span>
        </div>
        <ol className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <li className="rounded-xl bg-[var(--surface-secondary)]/60 p-3"><b className="text-[var(--text-primary)]">1 · Learn &amp; practise</b><br /><span className="text-[var(--text-secondary)]">Weeks 1–{plan.learnWeeks}: cover each section, then its PYQs.</span></li>
          <li className="rounded-xl bg-[var(--surface-secondary)]/60 p-3"><b className="text-[var(--text-primary)]">2 · Revise with PYQs</b><br /><span className="text-[var(--text-secondary)]">Next {plan.revWeeks} week{plan.revWeeks > 1 ? "s" : ""}: mistakes bank, weak topics, timed subject tests.</span></li>
          <li className="rounded-xl bg-[var(--surface-secondary)]/60 p-3"><b className="text-[var(--text-primary)]">3 · Full mocks</b><br /><span className="text-[var(--text-secondary)]">Last {plan.mockWeeks} week{plan.mockWeeks > 1 ? "s" : ""}: full 180-minute papers and the Sunday All-India Mock.</span></li>
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-extrabold text-[var(--text-primary)] mb-3">Hours per section (learning phase)</h2>
          <ol className="space-y-2">
            {plan.bySection.map((s) => {
              const max = plan.bySection[0]?.hours || 1;
              return (
                <li key={s.title} className="grid grid-cols-[minmax(0,1fr)_3.5rem] items-center gap-3 text-sm">
                  <span className="min-w-0"><span className="block truncate text-[var(--text-primary)]">{s.title}</span>
                    <span className="block h-1.5 mt-1 rounded-full bg-[var(--surface-secondary)] overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${(s.hours / max) * 100}%` }} /></span></span>
                  <span className="text-right font-num font-bold text-[var(--text-primary)]">{s.hours} h</span>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-extrabold text-[var(--text-primary)] mb-3">Week by week</h2>
          <ol className="space-y-1.5 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
            {plan.schedule.map((w) => (
              <li key={w.week} className="flex gap-3 text-sm"><span className="w-16 shrink-0 font-num font-bold text-violet-600 dark:text-violet-400">Week {w.week}</span><span className="text-[var(--text-secondary)]">{w.items.join(" · ")}</span></li>
            ))}
            <li className="flex gap-3 text-sm"><span className="w-16 shrink-0 font-num font-bold text-amber-600">Then</span><span className="text-[var(--text-secondary)]">{plan.revWeeks} week{plan.revWeeks > 1 ? "s" : ""} revision · {plan.mockWeeks} week{plan.mockWeeks > 1 ? "s" : ""} mocks</span></li>
          </ol>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-5 sm:p-6">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Plus &amp; Pro</p>
          <h2 className="mt-1 font-extrabold text-[var(--text-primary)]">Put this plan in your calendar automatically</h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--text-secondary)]">We&apos;ll ask how you want it first: start date, study days, daily hours and start time. Then every block goes into your Study Planner so you can tick it off and track it.</p>
        </div>
        <button type="button" onClick={() => setScheduling(true)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 cursor-pointer">Add to my Study Planner</button>
      </div>
      <ScheduleModal open={scheduling} onClose={() => setScheduling(false)} sections={sections} marks={marks} examDate={examDate} hoursPerDay={hours} daysPerWeek={days} branchLabel={`GATE ${BRANCHES.find((x) => x.code === code)?.paper ?? ""}`} />

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-violet-500/25">Track this plan in RENYXERA — free</Link>
        <Link href={syllabusHref(code)} className="inline-flex items-center justify-center h-11 px-5 rounded-xl border border-[var(--border)] font-semibold text-[var(--text-primary)]">See the syllabus with weightage</Link>
      </div>
    </div>
  );
}
