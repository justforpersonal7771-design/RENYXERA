// "Beat my score": a link that carries the exact question set and the score to beat. No server needed.
// The friend takes the same questions in the exam interface and sees how they did against the score.

export type Challenge = { ids: string[]; score: number; max: number; by: string; title: string };

const MAX_IDS = 70;
const clean = (s: string, n: number) => s.replace(/[^\p{L}\p{N} .,'&-]/gu, "").trim().slice(0, n);

/** Builds /challenge?... for a finished test. Question ids are comma-separated; score and max keep two decimals. */
export function challengeUrl(origin: string, c: Challenge): string {
  const q = new URLSearchParams({ q: c.ids.slice(0, MAX_IDS).join(","), s: String(Math.round(c.score * 100) / 100), m: String(Math.round(c.max * 100) / 100), n: clean(c.by, 30) || "A friend", t: clean(c.title, 60) });
  return `${origin}/challenge?${q.toString()}&utm_source=share&utm_medium=challenge&utm_campaign=beat_my_score`;
}

/** Reads and validates a challenge from the query string; returns null if anything looks wrong. */
export function parseChallenge(params: URLSearchParams): Challenge | null {
  const ids = (params.get("q") ?? "").split(",").map((x) => x.trim()).filter((x) => /^[A-Za-z0-9_.-]{4,60}$/.test(x)).slice(0, MAX_IDS);
  const score = Number(params.get("s")), max = Number(params.get("m"));
  if (ids.length < 3 || !Number.isFinite(score) || !Number.isFinite(max) || max <= 0 || score > max || score < -max) return null;
  return { ids, score, max, by: clean(params.get("n") ?? "", 30) || "A friend", title: clean(params.get("t") ?? "", 60) || "Practice set" };
}
