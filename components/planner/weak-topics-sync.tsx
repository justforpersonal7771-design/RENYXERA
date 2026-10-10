"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { hasJoinedChannel, useTelegramState } from "@/components/growth/use-telegram-state";
import { serverDayKey } from "@/lib/time/server-time";

const KEY = "renyxera.weak-synced";

/**
 * Pro members with Telegram linked: once a day, sends the weakest topics (from analytics on this device) to the server
 * so the Wednesday nudge can name them. Runs on the dashboard, where analytics are already loaded.
 */
export function WeakTopicsSync({ topics }: { topics: { topic: string; attempted: number; correct: number }[] }) {
  const user = useAuthStore((s) => s.user);
  const tier = useEntitlements().tier;
  const tg = useTelegramState();
  void hasJoinedChannel;
  useEffect(() => {
    if (!user || tier !== "pro" || !tg.linked || topics.length === 0) return;
    try { if (localStorage.getItem(KEY) === serverDayKey()) return; } catch { /* sync anyway */ }
    void fetch("/api/telegram/weak-topics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topics: topics.map((t) => ({ topic: t.topic, attempted: t.attempted, correct: t.correct })).slice(0, 200) }) })
      .then((r) => { if (r.ok) try { localStorage.setItem(KEY, serverDayKey()); } catch { /* ignore */ } }).catch(() => null);
  }, [user, tier, tg.linked, topics]);
  return null;
}
