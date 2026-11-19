/**
 * The CS question bank (public/data/questions.json, ~840 KB) loaded once per session and shared by the library and every
 * lesson (speed pass, 19 Nov: it used to be fetched and parsed again on each lesson page). Parsing waits for an idle moment
 * so it never blocks a tab switch or a book opening.
 */
export type BankPaper = { exam_metadata: { "year-shift": string }; questions: { question_id: string; subject: string; topic?: string; marks: number; [k: string]: unknown }[] };

let cache: Promise<BankPaper[]> | null = null;
const idle = () => new Promise<void>((res) => { const ric = (globalThis as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback; if (ric) ric(() => res(), { timeout: 1500 }); else setTimeout(res, 0); });

export function loadBank(): Promise<BankPaper[]> {
  cache ??= fetch("/data/questions.json").then((r) => r.text()).then(async (t) => { await idle(); return JSON.parse(t) as BankPaper[]; }).catch((e) => { cache = null; throw e; });
  return cache;
}

/** Memoise any derived value of the bank, once per session. */
const derived = new Map<string, Promise<unknown>>();
export function fromBank<T>(key: string, fn: (papers: BankPaper[]) => T): Promise<T> {
  if (!derived.has(key)) derived.set(key, loadBank().then(async (p) => { await idle(); return fn(p); }));
  return derived.get(key) as Promise<T>;
}
