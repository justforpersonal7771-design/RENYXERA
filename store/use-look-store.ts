"use client";

import { create } from "zustand";
import { LOOKS, TRIALS_PER_TIER, TRIAL_MS, lookById, type LookTier } from "@/lib/looks/looks";

/**
 * The student's chosen Look and any running trial, kept in localStorage (one key, read before first paint by the script in app/layout.tsx).
 * Trials are once per Look and at most TRIALS_PER_TIER Looks per paid tier. This copy is a convenience; the server-side record that
 * stops clearing the browser from resetting trials is planned in the R26 doc.
 */
const KEY = "renyxera_look_v1";
export interface LookState { look: string; trial: { id: string; endsAt: number } | null; tried: string[]; fonts?: { display?: string; body?: string } }
const empty: LookState = { look: "classic", trial: null, tried: [], fonts: {} };

const read = (): LookState => {
  try { const s = JSON.parse(localStorage.getItem(KEY) ?? "null"); return s && typeof s.look === "string" ? { ...empty, ...s } : empty; } catch { return empty; }
};
const write = (s: LookState) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode */ } };

interface Store extends LookState {
  hydrated: boolean;
  load: () => void;
  setLook: (id: string) => void;
  /** Starts a 5-minute trial; false when this Look was tried already or the tier's two trials are used. */
  startTrial: (id: string) => { ok: boolean; reason?: "again" | "limit" };
  endTrial: (keep: boolean) => void;
  triesLeft: (tier: LookTier) => number;
  /** Override the Look's fonts. Pass a CSS variable name from FONT_CHOICES, or undefined to follow the Look. */
  setFont: (which: "display" | "body", cssVar: string | undefined) => void;
}

export const useLookStore = create<Store>((set, get) => ({
  ...empty, hydrated: false,
  load: () => set({ ...read(), hydrated: true }),
  setLook: (id) => { const next = { look: id, trial: null, tried: get().tried, fonts: get().fonts }; write(next); set(next); },
  startTrial: (id) => {
    const l = lookById(id), s = get();
    if (s.tried.includes(id)) return { ok: false, reason: "again" };
    if (l.tier !== "free" && s.tried.filter((t) => lookById(t).tier === l.tier).length >= TRIALS_PER_TIER) return { ok: false, reason: "limit" };
    const next = { look: s.look, trial: { id, endsAt: Date.now() + TRIAL_MS }, tried: [...s.tried, id], fonts: s.fonts };
    write(next); set(next); return { ok: true };
  },
  endTrial: (keep) => {
    const s = get(); const id = s.trial?.id;
    const next = { look: keep && id ? id : s.look, trial: null, tried: s.tried, fonts: s.fonts };
    write(next); set(next);
  },
  setFont: (which, cssVar) => { const s = get(); const next = { look: s.look, trial: s.trial, tried: s.tried, fonts: { ...s.fonts, [which]: cssVar } }; write(next); set(next); },
  triesLeft: (tier) => (tier === "free" ? 99 : Math.max(0, TRIALS_PER_TIER - get().tried.filter((t) => lookById(t).tier === tier).length)),
}));

/** The Look that is on screen right now: a running trial wins over the chosen Look. */
export const effectiveLookId = (s: LookState, now = Date.now()) => (s.trial && s.trial.endsAt > now ? s.trial.id : s.look);
export const ALL_LOOK_IDS = LOOKS.map((l) => l.id);
