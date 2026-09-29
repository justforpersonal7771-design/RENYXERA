"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import type { BillingMode, Tier } from "@/lib/billing/plans";

export type Entitlements = { tier: Tier; plan: Tier; pro: boolean; paid: boolean; validUntil: string | null; upgradeCreditPaise: number; mode: BillingMode; loading: boolean };

// One request shared by every component (navbar, avatar, Pro page), refreshed per account
// and at most once a minute.
// Last resolved value, so a remounting navbar starts in the right tier (no purple flash).
let last: Omit<Entitlements, "loading"> | null = null;
let cache: { key: string; at: number; p: Promise<Omit<Entitlements, "loading">> } | null = null;
function load(key: string, force = false) {
  if (!force && cache && cache.key === key && Date.now() - cache.at < 60_000) return cache.p;
  const p = fetch("/api/billing/me", { cache: "no-store" })
    .then((r) => r.json())
    .then((j) => { const tier: Tier = j.tier === "pro" || j.tier === "plus" ? j.tier : "free"; return { tier, plan: tier, pro: tier === "pro", paid: tier !== "free", validUntil: j.validUntil ?? null, upgradeCreditPaise: Number(j.upgradeCreditPaise) || 0, mode: j.mode ?? "interest" }; })
    .catch(() => ({ tier: "free" as Tier, plan: "free" as Tier, pro: false, paid: false, validUntil: null, upgradeCreditPaise: 0, mode: "interest" as BillingMode }));
  p.then((v) => { last = v; });
  cache = { key, at: Date.now(), p };
  return p;
}

/**
 * 7A: the single client hook for "is this account Pro?". Display only — every gated
 * action is re-checked on the server (getEntitlement), so a tampered client gains nothing.
 */
export function useEntitlements(): Entitlements & { refresh: () => void } {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const [state, setState] = useState<Entitlements>(() => (last ? { ...last, loading: false } : { tier: "free", plan: "free", pro: false, paid: false, validUntil: null, upgradeCreditPaise: 0, mode: "interest", loading: true }));
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    load(userId ?? "guest", tick > 0).then((e) => { if (alive) setState({ ...e, loading: false }); });
    return () => { alive = false; };
  }, [userId, tick]);
  return { ...state, refresh: () => setTick((t) => t + 1) };
}
