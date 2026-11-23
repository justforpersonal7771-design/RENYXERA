# Review input: Algorithms, chapter 07: Graph traversals

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-07-graph-traversals.md` and `gemini-07-graph-traversals.md` in this folder.

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

This is **one chapter** (7 of 9) of the Algorithms book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Graph traversals**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (14)

**2026_AN_Q37** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Let \( G \) be a weighted directed acyclic graph with \( m \) edges and \( n \) vertices. Given \( G \) and a source vertex \( s \) in \( G \), which one of the following options gives the worst case time complexity of the fastest algorithm to find the lengths of shortest paths from \( s \) to all vertices that are reachable from \( s \) in \( G \)?

- A) \( \theta(m + n) \)  ✔ official
- B) \( \theta(m + n \log(n)) \)
- C) \( \theta(nm) \)
- D) \( \theta(n^3) \)

---

**2026_FN_Q41** · 2026-FN · MCQ · 2 marks · Hard · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Let \( G(V, E) \) be an undirected, edge-weighted graph with integer weights. The weight of a path is the sum of the weights of the edges in that path. The length of a path is the number of edges in that path.
Let \( s \in V \) be a vertex in \( G \). For every \( u \in V \) and for every \( k \ge 0 \), let \( d_k(u) \) denote the weight of a shortest path (in terms of weight) from \( s \) to \( u \) of length at most \( k \). If there is no path from \( s \) to \( u \) of length at most \( k \), then \( d_k(u) = \infty \).
Consider the statements:
S1: For every \( k \ge 0 \) and \( u \in V \), \( d_{k+1}(u) \le d_k(u) \).
S2: For every \( (u, v) \in E \), if \( (u, v) \) is part of a shortest path (in terms of weight) from \( s \) to \( v \), then for every \( k \ge 0 \), \( d_k(u) \le d_k(v) \).
Which one of the following options is correct?

- A) Only S1 is true  ✔ official
- B) Only S2 is true
- C) Both S1 and S2 are true
- D) Neither S1 nor S2 is true

---

**2026_FN_Q50** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Consider the following pseudocode for depth-first search (DFS) algorithm which takes a directed graph \( G(V, E) \) as input, where \( d[v] \) and \( f[v] \) are the discovery time and finishing time, respectively, of the vertex \( v \in V \).
```
DFS(G):
  unmark all v ∈ V
  t ← 0
  for each v ∈ V
    if v is unmarked
      t ← Explore(G, v, t)
    end if
  end for

Explore(G, v, t):
  mark v
  t ← t + 1
  d[v] ← t
  for each (v, w) ∈ E
    if w is unmarked
      t ← Explore(G, w, t)
    end if
  end for
  t ← t + 1
  f[v] ← t
  return t
```
Suppose that the input directed graph \( G(V, E) \) is a directed acyclic graph (DAG). For an edge \( (u, v) \in E \), which of the following options will NEVER be correct?

- A) \( d[u] < d[v] < f[v] < f[u] \)
- B) \( d[v] < d[u] < f[u] < f[v] \)  ✔ official
- C) \( d[v] < f[v] < d[u] < f[u] \)
- D) \( d[u] < d[v] < f[u] < f[v] \)  ✔ official

---

**2025_AN_Q29** · 2025-AN · MSQ · 1 mark · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Which of the following statements regarding Breadth First Search (BFS) and Depth First Search (DFS) on an undirected simple graph G is/are TRUE?

- A) A DFS tree of \( G \) is a Shortest Path tree of \( G \).
- B) Every non-tree edge of \( G \) with respect to a DFS tree is a forward/back edge.  ✔ official
- C) If \( (u, v) \) is a non-tree edge of \( G \) with respect to a BFS tree, then the distances from the source vertex \( s \) to \( u \) and \( v \) in the BFS tree are within \( \pm 1 \) of each other.  ✔ official
- D) Both BFS and DFS can be used to find the connected components of \( G \).  ✔ official

---

**2025_AN_Q59** · 2025-AN · NAT · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths · HAS A FIGURE (not shown here)

Consider the following algorithm `someAlgo` that takes an undirected graph G as input.
`someAlgo(G)`
1. Let \( v \) be any vertex in \( G \). Run BFS on \( G \) starting at \( v \). Let \( u \) be a vertex in \( G \) at maximum distance from \( v \) as given by the BFS.
2. Run BFS on \( G \) again with \( u \) as the starting vertex. Let \( z \) be the vertex at maximum distance from \( u \) as given by the BFS.
3. Output the distance between \( u \) and \( z \) in \( G \).
The output of `someAlgo(T)` for the tree shown in the given figure is ________. (Answer in integer)
[IMAGE_Q_59_1]

Official answer (numeric): 6 to 6

---

**2024_FN_Q60** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Let \( G \) be a directed graph and \( T \) a depth first search (DFS) spanning tree in \( G \) that is rooted at a vertex \( v \). Suppose \( T \) is also a breadth first search (BFS) tree in \( G \), rooted at \( v \). Which of the following statements is/are TRUE for every such graph \( G \) and tree \( T \)?

- A) There are no back-edges in \( G \) with respect to the tree \( T \).
- B) There are no cross-edges in \( G \) with respect to the tree \( T \).
- C) There are no forward-edges in \( G \) with respect to the tree \( T \).  ✔ official
- D) The only edges in \( G \) are the edges in \( T \).

---

**2024_FN_Q37** · 2024-FN · NAT · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

The number of edges present in the forest generated by the DFS traversal of an undirected graph \( G \) with 100 vertices is 40. The number of connected components in \( G \) is ________.

Official answer (numeric): 60 to 60

---

**2021_AN_Q25** · 2021-AN · NAT · 1 mark · Easy · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Consider a complete binary tree with 7 nodes. Let \(A\) denote the set of first 3 elements obtained by performing Breadth-First Search (BFS) starting from the root. Let \(B\) denote the set of first 3 elements obtained by performing Depth-First Search (DFS) starting from the root. The value of \(|A - B|\) is _________.

Official answer (numeric): 1 to 1

---

**2021_FN_Q39** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

An articulation point in a connected graph is a vertex such that removing the vertex and its incident edges disconnects the graph into two or more connected components.
Let \(T\) be a DFS tree obtained by doing DFS in a connected undirected graph \(G\).
Which of the following options is/are correct?

- A) Root of \(T\) can never be an articulation point in \(G\).
- B) Root of \(T\) is an articulation point in \(G\) if and only if it has 2 or more children.  ✔ official
- C) A leaf of \(T\) can be an articulation point in \(G\).
- D) If \(u\) is an articulation point in \(G\) such that \(x\) is an ancestor of \(u\) in \(T\) and \(y\) is a descendent of \(u\) in \(T\), then all paths from \(x\) to \(y\) in \(G\) must pass through \(u\).

---

**2021_AN_Q30** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths · HAS A FIGURE (not shown here)

Consider the following directed graph:

[IMAGE_Q_30_1]

Which of the following is/are correct about the graph?

- A) The graph does not have a topological order.  ✔ official
- B) A depth-first traversal starting at vertex \(S\) classifies three directed edges as back edges.  ✔ official
- C) The graph does not have a strongly connected component.
- D) For each pair of vertices \(u\) and \(v\), there is a directed path from \(u\) to \(v\).

---

**2021_AN_Q19** · 2021-AN · NAT · 2 marks · Hard · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths · HAS A FIGURE (not shown here)

In a directed acyclic graph with a source vertex \(s\), the quality-score of a directed path is defined to be the product of the weights of the edges on the path. Further, for a vertex \(v\) other than \(s\), the quality-score of \(v\) is defined to be the maximum among the quality-scores of all the paths from \(s\) to \(v\). The quality-score of \(s\) is assumed to be 1.

[IMAGE_Q_19_1]

The sum of the quality-scores of all the vertices in the graph shown above is _________.

Official answer (numeric): 929 to 929

---

**2020_FN_Q57** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Let \( G = (V, E) \) be a directed, weighted graph with weight function \( w : E \rightarrow \mathbb{R} \). For some function \( f : V \rightarrow \mathbb{R} \), for each edge \( (u, v) \in E \), define \( w'(u, v) \) as \( w(u, v) + f(u) - f(v) \).
Which one of the options completes the following sentence so that it is TRUE?
"The shortest paths in G under w are shortest paths under w' too, ________".

- A) for every \( f : V \rightarrow \mathbb{R} \)  ✔ official
- B) if and only if \( \forall u \in V, f(u) \) is positive
- C) if and only if \( \forall u \in V, f(u) \) is negative
- D) if and only if \( f(u) \) is the distance from \( s \) to \( u \) in the graph obtained by adding a new vertex \( s \) to \( G \) and edges of zero weight from \( s \) to every vertex of \( G \)

---

**2018_FN_Q40** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Let \(G\) be a simple undirected graph. Let \(T_D\) be a depth first search tree of \(G\). Let \(T_B\) be a breadth first search tree of \(G\). Consider the following statements.
(I) No edge of \(G\) is a cross edge with respect to \(T_D\). (A cross edge in \(G\) is between two nodes neither of which is an ancestor of the other in \(T_D\).)
(II) For every edge \((u,v)\) of \(G\), if \(u\) is at depth \(i\) and \(v\) is at depth \(j\) in \(T_B\), then \(|i - j| = 1\).
Which of the statements above must necessarily be true?

- A) I only  ✔ official
- B) II only
- C) Both I and II
- D) Neither I nor II

---

**2017_AN_Q13** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths · HAS A FIGURE (not shown here)

The Breadth First Search (BFS) algorithm has been implemented using the queue data structure. Which one of the following is a possible order of visiting the nodes in the graph below?
[IMAGE_Q_13]

- A) MNOPQR
- B) NQMPOR
- C) QMNROP
- D) POQNMR  ✔ official

