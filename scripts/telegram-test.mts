import { TG_LIMITS, TG_MATRIX, istParts, istToMs } from "../lib/telegram/tiers";

let failed = 0;
const check = (name: string, ok: boolean, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`); if (!ok) failed++; };

const noon = Date.parse("2026-10-10T12:00:00Z");
const p = istParts(noon);
check("IST clock is UTC+5:30", p.date === "2026-10-10" && p.hhmm === "17:30", `${p.date} ${p.hhmm}`);
check("IST rolls the date over", istParts(Date.parse("2026-10-10T19:00:00Z")).date === "2026-10-11");
check("istToMs round-trips", istParts(istToMs("2026-10-11", "06:00")).hhmm === "06:00" && istParts(istToMs("2026-10-11", "06:00")).date === "2026-10-11");
check("06:00 IST is 00:30 UTC", new Date(istToMs("2026-10-11", "06:00")).toISOString() === "2026-10-11T00:30:00.000Z");

check("free gets no block reminders, plus and pro do", !TG_LIMITS.free.blockReminders && TG_LIMITS.plus.blockReminders && TG_LIMITS.pro.blockReminders);
check("the roll-forward prompt and weekly review are Pro only", !TG_LIMITS.plus.rollPrompt && !TG_LIMITS.plus.weeklyReview && TG_LIMITS.pro.rollPrompt && TG_LIMITS.pro.weeklyReview);
check("limits only grow with the plan", TG_LIMITS.free.timers < TG_LIMITS.plus.timers && TG_LIMITS.plus.timers < TG_LIMITS.pro.timers && TG_LIMITS.free.alarms < TG_LIMITS.plus.alarms && TG_LIMITS.plus.alarms < TG_LIMITS.pro.alarms);
check("free has one timer, no alarms", TG_LIMITS.free.timers === 1 && TG_LIMITS.free.alarms === 0);
check("the displayed matrix agrees with the limits", (() => {
  const row = (s: string) => TG_MATRIX.find((r) => r.label.startsWith(s))!;
  return row("Timers").free === "1 at a time" && row("Timers").plus === String(TG_LIMITS.plus.timers) && row("Timers").pro === String(TG_LIMITS.pro.timers)
    && row("Daily alarms").plus === String(TG_LIMITS.plus.alarms) && row("Daily alarms").pro === String(TG_LIMITS.pro.alarms);
})());
console.log(failed ? `\n${failed} check(s) failed` : "\nAll telegram checks passed");
process.exit(failed ? 1 : 0);
