"use client";

import { create } from "zustand";
import { branchOfQuestionId } from "@/lib/branches";
import { getCurrentBranch } from "@/lib/branch/current";

/**
 * 4I Cloud Sync. IndexedDB stays the source the app reads (so everything works offline);
 * this engine mirrors bookmarks, mistakes and finished tests to `user_records` and pulls
 * other devices' changes.
 *
 * - Local writes are queued (localStorage, per account — survives reloads/offline) and
 *   upserted in small batches with backoff.
 * - Pulls fetch rows changed since the last pull (server clock) and merge:
 *     bookmark → newest edit wins; mistake → counts never go down, "mastered" sticks,
 *     newest wins for the rest; session (finished test) → never overwritten once present.
 *   Tombstones delete locally.
 */
export type SyncKind = "bookmark" | "mistake" | "session";
type QueueItem = { kind: SyncKind; key: string; data: unknown | null; deleted: boolean; at: string; ref?: boolean };
export type SyncState = "off" | "idle" | "pending" | "syncing" | "synced" | "offline" | "failed";

export const useSyncStatus = create<{ state: SyncState; pending: number; lastSynced: string | null; error: string | null }>(() => ({
  state: "off", pending: 0, lastSynced: null, error: null,
}));

let userId: string | null = null;
let applying = false; // true while merging pulled rows → don't echo them back
let flushTimer: ReturnType<typeof setTimeout> | undefined;
let pullTimer: ReturnType<typeof setInterval> | undefined;
let backoff = 2000;
let running: Promise<void> | null = null;

// Multi-branch: each branch has its own local database, so the upload queue and the pull
// cursor are per branch too (CSE keeps the original keys, so nothing pending is lost).
const brSuffix = () => { const b = getCurrentBranch(); return b === "CSE" ? "" : `__br_${b}`; };
const qKey = () => `renyxera_sync_queue__${userId}${brSuffix()}`;
const pullKey = () => `renyxera_sync_pulled__${userId}${brSuffix()}`;

/** Which branch a synced record belongs to: bookmarks/mistakes by their question id; a
 *  finished test by the questions inside it. Unknown -> CSE (everything before Release 8). */
function rowBranch(kind: SyncKind, key: string, data: any): string {
  if (kind !== "session") return branchOfQuestionId(key) ?? "CSE";
  const ids: string[] = [...Object.keys(data?.responses ?? {}), ...(data?.draftConfig?.questionIds ?? [])];
  for (const id of ids) { const b = branchOfQuestionId(String(id)); if (b) return b; }
  return "CSE";
}
const seedKey = () => `renyxera_sync_seeded__${userId}`;
const readQ = (): Record<string, QueueItem> => { try { return JSON.parse(localStorage.getItem(qKey()) ?? "{}"); } catch { return {}; } };
const writeQ = (q: Record<string, QueueItem>) => { try { localStorage.setItem(qKey(), JSON.stringify(q)); } catch { /* full/blocked */ } useSyncStatus.setState({ pending: Object.keys(q).length }); };

/** Called by IDBManager after every local write it makes. */
export function recordLocalChange(kind: SyncKind, key: string, data: unknown | null) {
  if (!userId || applying) return;
  if (kind === "session") {
    const s = (data as { sessionData?: { status?: string } } | null)?.sessionData;
    if (key === "active_session" || (data && s?.status !== "SUBMITTED")) return; // only finished tests
  }
  const q = readQ();
  // Finished tests are big: queue a reference and read them from IndexedDB at upload time
  // (localStorage only holds a few MB).
  const ref = kind === "session" && data !== null;
  q[`${kind}:${key}`] = { kind, key, data: ref ? null : data, deleted: data === null, at: new Date().toISOString(), ref };
  writeQ(q);
  useSyncStatus.setState({ state: "pending" });
  scheduleFlush(1500);
}

function scheduleFlush(ms: number) {
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => { void syncNow(); }, ms);
}

async function client() {
  const { createClient } = await import("@/lib/supabase/client");
  return createClient();
}

async function flush() {
  const q = readQ();
  const items = Object.values(q);
  if (!items.length) return;
  const sb = await client();
  const { IDBManager } = await import("@/lib/repository/storage/idb-manager");
  for (let i = 0; i < items.length; i += 50) {
    const batch = items.slice(i, i + 50);
    const rows = [];
    for (const it of batch) {
      const data = it.deleted ? null : it.ref ? (await IDBManager.loadExamSession(it.key)) ?? null : it.data;
      if (!it.deleted && data === null) continue; // gone locally since queued
      rows.push({ user_id: userId, kind: it.kind, key: it.key, data, deleted: it.deleted, client_updated_at: it.at });
    }
    const { error } = rows.length ? await sb.from("user_records").upsert(rows, { onConflict: "user_id,kind,key" }) : { error: null };
    if (error) throw error;
    const now = readQ();
    for (const it of batch) { const k = `${it.kind}:${it.key}`; if (now[k]?.at === it.at) delete now[k]; }
    writeQ(now);
  }
}

async function pull() {
  const sb = await client();
  const { IDBManager } = await import("@/lib/repository/storage/idb-manager");
  let since = localStorage.getItem(pullKey()) ?? "1970-01-01T00:00:00Z";
  for (let page = 0; page < 20; page++) {
    const { data, error } = await sb.from("user_records").select("kind,key,data,deleted,client_updated_at,updated_at")
      .gt("updated_at", since).order("updated_at", { ascending: true }).limit(200);
    if (error) throw error;
    if (!data?.length) break;
    const pending = readQ();
    applying = true;
    try {
      for (const row of data as { kind: SyncKind; key: string; data: any; deleted: boolean; client_updated_at: string; updated_at: string }[]) {
        if (!row.deleted && rowBranch(row.kind, row.key, row.data) !== getCurrentBranch()) continue; // another branch's record
        const mine = pending[`${row.kind}:${row.key}`];
        if (mine && mine.at > row.client_updated_at) continue; // my newer local edit wins; it'll upload
        if (row.kind === "bookmark") {
          if (row.deleted) await IDBManager.removeBookmark(row.key); else await IDBManager.saveBookmark(row.data);
        } else if (row.kind === "mistake") {
          if (row.deleted) { await IDBManager.removeMistake(row.key); continue; }
          const local = (await IDBManager.getAllMistakes()).find((m) => m.questionId === row.key);
          await IDBManager.saveMistake(local ? {
            ...local, ...row.data,
            occurrences: Math.max(local.occurrences ?? 0, row.data.occurrences ?? 0),
            solvedCount: Math.max(local.solvedCount ?? 0, row.data.solvedCount ?? 0),
            reviewCount: Math.max(local.reviewCount ?? 0, row.data.reviewCount ?? 0),
            mastered: !!(local.mastered || row.data.mastered),
          } : row.data);
        } else if (row.kind === "session") {
          if (row.deleted) { await IDBManager.deleteExamSession(row.key); continue; }
          if (!(await IDBManager.loadExamSession(row.key))) await IDBManager.saveExamSession(row.data);
        }
      }
    } finally {
      applying = false;
    }
    since = (data[data.length - 1] as { updated_at: string }).updated_at;
    localStorage.setItem(pullKey(), since);
    if (data.length < 200) break;
  }
}

/** Upload queued changes, then pull everyone else's. Safe to call any time ("Sync now"). */
export function syncNow(): Promise<void> {
  if (!userId) return Promise.resolve();
  if (running) return running;
  running = (async () => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) { useSyncStatus.setState({ state: "offline" }); return; }
    useSyncStatus.setState({ state: "syncing", error: null });
    try {
      await flush();
      await pull();
      backoff = 2000;
      useSyncStatus.setState({ state: Object.keys(readQ()).length ? "pending" : "synced", lastSynced: new Date().toISOString() });
      window.dispatchEvent(new Event("renyxera:synced"));
    } catch (e) {
      useSyncStatus.setState({ state: "failed", error: (e as Error)?.message?.slice(0, 120) ?? "Sync failed" });
      backoff = Math.min(backoff * 2, 5 * 60_000);
      scheduleFlush(backoff);
    }
  })().finally(() => { running = null; });
  return running;
}

/** First sync on this device for this account uploads what's already stored locally. */
async function seedExisting() {
  if (localStorage.getItem(seedKey())) return;
  const { IDBManager } = await import("@/lib/repository/storage/idb-manager");
  const [bm, mi, ss] = await Promise.all([IDBManager.getAllBookmarks(), IDBManager.getAllMistakes(), IDBManager.getAllExamSessions()]);
  for (const b of bm) recordLocalChange("bookmark", b.questionId, b);
  for (const m of mi) recordLocalChange("mistake", m.questionId, m);
  for (const s of ss) recordLocalChange("session", s.id, s);
  localStorage.setItem(seedKey(), new Date().toISOString());
}

export async function startSync(uid: string) {
  if (userId === uid) return;
  stopSync();
  userId = uid;
  const { IDBManager } = await import("@/lib/repository/storage/idb-manager");
  IDBManager.onChange = recordLocalChange;
  useSyncStatus.setState({ state: "idle", pending: Object.keys(readQ()).length, lastSynced: null, error: null });
  try { await seedExisting(); } catch { /* next start retries */ }
  void syncNow();
  pullTimer = setInterval(() => { if (!document.hidden) void syncNow(); }, 5 * 60_000);
  window.addEventListener("online", onOnline);
  document.addEventListener("visibilitychange", onVisible);
}

export function stopSync() {
  clearTimeout(flushTimer); clearInterval(pullTimer);
  window.removeEventListener("online", onOnline);
  document.removeEventListener("visibilitychange", onVisible);
  userId = null;
  void import("@/lib/repository/storage/idb-manager").then(({ IDBManager }) => { IDBManager.onChange = null; });
  useSyncStatus.setState({ state: "off", pending: 0 });
}

const onOnline = () => void syncNow();
const onVisible = () => { if (!document.hidden) void syncNow(); };
