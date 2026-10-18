/** Public social profiles and Telegram rooms. One place, used by the footer, branch pages and structured data. */
export const YOUTUBE_URL = "https://www.youtube.com/@renyxera";
export const INSTAGRAM_URL = "https://www.instagram.com/renyxera";
export const TELEGRAM_HUB = "https://t.me/renyxera";
export const TELEGRAM_FOLDER = "https://t.me/addlist/fY_dvTl36FA3ZTQ1";
export const TELEGRAM_CHAT = "https://t.me/renyxera_chat";

/** Branch channel per paper code (CSE branch code uses the CS paper). */
export const TELEGRAM_BRANCH: Record<string, string> = {
  CS: "https://t.me/renyxera_gate_cs",
  EC: "https://t.me/renyxera_gate_ece",
  EE: "https://t.me/renyxera_gate_ee",
  ME: "https://t.me/renyxera_gate_me",
  CE: "https://t.me/renyxera_gate_ce",
  DA: "https://t.me/renyxera_gate_da",
};

export const SAME_AS = [YOUTUBE_URL, INSTAGRAM_URL, TELEGRAM_HUB];
