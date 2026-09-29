import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";
import { allPapers, subjects } from "@/lib/seo/pyq";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { SYLLABUS, SYLLABUS_SOURCE } from "@/lib/seo/syllabus";

export const metadata: Metadata = {
  title: "GATE CS Syllabus 2027 (Official, IIT Madras) — Topic-wise Weightage | RENYXERA",
  description: "The official GATE 2027 Computer Science & IT syllabus from IIT Madras, section by section, with the marks weightage of every subject and every topic in GATE CS papers since 2017, and links to all past questions.",
  alternates: { canonical: "/gate-cs-syllabus" },
  openGraph: { title: "GATE CS 2027 Syllabus with Topic-wise Weightage", description: "Official GATE 2027 syllabus with the real marks weightage of every section and topic.", type: "article" },
};

const GROUPS = ["General Aptitude", "Engineering Mathematics", "Core CS"] as const;
const anchor = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function SyllabusPage() {
  const subs = subjects();
  const bySubject = new Map(subs.map((s) => [s.name, s]));
  const total = subs.reduce((n, s) => n + s.marks, 0);
  const papers = allPapers().length || 1;
  const years = [...new Set(allPapers().map((p) => p.year))].sort();
  const rows = SYLLABUS.map((sec) => {
    const found = sec.subjects.map((n) => bySubject.get(n)).filter((x): x is NonNullable<typeof x> => !!x);
    const marks = found.reduce((n, s) => n + s.marks, 0);
    const topicRows = found
      .flatMap((s) => [...s.topicMarks.entries()].map(([topic, m]) => ({ topic, marks: m, count: s.topics.get(topic) ?? 0, subject: s.name })))
      .sort((a, b) => b.marks - a.marks);
    return { ...sec, found, marks, topicRows, share: total ? (marks / total) * 100 : 0, perPaper: marks / papers };
  });
  const maxShare = Math.max(...rows.map((r) => r.share), 1);
  const groupShare = (g: string) => rows.filter((r) => r.group === g).reduce((n, r) => n + r.share, 0);

  return (
    <div className="py-10 sm:py-14">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">{SYLLABUS_SOURCE.exam} · CS &amp; IT · official</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">GATE CS 2027 syllabus, with topic-wise weightage</h1>
      <p className="mt-3 max-w-3xl text-[var(--text-secondary)] leading-relaxed">The syllabus below is the official {SYLLABUS_SOURCE.exam} Computer Science &amp; IT and General Aptitude syllabus published by {SYLLABUS_SOURCE.institute}, the organising institute. For every section and every topic inside it, we show the marks it has actually carried in GATE CS papers from {years[0]} to {years[years.length - 1]}.</p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <a href={SYLLABUS_SOURCE.cs} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] font-semibold text-[var(--text-primary)] hover:border-violet-500/50"><FileText className="w-4 h-4 text-violet-500" /> Official CS syllabus (PDF) <ExternalLink className="w-3 h-3" /></a>
        <a href={SYLLABUS_SOURCE.ga} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] font-semibold text-[var(--text-primary)] hover:border-violet-500/50"><FileText className="w-4 h-4 text-violet-500" /> Official GA syllabus (PDF) <ExternalLink className="w-3 h-3" /></a>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
        {GROUPS.map((g) => (
          <a key={g} href={`#${anchor(g)}`} className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-3 sm:p-4 hover:border-violet-500/50 transition-colors">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] leading-tight">{g}</p>
            <p className="text-xl sm:text-2xl font-extrabold font-num text-[var(--text-primary)]">{groupShare(g).toFixed(1)}%</p>
            <p className="hidden sm:block text-xs text-[var(--text-secondary)]">≈ {Math.round((groupShare(g) / 100) * 100)} of 100 marks per paper</p>
          </a>
        ))}
      </div>

      <nav aria-label="Sections" className="sticky top-16 z-10 -mx-4 sm:mx-0 mt-6 px-4 sm:px-0 py-2 bg-[var(--background)]/85 backdrop-blur-xl">
        <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {rows.map((r, i) => (
            <li key={r.title} className="shrink-0"><a href={`#${anchor(r.title)}`} className="block px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--text-secondary)] hover:text-violet-600 hover:border-violet-500/50 whitespace-nowrap">{i === 0 ? "GA" : i}. {r.title} <span className="font-num text-[var(--text-muted)]">{r.share.toFixed(0)}%</span></a></li>
          ))}
        </ul>
      </nav>

      {GROUPS.map((g) => (
        <section key={g} id={anchor(g)} className="mt-8 scroll-mt-32">
          <h2 className="text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)] mb-3">{g}</h2>
          <ol className="space-y-4">
            {rows.filter((r) => r.group === g).map((r) => {
              const maxTopic = r.topicRows[0]?.marks || 1;
              return (
                <li key={r.title} id={anchor(r.title)} className="scroll-mt-32 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-extrabold text-[var(--text-primary)]">{r.title}</h3>
                    <span className="shrink-0 text-right">
                      <span className="block font-num font-extrabold text-violet-600 dark:text-violet-400">{r.share.toFixed(1)}%</span>
                      <span className="block text-[10px] text-[var(--text-muted)]">≈ {r.perPaper.toFixed(1)} marks / paper</span>
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${(r.share / maxShare) * 100}%` }} /></div>
                  <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed"><span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mr-1.5">Official syllabus</span>{r.topics}</p>

                  {r.topicRows.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-2">Topic weightage · marks since {years[0]}</p>
                      <ol className="space-y-1.5">
                        {r.topicRows.map((t) => (
                          <li key={`${t.subject}-${t.topic}`} className="grid grid-cols-[minmax(0,1fr)_4.5rem] sm:grid-cols-[minmax(0,1fr)_10rem_4.5rem] items-center gap-3 text-sm">
                            <span className="min-w-0 truncate text-[var(--text-primary)]" title={t.topic}>{t.topic}</span>
                            <span className="hidden sm:block h-1.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" style={{ width: `${(t.marks / maxTopic) * 100}%` }} /></span>
                            <span className="text-right font-num text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">{r.marks ? Math.round((t.marks / r.marks) * 100) : 0}%</b> · {t.marks}m</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {r.found.length > 0 && (
                    <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {r.found.map((s) => (
                        <Link key={s.slug} href={`/topics/${s.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">{s.name} PYQs ({s.count}) <ArrowRight className="w-3 h-3" /></Link>
                      ))}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <SponsorSlot context="algorithms data structures" seed={2} />

      <p className="text-[11px] text-[var(--text-muted)]">Syllabus text: {SYLLABUS_SOURCE.exam} official syllabus, {SYLLABUS_SOURCE.institute} (<a href={SYLLABUS_SOURCE.page} target="_blank" rel="noopener noreferrer" className="underline">source</a>). Weightage: computed from our tagged bank of every official GATE CS paper; percentages within a section are shares of that section&apos;s marks.</p>
    </div>
  );
}
