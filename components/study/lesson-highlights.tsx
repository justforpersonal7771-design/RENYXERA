"use client";

import { useEffect, useMemo, useState } from "react";
import { Reorder } from "motion/react";
import { GripVertical, Highlighter, NotebookPen, PenLine, X } from "lucide-react";
import { HL_COLORS, paintHighlights, supportsHighlights } from "@/components/interview/iv-highlights";

type Item = { id: number; quote: string; color: string; note: string };
const SWATCH: Record<string, string> = { yellow: "#fde047", green: "#86efac", pink: "#f9a8d4", blue: "#93c5fd" };
const key = (lesson: string) => `renyxera.study.hl.${lesson}`;
const orderKey = (lesson: string) => `renyxera.study.hl-order.${lesson}`;
const loadLocal = (lesson: string): Item[] => { try { return (JSON.parse(localStorage.getItem(key(lesson)) ?? "[]") as Item[]).map((x) => ({ ...x, note: x.note ?? "" })); } catch { return []; } };
const saveLocal = (lesson: string, items: Item[]) => { try { localStorage.setItem(key(lesson), JSON.stringify(items)); } catch { /* private mode */ } };
const WORD = /[\p{L}\p{N}_'’-]/u;
/** Lessons whose device copy is being uploaded right now (two mounted hooks must not upload the same notes twice). */
const uploading = new Set<string>();

/** Grow a selection to whole words, so a highlight never starts or ends inside a word. */
function snapToWords(r: Range) {
  const s = r.startContainer, e = r.endContainer;
  if (s.nodeType === Node.TEXT_NODE) { const t = s.textContent ?? ""; let i = r.startOffset; while (i > 0 && WORD.test(t[i - 1])) i--; r.setStart(s, i); }
  if (e.nodeType === Node.TEXT_NODE) { const t = e.textContent ?? ""; let i = r.endOffset; while (i < t.length && WORD.test(t[i])) i++; r.setEnd(e, i); }
  return r;
}

/** The text of the lesson the student currently has selected (shared with the Mentor as context). */
export const LESSON_SELECTION_EVENT = "renyxera:lesson-selection";

/**
 * Highlights and notes for a lesson (owner, 18 Nov, third pass): selections snap to whole words; the pen writes a note right
 * at the selection; the list filters by colour, sorts by place in the lesson / newest / your own order (drag to reorder),
 * and tapping a highlight jumps to it in the lesson. Signed in: saved to the account; otherwise on this device.
 * Painted with the browser's Custom Highlight API, so React's DOM is never edited.
 */
export function useLessonHighlights(lesson: string) {
  const [art, setArt] = useState<HTMLElement | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [cloud, setCloud] = useState(false);
  const [sel, setSel] = useState<{ text: string; x: number; y: number; below?: boolean } | null>(null);
  const [penFor, setPenFor] = useState<{ id: number; x: number; y: number } | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<"place" | "newest" | "mine">("place");
  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    let alive = true;
    const local = loadLocal(lesson);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show this device's copy at once, then the account's
    setItems(local);
    try { setOrder(JSON.parse(localStorage.getItem(orderKey(lesson)) ?? "[]")); } catch { /* none */ }
    void (async () => {
      const r = await fetch(`/api/study/notes?lesson=${encodeURIComponent(lesson)}`, { cache: "no-store" }).catch(() => null);
      if (!alive || !r?.ok) return;
      let list = ((await r.json()) as { notes: Item[] }).notes;
      const fresh = uploading.has(lesson) ? [] : local.filter((l) => !list.some((c) => c.quote === l.quote));
      if (fresh.length) uploading.add(lesson);
      for (const l of fresh) {
        const u = await fetch("/api/study/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lesson, quote: l.quote, note: l.note, color: l.color }) }).catch(() => null);
        if (u?.ok) list = [...list, ((await u.json()) as { note: Item }).note];
      }
      if (!alive) return;
      uploading.delete(lesson);
      saveLocal(lesson, []);
      setCloud(true); setItems(list.filter((x, i, all) => all.findIndex((y) => y.id === x.id) === i));
    })();
    return () => { alive = false; };
  }, [lesson]);
  useEffect(() => { if (art) return paintHighlights(art, items); }, [art, items]);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const read = () => {
      const s = window.getSelection();
      if (!s || s.isCollapsed || !art || !s.anchorNode || !art.contains(s.anchorNode) || !art.contains(s.focusNode)) { setSel(null); window.dispatchEvent(new CustomEvent(LESSON_SELECTION_EVENT, { detail: "" })); return; }
      const range = snapToWords(s.getRangeAt(0).cloneRange());
      const text = range.toString().replace(/\s+/g, " ").trim();
      if (text.length < 3) { setSel(null); return; }
      window.dispatchEvent(new CustomEvent(LESSON_SELECTION_EVENT, { detail: text.slice(0, 600) }));
      if (!supportsHighlights()) return;
      const r = range.getBoundingClientRect();
      const touch = window.matchMedia("(pointer: coarse)").matches; // phones put their own Copy menu above a selection, so ours goes below
      setSel({ text, x: Math.min(Math.max(r.left + r.width / 2, 140), window.innerWidth - 140), y: touch ? Math.min(r.bottom + 34, window.innerHeight - 120) : Math.max(r.top - 8, 72), below: touch });
    };
    const onChange = () => { clearTimeout(t); t = setTimeout(read, 250); };
    document.addEventListener("selectionchange", onChange);
    return () => { clearTimeout(t); document.removeEventListener("selectionchange", onChange); };
  }, [art]);

  const persist = (next: Item[]) => { setItems(next); if (!cloud) saveLocal(lesson, next); };
  const add = async (color: string, withNote = false) => {
    if (!sel) return;
    const quote = sel.text, at = { x: sel.x, y: sel.y };
    window.getSelection()?.removeAllRanges(); setSel(null);
    // the same words are never saved twice: reuse the existing highlight (and open its note) instead of adding another
    const same = items.find((x) => x.quote === quote);
    if (same) { persist(items.map((x) => (x.id === same.id ? { ...x, color } : x))); if (withNote) setPenFor({ id: same.id, ...at }); return; }
    let made: Item | null = null;
    if (cloud) {
      const r = await fetch("/api/study/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lesson, quote, color }) }).catch(() => null);
      if (r?.ok) { const fromServer = ((await r.json()) as { note: Item }).note; made = fromServer; setItems((x) => [...x, fromServer]); }
    }
    if (!made) { made = { id: items.reduce((m, x) => Math.max(m, x.id), 0) + 1, quote, color, note: "" }; persist([...items, made]); }
    if (withNote) setPenFor({ id: made.id, ...at });
  };
  const remove = (id: number) => {
    persist(items.filter((x) => x.id !== id));
    if (cloud) void fetch(`/api/study/notes?id=${id}`, { method: "DELETE" });
  };
  const setNote = (id: number, note: string) => persist(items.map((x) => (x.id === id ? { ...x, note } : x)));
  const saveNote = (id: number) => {
    const it = items.find((x) => x.id === id);
    if (cloud && it) void fetch("/api/study/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, note: it.note }) });
  };
  /** Scroll the lesson to a highlight and flash it. */
  const jump = (quote: string) => {
    if (!art) return;
    const w = document.createTreeWalker(art, NodeFilter.SHOW_TEXT);
    const probe = quote.slice(0, 40);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const i = (n.textContent ?? "").indexOf(probe);
      if (i < 0) continue;
      const el = n.parentElement!;
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      el.classList.add("hl-flash"); setTimeout(() => el.classList.remove("hl-flash"), 1600);
      return;
    }
  };

  const shown = useMemo(() => {
    const text = art?.textContent ?? "";
    let l = items.filter((x) => !filter || x.color === filter);
    if (sort === "place") l = [...l].sort((a, b) => text.indexOf(a.quote.slice(0, 40)) - text.indexOf(b.quote.slice(0, 40)));
    else if (sort === "newest") l = [...l].sort((a, b) => b.id - a.id);
    else l = [...l].sort((a, b) => (order.indexOf(a.id) + 1 || 1e9) - (order.indexOf(b.id) + 1 || 1e9));
    return l;
  }, [items, filter, sort, order, art]);
  const reorder = (next: Item[]) => {
    const ids = next.map((x) => x.id);
    setSort("mine"); setOrder(ids);
    try { localStorage.setItem(orderKey(lesson), JSON.stringify(ids)); } catch { /* private */ }
  };

  const penItem = penFor ? items.find((x) => x.id === penFor.id) : null;
  const toolbar = (
    <>
      {sel && (
        <div role="toolbar" aria-label="Highlight selection" style={{ left: sel.x, top: sel.y }}
          className={`fixed z-[560] flex -translate-x-1/2 ${sel.below ? "" : "-translate-y-full"} items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[0_14px_34px_-12px_rgba(40,20,120,.5)]`}>
          <Highlighter className="ml-1.5 h-4 w-4 text-[var(--text-muted)]" aria-hidden />
          {HL_COLORS.map((c) => <button key={c} type="button" aria-label={`Highlight ${c}`} onMouseDown={(e) => e.preventDefault()} onClick={() => void add(c)} className="h-7 w-7 cursor-pointer rounded-full border-2 border-white" style={{ background: SWATCH[c] }} />)}
          <span className="mx-0.5 h-5 w-px bg-[var(--border)]" aria-hidden />
          <button type="button" aria-label="Highlight and write a note" title="Write a note here" onMouseDown={(e) => e.preventDefault()} onClick={() => void add("yellow", true)} className="grid h-7 w-7 place-items-center rounded-full bg-[var(--surface-secondary)] text-[var(--text-primary)]"><PenLine className="h-4 w-4" /></button>
        </div>
      )}
      {penItem && penFor && (
        <div role="dialog" aria-label="Write a note" style={{ left: penFor.x, top: penFor.y }} className="fixed z-[560] w-[300px] -translate-x-1/2 -translate-y-full rounded-2xl border-2 p-2 shadow-[0_18px_40px_-14px_rgba(0,0,0,.4)]"
          onKeyDown={(e) => { if (e.key === "Escape") { saveNote(penItem.id); setPenFor(null); } }}>
          <div className="absolute inset-0 -z-10 rounded-2xl bg-[var(--surface)]" />
          <p className="mb-1 line-clamp-1 px-1 text-xs font-semibold" style={{ boxShadow: `inset 0 -0.6em ${SWATCH[penItem.color]}` }}>{penItem.quote}</p>
          <textarea autoFocus value={penItem.note} onChange={(e) => setNote(penItem.id, e.target.value)} rows={3} maxLength={2000} placeholder="Your note" aria-label="Your note"
            className="field-bare w-full resize-none rounded-xl bg-[var(--surface-secondary)] px-2.5 py-2 text-sm text-[var(--text-primary)]" />
          <div className="mt-1 flex justify-end gap-2"><button type="button" onClick={() => { saveNote(penItem.id); setPenFor(null); }} className="pill-ink !py-1 text-xs">Save</button></div>
        </div>
      )}
    </>
  );

  // the filter and sort bar sits outside the scrolling list (owner, 19 Nov): nothing scrolls above it and the scrollbar starts below it
  const listBar = items.length === 0 ? null : (
          <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-[var(--border)] px-4 py-2.5">
      <button type="button" onClick={() => setFilter(null)} aria-pressed={!filter} className={`rounded-full px-2.5 py-1 text-xs font-bold ${!filter ? "bg-[var(--ink)] text-[var(--background)]" : "bg-[var(--surface-secondary)] text-[var(--text-primary)]"}`}>All</button>
      {HL_COLORS.map((c) => <button key={c} type="button" onClick={() => setFilter(filter === c ? null : c)} aria-pressed={filter === c} aria-label={`Only ${c}`} className={`h-6 w-6 rounded-full border-2 ${filter === c ? "border-[var(--text-primary)]" : "border-transparent"}`} style={{ background: SWATCH[c] }} />)}
      <span className="flex-1" />
      {(["place", "newest", "mine"] as const).map((k) => <button key={k} type="button" onClick={() => setSort(k)} aria-pressed={sort === k} className={`rounded-full px-2 py-1 text-xs font-bold ${sort === k ? "bg-[var(--surface-secondary)] text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>{k === "place" ? "In lesson" : k === "newest" ? "Newest" : "My order"}</button>)}
    </div>
  );
  const list = (
    <div className="px-1 pb-1">
      {items.length === 0
        ? <p className="mt-1 text-sm text-[var(--text-secondary)]">{supportsHighlights() ? "Select any text in the lesson to highlight it. The pen writes a note right there." : "Highlighting needs a newer browser."}</p>
        : <>

          <Reorder.Group axis="y" values={shown} onReorder={reorder} className="space-y-2.5">
            {shown.map((h) => (
              <Reorder.Item key={h.id} value={h} className="rounded-2xl p-3" style={{ background: `color-mix(in srgb, ${SWATCH[h.color]} 30%, var(--surface))`, borderLeft: `5px solid ${SWATCH[h.color]}` }}>
                <div className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
                  <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-[var(--text-muted)]" aria-label="Drag to reorder" />
                  <button type="button" onClick={() => jump(h.quote)} title="Show in the lesson" className="min-w-0 flex-1 break-words text-left font-semibold hover:underline">{h.quote}</button>
                  <button type="button" aria-label="Remove highlight" onClick={() => remove(h.id)} className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-muted)] hover:bg-black/5"><X className="h-3.5 w-3.5" /></button>
                </div>
                <label className="mt-2 flex items-start gap-2">
                  <NotebookPen className="mt-2 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" aria-hidden />
                  <textarea value={h.note} onChange={(e) => setNote(h.id, e.target.value)} onBlur={() => saveNote(h.id)} rows={h.note ? 2 : 1} maxLength={2000}
                    placeholder="Add a note…" aria-label="Note for this highlight"
                    className="min-h-[34px] w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]" />
                </label>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </>}
    </div>
  );

  return { attach: setArt, toolbar, list, listBar, count: items.length, items };
}
