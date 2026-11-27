import { create } from "zustand";

/** Focus mode (study pages only): hides the navbar, menus and banners so the lesson is all that is on screen. Time in it is counted as study time. */
interface FocusState {
  on: boolean;
  /** what the time is counted against, e.g. the book's subject */
  label: string | null;
  /** seconds in this focus session, counted by FocusSession and shown on the Focus button */
  secs: number;
  /** paused: the clock stops and nothing is counted until the reader resumes */
  paused: boolean;
  togglePause: () => void;
  setSecs: (n: number) => void;
  enter: (label: string | null) => void;
  exit: () => void;
}
export const useFocusStore = create<FocusState>((set) => ({
  on: false,
  label: null,
  secs: 0,
  paused: false,
  togglePause: () => set((s) => ({ paused: !s.paused })),
  setSecs: (n) => set({ secs: n }),
  enter: (label) => set({ on: true, label, secs: 0, paused: false }),
  exit: () => set({ on: false, paused: false }),
}));
