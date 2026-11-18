/**
 * Study lesson format (docs/study-materials/BLUEPRINT-FINAL.md §1). A chapter is data: topics made of typed blocks,
 * figures as data that the diagram engine draws (never images). validateChapter() enforces the blueprint's minimums
 * so a thin topic cannot ship.
 */

export type GraphNode = { id: string; label: string; kind: "process" | "resource"; x: number; y: number; instances?: number };
export type GraphEdge = { from: string; to: string; kind: "request" | "assign" | "wait"; hl?: boolean };
export type Fig =
  | { kind: "graph"; w: number; h: number; nodes: GraphNode[]; edges: GraphEdge[]; note?: string }
  | { kind: "matrix"; title: string; cols: string[]; rows: { label: string; cells: (number | string)[]; hl?: boolean; dim?: boolean }[] }
  | { kind: "steps"; frames: { caption: string; fig: Fig }[] }
  | { kind: "strip"; items: { label: string; sub?: string; state: "done" | "now" | "todo" | "bad" }[] };

export type Block =
  | { type: "hook"; text: string }
  | { type: "objectives"; items: string[] }
  | { type: "intuition"; paras: string[]; analogyLimit?: string }
  | { type: "definition"; name: string; text: string; items?: string[] }
  | { type: "deep"; sections: { h: string; paras: string[]; points?: string[] }[] }
  | { type: "walkthrough"; steps: string[]; prompt?: { q: string; a: string } }
  | { type: "figure"; id: string; fig: Fig; caption: string; alt: string; for?: string }
  | { type: "example"; id: string; level: "gate" | "edge" | "easy"; title: string; given: string; find: string; steps: { say: string; result?: string }[]; answer: string; check?: string }
  | { type: "faded"; title: string; given: string; steps: { say: string; blank?: boolean; answer?: string }[] }
  | { type: "trap"; wrong: string; tempting: string; whyWrong: string; rule: string }
  | { type: "shortcut"; text: string; validWhen: string }
  | { type: "gate"; text: string }
  | { type: "recall"; cards: { q: string; a: string }[] }
  | { type: "check"; questions: CheckQ[] }
  | { type: "links"; prereq?: string[]; usedIn?: string[]; cross?: string[] }
  | { type: "lab"; lab: "rag" | "prevent" | "banker" | "detect" | "count" | "starve" | "states" | "fork" | "threads" | "syscall" | "sched" | "sched-prio" | "race" | "semaphore" | "buffer" | "fit" | "paging" | "tlb" | "replace" | "disk" | "alloc" }
  | { type: "practice"; links: { label: string; sub: string; href: string }[] };

export type CheckQ = { id: string; kind: "MCQ" | "MSQ" | "NAT"; marks: 1 | 2; q: string; options?: string[]; answer: string; solution: string };

export type Topic = { id: string; title: string; words?: number; blocks: Block[] };
export type Chapter = { id: string; subject: string; title: string; syllabus: string[]; pyqTopic: RegExp; map: Fig; topics: Topic[] };

/** Blueprint minimums per topic. Returns the problems; an empty list means the topic may ship. */
export function validateTopic(t: Topic): string[] {
  const n = (type: Block["type"]) => t.blocks.filter((b) => b.type === type).length;
  const out: string[] = [];
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
