"use client";

/**
 * Arena leaderboard (R29 step 3): Arena Points (AP) from battles, friends or everyone, this week or all time.
 * Win 30 AP, draw 15, loss 8. Weekly board resets Monday 12:00 am IST. Everyone-board shows usernames only.
 */
import { useCallback, useEffect, useState } from "react";
import { Trophy, Loader2 } from "lucide-react";

type Row = { rank: number; id: string; name: string; points: number; battles: number; wins: number; rating: number; you: boolean };
type Data = { rows: Row[]; me: Row; season?: { number: number; daysLeft: number; endsAt: string } };

export function ArenaLeaderboard() {
  const [scope, setScope] = useState<"friends" | "everyone">("friends");
  const [period, setPeriod] = useState<"week" | "season" | "all">("week");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/arena/leaderboard?scope=${scope}&period=${period}`);
      if (!r.ok) throw new Error(String(r.status));
      setData((await r.json()) as Data); setError(false);
    } catch { setError(true); }
  }, [scope, period]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(null); void load();
    const t = setInterval(() => { if (document.visibilityState === "visible") void load(); }, 60_000);
    return () => clearInterval(t);
  }, [load]);

  const tab = (on: boolean) => `rounded-full px-3 py-1.5 text-xs font-bold ${on ? "bg-[var(--text-primary)] text-[var(--surface)]" : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]"}`;
  const medal = (n: number) => (n === 1 ? "🥇" : n === 2 ? "🥈" : n === 3 ? "🥉" : String(n));
  const played = data?.rows.some((r) => r.battles > 0) ?? false;
  return (
    <section className="card-well p-5 sm:p-6" data-tint="peri" aria-label="Leaderboard">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-[var(--text-primary)]"><Trophy className="h-5 w-5" /> Leaderboard</h2>
        <div className="flex flex-wrap gap-2">
          <span className="flex gap-1" role="group" aria-label="Who"><button type="button" className={tab(scope === "friends")} aria-pressed={scope === "friends"} onClick={() => setScope("friends")}>Friends</button><button type="button" className={tab(scope === "everyone")} aria-pressed={scope === "everyone"} onClick={() => setScope("everyone")}>Everyone</button></span>
          <span className="flex gap-1" role="group" aria-label="Period"><button type="button" className={tab(period === "week")} aria-pressed={period === "week"} onClick={() => setPeriod("week")}>This week</button><button type="button" className={tab(period === "season")} aria-pressed={period === "season"} onClick={() => setPeriod("season")}>Season</button><button type="button" className={tab(period === "all")} aria-pressed={period === "all"} onClick={() => setPeriod("all")}>All time</button></span>
        </div>
      </div>
      <p className="mt-1 text-xs text-[var(--text-muted)]">Win 30 points, draw 15, loss 8, so playing always pays. {period === "week" ? "Resets Monday 12:00 am IST. " : period === "season" && data?.season ? `Season ${data.season.number} runs 4 weeks and ends in ${data.season.daysLeft} ${data.season.daysLeft === 1 ? "day" : "days"} (Monday 12:00 am IST). A new season starts at zero. ` : ""}Up to 10 battles a day earn points.</p>

      {data === null && !error ? <p className="mt-4 text-sm text-[var(--text-secondary)]" role="status"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Loading…</p> : null}
      {error && !data ? <p className="mt-4 text-sm text-[var(--text-secondary)]" role="alert">Couldn&apos;t load the leaderboard right now.</p> : null}
      {data ? (
        <>
          <div className="mt-3 flex flex-wrap gap-2 text-sm" aria-label="Your numbers">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">You: <b className="font-num">{data.me.points}</b> points</span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">Rating <b className="font-num">{data.me.rating}</b></span>
            {data.me.rank > 0 ? <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">Rank <b className="font-num">#{data.me.rank}</b></span> : null}
          </div>
          {!played ? (
            <p className="mt-4 text-sm text-[var(--text-secondary)]">No battles finished {period === "week" ? "this week" : period === "season" ? "this season" : "yet"}. Finish a challenge to put points on the board.</p>
          ) : (
            <ol className="mt-3 space-y-1.5">
              {data.rows.filter((r) => r.battles > 0 || r.you).map((r) => (
                <li key={r.id} className={`flex items-center gap-3 rounded-2xl border p-2.5 ${r.you ? "border-[var(--text-primary)]" : "border-[var(--border)]"} bg-[var(--surface)]`}>
                  <span className="w-8 shrink-0 text-center text-sm font-extrabold text-[var(--text-primary)]">{medal(r.rank)}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--text-primary)]">{r.name}{r.you ? " (you)" : ""}</span>
                  <span className="hidden text-xs text-[var(--text-muted)] sm:inline">{r.wins}W · {r.battles} played · rating {r.rating}</span>
                  <span className="shrink-0 text-sm font-extrabold text-[var(--text-primary)]"><span className="font-num">{r.points}</span> AP</span>
                </li>
              ))}
            </ol>
          )}
        </>
      ) : null}
    </section>
  );
}
