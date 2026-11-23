# Review input: Programming and Data Structures (contents v3, round 2)

**How to use:** paste everything under the line into ChatGPT (and again, in a new chat, into Gemini). Save each reply as `chatgpt-review-pds-contents.md` and `gemini-review-pds-contents.md` in this folder.

This round reviews the **book contents (v3)**: the 16 chapters, the tags and weights built from the 99 real PYQs. The detailed plans (`03-PROGRAMMING-IN-C.md`, `04-DATA-STRUCTURES.md`) were already reviewed once; upload them too if the chat allows files.

Extra questions for this round (answer them after Part 4): (1) Is every PYQ in `pds-pyq-tags.tsv` in the right chapter? (2) Is any chapter missing or too big? (3) Are the weights fair? (4) Which topics does GATE ask that no chapter here covers?

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
```

---

## PART B. THE DOCUMENT TO REVIEW

# 07 · Programming and Data Structures: the book contents (v3, from the real PYQ data)

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
- **Not machine-run:** this computer has no C compiler (installing one was blocked), so C outputs were derived by hand and cross-checked against the official keys. They are not compiled yet. Installing a compiler would let the book's code samples be run for real (see "What I need from you").

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
