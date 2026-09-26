/**
 * Step 6b — protected offline Downloads.
 *
 * Packs are never files. Each pack (a paper or a subject: question ids + their answer
 * keys) is encrypted with AES-GCM and stored in a per-account IndexedDB database
 * ("RenyxeraVault__<userId>"). The key comes from /api/vault/key and is stored as a
 * NON-extractable CryptoKey — script on this origin can decrypt with it, but nothing can
 * read or export the key bytes. It expires after 14 days offline and is renewed online.
 * Signing out deletes the whole vault for that account.
 *
 * Honest limit: a page can't stop screenshots or a camera. This makes bulk export hard
 * (no file, encrypted at rest, rate-limited fetches) and leaks traceable (the viewer
 * watermarks every page with the account's email and id).
 */
import { openDB, deleteDB, type IDBPDatabase } from "idb";
import type { AnswerKey } from "@/lib/repository/answer-keys";

const DB_PREFIX = "RenyxeraVault__";
const STORE = "packs";
const KEY_ID = "__key";

export interface PackMeta {
  id: string;
  title: string;
  kind: "paper" | "subject";
  questionCount: number;
  bytes: number;
  savedAt: string;
}
export interface PackContent {
  id: string;
  title: string;
  questionIds: string[];
  answers: Record<string, AnswerKey>;
}

interface PackRecord extends PackMeta { iv: Uint8Array<ArrayBuffer>; data: ArrayBuffer }
interface KeyRecord { id: typeof KEY_ID; key: CryptoKey; expiresAt: number }

const dbs = new Map<string, Promise<IDBPDatabase>>();
function db(userId: string) {
  if (!dbs.has(userId)) {
    dbs.set(userId, openDB(DB_PREFIX + userId, 1, {
      upgrade(d) { d.createObjectStore(STORE, { keyPath: "id" }); },
    }));
  }
  return dbs.get(userId)!;
}

export type KeyState = { key: CryptoKey; expiresAt: number } | { error: "offline-expired" | "offline-none" | "unauthorized" | "failed" };

/** Returns a usable key: renews online when possible, else uses the stored one if fresh. */
export async function getVaultKey(userId: string): Promise<KeyState> {
  const d = await db(userId);
  const stored = (await d.get(STORE, KEY_ID)) as KeyRecord | undefined;
  const online = typeof navigator === "undefined" || navigator.onLine !== false;
  if (online) {
    try {
      const res = await fetch("/api/vault/key", { method: "POST" });
      if (res.status === 401) return { error: "unauthorized" };
      if (res.ok) {
        const j = (await res.json()) as { key: string; userId: string; expiresAt: number };
        if (j.userId !== userId) return { error: "unauthorized" };
        const raw = Uint8Array.from(atob(j.key), (c) => c.charCodeAt(0));
        const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
        raw.fill(0);
        await d.put(STORE, { id: KEY_ID, key, expiresAt: j.expiresAt } satisfies KeyRecord);
        return { key, expiresAt: j.expiresAt };
      }
    } catch {
      // fall through to the stored key
    }
  }
  if (!stored) return { error: online ? "failed" : "offline-none" };
  if (stored.expiresAt < Date.now()) return { error: "offline-expired" };
  return { key: stored.key, expiresAt: stored.expiresAt };
}

export async function listPacks(userId: string): Promise<PackMeta[]> {
  const d = await db(userId);
  const all = (await d.getAll(STORE)) as (PackRecord | KeyRecord)[];
  return all
    .filter((r): r is PackRecord => r.id !== KEY_ID)
    .map(({ iv: _iv, data: _data, ...meta }) => meta)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function savePack(userId: string, key: CryptoKey, meta: Omit<PackMeta, "bytes" | "savedAt">, content: PackContent) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = new TextEncoder().encode(JSON.stringify(content));
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain);
  const record: PackRecord = { ...meta, bytes: data.byteLength, savedAt: new Date().toISOString(), iv, data };
  await (await db(userId)).put(STORE, record);
  return record;
}

export async function openPack(userId: string, key: CryptoKey, id: string): Promise<PackContent | null> {
  const rec = (await (await db(userId)).get(STORE, id)) as PackRecord | undefined;
  if (!rec || rec.id === KEY_ID) return null;
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: rec.iv }, key, rec.data);
    return JSON.parse(new TextDecoder().decode(plain)) as PackContent;
  } catch {
    return null; // tampered or wrong account — treat as missing
  }
}

export async function removePack(userId: string, id: string) {
  if (id === KEY_ID) return;
  await (await db(userId)).delete(STORE, id);
}

/** Deletes every pack and the key for this account on this device. */
export async function wipeVault(userId: string) {
  const p = dbs.get(userId);
  dbs.delete(userId);
  if (p) (await p.catch(() => null))?.close();
  await deleteDB(DB_PREFIX + userId).catch(() => {});
}
