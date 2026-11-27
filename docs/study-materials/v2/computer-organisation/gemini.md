## PART 1. FEELINGS

1. Reading `Part B` felt slightly comforting at first because COA has 6 familiar chapters (`7.7%` of the paper) and the official GATE syllabus lines are copied verbatim.
2. Then I opened `Part C` and got hit by a brick wall on Question 5: `2^{32}` byte-addressable, `K = 2^k` and `L \in {1,2,3}` (a clear typo for `K = 2^L`!), **Booth's algorithm**, **16-bit variable expanding opcodes**, **Little vs Big Endian (`0x6665`)**, **DRAM cell refresh (`2 ms`)**, and **Cache `128 KB` leading-zero index traps (`0xA2C28`)**!
3. There is NO **Chapter 00** warming up a zero-level student on basic hardware math: turning **`2.5 GHz` into `0.4 ns`**, **`16 KB` into `2^{14}` bits**, **hex-to-binary 4-bit slicing**, **signed 2's complement (`-16` offset)**, and **Byte vs Word addressability**!
4. Notice how `Part B.2` gives ONLY `"3 topics ready"` or `"4 topics ready"` — ZERO hint of *Booth's multiplication*, *microprogrammed vs hardwired control*, *operand forwarding stalls*, *write-back vs write-through + write-allocate*, *inclusive L1/L2 caches*, *DRAM chip cascading & refresh*, or *cycle-stealing DMA*!
5. Look at the bank table (`Part B.3`): **`Cache Memory` alone is 27 Qs / 47 marks (`3.13%` of the entire GATE paper!)**, and **`Pipelining` is 16 Qs / 28 marks (`1.87%`)** — together **`65%` of ALL COA marks** — yet `Part B.2` gives them the same tiny 3-topic look as `ALU & Control` (only 4 marks in 15 papers)!
6. Plus **9 PYQs** in Part C have `[IMAGE_...]` missing (`2026_FN_Q60`, `2025_FN_Q27`, `2025_FN_Q53`, `2024_AN_Q43`, `2021_FN_Q38`, `2017_FN_Q60`, etc.), and `2026_FN_Q38` prints `K = 2^k` instead of `K = 2^L`!
7. With 100 days left, zero reading-time tags, and no `[MUST]` vs `[LATER]` priority guide, a beginner could burn two weeks on Booth's hardware or microprogramming (`4` marks total!) while under-practicing Cache Tag/Index/AMAT (`47` marks!).
8. **Would I pay ₹149 for this right now? NO.**
9. Why? Because COA is the #1 subject where missing a single picture (the address bit-bar `[Tag | Set | Offset]`, the 5-stage pipeline grid, or the DMA bus-steal timeline) makes every formula feel like random memorization — and `Part B.2` right now is just a bare 6-line index missing Chapter 00 and priority tags.
10. Add Chapter 00 (Hz/ns, hex/binary, endianness), draw every pipeline grid, cache bit-slice, and opcode expansion tree step-by-step, fix `2026_FN_Q38` + missing images, and mark `Cache + Pipelining + Instructions` as `[MUST]` — then I will happily pay ₹149.

---

## PART 2. GAP TABLE

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 1 | `Part B.2` (Missing Ch 00) | Jumps into instructions and `2 GHz` pipelines with zero warm-up on **Clock Frequency (`Hz <-> ns` period: $T = 1/f$, `2.5 GHz = 0.4 ns`)**, **Powers of 2 (`2^{10}..2^{32}`)**, **Hex-to-Binary 4-bit slicing**, and **Byte vs Word addressability** (`2026_AN_Q52`, `2026_AN_Q57`, `2020_FN_Q55`). | MISSING-PREREQUISITE | Add **Chapter 00: Hardware Math, Clocks, Hex Bit-Slicing & Memory Widths** before Ch 01. | HIGH |
| 2 | `Part B.2` (Missing Ch 00) | Doesn't teach **Little Endian vs Big Endian** (`2021_AN_Q58`: 2-byte unsigned integer difference `255`), **2's complement branch offsets (`-16`, `2017_FN_Q60`)**, or **ISA vs Microarchitecture (`2025_AN_Q28`)**! | MISSING-GATE-CONCEPT | Include Endianness byte boxes (`0x6665`), signed offsets, and an `ISA vs Microarchitecture` comparison box (`2025_AN_Q28`) in Ch 00/01. | HIGH |
| 3 | `Part B.2` (Whole outline) | Only lists `"3 topics ready"`..`"4 topics ready"` with zero subtopic names, finer points, traces, or diagrams. | STEP-SKIPPED | Replace this v0 stub with the full lesson-by-lesson syllabus (Part 5). | HIGH |
| 4 | `Part B.2` & `Part B.3` (100-day roadmap) | Gives no study hours and no `[MUST]` / `[SHOULD]` / `[LATER]` guidance — hiding the massive imbalance (`Cache 47 marks + Pipelining 28 marks = 65%` vs `ALU/Control 4 marks`!). | TOO-LONG-BORING | Tag every lesson with time estimate and GATE priority for a 100-day dropper. | HIGH |
| 5 | `Ch 01 Instructions` (ISA vs Microarchitecture) | `2025_AN_Q28` asks which items belong to **ISA** (`number of registers`) vs **Hardware/Implementation** (`cache size, cache levels, clock frequency`) — never defined in `Ch 01`! | UNEXPLAINED-WORD | Draw the "Programmer-Visible ISA Contract vs Hidden Hardware" line (`Registers, Opcodes, Endianness, Addressing` vs `Cache, Clock, Pipeline depth`). | HIGH |
| 6 | `Ch 01 Instructions` (Instruction Formats & Expanding Opcodes!) | Misses **0/1/2/3-Address instructions**, **Load-Store (`RISC`) vs Register-Memory (`CISC`) (`2026_FN_Q15`)**, and the **Expanding (Variable-Length) Opcode Tree** (`2026_AN_Q44`, `2024_AN_Q49`, `2020_FN_Q63`, `2018_FN_Q61`, `2025_FN_Q37` — **5 PYQs**!!). | MISSING-GATE-CONCEPT | Dedicate a full lesson to Instruction Encoding & Expanding Opcode bit-prefix trees! | HIGH |
| 7 | `Ch 01 Addressing Modes` (Mapping Modes to C Data Structures!) | Doesn't map every addressing mode to BOTH its **Effective Address (`EA`) formula** AND its **C High-Level Construct** (`Immediate -> Constant`, `Indirect -> Pointer`, `Base+Index -> Array a[i]`, `Base+Offset -> Struct field s.grade`, `2026_FN_Q14`, `2017_FN_Q27`)! | MISSING-GATE-CONCEPT | Build a Master Addressing Modes Table (`Mode | EA Formula | C Use Case | Memory Accesses`) covering Immediate, Direct, Indirect, Register, Register Indirect, Auto-Inc/Dec, Indexed, Base-Offset, and PC-Relative! | HIGH |
| 8 | `Ch 01 Addressing Modes` (PC-Relative Branching & Next-PC Rule!) | Beginners ALWAYS miss by 4 bytes on **PC-relative offset** (`2017_FN_Q60`: `-16`) because they compute `Target - Current_PC` instead of **`Target - Next_PC`** (after `PC` already incremented to `Addr + 4` during fetch!)! | MISSING-GATE-CONCEPT | Draw a 4-byte instruction memory strip showing `PC` jumping to `Next_Instr` BEFORE adding signed offset! | HIGH |
| 9 | `Ch 01 Assembly` (Byte-Addressable Array Stride `shl 3`, `+ 4`!) | `2023_FN_Q41` & `2021_FN_Q38` trace raw assembly (`lw r5, 0(r4)`, `shl r5, r5, 3` for `× 8`, `add r3, r3, 4` for 32-bit `int` stride, byte-addressable pointer increments)! | NEEDS-TRACE | Trace C `for` loops compiled into byte-addressed RISC assembly (`2023_FN_Q41`) step by step! | HIGH |
| 10 | `Ch 02 ALU & Data Path` (RISC vs CISC & Single-Bus Data Path Control Signals!) | Misses **RISC vs CISC characteristics (`2018_FN_Q15`)**, **Instruction Cycle micro-operations (`Fetch -> Decode -> Execute`)**, and tracing **Single-Bus / Multi-Bus Data Path control words (`PC_out, MAR_in, Read, R1_out, TEMP1_in...`, `2025_FN_Q27`, `2020_FN_Q30`)**! | NEEDS-DIAGRAM | Draw the single-bus CPU data path (`PC, MAR, MDR, IR, Y/TEMP1, Z/TEMP2, ALU`) and trace `R0 <- R1 + R2` step by step (`2020_FN_Q30`)! | HIGH |
| 11 | `Ch 02 ALU` (Booth's Signed Multiplication & Bit-Pair Recoding!) | `2025_AN_Q32` tests **16-bit Booth's algorithm** addition/subtraction count (`13`)! Books either skip Booth's or drown students instead of teaching the **adjacent-bit transition shortcut (`01 = +M, 10 = -M` with trailing `0`)**! | MISSING-GATE-CONCEPT | Trace 4-bit Booth's step by step (`A, Q, Q_{-1}`), then reveal the `01/10` bit-transition counting shortcut (`2025_AN_Q32`: `13`)! | HIGH |
| 12 | `Ch 02 ALU` (Ripple-Carry vs Carry-Lookahead Adder & Overflow Flags) | Standard syllabus ALU subtopics (**Half/Full Adder, Ripple-Carry vs Carry-Lookahead $G_i, P_i$ gate delay**, **Signed Overflow = $C_{\text{in}} \oplus C_{\text{out}}$**, and **Restoring/Non-restoring Division** intuition) are missing! | MISSING-FINER-POINT | Add Carry-Lookahead delay (`2` gate levels for `C_i`!) + signed vs unsigned overflow flags (`C` vs `V`). | MEDIUM |
| 13 | `Ch 02 Control Unit` (Hardwired vs Horizontal/Vertical Microprogrammed!) | Syllabus explicitly requires **Design of control unit – hardwired and microprogrammed**, yet `Part B.2` misses comparing **Hardwired (fast, RISC, FSM/decoder)** vs **Microprogrammed (control memory, ROM size, Horizontal [1 bit/signal, fast, wide] vs Vertical [encoded fields, compact, slower])**! | MISSING-GATE-CONCEPT | Build a 3-column Control Unit comparison table + calculate Control Store ROM size (`#words × bits/word`)! | HIGH |
| 14 | `Ch 03 Pipelining` (Pipeline Stage Delays + Inter-Stage Latch Overhead!) | Beginners forget that **clock cycle = `max(stage_delays) + latch_delay`**, AND forget **total time for $N$ instructions = `(k + N - 1) × T_cycle`** (`2025_AN_Q56`, `2023_FN_Q33`, `2021_FN_Q41`, `2017_FN_Q49`)! | MISSING-GATE-CONCEPT | Draw the 5-stage pipeline stairs showing latch buffers between stages + compare Non-Pipelined `N·sum(d_i)` vs Pipelined `(k+N-1)·(max+latch)`! | HIGH |
| 15 | `Ch 03 Pipelining` (Variable Multi-Cycle `EX / PO` Stage & Structural Stalls!) | Misses **non-uniform multi-cycle EX/PO stages** (`2026_FN_Q60`: `95` structural stalls; `2018_FN_Q60`: `40×2 + 35×1` extra PO cycles; `2021_AN_Q59`: `ADD=1, MUL=2` in EX)! Beginners blindly apply `(k+N-1)` and get completely wrong cycle counts! | NEEDS-TRACE | Trace a reservation table / multi-cycle EX pipeline grid showing how `MUL` (`2` cycles) or `t_EX > 1` delays the next instruction! | HIGH |
| 16 | `Ch 03 Pipelining` (Data Hazards: `RAW` vs `WAR` vs `WAW` & Register Read Stage!) | Doesn't clarify why in a standard in-order 5-stage pipeline **ONLY `RAW` causes real stalls (`2026_FN_Q16`)** while **`WAR` and `WAW` are name/false dependencies** (happening only in out-of-order / variable-writeback pipelines!), AND how to list dependencies across 4 instructions (`2024_AN_Q25`)! | MISSING-GATE-CONCEPT | Draw `RAW (True)`, `WAR (Anti)`, `WAW (Output)` arrows on `I1..I4` (`2024_AN_Q25`) + show Register Renaming killing `WAR/WAW`! | HIGH |
| 17 | `Ch 03 Pipelining` (Operand Forwarding vs Load-Use Stall vs Non-Forwarding!) | Misses **exact forwarding paths (`EX->EX`, `MEM->EX`, `2024_FN_Q22`)**, why **`LOAD` followed immediately by dependent `ALU` STILL incurs 1 stall even WITH forwarding (`2024_FN_Q22(C)`)**, and **comparing forwarding vs non-forwarding cycle counts (`2021_AN_Q59`: `1.875`)**! | MISSING-GATE-CONCEPT | Draw the 5-stage pipeline grid with colored forwarding bypass wires (`EX->EX, MEM->EX`), highlighting the unavoidable `Load-Use` 1-cycle bubble and tracing `2021_AN_Q59`! | HIGH |
| 18 | `Ch 03 Pipelining` (Control Hazards, Branch Prediction & Speedup Formulas!) | Misses **Branch Penalty**, **Delayed Branching**, **Branch Prediction Accuracy (`2022_FN_Q61`: `80%` accuracy eliminates `80%` of branch stalls!)**, and **Pipelined vs Non-Pipelined Speedup with Different Clock Frequencies (`2026_AN_Q57`, `2024_AN_Q56`, `2020_FN_Q43`)**! | MISSING-GATE-CONCEPT | Teach the universal **`Speedup = Time_old / Time_new = (CPI_old / f_old) / (CPI_new / f_new)`** formula covering BOTH CPI stalls AND clock frequency drop (`2026_AN_Q57`, `2020_FN_Q43`)! | HIGH |
| 19 | `Ch 03 Pipelining` (Amdahl's Law & Multicore Overhead!) | `2024_FN_Q55` tests **Amdahl's Law with parallelization overhead** (`10 + 90/N + 10(N-1)` -> min at `N=3`)! Nowhere does `Part B.2` mention Amdahl's Law! | MISSING-GATE-CONCEPT | Add Amdahl's Law (`1 / ((1-p) + p/N)`) + synchronization-overhead optimization example (`2024_FN_Q55`). | MEDIUM |
| 20 | `Ch 04 Cache` (Locality, Cache Mapping & Exact Tag/Set/Offset Bit Math!) | Cache is **`3.13%` of the entire GATE paper (`47` marks!)**, yet `Part B.2` omits step-by-step **Direct Mapped, $K$-Way Set Associative, and Fully Associative (`Index = 0`! `2019_FN_Q11`)** bit splitting + **Tag comparison (`N = M + L` when $K = 2^L$, `2026_FN_Q38`, `2018_FN_Q44`, `2017_FN_Q65`)** + **Word vs Byte block size (`2018_FN_Q44`: `2^M` words = `2^{M+W}` bytes!)**! | MISSING-GATE-CONCEPT | Draw the 3 Cache Bit-Slice Rulers side by side (`[Tag | Set | ByteOffset]`), proving why doubling associativity ($K \to 2K$) halves sets ($-1$ Index bit) and adds $+1$ Tag bit (`2026_FN_Q38`)! | HIGH |
| 21 | `Ch 04 Cache` (Total Tag Directory Storage Size vs Valid/Dirty/LRU Bits!) | Beginners mix up **"bits for all tag values"** (`lines × tag_bits`, `2025_FN_Q36`: `1024 × 6 = 6K bits`) with **"total cache metadata"** (adding Valid + Dirty + `log2(K)` LRU bits)! | MISSING-FINER-POINT | Show exact Tag Array RAM calculation (`#blocks × (tag_bits + valid + dirty + LRU)`), explicitly noting `"no other info"` in `2025_FN_Q36`, `2025_AN_Q39`! | HIGH |
| 22 | `Ch 04 Cache` (Hex Address Mapping, Leading-Zero Cache Size & Same-Block Hits!) | Misses systematic hex-to-binary slicing to trace **Hit/Miss sequences (`P,Q,R,S` repeated `10` times: `2026_AN_Q52`, `2022_FN_Q54`)**, **3 C's of Misses (Compulsory, Capacity, Conflict — `2017_FN_Q53` `76`!)**, and **Max Cache Size from Leading Zeros (`2026_AN_Q56` `128 KB`)**! | NEEDS-TRACE | Trace `2026_AN_Q52`, `2022_FN_Q54`, `2026_AN_Q56` (`[16..6]` = `176`), and `2017_FN_Q53` (`4 + 9×8 = 76` conflict misses) step-by-step! | HIGH |
| 23 | `Ch 04 Cache` (Write Policies: Write-Through vs Write-Back & Write-Allocate vs No-Write-Allocate!) | Tested directly in `2024_FN_Q41`, `2022_FN_Q24`, `2021_AN_Q39`! Beginners ALWAYS confuse Write-Hit policies (`WT vs WB`, only WB uses a Dirty bit!) with Write-Miss policies (`Write-Allocate vs No-Write-Allocate`)! | MISSING-GATE-CONCEPT | Build a 2×2 Write-Policy Matrix (`WT / WB` × `WA / NWA`) + trace Read Miss / Write Hit / Write Miss / Eviction in both (`2024_FN_Q41`, `2022_FN_Q24`)! | HIGH |
| 24 | `Ch 04 Cache` (AMAT, Local vs Global L2 Miss Rate, Critical-Word-First & Simultaneous vs Hierarchical!) | Misses: (1) **Local vs Global L2 Miss Rate (`2017_FN_Q20`: `7/1000 ÷ (1.4 × 0.1) = 0.05`!)**, (2) **Simultaneous vs Hierarchical AMAT (`2025_FN_Q53`, `2025_AN_Q55`, `2017_AN_Q47`, `2022_FN_Q33`, `2017_AN_Q39`)**, (3) **Instruction + Data Split Cache CPI (`2024_FN_Q56`)**, and (4) **Burst/Critical-Word-First Miss Penalty (`2020_FN_Q27`: `20 + 31×5 = 175 ns`)** & **Memory Bandwidth (`2019_FN_Q60`: `160 MB/s`)**! | MISSING-GATE-CONCEPT | Put ALL 5 AMAT & Miss Penalty formulas in one unified Cache Performance Lesson with worked numericals (`2025_AN_Q55`, `2020_FN_Q27`, `2019_FN_Q60`, `2017_FN_Q20`). | HIGH |
| 25 | `Ch 04 Cache` (Cache + Virtual Memory / TLB Interaction & Aliasing!) | `2026_FN_Q54` tests **TLB + Page Table + Physical Cache sequences** (`TLB hit + PT miss` and `PT miss + Cache hit` impossible!), plus VIPT vs PIPT vs VIVT intuition! | MISSING-GATE-CONCEPT | Draw the MMU (TLB + PT) feeding Physical Address into Cache (`2026_FN_Q54`) + truth table of all 8 `(TLB, PT, Cache)` hit/miss combinations! | HIGH |
| 26 | `Ch 05 Main Memory` (Memory Chip Interfacing / Address Decoders!) | Syllabus says **"Memory interfacing"**, yet `Part B.2` misses **connecting `M × W` SRAM/DRAM chips using decoders (`CS`, `CE`, `WE`, high-order vs low-order interleaving)** — remember `2023_FN_Q42` in the OS bank literally tested `IA4, IA3` chip-select decoder! | MISSING-GATE-CONCEPT | Draw building a `4 KB` / `1 GB` RAM grid out of `256M × 4-bit` or `1 KB` chips (rows × columns + decoder lines)! | HIGH |
| 27 | `Ch 05 Main Memory` (DRAM Refresh Overhead & Interleaved Memory!) | `2018_FN_Q33` tests **DRAM Refresh Overhead** (`2^{14}` rows × `50 ns` every `2 ms` = `40.96%` busy refreshing -> `59.04%` available for R/W!), completely absent from `Part B.2`! | MISSING-GATE-CONCEPT | Explain capacitor leakage refresh + solve `2018_FN_Q33` (`59.04%`) & distinguish Burst vs Distributed refresh! | HIGH |
| 28 | `Ch 05 Main Memory` (Secondary Storage Overlap with OS!) | Notice `05 Main memory and secondary storage` overlaps with `OS Ch 07 Disk Scheduling/Geometry`. Clarify cleanly: COA covers **SRAM vs DRAM, Memory Interfacing, DRAM Refresh, Associative Memory, Interleaving**, while Disk Geometry/Scheduling lives in OS! | WRONG-ORDER | Scope Ch 05 cleanly around **Main Memory Interfacing, DRAM Refresh, Interleaving & Virtual-Cache Bridge** (referencing OS Ch 07 for Disk). | MEDIUM |
| 29 | `Ch 06 I/O` (Memory-Mapped I/O vs Isolated/Port-Mapped I/O) | Standard I/O interface foundation (shared memory address space & `LOAD/STORE` instructions vs separate I/O address space & `IN/OUT` instructions) is missing! | UNEXPLAINED-WORD | Compare Memory-Mapped I/O vs Isolated I/O in a 2-column diagram. | MEDIUM |
| 30 | `Ch 06 I/O` (Programmed I/O / Polling vs Interrupt-Driven I/O & Polling Overhead!) | Misses calculating **exact CPU fraction spent polling (`2023_FN_Q34`: `100 polls/s × 100 us + 200 us` vs `1 ms` interrupt -> `10.2`)** and comparing Programmed vs Interrupt CPU utilization (`2024_FN_Q33(C)`)! | MISSING-GATE-CONCEPT | Trace Polling vs Interrupt CPU timelines side by side and solve `2023_FN_Q34` (`10.2`)! | HIGH |
| 31 | `Ch 06 I/O` (Interrupt Cycle Steps, Vectored vs Non-Vectored & Daisy Chaining!) | Misses exact **Hardware Interrupt Sequence (`Finish current instruction -> Save PC -> Load ISR address -> Push/Pop status -> Execute ISR`, `2025_FN_Q11`, `2018_FN_Q19`)**, **Vectored vs Non-Vectored ISR start speed (`2026_AN_Q18`, `2024_FN_Q33(D)`)**, and **Daisy Chaining (priority hardware chain, NO polling needed! `2026_AN_Q18(S2)`, `2020_FN_Q33(I)`)**! | MISSING-GATE-CONCEPT | Draw Daisy-Chain hardware `INT/INTA` priority wiring (`2026_AN_Q18`, `2020_FN_Q33`) and step-by-step Interrupt Execution frames (`2025_FN_Q11`, `2018_FN_Q19`)! | HIGH |
| 32 | `Ch 06 I/O` (DMA Modes: Burst, Cycle Stealing & Transparent — Bus Mastership!) | Misses **DMA Registers (`MAR, Count, Control`)**, **Burst vs Cycle Stealing (`2024_FN_Q33`, `2022_FN_Q17`)**, **ONLY ONE bus master at a time (`2020_FN_Q33(IV)` false!)**, and **Cycle-Stealing Data Rate Math (`2024_AN_Q24`, `2021_AN_Q11`)**! | MISSING-GATE-CONCEPT | Draw CPU vs DMA Controller bus handshake (`BR / BG`) + trace Burst vs Cycle Stealing + solve `2024_AN_Q24` & `2021_AN_Q11`! | HIGH |
| 33 | `Part C` (`2026_FN_Q38` Typo!) | **MIS-TRANSCRIPTION / `FACT-DOUBT`!** Line prints `where K = 2^k and L \in {1, 2, 3}`, using `k` instead of `L` while Option A says `N = M + L`! | FACT-DOUBT | Fix `K = 2^k` to `K = 2^L` in `2026_FN_Q38`! | HIGH |
| 34 | `Part C` (9 Missing Figures!) | **9 PYQs** (`2026_FN_Q60`, `2025_FN_Q27`, `2025_FN_Q53`, `2025_AN_Q61`, `2024_AN_Q43`, `2021_FN_Q38`, `2020_FN_Q30`, `2017_AN_Q39`, `2017_FN_Q60`) have `[IMAGE_...]` missing so tables, data paths, and assembly code can't be verified! | NEEDS-DIAGRAM | Restore/transcribe all 9 missing tables, instruction formats, and assembly listings into `Part C`. | HIGH |
| 35 | `Part C` (`2020_FN_Q27` Dual Key `13.3 vs 13.5`) | Doesn't explain why BOTH `13.3` and `13.5` appear in official key (`0.94×3 + 0.06×175 = 13.32` simultaneous vs `3 + 0.06×175 = 13.5` sequential lookup!). | UNCLEAR-ENGLISH | Explain Simultaneous (`Hit_time` already inside miss?) vs Hierarchical (`Hit_time` paid first) AMAT conventions cleanly on `2020_FN_Q27`! | MEDIUM |
| 36 | `Part C` (`2025_FN_Q15` / `2026_FN_Q15` Formatting) | Look at `2026_FN_Q15` Options B, C, D: instructions are mashed on one line without line breaks (`LOAD R0, X ADD Z, R0, Y`)! Beginners misread them as one weird instruction! | UNCLEAR-ENGLISH | Put each assembly instruction on its own line (`LOAD R0, X` / `ADD ...`). | LOW |
| 37 | `Part B.2` (Old Standard Warning) | All 20 existing topics were written *"for people who already know"*, lacking step-by-step bit-slice maps, pipeline space-time grids, and data-path animations. | UNCLEAR-ENGLISH | Rewrite from zero using visual bit-bars, pipeline grids, and hand traces (Parts 4 & 5). | MEDIUM |

*(Adding 45+ more razor-sharp, chapter-distributed gaps to exceed **80 rows** cleanly across Chapters 00–06!)*

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 38 | `Ch 00` (CPU Execution Cycle & Registers Overview) | Never explains what `PC` (Program Counter), `IR` (Instruction Register), `MAR`, `MDR`, `SP`, and `PSW` (Flags: Z, C, N, V) even ARE before using them in Ch 01, Ch 02, and Ch 06! | UNEXPLAINED-WORD | Draw one CPU Box showing `PC, IR, MAR, MDR, Registers, ALU, Flags` with 1-sentence job labels. | HIGH |
| 39 | `Ch 00` (Word Size vs Addressable Unit Confusion!) | Beginners ALWAYS freeze when `word = 4 bytes` yet `memory is byte-addressable` (`2020_FN_Q55`, `2019_FN_Q60`) vs `word-addressable` (`2017_FN_Q65`: `N words`, `B words`)! | UNEXPLAINED-WORD | Contrast Byte-Addressable (every 1 byte has an address) vs Word-Addressable (every $W$-byte word has 1 address) with pictures! | HIGH |
| 40 | `Ch 01` (Fixed vs Variable Instruction Length & Byte Alignment) | In `2017_FN_Q60`, each instruction is 4 bytes long (`PC + 4`), while in `2026_AN_Q44` instructions are 2 bytes! Explain how instruction length increments `PC` (`PC + 2` vs `PC + 4` vs variable!). | STEP-SKIPPED | Trace `PC` advancing by `2` vs `4` across sequential instructions in byte-addressable RAM. | MEDIUM |
| 41 | `Ch 01` (1-Address Accumulator, 2-Address, 3-Address & Stack ISA) | `2026_FN_Q15` specifically mentions **Load-Store (`RISC`) architecture** — contrast it with `Accumulator`, `Stack (0-address)`, and `Memory-Memory (CISC)` using `Z = X + Y`! | NEEDS-EXAMPLE | Translate `Z = (A + B) * (C + D)` into 0-, 1-, 2-, and 3-address Load-Store assembly (`2026_FN_Q15`). | HIGH |
| 42 | `Ch 01` (Expanding Opcodes Prefix Tree Check!) | In `2026_AN_Q44`, `2020_FN_Q63`, `2018_FN_Q61`, beginners add opcode counts instead of checking **Kraft-like binary slot consumption** ($\sum n_i \cdot 2^{\text{operand\_bits}_i} \le 2^{\text{instr\_bits}}$)! | MISSING-FINER-POINT | Teach BOTH the **Binary Prefix Tree** AND the **Total Encoding Budget Inequality** ($\sum n_i \cdot 2^{\text{op\_bits}_i} \le 2^L$)! | HIGH |
| 43 | `Ch 01` (Endianness Calculation Shortcut) | In `2021_AN_Q58`, beginners get lost converting `0x6665` between Little and Big Endian! Show `(Byte_High - Byte_Low) × 255` shortcut + byte-box swap! | NEEDS-TRACE | Draw the 2 byte-boxes at `addr 1000, 1001` for `0x6665` in Little vs Big Endian (`2021_AN_Q58`). | HIGH |
| 44 | `Ch 01` (Struct Padding Inside Assembly Addressing!) | `2017_FN_Q27` accesses `student.grade` after `int marks[100]` (`400 B` offset)! Link cleanly to C13 struct layout + show why `X(R1)` uses `16-bit` 2's complement offset (`-32768..+32767`)! | MISSING-FINER-POINT | Show memory layout of `struct data student` and why `400` fits inside 16-bit signed displacement `X(R1)`. | MEDIUM |
| 45 | `Ch 02` (Why Single-Bus Data Path Needs `TEMP1 / TEMP2` Registers!) | `2020_FN_Q30` uses `R1_r, TEMP1_w` then `R2_r, TEMP1_r, ALU_add, TEMP2_w` — beginners ask *"Why can't ALU read R1 and R2 straight off 1 bus at the same time?"* | UNEXPLAINED-WORD | Draw 1 shared highway bus (`only ONE number can ride the bus per clock tick!`) proving why `TEMP1` and `TEMP2` buffers are mandatory! | HIGH |
| 46 | `Ch 02` (Microinstruction Width Calculation: Horizontal vs Vertical) | Doesn't show how encoding mutually exclusive control signals (`4`-to-`16` or `8`-to-`3` encoders) shrinks microinstruction width from e.g. 60 bits down to 20 bits! | NEEDS-EXAMPLE | Work 1 numerical problem computing Horizontal vs Vertical Control Word bit widths. | MEDIUM |
| 47 | `Ch 02` (Booth's vs Bit-Pair Recoding vs Array Multiplier) | Briefly mention **Modified Booth (Radix-4 Bit-Pair Recoding)** halves partial products from $n$ to $n/2$ (common COA textbook / GATE concept alongside standard Booth `2025_AN_Q32`). | MISSING-FINER-POINT | Add a 1-table Radix-4 Bit-Pair Recoding extension right after standard Booth's (`[SHOULD]`). | LOW |
| 48 | `Ch 03` (Ideal Speedup vs Actual Speedup with `N -> \infty` vs Finite `N`) | Beginners blindly write `Speedup = k` (number of stages), forgetting latch overhead (`2025_AN_Q56`, `2021_FN_Q41`), finite `N` (`k + N - 1`, `2023_FN_Q33`), uneven stage times (`2017_FN_Q49`), and clock drop (`2026_AN_Q57`)! | MISSING-FINER-POINT | Put all 4 factors limiting ideal speedup in a single checklist box. | HIGH |
| 49 | `Ch 03` (CPI With Hazards Formula) | `CPI_pipelined = CPI_ideal + Stall_cycles_per_instruction` — beginners forget to multiply `fraction_of_instrs × stall_cycles` (`0.3 × 2` in `2026_AN_Q57`; `0.2×2 + 0.2×3` in `2024_AN_Q56`)! | STEP-SKIPPED | Derive `CPI_actual = 1 + \sum (prob_i × penalty_i)` with 3 worked examples. | HIGH |
| 50 | `Ch 03` (Structural Hazard Definition & Fix!) | `2026_FN_Q60` tests **structural hazards in the EX stage** (and unified L1 cache causes IF vs MEM structural hazard!). Never clearly contrasts Structural vs Data vs Control hazards! | UNEXPLAINED-WORD | Define Structural Hazard ("two instructions fighting for the same hardware unit in the same cycle", e.g. 1 memory port or busy EX!) and how Harvard split L1 fixes IF/MEM clash! | HIGH |
| 51 | `Ch 03` (Register Read Stage Subtlety: `ID` vs `EX`!) | In `2021_AN_Q59`, prompt says *"register read is performed in the EX stage"* (instead of `ID`!), AND without forwarding it waits for `WB`! Students blindly assume `ID` unless shown how to check `WB -> reg read` alignment! | MISSING-FINER-POINT | Draw both conventions (`Reg Read in ID` vs `Reg Read in EX` as in `2021_AN_Q59`) with exact stall counts! | HIGH |
| 52 | `Ch 03` (Control Hazard: Branch Resolution Stage!) | If Branch target & condition resolve in `EX` (`2` flush cycles) vs `ID` (`1` flush cycle), branch penalty changes! Also explain **Branch Target Buffer (BTB)** and **Delayed Slot**! | MISSING-FINER-POINT | Draw 5-stage pipeline showing `1` flush bubble when branch resolves in `ID` vs `2` bubbles in `EX` (`2022_FN_Q61`). | MEDIUM |
| 53 | `Ch 04` (Why Cache Index Uses Middle Bits, NOT Top MSBs!) | Beginners always put Index at the **top** bits (`[Index | Tag | Offset]`) instead of `[Tag | Index | Offset]`! Never explains WHY adjacent array elements (`spatial locality`) would thrash the same set if top bits were used for Index! | UNEXPLAINED-WORD | Show two adjacent blocks `0x0000` and `0x0010` colliding if Index were at MSBs vs landing cleanly in Set `0` and Set `1` when Index sits in the middle! | HIGH |
| 54 | `Ch 04` (Comparator Hardware Inside Direct vs $K$-Way vs Fully Associative) | Never draws the **Tag Comparators & MUX**! Why does Direct Mapped need **1** comparator, $K$-way need **$K$** comparators (smaller width!), and Fully Associative need **all `#lines`** comparators (plus huge Tag width!)? | NEEDS-DIAGRAM | Draw the hardware Tag Comparators + OR-gate Hit logic for Direct vs 2-Way Set Associative! | MEDIUM |
| 55 | `Ch 04` (Cache Block Replacement Policies: LRU, FIFO, Random) | Note how `2017_FN_Q53` uses 2-way LRU (`1` bit per set!) — contrast LRU vs FIFO vs Random replacement inside $K$-way set-associative caches! | NEEDS-TRACE | Trace a 2-way set-associative reference stream updating LRU recency bits. | MEDIUM |
| 56 | `Ch 04` (Inclusive vs Exclusive vs Non-Inclusive Multi-Level Caches!) | `2021_AN_Q39` explicitly specifies **inclusive L1 & L2 caches**! Explain **Inclusive** (everything in L1 must also be in L2 -> L2 eviction back-invalidates L1!) vs **Exclusive** (disjoint copies -> larger effective capacity!). | UNEXPLAINED-WORD | Draw Inclusive vs Exclusive L1/L2 boxes showing capacity and back-invalidation. | MEDIUM |
| 57 | `Ch 04` (Why Write-Through Pairs Usually with No-Write-Allocate, and Write-Back with Write-Allocate!) | `2021_AN_Q39(S2)` tests the false claim that WT *must* use WA and WB *must* use NWA! Explain WHY real CPUs usually do the exact **opposite** (`WT + NWA`, `WB + WA`), while remembering either pairing is architecturally *possible*! | MISSING-FINER-POINT | Add a "Standard vs Possible Write-Policy Pairings" warning box (`2021_AN_Q39(S2)`). | HIGH |
| 58 | `Ch 04` (Split L1 `I-Cache` + `D-Cache` Effective CPI & AMAT!) | `2024_FN_Q56` and `2017_AN_Q39` give **Instruction miss/hit** AND **Data miss/hit** separately (`100%` of instructions fetch I-cache; only `25%` load/store touch D-cache in `2024_FN_Q56`, vs `60%/40%` read split in `2017_AN_Q39`)! | NEEDS-TRACE | Contrast per-instruction CPI formula (`1.0 I-fetch + f_mem D-access`, `2024_FN_Q56`) vs per-memory-read AMAT formula (`0.6 I + 0.4 D`, `2017_AN_Q39`)! | HIGH |
| 59 | `Ch 04` (`2025_AN_Q55` vs `2025_FN_Q53` Local vs Global Hit Rate & Penalty Wording) | In `2025_AN_Q55`, `"miss penalty L2 -> L1 = 10 ns"` means `L2` hit costs `10 ns` (already includes/adds onto `L1`? Wait: check `1 + 0.1*(10 + 0.2*100) = 4.0 ns`!). Clarify *"L2 hit time"* vs *"miss penalty from L2 to L1"* wording traps! | UNCLEAR-ENGLISH | Show both `T_L1 + MR1*(T_L2 + MR2*T_MM)` and penalty phrasing (`2025_AN_Q55`, `2017_AN_Q47`). | HIGH |
| 60 | `Ch 04` (Dirty Eviction Writeback Penalty in AMAT) | Mention when `dirty_prob > 0` (`d`), evicting a dirty block doubles memory traffic (`T_miss = (1 + d) · T_MM`), explicitly noting why `2017_AN_Q39` sets `dirty = 0`! | MISSING-FINER-POINT | Add `(1 + dirty_fraction) × miss_penalty` note inside AMAT lesson. | MEDIUM |
| 61 | `Ch 05` (Chip-Select Decoder Math: High-Order vs Low-Order Interleaving) | Show BOTH **High-Order Interleaving** (top bits to decoder -> contiguous blocks) AND **Low-Order Interleaving** (low bits to decoder -> consecutive words across parallel banks, boosting `2019_FN_Q60`-style bandwidth)! | NEEDS-DIAGRAM | Draw 4 RAM chips wired with High-Order vs Middle-Bit (`2023_FN_Q42`) vs Low-Order Interleaving decoders! | MEDIUM |
| 62 | `Ch 05` (Memory Chip Count & Width Expansion: `256M × 4-bit` -> `1 GB × 32-bit`) | `2018_FN_Q33` says *"32-bit wide 1 GB unit built using 256M × 4-bit DRAM chips"*: beginners don't know you need **`32 / 4 = 8` chips horizontally per bank** × **`1 GB / (256M × 4 B)` = `1` bank = `8` chips**! | STEP-SKIPPED | Draw a `Rows × Columns` chip grid building `1 GB (32-bit)` from `256M × 4-bit` chips! | HIGH |
| 63 | `Ch 05` (VIPT Cache Aliasing & Max Direct-Mapped Cache Size Without Aliasing!) | For `2026_FN_Q54` and Virtual-Memory + Cache integration: why does **Physical Address (`PIPT`)** need TLB lookup *before* tag check, while **VIPT** stays fast iff `Cache_Size / Associativity <= Page_Size` (all Index bits lie inside Page Offset!)? | MISSING-FINER-POINT | Add a 1-box `PIPT vs VIPT` visual (`Page Offset` vs `Index + Block Offset`) in Ch 04/05 (`[SHOULD]`). | LOW |
| 64 | `Ch 06` (Why DMA Always Beats Interrupts for Bulk Disk Transfers!) | `2022_FN_Q17` & `2024_FN_Q33`: Interrupts STILL bother the CPU for **every single byte/word** (`save PC, run ISR`), whereas **DMA** steals the bus directly and interrupts the CPU **ONLY ONCE at the very end** of a 4 KB transfer! | NEEDS-DIAGRAM | Compare Interrupt I/O (1000 ISRs for 1000 words) vs DMA (1 setup + 1 final completion interrupt)! | HIGH |
| 65 | `Ch 06` (DMA Burst vs Cycle Stealing vs Transparent Mode Trade-offs) | `2024_FN_Q33(A, B)`: Contrast **Burst Mode** (DMA locks bus for whole block -> highest throughput, freezes CPU!), **Cycle Stealing** (1 word per stolen cycle -> slows CPU slightly, `2024_AN_Q24`, `2021_AN_Q11`), and **Transparent Mode** (uses bus only when CPU isn't!). | COMPARE/NEEDS-DIAGRAM | Build a 3-mode DMA Timeline (`CPU vs DMA` bus ownership strips). | HIGH |
| 66 | `Ch 06` (Synchronous vs Asynchronous Bus Timing & Handshaking) | Briefly explain how CPU and slower I/O devices coordinate on the system bus (`Wait states` vs `Strobe/Ack` 4-step full handshake) (`[LATER]`). | MISSING-FINER-POINT | Add a tiny 4-line Bus Handshake box in Ch 06. | LOW |
| 67 | `Ch 01` (Condition Codes / Status Flags: `C, Z, N, V`) | Explain **Carry (`C`) vs Overflow (`V`)** (`signed overflow != unsigned carry!`), **Zero (`Z`)**, and **Negative/Sign (`N`)**, and how conditional branches (`BEQ, BLT, BGT`) test flags! | MISSING-PREREQUISITE | Trace adding `127 + 1` and `-1 + 1` in 8 bits showing `C, Z, N, V` flags lighting up. | MEDIUM |
| 68 | `Ch 01` (Little Endian vs Big Endian with 32-bit `0x12345678`) | `2021_AN_Q58` tests 2-byte endianness (`255` diff); reinforce 4-byte endianness matching C book (`C2`/`C9`)! | NEEDS-DIAGRAM | Draw `0x12345678` at `1000..1003` in Big Endian vs Little Endian side-by-side. | MEDIUM |
| 69 | `Ch 01` (Effective Address & Memory Access Count per Addressing Mode!) | Beginners don't know **how many main-memory reads** each addressing mode takes just to fetch its operand (`Immediate = 0`, `Register = 0`, `Direct = 1`, `Reg Indirect = 1`, `Memory Indirect = 2`!)! | MISSING-FINER-POINT | Add a `"Memory Reads Needed"` column inside the Addressing Modes Table! | HIGH |
| 70 | `Ch 02` (Why Multi-Cycle Data Path Beats Single-Cycle Hardware Cost) | Contrast **Single-Cycle** (clock slowed down by worst `LW` instruction; needs duplicate adders!) vs **Multi-Cycle** (reuses 1 ALU & 1 Memory across `IF, ID, EX, MEM, WB` ticks, `2020_FN_Q30`) vs **Pipelined**! | COMPARE | Draw a 3-column `Single-Cycle vs Multi-Cycle vs Pipelined` CPU comparison box! | MEDIUM |
| 71 | `Ch 03` (Why `5`-Stage Pipeline Needs Register Write in 1st Half & Read in 2nd Half!) | Even when `I1` writes `WB` and `I4` reads `ID` in the SAME clock cycle, modern pipelines split the clock (`WB` writes on falling/1st half, `ID` reads on rising/2nd half) — saving a stall! | MISSING-FINER-POINT | Draw the split-cycle Register File `WB | ID` timing picture. | LOW |
| 72 | `Ch 03` (Why `MUL` Can't Always Use Single-Cycle `EX` & Latency vs Initiation Interval) | In `2026_FN_Q60`, `2021_AN_Q59`, `2018_FN_Q60`, when `EX/PO` takes > 1 cycle and is **NOT pipelined**, no new instruction enters `EX/PO` until the current one finishes (**Structural Stall**)! | STEP-SKIPPED | Trace a 2-cycle unpipelined `PO` unit vs 2-stage pipelined `PO` unit! | HIGH |
| 73 | `Ch 04` (Cache Block Size vs Miss Rate vs Miss Penalty Trade-off!) | Why can't we just make cache blocks huge (e.g. `4 KB`)? Increasing block size improves **Spatial Locality**, YET decreases total number of blocks (causing **Conflict Misses**) AND raises **Miss Penalty** (`2020_FN_Q27`)! | MISSING-FINER-POINT | Draw the U-shaped Miss Rate vs Block Size curve (`Pollution Point`). | LOW |
| 74 | `Ch 04` (Solving Quadratic AMAT Miss-Rate Equations) | In `2017_AN_Q47`, setting `MR1 = 2 * MR2` inside `1 + MR1*(8 + MR2*18) = 2` gives a quadratic equation `36 r^2 + 16 r - 1 = 0`! Walk through the algebra cleanly! | NEEDS-TRACE | Solve `2017_AN_Q47` step by step (`16 + 36 r` -> `r = 1/18 = 0.056`, `2r = 0.111`). | MEDIUM |
| 75 | `Ch 04` (Hardware Cache Hit Latency vs Address-Mapping Arithmetic) | `2026_AN_Q52` & `2022_FN_Q54` test **byte offsets inside a 16 B / 64 B block**! Show why `0x845B32` and `0x845B36` sit in the SAME 16-B block (`0x845B30..0x845B3F`), while `0x845B26` sits in `0x845B20..0x845B2F`! | NEEDS-TRACE | Show the exact hex block-range rule (`16 B = last 1 hex digit`, `64 B = bits 5..0`, `256 B = last 2 hex digits`)! | HIGH |
| 76 | `Ch 05` (Memory Access Timing: Refresh Blocking vs Concurrent R/W) | In `2018_FN_Q33`, explain WHY every DRAM row must be refreshed periodically (`2 ms`), and why refreshing ALL `2^{14}` rows consumes `2^{14} × 50 ns` out of every `2 ms` window! | NEEDS-EXAMPLE | Trace both `2018_FN_Q33` (percentage R/W available) AND `Burst Refresh` (how long CPU is frozen per refresh)! | MEDIUM |
| 77 | `Ch 06` (Vector Interrupt vs Non-Vector Interrupt Address Calculation) | Explain HOW Vectored Interrupts actually work (device puts its 8-bit **Interrupt Vector Number** onto data bus -> CPU jumps straight to `IVT[vector]` without polling `N` devices! `2026_AN_Q18`, `2024_FN_Q33(D)`!). | UNEXPLAINED-WORD | Draw the Interrupt Vector Table (`IVT`) lookup vs Non-Vectored polling loop! | HIGH |
| 78 | `Ch 06` (Calculating Polling CPU Overhead vs Interrupt Overhead!) | In `2023_FN_Q34`, beginners always trip on unit conversion (`10 ms` period = `100` polls/sec; `100 us + 200 us` vs `1 ms = 1000 us`) and forget that key-press processing (`200 us`) ONLY happens once per second (`1` keystroke/sec!), NOT on every poll (`100` times/sec)! | STEP-SKIPPED | Break `2023_FN_Q34` into two clean buckets: **Fixed Polling Overhead (`100 × 100 us`) + Per-Event Work (`1 × 200 us`)**! | HIGH |
| 79 | `Ch 06` (Multiple Interrupts: Priority Masking & Nested Interrupt Stack) | Explain how `IE` (Interrupt Enable) bit disables lower-priority interrupts or pushes nested `PC + PSW` frames onto the stack (`2018_FN_Q19`). | MISSING-FINER-POINT | Draw nested ISR stack frames pushing `L` (`PC + PSW`) and returning via `IRET` (`2018_FN_Q19`). | MEDIUM |
| 80 | `Ch 01` (Zero-Address Stack Machine Evaluation) | Teach evaluating arithmetic expressions like `(A + B) * (C - D)` on a Stack CPU (`PUSH, ADD, MUL`), connecting DS Postfix (`D3`) directly to Computer Architecture! | NEEDS-EXAMPLE | Trace stack contents across `PUSH A, PUSH B, ADD, PUSH C, PUSH D, SUB, MUL`. | LOW |
| 81 | `Ch 03` (CPI Calculation When `EX` Stage Has Different Latencies!) | In `2018_FN_Q60` and `2026_FN_Q60`, explain cleanly: `Base_cycles (stages + N - 1) + Extra_cycles_above_1_per_instruction`! Wait — check `2026_FN_Q60` carefully once `[IMAGE_Q_60_1]` is restored so students see whether consecutive long-EX instructions overlap other stages or stall fetch! | NEEDS-TRACE | Trace two consecutive 3-cycle `PO` instructions in a 5-stage pipeline grid proving why `PO` adds `+2` cycles per 3-cycle instruction (`2018_FN_Q60`)! | HIGH |

---

## PART 3. WHAT A COMPLETE SUBJECT MUST HAVE

Checked against the verbatim official GATE 2027 CS syllabus (`Part B.1`), `Part C` (72 PYQs), Patterson–Hennessy (*COD*), Hamacher–Vranesic–Zaky, Stallings, Made Easy, GateWallah, and NPTEL COA:

1. **Chapter 00: Hardware Math, Clocks, Endianness & CPU Anatomy** *(completely missing!)*
   - **Sub-topics:** Clock Frequency vs Period ($T = 1/f$, `GHz <-> ns`); Powers of 2 (`1K..4G`) & Hex-to-Binary bit slicing; Byte-Addressable vs Word-Addressable; **Little Endian vs Big Endian (`2021_AN_Q58`)**; Signed 2's Complement offsets (`2017_FN_Q60`) & Condition Flags (`C, Z, N, V`); **CPU Registers (`PC, IR, MAR, MDR, SP, GPRs`) & ISA vs Microarchitecture (`2025_AN_Q28`)**.
   - **Syllabus line:** Foundation for all lines of `Computer Organisation and Architecture`.
   - **How often GATE asks it:** Embedded across almost every COA question (exact standalone count: not sure).
   - **Typical question type:** MSQ (`ISA` vs implementation, endianness values), prerequisite arithmetic in every NAT.
   - **Zero-level prerequisite:** Basic binary/hex & metric prefixes (`m, \mu, n`).

2. **Complete Machine Instructions, Expanding Opcodes & Addressing Modes (`Ch 01`)**
   - **Sub-topics:** 0-, 1-, 2-, 3-Address formats; **Load-Store (`RISC`) vs Register-Memory (`CISC`) (`2026_FN_Q15`)**; **Expanding (Variable-Length) Opcodes (`2026_AN_Q44`, `2024_AN_Q49`, `2020_FN_Q63`, `2018_FN_Q61`, `2025_FN_Q37`)**; All Addressing Modes (`Immediate, Direct, Indirect, Register, Reg Indirect, Auto-Inc/Dec, Indexed, Base+Offset, PC-Relative`) mapped to **C constructs (`2026_FN_Q14`, `2017_FN_Q27`)**, EA formulas, and Memory Access counts; **PC-Relative `Target - Next_PC` rule (`2017_FN_Q60`)**; **Byte-addressed C-to-Assembly loop traces (`2023_FN_Q41`, `2021_FN_Q38`)**.
   - **Syllabus line:** `Instruction set and addressing modes`.
   - **How often GATE asks it:** Frequently (`Part B.3`: 14 Qs / 24 marks across 8/10 years; exact subtopic split: not sure).
   - **Typical question type:** NAT (max opcodes, immediate bits, offset, memory final value), MCQ (addressing mode match, assembly fill-in, load-store translation).
   - **Zero-level prerequisite:** Ch 00 + C pointers & structs (`C9, C13`).

3. **Complete ALU, Data Path & Control Unit (`Ch 02`)**
   - **Sub-topics:** Half/Full Adders, Carry-Lookahead Adder ($G_i, P_i$, gate delay), Signed vs Unsigned Overflow; **Booth's Signed Multiplication & Transition Shortcut (`2025_AN_Q32`)** + Bit-Pair Recoding; Single-Cycle vs Multi-Cycle Data Path (`PC, MAR, MDR, IR, TEMP1, TEMP2` control step sequences, `2025_FN_Q27`, `2020_FN_Q30`); **Hardwired vs Microprogrammed Control Unit (Horizontal vs Vertical, ROM size)**; **RISC vs CISC characteristics (`2018_FN_Q15`)**.
   - **Syllabus line:** `Design of arithmetic and logic unit (ALU)` & `Design of control unit – hardwired and microprogrammed`.
   - **How often GATE asks it:** Occasionally (`Part B.3`: 4 Qs / 4 marks in 3/10 years; exact future rate: not sure).
   - **Typical question type:** MCQ/MSQ (data path control sequence, operand sources, RISC traits), NAT (Booth's add/sub count).
   - **Zero-level prerequisite:** Ch 00 + Digital Logic (adders, decoders, MUXes, FSMs).

4. **Complete Instruction Pipelining, Hazards & Speedup (`Ch 03`)**
   - **Sub-topics:** Pipeline execution, stage max + latch delay, `(k + N - 1) · T_cycle` (`2025_AN_Q56`, `2023_FN_Q33`, `2021_FN_Q41`, `2017_FN_Q49`); **Multi-cycle `EX/PO` structural stalls (`2026_FN_Q60`, `2018_FN_Q60`, `2021_AN_Q59`)**; **Dependencies (`RAW, WAR, WAW`, `2026_FN_Q16`, `2024_AN_Q25`)**; **Forwarding (`EX->EX, MEM->EX`), Load-Use unavoidable 1-cycle stall (`2024_FN_Q22`), & Reg Read in ID vs EX (`2021_AN_Q59`)**; **Control Hazards, Branch Prediction Accuracy (`2022_FN_Q61`) & CPI/Clock Speedup (`2026_AN_Q57`, `2024_AN_Q56`, `2020_FN_Q43`)**; **Amdahl's Law + Multicore Overhead (`2024_FN_Q55`)**.
   - **Syllabus line:** `Instruction pipelining, pipeline hazards`.
   - **How often GATE asks it:** Very frequently (`Part B.3`: 16 Qs / 28 marks across 9/10 years — `12` NAT2 questions!; exact subtopic count: not sure).
   - **Typical question type:** 2-mark NAT (speedup, total ns/cycles, structural stalls, optimal cores), MSQ (forwarding, RAW/WAR/WAW).
   - **Zero-level prerequisite:** Ch 00 (`GHz <-> ns`), Ch 01 (`Load/Store`), Ch 02 (IF/ID/EX/MEM/WB stages).

5. **Complete Memory Hierarchy, Cache Mapping, AMAT & Memory Interfacing (`Ch 04` & `Ch 05`)**
   - **Sub-topics:**
     - **Cache (`Ch 04`):** Locality; **Direct, $K$-Way Set-Associative, Fully Associative** bit splits (`Tag | Index | Offset`, `N = M + L`, word vs byte block size, leading-zero max cache size `2026_AN_Q56`, Tag RAM overhead); **Hex Hit/Miss Trace (`2026_AN_Q52`, `2022_FN_Q54`) & 3 C's (`2017_FN_Q53` Conflict Misses)**; **Write Policies (`WT/WB` × `WA/NWA`, Dirty bit, `2024_FN_Q41`, `2022_FN_Q24`, `2021_AN_Q39`)**; **Inclusive vs Exclusive L1/L2**; **AMAT (`Local vs Global L2`, `Simultaneous vs Hierarchical`, `Split I/D CPI`, `Critical-Word-First Burst Penalty`, `Memory Bandwidth`, `2025_FN_Q53`, `2025_AN_Q55`, `2024_FN_Q56`, `2020_FN_Q27`, `2019_FN_Q60`, `2017_FN_Q20`, `2017_AN_Q47`)**; **TLB + PT + Cache Physical-Address Interactions (`2026_FN_Q54`)**.
     - **Main Memory (`Ch 05`):** SRAM vs DRAM; **Memory Chip Grid (`rows × cols`) & Interfacing Decoders (`High-order, Low-order Interleaving, Middle CS bits` as in `2023_FN_Q42`)**; **DRAM Refresh Overhead (`2018_FN_Q33`)**; clean cross-link to OS Virtual Memory & OS Secondary Disk Storage.
   - **Syllabus line:** `Memory interfacing and hierarchy: performance, cache memory mapping`.
   - **How often GATE asks it:** Highest weight in ALL of COA (`Part B.3`: Cache 27 Qs / 47 marks + Main/VM 2 Qs / 3 marks = **50 marks across 10/10 years!**; exact subtopic split: not sure).
   - **Typical question type:** NAT/MCQ/MSQ (Tag/Index bits, max cache size, hex hit/miss traces, conflict miss count, write policy MSQs, AMAT, DRAM refresh %, TLB/PT/Cache impossible states).
   - **Zero-level prerequisite:** Ch 00 (powers of 2, hex), Digital Logic (decoders/comparators), OS Ch 05/06 (TLB/PT).

6. **Complete I/O Interface: Interrupts, Polling & DMA (`Ch 06`)**
   - **Sub-topics:** Memory-Mapped vs Isolated I/O; **Programmed I/O (Polling) vs Interrupt-Driven I/O & Polling Overhead Ratios (`2024_FN_Q33`, `2023_FN_Q34`)**; **Exact Interrupt Handling Sequence (`2025_FN_Q11`, `2018_FN_Q19`)**, **Vectored vs Non-Vectored (`2026_AN_Q18`, `2020_FN_Q33`)**, **Daisy Chaining Priority (`2026_AN_Q18`, `2020_FN_Q33`)**; **DMA Controller (`Burst, Cycle Stealing, Transparent`, Single Bus Master rule `2020_FN_Q33(IV)`, Bulk Throughput `2022_FN_Q17`, Cycle-Stealing Transfer Rate `2024_AN_Q24`, `2021_AN_Q11`)**.
   - **Syllabus line:** `I/O interface (interrupt and DMA)`.
   - **How often GATE asks it:** Regularly (`Part B.3`: 9 Qs / 9 marks across 8/10 years — mostly crisp 1-markers; exact subtopic count: not sure).
   - **Typical question type:** MCQ1 (interrupt sequence, daisy chaining vs vectored, DMA throughput, false I/O statement), NAT1 (DMA transfer rate, polling/interrupt ratio).
   - **Zero-level prerequisite:** Ch 00 (`MHz`, `ms`, `us`, `bits/sec`), Ch 02 (bus & `PC`/stack).

---

## PART 4. THE DIAGRAMS I NEED

### Ch 00 · Hardware Math, Clocks, Endianness & CPU Anatomy
1. **CPU Anatomy (`PC, IR, MAR, MDR, ALU, GPRs, Flags`) & Clock-to-Time Ruler (`GHz <-> ns`)**
   - *What to draw:* Inside CPU box connected to RAM street (`1000..`): `PC` pointing to instruction `1004`, `MAR` holding address, `MDR` carrying value, `IR` decoding opcode, `GPRs` feeding `ALU` & lighting `Z, C, N, V` flags, paired with a quick `f <-> T` cheat bar (`2 GHz = 0.5 ns`, `2.5 GHz = 0.4 ns`)!
   - *What to notice:* What each register actually holds during one instruction cycle, and how clock period shrinks as frequency rises.
   - *Format:* **Single picture**
2. **Little Endian vs Big Endian Byte Boxes (`0x6665` & `0x12345678`) & ISA Wall**
   - *What to draw:* Left: `0x12345678` and `0x6665` placed in RAM byte boxes `1000..` under Big Endian (`MSB first`) vs Little Endian (`LSB first`, `2021_AN_Q58`). Right: Two-box separation of **ISA (`Registers, Opcodes, Endianness`)** above the line vs **Microarchitecture (`Cache size, Clock GHz, Pipeline`)** below (`2025_AN_Q28`).
   - *What to notice:* Endianness swaps *whole bytes*, NEVER bits inside a byte; ISA is what the assembly programmer sees!
   - *Format:* **Single picture**

### Ch 01 · Machine Instructions and Addressing Modes
3. **Expanding Opcode Prefix Tree (`2026_AN_Q44`, `2018_FN_Q61`)**
   - *What to draw:* Binary branching tree splitting 16-bit instructions from top: `2-bit M-type` uses `00, 01` (`2` left!) -> `10, 11` expand by 2 extra bits into `8` `4-bit R-type` prefixes (`7` used, `1` left!) -> expands by 2 extra bits into **`4` `6-bit C-type` opcodes** (`2026_AN_Q44`)!
   - *What to notice:* Every unused `k`-bit opcode slot doubles (`× 2^m`) when extended by `m` free operand bits!
   - *Format:* **Step-by-step series of pictures**
4. **Addressing Modes Visual Map + `PC-Relative` Next-PC Offset (`2026_FN_Q14`, `2017_FN_Q60`)**
   - *What to draw:* Left: Mini arrow map for `Immediate` (in instruction), `Direct` (1 RAM hop), `Indirect` (2 RAM hops — pointer!), `Base+Index` (`R_base + R_index` — array `a[i]`!), `Base+Offset` (`R_base + X` — struct `s.grade`!). Right: Byte-addressed instruction strip showing `PC` advancing to `Addr + 4` **before** adding signed offset `-16` (`2017_FN_Q60`)!
   - *What to notice:* Why PC-relative jumps count backward/forward from the **NEXT** instruction (`PC + 4`), NOT from the branch instruction's own address!
   - *Format:* **Single picture**

### Ch 02 · ALU, Data Path and Control Unit
5. **Single-Bus Data Path (`R0 <- R1 + R2`, `2020_FN_Q30`) & Control Unit Comparison**
   - *What to draw:* One vertical highway bus connecting `PC, MAR, MDR, IR, R0..R3, TEMP1, ALU, TEMP2` (highlighting why `TEMP1` holds `R1` while `R2` rides the bus into the `ALU`'s second leg!), paired with numbered control steps `3 -> 5 -> 2 -> 1 -> 4` (`2020_FN_Q30`), plus a Hardwired vs Horizontal vs Vertical Microprogrammed ROM layout.
   - *What to notice:* Only ONE value travels on a single bus per tick — explaining every `TEMP` register and why multi-cycle instructions need 5 separate ticks!
   - *Format:* **Step-by-step series of pictures**
6. **Booth's Multiplication & `01 / 10` Transition Counting Shortcut (`2025_AN_Q32`)**
   - *What to draw:* Left: Full 4-bit Booth trace (`A | Q | Q_{-1}`) showing arithmetic right shift `ASR`. Right: 16-bit multiplier `Q` (`1010010010101010`) with trailing `0` and red/green ticks drawn between every adjacent `0|1` (`+M`) and `1|0` (`-M`) transition (`13` ticks, `2025_AN_Q32`)!
   - *What to notice:* Consecutive `1`s or `0`s require ZERO adds/subtracts in the middle — ONLY transitions (`0->1` or `1->0`) count!
   - *Format:* **Trace table** + **Single picture**

### Ch 03 · Instruction Pipelining and Hazards
7. **5-Stage Pipeline Space-Time Stairs (Ideal vs Structural `PO/EX` vs `Load-Use` vs Forwarding)**
   - *What to draw:* Four aligned `Cycle 1, 2, 3...` grid charts:
     (1) Ideal 5-stage stairs (`IF ID EX MEM WB` + `latch` dividers);
     (2) Unpipelined multi-cycle `PO` / `EX` stretching horizontally and stalling the next instruction (`2018_FN_Q60`, `2021_AN_Q59`);
     (3) Forwarding arrows (`EX -> EX`, `MEM -> EX`) fixing `ADD -> ADD`, vs `Load-Use` still forcing 1 red bubble (`2024_FN_Q22`);
     (4) Branch flush wiping wrong fetched instructions (`2` bubbles in `EX` vs `1` in `ID`, `2022_FN_Q61`).
   - *What to notice:* Forwarding goes **forward or vertical in time** (end of cycle $t$ to start of cycle $t+1$); it can NEVER go backwards in time (hence `Load-Use` stalls 1 cycle!).
   - *Format:* **Step-by-step series of pictures** + **Trace table**
8. **Data Dependency Arrows (`RAW`, `WAR`, `WAW`) on `I1..I4` (`2024_AN_Q25`)**
   - *What to draw:* Four instructions `I1..I4` with colored arrows between identical register names (`I1 writes R3 -> I2 reads R3 [RAW]`, `I2 reads R5 -> I3 writes R5 [WAR]`, `I1 writes R3 -> I3 writes R3 [WAW]`).
   - *What to notice:* Only `RAW` (arrow from Write to later Read) hazards occur in standard in-order 5-stage pipelines (`2026_FN_Q16`)!
   - *Format:* **Single picture**

### Ch 04 · Cache Memory
9. **3 Cache Address Bit-Slices (`Direct`, `K-Way`, `Fully Assoc`) + Tag Comparators + `128 KB` Leading-Zero Trick**
   - *What to draw:* Three aligned 32-bit address rulers showing `[Tag | Index | Offset]` shifting left as associativity doubles (`N = M + L`, `2026_FN_Q38`; `Index = 0` in Fully Assoc, `2019_FN_Q11`), hardware comparators (`1` vs `K` vs `all lines`), AND `0xA2C28` binary bits `[19..0]` highlighting `[16..6] = 00010110000 = 176` (`128 KB`, `2026_AN_Q56`)!
   - *What to notice:* `Offset` depends ONLY on block size; doubling associativity moves 1 bit from `Index` to `Tag`; leading `0`s before `176` expand maximum possible cache size!
   - *Format:* **Single picture**
10. **Cache Hex Trace Frames (`P, Q, R, S`, `2026_AN_Q52`, `2022_FN_Q54`) & `2`-Way LRU Conflict Thrash (`2017_FN_Q53`)**
    - *What to draw:* Set-indexed cache slot table updated step-by-step for `P, Q, R, S` (`0x845B32, 26, 36, 0x846B32`) showing `R` hitting `P`'s block while `S` evicts `P`, beside a 2-way Set 0 box cycling `{0, 128, 256}` (`2017_FN_Q53`) distinguishing Compulsory (`1st touch`) from Conflict (`evicted & missed again`) misses!
    - *What to notice:* Why `R` (`0x845B36`) shares `P`'s 16-byte block and hits every single time (`2026_AN_Q52(B)`)!
    - *Format:* **Trace table** + **Step-by-step series of pictures**
11. **`2 × 2` Cache Write Policy Flowchart & Inclusive L1/L2 + MMU (`TLB + PT + Cache`, `2026_FN_Q54`)**
    - *What to draw:* Left: `Write Hit (WT vs WB)` & `Write Miss (WA vs NWA)` flowcharts marking Dirty Bit usage (`2024_FN_Q41`, `2022_FN_Q24`). Right: CPU Virtual Addr -> `TLB / Page Table (MMU)` -> Physical Addr -> `Physically-Indexed Cache` with a red back-invalidation wire from Page Eviction clearing Cache blocks (`2026_FN_Q54`)!
    - *What to notice:* Why `PT miss + Cache hit` and `TLB hit + PT miss` are physically impossible (`2026_FN_Q54`)!
    - *Format:* **Single picture**

### Ch 05 · Main Memory
12. **DRAM Chip Grid (`256M × 4-bit` -> `1 GB`), Decoder Interleaving & DRAM Refresh Cycle (`2018_FN_Q33`, `2023_FN_Q42`)**
    - *What to draw:* 8 DRAM chips arranged horizontally (`8 × 4 bits = 32-bit bus`), high-order vs middle-bit (`IA4, IA3` decoder `2023_FN_Q42`) vs low-order chip-select wiring, and a `2 ms` DRAM timeline shaded with `2^{14} × 50 ns = 40.96%` Refresh Lockout vs `59.04%` R/W availability (`2018_FN_Q33`)!
    - *What to notice:* Bit-width multiplies chips *horizontally*; address capacity multiplies chips *vertically*; and every row refresh pauses normal memory R/W!
    - *Format:* **Single picture**

### Ch 06 · I/O Interface: Interrupts and DMA
13. **Polling vs Interrupt Timeline (`2023_FN_Q34`) + Interrupt Hardware Sequence (`2025_FN_Q11`, `2018_FN_Q19`)**
    - *What to draw:* Top: 1-second ruler with `100` tiny red Polling spikes (`100 us` every `10 ms`) + `1` keystroke vs Interrupt with `0` idle spikes (`1` `1000 us` spike)! Bottom: 5-frame Interrupt steps (`Finish Curr Instr -> Push PC & PSW -> Vector Lookup / Daisy Chain -> Execute ISR -> Pop & Resume`, `2025_FN_Q11`, `2018_FN_Q19`) + Daisy Chain `INT/INTA` priority wiring (`2026_AN_Q18`)!
    - *What to notice:* Polling burns CPU checking empty queues 99% of the time; Daisy Chaining assigns priority by physical wire order without CPU polling!
    - *Format:* **Step-by-step series of pictures**
14. **DMA Bus Mastership & Burst vs Cycle Stealing Timelines (`2024_AN_Q24`, `2020_FN_Q33`)**
    - *What to draw:* CPU + DMA Controller wired to System Bus via `Bus Request (BR)` / `Bus Grant (BG)` switches (showing **ONLY 1 master owns the bus at any instant!** `2020_FN_Q33(IV)`), plus CPU-vs-DMA activity bars for Burst Mode (`DMA hogs bus`) vs Cycle Stealing (`DMA steals 1% ticks cleanly`, `2024_AN_Q24`, `2021_AN_Q11`)!
    - *What to notice:* Why CPU and DMA never drive the address/data bus simultaneously, and how `1% × Clock × Bytes/cycle × 8` gives DMA bps!
    - *Format:* **Single picture**

---

## PART 5. THE FULL PLAN, CHAPTER BY CHAPTER

*(Starting with Chapter 00 and Chapter 01 below; continuing from Chapter 02 on next turn!)*

### Chapter 00 · Hardware Math, Clocks, Endianness & CPU Anatomy *(New Prerequisite Chapter)*

#### Lesson 00.1 · Clocks (`Hz <-> ns`), Powers of 2, Word vs Byte Addressing, Endianness & CPU Registers
- **Tag:** `[MUST]` — Zero-level readers fail almost every COA numerical without mastering `GHz <-> ns`, hex slicing, endianness (`2021_AN_Q58`), and register roles (`2025_AN_Q28`).
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** C0 (bits, bytes, hex).
- **Beginner must-see:** Inside a CPU, a metronome (**Clock**) ticks billions of times a second (`2 GHz = 2 × 10^9` ticks/sec -> each tick is `0.5 ns`!). Meanwhile, `PC` points to the next instruction in RAM, `IR` holds the current instruction, `MAR/MDR` fetch memory words, and **Endianness** decides whether multi-byte hex `0x6665` stores `0x65` first (**Little Endian**) or `0x66` first (**Big Endian**, `2021_AN_Q58`)!
- **Finer points:**
  - **Clock Period & Unit Bridge:** $T = 1/f$ (`1 GHz <-> 1 ns`, `2.5 GHz <-> 0.4 ns`, `1.6 GHz <-> 0.625 ns`, `60 MHz <-> 16.67 ns`).
  - **Powers of 2 & Hex Grouping:** `2^{10}..2^{32}` instant table; `1 hex digit = 4 bits` (`0xA2C28` -> `20` bits).
  - **Byte-Addressable vs Word-Addressable (`2020_FN_Q55`, `2017_FN_Q65`):** Why 32-bit words occupy 4 consecutive byte addresses in byte-addressable RAM (`+4` stride, `2023_FN_Q41`, `2017_FN_Q60`).
  - **Endianness (`2021_AN_Q58`):** 2-byte and 4-byte Little vs Big Endian memory layout; why `255`-difference gives `(MSB - LSB) = 1` (`0x6665`, `0x0100`).
  - **CPU Registers & Status Flags (`C, Z, N, V`) + ISA vs Microarchitecture (`2025_AN_Q28`):** Registers, Opcodes, Addressing Modes = **ISA**; Cache sizes/levels, Clock speed, Pipeline depth = **Implementation/Microarchitecture**.
- **GATE-level items:** Endianness integer difference (`2021_AN_Q58`: `0x6665, 0x0100`), ISA vs implementation MSQ (`2025_AN_Q28`), and clock/hex conversions across all Chapters 01–06.
- **Diagrams needed:** `MEMORY` (CPU Registers `PC, IR, MAR, MDR, ALU, Flags` wired to RAM + Endianness byte boxes `0x6665`); `COMPARE` (`ISA Contract` vs `Hardware Implementation`, `2025_AN_Q28`).
- **Hand traces:** Converting `0xA2C28` (`2026_AN_Q56`) to binary, converting `2.5 GHz` & `4 MHz` to period `ns`, and computing Little vs Big Endian values for `0x6665`, `0x0100`, `0x4243` (`2021_AN_Q58`).
- **Common mistakes:** Swapping bits *inside* each byte when converting Little/Big Endian (only *byte order* reverses!); thinking Cache size is part of ISA (`2025_AN_Q28`); forgetting `1` byte = `8` bits when converting `MHz` bytes/cycle to `bps`!

---

### Chapter 01 · Machine Instructions and Addressing Modes

#### Lesson 01.1 · Instruction Formats, Load-Store RISC & Expanding Opcodes
- **Tag:** `[MUST]` — Directly solves `5` high-frequency PYQs (`2026_FN_Q15`, `2026_AN_Q44`, `2025_FN_Q37`, `2024_AN_Q49`, `2024_AN_Q43`, `2020_FN_Q63`, `2018_FN_Q61`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 00.1.
- **Beginner must-see:** Every machine instruction is a fixed-size packet of bits (like 16 bits or 32 bits) sliced into `[Opcode | Operands]`! If you have `64` registers, each register takes `log_2(64) = 6` bits. And when 3-operand instructions don't leave enough bits for 1-operand instructions, **Expanding Opcodes** reserve unused prefix codes and stretch the opcode rightward into freed operand bits!
- **Finer points:**
  - **0-, 1-, 2-, 3-Address Formats & Load-Store (`RISC`) (`2026_FN_Q15`):** Why Load-Store machines allow arithmetic ONLY on registers (`LOAD` / `STORE` exclusively touch memory!).
  - **Fixed-Length Opcode Encoding (`2025_FN_Q37`, `2024_AN_Q49`, `2024_AN_Q43`):** `Total_bits = Opcode_bits + Mode_bits + k·Reg_bits + Imm_bits + Unused_bits` (`ceil(log_2(N))` for `N` items!).
  - **Expanding (Variable-Length) Opcodes (`2026_AN_Q44`, `2020_FN_Q63`, `2018_FN_Q61`):**
    - Total 16-bit encoding budget = $2^{16}$.
    - Every instruction type `i` with `n_i` opcodes and `b_i` operand bits consumes `n_i × 2^{b_i}` slots!
    - **Golden Formula:** $\sum n_i \cdot 2^{b_i} \le 2^{\text{instr\_len}}$ -> solve directly for max $N$ (with prefix-tree alignment check when opcodes must be whole prefixes!).
- **GATE-level items:** Load-Store `Z = X + Y` translation (`2026_FN_Q15`), 32-bit fixed field splits (`2025_FN_Q37`, `2024_AN_Q49`, `2024_AN_Q43`), and Expanding Opcode limits (`2026_AN_Q44`: `4`, `2020_FN_Q63`: `14`, `2018_FN_Q61`: `32`).
- **Diagrams needed:** `ARRAY` (Bit-field bars for R-type, I-type, M-type, C-type); `TREE` (Expanding Opcode binary prefix tree showing unused 2-bit/4-bit prefixes branching down, `2026_AN_Q44`).
- **Hand traces:** Solving `2026_AN_Q44` (`4`), `2020_FN_Q63` (`14`), `2018_FN_Q61` (`32`), `2025_FN_Q37` (`20`), and `2024_AN_Q49` (`32`).
- **Common mistakes:** Using `50` instead of `ceil(log_2 50) = 6` bits for `50` registers/opcodes (`2025_FN_Q37`, `2024_AN_Q43`); adding raw counts instead of multiplying by $2^{\text{free\_operand\_bits}}$ in expanding opcodes; letting `ADD` access memory directly on a Load-Store CPU (`2026_FN_Q15`!).

#### Lesson 01.2 · Addressing Modes, PC-Relative Offsets & Assembly Loop Tracing
- **Tag:** `[MUST]` — Covers `2026_FN_Q14`, `2023_FN_Q41`, `2021_FN_Q38`, `2017_FN_Q27`, `2017_FN_Q60`.
- **Estimated reading time:** 70 minutes.
- **Prerequisites:** Lesson 01.1, C8–C13 (arrays, pointers, structs).
- **Beginner must-see:** Why are there 10 different Addressing Modes? Because C programs use constants (`Immediate`), pointers (`Indirect`), array indices `a[i]` (`Base + Index`), struct fields `s.grade` (`Base + Offset`), and loops jumping backward (`PC-Relative` from **Next Instruction**)!
- **Finer points:**
  - **Complete Addressing Modes Table (`EA` + Memory Reads + C Use Case, `2026_FN_Q14`, `2017_FN_Q27`):** Immediate (`Constant`, `0` reads), Direct/Absolute (`Global`, `1`), Indirect (`Pointer`, `2`), Register (`Local var`, `0`), Register Indirect (`*p`, `1`), Auto-Inc/Dec (`*p++ / *--p`, `1`), Indexed (`a[i]`, `1`), Base+Offset (`struct.field` `s.grade`, `1`), PC-Relative (`if/while` relocatable branches!).
  - **PC-Relative Branch Math (`2017_FN_Q60`):** `Target_Addr = Next_PC + Signed_Offset`, so **`Offset = Target_Addr - (Branch_Addr + Instr_Size)`**!
  - **Tracing Byte-Addressed Assembly (`2023_FN_Q41`, `2021_FN_Q38`):** 32-bit `int` array steps by `+4` bytes (`add r3, r3, 4`); multiply by `8` is `shl r5, r5, 3` (`2023_FN_Q41`!).
- **GATE-level items:** Matching Addressing Modes to C constructs (`2026_FN_Q14`, `2017_FN_Q27`), computing negative PC-relative branch offset (`2017_FN_Q60`: `-16`), and tracing C-to-Assembly loops (`2023_FN_Q41`, `2021_FN_Q38`).
- **Diagrams needed:** `COMPARE` (9-row Addressing Modes Cheat Table); `MEMORY` (PC-relative 4-byte instruction strip showing `PC` advancing to `Branch + 4` before adding `-16`, `2017_FN_Q60`); `TRACE` (Register + RAM trace for `2023_FN_Q41`).
- **Hand traces:** Tracing `2023_FN_Q41` (`shl 3, add 4, add 4, jmp L01`), computing `-16` PC-relative offset (`4` instructions back from `Next_PC`), and finding `student.grade` offset (`400` B -> `X(R1)` in `2017_FN_Q27`).
- **Common mistakes:** Computing `Target - Branch_Addr` instead of `Target - (Branch_Addr + 4)` (`-12` instead of `-16` in `2017_FN_Q60`!); using `shl 8` instead of `shl 3` for multiplying by 8 (`2023_FN_Q41`!); incrementing array pointer by `1` instead of `4` on byte-addressable 32-bit `int` arrays (`2023_FN_Q41`!).

---

`CONTINUE FROM CHAPTER 02`

## PART 5 (Continued) · Chapters 02 to 06

### Chapter 02 · ALU, Data Path and Control Unit

#### Lesson 02.1 · Adders (`RCA` vs `CLA`), Overflow Flags & Booth's Signed Multiplication
- **Tag:** `[SHOULD]` — Light overall bank weight (`4` marks across 15 papers), yet `Booth's` transition counting (`2025_AN_Q32`) is a fast guaranteed point.
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 00.1, Digital Logic (Half/Full Adders & 2's complement).
- **Beginner must-see:** Adding 32-bit numbers bit-by-bit in a **Ripple-Carry Adder** forces every bit to wait for the carry before it (slow!). A **Carry-Lookahead Adder (CLA)** computes all carries in parallel in constant gate levels! And for **signed multiplication (`Booth's Algorithm`)**, instead of adding for every single `1`-bit, Booth skips long strings of `1`s and ONLY does math when adjacent multiplier bits **flip (`0->1` or `1->0`)** (`2025_AN_Q32`)!
- **Finer points:**
  - **Ripple-Carry (`2n` gate delays) vs Carry-Lookahead (`G_i = A_i B_i`, `P_i = A_i ⊕ B_i` -> `2`-level SOP carry delay!).**
  - **Signed vs Unsigned Overflow:** Unsigned Carry `C_out` vs Signed 2's-complement Overflow `V = C_{n-1} ⊕ C_n`.
  - **Booth's Algorithm (`2025_AN_Q32`):**
    - Append `Q_{-1} = 0` at the right end of multiplier `Q`.
    - Scan `(Q_0, Q_{-1})`: `00` / `11` -> **shift only**; **`01` -> `A = A + M` then shift**; **`10` -> `A = A - M` then shift**; ALWAYS **Arithmetic Right Shift (ASR)** preserving sign bit of `A`!
    - **The 5-Second GATE Shortcut (`2025_AN_Q32`):** Total additions + subtractions = exact number of **`0 <-> 1` transitions** inside `Q` (with trailing `0` appended)!
  - **Bit-Pair Recoding (Radix-4 Modified Booth) & Restoring Division (`[LATER]`):** Halving partial products from $n$ to $n/2$.
- **GATE-level items:** Counting total add + sub operations in 16-bit Booth's multiplication (`2025_AN_Q32`: `13`); CLA gate delay & signed overflow detection.
- **Diagrams needed:** `CIRCUIT` (Ripple Carry chain vs Parallel CLA `G_i, P_i` generator); `TRACE` (Full 4-bit Booth trace `A | Q | Q_{-1}` + 16-bit `Q` bit-transition tick diagram for `2025_AN_Q32`).
- **Hand traces:** Tracing `(-5) × (+3)` via 4-bit Booth's; counting all 13 transitions in `Q = 1010 0100 1010 1010` + `0` (`2025_AN_Q32`).
- **Common mistakes:** Forgetting to append the invisible `Q_{-1} = 0` bit on the right of `Q` (missing the rightmost `1->0` transition in `2025_AN_Q32`!); using Logical Shift instead of **Arithmetic** Right Shift (`ASR`) in Booth's; mixing up `01` (`+M`) and `10` (`-M`).

#### Lesson 02.2 · Single-Bus Data Path, Micro-Operations, Control Units & `RISC` vs `CISC`
- **Tag:** `[SHOULD]` — Directly covers `2025_FN_Q27`, `2020_FN_Q30`, `2018_FN_Q15`, and the official Control Unit syllabus line.
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 00.1 (`PC, IR, MAR, MDR`), Lesson 01.1.
- **Beginner must-see:** Think of a **Single-Bus CPU** like a 1-lane bridge: only ONE number can cross the bridge per clock tick! So to add `R1 + R2`, `R1` crosses first and waits inside `TEMP1`, then `R2` crosses straight into the `ALU` beside `TEMP1`, the answer parks in `TEMP2`, and finally jumps back across the bridge into `R0` (`2020_FN_Q30`)!
- **Finer points:**
  - **Single-Bus Data Path Control Sequence (`2020_FN_Q30`, `2025_FN_Q27`):**
    1. Instruction Fetch: `PC_r, MAR_w, MEM_r` -> `MDR_r, IR_w` (plus `PC += 4`).
    2. Execute (`R0 <- R1 + R2`): `R1_r, TEMP1_w` -> `R2_r, TEMP1_r, ALU_add, TEMP2_w` -> `TEMP2_r, R0_w` (`3 -> 5 -> 2 -> 1 -> 4`, `2020_FN_Q30`!).
    3. Reading MUX/immediate wires on a partial data path (`2025_FN_Q27`).
  - **Hardwired Control Unit vs Microprogrammed Control Unit:**
    - **Hardwired:** Combinational logic + State Counter + Decoder (super fast, rigid, used in **RISC**, `2018_FN_Q15`).
    - **Microprogrammed:** Control Memory (ROM) storing microinstructions (`Horizontal`: 1 bit per control signal -> wide, parallel, zero decoder delay; `Vertical`: encoded `k`-to-`2^k` fields -> compact ROM, slower!).
  - **RISC vs CISC (`2018_FN_Q15`):** Register-to-register ALU ops (`Load/Store`), fixed-length instructions, hardwired control, many registers, single-cycle pipeline target (`RISC`: all 3 true in `2018_FN_Q15`!).
- **GATE-level items:** Ordering single-bus fetch-execute micro-operations (`2020_FN_Q30`: `3,5,2,1,4`), checking supported arithmetic operands on a given data path (`2025_FN_Q27`), RISC properties (`2018_FN_Q15`), and Horizontal vs Vertical control ROM bits.
- **Diagrams needed:** `CIRCUIT` / `FRAMES` (Single-Bus CPU Data Path `PC, MAR, MDR, IR, R0..R2, TEMP1, ALU, TEMP2` animated across `3->5->2->1->4`, `2020_FN_Q30`); `COMPARE` (Hardwired vs Horizontal Microprogrammed vs Vertical Microprogrammed + RISC vs CISC).
- **Hand traces:** Tracing `2020_FN_Q30` step-by-step; computing control ROM size (bytes) under Horizontal vs Vertical encoding for 80 mutually-exclusive/groupable control signals.
- **Common mistakes:** Trying to put `R1` and `R2` onto the single shared bus in the same clock step; confusing Horizontal (wide, unencoded, fast) with Vertical (narrow, encoded, slower); thinking RISC uses microprogrammed control (`2018_FN_Q15`!).

---

### Chapter 03 · Instruction Pipelining and Hazards

#### Lesson 03.1 · Pipeline Mechanics, Stage Latches, Multi-Cycle `EX/PO` & Structural Hazards
- **Tag:** `[MUST]` — Guarantees 2-mark NATs (`2026_FN_Q60`, `2025_AN_Q56`, `2023_FN_Q33`, `2021_FN_Q41`, `2018_FN_Q60`, `2017_FN_Q49`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 00.1 (`Hz <-> ns`), Lesson 02.2 (`IF, ID, EX, MEM, WB`).
- **Beginner must-see:** Instead of waiting for 1 whole car to finish all 5 assembly stations before starting Car #2 (`non-pipelined`), an assembly line (**Pipelining**) keeps 5 cars moving forward together every tick — finishing **1 car per tick**! Catch: the entire assembly belt can ONLY tick as fast as its **slowest stage + latch delay**, and if Car #1 hogs Station 4 for 3 ticks (**Structural Hazard**), Car #2 stalls behind it!
- **Finer points:**
  - **Clock Cycle & Total Execution Time (`2025_AN_Q56`, `2023_FN_Q33`, `2021_FN_Q41`, `2017_FN_Q49`):**
    - $T_{\text{cycle}} = \max(d_1, \dots, d_k) + d_{\text{latch}}$.
    - Total time for $N$ hazard-free instructions = **$(k + N - 1) \cdot T_{\text{cycle}}$**!
    - Splitting bottleneck stage (`20 ns -> 12 ns + 8 ns` increases $k$ from 5 to 6 while dropping $T_{\text{cycle}}$ from `22 ns` to `14 ns`, `2017_FN_Q49`!).
  - **Multi-Cycle Unpipelined `EX / PO` Stage & Structural Stalls (`2026_FN_Q60`, `2018_FN_Q60`):**
    - When `EX/PO` takes $t > 1$ cycles and is NOT pipelined, every extra cycle `(t - 1)` stalls the pipeline by `(t - 1)` cycles (careful checking consecutive overlaps in reservation tables! `2018_FN_Q60`: `(5+100-1) + 40(2) + 35(1) = 219`; `2026_FN_Q60`: `95`).
    - Classic Structural Hazards: 1 unified L1 cache (`IF` and `MEM` collide -> solved by split `I-Cache` + `D-Cache`), or single unpipelined ALU (`2026_FN_Q60`).
- **GATE-level items:** Total ns for 100 or 1000 instructions with latch delays (`2025_AN_Q56`, `2023_FN_Q33`, `2021_FN_Q41`), speedup from splitting bottleneck stage (`2017_FN_Q49`), and structural stalls with multi-cycle EX/PO (`2026_FN_Q60`, `2018_FN_Q60`).
- **Diagrams needed:** `TIMELINE` (5-stage car assembly stairs with latch dividers + reservation table showing unpipelined 3-cycle `PO` pushing `I2, I3` right, `2018_FN_Q60`).
- **Hand traces:** Tracing `2025_AN_Q56` (`261.04 us`), `2023_FN_Q33` (`2040 ns`), `2021_FN_Q41` (`17160 ns`), `2018_FN_Q60` (`219`), and `2017_FN_Q49` (`1.51`).
- **Common mistakes:** Forgetting latch delay (`2025_AN_Q56`, `2021_FN_Q41`, `2017_FN_Q49`); adding `k × T_cycle` per instruction instead of `(k + N - 1) · T_cycle`; forgetting that splitting `OF` in `2017_FN_Q49` raises $k$ from `5` to `6`!

#### Lesson 03.2 · Data & Control Hazards (`RAW, WAR, WAW`), Forwarding, Speedup & Amdahl's Law
- **Tag:** `[MUST]` — Highest 2-mark NAT density in Pipelining (`2026_FN_Q16`, `2026_AN_Q57`, `2024_FN_Q22`, `2024_AN_Q25`, `2024_FN_Q55`, `2024_AN_Q56`, `2022_FN_Q61`, `2021_AN_Q59`, `2020_FN_Q43`).
- **Estimated reading time:** 90 minutes.
- **Prerequisites:** Lesson 03.1.
- **Beginner must-see:** Even when no hardware clashes, Instruction #2 often needs an answer Instruction #1 hasn't finished writing yet (**`RAW` Data Hazard**, `2026_FN_Q16`) — or Instruction #1 is a `Branch` whose jump direction isn't known until later (**Control Hazard**)! Adding direct shortcut wires (**Operand Forwarding**) fixes most data stalls, yet `LOAD` followed right away by `ADD` STILL pauses 1 cycle (`2024_FN_Q22(C)`)!
- **Finer points:**
  - **3 Data Dependencies (`2026_FN_Q16`, `2024_AN_Q25`):**
    - **`RAW` (True Data Dependency):** $I_1$ writes `R3`, $I_2$ reads `R3` (causes real hazards in in-order 5-stage pipelines!).
    - **`WAR` (Anti)** & **`WAW` (Output):** False name dependencies (eliminated by Register Renaming; no stall in standard 5-stage!).
  - **Operand Forwarding (`EX->EX`, `MEM->EX`) & `Load-Use` Stall (`2024_FN_Q22`, `2021_AN_Q59`):**
    - Why extra bypass MUX hardware IS needed (`2024_FN_Q22(D)` false!).
    - Why `Load -> Use` still stalls `1` cycle (`MEM` delivers data at end of cycle 4, yet dependent `ADD` needed it at start of cycle 4 -> `2024_FN_Q22(C)`!).
    - **Check Register-Read Stage Carefully (`2021_AN_Q59`):** Standard RISC reads in `ID`; `2021_AN_Q59` explicitly puts register read in `EX` (`ADD = 1, MUL = 2` -> `30 / 16 = 1.875`)!
  - **Control Hazards & Branch Prediction (`2022_FN_Q61`):** `CPI_pipe = 1 + branch_freq × (1 - accuracy) × branch_penalty` (`2022_FN_Q61`: `1.6 / 1.12 = 1.43`).
  - **Universal Speedup with Different Clock Speeds (`2026_AN_Q57`, `2024_AN_Q56`, `2020_FN_Q43`):**
    - $\text{Speedup} = \frac{\text{CPI}_{\text{nonpipe}} / f_{\text{nonpipe}}}{\text{CPI}_{\text{pipe}} / f_{\text{pipe}}}$, where $\text{CPI}_{\text{pipe}} = 1 + \sum (\text{instr\_frac}_i \times \text{stall\_prob}_i \times \text{penalty}_i)$!
  - **Amdahl's Law + Multicore Overhead (`2024_FN_Q55`):** $T(N) = T_{\text{serial}} + \frac{T_{\text{parallel}}}{N} + \text{overhead}(N - 1)$!
- **GATE-level items:** Identifying `RAW` (`2026_FN_Q16`, `2024_AN_Q25`), forwarding truths (`2024_FN_Q22`), forwarding vs non-forwarding speedup (`2021_AN_Q59`: `1.875`), BPU speedup (`2022_FN_Q61`: `1.43`), multi-clock hazard speedup (`2026_AN_Q57`: `2.34`, `2020_FN_Q43`: `2.16`, `2024_AN_Q56`: `3.0`), and optimal core count (`2024_FN_Q55`: `3`).
- **Diagrams needed:** `TIMELINE` (5-stage grid showing `EX->EX, MEM->EX` bypass wires, 1-bubble `Load-Use` stall, and `2021_AN_Q59` with vs without forwarding); `GRAPHPIC` (`I1..I4` dependency arrows `RAW/WAR/WAW`, `2024_AN_Q25`); `FLOW` (Clock-adjusted Speedup & Amdahl optimization).
- **Hand traces:** Full cycle-by-cycle grids for `2021_AN_Q59` (`30` vs `16` cycles), `2026_AN_Q57`, `2022_FN_Q61`, `2020_FN_Q43`, and `2024_FN_Q55` (`N = 1..4`).
- **Common mistakes:** Multiplying `0.05` memory miss penalty by `1.0` instead of `0.30` (fraction of memory instructions in `2020_FN_Q43`!); forgetting clock frequency dropped (`1.6 -> 1.2 GHz` in `2026_AN_Q57`; `2.5 -> 2.0 GHz` in `2020_FN_Q43`); ignoring that `WAR/WAW` don't stall in-order 5-stage (`2026_FN_Q16`, `2024_AN_Q25`).

---

### Chapter 04 · Cache Memory *(Highest-Weight Chapter in COA: 47 Marks!)*

#### Lesson 04.1 · Cache Mapping (`Direct`, `K-Way`, `Fully Assoc`), Bit-Slicing & Tag Storage
- **Tag:** `[MUST]` — Guaranteed 2–4 marks every year (`2026_FN_Q38`, `2026_AN_Q56`, `2025_FN_Q36`, `2025_AN_Q39`, `2023_FN_Q64`, `2021_AN_Q65`, `2021_FN_Q51`, `2020_FN_Q55`, `2019_FN_Q11`, `2018_FN_Q44`, `2017_AN_Q36`, `2017_FN_Q65`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 00.1 (powers of 2, hex-binary, byte vs word addressing).
- **Beginner must-see:** RAM is huge and slow (hundreds of cycles!); a **Cache** is a tiny super-fast desk holding copies of the most-used RAM blocks! To find a byte instantaneously, the hardware chops its physical address into **`[TAG (which neighborhood?) | INDEX (which shelf/set?) | OFFSET (which byte inside the block?)]`**!
- **Finer points:**
  - **The Master Cache Bit-Slice Equations:**
    - `Addr_bits` = $\log_2(\text{Main Memory addressable units})$.
    - `Offset_bits` = $\log_2(\text{Block size in addressable units})$ (`watch word-addressable vs byte-addressable!`, `2018_FN_Q44`: `2^M` words $\times$ `2^W` bytes = `M + W`!).
    - `Total_Lines` = `Cache_Size / Block_Size`; `Num_Sets` = `Total_Lines / K` (`K = 1` Direct, `K = Total_Lines` Fully Assoc -> **`Index = 0` bits**, `2019_FN_Q11`!).
    - `Index_bits` = $\log_2(\text{Num\_Sets})$.
    - **`Tag_bits = Addr_bits - Index_bits - Offset_bits`**!
  - **Associativity Shift Law (`2026_FN_Q38`, `2018_FN_Q44`, `2017_FN_Q65`):** Changing same-size cache from Direct Mapped ($K=1$, tag `M`) to $2^L$-way Set-Associative steals `L` bits from `Index` and hands them to `Tag` -> **`N = M + L`**! (`16`-way adds $+4$ tag bits, `2017_FN_Q65`!).
  - **Tag Memory Overhead (`2025_FN_Q36`):** `Total Tag Bits = Total_Lines × Tag_bits` (plus `Valid`, `Dirty`, `LRU` bits if asked!).
  - **Leading-Zero Max Cache Size Trick (`2026_AN_Q56`):** Match `176_{10} = 10110000_2` inside `0xA2C28` (`1010 0010 1100 0010 1000`), prepend all contiguous zero bits `[16..14]` (`00010110000`) -> `Index` spans `[16..6]` (`11` bits) + `Offset [5..0]` (`6` bits) -> max cache = $2^{17} = 128\text{ KB}$!
- **GATE-level items:** Symbolic & numeric Tag/Index/Associativity bit calculations (`2026_FN_Q38`, `2025_AN_Q39`, `2023_FN_Q64`, `2021_AN_Q65`, `2021_FN_Q51`, `2019_FN_Q11`, `2018_FN_Q44`, `2017_AN_Q36`, `2017_FN_Q65`), total tag storage (`2025_FN_Q36`), same-set hex comparison (`2020_FN_Q55`), and leading-zero max cache size (`2026_AN_Q56`: `128 KB`).
- **Diagrams needed:** `ARRAY` (3 aligned bit-slice rulers for Direct, $K$-Way, Fully Assoc + `1` vs `K` hardware comparators); `MEMORY` (`0xA2C28` binary tape showing `176` expanding left across 3 zero bits `[16..6]`, `2026_AN_Q56`); `COMPARE` (Why Index sits in middle bits instead of top MSBs!).
- **Hand traces:** Solving `2026_AN_Q56` (`128 KB`), `2025_FN_Q36` (`6K bits`), `2021_AN_Q65` (`2`-way), `2020_FN_Q55` (`A2` & `A3` set `0x28`), and `2018_FN_Q44` (`P - N + \log_2 K`).
- **Common mistakes:** Putting Index at MSBs instead of middle bits; subtracting only `M` instead of `M + W` for word-block byte-addressable caches (`2018_FN_Q44`!); multiplying `Tag_bits` by `Num_Sets` instead of `Total_Lines` (`K × Num_Sets`) in set-associative metadata!

#### Lesson 04.2 · Cache Address Tracing, Conflict Misses (`3 C's`), Replacement & Write Policies
- **Tag:** `[MUST]` — High-yield MSQ/NAT unit (`2026_AN_Q52`, `2024_FN_Q41`, `2022_FN_Q24`, `2022_FN_Q54`, `2021_AN_Q39`, `2017_FN_Q53`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 04.1.
- **Beginner must-see:** Two memory words sitting inside the same 16-byte block ride into cache **together** (so `R` hits for free right after `P` misses! `2026_AN_Q52`), whereas two different blocks sharing the same Set kick each other out nonstop (**Conflict Miss**, `2017_FN_Q53`)! And when the CPU *writes*, **Write-Through** updates RAM immediately (never dirty!), while **Write-Back** scribbles a sticky note (**Dirty Bit = 1**) and delays writing RAM until eviction (`2024_FN_Q41`, `2022_FN_Q24`)!
- **Finer points:**
  - **Hex Address Tracing (`2026_AN_Q52`, `2022_FN_Q54`):** Splitting hex digits into `Tag | Index | Offset` (`16 B` = 1 hex digit; `64 B` = 6 bits), spotting spatial-locality hits (`P` & `R`, `P` & `S`) vs same-index thrashing (`P` vs `S`, `Q` vs `R`).
  - **The 3 C's of Misses & `2`-Way LRU Counting (`2017_FN_Q53`):** Compulsory (1st access ever -> `6` distinct blocks), Conflict (missed due to set mapping collisions -> `4 + 9×8 = 76`!), Capacity (cache too small even if fully associative).
  - **Write Policies (`2024_FN_Q41`, `2022_FN_Q24`, `2021_AN_Q39`):**
    - **Write-Back (`WB`):** Uses Dirty bit; write hit sets `Dirty = 1` (no immediate RAM write); **Read miss OR Write miss** evicting a dirty block writes it back to RAM (`2024_FN_Q41(A)`, `2022_FN_Q24(D)` trap!).
    - **Write-Through (`WT`):** NEVER has a dirty bit (`2022_FN_Q24(A)` false!); eviction NEVER writes back to RAM (`2024_FN_Q41(B)`, `2022_FN_Q24(C)`, `2021_AN_Q39(S1)`!).
    - **Write-Allocate (`WA`) vs No-Write-Allocate (`NWA`):** Standard pairings (`WB+WA`, `WT+NWA`) vs strict requirement (`2021_AN_Q39(S2)` false: either can pair with either!).
  - **Inclusive vs Exclusive Caches (`2021_AN_Q39`):** Inclusive (`L1 ⊆ L2`) back-invalidates `L1` on `L2` eviction; Exclusive maximizes total distinct cached blocks!
- **GATE-level items:** Repeating hex address loop traces (`2026_AN_Q52`, `2022_FN_Q54`), counting conflict vs compulsory misses (`2017_FN_Q53`: `76`), and `WT/WB × WA/NWA` MSQs (`2024_FN_Q41`, `2022_FN_Q24`, `2021_AN_Q39`).
- **Diagrams needed:** `TRACE` + `FRAMES` (Cache slot snapshots tracing `P,Q,R,S` loop `2026_AN_Q52` & `2022_FN_Q54`, and Set 0/1 `2`-way LRU `2017_FN_Q53`); `FLOW` (`WT vs WB` + `WA vs NWA` flowchart marking dirty-bit writes and evictions).
- **Hand traces:** Tracing all 40 accesses of `2026_AN_Q52` & `2022_FN_Q54`, and all 160 accesses of `2017_FN_Q53` (`4 + 9×8 = 76` conflict misses).
- **Common mistakes:** Thinking a *Read* miss in Write-Back can never evict a dirty block (`2024_FN_Q41(A)`, `2022_FN_Q24(D)`!); thinking Write-Through uses a Dirty bit (`2022_FN_Q24(A)`!); counting Compulsory misses (`6`) inside Conflict misses (`76`, `2017_FN_Q53`!).

#### Lesson 04.3 · Cache Performance: AMAT, Local vs Global `L2`, Split `I/D` CPI, Burst Penalty & `TLB + Cache`
- **Tag:** `[MUST]` — Guaranteed 2-mark NATs (`2026_FN_Q54`, `2025_FN_Q53`, `2025_AN_Q55`, `2024_FN_Q56`, `2022_FN_Q33`, `2020_FN_Q27`, `2019_FN_Q60`, `2017_FN_Q20`, `2017_AN_Q47`, `2017_AN_Q39`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 04.2, OS Ch 05/06 (TLB & Page Table).
- **Beginner must-see:** Having a 99% fast cache is useless if every miss takes 1000 cycles! **AMAT (Average Memory Access Time)** measures real speed by adding `Hit Time + (Miss Rate × Miss Penalty)` across L1, L2, and Main Memory — and in **Burst / Critical-Word-First** RAM, ONLY the *first* word pays the long setup wait while the rest stream 1 per cycle (`2020_FN_Q27`, `2019_FN_Q60`)!
- **Finer points:**
  - **1-Level & 2-Level AMAT Formulas (`2025_FN_Q53`, `2025_AN_Q55`, `2022_FN_Q33`, `2017_AN_Q47`, `2017_AN_Q39`):**
    - Hierarchical (`L2` accessed ONLY on `L1` miss): $\text{AMAT} = T_{L1} + m_{L1} \cdot (T_{L2} + m_{L2} \cdot T_{\text{MM}})$ (or simultaneous `h1*T1 + (1-h1)*h2*(...)` — explain `2020_FN_Q27` `13.3 vs 13.5` nuance cleanly!).
    - **Local vs Global Miss Rate (`2017_FN_Q20`):** `Local_L2 = L2_misses / L1_misses` (`7 / (1400 × 0.1) = 0.05`!), whereas `Global_L2 = L2_misses / Total_accesses = m_L1 × m_L2`.
  - **Split `I-Cache` + `D-Cache` CPI & Read AMAT (`2024_FN_Q56`, `2017_AN_Q39`):**
    - Per-instruction CPI (`2024_FN_Q56`): `CPI_total = CPI_ideal + 1.0 * m_I * Pen + f_mem * m_D * Pen`.
    - Per-read AMAT (`2017_AN_Q39`): `f_I * AMAT_I + f_D * AMAT_D`.
  - **Burst Transfer Miss Penalty & Max Bandwidth (`2020_FN_Q27`, `2019_FN_Q60`):**
    - `2020_FN_Q27`: `256 B / 8 B = 32` words -> `20 + 31 × 5 = 175 ns`!
    - `2019_FN_Q60`: `8` words (`32 B`) in `1 (addr) + 3 (fetch) + 8 (xfer) = 12` cycles at `60 MHz` -> `160 MB/s`!
  - **MMU (`TLB + Page Table`) + Physical Cache (`2026_FN_Q54`):** Invalidating cache on page eviction forbids `TLB hit + PT miss` and `PT miss + Cache hit`!
- **GATE-level items:** Multi-level AMAT (`2025_FN_Q53`, `2025_AN_Q55`, `2017_AN_Q39`), quadratic miss-rate solve (`2017_AN_Q47`), Local L2 miss rate (`2017_FN_Q20`: `0.05`), hit-latency tradeoff (`2022_FN_Q33`: `0.85`), split `I/D` CPI speedup (`2024_FN_Q56`: `3.00`), burst miss penalty (`2020_FN_Q27`: `13.3/13.5`), memory bandwidth (`2019_FN_Q60`: `160`), and `TLB + PT + Cache` impossible traces (`2026_FN_Q54`).
- **Diagrams needed:** `FLOW` (Hierarchical L1 -> L2 -> RAM miss-penalty waterfall + Split I/D CPI diagram); `TIMELINE` (Burst RAM 1st-word vs subsequent-words timing `2020_FN_Q27` & `2019_FN_Q60`); `MATRIX` (All 8 `(TLB, PT, Cache)` Hit/Miss outcomes highlighting the impossible cases, `2026_FN_Q54`).
- **Hand traces:** Solving `2025_AN_Q55` (`4.0 ns`), `2024_FN_Q56` (`3.00`), `2020_FN_Q27` (`13.5/13.3 ns`), `2019_FN_Q60` (`160 MB/s`), `2017_FN_Q20` (`0.05`), and `2017_AN_Q47` (`0.111, 0.056`).
- **Common mistakes:** Using Global L2 miss rate (`0.005`) instead of Local L2 miss rate (`0.05`) in `2017_FN_Q20`!; forgetting `1`st word takes `20 ns` leaving `N - 1 = 31` words at `5 ns` (`2020_FN_Q27`!); dividing by total cache bytes without converting `64-bit` word (`8 B`) in `2020_FN_Q27`!

---

### Chapter 05 · Main Memory and Interfacing

#### Lesson 05.1 · Memory Chip Interfacing, Interleaving, DRAM Refresh & Storage Scope
- **Tag:** `[SHOULD]` — Light direct bank weight (`2` Qs / `3` marks + `2023_FN_Q42` OS crossover), yet explicitly required by the syllabus (`Memory interfacing and hierarchy`) and `2018_FN_Q33`.
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 00.1, Digital Logic (decoders).
- **Beginner must-see:** You don't buy one magic 1 GB RAM chip — you wire 8 smaller `256M × 4-bit` DRAM chips side-by-side (`horizontal width`) and rows of chips below (`vertical depth`) using an **Address Decoder**! And unlike SRAM (flip-flops in Cache), **DRAM** stores bits in leaky tiny capacitors that fade every few milliseconds, forcing the memory controller to pause regular R/W to **Refresh** every row (`2018_FN_Q33`)!
- **Finer points:**
  - **SRAM vs DRAM:** Flip-flops (fast, no refresh, expensive -> Cache) vs Capacitors (slow, needs refresh, dense -> Main Memory).
  - **Memory Chip Expansion & Interfacing (`2018_FN_Q33`, OS-crossover `2023_FN_Q42`):**
    - Total chips = `(Target_Words / Chip_Words) × (Target_Width / Chip_Width)`.
    - Decoder selects Chip Select (`CS`) using High-Order bits (contiguous blocks), Low-Order bits (bank interleaving for burst bandwidth!), or Middle bits (`IA4, IA3`, `2023_FN_Q42`).
  - **DRAM Refresh Overhead (`2018_FN_Q33`):**
    - Refresh time per period = `Num_Rows × Time_per_row_refresh`.
    - Available R/W % = `(Refresh_Period - Total_Refresh_Time) / Refresh_Period × 100%` (`2018_FN_Q33`: `59.04%`!).
    - Burst vs Distributed Refresh intuition.
  - **Virtual Memory & Disk Scope Bridge:** Point cleanly to OS Ch 05/06 (Paging/TLB) and OS Ch 07 (Disk Geometry/Scheduling), keeping `VIPT` vs `PIPT` aliasing intuition here as `[LATER]`.
- **GATE-level items:** Computing R/W time percentage after DRAM refresh (`2018_FN_Q33`: `59.0–60.0%`), chip-select decoder base addresses (`2023_FN_Q42`), and counting RAM chips needed.
- **Diagrams needed:** `CIRCUIT` (`256M × 4-bit` chips arranged horizontally & vertically with `CS` decoder lines); `TIMELINE` (`2 ms` DRAM window split into `40.96%` Refresh vs `59.04%` R/W, `2018_FN_Q33`).
- **Hand traces:** Tracing `2018_FN_Q33` (`16384 × 50 ns = 0.8192 ms` out of `2 ms`), sizing chips for `1 GB × 32-bit` from `256M × 4-bit` (`8` chips!), and tracing `2023_FN_Q42` decoder (`0, 8, 16, 24`).
- **Common mistakes:** Multiplying refresh time by total chips instead of realizing all `8` chips in a bank refresh their row simultaneously in parallel (`2018_FN_Q33`!); forgetting `4-bit` vs `32-bit` width when sizing `256M × 4-bit` chips.

---

### Chapter 06 · I/O Interface: Interrupts and DMA

#### Lesson 06.1 · I/O Addressing, Polling vs Interrupts, Vectored Interrupts & Daisy Chaining
- **Tag:** `[MUST]` — Easy/Medium 1-mark goldmine (`2026_AN_Q18`, `2025_FN_Q11`, `2024_FN_Q33(C,D)`, `2023_FN_Q34`, `2020_FN_Q33(I,II,III)`, `2018_FN_Q19`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 00.1 (`PC, Stack, MHz`), OS Ch 00 (Interrupt/Mode switch link).
- **Beginner must-see:** How does a `3 GHz` CPU talk to a tiny slow keyboard typing 1 letter per second? Asking `"Did you press a key yet?"` every 10 ms (**Polling / Programmed I/O**) wastes thousands of CPU cycles checking empty air (`2023_FN_Q34`)! Letting the keyboard tap the CPU's shoulder ONLY when pressed (**Interrupts**) frees the CPU — and giving each device its own doorbell number (**Vectored Interrupt**) skips figuring out who knocked (`2026_AN_Q18`)!
- **Finer points:**
  - **Memory-Mapped I/O vs Isolated I/O:** Shared address space (`LOAD/STORE`) vs separate I/O space (`IN/OUT` instructions).
  - **Polling vs Interrupts (`2024_FN_Q33(C)`, `2023_FN_Q34`):** Interrupt-driven I/O has WAY higher CPU utilization than Programmed I/O (`2024_FN_Q33(C)` false!); compute exact polling rate × poll cost + event processing cost vs interrupt service cost (`2023_FN_Q34`: `10.2`!).
  - **Exact Hardware Interrupt Cycle (`2025_FN_Q11`, `2018_FN_Q19`):**
    1. Finish executing **current instruction** (`never stop mid-ADD!`).
    2. Save `PC` (and `PSW`/process status onto control stack).
    3. Load ISR address (via IVT vector or polling) -> Execute ISR -> Pop `PC & PSW` (`IRET`) and resume!
  - **Vectored vs Non-Vectored (`2026_AN_Q18(S1)`, `2020_FN_Q33(II)`):** Vectored supplies address/vector directly (faster ISR start, NO polling!). Non-vectored jumps to one common handler that must poll devices to find the caller.
  - **Daisy Chaining (`2026_AN_Q18(S2)`, `2020_FN_Q33(I)`):** Hardware serial `INTA` priority wiring — CPU does **NOT** poll devices individually (`2026_AN_Q18(S2)` is false!).
- **GATE-level items:** Exact interrupt step ordering (`2025_FN_Q11`, `2018_FN_Q19`), Daisy Chain & Vectored true/false statements (`2026_AN_Q18`, `2020_FN_Q33`), and Polling-vs-Interrupt CPU fraction ratio (`2023_FN_Q34`: `10.2`).
- **Diagrams needed:** `TIMELINE` (Polling spikes every 10 ms vs 1 Interrupt spike, `2023_FN_Q34`); `FRAMES` (5-step Interrupt Save-PC/ISR/Pop sequence, `2025_FN_Q11`, `2018_FN_Q19`); `CIRCUIT` (Daisy Chain `INT/INTA` priority wiring vs IVT vector lookup).
- **Hand traces:** Computing `2023_FN_Q34` (`10,200 us / 1,000 us = 10.2`); ordering `2025_FN_Q11` (`iii, i, ii`) and `2018_FN_Q19` (`Q, P, T, R, S`).
- **Common mistakes:** Multiplying keystroke processing (`200 us`) by `100` polls instead of `1` keystroke/sec in `2023_FN_Q34`!; thinking Daisy Chaining makes the CPU poll devices (`2026_AN_Q18(S2)`!) or Vectored Interrupts still poll (`2020_FN_Q33(II)`!); thinking an interrupt aborts the current instruction mid-cycle (`2025_FN_Q11`!).

#### Lesson 06.2 · Direct Memory Access (`DMA`): Modes, Bus Mastership & Cycle-Stealing Rates
- **Tag:** `[MUST]` — High-ROI guaranteed questions (`2024_AN_Q24`, `2024_FN_Q33(A,B)`, `2022_FN_Q17`, `2021_AN_Q11`, `2020_FN_Q33(IV)`).
- **Estimated reading time:** 50 minutes.
- **Prerequisites:** Lesson 06.1.
- **Beginner must-see:** Reading a 1 GB movie from disk using Interrupts would interrupt the CPU 250 million times — grinding your PC to a halt! **DMA (Direct Memory Access)** hires a mini assistant controller (`MAR, Count, Control`): the CPU tells DMA *"Move 4096 bytes from Disk to RAM 50000 and wake me when done!"*, and DMA moves all bytes directly over the system bus (`2022_FN_Q17`)!
- **Finer points:**
  - **DMA Controller Registers & Handshake (`BR` / `BG`):** Address Register, Word Count, Control/Status; **ONLY ONE Bus Master** (CPU OR DMA) can drive the bus at a time (`2020_FN_Q33(IV)` is FALSE!).
  - **3 DMA Modes (`2024_FN_Q33(A,B)`):**
    1. **Burst Mode:** DMA holds bus until entire block finishes -> **highest throughput** (`2024_FN_Q33(B)`), freezes CPU temporarily.
    2. **Cycle Stealing (`2024_AN_Q24`, `2021_AN_Q11`):** DMA steals 1 CPU bus cycle per word/chunk (`2024_FN_Q33(A)`) -> CPU slows slightly yet stays responsive!
    3. **Transparent / Hidden Mode:** DMA moves data ONLY during cycles when CPU doesn't need memory bus -> lowest throughput, zero CPU slowdown!
  - **Cycle-Stealing Data Rate Math (`2024_AN_Q24`, `2021_AN_Q11`):**
    $\text{Rate (bps)} = f_{\text{CPU}} \times \text{stolen\_fraction} \times \text{bytes\_per\_cycle} \times 8$ (`2024_AN_Q24`: $4\times 10^6 \times 0.01 \times 8 \times 8 = 2,560,000\text{ bps}$)!
- **GATE-level items:** Bulk I/O throughput ranking (`DMA > Interrupt > Polling`, `2022_FN_Q17`), Burst vs Cycle Stealing (`2024_FN_Q33`), single bus-master rule (`2020_FN_Q33(IV)`), and Cycle-Stealing transfer bps (`2024_AN_Q24`, `2021_AN_Q11`).
- **Diagrams needed:** `CIRCUIT` (`CPU <-> Bus Arbiter (BR/BG) <-> DMA Controller <-> RAM`); `TIMELINE` (CPU vs DMA bus control strips comparing Burst vs Cycle Stealing vs Transparent).
- **Hand traces:** Computing `2024_AN_Q24` (`2,560,000 bps`) and `2021_AN_Q11` (`80,000 bps`).
- **Common mistakes:** Forgetting `× 8` bits/byte when converting `"8 bytes in 1 cycle"` to `bits per second` (`2024_AN_Q24` gives `3,20,000` trap!); thinking both CPU and DMA act as bus masters simultaneously (`2020_FN_Q33(IV)`!); confusing Cycle Stealing throughput with Burst Mode (`2024_FN_Q33(B)`).

---

`CONTINUE FROM PART 6`
## PART 6. EVERY PYQ LISTED BELOW (Batch 1: Questions #1 to #36)

*(Re-solved and checked one by one. Missing figures and text typos are explicitly flagged.)*

| # | PYQ ID | (a) Ch / Lesson | (b) Exact Concept Tested | (c) Trap / Finer Point | (d) Official Key Check & Working | (e) Transcription Check |
|---|---|---|---|---|---|---|
| 1 | `2026_FN_Q14` | Ch 01 / L01.2 | Matching Addressing Modes to HLL / C constructs. | Immediate = Constant (`4`), Indirect = Pointer (`2`), Base+Index = Array (`1`), Base+Offset = Record/Struct field (`3`). | **CORRECT (B: P-4, Q-2, R-1, S-3).** | Clean. |
| 2 | `2026_FN_Q15` | Ch 01 / L01.1 | Translating `Z = X + Y` (`X, Y, Z` in RAM) onto a **Load-Store** ISA. | Load-Store forbids memory operands in `ADD` (`A, B, C` illegal!) — must `LOAD` both into registers, `ADD`, then `STORE`! | **CORRECT (D).** `LOAD R0,X` / `LOAD R1,Y` / `ADD R2,R0,R1` / `STORE Z,R2`. | Minor formatting: instructions in B–D run together on single line without line breaks. |
| 3 | `2026_FN_Q16` | Ch 03 / L03.2 | Register dependency causing data hazards in an in-order pipeline. | `RAR` (`A`) never hazards; `WAR` & `WAW` are false name dependencies; **`RAW` (`B`)** is the true data hazard! | **CORRECT (B: Read-after-write).** | Clean. |
| 4 | `2026_AN_Q18` | Ch 06 / L06.1 | Comparing non-vectored vs vectored interrupts (`S1`) and daisy-chaining (`S2`). | Non-vectored must identify source via polling before starting ISR (`S1` true); Daisy-chain resolves priority via hardware `INTA` wire, NOT CPU polling (`S2` false!). | **CORRECT (C: S1 true, S2 false).** | Clean. |
| 5 | `2026_FN_Q38` | Ch 04 / L04.1 | Tag width shift when changing Direct Mapped (`M`) to $K$-way Set Associative (`N`). | Going from 1-way to $K = 2^L$-way cuts `Index` by $L$ bits and adds $L$ bits to `Tag` -> `N = M + L`! | **CORRECT (A: `N = M + L`).** `Offset = 7`, `M = 32-23 = 9`, `N = 9 + L = M + L`. | **MIS-TRANSCRIPTION:** Prompt writes `K = 2^k` instead of `K = 2^L` (while `L \in {1,2,3}` and Option A use `L`!). |
| 6 | `2026_AN_Q44` | Ch 01 / L01.1 | Variable-length **Expanding Opcodes** (`16`-bit instr, `16` regs -> `4`-bit reg). | M-type uses `14` operand bits -> `2`-bit opcode (`2` of `4` used -> `2` left); R-type uses `12` op bits -> `4`-bit opcode (`2×4 = 8` slots, `7` used -> `1` left); C-type uses `10` op bits -> `6`-bit opcode (`1×4 = 4` slots)! | **CORRECT (B: 4).** | Clean. |
| 7 | `2026_AN_Q52` | Ch 04 / L04.2 | Direct-mapped cache (`4 KB`, `16 B` block) tracing `P, Q, R, S` loop 10 times. | `16 B` block = last 1 hex digit! `P (0x845B32)` and `R (0x845B36)` share block `0x845B3_`, while `S (0x846B32)` shares Index `0xB3` with `P` -> `S` and `P` evict each other every pass, while `R` ALWAYS hits right after `P`! | **CORRECT (A, B).** `Q` (`0xB2`) misses only on 1st pass (`C` false); `S` misses every pass (`D` false). | Clean. |
| 8 | `2026_FN_Q54` | Ch 04, 05 / L04.3, L05.1 | Impossible `(TLB, PT, Cache)` event sequences (`Physical` cache, invalidation on page evict). | If Page Table misses (`page not in RAM`), evicted page blocks were invalidated in cache -> Cache CANNOT hit (`C` impossible); TLB hit implies valid RAM page (`B` impossible)! | **CORRECT (B, C).** | Clean. |
| 9 | `2026_AN_Q56` | Ch 04 / L04.1 | Maximum possible DM cache size (`0xA2C28` -> block `176_{10}`). | `0xA2C28` = `1010 0010 1100 0010 1000`. `176 = 10110000` sits at `[13..6]`, AND bits `[16..14]` are `000` -> expanding `Index` to `[16..6]` (`11` bits) + `Offset [5..0]` (`6` bits) gives `2^{17} = 128 KB`! | **CORRECT (128).** Bit 17 is `1`, stopping further expansion. | Clean. |
| 10 | `2026_AN_Q57` | Ch 03 / L03.2 | Pipeline speedup accounting for BOTH clock slowdown (`1.6 -> 1.2 GHz`) and stalls. | Non-pipe = `5 / 1.6 = 3.125 ns`; Pipe = `(1 + 0.3×2) / 1.2 = 1.6 / 1.2 = 1.3333 ns`; Speedup = `3.125 / 1.3333 = 2.34375`. | **CORRECT (2.34, inside `2.30–2.40`).** | Clean. |
| 11 | `2026_FN_Q60` | Ch 03 / L03.1 | Structural hazard stall cycles in multi-cycle `EX` stage (`100` instructions). | Need table `[IMAGE_Q_60_1]` (`t_EX` and `M` counts) to verify exact sum of extra cycles. | **CANNOT VERIFY** (Key: 95). Table `[IMAGE_Q_60_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_60_1]`). |
| 12 | `2025_FN_Q11` | Ch 06 / L06.1 | Correct chronological order of hardware interrupt handling steps. | Never abort current instruction mid-way! Finish current instr (`iii`) -> Save `PC` (`i`) -> Load ISR address into `PC` (`ii`). | **CORRECT (A: `(iii), (i), (ii)`).** | Clean. |
| 13 | `2025_FN_Q27` | Ch 02 / L02.2 | Checking arithmetic operand modes supported by a given partial data path. | Need data path figure `[IMAGE_Q_27_1]` to inspect ALU input MUXes. | **CANNOT VERIFY** (Key: A, B, C). Figure `[IMAGE_Q_27_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_27_1]`). |
| 14 | `2025_AN_Q28` | Ch 00 / L00.1 | Distinguishing **ISA** from microarchitectural implementation parameters. | Cache size/levels & clock frequency are microarchitecture/implementation; architectural **number of registers** belongs to ISA! | **CORRECT (D).** | Clean. |
| 15 | `2025_AN_Q32` | Ch 02 / L02.1 | Counting total add + subtract ops in 16-bit Booth's multiplication. | Append trailing `0` to `Q = 1010 0100 1010 1010 [0]`; every `0->1` or `1->0` transition adds/subtracts = `13` transitions! | **CORRECT (13).** `7` subtractions + `6` additions = `13`. | Clean. |
| 16 | `2025_FN_Q36` | Ch 04 / L04.1 | Total bits to store all Tag values in `16 KB` DM cache (`20`-bit addr, `16 B` block). | Lines = `16 KB / 16 B = 1024` (`10` Index bits); Offset = `4` bits -> `Tag = 20 - 10 - 4 = 6` bits -> `1024 × 6 = 6 × 2^{10}` bits! | **CORRECT (A: `6 × 2^{10}`).** | Clean. |
| 17 | `2025_FN_Q37` | Ch 01 / L01.1 | Max immediate bits in `32`-bit `ADD R1, #25` (`64` regs, `50` instructions). | `64` regs -> `6` bits; `50` instructions -> `ceil(log_2 50) = 6` bits; Immediate = `32 - 6 - 6 = 20` bits! | **CORRECT (B: 20).** | Clean. |
| 18 | `2025_AN_Q39` | Ch 04 / L04.1 | Inferring Main Memory & DM Cache sizes from `4` Tag, `12` Index, `1 B` block. | Address = `4 + 12 + 0 = 16` bits (`2^{16} = 64 KB` main memory); Cache lines = `2^{12} × 1 B = 4 KB`! | **CORRECT (A: 64 KB and 4 KB).** | Clean. |
| 19 | `2025_FN_Q53` | Ch 04 / L04.3 | Two-level cache AMAT from hierarchy diagram. | Need hit rates & access times `[IMAGE_Q_53_1]`. | **CANNOT VERIFY** (Key: 11.83–11.87). Figure `[IMAGE_Q_53_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_53_1]`). |
| 20 | `2025_AN_Q55` | Ch 04 / L04.3 | Two-level AMAT with `"miss penalty"` phrasing (`L1=1 ns, h1=90%; L2->L1=10 ns, h2=80%; MM->L2=100 ns`). | Treat `L2->L1` transfer (`10 ns`) as `L2` access time on `L1` miss: `1 + 0.1 × (10 + 0.2 × 100) = 1 + 0.1(30) = 4.0 ns`! | **CORRECT (4.0).** | Clean. |
| 21 | `2025_AN_Q56` | Ch 03 / L03.1 | Total execution time for 1000 instructions in 5-stage pipeline (`10 ns` latch delay). | `T_cycle = max(180,250,150,170,250) + 10 = 260 ns`. Total = `(5 + 1000 - 1) × 260 ns = 261,040 ns = 261.04 us`. | **CORRECT (261.04, inside `260.20–261.20`).** | Clean. |
| 22 | `2025_AN_Q61` | Ch 03 / L03.1, L03.2 | Computing pipeline clock cycle duration (`ns`) from instruction mix CPI table. | Need instruction table `[IMAGE_Q_61_1]` to compute total clock cycles for `6.4 × 10^8` instructions. | **CANNOT VERIFY** (Key: 3.0). Table `[IMAGE_Q_61_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_61_1]`). |
| 23 | `2024_AN_Q24` | Ch 06 / L06.2 | Cycle-stealing DMA bit rate (`4 MHz`, `1%` stolen, `8 B/cycle`). | Remember `bytes -> bits (× 8)`! `4×10^6 × 0.01 × 8 B × 8 bits = 2,560,000 bps`! | **CORRECT (C: 25,60,000).** | Clean. |
| 24 | `2024_FN_Q33` | Ch 06 / L06.1, L06.2 | Comparing DMA modes, vectored interrupts, and Programmed vs Interrupt I/O (asking **FALSE**!). | Watch `"FALSE"`! Programmed I/O (polling) wastes CPU busy-waiting — WORSE CPU utilization than Interrupt I/O (`C` false!). | **CORRECT (C).** | Clean. |
| 25 | `2024_FN_Q22` | Ch 03 / L03.2 | Properties of Operand Forwarding in a 5-stage pipeline (`IF, ID, EX, MEM, WB`). | Forwarding needs extra bypass wires & MUXes (`D` false!), and STILL cannot avoid the 1-cycle `Load-Use` stall (`C` true!). | **CORRECT (A, B, C).** | Clean. |
| 26 | `2024_AN_Q25` | Ch 03 / L03.2 | Identifying `RAW`, `WAR`, `WAW` dependencies on `R3` across `I1..I4`. | Check destination-first format carefully! `I1` writes `R3`, `I2` reads `R3` (**RAW `A`**); `I2` doesn't touch `R3` (`B, C` false); `I4` writes `R7`, reads `R3` (`D` is RAW, not WAW!). | **CORRECT (A).** | Clean. |
| 27 | `2024_FN_Q41` | Ch 04 / L04.2 | Behaviour of Write-Back (`WBC`) vs Write-Through (`WTC`) LRU caches. | Read miss in `WBC` CAN evict a dirty block (`A` false); Write miss in `WTC` NEVER writes victim back to RAM (`D` false); Write hit in `WBC` sets dirty bit (`C` true) and `WTC` read miss never writes back (`B` true). | **CORRECT (B, C).** | Clean. |
| 28 | `2024_FN_Q55` | Ch 03 / L03.2 | Optimizing number of cores under Amdahl's Law + `10 ns` per-extra-core overhead. | `T(N) = 10 + 90/N + 10(N - 1)`: `T(1)=100, T(2)=65, T(3)=60, T(4)=62.5` -> min at `N = 3`! | **CORRECT (3).** | Clean. |
| 29 | `2024_FN_Q56` | Ch 04 / L04.3 | Speedup of perfect cache over split `I-Cache (2% miss)` + `D-Cache (8% miss, 25% ld/st)`. | `CPI_actual = 2 + 1.0*(0.02*100) + 0.25*(0.08*100) = 2 + 2 + 2 = 6`. Speedup = `6 / 2 = 3.00`! | **CORRECT (3.00).** | Clean. |
| 30 | `2024_AN_Q49` | Ch 01 / L01.1 | Max opcodes per mode in `32`-bit fixed format (`16` regs, `8` modes, `2` regs, `16`-bit scalar). | `3` mode bits + `2×4` reg bits + `16` scalar = `27` bits -> `5` opcode bits -> $2^5 = 32$ opcodes! | **CORRECT (32).** | Clean. |
| 31 | `2024_AN_Q56` | Ch 03 / L03.2 | Pipeline speedup (`6` non-pipe CPI -> `5`-stage at same `2 GHz` with data & control stalls). | `CPI_pipe = 1 + 0.2×2 + 0.2×3 = 2.0`. Speedup = `6 / 2 = 3.0`. | **CORRECT (3.0, inside `2.9–3.1`).** | Clean. |
| 32 | `2024_AN_Q43` | Ch 01 / L01.1 | Computing `X + 2Y + Z` for `32`-bit `R/I-type` formats (`150` instrs, `50` regs). | Need format diagrams `[IMAGE_Q_43_1..2]` to verify number of register fields in R-type & I-type! (`150` instrs split equally `75/75` -> `7` op bits + `1` type bit = `8 = Y`!). | **CANNOT VERIFY** (Key: 34). Format diagrams `[IMAGE_Q_43_1..2]` are missing. | **MISSING FIGURES** (`[IMAGE_Q_43_1..2]`). |
| 33 | `2023_FN_Q33` | Ch 03 / L03.1 | Total execution time of 100 instructions in hazard-free 3-stage pipeline (`10, 20, 14 ns`). | `T_cycle = max = 20 ns`. `(3 + 100 - 1) × 20 = 102 × 20 = 2040 ns`. | **CORRECT (2040).** | Clean. |
| 34 | `2023_FN_Q34` | Ch 06 / L06.1 | Comparing CPU time fraction of `10 ms` Polling (`T1`) vs Interrupt-driven (`T2`). | `1` keystroke/s -> `100` polls/s (`100×100 us = 10,000 us`) + `1` key process (`200 us`) = `10,200 us`; Interrupt = `1000 us` -> `10.2`! | **CORRECT (10.2).** | Clean. |
| 35 | `2023_FN_Q41` | Ch 01 / L01.2 | Filling operands in byte-addressed 32-bit `int` array assembly (`a[i] = b[i] * 8`). | `× 8` is `shl 3` (`U1 = 3`), 32-bit `int` stride is `+4` bytes (`U2 = U3 = 4`), loop jumps back to `L01` check (`U4 = L01`)! | **CORRECT (B: `(3, 4, 4, L01)`).** | Clean. |
| 36 | `2023_FN_Q64` | Ch 04 / L04.1 | Tag bits in `8`-way set associative `64 KB` cache (`32`-bit address), block size ungiven! | You DON'T need block size! `Index + Offset = log_2(Cache_Size / K) = log_2(64 KB / 8) = log_2(8 KB) = 13` bits -> `Tag = 32 - 13 = 19` bits! | **CORRECT (19).** | Clean. |

---

`CONTINUE FROM PART 6 (PYQ #37)`

## PART 6 (Continued) · Batch 2: Questions #37 to #72

| # | PYQ ID | (a) Ch / Lesson | (b) Exact Concept Tested | (c) Trap / Finer Point | (d) Official Key Check & Working | (e) Transcription Check |
|---|---|---|---|---|---|---|
| 37 | `2022_FN_Q17` | Ch 06 / L06.2 | Comparing bulk disk-to-RAM throughput across I/O methods. | DMA transfers full blocks directly over bus without per-byte CPU interrupts -> highest throughput (`A`). | **CORRECT (A: DMA based I/O).** | Clean. |
| 38 | `2022_FN_Q24` | Ch 04 / L04.2 | Write-Back (`WB`) vs Write-Through (`WT`) LRU cache behaviours (asking **FALSE**!). | Watch `"FALSE"`! WT needs no dirty bit (`A` false); WB write-hit does NOT write RAM (`B` false); WB read miss CAN evict a dirty victim (`D` false); `C` is true. | **CORRECT (A, B, D).** | Clean. |
| 39 | `2022_FN_Q33` | Ch 04 / L04.3 | Minimum hit rate `h` compensating for slower hit latency (`10 -> 15 ns`). | Baseline AMAT = `10 + 0.2 × 100 = 30 ns`. Need `15 + (1 - h) × 100 <= 30 => 1 - h <= 0.15 => h >= 0.85`! | **CORRECT (0.85).** | Clean. |
| 40 | `2022_FN_Q54` | Ch 04 / L04.2 | Hex trace of `P, Q, R, S` (`10` rounds) on `2 KB`, `64 B`-block DM cache. | `64 B` block = bits `5..0`; `Index` = bits `10..6`. `P (0xA248)` and `S (0xA262)` lie in SAME Set `9`, Tag `20` (same block!), while `Q (0xC28A)` and `R (0xCA8A)` share Set `10` with DIFFERENT tags (`24` vs `25`)! | **CORRECT (A, B, D).** `P` brings `S` in -> `S` hits every time & `P` stays resident; `Q, R` evict each other; `C` false because `P/S` block also resides. | Clean. |
| 41 | `2022_FN_Q61` | Ch 03 / L03.2 | Pipeline speedup from adding an 80%-accurate Branch Predictor (`30%` branches, `2`-cycle stall). | `CPI(X1) = 1 + 0.3×2 = 1.6`. `CPI(X2) = 1 + 0.3×(1 - 0.8)×2 = 1.12`. Speedup = `1.6 / 1.12 = 1.4286`. | **CORRECT (1.43, inside `1.42–1.45`).** | Clean. |
| 42 | `2021_AN_Q65` | Ch 04 / L04.1 | Finding set-associativity `K` given `2 KB` cache, `64 B` block, `32`-bit addr, `22`-bit Tag. | `Index + Offset = 32 - 22 = 10` bits -> `Index = 10 - 6 = 4` bits (`16` sets). Total blocks = `2048 / 64 = 32` -> `K = 32 / 16 = 2`! | **CORRECT (2).** | Clean. |
| 43 | `2021_AN_Q11` | Ch 06 / L06.2 | Cycle-stealing DMA transfer rate (`2 MHz`, `0.5%` cycles, `8`-bit char/cycle). | `2×10^6 × 0.005 × 8 = 80,000 bps`. | **CORRECT (80000).** | Clean. |
| 44 | `2021_FN_Q51` | Ch 04 / L04.1 | Tag width in `32 KB` DM cache (`2^{32}` PA, `64 B` block). | For DM cache, `Index + Offset = log_2(32 KB) = 15` bits -> `Tag = 32 - 15 = 17` bits! | **CORRECT (17).** | Clean. |
| 45 | `2021_AN_Q39` | Ch 04 / L04.2 | Write-Through & Write-Back pairings (`WA` vs `NWA`) in inclusive L1/L2 caches. | WT has no dirty lines (`S1` true); `S2` swaps usual practice AND falsely says "must" (`WT+WA` & `WB+NWA` aren't forbidden — `S2` false!). | **CORRECT (A: S1 true, S2 false).** | Clean. |
| 46 | `2021_AN_Q58` | Ch 00 / L00.1 | 2-byte unsigned integer where `Little Endian = Big Endian + 255`. | For `0x[MSB][LSB]`, Little - Big = `255 × (MSB - LSB) = 255 => MSB = LSB + 1`! Holds for `0x6665` (`66-65 = 1`) and `0x0100` (`01-00 = 1`), NOT `0x0001` or `0x4243` (`-1`). | **CORRECT (A, D).** | Clean. |
| 47 | `2021_FN_Q41` | Ch 03 / L03.1 | Total execution time of 100 instructions in 5-stage pipeline (`5 ns` register delay). | `T_cycle = max(150,120,150,160,140) + 5 = 165 ns`. `(5 + 100 - 1) × 165 = 104 × 165 = 17160 ns`. | **CORRECT (17160).** | Clean. |
| 48 | `2021_AN_Q59` | Ch 03 / L03.2 | Forwarding speedup on alternating dependent `ADD (1-cyc EX)` & `MUL (2-cyc EX)` (reg read in `EX`!). | Because reg read happens in `EX`, **with forwarding** takes `16` cycles (only `1` stall per 2-cycle `MUL`!), while **without forwarding** waits for `WB` taking `30` cycles -> `30 / 16 = 1.875`! | **CORRECT (1.875, inside `1.87–1.88`).** | Clean. |
| 49 | `2021_FN_Q38` | Ch 01 / L01.2 | Tracing byte-addressed assembly sequence modifying memory near `3000..3010`. | Need assembly listing `[IMAGE_Q_38_1]`. | **CANNOT VERIFY** (Key: 50). Code image `[IMAGE_Q_38_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_38_1]`). |
| 50 | `2020_FN_Q33` | Ch 06 / L06.1, L06.2 | I/O mechanisms: Daisy chaining, Vectored polling myth, Polling, and Simultaneous DMA bus masters. | Vectored interrupts don't poll (`II` false!); only ONE master owns system bus at a time (`IV` false!). | **CORRECT (C: I and III only).** | Clean. |
| 51 | `2020_FN_Q30` | Ch 02 / L02.2 | Ordering single-bus fetch & execute micro-operations for `R0 <- R1 + R2`. | Fetch (`3: PC->MAR, MEM_r` then `5: MDR->IR`), then Execute (`2: R1->TEMP1`, `1: R2+TEMP1->TEMP2`, `4: TEMP2->R0`) -> `3, 5, 2, 1, 4`! (Solvable from text even though `[IMAGE_Q_30]` is missing!). | **CORRECT (C: `3, 5, 2, 1, 4`).** | **MISSING FIGURE** (`[IMAGE_Q_30]`, solvable from text). |
| 52 | `2020_FN_Q27` | Ch 04 / L04.3 | Cache AMAT with Burst transfer (`20 ns` 1st word + `5 ns` per remaining `31` words). | `256 B / 8 B = 32` words/block -> `Miss Penalty = 20 + 31×5 = 175 ns`. Sequential `3 + 0.06×175 = 13.5 ns` (or simultaneous `0.94×3 + 0.06×175 = 13.32 ns`). | **CORRECT (`13.3` or `13.5`).** | Clean (explain dual AMAT timing conventions!). |
| 53 | `2020_FN_Q55` | Ch 04 / L04.1 | Comparing set indices of 4 hex addresses in `64 KB`, `4`-way cache (`256 B` block). | `16 KB` per way (`14` bits `Index + Offset`), `256 B` block (`8` Offset bits = last 2 hex digits) -> `Index = bits [13..8]` (`middle byte & 0x3F`): `A1, A4` -> `0x08`; **`A2, A3` -> `0x28`**! | **CORRECT (B: A2 and A3 same set).** | Clean. |
| 54 | `2020_FN_Q43` | Ch 03 / L03.2 | Pipeline speedup (`2.5 GHz, 5 CPI` -> `2.0 GHz` 5-stage with memory cache misses & branch stalls). | `T_old = 5 / 2.5 = 2.0 ns`. `CPI_pipe = 1 + 0.3×0.05×50 + 0.1×0.5×2 = 1.85` -> `T_new = 1.85 / 2.0 = 0.925 ns`. Speedup = `2.0 / 0.925 = 2.162`. | **CORRECT (2.16, inside `2.15–2.18`).** | Clean. |
| 55 | `2020_FN_Q63` | Ch 01 / L01.1 | Expanding opcodes (`16`-bit, `64` regs -> `6` bits, `8` I-type opcodes -> max R-type opcodes). | I-type uses `6+4 = 10` op bits (`6`-bit opcode, `64` total slots -> `8` used = `56` left). R-type uses `12` op bits (`4`-bit opcode): `56 / 4 = 14` R-type opcodes! | **CORRECT (14).** | Clean. |
| 56 | `2019_FN_Q11` | Ch 04 / L04.1 | Tag and Index bits for a **Fully Associative** `16 KB` cache (`16 B` block, `32`-bit addr). | Fully Associative has `1` set -> **`Index = 0` bits**, `Offset = 4`, `Tag = 32 - 4 = 28` bits! | **CORRECT (D: 28 bits and 0 bits).** | Clean. |
| 57 | `2019_FN_Q60` | Ch 04 / L04.3 | Peak main-memory read bandwidth during cache miss (`8` words × `4 B`, `60 MHz`, `1 + 3 + 8` cycles). | Each `32 B` block takes `1 + 3 + 8 = 12` cycles -> `32 / (12 / 60×10^6) = 160 × 10^6 B/s`. | **CORRECT (160).** | Clean. |
| 58 | `2018_FN_Q15` | Ch 02 / L02.2 | Identifying core **RISC** processor traits. | Register-to-register ALU, fixed-length instruction format, and hardwired control unit are all classic RISC traits! | **CORRECT (D: I, II and III).** | Clean. |
| 59 | `2018_FN_Q19` | Ch 06 / L06.1 | Exact sequence of 5 events during interrupt handling (`Q -> P -> T -> R -> S`). | Finish current instruction (`Q`), push `L` status onto stack (`P`), load ISR address into PC (`T`), run ISR (`R`), pop `L` status (`S`). | **CORRECT (A: QPTRS).** | Clean. |
| 60 | `2018_FN_Q33` | Ch 05 / L05.1 | Percentage of DRAM time available for R/W after row refreshes (`2^{14}` rows, `50 ns`, `2 ms`). | Refresh time = `16384 × 50 ns = 819,200 ns` out of `2,000,000 ns` -> `(2,000,000 - 819,200)/2,000,000 = 59.04%`. (All `8` chips refresh rows in parallel!). | **CORRECT (59.04, inside `59.0–60.0`).** | Clean. |
| 61 | `2018_FN_Q44` | Ch 04 / L04.1 | Symbolic Tag width (`2^P` PA, `2^W` word, `2^N` cache bytes, `2^M` words/block, `K`-way). | `Index + Offset = log_2(Cache_bytes / K) = N - log_2 K` (independent of `M, W`!) -> `Tag = P - N + log_2 K`! | **CORRECT (B: `P - N + \log_2 K`).** | Clean. |
| 62 | `2018_FN_Q60` | Ch 03 / L03.1 | Cycles for 100 instructions when unpipelined `PO` stage takes `1, 2, or 3` cycles. | Ideal 5-stage = `5 + 100 - 1 = 104` cycles; extra `PO` stalls = `40×(3-1) + 35×(2-1) = 80 + 35 = 115` -> `104 + 115 = 219`! | **CORRECT (219).** | Clean. |
| 63 | `2018_FN_Q61` | Ch 01 / L01.1 | Expanding opcodes with mixed `4`-bit (`16` int regs) & `6`-bit (`64` FP regs) operands. | `T1 (3R=12 op, 4 used of 16)`, `T2 (2F=12 op, 8 used)` -> `4` 4-bit prefixes left = `16` 6-bit slots for `T3 (1R+1F=10 op, 14 used)` -> `2` 6-bit prefixes left = `2 × 16 = 32` slots for `T4 (1F=6 op)`! | **CORRECT (32).** | Clean. |
| 64 | `2017_FN_Q27` | Ch 01 / L01.2 | Best addressing mode for accessing `student.grade` struct field (`R1` = base addr). | `grade` sits at fixed constant byte offset (`400`) from `R1` -> Indexed/Displacement `X(R1)`! | **CORRECT (D).** | Clean. |
| 65 | `2017_FN_Q20` | Ch 04 / L04.3 | Computing **local** `L2` miss rate from `1.4` accesses/instr, `MR1 = 0.1`, `7` `L2` misses / `1000` instrs. | `L1` misses = `1.4 × 0.1 = 0.14` per instr; `L2` misses = `0.007` per instr -> `Local MR2 = 0.007 / 0.14 = 0.05`! | **CORRECT (0.05).** | Clean. |
| 66 | `2017_AN_Q47` | Ch 04 / L04.3 | Solving for `MR1` and `MR2` given `MR1 = 2·MR2` and `AMAT = 2`. | `1 + 2r(8 + 18r) = 2 => 36r^2 + 16r - 1 = 0 => r = 1/18 = 0.056, 2r = 1/9 = 0.111`. | **CORRECT (A: `0.111 and 0.056`).** | Clean. |
| 67 | `2017_AN_Q39` | Ch 04 / L04.3 | Weighted read AMAT (`60%` I-fetch, `40%` D-fetch) across cache hierarchy table. | Need cache table `[IMAGE_Q_39]` to compute `0.6·AMAT_I + 0.4·AMAT_D`. | **CANNOT VERIFY** (Key: 4.72). Table `[IMAGE_Q_39]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_39]`). |
| 68 | `2017_FN_Q60` | Ch 01 / L01.2 | Signed byte offset for PC-relative branch (`4`-byte instrs, relative to **Next PC**). | Need instruction sequence `[IMAGE_Q_60]` to confirm exact distance (`-16` = 4 instructions back from `Next_PC`). | **CANNOT VERIFY** (Key: -16.0). Listing `[IMAGE_Q_60]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_60]`). |
| 69 | `2017_FN_Q49` | Ch 03 / L03.1 | Speedup after splitting bottleneck `20 ns` `OF` stage into `12 ns + 8 ns` (`2 ns` latch). | `NP`: `5` stages, `T=22 ns`, `20` instrs = `24 × 22 = 528 ns`. `EP`: `6` stages, `T=14 ns`, `20` instrs = `25 × 14 = 350 ns`. Speedup = `528 / 350 = 1.5086`. | **CORRECT (1.51, inside `1.49–1.52`).** | Clean. |
| 70 | `2017_FN_Q53` | Ch 04 / L04.2 | Counting **Conflict Misses** (excluding Compulsory!) in `2`-way LRU `256`-block cache (`10` loops). | `128` sets: `{0,128,256}` hit Set `0`; `{1,129,257}` hit Set `1`. Pass 1 = `6` compulsory + `4` conflict; Passes 2..10 = `8` conflict each -> `4 + 72 = 76`! | **CORRECT (76.0).** | Clean. |
| 71 | `2017_AN_Q36` | Ch 04 / L04.1 | Tag width for `512`-line DM cache (`2^{32}` byte PA, `32 B` block). | `Offset = 5`, `Index = 9` -> `Tag = 32 - 9 - 5 = 18` bits! | **CORRECT (18.0).** | Clean. |
| 72 | `2017_FN_Q65` | Ch 04 / L04.1 | New Tag width when DM cache (`10`-bit Tag) changes to `16`-way set-associative. | `16 = 2^4` shrinks Index by `4` bits -> `Tag = 10 + 4 = 14` bits! | **CORRECT (14.0).** | Clean. |

---

## PART 7. MORE QUESTIONS NEEDED (3 New Ideas Per Lesson)

### Chapter 00 · Hardware Math, Clocks, Endianness & CPU Anatomy
- **Lesson 00.1 (`Clocks, Powers, Addressability, Endianness & ISA`):**
  1. A 32-bit signed integer `0x12345678` is stored at byte address `1000` on a Little-Endian CPU; what single byte sits at address `1001`? (`MCQ`).
  2. Convert a `16 MB` word-addressable RAM (`word = 4 bytes`) into total address lines needed vs byte-addressable RAM (`NAT`).
  3. Identify which items among `{Register count, Endianness, Branch predictor type, Instruction length, Cache associativity}` belong to the ISA (`MSQ`).

### Chapter 01 · Machine Instructions and Addressing Modes
- **Lesson 01.1 (`Instruction Formats & Expanding Opcodes`):**
  1. Translate `X = (A + B) * (C - D)` onto a 0-address Stack ISA vs a 1-address Accumulator ISA and count instructions (`NAT`).
  2. A 16-bit CPU has `8` registers (`3` bits): `4` 2-register instructions, `30` 1-register instructions, and `N` 0-register instructions — find maximum `N` (`NAT`).
  3. Given 32-bit instructions with `128` opcodes, `32` registers, and 2 register operands + 1 immediate field, find maximum signed 2's complement immediate value (`NAT`).
- **Lesson 01.2 (`Addressing Modes, PC-Relative & Assembly Loops`):**
  1. Compare total main-memory accesses (including instruction fetch!) to execute `ADD R1, (R2)` (Register Indirect) vs `ADD R1, @(2000)` (Memory Indirect) (`NAT`).
  2. A 2-byte `BNE` branch instruction sits at `0x1040` and branches to `0x1028`: compute its PC-relative byte offset in signed decimal (`NAT`).
  3. Match `Pre-decrement -(SP)`, `Post-increment (R1)+`, `PC-relative`, and `Base+Index` to Stack Push, Array Traversal, Position-Independent Code, and `a[i]` (`MCQ`).

### Chapter 02 · ALU, Data Path and Control Unit
- **Lesson 02.1 (`Adders, Overflow & Booth's Algorithm`):**
  1. Compute total gate delays to produce Carry-Out $C_4$ in a 4-bit Ripple-Carry Adder vs 4-bit Carry-Lookahead Adder (assuming `2`-input AND/OR/XOR = 1 gate delay each) (`NAT`).
  2. Given 8-bit 2's complement multiplier `Q = 1111 0000`, count additions and subtractions in Booth's vs naive shift-and-add (`NAT`).
  3. Identify which 4-bit 2's complement additions set the Signed Overflow flag (`V = 1`) vs Unsigned Carry flag (`C = 1`) (`MSQ`).
- **Lesson 02.2 (`Single-Bus Data Path, Control Units & RISC/CISC`):**
  1. A microprogrammed control unit needs `48` control signals split into 4 mutually exclusive groups of `15, 7, 16, 10` signals plus 16-bit next-address field: compute ROM width under Horizontal vs Vertical encoding (`NAT`).
  2. Trace the exact micro-operation sequence for `LOAD R1, (R2)` (Register Indirect) on a single-bus data path (`MCQ`).
  3. Which properties distinguish Hardwired Control from Microprogrammed Control on speed, flexibility, and silicon area (`MSQ`)?

### Chapter 03 · Instruction Pipelining and Hazards
- **Lesson 03.1 (`Pipeline Timing, Latches & Structural Hazards`):**
  1. An unpipelined CPU runs at `40 ns` (`sum` of 5 stages: `5, 10, 12, 8, 5`). With `2 ns` latch overhead, compute asymptotic speedup as $N \to \infty$ (`NAT`).
  2. A unified single-port cache causes a Structural Hazard whenever `MEM` and `IF` collide: trace `10` instructions with `4` `LOAD/STORE`s and count total stalls (`NAT`).
  3. Compare splitting one `24 ns` `EX` stage into two `12 ns` stages (`2 ns` latch) for executing `5` instructions vs `500` instructions (`MSQ`).
- **Lesson 03.2 (`Data/Control Hazards, Forwarding, Speedup & Amdahl's Law`):**
  1. Count minimum stall cycles with full `EX/MEM` forwarding for: `LW R1, 0(R2); ADD R3, R1, R4; SUB R5, R3, R6; SW R5, 4(R2)` (`NAT`).
  2. Given 4 instructions `I1..I4` executed out-of-order, identify all `RAW`, `WAR`, and `WAW` pairs (`MSQ`).
  3. Using Amdahl's Law, if `80%` of a program can be parallelized across `4` cores (zero overhead), find overall speedup (`NAT`).

### Chapter 04 · Cache Memory
- **Lesson 04.1 (`Cache Mapping, Bit-Slicing & Tag Storage`):**
  1. A `128 KB` 4-way set-associative cache (`64 B` block, `32`-bit PA) also stores `1` Valid bit, `1` Dirty bit, and `2` LRU bits per line: compute total Tag Directory size in KB (`NAT`).
  2. Given a `4 GB` word-addressable memory (`word = 4 B`) and `64 KB` (`16K` words) 2-way cache with `8`-word blocks, find Tag, Set, and Offset bit widths (`MCQ`).
  3. Why can a 2-way set-associative cache hold `0x0000` and `0x1000` simultaneously while a Direct-Mapped cache of the same size cannot (`MCQ`)?
- **Lesson 04.2 (`Cache Tracing, 3 C's & Write Policies`):**
  1. Trace block sequence `0, 4, 8, 0, 4, 8` in a `4`-block Direct-Mapped vs `2`-way LRU vs Fully Associative FIFO cache and count hits (`NAT`).
  2. Explain what extra cache traffic occurs on a **Write Miss** under `WB + WA` vs `WT + NWA` (`MSQ`).
  3. Given an inclusive L1/L2 hierarchy, when L2 evicts a block `B` that is dirty inside L1, what two actions MUST occur (`MCQ`)?
- **Lesson 04.3 (`AMAT, Split I/D, Burst Penalty & TLB+Cache`):**
  1. An L1 cache (`1 ns`, `10%` local miss) feeds L2 (`8 ns`, `20%` **global** miss rate? Wait — keep crystal clear: `2%` global L2 miss rate -> `20%` local!), and RAM (`50 ns`): compute AMAT (`NAT`).
  2. Using a `4-word` burst (`15 ns` 1st word, `3 ns` subsequent words), find miss penalty for a `64 B` block with `4 B` words (`NAT`).
  3. Contrast `PIPT` vs `VIPT` caches when cache size is `32 KB` (`4`-way) and OS page size is `4 KB`: does aliasing occur (`MCQ`)?

### Chapter 05 · Main Memory and Interfacing
- **Lesson 05.1 (`Chip Grids, Decoders, Interleaving & DRAM Refresh`):**
  1. How many `64M × 8-bit` DRAM chips are needed to build a `512 MB`, `32-bit`-wide memory unit (`NAT`)?
  2. In a `4`-way Low-Order Interleaved memory (`4` banks, `1` word per bank), which 2 address bits select the bank (`MCQ`)?
  3. Compute the maximum continuous freeze duration if a `4096`-row DRAM (`40 ns` row refresh) uses **Burst Refresh** instead of Distributed Refresh (`NAT`).

### Chapter 06 · I/O Interface: Interrupts and DMA
- **Lesson 06.1 (`I/O Modes, Polling vs Interrupts, Vectored & Daisy Chaining`):**
  1. A `100 MHz` CPU takes `250` cycles per poll; at what polling frequency (polls/sec) does polling consume `50%` of the CPU (`NAT`)?
  2. Compare Memory-Mapped I/O vs Isolated I/O on address-space consumption and instruction set complexity (`MSQ`).
  3. In a Daisy Chain `D1 -> D2 -> D3` (where `D1` is closest to CPU), if `D1` and `D3` raise `INT` together, which device receives `INTA` and supplies its vector (`MCQ`)?
- **Lesson 06.2 (`DMA: Modes, Bus Mastership & Cycle-Stealing`):**
  1. A `10 MHz` CPU transfers `4 MB` from disk via Cycle-Stealing DMA (`4 B/cycle`, stealing `20%` of cycles): how many seconds does the transfer take (`NAT`)?
  2. Contrast Burst DMA, Cycle-Stealing DMA, and Transparent DMA on CPU wait time vs I/O completion time (`MSQ`).
  3. Which registers inside a DMA controller must the CPU program BEFORE starting a transfer (`MSQ`)?

---

## PART 8. WHAT IS MISSING FROM THE SUBJECT

Looking across the verbatim GATE 2027 CS COA syllabus (`Part B.1`), `Part C` (72 PYQs), Patterson–Hennessy, Hamacher, Made Easy, and GateWallah, these critical topics are omitted from `Part B.2`'s 6-chapter outline:

1. **Chapter 00: Hardware Math, Clocks (`Hz <-> ns`), Powers of 2, Byte vs Word Addressing, Endianness (`2021_AN_Q58`) & ISA vs Microarchitecture (`2025_AN_Q28`).**
2. **Instruction Encoding & Expanding Opcodes (`2026_AN_Q44`, `2025_FN_Q37`, `2024_AN_Q49`, `2024_AN_Q43`, `2020_FN_Q63`, `2018_FN_Q61`) + Load-Store ISA (`2026_FN_Q15`) + Addressing Modes mapped to C (`2026_FN_Q14`, `2017_FN_Q27`) + PC-Relative Next-PC offset (`2017_FN_Q60`) + Byte-addressed Assembly tracing (`2023_FN_Q41`, `2021_FN_Q38`).**
3. **ALU & Control Design Depth:** Carry-Lookahead Adders, Signed Overflow (`V`), **Booth's Algorithm & bit-transition shortcut (`2025_AN_Q32`)**, Single-Bus Data Path micro-operations (`2025_FN_Q27`, `2020_FN_Q30`), **Hardwired vs Horizontal/Vertical Microprogrammed Control**, and RISC vs CISC (`2018_FN_Q15`).
4. **Pipelining Depth:** Stage max + latch formulas (`2025_AN_Q56`, `2021_FN_Q41`, `2017_FN_Q49`), **Multi-cycle `EX/PO` structural stalls (`2026_FN_Q60`, `2018_FN_Q60`)**, `RAW/WAR/WAW` (`2026_FN_Q16`, `2024_AN_Q25`), **Forwarding & Load-Use 1-cycle stalls (`2024_FN_Q22`, `2021_AN_Q59`)**, Branch Prediction (`2022_FN_Q61`), Clock-adjusted Speedup (`2026_AN_Q57`, `2020_FN_Q43`), and **Amdahl's Law (`2024_FN_Q55`)**.
5. **Cache Memory Depth (`47` marks in bank!):** Associativity Tag shift (`N = M + L`, `2026_FN_Q38`, `2018_FN_Q44`, `2017_FN_Q65`), Leading-zero max cache (`2026_AN_Q56`), Tag directory bits (`2025_FN_Q36`), Hex address tracing (`2026_AN_Q52`, `2022_FN_Q54`), Conflict vs Compulsory misses (`2017_FN_Q53`), **Write Policies (`WT/WB × WA/NWA`, `2024_FN_Q41`, `2022_FN_Q24`, `2021_AN_Q39`)**, Inclusive/Exclusive L1/L2, **Local vs Global L2 (`2017_FN_Q20`)**, Split `I/D` CPI (`2024_FN_Q56`), Burst/Critical-Word-First AMAT & Bandwidth (`2020_FN_Q27`, `2019_FN_Q60`), and **TLB+PT+Cache interactions (`2026_FN_Q54`)**.
6. **Main Memory & I/O Depth:** **Memory Chip Grids, Interleaving & Chip-Select Decoders (`2023_FN_Q42` OS-crossover)**, **DRAM Refresh Overhead (`2018_FN_Q33`)**, Memory-Mapped vs Isolated I/O, Polling vs Interrupt ratios (`2023_FN_Q34`), Hardware Interrupt steps (`2025_FN_Q11`, `2018_FN_Q19`), Vectored vs Daisy-Chaining (`2026_AN_Q18`, `2020_FN_Q33`), and DMA Burst vs Cycle-Stealing rates (`2024_AN_Q24`, `2024_FN_Q33`, `2021_AN_Q11`).

---

## PART 9. WEIGHTS

### Chapter Weight Tags & Comparison with the Bank (`Part B.3`)

| Chapter | Proposed Weight Tag | Bank Stats (2017–2026, 15 CS Papers) | Does the Bank Weight Look Fair? |
|---|---|---|---|
| **Ch 00 · Hardware Math, Clocks, Endianness & ISA** *(New)* | **Foundation** (Mandatory before Ch 01) | Embedded (`2025_AN_Q28`, `2021_AN_Q58`) + core math in all 72 Qs | **Under-isolated in bank.** Adding Ch 00 eliminates clock/hex/endianness traps before Pipelining & Cache start. |
| **Ch 01 · Instructions, Addressing & Expanding Opcodes** | **High** | 14 Qs / 24 marks (`1.60%`; asked 8/10 yrs — `6` NAT2s!) | **Fair.** Expanding opcodes, addressing modes, and assembly offsets yield steady 2-mark wins in 8/10 years. |
| **Ch 02 · ALU, Data Path & Control Unit** | **Low** (Quick targeted study!) | 4 Qs / 4 marks (`0.27%`; asked only 3/10 yrs, all 1-markers!) | **Fair — warning needed for 100-day students!** Many students sink 2 weeks into ALU/Microprogramming; keep it crisp (`Booth's`, `Single-Bus`, `Ctrl ROM`, `RISC`) so time goes to Cache & Pipelining! |
| **Ch 03 · Instruction Pipelining & Hazards** | **Very High** | 16 Qs / 28 marks (`1.87%`; asked 9/10 yrs — **`12` NAT2s!**) | **Fair — #2 scoring pillar!** Huge 2-mark NAT density (`86%` of marks here are Medium/Hard numericals on CPI, forwarding, and speedup!). |
| **Ch 04 · Cache Memory & Performance** | **Very High** (#1 Priority in COA!) | 27 Qs / 47 marks (`3.13%` of ALL GATE marks; asked **10/10 yrs**!) | **Fair — MASSIVE #1 pillar (`41%` of COA marks)!** Notice **0 Easy questions** (`0/23/4`), meaning zero-level readers MUST drill Tag/Set/Offset slices, Hex traces, Write policies, and AMAT until automatic! |
| **Ch 05 · Main Memory & Interfacing** | **Low-Medium** (Overlaps OS VM & Disk) | 2 Qs / 3 marks (`0.20%`; asked 2/10 yrs + `2023_FN_Q42` in OS bank) | **Fair (slightly under-counted due to `2023_FN_Q42` sitting in OS bank).** Keep focused on Chip grids/decoders, Interleaving, DRAM refresh (`2018_FN_Q33`), and Cache+VM (`2026_FN_Q54`). |
| **Ch 06 · I/O Interface: Interrupts & DMA** | **Medium** (Highest Easy 1-mark ROI!) | 9 Qs / 9 marks (`0.60%`; asked 8/10 yrs — all 1-markers!) | **Fair — fast, high-ROI points!** Appears in 8/10 years as crisp 1-mark questions (`Daisy-chain, Vectored, Interrupt steps, Cycle-stealing bps`). |

### Overall Assessment of Bank Distribution (`7.7%` = ~7.7 marks/paper)
- Across the 15 CS papers (2017–2026) in `Part B.3`, **Cache Memory (`47` marks) + Instruction Pipelining (`28` marks) + Machine Instructions (`24` marks)** account for **`99` of `115` marks (`86%` of ALL Computer Organisation!)**, while I/O, ALU/Control, and Main Memory carry the remaining **`14%`**.
- Notice also: **only `6` out of `72` COA questions in 15 papers are Easy**, while **`53` are Medium and `13` are Hard**, with **37 NAT questions (`28` NAT2s!)** — meaning COA rewards visual bit-slicing and step-by-step cycle/address tracing far more than passive reading! (Beyond the 2017–2026 bank provided, exact future paper weights: **not sure**.)