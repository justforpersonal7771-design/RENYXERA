import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D15 "Choosing the right structure" (29 Nov 2026). Real GATE question (text from public/data/questions.json):
 * 2025 AN Q38 (meld of an unsorted doubly linked list, an array min-heap and a BST: Θ(1), Θ(n), Θ(n), key A, confirmed on a published solution).
 * Program compiled and run with gcc: for n = 1000, linear search 1000, binary search 10, heap height 9, merge of two sorted arrays 1999 comparisons.
 */
export const chapterD15: Topic = {
  id: "cs.pds.ds.choose15",
  title: "Choosing the right structure",
  no: "D15",
  book: [
    { t: "p", text: "By now you have met arrays, linked lists, stacks, queues, trees, binary search trees, AVL trees, heaps and graphs. Each is good at some things and poor at others, and no structure wins everywhere. Knowing the cost table of each, and being able to say which one fits a given job, is what the 'which data structure' questions of the paper test, and it is the most useful habit to carry into the Algorithms subject." },
    { t: "p", text: "This chapter puts the costs side by side, shows how to match a structure to a workload, works through the 'meld' question of GATE 2025 in detail, and gives a short list of mistakes to avoid." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["recite the cost of access, search, insert, delete and find-minimum for each structure;", "pick a structure from the operations a program needs most;", "cost a 'meld' (merge) of two structures;", "avoid the usual traps about worst case against average case and balanced against unbalanced."] },

    { t: "h2", text: "One table to remember" },
    { t: "p", text: "The table below gathers the worst-case costs from the earlier chapters, for n items. Read it by rows: for each operation, which structure is quickest? Read it by columns: what is each structure's strength and weakness?" },
    { t: "table", head: ["Structure", "Search", "Insert", "Delete", "Find the min", "Notes"], rows: [["Unsorted array", "Θ(n)", "Θ(1) at the end", "Θ(n)", "Θ(n)", "random access"], ["Sorted array", "Θ(log n)", "Θ(n)", "Θ(n)", "Θ(1)", "binary search needs the array"], ["Singly linked list", "Θ(n)", "Θ(1) at the head", "Θ(n) (needs the previous node)", "Θ(n)", "no random access"], ["Doubly linked list", "Θ(n)", "Θ(1) at a known place", "Θ(1) given the node", "Θ(n)", "two pointers per node"], ["Binary search tree", "Θ(n) worst, Θ(log n) balanced", "same", "same", "Θ(height)", "inorder is sorted"], ["AVL tree", "Θ(log n)", "Θ(log n)", "Θ(log n)", "Θ(log n)", "always balanced"], ["Binary min-heap", "Θ(n)", "Θ(log n)", "Θ(log n) (the min)", "Θ(1)", "array, complete tree"], ["Stack, queue", "Θ(n)", "Θ(1)", "Θ(1) at its end", "Θ(n)", "only one end (or two) reachable"]] },
    { t: "p", text: "Two things stand out. First, **searching** for an arbitrary key is fast only in a sorted array (with random access) and in balanced search trees: a heap, a list, a stack and a queue all need Θ(n). Second, **extreme items**: the heap gives the smallest key in Θ(1) and removes it in Θ(log n), better than every other row for repeated 'give me the smallest' work." },
    { t: "fig", id: "d15-f1" },
    { t: "callout", kind: "key", text: "Fast search: sorted array, balanced BST. Fast extreme: heap. Fast insert and delete at a known spot: linked list. Fast access by position: array. Order of arrival: queue or stack." },
    { t: "p", text: "A useful habit when reading the table is to check each entry against the structure of the data. An array finds item k in one step because the address is a formula (chapter D2). A list cannot, because it must follow k pointers. A heap puts the smallest key at the root and says nothing about the order of the rest, which is why finding the minimum is fast and finding any other key is slow." },
    { t: "ex", id: "d15-e1" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Matching a structure to a workload" },
    { t: "p", text: "The way to choose is to ask which operation the program does most, and which the others may be allowed to be slow. Think of the program as a list of requirements, each pointing at a structure." },
    { t: "p", text: "If the program must always take **the most urgent job next** (a task scheduler, a simulation of events in time order), the operation is 'extract the minimum or maximum': a **heap** (priority queue). If the program must serve items **in arrival order** (print jobs, a customer line), it is a **queue**. If it must **undo** the most recent action, evaluate expressions or follow nested calls, it is a **stack**." },
    { t: "p", text: "If the program must **look up by key** and also keep the keys **in order** (a phone book that can be listed alphabetically, a range query 'all keys between a and b'), it needs a **balanced search tree**. If it must look up by index and rarely changes size, an **array**. If it must insert and remove in the middle very often and rarely looks anything up by position, a **linked list**." },
    { t: "table", head: ["The program mostly needs...", "Choose", "Why"], rows: [["the smallest or largest item again and again", "binary heap", "find Θ(1), remove Θ(log n)"], ["items served in arrival order", "queue", "FIFO at both ends in Θ(1)"], ["the latest item first, and undo", "stack", "LIFO, Θ(1)"], ["lookup by key and sorted listing", "balanced BST (AVL)", "Θ(log n) for everything, inorder sorted"], ["item number k quickly", "array", "random access Θ(1)"], ["frequent insert or delete in the middle", "linked list (doubly if the node is known)", "no shifting of items"], ["a hierarchy or a network", "tree or graph", "the data already has that shape"]] },
    { t: "fig", id: "d15-f2" },
    { t: "ex", id: "d15-e2" },
    { t: "p", text: "Count the steps, not the feeling. The program below compares, for n = 1000 items, the worst-case steps of a linear search, a binary search, the height of a heap or balanced tree, and the comparisons needed to merge two sorted arrays of 1000 items each." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n = 1000;
    int lin = n;                                   /* linear search: every item in the worst case */
    int bin = 0; for (int m = n; m > 0; m /= 2) bin++;          /* binary search: halvings of the range */
    int h = 0;   for (int m = n; m > 1; m /= 2) h++;            /* height of a heap or a balanced tree */
    int a[1000], b[1000], i = 0, j = 0, cmp = 0;
    for (int k = 0; k < n; k++) { a[k] = 2 * k; b[k] = 2 * k + 1; }
    while (i < n && j < n) { cmp++; if (a[i] < b[j]) i++; else j++; }   /* merge two sorted arrays */
    printf("%d %d %d %d\\n", lin, bin, h, cmp);
    return 0;
}`, out: "1000 10 9 1999", file: "compare_costs.c" },
    { t: "p", text: "A thousand items cost a thousand steps to search linearly but only ten by binary search, and a heap or a balanced tree is nine levels tall. Merging two sorted arrays of n items each takes 2n − 1 comparisons, linear in the total size. These are the numbers behind the table, and the reason that exponential-looking differences (a thousand against ten) appear between structures." },

    { t: "h2", text: "Melding two structures" },
    { t: "p", text: "To **meld** two structures of the same kind is to combine them into one. The cost depends on how each structure is built, and GATE 2025 asked about three of them at once." },
    { t: "p", text: "For an **unsorted doubly linked list** with pointers to both the head and the tail, melding is a pointer change: point the tail of the first list at the head of the second, and fix the backward pointer. The list is unsorted, so nothing needs reordering: **Θ(1)**." },
    { t: "p", text: "For a **min-heap stored in an array**, you cannot just link the arrays: the heap-order property must hold across the whole. Copy both arrays into one array of size 2n and run **build-heap** on it (chapter D10), which takes Θ(n). Any method must at least copy the n items of one heap, so the cost is **Θ(n)**." },
    { t: "p", text: "For a **binary search tree** there is no way to hang one tree under another in general, because the keys overlap. The standard method is to list both trees in inorder (two sorted lists, Θ(n) each), merge the two sorted lists (Θ(n)), and build a balanced tree from the merged list (Θ(n)): **Θ(n)** in all. Inserting the nodes of one tree into the other one by one would cost n inserts of up to Θ(n) each on a skewed tree: Θ(n²), which is why the merge method is preferred." },
    { t: "ex", id: "d15-e3" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Worst case, average case, and balanced or not" },
    { t: "p", text: "Most wrong answers in this area come from mixing the cases. A plain BST searches in Θ(log n) on average over random insertion orders but Θ(n) in the worst case; an AVL tree is Θ(log n) in the worst case. A hash table searches in Θ(1) on average but Θ(n) in the worst case (every key in one bucket); it is a subject of the Algorithms book. A dynamic array appends in Θ(1) **amortised**, though a single append can cost Θ(n)." },
    { t: "p", text: "When a question says 'worst case', give the cost for the worst input of size n, not the typical one. When it says 'amortised', give the total over a sequence divided by its length. When it says 'balanced' or names an AVL tree, you may use the height Θ(log n). When it just says 'binary search tree', assume it may be skewed." },
    { t: "p", text: "A short list of tests before you answer: is the structure balanced? is the cost for the worst case or on average? does the operation need the structure to stay ordered afterwards? does it need only an end of the structure, or the middle? Each answer removes some of the options in a question." },
    { t: "ex", id: "d15-e4" },
    { t: "trap", i: 2 },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Questions on choosing structures are of three kinds: a **cost comparison** across several structures at once (the meld question, example 3), a **workload** question that asks which structure is best for a described job (example 2), and a **true or false list** of cost statements (example 4). They reward knowing the table in the first section by heart and using it to decide." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you reason from how each structure is built rather than from memory of a cost: ask how many items must be touched, and whether the structure's order property survives the operation." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Assuming a BST is balanced and answering Θ(log n) for the worst case.", "Calling a heap searchable in Θ(log n); only the minimum is found quickly.", "Forgetting that melding two array heaps needs a rebuild.", "Mixing amortised, average and worst case.", "Choosing a linked list for random access."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["No structure wins everywhere; choose by the operation the program does most.", "Fast search: sorted array, balanced BST. Fast extreme: heap. Cheap middle insert or delete: linked list. Fast access by position: array.", "Queue: first in, first out. Stack: last in, first out. Heap: the best item first.", "Meld: doubly linked list Θ(1) with a tail pointer; array heap Θ(n) by rebuild; BST Θ(n) by merging the inorder lists.", "Always say which case a cost is for: worst, average or amortised.", "A plain BST can have height n − 1; an AVL tree cannot."] },
  ],
  blocks: [
    { type: "figure", id: "d15-f1", caption: "Steps for n = 1000: a linear search needs 1000, a binary search 10, a heap or balanced tree is 9 levels tall, and merging two sorted arrays of 1000 takes 1999 comparisons.", alt: "A table with four numbers: 1000, 10, 9 and 1999.", fig: { kind: "matrix", title: "n = 1000", cols: ["linear search", "binary search", "heap height", "merge two arrays"], rows: [{ label: "worst-case steps", cells: [1000, 10, 9, 1999], hl: true }] } },
    { type: "figure", id: "d15-f2", caption: "Ask what the program needs most, and the structure follows.", alt: "Five needs with the structure that suits each: smallest first, heap; arrival order, queue; latest first, stack; sorted lookup, AVL tree; by position, array.", fig: { kind: "strip", items: [{ label: "smallest first", sub: "heap", state: "now" }, { label: "arrival order", sub: "queue", state: "todo" }, { label: "latest first", sub: "stack", state: "todo" }, { label: "sorted lookup", sub: "AVL tree", state: "todo" }, { label: "by position", sub: "array", state: "todo" }] } },
    { type: "example", id: "d15-e1", level: "easy", title: "Which structure gives what quickly?", file: "structure_pick.txt", given: `Match each need to a structure: (a) the smallest key, again and again, with new keys arriving; (b) a lookup of any key in O(log n) in the worst case; (c) the k-th item in O(1).`, find: "One structure for each.", steps: [
      { say: "(a) needs find-min in Θ(1) and insert in Θ(log n): a binary min-heap.", result: "heap" },
      { say: "(b) needs a guaranteed balanced search structure: an AVL tree (or a sorted array when nothing is inserted).", result: "AVL tree" },
      { say: "(c) needs random access: an array.", result: "array" },
    ], answer: "(a) heap, (b) AVL tree, (c) array", check: "A plain BST is not guaranteed for (b): its worst case is Θ(n)." },
    { type: "example", id: "d15-e2", level: "gate", title: "A workload", file: "workload.txt", given: `A hospital program must always treat the most serious patient next. Patients arrive at random; the program only ever asks for the most serious waiting patient and adds new ones. n patients are waiting.`, find: "The best structure and the cost per operation, compared with a sorted array.", steps: [
      { say: "The needs are insert and extract-the-most-serious: a max-heap.", result: "heap" },
      { say: "Insert Θ(log n) and extract Θ(log n).", result: "Θ(log n) each" },
      { say: "A sorted array extracts in Θ(1) at the right end but each insert shifts items: Θ(n).", result: "worse for insert" },
    ], answer: "A max-heap: Θ(log n) per insert and per extract", check: "A balanced BST would also do Θ(log n), but a heap is simpler and uses an array." },
    { type: "example", id: "d15-e3", level: "gate", title: "GATE CS 2025 (afternoon), Q38 · 2 marks · MCQ: worst-case time of meld", file: "gate2025_an_q38.txt", given: `A meld operation combines two instances of a data structure into one of the same kind. Worst-case time for instances of size n:
P: unsorted doubly linked list with pointers to the head and the tail
Q: min-heap implemented using an array
R: binary search tree
(A) P: Θ(1), Q: Θ(n), R: Θ(n)   (B) P: Θ(1), Q: Θ(n log n), R: Θ(n)
(C) P: Θ(n), Q: Θ(n log n), R: Θ(n²)   (D) P: Θ(1), Q: Θ(n), R: Θ(n log n)`, find: "The correct option.", steps: [
      { say: "P: attach the tail of one list to the head of the other. One pointer change.", result: "Θ(1)" },
      { say: "Q: concatenate the arrays (Θ(n)) and rebuild the heap with build-heap (Θ(n)). Not Θ(n log n): build-heap is linear.", result: "Θ(n)" },
      { say: "R: inorder both trees, merge the two sorted lists, build a balanced tree: each step Θ(n).", result: "Θ(n)" },
    ], answer: "A: Θ(1), Θ(n), Θ(n)", check: "Option B would arise if the heap were built by n inserts; build-heap does better." },
    { type: "example", id: "d15-e4", level: "gate", title: "True or false: cost statements", file: "cost_statements.txt", given: `(1) Searching a binary search tree takes O(log n) in the worst case.
(2) Finding the minimum of a binary min-heap takes O(1).
(3) Deleting a given node from a doubly linked list takes O(1).
(4) Searching for an arbitrary key in a heap takes O(log n).`, find: "Which are true.", steps: [
      { say: "(1) false: a skewed BST has height n − 1.", result: "false" },
      { say: "(2) true: the minimum is at the root.", result: "true" },
      { say: "(3) true: node->prev is at hand.", result: "true" },
      { say: "(4) false: a heap has no order between the two subtrees, so a search may visit all n nodes.", result: "false" },
    ], answer: "(2) and (3) are true", check: "An AVL tree would make (1) true." },

    { type: "trap", wrong: "A binary search tree finds any key in O(log n) in the worst case.", tempting: "Each comparison halves the tree.", whyWrong: "It halves a balanced tree only. A BST built from sorted keys is a chain of height n − 1 and a search can take n steps. Only a balanced tree such as an AVL tree guarantees Θ(log n).", rule: "BST: Θ(height). Say balanced before you say log n.", ex: { code: "insert 1, 2, 3, 4, 5; search 5", out: "5 comparisons" } },
    { type: "trap", wrong: "Melding two array min-heaps takes O(1): just join the arrays.", tempting: "Joining two lists is O(1).", whyWrong: "Joining the arrays does not give a heap: the smaller keys of the second heap may sit below larger keys of the first. A rebuild is needed (build-heap, Θ(n)), and even copying the n items of one array costs Θ(n).", rule: "Array heap meld: Θ(n).", ex: { code: "heaps 1 5 9 and 2 3 4 joined: 1 5 9 2 3 4", out: "9 above 2 and 3: not a heap" } },
    { type: "trap", wrong: "An average-case cost can be quoted as the worst case.", tempting: "Θ(log n) for BST search is the textbook number.", whyWrong: "The textbook number is for a random or balanced tree. For the worst case of a BST it is Θ(n); a hash table is Θ(1) on average and Θ(n) in the worst case; a dynamic array append is Θ(1) amortised but Θ(n) for a single bad append.", rule: "Match the case the question names: worst, average or amortised.", ex: { code: "hash table, all keys in one bucket", out: "search is Θ(n), not Θ(1)" } },

    { type: "gate", text: "GATE 2025 AN Q38 (the meld of a list, an array heap and a BST) is the question tagged to this chapter. The cost table of the first section answers most 'which structure' questions." },
    { type: "recall", cards: [
      { q: "Which structures search in Θ(log n) in the worst case?", a: "A sorted array (binary search) and a balanced search tree such as an AVL tree." },
      { q: "Which structure gives the minimum in Θ(1)?", a: "A min-heap (the root)." },
      { q: "Insert and extract in a heap?", a: "Θ(log n) each." },
      { q: "Delete a given node in a doubly linked list?", a: "Θ(1)." },
      { q: "Meld two unsorted doubly linked lists with tail pointers?", a: "Θ(1)." },
      { q: "Meld two array min-heaps?", a: "Θ(n): concatenate and run build-heap." },
      { q: "Meld two BSTs?", a: "Θ(n): merge the two inorder lists and build a balanced tree." },
      { q: "Worst-case height of a plain BST?", a: "n − 1." },
      { q: "Which structure for 'the most urgent job next'?", a: "A heap (priority queue)." },
      { q: "Which for 'undo the last action'?", a: "A stack." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "MCQ", marks: 1, q: "Which structure finds the smallest key in Θ(1) and removes it in Θ(log n)?", options: ["Sorted linked list", "Binary min-heap", "Binary search tree (unbalanced)", "Queue"], answer: "B", solution: "The root of a min-heap." },
      { id: "h2", kind: "MCQ", marks: 1, q: "Which gives Θ(log n) search in the worst case?", options: ["Unsorted array", "Singly linked list", "AVL tree", "Heap"], answer: "C", solution: "An AVL tree is always balanced." },
      { id: "h3", kind: "NAT", marks: 1, q: "How many comparisons does a linear search make in the worst case on 2500 items?", answer: "2500", solution: "Every item is compared." },
      { id: "h4", kind: "NAT", marks: 1, q: "What is the maximum number of probes of a binary search on a sorted array of 1000 items?", answer: "10", solution: "⌊log₂ 1000⌋ + 1." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true in the worst case?", options: ["Deleting a given node of a doubly linked list is O(1)", "Searching a BST is O(log n)", "Finding the minimum of a min-heap is O(1)", "Melding two array heaps is O(n)"], answer: "A, C, D", solution: "A plain BST can be a chain, so B is false." },
      { id: "h6", kind: "NAT", marks: 2, q: "Two sorted arrays of 500 items each are merged into one sorted array. What is the largest number of comparisons the merge can make?", answer: "999", solution: "2n − 1 with n = 500 each: 999 comparisons for 1000 items." },
      { id: "h7", kind: "NAT", marks: 2, q: "A heap holds 1000 items. How many levels (counting the root as level 1) does it have?", answer: "10", solution: "Height ⌊log₂ 1000⌋ = 9 edges, so 10 levels." },
      { id: "h8", kind: "MCQ", marks: 2, q: "A program must repeatedly serve the earliest-arrived request and never needs anything else. The best structure is", options: ["Heap", "Queue", "AVL tree", "Stack"], answer: "B", solution: "FIFO order is a queue." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on data structures", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "back to the contents", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Arrays (D2)", "Linked lists (D3)", "Stacks and queues (D4, D5)", "Trees, BSTs and AVL (D7 to D9)", "Heaps (D10)"], usedIn: ["Algorithms: sorting, hashing, graph algorithms"], cross: ["Algorithms: asymptotic analysis"] },
  ],
};
