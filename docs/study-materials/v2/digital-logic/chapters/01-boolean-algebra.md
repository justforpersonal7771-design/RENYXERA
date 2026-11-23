# Review input: Digital Logic, chapter 01: Boolean algebra

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-01-boolean-algebra.md` and `gemini-01-boolean-algebra.md` in this folder.

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

This is **one chapter** (1 of 6) of the Digital Logic book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Boolean algebra**. Not written yet.



## The PYQs for this chapter (20)

**2026_AN_Q16** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Boolean Algebra, Minimization, K-Maps

Which one of the following options is **not** a property of Boolean Algebra?
**Note:** + is OR operation, \( \cdot \) is AND operation, and ' is NOT operation

- A) \( a + b = b + a \)
- B) \( a \cdot a' = 1 \)  ✔ official
- C) \( a + a' = 1 \)
- D) \( a \cdot b = b \cdot a \)

---

**2026_FN_Q21** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider the following Boolean expression of a function \( F \):
$$ F(P, Q) = (P + Q) \oplus (\overline{P}Q) $$
Which of the following expressions is/are equivalent to \( F \)?

- A) \( \overline{P \oplus Q} \)  ✔ official
- B) \( P \oplus Q \)
- C) \( P \oplus \overline{Q} \)  ✔ official
- D) \( \overline{P} \oplus \overline{Q} \)

---

**2026_AN_Q40** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider the following 4-variable Boolean function
\( F(A, B, C, D) = \Sigma m(0, 1, 2, 3, 8, 9, 10, 11) \)
Consider \( A \) as MSB, \( D \) as LSB. Which one of the following options represents the minimal sum of products form for the above function?
Note: + is OR operation, \( \cdot \) is AND operation, ' is NOT operation

- A) \( A' + B' + C' + D' \)
- B) \( B' \)  ✔ official
- C) \( A' \cdot B' + A \cdot B \)
- D) \( A' \)

---

**2026_FN_Q48** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider a Boolean function \( F \) with the following minterm expression:
$$ F(P, Q, R, S) = \Sigma m(1, 2, 3, 4, 5, 7, 10, 12, 13, 14) $$
Which of the following options is/are the minimal sum-of-products expression(s) of \( F \)?

- A) \( \overline{P}S + Q\overline{R} + \overline{P}\overline{Q}R + \overline{Q}R\overline{S} \)
- B) \( \overline{P}S + Q\overline{R} + \overline{P}\overline{Q}R + PR\overline{S} \)  ✔ official
- C) \( \overline{P}S + Q\overline{R} + PQ\overline{S} + PR\overline{S} \)
- D) \( \overline{P}S + Q\overline{R} + PQ\overline{S} + \overline{Q}R\overline{S} \)  ✔ official

---

**2025_FN_Q24** · 2025-FN · MSQ · 1 mark · Hard · bank topic: Boolean Algebra, Minimization, K-Maps

Let \( X \) be a 3-variable Boolean function that produces output as '1' when at least two of the input variables are '1'. Which of the following statement(s) is/are CORRECT, where \( a \), \( b \), \( c \), \( d \), \( e \) are Boolean variables?

- A) \( X(a, b, X(c, d, e)) = X(X(a, b, c), d, e) \)
- B) \( X(a, b, X(a, b, c)) = X(a, b, c) \)  ✔ official
- C) \( X(a, b, X(a, c, d)) = (X(a, b, a) \text{ AND } X(c, d, c)) \)
- D) \( X(a, b, c) = X(a, X(a, b, c), X(a, c, c)) \)  ✔ official

---

**2025_FN_Q42** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider the following four variable Boolean function in sum-of-product form
$$ F(b_3, b_2, b_1, b_0) = \Sigma(0, 2, 4, 8, 10, 11, 12) $$
where the value of the function is computed by considering \( b_3b_2b_1b_0 \) as a 4-bit binary number, where \( b_3 \) denotes the most significant bit and \( b_0 \) denotes the least significant bit. Note that there are no don't care terms. Which ONE of the following options is the CORRECT minimized Boolean expression for \( F \)?

- A) \( \overline{b_1}\overline{b_0} + \overline{b_2}\overline{b_0} + b_1\overline{b_2}b_3 \)  ✔ official
- B) \( \overline{b_1}\overline{b_0} + \overline{b_2}\overline{b_0} \)
- C) \( \overline{b_2}\overline{b_0} + b_1b_2b_3 \)
- D) \( \overline{b_0}\overline{b_2} + \overline{b_3} \)

---

**2025_AN_Q43** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps · HAS A FIGURE (not shown here)

Given the following Karnaugh Map for a Boolean function \( F(w, x, y, z) \):
[IMAGE_Q_43_1]
Which one or more of the following Boolean expression(s) represent(s) \( F \)?

- A) \( \overline{w}\overline{x}y\overline{z} + w\overline{x}\overline{y}\overline{z} + w\overline{x}y\overline{z} + xz \)  ✔ official
- B) \( \overline{w}\overline{x}y\overline{z} + \overline{w}x\overline{y}\overline{z} + w\overline{x}y\overline{z} + xz \)
- C) \( w\overline{x}y\overline{z} + w\overline{x}\overline{y}\overline{z} + \overline{w}\overline{x}\overline{y}z + xz \)
- D) \( \overline{x}\overline{z} + xz \)  ✔ official

---

**2025_AN_Q50** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Which of the following Boolean algebraic equation(s) is/are CORRECT?

- A) \( \overline{A}BC + A\overline{B}\overline{C} + \overline{A}\overline{B}C + \overline{A}BC + ABC = BC + \overline{B}\overline{C} + \overline{A}B \)
- B) \( AB + \overline{A}C + BC = AB + \overline{A}C \)  ✔ official
- C) \( (A + C)(\overline{A} + B) = AB + \overline{A}C \)  ✔ official
- D) \( (A + \overline{B} + \overline{D})(C + D)(\overline{A} + C + D)(A + B + \overline{D}) = \overline{A}D + C\overline{D} \)  ✔ official

---

**2024_AN_Q32** · 2024-AN · MSQ · 1 mark · Easy · bank topic: Boolean Algebra, Minimization, K-Maps

For a Boolean variable \( x \), which of the following statements is/are FALSE?

- A) \( x \cdot 1 = x \)
- B) \( x + 1 = x \)  ✔ official
- C) \( x \cdot x = 0 \)  ✔ official
- D) \( x + \overline{x} = 1 \)

---

**2024_FN_Q62** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider a Boolean expression given by \( F(X, Y, Z) = \Sigma(3, 5, 6, 7) \)
Which of the following statements is/are CORRECT?

- A) \( F(X, Y, Z) = \Pi(0, 1, 2, 4) \)  ✔ official
- B) \( F(X, Y, Z) = XY + YZ + XZ \)  ✔ official
- C) \( F(X, Y, Z) \) is independent of input \( Y \)
- D) \( F(X, Y, Z) \) is independent of input \( X \)

---

**2021_FN_Q64** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider the following Boolean expression:
\(F = (X + Y + Z)(\overline{X} + Y)(\overline{Y} + Z)\)
Which of the following Boolean expressions is/are equivalent to \(\overline{F}\)?

- A) \((\overline{X} + \overline{Y} + \overline{Z})(X + \overline{Y})(Y + \overline{Z})\)
- B) \(X\overline{Y} + \overline{Z}\)  ✔ official
- C) \((X + \overline{Z})(\overline{Y} + \overline{Z})\)  ✔ official
- D) \(X\overline{Y} + Y\overline{Z} + \overline{X}\overline{Y}\overline{Z}\)  ✔ official

---

**2021_AN_Q49** · 2021-AN · NAT · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider a Boolean function \(f(w, x, y, z)\) such that
\(f(w, 0, 0, z) = 1\)
\(f(1, x, 1, z) = x + z\)
\(f(w, 1, y, z) = wz + y\)
The number of literals in the minimal sum-of-products expression of \(f\) is _________.

Official answer (numeric): 6 to 6

---

**2020_FN_Q54** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps · HAS A FIGURE (not shown here)

Consider the Boolean function \( z(a, b, c) \).
[IMAGE_Q_54]
Which one of the following minterm lists represents the circuit given above?

- A) \( z = \sum(0, 1, 3, 7) \)
- B) \( z = \sum(1, 4, 5, 6, 7) \)  ✔ official
- C) \( z = \sum(2, 4, 5, 6, 7) \)
- D) \( z = \sum(2, 3, 5) \)

---

**2019_FN_Q18** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Which one of the following is NOT a valid identity?

- A) \( (x \oplus y) \oplus z = x \oplus (y \oplus z) \)
- B) \( (x + y) \oplus z = x \oplus (y + z) \)  ✔ official
- C) \( x \oplus y = x + y \), if \( xy = 0 \)
- D) \( x \oplus y = (xy + x'y')' \)

---

**2019_FN_Q49** · 2019-FN · NAT · 2 marks · Hard · bank topic: Boolean Algebra, Minimization, K-Maps

What is the minimum number of 2-input NOR gates required to implement 4-variable function expressed in sum-of-minterms form as \( f = \Sigma(0, 2, 5, 7, 8, 10, 13, 15) \)? Assume that all the inputs and their complements are available ________.

Official answer (numeric): 3 to 3

---

**2018_FN_Q14** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Boolean Algebra, Minimization, K-Maps

Let \(\oplus\) and \(\odot\) denote the Exclusive OR and Exclusive NOR operations, respectively. Which one of the following is NOT CORRECT?

- A) \(\overline{P \oplus Q} = P \odot Q\)
- B) \(\bar{P} \oplus Q = P \odot Q\)
- C) \(\bar{P} \oplus \bar{Q} = P \oplus Q\)
- D) \((P \oplus \bar{P}) \oplus Q = (P \odot \bar{P}) \odot \bar{Q}\)  ✔ official

---

**2018_FN_Q59** · 2018-FN · NAT · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Consider the minterm list form of a Boolean function \(F\) given below.
\(F(P, Q, R, S) = \sum m(0, 2, 5, 7, 9, 11) + d(3, 8, 10, 12, 14)\)
Here, \(m\) denotes a minterm and \(d\) denotes a don’t care term. The number of essential prime implicants of the function \(F\) is ______.

Official answer (numeric): 3 to 3

---

**2017_FN_Q26** · 2017-FN · NAT · 1 mark · Medium · bank topic: Boolean Algebra, Minimization, K-Maps · HAS A FIGURE (not shown here)

Consider the Karnaugh map given below, where X represents "don't care" and blank represents 0.
[IMAGE_Q_26]
Assume for all inputs (\(a, b, c, d\)), the respective complements (\(\bar{a}, \bar{b}, \bar{c}, \bar{d}\)) are also available. The above logic is implemented using 2-input NOR gates only. The minimum number of gates required is ________.

Official answer (numeric): 1.0 to 1.0

---

**2017_AN_Q43** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

If \(w, x, y, z\) are Boolean variables, then which one of the following is INCORRECT?

- A) \(wx + w(x + y) + x(x + y) = x + wy\)
- B) \(\overline{w\bar{x}(y + \bar{z})} + \bar{w}x = \bar{w} + x + \bar{y}z\)
- C) \((w\bar{x}(y + x\bar{z}) + \bar{w}\bar{x})y = x\bar{y}\)  ✔ official
- D) \((w + y)(wxy + wyz) = wxy + wyz\)

---

**2017_AN_Q41** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Boolean Algebra, Minimization, K-Maps

Given \(f(w, x, y, z) = \Sigma_m(0, 1, 2, 3, 7, 8, 10) + \Sigma_d(5, 6, 11, 15)\), where d represents the \textit{don't-care} condition in Karnaugh maps. Which of the following is a minimum product-of-sums (POS) form of \(f(w, x, y, z)\)?

- A) \(f = (\bar{w} + \bar{z})(\bar{x} + z)\)  ✔ official
- B) \(f = (\bar{w} + z)(x + z)\)
- C) \(f = (w + z)(\bar{x} + z)\)
- D) \(f = (w + \bar{z})(\bar{x} + z)\)

