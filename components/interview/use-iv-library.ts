"use client";

import { useCallback, useEffect, useState } from "react";
import type { IvDoc } from "./interview-gate";

/** The whole library (titles only) plus your reading progress, loaded once and shared by every Interview page. */
export type IvProgress = { doc_id: string; status: "reading" | "done"; updated_at: string };
type Lib = { docs: IvDoc[]; progress: IvProgress[] };
let cache: Lib | null = null;
let inflight: Promise<Lib | null> | null = null;
const listeners = new Set<(l: Lib) => void>();

const load = (force = false) => {
  if (cache && !force) return Promise.resolve(cache);
  inflight ??= fetch("/api/interview/docs", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: Lib | null) => { inflight = null; if (d) { cache = d; listeners.forEach((f) => f(d)); } return d; }).catch(() => { inflight = null; return null; });
  return inflight;
};

export function useIvLibrary() {
  const [lib, setLib] = useState<Lib | null>(cache);
  useEffect(() => { listeners.add(setLib); void load(); return () => { listeners.delete(setLib); }; }, []);
  const refresh = useCallback(() => load(true), []);
  /** Marks a document locally at once (so bars move immediately), then the server copy is already saved by the caller. */
  const mark = useCallback((id: string, status: "reading" | "done") => {
    if (!cache) return;
    const rest = cache.progress.filter((p) => p.doc_id !== id);
    cache = { ...cache, progress: [...rest, { doc_id: id, status, updated_at: new Date().toISOString() }] };
    listeners.forEach((f) => f(cache!));
  }, []);
  const done = new Set((lib?.progress ?? []).filter((p) => p.status === "done").map((p) => p.doc_id));
  return { ready: !!lib, docs: (lib?.docs ?? []).filter((d) => d.kind !== "lab"), labs: (lib?.docs ?? []).filter((d) => d.kind === "lab"), progress: lib?.progress ?? [], done, refresh, mark };
}
