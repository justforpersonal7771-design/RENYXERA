"use client";

/**
 * Study time for Analytics: hours the student spent reading (Focus mode and the Study timer), counted on this device.
 * Today, the last seven days, the busiest subjects, and a small bar for each day. Nothing is estimated.
 */
import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { EMPTY_STUDY_TIME, STUDY_TIME_EVENT, fmtHM, lastDays, loadStudyTime, type StudyTime } from "@/lib/study/study-time";

export function StudyTimeCard() {
  const [s, setS] = useState<StudyTime>(EMPTY_STUDY_TIME);
  useEffect(() => {
    const r = () => setS(loadStudyTime());
    r(); window.addEventListener(STUDY_TIME_EVENT, r); window.addEventListener("storage", r);
    return () => { window.removeEventListener(STUDY_TIME_EVENT, r); window.removeEventListener("storage", r); };
  }, []);
  const days = lastDays(s, 7);
  const week = days.reduce((a, d) => a + d.secs, 0), today = days[days.length - 1].secs, max = Math.max(1, ...days.map((d) => d.secs));
  const subjects = new Map<string, number>();
  for (const d of days) for (const [l, v] of Object.entries(s.bySubject[d.key] ?? {})) subjects.set(l, (subjects.get(l) ?? 0) + v);
  const top = [...subjects.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const total = Object.values(s.days).reduce((a, b) => a + b, 0);
  return (
    <section aria-label="Study time" data-tint="peach" className="card-pastel p-4 sm:p-5">
      <p className="inline-flex items-center gap-1.5 text-xs font-black text-[var(--tint-ink)]"><Timer className="h-3.5 w-3.5" aria-hidden /> Study time · reading and Focus mode</p>
      <div className="mt-2 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
        <div className="flex gap-6">
          <div><p className="font-num text-2xl font-extrabold tabular-nums text-[var(--text-primary)]">{fmtHM(today)}</p><p className="text-xs font-bold text-[var(--text-secondary)]">today</p></div>
          <div><p className="font-num text-2xl font-extrabold tabular-nums text-[var(--text-primary)]">{fmtHM(week)}</p><p className="text-xs font-bold text-[var(--text-secondary)]">last 7 days</p></div>
          <div><p className="font-num text-2xl font-extrabold tabular-nums text-[var(--text-primary)]">{fmtHM(total)}</p><p className="text-xs font-bold text-[var(--text-secondary)]">all time</p></div>
        </div>
        <ol className="flex h-16 items-end gap-2" aria-label="Study time per day, last 7 days">
          {days.map((d) => (
            <li key={d.key} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${d.label}: ${fmtHM(d.secs)}`}>
              <span className="w-full rounded-t-md" style={{ height: `${Math.max(3, Math.round((d.secs / max) * 44))}px`, background: d.today ? "var(--tint-ink)" : "color-mix(in srgb, var(--tint-ink) 45%, transparent)" }} />
              <span className={`text-[10px] font-bold ${d.today ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>{d.label}</span>
            </li>
          ))}
        </ol>
      </div>
      {top.length > 0 && <ul className="mt-3 flex flex-wrap gap-2" aria-label="Time by subject, last 7 days">{top.map(([l, v]) => <li key={l} className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)]">{l}: <span className="font-num font-bold text-[var(--text-primary)]">{fmtHM(v)}</span></li>)}</ul>}
      {total === 0 && <p className="mt-3 text-xs text-[var(--text-secondary)]">Open any lesson and press Focus: the time you spend reading is counted here.</p>}
    </section>
  );
}
