"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import type { BillingMode } from "@/lib/billing/plans";

export type Entitlements = { plan: "free" | "pro"; pro: boolean; validUntil: string | null; mode: BillingMode; loading: boolean };

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
    fetch("/api/billing/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => { if (alive) setState({ plan: j.plan ?? "free", pro: !!j.pro, validUntil: j.validUntil ?? null, mode: j.mode ?? "interest", loading: false }); })
      .catch(() => { if (alive) setState((s) => ({ ...s, loading: false })); });
    return () => { alive = false; };
  }, [userId, tick]);
  return { ...state, refresh: () => setTick((t) => t + 1) };
}
