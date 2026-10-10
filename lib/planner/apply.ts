import type { CalendarEvent } from "@/types/calendar.types";
import { simpleAvailability, type PlanEvent, type PlanOptions } from "@/lib/planner/generate";

export const PLAN_EVENT_PREFIX = "plan-";
export const OPTIONS_KEY = "renyxera.plan-options";
const COLOR: Record<PlanEvent["phase"], string> = { learn: "#6366f1", revise: "#f59e0b", mock: "#e11d48" };

/** Calendar events for a generated plan. Ids start with "plan-" so a later plan can replace them. */
export function toCalendarEvents(events: PlanEvent[], stamp: string): CalendarEvent[] {
  return events.map((p, n) => ({
    id: `${PLAN_EVENT_PREFIX}${stamp}-${n}`, title: p.title, description: p.description, category: p.category, date: p.date, color: COLOR[p.phase],
    priority: p.priority, completed: false, subject: p.subject, studyType: p.studyType, timeRangeType: "start_end", startTime: p.startTime, endTime: p.endTime,
    estimatedDurationMin: p.durationMin, revisionCycle: "One Time", status: "Pending",
  }));
}

/** Remember the plan settings so "re-plan the rest" and "change a day" can rebuild with the same choices. */
export function savePlanOptions(o: PlanOptions) { try { localStorage.setItem(OPTIONS_KEY, JSON.stringify(o)); } catch { /* storage unavailable */ } }
/** Saved settings, including plans saved before availability windows existed (a weekday list, hours and start time). */
export function loadPlanOptions(): PlanOptions | null {
  try {
    const r = JSON.parse(localStorage.getItem(OPTIONS_KEY) || "null") as (PlanOptions & { weekdays?: number[]; hoursPerDay?: number; startTime?: string }) | null;
    if (!r) return null;
    if (r.availability) return r;
    return { ...r, availability: simpleAvailability(r.weekdays ?? [1, 2, 3, 4, 5, 6], r.hoursPerDay ?? 3, r.startTime ?? "06:00") };
  } catch { return null; }
}

// Each plan the learner adds is a named "set" (its events share an id stamp), so it can be listed and removed later.
const SETS_KEY = "renyxera.plan-sets";
export type PlanSetMeta = { name: string; createdAt: string; branchLabel: string; examDate: string };
export function loadPlanSets(): Record<string, PlanSetMeta> { try { return JSON.parse(localStorage.getItem(SETS_KEY) || "{}") as Record<string, PlanSetMeta>; } catch { return {}; } }
export function rememberPlanSet(stamp: string, meta: PlanSetMeta) { try { localStorage.setItem(SETS_KEY, JSON.stringify({ ...loadPlanSets(), [stamp]: meta })); } catch { /* ignore */ } }
export function forgetPlanSet(stamp: string) { try { const s = loadPlanSets(); delete s[stamp]; localStorage.setItem(SETS_KEY, JSON.stringify(s)); } catch { /* ignore */ } }
/** "plan-<stamp>-<n>" → stamp */
export const planStampOf = (id: string) => /^plan-([a-z0-9]+)-\d+$/.exec(id)?.[1] ?? null;

const IST = "+05:30";
/** Ask the server to send a Telegram message `leadMin` minutes before each block (Plus and Pro; the server enforces it). */
export async function scheduleTelegramBlocks(evs: CalendarEvent[], leadMin = 10, replace = true): Promise<{ ok: boolean; scheduled?: number; error?: string; needsLink?: boolean; upgrade?: boolean }> {
  const items = evs.filter((e) => e.startTime).map((e) => ({
    remindAt: new Date(Date.parse(`${e.date}T${e.startTime}:00${IST}`) - leadMin * 60_000).toISOString(),
    title: e.title, body: `${e.startTime}–${e.endTime ?? ""}${e.estimatedDurationMin ? ` · ${Math.round((e.estimatedDurationMin / 60) * 10) / 10} h` : ""}`,
    eventId: e.id, eventDate: e.date,
  }));
  if (!items.length) return { ok: true, scheduled: 0 };
  let scheduled = 0;
  try {
    for (let i = 0; i < items.length; i += 500) {
      const r = await fetch("/api/telegram/reminders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "block", items: items.slice(i, i + 500), replace: replace && i === 0 }) });
      const j = await r.json();
      if (!r.ok) return { ok: false, error: j.error, needsLink: !!j.needsLink, upgrade: !!j.upgrade };
      scheduled += j.scheduled ?? 0;
    }
    return { ok: true, scheduled };
  } catch { return { ok: false, error: "Couldn't reach the server." }; }
}
