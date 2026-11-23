# Review input: Discrete Mathematics, chapter 03: Sets, relations and functions

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-03-sets-relations-and-functions.md` and `gemini-03-sets-relations-and-functions.md` in this folder.

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

This is **one chapter** (3 of 8) of the Discrete Mathematics book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Sets, relations and functions**. Written lessons today: 4 topics ready.



## The PYQs for this chapter (17)

**2026_AN_Q26** · 2026-AN · MSQ · 1 mark · Hard · bank topic: Sets, Relations, Functions, Partial Orders, Lattices

Let \( R \) be a binary relation on the set \( \{1, 2, \dots, 10\} \), where \( (x, y) \in R \) if the product of \( x \) and \( y \) is square of an integer. Which of the following properties is/are satisfied by \( R \)?

- A) Reflexive  ✔ official
- B) Symmetric  ✔ official
- C) Transitive  ✔ official
- D) Antisymmetric

---

**2025_FN_Q17** · 2025-FN · MCQ · 1 mark · Medium · bank topic: Sets, Relations, Functions, Partial Orders, Lattices

\( g(.) \) is a function from \( A \) to \( B \), \( f(.) \) is a function from \( B \) to \( C \), and their composition defined as \( f(g(.)) \) is a mapping from \( A \) to \( C \).
If \( f(.) \) and \( f(g(.)) \) are onto (surjective) functions, which ONE of the following is TRUE about the function \( g(.) \)?

- A) \( g(.) \) must be an onto (surjective) function.
- B) \( g(.) \) must be a one-to-one (injective) function.
- C) \( g(.) \) must be a bijective function, that is, both one-to-one and onto.
- D) \( g(.) \) is not required to be a one-to-one or onto function.  ✔ official

---

**2025_AN_Q42** · 2025-AN · MSQ · 2 marks · Hard · bank topic: Sets, Relations, Functions, Partial Orders, Lattices

Let \( F \) be the set of all functions from \( \{1, \dots, n\} \) to \( \{0, 1\} \). Define the binary relation \( \preceq \) on \( F \) as follows:
\( \forall f, g \in F, f \preceq g \) if and only if \( \forall x \in \{1, \dots, n\}, f(x) \le g(x) \), where \( 0 \le 1 \).
Which of the following statement(s) is/are TRUE?

- A) \( \preceq \) is a symmetric relation
- B) \( (F, \preceq) \) is a partial order  ✔ official
- C) \( (F, \preceq) \) is a lattice  ✔ official
- D) \( \preceq \) is an equivalence relation

---

**2024_AN_Q20** · 2024-AN · MCQ · 1 mark · Medium · bank topic: Recurrence Relations and Generating Functions

Let \( T(n) \) be the recurrence relation defined as follows:
\( T(0) = 1 \),
\( T(1) = 2 \) and
\( T(n) = 5T(n - 1) - 6T(n - 2) \) for \( n \ge 2 \)
Which one of the following statements is TRUE?

- A) \( T(n) = \Theta(2^n) \)  ✔ official
- B) \( T(n) = \Theta(n2^n) \)
- C) \( T(n) = \Theta(3^n) \)
- D) \( T(n) = \Theta(n3^n) \)

---

**2024_FN_Q28** · 2024-FN · NAT · 1 mark · Hard · bank topic: Sets, Relations, Functions, Partial Orders, Lattices

Let \( A \) and \( B \) be non-empty finite sets such that there exist one-to-one and onto functions (i) from \( A \) to \( B \) and (ii) from \( A \times A \) to \( A \cup B \). The number of possible values of \( |A| \) is ________.

Official answer (numeric): 2 to 2

---

**2024_AN_Q18** · 2024-AN · NAT · 1 mark · Medium · bank topic: Sets, Relations, Functions, Partial Orders, Lattices

Let \( P \) be the partial order defined on the set \( \{1, 2, 3, 4\} \) as follows:
\[ P = \{(x, x) \mid x \in \{1, 2, 3, 4\}\} \cup \{(1, 2), (3, 2), (3, 4)\} \]
The number of total orders on \( \{1, 2, 3, 4\} \) that contain \( P \) is ________.

Official answer (numeric): 5 to 5

---

**2023_FN_Q15** · 2023-FN · MCQ · 1 mark · Hard · bank topic: Recurrence Relations and Generating Functions

The Lucas sequence \( L_n \) is defined by the recurrence relation:
\[ L_n = L_{n-1} + L_{n-2}, \text{ for } n \ge 3, \]
with \( L_1 = 1 \) and \( L_2 = 3 \).
Which one of the options given is TRUE?

- A) \( L_n = \left(\frac{1 + \sqrt{5}}{2}\right)^n + \left(\frac{1 - \sqrt{5}}{2}\right)^n \)  ✔ official
- B) \( L_n = \left(\frac{1 + \sqrt{5}}{2}\right)^n - \left(\frac{1 - \sqrt{5}}{3}\right)^n \)
- C) \( L_n = \left(\frac{1 + \sqrt{5}}{2}\right)^n + \left(\frac{1 - \sqrt{5}}{3}\right)^n \)
- D) \( L_n = \left(\frac{1 + \sqrt{5}}{2}\right)^n - \left(\frac{1 - \sqrt{5}}{2}\right)^n \)

---

**2023_FN_Q49** · 2023-FN · MSQ · 2 marks · Hard · bank topic: Sets, Relations, Functions, Partial Orders, Lattices

Let \(f : A \rightarrow B\) be an onto (or surjective) function, where \(A\) and \(B\) are non-empty sets. Define an equivalence relation \(\sim\) on the set \(A\) as
\(a_1 \sim a_2\) if \(f(a_1) = f(a_2)\),
where \(a_1, a_2 \in A\). Let \(\epsilon = \{[x] : x \in A\}\) be the set of all the equivalence classes under \(\sim\).
Define a new mapping \(F : \epsilon \rightarrow B\) as
\(F([x]) = f(x)\), for all the equivalence classes \([x]\) in \(\epsilon\).
Which of the following statements is/are TRUE?

- A) \(F\) is NOT well-defined.
- B) \(F\) is an onto (or surjective) function.  ✔ official
- C) \(F\) is a one-to-one (or injective) function.  ✔ official
- D) \(F\) is a bijective function.  ✔ official

---

**2022_FN_Q36** · 2022-FN · MCQ · 2 marks · Hard · bank topic: Recurrence Relations and Generating Functions

Which one of the following is the closed form for the generating function of the sequence \(\{a_n\}_{n \geq 0}\) defined below?
$$ a_n = \begin{cases} n + 1, & n \text{ is odd} \\ 1, & \text{otherwise} \end{cases} $$

- A) \(\frac{x(1+x^2)}{(1-x^2)^2} + \frac{1}{1-x}\)  ✔ official
- B) \(\frac{x(3-x^2)}{(1-x^2)^2} + \frac{1}{1-x}\)
- C) \(\frac{2x}{(1-x^2)^2} + \frac{1}{1-x}\)
- D) \(\frac{x}{(1-x^2)^2} + \frac{1}{1-x}\)

---

**2022_FN_Q51** · 2022-FN · MSQ · 2 marks · Hard · bank topic: Recurrence Relations and Generating Functions

Consider the following recurrence:
$$ f(1) = 1; $$
$$ f(2n) = 2f(n) - 1, \text{ for } n \geq 1; $$
$$ f(2n + 1) = 2f(n) + 1, \text{ for } n \geq 1; $$
Then, which of the following statements is/are TRUE?

- A) \(f(2^n - 1) = 2^n - 1\)  ✔ official
- B) \(f(2^n) = 1\)  ✔ official
- C) \(f(5.2^n) = 2^{n+1} + 1\)  ✔ official
- D) \(f(2^n + 1) = 2^n + 1\)

---

**2021_AN_Q27** · 2021-AN · MSQ · 1 mark · Hard · bank topic: Sets, Relations, Functions, Partial Orders, Lattices

Consider the following sets, where \(n \geq 2\):
\(S_1\) : Set of all \(n \times n\) matrices with entries from the set \(\{a, b, c\}\)
\(S_2\) : Set of all functions from the set \(\{0, 1, 2, ....., n^2 - 1\}\) to the set \(\{0, 1, 2\}\)
Which of the following choice(s) is/are correct?

- A) There does not exist a bijection from \(S_1\) to \(S_2\).
- B) There exists a surjection from \(S_1\) to \(S_2\).  ✔ official
- C) There exists a bijection from \(S_1\) to \(S_2\).  ✔ official
- D) There does not exist an injection from \(S_1\) to \(S_2\).

---

**2021_FN_Q29** · 2021-FN · MSQ · 2 marks · Hard · bank topic: Sets, Relations, Functions, Partial Orders, Lattices

A relation \(R\) is said to be circular if \(aRb\) and \(bRc\) together imply \(cRa\).
Which of the following options is/are correct?

- A) If a relation \(S\) is reflexive and symmetric, then \(S\) is an equivalence relation.
- B) If a relation \(S\) is circular and symmetric, then \(S\) is an equivalence relation.
- C) If a relation \(S\) is reflexive and circular, then \(S\) is an equivalence relation.  ✔ official
- D) If a relation \(S\) is transitive and circular, then \(S\) is an equivalence relation.

---

**2020_FN_Q11** · 2020-FN · NAT · 1 mark · Medium · bank topic: Sets, Relations, Functions, Partial Orders, Lattices

Let \( R \) be the set of all binary relations on the set \( \{1, 2, 3\} \). Suppose a relation is chosen from \( R \) at random. The probability that the chosen relation is reflexive (round off to 3 decimal places) is ________.

Official answer (numeric): 0.125 to 0.125

---

**2018_FN_Q11** · 2018-FN · MCQ · 1 mark · Medium · bank topic: Recurrence Relations and Generating Functions

Which one of the following is a closed form expression for the generating function of the sequence \(\{a_n\}\), where \(a_n = 2n + 3\) for all \(n = 0, 1, 2, \dots\) ?

- A) \(\frac{3}{(1 - x)^2}\)
- B) \(\frac{3x}{(1 - x)^2}\)
- C) \(\frac{2 - x}{(1 - x)^2}\)
- D) \(\frac{3 - x}{(1 - x)^2}\)  ✔ official

---

**2018_FN_Q37** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Sets, Relations, Functions, Partial Orders, Lattices

Let \(N\) be the set of natural numbers. Consider the following sets.
 \(P\): Set of Rational numbers (positive and negative)
 \(Q\): Set of functions from \(\{0, 1\}\) to \(N\)
 \(R\): Set of functions from \(N\) to \(\{0, 1\}\)
 \(S\): Set of finite subsets of \(N\).
Which of the sets above are countable?

- A) \(Q\) and \(S\) only
- B) \(P\) and \(S\) only
- C) \(P\) and \(R\) only
- D) \(P\), \(Q\) and \(S\) only  ✔ official

---

**2017_AN_Q28** · 2017-AN · NAT · 1 mark · Medium · bank topic: Sets, Relations, Functions, Partial Orders, Lattices · HAS A FIGURE (not shown here)

Consider the set X = {a, b, c, d, e} under the partial ordering
R = {(a, a), (a, b), (a, c), (a, d), (a, e), (b, b), (b, c), (b, e), (c, c), (c, e), (d, d), (d, e), (e, e)}.
The Hasse diagram of the partial order (X, R) is shown below:
[IMAGE_Q_28]
The minimum number of ordered pairs that need to be added to R to make (X, R) a lattice is ________.

Official answer (numeric): -0.01 to 0.01

---

**2017_AN_Q48** · 2017-AN · NAT · 2 marks · Hard · bank topic: Recurrence Relations and Generating Functions

If the ordinary generating function of a sequence \(\{a_n\}_{n=0}^{\infty}\) is \(\frac{1 + z}{(1 - z)^3}\), then \(a_3 - a_0\) is equal to ________

Official answer (numeric): 15.0 to 15.0

