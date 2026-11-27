# Databases: review merge and plan v1

Merged: Gemini (`gemini.md`, primary) and ChatGPT (`chatgpt-review-databases.md`, comparison). Every number and every disputed item below was re-checked against `00-REVIEW-INPUT.md` (the 72-question bank) or recomputed by a program on 28 Nov 2026. "Verified" means we did that ourselves; "reviewers agree" means both reviewers accept the official key and we did not re-solve it.

## 1. How good were they
Both agree on the spine and on the verdict ("not yet a book that teaches from zero"). Both found the same two bank defects and the same missing-prerequisite chapter. Where they differ:
- **ChatGPT** is careful and sometimes too cautious: it refuses to certify two questions that are in fact solvable from the printed text (2025_AN_Q53, 2023_FN_Q62). It splits Functional Dependencies from Normal Forms and has finer lessons (NULL logic, set vs bag, referential actions, the 72-row audit with a "FACT-DOUBT" label).
- **Gemini** verifies more questions from the text, ties every diagram to a PYQ, and has the correct difficulty counts. It merges FDs and Normal Forms in one chapter (30 marks), which is too heavy.
- **Numbers:** both stat tables match the bank. Questions 72, marks 111 (7.4% of 1500), difficulty 15 Easy / 51 Medium / 6 Hard (Gemini states it correctly), 16 figure placeholders. Verified.

## 2. Data defects in the question bank (verified)
| Question | Problem | Status |
|---|---|---|
| 2025_AN_Q53 | Marked "figure missing" by ChatGPT. All four schedules are printed in the options. Precedence graphs computed by program: A, C, D have a cycle, **only B is conflict serializable**, key B correct | **Not a missing figure**: remove the placeholder tag |
| 2023_FN_Q62 | Marked "figure missing" by ChatGPT. 2500 data blocks, 51 index entries per block, 50 index blocks, ceil(log2 50) = **6**; key correct | **Solvable from text**; the wording asks only to identify the data block, so no extra data-block access |
| 2017_FN_Q39 (TRC safety) | Key D (I, II and III safe). A strict range-restriction reading makes only III safe, so the key rests on the active-domain convention. Both reviewers flag it | **Keep the key**, teach the convention, owner to confirm against the official key PDF |
| 2017_FN_Q31 | SQL is not standard (`COUNT(EmpId) AS EC(DeptName, Num)` inside the subquery, outer `FROM EC` undefined) and the EMP table is a missing figure. ChatGPT rebuilds the table (group sizes 4, 3, 3, 2, 1 average 2.6) from the original paper; we cannot check it here | Add a corrected equivalent SQL; restore the table |
| 2022_FN_Q56 | `NOT EXIST` should be `NOT EXISTS`; four tables missing | Fix wording after checking the paper; restore tables |
| 2025_AN_Q54 option D | NATURAL JOIN is correct only under set semantics or a unique (rollno, courseno) | Keep the key; state the assumption (ChatGPT's caveat is right) |
| 2026_FN_Q65 | Superkeys of R(A,B,C,D) with candidate keys AB, AC: **6** by program | Key correct |
| 2017_AN_Q62 | Conflict serializable schedules of two 4-operation transactions: **54** of 70 interleavings by program | Key correct |
| Figures (29 Nov update) | **The images exist in the app** (`public/images/<paper>/`); only the review files lacked them. Checked against the pictures: 2025_FN_Q21 (B+ tree with full root and full leaves: inserting 23 splits a leaf, splits the root, height grows: B and D), 2025_FN_Q55 = 26, 2024_FN_Q24 = diagram (iv), 2024_FN_Q35 = 2, 2023_FN_Q61 = 2, 2022_FN_Q56 = 2 (S01, S04), 2019_FN_Q41 = 5 (the query has no join condition, so the 5 students pair with the 5 qualifying marks), 2019_FN_Q47 = 1, 2017_AN_Q26 = 0, 2017_FN_Q31 = 2.6 (counts 4, 3, 3, 2, 1: ChatGPT's table was right), 2017_FN_Q38 = 4, 2017_AN_Q55 = 7, 2025_AN_Q57 = 33 under either leaf-split convention. **Two exceptions:** 2020_FN_Q12 (key 4): the Suppliers table in the picture lists S1 twice and has no S2, so as drawn the query returns 3 rows; with S2 in the second row (which the primary key implies) it returns 4, the key. 2020_FN_Q45 (key A): our own reading of the schedule picture preferred option B, but the official key is A (confirmed on a published solution), so our reading of the picture was wrong; no change. Original note: Two are solvable from text (above), so **14 are truly missing**: 2025_FN_Q21, 2025_FN_Q55, 2024_FN_Q24, 2024_FN_Q35, 2023_FN_Q61, 2022_FN_Q56, 2020_FN_Q12, 2020_FN_Q45, 2019_FN_Q41, 2019_FN_Q47, 2017_AN_Q26, 2017_FN_Q31, 2017_FN_Q38, 2017_AN_Q55 | **Done**: all 14 are now checked against the pictures in the app; only 2020_FN_Q12 has a picture defect |
| Other keys | For every text-complete question both reviewers agree with the official key. We re-solved the four above and the B+ tree split of 2025_AN_Q57 was **not** independently re-solved (the answer 33 depends on the copy-up convention) | Keep the keys; lesson states the convention |

## 3. Syllabus check
Official line: *ER-model. Relational model: relational algebra, tuple calculus, SQL. Integrity constraints, normal forms. File organization, indexing (e.g., B and B+ trees). Transactions and concurrency control.*
- Everything in both plans maps to those lines, except: **recovery and logging** (not named; asked in 2021_FN_Q28 and 2024_AN_Q13: tag [LEGACY-ASKED]) and **MVD / 4NF / 5NF** (not named, no bank question: tag [BEYOND], short note only).
- ChatGPT's remark that 4NF is not in the syllabus is correct.

## 4. The plan (merged)
Foundation first, then the ChatGPT split of FDs and normal forms, with Gemini's diagram per lesson.
**0 · Database foundations** [Foundation]: why a DBMS, three-schema architecture and data independence (2026_AN_Q15), sets, logic and counting bridge, relation vocabulary, NULL and three-valued logic.
**1 · ER model** [Medium, 5 q / 5 marks, all 1-mark]: entities, attributes, keys, cardinality and participation, weak entities (2024_AN_Q22), ER to tables.
**2 · Relational model and integrity** [Medium]: schema vs instance, degree vs cardinality, superkeys and counting (2026_FN_Q65), foreign keys, referential actions.
**3 · Relational algebra and tuple calculus** [High, 13 q / 21 marks]: operators, joins, outer joins, division (2022_FN_Q25), TRC and safety (2017_FN_Q39), selectivity.
**4 · SQL** [High, 10 q / 17 marks, 6 NAT]: clause order, joins, subqueries, EXISTS, IN and NOT IN with NULL, aggregates, set operations.
**5 · Functional dependencies** [High]: Armstrong's axioms, closure, candidate keys, minimal cover, counting superkeys.
**6 · Normal forms and decomposition** [High, 9 q / 15 marks]: prime attributes, 2NF, 3NF, BCNF, lossless join, dependency preservation, synthesis.
**7 · File organisation and indexing** [High]: blocking factor, dense and sparse, multilevel, B and B+ trees (order, split, copy-up vs push-up).
**8 · Transactions and recovery** [High, merged bucket 15 q / 23 marks]: ACID, serial vs serializable, precedence graphs, view serializability, recoverable, cascadeless, strict, logs [LEGACY-ASKED].
**9 · Concurrency control** [High]: lock compatibility, 2PL, strict 2PL, deadlock, timestamp ordering and Thomas rule, wait-die and wound-wait.
**10 · Previous-year practice** [Must]: all 72 by pattern.

Weights (bank, verified): Transactions/CC 15 q / 23, RA+TRC 13 / 21, SQL 10 / 17, FD 10 / 15, Normal forms 9 / 15, File/index 10 / 15, ER 5 / 5 (total 72 / 111). FDs plus normal forms are 19 q / 30 marks = 27% of the subject.

## 5. Next steps
1. Fix the two bank defects (remove the false figure tags; correct the wording of 2022_FN_Q56 and 2017_FN_Q31).
2. ~~Restore the 14 figures~~ Done 29 Nov: the pictures were already in the app; add them to the review input if a reviewer needs them again.
3. Add a `source` field and a note for the three assumption-dependent keys (2017_FN_Q39, 2025_AN_Q54, 2025_AN_Q57).
4. Tag the 72 PYQs to the lessons above, then write a six-lesson pilot (ChatGPT's list: DB0.1, DB1.2, DB5.3, DB6.2, DB7.4, DB8.2).
