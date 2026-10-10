import type { Tier } from "@/lib/billing/plans";

export const TELEGRAM_CHANNEL = "@renyxera";       // daily question channel
export const TELEGRAM_GROUP = "@renyxera_chat";    // discussion group
export const TELEGRAM_CHANNEL_URL = "https://t.me/renyxera";
export const TELEGRAM_GROUP_URL = "https://t.me/renyxera_chat";

/** What Telegram does for each plan. One place, used by the bot, the API and the Profile screen. */
export type TgLimits = {
  timers: number;          // active timers at once
  alarms: number;          // saved daily alarms
  blockReminders: boolean; // a message before each Study Planner block (with Done / +15 min buttons)
  digest: boolean;         // morning digest of today's blocks, at a time you choose
  mockReminders: boolean;  // "mock starts in 30 minutes"
  rollPrompt: boolean;     // evening "N blocks unfinished — roll forward?" with buttons
  weeklyReview: boolean;   // Sunday summary of planned vs done
  replan: boolean;         // "re-plan the rest" shortcut offered with the roll-forward prompt
};

export const TG_LIMITS: Record<Tier, TgLimits> = {
  free: { timers: 1, alarms: 0, blockReminders: false, digest: false, mockReminders: false, rollPrompt: false, weeklyReview: false, replan: false },
  plus: { timers: 5, alarms: 3, blockReminders: true, digest: true, mockReminders: true, rollPrompt: false, weeklyReview: false, replan: false },
  pro:  { timers: 10, alarms: 10, blockReminders: true, digest: true, mockReminders: true, rollPrompt: true, weeklyReview: true, replan: true },
};

/** The same matrix as readable rows for the Profile screen and the Plans page. */
export const TG_MATRIX: { label: string; free: string; plus: string; pro: string }[] = [
  { label: "Daily question channel + discussion group", free: "Yes", plus: "Yes", pro: "Yes" },
  { label: "Exam countdown and /today summary", free: "Yes", plus: "Yes", pro: "Yes" },
  { label: "Mock results published alert", free: "Yes", plus: "Yes", pro: "Yes" },
  { label: "Timers (/timer 25)", free: "1 at a time", plus: "5", pro: "10" },
  { label: "Daily alarms (/alarm 06:00)", free: "—", plus: "3", pro: "10" },
  { label: "Reminder before every Study Planner block, with Done and +15 min", free: "—", plus: "Yes", pro: "Yes" },
  { label: "Morning digest of today's blocks, at your time", free: "—", plus: "Yes", pro: "Yes" },
  { label: "Mock starting soon alerts", free: "—", plus: "Yes", pro: "Yes" },
  { label: "Plan-ending and payment alerts", free: "—", plus: "Yes", pro: "Yes" },
  { label: "Evening \"roll unfinished blocks forward?\" and re-plan", free: "—", plus: "—", pro: "Yes" },
  { label: "Weekly review (planned vs done)", free: "—", plus: "—", pro: "Yes" },
];

export const IST_OFFSET_MIN = 330;
/** Wall-clock IST pieces for a UTC instant. */
export function istParts(ms: number) {
  const d = new Date(ms + IST_OFFSET_MIN * 60_000);
  return { date: d.toISOString().slice(0, 10), hhmm: d.toISOString().slice(11, 16), weekday: d.getUTCDay() };
}
/** The UTC instant for an IST date + HH:MM. */
export const istToMs = (date: string, hhmm: string) => Date.parse(`${date}T${hhmm}:00+05:30`);
