# Review input: Discrete Mathematics, chapter 07: Counting and combinatorics

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-07-counting-and-combinatorics.md` and `gemini-07-counting-and-combinatorics.md` in this folder.

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

This is **one chapter** (7 of 8) of the Discrete Mathematics book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Counting and combinatorics**. Written lessons today: 4 topics ready.



## The PYQs for this chapter (10)

**2026_FN_Q12** · 2026-FN · MCQ · 1 mark · Hard · bank topic: Combinatorics (Counting Rules, Summation Formulas)

Consider \( 4 \times 4 \) matrices with their elements from \( \{0, 1\} \). The number of such matrices with even number of 1s in every row and every column is

- A) 512  ✔ official
- B) 1025
- C) 1023
- D) 255

---

**2026_FN_Q57** · 2026-FN · NAT · 2 marks · Hard · bank topic: Combinatorics (Counting Rules, Summation Formulas)

Let \( G \) be an undirected graph, which is a path on 8 vertices. The number of matchings in \( G \) is ________. (answer in integer)

Official answer (numeric): 34 to 34

---

**2025_FN_Q30** · 2025-FN · NAT · 1 mark · Medium · bank topic: Combinatorics (Counting Rules, Summation Formulas)

Let \( S \) be the set of all ternary strings defined over the alphabet \( \{a, b, c\} \). Consider all strings in \( S \) that contain at least one occurrence of two consecutive symbols, that is, “aa”, “bb” or “cc”. The number of such strings of length 5 that are possible is ________. (Answer in integer)

Official answer (numeric): 195 to 195

---

**2023_FN_Q48** · 2023-FN · MCQ · 2 marks · Hard · bank topic: Combinatorics (Counting Rules, Summation Formulas)

Let \( U = \{1, 2, \dots, n\} \), where \( n \) is a large positive integer greater than 1000. Let \( k \) be a positive integer less than \( n \). Let \( A, B \) be subsets of \( U \) with \( |A| = |B| = k \) and \( A \cap B = \phi \). We say that a permutation of \( U \) separates \( A \) from \( B \) if one of the following is true.
- All members of \( A \) appear in the permutation before any of the members of \( B \).
- All members of \( B \) appear in the permutation before any of the members of \( A \).
How many permutations of \( U \) separate \( A \) from \( B \)?

- A) \( n! \)
- B) \( \binom{n}{2k} (n - 2k)! \)
- C) \( \binom{n}{2k} (n - 2k)! (k!)^2 \)
- D) \( 2 \binom{n}{2k} (n - 2k)! (k!)^2 \)  ✔ official

---

**2022_FN_Q32** · 2022-FN · NAT · 1 mark · Medium · bank topic: Combinatorics (Counting Rules, Summation Formulas)

The number of arrangements of six identical balls in three identical bins is _________.

Official answer (numeric): 7 to 7

---

**2021_FN_Q21** · 2021-FN · NAT · 1 mark · Hard · bank topic: Combinatorics (Counting Rules, Summation Formulas)

There are 6 jobs with distinct difficulty levels, and 3 computers with distinct processing speeds. Each job is assigned to a computer such that:
• The fastest computer gets the toughest job and the slowest computer gets the easiest job.
• Every computer gets at least one job.
The number of ways in which this can be done is _________.

Official answer (numeric): 65 to 65

---

**2021_AN_Q37** · 2021-AN · NAT · 2 marks · Medium · bank topic: Combinatorics (Counting Rules, Summation Formulas)

Let \(S\) be a set consisting of 10 elements. The number of tuples of the form \((A, B)\) such that \(A\) and \(B\) are subsets of \(S\) and \(A \subseteq B\) is _________.

Official answer (numeric): 59049 to 59049

---

**2020_FN_Q52** · 2020-FN · NAT · 2 marks · Medium · bank topic: Combinatorics (Counting Rules, Summation Formulas)

The number of permutations of the characters in LILAC so that no character appears in its original position, if the two L's are indistinguishable, is ________.

Official answer (numeric): 12 to 12

---

**2019_FN_Q26** · 2019-FN · MCQ · 1 mark · Hard · bank topic: Combinatorics (Counting Rules, Summation Formulas)

Let \( U = \{1, 2, ..., n\} \) and \( A = \{(x, X), x \in X \text{ and } X \subseteq U\} \). Consider the following two statements on \( |A| \).
I. \( |A| = n.2^{n - 1} \)
II. \( |A| = \sum_{k=1}^{n} k \cdot \binom{n}{k} \)
Which of the following is correct?

- A) Only I
- B) Only II
- C) Both I and II  ✔ official
- D) Neither I nor II

---

**2017_FN_Q41** · 2017-FN · NAT · 2 marks · Medium · bank topic: Combinatorics (Counting Rules, Summation Formulas)

The number of integers between 1 and 500 (both inclusive) that are divisible by 3 or 5 or 7 is ________.

Official answer (numeric): 271.0 to 271.0

