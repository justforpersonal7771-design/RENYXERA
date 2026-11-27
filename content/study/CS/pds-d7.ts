import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D7 "Trees and binary trees" (28 Nov 2026). Real GATE questions (texts from public/data/questions.json):
 * 2026 FN Q33 (maximum height of a full binary tree with 23 nodes = 11), 2026 AN Q12 (traversal order match, key A), 2025 AN Q13 (full binary tree, internal
 * nodes = (n-1)/2, key B), 2018 FN Q30 (height from postorder and inorder = 4). Programs compiled and run with gcc:
 * traversals of the six-node tree 1..6, height 2 / nodes 6 / leaves 3, array indices.
 */
export const chapterD7: Topic = {
  id: "cs.pds.ds.trees7",
  title: "Trees and binary trees",
  no: "D7",
  book: [
    { t: "p", text: "Arrays, lists, stacks and queues are all **linear**: items come one after another in a line. A **tree** is not a line; it is a hierarchy, like a family tree or the folders on your computer. One item sits at the top, it has items beneath it, and each of those has items beneath them. Trees are how computers hold anything that nests: file systems, expressions, the structure of a program, and the searching structures of the next chapters." },
    { t: "p", text: "This chapter covers the vocabulary of trees, the binary tree in particular, the counting facts GATE asks for (how many leaves, how tall can it be), the four ways of visiting every node, and how to rebuild a tree from two of its traversals." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["use the words root, parent, child, leaf, height, depth, level and degree correctly;", "tell full, complete, perfect and skewed binary trees apart and give their node and height limits;", "write the preorder, inorder, postorder and level-order traversals of a tree and the code that produces them;", "rebuild a binary tree from its inorder traversal and one other, and read off its height;", "store a complete binary tree in an array and move between parent and children by arithmetic."] },

    { t: "h2", text: "Trees and their words" },
    { t: "p", text: "A tree is made of **nodes** joined by **edges**. One special node is the **root**, at the top. Every other node has exactly one **parent** (the node directly above it) and any number of **children** (the nodes directly below). Two children of the same parent are **siblings**. A node with no children is a **leaf**; a node that has children is **internal**." },
    { t: "fig", id: "d7-f1" },
    { t: "p", text: "The **depth** of a node is the number of edges from the root to it, so the root has depth 0. The **height** of a node is the number of edges on the longest path from it down to a leaf, and the height of the **tree** is the height of the root. A tree with a single node has height 0 and an empty tree is usually given height −1. The **level** of a node is its depth, or depth + 1 when levels are counted from 1; read the question to see which it means. The **degree** of a node is the number of its children." },
    { t: "callout", kind: "warning", text: "Height counts edges, not nodes. A single node has height 0. GATE 2026 states this definition in the question; always check it, because some books count nodes." },
    { t: "p", text: "A tree with n nodes always has exactly **n − 1 edges**: every node except the root has one edge to its parent. This one fact is used again and again, in graphs as well." },

    { t: "h2", text: "Binary trees and their shapes" },
    { t: "p", text: "A **binary tree** is a tree in which every node has at most two children, called the **left** child and the **right** child. The left/right distinction matters: a node with only a left child and a node with only a right child are different trees. Binary trees are by far the most important kind, because two children are enough to build everything." },
    { t: "p", text: "Several special shapes have names, and GATE uses them exactly." },
    { t: "table", head: ["Shape", "Definition", "Nodes for height h"], rows: [["Full (proper)", "every node has 0 or 2 children", "at least 2h + 1, at most 2^(h+1) − 1"], ["Perfect", "full, and all leaves on the same level", "exactly 2^(h+1) − 1"], ["Complete", "every level full except possibly the last, which is filled from the left", "between 2^h and 2^(h+1) − 1"], ["Skewed", "every node has one child (a chain)", "h + 1"]] },
    { t: "fig", id: "d7-f2" },
    { t: "p", text: "Three counting facts follow, and they are the usual GATE questions. In a **full** binary tree with n nodes, the number of leaves is **(n + 1) / 2** and the number of internal nodes (with two children each) is **(n − 1) / 2**; in other words, leaves = internal + 1. The **tallest** full tree on n nodes is a spine with a leaf hanging off each internal node, of height (n − 1) / 2. The **shortest** binary tree on n nodes, a complete one, has height ⌊log₂ n⌋." },
    { t: "ex", id: "d7-e1" },
    { t: "ex", id: "d7-e2" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Representing a binary tree" },
    { t: "p", text: "The usual representation is by **pointers**, the same self-referential idea as the linked list: each node holds its value and two pointers, `left` and `right`, which are `NULL` for a missing child. A pointer to the root reaches the whole tree. An empty tree is a `NULL` root." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct node {
    int val;
    struct node *left, *right;
};

struct node *mk(int v, struct node *l, struct node *r) {
    struct node *n = malloc(sizeof *n);
    n->val = v; n->left = l; n->right = r;
    return n;
}

int height(struct node *p) {             /* edges on the longest downward path; empty tree = -1 */
    if (p == NULL) return -1;
    int a = height(p->left), b = height(p->right);
    return 1 + (a > b ? a : b);
}
int count(struct node *p)  { return p == NULL ? 0 : 1 + count(p->left) + count(p->right); }
int leaves(struct node *p) {
    if (p == NULL) return 0;
    if (p->left == NULL && p->right == NULL) return 1;
    return leaves(p->left) + leaves(p->right);
}

int main(void) {
    struct node *t = mk(1, mk(2, mk(4, NULL, NULL), mk(5, NULL, NULL)), mk(3, NULL, mk(6, NULL, NULL)));
    printf("%d %d %d\\n", height(t), count(t), leaves(t));
    return 0;
}`, out: "2 6 3", file: "tree_basics.c" },
    { t: "p", text: "Each of the three functions follows the same pattern: a **base case** for the empty tree, then the answer built from the answers for the left and right subtrees. A tree is a recursive structure, so most tree functions are short recursions. The tree built here has six nodes, height 2 and three leaves (4, 5 and 6)." },
    { t: "p", text: "A **complete** binary tree can instead be stored in an **array** with no pointers at all. Number the nodes level by level, from left to right, starting at 0. Then the children of node i are at **2i + 1** and **2i + 2**, and its parent is at **⌊(i − 1) / 2⌋**. This is the representation used by the heap (chapter D10). If the tree is not complete, the array would need gaps for the missing nodes and wastes space." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int i = 1;                                           /* a node of a tree stored in an array from index 0 */
    printf("%d %d %d\\n", 2 * i + 1, 2 * i + 2, (5 - 1) / 2);
    return 0;
}`, out: "3 4 2", file: "array_tree.c" },
    { t: "p", text: "The node at index 1 has its children at 3 and 4, and the node at index 5 has its parent at (5 − 1) / 2 = 2. Be careful if the numbering starts at **1**: then the children of i are 2i and 2i + 1 and the parent is ⌊i / 2⌋. The question tells you which; do not mix the two." },

    { t: "h2", text: "Visiting every node: traversals" },
    { t: "p", text: "To **traverse** a tree is to visit every node exactly once. There are four standard orders. Three are recursive and differ only in **when the node itself is handled** relative to its two subtrees. Writing N for the node, L for the left subtree and R for the right:" },
    { t: "table", head: ["Traversal", "Order", "Memory aid"], rows: [["Preorder", "N, L, R", "node first: 'pre'"], ["Inorder", "L, N, R", "node in the middle: 'in'"], ["Postorder", "L, R, N", "node last: 'post'"], ["Level order", "level by level, left to right", "uses a queue (D5)"]] },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct node { int val; struct node *left, *right; };
struct node *mk(int v, struct node *l, struct node *r) {
    struct node *n = malloc(sizeof *n); n->val = v; n->left = l; n->right = r; return n;
}

void pre(struct node *p)  { if (!p) return; printf("%d ", p->val); pre(p->left);  pre(p->right); }
void in(struct node *p)   { if (!p) return; in(p->left);  printf("%d ", p->val); in(p->right); }
void post(struct node *p) { if (!p) return; post(p->left); post(p->right); printf("%d ", p->val); }
void level(struct node *root) {
    struct node *q[16]; int f = 0, r = 0;
    q[r++] = root;
    while (f < r) {
        struct node *p = q[f++];
        printf("%d ", p->val);
        if (p->left)  q[r++] = p->left;
        if (p->right) q[r++] = p->right;
    }
}

int main(void) {
    struct node *t = mk(1, mk(2, mk(4, NULL, NULL), mk(5, NULL, NULL)), mk(3, NULL, mk(6, NULL, NULL)));
    pre(t); printf("| "); in(t); printf("| "); post(t); printf("| "); level(t);
    return 0;
}`, out: "1 2 4 5 3 6 | 4 2 5 1 3 6 | 4 5 2 6 3 1 | 1 2 3 4 5 6 ", file: "traversals.c" },
    { t: "fig", id: "d7-f3" },
    { t: "p", text: "Read the output against the picture. Preorder visits 1 before anything below it, then goes all the way down the left (2, 4, 5) before the right (3, 6). Inorder visits 4 first (the leftmost node) and 6 last. Postorder visits every node after both its children, so the root comes last. Level order is the numbering of the picture itself." },
    { t: "p", text: "A quick way to produce a traversal by hand is to draw a path around the tree, keeping it on your left, from just left of the root. Write a node's value the **first** time the path passes it for preorder, the **second** time (from underneath, between its children) for inorder, and the **third** time (on the way up) for postorder." },
    { t: "ex", id: "d7-e3" },
    { t: "callout", kind: "tip", text: "Preorder starts with the root; postorder ends with the root; inorder has the root somewhere in the middle, with the left subtree before it and the right subtree after it." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Rebuilding a tree from two traversals" },
    { t: "p", text: "A single traversal does not say what the tree looks like: many trees share a preorder. But the **inorder together with the preorder** (or the inorder together with the postorder) fixes the tree. The reason: the root is the first item of the preorder (or the last of the postorder), and finding it in the inorder splits the inorder into the left subtree, before the root, and the right subtree, after it. Repeat on each half." },
    { t: "fig", id: "d7-f4" },
    { t: "p", text: "Preorder together with postorder is **not** enough in general; it works only for full binary trees. Remember this: you need the inorder." },
    { t: "ex", id: "d7-e4" },
    { t: "ex", id: "d7-e5" },
    { t: "trap", i: 2 },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Tree questions in this chapter's scope are of four kinds: **counting** (leaves, internal nodes, maximum height of a full binary tree: examples 1 and 2), **definitions** (which traversal is which: example 3), **reconstruction** from two traversals and asking for height or another traversal (examples 4 and 5), and **code tracing** of a recursive function that prints during a traversal. Searching structures, the binary search tree and the heap, build on all of these in the next chapters." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you can treat a tree as a recursion: the answer for a tree is built from the answers for its two subtrees. For reconstruction, whether you split the inorder correctly around the root and repeat." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Counting height in nodes when the question counts edges (or the reverse).", "Mixing up the three traversals, especially preorder and postorder.", "Using n/2 leaves instead of (n + 1)/2 for a full binary tree.", "Trying to rebuild a tree from preorder and postorder only.", "Mixing the 0-based (2i + 1) and 1-based (2i) child formulas."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A tree with n nodes has n − 1 edges; the root has no parent; leaves have no children.", "Height is the number of edges on the longest root-to-leaf path; a single node has height 0.", "Full: 0 or 2 children everywhere. Perfect: full with all leaves on one level. Complete: filled level by level from the left.", "Full binary tree: leaves = internal + 1 = (n + 1)/2; tallest has height (n − 1)/2. Shortest tree on n nodes has height ⌊log₂ n⌋.", "Preorder N L R, inorder L N R, postorder L R N, level order with a queue.", "Inorder plus preorder or postorder rebuilds the tree. Complete trees fit in an array with children at 2i + 1 and 2i + 2."] },
  ],
  blocks: [
    { type: "figure", id: "d7-f1", caption: "A tree of six nodes. 1 is the root; 2 and 3 are its children and each other's siblings; 4, 5 and 6 are leaves. The height is 2 edges.", alt: "A binary tree with root 1, children 2 and 3, node 2 having leaves 4 and 5, and node 3 having a right leaf 6.", fig: { kind: "tree", title: "Root 1, leaves 4, 5, 6, height 2", root: { label: 1, kids: [{ label: 2, kids: [{ label: 4 }, { label: 5 }] }, { label: 3, kids: [null, { label: 6 }] }] } } },
    { type: "figure", id: "d7-f2", caption: "A full tree: every node has 0 or 2 children. It has 5 nodes, 3 leaves and 2 internal nodes, so leaves = internal + 1. It is also complete: its last level is filled from the left, so it fits an array with no gaps.", alt: "A binary tree of 5 nodes: root 1 with children 2 and 3, and node 2 with leaves 4 and 5.", fig: { kind: "tree", title: "Full: 1 → (2, 3), 2 → (4, 5)", root: { label: 1, kids: [{ label: 2, kids: [{ label: 4 }, { label: 5 }] }, { label: 3 }] } } },
    { type: "figure", id: "d7-f3", caption: "The four traversals of the six-node tree. The path is the same; only the moment of writing differs.", alt: "A table of preorder, inorder, postorder and level order of the tree 1, 2, 3, 4, 5, 6.", fig: { kind: "matrix", title: "Traversals of the tree", cols: ["1", "2", "3", "4", "5", "6"], rows: [{ label: "preorder (N L R)", cells: [1, 2, 4, 5, 3, 6] }, { label: "inorder (L N R)", cells: [4, 2, 5, 1, 3, 6], hl: true }, { label: "postorder (L R N)", cells: [4, 5, 2, 6, 3, 1] }, { label: "level order", cells: [1, 2, 3, 4, 5, 6] }] } },
    { type: "figure", id: "d7-f4", caption: "Rebuilding from preorder 1 2 4 5 3 and inorder 4 2 5 1 3: the root 1 splits the inorder into 4 2 5 | 3; then the root of the left part is 2, which splits 4 | 5.", alt: "A tree with root 1, left child 2 with leaves 4 and 5, and right child 3.", fig: { kind: "tree", title: "Rebuilt tree: postorder 4 5 2 3 1", root: { label: 1, kids: [{ label: 2, kids: [{ label: 4 }, { label: 5 }] }, { label: 3 }] } } },

    { type: "example", id: "d7-e1", level: "gate", title: "GATE CS 2026 (forenoon), Q33 · 1 mark · NAT: tallest full binary tree", file: "gate2026_q33.txt", given: `Height = the number of edges on the longest root-to-leaf path.
The maximum possible height of a full binary tree with 23 nodes?`, find: "The maximum height.", steps: [
      { say: "Every internal node of a full tree has two children. The tallest shape is a spine: each internal node has one child that continues the spine and one leaf.", result: "spine + a leaf per step" },
      { say: "Each step down adds 2 nodes (the next spine node and a leaf). The root alone is 1 node, so 1 + 2h = 23.", result: "2h = 22" },
      { say: "Solve.", result: "h = 11" },
    ], answer: "11", check: "In general the maximum height is (n − 1) / 2 and the minimum is ⌈log₂(n + 1)⌉ − 1." },
    { type: "example", id: "d7-e2", level: "gate", title: "GATE CS 2025 (afternoon), Q13 · 1 mark · MCQ: nodes with two children", file: "gate2025_an_q13.txt", given: `Every node of a binary tree T has zero or two children; n > 0 nodes.
How many nodes have exactly two children?
(A) (n − 2)/2   (B) (n − 1)/2   (C) n/2   (D) (n + 1)/2`, find: "The correct option.", steps: [
      { say: "Let t be the nodes with two children and ℓ the leaves. Every node is one or the other.", result: "n = t + ℓ" },
      { say: "Count edges: the tree has n − 1 edges, and each two-child node gives 2 of them.", result: "2t = n − 1" },
      { say: "So the number with two children is (n − 1) / 2, and then ℓ = (n + 1) / 2.", result: "t = (n − 1) / 2" },
    ], answer: "B: (n − 1)/2", check: "A tree of 3 nodes (a root with two leaves) has 1 such node: (3 − 1)/2 = 1." },
    { type: "example", id: "d7-e3", level: "gate", title: "GATE CS 2026 (afternoon), Q12 · 1 mark · MCQ: match traversals to orders", file: "gate2026_an_q12.txt", given: `T: I inorder, II preorder, III postorder.
S: L = left, node, right;  M = node, left, right;  N = left, right, node.
Which match is correct?`, find: "The correct match.", steps: [
      { say: "Inorder visits the node between the subtrees: left, node, right.", result: "I – L" },
      { say: "Preorder visits the node before the subtrees: node, left, right.", result: "II – M" },
      { say: "Postorder visits the node after the subtrees: left, right, node.", result: "III – N" },
    ], answer: "I – L, II – M, III – N", check: "The pre/in/post prefix says where the node goes relative to its subtrees." },
    { type: "example", id: "d7-e4", level: "gate", title: "GATE CS 2018 (forenoon), Q30 · 1 mark · NAT: height from two traversals", file: "gate2018_q30.txt", given: `Postorder: 8 9 6 7 4 5 2 3 1
Inorder:   8 6 9 4 7 2 5 1 3
Height = edges on the longest root-to-leaf path.`, find: "The height of the tree.", steps: [
      { say: "The last item of the postorder is the root: 1. In the inorder, 1 splits the sequence into the left part 8 6 9 4 7 2 5 and the right part 3.", result: "root 1; right child 3" },
      { say: "The left part's postorder is 8 9 6 7 4 5 2; its root is 2. In the inorder, 2 splits it into 8 6 9 4 7 and 5.", result: "2, right child 5" },
      { say: "Postorder 8 9 6 7 4: root 4; inorder splits 8 6 9 | 7. So 4 has left subtree 8 6 9 and right child 7.", result: "4 then 6" },
      { say: "Postorder 8 9 6: root 6, with left leaf 8 and right leaf 9.", result: "6 with leaves 8, 9" },
      { say: "The longest path is 1, 2, 4, 6, 8: four edges.", result: "4" },
    ], answer: "4", check: "The tree has 9 nodes: the nine labels all appear once." },
    { type: "example", id: "d7-e5", level: "easy", title: "Rebuild from preorder and inorder, then write the postorder", file: "rebuild.txt", given: `Preorder: 1 2 4 5 3
Inorder:  4 2 5 1 3`, find: "The postorder traversal.", steps: [
      { say: "The first preorder item, 1, is the root. In the inorder it splits 4 2 5 | 3.", result: "left 4 2 5, right 3" },
      { say: "The next preorder item, 2, is the root of the left part, which splits 4 | 5.", result: "2 with leaves 4 and 5" },
      { say: "Postorder is left, right, node: 4 5 2 for the left part, then 3, then the root 1.", result: "4 5 2 3 1" },
    ], answer: "4 5 2 3 1", check: "The tree is the one in the figure." },

    { type: "trap", wrong: "A full binary tree with n nodes has n / 2 leaves.", tempting: "Half of the nodes sound like leaves.", whyWrong: "Edges: n − 1 = 2 × (internal nodes), so internal = (n − 1)/2 and leaves = n − (n − 1)/2 = (n + 1)/2. For n = 3 that is 2 leaves, not 1.5.", rule: "Full binary tree: leaves = internal + 1.", ex: { code: "n = 7 perfect tree: internal nodes 3, leaves 4", out: "(7 + 1) / 2 = 4" } },
    { type: "trap", wrong: "Preorder visits the root last.", tempting: "'Post' and 'pre' are easy to swap.", whyWrong: "Preorder handles the node BEFORE (pre) its subtrees, so the root comes first. Postorder handles it AFTER, so the root comes last. Inorder puts the node between the subtrees.", rule: "pre = node first, in = node between, post = node last.", ex: { code: "tree 1 (2, 3): preorder 1 2 3; inorder 2 1 3; postorder 2 3 1", out: "root first / middle / last" } },
    { type: "trap", wrong: "The tree is fixed by its preorder and its postorder.", tempting: "Two traversals sound like plenty of information.", whyWrong: "Without the inorder the left and right subtrees cannot be told apart. A root 1 with only a left child 2 and a root 1 with only a right child 2 have the same preorder (1 2) and the same postorder (2 1), but they are different trees.", rule: "Inorder + one of the others rebuilds the tree.", ex: { code: "1 with left child 2   vs   1 with right child 2", out: "both: preorder 1 2, postorder 2 1" } },

    { type: "gate", text: "GATE 2026 FN Q33 (tallest full binary tree), 2026 AN Q12 (traversal definitions), 2025 AN Q13 (internal nodes of a full tree) and 2018 FN Q30 (height from two traversals) are tagged to this chapter; 2023 FN Q47 (a recursive function printing sums) uses a figure." },
    { type: "recall", cards: [
      { q: "How many edges has a tree with n nodes?", a: "n − 1." },
      { q: "Height of a single-node tree (edges)?", a: "0." },
      { q: "Full binary tree: leaves in terms of n?", a: "(n + 1)/2; internal nodes (n − 1)/2." },
      { q: "Tallest full binary tree on n nodes?", a: "Height (n − 1)/2." },
      { q: "Smallest height of a binary tree on n nodes?", a: "⌊log₂ n⌋ (a complete tree)." },
      { q: "Preorder, inorder, postorder?", a: "N L R, L N R, L R N." },
      { q: "Level order uses which structure?", a: "A queue." },
      { q: "Which two traversals rebuild a tree?", a: "Inorder plus preorder, or inorder plus postorder." },
      { q: "Children of node i in a 0-based array tree?", a: "2i + 1 and 2i + 2; parent ⌊(i − 1)/2⌋." },
      { q: "What is a perfect binary tree of height h?", a: "Full with all leaves at depth h: 2^(h+1) − 1 nodes." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "A full binary tree has 31 nodes. How many leaves does it have?", answer: "16", solution: "(n + 1) / 2 = 16." },
      { id: "h2", kind: "NAT", marks: 1, q: "What is the maximum height (in edges) of a full binary tree with 41 nodes?", answer: "20", solution: "(41 − 1) / 2 = 20." },
      { id: "h3", kind: "MCQ", marks: 1, q: "The inorder traversal visits the root", options: ["First", "Last", "Between the left and right subtrees", "Level by level"], answer: "C", solution: "Inorder is left, node, right." },
      { id: "h4", kind: "MCQ", marks: 1, q: "A binary tree has preorder 1 2 3 and postorder 3 2 1. Which statement is true?", options: ["The tree is a unique chain", "The tree is determined uniquely", "A left chain and a right chain are both possible", "No such tree exists"], answer: "C", solution: "Preorder 1 2 3 with postorder 3 2 1 fits several chains, left or right at each step." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which statements are true for every binary tree with n ≥ 1 nodes?", options: ["It has n − 1 edges", "Its height is at least ⌊log₂ n⌋", "A full one has (n + 1)/2 leaves", "Its postorder alone fixes its shape"], answer: "A, B, C", solution: "D is false: one traversal is never enough." },
      { id: "h6", kind: "NAT", marks: 2, q: "Preorder: A B D E C F. Inorder: D B E A C F. What is the height (in edges) of the tree?", answer: "2", solution: "Root A; left subtree B with leaves D, E; right subtree C with right child F. The longest paths A-B-D, A-B-E and A-C-F have 2 edges." },
      { id: "h7", kind: "NAT", marks: 2, q: "A complete binary tree is stored in an array with the root at index 0. At which index is the parent of the node stored at index 13?", answer: "6", solution: "(13 − 1) / 2 = 6." },
      { id: "h8", kind: "NAT", marks: 2, q: "A perfect binary tree has height 5 (in edges). How many nodes does it have?", answer: "63", solution: "2^(5+1) − 1 = 63." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on trees", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "next: binary search trees", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Recursion in C (C8)", "Pointers (C10)", "Linked lists (D3)", "Queues (D5)"], usedIn: ["Binary search trees (D8)", "Heaps (D10)", "Graph traversals", "Compiler design: parse trees"], cross: ["Algorithms: recursion trees"] },
  ],
};
