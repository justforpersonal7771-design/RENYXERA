# Computer Organisation: every PYQ in the bank (72 questions)

Full text with options. "✔ official" marks the official key. Figures are not included (the question says so).

---

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

**2026_AN_Q18** · 2026-AN · MCQ · 1 mark · Medium · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Consider the following two statements about interrupt handling mechanisms in a CPU.
S1: In non-vectored interrupt mechanism, it usually takes more time to start the Interrupt Service Routine (ISR) when compared to that in a vectored interrupt mechanism.
S2: In daisy-chain interrupt mechanism, the CPU polls all the input devices individually to determine the source of the interrupt.
Which one of the following options is correct with respect to S1 and S2?

- A) Both S1 and S2 are true
- B) Both S1 and S2 are false
- C) S1 is true and S2 is false  ✔ official
- D) S1 is false and S2 is true

---

**2026_FN_Q38** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

The size of the physical address space of a processor is \( 2^{32} \) bytes. The capacity of a cache memory unit is \( 2^{23} \) bytes. The cache block size is 128 bytes. The cache memory unit can be built as a direct mapped cache or as a \( K \)-way set-associative cache, where \( K = 2^k \) and \( L \in \{1, 2, 3\} \). Let the length of the TAG field be \( M \) bits for the direct mapped cache, and \( N \) bits for the set-associative cache.
Which one of the following options is true?

- A) \( N = M + L \)  ✔ official
- B) \( N = M - L \)
- C) \( N = M + K \)
- D) \( N = M - K \)

---

**2026_AN_Q44** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Machine Instructions & Addressing Modes

Consider a processor that has 16 general purpose registers and it uses 2-byte instruction format for all its instructions. Variable-sized opcodes are permitted. There are three different types of instructions; M-type, R-type, and C-type. Each M-type instruction has 2 register operands and a 6-bit immediate operand. Each R-type instruction has 3 register operands. Each C-type instruction has a register operand and a 6-bit offset value. If there are 2 unique M-type opcodes and 7 unique R-type opcodes, which one of the following options gives the maximum number of unique opcodes possible for C-type instructions?

- A) 8
- B) 4  ✔ official
- C) 64
- D) 16

---

**2026_AN_Q52** · 2026-AN · MSQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a system with a processor and a 4 KB direct mapped cache with block size of 16 bytes. The system has a 16 MB physical memory. Four words P, Q, R, and S are accessed by the processor in the same order 10 times. That is, there are a total of 40 memory references in the sequence P, Q, R, S, P, Q, R, S,...
Assume that the cache memory is initially empty. The physical addresses of the words are given below (1 word = 1 byte).
P: 0x845B32, Q: 0x845B26, R: 0x845B36, S: 0x846B32
Which of the following statements is/are true?
Note: 1 K = \( 2^{10} \) and 1M = \( 2^{20} \)

- A) Every access to P results in a cache miss  ✔ official
- B) Every access to R results in a cache hit  ✔ official
- C) Every access to Q results in a cache miss
- D) Except the first access to S, all subsequent accesses to S result in cache hits

---

**2026_FN_Q54** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Main Memory & Virtual Memory Mechanics

Consider a system that has a cache memory unit and a memory management unit (MMU). The address input to the cache memory is a physical address. The MMU has a translation lookaside buffer (TLB). Assume that when a page is evicted from the main memory, the corresponding blocks in the cache are marked as invalid.
For a given memory reference, which of the following sequences of events can NEVER happen?

- A) TLB miss, Page table hit, Cache hit
- B) TLB hit, Page table miss, Cache hit  ✔ official
- C) TLB miss, Page table miss, Cache hit  ✔ official
- D) TLB miss, Page table miss, Cache miss

---

**2026_AN_Q56** · 2026-AN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a system with 1 MB physical memory and a word length of 1 byte. The system uses a direct mapped cache, with block numbers starting from 0. The word with physical address 0xA2C28 is mapped to the cache block number \( 176_{10} \). The maximum possible size of the cache (in KB) for this configuration is ________. (answer in integer)
Note: 1K = \( 2^{10} \) and 1M = \( 2^{20} \)

Official answer (numeric): 128 to 128

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

**2025_FN_Q11** · 2025-FN · MCQ · 1 mark · Easy · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Suppose a program is running on a non-pipelined single processor computer system. The computer is connected to an external device that can interrupt the processor asynchronously. The processor needs to execute the interrupt service routine (ISR) to serve this interrupt. The following steps (not necessarily in order) are taken by the processor when the interrupt arrives:
(i) The processor saves the content of the program counter.
(ii) The program counter is loaded with the start address of the ISR.
(iii) The processor finishes the present instruction.
Which ONE of the following is the CORRECT sequence of steps?

- A) (iii), (i), (ii)  ✔ official
- B) (i), (iii), (ii)
- C) (i), (ii), (iii)
- D) (iii), (ii), (i)

---

**2025_FN_Q27** · 2025-FN · MSQ · 1 mark · Medium · bank topic: ALU, Control Unit Design, Data-Path Operations · HAS A FIGURE (not shown here)

A partial data path of a processor is given in the figure, where RA, RB, and RZ are 32-bit registers. Which option(s) is/are CORRECT related to arithmetic operations using the data path as shown?
[IMAGE_Q_27_1]

- A) The data path can implement arithmetic operations involving two registers.  ✔ official
- B) The data path can implement arithmetic operations involving one register and one immediate value.  ✔ official
- C) The data path can implement arithmetic operations involving two immediate values.  ✔ official
- D) The data path can only implement arithmetic operations involving one register and one immediate value.

---

**2025_AN_Q28** · 2025-AN · MSQ · 1 mark · Easy · bank topic: Machine Instructions & Addressing Modes

Which of the following is/are part of an Instruction Set Architecture of a processor?

- A) The size of the cache memory
- B) The clock frequency of the processor
- C) The number of cache memory levels
- D) The total number of registers  ✔ official

---

**2025_AN_Q32** · 2025-AN · NAT · 1 mark · Hard · bank topic: ALU, Control Unit Design, Data-Path Operations

The following two signed 2's complement numbers (multiplicand M and multiplier Q) are being multiplied using Booth's algorithm:
M : 1100 1101 1110 1101 and Q: 1010 0100 1010 1010
The total number of addition and subtraction operations to be performed is ________. (Answer in integer)

Official answer (numeric): 13 to 13

---

**2025_FN_Q36** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a memory system with 1 M bytes of main memory and 16 K bytes of cache memory. Assume that the processor generates 20-bit memory address, and the cache block size is 16 bytes. If the cache uses direct mapping, how many bits will be required to store all the tag values?
[Assume memory is byte addressable, \( 1\text{ K} = 2^{10}, 1\text{ M} = 2^{20} \)]

- A) \( 6 \times 2^{10} \)  ✔ official
- B) \( 8 \times 2^{10} \)
- C) \( 2^{12} \)
- D) 214

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

**2025_AN_Q39** · 2025-AN · MCQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

For a direct-mapped cache, 4 bits are used for the tag field and 12 bits are used to index into a cache block. The size of each cache block is one byte. Assume that there is no other information stored for each cache block.
Which ONE of the following is the CORRECT option for the sizes of the main memory and the cache memory in this system (byte addressable), respectively?

- A) 64 KB and 4 KB  ✔ official
- B) 128 KB and 16 KB
- C) 64 KB and 8 KB
- D) 128 KB and 6 KB

---

**2025_FN_Q53** · 2025-FN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping) · HAS A FIGURE (not shown here)

A computer has a memory hierarchy consisting of two-level cache (L1 and L2) and a main memory. If the processor needs to access data from memory, it first looks into L1 cache. If the data is not found in L1 cache, it goes to L2 cache. If it fails to get the data from L2 cache, it goes to main memory, where the data is definitely available.
Hit rates and access times of various memory units are shown in the figure. The average memory access time in nanoseconds (ns) is ________. (Rounded off to two decimal places)
[IMAGE_Q_53_1]

Official answer (numeric): 11.83 to 11.87

---

**2025_AN_Q55** · 2025-AN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Given a computing system with two levels of cache (L1 and L2) and a main memory. The first level (L1) cache access time is 1 nanosecond (ns) and the “hit rate” for L1 cache is 90% while the processor is accessing the data from L1 cache. Whereas, for the second level (L2) cache, the “hit rate” is 80% and the “miss penalty” for transferring data from L2 cache to L1 cache is 10 ns. The “miss penalty” for the data to be transferred from main memory to L2 cache is 100 ns.
Then the average memory access time in this system in nanoseconds is (rounded off to one decimal place)

Official answer (numeric): 4.0 to 4.0

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

**2024_AN_Q24** · 2024-AN · MCQ · 1 mark · Medium · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Consider a computer with a 4 MHz processor. Its DMA controller can transfer 8 bytes in 1 cycle from a device to main memory through cycle stealing at regular intervals. Which one of the following is the data transfer rate (in bits per second) of the DMA controller if 1% of the processor cycles are used for DMA?

- A) 2,56,000
- B) 3,200
- C) 25,60,000  ✔ official
- D) 32,000

---

**2024_FN_Q33** · 2024-FN · MCQ · 1 mark · Medium · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Which one of the following statements is FALSE?

- A) In the cycle stealing mode of DMA, one word of data is transferred between an I/O device and main memory in a stolen cycle
- B) For bulk data transfer, the burst mode of DMA has a higher throughput than the cycle stealing mode
- C) Programmed I/O mechanism has a better CPU utilization than the interrupt driven I/O mechanism  ✔ official
- D) The CPU can start executing an interrupt service routine faster with vectored interrupts than with non-vectored interrupts

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

**2024_FN_Q41** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider two set-associative cache memory architectures: **WBC**, which uses the write back policy, and **WTC**, which uses the write through policy. Both of them use the LRU (Least Recently Used) block replacement policy. The cache memory is connected to the main memory. Which of the following statements is/are TRUE?

- A) A read miss in **WBC** never evicts a dirty block
- B) A read miss in **WTC** never triggers a write back operation of a cache block to main memory  ✔ official
- C) A write hit in **WBC** can modify the value of the dirty bit of a cache block  ✔ official
- D) A write miss in **WTC** always writes the victim cache block to main memory before loading the missed block to the cache

---

**2024_FN_Q55** · 2024-FN · NAT · 2 marks · Hard · bank topic: Instruction Pipelining, Performance, Hazard Management

The baseline execution time of a program on a 2 GHz single core machine is 100 nanoseconds (ns). The code corresponding to 90% of the execution time can be fully parallelized. The overhead for using an additional core is 10 ns when running on a multicore system. Assume that all cores in the multicore system run their share of the parallelized code for an equal amount of time.
The number of cores that minimize the execution time of the program is ________.

Official answer (numeric): 3 to 3

---

**2024_FN_Q56** · 2024-FN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

A given program has 25% load/store instructions. Suppose the ideal CPI (cycles per instruction) without any memory stalls is 2. The program exhibits 2% miss rate on instruction cache and 8% miss rate on data cache. The miss penalty is 100 cycles. The speedup (rounded off to two decimal places) achieved with a perfect cache (i.e., with NO data or instruction cache misses) is ________.

Official answer (numeric): 3.00 to 3.00

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

**2023_FN_Q34** · 2023-FN · NAT · 1 mark · Hard · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

A keyboard connected to a computer is used at a rate of 1 keystroke per second. The computer system polls the keyboard every 10 ms (milli seconds) to check for a keystroke and consumes 100 \(\mu\)s (micro seconds) for each poll. If it is determined after polling that a key has been pressed, the system consumes an additional 200 \(\mu\)s to process the keystroke. Let \( T_1 \) denote the fraction of a second spent in polling and processing a keystroke.
In an alternative implementation, the system uses interrupts instead of polling. An interrupt is raised for every keystroke. It takes a total of 1 ms for servicing an interrupt and processing a keystroke. Let \( T_2 \) denote the fraction of a second spent in servicing the interrupt and processing a keystroke.
The ratio \( \frac{T_1}{T_2} \) is ________. (Rounded off to one decimal place)

Official answer (numeric): 10.2 to 10.2

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

**2023_FN_Q64** · 2023-FN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

An 8-way set associative cache of size 64 KB (1 KB = 1024 bytes) is used in a system with 32-bit address. The address is sub-divided into TAG, INDEX, and BLOCK OFFSET.
The number of bits in the TAG is ________.

Official answer (numeric): 19 to 19

---

**2022_FN_Q17** · 2022-FN · MCQ · 1 mark · Easy · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Which one of the following facilitates transfer of bulk data from hard disk to main memory with the highest throughput?

- A) DMA based I/O transfer  ✔ official
- B) Interrupt driven I/O transfer
- C) Polling based I/O transfer
- D) Programmed I/O transfer

---

**2022_FN_Q24** · 2022-FN · MSQ · 1 mark · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Let WB and WT be two set associative cache organizations that use LRU algorithm for cache block replacement. WB is a write back cache and WT is a write through cache. Which of the following statements is/are FALSE?

- A) Each cache block in WB and WT has a dirty bit.  ✔ official
- B) Every write hit in WB leads to a data transfer from cache to main memory.  ✔ official
- C) Eviction of a block from WT will not lead to data transfer from cache to main memory.
- D) A read miss in WB will never lead to eviction of a dirty block from WB.  ✔ official

---

**2022_FN_Q33** · 2022-FN · NAT · 1 mark · Hard · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

A cache memory that has a hit rate of 0.8 has an access latency 10 ns and miss penalty 100 ns. An optimization is done on the cache to reduce the miss rate. However, the optimization results in an increase of cache access latency to 15 ns, whereas the miss penalty is not affected. The minimum hit rate (rounded off to two decimal places) needed after the optimization such that it should not increase the average memory access time is __________.

Official answer (numeric): 0.85 to 0.85

---

**2022_FN_Q54** · 2022-FN · MSQ · 2 marks · Hard · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a system with 2 KB direct mapped data cache with a block size of 64 bytes. The system has a physical address space of 64 KB and a word length of 16 bits. During the execution of a program, four data words P, Q, R, and S are accessed in that order 10 times (i.e., PQRSPQRS ...). Hence, there are 40 accesses to data cache altogether. Assume that the data cache is initially empty and no other data words are accessed by the program. The addresses of the first bytes of P, Q, R, and S are 0xA248, 0xC28A, 0xCA8A, and 0xA262, respectively. For the execution of the above program, which of the following statements is/are TRUE with respect to the data cache?

- A) Every access to S is a hit.  ✔ official
- B) Once P is brought to the cache it is never evicted.  ✔ official
- C) At the end of the execution only R and S reside in the cache.
- D) Every access to R evicts Q from the cache.  ✔ official

---

**2022_FN_Q61** · 2022-FN · NAT · 2 marks · Hard · bank topic: Instruction Pipelining, Performance, Hazard Management

A processor \(X_1\) operating at 2 GHz has a standard 5-stage RISC instruction pipeline having a base CPI (cycles per instruction) of one without any pipeline hazards. For a given program P that has 30% branch instructions, control hazards incur 2 cycles stall for every branch. A new version of the processor \(X_2\) operating at same clock frequency has an additional branch predictor unit (BPU) that completely eliminates stalls for correctly predicted branches. There is neither any savings nor any additional stalls for wrong predictions. There are no structural hazards and data hazards for \(X_1\) and \(X_2\). If the BPU has a prediction accuracy of 80%, the speed up (rounded off to two decimal places) obtained by \(X_2\) over \(X_1\) in executing P is _________.

Official answer (numeric): 1.42 to 1.45

---

**2021_AN_Q65** · 2021-AN · NAT · 1 mark · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a set-associative cache of size 2 KB (1 KB = \(2^{10}\) bytes) with cache block size of 64 bytes. Assume that the cache is byte-addressable and a 32-bit address is used for accessing the cache. If the width of the tag field is 22 bits, the associativity of the cache is _________.

Official answer (numeric): 2 to 2

---

**2021_AN_Q11** · 2021-AN · NAT · 1 mark · Medium · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Consider a computer system with DMA support. The DMA module is transferring one 8-bit character in one CPU cycle from a device to memory through cycle stealing at regular intervals. Consider a 2 MHz processor. If 0.5% processor cycles are used for DMA, the data transfer rate of the device is _____ bits per second.

Official answer (numeric): 80000 to 80000

---

**2021_FN_Q51** · 2021-FN · NAT · 1 mark · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a computer system with a byte-addressable primary memory of size \(2^{32}\) bytes. Assume the computer system has a direct-mapped cache of size 32 KB (1 KB = \(2^{10}\) bytes), and each cache block is of size 64 bytes.
The size of the tag field is _________ bits.

Official answer (numeric): 17 to 17

---

**2021_AN_Q39** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Assume a two-level inclusive cache hierarchy, L1 and L2, where L2 is the larger of the two. Consider the following statements.
\(S_1\) : Read misses in a write through L1 cache do not result in writebacks of dirty lines to the L2.
\(S_2\) : Write allocate policy must be used in conjunction with write through caches and no-write allocate policy is used with writeback caches.
Which of the following statements is correct?

- A) \(S_1\) is true and \(S_2\) is false.  ✔ official
- B) \(S_1\) is false and \(S_2\) is true.
- C) \(S_1\) is true and \(S_2\) is true.
- D) \(S_1\) is false and \(S_2\) is false.

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

**2020_FN_Q33** · 2020-FN · MCQ · 1 mark · Medium · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Consider the following statements:
I. Daisy chaining is used to assign priorities in attending interrupts.
II. When a device raises a vectored interrupt, the CPU does polling to identify the source of interrupt.
III. In polling, the CPU periodically checks the status bits to know if any device needs its attention.
IV. During DMA, both the CPU and DMA controller can be bus masters at the same time.
Which of the above statements is/are TRUE?

- A) I and II only
- B) I and IV only
- C) I and III only  ✔ official
- D) III only

---

**2020_FN_Q30** · 2020-FN · MCQ · 1 mark · Medium · bank topic: ALU, Control Unit Design, Data-Path Operations · HAS A FIGURE (not shown here)

Consider the following data path diagram.
[IMAGE_Q_30]
Consider an instruction: R0 \(\leftarrow\) R1 + R2. The following steps are used to execute it over the given data path. Assume that PC is incremented appropriately. The subscripts r and w indicate read and write operations, respectively.
1. \( R2_r \), \( TEMP1_r \), \( ALU_{add} \), \( TEMP2_w \)
2. \( R1_r \), \( TEMP1_w \)
3. \( PC_r \), \( MAR_w \), \( MEM_r \)
4. \( TEMP2_r \), \( R0_w \)
5. \( MDR_r \), \( IR_w \)
Which one of the following is the correct order of execution of the above steps?

- A) 2, 1, 4, 5, 3
- B) 1, 2, 4, 3, 5
- C) 3, 5, 2, 1, 4  ✔ official
- D) 3, 5, 1, 2, 4

---

**2020_FN_Q27** · 2020-FN · NAT · 1 mark · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

A direct mapped cache memory of 1 MB has a block size of 256 bytes. The cache has an access time of 3 ns and a hit rate of 94%. During a cache miss, it takes 20 ns to bring the first word of a block from the main memory, while each subsequent word takes 5 ns. The word size is 64 bits. The average memory access time in ns (round off to 1 decimal place) is ________.

Official answer (numeric): 13.3 to 13.3 OR 13.5 to 13.5

---

**2020_FN_Q55** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

A computer system with a word length of 32 bits has a 16 MB byte-addressable main memory and a 64 KB, 4-way set associative cache memory with a block size of 256 bytes. Consider the following four physical addresses represented in hexadecimal notation.
A1 = 0x42C8A4, A2 = 0x546888, A3 = 0x6A289C, A4 = 0x5E4880
Which one of the following is TRUE?

- A) A1 and A4 are mapped to different cache sets.
- B) A2 and A3 are mapped to the same cache set.  ✔ official
- C) A3 and A4 are mapped to the same cache set.
- D) A1 and A3 are mapped to the same cache set.

---

**2020_FN_Q43** · 2020-FN · NAT · 2 marks · Hard · bank topic: Instruction Pipelining, Performance, Hazard Management

Consider a non-pipelined processor operating at 2.5 GHz. It takes 5 clock cycles to complete an instruction. You are going to make a 5-stage pipeline out of this processor. Overheads associated with pipelining force you to operate the pipelined processor at 2 GHz. In a given program, assume that 30% are memory instructions. 60% are ALU instructions and the rest are branch instructions. 5% of the memory instructions cause stalls of 50 clock cycles each due to cache misses and 50% of the branch instructions cause stalls of 2 cycles each. Assume that there are no stalls associated with the execution of ALU instructions. For this program, the speedup achieved by the pipelined processor over the non-pipelined processor (round off to 2 decimal places) is ________.

Official answer (numeric): 2.15 to 2.18

---

**2020_FN_Q63** · 2020-FN · NAT · 2 marks · Medium · bank topic: Machine Instructions & Addressing Modes

A processor has 64 registers and uses 16-bit instruction format. It has two types of instructions: I-type and R-type. Each I-type instruction contains an opcode, a register name, and a 4-bit immediate value. Each R-type instruction contains an opcode and two register names. If there are 8 distinct I-type opcodes, then the maximum number of distinct R-type opcodes is ________.

Official answer (numeric): 14 to 14

---

**2019_FN_Q11** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

A certain processor uses a fully associative cache of size 16 kB. The cache block size is 16 bytes. Assume that the main memory is byte addressable and uses a 32-bit address. How many bits are required for the Tag and the Index fields respectively in the addresses generated by the processor?

- A) 24 bits and 0 bits
- B) 28 bits and 4 bits
- C) 24 bits and 4 bits
- D) 28 bits and 0 bits  ✔ official

---

**2019_FN_Q60** · 2019-FN · NAT · 2 marks · Hard · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

A certain processor deploys a single-level cache. The cache block size is 8 words and the word size is 4 bytes. The memory system uses a 60 MHz clock. To service a cache miss, the memory controller first takes 1 cycle to accept the starting address of the block, it then takes 3 cycles to fetch all the eight words of the block, and finally transmits the words of the requested block at the rate of 1 word per cycle. The maximum bandwidth for the memory system when the program running on the processor issues a series of read operations is _________ \( \times 10^6 \) bytes/sec.

Official answer (numeric): 160 to 160

---

**2018_FN_Q15** · 2018-FN · MCQ · 1 mark · Easy · bank topic: ALU, Control Unit Design, Data-Path Operations

Consider the following processor design characteristics.
I. Register-to-register arithmetic operations only
II. Fixed-length instruction format
III. Hardwired control unit
Which of the characteristics above are used in the design of a RISC processor?

- A) I and II only
- B) II and III only
- C) I and III only
- D) I, II and III  ✔ official

---

**2018_FN_Q19** · 2018-FN · MCQ · 1 mark · Easy · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

The following are some events that occur after a device controller issues an interrupt while process \(L\) is under execution.
(P) The processor pushes the process status of \(L\) onto the control stack.
(Q) The processor finishes the execution of the current instruction.
(R) The processor executes the interrupt service routine.
(S) The processor pops the process status of \(L\) from the control stack.
(T) The processor loads the new PC value based on the interrupt.
Which one of the following is the correct order in which the events above occur?

- A) QPTRS  ✔ official
- B) PTRSQ
- C) TRPQS
- D) QTPRS

---

**2018_FN_Q33** · 2018-FN · NAT · 1 mark · Medium · bank topic: Main Memory & Virtual Memory Mechanics

A 32-bit wide main memory unit with a capacity of 1 GB is built using 256M \(\times\) 4-bit DRAM chips. The number of rows of memory cells in the DRAM chip is \(2^{14}\). The time taken to perform one refresh operation is 50 nanoseconds. The refresh period is 2 milliseconds. The percentage (rounded to the closest integer) of the time available for performing the memory read/write operations in the main memory unit is __________.

Official answer (numeric): 59.0 to 60.0

---

**2018_FN_Q44** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

The size of the physical address space of a processor is \(2^P\) bytes. The word length is \(2^W\) bytes. The capacity of cache memory is \(2^N\) bytes. The size of each cache block is \(2^M\) words. For a \(K\)-way set-associative cache memory, the length (in number of bits) of the tag field is

- A) \(P - N - \log_2 K\)
- B) \(P - N + \log_2 K\)  ✔ official
- C) \(P - N - M - W - \log_2 K\)
- D) \(P - N - M - W + \log_2 K\)

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

**2017_FN_Q20** · 2017-FN · NAT · 1 mark · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a two-level cache hierarchy with \(\text{L}_1\) and \(\text{L}_2\) caches. An application incurs 1.4 memory accesses per instruction on average. For this application, the miss rate of \(\text{L}_1\) cache is 0.1; the \(\text{L}_2\) cache experiences, on average, 7 misses per 1000 instructions. The miss rate of \(\text{L}_2\) expressed correct to two decimal places is________.

Official answer (numeric): 0.05 to 0.05

---

**2017_AN_Q47** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

In a two-level cache system, the access times of \(\text{L}_1\) and \(\text{L}_2\) caches are 1 and 8 clock cycles, respectively. The miss penalty from the \(\text{L}_2\) cache to main memory is 18 clock cycles. The miss rate of \(\text{L}_1\) cache is twice that of \(\text{L}_2\). The average memory access time (AMAT) of this cache system is 2 cycles. The miss rates of \(\text{L}_1\) and \(\text{L}_2\) respectively are:

- A) 0.111 and 0.056  ✔ official
- B) 0.056 and 0.111
- C) 0.0892 and 0.1784
- D) 0.1784 and 0.0892

---

**2017_AN_Q39** · 2017-AN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping) · HAS A FIGURE (not shown here)

The read access times and the hit ratios for different caches in a memory hierarchy are as given below.
[IMAGE_Q_39]
The read access time of main memory is 90 nanoseconds. Assume that the caches use the referred word-first read policy and the write back policy. Assume that all the caches are direct mapped caches. Assume that the dirty bit is always 0 for all the blocks in the caches. In execution of a program, 60% of memory reads are for instruction fetch and 40% are for memory operand fetch. The average read access time in nanoseconds (upto 2 decimal places) is ________.

Official answer (numeric): 4.72 to 4.72

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

---

**2017_FN_Q53** · 2017-FN · NAT · 2 marks · Hard · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a 2-way set associative cache with 256 blocks and uses LRU replacement. Initially the cache is empty. Conflict misses are those misses which occur due to contention of multiple blocks for the same cache set. Compulsory misses occur due to first time access to the block. The following sequence of accesses to memory blocks
\((0, 128, 256, 128, 0, 128, 256, 128, 1, 129, 257, 129, 1, 129, 257, 129)\)
is repeated 10 times. The number of conflict misses experienced by the cache is________.

Official answer (numeric): 76.0 to 76.0

---

**2017_AN_Q36** · 2017-AN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a machine with a byte addressable main memory of \(2^{32}\) bytes divided into blocks of size 32 bytes. Assume that a direct mapped cache having 512 cache lines is used with this machine. The size of the tag field in bits is ________.

Official answer (numeric): 18.0 to 18.0

---

**2017_FN_Q65** · 2017-FN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

A cache memory unit with capacity of N words and block size of B words is to be designed. If it is designed as a direct mapped cache, the length of the TAG field is 10 bits. If the cache unit is now designed as a 16-way set-associative cache, the length of the TAG field is________bits.

Official answer (numeric): 14.0 to 14.0

---

