"use client";

import { useId } from "react";
import type { ArrayFig, BitsFig, HashTableFig, LinkedFig, MemoryFig, RingFig, StackFrameFig, TraceFig } from "@/lib/study/figures";
import { cellAddress, ringPoint } from "@/lib/study/figure-layout";
import { ArrowDefs, FigFrame, INK, MUTED, SUB, fmt, toneStyle } from "./shared";

/* ---------------------------------------------------------------- memory: name | address | box, pointer arrows on the right */
export function Memory({ fig }: { fig: MemoryFig }) {
  const id = useId().replace(/:/g, ""), U = 38, G = 6, boxX = 150, boxW = 132, top = 8;
  const y = (i: number) => top + i * (U + G);
  const keyOf = (c: MemoryFig["cells"][number]) => String(c.id ?? c.addr);
  const idx = new Map(fig.cells.map((c, i) => [keyOf(c), i]));
  const W = boxX + boxW + 96, H = top * 2 + fig.cells.length * (U + G);
  return (
    <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Memory diagram"}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[420px]" role="img" aria-label={fig.title ?? "Memory"}>
        <ArrowDefs id={id} />
        {fig.cells.map((c, i) => {
          const t = c.ptr !== undefined ? idx.get(String(c.ptr)) : undefined;
          const sx = boxX + boxW, sy = y(i) + U / 2;
          return (
            <g key={i}>
              {c.name && <text x={64} y={y(i) + U / 2 + 5} textAnchor="end" fontSize="14" fontWeight="800" fill={INK}>{c.name}</text>}
              <text x={72} y={y(i) + U / 2 + 4} fontSize="11" fill={SUB} fontFamily="ui-monospace,monospace">{c.addr}</text>
              <rect x={boxX} y={y(i)} width={boxW} height={U} rx="6" strokeWidth="1.8" style={toneStyle(c.tone)} />
              <text x={boxX + boxW / 2} y={y(i) + U / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK} fontFamily="ui-monospace,monospace">{String(c.value)}</text>
              {c.size && <text x={boxX + boxW - 6} y={y(i) + 12} textAnchor="end" fontSize="9" fill={MUTED}>{c.size} B</text>}
              {t !== undefined && <path d={`M${sx} ${sy} C${sx + 58} ${sy} ${sx + 58} ${y(t) + U / 2} ${sx + 2} ${y(t) + U / 2}`} fill="none" stroke="var(--st-accent)" strokeWidth="2.2" markerEnd={`url(#${id}-a)`} />}
            </g>
          );
        })}
      </svg>
    </FigFrame>
  );
}

/* ---------------------------------------------------------------- array: indexes above, addresses inside, pointers below */
export function ArrayView({ fig }: { fig: ArrayFig }) {
  const id = useId().replace(/:/g, ""), rows = fig.data.length, cols = Math.max(...fig.data.map((r) => r.length));
  const cw = 52, ch = fig.base !== undefined ? 50 : 38, left = fig.rowIndex ? 34 : 8, top = fig.index ? 24 : 8;
  const ptrs = fig.pointers ?? [], bottom = ptrs.length && rows === 1 ? 14 + (Math.max(...ptrs.map((p) => ptrs.filter((q) => q.at[0] === p.at[0] && q.at[1] === p.at[1]).length)) + 1) * 14 : 8;
  const W = left + cols * cw + 8, H = top + rows * ch + bottom;
  const seen: Record<string, number> = {};
  return (
    <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Array diagram"}>
      <div className="max-w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: Math.max(W, 120) }} className="h-auto max-w-full" role="img" aria-label={fig.title ?? "Array"}>
          <ArrowDefs id={id} />
          {fig.index && Array.from({ length: cols }, (_, c) => <text key={c} x={left + c * cw + cw / 2} y={top - 8} textAnchor="middle" fontSize="11" fill={SUB}>{c}</text>)}
          {fig.rowIndex && fig.data.map((_, r) => <text key={r} x={left - 8} y={top + r * ch + ch / 2 + 4} textAnchor="end" fontSize="11" fill={SUB}>{r}</text>)}
          {fig.data.map((row, r) => row.map((v, c) => (
            <g key={`${r}-${c}`}>
              <rect x={left + c * cw} y={top + r * ch} width={cw} height={ch} strokeWidth="1.6" style={toneStyle(fig.tones?.[`${r},${c}`])} />
              <text x={left + c * cw + cw / 2} y={top + r * ch + (fig.base !== undefined ? 22 : ch / 2 + 5)} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK}>{String(v)}</text>
              {fig.base !== undefined && <text x={left + c * cw + cw / 2} y={top + r * ch + 40} textAnchor="middle" fontSize="10" fill={SUB} fontFamily="ui-monospace,monospace">{fmt(cellAddress(fig.base, fig.size ?? 4, rows, cols, r, c, fig.colMajor), fig.hex)}</text>}
            </g>
          )))}
          {ptrs.map((p, i) => {
            const k = p.at.join(","); const lvl = (seen[k] = (seen[k] ?? 0) + 1);
            const cx = left + p.at[1] * cw + cw / 2, by = top + (p.at[0] + 1) * ch;
            // in a grid the arrow would run into the next row, so the pointer is a small badge in the cell's top corner
            if (rows > 1) { const bw = Math.max(16, p.name.length * 7 + 8); const bx = left + p.at[1] * cw + 3 + (lvl - 1) * (bw + 2), byy = top + p.at[0] * ch + 3; return <g key={i}><rect x={bx} y={byy} width={bw} height="14" rx="7" fill="var(--st-accent)" /><text x={bx + bw / 2} y={byy + 10.5} textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--surface)">{p.name}</text></g>; }
            return <g key={i}><line x1={cx} y1={by + 4 + lvl * 14 - 2} x2={cx} y2={by + 1} stroke="var(--st-accent)" strokeWidth="2" markerEnd={`url(#${id}-a)`} /><text x={cx + 5} y={by + 4 + lvl * 14 + 6} fontSize="12" fontWeight="800" fill="var(--st-accent)">{p.name}</text></g>;
          })}
        </svg>
      </div>
    </FigFrame>
  );
}

/* ---------------------------------------------------------------- linked list: [prev] data [next] boxes, NULL ground, curved back links */
export function Linked({ fig }: { fig: LinkedFig }) {
  const id = useId().replace(/:/g, ""), d = !!fig.doubly;
  const pw = d ? 26 : 0, dw = 44, nx = 30, nw = pw + dw + nx, gap = 46, h = 38, y0 = 54, x0 = d ? 36 : 22;
  const X = (i: number) => x0 + i * (nw + gap);
  const idx = new Map(fig.nodes.map((n, i) => [n.id, i]));
  const W = x0 + fig.nodes.length * (nw + gap) + 8, H = y0 + h + 62;
  const ground = (x: number, yy: number) => <g stroke={INK} strokeWidth="1.6"><line x1={x} y1={yy - 8} x2={x} y2={yy + 8} /><line x1={x + 4} y1={yy - 5} x2={x + 4} y2={yy + 5} /><line x1={x + 8} y1={yy - 2} x2={x + 8} y2={yy + 2} /></g>;
  return (
    <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Linked list"}>
      <div className="max-w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: Math.max(W, 160) }} className="h-auto max-w-full" role="img" aria-label={fig.title ?? "Linked list"}>
          <ArrowDefs id={id} />
          {(fig.heads ?? []).map((hd, k) => { const i = idx.get(hd.to); if (i === undefined) return null; const cx = X(i) + nw / 2 + (k % 2) * 0; return <g key={k}><text x={cx} y={14} textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--st-accent)">{hd.name}</text><line x1={cx} y1={18} x2={cx} y2={y0 - 2} stroke="var(--st-accent)" strokeWidth="2" markerEnd={`url(#${id}-a)`} /></g>; })}
          {fig.nodes.map((n, i) => {
            const x = X(i), t = n.next === null ? null : idx.get(n.next);
            const sx = x + nw - nx / 2, sy = y0 + h / 2;
            return (
              <g key={n.id}>
                <rect x={x} y={y0} width={nw} height={h} rx="5" strokeWidth="1.8" style={toneStyle(n.tone)} />
                {d && <line x1={x + pw} y1={y0} x2={x + pw} y2={y0 + h} stroke={INK} strokeWidth="1.2" />}
                <line x1={x + pw + dw} y1={y0} x2={x + pw + dw} y2={y0 + h} stroke={INK} strokeWidth="1.2" />
                <text x={x + pw + dw / 2} y={y0 + h / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK}>{String(n.data)}</text>
                <circle cx={sx} cy={sy} r="3.5" fill={INK} />
                {n.next === null && <g><line x1={sx} y1={sy} x2={x + nw + 18} y2={sy} stroke={INK} strokeWidth="1.8" />{ground(x + nw + 18, sy)}</g>}
                {t !== null && t !== undefined && t === i + 1 && <line x1={sx} y1={sy} x2={X(t) - 1} y2={sy} stroke={INK} strokeWidth="1.8" markerEnd={`url(#${id}-n)`} />}
                {t !== null && t !== undefined && t !== i + 1 && <path d={`M${sx} ${sy} C${sx + 8} ${y0 + h + 52} ${X(t) + pw + dw / 2} ${y0 + h + 52} ${X(t) + pw + dw / 2} ${y0 + h + 2}`} fill="none" stroke="var(--st-accent)" strokeWidth="2" markerEnd={`url(#${id}-a)`} />}
                {d && (() => { const p = n.prev === undefined ? undefined : n.prev === null ? null : idx.get(n.prev); const px = x + pw / 2;
                  if (p === null) return <g><line x1={px} y1={y0 + h / 2} x2={x - 18} y2={y0 + h / 2} stroke={INK} strokeWidth="1.8" />{ground(x - 18, y0 + h / 2)}</g>;
                  if (p === undefined) return null;
                  return <g><circle cx={px} cy={y0 + h / 2} r="3" fill={INK} />{p === i - 1 ? <line x1={px} y1={y0 + h - 8} x2={X(p) + nw + 1} y2={y0 + h - 8} stroke={INK} strokeWidth="1.4" strokeDasharray="4 3" markerEnd={`url(#${id}-n)`} /> : <path d={`M${px} ${y0 + h / 2} C${px} ${y0 - 36} ${X(p) + nw / 2} ${y0 - 36} ${X(p) + nw / 2} ${y0 - 2}`} fill="none" stroke={INK} strokeDasharray="4 3" strokeWidth="1.4" markerEnd={`url(#${id}-n)`} />}</g>; })()}
              </g>
            );
          })}
        </svg>
      </div>
    </FigFrame>
  );
}

/* ---------------------------------------------------------------- stack frames (HTML): the newest call on top */
export function StackFrames({ fig }: { fig: StackFrameFig }) {
  return (
    <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Call stack"}>
      <div className="flex max-w-[340px] flex-col gap-0" role="img" aria-label={fig.title ?? "Call stack"}>
        <p className="mb-1 text-[11px] font-bold text-[var(--text-muted)]">top of the stack (newest call)</p>
        {fig.frames.map((f, i) => (
          <div key={i} className="overflow-hidden rounded-lg border-2" style={{ ...toneStyle(f.tone), marginTop: i ? -2 : 0 }}>
            <div className="px-2.5 py-1 text-xs font-extrabold" style={{ color: INK, borderBottom: "1.5px solid var(--border)" }}>{f.title}</div>
            {f.rows.map((r, k) => (
              <div key={k} className="flex justify-between gap-3 px-2.5 py-1 text-sm tabular-nums" style={{ color: INK, background: r.tone ? toneStyle(r.tone).background : undefined }}>
                <span className="text-[var(--text-secondary)]">{r.name}</span><b className="font-mono">{String(r.value)}</b>
              </div>
            ))}
          </div>
        ))}
        <p className="mt-1 text-[11px] font-bold text-[var(--text-muted)]">bottom (oldest call)</p>
      </div>
    </FigFrame>
  );
}

/* ---------------------------------------------------------------- trace table (HTML): changed cells are highlighted */
export function Trace({ fig }: { fig: TraceFig }) {
  return (
    <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Trace table"}>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm tabular-nums" style={{ maxWidth: 560 }}>
          <thead><tr><th className="border border-[var(--border)] p-1.5 text-left text-xs text-[var(--text-secondary)]">step</th>{fig.cols.map((c) => <th key={c} className="border border-[var(--border)] p-1.5 font-mono text-xs text-[var(--text-primary)]">{c}</th>)}</tr></thead>
          <tbody>{fig.rows.map((r, i) => (
            <tr key={i} style={r.tone ? { background: toneStyle(r.tone).background } : undefined}>
              <td className="border border-[var(--border)] p-1.5 text-xs text-[var(--text-secondary)]">{i + 1}{r.note ? <span className="ml-1.5">{r.note}</span> : null}</td>
              {r.cells.map((c, k) => <td key={k} className="border border-[var(--border)] p-1.5 text-center font-mono text-[var(--text-primary)]" style={r.changed?.includes(k) ? { background: "color-mix(in srgb, var(--st-accent) 20%, var(--surface))", fontWeight: 800 } : undefined}>{String(c)}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </FigFrame>
  );
}

/* ---------------------------------------------------------------- rows of bits (HTML) */
export function Bits({ fig }: { fig: BitsFig }) {
  const g = fig.group ?? 4;
  return (
    <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Bits"}>
      <div className="flex max-w-full flex-col gap-2 overflow-x-auto" role="img" aria-label={fig.title ?? "Bits"}>
        {fig.rows.map((r, i) => (
          <div key={i} className="flex items-end gap-2">
            <span className="w-16 shrink-0 text-right text-xs font-bold text-[var(--text-secondary)]">{r.label}</span>
            <div className="flex">
              {r.bits.split("").map((b, k) => (
                <span key={k} className="flex flex-col items-center" style={{ marginLeft: k && g && k % g === 0 ? 8 : 0 }}>
                  {fig.weights && <span className="font-mono text-[9px] text-[var(--text-muted)]">{2 ** (r.bits.length - 1 - k)}</span>}
                  <span className="flex h-8 w-6 items-center justify-center border font-mono text-sm font-bold" style={{ ...toneStyle(r.hl?.includes(k) ? "hl" : r.tone), color: INK, borderWidth: 1.5, marginLeft: -1 }}>{b}</span>
                </span>
              ))}
            </div>
            {r.value !== undefined && r.value !== "" && <span className="whitespace-nowrap text-sm font-bold text-[var(--text-primary)]">= {String(r.value)}</span>}
          </div>
        ))}
      </div>
    </FigFrame>
  );
}

/* ---------------------------------------------------------------- circular queue ring */
export function Ring({ fig }: { fig: RingFig }) {
  const id = useId().replace(/:/g, ""), n = fig.n, R = Math.max(64, n * 13), cx = R + 64, cy = R + 78, W = cx * 2, H = cy * 2 - 34;
  return (
    <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Circular queue"}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[340px]" role="img" aria-label={fig.title ?? "Circular queue"}>
        <ArrowDefs id={id} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeWidth="1.2" strokeDasharray="3 4" />
        {Array.from({ length: n }, (_, i) => {
          const p = ringPoint(i, n, R, cx, cy), q = ringPoint(i, n, R - 30, cx, cy), v = fig.items[i];
          return <g key={i}><rect x={p.x - 21} y={p.y - 16} width="42" height="32" rx="6" strokeWidth="1.7" strokeDasharray={v === null || v === undefined ? "4 3" : undefined} style={toneStyle(v === null || v === undefined ? "dim" : i === fig.front && i === fig.rear ? "hl" : undefined)} /><text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK}>{v === null || v === undefined ? "" : String(v)}</text><text x={q.x} y={q.y + 4} textAnchor="middle" fontSize="10" fill={MUTED}>{i}</text></g>;
        })}
        {([["front", fig.front], ["rear", fig.rear]] as const).map(([name, at], k) => {
          if (at === undefined) return null;
          const a = ringPoint(at, n, R + 24 + k * 0, cx, cy), b = ringPoint(at, n, R + 52, cx, cy);
          return <g key={name}><line x1={b.x} y1={b.y} x2={a.x} y2={a.y} stroke="var(--st-accent)" strokeWidth="2" markerEnd={`url(#${id}-a)`} /><text x={b.x} y={b.y + (b.y > cy ? 14 : -6)} textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--st-accent)">{name}</text></g>;
        })}
      </svg>
    </FigFrame>
  );
}

/* ---------------------------------------------------------------- hash table (HTML): slots, chains, tombstones, probe order */
export function HashTable({ fig }: { fig: HashTableFig }) {
  return (
    <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Hash table"}>
      <div className="flex max-w-full flex-col overflow-x-auto" role="img" aria-label={fig.title ?? "Hash table"}>
        {fig.slots.map((s, i) => {
          const probe = fig.probes?.indexOf(i) ?? -1;
          return (
            <div key={i} className="flex items-center gap-2 py-0.5">
              <span className="w-6 text-right font-mono text-xs text-[var(--text-secondary)]">{i}</span>
              <span className="flex h-8 w-16 items-center justify-center border-2 font-mono text-sm font-bold" style={{ ...toneStyle(s.tone ?? (probe >= 0 ? "hl" : s.tombstone ? "dim" : undefined)), color: INK }}>{s.tombstone ? "†" : s.key === null || s.key === undefined ? "" : String(s.key)}</span>
              {probe >= 0 && <span className="rounded-full bg-[var(--st-accent)] px-1.5 text-[10px] font-extrabold text-[var(--surface)]">{probe + 1}</span>}
              {(s.chain ?? []).map((c, k) => <span key={k} className="flex items-center gap-1 text-[var(--text-muted)]">→<span className="flex h-7 min-w-9 items-center justify-center rounded border-2 border-[var(--text-primary)] px-1.5 font-mono text-sm font-bold text-[var(--text-primary)]">{String(c)}</span></span>)}
            </div>
          );
        })}
        <p className="mt-1 text-[11px] text-[var(--text-muted)]">† = deleted slot (tombstone). Numbers show the order the slots were probed.</p>
      </div>
    </FigFrame>
  );
}
