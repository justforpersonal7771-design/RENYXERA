import { SponsorSlot } from "@/components/ads/sponsor-slot";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronDown, Play } from "lucide-react";
import { allPapers, allQuestions, plainText, subjects } from "@/lib/seo/pyq";
import { Donut, Heatmap, StatTile, TrendBadge, TrendColumns, trendOf } from "@/components/seo/charts";

export const dynamicParams = false;
export function generateStaticParams() {
  return subjects().map((s) => ({ subject: s.slug }));
}

const bySlug = (slug: string) => subjects().find((s) => s.slug === slug) ?? null;

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const s = bySlug((await params).subject);
  if (!s) return {};
  const title = `GATE CS ${s.name} PYQs — Topic-wise Questions & Weightage | RENYXERA`;
  const description = `${s.count} previous-year GATE CS questions on ${s.name} across ${s.topics.size} topics, with year-wise and topic-wise weightage, trends and official answers. Practise free.`;
  return { title, description, alternates: { canonical: `/topics/${s.slug}` }, openGraph: { title, description, type: "article" } };
}

export default async function SubjectHub({ params }: { params: Promise<{ subject: string }> }) {
  const s = bySlug((await params).subject);
  if (!s) notFound();
  const papers = allPapers();
  const years = [...new Set(papers.map((p) => p.year))].sort();
  const series = years.map((y) => s.byYear.get(y) ?? 0);
  const peakIdx = series.indexOf(Math.max(...series));
  const topics = [...s.topicMarks.entries()].sort((a, b) => b[1] - a[1]);
  const qs = allQuestions().filter((q) => (q.subject || "General") === s.name);
  const paperOf = (id: string) => papers.find((p) => id.includes(`_${p.yearShift.replace("-", "_")}_`));
  const t = trendOf(series);
  const byYearQs = [...years].reverse().map((y) => ({ y, list: qs.filter((q) => paperOf(q.question_id)?.year === y) })).filter((g) => g.list.length);
  const shortTopic = (x: string) => x.replace(/\s*\(.*?\)\s*/g, " ").trim();

  return (
    <div className="py-8 sm:py-12 space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm"><Link href="/pyq" className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-violet-600"><ArrowLeft className="w-4 h-4" /> All GATE CS PYQs</Link></nav>
      <header className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Subject analysis · {years[0]}–{years[years.length - 1]}</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">{s.name}</h1>
          <p className="mt-2 text-[var(--text-secondary)]">Every GATE CS question on {s.name}, with how the marks are spread across years and topics.</p>
        </div>
        <Link href="/setup" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-violet-500/25"><Play className="w-4 h-4 fill-current" /> Practise {s.name}</Link>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Questions" value={s.count} sub={`${s.topics.size} topics`} />
        <StatTile label="Avg marks / paper" value={(s.marks / (papers.length || 1)).toFixed(1)} sub={`${s.marks} marks in total`} accent="sky" />
        <StatTile label="Peak year" value={years[peakIdx] ?? "—"} sub={`${series[peakIdx] ?? 0} marks`} accent="amber" />
        <StatTile label="Trend" value={t.dir === "up" ? "Rising" : t.dir === "down" ? "Cooling" : "Steady"} sub={t.dir === "flat" ? "last 3 yrs ≈ earlier" : `${t.pct > 0 ? "+" : ""}${t.pct}% last 3 yrs`} accent={t.dir === "up" ? "emerald" : t.dir === "down" ? "rose" : "violet"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <section aria-labelledby="by-year" className="lg:col-span-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div><h2 id="by-year" className="font-extrabold text-[var(--text-primary)]">Marks per year</h2><p className="text-xs text-[var(--text-muted)]">Both shifts counted where there were two · peak highlighted</p></div>
            <TrendBadge values={series} />
          </div>
          <TrendColumns data={years.map((y, i) => ({ label: y, value: series[i] }))} />
        </section>
        <section aria-labelledby="topic-share" className="lg:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 id="topic-share" className="font-extrabold text-[var(--text-primary)]">Topic share</h2>
          <p className="text-xs text-[var(--text-muted)] mb-5">Share of {s.name}&apos;s {s.marks} marks</p>
          <Donut slices={topics.map(([k, v]) => ({ label: shortTopic(k), value: v }))} center={String(s.topics.size)} sub="topics" size={150} />
        </section>
      </div>

      <section aria-labelledby="heat" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 id="heat" className="font-extrabold text-[var(--text-primary)]">Topic × year heatmap</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">Marks from each topic in each year — darker is heavier. Topics that light up every column are the safest bets.</p>
        <Heatmap cols={years} rows={topics.map(([k]) => ({ label: shortTopic(k), cells: years.map((y) => s.topicYear.get(k)?.get(y) ?? 0) }))} />
      </section>

      <SponsorSlot context={s.name} seed={s.count} />

      <section aria-labelledby="questions">
        <h2 id="questions" className="font-extrabold text-[var(--text-primary)] mb-3">All {s.count} {s.name} questions</h2>
        <div className="space-y-3">
          {byYearQs.map((g, gi) => (
            <details key={g.y} open={gi === 0} className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              <summary className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="font-extrabold text-[var(--text-primary)]">{g.y} <span className="ml-2 text-xs font-semibold text-[var(--text-muted)]">{g.list.length} questions · {s.byYear.get(g.y) ?? 0} marks</span></span>
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" />
              </summary>
              <ol className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
                {g.list.map((q) => {
                  const p = paperOf(q.question_id)!;
                  return (
                    <li key={q.question_id}>
                      <Link href={`/pyq/${p.slug}/q${q.question_no}`} className="flex gap-4 p-4 hover:bg-[var(--surface-secondary)]/50">
                        <span className="w-20 shrink-0 text-xs font-bold text-violet-600 dark:text-violet-400">{p.shift} · Q{q.question_no}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm text-[var(--text-primary)] line-clamp-2">{plainText(q, 160) || "Question with a figure"}</span>
                          <span className="mt-1 block text-[11px] text-[var(--text-muted)]">{shortTopic(q.topic || "")} · {q.question_type} · {q.marks} mark{Number(q.marks) > 1 ? "s" : ""}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
