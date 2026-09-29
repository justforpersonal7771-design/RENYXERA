"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import type { BillingMode } from "@/lib/billing/plans";

export type Entitlements = { plan: "free" | "pro"; pro: boolean; validUntil: string | null; mode: BillingMode; loading: boolean };

// One request shared by every component (navbar, avatar, Pro page), refreshed per account
// and at most once a minute.
let cache: { key: string; at: number; p: Promise<Omit<Entitlements, "loading">> } | null = null;
function load(key: string, force = false) {
  if (!force && cache && cache.key === key && Date.now() - cache.at < 60_000) return cache.p;
  const p = fetch("/api/billing/me", { cache: "no-store" })
    .then((r) => r.json())
    .then((j) => ({ plan: j.plan ?? "free", pro: !!j.pro, validUntil: j.validUntil ?? null, mode: j.mode ?? "interest" }))
    .catch(() => ({ plan: "free" as const, pro: false, validUntil: null, mode: "interest" as const }));
  cache = { key, at: Date.now(), p };
  return p;
}

/**
 * 7A: the single client hook for "is this account Pro?". Display only — every gated
 * action is re-checked on the server (getEntitlement), so a tampered client gains nothing.
 */
export function useEntitlements(): Entitlements & { refresh: () => void } {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const [state, setState] = useState<Entitlements>({ plan: "free", pro: false, validUntil: null, mode: "interest", loading: true });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    load(userId ?? "guest", tick > 0).then((e) => { if (alive) setState({ ...e, loading: false }); });
    return () => { alive = false; };
  }, [userId, tick]);
  return { ...state, refresh: () => setTick((t) => t + 1) };
}
