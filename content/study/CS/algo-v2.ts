import type { Chapter } from "@/lib/study/schema";
import { ALGO_ASYM, ALGO_SORT } from "./algo-a";
import { ALGO_HASH, ALGO_DC } from "./algo-b";
import { ALGO_GREEDY, ALGO_DP } from "./algo-c";
import { ALGO_GRAPH, ALGO_MST, ALGO_SP } from "./algo-d";
import { chapterA0 } from "./algo-v2-a0";
import { chapterA1 } from "./algo-v2-a1";
import { chapterA2 } from "./algo-v2-a2";
import { chapterA3 } from "./algo-v2-a3";
import { chapterA4 } from "./algo-v2-a4";
import { chapterA5 } from "./algo-v2-a5";
import { chapterA6 } from "./algo-v2-a6";
import { chapterA7 } from "./algo-v2-a7";
import { chapterA8 } from "./algo-v2-a8";
import { chapterA9 } from "./algo-v2-a9";
import { chapterA10 } from "./algo-v2-a10";

/**
 * Algorithms, textbook edition (28 Nov 2026). Each row of the shelf keeps its route and its old chapter shell (id, syllabus line, PYQ pattern);
 * the topics are replaced, one rewritten chapter at a time, by the numbered book chapters A0 to A10. A row not yet rewritten still shows its old topics.
 */
const strip = (items: [string, string][]) => ({ kind: "strip" as const, items: items.map(([label, sub]) => ({ label, sub, state: "done" as const })) });
export const V2_ASYM: Chapter = { ...ALGO_ASYM, topics: [chapterA0, chapterA1], map: strip([["A0", "the toolbox"], ["A1", "asymptotics and recurrences"]]) };
export const V2_SORT: Chapter = { ...ALGO_SORT, topics: [chapterA2], map: strip([["A2", "searching and sorting"]]) };
export const V2_HASH: Chapter = { ...ALGO_HASH, topics: [chapterA3], map: strip([["A3", "hashing"]]) };
export const V2_DC: Chapter = { ...ALGO_DC, topics: [chapterA4], map: strip([["A4", "divide and conquer"]]) };
export const V2_GREEDY: Chapter = { ...ALGO_GREEDY, topics: [chapterA5], map: strip([["A5", "greedy algorithms"]]) };
export const V2_DP: Chapter = { ...ALGO_DP, topics: [chapterA6], map: strip([["A6", "dynamic programming"]]) };
export const V2_GRAPH: Chapter = { ...ALGO_GRAPH, topics: [chapterA7], map: strip([["A7", "graph traversals"]]) };
export const V2_MST: Chapter = { ...ALGO_MST, topics: [chapterA8], map: strip([["A8", "minimum spanning trees"]]) };
export const V2_SP: Chapter = { ...ALGO_SP, topics: [chapterA9, chapterA10], map: strip([["A9", "shortest paths"], ["A10", "previous-year patterns"]]) };
