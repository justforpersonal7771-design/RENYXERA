import type { Chapter } from "@/lib/study/schema";
import { chapterD0 } from "./pds-d0";
import { chapterD1 } from "./pds-d1";
import { chapterD2 } from "./pds-d2";
import { chapterD3 } from "./pds-d3";
import { chapterD4 } from "./pds-d4";
import { chapterD5 } from "./pds-d5";
import { chapterD6 } from "./pds-d6";
import { chapterD7 } from "./pds-d7";
import { chapterD8 } from "./pds-d8";
import { chapterD9 } from "./pds-d9";
import { chapterD10 } from "./pds-d10";
import { chapterD11 } from "./pds-d11";
import { chapterD12 } from "./pds-d12";
import { chapterD13 } from "./pds-d13";
import { chapterD14 } from "./pds-d14";
import { chapterD15 } from "./pds-d15";
import { chapterD16 } from "./pds-d16";

/** The Data Structures book (chapters D0 onward), written in the same textbook style as Programming in C. */
export const PDS_DS: Chapter = {
  id: "cs.pds.ds", subject: "Data Structures", title: "Data Structures",
  syllabus: ["CS · Programming and Data Structures: abstract data types, arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs"],
  pyqTopic: /Linked Lists|Stacks|Queues|Trees|Heaps|Arrays|Hashing/i,
  map: { kind: "strip", items: [{ label: "1. Ideas", sub: "ADT, cost", state: "now" }, { label: "2. Linear", sub: "arrays, lists", state: "todo" }, { label: "3. Stack, queue", sub: "LIFO, FIFO", state: "todo" }, { label: "4. Trees", sub: "BST, heap", state: "todo" }, { label: "5. Graphs", sub: "matrix, list", state: "todo" }] },
  topics: [chapterD0, chapterD1, chapterD2, chapterD3, chapterD4, chapterD5, chapterD6, chapterD7, chapterD8, chapterD9, chapterD10, chapterD11, chapterD12, chapterD13, chapterD14, chapterD15, chapterD16],
};

/**
 * The book is split by subject so every chapter sits under its own row of the shelf (29 Nov 2026): the same chapter objects, grouped.
 * The rows replace the older single-draft pages for arrays, lists, stacks and queues, recursion, trees, heaps and graphs.
 */
const part = (id: string, title: string, topics: Chapter["topics"], items: { label: string; sub: string }[]): Chapter => ({
  ...PDS_DS, id: `cs.pds.ds.${id}`, subject: "Data Structures", title, topics, map: { kind: "strip", items: items.map((i) => ({ ...i, state: "done" as const })) },
});
export const PDS_DS_FOUND = part("found", "Foundations: structures and cost", [chapterD0, chapterD1], [{ label: "1. What a structure is", sub: "ADT, memory" }, { label: "2. Counting cost", sub: "Big-O, sums" }]);
export const PDS_DS_ARRAYS = part("arrays", "Arrays", [chapterD2], [{ label: "1. Arrays", sub: "address, matrices" }]);
export const PDS_DS_LISTS = part("lists", "Linked lists", [chapterD3], [{ label: "1. Linked lists", sub: "nodes, pointers" }]);
export const PDS_DS_SQ = part("sq", "Stacks and queues", [chapterD4, chapterD5], [{ label: "1. Stacks", sub: "LIFO" }, { label: "2. Queues", sub: "FIFO" }]);
export const PDS_DS_REC = part("rec", "Recursion", [chapterD6], [{ label: "1. Recursion", sub: "lists, trees, Hanoi" }]);
export const PDS_DS_TREES = part("trees", "Trees and binary search trees", [chapterD7, chapterD8, chapterD9, chapterD11], [{ label: "1. Trees", sub: "traversals" }, { label: "2. BSTs", sub: "insert, delete" }, { label: "3. AVL", sub: "rotations" }, { label: "4. B and B+ trees", sub: "disk blocks" }]);
export const PDS_DS_HEAPS = part("heaps", "Binary heaps", [chapterD10], [{ label: "1. Heaps", sub: "array, build-heap" }]);
export const PDS_DS_HASH = part("hash", "Hashing", [chapterD12], [{ label: "1. Hashing", sub: "chaining, probing" }]);
export const PDS_DS_GRAPHS = part("graphs", "Graphs", [chapterD13, chapterD14], [{ label: "1. Graphs", sub: "matrix, list, BFS, DFS" }, { label: "2. Tries, disjoint sets", sub: "extras" }]);
export const PDS_DS_CHOOSE = part("choose", "Choosing the right structure", [chapterD15, chapterD16], [{ label: "1. The cost table", sub: "choose" }, { label: "2. Patterns", sub: "mixed practice" }]);
