"use client";

import { create } from "zustand";
import { useAuthStore } from "@/store/use-auth-store";

/**
 * A small synced collection: documents live on this device (localStorage) so every screen works instantly and offline of the server, and are mirrored to the
 * account through /api/desk/<coll> when the student is signed in and migration 0066 exists. Newest `updatedAt` wins per document. Used for Notes, Revision and Tutor queues,
 * so the same data is read by Review, the Tutor, Study, the Mentor and the Planner.
 */
export type Doc = { id: string; updatedAt: string };
type State<T extends Doc> = {
  items: T[]; loaded: boolean; remote: "unknown" | "on" | "off";
  load: () => Promise<void>;
  upsert: (item: T) => void;
  upsertMany: (items: T[]) => void;
  remove: (id: string) => void;
};

const keyOf = (coll: string) => { let uid = "anon"; try { uid = useAuthStore.getState().user?.id ?? "anon"; } catch { /* default */ } return `desk:${coll}:${uid}`; };

export function createDeskStore<T extends Doc>(coll: "notes" | "revision" | "queues") {
  let pending: Record<string, T> = {}; let timer: ReturnType<typeof setTimeout> | null = null;
  const readLocal = (): T[] => { try { return JSON.parse(localStorage.getItem(keyOf(coll)) || "[]") as T[]; } catch { return []; } };
  const writeLocal = (items: T[]) => { try { localStorage.setItem(keyOf(coll), JSON.stringify(items)); } catch { /* storage full or blocked */ } };

  return create<State<T>>((set, get) => {
    const flush = async () => {
      timer = null; const batch = Object.values(pending); pending = {};
      if (!batch.length || get().remote === "off" || !useAuthStore.getState().user) return;
      try {
        const r = await fetch(`/api/desk/${coll}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: batch.map((i) => ({ id: i.id, data: i, updated_at: i.updatedAt })) }) });
        if (r.status === 503) set({ remote: "off" }); else if (r.ok) set({ remote: "on" });
      } catch { /* offline: the next change retries */ }
    };
    const queue = (items: T[]) => { items.forEach((i) => { pending[i.id] = i; }); if (timer) clearTimeout(timer); timer = setTimeout(() => void flush(), 800); };
    const commit = (next: T[]) => { writeLocal(next); set({ items: next }); };
    return {
      items: [], loaded: false, remote: "unknown",
      load: async () => {
        const local = readLocal(); set({ items: local, loaded: true });
        if (!useAuthStore.getState().user) return;
        try {
          const r = await fetch(`/api/desk/${coll}`, { cache: "no-store" });
          if (r.status === 503) { set({ remote: "off" }); return; }
          if (!r.ok) return;
          const { items } = (await r.json()) as { items: { id: string; data: T; updated_at: string }[] };
          const map = new Map<string, T>(local.map((i) => [i.id, i]));
          const push: T[] = [];
          for (const row of items) { const mine = map.get(row.id); const theirs = { ...row.data, id: row.id, updatedAt: row.updated_at } as T; if (!mine || mine.updatedAt < theirs.updatedAt) map.set(row.id, theirs); else if (mine.updatedAt > theirs.updatedAt) push.push(mine); }
          const remoteIds = new Set(items.map((i) => i.id)); local.forEach((i) => { if (!remoteIds.has(i.id)) push.push(i); });
          commit([...map.values()]); set({ remote: "on" }); if (push.length) queue(push);
        } catch { /* keep the local copy */ }
      },
      upsert: (item) => { const next = [...get().items.filter((i) => i.id !== item.id), item]; commit(next); queue([item]); },
      upsertMany: (items) => { if (!items.length) return; const ids = new Set(items.map((i) => i.id)); commit([...get().items.filter((i) => !ids.has(i.id)), ...items]); queue(items); },
      remove: (id) => {
        commit(get().items.filter((i) => i.id !== id)); delete pending[id];
        if (get().remote !== "off" && useAuthStore.getState().user) void fetch(`/api/desk/${coll}?ids=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => null);
      },
    };
  });
}
