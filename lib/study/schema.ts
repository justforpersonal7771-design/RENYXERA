/**
 * Study lesson format (docs/study-materials/BLUEPRINT-FINAL.md §1). A chapter is data: topics made of typed blocks,
 * figures as data that the diagram engine draws (never images). validateChapter() enforces the blueprint's minimums
 * so a thin topic cannot ship.
 */

import type { FigX } from "./figures";

export type GraphNode = { id: string; label: string; kind: "process" | "resource"; x: number; y: number; instances?: number };
export type GraphEdge = { from: string; to: string; kind: "request" | "assign" | "wait"; hl?: boolean };
export type Fig =
  | { kind: "graph"; w: number; h: number; nodes: GraphNode[]; edges: GraphEdge[]; note?: string }
  | { kind: "net"; w: number; h: number; nodes: { id: string; label: string; x: number; y: number; hl?: boolean }[]; edges: { a: string; b: string; label?: string; hl?: boolean; dir?: boolean }[]; note?: string }
  | { kind: "matrix"; title: string; cols: string[]; rows: { label: string; cells: (number | string)[]; hl?: boolean; dim?: boolean }[] }
  | { kind: "steps"; frames: { caption: string; fig: Fig }[] }
  | { kind: "strip"; items: { label: string; sub?: string; state: "done" | "now" | "todo" | "bad" }[] }
  | FigX; // master figure kinds: memory, array, linked, tree, calltree, heap, stackframe, trace, bits, ring, hashtable, frames

/** A worked example inside a trap: small code (with what it prints) and/or a sentence of numbers, so the mistake is seen, not just described. */
export type TrapEx = { code?: string; out?: string; text?: string };
export type Block =
  | { type: "hook"; text: string }
  | { type: "objectives"; items: string[] }
  | { type: "intuition"; paras: string[]; analogyLimit?: string }
  | { type: "definition"; name: string; text: string; items?: string[] }
  | { type: "deep"; sections: { h: string; paras: string[]; points?: string[] }[] }
  | { type: "walkthrough"; steps: string[]; prompt?: { q: string; a: string } }
  | { type: "figure"; id: string; fig: Fig; caption: string; alt: string; for?: string }
  | { type: "example"; id: string; level: "gate" | "edge" | "easy"; title: string; given: string; file?: string; find: string; steps: { say: string; result?: string }[]; answer: string; check?: string }
  | { type: "faded"; title: string; given: string; steps: { say: string; blank?: boolean; answer?: string }[] }
  | { type: "trap"; wrong: string; tempting: string; whyWrong: string; rule: string; ex?: TrapEx }
  | { type: "shortcut"; text: string; validWhen: string }
  | { type: "gate"; text: string }
  | { type: "recall"; cards: { q: string; a: string }[] }
  | { type: "check"; questions: CheckQ[] }
  | { type: "links"; prereq?: string[]; usedIn?: string[]; cross?: string[] }
  | { type: "lab"; lab: "toc-dfa" | "toc-nfa" | "toc-regex" | "toc-min" | "toc-product" | "toc-pump" | "toc-classify" | "toc-cfg" | "toc-cyk" | "toc-pda" | "toc-cfpump" | "toc-cfclass" | "toc-tm" | "toc-recre" | "toc-diag" | "toc-rice" | "toc-decide" | "coa-cachegeo" | "coa-cachesim" | "coa-amat" | "rag" | "prevent" | "banker" | "detect" | "count" | "starve" | "states" | "fork" | "threads" | "syscall" | "sched" | "sched-prio" | "race" | "semaphore" | "buffer" | "fit" | "paging" | "tlb" | "replace" | "disk" | "alloc" | "encap" | "delay" | "crc" | "window" | "mac" | "subnet" | "frag" | "route" | "seq" | "cwnd" | "http" | "ports" | "sched-hrrn" | "mlfq" | "pipe" | "segment" | "truth" | "equiv" | "quant" | "fol" | "relation" | "funcs" | "hasse" | "lattice" | "algebra" | "cyclic" | "graph-basic" | "colour" | "count-dm" | "derange" | "recur" | "genfun" | "rr" | "pagefault" | "workingset" | "argument" | "complete" | "translate" | "setalg" | "compose" | "boolean" | "cosets" | "spanning" | "planar" | "hall" | "iso" | "pigeon" | "pascal" | "master" | "er-map" | "er-extra" | "keys" | "fk" | "ra" | "trc" | "sql" | "sql-nested" | "fd" | "nf" | "index-calc" | "btree" | "serial" | "recover" | "2pl" | "ts" | "eer" | "outer" | "group" | "nulls" | "decomp" | "mvd" | "hash" | "log" | "mgl" | "validate" | "ctxswitch" | "zombie" | "rt" | "pv" | "monitor" | "rw" | "dine" | "ptsize" | "buddy" | "clock" | "cow" | "fslinks" | "freespace" | "disktime" | "raid" | "dma" | "perf" | "hamming" | "bridge" | "csmaca" | "nat" | "ipv6" | "classful" | "rwnd" | "rto" | "checksum" | "dns" | "base64" | "webcache" | "ctypes" | "loop" | "ptr" | "params" | "struct" | "rectrace" | "calls" | "hanoi" | "addr" | "tri" | "bsearch" | "stackperm" | "postfix" | "cqueue" | "twostack" | "llist" | "josephus" | "floyd" | "treeprops" | "traverse" | "bst" | "avl" | "heap" | "heapsort" | "dary" | "graphrep" | "bfsdfs" | "graphops" | "growth" | "rtree" | "mastert" | "elemsort" | "merge" | "quick" | "sortcmp" | "radix" | "chain" | "openaddr" | "probes" | "maxmin" | "mult" | "select" | "activity" | "fracknap" | "huffman" | "lcs" | "knap01" | "mcm" | "coins" | "bipartite" | "topo" | "scc" | "kruskal" | "prim" | "mstcount" | "dijkstra" | "bellman" | "fw" | "isa-opcode" | "isa-modes" | "isa-stack" | "alu" | "cycles" | "micro" | "pipe-timing" | "pipe-hazard" | "pipe-cpi" | "mem-design" | "mem-interleave" | "mem-disk" | "mem-hamming" | "io-compare" | "io-daisy" | "io-dma" | "io-bus" }
  | { type: "practice"; links: { label: string; sub: string; href: string }[] };

export type CheckQ = { id: string; kind: "MCQ" | "MSQ" | "NAT"; marks: 1 | 2; q: string; options?: string[]; answer: string; solution: string };

/** `locked`: sent by the server instead of the topic's content when the viewer cannot open it (title only, no blocks). */
/** `deferred`: the viewer may read it, but the page HTML does not carry it; the browser fetches it from /api/study/chapter (lib/study/serve.ts). */
/**
 * TEXTBOOK LAYOUT (25 Nov 2026). A topic with `book` is read as a book section, not as cards: numbered headings, running prose,
 * figures set beside the text with numbered captions, boxed callouts (key idea, trap, note, try it) at the place they belong, worked
 * examples inline, then exercises. Figures and examples are still declared in `blocks` (by id) and placed here with fig/ex nodes.
 * Prose supports **bold** and `code`. Written to the standard in docs/study-materials/v2/BOOK-STYLE.md.
 */
export type BookNode =
  | { t: "h2" | "h3" | "h4" | "h5"; text: string } // numbered automatically: 10.1, 10.1.1, 10.1.1.1, 10.1.1.1.1
  | { t: "p"; text: string }
  | { t: "walk" }
  | { t: "trap" | "gate" | "shortcut" | "faded"; i?: number } // places the i-th trap block (or the single gate / shortcut / faded block) as a card here
  | { t: "ul" | "ol"; items: string[] }
  | { t: "code"; text: string; out?: string; file?: string }
  | { t: "fig"; id: string }
  | { t: "ex"; id: string }
  | { t: "callout"; kind: "key" | "note" | "trap" | "remember" | "try" | "gate" | "warning" | "tip" | "shortcut" | "variation"; title?: string; text: string }
  | { t: "table"; head: string[]; rows: string[][]; caption?: string }
  | { t: "lab"; lab: "ptr" };
/** `no`: the chapter number used in headings and figure captions, e.g. "10" gives 10.1, 10.2 and Figure 10.1. */
export type Topic = { id: string; title: string; words?: number; blocks: Block[]; locked?: boolean; deferred?: boolean; book?: BookNode[]; no?: string };
export type Chapter = { id: string; subject: string; title: string; syllabus: string[]; pyqTopic: RegExp; map: Fig; topics: Topic[] };
/** A chapter as it travels from the server to the browser (a RegExp is not serialisable). */
export type WireChapter = Omit<Chapter, "pyqTopic"> & { pyqTopic: { source: string; flags: string } };
export const toWire = (c: Chapter): WireChapter => ({ ...c, pyqTopic: { source: c.pyqTopic.source, flags: c.pyqTopic.flags } });
export const fromWire = (c: WireChapter): Chapter => ({ ...c, pyqTopic: new RegExp(c.pyqTopic.source, c.pyqTopic.flags) });

/** Blueprint minimums per topic. Returns the problems; an empty list means the topic may ship. */
export function validateTopic(t: Topic): string[] {
  const n = (type: Block["type"]) => t.blocks.filter((b) => b.type === type).length;
  const out: string[] = [];
  if (t.book) {
    // textbook topics: the prose is the lesson; figures, examples, exercises and recall are placed by the book nodes
    const heads = t.book.filter((x) => x.t === "h2").length, paras = t.book.filter((x) => x.t === "p").length;
    if (heads < 6) out.push(`${t.id}: a book topic needs at least 6 section headings (has ${heads})`);
    if (paras < 20) out.push(`${t.id}: a book topic needs at least 20 paragraphs of prose (has ${paras})`);
    const ids = new Set(t.blocks.map((b) => ("id" in b ? (b as { id: string }).id : "")));
    t.book.forEach((x) => { if ((x.t === "fig" || x.t === "ex") && !ids.has(x.id)) out.push(`${t.id}: book node refers to missing ${x.t} "${x.id}"`); });
    if (n("figure") < 2) out.push(`${t.id}: needs at least 2 figures (has ${n("figure")})`);
    if (n("example") < 2) out.push(`${t.id}: needs at least 2 worked examples (has ${n("example")})`);
    if (!t.book.some((x) => x.t === "trap" || (x.t === "callout" && x.kind === "trap"))) out.push(`${t.id}: needs at least one trap callout`);
    const bq = t.blocks.flatMap((b) => (b.type === "check" ? b.questions : []));
    if (bq.length < 4) out.push(`${t.id}: needs 4+ check questions (has ${bq.length})`);
    if (!bq.some((q) => q.kind !== "MCQ")) out.push(`${t.id}: needs an MSQ or NAT check question`);
    if (!bq.some((q) => q.marks === 2)) out.push(`${t.id}: needs a 2-mark check question`);
    if (!n("recall")) out.push(`${t.id}: missing recall cards`);
    return out;
  }
  const order: Block["type"][] = ["hook", "objectives", "intuition", "definition", "walkthrough"];
  order.forEach((k) => { if (!n(k)) out.push(`${t.id}: missing ${k}`); });
  if (n("figure") < 2) out.push(`${t.id}: needs at least 2 figures (has ${n("figure")})`);
  if (n("example") < 2) out.push(`${t.id}: needs at least 2 worked examples (has ${n("example")})`);
  if (n("trap") < 2) out.push(`${t.id}: needs at least 2 traps (has ${n("trap")})`);
  const qs = t.blocks.flatMap((b) => (b.type === "check" ? b.questions : []));
  if (qs.length < 4) out.push(`${t.id}: needs 4+ check questions (has ${qs.length})`);
  if (!qs.some((q) => q.kind !== "MCQ")) out.push(`${t.id}: needs an MSQ or NAT check question`);
  if (!qs.some((q) => q.marks === 2)) out.push(`${t.id}: needs a 2-mark check question`);
  if (!n("recall")) out.push(`${t.id}: missing recall cards`);
  return out;
}
