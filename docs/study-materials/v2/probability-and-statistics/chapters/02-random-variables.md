# Review input: Probability and Statistics, chapter 02: Random variables

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-02-random-variables.md` and `gemini-02-random-variables.md` in this folder.

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

This is **one chapter** (2 of 4) of the Probability and Statistics book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Random variables**. Not written yet.



## The PYQs for this chapter (11)

**2026_FN_Q58** · 2026-FN · NAT · 2 marks · Easy · bank topic: Random Variables & Sampling Rules

Let \( X \) be a random variable which takes values in the set \( \{1, 2, 3, 4, 5, 6, 7, 8\} \).
Further, \( \Pr(X = 1) = \Pr(X = 2) = \Pr(X = 5) = \Pr(X = 7) = \frac{1}{6} \) and \( \Pr(X = 3) = \Pr(X = 4) = \Pr(X = 6) = \Pr(X = 8) = \frac{1}{12} \).
The expected value of \( X \), denoted by \( E[X] \), is equal to ________. (rounded off to two decimal places)

Official answer (numeric): 4.24 to 4.26

---

**2025_AN_Q64** · 2025-AN · NAT · 2 marks · Hard · bank topic: Random Variables & Sampling Rules

A quadratic polynomial \( (x - \alpha)(x - \beta) \) over complex numbers is said to be square invariant if \( (x - \alpha)(x - \beta) = (x - \alpha^2)(x - \beta^2) \). Suppose from the set of all square invariant quadratic polynomials we choose one at random.
The probability that the roots of the chosen polynomial are equal is (rounded off to one decimal place)

Official answer (numeric): 0.5 to 0.5

---

**2024_FN_Q34** · 2024-FN · MCQ · 1 mark · Hard · bank topic: Random Variables & Sampling Rules

Consider a permutation sampled uniformly at random from the set of all permutations of \( \{1, 2, 3, \dots, n\} \) for some \( n \ge 4 \). Let \( X \) be the event that 1 occurs before 2 in the permutation, and \( Y \) the event that 3 occurs before 4. Which one of the following statements is TRUE?

- A) The events \( X \) and \( Y \) are mutually exclusive
- B) The events \( X \) and \( Y \) are independent  ✔ official
- C) Either event \( X \) or \( Y \) must occur
- D) Event \( X \) is more likely than event \( Y \)

---

**2024_AN_Q33** · 2024-AN · MCQ · 1 mark · Medium · bank topic: Random Variables & Sampling Rules

When six unbiased dice are rolled simultaneously, the probability of getting all distinct numbers (i.e. 1, 2, 3, 4, 5 and 6) is

- A) \( \frac{1}{324} \)
- B) \( \frac{5}{324} \)  ✔ official
- C) \( \frac{7}{324} \)
- D) \( \frac{11}{324} \)

---

**2024_AN_Q52** · 2024-AN · MCQ · 2 marks · Hard · bank topic: Random Variables & Sampling Rules

Let \( x \) and \( y \) be random variables, not necessarily independent, that take real values in the interval [0,1]. Let \( z = xy \) and let the mean values of \( x, y, z \) be \( \overline{x}, \overline{y}, \overline{z} \) respectively. Which one of the following statements is TRUE?

- A) \( \overline{z} = \overline{x} \overline{y} \)
- B) \( \overline{z} \le \overline{x} \overline{y} \)
- C) \( \overline{z} \ge \overline{x} \overline{y} \)
- D) \( \overline{z} \le \overline{x} \)  ✔ official

---

**2021_AN_Q24** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Random Variables & Sampling Rules

In an examination, a student can choose the order in which two questions (QuesA and QuesB) must be attempted.
• If the first question is answered wrong, the student gets zero marks.
• If the first questions is answered correctly and the second question is not answered correctly, the student gets the marks only for the first question.
• If both the questions are answered correctly, the student gets the sum of the marks of the two questions.
The following table shows the probability of correctly answering a question and the marks of the question respectively.

| Question | Probability of answering correctly | Marks |
|---|---|---|
| QuesA | 0.8 | 10 |
| QuesB | 0.5 | 20 |

Assuming that the student always wants to maximize her expected marks in the examination, in which order should she attempt the questions and what is the expected marks for that order (assume that the questions are independent)?

- A) First QuesA and then QuesB. Expected marks 14.
- B) First QuesB and then QuesA. Expected marks 14.
- C) First QuesB and then QuesA. Expected marks 22.
- D) First QuesA and then QuesB. Expected marks 16.  ✔ official

---

**2021_FN_Q12** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Random Variables & Sampling Rules

Consider the two statements:
\(S_1\) : There exist random variables X and Y such that
\((E[(X - E(X))(Y - E(Y))])^2 > \text{Var}[X]\,\text{Var}[Y]\)
\(S_2\) : For all random variables X and Y
\(\text{Cov}[X, Y] = E[|X - E[X]| |Y - E[Y]|]\)
Which one of the following choices is correct?

- A) Both \(S_1\) and \(S_2\) are true.
- B) \(S_1\) is true, but \(S_2\) is false.
- C) \(S_1\) is false, but \(S_2\) is true.
- D) Both \(S_1\) and \(S_2\) are false.  ✔ official

---

**2020_FN_Q50** · 2020-FN · NAT · 2 marks · Medium · bank topic: Random Variables & Sampling Rules

For \( n > 2 \), let \( a \in \{0,1\}^n \) be a non-zero vector. Suppose that \( x \) is chosen uniformly at random from \( \{0, 1\}^n \). Then, the probability that \( \sum_{i=1}^n a_i x_i \) is an odd number is ________.

Official answer (numeric): 0.5 to 0.5

---

**2019_FN_Q16** · 2019-FN · NAT · 1 mark · Hard · bank topic: Random Variables & Sampling Rules

Two numbers are chosen independently and uniformly at random from the set {1, 2, ...,13}. The probability (rounded off to 3 decimal places) that their 4-bit (unsigned) binary representations have the same most significant bit is ________.

Official answer (numeric): 0.502 to 0.504

---

**2019_FN_Q53** · 2019-FN · NAT · 2 marks · Hard · bank topic: Random Variables & Sampling Rules

Let T be a full binary tree with 8 leaves. (A full binary tree has every level full.) Suppose two leaves \( a \) and \( b \) of T are chosen uniformly and independently at random. The expected value of the distance between \( a \) and \( b \) in T (i.e., the number of edges in the unique path between \( a \) and \( b \)) is (rounded off to 2 decimal places) ________.

Official answer (numeric): 4.25 to 4.25

---

**2017_AN_Q44** · 2017-AN · MCQ · 2 marks · Hard · bank topic: Random Variables & Sampling Rules

For any discrete random variable X, with probability mass function \(P(X = j) = p_j, p_j \geq 0, j \in \{0 \dots N\}\), and \(\sum_{j=0}^{N} p_j = 1\), define the polynomial function \(g_X(z) = \sum_{j=0}^{N} p_j z^j\). For a certain discrete random variable Y, there exists a scalar \(\beta \in [0, 1]\) such that \(g_Y(z) = (1 - \beta + \beta z)^N\). The expectation of Y is

- A) \(N\beta(1 - \beta)\)
- B) \(N\beta\)  ✔ official
- C) \(N(1 - \beta)\)
- D) Not expressible in terms of \(N\) and \(\beta\) alone

