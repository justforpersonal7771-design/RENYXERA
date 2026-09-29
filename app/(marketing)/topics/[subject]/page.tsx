import { SponsorSlot } from "@/components/ads/sponsor-slot";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { allPapers, allQuestions, plainText, subjects } from "@/lib/seo/pyq";

export const dynamicParams = false;
export function generateStaticParams() {
  return subjects().map((s) => ({ subject: s.slug }));
}

const bySlug = (slug: string) => subjects().find((s) => s.slug === slug) ?? null;

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const s = bySlug((await params).subject);
  if (!s) return {};
  const title = `GATE CS ${s.name} PYQs — Topic-wise Questions & Weightage | RENYXERA`;
  const description = `${s.count} previous-year GATE CS questions on ${s.name} across ${s.topics.size} topics, with year-wise marks weightage and official answers. Practise topic-wise free.`;
  return { title, description, alternates: { canonical: `/topics/${s.slug}` }, openGraph: { title, description, type: "article" } };
}

export default async function SubjectHub({ params }: { params: Promise<{ subject: string }> }) {
  const s = bySlug((await params).subject);
  if (!s) notFound();
  const papers = allPapers();
  const years = [...new Set(papers.map((p) => p.year))].sort();
  const maxYear = Math.max(1, ...years.map((y) => s.byYear.get(y) ?? 0));
  const topics = [...s.topics.entries()].sort((a, b) => b[1] - a[1]);
  const qs = allQuestions().filter((q) => (q.subject || "General") === s.name);
  const paperOf = (id: string) => papers.find((p) => id.includes(`_${p.yearShift.replace("-", "_")}_`));

  return (
    <div className="py-10 sm:py-14 space-y-10">
      <nav aria-label="Breadcrumb" className="text-sm"><Link href="/pyq" className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-violet-600"><ArrowLeft className="w-4 h-4" /> All GATE CS PYQs</Link></nav>
      <header className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">{s.name} — GATE CS previous year questions</h1>
          <p className="mt-2 text-[var(--text-secondary)]">{s.count} questions · {s.topics.size} topics · {s.marks} marks across {years.length} years of papers.</p>
        </div>
        <Link href="/setup" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-violet-500/25"><Play className="w-4 h-4 fill-current" /> Practise {s.name}</Link>
      </header>

      <section aria-labelledby="weightage" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 id="weightage" className="font-extrabold text-[var(--text-primary)] mb-4">Marks per year</h2>
        <ol className="space-y-2">
          {years.map((y) => {
            const m = s.byYear.get(y) ?? 0;
            return (
              <li key={y} className="grid grid-cols-[3.5rem_1fr_3rem] items-center gap-3 text-sm">
                <span className="font-num font-bold text-[var(--text-secondary)]">{y}</span>
                <span className="h-2.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${(m / maxYear) * 100}%` }} /></span>
                <span className="font-num text-right text-[var(--text-primary)]">{m}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[11px] text-[var(--text-muted)]">Total marks from {s.name} questions in each year&apos;s GATE CS papers (both shifts counted where there were two).</p>
      </section>

      <SponsorSlot context={s.name} seed={s.count} />

      <section aria-labelledby="topics">
        <h2 id="topics" className="font-extrabold text-[var(--text-primary)] mb-3">Topics</h2>
        <ul className="flex flex-wrap gap-2">
          {topics.map(([t, n]) => <li key={t} className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm text-[var(--text-primary)]">{t} <span className="text-[var(--text-muted)]">· {n}</span></li>)}
        </ul>
      </section>

      <section aria-labelledby="questions">
        <h2 id="questions" className="font-extrabold text-[var(--text-primary)] mb-3">All {s.name} questions</h2>
        <ol className="divide-y divide-[var(--border-subtle)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          {qs.map((q) => {
            const p = paperOf(q.question_id);
            return p ? (
              <li key={q.question_id}>
                <Link href={`/pyq/${p.slug}/q${q.question_no}`} className="flex gap-4 p-4 hover:bg-[var(--surface-secondary)]/50">
                  <span className="w-24 shrink-0 text-xs font-bold text-violet-600 dark:text-violet-400">{p.year} {p.shift} · Q{q.question_no}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-[var(--text-primary)] line-clamp-2">{plainText(q, 160) || "Question with a figure"}</span>
                    <span className="mt-1 block text-[11px] text-[var(--text-muted)]">{q.topic} · {q.question_type} · {q.marks} mark{Number(q.marks) > 1 ? "s" : ""}</span>
                  </span>
                </Link>
              </li>
            ) : null;
          })}
        </ol>
      </section>
    </div>
  );
}
