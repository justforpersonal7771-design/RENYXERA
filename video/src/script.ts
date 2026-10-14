// The story as data: every cut (master, 45, 30, 15 seconds) is built from the same scene templates.
// Product scenes are animated re-creations of the real screens (src/ui.tsx), built from the product's real layout, labels,
// questions, numbers and formula. Each has a "nominal" choreography length N: when a scene is shorter than N the whole
// choreography simply plays faster, so the cut-downs reuse the same animation.
import vo from "./vo.json";

export const FPS = 30;
export type VoId = keyof typeof vo;
export type UiId = "home" | "setup" | "exam" | "results" | "tools" | "plans";
export type SceneKind = "problem" | "ui" | "cards" | "end";
export type Sfx = { n?: number; at?: number; name: "click" | "pop" | "whoosh" | "chime"; vol?: number };

export type Scene = {
  id: string;
  kind: SceneKind;
  voice: VoId;
  delay: number; // seconds before the voice starts
  dur: number; // seconds
  ui?: UiId;
  kicker?: string;
  caption?: string;
  sfx?: Sfx[];
  wipeIn?: boolean;
  wipeOut?: boolean;
  note?: string; // small honesty line under the window
};

/** Nominal choreography length (s) of each product scene, and the time the animation waits before it starts. */
export const NOMINAL: Record<UiId, number> = { home: 5, setup: 11, exam: 12, results: 8, tools: 10, plans: 8 };
export const LEAD = 0.5;
/** Playback rate of a scene's choreography: never slower than real time, faster when the scene is short. */
export const rateOf = (s: Scene) => (s.ui ? Math.max(1, NOMINAL[s.ui] / Math.max(2, s.dur - LEAD - 0.8)) : 1);

const need = (voice: VoId, delay: number, min: number) => Math.max(min, delay + vo[voice] + 0.7);
const d = (voice: VoId, min: number, delay = 0.55) => need(voice, delay, min);

const problem = (voice: VoId, dur: number): Scene => ({
  id: "problem", kind: "problem", voice, delay: 0.5, dur, wipeOut: true, sfx: [{ at: dur - 1.1, name: "pop" }],
});
const reframe = (voice: VoId, dur: number): Scene => ({
  id: "reframe", kind: "ui", ui: "home", voice, delay: 0.55, dur, kicker: "ONE PLACE", caption: "One calm place for GATE prep", wipeIn: true,
  sfx: [{ n: 3.2, name: "click" }],
});
const choose = (voice: VoId, dur: number): Scene => ({
  id: "choose", kind: "ui", ui: "setup", voice, delay: 0.55, dur, kicker: "STEP 1 · CHOOSE", caption: "Section. Subject. Topic.",
  sfx: [1.5, 3.0, 4.1, 5.2, 6.3, 7.3, 8.7].map((n) => ({ n, name: "click" as const })),
});
const attempt = (voice: VoId, dur: number): Scene => ({
  id: "attempt", kind: "ui", ui: "exam", voice, delay: 0.55, dur, kicker: "STEP 2 · ATTEMPT", caption: "Real questions. Exam style.",
  sfx: [2.4, 4.0, 5.2, 5.8, 6.5, 7.9, 9.4].map((n) => ({ n, name: "click" as const })),
});
const understand = (voice: VoId, dur: number): Scene => ({
  id: "understand", kind: "ui", ui: "results", voice, delay: 0.55, dur, kicker: "STEP 3 · UNDERSTAND", caption: "See exactly how you did",
  note: "Sample practice session",
  sfx: [{ n: 0.5, name: "whoosh", vol: 0.35 }, { n: 2.2, name: "chime", vol: 0.8 }, { n: 6.5, name: "click" }],
});
const cards = (voice: VoId, dur: number): Scene => ({
  id: "cards", kind: "cards", voice, delay: 0.4, dur, wipeIn: true,
  sfx: [{ at: 1.6, name: "pop" }, { at: 3.4, name: "pop" }, { at: 5.2, name: "pop" }, { at: 7.0, name: "pop" }],
});
const freeTools = (voice: VoId, dur: number): Scene => ({
  id: "tools", kind: "ui", ui: "tools", voice, delay: 0.55, dur, kicker: "FREE TOOLS", caption: "Official GATE 2026 cut-offs",
  sfx: [{ n: 3.4, name: "click" }, { n: 8.3, name: "chime", vol: 0.6 }],
});
const access = (voice: VoId, dur: number): Scene => ({
  id: "access", kind: "ui", ui: "plans", voice, delay: 0.55, dur, kicker: "START FREE", caption: "Start free. Plus is ₹29 a month.",
  note: "Prices as on the live site on 15 Oct 2026",
  sfx: [{ n: 0.8, name: "pop" }, { n: 5.8, name: "click" }],
});
const end = (voice: VoId, dur: number): Scene => ({
  id: "end", kind: "end", voice, delay: 0.7, dur, wipeIn: true, sfx: [{ at: 0.9, name: "chime", vol: 0.7 }],
});

export const VARIANTS = {
  master: [problem("p1", d("p1", 9.5, 0.5)), reframe("r1", d("r1", 5.8)), choose("s1", d("s1", 11)), attempt("q1", d("q1", 12)),
    understand("a1", d("a1", 9)), cards("c1", d("c1", 14.2, 0.4)), freeTools("t1", d("t1", 11.4)), access("m1", d("m1", 9.6)), end("e1", d("e1", 9.5, 0.7))],
  cut45: [problem("h1", 4), reframe("r1", 6), choose("s1", 8.4), attempt("q1", 8.8), understand("a1", 7.6), end("e1", 9.3)],
  cut30: [problem("h1", 3.8), choose("s1", 7.6), attempt("q1", 8.2), understand("a1", 7), end("h3", 4.6)],
  cut15: [problem("h1", 3.2), { ...attempt("h2", 6.8), kicker: "PRACTISE · REVIEW", caption: "Practise real GATE questions" }, end("h3", 4.4)],
} satisfies Record<string, Scene[]>;

export type VariantId = keyof typeof VARIANTS;
export const totalFrames = (v: VariantId) => Math.round(VARIANTS[v].reduce((a, s) => a + s.dur, 0) * FPS);
export { vo };
