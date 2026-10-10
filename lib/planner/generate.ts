// Turns a study plan (exam date, weak/strong sections, and WHEN the learner is free) into dated calendar events.
// Pure and deterministic: same inputs, same events. Dates are plain YYYY-MM-DD strings (no timezone maths).
//
// Availability is a set of time windows per weekday (for example 08:00–09:00, 14:00–17:00 and 21:00–22:00), plus
// optional per-date overrides ("tomorrow I'm only free 6–8 pm", "Sunday is off"). Blocks are placed inside those windows,
// split across them when a subject needs more time than one window has.

export type Mark = "weak" | "normal" | "strong";
export type PlanSection = { title: string; share: number };
export type Win = { start: string; end: string };                       // "HH:MM"
export type Availability = { weekly: Record<number, Win[]>; overrides: Record<string, Win[] | null> }; // 0 = Sunday; null = day off

export type PlanOptions = {
  start: string;                 // first day to schedule
  examDate: string;              // events stop the day before
  availability: Availability;
  sections: PlanSection[];
  marks: Record<string, Mark>;
  includeRevision: boolean;
  includeMocks: boolean;
  includeMistakes: boolean;      // a short mistakes-review slot each week of the revision phase
};
export type PlanEvent = {
  date: string; title: string; description: string; phase: "learn" | "revise" | "mock";
  studyType: "Study" | "Revision" | "Mock Test" | "Mistakes"; category: "Study" | "Revision" | "Mock Test" | "Mistakes Review";
  durationMin: number; startTime: string; endTime: string; priority: "Low" | "Medium" | "High"; subject?: string;
};

const DAY = 86400_000;
export const MIN_BLOCK = 25;
const toMs = (d: string) => Date.parse(`${d}T00:00:00Z`);
const toStr = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const mins = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const clock = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const factor = (m: Mark | undefined) => (m === "weak" ? 1.5 : m === "strong" ? 0.6 : 1);

/** Sorted, merged, valid windows (end after start, at least MIN_BLOCK long). */
export function cleanWindows(ws: Win[] | null | undefined): Win[] {
  const list = (ws ?? []).filter((w) => /^\d{2}:\d{2}$/.test(w.start) && /^\d{2}:\d{2}$/.test(w.end) && mins(w.end) > mins(w.start)).map((w) => [mins(w.start), mins(w.end)] as [number, number]).sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  for (const w of list) { const last = out[out.length - 1]; if (last && w[0] <= last[1]) last[1] = Math.max(last[1], w[1]); else out.push([w[0], w[1]]); }
  return out.filter(([s, e]) => e - s >= MIN_BLOCK).map(([s, e]) => ({ start: clock(s), end: clock(e) }));
}
export const windowMinutes = (ws: Win[]) => ws.reduce((n, w) => n + mins(w.end) - mins(w.start), 0);

/** Windows that apply on one date: an override wins over the weekly pattern. */
export function windowsFor(date: string, av: Availability): Win[] {
  if (Object.prototype.hasOwnProperty.call(av.overrides, date)) return cleanWindows(av.overrides[date]);
  return cleanWindows(av.weekly[new Date(toMs(date)).getUTCDay()]);
}

/** The simple form: the same single block of `hours` from `startTime` on each chosen weekday. */
export function simpleAvailability(weekdays: number[], hours: number, startTime: string): Availability {
  const weekly: Record<number, Win[]> = {};
  for (const d of weekdays) weekly[d] = [{ start: startTime, end: clock(Math.min(23 * 60 + 59, mins(startTime) + Math.round(hours * 60))) }];
  return { weekly, overrides: {} };
}
export const weeklyMinutes = (av: Availability) => [0, 1, 2, 3, 4, 5, 6].reduce((n, d) => n + windowMinutes(cleanWindows(av.weekly[d])), 0);

/** Days with room to study between start and the day before the exam. */
export function studyDays(start: string, examDate: string, av: Availability): { date: string; wins: Win[]; minutes: number }[] {
  const out: { date: string; wins: Win[]; minutes: number }[] = [];
  for (let t = toMs(start); t < toMs(examDate); t += DAY) {
    const date = toStr(t), wins = windowsFor(date, av), minutes = windowMinutes(wins);
    if (minutes >= MIN_BLOCK) out.push({ date, wins, minutes });
  }
  return out;
}

/** Phase split by how much time is left: more learning when there is a lot, more revision and mocks when it is close. */
export function phaseShares(weeksLeft: number, revision: boolean, mocks: boolean): { learn: number; revise: number; mock: number } {
  let [learn, revise] = weeksLeft >= 16 ? [0.6, 0.25] : weeksLeft >= 8 ? [0.5, 0.3] : [0.35, 0.35];
  if (!revision) { learn += revise; revise = 0; }
  let mock = 1 - learn - revise;
  if (!mocks) { if (revision) revise += mock; else learn += mock; mock = 0; }
  return { learn, revise, mock };
}

export function buildSchedule(o: PlanOptions): { events: PlanEvent[]; days: number; minutes: number; phases: { learn: number; revise: number; mock: number } } {
  const days = studyDays(o.start, o.examDate, o.availability);
  const total = days.reduce((n, d) => n + d.minutes, 0);
  const weeksLeft = Math.max(1, Math.floor((toMs(o.examDate) - toMs(o.start)) / DAY / 7));
  const shares = phaseShares(weeksLeft, o.includeRevision, o.includeMocks);
  const learnCut = total * shares.learn, reviseCut = total * (shares.learn + shares.revise);

  // Which phase each day belongs to, by the minutes available (a day belongs to the phase it starts in).
  let cum = 0;
  const learnDays: typeof days = [], reviseDays: typeof days = [], mockDays: typeof days = [];
  for (const d of days) { (cum < learnCut ? learnDays : cum < reviseCut ? reviseDays : mockDays).push(d); cum += d.minutes; }

  const events: PlanEvent[] = [];
  const add = (e: Omit<PlanEvent, "startTime" | "endTime" | "durationMin">, from: number, to: number) => events.push({ ...e, startTime: clock(from), endTime: clock(to), durationMin: to - from });
  const weighted = o.sections.map((s) => ({ title: s.title, w: Math.max(0.01, s.share) * factor(o.marks[s.title]) })).sort((a, b) => b.w - a.w);
  const sumW = weighted.reduce((n, s) => n + s.w, 0) || 1;

  // 1 · Learn: minutes per section follow its weight; fill each window in turn, moving on to the next section when one is done.
  const learnMinutes = learnDays.reduce((n, d) => n + d.minutes, 0);
  let si = 0, left = weighted.length ? (weighted[0].w / sumW) * learnMinutes : 0;
  for (const d of learnDays) {
    for (const w of d.wins) {
      let cursor = mins(w.start);
      const end = mins(w.end);
      while (end - cursor >= MIN_BLOCK && si < weighted.length) {
        const take = Math.min(end - cursor, Math.round(left));
        if (take >= MIN_BLOCK) {
          add({ date: d.date, phase: "learn", title: `Learn & practise: ${weighted[si].title}`, description: `Concepts and topic PYQs, ${take} min.`, studyType: "Study", category: "Study", priority: o.marks[weighted[si].title] === "weak" ? "High" : "Medium", subject: weighted[si].title }, cursor, cursor + take);
          cursor += take; left -= take;
        } else left = 0; // a leftover too small for a block is dropped, not turned into a tiny task
        if (left < 1) { si++; left = si < weighted.length ? (weighted[si].w / sumW) * learnMinutes : 0; }
      }
    }
  }

  // 2 · Revise: PYQs rotate through the sections by weight, one block per window; a short mistakes review once a week.
  const windowsInRevise = reviseDays.reduce((n, d) => n + d.wins.length, 0);
  if (windowsInRevise) {
    const seq: string[] = [];
    const quota = weighted.map((s) => ({ title: s.title, n: (s.w / sumW) * windowsInRevise, got: 0 }));
    for (let i = 0; i < windowsInRevise; i++) { quota.sort((a, b) => (b.n - b.got) - (a.n - a.got)); quota[0].got++; seq.push(quota[0].title); }
    let k = 0, lastWeek = "";
    for (const d of reviseDays) {
      const wk = toStr(toMs(d.date) - ((new Date(toMs(d.date)).getUTCDay() + 6) % 7) * DAY);
      d.wins.forEach((w, wi) => {
        let from = mins(w.start);
        const end = mins(w.end), subject = seq[k++];
        if (o.includeMistakes && wk !== lastWeek && wi === 0 && end - from >= 60) {
          add({ date: d.date, phase: "revise", title: "Mistakes review", description: "Work through your mistakes bank until each one is mastered.", studyType: "Mistakes", category: "Mistakes Review", priority: "High" }, from, from + 45);
          from += 45; lastWeek = wk;
        }
        if (end - from >= MIN_BLOCK) add({ date: d.date, phase: "revise", title: `Revise with PYQs: ${subject}`, description: "Timed topic or subject test, then review every wrong answer.", studyType: "Revision", category: "Revision", priority: o.marks[subject] === "weak" ? "High" : "Medium", subject }, from, end);
      });
    }
  }

  // 3 · Mocks: a full 3-hour paper needs one long window; other days analyse the last paper. Short windows get timed practice.
  mockDays.forEach((d, i) => {
    if (i % 2 === 0) {
      const longest = [...d.wins].sort((a, b) => (mins(b.end) - mins(b.start)) - (mins(a.end) - mins(a.start)))[0];
      const len = mins(longest.end) - mins(longest.start);
      if (len >= 150) {
        add({ date: d.date, phase: "mock", title: "Full mock test (3 h)", description: "Sit a full paper in the exam interface, in one go.", studyType: "Mock Test", category: "Mock Test", priority: "High" }, mins(longest.start), mins(longest.start) + Math.min(180, len));
        return;
      }
    }
    for (const w of d.wins) {
      const analysis = i % 2 === 1;
      add({ date: d.date, phase: "mock", title: analysis ? "Mock analysis & weak-topic fixes" : "Timed practice (a full paper in parts)", description: analysis ? "Review every question; fix one leak per mock (negative marks, time sinks, weak topics)." : "No window is long enough for a full paper today, so practise timed sets and sit the full mock on a longer day.", studyType: analysis ? "Revision" : "Mock Test", category: analysis ? "Revision" : "Mock Test", priority: "High" }, mins(w.start), mins(w.end));
    }
  });

  events.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  return { events, days: days.length, minutes: total, phases: { learn: learnDays.length, revise: reviseDays.length, mock: mockDays.length } };
}
