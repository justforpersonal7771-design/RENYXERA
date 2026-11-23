# Review input: Databases

**How to use:** paste everything under the line into ChatGPT (and again, in a new chat, into Gemini). Save each reply as `chatgpt-review-databases.md` and `gemini-review-databases.md` in this folder and send them back.

This input has **two parts**: (A) the reviewer instructions, (B) the contents draft. This is a v0 *contents list*, so after Part 3 and Part 4 of the instructions, **also write the complete proposed chapter-and-lesson plan** for this subject, in the same layout as the example plan summary below.

**Example layout of a finished plan** (from the Programming in C plan): for every chapter list *Lessons → Beginner must see → Finer points → GATE level → Diagrams → Traces by hand*, and tag every chapter [MUST], [SHOULD] or [LATER].

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
```

---

## PART B. THE DOCUMENT TO REVIEW

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
