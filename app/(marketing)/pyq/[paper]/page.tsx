import { AdSlot } from "@/components/ads/ad-slot";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { allPapers, paperBySlug, paperQuestions, plainText } from "@/lib/seo/pyq";

export const dynamicParams = false;
export function generateStaticParams() {
  return allPapers().map((p) => ({ paper: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ paper: string }> }): Promise<Metadata> {
  const p = paperBySlug((await params).paper);
  if (!p) return {};
  const title = `${p.label} Question Paper with Official Answers — All ${p.count} Questions | RENYXERA`;
  const description = `All ${p.count} questions of the ${p.label} paper (${p.marks} marks), each with the official answer. Practise the full paper in a timed, exam-like simulator — free.`;
  return { title, description, alternates: { canonical: `/pyq/${p.slug}` }, openGraph: { title, description, type: "article" } };
}

export default async function PaperPage({ params }: { params: Promise<{ paper: string }> }) {
  const p = paperBySlug((await params).paper);
  if (!p) notFound();
  const qs = paperQuestions(p.slug);
  const sections = [...new Set(qs.map((q) => q.section || "Questions"))];
  return (
    <div className="py-10 sm:py-14 space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm"><Link href="/pyq" className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-violet-600"><ArrowLeft className="w-4 h-4" /> All GATE CS papers</Link></nav>
      <header className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">{p.label}</h1>
          <p className="mt-2 text-[var(--text-secondary)]">{p.count} questions · {p.marks} marks · 180 minutes</p>
        </div>
        <Link href="/setup" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-violet-500/25"><Play className="w-4 h-4 fill-current" /> Take this paper as a timed test</Link>
      </header>
      <AdSlot />
      {sections.map((sec) => (
        <section key={sec} aria-label={sec}>
          <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[var(--text-muted)] mb-3">{sec}</h2>
          <ol className="divide-y divide-[var(--border-subtle)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            {qs.filter((q) => (q.section || "Questions") === sec).map((q) => (
              <li key={q.question_id}>
                <Link href={`/pyq/${p.slug}/q${q.question_no}`} className="flex gap-4 p-4 hover:bg-[var(--surface-secondary)]/50 transition-colors">
                  <span className="w-10 shrink-0 font-num font-extrabold text-violet-600 dark:text-violet-400">Q{q.question_no}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-[var(--text-primary)] line-clamp-2">{plainText(q, 180) || "Question with a figure"}</span>
                    <span className="mt-1 block text-[11px] text-[var(--text-muted)]">{q.subject} · {q.topic} · {q.question_type} · {q.marks} mark{Number(q.marks) > 1 ? "s" : ""}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
