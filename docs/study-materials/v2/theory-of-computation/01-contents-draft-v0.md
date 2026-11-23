# Theory of Computation: contents draft v0 (from the app's catalog and the PYQ bank)

Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Regular expressions and finite automata.
- Context-free grammars and push-down automata.
- Regular and context-free languages, pumping lemma.
- Turing machines and undecidability.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Regular expressions and finite automata | 4 topics ready | written (old standard; to be rewritten) |
| 02 | Regular languages: closure and pumping lemma | 3 topics ready | written (old standard; to be rewritten) |
| 03 | Context-free grammars and PDAs | 3 topics ready | written (old standard; to be rewritten) |
| 04 | Context-free languages: closure and pumping lemma | 3 topics ready | written (old standard; to be rewritten) |
| 05 | Turing machines | 3 topics ready | written (old standard; to be rewritten) |
| 06 | Decidability and undecidability | 3 topics ready | written (old standard; to be rewritten) |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **77**; marks: **121** = **8.1%** of all 1500 marks (about 8.1 marks a paper).
- Forge (our own) questions for this subject: **24**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Regular Expressions & Finite Automata (DFA/NFA Min) | 26 | 40 | 2.67% | 10 | 1/20/5 | MSQ1×2, MSQ2×4, NAT2×7, MCQ1×7, MCQ2×3, NAT1×3 |
| Regular and Context-Free Languages & Pumping Lemma | 25 | 40 | 2.67% | 10 | 2/22/1 | MSQ2×6, MCQ2×9, MSQ1×4, MCQ1×6 |
| Context-Free Grammars & Push-Down Automata | 14 | 22 | 1.47% | 6 | 1/9/4 | MSQ1×2, MSQ2×2, MCQ1×4, NAT2×3, MCQ2×3 |
| Turing Machines & Undecidability | 12 | 19 | 1.27% | 8 | 0/12/0 | MCQ1×3, MSQ1×2, MSQ2×1, MCQ2×6 |

### Question IDs by bank topic (so a reviewer can say which ones a lesson should use)

- **Context-Free Grammars & Push-Down Automata**: 2026_FN_Q25, 2026_FN_Q52, 2026_AN_Q29, 2025_FN_Q19, 2025_AN_Q24, 2024_FN_Q48, 2024_AN_Q42, 2023_FN_Q39, 2023_FN_Q40, 2021_FN_Q18, 2017_FN_Q22, 2017_FN_Q46, 2017_FN_Q37, 2017_AN_Q11
- **Regular Expressions & Finite Automata (DFA/NFA Min)**: 2026_FN_Q26, 2026_AN_Q47, 2025_FN_Q28, 2025_FN_Q50, 2025_AN_Q60, 2024_FN_Q36, 2024_FN_Q63, 2024_AN_Q34, 2024_AN_Q55, 2024_AN_Q38, 2023_FN_Q14, 2023_FN_Q19, 2023_FN_Q63, 2022_FN_Q12, 2021_FN_Q26, 2021_AN_Q12, 2021_AN_Q20, 2021_AN_Q51, 2020_FN_Q22, 2020_FN_Q41, 2019_FN_Q59, 2018_FN_Q16, 2018_FN_Q62, 2017_FN_Q23, 2017_AN_Q15, 2017_AN_Q40
- **Regular and Context-Free Languages & Pumping Lemma**: 2026_FN_Q51, 2026_AN_Q48, 2025_FN_Q44, 2025_FN_Q45, 2025_AN_Q30, 2025_AN_Q52, 2024_FN_Q16, 2023_FN_Q24, 2022_FN_Q47, 2022_FN_Q48, 2021_FN_Q19, 2021_AN_Q54, 2021_AN_Q23, 2021_AN_Q18, 2020_FN_Q19, 2020_FN_Q24, 2020_FN_Q60, 2019_FN_Q30, 2019_FN_Q28, 2019_FN_Q39, 2018_FN_Q45, 2017_FN_Q40, 2017_FN_Q50, 2017_AN_Q24, 2017_AN_Q38
- **Turing Machines & Undecidability**: 2026_AN_Q13, 2025_AN_Q25, 2022_FN_Q23, 2022_FN_Q46, 2021_FN_Q37, 2021_FN_Q23, 2020_FN_Q44, 2019_FN_Q50, 2018_FN_Q17, 2018_FN_Q46, 2017_FN_Q52, 2017_AN_Q60

## 4. What we need from this review

1. A **complete chapter and lesson list** for a beginner-first book on this subject (use the syllabus lines above, the standard books and what GATE really asks).
2. For each lesson: **finer points**, **GATE question patterns**, **diagrams needed**, **hand traces**, and which **prerequisite** a zero-level reader needs.
3. Which of the bank's topic labels map to which lesson, and which PYQs are **mis-labelled**.
4. A **weight tag** for each lesson ([MUST] / [SHOULD] / [LATER]) with a reason; do not invent frequencies; say "not sure".
5. The **question supply** needed: how many practice questions per lesson (20 for High-weight chapters, 10 for Low and foundation ones), and what types are missing in the bank.
