# Linear Algebra: review merge and plan v1

Source: Gemini only (`gemini.md`). Everything marked "verified" was recomputed on 28 Nov 2026.

## 1. How good was it
Good, and its statistics are correct: 30 questions, 45 marks (3.0% of 1500), **7 Easy / 19 Medium / 4 Hard (87%)**, types 15 MCQ / 6 MSQ / 9 NAT, 1 figure placeholder; eigenvalues are 20 of 45 marks (44%), matrices plus linear systems 21 (47%), together 91%; LU decomposition 4 marks (9%). It is right that vectors, independence and null spaces are used by the questions but absent from the book plan.

## 2. Data defects (verified)
| Question | Problem | Status |
|---|---|---|
| 2022_FN_Q45 | The stem asks for "L32, U32, x1" and option B prints U32. U is upper triangular so U32 = 0; it must be **U33**. Doolittle LU gives L32 = −1/2, U33 = −1/2 and the solution (x1, x2, x3) = (0, 2, −1): option D | **Confirmed typo**: print U33 |
| 2025_AN_Q44 | Q is printed as 3 × 3; the equations LY = Q, UX = Y hold either way | Fix to a vector if that was the original |
| 2023_FN_Q18 | "Let and A = …" | Fix the sentence |
| 2023_FN_Q30 | The graph is missing. The sum of eigenvalues is the trace of A, which equals the number of self-loops; the key accepts 2 or 4 | **Open**: restore the figure; keep both accepted keys |
| Numbers re-solved | 2026_AN_Q31 = 24 (a = ±4, b = ±6), 2026_AN_Q62 = 48, 2021_AN_Q61 = 4, 2021_FN_Q15 = 3, 2019_FN_Q45 = 12 (Vandermonde), 2018_FN_Q27 = 3, 2017_AN_Q29 = 2 (numpy), 2017_AN_Q51 = 5 (a = −11, roots 2, 5, −3) | All keys correct |
| Other MCQ and MSQ keys | Gemini says CORRECT for all; not re-solved | Keep |

## 3. Syllabus check
Official line: *Matrices, determinants, system of linear equations, eigenvalues and eigenvectors, LU decomposition.* The five chapters match. Orthogonality, angle bisectors and vector spaces appear in questions but are not named: Chapter 0 is a Foundation bridge and its extras are [LEGACY-ASKED].

## 4. The plan
**0 · Vectors, independence, subspaces** [Foundation, about 65 minutes]. **1 · Matrices, determinants, rank, nullity** [Very High]. **2 · Linear systems, Rouché–Capelli** [High]. **3 · Eigenvalues, eigenvectors, diagonalisation** [Very High, the best marks per hour]. **4 · LU decomposition and factorisations** [Low, one lesson]. **5 · Previous-year practice**.

## 5. Next steps
Fix 2022_FN_Q45 (U33) and the two small typos; restore the 2023_FN_Q30 graph (owner); tag the 30 PYQs; build a matrix and eigenvalue step-by-step figure.
