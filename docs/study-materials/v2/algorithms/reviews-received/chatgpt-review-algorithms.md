# GATE Computer Science — Algorithms
## Deep beginner review, syllabus audit, 73-PYQ answer check and revised writing plan

**Source reviewed:** the Algorithms v0 review input supplied in the message (generated 24 November 2026).  
**Target:** GATE CS 2027.  
**Review viewpoint:** the 25-year-old repeat aspirant described in Part A: weak foundations, failed attempts, many backlogs, and about 100 days left.  
**Decision:** correct the lesson plan and test a pilot. Do not bulk-rewrite or publish the book yet.

---

## 0. Scope and limits of this review

The submitted material contains:
- the reviewer instructions;
- four syllabus bullets written from memory;
- nine chapter headings with only topic counts, not actual lesson titles or lesson text;
- seven bank-topic buckets with a total of 73 questions and 114 marks;
- 73 question statements and their marked answer options/ranges.

It does **not** contain the existing nine chapters, the actual 27 lesson texts, full worked solutions, the `01-MASTER-PROMPT.md`, or the 29 Forge questions. I can audit the contents structure, compare the syllabus with the official GATE 2027 syllabus, inspect the 73 transcribed questions, solve what is complete in text, and flag the missing figures. I cannot claim to have reviewed the unseen lesson prose or to have verified all keys against the original official PDFs.

The official GATE 2027 CS syllabus confirms the four Algorithms lines in the submitted input verbatim in substance: searching/sorting/hashing; asymptotic worst-case time and space; greedy, dynamic programming and divide-and-conquer; graph traversals, MSTs and shortest paths. The source's syllabus list is therefore **not missing a headline item**. The weaknesses are the unshown finer topics, learning order, and missing foundational teaching sequence. [Official GATE 2027 CS syllabus PDF — Section 5, Algorithms](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf). The official GATE 2027 site says the syllabi have been revised and advises candidates to use the updated documents. [Official syllabus page](https://gate2027.iitm.ac.in/exam_papers_and_syllabus).

**Important distinction:** In Parts 2 and 3, “not demonstrated” means the contents page does not prove the lesson is present. It does not prove that an unseen app lesson omits it.

---

# PART 1 — FEELINGS (10 lines)

1. I felt a little less frightened because the nine chapter names cover the main words I recognise from GATE Algorithms.
2. Then I felt lost again: “Asymptotics and recurrences” is a heading, not a lesson telling me what a function, a loop or a recurrence is.
3. I could not tell whether I would learn to count comparisons, swaps, recursive calls and memory, or only memorise Big-O answers.
4. Hashing made me nervous because I need to see the table after every collision; one wrong probe changes every later answer.
5. Greedy and dynamic programming scared me most because books often say “choose optimally” without teaching how to prove that the choice is safe.
6. Graphs felt possible when I imagined drawing vertices and edges, but DFS times, back edges, articulation points and SCCs need careful pictures.
7. MST looked learnable if Prim and Kruskal are taught by drawing the chosen edge at every step, not by giving the final tree.
8. Shortest paths felt too hard without first teaching what a path, path weight, negative edge and “reachable” mean.
9. I felt tricked by the “3 topics ready” counts: I cannot tell whether a topic takes five minutes or teaches a full algorithm from zero.
10. **Would I pay ₹149 now? No.** I have a contents list and answer-key bank, not a book that proves it can teach me the subject without another teacher.

---

# PART 2 — GAP TABLE (100 findings)

| # | Where | What I could not understand or what is missing | Type | What to add or change | Priority |
|---:|---|---|---|---|---|
| 1 | Whole plan, before Chapter 1 | I do not know what an algorithm is, what counts as an input, or what the output must be. | MISSING-PREREQUISITE | Add a zero-level opening lesson using a tiny task, its input, output and exact steps. | HIGH |
| 2 | Whole plan | The plan assumes I can read pseudocode and follow loops. | MISSING-PREREQUISITE | Teach assignment, comparison, loop bounds, arrays, integer division and function calls in a short bridge lesson. | HIGH |
| 3 | Whole plan | Recursion is assumed but its call stack and base case are not listed. | MISSING-PREREQUISITE | Teach a recursive call tree before recurrence analysis and divide-and-conquer. | HIGH |
| 4 | Whole plan | Graph questions assume I know how graphs are stored in memory. | MISSING-PREREQUISITE | Link the Algorithms book to the Data Structures lessons on adjacency lists, matrices, queues, stacks and heaps. | HIGH |
| 5 | Whole plan | The plan does not say whether array indexing begins at 0 or 1 in examples. | UNCLEAR-ENGLISH | State the indexing convention at the start of each example and follow the question's convention. | MEDIUM |
| 6 | Whole plan | “Worst case” is not defined in the contents. | UNEXPLAINED-WORD | Use a simple example showing best, average and worst input arrangements. | HIGH |
| 7 | Whole plan | I cannot tell whether the book counts comparisons, swaps, assignments, recursive calls or all operations. | UNEXPLAINED-WORD | Teach the cost model first; identify which operation the question asks us to count. | HIGH |
| 8 | Whole plan | Time and space complexity are both in the syllabus, but the bank summary is mainly time-focused. | MISSING-GATE-CONCEPT | Add auxiliary-space and recursion-stack analysis to every algorithm where relevant. | HIGH |
| 9 | Whole plan | The nine chapter headings do not show lesson names or learning outcomes. | UNCLEAR-ENGLISH | Replace “3 topics ready” with a full lesson list and an observable skill for every lesson. | HIGH |
| 10 | Whole plan | No consistent progression from easy examples to GATE questions is stated. | WRONG-ORDER | Use intuition → tiny example → hand trace → exact rule → worked GATE question → independent practice. | HIGH |
| 11 | Chapter 1: Asymptotics | “Function” and “growth rate” are assumed words. | UNEXPLAINED-WORD | Explain input size n and the number of operations as a function of n. | HIGH |
| 12 | Chapter 1: Asymptotics | Big-O, Omega and Theta may be taught as three labels instead of upper/lower/tight bounds. | UNEXPLAINED-WORD | Draw f(n) between constant multiples of g(n), with c1, c2 and n0. | HIGH |
| 13 | Chapter 1: Asymptotics | Little-o and little-omega are not named in the contents. | MISSING-GATE-CONCEPT | Include strict upper/lower growth and contrast them with O, Ω and Θ. | HIGH |
| 14 | Chapter 1: Asymptotics | I need to understand constants and lower-order terms before simplifying them away. | STEP-SKIPPED | Compare 3n²+10n+7 with n² and show why the leading term wins. | HIGH |
| 15 | Chapter 1: Asymptotics | The order of log, polynomial, n log n and exponential functions is not listed. | MISSING-GATE-CONCEPT | Add a growth ladder and teach how to compare functions using ratios or standard limits. | HIGH |
| 16 | Chapter 1: Asymptotics | Logarithm base changes and `2^(log n)` may confuse me. | MISSING-PREREQUISITE | Teach log rules and explicitly state that `2^(log₂ n)=n`. | HIGH |
| 17 | Chapter 1: Asymptotics | `log(n!)` needs a reason, not a memorised answer. | NEEDS-EXAMPLE | Derive Θ(n log n) using a sum of logarithms and Stirling's approximation as an optional shortcut. | MEDIUM |
| 18 | Chapter 1: Asymptotics | Nested loops, triangular loops and step sizes are not shown. | NEEDS-TRACE | Add a loop-count table for `j += i`, halving loops and nested bounds. | HIGH |
| 19 | Chapter 1: Asymptotics | The difference between sequential loops and nested loops is easy to miss. | NEEDS-EXAMPLE | Count each loop separately, then show when counts add and when they multiply. | HIGH |
| 20 | Chapter 1: Asymptotics | Recurrence relations are not introduced from a program. | MISSING-PREREQUISITE | Show how one recursive call, two half-size calls and a partition step become a recurrence. | HIGH |
| 21 | Chapter 1: Recurrences | The recurrence base case is not treated as part of the definition. | MISSING-FINER-POINT | Explain stopping conditions, small n and rounding (`floor`/`ceil`). | HIGH |
| 22 | Chapter 1: Recurrences | Master theorem may be taught without checking its conditions. | FACT-DOUBT | State the theorem's conditions and show examples where it does not apply. | HIGH |
| 23 | Chapter 1: Recurrences | Unequal subproblem sizes such as n/2 and 2n/5 are not named. | MISSING-GATE-CONCEPT | Add recursion-tree or Akra–Bazzi-style reasoning at the depth required by the supplied PYQs; do not force Master theorem where it does not fit. | HIGH |
| 24 | Chapter 1: Recurrences | Square-root recurrences can be confused with log-log recurrences. | NEEDS-TRACE | Substitute n=2^m or repeatedly take logarithms, showing each level. | HIGH |
| 25 | Chapter 1: Space complexity | Recursion stack space is not mentioned. | MISSING-GATE-CONCEPT | Show stack depth and per-call local storage; distinguish recursion depth from total calls. | HIGH |
| 26 | Chapter 2: Searching and sorting | “Searching” is not broken into linear and binary search. | MISSING-GATE-CONCEPT | Add both algorithms, preconditions, comparison counts and edge cases. | HIGH |
| 27 | Chapter 2: Binary search | Sorted input is assumed but not explained as a precondition. | MISSING-PREREQUISITE | Demonstrate why binary search fails on an unsorted array. | HIGH |
| 28 | Chapter 2: Binary search | Inclusive and half-open interval versions can cause off-by-one errors. | MISSING-FINER-POINT | Teach one implementation carefully, then compare the alternate interval convention. | HIGH |
| 29 | Chapter 2: Binary search | Searching in a bitonic array is not shown. | MISSING-GATE-CONCEPT | Teach peak finding followed by binary search on the increasing/decreasing sides. | MEDIUM |
| 30 | Chapter 2: Sorting | The plan does not name insertion, selection, bubble, merge, quick and heap sort. | MISSING-GATE-CONCEPT | List the required sorting algorithms and the exact properties expected in GATE. | HIGH |
| 31 | Chapter 2: Sorting | I cannot tell whether sorting means only knowing the final order or tracing each pass. | NEEDS-TRACE | Draw array state after every pass/partition/merge. | HIGH |
| 32 | Chapter 2: Sorting | Stable, in-place and adaptive are likely unexplained words. | UNEXPLAINED-WORD | Define them and give one example of a stable and unstable sort. | MEDIUM |
| 33 | Chapter 2: Sorting | Best, average and worst-case complexities may be given without a reason. | STEP-SKIPPED | Derive comparison counts for the sorted, reverse-sorted and pivot-unbalanced inputs. | HIGH |
| 34 | Chapter 2: Quicksort | Pivot choice and partition procedure are not listed. | MISSING-GATE-CONCEPT | Teach one partition scheme at a time and show how pivot ends in its final position. | HIGH |
| 35 | Chapter 2: Quicksort | Random pivot probability and worst pivot location are missing. | MISSING-FINER-POINT | Explain ranks as equally likely outcomes and derive the 2/n probability. | MEDIUM |
| 36 | Chapter 2: Merge sort | Number of merge operations and “void” merges are not listed. | MISSING-FINER-POINT | Draw the recursion tree and each sorted pair being merged. | MEDIUM |
| 37 | Chapter 2: Selection/order statistics | Finding min and max with fewer comparisons is missing. | MISSING-GATE-CONCEPT | Teach pairwise min–max and its comparison-count bound. | HIGH |
| 38 | Chapter 2: Selection/order statistics | Median of medians appears in a PYQ but is not named in the plan. | MISSING-GATE-CONCEPT | Teach selection, groups of five, median of medians and the linear-time guarantee at GATE depth. | HIGH |
| 39 | Chapter 2: Space | Sorting auxiliary space is not listed. | MISSING-GATE-CONCEPT | Compare merge sort, in-place quicksort and heap sort stack/array space. | MEDIUM |
| 40 | Chapter 3: Hashing | Hash table, key, slot, bucket and hash function are not defined. | UNEXPLAINED-WORD | Start with a small table and manually map three keys into slots. | HIGH |
| 41 | Chapter 3: Hashing | Load factor is not listed. | MISSING-GATE-CONCEPT | Define α=n/m and show how it affects expected collisions/probes. | HIGH |
| 42 | Chapter 3: Hashing | Chaining is not named separately from open addressing. | MISSING-GATE-CONCEPT | Draw a bucket linked list and contrast it with a table slot holding one key. | HIGH |
| 43 | Chapter 3: Hashing | Linear probing needs a step-by-step table update. | NEEDS-TRACE | Show the probe sequence for every insertion and the final empty positions. | HIGH |
| 44 | Chapter 3: Hashing | Quadratic probing and its limitations are not listed. | MISSING-FINER-POINT | Add the probe formula and explain why it may not visit every slot. | MEDIUM |
| 45 | Chapter 3: Hashing | Double hashing needs the secondary hash function and probe index convention. | MISSING-FINER-POINT | State whether probing starts at i=0 or i=1 and show the sequence. | HIGH |
| 46 | Chapter 3: Hashing | Deletion markers in open addressing are not explained. | MISSING-FINER-POINT | Teach tombstones and why an emptied slot can break later searches. | MEDIUM |
| 47 | Chapter 3: Hashing | Universal hashing and adversarial keys appear in a PYQ but are not named. | MISSING-GATE-CONCEPT | Explain why random selection from a hash-function family reduces adversarial collision control. | HIGH |
| 48 | Chapter 4: Divide and conquer | “Divide”, “conquer” and “combine” are not defined. | UNEXPLAINED-WORD | Show a simple problem split into smaller instances, solved and combined. | HIGH |
| 49 | Chapter 4: Divide and conquer | The recursion tree and recurrence must connect to Chapter 1. | WRONG-ORDER | Link every D&C algorithm to its recurrence and tree. | HIGH |
| 50 | Chapter 4: Divide and conquer | Merge sort is not listed as a full worked algorithm. | MISSING-GATE-CONCEPT | Teach splitting, recursive sorting and merge pointer movement. | HIGH |
| 51 | Chapter 4: Divide and conquer | Quick sort is included in sorting but should also connect to D&C. | MISSING-FINER-POINT | Explain partition as the divide step and why pivot balance changes the recurrence. | MEDIUM |
| 52 | Chapter 4: Divide and conquer | Maximum subarray appears in the bank but not in the chapter list. | MISSING-GATE-CONCEPT | Teach crossing-sum, left/right recursive answers and compare with Kadane's algorithm as a later alternative. | HIGH |
| 53 | Chapter 4: Divide and conquer | Minimum/maximum pairwise recursion is not shown. | MISSING-FINER-POINT | Include recursive min–max and comparison count. | MEDIUM |
| 54 | Chapter 4: Divide and conquer | Selection/median-of-medians is absent. | MISSING-GATE-CONCEPT | Add the selection algorithm or link it to searching/sorting with a full lesson. | HIGH |
| 55 | Chapter 4: Divide and conquer | A result from merging two sorted lists is not traced. | NEEDS-TRACE | Use left pointer, right pointer and output pointer in every merge step. | HIGH |
| 56 | Chapter 5: Greedy | “Greedy choice” is not defined. | UNEXPLAINED-WORD | Explain choosing the next locally best option and why this does not always give a global optimum. | HIGH |
| 57 | Chapter 5: Greedy | Greedy algorithms need correctness proofs, not only examples. | MISSING-GATE-CONCEPT | Teach exchange argument, cut property and greedy-choice property with small proofs. | HIGH |
| 58 | Chapter 5: Greedy | Activity selection / interval scheduling is not listed. | MISSING-GATE-CONCEPT | Add earliest-finish-time selection and a proof by exchange. | HIGH |
| 59 | Chapter 5: Greedy | Fractional knapsack is not listed. | MISSING-GATE-CONCEPT | Teach value/weight ratio and why fractional items make greedy valid. | HIGH |
| 60 | Chapter 5: Greedy | 0/1 knapsack must be contrasted with fractional knapsack. | MISSING-FINER-POINT | Show a counterexample where ratio-greedy is not optimal for indivisible items. | HIGH |
| 61 | Chapter 5: Greedy | Huffman coding is a PYQ but is not named. | MISSING-GATE-CONCEPT | Add frequency counts, two-minimum merge steps, prefix-free codes and weighted path length. | HIGH |
| 62 | Chapter 5: Greedy | Tie handling in Huffman can change code shapes but not necessarily optimal cost. | MISSING-FINER-POINT | Explain tied frequencies and how to count optimal codes versus compute only cost. | MEDIUM |
| 63 | Chapter 5: Greedy | Greedy MST algorithms may be duplicated in Chapters 8 and 5. | WRONG-ORDER | Explain Kruskal/Prim as applications of greedy, then teach their detailed mechanics in the MST chapter. | MEDIUM |
| 64 | Chapter 6: Dynamic programming | I do not know what a subproblem or state is. | UNEXPLAINED-WORD | Start with a tiny repeated-subproblem example and draw the dependency graph. | HIGH |
| 65 | Chapter 6: Dynamic programming | The difference between memoization and tabulation is not listed. | MISSING-GATE-CONCEPT | Compare top-down recursion with caching and bottom-up table filling. | HIGH |
| 66 | Chapter 6: Dynamic programming | State definition is the hardest step and is not visible in the plan. | STEP-SKIPPED | Teach how to define exactly what `dp[i]` or `dp[i][j]` means before writing a recurrence. | HIGH |
| 67 | Chapter 6: Dynamic programming | Base cases and transition order are not named. | MISSING-FINER-POINT | Add a checklist: state, base, transition, order, answer location. | HIGH |
| 68 | Chapter 6: Dynamic programming | Rod cutting appears in a PYQ but is not listed. | MISSING-GATE-CONCEPT | Add recurrence, table construction, reconstruction and counting optimal solutions. | HIGH |
| 69 | Chapter 6: Dynamic programming | Matrix-chain multiplication is a PYQ but is not listed. | MISSING-GATE-CONCEPT | Teach interval DP, split point k and scalar multiplication cost. | HIGH |
| 70 | Chapter 6: Dynamic programming | Longest increasing/non-decreasing subsequence is not visible. | MISSING-GATE-CONCEPT | Teach O(n²) DP and the relation to minimum replacements to become sorted. | HIGH |
| 71 | Chapter 6: Dynamic programming | DP with two-dimensional dependencies needs a clear order. | NEEDS-DIAGRAM | Draw row-major and diagonal dependencies; show which values must already exist. | HIGH |
| 72 | Chapter 6: Dynamic programming | Counting optimal solutions is not distinguished from finding the optimal value. | MISSING-FINER-POINT | Add a count array or tie-count logic beside the value recurrence. | MEDIUM |
| 73 | Chapter 6: Dynamic programming | Time and space optimisations are not listed. | MISSING-FINER-POINT | Show when rows can be compressed and when reconstruction requires the full table. | MEDIUM |
| 74 | Chapter 7: Graph traversals | Graph, vertex, edge, directed, undirected and weighted are not defined. | MISSING-PREREQUISITE | Start with tiny drawn graphs and translate each into its edge set. | HIGH |
| 75 | Chapter 7: Graph representation | Adjacency list and adjacency matrix are not named as prerequisites. | MISSING-PREREQUISITE | Show both representations and their space/traversal costs. | HIGH |
| 76 | Chapter 7: BFS | Queue behaviour and visited marking need a frame-by-frame example. | NEEDS-TRACE | Show queue before and after each dequeue/enqueue; state exactly when a vertex becomes visited. | HIGH |
| 77 | Chapter 7: BFS | BFS shortest paths only apply to unweighted/equal-weight edges. | MISSING-FINER-POINT | State this condition and contrast BFS with Dijkstra. | HIGH |
| 78 | Chapter 7: DFS | Discovery and finish times are not named in the chapter list. | MISSING-GATE-CONCEPT | Add the DFS clock, recursion stack and discovery/finish intervals. | HIGH |
| 79 | Chapter 7: DFS | Tree, back, forward and cross edges are difficult without diagrams. | NEEDS-DIAGRAM | Draw each type on directed graphs; distinguish undirected DFS where non-tree edges connect ancestor/descendant. | HIGH |
| 80 | Chapter 7: DFS | DAG and topological sorting are not listed. | MISSING-GATE-CONCEPT | Add cycle detection and topological order using DFS finish time and Kahn's algorithm. | HIGH |
| 81 | Chapter 7: Graph properties | Connected components, SCCs, articulation points and bridges are not listed. | MISSING-GATE-CONCEPT | Add component counting, SCC idea, low-link values and root/non-root articulation rules. | HIGH |
| 82 | Chapter 7: Graph properties | A DFS forest with n vertices and e tree edges needs a component-count relationship. | MISSING-FINER-POINT | Derive components = V − tree edges for the DFS forest. | MEDIUM |
| 83 | Chapter 8: MST | A spanning tree and its weight are not defined before algorithms. | MISSING-PREREQUISITE | Show a connected graph, a spanning tree, n−1 edges and no cycles. | HIGH |
| 84 | Chapter 8: MST | Cut property and cycle property are absent from the contents. | MISSING-GATE-CONCEPT | Teach both properties with a cut and a cycle drawn on the same small graph. | HIGH |
| 85 | Chapter 8: MST | Kruskal needs sorting and a cycle test. | MISSING-GATE-CONCEPT | Teach edge sorting and disjoint-set union step by step. | HIGH |
| 86 | Chapter 8: MST | Union-find is not shown as a prerequisite. | MISSING-PREREQUISITE | Link to DSU: make-set, find, union, path compression and union by rank. | HIGH |
| 87 | Chapter 8: MST | Prim's algorithm differs from Kruskal but students often mix them. | NEEDS-EXAMPLE | Compare “grow one tree from a start vertex” with “take globally light edges that do not form a cycle.” | HIGH |
| 88 | Chapter 8: MST | Uniqueness of MST is a recurring conceptual issue. | MISSING-FINER-POINT | Teach unique edge weights ⇒ unique MST; equal weights may produce several MSTs. | HIGH |
| 89 | Chapter 8: MST | Counting the number of MSTs is not covered by just running Kruskal once. | MISSING-GATE-CONCEPT | Add equal-weight groups, component contraction and counting choices at the depth of the supplied figure questions. | MEDIUM |
| 90 | Chapter 8: MST | Adding one edge to an existing MST is a PYQ but not listed. | MISSING-FINER-POINT | Show the cycle formed and compare the new edge with the maximum edge on the tree path. | MEDIUM |
| 91 | Chapter 9: Shortest paths | “Shortest path” does not say whether edges can be negative. | UNEXPLAINED-WORD | Define path length/weight, reachable vertices, negative edges and negative cycles. | HIGH |
| 92 | Chapter 9: Shortest paths | DAG shortest paths in O(V+E) are in a PYQ but not listed. | MISSING-GATE-CONCEPT | Teach topological ordering plus one relaxation pass. | HIGH |
| 93 | Chapter 9: Shortest paths | Dijkstra's non-negative edge condition is easy to forget. | MISSING-FINER-POINT | State the condition prominently and include a counterexample with a negative edge. | HIGH |
| 94 | Chapter 9: Shortest paths | Bellman-Ford and negative-cycle detection are not named. | MISSING-GATE-CONCEPT | Add repeated edge relaxation, V−1 rounds and one extra cycle-check round. | HIGH |
| 95 | Chapter 9: Shortest paths | Shortest-path reweighting invariance appears in a PYQ but is not listed. | MISSING-FINER-POINT | Prove that adding f(u)−f(v) to each edge telescopes to a constant for a fixed pair of endpoints. | MEDIUM |
| 96 | Chapter 9: Shortest paths | All-pairs shortest paths may be absent. | MISSING-FINER-POINT | Include Floyd–Warshall as [SHOULD] because “shortest paths” is broad; explain the k-intermediate recurrence. | MEDIUM |
| 97 | Chapter 9: Shortest paths | Unreachable vertices and infinity values are not explained. | UNEXPLAINED-WORD | Show how relaxation treats infinity and why an unreachable distance stays infinity. | HIGH |
| 98 | Whole plan: complexity | Graph algorithms need complexity in terms of both V and E. | MISSING-GATE-CONCEPT | Explain adjacency-list BFS/DFS O(V+E), matrix alternatives and heap-based shortest/MST costs. | HIGH |
| 99 | PYQ bank: figures | Eleven listed PYQs depend on figures that are not included. | NEEDS-DIAGRAM | Restore the original diagrams for every figure-based item before claiming the bank is complete. | HIGH |
| 100 | PYQ bank: all 73 | The file has marked keys but does not provide a full worked solution beside every question. | NEEDS-TRACE | Add independent solutions and a short “why the other options fail” note for conceptual MCQ/MSQ. | HIGH |

---

# PART 3 — WHAT A COMPLETE GATE ALGORITHMS SUBJECT MUST HAVE

## 3.1 Official syllabus check

The four syllabus bullets in the submitted input are correct against the official GATE 2027 CS document. They are:

1. Searching, sorting, hashing.
2. Asymptotic worst case time and space complexity.
3. Algorithm design techniques: greedy, dynamic programming and divide-and-conquer.
4. Graph traversals, minimum spanning trees, shortest paths.

Source: [official GATE 2027 CS syllabus PDF, Section 5](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf).

The syllabus is short. It does not list each sorting algorithm, each graph property or each recurrence technique. The book must expand the broad words into a teachable set of subtopics.

**Frequency rule:** use the bank's counts only as a description of this supplied 15-paper sample. For long-run GATE frequency beyond that sample, write **not sure**. The sample is not a reliable guarantee of the next paper's distribution.

| Topic / finer point the complete book should teach | Syllabus line | Frequency | Typical GATE question | Zero-level prerequisite |
|---|---|---|---|---|
| Algorithm, input size, output, correctness and operation count | Asymptotic worst-case time and space | not sure | Count operations; judge whether an algorithm solves the stated task | Variables, loops, arrays |
| Best, average and worst case | Asymptotic worst-case time | not sure | Compare sorted, reverse-sorted and adversarial inputs | Input-dependent operation count |
| O, Ω, Θ, o and ω | Asymptotic worst-case time and space | Bank: 19 asymptotic questions; broad sample only | Compare functions; select valid bounds | Functions, inequalities, constants |
| Growth hierarchy: constants, logs, powers, n log n, polynomials, exponentials | Asymptotic worst-case time | Bank contains several function-order questions | Arrange by growth rate | Log laws and powers |
| `log(n!)`, `2^(log n)`, `n^(log n)`, `a^n` comparisons | Asymptotic worst-case time | not sure | Function-order MCQ | Log laws |
| Loop counting: nested, triangular, geometric, step increment | Asymptotic worst-case time | not sure | Count inner-loop executions | For loops and integer division |
| Space complexity and auxiliary space | Asymptotic worst-case space | not sure | Count arrays, recursion stack and temporary storage | Memory model, arrays |
| Recurrence formation from recursive code | Asymptotic worst-case time | Bank has multiple recurrence problems | Write T(n) from code | Recursion and base cases |
| Substitution, recursion tree and Master theorem | Asymptotic worst-case time | not sure | Solve divide-and-conquer recurrence | Powers, logs, recursion |
| Unequal subproblems, floor/ceil and square-root recurrences | Asymptotic worst-case time | Several supplied questions use these forms | Recurrence NAT/MCQ | Recurrence basics |
| Linear search | Searching | not sure | Worst-case comparisons or find element | Array traversal |
| Binary search | Searching | At least one supplied question asks it | Worst-case comparisons and boundary location | Sorted array, interval updates |
| Binary search variants and bitonic search | Searching | Supplied bank includes bitonic search | Find peak then search halves | Binary search |
| Sorting properties: stable, in-place, adaptive | Sorting | not sure | Compare algorithm properties | Sorting idea |
| Insertion, selection and bubble sort | Sorting | Supplied bank includes insertion and bubble-sort swaps | Trace passes; count comparisons/swaps | Arrays, loops |
| Merge sort | Sorting; divide-and-conquer | Supplied bank includes merge count and void merges | Merge trace, number of merges, recurrence | Sorted arrays, recursion |
| Quicksort and partition | Sorting; divide-and-conquer | Supplied bank includes random pivot probability | Pivot position, partition, expected/worst cases | Arrays, recursion |
| Heap sort and heap operations as prerequisites | Sorting | Supplied bank tests heap-sort complexity | Match complexity; understand heap sort | Binary heap from Data Structures |
| Selection: min/max and comparison lower bounds | Searching/sorting | Supplied bank includes min/max comparison bound | Comparison-count MCQ | Pair comparisons |
| Quickselect and median of medians | Searching/sorting | Supplied bank includes median-of-medians complexity | Worst-case selection complexity | Partition and groups |
| Hash table, key, slot, bucket, hash function | Hashing | Bank: 17 search/sort/hash questions | Insert/search/delete trace | Arrays, modulus |
| Load factor and expected chain length | Hashing | not sure | Expected keys per slot | Fractions and expectation |
| Separate chaining | Hashing | Supplied bank includes longest-chain NAT | Bucket distribution and chain length | Linked list |
| Open addressing: linear probing | Hashing | Supplied bank includes empty slots | Insert keys, find empty locations | Modulo arithmetic |
| Quadratic probing | Hashing | not sure | Probe sequence and table coverage | Open addressing |
| Double hashing | Hashing | Supplied bank includes double-hash insertion | Probe sequence, secondary step size | Modulo arithmetic |
| Deletion/tombstones | Hashing | not sure | Search after deletion | Open addressing |
| Universal hashing and adversarial inputs | Hashing | Supplied bank tests adversarial collision control | Choose a robust strategy | Hash functions and probability |
| Divide-and-conquer pattern | Algorithm design: divide-and-conquer | Bank's D&C buckets: six questions | Identify divide/conquer/combine | Recursion |
| Merge sort / quicksort recurrences | Divide-and-conquer | not sure | Recurrence and operation trace | Recurrence analysis |
| Maximum subarray | Divide-and-conquer | Supplied bank includes a max-subarray NAT | Find maximum contiguous sum | Arrays and sums |
| Min/max by divide-and-conquer | Divide-and-conquer | not sure | Comparison count | Recursive splitting |
| Deterministic selection / median of medians | Divide-and-conquer | Supplied bank includes multi-array median selection | Worst-case selection bound | Sorting, partitioning |
| Greedy-choice property and exchange argument | Greedy | Bank's greedy/D&C bucket: four; count is too small to infer frequency | Prove a greedy algorithm optimal | Induction, comparison |
| Activity selection / interval scheduling | Greedy | not sure | Select maximum compatible intervals | Sorting by finish time |
| Fractional knapsack | Greedy | not sure | Sort value/weight ratios | Ratios, capacity |
| 0/1 knapsack counterexample to greedy | Greedy / DP contrast | Supplied bank contains a 0/1 greedy-vs-optimum question | Compute greedy value and optimum | Subsets, capacity |
| Huffman coding | Greedy | Supplied bank contains Huffman encoded length | Build Huffman tree and weighted code length | Min-priority queue, binary tree |
| DP: overlapping subproblems and optimal substructure | Dynamic programming | Bank: four questions / seven marks | Decide whether DP applies | Recursion |
| State, transition, base case and evaluation order | Dynamic programming | not sure | Check table algorithms for correct dependencies | Arrays, recurrence |
| Memoization and tabulation | Dynamic programming | not sure | Compare top-down/bottom-up | Recursion, tables |
| Rod cutting | Dynamic programming | Supplied bank includes rod-cutting value and number of optima | Maximum revenue, count solutions | Recurrence and table |
| Matrix-chain multiplication | Dynamic programming | Supplied bank includes optimal parenthesization | Min scalar multiplications | Matrix dimensions |
| LIS / LNDS | Dynamic programming | Supplied bank asks minimum replacements to become sorted | `n - LIS/LNDS` | Arrays, subsequences |
| Multi-dimensional and diagonal DP order | Dynamic programming | Supplied bank compares row-wise and diagonal fills | Determine if a table-computation order is valid | Dependency graph |
| BFS | Graph traversals | Bank's graph traversal/SSSP bucket: 14 | Visit order, levels, shortest unweighted distance | Queue, adjacency list |
| DFS | Graph traversals | not sure | Discovery/finish times and edge types | Recursion/stack |
| DFS edge classification | Graph traversals | Several supplied questions | Back/forward/cross/tree edge statements | DFS timestamps |
| Connected components and DFS forest | Graph traversals | Supplied bank includes forest edge count | Count components from tree edges | Graph and forest |
| Topological sorting and DAG property | Graph traversals | Supplied bank tests DAGs and DFS edge classes | Detect cycle / produce ordering | Directed graph |
| Strongly connected components | Graph traversals | A missing-figure PYQ references SCC | Count SCCs / identify strongly connected graph | DFS and directed paths |
| Articulation points and bridges | Graph traversals | Supplied bank asks articulation-point properties | Use DFS low-link / child-count conditions | DFS tree |
| MST definition and spanning-tree properties | Minimum spanning trees | Bank: 13 questions / 23 marks | Count edges, identify spanning tree | Connected undirected graph |
| Cut and cycle properties | MST | Several supplied MSQs | Identify edges in/out of every MST | Cuts and cycles |
| Kruskal + DSU | MST | not sure | Edge selection and cycle rejection | Sorting, union-find |
| Prim | MST | not sure | Grow tree from a source | Priority queue |
| Unique MST / equal weights / number of MSTs | MST | Several supplied questions | Uniqueness, count alternatives | Cut/cycle properties |
| MST after edge insertion | MST | Supplied bank includes one update question | Check maximum edge on the existing tree path | Tree traversal |
| Shortest paths: definitions and relaxation | Shortest paths | Included in 14 graph traversal/SSSP bucket | Update distance estimates | Graph, min operation |
| BFS for unweighted shortest paths | Shortest paths | not sure | Distance in number of edges | BFS |
| DAG shortest paths | Shortest paths | Supplied bank has a DAG shortest-path complexity question | O(V+E) topological relaxation | DAG and topological order |
| Dijkstra for non-negative weights | Shortest paths | not sure | Run shortest path and compute costs | Priority queue |
| Bellman-Ford and negative-cycle detection | Shortest paths | not sure | Relax all edges V−1 times | Relaxation |
| Reweighting / potential function | Shortest paths | Supplied bank includes a weight-transform question | Prove endpoint path-order invariance | Path sums |
| Floyd-Warshall / all-pairs shortest paths | Shortest paths | not sure | Dynamic programming over intermediate vertices | 2D DP table |

---

# PART 4 — THE DIAGRAMS I NEED

The diagrams must be instructional. Each one needs a title, labels, a caption and one sentence explaining what I should notice.

| Chapter / topic | What to draw | What I should notice | Best format |
|---|---|---|---|
| Algorithm basics | Input → steps → output flow | An algorithm must be finite and unambiguous | Single picture |
| Cost model | One loop with a counter beside it | Count a chosen operation, not vague “work” | Trace table |
| Big-O / Θ | Two curves with c₁g(n), f(n), c₂g(n), n₀ | After n₀, f is trapped between constant multiples | Single graph |
| Growth rates | Curves for log n, n, n log n, n², 2ⁿ | Curves separate as n grows | Single graph |
| Loop analysis | Nested-loop counter table | Inner-loop count changes with the outer variable | Trace table |
| Recursion | Call tree for T(n)=2T(n/2)+n | Each node's input size and work add to total work | Call tree |
| Recurrence tree | Cost at each level | Total cost is sum across levels | Step-by-step tree |
| Binary search | Array with low/mid/high marks | Each comparison discards half the remaining range | Step-by-step frames |
| Insertion sort | Array split into sorted/unsorted portions | One key moves left into its correct place | Frame series |
| Selection sort | Current minimum highlighted | Each pass places one final element | Frame series |
| Bubble sort | Adjacent comparisons and swaps | Large/small item moves across the array | Frame series |
| Merge sort | Split tree and merged sorted blocks | Merge operations are performed bottom-up on sorted parts | Call tree + frames |
| Quicksort | Pivot and less/equal/greater regions | Partition position determines subproblem sizes | Frame series |
| Min/max comparison | Pairwise tournament | A pair yields one candidate minimum and one candidate maximum | Tournament tree |
| Median of medians | Groups of five, group medians, recursive selection | The chosen pivot guarantees a sufficient number of smaller/larger elements | Step-by-step series |
| Hashing | Keys mapped to buckets | Hash function maps many possible keys into limited slots | Single picture |
| Chaining | Array of bucket heads and linked nodes | Collisions live in a linked chain | Single picture |
| Linear probing | Table after each insertion | Probe moves one slot at a time, wrapping at table end | Frame series |
| Quadratic probing | Table and quadratic probe sequence | Probe gaps grow quadratically and may not visit all slots | Trace table |
| Double hashing | h₁, h₂ and probe index sequence | Secondary hash gives the step size | Trace table |
| Tombstone deletion | Search path through a deleted slot | A tombstone cannot be treated as never-used empty | Frame series |
| D&C pattern | Problem split into subproblems and combined | Recursion solves smaller cases; combine builds the final answer | Single flow + call tree |
| Maximum subarray | Left, right and crossing intervals | Best interval may cross the middle | Graph/array frames |
| Greedy choice | Candidate choices sorted by a rule | Local choice is only safe when a proof supports it | Single picture |
| Exchange argument | Two schedules/solutions with one choice swapped | Replacing a choice does not worsen the solution | Before/after picture |
| Activity selection | Intervals on a time line | Earliest finish leaves the most room for later intervals | Timeline |
| Fractional knapsack | Items sorted by value/weight with a partially filled item | Splitting makes ratio-greedy valid | Table + fill picture |
| 0/1 knapsack | Capacity and indivisible items | Greedy ratio can fail because the next item may not fit | Table |
| Huffman | Repeatedly combine two lightest nodes | The two least frequent symbols become siblings at greatest depth | Step-by-step tree |
| DP subproblems | Overlapping call tree | Several recursive paths ask for the same subproblem | Call tree |
| DP table | Table cells with arrows to dependencies | A state can be filled only after all dependencies exist | Dependency graph |
| Rod cutting | Length n split into first cut and remainder | Every possible first cut is considered | Recurrence tree + table |
| Matrix-chain DP | Interval [i,j] with split k | Each parenthesization has a split point and multiplication cost | Interval table |
| LIS/LNDS | Array values and increasing subsequence arrows | Keep order of indices; values must be non-decreasing/increasing as specified | Array picture + trace |
| BFS | Queue beside graph, vertices marked by level | FIFO order discovers vertices in non-decreasing distance | Frame series |
| BFS shortest path | Parent pointers and levels | Parent chain gives a shortest unweighted path | Graph picture |
| DFS | Recursion stack and discovery/finish clock | A vertex is active between discovery and finish | Frame series |
| DFS edge types | Directed graph with tree/back/forward/cross arrows | Time intervals determine edge classification | Annotated graph |
| DFS forest | Several DFS trees | Each tree corresponds to one connected component for undirected graphs | Graph picture |
| Topological sort | DAG and finish-time ordering | Every directed edge points forward in a valid order | Graph + order line |
| SCC | Directed graph with mutually reachable groups | Each SCC is a maximal group of mutually reachable vertices | Coloured graph |
| Articulation point | Vertex whose removal splits graph | DFS child subtrees without back edges can disconnect | Before/after graph |
| MST | Graph with selected tree edges | A spanning tree connects all vertices using V−1 edges and no cycle | Graph frames |
| Cut property | A cut and lightest crossing edge | A uniquely lightest crossing edge belongs to every MST | Single graph |
| Cycle property | Cycle with heaviest edge highlighted | A unique heaviest edge on a cycle is excluded from every MST | Single graph |
| Kruskal | Sorted edge list and DSU components | Accept edge only when endpoints are in different components | Trace table |
| Prim | Current tree and cheapest crossing edge | Tree expands one vertex/edge at a time | Frame series |
| MST count | Equal-weight component contraction | Equal choices create alternative MSTs | Step-by-step graph |
| Shortest-path relaxation | Edge u→v and tentative distances | Update d[v] when d[u]+w(u,v) is smaller | Trace table |
| DAG shortest paths | Topological order with relaxations | Each edge is processed once in topological order | Graph frames |
| Dijkstra | Priority queue and visited set | Finalise the closest unvisited vertex only under non-negative weights | Trace table |
| Bellman-Ford | Edge list and distance vector after each round | Up to V−1 passes propagate paths with increasing edge count | Trace table |
| Negative cycle | Cycle whose total weight is negative | A further improvement after V−1 rounds signals a reachable negative cycle | Graph picture |
| Reweighting | Original and transformed edge weights along one path | f terms cancel except at the source and destination | Equation/graph |
| Floyd-Warshall | 2D distance matrix before/after intermediate k | Each phase allows one more vertex as an intermediate | Matrix frames |

---

# PART 5 — THE FULL PLAN, CHAPTER BY CHAPTER

Every lesson is planned for **45–90 minutes of reading**. This is the full lesson map, not a promise that a student masters the subject in one pass.

Each lesson has:
- `[MUST]`: directly needed for a syllabus line or a recurring prerequisite;
- `[SHOULD]`: supports a broader syllabus term or a demonstrated PYQ pattern;
- `[LATER]`: useful enrichment, but not where a weak student should spend first-pass time.

## Chapter 0 — Foundations before algorithms

### A0.1 — What is an algorithm? [MUST]
- **Prerequisites:** basic arithmetic and reading simple instructions.
- **Beginner must-see:** input, output, steps, stop condition and correctness.
- **Finer points:** finite steps, well-defined operations, input size and edge cases.
- **GATE level:** trace short pseudocode and identify the required output.
- **Diagrams:** input→algorithm→output flow; before/after state picture.
- **Hand traces:** compute max of three numbers; find whether an array contains a key.
- **Common mistakes:** confusing the algorithm with the code language; forgetting empty or one-element inputs.

### A0.2 — The tools algorithms assume [MUST]
- **Prerequisites:** A0.1.
- **Beginner must-see:** arrays, indices, loops, functions, recursion, stack, queue, tree, heap and graph.
- **Finer points:** adjacency list versus matrix; priority queue; disjoint-set union as a supporting structure.
- **GATE level:** read pseudocode that uses these structures.
- **Diagrams:** array, stack, queue, binary heap and a small graph.
- **Hand traces:** enqueue/dequeue, push/pop and array traversal.
- **Common mistakes:** assuming the graph algorithm itself teaches the graph representation.

## Chapter 1 — Asymptotics and recurrences

### A1.1 — Counting work and input size [MUST]
- **Prerequisites:** A0.1–A0.2.
- **Beginner must-see:** count one chosen operation as input size grows.
- **Finer points:** comparisons, swaps, assignments, loop tests and recursive calls.
- **GATE level:** count simple and nested loops.
- **Diagrams:** counter beside a loop; trace table.
- **Hand traces:** count 1..n; triangular loops; `j += i`.
- **Common mistakes:** counting source lines rather than executions; ignoring loop step size.

### A1.2 — O, Ω, Θ, o and ω [MUST]
- **Prerequisites:** functions, inequalities and constants.
- **Beginner must-see:** upper, lower, tight and strict growth bounds.
- **Finer points:** quantifiers, constants c and threshold n₀; common misconceptions about equality.
- **GATE level:** choose valid asymptotic statements.
- **Diagrams:** growth curves and bound bands.
- **Hand traces:** prove 3n²+5n is Θ(n²); compare n and n².
- **Common mistakes:** treating Big-O as the exact running time.

### A1.3 — Comparing growth rates [MUST]
- **Prerequisites:** A1.2 and logarithm rules.
- **Beginner must-see:** logarithms grow slower than powers; exponentials eventually beat polynomials.
- **Finer points:** log(n!), n^(log n), n^sqrt(n), a^n and 2^(log₂n).
- **GATE level:** arrange functions in increasing order.
- **Diagrams:** growth ladder and ratio table.
- **Hand traces:** simplify `2^(log₂ n)`; compare n^log n with n^sqrt n.
- **Common mistakes:** forgetting the log base or comparing values at small n instead of asymptotic growth.

### A1.4 — Space complexity and recursion stack [MUST]
- **Prerequisites:** A1.1, recursion and memory.
- **Beginner must-see:** input storage is different from extra memory used by the algorithm.
- **Finer points:** recursion depth, local variables, auxiliary arrays, in-place algorithms.
- **GATE level:** worst-case auxiliary space.
- **Diagrams:** recursive call stack and memory blocks.
- **Hand traces:** count stack depth for linear and halving recursion.
- **Common mistakes:** counting total recursive calls as stack depth.

### A1.5 — Recurrences from code [MUST]
- **Prerequisites:** A1.1 and recursion.
- **Beginner must-see:** translate recursive calls and non-recursive work into T(n).
- **Finer points:** base cases, floor/ceil, multiple different subproblem sizes.
- **GATE level:** recurrence identification and simple solution.
- **Diagrams:** call tree and recurrence tree.
- **Hand traces:** T(n)=T(n−1)+1; T(n)=2T(n/2)+n.
- **Common mistakes:** forgetting the base case or adding the non-recursive cost only once.

### A1.6 — Solving recurrences [MUST]
- **Prerequisites:** A1.5 and logarithms.
- **Beginner must-see:** recursion tree, substitution and Master theorem.
- **Finer points:** Master theorem cases and conditions; unequal subproblems; square-root/log-log patterns.
- **GATE level:** solve the supplied recurrence patterns, including T(n)=T(n/2)+T(2n/5)+cn.
- **Diagrams:** level-cost tree and exponent substitution.
- **Hand traces:** solve one recurrence by expansion and verify the result.
- **Common mistakes:** applying Master theorem to recurrences it does not cover.

## Chapter 2 — Searching and sorting

### A2.1 — Linear and binary search [MUST]
- **Prerequisites:** arrays, loops, sorted order.
- **Beginner must-see:** linear checks items one by one; binary search discards half.
- **Finer points:** interval convention, duplicates, boundary conditions, worst-case comparisons.
- **GATE level:** comparison count; find a boundary in a sorted 0/1 array.
- **Diagrams:** array with low/mid/high.
- **Hand traces:** binary search for present and absent keys.
- **Common mistakes:** using binary search on unsorted data; off-by-one updates.

### A2.2 — Elementary sorting [MUST]
- **Prerequisites:** A0.2 and A1.1.
- **Beginner must-see:** insertion, selection and bubble sort.
- **Finer points:** best/worst cases, comparisons, swaps, stability and adaptiveness.
- **GATE level:** number of comparisons/swaps; identify algorithm from a trace.
- **Diagrams:** array frames after each pass.
- **Hand traces:** sorted and reverse-sorted arrays.
- **Common mistakes:** using a best-case fact as the worst-case answer.

### A2.3 — Merge sort [MUST]
- **Prerequisites:** A1.5 and sorted arrays.
- **Beginner must-see:** split, recursively sort and merge.
- **Finer points:** merge count, stable output, auxiliary space, void merges.
- **GATE level:** count merges and identify void merges.
- **Diagrams:** recursion tree and merge frames.
- **Hand traces:** sort an eight-element list.
- **Common mistakes:** merging two unsorted pieces or forgetting the temporary array.

### A2.4 — Quicksort [MUST]
- **Prerequisites:** arrays, partitioning, recursion.
- **Beginner must-see:** pivot partitions smaller and larger keys.
- **Finer points:** balanced/unbalanced partitions, random pivot, expected versus worst case, partition schemes.
- **GATE level:** pivot position probability and complexity.
- **Diagrams:** partition frames and recursion tree.
- **Hand traces:** one balanced and one worst-pivot input.
- **Common mistakes:** assuming every pivot splits in half.

### A2.5 — Heap sort and sorting properties [SHOULD]
- **Prerequisites:** binary heap from Data Structures.
- **Beginner must-see:** build heap, repeatedly remove max/min.
- **Finer points:** build-heap linear time, O(n log n) sort, in-place and unstable.
- **GATE level:** match algorithm complexity and properties.
- **Diagrams:** heap array/tree and extraction frames.
- **Hand traces:** remove three maxima.
- **Common mistakes:** treating build-heap as O(n log n) without explanation.

### A2.6 — Selection, min–max and median of medians [SHOULD]
- **Prerequisites:** sorting, partition and comparison counts.
- **Beginner must-see:** selection finds a rank without fully sorting.
- **Finer points:** pairwise min/max, quickselect and deterministic median-of-medians.
- **GATE level:** comparison bounds and worst-case selection complexity.
- **Diagrams:** comparison tournament and groups-of-five pivot.
- **Hand traces:** find second-smallest, min/max and a median.
- **Common mistakes:** sorting the entire input when only one order statistic is needed.

## Chapter 3 — Hashing

### A3.1 — Hash tables and chaining [MUST]
- **Prerequisites:** arrays, modulo arithmetic, linked lists.
- **Beginner must-see:** hash function maps a key to a slot; chaining stores collisions in a bucket list.
- **Finer points:** load factor, expected chain length and table size.
- **GATE level:** longest chain and expected elements per slot.
- **Diagrams:** bucket table and linked chains.
- **Hand traces:** insert all keys from a small sequence.
- **Common mistakes:** treating key value as the slot; forgetting modulo.

### A3.2 — Open addressing [MUST]
- **Prerequisites:** A3.1.
- **Beginner must-see:** a collision makes the algorithm probe another table slot.
- **Finer points:** linear, quadratic and double hashing; wraparound; tombstones; probe-index convention.
- **GATE level:** insert keys and find empty positions or final slot.
- **Diagrams:** table state after each insertion and probe sequence.
- **Hand traces:** solve each key in order.
- **Common mistakes:** restarting at h(k) after a collision or treating deleted slots as never used.

### A3.3 — Universal hashing and adversarial keys [SHOULD]
- **Prerequisites:** hash functions and probability basics.
- **Beginner must-see:** an adversary may choose keys that collide under a fixed function.
- **Finer points:** universal family, random choice and expected collision control.
- **GATE level:** choose a strategy robust against adversarial inputs.
- **Diagrams:** fixed hash versus random family.
- **Hand traces:** explain why a universal scheme gives an expected collision bound.
- **Common mistakes:** claiming multiplication or division hashing is adversary-proof by itself.

## Chapter 4 — Divide and conquer

### A4.1 — The divide-and-conquer pattern [MUST]
- **Prerequisites:** A1.5.
- **Beginner must-see:** split into smaller tasks, solve them, combine the answers.
- **Finer points:** balanced versus unbalanced subproblems; recursion overhead.
- **GATE level:** identify the recurrence and cost.
- **Diagrams:** divide/conquer/combine flow and call tree.
- **Hand traces:** merge sort and binary search.
- **Common mistakes:** assuming every split makes the two parts equal.

### A4.2 — Maximum subarray and min–max [SHOULD]
- **Prerequisites:** arrays, sums and A4.1.
- **Beginner must-see:** best interval may lie left, right or cross the midpoint.
- **Finer points:** crossing sum, negative values, empty versus non-empty subarray conventions.
- **GATE level:** maximum contiguous sum and comparison count.
- **Diagrams:** array split and crossing interval.
- **Hand traces:** supplied 14-element array pattern.
- **Common mistakes:** choosing the largest single element without checking a positive run.

### A4.3 — Selection / deterministic pivot [SHOULD]
- **Prerequisites:** A2.6 and A4.1.
- **Beginner must-see:** partitioning lets us discard a large side when the pivot rank is known.
- **Finer points:** median-of-medians groups, guaranteed pivot quality and recurrence.
- **GATE level:** worst-case selection complexity.
- **Diagrams:** groups of five and pivot partition.
- **Hand traces:** mark group medians and the recursive selection.
- **Common mistakes:** confusing the median of medians with the exact median of all elements.

## Chapter 5 — Greedy algorithms

### A5.1 — Greedy choice and proof [MUST]
- **Prerequisites:** ordering, induction and simple proof reasoning.
- **Beginner must-see:** choosing what looks best now can fail unless a property makes it safe.
- **Finer points:** greedy-choice property, optimal substructure, exchange argument and cut property.
- **GATE level:** decide whether a proposed greedy rule is valid.
- **Diagrams:** choice sequence and exchange before/after.
- **Hand traces:** compare a greedy choice with an optimal solution.
- **Common mistakes:** assuming a locally attractive choice is always globally optimal.

### A5.2 — Activity selection / interval scheduling [SHOULD]
- **Prerequisites:** A5.1 and sorting.
- **Beginner must-see:** choose compatible activities by earliest finish.
- **Finer points:** finish-time ties, proof by exchange.
- **GATE level:** maximum number of compatible intervals.
- **Diagrams:** timeline with selected and rejected intervals.
- **Hand traces:** sort and accept intervals one by one.
- **Common mistakes:** sorting by shortest duration or earliest start without proof.

### A5.3 — Knapsack and Huffman coding [MUST]
- **Prerequisites:** ratios, binary trees, priority queue.
- **Beginner must-see:** fractional knapsack can use ratios; 0/1 knapsack cannot generally use the same greedy rule; Huffman merges two least weights.
- **Finer points:** prefix-free codes, weighted code length, ties and counting different optimal solutions.
- **GATE level:** compute greedy-versus-optimal knapsack difference; build Huffman cost.
- **Diagrams:** capacity fill and Huffman tree frames.
- **Hand traces:** supplied four-item knapsack; five-symbol Huffman tree.
- **Common mistakes:** splitting indivisible items; assigning a code that is a prefix of another.

## Chapter 6 — Dynamic programming

### A6.1 — Recognising a DP problem [MUST]
- **Prerequisites:** recursion and arrays.
- **Beginner must-see:** overlapping subproblems are solved once and reused.
- **Finer points:** state, transition, base case, memoization and tabulation.
- **GATE level:** decide whether a recurrence/table computation is correct.
- **Diagrams:** recursion tree with repeated states and state-dependency graph.
- **Hand traces:** small staircase/coin or prefix-sum example.
- **Common mistakes:** writing a recurrence before defining what a state means.

### A6.2 — Rod cutting [SHOULD]
- **Prerequisites:** A6.1.
- **Beginner must-see:** try each possible first cut and keep the best revenue.
- **Finer points:** reconstruction and number of optimal solutions.
- **GATE level:** find Rn and count ways.
- **Diagrams:** cut options and DP table.
- **Hand traces:** rod length seven with price table.
- **Common mistakes:** counting the same cut order multiple times if combinations rather than ordered cuts are intended.

### A6.3 — Matrix-chain multiplication [MUST]
- **Prerequisites:** matrix dimensions and A6.1.
- **Beginner must-see:** multiplication order changes cost, not the final matrix.
- **Finer points:** interval DP, split k, parenthesisation reconstruction.
- **GATE level:** minimum scalar multiplications and directly multiplied adjacent pairs.
- **Diagrams:** chain split at k and DP interval table.
- **Hand traces:** solve a five-matrix chain.
- **Common mistakes:** multiplying matrices in an order that does not match dimensions.

### A6.4 — LIS/LNDS and table dependencies [SHOULD]
- **Prerequisites:** arrays, subsequences and A6.1.
- **Beginner must-see:** subsequence preserves order but may skip positions.
- **Finer points:** strictly increasing versus non-decreasing, O(n²) recurrence, optimized O(n log n) insight.
- **GATE level:** minimum replacements to make an array sorted equals n minus the longest non-decreasing subsequence length.
- **Diagrams:** selected index chain and DP dependency arrows.
- **Hand traces:** given seven-element array; fill dp[i].
- **Common mistakes:** confusing subsequence with contiguous subarray.

### A6.5 — DP evaluation order [MUST]
- **Prerequisites:** A6.1–A6.4.
- **Beginner must-see:** a cell can be computed only after its dependencies exist.
- **Finer points:** row-major, column-major, diagonal and topological orders.
- **GATE level:** check whether two loop-nest algorithms compute the same table.
- **Diagrams:** grid with predecessor arrows and diagonal wavefront.
- **Hand traces:** fill a 3×3 table in both valid orders.
- **Common mistakes:** assuming any nested-loop order is valid.

## Chapter 7 — Graph traversals

### A7.1 — Graph basics and representation [MUST]
- **Prerequisites:** A0.2.
- **Beginner must-see:** vertices, edges, directions, weights, paths, cycles, degree and components.
- **Finer points:** adjacency list/matrix and O(V+E) versus O(V²) scans.
- **GATE level:** infer graph structure from a representation.
- **Diagrams:** same graph as drawing, edge list, list and matrix.
- **Hand traces:** count V/E and list neighbours.
- **Common mistakes:** counting a directed edge twice or confusing a path with a simple path.

### A7.2 — BFS [MUST]
- **Prerequisites:** queue, graph representation.
- **Beginner must-see:** queue explores vertices in layers.
- **Finer points:** visited timing, parent, distance, disconnected components and shortest unweighted paths.
- **GATE level:** visit order and distance.
- **Diagrams:** queue frames and level-labelled graph.
- **Hand traces:** perform BFS on several neighbour orders.
- **Common mistakes:** changing the neighbour order without following the question's order.

### A7.3 — DFS and edge classes [MUST]
- **Prerequisites:** recursion/stack and graph representation.
- **Beginner must-see:** explore as deep as possible before returning.
- **Finer points:** discovery/finish time, tree/back/forward/cross edges, directed versus undirected graphs.
- **GATE level:** timestamp inequalities, classify edges, reason about DAGs.
- **Diagrams:** recursion stack, timestamp intervals and edge-class graph.
- **Hand traces:** mark the clock on entry and exit.
- **Common mistakes:** assuming an edge's classification is independent of neighbour order.

### A7.4 — Topological sort, SCCs and articulation points [SHOULD]
- **Prerequisites:** A7.2–A7.3.
- **Beginner must-see:** DAG ordering, mutual reachability and cut vertices.
- **Finer points:** Kahn's algorithm, DFS finish order, Kosaraju/Tarjan idea, low-link and root-child rule.
- **GATE level:** existence of topological order; SCC statements; articulation-point properties.
- **Diagrams:** DAG order, SCC coloured groups, articulation before/after graph.
- **Hand traces:** remove a vertex; count components; run DFS on a small directed graph.
- **Common mistakes:** thinking every directed graph has a topological order; saying a DFS leaf is an articulation point.

## Chapter 8 — Minimum spanning trees

### A8.1 — Spanning trees and cut/cycle properties [MUST]
- **Prerequisites:** graph, tree, cycle, cut.
- **Beginner must-see:** a spanning tree connects every vertex with V−1 edges and no cycle.
- **Finer points:** minimum total weight, unique edge weights, unique MST.
- **GATE level:** which edges are in every or no MST.
- **Diagrams:** cut and cycle on a weighted graph.
- **Hand traces:** test a candidate MST by total weight and cycle property.
- **Common mistakes:** confusing MST with shortest-path tree.

### A8.2 — Kruskal and disjoint sets [MUST]
- **Prerequisites:** sorting and DSU.
- **Beginner must-see:** process edges by increasing weight; reject an edge that joins an already connected pair.
- **Finer points:** union by rank/size, path compression, disconnected graphs.
- **GATE level:** construct MST and identify accepted edges.
- **Diagrams:** sorted edge list and changing components.
- **Hand traces:** one edge per row with DSU sets.
- **Common mistakes:** accepting the cheapest edge even when it creates a cycle.

### A8.3 — Prim, uniqueness and MST counting [MUST]
- **Prerequisites:** A8.1 and priority queue.
- **Beginner must-see:** grow one tree by the minimum edge crossing from the current tree to outside.
- **Finer points:** ties, multiple MSTs, edge-in-every-MST and edge insertion update.
- **GATE level:** Prim trace, count MSTs for small graphs, maximum edge on a tree path.
- **Diagrams:** Prim growth frames and equal-weight contracted components.
- **Hand traces:** run both Prim and Kruskal on the same graph.
- **Common mistakes:** choosing the smallest edge anywhere rather than the smallest edge crossing the current cut.

## Chapter 9 — Shortest paths

### A9.1 — Shortest-path basics and relaxation [MUST]
- **Prerequisites:** graphs, path weights and minimum operation.
- **Beginner must-see:** distance is the smallest total weight among allowed paths.
- **Finer points:** reachable/unreachable, negative edges, negative cycles, relaxation and predecessor.
- **GATE level:** update distance values and identify assumptions.
- **Diagrams:** weighted graph with tentative distances.
- **Hand traces:** relax one edge and update a predecessor.
- **Common mistakes:** using Dijkstra on negative-weight edges.

### A9.2 — BFS and DAG shortest paths [MUST]
- **Prerequisites:** A7.2, A7.4, A9.1.
- **Beginner must-see:** BFS handles equal-weight edges; a DAG can be processed in topological order.
- **Finer points:** DAG may have negative edges without cycles; one pass through edges is enough.
- **GATE level:** identify O(V+E) fastest DAG SSSP algorithm and trace distances.
- **Diagrams:** topological order and one relaxation pass.
- **Hand traces:** compute shortest paths in a small weighted DAG.
- **Common mistakes:** assuming every shortest path algorithm needs a priority queue.

### A9.3 — Dijkstra [MUST]
- **Prerequisites:** A9.1, priority queue.
- **Beginner must-see:** repeatedly finalise the currently closest unsettled vertex.
- **Finer points:** non-negative edge requirement, stale heap entries, adjacency-list complexity.
- **GATE level:** shortest distances and next hops.
- **Diagrams:** graph with tentative labels and settled set.
- **Hand traces:** one full Dijkstra run.
- **Common mistakes:** revising a settled node as though negative edges were allowed.

### A9.4 — Bellman-Ford and reweighting [SHOULD]
- **Prerequisites:** A9.1.
- **Beginner must-see:** relax all edges repeatedly; after V−1 passes, shortest simple paths are covered.
- **Finer points:** negative-cycle detection; potential reweighting w'(u,v)=w(u,v)+f(u)−f(v); endpoint terms telescope.
- **GATE level:** path-order invariance under reweighting.
- **Diagrams:** pass-by-pass distance table and path equation.
- **Hand traces:** three rounds over a small edge list.
- **Common mistakes:** claiming a negative edge always means a negative cycle.

### A9.5 — All-pairs shortest paths [LATER]
- **Prerequisites:** A6.5 and A9.1.
- **Beginner must-see:** find shortest distances between every pair.
- **Finer points:** Floyd–Warshall recurrence and negative diagonal cycle test.
- **GATE level:** small matrix update.
- **Diagrams:** distance matrix before/after each intermediate vertex.
- **Hand traces:** a 3×3 matrix.
- **Common mistakes:** updating a matrix with the wrong k/i/j order.

---

# PART 6 — AUDIT OF ALL 73 SUPPLIED PYQs

**Audit labels**
- **Key supported:** the marked answer matches a direct re-solve from the text.
- **Key supported, assumptions must be stated:** arithmetic is consistent under the stated or usual exam model; the lesson must make that model explicit.
- **Cannot verify — figure missing:** the question depends on a diagram/table absent from the input.
- **FACT-DOUBT:** the wording or a stated condition may be incomplete or incorrect.
- This is an independent text-based re-solve, not a claim that all 73 were cross-checked against official master-paper PDFs. The GATE official master-paper/answer-key page explains that the answer key follows master-paper question order and defines MCQ/MSQ/NAT marking. [GATE official master papers and answer keys](https://gate2026.iitg.ac.in/QPs-answer-keys.html).

| # | PYQ ID | Revised lesson | Exact concept | Trap / finer point | Key and transcription audit |
|---:|---|---|---|---|---|
| 1 | 2026_FN_Q17 | A1.5–A1.6 | Coupled recurrence relations | Solve T₂ first: 5T₂(n/4)+Θ(log n)=Θ(n^log₄5); then T₁ has homogeneous Θ(n²), which dominates that forcing term. | **A supported.** No apparent transcription issue. |
| 2 | 2026_FN_Q24 | A3.2 | Linear probing after insertion | Hash is (x+7) mod 11; slots filled are 8,9,7,0,10,1. | **C supported.** Slot 2 is empty. |
| 3 | 2026_AN_Q24 | A1.3 | Ordering log n, n^(1/3), 2^(log₂n), log(n!) | 2^(log₂n)=n; log(n!)=Θ(n log n). | **A supported.** Correct increasing order: log n, n^(1/3), n, n log n. |
| 4 | 2026_AN_Q25 | A1.5–A1.6 | Recurrences with Θ(n) solution | A is a linear chain with constant work; B is 2 half-size calls plus constant work, summing Θ(n). C is Θ(n log n); D is Θ(n²). | **A and B supported.** No apparent transcription issue. |
| 5 | 2026_AN_Q30 | A3.1 | Chaining and longest chain | Remainders mod 9: 5,1,1,6,8,6,3,8,1; bucket 1 has three keys. | **3 supported.** No apparent transcription issue. |
| 6 | 2026_AN_Q32 | A2.3 | Void merges in merge sort | Four base merges: [8] with [19] and [25] with [31] are void; final top merge is also void. | **3 supported.** No apparent transcription issue. |
| 7 | 2026_AN_Q37 | A9.2 | Fastest SSSP in a weighted DAG | Topological order relaxes every vertex/edge once; works with negative edges if graph is acyclic. | **A supported: Θ(m+n).** No apparent transcription issue. |
| 8 | 2026_AN_Q38 | A1.1–A1.2 | Check whether adjacent differences are strictly increasing | One pass computes each difference and compares with the previous; worst case must inspect Θ(n) values. | **A supported: Θ(n).** No apparent transcription issue. |
| 9 | 2026_AN_Q39 | A6.5 | Correct order for filling a 2D DP table | Row-major B₁ sees top and left dependencies already set; diagonal order B₂ sees both dependencies from the previous diagonal. | **A supported: both correct.** No apparent transcription issue. |
| 10 | 2026_FN_Q41 | A9.1 | Properties of bounded-edge shortest path dₖ | S1 is true because the allowed path set grows with k. S2 can fail because a short but heavier path to v may exist within k edges while u is not yet reachable within k. | **A supported.** Example for S2: s→a→u→v is the global shortest route to v, but s→v is a higher-weight one-edge route; at k=1, d₁(u)=∞ while d₁(v) is finite. |
| 11 | 2026_FN_Q49 | A8.1 | Cut/cycle properties of MST | Unique heaviest edge on a cycle is excluded; minimum edge incident to v is unique lightest across cut {v}; lightest edge of an arbitrary cycle need not always be in an MST. | **A and D supported.** No apparent transcription issue. |
| 12 | 2026_FN_Q50 | A7.3 | DFS edge-time intervals in a DAG | An edge to an ancestor would be a back edge and create a directed cycle; an edge cannot point to a vertex that finishes after its source without it being a descendant/tree-forward relation. | **B and D supported as “never correct”.** No apparent transcription issue. |
| 13 | 2025_FN_Q18 | A8.1 | Path distance in an MST versus original graph | The MST contains only some graph edges; shortest path in the full graph cannot be longer than the tree path. | **B supported: d₁≤d₂.** No apparent transcription issue. |
| 14 | 2025_FN_Q20 | A1.5–A1.6 | Recurrence T(n)=2T(n−1)+n2ⁿ | Divide by 2ⁿ: S(n)=S(n−1)+n; summing gives Θ(n²). | **A supported: Θ(n²2ⁿ).** No apparent transcription issue. |
| 15 | 2025_AN_Q20 | A2.1 | Minimum comparisons to find a non-maximum item | Compare any two distinct elements; the smaller is certainly not the maximum. | **A supported if N≥2. FACT-DOUBT:** the question should state N≥2; for N=1 no such element exists. |
| 16 | 2025_AN_Q29 | A7.2–A7.3 | BFS/DFS facts in undirected graphs | DFS non-tree edges connect ancestor/descendant; BFS non-tree edge endpoints differ in level by at most one; both find components. | **B, C and D supported.** No apparent transcription issue. |
| 17 | 2025_FN_Q33 | A2.2 | Bubble-sort swaps on reverse-sorted 30 distinct values | Every pair is an inversion; swaps = n(n−1)/2 = 30×29/2. | **435 supported.** No apparent transcription issue. |
| 18 | 2025_AN_Q37 | A8.1 / A9.1 | Add α to every edge weight | Every spanning tree gains the same (V−1)α, so MSTs remain MSTs. Shortest paths can change because paths may use different numbers of edges. | **C supported.** Counterexample: two-edge path weights 1+1 beats direct edge 3; adding α=2 gives path 6 and direct 5. |
| 19 | 2025_AN_Q41 | A2.1 | Search in a bitonic array | Find the peak in Θ(log n), then binary search the increasing and decreasing sides. | **D supported. FACT-DOUBT:** text says `1 = i = n`; it almost certainly means `1 ≤ i ≤ n`. Confirm the inequality symbols in the original paper. |
| 20 | 2025_AN_Q59 | A7.2 | Two-BFS diameter method on a tree | The tree's shape is required to run the two BFS traversals. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_59_1]`; do not mark 6 independently checked. |
| 21 | 2025_FN_Q64 | A8.3 | Edge in every MST as a function of x | The graph and weights are in the missing figure. Need cut/cycle analysis to find the threshold. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_64_1]`; do not confirm 5 from the text alone. |
| 22 | 2025_FN_Q65 | A3.2 | Double hashing insertion | Probe sequence for key 24: h₁=2, h₂=4; slots are 2 (occupied), 6 (occupied), 10 (empty). | **10 is supported and lies in the supplied 10–11 answer interval.** The interval includes 10; no evidence of a key error. |
| 23 | 2024_FN_Q20 | A1.1–A1.2 | Worst-case time to check sorted ascending or descending in one pass | One pass keeps two flags and checks each adjacent pair; worst case is linear. | **A supported: O(n) and Ω(n).** No apparent transcription issue. |
| 24 | 2024_AN_Q11 | A6.4 | Minimum replacements to make array non-decreasing | Minimum replacements = n − LNDS length. A longest non-decreasing subsequence has length 4, so 7−4=3. | **3 supported.** No apparent transcription issue. |
| 25 | 2024_FN_Q57 | A1.5–A1.6 | Square-root recurrence | Each expansion contributes Θ(n); the number of levels is Θ(log log n). | **A supported: Θ(n log log n).** No apparent transcription issue. |
| 26 | 2024_FN_Q60 | A7.3 | Edge types when a DFS tree is also a BFS tree | A forward edge would skip a BFS level and contradict the tree being a BFS tree; back/cross edges may still occur. | **C supported.** No apparent transcription issue. |
| 27 | 2024_AN_Q53 | A8.3 | Count distinct MSTs | Equal-weight graph figure is needed to enumerate choices. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_53_1]`; do not mark 9 independently checked. |
| 28 | 2024_FN_Q37 | A7.4 | Connected components from a DFS forest | A forest with V vertices and E tree edges has C=V−E; 100−40=60. | **60 supported.** No apparent transcription issue. |
| 29 | 2023_FN_Q20 | A3.3 | Adversarial hashing | Universal hashing randomises the choice of hash function from a family, limiting an adversary's ability to force collisions. | **C supported.** No apparent transcription issue. |
| 30 | 2023_FN_Q29 | A1.2 | O and little-o for n versus n² | n is O(n²) and o(n²), but not Ω(n²) or Θ(n²). | **A and C supported.** No apparent transcription issue. |
| 31 | 2023_FN_Q54 | A1.1–A1.2 | Count two loop bodies | Function 1 executes n+⌊n/2⌋+⌊n/4⌋+…=Θ(n); Function 2 executes 100n=Θ(n). | **A and D supported.** No apparent transcription issue. |
| 32 | 2022_FN_Q11 | A1.3 | Compare f(n²) and f(n)² | For a positive polynomial of degree d, both are Θ(n²ᵈ). Exponential counterexamples make the other statements false. | **A supported.** The phrase “positive functions” should not be read as positive-coefficient polynomial only where the option explicitly says polynomial. |
| 33 | 2022_FN_Q16 | A3.1 | Expected keys per hash-table slot | Each key is uniformly mapped by one of the two uniform hash functions; expected count is n/m. | **B supported.** No apparent transcription issue. |
| 34 | 2022_FN_Q49 | A8.1 | MST properties with distinct edge weights | The second-smallest edge cannot already close a cycle of lighter edges; the cut property applies; distinct weights imply a unique MST. | **A, B and C supported.** D is false. |
| 35 | 2021_AN_Q64 | A8.1 | Existence of an edge in every MST and uniqueness under distinct weights | Equal-weight triangle can have no single edge in every MST; distinct weights make the MST unique. | **C supported.** No apparent transcription issue. |
| 36 | 2021_FN_Q30 | A2.6 | Lower/upper comparison bound for finding min and max | Pairing elements reduces comparisons relative to doing two independent scans; classical worst-case bound is about 3n/2. | **C supported under the intended n≥2 setting.** The wording “lowest upper bound” is awkward; teach the pairwise algorithm and bound. |
| 37 | 2021_FN_Q61 | A1.3 | Compare 10ⁿ, n^log n and n^√n | n^log n grows slower than n^√n, and both are sub-exponential compared with 10ⁿ. | **D supported.** No apparent transcription issue. |
| 38 | 2021_AN_Q31 | A2.1 | Recursive binary search complexity | Each call halves the range; recursion depth is Θ(log₂ n). | **B supported.** No apparent transcription issue. |
| 39 | 2021_FN_Q25 | A2.2–A2.4 | Which sort uses fewest comparisons on a given array | The exact values/order are in the missing array figure. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_25_1]`; the tick for insertion sort cannot be independently checked. |
| 40 | 2021_AN_Q25 | A7.2–A7.3 | Compare first three vertices in BFS and DFS of a seven-node complete binary tree | BFS has root and both children; DFS has root, one child and a grandchild; set difference size is one. | **1 supported.** No apparent transcription issue. |
| 41 | 2021_FN_Q48 | A8.3 | Number of MSTs | Requires the missing weighted graph. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_48_1]`; do not confirm 3 independently. |
| 42 | 2021_AN_Q57 | A5.3 | Huffman minimum encoded length with frequencies | Counts are a:1, b:2, c:2, d:3, e:2; Huffman combine costs 3+4+6+10=23. | **B supported: 23.** No missing figure; the characters and string are sufficient. |
| 43 | 2021_FN_Q50 | A1.5–A1.6 | Recurrence with subproblems ceil(n/2) and floor(2n/5) | Total child-size fraction is below n (about 0.9n), so total non-recursive work over the recursion tree is O(n), and root work is Ω(n). | **C supported: Θ(n), with a text caveat. FACT-DOUBT:** the recurrence says `n>0`; at n=1, `ceil(1/2)=1`, so it calls itself and does not terminate. It likely should say n>1 or define a base case for n≤1. |
| 44 | 2021_AN_Q55 | A1.6 | Master theorem condition | For a>1, if f(n)=O(n^(log_b a−ε)), the recursive term dominates. | **C is the intended answer under the usual a>1 condition. FACT-DOUBT:** the question says a≥1. If a=1, then T(n)=T(ceil(n/b))+O(n^−ε) can still take Θ(log n) due to recursion depth, not Θ(1). The condition should be a>1 or handle a=1 separately. |
| 45 | 2021_FN_Q17 | A6.2 | Rod cutting optimum and number of optimal ways | R₇=18. Three solutions include [7], [1,6] and [2,2,3]. | **A and C supported.** No apparent transcription issue. |
| 46 | 2021_FN_Q39 | A7.4 | Articulation-point facts for a DFS tree | Root is an articulation point iff it has at least two DFS-tree children; a DFS leaf cannot be a cut vertex in a connected graph; the universal claim D is too strong. | **B supported.** No apparent transcription issue. |
| 47 | 2021_AN_Q30 | A7.3–A7.4 | Directed graph cycles, DFS back edges and SCCs | All statements depend on the exact directed graph. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_30_1]`; A and B are marked official but cannot be re-solved from the absent graph. |
| 48 | 2021_FN_Q49 | A3.2 | Dynamic hashing with bitwise tree splits | The state of the main table and binary bucket trees is in the missing figure. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_49_1]`; cannot independently confirm C. |
| 49 | 2021_AN_Q19 | A9.1–A9.2 | Maximum-product path scores in a DAG | The weighted DAG is in the missing figure; every vertex's best score is computed in topological order. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_19_1]`; cannot independently confirm 929. |
| 50 | 2020_FN_Q34 | A1.5–A1.6 | Repeated root recurrence T(n)=T(n^(1/a))+1 | After k levels, exponent is 1/aᵏ; stop when n^(1/aᵏ)≤b, giving k=Θ(logₐ log_b n). | **A supported under the stated base convention.** No apparent transcription issue. |
| 51 | 2020_FN_Q28 | A3.2 | Double-hashing probe 1 | h₁(90)=21; h₂(90)=1+(90 mod 19)=15; probe 1 gives (21+15) mod 23=13. | **13 supported.** No apparent transcription issue. |
| 52 | 2020_FN_Q39 | A8.3 | Check whether an MST remains valid after inserting one edge | New edge creates a cycle with the existing tree path; find the maximum edge on that path and compare. A tree traversal costs Θ(V). | **D supported: Θ(V).** No apparent transcription issue. |
| 53 | 2020_FN_Q57 | A9.4 | Reweighting shortest paths using vertex potentials | For any path u→…→v, the f terms telescope to f(u)−f(v), the same for all paths with those endpoints. | **A supported.** No apparent transcription issue. |
| 54 | 2020_FN_Q56 | A8.1 | MST of complete graph with edge weight |i−j| | Choose adjacent edges (weight 1) forming a chain; there are 99 edges, total 99. | **99 supported.** No apparent transcription issue. |
| 55 | 2019_FN_Q31 | A2.4 | Probability random pivot is in worst possible location | Only the minimum or maximum key gives the most unbalanced first partition: 2/25=0.08. | **0.08 supported.** No apparent transcription issue. |
| 56 | 2019_FN_Q14 | A4.2 | Maximum contiguous subarray sum | Kadane-style check gives maximum 29 for the subsequence beginning at 6 and ending at 12. | **29 supported.** No apparent transcription issue. |
| 57 | 2019_FN_Q61 | A2.6 | Median of medians of n arrays of size n | Find each array's median in O(n); doing this n times costs O(n²); selecting the median of those n medians is O(n). | **C supported: O(n²).** No apparent transcription issue. |
| 58 | 2019_FN_Q44 | A8.1 | Conditions for unique MST | Distinct edge weights are sufficient; a unique lightest edge across every cut is also sufficient. | **C supported.** No apparent transcription issue. |
| 59 | 2018_FN_Q40 | A7.2–A7.3 | DFS cross-edge property and BFS depth difference | Undirected DFS has no cross edges; adjacent BFS levels differ by at most one, not necessarily exactly one. | **A supported.** No apparent transcription issue. |
| 60 | 2018_FN_Q41 | A6.3 | Matrix-chain multiplication optimal parenthesisation | The minimum cost is achieved with F₃F₄ as the explicitly computed adjacent pair; compare split costs using p=[2,25,3,16,1,1000]. | **C supported.** No apparent transcription issue. |
| 61 | 2018_FN_Q42 | A1.1 | Count two halving loops | First loop sets j=40; second loop updates 40→20→10→5→2→1, incrementing five times. | **B supported: 5.** No apparent transcription issue. |
| 62 | 2018_FN_Q55 | A1.1 / A1.5 | Nested recursive calls and print count | For each y=1024 down to 2 there are 10 prints while x halves from 1024 to 1; 1023×10=10230. | **10230 supported.** No apparent transcription issue. |
| 63 | 2018_FN_Q57 | A8.3 | Choose x to maximise the number of MSTs | Graph and edge labels are in the missing figure. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_57]`; cannot confirm 4 from text alone. |
| 64 | 2018_FN_Q58 | A5.3 | Greedy ratio rule versus 0/1 knapsack optimum | Greedy order: item 4 ratio 12 (value 24), item 1 ratio 6 (does not fit), item 3 ratio 5 (fits, value 20), item 2 does not fit; greedy=44. Optimum is item 1 value 60. Difference=16. | **16 supported.** No apparent transcription issue. |
| 65 | 2017_AN_Q19 | A1.3 / A2.5 | Match common algorithms to time complexities | Hanoi Θ(2ⁿ), binary search Θ(log n), heap sort Θ(n log n), matrix addition Θ(n²). | **C supported.** No apparent transcription issue. |
| 66 | 2017_FN_Q21 | A1.3 | Order 100/n, constant, log n, √n, n | As n grows, 100/n→0, then constant, log n, √n, n. | **B supported.** No apparent transcription issue. |
| 67 | 2017_AN_Q30 | A5.1 / A4.1 | Match algorithms to greedy/D&C/DP design paradigms | The algorithm list and paradigm table are in the missing figure. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_30]`; the marked C cannot be independently checked. |
| 68 | 2017_AN_Q13 | A7.2 | Possible BFS visit order | The graph and neighbour relationships are missing. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_13]`; cannot confirm D. |
| 69 | 2017_FN_Q48 | A8.1 | Distinct weights guarantee unique MST, not unique shortest paths | MST uniqueness follows from distinct edge weights; shortest paths can tie because path sums can be equal. | **A supported.** No apparent transcription issue. |
| 70 | 2017_AN_Q50 | A1.5–A1.6 | Recurrence T(n)=2T(√n)+1 | Taking log₂ n as the new size gives a recurrence with halving depth; total is Θ(log n). | **B supported.** No apparent transcription issue. |
| 71 | 2017_AN_Q61 | A1.1 | Nested loop with j increasing by i | For fixed i, iterations are Θ(n/i); sum over i is Θ(nHₙ)=Θ(n log n). | **C supported.** No apparent transcription issue. |
| 72 | 2017_FN_Q45 | A2.1 | Minimum probes to find first 1 in 31 zeros-then-ones | There are 32 possible boundary positions, so binary search needs 5 probes in the worst case. | **5 supported.** No apparent transcription issue. |
| 73 | 2017_AN_Q59 | A5.3 | Huffman expected encoded length | The probability/frequency table is in the missing image. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_59]`; cannot confirm 225. |

## 6.1 Questions with missing figures (11)

The following items cannot be fully re-solved from the text pasted into the review input:

1. **2025_AN_Q59** — tree diagram for the two-BFS diameter routine.
2. **2025_FN_Q64** — weighted graph and variable x for the edge-in-every-MST question.
3. **2024_AN_Q53** — weighted graph for counting MSTs.
4. **2021_FN_Q48** — weighted graph for counting MSTs.
5. **2021_AN_Q30** — directed graph for DFS/SCC statements.
6. **2021_FN_Q49** — dynamic-hashing state diagram.
7. **2021_AN_Q19** — weighted DAG for maximum-product paths.
8. **2018_FN_Q57** — weighted graph for maximising the number of MSTs.
9. **2017_FN_Q30** — table matching algorithms to design paradigms.
10. **2017_AN_Q13** — graph for the possible BFS order.
11. **2017_AN_Q59** — Huffman frequency/probability table.

Do not claim those eleven answers have been independently verified until the original figures are restored.

## 6.2 Wording / source checks that should be fixed

- **2025_AN_Q41:** `1 = i = n` is not a valid way to state the range of an index. It almost certainly represents `1 ≤ i ≤ n`, but verify the original master paper rather than silently changing it.
- **2021_FN_Q50:** the supplied bank inserts `ceil(n/2)` and `floor(2n/5)`, but the official GATE 2021 CS Set-1 paper prints `n/2` and `2n/5`. It also gives `n>0` with T(0)=1 without spelling out the usual integer rounding / stop-below-one convention. Keep the original expression and add the intended recurrence convention in the solution; the Θ(n) key is consistent with the geometric-level-work argument.
- **2021_AN_Q55:** option C remains valid when a=1 as well. In that edge case, log_b(a)=0 and the stated toll is O(n^-ε); summing that decreasing-by-level input term along the single recursive chain is O(1), matching Θ(n⁰). Do not incorrectly mark the official key as wrong.
- **2025_AN_Q20:** the question should state N≥2. With N=1, no element in the list is “not the largest”.
- **2025_FN_Q65:** the official numeric interval 10–11 includes the independently obtained slot 10. Preserve the official range; do not change it to 10 unless the key's interval is confirmed from the original answer file.

---

# PART 7 — THREE NEW QUESTION IDEAS FOR EVERY LESSON

These are fresh practice ideas, not claimed PYQs. Use one MCQ, one MSQ and one NAT idea per lesson.

| Lesson | MCQ idea | MSQ idea | NAT idea |
|---|---|---|---|
| A0.1 | Identify which pseudocode is a finite algorithm for finding a maximum. | Select all properties required of a well-defined algorithm. | Count the number of comparisons made by a short max-finding algorithm. |
| A0.2 | Choose which data structure is required by a BFS queue. | Select all structures and operations used in Prim, Kruskal and Dijkstra. | Count the number of entries in an adjacency matrix for a graph with n vertices. |
| A1.1 | Identify the dominant operation in a nested loop. | Select all statements about worst-case versus best-case inputs. | Count executions of `j += i` for i=1..n. |
| A1.2 | Choose a function that is Θ(n log n). | Select all correct O/Ω/Θ/o relations for two given functions. | Find the smallest integer exponent k such that n log n is O(n^k). |
| A1.3 | Select the fastest-growing among n^log n, 2^n and n!. | Order five functions including log(n!), n^√n and a^n. | Find the limit ratio for two given growth functions. |
| A1.4 | Identify auxiliary space for a recursive function. | Select which algorithms use O(1), O(log n) or O(n) extra space. | Find maximum recursion depth for a divide-by-3 recursion. |
| A1.5 | Pick the correct recurrence from recursive pseudocode. | Select recurrences with two different subproblem sizes. | Count recursive calls for T(n)=T(n−1)+T(n−2) up to n=8. |
| A1.6 | Identify when Master theorem cannot be applied. | Select correct asymptotic solutions for a set of recurrences. | Solve T(n)=3T(n/3)+n/log n to its asymptotic bound under stated conditions. |
| A2.1 | Find the maximum comparisons of binary search on 1000 sorted values. | Select all correct binary-search invariants. | Find worst-case probes needed to find the transition in a 63-element 0/1 array. |
| A2.2 | Identify which elementary sort is stable. | Compare best/worst cases of insertion, selection and bubble sort. | Count bubble-sort swaps for an array with a supplied inversion count. |
| A2.3 | Identify a merge that is void. | Select all valid properties of merge sort. | Count total merge operations on an array of 32 elements. |
| A2.4 | Choose the probability that a random pivot is among the two central keys. | Select valid statements about worst/expected quicksort. | Count the partition sizes for a given pivot and array. |
| A2.5 | Identify which sorting method is in-place. | Select sorting algorithms that are stable and comparison-based. | Count heap extractions needed to output the three largest elements. |
| A2.6 | Pick the best algorithm for finding the kth smallest element. | Select all true statements about median-of-medians pivot guarantees. | Compute the number of comparisons in pairwise min–max for n=17. |
| A3.1 | Identify the load factor of a table. | Select all correct expected-chain-length statements under simple uniform hashing. | Find the longest chain for a new key set. |
| A3.2 | Choose the correct next slot in quadratic probing. | Select all conditions under which double hashing visits every slot. | Find the final slot of a key after six insertions. |
| A3.3 | Identify why universal hashing helps against adversarial keys. | Select all correct collision probability claims for a universal family. | Find expected colliding pairs among n keys under a stated uniform family. |
| A4.1 | Classify an algorithm as divide-and-conquer or not. | Select subproblems and combine steps for a given recursive algorithm. | Write and solve the recurrence for a 3-way split with linear combine work. |
| A4.2 | Identify the crossing subarray in a split array. | Select all possible locations of a maximum subarray. | Find maximum contiguous sum for a new 12-value array. |
| A4.3 | Identify the guaranteed pivot fraction from groups of five. | Select statements required by worst-case linear-time selection. | Count the number of group medians for 47 values. |
| A5.1 | Identify when a greedy choice requires an exchange proof. | Select all valid proof steps for a greedy-choice argument. | Find the first choice in a weighted interval set. |
| A5.2 | Choose the correct interval-selection ordering rule. | Select all maximum compatible sets for an interval collection. | Count maximum non-overlapping activities in a given set. |
| A5.3 | Identify why ratio-greedy works for fractional but not 0/1 knapsack. | Select all valid Huffman merge sequences under tied frequencies. | Compute the total weighted code length for six symbol frequencies. |
| A6.1 | Identify a problem with overlapping subproblems. | Select valid DP states and base cases for a new problem. | Count distinct states in a two-index DP table. |
| A6.2 | Choose the recurrence for rod cutting with a fixed cutting fee. | Select all optimal decompositions for a new price array. | Find maximum revenue for rod length 9. |
| A6.3 | Identify a valid split point in matrix-chain multiplication. | Select all parenthesizations with minimum scalar cost. | Compute minimum multiplication cost for six given dimensions. |
| A6.4 | Distinguish strictly increasing from non-decreasing subsequence. | Select all LNDS states that can extend a given prefix. | Find minimum replacements to sort a 9-element array. |
| A6.5 | Choose a loop order that respects DP dependencies. | Select all valid evaluation orders for a grid recurrence. | Count the number of states on diagonal i+j=9 in an n×n table. |
| A7.1 | Identify whether a graph is directed, weighted or simple. | Select all differences between adjacency lists and matrices. | Count entries in an adjacency list for a supplied graph. |
| A7.2 | Identify the BFS order for a fixed neighbour order. | Select properties of BFS levels and shortest unweighted paths. | Find distance from s to t in a new graph. |
| A7.3 | Identify the edge class from discovery/finish times. | Select all possible DFS edge classes in a DAG. | Find the number of back edges in a supplied traversal trace. |
| A7.4 | Identify whether a directed graph admits a topological ordering. | Select articulation-point and SCC statements from a small graph. | Count SCCs after a stated set of edges is removed. |
| A8.1 | Identify which edge must belong to every MST by cut property. | Select all cycle/cut statements valid under distinct weights. | Find the total weight of a candidate spanning tree. |
| A8.2 | Choose which edge Kruskal accepts next. | Select all valid DSU component updates. | Count the number of successful union operations before MST completion. |
| A8.3 | Identify the minimum crossing edge for Prim. | Select all conditions for MST uniqueness or multiple MSTs. | Count distinct MSTs for a new small equal-weight graph. |
| A9.1 | Identify whether a negative edge or negative cycle invalidates an algorithm. | Select all valid relaxation updates. | Compute a distance after one full edge-relaxation pass. |
| A9.2 | Choose the shortest-path method for a weighted DAG. | Select all statements about topological relaxation with negative edges. | Find distances from one source in a new DAG. |
| A9.3 | Identify why Dijkstra requires non-negative weights. | Select all valid Dijkstra settled-node statements. | Compute shortest distance from s to a given vertex. |
| A9.4 | Identify a reachable negative cycle from Bellman-Ford passes. | Select all potential functions that preserve path ordering for fixed endpoints. | Find the first pass in which a vertex distance becomes finite. |
| A9.5 | Choose the correct Floyd–Warshall recurrence. | Select all matrix updates using one new intermediate vertex. | Update a 4×4 distance matrix through k=2. |

---

# PART 8 — WHAT IS MISSING FROM THE SUBJECT

The high-level syllabus list itself is correct. The main omissions are the finer lessons required to answer the syllabus and PYQ patterns:

1. **Algorithm foundations:** input size, operation counting, correctness, loop invariants and edge cases.
2. **Asymptotic language:** little-o and little-omega, formal constants/thresholds, growth comparisons and ratio reasoning.
3. **Space complexity:** auxiliary arrays, recursion stack, in-place versus extra space.
4. **Recurrence toolkit:** recursion trees, substitution, Master theorem conditions, unequal subproblems, floor/ceil and log-log recurrences.
5. **Searching:** linear search, binary search boundaries, transition search and bitonic search.
6. **Sorting:** insertion, selection, bubble, merge, quick and heap sort; stability, in-place, adaptiveness, comparisons, swaps and auxiliary space.
7. **Selection:** min/max comparison bounds, quickselect and median of medians.
8. **Hashing:** load factor, chaining, linear/quadratic/double hashing, tombstones, universal hashing and adversarial keys.
9. **Divide-and-conquer:** maximum subarray, recursive min/max, selection and merge/partition traces.
10. **Greedy:** correctness proof, exchange arguments, activity selection, fractional versus 0/1 knapsack, Huffman coding.
11. **Dynamic programming:** state definition, base case, transition, memoization/tabulation, evaluation order, rod cutting, matrix chain, LIS/LNDS and counting optimal solutions.
12. **Graph basics:** adjacency representations and complexity in V and E.
13. **BFS/DFS:** visit order, distance, discovery/finish times, edge classification, connected components, directed cycles and DFS forests.
14. **Graph properties:** topological sorting, SCCs, articulation points and bridges.
15. **MST:** spanning-tree facts, cut/cycle property, uniqueness, equal weights, counting MSTs, DSU, Prim, Kruskal and single-edge insertion.
16. **Shortest paths:** relaxation, BFS for unweighted graphs, DAG SSSP, Dijkstra, Bellman-Ford, negative cycles, reweighting and Floyd–Warshall as extension.
17. **PYQ quality control:** restore all 11 missing figures, add complete solution traces, identify source-paper IDs and resolve the wording issues in 2021_FN_Q50, 2021_AN_Q55 and 2025_AN_Q41.
18. **Practice:** the 29 Forge questions are not attached, so their coverage, originality and correctness cannot be assessed yet.

---

# PART 9 — WEIGHTS AND FINAL DECISION

## 9.1 Revised chapter weights

These are study priorities, not predictions of marks.

| Revised chapter | Weight | Why |
|---|---|---|
| Foundations + asymptotics and recurrences | **Foundation / High** | Every later chapter uses complexity reasoning; the bank contains 19 asymptotic questions. |
| Searching and sorting | **High** | Direct syllabus scope and multiple algorithm traces/comparison-count problems. |
| Hashing | **Medium–High** | Explicit syllabus topic; collisions/probing are procedural and easy to practise. |
| Divide and conquer | **Medium–High** | The bank has relatively few labelled questions, but recurrence reasoning and sorting depend on it. |
| Greedy | **Medium–High** | Greedy proofs and Huffman/knapsack patterns are important; the bank's separate bucket is small. |
| Dynamic programming | **High** | Fewer bank questions, but the problems are often multi-step and cannot be learned by memorising final recurrences. |
| Graph traversals | **High** | BFS/DFS and their graph properties recur in complex 1- and 2-mark questions. |
| Minimum spanning trees | **High** | The supplied bank has 13 questions and 23 marks; cut/cycle properties are highly testable. |
| Shortest paths | **High** | Direct syllabus item; DAG shortest path, reweighting and weighted graph traces need dedicated lessons. |

## 9.2 Does the bank-derived weighting look fair?

The input's arithmetic is internally consistent:

- 19 + 14 + 17 + 13 + 4 + 4 + 2 = **73 questions**.
- 27 + 25 + 23 + 23 + 7 + 7 + 2 = **114 marks**.
- 114/1500 = **7.6%**.
- 114/15 = **7.6 marks per paper**.

But the topic labels are coarse. For example:
- “Graph Traversals (BFS, DFS) & Single-Source Shortest Paths” combines traversal, graph properties and shortest paths.
- “Greedy Approach & Divide-and-Conquer Designs” and “Divide-and-Conquer Designs” are split inconsistently.
- Dynamic programming has only four questions in the source sample; that is not a reason to make it a small or rushed chapter.
- Difficulty labels are not an official GATE category; the document does not explain how Easy/Medium/Hard was assigned.
- The 15-paper set and selection rules should be enumerated; without that list, the frequency stats cannot be independently reproduced from the summary.

**Verdict on weights:** use the bank as a historical practice inventory, not as a lesson-length calculator. Foundational topics deserve more teaching time even when their question count is lower.

## 9.3 Release decision

**Approve:** a corrected beginner-first Algorithms plan based on the nine existing chapters plus an opening foundations chapter.

**Approve as a pilot only:** the revised lesson order and a consistent new writing standard.

**Do not approve yet:** rewriting all lessons in bulk, or charging ₹149.

### Six-lesson pilot to write first

1. A1.2 — O, Ω, Θ, o and ω from zero.
2. A1.5 — Build a recurrence from recursive code.
3. A2.1 — Binary search with every boundary update drawn.
4. A3.2 — Linear probing and double hashing by hand.
5. A6.1 — What a DP state means, before writing the recurrence.
6. A7.2 — BFS using the queue and a full trace.

These test whether the new book can teach abstract notation, code-to-math translation, array algorithms, collision handling, dynamic programming and graph traversal without skipping steps.

### Pilot acceptance criteria

- Five genuinely weak learners read the lesson without a teacher explaining it.
- At least four of five can complete the lesson's basic learning objective without help.
- Every new technical word is defined before it is used in a worked solution.
- Every recurrence has its base case, work per call and recursion depth shown.
- Every hashing, sorting, graph or DP process has a trace table or frame series.
- Every complexity answer includes the reason, not only O(…).
- A reviewer independently reproduces every numeric result.
- The student can solve a new question of the same type after the lesson.
- Any point where two or more readers get stuck is rewritten before the next lesson is produced.

---

# CLAUDE MASTER-PROMPT PATCH — ALGORITHMS

Use this as an Algorithms-specific addition to the universal master prompt.

```text
ROLE AND READER
Write a beginner-first GATE CS 2027 Algorithms textbook for a repeat aspirant
who has forgotten most programming and data structures. Assume the reader is
scared of the subject and cannot follow a solution with skipped steps.

SYLLABUS AUTHORITY
Use the official GATE 2027 Algorithms wording:
- Searching, sorting, hashing.
- Asymptotic worst case time and space complexity.
- Algorithm design techniques: greedy, dynamic programming and divide-and-conquer.
- Graph traversals, minimum spanning trees, shortest paths.

PREREQUISITES
Before using an array, loop, recursion, queue, stack, heap, graph or disjoint set,
confirm that the required idea has been taught or explicitly listed as a prerequisite.
Do not assume the student remembers Data Structures.

MANDATORY TEACHING RULES
1. Define input size, operation count, worst case and auxiliary space before
   using complexity notation.
2. Explain O, Omega, Theta, little-o and little-omega separately.
3. Show loop counts and recurrence trees, not just the final asymptotic answer.
4. State the cost model: comparisons, swaps, assignments, recursive calls,
   memory cells or another specific operation.
5. For sorting, show the array after every pass/partition/merge.
6. For hashing, show every probe and the complete table after every insertion.
7. For greedy algorithms, give a correctness argument (exchange/cut/greedy-choice),
   not just one successful example.
8. For DP, define the state in words before the recurrence, then show base cases,
   transition, evaluation order, table and reconstruction.
9. For BFS/DFS, show the queue/stack, visited state, parent, distances and
   discovery/finish times step by step.
10. For MST, distinguish MST from shortest-path tree; show cut/cycle property
    and every selected/rejected edge.
11. For shortest paths, state whether weights may be negative and whether a
    negative cycle is possible. Never use Dijkstra without its non-negative
    edge condition.
12. Every algorithm must have its worst-case time and auxiliary-space cost
    derived from the steps.

MANDATORY LESSON STRUCTURE
Use the universal 12-station ladder: why, glossary, see it, build it, hand traces,
exact rules, finer points, GATE patterns, mistakes, valid shortcuts, practice ladder,
recap.

ALGORITHM-SPECIFIC DIAGRAMS
Use growth graphs, loop traces, recursion trees, array frames, probe tables,
exchange diagrams, DP dependency graphs, queue/stack frames, DFS timestamps,
cut/cycle graphs, DSU components and shortest-path distance tables.

PYQ RULES
Keep the exact question ID and wording. Restore every original figure.
Re-solve every answer independently.
Mark a question NEEDS-FIGURE when its diagram is absent.
State ambiguities in the original statement; do not silently repair them.
Keep official NAT answer ranges even when the computed value is a single number.
Separate syllabus-core questions from enrichment and legacy material.

RELEASE GATE
Do not write all nine chapters in one batch.
Write the six pilot lessons identified in the review, test with weak learners,
revise, and only then begin bulk writing.
```

---

# Sources and verification notes

1. **Official GATE 2027 CS syllabus PDF — IIT Madras, Section 5, Algorithms:**  
   https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf  
   The official wording lists searching/sorting/hashing; asymptotic worst-case time and space; greedy, DP and divide-and-conquer; graph traversals, MSTs and shortest paths. [Official syllabus PDF](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf).

2. **Official GATE 2027 Test Papers & Syllabus page:**  
   https://gate2027.iitm.ac.in/exam_papers_and_syllabus  
   IIT Madras states that the GATE 2027 syllabi have been revised and directs candidates to the updated syllabus documents. [Official GATE 2027 page](https://gate2027.iitm.ac.in/exam_papers_and_syllabus).

3. **Official GATE 2026 Master Question Papers and Answer Keys:**  
   https://gate2026.iitg.ac.in/QPs-answer-keys.html  
   The official page explains that answer keys match the master-paper question order and describes MCQ/MSQ/NAT marking. It is a useful reference for answer-key checking, but this review has not downloaded and compared all 73 historical master papers line by line. [Official GATE 2026 keys and papers](https://gate2026.iitg.ac.in/QPs-answer-keys.html).
4. **Official GATE 2021 CS Set-1 paper:**  
   https://gate2026.iitg.ac.in/doc/download/2021/cs_2021.pdf  
   Q30 prints the recurrence as `T(n/2) + T(2n/5) + 7n` for n>0 with T(0)=1. This was used to identify the floor/ceiling insertion in the supplied 2021_FN_Q50 transcription.

5. **GATE 2026 historical question-paper downloads:**  
   https://gate2026.iitg.ac.in/download.html  
   The official archive provides bulk previous-year papers and year-wise papers for recent exams. [Official downloads](https://gate2026.iitg.ac.in/download.html).

6. **Independent 2027 syllabus summary (secondary only):**  
   https://gateiit.in/gate-cse/syllabus/algorithms  
   This is useful for seeing topic groupings, but the IIT Madras syllabus PDF remains the authority.

---

## Final student verdict

I would not pay ₹149 for this version. I would pay after the book proves that it can teach complexity, sorting, hashing, DP and graph algorithms from the first idea, with every operation drawn and every answer traced.

The syllabus bullets are correct. The nine chapters are a sensible skeleton. But the plan does not yet show the actual lesson sequence, the many finer topics, the diagrams, the correctness proofs or the worked solutions. Eleven PYQs also need their original figures restored, and two recurrence statements need a careful source check.

**Fix the foundations and the order. Test six lessons on weak students. Then write the rest.**
