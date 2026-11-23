# Review input: Compiler Design, chapter 07: Local optimisation

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-07-local-optimisation.md` and `gemini-07-local-optimisation.md` in this folder.

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

This is **one chapter** (7 of 8) of the Compiler Design book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Local optimisation**. Not written yet.



## The PYQs for this chapter (9)

**2025_AN_Q21** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the following statements about the use of backpatching in a compiler for intermediate code generation:
(I) Backpatching can be used to generate code for Boolean expression in one pass.
(II) Backpatching can be used to generate code for flow-of-control statements in one pass.
Which ONE of the following options is CORRECT?

- A) Only (I) is correct.
- B) Only (II) is correct.
- C) Both (I) and (II) are correct.  ✔ official
- D) Neither (I) nor (II) is correct.

---

**2025_FN_Q52** · 2025-FN · NAT · 2 marks · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Refer to the given 3-address code sequence. This code sequence is split into basic blocks. The number of basic blocks is ________. (Answer in integer)
1001: i = 1
1002: j = 1
1003: t1 = 10 * i
1004: t2 = t1 + j
1005: t3 = 8 * t2
1006: t4 = t3 - 88
1007: a[t4] = 0.0
1008: j = j + 1
1009: if j <= 10 goto 1003
1010: i = i + 1
1011: if i <= 10 goto 1002
1012: i = 1
1013: t5 = i - 1
1014: t6 = 88 * t5
1015: a[t6] = 1.0
1016: i = i + 1
1017: if i <= 10 goto 1013

Official answer (numeric): 6 to 6

---

**2024_FN_Q51** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the following pseudo-code.
\( L1: \quad t1 = -1 \)
\( L2: \quad t2 = 0 \)
\( L3: \quad t3 = 0 \)
\( L4: \quad t4 = 4 * t3 \)
\( L5: \quad t5 = 4 * t2 \)
\( L6: \quad t6 = t5 * M \)
\( L7: \quad t7 = t4 + t6 \)
\( L8: \quad t8 = a[t7] \)
\( L9: \quad \text{if } t8 <= \max \text{ goto } L11 \)
\( L10: \quad t1 = t8 \)
\( L11: \quad t3 = t3 + 1 \)
\( L12: \quad \text{if } t3 < M \text{ goto } L4 \)
\( L13: \quad t2 = t2 + 1 \)
\( L14: \quad \text{if } t2 < N \text{ goto } L3 \)
\( L15: \quad \max = t1 \)
Which one of the following options CORRECTLY specifies the number of basic blocks and the number of instructions in the largest basic block, respectively?

- A) 6 and 6
- B) 6 and 7
- C) 7 and 7
- D) 7 and 6  ✔ official

---

**2024_AN_Q48** · 2024-AN · MCQ · 2 marks · Medium · bank topic: Intermediate Code Generation & Local Code Optimization · HAS A FIGURE (not shown here)

Consider the following expression: \( x[i] = (p + r)* - s[i] + u/w \). The following sequence shows the list of triples representing the given expression, with entries missing for triples (1), (3), and (6).
[IMAGE_Q_48_1]
Which of the following options fill in the missing entries CORRECTLY?

- A) (1) = [ ] s i, (3) *(0) (2), (6) [ ] = x i  ✔ official
- B) (1) [ ] = s i, (3) - (0) (2), (6) = [ ] x (5)
- C) (1) = [ ] s i, (3) *(0) (2), (6) [ ] = x (5)
- D) (1) [ ] = s i, (3) - (0) (2), (6) = [ ] x i

---

**2021_AN_Q22** · 2021-AN · MSQ · 1 mark · Easy · bank topic: Intermediate Code Generation & Local Code Optimization

In the context of compilers, which of the following is/are NOT an intermediate representation of the source program?

- A) Three address code
- B) Abstract Syntax Tree (AST)
- C) Control Flow Graph (CFG)
- D) Symbol table  ✔ official

---

**2021_AN_Q43** · 2021-AN · MCQ · 2 marks · Hard · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the following ANSI C code segment:
```c
z = x + 3 + y -> f1 + y -> f2;
for (i = 0; i < 200; i = i + 2) {
    if (z > i) {
        p = p + x + 3;
        q = q + y -> f1;
    } else {
        p = p + y -> f2;
        q = q + x + 3;
    }
}
```
Assume that the variable \(y\) points to a struct (allocated on the heap) containing two fields \(f1\) and \(f2\), and the local variables \(x\), \(y\), \(z\), \(p\), \(q\), and \(i\) are allotted registers. Common sub-expression elimination (CSE) optimization is applied on the code. The number of addition and dereference operations (of the form \(y \rightarrow f1\) or \(y \rightarrow f2\)) in the optimized code, respectively, are :

- A) 403 and 102
- B) 203 and 2
- C) 303 and 102
- D) 303 and 2  ✔ official

---

**2021_FN_Q11** · 2021-FN · NAT · 2 marks · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the following C code segment:
```c
a = b + c;
e = a + 1;
d = b + c;
f = d + 1;
g = e + f;
```
In a compiler, this code segment is represented internally as a directed acyclic graph (DAG). The number of nodes in the DAG is _________.

Official answer (numeric): 6 to 6

---

**2017_FN_Q16** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the following intermediate program in three address code
```
p = a - b
q = p * c
p = u * v
q = p + q
```
Which one of the following corresponds to a static single assignment form of the above code?

- A) ``` p_1 = a - b q_1 = p_1 * c p_1 = u * v q_1 = p_1 + q_1 ```
- B) ``` p_3 = a - b q_4 = p_3 * c p_4 = u * v q_5 = p_4 + q_4 ```  ✔ official
- C) ``` p_1 = a - b q_1 = p_2 * c p_3 = u * v q_2 = p_4 + q_3 ```
- D) ``` p_1 = a - b q_1 = p * c q_2 = u * v q_2 = p + q ```

---

**2017_FN_Q54** · 2017-FN · NAT · 2 marks · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the expression \((a - 1) * (((b + c)/3) + d)\). Let \(X\) be the minimum number of registers required by an optimal code generation (without any register spill) algorithm for a load/store architecture, in which (i) only load and store instructions can have memory operands and (ii) arithmetic instructions can have only register or immediate operands. The value of \(X\) is ________.

Official answer (numeric): 2.0 to 2.0

