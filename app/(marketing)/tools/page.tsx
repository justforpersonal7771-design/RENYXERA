import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, CalendarDays, Flame, LineChart } from "lucide-react";
import { TOOLS, type ToolEntry } from "@/lib/seo/tools";

export const metadata: Metadata = {
  title: "Free GATE CS Tools — Score Predictor, Cutoffs, Study Plan, Syllabus Weightage | RENYXERA",
  description: "Free GATE CS tools: score and rank predictor, cut-offs and marks vs rank, a weightage-based study plan with countdown, the official syllabus with topic weightage, and data articles.",
  alternates: { canonical: "/tools" },
  openGraph: { title: "Free GATE CS Tools", description: "Score predictor, cutoffs, study planner and syllabus weightage — all free.", type: "website" },
};

const ICONS: Record<ToolEntry["icon"], typeof Calculator> = { calculator: Calculator, chart: LineChart, calendar: CalendarDays, flame: Flame, book: BookOpen };

function Card({ t }: { t: ToolEntry }) {
  const Icon = ICONS[t.icon];
  return (
    <Link href={t.href} className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-violet-500/50 hover:-translate-y-0.5 transition-all">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-violet-600 dark:text-violet-400"><Icon className="w-5 h-5" /></span>
      <span className="mt-3 font-extrabold text-[var(--text-primary)]">{t.title}</span>
      <span className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed flex-1">{t.blurb}</span>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-violet-600 dark:text-violet-400">Open <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></span>
    </Link>
  );
}

export default function ToolsHub() {
  const tools = TOOLS.filter((t) => t.kind === "tool");
  const articles = TOOLS.filter((t) => t.kind === "article");
  return (
    <div className="py-10 sm:py-14">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Free · no sign-in</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">GATE CS tools</h1>
      <p className="mt-3 max-w-2xl text-[var(--text-secondary)] leading-relaxed">Everything here runs on real data from every official GATE CS paper since 2017.</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{tools.map((t) => <Card key={t.href} t={t} />)}</div>
      <h2 className="mt-12 text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Data articles</h2>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{articles.map((t) => <Card key={t.href} t={t} />)}</div>
    </div>
  );
}
