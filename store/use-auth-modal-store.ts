import { create } from "zustand";

type AuthModalMode = "login" | "signup";

interface AuthModalState {
  isOpen: boolean;
  mode: AuthModalMode;
  /** Where to send the user after a successful sign-in/sign-up inside the modal. */
  redirectTo: string;
  open: (mode?: AuthModalMode, redirectTo?: string) => void;
  close: () => void;
  setMode: (mode: AuthModalMode) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  mode: "login",
  redirectTo: "/",
  open: (mode = "login", redirectTo = "/") => set({ isOpen: true, mode, redirectTo }),
  close: () => set({ isOpen: false }),
  setMode: (mode) => set({ mode }),
}));
