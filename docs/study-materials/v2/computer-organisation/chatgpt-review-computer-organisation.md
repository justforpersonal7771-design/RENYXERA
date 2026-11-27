# Computer Organisation — in-depth beginner-first review

**Review date:** 27 November 2026  
**Source reviewed:** `Pasted text(2).txt` — *In-depth review input: Computer Organisation*  
**Scope:** the supplied v0 contents, its bank statistics, and all 72 PYQs as transcribed in Part C.

---

## Scope warning — read this before using the review

This upload is **not the full Computer Organisation book**. It says that six chapters have 3–4 old lessons each, but it does not include the lesson text, explanations, examples, diagrams or exercises. It is a contents list and a PYQ bank. Therefore:

- I can review the **coverage and order of the plan**, identify what a beginner-first book must teach, and audit all question text and keys that are visible.
- I cannot say that a particular old lesson explains something badly or that its diagram is missing from the app, because the lesson itself is not in this file. The gap table below is a list of **things the new plan must visibly include**; it is not a claim that the unseen app lesson definitely lacks each item.
- Nine questions explicitly depend on a figure or table that is not supplied. I identify them and do not pretend to verify the official numeric/key answer from an absent image.
- One additional question, `2023_FN_Q64`, is under-specified as pasted because it gives no cache block size.

The syllabus text in the upload matches the Computer Organization and Architecture line in the official GATE 2027 CS syllabus: instruction set/addressing modes, ALU, hardwired and microprogrammed control, memory interfacing and hierarchy/cache mapping, interrupt/DMA I/O, and pipelining/hazards. IIT Madras labels the 2027 syllabi as revised, so the new book should use the 2027 PDF as the controlling syllabus rather than an old coaching list: [official GATE 2027 CS syllabus PDF](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf).

---

# PART 1. FEELINGS — reading this as the student you described

1. I am relieved that the subject is divided into six chapters instead of being dumped into one enormous “computer architecture” chapter.
2. I can see the main GATE areas, but I cannot tell what I am supposed to learn first; the contents do not show a beginner path.
3. The title “ALU, data path and control unit” scares me because I do not know what a data path or a control signal is yet.
4. “Memory hierarchy” sounds like a big topic, but the contents do not tell me how a byte address becomes a tag, index and block offset.
5. “Pipeline hazards” is not a lesson title I can learn from; I need to see instructions moving through boxes, cycle by cycle.
6. The PYQ bank makes the subject feel important and practical, especially cache calculations, pipeline timing and instruction formats.
7. I feel tricked by the nine questions whose diagrams/tables are missing: I cannot use them to learn or independently check the key.
8. I am also worried that the book might teach formulas without teaching what every symbol means; the contents do not prove that it will not.
9. The two main-memory/virtual-memory questions make me think the memory chapter may be too narrow if it only covers cache mapping.
10. **Would I pay ₹149? Not yet.** I would pay after seeing at least one complete sample lesson that starts from zero, explains every term, draws the steps, solves a question slowly, and lets me practise without guessing.

**My honest verdict:** the six-chapter skeleton is a reasonable start, not a saleable book yet. The current v0 is a contents list with a useful question bank. It does not yet demonstrate the teaching quality that would make a failed beginner trust it.

---

# PART 2. GAP TABLE — what would make me stop, get lost or lose trust

**How to read this table:** because the actual lesson prose is not attached, “Where” points to a chapter/plan area. These are requirements and review risks for the rewrite, not unsupported claims about invisible lesson text.

| # | Where | What I could not understand or what is missing from the v0 plan | Type | What to add or change | Priority |
|---:|---|---|---|---|---|
| 1 | Before Chapter 1 | No starting lesson tells me what a bit, byte, word, register or address is. | MISSING-PREREQUISITE | Add a short zero-level foundation before the six chapters. Define each word before using it. | HIGH |
| 2 | Before Chapter 1 | No explanation of powers of two, binary-to-hex conversion or why computer sizes are written as 2^n. | MISSING-PREREQUISITE | Teach binary, hexadecimal, nibble, byte and powers of two with tiny conversions. | HIGH |
| 3 | Before Chapter 1 | No distinction between a value, a memory address and the data stored at that address. | UNEXPLAINED-WORD | Use a labelled mailbox analogy, then replace it with a real address/content diagram. | HIGH |
| 4 | Chapter 1 | “Instruction set” is named, but ISA is not contrasted with implementation/microarchitecture. | UNEXPLAINED-WORD | Explain what software can observe versus how the processor internally implements it. | HIGH |
| 5 | Chapter 1 | No explicit instruction lifecycle: fetch, decode, operand read, execute, memory access and write-back. | MISSING-GATE-CONCEPT | Give one complete instruction trace through the CPU before listing formats. | HIGH |
| 6 | Chapter 1 | No explanation of opcode, operand, destination, source, immediate field and register field. | UNEXPLAINED-WORD | Draw a coloured 32-bit instruction and annotate every field. | HIGH |
| 7 | Chapter 1 | Instruction-format arithmetic can look like a puzzle if I do not know why register count needs log2 bits. | STEP-SKIPPED | Show how 16 registers need 4 bits, 64 need 6, and what happens when the register count is not a power of two. | HIGH |
| 8 | Chapter 1 | Variable-length opcode questions are not a simple “subtract the fields” exercise. | NEEDS-TRACE | Teach prefix-code space using a tree and progressively consume opcode slots. | HIGH |
| 9 | Chapter 1 | Load-store architecture is named in a PYQ but not stated as a core lesson. | MISSING-GATE-CONCEPT | Explain that arithmetic uses registers and loads/stores move data between memory and registers. | HIGH |
| 10 | Chapter 1 | No worked translation from `Z = X + Y` to LOAD/ADD/STORE. | NEEDS-EXAMPLE | Start with the high-level statement, show each register's contents, then write the sequence. | HIGH |
| 11 | Chapter 1 | Immediate, direct, indirect, register, register-indirect, indexed and base-offset names can blur together. | UNEXPLAINED-WORD | Give one address-generation formula and one memory picture per mode. | HIGH |
| 12 | Chapter 1 | “Base with index” and “base with offset” need a clear difference. | NEEDS-EXAMPLE | Compare `base + index × element_size` for an array with `base + constant_offset` for a record field. | HIGH |
| 13 | Chapter 1 | No distinction between the address of an array element and the value stored in that element. | MISSING-PREREQUISITE | Use a memory table with element numbers, byte addresses and contents. | HIGH |
| 14 | Chapter 1 | C arrays, 32-bit `int`, byte addressing and pointer increments are not listed as prerequisites. | MISSING-PREREQUISITE | Add a C-to-addressing bridge: `a[i]`, `base + i×4`, load and store. | HIGH |
| 15 | Chapter 1 | Structure/record field offsets are easy to misread, especially after an array member. | NEEDS-TRACE | Draw a byte layout, calculate each field offset and mention alignment/padding where relevant. | HIGH |
| 16 | Chapter 1 | Little-endian and big-endian are not mentioned in the chapter list. | MISSING-GATE-CONCEPT | Teach byte order by placing a two-byte number in two labelled memory locations. | HIGH |
| 17 | Chapter 1 | Endianness questions need the student to distinguish a number's written hex form from byte order in memory. | FACT-DOUBT | Add explicit “same bytes, different interpretation” examples and state what the question is holding constant. | HIGH |
| 18 | Chapter 1 | Branch addressing and PC-relative offsets are not named. | MISSING-GATE-CONCEPT | Explain PC, next-instruction address, signed offset and target calculation with a code layout. | HIGH |
| 19 | Chapter 1 | No RISC/CISC comparison despite a PYQ about RISC design traits. | MISSING-GATE-CONCEPT | Include register-register operations, instruction length, control style and avoid saying every real CPU is a pure textbook case. | MEDIUM |
| 20 | Chapter 1 | Stack, auto-increment and auto-decrement addressing may be skipped by a narrow list of “common” modes. | MISSING-FINER-POINT | Cover them in a compact comparison table; practise pointer movement. | MEDIUM |
| 21 | Chapter 2 | The student has no mental picture of a datapath. | NEEDS-DIAGRAM | Begin with PC, IR, register file, ALU, memory, buses and multiplexers as labelled boxes. | HIGH |
| 22 | Chapter 2 | “Register transfer” and micro-operation language is absent. | UNEXPLAINED-WORD | Translate `R0 ← R1 + R2` into small transfers and control actions. | HIGH |
| 23 | Chapter 2 | No explanation of why multiplexers select one of several inputs. | MISSING-PREREQUISITE | Teach muxes before using a datapath drawing with selectable operands. | HIGH |
| 24 | Chapter 2 | No explanation of a bus, tri-state driver or why two sources cannot drive a shared bus at once. | UNEXPLAINED-WORD | Draw a shared bus and show legal/illegal simultaneous control signals. | HIGH |
| 25 | Chapter 2 | ALU title does not name the operations it performs. | MISSING-GATE-CONCEPT | List arithmetic, logical, compare and shift operations and show their inputs/outputs. | HIGH |
| 26 | Chapter 2 | Two's-complement addition and subtraction are assumed rather than taught. | MISSING-PREREQUISITE | Teach fixed-width signed numbers, invert-plus-one, sign extension and overflow first. | HIGH |
| 27 | Chapter 2 | Signed overflow and carry are often confused. | UNEXPLAINED-WORD | Use small 4-bit addition examples to distinguish carry-out from signed overflow. | HIGH |
| 28 | Chapter 2 | No clear path from a truth table/Boolean operation to an ALU function. | STEP-SKIPPED | Show AND, OR, XOR, NOT and selection by control bits. | MEDIUM |
| 29 | Chapter 2 | Adder architecture is not explicitly in the contents. | MISSING-GATE-CONCEPT | Include half/full adders, ripple carry and the reason carry-lookahead is faster. | MEDIUM |
| 30 | Chapter 2 | Booth's algorithm appears in the bank but not in a chapter title or named subtopic. | MISSING-GATE-CONCEPT | Add a full signed multiplication lesson, including pair decoding and A/Q/Q-1 trace. | HIGH |
| 31 | Chapter 2 | Booth questions are dangerous if I am told “count transitions” without knowing which adjacent bits are inspected. | STEP-SKIPPED | Show all n iterations, the appended Q-1 bit, sign bit and add/sub/no-op decision. | HIGH |
| 32 | Chapter 2 | Division and shift-and-add/shift-subtract ideas are not mentioned. | MISSING-FINER-POINT | Add a short optional lesson or state clearly that division is enrichment, not a core priority. | LOW |
| 33 | Chapter 2 | Hardwired control is named but control-signal generation is not. | MISSING-GATE-CONCEPT | Explain opcode decoder, timing/state signals and control outputs with one instruction. | HIGH |
| 34 | Chapter 2 | Microprogrammed control is named but a control word/microinstruction is not. | UNEXPLAINED-WORD | Show a control store, microinstruction fields, micro-PC and next-address selection. | HIGH |
| 35 | Chapter 2 | No hardwired-versus-microprogrammed comparison. | NEEDS-EXAMPLE | Compare speed, flexibility, control-store requirement and suitable conceptual use. | MEDIUM |
| 36 | Chapter 2 | A datapath timing question cannot be solved from text alone. | NEEDS-DIAGRAM | Teach students to read arrows, muxes, register ports and buses before asking a path-capability MCQ. | HIGH |
| 37 | Chapter 3 | “Pipeline” is introduced without showing how one instruction is divided into stages. | MISSING-PREREQUISITE | Build a 5-stage pipeline from a single instruction's journey. | HIGH |
| 38 | Chapter 3 | Throughput, latency, clock period and speedup are different ideas. | UNEXPLAINED-WORD | Give one everyday analogy and then numerical definitions with units. | HIGH |
| 39 | Chapter 3 | The `n+k−1` cycle formula is easy to memorise without knowing its assumptions. | STEP-SKIPPED | Derive it from a timing table for n instructions and k balanced stages. | HIGH |
| 40 | Chapter 3 | Unequal stage delays and inter-stage latch overhead are not named. | MISSING-GATE-CONCEPT | Teach clock period = slowest stage + latch delay, and compare unsplit/split pipelines. | HIGH |
| 41 | Chapter 3 | No pipeline space-time diagram or bubble notation. | NEEDS-DIAGRAM | Draw instruction rows and cycle columns; use a visible bubble for every stall. | HIGH |
| 42 | Chapter 3 | Structural hazards are not separately defined. | MISSING-GATE-CONCEPT | Show two stages requesting one hardware resource at the same time. | HIGH |
| 43 | Chapter 3 | EX stage resource conflicts need a cycle-by-cycle trace. | NEEDS-TRACE | Reconstruct the supplied 2026 EX-stage question after its missing table is restored. | HIGH |
| 44 | Chapter 3 | RAW, WAR and WAW are just acronyms until read/write order is visible. | NEEDS-TRACE | Use a read/write table for every instruction; distinguish dependency from actual hazard in a given pipeline. | HIGH |
| 45 | Chapter 3 | A beginner may think every dependency creates a stall. | FACT-DOUBT | Explain in-order five-stage assumptions, forwarding and when a dependency is harmless. | HIGH |
| 46 | Chapter 3 | Forwarding is not described as extra hardware. | MISSING-GATE-CONCEPT | Draw bypass wires from later stage outputs to EX inputs and label the mux choice. | HIGH |
| 47 | Chapter 3 | Load-use hazards are missing from the plan. | MISSING-GATE-CONCEPT | Show why forwarding cannot always deliver a load value early enough and insert the required bubble. | HIGH |
| 48 | Chapter 3 | Control hazards and branch penalties are not named. | MISSING-GATE-CONCEPT | Trace taken/not-taken branches, flushes, delayed branching and simple prediction. | HIGH |
| 49 | Chapter 3 | The book may teach ideal CPI=1 as if all programs achieve it. | FACT-DOUBT | Teach CPI = base CPI + average stall cycles per instruction, with an instruction mix. | HIGH |
| 50 | Chapter 3 | Clock-rate changes in pipelined versus non-pipelined designs can be forgotten. | STEP-SKIPPED | Convert CPI and clock frequency into time per instruction before taking the ratio. | HIGH |
| 51 | Chapter 3 | Multi-cycle EX operations (e.g. MUL) need a different schedule from a one-cycle EX. | NEEDS-TRACE | Include a dependent ADD/MUL sequence with and without forwarding. | MEDIUM |
| 52 | Chapter 3 | The bank includes multicore/Amdahl-style speedup, but it is not visible in the chapter plan. | MISSING-FINER-POINT | Add one bounded “performance extension” lesson; do not let it displace pipeline fundamentals. | MEDIUM |
| 53 | Chapter 4 | “Cache memory” begins too late if locality and the memory hierarchy are not taught first. | MISSING-PREREQUISITE | Explain registers → cache → main memory → secondary storage and temporal/spatial locality. | HIGH |
| 54 | Chapter 4 | Cache capacity, block size, line count, set count and associativity are easy to mix up. | UNEXPLAINED-WORD | Define each with a labelled cache grid and a numerical example. | HIGH |
| 55 | Chapter 4 | No systematic address-bit split. | STEP-SKIPPED | Derive offset, index and tag from block size, number of sets and address width every time. | HIGH |
| 56 | Chapter 4 | Direct mapping needs more than a formula. | NEEDS-TRACE | Trace several addresses to the same/different lines and display tag comparison. | HIGH |
| 57 | Chapter 4 | Fully associative and set-associative mapping are not explicitly named in the chapter title. | MISSING-GATE-CONCEPT | Teach all three mappings together and compare tag/index/offset fields. | HIGH |
| 58 | Chapter 4 | A tag-bit answer depends on whether the address is byte- or word-addressed. | FACT-DOUBT | State addressability and show conversions before calculating offset bits. | HIGH |
| 59 | Chapter 4 | No cache-state trace across repeated accesses. | NEEDS-TRACE | Use a table with address, block, set, tag, hit/miss and victim after each access. | HIGH |
| 60 | Chapter 4 | LRU is not a formula; it is a state update after every hit and miss. | NEEDS-TRACE | Show recency order per set and work a 2-way example slowly. | HIGH |
| 61 | Chapter 4 | Compulsory and conflict misses are listed nowhere. | MISSING-GATE-CONCEPT | Define compulsory, conflict and capacity misses with short traces. | HIGH |
| 62 | Chapter 4 | Write-through, write-back, write-allocate and no-write-allocate are separate axes. | UNEXPLAINED-WORD | Use a 2×2 comparison table; do not pair policies as if they were mandatory combinations. | HIGH |
| 63 | Chapter 4 | Dirty bit meaning and victim writeback conditions are missing. | MISSING-GATE-CONCEPT | Track dirty/clean state on write hits and evictions. | HIGH |
| 64 | Chapter 4 | Inclusive/exclusive cache terminology appears in the bank but not the contents. | MISSING-FINER-POINT | Explain inclusion briefly and make clear that write policies are not dictated by inclusion alone. | MEDIUM |
| 65 | Chapter 4 | Multi-level AMAT is easy to calculate with the wrong L2 miss-rate definition. | STEP-SKIPPED | Distinguish local L2 miss rate from global L2 misses per CPU reference. | HIGH |
| 66 | Chapter 4 | AMAT formulas can hide whether L2 time is conditional or included. | FACT-DOUBT | Draw hit/miss paths and label the conditional probability at every branch. | HIGH |
| 67 | Chapter 4 | Cache miss penalty and cache access time need separate treatment. | UNEXPLAINED-WORD | Define hit time, miss penalty, block transfer time and total miss service time. | HIGH |
| 68 | Chapter 4 | Word-first/early-restart and block transfer are not named. | MISSING-FINER-POINT | Explain when the requested word arrives and how later words are transferred. | MEDIUM |
| 69 | Chapter 4 | Cache performance questions also use CPI and instruction/data access mix. | MISSING-GATE-CONCEPT | Teach instruction-cache and data-cache stall CPI separately, then add them. | HIGH |
| 70 | Chapter 4 | No question type covers bandwidth per completed block transfer. | MISSING-FINER-POINT | Add transfer-time and bandwidth examples with consistent units. | MEDIUM |
| 71 | Chapter 5 | The title includes main memory but no visible sequence from bit/word capacity to chip organization. | MISSING-PREREQUISITE | Teach `number of locations × bits per location` using small chips first. | HIGH |
| 72 | Chapter 5 | SRAM and DRAM are not listed. | MISSING-GATE-CONCEPT | Compare storage cell behaviour, speed, density and refresh requirement at a GATE-appropriate level. | HIGH |
| 73 | Chapter 5 | DRAM row/column addressing and refresh are easy to skip. | MISSING-GATE-CONCEPT | Draw row/column selection and calculate refresh-time percentage step by step. | HIGH |
| 74 | Chapter 5 | No memory-chip expansion example: increasing word width and number of words. | NEEDS-EXAMPLE | Show how many chips are needed in parallel and how many banks are needed in depth. | HIGH |
| 75 | Chapter 5 | Address decoding/chip select is not mentioned under “memory interfacing”. | MISSING-GATE-CONCEPT | Draw CPU address lines, decoder, chip-select and data bus. | HIGH |
| 76 | Chapter 5 | Memory interleaving and bank conflicts are absent. | MISSING-FINER-POINT | Explain low-order/high-order interleaving with a simple sequential access. | MEDIUM |
| 77 | Chapter 5 | Virtual memory is only present in two bank labels; no clear MMU/TLB/page-table progression. | MISSING-GATE-CONCEPT | Teach virtual address, physical address, TLB hit/miss, page-table hit/miss and page fault separately. | HIGH |
| 78 | Chapter 5 | A cache using physical addresses requires the translation order to be clear. | NEEDS-DIAGRAM | Draw VA → TLB/page table → PA → physically addressed cache. | HIGH |
| 79 | Chapter 5 | “Page table miss” and “page fault” must not be treated as synonyms without defining the question's language. | FACT-DOUBT | Define translation lookup outcomes and resident/non-resident pages explicitly. | HIGH |
| 80 | Chapter 5 | Secondary storage is in the chapter title but has no topic detail. | MISSING-GATE-CONCEPT | Add only the relevant basics: disk access components, block transfer and bandwidth; do not expand into a full OS file-system chapter. | MEDIUM |
| 81 | Chapter 5 | The contents do not say how memory read/write timing works. | MISSING-GATE-CONCEPT | Teach address setup, read/write control, data transfer and wait states at a basic interface level. | MEDIUM |
| 82 | Chapter 5 | “Memory hierarchy: performance” needs a link to cost, capacity and access time. | UNEXPLAINED-WORD | Compare levels in a table and explain why a small fast memory sits near the CPU. | HIGH |
| 83 | Chapter 6 | I/O is titled interrupts and DMA but programmed I/O/polling is not named. | MISSING-GATE-CONCEPT | Start with CPU polling; then compare interrupt-driven I/O and DMA. | HIGH |
| 84 | Chapter 6 | No explanation of why a device interrupt is asynchronous. | UNEXPLAINED-WORD | Show a device raising a request while the CPU is executing an unrelated instruction. | HIGH |
| 85 | Chapter 6 | Vectored and non-vectored interrupts are missing from the chapter title. | MISSING-GATE-CONCEPT | Compare how the ISR address/source is identified and why non-vectored service can take longer. | HIGH |
| 86 | Chapter 6 | Interrupt service order can be memorised incorrectly. | STEP-SKIPPED | Draw finish-current-instruction → save state/PC → load vector → ISR → restore → return. | HIGH |
| 87 | Chapter 6 | Daisy-chain priority and polling are easily confused. | FACT-DOUBT | Draw a physical priority chain and compare it with CPU software polling. | HIGH |
| 88 | Chapter 6 | Nested/masked interrupts and priority levels are absent. | MISSING-FINER-POINT | Add a short explanation of masking, enabling and priority; tag deep nested cases [SHOULD]. | MEDIUM |
| 89 | Chapter 6 | DMA bus ownership is not visible. | NEEDS-DIAGRAM | Show CPU, DMA controller, device and memory sharing a system bus; label bus request/grant. | HIGH |
| 90 | Chapter 6 | Cycle-stealing, burst/block and transparent DMA modes are not named. | MISSING-GATE-CONCEPT | Compare who owns the bus and how many words move per transfer interval. | HIGH |
| 91 | Chapter 6 | DMA transfer-rate questions are unit traps. | NEEDS-TRACE | Convert processor cycles/s × fraction used × bytes/cycle × 8 bits/byte. | HIGH |
| 92 | Chapter 6 | Programmed I/O versus interrupt-driven CPU utilisation is not made concrete. | NEEDS-EXAMPLE | Solve a polling-period/CPU-time versus per-interrupt service-time example. | HIGH |

**Result:** 92 specific plan-level gaps. The rewrite should not be considered complete until these are resolved or deliberately tagged as lower priority with a reason.

---

# PART 3. WHAT A COMPLETE GATE-READY SUBJECT MUST HAVE

The six syllabus phrases are broad. A beginner book must expand each phrase into teachable topics. “How often” below is reported only where the supplied 72-question bank supports it. I will not invent a frequency for a subtopic that the bank does not separate.

| Missing/under-specified topic | Syllabus line served | Frequency evidence | Typical GATE question | What I must know first |
|---|---|---|---|---|
| Binary/hex, bits, bytes, words, powers of two | All lines | Foundation; no separate count | Convert sizes/addresses; count bits | Basic arithmetic and place value |
| Register file, PC, IR, MAR/MDR, buses and muxes | ISA; ALU; control | Not separately labelled; datapath questions occur in bank | Identify legal data path/control sequence | Registers, binary values, simple block diagram |
| Instruction cycle and micro-operations | ISA; control | Represented by `2020_FN_Q30` and interrupt/fetch concepts | Order fetch/decode/execute transfers | PC, memory, registers, buses |
| Instruction fields and fixed/variable-length encoding | Instruction set | Several bank questions: register/opcode/immediate field calculations | NAT/MCQ maximum opcode/immediate bits | Powers of two, register count, field lengths |
| RISC/load-store and register-versus-memory operands | Instruction set | `2026_FN_Q15`, `2018_FN_Q15` and related | Choose instruction sequence; classify ISA traits | Registers, memory operands, instruction fields |
| Addressing modes: immediate, direct, indirect, register, indexed, base-offset, PC-relative, stack, auto inc/dec | Addressing modes | 14 questions in supplied bank under machine instruction label (including some figure questions) | Match mode, calculate effective address, code trace | Address versus value, registers, signed offsets |
| Endianness and byte/word address interpretation | Instruction set/addressing | `2021_AN_Q58` | Decode same bytes in big/little endian | Hex bytes and memory layout |
| Array and structure address calculation | Instruction set/addressing | `2023_FN_Q41`, `2017_FN_Q27` | Work out element/field offset and instruction operands | C arrays, element size, base address |
| Two's complement, sign extension, overflow and shifts | ALU | Needed by signed ALU questions; no clean separate count | Arithmetic result/overflow/shift | Binary arithmetic and fixed-width values |
| Half/full adder, ripple carry, carry-lookahead | ALU | Not separately counted in this bank | Gate-level or timing comparison | Boolean logic, XOR/AND/OR |
| ALU operation selection, flags and shifter | ALU | ALU/data-path label contains only 4 questions | Determine datapath capability or operation result | Mux, register, logic operations |
| Signed multiplication and Booth algorithm | ALU | `2025_AN_Q32` | Count add/sub operations or trace partial product | Two's complement and arithmetic shifts |
| Division algorithms | ALU extension | Not sure from this bank; retain as [LATER] unless more PYQs justify it | Iterative quotient/remainder trace | Binary subtraction and shifts |
| Hardwired control: decoder, state/timing, control signals | Hardwired control | Four ALU/control questions collectively; no independent frequency | Interpret control sequence or compare designs | Instruction cycle, Boolean logic, datapath |
| Microprogrammed control: control store, microinstruction, micro-PC/sequencing | Microprogrammed control | No clear question in this supplied bank; still explicit in syllabus | Microinstruction/control-word interpretation | Datapath control signals, address sequencing |
| Pipelining: stage timing, throughput, latency and speedup | Instruction pipelining | 16 questions, 28 marks, 9 of 10 years in bank summary | NAT timing/speedup; timing diagram | Time units, clock period, CPI |
| Structural hazards | Pipeline hazards | Included in pipeline bank; 2026 figure question needs missing table | Count stall cycles by shared resource | Pipeline space-time chart |
| RAW/WAR/WAW and instruction dependencies | Pipeline hazards | 2024 and 2026 dependency questions | Classify dependencies; determine hazards | Read/write operands and instruction order |
| Forwarding/bypassing and load-use stalls | Pipeline hazards | `2024_FN_Q22`, `2021_AN_Q59` | Identify bypass path, count stalls | 5-stage datapath and stage timing |
| Control hazards, branch penalties and branch prediction | Pipeline hazards | `2022_FN_Q61` and related pipeline questions | Effective CPI/speedup under prediction | Branch flow and CPI |
| Variable-latency stages/multicycle EX | Pipeline hazards | `2018_FN_Q60`, `2021_AN_Q59` | Count cycles for multicycle operation | Pipeline chart and resource occupancy |
| Cache hierarchy and locality | Memory hierarchy/performance | 27 cache/memory hierarchy questions in bank summary | Explain hit/miss/performance | Registers, RAM, secondary storage |
| Direct-mapped, fully associative and set-associative mapping | Cache mapping | 27 questions in bank summary | Split address, find line/set, tag match | Powers of two and address fields |
| LRU and hit/miss tracing | Cache mapping | Several bank questions (`2022_FN_Q54`, `2017_FN_Q53`) | State-table simulation | Set/way and block number |
| Replacement and compulsory/conflict/capacity misses | Cache mapping | Explicit conflict/compulsory in `2017_FN_Q53` | Classify miss reason | Cache mapping and trace state |
| Write-through/write-back, write allocate/no-write allocate, dirty bit | Cache mapping/performance | Several questions from 2022–2024 | Evaluate statements after hit/miss/eviction | Hit/miss and memory-write concepts |
| Multi-level cache, local/global miss rate and AMAT | Memory hierarchy/performance | Many questions, including 2017 and 2025 | NAT AMAT/miss rates | Conditional probability and unit discipline |
| Cache CPI penalty and I/D cache miss rates | Memory hierarchy/performance | `2024_FN_Q56` | Compare perfect-cache speedup | CPI and instruction mix |
| Word-first/early restart and block transfer bandwidth | Memory hierarchy/performance | `2017_AN_Q39`, `2019_FN_Q60`, `2020_FN_Q27` | Average latency/bandwidth | Block size, transfer cycles, AMAT |
| SRAM vs DRAM and refresh | Memory interfacing/hierarchy | `2018_FN_Q33` plus main-memory topic | Chip/refresh timing calculation | Storage capacity, powers of two |
| Memory-chip organization and width/depth expansion | Memory interfacing | Not separately counted in the supplied bank | Calculate chip count, address lines | Bit/word capacity and data bus width |
| Address decoder, chip select and memory banks | Memory interfacing | Not separately counted | Build/interpret memory organization | Binary address and decoder basics |
| Memory interleaving | Memory interfacing/performance | Not sure from this bank | Determine bank access pattern/bandwidth | Sequential block addresses and banks |
| MMU, page table, TLB and page fault | Memory hierarchy (extended) | 2 main/virtual memory label questions; `2026_FN_Q54` includes TLB/MMU | Determine possible event sequence | Virtual/physical address translation |
| Physically addressed cache and page eviction invalidation | Memory hierarchy (extended) | `2026_FN_Q54` | Identify impossible TLB/page/cache sequence | TLB, page table, cache invalidation |
| Secondary storage access and transfer time | Main/secondary storage chapter title | Underrepresented in bank; one memory-bandwidth style item | Calculate transfer time/bandwidth | Units, block size, latency |
| Programmed I/O/polling versus interrupt-driven I/O | I/O interface | 9 questions, 9 marks, 8 of 10 years in bank summary | CPU utilisation and event-order MCQ | CPU cycle/time and device request |
| Vectored/non-vectored interrupts, ISR, context save/restore | I/O interface | Repeated 2018–2026 items | Order interrupt steps or compare service | PC, status, instruction completion |
| Daisy-chain priority vs CPU polling | I/O interface | 2020 and 2026 items | Identify which component finds source/priority | Interrupt request and device chain |
| DMA: burst/block, cycle stealing, bus arbitration | I/O interface | 9-question I/O group includes several DMA questions | Throughput and mode comparison | Bus, CPU cycles and memory transfer |
| DMA bus-master ownership and rates | I/O interface | `2020_FN_Q33`, `2024_AN_Q24`, `2021_AN_Q11` | Determine cycles used and bit/s | Frequency, fraction, bytes/word |
| Masking/nesting/priority levels/handshaking | I/O interface extension | Not sure in this 72-question sample | Event trace / conceptual MCQ | Interrupt lifecycle and control signals |

**Important boundary:** the GATE 2027 COA syllabus does not separately list every textbook topic above. The first priority is to teach each official syllabus phrase properly. Topics such as detailed division algorithms, nested interrupts and deep disk geometry should be marked [SHOULD] or [LATER] unless the rest of the product's PYQ set gives a reason to promote them. The syllabus itself explicitly names hardwired and microprogrammed control, both of which must remain in the book even though the supplied bank has few questions labelled for them. [Official syllabus](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf).

---

# PART 4. THE DIAGRAMS I NEED TO SEE

A beginner book cannot replace these with paragraphs. Each diagram should have labels, a short caption saying what to notice, and a nearby worked trace.

| Chapter | Diagram or visual | What I should notice | Best form |
|---|---|---|---|
| Foundations | Bit → nibble → byte → word ladder | A byte is 8 bits; a word is architecture-dependent | Single picture |
| Foundations | Memory as numbered boxes | Address identifies a location; contents are the value stored there | Single picture |
| Foundations | Binary/hex place-value ladder | Every hex digit maps to four binary bits | Step-by-step conversion |
| C1 | ISA versus internal CPU organisation | The programmer-visible contract is not the same as internal implementation | Side-by-side picture |
| C1 | Instruction with opcode/register/immediate fields | The field widths add to total instruction length | Single annotated picture |
| C1 | Instruction cycle | PC, memory, IR, register file and ALU participate in a sequence | Step-by-step series |
| C1 | Effective-address mode comparison | Each mode calculates an address or supplies an operand differently | Comparison sheet |
| C1 | Array and structure memory layout | Element size and field offsets determine addresses | Address table + diagram |
| C1 | Endian memory byte layout | The same two bytes produce different values under two byte orders | Side-by-side memory boxes |
| C1 | PC-relative branch code | The offset is measured from the next instruction in the given convention | Code/address trace |
| C2 | Minimal CPU datapath | PC, IR, registers, ALU, memory and buses are connected | Single architecture picture |
| C2 | Mux selecting ALU inputs | Control bits choose which source reaches an input | Single picture + truth table |
| C2 | Register transfer path | A source register's value moves through the ALU to the destination | Step-by-step arrows |
| C2 | Half adder/full adder | Sum and carry come from the input bits | Logic diagram |
| C2 | Ripple-carry versus carry-lookahead | Carry propagation affects delay | Side-by-side diagram |
| C2 | Signed overflow examples | Carry-out is not the same as signed overflow | Trace table |
| C2 | Booth's algorithm registers A, Q, Q-1, M | Each pair decides add/subtract/no operation before arithmetic shift | Step-by-step trace table |
| C2 | Hardwired control block | Opcode/state/timing conditions produce control signals | Block diagram |
| C2 | Microprogrammed control block | Control store and micro-PC select a microinstruction | Block diagram + small sequence |
| C3 | Five pipeline stages | Instructions overlap; each stage does one part of work | Single pipeline picture |
| C3 | Pipeline space-time chart | One row per instruction, one column per cycle | Trace table |
| C3 | Balanced versus unbalanced stages | Longest stage plus latch sets the clock period | Side-by-side timing chart |
| C3 | Structural hazard | Two instructions request one resource in the same cycle | Cycle chart with bubble |
| C3 | RAW/WAR/WAW read/write table | Dependency names come from read/write order | Table |
| C3 | Forwarding paths | A value bypasses the register-file write/read path | Datapath arrows |
| C3 | Load-use stall | A bubble may remain even when forwarding exists | Step-by-step pipeline chart |
| C3 | Branch taken/not taken | Wrong-path instructions may be flushed | Pipeline chart |
| C4 | Memory hierarchy pyramid | Smaller/faster levels are closer to the CPU | Single picture |
| C4 | Cache line/set/way grid | A set contains ways; a block occupies one way | Labelled cache grid |
| C4 | Tag/index/offset address | Offset picks byte, index picks set, tag checks identity | Bit-field diagram |
| C4 | Direct/fully/set-associative mapping | Different choices of placement change the index/set | Side-by-side mapping |
| C4 | LRU state before/after each access | Hits update recency; misses may evict the least recent block | Trace table |
| C4 | Write-through versus write-back | Main memory update timing and dirty state differ | Two event timelines |
| C4 | Multi-level cache hit/miss tree | L2 is accessed only after an L1 miss; conditional probabilities matter | Probability tree |
| C4 | Block transfer word-first timing | Requested word may arrive before the rest of the block | Timing diagram |
| C5 | SRAM cell versus DRAM cell (conceptual) | DRAM requires refresh; SRAM does not use the same refresh process | Side-by-side picture |
| C5 | DRAM row/column selection and refresh | A refresh operation covers rows over a refresh interval | Step-by-step timing |
| C5 | Memory chip width/depth expansion | Parallel chips widen the word; banks increase depth | Wiring diagram |
| C5 | Address decoder and chip-select | High address bits select a chip/bank | Block diagram |
| C5 | Interleaved memory banks | Sequential addresses can be distributed across banks | Address-to-bank table |
| C5 | Virtual-to-physical translation | TLB hit, page-table walk and page fault are different outcomes | Flowchart |
| C5 | Physical cache access after translation | A physical address goes to the cache in this question's architecture | Ordered block diagram |
| C6 | Programmed I/O versus interrupt versus DMA | CPU involvement differs across the three approaches | Three-column picture |
| C6 | Interrupt priority daisy chain | Hardware chain position establishes priority; it is not CPU polling | Chain diagram |
| C6 | Vectored/non-vectored ISR entry | How the service address/source is obtained differs | Side-by-side sequence |
| C6 | Interrupt save/restore sequence | Finish instruction, save state, service, restore and return | Numbered flow |
| C6 | DMA bus arbitration and transfer | DMA temporarily becomes bus master; CPU and DMA do not both drive one shared bus simultaneously | Bus timing diagram |
| C6 | Cycle-steal versus burst DMA | A stolen cycle transfers a unit; burst holds the bus for a block | Timing comparison |

### Figures missing from this upload and needed to audit the PYQs

1. `2026_FN_Q60`: the EX-stage instruction-type table (`IMAGE_Q_60_1`).
2. `2025_FN_Q27`: the partial datapath (`IMAGE_Q_27_1`).
3. `2025_FN_Q53`: the L1/L2 hit-rate and access-time figure (`IMAGE_Q_53_1`).
4. `2025_AN_Q61`: the instruction-type table (`IMAGE_Q_61_1`).
5. `2024_AN_Q43`: both R-type and I-type instruction-format figures.
6. `2021_FN_Q38`: the instruction-sequence image (`IMAGE_Q_38_1`).
7. `2020_FN_Q30`: the datapath diagram (`IMAGE_Q_30`).
8. `2017_AN_Q39`: the cache hierarchy access-time/hit-ratio figure (`IMAGE_Q_39`).
9. `2017_FN_Q60`: the branch instruction sequence (`IMAGE_Q_60`).

Until these are restored from the original papers, the book should store the full diagram with its question. A placeholder such as `[IMAGE_Q_...]` is not a usable study question.

---

# PART 5. THE FULL PLAN — lesson by lesson

Each lesson is designed for **45–90 minutes of reading**, not a two-page summary. [MUST] means needed for the stated syllabus or repeatedly needed by the supplied bank. [SHOULD] means helpful coverage or a useful finer point. [LATER] means do it after the core is secure. “Beginner must-see” is the picture or example that should appear before the formal rule.

## Foundation — do not throw a beginner directly into Chapter 1

### F1. Bits, binary, hexadecimal and powers of two — 60 minutes [MUST]
- **Why this tag:** every later field-width, cache-size and memory-capacity calculation depends on it.
- **Prerequisites:** ordinary addition, multiplication and place value only.
- **Beginner must-see:** a bit string with place values, then the same value grouped into nibbles and hex digits.
- **Finer points:** unsigned range, leading zeros, conversion between decimal/binary/hex, `2^10` versus decimal 1000, and how many values n bits can encode.
- **GATE level:** quick bit-width and capacity calculations; no advanced digital-logic minimisation here.
- **Diagrams:** binary place-value row; binary/hex 4-bit lookup table.
- **Hand traces:** convert `10110110₂` to hex and decimal; find minimum bits for 50 distinct values.
- **Common mistakes:** treating a hex digit as a byte; confusing number of values `2^n` with maximum value `2^n`.

### F2. Bytes, words, addresses and memory contents — 60 minutes [MUST]
- **Why this tag:** address arithmetic and cache offset calculations are otherwise meaningless.
- **Prerequisites:** F1.
- **Beginner must-see:** ten numbered memory boxes; each box has an address and a content value.
- **Finer points:** byte-addressable versus word-addressable memory, word length, alignment, address versus value, KB/MB powers.
- **GATE level:** convert a word address to byte address; interpret a byte address in a memory table.
- **Diagrams:** memory boxes with addresses; 1-byte/4-byte word layouts.
- **Hand traces:** place a 32-bit word at address 1000 in byte-addressable memory; calculate the next word address.
- **Common mistakes:** adding one to a byte address when the question asks for the next 4-byte word; confusing memory capacity with address width.

### F3. Registers, buses, multiplexers and simple logic — 75 minutes [MUST]
- **Why this tag:** datapath/control questions cannot be understood from an ALU formula alone.
- **Prerequisites:** F1–F2.
- **Beginner must-see:** two registers connected to a shared bus through selectable drivers, and a mux choosing one of two inputs.
- **Finer points:** register file, read/write ports, bus contention, mux select bits, decoder, AND/OR/XOR and NOT.
- **GATE level:** follow a value through a register-mux-ALU-register path; identify which source is selected.
- **Diagrams:** mux truth table; common bus; register file block.
- **Hand traces:** set control bits for `R3 ← R1`; show why two outputs cannot drive one shared bus together.
- **Common mistakes:** assuming a mux stores data; confusing a decoder with a mux; believing a bus itself performs arithmetic.

### F4. Time, frequency, CPI and throughput — 60 minutes [MUST]
- **Why this tag:** pipeline, DMA, cache and performance questions use the same units repeatedly.
- **Prerequisites:** F1 and basic unit conversion.
- **Beginner must-see:** a clock with period and frequency labelled, plus a timeline of cycles.
- **Finer points:** `T = cycles × clock period`, `frequency = 1/period`, CPI, instruction count, throughput versus latency, ns/µs/s and MB/s/bit/s.
- **GATE level:** speedup ratios; converting cycles per second into a transfer rate.
- **Diagrams:** cycle timeline; units conversion ladder.
- **Hand traces:** convert 2 GHz into 0.5 ns per cycle; calculate time for 1000 instructions at CPI 2.
- **Common mistakes:** using GHz as if it were seconds; mixing bits and bytes; taking a speedup ratio upside down.

## Chapter 1 — Machine instructions and addressing modes

### C1.1. What a processor is asked to do: ISA and instruction cycle — 60 minutes [MUST]
- **Prerequisites:** F1–F3.
- **Beginner must-see:** one instruction moving through PC → memory → IR → decode → execute.
- **Finer points:** ISA versus microarchitecture, PC, IR, register file, memory interface, fetch/decode/execute and write-back.
- **GATE level:** identify programmer-visible ISA properties versus implementation details; order basic fetch/execute micro-operations.
- **Diagrams:** instruction-cycle flow; ISA/implementation side-by-side.
- **Hand traces:** execute `ADD R1,R2,R3` using a register-content table.
- **Common mistakes:** saying cache size or clock frequency is an ISA feature; confusing PC with the address of a data operand.

### C1.2. Instruction formats and fields — 75 minutes [MUST]
- **Prerequisites:** F1, F2, C1.1.
- **Beginner must-see:** one 16-bit instruction cut into opcode, register and immediate fields; every bit accounted for.
- **Finer points:** opcode, operand, destination/source, register encoding, immediate width, unused/reserved fields, fixed versus variable-length instructions.
- **GATE level:** count opcode choices, immediate bits, register bits and format alternatives; solve maximum-opcode questions.
- **Diagrams:** annotated instruction fields; prefix-code tree for variable-length opcode allocation.
- **Hand traces:** calculate field sizes for 16/32-bit instructions and a register count that is not a power of two.
- **Common mistakes:** forgetting the instruction-type bit; using `log2(number)` without checking integer bit width; allocating the same prefix to two formats.

### C1.3. Registers, memory operands and load-store architecture — 60 minutes [MUST]
- **Prerequisites:** F2, F3, C1.1.
- **Beginner must-see:** X and Y stored in memory, loaded to R0/R1, added, and stored as Z.
- **Finer points:** register-register, register-memory and load-store styles; destination-first convention; what LOAD and STORE actually move.
- **GATE level:** translate a simple high-level expression into valid instruction sequences; identify illegal memory arithmetic under a load-store ISA.
- **Diagrams:** register file and memory with arrows; instruction sequence timeline.
- **Hand traces:** trace `Z = X + Y` and record register contents after every line.
- **Common mistakes:** trying to ADD two memory operands in a strict load-store ISA; forgetting that the first field may be the destination.

### C1.4. Addressing modes and effective address — 90 minutes [MUST]
- **Prerequisites:** F2, F3, C1.1–C1.3.
- **Beginner must-see:** the same memory value accessed using immediate, register, indirect, base-offset and indexed forms.
- **Finer points:** immediate, direct/absolute, indirect, register, register-indirect, base+offset, base+index, PC-relative, stack, auto-increment/decrement; distinguish operand value from effective address.
- **GATE level:** match modes to constants, pointers, arrays, records; compute effective address.
- **Diagrams:** one comparison sheet with an EA formula and a memory/register sketch per mode.
- **Hand traces:** compute addresses for an array and a pointer; show the register update for auto-increment.
- **Common mistakes:** calling an immediate constant an address; treating an indirect pointer as the final data; missing scale factor in array indexing.

### C1.5. Byte order, arrays, structures and address calculation — 75 minutes [MUST]
- **Prerequisites:** F1–F2, C1.4.
- **Beginner must-see:** a 16-bit value split across two adjacent byte addresses on little- and big-endian machines.
- **Finer points:** byte order versus written number, element size, array stride, structure offsets, alignment and possible padding.
- **GATE level:** solve endianness MCQs; translate C array access into base plus index×size; calculate structure-field offset.
- **Diagrams:** two endian byte layouts; array and `struct` memory map.
- **Hand traces:** trace `a[i] = b[i] * 8` with 4-byte integers; determine the offset of a field after 100 integers.
- **Common mistakes:** reversing hex digits instead of bytes; using an index without multiplying by element size; ignoring the difference between a field offset and its final value.

### C1.6. Branch instructions and PC-relative addressing — 60 minutes [MUST]
- **Prerequisites:** C1.1–C1.2, F2.
- **Beginner must-see:** sequential instruction addresses and one branch that jumps backward to a loop label.
- **Finer points:** conditional/unconditional branch, target address, next-PC convention, signed offset, offset in bytes versus words.
- **GATE level:** calculate a PC-relative offset and trace a short loop.
- **Diagrams:** code listing with address column; PC/target arithmetic.
- **Hand traces:** target minus next-instruction address; test positive and negative offsets.
- **Common mistakes:** measuring from the branch instruction instead of the next instruction when the question says next; forgetting instruction length; mixing byte and word offsets.

### C1.7. RISC/CISC traits and instruction-set design review — 60 minutes [SHOULD]
- **Why this tag:** basic distinctions support the syllabus, but this should not become a history chapter.
- **Prerequisites:** C1.1–C1.3.
- **Beginner must-see:** a small feature matrix contrasting textbook RISC and CISC designs.
- **Finer points:** fixed/variable format, load-store, register use, control style; avoid absolute claims about all modern commercial CPUs.
- **GATE level:** classify the traits explicitly stated in a question; revise opcode-field patterns.
- **Diagrams:** comparison table; one RISC load/add/store sequence.
- **Hand traces:** classify three small architectures from given properties.
- **Common mistakes:** claiming hardwired control is the only possible RISC feature in every implementation; assuming an ISA's cache size is part of its definition.

## Chapter 2 — ALU, datapath and control unit

### C2.1. Datapath from zero: registers, buses, muxes and data movement — 75 minutes [MUST]
- **Prerequisites:** F2–F3, C1.1.
- **Beginner must-see:** one clean datapath diagram with PC, IR, register file, ALU, temporary registers, memory and muxes.
- **Finer points:** source/destination ports, temporary registers, data bus, address bus, control signals, register-transfer notation.
- **GATE level:** infer whether a partial datapath can perform an operation using two registers, one register/immediate or two immediates.
- **Diagrams:** complete datapath; zoomed-in ALU input selection.
- **Hand traces:** order the micro-operations for an instruction fetch and a register ADD.
- **Common mistakes:** believing an arrow means data is moved automatically; ignoring read/write enables; assuming two sources can occupy one bus at the same time.

### C2.2. Binary arithmetic, signed numbers and overflow — 90 minutes [MUST]
- **Prerequisites:** F1.
- **Beginner must-see:** 4-bit unsigned and two's-complement number lines.
- **Finer points:** signed range, negate with invert-plus-one, sign extension, carry-out, overflow, arithmetic versus logical shift.
- **GATE level:** compute ALU inputs/outputs and identify signed overflow.
- **Diagrams:** signed number line; addition/subtraction bit columns.
- **Hand traces:** add two 4-bit positives causing overflow; subtract by two's complement.
- **Common mistakes:** treating carry-out as signed overflow; extending a signed negative value with zeros; dropping leading bits without checking the fixed width.

### C2.3. ALU operations and function selection — 60 minutes [MUST]
- **Prerequisites:** C2.1–C2.2, F3.
- **Beginner must-see:** ALU with A/B inputs, operation-select lines, result and status outputs.
- **Finer points:** arithmetic, logic, compare, shift, zero/carry/sign/overflow flags at a conceptual level.
- **GATE level:** determine what an ALU datapath can support from its inputs and muxes.
- **Diagrams:** ALU block; operation-select truth table.
- **Hand traces:** show how the same inputs produce AND, ADD and shift results.
- **Common mistakes:** mixing up the data input with the control input; treating flags as extra data bits.

### C2.4. Adders and carry delay — 60 minutes [SHOULD]
- **Why this tag:** useful ALU design coverage, but focus on GATE-level understanding rather than transistor details.
- **Prerequisites:** C2.2–C2.3.
- **Beginner must-see:** half adder/full adder truth tables.
- **Finer points:** ripple-carry chain, carry propagation and carry-lookahead idea.
- **GATE level:** calculate sum/carry and compare which design reduces carry delay.
- **Diagrams:** half/full adder; ripple and lookahead block sketches.
- **Hand traces:** add two 4-bit values and record carries.
- **Common mistakes:** confusing sum with carry; claiming a ripple adder completes all bits independently.

### C2.5. Booth's signed multiplication — 90 minutes [MUST]
- **Prerequisites:** C2.2, arithmetic shifts and binary registers.
- **Beginner must-see:** A, Q, Q-1 and M registers on one sheet, with the `Q0Q-1` decision table.
- **Finer points:** 00/11 no-op, 01 add, 10 subtract; arithmetic right shift; fixed iteration count; sign extension.
- **GATE level:** count add/sub operations or complete a trace for given signed operands.
- **Diagrams:** register layout and a row-by-row Booth table.
- **Hand traces:** run all 16 multiplier bits for a small example; count only real add/sub steps.
- **Common mistakes:** inspecting bits in the wrong order; forgetting Q-1 starts at zero; using a logical shift; counting no-op iterations as additions.

### C2.6. Register transfers and instruction execution sequences — 60 minutes [MUST]
- **Prerequisites:** C2.1 and C1.1.
- **Beginner must-see:** `R0 ← R1 + R2` broken into operand read, ALU operation and destination write.
- **Finer points:** control word, register enable, ALU select, memory read/write and instruction fetch micro-operations.
- **GATE level:** order a supplied list of micro-operations while respecting data dependencies.
- **Diagrams:** control-signal annotation over a datapath; dependency arrows between steps.
- **Hand traces:** sequence fetch + decode + execute for ADD and LOAD.
- **Common mistakes:** performing an operation before its operand is available; writing a register before the ALU result exists.

### C2.7. Hardwired control unit — 60 minutes [MUST]
- **Prerequisites:** C2.1, C2.6, basic Boolean logic.
- **Beginner must-see:** opcode decoder and timing/state logic generating control lines.
- **Finer points:** control signals, state sequence, instruction decoding and fixed logic.
- **GATE level:** recognise what hardwired control is and interpret a small control sequence.
- **Diagrams:** hardwired control block; one instruction's control-signal timeline.
- **Hand traces:** activate the signals needed for fetch and register ADD.
- **Common mistakes:** calling the datapath the control unit; saying control signals are the values being added.

### C2.8. Microprogrammed control unit — 75 minutes [MUST]
- **Prerequisites:** C2.6–C2.7.
- **Beginner must-see:** control store containing microinstructions, selected by a microprogram counter.
- **Finer points:** microinstruction/control word, control memory, microsequencer, next-address field, horizontal/vertical idea only as needed.
- **GATE level:** explain microprogrammed versus hardwired control and follow a simple microinstruction sequence.
- **Diagrams:** microprogrammed control block; small control-store rows.
- **Hand traces:** follow micro-PC to next microinstruction for a simple fetch sequence.
- **Common mistakes:** treating a microinstruction as a user-level ISA instruction; omitting the next-address decision.

## Chapter 3 — Instruction pipelining and hazards

### C3.1. Why pipelining works — 60 minutes [MUST]
- **Prerequisites:** F4, C1.1.
- **Beginner must-see:** several instructions overlapped in a five-stage pipeline compared with one instruction completed at a time.
- **Finer points:** latency, throughput, overlap, pipeline fill and drain, ideal one-instruction-per-cycle throughput.
- **GATE level:** count cycles for n instructions and k ideal stages.
- **Diagrams:** sequential versus pipelined timeline.
- **Hand traces:** create a 5×5 schedule for five instructions.
- **Common mistakes:** saying each instruction's latency becomes one cycle; forgetting fill/drain cycles.

### C3.2. Pipeline clock period, latch delay and uneven stages — 75 minutes [MUST]
- **Prerequisites:** C3.1, F4.
- **Beginner must-see:** stage-delay bars with a latch inserted between stages.
- **Finer points:** cycle time is limited by the slowest stage plus latch overhead; splitting a long stage may improve throughput but increase stage count.
- **GATE level:** compute time for n instructions; compare two pipeline arrangements.
- **Diagrams:** stage delay bar chart; instruction timeline.
- **Hand traces:** calculate `(n+k−1) × clock_period` and compare NP/EP implementations.
- **Common mistakes:** using average stage delay; forgetting latch overhead; mixing ns and µs.

### C3.3. Structural hazards — 60 minutes [MUST]
- **Prerequisites:** C3.1–C3.2, F3.
- **Beginner must-see:** two pipeline instructions needing one EX resource in the same cycle.
- **Finer points:** shared memory/functional-unit conflicts, stall insertion, structural duplication versus scheduling.
- **GATE level:** count stall cycles from a provided stage occupancy table.
- **Diagrams:** resource-use chart and pipeline bubble chart.
- **Hand traces:** mark each instruction's EX requirement against the cycle limit.
- **Common mistakes:** counting an instruction's whole execution time as a stall; forgetting that a multi-cycle unit may remain occupied.

### C3.4. Data dependencies and hazards — 75 minutes [MUST]
- **Prerequisites:** C3.1, C1.2–C1.3.
- **Beginner must-see:** three instructions with explicit register reads and writes in columns.
- **Finer points:** RAW, WAR, WAW; dependency versus hazard; why classic in-order five-stage pipelines mainly face RAW data hazards.
- **GATE level:** classify dependency types in short sequences and identify what can be reordered.
- **Diagrams:** read/write matrix; dependency arrows.
- **Hand traces:** annotate every instruction's source and destination registers.
- **Common mistakes:** labelling every later write as RAW; mixing instruction order with execution-stage order.

### C3.5. Forwarding, stalls and multi-cycle execution — 90 minutes [MUST]
- **Prerequisites:** C3.2–C3.4, C2.1.
- **Beginner must-see:** bypass path from a later pipeline stage to the EX input, followed by a load-use bubble.
- **Finer points:** EX/MEM and MEM/WB forwarding, hazard detection, load-use delay, multi-cycle EX and operand availability.
- **GATE level:** count stalls with/without forwarding; solve ADD/MUL dependencies under stated assumptions.
- **Diagrams:** forwarding arrows; side-by-side pipeline charts with and without forwarding.
- **Hand traces:** schedule `ADD, MUL, ADD...` one cycle at a time.
- **Common mistakes:** assuming forwarding removes every stall; using the result before the producing stage makes it available; failing to state stage assumptions.

### C3.6. Control hazards and branch prediction — 75 minutes [MUST]
- **Prerequisites:** C1.6, C3.1–C3.2.
- **Beginner must-see:** a branch decision made after younger instructions have entered the pipeline.
- **Finer points:** taken/not-taken path, flush, branch penalty, simple prediction accuracy and stall cost.
- **GATE level:** calculate CPI and speedup from branch fraction, penalty and predictor accuracy.
- **Diagrams:** pipeline with wrong-path instructions crossed out; branch decision timeline.
- **Hand traces:** calculate wrong predictions per 100 instructions and added stall cycles.
- **Common mistakes:** applying prediction accuracy to all instructions; forgetting that a correct prediction saves only the stated branch stall.

### C3.7. Whole-program performance and speedup — 75 minutes [MUST]
- **Prerequisites:** F4, C3.1–C3.6.
- **Beginner must-see:** time = instruction count × CPI × clock period, with each factor labelled.
- **Finer points:** weighted average CPI, instruction mix, cache stalls, non-pipelined versus pipelined time, simple Amdahl-style parallel fraction/overhead.
- **GATE level:** speedup with clock-rate changes, stalls, cache misses and a small multicore overhead model.
- **Diagrams:** time breakdown; parallel/serial portion bar.
- **Hand traces:** compute effective CPI from a mixture and compare two processors.
- **Common mistakes:** comparing CPI alone when clock rates differ; applying a percentage to the wrong instruction subset; forgetting setup/overhead from the question.

## Chapter 4 — Cache memory

### C4.1. Memory hierarchy, locality and cache purpose — 60 minutes [MUST]
- **Prerequisites:** F2, F4.
- **Beginner must-see:** CPU registers → cache → main memory → secondary storage pyramid.
- **Finer points:** capacity/speed/cost trade-off, temporal locality, spatial locality, hit and miss.
- **GATE level:** explain why caches work and interpret hit-rate language.
- **Diagrams:** hierarchy pyramid; repeated access timeline showing locality.
- **Hand traces:** mark a short access sequence as likely reuse or nearby reuse.
- **Common mistakes:** thinking a cache stores every program instruction permanently; confusing hit rate with miss rate.

### C4.2. Cache organisation and address fields — 75 minutes [MUST]
- **Prerequisites:** F1–F2, C4.1.
- **Beginner must-see:** cache divided into lines grouped into sets and ways.
- **Finer points:** cache capacity, block size, line count, associativity, set count, address width, tag/index/offset.
- **GATE level:** derive all field widths and total tag-storage bits.
- **Diagrams:** cache grid; address bit split.
- **Hand traces:** for given capacity/block/ways, compute lines, sets, index, offset and tag.
- **Common mistakes:** taking index bits from number of lines when the cache is set-associative; forgetting block offset; assuming a block is always one word.

### C4.3. Direct-mapped cache — 60 minutes [MUST]
- **Prerequisites:** C4.2.
- **Beginner must-see:** address bits selecting exactly one cache line, followed by tag comparison.
- **Finer points:** line number = block number modulo number of lines; tag match; conflict between same-index blocks.
- **GATE level:** map hex addresses; find tag/index; identify hit/miss and total tag bits.
- **Diagrams:** main-memory blocks mapping to cache lines; address-field layout.
- **Hand traces:** simulate 4–6 addresses including two that collide.
- **Common mistakes:** using the full byte address as the block number; comparing addresses without removing offset bits.

### C4.4. Fully associative and set-associative caches — 75 minutes [MUST]
- **Prerequisites:** C4.2–C4.3.
- **Beginner must-see:** one fully associative cache and a two-way set with multiple possible slots.
- **Finer points:** no index for fully associative; set index for N-way; tag bits change with associativity; replacement only within a set.
- **GATE level:** solve tag-bit/associativity and address mapping questions.
- **Diagrams:** direct vs fully vs set-associative side-by-side.
- **Hand traces:** place a sequence of blocks in a 2-way cache.
- **Common mistakes:** believing “8-way” means eight sets; using cache block count instead of set count for index bits.

### C4.5. Replacement, LRU and miss classification — 75 minutes [MUST]
- **Prerequisites:** C4.3–C4.4.
- **Beginner must-see:** two-way set with last-used order updated after each access.
- **Finer points:** LRU, FIFO/random at a conceptual level; compulsory, conflict and capacity misses.
- **GATE level:** full trace questions over repeated sequences; count conflict misses.
- **Diagrams:** per-set state table; LRU stack/recency order.
- **Hand traces:** simulate `0,128,256,...` in a 2-way set; label every miss.
- **Common mistakes:** not updating recency on a hit; replacing globally instead of within the selected set; counting first-time misses as conflict misses.

### C4.6. Write policies and cache coherence of contents — 75 minutes [MUST]
- **Prerequisites:** C4.1–C4.5.
- **Beginner must-see:** a CPU write hit drawn under write-through and write-back.
- **Finer points:** dirty bit; write-allocate/no-write-allocate; victim eviction; write-through does not need a dirty bit for the same reason as write-back; inclusive/exclusive only as a separate hierarchy property.
- **GATE level:** evaluate statements about write hit/miss, dirty eviction and writeback.
- **Diagrams:** write event timeline; cache line with valid/tag/data/dirty fields.
- **Hand traces:** follow two writes and an eviction in both policies.
- **Common mistakes:** saying write-back always sends each write to memory; saying write-through always writes a dirty victim; assuming write allocate must pair with one write policy.

### C4.7. AMAT and multi-level cache — 90 minutes [MUST]
- **Prerequisites:** F4, C4.1–C4.6.
- **Beginner must-see:** a flow tree in which L2 is accessed only after an L1 miss.
- **Finer points:** hit time, miss penalty, local versus global miss rate, L1/L2 conditional access time, word-first/early restart.
- **GATE level:** solve multi-level AMAT, hit-rate and bandwidth questions.
- **Diagrams:** access probability tree; hit/miss timing path.
- **Hand traces:** calculate L2 local miss rate from misses per instruction; compute AMAT without double-counting L1 time.
- **Common mistakes:** using global L2 miss rate as local; forgetting L2 access occurs only on L1 miss; adding a penalty twice.

### C4.8. Cache misses, CPI and memory-system performance — 75 minutes [MUST]
- **Prerequisites:** C3.7 and C4.7.
- **Beginner must-see:** separate instruction-cache and data-cache misses contributing to stall CPI.
- **Finer points:** data access fraction, miss penalty, ideal CPI, memory transfer bandwidth and ambiguous service-time conventions.
- **GATE level:** perfect-cache speedup, stall CPI, average memory access time and block transfer bandwidth.
- **Diagrams:** CPI breakdown; block transfer timing chart.
- **Hand traces:** calculate `I-miss contribution + D-miss contribution`; convert block bytes and service cycles to MB/s.
- **Common mistakes:** applying data miss rate to every instruction; forgetting only a fraction of instructions access data; mixing hit time into the penalty inconsistently.

## Chapter 5 — Main memory and secondary storage

### C5.1. Main-memory hierarchy, SRAM and DRAM — 60 minutes [MUST]
- **Prerequisites:** F1–F2, C4.1.
- **Beginner must-see:** a conceptual SRAM cell versus DRAM cell and where each is used.
- **Finer points:** volatile memory, access time, density/cost trade-off, refresh requirement.
- **GATE level:** compare SRAM/DRAM and identify refresh-related facts.
- **Diagrams:** SRAM/DRAM comparison; CPU-to-memory hierarchy.
- **Hand traces:** classify a given memory technology from its properties.
- **Common mistakes:** saying all RAM is DRAM; treating refresh as ordinary read/write work.

### C5.2. DRAM organisation and refresh calculations — 75 minutes [MUST]
- **Prerequisites:** C5.1, F4.
- **Beginner must-see:** rows of DRAM cells, each refreshed within a refresh period.
- **Finer points:** row count, refresh time per row, total refresh window, fraction of time remaining for reads/writes.
- **GATE level:** calculate refresh overhead percentage.
- **Diagrams:** row/column selection; refresh timing strip.
- **Hand traces:** multiply row count by refresh time and divide by refresh interval.
- **Common mistakes:** using number of chips rather than rows; forgetting to convert ms to ns; reporting refresh fraction instead of available fraction.

### C5.3. Memory chips, buses, decoding and interleaving — 75 minutes [MUST]
- **Prerequisites:** F1–F3, C5.1.
- **Beginner must-see:** several narrow chips in parallel creating a wider data word; a decoder selecting a bank.
- **Finer points:** chip capacity `locations × bits/location`, depth versus width expansion, address/data/control lines, chip-select and interleaved banks.
- **GATE level:** calculate number of chips, address bits and memory organisation; understand a bank access pattern.
- **Diagrams:** chip expansion wiring; address decoder; interleaved-bank map.
- **Hand traces:** build a 32-bit memory from x4 chips; distribute consecutive addresses over four banks.
- **Common mistakes:** multiplying chip count when only width must increase; forgetting the address lines needed for depth; confusing chip capacity in bits with bytes.

### C5.4. Virtual memory, MMU, page tables and TLB — 75 minutes [SHOULD]
- **Why this tag:** the supplied bank contains TLB/page-table concepts, but the GATE 2027 COA line does not separately name virtual memory; keep it concise and tied to memory hierarchy.
- **Prerequisites:** C4.1–C4.2, C5.1.
- **Beginner must-see:** virtual address translated to physical address by TLB/page-table lookup, with a separate page-fault path.
- **Finer points:** page, frame, TLB hit/miss, page-table hit/miss, page fault, valid/present status, physical-address cache, invalidation when a page leaves memory.
- **GATE level:** identify possible/impossible event sequences and calculate simple address translations if included.
- **Diagrams:** translation flowchart; physical cache ordering.
- **Hand traces:** list TLB lookup, page-table lookup, page-fault outcome and cache access for four scenarios.
- **Common mistakes:** treating TLB miss as a page fault; claiming a nonresident page can still hit in a physically addressed cache after its lines were invalidated.

### C5.5. Secondary storage and transfer performance — 60 minutes [SHOULD]
- **Why this tag:** the chapter title promises secondary storage, but do not drift into a full operating-systems disk chapter.
- **Prerequisites:** F4, C4.1.
- **Beginner must-see:** access latency plus block transfer time on a storage device.
- **Finer points:** seek/rotational/transfer components only at the level required by available questions; bandwidth = data transferred/time.
- **GATE level:** unit-consistent block-transfer and bandwidth calculations.
- **Diagrams:** simple disk access timeline; block transfer strip.
- **Hand traces:** compute time for a fixed block and convert to bytes/s.
- **Common mistakes:** confusing MB/s with Mb/s; including a one-time setup delay in every individual word transfer when the model says otherwise.

### C5.6. Memory-system performance and interfacing review — 60 minutes [MUST]
- **Prerequisites:** C5.1–C5.5 and C4.7.
- **Beginner must-see:** CPU memory request travelling through address/control/data lines to the chosen memory level.
- **Finer points:** access time, cycle time, wait states, hierarchy and transfer path; connect main memory with cache rather than teaching it as an isolated box.
- **GATE level:** combine chip organisation, refresh, cache and transfer-rate reasoning without mixing assumptions.
- **Diagrams:** complete memory-system block diagram; request/response timing.
- **Hand traces:** follow a read request through cache miss to main memory and back.
- **Common mistakes:** using cache hit time as main-memory access time; forgetting interface delays; mixing capacity and throughput.

## Chapter 6 — I/O interface, interrupts and DMA

### C6.1. Programmed I/O and polling — 60 minutes [MUST]
- **Prerequisites:** F4 and F3.
- **Beginner must-see:** CPU repeatedly reading a device status bit until the device is ready.
- **Finer points:** programmed I/O, polling interval, busy waiting, CPU time spent polling and processing.
- **GATE level:** compare polling with interrupt-driven service and calculate CPU-time fraction.
- **Diagrams:** polling loop; device status register.
- **Hand traces:** count polls per second and multiply by time per poll.
- **Common mistakes:** assuming polling only costs time when data is found; confusing elapsed time with CPU busy time.

### C6.2. Interrupts, ISR entry and priority — 75 minutes [MUST]
- **Prerequisites:** C1.1, C2.6, C6.1.
- **Beginner must-see:** device raises an interrupt during an instruction; CPU completes it, saves state, vectors to ISR and later returns.
- **Finer points:** asynchronous request, vectored/non-vectored, ISR, PC/status save, restore, masking, priority, daisy chain versus polling.
- **GATE level:** order service steps; distinguish vector identification from CPU polling; identify hardware priority.
- **Diagrams:** interrupt entry/exit flow; daisy-chain chain; vector table.
- **Hand traces:** order a shuffled event list and trace which device wins priority.
- **Common mistakes:** changing PC before saving the return point; saying daisy chaining is software polling; assuming the ISR starts before the current instruction finishes.

### C6.3. DMA controller and bus ownership — 75 minutes [MUST]
- **Prerequisites:** F3, C6.1–C6.2.
- **Beginner must-see:** DMA controller requesting the bus, transferring data between device and memory, and releasing the bus.
- **Finer points:** DMA setup, source/destination/count, bus request/grant, bus master, CPU involvement, burst/block and cycle-stealing modes.
- **GATE level:** compare throughput and CPU interruption across DMA modes; reason about shared-bus ownership.
- **Diagrams:** CPU/DMA/device/memory block diagram; bus ownership timeline.
- **Hand traces:** follow one 8-byte transfer under cycle stealing and one block transfer under burst mode.
- **Common mistakes:** saying CPU and DMA drive the same shared bus simultaneously; thinking DMA eliminates all CPU setup work.

### C6.4. DMA rates and I/O performance calculations — 60 minutes [MUST]
- **Prerequisites:** F4, C6.3.
- **Beginner must-see:** a frequency-to-cycles-per-second calculation with a stated percent of cycles used by DMA.
- **Finer points:** words/bytes/bits per cycle, cycles stolen, transfer rate, latency versus throughput.
- **GATE level:** NAT calculations involving MHz, percentage and bytes/character.
- **Diagrams:** transfer timeline; units-conversion ladder.
- **Hand traces:** `frequency × fraction × bytes/cycle × 8`; compare two DMA modes.
- **Common mistakes:** using 1% as 1 rather than 0.01; forgetting 8 bits per byte; using CPU frequency as the direct transfer rate.

### C6.5. Device interface, handshaking and integrated I/O review — 60 minutes [SHOULD]
- **Why this tag:** basic interfacing makes the chapter coherent; detailed peripheral protocols are beyond the core syllabus unless a PYQ requires them.
- **Prerequisites:** F3, C6.1–C6.4.
- **Beginner must-see:** device controller registers connected to CPU/data bus with ready/request/acknowledge signals.
- **Finer points:** status/data/control registers, simple handshaking, interrupt request, DMA completion and device/controller distinction.
- **GATE level:** integrate polling, interrupt and DMA selection in a conceptual MCQ.
- **Diagrams:** device-controller block; request/acknowledge timing.
- **Hand traces:** follow one input character through controller, CPU and memory.
- **Common mistakes:** treating the device and its controller as the same thing; mixing data-ready with interrupt acknowledgement.

---


# PART 6. EVERY PYQ IN THE UPLOADED BANK — concept, lesson, trap and key audit

**Key-audit labels:**
- **Agrees:** I can re-solve from the text and the marked official key agrees.
- **Agrees with assumption:** the marked key follows under the normal/explicitly stated model; I state the assumption.
- **Cannot verify image:** a required figure/table is absent from this upload. The key is not being called wrong; it is simply not independently verified here.
- **FACT-DOUBT:** the pasted question is ambiguous or missing information that changes the answer.

| # | PYQ | Lesson | Exact concept tested | Trap / finer point | Official key re-solve and transcription check |
|---:|---|---|---|---|---|
| 1 | 2026_FN_Q14 | C1.4 | Match addressing modes with constants, pointers, array elements and record fields. | Immediate supplies a constant; indirect follows a pointer; base+index is natural for arrays; base+offset for a record field. | **B — Agrees.** Immediate→constant, indirect→pointer, base+index→array element, base+offset→record element. No obvious text error. |
| 2 | 2026_FN_Q15 | C1.3 | Translate `Z=X+Y` under a load-store ISA. | Arithmetic operands must be in registers; result must be stored to memory. | **D — Agrees.** Load X and Y, ADD into R2, STORE to Z. The first operand is destination as stated. |
| 3 | 2026_FN_Q16 | C3.4 | Which register dependency can cause a classic in-order pipeline data hazard? | RAW is the true read-after-write dependency; WAR/WAW are not hazards in the simple in-order five-stage model normally assumed. | **B — Agrees.** Read-after-write. The question should state the pipeline assumptions if it wants to exclude out-of-order hazards. |
| 4 | 2026_AN_Q18 | C6.2 | Non-vectored and daisy-chain interrupt mechanisms. | Non-vectored service needs source/ISR identification; daisy-chain hardware priority is not the same as CPU software polling. | **C — Agrees.** S1 true; S2 false. No obvious text error. |
| 5 | 2026_FN_Q38 | C4.4 | Difference in tag width between direct-mapped and set-associative cache. | Increasing associativity reduces index bits by `L`, so tag bits increase by `L`. | **A — Agrees if associativity is `2^L`.** Direct-mapped: tag `M`; `2^L`-way: `L` fewer index bits, hence `N=M+L`. **FACT-DOUBT:** pasted wording says `K=2^k` and separately `L∈{1,2,3}` but never says `k=L` or that associativity is `2^L`. Repair the symbol relationship before publishing. |
| 6 | 2026_AN_Q44 | C1.2 | Maximum unique variable-length opcodes for C-type instructions. | Opcode space is a prefix tree; the 2-bit M-type opcodes use two 2-bit prefixes, the seven 4-bit R-type opcodes consume seven extensions, and the remaining prefix space determines C choices. | **B (4) — Agrees.** After allocating the two M codes, the remaining 4-bit prefix slots can be expanded; seven R codes leave one 4-bit slot, which expands to four 6-bit C opcodes. No obvious text error. |
| 7 | 2026_AN_Q52 | C4.5 | Direct-mapped cache hits/misses for repeated P,Q,R,S accesses. | P and R are in the same 16-byte block; S maps to the same cache line as P/R but has a different tag; Q maps elsewhere. | **A and B — Agrees.** P misses every time because S evicts its line before the next P; R hits every time because P brings the shared block in immediately before it; Q misses only initially; S misses every time. No obvious text error. |
| 8 | 2026_FN_Q54 | C5.4 | TLB, page-table and physical-cache event ordering. | With a physical-address cache and invalidation on page eviction, a nonresident page cannot yield a valid cache hit. A TLB hit and a page-table miss are also inconsistent in this model. | **B and C — Agrees.** A is possible; B and C cannot happen; D is possible. No obvious text error, but the book must define “page table hit/miss” precisely. |
| 9 | 2026_AN_Q56 | C4.3 | Maximum direct-mapped cache size from an observed cache block number. | Must find a compatible block size and power-of-two line count; capacity = lines × block size. | **128 KB — Agrees.** One compatible maximum is 64-byte blocks and 2048 lines: address `0xA2C28` gives block number 10416; `10416 mod 2048 = 176`; capacity `2048×64 = 131072` bytes. No obvious text error. |
| 10 | 2026_AN_Q57 | C3.7 | Speedup of a pipelined design with a lower clock rate and stalls. | Compare time per instruction, not CPI alone. | **2.34 — Agrees.** Non-pipeline: `5/1.6 GHz = 3.125 ns/instruction`. Pipeline: average CPI `1 + 0.30×2 = 1.6`; time `1.6/1.2 GHz = 1.333… ns`; speedup ≈2.34. No obvious text error. |
| 11 | 2026_FN_Q60 | C3.3 | Structural-hazard stall cycles in the EX stage. | Need the per-instruction EX duration/type-count table to know which instructions contend and for how long. | **95 — Cannot verify image.** `IMAGE_Q_60_1` is absent. No claim that the key is wrong; restore the table before using this as a worked example. |
| 12 | 2025_FN_Q11 | C6.2 | Order of interrupt acceptance steps. | CPU completes the current instruction before saving return state and transferring to ISR. | **A — Agrees.** (iii) → (i) → (ii). No obvious text error. |
| 13 | 2025_FN_Q27 | C2.1 | What arithmetic operations a partial datapath can support. | Whether the datapath supports register/register, register/immediate or immediate/immediate depends on its muxes and source paths. | **A, B and C — Cannot verify image.** `IMAGE_Q_27_1` is absent, and it is the entire evidence needed to assess the options. Restore the datapath and then validate all three. |
| 14 | 2025_AN_Q28 | C1.1 | Which property belongs to the ISA. | Cache size, clock frequency and cache-level count are implementation choices; the architectural register set is programmer-visible. | **D — Agrees.** Total number of registers is part of the ISA description. No obvious text error. |
| 15 | 2025_AN_Q32 | C2.5 | Count Booth addition and subtraction operations for a signed multiplier. | Append `Q−1=0`; inspect each `(Qi, Q(i−1))` pair; only 01/10 cause an operation. | **13 — Agrees.** The supplied multiplier has 13 transition pairs requiring add/subtract. No obvious text error. |
| 16 | 2025_FN_Q36 | C4.2 | Total number of direct-mapped cache tag bits. | Calculate tag width per line, then multiply by the number of lines. | **A — Agrees.** 20-bit address; 16-byte block gives 4 offset bits; 16 KB cache gives 1024 lines and 10 index bits; tag=6 bits/line; total `6×2^10`. No obvious text error. |
| 17 | 2025_FN_Q37 | C1.2 | Maximum immediate-field width in a 32-bit instruction. | 64 registers require 6 bits; 50 instruction types require 6 opcode bits. | **B (20) — Agrees.** `32−6−6=20`. One register field is present in `ADD R1,#25`; no obvious text error. |
| 18 | 2025_AN_Q39 | C4.3 | Main-memory and cache sizes from tag/index/offset widths. | Block size is one byte, so offset width is zero. | **A — Agrees.** Main address width=16 bits→64 KB; 12 index bits→4096 one-byte lines→4 KB cache. No obvious text error. |
| 19 | 2025_FN_Q53 | C4.7 | Two-level cache AMAT. | Must read L1/L2 hit rates and access times from the figure and apply conditional misses correctly. | **11.83–11.87 ns — Cannot verify image.** `IMAGE_Q_53_1` is absent. The numeric interval cannot be independently checked without the figure values. |
| 20 | 2025_AN_Q55 | C4.7 | AMAT for two cache levels and main memory. | L2 hit rate is conditional on an L1 miss; main-memory penalty is paid only after an L2 miss. | **4.0 ns — Agrees.** `1 + 0.1×(10 + 0.2×100) = 4`. No obvious text error. |
| 21 | 2025_AN_Q56 | C3.2 | Time for 1000 instructions through a five-stage pipeline. | Clock period is max stage delay plus latch delay; total cycles are `n+k−1`. | **261.04 µs — Agrees.** Cycle=`250+10=260 ns`; cycles=`1000+5−1=1004`; time=261040 ns. Within the key range. No obvious text error. |
| 22 | 2025_AN_Q61 | C3.2 | Clock-cycle duration from instruction count, elapsed time and instruction mix. | The missing table is needed for the weighted average CPI. | **3.0 ns — Cannot verify image.** `IMAGE_Q_61_1` is absent. Restore the instruction mix/CPI table. |
| 23 | 2024_AN_Q24 | C6.4 | DMA transfer rate when 1% of a 4 MHz CPU's cycles are used. | Each cycle transfers 8 bytes = 64 bits. | **C — Agrees.** `4×10^6 × 0.01 × 64 = 2.56×10^6 bit/s`. No obvious text error. |
| 24 | 2024_FN_Q33 | C6.1 | Identify the false statement about DMA and I/O. | Programmed I/O typically occupies the CPU polling/waiting; interrupt I/O can free CPU time between events. | **C — Agrees.** Claiming programmed I/O has better CPU utilisation than interrupt-driven I/O is false. No obvious text error. |
| 25 | 2024_FN_Q22 | C3.5 | Meaning and limitations of forwarding. | Forwarding needs hardware; it cannot eliminate every stall, especially a load-use delay. | **A, B and C — Agrees.** D is false because forwarding requires bypass paths/muxes. No obvious text error. |
| 26 | 2024_AN_Q25 | C3.4 | RAW/WAR/WAW dependencies across four instructions. | I1 writes R3 and I2 reads it: RAW; I2→I3 is WAR, I3→I4 is RAW. | **A only — Agrees.** A is true; B, C and D are false. No obvious text error. |
| 27 | 2024_FN_Q41 | C4.6 | Write-back versus write-through, LRU and dirty blocks. | A write-back read miss can evict a dirty line; write-through lines are already reflected in memory and do not need dirty writeback. | **B and C — Agrees.** B is true; a write hit in WB can set/change dirty; A and D are false. No obvious text error. |
| 28 | 2024_FN_Q55 | C3.7 | Number of cores minimising a parallel workload with overhead. | Use the stated 90% parallel/10% serial split and add the overhead for each additional core. | **3 — Agrees with the stated per-additional-core model.** `T(N)=10+90/N+10(N−1)` is minimised at N=3. The prose “overhead for using an additional core is 10 ns” should be clarified as 10 ns per extra core. |
| 29 | 2024_FN_Q56 | C4.8 | Speedup from replacing imperfect I/D caches with perfect caches. | Data-cache misses occur only for the 25% load/store instructions; instruction misses occur for every instruction fetch. | **3.00 — Agrees.** Stall CPI=`0.02×100 + 0.25×0.08×100 = 4`; actual CPI=6, ideal=2; speedup=3. No obvious text error. |
| 30 | 2024_AN_Q49 | C1.2 | Maximum opcode count for each of eight addressing modes. | 16 registers require 4 bits each; 8 modes require 3 bits; two register fields use 8 bits. | **32 — Agrees.** Remaining opcode width=`32−16−8−3=5`; `2^5=32`. No obvious text error. |
| 31 | 2024_AN_Q56 | C3.7 | Pipeline speedup with data and control stalls. | Stall cycles add to ideal CPI; add the two independent contributions. | **3.0 — Agrees.** CPI=`1 + 0.2×2 + 0.2×3 = 2`; non-pipeline CPI=6; speedup=3. No obvious text error. |
| 32 | 2024_AN_Q43 | C1.2 | Determine instruction-format field widths from R/I formats. | Need the exact field positions and which bits are shared/unused. | **34 — Cannot verify image.** Both R-type and I-type diagrams are absent. Since X, Y and Z refer to fields shown in those diagrams, the supplied text is insufficient to confirm 34. |
| 33 | 2023_FN_Q33 | C3.2 | Time for 100 instructions in a three-stage pipeline. | Clock period is the longest stage, 20 ns; total cycles are 100+3−1. | **2040 ns — Agrees.** `102×20=2040`. No obvious text error. |
| 34 | 2023_FN_Q34 | C6.1 | CPU time fraction for polling versus interrupts. | Poll every 10 ms means 100 polls/s; every poll costs 100 µs, plus 200 µs to process the one key event. | **10.2 — Agrees.** T1=10 ms+0.2 ms=10.2 ms; T2=1 ms; ratio=10.2. No obvious text error. |
| 35 | 2023_FN_Q41 | C1.5 | Replace unknown assembly operands for `a[i]=b[i]*8`. | Multiply by 8 is left shift by 3; each 32-bit integer advances pointer by 4 bytes; loop returns to comparison at L01. | **B — Agrees.** `(3,4,4,L01)`. No obvious text error. |
| 36 | 2023_FN_Q64 | C4.2 | Tag-bit calculation in an 8-way 64 KB cache. | Tag width depends on block offset, which depends on block size. | **19 — FACT-DOUBT: under-specified as pasted.** 64 KB/8 ways gives 8192 sets, so index=13 bits. Tag would be `32−13−offset_bits`; 19 follows only if block offset is zero (one-byte blocks). No block size or one-byte-block assumption is stated. Restore the missing condition or mark the item as incomplete. |
| 37 | 2022_FN_Q17 | C6.3 | Best throughput for bulk disk-to-memory transfer. | DMA transfers data without making the CPU move every word by programmed polling/interrupt service. | **A — Agrees.** DMA is the best option for bulk transfer. No obvious text error. |
| 38 | 2022_FN_Q24 | C4.6 | Identify false claims about write-back and write-through caches. | Dirty bit belongs to write-back; write-back write hits normally do not immediately update main memory; dirty victim can be evicted. | **A, B and D — Agrees.** C is true for write-through because memory already has the updated value. No obvious text error. |
| 39 | 2022_FN_Q33 | C4.7 | Minimum new hit rate needed after hit time increases. | Compare new AMAT with old AMAT, not old and new hit rate alone. | **0.85 — Agrees.** Old AMAT=`10+0.2×100=30 ns`; new=`15+(1−h)×100`; set ≤30 gives h≥0.85. No obvious text error. |
| 40 | 2022_FN_Q54 | C4.5 | Repeated P,Q,R,S trace in a 32-line direct-mapped cache. | P and S are in the same 64-byte block; Q and R map to the same line but have different tags. | **A, B and D — Agrees.** S hits because it shares P's block; P is not evicted; R repeatedly replaces Q. C is false. No obvious text error. |
| 41 | 2022_FN_Q61 | C3.6 | Branch prediction accuracy and speedup. | Only wrong predictions retain the 2-cycle branch penalty. | **≈1.43 — Agrees.** X1 CPI=`1+0.3×2=1.6`; X2 CPI=`1+0.3×0.2×2=1.12`; speedup≈1.43. No obvious text error. |
| 42 | 2021_AN_Q65 | C4.4 | Associativity from tag width, capacity and block size. | The set count is cache blocks divided by ways; tag = address − index − offset. | **2 — Agrees.** 2 KB/64 B=32 blocks; 32-bit address, 6 offset bits and 22 tag bits leave 4 index bits, 16 sets; 32/16=2 ways. No obvious text error. |
| 43 | 2021_AN_Q11 | C6.4 | DMA bit rate under 0.5% cycle stealing on a 2 MHz CPU. | One 8-bit character per stolen cycle. | **80000 bit/s — Agrees.** `2×10^6×0.005×8=80000`. No obvious text error. |
| 44 | 2021_FN_Q51 | C4.3 | Tag width for 32 KB direct-mapped cache and 64-byte blocks. | Offset=6, line count=512 and index=9. | **17 bits — Agrees.** `32−6−9=17`. No obvious text error. |
| 45 | 2021_AN_Q39 | C4.6 | Write-through L1 inside an inclusive two-level cache; allocation policies. | Write-through means L1 writes are propagated; write-allocate/no-write-allocate are policy choices, not mandatory pairings. | **A — Agrees.** S1 true, S2 false. No obvious text error. |
| 46 | 2021_AN_Q58 | C1.5 | Interpret two-byte unsigned values under little/big endian. | Compare the same two memory bytes; do not reverse hexadecimal digits as if each digit were a byte. | **A and D — Agrees.** For these candidate values the little-endian interpretation exceeds the big-endian interpretation by 255. The phrasing “represent the unsigned integer on a little endian computer” is slightly awkward; add an explicit byte-address order diagram in the book. |
| 47 | 2021_FN_Q41 | C3.2 | Time for 100 independent instructions in a five-stage pipeline. | Cycle time is the maximum stage delay plus 5 ns pipeline-register delay. | **17160 ns — Agrees.** Cycle=165 ns; cycles=104; time=17160 ns. No obvious text error. |
| 48 | 2021_AN_Q59 | C3.5 | Speedup with versus without forwarding for dependent ADD/MUL sequence and multi-cycle EX. | The consumer reads operands in EX; MUL occupies EX for two cycles; forwarding makes result available after EX, while no-forwarding waits for WB. | **1.87–1.88 — Agrees under the conventional five-stage schedule.** A schedule gives 16 cycles with forwarding and 30 without; ratio=30/16=1.875. The book must show the pipeline chart and write its WB/forwarding timing assumptions explicitly. |
| 49 | 2021_FN_Q38 | C1.4 | Execute an instruction sequence and find final memory value. | Effective-address mode and the exact instructions are in the missing image. | **50 — Cannot verify image.** `IMAGE_Q_38_1` is absent. Restore the instruction sequence before treating 50 as checked. |
| 50 | 2020_FN_Q33 | C6.2 | Daisy chaining, vectored interrupts, polling and DMA bus masters. | Daisy chaining sets priority; vectored interrupts do not require CPU polling to identify the source; CPU and DMA cannot both drive the same shared bus at once. | **C — Agrees.** I and III only are true. No obvious text error. |
| 51 | 2020_FN_Q30 | C2.6 | Order micro-operations for instruction fetch then `R0←R1+R2`. | Fetch (PC→MAR, memory read), load IR, read R1 to TEMP1, ALU add with R2, write R0. | **C — Agrees from the listed dependencies.** Order 3,5,2,1,4. **Cannot fully verify path legality** because the datapath image is absent; restore it for teaching. |
| 52 | 2020_FN_Q27 | C4.8 | Average memory access time with miss block transfer. | 256 bytes / 8 bytes per word = 32 words; after the first word, 31 more take 5 ns each. | **13.3 or 13.5 ns — FACT-DOUBT in the accepted values.** Miss block service=`20+31×5=175 ns`. `3 + 0.06×175=13.5 ns` under the common hit-time-plus-miss-penalty formula. A weighted `0.94×3 + 0.06×175` gives 13.32≈13.3. The key accepts both conventions; the question should state whether 3 ns is incurred on a miss in addition to the transfer delay. |
| 53 | 2020_FN_Q55 | C4.3 | Find which physical addresses map to same set in a 4-way cache. | 64 KB / (4×256 B)=64 sets; index is address bits 13:8. | **B — Agrees.** A2 and A3 both map to set 40; A1/A4 map to set 8. No obvious text error. |
| 54 | 2020_FN_Q43 | C3.7 | Compare non-pipelined and pipelined time with memory/branch stalls. | Convert frequencies to periods; average stalls are weighted by fraction of each instruction type. | **≈2.16 — Agrees.** NP time/instruction=`5×0.4=2 ns`; pipeline CPI=`1 + 0.3×0.05×50 + 0.1×0.5×2 = 1.85`; pipeline time=`1.85×0.5=0.925 ns`; speedup≈2.16. No obvious text error. |
| 55 | 2020_FN_Q63 | C1.2 | Maximum R-type opcodes with variable-length formats. | Eight 6-bit I-type opcodes can be packed under two 4-bit prefixes (four 6-bit suffixes per prefix); the other fourteen 4-bit prefixes can be R-type opcodes. | **14 — Agrees.** Eight 6-bit I-type opcodes can be packed under two 4-bit prefixes (four suffixes per prefix); the other fourteen 4-bit prefixes remain available for R-type opcodes. No obvious text error. |
| 56 | 2019_FN_Q11 | C4.4 | Tag and index fields in a fully associative cache. | Fully associative means no set index; block offset still exists. | **D — Agrees.** 32-bit address − 4 offset bits =28 tag bits, index=0. No obvious text error. |
| 57 | 2019_FN_Q60 | C4.8 | Maximum read bandwidth with block acceptance, block fetch and word transmission. | Total service cycles include 1 address-accept cycle + 3 fetch cycles + 8 word-send cycles; block=32 bytes. | **160×10^6 bytes/s — Agrees.** `32 bytes/(12/60 MHz)=160 MB/s`. No obvious text error. |
| 58 | 2018_FN_Q15 | C1.7 | Identify RISC design characteristics. | Register-register operations, fixed-length instruction format and hardwired control are the textbook traits used in this question. | **D — Agrees.** All three statements are treated as RISC characteristics. No obvious text error. |
| 59 | 2018_FN_Q19 | C6.2 | Order interrupt response, context save/restore and ISR events. | Finish current instruction before the interrupt sequence; restore state after ISR. | **A — Agrees.** Q → P → T → R → S. No obvious text error. |
| 60 | 2018_FN_Q33 | C5.2 | DRAM refresh overhead for a 256M×4 chip organisation. | Eight x4 chips provide a 32-bit word; refresh every row in the stated period. | **59–60% available time — Agrees.** `2^14×50 ns=819.2 µs`; available fraction=`1−819.2/2000=0.5904`. No obvious text error. |
| 61 | 2018_FN_Q44 | C4.2 | Tag width for K-way set-associative cache with word length and block size. | Block bytes are `2^(M+W)`; set-index bits reduce by `log2 K`. | **B — Agrees.** Tag=`P−N+log2 K`. No obvious text error. |
| 62 | 2018_FN_Q60 | C3.3 | Pipeline cycles when PO takes 1, 2 or 3 cycles for different instructions. | Variable-latency PO consumes the stated number of cycles; then account for pipeline fill/drain. | **219 — Agrees.** PO demand=`40×3 + 35×2 + 25×1 = 215`; four surrounding single-cycle pipeline stages add the fill/drain amount to give 219 under the stated schedule. No obvious text error. |
| 63 | 2018_FN_Q61 | C1.2 | Maximum number of Type-4 opcodes in a 16-bit variable-length instruction set. | Type-1 and Type-2 use 4-bit prefixes; Type-3 uses 6-bit codes; remaining 6-bit prefixes can be extended to 10-bit Type-4 opcodes. | **32 — Agrees.** Four Type-1 + eight Type-2 consume 12 of the 16 four-bit prefixes; remaining four yield 16 six-bit codes, fourteen used by Type-3; two six-bit prefixes remain, each extends to 16 ten-bit codes: 32. No obvious text error. |
| 64 | 2017_FN_Q27 | C1.5 | Calculate structure field access offset. | `marks[100]` uses 100×4=400 bytes before `grade`. | **D — Agrees.** Indexed/base-offset addressing `X(R1)` can select the field at offset 400. No obvious text error; state the assumed `int` size in the teaching solution. |
| 65 | 2017_FN_Q20 | C4.7 | Derive local L2 miss rate from L1 miss rate and L2 misses per instruction. | L1 misses per instruction=`1.4×0.1=0.14`; L2 local miss rate=`0.007/0.14`. | **0.05 — Agrees.** No obvious text error. |
| 66 | 2017_AN_Q47 | C4.7 | Solve L1/L2 miss rates from AMAT and relative miss rates. | L2 access and main-memory penalty are paid conditionally after misses. | **A — Agrees.** Let L2 miss rate `m`; L1 miss=`2m`. `2=1+2m(8+18m)` gives m≈0.0556 and L1≈0.111. No obvious text error. |
| 67 | 2017_AN_Q39 | C4.7 | Average read access time with multi-level caches, word-first policy and instruction/data access mix. | Need each cache's hit ratio and access time from the missing hierarchy figure; instruction and operand reads have different paths. | **4.72 ns — Cannot verify image.** `IMAGE_Q_39` is absent. The hit/access values are necessary for the calculation. |
| 68 | 2017_FN_Q60 | C1.6 | PC-relative branch offset to a target instruction. | Offset is relative to the next instruction and is measured in bytes; instruction length is 4 bytes. | **−16 — Cannot verify image.** `IMAGE_Q_60` containing instruction addresses/branch location/target is absent. Formula is `target − address(next instruction)`; restore the code figure to check −16. |
| 69 | 2017_FN_Q49 | C3.2 | Speedup when a 5-stage pipeline is split into 6 stages. | Add 2 ns latch delay to each stage; the new clock is set by the maximum split stage. | **1.49–1.52 — Agrees.** NP: 24 cycles×22 ns=528 ns. EP: 25 cycles×14 ns=350 ns. Speedup=1.5086. No obvious text error. |
| 70 | 2017_FN_Q53 | C4.5 | Count conflict misses in a 2-way, 256-block LRU cache. | There are 128 sets; 0/128/256 contend in one set and 1/129/257 in another; repeated sequence distinguishes compulsory from conflict. | **76 — Agrees.** Simulation gives 82 misses total, 6 compulsory and 76 conflict. No obvious text error. |
| 71 | 2017_AN_Q36 | C4.3 | Tag width in a 32-bit, direct-mapped cache with 512 lines and 32-byte blocks. | Offset=5, index=9. | **18 — Agrees.** `32−5−9=18`. No obvious text error. |
| 72 | 2017_FN_Q65 | C4.4 | Tag width change from direct-mapped to 16-way set-associative. | 16-way means four fewer index bits, so tag gains four bits if capacity/block size stay unchanged. | **14 — Agrees.** Direct-mapped tag=10; 16-way tag=`10+log2 16=14`. No obvious text error. |

### PYQ audit summary

- **72/72** question IDs are present in the upload; the question marks sum to **115**, matching the supplied bank summary.
- **63** question statements are text-complete enough to review without relying on a missing figure; most marked keys agree with the calculation/standard interpretation, with the caveats recorded in the table.
- **9** cannot be independently verified because the referenced figure/table is missing.
- **2** material source-text issues need correction before publication: `2026_FN_Q38` has an undefined relationship between K/k/L; `2023_FN_Q64` omits block size. `2020_FN_Q27` has two accepted numeric values explained by different AMAT conventions; clarify the convention. `2024_FN_Q55` should state that the 10 ns overhead applies per additional core.
- The 31 “Forge” questions mentioned in Part B are not included as full question texts here, so they were not individually reviewed; do not count them as PYQs.
- The answer key being labelled “official” in this upload is not, by itself, enough to repair a missing diagram or missing premise. Keep the original GATE paper/official key attached to each question in the app.

---


# PART 7. THREE MORE QUESTION IDEAS FOR EVERY LESSON

These are **new practice prompts**, not claims about actual GATE questions. The point is to make sure a lesson teaches beyond the exact PYQs already in the bank. Each lesson gets one MCQ, one MSQ and one NAT-style idea.

## Foundation

**F1 — Bits, binary, hexadecimal and powers of two**
1. **MCQ:** What is the minimum number of bits needed to encode 73 distinct symbols?
2. **MSQ:** Select all 8-bit patterns whose unsigned value is greater than 127.
3. **NAT:** Convert `0x2D7` to decimal.

**F2 — Bytes, words, addresses and memory contents**
1. **MCQ:** In a byte-addressable machine with 8-byte words, what is the next word address after 0x100?
2. **MSQ:** Select all statements that distinguish address, data value and memory capacity correctly.
3. **NAT:** A 32-bit word begins at byte address 0x240; find the address of its fourth byte.

**F3 — Registers, buses, multiplexers and simple logic**
1. **MCQ:** How many select bits are required for a 16-to-1 multiplexer?
2. **MSQ:** Which control arrangements allow two registers to place data on one shared bus without contention?
3. **NAT:** A register file has 128 registers; how many bits are required for one register identifier?

**F4 — Time, frequency, CPI and throughput**
1. **MCQ:** Which processor has the lower execution time when both instruction count and clock period are given?
2. **MSQ:** Select all equivalent ways to express a 500 MHz clock period.
3. **NAT:** Find execution time for 2.4 million instructions at CPI 1.5 on a 1.2 GHz processor.

## Chapter 1 — Machine instructions and addressing modes

**C1.1 — ISA and instruction cycle**
1. **MCQ:** Which item is generally an implementation detail rather than an ISA-visible property: register count, instruction encoding, cache capacity or addressing mode?
2. **MSQ:** Select the events that belong to a normal instruction fetch path.
3. **NAT:** If PC=0x200 and each instruction is 4 bytes, find the sequential PC after three instructions.

**C1.2 — Instruction formats and fields**
1. **MCQ:** A 24-bit instruction has two 5-bit register fields and a 7-bit immediate; how many opcode bits remain?
2. **MSQ:** Which field layouts are valid when all field widths must add exactly to instruction length?
3. **NAT:** Find the maximum immediate width in a 40-bit instruction with 128 registers and 90 operation codes.

**C1.3 — Registers, memory operands and load-store**
1. **MCQ:** Which sequence implements `A=B−C` on a strict load-store machine with only register arithmetic?
2. **MSQ:** Select the statements true for a load-store architecture.
3. **NAT:** How many explicit LOAD/STORE/ALU instructions are required for a given two-input expression under the stated register availability?

**C1.4 — Addressing modes and effective address**
1. **MCQ:** Which addressing mode follows a pointer stored in a register to obtain the operand?
2. **MSQ:** Select all addressing modes that require a memory access to obtain the operand after the effective address is formed.
3. **NAT:** Given base=0x800, index=7 and element size=8, find the address of array element 7.

**C1.5 — Endianness, arrays, structures and addresses**
1. **MCQ:** Which byte is stored at the lowest address for a specified 32-bit value on a little-endian machine?
2. **MSQ:** Select the true statements about array stride, structure padding and byte order.
3. **NAT:** A structure has a 12-byte array followed by a 2-byte field; under the stated alignment rule, find the next field's offset.

**C1.6 — Branches and PC-relative addressing**
1. **MCQ:** A branch at 0x140 is 4 bytes long and has offset −20 relative to the next instruction; where does it branch?
2. **MSQ:** Select all statements true of signed PC-relative offsets.
3. **NAT:** Determine the signed offset in bytes for a branch from 0x300 to 0x2D0, with offset measured from PC+4.

**C1.7 — RISC/CISC and ISA design review**
1. **MCQ:** Which combination best matches the textbook load-store RISC model?
2. **MSQ:** Select the statements that distinguish ISA properties from microarchitectural choices.
3. **NAT:** Given opcode-prefix constraints and register field widths, find the remaining number of encodings for one instruction class.

## Chapter 2 — ALU, datapath and control unit

**C2.1 — Datapath from zero**
1. **MCQ:** Which component selects one of two possible ALU operands based on a control bit?
2. **MSQ:** Select all operations that a stated partial datapath can perform using its actual source paths.
3. **NAT:** Count the minimum register-transfer steps needed to move a value through a supplied datapath.

**C2.2 — Binary arithmetic and overflow**
1. **MCQ:** Which 4-bit two's-complement addition overflows even though its carry-out is zero?
2. **MSQ:** Select all correct statements about sign extension, carry-out and signed overflow.
3. **NAT:** Compute the 8-bit two's-complement result of −37 + 19.

**C2.3 — ALU operations and function selection**
1. **MCQ:** Which ALU control setting produces bitwise XOR for the supplied truth table?
2. **MSQ:** Select all outputs/flags that can be derived from a given ALU operation.
3. **NAT:** Compute the ALU result for two specified 8-bit operands under a logical right shift.

**C2.4 — Adders and carry delay**
1. **MCQ:** Which adder architecture reduces long carry propagation by computing carries in parallel?
2. **MSQ:** Select all correct properties of half adders, full adders and ripple-carry chains.
3. **NAT:** Calculate the sum and carry-out of two given 6-bit unsigned operands.

**C2.5 — Booth multiplication**
1. **MCQ:** What operation is required for the pair `Q0Q−1 = 10`?
2. **MSQ:** Select all Booth iterations that perform an arithmetic operation for a supplied multiplier bit string.
3. **NAT:** Count the total add/subtract operations for a new 8-bit signed multiplier.

**C2.6 — Register transfers and instruction execution**
1. **MCQ:** Which micro-operation must occur before the ALU can write a result into the destination register?
2. **MSQ:** Select all valid orderings of a fetch-and-execute sequence under the supplied datapath constraints.
3. **NAT:** Find the number of cycles/micro-operations in a given control sequence.

**C2.7 — Hardwired control**
1. **MCQ:** Which block decodes an opcode into control signals in a hardwired control unit?
2. **MSQ:** Select all characteristics of a hardwired control design.
3. **NAT:** Given a small state table, count the number of distinct control states needed for a sequence.

**C2.8 — Microprogrammed control**
1. **MCQ:** What does the microprogram counter select?
2. **MSQ:** Select the fields that may appear in a microinstruction/control word.
3. **NAT:** Follow a short microprogram and find the final micro-address reached.

## Chapter 3 — Pipelining and hazards

**C3.1 — Why pipelining works**
1. **MCQ:** Which metric improves when independent instructions overlap without changing the latency of a single instruction?
2. **MSQ:** Select all correct statements about pipeline fill, drain, throughput and latency.
3. **NAT:** Find total cycles for 250 instructions in a seven-stage ideal pipeline.

**C3.2 — Clock period, latches and uneven stages**
1. **MCQ:** Which delay determines the clock period in a synchronous pipeline?
2. **MSQ:** Select all valid reasons why splitting a stage can improve throughput or add overhead.
3. **NAT:** Calculate total execution time for 500 instructions with six stages and a stated latch delay.

**C3.3 — Structural hazards**
1. **MCQ:** What kind of hazard occurs when IF and MEM need one shared single-ported memory in the same cycle?
2. **MSQ:** Select all resource conflicts in a supplied pipeline schedule.
3. **NAT:** Count stalls when a functional unit is occupied for a stated number of consecutive cycles.

**C3.4 — Data dependencies and hazards**
1. **MCQ:** Identify the dependency between an instruction that writes R4 and a later instruction that reads R4.
2. **MSQ:** Select all RAW/WAR/WAW dependencies in a six-instruction sequence.
3. **NAT:** Count the number of RAW dependencies in a supplied register read/write table.

**C3.5 — Forwarding, stalls and multicycle EX**
1. **MCQ:** Which forwarding path can deliver a result from a prior instruction to the current EX input?
2. **MSQ:** Select all cases where forwarding cannot remove a stall.
3. **NAT:** Calculate pipeline cycles for a dependent sequence containing two-cycle MUL operations.

**C3.6 — Control hazards and prediction**
1. **MCQ:** Which instructions are flushed after a branch misprediction in a specified pipeline?
2. **MSQ:** Select all correct consequences of branch prediction accuracy and penalty.
3. **NAT:** Find effective CPI for a 20% branch mix, 3-cycle penalty and 90% prediction accuracy.

**C3.7 — Whole-program performance**
1. **MCQ:** Which processor is faster when CPI and clock rates differ?
2. **MSQ:** Select all contributors to effective CPI in a program with cache and branch stalls.
3. **NAT:** Find the optimal core count under a stated serial fraction and per-extra-core overhead.

## Chapter 4 — Cache memory

**C4.1 — Hierarchy and locality**
1. **MCQ:** Which access pattern demonstrates temporal locality?
2. **MSQ:** Select all correct comparisons among registers, cache, RAM and secondary storage.
3. **NAT:** Given hit and miss counts, calculate hit rate and miss rate.

**C4.2 — Organisation and address fields**
1. **MCQ:** Which field selects a byte within a cache block?
2. **MSQ:** Select all valid address splits for a cache with given capacity, block size and ways.
3. **NAT:** Find tag bits for a 48-bit address, 128 KB cache, 64-byte blocks and 4-way associativity.

**C4.3 — Direct mapping**
1. **MCQ:** Which cache line receives a given memory block under direct mapping?
2. **MSQ:** Select all address pairs that map to the same line but have different tags.
3. **NAT:** Simulate a 6-access sequence and count misses in a direct-mapped cache.

**C4.4 — Associative mapping**
1. **MCQ:** How many index bits are present in a fully associative cache?
2. **MSQ:** Select all correct statements about ways, sets, tags and replacement.
3. **NAT:** Find associativity from address width, tag width, block size and capacity.

**C4.5 — LRU and miss classification**
1. **MCQ:** Which block is evicted under LRU after a supplied access sequence?
2. **MSQ:** Classify compulsory, conflict and capacity misses for a trace.
3. **NAT:** Count compulsory and conflict misses in a repeated 2-way cache trace.

**C4.6 — Write policies**
1. **MCQ:** When is a dirty block written to main memory in a write-back cache?
2. **MSQ:** Select all true statements about write-through, write-back, write-allocate and no-write-allocate.
3. **NAT:** Count memory writebacks after a trace containing write hits and dirty evictions.

**C4.7 — AMAT and multi-level caches**
1. **MCQ:** Which miss rate is conditional on an L1 miss?
2. **MSQ:** Select all correct AMAT expressions for the stated access path.
3. **NAT:** Given L1/L2 hit rates and main-memory latency, calculate AMAT to two decimals.

**C4.8 — Cache CPI, miss penalty and bandwidth**
1. **MCQ:** Which miss rate applies only to data-memory references?
2. **MSQ:** Select all valid CPI-stall components for instruction and data caches.
3. **NAT:** Calculate transfer bandwidth for a 128-byte block delivered in 20 cycles on a 100 MHz memory bus.

## Chapter 5 — Main memory and secondary storage

**C5.1 — SRAM, DRAM and hierarchy**
1. **MCQ:** Which memory requires periodic refresh?
2. **MSQ:** Select all correct SRAM/DRAM characteristics.
3. **NAT:** Given chip capacity and word width, calculate how many bits of storage one chip contains.

**C5.2 — DRAM refresh**
1. **MCQ:** Which factor determines total time required to refresh all rows once?
2. **MSQ:** Select all valid calculations for refresh overhead.
3. **NAT:** Compute available read/write time percentage for 8192 rows, 40 ns per refresh and a 1 ms interval.

**C5.3 — Chips, decoding and interleaving**
1. **MCQ:** How many x8 chips are needed in parallel to build a 64-bit data word?
2. **MSQ:** Select all correct chip-width/depth expansion arrangements.
3. **NAT:** Find the number of address lines needed for 4M memory locations.

**C5.4 — Virtual memory, MMU and TLB**
1. **MCQ:** What event occurs when a valid virtual page is not in the TLB but is present in main memory?
2. **MSQ:** Select all possible sequences of TLB hit/miss, page-table hit/miss and cache result under the stated physical-cache model.
3. **NAT:** Given a page size and virtual address, find page number and offset.

**C5.5 — Secondary storage performance**
1. **MCQ:** Which component of disk access time depends on moving the head to the requested track?
2. **MSQ:** Select all contributors to block access time under a specified model.
3. **NAT:** Calculate time to transfer a 16 MB block at 80 MB/s after 5 ms setup latency.

**C5.6 — Memory-system performance and interfacing**
1. **MCQ:** Which bus carries a memory location identifier from CPU to memory?
2. **MSQ:** Select all correct signal/response orderings for a read and a write.
3. **NAT:** Calculate total response time for a cache miss followed by a main-memory access with one wait-state per cycle.

## Chapter 6 — I/O interface

**C6.1 — Programmed I/O and polling**
1. **MCQ:** Which I/O mechanism repeatedly checks a device status register?
2. **MSQ:** Select all CPU-time costs in a polling system with a stated interval.
3. **NAT:** Calculate CPU time consumed by 200 polls/s at 75 µs per poll plus 400 µs event processing.

**C6.2 — Interrupts and priority**
1. **MCQ:** In which interrupt mechanism does the CPU receive/obtain the ISR address directly as a vector?
2. **MSQ:** Select all valid event orders for interrupt acceptance, context save, ISR and return.
3. **NAT:** Given device priorities in a daisy chain, identify the first device that receives service (encode its position as a number).

**C6.3 — DMA and bus ownership**
1. **MCQ:** Which DMA mode transfers a block while holding the bus for a burst?
2. **MSQ:** Select all true statements about CPU setup, DMA bus mastership and cycle stealing.
3. **NAT:** Count the number of stolen cycles required to transfer a specified block when one word moves per cycle.

**C6.4 — DMA rates and I/O performance**
1. **MCQ:** Which unit conversion is required before reporting a bit rate from bytes/cycle?
2. **MSQ:** Select all equivalent transfer-rate expressions for a stated CPU frequency and DMA share.
3. **NAT:** Calculate bit rate for a 3.2 MHz CPU, 2.5% DMA cycles and 4 bytes/cycle.

**C6.5 — Device interface and handshaking**
1. **MCQ:** Which controller signal indicates that a device has completed a transfer?
2. **MSQ:** Select all correct roles of status, data and control registers.
3. **NAT:** Given a per-character handshake time and transfer count, calculate total device service time.

---

# PART 8. WHAT IS STILL MISSING FROM THE SUBJECT / HOW TO HANDLE THE BOUNDARY

The six chapter headings are the right broad buckets, but they do not yet expose all required subtopics. The following should be added to the chapter plan before writing starts.

## Must add inside the existing six chapters

1. **Instruction-cycle and datapath foundations:** PC, IR, register file, buses, muxes, MAR/MDR and micro-operations. These are the vocabulary that lets a beginner read a datapath or control sequence.
2. **Instruction-format and encoding depth:** register-field width, opcode width, immediate width, variable-length/prefix allocation, unused fields and instruction-type distinctions.
3. **Addressing modes beyond a short list:** pointer/indirect, array indexing, base+offset, PC-relative, stack, auto-increment/decrement, byte order and address arithmetic.
4. **ALU groundwork:** fixed-width signed arithmetic, two's complement, overflow/carry, logic operations, shifters, adders and Booth multiplication.
5. **Both control-unit designs:** the syllabus explicitly names hardwired and microprogrammed control. Include each as a real lesson, not one paragraph of comparison.
6. **Pipeline types of hazard:** structural, data and control; RAW/WAR/WAW; forwarding; load-use stall; variable-latency stage; branch penalty/prediction; cycle count and effective CPI.
7. **All three cache mappings:** direct, fully associative and set-associative; set/tag/offset; LRU; compulsory/conflict/capacity misses; write policies; multi-level AMAT; local/global miss rates.
8. **Memory interfacing:** SRAM/DRAM, chip width/depth expansion, address decoder, chip-select, buses, banks/interleaving and DRAM refresh.
9. **I/O mechanisms in full:** programmed I/O/polling, interrupt-driven I/O, vectored/non-vectored ISR, priority/daisy chain, DMA burst and cycle-steal modes, bus ownership and rate calculations.

## Add as short bridge lessons, not as a new oversized chapter

- **Virtual memory/MMU/TLB:** the COA syllabus line does not separately name virtual memory, but the supplied bank includes TLB/page-table/cache ordering. Teach only the translation concepts needed to understand those questions and clearly distinguish a TLB miss from a page fault.
- **Secondary-storage timing:** the current chapter title promises secondary storage, so include basic latency/transfer/bandwidth. Do not turn this into a full disk scheduling or file-system chapter.
- **Fixed/floating-point representation:** this is explicitly in the GATE 2027 Digital Logic section, not the COA subsection. COA should provide a short cross-reference/prerequisite where needed for ALU understanding, rather than duplicate the whole Digital Logic chapter.
- **Amdahl-style multicore speedup:** one supplied question is labelled under pipelining even though it is a parallel-execution speedup model. Include one short performance extension so that this bank question is not orphaned; do not let it replace pipeline teaching.
- **Device handshaking / memory-mapped versus isolated I/O:** helpful interface context. Treat deeper protocol details as [SHOULD] unless a paper/question in the product requires them.

## Do not over-expand without evidence

Detailed cache-coherence protocols, speculative execution internals, out-of-order scheduling, advanced branch predictors, RAID, disk scheduling algorithms, full virtual-memory replacement algorithms, and transistor-level circuit design are not in the supplied COA syllabus line. They may be useful elsewhere, but should not crowd out the listed GATE outcomes. A short “beyond this book” note is enough unless the wider GATE paper bank shows a clear need.

---

# PART 9. CHAPTER WEIGHTS — what the supplied bank suggests

These weights are **study priority recommendations from the supplied 72-question bank**, not a prediction of future GATE marks. The bank summary reports 15 CS papers from 2017–2026, 72 questions and 115 marks. Its figures work out to 115/1500 = 7.67% of those papers' marks, or 7.7 marks per paper on average. The table's “years asked” field is out of 10 years, not 15 separate papers.

| Chapter | Bank evidence in the supplied summary | Weight | Does the bank-derived weight look fair? |
|---|---|---|---|
| C1. Machine instructions and addressing modes | 14 questions, 24 marks; asked in 8/10 years | **HIGH** | Yes. Instruction formats/addressing modes appear repeatedly and are teachable scoring topics. Keep it high. |
| C2. ALU, datapath and control unit | 4 questions, 4 marks; asked in 3/10 years | **FOUNDATION / MEDIUM** | A simple frequency label would make this look low, but that would be a mistake. ALU/datapath/control are explicit syllabus lines and are prerequisites for other topics. Keep the core at medium priority; put deeper adder/divider detail later. |
| C3. Instruction pipelining and hazards | 16 questions, 28 marks; asked in 9/10 years | **HIGH** | Yes. The frequency and calculation variety justify high priority. Give it multiple lessons and many pipeline traces. |
| C4. Cache memory | 27 questions, 47 marks; asked in 10/10 years | **HIGH** | Absolutely. It is the largest bank area by marks. It deserves the most worked examples and trace practice. |
| C5. Main memory and secondary storage | 2 questions, 3 marks under the separate main/virtual-memory label | **MEDIUM** | Do not call it zero/low: memory interfacing is explicit in the syllabus and the supplied sample has limited labels. Teach the core compactly, including chip organisation and DRAM refresh. |
| C6. I/O interface: interrupts and DMA | 9 questions, 9 marks; asked in 8/10 years | **MEDIUM** | Yes. It appears frequently but the bank questions are often 1-mark concept checks or short rates. It needs complete coverage but fewer long lessons than cache/pipeline. |

### Priority inside the chapters

- **First priority:** C4 cache mapping/AMAT/write policies; C3 pipeline timing/hazards/forwarding; C1 instruction formats/addressing modes.
- **Second priority:** C6 interrupts/DMA; C2 datapath/ALU/control; C5 main-memory organisation/refresh.
- **Foundation that must not be skipped:** bits/bytes/addresses, registers/buses/muxes, binary arithmetic and CPI/time units. They may not be counted as separate GATE questions, but they make the other chapters possible.

### Final judgement on the v0 contents list

The six chapter titles align with the official syllabus at a high level. But v0 is **not yet a complete beginner-first plan**: it hides important subtopics, does not show prerequisites, and does not tell the reader what diagrams or practice traces will be supplied. Cache and pipeline deserve the largest effort; instruction formats/addressing need serious treatment; ALU/control must not be reduced just because the current bank has fewer questions; main memory must be broadened enough to cover interfacing and DRAM; and I/O must teach the difference between polling, interrupts and DMA with diagrams.

**Would I buy the completed ₹149 subject book?** I would consider it only after the first two chapters and one cache lesson prove that the book really teaches from zero. The current input file itself is not what I would pay for; it is a useful plan brief and question bank.

---

## Source and verification notes

1. **Primary user-supplied source:** `Pasted text(2).txt`, generated 24 November 2026. Its Part B says it is v0 and a contents list, not a full plan; its Part C contains all 72 question texts and marked keys.
2. **Official syllabus check:** IIT Madras, GATE 2027 CS syllabus, Section 3 “Computer Organization and Architecture”: [PDF](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf). The official GATE 2027 syllabus page warns that the syllabi were revised: [GATE 2027 Test Papers & Syllabus](https://gate2027.iitm.ac.in/exam_papers_and_syllabus).
3. **Limit of key verification:** question keys are re-solved from the visible transcription. For the nine missing figures/tables, a correct answer cannot be certified without the original visual. This report does not substitute an invented image or a guessed table.

