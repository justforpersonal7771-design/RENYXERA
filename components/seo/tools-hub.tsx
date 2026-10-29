"use client";

/**
 * Tools hub (researched: task-based, verb-led entry points + master-detail, instead of a flat grid of equal cards).
 * Left: three questions the student arrives with. Right: the tools that answer the chosen one, one featured and the rest as rows.
 * Every panel stays in the DOM (inactive ones are `hidden`) so every tool link is still in the server-rendered HTML.
 */
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, Calculator, CalendarDays, Download, FileText, Flame, LineChart, type LucideIcon } from "lucide-react";
import { TOOLS, type ToolEntry } from "@/lib/seo/tools";

const ICONS: Record<ToolEntry["icon"], LucideIcon> = { calculator: Calculator, chart: LineChart, calendar: CalendarDays, flame: Flame, book: BookOpen, file: FileText };
const DOWNLOADS: ToolEntry = { href: "/downloads", title: "Downloads", short: "Downloads", blurb: "Save whole papers and subjects to study offline, encrypted on this device.", kind: "tool", icon: "file" };
const find = (h: string) => (h === "/downloads" ? DOWNLOADS : TOOLS.find((t) => t.href === h)!);

const INTENTS = [
  { id: "rank", tint: "sky", verb: "Work out my rank", promise: "Turn marks into a score, a rank and a cut-off check.", hrefs: ["/tools/gate-score-calculator", "/tools/gate-cs-cutoff", "/tools/gate-branch-cutoffs"] },
  { id: "plan", tint: "mint", verb: "Plan my preparation", promise: "Know what to study, in what order, and what changed.", hrefs: ["/syllabus", "/tools/gate-study-plan", "/articles/most-repeated-topics", "/gate-updates"] },
  { id: "practise", tint: "peach", verb: "Practise and revise", promise: "Real past papers, aptitude lessons and offline study.", hrefs: ["/pyq", "/ga-lessons", "/downloads"] },
] as const;

export function ToolsHub() {
  const [sel, setSel] = useState<(typeof INTENTS)[number]["id"]>("rank");
  const onKey = (e: React.KeyboardEvent) => {
    const i = INTENTS.findIndex((x) => x.id === sel), d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (d) { e.preventDefault(); setSel(INTENTS[(i + d + INTENTS.length) % INTENTS.length].id); }
  };
  return (
    <div className="flex w-full flex-col gap-4 lg:min-h-[calc(100dvh-14rem)]">
      <header>
        <span className="inline-block -rotate-2 rounded-full border-2 border-[var(--text-primary)]/70 bg-[var(--surface)] px-2.5 py-0.5 text-xs font-extrabold text-[var(--text-primary)]">Tools</span>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">What do you want to do?</h1>
      </header>

      <div className="grid flex-1 grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
        <div role="tablist" aria-label="What do you want to do" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-2 lg:flex-col lg:gap-3">
          {INTENTS.map((it) => {
            const on = it.id === sel;
            return (
              <button key={it.id} role="tab" type="button" id={`tools-tab-${it.id}`} aria-selected={on} aria-controls={`tools-panel-${it.id}`} tabIndex={on ? 0 : -1} onClick={() => setSel(it.id)} data-tint={it.tint}
                className={`card-pastel relative flex min-w-0 flex-1 cursor-pointer flex-col items-start p-3 text-left transition-transform lg:justify-center lg:p-4 ${on ? "lg:translate-x-2 shadow-[4px_4px_0_var(--text-primary)] ring-2 ring-[var(--text-primary)]" : "opacity-80 hover:opacity-100"}`}>
                <span className="hidden text-[11px] font-extrabold uppercase tracking-wide text-[var(--text-muted)] lg:block">{it.hrefs.length} tools</span>
                <span className="font-display text-sm font-extrabold leading-tight text-[var(--text-primary)] lg:mt-1 lg:text-xl">{it.verb}</span>
                <span className="mt-1 hidden text-sm text-[var(--text-secondary)] lg:block">{it.promise}</span>
              </button>
            );
          })}
        </div>

        <div className="min-w-0">
          {INTENTS.map((it) => {
            const tools = it.hrefs.map(find), [lead, ...rest] = tools, LeadIcon = lead.href === "/downloads" ? Download : ICONS[lead.icon];
            return (
              <section key={it.id} role="tabpanel" id={`tools-panel-${it.id}`} aria-labelledby={`tools-tab-${it.id}`} hidden={it.id !== sel} data-tint={it.tint}
                className="card-well h-full grid-cols-[minmax(0,1fr)] gap-4 p-4 data-[open=true]:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:p-5" data-open={it.id === sel}>
                <Link href={lead.href} className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl bg-[var(--surface)]/70 p-5 transition-transform hover:-translate-y-0.5">
                  <LeadIcon aria-hidden className="pointer-events-none absolute -bottom-6 -right-4 h-36 w-36 -rotate-12 text-[var(--text-primary)] opacity-[0.06] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110" />
                  <span className="inline-block self-start rotate-2 rounded-full border-2 border-[var(--text-primary)]/70 bg-[var(--surface)] px-2.5 py-0.5 text-xs font-extrabold text-[var(--text-primary)]">Start here</span>
                  <span className="mt-3 block font-display text-2xl font-extrabold leading-tight text-[var(--text-primary)]">{lead.title}</span>
                  <span className="mt-1 block text-[var(--text-secondary)]">{lead.blurb}</span>
                  <span className="flex-1" />
                  <span className="pill-ink mt-4 inline-flex self-start">Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
                </Link>
                <ul className="flex min-w-0 flex-col gap-3">
                  {rest.map((t) => {
                    const Icon = t.href === "/downloads" ? Download : ICONS[t.icon];
                    return (
                      <li key={t.href} className="flex-1">
                        <Link href={t.href} className="group flex h-full items-center gap-3 rounded-3xl bg-[var(--surface)]/70 p-4 transition-transform hover:-translate-y-0.5 hover:bg-[var(--surface)]">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[var(--text-primary)]" style={{ background: `var(--tint-${it.tint})` }}><Icon className="h-6 w-6" /></span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-base font-extrabold text-[var(--text-primary)]">{t.title}</span>
                            <span className="mt-0.5 line-clamp-2 block text-sm leading-snug text-[var(--text-secondary)]">{t.blurb}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-1" aria-hidden />
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
    </div>
  );
}
