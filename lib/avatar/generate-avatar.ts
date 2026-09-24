import { Avatar } from "@dicebear/core";
import { getStyleById, type AvatarStyleId } from "./dicebear-styles";

/**
 * Generates a `data:image/svg+xml` URI for the given style+seed, safe to drop straight
 * into an `<img src>`. Deterministic: the same (style, seed) pair always renders the
 * same avatar, which is what makes storing just a seed string sufficient — see the
 * master plan §4E-1. Runs entirely client-side; nothing here touches the network.
 *
 * A data URI (rather than inlining the raw SVG markup into the DOM) is the deliberate
 * choice — it renders as an opaque image, not parsed as live DOM/script, so there's no
 * SVG-injection surface to reason about even though the input here is our own bundled,
 * trusted style definitions plus a plain string seed, never third-party markup.
 */
export function generateAvatarDataUri(
  styleId: AvatarStyleId,
  seed: string,
  options: { size?: number } = {}
): string {
  const style = getStyleById(styleId);
  const avatar = new Avatar(style, { seed, size: options.size ?? 128 });
  return avatar.toDataUri();
}

/** A short, URL-safe random seed for "Shuffle" — not cryptographically significant,
 *  just needs to vary the deterministic output. */
export function randomAvatarSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
