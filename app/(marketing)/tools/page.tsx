import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, CalendarDays, FileText, Flame, LineChart } from "lucide-react";
import { TOOLS, type ToolEntry } from "@/lib/seo/tools";
import { ToolHeader } from "@/components/seo/tool-shell";

const TOOL_ICONS: Record<ToolEntry["icon"], typeof Calculator> = { calculator: Calculator, chart: LineChart, calendar: CalendarDays, flame: Flame, book: BookOpen, file: FileText };

export const metadata: Metadata = {
  title: "Free GATE tools",
  description: "Every free GATE OS tool in one place: syllabus weightage, past papers, rank predictor, cut-offs and a study planner.",
  alternates: { canonical: "/tools" },
};

// The navbar's Tools item opens this list; each card opens its tool.
export default function ToolsIndex() {
  return (
    <>
      <ToolHeader kicker="All tools" title="Free GATE tools" lead="Pick a tool to open it. Every one is free — sign in to save your results and carry them across devices." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map((t, i) => {
          const Icon = TOOL_ICONS[t.icon];
          const tint = ["lilac", "mint", "peach", "sky", "rose", "butter", "peri"][i % 7];
          return (
            <li key={t.href}>
              <Link href={t.href} data-tint={tint} className="card-pastel group flex h-full items-start gap-3 p-5 transition hover:-translate-y-0.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--surface)] text-[var(--tint-ink)]">
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:-rotate-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                    {t.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                  <span className="mt-1 block text-sm text-[var(--text-secondary)] leading-relaxed">{t.blurb}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
