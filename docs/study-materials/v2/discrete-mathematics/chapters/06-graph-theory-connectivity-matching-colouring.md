# Review input: Discrete Mathematics, chapter 06: Graph theory: connectivity, matching, colouring

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-06-graph-theory-connectivity-matching-colouring.md` and `gemini-06-graph-theory-connectivity-matching-colouring.md` in this folder.

*Note: chapters are matched to PYQs by the words in their titles, so a question can appear in more than one chapter. Say which chapter it really belongs to.*

---

## PART A. REVIEWER INSTRUCTIONS

```
YOU ARE NOT AN EXPERT. YOU ARE THIS STUDENT:
You are 25 years old. You sat at the back of the class. You failed GATE twice and have plenty of backlogs. You studied
Programming and Data Structures (and the other subjects) in college only to pass, copied the assignments, and
remember almost nothing. You are ashamed of that, you do not want to ask, and you are now preparing again with
about 100 days left. You have read Made Easy notes, Unacademy PDFs and GateWallah books and they left you confused:
they use words they never explain, jump steps and show few pictures. You will only believe a book that is teaching
you from the very beginning.

I will give you a document. Read it as this student. Do NOT be polite and do NOT be an expert reviewer who nods.
Stop at every place where this student would get stuck. Then answer in the four parts below.

PART 1. FEELINGS (10 lines)
 How did you feel reading it? Where did you feel lost, bored, scared, or tricked? Where did you feel "I can do this"?
 Would you pay Rs 149 per subject book for this? Yes or no, and the real reason.

PART 2. GAP TABLE (the main part; at least 40 rows if the document is a plan, 15 if it is one topic)
 | # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
 Type is one of: MISSING-PREREQUISITE, UNEXPLAINED-WORD, STEP-SKIPPED, NEEDS-DIAGRAM, NEEDS-EXAMPLE, NEEDS-TRACE,
 MISSING-GATE-CONCEPT, MISSING-FINER-POINT, WRONG-ORDER, TOO-HARD-TOO-EARLY, TOO-LONG-BORING, UNCLEAR-ENGLISH, FACT-DOUBT.
 Priority is HIGH / MEDIUM / LOW.

PART 3. WHAT A COMPLETE SUBJECT MUST HAVE
 From your knowledge of GATE (previous-year papers, Made Easy, Unacademy, GateWallah, standard university textbooks,
 NPTEL), list every chapter, topic and finer sub-topic that this subject has but the document does NOT cover, with:
 the syllabus line it serves, how often GATE asks it (if you really know; otherwise say "not sure"), the typical
 question type, and the prerequisite a zero-level student needs first.

PART 4. THE DIAGRAMS I NEED
 List every diagram this student needs to SEE in order to understand each chapter. For each: what to draw, what the
 student should notice, and whether it should be a single picture, a step-by-step series of pictures, or a trace table.

RULES FOR YOU
 - Do not invent GATE years, question numbers or statistics. If you are not sure, write "not sure".
 - Do not just praise. If you find fewer than 40 problems in a long plan, you read too fast; read again.
 - Say it in simple English.
 - If a fact in the document looks wrong, say exactly which and why (FACT-DOUBT).

This is **one chapter** (6 of 8) of the Discrete Mathematics book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

In addition to Parts 1 to 4 of the instructions above, answer these chapter-specific parts:

PART 5. THE FULL LESSON PLAN FOR THIS CHAPTER
 Propose the complete list of lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with a reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind + what it shows); hand traces; common mistakes.

PART 6. THE PYQs BELOW
 For EACH previous-year question listed below: (a) which lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree, show the working and say "FACT-DOUBT"), (e) whether the question text looks mis-transcribed.

PART 7. MORE QUESTIONS
 For each lesson, list the question types GATE could ask that are NOT covered by the PYQs below (give 3 ideas each, one line each).

PART 8. WHAT IS MISSING FROM THIS CHAPTER'S SCOPE
 Topics GATE has asked (or could ask) about this chapter that the draft chapter list does not cover.
```

---

## PART B. THE CHAPTER

## Chapter details

Existing chapter in the app: **Graph theory: connectivity, matching, colouring**. Written lessons today: 6 topics ready.



## The PYQs for this chapter (24)

**2026_AN_Q36** · 2026-AN · MCQ · 2 marks · Hard · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Consider a complete graph \( K_n \) with \( n \) vertices (\( n > 4 \)). Note that multiple spanning trees can be constructed over \( K_n \). Each of these spanning trees is represented as a set of edges. The Jaccard coefficient between any two sets is defined as the ratio of the size of the intersection of the two sets to the size of the union of the two sets.
Which one of the following options gives the lowest possible value for the Jaccard coefficient between any two spanning trees of \( K_n \)?

- A) \( \frac{1}{n} \)
- B) \( \frac{1}{2n - 3} \)
- C) 0  ✔ official
- D) \( \frac{1}{n - 1} \)

---

**2026_FN_Q47** · 2026-FN · MSQ · 2 marks · Hard · bank topic: Advanced Graph Bounds (Matching, Coloring Theorems)

Let \( G(V, E) \) be a simple, undirected graph. A vertex cover of \( G \) is a subset \( V' \subseteq V \) such that for every \( (u, v) \in E \), \( u \in V' \) or \( v \in V' \). Let the size of the smallest vertex cover in \( G \) be \( k \). Let \( S \) be any vertex cover of size \( k \).
For a vertex \( v \in V \), which of the following constraints will always ensure that \( v \in S \)?

- A) The degree of \( v \) is at least \( k + 1 \)  ✔ official
- B) The vertex \( v \) is on a path of length \( k + 1 \)
- C) The vertex \( v \) is on a cycle of length \( k + 1 \)
- D) The vertex \( v \) is a part of a clique of size \( k \)

---

**2026_FN_Q55** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

An undirected, unweighted, simple graph \( G(V, E) \) is said to be 2-colorable if there exists a function \( c : V \rightarrow \{0, 1\} \) such that for every \( (u, v) \in E \), \( c(u) \neq c(v) \).
Which of the following statements about 2-colorable graphs is/are true?

- A) If \( G \) is 2-colorable, then \( G \) may contain cycles of odd length
- B) If \( G \) is 2-colorable, then \( G \) may contain cycles of even length  ✔ official
- C) An optimal algorithm for testing whether \( G \) is 2-colorable runs in time \( \theta(|V| + |E|) \), if \( G \) is represented as an adjacency list  ✔ official
- D) An optimal algorithm for testing whether \( G \) is 2-colorable runs in time \( \theta(|E| \log |V|) \), if \( G \) is represented as an adjacency list

---

**2025_FN_Q43** · 2025-FN · MCQ · 2 marks · Hard · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Let \( G(V, E) \) be an undirected and unweighted graph with 100 vertices. Let \( d(u, v) \) denote the number of edges in a shortest path between vertices \( u \) and \( v \) in \( V \). Let the maximum value of \( d(u, v) \), \( u, v \in V \) such that \( u \neq v \), be 30. Let \( T \) be any breadth-first-search tree of \( G \). Which ONE of the given options is CORRECT for every such graph \( G \)?

- A) The height of \( T \) is exactly 15.
- B) The height of \( T \) is exactly 30.
- C) The height of \( T \) is at least 15.  ✔ official
- D) The height of \( T \) is at least 30.

---

**2024_AN_Q15** · 2024-AN · MCQ · 1 mark · Medium · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Let \( A \) be the adjacency matrix of a simple undirected graph \( G \). Suppose \( A \) is its own inverse. Which one of the following statements is always TRUE?

- A) \( G \) is a cycle
- B) \( G \) is a perfect matching  ✔ official
- C) \( G \) is a complete graph
- D) There is no such graph \( G \)

---

**2024_FN_Q31** · 2024-FN · NAT · 1 mark · Easy · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

The number of spanning trees in a complete graph of 4 vertices labelled \( A, B, C, \) and \( D \) is ________.

Official answer (numeric): 16 to 16

---

**2024_FN_Q59** · 2024-FN · MSQ · 2 marks · Hard · bank topic: Advanced Graph Bounds (Matching, Coloring Theorems)

The chromatic number of a graph is the minimum number of colours used in a proper colouring of the graph. Let \( G \) be any graph with \( n \) vertices and chromatic number \( k \). Which of the following statements is/are always TRUE?

- A) \( G \) contains a complete subgraph with \( k \) vertices
- B) \( G \) contains an independent set of size at least \( \frac{n}{k} \).  ✔ official
- C) \( G \) contains at least \( \frac{k(k - 1)}{2} \) edges  ✔ official
- D) \( G \) contains a vertex of degree at least \( k \).

---

**2024_AN_Q37** · 2024-AN · MSQ · 2 marks · Hard · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Let \( G \) be an undirected connected graph in which every edge has a positive integer weight. Suppose that every spanning tree in \( G \) has even weight. Which of the following statements is/are TRUE for every such graph \( G \)?

- A) All edges in \( G \) have even weight.
- B) All edges in \( G \) have even weight OR all edges in \( G \) have odd weight.
- C) In each cycle \( C \) in \( G \), all edges in \( C \) have even weight.
- D) In each cycle \( C \) in \( G \), either all edges in \( C \) have even weight OR all edges in \( C \) have odd weight  ✔ official

---

**2024_AN_Q63** · 2024-AN · NAT · 2 marks · Medium · bank topic: Advanced Graph Bounds (Matching, Coloring Theorems) · HAS A FIGURE (not shown here)

The chromatic number of a graph is the minimum number of colours used in a proper colouring of the graph. The chromatic number of the following graph is ________.
[IMAGE_Q_63_1]

Official answer (numeric): 2 to 2

---

**2023_FN_Q55** · 2023-FN · MSQ · 2 marks · Medium · bank topic: Advanced Graph Bounds (Matching, Coloring Theorems)

Let \(G\) be a simple, finite, undirected graph with vertex set \(\{v_1, \dots, v_n\}\). Let \(\Delta(G)\) denote the maximum degree of \(G\) and let \(N = \{1, 2, \dots\}\) denote the set of all possible colors.
Color the vertices of \(G\) using the following greedy strategy:
```
for i = 1, ..., n
    color(v_i) <- min{j \in N : no neighbour of v_i is colored j}
```
Which of the following statements is/are TRUE?

- A) This procedure results in a proper vertex coloring of \(G\).  ✔ official
- B) The number of colors used is at most \(\Delta(G) + 1\).  ✔ official
- C) The number of colors used is at most \(\Delta(G)\).
- D) The number of colors used is equal to the chromatic number of \(G\).

---

**2023_FN_Q56** · 2023-FN · NAT · 2 marks · Hard · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Let \(U = \{1, 2, 3\}\). Let \(2^U\) denote the powerset of \(U\). Consider an undirected graph \(G\) whose vertex set is \(2^U\). For any \(A, B \in 2^U\), \((A, B)\) is an edge in \(G\) if and only if (i) \(A \neq B\), and (ii) either \(A \subset B\) or \(B \subset A\). For any vertex \(A\) in \(G\), the set of all possible orderings in which the vertices of \(G\) can be visited in a Breadth First Search (BFS) starting from \(A\) is denoted by \(B(A)\).
If \(\phi\) denotes the empty set, then the cardinality of \(B(\phi)\) is ________.

Official answer (numeric): 5040 to 5040

---

**2022_FN_Q30** · 2022-FN · NAT · 1 mark · Medium · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Consider a simple undirected graph of 10 vertices. If the graph is disconnected, then the maximum number of edges it can have is __________.

Official answer (numeric): 36 to 36

---

**2022_FN_Q37** · 2022-FN · MCQ · 2 marks · Hard · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Consider a simple undirected unweighted graph with at least three vertices. If \(A\) is the adjacency matrix of the graph, then the number of 3-cycles in the graph is given by the trace of

- A) \(A^3\)
- B) \(A^3\) divided by 2
- C) \(A^3\) divided by 3
- D) \(A^3\) divided by 6  ✔ official

---

**2022_FN_Q50** · 2022-FN · MSQ · 2 marks · Medium · bank topic: Advanced Graph Bounds (Matching, Coloring Theorems) · HAS A FIGURE (not shown here)

The following simple undirected graph is referred to as the Peterson graph.

[IMAGE_Q_50_1]

Which of the following statements is/are TRUE?

- A) The chromatic number of the graph is 3.  ✔ official
- B) The graph has a Hamiltonian path.  ✔ official
- C) The following graph is isomorphic to the Peterson graph. [IMAGE_Q_50_C]  ✔ official
- D) The size of the largest independent set of the given graph is 3. (A subset of vertices of a graph form an independent set if no two vertices of the subset are adjacent.)

---

**2022_FN_Q52** · 2022-FN · MSQ · 2 marks · Medium · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Which of the properties hold for the adjacency matrix \(A\) of a simple undirected unweighted graph having \(n\) vertices?

- A) The diagonal entries of \(A^2\) are the degrees of the vertices of the graph.  ✔ official
- B) If the graph is connected, then none of the entries of \(A^{n-1} + I_n\) can be zero.
- C) If the sum of all the elements of \(A\) is at most \(2(n - 1)\), then the graph must be acyclic.
- D) If there is at least a 1 in each of \(A\)'s rows and columns, then the graph must be connected.

---

**2022_FN_Q58** · 2022-FN · NAT · 2 marks · Hard · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Let \(G(V, E)\) be a directed graph, where \(V = \{1, 2, 3, 4, 5\}\) is the set of vertices and \(E\) is the set of directed edges, as defined by the following adjacency matrix \(A\).
$$ A[i][j] = \begin{cases} 1, & 1 \leq j \leq i \leq 5 \\ 0, & \text{otherwise} \end{cases} $$
\(A[i][j] = 1\) indicates a directed edge from node \(i\) to node \(j\). A directed spanning tree of \(G\), rooted at \(r \in V\), is defined as a subgraph \(T\) of \(G\) such that the undirected version of \(T\) is a tree, and \(T\) contains a directed path from \(r\) to every other vertex in \(V\). The number of such directed spanning trees rooted at vertex 5 is ___________.

Official answer (numeric): 24 to 24

---

**2021_FN_Q24** · 2021-FN · NAT · 1 mark · Easy · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

In an undirected connected planar graph \(G\), there are eight vertices and five faces. The number of edges in \(G\) is _________.

Official answer (numeric): 11 to 11

---

**2021_FN_Q35** · 2021-FN · MCQ · 2 marks · Hard · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Let \(G = (V, E)\) be an undirected unweighted connected graph. The diameter of \(G\) is defined as
$$ \text{diam}(G) = \max_{u,v \in V} \{\text{the length of shortest path between } u \text{ and } v\} $$
Let \(M\) be the adjacency matrix of \(G\).
Define graph \(G_2\) on the same set of vertices with adjacency matrix \(N\), where
$$ N_{ij} = \begin{cases} 1 & \text{if } M_{ij} > 0 \text{ or } P_{ij} > 0, \text{ where } P = M^2 \\ 0 & \text{Otherwise} \end{cases} $$
Which one of the following statements is true?

- A) \(\text{diam}(G_2) \leq \lceil \text{diam}(G)/2 \rceil\)  ✔ official
- B) \(\lceil \text{diam}(G)/2 \rceil < \text{diam}(G_2) < \text{diam}(G)\)
- C) \(\text{diam}(G_2) = \text{diam}(G)\)
- D) \(\text{diam}(G) < \text{diam}(G_2) \leq 2 \text{ diam}(G)\)

---

**2020_FN_Q53** · 2020-FN · NAT · 2 marks · Medium · bank topic: Advanced Graph Bounds (Matching, Coloring Theorems)

Graph \( G \) is obtained by adding vertex \( s \) to \( K_{3, 4} \) and making \( s \) adjacent to every vertex of \( K_{3, 4} \). The minimum number of colours required to edge-colour \( G \) is ________.

Official answer (numeric): 7 to 7

---

**2019_FN_Q12** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Let \( G \) be an undirected complete graph on \( n \) vertices, where \( n > 2 \). Then, the number of different Hamiltonian cycles in \( G \) is equal to

- A) \( n! \)
- B) \( (n - 1)! \)
- C) 1  ✔ official
- D) \( \frac{(n - 1)!}{2} \)  ✔ official

---

**2018_FN_Q28** · 2018-FN · NAT · 1 mark · Easy · bank topic: Advanced Graph Bounds (Matching, Coloring Theorems) · HAS A FIGURE (not shown here)

The chromatic number of the following graph is _______.
[IMAGE_Q_28]

Official answer (numeric): 3 to 3

---

**2018_FN_Q53** · 2018-FN · NAT · 2 marks · Hard · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Let \(G\) be a graph with 100! vertices, with each vertex labelled by a distinct permutation of the numbers 1,2, ..., 100. There is an edge between vertices \(u\) and \(v\) if and only if the label of \(u\) can be obtained by swapping two adjacent numbers in the label of \(v\). Let \(y\) denote the degree of a vertex in \(G\), and \(z\) denote the number of connected components in \(G\).
Then, \(y + 10z =\) _____.

Official answer (numeric): 109 to 109

---

**2017_FN_Q19** · 2017-FN · NAT · 1 mark · Easy · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

Let \(T\) be a tree with 10 vertices. The sum of the degrees of all the vertices in \(T\) is ________.

Official answer (numeric): 18.0 to 18.0

---

**2017_AN_Q16** · 2017-AN · NAT · 1 mark · Medium · bank topic: Graph Theory (Connectivity, Paths, Cycles, Trees)

\(G\) is an undirected graph with \(n\) vertices and 25 edges such that each vertex of \(G\) has degree at least 3. Then the maximum possible value of \(n\) is ________.

Official answer (numeric): 16.0 to 16.0

