import type { Topic } from "@/lib/study/schema";

/**
 * Computer Organisation chapter O0 "Foundations: words, registers, endianness and performance" (29 Nov 2026). Bytes and words, registers and buses, the instruction set architecture against
 * the machine that implements it, RISC and CISC, byte order, and the performance equation (time = instructions x CPI x clock period). Real GATE questions (texts from public/data/questions.json),
 * each re-solved here: 2025 AN Q28 (what belongs to an instruction set architecture: D), 2021 AN Q58 (little endian 255 more than big endian: A and D), 2018 FN Q15 (RISC: I, II and III).
 * Programs compiled and run with gcc: the byte order of a word; 1.40 and 2.00 for the performance equation.
 */
export const chapterO0: Topic = {
  id: "cs.coa.v2.found0",
  title: "Foundations: words, registers, endianness and performance",
  no: "O0",
  book: [
    { t: "p", text: "Computer Organisation is the study of how a processor and its memory are built and how they run a program. Before the instruction formats, the pipeline and the cache, a handful of ideas have to be in place: what a word and a register are, what is part of the **architecture** (the contract with the programmer) and what is part of the **implementation** (how the hardware keeps the contract), the order in which the bytes of a number sit in memory, and the one equation that every performance question uses." },
    { t: "p", text: "The chapter is short, and three real GATE questions test it directly, but everything in the later chapters leans on it. The performance equation in particular is the engine of every pipeline and cache calculation in the paper, which together carry about 75 of the 115 marks of the subject." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["explain what a byte, a word, a register and a bus are, and read an address in hexadecimal;", "tell what belongs to the instruction set architecture and what does not;", "list the traits of a RISC processor;", "write a multi-byte number in big-endian and little-endian order and convert between them;", "use time = instructions × CPI × clock period to compare designs."] },

    { t: "h2", text: "Bits, bytes, words and addresses" },
    { t: "p", text: "A **bit** is a 0 or a 1. Eight bits make a **byte**, the smallest unit that has its own address in almost every machine (a **byte-addressable** memory). A **word** is the natural unit of the processor: the width of its registers and of most of its operations. A word is commonly 32 or 64 bits, that is 4 or 8 bytes, but the questions state it, so read the word length from the problem rather than assuming it." },
    { t: "p", text: "A memory with k address bits has 2ᵏ locations; with byte addressing, that is 2ᵏ bytes. 16 address bits give 64 KB, 20 bits give 1 MB, 32 bits give 4 GB. The prefixes are powers of two: 1 K = 2¹⁰, 1 M = 2²⁰, 1 G = 2³⁰, as the cache and memory questions note. Addresses are written in hexadecimal, four bits per digit, so a 24-bit address has six hex digits." },
    { t: "p", text: "A **register** is a small, very fast storage cell inside the processor. The **program counter** (PC) holds the address of the next instruction; the **instruction register** (IR) holds the instruction being executed; the **general-purpose registers** hold the data the program works on. The registers are connected to the memory and to the arithmetic unit by **buses**, shared sets of wires that carry addresses, data and control signals." },
    { t: "callout", kind: "key", text: "k address bits → 2ᵏ addressable units. 1 K = 2¹⁰, 1 M = 2²⁰, 1 G = 2³⁰. Always read the word length and whether the memory is byte-addressable from the question." },

    { t: "p", text: "The memory is organised as a long row of numbered cells. The processor sends an address on the **address bus**, a control signal (read or write) on the **control bus**, and the data travels on the **data bus**. The widths matter in the questions: the address bus width fixes how much memory can be named, the data bus width fixes how much moves per transfer." },
    { t: "p", text: "Alignment is a small practical rule that some questions assume: a 4-byte word is stored at an address that is a multiple of 4, so one memory access fetches it whole. A word stored across a multiple-of-4 boundary needs two accesses. The questions in the paper do not penalise misalignment, but the idea explains why word sizes are powers of two." },

    { t: "h2", text: "Architecture and implementation" },
    { t: "p", text: "The **instruction set architecture** (ISA) is the interface between the software and the processor: the set of instructions, their binary formats, the registers the programmer can name, the data types, the addressing modes and the memory model. A program written for an ISA runs on every processor that implements that ISA, however differently the processors are built inside." },
    { t: "p", text: "The **microarchitecture** (or organisation) is how a particular processor implements the ISA: the pipeline depth, the cache sizes and levels, the clock frequency, the number of execution units, the branch predictor. Two processors can share an ISA and differ in all of these. GATE 2025 asks which of four items are part of an ISA: the cache size (no), the clock frequency (no), the number of cache levels (no), and the total number of registers (**yes**, because the programmer can name them and the instruction encoding has bits for them). Only the last is part of the ISA." },
    { t: "ex", id: "o0-e1" },
    { t: "fig", id: "o0-f1" },

    { t: "h2", text: "RISC and CISC" },
    { t: "p", text: "Two design philosophies shaped the ISAs. A **CISC** (complex instruction set computer) provides many instructions, of varying lengths, many of which can read or write memory directly, with elaborate addressing modes; the control unit is often **microprogrammed**, because so many complicated instructions are easier to implement as small programs. A **RISC** (reduced instruction set computer) provides a small set of simple instructions, of **fixed length**, in which only **load and store** touch memory and every arithmetic operation works **register to register**; the control unit is usually **hardwired**, because the simple instructions make it small and fast." },
    { t: "p", text: "The consequences are why RISC took over: with a fixed length, the instruction fetch and decode are simple and a pipeline runs smoothly; with register-to-register arithmetic every instruction has a regular shape; with a hardwired control the clock can be fast. GATE 2018 lists three characteristics (register-to-register arithmetic only, fixed-length instruction format, hardwired control unit) and asks which are RISC traits: **all three**." },
    { t: "ex", id: "o0-e2" },
    { t: "table", head: ["", "RISC", "CISC"], rows: [
      ["Instructions", "few, simple", "many, complex"], ["Length", "fixed", "variable"], ["Memory access", "load and store only", "most instructions"],
      ["Registers", "many", "fewer"], ["Control unit", "hardwired", "microprogrammed"], ["Pipelining", "easy", "harder"],
    ], caption: "The usual contrast. Real processors mix the two, but the paper's questions use this table." },

    { t: "h2", text: "Byte order: big endian and little endian" },
    { t: "p", text: "A 16-bit or 32-bit number occupies several consecutive bytes, and the machine must decide which byte goes at the lowest address. In a **big-endian** machine the **most significant byte** is stored first (at the lowest address), as we write the number. In a **little-endian** machine the **least significant byte** is stored first. The value 0x0102 stored at address 100 gives memory[100] = 0x01, memory[101] = 0x02 on a big-endian machine and memory[100] = 0x02, memory[101] = 0x01 on a little-endian machine." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    unsigned short v = 0x0102;
    unsigned char *p = (unsigned char *)&v;           /* look at the bytes in address order */
    printf("%02X %02X\\n", p[0], p[1]);                /* on a little-endian PC: 02 01 */
    return 0;
}`, out: "02 01", file: "byte_order.c" },
    { t: "p", text: "The program prints the bytes in address order; on a little-endian PC (all x86 and most ARM) it shows the low byte first. Byte order matters when a number crosses between machines, in networks (which use big endian, 'network byte order') and in questions like GATE 2021's." },
    { t: "p", text: "GATE 2021: a 2-byte unsigned integer is stored as the two bytes b₀ (at the lower address) and b₁ (at the higher). A big-endian machine reads the value b₀·256 + b₁; a little-endian machine reads b₁·256 + b₀. The little-endian value is 255 more than the big-endian value exactly when (b₁ − b₀)·255 = 255, that is when **b₁ = b₀ + 1**. The question asks which numbers can be the little-endian value b₁b₀ (written as hex digits with b₁ first): 0x6665 (b₁ = 0x66, b₀ = 0x65: yes), 0x0100 (b₁ = 0x01, b₀ = 0x00: yes), 0x0001 (b₁ = 0, b₀ = 1: b₁ is one less: no) and 0x4243 (b₁ = 0x42, b₀ = 0x43: no). The answers are A and D." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    unsigned cand[4] = {0x6665, 0x0001, 0x4243, 0x0100};
    for (int i = 0; i < 4; i++) {
        unsigned le = cand[i], b1 = le >> 8, b0 = le & 255;
        unsigned be = b0 * 256 + b1;                       /* the same two bytes read in the other order */
        if (le == be + 255) printf("%c", 'A' + i);
    }
    printf("\\n");
    return 0;
}`, out: "AD", file: "endian_check.c" },
    { t: "ex", id: "o0-e3" },
    { t: "trap", i: 0 },

    { t: "h2", text: "The performance equation" },
    { t: "p", text: "How long does a program take? The answer is the product of three things:" },
    { t: "callout", kind: "key", text: "CPU time = (instruction count) × (cycles per instruction, CPI) × (clock period) = IC × CPI ÷ f. The clock period is 1/f; a 2 GHz clock has a period of 0.5 ns." },
    { t: "p", text: "The **instruction count** depends on the program and the ISA; the **CPI** on the microarchitecture and the instruction mix; the **clock period** on the technology and the pipeline depth. A faster clock does not help if it needs more cycles per instruction, and a smaller CPI does not help if it forces a slower clock: only the product matters. When instructions differ, the average CPI is the **weighted mean** over the mix: CPI = Σ (fraction of type i) × CPIᵢ." },
    { t: "p", text: "**Speedup** of a new design over an old one is old time ÷ new time. Because the instruction count is usually the same, speedup = (CPI_old × T_old) ÷ (CPI_new × T_new). A design that cuts the CPI from 3 to 2 at the same clock has a speedup of 1.5; one that doubles the clock but raises the CPI from 2 to 3 has a speedup of (2 × 1) ÷ (3 × 0.5) = 1.33." },
    { t: "p", text: "Stalls add cycles. If a fraction f of instructions suffers s extra cycles each, the average CPI is the ideal CPI + f·s. This is the form of nearly every pipeline and cache question in the paper: an ideal CPI of 1 (or 2) plus a stall term. The next chapters use it constantly." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    double base = 1.0 + 0.3 * 2;                 /* ideal CPI 1 plus 30% of instructions stalling 2 cycles: 1.6 */
    double better = 1.0 + 0.3 * 0.2 * 2;         /* only the 20% mispredicted branches stall: 1.12 */
    printf("%.2f %.2f\\n", base, base / better);  /* CPI, then the speedup at the same clock */
    return 0;
}`, out: "1.60 1.43", file: "perf_equation.c" },
    { t: "ex", id: "o0-e4" },
    { t: "fig", id: "o0-f2" },
    { t: "p", text: "Two consequences to remember. **Amdahl's law:** if a fraction p of the time can be sped up by a factor s, the overall speedup is 1 ÷ ((1 − p) + p/s); the part that cannot be improved limits the gain. And **throughput against latency:** a pipeline improves how many instructions finish per second (throughput) but not the time one instruction takes (latency), which usually gets slightly worse because of the latch overhead." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Word: the processor's natural width; byte-addressable memory has one address per byte; k bits address 2ᵏ units.", "ISA (instructions, registers, formats, addressing modes) against microarchitecture (cache, clock, pipeline). The number of registers is ISA; cache sizes and clock are not.", "RISC: few simple fixed-length instructions, load/store only, register-to-register arithmetic, hardwired control.", "Big endian stores the most significant byte first; little endian the least significant first. Value difference of 255 means b₁ = b₀ + 1.", "CPU time = IC × CPI × clock period; weighted average CPI; stalls add f·s to the CPI; speedup = old time ÷ new time."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "o0-f1", caption: "What belongs to the architecture (the contract) and what to the implementation. The GATE 2025 question asks which of four items are architecture: only the number of registers.", alt: "A table that sorts the cache size, clock frequency, cache levels and register count into instruction set architecture or microarchitecture.", fig: { kind: "trace", title: "ISA or microarchitecture?", cols: ["item", "belongs to"], rows: [
      { cells: ["number of registers", "ISA"], tone: "ok" }, { cells: ["instruction formats and opcodes", "ISA"], tone: "ok" }, { cells: ["addressing modes", "ISA"], tone: "ok" },
      { cells: ["size of the cache", "microarchitecture"] }, { cells: ["number of cache levels", "microarchitecture"] }, { cells: ["clock frequency", "microarchitecture"] }, { cells: ["pipeline depth", "microarchitecture"] },
    ] } },
    { type: "figure", id: "o0-f2", caption: "The same value 0x0102 in memory on the two kinds of machine. Big endian puts the most significant byte at the lowest address; little endian puts the least significant byte there.", alt: "A table of two addresses with the bytes stored on a big-endian and a little-endian machine.", fig: { kind: "trace", title: "0x0102 at addresses 100 and 101", cols: ["address", "big endian", "little endian"], rows: [
      { cells: [100, "0x01 (most significant)", "0x02 (least significant)"] }, { cells: [101, "0x02", "0x01"] },
    ] } },

    { type: "example", id: "o0-e1", level: "gate", title: "GATE CS 2025 (afternoon), Q28 · 1 mark · MSQ: what is part of an instruction set architecture", file: "gate2025_an_q28.txt", given: `Which of the following is/are part of an Instruction Set Architecture of a processor?
A) the size of the cache memory   B) the clock frequency of the processor   C) the number of cache memory levels   D) the total number of registers`, find: "The items that belong to the ISA.", steps: [
      { say: "The ISA is the contract the programmer sees: instructions, formats, registers, addressing modes.", result: "what software can name" },
      { say: "Cache size, number of cache levels and clock frequency are how one implementation is built; two processors with the same ISA can differ in them.", result: "A, B, C are not ISA" },
      { say: "The number of registers fixes how many register names an instruction can use: part of the ISA.", result: "D" },
    ], answer: "D", check: "Software can name a register but cannot see a cache level." },
    { type: "example", id: "o0-e2", level: "gate", title: "GATE CS 2018 (forenoon), Q15 · 1 mark · characteristics of a RISC design", file: "gate2018_fn_q15.txt", given: `I. Register-to-register arithmetic operations only   II. Fixed-length instruction format   III. Hardwired control unit. Which are used in the design of a RISC processor?
A) I and II only   B) II and III only   C) I and III only   D) I, II and III`, find: "The RISC characteristics.", steps: [
      { say: "I: in a RISC only load and store touch memory, so arithmetic is register to register.", result: "RISC" },
      { say: "II: a fixed instruction length keeps fetch and decode simple.", result: "RISC" },
      { say: "III: simple instructions make a hardwired control unit practical and fast.", result: "RISC" },
    ], answer: "D", check: "A CISC would answer no to all three: memory operands, variable length, microprogrammed control." },
    { type: "example", id: "o0-e3", level: "gate", title: "GATE CS 2021 (afternoon), Q58 · 2 marks · MSQ: little endian 255 more than big endian", file: "gate2021_an_q58.txt", given: `The numerical value of a 2-byte unsigned integer on a little-endian computer is 255 more than that on a big-endian computer. Which choices represent the unsigned integer on the little-endian computer?
A) 0x6665   B) 0x0001   C) 0x4243   D) 0x0100`, find: "The possible little-endian values.", steps: [
      { say: "Let the bytes in address order be b0, b1. Big endian reads b0·256 + b1; little endian reads b1·256 + b0.", result: "LE − BE = 255 (b1 − b0)" },
      { say: "LE − BE = 255 means b1 − b0 = 1.", result: "b1 = b0 + 1" },
      { say: "0x6665: b1 = 0x66, b0 = 0x65: yes. 0x0100: b1 = 1, b0 = 0: yes. 0x0001: b1 = 0, b0 = 1: no. 0x4243: b1 = 0x42, b0 = 0x43: no.", result: "A and D" },
    ], answer: "A, D", check: "The program in this chapter prints AD." },
    { type: "example", id: "o0-e4", level: "edge", title: "The performance equation · a design with a branch predictor", file: "perf_edge.txt", given: `Processor X1 has CPI 1 and 30% branches, each stalling 2 cycles. X2 adds a predictor that removes the stall for correctly predicted branches (80% of them) and does nothing for wrong ones. Same clock. The speedup of X2 over X1?`, find: "The speedup.", steps: [
      { say: "CPI of X1 = 1 + 0.3 × 2 = 1.6.", result: "1.6" },
      { say: "In X2 only the 20% mispredicted branches stall: CPI = 1 + 0.3 × 0.2 × 2 = 1.12.", result: "1.12" },
      { say: "Same instruction count and clock: speedup = 1.6 / 1.12.", result: "1.43" },
    ], answer: "1.43", check: "The program in this chapter prints 1.60 1.43. This is the pattern of GATE 2022 FN Q61, solved with the pipelines." },

    { type: "trap", wrong: "A faster clock always makes the machine faster.", tempting: "Time per cycle shrinks, so everything runs sooner.", whyWrong: "Time is instructions × CPI × clock period. A design that doubles the clock but raises the CPI from 2 to 3 has a speedup of only (2 × 1) ÷ (3 × 0.5) = 1.33, and one that raises the CPI to 4 gains nothing. Pipelines run at a lower clock than their ideal because of latch overhead, as the pipeline questions show.", rule: "Compare CPI × clock period, not either one alone.", ex: { text: "CPI 2 at 1 GHz = 2 ns per instruction; CPI 3 at 2 GHz = 1.5 ns: speedup 1.33." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2025 AN Q28 · 2021 AN Q58 · 2018 FN Q15. The performance equation of the last section is used in every pipeline and cache question of the next chapters." },
    { type: "recall", cards: [
      { q: "How many addressable bytes do k address bits give?", a: "2ᵏ." },
      { q: "1 K, 1 M, 1 G in bytes?", a: "2¹⁰, 2²⁰, 2³⁰." },
      { q: "ISA versus microarchitecture?", a: "ISA: what software can name (instructions, registers, modes). Microarchitecture: how it is built (cache, clock, pipeline)." },
      { q: "Is the number of registers part of the ISA?", a: "Yes. Cache size and clock frequency are not." },
      { q: "Three RISC traits in the paper?", a: "Register-to-register arithmetic, fixed-length instructions, hardwired control." },
      { q: "Big endian stores which byte first?", a: "The most significant byte, at the lowest address." },
      { q: "CPU time?", a: "Instructions × CPI × clock period." },
      { q: "Average CPI with stalls?", a: "Ideal CPI + (fraction stalled) × (stall cycles)." },
      { q: "Speedup?", a: "Old time ÷ new time." },
      { q: "Amdahl's law?", a: "1 ÷ ((1 − p) + p/s)." },
    ] },
    { type: "check", questions: [
      { id: "o0c1", kind: "NAT", marks: 1, q: "A byte-addressable memory has 24 address lines. Its size in megabytes is", answer: "16", solution: "2²⁴ = 16 M." },
      { id: "o0c2", kind: "NAT", marks: 1, q: "A 32-bit word 0x12345678 is stored at address 1000 on a little-endian machine. What byte (in hex, as a number) is at address 1000?", answer: "78", solution: "The least significant byte 0x78 goes at the lowest address." },
      { id: "o0c3", kind: "MCQ", marks: 1, q: "Which is NOT a typical RISC property?", options: ["Fixed-length instructions", "Arithmetic on memory operands", "Load/store architecture", "Hardwired control"], answer: "B", solution: "Arithmetic on memory operands is a CISC trait." },
      { id: "o0c4", kind: "NAT", marks: 2, q: "A program has 10⁹ instructions, CPI 1.5 and runs on a 3 GHz clock. Its CPU time in seconds is", answer: "0.5", solution: "10⁹ × 1.5 ÷ 3×10⁹ = 0.5." },
      { id: "o0c5", kind: "MSQ", marks: 2, q: "Which are part of the ISA?", options: ["Addressing modes", "Number of registers", "Cache block size", "Instruction formats"], answer: "A, B, D", solution: "Cache block size is microarchitecture." },
      { id: "o0c6", kind: "NAT", marks: 2, q: "Machine A: CPI 2, clock 2 GHz. Machine B: CPI 1.5, clock 1.2 GHz. The speedup of A over B is", answer: "1.25", solution: "A: 2/2 = 1 ns; B: 1.5/1.2 = 1.25 ns; speedup 1.25." },
      { id: "o0c7", kind: "MCQ", marks: 2, q: "Half of a program (by time) is sped up 4 times. The overall speedup is", options: ["1.6", "2.0", "2.5", "4.0"], answer: "A", solution: "1 ÷ (0.5 + 0.5/4) = 1 ÷ 0.625 = 1.6." },
      { id: "o0c8", kind: "NAT", marks: 2, q: "A 16-bit value is 0xAB01 in big-endian order. Its value as read by a little-endian machine from the same two bytes, in decimal, is", answer: "427", solution: "Bytes in address order: AB, 01. A little-endian machine reads the second byte as the high one: 0x01AB = 1·256 + 171 = 427." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on computer organisation", sub: "Computer Organisation", href: "/topics/computer-organization-and-architecture-coa" }, { label: "Instructions and addressing", sub: "the next chapter", href: "/study/instructions-addressing" }] },
    { type: "links", prereq: ["Number representation (L1)", "Sequential circuits (L5)"], usedIn: ["Every later Computer Organisation chapter"], cross: ["Programming in C: pointers and bytes"] },
  ],
};
