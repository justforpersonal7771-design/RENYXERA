/**
 * Username rules, shared by the profile form (client) and /api/username/check (server)
 * so the two can never disagree: lowercase letters, digits and underscores only,
 * 3–20 characters, must start with a letter. Uppercase input is lowercased rather than
 * rejected, so "Adil_K" simply becomes "adil_k" as it's typed.
 */
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
const USERNAME_RE = /^[a-z][a-z0-9_]{2,19}$/;

const RESERVED = new Set([
  "admin", "administrator", "root", "support", "help", "renyxera", "gate", "system",
  "moderator", "mod", "staff", "official", "api", "null", "undefined", "me", "profile",
]);

/** Lowercases and strips anything outside [a-z0-9_] — used on every keystroke. */
export function normalizeUsername(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, USERNAME_MAX);
}

/** Null when valid, otherwise a short human-readable reason. */
export function usernameProblem(name: string): string | null {
  if (name.length < USERNAME_MIN) return `At least ${USERNAME_MIN} characters.`;
  if (!/^[a-z]/.test(name)) return "Must start with a letter.";
  if (!USERNAME_RE.test(name)) return "Only lowercase letters, numbers and underscores.";
  if (RESERVED.has(name)) return "That username is reserved.";
  return null;
}
