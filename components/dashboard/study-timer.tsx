"use client";

import { useCallback, useEffect, useState } from "react";
import { Pause, Play, Timer } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { serverDate, serverNow } from "@/lib/time/server-time";
import { START_TIMER_EVENT } from "@/components/planner/today-blocks-card";

const KEY = "renyxera.study-timer";
const GOAL_MIN = 120;
type Saved = { days: Record<string, number>; since: number | null; label: string | null; bySubject: Record<string, Record<string, number>> };
const EMPTY: Saved = { days: {}, since: null, label: null, bySubject: {} };

const dayKey = (d = serverDate()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const load = (): Saved => { try { return { ...EMPTY, ...(JSON.parse(localStorage.getItem(KEY) || "") as Partial<Saved>) }; } catch { return EMPTY; } };
const save = (s: Saved) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ } };
const fmt = (sec: number) => `${Math.floor(sec / 3600)}h ${String(Math.floor((sec % 3600) / 60)).padStart(2, "0")}m`;

/** Folds the running session into today's total (and into its subject, if it has one) and stops it. */
function stopped(s: Saved, at: number): Saved {
  if (s.since == null) return s;
  const secs = Math.max(0, Math.floor((at - s.since) / 1000)), k = dayKey();
  const subj = s.label ? { ...s.bySubject, [k]: { ...(s.bySubject[k] ?? {}), [s.label]: (s.bySubject[k]?.[s.label] ?? 0) + secs } } : s.bySubject;
  return { days: { ...s.days, [k]: (s.days[k] ?? 0) + secs }, since: null, label: null, bySubject: subj };
}

/** Study timer with a daily goal. Starting it from a planner block labels the session with that subject. Time is counted on this device and survives reloads. */
export function StudyTimer() {
  const user = useAuthStore((s) => s.user);
  const [state, setState] = useState<Saved>(EMPTY);
  const [now, setNow] = useState(() => serverNow());

  useEffect(() => { setState(load()); }, []);
  useEffect(() => {
    if (state.since == null) return;
    const t = setInterval(() => setNow(serverNow()), 1000);
    return () => clearInterval(t);
  }, [state.since]);

  const startLabelled = useCallback((e: Event) => {
    const label = (e as CustomEvent<{ label?: string }>).detail?.label ?? null;
    setState((cur) => { const t = serverNow(); const next = { ...stopped(cur, t), since: t, label }; save(next); setNow(t); return next; });
  }, []);
  useEffect(() => { window.addEventListener(START_TIMER_EVENT, startLabelled); return () => window.removeEventListener(START_TIMER_EVENT, startLabelled); }, [startLabelled]);

  if (!user) return null;
  const running = state.since != null;
  const live = running ? Math.max(0, Math.floor((now - (state.since as number)) / 1000)) : 0;
  const today = (state.days[dayKey()] ?? 0) + live;
  let week = 0;
  const subjects = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const d = serverDate(); d.setDate(d.getDate() - i);
    week += state.days[dayKey(d)] ?? 0;
    for (const [l, s] of Object.entries(state.bySubject[dayKey(d)] ?? {})) subjects.set(l, (subjects.get(l) ?? 0) + s);
  }
  week += live;
  if (running && state.label) subjects.set(state.label, (subjects.get(state.label) ?? 0) + live);
  const top = [...subjects.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const pct = Math.min(100, Math.round((today / (GOAL_MIN * 60)) * 100));

  const toggle = () => {
    const t = serverNow();
    const next: Saved = running ? stopped(state, t) : { ...state, since: t, label: null };
    setState(next); setNow(t); save(next);
  };

  return (
    <section aria-label="Study timer" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400"><Timer className="h-3.5 w-3.5" aria-hidden /> Study timer{running && state.label ? ` · ${state.label}` : ""}</p>
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
      {top.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Time by subject this week">
          {top.map(([l, s]) => <li key={l} className="rounded-full bg-[var(--surface-secondary)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)]">{l}: <span className="font-num font-bold text-[var(--text-primary)]">{fmt(s)}</span></li>)}
        </ul>
      )}
    </section>
  );
}
