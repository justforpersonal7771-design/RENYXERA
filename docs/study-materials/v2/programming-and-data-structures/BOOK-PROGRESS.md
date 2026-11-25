# Programming and Data Structures: book progress tracker

The only place that says what is finished in the P&DS books. A chapter is **Done** only when every gate below is ticked for it, and the proof (the command or the screenshot set) is named. Update this file in the same turn as the work. Chapter numbers equal the lesson numbers in `07-PDS-BOOK-CONTENTS.md` (C10 is Chapter 10).

## The gates every chapter must pass (finer level)

| # | Gate | How it is proved |
|---|------|------------------|
| G1 | Plan: sections, figures, the real PYQs and their variations listed | the section list in this file |
| G2 | Text written as a textbook: numbered headings (10.1, 10.1.1, …), definitions before use, tips, shortcuts, traps inside their own section | read-through |
| G3 | Every C program compiles with gcc and prints the book's output | `npx tsx scripts/chapter-check.ts` (section 5) |
| G4 | Every figure checked: arrows resolve, pointer value equals target address, every frame of a step-by-step figure shows the same boxes (constant size), alt text and caption present | `npx tsx scripts/chapter-check.ts` (sections 2 and 3) |
| G5 | Every real GATE question of the chapter explained in full: the question as asked, a step-by-step figure, what it tests, where marks are lost (one reason per wrong option), 2 to 4 variations compiled and run | PYQ sub-sections of "How GATE asks it" |
| G6 | Schema rules: 6+ headings, 20+ paragraphs, 2+ figures, 2+ worked examples, a trap, 4+ check questions with an MSQ or NAT and a 2-mark one, recall cards | `validateTopic` in `chapter-check.ts` |
| G7 | Code styling: statements in text look different from prose; code blocks in the editor; no code on one long line | `autoCode` / `splitCodeQ` tests in `chapter-check.ts`, screenshots |
| G8 | Browser test: every figure at desktop and mobile, light and dark; no page side-scroll; frame stage size constant on Next and Back | the figure test (47 figures, 4 passes) |
| G9 | `tsc --noEmit` clean; eslint clean on the files touched | commands |
| G10 | Contrast: tint inks on tint fills; light and dark | screenshots |
| G11 | Committed, pushed (batch), live check after the deploy | git log, live URL |

## Programming in C

Legend: `[x]` done and proved · `[~]` partly, the note says what is missing · `[ ]` not started.

| Book chapter | Lesson | Title | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 | G11 | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 Basics | C0 | How a computer runs a program | [x] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 01 Basics | C1 | Your first program | [x] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 01 Basics | C2 | Variables and data types | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 02 Operators, decisions, loops | C3 | Operators | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 02 Operators, decisions, loops | C4 | Decisions | [x] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 02 Operators, decisions, loops | C5 | Loops | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 03 Functions, scope, storage | C6 | Functions and the call stack | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 03 Functions, scope, storage | C7 | Scope, lifetime, storage classes | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 03 Functions, scope, storage | C17 | Parameter passing and scoping rules | [x] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 04 Recursion | C8 | Recursion in C | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 05 Arrays | C9 | Arrays in C | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 06 Pointers | **C10** | **Pointers I: memory and addresses** | [x] | [x] | [x] | [x] | [x] | [x] | [x] | [~] | [~] | [~] | [ ] | **written and tested; push pending** |
| 06 Pointers | C11 | Pointers II: arithmetic and arrays | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 06 Pointers | C13 | Pointers III: pointer to pointer, function pointers | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 07 Strings | C12 | Strings | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 08 Structures and dynamic memory | C14 | struct, union, enum, padding | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 08 Structures and dynamic memory | C15 | Dynamic memory | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 09 Preprocessor, files, reading code | C16 | Preprocessor and macros | [x] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 09 Preprocessor, files, reading code | C18 | Files, errors, variable arguments | [x] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | later |
| 09 Preprocessor, files, reading code | C19 | Reading mystery functions | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 09 Preprocessor, files, reading code | C20 | Output-prediction method and undefined behaviour | [x] | [ ] | [ ] | [ ] | n/a | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |
| 16 Practice | C21 | Previous-year patterns, mixed sets | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | not started |

### Chapter 10 detail (the first finished chapter, kept as the model)

- [x] 10.1 Memory (10.1.1 Disk and RAM, 10.1.2 Bytes and bits, 10.1.2.1 How many values, 10.1.2.1.1 Why eight)
- [x] 10.2 Addresses (10.2.1 address of a byte, 10.2.2 several-byte values, 10.2.3 sizes of types)
- [x] 10.3 Variables: name, value and address (two programs, one printing a real address)
- [x] 10.4 Pointers (declaring; traps `int *p, q;` and `int *p = &x;` placed here; type and size with the 4 or 8 byte trap; initialise at birth)
- [x] 10.5 Following a pointer (star in an expression; step-by-step; moving the arrow versus changing the box; copying a pointer; `*&x`; `(*p)++` versus `*p++`; shortcut; try-it)
- [x] 10.6 Pointers and functions (call by value; passing an address; swap; scanf; pointer parameter is a copy; lab)
- [x] 10.7 Pointers that must not be followed (NULL, wild, dangling)
- [x] 10.8 How GATE asks it: four real questions, each explained in full, with a step-by-step figure, what it tests, where marks are lost, 2 to 4 variations compiled and run:
  - [x] GATE 2017 AN Q32 (printxy) · [x] GATE 2025 FN Q34 (foo, pointer parameter) · [x] GATE 2026 AN Q60 (six assignments) · [x] GATE 2022 FN Q21 (pointer and array element)
- [x] 10.9 Tips, shortcuts and tricks (eight numbered)
- [x] 10.10 Chapter summary
- [x] Exercises: 10 questions (NAT, MCQ, MSQ, 1 and 2 marks) and 12 recall cards
- [~] G8 text sections: figures were tested at four settings; the running text was viewed at desktop light and dark only, mobile text pages not yet read
- [~] G9: `tsc --noEmit` is clean; the three eslint `set-state-in-effect` errors in `components/layout/topbar.tsx` are not from this work (lines 115, 136, 171)
- [~] G10: contrast looked right in the screenshots; the automated audit has not been run on the new palette

## Data Structures

Not started. Order of work after Programming in C: D0, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D13, D15, D16 (see `07-PDS-BOOK-CONTENTS.md`).

## Tools used by the gates

- `npx tsx scripts/chapter-check.ts` — G3, G4, G6, G7 for the chapter named at the top of the script (change the import to test another chapter). gcc must be on PATH (`C:\msys64\ucrt64\bin`).
- The figure browser test (Playwright, four passes) — G8. Saved as `scripts/chapter-figures-browser.mjs`.
