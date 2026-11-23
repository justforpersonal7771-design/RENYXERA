# Operating Systems: review merge and plan v1

Merged: ChatGPT (`reviews-received/chatgpt-review-operating-systems.md`) and Gemini (`reviews-received/gemini.txt`). Both propose the same spine: a new foundation chapter, a changed order, and the same missing topics.

## 1. How good were they
Both are strong. ChatGPT is careful about scope and refuses to over-claim (it notes our 15 papers are a sample and that weights are not forecasts). Gemini ties each missing topic to the PYQs that test it and notices the numerical density: of 78 OS questions, 32 are NAT (23 of them 2-mark), so this book must be practice-heavy, with unit conversions and traces by hand.

## 2. Critical decision: keep the whole syllabus
The bank's labels would let us write only "what was asked". We keep **every** item of the five official syllabus lines (system calls, processes, threads, IPC, concurrency and synchronisation; deadlock; CPU and I/O scheduling; memory management and virtual memory; file systems). Advanced kernel internals, distributed systems and real-time scheduling are kept as short [LATER] notes, not removed and not made chapters. Both reviewers say the same: more pages are not more marks.

## 3. The big structural change: order
The app's book starts with **Deadlock** because it is the free chapter. Both reviewers show that is the wrong teaching order (deadlock needs processes and locks). New order: **foundations → processes and threads → synchronisation → deadlock → CPU scheduling → memory management → virtual memory → file systems and disk.** The free sample can stay the deadlock chapter, but the book's reading order changes (the Contents sheet already lists chapters in "teaching order", so this is a catalog reorder plus keeping the free tag on Deadlock).

## 4. Data defects in our question bank
| Question | Problem | Status |
|---|---|---|
| 2024_FN_Q64 | Thread T2 printed `a = 2 + a`; the official page says `a = 2 * a`. With `+` the answer set changes (a is always 4), so option A would be impossible | **Fixed** (checked on the official page text) |
| 2026_AN_Q51 option C | Printed `**$*##*#` (four stars, impossible with three prints); the official page has `**$##*#` | **Fixed** (checked on the official page text) |
| 2023_FN_Q27 | Bank shows A, C, D correct. The official final key records "A, C, D or C, D" (two accepted answers). FIFO does not ordinarily starve a queued finite job | **Open**: store both accepted keys; the lesson explains the model behind each |
| 2020_FN_Q37 | The 155 ns answer needs "10% page-fault rate" read as 10% of the 5% TLB-miss path (0.05 × 0.1); read as 10% of all accesses the answer is about 720 ns | **Keep the key**; the lesson shows both readings and why the paper's reading is used |
| 2019_FN_Q63 | The accepted ranges differ by unit reading (GB as 10^9 or 2^30 bytes) | Lesson states the unit rule and shows the exact bytes |
| All records | No official paper link, session, master question number or key status stored | Add a `source` field |
| Forge | 30 Forge OS questions counted but not in the review file | Include in the next review round |

## 5. The plan (lessons, tags, bank evidence)
Weights from the bank (coarse, shared labels): memory + virtual memory 21 q / 37 marks; CPU and I/O scheduling 14 / 21; processes, threads, IPC 12 / 14; synchronisation 11 / 20; file systems and disk 11 / 20; deadlock 9 / 14. These are study-priority hints, not forecasts.

**0 · OS foundations** [MUST, Foundation] ~4 h: O0.1 what an OS does; O0.2 system calls, traps, interrupts, exceptions, user and kernel mode, system call vs library call. State the model used (abstract OS vs Unix/Linux calls) in every code question.

**1 · Processes, threads, IPC** [MUST, Foundation; 7 of 12 bank questions are Easy] ~10 h: O1.1 program vs process, states; O1.2 PCB and context switch; O1.3 `fork`, `exec`, `wait`, `exit`, process trees (loop and short-circuit forks), zombie and orphan; O1.4 threads and models, what threads share and what each owns; O1.5 IPC (shared memory, message passing, pipes, signals).

**2 · Concurrency and synchronisation** [MUST, High; mostly 2-mark] ~12 h: O2.1 races and critical sections, the three requirements; O2.2 mutex, spinlock, TSL/CAS, Peterson [SHOULD]; O2.3 semaphores from zero; O2.4 classical problems (producer-consumer, readers-writers, dining philosophers); O2.5 monitors, condition variables (Hoare vs Mesa), barriers [SHOULD]; non-atomic LOAD/ADD/STORE interleavings; priority inversion and livelock [SHOULD]. State preemption, atomicity and fairness assumptions in every worked solution.

**3 · Deadlock** [MUST, Medium–High; free sample] ~8 h: O3.1 the four conditions; O3.2 resource-allocation graphs (arrow directions, one vs many instances); O3.3 prevention, avoidance, Banker's algorithm, `n(K−1)+1`; O3.4 detection, recovery, starvation [SHOULD].

**4 · CPU and I/O scheduling** [MUST, High] ~10 h: O4.1 CPU–I/O cycle and measures; O4.2 FCFS and non-preemptive SJF; O4.3 SRTF; O4.4 Round Robin (tie-break and context-switch rules) and priority, aging; O4.5 multilevel queues, multiprocessor, exponential burst prediction, `1 − pⁿ` utilisation [SHOULD]; real-time RMS/EDF [LATER]. Disk-head scheduling is taught in chapter 7 but cross-tagged here (the official line says "CPU and I/O scheduling").

**5 · Memory management** [MUST, Very High with chapter 6] ~9 h: O5.1 contiguous allocation and fragmentation; O5.2 paging and translation (word- vs byte-addressable); O5.3 segmentation and segmented paging [SHOULD]; O5.4 page-table structures: multilevel (including non-divisible splits), inverted, hashed; TLB reach; optimal page size. Mark the COA memory-interfacing overlap.

**6 · Virtual memory** [MUST, High] ~8 h: O6.1 demand paging, page-fault steps; O6.2 TLB and effective access time (define every probability; separate TLB miss, page-table accesses, fault service, dirty pages); O6.3 FIFO, OPT, LRU, limited-lookahead optimal; O6.4 Belady, stack property, Clock, LFU/MFU, working set, thrashing, copy-on-write [SHOULD].

**7 · File systems and disk** [MUST, Medium–High; 8 NAT-2 questions] ~9 h: O7.1 files, metadata, directories (linear scan rule), access methods; O7.2 contiguous, linked, indexed, Unix inodes and indirect blocks; O7.3 free-space management (bitmap, linked list overhead); O7.4 disk geometry, access time (units), SSTF, SCAN/LOOK, C-SCAN/C-LOOK; O7.5 integration and PYQ review.

**8 · Previous-year practice** [MUST] ~6 h: every PYQ by pattern, MCQ / MSQ / NAT, with a unit-conversion drill (2¹⁰, 2²⁰, 2³⁰, RPM → ms).

## 6. Other adopted points
- Every Gantt chart, page-table split, head movement and inode size is computed by a program; the book's numbers come from it.
- Pilot before bulk writing, with real weak readers; tag the 78 PYQs one-per-chapter first.
- "N topics ready" in the app means a legacy draft exists, to be rewritten.

## 7. Next steps
1. Tag each OS PYQ to one lesson (same method as P&DS).
2. Store 2023_FN_Q27's alternative keys; add the `source` field.
3. Reorder the OS catalog chapters; add chapter 0 and the IPC lesson.
4. Build scheduling, paging and disk labs on the figure engine (Gantt and page-table figures).
