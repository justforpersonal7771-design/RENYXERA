/** Pure layout maths for the master figures (no React), so scripts/figures-check.ts can test it without a browser. */
import type { TreeNode } from "./figures";

export type Placed = { node: TreeNode; x: number; y: number; depth: number; parent: number; slot: number; order: number };

/**
 * Tidy tree placement. A binary tree (every node has at most two child slots) is placed by in-order position, so a lone left
 * child leans left and a lone right child leans right, exactly as a BST drawing should. A general tree puts each parent over
 * the mean of its children. Returns nodes in pre-order (the call order for a call tree) and the drawing size.
 */
export function layoutTree(root: TreeNode, dx = 44, dy = 64, pad = 26): { nodes: Placed[]; w: number; h: number } {
  const binary = (n: TreeNode | null | undefined): boolean => !n || ((n.kids?.length ?? 0) <= 2 && (n.kids ?? []).every(binary));
  const isBin = binary(root);
  const nodes: Placed[] = [];
  let counter = 0, maxDepth = 0;
  const walk = (n: TreeNode, depth: number, parent: number, slot: number): { idx: number; x: number } => {
    const idx = nodes.length;
    nodes.push({ node: n, x: 0, y: pad + depth * dy, depth, parent, slot, order: idx + 1 });
    maxDepth = Math.max(maxDepth, depth);
    const kids = n.kids ?? [];
    if (isBin) {
      const l = kids[0] ? walk(kids[0], depth + 1, idx, 0) : null;
      const x = counter++ * dx;
      nodes[idx].x = x;
      if (kids[1]) walk(kids[1], depth + 1, idx, 1);
      void l;
      return { idx, x };
    }
    const xs: number[] = [];
    kids.forEach((k, i) => { if (k) xs.push(walk(k, depth + 1, idx, i).x); });
    const x = xs.length ? (xs[0] + xs[xs.length - 1]) / 2 : counter++ * dx;
    nodes[idx].x = x;
    return { idx, x };
  };
  walk(root, 0, -1, 0);
  const minX = Math.min(...nodes.map((p) => p.x));
  nodes.forEach((p) => { p.x = p.x - minX + pad; });
  const w = Math.max(...nodes.map((p) => p.x)) + pad;
  return { nodes, w, h: pad * 2 + maxDepth * dy };
}

/** Address of element (r, c) of a grid stored row-major (default) or column-major. */
export function cellAddress(base: number, size: number, rows: number, cols: number, r: number, c: number, colMajor = false): number {
  return base + (colMajor ? c * rows + r : r * cols + c) * size;
}

/** Position of slot i of n on a ring (clockwise from the top). */
export function ringPoint(i: number, n: number, radius: number, cx: number, cy: number): { x: number; y: number } {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
}

/** Number of elements in a circular queue of n slots, front and rear as indexes, when `rear` is the last filled slot. */
export function ringCount(n: number, front: number, rear: number): number {
  return ((rear - front + n) % n) + 1;
}

/** A heap array as a tree (index 1 = root unless zeroBased). */
export function heapToTree(values: (string | number)[], tones: Record<number, "hl" | "ok" | "bad" | "dim"> = {}, zeroBased = false): TreeNode | null {
  const off = zeroBased ? 0 : 1;
  const build = (i: number): TreeNode | null => {
    const k = i - off;
    if (k < 0 || k >= values.length) return null;
    const l = build(2 * i + (zeroBased ? 1 : 0)), r = build(2 * i + (zeroBased ? 2 : 1));
    return { label: values[k], tone: tones[i], kids: l || r ? [l, r] : undefined, sub: i };
  };
  return build(zeroBased ? 0 : 1);
}
