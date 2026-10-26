import { Style } from "@dicebear/core";

export type AvatarTier = "free" | "plus" | "pro";

/**
 * The curated avatar styles (master plan Module 4E-1), in three tiers: free for everyone,
 * Plus (silver) and Pro (gold). Premium styles are shown to everyone in the picker but can
 * only be SET by a qualifying account — enforced in the database (migration 0020 trigger
 * profiles_premium_avatar), not just here. Keep the premium lists in sync with that trigger.
 *
 * The style definitions are large (about 1.8 MB together), so each one is downloaded only when
 * it is first drawn (`loadStyle`) and kept in memory after that. The top-bar avatar therefore
 * costs one style, not twenty.
 */
const LOADERS = {
  adventurer: () => import("@dicebear/styles/adventurer.json"),
  bottts: () => import("@dicebear/styles/bottts.json"),
  notionists: () => import("@dicebear/styles/notionists.json"),
  thumbs: () => import("@dicebear/styles/thumbs.json"),
  lorelei: () => import("@dicebear/styles/lorelei.json"),
  micah: () => import("@dicebear/styles/micah.json"),
  shapes: () => import("@dicebear/styles/shapes.json"),
  identicon: () => import("@dicebear/styles/identicon.json"),
  avataaars: () => import("@dicebear/styles/avataaars.json"),
  "big-smile": () => import("@dicebear/styles/big-smile.json"),
  "open-peeps": () => import("@dicebear/styles/open-peeps.json"),
  personas: () => import("@dicebear/styles/personas.json"),
  "pixel-art": () => import("@dicebear/styles/pixel-art.json"),
  "fun-emoji": () => import("@dicebear/styles/fun-emoji.json"),
  "toon-head": () => import("@dicebear/styles/toon-head.json"),
  "voxel-art": () => import("@dicebear/styles/voxel-art.json"),
  clay: () => import("@dicebear/styles/clay.json"),
  dylan: () => import("@dicebear/styles/dylan.json"),
  cameo: () => import("@dicebear/styles/cameo.json"),
  miniavs: () => import("@dicebear/styles/miniavs.json"),
} as const;

export const AVATAR_STYLES = [
  { id: "adventurer", label: "Adventurer", tier: "free" },
  { id: "bottts", label: "Bot", tier: "free" },
  { id: "notionists", label: "Notionist", tier: "free" },
  { id: "thumbs", label: "Thumbprint", tier: "free" },
  { id: "lorelei", label: "Lorelei", tier: "free" },
  { id: "micah", label: "Micah", tier: "free" },
  { id: "shapes", label: "Shapes", tier: "free" },
  { id: "identicon", label: "Identicon", tier: "free" },
  { id: "avataaars", label: "Avataaar", tier: "plus" },
  { id: "big-smile", label: "Big Smile", tier: "plus" },
  { id: "open-peeps", label: "Open Peeps", tier: "plus" },
  { id: "personas", label: "Persona", tier: "plus" },
  { id: "pixel-art", label: "Pixel Art", tier: "plus" },
  { id: "fun-emoji", label: "Fun Emoji", tier: "plus" },
  { id: "toon-head", label: "Toon", tier: "pro" },
  { id: "voxel-art", label: "Voxel", tier: "pro" },
  { id: "clay", label: "Clay", tier: "pro" },
  { id: "dylan", label: "Dylan", tier: "pro" },
  { id: "cameo", label: "Cameo", tier: "pro" },
  { id: "miniavs", label: "Miniavs", tier: "pro" },
] as const satisfies readonly { id: keyof typeof LOADERS; label: string; tier: AvatarTier }[];

export type AvatarStyleId = (typeof AVATAR_STYLES)[number]["id"];

/** CC BY 4.0 styles need visible credit (shown under the picker). */
export const AVATAR_CREDITS = "Avatar styles via DiceBear. Big Smile by Ashley Seo, Persona by Draftbit, Fun Emoji by Davis Uche, Toon by Johan Melin, Dylan by Natalia Spivak, Miniavs by Webpixels, Micah by Micah Lanier, Adventurer & Lorelei by Lisa Wischofsky (CC BY 4.0); Avataaars & Open Peeps by Pablo Stanley.";

const TIER_BY_ID = new Map<string, AvatarTier>(AVATAR_STYLES.map((s) => [s.id, s.tier]));

export function isAvatarStyleId(value: string): value is AvatarStyleId {
  return Object.prototype.hasOwnProperty.call(LOADERS, value);
}
export const avatarTier = (id: string): AvatarTier => TIER_BY_ID.get(id) ?? "free";

const cache = new Map<AvatarStyleId, Style>();
const pending = new Map<AvatarStyleId, Promise<Style>>();

/** The style if it is already downloaded (synchronous), else undefined. */
export const cachedStyle = (id: AvatarStyleId) => cache.get(isAvatarStyleId(id) ? id : "adventurer");

/** Downloads a style once (stale or unknown ids fall back to Adventurer). */
export function loadStyle(id: AvatarStyleId): Promise<Style> {
  const key: AvatarStyleId = isAvatarStyleId(id) ? id : "adventurer";
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  let p = pending.get(key);
  if (!p) {
    p = LOADERS[key]().then((m) => {
      const def = (m as { default?: unknown }).default ?? m;
      const s = new Style(def as ConstructorParameters<typeof Style>[0]);
      cache.set(key, s);
      return s;
    });
    pending.set(key, p);
  }
  return p;
}
