import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { accountOf, member, tierOf } from "@/lib/telegram/server";

export const runtime = "nodejs";

const item = z.object({
  remindAt: z.string().datetime({ offset: true }),
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().max(500).optional(),
  eventId: z.string().max(80).optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  repeat: z.literal("daily").optional(),
});
const schema = z.object({
  kind: z.enum(["block", "timer", "alarm"]),
  items: z.array(item).min(1).max(600),
  replace: z.boolean().optional(), // blocks: replace the earlier plan's unsent reminders
});

/**
 * The website schedules Telegram messages here: planner blocks (Plus and Pro), timers and daily alarms.
 * Limits follow the plan, and are checked here — never trusted from the browser.
 */
export async function POST(req: NextRequest) {
  const m = await member(req, { write: true, limit: 40 });
  if (m instanceof NextResponse) return m;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { kind, items, replace } = parsed.data;
  const acct = await accountOf(m.db, m.userId);
  if (!acct) return NextResponse.json({ error: "Link Telegram first.", needsLink: true }, { status: 409 });
  const { tier, limits } = await tierOf(m.userId);

  if (kind === "block" && !limits.blockReminders) return NextResponse.json({ error: "Reminders for Study Planner blocks are a Plus and Pro feature.", upgrade: true }, { status: 403 });
  const now = Date.now();
  const rows = items.filter((i) => Date.parse(i.remindAt) > now - 60_000).map((i) => ({ user_id: m.userId, kind, remind_at: i.remindAt, title: i.title, body: i.body ?? null, event_id: i.eventId ?? null, event_date: i.eventDate ?? null, repeat: kind === "alarm" ? "daily" : null }));
  if (rows.length === 0) return NextResponse.json({ scheduled: 0 });

  if (kind === "timer" || kind === "alarm") {
    const cap = kind === "timer" ? limits.timers : limits.alarms;
    if (cap === 0) return NextResponse.json({ error: "Alarms are a Plus and Pro feature.", upgrade: true }, { status: 403 });
    const { count } = await m.db.from("telegram_reminders").select("id", { count: "exact", head: true }).eq("user_id", m.userId).eq("kind", kind).is("sent_at", null);
    if ((count ?? 0) + rows.length > cap) return NextResponse.json({ error: `Your ${tier} plan allows ${cap} active ${kind}${cap === 1 ? "" : "s"}. Cancel one first${tier === "pro" ? "." : " or upgrade for more."}`, upgrade: tier !== "pro" }, { status: 403 });
  }
  if (kind === "block" && replace) await m.db.from("telegram_reminders").delete().eq("user_id", m.userId).eq("kind", "block").is("sent_at", null);
  const { error } = await m.db.from("telegram_reminders").insert(rows);
  if (error) return NextResponse.json({ error: "Couldn't schedule that." }, { status: 500 });
  return NextResponse.json({ scheduled: rows.length });
}

/** Cancel reminders for planner events that were deleted or moved (by event id), or every unsent timer / alarm. */
export async function DELETE(req: NextRequest) {
  const m = await member(req, { write: true, limit: 40 });
  if (m instanceof NextResponse) return m;
  const body = z.object({ eventIds: z.array(z.string().max(80)).max(600).optional(), kind: z.enum(["timer", "alarm"]).optional() }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  let q = m.db.from("telegram_reminders").delete().eq("user_id", m.userId).is("sent_at", null);
  if (body.data.eventIds?.length) q = q.in("event_id", body.data.eventIds);
  else if (body.data.kind) q = q.eq("kind", body.data.kind);
  else return NextResponse.json({ error: "Nothing to cancel." }, { status: 400 });
  await q;
  return NextResponse.json({ ok: true });
}
