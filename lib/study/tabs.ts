"use client";

/**
 * Study tabs (docs/study-materials/BOOK-TABS.md): several chapters open at once, like browser or editor tabs.
 * Kept on this device (localStorage): which tabs are open, their order and pins. Where you were reading in each tab is
 * kept for this browser session (sessionStorage), so switching tabs returns you to the same place.
 */
import { create } from "zustand";

export type StudyTab = { href: string; title: string; subject: string; tint?: string; pinned?: boolean };
const KEY = "renyxera.study.tabs.v1";
const SCROLL_KEY = "renyxera.study.tab-scroll.v1";
export const MAX_TABS = 8;

const load = (): StudyTab[] => {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return Array.isArray(v) ? v.filter((t) => t && typeof t.href === "string" && t.href.startsWith("/study/")).slice(0, MAX_TABS) : []; } catch { return []; }
};
const save = (tabs: StudyTab[]) => { try { localStorage.setItem(KEY, JSON.stringify(tabs)); } catch { /* private mode */ } };
// pinned tabs stay at the front, in the order they were pinned
const ordered = (tabs: StudyTab[]) => [...tabs.filter((t) => t.pinned), ...tabs.filter((t) => !t.pinned)];

type S = {
  tabs: StudyTab[]; loaded: boolean;
  hydrate: () => void;
  /** Open (or focus) a tab. Returns the title of a tab closed to make room, if any. */
  open: (t: StudyTab, active?: string) => string | null;
  close: (href: string) => string | null;
  closeOthers: (href: string) => void;
  pin: (href: string) => void;
  reorder: (tabs: StudyTab[]) => void;
  /** Drop tabs whose chapter no longer exists. */
  prune: (valid: (href: string) => boolean) => void;
};

export const useStudyTabs = create<S>((set, get) => ({
  tabs: [], loaded: false,
  hydrate: () => { if (!get().loaded) set({ tabs: load(), loaded: true }); },
  open: (t, active) => {
    get().hydrate();
    const tabs = get().tabs;
    const i = tabs.findIndex((x) => x.href === t.href);
    if (i >= 0) { // already open: refresh its title, keep its place
      const next = tabs.map((x, k) => (k === i ? { ...x, title: t.title, subject: t.subject, tint: t.tint ?? x.tint } : x));
      set({ tabs: next }); save(next); return null;
    }
    let next = [...tabs, t], dropped: string | null = null;
    if (next.length > MAX_TABS) { // close the oldest tab that is neither pinned nor the one being read
      const k = next.findIndex((x) => !x.pinned && x.href !== active && x.href !== t.href);
      if (k >= 0) { dropped = next[k].title; next = next.filter((_, n) => n !== k); } else next = next.slice(0, MAX_TABS);
    }
    next = ordered(next);
    set({ tabs: next }); save(next); return dropped;
  },
  close: (href) => {
    const tabs = get().tabs, i = tabs.findIndex((x) => x.href === href);
    if (i < 0) return null;
    const next = tabs.filter((x) => x.href !== href);
    set({ tabs: next }); save(next); forgetScroll(href);
    const n = next[i] ?? next[i - 1];
    return n ? n.href : null; // the neighbour to show if the closed tab was the one being read
  },
  closeOthers: (href) => { const next = get().tabs.filter((x) => x.href === href || x.pinned); set({ tabs: next }); save(next); },
  pin: (href) => { const next = ordered(get().tabs.map((x) => (x.href === href ? { ...x, pinned: !x.pinned } : x))); set({ tabs: next }); save(next); },
  reorder: (tabs) => { const next = ordered(tabs); set({ tabs: next }); save(next); },
  prune: (valid) => { const next = get().tabs.filter((x) => valid(x.href)); if (next.length !== get().tabs.length) { set({ tabs: next }); save(next); } },
}));

const scrolls = (): Record<string, number> => { try { return JSON.parse(sessionStorage.getItem(SCROLL_KEY) ?? "{}"); } catch { return {}; } };
export const rememberScroll = (href: string, top: number) => { try { sessionStorage.setItem(SCROLL_KEY, JSON.stringify({ ...scrolls(), [href]: Math.round(top) })); } catch { /* private */ } };
export const recallScroll = (href: string) => scrolls()[href] ?? 0;
function forgetScroll(href: string) { const s = scrolls(); delete s[href]; try { sessionStorage.setItem(SCROLL_KEY, JSON.stringify(s)); } catch { /* private */ } }
