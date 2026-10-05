import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { normalizeQuestion } from "@/lib/repository/transformers/question-normalizer";
import { ImageResolver } from "@/lib/services/image-resolver";
import type { RenderableQuestion } from "@/types/question.types";
import { BRANCHES_WITH_DATA, branchByCode, branchImageBase, type BranchCode } from "@/lib/branches";

/**
 * Public PYQ pages (6A). Read at BUILD time from the answer-free bank
 * (public/data/questions.json — the build fails if an answer field leaks into it), so no
 * answer key can ever reach these pages. Every page is prerendered to static HTML.
 */
type RawPaper = { exam_metadata?: { "year-shift"?: string }; questions: any[] };

export type PaperInfo = { slug: string; branch: BranchCode; paperCode: string; yearShift: string; year: string; shift: "FN" | "AN" | string; label: string; count: number; marks: number };

let cache: { papers: PaperInfo[]; byPaper: Map<string, RenderableQuestion[]>; text: Map<string, string>; slugOf: Map<string, string> } | null = null;

const SHIFT_NAME: Record<string, string> = { FN: "Forenoon", AN: "Afternoon" };
/** gate-cs-2024-fn, gate-ec-2024 … (CS slugs unchanged). */
export const paperSlug = (yearShift: string, paperCode = "CS") => `gate-${paperCode.toLowerCase()}-${yearShift.toLowerCase()}`;
export const subjectSlug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Multi-branch: every LIVE branch with a bank gets public pages (CS first, unchanged URLs).
const PUBLIC_BRANCHES = (): BranchCode[] => BRANCHES_WITH_DATA.filter((c) => branchByCode(c)?.live);
const bankFile = (c: BranchCode) => (c === "CSE" ? "public/data/questions.json" : `public/data/${c}/questions.json`);
const manifestFile = (c: BranchCode) => (c === "CSE" ? "public/data/image-manifest.json" : `public/data/${c}/image-manifest.json`);

function load() {
  if (cache) return cache;
  const root = process.cwd();
  const papers: PaperInfo[] = [];
  const byPaper = new Map<string, RenderableQuestion[]>();
  const text = new Map<string, string>();
  const slugOf = new Map<string, string>();
  for (const branch of PUBLIC_BRANCHES()) {
    const paperCode = branchByCode(branch)?.paper ?? "CS";
    const raw: RawPaper[] = JSON.parse(readFileSync(path.join(root, bankFile(branch)), "utf8"));
    const manifest = JSON.parse(readFileSync(path.join(root, manifestFile(branch)), "utf8"));
    ImageResolver.initialize(manifest, branchImageBase(branch)); // image URLs are resolved during normalisation
    for (const p of raw) {
      const yearShift = p.exam_metadata?.["year-shift"] ?? "";
      const [year, shift = ""] = yearShift.split("-");
      if (!year) continue;
      for (const q of p.questions) text.set(q.question_id, String(q.question_text ?? ""));
      const qs = p.questions.map((q) => normalizeQuestion(q, { year, shift, imagesRequired: q.images_required }))
        .sort((a, b) => Number(a.question_no) - Number(b.question_no));
      const slug = paperSlug(yearShift, paperCode);
      byPaper.set(slug, qs);
      for (const q of qs) slugOf.set(q.question_id, slug);
      papers.push({
        slug, branch, paperCode, yearShift, year, shift,
        label: `GATE ${paperCode} ${year}${shift ? ` (${SHIFT_NAME[shift] ?? shift})` : ""}`,
        count: qs.length, marks: qs.reduce((s, q) => s + Number(q.marks || 0), 0),
      });
    }
  }
  papers.sort((a, b) => a.paperCode.localeCompare(b.paperCode) || b.year.localeCompare(a.year) || a.shift.localeCompare(b.shift));
  cache = { papers, byPaper, text, slugOf };
  return cache;
}

/** All public papers, or one branch's. */
export const allPapers = (branch?: BranchCode) => load().papers.filter((p) => !branch || p.branch === branch);
/** The public paper a question belongs to. */
export const paperOfQuestion = (qid: string) => { const s = load().slugOf.get(qid); return s ? paperBySlug(s) : null; };
export const publicBranches = () => PUBLIC_BRANCHES();
export const paperBySlug = (slug: string) => load().papers.find((p) => p.slug === slug) ?? null;
export const paperQuestions = (slug: string) => load().byPaper.get(slug) ?? [];
export const allQuestions = (branch?: BranchCode) =>
  [...load().byPaper.entries()].filter(([slug]) => !branch || paperBySlug(slug)?.branch === branch).flatMap(([, qs]) => qs);

/** Subject hub data: topics with counts and marks per year (weightage). */
export function subjects(branch: BranchCode = "CSE") {
  const map = new Map<string, { name: string; slug: string; count: number; marks: number; topics: Map<string, number>; topicMarks: Map<string, number>; topicYear: Map<string, Map<string, number>>; byYear: Map<string, number> }>();
  for (const [slug, qs] of load().byPaper) {
    if (paperBySlug(slug)!.branch !== branch) continue;
    const year = paperBySlug(slug)!.year;
    for (const q of qs) {
      const s = q.subject || "General";
      if (!map.has(s)) map.set(s, { name: s, slug: subjectSlug(s), count: 0, marks: 0, topics: new Map(), topicMarks: new Map(), topicYear: new Map(), byYear: new Map() });
      const e = map.get(s)!;
      e.count++; e.marks += Number(q.marks || 0);
      e.topics.set(q.topic || "Other", (e.topics.get(q.topic || "Other") ?? 0) + 1);
      e.topicMarks.set(q.topic || "Other", (e.topicMarks.get(q.topic || "Other") ?? 0) + Number(q.marks || 0));
      const ty = e.topicYear.get(q.topic || "Other") ?? new Map<string, number>(); ty.set(year, (ty.get(year) ?? 0) + Number(q.marks || 0)); e.topicYear.set(q.topic || "Other", ty);
      e.byYear.set(year, (e.byYear.get(year) ?? 0) + Number(q.marks || 0));
    }
  }
  return [...map.values()].sort((a, b) => b.marks - a.marks);
}

/** Plain text of a question for titles/descriptions (no TeX delimiters or image tokens). */
export function plainText(q: RenderableQuestion, max = 155) {
  const t = (load().text.get(q.question_id) ?? "")
    .replace(/\[IMAGE_[^\]]+\]/g, " ")
    .replace(/\$\$?|\\\(|\\\)|\\\[|\\\]/g, "")
    .replace(/\\[a-zA-Z]+/g, " ")
    .replace(/[{}_^*#`|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}
