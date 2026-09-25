import { create } from "zustand";
import { effectiveTargetYear } from "@/lib/goals/exam-year";

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_seed: string;
  avatar_style: string;
  target_branch: string;
  target_year: number | null;
  target_rank: number | null;
  target_score: number | null;
  daily_study_hours: number;
  tier: string;
}

interface AuthUser {
  id: string;
  email: string | null;
}

interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  /** True until the first session check resolves — lets the topbar avoid flashing a
   *  "sign in" prompt for a split second before an existing session is confirmed. */
  loading: boolean;
  setSession: (user: AuthUser | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Client-side mirror of the current Supabase auth session — populated by
 * components/system/auth-listener.tsx, which is the only thing that writes to this
 * store. Everything else (topbar, profile page) just reads it. Deliberately NOT
 * included in lib/store/reset-all-stores.ts's sweep — that resets per-user app data on
 * a namespace switch, and wiping this store at the same moment would erase the very
 * session state that switch is driven by.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setSession: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
}));

/**
 * The signed-in user's chosen display name (never the @username), for greetings and
 * other personal touches across the app. `first` is the first word, for casual lines
 * like "Good evening, Adil". Both are null for guests or when no display name is set —
 * callers fall back to neutral copy rather than inventing a name.
 */
export function useDisplayName(): { full: string | null; first: string | null } {
  const name = useAuthStore((s) => s.profile?.display_name?.trim() || null);
  return { full: name, first: name ? name.split(/\s+/)[0] : null };
}

/** The GATE year this learner is preparing for (profile target, rolled forward once that
 *  exam has passed; the next upcoming exam for guests). Drives every "GATE <year>" label,
 *  the countdown and the goals engine. See lib/goals/exam-year.ts. */
export function useTargetYear(): number {
  const saved = useAuthStore((s) => s.profile?.target_year ?? null);
  return effectiveTargetYear(saved);
}
