"use client";

import { useEffect, useState } from "react";
import { Medal, Star, TrendingUp, Swords } from "lucide-react";

type Me = { rank: number; points: number; battles: number; wins: number; rating: number };

/** The player card at the top of Battles: rating, rank among friends, Arena points and the win record. Reads the leaderboard's "me" row. */
export function ArenaStats() {
  const [me, setMe] = useState<Me | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/api/arena/leaderboard?scope=friends&period=all")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { me?: Me } | null) => { if (live && j?.me) setMe(j.me); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  const tiles = [
    { k: "rating", label: "Rating", value: me ? String(me.rating) : "–", icon: Star, tint: "lilac" },
    { k: "rank", label: "Rank among friends", value: me ? `#${me.rank}` : "–", icon: Medal, tint: "butter" },
    { k: "points", label: "Arena points", value: me ? String(me.points) : "–", icon: TrendingUp, tint: "mint" },
    { k: "record", label: "Wins", value: me ? `${me.wins} of ${me.battles}` : "–", icon: Swords, tint: "rose" },
  ];
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Your arena record">
      {tiles.map((t) => (
        <li key={t.k} className="card-pastel metal p-4" data-tint={t.tint} data-nowm>
          <span className="flex items-center justify-between gap-2 text-xs font-bold text-[var(--text-secondary)]">{t.label}<span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--surface)] text-[var(--tint-ink)]"><t.icon className="h-4 w-4" aria-hidden /></span></span>
          <span className="mt-2 block font-display text-3xl font-extrabold leading-none text-[var(--text-primary)]">{t.value}</span>
        </li>
      ))}
    </ul>
  );
}
