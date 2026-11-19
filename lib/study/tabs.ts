"use client";

/**
 * Study tabs (docs/study-materials/BOOK-TABS.md): several chapters open at once, like browser or editor tabs.
 * Kept on this device (localStorage): which tabs are open, their order and pins. Where you were reading in each tab is
 * kept for this browser session (sessionStorage), so switching tabs returns you to the same place.
 */
import { create } from "zustand";

export type StudyTab = { href: string; title: string; subject: string; tint?: string; pinned?: boolean; group?: string };
export type TabGroup = { id: string; name: string; color: string; collapsed?: boolean };
export const GROUP_COLORS = ["rose", "sky", "mint", "butter", "lilac", "peach"] as const;
const GROUPS_KEY = "renyxera.study.tab-groups.v1";
const SPLIT_KEY = "renyxera.study.split.v1";
const loadGroups = (): TabGroup[] => { try { const v = JSON.parse(localStorage.getItem(GROUPS_KEY) ?? "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };
const saveGroups = (g: TabGroup[]) => { try { localStorage.setItem(GROUPS_KEY, JSON.stringify(g)); } catch { /* private */ } };
const KEY = "renyxera.study.tabs.v1";
const SCROLL_KEY = "renyxera.study.tab-scroll.v1";
const CLOSED_KEY = "renyxera.study.tabs-closed.v1";
const loadClosed = (): StudyTab[] => { try { const v = JSON.parse(localStorage.getItem(CLOSED_KEY) ?? "[]"); return Array.isArray(v) ? v.slice(0, 5) : []; } catch { return []; } };
const saveClosed = (c: StudyTab[]) => { try { localStorage.setItem(CLOSED_KEY, JSON.stringify(c)); } catch { /* private */ } };
export const MAX_TABS = 8;

const load = (): StudyTab[] => {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return Array.isArray(v) ? v.filter((t) => t && typeof t.href === "string" && t.href.startsWith("/study/")).slice(0, MAX_TABS) : []; } catch { return []; }
};
const save = (tabs: StudyTab[]) => { try { localStorage.setItem(KEY, JSON.stringify(tabs)); } catch { /* private mode */ } };
// pinned tabs stay at the front, in the order they were pinned
const ordered = (tabs: StudyTab[]) => {
  const flat = [...tabs.filter((t) => t.pinned), ...tabs.filter((t) => !t.pinned)];
  const out: StudyTab[] = [], seen = new Set<string>();
  for (const t of flat) {
    if (!t.group) { out.push(t); continue; }
    if (seen.has(t.group)) continue;
    seen.add(t.group); out.push(...flat.filter((x) => x.group === t.group));
  }
  return out;
};

type S = {
  tabs: StudyTab[]; loaded: boolean; closed: StudyTab[]; groups: TabGroup[];
  /** Two tabs merged into one split view [left, right], like Chrome's split tabs (wide screens). */
  split: [string, string] | null;
  setSplit: (pair: [string, string] | null) => void;
  recolorGroup: (id: string, color: string) => void;
  closeGroup: (id: string) => string[];
  newGroup: (href: string) => void;
  addToGroup: (href: string, group: string | null) => void;
  renameGroup: (id: string, name: string) => void;
  toggleGroup: (id: string) => void;
  ungroup: (id: string) => void;
  /** Reopen the most recently closed tab; returns its href. */
  reopen: () => string | null;
  hydrate: () => void;
  /** Open (or focus) a tab. Returns the title of a tab closed to make room, if any. */
  open: (t: StudyTab, active?: string) => string | null;
  /** Replace one open tab with another chapter in the same place (prev / next chapter keeps you in one tab). */
  swap: (from: string, to: StudyTab) => void;
  close: (href: string) => string | null;
  closeOthers: (href: string) => void;
  pin: (href: string) => void;
  reorder: (tabs: StudyTab[]) => void;
  /** Drop tabs whose chapter no longer exists. */
  prune: (valid: (href: string) => boolean) => void;
};

export const useStudyTabs = create<S>((set, get) => ({
  tabs: [], loaded: false, closed: [], groups: [], split: null,
  hydrate: () => { if (!get().loaded) { let split: [string, string] | null = null; try { const v = JSON.parse(localStorage.getItem(SPLIT_KEY) ?? "null"); if (Array.isArray(v) && v.length === 2) split = [v[0], v[1]]; } catch { /* private */ } set({ tabs: load(), closed: loadClosed(), groups: loadGroups(), split, loaded: true }); } },
  setSplit: (pair) => { set({ split: pair }); try { if (pair) localStorage.setItem(SPLIT_KEY, JSON.stringify(pair)); else localStorage.removeItem(SPLIT_KEY); } catch { /* private */ } },
  recolorGroup: (id, color) => { const groups = get().groups.map((g) => (g.id === id ? { ...g, color } : g)); set({ groups }); saveGroups(groups); },
  closeGroup: (id) => {
    const gone = get().tabs.filter((t) => t.group === id && !t.pinned).map((t) => t.href);
    gone.forEach((h) => get().close(h));
    get().ungroup(id); return gone;
  },
  newGroup: (href) => {
    const used = get().groups.map((g) => g.color);
    const color = GROUP_COLORS.find((c) => !used.includes(c)) ?? GROUP_COLORS[get().groups.length % GROUP_COLORS.length];
    const g: TabGroup = { id: Math.random().toString(36).slice(2, 8), name: `Group ${get().groups.length + 1}`, color };
    const groups = [...get().groups, g]; set({ groups }); saveGroups(groups);
    get().addToGroup(href, g.id);
  },
  addToGroup: (href, group) => {
    const tabs = ordered(get().tabs.map((t) => (t.href === href ? { ...t, group: group ?? undefined } : t)));
    const live = new Set(tabs.map((t) => t.group).filter(Boolean));
    const groups = get().groups.filter((g) => live.has(g.id));
    set({ tabs, groups }); save(tabs); saveGroups(groups);
  },
  renameGroup: (id, name) => { const groups = get().groups.map((g) => (g.id === id ? { ...g, name: name.slice(0, 24) || g.name } : g)); set({ groups }); saveGroups(groups); },
  toggleGroup: (id) => { const groups = get().groups.map((g) => (g.id === id ? { ...g, collapsed: !g.collapsed } : g)); set({ groups }); saveGroups(groups); },
  ungroup: (id) => { const tabs = get().tabs.map((t) => (t.group === id ? { ...t, group: undefined } : t)); const groups = get().groups.filter((g) => g.id !== id); set({ tabs, groups }); save(tabs); saveGroups(groups); },
  reopen: () => {
    get().hydrate();
    const [t, ...rest] = get().closed; if (!t) return null;
    set({ closed: rest }); saveClosed(rest); get().open(t, t.href); return t.href;
  },
  swap: (from, to) => {
    get().hydrate();
    const tabs = get().tabs;
    const i = tabs.findIndex((x) => x.href === from);
    if (i < 0 || tabs.some((x) => x.href === to.href)) return; // not open, or the target already has its own tab
    const next = tabs.map((x, k) => (k === i ? { ...x, href: to.href, title: to.title, subject: to.subject, tint: to.tint ?? x.tint } : x));
    set({ tabs: next }); save(next);
  },
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
    const closed = [tabs[i], ...get().closed.filter((c) => c.href !== href)].slice(0, 5);
    set({ tabs: next, closed }); save(next); saveClosed(closed); forgetScroll(href);
    if (get().split?.includes(href)) get().setSplit(null);
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
