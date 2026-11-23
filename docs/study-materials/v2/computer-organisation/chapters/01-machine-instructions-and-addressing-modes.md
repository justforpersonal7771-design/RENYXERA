# Review input: Computer Organisation, chapter 01: Machine instructions and addressing modes

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-01-machine-instructions-and-addressing-modes.md` and `gemini-01-machine-instructions-and-addressing-modes.md` in this folder.

*Note: chapters are matched to PYQs by the words in their titles, so a question can appear in more than one chapter. Say which chapter it really belongs to.*

---

## PART A. REVIEWER INSTRUCTIONS

```
YOU ARE NOT AN EXPERT. YOU ARE THIS STUDENT:
You are 25 years old. You sat at the back of the class. You failed GATE twice and have plenty of backlogs. You studied
Programming and Data Structures (and the other subjects) in college only to pass, copied the assignments, and
remember almost nothing. You are ashamed of that, you do not want to ask, and you are now preparing again with
about 100 days left. You have read Made Easy notes, Unacademy PDFs and GateWallah books and they left you confused:
they use words they never explain, jump steps and show few pictures. You will only believe a book that is teaching
you from the very beginning.

I will give you a document. Read it as this student. Do NOT be polite and do NOT be an expert reviewer who nods.
Stop at every place where this student would get stuck. Then answer in the four parts below.

PART 1. FEELINGS (10 lines)
 How did you feel reading it? Where did you feel lost, bored, scared, or tricked? Where did you feel "I can do this"?
 Would you pay Rs 149 per subject book for this? Yes or no, and the real reason.

PART 2. GAP TABLE (the main part; at least 40 rows if the document is a plan, 15 if it is one topic)
 | # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
 Type is one of: MISSING-PREREQUISITE, UNEXPLAINED-WORD, STEP-SKIPPED, NEEDS-DIAGRAM, NEEDS-EXAMPLE, NEEDS-TRACE,
 MISSING-GATE-CONCEPT, MISSING-FINER-POINT, WRONG-ORDER, TOO-HARD-TOO-EARLY, TOO-LONG-BORING, UNCLEAR-ENGLISH, FACT-DOUBT.
 Priority is HIGH / MEDIUM / LOW.

PART 3. WHAT A COMPLETE SUBJECT MUST HAVE
 From your knowledge of GATE (previous-year papers, Made Easy, Unacademy, GateWallah, standard university textbooks,
 NPTEL), list every chapter, topic and finer sub-topic that this subject has but the document does NOT cover, with:
 the syllabus line it serves, how often GATE asks it (if you really know; otherwise say "not sure"), the typical
 question type, and the prerequisite a zero-level student needs first.

PART 4. THE DIAGRAMS I NEED
 List every diagram this student needs to SEE in order to understand each chapter. For each: what to draw, what the
 student should notice, and whether it should be a single picture, a step-by-step series of pictures, or a trace table.

RULES FOR YOU
 - Do not invent GATE years, question numbers or statistics. If you are not sure, write "not sure".
 - Do not just praise. If you find fewer than 40 problems in a long plan, you read too fast; read again.
 - Say it in simple English.
 - If a fact in the document looks wrong, say exactly which and why (FACT-DOUBT).

This is **one chapter** (1 of 6) of the Computer Organisation book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

In addition to Parts 1 to 4 of the instructions above, answer these chapter-specific parts:

PART 5. THE FULL LESSON PLAN FOR THIS CHAPTER
 Propose the complete list of lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with a reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind + what it shows); hand traces; common mistakes.

PART 6. THE PYQs BELOW
 For EACH previous-year question listed below: (a) which lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree, show the working and say "FACT-DOUBT"), (e) whether the question text looks mis-transcribed.

PART 7. MORE QUESTIONS
 For each lesson, list the question types GATE could ask that are NOT covered by the PYQs below (give 3 ideas each, one line each).

PART 8. WHAT IS MISSING FROM THIS CHAPTER'S SCOPE
 Topics GATE has asked (or could ask) about this chapter that the draft chapter list does not cover.
```

---

## PART B. THE CHAPTER

## Chapter details

Existing chapter in the app: **Machine instructions and addressing modes**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (30)

**2026_FN_Q14** · 2026-FN · MCQ · 1 mark · Easy · bank topic: Machine Instructions & Addressing Modes

Match each addressing mode in **List I** with a data element or an element of a data structure (in a high-level language) in **List II**:
**List I**
P. Immediate
Q. Indirect
R. Base with index
S. Base with offset/displacement
**List II**
1. Element of an array
2. Pointer
3. Element of a record
4. Constant

- A) P-4, Q-3, R-1, S-2
- B) P-4, Q-2, R-1, S-3  ✔ official
- C) P-1, Q-4, R-3, S-2
- D) P-2, Q-3, R-1, S-4

---

**2026_FN_Q15** · 2026-FN · MCQ · 1 mark · Medium · bank topic: Machine Instructions & Addressing Modes

Consider a processor P whose instruction set architecture is the load-store architecture. The instruction format is such that the first operand of any instruction is the destination operand.
Which one of the following sequences of instructions corresponds to the high-level language statement Z = X + Y?
**Note:** X, Y, and Z are memory operands. R0, R1, and R2 are registers.

- A) ADD Z, X, Y
- B) LOAD R0, X ADD Z, R0, Y
- C) ADD R0, X, Y STORE Z, R0
- D) LOAD R0, X LOAD R1, Y ADD R2, R0, R1 STORE Z, R2  ✔ official

---

**2026_FN_Q16** · 2026-FN · MCQ · 1 mark · Easy · bank topic: Instruction Pipelining, Performance, Hazard Management

Which one of the following dependencies among the register operands of different instructions can cause a data hazard in a pipelined processor?

- A) Read-after-read
- B) Read-after-write  ✔ official
- C) Write-after-read
- D) Write-after-write

---

**2026_AN_Q44** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Machine Instructions & Addressing Modes

Consider a processor that has 16 general purpose registers and it uses 2-byte instruction format for all its instructions. Variable-sized opcodes are permitted. There are three different types of instructions; M-type, R-type, and C-type. Each M-type instruction has 2 register operands and a 6-bit immediate operand. Each R-type instruction has 3 register operands. Each C-type instruction has a register operand and a 6-bit offset value. If there are 2 unique M-type opcodes and 7 unique R-type opcodes, which one of the following options gives the maximum number of unique opcodes possible for C-type instructions?

- A) 8
- B) 4  ✔ official
- C) 64
- D) 16

---

**2026_AN_Q57** · 2026-AN · NAT · 2 marks · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management

A non-pipelined instruction execution unit that operates at 1.6 GHz clock takes an average of 5 clock cycles to complete the execution of an instruction. To improve the performance, the system was pipelined with a goal of achieving an average throughput of one instruction per clock cycle. However, it could operate only at 1.2 GHz due to pipeline overheads. While executing a program in the pipelined design, 30% of instructions encountered a stall of 2 cycles due to pipeline hazards. The speed-up obtained by the pipelined design over the non-pipelined one for this program is ________. (rounded off to two decimal places)
Note: 1G = \( 10^9 \)

Official answer (numeric): 2.30 to 2.40

---

**2026_FN_Q60** · 2026-FN · NAT · 2 marks · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management · HAS A FIGURE (not shown here)

The EX stage of a pipelined processor performs the memory read operations for LOAD instructions, and the operations for the arithmetic and logic instructions. Let \( t_{EX} \) denote the time taken by the EX stage to perform the operation for an instruction. For each instruction type, the values of \( t_{EX} \) and \( M \) (the number of instructions of that type in a sequence of 100 instructions for a program \( P \)), are given in the table below.
The duration of the pipeline clock cycle is 1 nanosecond. Assume that the latch time for the interstage buffers in the pipeline is negligible.
[IMAGE_Q_60_1]
When program \( P \) is executed, the number of clock cycles for which the pipeline is stalled due to structural hazards in the EX stage is ________. (answer in integer)

Official answer (numeric): 95 to 95

---

**2025_AN_Q28** · 2025-AN · MSQ · 1 mark · Easy · bank topic: Machine Instructions & Addressing Modes

Which of the following is/are part of an Instruction Set Architecture of a processor?

- A) The size of the cache memory
- B) The clock frequency of the processor
- C) The number of cache memory levels
- D) The total number of registers  ✔ official

---

**2025_FN_Q37** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Machine Instructions & Addressing Modes

A processor has 64 general-purpose registers and 50 distinct instruction types. An instruction is encoded in 32-bits. What is the maximum number of bits that can be used to store the immediate operand for the given instruction?
```
ADD R1, #25    // R1 = R1 + 25
```

- A) 16
- B) 20  ✔ official
- C) 22
- D) 24

---

**2025_AN_Q56** · 2025-AN · NAT · 2 marks · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management

A 5-stage instruction pipeline has stage delays of 180, 250, 150, 170, and 250, respectively, in nanoseconds. The delay of an inter-stage latch is 10 nanoseconds. Assume that there are no pipeline stalls due to branches and other hazards. The time taken to process 1000 instructions in microseconds is ________. (Rounded off to two decimal places)

Official answer (numeric): 260.20 to 261.20

---

**2025_AN_Q61** · 2025-AN · NAT · 2 marks · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management · HAS A FIGURE (not shown here)

An application executes \( 6.4 \times 10^8 \) number of instructions in 6.3 seconds. There are four types of instructions, the details of which are given in the table. The duration of a clock cycle in nanoseconds is ________. (rounded off to one decimal place)
[IMAGE_Q_61_1]

Official answer (numeric): 3.0 to 3.0

---

**2024_FN_Q22** · 2024-FN · MSQ · 1 mark · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management

Consider a 5-stage pipelined processor with Instruction Fetch (IF), Instruction Decode (ID), Execute (EX), Memory Access (MEM), and Register Writeback (WB) stages. Which of the following statements about forwarding is/are CORRECT?

- A) In a pipelined execution, forwarding means the result from a source stage of an earlier instruction is passed on to the destination stage of a later instruction  ✔ official
- B) In forwarding, data from the output of the MEM stage can be passed on to the input of the EX stage of the next instruction  ✔ official
- C) Forwarding cannot prevent all pipeline stalls  ✔ official
- D) Forwarding does not require any extra hardware to retrieve the data from the pipeline stages

---

**2024_AN_Q25** · 2024-AN · MSQ · 1 mark · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management

An instruction format has the following structure:
Instruction Number: Opcode destination reg, source reg-1, source reg-2
Consider the following sequence of instructions to be executed in a pipelined processor:
\( I_1 \): DIV R3, R1, R2
\( I_2 \): SUB R5, R3, R4
\( I_3 \): ADD R3, R5, R6
\( I_4 \): MUL R7, R3, R8
Which of the following statements is/are TRUE?

- A) There is a RAW dependency on \( R_3 \) between \( I_1 \) and \( I_2 \)  ✔ official
- B) There is a WAR dependency on \( R_3 \) between \( I_1 \) and \( I_2 \)
- C) There is a RAW dependency on \( R_3 \) between \( I_2 \) and \( I_3 \)
- D) There is a WAW dependency on \( R_3 \) between \( I_3 \) and \( I_4 \)

---

**2024_FN_Q55** · 2024-FN · NAT · 2 marks · Hard · bank topic: Instruction Pipelining, Performance, Hazard Management

The baseline execution time of a program on a 2 GHz single core machine is 100 nanoseconds (ns). The code corresponding to 90% of the execution time can be fully parallelized. The overhead for using an additional core is 10 ns when running on a multicore system. Assume that all cores in the multicore system run their share of the parallelized code for an equal amount of time.
The number of cores that minimize the execution time of the program is ________.

Official answer (numeric): 3 to 3

---

**2024_AN_Q49** · 2024-AN · NAT · 2 marks · Medium · bank topic: Machine Instructions & Addressing Modes

A processor with 16 general purpose registers uses a 32-bit instruction format. The instruction format consists of an opcode field, an addressing mode field, two register operand fields, and a 16-bit scalar field. If 8 addressing modes are to be supported, the maximum number of unique opcodes possible for every addressing mode is ________.

Official answer (numeric): 32 to 32

---

**2024_AN_Q56** · 2024-AN · NAT · 2 marks · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management

A non-pipelined instruction execution unit operating at 2GHz takes an average of 6 cycles to execute an instruction of a program P. The unit is then redesigned to operate on a 5-stage pipeline at 2GHz. Assume that the ideal throughput of the pipelined unit is 1 instruction per cycle. In the execution of program P, 20% instructions incur an average of 2 cycles stall due to data hazards and 20% instructions incur an average of 3 cycles stall due to control hazards. The speedup (rounded off to one decimal place) obtained by the pipelined design over the non-pipelined design is ________.

Official answer (numeric): 2.9 to 3.1

---

**2024_AN_Q43** · 2024-AN · NAT · 2 marks · Medium · bank topic: Machine Instructions & Addressing Modes · HAS A FIGURE (not shown here)

A processor uses a 32-bit instruction format and supports byte-addressable memory access. The ISA of the processor has 150 distinct instructions. The instructions are equally divided into two types, namely R-type and I-type, whose formats are shown below.
R-type Instruction Format:
[IMAGE_Q_43_1]
I-type Instruction Format:
[IMAGE_Q_43_2]
In the OPCODE, 1 bit is used to distinguish between I-type and R-type instructions and the remaining bits indicate the operation. The processor has 50 architectural registers, and all register fields in the instructions are of equal size.
Let \( X \) be the number of bits used to encode the UNUSED field, \( Y \) be the number of bits used to encode the OPCODE field, and \( Z \) be the number of bits used to encode the immediate value/address field. The value of \( X + 2Y + Z \) is ________.

Official answer (numeric): 34 to 34

---

**2023_FN_Q33** · 2023-FN · NAT · 1 mark · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management

Consider a 3-stage pipelined processor having a delay of 10 ns (nanoseconds), 20 ns, and 14 ns, for the first, second, and the third stages, respectively. Assume that there is no other delay and the processor does not suffer from any pipeline hazards. Also assume that one instruction is fetched every cycle.
The total execution time for executing 100 instructions on this processor is ________ ns.

Official answer (numeric): 2040 to 2040

---

**2023_FN_Q41** · 2023-FN · MCQ · 2 marks · Medium · bank topic: Machine Instructions & Addressing Modes

Consider the given C-code and its corresponding assembly code, with a few operands U1–U4 being unknown. Some useful information as well as the semantics of each unique assembly instruction is annotated as inline comments in the code. The memory is byte-addressable.
```c
//C-code
int a[10], b[10], i;
// int is 32-bit
for (i=0; i<10; i++)
    a[i] = b[i] * 8;
```
```assembly
; assembly-code (; indicates comments)
; r1-r5 are 32-bit integer registers
; initialize r1=0, r2=10
; initialize r3, r4 with base address of a, b
L01: jeq r1, r2, end; if(r1==r2) goto end
L02: lw r5, 0(r4); r5 <- Memory[r4+0]
L03: shl r5, r5, U1; r5 <- r5 << U1
L04: sw r5, 0(r3); Memory[r3+0] <- r5
L05: add r3, r3, U2; r3 <- r3+U2
L06: add r4, r4, U3
L07: add r1, r1, 1
L08: jmp U4; goto U4
L09: end
```
Which one of the following options is a CORRECT replacement for operands in the position (U1, U2, U3, U4) in the above assembly code?

- A) (8, 4, 1, L02)
- B) (3, 4, 4, L01)  ✔ official
- C) (8, 1, 1, L02)
- D) (3, 1, 1, L01)

---

**2022_FN_Q61** · 2022-FN · NAT · 2 marks · Hard · bank topic: Instruction Pipelining, Performance, Hazard Management

A processor \(X_1\) operating at 2 GHz has a standard 5-stage RISC instruction pipeline having a base CPI (cycles per instruction) of one without any pipeline hazards. For a given program P that has 30% branch instructions, control hazards incur 2 cycles stall for every branch. A new version of the processor \(X_2\) operating at same clock frequency has an additional branch predictor unit (BPU) that completely eliminates stalls for correctly predicted branches. There is neither any savings nor any additional stalls for wrong predictions. There are no structural hazards and data hazards for \(X_1\) and \(X_2\). If the BPU has a prediction accuracy of 80%, the speed up (rounded off to two decimal places) obtained by \(X_2\) over \(X_1\) in executing P is _________.

Official answer (numeric): 1.42 to 1.45

---

**2021_AN_Q58** · 2021-AN · MSQ · 2 marks · Hard · bank topic: Machine Instructions & Addressing Modes

If the numerical value of a 2-byte unsigned integer on a little endian computer is 255 more than that on a big endian computer, which of the following choices represent(s) the unsigned integer on a little endian computer?

- A) 0x6665  ✔ official
- B) 0x0001
- C) 0x4243
- D) 0x0100  ✔ official

---

**2021_FN_Q41** · 2021-FN · NAT · 2 marks · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management

A five-stage pipeline has stage delays of 150, 120, 150, 160 and 140 nanoseconds. The registers that are used between the pipeline stages have a delay of 5 nanoseconds each.
The total time to execute 100 independent instructions on this pipeline, assuming there are no pipeline stalls, is _________ nanoseconds.

Official answer (numeric): 17160 to 17160

---

**2021_AN_Q59** · 2021-AN · NAT · 2 marks · Hard · bank topic: Instruction Pipelining, Performance, Hazard Management

Consider a pipelined processor with 5 stages. Instruction Fetch (IF), Instruction Decode (ID), Execute (EX), Memory Access (MEM), and Write Back (WB). Each stage of the pipeline, except the EX stage, takes one cycle. Assume that the ID stage merely decodes the instruction and the register read is performed in the EX stage. The EX stage takes one cycle for ADD instruction and two cycles for MUL instruction. Ignore pipeline register latencies. Consider the following sequence of 8 instructions:
ADD, MUL, ADD, MUL, ADD, MUL, ADD, MUL
Assume that every MUL instruction is data-dependent on the ADD instruction just before it and every ADD instruction (except the first ADD) is data-dependent on the MUL instruction just before it. The Speedup is defined as follows:
$$ \text{Speedup} = \frac{\text{Execution time without operand forwarding}}{\text{Execution time with operand forwarding}} $$
The Speedup achieved in executing the given instruction sequence on the pipelined processor (rounded to 2 decimal places) is _________.

Official answer (numeric): 1.87 to 1.88

---

**2021_FN_Q38** · 2021-FN · NAT · 2 marks · Medium · bank topic: Machine Instructions & Addressing Modes · HAS A FIGURE (not shown here)

Consider the following instruction sequence where registers R1, R2 and R3 are general purpose and MEMORY[X] denotes the content at the memory location X.

[IMAGE_Q_38_1]

Assume that the content of the memory location 5000 is 10 and the content of the register R3 is 3000. The content of each of the memory locations from 3000 to 3010 is 50. The instruction sequence starts from the memory location 1000. All the numbers are in decimal format. Assume that the memory is byte addressable.
After the execution of the program, the content of memory location 3010 is _________.

Official answer (numeric): 50 to 50

---

**2020_FN_Q43** · 2020-FN · NAT · 2 marks · Hard · bank topic: Instruction Pipelining, Performance, Hazard Management

Consider a non-pipelined processor operating at 2.5 GHz. It takes 5 clock cycles to complete an instruction. You are going to make a 5-stage pipeline out of this processor. Overheads associated with pipelining force you to operate the pipelined processor at 2 GHz. In a given program, assume that 30% are memory instructions. 60% are ALU instructions and the rest are branch instructions. 5% of the memory instructions cause stalls of 50 clock cycles each due to cache misses and 50% of the branch instructions cause stalls of 2 cycles each. Assume that there are no stalls associated with the execution of ALU instructions. For this program, the speedup achieved by the pipelined processor over the non-pipelined processor (round off to 2 decimal places) is ________.

Official answer (numeric): 2.15 to 2.18

---

**2020_FN_Q63** · 2020-FN · NAT · 2 marks · Medium · bank topic: Machine Instructions & Addressing Modes

A processor has 64 registers and uses 16-bit instruction format. It has two types of instructions: I-type and R-type. Each I-type instruction contains an opcode, a register name, and a 4-bit immediate value. Each R-type instruction contains an opcode and two register names. If there are 8 distinct I-type opcodes, then the maximum number of distinct R-type opcodes is ________.

Official answer (numeric): 14 to 14

---

**2018_FN_Q60** · 2018-FN · NAT · 2 marks · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management

The instruction pipeline of a RISC processor has the following stages: Instruction Fetch (IF), Instruction Decode (ID), Operand Fetch (OF), Perform Operation (PO) and Writeback (WB). The IF, ID, OF and WB stages take 1 clock cycle each for every instruction. Consider a sequence of 100 instructions. In the PO stage, 40 instructions take 3 clock cycles each, 35 instructions take 2 clock cycles each, and the remaining 25 instructions take 1 clock cycle each. Assume that there are no data hazards and no control hazards.
The number of clock cycles required for completion of execution of the sequence of instructions is ______.

Official answer (numeric): 219 to 219

---

**2018_FN_Q61** · 2018-FN · NAT · 2 marks · Hard · bank topic: Machine Instructions & Addressing Modes

A processor has 16 integer registers (R0, R1, .. , R15) and 64 floating point registers (F0, F1,… , F63). It uses a 2-byte instruction format. There are four categories of instructions: Type-1, Type-2, Type-3, and Type-4. Type-1 category consists of four instructions, each with 3 integer register operands (3Rs). Type-2 category consists of eight instructions, each with 2 floating point register operands (2Fs). Type-3 category consists of fourteen instructions, each with one integer register operand and one floating point register operand (1R+1F). Type-4 category consists of N instructions, each with a floating point register operand (1F).
The maximum value of N is __________.

Official answer (numeric): 32 to 32

---

**2017_FN_Q27** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Machine Instructions & Addressing Modes

Consider the C struct defined below:
```c
struct data {
    int marks [100];
    char grade;
    int cnumber;
};
struct data student;
```
The base address of student is available in register R1. The field student.grade can be accessed efficiently using

- A) Post-increment addressing mode, (R1)+
- B) Pre-decrement addressing mode, –(R1)
- C) Register direct addressing mode, R1
- D) Index addressing mode, X(R1), where X is an offset represented in 2's complement 16-bit representation.  ✔ official

---

**2017_FN_Q60** · 2017-FN · NAT · 2 marks · Medium · bank topic: Machine Instructions & Addressing Modes · HAS A FIGURE (not shown here)

Consider a RISC machine where each instruction is exactly 4 bytes long. Conditional and unconditional branch instructions use PC-relative addressing mode with Offset specified in bytes to the target location of the branch instruction. Further the Offset is always with respect to the address of the next instruction in the program sequence. Consider the following instruction sequence
[IMAGE_Q_60]
If the target of the branch instruction is \(i\), then the decimal value of the Offset is________.

Official answer (numeric): -16.0 to -16.0

---

**2017_FN_Q49** · 2017-FN · NAT · 2 marks · Medium · bank topic: Instruction Pipelining, Performance, Hazard Management

Instruction execution in a processor is divided into 5 stages. Instruction Fetch (IF), Instruction Decode (ID), Operand Fetch (OF), Execute (EX) and Write Back (WB). These stages take 5, 4, 20, 10 and 3 nanoseconds (ns) respectively. A pipelined implementation of the processor requires buffering between each pair of consecutive stages with a delay of 2 ns. Two pipelined implementations of the processor are contemplated:
(i) a naive pipeline implementation (NP) with 5 stages and
(ii) an efficient pipeline (EP) where the OF stage is divided into stages OF1 and OF2 with execution times of 12 ns and 8 ns respectively.
The speedup (correct to two decimal places) achieved by EP over NP in executing 20 independent instructions with no hazards is ________.

Official answer (numeric): 1.49 to 1.52

