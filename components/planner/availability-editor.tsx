"use client";

import { Plus, X } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";
import { DatePicker } from "@/components/ui/date-picker";
import type { Availability, Win } from "@/lib/planner/generate";
import { weeklyMinutes, windowMinutes, cleanWindows } from "@/lib/planner/generate";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const fmtH = (m: number) => `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}`;
const addHours = (t: string, h: number) => { const [hh, mm] = t.split(":").map(Number); const m = Math.min(23 * 60 + 45, hh * 60 + mm + h * 60); return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };

/** The free windows of one day: add as many as you like (08:00–09:00, 14:00–17:00, 21:00–22:00 ...). */
export function WindowsEditor({ value, onChange }: { value: Win[]; onChange: (w: Win[]) => void }) {
  const set = (i: number, patch: Partial<Win>) => onChange(value.map((w, k) => (k === i ? { ...w, ...patch } : w)));
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {value.map((w, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <TimePicker value={w.start} onChange={(v) => set(i, { start: v })} step={15} className="w-28" />
          <span className="text-xs text-[var(--text-muted)]">to</span>
          <TimePicker value={w.end} onChange={(v) => set(i, { end: v })} step={15} className="w-28" />
          <button type="button" aria-label="Remove this time" onClick={() => onChange(value.filter((_, k) => k !== i))} className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-muted)] hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
        </div>
      ))}
      <button type="button" onClick={() => { const last = value[value.length - 1]; const start = last ? addHours(last.end, 1) : "18:00"; onChange([...value, { start, end: addHours(start, 1) }]); }} className="inline-flex h-8 items-center gap-1 rounded-lg border border-dashed border-[var(--border)] px-2.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-500/5 cursor-pointer"><Plus className="h-3.5 w-3.5" /> Add a time</button>
    </div>
  );
}

const PRESETS: { label: string; build: () => Availability["weekly"] }[] = [
  { label: "One block every day", build: () => Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((d) => [d, [{ start: "06:00", end: "10:00" }]])) },
  { label: "Morning + evening", build: () => Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((d) => [d, [{ start: "06:00", end: "08:00" }, { start: "19:00", end: "22:00" }]])) },
  { label: "Weekday evenings, full weekends", build: () => Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((d) => [d, d === 0 || d === 6 ? [{ start: "08:00", end: "12:00" }, { start: "14:00", end: "18:00" }] : [{ start: "19:00", end: "22:00" }]])) },
];

/** When are you free, each weekday? Any number of times per day; leave a day empty for a rest day. */
export function AvailabilityEditor({ value, onChange }: { value: Availability; onChange: (a: Availability) => void }) {
  const setDay = (d: number, ws: Win[]) => onChange({ ...value, weekly: { ...value.weekly, [d]: ws } });
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[var(--text-secondary)]">Quick start:</span>
        {PRESETS.map((p) => <button key={p.label} type="button" onClick={() => onChange({ ...value, weekly: p.build() })} className="h-8 rounded-full border border-[var(--border)] px-3 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">{p.label}</button>)}
      </div>
      <ul className="divide-y divide-[var(--border-subtle)] rounded-xl border border-[var(--border)]">
        {[1, 2, 3, 4, 5, 6, 0].map((d) => {
          const ws = value.weekly[d] ?? [];
          const mins = windowMinutes(cleanWindows(ws));
          return (
            <li key={d} className="flex flex-wrap items-start gap-x-4 gap-y-2 px-3 py-2.5">
              <span className="w-24 shrink-0 pt-1.5 text-sm font-bold text-[var(--text-primary)]">{DAYS[d]}<span className="block text-[11px] font-normal text-[var(--text-muted)]">{ws.length ? fmtH(mins) : "Rest day"}</span></span>
              <div className="min-w-0 flex-1"><WindowsEditor value={ws} onChange={(w) => setDay(d, w)} /></div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-[var(--text-muted)]">About {fmtH(weeklyMinutes(value))} a week. Each task is placed inside these times, and split across them when it needs more room.</p>
    </div>
  );
}

/** Changes for single dates ("tomorrow I'm only free 6 to 8 pm", "Sunday is off"). */
export function DayOverridesEditor({ value, onChange, min }: { value: Availability["overrides"]; onChange: (o: Availability["overrides"]) => void; min?: string }) {
  const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
  const set = (date: string, v: Win[] | null) => onChange({ ...value, [date]: v });
  const rename = (from: string, to: string) => { const next = { ...value }; const v = next[from]; delete next[from]; next[to] = v; onChange(next); };
  const addDate = () => { let d = min ?? new Date().toISOString().slice(0, 10); while (d in value) { const t = new Date(`${d}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + 1); d = t.toISOString().slice(0, 10); } set(d, [{ start: "18:00", end: "20:00" }]); };
  return (
    <div className="space-y-2">
      {entries.length === 0 && <p className="text-xs text-[var(--text-muted)]">No special days. Add one when your day is different.</p>}
      {entries.map(([date, ws]) => (
        <div key={date} className="flex flex-wrap items-start gap-x-3 gap-y-2 rounded-xl border border-[var(--border)] p-2.5">
          <div className="w-40 shrink-0"><DatePicker value={date} onChange={(v) => v && v !== date && rename(date, v)} min={min} compact /></div>
          <div className="min-w-0 flex-1">
            {ws === null ? <p className="pt-1.5 text-sm font-semibold text-[var(--text-secondary)]">Day off: nothing is planned.</p> : <WindowsEditor value={ws} onChange={(w) => set(date, w)} />}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => set(date, ws === null ? [{ start: "18:00", end: "20:00" }] : null)} className="h-8 rounded-lg border border-[var(--border)] px-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">{ws === null ? "I'm free" : "Day off"}</button>
            <button type="button" aria-label="Remove this day" onClick={() => { const n = { ...value }; delete n[date]; onChange(n); }} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"><X className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addDate} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-[var(--border)] px-3 text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-500/5 cursor-pointer"><Plus className="h-3.5 w-3.5" /> Change a specific day</button>
    </div>
  );
}
