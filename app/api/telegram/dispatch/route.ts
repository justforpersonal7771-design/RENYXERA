import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getEntitlement } from "@/lib/billing/server";
import { html, send, type Button } from "@/lib/telegram/bot";
import { TG_LIMITS, isQuiet, istParts, istToMs, quietEndMs } from "@/lib/telegram/tiers";
import { refreshMembership, type Account, type Db } from "@/lib/telegram/server";
import { appLink, blockLine, blocksOn, countdownLine } from "@/lib/telegram/messages";
import type { Tier } from "@/lib/billing/plans";

export const runtime = "nodejs";
export const maxDuration = 60;

type Reminder = { id: number; user_id: string; kind: "block" | "timer" | "alarm" | "custom"; remind_at: string; title: string; body: string | null; event_id: string | null; event_date: string | null; repeat: string | null };

/**
 * Runs every minute (Supabase pg_cron, with a GitHub Action as backup) with the shared secret. It sends whatever is
 * due: reminders, timers, alarms, the morning digest, the evening roll-forward prompt, the weekly review, mock
 * alerts, plan-ending alerts, and re-checks channel membership. Every send checks the member's plan again.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.PREGEN_SECRET || "";
  if (!secret || req.headers.get("x-pregen-secret") !== secret) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!process.env.TELEGRAM_BOT_TOKEN) return NextResponse.json({ error: "Bot not configured" }, { status: 503 });

  const db = createServiceRoleClient();
  const now = Date.now();
  const out = { reminders: 0, skipped: 0, digests: 0, rolls: 0, weekly: 0, streaks: 0, mocks: 0, ending: 0, rechecked: 0 };

  const accounts = new Map<string, Account>();
  const loadAccounts = async (ids: string[]) => {
    const need = ids.filter((i) => !accounts.has(i));
    if (!need.length) return;
    const { data } = await db.from("telegram_accounts").select("*").in("user_id", need);
    for (const a of (data ?? []) as Account[]) accounts.set(a.user_id, a);
  };
  const tiers = new Map<string, Tier>();
  const tierOf = async (id: string) => { if (!tiers.has(id)) tiers.set(id, (await getEntitlement(id)).tier); return tiers.get(id)!; };
  const tNow = istParts(now);
  const quietNow = (a: Account) => { const q = a.prefs.quiet as { from?: string; to?: string } | null | undefined; return isQuiet(tNow.hhmm, q?.from, q?.to); };
  const deliver = async (a: Account, text: string, buttons?: Button[][]) => {
    const r = await send(a.chat_id, text, buttons);
    if (r === "blocked") { await db.from("telegram_accounts").update({ blocked: true }).eq("user_id", a.user_id); a.blocked = true; }
    return r === "ok";
  };

  // 1 · Due reminders (claimed first, so two overlapping runs never send the same one twice).
  const { data: due } = await db.from("telegram_reminders").select("id").is("sent_at", null).lte("remind_at", new Date(now).toISOString()).order("remind_at").limit(150);
  if (due?.length) {
    const { data: claimed } = await db.from("telegram_reminders").update({ sent_at: new Date(now).toISOString() }).in("id", due.map((d) => d.id)).is("sent_at", null).select("id, user_id, kind, remind_at, title, body, event_id, event_date, repeat");
    const rows = (claimed ?? []) as Reminder[];
    await loadAccounts([...new Set(rows.map((r) => r.user_id))]);
    for (const r of rows) {
      const a = accounts.get(r.user_id);
      if (r.repeat === "daily") { // an alarm: queue tomorrow's before anything else can fail
        let next = Date.parse(r.remind_at) + 86400_000;
        while (next <= now) next += 86400_000;
        await db.from("telegram_reminders").insert({ user_id: r.user_id, kind: r.kind, remind_at: new Date(next).toISOString(), title: r.title, body: r.body, repeat: "daily" });
      }
      if (!a || a.blocked) { out.skipped++; continue; }
      const limits = TG_LIMITS[await tierOf(r.user_id)];
      const off = (r.kind === "block" && (!limits.blockReminders || a.prefs.blocks === false)) || (r.kind === "alarm" && (limits.alarms === 0 || a.prefs.alarms === false));
      if (off) { out.skipped++; continue; }
      if (r.kind === "block" && quietNow(a)) { // quiet hours: the nudge waits until they end
        const q = a.prefs.quiet as { to: string };
        await db.from("telegram_reminders").insert({ user_id: r.user_id, kind: r.kind, remind_at: new Date(quietEndMs(now, q.to)).toISOString(), title: r.title, body: r.body, event_id: r.event_id, event_date: r.event_date });
        out.skipped++; continue;
      }
      if (r.kind === "block") {
        const { data: still } = await db.from("telegram_reminders").select("done_at").eq("id", r.id).maybeSingle();
        if (still?.done_at) { out.skipped++; continue; }
        const ok = await deliver(a, `⏰ <b>Starting soon</b>\n${html(r.title)}${r.body ? `\n<i>${html(r.body)}</i>` : ""}`, [[{ text: "✅ Done", callback_data: `done:${r.id}` }, { text: "⏰ +15 min", callback_data: `snz:${r.id}` }], [{ text: "Open Study Planner", url: appLink("/calendar") }]]);
        ok ? out.reminders++ : out.skipped++;
      } else {
        const ok = await deliver(a, `${r.kind === "timer" ? "⏱" : "⏰"} <b>${html(r.title)}</b>${r.body ? `\n${html(r.body)}` : ""}`);
        ok ? out.reminders++ : out.skipped++;
      }
    }
  }

  // 2 · Per-account daily jobs, only for linked accounts that haven't blocked the bot.
  const t = istParts(now);
  const { data: all } = await db.from("telegram_accounts").select("*").eq("blocked", false).limit(2000);
  const linked = (all ?? []) as Account[];
  for (const a of linked) accounts.set(a.user_id, a);

  // morning digest (Plus, Pro) at the member's chosen IST time
  for (const a of linked) {
    if (a.prefs.digest === false || a.last_digest === t.date || t.hhmm < a.digest_time || quietNow(a)) continue;
    const limits = TG_LIMITS[await tierOf(a.user_id)];
    if (!limits.digest) continue;
    await db.from("telegram_accounts").update({ last_digest: t.date }).eq("user_id", a.user_id);
    const blocks = await blocksOn(db, a.user_id, t.date);
    if (!blocks.length) continue;
    if (await deliver(a, [await countdownLine(db, a.user_id, now), "", "<b>Good morning. Today's plan</b>", ...blocks.map(blockLine)].join("\n"), [[{ text: "Open Study Planner", url: appLink("/calendar") }]])) out.digests++;
  }

  // evening roll-forward prompt (Pro): "ask once a day"
  if (t.hhmm >= "20:30") {
    for (const a of linked) {
      if (a.prefs.roll === false || a.last_roll_prompt === t.date || quietNow(a)) continue;
      const tier = await tierOf(a.user_id);
      if (!TG_LIMITS[tier].rollPrompt) continue;
      const open = (await blocksOn(db, a.user_id, t.date)).filter((b) => !b.done_at);
      await db.from("telegram_accounts").update({ last_roll_prompt: t.date }).eq("user_id", a.user_id);
      if (!open.length) continue;
      const text = [`🌙 <b>${open.length} block${open.length === 1 ? "" : "s"} unfinished today</b>`, ...open.slice(0, 8).map(blockLine), "", "Move them to tomorrow?"].join("\n");
      if (await deliver(a, text, [[{ text: "➡️ Roll forward", callback_data: "roll:yes" }, { text: "Leave them", callback_data: "roll:no" }], [{ text: "Re-plan the rest in the app", url: appLink("/calendar") }]])) out.rolls++;
    }
  }

  // weekly review (Pro) on Sunday evening
  if (t.weekday === 0 && t.hhmm >= "20:00") {
    const from = istParts(now - 6 * 86400_000).date;
    for (const a of linked) {
      if (a.prefs.weekly === false || a.last_weekly === t.date || quietNow(a)) continue;
      if (!TG_LIMITS[await tierOf(a.user_id)].weeklyReview) continue;
      await db.from("telegram_accounts").update({ last_weekly: t.date }).eq("user_id", a.user_id);
      const { data } = await db.from("telegram_reminders").select("done_at").eq("user_id", a.user_id).eq("kind", "block").gte("event_date", from).lte("event_date", t.date);
      const total = data?.length ?? 0;
      if (!total) continue;
      const done = data!.filter((d) => d.done_at).length, pct = Math.round((done / total) * 100);
      const advice = pct >= 80 ? "Strong week. Keep the same load." : pct >= 50 ? "Decent. Roll the missed blocks into next week's lighter days." : "A tough week. Consider fewer hours per day so the plan is one you can keep, and re-plan from today.";
      if (await deliver(a, `📊 <b>Your week</b>\n${done} of ${total} blocks done (${pct}%).\n${advice}`, [[{ text: "Open Study Planner", url: appLink("/calendar") }]])) out.weekly++;
    }
  }

  // streak nudge (Plus, Pro) at 8 pm IST: practised yesterday, nothing yet today
  if (t.hhmm >= "20:00" && t.hhmm < "22:30") {
    const dayStart = istToMs(t.date, "00:00");
    const candidates = linked.filter((a) => a.prefs.streak !== false && !quietNow(a));
    if (candidates.length) {
      const { data: tries } = await db.from("exam_attempts").select("user_id, server_started_at").in("user_id", candidates.map((a) => a.user_id)).gte("server_started_at", new Date(dayStart - 86400_000).toISOString());
      const yesterday = new Set<string>(), todayDone = new Set<string>();
      for (const x of tries ?? []) (Date.parse(x.server_started_at) >= dayStart ? todayDone : yesterday).add(x.user_id);
      for (const a of candidates) {
        if (!yesterday.has(a.user_id) || todayDone.has(a.user_id)) continue;
        if (!TG_LIMITS[await tierOf(a.user_id)].streakNudge) continue;
        const { error } = await db.from("telegram_sent").insert({ key: `streak:${a.user_id}:${t.date}` });
        if (error) continue;
        if (await deliver(a, "🔥 You practised yesterday. A quick 10-question set today keeps your streak going.", [[{ text: "Practise now", url: appLink("/setup") }]])) out.streaks++;
      }
    }
  }

  // 3 · Mock alerts: results published (everyone), starting soon (Plus, Pro)
  const { data: mocks } = await db.from("mock_events").select("id, title, starts_at, results_at, branch_code").or(`and(starts_at.gt.${new Date(now + 20 * 60_000).toISOString()},starts_at.lt.${new Date(now + 40 * 60_000).toISOString()}),and(results_at.lte.${new Date(now).toISOString()},results_at.gt.${new Date(now - 6 * 3600_000).toISOString()})`);
  if (mocks?.length && linked.length) {
    const { data: profs } = await db.from("profiles").select("id, target_branch").in("id", linked.map((a) => a.user_id));
    const branchOf = new Map((profs ?? []).map((p) => [p.id as string, (p.target_branch as string | null) ?? "CSE"]));
    for (const mk of mocks) {
      const starting = Date.parse(mk.starts_at) > now;
      for (const a of linked) {
        if (branchOf.get(a.user_id) !== mk.branch_code || a.blocked) continue;
        if (starting) { if (a.prefs.mocks === false || quietNow(a) || !TG_LIMITS[await tierOf(a.user_id)].mockReminders) continue; }
        const key = `mock-${starting ? "start" : "results"}:${mk.id}:${a.user_id}`;
        const { error } = await db.from("telegram_sent").insert({ key });
        if (error) continue; // already sent
        const ok = await deliver(a, starting ? `📝 <b>${html(mk.title)}</b> starts in about 30 minutes. Entry closes 30 minutes after the start.` : `🏆 Results for <b>${html(mk.title)}</b> are out. See your score, rank and the leaderboard.`, [[{ text: starting ? "Open Mocks" : "See results", url: appLink("/mocks") }]]);
        if (ok) out.mocks++;
      }
    }
  }

  // 4 · Plan ending soon (paid plans): 3 days and 1 day before
  const ids = linked.filter((a) => a.prefs.billing !== false).map((a) => a.user_id);
  if (ids.length) {
    const { data: ents } = await db.from("entitlements").select("user_id, plan, valid_until").in("user_id", ids).gt("valid_until", new Date(now).toISOString()).lt("valid_until", new Date(now + 3 * 86400_000 + 3600_000).toISOString());
    for (const e of ents ?? []) {
      const a = accounts.get(e.user_id);
      if (!a || a.blocked) continue;
      const days = Math.ceil((Date.parse(e.valid_until) - now) / 86400_000);
      const band = days <= 1 ? "d1" : "d3";
      const { error } = await db.from("telegram_sent").insert({ key: `end:${e.user_id}:${String(e.valid_until).slice(0, 10)}:${band}` });
      if (error) continue;
      if (await deliver(a, `⌛ Your <b>${e.plan === "pro" ? "Pro" : "Plus"}</b> plan ends in ${days <= 1 ? "less than a day" : `${days} days`}. Renew to keep your AI requests, analytics and planner automation.`, [[{ text: "Renew", url: appLink("/pro") }]])) out.ending++;
    }
  }

  // 5 · Keep channel / group membership fresh (a few accounts per run)
  const stale = linked.filter((a) => !a.checked_at || now - Date.parse(a.checked_at) > 24 * 3600_000).slice(0, 15);
  for (const a of stale) { await refreshMembership(db, a); out.rechecked++; }
  if (t.hhmm === "03:00") await (db as Db).rpc("prune_telegram");

  return NextResponse.json(out);
}
