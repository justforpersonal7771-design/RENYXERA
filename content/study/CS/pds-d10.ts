import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D10 "Binary heaps and priority queues" (28 Nov 2026). Real GATE questions (texts from public/data/questions.json):
 * 2023 FN Q12 (which array is a max-heap, key B), 2026 FN Q23 (non-leaf indices for odd n, B and C), 2025 FN Q35 (height of a heap of 32 keys = 5),
 * 2023 FN Q46 (extract-max and insert both O(log n), key B), 2018 FN Q56 (the number of min-heaps of 1..7 = 80).
 * Programs compiled and run with gcc: insert and extract-min trace, build-heap from 9 7 6 5 4 3 2 1, counting heaps (80 and 8).
 */
export const chapterD10: Topic = {
  id: "cs.pds.ds.heaps10",
  title: "Binary heaps and priority queues",
  no: "D10",
  book: [
    { t: "p", text: "A queue serves the oldest item first. But a hospital serves the sickest patient first, and an operating system runs the most urgent process first. A **priority queue** serves the item with the highest priority, whenever it arrived. The classic way to build one is the **binary heap**, a tree that keeps the best item at the top and can be updated in logarithmic time." },
    { t: "p", text: "The heap is also one of the neatest examples of a tree stored in an array, and the basis of heapsort. GATE asks about it often: is this array a heap, where do the leaves sit, how many swaps does an insert take, what is the cost of building a heap, how many different heaps are there." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["state the heap-order and shape properties and test whether an array is a heap;", "insert into and delete from a heap by sifting up and down, tracing every swap;", "find the leaves, the height and the parent and children of any index;", "explain why building a heap takes Θ(n) but sorting takes Θ(n log n);", "count the heaps that can be made from a set of distinct values."] },

    { t: "h2", text: "What a heap is" },
    { t: "p", text: "A **binary heap** is a binary tree with two properties. The **shape property**: it is a **complete** binary tree, with every level full except possibly the last, which is filled from the left. The **heap-order property**: in a **min-heap** every node is **smaller than or equal to** its children, so the smallest key is at the root; in a **max-heap** every node is greater than or equal to its children, so the largest is at the root." },
    { t: "fig", id: "d10-f1" },
    { t: "p", text: "Compare this with the binary search tree of chapter D8, which looks similar but is a different thing. A BST orders **left against right**; a heap orders **parent against child**. In a heap nothing says which of the two children is bigger, and the inorder traversal is not sorted. A heap gives only one thing quickly: the extreme item, at the root." },
    { t: "callout", kind: "key", text: "Heap = complete binary tree + every parent ≤ its children (min-heap) or ≥ (max-heap). The best item is the root. A heap is not a BST." },

    { t: "h2", text: "Stored in an array" },
    { t: "p", text: "Because the shape is complete, a heap needs no pointers: store it in an array level by level (chapter D7). With the root at index **1**: the children of i are **2i** and **2i + 1**, and the parent of i is **⌊i / 2⌋**. With the root at index 0 the formulas shift: children 2i + 1 and 2i + 2, parent ⌊(i − 1) / 2⌋. GATE says which numbering it uses; do not mix them." },
    { t: "p", text: "A beautiful consequence of the shape is that the position of the leaves is known. With n keys and numbering from 1, the last internal node is the parent of the last key, at index ⌊n / 2⌋, so the **leaves are exactly the indices ⌊n / 2⌋ + 1 to n**. About half of the nodes are leaves: ⌈n / 2⌉ of them. The **height** of a heap with n keys is ⌊log₂ n⌋ edges, because a complete tree squeezes the levels as short as possible." },
    { t: "ex", id: "d10-e1" },
    { t: "ex", id: "d10-e2" },
    { t: "ex", id: "d10-e3" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Insert: sift up" },
    { t: "p", text: "To insert a key, put it in the **first free place**, which is the next index n + 1: this keeps the shape complete. The heap order may now be broken between the new key and its parent. Repair it by **sifting up** (also called bubbling up): while the new key is smaller than its parent (in a min-heap), swap them and move up." },
    { t: "p", text: "A key can travel up at most the height of the tree, so an insert takes **O(log n)**. In the best case (the key is already larger than its parent) it takes one comparison." },
    { t: "fig", id: "d10-f2" },

    { t: "h2", text: "Delete the minimum: sift down" },
    { t: "p", text: "The root is the item we want to remove, which leaves a hole at the top. Fill it with the **last** key of the array (index n), which keeps the shape complete, and shrink the heap by one. The new root is probably too large, so **sift down**: compare it with both children, swap it with the **smaller** child (in a min-heap), and repeat until it is no larger than its children or it is a leaf." },
    { t: "p", text: "The key goes down at most the height, so deleting the minimum is **O(log n)**. Reading the minimum without removing it is O(1). Taking the smaller child is essential: swapping with the larger one would leave the smaller child above its parent, breaking the order." },
    { t: "code", text: `#include <stdio.h>

int h[32], n = 0;                          /* min-heap in h[1..n] */

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void insert(int x) {
    h[++n] = x;                                                                   /* first free place */
    for (int i = n; i > 1 && h[i / 2] > h[i]; i /= 2) swap(&h[i / 2], &h[i]);   /* sift up */
}

int extract_min(void) {
    int top = h[1];
    h[1] = h[n--];                                                                /* last key to the root */
    for (int i = 1; ; ) {                                                         /* sift down */
        int s = i;
        if (2 * i <= n && h[2 * i] < h[s]) s = 2 * i;
        if (2 * i + 1 <= n && h[2 * i + 1] < h[s]) s = 2 * i + 1;
        if (s == i) break;
        swap(&h[i], &h[s]); i = s;
    }
    return top;
}

int main(void) {
    int a[] = {5, 3, 8, 1, 9, 2};
    for (int i = 0; i < 6; i++) insert(a[i]);
    for (int i = 1; i <= n; i++) printf("%d ", h[i]);
    printf("| %d ", extract_min());
    for (int i = 1; i <= n; i++) printf("%d ", h[i]);
    return 0;
}`, out: "1 3 2 5 9 8 | 1 2 3 8 5 9 ", file: "heap_ops.c" },
    { t: "p", text: "Inserting 5, 3, 8, 1, 9, 2 gives the heap array 1 3 2 5 9 8: the 1 sifted all the way to the root, and the 2 swapped with its parent 8. Extracting the minimum removes 1, moves the last key 8 to the root and sifts it down past the smaller child 2: the array becomes 2 3 8 5 9." },
    { t: "ex", id: "d10-e4" },
    { t: "p", text: "To trace a deletion by hand, write the array, cross out the last key and put it at the root, then walk down: at each step compare the key with its two children, and stop as soon as it is no larger than the smaller child. Never let the walk skip the check of the second child; it is the usual place for a slip." },
    { t: "ex", id: "d10-e7" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Building a heap in Θ(n)" },
    { t: "p", text: "Given n keys in an array, how fast can we make them into a heap? One way is to insert them one by one, which costs O(log n) each, Θ(n log n) in total. A smarter way, **build-heap**, treats the array as a complete tree already and fixes it from the bottom: for i from ⌊n/2⌋ down to 1, **sift down** the key at i. The leaves (the second half) are already trivially heaps, so we start at the last internal node." },
    { t: "code", text: `#include <stdio.h>

void sift_down(int h[], int n, int i) {          /* min-heap in h[1..n] */
    for (;;) {
        int s = i;
        if (2 * i <= n && h[2 * i] < h[s]) s = 2 * i;
        if (2 * i + 1 <= n && h[2 * i + 1] < h[s]) s = 2 * i + 1;
        if (s == i) return;
        int t = h[i]; h[i] = h[s]; h[s] = t; i = s;
    }
}

int main(void) {
    int h[] = {0, 9, 7, 6, 5, 4, 3, 2, 1};       /* h[0] unused; eight keys, in reverse order */
    int n = 8;
    for (int i = n / 2; i >= 1; i--) sift_down(h, n, i);     /* from the last internal node up to the root */
    for (int i = 1; i <= n; i++) printf("%d ", h[i]);
    return 0;
}`, out: "1 4 2 5 9 3 6 7 ", file: "build_heap.c" },
    { t: "p", text: "Why is this Θ(n), not Θ(n log n)? A key at height k can sift down at most k levels, and **most nodes are near the bottom**: about n / 2 nodes have height 0, n / 4 have height 1, n / 8 have height 2, and so on. The total work is at most n × (0 / 2 + 1 / 4 + 2 / 8 + 3 / 16 + …) which is the series h / 2ʰ of chapter D1, whose sum is 2. So the work is at most about 2n: **linear**." },
    { t: "ex", id: "d10-e5" },
    { t: "p", text: "**Heapsort** uses a max-heap: build the heap in Θ(n), then repeat n − 1 times: swap the root (the largest) with the last item of the heap, shrink the heap by one, and sift the new root down. Each of the n − 1 rounds costs O(log n), so heapsort is **Θ(n log n)** in the worst case and sorts in place, using O(1) extra space." },
    { t: "trap", i: 2 },

    { t: "h2", text: "Priority queues, and counting heaps" },
    { t: "p", text: "A **priority queue** supports Insert, FindMin (or FindMax) and ExtractMin (ExtractMax), and often DecreaseKey. Implemented as a heap, Insert and Extract each take O(log n), FindMin O(1) and DecreaseKey O(log n) (sift up). The same operations cost far more elsewhere: an unsorted array makes insert O(1) but extract O(n); a sorted array makes extract O(1) but insert O(n)." },
    { t: "table", head: ["Structure", "Insert", "Find the min", "Extract the min"], rows: [["Unsorted array", "Θ(1)", "Θ(n)", "Θ(n)"], ["Sorted array", "Θ(n)", "Θ(1)", "Θ(n) or Θ(1) at the right end"], ["Binary heap", "Θ(log n)", "Θ(1)", "Θ(log n)"], ["BST (balanced)", "Θ(log n)", "Θ(log n)", "Θ(log n)"]] },
    { t: "p", text: "**How many different min-heaps** can be made from n distinct keys? The shape is fixed (the complete tree on n nodes), so we count the ways to fill it. The smallest key must be the root. The remaining n − 1 keys are split between the left and right subtrees, whose sizes are fixed by the shape, say ℓ and r; choose which ℓ of the n − 1 go left in C(n − 1, ℓ) ways, and then arrange each side as a heap in the same way: **heaps(n) = C(n − 1, ℓ) × heaps(ℓ) × heaps(r)**." },
    { t: "code", text: `#include <stdio.h>

long C(int n, int k) { long r = 1; for (int i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }

/* Number of min-heaps on n distinct keys: the shape is the complete tree on n nodes. */
long heaps(int n) {
    if (n <= 1) return 1;
    int h = 0;
    while ((1 << (h + 1)) - 1 < n) h++;                      /* levels 0..h */
    int last = n - ((1 << h) - 1);                           /* nodes on the last level */
    int half = 1 << (h - 1);                                 /* room for the last level in the left subtree */
    int left = (half - 1) + (last < half ? last : half);     /* left subtree size */
    return C(n - 1, left) * heaps(left) * heaps(n - 1 - left);
}

int main(void) {
    printf("%ld %ld\\n", heaps(7), heaps(5));
    return 0;
}`, out: "80 8", file: "count_heaps.c" },
    { t: "ex", id: "d10-e6" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Heap questions come as: **recognising a heap** from an array (example 1), **locating nodes** by index, leaves and height (examples 2 and 3), **costs** of insert, extract and build (example 4), **tracing** an insert or delete (example 7), and **counting** heaps (example 6). The array-and-index questions are the quickest marks in the chapter." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you check heap order against both children of every internal node, whether you know the leaf indices, and whether you keep sift-up (insert) and sift-down (delete) straight." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Checking only parent against the first child, or only adjacent items.", "Treating a heap as a BST, or expecting the array to be sorted.", "Sifting down towards the larger child in a min-heap.", "Using 0-based formulas for a 1-based array, or the reverse.", "Saying build-heap is Θ(n log n); it is Θ(n)."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Heap: complete binary tree, parent ≤ children (min) or ≥ (max); stored in an array; not a BST.", "Index rules (1-based): children 2i and 2i + 1, parent ⌊i/2⌋; leaves ⌊n/2⌋ + 1 to n; height ⌊log₂ n⌋.", "Insert: add at the end, sift up. Extract: move the last key to the root, sift down (towards the smaller child in a min-heap). Both O(log n).", "Find-min is O(1). Searching for an arbitrary key is Θ(n).", "Build-heap is Θ(n) (sift down from ⌊n/2⌋ to 1); heapsort is Θ(n log n).", "Number of min-heaps on n distinct keys: C(n − 1, ℓ) × heaps(ℓ) × heaps(r); 80 for n = 7."] },
  ],
  blocks: [
    { type: "figure", id: "d10-f1", caption: "A min-heap of seven keys and its array. Every parent is smaller than both its children: 3 < 9, 5; 9 < 12, 10; 5 < 8, 7. The array is 3 9 5 12 10 8 7.", alt: "A binary tree with root 3, children 9 and 5, and leaves 12, 10, 8, 7, shown with its array form.", fig: { kind: "heap", values: [3, 9, 5, 12, 10, 8, 7], tones: { 1: "hl" } } },
    { type: "figure", id: "d10-f2", caption: "Insert 2 into the min-heap 3 9 5 12 10 8 7. It goes to the first free place (index 8, under 12). It swaps with 12, then with 9, then with 3, and arrives at the root.", alt: "Four frames of the heap array as the key 2 moves up from index 8 to index 1.", fig: { kind: "frames", title: "Insert 2: sift up", frames: [
      { caption: "2 goes into the first free place, index 8. Its parent is 12 (index 4): 12 > 2, so swap.", fig: { kind: "array", data: [[3, 9, 5, 12, 10, 8, 7, 2]], base: 1, size: 1, index: false, tones: { "0,7": "hl", "0,3": "bad" } } },
      { caption: "Now 2 is at index 4. Its parent is 9 (index 2): 9 > 2, so swap.", fig: { kind: "array", data: [[3, 9, 5, 2, 10, 8, 7, 12]], base: 1, size: 1, index: false, tones: { "0,3": "hl", "0,1": "bad" } } },
      { caption: "2 is at index 2. Its parent is 3 (index 1): 3 > 2, so swap.", fig: { kind: "array", data: [[3, 2, 5, 9, 10, 8, 7, 12]], base: 1, size: 1, index: false, tones: { "0,1": "hl", "0,0": "bad" } } },
      { caption: "2 is at the root: it has no parent. The heap is 2 3 5 9 10 8 7 12.", fig: { kind: "array", data: [[2, 3, 5, 9, 10, 8, 7, 12]], base: 1, size: 1, index: false, tones: { "0,0": "ok" } } },
    ] } },

    { type: "example", id: "d10-e1", level: "gate", title: "GATE CS 2023 (forenoon), Q12 · 1 mark · MCQ: which array is a max-heap", file: "gate2023_q12.txt", given: `A[1..10]:
(A) 23, 17, 10, 6, 13, 14, 1, 5, 7, 12
(B) 23, 17, 14, 7, 13, 10, 1, 5, 6, 12
(C) 23, 17, 14, 6, 13, 10, 1, 5, 7, 15
(D) 23, 14, 17, 1, 10, 13, 16, 12, 7, 5`, find: "The sequence that forms a max-heap.", steps: [
      { say: "For each index i test A[i] ≥ A[2i] and A[i] ≥ A[2i + 1]. (A): A[3] = 10 but its child A[6] = 14 is larger.", result: "A fails" },
      { say: "(C): A[5] = 13 but its child A[10] = 15 is larger.", result: "C fails" },
      { say: "(D): A[4] = 1 but its child A[8] = 12 is larger.", result: "D fails" },
      { say: "(B): 23 ≥ 17, 14; 17 ≥ 7, 13; 14 ≥ 10, 1; 7 ≥ 5, 6; 13 ≥ 12. All hold.", result: "B passes" },
    ], answer: "B", check: "Test every internal node (indices 1 to 5) against both children; one failure is enough to reject." },
    { type: "example", id: "d10-e2", level: "gate", title: "GATE CS 2026 (forenoon), Q23 · 1 mark · MSQ: indices that are not leaves", file: "gate2026_q23.txt", given: `A binary min-heap with n elements (n odd, n > 100), array indices from 1.
Which of these indices do NOT correspond to a leaf?
(A) (n + 1)/2   (B) (n − 1)/2   (C) (n − 3)/2   (D) n`, find: "The indices that are not leaves.", steps: [
      { say: "With indices from 1 the leaves are ⌊n/2⌋ + 1 to n. For odd n, ⌊n/2⌋ = (n − 1)/2.", result: "leaves: (n + 1)/2 .. n" },
      { say: "(n + 1)/2 is the first leaf and n the last leaf, so A and D are leaves.", result: "A, D are leaves" },
      { say: "(n − 1)/2 and (n − 3)/2 are below the first leaf, so they are internal nodes.", result: "B, C are not leaves" },
    ], answer: "B and C", check: "n = 101: the leaves are indices 51 to 101; (n − 1)/2 = 50 and (n − 3)/2 = 49 are internal." },
    { type: "example", id: "d10-e3", level: "gate", title: "GATE CS 2025 (forenoon), Q35 · 1 mark · NAT: height of a heap", file: "gate2025_fn_q35.txt", given: `A Min-Heap T stores 32 keys. Height = edges on the longest root-to-leaf path.`, find: "The height.", steps: [
      { say: "A heap is a complete tree, so its height is ⌊log₂ n⌋.", result: "⌊log₂ 32⌋" },
      { say: "Levels hold 1, 2, 4, 8, 16 nodes: 31 nodes fill levels 0 to 4, so the 32nd key starts level 5.", result: "5" },
    ], answer: "5", check: "n = 31 gives height 4; n = 32 adds one key on a new level." },
    { type: "example", id: "d10-e4", level: "gate", title: "GATE CS 2023 (forenoon), Q46 · 2 marks · MCQ: costs of the priority-queue operations", file: "gate2023_q46.txt", given: `A priority queue on a max-heap of n elements. Extract-Max deletes the maximum; Insert adds a key.
Worst-case running times?
(A) both O(1)  (B) both O(log n)  (C) Extract-Max O(1), Insert O(log n)  (D) Extract-Max O(1), Insert O(n)`, find: "The true statement.", steps: [
      { say: "Insert puts the key at the end and sifts it up through at most ⌊log₂ n⌋ levels.", result: "O(log n)" },
      { say: "Extract-Max removes the root, moves the last key to the root and sifts it down through at most ⌊log₂ n⌋ levels. Reading the max is O(1), but extracting also repairs the heap.", result: "O(log n)" },
    ], answer: "B", check: "Option C would describe only reading the maximum." },
    { type: "example", id: "d10-e5", level: "easy", title: "Build a heap bottom up", file: "build_trace.txt", given: `Keys in the array (1-based): 9 7 6 5 4 3 2 1.  Build a min-heap with build-heap.`, find: "The resulting array.", steps: [
      { say: "n = 8, so i runs from 4 down to 1. i = 4 (key 5): its child at index 8 is 1, smaller, swap.", result: "9 7 6 1 4 3 2 5" },
      { say: "i = 3 (key 6): children 3 and 2; the smaller is 2 at index 7, swap.", result: "9 7 2 1 4 3 6 5" },
      { say: "i = 2 (key 7): children 1 and 4; swap with 1. Then at index 4 the key 7 has the child 5, which is smaller: swap again.", result: "9 1 2 5 4 3 6 7" },
      { say: "i = 1 (key 9): children 1 and 2; swap with 1; then at index 2 its children are 5 and 4; swap with 4; then at index 5 it is a leaf.", result: "1 4 2 5 9 3 6 7" },
    ], answer: "1 4 2 5 9 3 6 7", check: "The program in this chapter prints the same array." },
    { type: "example", id: "d10-e6", level: "gate", title: "GATE CS 2018 (forenoon), Q56 · 2 marks · NAT: the number of min-heaps", file: "gate2018_q56.txt", given: `How many min-heaps are there that contain each value of {1, ..., 7} exactly once?`, find: "The number.", steps: [
      { say: "7 nodes make the perfect tree: a root and two subtrees of 3 nodes. The root must be 1.", result: "root = 1" },
      { say: "Choose which 3 of the remaining 6 keys go to the left subtree.", result: "C(6, 3) = 20" },
      { say: "A subtree of 3 nodes is a root (its smallest key) and two children in either order.", result: "2 ways each" },
      { say: "Multiply.", result: "20 × 2 × 2 = 80" },
    ], answer: "80", check: "The program in this chapter prints 80 for n = 7 and 8 for n = 5." },
    { type: "example", id: "d10-e7", level: "easy", title: "Extract the minimum: trace the sift down", file: "extract_trace.txt", given: `Min-heap (1-based): 1 3 2 5 9 8. Extract the minimum.`, find: "The array afterwards.", steps: [
      { say: "Remove the root 1 and move the last key 8 to the root. The heap has 5 keys: 8 3 2 5 9.", result: "8 3 2 5 9" },
      { say: "The children of the root are 3 and 2. The smaller is 2, and 2 < 8, so swap with it.", result: "2 3 8 5 9" },
      { say: "8 is now at index 3, which has no children within 5 keys. Stop.", result: "2 3 8 5 9" },
    ], answer: "2 3 8 5 9", check: "The result is again a min-heap: 2 ≤ 3, 8; 3 ≤ 5, 9." },

    { type: "trap", wrong: "An array is a min-heap if each element is no larger than the next one.", tempting: "A sorted array is certainly a heap, and the heap looks 'ordered'.", whyWrong: "A sorted array is a heap, but a heap need not be sorted. The condition is parent against children (A[i] ≤ A[2i] and A[i] ≤ A[2i + 1]), not neighbour against neighbour. The array 1 5 2 6 7 3 4 is a heap even though 5 > 2.", rule: "Test every internal node against both of its children.", ex: { code: "1 5 2 6 7 3 4:  1 ≤ 5, 2;  5 ≤ 6, 7;  2 ≤ 3, 4", out: "a min-heap, yet not sorted" } },
    { type: "trap", wrong: "In delete-min, swap the new root with the larger child.", tempting: "The larger child feels like it should move up to replace the big root.", whyWrong: "In a min-heap the smaller child must move up, because it must end up above its sibling. If the larger child moved up, the smaller child would sit below a larger parent. The sift down always goes towards the smaller child.", rule: "Min-heap: sift down towards the smaller child.", ex: { code: "8 with children 3 and 2: swap with 2 (smaller)", out: "2 3 8 ... (swap with 3 would put 3 above 2)" } },
    { type: "trap", wrong: "Building a heap of n keys takes Θ(n log n) because each of n/2 sift-downs takes log n.", tempting: "n/2 operations at O(log n) each seems to multiply.", whyWrong: "Most nodes are near the leaves and sift down only a step or two: n/2 nodes move 0 levels, n/4 at most 1, n/8 at most 2. The total is n × Σ h / 2^(h+1) < n × 1, so Θ(n). Inserting n keys one by one is Θ(n log n); build-heap is better.", rule: "Build-heap is Θ(n); heapsort as a whole is Θ(n log n).", ex: { code: "n = 1,000,000: sift-down work is under 1,000,000 steps", out: "not 20,000,000" } },

    { type: "gate", text: "GATE 2023 FN Q12 (is this array a max-heap), 2026 FN Q23 (non-leaf indices), 2025 FN Q35 (height of a heap), 2023 FN Q46 (priority-queue costs) and 2018 FN Q56 (counting min-heaps) are tagged to this chapter." },
    { type: "recall", cards: [
      { q: "What are the two properties of a binary heap?", a: "Complete binary tree shape, and heap order: parent ≤ children (min-heap) or ≥ (max-heap)." },
      { q: "Children and parent of index i (1-based)?", a: "2i and 2i + 1; parent ⌊i/2⌋." },
      { q: "Which indices are the leaves of a heap of n keys (1-based)?", a: "⌊n/2⌋ + 1 to n." },
      { q: "Height of a heap with n keys?", a: "⌊log₂ n⌋." },
      { q: "How do you insert?", a: "Put the key at index n + 1 and sift up." },
      { q: "How do you delete the minimum?", a: "Move the last key to the root, shrink by one, sift down towards the smaller child." },
      { q: "Cost of find-min, insert, extract-min?", a: "O(1), O(log n), O(log n)." },
      { q: "Cost of build-heap? Heapsort?", a: "Θ(n); Θ(n log n)." },
      { q: "Is a heap a BST?", a: "No: it orders parent against children, not left against right." },
      { q: "Cost of searching for an arbitrary key in a heap?", a: "Θ(n)." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "A heap holds 100 keys, indexed from 1. At which index is the parent of the key at index 77?", answer: "38", solution: "⌊77 / 2⌋ = 38." },
      { id: "h2", kind: "NAT", marks: 1, q: "How many leaves does a heap of 50 keys have?", answer: "25", solution: "Indices 26 to 50: 25 leaves." },
      { id: "h3", kind: "MCQ", marks: 1, q: "Which array (1-based) is a min-heap?", options: ["2 4 3 8 5 6 7", "2 4 3 1 5 6 7", "5 4 3 2 1", "1 3 2 5 4 7 6 0"], answer: "A", solution: "A: 2 ≤ 4, 3; 4 ≤ 8, 5; 3 ≤ 6, 7. B: index 2 holds 4 but its child at index 4 is 1. C: 5 > 4. D: index 4 holds 5 but its child at index 8 is 0." },
      { id: "h4", kind: "NAT", marks: 1, q: "What is the height of a heap with 1000 keys?", answer: "9", solution: "⌊log₂ 1000⌋ = 9." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true for a binary min-heap with n keys?", options: ["The minimum is at the root", "Find-min is O(1)", "An inorder traversal is sorted", "Build-heap takes Θ(n)"], answer: "A, B, D", solution: "The inorder of a heap is not sorted." },
      { id: "h6", kind: "NAT", marks: 2, q: "Insert 1 into the min-heap 3 5 4 8 6 (1-based). After the insert, what is the key at index 3?", answer: "3", solution: "1 goes to index 6, swaps with its parent 4 (index 3), then with the root 3: array 1 5 3 8 6 4; index 3 holds 3." },
      { id: "h7", kind: "NAT", marks: 2, q: "How many different min-heaps can be formed from the keys 1, 2, 3, 4, 5?", answer: "8", solution: "Root 1; the shape has 3 nodes on the left and 1 on the right: C(4, 3) × 2 × 1 = 8." },
      { id: "h8", kind: "NAT", marks: 2, q: "Build-heap (min) on the array 4 3 2 1 (1-based). What is the key at index 2 afterwards?", answer: "3", solution: "i = 2: key 3, child 1 at index 4: swap, giving 4 1 2 3. i = 1: key 4, children 1 and 2: swap with 1, then 4 at index 2 has child 3: swap, giving 1 3 2 4. Index 2 holds 3." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on BSTs and heaps", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "back to the contents", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Trees and binary trees (D7)", "Arrays (D2)", "Counting and growth (D1)"], usedIn: ["Heapsort and priority queues in Algorithms", "Dijkstra's algorithm and Prim's algorithm"], cross: ["Algorithms: sorting"] },
  ],
};
