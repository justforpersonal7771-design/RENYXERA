import type { Chapter, Topic } from "@/lib/study/schema";
import { PDS_C } from "./pds-a";

/**
 * Programming in C is one book in four parts, so no single contents rail carries 22 chapters (27 Nov 2026).
 * Each part is its own page; the chapter numbers (C0 to C21) are unchanged and the topics are the same objects as in PDS_C.
 */
const byNo = (nos: string[]): Topic[] => nos.map((n) => { const t = PDS_C.topics.find((x) => x.no === n); if (!t) throw new Error(`C part: chapter C${n} not found`); return t; });
const part = (id: string, title: string, nos: string[], items: { label: string; sub: string }[]): Chapter => ({
  ...PDS_C, id: `cs.pds.c.${id}`, title, topics: byNo(nos), map: { kind: "strip", items: items.map((i) => ({ ...i, state: "done" as const })) },
});

export const PDS_C_FOUNDATIONS = part("foundations", "Programming in C 1: foundations", ["0", "1", "2", "3", "4", "5"], [{ label: "1. How it runs", sub: "compile, memory" }, { label: "2. Types", sub: "wrap, promotion" }, { label: "3. Operators", sub: "precedence" }, { label: "4. Decisions and loops", sub: "loop counts" }]);
export const PDS_C_FUNCTIONS = part("functions", "Programming in C 2: functions, recursion, arrays", ["6", "7", "17", "8", "9"], [{ label: "1. Functions", sub: "call stack" }, { label: "2. Scope", sub: "storage classes" }, { label: "3. Recursion", sub: "frames" }, { label: "4. Arrays", sub: "layout" }]);
export const PDS_C_POINTERS = part("pointers", "Programming in C 3: pointers, strings, memory", ["10", "11", "13", "12", "14", "15"], [{ label: "1. Pointers", sub: "addresses" }, { label: "2. Strings", sub: "char arrays" }, { label: "3. Structures", sub: "padding" }, { label: "4. malloc", sub: "heap" }]);
export const PDS_C_READING = part("reading", "Programming in C 4: reading code and practice", ["16", "18", "19", "20", "21"], [{ label: "1. Macros", sub: "preprocessor" }, { label: "2. Files", sub: "errors" }, { label: "3. Mystery functions", sub: "output method" }, { label: "4. Previous-year patterns", sub: "mixed sets" }]);
