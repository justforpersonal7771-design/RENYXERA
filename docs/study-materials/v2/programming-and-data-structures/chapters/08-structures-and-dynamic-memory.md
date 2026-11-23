# Review input: Programming and Data Structures, chapter 08: Structures and dynamic memory

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-08-structures-and-dynamic-memory.md` and `gemini-08-structures-and-dynamic-memory.md` in this folder.

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

This is **one chapter** (8 of 16) of the Programming and Data Structures book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

### 08 · Structures and dynamic memory  (Medium; 4 PYQs, 5 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C14 struct, union, enum, bit-fields, typedef; padding and alignment | [MUST] | 8 | 2018_FN_Q12 | Struct cast to `char *`, member access. |
| C15 Dynamic memory: malloc, calloc, realloc, free; leaks and dangling pointers | [MUST] | 7 | 2026_AN_Q17, 2021_AN_Q35, 2017_FN_Q32 | Heap vs stack, memory leak, uninitialised `next` pointer. |




## The PYQs for this chapter (4)

**2026_AN_Q17** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Dynamic Memory Allocation & File Handling

In C runtime environment, which one of the following is stored in heap?

- A) A static variable declared inside a function
- B) An array of integers declared inside a function
- C) A dynamically allocated array of integers created using malloc() function call  ✔ official
- D) Return address of a function

---

**2021_AN_Q35** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

Consider the following ANSI C program:
```c
#include <stdio.h>
#include <stdlib.h>
struct Node{
    int value;
    struct Node *next;
};
int main( ) {
    struct Node *boxE, *head, *boxN; int index = 0;
    boxE = head = (struct Node *) malloc(sizeof(struct Node));
    head -> value = index;
    for (index = 1; index <= 3; index++) {
        boxN = (struct Node *) malloc(sizeof(struct Node));
        boxE -> next = boxN;
        boxN -> value = index;
        boxE = boxN; }
    for (index = 0; index <= 3; index++) {
        printf("Value at index %d is %d\n", index, head -> value);
        head = head -> next;
        printf("Value at index %d is %d\n", index+1, head -> value); } }
```
Which one of the statements below is correct about the program?

- A) Upon execution, the program creates a linked-list of five nodes.
- B) Upon execution, the program goes into an infinite loop.
- C) It has a missing return which will be reported as an error by the compiler.
- D) It dereferences an uninitialized pointer that may result in a run-time error.  ✔ official

---

**2018_FN_Q12** · 2018-FN · MCQ · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

Consider the following C program.
```c
#include<stdio.h>
struct Ournode{
 char x,y,z;
};

int main(){
 struct Ournode p = {'1', '0', 'a'+2};
 struct Ournode *q = &p;
 printf ("%c, %c", *((char*)q+1), *((char*)q+2));
 return 0;
}
```
The output of this program is:

- A) 0, c  ✔ official
- B) 0, a+2
- C) '0', 'a+2'
- D) '0', 'c'

---

**2017_FN_Q32** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Dynamic Memory Allocation & File Handling

Consider the following C code:
```c
#include <stdio.h>
int *assignval (int *x, int val) {
    *x = val;
    return x;
}
void main ( ) {
    int *x = malloc (sizeof(int));
    if (NULL == x) return;
    x = assignval(x, 0);
    if(x) {
        x = (int *) malloc (sizeof(int));
        if (NULL == x) return;
        x = assignval (x, 10);
    }
    printf ("%d\n", *x);
    free (x);
}
```
The code suffers from which one of the following problems:

- A) compiler error as the return of malloc is not typecast appropriately
- B) compiler error because the comparison should be made as x == NULL and not as shown
- C) compiles successfully but execution may result in dangling pointer
- D) compiles successfully but execution may result in memory leak  ✔ official

