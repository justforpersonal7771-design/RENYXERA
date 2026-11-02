import { create } from "zustand";

/** What is waiting for the student in the Arena (R29): challenges not yet played and friend requests. Filled by the once-a-minute presence ping. */
interface SocialState {
  challenges: number;
  requests: number;
  set: (v: { challenges: number; requests: number }) => void;
  reset: () => void;
}
export const useSocialStore = create<SocialState>((set) => ({
  challenges: 0,
  requests: 0,
  set: (v) => set({ challenges: v.challenges, requests: v.requests }),
  reset: () => set({ challenges: 0, requests: 0 }),
}));
