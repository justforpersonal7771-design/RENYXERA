# Review input: Programming and Data Structures, chapter 04: Recursion

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-04-recursion.md` and `gemini-04-recursion.md` in this folder.

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

This is **one chapter** (4 of 16) of the Programming and Data Structures book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

### 04 · Recursion  (High weight; 12 PYQs, 20 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C8 Recursion in C: stack frames, call trees, `static` with recursion, counting calls | [MUST] | 8 | 2026_FN_Q61, 2026_AN_Q61, 2024_FN_Q27, 2023_FN_Q36, 2021_FN_Q62, 2021_AN_Q47, 2021_AN_Q48, 2020_FN_Q48, 2019_FN_Q40, 2018_FN_Q31, 2017_FN_Q64, 2017_FN_Q57 | What does `f(n)` return, how many calls, print order, activation trees. |
| D6 Recursion on data structures: list, tree, Hanoi, recurrences from call trees | [MUST] | 5 | none | Recursive list size, tree sum in post order. |




## The PYQs for this chapter (12)

**2026_FN_Q61** · 2026-FN · NAT · 2 marks · Hard · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the recursive functions represented by the following code segment:
```c
int bar(int n){
    if (n == 1) return 0;
    else return 1 + bar(n/2);
}
int foo(int n){
    if (n == 1) return 1;
    else return 1 + foo(bar(n));
}
```
The smallest positive integer n for which `foo(n)` returns 5 is ________. (answer in integer)
**Note:** Ignore syntax errors (if any) in the function.

Official answer (numeric): 65536 to 65536

---

**2026_AN_Q61** · 2026-AN · NAT · 2 marks · Hard · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following ANSI-C function.
```c
int func(int start, int end){
    int length = end + 1 - start;
    if((length<1) || (start < 0) || (end<0)){ return(0); }
    if(length%3 == 0){
        return(func(start+1, end));
    } else if(length%3 == 1){
        return(1 + func(start, end -1));
    } else {
        return(func(start + 2, end));
    }
}
```
The maximum possible value that can be returned from this function is ________. (answer in integer)
Note: Ignore syntax errors (if any) in the function.

Official answer (numeric): 1 to 1

---

**2024_FN_Q27** · 2024-FN · MCQ · 1 mark · Hard · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following program:
```c
#include <stdio.h>
void fx( );
int main( ) {
    fx( );
    return 0;
}
void fx( ) {
    char a;
    if ((a=getchar( )) != '\n')
        fx( );
    if (a != '\n')
        putchar (a);
}
```
Assume that the input to the program from the command line is 1234 followed by a newline character. Which one of the following statements is CORRECT?

- A) The program will terminate with no output
- B) The program will not terminate
- C) The program will terminate with 4321 as output  ✔ official
- D) The program will terminate with 1234 as output

---

**2023_FN_Q36** · 2023-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · HAS A FIGURE (not shown here)

Consider the following program:
```c
int main( )
{
    f1( );
    f2(2);
    f3( );
    return (0);
}
int f1( )
{
    return(1);
}
int f2(int X)
{
    f3( );
    if (X == 1)
        return f1( );
    else
        return (X * f2(X - 1));
}
int f3( )
{
    return(5);
}
```
Which one of the following options represents the activation tree corresponding to the main function?

- A) [IMAGE_Q_36_A]  ✔ official
- B) [IMAGE_Q_36_B]
- C) [IMAGE_Q_36_C]
- D) [IMAGE_Q_36_D]

---

**2021_FN_Q62** · 2021-FN · MCQ · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following statements:
\(S_1\) : The sequence of procedure calls corresponds to a preorder traversal of the activation tree.
\(S_2\) : The sequence of procedure returns corresponds to a postorder traversal of the activation tree.
Which one of the following options is correct?

- A) \(S_1\) is true and \(S_2\) is false
- B) \(S_1\) is false and \(S_2\) is true
- C) \(S_1\) is true and \(S_2\) is true  ✔ official
- D) \(S_1\) is false and \(S_2\) is false

---

**2021_AN_Q47** · 2021-AN · NAT · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following ANSI C function:
```c
int SomeFunction(int x, int y)
{
    if ((x == 1) || (y == 1)) return 1;
    if (x == y) return x;
    if (x > y) return SomeFunction(x - y, y);
    if (y > x) return SomeFunction(x, y - x);
}
```
The value returned by SomeFunction(15, 255) is _________.

Official answer (numeric): 15 to 15

---

**2021_AN_Q48** · 2021-AN · NAT · 2 marks · Hard · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following ANSI C program:
```c
#include <stdio.h>
int foo(int x, int y, int q)
{
    if ((x <= 0) || (y <= 0))
        return q;
    if (x <= 0)
        return foo(x, y - q, q)
    if (y <= 0)
        return foo(x - q, y, q);
    return foo(x, y - q, q) + foo(x - q, y, q);
}
int main( )
{
    int r = foo(15, 15, 10);
    printf("%d", r);
    return 0;
}
```
The output of the program upon execution is _________.

Official answer (numeric): 60 to 60

---

**2020_FN_Q48** · 2020-FN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following C functions:
```c
int fun1(int n) {
    static int i = 0;
    if (n > 0) {
        ++i;
        fun1(n - 1);
    }
    return(i);
}
int fun2(int n) {
    static int i = 0;
    if (n > 0) {
        i = i + fun1(n);
        fun2(n - 1);
    }
    return(i);
}
```
The return value of `fun2(5)` is ________.

Official answer (numeric): 55 to 55

---

**2019_FN_Q40** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following C function:
```c
void convert (int n) {
    if (n < 0)
        printf("%d", n);
    else {
        convert (n/2);
        printf("%d", n % 2);
    }
}
```
Which one of the following will happen when the function convert is called with any positive integer \( n \) as argument?

- A) It will print the binary representation of n and terminate.
- B) It will print the binary representation of n in the reverse order and terminate.
- C) It will print the binary representation of n but will not terminate.
- D) It will not print anything and will not terminate.  ✔ official

---

**2018_FN_Q31** · 2018-FN · NAT · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following C program:
```c
#include <stdio.h>

int counter = 0;

int calc (int a, int b) {
 int c;
 counter++;
 if (b==3) return (a*a*a);
 else {
 c = calc(a, b/3);
 return (c*c*c);
 }
}

int main (){
 calc(4, 81);
 printf ("%d", counter);
}
```
The output of this program is _____.

Official answer (numeric): 4 to 4

---

**2017_FN_Q64** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following two functions:
```c
void fun1 (int n) {
    if (n == 0) return;
    printf ("%d", n);
    fun2 (n - 2);
    printf ("%d", n);
}
void fun2 (int n) {
    if (n == 0) return;
    printf ("%d", n);
    fun1(++n);
    printf ("%d", n);
}
```
The output printed when fun1 (5) is called is

- A) 53423122233445  ✔ official
- B) 53423120112233
- C) 53423122132435
- D) 53423120213243

---

**2017_FN_Q57** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the C functions foo and bar given below:
```c
int foo (int val) {
    int x = 0;
    while (val > 0) {
        x = x + foo (val --);
    }
    return val;
}
int bar (int val) {
    int x = 0;
    while (val > 0) {
        x = x + bar (val -1);
    }
    return val;
}
```
Invocations of foo (3) and bar (3) will result in :

- A) Return of 6 and 6 respectively.
- B) Infinite loop and abnormal termination respectively.
- C) Abnormal termination and infinite loop respectively.  ✔ official
- D) Both terminating abnormally.

