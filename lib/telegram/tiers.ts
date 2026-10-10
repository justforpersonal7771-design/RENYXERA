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

/** The same matrix as readable rows for the Profile screen and the Plans page. `info` explains each one in plain words. */
export const TG_MATRIX: { label: string; info: string; free: string; plus: string; pro: string }[] = [
  { label: "Join our channel and group", info: "Every morning we post one real GATE question in the channel. The group is where students talk and help each other.", free: "Yes", plus: "Yes", pro: "Yes" },
  { label: "See how many days are left", info: "Send /today to the bot. It tells you how many days are left for GATE and, on paid plans, what is planned for today.", free: "Yes", plus: "Yes", pro: "Yes" },
  { label: "Told when mock results are out", info: "When the results of an All-India mock are published, the bot messages you, so you don't keep checking.", free: "Yes", plus: "Yes", pro: "Yes" },
  { label: "Study timers", info: "Send /timer 25 and the bot messages you after 25 minutes. Good for focused study. The number is how many timers can run at once.", free: "1", plus: "5", pro: "10" },
  { label: "Daily alarms", info: "Send /alarm 06:00 and the bot messages you at that time every day, like an alarm clock. The number is how many alarms you can keep.", free: "—", plus: "3", pro: "10" },
  { label: "A nudge before each study task", info: "Your study plan puts tasks in the calendar. The bot messages you 10 minutes before each one, with buttons: Done, or remind me again in 15 minutes.", free: "—", plus: "Yes", pro: "Yes" },
  { label: "Morning list of today's tasks", info: "At the time you choose, the bot sends everything planned for today in one message.", free: "—", plus: "Yes", pro: "Yes" },
  { label: "Warning before a mock starts", info: "About 30 minutes before an All-India mock begins, so you don't miss the entry time.", free: "—", plus: "Yes", pro: "Yes" },
  { label: "Warning before your plan ends", info: "3 days and 1 day before your Plus or Pro ends, so it never runs out by surprise.", free: "—", plus: "Yes", pro: "Yes" },
  { label: "Evening check on unfinished tasks", info: "Each night the bot asks about tasks you didn't finish. Move them to tomorrow, or leave them. It never moves anything without your tap.", free: "—", plus: "—", pro: "Yes" },
  { label: "Verify your mobile number", info: "Share your number once through Telegram. This proves the number is yours, then it is locked to your account so nobody else can use it.", free: "Yes", plus: "Yes", pro: "Yes" },
  { label: "Weekly report", info: "On Sunday evening: how many tasks you finished this week, and one tip for next week.", free: "—", plus: "—", pro: "Yes" },
];

export const IST_OFFSET_MIN = 330;
/** Wall-clock IST pieces for a UTC instant. */
export function istParts(ms: number) {
  const d = new Date(ms + IST_OFFSET_MIN * 60_000);
  return { date: d.toISOString().slice(0, 10), hhmm: d.toISOString().slice(11, 16), weekday: d.getUTCDay() };
}
/** The UTC instant for an IST date + HH:MM. */
export const istToMs = (date: string, hhmm: string) => Date.parse(`${date}T${hhmm}:00+05:30`);
