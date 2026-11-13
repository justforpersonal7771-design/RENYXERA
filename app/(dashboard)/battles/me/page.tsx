"use client";

/** Me (R31B-5): the player card. All-time Arena numbers and season badges from /api/arena/leaderboard. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { usePlayer, type ArenaMe } from "@/components/game/use-arena";

type MeRow = ArenaMe & { badges?: { season: number; badge: string }[] };

export default function MePage() {
  const user = useAuthStore((s) => s.user);
  const p = usePlayer();
  const [me, setMe] = useState<MeRow | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!user) return;
    let live = true;
    fetch("/api/arena/leaderboard?scope=everyone&period=all", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { me: MeRow }) => { if (live) setMe(j.me); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [user]);

  if (!user) return <p className="g-text-2">Sign in to see your player card.</p>;
  const winRate = me && me.battles > 0 ? Math.round((me.wins / me.battles) * 100) : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="g-panel p-5 sm:p-8" aria-label="Player card">
        <div className="flex items-center gap-5">
          <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full p-1" style={{ background: p.ring ?? "var(--g-line-strong)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URI avatar */}
            <img src={p.avatar} alt="" width={96} height={96} className="h-full w-full rounded-full bg-[var(--g-surface-2)]" />
          </span>
          <div className="min-w-0">
            <h1 className="g-title truncate text-3xl">{p.name}</h1>
            {p.username && <p className="g-label">@{p.username}</p>}
          </div>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          <Stat label="Arena rating" value={me?.rating} />
          <Stat label="Arena points, all time" value={me?.points} />
          <Stat label="Battles" value={me?.battles} />
          <Stat label="Win rate" value={winRate === null ? (me ? "–" : undefined) : `${winRate}%`} />
        </dl>
        {failed && <p className="mt-4 text-sm g-muted" role="alert">Couldn&apos;t load your numbers right now.</p>}
      </section>

      <aside className="space-y-5">
        <section className="g-panel p-5" aria-labelledby="badges-h">
          <h2 id="badges-h" className="g-title text-lg">Season badges</h2>
          {me?.badges?.length ? (
            <ul className="mt-3 space-y-2">
              {me.badges.map((b) => (
                <li key={`${b.season}-${b.badge}`} className="flex items-center gap-2 text-sm font-bold text-[var(--g-text)]"><Award className="h-5 w-5 g-amber" aria-hidden /> Season {b.season}: {b.badge}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm g-text-2">Finish a season in the top 10 to earn one.</p>
          )}
        </section>
        <section className="g-panel p-5" aria-labelledby="look-h">
          <h2 id="look-h" className="g-title text-lg">Your look</h2>
          <p className="mt-1 text-sm g-text-2">Frames from the shop sit around your avatar here and on the leaderboard.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/battles/shop" className="g-btn-quiet"><ShoppingBag className="h-4 w-4" aria-hidden /> Frames</Link>
            <Link href="/profile" className="g-btn-quiet">Change avatar in Profile</Link>
          </div>
        </section>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div>
      <dt className="g-label">{label}</dt>
      <dd className="g-num mt-1 text-3xl font-extrabold text-[var(--g-text)]">{value ?? <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-[var(--g-surface-3)] align-middle motion-reduce:animate-none" aria-label="Loading" />}</dd>
    </div>
  );
}
