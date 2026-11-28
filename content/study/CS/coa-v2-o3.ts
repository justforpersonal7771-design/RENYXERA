import type { Topic } from "@/lib/study/schema";

/**
 * Computer Organisation chapter O3 "Instruction pipelining, performance and hazards" (29 Nov 2026). The five-stage pipeline, the time formula (k + n - 1) x cycle, the cycle set by the slowest stage plus
 * the latch, speedup against a non-pipelined machine, CPI with stalls, structural, data (RAW, WAR, WAW) and control hazards, forwarding, stages of unequal length, and the limit on a parallel speedup.
 * Real GATE questions (texts from public/data/questions.json), each re-solved here, 16 in all: 2026 FN Q16 (B), Q60 (95), 2026 AN Q57 (2.34), 2025 AN Q56 (261.04), Q61 (3.0), 2024 FN Q22 (A,B,C),
 * Q55 (3), 2024 AN Q25 (A), Q56 (3.0), 2023 FN Q33 (2040), 2022 FN Q61 (1.43), 2021 FN Q41 (17160), 2021 AN Q59 (1.88), 2020 FN Q43 (2.16), 2018 FN Q60 (219), 2017 FN Q49 (1.51).
 * Programs compiled and run with gcc: the time formula on three questions; the dependences of the 2024 sequence; a pipeline simulator for the 2021 question.
 */
export const chapterO3: Topic = {
  id: "cs.coa.v2.pipe3",
  title: "Instruction pipelining, performance and hazards",
  no: "O3",
  book: [
    { t: "p", text: "A processor that finishes one instruction completely before it starts the next leaves most of its hardware idle at any moment: while the instruction is being executed, the fetch unit has nothing to do. **Pipelining** puts the idle hardware to work. The instruction is cut into stages, each stage has its own hardware, and the stages work on different instructions at the same time, like the stations of an assembly line. In the steady state one instruction finishes every cycle." },
    { t: "p", text: "Pipelining is the largest topic of Computer Organisation in GATE. This chapter holds 16 real questions, about 25 of the 115 marks of the subject, and almost every one is an arithmetic exercise on three ideas: the time of a pipeline, the extra cycles caused by hazards, and the speedup over a machine without a pipeline. The method below solves all 16." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["compute the total time of n instructions on a k-stage pipeline from the slowest stage and the latch delay;", "compute the speedup of a pipeline over a non-pipelined design, with and without stalls;", "classify a hazard as structural, data (RAW, WAR, WAW) or control, and say which can occur in a simple in-order pipeline;", "say what forwarding fixes and what it cannot;", "handle stages that take more than one cycle, and count the stall cycles they cause;", "state the limit that a serial fraction puts on a parallel speedup."] },

    { t: "h2", text: "The five-stage pipeline" },
    { t: "p", text: "The classical RISC pipeline has five stages. **IF** (instruction fetch) reads the instruction from memory. **ID** (instruction decode) decodes it and reads the registers. **EX** (execute) uses the ALU, for arithmetic or to compute an address. **MEM** (memory access) reads or writes the data memory for a load or a store. **WB** (write back) puts the result in a register. Between consecutive stages there is a **latch** (an interstage buffer) that holds what the instruction carries from one stage to the next." },
    { t: "p", text: "Each stage takes one **clock cycle**, so an instruction needs k cycles from start to finish, where k is the number of stages. Latency is unchanged (still k cycles), but the next instruction begins one cycle behind the first, so after the pipeline fills one instruction completes in every cycle. That is the gain: **throughput**, not the time of a single instruction." },
    { t: "fig", id: "o3-f1" },
    { t: "p", text: "In the figure, instruction 1 is in WB in cycle 5 while instruction 2 is in MEM, 3 in EX, 4 in ID and 5 in IF: all five stages are busy. The first four cycles are the **fill**, and cycles after the last fetch are the **drain**, in which stages go idle again." },

    { t: "h2", text: "The time of a pipeline" },
    { t: "p", text: "A pipeline can go no faster than its slowest stage, because every stage must finish before the latches load. So the **clock cycle** is **the slowest stage delay plus the latch delay**: cycle = max(stage delay) + latch." },
    { t: "p", text: "The first instruction needs k cycles to come out. After that one instruction comes out every cycle, so the remaining n − 1 instructions need n − 1 more cycles. The total is **(k + n − 1) cycles**, and the time is (k + n − 1) × cycle. Without a pipeline, each instruction takes the sum of all the stage delays, and the n instructions take n times that." },
    { t: "callout", kind: "key", text: "Pipeline time = (k + n − 1) × (max stage delay + latch delay). Steady-state throughput is one instruction per cycle. Speedup = non-pipelined time ÷ pipelined time, at most k." },
    { t: "p", text: "Apply it. GATE 2023: a 3-stage pipeline with delays 10, 20 and 14 ns, no latch delay, 100 instructions. The cycle is 20 ns; the time is (3 + 99) × 20 = **2040 ns**. GATE 2021: stage delays 150, 120, 150, 160, 140 ns with a 5 ns latch between stages: the cycle is 160 + 5 = 165 ns; the time for 100 instructions is (5 + 99) × 165 = **17 160 ns**. GATE 2025: stage delays 180, 250, 150, 170, 250 ns and a 10 ns latch, 1000 instructions: the cycle is 250 + 10 = 260 ns; the time is (5 + 999) × 260 = 261 040 ns = **261.04 µs**." },
    { t: "code", text: `#include <stdio.h>

static double pipe_time(int k, int n, double cycle) { return (k + n - 1) * cycle; }

int main(void) {
    printf("%.2f ", pipe_time(5, 1000, 250 + 10) / 1000.0);     /* GATE 2025 AN Q56 in microseconds */
    printf("%.0f ", pipe_time(3, 100, 20));                      /* GATE 2023 FN Q33 */
    printf("%.0f\\n", pipe_time(5, 100, 160 + 5));                /* GATE 2021 FN Q41 */
    return 0;
}`, out: "261.04 2040 17160", file: "pipeline_time.c" },
    { t: "ex", id: "o3-e1" },
    { t: "ex", id: "o3-e2" },
    { t: "ex", id: "o3-e3" },
    { t: "p", text: "When a stage is split to shorten the clock, the number of stages grows and the cycle shrinks to the new longest stage. GATE 2017 compares a naive five-stage pipeline (stages 5, 4, 20, 10, 3 ns, latch 2 ns, so the cycle is 20 + 2 = 22 ns) with an efficient six-stage one in which the 20 ns stage is split into 12 and 8 (the longest is now 12, so the cycle is 14 ns). For 20 instructions the naive time is (5 + 19) × 22 = 528 ns and the efficient time is (6 + 19) × 14 = 350 ns; the speedup is 528 ÷ 350 = **1.51**." },
    { t: "ex", id: "o3-e4" },

    { t: "h2", text: "Speedup and cycles per instruction" },
    { t: "p", text: "A pipelined machine with no stalls has a CPI of 1. When stalls occur, each stall cycle is a cycle in which no instruction completes, so the **average CPI = 1 + (stall cycles per instruction)**. For a fraction f of the instructions that each stall s cycles, the stall term is f × s; if there are several kinds, add them." },
    { t: "p", text: "The time per instruction is then CPI × cycle time, and the speedup over a non-pipelined machine that needs a time T per instruction is **T ÷ (CPI × cycle time)**. The non-pipelined machine has no stalls, so its time per instruction is its cycles per instruction divided by its clock frequency. Keep the two clock frequencies apart: the pipeline often runs slower than the machine it replaces because of the latch overhead." },
    { t: "p", text: "GATE 2026 AN: the old machine takes 5 cycles at 1.6 GHz, so 5 ÷ 1.6 = 3.125 ns per instruction. The pipelined one runs at 1.2 GHz with 30% of the instructions stalling 2 cycles: CPI = 1 + 0.3 × 2 = 1.6, so 1.6 ÷ 1.2 = 1.333 ns per instruction. The speedup is 3.125 ÷ 1.333 = **2.34**." },
    { t: "p", text: "GATE 2024 AN: 6 cycles at 2 GHz is 3 ns. The pipeline at 2 GHz has stalls of 0.2 × 2 + 0.2 × 3 = 1.0 per instruction, so CPI = 2 and the time is 1 ns: speedup **3.0**. GATE 2020: 5 cycles at 2.5 GHz is 2 ns. The pipeline at 2 GHz (0.5 ns per cycle) has stall cycles 0.3 × 0.05 × 50 = 0.75 from the cache misses and 0.1 × 0.5 × 2 = 0.1 from the branches: CPI = 1.85, time 0.925 ns; speedup 2 ÷ 0.925 = **2.16**." },
    { t: "ex", id: "o3-e5" },
    { t: "ex", id: "o3-e6" },
    { t: "ex", id: "o3-e7" },
    { t: "p", text: "A table of instruction types works the same way: the average CPI is the sum of (count × CPI) divided by the total count, and the time is the number of cycles times the cycle length. GATE 2025 gives 6.4 × 10⁸ instructions (2.25, 1.20, 1.65 and 1.30 × 10⁸ of CPI 2, 5, 4 and 3) in 6.3 s. The cycles are 4.5 + 6.0 + 6.6 + 3.9 = 21.0 × 10⁸, so the cycle is 6.3 ÷ (21 × 10⁸) = **3.0 ns**." },
    { t: "ex", id: "o3-e8" },

    { t: "h2", text: "Hazards" },
    { t: "p", text: "A **hazard** is a situation that stops the next instruction from running in its slot. The pipeline then **stalls**: it inserts a bubble (a cycle in which a stage does nothing) and the instruction is delayed. There are three kinds." },
    { t: "p", text: "A **structural hazard** is a clash for hardware: two instructions need the same unit in the same cycle. The classic one is a single memory used for both instruction fetch and data access, so a load in MEM collides with the fetch of a later instruction. The cure is more hardware (separate instruction and data memories or caches) or a stall." },
    { t: "p", text: "A **data hazard** arises when an instruction needs a value that an earlier instruction has not yet produced. There are three types of dependency between instructions that use the same register: **RAW** (read after write, a **true dependence**: the later instruction reads what the earlier one writes), **WAR** (write after read, an **anti-dependence**: the later instruction writes what the earlier one reads) and **WAW** (write after write, an **output dependence**: both write the same register). In a simple in-order pipeline that reads in ID and writes in WB, **only RAW can cause a hazard**: WAR and WAW cannot because the reads and writes stay in program order. They become hazards when instructions can complete out of order. So GATE 2026's question has the answer **read-after-write**." },
    { t: "p", text: "A **control hazard** is caused by a branch: the pipeline fetches the instructions after the branch before it knows whether the branch is taken, and if it is taken the fetched instructions are wrong and are **flushed**. The cost is the branch penalty, the number of cycles lost per taken branch. A **branch predictor** guesses the direction; a correct guess costs nothing and a wrong guess pays the full penalty." },
    { t: "table", head: ["Hazard", "Cause", "Typical cure"], rows: [
      ["Structural", "two instructions need one unit", "duplicate the unit, or stall"], ["Data: RAW", "reads a value not yet written", "forwarding, then stall if needed"],
      ["Data: WAR, WAW", "writes in the wrong order (out-of-order only)", "register renaming"], ["Control", "branch outcome unknown", "prediction, early branch resolution, delay slot"],
    ], caption: "The three kinds of hazard." },
    { t: "ex", id: "o3-e9" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Dependencies in a sequence" },
    { t: "p", text: "A common question lists four or five instructions and asks which dependencies exist. Do it mechanically. For every pair of instructions (earlier I, later J) and every register, write down whether I reads or writes it and whether J reads or writes it. **I writes, J reads: RAW. I reads, J writes: WAR. Both write: WAW.** Two reads are no dependency." },
    { t: "p", text: "GATE 2024 gives I1: DIV R3, R1, R2; I2: SUB R5, R3, R4; I3: ADD R3, R5, R6; I4: MUL R7, R3, R8. Register R3 is written by I1 and I3 and read by I2 and I4. Pair by pair: I1 and I2 are RAW (I1 writes, I2 reads), I1 and I3 are WAW, I1 and I4 are RAW, I2 and I3 are WAR (I2 reads R3, I3 writes it), I2 and I4 are two reads (none), and I3 and I4 are RAW. The statements: A (RAW on R3, I1 to I2) is true; B (WAR between I1 and I2) is false; C (RAW on R3 between I2 and I3) is false, since I2 and I3 share R5 as RAW but on R3 they are WAR; D (WAW on R3 between I3 and I4) is false, since I4 only reads it. The answer is **A only**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    /* registers read and written by I1 to I4, for register R3 */
    int reads[4]  = {0, 1, 0, 1};     /* I2 and I4 read R3 */
    int writes[4] = {1, 0, 1, 0};     /* I1 and I3 write R3 */
    for (int i = 0; i < 4; i++)
        for (int j = i + 1; j < 4; j++) {
            if (writes[i] && reads[j])  printf("I%d I%d RAW\\n", i + 1, j + 1);
            if (reads[i] && writes[j])  printf("I%d I%d WAR\\n", i + 1, j + 1);
            if (writes[i] && writes[j]) printf("I%d I%d WAW\\n", i + 1, j + 1);
        }
    return 0;
}`, out: "I1 I2 RAW\nI1 I3 WAW\nI1 I4 RAW\nI2 I3 WAR\nI3 I4 RAW", file: "dependences.c" },
    { t: "ex", id: "o3-e10" },

    { t: "h2", text: "Forwarding and the stalls that remain" },
    { t: "p", text: "A RAW dependence between two adjacent instructions stalls the pipeline for two cycles in the simple scheme, because the second instruction waits in ID until the first has written its result in WB. **Forwarding** (also called **bypassing**) removes most of the wait. The ALU result of the first instruction is carried straight from the output of the EX (or MEM) stage back to the input of the EX stage of the next instruction, without waiting for the write back." },
    { t: "p", text: "Forwarding needs **extra hardware**: wires from the stage outputs, multiplexers at the ALU inputs, and comparators that notice when a source register matches the destination of an instruction still in the pipeline. It does not stop all stalls: a **load** produces its value only at the end of MEM, so an instruction that needs it in the next cycle still waits one cycle (the load-use hazard). So the true statements of GATE 2024 FN are **A** (the result of a stage of an earlier instruction is passed to a stage of a later one), **B** (MEM output to the EX input of the next instruction) and **C** (forwarding cannot prevent all stalls); D (no extra hardware) is false." },
    { t: "ex", id: "o3-e11" },
    { t: "fig", id: "o3-f2" },
    { t: "p", text: "Where operands are read matters for the count. GATE 2021 has a pipeline in which the ID stage only decodes and **the register read happens in the EX stage**, and the EX stage takes one cycle for ADD and two for MUL. Without forwarding an instruction must wait until the earlier instruction that produces its operand has finished its WB before it reads in EX. With forwarding, it can start its EX in the cycle right after the producer's EX ends. The eight instructions ADD, MUL, ADD, MUL, … each depend on the one before." },
    { t: "p", text: "Counting by hand is error-prone, so this chapter's program simulates it. Each instruction enters a stage when its own previous stage is done and the previous instruction has left that stage; the EX stage also waits for the operand. It prints 30 cycles without forwarding, 16 with, and the speedup 30 ÷ 16 = 1.875, which rounds to **1.88** (the official key accepts 1.87 to 1.88)." },
    { t: "code", text: `#include <stdio.h>
#define N 8
#define S 5

static int run(int fwd) {
    int ex_len[N], start[N][S], end[N][S];
    for (int i = 0; i < N; i++) ex_len[i] = (i % 2 == 0) ? 1 : 2;      /* ADD takes 1 cycle in EX, MUL takes 2 */
    for (int i = 0; i < N; i++)
        for (int s = 0; s < S; s++) {
            int t = 1;
            if (s > 0) t = end[i][s - 1] + 1;                            /* after its own previous stage */
            if (i > 0 && s < S - 1 && start[i - 1][s + 1] > t) t = start[i - 1][s + 1];   /* the stage must be empty */
            if (i > 0 && s == S - 1 && end[i - 1][s] + 1 > t) t = end[i - 1][s] + 1;
            if (s == 2 && i > 0) {                                       /* wait for the operand */
                int ready = fwd ? end[i - 1][2] + 1 : end[i - 1][4] + 1; /* forwarded after EX, else after WB */
                if (ready > t) t = ready;
            }
            start[i][s] = t;
            end[i][s] = t + (s == 2 ? ex_len[i] : 1) - 1;
        }
    return end[N - 1][S - 1];
}

int main(void) {
    int a = run(0), b = run(1);
    printf("%d %d %.3f\\n", a, b, (double)a / b);
    return 0;
}`, out: "30 16 1.875", file: "forwarding_sim.c" },
    { t: "ex", id: "o3-e12" },

    { t: "h2", text: "Stages of unequal length and stalls from a long stage" },
    { t: "p", text: "In a real pipeline some operations take longer than a cycle: a floating-point divide, or a memory read that misses the cache. With a single EX unit that is not itself pipelined, an instruction that needs c cycles in EX holds the stage for c cycles and the instructions behind it wait c − 1 extra cycles. This is a **structural hazard** in the EX stage." },
    { t: "p", text: "GATE 2026 gives a table of the EX time of each instruction type for a 100-instruction program, with a clock cycle of 1 ns. An operation of t ns needs ⌈t⌉ cycles, and the extra stall cycles per instruction are ⌈t⌉ − 1: LOAD 1.8 ns takes 2 cycles, 15 instructions, 15 stall cycles; IMUL 1.5: 2, 10 → 10; IDIV 2.5: 3, 5 → 10; FADD 1.7: 2, 10 → 10; FSUB 1.7: 2, 5 → 5; FMUL 2.8: 3, 15 → 30; FDIV 3.2: 4, 5 → 15; the 35 instructions under 1 ns need no stall. The total is 15 + 10 + 10 + 10 + 5 + 30 + 15 = **95** cycles." },
    { t: "fig", id: "o3-f3" },
    { t: "p", text: "GATE 2018 puts the variable time in one stage of a five-stage pipeline: IF, ID, OF and WB take 1 cycle each, the PO stage takes 3 cycles for 40 instructions, 2 for 35 and 1 for 25. The PO stage is the bottleneck: it is busy for 40 × 3 + 35 × 2 + 25 × 1 = 215 cycles without a break, the pipeline needs 3 cycles to fill before the first PO starts (IF, ID, OF) and 1 cycle for the last write back, so the total is 3 + 215 + 1 = **219** cycles." },
    { t: "ex", id: "o3-e13" },

    { t: "h2", text: "The limit of a parallel speedup" },
    { t: "p", text: "Pipelining is one kind of parallelism; running a program on several cores is another. Here the limit is **Amdahl's law**: a part of the program that cannot be parallelised, plus an overhead for every extra core, caps the gain, and adding cores beyond a point makes the program slower." },
    { t: "p", text: "GATE 2024: a program takes 100 ns on one core; 90 ns of it parallelises perfectly; each extra core costs 10 ns of overhead. On n cores the time is 10 (serial part) + 90 ÷ n + 10 × (n − 1). For n = 1: 100; n = 2: 10 + 45 + 10 = 65; n = 3: 10 + 30 + 20 = 60; n = 4: 10 + 22.5 + 30 = 62.5; n = 5: 10 + 18 + 40 = 68. The minimum is at **3 cores**." },
    { t: "ex", id: "o3-e14" },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["k stages, n instructions: (k + n − 1) cycles; cycle = slowest stage + latch; speedup at most k.", "Average CPI = 1 + stall cycles per instruction; time per instruction = CPI × cycle time; speedup = T_old ÷ (CPI × cycle).", "Keep the clock of the old and the pipelined machine apart; a table of instruction types gives the average CPI by weighting.", "Hazards: structural (hardware clash), data (RAW true; WAR and WAW only out of order), control (branches).", "RAW: earlier writes, later reads. WAR: earlier reads, later writes. WAW: both write.", "Forwarding sends the ALU or MEM output to the next EX input; it needs extra hardware and cannot remove the load-use stall.", "A stage of t ns on a 1 ns clock needs ⌈t⌉ cycles and stalls ⌈t⌉ − 1; a bottleneck stage sets the total: fill + busy time + drain.", "Parallel time = serial + parallel ÷ n + overhead; find the minimum by trying n."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "o3-f1", caption: "Five instructions through the five stages. Instruction 1 finishes in cycle 5, and one more finishes every cycle after: five instructions in 9 cycles, (5 + 5 − 1).", alt: "A table with a row for each cycle showing which instruction is in each of the five stages.", fig: { kind: "trace", title: "Which instruction is in which stage", cols: ["cycle", "IF", "ID", "EX", "MEM", "WB"], rows: [
      { cells: [1, "I1", "", "", "", ""] }, { cells: [2, "I2", "I1", "", "", ""] }, { cells: [3, "I3", "I2", "I1", "", ""] }, { cells: [4, "I4", "I3", "I2", "I1", ""] }, { cells: [5, "I5", "I4", "I3", "I2", "I1"], tone: "ok" }, { cells: [6, "", "I5", "I4", "I3", "I2"] }, { cells: [7, "", "", "I5", "I4", "I3"] }, { cells: [8, "", "", "", "I5", "I4"] }, { cells: [9, "", "", "", "", "I5"] },
    ] } },
    { type: "figure", id: "o3-f2", caption: "A dependent pair, ADD R1 then SUB R2 using R1. Without forwarding the SUB waits in ID for two cycles until R1 is written; with forwarding the ALU result goes straight to the next EX and there is no stall.", alt: "Two timing tables of the same two instructions, one without and one with forwarding.", fig: { kind: "trace", title: "ADD R1,R2,R3 then SUB R4,R1,R5", cols: ["cycle", "no forwarding: ADD", "SUB", "forwarding: ADD", "SUB"], rows: [
      { cells: [1, "IF", "", "IF", ""] }, { cells: [2, "ID", "IF", "ID", "IF"] }, { cells: [3, "EX", "ID (stall)", "EX", "ID"], tone: "bad" }, { cells: [4, "MEM", "ID (stall)", "MEM", "EX (forwarded)"], tone: "bad" }, { cells: [5, "WB", "EX", "WB", "MEM"] }, { cells: [6, "", "MEM", "", "WB"] }, { cells: [7, "", "WB", "", ""] },
    ] } },
    { type: "figure", id: "o3-f3", caption: "The structural stalls of GATE 2026 FN Q60 by instruction type: ⌈t⌉ − 1 extra cycles each, times the number of instructions. The total is 95.", alt: "A table of the EX time, the cycles it needs, the stall cycles per instruction and the total stall cycles for each instruction type.", fig: { kind: "trace", title: "EX stage on a 1 ns clock", cols: ["type", "tEX (ns)", "cycles", "extra", "M", "stalls"], rows: [
      { cells: ["LOAD", 1.8, 2, 1, 15, 15] }, { cells: ["IMUL", 1.5, 2, 1, 10, 10] }, { cells: ["IDIV", 2.5, 3, 2, 5, 10] }, { cells: ["FADD", 1.7, 2, 1, 10, 10] }, { cells: ["FSUB", 1.7, 2, 1, 5, 5] }, { cells: ["FMUL", 2.8, 3, 2, 15, 30] }, { cells: ["FDIV", 3.2, 4, 3, 5, 15] }, { cells: ["others", "< 1.0", 1, 0, 35, 0] }, { cells: ["total", "", "", "", 100, 95], tone: "ok" },
    ] } },

    { type: "example", id: "o3-e1", level: "gate", title: "GATE CS 2023 (forenoon), Q33 · 1 mark · three stages, 100 instructions", file: "gate2023_fn_q33.txt", given: `A 3-stage pipelined processor with delays 10 ns, 20 ns and 14 ns; no other delay, no hazards, one instruction fetched every cycle. The total time for 100 instructions in ns?`, find: "The total time.", steps: [
      { say: "The cycle is the slowest stage: 20 ns.", result: "20" },
      { say: "Cycles = 3 + 99.", result: "102" },
      { say: "Time = 102 × 20.", result: "2040" },
    ], answer: "2040", check: "The program in this chapter prints 2040." },
    { type: "example", id: "o3-e2", level: "gate", title: "GATE CS 2021 (forenoon), Q41 · 2 marks · stage delays and 5 ns latches", file: "gate2021_fn_q41.txt", given: `A five-stage pipeline with stage delays 150, 120, 150, 160, 140 ns and 5 ns registers between the stages. The time for 100 independent instructions with no stalls?`, find: "The time in ns.", steps: [
      { say: "The slowest stage is 160 ns; add the 5 ns register.", result: "165" },
      { say: "Cycles = 5 + 99 = 104.", result: "104" },
      { say: "Time = 104 × 165.", result: "17160" },
    ], answer: "17160", check: "The latch delay is added to the cycle, not to the total." },
    { type: "example", id: "o3-e3", level: "gate", title: "GATE CS 2025 (afternoon), Q56 · 2 marks · 1000 instructions in microseconds", file: "gate2025_an_q56.txt", given: `Stage delays 180, 250, 150, 170, 250 ns; inter-stage latch 10 ns; no stalls. The time to process 1000 instructions, in microseconds?`, find: "The time in µs.", steps: [
      { say: "Cycle = 250 + 10.", result: "260 ns" },
      { say: "Cycles = 5 + 999 = 1004.", result: "1004" },
      { say: "Time = 1004 × 260 ns = 261 040 ns.", result: "261.04 µs" },
    ], answer: "261.04", check: "Convert ns to µs at the end: divide by 1000." },
    { type: "example", id: "o3-e4", level: "gate", title: "GATE CS 2017 (forenoon), Q49 · 2 marks · splitting the slow stage", file: "gate2017_fn_q49.txt", given: `Stages IF 5, ID 4, OF 20, EX 10, WB 3 ns; 2 ns buffer between stages. NP: five stages. EP: OF split into OF1 12 ns and OF2 8 ns. The speedup of EP over NP for 20 independent instructions, no hazards?`, find: "The speedup.", steps: [
      { say: "NP: cycle = 20 + 2 = 22; time = (5 + 19) × 22.", result: "528 ns" },
      { say: "EP: cycle = 12 + 2 = 14; time = (6 + 19) × 14.", result: "350 ns" },
      { say: "Speedup = 528 ÷ 350.", result: "1.51" },
    ], answer: "1.51", check: "More stages shorten the cycle but add fill cycles; for 20 instructions the cycle wins." },
    { type: "example", id: "o3-e5", level: "gate", title: "GATE CS 2026 (afternoon), Q57 · 2 marks · a slower clock and 30% stalls", file: "gate2026_an_q57.txt", given: `A non-pipelined unit at 1.6 GHz takes 5 cycles per instruction. The pipelined version runs at 1.2 GHz; 30% of instructions stall 2 cycles. The speedup?`, find: "The speedup to two decimals.", steps: [
      { say: "Old: 5 ÷ 1.6 GHz.", result: "3.125 ns" },
      { say: "New CPI = 1 + 0.3 × 2.", result: "1.6" },
      { say: "New: 1.6 ÷ 1.2 GHz.", result: "1.333 ns" },
      { say: "Speedup = 3.125 ÷ 1.333.", result: "2.34" },
    ], answer: "2.34", check: "Ignoring the slower clock would give 5 ÷ 1.6 = 3.13." },
    { type: "example", id: "o3-e6", level: "gate", title: "GATE CS 2024 (afternoon), Q56 · 2 marks · data and control stalls", file: "gate2024_an_q56.txt", given: `A non-pipelined unit at 2 GHz takes 6 cycles per instruction. It is redesigned as a 5-stage pipeline at 2 GHz with ideal throughput 1 per cycle. 20% of the instructions stall 2 cycles for data hazards and 20% stall 3 cycles for control hazards. The speedup to one decimal?`, find: "The speedup.", steps: [
      { say: "Stall cycles per instruction: 0.2 × 2 + 0.2 × 3.", result: "1.0" },
      { say: "CPI = 1 + 1.0 = 2; same clock, so the time per instruction is 2 cycles against 6.", result: "2 vs 6" },
      { say: "Speedup = 6 ÷ 2.", result: "3.0" },
    ], answer: "3.0", check: "Same clock, so the speedup is the ratio of the CPIs." },
    { type: "example", id: "o3-e7", level: "gate", title: "GATE CS 2020 (forenoon), Q43 · 2 marks · cache misses and branches", file: "gate2020_fn_q43.txt", given: `A non-pipelined processor at 2.5 GHz takes 5 cycles per instruction. A 5-stage pipeline of it runs at 2 GHz. The program: 30% memory instructions, 60% ALU, 10% branch. 5% of memory instructions stall 50 cycles; 50% of branches stall 2 cycles. The speedup to two decimals?`, find: "The speedup.", steps: [
      { say: "Old: 5 ÷ 2.5 GHz.", result: "2 ns" },
      { say: "Stall cycles: 0.3 × 0.05 × 50 + 0.1 × 0.5 × 2 = 0.75 + 0.1.", result: "0.85" },
      { say: "CPI = 1.85; time = 1.85 ÷ 2 GHz.", result: "0.925 ns" },
      { say: "Speedup = 2 ÷ 0.925.", result: "2.16" },
    ], answer: "2.16", check: "Multiply the three fractions for each stall source: share of instructions, share that stall, cycles." },
    { type: "example", id: "o3-e8", level: "gate", title: "GATE CS 2025 (afternoon), Q61 · 2 marks · the clock period from a table", file: "gate2025_an_q61.txt", given: `An application runs 6.4 × 10⁸ instructions in 6.3 s. Types: Branch CPI 2 (2.25 × 10⁸), Load CPI 5 (1.20 × 10⁸), Store CPI 4 (1.65 × 10⁸), Arithmetic CPI 3 (1.30 × 10⁸). The clock period in ns to one decimal?`, find: "The clock period.", steps: [
      { say: "Cycles: 2.25 × 2 + 1.20 × 5 + 1.65 × 4 + 1.30 × 3 = 4.5 + 6.0 + 6.6 + 3.9 (× 10⁸).", result: "21 × 10⁸" },
      { say: "Period = 6.3 s ÷ 21 × 10⁸ cycles.", result: "3.0 ns" },
    ], answer: "3.0", check: "The counts add to 6.4 × 10⁸, as stated." },
    { type: "example", id: "o3-e9", level: "gate", title: "GATE CS 2026 (forenoon), Q16 · 1 mark · which dependence causes a data hazard", file: "gate2026_fn_q16.txt", given: `Which dependency among register operands of different instructions can cause a data hazard in a pipelined processor?
A) read-after-read   B) read-after-write   C) write-after-read   D) write-after-write`, find: "The dependency.", steps: [
      { say: "Two reads never conflict.", result: "A: no" },
      { say: "In an in-order pipeline that reads early and writes late, a later instruction reads a value an earlier one has not yet written.", result: "RAW: hazard" },
      { say: "WAR and WAW cannot reorder in an in-order pipeline.", result: "C, D: no" },
    ], answer: "B", check: "WAR and WAW matter only when instructions can finish out of order." },
    { type: "example", id: "o3-e10", level: "gate", title: "GATE CS 2024 (afternoon), Q25 · 1 mark · MSQ: dependences in four instructions", file: "gate2024_an_q25.txt", given: `I1: DIV R3,R1,R2   I2: SUB R5,R3,R4   I3: ADD R3,R5,R6   I4: MUL R7,R3,R8. Which statements are true?
A) RAW on R3 between I1 and I2   B) WAR on R3 between I1 and I2   C) RAW on R3 between I2 and I3   D) WAW on R3 between I3 and I4`, find: "The true statements.", steps: [
      { say: "I1 writes R3, I2 reads R3: RAW.", result: "A true" },
      { say: "B calls the same pair WAR; that needs I2 to write what I1 reads, which it does not.", result: "B false" },
      { say: "I2 reads R3 and I3 writes it: WAR on R3. (The RAW between I2 and I3 is on R5.)", result: "C false" },
      { say: "I4 only reads R3.", result: "D false" },
    ], answer: "A", check: "The program in this chapter lists the five pairs." },
    { type: "example", id: "o3-e11", level: "gate", title: "GATE CS 2024 (forenoon), Q22 · 1 mark · MSQ: statements about forwarding", file: "gate2024_fn_q22.txt", given: `A 5-stage pipeline IF, ID, EX, MEM, WB. Which statements about forwarding are correct?
A) a result from a stage of an earlier instruction is passed to a stage of a later instruction   B) the output of MEM can be passed to the input of EX of the next instruction   C) forwarding cannot prevent all stalls   D) forwarding needs no extra hardware`, find: "The correct statements.", steps: [
      { say: "A is the definition of forwarding.", result: "A true" },
      { say: "MEM to EX is the load result forwarded to the next instruction.", result: "B true" },
      { say: "A load-use pair still stalls one cycle.", result: "C true" },
      { say: "Forwarding adds wires, multiplexers and comparators.", result: "D false" },
    ], answer: "A, B, C", check: "Any option that says forwarding is free or removes every stall is false." },
    { type: "example", id: "o3-e12", level: "gate", title: "GATE CS 2021 (afternoon), Q59 · 2 marks · the forwarding speedup on ADD and MUL", file: "gate2021_an_q59.txt", given: `Stages IF, ID, EX, MEM, WB. ID only decodes; the register read happens in EX. EX takes 1 cycle for ADD and 2 for MUL. The instructions ADD, MUL, ADD, MUL, ADD, MUL, ADD, MUL; each depends on the one before. Speedup = time without forwarding ÷ time with forwarding, to two decimals?`, find: "The speedup.", steps: [
      { say: "Without forwarding each instruction reads in EX only after the previous instruction's WB: the simulator gives 30 cycles.", result: "30" },
      { say: "With forwarding each starts its EX right after the previous EX ends: 16 cycles.", result: "16" },
      { say: "Speedup = 30 ÷ 16 = 1.875.", result: "1.88" },
    ], answer: "1.88 (the key accepts 1.87 to 1.88)", check: "The simulator of this chapter prints 30 16 1.875." },
    { type: "example", id: "o3-e13", level: "gate", title: "GATE CS 2018 (forenoon) Q60 and 2026 (forenoon) Q60 · 2 marks each · a bottleneck stage", file: "gate2018_fn_q60.txt", given: `IF, ID, OF, PO, WB. IF, ID, OF, WB take 1 cycle; of 100 instructions, 40 take 3 cycles in PO, 35 take 2, 25 take 1. No hazards. The number of cycles for the sequence? (For 2026: the stall cycles from the table, 95.)`, find: "The cycles.", steps: [
      { say: "PO is busy for 40 × 3 + 35 × 2 + 25 × 1.", result: "215" },
      { say: "Before the first PO: IF, ID, OF = 3 cycles. After the last PO: WB = 1.", result: "3 + 1" },
      { say: "Total = 3 + 215 + 1.", result: "219" },
    ], answer: "219 (and 95 stall cycles for GATE 2026)", check: "Check the 2026 table figure of this chapter: 15 + 10 + 10 + 10 + 5 + 30 + 15 = 95." },
    { type: "example", id: "o3-e14", level: "gate", title: "GATE CS 2024 (forenoon), Q55 · 2 marks · the best number of cores", file: "gate2024_fn_q55.txt", given: `A program takes 100 ns on one core; 90% of the time parallelises perfectly; each extra core costs 10 ns overhead; cores share the parallel work equally. The number of cores that minimises the time?`, find: "The number of cores.", steps: [
      { say: "Time(n) = 10 + 90 ÷ n + 10 (n − 1).", result: "formula" },
      { say: "n = 2: 65; n = 3: 60; n = 4: 62.5; n = 5: 68.", result: "minimum at 3" },
    ], answer: "3", check: "Counting the overhead as 10 n instead gives 70 at n = 3 and 72.5 at n = 4: still 3." },

    { type: "trap", wrong: "A pipeline with k stages is k times faster.", tempting: "Five stages working at once, so five times faster.", whyWrong: "Five is the limit, reached only for a long run of independent instructions with no stalls and no latch delay. The latch delay lengthens the cycle, the fill takes k − 1 cycles, and every stall adds a cycle with no completion. GATE 2017's six-stage pipeline gives a speedup of 1.51 over the five-stage one, not 6/5.", rule: "Use (k + n − 1) × cycle and the CPI with stalls; never just the number of stages.", ex: { text: "100 instructions on 5 stages: 104 cycles, not 500 ÷ 5 = 100." } },

    { type: "gate", text: "Real GATE questions solved in this chapter, 16 of them: 2026 FN Q16, Q60 · 2026 AN Q57 · 2025 AN Q56, Q61 · 2024 FN Q22, Q55 · 2024 AN Q25, Q56 · 2023 FN Q33 · 2022 FN Q61 · 2021 FN Q41 · 2021 AN Q59 · 2020 FN Q43 · 2018 FN Q60 · 2017 FN Q49. Latch delay goes into the cycle; stalls go into the CPI; keep the two clock frequencies apart." },
    { type: "recall", cards: [
      { q: "Time of n instructions on a k-stage pipeline?", a: "(k + n − 1) × cycle." },
      { q: "The cycle of a pipeline?", a: "The slowest stage plus the latch delay." },
      { q: "Average CPI with stalls?", a: "1 + stall cycles per instruction." },
      { q: "Speedup over a non-pipelined machine?", a: "T_old ÷ (CPI × cycle)." },
      { q: "Three hazard kinds?", a: "Structural, data, control." },
      { q: "Which data dependence is a hazard in an in-order pipeline?", a: "RAW only." },
      { q: "RAW, WAR, WAW?", a: "Write then read; read then write; write then write." },
      { q: "What does forwarding need and not fix?", a: "Extra wires and multiplexers; it does not fix the load-use stall." },
      { q: "Stall cycles of a t ns stage on a 1 ns clock?", a: "⌈t⌉ − 1." },
      { q: "Parallel time with n cores?", a: "Serial + parallel ÷ n + overhead per extra core." },
    ] },
    { type: "check", questions: [
      { id: "o3c1", kind: "NAT", marks: 1, q: "A 4-stage pipeline has stage delays 5, 6, 8 and 7 ns with a 2 ns latch. The time for 50 instructions in ns is", answer: "530", solution: "Cycle = 8 + 2 = 10; cycles = 4 + 49 = 53; time = 530." },
      { id: "o3c2", kind: "MCQ", marks: 1, q: "Which hazard can occur in an in-order five-stage pipeline?", options: ["WAR", "WAW", "RAW", "RAR"], answer: "C", solution: "Only RAW." },
      { id: "o3c3", kind: "NAT", marks: 2, q: "A pipeline with ideal CPI 1 has 25% branches; every taken branch (60% of branches) stalls 3 cycles. The CPI is", answer: "1.45", solution: "1 + 0.25 × 0.6 × 3 = 1.45." },
      { id: "o3c4", kind: "NAT", marks: 2, q: "A non-pipelined machine takes 8 ns per instruction. The pipelined version has CPI 1.6 and a cycle of 2.5 ns. The speedup is", answer: "2", solution: "1.6 × 2.5 = 4 ns; 8 ÷ 4 = 2." },
      { id: "o3c5", kind: "MSQ", marks: 2, q: "I1: ADD R1,R2,R3; I2: SUB R4,R1,R5; I3: MUL R1,R6,R7. Which dependences exist?", options: ["RAW on R1 between I1 and I2", "WAR on R1 between I2 and I3", "WAW on R1 between I1 and I3", "RAW on R4 between I2 and I3"], answer: "A, B, C", solution: "I1 writes R1 and I2 reads it (RAW); I2 reads R1 and I3 writes it (WAR); I1 and I3 both write R1 (WAW). No instruction after I2 reads R4." },
      { id: "o3c6", kind: "NAT", marks: 2, q: "The EX stage takes 2.2 ns for each of 40 instructions in a 100-instruction program on a 1 ns clock; the rest fit in a cycle. The stall cycles are", answer: "80", solution: "⌈2.2⌉ = 3 cycles, so 2 stalls each: 80." },
      { id: "o3c7", kind: "MCQ", marks: 1, q: "A load followed at once by an instruction that uses its result still stalls with forwarding because", options: ["The load result exists only after MEM", "Forwarding is disabled for loads", "The ALU is busy", "The register file is slow"], answer: "A", solution: "The load value is ready at the end of MEM, one stage later than an ALU result." },
      { id: "o3c8", kind: "NAT", marks: 2, q: "A job takes 100 ns on one core, 80 ns of it parallelisable, overhead 5 ns per extra core. The time on 4 cores in ns is", answer: "55", solution: "Serial 20 + parallel 80 ÷ 4 + overhead 5 × 3 = 20 + 20 + 15 = 55." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on pipelining", sub: "Computer Organisation", href: "/topics/computer-organization-and-architecture-coa" }, { label: "Cache memory", sub: "the next chapter", href: "/study/cache-memory" }] },
    { type: "links", prereq: ["Performance equation (O0)", "ALU and data path (O2)"], usedIn: ["Cache memory (O4)"], cross: ["Operating Systems: context switch cost"] },
  ],
};
