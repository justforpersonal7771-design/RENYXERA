import { create } from "zustand";

/** Opens the Plans window right where the learner is, instead of sending them to the Plans page. */
type UpgradeModalState = { open: boolean; reason: string | null; show: (reason?: string) => void; close: () => void };

export const useUpgradeModalStore = create<UpgradeModalState>((set) => ({
  open: false,
  reason: null,
  show: (reason) => set({ open: true, reason: reason ?? null }),
  close: () => set({ open: false, reason: null }),
}));

export const openUpgrade = (reason?: string) => useUpgradeModalStore.getState().show(reason);
