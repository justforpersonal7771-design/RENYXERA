/**
 * Step 8 (4H): GATE branches for the landing pages and waitlist. Codes match
 * public.branches. Candidate numbers are approximate appeared counts for GATE 2026
 * (see docs/CONTENT_STRATEGY.md §1 for sources) — refresh each March.
 */
export type BranchCode = "CSE" | "DA" | "ECE" | "EE" | "ME" | "CE";

export interface BranchInfo {
  code: BranchCode;
  slug: string;
  paper: string; // official GATE paper code
  name: string;
  short: string;
  live: boolean;
  candidates: string; // full phrase incl. the exam year, approximate
  trend: string;
  plannedLaunch: string | null;
  subjects: string[];
  blurb: string;
}

export const BRANCHES: BranchInfo[] = [
  {
    code: "CSE", slug: "gate-cse", paper: "CS", name: "Computer Science & Information Technology", short: "Computer Science", live: true,
    candidates: "about 2.1 lakh candidates sat GATE 2026", trend: "The largest GATE paper, and still growing every year.", plannedLaunch: null,
    subjects: ["Engineering Mathematics", "Digital Logic", "Computer Organization & Architecture", "Programming & Data Structures", "Algorithms", "Theory of Computation", "Compiler Design", "Operating Systems", "Databases", "Computer Networks", "General Aptitude"],
    blurb: "Every official GATE CS paper since 2017, a real exam-interface simulator, mistake analytics and an AI mentor.",
  },
  {
    code: "DA", slug: "gate-da", paper: "DA", name: "Data Science & Artificial Intelligence", short: "Data Science & AI", live: true,
    candidates: "about 57,000 candidates sat GATE 2025", trend: "The newest GATE paper and one of the fastest growing.", plannedLaunch: null,
    subjects: ["Probability & Statistics", "Linear Algebra", "Calculus & Optimization", "Programming, Data Structures & Algorithms", "Database Management & Warehousing", "Machine Learning", "Artificial Intelligence", "General Aptitude"],
    blurb: "Every official GATE DA paper since the paper began in 2024 (195 questions, tagged to the official syllabus), a real exam-interface simulator, mistake analytics and an AI mentor.",
  },
  {
    code: "ECE", slug: "gate-ece", paper: "EC", name: "Electronics & Communication Engineering", short: "Electronics & Communication", live: true,
    candidates: "about 96,000 candidates sat GATE 2026", trend: "The second-largest paper, up sharply in 2026.", plannedLaunch: null,
    subjects: ["Engineering Mathematics", "Networks", "Signals & Systems", "Electronic Devices", "Analog Circuits", "Digital Circuits", "Control Systems", "Communications", "Electromagnetics", "General Aptitude"],
    blurb: "Every official GATE EC paper from 2021 to 2026 (390 questions, tagged to the official syllabus), a real exam-interface simulator, mistake analytics and an AI mentor.",
  },
  {
    code: "EE", slug: "gate-ee", paper: "EE", name: "Electrical Engineering", short: "Electrical", live: true,
    candidates: "about 66,000 candidates sat GATE 2026", trend: "A large, steady paper with strong PSU demand.", plannedLaunch: null,
    subjects: ["Engineering Mathematics", "Electric Circuits", "Electromagnetic Fields", "Signals & Systems", "Electrical Machines", "Power Systems", "Control Systems", "Electrical & Electronic Measurements", "Analog & Digital Electronics", "Power Electronics", "General Aptitude"],
    blurb: "Every official GATE EE paper from 2021 to 2026 (390 questions, tagged to the official syllabus), a real exam-interface simulator, mistake analytics and an AI mentor.",
  },
  {
    code: "CE", slug: "gate-ce", paper: "CE", name: "Civil Engineering", short: "Civil", live: false,
    candidates: "about 76,000 candidates sat GATE 2026", trend: "A large paper with strong PSU and state-job demand.", plannedLaunch: "2027",
    subjects: ["Engineering Mathematics", "Structural Engineering", "Geotechnical Engineering", "Water Resources Engineering", "Environmental Engineering", "Transportation Engineering", "Geomatics Engineering", "General Aptitude"],
    blurb: "Past papers, solutions and mocks tuned to the Civil syllabus and its weightage.",
  },
  {
    code: "ME", slug: "gate-me", paper: "ME", name: "Mechanical Engineering", short: "Mechanical", live: false,
    candidates: "about 60,000 candidates sat GATE 2026 (estimate)", trend: "A long-standing paper with a big PSU audience.", plannedLaunch: "2027",
    subjects: ["Engineering Mathematics", "Engineering Mechanics", "Mechanics of Materials", "Theory of Machines & Vibrations", "Machine Design", "Fluid Mechanics", "Heat Transfer", "Thermodynamics", "Manufacturing & Production", "Industrial Engineering", "General Aptitude"],
    blurb: "Topic-wise past papers and practice across the whole Mechanical syllabus.",
  },
];

export const branchBySlug = (slug: string) => BRANCHES.find((b) => b.slug === slug);
export const branchByCode = (code: string) => BRANCHES.find((b) => b.code === code);

// ---------------------------------------------------------------------------------------
// Multi-branch (docs/MULTI_BRANCH_DESIGN.md). This file is the ONLY place that maps the
// app/DB branch code (CSE, ECE, …) to GATE's paper code (CS, EC, …).
// ---------------------------------------------------------------------------------------

export const DEFAULT_BRANCH: BranchCode = "CSE";

/** What each bank holds, for the branch picker. Keep in step with the banks. */
export const BANK_SUMMARY: Partial<Record<BranchCode, { questions: number; years: string }>> = {
  CSE: { questions: 975, years: "2017–2026" },
  ECE: { questions: 390, years: "2021–2026" },
  EE: { questions: 390, years: "2021–2026" },
  DA: { questions: 195, years: "2024–2026" },
};

/** Branches whose question bank scripts/copy-static-data.mjs builds. */
export const BRANCHES_WITH_DATA: BranchCode[] = ["CSE", "ECE", "EE", "DA"];

/** Branches open in the app: marketing `live`, plus any in NEXT_PUBLIC_PREVIEW_BRANCHES
 *  (comma-separated) for testing before launch. Server checks use public.branches.status. */
export function availableBranches(): BranchInfo[] {
  const preview = (process.env.NEXT_PUBLIC_PREVIEW_BRANCHES ?? "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  return BRANCHES.filter((b) => BRANCHES_WITH_DATA.includes(b.code) && (b.live || preview.includes(b.code)));
}

export const isBranchCode = (code: unknown): code is BranchCode =>
  typeof code === "string" && BRANCHES.some((b) => b.code === code);

export const isAvailableBranch = (code: unknown): code is BranchCode =>
  isBranchCode(code) && availableBranches().some((b) => b.code === code);

/** "EC" -> "ECE" */
export const branchOfPaper = (paper: string): BranchCode | undefined =>
  BRANCHES.find((b) => b.paper === paper.toUpperCase())?.code;

/** "GATE_EC_2024_Q7" -> "ECE"; "GATE_CS_2026_FN_Q1" -> "CSE"; anything else -> undefined. */
export function branchOfQuestionId(qid: string): BranchCode | undefined {
  const m = /^GATE_([A-Z]{2})_/.exec(qid);
  return m ? branchOfPaper(m[1]) : undefined;
}

/** Public, answer-free bank (CS keeps its original path so old caches keep working). */
export const branchDataUrl = (code: BranchCode) =>
  code === "CSE" ? "/data/questions.json" : `/data/${code}/questions.json`;

export const branchManifestUrl = (code: BranchCode) =>
  code === "CSE" ? "/data/image-manifest.json" : `/data/${code}/image-manifest.json`;

/** /images/<year-shift>/… for CS (unchanged); /images/<CODE>/<year-shift>/… otherwise. */
export const branchImageBase = (code: BranchCode) => (code === "CSE" ? "/images" : `/images/${code}`);
