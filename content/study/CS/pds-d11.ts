import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D11 "Multi-way trees: B-trees and B+ trees" (29 Nov 2026), an enrichment chapter: the B and B+ tree questions of the paper
 * sit in the Databases subject (file organisation and indexing). Real GATE questions (texts from public/data/questions.json, figure from
 * public/images/2025-FN/21_1.png): 2020 FN Q51 (4 disk accesses), 2017 AN Q54 (order 52), 2019 FN Q20 (statement B), 2024 FN Q11 (only the root), 2025 FN Q21
 * (B and D), 2025 AN Q57 (33). Program compiled and run with gcc: block 4096, key 12, pointer 8 gives order 205, leaf 204, 4 accesses; block 512, key 8, pointer 2 gives 52.
 */
export const chapterD11: Topic = {
  id: "cs.pds.ds.btree11",
  title: "Multi-way trees: B-trees and B+ trees",
  no: "D11",
  book: [
    { t: "p", text: "A binary search tree has two children per node, so a million keys need about twenty levels. On a disk, each level is a separate read of a block, and a disk read is a hundred thousand times slower than a memory access. A **multi-way tree** has many children per node, chosen so that one node fills exactly one disk block. A million keys then need only three or four levels, which means three or four disk reads." },
    { t: "p", text: "This chapter covers the B-tree and its variant the B+ tree, which is what databases use for indexes. These structures are officially part of the Databases subject (file organisation and indexing), so the rest of the treatment is in the Databases book; here we build the structure, the capacity calculations and the insertion rule, and explain the real questions GATE has asked." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["state the rules of a B-tree and a B+ tree, including the occupancy of the root;", "compute the order of a node from the block, key and pointer sizes;", "find the number of disk accesses needed for a search;", "carry out an insertion with a node split, for both a leaf and an internal node;", "say how an AVL tree and a red-black tree differ."] },

    { t: "h2", text: "Why many children per node" },
    { t: "p", text: "Searching a tree costs one node visit per level. If a node can have m children, the height for n keys is about log base m of n: for m = 200 and a million keys, about 3. If every node is stored in one disk block, a search reads about 3 blocks. The cost that matters is not comparisons (cheap, inside memory) but **block reads**." },
    { t: "p", text: "So the design aim is a tree that is **short and wide**, and that **stays balanced** as keys are added and removed, without ever needing to rebuild. Both the B-tree and the B+ tree achieve this by letting every node hold between about half and all of its capacity, and by growing at the **root**, not at the leaves: all leaves always stay on the same level." },
    { t: "fig", id: "d11-f1" },

    { t: "h2", text: "The B-tree" },
    { t: "p", text: "A B-tree of **order m** is a search tree with these rules. Every node has at most m children and at most m − 1 keys. Every internal node except the root has at least ⌈m/2⌉ children (so at least ⌈m/2⌉ − 1 keys). The root has at least 2 children if it is not a leaf. All leaves are on the same level. The keys inside a node are sorted, and a node with k keys has k + 1 children, one for each gap." },
    { t: "p", text: "Be careful about the word **order**: some books define it as the maximum number of children (as here), others as the minimum number of children, or as the maximum number of keys. A GATE question that uses the word normally defines it; always read the definition before using a formula." },
    { t: "p", text: "Since every internal non-root node has at least t = ⌈m/2⌉ children, the tree cannot be too tall. With n keys and height h (edges from the root to a leaf) the least possible number of keys is 2tʰ − 1, so h ≤ log_t((n + 1)/2). For m = 5 (t = 3) and 2000 keys, h ≤ log₃(1000.5), about 6.3: at most 6 levels below the root." },
    { t: "callout", kind: "key", text: "B-tree of order m: at most m children and m − 1 keys per node; at least ⌈m/2⌉ children for every internal node except the root; the root may have as few as 2 children (or 1 key); all leaves on one level." },
    { t: "trap", i: 0 },

    { t: "h2", text: "The B+ tree" },
    { t: "p", text: "The **B+ tree** changes one thing: **all the data lives in the leaves**. The internal nodes hold only keys and child pointers (copies of keys that guide the search), and no pointers to data records. The leaves hold the keys with their record pointers, and each leaf has a pointer to the **next leaf**, so all the keys can be read in order by walking along the leaves." },
    { t: "p", text: "Two consequences follow. Because internal nodes carry no record pointers, they fit more keys in a block, so the tree is wider and shorter. And because the leaves are linked in order, a range query ('all keys from a to b') finds a and then follows the leaf chain, without going back up the tree." },
    { t: "table", head: ["", "B-tree", "B+ tree"], rows: [["Record pointers", "in every node", "in the leaves only"], ["Keys repeated", "no, each key once", "yes: internal keys also appear in the leaves"], ["Fan-out of internal nodes", "smaller (keys carry pointers)", "larger"], ["Range query", "needs an inorder walk", "follow the linked leaves"], ["Search cost", "may stop in an internal node", "always goes to a leaf"], ["Used for", "some file systems", "database indexes"]] },
    { t: "p", text: "A way to remember it: the B+ tree is the B-tree with the data moved to the bottom. The upper levels become a pure index (a table of contents), and the leaves are the pages, laid out in order and chained together." },
    { t: "ex", id: "d11-e1" },
    { t: "ex", id: "d11-e2" },
    { t: "trap", i: 1 },

    { t: "h2", text: "How big is a node: the block calculation" },
    { t: "p", text: "A node is stored in one block, so its capacity comes from the block size. An internal node of a B+ tree with p child pointers holds p − 1 keys, so it needs p pointers and p − 1 keys in the block: **p × (pointer size) + (p − 1) × (key size) ≤ block size**. The largest p satisfying this is the **order**." },
    { t: "p", text: "A leaf of a B+ tree holds pairs of a key and a record pointer, plus one pointer to the next leaf: L × (key + record pointer) + (next pointer) ≤ block size. In a B-tree every node holds keys, record pointers and child pointers together, which gives a smaller capacity." },
    { t: "code", text: `#include <stdio.h>

/* order of a B+ tree node: p pointers and p-1 keys must fit in a block */
int order(int block, int key, int ptr) { int p = 0; while ((p + 1) * ptr + p * key <= block) p++; return p; }

int main(void) {
    int block = 4096, key = 12, ptr = 8;
    int p = order(block, key, ptr);                       /* internal node: pointers and keys */
    int leaf = 0; while ((leaf + 1) * (key + ptr) + ptr <= block) leaf++;   /* leaf: (key, record pointer) pairs + next-leaf pointer */
    long recs = 1000000, nodes = (recs + leaf - 1) / leaf; int levels = 1;     /* leaves at the bottom, filled to the maximum */
    while (nodes > 1) { nodes = (nodes + p - 1) / p; levels++; }
    printf("%d %d %d | %d\\n", p, leaf, levels + 1, order(512, 8, 2));
    return 0;
}`, out: "205 204 4 | 52", file: "btree_order.c" },
    { t: "p", text: "For a 4 KB block, a 12-byte key and an 8-byte pointer, an internal node holds up to 205 children and a leaf up to 204 keys. A million records fit in about 4900 leaves; 205 children per node means 24 parents of those, and one root above them: three levels. A search reads three index blocks and then the record's own block: **4 disk accesses**. The last number printed, 52, is the order for a 512-byte block, an 8-byte key and a 2-byte pointer." },
    { t: "ex", id: "d11-e3" },

    { t: "h2", text: "Insertion and splitting" },
    { t: "p", text: "To insert a key, search for the leaf where it belongs and put it in, keeping the keys sorted. If the leaf has room, that is all. If the leaf is **full**, it **splits** in two halves, and a key is sent up to the parent to separate the two new leaves. If the parent is full, it splits too, and so on up. If the root splits, a new root with one key is created above it, and the tree grows **one level taller**: the only way the height ever increases." },
    { t: "p", text: "A detail that the questions test: in a **B+ tree leaf split** the separating key is **copied up** (it stays in the right leaf, because leaves must keep every key); in an **internal node split** the middle key is **pushed up** (moved, not copied) to the parent. Take the convention stated in the question for which keys go left and right." },
    { t: "fig", id: "d11-f2" },
    { t: "ex", id: "d11-e4" },
    { t: "ex", id: "d11-e5" },
    { t: "p", text: "Deleting is the mirror image. Remove the key from its leaf; if the leaf drops below half full, first try to **borrow** a key from a neighbouring leaf, and if that is not possible, **merge** with it, which removes a key from the parent and may cascade upwards. If the root ends up with a single child, that child becomes the root and the tree gets one level shorter." },
    { t: "ex", id: "d11-e6" },
    { t: "trap", i: 2 },

    { t: "h2", text: "A note on red-black trees" },
    { t: "p", text: "The **red-black tree** is a binary search tree with a colour on every node, red or black, obeying rules: the root is black; no red node has a red child; and every path from a node down to a leaf has the same number of black nodes. These rules force the longest path to be at most twice the shortest, so the height is at most 2 log₂(n + 1)." },
    { t: "table", head: ["", "AVL tree", "Red-black tree"], rows: [["Balance rule", "subtree heights differ by at most 1", "colour rules: longest path at most twice the shortest"], ["Height", "about 1.44 log₂ n at most", "at most 2 log₂(n + 1)"], ["Search", "slightly faster (shorter)", "slightly slower"], ["Insert, delete", "up to O(log n) rotations", "at most 3 rotations for a delete"], ["Used in", "lookup-heavy code", "library maps and sets"]] },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "The B and B+ tree questions of the paper are in the Databases subject. They come in three forms: **a statement about the structure** (examples 1 and 2), **a capacity or access calculation** from block, key and pointer sizes (example 3), and **an insertion** that splits nodes (examples 4 and 5). The calculation questions are quick marks if you remember the inequality of the block calculation." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you know exactly what is stored where (record pointers only in the leaves of a B+ tree), what the root is allowed (fewer than half full), and whether you can apply the split rule one node at a time with the stated convention." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Giving internal nodes of a B+ tree record pointers.", "Forgetting that the root alone may be less than half full.", "Using p keys instead of p − 1 keys in the block inequality.", "Forgetting the extra disk access for the record itself.", "Copying up the key at an internal split (it is pushed up) or pushing it up at a leaf split (it is copied)."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Multi-way trees are short and wide so that a search reads few disk blocks; all leaves are on one level.", "B-tree of order m: at most m children, at least ⌈m/2⌉ for non-root internal nodes, the root exempt.", "B+ tree: data in the leaves only, leaves linked in order, internal nodes keys only.", "Order from the block: p × pointer + (p − 1) × key ≤ block size.", "Accesses for a search: the height plus one block for the record.", "Insert: split a full node, copy up at a leaf, push up at an internal node; a root split adds a level."] },
  ],
  blocks: [
    { type: "figure", id: "d11-f1", caption: "A B+ tree of order 4: the internal keys guide the search and every key sits in a leaf. The leaves are joined left to right, so a range query walks along them.", alt: "A tree with a root holding 30 and 60, three children with keys, and leaves in a row holding the keys 10 20, 30 40 50, 60 70.", fig: { kind: "tree", title: "B+ tree: keys guide, leaves hold the data", root: { label: "30 | 60", kids: [{ label: "10 20" }, { label: "30 40 50" }, { label: "60 70" }] } } },
    { type: "figure", id: "d11-f2", caption: "The tree of GATE 2025 FN Q21 (nodes hold at most 3 keys). Inserting 23 into the full leaf 20 21 22 splits it; the parent 6 12 19 is full, so it splits as well, and the root splits: the height grows.", alt: "A tree with a root holding 6, 12 and 19 and four full leaves 1 3 4, 7 9 10, 13 15 17 and 20 21 22.", fig: { kind: "tree", title: "Insert 23: leaf, parent and root all split", root: { label: "6 | 12 | 19", kids: [{ label: "1 3 4" }, { label: "7 9 10" }, { label: "13 15 17" }, { label: "20 21 22", tone: "hl" }] } } },

    { type: "example", id: "d11-e1", level: "gate", title: "GATE CS 2019 (forenoon), Q20 · 1 mark · MCQ: which statement is NOT correct", file: "gate2019_q20.txt", given: `About the B+ tree used for an index of a table, which statement is NOT correct?
(A) A B+ tree is a height balanced tree.
(B) Non-leaf nodes have pointers to data records.
(C) Key values in each node are kept in sorted order.
(D) Each leaf node has a pointer to the next leaf node.`, find: "The false statement.", steps: [
      { say: "A is true: all leaves are on one level.", result: "true" },
      { say: "B is false: in a B+ tree only the leaves point to records; non-leaf nodes hold keys and child pointers.", result: "false" },
      { say: "C and D are true: keys are sorted, and the leaves are linked.", result: "true" },
    ], answer: "B", check: "In a B-tree every node would have record pointers; that is the difference." },
    { type: "example", id: "d11-e2", level: "easy", title: "GATE CS 2024 (forenoon), Q11 · 1 mark · MCQ: who may be less than half full", file: "gate2024_q11.txt", given: `In a B+ tree the requirement of at least 50% node occupancy is relaxed for which case?
(A) only the root  (B) all leaves  (C) all internal nodes  (D) only the leftmost leaf`, find: "The correct option.", steps: [
      { say: "Every non-root node must be at least half full; this is what keeps the tree balanced.", result: "rule" },
      { say: "The root may hold as few as one key (two children).", result: "only the root" },
    ], answer: "A", check: "A tree with a single key has a root with 2 children, each leaf half full." },
    { type: "example", id: "d11-e3", level: "gate", title: "GATE CS 2020 (forenoon), Q51 and 2017 (afternoon), Q54: counting from block sizes", file: "gate2020_q51.txt", given: `(a) B+ tree on a 4 KB block, 12-byte key, 8-byte pointer, one million records, each record in one block. Minimum disk accesses to retrieve a record?
(b) A B+ tree with an 8-byte key, a 512-byte block and a 2-byte block pointer. Maximum order?`, find: "Both.", steps: [
      { say: "(a) Internal node: 8p + 12(p − 1) ≤ 4096, so p = 205. Leaf: 20L + 8 ≤ 4096, so L = 204 entries.", result: "p = 205, L = 204" },
      { say: "One million records need at least 1,000,000 / 204, about 4902 leaves; their parents need at least 24 nodes; one root above them: 3 levels of index.", result: "3 index blocks" },
      { say: "Add the block of the record itself.", result: "4 accesses" },
      { say: "(b) 2p + 8(p − 1) ≤ 512, so 10p ≤ 520.", result: "order 52" },
    ], answer: "(a) 4  (b) 52", check: "The program in this chapter prints 205, 204, 4 and 52." },
    { type: "example", id: "d11-e4", level: "gate", title: "GATE CS 2025 (forenoon), Q21 · 1 mark · MSQ: insert 23 into a full B+ tree", file: "gate2025_fn_q21.txt", given: `A B+ tree with 5 nodes, at most 3 keys in a node: root 6 12 19 and leaves 1 3 4 | 7 9 10 | 13 15 17 | 20 21 22. Insert 23.
(A) no node splits  (B) at least one node splits and redistributes  (C) the number of nodes stays the same  (D) the height increases`, find: "The correct statements.", steps: [
      { say: "23 belongs in the last leaf 20 21 22, which is full: it splits.", result: "leaf splits (B true, A false)" },
      { say: "The key sent up to the root 6 12 19, which is also full: the root splits, and a new root is created above it.", result: "root splits" },
      { say: "More nodes now exist (C false) and the tree is one level taller (D true).", result: "B and D" },
    ], answer: "B and D", check: "Every node on the path from the leaf to the root was full, so every one split." },
    { type: "example", id: "d11-e5", level: "gate", title: "GATE CS 2025 (afternoon), Q57 · 2 marks · NAT: the parent of the leaf that holds 25", file: "gate2025_an_q57.txt", given: `Each B+ tree node holds at most 4 keys. A root-to-leaf path is A = (49, 77, 83, –), B = (7, 19, 33, 44), C = (20*, 22*, 25*, 26*). A pointer between k1 and k2 points to a subtree with keys in [k1, k2). A leaf split copies the smallest key of the new leaf up. Insert 23.
What is the smallest key in the parent of the leaf that holds 25*?`, find: "The key.", steps: [
      { say: "Leaf C is full; inserting 23 overflows it. It splits into (20, 22) and (23, 25, 26); the key 23 is copied up into B.", result: "B becomes 7, 19, 23, 33, 44" },
      { say: "B has 5 keys now: it overflows and splits. The middle key 23 is pushed up to A. B splits into (7, 19) and (33, 44).", result: "(7, 19) | 23 | (33, 44)" },
      { say: "The leaf (23, 25, 26) lies between 23 and 33, so it hangs under the right half (33, 44). Its smallest key is 33.", result: "33" },
    ], answer: "33", check: "Splitting the leaf as (20, 22, 23) and (25, 26) gives the same answer." },
    { type: "example", id: "d11-e6", level: "edge", title: "Height of a B-tree from the number of keys", file: "btree_height.txt", given: `A B-tree of order 5 (at most 5 children) holds 2000 keys. What is the greatest possible height, counting edges from the root to a leaf?`, find: "The height.", steps: [
      { say: "Non-root internal nodes have at least t = ⌈5/2⌉ = 3 children, so n ≥ 2tʰ − 1.", result: "2000 ≥ 2 × 3ʰ − 1" },
      { say: "3ʰ ≤ 1000.5, so h ≤ log₃ 1000.5 = 6.29.", result: "h ≤ 6" },
    ], answer: "6", check: "With height 7 the least number of keys is 2 × 3⁷ − 1 = 4373, more than 2000." },

    { type: "trap", wrong: "In a B+ tree the root must also be at least half full.", tempting: "Every node should keep the tree balanced the same way.", whyWrong: "Only the non-root nodes need at least half occupancy. A root that is also a leaf holds a single key at the start, and the root of a taller tree needs just two children.", rule: "Root: at least 2 children (or one key) is enough.", ex: { code: "insert one key into an empty tree", out: "a root with 1 key: allowed" } },
    { type: "trap", wrong: "Non-leaf nodes of a B+ tree have pointers to the data records.", tempting: "Every node of a B-tree has record pointers, and a B+ tree sounds like the same thing.", whyWrong: "In a B+ tree the internal nodes hold only keys and child pointers. Only the leaves point to records. Leaving out the record pointers is what lets an internal node hold more keys, so the tree is wider and shorter.", rule: "B+ tree: record pointers in the leaves only.", ex: { code: "block 512, key 8, pointer 2: internal order", out: "52 children (no record pointers to pay for)" } },
    { type: "trap", wrong: "At a B+ tree leaf split the middle key moves up and disappears from the leaf.", tempting: "That is what happens in an internal node.", whyWrong: "A leaf must keep every key because the data lives there: the separating key is COPIED up, and also stays in the right leaf. Only an internal node split PUSHES the middle key up and removes it from the node.", rule: "Leaf split: copy up. Internal split: push up.", ex: { code: "leaf 20 22 23 25 26 splits: 23 copied up", out: "leaves (20 22) and (23 25 26)" } },

    { type: "gate", text: "The B and B+ tree questions of the paper sit in Databases: 2019 FN Q20, 2024 FN Q11, 2020 FN Q51, 2017 AN Q54, 2025 FN Q21 and 2025 AN Q57 are explained here." },
    { type: "recall", cards: [
      { q: "Why do databases use multi-way trees?", a: "Few levels means few disk-block reads." },
      { q: "Order m B-tree: children per non-root node?", a: "Between ⌈m/2⌉ and m." },
      { q: "Which node may be less than half full?", a: "Only the root." },
      { q: "Where are the record pointers in a B+ tree?", a: "In the leaves only." },
      { q: "What links the leaves of a B+ tree?", a: "A pointer from each leaf to the next, for range queries." },
      { q: "Block inequality for an internal node of order p?", a: "p × pointer + (p − 1) × key ≤ block size." },
      { q: "Disk accesses of a search?", a: "The number of index levels plus one block for the record." },
      { q: "Leaf split in a B+ tree: copy up or push up?", a: "Copy up (the key stays in the leaf)." },
      { q: "Internal split: copy up or push up?", a: "Push up (the key moves)." },
      { q: "How does a B-tree get taller?", a: "Only when the root splits." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "A B+ tree internal node has to fit in a 1024-byte block, with an 8-byte key and a 4-byte pointer. What is the largest order (maximum number of child pointers)?", answer: "86", solution: "4p + 8(p − 1) ≤ 1024, so 12p ≤ 1032, p = 86." },
      { id: "h2", kind: "MCQ", marks: 1, q: "In a B+ tree, record pointers are stored in", options: ["every node", "only the root", "only the leaves", "only the internal nodes"], answer: "C", solution: "The leaves hold the data." },
      { id: "h3", kind: "NAT", marks: 1, q: "A B-tree of order 7 (at most 7 children): what is the least number of children of a non-root internal node?", answer: "4", solution: "⌈7/2⌉ = 4." },
      { id: "h4", kind: "MCQ", marks: 1, q: "The height of a B-tree increases only when", options: ["a leaf is inserted", "a leaf splits", "the root splits", "a key is deleted"], answer: "C", solution: "A new root is created above the old one." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true of a B+ tree?", options: ["All leaves are on the same level", "Leaves are linked in order", "The root must be at least half full", "Internal nodes hold record pointers"], answer: "A, B", solution: "The root is exempt; internal nodes hold no record pointers." },
      { id: "h6", kind: "NAT", marks: 2, q: "A B+ tree leaf holds at most 3 keys: 10 20 30. Inserting 25 splits it as (10 20) and (25 30), copying the smallest key of the new leaf up. Which key goes to the parent?", answer: "25", solution: "The smallest key of the right leaf (25 30) is 25." },
      { id: "h7", kind: "NAT", marks: 2, q: "A B+ tree on a 1000-byte block has 40 entries per leaf and order 50. At most how many records can a tree with 3 levels (root, one internal level, leaves) index?", answer: "100000", solution: "50 × 50 leaves × 40 records = 100,000." },
      { id: "h8", kind: "NAT", marks: 2, q: "A B-tree of order 4 (at most 4 children) with 15 keys: what is the greatest possible height in edges?", answer: "3", solution: "t = 2, n ≥ 2 × 2ʰ − 1: 15 ≥ 2ʰ⁺¹ − 1 gives h ≤ 3." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on B and B+ trees", sub: "Databases", href: "/topics/databases" }, { label: "The Data Structures book", sub: "back to the contents", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Trees (D7)", "Binary search trees (D8)", "AVL trees (D9)"], usedIn: ["Databases: file organisation and indexing"], cross: ["Databases: indexing"] },
  ],
};
