/**
 * Step 10 (4J): calibration data for GATE CS predictions.
 *
 * Source data lives in data/calibration/cse/<year>.json (sources in
 * data/calibration/SOURCES.md). Published marks↔rank tables disagree, so each table is
 * turned into (rank, marks) points, and at standard ranks we take the MEDIAN across tables
 * as the estimate and the MIN/MAX as the band. Predictions are shown as ranges, with the
 * years they're based on — never as a single precise rank.
 */
import y2023 from "../data/calibration/cse/2023.json" with { type: "json" };
import y2024 from "../data/calibration/cse/2024.json" with { type: "json" };
import y2025 from "../data/calibration/cse/2025.json" with { type: "json" };
import y2026 from "../data/calibration/cse/2026.json" with { type: "json" };

interface Row { marks: number[]; rank: number[] }
interface Table { source: string; rows: Row[] }
interface YearFile {
  year: number;
  appeared: number | null;
  qualifying_marks: { general: number; obc_ncl_ews: number; sc_st_pwd: number };
  topper_marks: number | null;
  score_formula: { Sq: number; St: number; Mq: number; Mt: number | null };
  marks_vs_rank: Table[];
}

export const CALIBRATION: YearFile[] = ([y2023, y2024, y2025, y2026] as unknown as YearFile[]).sort((a, b) => a.year - b.year);
const latest = CALIBRATION[CALIBRATION.length - 1];

/** Years that actually contribute marks↔rank points, e.g. "2023–2025". */
export const CURVE_YEARS = (() => {
  const ys = CALIBRATION.filter((y) => y.marks_vs_rank.length).map((y) => y.year);
  return ys.length ? (ys[0] === ys[ys.length - 1] ? `${ys[0]}` : `${ys[0]}–${ys[ys.length - 1]}`) : "";
})();

type Pt = [rank: number, marks: number];

function tablePoints(t: Table): Pt[] {
  const pts = new Map<number, number>();
  for (const r of t.rows) {
    const [lo, hi] = r.marks;
    const [r1, r2] = r.rank;
    pts.set(r1, Math.max(pts.get(r1) ?? -Infinity, hi)); // best rank of the band ↔ top marks
    pts.set(r2, Math.min(pts.get(r2) ?? Infinity, lo));  // worst rank of the band ↔ lowest marks
  }
  return [...pts.entries()].sort((a, b) => a[0] - b[0]);
}

/** Marks at a rank on one table's curve (log-rank interpolation); null outside its range. */
function marksOn(pts: Pt[], rank: number): number | null {
  if (!pts.length || rank < pts[0][0] || rank > pts[pts.length - 1][0]) return null;
  for (let i = 1; i < pts.length; i++) {
    const [r1, m1] = pts[i - 1];
    const [r2, m2] = pts[i];
    if (rank <= r2) {
      const t = r2 === r1 ? 0 : (Math.log(rank) - Math.log(r1)) / (Math.log(r2) - Math.log(r1));
      return m1 + t * (m2 - m1);
    }
  }
  return pts[pts.length - 1][1];
}

// One portal published a single combined 2024–2025 table, stored under both years — count it once.
const TABLES = (() => {
  const seen = new Set<string>();
  const out: { year: number; pts: Pt[] }[] = [];
  for (const y of CALIBRATION) for (const t of y.marks_vs_rank) {
    const key = t.source + JSON.stringify(t.rows);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ year: y.year, pts: tablePoints(t) });
  }
  return out;
})();
const STANDARD_RANKS = [1, 10, 50, 100, 200, 500, 1000, 2000, 3000, 5000, 10000];

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const r1 = (x: number) => Math.round(x * 10) / 10;

/** (AIR, marks) anchors: estimate, and the low/high band across sources. */
export const CURVE: { rank: number; marks: number; low: number; high: number }[] = (() => {
  const out: { rank: number; marks: number; low: number; high: number }[] = [];
  for (const rank of STANDARD_RANKS) {
    const vals = TABLES.map((t) => marksOn(t.pts, rank)).filter((v): v is number => v !== null);
    if (!vals.length) continue;
    out.push({ rank, marks: r1(median(vals)), low: r1(Math.min(...vals)), high: r1(Math.max(...vals)) });
  }
  // Tail: the last qualifier sits near the qualifying mark. ~16–18% of candidates qualify
  // (official trend), so the rank there ≈ 17% of candidates appeared (latest year).
  const q = latest.qualifying_marks.general;
  const appeared = [...CALIBRATION].reverse().find((y) => y.appeared)?.appeared ?? 170000;
  const tailRank = Math.round(appeared * 0.17);
  const last = out[out.length - 1];
  if (last && tailRank > last.rank && q < last.marks) {
    const mid = Math.round(Math.sqrt(last.rank * tailRank));
    const midMarks = r1((last.marks + q) / 2 + 2);
    // Band can only widen or hold with rank, never jump back.
    out.push({ rank: mid, marks: midMarks, low: r1(Math.max(q, Math.min(last.low, midMarks - 3))), high: r1(Math.min(last.high, midMarks + 3)) });
    out.push({ rank: tailRank, marks: q, low: q, high: q });
  }
  return out;
})();

function interpMarks(rank: number, key: "marks" | "low" | "high"): number {
  const r = Math.max(1, rank);
  if (r <= CURVE[0].rank) return CURVE[0][key];
  for (let i = 1; i < CURVE.length; i++) {
    const a = CURVE[i - 1], b = CURVE[i];
    if (r <= b.rank) {
      const t = (Math.log(r) - Math.log(a.rank)) / (Math.log(b.rank) - Math.log(a.rank));
      return r1(a[key] + t * (b[key] - a[key]));
    }
  }
  return CURVE[CURVE.length - 1][key];
}

function interpRank(marks: number, key: "marks" | "low" | "high"): number {
  if (marks >= CURVE[0][key]) return 1;
  for (let i = 1; i < CURVE.length; i++) {
    const a = CURVE[i - 1], b = CURVE[i];
    if (marks >= b[key]) {
      const t = a[key] === b[key] ? 0 : (a[key] - marks) / (a[key] - b[key]);
      return Math.max(1, Math.round(Math.exp(Math.log(a.rank) + t * (Math.log(b.rank) - Math.log(a.rank)))));
    }
  }
  return CURVE[CURVE.length - 1].rank;
}

/** Marks needed for a target AIR (median estimate). */
export const calibratedMarksForRank = (rank: number) => interpMarks(rank, "marks");
/** Marks band for a target AIR: [easier-year/lenient source, harder/strict source]. */
export const marksBandForRank = (rank: number) => ({ low: interpMarks(rank, "low"), high: interpMarks(rank, "high") });
/** Median AIR estimate for marks. */
export const calibratedRankForMarks = (marks: number) => interpRank(marks, "marks");
/** AIR band for marks — best case uses the lenient curve, worst case the strict one. */
export const rankBandForMarks = (marks: number) => ({ best: interpRank(marks, "low"), worst: interpRank(marks, "high") });

export type Category = "general" | "obc_ncl_ews" | "sc_st_pwd";
export function qualifyingMarks(category: Category = "general", year = latest.year): number {
  const y = CALIBRATION.find((c) => c.year === year) ?? latest;
  return y.qualifying_marks[category];
}

/** Official normalised GATE score (out of 1000) for single-session papers like CS. */
export function gateScore(marks: number, year = latest.year): number {
  const y = CALIBRATION.find((c) => c.year === year) ?? latest;
  const { Sq, St, Mq } = y.score_formula;
  // Mt (mean of the top 0.1%) is only published in official reports; fall back to the
  // most recent known value, else a typical 80.
  const Mt = y.score_formula.Mt ?? [...CALIBRATION].reverse().find((c) => c.score_formula.Mt)?.score_formula.Mt ?? 80;
  const s = Sq + (St - Sq) * ((marks - Mq) / (Mt - Mq));
  return Math.round(Math.max(0, Math.min(1000, s)));
}

/** Median recorded topper marks (e.g. 2024: 90, 2025: 100) — the realistic top of the curve. */
export const TYPICAL_TOPPER_MARKS = (() => {
  const t = CALIBRATION.map((y) => y.topper_marks).filter((m): m is number => typeof m === "number");
  return t.length ? median(t) : 90;
})();

/** Short provenance line for UI: "GATE CS 2023–2025 results · 3 published tables". */
export const CALIBRATION_LABEL = `GATE CS ${CURVE_YEARS} results · ${TABLES.length} published tables`;
