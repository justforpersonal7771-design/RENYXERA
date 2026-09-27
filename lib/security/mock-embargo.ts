import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Answers of a running All-India mock stay secret until its results time — otherwise the
 * first person to submit (or anyone "practising" the same past-paper questions) could
 * read the key while others are still writing. Returns the embargoed question ids and the
 * latest results time among running mocks. Cached briefly per Worker isolate.
 */
let cache: { at: number; ids: Set<string>; resultsAt: Map<string, string> } | null = null;

export async function mockEmbargo(db: SupabaseClient): Promise<{ ids: Set<string>; resultsAt: Map<string, string> }> {
  if (cache && Date.now() - cache.at < 30_000) return cache;
  const now = new Date().toISOString();
  const { data, error } = await db
    .from("mock_events")
    .select("question_ids, results_at")
    .lte("starts_at", now)
    .gt("results_at", now);
  if (error) throw error;
  const ids = new Set<string>();
  const resultsAt = new Map<string, string>();
  for (const m of data ?? []) {
    for (const id of m.question_ids as string[]) {
      ids.add(id);
      const prev = resultsAt.get(id);
      if (!prev || prev < m.results_at) resultsAt.set(id, m.results_at);
    }
  }
  cache = { at: Date.now(), ids, resultsAt };
  return cache;
}
