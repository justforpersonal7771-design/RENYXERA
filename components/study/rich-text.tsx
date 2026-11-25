"use client";

/**
 * Text helpers shared by the lesson renderer and the figure players:
 *  - Inline: **bold**, _italic_ and `code` inside running prose (code looks different from the text around it);
 *  - autoCode: finds C statements and expressions in plain text and wraps them in backticks, so older strings need no hand-marking;
 *  - splitCodeQ: lifts a run of C statements out of a question into code lines (never one long run-on line).
 */

const OPS = new Set(["=", "+=", "-=", "*=", "/=", "==", "!=", "<=", ">=", "->"]);
const TYPES = new Set(["int", "char", "float", "double", "void", "long", "short", "unsigned", "NULL", "printf", "scanf", "sizeof", "return"]);
const codeLike = (w: string) => /^\(?[*&]+[A-Za-z_(]/.test(w) || /[A-Za-z_]\w*\(/.test(w) || /[=;]/.test(w) || /\[\w*\]/.test(w) || /\+\+|--/.test(w) || /^\(\*/.test(w) || OPS.has(w) || /^(printf|scanf|sizeof|NULL)[.,:;?]*$/.test(w);

export function autoCode(s: string): string {
  if (s.includes("`") || s.includes("**")) return s;
  const parts = s.split(/(\s+)/);
  const idx: number[] = []; parts.forEach((p, i) => { if (i % 2 === 0 && p) idx.push(i); });
  const mark = new Set<number>();
  idx.forEach((i) => { if (codeLike(parts[i])) mark.add(i); });
  // a call with spaces inside its brackets stays in one piece: "printxy(1, 1)"
  idx.forEach((i, k) => {
    if (!mark.has(i)) return;
    const w = parts[i]; let bal = (w.match(/\(/g) ?? []).length - (w.match(/\)/g) ?? []).length;
    for (let j = k + 1; bal > 0 && j < idx.length && j < k + 8; j++) { mark.add(idx[j]); bal += (parts[idx[j]].match(/\(/g) ?? []).length - (parts[idx[j]].match(/\)/g) ?? []).length; }
    if (bal > 0) return;
  });
  // short bare names next to an operator belong to the statement: "p = &b", "p -> a"
  idx.forEach((i, k) => {
    const w = parts[i]; if (mark.has(i) || !/^[A-Za-z_]\w{0,3}[,;)]?$/.test(w)) return;
    const prev = idx[k - 1], next = idx[k + 1];
    if ((next !== undefined && OPS.has(parts[next])) || (prev !== undefined && OPS.has(parts[prev]))) mark.add(i);
  });
  // arithmetic inside a statement: "c = 20 - 11 = 9": a lone operator between code, and numbers next to an = or such an operator
  for (let pass = 0; pass < 2; pass++) idx.forEach((i, k) => {
    const w = parts[i], prev = idx[k - 1], next = idx[k + 1];
    if (/^[-+/%<>]$/.test(w) && prev !== undefined && next !== undefined && mark.has(prev) && mark.has(next)) mark.add(i);
    else if (/^\d+[.,;)]*$/.test(w) && !mark.has(i) && ((prev !== undefined && (OPS.has(parts[prev]) || (/^[-+/%<>]$/.test(parts[prev]) && mark.has(prev)))) || (next !== undefined && (OPS.has(parts[next]) || (/^[-+/%<>]$/.test(parts[next]) && mark.has(next)))))) mark.add(i);
  });
  // a type word belongs to the code that follows it: "int *p", "int x"
  for (let k = idx.length - 2; k >= 0; k--) { const i = idx[k], nx = idx[k + 1]; if (!mark.has(i) && /^(int|char|float|double|void|long|short|unsigned)$/.test(parts[i]) && (mark.has(nx) || /^[A-Za-z_]w*[,;]?$/.test(parts[nx]) && /[;=,]/.test(parts[nx] + (parts[idx[k + 2]] ?? "")))) mark.add(i); }
  // a bare name straight after a type word is a declaration: "int x"
  idx.forEach((i, k) => { const prev = idx[k - 1]; if (!mark.has(i) && prev !== undefined && mark.has(prev) && /^(int|char|float|double|void)$/.test(parts[prev]) && /^[A-Za-z_]\w*[,;]?$/.test(parts[i])) mark.add(i); });
  let out = "", run: string[] = [];
  const flush = () => {
    if (!run.length) return;
    const text = run.join(""); const m = /[.,:?]+$/.exec(text); const tail = m ? m[0] : "";
    out += "`" + text.slice(0, text.length - tail.length) + "`" + tail; run = [];
  };
  for (let a = 0; a < parts.length; a++) {
    const p = parts[a];
    if (a % 2 === 0 && mark.has(a)) { run.push(p); if (/[:?]$/.test(p)) flush(); continue; }
    if (a % 2 === 1 && run.length && mark.has(a + 1)) { run.push(p); continue; }
    flush(); out += p;
  }
  flush();
  return out;
}

export function Inline({ s }: { s: string }) {
  return <>{s.split(/(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g).map((p, i) => p.startsWith("**") ? <b key={i} className="font-bold text-[var(--text-primary)]">{p.slice(2, -2)}</b> : p.startsWith("_") && p.endsWith("_") && p.length > 2 ? <i key={i}>{p.slice(1, -1)}</i> : p.startsWith("`") ? <code key={i} className="rounded-md border border-[var(--border)] bg-[var(--surface-secondary)] px-1.5 py-0.5 font-mono text-[0.88em] font-medium text-[var(--st-accent,var(--text-primary))] [overflow-wrap:anywhere] [hyphens:none]">{p.slice(1, -1)}</code> : <span key={i}>{p}</span>)}</>;
}
/** Plain text with C statements picked out and styled as code. */
export function Rich({ s }: { s: string }) { return <Inline s={autoCode(s)} />; }

/** C statements on one line, laid out one per line with the braces indented. */
export function formatC(src: string): string {
  let depth = 0; const lines: string[] = []; let cur = "";
  const push = () => { const t = cur.trim(); if (t) lines.push("    ".repeat(Math.max(0, depth)) + t); cur = ""; };
  let paren = 0;
  for (const ch of src) {
    if (ch === "(") paren++; if (ch === ")") paren--;
    if (ch === "{") { cur = cur.trimEnd() + " {"; push(); depth++; continue; }
    if (ch === "}") { push(); depth--; cur = "}"; push(); continue; }
    cur += ch;
    if (ch === ";" && paren <= 0) push();
  }
  push();
  return lines.join("\n");
}
/** Splits "words, then C code, then words" into its parts when the code is long enough to deserve its own block. */
export function splitCodeQ(q: string): { before: string; code: string; after: string } | null {
  if (q.includes("`")) return null;
  const m = /\b(int|char|float|double|void)\b/.exec(q); if (!m) return null;
  const end = Math.max(q.lastIndexOf(";"), q.lastIndexOf("}")); if (end < m.index) return null;
  const code = q.slice(m.index, end + 1).replace(/\s{2,}/g, " ").trim();
  if (code.length < 32) return null;
  return { before: q.slice(0, m.index).trim(), code: formatC(code), after: q.slice(end + 1).trim() };
}
