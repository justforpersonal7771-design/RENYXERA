"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { CalendarCheck, Check, Play } from "lucide-react";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { serverDate } from "@/lib/time/server-time";
import { toLocalDateStr } from "@/lib/utils";

export const START_TIMER_EVENT = "renyxera:start-timer";

/**
 * Today from your Study Planner: the blocks in the order you'll do them, with a tick and a "Start timer" that labels the
 * study timer with the block's subject. Plus and Pro; hidden when nothing is planned for today.
 */
export function TodayBlocksCard() {
  const ent = useEntitlements();
  const { events, loaded, loadEvents, updateEvent } = useCalendarStore();
  useEffect(() => { void loadEvents(); }, [loadEvents]);
  const today = toLocalDateStr(serverDate());
  const blocks = useMemo(() => events.filter((e) => e.date === today && e.status !== "Skipped" && e.status !== "Cancelled").sort((a, b) => (a.startTime ?? "99").localeCompare(b.startTime ?? "99")), [events, today]);
  if (!ent.paid || !loaded || blocks.length === 0) return null;
  const done = blocks.filter((b) => b.completed).length;
  const next = blocks.find((b) => !b.completed);

  return (
    <section aria-label="Today's study blocks" className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-transparent p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400"><CalendarCheck className="h-3.5 w-3.5" aria-hidden /> Today in your Study Planner</p>
        <span className="text-xs font-bold text-[var(--text-secondary)]">{done} of {blocks.length} done</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-[width] duration-500" style={{ width: `${(done / blocks.length) * 100}%` }} /></div>
      <ul className="mt-3 divide-y divide-[var(--border-subtle)]">
        {blocks.map((b) => (
          <li key={b.id} className="flex items-center gap-3 py-2.5">
            <button type="button" aria-label={b.completed ? `Mark "${b.title}" not done` : `Mark "${b.title}" done`} onClick={() => void updateEvent(b.id, { completed: !b.completed, status: b.completed ? "Pending" : "Completed" })}
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border cursor-pointer transition ${b.completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--border)] hover:border-violet-500"}`}>{b.completed && <Check className="h-4 w-4" strokeWidth={3} />}</button>
            <span className="min-w-0 flex-1">
              <span className={`block truncate text-sm font-semibold ${b.completed ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"}`}>{b.title}</span>
              <span className="block text-xs text-[var(--text-muted)]">{b.startTime ? `${b.startTime}${b.endTime ? ` to ${b.endTime}` : ""}` : "Any time today"}</span>
            </span>
            {!b.completed && (
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent(START_TIMER_EVENT, { detail: { label: b.subject ?? b.title } }))} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 cursor-pointer"><Play className="h-3 w-3 fill-current" /> Start timer</button>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[var(--text-muted)]">{next ? `Up next: ${next.title}` : "All of today's blocks are done. Well done."}</span>
        <Link href="/calendar" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">Open Study Planner →</Link>
      </div>
    </section>
  );
}
