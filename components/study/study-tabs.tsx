"use client";

/**
 * The tab strip above a lesson (docs/study-materials/BOOK-TABS.md). One tab per open chapter: click to switch,
 * x to close, drag to reorder, double-click (or the pin in the menu) to pin. "+" opens the library's ready chapters.
 * Tabs are links, so middle-click and screen readers behave like normal navigation.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reorder } from "motion/react";
import { ChevronDown, Columns2, MoreHorizontal, Pin, Plus, X } from "lucide-react";
import { CS_SHELF } from "@/lib/study/catalog";
import { MAX_TABS, useStudyTabs, type StudyTab } from "@/lib/study/tabs";

/** The "+" opens a blank tab in the strip; picking a chapter there fills it. */
export const NEW_TAB = "/study/new";

const READY = CS_SHELF.flatMap((b) => b.chapters.filter((c) => c.href).map((c) => ({ href: c.href!, title: c.title, subject: b.title, tint: b.tint })));
const isKnown = (href: string) => READY.some((r) => r.href === href);

export function StudyTabs({ current }: { current: StudyTab }) {
  const router = useRouter();
  const { tabs, open, close, closeOthers, pin, reorder, prune, hydrate, reopen, groups, newGroup, addToGroup, renameGroup, toggleGroup, ungroup, split, setSplit } = useStudyTabs();
  const [note, setNote] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ href: string; x: number; y: number } | null>(null);
  const [naming, setNaming] = useState<string | null>(null);
  const showMenu = (href: string, el: HTMLElement) => { const r = el.getBoundingClientRect(); setMenu(menu?.href === href ? null : { href, x: Math.max(8, Math.min(r.left, window.innerWidth - 232)), y: r.bottom + 6 }); };
  useEffect(() => { if (!menu) return; const c = () => setMenu(null); window.addEventListener("scroll", c, true); window.addEventListener("resize", c); return () => { window.removeEventListener("scroll", c, true); window.removeEventListener("resize", c); }; }, [menu]);
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    hydrate();
    prune(isKnown);
    const isNew = current.href === NEW_TAB;
    const dropped = isNew ? null : open(current, current.href);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tell the reader once that the oldest tab made room
    if (dropped) setNote(`"${dropped}" was closed to keep ${MAX_TABS} tabs open.`);
    // keep the active tab in view
    requestAnimationFrame(() => strip.current?.querySelector<HTMLElement>("[aria-current='page']")?.scrollIntoView({ block: "nearest", inline: "nearest" }));
  }, [current, hydrate, open, prune]);
  useEffect(() => { if (!note) return; const t = setTimeout(() => setNote(null), 4000); return () => clearTimeout(t); }, [note]);

  const shut = (href: string) => {
    if (href === NEW_TAB) { const last = useStudyTabs.getState().tabs.at(-1); router.push(last ? last.href : "/study"); return; }
    const next = close(href);
    if (href === current.href) router.push(next ?? "/study");
  };  // keyboard (Alt, because Ctrl+number belongs to the browser); ignored while typing
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      const tg = e.target as HTMLElement | null; if (tg && typeof tg.closest === "function" && tg.closest("input, textarea, [contenteditable='true']")) return;
      const n = /^Digit([1-8])$/.exec(e.code)?.[1];
      const list = useStudyTabs.getState().tabs; const i = list.findIndex((t) => t.href === current.href);
      if (n && list[Number(n) - 1]) { e.preventDefault(); router.push(list[Number(n) - 1].href); }
      else if (e.code === "BracketRight" && list.length > 1) { e.preventDefault(); router.push(list[(i + 1) % list.length].href); }
      else if (e.code === "BracketLeft" && list.length > 1) { e.preventDefault(); router.push(list[(i - 1 + list.length) % list.length].href); }
      else if (e.code === "KeyW" && !e.shiftKey) { e.preventDefault(); shut(current.href); }
      else if (e.code === "KeyT" && e.shiftKey) { e.preventDefault(); const h = reopen(); if (h) router.push(h); }
    };
    window.addEventListener("keydown", k, true);
    return () => window.removeEventListener("keydown", k, true);
  });

  const list = tabs.some((t) => t.href === current.href) ? tabs : [...tabs, current];
  const gOf = (id?: string) => groups.find((g) => g.id === id);
  const mt = menu ? list.find((t) => t.href === menu.href) : null;
  const item = "block w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-[var(--surface-secondary)]";
  return (
    <div className="relative">
      <div ref={strip} className="no-scrollbar flex items-end gap-1 overflow-x-auto border-b-2 border-[var(--border)]" role="tablist" aria-label="Open chapters">
        <Reorder.Group axis="x" values={list} onReorder={reorder} className="flex items-end gap-1">
          {list.map((t, idx) => {
            const on = t.href === current.href;
            const g = gOf(t.group);
            const first = g && list[idx - 1]?.group !== t.group;
            const hidden = g?.collapsed && !on;
            return (
              <Reorder.Item key={t.href} value={t} className="flex shrink-0 items-end gap-1" whileDrag={{ scale: 1.03 }}>
                {first && g && (
                  naming === g.id
                    ? <input autoFocus defaultValue={g.name} aria-label="Group name" onBlur={(e) => { renameGroup(g.id, e.target.value.trim()); setNaming(null); }} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") setNaming(null); }}
                        className="field-bare mb-1.5 h-8 w-32 rounded-full px-3 text-xs font-bold" style={{ background: `var(--tint-${g.color})`, color: `var(--tint-${g.color}-ink)` }} />
                    : <button type="button" onClick={() => toggleGroup(g.id)} onDoubleClick={() => setNaming(g.id)} aria-expanded={!g.collapsed} aria-label={`Group ${g.name}. Click to fold or unfold, double-click to rename`}
                        className="mb-1.5 inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-extrabold" style={{ background: `var(--tint-${g.color})`, color: `var(--tint-${g.color}-ink)` }}>
                        {g.name}<span className="font-num opacity-70">{list.filter((x) => x.group === g.id).length}</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${g.collapsed ? "-rotate-90" : ""}`} />
                      </button>
                )}
                {!hidden && (
                <div role="presentation" className={`group relative -mb-[2px] flex max-w-[260px] items-center gap-1.5 rounded-t-2xl border-2 border-b-0 px-3 py-2 ${on ? "border-[var(--border)] bg-[var(--surface)]" : "border-transparent bg-[var(--surface-secondary)]/60 hover:bg-[var(--surface-secondary)]"}`}
                  style={g ? { boxShadow: `inset 0 3px 0 var(--tint-${g.color}-ink)` } : undefined}
                  onDoubleClick={() => pin(t.href)} onContextMenu={(e) => { e.preventDefault(); showMenu(t.href, e.currentTarget); }}>
                  <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: `var(--tint-${t.tint ?? "peri"}-ink)` }} />
                  <Link href={t.href} role="tab" aria-selected={on} aria-current={on ? "page" : undefined} className="min-w-0" title={t.title.length > 22 || t.subject.length > 24 ? `${t.subject}: ${t.title}` : undefined}>
                    <span className="block truncate text-[11px] font-semibold leading-tight text-[var(--text-secondary)]">{t.subject}</span>
                    <span className={`block truncate text-sm leading-tight ${on ? "font-extrabold text-[var(--text-primary)]" : "font-bold text-[var(--text-secondary)]"}`}>{t.title}</span>
                  </Link>
                  {split === t.href && <Columns2 className="h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]" aria-label="Open beside" />}
                  {t.href !== NEW_TAB && <button type="button" onClick={(e) => showMenu(t.href, e.currentTarget)} aria-label={`More for ${t.title}`} className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-black/5 ${on ? "" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"}`}><MoreHorizontal className="h-3.5 w-3.5" /></button>}
                  {t.pinned ? <button type="button" onClick={() => pin(t.href)} aria-label={`Unpin ${t.title}`} className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-black/5"><Pin className="h-3.5 w-3.5" /></button>
                    : <button type="button" onClick={() => shut(t.href)} aria-label={`Close ${t.title}`} className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-black/5 ${on ? "" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"}`}><X className="h-3.5 w-3.5" /></button>}
                </div>
                )}
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
        <Link href={NEW_TAB} aria-label="New tab" className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"><Plus className="h-4 w-4" /></Link>
      </div>
      {menu && mt && (
        <div role="menu" aria-label={`Options for ${mt.title}`} style={{ left: menu.x, top: menu.y }} className="fixed z-[450] w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl" onMouseLeave={() => setMenu(null)}>
          {mt.href !== current.href && <button role="menuitem" type="button" onClick={() => { setSplit(mt.href); setMenu(null); }} className={`${item} hidden lg:block`}>Open beside this chapter</button>}
          {split && mt.href === split && <button role="menuitem" type="button" onClick={() => { setSplit(null); setMenu(null); }} className={`${item} hidden lg:block`}>Close split view</button>}
          <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">Group</p>
          <button role="menuitem" type="button" onClick={() => { newGroup(mt.href); setMenu(null); }} className={item}>Add to a new group</button>
          {groups.filter((g) => g.id !== mt.group).map((g) => <button key={g.id} role="menuitem" type="button" onClick={() => { addToGroup(mt.href, g.id); setMenu(null); }} className={item}><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: `var(--tint-${g.color}-ink)` }} />Add to {g.name}</button>)}
          {mt.group && <button role="menuitem" type="button" onClick={() => { addToGroup(mt.href, null); setMenu(null); }} className={item}>Remove from group</button>}
          {mt.group && <button role="menuitem" type="button" onClick={() => { ungroup(mt.group!); setMenu(null); }} className={item}>Ungroup all</button>}
          <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">Tab</p>
          <button role="menuitem" type="button" onClick={() => { pin(mt.href); setMenu(null); }} className={item}>{mt.pinned ? "Unpin tab" : "Pin tab"}</button>
          <button role="menuitem" type="button" onClick={() => { closeOthers(mt.href); setMenu(null); if (mt.href !== current.href) router.push(mt.href); }} className={item}>Close other tabs</button>
          {!mt.pinned && <button role="menuitem" type="button" onClick={() => { const h = mt.href; setMenu(null); shut(h); }} className={item}>Close tab</button>}
        </div>
      )}
      {note && <p role="status" className="absolute right-0 top-full z-40 mt-2 rounded-xl bg-[var(--ink)] px-3 py-2 text-xs font-semibold text-[var(--background)]">{note}</p>}
    </div>
  );
}
