"use client";

/**
 * The reader's roadmap choices (order and the subjects to include), kept on this device and shared by every part of the Study page:
 * the roadmap panel, the path list and the bookshelf all read the same values, so a change in one applies to the others at once.
 */
import { useSyncExternalStore } from "react";

export type RoadmapMode = "balanced" | "marks" | "logical" | "pyqs" | "continue" | "shelf";
export const ROADMAP_MODES: RoadmapMode[] = ["balanced", "marks", "logical", "pyqs", "continue", "shelf"];
export type RoadmapPrefs = { mode: RoadmapMode; off: string[] };

const MODE_KEY = "renyxera.study.roadmap.mode", OFF_KEY = "renyxera.study.roadmap.off", EVENT = "renyxera:roadmap-prefs";
const DEFAULT: RoadmapPrefs = { mode: "balanced", off: [] };
let cache: RoadmapPrefs = DEFAULT;
let loaded = false;

function load(): RoadmapPrefs {
  try {
    const m = localStorage.getItem(MODE_KEY);
    const o = JSON.parse(localStorage.getItem(OFF_KEY) ?? "[]");
    return { mode: ROADMAP_MODES.includes(m as RoadmapMode) ? (m as RoadmapMode) : "balanced", off: Array.isArray(o) ? o.filter((x: unknown): x is string => typeof x === "string") : [] };
  } catch { return DEFAULT; }
}
function snapshot(): RoadmapPrefs { if (!loaded) { cache = load(); loaded = true; } return cache; }
function save(next: RoadmapPrefs) {
  cache = next; loaded = true;
  try { localStorage.setItem(MODE_KEY, next.mode); localStorage.setItem(OFF_KEY, JSON.stringify(next.off)); } catch { /* storage off */ }
  window.dispatchEvent(new Event(EVENT));
}
function subscribe(cb: () => void) {
  const on = () => { cache = load(); loaded = true; cb(); };
  window.addEventListener(EVENT, cb); window.addEventListener("storage", on);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", on); };
}

/** Server and first client render use the defaults; the saved choice appears right after hydration. */
export function useRoadmapPrefs() {
  const prefs = useSyncExternalStore(subscribe, snapshot, () => DEFAULT);
  return {
    ...prefs,
    setMode: (mode: RoadmapMode) => save({ ...snapshot(), mode }),
    toggle: (id: string) => { const cur = snapshot(); save({ ...cur, off: cur.off.includes(id) ? cur.off.filter((x) => x !== id) : [...cur.off, id] }); },
    apply: (mode: RoadmapMode, off: string[]) => save({ mode, off }),
    reset: () => save(DEFAULT),
  };
}
