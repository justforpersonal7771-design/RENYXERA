# Operating Systems — In-Depth Beginner Review and Revised Book Specification

**Project:** RENYXERA / GATE CS Operating Systems book  
**Reviewed source:** `Pasted markdown(1).md` (generated 24 November 2026; v0)  
**Review viewpoint:** a 25-year-old repeat GATE aspirant with backlogs, weak foundations, embarrassment about asking questions, and roughly 100 days left  
**Scope limitation:** the attachment contains reviewer instructions, a six-topic bank summary, seven chapter names with counts of existing lessons, and 78 PYQ transcriptions. It does **not** contain the full seven chapters, the individual lesson text, the cited `01-MASTER-PROMPT.md`, the worked solutions, the 30 “Forge” questions, or most of the referenced question figures. This review therefore judges the plan and the supplied bank; it does not pretend to have read the app's unseen lesson text.

---

## Executive verdict

**Decision: approve a corrected pilot; do not approve bulk rewriting or publication yet.**

The seven chapter headings cover the broad official GATE OS syllabus, and the attached bank contains a useful collection of calculation, code-trace and concept questions. But the source labels itself v0 and says the lesson text was written for students who already know the subject. It does not yet prove that a student starting from almost zero can learn the material independently.

The most serious plan problem is not a missing eighth headline. It is the lack of a visible teaching path inside each headline: what a process is before showing a state diagram; what a CPU burst means before scheduling; what a page and an address are before page-table arithmetic; what a critical section is before semaphores; and what a file block is before inode and disk calculations.

The supplied question bank also needs an audit before it is used as the source of truth. Nine questions have figures that are absent from the supplied file. One definite text error is present in **2024_FN_Q64**: the last T2 assignment is copied incorrectly. **2023_FN_Q27** needs a teaching note because the official final key accepts two alternative key sets, one of which includes FIFO. **2020_FN_Q37** needs its page-fault-rate assumption stated explicitly in the worked solution. **2019_FN_Q63** needs a unit convention written into the solution. Several numeric keys are plausible, but a bare key range is not a worked solution.

**Would I pay ₹149 today? No.** I have only been shown the table of contents and question bank, not the rewritten book. I cannot pay for a promise that the chapters will later be made beginner-friendly. I would reconsider after a genuinely beginner-level pilot, full worked solutions, and a clean answer-key audit.

---

# PART 1 — Feelings (10 lines)

1. I felt relieved that the plan names the main OS areas instead of pretending that one short chapter can teach everything.
2. I felt lost because “processes”, “threads”, “IPC”, “synchronization” and “deadlock” appear as labels, but I cannot see the first lesson that explains what any of them means.
3. I felt scared when I saw page tables, TLB reach, dirty pages, semaphores and disk geometry in the question bank without a visible beginner ladder leading up to them.
4. I felt tricked by the phrase “6 topics ready” or “7 topics ready”: a topic count does not tell me whether one topic teaches a concept from zero or merely gives a formula.
5. I felt that the chapter order may make me learn deadlock before I properly understand processes, resource ownership and waiting.
6. I felt I could do CPU scheduling when I saw familiar arrival times and burst times, but I need one tiny solved Gantt-chart example before a mixed question.
7. I felt I could do memory management if the book first draws actual memory, holes, pages, frames and address bits, one idea at a time.
8. I felt bored by the thought of reading seven chapters that were written for students who already know OS; rewriting must change the teaching, not just add more words.
9. I felt worried that some PYQ answer marks may be copied without checking the original diagram or official master key.
10. **Would I pay ₹149? No—not yet—because the attachment is a contents-and-question-bank draft, not proof that the book can teach someone like me without outside help.**

---

# What the source actually contains

| Source claim | What can be concluded from this attachment | What cannot be concluded |
|---|---|---|
| Seven chapters are listed | Deadlock; Processes and threads; CPU scheduling; Synchronisation; Memory management; Virtual memory; File systems and disk | Whether the app's lessons cover the right subtopics, explain them well, or contain errors |
| 6/7/6/7/6/5/7 lessons are “ready” | Those counts are stated | Their names, sequence, length, depth, diagrams, worked examples, or correctness |
| Existing lessons use an old standard | The source says they were written for students who already know the subject and will be rewritten | Whether the new `01-MASTER-PROMPT.md` fixes the problem; that prompt was not attached here |
| 78 PYQs / 126 marks in 15 CS papers | The six bank-topic counts add to 78; marks add to 126; 126/15 = 8.4 | Whether the bank includes every relevant question, whether the 15 papers are a complete sample, or whether the topic labels are always correct |
| 30 Forge questions | The number is stated | Whether these questions exist, are original, are syllabus-aligned, or have been checked |
| “Official key” marks | The attachment records the options/ranges it says are official | That each mark has been checked against the official final master question paper and key |

## PART 2 — Gap table

The table deliberately separates things that are **not shown** from things that are definitely wrong. Because the actual app chapters are not attached, “not shown” means the project must prove the item exists in the lesson, not that it is certainly absent from the app.

| # | Where | What I could not understand / what is missing | Type | What to add or change | Priority |
|---:|---|---|---|---|---|
| 1 | Whole plan, before Chapter 1 | I do not know what an operating system is or what problem it solves. | MISSING-PREREQUISITE | Add a short first lesson: computer parts, running programs, OS as manager, and examples of OS work. | HIGH |
| 2 | Whole plan, before Chapter 1 | Words like kernel, user mode, privileged instruction, interrupt, trap and exception are not defined in the contents. | UNEXPLAINED-WORD | Add a picture and a plain-English glossary before system-call questions. | HIGH |
| 3 | Whole plan | I cannot tell what a program is versus a process. | MISSING-PREREQUISITE | Teach stored program → running program → process, with one real example. | HIGH |
| 4 | Whole plan | There is no visible symbol/key convention for diagrams, process IDs, queues, resource units or memory addresses. | UNCLEAR-ENGLISH | Publish one consistent notation page and use it everywhere. | MEDIUM |
| 5 | Whole plan | I cannot tell whether the book assumes C, Linux, POSIX or an abstract OS model. | FACT-DOUBT | State the assumed model for every code question; distinguish portable concepts from Unix/Linux calls. | HIGH |
| 6 | Whole plan | I do not see a promise that every new term is defined before it is used. | UNEXPLAINED-WORD | Add a “first use” rule to the Claude prompt and enforce it during review. | HIGH |
| 7 | Whole plan | “GATE level” is not defined as a progression from easy to hard. | WRONG-ORDER | Use a fixed ladder: intuition → tiny example → trace → formula → GATE variation. | HIGH |
| 8 | Whole plan | There is no stated lesson length, practice count or recap routine in this OS contents page. | MISSING-FINER-POINT | Specify 45–90 minute lessons, retrieval practice, checkpoints and mixed review. | MEDIUM |
| 9 | Whole plan | There is no list of prerequisite knowledge from C and COA. | MISSING-PREREQUISITE | Add a prerequisite map: variables/loops, function calls, arrays, binary arithmetic, memory/address basics. | HIGH |
| 10 | Whole plan | A learner can finish a chapter without being able to explain it back. | NEEDS-EXAMPLE | Add a short teach-back question and one “draw it from memory” check per lesson. | MEDIUM |
| 11 | Chapter order: Deadlock is Chapter 1 | I am being asked to think about processes and resources before the plan teaches what a process is. | WRONG-ORDER | Move deadlock after process, resource-allocation and synchronization foundations. | HIGH |
| 12 | Chapter 1: Deadlock | “Resource”, “instance”, “request”, “allocation” and “wait” are assumed terms. | UNEXPLAINED-WORD | Start with two people sharing two tools, then map it to processes and resource instances. | HIGH |
| 13 | Chapter 1: Deadlock | The four necessary conditions are not listed in the contents. | MISSING-GATE-CONCEPT | Explicitly teach mutual exclusion, hold-and-wait, no preemption and circular wait, with a small example of each. | HIGH |
| 14 | Chapter 1: Deadlock | No resource-allocation graph is named in the chapter summary. | MISSING-GATE-CONCEPT | Add process/resource nodes, request/assignment edge direction, cycle examples and the single-instance caveat. | HIGH |
| 15 | Chapter 1: Deadlock | A cycle may or may not mean deadlock when resource types have multiple instances; I would confuse this. | MISSING-FINER-POINT | Compare one-instance and multi-instance graphs side by side. | HIGH |
| 16 | Chapter 1: Deadlock | “Prevention”, “avoidance”, “detection” and “recovery” sound like the same thing to me. | UNEXPLAINED-WORD | Put them in a four-column comparison with the question each method answers. | HIGH |
| 17 | Chapter 1: Deadlock | Banker’s algorithm is likely to appear, but the contents do not name its matrices. | MISSING-GATE-CONCEPT | Teach Available, Max, Allocation and Need = Max − Allocation; solve one full safe sequence. | HIGH |
| 18 | Chapter 1: Deadlock | I do not see how to distinguish safe, unsafe and deadlocked states. | MISSING-FINER-POINT | Add three separate states and an example showing unsafe does not automatically mean deadlocked. | HIGH |
| 19 | Chapter 1: Deadlock | The number-of-instances formula questions have no beginner derivation visible. | STEP-SKIPPED | Derive the n(k−1)+1 guarantee for identical resources using a “one unit short” deadlock picture. | MEDIUM |
| 20 | Chapter 1: Deadlock | Recovery may be just a name; I need to know what aborting a process releases. | NEEDS-EXAMPLE | Show process termination, resource release, rollback and victim-selection trade-offs. | MEDIUM |
| 21 | Chapter 1: Deadlock | Livelock and starvation are easy to confuse with deadlock. | MISSING-FINER-POINT | Add a three-way comparison with timelines showing who is moving and who is waiting. | MEDIUM |
| 22 | Chapter 2: Processes and threads | The chapter does not name the process control block (PCB). | MISSING-GATE-CONCEPT | Draw a PCB and explain why the OS stores state, registers, scheduling and memory information. | HIGH |
| 23 | Chapter 2: Processes and threads | Process states are not listed. | NEEDS-DIAGRAM | Add new/ready/running/waiting/terminated, with the event that causes every arrow. | HIGH |
| 24 | Chapter 2: Processes and threads | I do not know what ready queue, device queue or scheduler means. | UNEXPLAINED-WORD | Define each using a single CPU and two waiting processes. | HIGH |
| 25 | Chapter 2: Processes and threads | Context switch is a central exam idea but is not named. | MISSING-GATE-CONCEPT | Show what is saved/restored and distinguish a context switch from a mode switch. | HIGH |
| 26 | Chapter 2: Processes and threads | I cannot tell when the OS switches process versus when a function call happens. | MISSING-PREREQUISITE | Compare a user-level function call, system call, interrupt and context switch. | HIGH |
| 27 | Chapter 2: Processes and threads | `fork()`, `exec()`, `wait()` and `exit()` are not listed. | MISSING-GATE-CONCEPT | Add process creation and replacement, parent/child return values, wait and termination. | HIGH |
| 28 | Chapter 2: Processes and threads | Fork output questions are impossible for me if I cannot draw the process tree. | NEEDS-TRACE | Add a process-tree trace after every fork, with a per-process copy of variables. | HIGH |
| 29 | Chapter 2: Processes and threads | Copy-on-write is not named. | MISSING-FINER-POINT | Explain the usual fork memory idea at concept level and state that implementation details vary. | MEDIUM |
| 30 | Chapter 2: Processes and threads | Zombie and orphan processes are not mentioned. | MISSING-FINER-POINT | Add short definitions and a parent/child timeline. | MEDIUM |
| 31 | Chapter 2: Processes and threads | The thread chapter needs thread-local versus shared state. | MISSING-GATE-CONCEPT | Draw stacks/registers/PC per thread and shared code/data/heap/address space. | HIGH |
| 32 | Chapter 2: Processes and threads | User-level and kernel-level threads are not listed. | MISSING-GATE-CONCEPT | Compare many-to-one, one-to-one and many-to-many models, including blocking and parallelism. | HIGH |
| 33 | Chapter 2: Processes and threads | I do not see what a thread library does or what a thread's own stack means. | UNEXPLAINED-WORD | Add one process with two threads and two separate call stacks. | MEDIUM |
| 34 | Chapter 2: Processes and threads | IPC is in the syllabus, but its mechanisms are not visible in this chapter list. | MISSING-GATE-CONCEPT | Add shared memory and message passing, followed by pipes/FIFOs and signals at the expected depth. | HIGH |
| 35 | Chapter 2: Processes and threads | I cannot distinguish a pipe from shared memory or a message queue. | NEEDS-EXAMPLE | Use a side-by-side comparison: who copies data, who shares memory, and how synchronization occurs. | MEDIUM |
| 36 | Chapter 2: Processes and threads | A process may have multiple threads; a separate process generally has a separate address space. This boundary is easy to miss. | NEEDS-DIAGRAM | Add one memory map showing two processes and one process with two threads. | HIGH |
| 37 | Chapter 3: CPU scheduling | The contents do not list CPU burst, I/O burst, arrival time, burst length or completion time. | MISSING-PREREQUISITE | Teach the CPU–I/O burst cycle before algorithms. | HIGH |
| 38 | Chapter 3: CPU scheduling | Waiting, response and turnaround time look like the same thing to a beginner. | UNEXPLAINED-WORD | Define each with a single process timeline and formula. | HIGH |
| 39 | Chapter 3: CPU scheduling | I do not see scheduling goals: utilization, throughput, fairness and response time. | MISSING-GATE-CONCEPT | Add a short lesson with trade-offs; explain why one algorithm cannot optimize everything. | MEDIUM |
| 40 | Chapter 3: CPU scheduling | FCFS, SJF, SRTF, priority and Round Robin are not actually named in the plan. | MISSING-GATE-CONCEPT | List every algorithm and mark preemptive/non-preemptive explicitly. | HIGH |
| 41 | Chapter 3: CPU scheduling | A Gantt chart is likely assumed. I need to learn how to build one. | NEEDS-DIAGRAM | Start with two processes and advance the clock at arrivals/completions/preemptions. | HIGH |
| 42 | Chapter 3: CPU scheduling | Tie-breaking rules are not mentioned. | MISSING-FINER-POINT | State a deterministic convention for simultaneous arrivals, equal remaining times and queue order; follow the question if specified. | HIGH |
| 43 | Chapter 3: CPU scheduling | SJF and SRTF are easy to confuse. | MISSING-FINER-POINT | Contrast “shortest next burst among ready jobs” with “shortest remaining time, reconsidered on arrival”. | HIGH |
| 44 | Chapter 3: CPU scheduling | Round Robin depends on time quantum and ready-queue rotation. | NEEDS-TRACE | Show a full queue after every quantum, including process completion. | HIGH |
| 45 | Chapter 3: CPU scheduling | Priority starvation and aging are not visible. | MISSING-GATE-CONCEPT | Add a starvation example and show aging raising priority over time. | MEDIUM |
| 46 | Chapter 3: CPU scheduling | Multilevel queue and multilevel feedback queue are not listed. | MISSING-FINER-POINT | Include a comparison and clarify which properties depend on system policy. | MEDIUM |
| 47 | Chapter 3: CPU scheduling | Context-switch overhead is missing from the contents summary. | MISSING-FINER-POINT | Include one timeline where the context-switch cost changes the answer. | MEDIUM |
| 48 | Chapter 3: CPU scheduling | Multiprocessor scheduling is not mentioned despite a multi-CPU PYQ in the bank. | MISSING-GATE-CONCEPT | Add a basic lesson on assignment constraints, processor-specific priorities and waiting-time calculation. | MEDIUM |
| 49 | Chapter 3: CPU scheduling | I do not know whether I/O scheduling means disk-head scheduling in this book. | FACT-DOUBT | Explicitly separate device/CPU scheduling and disk request scheduling; state the scope. | HIGH |
| 50 | Chapter 4: Synchronisation | The chapter heading says synchronization but does not name the critical-section problem. | MISSING-GATE-CONCEPT | Start with shared variable race, then mutual exclusion, progress and bounded waiting. | HIGH |
| 51 | Chapter 4: Synchronisation | “Race condition” and “atomic” are not defined. | UNEXPLAINED-WORD | Show `x = x + 1` as read, add and write; compare atomic and non-atomic execution. | HIGH |
| 52 | Chapter 4: Synchronisation | I cannot tell a mutex from a binary semaphore. | MISSING-FINER-POINT | Explain ownership, wait/signal, counting value and the model being assumed. | HIGH |
| 53 | Chapter 4: Synchronisation | Busy waiting/spinlock versus blocking lock is absent from the summary. | MISSING-FINER-POINT | Compare CPU spinning with blocking and wake-up queues. | MEDIUM |
| 54 | Chapter 4: Synchronisation | Semaphore schedules are confusing unless every wait and signal changes a visible count. | NEEDS-TRACE | Use a trace table: step, process, semaphore value, running/blocked state, shared data. | HIGH |
| 55 | Chapter 4: Synchronisation | Classical problems are not listed. | MISSING-GATE-CONCEPT | Include producer–consumer, readers–writers and dining philosophers, with the required variants and assumptions. | HIGH |
| 56 | Chapter 4: Synchronisation | A barrier is a common pattern but is not mentioned. | MISSING-FINER-POINT | Add a reusable/non-reusable barrier example and identify what it guarantees. | MEDIUM |
| 57 | Chapter 4: Synchronisation | Peterson's solution and hardware atomic primitives are not mentioned. | MISSING-GATE-CONCEPT | Cover the two-process Peterson idea and test-and-set/compare-and-swap at GATE-appropriate depth. | MEDIUM |
| 58 | Chapter 4: Synchronisation | Monitors and condition variables are named in the bank label but are not in the chapter details. | MISSING-GATE-CONCEPT | Give the monitor abstraction, condition wait/signal and one small example. | HIGH |
| 59 | Chapter 4: Synchronisation | A lock can be released by the wrong thread in some APIs; a semaphore is not the same ownership abstraction. | MISSING-FINER-POINT | Explain model/API assumptions; do not overgeneralize from one programming language. | MEDIUM |
| 60 | Chapter 4: Synchronisation | Interleavings are easy to miss when two statements are on separate lines. | NEEDS-TRACE | Teach partial-order schedules and enumerate valid interleavings without silently assuming atomicity. | HIGH |
| 61 | Chapter 4: Synchronisation | The bank includes questions with a single CPU and with multiple threads; these assumptions matter. | FACT-DOUBT | State whether preemption, parallel execution, atomic statements and fairness are assumed in each worked solution. | HIGH |
| 62 | Chapter 4: Synchronisation | The source spells it “Synchronisation” but the lesson vocabulary may vary. | UNCLEAR-ENGLISH | Pick one spelling and keep “synchronization/synchronisation” consistent in headings and search metadata. | LOW |
| 63 | Chapter 5: Memory management | I do not know what an address space or memory partition is. | MISSING-PREREQUISITE | Begin with a process occupying a region of RAM and a simple physical-memory map. | HIGH |
| 64 | Chapter 5: Memory management | Contiguous allocation and variable partitions are not named in the contents. | MISSING-GATE-CONCEPT | Include first fit, best fit, worst fit and next fit with the exact hole-selection procedure. | HIGH |
| 65 | Chapter 5: Memory management | Internal and external fragmentation are not explained. | UNEXPLAINED-WORD | Use box diagrams showing wasted space inside a block versus scattered holes between allocations. | HIGH |
| 66 | Chapter 5: Memory management | Compaction is not named. | MISSING-FINER-POINT | Show holes merging after processes move; explain why compaction is not the same as paging. | MEDIUM |
| 67 | Chapter 5: Memory management | Paging appears only indirectly through the bank. | MISSING-GATE-CONCEPT | Add page/frame definitions, page table, page offset and a complete address-translation example. | HIGH |
| 68 | Chapter 5: Memory management | Page size, page number bits and offset bits need a derivation. | STEP-SKIPPED | Teach powers of two and address splitting before large numerical problems. | HIGH |
| 69 | Chapter 5: Memory management | Segmentation is not named. | MISSING-GATE-CONCEPT | Include logical segments, base/limit, address translation, protection and external fragmentation. | HIGH |
| 70 | Chapter 5: Memory management | The distinction between logical/virtual and physical addresses is not shown. | NEEDS-DIAGRAM | Draw CPU-generated virtual address → MMU → physical frame + offset. | HIGH |
| 71 | Chapter 5: Memory management | I cannot see why paging removes external fragmentation but may leave internal fragmentation. | NEEDS-EXAMPLE | Work a final partially filled page and compare with variable-size partitions. | HIGH |
| 72 | Chapter 5: Memory management | Protection and sharing are missing from the visible outline. | MISSING-FINER-POINT | Explain read/write/execute bits and shared pages conceptually. | MEDIUM |
| 73 | Chapter 5: Memory management | Multi-level, hashed and inverted page-table structures are not in this chapter description. | MISSING-GATE-CONCEPT | Add their purpose, storage trade-offs, address fields and lookup implications. | HIGH |
| 74 | Chapter 5: Memory management | Page table memory overhead and the number of page-table pages are not visible. | NEEDS-EXAMPLE | Solve one 32-bit address / 4 KB page / 4-byte PTE case slowly, then generalize. | HIGH |
| 75 | Chapter 6: Virtual memory | Demand paging and page fault handling are not named. | MISSING-GATE-CONCEPT | Draw the full page-fault path: trap, OS check, disk read, frame update, restart. | HIGH |
| 76 | Chapter 6: Virtual memory | I do not know what a valid/invalid bit or dirty bit does. | UNEXPLAINED-WORD | Show a page-table entry and explain each field used in GATE questions. | HIGH |
| 77 | Chapter 6: Virtual memory | TLB is in the bank but absent from the chapter topic list. | MISSING-GATE-CONCEPT | Teach TLB hit/miss, reach, address tags, ASID/process ID and effective access time. | HIGH |
| 78 | Chapter 6: Virtual memory | Effective access time formulas depend on whether page faults are included. | FACT-DOUBT | Separate TLB miss penalty, page-table memory accesses and disk page-fault service time; define every probability. | HIGH |
| 79 | Chapter 6: Virtual memory | FIFO, OPT and LRU are not listed. | MISSING-GATE-CONCEPT | Include frame-by-frame replacement tables and a clear victim-selection rule. | HIGH |
| 80 | Chapter 6: Virtual memory | LFU, MFU and Second-Chance/Clock are not visible, despite the bank asking about candidate policies. | MISSING-FINER-POINT | Cover at least definitions and a trace where relevant; mark lower-priority variants honestly. | MEDIUM |
| 81 | Chapter 6: Virtual memory | Belady's anomaly is not mentioned. | MISSING-GATE-CONCEPT | Show a reference string where FIFO's page faults increase with more frames; contrast stack algorithms. | HIGH |
| 82 | Chapter 6: Virtual memory | Local versus global replacement is not mentioned. | MISSING-FINER-POINT | Compare which process may lose a frame under the two policies. | MEDIUM |
| 83 | Chapter 6: Virtual memory | Thrashing and working-set ideas are absent. | MISSING-FINER-POINT | Explain locality, working set, page-fault frequency and why too few frames cause thrashing. | MEDIUM |
| 84 | Chapter 6: Virtual memory | Page replacement is hard to learn without a frame table. | NEEDS-TRACE | Every solution must show reference, hit/fault, frame contents, victim and recency/frequency metadata. | HIGH |
| 85 | Chapter 6: Virtual memory | The source does not say how dirty-page writeback changes fault service time. | MISSING-FINER-POINT | Add clean-victim versus dirty-victim time equations. | HIGH |
| 86 | Chapter 6: Virtual memory | The bank includes array traversal page faults; I need to connect row-major layout with pages. | MISSING-PREREQUISITE | Add one array-in-memory example and then a page reference sequence generated by code. | HIGH |
| 87 | Chapter 7: File systems and disk | I do not know what a file, directory, block or file control block is. | MISSING-PREREQUISITE | Start from filename → directory entry → metadata/inode → data blocks. | HIGH |
| 88 | Chapter 7: File systems and disk | File attributes and operations are not listed. | MISSING-GATE-CONCEPT | Include create/open/read/write/seek/close/delete, metadata and file descriptor/open-file table basics. | MEDIUM |
| 89 | Chapter 7: File systems and disk | Sequential, direct/random and indexed access methods are absent. | MISSING-GATE-CONCEPT | Compare how the system finds the next byte or block. | MEDIUM |
| 90 | Chapter 7: File systems and disk | Directory implementation and lookup are not listed. | MISSING-GATE-CONCEPT | Cover linear lists, hash-based directories, path lookup and why create/rename may need extra searches. | HIGH |
| 91 | Chapter 7: File systems and disk | Contiguous, linked and indexed allocation are not named in the chapter list. | MISSING-GATE-CONCEPT | Draw each allocation, then compare sequential access, random access, growth and fragmentation. | HIGH |
| 92 | Chapter 7: File systems and disk | Inodes and direct/single-indirect/double-indirect pointers are not mentioned. | MISSING-GATE-CONCEPT | Draw the pointer tree and derive max file size from block size and pointer width. | HIGH |
| 93 | Chapter 7: File systems and disk | Free-space tracking is missing from the contents summary. | MISSING-GATE-CONCEPT | Add bitmap, linked-list, grouping and counting approaches; include the block-count calculation. | HIGH |
| 94 | Chapter 7: File systems and disk | File-system mounting, partitions and the file-system layer are not mentioned. | MISSING-FINER-POINT | Add a compact overview diagram; keep deep implementation detail [LATER]. | LOW |
| 95 | Chapter 7: File systems and disk | Disk geometry is assumed in seek and transfer calculations. | MISSING-PREREQUISITE | Define track, cylinder, sector, platter, surface, head and rotational speed. | HIGH |
| 96 | Chapter 7: File systems and disk | FCFS, SSTF, SCAN, C-SCAN, LOOK and C-LOOK are not listed. | MISSING-GATE-CONCEPT | Teach disk scheduling in a separate lesson with head movement and direction conventions. | HIGH |
| 97 | Chapter 7: File systems and disk | Seek time, rotational latency and transfer time are easy to combine incorrectly. | STEP-SKIPPED | Derive total access time and keep milliseconds, rotations and sectors in separate units. | HIGH |
| 98 | Chapter 7: File systems and disk | The source uses “File Systems Operations & Disk Scheduling Optimization” as a bank label but the official line separates file systems from CPU and I/O scheduling. | FACT-DOUBT | Preserve the official syllabus headings; cross-tag disk scheduling under I/O scheduling and link it to the disk chapter. | MEDIUM |
| 99 | PYQ bank: all questions | Every item only has a final key; I do not see the working. | NEEDS-TRACE | Write a complete, reproducible solution for every NAT and every multi-step MCQ/MSQ. | HIGH |
| 100 | PYQ bank: figure questions | The attachment says figures are not shown, so I cannot solve those questions from this file. | NEEDS-DIAGRAM | Reattach the original figure crop, source paper, and exact final key for every figure-based item. | HIGH |
| 101 | PYQ bank: question IDs | The ID/year/shift mapping is not tied to a source URL or official master-paper page. | FACT-DOUBT | Add official source URL, paper code, session, master-paper question number and final-key reference. | HIGH |
| 102 | PYQ bank: difficulty labels | “Easy / Medium / Hard” has no definition. | UNCLEAR-ENGLISH | Define by prerequisite count, number of steps and time, not by intuition. | MEDIUM |
| 103 | PYQ bank: frequency | 15 papers are a selected sample unless the source proves otherwise. | FACT-DOUBT | Publish the exact list of papers included and excluded before using topic counts as weightage. | HIGH |
| 104 | PYQ bank: topic labels | Some questions can straddle process, scheduling, memory and file-system subtopics. | MISSING-FINER-POINT | Give each question one primary tag and any secondary tags; state the rule for counting it. | MEDIUM |
| 105 | PYQ bank: 2024_FN_Q64 | T2's last assignment is transcribed as `a = 2 + a`; the official master paper says `a = 2 * a`. That changes the interleaving outcomes. | FACT-DOUBT | Correct the transcription to `a = 2 * a`, then re-solve the interleavings; the official option A is consistent with the original. | HIGH |
| 106 | PYQ bank: 2023_FN_Q27 | The source lists A, C, D as correct; FIFO is not usually said to starve an already queued finite job under FCFS. The official final key records `A, C, D or C, D`. | FACT-DOUBT | Preserve the official key alternatives, but explain the model/interpretation behind accepting A; do not silently teach that FIFO ordinarily starves a queued finite job. | HIGH |
| 107 | PYQ bank: 2020_FN_Q37 | The question says 10% page-fault rate but does not spell out the denominator in the sentence. The accepted calculation treats 10% as conditional on a TLB miss. | FACT-DOUBT | State explicitly that the page-fault probability is applied to the 5% TLB-miss path; then show the 154.5 ns calculation. Do not describe the key as wrong under that standard interpretation. | HIGH |
| 108 | PYQ bank: 2019_FN_Q63 | The accepted numeric ranges use different unit interpretations, and one is not explained. | FACT-DOUBT | State whether GB means 10^9 bytes or 2^30 bytes and show the exact computed bytes. | HIGH |
| 109 | PYQ bank: 2018_FN_Q50 | The semaphore names and their verbal descriptions are deliberately easy to mix up. | UNCLEAR-ENGLISH | Keep the given names but draw actual empty-slot and filled-slot counts; do not rename them silently. | MEDIUM |
| 110 | “30 Forge questions” | The book plan claims 30 extra questions but gives none here. | FACT-DOUBT | Attach all 30 with answer, solution, tag, difficulty and a check that they are original rather than disguised PYQs. | HIGH |

---

# PART 3 — What a complete GATE OS subject must contain

## Official syllabus check

The source lists five lines:

1. System calls, processes, threads, inter-process communication, concurrency and synchronization.
2. Deadlock.
3. CPU and I/O scheduling.
4. Memory management and virtual memory.
5. File systems.

These match the Operating System wording in the official GATE 2027 CS syllabus. No additional OS headline is missing from the syllabus text. The important distinction is that the syllabus is intentionally broad: it does not enumerate every algorithm and subtopic that may be tested under those lines.

Official check: [GATE 2027 Test Papers & Syllabus — IIT Madras](https://gate2027.iitm.ac.in/exam_papers_and_syllabus) (the page says the 2027 syllabi were revised and directs candidates to the paper-specific syllabus PDF); [direct CS syllabus PDF](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf). The OS line is also visible in the current GATE 2027 syllabus search extract. The project's five lines match it.

**Frequency policy:** I will not invent a long-run frequency. “Bank count” below refers only to this attachment's claimed 15-paper sample. For all other frequency statements, use **not sure** until the exact paper corpus has been enumerated and classified. The count of a topic in this bank is not a guarantee about GATE 2027.

| Topic / finer topic that a complete book should teach | Syllabus line served | Frequency | Typical question type | What I need before it |
|---|---|---|---|---|
| OS purpose; resource management; OS services; kernel versus user mode | System calls, processes… | not sure | Concept MCQ/MSQ; system-mode transition | CPU, memory, program basics |
| System calls versus library/API calls; system-call arguments and return | System calls… | not sure | Identify user→kernel transitions; distinguish function call from system call | Function call and basic OS idea |
| Interrupts, traps, exceptions, timer interrupts and privilege mode | System calls…; CPU scheduling | not sure | Determine mode switch/context switch/state change | CPU instruction and program execution basics |
| Process versus program; process address space; process image | Processes | not sure | Definitions and memory-sharing questions | What a program is; code/data/stack/heap idea |
| PCB; process states; ready/wait queues; schedulers | Processes; CPU scheduling | not sure | State transitions, PCB contents, queue reasoning | Process versus program |
| Context switch; save/restore registers, PC, SP; same-process thread switch | Processes; threads | not sure | Which items are saved; cost and sequence | Registers, program counter, stack pointer |
| Process creation/termination: fork, exec, wait, exit | Processes; system calls | not sure; several examples appear in supplied bank | Process-tree and output-count NAT | C loop, branch, parent/child model |
| Parent/child address-space behaviour; copy-on-write at concept level | Processes | not sure | Predict independent variable updates after fork | Process creation and virtual memory basics |
| Zombie and orphan processes | Processes | not sure | Short conceptual MCQ/MSQ | Parent/child and wait |
| Threads; thread control block; user-level/kernel-level threads | Threads | not sure; supplied bank has multiple thread-sharing questions | Shared/private state; model comparison | Process address space |
| Many-to-one, one-to-one and many-to-many thread mapping | Threads | not sure | Blocking and multicore parallelism | User versus kernel thread |
| Thread shared memory: code/data/heap/address space; private stack/registers/PC | Threads | supplied bank has several such items; long-run frequency not sure | Identify shared/private state | Memory layout, process versus thread |
| IPC shared memory and message passing | Inter-process communication | not sure | Compare mechanisms; producer-consumer | Processes and shared data |
| Pipes/FIFOs and basic signal/message concepts | Inter-process communication | not sure | Simple communication-flow question | File descriptors and process relation |
| Race conditions; atomicity; interleaving; lost update | Concurrency and synchronization | not sure; supplied bank has multiple interleaving questions | Enumerate final values; detect race | Process/thread execution and shared variables |
| Critical-section problem: mutual exclusion, progress, bounded waiting | Concurrency and synchronization | not sure | Judge whether a solution is correct | Race condition and lock idea |
| Mutex locks, spinlocks and blocking locks | Concurrency and synchronization | not sure | Lock schedule, busy waiting, deadlock | Critical section |
| Hardware atomic primitives: test-and-set, compare-and-swap | Concurrency and synchronization | not sure | Determine mutual exclusion or interleaving | Atomicity and shared variable |
| Peterson's two-process solution | Concurrency and synchronization | not sure | Trace flags/turn; properties | Boolean variables, interleaving |
| Semaphores: binary/counting; wait/signal; queue behaviour | Concurrency and synchronization | supplied bank count: 11 sync questions across labels; all-paper frequency not sure | Semaphore trace; output pattern; deadlock | Atomicity, shared state, blocking |
| Classical synchronization: bounded buffer/producer-consumer | Concurrency and synchronization | not sure | Assign semaphore roles; trace buffer count | Counting semaphores and mutex |
| Readers-writers and dining philosophers | Concurrency and synchronization | not sure | Starvation/deadlock and synchronization property | Mutex/semaphores |
| Monitors and condition variables | Concurrency and synchronization | not sure | State whether waits/signals block or wake | Critical section, condition queue |
| Barrier synchronization | Concurrency and synchronization | not sure | Does any process pass before all arrive? | Semaphore and process count |
| Deadlock definition and four necessary conditions | Deadlock | supplied bank count: 9; all-paper frequency not sure | Condition recognition; prevention proposal | Process, resource and wait |
| Resource-allocation graph; request/assignment edges; cycle | Deadlock | not sure | Identify graph/cycle/deadlock | Process/resource nodes |
| Multiple resource instances; graph-cycle limitation | Deadlock | not sure | Is cycle sufficient? | Resource-allocation graph |
| Deadlock prevention by denying one necessary condition | Deadlock | not sure | Identify which condition is broken | Four conditions |
| Deadlock avoidance; safe/unsafe state; safe sequence | Deadlock | not sure | Safe-state test | Available resource vector |
| Banker’s algorithm: Available, Max, Allocation, Need | Deadlock | not sure | Find safe sequence / safe request | Vector subtraction and inequalities |
| Deadlock detection for single and multiple instances | Deadlock | not sure | Detection work-array algorithm | Allocation/request/available state |
| Recovery: abort, preempt, rollback; victim choice | Deadlock | not sure | Which victim breaks a cycle | Detection and resource ownership |
| Deadlock versus starvation versus livelock | Deadlock; synchronization | not sure | Concept distinction | Process states and progress |
| Scheduling terms: CPU/I/O burst, arrival, completion, ready queue | CPU scheduling | not sure | Gantt-chart setup | CPU–I/O cycle |
| Scheduling criteria: utilization, throughput, turnaround, waiting, response | CPU scheduling | not sure | Formula/compare algorithms | Timeline arithmetic |
| FCFS | CPU scheduling | supplied bank count is within 14 CPU/I/O-scheduling questions; all-paper frequency not sure | Gantt chart and waiting time | Arrival/burst time |
| Non-preemptive SJF | CPU scheduling | not sure | Gantt chart and average waiting time | FCFS timeline |
| Preemptive SRTF | CPU scheduling | not sure | Arrival-driven preemption and metrics | Remaining burst time |
| Priority scheduling, preemptive/non-preemptive, aging | CPU scheduling | not sure | Gantt chart, starvation | Priority order |
| Round Robin and time quantum | CPU scheduling | not sure | Ready-queue trace; turnaround/waiting | FIFO queue |
| Multilevel queue and multilevel feedback queue | CPU scheduling | not sure | Policy comparison | Priority and Round Robin |
| Context-switch overhead and tie handling | CPU scheduling | not sure | Numerical Gantt chart | Scheduler event rules |
| Multiprocessor scheduling and processor-specific priority constraints | CPU scheduling | not sure | Assignment and average wait | Non-preemptive scheduling |
| Memory hierarchy context; address space; logical versus physical addresses | Memory management | not sure | Address interpretation | Bits, bytes and RAM |
| Contiguous allocation; fixed/variable partitions | Memory management | supplied bank includes best-fit and allocation examples; all-paper frequency not sure | Hole allocation trace | Memory map and process size |
| First fit, best fit, worst fit, next fit | Memory management | not sure | Simulate allocations | Ordered list of holes |
| Internal/external fragmentation and compaction | Memory management | supplied bank labels include fragmentation-related items; all-paper frequency not sure | Calculate wasted space | Contiguous allocation |
| Paging: pages, frames, page table, page offset | Memory management | supplied bank's memory/VM label: 21 questions, 37 marks | Address translation and table size | Binary powers and address split |
| Page-table entry fields and protection bits | Memory management; virtual memory | not sure | MMU/protection MCQ/MSQ | Paging |
| Segmentation; segment table; base/limit; protection | Memory management | not sure | Address translation and comparison | Logical address structure |
| Paging versus segmentation | Memory management | not sure | Fragmentation/protection comparison | Both methods individually |
| Multi-level page tables and table-size calculation | Memory management; virtual memory | supplied bank contains several such calculations | Split VPN index and count table pages | Page size, PTE size |
| Hashed and inverted page tables | Memory management; virtual memory | not sure | Lookup and storage comparison | Page number/frame and hash idea |
| TLB, TLB reach, ASID/PID, hit ratio | Virtual memory | supplied bank contains TLB questions; exact frequency not sure | Entry count/bits; effective access time | Page size and page-table walk |
| Demand paging and page-fault handling | Virtual memory | supplied bank includes page-fault rate and replacement problems | Fault path; EAT | Present/valid bit and backing store |
| Page replacement: FIFO, OPT, LRU | Virtual memory | supplied bank includes many replacement questions | Frame trace; fault count | Demand paging |
| LFU, MFU, Second-Chance/Clock | Virtual memory | not sure | Trace or policy identification | Frequency/recency bits |
| Belady's anomaly and stack algorithms | Virtual memory | supplied bank includes a Belady's-anomaly item | Compare faults as frame count changes | FIFO/LRU |
| Local/global replacement; frame allocation | Virtual memory | not sure | Compare victim scope | Multiple processes and frames |
| Locality, working set, thrashing, page-fault frequency | Virtual memory | not sure | Explain system slowdown; working-set count | Reference string and page fault |
| Dirty pages, writeback and page-fault service cost | Virtual memory | supplied bank includes dirty-page EAT calculation | Numerical EAT | Page-fault path and disk transfer time |
| Files, metadata, file operations, descriptors | File systems | not sure | Identify metadata and OS tables | Basic file and directory concept |
| File access methods: sequential/direct/indexed | File systems | not sure | Choose access method | Block and record concept |
| Directory structure and linear/hash lookup | File systems | supplied bank has directory-search question | Full-scan/lookup reasoning | Directory entries |
| Contiguous, linked and indexed allocation | File systems | supplied bank has multiple allocation questions | Fragmentation, insertion, block count | Block and pointer concept |
| Inode/direct/single-indirect/double-indirect pointers | File systems | supplied bank includes inode capacity question | Maximum file size | Block size and pointer width |
| Free-space management: bitmap, linked list, grouping, counting | File systems | supplied bank includes bitmap/list calculation | Number of blocks/bits/pointers | Disk capacity and block size |
| File-system structure, mounting and open-file tables | File systems | not sure | Short concept question | Process file descriptors |
| Disk geometry: track, cylinder, sector, head, surface, platter | I/O scheduling / file-system storage context | supplied bank includes such calculations | Geometry/capacity | Powers of two and storage units |
| Disk access time: seek, rotational latency, transfer time | I/O scheduling | supplied bank includes several such calculations | NAT with units | RPM, sectors/track, bytes/sector |
| FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK disk scheduling | I/O scheduling | supplied bank includes SSTF; long-run frequency not sure | Head sequence and total movement | Disk geometry and direction |

**Syllabus boundary:** RAID, journaling, distributed file systems, advanced Linux kernel internals, real-time scheduling proofs and deep OS implementation are useful enrichment but should not displace the named syllabus or recurring PYQ basics in a ₹149 GATE book. Put them in clearly marked `[LATER]` or omit them unless the official syllabus or verified PYQs justify them.

---

# PART 4 — The diagrams I need to see

Every drawing must have a beginner caption: **what I am looking at, what changes, what stays the same, and what I should notice**. Do not use a diagram that is just a decorative box with unexplained labels.

| Chapter / lesson | What to draw | What I should notice | Format |
|---|---|---|---|
| OS foundations | User program, system-call interface, kernel and hardware layers | A normal function call stays in user space; a system call requests a kernel service | Single layered picture + arrows |
| OS foundations | User mode ↔ kernel mode with syscall, trap, interrupt and return | Kernel mode is privileged; entering kernel mode is not automatically a process context switch | Step-by-step state series |
| Processes | One process memory layout: code, data, heap, stack | Which region holds what; process has an address space | Single labelled picture |
| Processes | Process state diagram | Ready waits for CPU; running may block or be preempted; blocked waits for an event | Single state diagram with event labels |
| Processes | PCB card beside a process | OS saves process-specific execution state and scheduling data | Single annotated picture |
| Processes | Two processes alternating on one CPU | Save old context, choose next process, restore its context | Step-by-step series |
| Process creation | Parent process forks children | Parent/child paths continue after fork; each process has its own return value and variable state | Process-tree series + trace table |
| Process creation | fork/exec/wait timeline | `exec` replaces process image; `wait` collects a child; `fork` creates a child | Step-by-step series |
| Threads | One process containing two threads | Code/data/heap/address space are shared; stacks, registers and program counters are per-thread | Single shared/private memory picture |
| Threads | Many-to-one, one-to-one and many-to-many mappings | Thread mapping changes blocking and ability to use multiple cores | Three side-by-side pictures |
| IPC | Two processes using shared memory | Both map/use the same shared region; synchronization is still needed | Single picture + message trace |
| IPC | Message passing / pipe | Sender and receiver communicate through a kernel-managed channel or API abstraction | Single flow picture |
| Concurrency | Two threads interleaving `x = x + 1` | Read/modify/write can overlap; lost update is possible when operation is not atomic | Trace table |
| Concurrency | Critical-section entry/exit | Only one thread in protected region; waiting threads remain outside | Step-by-step series |
| Concurrency | Peterson flags and turn | Flags express interest; turn resolves conflict in the two-thread algorithm | State diagram + trace table |
| Synchronization | Mutex lock/unlock with wait queue | A lock protects a section; blocked threads need wake-up when available | Step-by-step series |
| Synchronization | Semaphore count and blocked queue | `wait` may decrement or block; `signal` may wake a waiter | Trace table with every operation |
| Synchronization | Producer-consumer circular buffer | Empty slots, full slots and mutex are three different responsibilities | Step-by-step buffer series + count trace |
| Synchronization | Readers-writers and dining philosophers | Show conflict, starvation/deadlock risk and the particular solution policy | Single picture + interleaving trace |
| Synchronization | Barrier with N processes | No process leaves the barrier until all required processes arrive | Step-by-step series |
| Deadlock | Four necessary conditions, each as small everyday example | All four must hold simultaneously for deadlock | Four-panel picture |
| Deadlock | Resource-allocation graph | Process nodes and resource nodes differ; request and assignment arrows point in opposite directions | Single graph with labelled arrows |
| Deadlock | Single-instance cycle versus multiple-instance graph | A cycle is a deadlock criterion only under the appropriate instance assumptions | Side-by-side pictures |
| Deadlock | Banker matrices (Allocation, Max, Need, Available) | Need = Max − Allocation; a process can finish only if Need ≤ Available | Matrix + trace table |
| Deadlock | Safe sequence resource release | Available resources increase after each simulated completion | Step-by-step series |
| Deadlock | Prevention / avoidance / detection / recovery | These are different strategies, not four names for the same thing | Comparison table / decision flow |
| CPU scheduling | CPU–I/O burst cycle | A process alternates between CPU and I/O; it may leave the ready queue | Timeline |
| CPU scheduling | Process arrival and ready queue | The scheduler chooses among processes that are ready, not all processes in the system | Single queue picture |
| CPU scheduling | FCFS Gantt chart | Waiting time is time spent ready but not running | Gantt chart + calculation table |
| CPU scheduling | SJF versus SRTF | Non-preemptive choice is made when CPU becomes free; SRTF may preempt at a new arrival | Paired Gantt charts |
| CPU scheduling | Round Robin queue | After each quantum, an unfinished process goes to the back | Step-by-step queue series |
| CPU scheduling | Priority scheduling with aging | Aging can raise a waiting process priority and reduce starvation | Priority-over-time graph |
| CPU scheduling | Multilevel queue / feedback queue | A process can be confined to a queue or move between priority queues depending on policy | Layered queue picture |
| CPU scheduling | Two CPUs with separate priority order | One process cannot run on two CPUs; feasible assignments depend on both queues | Timeline / assignment trace |
| Memory management | Physical memory with allocated regions and holes | External fragmentation is free memory split into separated holes | Single memory map |
| Memory management | First/best/worst/next fit on the same hole list | Each policy selects a different qualifying hole; remainder is not the same as total free memory | Four-panel allocation series |
| Memory management | Internal versus external fragmentation | Wasted space inside an allocation versus holes between allocations | Side-by-side picture |
| Paging | Virtual pages mapped to physical frames | Page number selects frame; offset is copied unchanged | Single mapping picture |
| Paging | Virtual address bit split | Page number and offset widths follow powers of two | Bit-field diagram |
| Paging | Page table and page-table entry | PTE stores frame and control bits; the OS manages the table, MMU uses it for translation | Single annotated table |
| Segmentation | Segment table with base and limit | Segment number selects a base/limit; offset must be in range | Single diagram + bounds examples |
| Paging vs segmentation | Same logical program under both schemes | Paging uses fixed-size units; segmentation uses logical variable-size units | Comparison picture |
| Multi-level page tables | Outer directory pointing to inner page tables | Only needed lower-level tables may be allocated; address bits split into indices and offset | Tree diagram + address-field strip |
| TLB | CPU → TLB → page table → memory | A TLB hit skips the page-table walk; it does not mean data is necessarily in cache | Flowchart |
| TLB reach | Entries × page size | Reach is the virtual/physical coverage implied by entries under the stated definition | Single calculation picture |
| Demand paging | Page-fault path | Fault traps into OS, page is fetched, table updated, instruction restarted | Step-by-step series |
| Page replacement | Three/four frames and reference string | Hit/fault, victim and frame contents after each reference | Trace table |
| LRU | Recency order / last-used time | Least recently used means the page with the oldest most-recent use, not least frequent | Frame trace table |
| OPT | Future reference string with farthest next use | Replace the page needed farthest in the future; it is a theoretical benchmark | Frame trace table |
| FIFO and Belady | FIFO queue with a different number of frames | More frames can increase FIFO faults; LRU/OPT have the stack property | Two frame-trace tables |
| Thrashing | Process working set versus allocated frames | Too few frames cause frequent faults and low useful CPU work | Working-set graph |
| File systems | Directory entry → inode/metadata → data blocks | A name is not the file's data; metadata points to blocks | Layered path picture |
| File operations | Open-file table and per-process descriptors | Descriptor is a handle; kernel file object tracks shared open state | Single table relationship |
| File allocation | Contiguous, linked and indexed files | Compare block order, pointer overhead, random access and growth | Three side-by-side layouts |
| Inode | Direct, single-indirect, double-indirect pointers | Pointer fan-out depends on block size / pointer size | Tree diagram + capacity formula |
| Free space | Bitmap versus linked list | Bitmap uses one bit per block; linked list stores block identifiers/pointers | Side-by-side representation |
| Directory | Linear list versus hash directory | Lookup cost depends on structure; creation/rename may require checking duplicates | Table / flow diagram |
| Disk geometry | Platter, surface, track, cylinder, sector, head | Cylinder is the same-radius track position across surfaces; sector is a rotational subdivision | Labelled disk cutaway |
| Disk scheduling | Head starts at a cylinder and visits requests | Order changes seek distance; always state initial direction and endpoint convention | Head-movement series + table |
| Disk access time | Seek + average rotation + transfer | Keep each time component and unit separate | Formula breakdown picture |

---

# PART 5 — The full beginner-first plan, chapter by chapter

**Lesson standard:** each lesson should take 45–90 minutes to read and understand, excluding a separate practice session. Every lesson must contain: (1) why this idea exists, (2) beginner explanation, (3) terms before use, (4) one tiny solved example, (5) one diagram/trace, (6) GATE-level cases, (7) common mistakes, (8) a 3–5 question self-check, and (9) a 3-line recap. The labels below are priorities for a student with about 100 days left, not official GATE weightage.

## Chapter 0 — OS foundations and system calls (add before current Chapter 1)

### Lesson O0.1 — What an operating system does [MUST]
- **Why:** I need the basic picture before memorising OS terms.
- **Prerequisites:** computer hardware, program, CPU, RAM and storage at a very basic level.
- **Beginner must see:** OS as the manager between applications and hardware; one application asking for file, memory or CPU help.
- **Finer points:** OS services, kernel, shell/user interface; distinguish OS from compiler and application.
- **GATE-level:** identify which work belongs to OS/kernel; user versus kernel mode.
- **Diagrams:** layered application/system-call/kernel/hardware picture.
- **Hand trace:** follow a program opening a file from user code into the OS and back.
- **Common mistakes:** treating every library function as a system call; thinking the OS is only the desktop screen.

### Lesson O0.2 — System calls, traps, interrupts and mode switching [MUST]
- **Prerequisites:** O0.1; a basic function call.
- **Beginner must see:** user mode and kernel mode; a request enters the kernel through a controlled mechanism.
- **Finer points:** synchronous exception/trap versus asynchronous interrupt; timer interrupt; system-call wrapper versus system-call mechanism.
- **GATE-level:** decide which events enter kernel mode and whether they necessarily cause a process switch.
- **Diagrams:** user/kernel transition series and one event comparison table.
- **Hand trace:** classify function call, `malloc`, system call, page fault and timer interrupt.
- **Common mistakes:** equating mode switch with context switch; assuming every page fault is fatal.

## Chapter 1 — Processes and threads (move before deadlock)

### Lesson O1.1 — Program, process and process states [MUST]
- **Prerequisites:** O0.1–O0.2.
- **Beginner must see:** a program file becomes a running process; process states and queues.
- **Finer points:** new/ready/running/waiting/terminated; scheduler and dispatcher; event causing every transition.
- **GATE-level:** possible/impossible state transitions; ready versus waiting.
- **Diagrams:** state diagram, ready queue and device queue.
- **Hand trace:** process arrives, runs, requests I/O, completes I/O and returns to ready.
- **Common mistakes:** saying blocked can jump straight to running; confusing ready with running.

### Lesson O1.2 — PCB and context switching [MUST]
- **Prerequisites:** O1.1; what PC, register and stack pointer mean.
- **Beginner must see:** why the OS needs to save a process before running another.
- **Finer points:** PCB contents; registers/PC/SP; address-space switch versus same-process thread switch; context-switch overhead.
- **GATE-level:** which state must be saved; process versus thread context.
- **Diagrams:** PCB card and A→B→A context-switch series.
- **Hand trace:** record which process owns the CPU and the saved PC/SP.
- **Common mistakes:** believing the entire memory content is copied on every context switch.

### Lesson O1.3 — fork, exec, wait and exit [MUST]
- **Prerequisites:** O1.1–O1.2; C loops, `if`, function calls and process IDs.
- **Beginner must see:** `fork()` creates a child; both continue after the call; parent and child see different return values.
- **Finer points:** independent address spaces, copy-on-write concept, `exec()` replacement, `wait()` and child termination.
- **GATE-level:** count child processes/prints; draw process trees; interpret nested loops with `fork()`.
- **Diagrams:** process-tree series and fork return-value table.
- **Hand trace:** after each fork, create a row for each live process and its loop variable.
- **Common mistakes:** assuming child starts at `main`; assuming parent and child share an ordinary local variable.

### Lesson O1.4 — Threads and thread models [MUST]
- **Prerequisites:** process address space and stack from O1.1.
- **Beginner must see:** multiple execution paths inside one process.
- **Finer points:** shared code/data/heap/address space and open files; private stack/registers/PC; user/kernel threads; many-to-one/one-to-one/many-to-many.
- **GATE-level:** identify shared/private state and compare mapping models.
- **Diagrams:** one process with two threads; three mapping models.
- **Hand trace:** switch between two threads and list what is saved.
- **Common mistakes:** saying threads share one stack; saying each thread has its own entire address space.

### Lesson O1.5 — Inter-process communication [MUST]
- **Prerequisites:** processes, address spaces, basic file descriptors.
- **Beginner must see:** separate processes need a way to exchange information.
- **Finer points:** shared memory, message passing, pipes/FIFOs, signals and the broad socket idea; synchronization is still required for shared memory.
- **GATE-level:** choose the mechanism or identify what is shared.
- **Diagrams:** shared-memory flow versus message-passing flow; pipe producer/consumer.
- **Hand trace:** two processes write/read messages in sequence.
- **Common mistakes:** treating IPC as identical to synchronization; confusing a pipe with a shared address space.

## Chapter 2 — Concurrency and synchronization

### Lesson O2.1 — Race conditions and critical sections [MUST]
- **Prerequisites:** O1.4–O1.5; variables and assignment statements.
- **Beginner must see:** two threads update the same data; outcome depends on order.
- **Finer points:** atomicity, read-modify-write, race condition, mutual exclusion, progress and bounded waiting.
- **GATE-level:** find lost updates and judge critical-section properties.
- **Diagrams:** interleaving timeline and critical-section entry/exit.
- **Hand trace:** enumerate every legal ordering of two short statement sequences.
- **Common mistakes:** assuming a whole source-code expression is atomic; ignoring per-thread statement order.

### Lesson O2.2 — Mutex locks and hardware support [SHOULD]
- **Prerequisites:** O2.1.
- **Beginner must see:** one lock protects one critical region.
- **Finer points:** spinlock versus blocking lock; test-and-set and compare-and-swap concept; lock ownership and API dependence.
- **GATE-level:** mutual exclusion, busy waiting and simple lock traces.
- **Diagrams:** lock state and blocked queue.
- **Hand trace:** two threads trying to acquire/release a lock.
- **Common mistakes:** assuming a lock automatically prevents starvation; confusing hardware atomic operation with a high-level mutex.

### Lesson O2.3 — Semaphores from zero [MUST]
- **Prerequisites:** O2.1; a count and a queue.
- **Beginner must see:** counting semaphore, binary semaphore, `wait` and `signal`.
- **Finer points:** blocking semantics, wake-up, count conventions, semaphore versus mutex, fairness assumptions.
- **GATE-level:** output patterns, final semaphore values and deadlocks.
- **Diagrams:** semaphore value/blocked queue; wait/signal series.
- **Hand trace:** one row per operation, with process state and value.
- **Common mistakes:** guessing the sign of a wait; assuming a semaphore is always a lock with ownership.

### Lesson O2.4 — Classical synchronization problems [MUST]
- **Prerequisites:** O2.3.
- **Beginner must see:** producer-consumer buffer with empty/full/mutex roles.
- **Finer points:** readers-writers policy, dining philosophers, starvation and deadlock possibilities, barrier concept.
- **GATE-level:** fill semaphore placeholders, test whether a schedule is possible.
- **Diagrams:** buffer slots; readers/writers; philosophers; barrier.
- **Hand trace:** run short semaphore programs operation by operation.
- **Common mistakes:** reversing empty/full initial values; forgetting mutex protects buffer update itself.

### Lesson O2.5 — Monitors, condition variables and barriers [SHOULD]
- **Prerequisites:** O2.3–O2.4.
- **Beginner must see:** a monitor packages shared data and operations; condition wait releases/reacquires the monitor according to the model.
- **Finer points:** signal-and-continue versus signal-and-wait variants only if required; barrier generation/reuse.
- **GATE-level:** identify when a process blocks and when it can proceed.
- **Diagrams:** monitor with condition queues and barrier timeline.
- **Hand trace:** two threads waiting for a condition.
- **Common mistakes:** treating `signal` as guaranteed immediate execution of the awakened thread.

## Chapter 3 — Deadlocks (move after processes and synchronization)

### Lesson O3.1 — Deadlock and its four conditions [MUST]
- **Prerequisites:** O1.1 and O2.1.
- **Beginner must see:** processes hold resources while waiting for other resources.
- **Finer points:** mutual exclusion, hold-and-wait, no preemption and circular wait.
- **GATE-level:** identify the condition a prevention method removes.
- **Diagrams:** simple two-process/two-resource deadlock; four-condition panels.
- **Hand trace:** show who owns each resource and who waits.
- **Common mistakes:** defining deadlock as “a slow process”; treating all waiting as deadlock.

### Lesson O3.2 — Resource-allocation graphs [MUST]
- **Prerequisites:** O3.1.
- **Beginner must see:** process circle and resource square; request edge and assignment edge.
- **Finer points:** cycle criteria for one instance versus multiple instances.
- **GATE-level:** detect a cycle and decide what it proves.
- **Diagrams:** graph with edge-direction legend; one versus multiple resource instances.
- **Hand trace:** add one request/assignment edge at a time.
- **Common mistakes:** reversing assignment-edge direction; claiming every cycle means deadlock with multiple instances.

### Lesson O3.3 — Prevention, avoidance and Banker’s algorithm [MUST]
- **Prerequisites:** O3.1–O3.2; vectors and inequalities.
- **Beginner must see:** safe sequence as a possible order in which processes can finish.
- **Finer points:** Max, Allocation, Need, Available; safe/unsafe distinction; request test.
- **GATE-level:** safe-sequence NAT/MSQ and resource request check.
- **Diagrams:** Banker matrix and resource-return steps.
- **Hand trace:** calculate Need, repeatedly find a process whose Need fits Available, then release its Allocation.
- **Common mistakes:** subtracting in the wrong direction; assuming unsafe means already deadlocked.

### Lesson O3.4 — Detection, recovery, starvation and livelock [SHOULD]
- **Prerequisites:** O3.2–O3.3.
- **Beginner must see:** detect current deadlock versus prevent/avoid it earlier.
- **Finer points:** detection with multiple instances, process abort, resource preemption, rollback, victim selection, starvation/livelock.
- **GATE-level:** reason about which abort breaks a cycle and side-effects.
- **Diagrams:** wait-for graph and recovery sequence.
- **Hand trace:** update available resources after a process is terminated.
- **Common mistakes:** confusing deadlock with starvation or unsafe state.

## Chapter 4 — CPU and I/O scheduling

### Lesson O4.1 — CPU–I/O cycle and scheduling measures [MUST]
- **Prerequisites:** O1.1 process states.
- **Beginner must see:** process requests CPU, performs I/O, waits and returns.
- **Finer points:** arrival, burst, completion, waiting, turnaround, response, throughput, utilization.
- **GATE-level:** compute all metrics from a Gantt chart.
- **Diagrams:** CPU–I/O burst sequence; one annotated timeline.
- **Hand trace:** calculate each metric for two processes.
- **Common mistakes:** using turnaround − arrival twice; confusing response with waiting.

### Lesson O4.2 — FCFS and non-preemptive SJF [MUST]
- **Prerequisites:** O4.1.
- **Beginner must see:** ready queue order; shortest next burst when CPU becomes free.
- **Finer points:** arrival times, tie rules, average waiting time and starvation risk for SJF.
- **GATE-level:** draw Gantt chart and calculate average metrics.
- **Diagrams:** ready queue and Gantt charts.
- **Hand trace:** 3–4 processes with staggered arrivals.
- **Common mistakes:** scheduling a process before arrival; choosing a shorter process after a non-preemptive process has started.

### Lesson O4.3 — SRTF and preemption [MUST]
- **Prerequisites:** O4.2.
- **Beginner must see:** every new arrival can change the shortest remaining-time choice.
- **Finer points:** remaining burst, preemption instant, completion, waiting calculation.
- **GATE-level:** multi-arrival SRTF Gantt chart.
- **Diagrams:** time line with arrival events.
- **Hand trace:** update remaining time at every event point.
- **Common mistakes:** compare original burst instead of remaining burst.

### Lesson O4.4 — Round Robin and priority scheduling [MUST]
- **Prerequisites:** O4.1–O4.3; FIFO queue.
- **Beginner must see:** time quantum; unfinished process returns to queue tail; priority order.
- **Finer points:** time quantum effect, preemptive/non-preemptive priority, aging and starvation.
- **GATE-level:** queue simulation, waiting time, context switch counting.
- **Diagrams:** queue rotation and priority-over-time graph.
- **Hand trace:** draw ready queue after every quantum.
- **Common mistakes:** requeueing a process that has completed; forgetting the arrivals during a time slice.

### Lesson O4.5 — Multilevel queues, multiprocessors and context-switch cost [SHOULD]
- **Prerequisites:** O4.2–O4.4.
- **Beginner must see:** more than one ready queue or CPU; assignment constraints.
- **Finer points:** multilevel feedback queue, affinity, per-CPU priority order, overhead.
- **GATE-level:** simple two-processor priority and waiting-time problems.
- **Diagrams:** multiple CPU lanes and queue assignment.
- **Hand trace:** dispatch events at every CPU becoming free.
- **Common mistakes:** running one process on two CPUs; applying a global priority order when the question gives per-CPU orders.

## Chapter 5 — Memory management

### Lesson O5.1 — Address spaces and contiguous allocation [MUST]
- **Prerequisites:** powers of two, bytes/KB/MB, process memory layout.
- **Beginner must see:** RAM split into allocated regions and holes.
- **Finer points:** fixed/variable partitions, first/best/worst/next fit, internal/external fragmentation, compaction.
- **GATE-level:** allocate sequential requests and count residual holes.
- **Diagrams:** memory map before/after every allocation.
- **Hand trace:** update a sorted list of holes after each request.
- **Common mistakes:** sorting holes for first fit when the question requires address order; confusing total free memory with largest free hole.

### Lesson O5.2 — Paging and address translation [MUST]
- **Prerequisites:** binary powers, logical and physical addresses.
- **Beginner must see:** pages are virtual units; frames are physical slots; offset is retained.
- **Finer points:** page number/offset split, PTE, internal fragmentation, memory overhead, protection.
- **GATE-level:** page/frame calculation and decimal address translation.
- **Diagrams:** page-to-frame map and bit split.
- **Hand trace:** translate one address completely.
- **Common mistakes:** using page size as the number of pages; forgetting byte- versus word-addressing.

### Lesson O5.3 — Segmentation and comparison with paging [SHOULD]
- **Prerequisites:** O5.2.
- **Beginner must see:** logical segment number plus offset; base and limit check.
- **Finer points:** protection/sharing, external fragmentation, segmentation with paging concept.
- **GATE-level:** address validity and comparison questions.
- **Diagrams:** segment table and bounds check.
- **Hand trace:** translate a valid and invalid segment address.
- **Common mistakes:** treating a segment as fixed-size page.

### Lesson O5.4 — Page-table structures and MMU [MUST]
- **Prerequisites:** O5.2; number of bits and entries per page.
- **Beginner must see:** MMU uses tables to translate; OS creates/manages them.
- **Finer points:** multi-level, hashed and inverted page tables; TLB relationship; permission trap.
- **GATE-level:** page-table size, levels, outer/inner table count, MMU responsibility.
- **Diagrams:** one-level table, multi-level tree, inverted table concept.
- **Hand trace:** split virtual address into indices and offset.
- **Common mistakes:** saying MMU allocates the process page table; assuming every page-table level is one physical page without checking the question.

## Chapter 6 — Virtual memory

### Lesson O6.1 — Demand paging and page faults [MUST]
- **Prerequisites:** O5.2 and O5.4.
- **Beginner must see:** a page can be absent from RAM and fetched from backing store when used.
- **Finer points:** valid/present bit, page-fault trap, dirty bit, restart instruction.
- **GATE-level:** distinguish page fault from TLB miss/cache miss.
- **Diagrams:** page-fault service path.
- **Hand trace:** follow a memory reference through the fault handler.
- **Common mistakes:** calling every TLB miss a page fault.

### Lesson O6.2 — TLB and effective access time [MUST]
- **Prerequisites:** O5.4 and O6.1.
- **Beginner must see:** TLB is a small cache of address translations.
- **Finer points:** hit ratio, reach, ASID/PID, TLB miss page-table walk, page-fault probability, dirty writeback.
- **GATE-level:** entry-size and EAT calculations.
- **Diagrams:** CPU–TLB–page-table–memory flow.
- **Hand trace:** calculate entry fields and weighted access time.
- **Common mistakes:** adding page-fault disk time to every TLB miss; failing to say whether fault rate is unconditional or conditional.

### Lesson O6.3 — FIFO, OPT and LRU replacement [MUST]
- **Prerequisites:** frames and reference strings.
- **Beginner must see:** when all frames are full, an algorithm chooses a victim.
- **Finer points:** recency versus future use, hits/faults, frame initialization.
- **GATE-level:** page fault count and policy identification.
- **Diagrams:** frame trace table, FIFO queue, LRU recency order and OPT future view.
- **Hand trace:** solve the same reference string with all three algorithms.
- **Common mistakes:** marking a hit as a fault; updating recency only after faults.

### Lesson O6.4 — Belady, Clock, LFU/MFU, locality and thrashing [SHOULD]
- **Prerequisites:** O6.3.
- **Beginner must see:** replacement policies have different metadata; working sets explain locality.
- **Finer points:** stack property, Belady's anomaly, Second-Chance/Clock, frequency counters, local/global replacement, working-set and page-fault-frequency ideas.
- **GATE-level:** policy comparison and concept MSQ.
- **Diagrams:** FIFO anomaly traces; Clock ring; working-set graph.
- **Hand trace:** one Clock trace and one changing-frame-count experiment.
- **Common mistakes:** saying every algorithm has Belady's anomaly; confusing least frequent with least recently used.

## Chapter 7 — File systems and disk scheduling

### Lesson O7.1 — Files, metadata, directories and access methods [MUST]
- **Prerequisites:** file and block idea; process/file descriptors from O1.5.
- **Beginner must see:** name maps to metadata, which maps to data blocks.
- **Finer points:** file attributes, operations, sequential/direct/indexed access, directory lookup and open-file tables.
- **GATE-level:** directory scanning and access-method questions.
- **Diagrams:** directory tree, inode/FCB and open-file table.
- **Hand trace:** open a path and follow its metadata to data blocks.
- **Common mistakes:** treating filename as disk block address; confusing file descriptor with inode.

### Lesson O7.2 — Contiguous, linked and indexed allocation [MUST]
- **Prerequisites:** block size and pointer width.
- **Beginner must see:** three ways to find a file's blocks.
- **Finer points:** external fragmentation, sequential/random access, file growth, pointer overhead.
- **GATE-level:** block insertion, internal fragmentation, inode file-size calculations.
- **Diagrams:** allocation layouts and direct/indirect pointer tree.
- **Hand trace:** calculate number of blocks, pointers and maximum bytes.
- **Common mistakes:** forgetting the pointer space inside each linked block; mixing GB and GiB.

### Lesson O7.3 — Free-space management [MUST]
- **Prerequisites:** number of blocks and bits/bytes.
- **Beginner must see:** the OS needs a record of unused disk blocks.
- **Finer points:** bitmap, linked list, grouping and counting; overhead and traversal.
- **GATE-level:** count tracking blocks and metadata space.
- **Diagrams:** bitmap row and free-block linked list.
- **Hand trace:** calculate representable block numbers per list block.
- **Common mistakes:** forgetting next-pointer bytes; confusing free blocks with allocated file blocks.

### Lesson O7.4 — Disk geometry, disk access and scheduling [MUST]
- **Prerequisites:** powers of two, RPM, sectors and time units.
- **Beginner must see:** seek moves the head; rotation waits for sector; transfer reads bytes.
- **Finer points:** track/cylinder/surface/sector, average rotational latency, transfer time, FCFS/SSTF/SCAN/C-SCAN/LOOK/C-LOOK.
- **GATE-level:** head path, seek movement, average access time and disk capacity.
- **Diagrams:** disk cutaway, head-movement timeline and request table.
- **Hand trace:** sort/choose requests according to each named policy and sum movement.
- **Common mistakes:** omitting initial direction, counting a cylinder reversal incorrectly, mixing RPM with milliseconds.

### Lesson O7.5 — File-system integration and PYQ review [SHOULD]
- **Prerequisites:** O7.1–O7.4.
- **Beginner must see:** how directory lookup, metadata, free-space tracking and block allocation fit together.
- **Finer points:** mounting, file-system layers and reliability concepts at overview level.
- **GATE-level:** mixed question combining inode, allocation and disk operations.
- **Diagrams:** complete file path from directory to disk block.
- **Hand trace:** allocate a file, update free-space map and find its blocks.
- **Common mistakes:** learning each formula without understanding which metadata structure it belongs to.

**Suggested total:** 34 lessons × roughly 45–90 minutes = about 25.5–51 focused reading hours, plus separate solving/revision. This is a book-level estimate, not a guarantee that a weak student masters OS in that time.

---

# PART 6 — Audit of all 78 supplied PYQs

**How to read this table:** `Key in source` reproduces the option/range marked in the supplied file. `Audit` is my independent check from the transcription. “Figure missing” means I cannot truthfully re-solve the item without the figure. “Check against master paper” means the source transcription/key raises an issue or the solution is not established by the attached bank alone. A web citation to GATE's general answer-key rules does not prove any specific question key.

The official GATE 2026 answer-key page explains that master-paper keys match master-paper question order, that MCQ/MSQ/NAT marking differs, and that **MTA means Marks To All**. It also advises checking the matching master question paper and answer key. See [GATE 2026 Master Question Papers and Answer Keys](https://gate2026.iitg.ac.in/QPs-answer-keys.html). The project should use the corresponding year-specific official archive for every row below.

| # | PYQ ID | Plan lesson | Concept tested / trap | Key recorded in source | Audit / transcription check |
|---:|---|---|---|---|---|
| 1 | 2026_AN_Q23 | O4.2 | Which algorithm cannot be preemptive | B — FCFS | **Matches.** FCFS is conventionally non-preemptive; SRTF and RR are preemptive; priority can be either. |
| 2 | 2026_FN_Q29 | O3.1–O3.3 | False statements about Banker’s and resource-allocation edges | A, C | **Matches.** Banker’s is for avoidance, not prevention; assignment edge is resource→process, not process→resource. |
| 3 | 2026_FN_Q35 | O3.1 | Minimum instances to guarantee no deadlock for 5 processes, max 2 each | 6 | **Matches.** Minimum m = n(k−1)+1 = 5(2−1)+1 = 6. |
| 4 | 2026_AN_Q51 | O2.3 | Interleavings of three identical semaphore-controlled processes | A, B, C | **Plausible from the code.** `$` occurs when the second increment makes X=2, so three `*` before `$` (option D) cannot occur. Keep an explicit process-by-process schedule for each accepted option. |
| 5 | 2026_AN_Q53 | O7.3 | Free-block linked-list storage overhead | 16417 | **Matches.** Disk blocks = 16 GiB/2 KiB = 2^23; each list block holds (2048−4)/4 = 511 block numbers; ceiling(2^23/511) = 16417. |
| 6 | 2026_AN_Q54 | O6.2 | TLB reach, entries and entry size | 1536 bytes | **Matches under packed bit-field accounting.** Reach 1 MiB / 4 KiB = 256 entries; VPN bits=24, PFN bits=18, PID=4, control=2; 48 bits = 6 bytes each; 256×6=1536. State no padding is assumed. |
| 7 | 2026_AN_Q55 | O5.1 | Best-fit holes after allocating 16 KB then 9 KB | 3 | **Matches.** 16 goes into 18, leaving 2; 9 fits exact 9; initially 4 and 7 are below 8, plus new 2 = 3. |
| 8 | 2026_FN_Q59 | O7.4 | Seek + rotational latency + transfer for 30 random sectors on three tracks | 77.3 ms | **Matches the stated model.** Head movement 0→5→12→7 is 17 ms; 30 random single-sector accesses add 30×(2 ms average rotation + 0.01 ms transfer)=60.3 ms; total 77.3 ms. Explain why random sectors are treated as separate accesses. |
| 9 | 2026_FN_Q63 | O1.3 | fork inside a loop with child `continue` | 4 | **Matches.** Three forks create a chain of three children plus the original parent; four processes reach `printf`. |
| 10 | 2026_FN_Q64 | O4.2 | FCFS waiting time for two periodic arrival streams | 9.5 | **Matches.** A consistent FCFS queue gives waiting times 0,5,4,8,8,11,12,14,16,17; mean = 9.5. Show the exact tie order at t=30. |
| 11 | 2025_FN_Q14 | O5.2 | Maximum entries in a page table from logical address and page size | 2^21 | **Matches.** Page offset = 11 bits; virtual page number = 32−11=21 bits. |
| 12 | 2025_AN_Q26 | O4.3 | SRTF average turnaround time | D — 19 | **Matches.** Gantt: P1 0–2, P3 2–8, P1 8–16, P4 16–25, P2 25–38; turnaround times 16,37,6,17; average 19. |
| 13 | 2025_FN_Q29 | O1.5 + O4.1 | Ready-queue re-entry after blocking I/O | 21 | **Matches under the question's simplified I/O model.** One `scanf` plus 20 `printf` calls cause 21 I/O returns; each return re-enters ready queue. State that every `printf` is assumed to perform the stated I/O operation. |
| 14 | 2025_FN_Q38 | O4.5 | Two processors with separate non-preemptive priority orders | A — 9.00 | **Matches.** M1 starts P1 (20 ms), M2 starts P2 (16 ms); M2 then takes P3, M1 takes P4; waits are 0,0,16,20; mean 9. |
| 15 | 2025_AN_Q47 | O6.3–O6.4 | Identify page-replacement policy from frame-content figure | D recorded | **Cannot verify. Figure is missing.** Reattach `[IMAGE_Q_47_1]`; do not keep an “independently checked” badge until then. |
| 16 | 2025_AN_Q48 | O3.2–O3.4 | Resource-allocation graph; which aborts eliminate all cycles | C, D | **Consistent with the stated graph.** Aborting P2 breaks both cycles; aborting P1 and P4 also removes the blocked cycle dependencies. Include a graph before/after for each accepted choice. |
| 17 | 2025_FN_Q51 | O7.2 | Internal fragmentation in linked allocation with 4-byte link per 64 KiB block | 65468 bytes | **Matches.** Data per block=65536−4=65532; file needs 17 blocks; unused data capacity=17×65532−2^20=65468. |
| 18 | 2025_FN_Q54 | O6.3 | “Optimal” replacement with only four-reference lookahead | 6 | **Not independently confirmed.** The problem needs a precise tie-breaking rule for pages whose next use is outside the visible four-reference window. Verify the exact wording/key and document the intended limited-lookahead policy. |
| 19 | 2025_AN_Q58 | O5.4 | Two-level page table index width | 11 | **Matches.** Page=2^12 bytes; inner-table entries=4096/8=512=2^9; outer index=32−12−9=11 bits. |
| 20 | 2024_FN_Q12 | O1.4 | Thread-private versus process-shared state | D | **Matches.** Threads have private execution state/stack; file descriptors and address space are shared in the standard process-thread model. |
| 21 | 2024_AN_Q28 | O5.4 | MMU responsibilities | B, C, D | **Matches.** Translation and protection/presence faults are hardware/MMU responsibilities; OS allocates/manages a new process page table. |
| 22 | 2024_FN_Q26 | O1.1 | Impossible process-state transitions | B, C | **Matches.** Waiting→running requires ready first; ready→waiting cannot occur without running. |
| 23 | 2024_AN_Q12 | O0.2 + O1.1 | Events that always move running process to non-running state | A, B | **Matches under the stated conditions.** Blocking disk read and a page fault to swap block the process; disk interrupt for another process and timer interrupt do not necessarily switch it out. |
| 24 | 2024_AN_Q54 | O4.2–O4.3 | SRTF and non-preemptive SJF average waiting times | B — SRTF 6, NP-SJF 7.5 | **Matches.** SRTF Gantt yields waiting 16,3,0,5 (mean 6); NP-SJF runs A then C,B,D, waiting 0,11,6,13 (mean 7.5). |
| 25 | 2024_FN_Q64 | O2.1 | Atomic statement interleavings for two shared variables | A | **FACT-DOUBT — the source transcription is wrong, but the official key is right.** The supplied file says T2 executes `a = 2 + a`; the official GATE 2024 CS1 master paper says `a = 2 * a`. With the original multiplication statement, the possible final pairs are `(4,4)`, `(3,3)` and `(4,3)`, so option A is correct. Replace the copied `+` with `*`; do not mark the official key wrong. [Official master question paper, Q40](https://gate2026.iitg.ac.in/doc/download/2024/CS124S5.pdf). |
| 26 | 2024_AN_Q44 | O2.3 | Semaphore interleaving and deadlock | B, C | **Matches.** If T1 gets s1 first, it prints 1 then blocks on s2 while holding s1; if T2 runs first, it signals s2 and T1 can print 2. |
| 27 | 2024_AN_Q61 | O7.4 | Random-sector disk read time | 29.50–30.50 s | **Matches the stated random-I/O model.** 3000 separate sectors × (5 ms seek + 5 ms average rotation + 0.02 ms transfer) ≈ 30.06 s. State this assumption explicitly. |
| 28 | 2024_FN_Q39 | O7.4 | Number of cylinders from disk capacity | 4096 | **Matches.** 512 GiB /(32 surfaces×4096 sectors/track×1024 bytes/sector)=4096 cylinders. |
| 29 | 2024_FN_Q53 | O1.3 | fork/wait inside loop; total printf count | 14 | **Matches.** The process tree is binary by remaining loop depth: 2+4+8=14 prints. Include the fork tree and wait order. |
| 30 | 2024_FN_Q50 | O5.2 | Virtual-to-physical address translation | 6596 | **Matches.** 2500/2048 = page 1, offset 452; page 1 maps to frame 3; physical address = 3×2048+452=6596. |
| 31 | 2024_AN_Q47 | O5.4 | Minimum and maximum page-table pages for 2000 pages | 1028 | **Matches.** 32-bit VA, 4 KiB pages, 4-byte PTE gives 1024 entries per page and 1024 outer entries. Minimum total=outer+2 inner=3; maximum=outer+1024 inner=1025; sum=1028. |
| 32 | 2023_FN_Q22 | O1.2/O1.4 | Context switch between threads of same process | B, C, D | **Matches.** Save SP, PC and general registers; same process address-space/page-table base usually remains. |
| 33 | 2023_FN_Q23 | O0.2 | User-to-kernel mode transition | C, D | **Matches.** Page fault is an exception/trap; system call enters kernel. A normal function call and `malloc` do not always do so. |
| 34 | 2023_FN_Q27 | O4.4 | Scheduling algorithms that can cause starvation | A, C, D | **Official-key caveat, not a transcription error.** The official GATE 2023 final answer key records `A, C, D or C, D` for this MSQ. Priority and SJF can starve a process under continuing arrivals. In the usual finite-job FCFS queue model, a process already in the queue is served in turn, so FIFO is not normally listed as a starvation policy. Teach that distinction, note the official alternative key, and avoid presenting FIFO starvation as an unconditional fact. [Official GATE 2023 final answer key](https://gate2026.iitg.ac.in/doc/download/Answer_keys2023/CS_ANS_GATE2023.pdf). |
| 35 | 2023_FN_Q38 | O2.3 | Binary semaphore versus counting semaphore with non-atomic update | C — 12,7 | **Consistent.** Binary semaphore serializes five increments and three decrements: 10+5−3=12. Counting semaphore initialized to 2 permits overlapping non-atomic updates and a lower final value; show a concrete interleaving proving 7. |
| 36 | 2023_FN_Q42 | O5.2/O5.4 | Decoder wiring and memory-block starting addresses | C — 0,8,16,24 | **Figure missing.** The text says IA4 and IA3 are decoder inputs; the result is plausible from those address bits, but the wiring image must be restored before the key can be independently verified. |
| 37 | 2023_FN_Q57 | O6.3 + O5.2 | Page faults for transposed array traversal with LRU | 4096 | **Consistent with the stated row-major, page/frame setup.** Each page holds 4 rows; the column-wise traversal cycles through 32 page groups with 30 frames, causing repeated group faults. Include the full first-column trace to make 4096 reproducible. |
| 38 | 2023_FN_Q58 | O5.4 | Number of page-table levels | 5 | **Matches.** 4 KiB page / 8-byte PTE gives 512 entries = 9 index bits per level; 57-bit VA minus 12 offset = 45 bits; 45/9=5 levels. |
| 39 | 2022_FN_Q19 | O2.3 | Semaphore initialization for repeating BCA sequence | C | **Matches.** Start S1=1, S2=0, S3=0 so T2 prints B, T1 prints C, T3 prints A, then the cycle repeats. |
| 40 | 2022_FN_Q26 | O3.1–O3.2 | True deadlock statements | A, D | **Matches.** Circular wait is necessary; with one instance per type, all-assignment edges and no request edges cannot represent a current wait cycle. A cycle in a multiple-instance wait-for setting needs careful interpretation. |
| 41 | 2022_FN_Q38 | O6.2 | Identify false TLB/inverted/hashed page-table statement | C | **Matches.** Inverted-page-table lookup time is not necessarily identical for all addresses; hash collisions can produce differing chain/search cost. |
| 42 | 2022_FN_Q42 | O4.4 | Round Robin switch-count constraints | D is not possible | **Matches by direct RR simulation of the four options.** For D (P=3,Q=7,R=7,S=3), the required single R→Q switch does not occur; A, B and C meet the stated transition counts. |
| 43 | 2022_FN_Q63 | O7.2 | Insert a block in the middle of contiguous versus linked file | 153 | **Matches under standard block-access counting.** Contiguous allocation needs 101 accesses to shift/write the tail/new block; linked allocation needs 52 to traverse/update/write; sum 153. The solution must define whether head metadata access counts. |
| 44 | 2022_FN_Q64 | O6.3 | LRU page-fault rate | 0.6 | **Matches.** Direct trace gives 9 faults in 15 references = 0.6. |
| 45 | 2021_FN_Q31 | O5.2 | Paging and fragmentation/overhead | A, C | **Matches.** Paging avoids external fragmentation; page tables and related metadata add memory overhead; page size affects internal fragmentation. |
| 46 | 2021_FN_Q60 | O0.2/O1.5 | C library calls that always invoke system calls on Unix/Linux | A, C | **Check platform wording.** `sleep` normally uses a kernel wait primitive; `exit` terminates via OS service. `malloc` may or may not request more memory; `strlen` is user-space. Keep the Linux/POSIX implementation caveat visible. |
| 47 | 2021_AN_Q29 | O4.1/O4.4 | Scheduling statements | A, C, D | **Matches under standard scheduling assumptions.** Turnaround includes waiting; RR does not need known burst length; preemption needs timer/hardware support. |
| 48 | 2021_FN_Q34 | O7.1 | Linear-list directory operations that require a full scan | A, C | **Matches with the directory-name uniqueness assumption.** Creating a new entry and renaming must check for duplicates; delete/open may stop after finding the target. Explain what “full scan” means. |
| 49 | 2021_FN_Q14 | O4.2 | Minimum average waiting time in non-preemptive scheduler with known bursts | 12 | **Matches.** SJF order 10,16,20 gives waits 0,10,26; average 12. |
| 50 | 2021_AN_Q41 | O1.4/O2.2 | Two processes, two threads each, global-in-process lock and thread-local variable | A, D | **Matches if “global” is per process, as C process address spaces imply.** Each process's two threads serialize x to 2; each thread has its own y=1. The solution should explicitly say the two processes do not share ordinary globals. |
| 51 | 2021_AN_Q13 | O3.4/O2.2 | Global lock resource-acquisition scheme | A, B, C | **Consistent.** Serializing acquisition avoids circular wait in this scheme; repeatedly aborting/restarting can livelock or starve. |
| 52 | 2021_FN_Q59 | O2.3 | Five threads, semaphore count five, each acquires twice | A, B, D | **Consistent.** Sequential execution yields 5; overlapping non-atomic increments can lose updates; each thread holding one permit while waiting for a second can deadlock all five. Include explicit schedules. |
| 53 | 2021_AN_Q62 | O5.4 | Memory overhead for a three-level page table | 4108 KB | **Figure missing.** The level split/entries per node are in the absent diagram; do not validate the numeric key from the text alone. |
| 54 | 2020_FN_Q14 | O5.1 | Best-fit versus first-fit leftover hole | C | **Matches.** Best fit chooses the smallest suitable hole, so its residual hole cannot exceed the residual from first fit under the given assumptions. |
| 55 | 2020_FN_Q18 | O1.1 | Process-state transitions under preemptive scheduling | C | **Matches.** Running→ready, ready→running and blocked→ready are possible; blocked→running is not direct. |
| 56 | 2020_FN_Q38 | O2.4 | Reusable barrier pattern built from semaphores | A | **Matches.** The last process signals b; processes pass the baton so no process enters Q until every process has completed P. |
| 57 | 2020_FN_Q40 | O7.4 | SSTF service order and identify false statement | B | **Matches.** From cylinder 100 the service order is R(110), T(115), Q(85), S(30), P(155); therefore Q is after T, not after S and before T. |
| 58 | 2020_FN_Q61 | O4.2/O4.4 | SJF versus RR average turnaround difference | 5.25 | **Figure missing.** The process burst lengths are in the absent image; cannot re-solve the NAT. |
| 59 | 2020_FN_Q37 | O6.2 | TLB EAT plus page-fault cost and dirty-page writeback | 154.5–155.5 ns | **Key is consistent under the standard conditional interpretation; wording needs an explicit assumption in the solution.** Apply the 10% page-fault probability to the 5% TLB-miss path. Then EAT = `0.95×120 + 0.05×[0.90×220 + 0.10×(0.80×5120 + 0.20×10120)] = 154.5 ns`. This reproduces the supplied key. State clearly that the 10% is conditional on a TLB miss; otherwise the problem's denominator is easy for a beginner to misread. A worked explanation using this convention appears in [MADE EASY's GATE 2020 solution set](https://www.madeeasy.in/uploads/examsolution/209ufrep_cs_gate_2020_exam_updated.pdf). |
| 60 | 2019_FN_Q29 | O1.3 | Fork for each even loop value; count child processes | 31 | **Matches.** Five fork rounds create 1+2+4+8+16=31 children (32 total processes). |
| 61 | 2019_FN_Q32 | O2.1/O2.3 | Concurrent process code and min/max shared variable | 80 | **Figure missing.** The process statements are in the absent image; no honest re-solve is possible. |
| 62 | 2019_FN_Q42 | O6.2 | Maximum distinct word addresses covered by a 128-entry TLB | B — 256×2^10 | **Matches.** One 8 KiB page contains 2048 4-byte words; 128 entries cover 262144 word addresses = 256×1024. |
| 63 | 2019_FN_Q43 | O3.1/O3.2 | Resource-count condition guaranteeing only p and q can finish | A | **Consistent.** p and q need no more resources and can release Xp+Xq; if every other process requires more additional instances than that, none can finish. Explain the strict inequality. |
| 64 | 2019_FN_Q51 | O4.3 | SRTF waiting time with parameter Z | 2 | **Figure missing.** Arrival/burst table is in the absent image. |
| 65 | 2019_FN_Q63 | O7.2 | Inode maximum file size using direct/single/double indirect pointers | 3.7–3.8 OR 4.0–4.1 | **Unit caveat.** 12+1024+1024² data blocks × 4096 bytes = 4,299,210,752 bytes = about 4.30 decimal GB or 4.00 GiB. The 4.0–4.1 range follows a binary-GiB interpretation; the 3.7–3.8 range is not explained by the stated parameters. Recheck the answer-key range and unit convention. |
| 66 | 2018_FN_Q20 | O6.2 | Derive page-fault rate from average access times | B | **Matches.** X=(1−p)M+pD, so p=(X−M)/(D−M). |
| 67 | 2018_FN_Q34 | O3.1 | Largest K always avoiding deadlock for 3 processes / 4 instances | 2 | **Matches.** m ≥ n(K−1)+1; 4≥3(K−1)+1 gives K≤2. |
| 68 | 2018_FN_Q49 | O3.3 | Banker safe-state check | A | **Matches.** Need = Max−Allocation; a safe completion order exists using Available=(3,3,0). The solution should show the order, not simply label it safe. |
| 69 | 2018_FN_Q50 | O2.4 | Assign semaphore names for producer-consumer solution | C | **Matches if the question's deliberately swapped names are followed.** Its verbal descriptions use `empty` for the consumer-available/full count and `full` for the producer-available/empty-slot count. Keep the exact names but explicitly call out this naming inversion. |
| 70 | 2018_FN_Q63 | O7.4 | SSTF disk request sequence and movement/reversal power | 85 mW | **Matches.** SSTF cylinder order 86,72,116,134,20,16 gives 200 cylinders moved =40 mW under the stated conversion; three reversals ×15=45 mW; total 85 mW. |
| 71 | 2017_AN_Q14 | O1.4 | Which state is shared by all threads | B — address space only | **Matches.** PC, stack and registers are thread-private; process address space is shared. |
| 72 | 2017_AN_Q21 | O7.2 | File allocation methods without external fragmentation | D — linked and indexed | **Matches.** Contiguous allocation is vulnerable to external fragmentation; linked and indexed allocation do not require one continuous run. |
| 73 | 2017_FN_Q25 | O1.4 | Thread-shared heap and globals | D | **Matches.** Threads in one process share the process address space, including global data and heap. |
| 74 | 2017_FN_Q34 | O4.3 | SRTF waiting time from process table | 3.0 | **Figure missing.** Arrival/burst data are in the absent image. |
| 75 | 2017_FN_Q61 | O2.2/O3.1 | Minimum threads and non-reentrant locks for deadlock | D — x=1,y=1 | **Matches.** One thread can deadlock itself by trying to reacquire the same non-reentrant lock it already holds. |
| 76 | 2017_AN_Q42 | O3.3 | Safe/not-safe and deadlocked/not-deadlocked from allocation/max table | B — safe, not deadlocked | **Figure missing.** Resource table is absent; cannot independently verify the classification. |
| 77 | 2017_FN_Q36 | O6.4 | Belady’s anomaly for random and LRU | B — S1 true, S2 false | **Matches conceptually.** LRU is a stack algorithm and does not suffer Belady's anomaly; random replacement can. The solution should be careful about “can” versus “always”. |
| 78 | 2017_AN_Q57 | O4.4 | Preemptive priority average waiting time | 29.0 | **Figure missing.** Arrival/burst/priority table is in the absent image. |

## PYQ bank arithmetic and data-quality verdict

The six supplied topic counts add correctly: 21+14+11+11+9+12 = **78 questions**. Marks add: 37+21+20+20+14+14 = **126**. The stated topic difficulty counts and question-type counts also add to their row totals. 126/1500 = **8.4%**, and 126/15 = **8.4 marks per selected paper**.

That arithmetic is internally consistent. It does **not** independently prove that the 15-paper sample is complete, that all 78 classifications are correct, or that 8.4 marks is a reliable forecast for GATE 2027. Put the exact 15 paper/session IDs and all inclusion/exclusion rules beside the table.

**Missing figures identified in the attachment (9):**

- 2025_AN_Q47
- 2023_FN_Q42
- 2021_AN_Q62
- 2020_FN_Q61
- 2019_FN_Q32
- 2019_FN_Q51
- 2017_FN_Q34
- 2017_AN_Q42
- 2017_AN_Q57

Do not label these nine rows “verified”. Restore each figure as a clear crop and include the official master paper reference.

---

# PART 7 — Three new question ideas per lesson

These are **new question ideas**, not claimed GATE PYQs. Each should be written from scratch and checked for one unambiguous correct answer.

| Lesson | MCQ idea | MSQ idea | NAT idea |
|---|---|---|---|
| O0.1 OS basics | Which operation needs an OS service rather than ordinary arithmetic? | Select all statements distinguishing an OS, shell and application. | Count how many times a simple file-open workflow crosses the system-call boundary. |
| O0.2 System calls/mode | Which event always causes entry to kernel mode under the stated model? | Select events that cause a mode switch but do not necessarily cause a process switch. | Count mode transitions in a given event sequence. |
| O1.1 Process states | Which transition is impossible without an intervening ready state? | Select all valid process-state transitions. | Count how many times a process enters ready state in a timeline. |
| O1.2 PCB/context | Which saved field is required when switching between two threads of the same process? | Select all per-thread versus process-shared context fields. | Count the context switches in a short schedule. |
| O1.3 fork/exec/wait | Which process continues after a successful `exec`? | Select all true statements about parent/child return values and address spaces. | Count children created by nested `fork()` conditions. |
| O1.4 Threads | Which item is not shared by ordinary threads in one process? | Select properties of many-to-one and one-to-one mapping. | Count the number of stacks after creating T threads in P processes. |
| O1.5 IPC | Which IPC mechanism lets two processes map a common memory area? | Select statements comparing pipes, shared memory and message passing. | Count messages consumed before a process blocks in a specified queue. |
| O2.1 Race/critical section | Which interleaving violates mutual exclusion? | Select all legal outcomes of two atomic statement sequences. | Find the minimum final shared counter after a specified interleaving. |
| O2.2 Mutex/hardware | Which property does a spinlock have while waiting? | Select all conditions under which a non-reentrant lock can self-deadlock. | Count the minimum threads/locks needed for a specified deadlock. |
| O2.3 Semaphores | Which semaphore initial value represents N empty slots? | Select all possible output strings under a wait/signal program. | Find the final semaphore value after a sequence of operations. |
| O2.4 Classical problems | Which semaphore protects the buffer's critical update? | Select all conditions under which readers may starve writers. | Count the maximum number of producers that can be inside a critical region. |
| O2.5 Monitors/barriers | What does condition wait do to monitor ownership? | Select all schedules in which no thread passes a barrier early. | Find the minimum number of signals required for N waiting threads. |
| O3.1 Deadlock conditions | Which necessary condition is broken by preempting a resource? | Select all deadlock-condition combinations in a resource-sharing story. | Find the minimum identical-resource count guaranteeing no deadlock. |
| O3.2 RAG | Which arrow represents a resource assigned to a process? | Select all graph structures that prove deadlock for single-instance resources. | Count directed cycles in a small allocation graph. |
| O3.3 Banker | Which vector is calculated as Max minus Allocation? | Select all safe sequences for a given state. | Find one valid safe-sequence order or report 0 if none exists. |
| O3.4 Detect/recover | Which recovery action may cause starvation? | Select all differences among deadlock, starvation and livelock. | Count processes that can finish after aborting a chosen victim. |
| O4.1 Scheduling measures | Which metric includes CPU burst plus ready-queue waiting? | Select all correct formulas for waiting/turnaround/response. | Compute average waiting time from a supplied Gantt chart. |
| O4.2 FCFS/SJF | Which process does non-preemptive SJF choose when CPU becomes free? | Select statements that hold for FCFS and SJF. | Compute average waiting time for staggered arrivals. |
| O4.3 SRTF | Which new arrival causes preemption under SRTF? | Select all intervals in which a named process owns the CPU. | Compute turnaround time of the process that finishes last. |
| O4.4 RR/Priority | Which time quantum makes RR behave most like FCFS? | Select algorithms that can starve under continuing arrivals. | Count context switches in an RR schedule. |
| O4.5 Multiprocessor | Which assignment is feasible under two different CPU priority orders? | Select all valid simultaneous dispatch choices. | Compute average waiting time after an optimal feasible assignment. |
| O5.1 Allocation | Which hole does best fit select? | Select allocations that leave no external fragmentation in the shown map. | Count holes below a given size after sequential allocations. |
| O5.2 Paging | Which address bits are unchanged during translation? | Select statements about page/frame and fragmentation. | Translate a decimal virtual address using a supplied page table. |
| O5.3 Segmentation | What happens when offset exceeds segment limit? | Select all differences between segmentation and paging. | Translate a segment:offset pair or return −1 if invalid. |
| O5.4 Page tables/MMU | Which component raises a protection fault? | Select statements about multi-level, hashed and inverted page tables. | Find number of page-table levels for given VA, page size and PTE. |
| O6.1 Demand paging | What triggers a page fault? | Select all steps in the correct page-fault service order. | Find total faults for a short reference sequence with an initially empty memory. |
| O6.2 TLB/EAT | Which event is a TLB miss but not a page fault? | Select all factors that affect TLB reach and EAT. | Compute EAT with a stated conditional/unconditional fault probability. |
| O6.3 FIFO/OPT/LRU | Which policy uses future knowledge? | Select all policies that suffer Belady's anomaly for the given reference string. | Count LRU faults for five frames. |
| O6.4 Thrashing/Clock | Which algorithm uses a reference bit and circular hand? | Select all true statements about stack algorithms and thrashing. | Count Clock replacements for a supplied page string. |
| O7.1 Files/directories | Which structure maps a name to file metadata? | Select all file operations that require directory lookup. | Count directory entries examined under a stated lookup order. |
| O7.2 Allocation/inode | Which allocation method supports efficient direct access? | Select all properties of linked/indexed/contiguous allocation. | Compute maximum file size from block size and pointer width. |
| O7.3 Free space | How many bits does a bitmap need for N blocks? | Select all trade-offs of bitmap and linked-list tracking. | Count index blocks required to store all free-block numbers. |
| O7.4 Disk | Which disk algorithm always services the closest pending cylinder? | Select all true statements about seek, rotational and transfer time. | Compute total head movement for a given SSTF/SCAN queue. |
| O7.5 Integration | Which data structure must be updated after allocating a block? | Select all structures involved in opening and extending a file. | Compute total metadata blocks after allocating a file and updating free space. |

---

# PART 8 — What is missing from the subject / plan

There is no missing official **headline** in the five-line syllabus. The missing items are the explicit lessons and finer concepts inside those headlines. The high-priority additions are:

1. OS foundations, user/kernel mode, system-call versus ordinary function-call distinction, interrupt/trap/exception.
2. PCB, schedulers/queues, context switch, fork/exec/wait/exit, process tree, parent/child memory behaviour, zombie/orphan concepts.
3. User/kernel threads and mapping models; shared/private thread state.
4. IPC mechanisms, not just the phrase IPC: shared memory, message passing, pipes/FIFOs and basic signals.
5. Critical-section requirements, race/atomicity, mutex/spinlock, hardware atomic primitives, Peterson, semaphores, classical synchronization, monitors/condition variables and barriers.
6. Resource-allocation graphs and arrow directions; the one-resource-instance versus multiple-instance distinction; safe/unsafe/deadlocked; full Banker’s algorithm; detection and recovery.
7. CPU scheduling metrics and all core policies: FCFS, SJF, SRTF, priority, RR; aging/starvation; multilevel queues; context-switch cost and multiprocessor cases.
8. Contiguous allocation strategies and fragmentation; paging, segmentation, address translation, page-table size and structures; MMU/TLB distinction.
9. Demand paging, page-fault handling, FIFO/OPT/LRU, other named policy concepts, Belady’s anomaly, dirty pages, working set and thrashing.
10. File metadata, access methods, directory implementation, allocation methods, inodes and indirect pointers, free-space management.
11. Disk geometry and scheduling algorithms, plus a unit-safe access-time calculation method.
12. A verified, traceable PYQ bank with original figures and worked solutions.

Keep advanced kernel internals, detailed file-system implementation, distributed systems and advanced real-time scheduling out of the core path unless a verified syllabus/PYQ reason is given. A weak student with about 100 days cannot afford to mistake “more pages” for “more marks”.

---

# PART 9 — Chapter weights

The weights below are **study-priority recommendations**, not predictions or official GATE statistics. The bank counts are shown only to help review the supplied dataset.

| Area | Bank count / marks from source | Weight for this book | Why |
|---|---:|---|---|
| Memory management + virtual memory | 21 / 37 | **High** | Largest sample count; bit calculations, paging and replacement are learnable with repeated traces. |
| CPU and I/O scheduling | 14 / 21 | **High** | Many standard numerical problems; methods need lots of Gantt and head-movement practice. |
| Processes, threads and IPC | 12 / 14 | **Foundation** | Smaller bank share than memory/scheduling, but it supports synchronization, deadlock and scheduling. |
| Concurrency and synchronization | 11 / 20 | **High** | Multi-step interleavings are difficult for weak students and need careful trace teaching. |
| File systems and disk | 11 / 20 | **Medium–High** | Multiple numerical families; allocation/inodes/free-space and disk access all need separate examples. |
| Deadlock | 9 / 14 | **Medium–High** | Smaller sample, but graph and Banker questions are highly procedural and depend on foundations. |

**Order recommendation:** Foundation (OS basics + processes/threads) → synchronization → deadlock → CPU scheduling → memory management → virtual memory → file systems/disk. This differs from the current chapter order because deadlock should not be first.

---

# Pilot acceptance criteria — do not bulk-generate until these pass

## Pilot scope

Write and revise only these lessons first:

- O0.1 What an OS does
- O0.2 System calls, traps and mode switching
- O1.1 Process and process states
- O1.3 `fork()` / `exec()` / `wait()` basics
- O2.1 Race conditions and atomicity
- O3.1 Deadlock and its four conditions

These lessons test whether Claude can teach unfamiliar words, draw accurate pictures and reveal every intermediate step.

## Test readers

Use at least five readers who genuinely have weak OS foundations. Do not give them coaching or a spoken explanation while they test the pages. A book that works only when the author is present has failed the test.

## Required tasks

Each reader should be able to:

1. Explain in their own words what the OS does and distinguish an application from the kernel.
2. Tell the difference between a system call and a normal function call using a new example.
3. Draw the process-state diagram and explain each arrow.
4. Trace a small `fork()` loop and count how many processes reach a print statement.
5. Find a lost update in two non-atomic increments and give the final values for a new interleaving.
6. Name the four deadlock conditions and draw a resource-allocation graph with correct arrow directions.

## Pass conditions

- At least 4 of 5 readers can complete each task without outside help.
- Every new technical word is defined before it appears in a question.
- Every worked solution contains all intermediate arithmetic or schedule steps.
- Every diagram remains understandable when the surrounding paragraph is hidden.
- No answer key or formula depends on an unstated tie-breaking or atomicity assumption.
- No reader says “I understand the solution only after the teacher explained it.”
- Record time spent and the exact sentence/diagram where each reader got stuck; revise those parts before continuing.

If a lesson fails, fix the explanation itself. Do not lower the test difficulty or tell the learner to “revise basics” that the book has not taught.

---

# Claude writing instructions — patch the master prompt

Append these non-negotiable rules to the Claude OS writing prompt. The original `01-MASTER-PROMPT.md` was not attached, so this is a proposed patch, not a claim about its current wording.

1. **Begin at zero.** Assume the reader has forgotten college OS and is ashamed to ask questions. Never write “as we know”, “obviously”, “clearly”, “similarly” or “it is easy to see” as a substitute for a step.
2. **Define before use.** First use of every technical term must include a one-sentence plain-English definition and a tiny example.
3. **One new idea at a time.** Do not introduce TLB reach before page size, or Banker’s algorithm before resource allocation and safe state, or semaphores before critical sections and atomicity.
4. **Never jump arithmetic.** Show powers of two, address splits, units, queue updates, waiting-time arithmetic and page-frame contents line by line.
5. **Make all diagrams instructional.** Each picture needs a caption, labels, arrows, a legend and a sentence telling the student what to notice. Use step-by-step frames for changing state.
6. **Trace before formula.** For every process/scheduling/semaphore/page-replacement/file-allocation question, show a complete trace table before presenting a shortcut.
7. **State assumptions.** State process arrival/tie order, preemption, atomicity, fairness, page-fault probability meaning, memory addressing unit, file/block pointer size, disk initial direction and unit convention.
8. **No silent OS model changes.** Distinguish generic textbook OS, POSIX/Unix/Linux and question-specific pseudocode. Never present an implementation-specific behaviour as universal.
9. **Official syllabus first.** Include named syllabus topics in the core lessons. Mark enrichment `[LATER]`; do not let it crowd out the syllabus.
10. **PYQ provenance.** Every PYQ must carry year/session, official paper URL, official question identifier, exact figure and final answer-key link. No question text may be “reconstructed from memory” without marking it.
11. **Answer-key audit.** Re-solve every PYQ independently. Record “key agrees”, “key differs”, “cannot verify because figure/text missing” or “ambiguous transcription”. Never silently fix a questionable official key.
12. **Practice progression.** For each subtopic: 2 tiny warm-ups, 3 basic examples, 3 GATE-style traces and 1 mixed challenge, with full solutions. These counts are a minimum pilot target, not a fixed ceiling.
13. **Beginner checks.** End every lesson with “Can I explain it?” and “Can I draw it?” questions.
14. **No empty praise.** Do not say a topic is “easy” or “simple”. Show the smallest working example.
15. **Review workflow.** After drafting, run a term audit, step audit, diagram audit, source audit and answer-key audit before calling the lesson complete.

## Required chapter template

1. Why I need this topic (one familiar situation).
2. What the new word means (small glossary).
3. The idea in plain English.
4. One tiny example, solved slowly.
5. Diagram and what to notice.
6. Step-by-step procedure.
7. GATE-level variations and finer points.
8. Common traps and why they are traps.
9. Solved questions with complete traces.
10. Practice without seeing the answer.
11. One-page recap and prerequisites for the next lesson.

---

# Realistic 100-day use of this book

This OS plan is one subject inside a full GATE preparation schedule; it should not consume the entire 100 days. A reasonable first OS pass for a weak student is about **14–18 days** at roughly 2–3 focused hours/day, followed by short revision sessions mixed into the remaining schedule. This is a planning recommendation, not a claim that every learner will master OS in exactly that time.

| Days | Work | Output expected |
|---|---|---|
| 1 | OS foundations and system calls | Explain kernel/user mode and system-call entry without notes |
| 2–3 | Processes, states, PCB, context switch | Draw state diagram; solve state/context questions |
| 4 | fork/exec/wait and threads | Trace process trees; identify thread-shared/private state |
| 5 | IPC | Compare shared memory, message passing and pipes |
| 6–7 | Race conditions, locks and semaphores | Solve interleaving/semaphore traces without guessing |
| 8 | Classical synchronization and monitors | Solve producer-consumer and barrier patterns |
| 9–10 | Deadlock | Solve RAG and Banker problems with full tables |
| 11–12 | CPU scheduling | Draw every Gantt chart; compute all metrics |
| 13–14 | Memory + virtual memory | Address translation, page tables, TLB and replacement traces |
| 15 | File systems and disk | Inodes, allocation, free-space, SSTF/SCAN and timing |
| 16 | Mixed PYQs and repair | Re-solve missed questions; write an error log |

After the first pass: do 20–30 minutes of OS recall every 3–4 days, and one timed mixed set each week. Spend more time on a topic when the error log shows a real gap; do not blindly follow the calendar.

---

# Publication checklist

The OS book is not ready for sale until every item below is true:

- [ ] Official GATE 2027 OS wording is linked and checked.
- [ ] Chapter order begins with foundations and processes, not deadlock.
- [ ] All named syllabus areas have a lesson-level coverage map.
- [ ] Every lesson passes the term/step/diagram/trace audits.
- [ ] All 78 question records have official paper identifiers and links.
- [ ] All nine missing figures are restored.
- [ ] 2024_FN_Q64 transcription is corrected to `a = 2 * a` against the official master paper.
- [ ] 2023_FN_Q27 preserves both alternatives in the official final key (`A,C,D` or `C,D`) and explains the FIFO caveat.
- [ ] 2020_FN_Q37 solution explicitly states that the 10% page-fault probability is applied conditionally on a TLB miss.
- [ ] 2019_FN_Q63 has a stated GB/GiB convention and one unambiguous answer.
- [ ] Every NAT has a calculation trail and every semaphore/scheduling question has a trace.
- [ ] The 30 Forge questions are attached, checked and clearly distinguished from PYQs.
- [ ] Five weak readers pass the pilot tasks without verbal assistance.
- [ ] A final reviewer other than the writer checks the numerical answers and diagrams.

## Final decision

**Approve the revised plan and a six-lesson pilot. Do not approve bulk rewriting or payment launch yet.**

The chapter list is a reasonable starting skeleton, and the sample bank appears substantial. But a student who has failed twice does not need a promise that the old material will be rewritten. They need proof: beginner definitions, complete traces, correct diagrams, careful assumptions and verified answers. The pilot is the proof. Until it passes, I would not pay ₹149 for this book.

---

# Sources and verification notes

1. **Official GATE 2027 Test Papers & Syllabus — IIT Madras:** https://gate2027.iitm.ac.in/exam_papers_and_syllabus  
   The official page identifies IIT Madras as the GATE 2027 organising institute and states that the 2027 syllabi have been revised. It links the CS-specific syllabus.
2. **Official GATE 2027 CS syllabus PDF:** https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf  
   The OS wording is: “System calls, processes, threads, inter-process communication, concurrency and synchronization. Deadlock. CPU and I/O scheduling. Memory management and virtual memory. File systems.”
3. **Official GATE 2026 Master Question Papers and Answer Keys — IIT Guwahati:** https://gate2026.iitg.ac.in/QPs-answer-keys.html  
   The page explains MCQ/MSQ/NAT scoring, says the answer key matches the master question paper order, and defines MTA as Marks To All. Use the matching official year/session paper and final key to verify each bank record.
4. **GATE 2026 Downloads / historical question paper archive:** https://gate2026.iitg.ac.in/download.html  
   The official archive page lists bulk question-paper downloads for 2007–2025 and year-wise papers for recent years.

5. **Official GATE 2024 CS1 master question paper, Q40:** https://gate2026.iitg.ac.in/doc/download/2024/CS124S5.pdf (page 26). It prints T2 as `b = 2 * b; a = 2 * a;`, confirming that the `+` in the supplied bank's 2024_FN_Q64 transcription is an error.
6. **Official GATE 2023 CS final answer key:** https://gate2026.iitg.ac.in/doc/download/Answer_keys2023/CS_ANS_GATE2023.pdf (Q27, MSQ). It records `A, C, D or C, D`; the supplied key's A,C,D alternative is therefore present in the official key.
7. **MADE EASY GATE 2020 CS detailed solutions:** https://www.madeeasy.in/uploads/examsolution/209ufrep_cs_gate_2020_exam_updated.pdf (OS question on TLB/page faults). This is a secondary worked-solution source, not an official GATE key; it makes the intended conditional use of the 10% page-fault probability visible in the 154.5 ns computation.

**Research limitation:** This review does not claim that all 78 bank entries were compared line-by-line with official master-paper PDFs. The supplied attachment does not include the source URLs or nine required figures. Where an answer is derived from the visible text, the audit says so; where source material is missing or ambiguous, it is flagged rather than guessed.
