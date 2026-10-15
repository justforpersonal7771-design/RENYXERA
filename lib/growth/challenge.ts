// "Beat my score": a link that carries the exact question set and the score to beat. No server needed.
// The friend takes the same questions in the exam interface and sees how they did against the score.

export type Challenge = { ids: string[]; score: number; max: number; by: string; title: string };

const MAX_IDS = 70;
const clean = (s: string, n: number) => s.replace(/[^\p{L}\p{N} .,'&-]/gu, "").trim().slice(0, n);

// Compact question list: "GATE_CS_2026_FN_Q1".."Q65" becomes "CS_2026_FN.1-65"; groups are joined with "~".
// Ids that do not follow the official pattern are kept as they are.
export function packIds(ids: string[]): string {
  const groups: { p: string; n: number[] }[] = [];
  const loose: string[] = [];
  for (const id of ids) {
    const m = /^GATE_([A-Z0-9_]+)_Q(\d+)$/.exec(id);
    if (!m) { loose.push(id); continue; }
    const last = groups[groups.length - 1];
    if (last && last.p === m[1]) last.n.push(Number(m[2])); else groups.push({ p: m[1], n: [Number(m[2])] });
  }
  const ranges = (n: number[]) => {
    const out: string[] = [];
    for (let i = 0; i < n.length; i++) {
      let j = i;
      while (j + 1 < n.length && n[j + 1] === n[j] + 1) j++;
      out.push(j > i ? `${n[i]}-${n[j]}` : String(n[i]));
      i = j;
    }
    return out.join(".");
  };
  return [...groups.map((g) => `${g.p}.${ranges(g.n)}`), ...loose].join("~");
}

export function unpackIds(q: string): string[] {
  if (q.includes(",")) return q.split(","); // old links
  const out: string[] = [];
  for (const part of q.split("~")) {
    const m = /^([A-Z0-9_]+?)\.([\d.-]+)$/.exec(part);
    if (!m) { out.push(part); continue; }
    for (const r of m[2].split(".")) {
      const [a, b] = r.split("-").map(Number);
      for (let k = a; k <= (b || a) && out.length < 200; k++) out.push(`GATE_${m[1]}_Q${k}`);
    }
  }
  return out;
}

/** Builds a short /challenge link for a finished test. */
export function challengeUrl(origin: string, c: Challenge): string {
  const q = new URLSearchParams({ q: packIds(c.ids.slice(0, MAX_IDS)), s: String(Math.round(c.score * 100) / 100), m: String(Math.round(c.max * 100) / 100) });
  const by = clean(c.by, 30), title = clean(c.title, 60);
  if (by && by !== "A friend") q.set("n", by);
  if (title && title !== "Practice set") q.set("t", title);
  return `${origin}/challenge?${q.toString().replace(/%7E/gi, "~")}`;
}

/** Reads and validates a challenge from the query string; returns null if anything looks wrong. */
export function parseChallenge(params: URLSearchParams): Challenge | null {
  const ids = unpackIds(params.get("q") ?? "").map((x) => x.trim()).filter((x) => /^[A-Za-z0-9_.-]{4,60}$/.test(x)).slice(0, MAX_IDS);
  const score = Number(params.get("s")), max = Number(params.get("m"));
  if (ids.length < 3 || !Number.isFinite(score) || !Number.isFinite(max) || max <= 0 || score > max || score < -max) return null;
  return { ids, score, max, by: clean(params.get("n") ?? "", 30) || "A friend", title: clean(params.get("t") ?? "", 60) || "Practice set" };
}
