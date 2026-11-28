import type { Chapter } from "@/lib/study/schema";
import { chapterO0 } from "./coa-v2-o0";
import { chapterO1 } from "./coa-v2-o1";
import { chapterO2 } from "./coa-v2-o2";
import { chapterO3 } from "./coa-v2-o3";
import { chapterO4 } from "./coa-v2-o4";
import { chapterO5 } from "./coa-v2-o5";
import { chapterO6 } from "./coa-v2-o6";
import { chapterO7 } from "./coa-v2-o7";

/**
 * Computer Organisation, textbook edition (29 Nov 2026): eight chapters O0 to O7 on the six shelf rows (O0 and O1 share the instructions row, O6 and O7 the I/O row).
 * Order of learning: words and performance, instructions, data path, pipelining, cache, memory, I/O, then the practice chapter.
 * Plan: docs/study-materials/v2/computer-organisation/01-REVIEW-MERGE-AND-PLAN.md.
 */
const strip = (items: [string, string][]) => ({ kind: "strip" as const, items: items.map(([label, sub]) => ({ label, sub, state: "done" as const })) });
const SYL = (line: string) => [`CS · Computer Organisation: ${line}`];
export const V2_COA_ISA: Chapter = { id: "cs.coa.isa", subject: "Computer Organisation", title: "Machine instructions and addressing modes", syllabus: SYL("machine instructions and addressing modes"), pyqTopic: /instruction|addressing|opcode|stack|operand|register|endian|RISC/i, topics: [chapterO0, chapterO1], map: strip([["O0", "words, registers, performance"], ["O1", "instructions and addressing modes"]]) };
export const V2_COA_DP: Chapter = { id: "cs.coa.dp", subject: "Computer Organisation", title: "ALU, data path and control unit", syllabus: SYL("ALU, data-path and control unit"), pyqTopic: /ALU|data.?path|control unit|microprogram|microinstruction|booth|overflow/i, topics: [chapterO2], map: strip([["O2", "ALU, data path and control"]]) };
export const V2_COA_PIPE: Chapter = { id: "cs.coa.pipe", subject: "Computer Organisation", title: "Instruction pipelining and hazards", syllabus: SYL("instruction pipelining, pipeline hazards"), pyqTopic: /pipelin|hazard|forwarding|stall|branch pred|CPI/i, topics: [chapterO3], map: strip([["O3", "pipelining, performance, hazards"]]) };
export const V2_COA_CACHE: Chapter = { id: "cs.coa.cache", subject: "Computer Organisation", title: "Cache memory", syllabus: SYL("memory hierarchy, cache"), pyqTopic: /cache|memory hierarchy|locality|direct.?mapped|associativ/i, topics: [chapterO4], map: strip([["O4", "cache memory"]]) };
export const V2_COA_MEM: Chapter = { id: "cs.coa.mem", subject: "Computer Organisation", title: "Main memory and secondary storage", syllabus: SYL("main memory, secondary storage"), pyqTopic: /main memory|DRAM|SRAM|interleav|disk|RAID|secondary storage|memory chip|refresh/i, topics: [chapterO5], map: strip([["O5", "main memory and secondary storage"]]) };
export const V2_COA_IO: Chapter = { id: "cs.coa.io", subject: "Computer Organisation", title: "I/O interface: interrupts and DMA", syllabus: SYL("I/O interface (interrupt and DMA mode)"), pyqTopic: /interrupt|DMA|I\/O|polling|bus|handshake|arbitration|cycle steal|device/i, topics: [chapterO6, chapterO7], map: strip([["O6", "polling, interrupts, DMA"], ["O7", "previous-year patterns"]]) };
