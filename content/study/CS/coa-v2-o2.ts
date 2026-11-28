import type { Topic } from "@/lib/study/schema";

/**
 * Computer Organisation chapter O2 "ALU, data path and control unit" (29 Nov 2026). The ALU and its flags, registers and buses, the single-bus data path, the fetch-decode-execute cycle,
 * hardwired and microprogrammed control (horizontal and vertical microinstructions), and the multiplication and division algorithms (shift-and-add, Booth, restoring).
 * Real GATE questions (texts from public/data/questions.json), each re-solved here: 2025 FN Q27 (a two-multiplexer data path: A, B, C), 2025 AN Q32 (Booth, 13 operations),
 * 2020 FN Q30 (the step order on a single-bus data path: C = 3, 5, 2, 1, 4).
 * Programs compiled and run with gcc: Booth's algorithm on 3 x -3; the operation count of the GATE 2025 multiplier.
 */
export const chapterO2: Topic = {
  id: "cs.coa.v2.datapath2",
  title: "ALU, data path and control unit",
  no: "O2",
  book: [
    { t: "p", text: "The processor does its work in two parts. The **data path** holds the numbers and moves them: registers, buses, the arithmetic and logic unit. The **control unit** decides, cycle by cycle, which of those connections to open. An instruction such as R0 ← R1 + R2 becomes a short sequence of **control steps**: put R1 on the bus, hold it in a temporary register, put R2 on the bus, tell the ALU to add, store the sum in R0. This chapter shows that sequence and the two ways to build the control unit." },
    { t: "p", text: "The chapter also covers the arithmetic algorithms that GATE asks about by name: shift-and-add multiplication, **Booth's algorithm**, and restoring division. Three real questions are solved, a data-path question with a figure, a Booth count and a step-ordering question on a single bus. The chapter is short because the questions are few, but each of them is a certain mark once the ideas are clear." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["describe the ALU, its operations and the status flags (carry, overflow, zero, negative);", "read a data-path figure and say which operations it can perform;", "put the micro-operations of an instruction in the right order on a single-bus data path;", "contrast a hardwired and a microprogrammed control unit, and a horizontal and a vertical microinstruction;", "run Booth's algorithm and count its additions and subtractions;", "describe restoring division and the number of its steps."] },

    { t: "h2", text: "The ALU and the status flags" },
    { t: "p", text: "The **arithmetic and logic unit** takes two operands and a control code, and produces a result and some flags. It adds, subtracts (by adding the 2's complement), ANDs, ORs, XORs, shifts and compares. An adder is the core of it (the adders of Digital Logic chapter L4), and a few extra gates make the other operations. The control code, the **ALU control** lines in the figures, chooses which one reaches the output." },
    { t: "p", text: "Four **status flags** are set by every arithmetic operation. **Z** (zero) is 1 when the result is 0. **N** (negative, sign) is the top bit of the result. **C** (carry) is the carry out of the top bit; for subtraction it means a borrow did not occur. **V** (overflow) is 1 when a signed result does not fit: equivalently, the carry into the top bit differs from the carry out of it. Conditional branches read these flags: BEQ tests Z, BLT tests N ≠ V, and so on." },
    { t: "p", text: "Unsigned and signed overflow are different events. Adding the bytes 0x70 and 0x50 gives 0xC0. As unsigned numbers, 112 + 80 = 192 fits in a byte, so **C = 0**. As signed numbers, 112 + 80 = 192 is greater than 127, so **V = 1**, and the result looks negative (N = 1). The processor sets the flags; the program decides which meaning it wants." },
    { t: "ex", id: "o2-e1" },
    { t: "callout", kind: "key", text: "C = carry out of the top bit (unsigned overflow). V = carry into the top bit XOR carry out of it (signed overflow). Z = result is zero. N = top bit of the result." },

    { t: "h2", text: "Registers, buses and the data path" },
    { t: "p", text: "The **data path** is the set of registers, buses and functional units that the instructions use. The registers named in the questions are the **PC** (address of the next instruction), the **IR** (the instruction being executed), the **MAR** (the memory address register, whose contents go to the memory as the address), the **MDR** (the memory data register, which holds the word read from or written to the memory), and the general-purpose registers R0, R1, …" },
    { t: "p", text: "In a **single-bus** data path all these registers, and the ALU, share one set of wires. Only one value can travel on the bus in a cycle, so an operation on two registers needs the first operand to be held somewhere while the second goes on the bus. That is the role of a temporary register in front of the ALU (TEMP1 in the figure of GATE 2020), and another temporary register (TEMP2) catches the result before it is put back." },
    { t: "p", text: "A **multi-bus** data path has several buses, and the ALU can read two operands in the same cycle, which saves steps. The two-multiplexer data path of GATE 2025 is of this kind: the ALU has separate inputs fed from RA and RB, but each input comes through a **multiplexer** that chooses between a register and a 32-bit immediate value. The multiplexers are controlled by select lines; the ALU is controlled by its own lines; the result goes to RZ." },
    { t: "fig", id: "o2-f1" },
    { t: "p", text: "That data path can do register-register arithmetic (select RA and RB), register-immediate arithmetic (RA and the immediate), and, because each multiplexer can independently pick the immediate, even immediate-immediate arithmetic. It is not restricted to one kind. So of the four statements of GATE 2025 the first three are true and the fourth is false: **A, B, C**." },
    { t: "ex", id: "o2-e2" },

    { t: "h2", text: "The instruction cycle on a single bus" },
    { t: "p", text: "Every instruction goes through the same cycle: **fetch** (read the instruction from memory into the IR and advance the PC), **decode** (the control unit works out what the instruction is), **execute** (do it). The fetch is the same for every instruction, so it is the first group of steps, and it is the part that GATE tests as an ordering." },
    { t: "p", text: "The fetch on the single bus of GATE 2020 is: the PC goes on the bus into the MAR (PC_r, MAR_w); the memory is read (MEM_r), and the word arrives in the MDR; the MDR goes on the bus into the IR (MDR_r, IR_w). The PC is also incremented, which the question says to assume. After the fetch, the execute steps for R0 ← R1 + R2 are: R1 goes on the bus into TEMP1 (R1_r, TEMP1_w); R2 goes on the bus and, with TEMP1 as the other input, the ALU adds, writing the sum to TEMP2 (R2_r, TEMP1_r, ALU_add, TEMP2_w); finally TEMP2 goes on the bus into R0 (TEMP2_r, R0_w)." },
    { t: "p", text: "The ordering rules are: a register must be **written before it is read**, and the bus carries **one value per step**. TEMP1 must be loaded (step 2) before the ALU step reads it (step 1), the ALU step must write TEMP2 before TEMP2 is read (step 4), and the fetch (steps 3 and 5) comes before any execute step. The order is 3, 5, 2, 1, 4: **option C**." },
    { t: "fig", id: "o2-f2" },
    { t: "ex", id: "o2-e3" },
    { t: "trap", i: 0 },

    { t: "h2", text: "The control unit: hardwired and microprogrammed" },
    { t: "p", text: "The control unit turns the opcode and the current step into the control signals that open each connection of the data path. There are two ways to build it." },
    { t: "p", text: "A **hardwired** control unit is a block of gates. A step counter (a ring counter or a small state machine) says which step of the instruction is current, a decoder turns the opcode into one line per instruction, and AND and OR gates combine them into each control signal. It is **fast**, because there is no memory lookup, but it is **hard to change**: a new instruction means redesigning the logic. RISC processors, with few and regular instructions, are hardwired." },
    { t: "p", text: "A **microprogrammed** control unit holds the control signals in a memory, the **control store**. Each machine instruction is carried out by a short **microprogram**, a sequence of **microinstructions**, and each microinstruction is a word whose bits are the control signals of one step, plus the address of the next microinstruction. The control unit fetches microinstructions like a tiny processor. It is **flexible** (a new instruction means new words in the store, and errors are fixed by editing) but **slower**, because every step is a memory read. CISC processors, with many complicated instructions, are microprogrammed." },
    { t: "p", text: "A microinstruction can be **horizontal** or **vertical**. A horizontal microinstruction has one bit for every control signal: it is wide, it can open many connections in one step (a high degree of parallelism), and it needs no decoding, so it is fast. A vertical microinstruction groups the signals that are never needed together into **fields** and encodes each field in binary: it is narrow, it saves control-store space, but it needs a decoder and allows less parallelism, so it is slower." },
    { t: "table", head: ["", "Hardwired", "Microprogrammed"], rows: [
      ["Built from", "gates, counter, decoder", "control store (ROM) + sequencer"], ["Speed", "fast", "slower (a memory read per step)"],
      ["Changing an instruction", "redesign the circuit", "edit the microprogram"], ["Used in", "RISC", "CISC"],
      ["Cost for many instructions", "grows quickly", "stays modest"],
    ], caption: "Hardwired against microprogrammed control." },
    { t: "p", text: "The control store size is the number of microinstructions times the width of one. If a horizontal microinstruction has 40 control-signal bits and an 8-bit next-address field, and the store holds 256 words, its size is 256 × 48 = 12 288 bits. A vertical form that encodes mutually exclusive groups of 8, 16, 4 and 32 signals needs 3 + 4 + 2 + 5 = 14 bits for those groups instead of 60." },

    { t: "h2", text: "Multiplication: shift-and-add and Booth's algorithm" },
    { t: "p", text: "By hand, we multiply by taking one digit of the multiplier at a time and adding a shifted copy of the multiplicand. In binary a digit is 0 or 1, so each step either adds the multiplicand (shifted) or adds nothing. An n-bit multiplier takes n steps, and about half of them are additions. The hardware version uses three registers: A (accumulator, starts at 0), Q (the multiplier) and M (the multiplicand), and each step ends with a shift of the pair (A, Q)." },
    { t: "p", text: "**Booth's algorithm** multiplies **signed** 2's complement numbers directly, and it does fewer additions when the multiplier has long runs of 1s. It scans the multiplier from the least significant bit, looking at each bit together with the bit to its right (a 0 is appended on the right of Q). For each pair: **01** means the end of a run of 1s, so **add M**; **10** means the start of a run, so **subtract M**; **00** and **11** are inside a run or a stretch of zeros, so only **shift**. After each step the registers shift one place right, copying the sign (an arithmetic shift)." },
    { t: "p", text: "A run of 1s from bit i to bit j has the value 2^(j+1) − 2^i, so the multiplier is replaced by one subtraction at the start of the run and one addition after its end. A multiplier with a run of 100 ones costs 2 operations, not 100." },
    { t: "fig", id: "o2-f3" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int m = 3, q = -3, n = 4;            /* 4-bit multiplier 1101 */
    int acc = 0, ops = 0;
    for (int i = 0; i < n; i++) {
        int cur = (q >> i) & 1, prev = i ? (q >> (i - 1)) & 1 : 0;
        if (cur == 1 && prev == 0) { acc -= m << i; ops++; }   /* pair 10: subtract M */
        if (cur == 0 && prev == 1) { acc += m << i; ops++; }   /* pair 01: add M */
    }
    printf("%d %d\\n", acc, ops);          /* the product and the number of add or subtract steps */
    return 0;
}`, out: "-9 3", file: "booth_small.c" },
    { t: "p", text: "The number of additions and subtractions in Booth's algorithm is the number of places where the multiplier, with a 0 appended on the right, changes between 0 and 1. The multiplicand does not matter. This is the whole of GATE 2025's question: the multiplier is Q = 1010 0100 1010 1010." },
    { t: "p", text: "Read Q with the extra 0: 1010 0100 1010 1010 0. The changes are: 1-0, 0-1, 1-0 (3 changes in the first four bits), then 0-0 (none), 0-1, 1-0 (5), 0-0 (none), 0-1, 1-0 (7), 0-1, 1-0 (9), 0-1, 1-0 (11), 0-1, 1-0 (13), and the final 0-0 with the appended zero is none. The total is **13**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    unsigned q = 0xA4AA;                  /* 1010 0100 1010 1010 */
    int changes = 0, prev = 0;            /* the appended bit on the right is 0 */
    for (int i = 0; i < 16; i++) {
        int cur = (q >> i) & 1;
        if (cur != prev) changes++;
        prev = cur;
    }
    printf("%d\\n", changes);
    return 0;
}`, out: "13", file: "booth_count.c" },
    { t: "ex", id: "o2-e4" },
    { t: "ex", id: "o2-e5" },

    { t: "h2", text: "Division" },
    { t: "p", text: "Binary long division mirrors the paper method. In **restoring division**, the dividend is in Q, the divisor in M, and A starts at 0. Each of the n steps shifts (A, Q) left one place, subtracts M from A, and looks at the sign of A: if A is **negative**, the subtraction was too much, so the algorithm **restores** A by adding M back and sets the new low bit of Q to 0; otherwise it keeps A and sets that bit to 1. After n steps, Q is the quotient and A is the remainder." },
    { t: "p", text: "**Non-restoring division** avoids the restoring addition: when A is negative the next step adds M instead of subtracting, and a final correction is made at the end if the remainder is negative. It is faster on average, with one add or subtract per step. Both take **n steps** for an n-bit dividend, which is the usual question." },
    { t: "p", text: "The multiplier and divider also give the ALU its place in the timing: a multiply or divide of n bits takes n steps of the clock, whereas an addition takes one. That difference is why the cycles per instruction in the pipeline chapter depend on the instruction type." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Flags: Z result zero, N top bit, C carry out (unsigned overflow), V signed overflow (carry into the top bit differs from carry out).", "Data path: registers and buses; a single bus carries one value per step, so TEMP registers hold operands. A multiplexer in front of an ALU input selects register or immediate.", "Fetch on a single bus: PC to MAR, memory read, MDR to IR, PC incremented; then execute. Registers are written before they are read.", "Hardwired control: fast, rigid, RISC. Microprogrammed: control store, flexible, slower, CISC.", "Horizontal microinstruction: one bit per signal, wide, fast. Vertical: encoded fields, narrow, slower.", "Booth: pair 01 add M, 10 subtract M, 00 and 11 shift. Operations = changes in Q with a 0 appended.", "Restoring division takes n steps: shift, subtract, restore if negative."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "o2-f1", caption: "The two-multiplexer data path of GATE 2025. Each ALU input can take either its register or the immediate, so the ALU can combine any two of RA, RB and the two immediates.", alt: "A table that lists what each multiplexer setting gives the ALU in the GATE 2025 data path.", fig: { kind: "trace", title: "MUX_A and MUX_B selections", cols: ["MUX_A", "MUX_B", "operation shown"], rows: [
      { cells: ["RA", "RB", "register with register"], tone: "ok" }, { cells: ["RA", "immediate", "register with immediate"], tone: "ok" }, { cells: ["immediate", "RB", "immediate with register"], tone: "ok" }, { cells: ["immediate", "immediate", "immediate with immediate"], tone: "ok" },
    ] } },
    { type: "figure", id: "o2-f2", caption: "The order of the five steps of GATE 2020. The two fetch steps come first; TEMP1 is loaded before the ALU reads it; TEMP2 is written before it is read.", alt: "A table that lists the five steps in execution order with the register each one reads and writes.", fig: { kind: "trace", title: "R0 ← R1 + R2 on a single bus", cols: ["order", "step", "what happens"], rows: [
      { cells: [1, "3", "PC to MAR; memory read"] }, { cells: [2, "5", "MDR to IR (fetch complete)"] }, { cells: [3, "2", "R1 to TEMP1"] }, { cells: [4, "1", "R2 and TEMP1 into the ALU, add, sum to TEMP2"] }, { cells: [5, "4", "TEMP2 to R0"], tone: "ok" },
    ] } },
    { type: "figure", id: "o2-f3", caption: "Booth's algorithm on 3 × (−3) in 4 bits. A is the accumulator, Q the multiplier, q the extra bit on the right. The last pair is 11 so only a shift happens: three operations and the product is 1111 0111 = −9.", alt: "A table of the registers A, Q and the extra bit through the four steps of Booth's algorithm.", fig: { kind: "trace", title: "M = 0011, Q = 1101", cols: ["step", "Q0 q", "action", "A", "Q", "q"], rows: [
      { cells: ["start", "", "", "0000", "1101", 0] }, { cells: [1, "10", "A = A − M, shift", "1110", "1110", 1], changed: [3, 4, 5] }, { cells: [2, "01", "A = A + M, shift", "0000", "1111", 0], changed: [3, 4, 5] }, { cells: [3, "10", "A = A − M, shift", "1110", "1111", 1], changed: [3, 4, 5] }, { cells: [4, "11", "shift only", "1111", "0111", 1], changed: [3, 4, 5], tone: "ok" },
    ] } },

    { type: "example", id: "o2-e1", level: "edge", title: "The flags · adding 0x70 and 0x50 in 8 bits", file: "flags_edge.txt", given: `Two 8-bit registers hold 0x70 and 0x50. They are added. Which of the flags C, V, N, Z are 1?`, find: "The flags.", steps: [
      { say: "0x70 + 0x50 = 0xC0 = 1100 0000.", result: "0xC0" },
      { say: "No carry leaves the byte (192 < 256).", result: "C = 0" },
      { say: "Signed: 112 + 80 = 192 > 127, a carry goes into the top bit but none comes out.", result: "V = 1" },
      { say: "The top bit is 1; the result is not 0.", result: "N = 1, Z = 0" },
    ], answer: "V and N", check: "Two positive numbers gave a negative-looking result: that is signed overflow." },
    { type: "example", id: "o2-e2", level: "gate", title: "GATE CS 2025 (forenoon), Q27 · 1 mark · MSQ: what the two-multiplexer data path can do", file: "gate2025_fn_q27.txt", given: `A partial data path has 32-bit registers RA, RB, RZ; MUX_A selects RA or a 32-bit immediate; MUX_B selects RB or a 32-bit immediate; an ALU with control lines gives RZ. Which are correct?
A) arithmetic with two registers   B) arithmetic with one register and one immediate   C) arithmetic with two immediate values   D) only one register and one immediate`, find: "The correct statements.", steps: [
      { say: "MUX_A = RA and MUX_B = RB gives register with register.", result: "A true" },
      { say: "MUX_A = RA and MUX_B = immediate gives register with immediate.", result: "B true" },
      { say: "Both multiplexers can select their immediates at the same time.", result: "C true" },
      { say: "D claims it can do only one kind, which A, B and C contradict.", result: "D false" },
    ], answer: "A, B, C", check: "The figure of this chapter lists the four settings." },
    { type: "example", id: "o2-e3", level: "gate", title: "GATE CS 2020 (forenoon), Q30 · 1 mark · the order of steps on a single-bus data path", file: "gate2020_fn_q30.txt", given: `Execute R0 ← R1 + R2 on a bus data path with MAR, MDR, IR, PC, R0 to R7, TEMP1, TEMP2 and an ALU. The steps: 1. R2r, TEMP1r, ALUadd, TEMP2w   2. R1r, TEMP1w   3. PCr, MARw, MEMr   4. TEMP2r, R0w   5. MDRr, IRw. The correct order is?
A) 2,1,4,5,3   B) 1,2,4,3,5   C) 3,5,2,1,4   D) 3,5,1,2,4`, find: "The order.", steps: [
      { say: "Fetch first: step 3 puts the PC in the MAR and reads memory; step 5 moves the MDR into the IR.", result: "3, 5" },
      { say: "TEMP1 must be loaded (step 2) before the ALU step (step 1) reads it.", result: "2, 1" },
      { say: "The sum is written to TEMP2 in step 1, then read into R0 in step 4.", result: "4 last" },
    ], answer: "C (3, 5, 2, 1, 4)", check: "Options A and B start with an execute step; D puts the ALU step before TEMP1 is loaded." },
    { type: "example", id: "o2-e4", level: "gate", title: "GATE CS 2025 (afternoon), Q32 · 1 mark · the operations of Booth's algorithm", file: "gate2025_an_q32.txt", given: `Multiplicand M = 1100 1101 1110 1101 and multiplier Q = 1010 0100 1010 1010 are multiplied by Booth's algorithm. The total number of additions and subtractions is?`, find: "The number of operations.", steps: [
      { say: "Operations depend only on the multiplier, with a 0 appended on its right.", result: "1010 0100 1010 1010 0" },
      { say: "Count the places where adjacent bits differ: the first four bits give 3, then one at bit 6 and 5, and so on; the program counts them all.", result: "13" },
    ], answer: "13", check: "The program in this chapter prints 13. Pairs 10 and 01 are the operations." },
    { type: "example", id: "o2-e5", level: "edge", title: "Booth on a long run of ones", file: "booth_edge.txt", given: `A 16-bit multiplier is 0111 1111 1111 1110. How many additions and subtractions does Booth's algorithm use, and how many would shift-and-add use?`, find: "The two counts.", steps: [
      { say: "With the appended 0 the string is 0111 1111 1111 1110 0: one change from 0 to 1 at the start and one from 1 to 0 at the end.", result: "Booth: 2" },
      { say: "Shift-and-add adds once for every 1 bit: there are 14 of them.", result: "14" },
    ], answer: "Booth 2, shift-and-add 14", check: "The run of ones is 2¹⁵ − 2¹ = 32766: one subtraction and one addition." },

    { type: "trap", wrong: "A microprogrammed control unit is faster because it is programmable.", tempting: "'Programmable' sounds more advanced.", whyWrong: "Every step of a microprogrammed unit costs a read of the control store, so it is slower than the hardwired gates that make the signals directly. What it gains is flexibility and a cheaper way to implement many complicated instructions.", rule: "Hardwired: fast, rigid. Microprogrammed: flexible, slower.", ex: { text: "RISC (few simple instructions) is hardwired; CISC (many complicated instructions) is microprogrammed." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2025 FN Q27 · 2025 AN Q32 · 2020 FN Q30. Booth's operation count depends on the multiplier only. Order steps by 'written before read' and 'fetch first'." },
    { type: "recall", cards: [
      { q: "What is the V flag?", a: "Signed overflow: the carry into the top bit differs from the carry out." },
      { q: "What is the C flag?", a: "Carry out of the top bit, unsigned overflow." },
      { q: "What does the MAR hold?", a: "The address sent to the memory." },
      { q: "Fetch on a single bus?", a: "PC to MAR, memory read, MDR to IR, increment the PC." },
      { q: "Why TEMP registers on a single bus?", a: "Only one value is on the bus per step, so one operand has to wait." },
      { q: "Hardwired against microprogrammed?", a: "Hardwired: fast, rigid, RISC. Microprogrammed: flexible, slower, CISC." },
      { q: "Horizontal against vertical microinstruction?", a: "Horizontal: one bit per signal, wide, fast. Vertical: encoded fields, narrow, slower." },
      { q: "Booth pair 10 and 01?", a: "10: subtract M; 01: add M; 00 and 11: shift only." },
      { q: "Booth operations count?", a: "Changes between 0 and 1 in Q with a 0 appended." },
      { q: "Steps of restoring division?", a: "n steps for n bits; restore by adding M back if A goes negative." },
    ] },
    { type: "check", questions: [
      { id: "o2c1", kind: "NAT", marks: 1, q: "The number of additions and subtractions Booth's algorithm uses for the 8-bit multiplier 0110 1110 is", answer: "4", solution: "Append 0: 0110 1110 0 has changes at 0-1, 1-0, 0-1, 1-0: 4." },
      { id: "o2c2", kind: "MCQ", marks: 1, q: "Which control unit is faster?", options: ["Hardwired", "Microprogrammed", "Both equal", "Vertical microprogrammed"], answer: "A", solution: "No control-store read: hardwired." },
      { id: "o2c3", kind: "NAT", marks: 1, q: "A horizontal microinstruction has 40 control bits and an 8-bit next-address field. The control store has 256 words. Its size in bits is", answer: "12288", solution: "256 × 48 = 12288." },
      { id: "o2c4", kind: "MSQ", marks: 2, q: "Which steps belong to the instruction fetch on a single bus?", options: ["PC to MAR", "Memory read into MDR", "MDR to IR", "ALU adds the operands"], answer: "A, B, C", solution: "The ALU addition is part of execute." },
      { id: "o2c5", kind: "MSQ", marks: 2, q: "8-bit registers hold 0x70 and 0x50 and are added. Which flags are set?", options: ["Carry", "Overflow", "Negative", "Zero"], answer: "B, C", solution: "Result 0xC0: no carry out; signed overflow; top bit 1; not zero." },
      { id: "o2c6", kind: "NAT", marks: 2, q: "Mutually exclusive control signals fall in four groups of 8, 16, 4 and 32 signals. Encoding each group in binary uses a total of how many bits?", answer: "14", solution: "3 + 4 + 2 + 5 = 14." },
      { id: "o2c7", kind: "MCQ", marks: 1, q: "In Booth's algorithm, the bit pair 10 means", options: ["Add M and shift", "Subtract M and shift", "Shift only", "Stop"], answer: "B", solution: "10 is the start of a run of ones: subtract." },
      { id: "o2c8", kind: "NAT", marks: 2, q: "A 16-bit dividend is divided by restoring division. The number of shift-and-subtract steps is", answer: "16", solution: "One step per bit." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on ALU and data path", sub: "Computer Organisation", href: "/topics/computer-organization-and-architecture-coa" }, { label: "Instruction pipelining", sub: "the next chapter", href: "/study/pipelining" }] },
    { type: "links", prereq: ["Machine instructions (O1)", "Combinational circuits (L4)", "Sequential circuits (L5)"], usedIn: ["Pipelining (O3)"], cross: ["Computer arithmetic (L6)"] },
  ],
};
