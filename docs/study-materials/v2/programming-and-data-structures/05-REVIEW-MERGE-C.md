# 05 · Review merge for Programming in C (plan v1 → v2)

Three replies came back: `chatgpt-review-prog-c.md` (A), `chatgpt-review-prog-c-2.md` (B), `gemini-review-programmingc.md` (G). This file records what each was worth, what was accepted or rejected, and the decisions taken. The improved plan is `03-PROGRAMMING-IN-C.md` (now **v2**).

## 1. How good was each review?

| Reply | Verdict | Why |
|---|---|---|
| **G (Gemini)** | **Excellent. The backbone of v2.** | It read the actual plan: 60 gaps, each with the chapter, the type and the fix. It caught real errors in my plan (contradictions, a wrong rule, wrong order). 58 diagrams listed with what to notice. |
| **A (ChatGPT 1)** | Weak on specifics, useful on process. | It never saw the files ("presumably...", "likely states..."). It *guessed* the README and prompt contents. Its gap list is a recap of an earlier review, not of this plan. Kept only: the pilot with real beginners, PYQ tagging, the 100-day track, and a few C-standard facts. |
| **B (ChatGPT 2)** | Mixed. Mostly generic. | Many rows are speculative ("if shown, likely..."), a few are wrong, and several complain about files it was simply not given. Kept only what G also said, plus a few valid ones. |

Rule used from the merge policy: items found by two or more reviewers are accepted. Items from one reviewer were checked by me against the C standard and GATE practice.

## 2. Real errors in plan v1 that the reviews exposed (my mistakes)

1. **Struct alignment rule was wrong.** v1 said "each member is aligned to its own size". That is false for arrays (`char a[10]` aligns to 1) and nested structs (align to the largest member). Fixed in C14.
2. **Self-contradiction on overflow.** v1 said signed overflow is undefined, then drew a "signed 8-bit wrap-around 127 → -128" circle. Fixed: the number circle is for **unsigned**; signed overflow is shown as undefined behaviour.
3. **I proposed "tracing" `j = i++ + ++i`.** You cannot trace undefined behaviour to one answer. v2 shows two legal-looking compiler orderings side by side, to prove there is no single answer.
4. **Recursion was pushed out of the C book.** GATE asks C recursion (printf before/after the call, `static` inside recursion, pointer parameters) in the C paper. v2 has a full recursion chapter inside C.
5. **Wrong order in several places** (see §3): things used before they are taught.
6. **Counting did not add up.** 31 problems per "topic" × ~177 topics ≈ 5,500, while the plan said ~1,000. v2 defines the units clearly and fixes the target.
7. **Chapters after C3 lost their "beginner must see", and the last chapters lost "finer points" and "traces".** Restored in v2 for every chapter.
8. **Section 5 claimed pointers come after strings.** They do not in v1. Resolved by the new order.
9. **Sec 0 opened with scary words** (struct padding, dangling pointers, call by name) before the reader has met `printf`. Rewritten in plain words.
10. **Missing topics**: endianness, how to actually run C today (and the Turbo C habits to drop), format specifiers, `'A'` is `int` in C, `sizeof` never runs its operand, lvalue/rvalue, sequence points list, precedence is not evaluation order, `a < b < c`, shift undefined cases, `continue` inside `switch`, loop-count patterns, `static` initialiser rule, tentative definitions, general array-address formulas with lower bounds, string pointer tricks, `char a[3][10]` vs `char *a[3]`, `realloc` leak trap, `int (*p)[C]` vs `int **p`, macro outer brackets and `do { } while (0)`, `char c` vs `int c` with EOF, the UB / unspecified / implementation-defined table, MSQ and NAT formats, and **mystery-function reading** (what does this loop compute?). All added.

## 3. Order changes accepted (things used before they are taught)

| Problem | Fix in v2 |
|---|---|
| `printf("%d", printf("ab"))` in Chapter 1 (before functions) | Moved to the functions chapter (C6). C1 only says "`printf` also gives back a number; more in C6". |
| `scanf(..., &x)` eight chapters before `&` | C1 gives the two-line analogy: `printf` needs the *value*, `scanf` needs the *box's address* to drop the input into. Full story in C10. |
| `argc`/`argv` in C6 (needs arrays, pointers, strings) | Moved to the advanced-pointers chapter. |
| Variable arguments (how `printf` works) in C6 | Moved to the files chapter as [BEYOND]. |
| "Return address of a local" before pointers | In C6 only as "a function's scratch boxes vanish when it returns". The pointer version is in C13. |
| Array decay, passing arrays, `sizeof` of a parameter, `i[a]` in the arrays chapter (before pointers) | Moved to the pointer-arithmetic chapter. Arrays chapter keeps indexing, memory layout and address formulas. |
| `const` with pointers and `volatile` before pointers | `const` pointer forms in the advanced-pointers chapter; `volatile` gets a plain hardware picture in C7. |
| Dangling pointers before `malloc` | Stack-local dangling in advanced pointers; heap dangling, leaks and double free in the heap chapter. |
| `#define` in C2 before the preprocessor | C2 gives a two-line preview ("find and replace before compiling"); the real lesson is in the preprocessor chapter. |
| `enum` in two places | One place: with structs and unions, with a pointer from the `switch` lesson. |
| Scope of a `for` variable before scope is taught | Plain words in C5 ("lives only inside the loop") and the C89/C99 note. Formal scope in C7. |
| Prediction method taught only at the end | A 3-step trace habit is introduced in C1 and used from then on. The full 7-step method and the UB table stay in the skills chapter. |

## 4. Reviewer suggestions I rejected, and why

| Suggestion | Reason |
|---|---|
| "No 8 diagrams or 31 examples per topic, it is unrealistic" (B) | The 8-diagram floor stays, because diagrams are the point of this rewrite. But the unit was unclear, so it is now **per lesson**, not per sub-topic, and the problem count is cut. |
| "Drop VLAs, function pointers, etc. as too advanced" (B) | Function pointers are asked in GATE; they stay (as [GATE+]). VLAs stay as a short note only. |
| "Rephrase the reviewer prompt's tone" (B) | That prompt is deliberately blunt. Not a book issue. |
| "Remove tangential maths like permutation matrix" (B) | Not in this plan. |
| "Bitwise `*`" (B) | There is no such operator. Ignored. |
| "Missing files 02 and 04" (A, B) | They exist; the reviewers were simply not given them. |
| Keep full IEEE-754 bit layout in C2 (A) | Too hard too early (G agrees). C2 teaches the idea and precision traps; the bit layout is cross-linked to Computer Organisation. |

## 5. Decisions taken (change any of them and I will update)

1. **Units.** A *chapter* has several *lessons*. A *lesson* is what one run of the master prompt writes (45 to 90 minutes of reading). A *sub-topic* (C2.7, ...) is a line inside a lesson. Diagrams and the practice ladder are counted **per lesson**.
2. **Practice ladder per lesson:** Warm-up 5, Core 6, GATE-level 6, Twisted 3 = **20**. About 75 lessons gives about 1,500 problems for C. Part of these are real GATE questions from our bank (tagged), the rest are written. (The master prompt's 31 is updated to 20.)
3. **Recursion lives in the C book** (full chapter C8). The Data Structures plan keeps only the data-structure uses (Hanoi, permutations, tree recursion) and links back.
4. **Two tracks**, with every lesson tagged: **[MUST]** (GATE-weighted), **[SHOULD]**, **[LATER]** (rarely asked). A 100-day plan uses [MUST] only; the full path uses all.
5. **Hours are estimates**, to be calibrated after the pilot lesson.
6. **Machine assumption** for the whole book: GATE style 32-bit (`int` 4 B, pointer 4 B, little endian) unless the question says otherwise, *and* a standing box explaining why your laptop prints 8 for `sizeof(int *)` and addresses like `0x7ffe...`.
7. **Standard:** examples follow C11 and are compiled with `gcc -std=c11 -Wall`. UB examples are always labelled as UB. `gets` is shown only as a warning.
8. **Pilot lesson** (unchanged): C10 "Pointers I: memory and addresses". It is now chapter C10 in v2 (renumbered; see the new ladder).
