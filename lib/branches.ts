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
    code: "DA", slug: "gate-da", paper: "DA", name: "Data Science & Artificial Intelligence", short: "Data Science & AI", live: false,
    candidates: "about 57,000 candidates sat GATE 2025", trend: "The newest GATE paper and one of the fastest growing.", plannedLaunch: "early 2027",
    subjects: ["Probability & Statistics", "Linear Algebra", "Calculus & Optimization", "Programming, Data Structures & Algorithms", "Database Management & Warehousing", "Machine Learning", "Artificial Intelligence", "General Aptitude"],
    blurb: "Built on our Computer Science engine — the maths, programming and algorithms overlap means DA is next in line.",
  },
  {
    code: "ECE", slug: "gate-ece", paper: "EC", name: "Electronics & Communication Engineering", short: "Electronics & Communication", live: false,
    candidates: "about 96,000 candidates sat GATE 2026", trend: "The second-largest paper, up sharply in 2026.", plannedLaunch: "2027",
    subjects: ["Engineering Mathematics", "Networks", "Signals & Systems", "Electronic Devices", "Analog Circuits", "Digital Circuits", "Control Systems", "Communications", "Electromagnetics", "General Aptitude"],
    blurb: "Past papers with step-by-step solutions, topic-wise practice and full mocks for EC.",
  },
  {
    code: "EE", slug: "gate-ee", paper: "EE", name: "Electrical Engineering", short: "Electrical", live: false,
    candidates: "about 66,000 candidates sat GATE 2026", trend: "A large, steady paper with strong PSU demand.", plannedLaunch: "2027",
    subjects: ["Engineering Mathematics", "Electric Circuits", "Electromagnetic Fields", "Signals & Systems", "Electrical Machines", "Power Systems", "Control Systems", "Electrical & Electronic Measurements", "Analog & Digital Electronics", "Power Electronics", "General Aptitude"],
    blurb: "Shares signals, networks and control with EC, so both arrive close together.",
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
