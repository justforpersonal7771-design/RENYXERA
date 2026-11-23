# Review input: Programming and Data Structures, chapter 11: Stacks and queues

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-11-stacks-and-queues.md` and `gemini-11-stacks-and-queues.md` in this folder.

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

This is **one chapter** (11 of 16) of the Programming and Data Structures book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

### 11 · Stacks and queues  (Medium; 8 PYQs, 13 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| D4 Stacks: operations, expression conversion, permutations, min-stack | [MUST] | 9 | 2026_AN_Q50, 2025_AN_Q45, 2024_AN_Q65 | Push/pop traces, min in O(1), two stacks of limited size. |
| D5 Queues: circular, deque, queue by stacks; priority-queue idea | [MUST] | 7 | 2023_FN_Q59, 2022_FN_Q62, 2021_FN_Q43, 2018_FN_Q13, 2017_AN_Q20 | Linked queue costs, circular linked queue, mixed stack-and-queue traces. |




## The PYQs for this chapter (8)

**2026_AN_Q50** · 2026-AN · MSQ · 2 marks · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues

Consider a stack \( S \) and a queue \( Q \). Both of them are initially empty and have the capacity to store ten elements each. The elements 1, 2, 3, 4, and 5 arrive one by one, in that order. When an element arrives, it is assigned either to \( S \) (pushed on \( S \)) or to \( Q \) (enqueued to \( Q \)). Once all the five elements are stored, the output is generated in two steps. First, stack \( S \) is emptied by popping all elements. Then queue \( Q \) is emptied by dequeueing all elements. The output obtained by following this process is 4 3 1 2 5 .
Given the output, the objective is to predict whether an element was assigned to \( S \) or \( Q \).
Which of the following options is/are possible valid assignment(s) of the elements?
Note: In the options, the notation \( xS \) denotes that element \( x \) was assigned to \( S \) and \( yQ \) denotes that element \( y \) was assigned to \( Q \).

- A) \( 1S, 2Q, 3S, 4S, 5Q \)  ✔ official
- B) \( 1Q, 2Q, 3S, 4S, 5Q \)  ✔ official
- C) \( 1Q, 2Q, 3Q, 4S, 5S \)
- D) \( 1S, 2S, 3S, 4Q, 5Q \)

---

**2025_AN_Q45** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues

Consider a stack data structure into which we can PUSH and POP records. Assume that each record pushed in the stack has a positive integer key and that all keys are distinct. We wish to augment the stack data structure with an O(1) time MIN operation that returns a pointer to the record with smallest key present in the stack
1. without deleting the corresponding record, and
2. without increasing the complexities of the standard stack operations.
Which one or more of the following approach(es) can achieve it?

- A) Keep with every record in the stack, a pointer to the record with the smallest key below it.  ✔ official
- B) Keep a pointer to the record with the smallest key in the stack.
- C) Keep an auxiliary array in which the key values of the records in the stack are maintained in sorted order.
- D) Keep a Min-Heap in which the key values of the records in the stack are maintained.

---

**2024_AN_Q65** · 2024-AN · MSQ · 2 marks · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues · HAS A FIGURE (not shown here)

Let S1 and S2 be two stacks. S1 has capacity of 4 elements. S2 has capacity of 2 elements. S1 already has 4 elements: 100, 200, 300, and 400 , whereas S2 is empty, as shown below.
[IMAGE_Q_65_1]
Only the following three operations are available:
PushToS2: Pop the top element from S1 and push it on S2.
PushToS1: Pop the top element from S2 and push it on S1.
GenerateOutput: Pop the top element from S1 and output it to the user.
Note that the pop operation is not allowed on an empty stack and the push operation is not allowed on a full stack.
Which of the following output sequences can be generated by using the above operations?

- A) 100, 200, 400, 300
- B) 200, 300, 400, 100  ✔ official
- C) 400, 200, 100, 300  ✔ official
- D) 300, 200, 400, 100  ✔ official

---

**2023_FN_Q59** · 2023-FN · NAT · 2 marks · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues

Consider a sequence \(a\) of elements \(a_0 = 1, a_1 = 5, a_2 = 7, a_3 = 8, a_4 = 9\), and \(a_5 = 2\). The following operations are performed on a stack S and a queue Q, both of which are initially empty.
I: push the elements of a from a0 to a5 in that order into S.
II: enqueue the elements of a from a0 to a5 in that order into Q.
III: pop an element from S.
IV: dequeue an element from Q.
V: pop an element from S.
VI: dequeue an element from Q.
VII: dequeue an element from Q and push the same element into S.
VIII: Repeat operation VII three times.
IX: pop an element from S.
X: pop an element from S
The top element of S after executing the above operations is ________.

Official answer (numeric): 8 to 8

---

**2022_FN_Q62** · 2022-FN · NAT · 2 marks · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues · HAS A FIGURE (not shown here)

Consider the queues \(Q_1\) containing four elements and \(Q_2\) containing none (shown as the Initial State in the figure). The only operations allowed on these two queues are Enqueue(Q, element) and Dequeue(Q). The minimum number of Enqueue operations on \(Q_1\) required to place the elements of \(Q_1\) in \(Q_2\) in reverse order (shown as the Final State in the figure) without using any additional storage is __________.

[IMAGE_Q_62]

Official answer (numeric): 0 to 0

---

**2021_FN_Q43** · 2021-FN · NAT · 1 mark · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues

Consider the following sequence of operations on an empty stack.
\(\text{push}(54); \text{push}(52); \text{pop}( ); \text{push}(55); \text{push}(62); s = \text{pop}( );\)
Consider the following sequence of operations on an empty queue.
\(\text{enqueue}(21); \text{enqueue}(24); \text{dequeue}( ); \text{enqueue}(28); \text{enqueue}(32); q = \text{dequeue}( );\)
The value of \(s + q\) is _________.

Official answer (numeric): 86 to 86

---

**2018_FN_Q13** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Abstract Data Types (ADTs), Stacks, Queues · HAS A FIGURE (not shown here)

A queue is implemented using a non-circular singly linked list. The queue has a head pointer and a tail pointer, as shown in the figure. Let \(n\) denote the number of nodes in the queue. Let `enqueue` be implemented by inserting a new node at the head, and `dequeue` be implemented by deletion of a node from the tail.
[IMAGE_Q_13]
Which one of the following is the time complexity of the most time-efficient implementation of `enqueue` and `dequeue`, respectively, for this data structure?

- A) \(\theta(1), \theta(1)\)
- B) \(\theta(1), \theta(n)\)  ✔ official
- C) \(\theta(n), \theta(1)\)
- D) \(\theta(n), \theta(n)\)

---

**2017_AN_Q20** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues

A circular queue has been implemented using a singly linked list where each node consists of a value and a single pointer pointing to the next node. We maintain exactly two external pointers FRONT and REAR pointing to the front node and the rear node of the queue, respectively. Which of the following statements is/are CORRECT for such a circular queue, so that insertion and deletion operations can be performed in \(O(1)\) time?
I. Next pointer of front node points to the rear node.
II. Next pointer of rear node points to the front node.

- A) I only
- B) II only  ✔ official
- C) Both I and II
- D) Neither I nor II

