# Review input: Algorithms, chapter 04: Divide and conquer

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-04-divide-and-conquer.md` and `gemini-04-divide-and-conquer.md` in this folder.

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

This is **one chapter** (4 of 9) of the Algorithms book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Divide and conquer**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (6)

**2026_AN_Q32** · 2026-AN · NAT · 1 mark · Hard · bank topic: Divide-and-Conquer Designs

Consider an array \( A = [10, 7, 8, 19, 41, 35, 25, 31] \). Suppose the merge sort algorithm is executed on array \( A \) to sort it in increasing order. The merge sort algorithm will carry out a total of 7 merge operations.
A merge operation on sorted left array \( L \) and sorted right array \( R \) is said to be void if the output of the merge operation is the elements of array \( L \) followed by the elements of array \( R \).
The number of void merge operations among these 7 merge operations is ________. (answer in integer)

Official answer (numeric): 3 to 3

---

**2021_AN_Q57** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Greedy Approach & Divide-and-Conquer Designs

Consider the string abbccdddee. Each letter in the string must be assigned a binary code satisfying the following properties:
1. For any two letters, the code assigned to one letter must not be a prefix of the code assigned to the other letter.
2. For any two letters of the same frequency, the letter which occurs earlier in the dictionary order is assigned a code whose length is at most the length of the code assigned to the other letter.
Among the set of all binary code assignments which satisfy the above two properties, what is the minimum length of the encoded string?

- A) 21
- B) 23  ✔ official
- C) 25
- D) 30

---

**2019_FN_Q14** · 2019-FN · NAT · 1 mark · Hard · bank topic: Divide-and-Conquer Designs

Consider a sequence of 14 elements: A = [–5, –10, 6, 3, –1, –2, 13, 4, –9, –1, 4, 12, –3, 0]. The subsequence sum \( S(i, j) = \sum_{k=i}^{j} A[k] \). Determine the maximum of \( S(i, j) \), where \( 0 \le i \le j < 14 \). (Divide and conquer approach may be used.)

Official answer (numeric): 29 to 29

---

**2018_FN_Q58** · 2018-FN · NAT · 2 marks · Medium · bank topic: Greedy Approach & Divide-and-Conquer Designs

Consider the weights and values of items listed below. Note that there is only one unit of each item.
Item number Weight (in Kgs) Value (in Rupees)
1 10 60
2 7 28
3 4 20
4 2 24
The task is to pick a subset of these items such that their total weight is no more than 11 Kgs and their total value is maximized. Moreover, no item may be split. The total value of items picked by an optimal algorithm is denoted by \(V_{opt}\). A greedy algorithm sorts the items by their value-to-weight ratios in descending order and packs them greedily, starting from the first item in the ordered list. The total value of items picked by the greedy algorithm is denoted by \(V_{greedy}\).
The value of \(V_{opt} - V_{greedy}\) is ____________.

Official answer (numeric): 16 to 16

---

**2017_FN_Q30** · 2017-FN · MCQ · 1 mark · Easy · bank topic: Greedy Approach & Divide-and-Conquer Designs · HAS A FIGURE (not shown here)

Consider the following table:
[IMAGE_Q_30]
Match the algorithms to the design paradigms they are based on.

- A) (P) \(\leftrightarrow\) (ii), (Q) \(\leftrightarrow\) (iii), (R) \(\leftrightarrow\) (i)
- B) (P) \(\leftrightarrow\) (iii), (Q) \(\leftrightarrow\) (i), (R) \(\leftrightarrow\) (ii)
- C) (P) \(\leftrightarrow\) (ii), (Q) \(\leftrightarrow\) (i), (R) \(\leftrightarrow\) (iii)  ✔ official
- D) (P) \(\leftrightarrow\) (i), (Q) \(\leftrightarrow\) (ii), (R) \(\leftrightarrow\) (iii)

---

**2017_AN_Q59** · 2017-AN · NAT · 2 marks · Medium · bank topic: Greedy Approach & Divide-and-Conquer Designs · HAS A FIGURE (not shown here)

A message is made up entirely of characters from the set X = \{P, Q, R, S, T\}. The table of probabilities for each of the characters is shown below:
[IMAGE_Q_59]
If a message of 100 characters over X is encoded using Huffman coding, then the expected length of the encoded message in bits is ________.

Official answer (numeric): 225.0 to 225.0

