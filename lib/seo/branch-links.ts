import { branchByCode, type BranchCode } from "@/lib/branches";

// Pure URL helpers (safe in client and server code) so every branch-aware page links the same way.
// CS keeps its original URLs; every other paper uses /<section>/<paper code>.
const paper = (code: BranchCode) => branchByCode(code)!.paper.toLowerCase();

export const syllabusHref = (code: BranchCode) => `/gate-${paper(code)}-syllabus`;
export const mostRepeatedHref = (code: BranchCode) => (code === "CSE" ? "/articles/most-repeated-gate-cs-topics" : `/articles/most-repeated-topics/${paper(code)}`);
export const plan150Href = (code: BranchCode) => (code === "CSE" ? "/articles/gate-cs-preparation-150-days" : `/articles/preparation-150-days/${paper(code)}`);
