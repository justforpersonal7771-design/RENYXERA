# Question bank: every discrepancy found, from the start to 29 Nov 2026

One row per problem found in the question bank (`data/Aggregated_Output.json`, copied to `public/data/questions.json` at build, and the database tables `questions`, `question_options`, `question_answers`). Sources: the OS, Networks, Algorithms and Theory of Computation review rounds (24 Nov), and the Databases, COA, Discrete Maths, Compiler Design, Digital Logic, Linear Algebra and Probability rounds (28 and 29 Nov). "Verified" means rechecked by a program, by hand, from the picture in the app, or on a published solution.

**Status words:** **Fixed** (JSON and database) · **Fixed in JSON, owner runs SQL** · **Keep** (bank is right, the lesson must explain) · **Open** (still to confirm or restore) · **Picture** (the defect is inside an image).

Related files: [`ISSUES-LOG.md`](../ISSUES-LOG.md) (dated log of all work), `supabase/migrations/0067_bank_corrections.sql` (run), `0068_bank_corrections_2.sql` (run), the per-subject `01-REVIEW-MERGE-AND-PLAN.md`.

## A. Wrong text in a question or option (fixed)

| # | Question | Subject | Found | Problem | Evidence | Fix |
|---|---|---|---|---|---|---|
| 1 | 2024_FN_Q64 | OS | 24 Nov | Thread printed `a = 2 + a`; the paper has `a = 2 * a` (with `+` the answer set changes) | official page text | Fixed |
| 2 | 2026_AN_Q51 option C | OS | 24 Nov | Printed `**$*##*#` (four stars, impossible with three prints); paper has `**$##*#` | official page text | Fixed |
| 3 | 2026_FN_Q52 | TOC | 24 Nov | Grammar printed `S → abaaBAbba`; paper `S → abaABAbba` | official page text | Fixed |
| 4 | 2023_FN_Q19 | TOC | 24 Nov | Range printed `[A – Za – a]`; paper `[A–Za–z]` | official page text | Fixed |
| 5 | 2025_AN_Q41 | Algorithms | 24 Nov | Printed `1 = i = n`; paper `1 ≤ i ≤ n` | official page text | Fixed |
| 6 | 2021_FN_Q27 | Discrete | 28 Nov | S1 printed `… → p`; with `→ q` S1 is a tautology and the key B holds. As printed neither formula is a tautology | truth table; both reviewers; paper | Fixed (0067) |
| 7 | 2022_FN_Q51 | Discrete | 28 Nov | Option C printed `f(5.2^n)`; meant `f(5·2^n)` | recurrence computed for n = 1 to 8 | Fixed (0067) |
| 8 | 2025_AN_Q40 | Compiler | 28 Nov | Grammar printed `bac`; paper `bAc`. As printed the grammar is SLR(1) and LALR(1), contradicting the key C | LR parser generator written for the check | Fixed (0067) |
| 9 | 2026_AN_Q41 | Compiler | 28 Nov | `A → αA` printed with a Greek α; the terminal is `a` (5 shift-reduce conflicts = key D) | LR(0) generator | Fixed (0067) |
| 10 | 2026_FN_Q21 | Digital | 28 Nov | First `P` lacked its overline; as printed F = P and no option matches | truth table | Fixed (0067) |
| 11 | 2025_AN_Q43 option A | Digital | 28 Nov | Lost its fourth minterm w̄x̄ȳz̄; as printed A ≠ D at 0000 | K-map in the app picture; truth table | Fixed (0067) |
| 12 | 2022_FN_Q45 | Linear Algebra | 28 Nov | Stem and option B printed `U32`; U is upper triangular, must be `U33` | Doolittle LU, x = (0, 2, −1) | Fixed (0067) |
| 13 | 2026_FN_Q38 | COA | 28 Nov | Stem said `K = 2^k` while the options use `L` | tag arithmetic | Fixed (0067) |
| 14 | 2022_FN_Q56 | Databases | 28 Nov | `NOT EXIST` for `NOT EXISTS` | wording | Fixed (0067) |
| 15 | 2023_FN_Q18 | Linear Algebra | 28 Nov | "Let and A = …" | wording | Fixed (0067) |
| 16 | 2023_FN_Q37 option D | Compiler | 29 Nov | Printed `B2: {a, i, j}`; true `B2: {a, j}` (i is redefined in B4 before any use) | liveness program; published solutions | Fixed (0068) |
| 17 | 2023_FN_Q44 | Digital | 29 Nov | Function printed `A + A'C' + AB'C`; paper `A' + A'C' + AB'C`. As printed no option realises it under any wiring; with the fix option C (the key) does | exhaustive wiring search; published sources | Fixed (0068) |

## B. Answer key problems

| # | Question | Subject | Found | Problem | Evidence | Status |
|---|---|---|---|---|---|---|
| 18 | 2021_AN_Q17 | Digital | 28 Nov | Key letter C names "exponent 00000000, mantissa 0" which is +0.0, not a normalised number | see section D | Fixed (0067): key moved C to A |
| 19 | 2020_FN_Q22 | TOC | 24 Nov | All four options carry "official". A program tested all four expressions against "odd number of 1s" up to length 8: none is correct | program; third-party sources give "marks to all" | **Open (owner)**: confirm "marks to all" with the official key |
| 20 | 2023_FN_Q27 | OS | 24 Nov | Bank shows A, C, D. Official final key records "A, C, D or C, D" | official key | **Open**: store both accepted keys |
| 21 | 2019_FN_Q12 | Discrete | 28 Nov | Two options marked official (C: 1, D: (n−1)!/2). K3 to K6 have 1, 3, 12, 60 distinct cycles = (n−1)!/2; 1 only up to isomorphism | counted by program; both reviewers | Keep: both keys, lesson explains |
| 22 | 2020_FN_Q27 | COA | 28 Nov | Key accepts 13.3 and 13.5 (two AMAT conventions: 3 + 0.06 × 175 and 0.94 × 3 + 0.06 × 175) | arithmetic | Keep |
| 23 | 2023_FN_Q30 | Linear Algebra | 28 Nov | Key accepts 2 or 4 (trace of an adjacency matrix with two self-loops, each loop counted once or twice) | picture in the app | Keep |
| 24 | 2017_FN_Q39 | Databases | 28 Nov | Key D (I, II and III safe). A strict range-restriction reading makes only III safe, so the key rests on the active-domain convention | both reviewers | Keep; **owner to confirm on the official key PDF** |
| 25 | 2020_FN_Q45 | Databases | 29 Nov | Our own reading of the schedule picture preferred option B; the official key is A | published solution confirms A | Keep (our reading was wrong) |

## C. Question needs an assumption or has an unclear stem (bank text unchanged)

| # | Question | Subject | Problem | Action |
|---|---|---|---|---|
| 26 | 2020_FN_Q37 | OS | The 155 ns answer needs "10% page-fault rate" read as 10% of the 5% TLB-miss path; read as 10% of all accesses it is about 720 ns | Keep key; lesson shows both |
| 27 | 2019_FN_Q63 | OS | Accepted ranges differ with the unit reading (GB as 10⁹ or 2³⁰) | Lesson states the unit rule |
| 28 | 2021_FN_Q50 | Algorithms | Recurrence says n > 0; at n = 1 ⌈1/2⌉ = 1 never ends; the paper probably says n > 1. Key Θ(n) holds either way | **Open**: check the page image |
| 29 | 2021_AN_Q55 | Algorithms | Wording issue flagged by ChatGPT | **Open**: check the page image |
| 30 | 2021_AN_Q18 option D | TOC | Printed `{w x x w^R w^R}` is not context-free yet marked correct; Gemini says the paper has `{w x x^R w^R}` | **Open, high confidence**: confirm on the page image, then fix |
| 31 | 2025_AN_Q54 option D | Databases | NATURAL JOIN is correct only under set semantics or a unique (rollno, courseno) | Keep; state the assumption |
| 32 | 2017_FN_Q55 | Discrete | "(p→q)→r is a contradiction" is literally impossible; it means false for the given values | Keep D; reword |
| 33 | 2019_FN_Q54 | Discrete | Depends on the divisor convention (positive divisors); with negative divisors S3 fails | Keep C; state it |
| 34 | 2018_FN_Q29 | Discrete | "Largest possible proper subgroup of a group of order 84" must read "over all groups of order 84" | Keep 42; reword |
| 35 | 2024_FN_Q55 | COA | "Overhead of an additional core is 10 ns" is ambiguous; the answer 3 holds under both readings | Keep |
| 36 | 2020_FN_Q35 | Compiler | Options A and C are both "I only" | Key D unaffected; fix option C |
| 37 | 2026_AN_Q35 | Compiler | Token definition printed `[A - Za - z]` with spaces | Key 13 correct; fix spacing |
| 38 | 2025_AN_Q44 | Linear Algebra | Q printed as 3 × 3 where a vector is meant; equations hold either way | Fix if confirmed |
| 39 | 2026_AN_Q14 | Probability | "random variable .. ?" for "random variable X?" | Fix |
| 40 | 2017_FN_Q31 | Databases | SQL not standard (`COUNT(EmpId) AS EC(DeptName, Num)`) | Add a corrected equivalent |

## D. Defects inside a picture (cannot be edited here)

| # | Question | Subject | Problem | Verified result |
|---|---|---|---|---|
| 41 | 2022_FN_Q41 | Digital | Picture prints `R_B = 0xC42100000` (nine digits). With 0x42100000 (+36) option B is the only false statement = key | Key correct |
| 42 | 2020_FN_Q12 | Databases | Suppliers table lists S1 twice and no S2: as drawn the query returns 3 rows; with S2 it returns 4 = key | Key correct if S2 was meant |
| 43 | 2025_AN_Q50 option D | Digital | Printed option D is not an identity (fails at all 8 points with D = 1) yet the key says it is correct; true text unknown | **Open**: original paper needed |

## E. Wrong subject or tag

| # | Question | Problem | Action |
|---|---|---|---|
| 44 | 2019_FN_Q46, 2017_FN_Q47, 2017_FN_Q28 | Cryptography filed under Application Layer (Networks) | Retag; optional cryptography note |
| 45 | 2025_AN_Q16 | ARP and TCP piggybacking filed under "OSI & TCP/IP layers" | Retag by concept |
| 46 | Several "IP addressing" items | Really ARP, DHCP or ICMP | Retag by concept |
| 47 | `pds-pyq-tags.tsv` | Several ids in the early tag list point at questions of other subjects (for example 2024_AN_Q65 is an SLR parser question, 2021_FN_Q43 a decomposition question); the tags were matched by a different numbering. The book chapters use only verified ids | Rebuild the tag list from `question_id`, not `question_no` |
| 48 | Id versus number | In `questions.json` the `question_id` number and `question_no` differ in some papers (2021_AN_Q17 has question_no 14); images are named by the id number | Always match by `question_id` |

## F. Figures and data

| # | Item | Status |
|---|---|---|
| 49 | The reviewers' files lacked figures; the pictures exist in the app (`public/images/<paper>/`) | Checked 29 Nov for Databases (14), COA (9), Compiler Design (11), Digital Logic (25 tags), Discrete Maths (3 of 4), Linear Algebra (1), Probability (1) |
| 50 | 2024_AN_Q63 (chromatic number, key 2) and option C of 2022_FN_Q50 (Petersen isomorphism) | Picture seen; not proven edge by edge |
| 51 | Nine Networks figure questions (2025_FN_Q40, 2025_FN_Q57, 2024_FN_Q58, 2023_FN_Q65, 2022_FN_Q22, 2022_FN_Q55, 2022_FN_Q57, 2021_FN_Q46, 2021_AN_Q53) and eleven Algorithms ones | **Open**: check the pictures when writing each lesson |
| 52 | No record stores the official paper link, session or key status | Add a `source` field |
| 53 | Forge questions (OS 30, COA 31, Discrete 22, Algorithms 29, …) were never in the review files | Include in a later round |

## G. Reviewer errors (not bank errors, kept so they are not repeated)

| # | Reviewer | Claim | Truth |
|---|---|---|---|
| 54 | ChatGPT (COA) | 2023_FN_Q64 key 19 needs a one-byte block | Wrong: tag = 32 − log₂(64 KB / 8) = 19 for every block size |
| 55 | ChatGPT (Databases) | 2025_AN_Q53 and 2023_FN_Q62 cannot be checked (figure missing) | Both solvable from the text: B and 6 |
| 56 | Gemini (COA) | 6 Easy / 53 Medium / 13 Hard, 37 NAT | 7 / 53 / 12 and 38 NAT |
| 57 | Gemini (Discrete) | 31 Hard / 34 Medium / 10 Easy | 33 / 34 / 8 |
| 58 | Gemini (Probability) | 13 of 31 questions Hard | 9 Hard (4 Easy, 18 Medium) |
| 59 | Gemini (Compiler) | Parsing plus SDT "65 to 70%" of the marks | 61 of 85 = 72% |

## Detail for #18: 2021 AN Q17 (please confirm against the official key)

**Question (bank id `GATE_CS_2021_AN_Q17`, `question_no` 14, 1 mark):** "The format of the single-precision floating-point representation of a real number as per the IEEE 754 standard is [sign 1 bit | exponent 8 bits | mantissa 23 bits]. Which one of the following choices is correct with respect to the **smallest normalized positive number** represented using the standard?"

| Option (bank order) | Exponent | Mantissa | What it is |
|---|---|---|---|
| A | 00000001 | all zeros | 1.0 × 2⁻¹²⁶, the smallest normalised positive number |
| B | 00000000 | 0…01 | the smallest **denormal** (2⁻¹⁴⁹) |
| C | 00000000 | all zeros | **+0.0**, not a normalised number |
| D | 00000001 | 0…01 | the second smallest normalised number |

- **Bank key before the fix:** C. **My answer:** A (normalised numbers need exponent 1 to 254, so the smallest has exponent 00000001 and mantissa 0).
- **Evidence:** published solutions give the correct content as "exponent = 00000001, mantissa = 0" but label it differently: one listing calls it option (C), another option (D). So the option order differs between listings of this question, which explains how the bank key letter C ended up on the wrong text.
- **What I could not do:** the 2021 answer-key PDF in `data/pyq/official_pdfs/CS/CS_2021/` is the CS-1 paper and a scan; this question is from CS-2 (Set 2, CS question 14). To confirm, open the official GATE 2021 CS-2 answer key, find question 14 (CS section) and check that the key letter matches the option that reads "exponent 00000001, mantissa all zeros" in **your paper's** option order. If the paper's letter points at that text, the bank key must be the letter of that text (A in our order), which is what migration 0067 set.

## Option order of GATE 2024 AN Q23 (Digital Logic, IEEE 754) — owner to confirm the key

- **Bank text:** `A) [IMAGE_Q_23_A] | B) [IMAGE_Q_23_C] | C) [IMAGE_Q_23_D] | D) [IMAGE_Q_23_B]`. The app resolves each token to its file (`lib/services/image-resolver.ts`), so option B shows `23_C.png`.
- **The pictures:** `23_A` exponent 01111111, all-ones fraction (just under 2); `23_C` exponent **11111110**, all-ones fraction (the largest finite number); `23_D` exponent 11111111, all-ones fraction (NaN); `23_B` exponent 01111111, zero fraction (1.0).
- **My answer:** the picture with exponent 11111110, which the app lists as **option B**. An earlier review said 'option C by position'; that fits only if the original paper's own option order differs from the bank's.
- **To confirm:** open the question in the app and check which option letter the stored key marks. If the key is C, the bank's option order or its key needs correcting (as was done for 2021 AN Q56). The Digital Logic chapter L6 describes the answer by its picture, so it stays right either way.

