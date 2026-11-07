import { NextRequest, NextResponse } from "next/server";
import { battleCtx, isCtx } from "@/lib/server/battles";
import { seasonByNumber, seasonWindow, weekStartIso } from "@/lib/server/arena";

export const runtime = "nodejs";

/**
 * Arena leaderboard (R29 step 3).  GET ?scope=friends|everyone&period=week|season|all
 * Week = Monday 00:00 IST to now. "Everyone" shows usernames only (never real names); "friends" may show display names.
 * Returns the top 50, plus my own row (even when I'm outside the top 50), my rating and my points.
 */
type Row = { rank: number; id: string; name: string; points: number; battles: number; wins: number; rating: number; you: boolean; badges: { season: number; badge: string }[] };

export async function GET(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "leaderboard", limit: 30, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const me = userId!;
  const q = req.nextUrl.searchParams;
  const scope = q.get("scope") === "friends" ? "friends" : "everyone";
  const period = q.get("period") === "all" ? "all" : q.get("period") === "season" ? "season" : "week";
  const season = seasonWindow();
  const since = period === "all" ? "1970-01-01T00:00:00Z" : period === "season" ? season.startIso : weekStartIso();

  // The first request after a season ends writes its badges (award_season is idempotent; one cheap count says whether it already ran).
  if (season.number > 1) {
    const prev = seasonByNumber(season.number - 1);
    const { count } = await db.from("season_awards").select("id", { count: "exact", head: true }).eq("season", prev.number);
    if (!count) await db.rpc("award_season", { p_season: prev.number, p_from: prev.startIso, p_to: prev.endIso });
  }

  let totals: { user_id: string; points: number; battles: number; wins: number }[] = [];
  if (scope === "everyone") {
    const { data } = await db.rpc("arena_leaderboard", { p_since: since, p_limit: 200 });
    totals = ((data ?? []) as { user_id: string; points: number | string; battles: number | string; wins: number | string }[]).map((r) => ({ user_id: r.user_id, points: Number(r.points), battles: Number(r.battles), wins: Number(r.wins) }));
  } else {
    const { data: fr } = await db.from("friendships").select("user_a, user_b").eq("status", "accepted").or(`user_a.eq.${me},user_b.eq.${me}`).limit(500);
    const ids = [me, ...(fr ?? []).map((r) => (r.user_a === me ? r.user_b : r.user_a) as string)];
    const { data: rows } = await db.from("points_ledger").select("user_id, amount, kind").in("user_id", ids).gte("created_at", since).limit(20000);
    const m = new Map<string, { user_id: string; points: number; battles: number; wins: number }>();
    for (const r of rows ?? []) {
      const t = m.get(r.user_id) ?? { user_id: r.user_id, points: 0, battles: 0, wins: 0 };
      t.points += r.amount; t.battles += 1; if (r.kind === "win") t.wins += 1; m.set(r.user_id, t);
    }
    for (const id of ids) if (!m.has(id)) m.set(id, { user_id: id, points: 0, battles: 0, wins: 0 });
    totals = [...m.values()].sort((a, b) => b.points - a.points || b.battles - a.battles);
  }

  const top = totals.slice(0, 50);
  const myIdx = totals.findIndex((t) => t.user_id === me);
  const want = [...new Set([...top.map((t) => t.user_id), me])];
  const [{ data: profs }, { data: rats }, { data: awards }] = await Promise.all([
    db.from("profiles").select("id, username, display_name").in("id", want),
    db.from("ratings").select("user_id, rating").in("user_id", want),
    db.from("season_awards").select("user_id, season, badge").in("user_id", want).order("season", { ascending: false }).limit(200),
  ]);
  const nameOf = (id: string) => {
    const p = profs?.find((x) => x.id === id);
    const raw = scope === "friends" ? (p?.display_name || p?.username) : p?.username;
    return ((raw as string | undefined) ?? "Student").slice(0, 40);
  };
  const rating = (id: string) => rats?.find((r) => r.user_id === id)?.rating ?? 1000;
  const shape = (t: (typeof totals)[number], i: number): Row => ({ rank: i + 1, id: t.user_id, name: nameOf(t.user_id), points: t.points, battles: t.battles, wins: t.wins, rating: rating(t.user_id), you: t.user_id === me, badges: (awards ?? []).filter((a) => a.user_id === t.user_id).slice(0, 3).map((a) => ({ season: a.season as number, badge: a.badge as string })) });
  const rows = top.map(shape);
  const mine = myIdx >= 0 ? shape(totals[myIdx], myIdx) : ({ rank: 0, id: me, name: nameOf(me), points: 0, battles: 0, wins: 0, rating: rating(me), you: true, badges: (awards ?? []).filter((a) => a.user_id === me).slice(0, 3).map((a) => ({ season: a.season as number, badge: a.badge as string })) } as Row);
  return NextResponse.json({ scope, period, weekStart: since, season: { number: season.number, daysLeft: season.daysLeft, endsAt: season.endIso }, rows, me: mine }, { headers: { "Cache-Control": "private, no-store" } });
}
