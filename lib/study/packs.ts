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
  { id: "maths", name: "Linear Algebra, Probability & Calculus", books: ["la", "prob", "calc"], pricePaise: 19900, marks: 7.8 },
  { id: "apt", name: "General Aptitude", books: ["verbal", "quant", "analytical", "spatial"], pricePaise: 14900, marks: 15 },
];

export type Bundle = { id: string; name: string; packs: string[]; pricePaise: number; note: string };
const CORE_PACKS = ["os", "dbms", "cn", "algo", "pds", "toc", "cd", "coa", "dl"] as const;
const MATHS_PACKS = ["dm", "maths"] as const;
export const BUNDLES: Bundle[] = [
  { id: "marks5", name: "Marks Magnet 5", packs: ["os", "toc", "cn", "coa", "algo"], pricePaise: 59900, note: "The five technical subjects with the most marks" },
  { id: "tough4", name: "Toughest 4", packs: ["dm", "algo", "cd", "os"], pricePaise: 47900, note: "The highest share of Hard questions" },
  { id: "systems", name: "Systems Core", packs: ["os", "coa", "cn", "dbms"], pricePaise: 49900, note: "Machines, networks and data" },
  { id: "theory", name: "Theory & Maths", packs: ["toc", "dm", "cd", "maths"], pricePaise: 42900, note: "Automata, logic, compilers and maths" },
  // The three shelves of the library, each as one purchase, then everything at the best rate (owner, 20 Nov 2026).
  { id: "core", name: "Core CS", packs: [...CORE_PACKS], pricePaise: 89900, note: "All nine core subjects" },
  { id: "maths", name: "Engineering Maths", packs: [...MATHS_PACKS], pricePaise: 27900, note: "Discrete maths, linear algebra, probability, calculus" },
  { id: "apt", name: "General Aptitude", packs: ["apt"], pricePaise: 14900, note: "Verbal, quantitative, analytical and spatial" },
  { id: "everything", name: "Everything", packs: PACKS.map((p) => p.id), pricePaise: 109900, note: "Core CS, Maths and Aptitude: the whole library" },
];
/** The library's three shelves. Aptitude is a single pack, so it is its own section purchase. */
export const SECTIONS: { id: "core" | "maths" | "apt"; title: string; blurb: string; buy: string }[] = [
  { id: "core", title: "Core CS", blurb: "Nine subjects, 60+ marks", buy: "bundle:core" },
  { id: "maths", title: "Engineering Maths", blurb: "Four books, about 15 marks", buy: "bundle:maths" },
  { id: "apt", title: "General Aptitude", blurb: "15 marks, in every paper", buy: "pack:apt" },
];
export const BUILD_YOUR_OWN_OFF = 15; // % off any 3 or more packs

export const packTotal = (ids: string[]) => ids.reduce((s, id) => s + (PACKS.find((p) => p.id === id)?.pricePaise ?? 0), 0);
/** What one subject costs inside a bundle, rounded to whole rupees ("₹100 a subject instead of ₹149"). */
export const perPack = (b: Bundle) => Math.round(b.pricePaise / b.packs.length / 100) * 100;
export const bundleSum = (b: Bundle) => packTotal(b.packs);
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

/** Question-bank subject names per book (same names as the PYQ bank), so results and mistakes can point at the right pack. */
export const BANK_SUBJECTS: Record<string, string[]> = {
  os: ["Operating Systems (OS)"], dbms: ["Database Management Systems (DBMS)"], cn: ["Computer Networks (CN)"], algo: ["Algorithms"],
  pds: ["Programming in C", "Data Structures"], toc: ["Theory of Computation (TOC)"], cd: ["Compiler Design"], coa: ["Computer Organization and Architecture (COA)"],
  dl: ["Digital Logic"], dm: ["Discrete Mathematics"], la: ["Linear Algebra"], prob: ["Probability & Statistics"], calc: ["Calculus"],
  verbal: ["Verbal Aptitude"], quant: ["Quantitative Aptitude"], analytical: ["Analytical Aptitude"], spatial: ["Spatial Aptitude"],
};
/** The book a question-bank subject belongs to ("Operating Systems (OS)" -> "os"). */
export function bookOfSubject(subject: string): string | null {
  return Object.keys(BANK_SUBJECTS).find((b) => BANK_SUBJECTS[b].some((s) => s.toLowerCase() === subject.toLowerCase() || subject.toLowerCase().startsWith(s.toLowerCase().replace(/\s*\(.*\)$/, "")))) ?? null;
}
export function packOfSubject(subject: string): Pack | null {
  const book = bookOfSubject(subject);
  return book ? packOfBook(book) : null;
}
/** The cheapest curated bundle that contains every given pack (doc 13 moment 3: "both together are ₹298, or Toughest 4 for ₹479"). */
export function bestBundleFor(packIds: string[]): Bundle | null {
  return BUNDLES.filter((b) => b.packs.length > packIds.length && packIds.every((id) => b.packs.includes(id))).sort((x, y) => x.pricePaise - y.pricePaise)[0] ?? null;
}
