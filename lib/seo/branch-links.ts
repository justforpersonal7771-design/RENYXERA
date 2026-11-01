import { branchByCode, type BranchCode } from "@/lib/branches";

// Pure URL helpers (safe in client and server code) so every branch-aware page links the same way.
// CS keeps its original URLs; every other paper uses /<section>/<paper code>.
const paper = (code: BranchCode) => branchByCode(code)!.paper.toLowerCase();

// Branches with their own syllabus page. Civil has no curated syllabus data yet, so it links to the official PDF instead of a 404.
const HAS_SYLLABUS_PAGE: ReadonlySet<BranchCode> = new Set<BranchCode>(["CSE", "ECE", "EE", "ME", "DA"]);
export const syllabusHref = (code: BranchCode) => (HAS_SYLLABUS_PAGE.has(code) ? `/gate-${paper(code)}-syllabus` : `https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/${paper(code).toUpperCase()}_GATE2027_Syllabus.pdf`);
export const mostRepeatedHref = (code: BranchCode) => (code === "CSE" ? "/articles/most-repeated-gate-cs-topics" : `/articles/most-repeated-topics/${paper(code)}`);
