import "server-only";
import { istDateStr } from "@/lib/time/ist";
import type { Db } from "@/lib/server/battles";

/**
 * Arena points and ratings (R29 step 3). settleBattle() is called whenever a score lands (owner or friend finishes); it is safe to call any
 * number of times: the ledger has one row per student, battle and opponent, and ratings move only when a new row was really written.
 * Points: win 30, draw 15, loss 8 (trying always pays). Rating: Elo, start 1000, K = 24. At most 10 point-earning battles a day (IST).
 */
export const POINTS = { win: 30, draw: 15, loss: 8 } as const;
const K = 24;
const DAILY_CAP = 10;

/** Monday 00:00 IST of the current week, as an ISO instant. */
export function weekStartIso(now: Date = new Date()): string {
  const day = istDateStr(now);
  const dow = new Date(`${day}T00:00:00Z`).getUTCDay(); // weekday of the IST calendar date
  const back = (dow + 6) % 7;
  return new Date(new Date(`${day}T00:00:00+05:30`).getTime() - back * 86_400_000).toISOString();
}
/** Seasons: fixed 4-week windows (Monday 00:00 IST), counted from Monday 2 Nov 2026. No table needed: the window follows from the date. */
const SEASON_EPOCH_MS = new Date("2026-11-02T00:00:00+05:30").getTime();
const SEASON_MS = 28 * 86_400_000;
export function seasonWindow(now: Date = new Date()): { number: number; startIso: string; endIso: string; daysLeft: number } {
  const n = Math.max(0, Math.floor((now.getTime() - SEASON_EPOCH_MS) / SEASON_MS));
  const start = SEASON_EPOCH_MS + n * SEASON_MS, end = start + SEASON_MS;
  return { number: n + 1, startIso: new Date(start).toISOString(), endIso: new Date(end).toISOString(), daysLeft: Math.max(0, Math.ceil((end - now.getTime()) / 86_400_000)) };
}
const todayStartIso = (now: Date = new Date()) => new Date(`${istDateStr(now)}T00:00:00+05:30`).toISOString();

type Kind = "win" | "draw" | "loss";
const flip = (k: Kind): Kind => (k === "win" ? "loss" : k === "loss" ? "win" : "draw");

export async function settleBattle(db: Db, battleId: string): Promise<void> {
  try {
    const { data: b } = await db.from("battles").select("owner_id, owner_score, max_score").eq("id", battleId).maybeSingle();
    if (!b || b.owner_score === null || !(Number(b.max_score) > 0)) return;
    const { data: entries } = await db.from("battle_entries").select("user_id, score, max_score").eq("battle_id", battleId).eq("status", "submitted");
    const ownerPct = Number(b.owner_score) / Number(b.max_score);
    for (const e of entries ?? []) {
      if (e.score === null || !(Number(e.max_score) > 0) || e.user_id === b.owner_id) continue;
      const pct = Number(e.score) / Number(e.max_score);
      const mine: Kind = Math.abs(pct - ownerPct) < 1e-9 ? "draw" : pct > ownerPct ? "win" : "loss";
      await award(db, battleId, e.user_id as string, b.owner_id as string, mine);
    }
  } catch (err) { console.warn("[arena] settle failed", (err as Error)?.message); }
}

async function award(db: Db, battleId: string, a: string, o: string, aKind: Kind) {
  const since = todayStartIso();
  const [{ count: ca }, { count: co }] = await Promise.all([
    db.from("points_ledger").select("id", { count: "exact", head: true }).eq("user_id", a).gte("created_at", since),
    db.from("points_ledger").select("id", { count: "exact", head: true }).eq("user_id", o).gte("created_at", since),
  ]);
  if ((ca ?? 0) >= DAILY_CAP || (co ?? 0) >= DAILY_CAP) return;
  const oKind = flip(aKind);
  const { data: fresh } = await db.from("points_ledger").upsert([
    { user_id: a, battle_id: battleId, opponent_id: o, kind: aKind, amount: POINTS[aKind] },
    { user_id: o, battle_id: battleId, opponent_id: a, kind: oKind, amount: POINTS[oKind] },
  ], { onConflict: "user_id,battle_id,opponent_id", ignoreDuplicates: true }).select("user_id");
  if ((fresh?.length ?? 0) < 2) return; // already settled (or one side was): do not move ratings twice
  const { data: rs } = await db.from("ratings").select("user_id, rating").in("user_id", [a, o]);
  const ra = rs?.find((r) => r.user_id === a)?.rating ?? 1000, ro = rs?.find((r) => r.user_id === o)?.rating ?? 1000;
  const ea = 1 / (1 + 10 ** ((ro - ra) / 400));
  const sa = aKind === "win" ? 1 : aKind === "draw" ? 0.5 : 0;
  const now = new Date().toISOString();
  await db.from("ratings").upsert([
    { user_id: a, rating: Math.round(ra + K * (sa - ea)), updated_at: now },
    { user_id: o, rating: Math.round(ro + K * ((1 - sa) - (1 - ea))), updated_at: now },
  ], { onConflict: "user_id" });
}
