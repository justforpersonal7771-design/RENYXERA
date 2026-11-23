# Review input: Programming and Data Structures, chapter 02: Operators, decisions and loops

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-02-operators-decisions-and-loops.md` and `gemini-02-operators-decisions-and-loops.md` in this folder.

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

This is **one chapter** (2 of 16) of the Programming and Data Structures book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

### 02 · Operators, decisions and loops  (High weight; 8 PYQs, 14 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C3 Operators: precedence, `++`/`--`, short-circuit, bitwise, undefined behaviour | [MUST] | 8 | 2024_FN_Q30, 2022_FN_Q44, 2021_FN_Q58, 2017_AN_Q58 | Custom precedence tables (figure), bit operations on characters, `&&` with `i++`, prefix and postfix. |
| C4 Decisions: if, else, switch and fall-through | [MUST] | 3 | none | Appears inside output questions. |
| C5 Loops: while, do-while, for; counting iterations; loop traps | [MUST] | 6 | 2024_FN_Q21, 2024_FN_Q47, 2019_FN_Q48, 2017_AN_Q53 | Loop that never ends, growth of `x = x + x + y`, loop invariants for division by subtraction. |




## The PYQs for this chapter (8)

**2024_FN_Q21** · 2024-FN · MCQ · 1 mark · Medium · bank topic: Data Types, Syntax, Control Structures, Loops

Consider the following C program:
```c
# include <stdio.h>
int main( ) {
    int a = 6;
    int b = 0;
    while (a < 10) {
        a = a/12 + 1;
        a += b;
    }
    printf("%d", a);
    return 0;
}
```
Which one of the following statements is CORRECT?

- A) The program prints 9 as output
- B) The program prints 10 as output
- C) The program gets stuck in an infinite loop  ✔ official
- D) The program prints 6 as output

---

**2024_FN_Q30** · 2024-FN · NAT · 1 mark · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · HAS A FIGURE (not shown here)

Consider the operator precedence and associativity rules for the integer arithmetic operators given in the table below.
[IMAGE_Q_30_1]
The value of the expression 3 + 1 + 5 * 2 / 7 + 2 - 4 - 7 - 6 / 2 as per the above rules is ________.

Official answer (numeric): 6 to 6

---

**2024_FN_Q47** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion

Consider the following C function definition.
```c
int f (int x, int y) {
    for (int i = 0; i < y; i++ )
        x = x + x + y;
    return x;
}
```
Which of the following statements is/are TRUE about the above function?

- A) If the inputs are \( x = 20, y = 10 \), then the return value is greater than \( 2^{20} \)
- B) If the inputs are \( x = 20, y = 20 \), then the return value is greater than \( 2^{20} \)  ✔ official
- C) If the inputs are \( x = 20, y = 10 \), then the return value is less than \( 2^{10} \)
- D) If the inputs are \( x = 10, y = 20 \), then the return value is greater than \( 2^{20} \)  ✔ official

---

**2022_FN_Q44** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · HAS A FIGURE (not shown here)

What is printed by the following ANSI C program?
```c
#include <stdio.h>
int main(int argc, char *argv[ ]) {
    char a = 'P';
    char b = 'x';
    char c = (a & b) + '*';
    char d = (a | b) - '-';
    char e = (a ^ b) + '+';
    printf("%c %c %c\n", c, d, e);
    return 0;
}
```
ASCII encoding for relevant characters is given below:

[IMAGE_Q_44]

- A) z K S  ✔ official
- B) 122 75 83
- C) * - +
- D) P x +

---

**2021_FN_Q58** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops

Consider the following ANSI C program:
```c
#include <stdio.h>
int main( )
{
    int i, j, count;
    count = 0;
    i = 0;
    for (j = -3; j <= 3; j++)
    {
        if ((j >= 0) && (i++))
            count = count + j;
    }
    count = count + i;
    printf("%d", count);
    return 0;
}
```
Which one of the following options is correct?

- A) The program will not compile successfully.
- B) The program will compile successfully and output 10 when executed  ✔ official
- C) The program will compile successfully and output 8 when executed.
- D) The program will compile successfully and output 13 when executed.

---

**2019_FN_Q48** · 2019-FN · NAT · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops

Consider the following C program:
```c
#include <stdio.h>
int main ( ) {
    float sum = 0.0, j = 1.0, i = 2.0;
    while (i / j > 0.0625) {
        j = j + j;
        sum = sum + i / j;
        printf("%f\n", sum);
    }
    return 0;
}
```
The number of times the variable sum will be printed, when the above program is executed, is ________.

Official answer (numeric): 5 to 5

---

**2017_AN_Q53** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops

Consider the C program fragment below which is meant to divide x by y using repeated subtractions. The variables x, y, q and r are all unsigned int.
```c
while (r >= y)
{
    r = r - y;
    q = q + 1;
}
```
Which of the following conditions on the variables x, y, q and r before the execution of the fragment will ensure that the loop terminates in a state satisfying the condition \(x == (y \times q + r)\)?

- A) \((q == r) \text{ \&\& } (r == 0)\)
- B) \((x > 0) \text{ \&\& } (r == x) \text{ \&\& } (y > 0)\)
- C) \((q == 0) \text{ \&\& } (r == x) \text{ \&\& } (y > 0)\)  ✔ official
- D) \((q == 0) \text{ \&\& } (y > 0)\)

---

**2017_AN_Q58** · 2017-AN · NAT · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops

Consider the following C program
```c
# include <stdio.h>
int main( )
{
    int m = 10;
    int n, n1;
    n = ++m;
    n1 = m++;
    n--;
    --n1;
    n -= n1;
    printf("%d", n);
    return 0;
}
```
The output of the program is ________.

Official answer (numeric): 0.0 to 0.0

