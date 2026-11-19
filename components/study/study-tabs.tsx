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
import { Columns2, MoreHorizontal, Pin, Plus, X } from "lucide-react";
import { CS_SHELF } from "@/lib/study/catalog";
import { GROUP_COLORS, MAX_TABS, useStudyTabs, type StudyTab } from "@/lib/study/tabs";

/** The "+" opens a blank tab in the strip; picking a chapter there fills it. */
export const NEW_TAB = "/study/new";

const READY = CS_SHELF.flatMap((b) => b.chapters.filter((c) => c.href).map((c) => ({ href: c.href!, title: c.title, subject: b.title, tint: b.tint })));
const isKnown = (href: string) => READY.some((r) => r.href === href);

export function StudyTabs({ current }: { current: StudyTab }) {
  const router = useRouter();
  const { tabs, open, close, closeOthers, pin, reorder, prune, hydrate, reopen, groups, newGroup, addToGroup, renameGroup, toggleGroup, ungroup, split, setSplit, recolorGroup, closeGroup } = useStudyTabs();
  const [note, setNote] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ href: string; x: number; y: number } | null>(null);
  const [groupEdit, setGroupEdit] = useState<string | null>(null);
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

  // drag to reorder only with a mouse; on touch screens the strip just scrolls sideways
  const [fine, setFine] = useState(false);
  useEffect(() => { const m = window.matchMedia("(pointer: fine)"); const f = () => setFine(m.matches); f(); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  const list0 = tabs.some((t) => t.href === current.href) ? tabs : [...tabs, current];
  // a split pair shows as one merged tab (Chrome split view), placed where its first tab sits
  const pair = split && split.every((h) => list0.some((t) => t.href === h)) ? split : null;
  const list = pair ? list0.filter((t) => t.href !== pair[1]) : list0;
  const byHref = (h: string) => list0.find((t) => t.href === h)!;
  const gOf = (id?: string) => groups.find((g) => g.id === id);
  const mt = menu ? list0.find((t) => t.href === menu.href) : null;
  const editing = groupEdit ? gOf(groupEdit) : null;
  const item = "block w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-[var(--surface-secondary)]";
  const tabBox = (on: boolean) => `group relative -mb-[2px] flex items-center gap-1.5 rounded-t-2xl border-2 border-b-0 px-2 py-1.5 transition-colors sm:px-3 sm:py-2 ${on ? "border-[var(--border)] bg-[var(--surface)]" : "border-transparent bg-[var(--surface-secondary)]/60 hover:bg-[var(--surface-secondary)]"}`;
  const label = (t: StudyTab, on: boolean) => (
    <span className="block min-w-0">
      <span className="hidden truncate text-[11px] font-semibold leading-tight text-[var(--text-secondary)] sm:block">{t.subject}</span>
      <span className={`block truncate text-sm leading-tight ${on ? "font-extrabold text-[var(--text-primary)]" : "font-bold text-[var(--text-secondary)]"}`}>{t.title}</span>
    </span>
  );
  return (
    <div className="relative">
      <div ref={strip} className="no-scrollbar flex items-end gap-1 overflow-x-auto overscroll-x-contain border-b-2 border-[var(--border)]" role="tablist" aria-label="Open chapters">
        <Reorder.Group axis="x" values={list} onReorder={(v) => reorder(pair ? v.flatMap((t) => (t.href === pair[0] ? [t, byHref(pair[1])] : [t])) : v)} className="flex items-end gap-1">
          {list.map((t, idx) => {
            const isPair = pair && t.href === pair[0];
            const on = isPair ? pair.includes(current.href) : t.href === current.href;
            const g = gOf(t.group);
            const first = g && list[idx - 1]?.group !== t.group;
            const last = g && list[idx + 1]?.group !== t.group;
            const hidden = g?.collapsed && !on;
            return (
              <Reorder.Item key={t.href} value={t} drag={fine ? "x" : false} dragListener={fine} className="flex shrink-0 items-end gap-1" whileDrag={{ scale: 1.03 }}>
                {first && g && (
                  <button type="button" onClick={() => toggleGroup(g.id)} onContextMenu={(e) => { e.preventDefault(); setGroupEdit(g.id); }} onDoubleClick={() => setGroupEdit(g.id)} aria-expanded={!g.collapsed}
                    aria-label={`Group ${g.name}, ${list0.filter((x) => x.group === g.id).length} tabs. Click to ${g.collapsed ? "expand" : "collapse"}, right-click to edit`}
                    className="relative mb-1 inline-flex h-7 shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-extrabold" style={{ background: `var(--tint-${g.color}-ink)`, color: "var(--surface)" }}>
                    {g.name}{g.collapsed && <span className="rounded-full bg-black/20 px-1.5 font-num">{list0.filter((x) => x.group === g.id).length}</span>}
                  </button>
                )}
                <AnimatePresence initial={false}>
                  {!hidden && (
                    <motion.div key="tab" initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden">
                      {isPair ? (
                        <div role="presentation" className={`${tabBox(on)} max-w-[230px] sm:max-w-[420px]`} onContextMenu={(e) => { e.preventDefault(); showMenu(t.href, e.currentTarget); }}>
                          <Columns2 className="h-4 w-4 shrink-0 text-[var(--st-accent,var(--text-secondary))]" aria-hidden />
                          <Link draggable={false} href={pair.includes(current.href) ? current.href : pair[0]} role="tab" aria-selected={on} aria-current={on ? "page" : undefined} className="flex min-w-0 items-center gap-2" aria-label={`Split view: ${byHref(pair[0]).title} and ${byHref(pair[1]).title}`}>
                            <span className="max-w-[150px]">{label(byHref(pair[0]), on)}</span>
                            <span aria-hidden className="h-7 w-px bg-[var(--border)]" />
                            <span className="max-w-[150px]">{label(byHref(pair[1]), on)}</span>
                          </Link>
                          <button type="button" onClick={(e) => showMenu(t.href, e.currentTarget)} aria-label="Split view options" className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-black/5"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                          <button type="button" onClick={() => { const viewing = pair.includes(current.href); close(pair[1]); const next = close(pair[0]); if (viewing) router.push(next ?? "/study"); }} aria-label={`Close split view: ${byHref(pair[0]).title} and ${byHref(pair[1]).title}`} className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-black/5"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ) : (
                        <div role="presentation" className={`${tabBox(on)} max-w-[170px] sm:max-w-[260px]`} onDoubleClick={() => pin(t.href)} onContextMenu={(e) => { e.preventDefault(); showMenu(t.href, e.currentTarget); }}>
                          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: `var(--tint-${t.tint ?? "peri"}-ink)` }} />
                          <Link draggable={false} href={t.href} role="tab" aria-selected={on} aria-current={on ? "page" : undefined} className="min-w-0" title={t.title.length > 22 || t.subject.length > 24 ? `${t.subject}: ${t.title}` : undefined}>{label(t, on)}</Link>
                          {t.href !== NEW_TAB && <button type="button" onClick={(e) => showMenu(t.href, e.currentTarget)} aria-label={`More for ${t.title}`} className={`hidden h-6 w-6 shrink-0 place-items-center sm:grid rounded-full text-[var(--text-secondary)] hover:bg-black/5 ${on ? "" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"}`}><MoreHorizontal className="h-3.5 w-3.5" /></button>}
                          {t.pinned ? <button type="button" onClick={() => pin(t.href)} aria-label={`Unpin ${t.title}`} className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-black/5"><Pin className="h-3.5 w-3.5" /></button>
                            : <button type="button" onClick={() => shut(t.href)} aria-label={`Close ${t.title}`} className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-black/5 ${on ? "" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"}`}><X className="h-3.5 w-3.5" /></button>}
                        </div>
                      )}
                      {/* Chrome-style group line under every tab of the group */}
                      {g && <span aria-hidden className={`absolute bottom-0 h-[3px] ${first ? "left-0" : "-left-1"} ${last ? "right-0" : "-right-1"}`} style={{ background: `var(--tint-${g.color}-ink)` }} />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
        <Link href={NEW_TAB} aria-label="New tab" className="sticky right-0 z-10 mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-sm hover:bg-[var(--surface-secondary)]"><Plus className="h-4 w-4" /></Link>
      </div>
      {menu && mt && (
        <div role="menu" aria-label={`Options for ${mt.title}`} style={{ left: menu.x, top: menu.y }} className="fixed z-[450] w-60 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl" onMouseLeave={() => setMenu(null)}>
          {pair && pair[0] === mt.href ? <>
            <button role="menuitem" type="button" onClick={() => { setSplit(null); setMenu(null); }} className={item}>Separate views</button>
            <button role="menuitem" type="button" onClick={() => { setSplit([pair[1], pair[0]]); setMenu(null); }} className={item}>Swap sides</button>
          </> : <>
            {mt.href !== current.href && !pair?.includes(mt.href) && <button role="menuitem" type="button" onClick={() => { setSplit([current.href, mt.href]); setMenu(null); }} className={`${item} hidden lg:block`}>Add to split view with this tab</button>}
            <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">Group</p>
            <button role="menuitem" type="button" onClick={() => { newGroup(mt.href); setMenu(null); setTimeout(() => setGroupEdit(useStudyTabs.getState().groups.at(-1)?.id ?? null), 0); }} className={item}>Add tab to new group</button>
            {groups.filter((g) => g.id !== mt.group).map((g) => <button key={g.id} role="menuitem" type="button" onClick={() => { addToGroup(mt.href, g.id); setMenu(null); }} className={item}><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: `var(--tint-${g.color}-ink)` }} />Add to {g.name}</button>)}
            {mt.group && <button role="menuitem" type="button" onClick={() => { addToGroup(mt.href, null); setMenu(null); }} className={item}>Remove from group</button>}
            <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">Tab</p>
            <button role="menuitem" type="button" onClick={() => { pin(mt.href); setMenu(null); }} className={item}>{mt.pinned ? "Unpin tab" : "Pin tab"}</button>
            <button role="menuitem" type="button" onClick={() => { closeOthers(mt.href); setMenu(null); if (mt.href !== current.href) router.push(mt.href); }} className={item}>Close other tabs</button>
            {!mt.pinned && <button role="menuitem" type="button" onClick={() => { const h = mt.href; setMenu(null); shut(h); }} className={item}>Close tab</button>}
          </>}
        </div>
      )}
      {editing && (
        <div role="dialog" aria-label="Edit tab group" className="fixed inset-0 z-[440]" onClick={() => setGroupEdit(null)} onKeyDown={(e) => { if (e.key === "Escape" || (e.key === "Enter" && !(e.target instanceof HTMLButtonElement))) setGroupEdit(null); }}>
          <div onClick={(e) => e.stopPropagation()} className="absolute left-1/2 top-40 w-72 -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl lg:left-[22rem] lg:translate-x-0">
            <input autoFocus defaultValue={editing.name} aria-label="Group name" maxLength={24} onChange={(e) => renameGroup(editing.id, e.target.value.trim())} onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setGroupEdit(null); }}
              className="field-bare w-full rounded-xl border-2 px-3 py-2 text-sm font-bold" style={{ borderColor: `var(--tint-${editing.color}-ink)` }} />
            <div className="mt-3 flex gap-2">{GROUP_COLORS.map((c) => <button key={c} type="button" aria-label={`Colour ${c}`} aria-pressed={editing.color === c} onClick={() => recolorGroup(editing.id, c)} className={`h-7 w-7 rounded-full ${editing.color === c ? "ring-2 ring-[var(--text-primary)] ring-offset-2 ring-offset-[var(--surface)]" : ""}`} style={{ background: `var(--tint-${c}-ink)` }} />)}</div>
            <div className="mt-3 space-y-0.5 border-t border-[var(--border)] pt-2">
              <button type="button" onClick={() => { toggleGroup(editing.id); setGroupEdit(null); }} className={item}>{editing.collapsed ? "Expand group" : "Collapse group"}</button>
              <button type="button" onClick={() => { ungroup(editing.id); setGroupEdit(null); }} className={item}>Ungroup</button>
              <button type="button" onClick={() => { const gone = closeGroup(editing.id); setGroupEdit(null); if (gone.includes(current.href)) { const last = useStudyTabs.getState().tabs.at(-1); router.push(last ? last.href : "/study"); } }} className={`${item} text-rose-700 dark:text-rose-300`}>Close group</button>
            </div>
          </div>
        </div>
      )}
      {note && <p role="status" className="absolute right-0 top-full z-40 mt-2 rounded-xl bg-[var(--ink)] px-3 py-2 text-xs font-semibold text-[var(--background)]">{note}</p>}
    </div>
  );
}
