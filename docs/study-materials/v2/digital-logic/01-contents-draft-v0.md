# Digital Logic: contents draft v0 (from the app's catalog and the PYQ bank)

Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Boolean algebra.
- Combinational and sequential circuits.
- Minimization.
- Number representations and computer arithmetic (fixed and floating point).

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Boolean algebra | none | not written |
| 02 | Minimisation | none | not written |
| 03 | Combinational circuits | none | not written |
| 04 | Sequential circuits | none | not written |
| 05 | Number representation | none | not written |
| 06 | Computer arithmetic: fixed and floating point | none | not written |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **69**; marks: **103** = **6.9%** of all 1500 marks (about 6.9 marks a paper).
- Forge (our own) questions for this subject: **25**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Boolean Algebra, Minimization, K-Maps | 20 | 33 | 2.20% | 8 | 3/15/2 | MSQ1×3, MSQ2×5, MCQ1×3, MCQ2×5, NAT2×3, NAT1×1 |
| Number Representations & Fixed/Floating Point Math | 26 | 33 | 2.20% | 10 | 8/13/5 | MSQ1×3, MCQ2×5, NAT1×5, MSQ2×2, MCQ1×11 |
| Sequential Circuits (Flip-Flops, Registers, Counters) | 11 | 19 | 1.27% | 6 | 0/9/2 | MCQ2×6, NAT2×2, NAT1×2, MCQ1×1 |
| Combinational Logic (Multiplexers, Decoders, Adders) | 12 | 18 | 1.20% | 8 | 2/10/0 | NAT2×2, MSQ1×2, MSQ2×1, MCQ2×3, MCQ1×2, NAT1×2 |

### Question IDs by bank topic (so a reviewer can say which ones a lesson should use)

- **Boolean Algebra, Minimization, K-Maps**: 2026_FN_Q21, 2026_FN_Q48, 2026_AN_Q16, 2026_AN_Q40, 2025_FN_Q24, 2025_FN_Q42, 2025_AN_Q43, 2025_AN_Q50, 2024_FN_Q62, 2024_AN_Q32, 2021_FN_Q64, 2021_AN_Q49, 2020_FN_Q54, 2019_FN_Q18, 2019_FN_Q49, 2018_FN_Q14, 2018_FN_Q59, 2017_FN_Q26, 2017_AN_Q43, 2017_AN_Q41
- **Number Representations & Fixed/Floating Point Math**: 2026_FN_Q22, 2026_FN_Q36, 2026_AN_Q28, 2026_AN_Q34, 2025_FN_Q25, 2025_AN_Q49, 2024_FN_Q18, 2024_AN_Q23, 2024_AN_Q60, 2023_FN_Q32, 2023_FN_Q45, 2022_FN_Q18, 2022_FN_Q41, 2021_FN_Q44, 2021_FN_Q65, 2021_AN_Q17, 2021_AN_Q36, 2020_FN_Q59, 2019_FN_Q17, 2019_FN_Q33, 2018_FN_Q43, 2017_FN_Q24, 2017_FN_Q11, 2017_AN_Q23, 2017_AN_Q12, 2017_AN_Q25
- **Sequential Circuits (Flip-Flops, Registers, Counters)**: 2026_FN_Q37, 2025_FN_Q59, 2025_FN_Q60, 2025_AN_Q34, 2023_FN_Q21, 2023_FN_Q43, 2021_FN_Q55, 2021_AN_Q42, 2018_FN_Q32, 2017_FN_Q59, 2017_AN_Q45
- **Combinational Logic (Multiplexers, Decoders, Adders)**: 2026_AN_Q59, 2025_AN_Q31, 2024_FN_Q17, 2024_FN_Q49, 2024_AN_Q46, 2023_FN_Q44, 2022_FN_Q40, 2021_AN_Q56, 2020_FN_Q25, 2020_FN_Q26, 2019_FN_Q22, 2019_FN_Q56

## 4. What we need from this review

1. A **complete chapter and lesson list** for a beginner-first book on this subject (use the syllabus lines above, the standard books and what GATE really asks).
2. For each lesson: **finer points**, **GATE question patterns**, **diagrams needed**, **hand traces**, and which **prerequisite** a zero-level reader needs.
3. Which of the bank's topic labels map to which lesson, and which PYQs are **mis-labelled**.
4. A **weight tag** for each lesson ([MUST] / [SHOULD] / [LATER]) with a reason; do not invent frequencies; say "not sure".
5. The **question supply** needed: how many practice questions per lesson (20 for High-weight chapters, 10 for Low and foundation ones), and what types are missing in the bank.
