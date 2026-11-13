"use client";

/**
 * Arena (R31B-3, rebuilt as a game ladder): the top three on a podium, then the ladder with your row lit.
 * Data: /api/arena/leaderboard (friends or everyone; week, season or all time). "Everyone" shows usernames only.
 * Rules mirror lib/server/arena.ts.
 */
import { useEffect, useState } from "react";
import { Crown, Swords } from "lucide-react";

type Row = { rank: number; id: string; name: string; points: number; battles: number; wins: number; rating: number; you: boolean };
type Data = { rows: Row[]; me: Row; season?: { number: number; daysLeft: number } };
const SCOPES = [["friends", "Friends"], ["everyone", "Everyone"]] as const;
const PERIODS = [["week", "This week"], ["season", "Season"], ["all", "All time"]] as const;
const MEDAL = ["#ffc94d", "#c9d3ea", "#e0925a"];
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

export default function ArenaPage() {
  const [scope, setScope] = useState<"friends" | "everyone">("friends");
  const [period, setPeriod] = useState<"week" | "season" | "all">("week");
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let live = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clear the old board while the new one loads
    setData(null); setErr(false);
    fetch(`/api/arena/leaderboard?scope=${scope}&period=${period}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: Data) => { if (live) setData(j); })
      .catch(() => { if (live) setErr(true); });
    return () => { live = false; };
  }, [scope, period]);

  const top = data?.rows.slice(0, 3) ?? [];
  const rest = data?.rows.slice(3) ?? [];
  const meOutside = data && !data.rows.some((r) => r.you);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="g-title text-4xl sm:text-5xl">Arena</h1>
          {data?.season && <p className="mt-1 font-bold text-[var(--g-signal)]">Season {data.season.number}, {data.season.daysLeft} days left</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Segment items={SCOPES} value={scope} onChange={setScope} label="Who" />
          <Segment items={PERIODS} value={period} onChange={setPeriod} label="When" />
        </div>
      </header>

      {err ? (
        <p className="rounded-2xl border border-[var(--g-line)] bg-[var(--g-surface)] p-5 g-text-2" role="alert">Couldn&apos;t load the Arena. Try again in a moment.</p>
      ) : !data ? (
        <div className="h-64 animate-pulse rounded-[28px] bg-[var(--g-surface)] motion-reduce:animate-none" aria-label="Loading the Arena" />
      ) : data.rows.every((r) => r.points === 0) ? (
        <div className="g-stage grid place-items-center p-10 text-center">
          <div>
            <Swords className="mx-auto h-12 w-12 text-[var(--g-amber)]" aria-hidden />
            <p className="g-title mt-3 text-2xl">No points yet {period === "week" ? "this week" : period === "season" ? "this season" : ""}</p>
            <p className="mt-1 g-text-2">Win a battle and you take the top spot.</p>
          </div>
        </div>
      ) : (
        <>
          {/* podium: 2nd, 1st, 3rd */}
          <section aria-label="Top three" className="g-stage px-3 pb-0 pt-8 sm:px-8">
            <ol className="mx-auto grid max-w-3xl grid-cols-3 items-end gap-2 sm:gap-5">
              {[1, 0, 2].map((i) => {
                const r = top[i];
                const h = i === 0 ? "h-36 sm:h-44" : i === 1 ? "h-28 sm:h-32" : "h-20 sm:h-24";
                return (
                  <li key={i} className="flex flex-col items-center text-center" aria-label={r ? `${r.rank}. ${r.name}, ${r.points} points` : `Place ${i + 1} empty`}>
                    {r ? (
                      <>
                        {i === 0 && <Crown className="mb-1 h-8 w-8 text-[#ffc94d] drop-shadow-[0_0_10px_rgba(255,201,77,.6)]" aria-hidden />}
                        <span className={`grid place-items-center rounded-full font-display font-black text-[var(--g-deep)] ${i === 0 ? "h-20 w-20 text-2xl" : "h-16 w-16 text-xl"} ${r.you ? "ring-4 ring-[var(--g-signal)]" : ""}`}
                          style={{ background: MEDAL[i], boxShadow: `0 0 24px ${MEDAL[i]}66` }}>{initials(r.name)}</span>
                        <span className="mt-2 w-full truncate font-display text-sm font-extrabold text-[var(--g-text)] sm:text-base">{r.you ? "You" : r.name}</span>
                        <span className="g-num text-sm font-bold text-[var(--g-amber)]">{r.points} pts</span>
                      </>
                    ) : <span className="h-16 w-16 rounded-full border-2 border-dashed border-[var(--g-line-strong)]" />}
                    <span className={`mt-3 grid w-full place-items-center rounded-t-2xl ${h}`}
                      style={{ background: `linear-gradient(180deg, ${MEDAL[i]}55, ${MEDAL[i]}14)`, borderTop: `3px solid ${MEDAL[i]}` }}>
                      <span className="g-num text-4xl font-black text-white/80">{i + 1}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* the ladder */}
          {(rest.length > 0 || meOutside) && (
            <ol className="space-y-2" aria-label="Ladder">
              {rest.map((r) => <LadderRow key={r.id} r={r} />)}
              {meOutside && data.me && <LadderRow r={data.me} />}
            </ol>
          )}
        </>
      )}

      <details className="rounded-2xl border border-[var(--g-line)] bg-[var(--g-surface)] p-5">
        <summary className="cursor-pointer font-display text-lg font-extrabold text-[var(--g-text)]">How the Arena works</summary>
        <ul className="mt-3 space-y-2 text-sm g-text-2">
          <li><b className="text-[var(--g-text)]">Points:</b> win 30, draw 15, finish 8. Up to 10 battles a day earn points (days run on IST).</li>
          <li><b className="text-[var(--g-text)]">Rating:</b> everyone starts at 1000; it moves after each battle by up to 24, depending on who you beat.</li>
          <li><b className="text-[var(--g-text)]">Seasons:</b> four weeks, starting Monday. The top 10 get a season badge.</li>
          <li><b className="text-[var(--g-text)]">Weekly board:</b> resets every Monday at 12:00 am IST.</li>
        </ul>
      </details>
    </div>
  );
}

function LadderRow({ r }: { r: Row }) {
  return (
    <li className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${r.you ? "border-[var(--g-signal)] bg-[rgba(34,211,238,0.1)] shadow-[0_0_20px_rgba(34,211,238,0.15)]" : "border-[var(--g-line)] bg-[var(--g-surface)]"}`}>
      <span className="g-num w-8 text-center text-lg font-black text-[var(--g-muted)]">{r.rank > 0 ? r.rank : "–"}</span>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--g-surface-3)] text-sm font-black text-[var(--g-text)]">{initials(r.name)}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-bold text-[var(--g-text)]">{r.you ? "You" : r.name}</span>
        <span className="block text-xs g-muted">{r.wins} wins in {r.battles} battles, rating {r.rating}</span>
      </span>
      <span className="g-num text-xl font-black text-[var(--g-amber)]">{r.points}</span>
    </li>
  );
}

function Segment<T extends string>({ items, value, onChange, label }: { items: readonly (readonly [T, string])[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex rounded-2xl border border-[var(--g-line)] bg-[rgba(10,12,31,0.7)] p-1">
      {items.map(([v, t]) => (
        <button key={v} type="button" role="tab" aria-selected={value === v} onClick={() => onChange(v)}
          className={`min-h-[40px] rounded-xl px-3.5 text-sm font-extrabold transition-colors ${value === v ? "bg-[var(--g-royal)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_3px_0_#2c2580]" : "text-[var(--g-muted)] hover:text-[var(--g-text)]"}`}>{t}</button>
      ))}
    </div>
  );
}
