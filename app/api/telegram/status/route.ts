import { NextRequest, NextResponse } from "next/server";
import { accountOf, member, tierOf } from "@/lib/telegram/server";
import { botConfigured, botUsername } from "@/lib/telegram/bot";
import { TELEGRAM_CHANNEL_URL, TELEGRAM_GROUP_URL } from "@/lib/telegram/tiers";

export const runtime = "nodejs";

/** Everything the Profile → Telegram screen needs: link state, channel / group membership, preferences, plan limits. */
export async function GET(req: NextRequest) {
  const m = await member(req, { limit: 120 });
  if (m instanceof NextResponse) return m;
  const [acct, { tier, limits }] = await Promise.all([accountOf(m.db, m.userId), tierOf(m.userId)]);
  const configured = botConfigured();
  let timers = 0, alarms = 0;
  const { data: prof } = acct ? await m.db.from("profiles").select("phone, phone_verified").eq("id", m.userId).maybeSingle() : { data: null };
  if (acct) {
    const [t, a] = await Promise.all([
      m.db.from("telegram_reminders").select("id", { count: "exact", head: true }).eq("user_id", m.userId).eq("kind", "timer").is("sent_at", null),
      m.db.from("telegram_reminders").select("id", { count: "exact", head: true }).eq("user_id", m.userId).eq("kind", "alarm").is("sent_at", null),
    ]);
    timers = t.count ?? 0; alarms = a.count ?? 0;
  }
  return NextResponse.json({
    configured, tier, limits, bot: configured ? await botUsername() : null, channelUrl: TELEGRAM_CHANNEL_URL, groupUrl: TELEGRAM_GROUP_URL,
    linked: !!acct,
    account: acct ? { username: acct.tg_username, firstName: acct.tg_first_name, linkedAt: acct.linked_at, inChannel: acct.in_channel, inGroup: acct.in_group, checkedAt: acct.checked_at, prefs: acct.prefs, digestTime: acct.digest_time, blocked: acct.blocked } : null,
    usage: { timers, alarms },
    phone: acct ? { verified: !!prof?.phone_verified, masked: prof?.phone ? `${String(prof.phone).slice(0, 3)}******${String(prof.phone).slice(-2)}` : null } : null,
  }, { headers: { "Cache-Control": "no-store" } });
}
