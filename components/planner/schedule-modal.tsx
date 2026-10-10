"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CalendarPlus, Check, Crown, Loader2, X } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { NumberStepper } from "@/components/ui/number-stepper";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useToastStore } from "@/store/use-toast-store";
import { serverDate } from "@/lib/time/server-time";
import { toLocalDateStr } from "@/lib/utils";
import { buildSchedule, type Mark, type PlanSection } from "@/lib/planner/generate";
import { PLAN_EVENT_PREFIX, savePlanOptions, scheduleTelegramBlocks, toCalendarEvents } from "@/lib/planner/apply";
import { openUpgrade } from "@/store/use-upgrade-modal-store";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const defaultDays = (perWeek: number) => (perWeek >= 7 ? [0, 1, 2, 3, 4, 5, 6] : perWeek === 6 ? [1, 2, 3, 4, 5, 6] : perWeek === 5 ? [1, 2, 3, 4, 5] : perWeek === 4 ? [1, 2, 4, 5] : [1, 3, 5]);

/**
 * "Put this plan in my calendar": asks first, lets the learner customise (start date, days, daily hours, start time,
 * which phases), shows exactly what will be created, then adds it. Auto-scheduling is a Plus / Pro feature.
 */
export function ScheduleModal({ open, onClose, sections, marks, examDate, hoursPerDay, daysPerWeek, branchLabel }: {
  open: boolean; onClose: () => void; sections: PlanSection[]; marks: Record<string, Mark>; examDate: string; hoursPerDay: number; daysPerWeek: number; branchLabel: string;
}) {
  const ent = useEntitlements();
  const { events, addEvents, deleteEvent, loadEvents } = useCalendarStore();
  const [start, setStart] = useState(() => toLocalDateStr(serverDate()));
  const [weekdays, setWeekdays] = useState<number[]>(() => defaultDays(daysPerWeek));
  const [hours, setHours] = useState(hoursPerDay);
  const [time, setTime] = useState("06:00");
  const [revision, setRevision] = useState(true);
  const [mocks, setMocks] = useState(true);
  const [mistakes, setMistakes] = useState(true);
  const [replace, setReplace] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const [tgLinked, setTgLinked] = useState<boolean | null>(null);
  const [tgRemind, setTgRemind] = useState(true);
  const [tgNote, setTgNote] = useState<string | null>(null);
  useEffect(() => {
    if (!open || !ent.paid) return;
    void fetch("/api/telegram/status", { cache: "no-store" }).then((r) => r.json()).then((j) => setTgLinked(!!j.linked)).catch(() => setTgLinked(false));
  }, [open, ent.paid]);

  const result = useMemo(
    () => buildSchedule({ start, examDate, weekdays, hoursPerDay: hours, startTime: time, sections, marks, includeRevision: revision, includeMocks: mocks, includeMistakes: mistakes }),
    [start, examDate, weekdays, hours, time, sections, marks, revision, mocks, mistakes],
  );
  const earlier = events.filter((e) => e.id.startsWith(PLAN_EVENT_PREFIX) && !e.completed).length;
  const paid = ent.paid;

  const create = async () => {
    setBusy(true);
    try {
      if (replace) for (const e of events) if (e.id.startsWith(PLAN_EVENT_PREFIX) && !e.completed) await deleteEvent(e.id);
      const made = toCalendarEvents(result.events, Date.now().toString(36));
      await addEvents(made);
      await loadEvents();
      savePlanOptions({ start, examDate, weekdays, hoursPerDay: hours, startTime: time, sections, marks, includeRevision: revision, includeMocks: mocks, includeMistakes: mistakes });
      setTgNote(null);
      if (tgRemind && tgLinked) {
        const r = await scheduleTelegramBlocks(made);
        setTgNote(r.ok ? `Telegram will remind you 10 minutes before each of the next ${r.scheduled} blocks.` : r.error ?? "Telegram reminders couldn't be set.");
      }
      setDone(result.events.length);
      useToastStore.getState().show(`${result.events.length} study blocks added to your Study Planner`, "success");
    } catch {
      useToastStore.getState().show("Couldn't add the plan. Nothing was lost — try again.", "error");
    } finally { setBusy(false); }
  };

  if (!open || typeof document === "undefined") return null;
  const chip = (on: boolean) => `h-9 min-w-11 px-3 rounded-lg border text-xs font-bold cursor-pointer transition ${on ? "border-violet-600 bg-violet-600 text-white" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"}`;
  const tick = (label: string, v: boolean, set: (b: boolean) => void) => (
    <label className="flex items-center gap-2 text-sm text-[var(--text-primary)] cursor-pointer"><input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} className="h-4 w-4 accent-violet-600" />{label}</label>
  );

  return createPortal(
    <div className="fixed inset-0 z-[300] grid place-items-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Add this plan to your Study Planner" className="relative w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-2xl">
        <button type="button" aria-label="Close" onClick={onClose} className="absolute right-4 top-4 rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"><X className="h-4 w-4" /></button>
        {done != null ? (
          <div className="py-6 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500/15"><Check className="h-6 w-6 text-emerald-500" /></span>
            <h2 className="mt-3 text-xl font-extrabold text-[var(--text-primary)]">Your plan is in the calendar</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{done} study blocks for {branchLabel} until {examDate}. Tick them off as you go, and move any block you need to.</p>
            {tgNote && <p className="mt-2 text-sm font-semibold text-sky-600 dark:text-sky-400">{tgNote}</p>}
            <div className="mt-5 flex justify-center gap-2">
              <Link href="/calendar" className="inline-flex h-10 items-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-bold text-white">Open Study Planner</Link>
              <button type="button" onClick={onClose} className="h-10 rounded-xl border border-[var(--border)] px-5 text-sm font-semibold text-[var(--text-primary)] cursor-pointer">Done</button>
            </div>
          </div>
        ) : (
          <>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400"><CalendarPlus className="h-3.5 w-3.5" /> Before we add it</p>
            <h2 className="mt-1 text-xl font-extrabold text-[var(--text-primary)]">Customise your schedule</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Nothing is added until you confirm. Change anything below — the summary updates as you go.</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><p className="mb-1.5 text-xs font-bold text-[var(--text-secondary)]">Start on</p><DatePicker value={start} onChange={setStart} min={toLocalDateStr(serverDate())} max={examDate} /></div>
              <div><p className="mb-1.5 text-xs font-bold text-[var(--text-secondary)]">First block starts at</p><TimePicker value={time} onChange={setTime} step={15} /></div>
              <div><p className="mb-1.5 text-xs font-bold text-[var(--text-secondary)]">Hours per study day</p><NumberStepper ariaLabel="Hours per study day" min={1} max={12} value={hours} onChange={setHours} /></div>
              <div><p className="mb-1.5 text-xs font-bold text-[var(--text-secondary)]">Exam date (from your target year)</p><p className="flex h-10 items-center rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 text-sm font-semibold font-num text-[var(--text-primary)]">{examDate}</p></div>
            </div>
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-bold text-[var(--text-secondary)]">Study days</p>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Study days">
                {WEEKDAYS.map((d, i) => <button key={d} type="button" aria-pressed={weekdays.includes(i)} onClick={() => setWeekdays((w) => (w.includes(i) ? w.filter((x) => x !== i) : [...w, i]))} className={chip(weekdays.includes(i))}>{d}</button>)}
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {tick("Revision phase with PYQs", revision, setRevision)}
              {tick("Full mocks and analysis", mocks, setMocks)}
              {tick("Weekly mistakes review", mistakes, setMistakes)}
              {tick(earlier > 0 ? `Replace my earlier plan (${earlier} blocks)` : "Replace any earlier plan", replace, setReplace)}
            </div>

            {paid && (
              <div className="mt-4 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-3 text-sm">
                {tgLinked ? tick("Also remind me on Telegram, 10 minutes before each block", tgRemind, setTgRemind) : (
                  <p className="text-[var(--text-secondary)]"><Link href="/profile#telegram" className="font-bold text-sky-600 dark:text-sky-400 hover:underline">Link Telegram</Link> to get a message before every block, with Done and +15 min buttons.</p>
                )}
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-[var(--surface-secondary)]/60 p-4 text-sm" aria-live="polite">
              {weekdays.length === 0 ? <p className="font-semibold text-rose-500">Pick at least one study day.</p> : result.events.length === 0 ? <p className="font-semibold text-rose-500">There is no time left before the exam from that start date.</p> : (
                <>
                  <p className="font-extrabold text-[var(--text-primary)]">{result.events.length} blocks over {result.days} study days</p>
                  <p className="mt-1 text-[var(--text-secondary)]">Learn &amp; practise {result.phases.learn} days · Revise with PYQs {result.phases.revise} days · Mocks {result.phases.mock} days. First: {result.events[0].title} on {result.events[0].date}.</p>
                </>
              )}
            </div>

            {!paid && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm">
                <Crown className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                <p className="text-[var(--text-primary)]"><b>Automatic scheduling is a Plus &amp; Pro feature.</b> Your plan above is free to read and follow; upgrade to have it placed in your calendar with reminders and progress tracking.</p>
              </div>
            )}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={onClose} className="h-10 rounded-xl border border-[var(--border)] px-5 text-sm font-semibold text-[var(--text-primary)] cursor-pointer">Not now</button>
              {paid ? (
                <button type="button" onClick={create} disabled={busy || result.events.length === 0} className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-bold text-white disabled:opacity-60 cursor-pointer">
                  {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Adding…</> : <>Add {result.events.length} blocks to my calendar</>}
                </button>
              ) : (
                <button type="button" onClick={() => openUpgrade("Automatic scheduling is a Plus and Pro feature")} className="cursor-pointer inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-b from-amber-200 to-amber-500 px-5 text-sm font-bold text-amber-950">See Plus &amp; Pro</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
