"use client";

import { useEffect, useState } from "react";
import { Pause, Play, Timer } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

const KEY = "renyxera.study-timer";
const GOAL_MIN = 120;
type Saved = { days: Record<string, number>; since: number | null };

const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const load = (): Saved => { try { return JSON.parse(localStorage.getItem(KEY) || "") as Saved; } catch { return { days: {}, since: null }; } };
const save = (s: Saved) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ } };
const fmt = (sec: number) => `${Math.floor(sec / 3600)}h ${String(Math.floor((sec % 3600) / 60)).padStart(2, "0")}m`;

/** Manual study timer with a daily goal. Time is counted on this device; the running session survives reloads. */
export function StudyTimer() {
  const user = useAuthStore((s) => s.user);
  const [state, setState] = useState<Saved>({ days: {}, since: null });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => { setState(load()); }, []);
  useEffect(() => {
    if (state.since == null) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [state.since]);

  if (!user) return null;
  const running = state.since != null;
  const live = running ? Math.max(0, Math.floor((now - (state.since as number)) / 1000)) : 0;
  const today = (state.days[dayKey()] ?? 0) + live;
  let week = 0;
  for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); week += state.days[dayKey(d)] ?? 0; }
  week += live;
  const pct = Math.min(100, Math.round((today / (GOAL_MIN * 60)) * 100));

  const toggle = () => {
    const t = Date.now();
    const next: Saved = running
      ? { days: { ...state.days, [dayKey()]: (state.days[dayKey()] ?? 0) + Math.floor((t - (state.since as number)) / 1000) }, since: null }
      : { ...state, since: t };
    setState(next); setNow(t); save(next);
  };

  return (
    <section aria-label="Study timer" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400"><Timer className="h-3.5 w-3.5" aria-hidden /> Study timer</p>
          <p className="mt-1 text-2xl font-extrabold font-num text-[var(--text-primary)]">{fmt(today)} <span className="text-sm font-semibold text-[var(--text-muted)]">of {GOAL_MIN / 60}h goal</span></p>
          <p className="text-xs text-[var(--text-muted)]">This week: {fmt(week)}</p>
        </div>
        <button type="button" onClick={toggle} aria-label={running ? "Pause study timer" : "Start study timer"}
          className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-bold text-white cursor-pointer ${running ? "bg-amber-500" : "bg-gradient-to-r from-indigo-600 to-violet-600"}`}>
          {running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4 fill-current" /> Start</>}
        </button>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Daily goal progress">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}
