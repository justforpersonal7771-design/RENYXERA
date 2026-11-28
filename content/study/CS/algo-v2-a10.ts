import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A10 "Previous-year patterns and mixed practice" (28 Nov 2026). Every one of the 73 Algorithms questions of 2017 to 2026 in the bank, grouped by the chapter that solves it,
 * the five patterns the paper uses, a method for each, and mixed practice across the book. Two worked examples that join chapters:
 * 2017 AN Q19 (match four algorithms with four time complexities), 2025 AN Q37 (add a constant to every weight: MSTs stay, shortest paths may change).
 */
export const chapterA10: Topic = {
  id: "cs.algo.v2.practice10",
  title: "Previous-year patterns and mixed practice",
  no: "A10",
  book: [
    { t: "p", text: "The bank holds 73 Algorithms questions from 2017 to 2026, 114 marks in all, 7.6 percent of the 1500 marks in the bank, roughly one mark in thirteen. Reading them as a set, rather than one at a time, shows that the paper uses a small number of patterns again and again. This last chapter lists every question under the chapter that solves it, names the patterns, gives a method for each, and ends with mixed questions that cross chapter boundaries." },
    { t: "p", text: "Use the chapter in two ways. **Before** you read the earlier chapters, skim the pattern list to see what the paper asks. **After** you finish them, use the table to find the questions of one chapter and solve them without looking at the worked answers, then check your answers against the book." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["name the pattern of any Algorithms question at a glance;", "apply the standard method for each pattern in the time the paper allows;", "list which questions belong to which chapter and which have figures;", "join ideas from different chapters in one answer."] },

    { t: "h2", text: "Where the marks are" },
    { t: "p", text: "Of the 73 questions, 19 are on asymptotics and recurrences, 11 on searching and sorting, 7 on hashing, 1 on divide and conquer proper, 4 on greedy methods, 4 on dynamic programming, 10 on graph traversals, 13 on spanning trees and 4 on shortest paths (the shortest-path and DAG questions together). Graph algorithms (traversals, spanning trees, shortest paths) therefore make up about 37 percent of the questions, asymptotics about 26 percent, and searching, sorting and hashing about 25 percent." },
    { t: "fig", id: "a10-f1" },
    { t: "p", text: "The weight by marks is slightly different from the weight by count, because spanning tree and graph questions are mostly two-mark. The practical lesson is the same: the graph chapters and the asymptotics chapter, together, carry two thirds of the subject, and the asymptotics chapter is the one that needs no theory beyond a few facts. If you have little time, do A1 first and the three graph chapters next." },
    { t: "p", text: "Only 7 of the 73 are easy and 16 are hard; the other 50 are of medium difficulty, which means they are solvable in a few minutes **if you know the right tool**. That is why this book teaches tools (the ladder, the Master theorem, the cut and cycle properties, DFS edge classes) rather than facts." },

    { t: "h2", text: "Every question, by chapter" },
    { t: "p", text: "The table gives the year, shift and question number of every Algorithms question in the bank. A question marked (fig) gives part of its data as a picture; the picture is in the app, and the method of the chapter applies to it." },
    { t: "table", head: ["Chapter", "Questions"], rows: [
      ["A1 Asymptotics and recurrences", "2026 FN Q17 · 2026 AN Q24, Q25 · 2025 FN Q20 · 2024 FN Q20, Q57 · 2023 FN Q29, Q54 · 2022 FN Q11 · 2021 FN Q50, Q61 · 2021 AN Q55 · 2020 FN Q34 · 2018 FN Q42, Q55 · 2017 FN Q21 · 2017 AN Q19, Q50, Q61"],
      ["A2 Searching and sorting", "2026 AN Q32, Q38 · 2025 FN Q33 · 2025 AN Q20, Q41 · 2021 FN Q25 (fig), Q30 · 2021 AN Q31 · 2019 FN Q31, Q61 · 2017 FN Q45"],
      ["A3 Hashing", "2026 FN Q24 · 2026 AN Q30 · 2025 FN Q65 · 2023 FN Q20 · 2022 FN Q16 · 2021 FN Q49 (fig) · 2020 FN Q28"],
      ["A4 Divide and conquer", "2019 FN Q14"],
      ["A5 Greedy", "2018 FN Q58 · 2021 AN Q57 · 2017 AN Q59 (fig) · 2017 FN Q30 (fig)"],
      ["A6 Dynamic programming", "2026 AN Q39 · 2024 AN Q11 · 2021 FN Q17 · 2018 FN Q41"],
      ["A7 Graph traversals", "2026 FN Q50 · 2025 AN Q29, Q59 (fig) · 2024 FN Q37, Q60 · 2021 FN Q39 · 2021 AN Q25, Q30 (fig) · 2018 FN Q40 · 2017 AN Q13 (fig)"],
      ["A8 Minimum spanning trees", "2026 FN Q49 · 2025 FN Q18, Q64 (fig) · 2025 AN Q37 · 2024 AN Q53 (fig) · 2022 FN Q49 · 2021 FN Q48 (fig) · 2021 AN Q64 · 2020 FN Q39, Q56 · 2019 FN Q44 · 2018 FN Q57 (fig) · 2017 FN Q48"],
      ["A9 Shortest paths", "2026 FN Q41 · 2026 AN Q37 · 2021 AN Q19 (fig) · 2020 FN Q57"],
    ], caption: "All 73 Algorithms questions of the bank, by chapter." },
    { t: "p", text: "Note that the Data Structures book covers a few related questions (heaps, hashing bridges, trees) and the Programming in C book covers recursion questions that look like recurrences; those are in their own tables." },

    { t: "h2", text: "The five patterns" },
    { t: "p", text: "Almost every question is one of five patterns. Naming the pattern is the first step, and takes seconds." },
    { t: "ol", items: [
      "**Rank or solve by growth:** order functions, solve a recurrence, find the complexity of a loop. Tools: the growth ladder; the logarithm trick for ties; the recursion tree; the Master theorem and its gaps; change of variable for √n; divide by an exponential for T(n − 1) + n2ⁿ.",
      "**Trace by hand:** run a sort, a hash insertion, Dijkstra, Kruskal, a DP table on a small input and read off a number. Tool: a neat table, one row per step, no skipping.",
      "**Count an operation:** swaps, comparisons, probes, merges, MSTs. Tools: inversions for swaps; ⌈log₂ of the number of outcomes⌉ for probes; n − 1 for a merge; 3⌈n/2⌉ − 2 for min and max; Kruskal by weight groups for MSTs.",
      "**True or false about a property:** which statements about MSTs, DFS edges, shortest paths or hash tables hold. Tools: the cut and cycle properties; DFS edge classes; relaxation; search for a three-vertex counterexample.",
      "**State the best algorithm or bound:** the fastest algorithm for a twisted problem (bitonic search, differences check, DAG shortest paths, median of medians). Tools: reduce to a known problem (binary search, DP, topological order), then argue both an upper bound and a lower bound ('every element must be read').",
    ] },
    { t: "fig", id: "a10-f2" },
    { t: "p", text: "For pattern 4, **the counterexample habit** saves the most time. A statement of the form 'for every graph, such and such' is refuted by one tiny graph; draw triangles, paths and stars before trying to prove anything. A statement that survives three small graphs is probably true, and then you look for the property (cut, cycle, parenthesis) that proves it." },
    { t: "callout", kind: "trap", title: "Trap: one example does not prove 'for every'", text: "A single graph on which a statement holds proves nothing about 'for every graph', while a single graph on which it fails refutes it. If your three-vertex tests all agree with the statement, you still need the property (cut, cycle, parenthesis) before you accept it." },
    { t: "ex", id: "a10-e1" },
    { t: "ex", id: "a10-e2" },

    { t: "p", text: "Read the **words** of the question as carefully as the numbers. 'Worst case' and 'expected' give different answers for quicksort and for hashing. 'Unique' or 'distinct' weights switch on the exact cut and cycle properties; without them only 'some MST' statements are safe. 'At most k edges' (Bellman–Ford rounds) and 'exactly k edges' are different. 'Θ' asks for a tight bound, while 'O' accepts any upper bound, and the options often include both a Θ and a weaker true O." },
    { t: "p", text: "Check **units of work**. A question about binary search may count comparisons, arithmetic operations or probes; they have the same order but different constants, so a NAT question needs the exact constant. A question about a sort may count swaps (inversions) or comparisons (n(n − 1)/2 for bubble sort), which differ. A question about a hash table may count probes or the final slot; the first needs the number of tries, the second the slot number." },
    { t: "h2", text: "Method for each kind of recurrence" },
    { t: "p", text: "Recurrences are the largest group, so here is the decision list in the order to try. **1. Shape T(n) = a·T(n/b) + f(n) with constant a, b:** compute n^(log_b a) and use the Master theorem; if f differs from it only by a log factor, use the extended case 2 or the tree. **2. Shape T(n) = T(αn) + T(βn) + cn:** add the fractions; below 1 gives Θ(n), exactly 1 gives Θ(n log n). **3. Shape T(n) = T(n − 1) + f(n):** unroll: the sum of f. If f contains 2ⁿ, divide through. **4. Shape T(n) = a·T(√n) + f(n):** write n = 2ᵐ; or, if there is a √n multiplier, divide by it first. **5. Coupled recurrences:** solve the inner one first and substitute." },
    { t: "p", text: "When the options contain **log log n**, the recurrence almost surely takes square roots: count the halvings of the exponent. When they contain **n^(log n)** or **2^√n**, take logarithms to compare. When an option has an **extra log** (n log n against n), that is the sign of case 2 or of a level-by-level equal cost." },

    { t: "h2", text: "Mixed practice" },
    { t: "p", text: "The questions below cross chapter boundaries; each needs two ideas from different parts of the book. Try them before reading the solutions in the check block." },
    { t: "ul", items: [
      "Merge sort calls a merge Θ(n) and a quicksort partition Θ(n). Why is one n log n in every case and the other n² in the worst case? (A2 and A1.)",
      "Kruskal sorts the edges with merge sort and uses union-find. What is its total cost on a dense graph with m = n²? (A8 and A1.)",
      "The Huffman algorithm uses a heap of n symbols and does n − 1 merges. What is its cost? (A5 and D10.)",
      "Dijkstra with an array on a graph with m = n²/2 edges costs Θ(n²); with a binary heap it costs Θ(m log n). Which is better here? (A9 and A1.)",
      "Why can Bellman–Ford detect a negative cycle but a BFS cannot even define one? (A9 and A7.)",
    ] },
    { t: "p", text: "The answers: (1) Merge sort always splits evenly, giving T(n) = 2T(n/2) + n; quicksort's split depends on the pivot and can be 0 and n − 1. (2) Sorting costs m log m = Θ(n² log n); union-find adds almost nothing; total Θ(n² log n). (3) A heap operation costs log n, so n − 1 merges cost Θ(n log n). (4) With m = Θ(n²) the array version costs Θ(n²) and the heap version Θ(n² log n): the array wins on a dense graph. (5) BFS counts edges and has no weights, so no cycle can be negative." },

    { t: "p", text: "Finally, a word on the **answer checks** you can run in the exam. For a NAT answer, test it on the smallest case (n = 2 or n = 3) if the formula allows. For an MCQ about growth rate, substitute a large number such as n = 2²⁰ and compare the options numerically. For a graph statement, draw the three-vertex case. None of these takes a minute, and each catches the common slips: an off-by-one in a loop bound, a swapped O and Ω, a forgotten wrap-round in a hash probe." },
    { t: "h2", text: "A study plan from here" },
    { t: "p", text: "A reasonable order for a first pass is: A1 (the tools), A2 (sorting), A7 (traversals), A8 (spanning trees), A9 (shortest paths), then A3, A5, A6 and A4. Do the Check questions at the end of each chapter before moving on, and mark those you got wrong. In a second pass, solve every question of this chapter's table for the chapters you have read, timing yourself: one-mark questions should take about two minutes and two-mark questions about four." },
    { t: "p", text: "The questions that give their data in a picture (the ones marked fig) are best practised on the real figures in the app: copy the graph or array onto paper, run the method, and compare with the answer. The skills are the same as for the text questions; only the first reading is different." },

    { t: "p", text: "The book ends here, but the practice does not. Return to the table once a week: pick four questions from a chapter you have read, solve them cold, and check the book only if you disagree with the answer in the app. A question you can solve twice, a week apart, is a question you will solve in the exam." },
    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["73 questions: asymptotics 19, sorting and searching 11, hashing 7, graphs (traversals 10, spanning trees 13, shortest paths 4) 27, greedy 4, dynamic programming 4, divide and conquer 1.", "Five patterns: rank or solve, trace by hand, count an operation, true or false about a property, state the best algorithm or bound.", "Recurrences: Master theorem (with log gaps), fractions that add to 1, unrolling, √n substitution, coupled recurrences.", "For true-or-false, build a three-vertex counterexample first; then look for the property that proves it.", "Time: about 2 minutes for a one-mark question, 4 for a two-mark question."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a10-f1", caption: "The 73 Algorithms questions of 2017 to 2026 by chapter. Graph algorithms (A7 to A9) together are the largest group, followed by asymptotics (A1) and searching, sorting and hashing (A2, A3).", alt: "A table with each chapter and the number of questions it has.", fig: { kind: "trace", title: "Questions per chapter", cols: ["chapter", "questions", "share"], rows: [
      { cells: ["A1 Asymptotics, recurrences", 19, "26%"], tone: "ok" }, { cells: ["A2 Searching, sorting", 11, "15%"] }, { cells: ["A3 Hashing", 7, "10%"] },
      { cells: ["A4 Divide and conquer", 1, "1%"] }, { cells: ["A5 Greedy", 4, "5%"] }, { cells: ["A6 Dynamic programming", 4, "5%"] },
      { cells: ["A7 Graph traversals", 10, "14%"] }, { cells: ["A8 Spanning trees", 13, "18%"], tone: "ok" }, { cells: ["A9 Shortest paths", 4, "5%"] },
    ] } },
    { type: "figure", id: "a10-f2", caption: "The five patterns and the first tool to reach for. Naming the pattern is the first step of every question.", alt: "A table of five question patterns with the tool for each.", fig: { kind: "trace", title: "Pattern and tool", cols: ["pattern", "first tool"], rows: [
      { cells: ["Rank or solve by growth", "ladder; logs; Master theorem; tree"] },
      { cells: ["Trace by hand", "a table, one row per step"] },
      { cells: ["Count an operation", "inversions; log₂ of outcomes; n − 1; Kruskal by weight group"] },
      { cells: ["True or false about a property", "counterexample on 3 vertices; cut and cycle; DFS edge classes"] },
      { cells: ["Best algorithm or bound", "reduce to a known problem; lower bound by 'every element must be read'"] },
    ] } },

    { type: "example", id: "a10-e1", level: "gate", title: "GATE CS 2017 (afternoon), Q19 · 1 mark · match algorithms with time complexities", file: "gate2017_an_q19.txt", given: `(P) Towers of Hanoi with n disks   (Q) Binary search on n sorted numbers   (R) Heap sort on n numbers, worst case   (S) Addition of two n×n matrices
(i) Θ(n²)   (ii) Θ(n log n)   (iii) Θ(2ⁿ)   (iv) Θ(log n)
A) P-iii, Q-iv, R-i, S-ii   B) P-iv, Q-iii, R-i, S-ii   C) P-iii, Q-iv, R-ii, S-i   D) P-iv, Q-iii, R-ii, S-i`, find: "The correct matching.", steps: [
      { say: "Towers of Hanoi: T(n) = 2T(n − 1) + 1, which doubles at each step: Θ(2ⁿ).", result: "P → iii" },
      { say: "Binary search halves the candidates: Θ(log n).", result: "Q → iv" },
      { say: "Heap sort: n sift-downs of cost log n: Θ(n log n) in every case.", result: "R → ii" },
      { say: "Adding two n × n matrices touches n² entries: Θ(n²).", result: "S → i" },
    ], answer: "C", check: "Each one is a result from an earlier chapter: A1 for Hanoi, A2 for the search and the sort." },
    { type: "example", id: "a10-e2", level: "gate", title: "GATE CS 2025 (afternoon), Q37 · 2 marks · add a constant to every edge weight", file: "gate2025_an_q37.txt", given: `G is an edge-weighted undirected graph with positive weights. A positive constant α is added to the weight of every edge. Which is TRUE about MSTs and shortest paths before and after?
A) Every MST remains an MST, and every SP remains an SP.
B) MSTs need not remain MSTs, and every SP remains an SP.
C) Every MST remains an MST, and SPs need not remain SPs.
D) MSTs need not remain MSTs, and SPs need not remain SPs.`, find: "The true statement.", steps: [
      { say: "Every spanning tree has n − 1 edges, so its weight rises by exactly (n − 1)α: all trees move together and the ranking is unchanged.", result: "MSTs stay MSTs" },
      { say: "A path with k edges rises by kα. Paths with different edge counts are re-ranked: s–a–t (1 + 1) against s–t (3) becomes 12 against 8 after α = 5.", result: "SPs may change" },
    ], answer: "C", check: "The programs in A8 and A9 show the same triangle." },

    { type: "gate", text: "This chapter ties together the questions of every earlier Algorithms chapter: 2017 AN Q19 and 2025 AN Q37 are solved above; the rest are solved in the chapters named in the table." },
    { type: "recall", cards: [
      { q: "How many Algorithms questions are in the bank (2017 to 2026)?", a: "73." },
      { q: "Which chapters carry the most questions?", a: "Graph algorithms (A7 to A9) and asymptotics (A1)." },
      { q: "The five patterns?", a: "Rank or solve, trace, count, true or false, best algorithm or bound." },
      { q: "Recurrence with options containing log log n?", a: "Square-root recurrence: count the halvings of the exponent." },
      { q: "Habit for 'for every graph' statements?", a: "Test on a three-vertex graph first." },
      { q: "Bound technique for 'best algorithm' questions?", a: "An algorithm for the upper bound; 'every element must be read' for the lower." },
      { q: "Dense graph: array or heap Dijkstra?", a: "Array: Θ(n²) against Θ(n² log n)." },
      { q: "Kruskal on a graph with m edges?", a: "Θ(m log m) = Θ(m log n)." },
      { q: "Time per mark in the paper?", a: "About two minutes per mark." },
    ] },
    { type: "check", questions: [
      { id: "a10c1", kind: "MCQ", marks: 1, q: "T(n) = 2T(n/2) + n log n is", options: ["Θ(n log n)", "Θ(n log² n)", "Θ(n²)", "Θ(n)"], answer: "B", solution: "Extended case 2 with k = 1: Θ(n log² n)." },
      { id: "a10c2", kind: "NAT", marks: 1, q: "Huffman coding of frequencies 1, 1, 2, 4: the sum of the internal node weights?", answer: "14", solution: "Merge 1 and 1 to get 2; merge 2 and 2 to get 4; merge 4 and 4 to get 8. The internal weights are 2 + 4 + 8 = 14." },
      { id: "a10c3", kind: "MSQ", marks: 2, q: "Which are Θ(n log n) in the worst case?", options: ["Merge sort", "Heap sort", "Quicksort with a last-element pivot", "Kruskal on a graph with m = n² edges (in terms of n)"], answer: "A, B", solution: "Quicksort is Θ(n²). Kruskal there is Θ(n² log n), which is not n log n in terms of n." },
      { id: "a10c4", kind: "NAT", marks: 2, q: "A DFS forest of an undirected graph with 30 vertices has 24 edges. The number of components?", answer: "6", solution: "30 − 24 = 6." },
      { id: "a10c5", kind: "MCQ", marks: 2, q: "Edge weights are distinct and positive. Which statement is not necessarily true?", options: ["The MST is unique", "The heaviest edge of a cycle is in no MST", "The lightest edge at a vertex is in every MST", "The shortest path between two vertices is unique"], answer: "D", solution: "1 + 4 = 2 + 3 gives two shortest paths of equal weight." },
      { id: "a10c6", kind: "NAT", marks: 2, q: "T(n) = T(n/2) + T(n/3) + n. If T(n) = c·n, what is c?", answer: "6", solution: "c = c/2 + c/3 + 1 gives c/6 = 1, so c = 6." },
      { id: "a10c7", kind: "MCQ", marks: 2, q: "For a connected graph with 100 vertices and 5000 edges, the best single-source shortest-path algorithm with non-negative weights has running time", options: ["The array version is better here", "The binary-heap version is better here", "They take exactly the same time", "Neither can be used"], answer: "A", solution: "Dense graph: 10⁴ steps for the array against about 3.3 × 10⁴ for the heap, so the array is better." },
      { id: "a10c8", kind: "NAT", marks: 2, q: "Linear probing, m = 8, h(k) = k mod 8. Keys 3, 11, 19, 27 are inserted in that order. In which slot does 27 go?", answer: "6", solution: "3 → 3; 11 → 3 taken, 4; 19 → 3, 4 taken, 5; 27 → 3, 4, 5 taken, 6." },
    ] },
    { type: "practice", links: [{ label: "All Algorithms questions", sub: "Algorithms", href: "/topics/algorithms" }, { label: "The Algorithms book", sub: "back to the contents", href: "/study/asymptotics" }] },
    { type: "links", prereq: ["A1 to A9"], usedIn: ["Revision before the exam"], cross: ["Data Structures: previous-year patterns (D16)"] },
  ],
};
