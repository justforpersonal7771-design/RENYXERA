# Review input: Algorithms, chapter 06: Dynamic programming

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-06-dynamic-programming.md` and `gemini-06-dynamic-programming.md` in this folder.

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

This is **one chapter** (6 of 9) of the Algorithms book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Dynamic programming**. Written lessons today: 4 topics ready.



## The PYQs for this chapter (4)

**2026_AN_Q39** · 2026-AN · MCQ · 2 marks · Hard · bank topic: Dynamic Programming Infrastructure

Consider a table \( T \), where the elements \( T[i][j], 0 \le i, j \le n \), represent the cost of the optimal solutions of different subproblems of a problem that is being solved using a dynamic programming algorithm. The recursive formulation to compute the table entries is as follows:
\( T[0][k] = T[k][0] = 1 \) for \( k = 0, 1, 2, \dots, n \)
\( T[i][j] = 2T[i - 1][j] + 3T[i][j - 1] \) for \( 1 \le i, j \le n \)
Consider the following two algorithms to compute entries of \( T \). Assume that for both the algorithms, for all \( 0 \le i, j \le n \), \( T[i][j] \) has been initialized to 1.
Algorithm \( B_1 \): For \( i = 1, 2, \dots, n \)
For \( j = 1, 2, \dots, n \)
\( T[i][j] = 2T[i - 1][j] + 3T[i][j - 1] \)
Algorithm \( B_2 \): For \( s = 2, 3, \dots, 2n \)
For \( i = 1, 2, \dots, n \)
For \( j = 1, 2, \dots, n \)
If \( (i + j == s) \)
\( T[i][j] = 2T[i - 1][j] + 3T[i][j - 1] \)
Algorithm \( B_k, k \in \{1, 2\} \) is said to be correct if and only if it calculates the correct values of \( T[i][j] \), for all \( 0 \le i, j \le n \), (as per the recursive formulation) at the end of the execution of the algorithm \( B_k \).
Which one of the following statements is true?

- A) Both algorithms \( B_1 \) and \( B_2 \) are correct  ✔ official
- B) Algorithm \( B_1 \) is correct, but algorithm \( B_2 \) is incorrect
- C) Algorithm \( B_2 \) is correct, but algorithm \( B_1 \) is incorrect
- D) Both algorithms \( B_1 \) and \( B_2 \) are incorrect

---

**2024_AN_Q11** · 2024-AN · NAT · 1 mark · Medium · bank topic: Dynamic Programming Infrastructure

Let \( A \) be an array containing integer values. The distance of \( A \) is defined as the minimum number of elements in \( A \) that must be replaced with another integer so that the resulting array is sorted in non-decreasing order. The distance of the array [2, 5, 3, 1, 4, 2, 6] is ________.

Official answer (numeric): 3 to 3

---

**2021_FN_Q17** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Dynamic Programming Infrastructure

Define \(R_n\) to be the maximum amount earned by cutting a rod of length \(n\) meters into one or more pieces of integer length and selling them. For \(i > 0\), let \(p[i]\) denote the selling price of a rod whose length is \(i\) meters. Consider the array of prices:
\(p[1] = 1, p[2] = 5, p[3] = 8, p[4] = 9, p[5] = 10, p[6] = 17, p[7] = 18\)
Which of the following statements is/are correct about \(R_7\)?

- A) \(R_7 = 18\)  ✔ official
- B) \(R_7 = 19\)
- C) \(R_7\) is achieved by three different solutions.  ✔ official
- D) \(R_7\) cannot be achieved by a solution consisting of three pieces.

---

**2018_FN_Q41** · 2018-FN · MCQ · 2 marks · Hard · bank topic: Dynamic Programming Infrastructure

Assume that multiplying a matrix \(G_1\) of dimension \(p \times q\) with another matrix \(G_2\) of dimension \(q \times r\) requires \(pqr\) scalar multiplications. Computing the product of \(n\) matrices \(G_1G_2G_3\dots G_n\) can be done by parenthesizing in different ways. Define \(G_i G_{i+1}\) as an explicitly computed pair for a given paranthesization if they are directly multiplied. For example, in the matrix multiplication chain \(G_1G_2G_3G_4G_5G_6\) using parenthesization \((G_1(G_2G_3))(G_4(G_5G_6))\), \(G_2G_3\) and \(G_5G_6\) are the only explicitly computed pairs.
Consider a matrix multiplication chain \(F_1F_2F_3F_4F_5\), where matrices \(F_1, F_2, F_3, F_4\) and \(F_5\) are of dimensions \(2 \times 25, 25 \times 3, 3 \times 16, 16 \times 1\) and \(1 \times 1000\), respectively. In the parenthesization of \(F_1F_2F_3F_4F_5\) that minimizes the total number of scalar multiplications, the explicitly computed pairs is/are

- A) \(F_1F_2\) and \(F_3F_4\) only
- B) \(F_2F_3\) only
- C) \(F_3F_4\) only  ✔ official
- D) \(F_1F_2\) and \(F_4F_5\) only

