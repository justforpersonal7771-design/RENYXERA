"use client";

import { useId, useMemo } from "react";
import type { CallTreeFig, HeapFig, TreeFig, TreeNode } from "@/lib/study/figures";
import { heapToTree, layoutTree } from "@/lib/study/figure-layout";
import { ArrowDefs, FigFrame, INK, MUTED, SUB, toneStyle } from "./shared";

/** One drawing for trees and call trees: circles for trees, rounded labels for calls (with the returned value and call number). */
function TreeSvg({ root, calls, order, label }: { root: TreeNode; calls?: boolean; order?: boolean; label: string }) {
  const id = useId().replace(/:/g, "");
  const { nodes, w, h } = useMemo(() => layoutTree(root, calls ? 74 : 44, calls ? 70 : 62, calls ? 58 : 26), [root, calls]);
  const hw = (n: TreeNode) => (calls ? Math.max(40, String(n.label).length * 7.4 + 16) / 2 : 16);
  return (
    <div className="max-w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w + (calls ? 24 : 0)} ${h + (calls ? 22 : 18)}`} style={{ width: Math.max(w + (calls ? 24 : 0), 140) }} className={calls ? "h-auto max-w-none" : "h-auto max-w-full"} role="img" aria-label={label}>
        <ArrowDefs id={id} />
        {nodes.map((p, i) => {
          if (p.parent < 0) return null;
          const q = nodes[p.parent], hh = calls ? 15 : 16;
          return (
            <g key={`e${i}`}>
              <line x1={q.x} y1={q.y + hh} x2={p.x} y2={p.y - hh - (calls ? 1 : 0)} stroke={p.node.tone === "hl" ? "var(--st-accent)" : INK} strokeWidth={p.node.tone === "hl" ? 2.4 : 1.5} markerEnd={calls ? `url(#${id}-${p.node.tone === "hl" ? "a" : "n"})` : undefined} />
              {p.node.edge && <text x={(q.x + p.x) / 2 + (p.x >= q.x ? 6 : -6)} y={(q.y + p.y) / 2 + 3} textAnchor={p.x >= q.x ? "start" : "end"} fontSize="11" fontWeight="800" fill={SUB}>{p.node.edge}</text>}
            </g>
          );
        })}
        {nodes.map((p, i) => (
          <g key={`n${i}`}>
            {calls
              ? <rect x={p.x - hw(p.node)} y={p.y - 15} width={hw(p.node) * 2} height="30" rx="15" strokeWidth="1.7" style={toneStyle(p.node.tone)} />
              : <circle cx={p.x} cy={p.y} r="16" strokeWidth="1.8" style={toneStyle(p.node.tone)} />}
            <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize={calls ? 12 : String(p.node.label).length > 3 ? 11 : 14} fontWeight="800" fill={INK} fontFamily={calls ? "ui-monospace,monospace" : undefined}>{String(p.node.label)}</text>
            {p.node.sub !== undefined && <text x={p.x} y={p.y + 29} textAnchor="middle" fontSize="10" fill={MUTED}>{String(p.node.sub)}</text>}
            {calls && p.node.ret !== undefined && <text x={p.x + hw(p.node) + 4} y={p.y + 25} fontSize="12" fontWeight="800" fill="var(--st-accent)">↩ {String(p.node.ret)}</text>}
            {calls && order && <text x={p.x - hw(p.node) - 2} y={p.y - 14} textAnchor="end" fontSize="10" fontWeight="800" fill={SUB}>#{p.order}</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function Tree({ fig }: { fig: TreeFig }) {
  return <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Tree"}><TreeSvg root={fig.root} label={fig.title ?? "Tree"} /></FigFrame>;
}

export function CallTree({ fig }: { fig: CallTreeFig }) {
  return <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Call tree"}><TreeSvg root={fig.root} calls order={fig.order} label={fig.title ?? "Call tree"} /></FigFrame>;
}

/** A heap as a tree and as its array, side by side in one figure: the same tones on both. */
export function Heap({ fig }: { fig: HeapFig }) {
  const root = useMemo(() => heapToTree(fig.values, fig.tones, fig.zeroBased), [fig.values, fig.tones, fig.zeroBased]);
  const off = fig.zeroBased ? 0 : 1;
  return (
    <FigFrame title={fig.title} note={fig.note} label={fig.title ?? "Heap"}>
      {root && <TreeSvg root={root} label={fig.title ?? "Heap as a tree"} />}
      <div className="mt-2 max-w-full overflow-x-auto" role="img" aria-label="The same heap as an array">
        <div className="flex">
          {fig.values.map((v, k) => (
            <span key={k} className="flex flex-col items-center" style={{ marginLeft: -1 }}>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">{k + off}</span>
              <span className="flex h-9 min-w-10 items-center justify-center border-2 px-1.5 font-mono text-sm font-bold" style={{ ...toneStyle(fig.tones?.[k + off]), color: INK }}>{String(v)}</span>
            </span>
          ))}
        </div>
        <p className="mt-1 text-[11px] text-[var(--text-muted)]">parent of i is ⌊i/2⌋, children are 2i and 2i+1{fig.zeroBased ? " (shown with indexes starting at 0: children 2i+1 and 2i+2)" : ""}</p>
      </div>
    </FigFrame>
  );
}
