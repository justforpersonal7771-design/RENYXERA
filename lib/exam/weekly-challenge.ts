/**
 * Weekly Challenge (5E): the same 10 past-paper questions for everyone in a given week
 * (Monday–Sunday, IST), ranked on its own leaderboard. The set is derived from the week
 * key alone, so the browser and the server compute the identical list — the server rejects
 * a "challenge" attempt whose questions don't match.
 */
export const CHALLENGE_SIZE = 10;
export const CHALLENGE_PREFIX = "Weekly Challenge ";

/** "2026-W40" for the IST week containing `d`. */
export function challengeWeekKey(d = new Date()): string {
  const ist = new Date(d.getTime() + 5.5 * 3600_000);
  const day = (ist.getUTCDay() + 6) % 7; // Monday = 0
  const thursday = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() - day + 3));
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  const week = 1 + Math.floor((thursday.getTime() - yearStart.getTime()) / (7 * 86400_000));
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export const challengeTitle = (key = challengeWeekKey()) => `${CHALLENGE_PREFIX}${key}`;

/** Deterministic pick: sort ids, seeded shuffle, first CHALLENGE_SIZE. */
export function challengeQuestionIds(allIds: string[], key = challengeWeekKey()): string[] {
  let h = 2166136261;
  for (const ch of `renyxera-challenge:${key}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a = [...new Set(allIds.filter((id) => /^GATE_/.test(id)))].sort();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, CHALLENGE_SIZE);
}
