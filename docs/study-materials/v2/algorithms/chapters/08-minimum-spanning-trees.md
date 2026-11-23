# Review input: Algorithms, chapter 08: Minimum spanning trees

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-08-minimum-spanning-trees.md` and `gemini-08-minimum-spanning-trees.md` in this folder.

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

This is **one chapter** (8 of 9) of the Algorithms book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Minimum spanning trees**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (13)

**2026_FN_Q49** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \( G(V, E) \) be a simple, undirected, edge-weighted graph with unique edge weights. Which of the following statements about the minimum spanning trees (MST) of \( G \) is/are true?

- A) In every cycle \( C \) of \( G \), the edge with the largest weight in \( C \) is not in any MST  ✔ official
- B) In every cycle \( C \) of \( G \), the edge with the smallest weight in \( C \) is in every MST
- C) For every vertex \( v \in V \), the edge with the largest weight incident on \( v \) is not in any MST
- D) For every vertex \( v \in V \), the edge with the smallest weight incident on \( v \) is in every MST  ✔ official

---

**2025_FN_Q18** · 2025-FN · MCQ · 1 mark · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \( G \) be any undirected graph with positive edge weights, and \( T \) be a minimum spanning tree of \( G \). For any two vertices, \( u \) and \( v \), let \( d_1(u, v) \) and \( d_2(u, v) \) be the shortest distances between \( u \) and \( v \) in \( G \) and \( T \), respectively. Which ONE of the options is CORRECT for all possible \( G \), \( T \), \( u \) and \( v \)?

- A) \( d_1(u, v) = d_2(u, v) \)
- B) \( d_1(u, v) \le d_2(u, v) \)  ✔ official
- C) \( d_1(u, v) \ge d_2(u, v) \)
- D) \( d_1(u, v) \neq d_2(u, v) \)

---

**2025_AN_Q37** · 2025-AN · MCQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \( G \) be an edge-weighted undirected graph with positive edge weights. Suppose a positive constant \( \alpha \) is added to the weight of every edge.
Which ONE of the following statements is TRUE about the minimum spanning trees (MSTs) and shortest paths (SPs) in \( G \) before and after the edge weight update?

- A) Every MST remains an MST, and every SP remains an SP.
- B) MSTs need not remain MSTs, and every SP remains an SP.
- C) Every MST remains an MST, and SPs need not remain SPs.  ✔ official
- D) MSTs need not remain MSTs, and SPs need not remain SPs.

---

**2025_FN_Q64** · 2025-FN · NAT · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms) · HAS A FIGURE (not shown here)

The maximum value of \( x \) such that the edge between the nodes B and C is included in every minimum spanning tree of the given graph is ________. (Answer in integer)
[IMAGE_Q_64_1]

Official answer (numeric): 5 to 5

---

**2024_AN_Q53** · 2024-AN · NAT · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms) · HAS A FIGURE (not shown here)

The number of distinct minimum-weight spanning trees of the following graph is ________.
[IMAGE_Q_53_1]

Official answer (numeric): 9 to 9

---

**2022_FN_Q49** · 2022-FN · MSQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Consider a simple undirected weighted graph \(G\), all of whose edge weights are distinct. Which of the following statements about the minimum spanning trees of \(G\) is/are TRUE?

- A) The edge with the second smallest weight is always part of any minimum spanning tree of \(G\).  ✔ official
- B) One or both of the edges with the third smallest and the fourth smallest weights are part of any minimum spanning tree of \(G\).  ✔ official
- C) Suppose \(S \subseteq V\) be such that \(S \neq \phi\) and \(S \neq V\). Consider the edge with the minimum weight such that one of its vertices is in \(S\) and the other in \(V \setminus S\). Such an edge will always be part of any minimum spanning tree of \(G\).  ✔ official
- D) \(G\) can have multiple minimum spanning trees.

---

**2021_AN_Q64** · 2021-AN · MCQ · 1 mark · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \(G\) be a connected undirected weighted graph. Consider the following two statements.
\(S_1\) : There exists a minimum weight edge in \(G\) which is present in every minimum spanning tree of \(G\).
\(S_2\) : If every edge in \(G\) has distinct weight, then \(G\) has a unique minimum spanning tree.
Which one of the following options is correct?

- A) Both \(S_1\) and \(S_2\) are true.
- B) \(S_1\) is true and \(S_2\) is false.
- C) \(S_1\) is false and \(S_2\) is true.  ✔ official
- D) Both \(S_1\) and \(S_2\) are false.

---

**2021_FN_Q48** · 2021-FN · NAT · 1 mark · Hard · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms) · HAS A FIGURE (not shown here)

Consider the following undirected graph with edge weights as shown:

[IMAGE_Q_48_1]

The number of minimum-weight spanning trees of the graph is _________.

Official answer (numeric): 3 to 3

---

**2020_FN_Q39** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \( G = (V, E) \) be a weighted undirected graph and let \( T \) be a Minimum Spanning Tree (MST) of \( G \) maintained using adjacency lists. Suppose a new weighted edge \( (u, v) \in V \times V \) is added to \( G \). The worst case time complexity of determining if \( T \) is still an MST of the resultant graph is

- A) \( \Theta(|E| + |V|) \)
- B) \( \Theta(|E||V|) \)
- C) \( \Theta(|E| \log |V|) \)
- D) \( \Theta(|V|) \)  ✔ official

---

**2020_FN_Q56** · 2020-FN · NAT · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Consider a graph \( G = (V, E) \), where \( V = \{v_1, v_2, ..., v_{100}\} \), \( E = \{(v_i, v_j) \mid 1 \le i < j \le 100\} \) and weight of the edge \( (v_i, v_j) \) is \( |i - j| \). The weight of minimum spanning tree of \( G \) is ________.

Official answer (numeric): 99 to 99

---

**2019_FN_Q44** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let G be any connected, weighted, undirected graph:
I. G has a unique minimum spanning tree, if no two edges of G have the same weight.
II. G has a unique minimum spanning tree, if, for every cut of G, there is a unique minimum-weight edge crossing the cut.
Which of the above two statements is/are TRUE?

- A) I only
- B) II only
- C) Both I and II  ✔ official
- D) Neither I nor II

---

**2018_FN_Q57** · 2018-FN · NAT · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms) · HAS A FIGURE (not shown here)

Consider the following undirected graph G:
[IMAGE_Q_57]
Choose a value for \(x\) that will maximize the number of minimum weight spanning trees (MWSTs) of G. The number of MWSTs of G for this value of \(x\) is ______.

Official answer (numeric): 4 to 4

---

**2017_FN_Q48** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \(G = (V, E)\) be any connected undirected edge-weighted graph. The weights of the edges in \(E\) are positive and distinct. Consider the following statements:
I. Minimum Spanning Tree of \(G\) is always unique.
II. Shortest path between any two vertices of \(G\) is always unique.
Which of the above statements is/are necessarily true?

- A) I only  ✔ official
- B) II only
- C) Both I and II
- D) Neither I nor II

