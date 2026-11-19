/**
 * Study materials are a separate product (owner decision S1, 31 Oct 2026; docs/study-materials/13-PRICING-BUNDLES-AND-OFFERS.md):
 * per-subject packs plus curated bundles. No plan (Free, Plus or Pro) unlocks them. Free readers get a small sample:
 * the first FREE_TOPICS topics of each book's first ready chapter. Prices are the doc's figures (INR, GST inclusive).
 */
import { CS_SHELF } from "@/lib/study/catalog";

export const FREE_TOPICS = 2;

export type Pack = { id: string; name: string; books: string[]; pricePaise: number; marks: number };
export const PACKS: Pack[] = [
  { id: "os", name: "Operating Systems", books: ["os"], pricePaise: 14900, marks: 8.4 },
  { id: "toc", name: "Theory of Computation", books: ["toc"], pricePaise: 14900, marks: 8.1 },
  { id: "cn", name: "Computer Networks", books: ["cn"], pricePaise: 14900, marks: 7.9 },
  { id: "coa", name: "Computer Organization & Architecture", books: ["coa"], pricePaise: 14900, marks: 7.7 },
  { id: "algo", name: "Algorithms", books: ["algo"], pricePaise: 14900, marks: 7.6 },
  { id: "dm", name: "Discrete Mathematics", books: ["dm"], pricePaise: 14900, marks: 7.5 },
  { id: "dbms", name: "Database Management Systems", books: ["dbms"], pricePaise: 14900, marks: 7.4 },
  { id: "dl", name: "Digital Logic", books: ["dl"], pricePaise: 12900, marks: 6.9 },
  { id: "pds", name: "Programming & Data Structures", books: ["pds"], pricePaise: 12900, marks: 10.1 },
  { id: "cd", name: "Compiler Design", books: ["cd"], pricePaise: 12900, marks: 5.7 },
  { id: "maths", name: "Engineering Maths", books: ["la", "prob", "calc"], pricePaise: 9900, marks: 7.8 },
  { id: "apt", name: "General Aptitude", books: ["verbal", "quant", "analytical", "spatial"], pricePaise: 14900, marks: 15 },
];

export type Bundle = { id: string; name: string; packs: string[]; pricePaise: number; note: string };
export const BUNDLES: Bundle[] = [
  { id: "marks5", name: "Marks Magnet 5", packs: ["os", "toc", "cn", "coa", "algo"], pricePaise: 59900, note: "The five technical subjects with the most marks" },
  { id: "tough4", name: "Toughest 4", packs: ["dm", "algo", "cd", "os"], pricePaise: 47900, note: "The highest share of Hard questions" },
  { id: "systems", name: "Systems Core", packs: ["os", "coa", "cn", "dbms"], pricePaise: 49900, note: "Machines, networks and data" },
  { id: "theory", name: "Theory & Maths", packs: ["toc", "dm", "cd", "maths"], pricePaise: 42900, note: "Automata, logic, compilers and maths" },
  { id: "complete", name: "Complete CS", packs: ["os", "toc", "cn", "coa", "algo", "dm", "dbms", "dl", "pds", "cd", "maths"], pricePaise: 99900, note: "All 11 technical packs" },
];
export const BUILD_YOUR_OWN_OFF = 15; // % off any 3 or more packs

export const packTotal = (ids: string[]) => ids.reduce((s, id) => s + (PACKS.find((p) => p.id === id)?.pricePaise ?? 0), 0);
export const rupees = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;
export const packOfBook = (bookId: string) => PACKS.find((p) => p.books.includes(bookId)) ?? null;

/** The book a chapter page belongs to, and whether that page is the book's free-sample chapter. */
export function chapterInfo(href: string) {
  const book = CS_SHELF.find((b) => b.chapters.some((c) => c.href === href)) ?? null;
  const first = book?.chapters.find((c) => c.href)?.href ?? null;
  return { book, pack: book ? packOfBook(book.id) : null, sampleChapter: !!first && first === href };
}

/** A study product as sent to the order API: "pack:os", "bundle:complete" or "custom:os,cn,dbms" (3 or more packs). */
export function productPacks(product: string): { kind: "pack" | "bundle" | "custom"; packs: string[]; name: string } | null {
  const [kind, rest = ""] = product.split(":");
  if (kind === "pack") { const p = PACKS.find((x) => x.id === rest); return p ? { kind, packs: [p.id], name: `${p.name} pack` } : null; }
  if (kind === "bundle") { const b = BUNDLES.find((x) => x.id === rest); return b ? { kind, packs: b.packs, name: b.name } : null; }
  if (kind === "custom") { const ids = [...new Set(rest.split(",").filter((id) => PACKS.some((p) => p.id === id)))]; return ids.length >= 3 ? { kind, packs: ids, name: `Your bundle (${ids.length} packs)` } : null; }
  return null;
}
/** Build-your-own price: the packs' sum less BUILD_YOUR_OWN_OFF %, rounded down to whole rupees. */
export const customPrice = (ids: string[]) => Math.floor((packTotal(ids) * (100 - BUILD_YOUR_OWN_OFF)) / 100 / 100) * 100;
/** Plan id stored on the order (≤ 40 chars). */
export const studyPlanId = (product: string) => (product.startsWith("pack:") ? `study_pack_${product.slice(5)}` : product.startsWith("bundle:") ? `study_bundle_${product.slice(7)}` : "study_custom");
