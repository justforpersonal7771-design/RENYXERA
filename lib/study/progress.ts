/** Reading progress kept on this device: which topics have been read (seen for a moment on screen), per chapter page. */
const KEY = "renyxera.study.seen";
type Seen = Record<string, { ch: string; at: number }>;

export function readSeen(): Seen {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Seen; } catch { return {}; }
}
export function markSeen(topicId: string, chapterHref: string) {
  try { const s = readSeen(); if (s[topicId]) return; s[topicId] = { ch: chapterHref, at: Date.now() }; localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage off */ }
}
export function highlightCount(): number {
  try { let n = 0; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i) ?? ""; if (k.startsWith("renyxera.study.hl")) { const v = JSON.parse(localStorage.getItem(k) ?? "[]"); n += Array.isArray(v) ? v.length : 0; } } return n; } catch { return 0; }
}
