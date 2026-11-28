import type { Topic } from "@/lib/study/schema";

/**
 * Computer Organisation chapter O1 "Machine instructions and addressing modes" (29 Nov 2026). Instruction formats, opcode and operand fields, expanding opcodes, load-store against memory
 * operands, the addressing modes and what each is used for, PC-relative branches. Real GATE questions (texts from public/data/questions.json), each re-solved here: 2026 FN Q14 (modes against
 * data: B), 2026 FN Q15 (load-store sequence: D), 2026 AN Q44 (expanding opcodes: 4), 2025 FN Q37 (immediate bits: 20), 2024 AN Q49 (32 opcodes), 2024 AN Q43 (34), 2023 FN Q41 (B),
 * 2021 FN Q38 (50), 2020 FN Q63 (14), 2018 FN Q61 (32), 2017 FN Q27 (D), 2017 FN Q60 (-16).
 * Programs compiled and run with gcc: the opcode space of an expanding-opcode design; the 2021 loop on a model machine.
 */
export const chapterO1: Topic = {
  id: "cs.coa.v2.isa1",
  title: "Machine instructions and addressing modes",
  no: "O1",
  book: [
    { t: "p", text: "A program reaches the processor as a stream of **machine instructions**: bit patterns that name an operation and its operands. This chapter is about the shape of those patterns. How many bits does the opcode need? How many are left for the registers and the constant? How does an instruction say where its data is? The questions in the paper are almost all counting questions about a bit budget, plus a few that ask which addressing mode suits which data structure." },
    { t: "p", text: "The chapter carries 12 real GATE questions, a large share of the Computer Organisation marks that do not need a pipeline diagram. They are also the easiest marks in the subject once the bit-budget method is clear, because every one reduces to the same two steps: add up the fixed fields, then give what is left to the opcode." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["split an instruction word into opcode, register, mode and immediate fields and count the bits of each;", "design and count **expanding opcodes** in a variable-length opcode scheme;", "tell a load-store (RISC) instruction sequence from a memory-operand one;", "name the addressing modes and say which data structure each one reaches;", "compute a PC-relative branch offset from the addresses of the instructions."] },

    { t: "h2", text: "What an instruction contains" },
    { t: "p", text: "An instruction has an **opcode**, which says what to do (add, load, branch), and zero or more **operands**, which say what to do it to. An operand can be a **register** (a register number, 4 bits for 16 registers, 6 bits for 64), an **immediate** (a constant stored inside the instruction), or a **memory address**. Some formats also carry an **addressing-mode** field that says how to read the operand. In a fixed-length format the pieces together fill the instruction word exactly: 16, 32 bits." },
    { t: "p", text: "The number of bits for a field follows from how many values it must distinguish. A field that names one of n things needs ⌈log₂ n⌉ bits: 50 registers need 6 bits (since 2⁵ = 32 < 50 ≤ 64), 150 instructions need 8 bits, 8 addressing modes need 3 bits. The ceiling matters: 50 registers do not fit in 5 bits." },
    { t: "p", text: "The number of operands in an instruction is its **address count**. A three-address instruction names two sources and a destination (ADD R1, R2, R3 means R1 ← R2 + R3). A two-address instruction overwrites one source (ADD R1, R2 means R1 ← R1 + R2). A one-address instruction uses an implicit register, the **accumulator**. A zero-address instruction uses a **stack**: it pops its operands and pushes the result." },
    { t: "ex", id: "o1-e1" },
    { t: "fig", id: "o1-f1" },
    { t: "callout", kind: "key", text: "Bit budget: instruction length = opcode + (mode) + register fields + immediate/address. Give each fixed field ⌈log₂ n⌉ bits; the opcode takes what is left, and the number of opcodes is 2 to the opcode bits." },

    { t: "h2", text: "Counting immediate and opcode bits" },
    { t: "p", text: "The easy form of the question fixes everything except one field. A 32-bit instruction on a processor with 64 registers and 50 instruction types: ADD R1, #25 has an opcode (50 types need 6 bits), a register (64 registers need 6 bits) and an immediate. The most bits left for the immediate are 32 − 6 − 6 = **20**. This is GATE 2025 (option B)." },
    { t: "p", text: "The second form asks for the number of opcodes. A 32-bit format with an opcode field, a mode field, two register fields and a 16-bit scalar, with 16 registers and 8 modes: two registers use 4 + 4 = 8 bits, the mode uses 3 bits, the scalar 16, so the opcode has 32 − 8 − 3 − 16 = 5 bits, which gives **32 distinct opcodes** (GATE 2024 AN)." },
    { t: "p", text: "The third form splits the instructions into types and wants several fields at once. GATE 2024 AN has 150 instructions, equally split between R-type and I-type, so 75 of each. One opcode bit says which type; the other bits say which operation among the 75, which needs 7 bits (2⁷ = 128 ≥ 75). So the opcode is Y = 1 + 7 = 8 bits. The 50 registers need 6 bits each. The R-type word holds the opcode, UNUSED, three register fields: 8 + X + 18 = 32, so X = 6. The I-type word holds the opcode, two registers and the immediate: 8 + 12 + Z = 32, so Z = 12. Then X + 2Y + Z = 6 + 16 + 12 = **34**." },
    { t: "ex", id: "o1-e2" },
    { t: "ex", id: "o1-e3" },

    { t: "h2", text: "Expanding opcodes" },
    { t: "p", text: "When different instructions have operands of different sizes, a fixed-width opcode wastes bits. An instruction that needs few operand bits can use a longer opcode. In an **expanding opcode** (variable-length opcode) scheme the short opcodes belong to the instructions with the most operand bits, and one pattern of the short opcodes is kept as a **prefix** that is extended by extra bits to give many long opcodes for the instructions with fewer operand bits." },
    { t: "p", text: "The method is a count of **codes in the smallest unit**. Start with the shortest opcode length k₁ and count its 2^k₁ codes. Each instruction group that uses a k₁-bit opcode takes some of them; if the next group has a k₂-bit opcode, then every unused k₁-bit code is expanded into 2^(k₂ − k₁) codes of k₂ bits, and so on. Subtract what each group uses, multiply the leftovers by the expansion factor, and the last group's maximum is what remains." },
    { t: "p", text: "Work GATE 2018. Instructions are 16 bits long, with 16 integer registers (4 bits) and 64 floating-point registers (6 bits). Type-1 has three integer registers: 12 bits of operands, so a 4-bit opcode, and four instructions. Type-2 has two floating-point registers: 12 bits, 4-bit opcode, eight instructions. Type-3 has one integer and one floating register: 4 + 6 = 10 bits, so a 6-bit opcode, fourteen instructions. Type-4 has one floating register: 6 bits, so a 10-bit opcode, and N instructions." },
    { t: "p", text: "Count in 4-bit codes. There are 16. Types 1 and 2 use 4 + 8 = 12, leaving 4. Expand to 6 bits: each 4-bit code gives 4 six-bit codes, so 16. Type 3 uses 14, leaving 2. Expand to 10 bits: each 6-bit code gives 16 ten-bit codes, so 32. The maximum N is **32**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    long codes = 1L << 4;                  /* 16 four-bit opcodes */
    codes -= 4 + 8;                        /* type 1 and type 2 use 12 */
    codes <<= 2;                           /* expand to six bits: each code gives 4 */
    codes -= 14;                           /* type 3 */
    codes <<= 4;                           /* expand to ten bits: each code gives 16 */
    printf("%ld\\n", codes);                /* the most type-4 instructions */
    return 0;
}`, out: "32", file: "expanding_opcodes.c" },
    { t: "ex", id: "o1-e4" },
    { t: "fig", id: "o1-f2" },
    { t: "p", text: "The same method answers GATE 2020: 64 registers (6 bits), 16-bit words, I-type has a register and 4 immediate bits (10 operand bits, 6-bit opcode, 8 of them) and R-type has two registers (12 operand bits, 4-bit opcode). Count in 6-bit codes: 64 − 8 = 56 left; every R-type 4-bit opcode takes 4 six-bit codes, so there are 56 ÷ 4 = **14** R-type opcodes." },
    { t: "p", text: "And GATE 2026 AN: 16 registers, 2-byte instructions. M-type has two registers and a 6-bit immediate: 14 operand bits, a 2-bit opcode, and 2 are used. R-type has three registers: 12 bits, 4-bit opcode. C-type has one register and a 6-bit offset: 10 bits, 6-bit opcode. In 2-bit codes: 4 − 2 = 2 left; expand to 4 bits: 8; R-type uses 7, so 1 left; expand to 6 bits: 4. The most C-type opcodes are **4**." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Load-store and memory-operand machines" },
    { t: "p", text: "A **load-store** architecture touches memory only with **load** and **store** instructions; every arithmetic instruction works on registers. A statement Z = X + Y, with X, Y and Z in memory, then becomes four instructions: LOAD R0, X; LOAD R1, Y; ADD R2, R0, R1; STORE Z, R2. This is GATE 2026 FN: the format puts the destination first, the machine is load-store, so an ADD that names memory (options A, B, C) is not allowed, and only **D** is correct." },
    { t: "p", text: "A machine that allows memory operands in arithmetic could do the same in fewer instructions (ADD Z, X, Y in one), at the price of variable-length and slower instructions, as the RISC and CISC comparison of the first chapter said. Load-store is what makes a clean pipeline possible, which is why the paper assumes it whenever it draws pipeline stages." },
    { t: "ex", id: "o1-e5" },
    { t: "ex", id: "o1-e9" },

    { t: "h2", text: "Addressing modes" },
    { t: "p", text: "An **addressing mode** is the rule that turns the bits of an operand field into the actual operand. The **effective address** (EA) is the memory address the rule produces. The modes the paper tests are these." },
    { t: "table", head: ["Mode", "Operand", "Effective address", "Used for"], rows: [
      ["Immediate", "the field itself", "none", "constants"],
      ["Register direct", "the register", "none", "local variables in registers"],
      ["Direct (absolute)", "memory at the field", "EA = field", "static variables"],
      ["Indirect", "memory at (memory at the field)", "EA = Mem[field]", "pointers"],
      ["Register indirect", "memory at the register", "EA = R", "pointers, one array element"],
      ["Base + displacement", "memory at register + constant", "EA = R + d", "a field of a record or struct"],
      ["Indexed (base + index)", "memory at base + index register", "EA = base + R·scale", "an array element a[i]"],
      ["PC-relative", "memory at PC + constant", "EA = PC + d", "branch targets, position-independent code"],
      ["Auto-increment / decrement", "memory at the register, then register ± size", "EA = R", "stepping through an array, stacks"],
    ], caption: "The addressing modes of the paper and the data structure each is for." },
    { t: "p", text: "Match modes to data. A **constant** in the program is an immediate. A **pointer** is reached by an indirect (or register-indirect) access. An **element of an array** needs a base plus an index that changes with i. A **field of a record** (a struct member) sits at a fixed offset from the record's base address, so it is a base plus displacement. Hence GATE 2026 FN: immediate with constant, indirect with pointer, base with index with array element, base with offset with record element: **P-4, Q-2, R-1, S-3** (option B)." },
    { t: "p", text: "GATE 2017 asks which mode reaches student.grade in struct data { int marks[100]; char grade; int cnumber; } with the base address in R1. The field is at the fixed offset 400 from R1. Post-increment and pre-decrement change R1 and do not add an offset; register direct reads R1 itself. Only **index (base plus displacement) X(R1)**, with X = 400 as a 16-bit signed offset, reaches it efficiently (option D)." },
    { t: "ex", id: "o1-e6" },

    { t: "h2", text: "Branches and PC-relative addressing" },
    { t: "p", text: "A branch changes the program counter. In **PC-relative** addressing the instruction holds a signed **offset** that is added to the PC. Two details decide the numbers. First, the PC has already moved on to the **next** instruction by the time the branch is executed, so the offset is measured from the address of the instruction after the branch. Second, the offset is in **bytes** when the question says so, and instructions occupy 4 bytes (or whatever the question says), so one instruction is 4 offset units." },
    { t: "p", text: "GATE 2017: instructions i, i+1, i+2, i+3 are add, sub, cmp and beq, and the beq at i+3 targets instruction i. The next instruction after beq is i+4, which is 4 instructions past i, so the target is 4 × 4 = 16 bytes behind it: the offset is **−16**." },
    { t: "ex", id: "o1-e7" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int r1 = 10, r3 = 0;                  /* R1 = Memory[5000] = 10; R3 is the offset from 3000 */
    int cell[11];
    for (int i = 0; i < 11; i++) cell[i] = 50;      /* locations 3000 to 3010 each hold 50 */
    while (r1 != 0) {
        cell[r3] = cell[r3] + r1;         /* MOV R2,(R3); ADD R2,R1; MOV (R3),R2 */
        r3++;                             /* INC R3 */
        r1--;                             /* DEC R1 */
    }                                      /* BNZ 1004 repeats while R1 is not zero */
    printf("%d\\n", cell[10]);
    return 0;
}`, out: "50", file: "memory_loop.c" },
    { t: "p", text: "That program is the model for GATE 2021, a loop in which an instruction table gives each instruction's size. Always read the table: the addresses matter only for the branch, and the question asks about the **content of memory location 3010**, which the loop never reaches." },
    { t: "ex", id: "o1-e8" },
    { t: "fig", id: "o1-f3" },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Instruction = opcode (+ mode) + operands. A field distinguishing n things needs ⌈log₂ n⌉ bits; 50 registers need 6 bits.", "Bit budget: opcode bits = word − fixed fields. 32−6−6 = 20 immediate bits; 5 opcode bits give 32 opcodes.", "Expanding opcodes: count in the smallest code unit, subtract what each group uses, multiply the rest by the expansion factor.", "Load-store: arithmetic on registers only; Z = X + Y takes LOAD, LOAD, ADD, STORE.", "Immediate = constant; indirect = pointer; base + index = array element; base + displacement = record field.", "PC-relative offset is counted from the next instruction, in bytes: a backward branch over 4 four-byte instructions has offset −16."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "o1-f1", caption: "A 32-bit three-address instruction word. The register fields have ⌈log₂ 50⌉ = 6 bits each; the opcode takes whatever the other fields leave.", alt: "A table of the fields of a 32-bit instruction with the number of bits of each.", fig: { kind: "trace", title: "R-type word of GATE 2024 AN Q43", cols: ["field", "bits", "why"], rows: [
      { cells: ["OPCODE", 8, "1 type bit + 7 operation bits (75 ≤ 128)"] }, { cells: ["UNUSED", 6, "32 − 8 − 18"], tone: "ok" }, { cells: ["DST register", 6, "50 registers → 6"] }, { cells: ["SRC register 1", 6, "6"] }, { cells: ["SRC register 2", 6, "6"] }, { cells: ["total", 32, "8 + 6 + 18"] },
    ] } },
    { type: "figure", id: "o1-f2", caption: "The opcode space of GATE 2018 in units of four-bit codes. Two groups use 12 of 16 codes; the 4 left are expanded to 16 six-bit codes; 14 are used; the 2 left give 32 ten-bit codes.", alt: "A table that follows the count of free opcode codes through the four types of instruction.", fig: { kind: "trace", title: "Free codes through the expansion", cols: ["step", "codes free", "bits"], rows: [
      { cells: ["start", 16, "4"] }, { cells: ["types 1 and 2 use 4 + 8", 4, "4"], changed: [1] }, { cells: ["expand: × 4", 16, "6"], changed: [1, 2] }, { cells: ["type 3 uses 14", 2, "6"], changed: [1] }, { cells: ["expand: × 16", 32, "10"], changed: [1, 2], tone: "ok" },
    ] } },
    { type: "figure", id: "o1-f3", caption: "The loop of GATE 2021. R1 counts down from 10 and R3 walks up the bytes 3000, 3001, … so the loop writes 3000 to 3009 and never touches 3010.", alt: "A table of the register values at the start of each pass of the loop.", fig: { kind: "trace", title: "The loop on the model machine", cols: ["pass", "R1 before", "R3 before", "writes"], rows: [
      { cells: [1, 10, 3000, "3000"] }, { cells: [2, 9, 3001, "3001"] }, { cells: [3, 8, 3002, "3002"] }, { cells: ["…", "…", "…", "…"] }, { cells: [10, 1, 3009, "3009"] }, { cells: ["exit", 0, 3010, "none"], tone: "ok" },
    ] } },

    { type: "example", id: "o1-e1", level: "gate", title: "GATE CS 2025 (forenoon), Q37 · 2 marks · the immediate field of a 32-bit instruction", file: "gate2025_fn_q37.txt", given: `A processor has 64 general-purpose registers and 50 distinct instruction types. An instruction is encoded in 32 bits. The maximum number of bits for the immediate operand of ADD R1, #25 is?
A) 16   B) 20   C) 22   D) 24`, find: "The bits left for the immediate.", steps: [
      { say: "50 instruction types need ⌈log₂ 50⌉ = 6 opcode bits.", result: "6" },
      { say: "The register R1 is one of 64: 6 bits.", result: "6" },
      { say: "The rest is the immediate: 32 − 6 − 6.", result: "20" },
    ], answer: "B (20)", check: "6 + 6 + 20 = 32." },
    { type: "example", id: "o1-e2", level: "gate", title: "GATE CS 2024 (afternoon), Q49 · 2 marks · opcodes per addressing mode", file: "gate2024_an_q49.txt", given: `A processor with 16 general-purpose registers uses a 32-bit instruction: opcode, addressing mode, two register fields and a 16-bit scalar. With 8 addressing modes, the maximum number of unique opcodes is?`, find: "The number of opcodes.", steps: [
      { say: "Two register fields: 4 + 4 bits.", result: "8" },
      { say: "8 modes: 3 bits. Scalar: 16 bits.", result: "19" },
      { say: "Opcode bits = 32 − 8 − 3 − 16.", result: "5" },
      { say: "5 bits give 2⁵ opcodes.", result: "32" },
    ], answer: "32", check: "5 + 3 + 8 + 16 = 32." },
    { type: "example", id: "o1-e3", level: "gate", title: "GATE CS 2024 (afternoon), Q43 · 2 marks · opcode, unused and immediate bits", file: "gate2024_an_q43.txt", given: `A 32-bit instruction format, byte-addressable memory, 150 distinct instructions equally split between R-type (OPCODE, UNUSED, DST, SRC1, SRC2) and I-type (OPCODE, DST, SRC, immediate/address). One opcode bit separates the types. There are 50 registers, all register fields of equal size. X = bits of UNUSED, Y = bits of OPCODE, Z = bits of the immediate. Find X + 2Y + Z.`, find: "X + 2Y + Z.", steps: [
      { say: "75 instructions per type need 7 bits; plus the type bit.", result: "Y = 8" },
      { say: "50 registers need 6 bits each.", result: "6" },
      { say: "R-type: 8 + X + 18 = 32.", result: "X = 6" },
      { say: "I-type: 8 + 12 + Z = 32.", result: "Z = 12" },
      { say: "X + 2Y + Z = 6 + 16 + 12.", result: "34" },
    ], answer: "34", check: "Both formats add to 32 bits." },
    { type: "example", id: "o1-e4", level: "gate", title: "GATE CS 2018 (forenoon), Q61 · 2 marks · the most instructions of the last type", file: "gate2018_fn_q61.txt", given: `A processor has 16 integer registers and 64 floating-point registers and a 2-byte instruction. Type-1: four instructions, 3 integer registers. Type-2: eight instructions, 2 floating-point registers. Type-3: fourteen instructions, 1 integer and 1 floating-point register. Type-4: N instructions, 1 floating-point register. The maximum N?`, find: "N.", steps: [
      { say: "Operand bits: type 1 = 12, type 2 = 12, type 3 = 4 + 6 = 10, type 4 = 6. Opcode lengths: 4, 4, 6, 10.", result: "4, 4, 6, 10" },
      { say: "4-bit codes: 16 − 4 − 8 = 4 left.", result: "4" },
      { say: "To 6 bits: 4 × 4 = 16; type 3 takes 14; 2 left.", result: "2" },
      { say: "To 10 bits: 2 × 16.", result: "32" },
    ], answer: "32", check: "The program in this chapter prints 32." },
    { type: "example", id: "o1-e5", level: "gate", title: "GATE CS 2026 (forenoon), Q15 · 1 mark · Z = X + Y on a load-store machine", file: "gate2026_fn_q15.txt", given: `A load-store processor; the destination is the first operand; X, Y, Z are memory operands; R0, R1, R2 are registers. Which sequence performs Z = X + Y?
A) ADD Z, X, Y   B) LOAD R0, X; ADD Z, R0, Y   C) ADD R0, X, Y; STORE Z, R0   D) LOAD R0, X; LOAD R1, Y; ADD R2, R0, R1; STORE Z, R2`, find: "The correct sequence.", steps: [
      { say: "Load-store: ADD may use registers only. Options A, B and C give ADD a memory operand.", result: "not allowed" },
      { say: "D loads both operands, adds in registers, stores the result.", result: "D" },
    ], answer: "D", check: "Only LOAD and STORE name memory." },
    { type: "example", id: "o1-e6", level: "gate", title: "GATE CS 2026 (forenoon), Q14 · 1 mark · addressing modes against data", file: "gate2026_fn_q14.txt", given: `Match P Immediate, Q Indirect, R Base with index, S Base with offset/displacement to 1 element of an array, 2 pointer, 3 element of a record, 4 constant.
A) P-4, Q-3, R-1, S-2   B) P-4, Q-2, R-1, S-3   C) P-1, Q-4, R-3, S-2   D) P-2, Q-3, R-1, S-4`, find: "The matching.", steps: [
      { say: "Immediate holds the value itself: a constant (4).", result: "P-4" },
      { say: "Indirect follows an address stored somewhere: a pointer (2).", result: "Q-2" },
      { say: "Base with index: the index changes with i: array element (1).", result: "R-1" },
      { say: "Base with displacement: a fixed offset inside a record: a field (3).", result: "S-3" },
    ], answer: "B", check: "The mode table of this chapter gives the same four pairs." },
    { type: "example", id: "o1-e7", level: "gate", title: "GATE CS 2017 (forenoon), Q60 · 2 marks · a PC-relative branch offset", file: "gate2017_fn_q60.txt", given: `A RISC machine with 4-byte instructions. A branch uses PC-relative addressing with the offset in bytes from the address of the next instruction. The sequence is i: add R2,R3,R4; i+1: sub R5,R6,R7; i+2: cmp R1,R9,R10; i+3: beq R1, Offset. If the target of the branch is i, the value of Offset is?`, find: "The offset.", steps: [
      { say: "The beq is at i+3, so the next instruction is at i+4.", result: "i + 4" },
      { say: "The target i is 4 instructions behind i+4: 4 × 4 bytes.", result: "16 bytes back" },
      { say: "A backward branch has a negative offset.", result: "−16" },
    ], answer: "−16", check: "PC after fetch = address(i) + 16; adding −16 returns to i." },
    { type: "example", id: "o1-e8", level: "gate", title: "GATE CS 2021 (forenoon), Q38 · 2 marks · the loop and the byte at 3010", file: "gate2021_fn_q38.txt", given: `Registers R1, R2, R3. Program from 1000: MOV R1,(5000); MOV R2,(R3); ADD R2,R1; MOV (R3),R2; INC R3; DEC R1; BNZ 1004; HALT. Memory[5000] = 10, R3 = 3000, memory 3000 to 3010 each 50. After execution, the content of 3010 is?`, find: "Memory[3010].", steps: [
      { say: "R1 = 10 at the start; the loop body runs while R1 ≠ 0, so 10 times.", result: "10 passes" },
      { say: "R3 starts at 3000 and rises by 1 each pass; the passes write 3000 … 3009.", result: "3000..3009" },
      { say: "Location 3010 is never written: it keeps its value.", result: "50" },
    ], answer: "50", check: "The program in this chapter prints 50; the table shows R3 = 3010 only at the exit." },
    { type: "example", id: "o1-e9", level: "edge", title: "Code against assembly · a[i] = b[i] × 8 (GATE 2023 FN Q41)", file: "gate2023_fn_q41.txt", given: `int a[10], b[10]; for (i = 0; i < 10; i++) a[i] = b[i] * 8; with r1 = i, r2 = 10, r3 and r4 holding the base addresses of a and b. L01 jeq r1,r2,end; L02 lw r5,0(r4); L03 shl r5,r5,U1; L04 sw r5,0(r3); L05 add r3,r3,U2; L06 add r4,r4,U3; L07 add r1,r1,1; L08 jmp U4. Find (U1, U2, U3, U4).
A) (8,4,1,L02)   B) (3,4,4,L01)   C) (8,1,1,L02)   D) (3,1,1,L01)`, find: "The four operands.", steps: [
      { say: "× 8 is a left shift by 3 (8 = 2³), not by 8.", result: "U1 = 3" },
      { say: "int is 4 bytes and memory is byte addressed: each pointer moves 4 bytes per element.", result: "U2 = U3 = 4" },
      { say: "The jump returns to the test at the top, L01, so the loop test runs again.", result: "U4 = L01" },
    ], answer: "B", check: "Jumping to L02 would skip the test and read past the arrays." },

    { type: "trap", wrong: "50 registers need 5 bits.", tempting: "50 is close to 32 and it feels like a small number of bits.", whyWrong: "5 bits name only 32 registers. The number of bits is ⌈log₂ 50⌉ = 6. Counting 5 gives an opcode one bit too long and a wrong answer to every counting question in this chapter.", rule: "Bits for n items = ⌈log₂ n⌉, always rounded up.", ex: { text: "64 registers: 6 bits. 150 instructions: 8 bits (2⁷ = 128 < 150)." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q14, Q15 · 2026 AN Q44 · 2025 FN Q37 · 2024 AN Q49, Q43 · 2023 FN Q41 · 2021 FN Q38 · 2020 FN Q63 · 2018 FN Q61 · 2017 FN Q27, Q60. Count in the smallest code unit for expanding opcodes; read pointer step sizes in bytes." },
    { type: "recall", cards: [
      { q: "Bits to name n things?", a: "⌈log₂ n⌉, rounded up." },
      { q: "Opcodes available with b opcode bits?", a: "2ᵇ." },
      { q: "Three-address against two-address instruction?", a: "Three names two sources and a destination; two overwrites a source." },
      { q: "Expanding opcodes: the method?", a: "Count free codes in the smallest unit, subtract each group, multiply the rest by 2^(extra bits)." },
      { q: "What does a load-store machine allow?", a: "Only LOAD and STORE touch memory; ADD uses registers." },
      { q: "Mode for a constant?", a: "Immediate." },
      { q: "Mode for a pointer?", a: "Indirect or register indirect." },
      { q: "Mode for an array element?", a: "Base plus index." },
      { q: "Mode for a struct field?", a: "Base plus displacement." },
      { q: "From where is a PC-relative offset counted?", a: "The address of the next instruction." },
    ] },
    { type: "check", questions: [
      { id: "o1c1", kind: "NAT", marks: 1, q: "A processor has 128 registers and 40 instructions in a 24-bit instruction with one register field and an immediate. The most bits for the immediate are", answer: "11", solution: "128 registers: 7 bits; 40 opcodes: 6 bits; 24 − 7 − 6 = 11." },
      { id: "o1c2", kind: "MCQ", marks: 1, q: "A struct member at a fixed offset from the base address in a register is best reached with", options: ["Immediate", "Base plus displacement", "Auto-increment", "Direct"], answer: "B", solution: "Fixed offset from a base: displacement mode." },
      { id: "o1c3", kind: "NAT", marks: 2, q: "A 16-bit instruction word, 16 registers. Type-X: 3 register operands, 4 instructions. Type-Y: 1 register and a 6-bit immediate, 20 instructions. Type-Z: 1 register operand. The most Type-Z instructions possible are", answer: "1792", solution: "4-bit opcodes: 16 − 4 = 12 left; × 4 gives 48 six-bit codes; Type-Y uses 20, leaving 28; Type-Z has 4 operand bits so a 12-bit opcode: 28 × 2⁶ = 1792." },
      { id: "o1c4", kind: "MSQ", marks: 2, q: "Which instructions are NOT allowed on a pure load-store machine?", options: ["LOAD R1, X", "ADD R1, R2, R3", "ADD R1, X, R2", "STORE X, R1"], answer: "C", solution: "Only the ADD with a memory operand is excluded." },
      { id: "o1c5", kind: "NAT", marks: 2, q: "A branch at address 2000 (4-byte instructions) targets address 1980. The PC-relative offset in bytes is", answer: "-24", solution: "Next instruction at 2004; 1980 − 2004 = −24." },
      { id: "o1c6", kind: "MCQ", marks: 1, q: "An int array a[] has 4-byte elements and a base register R1 and index register R2 (holding i). The address of a[i] is", options: ["R1 + R2", "R1 + 4·R2", "R1 + 4", "R2 + 4"], answer: "B", solution: "Base + i × element size." },
      { id: "o1c7", kind: "NAT", marks: 2, q: "A 32-bit format has an opcode, 3 register fields (32 registers) and a 12-bit immediate. The number of opcodes is", answer: "32", solution: "3 × 5 = 15 register bits + 12 = 27; opcode 5 bits; 2⁵ = 32." },
      { id: "o1c8", kind: "MCQ", marks: 1, q: "The addressing mode in which the operand is part of the instruction is", options: ["Direct", "Indirect", "Immediate", "Register indirect"], answer: "C", solution: "Immediate: the constant is in the instruction." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on machine instructions", sub: "Computer Organisation", href: "/topics/computer-organization-and-architecture-coa" }, { label: "ALU, data path and control", sub: "the next chapter", href: "/study/alu-datapath-control" }] },
    { type: "links", prereq: ["Foundations (O0)", "Number representation (L1)"], usedIn: ["Pipelining (O3)", "Data path and control (O2)"], cross: ["Programming in C: pointers and arrays"] },
  ],
};
