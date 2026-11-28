import type { Topic } from "@/lib/study/schema";

/**
 * Computer Organisation chapter O7 "Previous-year patterns and mixed practice" (29 Nov 2026). All 72 Computer Organisation questions of 2017 to 2026 in the bank, grouped by the chapter that solves them,
 * the patterns the paper uses with a method for each, and mixed practice across the book. Bank statistics (checked 29 Nov 2026): 72 questions, 115 marks (7.7 percent of 1500), 7 easy,
 * 53 medium and 12 hard; 24 MCQ, 10 MSQ and 38 NAT. Two worked edge examples join chapters (stalls from a cache and a branch predictor in one CPI; tag storage of a set-associative cache).
 */
export const chapterO7: Topic = {
  id: "cs.coa.v2.practice7",
  title: "Previous-year patterns and mixed practice",
  no: "O7",
  book: [
    { t: "p", text: "The bank holds 72 Computer Organisation questions from 2017 to 2026, worth 115 marks, about 7.7 percent of the 1500 marks in the bank. Only 12 are hard; 7 are easy and 53 are of medium difficulty. The striking fact is the number of numerical-answer questions: 38 of the 72 ask for a number, so the subject is mostly **calculation**, and a calculation is a skill that practice builds quickly." },
    { t: "p", text: "This last chapter lists every question under the chapter that solves it, names the patterns the paper uses, gives a method for each, and finishes with mixed practice. Use it in two ways: skim the pattern list before you start, and after each chapter come back to its row of the table and solve those questions without looking at the solutions." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["name the pattern of a Computer Organisation question at a glance;", "apply the standard method for each pattern within the time the paper allows;", "find the questions of any chapter, and the ones that come with a picture;", "combine ideas from different chapters in one answer."] },

    { t: "h2", text: "Where the marks are" },
    { t: "p", text: "The 72 questions fall into eight groups by the chapter that solves them: foundations 3, instructions and addressing 12, ALU and data path 3, pipelining 16, cache memory 27, main memory 2 and input and output 9. Two chapters, **cache and pipelining**, hold 43 of the 72 questions, nearly 60 percent, and most of the numerical-answer questions. They are the chapters to master first." },
    { t: "fig", id: "o7-f1" },
    { t: "p", text: "By type, there are 24 multiple-choice, 10 multiple-select and 38 numerical-answer questions. Multiple-select questions give no partial credit, and they are the ones to check option by option, as in the cache write policies and the hazard questions." },
    { t: "p", text: "A study order by value: first cache memory (O4) and pipelining (O3), which together carry the most marks; then instructions and addressing (O1), which is easy counting; then input and output (O6), which is mostly statements; and last the foundations, the data path and main memory." },

    { t: "h2", text: "Every question, by chapter" },
    { t: "p", text: "The table gives the year, shift and number of each question. A question that gives part of its data as a picture is marked (fig); it is solved in its chapter from the picture's values." },
    { t: "table", head: ["Chapter", "Questions"], rows: [
      ["O0 Foundations", "2025 AN Q28 · 2021 AN Q58 · 2018 FN Q15"],
      ["O1 Instructions and addressing", "2026 FN Q14, Q15 · 2026 AN Q44 · 2025 FN Q37 · 2024 AN Q43 (fig), Q49 · 2023 FN Q41 · 2021 FN Q38 (fig) · 2020 FN Q63 · 2018 FN Q61 · 2017 FN Q27, Q60 (fig)"],
      ["O2 ALU and data path", "2025 FN Q27 (fig) · 2025 AN Q32 · 2020 FN Q30 (fig)"],
      ["O3 Pipelining", "2026 FN Q16, Q60 (fig) · 2026 AN Q57 · 2025 AN Q56, Q61 (fig) · 2024 FN Q22, Q55 · 2024 AN Q25, Q56 · 2023 FN Q33 · 2022 FN Q61 · 2021 FN Q41 · 2021 AN Q59 · 2020 FN Q43 · 2018 FN Q60 · 2017 FN Q49"],
      ["O4 Cache memory", "2026 FN Q38 · 2026 AN Q52, Q56 · 2025 FN Q36, Q53 (fig) · 2025 AN Q39, Q55 · 2024 FN Q41, Q56 · 2023 FN Q64 · 2022 FN Q24, Q33, Q54 · 2021 FN Q51 · 2021 AN Q39, Q65 · 2020 FN Q27, Q55 · 2019 FN Q11, Q60 · 2018 FN Q44 · 2017 FN Q20, Q53, Q65 · 2017 AN Q36, Q39 (fig), Q47"],
      ["O5 Main memory", "2026 FN Q54 · 2018 FN Q33"],
      ["O6 I/O, interrupts, DMA", "2026 AN Q18 · 2025 FN Q11 · 2024 FN Q33 · 2024 AN Q24 · 2023 FN Q34 · 2022 FN Q17 · 2021 AN Q11 · 2020 FN Q33 · 2018 FN Q19"],
    ], caption: "All 72 Computer Organisation questions of the bank, by chapter." },

    { t: "h2", text: "The six patterns" },
    { t: "p", text: "Nearly every question is one of six patterns. Naming the pattern first takes seconds and tells you the tool." },
    { t: "ol", items: [
      "**Bit budget:** how many bits for the opcode, the immediate, the tag, the index? Tool: add the fixed fields, give what is left to the unknown; ⌈log₂ n⌉ for each count. Expanding opcodes: count in the smallest unit.",
      "**Pipeline time:** the time of n instructions on a k-stage pipeline. Tool: (k + n − 1) × (slowest stage + latch).",
      "**CPI and speedup:** stalls from hazards, branches and misses. Tool: CPI = ideal + (fraction) × (penalty), summed; time = CPI × cycle; speedup = old ÷ new, with the two clocks kept apart.",
      "**Average access time:** one or two cache levels. Tool: t₁ + m₁ (t₂ + m₂ t_mem); read whether the times already include the penalties.",
      "**Trace:** which accesses hit, which are evicted, which instructions depend. Tool: write the set or the register of each step and keep the contents.",
      "**Judge statements:** true or false facts on write policies, hazards, interrupts, DMA, RISC. Tool: the fact tables of the chapters; check every option of a multiple-select.",
    ] },
    { t: "fig", id: "o7-f2" },
    { t: "p", text: "Two habits save marks across all six patterns. **Convert units first**: ns against µs, MHz against cycles, K and M as powers of two. And **re-read what the question asks**: the total tag bits and the tag width, the time and the speedup, the stalls and the cycles are different numbers from the same data." },

    { t: "h2", text: "A method for each pattern" },
    { t: "p", text: "**Bit budget.** Draw the word as a row of boxes. Write the size of each known box, subtract from the total, and the remainder is the unknown. For a cache, the row is tag, index, offset and the total is the address length; the index is log₂ of the number of sets. Check the result by adding the boxes back up." },
    { t: "p", text: "**Pipeline time.** Find the slowest stage, add the latch, count k + n − 1 cycles and multiply. For a pipeline with a stage of several cycles (the PO stage of GATE 2018), the slow stage sets the total: fill, plus the busy time of the slow stage, plus drain." },
    { t: "p", text: "**CPI and speedup.** List every stall source as fraction × probability × cycles. Add them to 1. Multiply by the cycle time. Compare with the old machine's time per instruction, which is its cycles per instruction divided by its own clock frequency." },
    { t: "p", text: "**Average access time.** Draw the levels as boxes with their hit rates; work from the lowest level upward, replacing each miss penalty with the average time below it. The two forms (t_hit + m × penalty, and h × t_hit + (1 − h) × t_miss) agree when the question's times are read consistently." },
    { t: "p", text: "**Trace.** For a cache, compute the set of each address once, then walk the sequence keeping one line per set (or the LRU order within a set). For dependences, tabulate for each pair of instructions which register is read and which is written." },
    { t: "p", text: "**Judge statements.** Attach each statement to the table in its chapter: RAW is the only hazard of an in-order pipeline; write through has no dirty bit; a vectored interrupt starts its ISR faster; daisy chaining is priority, not polling; DMA is for bulk data. A word like 'always', 'never' or 'must' in a statement is a warning." },

    { t: "h2", text: "Mixed practice" },
    { t: "p", text: "Real questions rarely stay inside one chapter. The two examples below join two ideas each, in the way the paper does." },
    { t: "ex", id: "o7-e1" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    double cpi = 1.0                       /* ideal pipeline */
               + 0.25 * 0.04 * 50          /* loads and stores that miss the cache */
               + 0.15 * 0.20 * 3;          /* mispredicted branches */
    printf("%.2f\\n", cpi);
    return 0;
}`, out: "1.59", file: "mixed_cpi.c" },
    { t: "ex", id: "o7-e2" },
    { t: "code", text: `#include <stdio.h>
#include <math.h>

int main(void) {
    double cache = 16 * 1024, block = 64, ways = 4;
    int sets = (int)(cache / (block * ways));
    int tag = 32 - (int)log2(sets) - (int)log2(block);
    int lines = (int)(cache / block);
    printf("%d %d\\n", tag, lines * (tag + 1));     /* tag width, and tag plus valid bit for every line */
    return 0;
}`, out: "20 5376", file: "mixed_tags.c" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Time and the usual slips" },
    { t: "p", text: "The paper gives about three minutes per mark. A one-mark Computer Organisation question is normally a fact or a one-line count and should take under a minute; a two-mark calculation, four minutes at most. If the arithmetic runs past that, the pattern was probably misread, and a second look at the units usually repairs it." },
    { t: "p", text: "The slips that cost marks repeat from year to year. Using the sum of the stage delays instead of the slowest; forgetting the latch; mixing the clock of the old and the new machine; reading K as 1000 instead of 1024; reporting the speedup upside down; counting 5 bits for 50 registers; calling the tag width the total tag storage; and judging 'cache and memory are both updated' as write back when it is write through." },
    { t: "p", text: "For numerical answers, check the size of the result. A speedup above the number of pipeline stages is wrong; a hit time below the cache access time is wrong; an average CPI below the ideal CPI is wrong; a tag longer than the address is wrong. A thirty-second plausibility check catches most arithmetic errors." },
    { t: "p", text: "Finally, keep the solved examples of each chapter as templates. The paper reuses its structures: a two-level access time recurs with new numbers, an expanding-opcode question with a new set of registers, a cache trace with new addresses. A solved example of each pattern is worth more than a dozen unsolved ones." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["72 questions, 115 marks, 7.7 percent of the paper; 38 are numerical, so calculation is the core skill.", "Cache (27) and pipelining (16) hold 60 percent of the questions: learn them first.", "Six patterns: bit budget, pipeline time, CPI and speedup, average access time, trace, judge statements.", "Convert units first and re-read the question: tag width against total tag bits, time against speedup.", "Join chapters: CPI sums stalls from branches and from the cache; tag storage is lines times (tag + valid)."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "o7-f1", caption: "The 72 questions by chapter. Cache memory and pipelining together hold 43, almost 60 percent.", alt: "A table that lists the number of questions and marks in each chapter group.", fig: { kind: "trace", title: "Questions by chapter", cols: ["chapter", "questions"], rows: [
      { cells: ["O4 Cache memory", 27], tone: "ok" }, { cells: ["O3 Pipelining", 16], tone: "ok" }, { cells: ["O1 Instructions and addressing", 12] }, { cells: ["O6 I/O, interrupts, DMA", 9] }, { cells: ["O0 Foundations", 3] }, { cells: ["O2 ALU and data path", 3] }, { cells: ["O5 Main memory", 2] }, { cells: ["total", 72] },
    ] } },
    { type: "figure", id: "o7-f2", caption: "The six patterns, the chapter that teaches each and the one-line tool.", alt: "A table of the six question patterns with the chapter and the tool for each.", fig: { kind: "trace", title: "Pattern, chapter, tool", cols: ["pattern", "chapter", "tool"], rows: [
      { cells: ["bit budget", "O1, O4", "fixed fields, remainder to the unknown"] }, { cells: ["pipeline time", "O3", "(k + n − 1) × (slowest + latch)"] }, { cells: ["CPI and speedup", "O0, O3, O4", "1 + Σ fraction × penalty"] }, { cells: ["average access time", "O4", "t₁ + m₁(t₂ + m₂ t_mem)"] }, { cells: ["trace", "O3, O4", "set or register per step"] }, { cells: ["judge statements", "O3, O4, O6", "the fact tables"] },
    ] } },

    { type: "example", id: "o7-e1", level: "edge", title: "Mixed · a cache and a branch predictor in one CPI", file: "mixed_cpi.txt", given: `A pipeline has ideal CPI 1. 25% of the instructions are loads and stores, and 4% of those miss the data cache with a penalty of 50 cycles. 15% are branches, 20% of which are mispredicted at a cost of 3 cycles each. The CPI?`, find: "The CPI.", steps: [
      { say: "Cache stalls: 0.25 × 0.04 × 50.", result: "0.50" },
      { say: "Branch stalls: 0.15 × 0.20 × 3.", result: "0.09" },
      { say: "CPI = 1 + 0.50 + 0.09.", result: "1.59" },
    ], answer: "1.59", check: "The program in this chapter prints 1.59. This is the structure of GATE 2020 FN Q43." },
    { type: "example", id: "o7-e2", level: "edge", title: "Mixed · the tag storage of a set-associative cache", file: "mixed_tags.txt", given: `A 32-bit address, a 16 KB 4-way set-associative cache with 64-byte blocks. How wide is the tag, and how many bits do the tags and valid bits of the whole cache need?`, find: "The tag width and the total.", steps: [
      { say: "Sets = 16 KB ÷ (64 × 4) = 64: index 6 bits; offset 6 bits.", result: "12" },
      { say: "Tag = 32 − 12.", result: "20 bits" },
      { say: "Lines = 16 KB ÷ 64 = 256; each stores a tag and a valid bit.", result: "256 × 21" },
      { say: "256 × 21.", result: "5376 bits" },
    ], answer: "20 bits; 5376 bits", check: "The program prints 20 5376. The same count with no valid bit is GATE 2025 FN Q36." },

    { type: "trap", wrong: "Tag width and total tag bits are the same number.", tempting: "Both are called 'the tag'.", whyWrong: "The tag width is the bits in one tag (20 here). The total storage is that width times the number of lines (and a valid bit if the question counts one). GATE 2025 FN asks for the total: 6 bits per tag times 1024 lines is 6 × 2¹⁰ bits.", rule: "Read the unit of the answer: per tag, or for all of them.", ex: { text: "20 bits per tag; 256 lines × 21 bits = 5376 bits." } },

    { type: "gate", text: "This chapter lists all 72 Computer Organisation questions of the bank. Solve each chapter's row of the table without the solutions, then mix the chapters." },
    { type: "recall", cards: [
      { q: "How many questions and marks does Computer Organisation carry in the bank?", a: "72 questions, 115 marks, about 7.7 percent." },
      { q: "Which two chapters hold most of the questions?", a: "Cache memory (27) and pipelining (16)." },
      { q: "How many questions ask for a number?", a: "38 of the 72." },
      { q: "The first step of a bit-budget question?", a: "Add the fixed fields and subtract from the word." },
      { q: "Pipeline time?", a: "(k + n − 1) × (slowest stage + latch)." },
      { q: "CPI with stalls?", a: "1 + Σ fraction × probability × cycles." },
      { q: "Two-level access time?", a: "t₁ + m₁ (t₂ + m₂ t_mem)." },
      { q: "A warning word in a true-or-false statement?", a: "'always', 'never', 'must'." },
    ] },
    { type: "check", questions: [
      { id: "o7c1", kind: "NAT", marks: 1, q: "A 16-bit instruction has 8 registers; an instruction with 2 register operands and a 4-bit immediate has how many opcode bits?", answer: "6", solution: "16 − 3 − 3 − 4 = 6." },
      { id: "o7c2", kind: "NAT", marks: 2, q: "A 4-stage pipeline has stage delays 6, 9, 7 and 5 ns and a 1 ns latch. The time for 200 instructions in ns is", answer: "2030", solution: "Cycle 10 ns; (4 + 199) × 10 = 2030." },
      { id: "o7c3", kind: "NAT", marks: 2, q: "A pipeline has ideal CPI 1; 20% of instructions are loads that miss with probability 10% and a penalty of 30 cycles. The CPI is", answer: "1.6", solution: "1 + 0.2 × 0.1 × 30 = 1.6." },
      { id: "o7c4", kind: "NAT", marks: 2, q: "A cache has a hit time of 1 ns and a miss rate of 5%. The next level takes 10 ns with a local miss rate of 20%; memory costs 100 ns. The AMAT in ns is", answer: "2.5", solution: "1 + 0.05 × (10 + 0.2 × 100) = 1 + 0.05 × 30 = 2.5." },
      { id: "o7c5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["RAW is a hazard in an in-order pipeline", "Write through needs a dirty bit", "Daisy chaining assigns priorities", "DMA suits bulk transfers"], answer: "A, C, D", solution: "Write through has no dirty bit." },
      { id: "o7c6", kind: "NAT", marks: 2, q: "A 32-bit address, 8 KB direct-mapped cache with 32-byte blocks: the total bits of the tags of all lines are", answer: "4864", solution: "Offset 5, index 8, tag 19; 256 lines × 19 = 4864." },
      { id: "o7c7", kind: "MCQ", marks: 1, q: "How many of the 72 questions ask for a number?", options: ["10", "24", "38", "72"], answer: "C", solution: "38 numerical-answer questions." },
      { id: "o7c8", kind: "NAT", marks: 2, q: "A 3 GHz machine with CPI 1.5 is replaced by a 2 GHz machine with CPI 1.0. The speedup of the new over the old is", answer: "1", solution: "Old: 1.5 ÷ 3 GHz = 0.5 ns per instruction. New: 1.0 ÷ 2 GHz = 0.5 ns. The speedup is 1: the faster clock is cancelled by the lower CPI." },
    ] },
    { type: "practice", links: [{ label: "All real Computer Organisation questions", sub: "Computer Organisation", href: "/topics/computer-organization-and-architecture-coa" }, { label: "Cache memory", sub: "the biggest chapter", href: "/study/cache-memory" }] },
    { type: "links", prereq: ["Chapters O0 to O6"], usedIn: ["Revision before the paper"], cross: ["Operating Systems: virtual memory"] },
  ],
};
