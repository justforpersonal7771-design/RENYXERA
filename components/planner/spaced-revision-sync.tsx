"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { loadPlanOptions, planStampOf } from "@/lib/planner/apply";
import { spacedReviewDates } from "@/lib/planner/insights";
import { toLocalDateStr } from "@/lib/utils";
import { serverDate } from "@/lib/time/server-time";
import type { CalendarEvent } from "@/types/calendar.types";

const DONE_KEY = "renyxera.reviews-made";
export const REVIEWS_OFF_KEY = "renyxera.reviews-off";

/**
 * Spaced revision (Plus and Pro): when a "Learn & practise" block is ticked off, short review reminders are added at
 * 1, 3, 7 and 14 days (all-day entries, so they never clash with your timed blocks). Each finished block is handled once.
 * Switch it off under Study Planner → My plans.
 */
export function SpacedRevisionSync() {
  const user = useAuthStore((s) => s.user);
  const paid = useEntitlements().paid;
  const { events, loaded, addEvents } = useCalendarStore();

  useEffect(() => {
    if (!user || !paid || !loaded) return;
    try { if (localStorage.getItem(REVIEWS_OFF_KEY) === "1") return; } catch { /* default on */ }
    let seen: Record<string, 1> = {};
    try { seen = JSON.parse(localStorage.getItem(DONE_KEY) || "{}"); } catch { /* start fresh */ }
    const today = toLocalDateStr(serverDate());
    const exam = loadPlanOptions()?.examDate ?? "2100-01-01";
    const made: CalendarEvent[] = [];
    for (const e of events) {
      if (!e.completed || seen[e.id] || !e.id.startsWith("plan-") || e.studyType !== "Study" || !e.subject) continue;
      seen[e.id] = 1;
      const stamp = planStampOf(e.id);
      spacedReviewDates(e.date >= today ? e.date : today, exam).forEach((date, i) => {
        if (events.some((x) => x.date === date && x.title === `Review: ${e.subject}` && x.category === "Revision")) return;
        made.push({ id: `plan-${stamp ?? "r"}-${900000 + made.length + i + Math.floor(Math.random() * 90000)}`, title: `Review: ${e.subject}`, description: `A short review of what you studied on ${e.date}. Reviews at 1, 3, 7 and 14 days help it stay.`, category: "Revision", date, color: "#10b981", priority: "Low", completed: false, subject: e.subject, studyType: "Revision", timeRangeType: "date_only", estimatedDurationMin: 20, revisionCycle: "One Time", status: "Pending" });
      });
    }
    try { localStorage.setItem(DONE_KEY, JSON.stringify(seen)); } catch { /* ignore */ }
    if (made.length) void addEvents(made);
  }, [user, paid, loaded, events, addEvents]);
  return null;
}
