import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Step 7 (4E): per-device preferences. Kept in localStorage on purpose: motion and
 * reminder choices are about this screen/device (a phone and a laptop often differ).
 * Theme itself lives in next-themes' own storage.
 */
export type MotionPref = "system" | "reduce" | "full";

interface PreferencesState {
  motion: MotionPref;
  reminders: boolean;
  setMotion: (m: MotionPref) => void;
  setReminders: (on: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      motion: "system",
      reminders: true,
      setMotion: (motion) => set({ motion }),
      setReminders: (reminders) => set({ reminders }),
    }),
    {
      name: "renyxera_prefs",
      storage: createJSONStorage(() => {
        try { return localStorage; } catch { return sessionStorage; }
      }),
    }
  )
);
