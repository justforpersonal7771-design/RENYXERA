/**
 * Shared motion tokens (docs/design/MOTION-INTERACTION-CATALOGUE.md, rules section).
 * Interface moves stay under 300 ms, use the ease-out curve below, and only animate transform and opacity.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const DURATION = { press: 0.12, hover: 0.18, enter: 0.24, sheet: 0.32 } as const;

export const SPRING = {
  /** Sliding indicators, tab pills, dock highlight. */
  glide: { type: "spring", stiffness: 420, damping: 34 },
  /** Gestures that snap back (swipe, drag release). */
  snap: { type: "spring", stiffness: 300, damping: 24, mass: 0.8 },
  /** Soft pull toward the pointer (hero buttons only). */
  pull: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 },
} as const;
