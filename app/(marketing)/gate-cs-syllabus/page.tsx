import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { subjects } from "@/lib/seo/pyq";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { SYLLABUS as SECTIONS } from "@/lib/seo/syllabus";

export const metadata: Metadata = {
  title: "GATE CS Syllabus 2027 — Topic-wise with Past-Paper Weightage | RENYXERA",
  description: "The complete GATE Computer Science & IT syllabus, section by section, with how many marks each subject has carried in GATE CS papers since 2017 and links to every past question.",
  alternates: { canonical: "/gate-cs-syllabus" },
  openGraph: { title: "GATE CS Syllabus with Past-Paper Weightage", description: "Every GATE CS section with its real marks weightage and past questions.", type: "article" },
};



export default function SyllabusPage() {
  const subs = subjects();
  const bySubject = new Map(subs.map((s) => [s.name, s]));
  const total = subs.reduce((n, s) => n + s.marks, 0);
  const rows = SECTIONS.map((sec) => {
    const found = sec.subjects.map((n) => bySubject.get(n)).filter((x): x is NonNullable<typeof x> => !!x);
    const marks = found.reduce((n, s) => n + s.marks, 0);
    return { ...sec, found, marks, share: total ? (marks / total) * 100 : 0 };
  });
  const maxShare = Math.max(...rows.map((r) => r.share), 1);

  return (
    <div className="py-10 sm:py-14 max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">GATE CS &amp; IT</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">GATE CS syllabus, with real weightage</h1>
      <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">The full GATE Computer Science &amp; IT syllabus, section by section. Next to each section is the share of marks it has actually carried in GATE CS papers since 2017, from our bank of every official question — so you can see where the marks are before you plan.</p>
      <p className="mt-2 text-[11px] text-[var(--text-muted)]">Syllabus structure as published for recent GATE editions; always confirm against the organising IIT&apos;s official brochure for your exam year.</p>

      <ol className="mt-8 space-y-4">
        {rows.map((r) => (
          <li key={r.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-extrabold text-[var(--text-primary)]">{r.title}</h2>
              <span className="shrink-0 text-right">
                <span className="block font-num font-extrabold text-violet-600 dark:text-violet-400">{r.share.toFixed(1)}%</span>
                <span className="block text-[10px] text-[var(--text-muted)]">{r.marks} marks since 2017</span>
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${(r.share / maxShare) * 100}%` }} /></div>
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{r.topics}</p>
            {r.found.length > 0 && (
              <p className="mt-3 flex flex-wrap gap-2">
                {r.found.map((s) => (
                  <Link key={s.slug} href={`/topics/${s.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">{s.name} PYQs ({s.count}) <ArrowRight className="w-3 h-3" /></Link>
                ))}
              </p>
            )}
          </li>
        ))}
      </ol>

      <SponsorSlot context="algorithms data structures" seed={2} />

      <p className="text-sm text-[var(--text-secondary)]">Next: <Link href="/tools/gate-cs-cutoff" className="font-semibold text-violet-600 dark:text-violet-400">cutoffs and marks vs rank</Link> · <Link href="/tools/gate-score-calculator" className="font-semibold text-violet-600 dark:text-violet-400">score &amp; rank predictor</Link> · <Link href="/pyq" className="font-semibold text-violet-600 dark:text-violet-400">all PYQs</Link></p>
    </div>
  );
}
