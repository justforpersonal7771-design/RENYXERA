"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Download, Gauge, Loader2, Lock, Sparkles, Timer } from "lucide-react";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useToastStore } from "@/store/use-toast-store";
import { DatePicker } from "@/components/ui/date-picker";
import { serverDate, serverNow } from "@/lib/time/server-time";
import { toLocalDateStr } from "@/lib/utils";
import { buildSchedule } from "@/lib/planner/generate";
import { PLAN_EVENT_PREFIX, loadPlanOptions, rememberPlanSet, savePlanOptions, scheduleTelegramBlocks, toCalendarEvents } from "@/lib/planner/apply";
import { planProgress, shiftAvailability, toIcs, weakMarks } from "@/lib/planner/insights";
import { REVIEWS_OFF_KEY } from "@/components/planner/spaced-revision-sync";
import { getCurrentBranch } from "@/lib/branch/current";
import { istParts } from "@/lib/telegram/tiers";
import { openUpgrade } from "@/store/use-upgrade-modal-store";
import type { CalendarEvent } from "@/types/calendar.types";

const toast = (m: string, k: "success" | "error" | "info" = "success") => useToastStore.getState().show(m, k);
const HEALTH = {
  "on-track": { label: "On track", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  slipping: { label: "Slipping", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  "at-risk": { label: "At risk", cls: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
  "not-started": { label: "Not started", cls: "bg-[var(--surface-secondary)] text-[var(--text-secondary)]" },
} as const;

/**
 * Plus and Pro extras on the Study Planner page: how the plan is going (Pro adds a plain on-track / at-risk verdict),
 * export to Google/Apple calendar, your own mock exams in the planner, automatic spaced reviews, re-plan around weak
 * topics (Pro) and "what if" comparisons (Pro).
 */
export function PlanInsights() {
  const ent = useEntitlements();
  const { events, loaded, loadEvents, deleteEvent, addEvents } = useCalendarStore();
  const [busy, setBusy] = useState<string | null>(null);
  const [reviewsOn, setReviewsOn] = useState(true);
  const [extra, setExtra] = useState(0);            // what-if: minutes per day
  const [examShift, setExamShift] = useState<string | null>(null);
  useEffect(() => { void loadEvents(); try { setReviewsOn(localStorage.getItem(REVIEWS_OFF_KEY) !== "1"); } catch { /* default on */ } }, [loadEvents]);

  const today = toLocalDateStr(serverDate());
  const opts = typeof window === "undefined" ? null : loadPlanOptions();
  const progress = useMemo(() => planProgress(events, today), [events, today]);
  const pro = ent.tier === "pro";

  const whatIf = useMemo(() => {
    if (!opts || !pro) return null;
    const start = today > opts.start ? today : opts.start;
    const current = buildSchedule({ ...opts, start });
    const changed = buildSchedule({ ...opts, start, examDate: examShift ?? opts.examDate, availability: shiftAvailability(opts.availability, extra) });
    return { current, changed };
  }, [opts, pro, today, extra, examShift]);

  if (!ent.paid || !loaded) return null;
  const lock = (what: string) => openUpgrade(`${what} is a Pro feature`);
  const hrs = (m: number) => `${Math.round((m / 60) * 10) / 10} h`;

  const exportIcs = () => {
    const mine = events.filter((e) => e.date >= today || e.id.startsWith(PLAN_EVENT_PREFIX));
    if (!mine.length) return toast("Nothing in your planner to export yet.", "info");
    const d = new Date(serverNow());
    const stamp = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}T${String(d.getUTCHours()).padStart(2, "0")}${String(d.getUTCMinutes()).padStart(2, "0")}00Z`;
    const url = URL.createObjectURL(new Blob([toIcs(mine, stamp)], { type: "text/calendar;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "renyxera-study-planner.ics" });
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    toast(`${mine.length} entries exported. Open the file to add them to Google or Apple Calendar.`);
  };

  const printPlan = () => {
    const mine = events.filter((e) => e.date >= today).sort((a, b) => (a.date + (a.startTime ?? "")).localeCompare(b.date + (b.startTime ?? ""))).slice(0, 400);
    if (!mine.length) return toast("Nothing in your planner to print yet.", "info");
    const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
    const rows = mine.map((e) => `<tr><td>${esc(e.date)}</td><td>${esc(e.startTime ?? "")}${e.endTime ? " to " + esc(e.endTime) : ""}</td><td>${esc(e.title)}</td><td>${esc(e.category ?? "")}</td></tr>`).join("");
    const w = window.open("", "_blank");
    if (!w) return toast("Allow pop-ups to print your plan.", "info");
    w.document.write(`<!doctype html><title>My study plan | RENYXERA</title><style>body{font:14px system-ui;margin:24px}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ccc;padding:6px;text-align:left}th{font-size:12px;text-transform:uppercase}</style><h1>My study plan</h1><table><tr><th>Date</th><th>Time</th><th>Task</th><th>Type</th></tr>${rows}</table>`);
    w.document.close(); w.focus(); w.print();
  };

  const addMocks = async () => {
    setBusy("mocks");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const { data } = await createClient().from("mock_events").select("id, title, starts_at, ends_at").eq("branch_code", getCurrentBranch()).gt("ends_at", new Date(serverNow()).toISOString()).order("starts_at").limit(12);
      const have = new Set(events.map((e) => e.id));
      const made: CalendarEvent[] = [];
      for (const m of data ?? []) {
        const s = istParts(Date.parse(m.starts_at)), e = istParts(Date.parse(m.ends_at));
        if (!have.has(`mock-${m.id}`)) made.push({ id: `mock-${m.id}`, title: m.title, description: "All-India mock. Entry closes 30 minutes after the start.", category: "Mock Test", date: s.date, color: "#e11d48", priority: "High", completed: false, studyType: "Mock Test", timeRangeType: "start_end", startTime: s.hhmm, endTime: e.hhmm, revisionCycle: "One Time", status: "Pending" });
        const next = new Date(Date.parse(`${s.date}T00:00:00Z`) + 86400_000).toISOString().slice(0, 10);
        if (!have.has(`mock-${m.id}-a`)) made.push({ id: `mock-${m.id}-a`, title: `Analyse: ${m.title}`, description: "Review every question; fix one leak per mock.", category: "Revision", date: next, color: "#f59e0b", priority: "High", completed: false, studyType: "Revision", timeRangeType: "date_only", estimatedDurationMin: 60, revisionCycle: "One Time", status: "Pending" });
      }
      if (!made.length) return toast(data?.length ? "Your upcoming mocks are already in the planner." : "No upcoming mocks to add yet.", "info");
      await addEvents(made);
      toast(`${made.length} entries added: the mocks and an analysis day after each.`);
    } catch { toast("Couldn't load the mocks. Try again.", "error"); } finally { setBusy(null); }
  };

  const replace = async (next: NonNullable<typeof opts>, name: string) => {
    const fresh = buildSchedule(next);
    if (fresh.events.length === 0) { toast("No free time is left before the exam with those settings.", "error"); return false; }
    for (const e of events) if (e.id.startsWith(PLAN_EVENT_PREFIX) && !e.completed) await deleteEvent(e.id);
    const stamp = Date.now().toString(36);
    const made = toCalendarEvents(fresh.events, stamp);
    await addEvents(made);
    savePlanOptions(next);
    rememberPlanSet(stamp, { name, createdAt: new Date().toISOString(), branchLabel: "", examDate: next.examDate });
    void scheduleTelegramBlocks(made);
    toast(`${made.length} blocks planned from today`);
    return true;
  };

  const replanWeak = async () => {
    if (!opts) return toast("Make a plan first.", "info");
    setBusy("weak");
    try {
      const { useDataStore } = await import("@/store/use-data-store");
      const { useAnalyticsStore } = await import("@/store/use-analytics-store");
      await useDataStore.getState().loadRepository();
      await useAnalyticsStore.getState().loadAnalytics();
      const subjects = useAnalyticsStore.getState().dashboardMetrics?.subjectPerformance ?? [];
      const marks = weakMarks(opts.sections, subjects, opts.marks);
      const weak = Object.entries(marks).filter(([k, v]) => v === "weak" && opts.marks[k] !== "weak").map(([k]) => k);
      if (!weak.length && JSON.stringify(marks) === JSON.stringify(opts.marks)) return toast("Your results don't point to new weak sections yet. Practise a few more tests first.", "info");
      await replace({ ...opts, start: today, marks }, `Re-planned around weak topics on ${today}`);
      if (weak.length) toast(`More time given to: ${weak.join(", ")}`, "info");
    } catch { toast("Couldn't re-plan just now.", "error"); } finally { setBusy(null); }
  };

  const applyWhatIf = async () => {
    if (!opts) return;
    setBusy("whatif");
    try { if (await replace({ ...opts, start: today, examDate: examShift ?? opts.examDate, availability: shiftAvailability(opts.availability, extra) }, `What-if plan on ${today}`)) { setExtra(0); setExamShift(null); } } finally { setBusy(null); }
  };

  const card = "rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6";
  const btn = "inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] px-4 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] disabled:opacity-60 cursor-pointer";
  const h = HEALTH[progress.health];
  const diff = (a: number, b: number) => (b === a ? "same" : `${b > a ? "+" : ""}${b - a}`);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-2 font-extrabold text-[var(--text-primary)]"><Gauge className="h-4 w-4 text-violet-500" aria-hidden /> How your plan is going</h2>
          {pro ? <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${h.cls}`}>{h.label}</span> : (
            <button type="button" onClick={() => lock("The on-track check")} className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300"><Lock className="h-3 w-3" aria-hidden /> Pro: on-track check</button>
          )}
        </div>
        {progress.total === 0 ? <p className="mt-3 text-sm text-[var(--text-secondary)]">No plan blocks yet. Make a plan in the study-plan tool and your progress shows here.</p> : (
          <>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              {[
                ["This week", `${progress.weekDone} of ${progress.weekPlanned} blocks`, `${progress.weekHoursDone} of ${progress.weekHoursPlanned} h`],
                ["So far", `${progress.doneToDate} of ${progress.dueToDate} due blocks`, `${progress.hoursDoneToDate} of ${progress.hoursPlannedToDate} h`],
                ["Whole plan", `${progress.done} of ${progress.total} blocks`, `${Math.round((progress.done / progress.total) * 100)}% done`],
                ["Spaced reviews", reviewsOn ? "On" : "Off", "1, 3, 7, 14 days"],
              ].map(([k, v, s]) => <div key={k} className="rounded-xl bg-[var(--surface-secondary)]/60 p-3"><dt className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{k}</dt><dd className="mt-0.5 text-sm font-extrabold text-[var(--text-primary)]">{v}</dd><dd className="text-xs text-[var(--text-muted)]">{s}</dd></div>)}
            </dl>
            {pro && <p className="mt-3 text-sm text-[var(--text-secondary)]">{progress.advice}</p>}
          </>
        )}
      </section>

      <section className={card}>
        <h2 className="inline-flex items-center gap-2 font-extrabold text-[var(--text-primary)]"><CalendarDays className="h-4 w-4 text-violet-500" aria-hidden /> Tools</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={exportIcs} className={btn}><Download className="h-4 w-4" /> Add to Google / Apple Calendar</button>
          <button type="button" onClick={printPlan} className={btn}><Download className="h-4 w-4" /> Print plan</button>
          <button type="button" onClick={addMocks} disabled={busy === "mocks"} className={btn}>{busy === "mocks" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Timer className="h-4 w-4" />} Add upcoming mocks</button>
          {pro ? <button type="button" onClick={replanWeak} disabled={busy === "weak"} className={btn}>{busy === "weak" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-500" />} Re-plan around my weak topics</button>
            : <button type="button" onClick={() => lock("Re-planning around your weak topics")} className={btn}><Lock className="h-4 w-4 text-amber-500" /> Re-plan around weak topics · Pro</button>}
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer">
          <input type="checkbox" checked={reviewsOn} onChange={(e) => { setReviewsOn(e.target.checked); try { localStorage.setItem(REVIEWS_OFF_KEY, e.target.checked ? "0" : "1"); } catch { /* ignore */ } }} className="h-4 w-4 accent-violet-600" />
          Add short review reminders 1, 3, 7 and 14 days after I finish a topic
        </label>
        <p className="mt-2 text-xs text-[var(--text-muted)]">The calendar file works with Google, Apple and Outlook. Each timed block gets a 10-minute alert.</p>
      </section>

      <section className={`${card} lg:col-span-2`}>
        <h2 className="inline-flex items-center gap-2 font-extrabold text-[var(--text-primary)]"><Sparkles className="h-4 w-4 text-amber-500" aria-hidden /> What if? <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300">Pro</span></h2>
        {!pro ? (
          <div className="mt-2"><p className="text-sm text-[var(--text-secondary)]">Try studying more or less each day, or a different exam date, and see how your plan changes before you commit.</p>
            <button type="button" onClick={() => lock("What-if planning")} className="mt-3 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-b from-amber-200 to-amber-500 px-5 text-sm font-bold text-amber-950">Unlock with Pro</button></div>
        ) : !opts ? <p className="mt-2 text-sm text-[var(--text-secondary)]">Make a plan first, then compare changes here.</p> : (
          <>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div><p className="mb-1.5 text-xs font-bold text-[var(--text-secondary)]">Minutes more (or less) per study day: <b className="font-num">{extra > 0 ? "+" : ""}{extra}</b></p><input type="range" min={-60} max={180} step={15} value={extra} onChange={(e) => setExtra(Number(e.target.value))} className="w-full accent-violet-600" aria-label="Minutes more or less per study day" /></div>
              <div><p className="mb-1.5 text-xs font-bold text-[var(--text-secondary)]">Plan until</p><DatePicker value={examShift ?? opts.examDate} onChange={(v) => setExamShift(v === opts.examDate ? null : v)} min={today} /></div>
            </div>
            {whatIf && (
              <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[420px] text-sm">
                <thead><tr className="text-left text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]"><th className="py-1.5 pr-3">From today</th><th className="px-2">Now</th><th className="px-2">With your change</th><th className="px-2">Difference</th></tr></thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
                  {[["Study time", hrs(whatIf.current.minutes), hrs(whatIf.changed.minutes), (whatIf.changed.minutes - whatIf.current.minutes) / 60], ["Study days", whatIf.current.days, whatIf.changed.days, whatIf.changed.days - whatIf.current.days], ["Learning days", whatIf.current.phases.learn, whatIf.changed.phases.learn, whatIf.changed.phases.learn - whatIf.current.phases.learn], ["Revision days", whatIf.current.phases.revise, whatIf.changed.phases.revise, whatIf.changed.phases.revise - whatIf.current.phases.revise], ["Mock days", whatIf.current.phases.mock, whatIf.changed.phases.mock, whatIf.changed.phases.mock - whatIf.current.phases.mock]].map(([k, a, b2, d]) => (
                    <tr key={String(k)}><td className="py-2 pr-3 font-semibold">{k}</td><td className="px-2 font-num">{a}</td><td className="px-2 font-num font-bold">{b2}</td><td className="px-2 font-num text-[var(--text-secondary)]">{typeof d === "number" ? (Math.round(d * 10) / 10 === 0 ? "same" : diff(0, Math.round(d * 10) / 10)) : d}</td></tr>
                  ))}
                </tbody></table></div>
            )}
            <button type="button" onClick={applyWhatIf} disabled={busy === "whatif" || (extra === 0 && examShift === null)} className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-bold text-white disabled:opacity-50 cursor-pointer">{busy === "whatif" ? <><Loader2 className="h-4 w-4 animate-spin" /> Applying…</> : "Use this plan instead"}</button>
            <p className="mt-2 text-xs text-[var(--text-muted)]">Using it replaces the blocks you haven&apos;t done yet. Finished blocks stay.</p>
          </>
        )}
      </section>
    </div>
  );
}
