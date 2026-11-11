"use client";

import { useEffect, useState } from "react";
import { Highlighter, X } from "lucide-react";
import { HL_COLORS, paintHighlights, supportsHighlights, type HlItem } from "@/components/interview/iv-highlights";

const SWATCH: Record<string, string> = { yellow: "#fde047", green: "#86efac", pink: "#f9a8d4", blue: "#93c5fd" };
const key = (lesson: string) => `renyxera.study.hl.${lesson}`;
const load = (lesson: string): HlItem[] => { try { return JSON.parse(localStorage.getItem(key(lesson)) ?? "[]") as HlItem[]; } catch { return []; } };
const save = (lesson: string, items: HlItem[]) => { try { localStorage.setItem(key(lesson), JSON.stringify(items)); } catch { /* private mode */ } };

/**
 * Highlights for a lesson. Select text inside the article, pick a colour; the quote is kept on this device and painted again on every visit
 * with the browser's Custom Highlight API (React's DOM is never edited). Shows a small "Your highlights" list with remove buttons.
 */
export function useLessonHighlights(lesson: string) {
  const [art, setArt] = useState<HTMLElement | null>(null);
  const [items, setItems] = useState<HlItem[]>([]);
  const [sel, setSel] = useState<{ text: string; x: number; y: number } | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- reads this device's saved highlights after mount
  useEffect(() => { setItems(load(lesson)); }, [lesson]);
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

  const add = (color: string) => {
    if (!sel) return;
    const next = [...items, { id: items.reduce((m, x) => Math.max(m, x.id), 0) + 1, quote: sel.text, color }];
    setItems(next); save(lesson, next); window.getSelection()?.removeAllRanges(); setSel(null);
  };
  const remove = (id: number) => { const next = items.filter((x) => x.id !== id); setItems(next); save(lesson, next); };

  const toolbar = sel && (
    <div role="toolbar" aria-label="Highlight selection" style={{ left: sel.x, top: sel.y }}
      className="fixed z-[560] flex -translate-x-1/2 -translate-y-full items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[0_14px_34px_-12px_rgba(40,20,120,.5)]">
      <Highlighter className="ml-1.5 h-4 w-4 text-[var(--text-muted)]" aria-hidden />
      {HL_COLORS.map((c) => <button key={c} type="button" aria-label={`Highlight ${c}`} onMouseDown={(e) => e.preventDefault()} onClick={() => add(c)} className="h-7 w-7 cursor-pointer rounded-full border-2 border-white" style={{ background: SWATCH[c] }} />)}
    </div>
  );

  const list = (
    <div className="card-pastel p-5" data-tint="butter">
      <p className="flex items-center gap-2 font-bold text-[var(--text-primary)]"><Highlighter className="h-4 w-4" aria-hidden /> Your highlights</p>
      {items.length === 0
        ? <p className="mt-1 text-sm text-[var(--text-secondary)]">{supportsHighlights() ? "Select any text in the lesson to highlight it." : "Highlighting needs a newer browser."}</p>
        : <ul className="mt-2 space-y-2">{items.map((h) => (
          <li key={h.id} className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: SWATCH[h.color] }} />
            <span className="min-w-0 flex-1 break-words">{h.quote}</span>
            <button type="button" aria-label="Remove highlight" onClick={() => remove(h.id)} className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface)]"><X className="h-3.5 w-3.5" /></button>
          </li>))}</ul>}
    </div>
  );

  return { attach: setArt, toolbar, list };
}
