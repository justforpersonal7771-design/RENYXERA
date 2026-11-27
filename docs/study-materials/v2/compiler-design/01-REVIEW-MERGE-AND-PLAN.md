# Compiler Design: review merge and plan v1

Source: Gemini only (`gemini.txt`; ChatGPT not available for this subject, by the owner's decision of 28 Nov 2026). Everything marked "verified" was recomputed by a program on 28 Nov 2026.

## 1. How good was it
Good and specific. It finds the two serious bank defects (both verified below), points out that there is no chapter on compiler phases and the symbol table (seven PYQs test the pipeline), and ties every diagram to a PYQ. Its weight tables match the bank. One loose figure: it says parsing plus SDT give "65 to 70%" of the marks; the bank gives 43 + 18 = 61 of 85 = **72%** (parsing alone is 51%).
**Bank numbers (verified):** 55 questions, 85 marks (5.7% of 1500), difficulty 13 Easy / 30 Medium / 12 Hard, types 35 MCQ / 8 MSQ / 12 NAT, 11 figure placeholders.

## 2. Data defects (verified)
| Question | Problem | Status |
|---|---|---|
| 2025_AN_Q40 | Printed grammar `S → Aa | bac | dc | bda, A → d`. An LR parser generator (SLR, LALR, canonical LR) written for this check shows the **printed** grammar is conflict-free in SLR(1) and LALR(1), so the correct option would be D, not the key C. With `bAc` (capital A) SLR(1) has 2 shift-reduce conflicts and LALR(1) has none: "LALR(1), not SLR(1)" = key C | **Confirmed**: change `bac` to `bAc` |
| 2026_AN_Q41 | `A → αA | ε` prints a Greek α. Treating it as the terminal a, the LR(0) table has **5** shift-reduce conflicts = key D | **Confirmed**: print `a` |
| 2026_AN_Q35 | Token definition prints `[A - Za - z]` with spaces; the string yields **13** tokens (x1, 23, mm, 78, y, 7, z, zz5, 14, A, 8, H, AaYcD) | Key correct; fix the spacing |
| 2020_FN_Q35 | Options A and C are both "I only" | Key D unaffected; fix option C |
| Other numbers re-solved | 2024_AN_Q64 = 9 items, 2022_FN_Q29 = 5, 2021_AN_Q46 = 8, 2019_FN_Q36 = 5, 2021_FN_Q11 = 6 DAG nodes, 2020_FN_Q21 = 7 reductions, 2025_FN_Q52 = 6 basic blocks, 2017_FN_Q54 = 2 registers | All keys correct |
| Figures | 11 missing: 2026_FN_Q42, 2026_AN_Q45, 2026_FN_Q53, 2024_FN_Q38, 2024_AN_Q51, 2024_AN_Q48, 2023_FN_Q37, 2021_FN_Q36, 2019_FN_Q13, 2019_FN_Q57, 2018_FN_Q48 | **Open**: restore |
| Other keys (MCQ, MSQ) | Gemini says CORRECT for every text-complete one; we did not re-solve them | Keep |

## 3. Syllabus check
Official line: *Lexical analysis, parsing, syntax-directed translation. Runtime environments. Intermediate code generation. Local optimisation, data flow analyses: constant propagation, liveness analysis, common sub expression elimination.* Gemini's eight chapters map to these lines. Chapter 0 (phases, symbol table, errors) is a Foundation bridge. SSA, backpatching and triples are asked but not named: [LEGACY-ASKED].

## 4. The plan
**0 · Compiler architecture, symbol table, errors** [Foundation]. **1 · Lexical analysis** [Low-Medium, maximal munch]. **2 · Top-down parsing, LL(1)** [Very High]. **3 · Bottom-up parsing: LR(0), SLR, LALR, CLR** [Very High, the main 2-mark source]. **4 · Syntax-directed translation** [High]. **5 · Runtime environments** [Low, activation records]. **6 · Intermediate code** [Medium]. **7 · Local optimisation: basic blocks, DAG, Ershov numbering** [Medium-High]. **8 · Data-flow analysis** [Medium, rising in 2026]. **9 · Previous-year practice**.
Weights (bank): lexical + parsing 30 q / 43 marks, SDT + runtime 11 / 18, intermediate code + local optimisation 9 / 15, data flow 5 / 9.

## 5. Next steps
Correct 2025_AN_Q40 and 2026_AN_Q41 now; restore the 11 figures (owner); tag the 55 PYQs to lessons; build the LR item-set generator used here as the figure engine for parsing tables.
