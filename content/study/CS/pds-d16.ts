import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D16 "Previous-year patterns and mixed practice" (29 Nov 2026). Groups the real GATE questions explained in D3 to D15
 * (26 in all) by the skill they test, and gives mixed practice. Every number in the examples was checked by hand or program:
 * BST of 50 30 70 20 40 60 80 has postorder 20 40 30 60 80 70 50; a heap of 31 keys has leaves 16 to 31; of the orders 3 4 2 1 and 4 1 3 2 of 1 2 3 4
 * a stack can make only the first.
 */
export const chapterD16: Topic = {
  id: "cs.pds.ds.patterns16",
  title: "Previous-year patterns and mixed practice",
  no: "D16",
  book: [
    { t: "p", text: "The earlier chapters taught one structure at a time. A paper does not: a question on a linked list may be followed by one on a heap and one on a tree, and the skill needed is to recognise the pattern fast. This closing chapter gathers the real GATE questions of the Data Structures book, groups them by the skill they test, and gives a method and a set of mixed questions to practise on." },
    { t: "p", text: "Twenty-six real questions are explained in chapters D3 to D15. They fall into five patterns, and the five patterns cover almost every question the paper has asked on the subject." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["name the pattern of a data structure question within a few seconds;", "apply a short method to each pattern;", "solve a mixed set of questions that jumps between structures."] },

    { t: "h2", text: "The five patterns" },
    { t: "p", text: "Look at what the question gives you and what it asks for. The five patterns are: **trace** (follow pointers or operations step by step), **count** (a number from a formula: leaves, height, nodes, edges), **cost** (a time complexity or a comparison between structures), **build and traverse** (construct a tree and write a traversal), and **index arithmetic** (positions in an array-based tree or heap)." },
    { t: "fig", id: "d16-f1" },
    { t: "p", text: "The figure shows how the real questions spread. Tracing and cost questions are the most common; counting questions are quick marks if you know the formulas; building a tree and index arithmetic appear in nearly every paper." },
    { t: "table", head: ["Pattern", "Real questions explained in this book", "Chapters"], rows: [["Trace", "2026 AN Q50 (stack and queue assignment); 2023 FN Q59 (stack and queue operations); 2025 FN Q62 (removing nodes found in another list); 2026 FN Q39 (recursion on a list)", "D3, D4, D5"], ["Count", "2026 FN Q33 (tallest full binary tree); 2025 AN Q13 (nodes with two children); 2018 FN Q56 (number of min-heaps); 2025 FN Q35 (height of a heap); 2026 FN Q23 (leaf indices)", "D7, D10"], ["Cost", "2023 FN Q13 (delete in singly and doubly lists); 2022 FN Q15 (reverse in O(1) space); 2018 FN Q13 (queue on a singly list); 2023 FN Q46 (priority queue); 2020 FN Q16 (AVL inserts); 2025 AN Q38 (meld); 2025 AN Q45 (stack with MIN); 2025 FN Q26 (BST statements); 2026 AN Q49 (keys between a leaf and its successor)", "D3, D4, D5, D9, D10, D15"], ["Build and traverse", "2026 AN Q12 (traversal order); 2018 FN Q30 (height from two traversals); 2025 AN Q35 (depth in a BST); 2026 FN Q62 (postorder position); 2020 FN Q15 (preorder to postorder); 2026 FN Q40 (complete BST)", "D7, D8"], ["Index arithmetic", "2022 FN Q28 (a complete BST in an array); 2023 FN Q12 (is this array a heap)", "D8, D10"]] },
    { t: "callout", kind: "tip", text: "Read the question twice. First find the structure and the pattern; then pick the formula or the trace. Most lost marks come from using the right formula on the wrong structure." },

    { t: "h2", text: "Trace questions" },
    { t: "p", text: "A trace question gives code or a list of operations and asks for the result. The only method is to draw the structure and redraw it after every operation. For a list draw the nodes and the pointer variables; for a stack and a queue draw both with the top and the front marked; for a recursive function draw the call tree." },
    { t: "p", text: "The usual traps are small: the order of two pointer assignments, whether a variable still points to the old node, and which end is the top of the stack or the front of the queue. When 'repeat k times' appears, check whether it means k times in all or k more times." },
    { t: "p", text: "A worked example of the habit: for a stack question, write the stack as a column after every operation and mark the top. When the question also has a queue, draw it beside it. Answer only from the drawings." },
    { t: "ex", id: "d16-e1" },

    { t: "h2", text: "Count questions" },
    { t: "p", text: "A count question has a formula behind it. Keep the short list in mind: a tree on n nodes has n − 1 edges; a full binary tree has (n + 1)/2 leaves and height at most (n − 1)/2; a perfect tree of height h has 2^(h+1) − 1 nodes; a heap on n keys has height ⌊log₂ n⌋ and its leaves are the indices ⌊n/2⌋ + 1 to n (numbering from 1); the sum of the degrees of a graph is twice the edges; the fewest nodes of an AVL tree of height h follow N(h) = N(h − 1) + N(h − 2) + 1." },
    { t: "ex", id: "d16-e2" },
    { t: "p", text: "Test every formula on a tiny case before you trust it: a tree of one node, a heap of three keys, a graph of one edge. If the formula fails the tiny case, you have the wrong one." },

    { t: "h2", text: "Cost questions" },
    { t: "p", text: "A cost question asks for the time of an operation or a comparison between structures. Use the table of chapter D15, and keep the three cases apart: worst, average and amortised. Find out whether the tree is balanced, whether the list is singly or doubly linked, and whether the array is sorted." },
    { t: "p", text: "For comparison questions, list the structures in a column and the operation in a row, and fill the cells from the table of chapter D15 before you compare. The right option is then usually the only one whose every cell matches." },
    { t: "ex", id: "d16-e3" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Build and traverse questions" },
    { t: "p", text: "These ask you to construct a tree from a sequence (insertion order, preorder, or inorder with another traversal) and then answer something about it. The method is to build carefully, one key at a time, drawing the tree; then read the traversal, depth or height off the drawing, not from memory." },
    { t: "ex", id: "d16-e4" },
    { t: "p", text: "Remember what is fixed and what is not. The inorder of a BST is always sorted, whatever the insertion order. The shape depends on the order. A BST is fixed by its preorder alone; a general binary tree needs the inorder and one more traversal." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Index arithmetic questions" },
    { t: "p", text: "A complete binary tree stored in an array, as in a heap, is a source of quick marks. With the root at index 1, the children of i are 2i and 2i + 1 and the parent is ⌊i/2⌋. With the root at index 0 they are 2i + 1, 2i + 2 and ⌊(i − 1)/2⌋. Always check the first index in the question." },
    { t: "p", text: "Check an index answer against the picture: draw the first three levels of the tree with their indices and see that the answer sits where the formula says. A question that asks for the position of the third largest key in a complete BST combines this with the search rule: follow the right children to the largest key, then take predecessors." },
    { t: "ex", id: "d16-e5" },
    { t: "trap", i: 2 },

    { t: "h2", text: "A method for any question" },
    { t: "p", text: "Use the same five steps for every data structure question. First, name the structure and the pattern. Second, write down the quantity asked for (a number, a position, a complexity, a statement that must be true or false). Third, draw a small example that follows the question's rules. Fourth, apply the formula or trace the operations on the example. Fifth, check the answer against a simple case or against the options." },
    { t: "p", text: "The method is short on purpose. The second step, writing the quantity asked for, prevents the commonest error of all: solving a different question from the one in front of you." },
    { t: "fig", id: "d16-f2" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Data structure questions in the paper come at one or two marks, in MCQ, MSQ and NAT form, and about four to six per paper once the graph questions of other subjects are counted. The real ones are the 26 explained in this book. Keep the table of patterns in mind; for each real question you meet, say which pattern it is before you start." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Care and recall: care in following a structure through several steps without losing track, and recall of the handful of formulas and costs that the structures have. There are few tricks; there are many chances for a slip." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Using the wrong structure's formula (a full tree's leaf count on a complete tree).", "Mixing the numbering of an array tree (0-based against 1-based).", "Quoting the average-case cost when the question says worst case.", "Skipping the drawing and tracing in the head.", "Reading 'height' in nodes when the question counts edges."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Five patterns: trace, count, cost, build and traverse, index arithmetic.", "Trace by redrawing the structure after every step.", "Count with the short list of formulas, tested on a tiny case.", "Cost from the table: balanced or not, worst or average, singly or doubly linked.", "Build a tree key by key, then read the answer off the drawing.", "Check the first index of an array tree before using 2i or 2i + 1."] },
  ],
  blocks: [
    { type: "figure", id: "d16-f1", caption: "The 26 real questions of this book by pattern: cost 9, build and traverse 6, count 5, trace 4, index arithmetic 2.", alt: "A table of the five patterns with the number of real questions explained in this book for each.", fig: { kind: "matrix", title: "Questions per pattern", cols: ["questions"], rows: [{ label: "Cost", cells: [9], hl: true }, { label: "Build and traverse", cells: [6] }, { label: "Count", cells: [5] }, { label: "Trace", cells: [4] }, { label: "Index arithmetic", cells: [2] }] } },
    { type: "figure", id: "d16-f2", caption: "The five steps for any data structure question.", alt: "Five steps: name the structure and pattern, write the quantity asked, draw a small example, apply the formula or trace, check on a simple case.", fig: { kind: "strip", items: [{ label: "1. Name it", sub: "structure, pattern", state: "done" }, { label: "2. Quantity", sub: "what is asked", state: "done" }, { label: "3. Draw", sub: "a small example", state: "done" }, { label: "4. Apply", sub: "formula or trace", state: "done" }, { label: "5. Check", sub: "a simple case", state: "done" }] } },

    { type: "example", id: "d16-e1", level: "gate", title: "Stack orders: which can be produced?", file: "mixed_stack.txt", given: `Input 1 2 3 4 into a stack, popping whenever you like. Which of the outputs (a) 3 4 2 1 and (b) 4 1 3 2 is possible?`, find: "The possible one.", steps: [
      { say: "(a): push 1, 2, 3; pop 3; push 4; pop 4; pop 2; pop 1.", result: "possible" },
      { say: "(b): to pop 4 first, 1, 2, 3 are below it with 3 on top, so 3 must come out before 1.", result: "impossible" },
    ], answer: "Only (a)", check: "An output is impossible if it contains an item, then a smaller one, then one between them (3 1 2 shape)." },
    { type: "example", id: "d16-e2", level: "easy", title: "A heap in an array: leaves, parent and height", file: "mixed_heap.txt", given: `A binary heap holds 31 keys in an array indexed from 1.`, find: "The first leaf index, the parent of index 25, and the height.", steps: [
      { say: "Leaves are the indices ⌊n/2⌋ + 1 to n: ⌊31/2⌋ = 15, so the first leaf is 16.", result: "16" },
      { say: "The parent of 25 is ⌊25/2⌋.", result: "12" },
      { say: "Height ⌊log₂ 31⌋: 31 nodes fill levels of sizes 1, 2, 4, 8, 16, which is a perfect tree of height 4.", result: "4" },
    ], answer: "First leaf 16; parent of 25 is 12; height 4", check: "A perfect tree of height 4 has 2⁵ − 1 = 31 nodes." },
    { type: "example", id: "d16-e3", level: "gate", title: "Which structure, which cost?", file: "mixed_cost.txt", given: `n items. (a) delete a given node in a doubly linked list; (b) search in an AVL tree; (c) build a min-heap from an unsorted array; (d) search a plain BST built from sorted input.`, find: "The worst-case time of each.", steps: [
      { say: "(a) node->prev and node->next are at hand.", result: "Θ(1)" },
      { say: "(b) always balanced.", result: "Θ(log n)" },
      { say: "(c) build-heap sifts down from the middle: the sum of heights is linear.", result: "Θ(n)" },
      { say: "(d) sorted input gives a chain of height n − 1.", result: "Θ(n)" },
    ], answer: "(a) Θ(1), (b) Θ(log n), (c) Θ(n), (d) Θ(n)", check: "(b) and (d) differ because of balancing, not because they are both search trees." },
    { type: "example", id: "d16-e4", level: "gate", title: "Build a BST and read it", file: "mixed_bst.txt", given: `Insert 50, 30, 70, 20, 40, 60, 80 into an empty BST.`, find: "The postorder traversal and the height.", steps: [
      { say: "50 is the root; 30 left, 70 right; 20 and 40 under 30; 60 and 80 under 70: a perfect tree.", result: "height 2" },
      { say: "Postorder is left, right, node: 20 40 30, then 60 80 70, then 50.", result: "20 40 30 60 80 70 50" },
    ], answer: "Postorder 20 40 30 60 80 70 50; height 2", check: "The inorder 20 30 40 50 60 70 80 is sorted, as it must be." },
    { type: "example", id: "d16-e5", level: "easy", title: "Index arithmetic with 0-based numbering", file: "mixed_index.txt", given: `A complete binary tree of 12 nodes is stored in an array from index 0.`, find: "The children of index 4 and the parent of index 9.", steps: [
      { say: "Children of i are 2i + 1 and 2i + 2: 9 and 10, both inside the 12 nodes (indices 0 to 11).", result: "9 and 10" },
      { say: "Parent of i is ⌊(i − 1)/2⌋: ⌊8/2⌋.", result: "4" },
    ], answer: "Children 9 and 10; parent of 9 is 4", check: "The two answers agree: 4 has the child 9." },

    { type: "trap", wrong: "Use the first formula that comes to mind: leaves = (n + 1)/2.", tempting: "It is a famous formula.", whyWrong: "It holds for full binary trees (every node 0 or 2 children). A heap is complete, not full; a heap of 10 keys has 5 leaves, but (10 + 1)/2 is not even a whole number. Name the structure before you pick the formula.", rule: "Full tree: (n + 1)/2 leaves. Heap (complete): the last ⌈n/2⌉ indices.", ex: { code: "heap of 10 keys: leaves are indices 6 to 10", out: "5 leaves" } },
    { type: "trap", wrong: "Insertion order does not matter for a BST.", tempting: "The inorder is the same for every order.", whyWrong: "Only the inorder (the sorted keys) is the same. The shape, the height and the preorder and postorder all depend on the insertion order: sorted input gives a chain.", rule: "Order changes the shape, never the inorder.", ex: { code: "insert 1, 2, 3 vs 2, 1, 3", out: "chain of height 2 vs a tree of height 1" } },
    { type: "trap", wrong: "The children of index i are always 2i and 2i + 1.", tempting: "It is the textbook rule.", whyWrong: "It holds when the root is at index 1. With the root at index 0 the children are 2i + 1 and 2i + 2. Using the wrong rule shifts every answer by one.", rule: "Check the first index first.", ex: { code: "root at 0, i = 1: children", out: "3 and 4, not 2 and 3" } },

    { type: "gate", text: "The Data Structures questions of the paper are the 26 explained in chapters D3 to D15; the five patterns of this chapter cover all of them. Use the table of the first section to name the pattern of each question before you solve it." },
    { type: "recall", cards: [
      { q: "The five patterns of a data structure question?", a: "Trace, count, cost, build and traverse, index arithmetic." },
      { q: "Leaves of a full binary tree on n nodes?", a: "(n + 1)/2." },
      { q: "Leaf indices of a heap on n keys, numbered from 1?", a: "⌊n/2⌋ + 1 to n." },
      { q: "Height of a heap on n keys?", a: "⌊log₂ n⌋." },
      { q: "Children of i with the root at 1? At 0?", a: "2i, 2i + 1; 2i + 1, 2i + 2." },
      { q: "Fewest nodes of an AVL tree of height h?", a: "N(h) = N(h − 1) + N(h − 2) + 1." },
      { q: "Sum of the degrees of a graph?", a: "2e." },
      { q: "Cost of build-heap?", a: "Θ(n)." },
      { q: "What is the same for every BST on the same keys?", a: "The inorder traversal (sorted)." },
      { q: "The five steps for any question?", a: "Name it, state the quantity, draw, apply, check." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "Keys 8, 3, 10, 1, 6, 14, 4, 7, 13 are inserted into an empty BST in this order. How many leaves does the tree have?", answer: "4", solution: "Leaves: 1, 4, 7 and 13." },
      { id: "h2", kind: "NAT", marks: 1, q: "A heap of 100 keys is indexed from 1. How many of its nodes are leaves?", answer: "50", solution: "Indices 51 to 100." },
      { id: "h3", kind: "MCQ", marks: 1, q: "Deleting a given node of a doubly linked list takes", options: ["Θ(1)", "Θ(log n)", "Θ(n)", "Θ(n²)"], answer: "A", solution: "Both neighbours are at hand." },
      { id: "h4", kind: "NAT", marks: 1, q: "A full binary tree has 15 leaves. How many nodes does it have?", answer: "29", solution: "Leaves = (n + 1)/2, so n = 2 × 15 − 1." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["The inorder traversal of a BST is sorted", "A heap is a BST", "Build-heap takes Θ(n)", "A tree with n nodes has n − 1 edges"], answer: "A, C, D", solution: "A heap is not a BST." },
      { id: "h6", kind: "NAT", marks: 2, q: "What is the fewest number of nodes of an AVL tree of height 3 (a single node has height 0)?", answer: "7", solution: "N(0) = 1, N(1) = 2, N(2) = 4, N(3) = 4 + 2 + 1 = 7." },
      { id: "h7", kind: "NAT", marks: 2, q: "A simple graph has degrees 4, 3, 3, 2, 2. How many edges does it have?", answer: "7", solution: "Degree sum 14 = 2e." },
      { id: "h8", kind: "NAT", marks: 2, q: "A circular queue of capacity 8 (one slot always empty) has front = 6 and rear = 2 (next free slot). How many items does it hold?", answer: "4", solution: "(2 − 6 + 8) mod 8 = 4." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on data structures", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "back to the contents", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Every chapter of the Data Structures book"], usedIn: ["Algorithms: sorting, hashing, graph algorithms"], cross: ["Algorithms: asymptotic analysis"] },
  ],
};
