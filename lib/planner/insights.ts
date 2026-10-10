// Pure helpers that read a learner's plan events: progress and plan health, spaced-review dates, calendar export,
// and marking weak sections from their own accuracy. No browser or database access, so they are easy to test.
import type { CalendarEvent } from "@/types/calendar.types";
import type { Availability, Mark, PlanSection } from "@/lib/planner/generate";
import { cleanWindows } from "@/lib/planner/generate";

const DAY = 86400_000;
const addDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);
const mondayOf = (d: string) => addDays(d, -((new Date(`${d}T00:00:00Z`).getUTCDay() + 6) % 7));
const minutesOf = (e: CalendarEvent) => e.estimatedDurationMin ?? e.durationMin ?? 0;
const isPlan = (e: CalendarEvent) => e.id.startsWith("plan-");

export type Progress = {
  total: number; done: number;
  dueToDate: number; doneToDate: number;           // blocks that should be finished by yesterday, and how many are
  hoursPlannedToDate: number; hoursDoneToDate: number;
  weekPlanned: number; weekDone: number; weekHoursPlanned: number; weekHoursDone: number;
  ratio: number | null;                            // done ÷ due so far (null before anything is due)
  health: "on-track" | "slipping" | "at-risk" | "not-started";
  advice: string;
};

/** How the plan is going, as of `today` (YYYY-MM-DD). Only plan blocks count; skipped blocks are neither due nor missed. */
export function planProgress(events: CalendarEvent[], today: string): Progress {
  const blocks = events.filter((e) => isPlan(e) && e.status !== "Skipped" && e.status !== "Cancelled");
  const due = blocks.filter((e) => e.date < today);
  const doneDue = due.filter((e) => e.completed);
  const hours = (xs: CalendarEvent[]) => Math.round((xs.reduce((n, e) => n + minutesOf(e), 0) / 60) * 10) / 10;
  const mon = mondayOf(today), sun = addDays(mon, 6);
  const week = blocks.filter((e) => e.date >= mon && e.date <= sun);
  const ratio = due.length ? doneDue.length / due.length : null;
  const health = ratio === null ? "not-started" : ratio >= 0.8 ? "on-track" : ratio >= 0.5 ? "slipping" : "at-risk";
  const advice = health === "not-started" ? "Your plan starts soon. Nothing is due yet."
    : health === "on-track" ? "You're on track. Keep the same load."
    : health === "slipping" ? "A few blocks slipped. Roll them forward, or re-plan the rest from today."
    : "You're well behind. Fewer hours a day that you can actually keep beats a big plan you can't. Use Change a day or Re-plan the rest.";
  return {
    total: blocks.length, done: blocks.filter((e) => e.completed).length, dueToDate: due.length, doneToDate: doneDue.length,
    hoursPlannedToDate: hours(due), hoursDoneToDate: hours(doneDue),
    weekPlanned: week.length, weekDone: week.filter((e) => e.completed).length, weekHoursPlanned: hours(week), weekHoursDone: hours(week.filter((e) => e.completed)),
    ratio, health, advice,
  };
}

/** Review dates after a topic block is finished: 1, 3, 7 and 14 days later (spaced repetition). */
export const REVIEW_GAPS = [1, 3, 7, 14] as const;
export function spacedReviewDates(finishedOn: string, examDate: string): string[] {
  return REVIEW_GAPS.map((g) => addDays(finishedOn, g)).filter((d) => d < examDate);
}

/** Sections to mark "weak" from the learner's own accuracy by subject: below 50% with at least 5 attempts. */
export function weakMarks(sections: PlanSection[], subjects: { subject: string; attempted: number; correct: number }[], existing: Record<string, Mark> = {}): Record<string, Mark> {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const out = { ...existing };
  for (const sec of sections) {
    const t = norm(sec.title);
    const hit = subjects.filter((s) => s.attempted >= 5 && (norm(s.subject).includes(t) || t.includes(norm(s.subject))));
    const attempted = hit.reduce((n, s) => n + s.attempted, 0), correct = hit.reduce((n, s) => n + s.correct, 0);
    if (attempted >= 5 && correct / attempted < 0.5) out[sec.title] = "weak";
    else if (attempted >= 10 && correct / attempted >= 0.8) out[sec.title] = "strong";
  }
  return out;
}

const pad = (n: number) => String(n).padStart(2, "0");
const icsEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
/** IST wall clock (date + HH:MM) → "YYYYMMDDTHHMMSSZ" in UTC, so every calendar app shows the right time. */
const istToUtcStamp = (date: string, hhmm: string) => {
  const d = new Date(Date.parse(`${date}T${hhmm}:00+05:30`));
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
};

/** A .ics file for Google / Apple / Outlook calendar: timed events with a 10-minute alert, date-only events as all-day. */
export function toIcs(events: CalendarEvent[], nowStamp: string): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//RENYXERA//Study Planner//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:RENYXERA Study Planner"];
  for (const e of events) {
    lines.push("BEGIN:VEVENT", `UID:${e.id}@renyxera`, `DTSTAMP:${nowStamp}`);
    if (e.startTime) {
      lines.push(`DTSTART:${istToUtcStamp(e.date, e.startTime)}`, `DTEND:${istToUtcStamp(e.date, e.endTime ?? e.startTime)}`);
    } else {
      const next = addDays(e.date, 1).replace(/-/g, "");
      lines.push(`DTSTART;VALUE=DATE:${e.date.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${next}`);
    }
    lines.push(`SUMMARY:${icsEscape(e.title)}`, ...(e.description ? [`DESCRIPTION:${icsEscape(e.description)}`] : []), `CATEGORIES:${icsEscape(e.category)}`);
    if (e.startTime) lines.push("BEGIN:VALARM", "TRIGGER:-PT10M", "ACTION:DISPLAY", `DESCRIPTION:${icsEscape(e.title)}`, "END:VALARM");
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/** "What if I studied N minutes more (or less) a day?": lengthens (or shortens) the last window of every weekday that has one. */
export function shiftAvailability(av: Availability, deltaMin: number): Availability {
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const weekly: Availability["weekly"] = {};
  for (const [d, ws] of Object.entries(av.weekly)) {
    const list = cleanWindows(ws);
    if (!list.length) { weekly[Number(d)] = []; continue; }
    const last = list[list.length - 1];
    const [h, m] = last.end.split(":").map(Number);
    const end = Math.max(0, Math.min(23 * 60 + 45, h * 60 + m + deltaMin));
    weekly[Number(d)] = [...list.slice(0, -1), { start: last.start, end: `${pad2(Math.floor(end / 60))}:${pad2(end % 60)}` }];
  }
  return { weekly, overrides: av.overrides };
}
