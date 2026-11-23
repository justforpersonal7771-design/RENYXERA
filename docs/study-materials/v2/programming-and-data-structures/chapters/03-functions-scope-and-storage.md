# Review input: Programming and Data Structures, chapter 03: Functions, scope and storage

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-03-functions-scope-and-storage.md` and `gemini-03-functions-scope-and-storage.md` in this folder.

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

This is **one chapter** (3 of 16) of the Programming and Data Structures book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

### 03 · Functions, scope and storage  (Medium; 9 PYQs, 12 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C6 Functions and the call stack; argument evaluation order | [MUST] | 6 | 2026_AN_Q19, 2025_AN_Q63, 2024_AN_Q21, 2019_FN_Q24 | Argument order (right to left), nested calls, call by value. |
| C7 Scope, lifetime, `static`, `extern`, `register`; the memory map | [MUST] | 6 | 2026_FN_Q34, 2023_FN_Q35, 2019_FN_Q52, 2017_FN_Q43, 2017_AN_Q17 | `static` counters across calls, shadowing, matching storage classes, activation records. |
| C17 Parameter passing and scoping rules (GATE view) | [SHOULD] | 5 | none | Rarely asked as a pure question; supports pointer questions. |




## The PYQs for this chapter (9)

**2026_AN_Q19** · 2026-AN · MCQ · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · HAS A FIGURE (not shown here)

Consider the following three ANSI-C programs, P1, P2 and P3
[IMAGE_Q_19_1]
Which one of the following statements is true?

- A) Only P1 will compile without any error  ✔ official
- B) Only P2 will compile without any error
- C) Only P3 will compile without any error
- D) All three programs P1, P2, and P3 will compile without any error

---

**2026_FN_Q34** · 2026-FN · NAT · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following program in C:
```c
#include <stdio.h>
void func(int i, int j) {
    if(i < j) {
        int i = 0;
        while (i < 10) {
            j += 2;
            i++;
        }
    }
    printf("%d", i);
}
int main() {
    int i = 9, j = 10;
    func(i, j);
    return 0;
}
```
The output of the program is ________. (answer in integer)
**Note:** Assume that the program compiles and runs successfully.

Official answer (numeric): 9 to 9

---

**2025_AN_Q63** · 2025-AN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following C program:
```c
#include <stdio.h>
int g(int n) {
    return (n+10);
}
int f(int n) {
    return g(n*2);
}
int main( ) {
    int sum, n;
    sum=0;
    for (n=1; n<3; n++)
        sum += g(f(n));
    printf("%d", sum);
    return 0;
}
```
The output of the given C program is ________. (Answer in integer)

Official answer (numeric): 46 to 46

---

**2024_AN_Q21** · 2024-AN · MCQ · 1 mark · Easy · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following C program. Assume parameters to a function are evaluated from right to left.
```c
# include <stdio.h>
int g(int p) { printf ("%d", p); return p; }
int h(int q) { printf ("%d", q); return q; }
void f(int x, int y) {
    g(x);
    h(y);
}
int main( ) {
    f(g(10), h(20));
}
```
Which one of the following options is the CORRECT output of the above C program?

- A) 20101020  ✔ official
- B) 10202010
- C) 20102010
- D) 10201020

---

**2023_FN_Q35** · 2023-FN · NAT · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

The integer value printed by the ANSI-C program given below is ________
```c
#include<stdio.h>
int funcp( ) {
    static int x = 1;
    x++;
    return x;
}
int main( ) {
    int x, y;
    x = funcp( );
    y = funcp( ) + x;
    printf("%d\n", (x + y));
    return 0;
}
```

Official answer (numeric): 7 to 7

---

**2019_FN_Q24** · 2019-FN · NAT · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following C program:
```c
#include <stdio.h>
int jumble(int x, int y) {
    x = 2 * x + y;
    return x;
}
int main ( ) {
    int x = 2, y = 5;
    y = jumble(y, x);
    x = jumble(y, x);
    printf("%d\n", x);
    return 0;
}
```
The value printed by the program is ________.

Official answer (numeric): 26 to 26

---

**2019_FN_Q52** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following C program:
```c
#include<stdio.h>
int r( )
{
    static int num = 7;
    return num--;
}
int main( )
{
    for ( r( ); r( ); r( ) )
        printf("%d", r( ) );
    return 0;
}
```
Which one of the following values will be displayed on execution of the programs?

- A) 41
- B) 52  ✔ official
- C) 63
- D) 630

---

**2017_AN_Q17** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Dynamic Memory Allocation & File Handling

Match the following:
List-I
(P) static char var;
(Q) \(m = \text{malloc}(10); m = \text{NULL};\)
(R) char *ptr[10];
(S) register int var1;
List-II
(i) Sequence of memory locations to store addresses
(ii) A variable located in data section of memory
(iii) Request to allocate a CPU register to store data
(iv) A lost memory which cannot be freed

- A) P \(\rightarrow\) (ii), Q \(\rightarrow\) (iv), R \(\rightarrow\) (i), S \(\rightarrow\) (iii)  ✔ official
- B) P \(\rightarrow\) (ii), Q \(\rightarrow\) (i), R \(\rightarrow\) (iv), S \(\rightarrow\) (iii)
- C) P \(\rightarrow\) (ii), Q \(\rightarrow\) (iv), R \(\rightarrow\) (iii), S \(\rightarrow\) (i)
- D) P \(\rightarrow\) (iii), Q \(\rightarrow\) (iv), R \(\rightarrow\) (i), S \(\rightarrow\) (ii)

---

**2017_FN_Q43** · 2017-FN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

The output of executing the following C program is ________.
```c
#include <stdio.h>
int total (int v) {
    static int count = 0;
    while (v) {
        count += v & 1;
        v >>= 1;
    }
    return count;
}
void main ( ) {
    static int x = 0;
    int i = 5;
    for (; i > 0; i--) {
        x = x + total (i);
    }
    printf ("%d\n", x);
}
```

Official answer (numeric): 23.0 to 23.0

