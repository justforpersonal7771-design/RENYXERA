"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, PlayCircle, Sparkles, X } from "lucide-react";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";

const LADDER = [5, 3, 2, 1];
const SECONDS = 20;

/**
 * 7E: "Sponsor break" — a short sponsor message earns a few bonus AI requests for today,
 * fewer each time (+5, +3, +2, +1; 4 a day). The timer runs on screen and on the server:
 * the claim token is only honoured after the break has really lasted SECONDS.
 */
export function SponsorBreakCard() {
  const signedIn = useAuthStore((s) => !!s.user);
  const [bonus, setBonus] = useState<number | null>(null);
  const [used, setUsed] = useState(0);
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(SECONDS);
  const [token, setToken] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const sb = createClient();
      const [{ data: b }, { data: u }] = await Promise.all([sb.rpc("my_ai_bonus"), sb.rpc("my_sponsor_breaks_today")]);
      setBonus(Number(b) || 0); setUsed(Number(u) || 0);
    } catch { setBonus(0); }
  }, []);
  useEffect(() => { if (signedIn) void refresh(); }, [signedIn, refresh]);

  // Countdown only while the tab is visible.
  useEffect(() => {
    if (!open || !token || left <= 0) return;
    const t = setInterval(() => { if (!document.hidden) setLeft((n) => n - 1); }, 1000);
    return () => clearInterval(t);
  }, [open, token, left]);

  const claim = useCallback(async () => {
    if (!token || claiming) return;
    setClaiming(true);
    try {
      const r = await fetch("/api/rewards/sponsor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "claim", token }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Couldn't add credits.");
      useToastStore.getState().show(`+${j.credits} AI requests added for today. Thanks for supporting RENYXERA!`, "success");
      setOpen(false); setToken(null); void refresh();
    } catch (e) {
      useToastStore.getState().show((e as Error).message, "error");
    } finally { setClaiming(false); }
  }, [token, claiming, refresh]);
  useEffect(() => { if (open && token && left <= 0) void claim(); }, [open, token, left, claim]);

  const start = async () => {
    try {
      const r = await fetch("/api/rewards/sponsor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "start" }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Couldn't start the break.");
      setToken(j.token); setLeft(j.seconds ?? SECONDS); setOpen(true);
    } catch (e) { useToastStore.getState().show((e as Error).message, "error"); }
  };

  if (!signedIn) return null;
  const next = LADDER[used];
  return (
    <section className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-[var(--surface)] to-sky-500/5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 text-white grid place-items-center shadow-md"><Sparkles className="w-5 h-5" /></span>
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Out of AI requests? Take a sponsor break</h2>
            <p className="text-sm text-[var(--text-secondary)]">A {SECONDS}-second sponsor message adds bonus AI requests for today: +5, then +3, +2, +1 — up to 4 a day.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-right"><span className="block text-2xl font-extrabold font-num text-[var(--text-primary)]">{bonus ?? "—"}</span><span className="text-[11px] text-[var(--text-muted)]">bonus requests</span></p>
          <button type="button" onClick={start} disabled={!next} className="h-11 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-sky-600 text-white font-bold shadow-md shadow-violet-500/25 disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer">
            <PlayCircle className="w-4 h-4" /> {next ? `Watch · +${next} AI` : "Done for today"}
          </button>
        </div>
      </div>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-[90] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
              <motion.div role="dialog" aria-modal="true" aria-label="Sponsor break" className="relative w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl"
                initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[var(--text-primary)]">Sponsor break · +{next} AI requests</p>
                  <button type="button" onClick={() => { setOpen(false); setToken(null); }} aria-label="Close without reward" className="p-1.5 rounded-lg hover:bg-[var(--surface-secondary)] cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <SponsorSlot context="ai study tools" seed={used + 7} />
                <div className="mt-2 h-2 rounded-full bg-[var(--surface-secondary)] overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-sky-500 transition-[width] duration-1000 ease-linear" style={{ width: `${((SECONDS - Math.max(0, left)) / SECONDS) * 100}%` }} /></div>
                <p className="mt-2 text-center text-xs font-semibold text-[var(--text-secondary)] inline-flex w-full justify-center items-center gap-2">
                  {claiming ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding your credits…</> : left > 0 ? `Your credits unlock in ${left}s — keep this tab open` : "Unlocking…"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>, document.body)}
    </section>
  );
}
