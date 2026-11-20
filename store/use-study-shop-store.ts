import { create } from "zustand";

/** Opens the study packs and bundles window over whatever page the learner is on (like the Plans window for Plus and Pro). */
export type ShopView = "bundles" | "single" | "custom";
type State = { open: boolean; view: ShopView; reason: string | null; show: (reason?: string, view?: ShopView) => void; close: () => void };

export const useStudyShopStore = create<State>((set) => ({
  open: false,
  view: "bundles",
  reason: null,
  show: (reason, view) => set({ open: true, reason: reason ?? null, view: view ?? "bundles" }),
  close: () => set({ open: false, reason: null }),
}));

export const openStudyShop = (reason?: string, view?: ShopView) => useStudyShopStore.getState().show(reason, view);
