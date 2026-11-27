import type { Chapter } from "@/lib/study/schema";
import { chapterD0 } from "./pds-d0";
import { chapterD1 } from "./pds-d1";
import { chapterD2 } from "./pds-d2";
import { chapterD3 } from "./pds-d3";
import { chapterD4 } from "./pds-d4";
import { chapterD5 } from "./pds-d5";
import { chapterD7 } from "./pds-d7";
import { chapterD8 } from "./pds-d8";
import { chapterD9 } from "./pds-d9";
import { chapterD10 } from "./pds-d10";
import { chapterD13 } from "./pds-d13";
import { chapterD15 } from "./pds-d15";
import { chapterD16 } from "./pds-d16";

/** The Data Structures book (chapters D0 onward), written in the same textbook style as Programming in C. */
export const PDS_DS: Chapter = {
  id: "cs.pds.ds", subject: "Programming and Data Structures", title: "Data Structures",
  syllabus: ["CS · Programming and Data Structures: abstract data types, arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs"],
  pyqTopic: /Linked Lists|Stacks|Queues|Trees|Heaps|Arrays|Hashing/i,
  map: { kind: "strip", items: [{ label: "1. Ideas", sub: "ADT, cost", state: "now" }, { label: "2. Linear", sub: "arrays, lists", state: "todo" }, { label: "3. Stack, queue", sub: "LIFO, FIFO", state: "todo" }, { label: "4. Trees", sub: "BST, heap", state: "todo" }, { label: "5. Graphs", sub: "matrix, list", state: "todo" }] },
  topics: [chapterD0, chapterD1, chapterD2, chapterD3, chapterD4, chapterD5, chapterD7, chapterD8, chapterD9, chapterD10, chapterD13, chapterD15, chapterD16],
};
