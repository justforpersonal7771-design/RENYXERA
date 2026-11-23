/** One worked sample of every master figure kind: the data format reference, the layout checks, and the visual test page all use these. */
import type { Fig } from "./schema";

export const FIGURE_SAMPLES: { name: string; fig: Fig }[] = [
  { name: "memory: int x = 10; int *p = &x;", fig: { kind: "memory", title: "x lives at 1000, p holds 1000", note: "Look at p: its value is the address of x. The arrow is how we draw 'points to'.", cells: [
    { id: "x", addr: 1000, name: "x", value: 10, size: 4, tone: "hl" }, { addr: 1004, name: "", value: "?", size: 4, tone: "dim" }, { id: "p", addr: 1008, name: "p", value: 1000, size: 4, ptr: "x" } ] } },
  { name: "array: int a[3][4] at 1000 (row-major)", fig: { kind: "array", title: "int a[3][4], base 1000", note: "a+1 jumps a whole row (16 bytes).", data: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], base: 1000, size: 4, index: true, rowIndex: true, tones: { "1,2": "hl" }, pointers: [{ name: "p", at: [0, 0] }, { name: "q", at: [1, 2] }] } },
  { name: "array: 1-D with pointer", fig: { kind: "array", data: [[30, 50, 10, 0, 0]], base: 100, size: 4, index: true, tones: { "0,1": "hl" }, pointers: [{ name: "ptr", at: [0, 1] }] } },
  { name: "linked: singly with head", fig: { kind: "linked", title: "10 → 20 → 30 → NULL", nodes: [{ id: "a", data: 10, next: "b" }, { id: "b", data: 20, next: "c", tone: "hl" }, { id: "c", data: 30, next: null }], heads: [{ name: "head", to: "a" }] } },
  { name: "linked: circular", fig: { kind: "linked", nodes: [{ id: "a", data: 1, next: "b" }, { id: "b", data: 2, next: "c" }, { id: "c", data: 3, next: "a", tone: "ok" }], heads: [{ name: "tail", to: "c" }] } },
  { name: "linked: doubly", fig: { kind: "linked", doubly: true, nodes: [{ id: "a", data: 5, next: "b", prev: null }, { id: "b", data: 6, next: "c", prev: "a" }, { id: "c", data: 7, next: null, prev: "b" }], heads: [{ name: "head", to: "a" }] } },
  { name: "tree: BST 50 25 75 13 40 60 80", fig: { kind: "tree", title: "BST", root: { label: 50, kids: [{ label: 25, kids: [{ label: 13 }, { label: 40, tone: "hl" }] }, { label: 75, kids: [{ label: 60 }, { label: 80 }] }] } } },
  { name: "tree: right-skewed chain (sorted input)", fig: { kind: "tree", root: { label: 1, kids: [null, { label: 2, kids: [null, { label: 3, kids: [null, { label: 4 }] }] }] } } },
  { name: "tree: general (3-ary)", fig: { kind: "tree", root: { label: "A", kids: [{ label: "B" }, { label: "C", kids: [{ label: "E" }, { label: "F" }] }, { label: "D" }] } } },
  { name: "calltree: fib(4)", fig: { kind: "calltree", order: true, title: "fib(4)", root: { label: "fib(4)", ret: 3, kids: [{ label: "fib(3)", ret: 2, kids: [{ label: "fib(2)", ret: 1, kids: [{ label: "fib(1)", ret: 1 }, { label: "fib(0)", ret: 0 }] }, { label: "fib(1)", ret: 1 }] }, { label: "fib(2)", ret: 1, kids: [{ label: "fib(1)", ret: 1 }, { label: "fib(0)", ret: 0 }] }] } } },
  { name: "heap: min-heap of 7", fig: { kind: "heap", values: [3, 9, 5, 12, 10, 8, 7], tones: { 1: "hl" } } },
  { name: "stackframe: fact(3)", fig: { kind: "stackframe", title: "Stack while fact(1) runs", frames: [{ title: "fact(1)", tone: "hl", rows: [{ name: "n", value: 1 }, { name: "return to", value: "fact(2)" }] }, { title: "fact(2)", rows: [{ name: "n", value: 2 }, { name: "return to", value: "fact(3)" }] }, { title: "fact(3)", rows: [{ name: "n", value: 3 }, { name: "return to", value: "main" }] }] } },
  { name: "trace: n & (n-1) for 40", fig: { kind: "trace", title: "count set bits of 40", cols: ["n", "n-1", "n&(n-1)", "count"], rows: [{ cells: ["101000", "100111", "100000", 1], changed: [3] }, { cells: ["100000", "011111", "000000", 2], changed: [3] }] } },
  { name: "bits: 5 and -5 (8-bit)", fig: { kind: "bits", weights: true, title: "two's complement", rows: [{ label: "5", bits: "00000101", value: 5 }, { label: "flip", bits: "11111010", value: "" , tone: "dim" }, { label: "+1  = -5", bits: "11111011", value: -5, hl: [7] }] } },
  { name: "ring: circular queue n=6", fig: { kind: "ring", n: 6, items: ["D", null, null, null, "A", "B"], front: 4, rear: 0 } },
  { name: "hashtable: linear probing", fig: { kind: "hashtable", probes: [3, 4], slots: [{ key: null }, { key: null }, { key: 9 }, { key: 10, tone: "bad" }, { key: 17, tone: "ok" }, { tombstone: true }, { key: 13, chain: [27, 41] }] } },
  { name: "frames: pointer assignment", fig: { kind: "frames", title: "p = &x; *p = 25;", frames: [
    { caption: "Before: p points nowhere yet.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 10 }, { addr: 1004, name: "p", value: "?", tone: "dim" }] } },
    { caption: "p = &x: p now holds the address of x.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 10 }, { addr: 1004, name: "p", value: 1000, ptr: "x", tone: "hl" }] } },
    { caption: "*p = 25: follow the arrow and write into x.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 25, tone: "ok" }, { addr: 1004, name: "p", value: 1000, ptr: "x" }] } } ] } },
];
