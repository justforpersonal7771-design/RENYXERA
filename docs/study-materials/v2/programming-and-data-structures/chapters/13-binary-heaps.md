# Review input: Programming and Data Structures, chapter 13: Binary heaps

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-13-binary-heaps.md` and `gemini-13-binary-heaps.md` in this folder.

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

This is **one chapter** (13 of 16) of the Programming and Data Structures book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

### 13 · Binary heaps  (High weight; 10 PYQs, 16 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| D10 Binary heaps: array form, insert, delete, build-heap, heap sort, positions | [MUST] | 8 | 2026_FN_Q23, 2025_FN_Q35, 2024_FN_Q42, 2024_FN_Q54, 2023_FN_Q12, 2023_FN_Q46, 2021_AN_Q21, 2020_FN_Q36, 2019_FN_Q38, 2018_FN_Q56 | Leaf indices, height of a 32-key heap, heapify result, where the maximum sits (105 keys, 1023 keys), counting heaps (7 keys = 80). |




## The PYQs for this chapter (10)

**2026_FN_Q23** · 2026-FN · MSQ · 1 mark · Medium · bank topic: BSTs & Binary Heaps

Let \( n \) be an odd number greater than 100. Consider a binary minheap with \( n \) elements stored in an array \( P \) whose index starts from 1.
Which of the following indices of \( P \) do/does NOT correspond to any leaf node of the minheap?

- A) \( \frac{n+1}{2} \)
- B) \( \frac{n-1}{2} \)  ✔ official
- C) \( \frac{n-3}{2} \)  ✔ official
- D) \( n \)

---

**2025_FN_Q35** · 2025-FN · NAT · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps

The height of any rooted tree is defined as the maximum number of edges in the path from the root node to any leaf node.
Suppose a Min-Heap \( T \) stores 32 keys. The height of \( T \) is ________. (Answer in integer)

Official answer (numeric): 5 to 5

---

**2024_FN_Q42** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps

An array [82, 101, 90, 11, 111, 75, 33, 131, 44, 93] is heapified. Which one of the following options represents the first three elements in the heapified array?

- A) 82, 90, 101
- B) 82, 11, 93
- C) 131, 11, 93
- D) 131, 111, 90  ✔ official

---

**2024_FN_Q54** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Consider a binary min-heap containing 105 distinct elements. Let \( k \) be the index (in the underlying array) of the maximum element stored in the heap. The number of possible values of \( k \) is

- A) 53  ✔ official
- B) 52
- C) 27
- D) 1

---

**2023_FN_Q12** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Which one of the following sequences when stored in an array at locations \( A[1], \dots, A[10] \) forms a max-heap?

- A) 23, 17, 10, 6, 13, 14, 1, 5, 7, 12
- B) 23, 17, 14, 7, 13, 10, 1, 5, 6, 12  ✔ official
- C) 23, 17, 14, 6, 13, 10, 1, 5, 7, 15
- D) 23, 14, 17, 1, 10, 13, 16, 12, 7, 5

---

**2023_FN_Q46** · 2023-FN · MCQ · 2 marks · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Let \( A \) be a priority queue for maintaining a set of elements. Suppose \( A \) is implemented using a max-heap data structure. The operation Extract-Max(\( A \)) extracts and deletes the maximum element from \( A \). The operation Insert(\( A \), key) inserts a new element key in \( A \). The properties of a max-heap are preserved at the end of each of these operations. When \( A \) contains \( n \) elements, which one of the following statements about the worst case running time of these two operations is TRUE?

- A) Both Extract-Max(\( A \)) and Insert(\( A \), key) run in \( O(1) \).
- B) Both Extract-Max(\( A \)) and Insert(\( A \), key) run in \( O(\log(n)) \).  ✔ official
- C) Extract-Max(\( A \)) runs in \( O(1) \) whereas Insert(\( A \), key) runs in \( O(\log(n)) \).
- D) Extract-Max(\( A \)) runs in \( O(1) \) whereas Insert(\( A \), key) runs in \( O(n) \).

---

**2021_AN_Q21** · 2021-AN · MCQ · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Let \(H\) be a binary min-heap consisting of \(n\) elements implemented as an array. What is the worst case time complexity of an optimal algorithm to find the maximum element in \(H\)?

- A) \(\Theta(1)\)
- B) \(\Theta(\log n)\)
- C) \(\Theta(n)\)  ✔ official
- D) \(\Theta(n \log n)\)

---

**2020_FN_Q36** · 2020-FN · NAT · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Consider the array representation of a binary min-heap containing 1023 elements. The minimum number of comparisons required to find the maximum in the heap is ________.

Official answer (numeric): 511 to 511

---

**2019_FN_Q38** · 2019-FN · MCQ · 2 marks · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps

Consider the following statements:
I. The smallest element in a max-heap is always at a leaf node.
II. The second largest element in a max-heap is always a child of the root node.
III. A max-heap can be constructed from a binary search tree in \( \Theta(n) \) time.
IV. A binary search tree can be constructed from a max-heap in \( \Theta(n) \) time.
Which of the above statements are TRUE?

- A) I, II and III  ✔ official
- B) I, II and IV
- C) I, III and IV
- D) II, III and IV

---

**2018_FN_Q56** · 2018-FN · NAT · 2 marks · Hard · bank topic: Binary Search Trees (BSTs) & Binary Heaps

The number of possible min-heaps containing each value from \(\{1, 2, 3, 4, 5, 6, 7\}\) exactly once is _____.

Official answer (numeric): 80 to 80

