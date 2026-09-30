"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import type { BillingMode, Tier } from "@/lib/billing/plans";

export type Entitlements = { tier: Tier; plan: Tier; pro: boolean; paid: boolean; validUntil: string | null; upgradeCreditPaise: number; mode: BillingMode; loading: boolean };
type Resolved = Omit<Entitlements, "loading">;

// Runs before paint on the client, but never on the server (no SSR warning).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const STORE = "renyxera:tier:";

// One shared source for every component (navbar, avatar, profile, Plans page): a fresh
// result is broadcast to all mounted hooks, so a purchase updates the whole screen at once.
// The last value is also kept on this device per account, so a paid member's look is
// applied before the first paint instead of flashing the Free look. Display only.
let last: { key: string; v: Resolved } | null = null;
let cache: { key: string; at: number; p: Promise<Resolved> } | null = null;
const listeners = new Set<(key: string, v: Resolved) => void>();

function remembered(key: string): Resolved | null {
  if (last?.key === key) return last.v;
  try { const raw = localStorage.getItem(STORE + key); return raw ? (JSON.parse(raw) as Resolved) : null; } catch { return null; }
}

function load(key: string, force = false) {
  if (!force && cache && cache.key === key && Date.now() - cache.at < 60_000) return cache.p;
  const p = fetch("/api/billing/me", { cache: "no-store" })
    .then((r) => r.json())
    .then((j): Resolved => { const tier: Tier = j.tier === "pro" || j.tier === "plus" ? j.tier : "free"; return { tier, plan: tier, pro: tier === "pro", paid: tier !== "free", validUntil: j.validUntil ?? null, upgradeCreditPaise: Number(j.upgradeCreditPaise) || 0, mode: j.mode ?? "interest" }; })
    .catch((): Resolved => ({ tier: "free", plan: "free", pro: false, paid: false, validUntil: null, upgradeCreditPaise: 0, mode: "interest" }));
  p.then((v) => {
    last = { key, v };
    try { localStorage.setItem(STORE + key, JSON.stringify(v)); if (key !== "guest") localStorage.setItem(STORE + "last", JSON.stringify(v)); else localStorage.removeItem(STORE + "last"); } catch {}
    listeners.forEach((fn) => fn(key, v));
  });
  cache = { key, at: Date.now(), p };
  return p;
}

/**
 * After a payment: the plan is granted by the Razorpay webhook a few seconds later, so ask
 * again every 2 s (up to ~40 s) until the account shows `tier`, updating every screen.
 */
export async function waitForTier(key: string, tier: Tier) {
  for (let i = 0; i < 20; i++) {
    const v = await load(key, true);
    if (v.tier === tier) return true;
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

const LOADING: Entitlements = { tier: "free", plan: "free", pro: false, paid: false, validUntil: null, upgradeCreditPaise: 0, mode: "interest", loading: true };

/**
 * 7A: the single client hook for "is this account Pro?". Display only — every gated
 * action is re-checked on the server (getEntitlement), so a tampered client gains nothing.
 */
export function useEntitlements(): Entitlements & { refresh: () => void; accountKey: string } {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const authLoading = useAuthStore((s) => s.loading);
  // While the session is still being restored, assume the account last seen on this device.
  const key = userId ?? (authLoading ? "last" : "guest");
  const [state, setState] = useState<Entitlements>(LOADING);
  // Before paint: apply what this device last knew for this account.
  useIsoLayoutEffect(() => {
    const r = remembered(key);
    setState(r ? { ...r, loading: false } : LOADING);
  }, [key]);
  useEffect(() => {
    if (key === "last") return;
    const on = (k: string, v: Resolved) => { if (k === key) setState({ ...v, loading: false }); };
    listeners.add(on);
    void load(key);
    return () => { listeners.delete(on); };
  }, [key]);
  return { ...state, accountKey: key, refresh: () => { if (key !== "last") void load(key, true); } };
}
