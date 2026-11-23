# Review input: Discrete Mathematics

**How to use:** paste everything under the line into ChatGPT (and again, in a new chat, into Gemini). Save each reply as `chatgpt-review-discrete-mathematics.md` and `gemini-review-discrete-mathematics.md` in this folder and send them back.

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

# Discrete Mathematics: contents draft v0 (from the app's catalog and the PYQ bank)

Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Propositional and first order logic.
- Sets, relations, functions, partial orders and lattices.
- Monoids, groups.
- Graphs: connectivity, matching, coloring.
- Combinatorics: counting, recurrence relations, generating functions.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Propositional logic | 4 topics ready | written (old standard; to be rewritten) |
| 02 | First-order logic | 3 topics ready | written (old standard; to be rewritten) |
| 03 | Sets, relations and functions | 4 topics ready | written (old standard; to be rewritten) |
| 04 | Partial orders and lattices | 3 topics ready | written (old standard; to be rewritten) |
| 05 | Monoids and groups | 3 topics ready | written (old standard; to be rewritten) |
| 06 | Graph theory: connectivity, matching, colouring | 6 topics ready | written (old standard; to be rewritten) |
| 07 | Counting and combinatorics | 4 topics ready | written (old standard; to be rewritten) |
| 08 | Recurrences and generating functions | 3 topics ready | written (old standard; to be rewritten) |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **75**; marks: **113** = **7.5%** of all 1500 marks (about 7.5 marks a paper).
- Forge (our own) questions for this subject: **22**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Graph Theory (Connectivity, Paths, Cycles, Trees) | 17 | 27 | 1.80% | 9 | 3/6/8 | MSQ2×3, MCQ2×4, NAT1×5, MCQ1×2, NAT2×3 |
| Propositional and First-Order Quantifier Logic | 14 | 19 | 1.27% | 9 | 2/6/6 | MCQ1×7, MSQ2×1, MSQ1×2, MCQ2×4 |
| Combinatorics (Counting Rules, Summation Formulas) | 10 | 15 | 1.00% | 8 | 0/5/5 | MCQ1×2, NAT2×4, NAT1×3, MCQ2×1 |
| Sets, Relations, Functions, Partial Orders, Lattices | 11 | 15 | 1.00% | 8 | 0/5/6 | MSQ1×2, MCQ1×1, MSQ2×3, NAT1×4, MCQ2×1 |
| Algebraic Structures (Monoids, Groups) | 10 | 15 | 1.00% | 8 | 2/6/2 | MSQ2×3, NAT2×1, MSQ1×1, MCQ2×1, NAT1×3, MCQ1×1 |
| Advanced Graph Bounds (Matching, Coloring Theorems) | 7 | 13 | 0.87% | 6 | 1/4/2 | MSQ2×4, NAT2×2, NAT1×1 |
| Recurrence Relations and Generating Functions | 6 | 9 | 0.60% | 5 | 0/2/4 | MCQ1×3, MCQ2×1, MSQ2×1, NAT2×1 |

### Question IDs by bank topic (so a reviewer can say which ones a lesson should use)

- **Combinatorics (Counting Rules, Summation Formulas)**: 2026_FN_Q12, 2026_FN_Q57, 2025_FN_Q30, 2023_FN_Q48, 2022_FN_Q32, 2021_FN_Q21, 2021_AN_Q37, 2020_FN_Q52, 2019_FN_Q26, 2017_FN_Q41
- **Advanced Graph Bounds (Matching, Coloring Theorems)**: 2026_FN_Q47, 2024_FN_Q59, 2024_AN_Q63, 2023_FN_Q55, 2022_FN_Q50, 2020_FN_Q53, 2018_FN_Q28
- **Graph Theory (Connectivity, Paths, Cycles, Trees)**: 2026_FN_Q55, 2026_AN_Q36, 2025_FN_Q43, 2024_FN_Q31, 2024_AN_Q15, 2024_AN_Q37, 2023_FN_Q56, 2022_FN_Q30, 2022_FN_Q37, 2022_FN_Q52, 2022_FN_Q58, 2021_FN_Q24, 2021_FN_Q35, 2019_FN_Q12, 2018_FN_Q53, 2017_FN_Q19, 2017_AN_Q16
- **Propositional and First-Order Quantifier Logic**: 2026_AN_Q11, 2025_FN_Q48, 2025_AN_Q15, 2024_AN_Q26, 2023_FN_Q26, 2021_FN_Q27, 2021_AN_Q60, 2020_FN_Q46, 2019_FN_Q54, 2018_FN_Q38, 2017_FN_Q29, 2017_FN_Q15, 2017_FN_Q55, 2017_AN_Q31
- **Sets, Relations, Functions, Partial Orders, Lattices**: 2026_AN_Q26, 2025_FN_Q17, 2025_AN_Q42, 2024_FN_Q28, 2024_AN_Q18, 2023_FN_Q49, 2021_FN_Q29, 2021_AN_Q27, 2020_FN_Q11, 2018_FN_Q37, 2017_AN_Q28
- **Algebraic Structures (Monoids, Groups)**: 2025_FN_Q49, 2024_FN_Q65, 2024_AN_Q41, 2023_FN_Q51, 2022_FN_Q27, 2021_FN_Q52, 2020_FN_Q32, 2019_FN_Q35, 2019_FN_Q21, 2018_FN_Q29
- **Recurrence Relations and Generating Functions**: 2024_AN_Q20, 2023_FN_Q15, 2022_FN_Q36, 2022_FN_Q51, 2018_FN_Q11, 2017_AN_Q48

## 4. What we need from this review

1. A **complete chapter and lesson list** for a beginner-first book on this subject (use the syllabus lines above, the standard books and what GATE really asks).
2. For each lesson: **finer points**, **GATE question patterns**, **diagrams needed**, **hand traces**, and which **prerequisite** a zero-level reader needs.
3. Which of the bank's topic labels map to which lesson, and which PYQs are **mis-labelled**.
4. A **weight tag** for each lesson ([MUST] / [SHOULD] / [LATER]) with a reason; do not invent frequencies; say "not sure".
5. The **question supply** needed: how many practice questions per lesson (20 for High-weight chapters, 10 for Low and foundation ones), and what types are missing in the bank.
