import "server-only";
import { effectiveTargetYear, examDateFor } from "@/lib/goals/exam-year";
import { html, type Button } from "@/lib/telegram/bot";
import { TELEGRAM_CHANNEL_URL, TELEGRAM_GROUP_URL, istParts, type TgLimits } from "@/lib/telegram/tiers";
import type { Db, Account } from "@/lib/telegram/server";
import type { Tier } from "@/lib/billing/plans";

const APP = "https://gate.renyxera.workers.dev";
export const appLink = (path: string) => `${APP}${path}`;
const tierName = (t: Tier) => (t === "pro" ? "Pro" : t === "plus" ? "Plus" : "Free");

/** "GATE 2027 is in 118 days (6 Feb 2027)" from the learner's target year. */
export async function countdownLine(db: Db, userId: string, now = Date.now()): Promise<string> {
  const { data } = await db.from("profiles").select("target_year").eq("id", userId).maybeSingle();
  const today = istParts(now).date;
  const year = effectiveTargetYear(data?.target_year ?? null, today);
  const exam = examDateFor(year, null, today);
  const days = Math.ceil((Date.parse(`${exam}T09:30:00+05:30`) - now) / 86400_000);
  const pretty = new Date(`${exam}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  return days > 0 ? `🎯 <b>GATE ${year}</b> is in <b>${days} day${days === 1 ? "" : "s"}</b> (${pretty}).` : `🎯 GATE ${year} was on ${pretty}.`;
}

export type Block = { id: number; title: string; body: string | null; done_at: string | null; sent_at: string | null; event_date: string | null };

export async function blocksOn(db: Db, userId: string, date: string): Promise<Block[]> {
  const { data } = await db.from("telegram_reminders").select("id, title, body, done_at, sent_at, event_date, remind_at").eq("user_id", userId).eq("kind", "block").eq("event_date", date).order("remind_at");
  return (data ?? []) as Block[];
}

export const blockLine = (b: Block) => `${b.done_at ? "✅" : "▫️"} ${html(b.title)}${b.body ? ` — <i>${html(b.body)}</i>` : ""}`;

export async function todayMessage(db: Db, userId: string, tier: Tier, limits: TgLimits): Promise<{ text: string; buttons?: Button[][] }> {
  const now = Date.now();
  const lines = [await countdownLine(db, userId, now)];
  if (limits.blockReminders) {
    const blocks = await blocksOn(db, userId, istParts(now).date);
    if (blocks.length) lines.push("", "<b>Today's plan</b>", ...blocks.map(blockLine), "", `${blocks.filter((b) => b.done_at).length} of ${blocks.length} done.`);
    else lines.push("", "No Study Planner blocks for today. Generate a plan in the Study Planner to get daily reminders here.");
  } else {
    lines.push("", "With <b>Plus</b> or <b>Pro</b> you also get today's Study Planner blocks here, a reminder before each one, and a morning digest.");
  }
  return { text: lines.join("\n"), buttons: [[{ text: "Open Study Planner", url: appLink("/calendar") }, ...(tier === "free" ? [{ text: "See plans", url: appLink("/pro") }] : [])]] };
}

export function helpMessage(tier: Tier, limits: TgLimits): string {
  const rows = [
    `<b>RENYXERA bot</b> · your plan: <b>${tierName(tier)}</b>`,
    "",
    "/today — countdown" + (limits.blockReminders ? " and today's blocks" : ""),
    `/timer 25 [label] — a timer (${limits.timers} at a time)`,
    limits.alarms ? `/alarm 06:00 [label] — a daily alarm, IST (${limits.alarms} max) · /alarms to list` : "/alarm — daily alarms (Plus and Pro)",
    limits.digest ? "/digest 07:30 — when the morning digest arrives (IST)" : "/digest — morning digest (Plus and Pro)",
    "/cancel timers | alarms — cancel what's waiting",
    limits.askMentor ? "/ask your doubt — a short answer from the AI Mentor" : "/ask — ask the AI Mentor (Pro)",
    "/verify — verify your mobile number",
    "/status — your link and channel membership",
    "/unlink — disconnect this chat",
  ];
  if (!limits.rollPrompt) rows.push("", "<i>Pro adds an evening “roll unfinished blocks forward?” prompt, re-planning and a weekly review.</i>");
  return rows.join("\n");
}

export function statusMessage(a: Account, tier: Tier): { text: string; buttons?: Button[][] } {
  const tick = (v: boolean | null) => (v === true ? "✅ joined" : v === false ? "❌ not joined" : "❔ couldn't check");
  const missing: Button[] = [];
  if (a.in_channel !== true) missing.push({ text: "Join the daily channel", url: TELEGRAM_CHANNEL_URL });
  if (a.in_group !== true) missing.push({ text: "Join the discussion group", url: TELEGRAM_GROUP_URL });
  return {
    text: [`<b>Linked</b> as ${html(a.tg_first_name ?? "you")}${a.tg_username ? ` (@${html(a.tg_username)})` : ""}`, `Plan: <b>${tierName(tier)}</b>`, `Daily question channel: ${tick(a.in_channel)}`, `Discussion group: ${tick(a.in_group)}`].join("\n"),
    buttons: missing.length ? [missing] : undefined,
  };
}
