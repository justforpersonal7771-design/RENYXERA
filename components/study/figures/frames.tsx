"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { FramesFig } from "@/lib/study/figures";

/**
 * Frames: one operation changing a structure, one picture per step, with Back / Next / Play and the arrow keys.
 * The player does not know how to draw a figure; the caller passes `render` (avoids a circular import with diagram.tsx).
 * Reduced-motion readers get no auto-advance unless they press Play themselves.
 */
export function Frames({ fig, render }: { fig: FramesFig; render: (f: unknown) => ReactNode }) {
  const n = fig.frames.length;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((x) => { if (x >= n - 1) { setPlaying(false); return x; } return x + 1; }), fig.autoplayMs ?? 1600);
    return () => clearInterval(t);
  }, [playing, n, fig.autoplayMs]);
  if (!n) return null;
  const go = (d: number) => { setPlaying(false); setI((x) => Math.min(n - 1, Math.max(0, x + d))); };
  const f = fig.frames[i];
  const btn = "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--text-primary)] disabled:opacity-40 hover:bg-[var(--surface-secondary)]";
  return (
    <div ref={box} tabIndex={0} role="group" aria-label={fig.title ?? "Step by step figure"} className="max-w-full rounded-xl outline-offset-2"
      onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(1); } else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } }}>
      {fig.title && <p className="mb-1 text-xs font-bold text-[var(--text-secondary)]">{fig.title}</p>}
      <div className="min-h-[3rem]" aria-live="polite">{render(f.fig)}</div>
      <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]"><span className="mr-2 rounded-full bg-[var(--st-accent)] px-2 py-0.5 text-xs font-extrabold text-[var(--surface)]">Step {i + 1} of {n}</span>{f.caption}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" className={btn} onClick={() => go(-1)} disabled={i === 0} aria-label="Previous step">← Back</button>
        <button type="button" className={btn} onClick={() => go(1)} disabled={i === n - 1} aria-label="Next step">Next →</button>
        <button type="button" className={btn} onClick={() => { if (i >= n - 1) setI(0); setPlaying((p) => !p); }} aria-pressed={playing}>{playing ? "Pause" : i >= n - 1 ? "Replay" : "Play"}</button>
        <span className="ml-1 flex gap-1" aria-hidden>{fig.frames.map((_, k) => <button key={k} type="button" tabIndex={-1} onClick={() => { setPlaying(false); setI(k); }} className="h-2.5 w-2.5 rounded-full border border-[var(--text-primary)]" style={{ background: k === i ? "var(--st-accent)" : "transparent" }} />)}</span>
      </div>
    </div>
  );
}
