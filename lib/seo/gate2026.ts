// Official GATE 2026 (IIT Guwahati) statistics, from the Statistical & Performance Report and the cut-off page.
// Marks are out of 100. Score = Sq + (St - Sq) * (M - Mq) / (Mt - Mq), with Sq = 350 and St = 900.

export type PaperStat = {
  code: string; name: string;
  registered: number; appeared: number; qualified: number;
  /** Mean marks of the top 0.1% of candidates (M̄t) */ mt: number;
  average: number; sd: number;
  /** Qualifying marks: General, OBC-NCL/EWS, SC/ST/PwD */ q: [number, number, number];
};

export const GATE_2026_YEAR = 2026;
export const SQ = 350;
export const ST = 900;

export const GATE_2026: PaperStat[] = [
  { code: "CS", name: "Computer Science & IT", registered: 259922, appeared: 211020, qualified: 40661, mt: 77.03, average: 18.51, sd: 11.58, q: [30, 27, 20] },
  { code: "DA", name: "Data Science & AI", registered: 91764, appeared: 69242, qualified: 12849, mt: 72.01, average: 15.45, sd: 11, q: [26.4, 23.7, 17.5] },
  { code: "EC", name: "Electronics & Communication", registered: 115448, appeared: 95752, qualified: 17392, mt: 71.59, average: 14.68, sd: 11.81, q: [26.4, 23.7, 17.5] },
  { code: "EE", name: "Electrical Engineering", registered: 81947, appeared: 65801, qualified: 13726, mt: 75.45, average: 16.62, sd: 11.16, q: [27.7, 24.9, 18.4] },
  { code: "ME", name: "Mechanical Engineering", registered: 76823, appeared: 59612, qualified: 10970, mt: 74.58, average: 13.35, sd: 11.86, q: [25.2, 22.6, 16.7] },
  { code: "CE", name: "Civil Engineering", registered: 97486, appeared: 76385, qualified: 13949, mt: 83.23, average: 16.32, sd: 12.41, q: [28.7, 25.8, 19.1] },
];

export type CategoryKey = 0 | 1 | 2;

/** Normalised GATE score for single-session papers, clamped to 0–1000. Zero below the qualifying mark. */
export function paperScore(p: PaperStat, marks: number, cat: CategoryKey = 0): number {
  const mq = p.q[0];
  if (marks < p.q[cat]) return 0;
  const s = SQ + (ST - SQ) * ((marks - mq) / (p.mt - mq));
  return Math.round(Math.max(0, Math.min(1000, s)));
}

export const qualifiedPercent = (p: PaperStat) => Math.round((p.qualified / p.appeared) * 1000) / 10;
