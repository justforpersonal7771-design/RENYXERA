import { Style } from "@dicebear/core";
import adventurer from "@dicebear/styles/adventurer.json";
import bottts from "@dicebear/styles/bottts.json";
import notionists from "@dicebear/styles/notionists.json";
import thumbs from "@dicebear/styles/thumbs.json";
import lorelei from "@dicebear/styles/lorelei.json";
import micah from "@dicebear/styles/micah.json";
import shapes from "@dicebear/styles/shapes.json";
import identicon from "@dicebear/styles/identicon.json";
// Plus (silver) styles
import avataaars from "@dicebear/styles/avataaars.json";
import bigSmile from "@dicebear/styles/big-smile.json";
import openPeeps from "@dicebear/styles/open-peeps.json";
import personas from "@dicebear/styles/personas.json";
import pixelArt from "@dicebear/styles/pixel-art.json";
import funEmoji from "@dicebear/styles/fun-emoji.json";
// Pro (gold) styles
import toonHead from "@dicebear/styles/toon-head.json";
import voxelArt from "@dicebear/styles/voxel-art.json";
import clay from "@dicebear/styles/clay.json";
import dylan from "@dicebear/styles/dylan.json";
import cameo from "@dicebear/styles/cameo.json";
import miniavs from "@dicebear/styles/miniavs.json";

export type AvatarTier = "free" | "plus" | "pro";

/**
 * The curated avatar styles (master plan Module 4E-1), in three tiers: free for everyone,
 * Plus (silver) and Pro (gold). Premium styles are shown to everyone in the picker but can
 * only be SET by a qualifying account — enforced in the database (migration 0020 trigger
 * profiles_premium_avatar), not just here. Keep the premium lists in sync with that trigger.
 *
 * Each `Style` instance is constructed once at module load and reused (DiceBear guidance).
 */
export const AVATAR_STYLES = [
  { id: "adventurer", label: "Adventurer", tier: "free", style: new Style(adventurer) },
  { id: "bottts", label: "Bot", tier: "free", style: new Style(bottts) },
  { id: "notionists", label: "Notionist", tier: "free", style: new Style(notionists) },
  { id: "thumbs", label: "Thumbprint", tier: "free", style: new Style(thumbs) },
  { id: "lorelei", label: "Lorelei", tier: "free", style: new Style(lorelei) },
  { id: "micah", label: "Micah", tier: "free", style: new Style(micah) },
  { id: "shapes", label: "Shapes", tier: "free", style: new Style(shapes) },
  { id: "identicon", label: "Identicon", tier: "free", style: new Style(identicon) },
  { id: "avataaars", label: "Avataaar", tier: "plus", style: new Style(avataaars) },
  { id: "big-smile", label: "Big Smile", tier: "plus", style: new Style(bigSmile) },
  { id: "open-peeps", label: "Open Peeps", tier: "plus", style: new Style(openPeeps) },
  { id: "personas", label: "Persona", tier: "plus", style: new Style(personas) },
  { id: "pixel-art", label: "Pixel Art", tier: "plus", style: new Style(pixelArt) },
  { id: "fun-emoji", label: "Fun Emoji", tier: "plus", style: new Style(funEmoji) },
  { id: "toon-head", label: "Toon", tier: "pro", style: new Style(toonHead) },
  { id: "voxel-art", label: "Voxel", tier: "pro", style: new Style(voxelArt) },
  { id: "clay", label: "Clay", tier: "pro", style: new Style(clay) },
  { id: "dylan", label: "Dylan", tier: "pro", style: new Style(dylan) },
  { id: "cameo", label: "Cameo", tier: "pro", style: new Style(cameo) },
  { id: "miniavs", label: "Miniavs", tier: "pro", style: new Style(miniavs) },
] as const;

export type AvatarStyleId = (typeof AVATAR_STYLES)[number]["id"];

/** CC BY 4.0 styles need visible credit (shown under the picker). */
export const AVATAR_CREDITS = "Avatar styles via DiceBear. Big Smile by Ashley Seo, Persona by Draftbit, Fun Emoji by Davis Uche, Toon by Johan Melin, Dylan by Natalia Spivak, Miniavs by Webpixels, Micah by Micah Lanier, Adventurer & Lorelei by Lisa Wischofsky (CC BY 4.0); Avataaars & Open Peeps by Pablo Stanley.";

const STYLE_BY_ID = new Map(AVATAR_STYLES.map((s) => [s.id, s.style]));
const TIER_BY_ID = new Map<string, AvatarTier>(AVATAR_STYLES.map((s) => [s.id, s.tier]));

export function isAvatarStyleId(value: string): value is AvatarStyleId {
  return STYLE_BY_ID.has(value as AvatarStyleId);
}
export const avatarTier = (id: string): AvatarTier => TIER_BY_ID.get(id) ?? "free";

export function getStyleById(id: AvatarStyleId) {
  const style = STYLE_BY_ID.get(id);
  if (!style) {
    // Defends against a stale/corrupt stored style id (e.g. from a future style list
    // change) rather than crashing whatever screen is trying to render a profile.
    return STYLE_BY_ID.get("adventurer")!;
  }
  return style;
}
