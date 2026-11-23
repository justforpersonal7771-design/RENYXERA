/**
 * Lesson payloads are not sent as readable JSON. The server scrambles each response with a one-off nonce and the page unscrambles it,
 * so lesson text does not appear in the Network tab, in a "search all files" over saved responses, or in a pasted API URL.
 * Honest scope: this is a speed bump for casual copying and for scrapers that expect JSON, NOT encryption: the page has to be able
 * to read the text, so a determined person with DevTools can still read it. The real protection is the entitlement check on the
 * server, the per-user request limit, the visible watermark and the licence terms (see components/study/content-guard.tsx).
 */
const SALT = "rx.study.v1";

function stream(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  let x = h >>> 0 || 0x9e3779b9;
  return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x & 255; };
}
const toB64 = (b: Uint8Array) => { let s = ""; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode(...b.subarray(i, i + 8192)); return btoa(s); };
const fromB64 = (s: string) => { const bin = atob(s); const b = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i); return b; };

export function encodeWire(json: string, nonce: string, href: string): string {
  const rnd = stream(`${SALT}|${nonce}|${href}`); const b = new TextEncoder().encode(json);
  for (let i = 0; i < b.length; i++) b[i] ^= rnd();
  return toB64(b);
}
export function decodeWire(data: string, nonce: string, href: string): string {
  const rnd = stream(`${SALT}|${nonce}|${href}`); const b = fromB64(data);
  for (let i = 0; i < b.length; i++) b[i] ^= rnd();
  return new TextDecoder().decode(b);
}
export type Scrambled = { v: 1; n: string; d: string };

/**
 * Invisible per-account fingerprint (owner, 23 Nov 2026: no visible watermark while studying).
 * The server writes a short code of the reader's account into long prose strings as zero-width characters (U+200B = 0, U+200C = 1,
 * fenced by U+2060). Nothing shows on screen and reading, highlights and notes are untouched; text lifted from the page, the DOM or a
 * saved response still carries the code, so a leaked copy can be traced to an account with `readStamp`. A screenshot or a retyped copy
 * does not carry it: that limit is real, and the terms of use cover it.
 */
const ZERO = "​", ONE = "‌", FENCE = "⁠";
const PROSE_TEXT = new Set(["hook", "definition", "shortcut", "gate"]);
export function stampFor(userId: string): string {
  let h = 2166136261; const s = `rx.stamp|${userId}`;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  const bits = (h >>> 0).toString(2).padStart(32, "0");
  return FENCE + [...bits].map((b) => (b === "1" ? ONE : ZERO)).join("") + FENCE;
}
export function readStamp(text: string): string | null {
  const m = text.match(/⁠([​‌]{32})⁠/); if (!m) return null;
  return parseInt([...m[1]].map((c) => (c === ONE ? "1" : "0")).join(""), 2).toString(16).padStart(8, "0");
}
const put = (t: string, mark: string) => { if (t.length < 60) return t; const i = t.indexOf(" ", 12); return i < 0 ? t : t.slice(0, i) + mark + t.slice(i); };
/** Walks lesson blocks and stamps prose only (never ids, labels, answers or lab data, which are compared by value). */
export function stampBlocks<T>(node: T, mark: string): T {
  if (Array.isArray(node)) return node.map((x) => stampBlocks(x, mark)) as unknown as T;
  if (node && typeof node === "object") {
    const o = node as Record<string, unknown>, out: Record<string, unknown> = {};
    const prose = typeof o.type === "string" && PROSE_TEXT.has(o.type);
    for (const k of Object.keys(o)) {
      const v = o[k];
      out[k] = k === "paras" && Array.isArray(v) ? v.map((x) => (typeof x === "string" ? put(x, mark) : x))
        : k === "text" && prose && typeof v === "string" ? put(v, mark) : stampBlocks(v, mark);
    }
    return out as T;
  }
  return node;
}
