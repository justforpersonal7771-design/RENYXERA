import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D8 "Binary search trees" (28 Nov 2026). Real GATE questions (texts from public/data/questions.json):
 * 2025 AN Q35 (depth of 19 = 4), 2026 FN Q62 (position of 60 in the postorder = 7), 2020 FN Q15 (preorder to postorder, key B),
 * 2025 FN Q26 (MSQ, A and B), 2026 FN Q40 (complete BST, element 5 can never be third, key D), 2022 FN Q28 (index 509),
 * 2026 AN Q49 (MSQ, A and C). Programs compiled and run with gcc.
 */
export const chapterD8: Topic = {
  id: "cs.pds.ds.bst8",
  title: "Binary search trees",
  no: "D8",
  book: [
    { t: "p", text: "Searching a sorted array is fast (binary search, chapter D2) but inserting into it is slow, because items must shift. Searching a linked list allows quick inserts but is slow, because it cannot jump to the middle. A **binary search tree**, BST, aims for both: a tree arranged so that each comparison throws away about half of what remains, and where insertion only adds a leaf." },
    { t: "p", text: "The BST is one of the most examined structures in the whole paper. Questions ask you to build a tree from a sequence, read off a traversal, find a path length, apply deletion, and reason about the height. This chapter gives the rules, the three deletion cases, the connection with sorting, and the facts about height that decide the cost of everything." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["state the BST property and tell a valid BST from an invalid one;", "search, insert and delete, including the two-children case, and trace each by hand;", "build a BST from an insertion sequence or from a preorder traversal;", "use the fact that the inorder traversal of a BST is sorted;", "state the cost of every operation in terms of the height, from log n to n − 1."] },

    { t: "h2", text: "The BST property" },
    { t: "p", text: "A **binary search tree** is a binary tree in which, for **every** node, all keys in its **left** subtree are smaller than the node's key and all keys in its **right** subtree are larger. (We assume the keys are distinct; with duplicates the question says on which side an equal key goes.) The rule is about whole subtrees, not just the two children." },
    { t: "fig", id: "d8-f1" },
    { t: "p", text: "In the figure, every key in the left subtree of 50 (25, 13, 40) is below 50 and every key in the right subtree (75, 60, 80) is above it, and the same holds again inside each subtree. This property is what lets a search decide in one comparison which half to ignore." },
    { t: "callout", kind: "warning", text: "A tree can pass the check 'left child < node < right child' at every node and still not be a BST, because a deep key may break the rule for an ancestor. The rule is for whole subtrees." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Search and insert" },
    { t: "p", text: "To **search** for a key, start at the root. If the key equals the node's key, found. If it is smaller, go left; if larger, go right. If you fall off the tree (reach `NULL`), the key is absent. Each step goes one level down, so the cost is at most the **height** of the tree plus one." },
    { t: "p", text: "To **insert** a key, search for it as if it were present. The search ends at a `NULL` pointer, and that is exactly where the new key belongs: add a new leaf there. Nothing else moves. This means the tree's shape depends on the **order** in which the keys are inserted, a point that GATE returns to again and again." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct node { int key; struct node *left, *right; };

struct node *insert(struct node *p, int k) {
    if (p == NULL) {                         /* fell off the tree: the new leaf goes here */
        p = malloc(sizeof *p); p->key = k; p->left = p->right = NULL; return p;
    }
    if (k < p->key) p->left = insert(p->left, k);
    else if (k > p->key) p->right = insert(p->right, k);
    return p;
}

int depth(struct node *p, int k) {           /* edges from the root to k; -1 if absent */
    int d = 0;
    while (p != NULL) {
        if (k == p->key) return d;
        p = k < p->key ? p->left : p->right;
        d++;
    }
    return -1;
}

int main(void) {
    int a[] = {10, -4, 15, 30, 20, 5, 60, 19};
    struct node *root = NULL;
    for (int i = 0; i < 8; i++) root = insert(root, a[i]);
    printf("%d\\n", depth(root, 19));
    return 0;
}`, out: "4", file: "bst_insert.c" },
    { t: "p", text: "The program builds the tree of GATE 2025 (afternoon): 10 is the root; −4 goes left; 15 right; 30 is right of 15; 20 is left of 30; 5 is right of −4; 60 is right of 30; and 19 goes 10 → 15 → 30 → 20 → left of 20. The path from 19 to the root has 4 edges." },
    { t: "ex", id: "d8-e1" },
    { t: "fig", id: "d8-f2" },

    { t: "h2", text: "Inorder traversal gives sorted order" },
    { t: "p", text: "Inorder visits the left subtree, then the node, then the right subtree (chapter D7). In a BST everything on the left is smaller and everything on the right is larger, so by induction **the inorder traversal of a BST lists its keys in increasing order**. This is the most useful fact about BSTs: it gives a way to sort (insert all keys, then traverse), and it identifies the smallest key (leftmost node), the largest (rightmost node), and for any node its **inorder successor** and **predecessor**." },
    { t: "p", text: "The **successor** of a node with a right subtree is the leftmost node of that subtree. A node with no right subtree has as its successor the lowest ancestor of which it is in the left subtree. The **predecessor** is the mirror image. Both are used by deletion." },
    { t: "ex", id: "d8-e2" },

    { t: "h2", text: "Deleting a key" },
    { t: "p", text: "Deletion is the one operation that needs care, because the tree must stay a BST. Find the node, then there are three cases, by the number of children it has." },
    { t: "table", head: ["Case", "What to do"], rows: [["Leaf (no children)", "Remove it: set the parent's pointer to NULL."], ["One child", "Splice it out: the parent now points to the node's only child."], ["Two children", "Copy into the node the key of its inorder successor (the leftmost node of its right subtree), then delete that successor node, which has at most a right child. (The inorder predecessor works equally well.)"]] },
    { t: "fig", id: "d8-f3" },
    { t: "p", text: "The two-children case works because the inorder successor is the next key in sorted order: it is larger than everything in the left subtree and not larger than anything else in the right subtree, so it can sit in the removed node's place without breaking the BST property. The successor has no left child (it is the leftmost), so removing it falls into the easy cases." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct node { int key; struct node *left, *right; };

struct node *insert(struct node *p, int k) {
    if (p == NULL) { p = malloc(sizeof *p); p->key = k; p->left = p->right = NULL; return p; }
    if (k < p->key) p->left = insert(p->left, k); else p->right = insert(p->right, k);
    return p;
}

struct node *del(struct node *p, int k) {
    if (p == NULL) return NULL;
    if (k < p->key) p->left = del(p->left, k);
    else if (k > p->key) p->right = del(p->right, k);
    else if (p->left == NULL) { struct node *r = p->right; free(p); return r; }      /* 0 or 1 child */
    else if (p->right == NULL) { struct node *l = p->left; free(p); return l; }
    else {                                                                          /* two children */
        struct node *s = p->right;
        while (s->left != NULL) s = s->left;           /* inorder successor */
        p->key = s->key;
        p->right = del(p->right, s->key);
    }
    return p;
}

void inorder(struct node *p) { if (!p) return; inorder(p->left); printf("%d ", p->key); inorder(p->right); }

int main(void) {
    int a[] = {50, 25, 75, 13, 40, 60, 80, 30};
    struct node *root = NULL;
    for (int i = 0; i < 8; i++) root = insert(root, a[i]);
    root = del(root, 25);                              /* two children: replaced by 30 */
    root = del(root, 13);                              /* a leaf */
    inorder(root);
    printf("| %d\\n", root->left->key);
    return 0;
}`, out: "30 40 50 60 75 80 | 30", file: "bst_delete.c" },
    { t: "p", text: "Deleting 25 (which has the two children 13 and 40) copies 30, the leftmost node of the right subtree, into its place and removes the old 30. After that, deleting the leaf 13 is trivial. The inorder listing is still sorted and the left child of the root is now 30." },
    { t: "ex", id: "d8-e3" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Height decides the cost" },
    { t: "p", text: "Search, insert and delete each follow one path from the root, so each costs **Θ(height)**. How tall can a BST be? If the keys are inserted in **sorted order** (1, 2, 3, …) every new key goes to the right of the previous one and the tree becomes a chain: height **n − 1**, and every operation costs Θ(n), no better than a linked list. If the tree is **balanced** (about equal subtrees) the height is about log₂ n and every operation costs Θ(log n)." },
    { t: "fig", id: "d8-f4" },
    { t: "table", head: ["Shape of the tree on n keys", "Height (edges)", "Search, insert, delete"], rows: [["Chain (sorted insertion order)", "n − 1", "Θ(n)"], ["Complete or balanced", "⌊log₂ n⌋", "Θ(log n)"], ["Random insertion order", "about 2 ln n on average", "Θ(log n) expected"]] },
    { t: "p", text: "So the claim 'a BST finds a key in O(log n)' is **not** true in the worst case; it is true for balanced trees. Making the tree stay balanced automatically is the subject of AVL trees (chapter D9). A BST with n keys has exactly the same **n − 1** edges as any tree, and its **inorder** traversal is always sorted, whatever its shape." },
    { t: "ex", id: "d8-e4" },
    { t: "p", text: "Inserting new keys can change the height only by growing a path, and a new key always becomes a leaf. A harder GATE question asks what happens when a new key is added next to every leaf at once: each new key lands below an existing leaf, so the height rises by at most one." },
    { t: "ex", id: "d8-e8" },
    { t: "trap", i: 2 },

    { t: "h2", text: "Building a BST from a traversal" },
    { t: "p", text: "A BST is determined by its **preorder** traversal alone. This is special to BSTs (a general binary tree needs the inorder too): since the inorder of a BST is known to be the sorted keys, the sorted list supplies the missing inorder. In practice the quick method is simply to **insert the keys in the preorder order**: the first is the root, and the rest go where the BST rule puts them. The result is the BST whose preorder is the given sequence." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct node { int key; struct node *left, *right; };
struct node *insert(struct node *p, int k) {
    if (p == NULL) { p = malloc(sizeof *p); p->key = k; p->left = p->right = NULL; return p; }
    if (k < p->key) p->left = insert(p->left, k); else p->right = insert(p->right, k);
    return p;
}
int pos = 0;
void post(struct node *p, int want) {
    if (!p) return;
    post(p->left, want); post(p->right, want);
    pos++;
    if (p->key == want) printf("position of %d in postorder: %d\\n", want, pos);
}
int main(void) {
    int a[] = {50, 25, 13, 40, 30, 47, 75, 60, 70, 80, 77};
    struct node *root = NULL;
    for (int i = 0; i < 11; i++) root = insert(root, a[i]);
    post(root, 60);
    return 0;
}`, out: "position of 60 in postorder: 7", file: "preorder_to_bst.c" },
    { t: "ex", id: "d8-e5" },
    { t: "ex", id: "d8-e6" },

    { t: "h2", text: "A BST stored in an array" },
    { t: "p", text: "A **complete** BST can be stored in an array in the heap layout of chapter D7 (children of i at 2i + 1 and 2i + 2). The largest key is then the last node on the rightmost path, and the second and third largest are found by following the BST rules for predecessors. This is a known GATE combination of the three ideas." },
    { t: "ex", id: "d8-e7" },
  { t: "ex", id: "d8-e9" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "BST questions are of five kinds: **build and measure** (insert a sequence; the depth of a key, the height, the number of leaves: example 1), **traversals** (the postorder or the position in it: examples 5 and 6), **true or false statements** about BSTs (example 4), **special shapes** (a complete BST: examples 7 and the array question) and **insertion or deletion effects** (example 8)." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you apply the BST rule one key at a time without shortcuts, and whether you know that the tree's shape depends on the insertion order, while its inorder traversal never does." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Saying search in a BST is always O(log n); it is O(height), up to n.", "Checking only parent against children, not whole subtrees.", "In a two-children deletion, promoting a child instead of the inorder successor or predecessor.", "Forgetting that inserting sorted keys gives a chain of height n − 1.", "Thinking a BST is also a heap."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["BST: for every node, left subtree keys < node < right subtree keys.", "Search and insert follow one path: Θ(height). Insert adds a new leaf.", "Inorder traversal of a BST is sorted.", "Delete: leaf, one child (splice), two children (copy the inorder successor, delete it).", "Height ranges from ⌊log₂ n⌋ (balanced) to n − 1 (sorted insertion).", "A BST is fixed by its preorder; shape depends on insertion order."] },
  ],
  blocks: [
    { type: "figure", id: "d8-f1", caption: "A BST. 50 divides the keys: 25, 13, 40 to the left, 75, 60, 80 to the right; the same rule holds inside every subtree.", alt: "A binary search tree with root 50, left subtree 25 with 13 and 40, right subtree 75 with 60 and 80.", fig: { kind: "tree", title: "BST: left < node < right", root: { label: 50, kids: [{ label: 25, kids: [{ label: 13 }, { label: 40 }] }, { label: 75, kids: [{ label: 60 }, { label: 80 }] }] } } },
    { type: "figure", id: "d8-f2", caption: "The tree after inserting 10, −4, 15, 30, 20, 5, 60, 19. The path from 19 to the root is 19, 20, 30, 15, 10: four edges.", alt: "A binary search tree with root 10, left child -4 with right child 5, and right child 15 with right child 30 having children 20 and 60 and 20 having left child 19.", fig: { kind: "tree", title: "Inserted in the order 10, −4, 15, 30, 20, 5, 60, 19", root: { label: 10, kids: [{ label: -4, kids: [null, { label: 5 }] }, { label: 15, kids: [null, { label: 30, kids: [{ label: 20, kids: [{ label: 19, tone: "hl" }] }, { label: 60 }] }] }] } } },
    { type: "figure", id: "d8-f3", caption: "Deleting 25, which has two children. Its inorder successor 30 (the leftmost node of the right subtree) is copied into its place, and the old 30 leaf is removed.", alt: "Two frames: the tree with 25 having children 13 and 40, 40 having left child 30; then the same tree with 30 in place of 25 and 40 without its left child.", fig: { kind: "frames", title: "Delete 25", frames: [
      { caption: "Before: 25 has children 13 and 40. The leftmost node of its right subtree is 30.", fig: { kind: "tree", root: { label: 50, kids: [{ label: 25, tone: "bad", kids: [{ label: 13 }, { label: 40, kids: [{ label: 30, tone: "hl" }] }] }, { label: 75 }] } } },
      { caption: "After: 30 is copied into the node, and the old leaf 30 is removed.", fig: { kind: "tree", root: { label: 50, kids: [{ label: 30, tone: "ok", kids: [{ label: 13 }, { label: 40 }] }, { label: 75 }] } } },
    ] } },
    { type: "figure", id: "d8-f4", caption: "Keys inserted in sorted order (1, 2, 3, 4) form a chain: height n − 1 = 3. The same keys inserted as 3, 2, 4, 1 would give a tree of height 2.", alt: "A binary search tree that is a chain: 1 with right child 2, with right child 3, with right child 4.", fig: { kind: "tree", title: "Inserted in sorted order: a chain", root: { label: 1, kids: [null, { label: 2, kids: [null, { label: 3, kids: [null, { label: 4 }] }] }] } } },

    { type: "example", id: "d8-e1", level: "gate", title: "GATE CS 2025 (afternoon), Q35 · 1 mark · NAT: depth of a key", file: "gate2025_an_q35.txt", given: `Insert 10, −4, 15, 30, 20, 5, 60, 19 into an empty BST.
How many edges on the path from 19 to the root?`, find: "The number of edges.", steps: [
      { say: "10 is the root. −4 < 10: left. 15 > 10: right. 30 > 10, > 15: right of 15.", result: "10; −4; 15; 30" },
      { say: "20 < 30: left of 30. 5 > −4: right of −4. 60 > 30: right of 30.", result: "20, 5, 60 placed" },
      { say: "19: 19 > 10, > 15, < 30, < 20 → left of 20.", result: "path 10, 15, 30, 20, 19" },
      { say: "The path has five nodes, so four edges.", result: "4" },
    ], answer: "4", check: "The program in this chapter prints 4." },
    { type: "example", id: "d8-e2", level: "easy", title: "Inorder of a BST", file: "inorder_sorted.txt", given: `BST built by inserting 50, 25, 75, 13, 40, 60, 80, 30.`, find: "Its inorder traversal.", steps: [
      { say: "Inorder lists a BST in increasing order, whatever the shape.", result: "sorted" },
      { say: "Sort the keys.", result: "13 25 30 40 50 60 75 80" },
    ], answer: "13 25 30 40 50 60 75 80", check: "The same keys in another insertion order give a different tree but the same inorder." },
    { type: "example", id: "d8-e3", level: "gate", title: "Delete a node with two children", file: "delete_two.txt", given: `BST from 50, 25, 75, 13, 40, 60, 80, 30. Delete 25.`, find: "The new left child of the root.", steps: [
      { say: "25 has two children: 13 and 40. Its inorder successor is the leftmost node of its right subtree.", result: "40 → 30" },
      { say: "Copy 30 into 25's node and delete the old leaf 30.", result: "node 30; children 13 and 40" },
    ], answer: "The left child of the root becomes 30 (with children 13 and 40).", check: "Using the inorder predecessor instead (13) is also correct; the question says which." },
    { type: "example", id: "d8-e4", level: "gate", title: "GATE CS 2025 (forenoon), Q26 · 1 mark · MSQ: true statements about a BST", file: "gate2025_fn_q26.txt", given: `For any BST with n distinct integers, which are true?
(A) The maximum length of a path from the root to any other node is n − 1.
(B) An inorder traversal always produces a sorted sequence.
(C) Finding an element takes O(log₂ n) time in the worst case.
(D) Every BST is also a Min-Heap.`, find: "The true statements.", steps: [
      { say: "A: a chain has n nodes and n − 1 edges, which is the longest possible path.", result: "true" },
      { say: "B: inorder gives increasing order.", result: "true" },
      { say: "C: on a chain a search can take n steps.", result: "false" },
      { say: "D: a BST puts the smaller keys on the left, a Min-Heap needs the parent smaller than both children.", result: "false" },
    ], answer: "A and B", check: "C would be true only for balanced trees." },
    { type: "example", id: "d8-e5", level: "gate", title: "GATE CS 2026 (forenoon), Q62 · 2 marks · NAT: position in the postorder", file: "gate2026_q62.txt", given: `Preorder of a BST: 50, 25, 13, 40, 30, 47, 75, 60, 70, 80, 77.
The position (from 1) of 60 in the postorder?`, find: "The position.", steps: [
      { say: "Insert in the preorder order. Root 50; left subtree 25 (13; 40 with 30 and 47); right subtree 75 (60 with right child 70; 80 with left child 77).", result: "tree built" },
      { say: "Postorder: left subtree, right subtree, root. Left: 13, 30, 47, 40, 25.", result: "positions 1 to 5" },
      { say: "Right subtree: 70, 60, 77, 80, 75.", result: "positions 6 to 10" },
      { say: "60 is the second of them, at position 7. The root 50 comes last (11).", result: "7" },
    ], answer: "7", check: "The program in this chapter prints 7." },
    { type: "example", id: "d8-e6", level: "gate", title: "GATE CS 2020 (forenoon), Q15 · 1 mark · MCQ: preorder to postorder", file: "gate2020_q15.txt", given: `Preorder of a BST: 15, 10, 12, 11, 20, 18, 16, 19.
(A) 10, 11, 12, 15, 16, 18, 19, 20   (B) 11, 12, 10, 16, 19, 18, 20, 15
(C) 20, 19, 18, 16, 15, 12, 11, 10   (D) 19, 16, 18, 20, 11, 12, 10, 15`, find: "The postorder traversal.", steps: [
      { say: "Root 15. Keys below 15 (10, 12, 11) form the left subtree; keys above (20, 18, 16, 19) the right.", result: "split at 15" },
      { say: "Left: root 10, its right part 12, 11: 12 with left child 11. Postorder of the left subtree: 11, 12, 10.", result: "11 12 10" },
      { say: "Right: root 20; 18, 16, 19 are below it: 18 with children 16 and 19. Postorder: 16, 19, 18, 20.", result: "16 19 18 20" },
      { say: "Join: left, right, root.", result: "11 12 10 16 19 18 20 15" },
    ], answer: "B", check: "Option A is the inorder; C is its reverse." },
    { type: "example", id: "d8-e7", level: "gate", title: "GATE CS 2022 (forenoon), Q28 · 1 mark · NAT: a complete BST stored in an array", file: "gate2022_q28.txt", given: `A BST with 1000 distinct elements is also a complete binary tree, stored in an array with the heap layout, indices from 0.
The index of the 3rd largest element?`, find: "The index.", steps: [
      { say: "The largest key is the rightmost node: follow right children 0, 2, 6, 14, 30, 62, 126, 254, 510. The next one, 1022, is beyond index 999.", result: "largest at 510" },
      { say: "Node 510 has no left child (1021 > 999), so the next smaller key is its parent, where we last went right.", result: "2nd largest at 254" },
      { say: "254 has a left subtree. The next smaller key is its rightmost node: left child 509, and 509 has no right child (1020 > 999).", result: "3rd largest at 509" },
    ], answer: "509", check: "The three largest keys sit at indices 510, 254 and 509." },
    { type: "example", id: "d8-e8", level: "gate", title: "GATE CS 2026 (afternoon), Q49 · 2 marks · MSQ: keys between a leaf and its successor", file: "gate2026_an_q49.txt", given: `A BST with n leaves, distinct real keys. For every leaf L with a non-NULL inorder successor, a new key k with Val(L) < k < Val(Suc(L)) is inserted.
K = the list of new keys.
(A) K has no duplicates  (B) K has at least one element
(C) the height increases by at most one  (D) the number of nodes doubles`, find: "The true statements.", steps: [
      { say: "A: different leaves have different successors or lie in different gaps of the inorder; each new key lies strictly between two consecutive existing keys, so the keys can be chosen distinct. So K can be taken to have no duplicates.", result: "true" },
      { say: "B: with n = 1 the single node is a leaf with no successor, so K is empty.", result: "false" },
      { say: "C: a leaf has no right child, so its successor is an ancestor and k lies between the leaf and that ancestor: k becomes the right child of the leaf, one level lower.", result: "true" },
      { say: "D: at most n keys are added, but the tree can have far more than n nodes (internal ones).", result: "false" },
    ], answer: "A and C", check: "Test with the tree 2 (1, 3): leaves 1 and 3; successor of 1 is 2, of 3 none; K has one key, between 1 and 2; the height rises from 1 to 2." },

    { type: "example", id: "d8-e9", level: "gate", title: "GATE CS 2026 (forenoon), Q40 · 2 marks · MCQ: the third key inserted into a complete BST", file: "gate2026_q40.txt", given: `P = {1, ..., 15}. Keys are inserted into a BST in some order that creates a complete binary tree.
Which element can NEVER be the third inserted?  (A) 4  (B) 2  (C) 10  (D) 5`, find: "The element.", steps: [
      { say: "15 keys in a complete tree make a perfect tree of height 3. The root must be 8. Level 1 holds 4 and 12, level 2 holds 2, 6, 10, 14, and the leaves are the odd numbers.", result: "root 8; leaves 1, 3, 5, ..." },
      { say: "In any insertion order a node arrives after its parent. The first key inserted is the root, 8.", result: "1st = 8" },
      { say: "The second is at level 1 (4 or 12). The third can then be the other level-1 key or a level-2 child of the second one, but never a leaf (level 3), whose parent and grandparent are not both in yet.", result: "third is at level 1 or 2" },
      { say: "4 is at level 1, 2 and 10 are at level 2 (possible: 8, 4, 2 or 8, 12, 10). 5 is a leaf at level 3.", result: "5 is impossible" },
    ], answer: "D: 5", check: "A leaf needs its parent and its grandparent inserted first, so at least 3 keys come before it: it can be at best fourth." },

    { type: "trap", wrong: "A tree is a BST if every node is larger than its left child and smaller than its right child.", tempting: "That is how the rule is usually drawn.", whyWrong: "The rule covers whole subtrees. In the tree 10 (left 5, right 15 with left child 8), 15 > 10 is fine and 8 < 15 is fine, but 8 sits in the right subtree of 10 and is smaller than 10. It is not a BST.", rule: "Every key in the left subtree < node < every key in the right subtree.", ex: { code: "10 -> right 15 -> left 8   (8 < 10 but it is on the right of 10)", out: "not a BST" } },
    { type: "trap", wrong: "To delete a node with two children, promote its left child.", tempting: "Promoting a child worked for the one-child case.", whyWrong: "Promoting one child abandons the other subtree or breaks the ordering. The replacement must be the next key in sorted order: the inorder successor (leftmost in the right subtree) or the inorder predecessor (rightmost in the left subtree).", rule: "Two children: copy the inorder successor (or predecessor), then delete that node.", ex: { code: "delete 25 from  25(13, 40(30)):  successor is 30", out: "30(13, 40)" } },
    { type: "trap", wrong: "Searching a BST takes O(log n) in the worst case.", tempting: "Each step discards a subtree.", whyWrong: "The subtree discarded can be empty. If the keys were inserted in sorted order, the tree is a chain of height n − 1 and a search can visit all n nodes. O(log n) holds only for a balanced tree.", rule: "Search, insert, delete cost Θ(height); worst-case height is n − 1.", ex: { code: "insert 1, 2, 3, 4, 5 in order; search for 5", out: "5 comparisons" } },

    { type: "gate", text: "GATE 2025 AN Q35 (depth in a BST), 2026 FN Q62 (postorder position from a preorder), 2020 FN Q15, 2025 FN Q26 (MSQ), 2026 FN Q40, 2022 FN Q28 and 2026 AN Q49 are tagged to this chapter. 2026 FN Q40 (a complete BST: which element can never be the third inserted) is example 9." },
    { type: "recall", cards: [
      { q: "State the BST property.", a: "For every node, all keys in the left subtree are smaller and all in the right subtree larger." },
      { q: "What does an inorder traversal of a BST give?", a: "The keys in increasing order." },
      { q: "Where does a new key go in a BST?", a: "As a new leaf, at the NULL where its search ends." },
      { q: "Three cases of deletion?", a: "Leaf: remove; one child: splice; two children: copy the inorder successor, delete it." },
      { q: "Inorder successor of a node with a right subtree?", a: "The leftmost node of the right subtree." },
      { q: "Cost of search, insert, delete?", a: "Θ(height): Θ(log n) balanced, Θ(n) in the worst case." },
      { q: "Height after inserting 1, 2, ..., n in order?", a: "n − 1 (a chain)." },
      { q: "What fixes a BST uniquely?", a: "Its preorder (or postorder); insert the keys in that order." },
      { q: "Is every BST a heap?", a: "No: a heap orders parent against children, a BST orders left against right." },
      { q: "Does the shape depend on insertion order?", a: "Yes; the inorder does not." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "Keys 8, 3, 10, 1, 6, 14, 4, 7, 13 are inserted into an empty BST in this order. What is the height (in edges)?", answer: "3", solution: "8; 3, 10; 1, 6, 14; 4, 7 under 6; 13 under 14: the deepest is 4 (8-3-6-4), 3 edges." },
      { id: "h2", kind: "MCQ", marks: 1, q: "The inorder traversal of a BST on 10 distinct keys is", options: ["In decreasing order", "In increasing order", "Level by level", "Random"], answer: "B", solution: "Always sorted ascending." },
      { id: "h3", kind: "NAT", marks: 1, q: "The keys 1, 2, 3, 4, 5, 6 are inserted in this order into a BST. What is the height (in edges)?", answer: "5", solution: "A chain: n − 1." },
      { id: "h4", kind: "MCQ", marks: 1, q: "Which node replaces a deleted node with two children?", options: ["Its parent", "Its inorder successor or predecessor", "Its left child always", "The root"], answer: "B", solution: "The next or previous key in sorted order." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true for every BST?", options: ["Inorder is sorted", "Height is at most n − 1", "Search is O(log n) in the worst case", "It is a complete tree"], answer: "A, B", solution: "C and D are false." },
      { id: "h6", kind: "NAT", marks: 2, q: "Preorder of a BST: 20, 10, 5, 15, 30, 25, 35. How many leaves does it have?", answer: "4", solution: "20; left 10 (5, 15); right 30 (25, 35): leaves 5, 15, 25, 35." },
      { id: "h7", kind: "NAT", marks: 2, q: "BST from the keys 40, 20, 60, 10, 30, 50, 70. Delete 40 using the inorder successor. What is the new root key?", answer: "50", solution: "The leftmost node of the right subtree (60 → 50) is 50." },
      { id: "h8", kind: "NAT", marks: 2, q: "A BST is built by inserting 1 to 15 in an order that makes a perfect tree. What is the number of comparisons to find the key 1 (count each node on the path)?", answer: "4", solution: "The path is 8, 4, 2, 1: four nodes." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on BSTs and heaps", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "next: heaps", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Trees and binary trees (D7)", "Recursion in C (C8)", "Arrays (D2)"], usedIn: ["AVL trees (D9)", "Sorting with trees", "Heaps (D10)"], cross: ["Algorithms: searching and sorting"] },
  ],
};
