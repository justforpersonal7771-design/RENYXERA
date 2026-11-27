# Computer Organisation: review merge and plan v1

Merged: Gemini (`gemini.md`, primary) and ChatGPT (`chatgpt-review-computer-organisation.md`, comparison). Every key and number named below was recomputed by a program on 28 Nov 2026 unless marked "reviewers agree".

## 1. How good were they
Both give the same spine (a foundation chapter, then instructions, ALU and control, pipelining, cache, memory, I/O) and the same top priority (cache, then pipelining, then instruction formats). Differences:
- **ChatGPT** is wrong on one item it calls FACT-DOUBT (2023_FN_Q64, below). It is right about the other wording defects and about the 2020_FN_Q27 dual key. Its plan has the finer lessons (F1 to F4 foundations, 60 to 90 minute lessons) and an I/O chapter.
- **Gemini** miscounts difficulty: it says 6 Easy / 53 Medium / 13 Hard and 37 NAT; the bank has **7 Easy / 53 Medium / 12 Hard and 38 NAT** (recounted from every question). Its marks tables are right (cache 47, pipelining 28, instructions 24 = 99 of 115 = 86%; cache is 41% of the subject).
- **Bank numbers (verified):** 72 questions, 115 marks (7.7% of 1500), 9 figure placeholders.

## 2. Data defects and checks (verified)
| Question | Problem | Status |
|---|---|---|
| 2023_FN_Q64 | ChatGPT says the key 19 needs a one-byte block. **Wrong.** Index plus offset bits always equal log2(64 KB / 8) = 13, so the tag is 32 − 13 = **19 for every block size** (checked at 1, 16, 64 and 256 bytes) | **Key correct, question complete** |
| 2026_FN_Q38 | The stem says K = 2^k but the options use L (L in {1,2,3}). Both reviewers flag it. Tag = 9 for direct mapped, 9 + k for K-way, so key A (N = M + L) holds when K = 2^L | Fix the stem (K = 2^L) |
| 2020_FN_Q27 | Block 256 B = 32 words, miss service 20 + 31 × 5 = 175 ns. AMAT = 3 + 0.06 × 175 = **13.5**, or 0.94 × 3 + 0.06 × 175 = **13.3**. The key accepts both | Keep both; the lesson shows both conventions |
| 2024_FN_Q55 | "Overhead for an additional core is 10 ns". Execution time 10 + 90/N + 10(N−1): N = 3 gives 60 (minimum). If the overhead is 10N the minimum is still N = 3 | Key 3 robust; clarify the wording |
| 2021_AN_Q59 | 16 cycles with forwarding, 30 without: 30/16 = 1.875, inside 1.87 to 1.88 | Key correct; state the write-then-read timing |
| Other numbers re-solved | 2017_FN_Q53 (82 misses = 6 compulsory + 76 conflict), 2026_AN_Q56 (128 KB), 2025_AN_Q32 (13 Booth operations), 2018_FN_Q33 (59.04%), 2017_AN_Q47 (L1 0.111, L2 0.0556), 2025_AN_Q56 (261.04 µs), 2026_AN_Q57 (2.34), 2018_FN_Q60 (219) | All keys correct |
| Figures | 9 missing: 2026_FN_Q60, 2025_FN_Q27, 2025_FN_Q53, 2025_AN_Q61, 2024_AN_Q43, 2021_FN_Q38, 2020_FN_Q30, 2017_AN_Q39, 2017_FN_Q60. Gemini says 2020_FN_Q30 is solvable from text; ChatGPT says path legality needs the figure | **Open**: restore all nine |
| Other keys | Both reviewers agree with the official key on all text-complete questions; we re-solved the ones above only | Keep |

## 3. Syllabus check
Official line: *Instruction set and addressing modes. Design of ALU. Design of control unit: hardwired and microprogrammed. Memory interfacing and hierarchy: performance, cache memory mapping. I/O interface (interrupt and DMA). Instruction pipelining, pipeline hazards.*
- Virtual memory, TLB and secondary storage are **not named**: tag [LEGACY-ASKED] (2026_FN_Q54 asks it) or [BEYOND]. ChatGPT already marks them [SHOULD].
- Floating point belongs to Digital Logic's line, not here.
- Both plans cover hardwired and microprogrammed control and memory interfacing (chip grids, decoders, interleaving, DRAM refresh).

## 4. The plan (merged)
**0 · Foundations** [Foundation]: bits and hex, bytes and words, endianness (2021_AN_Q58), registers and buses, time, frequency, CPI.
**1 · Instructions and addressing** [High, 14 q / 24 marks, 8 of 10 years]: instruction formats, expanding opcodes, addressing modes and effective address, assembly offsets.
**2 · ALU, datapath and control** [Foundation / Medium, 4 q / 4 marks but an explicit syllabus line]: arithmetic, Booth, datapath, hardwired and microprogrammed control.
**3 · Pipelining and hazards** [Very High, 16 q / 28 marks]: clock period and latch delay, structural, data and control hazards, forwarding, multi-cycle EX, speedup.
**4 · Cache memory** [Very High, 27 q / 47 marks, every year, 0 Easy]: tag, index, offset, direct, set and fully associative, LRU and conflict misses, write policies, AMAT, multilevel.
**5 · Main memory and interfacing** [Medium]: SRAM and DRAM, refresh, chip organisation, decoders, interleaving; virtual memory [LEGACY-ASKED].
**6 · I/O: interrupts and DMA** [Medium, 9 q / 9 marks, all 1-mark]: interrupt steps, vectored and daisy chain, cycle stealing, rates.
**7 · Previous-year practice** [Must].

## 5. Next steps
1. Fix the 2026_FN_Q38 stem; add the second accepted reading to 2020_FN_Q27.
2. Restore the nine figures (owner).
3. Correct the difficulty tallies if Gemini's table is reused anywhere.
4. Tag the 72 PYQs to lessons and pilot the cache chapter first (largest mark share).
