# 04 · Subject plan: Data Structures (plan v1, for review)

**Reader:** a dropper who has finished (or will first finish) the C plan. **Goal:** the reader can draw, build, trace and count any structure GATE asks: arrays, linked lists, stacks, queues, trees, binary search trees, balanced trees, heaps, graphs (representation) and hash tables; and can say the cost of every operation and why.

## 0. How big is this subject?

The GATE syllabus lists: *"Recursion; Arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs"* under Programming and Data Structures, and *"Searching, sorting, hashing"* under Algorithms. A student needs **about 16 chapters** because GATE asks them as: drawing and counting questions (heights, nodes, leaves), operation traces (insert, delete, rotate, heapify), conversions (infix/postfix, traversals), code-output questions with pointers, and complexity of operations.

| GATE asks | The student must know |
|---|---|
| "How many nodes / leaves / height?" | Tree vocabulary and counting formulas (and the proofs, as pictures) |
| "Insert these keys; what is the tree?" | BST, AVL, heap, B-tree algorithms traced by hand |
| "Which traversal gives this?" / "reconstruct" | Pre-, in-, post-, level-order; uniqueness; counting trees |
| "Output of this code on a list" | C pointers + linked-list operations |
| "Stack contents / postfix value" | Stack applications and expression conversion |
| "Time of this operation" | Cost of each operation on each structure, with reasons |
| "Which structure is best for ...?" | Comparison tables with the reason |
| "Hash table: where does this key go?" | Hash functions, collisions, probing, load factor, expected probes |

> **To verify from our question bank:** how often each structure is asked, and the question types for each.

## 1. The ladder of chapters

```
Part A  Ideas                D0  What is a data structure? Abstract data types, cost, memory pictures
Part B  Linear structures    D1  Arrays (operations, addressing, sparse and triangular storage)
                             D2  Linked lists (singly, doubly, circular)
                             D3  Stacks
                             D4  Queues, circular queues, deques, priority queues
                             D5  Recursion as a tool (call tree, base case, depth)
Part C  Trees                D6  Trees: vocabulary, binary trees, counting, traversals
                             D7  Binary search trees
                             D8  Balanced trees: AVL (and B, B+, red-black basics)
                             D9  Binary heaps and priority queues
                             D10 Tries and other trees (light; mostly [BEYOND])
Part D  Hashing and graphs   D11 Hashing
                             D12 Graphs: representation and basic properties
                             D13 Disjoint sets (union-find) (light)
Part E  Putting it together  D14 Choosing the right structure; cost tables
                             D15 GATE patterns and mixed practice
```

(Graph algorithms, sorting, searching and complexity proofs belong to the **Algorithms** plan; here we build the structures those algorithms stand on.)

## 2. How each chapter is written

Every topic follows the 12-station ladder of the master prompt. For each chapter: **Topics → Beginner must see → Finer points → GATE level → Diagrams → Traces by hand → Code.** Every structure is taught three ways: **picture → operations drawn frame by frame → C code with the memory drawn beside it.**

---

## D0 · What is a data structure?

- **Topics:** D0.1 data and the need to organise it (library, phone contacts, queue at a counter); D0.2 abstract data type (what it does) vs data structure (how it does it); D0.3 the main operations: insert, delete, search, traverse, update; D0.4 cost of an operation: counting steps; D0.5 the memory model: contiguous vs linked; D0.6 static vs dynamic; D0.7 linear vs non-linear; D0.8 reading the cost tables used in the rest of the book.
- **Beginner must see:** the same data in two arrangements behaves very differently; "cost" means how many steps as the data grows.
- **Diagrams:** COMPARE (array vs list on the same operations); MEMORY (contiguous vs scattered); a "steps vs size" picture for constant, linear and quadratic.

## D1 · Arrays as a data structure

- **Topics:** D1.1 array operations: access, insert at position, delete at position, search, traverse; D1.2 shifting elements (the cost, drawn); D1.3 insertion in a sorted array; D1.4 binary search on an array (drawn); D1.5 two-dimensional arrays and storage order; D1.6 **address formulas** (row-major, column-major, with lower bounds not equal to 0, 3-D); D1.7 special matrices: diagonal, upper/lower triangular, symmetric, tri-diagonal, band: how to store only the non-zero part and the **index formula** for each; D1.8 sparse matrices (triplet form); D1.9 rotation, reversal, merge of arrays; D1.10 strings as arrays; D1.11 dynamic arrays (doubling) and amortised cost.
- **Finer points:** insertion at the front costs n shifts; `a[i]` is constant time because of the formula; lower bound ≠ 0 changes the formula; storing triangular matrices saves n(n-1)/2 cells; amortised cost of appending with doubling is O(1) and *why* (the sum of copies); array vs list trade-off.
- **GATE level:** address calculation (very common); position formulas for triangular storage; count of shifts; amortised analysis of doubling.
- **Diagrams:** ARRAY with shifting arrows frame by frame; row-major vs column-major as a grid and as one row; triangular matrix with its packed 1-D array and the mapping; FRAMES for dynamic-array doubling.

## D2 · Linked lists

- **Topics:** D2.1 the idea (a chain of nodes each pointing to the next); D2.2 node as a C `struct`; D2.3 singly linked list: traverse, search, insert at head, at tail, at position, delete head, tail, a given key; D2.4 using a **dummy (header) node**; D2.5 reversing a list (iterative and recursive, both drawn); D2.6 finding the middle (slow/fast pointers); D2.7 detecting and removing a cycle (Floyd's tortoise and hare, why it works); D2.8 merging two sorted lists; D2.9 doubly linked list; D2.10 circular lists; D2.11 deleting a node when only its pointer is given; D2.12 list vs array: cost table; D2.13 variations: skip list (note), XOR list (note).
- **Finer points:** the order of pointer assignments matters (`new->next = cur->next` *before* `cur->next = new`); empty list; one-node list; `head` may change; losing the rest of the list; memory leaks; the O(n) cost of reaching the tail unless a tail pointer is kept; the O(1) deletion in a doubly list given the node.
- **GATE level:** "what does this function do to the list?"; pointer-update order bugs; reverse and recursion output; cycle detection; counting pointer changes.
- **Diagrams:** LINKED (node boxes with arrows, `head`, NULL); FRAMES of every operation, one pointer change per frame; the reverse algorithm with `prev`, `cur`, `next` labelled in each frame; the cycle meeting-point picture with distances.
- **Code:** each operation in C with the memory beside it; run and shown.

## D3 · Stacks

- **Topics:** D3.1 the idea (a pile of plates: last in, first out); D3.2 operations: push, pop, peek, isEmpty, isFull; D3.3 array implementation; D3.4 linked-list implementation; D3.5 overflow and underflow; D3.6 applications: balanced brackets; function calls and recursion; undo; D3.7 **expression evaluation**: postfix evaluation traced; D3.8 **infix → postfix and infix → prefix conversion** with the operator stack, precedence and associativity (including right-associative `^`); D3.9 next-greater-element and monotonic stack; D3.10 min-stack; D3.11 two stacks in one array; D3.12 sequences of push/pop: **which output permutations are possible** (counting = Catalan numbers); D3.13 stack using queues.
- **Finer points:** unary minus; parentheses handling; the stack's contents after each token; maximum stack depth for an expression; reversing a string; pushing and popping counts.
- **GATE level:** conversion and evaluation (every year or two); "is this output sequence possible?"; stack depth; number of valid sequences.
- **Diagrams:** a vertical STACK with push/pop FRAMES; TRACE for postfix evaluation (token, action, stack); TRACE for infix to postfix (token, stack, output); a permutation checker drawn as push/pop timelines.

## D4 · Queues

- **Topics:** D4.1 the idea (line at a ticket counter: first in, first out); D4.2 operations: enqueue, dequeue, front, rear; D4.3 array implementation and why a plain one wastes space; D4.4 **circular queue** (the `(rear+1) % n` idea; full vs empty detection; the one-slot-empty method and the count method); D4.5 linked-list implementation; D4.6 double-ended queue (deque), input- and output-restricted; D4.7 priority queue (concept; implementation by array, list and heap); D4.8 queue using two stacks; stack using two queues; costs; D4.9 applications (BFS, scheduling, buffering); D4.10 counting questions (how many elements, where are front and rear after k operations).
- **Finer points:** full condition `(rear+1)%n == front`; empty `front == rear`; why one cell is left unused; amortised cost of the two-stack queue; deque with a circular array.
- **GATE level:** front/rear positions after operations; capacity of circular queues; amortised analysis; simulate with stacks.
- **Diagrams:** a circular array drawn as a ring with `front` and `rear` markers, FRAMES for each enqueue/dequeue; TRACE of operations; two-stack queue FRAMES.

## D5 · Recursion as a tool

- **Topics:** D5.1 a function that calls itself; D5.2 base case and recursive case; D5.3 how the call stack grows and shrinks (draw every frame); D5.4 the **recursion tree** and counting calls; D5.5 direct, indirect, tail recursion; D5.6 classic examples: factorial, Fibonacci, power, GCD, sum of digits, reverse a string, Tower of Hanoi, permutations, subsets, binary search; D5.7 writing a recurrence for the running time; D5.8 recursion vs loops; D5.9 stack overflow; D5.10 output puzzles with printing before and after the recursive call.
- **Finer points:** two printing positions (pre-order vs post-order effect); number of calls for Fibonacci; stack depth n vs log n; mutual recursion; missing base case; a static/global variable inside recursion.
- **GATE level:** "what is returned by f(n)?"; count the calls; the output order puzzles; recurrences (links to Algorithms).
- **Diagrams:** STACKFRAME series; CALLTREE with values returned on the way back; Hanoi FRAMES for 3 discs; TRACE tables.

## D6 · Trees: vocabulary, binary trees, counting and traversals

- **Topics:** D6.1 why trees (family tree, folders); D6.2 vocabulary: root, parent, child, leaf, internal, siblings, ancestor, descendant, edge, path, depth, height, level, degree, subtree; D6.3 binary tree and its types: full (strict), complete, perfect, degenerate (skewed), almost-complete; D6.4 **counting facts** with their picture proofs: nodes in a perfect tree, max nodes at level `l`, max nodes of height `h`, min height for `n` nodes, `n0 = n2 + 1`, edges = n − 1, number of null pointers = n + 1; D6.5 representation: linked nodes and array (`2i`, `2i+1`, parent `i/2`); D6.6 traversals: preorder, inorder, postorder, level-order, each **recursively and with a stack/queue**, each traced; D6.7 the results of traversals; D6.8 **reconstructing a tree** from two traversals (which pairs work and which do not, and why); D6.9 number of distinct binary trees with n nodes (Catalan) and with given traversal; D6.10 threaded binary trees; D6.11 n-ary trees and the left-child right-sibling form; D6.12 expression trees; D6.13 tree algorithms: height, count leaves, mirror, check equal, diameter, lowest common ancestor.
- **Finer points:** height of empty tree (−1 or 0, state the convention GATE uses); height vs depth vs level; a tree with n nodes has exactly n − 1 edges; inorder + preorder (or postorder) is unique, preorder + postorder is not (unless full); level counting from 0 or from 1.
- **GATE level:** counting nodes with given leaf/degree conditions; max/min height; traversal outputs; reconstruction; Catalan counts; "how many binary trees have preorder 1 2 3 ...".
- **Diagrams:** TREE with levels labelled; side-by-side full, complete, perfect, skewed; each traversal as a path around the tree with the visit order numbered, three colours for pre/in/post; reconstruction in FRAMES (root, then left and right subsets); array-index tree picture.

## D7 · Binary search trees

- **Topics:** D7.1 the rule (left smaller, right larger) and why it helps; D7.2 search; D7.3 insertion (frames); D7.4 deletion: leaf, one child, two children (inorder successor/predecessor); D7.5 minimum, maximum, successor, predecessor; D7.6 inorder traversal gives sorted order; D7.7 building a BST from a sequence (and how the order changes the shape); D7.8 number of BST shapes for n keys; D7.9 height: best, worst, average; D7.10 validity check; D7.11 range queries, k-th smallest; D7.12 duplicates; D7.13 time costs.
- **Finer points:** worst case is a chain (sorted input) giving O(n); average height O(log n) for random insertions; deletion with two children replaced by successor, then deleting the successor; the preorder/postorder of a BST determines it uniquely (and how).
- **GATE level:** construct the BST from a sequence; the tree after deleting keys; height after insertions; the number of comparisons for a search; counting BSTs; which sequences give the same BST; which sequence could be a search path.
- **Diagrams:** TREE FRAMES (one insertion per frame, with the comparison path highlighted); deletion cases as three before/after pictures; search-path pictures.

## D8 · Balanced trees: AVL (and B, B+, red-black, 2-3 basics)

- **Topics:** D8.1 why balance; D8.2 AVL: the balance factor and the rule (−1, 0, +1); D8.3 the four imbalance cases and their **rotations** (LL, RR, LR, RL), each as a before/after picture with the three nodes and four subtrees labelled; D8.4 insertion step by step; D8.5 deletion step by step; D8.6 height bounds: **minimum number of nodes in an AVL tree of height h** (`N(h) = N(h−1) + N(h−2) + 1`) and max height for n nodes; D8.7 red-black trees: rules and why they keep height ≤ 2 log n (picture-level); D8.8 2-3 trees and B-trees: order, keys per node, split on overflow, merge on underflow; D8.9 B+ trees: leaf links, why databases use them; D8.10 counting questions for B/B+ (maximum/minimum keys, height for a given number of records); D8.11 splay trees (note).
- **Finer points:** a single rotation fixes insertion imbalance; deletion may need rotations all the way up; the rotation preserves the BST order; the difference between height balanced and weight balanced; B-tree min/max keys formulas for order m; root exceptions.
- **GATE level:** insert/delete sequence and the final AVL tree (very common); count of rotations; minimum nodes for height h; B-tree/B+ order, height and key counts (also DBMS).
- **Diagrams:** TREE FRAMES for each rotation (before, pivot, after); balance factors written on every node; a full AVL insertion sequence in frames; B-tree split FRAMES; B+ tree with linked leaves.

## D9 · Binary heaps and priority queues

- **Topics:** D9.1 priority queue (idea); D9.2 complete binary tree and the heap-order rule (min-heap, max-heap); D9.3 the **array representation** (index maths, 0- or 1-based: both shown); D9.4 insertion (sift up); D9.5 delete-min / delete-max (sift down); D9.6 `heapify`; D9.7 **build-heap in O(n)** (why it is not n log n, with the sum shown); D9.8 heap sort; D9.9 operations: decrease-key, increase-key, delete arbitrary, find k-th largest; D9.10 merging heaps (note: binomial, Fibonacci); D9.11 heap vs BST; D9.12 counting: where can the minimum/maximum be, number of heaps with n keys.
- **Finer points:** the heap is not sorted; the max of a min-heap is in a leaf (the last n/2 positions); height `⌊log2 n⌋`; sift cost = height of the node; the order of the array after insertions; number of comparisons in build-heap.
- **GATE level:** array state after a sequence of inserts/delete-mins; build-heap result and count of swaps; max element position; heap sort passes; time of operations.
- **Diagrams:** HEAP drawn as a tree and as an array together, with index arrows; FRAMES for sift up and sift down; build-heap from the bottom level up; the "cost per level" pyramid.

## D10 · Tries and other trees  *(light, mostly [BEYOND] unless the syllabus demands)*

- **Topics:** tries (prefix trees), suffix ideas, segment and Fenwick trees (note only), k-d trees (note only).
- **Purpose:** broaden vision; clearly marked so the student does not spend time that GATE does not repay.

## D11 · Hashing

- **Topics:** D11.1 the idea (a locker for every key: the hash function chooses the locker); D11.2 hash functions: division (`k mod m`), multiplication, folding, mid-square; what makes a function good; D11.3 collisions; D11.4 **chaining** (separate chaining) with cost; D11.5 **open addressing**: linear probing, quadratic probing, double hashing, each traced; primary and secondary clustering; D11.6 **load factor** α and expected number of probes (successful and unsuccessful search, formulas for chaining and for open addressing under uniform hashing: `1/(1-α)`, `(1/α) ln 1/(1-α)`); D11.7 **deletion** in open addressing (tombstones); D11.8 rehashing and table size (prime sizes); D11.9 perfect hashing and universal hashing (concepts); D11.10 comparison with trees; D11.11 counting questions (maximum probes, empty slots, which key lands where).
- **Finer points:** a table of size m with n keys has α = n/m; chaining can exceed 1, open addressing cannot; a bad `m` (power of 2) with a bad function causes clustering; the order of insertion decides the layout under probing.
- **GATE level:** fill a table with a sequence under a given function and probing; number of collisions; the probing sequence for a key; time to search under chaining; bucket loads.
- **Diagrams:** a TABLE of slots 0..m−1 with keys landing and probes marked as arrows, FRAMES per insertion; chains drawn as linked lists hanging from slots; a curve of probes against load factor.

## D12 · Graphs: representation and basic properties

- **Topics:** D12.1 what a graph is (cities and roads, friends); D12.2 vocabulary: vertex, edge, directed, undirected, weighted, degree, in-degree and out-degree, path, cycle, connected, strongly connected, component, tree as a graph, complete, bipartite, planar; D12.3 counting: maximum edges, handshake lemma, number of graphs; D12.4 **adjacency matrix** and **adjacency list**, both drawn for the same graph, with space and operation costs; D12.5 incidence matrix; D12.6 choosing a representation (dense vs sparse); D12.7 BFS and DFS shown as traversals with a queue/stack (the full algorithms in the Algorithms plan); D12.8 connected components, cycle detection (idea).
- **Finer points:** matrix symmetric for undirected; the diagonal for self-loops; space `n²` vs `n + e`; checking an edge is O(1) in a matrix and O(degree) in a list; listing neighbours is O(n) vs O(degree).
- **GATE level:** counting edges and degrees; space and time comparisons; reading a matrix or list to describe the graph.
- **Diagrams:** GRAPHPIC beside its adjacency matrix and its adjacency list; BFS/DFS FRAMES with the queue/stack drawn.

## D13 · Disjoint sets (union-find)  *(light)*

- **Topics:** make-set, find, union; union by rank/size, path compression; costs.
- **Diagrams:** FRAMES of unions and find with path compression.

## D14 · Choosing the right structure

- **Topics:** one master COMPARE table: operation costs (access, search, insert, delete; best/average/worst) for array, sorted array, linked list, stack, queue, BST, AVL, heap, hash table, with the **reason** for each cell; a decision flow: "what do you need most?".

## D15 · GATE patterns and mixed practice

- **Topics:** pattern library for each structure; mixed sets; time per question; common wrong-answer traps.

---

## 3. Practice and tools

- **Per topic:** Warm-up 6 · Core 10 · GATE 10 · Twisted 5, all with worked solutions.
- **Interactive labs to build:** list-pointer stepper (one pointer change per click), stack/queue stepper, expression converter with the operator stack shown, BST/AVL/heap builders that show every step and rotation, hash-table filler with probing choices, a tree-from-traversals reconstructor, a graph representation switcher.

## 4. Questions for your review

1. Is hashing better placed here (as GATE's own syllabus line puts it under Algorithms) or in Algorithms? (Suggested: taught here in full, linked from Algorithms.)
2. Do you want red-black trees and splay trees only as a short note (GATE rarely asks), as planned?
3. Which GATE years' question styles do you want quoted as models for the "how GATE asks" station?
4. Anything missing?
