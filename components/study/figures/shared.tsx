"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Tone } from "@/lib/study/figures";

/** Fill and outline for a part by tone. Colours come from tokens (and two fixed semantic hues), so light and dark both work. */
export function toneStyle(t?: Tone): CSSProperties {
  if (t === "hl") return { fill: "color-mix(in srgb, var(--st-accent) 18%, var(--surface))", stroke: "var(--st-accent)", background: "color-mix(in srgb, var(--st-accent) 18%, var(--surface))", borderColor: "var(--st-accent)" };
  if (t === "ok") return { fill: "color-mix(in srgb, #16a34a 18%, var(--surface))", stroke: "#16a34a", background: "color-mix(in srgb, #16a34a 18%, var(--surface))", borderColor: "#16a34a" };
  if (t === "bad") return { fill: "color-mix(in srgb, #dc2626 16%, var(--surface))", stroke: "#dc2626", background: "color-mix(in srgb, #dc2626 16%, var(--surface))", borderColor: "#dc2626" };
  if (t === "dim") return { fill: "var(--surface-secondary)", stroke: "var(--border)", background: "var(--surface-secondary)", borderColor: "var(--border)", opacity: 0.75 };
  return { fill: "var(--surface)", stroke: "var(--text-primary)", background: "var(--surface)", borderColor: "var(--text-primary)" };
}

export const INK = "var(--text-primary)";
export const SUB = "var(--text-secondary)";
export const MUTED = "var(--text-muted)";

/** Arrow-head marker; give each figure its own id prefix (useId) so two figures on a page never share one. */
export function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={`${id}-n`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--text-primary)" /></marker>
      <marker id={`${id}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--st-accent)" /></marker>
    </defs>
  );
}

/** The figure frame: optional title above, the drawing, then the one-line note that says what to look at. */
export function FigFrame({ title, note, children, label }: { title?: string; note?: string; children: ReactNode; label: string }) {
  return (
    <figure className="m-0 min-w-0 max-w-full" aria-label={label}>
      {title && <figcaption className="mx-auto mb-3 w-fit max-w-full overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-1.5 font-mono text-[0.95rem] font-semibold text-[var(--text-primary)]">{title}</figcaption>}
      {children}
      {note && <p className="mt-1 text-xs text-[var(--text-secondary)]">{note}</p>}
    </figure>
  );
}

export const fmt = (v: string | number, hex = false) => (typeof v === "number" && hex ? "0x" + v.toString(16).toUpperCase() : String(v));
