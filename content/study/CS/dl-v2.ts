import type { Chapter } from "@/lib/study/schema";
import { chapterL1 } from "./dl-v2-l1";
import { chapterL2 } from "./dl-v2-l2";
import { chapterL3 } from "./dl-v2-l3";
import { chapterL4 } from "./dl-v2-l4";
import { chapterL5 } from "./dl-v2-l5";
import { chapterL6 } from "./dl-v2-l6";
import { chapterL7 } from "./dl-v2-l7";

/**
 * Digital Logic, textbook edition (28 Nov 2026): seven chapters L1 to L7, one shelf row each (L6 and L7 share the last row).
 * Number representation comes first because K-maps, adders, counters and floating point all need it (docs/study-materials/v2/digital-logic/01-REVIEW-MERGE-AND-PLAN.md).
 */
const strip = (items: [string, string][]) => ({ kind: "strip" as const, items: items.map(([label, sub]) => ({ label, sub, state: "done" as const })) });
const SYL = (line: string) => [`CS · Digital Logic: ${line}`];
export const DL_NUM: Chapter = { id: "cs.dl.num", subject: "Digital Logic", title: "Number representation and codes", syllabus: SYL("number representation and arithmetic (fixed point)"), pyqTopic: /number representation|fixed|radix|two'?s complement/i, topics: [chapterL1], map: strip([["L1", "number representation and codes"]]) };
export const DL_BOOL: Chapter = { id: "cs.dl.bool", subject: "Digital Logic", title: "Gates and Boolean algebra", syllabus: SYL("Boolean algebra"), pyqTopic: /boolean algebra/i, topics: [chapterL2], map: strip([["L2", "gates and Boolean algebra"]]) };
export const DL_KMAP: Chapter = { id: "cs.dl.kmap", subject: "Digital Logic", title: "Minimisation", syllabus: SYL("minimization: algebraic technique, Karnaugh map, tabular method"), pyqTopic: /minimi[sz]ation|k-?map/i, topics: [chapterL3], map: strip([["L3", "K-maps, tabular method, NOR and NAND"]]) };
export const DL_COMB: Chapter = { id: "cs.dl.comb", subject: "Digital Logic", title: "Combinational circuits", syllabus: SYL("design of combinational circuits"), pyqTopic: /combinational|multiplexer|decoder|adder/i, topics: [chapterL4], map: strip([["L4", "combinational circuits and hazards"]]) };
export const DL_SEQ: Chapter = { id: "cs.dl.seq", subject: "Digital Logic", title: "Sequential circuits", syllabus: SYL("design of sequential circuits"), pyqTopic: /sequential|flip-?flop|counter/i, topics: [chapterL5], map: strip([["L5", "flip-flops, counters, state machines"]]) };
export const DL_ARITH: Chapter = { id: "cs.dl.arith", subject: "Digital Logic", title: "Computer arithmetic: fixed and floating point", syllabus: SYL("number representation and arithmetic (fixed and floating point)"), pyqTopic: /floating|ieee/i, topics: [chapterL6, chapterL7], map: strip([["L6", "IEEE 754 floating point"], ["L7", "previous-year patterns"]]) };
