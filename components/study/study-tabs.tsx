"use client";

/**
 * The tab strip above a lesson (docs/study-materials/BOOK-TABS.md). One tab per open chapter: click to switch,
 * x to close, drag to reorder, double-click (or the pin in the menu) to pin. "+" opens the library's ready chapters.
 * Tabs are links, so middle-click and screen readers behave like normal navigation.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, Reorder } from "motion/react";
import { BookOpen, Pin, Plus, X } from "lucide-react";
import { CS_SHELF } from "@/lib/study/catalog";
import { MAX_TABS, useStudyTabs, type StudyTab } from "@/lib/study/tabs";

const READY = CS_SHELF.flatMap((b) => b.chapters.filter((c) => c.href).map((c) => ({ href: c.href!, title: c.title, subject: b.title, tint: b.tint })));
const isKnown = (href: string) => READY.some((r) => r.href === href);

export function StudyTabs({ current }: { current: StudyTab }) {
  const router = useRouter();
  const { tabs, open, close, closeOthers, pin, reorder, prune, hydrate } = useStudyTabs();
  const [note, setNote] = useState<string | null>(null);
  const [picker, setPicker] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    hydrate();
    prune(isKnown);
    const dropped = open(current, current.href);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tell the reader once that the oldest tab made room
    if (dropped) setNote(`"${dropped}" was closed to keep ${MAX_TABS} tabs open.`);
    // keep the active tab in view
    requestAnimationFrame(() => strip.current?.querySelector<HTMLElement>("[aria-current='page']")?.scrollIntoView({ block: "nearest", inline: "nearest" }));
  }, [current, hydrate, open, prune]);
  useEffect(() => { if (!note) return; const t = setTimeout(() => setNote(null), 4000); return () => clearTimeout(t); }, [note]);

  const shut = (href: string) => {
    const next = close(href);
    if (href === current.href) router.push(next ?? "/study");
  };
  const list = tabs.length ? tabs : [current];
  return (
    <div className="relative">
      <div ref={strip} className="no-scrollbar flex items-end gap-1 overflow-x-auto border-b-2 border-[var(--border)]" role="tablist" aria-label="Open chapters">
        <Reorder.Group axis="x" values={list} onReorder={reorder} className="flex items-end gap-1">
          {list.map((t) => {
            const on = t.href === current.href;
            return (
              <Reorder.Item key={t.href} value={t} className="shrink-0" whileDrag={{ scale: 1.03 }}>
                <div role="presentation" className={`group relative -mb-[2px] flex max-w-[240px] items-center gap-2 rounded-t-2xl border-2 border-b-0 px-3 py-2 ${on ? "border-[var(--border)] bg-[var(--surface)]" : "border-transparent bg-[var(--surface-secondary)]/60 hover:bg-[var(--surface-secondary)]"}`}
                  onDoubleClick={() => pin(t.href)} onContextMenu={(e) => { e.preventDefault(); setMenu(menu === t.href ? null : t.href); }}>
                  <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: `var(--tint-${t.tint ?? "peri"}-ink)` }} />
                  <Link href={t.href} role="tab" aria-selected={on} aria-current={on ? "page" : undefined} className="min-w-0" title={`${t.subject}: ${t.title}`}>
                    <span className="block truncate text-[11px] font-semibold leading-tight text-[var(--text-secondary)]">{t.subject}</span>
                    <span className={`block truncate text-sm leading-tight ${on ? "font-extrabold text-[var(--text-primary)]" : "font-bold text-[var(--text-secondary)]"}`}>{t.title}</span>
                  </Link>
                  {t.pinned ? <button type="button" onClick={() => pin(t.href)} aria-label={`Unpin ${t.title}`} className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-black/5"><Pin className="h-3.5 w-3.5" /></button>
                    : <button type="button" onClick={() => shut(t.href)} aria-label={`Close ${t.title}`} className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-black/5 ${on ? "" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"}`}><X className="h-3.5 w-3.5" /></button>}
                  {menu === t.href && (
                    <div role="menu" className="absolute left-2 top-full z-30 mt-1 w-44 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg" onMouseLeave={() => setMenu(null)}>
                      <button role="menuitem" type="button" onClick={() => { pin(t.href); setMenu(null); }} className="block w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-[var(--surface-secondary)]">{t.pinned ? "Unpin tab" : "Pin tab"}</button>
                      <button role="menuitem" type="button" onClick={() => { closeOthers(t.href); setMenu(null); if (t.href !== current.href) router.push(t.href); }} className="block w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-[var(--surface-secondary)]">Close other tabs</button>
                      {!t.pinned && <button role="menuitem" type="button" onClick={() => { setMenu(null); shut(t.href); }} className="block w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-[var(--surface-secondary)]">Close tab</button>}
                    </div>
                  )}
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
        <button type="button" onClick={() => setPicker((p) => !p)} aria-expanded={picker} aria-label="Open another chapter in a new tab" title="Open another chapter"
          className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"><Plus className="h-4 w-4" /></button>
      </div>
      <AnimatePresence>
        {picker && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-0 top-full z-40 mt-2 w-[320px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,.45)]">
            <p className="px-2 pb-1 pt-1 text-xs font-bold text-[var(--text-secondary)]">Open in a new tab</p>
            {READY.map((r) => (
              <Link key={r.href} href={r.href} onClick={() => setPicker(false)} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[var(--surface-secondary)]">
                <BookOpen className="h-4 w-4 text-[var(--text-secondary)]" aria-hidden />
                <span className="min-w-0"><span className="block text-xs text-[var(--text-secondary)]">{r.subject}</span><span className="block text-sm font-bold text-[var(--text-primary)]">{r.title}</span></span>
              </Link>
            ))}
            <Link href="/study" onClick={() => setPicker(false)} className="mt-1 block rounded-xl px-2 py-2 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">Browse the library</Link>
          </motion.div>
        )}
      </AnimatePresence>
      {note && <p role="status" className="absolute right-0 top-full z-40 mt-2 rounded-xl bg-[var(--ink)] px-3 py-2 text-xs font-semibold text-[var(--background)]">{note}</p>}
    </div>
  );
}
