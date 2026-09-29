import type { Metadata } from "next";
import Link from "next/link";
import { allPapers, allQuestions, subjectSlug } from "@/lib/seo/pyq";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { Heatmap, Sparkline, StatTile, TrendBadge } from "@/components/seo/charts";

export const metadata: Metadata = {
  title: "Most Repeated GATE CS Topics (2017–2026) — Data from Every Paper | RENYXERA",
  description: "Which GATE CS topics come every year? A ranking of topics by how many years they appeared in and the marks they carried, with a year-by-year heatmap and trends, computed from every official GATE CS paper since 2017.",
  alternates: { canonical: "/articles/most-repeated-gate-cs-topics" },
  openGraph: { title: "Most Repeated GATE CS Topics (2017–2026)", description: "Topics ranked by years appeared and marks, from every official paper.", type: "article" },
};

const short = (x: string) => x.replace(/\s*\(.*?\)\s*/g, " ").trim();

export default function MostRepeatedTopics() {
  const papers = allPapers();
  const years = [...new Set(papers.map((p) => p.year))].sort();
  const yearOf = (id: string) => id.match(/_(\d{4})_/)?.[1] ?? "";
  const map = new Map<string, { topic: string; subject: string; years: Set<string>; marks: number; count: number; byYear: Map<string, number> }>();
  for (const q of allQuestions()) {
    const key = `${q.subject}::${q.topic}`;
    if (!map.has(key)) map.set(key, { topic: q.topic || "Other", subject: q.subject || "General", years: new Set(), marks: 0, count: 0, byYear: new Map() });
    const e = map.get(key)!;
    const y = yearOf(q.question_id);
    e.years.add(y); e.marks += Number(q.marks || 0); e.count++; e.byYear.set(y, (e.byYear.get(y) ?? 0) + Number(q.marks || 0));
  }
  const ranked = [...map.values()].sort((a, b) => b.years.size - a.years.size || b.marks - a.marks).slice(0, 40);
  const everyYear = ranked.filter((t) => t.years.size === years.length);
  const top15 = ranked.slice(0, 15);
  const series = (t: (typeof ranked)[number]) => years.map((y) => t.byYear.get(y) ?? 0);

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Data article · {papers.length} official papers</p>
        <h1 className="mt-1.5 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">Most repeated GATE CS topics ({years[0]}–{years[years.length - 1]})</h1>
        <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">We tagged every question of every GATE CS paper by subject and topic. These are the topics that come back year after year — the most predictable marks in the paper.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Topics tracked" value={map.size} sub={`${years.length} years`} />
        <StatTile label="Asked every year" value={everyYear.length} sub="never skipped" accent="emerald" />
        <StatTile label="#1 by marks" value={`${[...map.values()].sort((a, b) => b.marks - a.marks)[0].marks} m`} sub={short([...map.values()].sort((a, b) => b.marks - a.marks)[0].topic)} accent="amber" />
        <StatTile label="Top 15 share" value={`${Math.round((top15.reduce((n, t) => n + t.marks, 0) / [...map.values()].reduce((n, t) => n + t.marks, 0)) * 100)}%`} sub="of all marks" accent="sky" />
      </div>

      {everyYear.length > 0 && (
        <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5 sm:p-6">
          <h2 className="font-extrabold text-emerald-800 dark:text-emerald-200">Asked in every one of the {years.length} years</h2>
          <ul className="mt-3 flex flex-wrap gap-2">{everyYear.map((t) => <li key={t.topic}><Link href={`/topics/${subjectSlug(t.subject)}`} className="inline-block px-3 py-1.5 rounded-full bg-[var(--surface)] border border-emerald-500/30 text-sm font-semibold text-[var(--text-primary)] hover:border-emerald-500">{short(t.topic)} <span className="text-[var(--text-muted)] font-num">· {t.marks}m</span></Link></li>)}</ul>
        </section>
      )}

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="font-extrabold text-[var(--text-primary)]">Top 15 topics, year by year</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">Marks each topic carried in each year — darker is heavier.</p>
        <Heatmap cols={years} rows={top15.map((t) => ({ label: short(t.topic), cells: series(t) }))} />
      </section>

      <SponsorSlot context="algorithms" seed={5} />

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <h2 className="px-5 sm:px-6 pt-5 font-extrabold text-[var(--text-primary)]">Full ranking</h2>
        <p className="px-5 sm:px-6 text-xs text-[var(--text-muted)] mb-3">Sorted by years asked, then marks · each pip is a year</p>
        <ol className="divide-y divide-[var(--border-subtle)]">
          {ranked.map((t, i) => (
            <li key={`${t.subject}-${t.topic}`} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] sm:grid-cols-[2rem_minmax(0,1fr)_auto_auto_auto] items-center gap-3 px-5 sm:px-6 py-3">
              <span className="font-num font-bold text-[var(--text-muted)]">{i + 1}</span>
              <span className="min-w-0"><span className="block font-semibold text-[var(--text-primary)] truncate" title={t.topic}>{short(t.topic)}</span><Link href={`/topics/${subjectSlug(t.subject)}`} className="text-xs text-violet-600 dark:text-violet-400 hover:underline">{t.subject}</Link></span>
              <span className="flex gap-0.5" title={`${t.years.size} of ${years.length} years`}>{years.map((y) => <i key={y} className={`w-1.5 h-4 rounded-sm ${t.years.has(y) ? "bg-violet-500" : "bg-[var(--surface-secondary)]"}`} />)}</span>
              <span className="hidden sm:block"><Sparkline values={series(t)} width={72} height={22} /></span>
              <span className="hidden sm:flex items-center gap-2 font-num text-sm"><b className="text-[var(--text-primary)]">{t.marks}m</b><TrendBadge values={series(t)} /></span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="font-extrabold text-[var(--text-primary)]">How to use this</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2 text-[var(--text-secondary)]">
          <li>Master the green topics first — they appear every year and are the most predictable marks.</li>
          <li>Open each subject page to solve that topic&apos;s past questions, then take a timed subject test in the simulator.</li>
          <li>Plan the time with the <Link href="/tools/gate-study-plan" className="font-semibold text-violet-600 dark:text-violet-400">study-plan generator</Link>, which uses the same data.</li>
        </ul>
        <p className="mt-4 text-[11px] text-[var(--text-muted)]">Computed automatically from our tagged bank of official GATE CS papers; papers with two shifts count both. Updated after every GATE.</p>
      </section>
    </div>
  );
}
