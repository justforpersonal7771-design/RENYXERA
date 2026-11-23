# Review input: Quantitative Aptitude

**How to use:** paste everything under the line into ChatGPT (and again, in a new chat, into Gemini). Save each reply as `chatgpt-review-quantitative-aptitude.md` and `gemini-review-quantitative-aptitude.md` in this folder and send them back.

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

# Quantitative Aptitude: contents draft v0 (from the app's catalog and the PYQ bank)

Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Data interpretation: data graphs, 2- and 3-dimensional plots, maps, and tables.
- Numerical computation and estimation: ratios, percentages, powers, exponents and logarithms, permutations and combinations, and series.
- Mensuration and geometry.
- Elementary statistics and probability.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Number system | none | not written |
| 02 | Percentages | none | not written |
| 03 | Ratio and proportion | none | not written |
| 04 | Averages and mixtures | none | not written |
| 05 | Profit, loss and interest | none | not written |
| 06 | Time, speed and distance | none | not written |
| 07 | Time and work | none | not written |
| 08 | Powers, exponents and logarithms | none | not written |
| 09 | Permutations and combinations | none | not written |
| 10 | Series and progressions | none | not written |
| 11 | Probability | none | not written |
| 12 | Elementary statistics | none | not written |
| 13 | Mensuration | none | not written |
| 14 | Geometry | none | not written |
| 15 | Data interpretation: tables and bar graphs | none | not written |
| 16 | Data interpretation: pie charts, line graphs, 2D and 3D plots, maps | none | not written |
| 17 | Numerical estimation | none | not written |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **53**; marks: **86** = **5.7%** of all 1500 marks (about 5.7 marks a paper).
- Forge (our own) questions for this subject: **28**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Mensuration and Geometry | 10 | 17 | 1.13% | 5 | 3/6/1 | MCQ2×7, MCQ1×3 |
| Elementary Statistics and Probability | 10 | 16 | 1.07% | 7 | 1/9/0 | MCQ2×6, MCQ1×4 |
| Numerical Computation (Percentages, Ratios) | 9 | 15 | 1.00% | 5 | 1/8/0 | MCQ1×3, MCQ2×6 |
| Mathematical Operations (Powers, Exponents, Logarithms) | 10 | 15 | 1.00% | 7 | 2/8/0 | MCQ1×5, MCQ2×5 |
| Graphical Representations (2D and 3D Plots, Maps, Tables) | 5 | 8 | 0.53% | 4 | 2/3/0 | MCQ2×3, MCQ1×2 |
| Data Interpretation (Bar Graphs, Pie Charts, Histograms) | 4 | 8 | 0.53% | 3 | 0/4/0 | MCQ2×4 |
| Combinatorics Core (Permutations, Combinations, Series) | 4 | 6 | 0.40% | 4 | 2/2/0 | MCQ1×2, MCQ2×2 |
| Averages, Mixtures, and Alligations | 1 | 1 | 0.07% | 1 | 0/1/0 | MCQ1×1 |

### Question IDs by bank topic (so a reviewer can say which ones a lesson should use)

- **Combinatorics Core (Permutations, Combinations, Series)**: 2026_FN_Q3, 2025_FN_Q10, 2024_AN_Q4, 2017_FN_Q09
- **Graphical Representations (2D and 3D Plots, Maps, Tables)**: 2026_FN_Q8, 2025_FN_Q5, 2022_FN_Q2, 2017_FN_Q07, 2017_AN_Q10
- **Elementary Statistics and Probability**: 2026_FN_Q10, 2026_AN_Q3, 2026_AN_Q10, 2025_FN_Q8, 2024_FN_Q10, 2022_FN_Q8, 2021_FN_Q2, 2018_FN_Q10, 2017_FN_Q01, 2017_AN_Q05
- **Numerical Computation (Percentages, Ratios)**: 2026_AN_Q4, 2024_FN_Q8, 2024_AN_Q5, 2022_FN_Q7, 2021_FN_Q10, 2021_FN_Q9, 2021_AN_Q8, 2018_FN_Q06, 2018_FN_Q08
- **Averages, Mixtures, and Alligations**: 2025_FN_Q3
- **Mensuration and Geometry**: 2025_FN_Q7, 2025_AN_Q9, 2024_FN_Q2, 2021_FN_Q8, 2021_FN_Q4, 2021_AN_Q6, 2020_FN_Q5, 2020_FN_Q4, 2018_FN_Q03, 2018_FN_Q09
- **Mathematical Operations (Powers, Exponents, Logarithms)**: 2025_AN_Q3, 2024_FN_Q1, 2024_AN_Q10, 2023_FN_Q7, 2022_FN_Q3, 2020_FN_Q3, 2018_FN_Q07, 2017_FN_Q02, 2017_AN_Q06, 2017_AN_Q09
- **Data Interpretation (Bar Graphs, Pie Charts, Histograms)**: 2024_FN_Q5, 2024_AN_Q9, 2021_AN_Q9, 2020_FN_Q10

## 4. What we need from this review

1. A **complete chapter and lesson list** for a beginner-first book on this subject (use the syllabus lines above, the standard books and what GATE really asks).
2. For each lesson: **finer points**, **GATE question patterns**, **diagrams needed**, **hand traces**, and which **prerequisite** a zero-level reader needs.
3. Which of the bank's topic labels map to which lesson, and which PYQs are **mis-labelled**.
4. A **weight tag** for each lesson ([MUST] / [SHOULD] / [LATER]) with a reason; do not invent frequencies; say "not sure".
5. The **question supply** needed: how many practice questions per lesson (20 for High-weight chapters, 10 for Low and foundation ones), and what types are missing in the bank.
