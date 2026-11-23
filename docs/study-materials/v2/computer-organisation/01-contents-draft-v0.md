# Computer Organisation: contents draft v0 (from the app's catalog and the PYQ bank)

Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Machine instructions and addressing modes.
- ALU, data-path and control unit.
- Instruction pipelining, pipeline hazards.
- Memory hierarchy: cache, main memory and secondary storage.
- I/O interface (interrupt and DMA mode).

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Machine instructions and addressing modes | 3 topics ready | written (old standard; to be rewritten) |
| 02 | ALU, data path and control unit | 3 topics ready | written (old standard; to be rewritten) |
| 03 | Instruction pipelining and hazards | 3 topics ready | written (old standard; to be rewritten) |
| 04 | Cache memory | 3 topics ready | written (old standard; to be rewritten) |
| 05 | Main memory and secondary storage | 4 topics ready | written (old standard; to be rewritten) |
| 06 | I/O interface: interrupts and DMA | 4 topics ready | written (old standard; to be rewritten) |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **72**; marks: **115** = **7.7%** of all 1500 marks (about 7.7 marks a paper).
- Forge (our own) questions for this subject: **31**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Memory Hierarchy (Direct/Associative Cache Mapping) | 27 | 47 | 3.13% | 10 | 0/23/4 | MCQ2×7, MSQ2×3, NAT2×10, MSQ1×1, NAT1×5, MCQ1×1 |
| Instruction Pipelining, Performance, Hazard Management | 16 | 28 | 1.87% | 9 | 1/11/4 | MCQ1×1, NAT2×12, MSQ1×2, NAT1×1 |
| Machine Instructions & Addressing Modes | 14 | 24 | 1.60% | 8 | 2/10/2 | MCQ1×3, MCQ2×3, MSQ1×1, NAT2×6, MSQ2×1 |
| I/O Interfaces (Interrupts & DMA Control Modes) | 9 | 9 | 0.60% | 8 | 3/5/1 | MCQ1×7, NAT1×2 |
| ALU, Control Unit Design, Data-Path Operations | 4 | 4 | 0.27% | 3 | 1/2/1 | MSQ1×1, NAT1×1, MCQ1×2 |
| Main Memory & Virtual Memory Mechanics | 2 | 3 | 0.20% | 2 | 0/2/0 | MSQ2×1, NAT1×1 |

### Question IDs by bank topic (so a reviewer can say which ones a lesson should use)

- **Machine Instructions & Addressing Modes**: 2026_FN_Q14, 2026_FN_Q15, 2026_AN_Q44, 2025_FN_Q37, 2025_AN_Q28, 2024_AN_Q49, 2024_AN_Q43, 2023_FN_Q41, 2021_FN_Q38, 2021_AN_Q58, 2020_FN_Q63, 2018_FN_Q61, 2017_FN_Q27, 2017_FN_Q60
- **Instruction Pipelining, Performance, Hazard Management**: 2026_FN_Q16, 2026_FN_Q60, 2026_AN_Q57, 2025_AN_Q56, 2025_AN_Q61, 2024_FN_Q22, 2024_FN_Q55, 2024_AN_Q25, 2024_AN_Q56, 2023_FN_Q33, 2022_FN_Q61, 2021_FN_Q41, 2021_AN_Q59, 2020_FN_Q43, 2018_FN_Q60, 2017_FN_Q49
- **Memory Hierarchy (Direct/Associative Cache Mapping)**: 2026_FN_Q38, 2026_AN_Q52, 2026_AN_Q56, 2025_FN_Q36, 2025_FN_Q53, 2025_AN_Q39, 2025_AN_Q55, 2024_FN_Q41, 2024_FN_Q56, 2023_FN_Q64, 2022_FN_Q24, 2022_FN_Q33, 2022_FN_Q54, 2021_FN_Q51, 2021_AN_Q65, 2021_AN_Q39, 2020_FN_Q27, 2020_FN_Q55, 2019_FN_Q11, 2019_FN_Q60, 2018_FN_Q44, 2017_FN_Q20, 2017_FN_Q53, 2017_FN_Q65, 2017_AN_Q47, 2017_AN_Q39, 2017_AN_Q36
- **Main Memory & Virtual Memory Mechanics**: 2026_FN_Q54, 2018_FN_Q33
- **I/O Interfaces (Interrupts & DMA Control Modes)**: 2026_AN_Q18, 2025_FN_Q11, 2024_FN_Q33, 2024_AN_Q24, 2023_FN_Q34, 2022_FN_Q17, 2021_AN_Q11, 2020_FN_Q33, 2018_FN_Q19
- **ALU, Control Unit Design, Data-Path Operations**: 2025_FN_Q27, 2025_AN_Q32, 2020_FN_Q30, 2018_FN_Q15

## 4. What we need from this review

1. A **complete chapter and lesson list** for a beginner-first book on this subject (use the syllabus lines above, the standard books and what GATE really asks).
2. For each lesson: **finer points**, **GATE question patterns**, **diagrams needed**, **hand traces**, and which **prerequisite** a zero-level reader needs.
3. Which of the bank's topic labels map to which lesson, and which PYQs are **mis-labelled**.
4. A **weight tag** for each lesson ([MUST] / [SHOULD] / [LATER]) with a reason; do not invent frequencies; say "not sure".
5. The **question supply** needed: how many practice questions per lesson (20 for High-weight chapters, 10 for Low and foundation ones), and what types are missing in the bank.
