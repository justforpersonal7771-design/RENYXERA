import { Avatar } from "@dicebear/core";
import { useEffect, useState } from "react";
import { cachedStyle, loadStyle, type AvatarStyleId } from "./dicebear-styles";

/**
 * Generates a `data:image/svg+xml` URI for the given style+seed, safe to drop straight
 * into an `<img src>`. Deterministic: the same (style, seed) pair always renders the
 * same avatar, which is what makes storing just a seed string sufficient — see the
 * master plan §4E-1. Runs entirely client-side.
 *
 * A data URI (rather than inlining the raw SVG markup into the DOM) is the deliberate
 * choice — it renders as an opaque image, not parsed as live DOM/script, so there's no
 * SVG-injection surface.
 *
 * Styles download on demand, so this returns a blank placeholder until the style is ready;
 * the hooks below re-render once it is.
 */
const BLANK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'/>";

export function generateAvatarDataUri(styleId: AvatarStyleId, seed: string, options: { size?: number } = {}): string {
  const style = cachedStyle(styleId);
  if (!style) return BLANK;
  return new Avatar(style, { seed, size: options.size ?? 128 }).toDataUri();
}

/** React hook: re-renders when the given styles have downloaded. Returns a counter for memo deps. */
export function useAvatarStyles(ids: readonly AvatarStyleId[]): number {
  const [n, setN] = useState(0);
  const key = ids.join(",");
  useEffect(() => {
    let alive = true;
    for (const id of key.split(",") as AvatarStyleId[]) {
      if (!cachedStyle(id)) void loadStyle(id).then(() => { if (alive) setN((x) => x + 1); });
    }
    return () => { alive = false; };
  }, [key]);
  return n;
}

/** A short, URL-safe random seed for "Shuffle" — not cryptographically significant,
 *  just needs to vary the deterministic output. */
export function randomAvatarSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
