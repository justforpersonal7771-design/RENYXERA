// Checks the master-figure layout maths and that every sample is well-formed. Run: npx tsx scripts/figures-check.ts
import { cellAddress, heapToTree, layoutTree, ringCount, ringPoint } from "../lib/study/figure-layout";
import { FIGURE_SAMPLES } from "../lib/study/figure-samples";
import { FIGX_KINDS, type TreeNode } from "../lib/study/figures";
let bad = 0;
const eq = (name: string, got: unknown, want: unknown) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${JSON.stringify(got)}${ok ? "" : ` (expected ${JSON.stringify(want)})`}`); };
const finite = (name: string, xs: number[]) => { const ok = xs.every((x) => Number.isFinite(x)); if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${name}: all coordinates finite`); };

// addresses: int a[3][4] at 1000: a[1][2] = 1000 + (1*4+2)*4 = 1024; column-major = 1000 + (2*3+1)*4 = 1028
eq("row-major a[1][2]", cellAddress(1000, 4, 3, 4, 1, 2), 1024);
eq("column-major a[1][2]", cellAddress(1000, 4, 3, 4, 1, 2, true), 1028);
// ring: 6 slots, front 4, rear 0 holds 3 items (4, 5, 0)
eq("ring count front=4 rear=0 n=6", ringCount(6, 4, 0), 3);
eq("ring count single", ringCount(6, 2, 2), 1);
const top = ringPoint(0, 8, 10, 0, 0); eq("ring slot 0 is at the top", [Math.round(top.x), Math.round(top.y)], [0, -10]);
// BST in-order placement: x order must equal in-order sequence
const bst: TreeNode = { label: 50, kids: [{ label: 25, kids: [{ label: 13 }, { label: 40 }] }, { label: 75, kids: [{ label: 60 }, { label: 80 }] }] };
const L = layoutTree(bst);
eq("BST in-order by x", [...L.nodes].sort((a, b) => a.x - b.x).map((p) => p.node.label), [13, 25, 40, 50, 60, 75, 80]);
eq("BST depths", L.nodes.map((p) => p.depth), [0, 1, 2, 2, 1, 2, 2]);
eq("pre-order numbering", L.nodes.map((p) => p.order), [1, 2, 3, 4, 5, 6, 7]);
// a lone right child must sit to the right of its parent, a lone left child to the left
const chain = layoutTree({ label: 1, kids: [null, { label: 2 }] });
eq("lone right child is right of parent", chain.nodes[1].x > chain.nodes[0].x, true);
const lchain = layoutTree({ label: 1, kids: [{ label: 2 }] });
eq("lone left child is left of parent", lchain.nodes[1].x < lchain.nodes[0].x, true);
// general tree: parent over the mean of first and last child
const gen = layoutTree({ label: "A", kids: [{ label: "B" }, { label: "C" }, { label: "D" }] });
eq("general tree parent centred", gen.nodes[0].x, (gen.nodes[1].x + gen.nodes[3].x) / 2);
finite("BST layout", L.nodes.flatMap((p) => [p.x, p.y]));
// heap: index relations 1-based and 0-based
const h1 = heapToTree([1, 2, 3, 4, 5, 6, 7])!;
eq("heap root children (1-based)", [h1.kids![0]!.label, h1.kids![1]!.label], [2, 3]);
eq("heap node 2 children (1-based)", [h1.kids![0]!.kids![0]!.label, h1.kids![0]!.kids![1]!.label], [4, 5]);
const h0 = heapToTree([1, 2, 3, 4, 5, 6, 7], {}, true)!;
eq("heap node index 1 children (0-based)", [h0.kids![0]!.kids![0]!.label, h0.kids![0]!.kids![1]!.label], [4, 5]);
eq("heap with 4 values has a lone left child", heapToTree([1, 2, 3, 4])!.kids![0]!.kids!.map((k) => (k ? k.label : null)), [4, null]);
// samples: every kind is covered, and linked-list / memory references resolve
const kinds = new Set(FIGURE_SAMPLES.map((s) => s.fig.kind));
eq("every master kind has a sample", FIGX_KINDS.filter((k) => !kinds.has(k)), []);
for (const s of FIGURE_SAMPLES) {
  if (s.fig.kind === "linked") { const ids = new Set(s.fig.nodes.map((n) => n.id)); const ok = s.fig.nodes.every((n) => (n.next === null || ids.has(n.next)) && (n.prev == null || ids.has(n.prev))) && (s.fig.heads ?? []).every((h) => ids.has(h.to)); if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} linked refs resolve: ${s.name}`); }
  if (s.fig.kind === "memory") { const keys = new Set(s.fig.cells.map((c) => String(c.id ?? c.addr))); const ok = s.fig.cells.every((c) => c.ptr === undefined || keys.has(String(c.ptr))); if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} memory pointers resolve: ${s.name}`); }
}
console.log(bad ? `\n${bad} FAILED` : "\nall figure checks passed");
process.exit(bad ? 1 : 0);
