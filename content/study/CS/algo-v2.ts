import type { Chapter } from "@/lib/study/schema";
import { ALGO_ASYM, ALGO_SORT } from "./algo-a";
import { ALGO_HASH, ALGO_DC } from "./algo-b";
import { ALGO_GREEDY, ALGO_DP } from "./algo-c";
import { ALGO_GRAPH, ALGO_MST, ALGO_SP } from "./algo-d";
import { chapterA1 } from "./algo-v2-a1";

/**
 * Algorithms, textbook edition (28 Nov 2026). Each row of the shelf keeps its route and its old chapter shell (id, syllabus line, PYQ pattern);
 * the topics are replaced, one rewritten chapter at a time, by the numbered book chapters A0 to A10. A row not yet rewritten still shows its old topics.
 */
const strip = (items: [string, string][]) => ({ kind: "strip" as const, items: items.map(([label, sub]) => ({ label, sub, state: "done" as const })) });
export const V2_ASYM: Chapter = { ...ALGO_ASYM, topics: [chapterA1], map: strip([["A1", "asymptotics and recurrences"]]) };
export const V2_SORT: Chapter = ALGO_SORT;
export const V2_HASH: Chapter = ALGO_HASH;
export const V2_DC: Chapter = ALGO_DC;
export const V2_GREEDY: Chapter = ALGO_GREEDY;
export const V2_DP: Chapter = ALGO_DP;
export const V2_GRAPH: Chapter = ALGO_GRAPH;
export const V2_MST: Chapter = ALGO_MST;
export const V2_SP: Chapter = ALGO_SP;
