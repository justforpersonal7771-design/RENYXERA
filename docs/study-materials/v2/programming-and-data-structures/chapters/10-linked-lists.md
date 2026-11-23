# Review input: Programming and Data Structures, chapter 10: Linked lists

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-10-linked-lists.md` and `gemini-10-linked-lists.md` in this folder.

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

This is **one chapter** (10 of 16) of the Programming and Data Structures book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

### 10 · Linked lists  (Medium; 6 PYQs, 8 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| D3 Linked lists: operations, reversal, pointer traps, doubly and circular lists | [MUST] | 10 | 2026_FN_Q39, 2025_FN_Q62, 2023_FN_Q13, 2022_FN_Q15, 2020_FN_Q15, 2017_FN_Q35 | Delete cost (singly vs doubly), list modification by code with a figure, `join`, sorted insertion cost, reversal. |




## The PYQs for this chapter (6)

**2026_FN_Q39** · 2026-FN · MCQ · 2 marks · Easy · bank topic: Linked Lists & Binary Trees

Consider the following code snippet in C language that computes the number of nodes in a non-empty singly linked list pointed to by the pointer variable `head`.
```c
struct node{
    int elt;
    struct node *next;
};
int getListSize (struct node *head)
{
    if( E1 ) return 1;
    return E2;
}
```
Which one of the following options gives the correct replacements for the expressions E1 and E2?

- A) E1: `head == NULL` E2: `1 + getListSize(head)`
- B) E1: `head -> next == NULL` E2: `1 + getListSize(head -> next)`  ✔ official
- C) E1: `head == NULL` E2: `1 + getListSize(head -> next)`
- D) E1: `head -> next == NULL` E2: `1 + getListSize(head)`

---

**2025_FN_Q62** · 2025-FN · NAT · 2 marks · Hard · bank topic: Linked Lists & Binary Trees · HAS A FIGURE (not shown here)

Let LIST be a datatype for an implementation of linked list defined as follows:
```c
typedef struct list {
    int data;
    struct list *next;
} LIST;
```
Suppose a program has created two linked lists, L1 and L2, whose contents are given in the figure below (code for creating L1 and L2 is not provided here). L1 contains 9 nodes, and L2 contains 7 nodes.
Consider the following C program segment that modifies the list L1. The number of nodes that will be there in L1 after the execution of the code segment is ________. (Answer in integer)
[IMAGE_Q_62_1]
```c
int find (int query, LIST *list) {
    while (list != NULL) {
        if(list -> data == query) return 1;
        list = list -> next;
    }
    return 0;
}
int main( ) {
    ... ... ...
    ptr1=L1; ptr2=L2;
    while (ptr1 -> next != NULL) {
        query = ptr1 -> next -> data;
        if (find (query, L2))
            ptr1 -> next = ptr1 -> next -> next;
        else ptr1 = ptr1 -> next;
    }
    ... ... ...
    return 0;
}
```

Official answer (numeric): 5 to 5

---

**2023_FN_Q13** · 2023-FN · MCQ · 1 mark · Easy · bank topic: Linked Lists & Binary Trees

Let SLLdel be a function that deletes a node in a singly-linked list given a pointer to the node and a pointer to the head of the list. Similarly, let DLLdel be another function that deletes a node in a doubly-linked list given a pointer to the node and a pointer to the head of the list.
Let \( n \) denote the number of nodes in each of the linked lists. Which one of the following choices is TRUE about the worst-case time complexity of SLLdel and DLLdel?

- A) SLLdel is \( O(1) \) and DLLdel is \( O(n) \)
- B) Both SLLdel and DLLdel are \( O(\log(n)) \)
- C) Both SLLdel and DLLdel are \( O(1) \)
- D) SLLdel is \( O(n) \) and DLLdel is \( O(1) \)  ✔ official

---

**2022_FN_Q15** · 2022-FN · MCQ · 1 mark · Easy · bank topic: Linked Lists & Binary Trees · HAS A FIGURE (not shown here)

Consider the problem of reversing a singly linked list. To take an example, given the linked list below:

[IMAGE_Q_15_1]

the reversed linked list should look like

[IMAGE_Q_15_2]

Which one of the following statements is TRUE about the time complexity of algorithms that solve the above problem in \(O(1)\) space?

- A) The best algorithm for the problem takes \(\theta(n)\) time in the worst case.  ✔ official
- B) The best algorithm for the problem takes \(\theta(n \log n)\) time in the worst case.
- C) The best algorithm for the problem takes \(\theta(n^2)\) time in the worst case.
- D) It is not possible to reverse a singly linked list in \(O(1)\) space.

---

**2020_FN_Q15** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Linked Lists & Binary Trees

What is the worst case time complexity of inserting \( n \) elements into an empty linked list, if the linked list needs to be maintained in sorted order?

- A) \( \Theta(n) \)
- B) \( \Theta(n \log n) \)
- C) \( \Theta(n^2) \)  ✔ official
- D) \( \Theta(1) \)

---

**2017_FN_Q35** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Linked Lists & Binary Trees

Consider the C code fragment given below.
```c
typedef struct node {
    int data;
    node* next;
} node;
void join (node* m, node* n) {
    node* p = n;
    while (p -> next != NULL) {
        p = p -> next;
    }
    p -> next = m;
}
```
Assuming that \(m\) and \(n\) point to valid NULL-terminated linked lists, invocation of join will

- A) append list \(m\) to the end of list \(n\) for all inputs.
- B) either cause a null pointer dereference or append list \(m\) to the end of list \(n\).  ✔ official
- C) cause a null pointer dereference for all inputs.
- D) append list \(n\) to the end of list \(m\) for all inputs.

