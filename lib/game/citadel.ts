/**
 * The Citadel (Battles v3). Every student's base is built from their real practice: one building per CS subject group,
 * levelled only by questions actually attempted and accuracy (analytics subjectPerformance). Nothing is bought.
 * Level rules are deliberately simple and shown to the student, so a level always means the same thing.
 */

export type BuildingId = "os" | "dbms" | "cn" | "algo" | "toc" | "cd" | "coa" | "dl" | "prog" | "maths" | "apt";
export type Building = { id: BuildingId; name: string; subject: string; subjects: string[]; roof: "terra" | "slate" | "gold" | "moss"; gx: number; gy: number };

/** Positions on the isometric grid around the Town Hall (0,0). */
export const BUILDINGS: Building[] = [
  { id: "os", name: "Kernel Keep", subject: "Operating Systems", subjects: ["Operating Systems (OS)"], roof: "terra", gx: -2, gy: -1 },
  { id: "dbms", name: "Query Vault", subject: "Databases", subjects: ["Database Management Systems (DBMS)"], roof: "slate", gx: -1, gy: -2 },
  { id: "cn", name: "Signal Tower", subject: "Computer Networks", subjects: ["Computer Networks (CN)"], roof: "gold", gx: 1, gy: -2 },
  { id: "algo", name: "Algorithm Forge", subject: "Algorithms", subjects: ["Algorithms"], roof: "terra", gx: 2, gy: -1 },
  { id: "toc", name: "Automata Observatory", subject: "Theory of Computation", subjects: ["Theory of Computation (TOC)"], roof: "slate", gx: 2, gy: 1 },
  { id: "cd", name: "Compiler Works", subject: "Compiler Design", subjects: ["Compiler Design"], roof: "moss", gx: 1, gy: 2 },
  { id: "coa", name: "Engine House", subject: "Computer Organisation", subjects: ["Computer Organization and Architecture (COA)"], roof: "gold", gx: -1, gy: 2 },
  { id: "dl", name: "Logic Gatehouse", subject: "Digital Logic", subjects: ["Digital Logic"], roof: "moss", gx: -2, gy: 1 },
  { id: "prog", name: "Code Workshop", subject: "Programming and Data Structures", subjects: ["Programming in C", "Data Structures"], roof: "slate", gx: -3, gy: 0 },
  { id: "maths", name: "Maths Library", subject: "Engineering Mathematics", subjects: ["Discrete Mathematics", "Linear Algebra", "Calculus", "Probability & Statistics"], roof: "terra", gx: 3, gy: 0 },
  { id: "apt", name: "Aptitude Grounds", subject: "General Aptitude", subjects: ["Verbal Aptitude", "Quantitative Aptitude", "Analytical Aptitude", "Spatial Aptitude"], roof: "moss", gx: 0, gy: 3 },
];

/** Level thresholds: questions attempted and accuracy needed. Level 0 = an empty plot. */
export const LEVELS = [
  { level: 1, attempted: 5, accuracy: 0 },
  { level: 2, attempted: 15, accuracy: 40 },
  { level: 3, attempted: 30, accuracy: 50 },
  { level: 4, attempted: 60, accuracy: 60 },
  { level: 5, attempted: 100, accuracy: 70 },
] as const;
export const MAX_LEVEL = 5;

export type SubjectPerf = { subject: string; attempted: number; correct: number };
export type BuildingState = Building & { attempted: number; correct: number; accuracy: number; level: number; next: { attempted: number; accuracy: number; needMore: number } | null };

export function buildingState(b: Building, perf: SubjectPerf[]): BuildingState {
  const rows = perf.filter((p) => b.subjects.includes(p.subject));
  const attempted = rows.reduce((s, r) => s + r.attempted, 0);
  const correct = rows.reduce((s, r) => s + r.correct, 0);
  const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
  let level = 0;
  for (const l of LEVELS) if (attempted >= l.attempted && accuracy >= l.accuracy) level = l.level;
  const n = LEVELS.find((l) => l.level === level + 1);
  return { ...b, attempted, correct, accuracy, level, next: n ? { attempted: n.attempted, accuracy: n.accuracy, needMore: Math.max(0, n.attempted - attempted) } : null };
}

/** Town Hall level: the average building level, weighted equally, rounded down, plus one (a new player starts at 1). */
export function townHallLevel(states: BuildingState[]): number {
  if (!states.length) return 1;
  return Math.floor(states.reduce((s, b) => s + b.level, 0) / states.length) + 1;
}

/** Leagues by Arena rating (proposed names; owner decision D12). */
export const LEAGUES = [
  { name: "Aspirant", min: 0 },
  { name: "Qualifier", min: 1050 },
  { name: "Ranker", min: 1150 },
  { name: "Topper", min: 1300 },
  { name: "Legend", min: 1500 },
] as const;
export const leagueOf = (rating: number) => [...LEAGUES].reverse().find((l) => rating >= l.min) ?? LEAGUES[0];
