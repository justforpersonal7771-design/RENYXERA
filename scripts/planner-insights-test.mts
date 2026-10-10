import { planProgress, shiftAvailability, spacedReviewDates, toIcs, weakMarks } from "../lib/planner/insights";
import { weeklyMinutes, simpleAvailability } from "../lib/planner/generate";
import type { CalendarEvent } from "../types/calendar.types";

let failed = 0;
const check = (name: string, ok: boolean, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`); if (!ok) failed++; };

const ev = (id: string, date: string, completed: boolean, mins = 60, extra: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id, title: `Block ${id}`, description: "", category: "Study", date, color: "#000", priority: "Medium", completed, studyType: "Study", timeRangeType: "start_end", startTime: "06:00", endTime: "07:00", estimatedDurationMin: mins, revisionCycle: "One Time", status: completed ? "Completed" : "Pending", ...extra,
});

const today = "2026-10-14"; // a Wednesday
const events = [ev("plan-a-1", "2026-10-12", true), ev("plan-a-2", "2026-10-12", true), ev("plan-a-3", "2026-10-13", false), ev("plan-a-4", "2026-10-14", false), ev("plan-a-5", "2026-10-16", false), ev("custom-1", "2026-10-12", false)];
const p = planProgress(events, today);
check("only plan blocks count", p.total === 5);
check("blocks before today are due", p.dueToDate === 3 && p.doneToDate === 2);
check("health is slipping at 2 of 3", p.health === "slipping" && Math.abs((p.ratio ?? 0) - 2 / 3) < 1e-9);
check("the week covers Monday to Sunday", p.weekPlanned === 5 && p.weekDone === 2);
check("hours are summed from block lengths", p.hoursDoneToDate === 2 && p.hoursPlannedToDate === 3);
check("nothing due means not started", planProgress([ev("plan-b-1", "2026-10-20", false)], today).health === "not-started");
check("everything done is on track", planProgress([ev("plan-c-1", "2026-10-10", true), ev("plan-c-2", "2026-10-11", true)], today).health === "on-track");
check("far behind is at risk", planProgress([ev("plan-d-1", "2026-10-10", false), ev("plan-d-2", "2026-10-11", false), ev("plan-d-3", "2026-10-12", true)], today).health === "at-risk");
check("skipped blocks are not counted as missed", planProgress([ev("plan-e-1", "2026-10-10", false, 60, { status: "Skipped" }), ev("plan-e-2", "2026-10-11", true)], today).dueToDate === 1);

check("spaced reviews are 1, 3, 7 and 14 days later", spacedReviewDates("2026-10-14", "2027-02-06").join() === "2026-10-15,2026-10-17,2026-10-21,2026-10-28");
check("reviews after the exam are dropped", spacedReviewDates("2027-02-01", "2027-02-06").join() === "2027-02-02,2027-02-04");

const marks = weakMarks([{ title: "Operating Systems", share: 0.2 }, { title: "Algorithms", share: 0.3 }, { title: "Databases", share: 0.1 }], [{ subject: "Operating Systems", attempted: 10, correct: 3 }, { subject: "Algorithms", attempted: 20, correct: 18 }, { subject: "Databases", attempted: 2, correct: 0 }]);
check("low accuracy marks a section weak", marks["Operating Systems"] === "weak");
check("high accuracy marks it strong", marks["Algorithms"] === "strong");
check("too few attempts leaves it alone", marks["Databases"] === undefined);

const ics = toIcs([ev("plan-f-1", "2026-10-14", false), ev("plan-f-2", "2026-10-15", false, 0, { startTime: undefined, endTime: undefined })], "20261010T000000Z");
check("ics has the calendar wrapper and both events", ics.startsWith("BEGIN:VCALENDAR") && ics.trimEnd().endsWith("END:VCALENDAR") && (ics.match(/BEGIN:VEVENT/g) ?? []).length === 2);
check("a 06:00 IST block is 00:30 UTC", ics.includes("DTSTART:20261014T003000Z") && ics.includes("DTEND:20261014T013000Z"));
check("a date-only event is all-day", ics.includes("DTSTART;VALUE=DATE:20261015") && ics.includes("DTEND;VALUE=DATE:20261016"));
check("timed events get a 10-minute alert, all-day ones do not", (ics.match(/TRIGGER:-PT10M/g) ?? []).length === 1);
check("lines end with CRLF as the format requires", ics.includes("\r\n") && !/[^\r]\n/.test(ics));
const av = simpleAvailability([1, 2, 3], 2, "18:00");
check("shifting adds minutes to each study weekday", weeklyMinutes(shiftAvailability(av, 30)) === weeklyMinutes(av) + 90, `${weeklyMinutes(av)} -> ${weeklyMinutes(shiftAvailability(av, 30))}`);
check("shifting down removes minutes and never goes negative", weeklyMinutes(shiftAvailability(av, -60)) === weeklyMinutes(av) - 180 && weeklyMinutes(shiftAvailability(av, -600)) >= 0);
check("rest days stay rest days", (shiftAvailability(av, 60).weekly[5] ?? []).length === 0);
console.log(failed ? `\n${failed} check(s) failed` : "\nAll planner-insight checks passed");
process.exit(failed ? 1 : 0);
