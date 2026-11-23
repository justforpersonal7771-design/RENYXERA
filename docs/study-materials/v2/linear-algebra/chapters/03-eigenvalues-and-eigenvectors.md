# Review input: Linear Algebra, chapter 03: Eigenvalues and eigenvectors

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-03-eigenvalues-and-eigenvectors.md` and `gemini-03-eigenvalues-and-eigenvectors.md` in this folder.

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

This is **one chapter** (3 of 4) of the Linear Algebra book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Eigenvalues and eigenvectors**. Not written yet.



## The PYQs for this chapter (12)

**2026_FN_Q13** · 2026-FN · MCQ · 1 mark · Easy · bank topic: Eigenvalues and Eigenvectors

For \( n > 1 \), the maximum multiplicity of any eigenvalue of an \( n \times n \) matrix with elements from \( \mathbb{R} \) is

- A) \( n \)  ✔ official
- B) \( n - 1 \)
- C) 1
- D) \( n + 1 \)

---

**2025_FN_Q41** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Eigenvalues and Eigenvectors

Let \( A \) be a \( 2 \times 2 \) matrix as given.
$$ A = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} $$
What are the eigenvalues of the matrix \( A^{13} \)?

- A) \( 1, -1 \)
- B) \( 2\sqrt{2}, -2\sqrt{2} \)
- C) \( 4\sqrt{2}, -4\sqrt{2} \)
- D) \( 64\sqrt{2}, -64\sqrt{2} \)  ✔ official

---

**2024_FN_Q13** · 2024-FN · MCQ · 1 mark · Medium · bank topic: Eigenvalues and Eigenvectors

The product of all eigen values of the matrix \( \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix} \) is

- A) -1
- B) 0  ✔ official
- C) 1
- D) 2

---

**2023_FN_Q30** · 2023-FN · NAT · 1 mark · Medium · bank topic: Eigenvalues and Eigenvectors · HAS A FIGURE (not shown here)

Let \( A \) be the adjacency matrix of the graph with vertices \( \{1, 2, 3, 4, 5\} \).
[IMAGE_Q_30_1]
Let \( \lambda_1, \lambda_2, \lambda_3, \lambda_4 \) and \( \lambda_5 \) be the five eigenvalues of \( A \). Note that these eigenvalues need not be distinct.
The value of \( \lambda_1 + \lambda_2 + \lambda_3 + \lambda_4 + \lambda_5 = \) ________.

Official answer (numeric): 2 to 2 OR 4 to 4

---

**2022_FN_Q53** · 2022-FN · MSQ · 2 marks · Hard · bank topic: Eigenvalues and Eigenvectors

Which of the following is/are the eigen vector(s) for the matrix given below?
$$ \begin{pmatrix} -9 & -6 & -2 & -4 \\ -8 & -6 & -3 & -1 \\ 20 & 15 & 8 & 5 \\ 32 & 21 & 7 & 12 \end{pmatrix} $$

- A) $$ \begin{pmatrix} -1 \\ 1 \\ 0 \\ 1 \end{pmatrix} $$  ✔ official
- B) $$ \begin{pmatrix} 1 \\ 0 \\ -1 \\ 0 \end{pmatrix} $$
- C) $$ \begin{pmatrix} -1 \\ 0 \\ 2 \\ 2 \end{pmatrix} $$  ✔ official
- D) $$ \begin{pmatrix} 0 \\ 1 \\ -3 \\ 0 \end{pmatrix} $$  ✔ official

---

**2021_AN_Q44** · 2021-AN · MCQ · 2 marks · Easy · bank topic: Eigenvalues and Eigenvectors

For two \(n\)-dimensional real vectors \(P\) and \(Q\), the operation \(s(P, Q)\) is defined as follows:
$$ s(P, Q) = \sum_{i=1}^{n} (P[i] . Q[i]) $$
Let \(\mathcal{L}\) be a set of 10-dimensional non-zero real vectors such that for every pair of distinct vectors \(P, Q \in \mathcal{L}\), \(s(P, Q) = 0\). What is the maximum cardinality possible for the set \(\mathcal{L}\)?

- A) 9
- B) 10  ✔ official
- C) 11
- D) 100

---

**2021_FN_Q15** · 2021-FN · NAT · 2 marks · Medium · bank topic: Eigenvalues and Eigenvectors

Consider the following matrix:
$$ \begin{pmatrix} 0 & 1 & 1 & 1 \\ 1 & 0 & 1 & 1 \\ 1 & 1 & 0 & 1 \\ 1 & 1 & 1 & 0 \end{pmatrix} $$
The largest eigenvalue of the above matrix is _________.

Official answer (numeric): 3 to 3

---

**2019_FN_Q45** · 2019-FN · NAT · 2 marks · Medium · bank topic: Eigenvalues and Eigenvectors

Consider the following matrix:
\( R = \begin{bmatrix} 1 & 2 & 4 & 8 \\ 1 & 3 & 9 & 27 \\ 1 & 4 & 16 & 64 \\ 1 & 5 & 25 & 125 \end{bmatrix} \)
The absolute value of the product of Eigen values of R is ________.

Official answer (numeric): 12 to 12

---

**2018_FN_Q27** · 2018-FN · NAT · 1 mark · Medium · bank topic: Eigenvalues and Eigenvectors

Consider a matrix \(A = uv^T\) where \(u = \begin{pmatrix} 1 \\ 2 \end{pmatrix}, v = \begin{pmatrix} 1 \\ 1 \end{pmatrix}\). Note that \(v^T\) denotes the transpose of \(v\). The largest eigenvalue of \(A\) is _____.

Official answer (numeric): 3 to 3

---

**2018_FN_Q36** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Eigenvalues and Eigenvectors

Consider a matrix \(P\) whose only eigenvectors are the multiples of \(\begin{bmatrix} 1 \\ 4 \end{bmatrix}\).
Consider the following statements.
(I) \(P\) does not have an inverse
(II) \(P\) has a repeated eigenvalue
(III) \(P\) cannot be diagonalized
Which one of the following options is correct?

- A) Only I and III are necessarily true
- B) Only II is necessarily true
- C) Only I and II are necessarily true
- D) Only II and III are necessarily true  ✔ official

---

**2017_FN_Q44** · 2017-FN · MCQ · 2 marks · Hard · bank topic: Eigenvalues and Eigenvectors

Let \(A\) be \(n \times n\) real valued square symmetric matrix of rank 2 with \(\sum_{i=1}^{n} \sum_{j=1}^{n} A_{ij}^2 = 50\).
Consider the following statements.
I. One eigenvalue must be in \([-5, 5]\)
II. The eigenvalue with the largest magnitude must be strictly greater than 5.
Which of the above statements about eigenvalues of \(A\) is/are necessarily CORRECT?

- A) Both I and II
- B) I only  ✔ official
- C) II only
- D) Neither I nor II

---

**2017_AN_Q51** · 2017-AN · NAT · 2 marks · Medium · bank topic: Eigenvalues and Eigenvectors

If the characteristic polynomial of a \(3 \times 3\) matrix M over \(\mathbb{R}\) (the set of real numbers) is \(\lambda^3 - 4\lambda^2 + a\lambda + 30\), \(a \in \mathbb{R}\), and one eigenvalue of M is 2, then the largest among the absolute values of the eigenvalues of M is ________.

Official answer (numeric): 5.0 to 5.0

