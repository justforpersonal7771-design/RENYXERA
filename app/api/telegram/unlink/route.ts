import { NextRequest, NextResponse } from "next/server";
import { accountOf, member } from "@/lib/telegram/server";
import { send } from "@/lib/telegram/bot";

export const runtime = "nodejs";

/** Unlinks Telegram and drops anything still waiting to be sent. */
export async function POST(req: NextRequest) {
  const m = await member(req, { write: true, limit: 10 });
  if (m instanceof NextResponse) return m;
  const acct = await accountOf(m.db, m.userId);
  if (!acct) return NextResponse.json({ ok: true });
  await m.db.from("telegram_reminders").delete().eq("user_id", m.userId).is("sent_at", null);
  await m.db.from("telegram_accounts").delete().eq("user_id", m.userId);
  void send(acct.chat_id, "Your RENYXERA account was unlinked from this chat. You won't get reminders here any more. Link again any time from Profile → Telegram.");
  return NextResponse.json({ ok: true });
}
