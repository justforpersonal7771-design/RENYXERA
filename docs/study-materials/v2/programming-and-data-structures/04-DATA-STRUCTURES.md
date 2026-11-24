# 04 · Subject plan: Data Structures (plan **v2**, after two reviews)

**Reader:** a dropper who has finished the C plan (or its [MUST] path). **Goal:** the reader can draw, build, trace and count any structure GATE asks: arrays, linked lists, stacks, queues, trees, binary search trees, heaps, graphs (representation), and hash tables; can say the cost of every operation and *why*; and can read the small amount of maths those costs need.

**What changed from v1** (full list in `06-REVIEW-MERGE-DS.md`): a beginner maths toolkit before any `O(...)`; ten order fixes; AVL split from the multi-way trees; B and B+ trees pointed at DBMS; hashing owned here with correct formulas; every chapter now has all parts (no stubs); many missing GATE traps added; one height convention locked; units, tags and hours.

Units and tags are the same as in `03` (chapter → lesson → sub-topic; **[MUST] / [SHOULD] / [LATER]**). Practice: **20 per lesson** (5 + 6 + 6 + 3), tagged MCQ / MSQ / NAT. Hours are estimates until the pilot.

---

## 0. What does GATE do with data structures?

| GATE asks | You must be able to |
|---|---|
| "How many nodes / leaves / height?" | Use the counting facts, and know which height convention the question uses |
| "Insert these keys; what does the tree / table / heap look like?" | Run the algorithm by hand, step by step |
| "Which traversals give this tree?" / "How many trees?" | Traverse, rebuild, count |
| "What does this function do to the list?" | Read pointer code and draw the list after each line |
| "Is this output order possible? What is on the stack now?" | Simulate push and pop; convert and evaluate expressions |
| "What is the time of this operation?" | Give the cost and the reason, for the stated case (best, worst, average, amortised) |
| "Which structure fits this job?" | Compare costs and pick, with the reason |
| "Where does this key go in the table? How many probes?" | Apply the hash and probe rules; use load factor |

Official syllabus names (Section 4): recursion, arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs. **Hashing, searching and sorting are named under Algorithms.** AVL, B/B+ (also DBMS indexing), red-black, tries and union-find are *not named* in the Section 4 line, so they are tagged [LATER] or cross-links until the PYQ audit shows how often they are asked. **Nothing here claims how often GATE asks something; every frequency says "not sure" until the tagged PYQ bank proves it.**

## 1. The order of chapters (each uses only what came before)

```
Part A  Ideas and tools     D0  What is a data structure?                        [MUST]  ~3 h
                            D1  Counting and growth: the maths toolkit           [MUST]  ~6 h
Part B  Linear structures   D2  Arrays as a data structure                       [MUST]  ~8 h
                            D3  Linked lists                                     [MUST] ~10 h
                            D4  Stacks                                           [MUST]  ~9 h
                            D5  Queues                                           [MUST]  ~7 h
                            D6  Recursion in data structures                     [MUST]  ~5 h
Part C  Trees               D7  Trees: vocabulary, binary trees, traversals      [MUST] ~11 h
                            D8  Binary search trees                              [MUST]  ~8 h
                            D9  AVL trees                                        [SHOULD] ~6 h
                            D10 Binary heaps and priority queues                 [MUST]  ~8 h
                            D11 Multi-way trees: B, B+ (and a red-black note)    [LATER] ~4 h
Part D  Hashing and graphs  D12 Hashing                                          [SHOULD] ~9 h
                            D13 Graphs: representation and basic traversal      [MUST]  ~8 h
                            D14 Extras: tries, disjoint sets                     [LATER] ~3 h
Part E  Together            D15 Choosing the right structure                     [MUST]  ~4 h
                            D16 GATE patterns and mixed practice                 [MUST]  ~8 h
```
About 55 lessons; ~110 h in all; [MUST] path about 80 h (recomputed after the pilot). Algorithms (sorting, searching, graph algorithms, recurrences solved) is a separate plan; here only what these structures need.

**Conventions locked for the whole book:** (1) **Height is edge-based**: empty tree −1, single node 0; a translation column for node-based books (empty 0, single node 1) wherever a formula contains `h`. (2) **Tree words**: *strict* (every node has 0 or 2 children), *complete* (all levels full except possibly the last, filled left to right), *perfect* (all leaves on one level, all internal nodes have 2 children); the "full / complete / perfect / almost-complete" clash between textbooks is shown in a warning picture, and each GATE-style question is read for its own definition. (3) **Keys are distinct** unless stated. (4) **B-tree "order"** is stated each time (max children vs max keys). (5) Costs always say best / worst / average / amortised.

---

## D0 · What is a data structure?  [MUST]

- **Lessons:** (1) Organising data (contact list, library, queue at a counter); abstract data type (the buttons) vs data structure (the wiring). (2) Contiguous vs linked memory; "fixed size at start" vs "grows" (and a warning: this is *not* C's `static` keyword). (3) The main operations: insert, delete, search, traverse, update.
- **Beginner must see:** the same buttons can sit on very different wiring, with very different speeds.
- **Finer points:** linear vs non-linear; static vs dynamic structure; time and space.
- **GATE level:** "which structure gives O(1) access / insertion".
- **Diagrams:** TV-remote picture (ADT) with two implementations behind it; the street of boxes with an array tight and list nodes scattered; a COMPARE of array vs list.
- **Traces:** the same five operations on both.

## D1 · Counting and growth: the maths toolkit  [MUST] *(new)*

- **Lessons:** (1) Counting steps: what one step is; size of input `n`; best, worst, average. (2) **Big-O, Ω, Θ** in plain words with tables for n = 10, 1,000, 10^6. (3) **Logarithms**: halving until 1 takes about log₂ n steps; powers of 2. (4) **Sums GATE needs**: 1+2+…+n, 1+2+4+…+2^k, h/2^h series (`= 2`), explained with pictures first. (5) **Reading a recurrence from a call tree**: `T(n)=T(n-1)+1`, `T(n/2)+1`, `2T(n-1)+1`, `2T(n/2)+n`, by adding the work per level. (6) Amortised cost with the piggy-bank picture. (7) Just enough probability: complement, expected value.
- **Beginner must see:** why log n is tiny; why n² explodes.
- **Finer points:** O is an upper bound, Θ is tight; amortised is not average-case; space and auxiliary space.
- **GATE level:** compare growth rates; count loop steps; read a recurrence.
- **Diagrams:** growth curves with a table; halving ladder; the 2^k sum as a doubling bar; the h/2^h pyramid; call trees with work per level; the piggy-bank picture.
- **Traces:** step counts for three small loops; `T(n)=2T(n-1)+1` unrolled for n = 4.

## D2 · Arrays as a data structure  [MUST]

- **Lessons:** (1) Operations and their cost: access, insert and delete (shifting), search; binary search (and its traps). (2) Address formulas with **arbitrary lower bounds**, row-major and column-major, 2-D and 3-D (what C9 did not do). (3) **Special matrices**: lower and upper triangular, symmetric, tri-diagonal, Toeplitz; the 1-D index formula derived for **row-major and column-major, 0-based and 1-based**; sparse matrices (triplet form; worth it only when `3k < m×n`). (4) Dynamic arrays: doubling and amortised cost (uses D1).
- **Beginner must see:** the formula is just "count the full rows above, then the steps inside this row".
- **Finer points:** insert at the front costs n shifts; binary search needs sorted input; `mid = low + (high-low)/2` (avoids overflow); `low <= high` vs `low < high`; searching for a missing key; triangular storage saves n(n-1)/2 cells.
- **GATE level:** address calculation (very common); position in the packed array; number of shifts and comparisons.
- **Diagrams:** shifting arrows frame by frame; a grid `[-2..1][3..5]` mapped onto a street; a 4×4 lower-triangular matrix packed into 10 cells (row-major and column-major); doubling copies `1+2+4+…`.
- **Traces:** `A[5][7]` for three bound choices; a failed binary search; index of `M[3][2]` in four conventions.

## D3 · Linked lists  [MUST]

- **Lessons:** (1) The idea; the node as a C `struct`; traverse and search. (2) Insert (front, end, position) and delete (front, end, key) with **one pointer change per frame**; the order rule `new->next = cur->next` *before* `cur->next = new`. (3) **The head trap**: why `insert(Node *head)` cannot change the caller's `head`, and the two fixes (`Node **head`, or return the new head). (4) Dummy node; **iterative reversal** (`prev`, `cur`, `next`); middle with slow/fast; cycle detection and finding the cycle start (Floyd, with the distance equation). (5) Merge two sorted lists; delete a node given only its pointer (and why that fails on the last node); doubly and circular lists (circular with a *tail* pointer: O(1) insert at both ends); cost matrix. (6) [BEYOND] skip list, XOR list.
- **Beginner must see:** a list is a chain; to reach node i you walk i arrows.
- **Finer points:** empty list and one-node list; `head` may change; **a tail pointer makes insert-at-end O(1) but delete-at-end is still O(n) in a singly list** (you cannot step back); `p && p->next` (test `p` first); losing the rest of the list; leaks; O(1) delete in a doubly list given the node.
- **GATE level:** "what does this function do to the list"; move-last-to-front and swap-adjacent traces; cycle detection; counting pointer changes.
- **Diagrams:** the right and wrong insertion order; the `*head` vs `**head` stack frames; reversal frames; the rho-shaped cycle with `L = kC − x`; singly / doubly / circular-tail comparison.
- **Code:** each operation in C with the memory beside it. **Recursive reversal moves to D6.**

## D4 · Stacks  [MUST]

- **Lessons:** (1) Last in, first out; push, pop, peek; array stack (`top`), linked stack (top = head); overflow and underflow. (2) Balanced brackets; the call stack link (to C6, C8). (3) **Expression conversion and evaluation**: infix → postfix; infix → prefix (reverse, convert, reverse, and the associativity flip); postfix evaluation (first popped = right operand); **prefix evaluation** (scan right to left, first popped = left operand); unary operators; right-associative `^`; stack depth for an expression. (4) **Which output orders are possible**: simulate; the **`c … a … b` forbidden pattern** (if a < b < c, the output order c, a, b is impossible); Catalan count `C(2n, n)/(n+1)`. (5) Next-greater element and the monotonic stack (monotonic = always rising or always falling); min-stack; two stacks in one array.
- **Beginner must see:** a pile of plates; only the top is reachable.
- **Finer points:** parentheses; equal precedence pops except right-associative; the stack contents at each token.
- **GATE level:** conversion and evaluation; "is this sequence possible"; counting sequences; stack contents after a sequence.
- **Diagrams:** array stack vs linked stack; token / action / stack / output trace tables; postfix vs prefix operand-order picture for `a - b`; push/pop timeline for a possible and an impossible permutation.
- **(Stack using queues moves to D5.)**

## D5 · Queues  [MUST]

- **Lessons:** (1) First in, first out; enqueue, dequeue; array queue and its wasted space; linked queue (including removing the last item: reset both ends). (2) **Circular queue and its three conventions**: `front = rear` empty with one slot left unused (capacity n−1); `front = −1` start (capacity n); a `count` variable; the **element-count formula** `(rear − front + n) mod n` (and when to add 1). (3) Deque and its restricted forms; priority queue as an idea (array and list versions; the heap version waits for D10). (4) **Queue using two stacks** (two designs: O(n) enqueue / O(1) dequeue, or O(1) enqueue / amortised O(1) dequeue) and **stack using two queues**.
- **Finer points:** full vs empty detection; why a slot is left empty; the amortised argument.
- **GATE level:** positions of front and rear after a sequence; capacity under each convention; costs of the two-stack designs.
- **Diagrams:** the plain array with drifted `front`/`rear` vs the ring; three rings side by side holding A, B, C; two-stack queue frames.
- **Traces:** a sequence of 8 operations on a ring of 6 (`front = 4, rear = 1` example); worst-case vs amortised cost count.

## D6 · Recursion in data structures  [MUST]

(The mechanics and C puzzles are in **C8**. This chapter uses recursion on data structures and adds the running-time view.)
- **Lessons:** (1) Quick recap by picture; the call tree vs the call stack: total calls vs maximum depth. (2) **Recursive reversal of a list**; recursion on lists and arrays. (3) Hanoi (`2^n − 1` moves; calls vs moves), permutations, subsets; the base-case traps in counting `fib` calls (`n ≤ 1` vs `n = 0`). (4) Reading the running time from the call tree (D1), and the recurrence.
- **Diagrams:** call tree with returned values beside the live stack frames; Hanoi frames for 3 discs; recursive-reversal frames.
- **Traces:** `fib(4)` both conventions; `hanoi(3)`.

## D7 · Trees: vocabulary, binary trees, traversals  [MUST]

- **Lessons:** (1) Why trees; vocabulary (root, parent, child, leaf, internal, sibling, ancestor, depth, height, level, degree, subtree) with the locked height convention. (2) Binary tree types and the naming clash; **counting facts with picture proofs**: max nodes at level l, max nodes of height h (`2^(h+1) − 1`), min height for n nodes, `n0 = n2 + 1`, edges `= n − 1`, null pointers `= n + 1`; and for **k-ary trees**: leaves `L = (k−1)I + 1`, nodes `n = kI + 1`, max nodes `(k^(h+1) − 1)/(k − 1)`. (3) Representation: nodes; array (`2i`, `2i+1`, `⌊i/2⌋`, in 0- and 1-based forms). (4) **Traversals** (pre, in, post, level) recursively *and* with a stack or queue (why right is pushed before left); the ant-walk picture. (5) **Rebuilding** from two traversals (in + pre, in + post work; pre + post does not); **equality conditions** (when pre = in, in = post, pre = reverse of post); the number of trees sharing pre + post (`2^k` for k single-child nodes); unlabelled `C_n` vs labelled `n!·C_n` trees. (6) Tree algorithms: height, leaf count, mirror, equal, diameter (O(n²) naive vs O(n)), lowest common ancestor; expression trees; threaded trees and the left-child right-sibling form ([LATER]).
- **Finer points:** level counted from 0 or 1; height vs depth vs level; a tree with n nodes has n−1 edges.
- **GATE level:** counting nodes and leaves from degree conditions; max / min height; traversal outputs; reconstruction; Catalan counts.
- **Diagrams:** a labelled tree; the naming-clash map; the null-slot picture proof; the ant walk; reconstruction frames; the Euler tour.

## D8 · Binary search trees  [MUST]

- **Lessons:** (1) The rule and why it helps; search; insert (frames). (2) **Delete**: leaf, one child, two children, with **both** the inorder successor and the inorder predecessor shown (two valid but different trees; delete-then-reinsert does not give back the original). (3) Min, max, successor, predecessor; inorder gives sorted order; build a BST from a sequence and how the order changes the shape; the number of shapes; height best / worst / average. (4) **Valid search paths** (the shrinking `(min, max)` interval rule); **how many insertion orders give the same BST** (`C(L+R, L)·w(L)·w(R)`); BST from a given preorder or postorder; range queries, k-th smallest; duplicates (three policies; GATE assumes distinct).
- **Finer points:** the worst case is a chain (sorted input).
- **GATE level:** construct, delete, count comparisons; "which sequence cannot be a search path"; counting orders.
- **Diagrams:** insertion frames with the comparison path; the interval funnel; deletion case pictures including successor vs predecessor; chain vs balanced for {1..5}.

## D9 · AVL trees  [SHOULD]

- **Lessons:** (1) Why balance; balance factor (state the sign convention) and the rule −1, 0, +1. (2) The four cases LL, RR, LR, RL with before / after pictures and subtrees T1–T4 labelled. (3) Insertion step by step (at most one single or one double rotation) and deletion (may rotate up the path, O(log n)). (4) **Minimum nodes** `N(h) = N(h−1) + N(h−2) + 1` with the base cases for the edge-based height (`N(−1)=0, N(0)=1, N(1)=2`) and the Fibonacci link; maximum height for n nodes.
- **Finer points:** rotation keeps BST order; AVL vs red-black one-line comparison (details in D11).
- **GATE level:** insert/delete sequence and final tree; count rotations; N(h).
- **Diagrams:** the four rotations; balance factors written on every node; the minimal AVL trees for h = 0..3; a full insertion sequence in frames.

## D10 · Binary heaps and priority queues  [MUST]

- **Lessons:** (1) Priority queue (idea); the heap shape (complete tree) and order rule (min-heap, max-heap); the array form with both index conventions. (2) Insert (sift up), delete-min / delete-max (last leaf to the root, sift down); decrease-key, delete arbitrary. (3) **Heapify and build-heap in O(n)** with the sum shown (and why repeated insertion is O(n log n) and **gives a different array**). (4) Heap sort (max-heap, in place, trace the end swaps); positions: where the maximum of a min-heap can be (last ⌈n/2⌉ slots), where the 2nd and 3rd smallest can be; counting heaps (`T(n) = C(n−1, L)·T(L)·T(R)`); heap vs BST; k-th largest.
- **Finer points:** the heap is not sorted; height `⌊log₂ n⌋`; sift cost = height of the node.
- **GATE level:** array after a sequence of inserts and delete-mins; build-heap result and swap count; position questions.
- **Diagrams:** tree and array side by side with index arrows; sift frames; the cost pyramid; repeated-insert vs build-heap on the same input; heap sort frames.

## D11 · Multi-way trees: B, B+, red-black note  [LATER]

- **Lessons:** (1) B-tree: **order stated both ways**, min and max keys and children, root exceptions, split on overflow and merge on underflow; counting questions (height for a number of records). (2) B+ tree: leaf links, why databases use them; the **block-size calculation** (keys, pointers, block); full teaching in the DBMS book, this is a bridge. (3) Red-black: the rules at a glance, height ≤ 2 log n, compared with AVL (every AVL tree can be coloured red-black, not the reverse). 2-3 trees and splay trees: [BEYOND], one paragraph.
- **Diagrams:** B-tree split frames; B+ with linked leaves; AVL vs red-black COMPARE.

## D12 · Hashing: bridge  [SHOULD] *(CHANGED 24 Nov: the full chapter is owned by the Algorithms book, because the official 2027 syllabus names hashing under Algorithms; this chapter keeps only a short bridge: the idea, chaining and a worked linear-probing example, then points to Algorithms chapter 3)*

- **Lessons:** (1) The idea (a locker per key); hash functions (division, multiplication, folding, mid-square); collisions. (2) **Chaining**. (3) **Open addressing**: linear, quadratic, double hashing, each traced; clustering; **quadratic probing can fail with the table over half empty**; **`h2(k)` must never be 0 and must be coprime to m**. (4) **Deletion and tombstones**, with the four-frame trace of the broken search. (5) **Load factor α and expected probes, correctly separated:** chaining `1 + α` (unsuccessful) and `1 + α/2` (successful); open addressing under uniform hashing `1/(1−α)` (unsuccessful) and `(1/α)·ln(1/(1−α))` (successful), with the `ln` values explained. (6) Counting and probability in hashing: probability two keys collide `1/m`, expected collisions `C(n,2)/m`, expected empty slots `m(1−1/m)^n`, the birthday-style probability. (7) Rehashing, prime sizes, perfect and universal hashing (ideas); hash vs tree.
- **Finer points:** chaining can have α > 1, open addressing cannot; the insertion order decides the layout under probing.
- **GATE level:** fill a table under a stated rule and list the probes; count collisions; expected probes.
- **Diagrams:** slots 0..m−1 with probe arrows, frames per insertion; chains hanging from slots; the probes-vs-α curves; the tombstone frames.

## D13 · Graphs: representation and basic traversal  [MUST]

- **Lessons:** (1) What a graph is; vocabulary (directed, undirected, weighted, degree, in- and out-degree, path, cycle, connected, strongly connected, component, complete, bipartite, tree as a graph); simple graph vs multigraph; handshake lemma; counting (max edges, labelled graphs `2^(n(n−1)/2)`; directed `2^(n(n−1))`, bipartite max `⌊n²/4⌋`; Euler's formula and `e ≤ 3v − 6` as notes). (2) **Adjacency matrix and list for the same graph**, space and costs (an edge test O(1) vs O(degree); **in-degree in a list is O(V+E)**); incidence matrix; choosing (dense vs sparse). (3) BFS (queue) and DFS (stack) shown as traversals with tie-breaking stated; **edge types** (tree, back, forward, cross; an undirected graph has only tree and back); valid orderings; cycle detection (undirected: visited and not the parent; directed: three states).
- **GATE level:** counting edges and degrees; space and time comparisons; reading a matrix or list; valid BFS/DFS orders; which edge types can occur.
- **Diagrams:** one graph beside its matrix and its list; BFS/DFS frames with the queue / stack drawn; a DFS tree with the four edge types.
- (Shortest paths, spanning trees and the rest are in the Algorithms plan.)

## D14 · Extras: tries, disjoint sets  [LATER]

- **Lessons:** (1) Trie: prefixes shared (`CAT`, `CAR`, `DOG`), why prefix search depends only on word length. (2) Disjoint sets: make-set, find, union; the `parent[]` array (storing −size or −rank); union by rank/size (height ≤ ⌊log₂ n⌋; a tree of height h has at least 2^h nodes) and path compression, traced. Cross-link to the graph-algorithms chapter of Algorithms (where it is used).
- **Beginner must see:** why it exists (grouping and merging).
- **Diagrams:** a trie; `parent[]` beside the forest, union and find-with-compression frames.
- (Fenwick, segment and k-d trees are dropped from this book.)

## D15 · Choosing the right structure  [MUST]

- **Lessons:** (1) The master cost table (access, search, insert, delete; best / average / worst; array, sorted array, list, stack, queue, BST, AVL, heap, hash) with the **reason** under every cell and the assumptions stated. (2) The decision flow ("what do you need most?"). (3) Ten "choose the structure" problems (undo, LRU cache, median of a stream, autocomplete, scheduling, ...).
- **Diagrams:** the decision flowchart; the cost table as a CHEATPIC.

## D16 · GATE patterns and mixed practice  [MUST]

- **Lessons:** per structure, the question patterns with model solved questions from the tagged PYQ bank (self-contained inside the book); mixed sets in MCQ, MSQ and NAT; time per question; common wrong-answer traps.
- **Rule:** no pattern is called "frequent" without the tagged source count.

---

## 2. Practice and tools

- **Per lesson:** 20 (5 warm-up, 6 core, 6 GATE-level, 3 twisted), all with worked solutions; tagged MCQ / MSQ / NAT.
- **Labs to build:** list-pointer stepper (one pointer change per click), stack and queue stepper (with the ring), expression converter showing the operator stack, BST / AVL / heap builders that show every step and rotation, hash-table filler with probe choices, tree-from-traversals reconstructor, graph-representation switcher with BFS/DFS stepper.
- **New diagram kinds needed** (added to the engine list): `bits`, `heap` (tree and array synced), `hashtable` (slots, chains, tombstones), `queue_ring` (circular array with front and rear), on top of `memory`, `array`, `linked`, `tree`, `stackframe`, `calltree`, `trace`, `frames`.

## 3. Open points for your decision

1. D1 (the maths toolkit) is new and early. OK?
2. AVL is [SHOULD], B / B+ and red-black [LATER] (taught in DBMS). OK until the PYQ audit says otherwise?
3. Hashing is taught fully here; the Algorithms plan will link to it. OK?
4. Heights are edge-based (empty −1, leaf 0) with a translation column. OK?
