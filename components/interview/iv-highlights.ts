/**
 * Highlights without touching the page: the browser's Custom Highlight API paints Range objects, so React's own DOM is never edited.
 * A highlight is stored as the quoted text; each time a chapter shows, the quote is found again and painted.
 */
export const HL_COLORS = ["yellow", "green", "pink", "blue"] as const;
export type HlColor = (typeof HL_COLORS)[number];
export type HlItem = { id: number; quote: string; color: string };

type HlApi = { highlights?: { set(k: string, v: unknown): void; delete(k: string): void } };
const api = () => (typeof window !== "undefined" ? ((window as unknown as { CSS?: HlApi }).CSS?.highlights ?? null) : null);
const Ctor = () => (window as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;

export function findRange(root: HTMLElement, quote: string): Range | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let full = ""; let prevSpace = false;
  const map: { node: Text; off: number }[] = [];
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    for (let i = 0; i < n.data.length; i++) {
      if (/\s/.test(n.data[i])) { if (prevSpace) continue; full += " "; prevSpace = true; } else { full += n.data[i]; prevSpace = false; }
      map.push({ node: n, off: i });
    }
  }
  const q = quote.replace(/\s+/g, " ").trim();
  if (!q) return null;
  const at = full.indexOf(q);
  if (at < 0) return null;
  const a = map[at], b = map[at + q.length - 1];
  const r = document.createRange();
  r.setStart(a.node, a.off); r.setEnd(b.node, b.off + 1);
  return r;
}

export function paintHighlights(root: HTMLElement, items: HlItem[]) {
  const reg = api(); const H = typeof window !== "undefined" ? Ctor() : undefined;
  if (!reg || !H) return () => undefined;
  const by: Record<string, Range[]> = {};
  for (const it of items) { const r = findRange(root, it.quote); if (r) (by[it.color] ??= []).push(r); }
  for (const c of HL_COLORS) { reg.delete(`iv-${c}`); if (by[c]?.length) reg.set(`iv-${c}`, new H(...by[c])); }
  return () => { for (const c of HL_COLORS) reg.delete(`iv-${c}`); };
}

export const supportsHighlights = () => !!api();
