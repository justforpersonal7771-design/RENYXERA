import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { member } from "@/lib/telegram/server";

export const runtime = "nodejs";

/** The app tells us a planner block was ticked off, so the weekly review and evening prompt count it and no reminder is sent for it. */
export async function POST(req: NextRequest) {
  const m = await member(req, { write: true, limit: 200 });
  if (m instanceof NextResponse) return m;
  const body = z.object({ eventId: z.string().min(1).max(80), done: z.boolean().default(true) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const now = new Date().toISOString();
  await m.db.from("telegram_reminders").update({ done_at: body.data.done ? now : null }).eq("user_id", m.userId).eq("event_id", body.data.eventId);
  if (body.data.done) await m.db.from("telegram_reminders").delete().eq("user_id", m.userId).eq("event_id", body.data.eventId).is("sent_at", null);
  return NextResponse.json({ ok: true });
}
