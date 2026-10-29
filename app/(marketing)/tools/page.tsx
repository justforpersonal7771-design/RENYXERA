import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, CalendarDays, Download, FileText, Flame, LineChart } from "lucide-react";
import { TOOLS, type ToolEntry } from "@/lib/seo/tools";

const TOOL_ICONS: Record<ToolEntry["icon"], typeof Calculator> = { calculator: Calculator, chart: LineChart, calendar: CalendarDays, flame: Flame, book: BookOpen, file: FileText };

export const metadata: Metadata = {
  title: "Free GATE tools",
  description: "Every free GATE OS tool in one place: syllabus weightage, past papers, rank predictor, cut-offs, a study planner and offline downloads.",
  alternates: { canonical: "/tools" },
};

// Single-screen bento (same pattern as the Test Centre): the featured tool in the big box on the left, every other tool as one
// colour-coded tile with an icon watermark. The colour tells the group: mint plan, sky cut-offs, peach practise.
const FEATURED = "/tools/gate-score-calculator";
const DOWNLOADS: ToolEntry = { href: "/downloads", title: "Downloads", short: "Downloads", blurb: "Save whole papers and subjects to study offline, encrypted on this device.", kind: "tool", icon: "file" };
const TILES: { href: string; tint: string; group: string }[] = [
  { href: "/syllabus", tint: "mint", group: "Plan" }, { href: "/tools/gate-study-plan", tint: "mint", group: "Plan" }, { href: "/gate-updates", tint: "mint", group: "Plan" },
  { href: "/tools/gate-cs-cutoff", tint: "sky", group: "Cut-offs" }, { href: "/tools/gate-branch-cutoffs", tint: "sky", group: "Cut-offs" }, { href: "/pyq", tint: "peach", group: "Practise" },
  { href: "/articles/most-repeated-topics", tint: "peach", group: "Practise" }, { href: "/ga-lessons", tint: "peach", group: "Practise" }, { href: "/downloads", tint: "peach", group: "Practise" },
];
const byHref = (h: string) => (h === "/downloads" ? DOWNLOADS : TOOLS.find((t) => t.href === h));

export default function ToolsIndex() {
  const feat = byHref(FEATURED)!;
  const FeatIcon = TOOL_ICONS[feat.icon];
  return (
    <div className="flex w-full flex-col gap-4 lg:min-h-[calc(100dvh-12.5rem)]">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="inline-block -rotate-2 rounded-full border-2 border-[var(--text-primary)]/70 bg-[var(--surface)] px-2.5 py-0.5 text-xs font-extrabold text-[var(--text-primary)]">All tools</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">Free GATE tools</h1>
        </div>
        <p className="max-w-md text-sm text-[var(--text-secondary)]">Every one is free. Sign in to save your results and carry them across devices.</p>
      </header>

      <div className="grid flex-1 grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-3">
        <Link href={feat.href} data-tint="lilac" className="card-pastel group relative flex min-w-0 flex-col gap-4 overflow-hidden p-6 sm:col-span-2 lg:col-span-2 lg:row-span-3">
          <FeatIcon aria-hidden className="tile-mark pointer-events-none absolute -bottom-6 -right-4 h-40 w-40 -rotate-12 text-[var(--text-primary)] opacity-[0.06] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110" />
          <span className="inline-block self-start rotate-2 rounded-full border-2 border-[var(--text-primary)]/70 bg-[var(--surface)] px-2.5 py-0.5 text-xs font-extrabold text-[var(--text-primary)]">Most used</span>
          <span className="block font-display text-3xl font-extrabold leading-tight text-[var(--text-primary)]">{feat.title}</span>
          <span className="block text-[var(--text-secondary)]">{feat.blurb}</span>
          {/* What the predictor gives you, at a glance (illustrative example, labelled as such). */}
          <span className="block flex-1 rounded-3xl bg-[var(--surface)] p-4" aria-label="Example result">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Example: 45 marks, General</span>
            <span className="mt-2 grid grid-cols-3 gap-2">
              {[["GATE score", "525", "lilac"], ["Likely AIR", "~7,000", "mint"], ["Cut-off", "Cleared", "peach"]].map(([l, v, t]) => (
                <span key={l} className="rounded-2xl p-2.5" style={{ background: `var(--tint-${t})` }}>
                  <span className="block text-xs font-semibold text-[var(--text-secondary)]">{l}</span>
                  <span className="block font-display text-lg font-extrabold text-[var(--text-primary)]">{v}</span>
                </span>
              ))}
            </span>
            <svg viewBox="0 0 300 90" className="mt-3 h-20 w-full" aria-hidden>
              <path d="M5 85 C 70 80, 120 60, 170 45 S 260 10, 295 5" fill="none" stroke="var(--tint-lilac-ink)" strokeWidth="3" strokeLinecap="round" />
              <path d="M5 85 C 70 82, 130 70, 180 58 S 260 25, 295 12" fill="none" stroke="var(--tint-mint-ink)" strokeWidth="2" strokeDasharray="5 5" />
              <circle cx="140" cy="54" r="6" fill="var(--tint-peach-ink)" />
            </svg>
          </span>
          <span className="pill-ink inline-flex self-start">Open the predictor <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
        </Link>

        {TILES.map((x) => {
          const t = byHref(x.href);
          if (!t) return null;
          const Icon = x.href === "/downloads" ? Download : TOOL_ICONS[t.icon];
          return (
            <Link key={x.href} href={t.href} data-tint={x.tint} className="card-pastel group relative flex min-w-0 flex-col overflow-hidden p-4">
              <Icon aria-hidden className="tile-mark pointer-events-none absolute -bottom-3 -right-2 h-20 w-20 -rotate-12 text-[var(--text-primary)] opacity-[0.07] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110" />
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--text-muted)]">{x.group}</span>
              <span className="mt-1 flex items-center gap-1.5 font-display text-base font-extrabold leading-snug text-[var(--text-primary)]">{t.title}<ArrowRight className="h-4 w-4 shrink-0 opacity-0 -translate-x-1 transition group-hover:translate-x-0 group-hover:opacity-100" /></span>
              <span className="mt-1 line-clamp-3 text-sm leading-snug text-[var(--text-secondary)]">{t.blurb}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
