import Link from "next/link";
import { TelegramJoinLink } from "@/components/growth/telegram-join";
import { ArrowRight, FileText } from "lucide-react";
import { branchByCode, type BranchCode } from "@/lib/branches";
import { branchSyllabusStats, officialSyllabusPdf } from "@/lib/seo/branch-syllabus";
import { WhereToStart } from "@/components/seo/where-to-start";
import { TopicProgressBadge, TopicProgressNote } from "@/components/seo/topic-progress";
import { Donut, ShareBar, Sparkline, StatTile, TrendBadge } from "@/components/seo/charts";

/** /gate-<ec|ee|me|da>-syllabus — official syllabus + weightage from our tagged official papers. */
export function BranchSyllabusPage({ code }: { code: BranchCode }) {
  const b = branchByCode(code)!;
  const s = branchSyllabusStats(code)!;
  const span = s.years.length ? `${s.years[0]}–${s.years[s.years.length - 1]}` : "";
  const subjects = s.sections.flatMap((sec) => sec.subjects).sort((a, z) => z.marks - a.marks);
  const max = subjects[0]?.marks || 1;
  const topicCount = s.sections.reduce((n, sec) => n + sec.subjects.reduce((m, x) => m + x.topics.length, 0), 0);
  const practise = `/setup?branch=${code}&utm_source=seo&utm_medium=syllabus&utm_campaign=${s.paper.toLowerCase()}`;

  return (
    <article className="w-full space-y-8">
      <header className="w-full lg:flex lg:items-end lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Official syllabus · GATE 2027</p>
        <h1 className="mt-1.5 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">GATE {s.paper} syllabus 2027 with topic-wise weightage</h1>
        <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">
          The official GATE 2027 {b.name} syllabus from IIT Madras, section by section, with how many marks each subject and topic carried
          in the {s.papers} official {s.paper} papers from {span}. General Aptitude (15 marks) is common to every paper and not included.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={practise} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-md shadow-violet-500/25 transition hover:-translate-y-0.5">
            Practise GATE {s.paper} PYQs free <ArrowRight className="w-4 h-4" />
          </Link>
          <a href={officialSyllabusPdf(s.paper)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <FileText className="w-4 h-4" /> Official syllabus PDF
          </a>
          <Link href="/gate-updates" className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">GATE updates</Link>
        </div>
        </div>
        <TelegramJoinLink where="syllabus" className="mt-5 lg:mt-0 lg:w-[26rem] lg:shrink-0" />
      </header>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
        <StatTile label="Sections" value={s.sections.length} sub="core syllabus" />
        <StatTile label="Subjects" value={subjects.length} sub={`${topicCount} topics`} accent="sky" />
        <StatTile label="Papers analysed" value={s.papers} sub={span} accent="emerald" />
        <StatTile label="Top subject" value={`${subjects[0].share.toFixed(0)}%`} sub={subjects[0].name} accent="amber" />
      </section>

      <section className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-6 items-start">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Marks by section</h2>
          <div className="mt-4"><Donut slices={s.sections.map((x) => ({ label: x.title.replace(/^SECTION \d+:\s*/i, ""), value: Math.round(x.marks) }))} center={`${s.coreMarks}`} sub="core marks" /></div>
          <WhereToStart paper={s.paper} items={subjects.map((x) => ({ name: x.name, perPaper: s.papers ? x.marks / s.papers : 0, share: x.share }))} />
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Subject weightage ({span})</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">Share of core marks across all {s.papers} papers · trend by year</p>
          <div className="mt-4 space-y-3">
            {subjects.map((x) => (
              <div key={x.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0"><ShareBar label={x.name} value={x.marks} max={max} right={`${x.share.toFixed(1)}%`} hint={`${x.questions} questions · ${x.marks} marks`} /></div>
                {s.years.length > 2 && <div className="hidden sm:flex items-center gap-1.5 shrink-0"><Sparkline values={x.byYear} /><TrendBadge values={x.byYear} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Most repeated topics</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">Ranked by how many years they were asked, then by marks ({span})</p>
        <ol className="mt-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-3">
          {s.topTopics.map((t, i) => (
            <li key={t.subject + t.name} className="flex gap-3 text-sm">
              <span className="w-6 shrink-0 font-num font-bold text-violet-600 dark:text-violet-400">{i + 1}</span>
              <span className="min-w-0"><span className="font-semibold text-[var(--text-primary)]">{t.name}</span>
                <span className="block text-xs text-[var(--text-muted)]">{t.subject} · {t.yearsAsked} of {s.years.length} years · {t.questions} Qs · {t.marks} marks</span></span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Full syllabus, topic by topic</h2>
        <TopicProgressNote practiseHref={practise} />
        {(["Engineering Mathematics", "Core"] as const).map((grp) => (
          <div key={grp} className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">{grp === "Core" ? `Core ${s.paper}` : grp} · {s.sections.filter((x) => x.group === grp).reduce((n, x) => n + x.share, 0).toFixed(0)}% of core marks</h3>
        {s.sections.filter((x) => x.group === grp).map((sec) => (
          <details key={sec.title} className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 open:shadow-sm" open={s.sections.length <= 4}>
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
              <span className="font-extrabold text-[var(--text-primary)]">{sec.title}</span>
              <span className="text-xs font-bold font-num text-[var(--text-muted)]">{sec.share.toFixed(1)}% · {sec.marks} marks</span>
            </summary>
            <div className="mt-4 space-y-5">
              {sec.subjects.map((sub) => (
                <div key={sub.name}>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{sub.name} <span className="font-normal text-[var(--text-muted)]">· {sub.questions} Qs, {sub.marks} marks</span></h3>
                  <ul className="mt-2 grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-1">
                    {sub.topics.map((t) => (
                      <li key={t.name} className="flex justify-between gap-3 text-sm text-[var(--text-secondary)] border-b border-[var(--border-subtle)] py-1">
                        <span className="min-w-0">{t.name}<TopicProgressBadge topic={t.name} /></span>
                        <span className={`shrink-0 font-num text-xs ${t.questions ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-muted)]"}`}>{t.questions ? `${t.questions} Qs · ${t.yearsAsked}y` : "not yet asked"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        ))}
          </div>
        ))}
      </section>

      <p className="text-xs text-[var(--text-muted)] max-w-3xl">
        Method: every question in the official GATE {s.paper} papers ({span}) was tagged by hand to one topic of the official syllabus above;
        weightage is the sum of marks. Syllabus wording is copied from the official GATE 2027 document, split at its own separators.
        Questions from both shifts of a year are counted.
      </p>
    </article>
  );
}
