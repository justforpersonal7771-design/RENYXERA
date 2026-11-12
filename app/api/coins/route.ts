import { NextRequest, NextResponse } from "next/server";
import { battleCtx, isCtx, type Db } from "@/lib/server/battles";
import { istDateStr } from "@/lib/time/ist";

export const runtime = "nodejs";

/**
 * Coins: GET balance, today's check-in state and the current daily streak. POST claims today's reward (IST day):
 * 10 coins a day, plus 50 on every 7th day in a row. Each day pays once (unique user/kind/ref). Battles add coins when settled.
 */
const DAILY = 10, BONUS = 50;
const NO = { "Cache-Control": "private, no-store" };
const dayBefore = (d: string, n: number) => istDateStr(new Date(Date.parse(`${d}T12:00:00+05:30`) - n * 86_400_000));

async function state(db: Db, uid: string) {
  const { data, error } = await db.from("coins_ledger").select("kind, amount, ref").eq("user_id", uid).limit(5000);
  if (error) return null;
  const balance = (data ?? []).reduce((a, r) => a + (r.amount as number), 0);
  const days = new Set((data ?? []).filter((r) => r.kind === "daily").map((r) => r.ref as string));
  return { balance, ...streakOf(days) };
}
function streakOf(days: Set<string>) {
  const today = istDateStr();
  const claimedToday = days.has(today);
  let streak = 0;
  for (let n = claimedToday ? 0 : 1; days.has(dayBefore(today, n)); n++) streak++;
  return { claimedToday, streak };
}

export async function GET(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "coins-read", limit: 60, needUser: true });
  if (!isCtx(c)) return c;
  const s = await state(c.db, c.userId!);
  if (!s) return NextResponse.json({ error: "Coins aren't set up yet." }, { status: 503 });
  return NextResponse.json({ ...s, daily: DAILY, bonus: BONUS }, { headers: NO });
}

export async function POST(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "coins-claim", limit: 10, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const before = await state(db, userId!);
  if (!before) return NextResponse.json({ error: "Coins aren't set up yet." }, { status: 503 });
  if (before.claimedToday) return NextResponse.json({ ...before, added: 0 }, { headers: NO });
  const today = istDateStr();
  const streak = before.streak + 1;
  const rows: { user_id: string; kind: string; amount: number; ref: string }[] = [{ user_id: userId!, kind: "daily", amount: DAILY, ref: today }];
  if (streak % 7 === 0) rows.push({ user_id: userId!, kind: "streak_bonus", amount: BONUS, ref: today });
  const { error } = await db.from("coins_ledger").upsert(rows, { onConflict: "user_id,kind,ref", ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: "Couldn't claim right now." }, { status: 500 });
  const after = await state(db, userId!);
  return NextResponse.json({ ...after, added: rows.reduce((a, r) => a + r.amount, 0), bonusHit: streak % 7 === 0 }, { headers: NO });
}
