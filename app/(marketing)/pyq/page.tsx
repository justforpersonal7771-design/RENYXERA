import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, FileText, Layers } from "lucide-react";
import { allPapers, subjects } from "@/lib/seo/pyq";

export const metadata: Metadata = {
  title: "GATE CS Previous Year Questions (2017–2026) — Free, Paper-wise & Topic-wise | RENYXERA",
  description: "Every official GATE Computer Science paper from 2017 to 2026, question by question, with the official answers and an exam-like practice simulator. Browse paper-wise or topic-wise.",
  alternates: { canonical: "/pyq" },
  openGraph: { title: "GATE CS Previous Year Questions (2017–2026)", description: "Every official GATE CS paper, question by question, with official answers.", type: "website" },
};

export default function PyqIndexPage() {
  const papers = allPapers();
  const subs = subjects();
  const total = papers.reduce((s, p) => s + p.count, 0);
  const years = [...new Set(papers.map((p) => p.year))];
  return (
    <div className="py-10 sm:py-14 space-y-12">
      <header className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Free · no sign-up needed</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">GATE CS previous year questions</h1>
        <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">{total} official questions from {papers.length} GATE Computer Science papers ({years[years.length - 1]}–{years[0]}). Open any question to read it and check the official answer, or practise a whole paper in our exam-like simulator.</p>
        <Link href="/tools/gate-score-calculator" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400">Estimate your GATE score &amp; rank <ArrowRight className="w-4 h-4" /></Link>
      </header>

      <section aria-labelledby="papers">
        <h2 id="papers" className="text-lg font-extrabold text-[var(--text-primary)] mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-violet-500" /> Paper-wise</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {papers.map((p) => (
            <li key={p.slug}>
              <Link href={`/pyq/${p.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-violet-500/50 transition-colors">
                <span>
                  <span className="block font-bold text-[var(--text-primary)]">{p.label}</span>
                  <span className="text-xs text-[var(--text-muted)]">{p.count} questions · {p.marks} marks</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-violet-500 group-hover:translate-x-0.5 transition" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="topics">
        <h2 id="topics" className="text-lg font-extrabold text-[var(--text-primary)] mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-violet-500" /> Subject-wise</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subs.map((s) => (
            <li key={s.slug}>
              <Link href={`/topics/${s.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-violet-500/50 transition-colors">
                <span className="min-w-0">
                  <span className="block font-bold text-[var(--text-primary)] truncate">{s.name}</span>
                  <span className="text-xs text-[var(--text-muted)]">{s.count} questions · {s.topics.size} topics · {s.marks} marks since {years[years.length - 1]}</span>
                </span>
                <BookOpen className="w-4 h-4 text-[var(--text-muted)] group-hover:text-violet-500 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
