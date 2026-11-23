# Review input: Programming and Data Structures, chapter 09: Reading code: mystery functions, prediction

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-09-reading-code-mystery-functions-prediction.md` and `gemini-09-reading-code-mystery-functions-prediction.md` in this folder.

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

This is **one chapter** (9 of 16) of the Programming and Data Structures book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

### 09 · Preprocessor, files and reading code  (Medium; 5 PYQs, 9 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C16 Preprocessor and macros | [MUST] | 4 | none | Not in this bank's PDS tag; macros appear in C-output questions in other years. |
| C18 Files, errors, variable arguments | [LATER] | 3 | none | Not asked in this bank. |
| C19 Reading mystery functions: GCD, digits, bits, binary conversion, Horner | [MUST] | 5 | 2025_FN_Q63, 2025_AN_Q33, 2024_AN_Q62, 2021_FN_Q33, 2020_FN_Q42 | Digit-skipping loop, GCD by subtraction, Horner evaluation, binary exponentiation, subarray code. |
| C20 Output-prediction method and undefined behaviour | [MUST] | 5 | none | Skills lesson. Every output question uses it. |




## The PYQs for this chapter (5)

**2025_AN_Q33** · 2025-AN · NAT · 1 mark · Medium · bank topic: Data Types, Syntax, Control Structures, Loops

```c
int x = 126, y = 105;
do {
    if(x > y) x = x - y;
    else y = y - x;
} while(x!=y);
printf("%d", x);
```
The output of the given C code segment is ________. (Answer in integer)

Official answer (numeric): 21 to 21

---

**2025_FN_Q63** · 2025-FN · NAT · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops

Consider the following C program:
```c
#include <stdio.h>
int gate (int n) {
    int d, t, newnum, turn;
    newnum = turn = 0; t = 1;
    while (n >= t) t *= 10;
    t /=10;
    while (t > 0) {
        d = n/t;
        n = n%t;
        t /= 10;
        if (turn) newnum = 10*newnum + d;
        turn = (turn + 1) % 2;
    }
    return newnum;
}
int main( ) {
    printf ("%d", gate(14362));
    return 0;
}
```
The value printed by the given C program is ________. (Answer in integer)

Official answer (numeric): 46 to 46

---

**2024_AN_Q62** · 2024-AN · MCQ · 2 marks · Hard · bank topic: Data Types, Syntax, Control Structures, Loops

Consider an array X that contains \( n \) positive integers. A subarray of X is defined to be a sequence of array locations with consecutive indices.
The C code snippet given below has been written to compute the length of the longest subarray of X that contains at most two distinct integers. The code has two missing expressions labelled (P) and (Q).
```c
int first = 0, second = 0, len1 = 0, len2 = 0, maxlen = 0;
for (int i = 0; i < n; i++) {
    if (X[i] == first) {
        len2++; len1++;
    }
    else if (X[i] == second) {
        len 2++;
        len1 = ____(P)____;
        second = first;
    }
    else {
        len2 = ____(Q)____;
        len1 = 1; second = first;
    }
    if (len2 > maxlen) {
        maxlen = len 2;
    }
    first = X[i];
}
```
Which one of the following options gives the CORRECT missing expressions?
(Hint: At the end of the \( i^{\text{th}} \) iteration, the value of len1 is the length of the longest subarray ending with X[\( i \)] that contains all equal values, and len2 is the length of the longest subarray ending with X[\( i \)] that contains at most two distinct values.)

- A) (P) len1 + 1 (Q) len2 + 1
- B) (P) 1 (Q) len1 + 1  ✔ official
- C) (P) 1 (Q) len2 + 1
- D) (P) len 2 + 1 (Q) len1 + 1

---

**2021_FN_Q33** · 2021-FN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following ANSI C function:
```c
int SimpleFunction (int Y[ ], int n, int x)
{
    int total = Y[0], loopIndex;
    for (loopIndex = 1; loopIndex <= n - 1; loopIndex++)
        total = x * total + Y[loopIndex];
    return total;
}
```
Let Z be an array of 10 elements with \(Z[i] = 1\), for all \(i\) such that \(0 \leq i \leq 9\). The value returned by SimpleFunction (Z, 10, 2) is _________.

Official answer (numeric): 1023 to 1023

---

**2020_FN_Q42** · 2020-FN · NAT · 2 marks · Hard · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following C functions:
```c
int tob(int b, int* arr) {
    int i;
    for(i=0; b>0; i++) {
        if(b%2) arr[i]=1;
        else arr[i]=0;
        b=b/2;
    }
    return(i);
}
int pp(int a, int b) {
    int arr[20];
    int i, tot=1, ex, len;
    ex=a;
    len=tob(b,arr);
    for(i=0; i<len; i++) {
        if(arr[i]==1)
            tot=tot * ex;
        ex = ex * ex;
    }
    return(tot);
}
```
The value returned by `pp(3,4)` is ________.

Official answer (numeric): 81 to 81

