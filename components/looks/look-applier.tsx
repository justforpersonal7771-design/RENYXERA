"use client";

/**
 * Puts the chosen Look on <html> (data-look), ends trials when their 5 minutes are up, sends a student back to Classic if their plan no longer
 * includes the Look they had, and shows the small "Trying <Look>" chip while a trial runs. The first paint is handled by the script in app/layout.tsx.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { canUseLook, lookById } from "@/lib/looks/looks";
import { effectiveLookId, useLookStore } from "@/store/use-look-store";

export function LookApplier() {
  const { tier, loading } = useEntitlements();
  const { look, trial, hydrated, load, setLook, endTrial } = useLookStore();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!trial) return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [trial]);

  // trial over
  useEffect(() => { if (trial && trial.endsAt <= now) endTrial(false); }, [trial, now, endTrial]);
  // plan check (waits until the plan is known, so a slow load never kicks anyone back to Classic)
  useEffect(() => { if (hydrated && !loading && !trial && !canUseLook(lookById(look), tier)) setLook("classic"); }, [hydrated, loading, trial, look, tier, setLook]);

  const id = effectiveLookId({ look, trial, tried: [] }, now);
  useEffect(() => {
    const root = document.documentElement;
    if (!hydrated) return;
    if (id === "classic") root.removeAttribute("data-look"); else root.setAttribute("data-look", id);
  }, [id, hydrated]);

  if (!trial || trial.endsAt <= now) return null;
  const left = Math.max(0, Math.ceil((trial.endsAt - now) / 1000)), mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, "0");
  return (
    <div role="status" aria-live="polite" className="fixed bottom-20 left-3 z-[330] flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text-primary)] shadow-lg lg:bottom-4">
      <Sparkles className="h-4 w-4 text-[var(--tint-peri-ink)]" aria-hidden />
      <span className="font-bold">Trying {lookById(trial.id).name}</span>
      <span className="font-num tabular-nums text-[var(--text-secondary)]">{mm}:{ss}</span>
      <Link href="/pro" className="pill-ink !px-3 !py-1 text-xs">Get it</Link>
      <button type="button" onClick={() => endTrial(false)} className="pill-soft cursor-pointer !px-3 !py-1 text-xs">Switch back</button>
    </div>
  );
}
