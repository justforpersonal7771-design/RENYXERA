"use client";

/**
 * Tools hub (researched, Nov 2026: task-based verb-led entry points; bento grids work when tile sizes carry meaning, so one hero tool
 * per intent is large and the rest are small; dark is a first-class mode). Top: three questions the student arrives with as a segmented
 * control. Below: the tools that answer the chosen one as a bento (one hero tile, the others stacked).
 * Every panel stays in the DOM (inactive ones are `hidden`) so every tool link is still in the server-rendered HTML.
 */
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Calculator, CalendarDays, Download, FileText, Flame, LineChart, type LucideIcon } from "lucide-react";
import { TOOLS, type ToolEntry } from "@/lib/seo/tools";
import { WordReveal } from "@/components/ui/word-reveal";
import { useBranchHref } from "@/lib/seo/use-branch-href";

const ICONS: Record<ToolEntry["icon"], LucideIcon> = { calculator: Calculator, chart: LineChart, calendar: CalendarDays, flame: Flame, book: BookOpen, file: FileText };
const DOWNLOADS: ToolEntry = { href: "/downloads", title: "Downloads", short: "Downloads", blurb: "Save whole papers and subjects to study offline, encrypted on this device.", kind: "tool", icon: "file" };
const find = (h: string) => (h === "/downloads" ? DOWNLOADS : TOOLS.find((t) => t.href === h)!);

const INTENTS = [
  { id: "rank", tint: "sky", verb: "Work out my rank", promise: "Turn marks into a score, a rank and a cut-off check.", hrefs: ["/tools/gate-score-calculator", "/tools/gate-cs-cutoff", "/tools/gate-branch-cutoffs"] },
  { id: "plan", tint: "mint", verb: "Plan my preparation", promise: "Know what to study, in what order, and what changed.", hrefs: ["/syllabus", "/tools/gate-study-plan", "/articles/most-repeated-topics", "/gate-updates"] },
  { id: "practise", tint: "peach", verb: "Practise and revise", promise: "Real past papers, aptitude lessons and offline study.", hrefs: ["/pyq", "/ga-lessons", "/downloads"] },
] as const;

export function ToolsHub() {
  const bh = useBranchHref();
  const [sel, setSel] = useState<(typeof INTENTS)[number]["id"]>("rank");
  const onKey = (e: React.KeyboardEvent) => {
    const i = INTENTS.findIndex((x) => x.id === sel), d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (d) { e.preventDefault(); setSel(INTENTS[(i + d + INTENTS.length) % INTENTS.length].id); }
  };
  return (
    <div className="flex w-full flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-block -rotate-2 rounded-full border-2 border-[var(--text-primary)]/70 bg-[var(--surface)] px-2.5 py-0.5 text-xs font-extrabold text-[var(--text-primary)]">Tools</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl"><WordReveal text="What do you want to do?" /></h1>
        </div>
        <p className="max-w-sm text-sm text-[var(--text-secondary)] text-balance">Pick what you are trying to do. The tools that help are right below.</p>
      </header>

      <div role="tablist" aria-label="What do you want to do" onKeyDown={onKey} className="grid grid-cols-1 gap-2 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-2 sm:grid-cols-3">
        {INTENTS.map((it) => {
          const on = it.id === sel;
          return (
            <button key={it.id} role="tab" type="button" id={`tools-tab-${it.id}`} aria-selected={on} aria-controls={`tools-panel-${it.id}`} tabIndex={on ? 0 : -1} onClick={() => setSel(it.id)}
              className="group relative flex min-w-0 cursor-pointer items-center gap-3 rounded-[22px] p-3.5 text-left transition-colors sm:p-4">
              {on && <motion.span layoutId="tools-intent-pill" aria-hidden className="absolute inset-0 rounded-[22px] border-2" style={{ background: `var(--tint-${it.tint})`, borderColor: `var(--tint-${it.tint}-ink)` }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl font-display text-lg font-extrabold" style={{ background: on ? `var(--tint-${it.tint}-ink)` : `var(--tint-${it.tint})`, color: on ? `var(--tint-${it.tint})` : `var(--tint-${it.tint}-ink)` }}>{it.hrefs.length}</span>
              <span className="relative min-w-0">
                <span className="block font-display text-lg font-extrabold leading-tight text-[var(--text-primary)]">{it.verb}</span>
                <span className="mt-0.5 block text-sm leading-snug text-[var(--text-secondary)] max-sm:hidden">{it.promise}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-w-0">
        {INTENTS.map((it) => {
          const tools = it.hrefs.map(find), [lead, ...rest] = tools, LeadIcon = lead.href === "/downloads" ? Download : ICONS[lead.icon];
          const ink = `var(--tint-${it.tint}-ink)`, tint = `var(--tint-${it.tint})`;
          return (
            <section key={it.id} role="tabpanel" id={`tools-panel-${it.id}`} aria-labelledby={`tools-tab-${it.id}`} hidden={it.id !== sel} className="hub-in grid gap-4 lg:min-h-[22rem] lg:grid-cols-12">
              <Link href={bh(lead.href)} className="group relative flex min-w-0 flex-col overflow-hidden rounded-[28px] border p-6 transition-transform hover:-translate-y-0.5 sm:p-8 lg:col-span-7"
                style={{ background: `linear-gradient(145deg, ${tint} 0%, color-mix(in srgb, ${tint} 70%, ${ink}) 130%)`, borderColor: `color-mix(in srgb, ${ink} 35%, transparent)` }}>
                <span aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-20 blur-2xl" style={{ background: ink }} />
                <LeadIcon aria-hidden className="pointer-events-none absolute -bottom-6 -right-4 h-56 w-56 -rotate-12 opacity-[0.09] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105" style={{ color: ink }} />
                <span className="relative inline-flex self-start rounded-full border-2 border-[var(--text-primary)]/70 bg-[var(--surface)] px-2.5 py-0.5 text-xs font-extrabold text-[var(--text-primary)]">Start here</span>
                <span className="relative mt-4 block font-display text-3xl font-extrabold leading-tight text-[var(--text-primary)] sm:text-4xl">{lead.title}</span>
                <span className="relative mt-2 block max-w-md text-[var(--text-secondary)] sm:text-lg">{lead.blurb}</span>
                <span className="relative flex-1" />
                <span className="pill-ink relative mt-6 inline-flex self-start">Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
              <ul className="flex min-w-0 flex-col gap-3 lg:col-span-5">
                {rest.map((r) => {
                  const Icon = r.href === "/downloads" ? Download : ICONS[r.icon];
                  return (
                    <li key={r.href} className="flex-1">
                      <Link href={bh(r.href)} className="group relative flex h-full items-center gap-4 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-5">
                        <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-xl transition-opacity group-hover:opacity-30" style={{ background: ink }} />
                        <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: tint, color: ink }}><Icon className="h-7 w-7" /></span>
                        <span className="relative min-w-0 flex-1">
                          <span className="block font-display text-lg font-extrabold leading-tight text-[var(--text-primary)]">{r.title}</span>
                          <span className="mt-0.5 line-clamp-2 block text-sm leading-snug text-[var(--text-secondary)]">{r.blurb}</span>
                        </span>
                        <span className="hub-chip relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border)] text-[var(--text-primary)] transition-colors" style={{ ["--hub-ink" as string]: ink }}><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
