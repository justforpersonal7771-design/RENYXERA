import Link from "next/link";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { syllabusStats, sectionSlug } from "@/lib/seo/weightage";
import { StatTile, TrendBadge } from "@/components/seo/charts";
import { BRANCHES, branchByCode, type BranchCode } from "@/lib/branches";
import { branchSyllabusStats, syllabusSlugOf } from "@/lib/seo/branch-syllabus";
import { mostRepeatedHref, plan150Href } from "@/lib/seo/branch-links";

const LEARN = 90, REVISE = 35, MOCKS = 25;

type PlanRow = { title: string; slug: string; share: number; perPaper: number; byYear: number[]; href: string };

/** One shape for every branch: CS comes from the CS syllabus model, the other papers from their syllabus files. */
function planRows(code: BranchCode): { years: string[]; rows: PlanRow[] } {
  if (code === "CSE") {
    const { years, sections } = syllabusStats();
    return { years, rows: sections.map((s) => ({ title: s.title, slug: s.slug, share: s.share, perPaper: s.perPaper, byYear: s.byYear, href: `/gate-cs-syllabus#${s.slug}` })) };
  }
  const st = branchSyllabusStats(code)!;
  return {
    years: st.years,
    rows: st.sections.map((sec) => ({
      title: sec.title, slug: sectionSlug(sec.title), share: sec.share, perPaper: st.papers ? sec.marks / st.papers : 0,
      byYear: st.years.map((_, i) => sec.subjects.reduce((n, sub) => n + (sub.byYear[i] ?? 0), 0)), href: `/${syllabusSlugOf(code)}`,
    })),
  };
}

export function Plan150Article({ code }: { code: BranchCode }) {
  const paper = branchByCode(code)!.paper;
  const { years, rows: planned } = planRows(code);
  const ranked = [...planned].sort((a, b) => b.share - a.share);
  const total = ranked.reduce((n, s) => n + s.share, 0) || 1;
  // Days per subject in the learning phase, proportional to weightage, at least 1 day each.
  const raw = ranked.map((s) => ({ s, d: Math.max(1, (s.share / total) * LEARN) }));
  const scale = LEARN / raw.reduce((n, r) => n + r.d, 0);
  let day = 1;
  const rows = raw.map(({ s, d }) => { const days = Math.max(1, Math.round(d * scale)); const from = day; day += days; return { s, days, from, to: day - 1 }; });
  const rising = ranked.filter((s) => { const v = s.byYear; const r = v.slice(-3).reduce((a, b) => a + b, 0) / 3; const e = v.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, v.length - 3); return r > e * 1.12; }).slice(0, 5);

  return (
    <div className="space-y-6">
      <header className="w-full">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Study guide · built from {years.length} years of papers</p>
        <h1 className="mt-1.5 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">How to prepare for GATE {paper} in 150 days</h1>
        <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">150 days is enough to cover the whole syllabus once, revise it with past papers, and sit a month of full mocks — if every day goes where the marks are. This plan gives each subject a number of days proportional to the marks it has actually carried in GATE {paper} papers from {years[0]} to {years[years.length - 1]}.</p>
      </header>

      <nav aria-label="Choose your paper" className="flex flex-wrap gap-2">
        {BRANCHES.filter((b) => b.live).map((b) => (
          <Link key={b.code} href={plan150Href(b.code)} aria-current={b.code === code ? "page" : undefined}
            className={`h-9 inline-flex items-center rounded-full px-4 text-sm font-bold border ${b.code === code ? "border-violet-600 bg-violet-600 text-white" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"}`}>GATE {b.paper}</Link>
        ))}
      </nav>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Phase 1 · Learn" value={`${LEARN} days`} sub="concepts + topic PYQs" />
        <StatTile label="Phase 2 · Revise" value={`${REVISE} days`} sub="mistakes, weak topics" accent="amber" />
        <StatTile label="Phase 3 · Mocks" value={`${MOCKS} days`} sub="full 3-hour papers" accent="rose" />
        <StatTile label="Daily study" value="5–6 h" sub="≈ 800 hours in total" accent="sky" />
      </div>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Phase 1 — Days 1 to {LEARN}: learn in order of weightage</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Heaviest subjects first, so the marks that matter most get the freshest energy and the most revision cycles later. Finish each subject with its full set of past questions before moving on.</p>
        <ol className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {rows.map((r, i) => (
            <li key={r.s.title} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-[var(--surface-secondary)]/60 px-3 py-2.5">
              <span className="font-num text-sm font-bold text-[var(--text-muted)]">{i + 1}</span>
              <span className="min-w-0">
                <Link href={r.s.href} className="block truncate font-semibold text-[var(--text-primary)] hover:text-violet-600">{r.s.title}</Link>
                <span className="block text-[11px] text-[var(--text-muted)]">{r.s.perPaper.toFixed(1)} marks / paper · {r.s.share.toFixed(1)}% of the paper</span>
              </span>
              <span className="text-right"><span className="block font-num font-extrabold text-violet-600 dark:text-violet-400">{r.days} day{r.days > 1 ? "s" : ""}</span><span className="block text-[10px] font-num text-[var(--text-muted)]">Day {r.from}{r.to > r.from ? `–${r.to}` : ""}</span></span>
            </li>
          ))}
        </ol>
      </section>

      {rising.length > 0 && (
        <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5 sm:p-6">
          <h2 className="font-extrabold text-emerald-800 dark:text-emerald-200">Subjects gaining weight recently</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">These carried more marks in the last three papers than before — don&apos;t skimp on them.</p>
          <ul className="mt-3 flex flex-wrap gap-2">{rising.map((s) => <li key={s.title} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-emerald-500/30 text-sm font-semibold text-[var(--text-primary)]">{s.title}<TrendBadge values={s.byYear} /></li>)}</ul>
        </section>
      )}

      <SponsorSlot context="algorithms" seed={6} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Phase 2 — Days {LEARN + 1} to {LEARN + REVISE}: revise with PYQs</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-[var(--text-secondary)]">
            <li>Work through your <Link href="/mistakes" className="font-semibold text-violet-600 dark:text-violet-400">mistakes bank</Link> every day until each question is mastered.</li>
            <li>Take one timed subject test per day in the <Link href="/setup" className="font-semibold text-violet-600 dark:text-violet-400">exam simulator</Link>, heaviest subjects twice.</li>
            <li>Re-solve the <Link href={mostRepeatedHref(code)} className="font-semibold text-violet-600 dark:text-violet-400">most repeated topics</Link> — they are the most predictable marks.</li>
            <li>General Aptitude: 30 minutes daily. It is 15 easy-to-bank marks.</li>
          </ul>
        </section>
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Phase 3 — Days {LEARN + REVISE + 1} to 150: full mocks</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-[var(--text-secondary)]">
            <li>Alternate: a full 3-hour paper one day, a deep analysis of it the next.</li>
            <li>Sit the free Sunday <Link href="/mocks" className="font-semibold text-violet-600 dark:text-violet-400">All-India Mock</Link> to see a real rank against other students.</li>
            <li>Track where the marks leak — negative marking, unattempted NATs, time sinks — and fix one leak per mock.</li>
            <li>Check where your mock score lands with the <Link href="/tools/gate-score-calculator" className="font-semibold text-violet-600 dark:text-violet-400">score &amp; rank predictor</Link>.</li>
          </ul>
        </section>
      </div>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Fewer than 150 days, or a different schedule?</h2>
        <p className="mt-2 text-[var(--text-secondary)]">The <Link href="/tools/gate-study-plan" className="font-semibold text-violet-600 dark:text-violet-400">study-plan generator</Link> rebuilds this plan for your exam date, daily hours and weak subjects, with a live countdown.</p>
        <p className="mt-4 text-[11px] text-[var(--text-muted)]">Day budgets are computed from our tagged bank of every official GATE {paper} paper since {years[0]} and update after every GATE. Subject names follow the official GATE 2027 syllabus.</p>
      </section>
    </div>
  );
}
