# Review input: Linear Algebra, chapter 02: Systems of linear equations

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-02-systems-of-linear-equations.md` and `gemini-02-systems-of-linear-equations.md` in this folder.

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

This is **one chapter** (2 of 4) of the Linear Algebra book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Systems of linear equations**. Not written yet.



## The PYQs for this chapter (16)

**2026_FN_Q20** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Matrices, Determinants, & Linear Equation Systems

Let \( n > 1 \). Consider an \( n \times n \) matrix \( M \) with its elements from \( \mathbb{R} \). Let the vector \( (0, 1, 0, 0, \dots, 0)^T \in \mathbb{R}^n \) be in the null space of \( M \).
Which of the following options is/are always correct?

- A) Determinant of \( M \) is 1
- B) Determinant of \( M \) is 0  ✔ official
- C) Rank of \( M \) is 1
- D) There are at least two non-zero vectors in the null space of \( M \)  ✔ official

---

**2026_AN_Q31** · 2026-AN · NAT · 1 mark · Hard · bank topic: Matrices, Determinants, & Linear Equation Systems

Consider the system of linear equations given below.
$$ ax + y = b $$
$$ 16x + ay = 24 $$
Suppose the values of \( a \) and \( b \) are chosen such that the system of linear equations produce multiple solutions. Then the product of \( a \) and \( b \) is ________. (answer in integer)

Official answer (numeric): 24 to 24

---

**2026_AN_Q62** · 2026-AN · NAT · 2 marks · Easy · bank topic: Matrices, Determinants, & Linear Equation Systems

The determinant of a 4 x 4 matrix \( A \) is 3. The value of the determinant of \( 2A \) is ________. (answer in integer)

Official answer (numeric): 48 to 48

---

**2025_AN_Q11** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Matrices, Determinants, & Linear Equation Systems

If \( A = \begin{pmatrix} 1 & 2 \\ 2 & -1 \end{pmatrix} \), then which ONE of the following is \( A^8 \)?

- A) \( \begin{pmatrix} 25 & 0 \\ 0 & 25 \end{pmatrix} \)
- B) \( \begin{pmatrix} 125 & 0 \\ 0 & 125 \end{pmatrix} \)
- C) \( \begin{pmatrix} 625 & 0 \\ 0 & 625 \end{pmatrix} \)  ✔ official
- D) \( \begin{pmatrix} 3125 & 0 \\ 0 & 3125 \end{pmatrix} \)

---

**2025_AN_Q14** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Matrices, Determinants, & Linear Equation Systems

Let \( L \), \( M \), and \( N \) be non-singular matrices of order 3 satisfying the equations
\( L^2 = L^{-1} \), \( M = L^8 \) and \( N = L^2 \).
Which ONE of the following is the value of the determinant of \( (M - N) \)?

- A) 0  ✔ official
- B) 1
- C) 2
- D) 3

---

**2025_FN_Q23** · 2025-FN · MSQ · 1 mark · Medium · bank topic: Matrices, Determinants, & Linear Equation Systems

Consider the given system of linear equations for variables \( x \) and \( y \), where \( k \) is a real-valued constant. Which of the following option(s) is/are CORRECT?
\( x + ky = 1 \)
\( kx + y = -1 \)

- A) There is exactly one value of \( k \) for which the above system of equations has no solution.  ✔ official
- B) There exist an infinite number of values of \( k \) for which the system of equations has no solution.
- C) There exists exactly one value of \( k \) for which the system of equations has exactly one solution.
- D) There exists exactly one value of \( k \) for which the system of equations has an infinite number of solutions.  ✔ official

---

**2024_AN_Q57** · 2024-AN · MSQ · 2 marks · Easy · bank topic: Matrices, Determinants, & Linear Equation Systems

Let \( A \) be an \( n \times n \) matrix over the set of all real numbers \( \mathbb{R} \). Let \( B \) be a matrix obtained from \( A \) by swapping two rows. Which of the following statements is/are TRUE?

- A) The determinant of \( B \) is the negative of the determinant of \( A \).  ✔ official
- B) If \( A \) is invertible, then \( B \) is also invertible.  ✔ official
- C) If \( A \) is symmetric, then \( B \) is also symmetric.
- D) If the trace of \( A \) is zero, then the trace of \( B \) is also zero.

---

**2024_FN_Q52** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Matrices, Determinants, & Linear Equation Systems

Let \( A \) be any \( n \times m \) matrix, where \( m > n \). Which of the following statements is/are TRUE about the system of linear equations \( Ax = 0 \)?

- A) There exist at least \( m - n \) linearly independent solutions to this system  ✔ official
- B) There exist \( m - n \) linearly independent vectors such that every solution is a linear combination of these vectors
- C) There exists a non-zero solution in which at least \( m - n \) variables are 0
- D) There exists a solution in which at least \( n \) variables are non-zero

---

**2023_FN_Q18** · 2023-FN · MCQ · 1 mark · Easy · bank topic: Matrices, Determinants, & Linear Equation Systems

Let and \( A = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 4 & 1 & 2 & 3 \\ 3 & 4 & 1 & 2 \\ 2 & 3 & 4 & 1 \end{bmatrix} \) and \( B = \begin{bmatrix} 3 & 4 & 1 & 2 \\ 4 & 1 & 2 & 3 \\ 1 & 2 & 3 & 4 \\ 2 & 3 & 4 & 1 \end{bmatrix} \)
Let \( \det(A) \) and \( \det(B) \) denote the determinants of the matrices \( A \) and \( B \), respectively. Which one of the options given below is TRUE?

- A) \( \det(A) = \det(B) \)
- B) \( \det(B) = -\det(A) \)  ✔ official
- C) \( \det(A) = 0 \)
- D) \( \det(AB) = \det(A) + \det(B) \)

---

**2022_FN_Q20** · 2022-FN · MCQ · 1 mark · Easy · bank topic: Matrices, Determinants, & Linear Equation Systems

Consider the following two statements with respect to the matrices \(A_{m \times n}\), \(B_{n \times m}\), \(C_{n \times n}\) and \(D_{n \times n}\).
Statement 1: \(tr(AB) = tr(BA)\)
Statement 2: \(tr(CD) = tr(DC)\)
where \(tr( )\) represents the trace of a matrix. Which one of the following holds?

- A) Statement 1 is correct and Statement 2 is wrong.
- B) Statement 1 is wrong and Statement 2 is correct.
- C) Both Statement 1 and Statement 2 are correct.  ✔ official
- D) Both Statement 1 and Statement 2 are wrong.

---

**2021_AN_Q61** · 2021-AN · NAT · 1 mark · Medium · bank topic: Matrices, Determinants, & Linear Equation Systems

Suppose that \(P\) is a \(4 \times 5\) matrix such that every solution of the equation \(Px = 0\) is a scalar multiple of \([2 \; 5 \; 4 \; 3 \; 1]^T\). The rank of \(P\) is _________.

Official answer (numeric): 4 to 4

---

**2020_FN_Q58** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Matrices, Determinants, & Linear Equation Systems

Let A and B be two \( n \times n \) matrices over real numbers. Let rank(M) and det(M) denote the rank and determinant of a matrix M, respectively. Consider the following statements:
I. rank(AB) = rank(A) rank(B)
II. det(AB) = det(A) det(B)
III. rank(A + B) \(\le\) rank(A) + rank(B)
IV. det(A + B) \(\le\) det(A) + det(B)
Which of the above statements are TRUE?

- A) I and II only
- B) I and IV only
- C) II and III only  ✔ official
- D) III and IV only

---

**2019_FN_Q23** · 2019-FN · MCQ · 1 mark · Easy · bank topic: Matrices, Determinants, & Linear Equation Systems

Let X be a square matrix. Consider the following two statements on X.
I. X is invertible.
II. Determinant of X is non-zero.
Which one of the following is TRUE?

- A) I implies II; II does not imply I.
- B) II implies I; I does not imply II.
- C) I does not imply II; II does not imply I.
- D) I and II are equivalent statements.  ✔ official

---

**2017_FN_Q18** · 2017-FN · MCQ · 1 mark · Hard · bank topic: Matrices, Determinants, & Linear Equation Systems

Let \(c_1 \dots c_n\) be scalars, not all zero, such that \(\sum_{i=1}^{n} c_i a_i = 0\) where \(a_i\) are column vectors in \(R^n\).
Consider the set of linear equations
\(Ax = b\)
where \(A = [a_1 \dots a_n]\) and \(b = \sum_{i=1}^{n} a_i\). The set of equations has

- A) a unique solution at \(x = J_n\) where \(J_n\) denotes a \(n\)-dimensional vector of all 1
- B) no solution
- C) infinitely many solutions  ✔ official
- D) finitely many solutions

---

**2017_AN_Q29** · 2017-AN · NAT · 1 mark · Medium · bank topic: Matrices, Determinants, & Linear Equation Systems

Let \(P = \begin{bmatrix} 1 & 1 & -1 \\ 2 & -3 & 4 \\ 3 & -2 & 3 \end{bmatrix}\) and \(Q = \begin{bmatrix} -1 & -2 & -1 \\ 6 & 12 & 6 \\ 5 & 10 & 5 \end{bmatrix}\) be two matrices. Then the rank of P + Q is ________.

Official answer (numeric): 2.0 to 2.0

---

**2017_FN_Q62** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Matrices, Determinants, & Linear Equation Systems

Let \(u\) and \(v\) be two vectors in \(R^2\) whose Euclidean norms satisfy \(||u|| = 2||v||\). What is the value of \(\alpha\) such that \(w = u + \alpha v\) bisects the angle between \(u\) and \(v\)?

- A) 2  ✔ official
- B) 1/2
- C) 1
- D) -1/2

