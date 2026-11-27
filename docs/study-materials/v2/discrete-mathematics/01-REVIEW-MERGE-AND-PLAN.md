# Discrete Mathematics: review merge and plan v1

Merged: Gemini (`gemini.md`, primary) and ChatGPT (`chatgpt-review-discrete-mathematics.md`, comparison). Each defect below was checked by a program or by hand on 28 Nov 2026.

## 1. How good were they
Both are strong and independently found the same three data defects. Differences:
- **Gemini** adds a Chapter 00 (proofs, divisibility, modular arithmetic) and splits graph theory into 06A and 06B, tying each lesson to PYQs. **Its difficulty count is wrong**: it says 31 Hard / 34 Medium / 10 Easy (41% Hard); the bank has **33 Hard / 34 Medium / 8 Easy (44% Hard)**. ChatGPT states that the counts "sum correctly" and is right.
- **ChatGPT** adds wording caveats (2018_FN_Q29, 2019_FN_Q54, 2020_FN_Q52) and keeps logic as two chapters but refuses to split the combined bank buckets.
- **Bank numbers (verified):** 75 questions, 113 marks (7.5% of 1500), 4 figure placeholders. Graph theory 17 + 7 advanced = 24 q / 40 marks (35%); logic 14 / 19; counting 10 / 15; groups 10 / 15; sets, relations, lattices 11 / 15; recurrences 6 / 9.

## 2. Data defects (verified)
| Question | Problem | Status |
|---|---|---|
| 2021_FN_Q27 | S1 prints `... -> p`. Truth table: falsified at p = F, q = T, so neither S1 nor S2 is a tautology (answer D), contradicting the key B. With `... -> q` S1 **is** a tautology and S2 is not, which gives B. Both reviewers say the official paper has q | **Confirmed transcription error**: change the final p of S1 to q |
| 2022_FN_Q51 | Option C prints `f(5.2^n)`. Recurrence computed for n = 1 to 8: A, B and C (with 5·2^n) are true; D is false (f(2^n + 1) = 3) | Print `5 · 2^n` |
| 2019_FN_Q12 | Two options marked official (C: 1, D: (n−1)!/2). Counted by program: K3, K4, K5, K6 have 1, 3, 12, 60 distinct Hamiltonian cycles as edge sets = (n−1)!/2; 1 only counts cycle shapes up to isomorphism | Keep both keys; explain the ambiguity |
| 2017_FN_Q55 | "(p→q)→r is a contradiction" is literally impossible (it is true whenever r is true). Read as "false for the given values": r = F and p→q = T, then (r→p)→q reduces to q, so D is right and C is false | Keep D; reword as "is false" |
| 2019_FN_Q54 | The formula depends on the divisor convention: with negative divisors the antecedent fails for every x except −1 and S3 would fail. With positive divisors S1 fails at 97 (no prime in 98 to 100) and S2, S3 hold: key C | Keep C; state "positive divisors" |
| 2018_FN_Q29 | A proper subgroup of a group of order 84 has order at most 42; 42 is attained (cyclic). Wording must say "largest possible over all groups of order 84" | Keep 42; reword |
| 2020_FN_Q52 | Distinct strings of LILAC with no letter in its original position, the two L's identical: **12** by program | Key correct; explain "identical L's" |
| Other numbers re-solved | 2017_FN_Q41 = 271 (divisible by 3, 5 or 7 up to 500), 2019_FN_Q21 = 2 (3^51 mod 5) | Keys correct |
| 2022_FN_Q50 | Petersen graph: A (chromatic number 3) and B (Hamiltonian path) true; D (largest independent set 3) false, it is 4. Option C needs the picture | A, B verified; C open |
| Figures | 4 placeholders: 2024_AN_Q63, 2022_FN_Q50, 2018_FN_Q28, 2017_AN_Q28 (the last is solvable from the stated relation) | Restore three |

## 3. Syllabus check
Official line: *Propositional and first order logic. Sets, relations, functions, partial orders and lattices. Monoids, Groups. Graphs: connectivity, matching, colouring. Combinatorics: counting, recurrence relations, generating functions.* Both plans cover every item. Euler and Hamilton paths, planarity, Vizing's theorem and countability are not named but are asked: tag [LEGACY-ASKED]. Chapter 00 (proof techniques, modular arithmetic) is a Foundation bridge, not a syllabus item.

## 4. The plan (merged)
**0 · Foundations** (proofs, divisibility, modular arithmetic, sets and counting vocabulary).
**1 · Propositional logic** [High]. **2 · First-order logic** [High, 14 q / 19 marks in both chapters, 6 Hard].
**3 · Sets, relations and functions** [High, 0 Easy]. **4 · Partial orders and lattices** [Medium].
**5 · Monoids and groups** [High, about one question a paper].
**6A · Graph theory A** (structure, matrices, trees, planarity) and **6B · Graph theory B** (Euler and Hamilton, matching, cover, colouring) [Very High, 40 marks].
**7 · Counting and combinatorics** [High, 0 Easy]. **8 · Recurrences and generating functions** [Medium, 4 of 6 Hard].
**9 · Previous-year practice**.

## 5. Next steps
1. Correct 2021_FN_Q27 and 2022_FN_Q51 in the bank; add the wording notes above.
2. Restore the three figures (owner).
3. Do not reuse Gemini's difficulty tally.
4. Tag the 75 PYQs to lessons; pilot logic and graph theory.
