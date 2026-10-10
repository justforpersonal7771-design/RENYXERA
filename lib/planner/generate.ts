// Turns a study plan (exam date, hours, weak/strong sections, available weekdays) into dated calendar events.
// Pure and deterministic: same inputs, same events. Dates are plain YYYY-MM-DD strings (no timezone maths).

export type Mark = "weak" | "normal" | "strong";
export type PlanSection = { title: string; share: number };
export type PlanOptions = {
  start: string;                 // first day to schedule
  examDate: string;              // events stop the day before
  weekdays: number[];            // 0 = Sunday … 6 = Saturday: the days the learner studies
  hoursPerDay: number;
  startTime: string;             // HH:MM of the first block each day
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
const toMs = (d: string) => Date.parse(`${d}T00:00:00Z`);
const toStr = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const addMin = (hhmm: string, min: number) => {
  const [h, m] = hhmm.split(":").map(Number);
  const t = Math.min(23 * 60 + 59, h * 60 + m + min);
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};
const factor = (m: Mark | undefined) => (m === "weak" ? 1.5 : m === "strong" ? 0.6 : 1);

/** The days available for study between start and the day before the exam. */
export function studyDays(start: string, examDate: string, weekdays: number[]): string[] {
  const out: string[] = [];
  const set = new Set(weekdays);
  for (let t = toMs(start); t < toMs(examDate); t += DAY) if (set.has(new Date(t).getUTCDay())) out.push(toStr(t));
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

export function buildSchedule(o: PlanOptions): { events: PlanEvent[]; days: number; phases: { learn: number; revise: number; mock: number } } {
  const days = studyDays(o.start, o.examDate, o.weekdays);
  const weeksLeft = Math.max(1, Math.floor((toMs(o.examDate) - toMs(o.start)) / DAY / 7));
  const shares = phaseShares(weeksLeft, o.includeRevision, o.includeMocks);
  const learnN = Math.round(days.length * shares.learn);
  const reviseN = Math.round(days.length * shares.revise);
  const learnDays = days.slice(0, learnN), reviseDays = days.slice(learnN, learnN + reviseN), mockDays = days.slice(learnN + reviseN);
  const events: PlanEvent[] = [];
  const clock = new Map<string, string>(); // next free time per date
  const push = (e: Omit<PlanEvent, "startTime" | "endTime">) => {
    const startTime = clock.get(e.date) ?? o.startTime;
    const endTime = addMin(startTime, e.durationMin);
    clock.set(e.date, addMin(endTime, 10));
    events.push({ ...e, startTime, endTime });
  };

  const weighted = o.sections.map((s) => ({ title: s.title, w: Math.max(0.01, s.share) * factor(o.marks[s.title]) })).sort((a, b) => b.w - a.w);
  const sumW = weighted.reduce((n, s) => n + s.w, 0) || 1;

  // 1 · Learn: hours per section follow weight, filled day by day in order of weight.
  const learnHours = learnDays.length * o.hoursPerDay;
  let si = 0, left = weighted.length ? (weighted[0].w / sumW) * learnHours : 0;
  for (const date of learnDays) {
    let room = o.hoursPerDay;
    while (room > 0.01 && si < weighted.length) {
      const take = Math.min(room, left);
      if (take >= 0.25) {
        push({
          date, phase: "learn", title: `Learn & practise: ${weighted[si].title}`,
          description: `Concepts and topic PYQs. About ${Math.round(take * 10) / 10} h today.`,
          studyType: "Study", category: "Study", durationMin: Math.round(take * 60),
          priority: o.marks[weighted[si].title] === "weak" ? "High" : "Medium", subject: weighted[si].title,
        });
      }
      room -= take; left -= take;
      if (left <= 0.01) { si++; left = si < weighted.length ? (weighted[si].w / sumW) * learnHours : 0; }
    }
  }

  // 2 · Revise: PYQs on a rotation weighted like the learning phase; a short mistakes review once a week.
  if (reviseDays.length) {
    const seq: string[] = [];
    const quota = weighted.map((s) => ({ title: s.title, n: (s.w / sumW) * reviseDays.length, got: 0 }));
    for (let i = 0; i < reviseDays.length; i++) { quota.sort((a, b) => (b.n - b.got) - (a.n - a.got)); quota[0].got++; seq.push(quota[0].title); }
    let lastWeek = "";
    reviseDays.forEach((date, i) => {
      const wk = toStr(toMs(date) - ((new Date(toMs(date)).getUTCDay() + 6) % 7) * DAY);
      let mistakesToday = false;
      if (o.includeMistakes && wk !== lastWeek) {
        push({ date, phase: "revise", title: "Mistakes review", description: "Work through your mistakes bank until each one is mastered.", studyType: "Mistakes", category: "Mistakes Review", durationMin: 45, priority: "High" });
        lastWeek = wk; mistakesToday = true;
      }
      const budget = Math.round(o.hoursPerDay * 60) - (mistakesToday ? 55 : 0);
      push({
        date, phase: "revise", title: `Revise with PYQs: ${seq[i]}`, description: "Timed topic or subject test, then review every wrong answer.",
        studyType: "Revision", category: "Revision", durationMin: Math.max(30, budget), priority: o.marks[seq[i]] === "weak" ? "High" : "Medium", subject: seq[i],
      });
    });
  }

  // 3 · Mocks: a full 3-hour paper, then a day for analysis, alternating.
  mockDays.forEach((date, i) => {
    if (i % 2 === 0) push({ date, phase: "mock", title: "Full mock test (3 h)", description: "Sit a full paper in the exam interface, in one go.", studyType: "Mock Test", category: "Mock Test", durationMin: 180, priority: "High" });
    else push({ date, phase: "mock", title: "Mock analysis & weak-topic fixes", description: "Review every question; fix one leak per mock (negative marks, time sinks, weak topics).", studyType: "Revision", category: "Revision", durationMin: Math.max(60, Math.round(o.hoursPerDay * 60)), priority: "High" });
  });

  return { events, days: days.length, phases: { learn: learnDays.length, revise: reviseDays.length, mock: mockDays.length } };
}
