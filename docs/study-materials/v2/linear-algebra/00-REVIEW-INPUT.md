# In-depth review input: Linear Algebra

**One file, one review.** Paste everything below the line into ChatGPT (new chat), and again into Gemini (new chat). If the chat refuses the length, attach this file and write: "Follow the instructions inside the file."

Save the replies in this folder as `chatgpt-review-linear-algebra.md` and `gemini-review-linear-algebra.md`, then tell me.

Contains: reviewer instructions (A), the subject's contents with the PYQ statistics (B), and all 30 PYQs with full text and the official key (C).

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

This is the **in-depth review of the whole Linear Algebra book**. Take your time. Go chapter by chapter, and give a much deeper answer than a quick review: at least **80 rows** in the gap table in Part 2 (spread across every chapter).

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

- Matrices, determinants.
- System of linear equations.
- Eigenvalues and eigenvectors.
- LU decomposition.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Matrices and determinants | none | not written |
| 02 | Systems of linear equations | none | not written |
| 03 | Eigenvalues and eigenvectors | none | not written |
| 04 | LU decomposition | none | not written |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **30**; marks: **45** = **3.0%** of all 1500 marks (about 3.0 marks a paper).
- Forge (our own) questions for this subject: **11**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Matrices, Determinants, & Linear Equation Systems | 16 | 21 | 1.40% | 9 | 5/9/2 | MSQ1×2, NAT1×3, NAT2×1, MCQ1×6, MSQ2×2, MCQ2×2 |
| Eigenvalues and Eigenvectors | 12 | 20 | 1.33% | 9 | 2/8/2 | MCQ1×2, MCQ2×4, NAT1×2, MSQ2×1, NAT2×3 |
| Matrix Factorization & LU Decomposition | 2 | 4 | 0.27% | 2 | 0/2/0 | MSQ2×1, MCQ2×1 |


---

## PART C. ALL 30 PREVIOUS-YEAR QUESTIONS (Linear Algebra)

Official key marked "✔ official". Figures are not shown; the question says so.

**2026_FN_Q13** · 2026-FN · MCQ · 1 mark · Easy · bank topic: Eigenvalues and Eigenvectors

For \( n > 1 \), the maximum multiplicity of any eigenvalue of an \( n \times n \) matrix with elements from \( \mathbb{R} \) is

- A) \( n \)  ✔ official
- B) \( n - 1 \)
- C) 1
- D) \( n + 1 \)

---

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

**2025_FN_Q41** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Eigenvalues and Eigenvectors

Let \( A \) be a \( 2 \times 2 \) matrix as given.
$$ A = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} $$
What are the eigenvalues of the matrix \( A^{13} \)?

- A) \( 1, -1 \)
- B) \( 2\sqrt{2}, -2\sqrt{2} \)
- C) \( 4\sqrt{2}, -4\sqrt{2} \)
- D) \( 64\sqrt{2}, -64\sqrt{2} \)  ✔ official

---

**2025_AN_Q44** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Matrix Factorization & LU Decomposition

Consider a system of linear equations \( PX = Q \) where \( P \in \mathbb{R}^{3 \times 3} \) and \( Q \in \mathbb{R}^{3 \times 3} \). Suppose \( P \) has an \( LU \) decomposition, \( P = LU \), where
$$ L = \begin{bmatrix} 1 & 0 & 0 \\ l_{21} & 1 & 0 \\ l_{31} & l_{32} & 1 \end{bmatrix} \quad \text{and} \quad U = \begin{bmatrix} u_{11} & u_{12} & u_{13} \\ 0 & u_{22} & u_{23} \\ 0 & 0 & u_{33} \end{bmatrix} $$
Which of the following statement(s) is/are TRUE?

- A) The system \( PX = Q \) can be solved by first solving \( LY = Q \) and then \( UX = Y \).  ✔ official
- B) If \( P \) is invertible, then both \( L \) and \( U \) are invertible.  ✔ official
- C) If \( P \) is singular, then at least one of the diagonal elements of \( U \) is zero.  ✔ official
- D) If \( P \) is symmetric, then both \( L \) and \( U \) are symmetric.

---

**2024_FN_Q13** · 2024-FN · MCQ · 1 mark · Medium · bank topic: Eigenvalues and Eigenvectors

The product of all eigen values of the matrix \( \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix} \) is

- A) -1
- B) 0  ✔ official
- C) 1
- D) 2

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

**2023_FN_Q30** · 2023-FN · NAT · 1 mark · Medium · bank topic: Eigenvalues and Eigenvectors · HAS A FIGURE (not shown here)

Let \( A \) be the adjacency matrix of the graph with vertices \( \{1, 2, 3, 4, 5\} \).
[IMAGE_Q_30_1]
Let \( \lambda_1, \lambda_2, \lambda_3, \lambda_4 \) and \( \lambda_5 \) be the five eigenvalues of \( A \). Note that these eigenvalues need not be distinct.
The value of \( \lambda_1 + \lambda_2 + \lambda_3 + \lambda_4 + \lambda_5 = \) ________.

Official answer (numeric): 2 to 2 OR 4 to 4

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

**2022_FN_Q45** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Matrix Factorization & LU Decomposition

Consider solving the following system of simultaneous equations using \(LU\) decomposition.
$$ x_1 + x_2 - 2x_3 = 4 $$
$$ x_1 + 3x_2 - x_3 = 7 $$
$$ 2x_1 + x_2 - 5x_3 = 7 $$
where \(L\) and \(U\) are denoted as
$$ L = \begin{pmatrix} L_{11} & 0 & 0 \\ L_{21} & L_{22} & 0 \\ L_{31} & L_{32} & L_{33} \end{pmatrix}, U = \begin{pmatrix} U_{11} & U_{12} & U_{13} \\ 0 & U_{22} & U_{23} \\ 0 & 0 & U_{33} \end{pmatrix} $$
Which one of the following is the correct combination of values for \(L_{32}\), \(U_{32}\), and \(x_1\)?

- A) \(L_{32} = 2, U_{33} = -\frac{1}{2}, x_1 = -1\)
- B) \(L_{32} = 2, U_{32} = 2, x_1 = -1\)
- C) \(L_{32} = -\frac{1}{2}, U_{33} = 2, x_1 = 0\)
- D) \(L_{32} = -\frac{1}{2}, U_{33} = -\frac{1}{2}, x_1 = 0\)  ✔ official

---

**2022_FN_Q53** · 2022-FN · MSQ · 2 marks · Hard · bank topic: Eigenvalues and Eigenvectors

Which of the following is/are the eigen vector(s) for the matrix given below?
$$ \begin{pmatrix} -9 & -6 & -2 & -4 \\ -8 & -6 & -3 & -1 \\ 20 & 15 & 8 & 5 \\ 32 & 21 & 7 & 12 \end{pmatrix} $$

- A) $$ \begin{pmatrix} -1 \\ 1 \\ 0 \\ 1 \end{pmatrix} $$  ✔ official
- B) $$ \begin{pmatrix} 1 \\ 0 \\ -1 \\ 0 \end{pmatrix} $$
- C) $$ \begin{pmatrix} -1 \\ 0 \\ 2 \\ 2 \end{pmatrix} $$  ✔ official
- D) $$ \begin{pmatrix} 0 \\ 1 \\ -3 \\ 0 \end{pmatrix} $$  ✔ official

---

**2021_AN_Q61** · 2021-AN · NAT · 1 mark · Medium · bank topic: Matrices, Determinants, & Linear Equation Systems

Suppose that \(P\) is a \(4 \times 5\) matrix such that every solution of the equation \(Px = 0\) is a scalar multiple of \([2 \; 5 \; 4 \; 3 \; 1]^T\). The rank of \(P\) is _________.

Official answer (numeric): 4 to 4

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

