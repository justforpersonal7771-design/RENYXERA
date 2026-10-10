import { NextRequest, NextResponse } from "next/server";
import { accountOf, member, randomCode } from "@/lib/telegram/server";
import { botConfigured, botUsername } from "@/lib/telegram/bot";

export const runtime = "nodejs";

/**
 * Starts linking: makes a one-time code (valid 15 minutes) and returns the t.me deep link. Opening it and pressing
 * Start makes the bot call our webhook with the code, which ties that Telegram chat to this account.
 */
export async function POST(req: NextRequest) {
  const m = await member(req, { write: true, limit: 10 });
  if (m instanceof NextResponse) return m;
  if (!botConfigured()) return NextResponse.json({ error: "Telegram isn't set up yet." }, { status: 503 });
  if (await accountOf(m.db, m.userId)) return NextResponse.json({ linked: true });
  const name = await botUsername();
  if (!name) return NextResponse.json({ error: "Couldn't reach Telegram. Try again in a minute." }, { status: 502 });

  await m.db.from("telegram_link_codes").delete().eq("user_id", m.userId);
  const code = randomCode();
  const { error } = await m.db.from("telegram_link_codes").insert({ code, user_id: m.userId, expires_at: new Date(Date.now() + 15 * 60_000).toISOString() });
  if (error) return NextResponse.json({ error: "Couldn't start linking. Try again." }, { status: 500 });
  return NextResponse.json({ url: `https://t.me/${name}?start=${code}`, bot: name, expiresInMinutes: 15 });
}
