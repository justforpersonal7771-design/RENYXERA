# In-depth review input: Calculus

**One file, one review.** Paste everything below the line into ChatGPT (new chat), and again into Gemini (new chat). If the chat refuses the length, attach this file and write: "Follow the instructions inside the file."

Save the replies in this folder as `chatgpt-review-calculus.md` and `gemini-review-calculus.md`, then tell me.

Contains: reviewer instructions (A), the subject's contents with the PYQ statistics (B), and all 18 PYQs with full text and the official key (C).

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

This is the **in-depth review of the whole Calculus book**. Take your time. Go chapter by chapter, and give a much deeper answer than a quick review: at least **80 rows** in the gap table in Part 2 (spread across every chapter).

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

- Limits, continuity and differentiability.
- Maxima and minima.
- Mean value theorem.
- Integration.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Limits, continuity and differentiability | none | not written |
| 02 | Maxima and minima | none | not written |
| 03 | Mean value theorem | none | not written |
| 04 | Integration | none | not written |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **18**; marks: **21** = **1.4%** of all 1500 marks (about 1.4 marks a paper).
- Forge (our own) questions for this subject: **4**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Limits, Continuity, and Differentiability | 9 | 12 | 0.80% | 7 | 0/7/2 | NAT1×4, MSQ2×1, NAT2×1, MCQ1×2, MCQ2×1 |
| Mean Value Theorems & Definite Integration | 7 | 7 | 0.47% | 7 | 0/5/2 | MSQ1×1, MCQ1×3, NAT1×3 |
| Maxima and Minima Optimization Bounds | 2 | 2 | 0.13% | 2 | 0/2/0 | MSQ1×1, MCQ1×1 |


---

## PART C. ALL 18 PREVIOUS-YEAR QUESTIONS (Calculus)

Official key marked "✔ official". Figures are not shown; the question says so.

**2026_AN_Q27** · 2026-AN · MSQ · 1 mark · Medium · bank topic: Mean Value Theorems & Definite Integration

For a real number \( a \), let \( I(a) = \int_{-1}^{1} (3x^2 - ax + 1) dx \). Which of the following statements is/are true?

- A) The value of \( I(a) \) is independent of the value of \( a \)  ✔ official
- B) The value of \( I(a) \) can vary with the value of \( a \)
- C) There exists \( a \in (-\infty, +\infty) \) such that \( I(a) \) is a positive real number  ✔ official
- D) There exists \( a \in (-\infty, +\infty) \) such that \( I(a) \) is a negative real number

---

**2026_FN_Q32** · 2026-FN · NAT · 1 mark · Medium · bank topic: Limits, Continuity, and Differentiability

Consider the function \( f : \mathbb{R} \rightarrow \mathbb{R} \) defined as follows:
$$ f(x) = \begin{cases} c_1 e^x - c_2 \log_e \left(\frac{1}{x}\right), & \text{if } x > 0 \\ 3, & \text{otherwise} \end{cases} $$
where \( c_1, c_2 \in \mathbb{R} \).
If \( f \) is continuous at \( x = 0 \), then \( c_1 + c_2 = \) ________. (answer in integer)

Official answer (numeric): 3 to 3

---

**2026_FN_Q46** · 2026-FN · MSQ · 2 marks · Hard · bank topic: Limits, Continuity, and Differentiability

Let \( f : \mathbb{R} \rightarrow \mathbb{R} \) be defined as follows:
$$ f(x) = \left( \left| \frac{x}{2} \right| - x \right) \left( x - \left| \frac{x}{2} \right| \right) $$
Which of the following statements is/are true?

- A) \( f \) has a local maximum  ✔ official
- B) \( f \) has a local minimum
- C) \( f \) continuous over \( \mathbb{R} \)  ✔ official
- D) \( f \) is not differentiable over \( \mathbb{R} \)  ✔ official

---

**2026_AN_Q64** · 2026-AN · NAT · 2 marks · Hard · bank topic: Limits, Continuity, and Differentiability

Consider a function \( f : (0, 1) \rightarrow \{0, 1\} \) defined as follows.
For a real number \( r \in (0, 1) \), \( f(r) = 1 \) if the second digit after the decimal point in \( r \) is one of the four digits 2, 3, 6 and 7. Otherwise, \( f(r) \) is equal to 0.
The number of points in (0,1) at which \( f \) is discontinuous is ________. (answer in integer)

Official answer (numeric): 40 to 40

---

**2025_AN_Q12** · 2025-AN · MCQ · 1 mark · Hard · bank topic: Mean Value Theorems & Definite Integration

The value of \( x \) such that \( x > 1 \), satisfying the equation \( \int_1^x t \ln t \,dt = \frac{1}{4} \) is

- A) \( \sqrt{e} \)  ✔ official
- B) \( e \)
- C) \( e^2 \)
- D) \( e - 1 \)

---

**2025_FN_Q31** · 2025-FN · NAT · 1 mark · Medium · bank topic: Limits, Continuity, and Differentiability

Consider the given function \( f(x) \).
$$ f(x) = \begin{cases} ax + b & \text{for } x < 1 \\ x^3 + x^2 + 1 & \text{for } x \ge 1 \end{cases} $$
If the function is differentiable everywhere, the value of \( b \) must be ________. (Rounded off to one decimal place)

Official answer (numeric): -2.1 to -1.9

---

**2024_FN_Q15** · 2024-FN · MCQ · 1 mark · Medium · bank topic: Limits, Continuity, and Differentiability

Let \( f : \mathbb{R} \rightarrow \mathbb{R} \) be a function such that \( f(x) = \max\{x, x^3\}, x \in \mathbb{R} \), where \( \mathbb{R} \) is the set of all real numbers. The set of all points where \( f(x) \) is NOT differentiable is

- A) \( \{-1, 1, 2\} \)
- B) \( \{-2, -1, 1\} \)
- C) \( \{0, 1\} \)
- D) \( \{-1, 0, 1\} \)  ✔ official

---

**2024_AN_Q35** · 2024-AN · MCQ · 1 mark · Medium · bank topic: Mean Value Theorems & Definite Integration

Let \( f(x) \) be a continuous function from \( \mathbb{R} \) to \( \mathbb{R} \) such that
\[ f(x) = 1 - f(2 - x) \]
Which one of the following options is the CORRECT value of \( \int_0^2 f(x) dx \)?

- A) 0
- B) 1  ✔ official
- C) 2
- D) -1

---

**2023_FN_Q28** · 2023-FN · MSQ · 1 mark · Medium · bank topic: Maxima and Minima Optimization Bounds

Let \( f(x) = x^3 + 15x^2 - 33x - 36 \) be a real-valued function.
Which of the following statements is/are TRUE?

- A) \( f(x) \) does not have a local maximum.
- B) \( f(x) \) has a local maximum.  ✔ official
- C) \( f(x) \) does not have a local minimum.
- D) \( f(x) \) has a local minimum.  ✔ official

---

**2023_FN_Q31** · 2023-FN · NAT · 1 mark · Medium · bank topic: Mean Value Theorems & Definite Integration

The value of the definite integral \( \int_{-3}^{3} \int_{-2}^{2} \int_{-1}^{1} (4x^2y - z^3) dz \, dy \, dx \) is ________. (Rounded off to the nearest integer)

Official answer (numeric): 0 to 0

---

**2022_FN_Q34** · 2022-FN · NAT · 1 mark · Medium · bank topic: Limits, Continuity, and Differentiability

The value of the following limit is ___________.
$$ \lim_{x \to 0+} \frac{\sqrt{x}}{1 - e^{2\sqrt{x}}} $$

Official answer (numeric): -0.5 to -0.5

---

**2021_FN_Q54** · 2021-FN · NAT · 1 mark · Medium · bank topic: Limits, Continuity, and Differentiability

Consider the following expression:
$$ \lim_{x \to -3} \frac{\sqrt{2x + 22} - 4}{x + 3} $$
The value of the above expression (rounded to 2 decimal places) is _________.

Official answer (numeric): 0.25 to 0.25

---

**2021_AN_Q63** · 2021-AN · NAT · 1 mark · Medium · bank topic: Mean Value Theorems & Definite Integration

Suppose that \(f : \mathbb{R} \rightarrow \mathbb{R}\) is a continuous function on the interval \([-3, 3]\) and a differentiable function in the interval \((-3, 3)\) such that for every \(x\) in the interval, \(f'(x) \leq 2\). If \(f(-3) = 7\), then \(f(3)\) is at most _________.

Official answer (numeric): 19 to 19

---

**2020_FN_Q17** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Maxima and Minima Optimization Bounds

Consider the functions:
I. \( e^{-x} \)
II. \( x^2 - \sin x \)
III. \( \sqrt{x^3 + 1} \)
Which of the above functions is/are increasing everywhere in [0,1]?

- A) III only  ✔ official
- B) II only
- C) II and III only
- D) I and III only

---

**2019_FN_Q34** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Limits, Continuity, and Differentiability

Compute \( \lim_{x \to 3} \frac{x^4 - 81}{2x^2 - 5x - 3} \)

- A) 1
- B) \( \frac{53}{12} \)
- C) \( \frac{108}{7} \)  ✔ official
- D) Limit does not exist

---

**2018_FN_Q26** · 2018-FN · NAT · 1 mark · Medium · bank topic: Mean Value Theorems & Definite Integration

The value of \(\int_0^{\pi/4} x \cos(x^2) dx\) correct to three decimal places (assuming that \(\pi = 3.14\)) is _____.

Official answer (numeric): 0.27 to 0.30

---

**2017_AN_Q33** · 2017-AN · MCQ · 1 mark · Hard · bank topic: Mean Value Theorems & Definite Integration

If \(f(x) = R \sin\left(\frac{\pi x}{2}\right) + S, f'\left(\frac{1}{2}\right) = \sqrt{2}\) and \(\int_0^1 f(x)dx = \frac{2R}{\pi}\), then the constants R and S are, respectively

- A) \(\frac{2}{\pi}\) and \(\frac{16}{\pi}\)
- B) \(\frac{2}{\pi}\) and 0
- C) \(\frac{4}{\pi}\) and 0  ✔ official
- D) \(\frac{4}{\pi}\) and \(\frac{16}{\pi}\)

---

**2017_FN_Q42** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Limits, Continuity, and Differentiability

The value of \(\lim_{x \to 1} \frac{x^7 - 2x^5 + 1}{x^3 - 3x^2 + 2}\)

- A) is 0
- B) is \(-1\)
- C) is 1  ✔ official
- D) does not exist

