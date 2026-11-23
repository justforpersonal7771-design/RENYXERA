/** Citadel Clash: the game section (it was called Battles until 23 Nov 2026). The name and the address are set here only. */
export const CITADEL = "Citadel Clash";
export const CITADEL_HREF = "/citadel-clash";
/** The game's screens, and the shared-challenge pages that belong to it. */
export const isCitadelPath = (p: string | null | undefined) => !!p && (p.startsWith(CITADEL_HREF) || p.startsWith("/challenge"));
