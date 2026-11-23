/** Every written chapter by its page link, fetched on demand for split view and the chapter menu. The server sends only what the
 *  viewer may read (app/api/study/chapter), so no lesson content is bundled into the browser. */
import type { Chapter, WireChapter } from "@/lib/study/schema";
import { fromWire } from "@/lib/study/schema";
import { decodeWire, type Scrambled } from "@/lib/study/wire-guard";
import { CS_SHELF } from "@/lib/study/catalog";

const cache = new Map<string, Promise<Chapter>>();
const load = (href: string) => {
  let p = cache.get(href);
  if (!p) { p = fetch(`/api/study/chapter?href=${encodeURIComponent(href)}`, { cache: "no-store", headers: { "x-rx-study": "1" } }).then(async (r) => { if (!r.ok) throw new Error(r.status === 429 ? "slow" : "chapter"); const s = (await r.json()) as Scrambled; return fromWire(JSON.parse(decodeWire(s.d, s.n, href)) as WireChapter); }); p.catch(() => cache.delete(href)); cache.set(href, p); }
  return p;
};
export const CHAPTERS: Record<string, () => Promise<Chapter>> = Object.fromEntries(
  CS_SHELF.flatMap((b) => b.chapters.filter((c) => c.href).map((c) => [c.href!, () => load(c.href!)])),
);
/** Forget cached chapters (after a purchase opens more topics). */
export const clearChapterCache = () => cache.clear();
