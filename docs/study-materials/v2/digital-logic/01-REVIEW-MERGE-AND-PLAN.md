# Digital Logic: review merge and plan v1

Source: Gemini only (`gemini.txt`). Everything marked "verified" was recomputed by a program on 28 Nov 2026.

## 1. How good was it
Strong. Its main structural finding is right: number representation sits at Chapter 5 in our book although K-maps, adders and counters need it first. It also found four broken bank entries; all four are real (below). Its counts match the bank: 69 questions, 103 marks (6.9% of 1500), **13 Easy / 47 Medium / 9 Hard (60 of 69 = 87% Easy or Medium)**, types 36 MCQ / 16 MSQ / 17 NAT, and number representation plus Boolean algebra and K-maps are 66 of 103 marks (64%).
**Figures:** 25 questions carry an image tag.

## 2. Data defects (verified)
| Question | Problem | Status |
|---|---|---|
| 2026_FN_Q21 | Printed F = (P + Q) ⊕ (P̄Q) equals **P**, so none of the options (A: P⊕Q complement, C: P ⊕ Q̄) match. With (P̄ + Q) ⊕ (P̄Q) the truth table gives the XNOR, which equals options A and C | **Confirmed**: add the missing overline on the first P |
| 2025_AN_Q43 | Option A lists three of the four minterms of x̄z̄; without w̄x̄ȳz̄ it differs from D at 0000. Adding that term makes A equal D, as the key (A and D) needs | **Confirmed**: restore the fourth term |
| 2025_AN_Q50 | Printed option D, (A + B̄ + D̄)(C + D)(Ā + C + D)(A + B + D̄) = ĀD + CD̄, fails at all 8 points where D = 1, yet the key says D is correct. B and C (consensus and the product form) are identities, verified. Printed A is false, as the key says | Printed D is a **transcription defect**; the original paper is needed for the true text |
| 2021_AN_Q17 | "Smallest normalised positive number": normalised needs exponent ≥ 1, so the correct option is **A** (exponent 00000001, mantissa 0). The bank marks C (exponent 0, mantissa 0 = +0.0, not normalised) | **Key letter wrong or options shuffled**; owner to confirm against the official key |
| 2026_FN_Q37, 2023_FN_Q21, 2022_FN_Q40, 2017_AN_Q45 | Gemini solves these from the text although the figure is missing | Accept as text-solvable (not independently re-solved) |
| Other numbers re-solved | 2026_AN_Q34 = −60.25, 2025_AN_Q34 = 250 kHz, 2023_FN_Q32 = 110, 2021_AN_Q36 = 3, 2021_FN_Q65 = −7.75, 2021_AN_Q49 = 6 literals (minimum cover by program), 2020_FN_Q25 = 5, 2020_FN_Q26 = 1034, 2019_FN_Q49 = 3 NOR gates, 2018_FN_Q59 = 3 essential prime implicants, 2017_AN_Q25 = 8 | All keys correct |
| Figure questions (29 Nov update) | **The pictures exist in the app; checked against the keys: all correct except two text defects.** Verified: 2026_AN_Q59 = 6, 2025_AN_Q31 = A, B, C, 2025_AN_Q43 = A, D (K-map is x'z' + xz), 2025_FN_Q59 = 5 states, 2025_FN_Q60 = 8 states (Johnson counter), 2024_AN_Q23 = option C by position (exponent 11111110 is the largest finite number; exponent 11111111 is NaN), 2024_FN_Q17 = A, C, 2024_AN_Q46 = C, D, 2024_FN_Q49 = 4, 2023_FN_Q43 = A ((0,0,1) is never reached), 2022_FN_Q41 = B, 2021_AN_Q56 = A, 2021_FN_Q55 = A, 2020_FN_Q54 = B, 2019_FN_Q22 = A, 2019_FN_Q56 = A, 2018_FN_Q32 = 2, 2017_FN_Q26 = 1, 2017_FN_Q59 = B. **Defects:** (1) 2023_FN_Q44: the function is printed A + A'C' + AB'C; the paper has A' + A'C' + AB'C (first A complemented), which equals A' + B'C and is realised by option C, the key. As printed no option realises it under any wiring. Text fixed (migration 0068). (2) 2022_FN_Q41: the picture prints R_B = 0xC42100000 (nine digits); with R_B = 0x42100000 (+36) option B (C = A + B) is the only false one, the key; with the stray C read as a sign bit (−36) two statements would be false. Picture cannot be edited here. |

## 3. Syllabus check
Official line: *Boolean algebra and minimization: algebraic technique, Karnaugh map, tabular method. Design of combinational and sequential circuits. Number representation and arithmetic (fixed and floating point).* Gemini's six chapters match; the tabular method and universal-gate counts sit in Chapter 3. Hazards and number codes beyond the syllabus words are [LEGACY-ASKED].

## 4. The plan
**1 · Number representation and codes** (moved to the front) [Foundation / High]. **2 · Gates and Boolean algebra** [High]. **3 · Minimisation: K-maps, tabular method, NAND/NOR** [Very High]. **4 · Combinational circuits and hazards** [Medium-High, 0 Hard]. **5 · Sequential circuits, flip-flops, counters, FSMs** [High, 0 Easy]. **6 · Computer arithmetic: fixed and IEEE 754 floating point** [Very High, rising]. **7 · Previous-year practice**.
Weights: Boolean algebra and K-maps 20 q / 33 marks, number representation 26 / 33, sequential 11 / 19, combinational 12 / 18.

## 5. Next steps
Correct 2026_FN_Q21, 2025_AN_Q43, and the key letter of 2021_AN_Q17; recover the true text of 2025_AN_Q50; move number representation to Chapter 1 in the app.
