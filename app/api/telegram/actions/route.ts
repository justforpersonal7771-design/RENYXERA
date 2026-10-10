import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { member } from "@/lib/telegram/server";

export const runtime = "nodejs";

/** Things done in Telegram (block marked done, block rolled to tomorrow) that the app should now apply to the calendar. */
export async function GET(req: NextRequest) {
  const m = await member(req, { limit: 120 });
  if (m instanceof NextResponse) return m;
  const { data } = await m.db.from("telegram_actions").select("id, kind, event_id").eq("user_id", m.userId).is("applied_at", null).order("id").limit(200);
  return NextResponse.json({ actions: data ?? [] }, { headers: { "Cache-Control": "no-store" } });
}

/** Mark actions as applied once the app has updated the calendar. */
export async function POST(req: NextRequest) {
  const m = await member(req, { write: true, limit: 60 });
  if (m instanceof NextResponse) return m;
  const body = z.object({ ids: z.array(z.number().int()).min(1).max(200) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  await m.db.from("telegram_actions").update({ applied_at: new Date().toISOString() }).eq("user_id", m.userId).in("id", body.data.ids);
  return NextResponse.json({ ok: true });
}
