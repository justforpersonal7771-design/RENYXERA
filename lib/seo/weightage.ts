import { allPapers, subjects } from "@/lib/seo/pyq";
import { SYLLABUS, SYLLABUS_GROUPS, type SyllabusSection } from "@/lib/seo/syllabus";

export type ItemStat = { name: string; marks: number; questions: number; tag: string | null; shared: number };
export type UnitStat = { name: string; items: string[]; bank: string[]; marks: number; questions: number; byYear: number[]; yearsAsked: number; itemStats: ItemStat[] };

/** Which bank tag an official syllabus item is counted under: the tag whose name mentions the item
 *  (e.g. "Groups" -> "Algebraic Structures (Monoids, Groups)"); one-tag units use that tag. */
function tagForItem(item: string, bank: string[]): string | null {
  if (bank.length === 1) return bank[0];
  const words = item.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3);
  let best: string | null = null, score = 0;
  for (const t of bank) {
    const n = t.toLowerCase();
    const hit = words.filter((w) => n.includes(w.replace(/s$/, ""))).length;
    if (hit > score) { score = hit; best = t; }
  }
  return best;
}
export type SectionStat = Omit<SyllabusSection, "units"> & { slug: string; marks: number; questions: number; share: number; perPaper: number; byYear: number[]; units: UnitStat[]; links: { name: string; slug: string; count: number }[] };

export const sectionSlug = (t: string) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** The official syllabus joined with past-paper weightage: per section, per unit, per year. */
export function syllabusStats() {
  const papers = allPapers();
  const years = [...new Set(papers.map((p) => p.year))].sort();
  const subs = subjects();
  const bySubject = new Map(subs.map((s) => [s.name, s]));
  const total = subs.reduce((n, s) => n + s.marks, 0) || 1;
  const perYearTotal = years.map((y) => subs.reduce((n, s) => n + (s.byYear.get(y) ?? 0), 0));

  const sections: SectionStat[] = SYLLABUS.map((sec) => {
    const found = sec.subjects.map((n) => bySubject.get(n)).filter((x): x is NonNullable<typeof x> => !!x);
    const marks = found.reduce((n, s) => n + s.marks, 0);
    const questions = found.reduce((n, s) => n + s.count, 0);
    const byYear = years.map((y) => found.reduce((n, s) => n + (s.byYear.get(y) ?? 0), 0));
    const units: UnitStat[] = sec.units.map((u) => {
      const uy = years.map((y) => found.reduce((n, s) => n + u.bank.reduce((m, t) => m + (s.topicYear.get(t)?.get(y) ?? 0), 0), 0));
      return {
        name: u.name, items: u.items, bank: u.bank,
        marks: found.reduce((n, s) => n + u.bank.reduce((m, t) => m + (s.topicMarks.get(t) ?? 0), 0), 0),
        questions: found.reduce((n, s) => n + u.bank.reduce((m, t) => m + (s.topics.get(t) ?? 0), 0), 0),
        byYear: uy, yearsAsked: uy.filter((v) => v > 0).length,
        itemStats: (() => {
          const tags = u.items.map((it) => tagForItem(it, u.bank));
          return u.items.map((it, i) => {
            const tag = tags[i];
            const marks = tag ? found.reduce((n, s) => n + (s.topicMarks.get(tag) ?? 0), 0) : 0;
            const questions = tag ? found.reduce((n, s) => n + (s.topics.get(tag) ?? 0), 0) : 0;
            return { name: it, tag, marks, questions, shared: tag ? tags.filter((t) => t === tag).length : 0 };
          });
        })(),
      };
    });
    return { ...sec, slug: sectionSlug(sec.title), marks, questions, share: (marks / total) * 100, perPaper: marks / (papers.length || 1), byYear, units, links: found.map((s) => ({ name: s.name, slug: s.slug, count: s.count })) };
  });

  const groups = SYLLABUS_GROUPS.map((g) => {
    const secs = sections.filter((s) => s.group === g.name);
    return { ...g, slug: sectionSlug(g.name), sections: secs, share: secs.reduce((n, s) => n + s.share, 0), marks: secs.reduce((n, s) => n + s.marks, 0) };
  });
  return { years, papers: papers.length, total, perYearTotal, sections, groups };
}
