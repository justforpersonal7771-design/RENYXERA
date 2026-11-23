# Review input: Algorithms, chapter 02: Searching and sorting

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-02-searching-and-sorting.md` and `gemini-02-searching-and-sorting.md` in this folder.

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

This is **one chapter** (2 of 9) of the Algorithms book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Searching and sorting**. Written lessons today: 5 topics ready.



## The PYQs for this chapter (17)

**2026_FN_Q24** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Consider a hash table \( P[0, 1, \dots, 10] \) that is initially empty. The hash table is maintained using open addressing with linear probing. The hash function used is \( h(x) = (x + 7) \bmod 11 \).
Consider the following sequence of insertions performed on \( P \):
1, 13, 22, 15, 11, 24
Which of the following positions in the hash table is/are empty after these insertions are performed?

- A) 0
- B) 10
- C) 2  ✔ official
- D) 1

---

**2026_AN_Q30** · 2026-AN · NAT · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

The keys 5, 28, 19, 15, 26, 33, 12, 17, 10 are inserted into a hash table using the hash function \( h(k) = k \bmod 9 \). The collisions are resolved by chaining. After all the keys are inserted, the length of the longest chain is ________. (answer in integer)

Official answer (numeric): 3 to 3

---

**2026_AN_Q38** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Consider an array \( A \) of integers of size \( n \). The indices of \( A \) run from 1 to \( n \). An algorithm is to be designed to check whether \( A \) satisfies the condition given below.
\( \forall i, j \in \{1, \dots, n - 1\} \) such that \( i > j \), \( (A[i + 1] - A[i]) > (A[j + 1] - A[j]) \)
Which one of the following gives the worst case time complexity of the fastest algorithm that can be designed for the problem?

- A) \( \theta(n) \)  ✔ official
- B) \( \theta(\log(n)) \)
- C) \( \theta(n \log(n)) \)
- D) \( \theta(n^2) \)

---

**2025_AN_Q20** · 2025-AN · MCQ · 1 mark · Easy · bank topic: Searching, Sorting, Hashing Mechanisms

Consider an unordered list of \( N \) distinct integers.
What is the minimum number of element comparisons required to find an integer in the list that is NOT the largest in the list?

- A) 1  ✔ official
- B) \( N - 1 \)
- C) \( N \)
- D) \( 2N - 1 \)

---

**2025_FN_Q33** · 2025-FN · NAT · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

The pseudocode of a function fun( ) is given below:
```c
fun(int A[0, ..., n - 1]) {
    for i = 0 to n - 2
        for j = 0 to n - i - 2
            if (A[j] > A[j + 1])
                then swap A[j] and A[j + 1]
}
```
Let A[0, ..., 29] be an array storing 30 distinct integers in descending order. The number of swap operations that will be performed, if the function fun( ) is called with A[0, ..., 29] as argument, is ________. (Answer in integer)

Official answer (numeric): 435 to 435

---

**2025_AN_Q41** · 2025-AN · MCQ · 2 marks · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

An array \( A \) of length \( n \) with distinct elements is said to be bitonic if there is an index \( 1 = i = n \) such that \( A[1..i] \) is sorted in the non-decreasing order and \( A[i+1..n] \) is sorted in the non-increasing order.
Which ONE of the following represents the best possible asymptotic bound for the worst-case number of comparisons by an algorithm that searches for an element in a bitonic array \( A \)?

- A) \( \Theta(n) \)
- B) \( \Theta(1) \)
- C) \( \Theta(\log^2 n) \)
- D) \( \Theta(\log n) \)  ✔ official

---

**2025_FN_Q65** · 2025-FN · NAT · 2 marks · Hard · bank topic: Searching, Sorting, Hashing Mechanisms

In a double hashing scheme, \( h_1(k) = k \bmod 11 \) and \( h_2(k) = 1 + (k \bmod 7) \) are the auxiliary hash functions. The size \( m \) of the hash table is 11. The hash function for the \( i^{\text{th}} \) probe in the open address table is \( [h_1(k) + i \cdot h_2(k)] \bmod m \). The following keys are inserted in the given order: 63, 50, 25, 79, 67, 24.
The slot at which key 24 gets stored is ________. (Answer in integer)

Official answer (numeric): 10 to 11

---

**2023_FN_Q20** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

An algorithm has to store several keys generated by an adversary in a hash table. The adversary is malicious who tries to maximize the number of collisions. Let \( k \) be the number of keys, \( m \) be the number of slots in the hash table, and \( k > m \).
Which one of the following is the best hashing strategy to counteract the adversary?

- A) Division method, i.e., use the hash function \( h(k) = k \bmod m \).
- B) Multiplication method, i.e., use the hash function \( h(k) = \lfloor m (kA - \lfloor kA \rfloor) \rfloor \), where \( A \) is a carefully chosen constant.
- C) Universal hashing method.  ✔ official
- D) If \( k \) is a prime number, use Division method. Otherwise, use Multiplication method.

---

**2022_FN_Q16** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Suppose we are given \(n\) keys, \(m\) hash table slots, and two simple uniform hash functions \(h_1\) and \(h_2\). Further suppose our hashing scheme uses \(h_1\) for the odd keys and \(h_2\) for the even keys. What is the expected number of keys in a slot?

- A) \(\frac{m}{n}\)
- B) \(\frac{n}{m}\)  ✔ official
- C) \(\frac{2n}{m}\)
- D) \(\frac{n}{2m}\)

---

**2021_FN_Q30** · 2021-FN · MCQ · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Let \(P\) be an array containing \(n\) integers. Let \(t\) be the lowest upper bound on the number of comparisons of the array elements, required to find the minimum and maximum values in an arbitrary array of \(n\) elements. Which one of the following choices is correct?

- A) \(t > 2n - 2\)
- B) \(t > 3 \left\lceil \frac{n}{2} \right\rceil\) and \(t \leq 2n - 2\)
- C) \(t > n\) and \(t \leq 3 \left\lceil \frac{n}{2} \right\rceil\)  ✔ official
- D) \(t > \lceil \log_2(n) \rceil\) and \(t \leq n\)

---

**2021_AN_Q31** · 2021-AN · MCQ · 1 mark · Easy · bank topic: Searching, Sorting, Hashing Mechanisms

What is the worst-case number of arithmetic operations performed by recursive binary search on a sorted array of size \(n\)?

- A) \(\Theta(\sqrt{n})\)
- B) \(\Theta(\log_2 (n))\)  ✔ official
- C) \(\Theta(n^2)\)
- D) \(\Theta(n)\)

---

**2021_FN_Q25** · 2021-FN · MCQ · 1 mark · Easy · bank topic: Searching, Sorting, Hashing Mechanisms · HAS A FIGURE (not shown here)

Consider the following array:

[IMAGE_Q_25_1]

Which algorithm out of the following options uses the least number of comparisons (among the array elements) to sort the above array in ascending order?

- A) Selection sort
- B) Mergesort
- C) Insertion sort  ✔ official
- D) Quicksort using the last element as pivot

---

**2021_FN_Q49** · 2021-FN · MSQ · 2 marks · Hard · bank topic: Searching, Sorting, Hashing Mechanisms · HAS A FIGURE (not shown here)

Consider a dynamic hashing approach for 4-bit integer keys:
1. There is a main hash table of size 4.
2. The 2 least significant bits of a key is used to index into the main hash table.
3. Initially, the main hash table entries are empty.
4. Thereafter, when more keys are hashed into it, to resolve collisions, the set of all keys corresponding to a main hash table entry is organized as a binary tree that grows on demand.
5. First, the \(3^{\text{rd}}\) least significant bit is used to divide the keys into left and right subtrees.
6. To resolve more collisions, each node of the binary tree is further sub-divided into left and right subtrees based on the \(4^{\text{th}}\) least significant bit.
7. A split is done only if it is needed, i.e., only when there is a collision.
Consider the following state of the hash table.

[IMAGE_Q_49_1]

Which of the following sequences of key insertions can cause the above state of the hash table (assume the keys are in decimal notation)?

- A) 5, 9, 4, 13, 10, 7
- B) 9, 5, 10, 6, 7, 1
- C) 10, 9, 6, 7, 5, 13  ✔ official
- D) 9, 5, 13, 6, 10, 14

---

**2020_FN_Q28** · 2020-FN · NAT · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Consider a double hashing scheme in which the primary hash function is \( h_1(k) = k \bmod 23 \) and the secondary hash function is \( h_2(k) = 1 + (k \bmod 19) \). Assume that the table size is 23. Then the address returned by probe 1 in the probe sequence (assume that the probe sequence begins at probe 0) for key value \( k = 90 \) is ________.

Official answer (numeric): 13 to 13

---

**2019_FN_Q31** · 2019-FN · NAT · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

An array of 25 distinct elements is to be sorted using quicksort. Assume that the pivot element is chosen uniformly at random. The probability that the pivot element gets placed in the worst possible location in the first round of partitioning (rounded off to 2 decimal places) is ________.

Official answer (numeric): 0.08 to 0.08

---

**2019_FN_Q61** · 2019-FN · MCQ · 2 marks · Hard · bank topic: Searching, Sorting, Hashing Mechanisms

There are \( n \) unsorted arrays: \( A_1, A_2, ...., A_n \). Assume that \( n \) is odd. Each of \( A_1, A_2, ...., A_n \) contains \( n \) distinct elements. There are no common elements between any two arrays. The worst-case time complexity of computing the median of the medians of \( A_1, A_2, ...., A_n \) is

- A) \( \mathcal{O}(n) \)
- B) \( \mathcal{O}(n \log n) \)
- C) \( \mathcal{O}(n^2) \)  ✔ official
- D) \( \Omega(n^2 \log n) \)

---

**2017_FN_Q45** · 2017-FN · NAT · 2 marks · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Let \(A\) be an array of 31 numbers consisting of a sequence of 0's followed by a sequence of 1's. The problem is to find the smallest index \(i\) such that \(A[i]\) is 1 by probing the minimum number of locations in \(A\). The worst case number of probes performed by an optimal algorithm is ________.

Official answer (numeric): 5.0 to 5.0

