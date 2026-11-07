/**
 * Adaptive subject radar: decides which axes to draw from whatever subjects a branch has (CS, EC, EE, ME, Civil and DA differ in
 * count and in name length), so the chart never depends on there being exactly six.
 *
 * Rules, in order:
 *  1. Subjects with no attempts still appear (hollow, "no data") while there are at most `maxAxes` of them, so the shape stays
 *     comparable from week to week; beyond `maxAxes` the most-practised ones keep their own axis and the rest merge into "Others".
 *  2. A radar needs at least three subjects with real data to read as a shape. With one or two it becomes bars; with none, an empty state.
 *  3. An axis with fewer than `minAttempts` answers is drawn but flagged unreliable (lighter marker), never hidden.
 *  4. Long names get a short label (known abbreviations first, then initials); the full name is always kept for tooltips and screen readers.
 * Pure functions only: no React, no DOM, so scripts/check-radar.mts can test them.
 */

export interface RadarInput { subject: string; attempted: number; correct: number }
export interface RadarAxis {
  key: string;
  /** Full display name (parentheses removed). */
  label: string;
  /** Short label for the chart. */
  short: string;
  /** Accuracy 0..100, 0 when there is no data. */
  value: number;
  attempted: number;
  /** Has at least one attempt. */
  hasData: boolean;
  /** Has enough attempts (>= minAttempts) for the value to mean something. */
  reliable: boolean;
  /** Names merged into this axis (only for "Others"). */
  merged?: string[];
}
export type RadarMode = "radar" | "bars" | "empty";
export interface RadarModel {
  mode: RadarMode;
  axes: RadarAxis[];
  target: number;
  /** Weighted accuracy over all attempts, 0..100 (0 when none). */
  average: number;
  weakest: RadarAxis | null;
  strongest: RadarAxis | null;
}
export interface RadarOptions { maxAxes?: number; minAttempts?: number; target?: number }

const SMALL = new Set(["of", "and", "the", "in", "to", "for", "a", "an", "&"]);
const KNOWN: [RegExp, string][] = [
  [/^operating systems?$/i, "OS"],
  [/^computer organi[sz]ation( and architecture)?$/i, "COA"],
  [/^theory of computation$/i, "TOC"],
  [/^(database management systems?|databases?)$/i, "DBMS"],
  [/^computer networks?$/i, "CN"],
  [/^data structures?( and algorithms?)?$/i, "DS"],
  [/^algorithms?$/i, "Algo"],
  [/^programming( and data structures)?$/i, "PDS"],
  [/^digital logic$/i, "DL"],
  [/^discrete mathematics$/i, "DM"],
  [/^engineering mathematics$/i, "EM"],
  [/^general aptitude$/i, "GA"],
  [/^compiler design$/i, "CD"],
  [/^signals? and systems?$/i, "S&S"],
  [/^control systems?$/i, "Control"],
  [/^electromagnetics?$/i, "EMag"],
];

/** Removes "(...)" notes and extra spaces. */
export const cleanName = (s: string) => s.replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim();

/** Short chart label: known abbreviation, else the name itself when short, else initials of the main words. */
export function shortLabel(name: string, maxChars = 11): string {
  const n = cleanName(name);
  for (const [re, abbr] of KNOWN) if (re.test(n)) return abbr;
  if (n.length <= maxChars) return n;
  const words = n.split(" ").filter((w) => w && !SMALL.has(w.toLowerCase()));
  if (words.length >= 2) return words.map((w) => w[0].toUpperCase()).join("").slice(0, 4);
  return n.slice(0, maxChars - 1) + "…";
}

const pct = (c: number, a: number) => (a > 0 ? Math.round((c / a) * 100) : 0);

export function buildRadar(input: RadarInput[], opts: RadarOptions = {}): RadarModel {
  const maxAxes = Math.max(3, opts.maxAxes ?? 8);
  const minAttempts = opts.minAttempts ?? 5;
  const target = opts.target ?? 70;

  // merge duplicates by cleaned name, keep first-seen order (the syllabus order the data arrives in)
  const order: string[] = [];
  const byName = new Map<string, RadarInput>();
  for (const s of input) {
    const name = cleanName(s.subject);
    if (!name) continue;
    const cur = byName.get(name);
    if (cur) { cur.attempted += Math.max(0, s.attempted); cur.correct += Math.max(0, s.correct); }
    else { byName.set(name, { subject: name, attempted: Math.max(0, s.attempted), correct: Math.max(0, s.correct) }); order.push(name); }
  }
  let rows = order.map((n) => byName.get(n)!);

  let mergedNames: string[] | undefined;
  if (rows.length > maxAxes) {
    // keep the (maxAxes - 1) most practised, in syllabus order; fold everything else into one "Others" axis
    const keep = new Set(
      [...rows].map((r, i) => ({ r, i })).sort((a, b) => b.r.attempted - a.r.attempted || a.i - b.i).slice(0, maxAxes - 1).map((x) => x.r.subject),
    );
    const rest = rows.filter((r) => !keep.has(r.subject));
    mergedNames = rest.map((r) => r.subject);
    rows = rows.filter((r) => keep.has(r.subject));
    rows.push({ subject: "Others", attempted: rest.reduce((a, r) => a + r.attempted, 0), correct: rest.reduce((a, r) => a + r.correct, 0) });
  }

  const axes: RadarAxis[] = rows.map((r) => ({
    key: r.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label: r.subject,
    short: r.subject === "Others" ? "Others" : shortLabel(r.subject),
    value: pct(r.correct, r.attempted),
    attempted: r.attempted,
    hasData: r.attempted > 0,
    reliable: r.attempted >= minAttempts,
    ...(r.subject === "Others" && mergedNames ? { merged: mergedNames } : {}),
  }));

  const withData = axes.filter((a) => a.hasData);
  const totalA = withData.reduce((s, a) => s + a.attempted, 0);
  const totalC = rows.reduce((s, r) => s + r.correct, 0);
  const average = pct(totalC, totalA);
  const pool = withData.filter((a) => a.reliable).length ? withData.filter((a) => a.reliable) : withData;
  const weakest = pool.length ? pool.reduce((m, a) => (a.value < m.value ? a : m)) : null;
  const strongest = pool.length ? pool.reduce((m, a) => (a.value > m.value ? a : m)) : null;
  const mode: RadarMode = withData.length === 0 ? "empty" : withData.length < 3 || axes.length < 3 ? "bars" : "radar";
  return { mode, axes, target, average, weakest, strongest };
}

/** Point on a circle, angle 0 = straight up, clockwise. */
export function polar(cx: number, cy: number, r: number, i: number, n: number): [number, number] {
  const a = (-90 + (360 / n) * i) * (Math.PI / 180);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Where a label sits relative to its spoke so it never overlaps the chart: left, right or centred. */
export function labelAnchor(i: number, n: number): "start" | "middle" | "end" {
  const deg = ((360 / n) * i) % 360; // 0 = top, clockwise
  if (deg < 1 || Math.abs(deg - 180) < 1) return "middle";
  return deg < 180 ? "start" : "end";
}

/** Horizontal room (in px) the labels need on each side, from the longest short label, so the viewBox is never clipped. */
export function labelRoom(axes: RadarAxis[], charPx = 7.4, valuePx = 54) {
  const longest = Math.max(0, ...axes.map((a) => a.short.length));
  return Math.round(Math.max(longest * charPx, valuePx) + 16);
}
