import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lightbulb, TriangleAlert } from "lucide-react";
import { GA_AREAS, GA_LESSONS } from "@/lib/seo/ga-lessons";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { ToolHeader } from "@/components/seo/tool-shell";

export const metadata: Metadata = {
  title: "GATE General Aptitude Lessons: Verbal, Quantitative, Analytical, Spatial | RENYXERA",
  description: "General Aptitude is 15 marks in every GATE paper. Short lessons with the rules that matter, worked examples and common traps for verbal, quantitative, analytical and spatial aptitude, with practice questions.",
  alternates: { canonical: "/ga-lessons" },
  openGraph: { title: "GATE General Aptitude lessons", description: "Rules, worked examples and traps for the 15 General Aptitude marks.", type: "article" },
};

const TONE: Record<string, string> = { Verbal: "bg-sky-500/10 text-sky-700 dark:text-sky-300", Quantitative: "bg-violet-500/10 text-violet-700 dark:text-violet-300", Analytical: "bg-amber-500/10 text-amber-700 dark:text-amber-300", Spatial: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" };

export default function GaLessonsPage() {
  return (
    <>
      <ToolHeader kicker="General Aptitude · 15 marks in every paper" title="General Aptitude lessons" lead="The same 15 marks sit in every GATE paper, whatever your branch, and they are the quickest marks to bank. Each lesson gives the rules that matter, worked examples you can check, and the traps that cost marks. Then practise on real questions." />

      <nav aria-label="Lessons" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {GA_AREAS.map((a) => (
          <Link key={a.area} href={`/setup?subject=${encodeURIComponent(a.subject)}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:-translate-y-0.5">
            <p className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${TONE[a.area]}`}>{a.area}</p>
            <p className="mt-2 text-sm font-extrabold text-[var(--text-primary)]">{a.subject}</p>
            <p className="text-xs text-[var(--text-muted)]">{a.marks}</p>
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400">Practise questions <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></p>
          </Link>
        ))}
      </nav>

      <div className="grid gap-5 xl:grid-cols-2">
        {GA_LESSONS.map((l) => (
          <article key={l.slug} id={l.slug} className="scroll-mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <p className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${TONE[l.area]}`}>{l.area}</p>
            <h2 className="mt-2 text-lg font-extrabold text-[var(--text-primary)]">{l.title}</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{l.why}</p>
            <h3 className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--text-muted)]"><Lightbulb className="h-3.5 w-3.5" aria-hidden /> Rules to remember</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--text-secondary)]">{l.rules.map((r) => <li key={r}>{r}</li>)}</ul>
            <h3 className="mt-4 text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">Worked examples</h3>
            <ul className="mt-2 space-y-2">
              {l.examples.map((e) => (
                <li key={e.q} className="rounded-xl bg-[var(--surface-secondary)]/60 p-3 text-sm">
                  <p className="font-semibold text-[var(--text-primary)]">{e.q}</p>
                  <p className="mt-1 text-[var(--text-secondary)]"><span className="font-bold text-emerald-600 dark:text-emerald-400">Answer: </span>{e.a}</p>
                </li>
              ))}
            </ul>
            <h3 className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--text-muted)]"><TriangleAlert className="h-3.5 w-3.5 text-amber-500" aria-hidden /> Common traps</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--text-secondary)]">{l.traps.map((t) => <li key={t}>{t}</li>)}</ul>
            <Link href={`/setup?subject=${encodeURIComponent(GA_AREAS.find((a) => a.area === l.area)!.subject)}`} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-bold text-white shadow-md shadow-violet-500/25">Practise {l.area.toLowerCase()} aptitude <ArrowRight className="h-4 w-4" /></Link>
          </article>
        ))}
      </div>
      <SponsorSlot context="algorithms" seed={7} />
    </>
  );
}
