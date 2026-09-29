import type { Metadata } from "next";
import Link from "next/link";
import { allPapers, allQuestions, subjectSlug } from "@/lib/seo/pyq";
import { SponsorSlot } from "@/components/ads/sponsor-slot";

export const metadata: Metadata = {
  title: "Most Repeated GATE CS Topics (2017–2026) — Data from Every Paper | RENYXERA",
  description: "Which GATE CS topics come every year? A ranking of topics by how many years they appeared in and the marks they carried, computed from every official GATE CS paper since 2017.",
  alternates: { canonical: "/articles/most-repeated-gate-cs-topics" },
  openGraph: { title: "Most Repeated GATE CS Topics (2017–2026)", description: "Topics ranked by years appeared and marks, from every official paper.", type: "article" },
};

export default function MostRepeatedTopics() {
  const papers = allPapers();
  const years = [...new Set(papers.map((p) => p.year))].sort();
  const yearOf = (id: string) => id.match(/_(\d{4})_/)?.[1] ?? "";
  const map = new Map<string, { topic: string; subject: string; years: Set<string>; marks: number; count: number }>();
  for (const q of allQuestions()) {
    const key = `${q.subject}::${q.topic}`;
    if (!map.has(key)) map.set(key, { topic: q.topic || "Other", subject: q.subject || "General", years: new Set(), marks: 0, count: 0 });
    const e = map.get(key)!;
    e.years.add(yearOf(q.question_id)); e.marks += Number(q.marks || 0); e.count++;
  }
  const ranked = [...map.values()].sort((a, b) => b.years.size - a.years.size || b.marks - a.marks).slice(0, 40);
  const everyYear = ranked.filter((t) => t.years.size === years.length);

  return (
    <article className="py-10 sm:py-14 max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Data from {papers.length} official papers</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">Most repeated GATE CS topics ({years[0]}–{years[years.length - 1]})</h1>
      <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">We tagged every question of every GATE Computer Science paper from {years[0]} to {years[years.length - 1]} by subject and topic. This ranking shows which topics come back year after year, and how many marks they carried in total — the safest places to spend revision time.</p>
      {everyYear.length > 0 && (
        <p className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-200">
          <b>Asked in every one of the {years.length} years:</b> {everyYear.map((t) => t.topic).join(", ")}.
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <th className="px-4 py-3">#</th><th className="px-4 py-3">Topic</th><th className="px-4 py-3">Years asked</th><th className="px-4 py-3">Marks</th><th className="px-4 py-3 hidden sm:table-cell">Questions</th>
          </tr></thead>
          <tbody>
            {ranked.map((t, i) => (
              <tr key={`${t.subject}-${t.topic}`} className="border-b border-[var(--border-subtle)] last:border-0 align-top">
                <td className="px-4 py-2.5 font-num text-[var(--text-muted)]">{i + 1}</td>
                <td className="px-4 py-2.5"><span className="block font-semibold text-[var(--text-primary)]">{t.topic}</span><Link href={`/topics/${subjectSlug(t.subject)}`} className="text-xs text-violet-600 dark:text-violet-400 hover:underline">{t.subject}</Link></td>
                <td className="px-4 py-2.5 font-num"><b>{t.years.size}</b> / {years.length}</td>
                <td className="px-4 py-2.5 font-num">{t.marks}</td>
                <td className="px-4 py-2.5 font-num hidden sm:table-cell text-[var(--text-secondary)]">{t.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SponsorSlot context="algorithms" seed={5} />

      <h2 className="text-xl font-extrabold text-[var(--text-primary)]">How to use this</h2>
      <ul className="mt-3 list-disc pl-5 space-y-2 text-[var(--text-secondary)]">
        <li>Master the topics at the top first — they appear almost every year and are the most predictable marks.</li>
        <li>Open each subject page to solve that topic&apos;s past questions, then take a timed subject test in the simulator.</li>
        <li>Plan the time with the <Link href="/tools/gate-study-plan" className="font-semibold text-violet-600 dark:text-violet-400">study-plan generator</Link>, which uses the same data.</li>
      </ul>
      <p className="mt-6 text-[11px] text-[var(--text-muted)]">Computed automatically from our tagged bank of official GATE CS papers; papers with two shifts count both. Updated after every GATE.</p>
    </article>
  );
}
