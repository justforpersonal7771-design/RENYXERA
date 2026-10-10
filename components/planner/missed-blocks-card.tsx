"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Loader2, Sparkles } from "lucide-react";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useToastStore } from "@/store/use-toast-store";
import { serverDate, serverDayKey } from "@/lib/time/server-time";
import { toLocalDateStr } from "@/lib/utils";
import { buildSchedule } from "@/lib/planner/generate";
import { PLAN_EVENT_PREFIX, loadPlanOptions, savePlanOptions, scheduleTelegramBlocks, toCalendarEvents } from "@/lib/planner/apply";
import { openUpgrade } from "@/store/use-upgrade-modal-store";

const DISMISS = "renyxera.missed-dismissed";
const addDay = (d: string, n: number) => { const t = new Date(`${d}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };

/**
 * Asked once a day, never silently: if planner blocks were missed, offer to roll them forward to tomorrow, skip them,
 * or (Pro) re-plan everything that's left from today with the same settings. Plus and Pro only.
 */
export function MissedBlocksCard() {
  const ent = useEntitlements();
  const { events, loaded, loadEvents, updateEvent, deleteEvent, addEvents } = useCalendarStore();
  const [hidden, setHidden] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  useEffect(() => { void loadEvents(); try { setHidden(localStorage.getItem(DISMISS) === serverDayKey()); } catch { setHidden(false); } }, [loadEvents]);

  const today = toLocalDateStr(serverDate());
  const missed = useMemo(() => events.filter((e) => e.id.startsWith(PLAN_EVENT_PREFIX) && !e.completed && e.status !== "Skipped" && e.date < today), [events, today]);
  if (!ent.paid || !loaded || hidden || missed.length === 0) return null;

  const dismiss = () => { try { localStorage.setItem(DISMISS, serverDayKey()); } catch { /* ignore */ } setHidden(true); };
  const run = async (key: string, fn: () => Promise<string>) => { setBusy(key); try { useToastStore.getState().show(await fn()); dismiss(); } catch { useToastStore.getState().show("Couldn't update the plan. Nothing was lost.", "error"); } finally { setBusy(null); } };

  const roll = () => run("roll", async () => { const tomorrow = addDay(today, 1); for (const e of missed) await updateEvent(e.id, { date: tomorrow }); return `${missed.length} block${missed.length === 1 ? "" : "s"} moved to tomorrow`; });
  const skip = () => run("skip", async () => { for (const e of missed) await updateEvent(e.id, { status: "Skipped" }); return "Skipped. Your plan carries on from today."; });
  const replan = () => run("replan", async () => {
    const o = loadPlanOptions();
    if (!o) throw new Error("no saved plan");
    const fresh = buildSchedule({ ...o, start: addDay(today, 0) });
    for (const e of events) if (e.id.startsWith(PLAN_EVENT_PREFIX) && !e.completed) await deleteEvent(e.id);
    const made = toCalendarEvents(fresh.events, Date.now().toString(36));
    await addEvents(made);
    savePlanOptions({ ...o, start: today });
    void scheduleTelegramBlocks(made); // quietly refreshes Telegram reminders if linked
    return `Re-planned: ${made.length} blocks from today to your exam`;
  });

  return (
    <section aria-label="Missed study blocks" className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300"><CalendarClock className="h-3.5 w-3.5" aria-hidden /> Study Planner</p>
          <p className="mt-1 text-base font-extrabold text-[var(--text-primary)]">{missed.length} block{missed.length === 1 ? "" : "s"} didn&apos;t get done. What should we do?</p>
          <p className="text-xs text-[var(--text-muted)]">We ask once a day and never move anything without you.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={roll} disabled={!!busy} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-xs font-bold text-white disabled:opacity-60 cursor-pointer">{busy === "roll" && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Roll forward to tomorrow</button>
          {ent.tier === "pro" ? (
            <button type="button" onClick={replan} disabled={!!busy} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-b from-amber-200 to-amber-500 px-4 text-xs font-bold text-amber-950 disabled:opacity-60 cursor-pointer">{busy === "replan" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Re-plan the rest</button>
          ) : (
            <button type="button" onClick={() => openUpgrade("Re-plan the rest is a Pro feature")} className="cursor-pointer inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-500/50 px-4 text-xs font-bold text-amber-700 dark:text-amber-300"><Sparkles className="h-3.5 w-3.5" /> Re-plan the rest · Pro</button>
          )}
          <button type="button" onClick={skip} disabled={!!busy} className="h-9 rounded-lg border border-[var(--border)] px-4 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">Skip them</button>
          <button type="button" onClick={dismiss} className="h-9 rounded-lg px-3 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">Ask me tomorrow</button>
        </div>
      </div>
    </section>
  );
}
