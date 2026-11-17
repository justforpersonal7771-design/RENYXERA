"use client";

/**
 * Study diagram engine: figures are data (lib/study/schema.ts → Fig), drawn here as theme-aware SVG.
 * Graph = resource-allocation / wait-for graphs; strip = step sequences; matrix = Banker's style tables; steps = frames.
 * Colours come from tokens so light and dark both work; the highlighted path uses one accent.
 */
import type { Fig, GraphNode } from "@/lib/study/schema";

const R = 26, RW = 74, RH = 44;

function edgePoint(n: GraphNode, tx: number, ty: number) {
  const dx = tx - n.x, dy = ty - n.y, len = Math.hypot(dx, dy) || 1;
  if (n.kind === "process") return { x: n.x + (dx / len) * (R + 3), y: n.y + (dy / len) * (R + 3) };
  const sx = (RW / 2 + 3) / Math.abs(dx || 1e-6), sy = (RH / 2 + 3) / Math.abs(dy || 1e-6), s = Math.min(sx, sy);
  return { x: n.x + dx * s, y: n.y + dy * s };
}

function Graph({ fig }: { fig: Extract<Fig, { kind: "graph" }> }) {
  const byId = new Map(fig.nodes.map((n) => [n.id, n]));
  return (
    <svg viewBox={`0 0 ${fig.w} ${fig.h}`} className="h-auto w-full max-w-[460px]" role="presentation">
      <defs>
        {(["n", "h"] as const).map((k) => (
          <marker key={k} id={`st-arrow-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={k === "h" ? "var(--st-accent)" : "var(--text-secondary)"} />
          </marker>
        ))}
      </defs>
      {fig.edges.map((e, i) => {
        const a = byId.get(e.from)!, b = byId.get(e.to)!;
        const p = edgePoint(a, b.x, b.y), q = edgePoint(b, a.x, a.y);
        return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={e.hl ? "var(--st-accent)" : "var(--text-secondary)"} strokeWidth={e.hl ? 2.6 : 1.6} strokeDasharray={e.kind === "request" ? "6 4" : undefined} markerEnd={`url(#st-arrow-${e.hl ? "h" : "n"})`} />;
      })}
      {fig.nodes.map((n) => n.kind === "process" ? (
        <g key={n.id}><circle cx={n.x} cy={n.y} r={R} fill="var(--surface)" stroke="var(--text-primary)" strokeWidth="2" />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--text-primary)">{n.label}</text></g>
      ) : (
        <g key={n.id}><rect x={n.x - RW / 2} y={n.y - RH / 2} width={RW} height={RH} rx="6" fill="var(--surface-secondary)" stroke="var(--text-primary)" strokeWidth="2" />
          <text x={n.x - RW / 2 + 8} y={n.y - RH / 2 - 6} fontSize="13" fontWeight="700" fill="var(--text-primary)">{n.label}</text>
          {Array.from({ length: n.instances ?? 1 }, (_, i) => <circle key={i} cx={n.x - (((n.instances ?? 1) - 1) * 16) / 2 + i * 16} cy={n.y} r="5" fill="var(--text-primary)" />)}</g>
      ))}
      {fig.note && <text x={fig.w / 2} y={fig.h - 4} textAnchor="middle" fontSize="12" fill="var(--text-muted)">{fig.note}</text>}
    </svg>
  );
}

function Strip({ fig }: { fig: Extract<Fig, { kind: "strip" }> }) {
  return (
    <ol className="flex flex-wrap items-stretch gap-2">
      {fig.items.map((it, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className={`min-w-[8.5rem] rounded-xl border-2 px-3 py-2 ${it.state === "now" ? "border-[var(--st-accent)] bg-[color-mix(in_srgb,var(--st-accent)_10%,var(--surface))]" : it.state === "bad" ? "border-[var(--danger,#dc2626)]" : "border-[var(--border)] bg-[var(--surface)]"} ${it.state === "todo" ? "opacity-70" : ""}`}>
            <span className="block text-sm font-bold text-[var(--text-primary)]">{it.label}</span>
            {it.sub && <span className="block text-xs text-[var(--text-secondary)]">{it.sub}</span>}
          </span>
          {i < fig.items.length - 1 && <span aria-hidden className="text-[var(--text-muted)]">→</span>}
        </li>
      ))}
    </ol>
  );
}

function Matrix({ fig }: { fig: Extract<Fig, { kind: "matrix" }> }) {
  return (
    <table className="w-full max-w-[460px] border-collapse text-sm tabular-nums">
      <caption className="mb-1 text-left text-xs font-bold text-[var(--text-secondary)]">{fig.title}</caption>
      <thead><tr><th className="border border-[var(--border)] p-1.5" />{fig.cols.map((c) => <th key={c} className="border border-[var(--border)] p-1.5 text-[var(--text-primary)]">{c}</th>)}</tr></thead>
      <tbody>{fig.rows.map((r) => (
        <tr key={r.label} className={r.hl ? "bg-[color-mix(in_srgb,var(--st-accent)_14%,transparent)]" : r.dim ? "opacity-50" : ""}>
          <th className="border border-[var(--border)] p-1.5 text-left text-[var(--text-primary)]">{r.label}</th>
          {r.cells.map((c, i) => <td key={i} className="border border-[var(--border)] p-1.5 text-center text-[var(--text-primary)]">{c}</td>)}
        </tr>
      ))}</tbody>
    </table>
  );
}

export function Diagram({ fig }: { fig: Fig }) {
  if (fig.kind === "graph") return <Graph fig={fig} />;
  if (fig.kind === "strip") return <Strip fig={fig} />;
  if (fig.kind === "matrix") return <Matrix fig={fig} />;
  return <div className="grid gap-4 sm:grid-cols-2">{fig.frames.map((f, i) => <figure key={i}><Diagram fig={f.fig} /><figcaption className="mt-1 text-xs text-[var(--text-secondary)]">{f.caption}</figcaption></figure>)}</div>;
}
