"use client";

/**
 * Mermaid diagrams the books use besides flowcharts: sequence diagrams (lifelines and arrows, drawn as SVG) and class diagrams
 * (class cards plus a plain-English list of how they relate). Small, dependency-free parsers; unknown syntax inside a diagram is skipped.
 */
import { useId } from "react";

/* ---------------- sequence ---------------- */
type Part = { id: string; label: string };
type Msg = { from: string; to: string; text: string; dashed: boolean; kind: ">>" | ">" | "x" | ")" };
const SKIP = /^(note|loop|alt|else|opt|par|and|end|rect|activate|deactivate|autonumber|title|critical|break)\b/i;

export function SequenceDiagram({ code }: { code: string }) {
  const uid = useId().replace(/:/g, "");
  const parts: Part[] = []; const msgs: Msg[] = [];
  const ensure = (id: string) => { if (!parts.some((p) => p.id === id)) parts.push({ id, label: id }); };
  for (const raw of code.split("\n").slice(1)) {
    const line = raw.trim();
    if (!line || line.startsWith("%%") || SKIP.test(line)) continue;
    const decl = line.match(/^(?:participant|actor)\s+(\w+)(?:\s+as\s+(.+))?$/);
    if (decl) { const ex = parts.find((p) => p.id === decl[1]); if (ex) ex.label = decl[2] ?? ex.label; else parts.push({ id: decl[1], label: decl[2] ?? decl[1] }); continue; }
    const m = line.match(/^(\w+)\s*(-{1,2})(>>|>|x|\))\s*[+-]?(\w+)\s*:\s*(.*)$/);
    if (m) { ensure(m[1]); ensure(m[4]); msgs.push({ from: m[1], to: m[4], text: m[5], dashed: m[2] === "--", kind: m[3] as Msg["kind"] }); }
  }
  if (!parts.length || !msgs.length) return <pre className="iv-pre"><code>{code}</code></pre>;

  const n = parts.length, colW = Math.max(150, Math.min(210, 880 / n)), W = n * colW, rowH = 46, top = 70, H = top + msgs.length * rowH + 16;
  const cx = (id: string) => colW / 2 + parts.findIndex((p) => p.id === id) * colW;
  const clip = (s: string, k: number) => (s.length > k ? s.slice(0, k - 1) + "…" : s);
  return (
    <figure className="iv-flow !items-stretch overflow-x-auto" aria-label="Sequence diagram">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="mx-auto block max-w-none text-[var(--text-primary)]" role="img" style={{ minWidth: Math.min(W, 520) }}>
        <defs><marker id={`a${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor" /></marker></defs>
        {parts.map((p) => (
          <g key={p.id}>
            <line x1={cx(p.id)} y1={42} x2={cx(p.id)} y2={H - 8} stroke="currentColor" strokeOpacity=".25" strokeDasharray="4 5" />
            <rect x={cx(p.id) - 62} y={6} width={124} height={34} rx={12} fill="var(--tint-sky, #dbeafe)" stroke="currentColor" strokeOpacity=".18" />
            <text x={cx(p.id)} y={28} textAnchor="middle" fontSize="13" fontWeight="800" fill="currentColor">{clip(p.label, 16)}</text>
          </g>))}
        {msgs.map((m, i) => {
          const y = top + i * rowH, x1 = cx(m.from), x2 = cx(m.to), self = m.from === m.to;
          return (
            <g key={i}>
              {self ? (<>
                <path d={`M${x1} ${y} h34 v16 h-34`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray={m.dashed ? "6 4" : undefined} markerEnd={`url(#a${uid})`} />
                <text x={x1 + 42} y={y + 12} fontSize="12" fill="currentColor">{clip(m.text, 38)}</text>
              </>) : (<>
                <line x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth="1.6" strokeDasharray={m.dashed ? "6 4" : undefined} markerEnd={m.kind === "x" ? undefined : `url(#a${uid})`} />
                {m.kind === "x" && <text x={x2} y={y + 4} textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor">×</text>}
                <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="currentColor">{clip(m.text, Math.max(14, Math.floor(Math.abs(x2 - x1) / 6.4)))}</text>
              </>)}
            </g>);
        })}
      </svg>
    </figure>
  );
}

/* ---------------- class ---------------- */
type Cls = { name: string; members: string[] };
type Rel = { a: string; b: string; text: string };
const REL: { re: RegExp; say: (a: string, b: string) => string }[] = [
  { re: /^<\|--$/, say: (a, b) => `${b} extends ${a}` }, { re: /^--\|>$/, say: (a, b) => `${a} extends ${b}` },
  { re: /^<\|\.\.$/, say: (a, b) => `${b} implements ${a}` }, { re: /^\.\.\|>$/, say: (a, b) => `${a} implements ${b}` },
  { re: /^\*--$/, say: (a, b) => `${a} is made of ${b}` }, { re: /^--\*$/, say: (a, b) => `${b} is made of ${a}` },
  { re: /^o--$/, say: (a, b) => `${a} has ${b}` }, { re: /^--o$/, say: (a, b) => `${b} has ${a}` },
  { re: /^-->$/, say: (a, b) => `${a} uses ${b}` }, { re: /^<--$/, say: (a, b) => `${b} uses ${a}` },
  { re: /^\.\.>$/, say: (a, b) => `${a} depends on ${b}` }, { re: /^<\.\.$/, say: (a, b) => `${b} depends on ${a}` },
  { re: /^--$/, say: (a, b) => `${a} is linked to ${b}` }, { re: /^\.\.$/, say: (a, b) => `${a} is loosely linked to ${b}` },
];

export function ClassDiagram({ code }: { code: string }) {
  const classes = new Map<string, Cls>(); const rels: Rel[] = [];
  const get = (name: string) => { if (!classes.has(name)) classes.set(name, { name, members: [] }); return classes.get(name)!; };
  let open: Cls | null = null;
  for (const raw of code.split("\n").slice(1)) {
    const line = raw.trim();
    if (!line || line.startsWith("%%")) continue;
    if (open) { if (line === "}") { open = null; continue; } open.members.push(line); continue; }
    const block = line.match(/^class\s+(\w+)\s*(?:<<[^>]*>>)?\s*\{$/);
    if (block) { open = get(block[1]); continue; }
    const plain = line.match(/^class\s+(\w+)\s*$/);
    if (plain) { get(plain[1]); continue; }
    const member = line.match(/^(\w+)\s*:\s*(.+)$/);
    const rel = line.match(/^(\w+)\s*(?:"[^"]*"\s*)?(<\|--|<\|\.\.|--\|>|\.\.\|>|\*--|--\*|o--|--o|-->|<--|\.\.>|<\.\.|--|\.\.)\s*(?:"[^"]*"\s*)?(\w+)\s*(?::\s*(.*))?$/);
    if (rel) { get(rel[1]); get(rel[3]); const r = REL.find((x) => x.re.test(rel[2])); rels.push({ a: rel[1], b: rel[3], text: (r ? r.say(rel[1], rel[3]) : `${rel[1]} – ${rel[3]}`) + (rel[4] ? ` (${rel[4]})` : "") }); continue; }
    if (member) get(member[1]).members.push(member[2]);
  }
  if (!classes.size) return <pre className="iv-pre"><code>{code}</code></pre>;
  return (
    <figure className="iv-flow !items-stretch" aria-label="Class diagram">
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        {[...classes.values()].map((c) => {
          const fields = c.members.filter((x) => !x.includes("(")), methods = c.members.filter((x) => x.includes("("));
          return (
            <div key={c.name} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] text-left">
              <p className="bg-[var(--tint-sky,#dbeafe)] px-3 py-2 font-display text-[15px] font-extrabold text-[var(--tint-sky-ink,#1e3a8a)]">{c.name}</p>
              {fields.length > 0 && <ul style={{ listStyle: "none" }} className="border-b border-[var(--border)] !px-3 py-1.5 font-mono text-[12.5px]">{fields.map((x, i) => <li key={i}>{x}</li>)}</ul>}
              {methods.length > 0 && <ul style={{ listStyle: "none" }} className="!px-3 py-1.5 font-mono text-[12.5px]">{methods.map((x, i) => <li key={i}>{x}</li>)}</ul>}
              {!fields.length && !methods.length && <p className="px-3 py-1.5 text-xs text-[var(--text-muted)]">no members listed</p>}
            </div>);
        })}
      </div>
      {rels.length > 0 && <ul style={{ listStyle: "none", paddingLeft: 0 }} className="mt-3 flex flex-wrap gap-2">{rels.map((r, i) => <li key={i} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[13px] font-bold text-[var(--text-primary)]">{r.text}</li>)}</ul>}
    </figure>
  );
}
