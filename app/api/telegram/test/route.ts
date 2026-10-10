import { NextRequest, NextResponse } from "next/server";
import { accountOf, member, tierOf } from "@/lib/telegram/server";
import { send } from "@/lib/telegram/bot";

export const runtime = "nodejs";

/** Sends one test message so the learner can see it works. */
export async function POST(req: NextRequest) {
  const m = await member(req, { write: true, limit: 5 });
  if (m instanceof NextResponse) return m;
  const acct = await accountOf(m.db, m.userId);
  if (!acct) return NextResponse.json({ error: "Link Telegram first." }, { status: 409 });
  const { tier } = await tierOf(m.userId);
  const r = await send(acct.chat_id, `✅ <b>Telegram is connected.</b>\nYour plan: <b>${tier === "pro" ? "Pro" : tier === "plus" ? "Plus" : "Free"}</b>. Send /help to see what I can do.`);
  if (r === "blocked") await m.db.from("telegram_accounts").update({ blocked: true }).eq("user_id", m.userId);
  return r === "ok" ? NextResponse.json({ ok: true }) : NextResponse.json({ error: r === "blocked" ? "You've blocked the bot in Telegram. Unblock it, then try again." : "Couldn't send right now." }, { status: 502 });
}
