/**
 * Master figure kinds (diagram engine v2). Every figure is data; components/study/figures/* draw it as theme-aware SVG or HTML.
 * Kinds: memory, array, linked, tree, calltree, heap, stackframe, trace, bits, ring, hashtable, frames.
 * Rule: a figure shows ONE idea; time is shown as `frames`, never as a crowded picture (docs/study-materials/v2/01-MASTER-PROMPT.md).
 */

/** How a part is drawn: hl = the part to look at, ok = new / correct, bad = wrong / lost / error, dim = inactive. */
export type Tone = "hl" | "ok" | "bad" | "dim";
type Val = string | number;

/** Boxes with addresses on the left, names beside them, values inside, and arrows for pointers. */
export type MemoryFig = {
  kind: "memory"; title?: string; note?: string;
  cells: { id?: string; addr: Val; name?: string; value: Val; size?: number; tone?: Tone; ptr?: string }[];
};

/** A row or grid of cells: indexes above, values inside, addresses below (base + index x size), named pointers underneath. */
export type ArrayFig = {
  kind: "array"; title?: string; note?: string;
  data: Val[][]; base?: number; size?: number; colMajor?: boolean; hex?: boolean;
  index?: boolean; rowIndex?: boolean; tones?: Record<string, Tone>; pointers?: { name: string; at: [number, number] }[];
};

/** Singly or doubly linked nodes. `next[i]` is the id of node i's successor (null = NULL); `prev` likewise for doubly linked. */
export type LinkedFig = {
  kind: "linked"; title?: string; note?: string;
  nodes: { id: string; data: Val; next: string | null; prev?: string | null; tone?: Tone }[];
  heads?: { name: string; to: string }[]; doubly?: boolean;
};

export type TreeNode = { label: Val; tone?: Tone; kids?: (TreeNode | null)[]; edge?: string; sub?: Val; ret?: Val };
/** Binary and general trees (a binary node lists [left, right] with null for a missing child). */
export type TreeFig = { kind: "tree"; title?: string; note?: string; root: TreeNode };
/** The tree of calls of a recursive function; `ret` is the value returned on the way back, `order` numbers the calls. */
export type CallTreeFig = { kind: "calltree"; title?: string; note?: string; root: TreeNode; order?: boolean };
/** A heap drawn as a tree and as its array together (values in array order, index 1 = root). */
export type HeapFig = { kind: "heap"; title?: string; note?: string; values: Val[]; zeroBased?: boolean; tones?: Record<number, Tone> };

/** Function-call frames, most recent on top: title bar, then name / value rows. */
export type StackFrameFig = {
  kind: "stackframe"; title?: string; note?: string;
  frames: { title: string; tone?: Tone; rows: { name: string; value: Val; tone?: Tone }[] }[];
};

/** A dry-run table: one row per step; `changed` lists the column numbers whose value changed in that row. */
export type TraceFig = {
  kind: "trace"; title?: string; note?: string; cols: string[];
  rows: { cells: Val[]; changed?: number[]; note?: string; tone?: Tone }[];
};

/** Rows of bits. `bits` is a string of 0/1; weights add place values above; group splits the row (4 = nibbles). */
export type BitsFig = {
  kind: "bits"; title?: string; note?: string; weights?: boolean; group?: number;
  rows: { label: string; bits: string; hl?: number[]; value?: Val; tone?: Tone }[];
};

/** Circular queue: n slots on a ring, front and rear markers. */
export type RingFig = { kind: "ring"; title?: string; note?: string; n: number; items: (Val | null)[]; front?: number; rear?: number };

/** Hash table: slots 0..m-1, key or chain per slot, tombstones, numbered probe order. */
export type HashTableFig = {
  kind: "hashtable"; title?: string; note?: string;
  slots: { key?: Val | null; chain?: Val[]; tombstone?: boolean; tone?: Tone }[]; probes?: number[];
};

/** Frames with Back / Next / Play: one operation changing a structure, one picture per step. `fig` is any figure of this engine. */
export type FramesFig = { kind: "frames"; title?: string; frames: { caption: string; fig: unknown }[]; autoplayMs?: number };

export type FigX = MemoryFig | ArrayFig | LinkedFig | TreeFig | CallTreeFig | HeapFig | StackFrameFig | TraceFig | BitsFig | RingFig | HashTableFig | FramesFig;
export const FIGX_KINDS = ["memory", "array", "linked", "tree", "calltree", "heap", "stackframe", "trace", "bits", "ring", "hashtable", "frames"] as const;
