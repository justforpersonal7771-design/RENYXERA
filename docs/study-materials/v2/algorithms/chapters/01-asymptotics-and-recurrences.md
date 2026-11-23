# Review input: Algorithms, chapter 01: Asymptotics and recurrences

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-01-asymptotics-and-recurrences.md` and `gemini-01-asymptotics-and-recurrences.md` in this folder.

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

This is **one chapter** (1 of 9) of the Algorithms book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Asymptotics and recurrences**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (19)

**2026_FN_Q17** · 2026-FN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following recurrence relations:
For all \( n > 1 \),
$$ T_1(n) = 4T_1\left(\frac{n}{2}\right) + T_2(n) $$
$$ T_2(n) = 5T_2\left(\frac{n}{4}\right) + \theta(\log_2 n) $$
Assume that for all \( n \le 1 \), \( T_1(n) = 1 \) and \( T_2(n) = 1 \).
Which one of the following options is correct?

- A) \( T_1(n) = \theta(n^2) \)  ✔ official
- B) \( T_1(n) = \theta(n^2 \log_2 n) \)
- C) \( T_1(n) = \theta(n^{\log_4 5}) \)
- D) \( T_1(n) = \theta(n^{\log_4 5} \log_2 n) \)

---

**2026_AN_Q24** · 2026-AN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following functions, where \( n \) is a positive integer.
$$ n^{1/3}, \log(n), \log(n!), 2^{\log(n)} $$
Which one of the following options lists the functions in increasing order of asymptotic growth rate?
*Note:* Assume the base of log to be 2.

- A) \( \log(n), n^{1/3}, 2^{\log(n)}, \log(n!) \)  ✔ official
- B) \( n^{1/3}, \log(n), \log(n!), 2^{\log(n)} \)
- C) \( \log(n), n^{1/3}, \log(n!), 2^{\log(n)} \)
- D) \( 2^{\log(n)}, n^{1/3}, \log(n), \log(n!) \)

---

**2026_AN_Q25** · 2026-AN · MSQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Which of the following can be recurrence relation(s) corresponding to an algorithm with time complexity \( \Theta(n) \)?

- A) \( T(n) = T(n - 1) + 1, \quad T(1) = 1 \)  ✔ official
- B) \( T(n) = 2T\left(\frac{n}{2}\right) + 1, \quad T(1) = 1 \)  ✔ official
- C) \( T(n) = 2T\left(\frac{n}{2}\right) + n, \quad T(1) = 1 \)
- D) \( T(n) = T(n - 1) + n, \quad T(1) = 1 \)

---

**2025_FN_Q20** · 2025-FN · MCQ · 1 mark · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following recurrence relation:
\( T(n) = 2T(n - 1) + n2^n \) for \( n > 0 \), \( T(0) = 1 \)
Which ONE of the following options is CORRECT?

- A) \( T(n) = \Theta(n^2 2^n) \)  ✔ official
- B) \( T(n) = \Theta(n 2^n) \)
- C) \( T(n) = \Theta((\log n)^2 2^n) \)
- D) \( T(n) = \Theta(4^n) \)

---

**2024_FN_Q20** · 2024-FN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Given an integer array of size \( N \), we want to check if the array is sorted (in either ascending or descending order). An algorithm solves this problem by making a single pass through the array and comparing each element of the array only with its adjacent elements. The worst-case time complexity of this algorithm is

- A) Both \( O(N) \) and \( \Omega(N) \)  ✔ official
- B) \( O(N) \) but not \( \Omega(N) \)
- C) \( \Omega(N) \) but not \( O(N) \)
- D) Neither \( O(N) \) nor \( \Omega(N) \)

---

**2024_FN_Q57** · 2024-FN · MCQ · 2 marks · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following recurrence relation:
\[ T(n) = \begin{cases} \sqrt{n} T(\sqrt{n}) + n & \text{for } n \ge 1 \\ 1 & \text{for } n = 1 \end{cases} \]
Which one of the following options is CORRECT?

- A) \( T(n) = \Theta(n \log \log n) \)  ✔ official
- B) \( T(n) = \Theta(n \log n) \)
- C) \( T(n) = \Theta(n^2 \log n) \)
- D) \( T(n) = \Theta(n^2 \log \log n) \)

---

**2023_FN_Q29** · 2023-FN · MSQ · 1 mark · Easy · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Let \( f \) and \( g \) be functions of natural numbers given by \( f(n) = n \) and \( g(n) = n^2 \).
Which of the following statements is/are TRUE?

- A) \( f \in O(g) \)  ✔ official
- B) \( f \in \Omega(g) \)
- C) \( f \in o(g) \)  ✔ official
- D) \( f \in \Theta(g) \)

---

**2023_FN_Q54** · 2023-FN · MSQ · 2 marks · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider functions Function 1 and Function 2 expressed in pseudocode as follows:
Function 1
```
while n > 1 do
    for i = 1 to n do
        x = x + 1;
    end for
    n = \lfloor n/2 \rfloor;
end while
```
Function 2
```
for i = 1 to 100 * n do
    x = x + 1;
end for
```
Let \(f_1(n)\) and \(f_2(n)\) denote the number of times the statement "x = x + 1" is executed in Function_1 and Function_2, respectively.
Which of the following statements is/are TRUE?

- A) \(f_1(n) \in \Theta(f_2(n))\)  ✔ official
- B) \(f_1(n) \in o(f_2(n))\)
- C) \(f_1(n) \in \omega(f_2(n))\)
- D) \(f_1(n) \in O(n)\)  ✔ official

---

**2022_FN_Q11** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Which one of the following statements is TRUE for all positive functions \(f(n)\)?

- A) \(f(n^2) = \theta(f(n)^2)\), when \(f(n)\) is a polynomial  ✔ official
- B) \(f(n^2) = o(f(n)^2)\)
- C) \(f(n^2) = O(f(n)^2)\), when \(f(n)\) is an exponential function
- D) \(f(n^2) = \Omega(f(n)^2)\)

---

**2021_FN_Q61** · 2021-FN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following three functions:
\(f_1 = 10^n, f_2 = n^{\log n}, f_3 = n^{\sqrt{n}}\) 
Which one of the following options arranges the functions in the increasing order of asymptotic growth rate?

- A) \(f_3, f_2, f_1\)
- B) \(f_2, f_1, f_3\)
- C) \(f_1, f_2, f_3\)
- D) \(f_2, f_3, f_1\)  ✔ official

---

**2021_FN_Q50** · 2021-FN · MCQ · 2 marks · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following recurrence relation:
$$ T(n) = \begin{cases} T\left(\left\lceil \frac{n}{2} \right\rceil\right) + T\left(\left\lfloor \frac{2n}{5} \right\rfloor\right) + 7n & \text{if } n > 0 \\ 1 & \text{if } n = 0 \end{cases} $$
Which one of the following options is correct?

- A) \(T(n) = \theta(n^{5/2})\)
- B) \(T(n) = \theta(n \log n)\)
- C) \(T(n) = \theta(n)\)  ✔ official
- D) \(T(n) = \theta((\log n)^{5/2})\)

---

**2021_AN_Q55** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

For constants \(a \geq 1\) and \(b > 1\), consider the following recurrence defined on the non-negative integers:
$$ T(n) = a \cdot T\left(\left\lceil \frac{n}{b} \right\rceil\right) + f(n) $$
Which one of the following options is correct about the recurrence \(T(n)\)?

- A) If \(f(n)\) is \(n \log_2(n)\), then \(T(n)\) is \(\Theta(n \log_2(n))\).
- B) If \(f(n)\) is \(\frac{n}{\log_2(n)}\), then \(T(n)\) is \(\Theta(\log_2(n))\).
- C) If \(f(n)\) is \(O(n^{\log_b(a) - \epsilon})\) for some \(\epsilon > 0\), then \(T(n)\) is \(\Theta(n^{\log_b(a)})\).  ✔ official
- D) If \(f(n)\) is \(\Theta(n^{\log_b(a)})\), then \(T(n)\) is \(\Theta(n^{\log_b(a)})\).

---

**2020_FN_Q34** · 2020-FN · MCQ · 1 mark · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

For parameters \( a \) and \( b \), both of which are \( \omega(1) \), \( T(n) = T(n^{1/a}) + 1 \), and \( T(b) = 1 \). Then \( T(n) \) is

- A) \( \Theta(\log_a \log_b n) \)  ✔ official
- B) \( \Theta(\log_{ab} n) \)
- C) \( \Theta(\log_b \log_a n) \)
- D) \( \Theta(\log_2 \log_2 n) \)

---

**2018_FN_Q42** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following C code. Assume that unsigned long int type length is 64 bits.
```c
unsigned long int fun(unsigned long int n){
    unsigned long int i, j = 0, sum = 0;
    for (i = n; i > 1; i = i/2) j++;
    for ( ; j > 1; j = j/2) sum++;
    return(sum);
}
```
The value returned when we call `fun` with the input \(2^{40}\) is

- A) 4
- B) 5  ✔ official
- C) 6
- D) 40

---

**2018_FN_Q55** · 2018-FN · NAT · 2 marks · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following program written in pseudo-code. Assume that x and y are integers.
```c
Count(x,y) {
    if (y != 1){ 
        if (x != 1) {
            print("*");
            Count(x/2, y);
        }
        else {
            y = y-1;
            Count(1024, y);
        }
    }
}
```
The number of times that the print statement is executed by the call Count(1024,1024) is _____.

Official answer (numeric): 10230 to 10230

---

**2017_AN_Q19** · 2017-AN · MCQ · 1 mark · Easy · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Match the algorithms with their time complexities:
List-I (Algorithm)
(P) Towers of Hanoi with n disks
(Q) Binary search given n sorted numbers
(R) Heap sort given n numbers at the worst case
(S) Addition of two \(n \times n\) matrices
List-II (Time complexity)
(i) \(\Theta(n^2)\)
(ii) \(\Theta(n \log n)\)
(iii) \(\Theta(2^n)\)
(iv) \(\Theta(\log n)\)

- A) P - (iii), Q - (iv), R - (i), S - (ii)
- B) P - (iv), Q - (iii), R - (i), S - (ii)
- C) P - (iii), Q - (iv), R - (ii), S - (i)  ✔ official
- D) P - (iv), Q - (iii), R - (ii), S - (i)

---

**2017_FN_Q21** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following functions from positive integers to real numbers:
\(10, \sqrt{n}, n, \log_2 n, \frac{100}{n}\)
The CORRECT arrangement of the above functions in increasing order of asymptotic complexity is:

- A) \(\log_2 n, \frac{100}{n}, 10, \sqrt{n}, n\)
- B) \(\frac{100}{n}, 10, \log_2 n, \sqrt{n}, n\)  ✔ official
- C) \(10, \frac{100}{n}, \sqrt{n}, \log_2 n, n\)
- D) \(\frac{100}{n}, \log_2 n, 10, \sqrt{n}, n\)

---

**2017_AN_Q50** · 2017-AN · MCQ · 2 marks · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the recurrence function
\(T(n) = \begin{cases} 2T(\sqrt{n}) + 1, & n > 2 \\ 2, & 0 < n \leq 2 \end{cases}\)
Then \(T(n)\) in terms of \(\Theta\) notation is

- A) \(\Theta(\log \log n)\)
- B) \(\Theta(\log n)\)  ✔ official
- C) \(\Theta(\sqrt{n})\)
- D) \(\Theta(n)\)

---

**2017_AN_Q61** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following C function.
```c
int fun (int n)
{
    int i, j;
    for (i = 1; i <= n; i++)
    {
        for (j = 1; j < n; j += i)
        {
            printf("%d %d", i, j);
        }
    }
}
```
Time complexity of fun in terms of \(\Theta\) notation is

- A) \(\Theta(n\sqrt{n})\)
- B) \(\Theta(n^2)\)
- C) \(\Theta(n \log n)\)  ✔ official
- D) \(\Theta(n^2 \log n)\)

