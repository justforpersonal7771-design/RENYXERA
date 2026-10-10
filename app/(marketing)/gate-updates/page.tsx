import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";
import { BRANCHES } from "@/lib/branches";
import { officialSyllabusPdf, syllabusSlugOf } from "@/lib/seo/branch-syllabus";
import { CHECKED_ON, KEY_DATES, NOT_STATED, OFFICIAL_SITE, WHATS_CHANGED } from "@/lib/seo/gate2027";

export const metadata: Metadata = {
  title: "GATE Updates: What Changed and Key Dates (All Branches) | RENYXERA",
  description: "What's new in GATE 2027 — the new Robotics and Automation paper, revised syllabi, mandatory DigiLocker — plus the exam, admit card and result dates, with the official source for every fact.",
  alternates: { canonical: "/gate-updates" },
  openGraph: { title: "GATE 2027: what changed and key dates", description: "Only what the official GATE 2027 site states, with the source and the date we checked it.", type: "article" },
};

const when = new Date(CHECKED_ON).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function Gate2027Changes() {
  const live = BRANCHES.filter((b) => b.live);
  return (
    <article className="w-full space-y-8">
      <header className="w-full">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">GATE 2027 · all branches</p>
        <h1 className="mt-1.5 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">What changed in GATE 2027, and the dates that matter</h1>
        <p className="mt-2 max-w-4xl text-[var(--text-secondary)] leading-relaxed">
          Everything below comes from the official GATE 2027 website and applies to every paper unless a branch is named. We checked it on {when} and list only what the site states —
          anything it doesn&apos;t say is listed separately instead of guessed. Dates can change, so confirm on the official site before you act.
        </p>
        <a href={OFFICIAL_SITE} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">
          <ExternalLink className="w-4 h-4" /> Official site: gate2027.iitm.ac.in
        </a>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Key dates</h2>
          <dl className="mt-3 divide-y divide-[var(--border-subtle)]">
            {KEY_DATES.map((d) => (
              <div key={d.label} className="py-3">
                <dt className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{d.label}</dt>
                <dd className="mt-0.5 font-extrabold text-[var(--text-primary)]">{d.value}</dd>
                {d.note && <dd className="text-xs text-[var(--text-muted)]">{d.note}</dd>}
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-lg font-extrabold text-[var(--text-primary)]">What&apos;s new</h2>
          <ul className="mt-3 space-y-3">
            {WHATS_CHANGED.map((c) => (
              <li key={c.label} className="rounded-xl bg-[var(--surface-secondary)]/60 p-3">
                <p className="text-sm font-extrabold text-[var(--text-primary)]">{c.label}</p>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)] leading-relaxed">{c.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Your paper&apos;s syllabus</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">The syllabi were revised for 2027. Each paper below links to the official PDF and to our topic-wise weightage page for it.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {live.map((b) => {
            const slug = b.code === "CSE" ? "gate-cs-syllabus" : syllabusSlugOf(b.code);
            return (
              <li key={b.code} className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-sm font-extrabold text-[var(--text-primary)]">GATE {b.paper} · {b.short}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold">
                  <a href={officialSyllabusPdf(b.paper)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:underline"><FileText className="w-3.5 h-3.5" /> Official PDF</a>
                  {slug && <Link href={`/${slug}`} className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:underline">Weightage <ArrowRight className="w-3.5 h-3.5" /></Link>}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Not stated on the official home page</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">We don&apos;t report these until the official site does:</p>
        <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-[var(--text-secondary)]">{NOT_STATED.map((n) => <li key={n}>{n}</li>)}</ul>
      </section>
    </article>
  );
}
