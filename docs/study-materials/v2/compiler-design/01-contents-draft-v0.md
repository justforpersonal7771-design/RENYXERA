# Compiler Design: contents draft v0 (from the app's catalog and the PYQ bank)

Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Lexical analysis, parsing, syntax-directed translation.
- Runtime environments.
- Intermediate code generation, local optimisation.
- Data flow analyses: constant propagation, liveness analysis, common subexpression elimination.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Lexical analysis | none | not written |
| 02 | Top-down parsing | none | not written |
| 03 | Bottom-up parsing (LR, SLR, LALR) | none | not written |
| 04 | Syntax-directed translation | none | not written |
| 05 | Runtime environments | none | not written |
| 06 | Intermediate code generation | none | not written |
| 07 | Local optimisation | none | not written |
| 08 | Data-flow analysis | none | not written |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **55**; marks: **85** = **5.7%** of all 1500 marks (about 5.7 marks a paper).
- Forge (our own) questions for this subject: **20**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR) | 30 | 43 | 2.87% | 10 | 9/15/6 | MSQ1×3, NAT1×4, MCQ2×8, MSQ2×2, MCQ1×10, NAT2×3 |
| Syntax-Directed Translation & Runtime Environments | 11 | 18 | 1.20% | 8 | 1/7/3 | MSQ2×1, MCQ1×3, MCQ2×4, MSQ1×1, NAT2×2 |
| Intermediate Code Generation & Local Code Optimization | 9 | 15 | 1.00% | 4 | 1/7/1 | NAT2×3, MCQ1×2, MCQ2×3, MSQ1×1 |
| Data Flow Analysis: Constant Propagation, Liveliness Analysis, Common Subexpression Elimination | 5 | 9 | 0.60% | 4 | 2/1/2 | MCQ2×4, MCQ1×1 |

### Question IDs by bank topic (so a reviewer can say which ones a lesson should use)

- **Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)**: 2026_FN_Q27, 2026_FN_Q28, 2026_AN_Q35, 2026_AN_Q41, 2025_FN_Q46, 2025_AN_Q40, 2025_AN_Q51, 2024_FN_Q32, 2024_FN_Q61, 2024_AN_Q17, 2024_AN_Q51, 2024_AN_Q64, 2023_FN_Q11, 2022_FN_Q13, 2022_FN_Q29, 2021_FN_Q56, 2021_FN_Q36, 2021_AN_Q38, 2021_AN_Q46, 2020_FN_Q21, 2019_FN_Q19, 2019_FN_Q13, 2019_FN_Q36, 2018_FN_Q18, 2018_FN_Q47, 2018_FN_Q48, 2017_FN_Q13, 2017_AN_Q30, 2017_AN_Q35, 2017_AN_Q46
- **Data Flow Analysis: Constant Propagation, Liveliness Analysis, Common Subexpression Elimination**: 2026_FN_Q42, 2026_AN_Q45, 2025_FN_Q13, 2023_FN_Q37, 2021_AN_Q33
- **Syntax-Directed Translation & Runtime Environments**: 2026_FN_Q53, 2025_FN_Q12, 2025_AN_Q22, 2024_FN_Q38, 2024_AN_Q27, 2023_FN_Q60, 2022_FN_Q65, 2021_FN_Q16, 2020_FN_Q35, 2020_FN_Q49, 2019_FN_Q57
- **Intermediate Code Generation & Local Code Optimization**: 2025_FN_Q52, 2025_AN_Q21, 2024_FN_Q51, 2024_AN_Q48, 2021_FN_Q11, 2021_AN_Q22, 2021_AN_Q43, 2017_FN_Q16, 2017_FN_Q54

## 4. What we need from this review

1. A **complete chapter and lesson list** for a beginner-first book on this subject (use the syllabus lines above, the standard books and what GATE really asks).
2. For each lesson: **finer points**, **GATE question patterns**, **diagrams needed**, **hand traces**, and which **prerequisite** a zero-level reader needs.
3. Which of the bank's topic labels map to which lesson, and which PYQs are **mis-labelled**.
4. A **weight tag** for each lesson ([MUST] / [SHOULD] / [LATER]) with a reason; do not invent frequencies; say "not sure".
5. The **question supply** needed: how many practice questions per lesson (20 for High-weight chapters, 10 for Low and foundation ones), and what types are missing in the bank.
