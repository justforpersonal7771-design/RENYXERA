import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getEntitlement } from "@/lib/billing/server";
import { answerCallback, askForContact, clearButtons, html, removeKeyboard, send } from "@/lib/telegram/bot";
import { TG_LIMITS, istParts, istToMs } from "@/lib/telegram/tiers";
import { refreshMembership, type Account, type Db } from "@/lib/telegram/server";
import { appLink, helpMessage, statusMessage, todayMessage } from "@/lib/telegram/messages";
import { checkRateLimit } from "@/lib/security/rate-limiter";

export const runtime = "nodejs";

type TgUser = { id: number; username?: string; first_name?: string };
type Update = {
  message?: { chat: { id: number; type: string }; from?: TgUser; text?: string; contact?: { phone_number: string; user_id?: number } };
  my_chat_member?: { chat: { id: number; type: string }; new_chat_member: { status: string } };
  callback_query?: { id: string; from: TgUser; data?: string; message?: { chat: { id: number }; message_id: number } };
};

const safeEqual = (a: string, b: string) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };

/**
 * Telegram calls this for every message to the bot. The secret header proves it is Telegram; the link code in
 * "/start <code>" proves which RENYXERA account the chat belongs to. Commands then follow the member's plan.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET || "";
  if (!secret || !safeEqual(req.headers.get("x-telegram-bot-api-secret-token") ?? "", secret)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  let u: Update;
  try { u = (await req.json()) as Update; } catch { return NextResponse.json({ ok: true }); }
  const db = createServiceRoleClient();
  try {
    if (u.callback_query) await onCallback(db, u.callback_query);
    else if (u.my_chat_member?.chat.type === "private") {
      // The user blocked or unblocked the bot: stop sending, or start again.
      await db.from("telegram_accounts").update({ blocked: ["kicked", "left"].includes(u.my_chat_member.new_chat_member.status) }).eq("chat_id", u.my_chat_member.chat.id);
    } else if (u.message?.contact && u.message.chat.type === "private" && u.message.from) await onContact(db, u.message.chat.id, u.message.from, u.message.contact);
    else if (u.message?.text && u.message.chat.type === "private" && u.message.from) await onMessage(db, u.message.chat.id, u.message.from, u.message.text.trim());
  } catch (e) {
    console.error("telegram webhook failed", e);
  }
  return NextResponse.json({ ok: true }); // always 200 so Telegram doesn't retry a bad update forever
}

async function accountByChat(db: Db, chatId: number): Promise<Account | null> {
  const { data } = await db.from("telegram_accounts").select("*").eq("chat_id", chatId).maybeSingle();
  return (data as Account | null) ?? null;
}

async function onMessage(db: Db, chatId: number, from: TgUser, text: string) {
  if (!checkRateLimit(`tgbot:${chatId}`, { limit: 40, windowMs: 60_000 }).allowed) return;
  const [cmdRaw, ...rest] = text.split(/\s+/);
  const cmd = cmdRaw.toLowerCase().replace(/@\w+$/, "");
  const arg = rest.join(" ");

  if (cmd === "/start") return start(db, chatId, from, rest[0]);
  const acct = await accountByChat(db, chatId);
  if (!acct) {
    await send(chatId, `Hi! I'm the RENYXERA study bot. To use me, link your account: open <b>Profile → Telegram</b> on the site and press <b>Link Telegram</b>.`, [[{ text: "Open RENYXERA", url: appLink("/profile#telegram") }]]);
    return;
  }
  const ent = await getEntitlement(acct.user_id);
  const limits = TG_LIMITS[ent.tier];

  switch (cmd) {
    case "/help": return void (await send(chatId, helpMessage(ent.tier, limits)));
    case "/status": { await refreshMembership(db, acct); const fresh = (await accountByChat(db, chatId)) ?? acct; const m = statusMessage(fresh, ent.tier); return void (await send(chatId, m.text, m.buttons)); }
    case "/today": { const m = await todayMessage(db, acct.user_id, ent.tier, limits); return void (await send(chatId, m.text, m.buttons)); }
    case "/timer": return timer(db, acct, chatId, arg, limits.timers, ent.tier);
    case "/alarm": return alarm(db, acct, chatId, arg, limits.alarms, ent.tier);
    case "/alarms": return listAlarms(db, acct, chatId);
    case "/cancel": return cancel(db, acct, chatId, arg);
    case "/digest": return digest(db, acct, chatId, arg, limits.digest);
    case "/verify": return void (await askVerify(db, acct, chatId));
    case "/unlink":
      await db.from("telegram_reminders").delete().eq("user_id", acct.user_id).is("sent_at", null);
      await db.from("telegram_accounts").delete().eq("user_id", acct.user_id);
      return void (await send(chatId, "Unlinked. You won't get reminders here any more. Link again any time from Profile → Telegram."));
    default: return void (await send(chatId, "I didn't understand that. Send /help to see what I can do."));
  }
}

async function start(db: Db, chatId: number, from: TgUser, code?: string) {
  const existing = await accountByChat(db, chatId);
  if (code === "verify" && existing) return askVerify(db, existing, chatId);
  if (!code) {
    if (existing) { const ent = await getEntitlement(existing.user_id); return void (await send(chatId, `You're linked. ${helpMessage(ent.tier, TG_LIMITS[ent.tier])}`)); }
    return void (await send(chatId, `Welcome to RENYXERA. Open <b>Profile → Telegram</b> on the site and press <b>Link Telegram</b> to connect this chat.`, [[{ text: "Open RENYXERA", url: appLink("/profile#telegram") }]]));
  }
  const { data: row } = await db.from("telegram_link_codes").select("user_id, expires_at").eq("code", code).maybeSingle();
  if (!row || Date.parse(row.expires_at) < Date.now()) return void (await send(chatId, "That link has expired. Open Profile → Telegram on the site and press Link Telegram again.", [[{ text: "Open RENYXERA", url: appLink("/profile#telegram") }]]));
  // One Telegram chat belongs to one account, and one account to one chat.
  if (existing && existing.user_id !== row.user_id) return void (await send(chatId, "This Telegram chat is already linked to another RENYXERA account. Unlink it there first (send /unlink from that account's chat), then try again."));
  const { error } = await db.from("telegram_accounts").upsert({ user_id: row.user_id, chat_id: chatId, tg_username: from.username ?? null, tg_first_name: from.first_name ?? null, blocked: false }, { onConflict: "user_id" });
  if (error) return void (await send(chatId, "Couldn't link just now. Please try again in a minute."));
  await db.from("telegram_link_codes").delete().eq("code", code);
  const acct = await accountByChat(db, chatId);
  if (acct) await refreshMembership(db, acct);
  const fresh = (await accountByChat(db, chatId)) ?? acct!;
  const ent = await getEntitlement(row.user_id);
  const s = statusMessage(fresh, ent.tier);
  await send(chatId, `✅ <b>Linked to your RENYXERA account.</b>\n\n${s.text}\n\nSend /help to see what I can do on your plan.`, s.buttons);
}

/** Step 1 of mobile verification: ask for the number with a one-tap button, or say it is already done. */
async function askVerify(db: Db, acct: Account, chatId: number) {
  const { data: p } = await db.from("profiles").select("phone, phone_verified").eq("id", acct.user_id).maybeSingle();
  if (p?.phone_verified) return void (await send(chatId, `✅ Your mobile number ${html(maskPhone(p.phone))} is already verified and locked to your account.`));
  await askForContact(chatId, "To verify your mobile number, tap <b>Share my number</b> below. Telegram sends me only your own number. Once verified it is locked to your RENYXERA account.");
}

const maskPhone = (p: string | null) => (p ? `${p.slice(0, 3)}******${p.slice(-2)}` : "");

/**
 * Step 2: Telegram sends the contact. It only counts if it is the sender's OWN contact (contact.user_id equals the
 * sender), the number is an Indian mobile, and no other account already holds it. Then it is saved as verified.
 */
async function onContact(db: Db, chatId: number, from: TgUser, c: { phone_number: string; user_id?: number }) {
  const acct = await accountByChat(db, chatId);
  if (!acct) return void (await removeKeyboard(chatId, "Link your account first: Profile → Telegram on the site."));
  if (c.user_id !== from.id) return void (await removeKeyboard(chatId, "That isn't your own number. Tap <b>Share my number</b> to share yours."));
  const digits = c.phone_number.replace(/\D/g, "");
  const phone = /^91[6-9]\d{9}$/.test(digits) ? `+${digits}` : null;
  if (!phone) return void (await removeKeyboard(chatId, "Only Indian mobile numbers (+91) can be verified right now."));
  const { data: p } = await db.from("profiles").select("phone, phone_verified").eq("id", acct.user_id).maybeSingle();
  if (p?.phone_verified) return void (await removeKeyboard(chatId, `✅ Your number ${html(maskPhone(p.phone))} is already verified and locked.`));
  const { data: taken } = await db.from("profiles").select("id").eq("phone", phone).neq("id", acct.user_id).maybeSingle();
  if (taken) return void (await removeKeyboard(chatId, "This number is already verified on another RENYXERA account, so it can't be used here."));
  const { error } = await db.from("profiles").update({ phone, phone_verified: true }).eq("id", acct.user_id);
  if (error) return void (await removeKeyboard(chatId, "Couldn't save that just now. Please try again in a minute."));
  await removeKeyboard(chatId, `✅ <b>Mobile number verified</b>: ${html(maskPhone(phone))}. It's now locked to your account.`);
}

async function timer(db: Db, acct: Account, chatId: number, arg: string, cap: number, tier: string) {
  const m = /^(\d{1,3})(?:\s+(.{1,80}))?$/.exec(arg);
  const mins = m ? Number(m[1]) : 0;
  if (!m || mins < 1 || mins > 240) return void (await send(chatId, "Use <code>/timer 25</code> or <code>/timer 50 Algorithms</code> (1 to 240 minutes)."));
  const { count } = await db.from("telegram_reminders").select("id", { count: "exact", head: true }).eq("user_id", acct.user_id).eq("kind", "timer").is("sent_at", null);
  if ((count ?? 0) >= cap) return void (await send(chatId, `Your ${tier} plan allows ${cap} timer${cap === 1 ? "" : "s"} at a time. Send <code>/cancel timers</code> first${tier === "pro" ? "." : ", or upgrade for more."}`, tier === "pro" ? undefined : [[{ text: "See plans", url: appLink("/pro") }]]));
  await db.from("telegram_reminders").insert({ user_id: acct.user_id, kind: "timer", remind_at: new Date(Date.now() + mins * 60_000).toISOString(), title: `Timer finished: ${mins} min`, body: m[2] ?? null });
  await send(chatId, `⏱ Timer set for <b>${mins} min</b>${m[2] ? ` — ${html(m[2])}` : ""}. I'll message you when it's done.`);
}

async function alarm(db: Db, acct: Account, chatId: number, arg: string, cap: number, tier: string) {
  if (cap === 0) return void (await send(chatId, "Daily alarms are a <b>Plus</b> and <b>Pro</b> feature.", [[{ text: "See plans", url: appLink("/pro") }]]));
  const m = /^([01]?\d|2[0-3]):([0-5]\d)(?:\s+(.{1,80}))?$/.exec(arg);
  if (!m) return void (await send(chatId, "Use <code>/alarm 06:00</code> or <code>/alarm 21:30 Revise OS</code> (24-hour, India time). It repeats every day."));
  const { count } = await db.from("telegram_reminders").select("id", { count: "exact", head: true }).eq("user_id", acct.user_id).eq("kind", "alarm").is("sent_at", null);
  if ((count ?? 0) >= cap) return void (await send(chatId, `Your ${tier} plan allows ${cap} alarms. Send <code>/cancel alarms</code> first${tier === "pro" ? "." : ", or upgrade for more."}`));
  const hhmm = `${m[1].padStart(2, "0")}:${m[2]}`;
  const now = Date.now(), today = istParts(now).date;
  let at = istToMs(today, hhmm);
  if (at <= now) at += 86400_000;
  await db.from("telegram_reminders").insert({ user_id: acct.user_id, kind: "alarm", remind_at: new Date(at).toISOString(), title: `⏰ Alarm ${hhmm}`, body: m[3] ?? null, repeat: "daily" });
  await send(chatId, `⏰ Daily alarm set for <b>${hhmm} IST</b>${m[3] ? ` — ${html(m[3])}` : ""}.`);
}

async function listAlarms(db: Db, acct: Account, chatId: number) {
  const { data } = await db.from("telegram_reminders").select("kind, remind_at, title, body").eq("user_id", acct.user_id).in("kind", ["alarm", "timer"]).is("sent_at", null).order("remind_at");
  if (!data?.length) return void (await send(chatId, "No timers or alarms waiting. Try <code>/timer 25</code>."));
  await send(chatId, ["<b>Waiting</b>", ...data.map((r) => `${r.kind === "alarm" ? "⏰" : "⏱"} ${istParts(Date.parse(r.remind_at)).hhmm} IST — ${html(r.body ?? r.title)}`)].join("\n"));
}

async function cancel(db: Db, acct: Account, chatId: number, arg: string) {
  const what = arg.toLowerCase();
  const kinds = what.startsWith("timer") ? ["timer"] : what.startsWith("alarm") ? ["alarm"] : what === "all" ? ["timer", "alarm"] : [];
  if (!kinds.length) return void (await send(chatId, "Use <code>/cancel timers</code>, <code>/cancel alarms</code> or <code>/cancel all</code>."));
  await db.from("telegram_reminders").delete().eq("user_id", acct.user_id).in("kind", kinds).is("sent_at", null);
  await send(chatId, `Cancelled your ${kinds.join(" and ")}${kinds.length > 1 ? "s" : "s"}.`.replace("timers and alarms", "timers and alarms"));
}

async function digest(db: Db, acct: Account, chatId: number, arg: string, allowed: boolean) {
  if (!allowed) return void (await send(chatId, "The morning digest is a <b>Plus</b> and <b>Pro</b> feature.", [[{ text: "See plans", url: appLink("/pro") }]]));
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(arg);
  if (!m) return void (await send(chatId, `Your digest arrives at <b>${acct.digest_time} IST</b>. Change it with <code>/digest 07:30</code>.`));
  const hhmm = `${m[1].padStart(2, "0")}:${m[2]}`;
  await db.from("telegram_accounts").update({ digest_time: hhmm }).eq("user_id", acct.user_id);
  await send(chatId, `🗓 Morning digest moved to <b>${hhmm} IST</b>.`);
}

async function onCallback(db: Db, cb: NonNullable<Update["callback_query"]>) {
  const chatId = cb.message?.chat.id;
  if (!chatId || !cb.data) return void (await answerCallback(cb.id));
  const acct = await accountByChat(db, chatId);
  if (!acct) return void (await answerCallback(cb.id, "Link your account first."));
  const [action, arg] = cb.data.split(":");
  const clear = () => (cb.message ? clearButtons(chatId, cb.message.message_id) : Promise.resolve());

  if (action === "done" || action === "snz") {
    const id = Number(arg);
    const { data: r } = await db.from("telegram_reminders").select("id, user_id, kind, remind_at, title, body, event_id, event_date").eq("id", id).eq("user_id", acct.user_id).maybeSingle();
    if (!r) return void (await answerCallback(cb.id, "That reminder is gone."));
    if (action === "done") {
      await db.from("telegram_reminders").update({ done_at: new Date().toISOString() }).eq("id", id);
      if (r.event_id) await db.from("telegram_actions").insert({ user_id: acct.user_id, kind: "done", event_id: r.event_id });
      await answerCallback(cb.id, "Marked done ✅");
      return void (await clear());
    }
    const ent = await getEntitlement(acct.user_id);
    if (!TG_LIMITS[ent.tier].blockReminders) return void (await answerCallback(cb.id, "Snooze is a Plus feature."));
    await db.from("telegram_reminders").insert({ user_id: acct.user_id, kind: r.kind, remind_at: new Date(Date.now() + 15 * 60_000).toISOString(), title: r.title, body: r.body, event_id: r.event_id, event_date: r.event_date });
    await answerCallback(cb.id, "I'll remind you again in 15 minutes ⏰");
    return void (await clear());
  }

  if (action === "roll") {
    const ent = await getEntitlement(acct.user_id);
    if (!TG_LIMITS[ent.tier].rollPrompt) return void (await answerCallback(cb.id, "That's a Pro feature."));
    const today = istParts(Date.now()).date;
    if (arg === "yes") {
      const { data: open } = await db.from("telegram_reminders").select("id, event_id").eq("user_id", acct.user_id).eq("kind", "block").eq("event_date", today).is("done_at", null).not("event_id", "is", null);
      const ids = (open ?? []).map((o) => o.event_id as string);
      if (ids.length) await db.from("telegram_actions").insert(ids.map((event_id) => ({ user_id: acct.user_id, kind: "roll", event_id })));
      await db.from("telegram_reminders").update({ done_at: new Date().toISOString() }).eq("user_id", acct.user_id).eq("kind", "block").eq("event_date", today).is("done_at", null);
      await answerCallback(cb.id, `${ids.length} block${ids.length === 1 ? "" : "s"} moved to tomorrow`);
      await send(chatId, `➡️ Moved <b>${ids.length}</b> unfinished block${ids.length === 1 ? "" : "s"} to tomorrow. They'll appear in your Study Planner the next time you open it.`, [[{ text: "Open Study Planner", url: appLink("/calendar") }]]);
    } else {
      await answerCallback(cb.id, "Okay, left as they are.");
    }
    return void (await clear());
  }
  await answerCallback(cb.id);
}
