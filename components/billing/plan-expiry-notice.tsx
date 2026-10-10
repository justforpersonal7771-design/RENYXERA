"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hourglass, X } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useAuthStore } from "@/store/use-auth-store";
import { serverDayKey, serverNow } from "@/lib/time/server-time";

const UNTIL_KEY = "renyxera.plan-until";   // last paid plan: { tier, until }
const DISMISS_KEY = "renyxera.expiry-dismissed"; // day key the notice was dismissed on
const WARN_DAYS = 7;
const DAY = 86400_000;

const read = <T,>(k: string): T | null => { try { return JSON.parse(localStorage.getItem(k) || "null") as T | null; } catch { return null; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
const fmt = (ms: number) => new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/**
 * A gentle heads-up before a paid plan ends (7 days out, then daily until it does), and a one-line note for
 * 30 days after it has ended. Uses the server clock; dismissing hides it for the rest of the day only.
 */
export function PlanExpiryNotice() {
  const user = useAuthStore((s) => s.user);
  const ent = useEntitlements();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => { setDismissed(read<string>(DISMISS_KEY) === serverDayKey()); }, []);
  useEffect(() => { if (ent.paid && ent.validUntil) write(UNTIL_KEY, { tier: ent.tier, until: Date.parse(ent.validUntil) }); }, [ent.paid, ent.validUntil, ent.tier]);

  if (!user || ent.loading || dismissed) return null;
  const now = serverNow();
  let text: string | null = null;
  let urgent = false;
  if (ent.paid && ent.validUntil) {
    const left = Date.parse(ent.validUntil) - now;
    if (left > WARN_DAYS * DAY) return null;
    const days = Math.max(0, Math.ceil(left / DAY));
    urgent = days <= 2;
    text = `Your ${ent.tier === "pro" ? "Pro" : "Plus"} plan ${days <= 1 ? "ends today or tomorrow" : `ends in ${days} days`} (${fmt(Date.parse(ent.validUntil))}). Renew to keep your AI requests, analytics and downloads.`;
  } else if (!ent.paid) {
    const last = read<{ tier: string; until: number }>(UNTIL_KEY);
    if (!last || last.until > now || now - last.until > 30 * DAY) return null;
    text = `Your ${last.tier === "pro" ? "Pro" : "Plus"} plan ended on ${fmt(last.until)}. Renew to get your AI requests, analytics and downloads back.`;
    urgent = true;
  }
  if (!text) return null;
  return (
    <div role="status" className={`mb-4 flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm ${urgent ? "border-amber-500/50 bg-amber-500/10" : "border-violet-500/30 bg-violet-500/5"}`}>
      <Hourglass className={`h-4 w-4 shrink-0 ${urgent ? "text-amber-600 dark:text-amber-400" : "text-violet-500"}`} aria-hidden />
      <p className="min-w-0 flex-1 text-[var(--text-primary)]">{text}</p>
      <Link href="/pro" className="shrink-0 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-bold text-white">Renew</Link>
      <button type="button" aria-label="Dismiss for today" onClick={() => { write(DISMISS_KEY, serverDayKey()); setDismissed(true); }} className="shrink-0 rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"><X className="h-4 w-4" /></button>
    </div>
  );
}
