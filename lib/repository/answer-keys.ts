/**
 * Step 6 (5A): the public question bank carries no answers. Answer keys are unlocked
 * from /api/answers — for a whole test when it's submitted, or per question when a
 * practice screen checks an answer — and then:
 *   1. merged into the in-memory questions (option.is_correct / nat_answer_range), so
 *      every existing screen and engine keeps working unchanged, and
 *   2. cached in IndexedDB, so history, analytics and review keep working offline.
 *
 * Nothing here throws: on failure (offline, rate-limited) callers get `false` and show a
 * "connect to see answers" state instead of a blank or wrong screen.
 */
import { create } from "zustand";
import { IDBManager } from "./storage/idb-manager";

export interface AnswerKey {
  /** Correct option ids (MCQ/MSQ). */
  c: string[];
  /** Accepted NAT ranges, [[min, max], ...]. */
  n: [number, number][] | null;
}

const IDB_KEY = "answer_keys_v1";
const CHUNK = 100;

const keys = new Map<string, AnswerKey>();
/** Ids the server doesn't know (e.g. AI-generated questions) — never re-requested. */
const unknown = new Set<string>();
let hydrated: Promise<void> | null = null;

/** Bumped whenever new answers are applied, so memoised screens recompute. */
export const useAnswerKeysVersion = create<{ version: number }>(() => ({ version: 0 }));
const bump = () => useAnswerKeysVersion.setState((s) => ({ version: s.version + 1 }));

type MutableQuestion = {
  question_id: string;
  question_type: string;
  options?: { option_id: string; is_correct?: boolean }[];
  nat_answer_range?: { min: number; max: number; ranges?: { min: number; max: number }[] };
};

let lookup: ((id: string) => MutableQuestion | undefined) | null = null;

/** Called by the repository once questions are indexed. */
export function attachRepository(get: (id: string) => MutableQuestion | undefined) {
  lookup = get;
  for (const id of keys.keys()) applyOne(id);
}

function applyOne(id: string) {
  const q = lookup?.(id);
  const k = keys.get(id);
  if (!q || !k) return;
  if (q.question_type === "NAT") {
    if (k.n?.length) {
      const ranges = k.n.map(([min, max]) => ({ min, max }));
      q.nat_answer_range = { min: ranges[0].min, max: ranges[0].max, ranges };
    }
  } else {
    for (const o of q.options ?? []) o.is_correct = k.c.includes(o.option_id);
  }
}

async function persist() {
  const obj: Record<string, AnswerKey> = {};
  keys.forEach((v, k) => (obj[k] = v));
  await IDBManager.setMetadata(IDB_KEY, JSON.stringify(obj));
}

/** Loads cached keys from IndexedDB (once per app load / account namespace). */
export function hydrateAnswerKeys(force = false): Promise<void> {
  if (hydrated && !force) return hydrated;
  hydrated = (async () => {
    try {
      const rec = await IDBManager.getMetadata(IDB_KEY);
      if (rec && typeof rec.value === "string") {
        const obj = JSON.parse(rec.value) as Record<string, AnswerKey>;
        for (const [id, k] of Object.entries(obj)) {
          if (k && Array.isArray(k.c)) keys.set(id, k);
        }
        for (const id of keys.keys()) applyOne(id);
        bump();
      }
    } catch {
      // Corrupt cache: ignore — answers are simply re-fetched when needed.
    }
  })();
  return hydrated;
}

/** True when the question's answer is known locally (or it needs no server key). */
export function hasAnswer(id: string, q?: MutableQuestion): boolean {
  if (keys.has(id) || unknown.has(id)) return true;
  const question = q ?? lookup?.(id);
  // AI-generated / dynamic questions carry their own answers.
  if (question && !/^GATE_/.test(question.question_id)) return true;
  return false;
}

/**
 * Makes sure answers for these ids are available. Returns true when every requested
 * answer is now known, false if any couldn't be fetched (offline / error).
 */
export async function ensureAnswers(ids: Iterable<string>, opts: { timeoutMs?: number } = {}): Promise<boolean> {
  await hydrateAnswerKeys();
  const missing = [...new Set(ids)].filter((id) => id && !hasAnswer(id));
  if (!missing.length) return true;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;

  let ok = true;
  for (let i = 0; i < missing.length; i += CHUNK) {
    const batch = missing.slice(i, i + CHUNK);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 12_000);
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question_ids: batch }),
        signal: ctrl.signal,
      }).finally(() => clearTimeout(timer));
      if (!res.ok) { ok = false; continue; }
      const data = (await res.json()) as { answers?: Record<string, AnswerKey> };
      const got = data.answers ?? {};
      for (const id of batch) {
        const k = got[id];
        if (k && Array.isArray(k.c)) { keys.set(id, k); applyOne(id); }
        else unknown.add(id);
      }
    } catch {
      ok = false;
    }
  }
  bump();
  void persist();
  return ok;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type SubmittableSession = {
  id: string;
  startedAt?: string;
  elapsedSeconds?: number;
  draftConfig?: { config?: { examType?: string; yearShift?: string } };
  responses: Record<string, { questionId: string; status: string; selectedOptions?: string[]; natValue?: string; timeSpentSeconds?: number }>;
};

/**
 * Sends a submitted test to the server grader, which scores it, stores it for signed-in
 * users, and returns this test's answer keys (merged + cached here). Returns null when
 * grading isn't possible right now (offline / error) — the caller still saves the test.
 */
const inflightGrading = new Map<string, Promise<{ score: number; maxScore: number; stored: boolean } | null>>();

/** One grading request per test at a time — later callers share the in-flight result. */
export function submitForGrading(
  session: SubmittableSession,
  opts: { timeoutMs?: number } = {}
): Promise<{ score: number; maxScore: number; stored: boolean } | null> {
  const running = inflightGrading.get(session.id);
  if (running) return running;
  const p = gradeNow(session, opts).finally(() => inflightGrading.delete(session.id));
  inflightGrading.set(session.id, p);
  return p;
}

async function gradeNow(
  session: SubmittableSession,
  opts: { timeoutMs?: number } = {}
): Promise<{ score: number; maxScore: number; stored: boolean } | null> {
  await hydrateAnswerKeys();
  const { parseNatValue } = await import("@/lib/grading");
  const responses = Object.values(session.responses ?? {})
    .filter((r) => /^GATE_/.test(r.questionId))
    .map((r) => {
      const answered = r.status === "ANSWERED" || r.status === "MARKED_AND_ANSWERED";
      const nat = answered ? parseNatValue(r.natValue) : null;
      return {
        question_id: r.questionId,
        selected_option_ids: answered && r.selectedOptions?.length ? [...new Set(r.selectedOptions)].slice(0, 10) : undefined,
        nat_value: nat ?? undefined,
        time_spent_seconds: Math.max(0, Math.min(86_400, Math.round(r.timeSpentSeconds ?? 0))),
        marked_for_review: r.status === "MARKED" || r.status === "MARKED_AND_ANSWERED",
      };
    });
  if (!responses.length) return null; // e.g. an all-AI-generated test: answers are local
  if (typeof navigator !== "undefined" && navigator.onLine === false) return null;

  const cfg = session.draftConfig?.config;
  const graded = cfg?.examType === "GRAND_MOCK" || cfg?.examType === "YEAR_PAPER";
  const results: { score: number; maxScore: number; stored: boolean } = { score: 0, maxScore: 0, stored: false };
  // The server takes up to 200 responses per call; longer custom tests are sent in parts
  // (only the first part carries the attempt, so it is stored once).
  for (let i = 0; i < responses.length; i += 200) {
    const part = responses.slice(i, i + 200);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 15_000);
    try {
      const res = await fetch("/api/exam/grade", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          attempt: i === 0 && UUID_RE.test(session.id)
            ? {
                id: session.id,
                started_at: session.startedAt,
                duration_seconds: Math.max(0, Math.min(86_400, Math.round(session.elapsedSeconds ?? 0))),
                mode: graded ? "graded" : "practice",
                title: [cfg?.examType, cfg?.yearShift].filter(Boolean).join(" ").slice(0, 200) || undefined,
              }
            : undefined,
          responses: part,
        }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { score: number; max_score: number; stored?: boolean; answers?: Record<string, AnswerKey> };
      for (const [id, k] of Object.entries(data.answers ?? {})) {
        if (k && Array.isArray(k.c)) { keys.set(id, k); applyOne(id); }
      }
      for (const r of part) if (!keys.has(r.question_id)) unknown.add(r.question_id);
      results.score += data.score;
      results.maxScore += data.max_score;
      if (i === 0) results.stored = !!data.stored;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
      bump();
      void persist();
    }
  }
  // Server rounds per call; keep two decimals overall.
  results.score = Math.round(results.score * 100) / 100;
  return results;
}

/**
 * One-time catch-up for history saved before answers were withheld (or submitted
 * offline): unlocks keys for every question in past tests, mistakes and bookmarks.
 * Returns true if any new key was applied (callers then refresh analytics).
 */
export async function syncHistoryAnswers(): Promise<boolean> {
  try {
    await hydrateAnswerKeys();
    const ids = new Set<string>();
    for (const rec of await IDBManager.getAllExamSessions()) {
      const s = rec.sessionData as { status?: string; responses?: Record<string, { questionId?: string }> } | null;
      if (s?.status !== "SUBMITTED") continue;
      for (const r of Object.values(s.responses ?? {})) if (r?.questionId) ids.add(r.questionId);
    }
    for (const m of await IDBManager.getAllMistakes()) ids.add(m.questionId);
    for (const b of await IDBManager.getAllBookmarks()) ids.add(b.questionId);
    const missing = [...ids].filter((id) => !hasAnswer(id));
    if (!missing.length) return false;
    const before = keys.size;
    await ensureAnswers(missing);
    return keys.size > before;
  } catch {
    return false;
  }
}

/** For sign-out / account switch: the next namespace re-hydrates its own cache. */
export function resetAnswerKeysHydration() {
  hydrated = null;
}
