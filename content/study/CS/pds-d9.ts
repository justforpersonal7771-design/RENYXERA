import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D9 "AVL trees: staying balanced" (28 Nov 2026). Real GATE question (text from public/data/questions.json):
 * 2020 FN Q16 (insert n^2 elements into an AVL tree of n elements: Θ(n² log n), key C). Programs compiled and run with gcc:
 * inserting 10 20 30 40 50 25 gives the preorder 30 20 10 25 40 50 (height 2); inserting 1..7 gives 4 2 1 3 6 5 7; fewest nodes by height 1 2 4 7 12 20.
 */
export const chapterD9: Topic = {
  id: "cs.pds.ds.avl9",
  title: "AVL trees: staying balanced",
  no: "D9",
  book: [
    { t: "p", text: "In chapter D8 we saw the weakness of the binary search tree: insert the keys in sorted order and it becomes a chain of height n − 1, and every operation is as slow as on a linked list. An **AVL tree** removes the weakness. It is a binary search tree that **repairs itself** after every insert and delete, so its height always stays within a small constant of log₂ n." },
    { t: "p", text: "The repair is made with a small local move called a **rotation**, which changes the shape of a tree without breaking the search order. This chapter shows what 'balanced' means for an AVL tree, how the four rotation cases are chosen, how tall an AVL tree can be, and what GATE asks about all of this." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["compute the balance factor of every node and say whether a tree is an AVL tree;", "identify the four imbalance cases (LL, RR, LR, RL) and the rotation for each;", "insert keys into an AVL tree and draw the result;", "find the fewest nodes of an AVL tree of a given height and the tallest AVL tree for given n;", "state the cost of every operation and explain why it is Θ(log n) in the worst case."] },

    { t: "h2", text: "The balance condition" },
    { t: "p", text: "The **balance factor** of a node is the height of its left subtree minus the height of its right subtree. (Some books use right minus left; only the absolute value matters.) An **AVL tree** is a binary search tree in which **every node** has a balance factor of −1, 0 or +1. That is: at every node the two subtrees differ in height by at most 1." },
    { t: "fig", id: "d9-f1" },
    { t: "p", text: "The condition must hold at **every** node, not only at the root. A tree whose root is balanced but which has a badly lopsided subtree further down is not an AVL tree. Note also what the rule does not say: the leaves need not all be on one level, and the tree need not be complete. It only forbids a subtree from being more than one level taller than its sibling." },
    { t: "callout", kind: "key", text: "AVL tree = BST + at every node |height(left) − height(right)| ≤ 1." },
    { t: "p", text: "To check a tree by hand, write the height next to every node, working from the leaves up (a leaf is 0, or 1 if you count nodes), and then the difference between its two children beside it. One difference of 2 or more anywhere is enough to say the tree is not an AVL tree." },
    { t: "ex", id: "d9-e1" },
    { t: "trap", i: 0 },

    { t: "h2", text: "How tall can an AVL tree be?" },
    { t: "p", text: "The balance rule keeps the tree short, and we can say how short by asking the opposite question: what is the **fewest** nodes an AVL tree of height h can have? Call it N(h). The sparsest AVL tree of height h has a root whose one subtree has height h − 1 (as sparse as possible) and whose other subtree has height h − 2, the smallest height the rule allows. So" },
    { t: "callout", kind: "key", text: "N(h) = N(h − 1) + N(h − 2) + 1, with N(0) = 1 and N(1) = 2." },
    { t: "p", text: "This is the Fibonacci recurrence with an extra 1, so N(h) grows exponentially: it multiplies by about 1.618 each level. Turning it around, a tree with n nodes has height at most about **1.44 log₂ n**. So an AVL tree is never more than 44% taller than a perfect tree, and its height is **Θ(log n)** always." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n[8]; n[0] = 1; n[1] = 2;                 /* fewest nodes of an AVL tree of height 0 and 1 */
    for (int h = 2; h < 8; h++) n[h] = n[h - 1] + n[h - 2] + 1;
    for (int h = 0; h < 6; h++) printf("%d ", n[h]);
    return 0;
}`, out: "1 2 4 7 12 20", file: "avl_min_nodes.c" },
    { t: "p", text: "A height-5 AVL tree needs at least 20 nodes, and a height-4 tree at least 12. So the tallest AVL tree with n nodes has the largest height h whose N(h) is at most n: with 20 nodes the height can reach 5, but with 19 nodes only 4." },
    { t: "p", text: "The reverse reading is just as useful: with n nodes the shortest possible tree has height ⌊log₂ n⌋ (a complete tree), and the tallest AVL tree has height about 1.44 log₂ n. Between them lies the whole range an AVL tree can occupy, always Θ(log n)." },
    { t: "ex", id: "d9-e2" },

    { t: "h2", text: "Rotations" },
    { t: "p", text: "A **rotation** rearranges three nodes (and their subtrees) so that the tree gets shorter on one side, and it **preserves the inorder order** of the keys, so the BST property survives. A single rotation changes only a few pointers: Θ(1)." },
    { t: "p", text: "Suppose a new key makes some node z unbalanced: the first node, going up from the new leaf, whose balance factor becomes +2 or −2. There are four cases, named by the path from z to the new key: **L**eft then **L**eft, **R**ight then **R**ight, Left then Right, Right then Left." },
    { t: "table", head: ["Case", "Where the new key went", "Fix"], rows: [["LL", "left child's left subtree", "one rotation to the right at z"], ["RR", "right child's right subtree", "one rotation to the left at z"], ["LR", "left child's right subtree", "rotate left at the left child, then right at z (double rotation)"], ["RL", "right child's left subtree", "rotate right at the right child, then left at z (double rotation)"]] },
    { t: "fig", id: "d9-f2" },
    { t: "p", text: "Take the simplest case, RR: insert 10, 20, 30 in order. Each key goes to the right of the previous, so the tree is a chain 10 → 20 → 30. At 10 the balance factor is −2 (left empty, right height 2). One left rotation at 10 lifts 20 to the top, with 10 and 30 as its children: a perfect tree of height 1. The inorder order 10, 20, 30 is unchanged." },
    { t: "fig", id: "d9-f3" },
    { t: "p", text: "The double cases arise when the new key lies in the **inner** subtree (left child's right, or right child's left). A single rotation would just move the problem to the other side, so we first rotate the child to turn the inner case into an outer one, and then rotate at z. Insert 30, 10, 20: the key 20 goes to the right of 10, which is the left child of 30 (case LR). Rotate left at 10 (making 20 the left child of 30), then right at 30: the result has 20 on top with children 10 and 30." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct node { int key, h; struct node *left, *right; };

int ht(struct node *p) { return p ? p->h : 0; }                 /* height in nodes; empty = 0 */
void fix(struct node *p) { int a = ht(p->left), b = ht(p->right); p->h = 1 + (a > b ? a : b); }
int bal(struct node *p) { return ht(p->left) - ht(p->right); }  /* balance factor */

struct node *rot_right(struct node *y) { struct node *x = y->left; y->left = x->right; x->right = y; fix(y); fix(x); return x; }
struct node *rot_left(struct node *x)  { struct node *y = x->right; x->right = y->left; y->left = x; fix(x); fix(y); return y; }

struct node *insert(struct node *p, int k) {
    if (!p) { p = malloc(sizeof *p); p->key = k; p->h = 1; p->left = p->right = NULL; return p; }
    if (k < p->key) p->left = insert(p->left, k); else p->right = insert(p->right, k);
    fix(p);
    int b = bal(p);
    if (b > 1 && k < p->left->key)  return rot_right(p);                                  /* LL */
    if (b < -1 && k > p->right->key) return rot_left(p);                                  /* RR */
    if (b > 1 && k > p->left->key)  { p->left = rot_left(p->left); return rot_right(p); }   /* LR */
    if (b < -1 && k < p->right->key) { p->right = rot_right(p->right); return rot_left(p); } /* RL */
    return p;
}

void pre(struct node *p) { if (!p) return; printf("%d ", p->key); pre(p->left); pre(p->right); }

int main(void) {
    int a[] = {10, 20, 30, 40, 50, 25};
    struct node *t = NULL;
    for (int i = 0; i < 6; i++) t = insert(t, a[i]);
    pre(t);
    printf("| height %d\\n", t->h - 1);
    struct node *s = NULL;
    for (int k = 1; k <= 7; k++) s = insert(s, k);
    pre(s);
    return 0;
}`, out: "30 20 10 25 40 50 | height 2\n4 2 1 3 6 5 7 ", file: "avl_insert.c" },
    { t: "p", text: "The program is a BST insert followed by the repair on the way back up: after the recursive call it recomputes the height of the node, finds the balance factor, and applies whichever of the four fixes fits. Inserting 10, 20, 30, 40, 50, 25 ends with 30 at the root, 20 and 40 as its children, 10 and 25 under 20 and 50 under 40: height 2. Inserting the sorted keys 1 to 7, which would make a chain in a plain BST, gives the perfect tree rooted at 4." },
    { t: "ex", id: "d9-e3" },
    { t: "ex", id: "d9-e4" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Cost of the operations" },
    { t: "p", text: "Search follows one path, so it costs Θ(height) = **Θ(log n)** in the worst case, which a plain BST cannot promise. Insert is a search (log n), then the walk back up fixing heights, and **at most one rotation** (single or double) restores balance after an insert, because the rotation brings the subtree back to the height it had before. So insert is Θ(log n). Delete is also Θ(log n), but it may need a rotation at several levels on the way up." },
    { t: "p", text: "The price of the guarantee is the extra work and memory: each node stores its height (or a balance factor of two bits), and each insert and delete does a little more work. For many keys with mixed lookups AVL trees are an excellent choice; a related structure, the red-black tree, balances less strictly and is a little cheaper to update." },
    { t: "table", head: ["Operation", "BST (worst)", "AVL tree (worst)"], rows: [["Search", "Θ(n)", "Θ(log n)"], ["Insert", "Θ(n)", "Θ(log n)"], ["Delete", "Θ(n)", "Θ(log n)"], ["Build from n keys", "Θ(n²)", "Θ(n log n)"], ["Inorder traversal", "Θ(n)", "Θ(n)"]] },
    { t: "p", text: "A common way to use this in a question is to bound a whole sequence: m operations on an AVL tree of at most N elements cost at most m × O(log N). When N is a polynomial in n, such as n² + n, the logarithm is still Θ(log n), because log(n²) is only 2 log n." },
    { t: "ex", id: "d9-e5" },
    { t: "trap", i: 2 },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "AVL questions are asked in three forms: the **cost** of a sequence of operations (example 5), **insertion traces** that end in a rotation (examples 3 and 4), and **counting** questions: the fewest nodes for a height, or the tallest tree for n nodes (example 2). Direct statements about balance factors also appear in true-false lists (example 1)." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you know that the height of an AVL tree is Θ(log n) so each operation is Θ(log n), and whether you can find the unbalanced node and pick the right rotation. Always look for the lowest unbalanced node on the path from the new key to the root." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Checking the balance factor only at the root.", "Using a single rotation for an inner (LR or RL) case.", "Confusing the height of a leaf: edges (leaf = 0) or nodes (leaf = 1). The balance factor is the same either way.", "Using n instead of n + n² as the size when inserting many keys: log(n² + n) is still Θ(log n).", "Thinking an AVL tree must be complete or have all leaves on one level."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["AVL tree: a BST in which every node's two subtrees differ in height by at most 1.", "Fewest nodes of height h: N(h) = N(h − 1) + N(h − 2) + 1, N(0) = 1, N(1) = 2: 1, 2, 4, 7, 12, 20, …", "Height is Θ(log n): at most about 1.44 log₂ n.", "Rotations (Θ(1)) preserve the inorder. LL: rotate right. RR: rotate left. LR and RL: double rotation.", "At most one rotation (single or double) after an insert; deletes may need more.", "Search, insert and delete are Θ(log n) in the worst case; building from n keys is Θ(n log n)."] },
  ],
  blocks: [
    { type: "figure", id: "d9-f1", caption: "An AVL tree. Balance factors (left height − right height) are 0 at 30, +1 at 20, 0 at 10 and 25, and −1 at 40; none is outside −1 to +1.", alt: "A binary search tree with root 30, left child 20 with leaves 10 and 25, and right child 40 with right child 50.", fig: { kind: "tree", title: "AVL tree on 10, 20, 25, 30, 40, 50", root: { label: 30, kids: [{ label: 20, kids: [{ label: 10 }, { label: 25 }] }, { label: 40, kids: [null, { label: 50 }] }] } } },
    { type: "figure", id: "d9-f2", caption: "The four imbalance cases and their fixes. The path from the unbalanced node z towards the new key decides the case.", alt: "A table of the four cases LL, RR, LR and RL with the rotation used for each.", fig: { kind: "matrix", title: "Choosing the rotation", cols: ["balance of z", "child's balance", "fix"], rows: [{ label: "LL", cells: ["+2", "+1 or 0", "rotate right at z"] }, { label: "RR", cells: ["−2", "−1 or 0", "rotate left at z"] }, { label: "LR", cells: ["+2", "−1", "rotate left at the child, then right at z"], hl: true }, { label: "RL", cells: ["−2", "+1", "rotate right at the child, then left at z"], hl: true }] } },
    { type: "figure", id: "d9-f3", caption: "Insert 10, 20, 30. The chain is unbalanced at 10 (balance −2). One left rotation at 10 lifts 20 to the top.", alt: "Two frames: the chain 10, 20, 30 leaning right, then the balanced tree with 20 at the root and 10 and 30 as children.", fig: { kind: "frames", title: "Rotate left at 10", frames: [
      { caption: "After inserting 30: 10 has no left child and a right subtree of height 2, so its balance is −2.", fig: { kind: "tree", root: { label: 10, tone: "bad", kids: [null, { label: 20, kids: [null, { label: 30, tone: "hl" }] }] } } },
      { caption: "After the left rotation: 20 is the root, 10 and 30 its children. All balances are 0.", fig: { kind: "tree", root: { label: 20, tone: "ok", kids: [{ label: 10 }, { label: 30 }] } } },
    ] } },

    { type: "example", id: "d9-e1", level: "easy", title: "Is it an AVL tree?", file: "avl_check.txt", given: `BST: root 50; left child 30 with children 20 and 40; right child 70 with right child 80, which has right child 90.`, find: "Whether it is an AVL tree.", steps: [
      { say: "Heights (leaf = 0): 20, 40: 0. 30: 1. 90: 0. 80: 1. 70: 2 (left empty, right 80 of height 1).", result: "heights computed" },
      { say: "Balance of 70: left height −1 (empty), right height 1: difference 2.", result: "|bf| = 2" },
      { say: "The rule fails at 70, even though the root's balance is fine (left 2, right 3).", result: "not an AVL tree" },
    ], answer: "Not an AVL tree: node 70 is unbalanced", check: "Every node must be checked, not just the root." },
    { type: "example", id: "d9-e2", level: "gate", title: "Fewest nodes, tallest tree", file: "avl_height.txt", given: `N(h) = fewest nodes in an AVL tree of height h (a leaf has height 0).
(a) N(5)?   (b) The greatest height an AVL tree with 15 nodes can have?`, find: "Both.", steps: [
      { say: "N(0) = 1, N(1) = 2, then N(h) = N(h − 1) + N(h − 2) + 1: 4, 7, 12, 20.", result: "N(5) = 20" },
      { say: "The tallest tree on 15 nodes has the largest h with N(h) ≤ 15. N(4) = 12 ≤ 15, N(5) = 20 > 15.", result: "h = 4" },
    ], answer: "(a) 20  (b) 4", check: "The program in this chapter prints 1 2 4 7 12 20." },
    { type: "example", id: "d9-e3", level: "gate", title: "Insert 10, 20, 30, 40, 50, 25 into an AVL tree", file: "avl_trace.txt", given: `Insert in this order into an empty AVL tree.`, find: "The preorder traversal and the height of the final tree.", steps: [
      { say: "10, 20, 30: a right chain. Unbalanced at 10 (RR): rotate left. Tree: 20 (10, 30).", result: "20 (10, 30)" },
      { say: "40: right of 30. 50: right of 40; 30 is now unbalanced (RR): rotate left at 30. Tree: 20 (10, 40 (30, 50)).", result: "20 (10, 40 (30, 50))" },
      { say: "25: goes 20 → 40 → 30 → left of 30. Now 20 has left height 1 and right height 3: unbalanced (RL, since 25 went into the right child's left subtree).", result: "RL at 20" },
      { say: "Rotate right at 40, then left at 20. The root becomes 30, with 20 (10, 25) and 40 (−, 50).", result: "30 (20 (10, 25), 40 (−, 50))" },
    ], answer: "Preorder 30 20 10 25 40 50; height 2", check: "The program in this chapter prints the same." },
    { type: "example", id: "d9-e4", level: "easy", title: "Sorted insertion into an AVL tree", file: "avl_sorted.txt", given: `Insert 1, 2, 3, 4, 5, 6, 7 in order into an AVL tree.`, find: "The root and the height.", steps: [
      { say: "Each right-leaning chain is repaired by a left rotation as soon as it appears (after 3, 5 and 7, and after a double move at 6).", result: "a rotation every few inserts" },
      { say: "The final tree is the perfect tree with root 4: preorder 4 2 1 3 6 5 7.", result: "height 2" },
    ], answer: "Root 4; height 2 (a plain BST would have height 6)", check: "7 nodes fit exactly in a perfect tree of height 2: 2³ − 1." },
    { type: "example", id: "d9-e5", level: "gate", title: "GATE CS 2020 (forenoon), Q16 · 1 mark · MCQ: inserting n² elements into an AVL tree", file: "gate2020_q16.txt", given: `What is the worst-case time of inserting n² elements into an AVL tree that initially has n elements?
(A) Θ(n⁴)  (B) Θ(n²)  (C) Θ(n² log n)  (D) Θ(n³)`, find: "The correct option.", steps: [
      { say: "Each insert costs Θ(log m), where m is the current number of elements.", result: "Θ(log m)" },
      { say: "m is between n and n² + n, so log m is between log n and about 2 log n: always Θ(log n).", result: "Θ(log n) each" },
      { say: "There are n² inserts: n² × log n.", result: "Θ(n² log n)" },
    ], answer: "C: Θ(n² log n)", check: "A plain BST could take Θ(n) per insert and Θ(n³) overall; the AVL guarantee prevents it." },

    { type: "trap", wrong: "A tree is an AVL tree if the root's two subtrees differ in height by at most 1.", tempting: "The root is the first thing you look at.", whyWrong: "The rule must hold at every node. A tree can have a balanced root and a lopsided subtree lower down. Compute the balance factor of every node, from the leaves up.", rule: "Every node: |left height − right height| ≤ 1.", ex: { code: "50 (30 (20,40), 70 (-, 80 (-, 90)))", out: "root ok (2 vs 3) but 70 is −2: not AVL" } },
    { type: "trap", wrong: "Fix an LR imbalance with a single right rotation.", tempting: "The left side is too tall, so rotate right.", whyWrong: "In the LR case the extra height is in the left child's RIGHT subtree. A single right rotation would just move that tall subtree to the other side and the node would still be unbalanced. First rotate left at the child, to make it an LL case, then rotate right.", rule: "LL and RR: single rotation. LR and RL: double rotation.", ex: { code: "insert 30, 10, 20: 20 is inside 10's right", out: "rotate left at 10, then right at 30: root 20" } },
    { type: "trap", wrong: "A tree of height 5 needs at least 32 nodes to be an AVL tree.", tempting: "A full tree of height 5 has 2⁶ − 1 = 63 nodes, so 32 seems the minimum.", whyWrong: "The balance rule allows the two subtrees to differ by 1, so the sparsest AVL tree of height h has N(h − 1) + N(h − 2) + 1 nodes: 1, 2, 4, 7, 12, 20. A height-5 AVL tree needs only 20.", rule: "N(h) = N(h − 1) + N(h − 2) + 1.", ex: { code: "N(5) = N(4) + N(3) + 1 = 12 + 7 + 1", out: "20" } },

    { type: "gate", text: "GATE 2020 FN Q16 (inserting n² elements into an AVL tree) is the AVL question tagged to this chapter. The facts here (log-height, the four rotations, N(h)) also back the cost parts of the BST and heap questions." },
    { type: "recall", cards: [
      { q: "What is the balance factor?", a: "Height of the left subtree minus height of the right subtree." },
      { q: "What does an AVL tree require?", a: "A BST in which every node has a balance factor of −1, 0 or +1." },
      { q: "Fewest nodes N(h) of an AVL tree of height h?", a: "N(h) = N(h − 1) + N(h − 2) + 1; N(0) = 1, N(1) = 2." },
      { q: "Height of an AVL tree on n nodes?", a: "Θ(log n), at most about 1.44 log₂ n." },
      { q: "Which rotation fixes LL? RR?", a: "Right rotation; left rotation." },
      { q: "Which fixes LR? RL?", a: "Left at the child then right at the node; right at the child then left at the node." },
      { q: "How many rotations can an insert need?", a: "At most one (single or double)." },
      { q: "Cost of search, insert, delete in an AVL tree?", a: "Θ(log n) worst case." },
      { q: "What does a rotation preserve?", a: "The inorder order of the keys, so the BST property." },
      { q: "Cost of one rotation?", a: "Θ(1)." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "What is the fewest number of nodes in an AVL tree of height 4 (a single node has height 0)?", answer: "12", solution: "N(4) = N(3) + N(2) + 1 = 7 + 4 + 1." },
      { id: "h2", kind: "MCQ", marks: 1, q: "Inserting 5, 6, 7 into an empty AVL tree makes the root", options: ["5", "6", "7", "5 and 6 swap only"], answer: "B", solution: "RR case: rotate left at 5, root 6." },
      { id: "h3", kind: "MCQ", marks: 1, q: "The worst-case time to search an AVL tree with n keys is", options: ["Θ(1)", "Θ(log n)", "Θ(n)", "Θ(n log n)"], answer: "B", solution: "Height is Θ(log n)." },
      { id: "h4", kind: "NAT", marks: 1, q: "Insert 3, 2, 1 into an empty AVL tree. What is the preorder's first key?", answer: "2", solution: "LL case: rotate right at 3; root 2." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true for an AVL tree?", options: ["Every node's balance factor is −1, 0 or +1", "It is always a complete binary tree", "A rotation preserves the inorder sequence", "An insert needs at most one rotation (single or double)"], answer: "A, C, D", solution: "AVL trees need not be complete." },
      { id: "h6", kind: "NAT", marks: 2, q: "Insert 50, 20, 60, 10, 8, 15 in order into an AVL tree. What is the height (in edges) of the final tree?", answer: "2", solution: "After 10, 8 the node 20 is unbalanced (LL): rotate right at 20 giving 10 (8, 20). Then 15 goes under 20. Root 50 (10 (8, 20 (15)), 60): the left subtree has height 2, the right 0: unbalanced at 50, LR: rotating gives root 20 with children 10 (8, 15) and 50 (−, 60): height 2." },
      { id: "h7", kind: "NAT", marks: 2, q: "What is the greatest height of an AVL tree with 30 nodes? (A single node has height 0.)", answer: "5", solution: "N(5) = 20 ≤ 30 but N(6) = 20 + 12 + 1 = 33 > 30, so the greatest height is 5." },
      { id: "h8", kind: "NAT", marks: 2, q: "A BST built by inserting 1, 2, ..., 15 in order has height h1. An AVL tree built by the same insertions has height h2. What is h1 − h2?", answer: "11", solution: "h1 = 14 (a chain). The AVL tree is the perfect tree of height 3. 14 − 3 = 11." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on BSTs and heaps", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "back to the contents", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Binary search trees (D8)", "Counting and growth (D1)", "Recursion (C8)"], usedIn: ["Algorithms: balanced search trees", "Databases: B-trees (the same balancing idea)"], cross: ["Algorithms: recurrences"] },
  ],
};
