import { buildSchedule, cleanWindows, phaseShares, simpleAvailability, studyDays, weeklyMinutes, windowsFor, type Availability, type PlanOptions } from "../lib/planner/generate";

let failed = 0;
const check = (name: string, ok: boolean, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`); if (!ok) failed++; };

const sections = [{ title: "Algorithms", share: 0.3 }, { title: "OS", share: 0.2 }, { title: "Maths", share: 0.15 }, { title: "DBMS", share: 0.1 }];
const simple = simpleAvailability([1, 2, 3, 4, 5, 6], 4, "06:00");
const base: PlanOptions = { start: "2026-10-12", examDate: "2027-02-06", availability: simple, sections, marks: {}, includeRevision: true, includeMocks: true, includeMistakes: true };

// availability windows
check("overlapping windows merge and tiny ones drop", JSON.stringify(cleanWindows([{ start: "08:00", end: "09:00" }, { start: "08:30", end: "10:00" }, { start: "11:00", end: "11:10" }])) === JSON.stringify([{ start: "08:00", end: "10:00" }]));
const multi: Availability = { weekly: { 1: [{ start: "08:00", end: "09:00" }, { start: "14:00", end: "17:00" }, { start: "21:00", end: "22:00" }] }, overrides: {} };
check("weekly minutes add up across windows", weeklyMinutes(multi) === 300, String(weeklyMinutes(multi)));
check("a date override beats the weekly pattern", windowsFor("2026-10-12", { ...multi, overrides: { "2026-10-12": [{ start: "18:00", end: "20:00" }] } })[0].start === "18:00");
check("a null override makes the day off", windowsFor("2026-10-12", { ...multi, overrides: { "2026-10-12": null } }).length === 0);
check("study days skip days with no time and the exam day", studyDays("2026-10-12", "2026-10-19", multi).map((d) => d.date).join() === "2026-10-12", studyDays("2026-10-12", "2026-10-19", multi).map((d) => d.date).join());
const p = phaseShares(20, true, true);
check("phase shares sum to 1", Math.abs(p.learn + p.revise + p.mock - 1) < 1e-9);

// the plan
const r = buildSchedule(base);
check("events are produced for every phase", ["learn", "revise", "mock"].every((ph) => r.events.some((e) => e.phase === ph)));
check("every event is before the exam and on a study weekday", r.events.every((e) => e.date < base.examDate && [1, 2, 3, 4, 5, 6].includes(new Date(`${e.date}T00:00:00Z`).getUTCDay())));
check("every event sits inside one of that day's windows", r.events.every((e) => windowsFor(e.date, base.availability).some((w) => e.startTime >= w.start && e.endTime <= w.end)));
const byDate: Record<string, typeof r.events> = {};
for (const e of r.events) (byDate[e.date] ??= []).push(e);
check("blocks on one day never overlap", Object.values(byDate).every((l) => l.every((e, i) => i === 0 || e.startTime >= l[i - 1].endTime)));
check("no block is shorter than the minimum", r.events.every((e) => e.durationMin >= 25));
const mins = (res: typeof r) => res.events.filter((e) => e.phase === "learn" && e.subject === "DBMS").reduce((n, e) => n + e.durationMin, 0);
check("a weak section gets more time than a strong one", mins(buildSchedule({ ...base, marks: { DBMS: "weak" } })) > mins(buildSchedule({ ...base, marks: { DBMS: "strong" } })));

// several windows a day
const split = buildSchedule({ ...base, availability: { weekly: Object.fromEntries([1, 2, 3, 4, 5].map((d) => [d, multi.weekly[1]])), overrides: {} } });
const day = split.events.find((e) => e.phase === "learn")!.date;
const dayBlocks = split.events.filter((e) => e.date === day);
check("a day with three windows gets blocks in each of them", new Set(dayBlocks.map((e) => e.startTime.slice(0, 2) < "12" ? "am" : e.startTime.slice(0, 2) < "18" ? "pm" : "eve")).size === 3, dayBlocks.map((e) => `${e.startTime}-${e.endTime}`).join(" "));
check("nothing is placed outside the three windows", split.events.every((e) => windowsFor(e.date, { weekly: Object.fromEntries([1, 2, 3, 4, 5].map((d) => [d, multi.weekly[1]])), overrides: {} }).some((w) => e.startTime >= w.start && e.endTime <= w.end)));

// one-day overrides
const off = buildSchedule({ ...base, availability: { ...simple, overrides: { "2026-10-14": null } } });
check("a day marked off has no blocks", !off.events.some((e) => e.date === "2026-10-14"));
const short = buildSchedule({ ...base, availability: { ...simple, overrides: { "2026-10-13": [{ start: "18:00", end: "20:00" }] } } });
check("a shortened day only uses its own window", short.events.filter((e) => e.date === "2026-10-13").every((e) => e.startTime >= "18:00" && e.endTime <= "20:00") && short.events.some((e) => e.date === "2026-10-13"));

// mocks
const longMock = buildSchedule({ ...base, start: "2027-01-10", availability: simple });
check("a full mock gets a 3-hour block when a window is long enough", longMock.events.some((e) => e.title.startsWith("Full mock") && e.durationMin === 180));
const shortWin = buildSchedule({ ...base, start: "2027-01-10", availability: simpleAvailability([1, 2, 3, 4, 5, 6], 2, "18:00") });
check("short windows never get a fake 3-hour mock", !shortWin.events.some((e) => e.title.startsWith("Full mock")));

const fixed = buildSchedule({ ...base, fixedHours: { DBMS: 20 } });
const dbmsMin = fixed.events.filter((e) => e.phase === "learn" && e.subject === "DBMS").reduce((n, e) => n + e.durationMin, 0);
check("a section with exact hours gets about those hours", Math.abs(dbmsMin - 20 * 60) <= 60, `${dbmsMin / 60} h`);
check("exact hours do not break the rest of the plan", fixed.events.some((e) => e.subject === "Algorithms") && fixed.events.every((e) => e.date < base.examDate));

check("a short runway still produces a plan", buildSchedule({ ...base, start: "2027-01-28" }).events.length > 0);
check("nothing is scheduled when the start is past the exam", buildSchedule({ ...base, start: "2027-03-01" }).events.length === 0);
console.log(failed ? `\n${failed} check(s) failed` : "\nAll planner checks passed");
process.exit(failed ? 1 : 0);
