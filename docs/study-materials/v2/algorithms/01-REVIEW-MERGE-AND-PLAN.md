# Algorithms: review merge and plan v1

> **Complete (24 Nov):** both full reviews are merged (ChatGPT `reviews-received/chatgpt-review-algorithms.md`, Gemini `reviews-received/gemini-complete.txt`). The earlier partial Gemini reply is kept as `reviews-received/gemini-partial.txt`.

Merged: ChatGPT (`reviews-received/chatgpt-review-algorithms.md`) and Gemini (`reviews-received/gemini.txt`). Note: I read ChatGPT's plan, scope and PYQ audit in detail and Gemini's data findings and feelings; Gemini's lesson-level plan was skimmed and is to be compared lesson by lesson when each chapter is written.

## 1. How good were they
Both agree that the nine headline chapters are right and the syllabus line list is right; what is missing is the lessons inside, an explicit foundation chapter, and tooling around correctness proofs, recurrences and evaluation order. Both found one real transcription error in our bank.

## 2. Critical decision: keep every concept
Keep all four syllabus lines in full: searching, sorting and hashing; asymptotic worst-case time and space; greedy, dynamic programming and divide and conquer; graph traversals, MSTs and shortest paths. Extras the reviewers mention beyond the bank's tags (Floyd–Warshall, SCCs, articulation points and bridges, universal hashing, median of medians, Bellman–Ford and negative cycles, LNDS) are **kept as [SHOULD]**, not dropped just because the bank tags few questions there. NP-completeness and advanced complexity stay out of this book (they are not in the four lines).

## 3. Cross-subject ownership (decided here, to avoid two books with different formulas)
- **Hashing: the two reviewers disagree.** Gemini says the core belongs in Data Structures D12 and links here; ChatGPT says one clear owner is needed. **Decision, by the official 2027 text:** hashing is named in the **Algorithms** line ("Searching, sorting, hashing") and not in the Programming and Data Structures line, so **Algorithms owns the full hashing chapter**. The Data Structures D12 becomes a short bridge (idea, chaining, linear probing by example) that points here. The `04-DATA-STRUCTURES.md` header is updated to match.
- **Recurrences, growth rates, Big-O:** the maths toolkit chapter in Data Structures (D1) is the beginner on-ramp; this book's chapter 1 goes deeper (Master theorem, substitution, log-log recurrences, floor/ceil).
- **Graph representation, BFS/DFS as traversals:** Data Structures chapter 13; this book adds DFS edge classes, topological sort, SCCs and the proofs.

## 4. Data findings in our question bank
| Question | Problem | Status |
|---|---|---|
| 2025_AN_Q41 | Printed `1 = i = n`; official page has `1 ≤ i ≤ n` (bitonic array) | **Fixed** (checked on the official page text) |
| 2021_FN_Q50 | Recurrence says `n > 0`; at n = 1, ⌈1/2⌉ = 1 so it never ends, so the paper probably meant n > 1 | **Open**: 2021 paper is image-only; check the page image. Key (Θ(n)) is supported by the tree argument either way |
| 2021_AN_Q55 | ChatGPT flags a wording issue | **Open**: check the page image |
| 11 questions | Their figures are not in the text (MST, BFS, DFS, hashing, DAG figures) | Check images when writing each lesson |
| Forge | 29 Forge questions counted, not provided in the review | Include in the next round |
| All records | No official paper link, session or key status | Add a `source` field |

Both reviewers re-solved the PYQs and agreed with the official keys except for the wording issues above.

## 5. The plan (chapters, lessons, tags)
Bank evidence (coarse, shared labels): asymptotics 19 q / 27 marks; graph traversals and shortest paths 14 / 25; searching, sorting, hashing 17 / 23; MST 13 / 23; DP 4 / 7; greedy and divide-and-conquer 6 / 9. Study priorities, not forecasts.

**0 · Foundations before algorithms** [MUST, Foundation] ~4 h. A0.1 what an algorithm is, input size, counting operations, correctness, loop invariants, edge cases; A0.2 the tools algorithms assume (arrays, recursion, logs, sums; links to Data Structures D1).

**1 · Asymptotics and recurrences** [MUST, High: 19 q] ~14 h. A1.1 counting work; A1.2 O, Ω, Θ, o, ω with formal constants; A1.3 comparing growth rates (ratio and limit reasoning, `n^log n`, `n^√n`, `log(n!)`); A1.4 space complexity and the recursion stack; A1.5 recurrences from code; A1.6 solving recurrences: recursion tree, substitution, Master theorem with its conditions, unequal subproblems, floor/ceil, `T(√n)` and log-log recurrences; loop analysis (`j += i` harmonic, `i = i/2`).

**2 · Searching and sorting** [MUST, High: 17 q with hashing] ~16 h. A2.1 linear and binary search, transition search, bitonic search; A2.2 insertion, selection, bubble (swap and comparison counts); A2.3 merge sort (trace, void merges, `n log n` proof); A2.4 quicksort (partition trace, worst case, randomised pivot probability); A2.5 heap sort, stability, in-place, adaptiveness [SHOULD]; A2.6 min-max (⌈3n/2⌉ − 2), selection, median of medians [SHOULD]; comparison-sort lower bound.

**3 · Hashing** [MUST/SHOULD] ~9 h (one owner). A3.1 tables and chaining (expected chain length, load factor); A3.2 open addressing: linear, quadratic, double hashing, tombstones; A3.3 universal hashing and adversarial keys [SHOULD]; dynamic and tree-organised hashing (2021 style) [SHOULD]. Formulas separated by scheme (chaining vs open addressing), as agreed in the Data Structures plan.

**4 · Divide and conquer** [MUST] ~6 h. A4.1 the pattern and its recurrence; A4.2 maximum subarray, recursive min-max; A4.3 selection and deterministic pivot [SHOULD].

**5 · Greedy** [MUST] ~7 h. A5.1 greedy choice and the proof (exchange argument); A5.2 activity selection; A5.3 fractional vs 0/1 knapsack (greedy fails on 0/1), Huffman coding (prefix codes, expected length).

**6 · Dynamic programming** [MUST] ~11 h. A6.1 recognising a DP problem (state, base case, transition, memoisation vs tabulation); A6.2 rod cutting (and counting optimal solutions); A6.3 matrix-chain multiplication; A6.4 LIS / LNDS and distance-to-sorted style problems; A6.5 evaluation order and table dependencies (row by row vs anti-diagonal).

**7 · Graph traversals** [MUST, High] ~12 h. A7.1 graph basics and representation costs in V and E; A7.2 BFS (distances, bipartite and diameter ideas, edge facts); A7.3 DFS: discovery and finish times, tree, back, forward and cross edges, which are possible in directed vs undirected graphs, cycle detection; A7.4 topological sort, SCCs, articulation points and bridges [SHOULD].

**8 · Minimum spanning trees** [MUST, High: 13 q] ~10 h. A8.1 spanning trees, cut and cycle properties, uniqueness when weights are distinct (and when they are not); A8.2 Kruskal with disjoint sets; A8.3 Prim, counting MSTs, effect of adding a constant to all weights, adding one edge to an MST. Distinct-weight statements need a proof template: they are the commonest MSQ trap.

**9 · Shortest paths** [MUST, High] ~11 h. A9.1 relaxation basics; A9.2 BFS for unweighted and DAG shortest paths (Θ(V + E)); A9.3 Dijkstra (and why negative edges break it); A9.4 Bellman–Ford, negative cycles, reweighting [SHOULD]; A9.5 Floyd–Warshall [SHOULD]; shortest path vs MST are different (the added-constant trap).

**10 · Previous-year practice** [MUST] ~6 h. Every PYQ by pattern, MCQ / MSQ / NAT.

## 5b. Additions from the complete Gemini review (checked against the official 2027 Algorithms line, which is unchanged)
- **Chapter 0 maths toolbox** gets named content: logarithm identities (`2^log n`, swap rule, Stirling for `log(n!)`), arithmetic, geometric, AGP and harmonic sums. These decide many chapter-1 questions.
- **Sorting depth:** the decision-tree lower bound Ω(n log n); **linear-time sorts (counting, radix, bucket) [SHOULD]**; stability and in-place table; adaptive insertion sort; inversions as swap count.
- **Divide and conquer / greedy / DP:** Strassen [SHOULD]; exchange arguments; Huffman tie-breaking by the stated rule; **LCS and 0/1 knapsack** added to DP (the bank has few DP questions, but they are standard); counting optimal solutions; valid 2-D table fill orders.
- **Graphs:** connected components = |V| − |E_F| for a DFS forest; the two-BFS tree-diameter trick; DFS parenthesis theorem; BFS-tree = DFS-tree facts; DAG DP; Johnson reweighting [SHOULD].
- **Scope note adopted:** P, NP and NP-completeness are **not** in the Algorithms line (official 2027 text confirms) nor in the 2017–2026 bank, so they stay out; the book says so, to save a 100-day student's time.
- **Weights (Gemini, adopted with the bank's caveat):** graph algorithms (chapters 7 to 9) carry about 42% of Algorithms marks in the bank, asymptotics and recurrences about 24%, searching/sorting/hashing about 20%; only 7 of 73 questions are Easy and 12 are Hard, so the maths toolbox and the MST theorem templates are the fastest early wins. These are bank statistics, not forecasts.

## 6. Other adopted points
- Every algorithm trace (Gantt-style tables for sorting passes, DP tables, Dijkstra, DFS times) comes from a program, shown with the new figure kinds (`array`, `tree`, `trace`, `frames`).
- Correctness proofs get fixed templates (loop invariant, exchange argument, cut property) rather than free prose.
- Tag the 73 PYQs one per chapter, as for P&DS; the bank's label "Graph Traversals & Single-Source Shortest Paths" mixes chapters 7 and 9.

## 7. Next steps
1. Tag the 73 PYQs by lesson; check the 11 figure questions and the two wording issues from the page images.
2. Add the `source` field; attach the 29 Forge questions.
3. Build sorting, DP-table, Dijkstra and DFS-time labs on the figure engine.
