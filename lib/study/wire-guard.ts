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
