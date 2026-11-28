import type { Chapter } from "@/lib/study/schema";
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
export const V2_ASYM: Chapter = { id: "cs.algo.asym", subject: "Algorithms", title: "Asymptotics and recurrences", syllabus: ["CS · Algorithms: asymptotic worst case time and space complexity"], pyqTopic: /asymptotic|complexity|recurrence|master theorem|big-?o/i, topics: [chapterA0, chapterA1], map: strip([["A0", "the toolbox"], ["A1", "asymptotics and recurrences"]]) };
export const V2_SORT: Chapter = { id: "cs.algo.sort", subject: "Algorithms", title: "Searching and sorting", syllabus: ["CS · Algorithms: searching, sorting"], pyqTopic: /sort|search/i, topics: [chapterA2], map: strip([["A2", "searching and sorting"]]) };
export const V2_HASH: Chapter = { id: "cs.algo.hash", subject: "Algorithms", title: "Hashing", syllabus: ["CS · Algorithms: hashing"], pyqTopic: /hash/i, topics: [chapterA3], map: strip([["A3", "hashing"]]) };
export const V2_DC: Chapter = { id: "cs.algo.dc", subject: "Algorithms", title: "Divide and conquer", syllabus: ["CS · Algorithms: algorithm design techniques: divide-and-conquer"], pyqTopic: /divide.and.conquer|strassen|karatsuba|median|select/i, topics: [chapterA4], map: strip([["A4", "divide and conquer"]]) };
export const V2_GREEDY: Chapter = { id: "cs.algo.greedy", subject: "Algorithms", title: "Greedy", syllabus: ["CS · Algorithms: algorithm design techniques: greedy"], pyqTopic: /greedy|huffman|knapsack|activity|job sequenc/i, topics: [chapterA5], map: strip([["A5", "greedy algorithms"]]) };
export const V2_DP: Chapter = { id: "cs.algo.dp", subject: "Algorithms", title: "Dynamic programming", syllabus: ["CS · Algorithms: algorithm design techniques: dynamic programming"], pyqTopic: /dynamic programming|LCS|knapsack|matrix chain|subset sum/i, topics: [chapterA6], map: strip([["A6", "dynamic programming"]]) };
export const V2_GRAPH: Chapter = { id: "cs.algo.graph", subject: "Algorithms", title: "Graph traversals", syllabus: ["CS · Algorithms: graph traversals"], pyqTopic: /BFS|DFS|traversal|topolog|strongly connected|articulation/i, topics: [chapterA7], map: strip([["A7", "graph traversals"]]) };
export const V2_MST: Chapter = { id: "cs.algo.mst", subject: "Algorithms", title: "Minimum spanning trees", syllabus: ["CS · Algorithms: minimum spanning trees"], pyqTopic: /spanning tree|kruskal|prim/i, topics: [chapterA8], map: strip([["A8", "minimum spanning trees"]]) };
export const V2_SP: Chapter = { id: "cs.algo.sp", subject: "Algorithms", title: "Shortest paths", syllabus: ["CS · Algorithms: shortest paths"], pyqTopic: /shortest path|dijkstra|bellman|floyd/i, topics: [chapterA9, chapterA10], map: strip([["A9", "shortest paths"], ["A10", "previous-year patterns"]]) };
