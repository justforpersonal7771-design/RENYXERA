# Databases: contents draft v0 (from the app's catalog and the PYQ bank)

Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- ER-model.
- Relational model: relational algebra, tuple calculus, SQL.
- Integrity constraints, normal forms.
- File organization, indexing (e.g., B and B+ trees).
- Transactions and concurrency control.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | ER model | 3 topics ready | written (old standard; to be rewritten) |
| 02 | Relational model and integrity constraints | 2 topics ready | written (old standard; to be rewritten) |
| 03 | Relational algebra and tuple calculus | 3 topics ready | written (old standard; to be rewritten) |
| 04 | SQL | 4 topics ready | written (old standard; to be rewritten) |
| 05 | Functional dependencies and normal forms | 4 topics ready | written (old standard; to be rewritten) |
| 06 | File organisation and indexing (B and B+ trees) | 3 topics ready | written (old standard; to be rewritten) |
| 07 | Transactions | 3 topics ready | written (old standard; to be rewritten) |
| 08 | Concurrency control | 4 topics ready | written (old standard; to be rewritten) |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **72**; marks: **111** = **7.4%** of all 1500 marks (about 7.4 marks a paper).
- Forge (our own) questions for this subject: **30**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Transactions, Concurrency Control, Conflict Serializability | 15 | 23 | 1.53% | 8 | 2/12/1 | MCQ1×4, MSQ1×3, MSQ2×2, MCQ2×5, NAT2×1 |
| Relational Models, Relational Algebra, Tuple Calculus | 13 | 21 | 1.40% | 9 | 1/11/1 | MCQ2×6, MCQ1×2, NAT1×2, MSQ1×1, NAT2×2 |
| SQL Queries (DDL/DML, Joins, Aggregations) | 10 | 17 | 1.13% | 8 | 2/8/0 | NAT2×5, MSQ2×1, MCQ2×1, MCQ1×2, NAT1×1 |
| Integrity Constraints & Functional Dependencies | 10 | 15 | 1.00% | 5 | 1/8/1 | MSQ1×1, NAT2×2, MCQ2×1, MSQ2×2, NAT1×2, MCQ1×2 |
| Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries) | 9 | 15 | 1.00% | 8 | 3/6/0 | MSQ1×2, MSQ2×2, MCQ1×1, MCQ2×4 |
| File Organization & Indexing (e.g., B and B+ Trees) | 10 | 15 | 1.00% | 8 | 3/4/3 | MCQ2×1, MSQ1×2, NAT2×4, MCQ1×2, NAT1×1 |
| ER-Model | 5 | 5 | 0.33% | 4 | 3/2/0 | MCQ1×5 |

### Question IDs by bank topic (so a reviewer can say which ones a lesson should use)

- **Integrity Constraints & Functional Dependencies**: 2026_FN_Q30, 2026_FN_Q65, 2026_AN_Q42, 2024_FN_Q44, 2024_AN_Q39, 2022_FN_Q31, 2021_AN_Q16, 2021_AN_Q28, 2017_FN_Q17, 2017_AN_Q26
- **Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)**: 2026_FN_Q31, 2025_FN_Q47, 2025_AN_Q46, 2024_FN_Q25, 2022_FN_Q14, 2021_FN_Q40, 2020_FN_Q65, 2019_FN_Q37, 2018_FN_Q52
- **Relational Models, Relational Algebra, Tuple Calculus**: 2026_FN_Q43, 2026_AN_Q15, 2025_FN_Q39, 2024_FN_Q35, 2024_AN_Q59, 2023_FN_Q16, 2022_FN_Q25, 2021_FN_Q45, 2021_FN_Q53, 2019_FN_Q47, 2018_FN_Q51, 2017_FN_Q39, 2017_FN_Q38
- **Transactions, Concurrency Control, Conflict Serializability**: 2026_AN_Q20, 2025_FN_Q15, 2025_AN_Q27, 2025_AN_Q53, 2024_FN_Q45, 2024_AN_Q13, 2024_AN_Q31, 2022_FN_Q39, 2021_FN_Q28, 2021_FN_Q47, 2021_AN_Q34, 2020_FN_Q45, 2019_FN_Q27, 2017_FN_Q51, 2017_AN_Q62
- **File Organization & Indexing (e.g., B and B+ Trees)**: 2026_AN_Q46, 2025_FN_Q21, 2025_AN_Q57, 2024_FN_Q11, 2024_AN_Q16, 2023_FN_Q62, 2021_AN_Q26, 2020_FN_Q51, 2019_FN_Q20, 2017_AN_Q54
- **SQL Queries (DDL/DML, Joins, Aggregations)**: 2025_FN_Q55, 2025_AN_Q54, 2023_FN_Q61, 2022_FN_Q56, 2021_AN_Q45, 2020_FN_Q12, 2019_FN_Q41, 2018_FN_Q22, 2017_FN_Q31, 2017_AN_Q55
- **ER-Model**: 2024_FN_Q24, 2024_AN_Q22, 2020_FN_Q13, 2018_FN_Q21, 2017_AN_Q22

## 4. What we need from this review

1. A **complete chapter and lesson list** for a beginner-first book on this subject (use the syllabus lines above, the standard books and what GATE really asks).
2. For each lesson: **finer points**, **GATE question patterns**, **diagrams needed**, **hand traces**, and which **prerequisite** a zero-level reader needs.
3. Which of the bank's topic labels map to which lesson, and which PYQs are **mis-labelled**.
4. A **weight tag** for each lesson ([MUST] / [SHOULD] / [LATER]) with a reason; do not invent frequencies; say "not sure".
5. The **question supply** needed: how many practice questions per lesson (20 for High-weight chapters, 10 for Low and foundation ones), and what types are missing in the bank.
