"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronUp, ListTree, Search, X } from "lucide-react";

type Entry = { id: string; title: string; group: string; share: number };

function useActive(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((x): x is HTMLElement => !!x);
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id);
    }, { rootMargin: "-20% 0px -65% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/**
 * Syllabus navigator. Desktop: a sticky outline grouped by section with share bars, a
 * reading-progress rail and scroll-spy. Phones: a floating "current subject" pill that opens
 * a searchable sheet. Both jump smoothly to the subject.
 */
export function SyllabusNavigator({ entries }: { entries: Entry[] }) {
  const ids = useMemo(() => entries.map((e) => e.id), [entries]);
  const active = useActive(ids);
  const idx = Math.max(0, ids.indexOf(active ?? ""));
  const groups = useMemo(() => [...new Set(entries.map((e) => e.group))], [entries]);
  const max = Math.max(...entries.map((e) => e.share), 1);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const current = entries[idx];
  const filtered = entries.filter((e) => e.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      {/* Desktop outline */}
      <nav aria-label="Syllabus outline" className="hidden xl:block sticky top-0 max-h-[calc(100dvh-10.5rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Jump to subject</p>
          <span className="text-[11px] font-num font-bold text-violet-600 dark:text-violet-400">{idx + 1}/{entries.length}</span>
        </div>
        <div className="h-1 rounded-full bg-[var(--surface-secondary)] overflow-hidden mb-3 mx-1"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-500" style={{ width: `${((idx + 1) / entries.length) * 100}%` }} /></div>
        {groups.map((g) => (
          <div key={g} className="mb-2 last:mb-0">
            <p className="px-2 mb-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{g}</p>
            <ul>
              {entries.filter((e) => e.group === g).map((e) => {
                const on = e.id === active;
                return (
                  <li key={e.id}>
                    <button type="button" onClick={() => go(e.id)} className={`relative w-full text-left rounded-lg px-2 py-1 cursor-pointer transition-colors ${on ? "" : "hover:bg-[var(--surface-secondary)]"}`}>
                      {on && <motion.span layoutId="syl-outline-pill" className="absolute inset-0 rounded-lg bg-violet-500/12 ring-1 ring-violet-500/40" transition={{ type: "spring", stiffness: 480, damping: 30 }} />}
                      <span className="relative flex items-center justify-between gap-2">
                        <span className={`text-[12.5px] leading-5 truncate ${on ? "font-bold text-violet-700 dark:text-violet-300" : "text-[var(--text-secondary)]"}`}>{e.title}</span>
                        <span className="shrink-0 text-[10px] font-num text-[var(--text-muted)]">{e.share.toFixed(0)}%</span>
                      </span>
                      <span className="relative mt-0.5 block h-[2px] rounded-full bg-[var(--surface-secondary)] overflow-hidden"><span className="block h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${(e.share / max) * 100}%` }} /></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Phone / tablet: floating current-subject pill + searchable sheet */}
      <div className="xl:hidden fixed right-3 bottom-20 z-40">
        <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-2 max-w-[70vw] pl-3 pr-3.5 h-11 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-lg shadow-violet-500/40 cursor-pointer">
          <ListTree className="w-4 h-4 shrink-0" /><span className="truncate">{current?.title}</span><span className="shrink-0 text-[11px] font-num opacity-80">{idx + 1}/{entries.length}</span>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="xl:hidden fixed inset-0 z-50 flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div role="dialog" aria-label="Jump to subject" className="relative w-full max-h-[75vh] flex flex-col rounded-t-3xl border-t border-[var(--border)] bg-[var(--surface)] p-4 pb-6"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 380, damping: 34 }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-xl bg-[var(--surface-secondary)]"><Search className="w-4 h-4 text-[var(--text-muted)]" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a subject" className="flex-1 bg-transparent text-sm outline-none text-[var(--text-primary)]" /></div>
                <button type="button" onClick={() => setOpen(false)} className="w-10 h-10 grid place-items-center rounded-xl bg-[var(--surface-secondary)] cursor-pointer" aria-label="Close"><X className="w-4 h-4" /></button>
              </div>
              <div className="overflow-y-auto">
                {groups.map((g) => {
                  const list = filtered.filter((e) => e.group === g);
                  if (!list.length) return null;
                  return (
                    <div key={g} className="mb-3">
                      <p className="px-1 mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{g}</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {list.map((e) => (
                          <li key={e.id}><button type="button" onClick={() => { setOpen(false); setQ(""); setTimeout(() => go(e.id), 180); }}
                            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left text-sm cursor-pointer ${e.id === active ? "bg-violet-500/12 ring-1 ring-violet-500/40 font-bold text-violet-700 dark:text-violet-300" : "bg-[var(--surface-secondary)]/60 text-[var(--text-primary)]"}`}>
                            <span className="truncate">{e.title}</span><span className="shrink-0 text-[11px] font-num text-[var(--text-muted)]">{e.share.toFixed(1)}%</span>
                          </button></li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" onClick={() => go(ids[0])} className="sr-only"><ChevronUp /> Back to first subject</button>
    </>
  );
}
