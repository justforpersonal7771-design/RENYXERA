# In-depth review input: Programming and Data Structures

**One file, one review.** Paste everything below the line into ChatGPT (new chat), and again into Gemini (new chat). If the chat refuses the length, attach this file and write: "Follow the instructions inside the file."

Save the replies in this folder as `chatgpt-review-programming-and-data-structures.md` and `gemini-review-programming-and-data-structures.md`, then tell me.

Contains: reviewer instructions (A), the subject's contents with the PYQ statistics (B), and all 99 PYQs with full text and the official key (C).

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

This is the **in-depth review of the whole Programming and Data Structures book**. Take your time. Go chapter by chapter, and give a much deeper answer than a quick review: at least **80 rows** in the gap table in Part 2 (spread across every chapter).

If your reply gets too long, **stop at the end of a chapter** and write "CONTINUE FROM CHAPTER <number>". I will answer "continue" and you carry on. Do not shorten later chapters to fit; every chapter gets the same depth.

In addition to Parts 1 to 4 above, answer these parts:

PART 5. THE FULL PLAN, CHAPTER BY CHAPTER
 For every chapter (the ones given below, plus any you think are missing), list the lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with the reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind and what it shows); hand traces; common mistakes.

PART 6. EVERY PYQ LISTED BELOW
 For EACH previous-year question: (a) the chapter and lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree show the working and write FACT-DOUBT), (e) whether the question text looks mis-transcribed (say exactly what).

PART 7. MORE QUESTIONS NEEDED
 For each lesson, three question ideas GATE could ask that the PYQs do not cover (one line each, with the type MCQ / MSQ / NAT).

PART 8. WHAT IS MISSING FROM THE SUBJECT
 Topics GATE has asked, or could ask, that no chapter below covers.

PART 9. WEIGHTS
 Give each chapter a weight tag (High / Medium / Low / Foundation) and say whether the one derived from the bank (below) looks fair. Do not invent frequencies; write "not sure".
```

---

## PART B. THE CONTENTS TO REVIEW


Written 24 Nov 2026. Every count below is computed from `data/Aggregated_Output.json` (15 CS papers, 2017 to 2026) by re-tagging each P&DS question to a chapter and lesson of the v2 plans (`pds-pyq-tags.tsv` holds the tag of every question). **Nothing here is estimated except hours.**

## 1. What the data says

| | |
|---|---|
| P&DS questions in the bank | **99** (57 Programming in C + 42 Data Structures) |
| P&DS marks | **152 of 1500** = **10.1%** of all marks (about 10.1 marks a paper) |
| Types | 16 NAT-1, 24 NAT-2, 27 MCQ-1, 24 MCQ-2, 3 MSQ-1, 5 MSQ-2 |
| Questions with a figure | 10 |
| Forge (our own) P&DS questions | **35** (17 C, 18 DS), not yet tagged by lesson |
| Lessons in the app today | 28 topics in 8 chapters (to be rewritten to the new standard) |

**Why the app's Contents sheet shows 194 PYQs but the bank has only 99:** the sheet adds up questions by matching words in each chapter title to the bank's 8 coarse topic labels, so one question is counted in several chapters ("Functions, Parameter Passing, Scope Rules, Recursion" counts for both *Programming in C* and *Recursion*; "Pointers, Multi-Dimensional Arrays, Structures" for both *C* and *Arrays*). The new tags below give every question exactly one chapter, so the numbers add up.

## 2. The contents

The 8 existing chapters stay (same names, same order where possible) and **8 are added** so that each lesson of the v2 plans has a home. Hashing stays in the Algorithms book and B/B+ trees in DBMS (a short link from here). Weight = share of the 152 P&DS marks; the tier is relative inside this book.

| # | Chapter | Grows from | PYQs | Marks | % of all marks | Weight | Years | Lessons (plan v2) |
|---|---|---|---|---|---|---|---|---|
| 01 | Programming in C: the basics | Programming in C (types (1 of 5)) | 1 | 2 | 0.13% | Low | 1 of 10 | 14 |
| 02 | Operators, decisions and loops | Programming in C (control (1 of 5)) | 8 | 14 | 0.93% | High weight | 5 of 10 | 11 |
| 03 | Functions, scope and storage | Programming in C (func (1 of 5)) | 9 | 12 | 0.80% | Medium | 6 of 10 | 10 |
| 04 | Recursion | Recursion (3 ready) | 12 | 20 | 1.33% | High weight | 8 of 10 | 8 |
| 05 | Arrays | Arrays (3 ready) | 2 | 4 | 0.27% | Low | 2 of 10 | 8 |
| 06 | Pointers | Programming in C (ptr (1 of 5)) | 12 | 18 | 1.20% | High weight | 9 of 10 | 12 |
| 07 | Strings | Programming in C (ptr (shared)) | 3 | 4 | 0.27% | Low | 3 of 10 | 4 |
| 08 | Structures and dynamic memory | Programming in C (mem (1 of 5)) | 4 | 5 | 0.33% | Medium | 4 of 10 | 8 |
| 09 | Preprocessor, files and reading code | (new) (-) | 5 | 9 | 0.60% | Medium | 4 of 10 | 9 |
| 10 | Linked lists | Linked lists (3 ready) | 6 | 8 | 0.53% | Medium | 6 of 10 | 6 |
| 11 | Stacks and queues | Stacks and queues (4 ready) | 8 | 13 | 0.87% | Medium | 8 of 10 | 9 |
| 12 | Trees and binary search trees | Trees and binary search trees (4 ready) | 18 | 25 | 1.67% | High weight | 9 of 10 | 14 |
| 13 | Binary heaps | Binary heaps (3 ready) | 10 | 16 | 1.07% | High weight | 8 of 10 | 4 |
| 14 | Graphs: representation | Graphs: representation (3 ready) | 0 | 0 | 0.00% | Foundation (no PYQ tag) | 0 of 10 | 3 |
| 15 | Maths toolkit and choosing a structure | (new) (-) | 1 | 2 | 0.13% | Low | 1 of 10 | 13 |
| 16 | Previous-year practice | (new) (-) | 0 | 0 | 0.00% | Foundation (no PYQ tag) | 0 of 10 | 4 |
| | **Total** | | **99** | **152** | **10.1%** | | | **137** |

*Tiers: High = top third of the chapters that have PYQs by marks, Medium = middle third, Low = bottom third. "Foundation" = no P&DS PYQ is tagged there, but later chapters cannot be understood without it, so it stays and is marked [MUST] or [LATER] by the plans.*

## 3. Chapter by chapter: lessons, tags, and every PYQ

### 01 · Programming in C: the basics  (Low; 1 PYQs, 2 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C0 How a computer runs a program (RAM, bits, bytes, hex, compile and link) | [MUST] | 5 | none | Bridge lesson. No PYQ asks it directly; every later lesson needs it. |
| C1 Your first program: main, printf, scanf, errors, running C today | [MUST] | 6 | none | Not asked on its own; `printf`/`scanf` return values and format traps come up inside output questions. |
| C2 Variables and data types: ranges, two's complement, endianness, conversions, overflow | [MUST] | 10 | 2017_FN_Q58 | Unsigned vs signed (`strlen` difference test), `sizeof`, promotion, `float` traps. |

### 02 · Operators, decisions and loops  (High weight; 8 PYQs, 14 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C3 Operators: precedence, `++`/`--`, short-circuit, bitwise, undefined behaviour | [MUST] | 8 | 2024_FN_Q30, 2022_FN_Q44, 2021_FN_Q58, 2017_AN_Q58 | Custom precedence tables (figure), bit operations on characters, `&&` with `i++`, prefix and postfix. |
| C4 Decisions: if, else, switch and fall-through | [MUST] | 3 | none | Appears inside output questions. |
| C5 Loops: while, do-while, for; counting iterations; loop traps | [MUST] | 6 | 2024_FN_Q21, 2024_FN_Q47, 2019_FN_Q48, 2017_AN_Q53 | Loop that never ends, growth of `x = x + x + y`, loop invariants for division by subtraction. |

### 03 · Functions, scope and storage  (Medium; 9 PYQs, 12 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C6 Functions and the call stack; argument evaluation order | [MUST] | 6 | 2026_AN_Q19, 2025_AN_Q63, 2024_AN_Q21, 2019_FN_Q24 | Argument order (right to left), nested calls, call by value. |
| C7 Scope, lifetime, `static`, `extern`, `register`; the memory map | [MUST] | 6 | 2026_FN_Q34, 2023_FN_Q35, 2019_FN_Q52, 2017_FN_Q43, 2017_AN_Q17 | `static` counters across calls, shadowing, matching storage classes, activation records. |
| C17 Parameter passing and scoping rules (GATE view) | [SHOULD] | 5 | none | Rarely asked as a pure question; supports pointer questions. |

### 04 · Recursion  (High weight; 12 PYQs, 20 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C8 Recursion in C: stack frames, call trees, `static` with recursion, counting calls | [MUST] | 8 | 2026_FN_Q61, 2026_AN_Q61, 2024_FN_Q27, 2023_FN_Q36, 2021_FN_Q62, 2021_AN_Q47, 2021_AN_Q48, 2020_FN_Q48, 2019_FN_Q40, 2018_FN_Q31, 2017_FN_Q64, 2017_FN_Q57 | What does `f(n)` return, how many calls, print order, activation trees. |
| D6 Recursion on data structures: list, tree, Hanoi, recurrences from call trees | [MUST] | 5 | none | Recursive list size, tree sum in post order. |

### 05 · Arrays  (Low; 2 PYQs, 4 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C9 Arrays in C: indexing, 2-D and 3-D layout, address formulas | [MUST] | 7 | 2022_FN_Q43, 2017_AN_Q64 | 3-D array indexing; bubble-sort style loops. |
| D2 Arrays as a data structure: operations, special matrices, binary search, dynamic arrays | [MUST] | 8 | none | Address and packed-index formulas (asked often outside this bank's PDS tag). |

### 06 · Pointers  (High weight; 12 PYQs, 18 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C10 Pointers I: memory and addresses (`&`, `*`, NULL, swapping) | [MUST] | 7 | 2026_AN_Q60, 2025_FN_Q34, 2022_FN_Q21, 2017_AN_Q32 | Value after assignments through pointers; call by value with a pointer parameter. |
| C11 Pointers II: arithmetic, arrays and pointers, 2-D family, `*p++` | [MUST] | 8 | 2025_FN_Q61, 2025_AN_Q62, 2024_AN_Q50, 2021_AN_Q52, 2020_FN_Q16, 2019_FN_Q15, 2019_FN_Q65 | Pointer difference, `*(arr[1]+9)`, `*(*(a+**a+2)+3)`, `ip[1]`, pointer walks. |
| C13 Pointers III: pointer to pointer, function pointers, reading declarations, `const` | [SHOULD] | 7 | 2018_FN_Q39 | Swapping two `char *` by value vs by address. |

### 07 · Strings  (Low; 3 PYQs, 4 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C12 Strings: `char s[]` vs `char *p`, `string.h`, string loops, pointer tricks | [MUST] | 7 | 2025_AN_Q19, 2024_AN_Q19, 2017_AN_Q49 | Copy with overlap, pointer difference as length, `strlen(c+2[p]-6[p]-1)`. |

### 08 · Structures and dynamic memory  (Medium; 4 PYQs, 5 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C14 struct, union, enum, bit-fields, typedef; padding and alignment | [MUST] | 8 | 2018_FN_Q12 | Struct cast to `char *`, member access. |
| C15 Dynamic memory: malloc, calloc, realloc, free; leaks and dangling pointers | [MUST] | 7 | 2026_AN_Q17, 2021_AN_Q35, 2017_FN_Q32 | Heap vs stack, memory leak, uninitialised `next` pointer. |

### 09 · Preprocessor, files and reading code  (Medium; 5 PYQs, 9 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C16 Preprocessor and macros | [MUST] | 4 | none | Not in this bank's PDS tag; macros appear in C-output questions in other years. |
| C18 Files, errors, variable arguments | [LATER] | 3 | none | Not asked in this bank. |
| C19 Reading mystery functions: GCD, digits, bits, binary conversion, Horner | [MUST] | 5 | 2025_FN_Q63, 2025_AN_Q33, 2024_AN_Q62, 2021_FN_Q33, 2020_FN_Q42 | Digit-skipping loop, GCD by subtraction, Horner evaluation, binary exponentiation, subarray code. |
| C20 Output-prediction method and undefined behaviour | [MUST] | 5 | none | Skills lesson. Every output question uses it. |

### 10 · Linked lists  (Medium; 6 PYQs, 8 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| D3 Linked lists: operations, reversal, pointer traps, doubly and circular lists | [MUST] | 10 | 2026_FN_Q39, 2025_FN_Q62, 2023_FN_Q13, 2022_FN_Q15, 2020_FN_Q15, 2017_FN_Q35 | Delete cost (singly vs doubly), list modification by code with a figure, `join`, sorted insertion cost, reversal. |

### 11 · Stacks and queues  (Medium; 8 PYQs, 13 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| D4 Stacks: operations, expression conversion, permutations, min-stack | [MUST] | 9 | 2026_AN_Q50, 2025_AN_Q45, 2024_AN_Q65 | Push/pop traces, min in O(1), two stacks of limited size. |
| D5 Queues: circular, deque, queue by stacks; priority-queue idea | [MUST] | 7 | 2023_FN_Q59, 2022_FN_Q62, 2021_FN_Q43, 2018_FN_Q13, 2017_AN_Q20 | Linked queue costs, circular linked queue, mixed stack-and-queue traces. |

### 12 · Trees and binary search trees  (High weight; 18 PYQs, 25 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| D7 Trees: vocabulary, counting facts, traversals, rebuilding from traversals | [MUST] | 11 | 2026_FN_Q33, 2026_AN_Q12, 2025_AN_Q13, 2023_FN_Q47, 2022_FN_Q28, 2018_FN_Q30, 2017_FN_Q33 | Full-tree counts and heights, traversal match, rebuild from two orders, node-count formulas. |
| D8 Binary search trees: search, insert, delete, orders, counting | [MUST] | 8 | 2026_FN_Q40, 2026_FN_Q62, 2026_AN_Q49, 2025_FN_Q26, 2025_AN_Q35, 2024_AN_Q40, 2021_FN_Q63, 2020_FN_Q20, 2020_FN_Q47, 2017_AN_Q63 | Pre-order to post-order, BST statements, height after inserts, range reporting cost, which element can be third inserted. |
| D9 AVL trees: rotations, minimum nodes, cost | [SHOULD] | 6 | 2020_FN_Q23 | AVL insertion cost. |

### 13 · Binary heaps  (High weight; 10 PYQs, 16 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| D10 Binary heaps: array form, insert, delete, build-heap, heap sort, positions | [MUST] | 8 | 2026_FN_Q23, 2025_FN_Q35, 2024_FN_Q42, 2024_FN_Q54, 2023_FN_Q12, 2023_FN_Q46, 2021_AN_Q21, 2020_FN_Q36, 2019_FN_Q38, 2018_FN_Q56 | Leaf indices, height of a 32-key heap, heapify result, where the maximum sits (105 keys, 1023 keys), counting heaps (7 keys = 80). |

### 14 · Graphs: representation  (Foundation (no PYQ tag); 0 PYQs, 0 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| D13 Graphs: matrix and list, degrees, BFS and DFS as traversals | [MUST] | 8 | none | No PDS-tagged PYQ in this bank; graph questions sit under Algorithms. |

### 15 · Maths toolkit and choosing a structure  (Low; 1 PYQs, 2 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| D0 What a data structure is: ADT vs implementation | [MUST] | 3 | none | Bridge. |
| D1 Counting and growth: Big-O, logs, sums, recurrences from call trees | [MUST] | 6 | none | Prerequisite for every cost question. |
| D15 Choosing the right structure: master cost table | [MUST] | 4 | 2025_AN_Q38 | Meld cost comparison (list, heap, BST). |

### 16 · Previous-year practice  (Foundation (no PYQ tag); 0 PYQs, 0 marks)

| Lesson | Tag | Hours (est.) | PYQs | What the PYQs ask |
|---|---|---|---|---|
| C21 C: previous-year patterns and mixed sets (MCQ, MSQ, NAT) | [MUST] | 8 | none | Every C PYQ again, grouped by pattern. |
| D16 Data structures: previous-year patterns and mixed sets | [MUST] | 8 | none | Every DS PYQ again, grouped by pattern. |

## 4. Verification of the 99 PYQs (done this turn)

- **All 99 were read in full** and the official key (from `Aggregated_Output.json`, which comes from the official IIT key) was compared with my own solution.
- **93 re-derived by hand** from the question text; **6 needed the figure**, which I opened and checked (2026_AN_Q19, 2025_FN_Q62, 2024_FN_Q30, 2023_FN_Q47, 2023_FN_Q36, 2022_FN_Q62). **All keys agree with my solutions**, with one note below.
- **One transcription error found and fixed:** `2023_FN_Q36` said `f1(2);` where the official paper (page 28, text layer and figure) says `f2(2);`. Without the fix the activation-tree answer cannot be reached. Fixed in `data/Aggregated_Output.json` and the public bank regenerated.
- **One question to keep an eye on:** `2022_FN_Q62` (reverse a queue with two queues): the official key is 0. Under the usual convention I get 6 (rotate Q1 to bring each element to the front). The key is authoritative, but the book's solution must say exactly how the figure's Head arrows make 0 correct, or the question will confuse readers. Flagged for the lesson writer.
- **Machine-run (24 Nov, gcc 16.2 via MSYS2):** every complete C program among the PYQs (36) was compiled and run, and **every output equals the official key**. Four are fragments in the paper (a missing include, an undefined `swap`, a missing `;`, no prototypes) and were patched minimally and then matched too; the 2023 activation-tree question (a figure question) is by hand. The infinite loop (2024_FN_Q21) and the uninitialised-pointer crash (2021_AN_Q35) behave as the keys say. From now on every C sample in the book is compiled and run before it is written.

## 5. How the PYQs are used in the book

1. Every PYQ appears **once as a solved model question** in its own lesson (the "how GATE asks it" station), with the official key and a full worked solution, and **again in the chapter's previous-year set** (chapter 16).
2. The rest of each lesson's 20-question ladder is authored (Warm-up 5, Core 6, Twisted 3 always authored; GATE-level 6 = PYQs first, then Forge, then authored).
3. Questions with a figure keep their figure.
4. No PYQ is shown without its year and shift.

## 6. Practice supply: what exists vs what the plan needs

| | Lessons | At 20 per lesson | Have (PYQ + Forge) | Still to author |
|---|---|---|---|---|
| Programming in C (ch 01 to 09) | 84 | 1680 | 56 + 17 | 1607 |
| Data structures (ch 10 to 16) | 53 | 1060 | 43 + 18 | 999 |

**This is the honest gap.** 99 real PYQs plus 35 Forge items cover about 5% of a 20-per-lesson ladder. Writing the rest means authoring about 2,600 verified questions. Options (see the decision list in the reply): lower the per-lesson count for low-weight chapters (10 instead of 20), and/or write fewer, harder questions per lesson, and always machine-verify output questions once a compiler is installed.

## 7. Notes on the bank's own tags (found while reading)

- The bank labels are coarse and sometimes wrong for our purpose: "Linked Lists & Binary Trees" holds 7 tree questions and 6 linked-list questions; "Functions, Parameter Passing, Scope Rules, Recursion" holds 26 questions of which 12 are recursion and 4 are scope/storage; "Pointers, Multi-Dimensional Arrays, Structures" holds pointer, string, array and struct questions. The new tag file fixes this for the book and should become the source of the app's weights (see the reply).
- Hashing, AVL-cost and BFS/DFS questions are filed under Algorithms in the bank. They are linked from this book but counted there.


---

## PART C. ALL 99 PREVIOUS-YEAR QUESTIONS (Programming and Data Structures)

Official key marked "✔ official". Figures are not shown; the question says so.

**2026_AN_Q12** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Linked Lists & Binary Trees · assigned chapter: 12 Trees and binary search trees; lesson D7

The set T represents various traversals over binary tree. The set S represents the order of visiting nodes during a traversal.
**T**
I: Inorder
II: Preorder
III: Postorder
**S**
L: left subtree, node, right subtree
M: node, left subtree, right subtree
N: left subtree, right subtree, node
Which one of the following is the correct match from T to S?

- A) I – L, II – M, III – N  ✔ official
- B) I – M, II – L, III – N
- C) I – N, II – M, III – L
- D) I – L, II – N, III – M

---

**2026_AN_Q17** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Dynamic Memory Allocation & File Handling · assigned chapter: 08 Structures and dynamic memory; lesson C15

In C runtime environment, which one of the following is stored in heap?

- A) A static variable declared inside a function
- B) An array of integers declared inside a function
- C) A dynamically allocated array of integers created using malloc() function call  ✔ official
- D) Return address of a function

---

**2026_AN_Q19** · 2026-AN · MCQ · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 03 Functions, scope and storage; lesson C6 · HAS A FIGURE (not shown here)

Consider the following three ANSI-C programs, P1, P2 and P3
[IMAGE_Q_19_1]
Which one of the following statements is true?

- A) Only P1 will compile without any error  ✔ official
- B) Only P2 will compile without any error
- C) Only P3 will compile without any error
- D) All three programs P1, P2, and P3 will compile without any error

---

**2026_FN_Q23** · 2026-FN · MSQ · 1 mark · Medium · bank topic: BSTs & Binary Heaps · assigned chapter: 13 Binary heaps; lesson D10

Let \( n \) be an odd number greater than 100. Consider a binary minheap with \( n \) elements stored in an array \( P \) whose index starts from 1.
Which of the following indices of \( P \) do/does NOT correspond to any leaf node of the minheap?

- A) \( \frac{n+1}{2} \)
- B) \( \frac{n-1}{2} \)  ✔ official
- C) \( \frac{n-3}{2} \)  ✔ official
- D) \( n \)

---

**2026_FN_Q33** · 2026-FN · NAT · 1 mark · Easy · bank topic: Linked Lists & Binary Trees · assigned chapter: 12 Trees and binary search trees; lesson D7

The height of a binary tree is the number of edges in the longest path from the root to a leaf in the tree. The maximum possible height of a full binary tree with 23 nodes is ________. (answer in integer)

Official answer (numeric): 11 to 11

---

**2026_FN_Q34** · 2026-FN · NAT · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 03 Functions, scope and storage; lesson C7

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

**2026_FN_Q39** · 2026-FN · MCQ · 2 marks · Easy · bank topic: Linked Lists & Binary Trees · assigned chapter: 10 Linked lists; lesson D3

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

**2026_FN_Q40** · 2026-FN · MCQ · 2 marks · Hard · bank topic: BSTs & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D8

Let \( P \) be the set of all integers from 1 to 15. Consider any order of insertion of the elements of \( P \) into a binary search tree that creates a complete binary tree.
Which one of the following elements can NEVER be the third element that is inserted?

- A) 4
- B) 2
- C) 10
- D) 5  ✔ official

---

**2026_AN_Q49** · 2026-AN · MSQ · 2 marks · Hard · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D8

Consider a binary search tree (BST) with \( n \) leaf nodes (\( n > 0 \)). Given any node \( V \), the key present in the node is denoted as \( \text{Val}(V) \). All the keys present in the given BST are distinct. The keys belong to the set of real numbers.
For a node \( V \), let \( \text{Suc}(V) \) denote the node that is its inorder successor. If a node \( V \) does not have an inorder successor, then \( \text{Suc}(V) \) is NULL. As there are no duplicates, if \( \text{Suc}(V) \) is not NULL, then \( \text{Val}(V) < \text{Val}(\text{Suc}(V)) \).
Corresponding to every leaf node \( L_i \) that has a non-NULL \( \text{Suc}(L_i) \), a new key \( k_i \) with the following property is to be inserted into the BST.
\( \text{Val}(L_i) < k_i < \text{Val}(\text{Suc}(L_i)) \)
Let \( K \) represent the list of all such new keys to be inserted into the BST.
Which of the following statements is/are true?

- A) \( K \) cannot have any duplicates  ✔ official
- B) \( K \) will have at least one element
- C) After inserting all keys from \( K \), the height of the BST can increase at most by one  ✔ official
- D) Number of nodes in the BST will double after inserting all keys from \( K \)

---

**2026_AN_Q50** · 2026-AN · MSQ · 2 marks · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues · assigned chapter: 11 Stacks and queues; lesson D4

Consider a stack \( S \) and a queue \( Q \). Both of them are initially empty and have the capacity to store ten elements each. The elements 1, 2, 3, 4, and 5 arrive one by one, in that order. When an element arrives, it is assigned either to \( S \) (pushed on \( S \)) or to \( Q \) (enqueued to \( Q \)). Once all the five elements are stored, the output is generated in two steps. First, stack \( S \) is emptied by popping all elements. Then queue \( Q \) is emptied by dequeueing all elements. The output obtained by following this process is 4 3 1 2 5 .
Given the output, the objective is to predict whether an element was assigned to \( S \) or \( Q \).
Which of the following options is/are possible valid assignment(s) of the elements?
Note: In the options, the notation \( xS \) denotes that element \( x \) was assigned to \( S \) and \( yQ \) denotes that element \( y \) was assigned to \( Q \).

- A) \( 1S, 2Q, 3S, 4S, 5Q \)  ✔ official
- B) \( 1Q, 2Q, 3S, 4S, 5Q \)  ✔ official
- C) \( 1Q, 2Q, 3Q, 4S, 5S \)
- D) \( 1S, 2S, 3S, 4Q, 5Q \)

---

**2026_AN_Q60** · 2026-AN · NAT · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C10

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

**2026_FN_Q61** · 2026-FN · NAT · 2 marks · Hard · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

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

**2026_AN_Q61** · 2026-AN · NAT · 2 marks · Hard · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

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

**2026_FN_Q62** · 2026-FN · NAT · 2 marks · Medium · bank topic: BSTs & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D8

The following sequence corresponds to the preorder traversal of a binary search tree:
50, 25, 13, 40, 30, 47, 75, 60, 70, 80, 77
The position of the element 60 in the postorder traversal of \( T \) is ________. (answer in integer)
**Note:** The position begins with 1.

Official answer (numeric): 7 to 7

---

**2025_AN_Q13** · 2025-AN · MCQ · 1 mark · Easy · bank topic: Linked Lists & Binary Trees · assigned chapter: 12 Trees and binary search trees; lesson D7

Consider a binary tree \( T \) in which every node has either zero or two children. Let \( n > 0 \) be the number of nodes in \( T \).
Which ONE of the following is the number of nodes in \( T \) that have exactly two children?

- A) \( \frac{n - 2}{2} \)
- B) \( \frac{n - 1}{2} \)  ✔ official
- C) \( \frac{n}{2} \)
- D) \( \frac{n + 1}{2} \)

---

**2025_AN_Q19** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 07 Strings; lesson C12

Consider the following C program:
```c
#include <stdio.h>
void stringcopy(char *, char *);
int main( ) {
    char a[30] = "@#Hello World!";
    stringcopy(a, a + 2);
    printf("%s\n", a);
    return 0;
}
void stringcopy(char *s, char *t) {
    while(*t)
        *s++ = *t++;
}
```
Which ONE of the following will be the output of the program?

- A) @#Hello World!
- B) Hello World!
- C) ello World!
- D) Hello World!d!  ✔ official

---

**2025_FN_Q26** · 2025-FN · MSQ · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D8

Which of the following statement(s) is/are TRUE for any binary search tree (BST) having \( n \) distinct integers?

- A) The maximum length of a path from the root node to any other node is \( (n - 1) \).  ✔ official
- B) An inorder traversal will always produce a sorted sequence of elements.  ✔ official
- C) Finding an element takes \( O(\log_2 n) \) time in the worst case.
- D) Every BST is also a Min-Heap.

---

**2025_AN_Q33** · 2025-AN · NAT · 1 mark · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 09 Reading code: mystery functions, prediction; lesson C19

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

**2025_FN_Q34** · 2025-FN · NAT · 1 mark · Easy · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C10

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

**2025_FN_Q35** · 2025-FN · NAT · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 13 Binary heaps; lesson D10

The height of any rooted tree is defined as the maximum number of edges in the path from the root node to any leaf node.
Suppose a Min-Heap \( T \) stores 32 keys. The height of \( T \) is ________. (Answer in integer)

Official answer (numeric): 5 to 5

---

**2025_AN_Q35** · 2025-AN · NAT · 1 mark · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D8

Suppose the values 10, -4, 15, 30, 20, 5, 60, 19 are inserted in that order into an initially empty binary search tree. Let \( T \) be the resulting binary search tree. The number of edges in the path from the node containing 19 to the root node of \( T \) is ________. (Answer in integer)

Official answer (numeric): 4 to 4

---

**2025_AN_Q38** · 2025-AN · MCQ · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 15 Maths toolkit and choosing a structure; lesson D15

A meld operation on two instances of a data structure combines them into one single instance of the same data structure. Consider the following data structures:
P: Unsorted doubly linked list with pointers to the head node and tail node of the list.
Q: Min-heap implemented using an array.
R: Binary Search Tree.
Which ONE of the following options gives the worst-case time complexities for meld operation on instances of size n of these data structures?

- A) P: \( \Theta(1) \), Q: \( \Theta(n) \), R: \( \Theta(n) \)  ✔ official
- B) P: \( \Theta(1) \), Q: \( \Theta(n \log n) \), R: \( \Theta(n) \)
- C) P: \( \Theta(n) \), Q: \( \Theta(n \log n) \), R: \( \Theta(n^2) \)
- D) P: \( \Theta(1) \), Q: \( \Theta(n) \), R: \( \Theta(n \log n) \)

---

**2025_AN_Q45** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues · assigned chapter: 11 Stacks and queues; lesson D4

Consider a stack data structure into which we can PUSH and POP records. Assume that each record pushed in the stack has a positive integer key and that all keys are distinct. We wish to augment the stack data structure with an O(1) time MIN operation that returns a pointer to the record with smallest key present in the stack
1. without deleting the corresponding record, and
2. without increasing the complexities of the standard stack operations.
Which one or more of the following approach(es) can achieve it?

- A) Keep with every record in the stack, a pointer to the record with the smallest key below it.  ✔ official
- B) Keep a pointer to the record with the smallest key in the stack.
- C) Keep an auxiliary array in which the key values of the records in the stack are maintained in sorted order.
- D) Keep a Min-Heap in which the key values of the records in the stack are maintained.

---

**2025_FN_Q61** · 2025-FN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 06 Pointers; lesson C11

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

**2025_FN_Q62** · 2025-FN · NAT · 2 marks · Hard · bank topic: Linked Lists & Binary Trees · assigned chapter: 10 Linked lists; lesson D3 · HAS A FIGURE (not shown here)

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

**2025_AN_Q62** · 2025-AN · NAT · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C11

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

**2025_FN_Q63** · 2025-FN · NAT · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 09 Reading code: mystery functions, prediction; lesson C19

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

**2025_AN_Q63** · 2025-AN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 03 Functions, scope and storage; lesson C6

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

**2024_AN_Q21** · 2024-AN · MCQ · 1 mark · Easy · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 03 Functions, scope and storage; lesson C6

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

**2024_FN_Q21** · 2024-FN · MCQ · 1 mark · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 02 Operators, decisions and loops; lesson C5

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

**2024_FN_Q27** · 2024-FN · MCQ · 1 mark · Hard · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

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

**2024_FN_Q30** · 2024-FN · NAT · 1 mark · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 02 Operators, decisions and loops; lesson C3 · HAS A FIGURE (not shown here)

Consider the operator precedence and associativity rules for the integer arithmetic operators given in the table below.
[IMAGE_Q_30_1]
The value of the expression 3 + 1 + 5 * 2 / 7 + 2 - 4 - 7 - 6 / 2 as per the above rules is ________.

Official answer (numeric): 6 to 6

---

**2024_AN_Q19** · 2024-AN · MSQ · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 07 Strings; lesson C12

Consider the following C function definition:
```c
int fx(char *a) {
    char *b = a;
    while (*b)
        b++;
    return b - a;
}
```
Which of the following statements is/are TRUE?

- A) The function call fx(“abcd”) will always return a value.  ✔ official
- B) Assuming a character array c is declared as char c[ ] = “abcd” in main( ), the function call fx(c) will always return a value.  ✔ official
- C) The code of the function will not compile.
- D) Assuming a character pointer c is declared as char *c = “abcd” in main( ), the function call fx(c) will always return a value.  ✔ official

---

**2024_AN_Q50** · 2024-AN · MCQ · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C11

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

**2024_AN_Q40** · 2024-AN · MCQ · 2 marks · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D8

You are given a set \( V \) of distinct integers. A binary search tree \( T \) is created by inserting all elements of \( V \) one by one, starting with an empty tree. The tree \( T \) follows the convention that, at each node, all values stored in the left subtree of the node are smaller than the value stored at the node. You are not aware of the sequence in which these values were inserted into \( T \), and you do not have access to \( T \).
Which one of the following statements is TRUE?

- A) Inorder traversal of \( T \) can be determined from \( V \).  ✔ official
- B) Root node of \( T \) can be determined from \( V \).
- C) Preorder traversal of \( T \) can be determined from \( V \).
- D) Postorder traversal of \( T \) can be determined from \( V \).

---

**2024_FN_Q42** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 13 Binary heaps; lesson D10

An array [82, 101, 90, 11, 111, 75, 33, 131, 44, 93] is heapified. Which one of the following options represents the first three elements in the heapified array?

- A) 82, 90, 101
- B) 82, 11, 93
- C) 131, 11, 93
- D) 131, 111, 90  ✔ official

---

**2024_AN_Q62** · 2024-AN · MCQ · 2 marks · Hard · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 09 Reading code: mystery functions, prediction; lesson C19

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

**2024_FN_Q54** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 13 Binary heaps; lesson D10

Consider a binary min-heap containing 105 distinct elements. Let \( k \) be the index (in the underlying array) of the maximum element stored in the heap. The number of possible values of \( k \) is

- A) 53  ✔ official
- B) 52
- C) 27
- D) 1

---

**2024_FN_Q47** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 02 Operators, decisions and loops; lesson C5

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

**2024_AN_Q65** · 2024-AN · MSQ · 2 marks · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues · assigned chapter: 11 Stacks and queues; lesson D4 · HAS A FIGURE (not shown here)

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

**2023_FN_Q12** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 13 Binary heaps; lesson D10

Which one of the following sequences when stored in an array at locations \( A[1], \dots, A[10] \) forms a max-heap?

- A) 23, 17, 10, 6, 13, 14, 1, 5, 7, 12
- B) 23, 17, 14, 7, 13, 10, 1, 5, 6, 12  ✔ official
- C) 23, 17, 14, 6, 13, 10, 1, 5, 7, 15
- D) 23, 14, 17, 1, 10, 13, 16, 12, 7, 5

---

**2023_FN_Q13** · 2023-FN · MCQ · 1 mark · Easy · bank topic: Linked Lists & Binary Trees · assigned chapter: 10 Linked lists; lesson D3

Let SLLdel be a function that deletes a node in a singly-linked list given a pointer to the node and a pointer to the head of the list. Similarly, let DLLdel be another function that deletes a node in a doubly-linked list given a pointer to the node and a pointer to the head of the list.
Let \( n \) denote the number of nodes in each of the linked lists. Which one of the following choices is TRUE about the worst-case time complexity of SLLdel and DLLdel?

- A) SLLdel is \( O(1) \) and DLLdel is \( O(n) \)
- B) Both SLLdel and DLLdel are \( O(\log(n)) \)
- C) Both SLLdel and DLLdel are \( O(1) \)
- D) SLLdel is \( O(n) \) and DLLdel is \( O(1) \)  ✔ official

---

**2023_FN_Q35** · 2023-FN · NAT · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 03 Functions, scope and storage; lesson C7

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

**2023_FN_Q36** · 2023-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8 · HAS A FIGURE (not shown here)

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

**2023_FN_Q46** · 2023-FN · MCQ · 2 marks · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 13 Binary heaps; lesson D10

Let \( A \) be a priority queue for maintaining a set of elements. Suppose \( A \) is implemented using a max-heap data structure. The operation Extract-Max(\( A \)) extracts and deletes the maximum element from \( A \). The operation Insert(\( A \), key) inserts a new element key in \( A \). The properties of a max-heap are preserved at the end of each of these operations. When \( A \) contains \( n \) elements, which one of the following statements about the worst case running time of these two operations is TRUE?

- A) Both Extract-Max(\( A \)) and Insert(\( A \), key) run in \( O(1) \).
- B) Both Extract-Max(\( A \)) and Insert(\( A \), key) run in \( O(\log(n)) \).  ✔ official
- C) Extract-Max(\( A \)) runs in \( O(1) \) whereas Insert(\( A \), key) runs in \( O(\log(n)) \).
- D) Extract-Max(\( A \)) runs in \( O(1) \) whereas Insert(\( A \), key) runs in \( O(n) \).

---

**2023_FN_Q47** · 2023-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 12 Trees and binary search trees; lesson D7 · HAS A FIGURE (not shown here)

Consider the C function foo and the binary tree shown:
```c
typedef struct node {
    int val;
    struct node *left, *right;
} node;
int foo(node *p) {
    int retval;
    if (p == NULL)
        return 0;
    else {
        retval = p->val + foo(p->left) + foo(p->right);
        printf("%d ", retval);
        return retval;
    }
}
```
[IMAGE_Q_47_1]
When foo is called with a pointer to the root node of the given binary tree, what will it print?

- A) 3 8 5 13 11 10
- B) 3 5 8 10 11 13
- C) 3 8 16 13 24 50  ✔ official
- D) 3 16 8 50 24 13

---

**2023_FN_Q59** · 2023-FN · NAT · 2 marks · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues · assigned chapter: 11 Stacks and queues; lesson D5

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

**2022_FN_Q15** · 2022-FN · MCQ · 1 mark · Easy · bank topic: Linked Lists & Binary Trees · assigned chapter: 10 Linked lists; lesson D3 · HAS A FIGURE (not shown here)

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

**2022_FN_Q21** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C10

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

**2022_FN_Q28** · 2022-FN · NAT · 1 mark · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D7

Suppose a binary search tree with 1000 distinct elements is also a complete binary tree. The tree is stored using the array representation of binary heap trees. Assuming that the array indices start with 0, the \(3^{\text{rd}}\) largest element of the tree is stored at index _________.

Official answer (numeric): 509 to 509

---

**2022_FN_Q43** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 05 Arrays; lesson C9

What is printed by the following ANSI C program?
```c
#include<stdio.h>
int main(int argc, char *argv[ ])
{
    int a[3][3][3] = {{1, 2, 3, 4, 5, 6, 7, 8, 9},
                      {10, 11, 12, 13, 14, 15, 16, 17, 18},
                      {19, 20, 21, 22, 23, 24, 25, 26, 27}};
    int i = 0, j = 0, k = 0;
    for(i = 0; i < 3; i++) {
        for(k = 0; k < 3; k++)
            printf("%d ", a[i][j][k]);
        printf("\n");
    }
    return 0;
}
```

- A) 1 2 3 10 11 12 19 20 21  ✔ official
- B) 1 4 7 10 13 16 19 22 25
- C) 1 2 3 4 5 6 7 8 9
- D) 1 2 3 13 14 15 25 26 27

---

**2022_FN_Q44** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 02 Operators, decisions and loops; lesson C3 · HAS A FIGURE (not shown here)

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

**2022_FN_Q62** · 2022-FN · NAT · 2 marks · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues · assigned chapter: 11 Stacks and queues; lesson D5 · HAS A FIGURE (not shown here)

Consider the queues \(Q_1\) containing four elements and \(Q_2\) containing none (shown as the Initial State in the figure). The only operations allowed on these two queues are Enqueue(Q, element) and Dequeue(Q). The minimum number of Enqueue operations on \(Q_1\) required to place the elements of \(Q_1\) in \(Q_2\) in reverse order (shown as the Final State in the figure) without using any additional storage is __________.

[IMAGE_Q_62]

Official answer (numeric): 0 to 0

---

**2021_AN_Q21** · 2021-AN · MCQ · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 13 Binary heaps; lesson D10

Let \(H\) be a binary min-heap consisting of \(n\) elements implemented as an array. What is the worst case time complexity of an optimal algorithm to find the maximum element in \(H\)?

- A) \(\Theta(1)\)
- B) \(\Theta(\log n)\)
- C) \(\Theta(n)\)  ✔ official
- D) \(\Theta(n \log n)\)

---

**2021_FN_Q62** · 2021-FN · MCQ · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

Consider the following statements:
\(S_1\) : The sequence of procedure calls corresponds to a preorder traversal of the activation tree.
\(S_2\) : The sequence of procedure returns corresponds to a postorder traversal of the activation tree.
Which one of the following options is correct?

- A) \(S_1\) is true and \(S_2\) is false
- B) \(S_1\) is false and \(S_2\) is true
- C) \(S_1\) is true and \(S_2\) is true  ✔ official
- D) \(S_1\) is false and \(S_2\) is false

---

**2021_FN_Q63** · 2021-FN · MCQ · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D8

A binary search tree \(T\) contains \(n\) distinct elements. What is the time complexity of picking an element in \(T\) that is smaller than the maximum element in \(T\)?

- A) \(\theta(n \log n)\)
- B) \(\theta(n)\)
- C) \(\theta(\log n)\)
- D) \(\theta(1)\)  ✔ official

---

**2021_AN_Q52** · 2021-AN · MCQ · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C11

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

**2021_FN_Q43** · 2021-FN · NAT · 1 mark · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues · assigned chapter: 11 Stacks and queues; lesson D5

Consider the following sequence of operations on an empty stack.
\(\text{push}(54); \text{push}(52); \text{pop}( ); \text{push}(55); \text{push}(62); s = \text{pop}( );\)
Consider the following sequence of operations on an empty queue.
\(\text{enqueue}(21); \text{enqueue}(24); \text{dequeue}( ); \text{enqueue}(28); \text{enqueue}(32); q = \text{dequeue}( );\)
The value of \(s + q\) is _________.

Official answer (numeric): 86 to 86

---

**2021_AN_Q47** · 2021-AN · NAT · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

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

**2021_AN_Q35** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 08 Structures and dynamic memory; lesson C15

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

**2021_FN_Q58** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 02 Operators, decisions and loops; lesson C3

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

**2021_FN_Q33** · 2021-FN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 09 Reading code: mystery functions, prediction; lesson C19

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

**2021_AN_Q48** · 2021-AN · NAT · 2 marks · Hard · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

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

**2020_FN_Q20** · 2020-FN · MCQ · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D8

The preorder traversal of a binary search tree is 15, 10, 12, 11, 20, 18, 16, 19. Which one of the following is the postorder traversal of the tree?

- A) 10, 11, 12, 15, 16, 18, 19, 20
- B) 11, 12, 10, 16, 19, 18, 20, 15  ✔ official
- C) 20, 19, 18, 16, 15, 12, 11, 10
- D) 19, 16, 18, 20, 11, 12, 10, 15

---

**2020_FN_Q23** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D9

What is the worst case time complexity of inserting \( n^2 \) elements into an AVL-tree with \( n \) elements initially?

- A) \( \Theta(n^4) \)
- B) \( \Theta(n^2) \)
- C) \( \Theta(n^2 \log n) \)  ✔ official
- D) \( \Theta(n^3) \)

---

**2020_FN_Q15** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Linked Lists & Binary Trees · assigned chapter: 10 Linked lists; lesson D3

What is the worst case time complexity of inserting \( n \) elements into an empty linked list, if the linked list needs to be maintained in sorted order?

- A) \( \Theta(n) \)
- B) \( \Theta(n \log n) \)
- C) \( \Theta(n^2) \)  ✔ official
- D) \( \Theta(1) \)

---

**2020_FN_Q16** · 2020-FN · NAT · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C11

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

**2020_FN_Q47** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D8

In a balanced binary search tree with \( n \) elements, what is the worst case time complexity of reporting all elements in range \( [a, b] \)? Assume that the number of reported elements is \( k \).

- A) \( \Theta(\log n) \)
- B) \( \Theta(\log n + k) \)  ✔ official
- C) \( \Theta(k \log n) \)
- D) \( \Theta(n \log k) \)

---

**2020_FN_Q48** · 2020-FN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

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

**2020_FN_Q36** · 2020-FN · NAT · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 13 Binary heaps; lesson D10

Consider the array representation of a binary min-heap containing 1023 elements. The minimum number of comparisons required to find the maximum in the heap is ________.

Official answer (numeric): 511 to 511

---

**2020_FN_Q42** · 2020-FN · NAT · 2 marks · Hard · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 09 Reading code: mystery functions, prediction; lesson C19

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

---

**2019_FN_Q24** · 2019-FN · NAT · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 03 Functions, scope and storage; lesson C6

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

**2019_FN_Q15** · 2019-FN · NAT · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C11

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

**2019_FN_Q40** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

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

**2019_FN_Q52** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 03 Functions, scope and storage; lesson C7

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

**2019_FN_Q38** · 2019-FN · MCQ · 2 marks · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 13 Binary heaps; lesson D10

Consider the following statements:
I. The smallest element in a max-heap is always at a leaf node.
II. The second largest element in a max-heap is always a child of the root node.
III. A max-heap can be constructed from a binary search tree in \( \Theta(n) \) time.
IV. A binary search tree can be constructed from a max-heap in \( \Theta(n) \) time.
Which of the above statements are TRUE?

- A) I, II and III  ✔ official
- B) I, II and IV
- C) I, III and IV
- D) II, III and IV

---

**2019_FN_Q48** · 2019-FN · NAT · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 02 Operators, decisions and loops; lesson C5

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

**2019_FN_Q65** · 2019-FN · NAT · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C11

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

**2018_FN_Q12** · 2018-FN · MCQ · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 08 Structures and dynamic memory; lesson C14

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

**2018_FN_Q13** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Abstract Data Types (ADTs), Stacks, Queues · assigned chapter: 11 Stacks and queues; lesson D5 · HAS A FIGURE (not shown here)

A queue is implemented using a non-circular singly linked list. The queue has a head pointer and a tail pointer, as shown in the figure. Let \(n\) denote the number of nodes in the queue. Let `enqueue` be implemented by inserting a new node at the head, and `dequeue` be implemented by deletion of a node from the tail.
[IMAGE_Q_13]
Which one of the following is the time complexity of the most time-efficient implementation of `enqueue` and `dequeue`, respectively, for this data structure?

- A) \(\theta(1), \theta(1)\)
- B) \(\theta(1), \theta(n)\)  ✔ official
- C) \(\theta(n), \theta(1)\)
- D) \(\theta(n), \theta(n)\)

---

**2018_FN_Q30** · 2018-FN · NAT · 1 mark · Medium · bank topic: Linked Lists & Binary Trees · assigned chapter: 12 Trees and binary search trees; lesson D7

The postorder traversal of a binary tree is 8,9,6,7,4,5,2,3,1. The inorder traversal of the same tree is 8,6,9,4,7,2,5,1,3. The height of a tree is the length of the longest path from the root to any leaf. The height of the binary tree above is ______.

Official answer (numeric): 4 to 4

---

**2018_FN_Q31** · 2018-FN · NAT · 1 mark · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

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

**2018_FN_Q39** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C13

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

**2018_FN_Q56** · 2018-FN · NAT · 2 marks · Hard · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 13 Binary heaps; lesson D10

The number of possible min-heaps containing each value from \(\{1, 2, 3, 4, 5, 6, 7\}\) exactly once is _____.

Official answer (numeric): 80 to 80

---

**2017_AN_Q17** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Dynamic Memory Allocation & File Handling · assigned chapter: 03 Functions, scope and storage; lesson C7

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

**2017_FN_Q33** · 2017-FN · MCQ · 1 mark · Easy · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D7

Let \(T\) be a binary search tree with 15 nodes. The minimum and maximum possible heights of \(T\) are:
Note: The height of a tree with a single node is 0.

- A) 4 and 15 respectively
- B) 3 and 14 respectively  ✔ official
- C) 4 and 14 respectively
- D) 3 and 15 respectively

---

**2017_FN_Q35** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Linked Lists & Binary Trees · assigned chapter: 10 Linked lists; lesson D3

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

---

**2017_FN_Q32** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Dynamic Memory Allocation & File Handling · assigned chapter: 08 Structures and dynamic memory; lesson C15

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

---

**2017_AN_Q20** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Abstract Data Types (ADTs), Stacks, Queues · assigned chapter: 11 Stacks and queues; lesson D5

A circular queue has been implemented using a singly linked list where each node consists of a value and a single pointer pointing to the next node. We maintain exactly two external pointers FRONT and REAR pointing to the front node and the rear node of the queue, respectively. Which of the following statements is/are CORRECT for such a circular queue, so that insertion and deletion operations can be performed in \(O(1)\) time?
I. Next pointer of front node points to the rear node.
II. Next pointer of rear node points to the front node.

- A) I only
- B) II only  ✔ official
- C) Both I and II
- D) Neither I nor II

---

**2017_AN_Q32** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 06 Pointers; lesson C10

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

---

**2017_FN_Q64** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

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

**2017_FN_Q57** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 04 Recursion; lesson C8

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

---

**2017_AN_Q63** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Binary Search Trees (BSTs) & Binary Heaps · assigned chapter: 12 Trees and binary search trees; lesson D8

The pre-order traversal of a binary search tree is given by 12, 8, 6, 2, 7, 9, 10, 16, 15, 19, 17, 20. Then the post-order traversal of this tree is:

- A) 2, 6, 7, 8, 9, 10, 12, 15, 16, 17, 19, 20
- B) 2, 7, 6, 10, 9, 8, 15, 17, 20, 19, 16, 12  ✔ official
- C) 7, 2, 6, 8, 9, 10, 20, 17, 19, 15, 16, 12
- D) 7, 6, 2, 10, 9, 8, 15, 16, 17, 20, 19, 12

---

**2017_AN_Q53** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 02 Operators, decisions and loops; lesson C5

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

**2017_AN_Q64** · 2017-AN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 05 Arrays; lesson C9

Consider the following snippet of a C program. Assume that swap (&x, &y) exchanges the contents of x and y.
```c
int main() {
    int array[] = {3, 5, 1, 4, 6, 2};
    int done = 0;
    int i;
    while (done == 0) {
        done = 1;
        for (i = 0; i <= 4; i++) {
            if (array[i] < array[i + 1]) {
                swap(&array[i], &array[i + 1]);
                done = 0;
            }
        }
        for (i = 5; i >= 1; i--) {
            if (array[i] > array[i - 1]) {
                swap(&array[i], &array[i - 1]);
                done = 0;
            }
        }
    }
    printf("%d", array[3]);
}
```
The output of the program is ________.

Official answer (numeric): 3.0 to 3.0

---

**2017_FN_Q58** · 2017-FN · NAT · 2 marks · Hard · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 01 Programming in C: the basics; lesson C2

Consider the following C program.
```c
#include <stdio.h>
#include <string.h>
void printlength (char *s, char *t) {
    unsigned int c = 0;
    int len = ((strlen(s) - strlen(t)) > c) ? strlen(s): strlen(t);
    printf("%d\n", len);
}
void main ( ) {
    char *x = "abc";
    char *y = "defgh";
    printlength (x, y);
}
```
Recall that strlen is defined in string.h as returning a value of type size_t, which is an unsigned int. The output of the program is ________.

Official answer (numeric): 3.0 to 3.0

---

**2017_AN_Q58** · 2017-AN · NAT · 2 marks · Medium · bank topic: Data Types, Syntax, Control Structures, Loops · assigned chapter: 02 Operators, decisions and loops; lesson C3

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

---

**2017_FN_Q43** · 2017-FN · NAT · 2 marks · Medium · bank topic: Functions, Parameter Passing, Scope Rules, Recursion · assigned chapter: 03 Functions, scope and storage; lesson C7

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

---

**2017_AN_Q49** · 2017-AN · NAT · 2 marks · Hard · bank topic: Pointers, Multi-Dimensional Arrays, Structures · assigned chapter: 07 Strings; lesson C12

Consider the following C program.
```c
# include <stdio.h>
# include <string.h>
int main( )
{
    char* c = "GATECSIT2017";
    char* p = c;
    printf("%d", (int) strlen (c+2[p] - 6[p]-1));
    return 0;
}
```
The output of the program is ________.

Official answer (numeric): 2.0 to 2.0

