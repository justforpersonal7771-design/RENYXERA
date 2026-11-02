/**
 * Looks: complete designs of the app (cards, backgrounds, corners, type weight, buttons, motion), chosen in the Design Studio.
 * A Look is a block of CSS under `[data-look="<id>"]` in app/looks.css, applied by putting that attribute on <html>
 * (the Studio previews put it on a wrapper, so the same CSS draws the live preview). No attribute means Classic pastel.
 * Plan and tiers: docs/roadmap/R26-DESIGN-STUDIO.md.
 */
export type LookTier = "free" | "plus" | "pro";
export interface Look {
  id: string; name: string; tier: LookTier; family: string; blurb: string;
  /** Three colours that sum the Look up, for the card's chips. */
  swatch: [string, string, string];
  /** True when the Look ships in this release; the others are listed as "coming". */
  ready: boolean;
  /** Which colour modes the Look is designed for. A Look made for one mode hides the light/dark switch while it is on. */
  modes: "both" | "light" | "dark";
  /** The fonts the Look is drawn with (display for headings and numbers, body for text). */
  fonts: { display: string; body: string };
}

const F = {
  base: { display: "Sora", body: "Manrope" }, outfit: { display: "Outfit", body: "Outfit" }, arcade: { display: "Archivo Black", body: "Space Grotesk" },
  neon: { display: "Space Grotesk", body: "Space Grotesk" }, pixel: { display: "Jersey 15", body: "Jersey 15" },
};

export const LOOKS: Look[] = [
  { id: "classic", name: "Classic pastel", tier: "free", family: "Soft UI", blurb: "Soft pastels, ink buttons. The look you know.", swatch: ["#dcf5e5", "#e1e7ff", "#17151f"], ready: true, modes: "both", fonts: F.base },
  { id: "paper", name: "Paper", tier: "free", family: "Paper, Swiss", blurb: "Calm exam-hall reading: warm paper, thin rules, serif headings.", swatch: ["#f6f1e7", "#e9e2d2", "#2a2118"], ready: false, modes: "both", fonts: F.base },
  { id: "minimal", name: "Minimal Mono", tier: "plus", family: "Minimalism", blurb: "Black and white with one accent, hairlines, no shadows.", swatch: ["#ffffff", "#eeeeee", "#111111"], ready: false, modes: "both", fonts: F.base },
  { id: "midnight", name: "Midnight", tier: "plus", family: "Dark (OLED)", blurb: "True black with an indigo glow, for night study.", swatch: ["#05050a", "#14152b", "#818cf8"], ready: false, modes: "both", fonts: F.base },
  { id: "ocean", name: "Ocean Bento", tier: "plus", family: "Flat, bento", blurb: "Cool blue-teal tiles, crisp and flat.", swatch: ["#e0f4ff", "#bfe7f5", "#0e7490"], ready: false, modes: "both", fonts: F.base },
  { id: "sunrise", name: "Sunrise Soft", tier: "plus", family: "Soft UI", blurb: "Peach and gold, gently raised surfaces.", swatch: ["#ffe9d6", "#ffd9a8", "#c2410c"], ready: false, modes: "both", fonts: F.base },
  { id: "glass", name: "Glass", tier: "pro", family: "Glassmorphism", blurb: "Frosted translucent cards over a soft colour backdrop.", swatch: ["#a5d8ff", "#d0bfff", "#ffffff"], ready: true, modes: "both", fonts: F.outfit },
  { id: "arcade", name: "Neo-brutal Arcade", tier: "pro", family: "Neubrutalism", blurb: "Thick outlines, hard shadows, flat saturated colour.", swatch: ["#ffd43b", "#74c0fc", "#111111"], ready: true, modes: "both", fonts: F.arcade },
  { id: "neon", name: "Neon Nights", tier: "pro", family: "Cyberpunk, synthwave", blurb: "Near-black with magenta and cyan glow.", swatch: ["#0b0820", "#ff2bd6", "#22e5ff"], ready: true, modes: "dark", fonts: F.neon },
  { id: "pixel", name: "Pixel Quest", tier: "pro", family: "Pixel art", blurb: "Stepped borders, pixel headings, a limited palette.", swatch: ["#2b2d42", "#ffb703", "#8ecae6"], ready: true, modes: "both", fonts: F.pixel },
  { id: "aurora", name: "Aurora", tier: "pro", family: "Aurora UI", blurb: "A slow animated gradient glow behind clean cards.", swatch: ["#7c3aed", "#06b6d4", "#f0abfc"], ready: true, modes: "both", fonts: F.outfit },
  { id: "liquid", name: "Liquid Glass", tier: "pro", family: "Liquid glass", blurb: "Glass with shimmering, iridescent edges.", swatch: ["#bde0fe", "#ffc8dd", "#cdb4db"], ready: false, modes: "both", fonts: F.base },
  { id: "hud", name: "HUD Terminal", tier: "pro", family: "Sci-fi HUD", blurb: "Green and amber on black, monospace numbers.", swatch: ["#04110a", "#3ddc84", "#ffb000"], ready: false, modes: "both", fonts: F.base },
  { id: "blueprint", name: "Blueprint", tier: "pro", family: "Engineering drawing", blurb: "Blue grid paper and white line art.", swatch: ["#0b3d91", "#1d5fd1", "#ffffff"], ready: false, modes: "both", fonts: F.base },
  { id: "editorial", name: "Editorial", tier: "pro", family: "Magazine", blurb: "Large serif headlines, hairline rules, generous space.", swatch: ["#faf7f2", "#e8e1d6", "#1c1917"], ready: false, modes: "both", fonts: F.base },
  { id: "clay", name: "Clay", tier: "pro", family: "Claymorphism", blurb: "Soft inflated shapes in bright pastels.", swatch: ["#ffd6e0", "#c1fba4", "#ffe066"], ready: false, modes: "both", fonts: F.base },
];

export const lookById = (id: string | null | undefined): Look => LOOKS.find((l) => l.id === id) ?? LOOKS[0];
export const TIER_RANK: Record<LookTier, number> = { free: 0, plus: 1, pro: 2 };
/** Can an account on `plan` apply this Look without a trial? */
export const canUseLook = (look: Look, plan: "free" | "plus" | "pro") => TIER_RANK[plan] >= TIER_RANK[look.tier];
/** A trial lasts this long, once per Look, and each account can try at most this many Looks from each paid tier. */
export const TRIAL_MS = 5 * 60 * 1000;
export const TRIALS_PER_TIER = 2;

/** Fonts a student can pick instead of the Look's own. `var` is the CSS variable next/font defines in app/layout.tsx. */
export interface FontChoice { id: string; name: string; var: string; kind: "sans" | "display" | "serif" | "mono" | "pixel" }
export const FONT_CHOICES: FontChoice[] = [
  { id: "manrope", name: "Manrope", var: "--font-opt-manrope", kind: "sans" },
  { id: "sora", name: "Sora", var: "--font-opt-sora", kind: "display" },
  { id: "outfit", name: "Outfit", var: "--font-outfit", kind: "sans" },
  { id: "grotesk", name: "Space Grotesk", var: "--font-grotesk", kind: "sans" },
  { id: "archivo", name: "Archivo Black", var: "--font-archivo", kind: "display" },
  { id: "fraunces", name: "Fraunces", var: "--font-serif", kind: "serif" },
  { id: "pixel", name: "Jersey 15", var: "--font-pixel", kind: "pixel" },
  { id: "mono", name: "JetBrains Mono", var: "--font-mono", kind: "mono" },
];
