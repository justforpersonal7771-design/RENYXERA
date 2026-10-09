import ecSyl from "@/data/pyq/EC/syllabus.json";
import eeSyl from "@/data/pyq/EE/syllabus.json";
import meSyl from "@/data/pyq/ME/syllabus.json";
import daSyl from "@/data/pyq/DA/syllabus.json";
import { allPapers, paperQuestions, subjectSlug } from "@/lib/seo/pyq";
import type { BranchCode } from "@/lib/branches";

/** Official GATE 2027 syllabus (curated verbatim in data/pyq/<BR>/syllabus.json) joined with the
 *  weightage of our tagged official papers. Tags were written against the same lists, so section /
 *  subject / topic strings match exactly. General Aptitude is common to all papers and left out. */
type Syl = Record<string, Record<string, string[]> | string | Record<string, string>>;
const SOURCES: Partial<Record<BranchCode, { paper: string; syl: Syl }>> = {
  ECE: { paper: "EC", syl: ecSyl as Syl }, EE: { paper: "EE", syl: eeSyl as Syl },
  ME: { paper: "ME", syl: meSyl as Syl }, DA: { paper: "DA", syl: daSyl as Syl },
};
export const SYLLABUS_PAGE_BRANCHES = Object.keys(SOURCES) as BranchCode[];
export const syllabusSlugOf = (code: BranchCode) => (SOURCES[code] ? `gate-${SOURCES[code]!.paper.toLowerCase()}-syllabus` : null);
export const branchOfSyllabusSlug = (slug: string) => SYLLABUS_PAGE_BRANCHES.find((c) => syllabusSlugOf(c) === slug);
export const officialSyllabusPdf = (paper: string) => `https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/${paper}_GATE2027_Syllabus.pdf`;

const DA_MATHS = new Set(["SECTION 1: PROBABILITY AND STATISTICS", "SECTION 2: LINEAR ALGEBRA", "SECTION 3: CALCULUS AND OPTIMIZATION"]);
export type TopicStat = { name: string; questions: number; marks: number; yearsAsked: number };
export type SubjectStat = { name: string; marks: number; questions: number; share: number; byYear: number[]; topics: TopicStat[] };
export type SectionStat = { title: string; group: "Engineering Mathematics" | "Core"; marks: number; share: number; subjects: SubjectStat[] };

export function branchSyllabusStats(code: BranchCode) {
  const src = SOURCES[code];
  if (!src) return null;
  const papers = allPapers(code);
  const years = [...new Set(papers.map((p) => p.year))].sort();
  const yi = new Map(years.map((y, i) => [y, i]));
  // subject → topic → { q, marks, years:Set }. The bank has three sections (GA / Maths / Core); the
  // official syllabus section of a subject is looked up from syllabus.json.
  const acc = new Map<string, { q: number; m: number; ys: Set<string>; by: number[] }>();
  const key = (...k: string[]) => k.join("\u0000");
  const bump = (k: string, marks: number, year: string) => {
    const a = acc.get(k) ?? { q: 0, m: 0, ys: new Set<string>(), by: years.map(() => 0) };
    a.q++; a.m += marks; a.ys.add(year); a.by[yi.get(year)!] += marks; acc.set(k, a);
  };
  let coreMarks = 0;
  for (const p of papers) for (const q of paperQuestions(p.slug)) {
    if (!q.section || /GENERAL APTITUDE/i.test(q.section)) continue;
    coreMarks += q.marks;
    bump(key(q.subject), q.marks, p.year);
    if (q.topic) bump(key(q.subject, q.topic), q.marks, p.year);
  }
  const total = coreMarks || 1;
  const sections: SectionStat[] = Object.entries(src.syl)
    .filter(([k, v]) => !k.startsWith("_") && typeof v === "object")
    .map(([title, subs]) => {
      const subjects: SubjectStat[] = Object.entries(subs as Record<string, string[]>).map(([name, topics]) => {
        const s = acc.get(key(name));
        return {
          name, marks: s?.m ?? 0, questions: s?.q ?? 0, share: ((s?.m ?? 0) / total) * 100, byYear: s?.by ?? years.map(() => 0),
          topics: topics.map((t) => { const a = acc.get(key(name, t)); return { name: t, questions: a?.q ?? 0, marks: a?.m ?? 0, yearsAsked: a?.ys.size ?? 0 }; }),
        };
      });
      const marks = subjects.reduce((n, s) => n + s.marks, 0);
      const group = /ENGINEERING MATHEMATICS/.test(title) || (code === "DA" && DA_MATHS.has(title)) ? "Engineering Mathematics" as const : "Core" as const;
      return { title, group, marks, share: (marks / total) * 100, subjects };
    });
  const topTopics = sections.flatMap((s) => s.subjects.flatMap((sub) => sub.topics.map((t) => ({ ...t, subject: sub.name }))))
    .filter((t) => t.questions > 0)
    .sort((a, b) => b.yearsAsked - a.yearsAsked || b.marks - a.marks)
    .slice(0, 12);
  return { paper: src.paper, years, papers: papers.length, coreMarks, sections, topTopics, subjectLink: (name: string) => `/topics/${subjectSlug(name)}` };
}
