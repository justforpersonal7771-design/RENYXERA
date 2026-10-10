"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";

export type TelegramState = { ready: boolean; linked: boolean; inChannel: boolean | null; inGroup: boolean | null };
const NONE: TelegramState = { ready: false, linked: false, inChannel: null, inGroup: null };
export const TELEGRAM_CHANGED = "renyxera:telegram-changed";

let cache: TelegramState | null = null;
let inflight: Promise<TelegramState> | null = null;

async function fetchState(): Promise<TelegramState> {
  try {
    const r = await fetch("/api/telegram/status", { cache: "no-store" });
    if (!r.ok) return { ...NONE, ready: true };
    const j = await r.json();
    return { ready: true, linked: !!j.linked, inChannel: j.account?.inChannel ?? null, inGroup: j.account?.inGroup ?? null };
  } catch { return { ...NONE, ready: true }; }
}

/**
 * Whether this signed-in learner has linked Telegram and joined the channel / group, fetched once per visit and
 * shared by every "join" card, so a card disappears once there is nothing left to join. Guests: not ready.
 */
export function useTelegramState(): TelegramState {
  const user = useAuthStore((s) => s.user);
  const [state, setState] = useState<TelegramState>(cache ?? NONE);
  useEffect(() => {
    if (!user) { setState(NONE); return; }
    let alive = true;
    const load = (force: boolean) => {
      if (force) { cache = null; inflight = null; }
      if (cache) { setState(cache); return; }
      inflight ??= fetchState().then((s) => (cache = s));
      void inflight.then((s) => alive && setState(s));
    };
    load(false);
    const onChange = () => load(true);
    window.addEventListener(TELEGRAM_CHANGED, onChange);
    return () => { alive = false; window.removeEventListener(TELEGRAM_CHANGED, onChange); };
  }, [user]);
  return state;
}

/** True when there is nothing left to ask this learner to join. */
export const hasJoinedChannel = (t: TelegramState) => t.linked && t.inChannel === true;
export const hasJoinedGroup = (t: TelegramState) => t.linked && t.inGroup === true;
