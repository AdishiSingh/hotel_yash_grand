import { create } from "zustand";

export type IntroPhase = "checking" | "splash" | "intro" | "landing";

interface IntroState {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
}

export const useIntroStore = create<IntroState>((set) => ({
  phase: "checking",
  setPhase: (phase) => set({ phase }),
}));
