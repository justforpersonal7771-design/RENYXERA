import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { STORE_ANALYTICS_SNAPSHOTS, STORE_EXAM_SESSIONS, STORE_MISTAKES, STORE_STUDY_METRICS } from "@/lib/repository/storage/cache-constants";

/**
 * Clears what the student has played, on this device and (when signed in) in their account: finished tests and practice,
 * the Mistakes Bank, analytics built from them, and flashcard progress. Keeps bookmarks, settings, downloads, chats and the plan.
 * Server first, so a later sync can't bring the records back.
 */
export async function clearPracticeHistory(signedIn: boolean): Promise<void> {
  if (signedIn) {
    const r = await fetch("/api/account/clear-practice", { method: "POST" });
    if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Couldn't clear your history right now.");
  }
  const db = await IDBManager.initializeDatabase();
  for (const s of [STORE_EXAM_SESSIONS, STORE_MISTAKES, STORE_ANALYTICS_SNAPSHOTS, STORE_STUDY_METRICS] as const) {
    try { await db.clear(s); } catch { /* store missing on an old device */ }
  }
  try {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith("renyxera_sync_queue__")) {
        // drop queued uploads of the cleared kinds; keep queued bookmark/chat changes
        const q = JSON.parse(localStorage.getItem(k) ?? "{}") as Record<string, { kind: string }>;
        for (const id of Object.keys(q)) if (q[id].kind === "session" || q[id].kind === "mistake") delete q[id];
        localStorage.setItem(k, JSON.stringify(q));
      }
    }
    for (const k of ["renyxera_flash_sr", "renyxera_seen_results_at", "renyxera_seen_achievements"]) localStorage.removeItem(k);
  } catch { /* storage blocked */ }
}
