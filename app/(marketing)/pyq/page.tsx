import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, FileText, Layers } from "lucide-react";
import { allPapers, subjects } from "@/lib/seo/pyq";
import { SYLLABUS, SYLLABUS_GROUPS } from "@/lib/seo/syllabus";
import { Sparkline, StatTile, TrendBadge } from "@/components/seo/charts";

export const metadata: Metadata = {
  title: "GATE CS Previous Year Questions (2017–2026) — Free, Paper-wise & Topic-wise | RENYXERA",
  description: "Every official GATE Computer Science paper from 2017 to 2026, question by question, with the official answers and an exam-like practice simulator. Browse paper-wise or subject-wise with weightage trends.",
  alternates: { canonical: "/pyq" },
  openGraph: { title: "GATE CS Previous Year Questions (2017–2026)", description: "Every official GATE CS paper, question by question, with official answers.", type: "website" },
};

export default function PyqIndexPage() {
  const papers = allPapers();
  const subs = subjects();
  const total = papers.reduce((s, p) => s + p.count, 0);
  const years = [...new Set(papers.map((p) => p.year))].sort();
  const groupOf = new Map(SYLLABUS.flatMap((s) => s.subjects.map((n) => [n, s.group] as const)));
  const byYear = [...years].reverse().map((y) => ({ y, papers: papers.filter((p) => p.year === y) }));

  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Free · no sign-up needed</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">GATE CS <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">previous year questions</span></h1>
        <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">Every official question from {papers.length} GATE Computer Science papers ({years[0]}–{years[years.length - 1]}), with the official answers. Open a paper to read it question by question, or a subject to see its weightage and trend.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Papers" value={papers.length} sub={`${years.length} years`} />
        <StatTile label="Questions" value={total.toLocaleString("en-IN")} sub="official answers" accent="sky" />
        <StatTile label="Subjects" value={subs.length} sub="with trends" accent="emerald" />
        <StatTile label="Latest" value={years[years.length - 1]} sub={byYear[0]?.papers.map((p) => p.shift).join(" · ")} accent="amber" />
      </div>

      <section aria-labelledby="papers">
        <h2 id="papers" className="text-xl font-extrabold text-[var(--text-primary)] mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-violet-500" /> Paper-wise</h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {byYear.map(({ y, papers: ps }) => (
            <li key={y} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 pl-4">
              <span className="text-2xl font-extrabold font-num text-[var(--text-primary)] w-16 shrink-0">{y}</span>
              <span className="flex flex-1 flex-wrap gap-2">
                {ps.map((p) => (
                  <Link key={p.slug} href={`/pyq/${p.slug}`} className="group flex-1 min-w-[8.5rem] flex items-center justify-between gap-2 rounded-xl px-3 py-2 bg-[var(--surface-secondary)]/70 hover:bg-violet-500/10 hover:ring-1 hover:ring-violet-500/40 transition">
                    <span><span className="block text-sm font-bold text-[var(--text-primary)]">{ps.length > 1 ? `Shift ${p.shift}` : "Paper"}</span><span className="block text-[11px] text-[var(--text-muted)]">{p.count} Qs · {p.marks} marks</span></span>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-violet-500 group-hover:translate-x-0.5 transition" />
                  </Link>
                ))}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="subjects">
        <h2 id="subjects" className="text-xl font-extrabold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-violet-500" /> Subject-wise</h2>
        <div className="space-y-6">
          {SYLLABUS_GROUPS.map((g) => {
            const list = subs.filter((s) => groupOf.get(s.name) === g.name);
            if (!list.length) return null;
            return (
              <div key={g.name}>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">{g.name} <span className="normal-case tracking-normal font-semibold">· {g.blurb}</span></p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((s) => {
                    const series = years.map((y) => s.byYear.get(y) ?? 0);
                    return (
                      <li key={s.slug}>
                        <Link href={`/topics/${s.slug}`} className="group flex flex-col h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-violet-500/50 hover:-translate-y-0.5 transition-all">
                          <span className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[var(--text-primary)] leading-snug">{s.name}</span>
                            <TrendBadge values={series} />
                          </span>
                          <span className="mt-3 flex items-end justify-between gap-3">
                            <span className="text-xs text-[var(--text-muted)]"><b className="text-lg font-extrabold font-num text-[var(--text-primary)]">{(s.marks / papers.length).toFixed(1)}</b> marks / paper<br />{s.count} Qs · {s.topics.size} topics</span>
                            <Sparkline values={series} />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
