# Algorithms: contents draft v0 (from the app's catalog and the PYQ bank)

Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Searching, sorting, hashing.
- Asymptotic worst case time and space complexity.
- Algorithm design techniques: greedy, dynamic programming and divide-and-conquer.
- Graph traversals, minimum spanning trees, shortest paths.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Asymptotics and recurrences | 3 topics ready | written (old standard; to be rewritten) |
| 02 | Searching and sorting | 5 topics ready | written (old standard; to be rewritten) |
| 03 | Hashing | 3 topics ready | written (old standard; to be rewritten) |
| 04 | Divide and conquer | 3 topics ready | written (old standard; to be rewritten) |
| 05 | Greedy | 3 topics ready | written (old standard; to be rewritten) |
| 06 | Dynamic programming | 4 topics ready | written (old standard; to be rewritten) |
| 07 | Graph traversals | 3 topics ready | written (old standard; to be rewritten) |
| 08 | Minimum spanning trees | 3 topics ready | written (old standard; to be rewritten) |
| 09 | Shortest paths | 3 topics ready | written (old standard; to be rewritten) |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **73**; marks: **114** = **7.6%** of all 1500 marks (about 7.6 marks a paper).
- Forge (our own) questions for this subject: **29**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Asymptotic Analysis (O, Omega, Theta Complexities) | 19 | 27 | 1.80% | 9 | 2/11/6 | MCQ1×9, MSQ1×2, MCQ2×6, MSQ2×1, NAT2×1 |
| Graph Traversals (BFS, DFS) & Single-Source Shortest Paths | 14 | 25 | 1.67% | 7 | 1/11/2 | MCQ2×4, MSQ2×4, MSQ1×1, NAT2×3, NAT1×1, MCQ1×1 |
| Searching, Sorting, Hashing Mechanisms | 17 | 23 | 1.53% | 8 | 3/11/3 | MSQ1×1, NAT1×4, MCQ2×3, NAT2×2, MCQ1×6, MSQ2×1 |
| Minimum Spanning Trees (Prim/Kruskal Algorithms) | 13 | 23 | 1.53% | 9 | 0/12/1 | MSQ2×2, MCQ1×2, NAT2×4, MCQ2×4, NAT1×1 |
| Dynamic Programming Infrastructure | 4 | 7 | 0.47% | 4 | 0/2/2 | MCQ2×2, NAT1×1, MSQ2×1 |
| Greedy Approach & Divide-and-Conquer Designs | 4 | 7 | 0.47% | 3 | 1/3/0 | MCQ2×1, NAT2×2, MCQ1×1 |
| Divide-and-Conquer Designs | 2 | 2 | 0.13% | 2 | 0/0/2 | NAT1×2 |

### Question IDs by bank topic (so a reviewer can say which ones a lesson should use)

- **Asymptotic Analysis (O, Omega, Theta Complexities)**: 2026_FN_Q17, 2026_AN_Q24, 2026_AN_Q25, 2025_FN_Q20, 2024_FN_Q20, 2024_FN_Q57, 2023_FN_Q29, 2023_FN_Q54, 2022_FN_Q11, 2021_FN_Q61, 2021_FN_Q50, 2021_AN_Q55, 2020_FN_Q34, 2018_FN_Q42, 2018_FN_Q55, 2017_FN_Q21, 2017_AN_Q19, 2017_AN_Q50, 2017_AN_Q61
- **Searching, Sorting, Hashing Mechanisms**: 2026_FN_Q24, 2026_AN_Q30, 2026_AN_Q38, 2025_FN_Q33, 2025_FN_Q65, 2025_AN_Q20, 2025_AN_Q41, 2023_FN_Q20, 2022_FN_Q16, 2021_FN_Q30, 2021_FN_Q25, 2021_FN_Q49, 2021_AN_Q31, 2020_FN_Q28, 2019_FN_Q31, 2019_FN_Q61, 2017_FN_Q45
- **Graph Traversals (BFS, DFS) & Single-Source Shortest Paths**: 2026_FN_Q41, 2026_FN_Q50, 2026_AN_Q37, 2025_AN_Q29, 2025_AN_Q59, 2024_FN_Q60, 2024_FN_Q37, 2021_FN_Q39, 2021_AN_Q25, 2021_AN_Q30, 2021_AN_Q19, 2020_FN_Q57, 2018_FN_Q40, 2017_AN_Q13
- **Minimum Spanning Trees (Prim/Kruskal Algorithms)**: 2026_FN_Q49, 2025_FN_Q18, 2025_FN_Q64, 2025_AN_Q37, 2024_AN_Q53, 2022_FN_Q49, 2021_FN_Q48, 2021_AN_Q64, 2020_FN_Q39, 2020_FN_Q56, 2019_FN_Q44, 2018_FN_Q57, 2017_FN_Q48
- **Divide-and-Conquer Designs**: 2026_AN_Q32, 2019_FN_Q14
- **Dynamic Programming Infrastructure**: 2026_AN_Q39, 2024_AN_Q11, 2021_FN_Q17, 2018_FN_Q41
- **Greedy Approach & Divide-and-Conquer Designs**: 2021_AN_Q57, 2018_FN_Q58, 2017_FN_Q30, 2017_AN_Q59

## 4. What we need from this review

1. A **complete chapter and lesson list** for a beginner-first book on this subject (use the syllabus lines above, the standard books and what GATE really asks).
2. For each lesson: **finer points**, **GATE question patterns**, **diagrams needed**, **hand traces**, and which **prerequisite** a zero-level reader needs.
3. Which of the bank's topic labels map to which lesson, and which PYQs are **mis-labelled**.
4. A **weight tag** for each lesson ([MUST] / [SHOULD] / [LATER]) with a reason; do not invent frequencies; say "not sure".
5. The **question supply** needed: how many practice questions per lesson (20 for High-weight chapters, 10 for Low and foundation ones), and what types are missing in the bank.
