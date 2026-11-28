"use client";

/**
 * Study planner (owner request, 29 Nov 2026): the one place where the reader's choices are set. Search, order, subjects and "ready to read" are staged as a draft
 * and take effect only when Apply is pressed (batch filtering with an Apply button, as Nielsen Norman Group advises when a change reshapes a whole page).
 * Apply is disabled until something changed, names how many books will show, and on a phone it stays at the foot of the screen. Reset returns everything to the defaults at once.
 * Layout research: Baymard (apply buttons on mobile, result counts beside options), NN/g "Applying filters", Maersk design system (apply at the end of the options).
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Layers, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { CS_SHELF } from "@/lib/study/catalog";
import { MODES } from "@/components/study/study-roadmap";
import { useRoadmapPrefs, type RoadmapMode } from "@/lib/study/roadmap-prefs";

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

export function StudyPlanner({ q, onlyReady, onApply }: { q: string; onlyReady: boolean; onApply: (q: string, onlyReady: boolean) => void }) {
  const prefs = useRoadmapPrefs();
  // the draft starts from what is applied; the parent remounts this component (key) after an apply or reset, so no syncing effect is needed
  const [mode, setMode] = useState<RoadmapMode>(prefs.mode);
  const [off, setOff] = useState<string[]>(prefs.off);
  const [draftQ, setDraftQ] = useState(q);
  const [ready, setReady] = useState(onlyReady);
  const [open, setOpen] = useState(false);

  const term = draftQ.trim().toLowerCase();
  const dirty = mode !== prefs.mode || !sameSet(off, prefs.off) || draftQ.trim() !== q.trim() || ready !== onlyReady;
  const changes = Number(mode !== prefs.mode) + Number(!sameSet(off, prefs.off)) + Number(draftQ.trim() !== q.trim()) + Number(ready !== onlyReady);
  const shows = (b: (typeof CS_SHELF)[number]) => !off.includes(b.id) && (!ready || b.chapters.some((c) => c.ready)) && (!term || b.title.replace(/­/g, "").toLowerCase().includes(term) || b.chapters.some((c) => c.title.toLowerCase().includes(term)));
  const count = useMemo(() => CS_SHELF.filter(shows).length, [off, ready, term]); // eslint-disable-line react-hooks/exhaustive-deps
  const hits = useMemo(() => (term ? CS_SHELF.flatMap((b) => b.chapters.filter((c) => b.title.toLowerCase().includes(term) || c.title.toLowerCase().includes(term)).map((c) => ({ b, c }))).slice(0, 6) : []), [term]);
  const defaults = prefs.mode === "balanced" && prefs.off.length === 0 && !q.trim() && !onlyReady;
  const included = CS_SHELF.length - off.length;

  const apply = () => { if (!dirty) return; prefs.apply(mode, off); onApply(draftQ.trim(), ready); };
  const reset = () => { prefs.reset(); onApply("", false); };
  const toggle = (id: string) => setOff((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  return (
    <section aria-label="Plan your study" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(0,0,0,.04)]">
      <form onSubmit={(e) => { e.preventDefault(); apply(); }} className="space-y-3 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[.14em] text-[var(--text-secondary)]"><SlidersHorizontal className="h-3.5 w-3.5" aria-hidden /> Plan your study</p>
          <label className="flex min-w-[14rem] flex-1 items-center gap-2 rounded-xl bg-[var(--surface-secondary)] px-3 focus-within:ring-2 focus-within:ring-[var(--text-primary)]/40">
            <Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
            <input value={draftQ} onChange={(e) => setDraftQ(e.target.value)} placeholder="Search subjects and chapters" aria-label="Search subjects and chapters" className="search-bare h-11 flex-1 bg-transparent text-[var(--text-primary)]" />
            {draftQ && <button type="button" onClick={() => setDraftQ("")} aria-label="Clear search" className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5"><X className="h-4 w-4" aria-hidden /></button>}
          </label>
        </div>

        {hits.length > 0 && (
          <ul aria-label="Matching chapters" className="grid gap-1 sm:grid-cols-2">
            {hits.map(({ b, c }) => (
              <li key={b.id + c.id}>{c.href
                ? <Link href={c.href} className="flex items-center justify-between gap-2 rounded-xl bg-[var(--surface-secondary)] px-3 py-2 text-sm hover:bg-[var(--surface-tertiary,var(--surface-secondary))]"><span className="min-w-0 truncate"><b>{c.title}</b> <span className="text-[var(--text-secondary)]">· {b.title}</span></span><span className="shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-300">Read</span></Link>
                : <span className="flex items-center justify-between gap-2 rounded-xl bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-secondary)]"><span className="min-w-0 truncate"><b className="text-[var(--text-primary)]">{c.title}</b> · {b.title}</span><span className="shrink-0 text-xs">Being written</span></span>}</li>
            ))}
          </ul>
        )}

        <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
          <p className="pt-2 text-xs font-bold text-[var(--text-secondary)] lg:w-14">Order</p>
          <div role="radiogroup" aria-label="Roadmap order" className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 sm:flex-wrap sm:overflow-visible">
            {MODES.map((x) => (
              <button key={x.id} type="button" role="radio" aria-checked={mode === x.id} onClick={() => setMode(x.id)} className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-sm font-bold transition-[background-color,color,transform] duration-150 active:scale-[0.97] ${mode === x.id ? "border-transparent bg-[var(--text-primary)] text-[var(--surface)]" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"}`}>
                {mode === x.id ? <Check className="h-3.5 w-3.5" aria-hidden /> : <x.icon className="h-3.5 w-3.5" aria-hidden />} {x.label}
              </button>
            ))}
          </div>

          <p className="pt-2 text-xs font-bold text-[var(--text-secondary)] lg:w-14">Show</p>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button type="button" aria-pressed={ready} onClick={() => setReady((v) => !v)} className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-sm font-bold transition-[background-color,color,transform] duration-150 active:scale-[0.97] ${ready ? "border-transparent bg-[var(--text-primary)] text-[var(--surface)]" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"}`}>{ready && <Check className="h-3.5 w-3.5" aria-hidden />} Ready to read only</button>
              <button type="button" aria-expanded={open} aria-controls="planner-subjects" onClick={() => setOpen((v) => !v)} className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] px-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">
                <Layers className="h-3.5 w-3.5" aria-hidden /> Subjects: <span className="font-num">{included}</span> of {CS_SHELF.length} <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} aria-hidden />
              </button>
            </div>
            {open && (
              <div id="planner-subjects" role="group" aria-label="Subjects to show" className="flex flex-wrap gap-1.5">
                {CS_SHELF.map((b) => { const on = !off.includes(b.id); return <button key={b.id} type="button" aria-pressed={on} onClick={() => toggle(b.id)} className={`inline-flex h-8 cursor-pointer items-center rounded-full border px-3 text-xs font-bold transition-colors ${on ? "border-transparent bg-[var(--text-primary)] text-[var(--surface)]" : "border-[var(--border)] text-[var(--text-secondary)] line-through hover:bg-[var(--surface-secondary)]"}`}>{b.title}</button>; })}
                <button type="button" onClick={() => setOff([])} className="inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-xs font-bold text-[var(--text-primary)] underline underline-offset-4">Select all</button>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-24 z-20 -mx-3 -mb-3 flex flex-wrap items-center justify-between gap-2 rounded-b-2xl border-t border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2.5 backdrop-blur sm:-mx-4 sm:-mb-4 sm:px-4 lg:static lg:bg-transparent">
          <p role="status" aria-live="polite" className="text-sm text-[var(--text-secondary)]">{dirty ? <><b className="text-[var(--text-primary)]">{changes} change{changes === 1 ? "" : "s"}</b> not applied yet</> : <>Showing <b className="font-num text-[var(--text-primary)]">{count}</b> of {CS_SHELF.length} books · {MODES.find((m) => m.id === prefs.mode)?.label} order</>}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={reset} disabled={defaults && !dirty} className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] px-4 text-sm font-bold text-[var(--text-secondary)] transition-transform active:scale-[0.97] hover:bg-[var(--surface-secondary)] disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset</button>
            <button type="submit" disabled={!dirty} className="pill-ink inline-flex h-10 items-center justify-center gap-2 transition-transform active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40">Apply{dirty ? <span className="font-num font-semibold opacity-80">· {count} book{count === 1 ? "" : "s"}</span> : null}</button>
          </div>
        </div>
      </form>
    </section>
  );
}
