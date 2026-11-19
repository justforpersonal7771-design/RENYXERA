"use client";

/** Client view of study access. Free, Plus and Pro read the sample topics; bought packs (and admins) open the rest.
 * Display only: the content gate is presentation-level until lessons move behind a server check. */
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { FREE_TOPICS, chapterInfo } from "@/lib/study/packs";

type Access = { all: boolean; packs: string[]; loading: boolean };
const cache = new Map<string, Access>();
const NONE: Access = { all: false, packs: [], loading: false };

export function useStudyAccess() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const key = userId ?? "guest";
  const [got, setGot] = useState<{ key: string; v: Access } | null>(null);
  useEffect(() => {
    if (!userId || cache.has(key)) return;
    let live = true;
    fetch("/api/study/access").then((r) => (r.ok ? r.json() : null)).then((j) => {
      const v: Access = { all: !!j?.all, packs: Array.isArray(j?.packs) ? j.packs : [], loading: false };
      cache.set(key, v); if (live) setGot({ key, v });
    }).catch(() => { if (live) setGot({ key, v: NONE }); });
    return () => { live = false; };
  }, [key, userId]);
  const a: Access = !userId ? NONE : cache.get(key) ?? (got?.key === key ? got.v : { ...NONE, loading: true });
  const canRead = (href: string, topicIndex: number) => {
    if (a.all) return true;
    const info = chapterInfo(href);
    if (info.pack && a.packs.includes(info.pack.id)) return true;
    return info.sampleChapter && topicIndex < FREE_TOPICS;
  };
  return { ...a, canRead, refresh: () => { cache.delete(key); setGot(null); } };
}
