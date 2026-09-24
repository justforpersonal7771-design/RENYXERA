import { Style } from "@dicebear/core";
import adventurer from "@dicebear/styles/adventurer.json";
import bottts from "@dicebear/styles/bottts.json";
import notionists from "@dicebear/styles/notionists.json";
import thumbs from "@dicebear/styles/thumbs.json";
import lorelei from "@dicebear/styles/lorelei.json";
import micah from "@dicebear/styles/micah.json";
import shapes from "@dicebear/styles/shapes.json";
import identicon from "@dicebear/styles/identicon.json";

/**
 * The curated set of avatar styles offered in the picker (master plan Module 4E-1).
 * Deliberately a fixed, small set rather than exposing DiceBear's full ~60-style
 * catalogue — a shorter, hand-picked list is easier to browse and keeps every option
 * looking intentional rather than like a raw library dump.
 *
 * Each `Style` instance is constructed once at module load and reused across every
 * avatar rendered with it, per DiceBear's own guidance (constructing `Style` runs a
 * JSON Schema validation pass over the definition — wasteful to repeat per-avatar).
 */
export const AVATAR_STYLES = [
  { id: "adventurer", label: "Adventurer", style: new Style(adventurer) },
  { id: "bottts", label: "Bot", style: new Style(bottts) },
  { id: "notionists", label: "Notionist", style: new Style(notionists) },
  { id: "thumbs", label: "Thumbprint", style: new Style(thumbs) },
  { id: "lorelei", label: "Lorelei", style: new Style(lorelei) },
  { id: "micah", label: "Micah", style: new Style(micah) },
  { id: "shapes", label: "Shapes", style: new Style(shapes) },
  { id: "identicon", label: "Identicon", style: new Style(identicon) },
] as const;

export type AvatarStyleId = (typeof AVATAR_STYLES)[number]["id"];

const STYLE_BY_ID = new Map(AVATAR_STYLES.map((s) => [s.id, s.style]));

export function isAvatarStyleId(value: string): value is AvatarStyleId {
  return STYLE_BY_ID.has(value as AvatarStyleId);
}

export function getStyleById(id: AvatarStyleId) {
  const style = STYLE_BY_ID.get(id);
  if (!style) {
    // Defends against a stale/corrupt stored style id (e.g. from a future style list
    // change) rather than crashing whatever screen is trying to render a profile.
    return STYLE_BY_ID.get("adventurer")!;
  }
  return style;
}
