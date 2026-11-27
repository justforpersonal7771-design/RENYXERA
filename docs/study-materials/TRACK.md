# Study books: central track list (all subjects)

The one page that shows every subject's progress. Updated at the end of every study turn. Detail per book lives in its own file (P&DS: [v2/programming-and-data-structures/BOOK-PROGRESS.md](v2/programming-and-data-structures/BOOK-PROGRESS.md)).

**Last updated:** 28 Nov 2026

**Stages:** 1 Review input written · 2 Reviews merged · 3 Book v2 (textbook quality: numbered headings, figures, PYQs, traps with worked examples) · 4 Verified (compile, tsc, browser, contrast) · 5 Live

Legend: `[x]` done · `[~]` partly · `[ ]` not started

| Subject | Pack | 1 | 2 | 3 Book v2 | 4 Verified | 5 Live | Notes |
|---|---|---|---|---|---|---|---|
| Programming in C (Section 1 of P&DS, in 4 parts: foundations C0–C5, functions/recursion/arrays C6–C9+C17, pointers/strings/memory C10–C15, reading code and practice C16, C18–C21) | pds | [x] | [x] | [x] C0–C21 | [x] chapter-check 22/22, sweep, contrast | [~] pushed, live check pending | C1, C4, C16, C17, C18, C20 have no tagged PYQ |
| **Data Structures** | pds | [x] | [x] | [~] D0–D5, D7, D8, D10 written; D6, D9, D11–D16 remaining | [~] D0–D10 written: chapter-check, tsc, browser sweep and contrast clean | [~] D0, D1 pushed | route `/study/data-structures`; spec `04-DATA-STRUCTURES.md` |
| Operating Systems | os | [x] | [x] | [ ] old-style topics only | [ ] | old version live | reviews merged |
| Databases | dbms | [x] | [x] Gemini + ChatGPT merged 28 Nov | [ ] | [ ] | old version live | owner review pending |
| Computer Networks | cn | [x] | [x] | [ ] | [ ] | old version live | reviews merged |
| Algorithms | algo | [x] | [x] | [ ] | [ ] | old version live | reviews merged |
| Theory of Computation | toc | [ ] | [ ] | [ ] | [ ] | old version live | |
| Compiler Design | cd | [x] | [x] Gemini merged 28 Nov | [ ] | [ ] | no | |
| Computer Organisation | coa | [x] | [x] Gemini + ChatGPT merged 28 Nov | [ ] | [ ] | old version live | owner review pending |
| Digital Logic | dl | [x] | [x] Gemini merged 28 Nov | [ ] | [ ] | no | |
| Discrete Mathematics | dm | [x] | [x] Gemini + ChatGPT merged 28 Nov | [ ] | [ ] | old version live | owner review pending |
| Linear Algebra | la | [x] | [x] Gemini merged 28 Nov | [ ] | [ ] | no | |
| Probability and Statistics | prob | [x] | [x] Gemini merged 28 Nov | [ ] | [ ] | no | |
| Calculus | calc | [x] | [ ] | [ ] | [ ] | no | |
| Quantitative Aptitude | quant | [x] | [ ] | [ ] | [ ] | no | |
| Analytical Aptitude | analytical | [x] | [ ] | [ ] | [ ] | no | |
| Verbal Aptitude | verbal | [ ] | [ ] | [ ] | [ ] | no | |
| Spatial Aptitude | spatial | [ ] | [ ] | [ ] | [ ] | no | |

## Data Structures chapters (detail)

| Ch | Title | Status |
|---|---|---|
| D0 | What a data structure is | [x] verified |
| D1 | Counting and growth | [x] verified |
| D2 | Arrays: the block of boxes | [x] verified |
| D3 | Linked lists: nodes and pointers | [x] verified (GATE 2026 Q39, 2023 Q13, 2022 Q15, 2025 Q62 variant) |
| D4 | Stacks: last in, first out | [x] verified (2026 AN Q50, 2025 AN Q45) |
| D5 | Queues: first in, first out | [x] verified (2023 FN Q59, 2018 FN Q13) |
| D6 | Recursion on data structures | [ ] (covered by C8 and the recursive functions in D3, D7, D8; a short bridge chapter may follow) |
| D7 | Trees and binary trees | [x] verified (2026 FN Q33, 2026 AN Q12, 2025 AN Q13, 2018 FN Q30) |
| D8 | Binary search trees | [x] verified (2025 AN Q35, 2026 FN Q62, 2020 FN Q15, 2025 FN Q26, 2026 FN Q40, 2022 FN Q28, 2026 AN Q49) |
| D9 | AVL trees | [ ] |
| D10 | Binary heaps and priority queues | [x] verified (2023 FN Q12, 2026 FN Q23, 2025 FN Q35, 2023 FN Q46, 2018 FN Q56) |
| D11–D12 | Hashing, sorting hooks | [ ] (see spec) |
| D13 | Graphs | [ ] |
| D14 | (spec) | [ ] |
| D15 | Choosing a structure | [ ] |
| D16 | Previous-year patterns | [ ] |

## Cross-cutting open items
- [ ] Tag TOC / OS / CN / Algorithms PYQs to chapters
- [ ] (you) 2020 CS Q22 answer key: "marks to all"
- [x] Reviews merged and checked for DBMS, COA, Discrete Maths (Gemini + ChatGPT) and Compiler Design, Digital Logic, Linear Algebra, Probability (Gemini only): see each subject's `01-REVIEW-MERGE-AND-PLAN.md`
- [x] Bank defects corrected 29 Nov in `public/data/questions.json` and `data/Aggregated_Output.json` (11 text fixes); the database copy is `supabase/migrations/0067_bank_corrections.sql` (**owner runs it once**, it also moves the 2021_AN_Q17 key from C to A)
- [x] Missing figures: the pictures exist in the app; keys checked against them for Databases (14), COA (9), Discrete Maths (3 of 4), Linear Algebra (1), Probability (1). Still to check: Compiler Design (11) and Digital Logic (21)
- [ ] (you) Unlock banner check with an all-packs account
- [ ] Live deploy check; tab bar in dark mode with several tabs
