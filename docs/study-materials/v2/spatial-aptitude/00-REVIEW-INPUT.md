# In-depth review input: Spatial Aptitude

**One file, one review.** Paste everything below the line into ChatGPT (new chat), and again into Gemini (new chat). If the chat refuses the length, attach this file and write: "Follow the instructions inside the file."

Save the replies in this folder as `chatgpt-review-spatial-aptitude.md` and `gemini-review-spatial-aptitude.md`, then tell me.

Contains: reviewer instructions (A), the subject's contents with the PYQ statistics (B), and all 15 PYQs with full text and the official key (C).

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

This is the **in-depth review of the whole Spatial Aptitude book**. Take your time. Go chapter by chapter, and give a much deeper answer than a quick review: at least **80 rows** in the gap table in Part 2 (spread across every chapter).

If your reply gets too long, **stop at the end of a chapter** and write "CONTINUE FROM CHAPTER <number>". I will answer "continue" and you carry on. Do not shorten later chapters to fit; every chapter gets the same depth.

In addition to Parts 1 to 4 above, answer these parts:

PART 5. THE FULL PLAN, CHAPTER BY CHAPTER
 For every chapter (the ones given below, plus any you think are missing), list the lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with the reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind and what it shows); hand traces; common mistakes.

PART 6. EVERY PYQ LISTED BELOW
 For EACH previous-year question: (a) the chapter and lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree show the working and write FACT-DOUBT), (e) whether the question text looks mis-transcribed (say exactly what).

PART 7. MORE QUESTIONS NEEDED
 For each lesson, three question ideas GATE could ask that the PYQs do not cover (one line each, with the type MCQ / MSQ / NAT).

PART 8. WHAT IS MISSING FROM THE SUBJECT
 Topics GATE has asked, or could ask, that no chapter below covers.

PART 9. WEIGHTS
 Give each chapter a weight tag (High / Medium / Low / Foundation) and say whether the one derived from the bank (below) looks fair. Do not invent frequencies; write "not sure".
```

---

## PART B. THE CONTENTS TO REVIEW


Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Spatial aptitude: transformation of shapes (translation, rotation, scaling, mirroring, assembling, grouping), paper folding, cutting, patterns in 2 and 3 dimensions.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Translation and scaling | none | not written |
| 02 | Rotation | none | not written |
| 03 | Mirror and water images | none | not written |
| 04 | Assembling and grouping shapes | none | not written |
| 05 | Paper folding | none | not written |
| 06 | Paper cutting and punching | none | not written |
| 07 | Patterns in two dimensions | none | not written |
| 08 | Patterns in three dimensions: cubes, dice, views | none | not written |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **15**; marks: **24** = **1.6%** of all 1500 marks (about 1.6 marks a paper).
- Forge (our own) questions for this subject: **28**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Structural Morphing (Mirroring, Assembling, Grouping) | 6 | 9 | 0.60% | 4 | 3/3/0 | MCQ1×3, MCQ2×3 |
| Pattern Identification in 2D and 3D Spaces | 4 | 7 | 0.47% | 3 | 0/4/0 | MCQ2×3, MCQ1×1 |
| Paper Folding and Cutting Diagnostics | 4 | 6 | 0.40% | 3 | 1/3/0 | MCQ2×2, MCQ1×2 |
| Shape Transformation (Translation, Rotation, Scaling) | 1 | 2 | 0.13% | 1 | 0/1/0 | MCQ2×1 |


---

## PART C. ALL 15 PREVIOUS-YEAR QUESTIONS (Spatial Aptitude)

Official key marked "✔ official". Figures are not shown; the question says so.

**2026_FN_Q2** · 2026-FN · MCQ · 1 mark · Medium · bank topic: Structural Morphing (Mirroring, Assembling, Grouping) · HAS A FIGURE (not shown here)

The figure shows two 4-tile patterns.
[IMAGE_Q_02_1]
Either one or both of the patterns can be used any number of times and in any orientation to construct a new pattern. Which one of the options below cannot be constructed by using only these two 4-tile patterns assuming there are no overlaps among them?

- A) [IMAGE_Q_02_A]
- B) [IMAGE_Q_02_B]
- C) [IMAGE_Q_02_C]  ✔ official
- D) [IMAGE_Q_02_D]

---

**2026_AN_Q2** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Structural Morphing (Mirroring, Assembling, Grouping) · HAS A FIGURE (not shown here)

A black square PQRS has been cut into two parts. One part of it is shown in Panel I. Which one of the shapes in Panel II is the other part?
[IMAGE_Q_02_1]

- A) (i)
- B) (ii)
- C) (iii)  ✔ official
- D) (iv)

---

**2026_FN_Q7** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Pattern Identification in 2D and 3D Spaces · HAS A FIGURE (not shown here)

In Panel I of the figure below, the front view and top view of a structure are shown. Which one of the 3D structures shown in Panel II possesses the views shown in Panel I?
[IMAGE_Q_07_1]

- A) (i)
- B) (ii)
- C) (iii)
- D) (iv)  ✔ official

---

**2026_AN_Q7** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Pattern Identification in 2D and 3D Spaces · HAS A FIGURE (not shown here)

Two tiles are missing in Panel I. Which one of the options in Panel II is the appropriate choice for the missing tiles?
[IMAGE_Q_07_1]

- A) (i)  ✔ official
- B) (ii)
- C) (iii)
- D) (iv)

---

**2025_AN_Q4** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Structural Morphing (Mirroring, Assembling, Grouping) · HAS A FIGURE (not shown here)

The paper as shown in the figure is folded to make a cube where each square corresponds to a particular face of the cube. Which one of the following options correctly represents the cube?
Note: The figures shown are representative.
[IMAGE_Q_04_1]

- A) [IMAGE_Q_04_A]  ✔ official
- B) [IMAGE_Q_04_B]
- C) [IMAGE_Q_04_C]
- D) [IMAGE_Q_04_D]

---

**2025_FN_Q9** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Paper Folding and Cutting Diagnostics · HAS A FIGURE (not shown here)

A square paper, shown in figure (I), is folded along the dotted lines as shown in the figures (II) and (III). Then a few cuts are made as shown in figure (IV). Which one of the following patterns will be obtained when the paper is unfolded?
Note: The figures shown are representative.
[IMAGE_Q_09_1]

- A) [IMAGE_Q_09_A]  ✔ official
- B) [IMAGE_Q_09_B]
- C) [IMAGE_Q_09_C]
- D) [IMAGE_Q_09_D]

---

**2024_FN_Q4** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Paper Folding and Cutting Diagnostics

A rectangular paper of 20 cm × 8 cm is folded 3 times. Each fold is made along the line of symmetry, which is perpendicular to its long edge. The perimeter of the final folded sheet (in cm) is

- A) 18  ✔ official
- B) 24
- C) 20
- D) 21

---

**2024_AN_Q6** · 2024-AN · MCQ · 2 marks · Easy · bank topic: Structural Morphing (Mirroring, Assembling, Grouping)

A cube is to be cut into 8 pieces of equal size and shape. Here, each cut should be straight and it should not stop till it reaches the other end of the cube.
The minimum number of such cuts required is

- A) 3  ✔ official
- B) 4
- C) 7
- D) 8

---

**2024_FN_Q7** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Structural Morphing (Mirroring, Assembling, Grouping) · HAS A FIGURE (not shown here)

The least number of squares to be added in the figure to make AB a line of symmetry is
[IMAGE_Q_07_1]

- A) 6  ✔ official
- B) 4
- C) 5
- D) 7

---

**2023_FN_Q5** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Pattern Identification in 2D and 3D Spaces

Looking at the surface of a smooth 3-dimensional object from the outside, which one of the following options is TRUE?

- A) The surface of the object must be concave everywhere.
- B) The surface of the object must be convex everywhere.
- C) The surface of the object may be concave in some places and convex in other places.  ✔ official
- D) The object can have edges, but no corners.

---

**2023_FN_Q10** · 2023-FN · MCQ · 2 marks · Medium · bank topic: Shape Transformation (Translation, Rotation, Scaling) · HAS A FIGURE (not shown here)

Which one of the options best describes the transformation of the 2-dimensional figure \( P \) to \( Q \), and then to \( R \), as shown?
[IMAGE_Q_10_1]

- A) Operation 1: A clockwise rotation by \( 90^\circ \) about an axis perpendicular to the plane of the figure Operation 2: A reflection along a horizontal line  ✔ official
- B) Operation 1: A counter clockwise rotation by \( 90^\circ \) about an axis perpendicular to the plane of the figure Operation 2: A reflection along a horizontal line
- C) Operation 1: A clockwise rotation by \( 90^\circ \) about an axis perpendicular to the plane of the figure Operation 2: A reflection along a vertical line
- D) Operation 1: A counter clockwise rotation by \( 180^\circ \) about an axis perpendicular to the plane of the figure Operation 2: A reflection along a vertical line

---

**2022_FN_Q10** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Pattern Identification in 2D and 3D Spaces · HAS A FIGURE (not shown here)

A plot of land must be divided between four families. They want their individual plots to be similar in shape, not necessarily equal in area. The land has equally spaced poles, marked as dots in the below figure. Two ropes, R1 and R2, are already present and cannot be moved.
What is the least number of additional straight ropes needed to create the desired plots? A single rope can pass through three poles that are aligned in a straight line.

[IMAGE_Q_10]

- A) 2
- B) 4
- C) 5
- D) 3  ✔ official

---

**2021_AN_Q10** · 2021-AN · MCQ · 1 mark · Easy · bank topic: Paper Folding and Cutting Diagnostics · HAS A FIGURE (not shown here)

A transparent square sheet shown above is folded along the dotted line. The folded sheet will look like _____.

[IMAGE_Q_10_1]

- A) [IMAGE_Q_10_A]
- B) [IMAGE_Q_10_D]  ✔ official
- C) [IMAGE_Q_10_C]
- D) [IMAGE_Q_10_B]

---

**2021_FN_Q3** · 2021-FN · MCQ · 1 mark · Medium · bank topic: Paper Folding and Cutting Diagnostics · HAS A FIGURE (not shown here)

[IMAGE_Q_03_1]
A circular sheet of paper is folded along the lines in the directions shown. The paper, after being punched in the final folded state as shown and unfolded in the reverse order of folding, will look like _________.

- A) [IMAGE_Q_03_A]  ✔ official
- B) [IMAGE_Q_03_D]
- C) [IMAGE_Q_03_C]
- D) [IMAGE_Q_03_B]

---

**2021_AN_Q5** · 2021-AN · MCQ · 2 marks · Easy · bank topic: Structural Morphing (Mirroring, Assembling, Grouping) · HAS A FIGURE (not shown here)

What will be the remaining part to make it a rectangle?

[IMAGE_Q_05_1]

- A) [IMAGE_Q_05_C]  ✔ official
- B) [IMAGE_Q_05_D]
- C) [IMAGE_Q_05_A]
- D) [IMAGE_Q_05_B]

