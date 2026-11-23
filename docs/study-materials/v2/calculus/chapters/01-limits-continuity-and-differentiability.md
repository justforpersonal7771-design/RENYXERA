# Review input: Calculus, chapter 01: Limits, continuity and differentiability

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-01-limits-continuity-and-differentiability.md` and `gemini-01-limits-continuity-and-differentiability.md` in this folder.

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

This is **one chapter** (1 of 4) of the Calculus book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Limits, continuity and differentiability**. Not written yet.



## The PYQs for this chapter (9)

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

**2019_FN_Q34** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Limits, Continuity, and Differentiability

Compute \( \lim_{x \to 3} \frac{x^4 - 81}{2x^2 - 5x - 3} \)

- A) 1
- B) \( \frac{53}{12} \)
- C) \( \frac{108}{7} \)  ✔ official
- D) Limit does not exist

---

**2017_FN_Q42** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Limits, Continuity, and Differentiability

The value of \(\lim_{x \to 1} \frac{x^7 - 2x^5 + 1}{x^3 - 3x^2 + 2}\)

- A) is 0
- B) is \(-1\)
- C) is 1  ✔ official
- D) does not exist

