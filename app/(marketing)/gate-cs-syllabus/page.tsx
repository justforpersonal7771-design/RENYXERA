import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { TelegramJoinLink } from "@/components/growth/telegram-join";
import { TopicProgressNote, UnitProgressBadge } from "@/components/seo/topic-progress";
import { WhereToStart } from "@/components/seo/where-to-start";
import { SyllabusNavigator } from "@/components/seo/syllabus-navigator";
import { SYLLABUS_SOURCE } from "@/lib/seo/syllabus";
import { syllabusStats } from "@/lib/seo/weightage";
import { Donut, ShareBar, Sparkline, StatTile, TrendBadge } from "@/components/seo/charts";

export const metadata: Metadata = {
  title: "GATE CS Syllabus 2027 (Official, IIT Madras) — Topic-wise Weightage | RENYXERA",
  description: "The official GATE 2027 Computer Science & IT syllabus from IIT Madras, organised section → subject → topic, with the marks weightage and trend of every subject and topic in GATE CS papers since 2017.",
  alternates: { canonical: "/gate-cs-syllabus" },
  openGraph: { title: "GATE CS 2027 Syllabus with Topic-wise Weightage", description: "Official GATE 2027 syllabus with the real weightage and trend of every subject and topic.", type: "article" },
};

export default function SyllabusPage() {
  const { years, papers, sections, groups } = syllabusStats();
  const ranked = [...sections].sort((a, b) => b.share - a.share);
  const units = sections.reduce((n, s) => n + s.units.length, 0);
  const span = `${years[0]}–${years[years.length - 1]}`;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="w-full lg:flex lg:items-end lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">{SYLLABUS_SOURCE.exam} · official · {SYLLABUS_SOURCE.institute}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">GATE CS 2027 syllabus <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">with weightage</span></h1>
        <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">The official syllabus, organised into sections, subjects and topics — and next to every one, how many marks it has really carried in GATE CS papers from {span}, and whether it is rising or cooling.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <a href={SYLLABUS_SOURCE.cs} target="_blank" rel="noopener noreferrer" download className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-semibold text-[var(--text-primary)] hover:border-violet-500/50"><FileText className="w-4 h-4 text-violet-500" /> Download official GATE 2027 CS &amp; IT syllabus (PDF) <Download className="w-3.5 h-3.5" /></a>
          <Link href="/gate-2027-changes" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">What changed in GATE 2027</Link>
        </div>
        </div>
        <TelegramJoinLink where="syllabus" className="mt-5 lg:mt-0 lg:w-[26rem] lg:shrink-0" />
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Sections" value={groups.length} sub="Aptitude · Maths · Core" />
        <StatTile label="Subjects" value={sections.length} sub={`${units} topic units`} accent="sky" />
        <StatTile label="Papers analysed" value={papers} sub={span} accent="emerald" />
        <StatTile label="Top subject" value={`${ranked[0].share.toFixed(0)}%`} sub={ranked[0].title} accent="amber" />
      </div>

      {/* Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-extrabold text-[var(--text-primary)]">Where the 100 marks come from</h2>
          <p className="text-xs text-[var(--text-muted)] mb-5">Average share per paper, {span}</p>
          <Donut slices={groups.map((g) => ({ label: g.name, value: g.share }))} center="100" sub="marks" legend={false} />
          <ul className="mt-5 space-y-2">
            {groups.map((g) => (
              <li key={g.name}><a href={`#${g.slug}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 bg-[var(--surface-secondary)]/60 hover:bg-violet-500/10 transition-colors">
                <span className="min-w-0"><span className="block text-sm font-bold text-[var(--text-primary)]">{g.name}</span><span className="block text-[11px] text-[var(--text-muted)]">{g.blurb}</span></span>
                <span className="font-num font-extrabold text-violet-600 dark:text-violet-400">{g.share.toFixed(1)}%</span>
              </a></li>
            ))}
          </ul>
          <WhereToStart paper="CS" items={ranked.map((r) => ({ name: r.title, perPaper: r.perPaper, share: r.share, href: `#${r.slug}` }))} />
        </div>
        <div className="lg:col-span-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="font-extrabold text-[var(--text-primary)]">Subjects ranked by weightage</h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">Average marks per paper · trend = last 3 years vs earlier</p>
          <ol className="space-y-3">
            {ranked.map((s, i) => (
              <li key={s.title}>
                <a href={`#${s.slug}`} className="group grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-3">
                  <span className="font-num text-xs font-bold text-[var(--text-muted)]">{i + 1}</span>
                  <ShareBar label={s.title} value={s.share} max={ranked[0].share} right={`${s.perPaper.toFixed(1)} m`} />
                  <TrendBadge values={s.byYear} className="hidden sm:inline-flex" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_270px] xl:gap-6 items-start">
      <div className="min-w-0">
      {/* Sections → subjects → units */}
      <TopicProgressNote practiseHref="/setup?branch=CSE" />
      {groups.map((g, gi) => (
        <section key={g.name} id={g.slug} className="pt-4 first:pt-0 scroll-mt-4">
          <div className="flex items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-3 mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">Section {gi + 1}</p>
              <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">{g.name}</h2>
              <p className="text-xs text-[var(--text-muted)]">{g.blurb}</p>
            </div>
            <p className="text-right"><span className="block text-2xl font-extrabold font-num text-[var(--text-primary)]">{g.share.toFixed(1)}%</span><span className="text-[11px] text-[var(--text-muted)]">of marks</span></p>
          </div>
          <div className="space-y-4">
            {g.sections.map((s) => {
              const maxUnit = Math.max(1, ...s.units.map((u) => u.marks));
              return (
                <article key={s.title} id={s.slug} className="scroll-mt-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                  <header className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6 bg-gradient-to-r from-violet-500/[0.07] to-transparent border-b border-[var(--border-subtle)]">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{s.official}</p>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">{s.title}</h3>
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{s.questions} past questions · {s.marks} marks · ≈ {s.perPaper.toFixed(1)} marks / paper</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:block"><Sparkline values={s.byYear} /></div>
                      <div className="text-right"><p className="text-2xl font-extrabold font-num text-violet-600 dark:text-violet-400 leading-none">{s.share.toFixed(1)}%</p><TrendBadge values={s.byYear} className="mt-1" /></div>
                    </div>
                  </header>
                  <ol className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-subtle)]">
                    {s.units.map((u, ui) => (
                      <li key={u.name} className="bg-[var(--surface)] p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-bold text-[var(--text-primary)]"><span className="font-num text-[var(--text-muted)] mr-1.5">{ui + 1}.</span>{u.name}</p>
                          <p className="shrink-0 text-right font-num"><span className="font-extrabold text-[var(--text-primary)]">{s.marks ? Math.round((u.marks / s.marks) * 100) : 0}%</span><span className="block text-[10px] text-[var(--text-muted)]">{u.marks} marks</span></p>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden"><div className="chart-grow-x h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" style={{ width: `${Math.max(2, (u.marks / maxUnit) * 100)}%` }} /></div>
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {u.items.map((it) => <li key={it} className="px-2 py-0.5 rounded-md bg-[var(--surface-secondary)] text-[12px] text-[var(--text-secondary)]">{it}</li>)}
                        </ul>
                        <p className="mt-2"><UnitProgressBadge topics={u.bank} /></p>
                        <p className="mt-2 text-[11px] text-[var(--text-muted)]">{u.questions ? `Asked in ${u.yearsAsked} of ${years.length} years · ${u.questions} question${u.questions > 1 ? "s" : ""}` : "Not asked directly yet"}</p>
                      </li>
                    ))}
                  </ol>
                  {s.links.length > 0 && (
                    <footer className="flex flex-wrap gap-x-5 gap-y-2 px-5 sm:px-6 py-3 border-t border-[var(--border-subtle)]">
                      {s.links.map((l) => <Link key={l.slug} href={`/topics/${l.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">{l.name} · {l.count} PYQs &amp; analysis <ArrowRight className="w-3 h-3" /></Link>)}
                    </footer>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}

      </div>
      <SyllabusNavigator entries={sections.map((s) => ({ id: s.slug, title: s.title, group: s.group, share: s.share }))} />
      </div>

      <SponsorSlot context="algorithms data structures" seed={2} />

      <p className="text-[11px] text-[var(--text-muted)]">Syllabus: {SYLLABUS_SOURCE.exam} official syllabus, {SYLLABUS_SOURCE.institute} (<a href={SYLLABUS_SOURCE.page} target="_blank" rel="noopener noreferrer" className="underline">source</a>), organised into topic units by us. Weightage: computed from our tagged bank of every official GATE CS paper; a unit&apos;s % is its share of that subject&apos;s marks.</p>

    </div>
  );
}
