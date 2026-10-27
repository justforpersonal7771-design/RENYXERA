import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, CalendarDays, Download, FileText, Flame, LineChart } from "lucide-react";
import { TOOLS, type ToolEntry } from "@/lib/seo/tools";
import { ToolHeader } from "@/components/seo/tool-shell";

const TOOL_ICONS: Record<ToolEntry["icon"], typeof Calculator> = { calculator: Calculator, chart: LineChart, calendar: CalendarDays, flame: Flame, book: BookOpen, file: FileText };

export const metadata: Metadata = {
  title: "Free GATE tools",
  description: "Every free GATE OS tool in one place: syllabus weightage, past papers, rank predictor, cut-offs, a study planner and offline downloads.",
  alternates: { canonical: "/tools" },
};

// Bento hub (research: featured tool in the biggest box, the rest grouped in boxed categories with one card anatomy).
const FEATURED = "/tools/gate-score-calculator";
const DOWNLOADS: ToolEntry = { href: "/downloads", title: "Downloads", short: "Downloads", blurb: "Save whole papers and subjects to study offline, encrypted on this device.", kind: "tool", icon: "file" };
const GROUPS: { title: string; tint: string; hrefs: string[] }[] = [
  // Order fills the bento: featured (col 1, two rows) | plan | cut-offs, then practise across cols 2-3.
  { title: "Plan your preparation", tint: "mint", hrefs: ["/syllabus", "/tools/gate-study-plan", "/gate-updates"] },
  { title: "Know your cut-off", tint: "sky", hrefs: ["/tools/gate-cs-cutoff", "/tools/gate-branch-cutoffs"] },
  { title: "Practise and revise", tint: "peach", hrefs: ["/pyq", "/articles/most-repeated-topics", "/ga-lessons", "/downloads"] },
];
const byHref = (h: string) => (h === "/downloads" ? DOWNLOADS : TOOLS.find((t) => t.href === h));

export default function ToolsIndex() {
  const feat = byHref(FEATURED)!;
  const FeatIcon = TOOL_ICONS[feat.icon];
  return (
    <>
      <ToolHeader kicker="All tools" title="Free GATE tools" lead="Pick a tool to open it. Every one is free — sign in to save your results and carry them across devices." />
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Featured: the most used tool gets the largest box. */}
        <Link href={feat.href} data-tint="lilac" className="card-pastel group flex flex-col gap-6 p-6 sm:p-8 lg:row-span-2">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--surface)] text-[var(--tint-ink)]"><FeatIcon className="h-7 w-7" /></span>
          {/* What the predictor gives you, at a glance (illustrative example, labelled as such). */}
          <span className="block flex-1 rounded-3xl bg-[var(--surface)] p-5" aria-label="Example result">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Example: 45 marks, General</span>
            <span className="mt-3 grid grid-cols-3 gap-2">
              {[["GATE score", "525", "lilac"], ["Likely AIR", "~7,000", "mint"], ["Cut-off", "Cleared", "peach"]].map(([l, v, t]) => (
                <span key={l} className="rounded-2xl p-3" style={{ background: `var(--tint-${t})` }}>
                  <span className="block text-xs font-semibold text-[var(--text-secondary)]">{l}</span>
                  <span className="block font-display text-xl font-extrabold text-[var(--text-primary)]">{v}</span>
                </span>
              ))}
            </span>
            <svg viewBox="0 0 300 90" className="mt-4 h-24 w-full" aria-hidden>
              <path d="M5 85 C 70 80, 120 60, 170 45 S 260 10, 295 5" fill="none" stroke="var(--tint-lilac-ink)" strokeWidth="3" strokeLinecap="round" />
              <path d="M5 85 C 70 82, 130 70, 180 58 S 260 25, 295 12" fill="none" stroke="var(--tint-mint-ink)" strokeWidth="2" strokeDasharray="5 5" />
              <circle cx="140" cy="54" r="6" fill="var(--tint-peach-ink)" />
            </svg>
            <span className="text-xs text-[var(--text-secondary)]">Where you land on the real marks-vs-rank curve</span>
          </span>
          <span>
            <span className="section-label">Most used</span>
            <span className="mt-3 block font-display text-3xl font-extrabold leading-tight text-[var(--text-primary)]">{feat.title}</span>
            <span className="mt-2 block text-[var(--text-secondary)]">{feat.blurb}</span>
            <span className="pill-ink mt-5 inline-flex">Open the predictor <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
          </span>
        </Link>
        {GROUPS.map((g) => (
          <section key={g.title} className={`card-pastel p-5 ${g.hrefs.length > 3 ? "lg:col-span-2" : ""}`} data-tint={g.tint} aria-label={g.title}>
            <h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">{g.title}</h2>
            <ul className={`mt-3 grid gap-2.5 ${g.hrefs.length > 3 ? "sm:grid-cols-2" : ""}`}>
              {g.hrefs.map((h) => {
                const t = byHref(h);
                if (!t) return null;
                const Icon = h === "/downloads" ? Download : TOOL_ICONS[t.icon];
                return (
                  <li key={h}>
                    <Link href={t.href} className="group flex h-full items-start gap-3 rounded-2xl bg-[var(--surface)] p-3.5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-18px_rgba(12,34,75,.4)]">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[var(--tint-ink)]" style={{ background: `var(--tint-${g.tint})` }}><Icon className="h-5 w-5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">{t.title}<ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" /></span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-[var(--text-secondary)]">{t.blurb}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
