"use client";

import { useEffect, useState } from "react";

/** A challenge a friend sent me that I have not finished. `playNow`: they want to play right now. `scheduledAt`: they set a time. */
export type Incoming = { id: string; title: string; from: string; at: string | null; playNow: boolean; scheduledAt: string | null; questions: number };

type Listener = (v: Incoming[]) => void;
let current: Incoming[] = [];
const listeners = new Set<Listener>();
let timer: ReturnType<typeof setInterval> | null = null;

async function poll() {
  if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
  try {
    const r = await fetch("/api/battles");
    if (!r.ok) return;
    const j = (await r.json()) as { battles: { id: string; title: string; ownerName: string; questions: number; invited: boolean; expired: boolean; invite?: { at: string | null; playNow: boolean; scheduledAt: string | null } | null; entries: { you: boolean; status: string }[] }[] };
    current = j.battles
      .filter((b) => b.invited && !b.expired && !b.entries.some((e) => e.you && e.status === "submitted"))
      .map((b) => ({ id: b.id, title: b.title, from: b.ownerName, at: b.invite?.at ?? null, playNow: !!b.invite?.playNow, scheduledAt: b.invite?.scheduledAt ?? null, questions: b.questions }));
    listeners.forEach((l) => l(current));
  } catch { /* offline: keep the last list */ }
}

/** Challenges waiting for me, shared by the navbar badge, the dashboard banner and the live prompt (one poll every 20 s for all of them). Empty when signed out. */
export function useIncomingChallenges(signedIn: boolean): Incoming[] {
  const [list, setList] = useState<Incoming[]>(current);
  useEffect(() => {
    if (!signedIn) return;
    listeners.add(setList);
    void poll();
    timer ??= setInterval(poll, 20_000);
    return () => {
      listeners.delete(setList);
      if (listeners.size === 0 && timer) { clearInterval(timer); timer = null; }
    };
  }, [signedIn]);
  return signedIn ? list : [];
}

export function usePendingChallenges(signedIn: boolean): number {
  return useIncomingChallenges(signedIn).length;
}
