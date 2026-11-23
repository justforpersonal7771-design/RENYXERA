# Operating Systems: contents draft v0 (from the app's catalog and the PYQ bank)

Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- System calls, processes, threads, inter-process communication, concurrency and synchronization.
- Deadlock.
- CPU and I/O scheduling.
- Memory management and virtual memory.
- File systems.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Deadlock | 6 topics ready, free | written (old standard; to be rewritten) |
| 02 | Processes and threads | 7 topics ready | written (old standard; to be rewritten) |
| 03 | CPU scheduling | 6 topics ready | written (old standard; to be rewritten) |
| 04 | Synchronisation | 7 topics ready | written (old standard; to be rewritten) |
| 05 | Memory management | 6 topics ready | written (old standard; to be rewritten) |
| 06 | Virtual memory | 5 topics ready | written (old standard; to be rewritten) |
| 07 | File systems and disk | 7 topics ready | written (old standard; to be rewritten) |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **78**; marks: **126** = **8.4%** of all 1500 marks (about 8.4 marks a paper).
- Forge (our own) questions for this subject: **30**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Memory Management and Virtual Memory | 21 | 37 | 2.47% | 10 | 2/13/6 | NAT2×11, MCQ1×3, MSQ2×1, MSQ1×2, MCQ2×4 |
| CPU and I/O Scheduling | 14 | 21 | 1.40% | 9 | 3/8/3 | NAT2×4, MCQ1×2, NAT1×3, MCQ2×3, MSQ1×2 |
| File Systems Operations & Disk Scheduling Optimization | 11 | 20 | 1.33% | 9 | 2/8/1 | NAT2×8, MSQ1×1, MCQ2×1, MCQ1×1 |
| Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks) | 11 | 20 | 1.33% | 9 | 1/8/2 | MSQ2×4, MCQ2×5, MCQ1×1, NAT1×1 |
| Deadlock Prevention, Avoidance, Detection, Recovery | 9 | 14 | 0.93% | 7 | 0/8/1 | MSQ1×2, NAT1×2, MSQ2×2, MCQ2×3 |
| System Calls, Processes, Threads, InterProcess Communication | 12 | 14 | 0.93% | 7 | 7/4/1 | NAT2×2, MSQ1×6, MCQ1×3, NAT1×1 |

### Question IDs by bank topic (so a reviewer can say which ones a lesson should use)

- **Deadlock Prevention, Avoidance, Detection, Recovery**: 2026_FN_Q29, 2026_FN_Q35, 2025_AN_Q48, 2022_FN_Q26, 2021_AN_Q13, 2019_FN_Q43, 2018_FN_Q34, 2018_FN_Q49, 2017_AN_Q42
- **File Systems Operations & Disk Scheduling Optimization**: 2026_FN_Q59, 2026_AN_Q53, 2025_FN_Q51, 2024_FN_Q39, 2024_AN_Q61, 2022_FN_Q63, 2021_FN_Q34, 2020_FN_Q40, 2019_FN_Q63, 2018_FN_Q63, 2017_AN_Q21
- **System Calls, Processes, Threads, InterProcess Communication**: 2026_FN_Q63, 2024_FN_Q12, 2024_FN_Q26, 2024_FN_Q53, 2024_AN_Q12, 2023_FN_Q22, 2023_FN_Q23, 2021_FN_Q60, 2020_FN_Q18, 2019_FN_Q29, 2017_FN_Q25, 2017_AN_Q14
- **CPU and I/O Scheduling**: 2026_FN_Q64, 2026_AN_Q23, 2025_FN_Q29, 2025_FN_Q38, 2025_AN_Q26, 2024_AN_Q54, 2023_FN_Q27, 2022_FN_Q42, 2021_FN_Q14, 2021_AN_Q29, 2020_FN_Q61, 2019_FN_Q51, 2017_FN_Q34, 2017_AN_Q57
- **Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)**: 2026_AN_Q51, 2024_FN_Q64, 2024_AN_Q44, 2023_FN_Q38, 2022_FN_Q19, 2021_FN_Q59, 2021_AN_Q41, 2020_FN_Q38, 2019_FN_Q32, 2018_FN_Q50, 2017_FN_Q61
- **Memory Management and Virtual Memory**: 2026_AN_Q54, 2026_AN_Q55, 2025_FN_Q14, 2025_FN_Q54, 2025_AN_Q47, 2025_AN_Q58, 2024_FN_Q50, 2024_AN_Q28, 2024_AN_Q47, 2023_FN_Q42, 2023_FN_Q57, 2023_FN_Q58, 2022_FN_Q38, 2022_FN_Q64, 2021_FN_Q31, 2021_AN_Q62, 2020_FN_Q14, 2020_FN_Q37, 2019_FN_Q42, 2018_FN_Q20, 2017_FN_Q36

## 4. What we need from this review

1. A **complete chapter and lesson list** for a beginner-first book on this subject (use the syllabus lines above, the standard books and what GATE really asks).
2. For each lesson: **finer points**, **GATE question patterns**, **diagrams needed**, **hand traces**, and which **prerequisite** a zero-level reader needs.
3. Which of the bank's topic labels map to which lesson, and which PYQs are **mis-labelled**.
4. A **weight tag** for each lesson ([MUST] / [SHOULD] / [LATER]) with a reason; do not invent frequencies; say "not sure".
5. The **question supply** needed: how many practice questions per lesson (20 for High-weight chapters, 10 for Low and foundation ones), and what types are missing in the bank.
