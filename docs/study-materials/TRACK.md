# Study books: central track list (all subjects)

The one page that shows every subject's progress. Updated at the end of every study turn. Detail per book lives in its own file (P&DS: [v2/programming-and-data-structures/BOOK-PROGRESS.md](v2/programming-and-data-structures/BOOK-PROGRESS.md)).

**Last updated:** 28 Nov 2026 (Algorithms book v2 written)

**Stages:** 1 Review input written · 2 Reviews merged · 3 Book v2 (textbook quality: numbered headings, figures, PYQs, traps with worked examples) · 4 Verified (compile, tsc, browser, contrast) · 5 Live

Legend: `[x]` done · `[~]` partly · `[ ]` not started

| Subject | Pack | 1 | 2 | 3 Book v2 | 4 Verified | 5 Live | Notes |
|---|---|---|---|---|---|---|---|
| Programming in C (Section 1 of P&DS, in 4 parts: foundations C0–C5, functions/recursion/arrays C6–C9+C17, pointers/strings/memory C10–C15, reading code and practice C16, C18–C21) | pds | [x] | [x] | [x] C0–C21 | [x] chapter-check 22/22, sweep, contrast | [~] pushed, live check pending | C1, C4, C16, C17, C18, C20 have no tagged PYQ |
| **Data Structures** | pds | [x] | [x] | [x] all 17 chapters written (D0–D16) | [x] chapter-check, tsc, browser sweep, contrast clean | [x] pushed 29 Nov, live check pending | route `/study/data-structures`; spec `04-DATA-STRUCTURES.md` |
| Operating Systems | os | [x] | [x] | [ ] old-style topics only | [ ] | old version live | reviews merged |
| Databases | dbms | [x] | [x] Gemini + ChatGPT merged 28 Nov | [ ] | [ ] | old version live | owner review pending |
| Computer Networks | cn | [x] | [x] | [ ] | [ ] | old version live | reviews merged |
| Algorithms | algo | [x] | [x] | [x] all 11 chapters written (A0–A10), 29 Nov | [x] chapter-check 11/11, browser sweep and contrast clean | [x] pushed 29 Nov | routes unchanged (`/study/asymptotics` … `/study/shortest-paths`); code in `content/study/CS/algo-v2*.ts`; PYQ list in A10 |
| Theory of Computation | toc | [ ] | [ ] | [ ] | [ ] | old version live | |
| Compiler Design | cd | [x] | [x] Gemini merged 28 Nov | [ ] | [ ] | no | |
| Computer Organisation | coa | [x] | [x] Gemini + ChatGPT merged 28 Nov | [x] all 8 chapters written (O0–O7), 29 Nov | [x] chapter-check 8/8, browser sweep and contrast clean | [~] pushed with this commit, live check pending | routes unchanged (`/study/instructions-addressing` … `/study/io-interrupts-dma`); code `content/study/CS/coa-v2*.ts`; 72 PYQs tagged in `pyq-chapter-map.json`; old `coa-a`…`coa-f` kept only for the hardware check scripts; owner review pending |
| Digital Logic | dl | [x] | [x] Gemini merged 28 Nov | [x] all 7 chapters written (L1–L7) | [x] chapter-check 7/7, browser sweep and contrast clean | [~] pushed with this commit, live check pending | routes `/study/number-codes` … `/study/computer-arithmetic`; code `content/study/CS/dl-v2*.ts`; 69 PYQs tagged and all solved incl. 25 picture questions |
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
| D6 | Recursion on data structures | [x] verified (2023 FN Q47) |
| D7 | Trees and binary trees | [x] verified (2026 FN Q33, 2026 AN Q12, 2025 AN Q13, 2018 FN Q30) |
| D8 | Binary search trees | [x] verified (2025 AN Q35, 2026 FN Q62, 2020 FN Q15, 2025 FN Q26, 2026 FN Q40, 2022 FN Q28, 2026 AN Q49) |
| D9 | AVL trees: staying balanced | [x] verified (2020 FN Q16) |
| D10 | Binary heaps and priority queues | [x] verified (2023 FN Q12, 2026 FN Q23, 2025 FN Q35, 2023 FN Q46, 2018 FN Q56) |
| D11 | Multi-way trees: B-trees and B+ trees | [x] verified (6 real questions from Databases) |
| D12 | Hashing: a short bridge | [x] verified (4 real questions from Algorithms) |
| D13 | Graphs: representation and traversal | [x] verified (no tagged PYQ) |
| D14 | Extras: tries and disjoint sets | [x] verified (no tagged PYQ) |
| D15 | Choosing the right structure | [x] verified (2025 AN Q38) |
| D16 | Previous-year patterns and mixed practice | [x] verified (26 real questions grouped) |

## Algorithms chapters (detail)

| Ch | Title | Status |
|---|---|---|
| A0 | Before the algorithms: the toolbox | [x] chapter-check |
| A1 | Asymptotics and recurrences | [x] 19 PYQs worked |
| A2 | Searching and sorting | [x] 11 PYQs |
| A3 | Hashing | [x] 7 PYQs |
| A4 | Divide and conquer | [x] 1 PYQ + edge cases |
| A5 | Greedy algorithms | [x] 2 PYQs; 2 with figures covered by method |
| A6 | Dynamic programming | [x] 4 PYQs |
| A7 | Graph traversals | [x] 7 PYQs; 4 with figures by method |
| A8 | Minimum spanning trees | [x] 9 PYQs; 4 with figures by method |
| A9 | Shortest paths | [x] 3 PYQs |
| A10 | Previous-year patterns and mixed practice | [x] all 73 PYQs listed by chapter |

## Digital Logic chapters (detail)

| Ch | Title | Status |
|---|---|---|
| L1 | Number representation and codes | [x] 16 PYQs |
| L2 | Gates and Boolean algebra | [x] 10 PYQs |
| L3 | Minimisation: K-maps, tabular method, NOR/NAND | [x] 9 PYQs |
| L4 | Combinational circuits and hazards | [x] 13 PYQs, 11 pictures read |
| L5 | Sequential circuits | [x] 11 PYQs, 8 pictures read |
| L6 | IEEE 754 floating point | [x] 10 PYQs |
| L7 | Previous-year patterns and mixed practice | [x] all 69 PYQs listed |

## Cross-cutting open items
- [ ] Tag TOC / OS / CN / Algorithms PYQs to chapters
- [ ] (you) 2020 CS Q22 answer key: "marks to all"
- [x] Reviews merged and checked for DBMS, COA, Discrete Maths (Gemini + ChatGPT) and Compiler Design, Digital Logic, Linear Algebra, Probability (Gemini only): see each subject's `01-REVIEW-MERGE-AND-PLAN.md`
- [x] Bank defects corrected 29 Nov in `public/data/questions.json` and `data/Aggregated_Output.json` (11 text fixes); the database copy is `supabase/migrations/0067_bank_corrections.sql` (**owner runs it once**, it also moves the 2021_AN_Q17 key from C to A)
- [x] Missing figures: the pictures exist in the app; keys checked against them for Databases (14), COA (9), Discrete Maths (3 of 4), Linear Algebra (1), Probability (1). Still to check: Compiler Design (11) and Digital Logic (21)
- [ ] (you) Unlock banner check with an all-packs account
- [ ] Live deploy check; tab bar in dark mode with several tabs
