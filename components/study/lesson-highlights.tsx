"use client";

import { useEffect, useState } from "react";
import { Highlighter, NotebookPen, X } from "lucide-react";
import { HL_COLORS, paintHighlights, supportsHighlights } from "@/components/interview/iv-highlights";

type Item = { id: number; quote: string; color: string; note: string };
const SWATCH: Record<string, string> = { yellow: "#fde047", green: "#86efac", pink: "#f9a8d4", blue: "#93c5fd" };
const key = (lesson: string) => `renyxera.study.hl.${lesson}`;
const loadLocal = (lesson: string): Item[] => { try { return (JSON.parse(localStorage.getItem(key(lesson)) ?? "[]") as Item[]).map((x) => ({ ...x, note: x.note ?? "" })); } catch { return []; } };
const saveLocal = (lesson: string, items: Item[]) => { try { localStorage.setItem(key(lesson), JSON.stringify(items)); } catch { /* private mode */ } };

/**
 * Highlights and notes for a lesson. Select text in the article, pick a colour, then type a note under it in the side list.
 * Signed in (and migration 0059 applied): saved to the account and synced across devices; anything kept on this device earlier is uploaded once.
 * Otherwise: kept on this device. Painted with the browser's Custom Highlight API, so React's DOM is never edited.
 */
export function useLessonHighlights(lesson: string) {
  const [art, setArt] = useState<HTMLElement | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [cloud, setCloud] = useState(false);
  const [sel, setSel] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    let alive = true;
    const local = loadLocal(lesson);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show this device's copy at once, then the account's
    setItems(local);
    void (async () => {
      const r = await fetch(`/api/study/notes?lesson=${encodeURIComponent(lesson)}`, { cache: "no-store" }).catch(() => null);
      if (!alive || !r?.ok) return;                                  // signed out or table missing: stay on this device
      let list = ((await r.json()) as { notes: Item[] }).notes;
      const fresh = local.filter((l) => !list.some((c) => c.quote === l.quote));
      for (const l of fresh) {                                       // one-time upload of highlights made on this device
        const u = await fetch("/api/study/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lesson, quote: l.quote, note: l.note, color: l.color }) }).catch(() => null);
        if (u?.ok) list = [...list, ((await u.json()) as { note: Item }).note];
      }
      if (!alive) return;
      saveLocal(lesson, []);
      setCloud(true); setItems(list);
    })();
    return () => { alive = false; };
  }, [lesson]);
  useEffect(() => { if (art) return paintHighlights(art, items); }, [art, items]);
  useEffect(() => {
    if (!supportsHighlights()) return;
    let t: ReturnType<typeof setTimeout>;
    const read = () => {
      const s = window.getSelection();
      if (!s || s.isCollapsed || !art || !s.anchorNode || !art.contains(s.anchorNode) || !art.contains(s.focusNode)) { setSel(null); return; }
      const text = s.toString().replace(/\s+/g, " ").trim();
      if (text.length < 3) { setSel(null); return; }
      const r = s.getRangeAt(0).getBoundingClientRect();
      setSel({ text, x: Math.min(Math.max(r.left + r.width / 2, 120), window.innerWidth - 120), y: Math.max(r.top - 8, 72) });
    };
    const onChange = () => { clearTimeout(t); t = setTimeout(read, 250); };
    document.addEventListener("selectionchange", onChange);
    return () => { clearTimeout(t); document.removeEventListener("selectionchange", onChange); };
  }, [art]);

  const persist = (next: Item[]) => { setItems(next); if (!cloud) saveLocal(lesson, next); };
  const add = async (color: string) => {
    if (!sel) return;
    const quote = sel.text;
    window.getSelection()?.removeAllRanges(); setSel(null);
    if (cloud) {
      const r = await fetch("/api/study/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lesson, quote, color }) }).catch(() => null);
      if (r?.ok) { const { note } = (await r.json()) as { note: Item }; setItems((x) => [...x, note]); return; }
    }
    persist([...items, { id: items.reduce((m, x) => Math.max(m, x.id), 0) + 1, quote, color, note: "" }]);
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

  const toolbar = sel && (
    <div role="toolbar" aria-label="Highlight selection" style={{ left: sel.x, top: sel.y }}
      className="fixed z-[560] flex -translate-x-1/2 -translate-y-full items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[0_14px_34px_-12px_rgba(40,20,120,.5)]">
      <Highlighter className="ml-1.5 h-4 w-4 text-[var(--text-muted)]" aria-hidden />
      {HL_COLORS.map((c) => <button key={c} type="button" aria-label={`Highlight ${c}`} onMouseDown={(e) => e.preventDefault()} onClick={() => void add(c)} className="h-7 w-7 cursor-pointer rounded-full border-2 border-white" style={{ background: SWATCH[c] }} />)}
    </div>
  );

  const list = (
    <div className="card-pastel p-5" data-tint="butter">
      <p className="flex items-center gap-2 font-bold text-[var(--text-primary)]"><Highlighter className="h-4 w-4" aria-hidden /> Highlights and notes</p>
      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{cloud ? "Saved to your account" : "Saved on this device"}</p>
      {items.length === 0
        ? <p className="mt-2 text-sm text-[var(--text-secondary)]">{supportsHighlights() ? "Select any text in the lesson to highlight it, then add a note." : "Highlighting needs a newer browser."}</p>
        : <ul className="mt-3 space-y-3">{items.map((h) => (
          <li key={h.id} className="rounded-2xl bg-[var(--surface)] p-3">
            <div className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
              <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: SWATCH[h.color] }} />
              <span className="min-w-0 flex-1 break-words font-semibold">{h.quote}</span>
              <button type="button" aria-label="Remove highlight" onClick={() => remove(h.id)} className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-secondary)]"><X className="h-3.5 w-3.5" /></button>
            </div>
            <label className="mt-2 flex items-start gap-2">
              <NotebookPen className="mt-2 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" aria-hidden />
              <textarea value={h.note} onChange={(e) => setNote(h.id, e.target.value)} onBlur={() => saveNote(h.id)} rows={h.note ? 2 : 1} maxLength={2000}
                placeholder="Add a note…" aria-label="Note for this highlight"
                className="min-h-[34px] w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-violet,#7c3aed)]" />
            </label>
          </li>))}</ul>}
    </div>
  );

  return { attach: setArt, toolbar, list };
}
