"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { generateAvatarDataUri, useAvatarStyles } from "@/lib/avatar/generate-avatar";
import { isAvatarStyleId } from "@/lib/avatar/dicebear-styles";
import { shopItem } from "@/lib/coins/shop";

export type ArenaMe = { rank: number; points: number; battles: number; wins: number; rating: number };
export type Season = { number: number; daysLeft: number; endsAt: string };
export const SEASON_DAYS = 28;

/** My Arena row (friends board, this week) and the current season, from /api/arena/leaderboard. */
export function useArenaMe() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<{ me: ArenaMe; season: Season | null } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!user) return;
    let live = true;
    fetch("/api/arena/leaderboard?scope=friends&period=week", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { me: ArenaMe; season?: Season }) => { if (live) setData({ me: j.me, season: j.season ?? null }); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [user]);
  return { data, failed };
}

/** Name, avatar and the equipped coin-shop frame. */
export function usePlayer() {
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const [ring, setRing] = useState<string | null>(null);
  useEffect(() => {
    if (!user) return;
    let live = true;
    const load = () => void fetch("/api/coins/shop", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j: { equipped?: string | null } | null) => { if (live) setRing(j?.equipped ? shopItem(j.equipped)?.ring ?? null : null); }).catch(() => {});
    load();
    window.addEventListener("renyxera:frame", load);
    return () => { live = false; window.removeEventListener("renyxera:frame", load); };
  }, [user]);
  const style = profile && isAvatarStyleId(profile.avatar_style) ? profile.avatar_style : "adventurer";
  useAvatarStyles([style]); // styles download on demand; re-render once this one is ready
  const avatar = generateAvatarDataUri(style, profile?.avatar_seed || user?.id || "x", { size: 96 });
  const name = profile?.display_name?.trim() || profile?.username || user?.email?.split("@")[0] || "You";
  return { name, avatar, ring, username: profile?.username ?? null };
}
