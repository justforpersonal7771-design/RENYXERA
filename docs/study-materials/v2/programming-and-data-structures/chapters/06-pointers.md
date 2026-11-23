# Review input: Programming and Data Structures, chapter 06: Pointers

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-06-pointers.md` and `gemini-06-pointers.md` in this folder.

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

This is **one chapter** (6 of 16) of the Programming and Data Structures book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

### 06 · Pointers  (High weight; 12 PYQs, 18 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C10 Pointers I: memory and addresses (`&`, `*`, NULL, swapping) | [MUST] | 7 | 2026_AN_Q60, 2025_FN_Q34, 2022_FN_Q21, 2017_AN_Q32 | Value after assignments through pointers; call by value with a pointer parameter. |
| C11 Pointers II: arithmetic, arrays and pointers, 2-D family, `*p++` | [MUST] | 8 | 2025_FN_Q61, 2025_AN_Q62, 2024_AN_Q50, 2021_AN_Q52, 2020_FN_Q16, 2019_FN_Q15, 2019_FN_Q65 | Pointer difference, `*(arr[1]+9)`, `*(*(a+**a+2)+3)`, `ip[1]`, pointer walks. |
| C13 Pointers III: pointer to pointer, function pointers, reading declarations, `const` | [SHOULD] | 7 | 2018_FN_Q39 | Swapping two `char *` by value vs by address. |




## The PYQs for this chapter (12)

**2026_AN_Q60** · 2026-AN · NAT · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

Consider the following ANSI-C program.
```c
#include <stdio.h>
int main( ) {
    int *ptr, a, b, c;
    a=5; b=11; c=20;
    ptr=&a; *ptr=c; ptr=&c;
    a=*(&b); c=*ptr-a;
    printf("%d",c);
    return(0);
}
```
The output of this program is ________. (answer in integer)
Note: Assume that the program compiles and runs successfully.

Official answer (numeric): 9 to 9

---

**2025_FN_Q34** · 2025-FN · NAT · 1 mark · Easy · bank topic: Pointers, Multi-Dimensional Arrays, Structures

```c
#include <stdio.h>
void foo(int *p, int x) {
    *p = x;
}
int main( ) {
    int *z;
    int a = 20, b = 25;
    z = &a;
    foo(z, b);
    printf("%d", a);
    return 0;
}
```
The output of the given C program is ________. (Answer in integer)

Official answer (numeric): 25 to 25

---

**2025_FN_Q61** · 2025-FN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

```c
#include <stdio.h>
int foo(int S[ ], int size) {
    if(size == 0) return 0;
    if(size == 1) return 1;
    if(S[0] != S[1]) return 1 + foo(S + 1, size - 1);
    return foo(S + 1, size - 1);
}
int main( ) {
    int A[ ] = {0, 1, 2, 2, 2, 0, 0, 1, 1};
    printf("%d", foo(A, 9));
    return 0;
}
```
The value printed by the given C program is ________. (Answer in integer)

Official answer (numeric): 5 to 5

---

**2025_AN_Q62** · 2025-AN · NAT · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

Consider the following C program:
```c
#include <stdio.h>
int main( ) {
    int a;
    int arr[5] = {30, 50, 10};
    int *ptr;
    ptr = &arr[0] + 1;
    a = *ptr;
    (*ptr)++;
    ptr++;
    printf("%d", a + (*ptr) + arr[1]);
    return 0;
}
```
The output of the above program is ________. (Answer in integer)

Official answer (numeric): 111 to 111

---

**2024_AN_Q50** · 2024-AN · MCQ · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

What is the output of the following C program?
```c
#include <stdio.h>
int main() {
    double a[2]={20.0,25.0},*p, *q;
    p = a;
    q = p + 1;
    printf ("%d, %d",(int)(q - p),(int)(*q - *p));
    return 0;
}
```

- A) 4, 8
- B) 1, 5  ✔ official
- C) 8, 5
- D) 1, 8

---

**2022_FN_Q21** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

What is printed by the following ANSI C program?
```c
#include<stdio.h>
int main(int argc, char *argv[ ])
{
    int x = 1, z[2] = {10, 11};
    int *p = NULL;
    p = &x;
    *p = 10;
    p = &z[1];
    *(&z[0] + 1) += 3;
    printf("%d, %d, %d\n", x, z[0], z[1]);
    return 0;
}
```

- A) 1, 10, 11
- B) 1, 10, 14
- C) 10, 14, 11
- D) 10, 10, 14  ✔ official

---

**2021_AN_Q52** · 2021-AN · MCQ · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

Consider the following ANSI C program:
```c
#include <stdio.h>
int main( ) {
    int arr[4] [5] ;
    int i, j;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 5; j++) {
            arr[i] [j] = 10 * i + j;
        }
    }
    printf("%d", *(arr[1] + 9));
    return 0;
}
```
What is the output of the above program?

- A) 14
- B) 20
- C) 24  ✔ official
- D) 30

---

**2020_FN_Q16** · 2020-FN · NAT · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

Consider the following C program:
```c
#include <stdio.h>
int main( ) {
    int a[4][5] = {{1, 2, 3, 4, 5},
                   {6, 7, 8, 9, 10},
                   {11, 12, 13, 14, 15},
                   {16, 17, 18, 19, 20}};
    printf("%d\n",*(*(a+**a+2)+3));
    return(0);
}
```
The output of the program is ________.

Official answer (numeric): 19 to 19

---

**2019_FN_Q15** · 2019-FN · NAT · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

Consider the following C program:
```c
#include <stdio.h>
int main ( ) {
    int arr[ ] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 5}, *ip = arr + 4;
    printf ("%d\n", ip[1]);
    return 0;
}
```
The number that will be displayed on execution of the program is ________.

Official answer (numeric): 6 to 6

---

**2019_FN_Q65** · 2019-FN · NAT · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

Consider the following C program:
```c
#include <stdio.h>
int main ( )
{
    int a[ ] = {2, 4, 6, 8, 10};
    int i, sum = 0, *b = a + 4;
    for (i = 0; i < 5; i++)
        sum = sum + (*b - i) - *(b - i);
    printf ("%d\n", sum);
    return 0;
}
```
The output of the above C program is ________.

Official answer (numeric): 10 to 10

---

**2018_FN_Q39** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

Consider the following C program:
```c
#include<stdio.h>
void fun1(char *s1, char *s2){
    char *tmp;
    tmp = s1;
    s1 = s2;
    s2 = tmp;
}
void fun2(char **s1, char **s2){
    char *tmp;
    tmp = *s1;
    *s1 = *s2;
    *s2 = tmp;
}
int main(){
    char *str1 = "Hi", *str2 = "Bye";
    fun1(str1, str2); printf("%s %s ", str1, str2);
    fun2(&str1, &str2); printf("%s %s", str1, str2);
    return 0;
}
```
The output of the program above is

- A) Hi Bye Bye Hi  ✔ official
- B) Hi Bye Hi Bye
- C) Bye Hi Hi Bye
- D) Bye Hi Bye Hi

---

**2017_AN_Q32** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures

Consider the following function implemented in C:
```c
void printxy (int x, int y)
{
    int *ptr;
    x = 0;
    ptr = &x;
    y = *ptr;
    *ptr = 1;
    printf ("%d, %d", x, y);
}
```
The output of invoking printxy (1, 1) is

- A) 0, 0
- B) 0, 1
- C) 1, 0  ✔ official
- D) 1, 1

