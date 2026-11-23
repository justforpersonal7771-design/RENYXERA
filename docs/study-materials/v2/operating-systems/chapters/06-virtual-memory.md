# Review input: Operating Systems, chapter 06: Virtual memory

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-06-virtual-memory.md` and `gemini-06-virtual-memory.md` in this folder.

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

This is **one chapter** (6 of 7) of the Operating Systems book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Virtual memory**. Written lessons today: 5 topics ready.



## The PYQs for this chapter (21)

**2026_AN_Q54** · 2026-AN · NAT · 2 marks · Hard · bank topic: Memory Management and Virtual Memory

A system has a Translation Lookaside Buffer (TLB) that has a reach of 1 MB. TLB reach is defined as the total amount of physical memory that can be accessed through the TLB entries. The paging system uses pages of size 4 KB. The virtual address space is 64 GB and physical address space is 1 GB. If each TLB entry stores a 4-bit process id, page number, frame number, and a 2-bit control field, then the size of the TLB (in bytes) is ________. (answer in integer)
Note: 1K = \( 2^{10} \), 1M = \( 2^{20} \), 1G = \( 2^{30} \)

Official answer (numeric): 1536 to 1536

---

**2026_AN_Q55** · 2026-AN · NAT · 2 marks · Medium · bank topic: Memory Management and Virtual Memory

Consider contiguous allocation of physical memory to processes using variable partitioning scheme. Suppose there are 8 holes in the memory of sizes 20 KB, 4 KB, 25 KB, 18 KB, 7 KB, 9 KB, 15 KB, and 12 KB. Assume that no two holes are adjacent. Two processes P1 of size 16 KB and P2 of size 9 KB arrive in that order, and they are allocated memory using the best-fit technique. After allocating space to P1 and P2, the number of holes of size less than 8 KB is ________. (answer in integer)
Note: 1K = \( 2^{10} \)

Official answer (numeric): 3 to 3

---

**2025_FN_Q14** · 2025-FN · MCQ · 1 mark · Easy · bank topic: Memory Management and Virtual Memory

Consider a demand paging memory management system with 32-bit logical address, 20-bit physical address, and page size of 2048 bytes. Assuming that the memory is byte addressable, what is the maximum number of entries in the page table?

- A) \( 2^{21} \)  ✔ official
- B) \( 2^{20} \)
- C) \( 2^{22} \)
- D) \( 2^{24} \)

---

**2025_AN_Q47** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Memory Management and Virtual Memory · HAS A FIGURE (not shown here)

Consider a demand paging system with three frames, and the following page reference string: 1 2 3 4 5 4 1 6 4 5 1 3 2. The contents of the frames are as follows initially and after each reference (from left to right):
[IMAGE_Q_47_1]
The *-marked references cause page replacements.
Which one or more of the following could be the page replacement policy/policies in use?

- A) Least Recently Used page replacement policy
- B) Least Frequently Used page replacement policy
- C) Most Frequently Used page replacement policy
- D) Optimal page replacement policy  ✔ official

---

**2025_FN_Q54** · 2025-FN · NAT · 2 marks · Hard · bank topic: Memory Management and Virtual Memory

In optimal page replacement algorithm, information about all future page references is available to the operating system (OS). A modification of the optimal page replacement algorithm is as follows:
The OS correctly predicts only up to next 4 page references (including the current page) at the time of allocating a frame to a page.
A process accesses the pages in the following order of page numbers:
1, 3, 2, 4, 2, 3, 1, 2, 4, 3, 1, 4
If the system has three memory frames that are initially empty, the number of page faults that will occur during execution of the process is ________. (Answer in integer)

Official answer (numeric): 6 to 6

---

**2025_AN_Q58** · 2025-AN · NAT · 2 marks · Medium · bank topic: Memory Management and Virtual Memory

A computer system supports a logical address space of \( 2^{32} \) bytes. It uses two-level hierarchical paging with a page size of 4096 bytes. A logical address is divided into a b-bit index to the outer page table, an offset within the page of the inner page table, and an offset within the desired page. Each entry of the inner page table uses eight bytes. All the pages in the system have the same size.
The value of \( b \) is ________. (Answer in integer)

Official answer (numeric): 11 to 11

---

**2024_AN_Q28** · 2024-AN · MSQ · 1 mark · Medium · bank topic: Memory Management and Virtual Memory

Which of the following tasks is/are the responsibility/responsibilities of the memory management unit (MMU) in a system with paging-based memory management?

- A) Allocate a new page table for a newly created process.
- B) Translate a virtual address to a physical address using the page table.  ✔ official
- C) Raise a trap when a virtual address is not found in the page table.  ✔ official
- D) Raise a trap when a process tries to write to a page marked with read-only permission in the page table.  ✔ official

---

**2024_FN_Q50** · 2024-FN · NAT · 2 marks · Medium · bank topic: Memory Management and Virtual Memory

Consider a memory management system that uses a page size of 2 KB. Assume that both the physical and virtual addresses start from 0. Assume that the pages 0, 1, 2, and 3 are stored in the page frames 1, 3, 2, and 0, respectively. The physical address (in decimal format) corresponding to the virtual address 2500 (in decimal format) is ________.

Official answer (numeric): 6596 to 6596

---

**2024_AN_Q47** · 2024-AN · NAT · 2 marks · Hard · bank topic: Memory Management and Virtual Memory

Consider a 32-bit system with 4 KB page size and page table entries of size 4 bytes each. Assume \( 1\text{ KB} = 2^{10} \) bytes. The OS uses a 2-level page table for memory management, with the page table containing an outer page directory and an inner page table. The OS allocates a page for the outer page directory upon process creation. The OS uses demand paging when allocating memory for the inner page table, i.e., a page of the inner page table is allocated only if it contains at least one valid page table entry. An active process in this system accesses 2000 unique pages during its execution, and none of the pages are swapped out to disk. After it completes the page accesses, let \( X \) denote the minimum and \( Y \) denote the maximum number of pages across the two levels of the page table of the process.
The value of \( X + Y \) is ________.

Official answer (numeric): 1028 to 1028

---

**2023_FN_Q42** · 2023-FN · MCQ · 2 marks · Medium · bank topic: Memory Management and Virtual Memory · HAS A FIGURE (not shown here)

A 4 kilobyte (KB) byte-addressable memory is realized using four 1 KB memory blocks. Two input address lines (IA4 and IA3) are connected to the chip select (CS) port of these memory blocks through a decoder as shown in the figure. The remaining ten input address lines from IA11 – IA0 are connected to the address port of these blocks. The chip select (CS) is active high.
[IMAGE_Q_42_1]
The input memory addresses (IA11 – IA0), in decimal, for the starting locations (Addr=0) of each block (indicated as X1, X2, X3, X4 in the figure) are among the options given below. Which one of the following options is CORRECT?

- A) (0, 1, 2, 3)
- B) (0, 1024, 2048, 3072)
- C) (0, 8, 16, 24)  ✔ official
- D) (0, 0, 0, 0)

---

**2023_FN_Q57** · 2023-FN · NAT · 2 marks · Hard · bank topic: Memory Management and Virtual Memory

Consider the following two-dimensional array \(D\) in the C programming language, which is stored in row-major order:
```c
int D[128][128];
```
Demand paging is used for allocating memory and each physical page frame holds 512 elements of the array \(D\). The Least Recently Used (LRU) page-replacement policy is used by the operating system. A total of 30 physical page frames are allocated to a process which executes the following code snippet:
```c
for (int i = 0; i < 128; i++)
    for (int j = 0; j < 128; j++)
        D[j][i] *= 10;
```
The number of page faults generated during the execution of this code snippet is ________.

Official answer (numeric): 4096 to 4096

---

**2023_FN_Q58** · 2023-FN · NAT · 2 marks · Medium · bank topic: Memory Management and Virtual Memory

Consider a computer system with 57-bit virtual addressing using multi-level tree-structured page tables with \(L\) levels for virtual to physical address translation. The page size is 4 KB (1 KB = 1024 B) and a page table entry at any of the levels occupies 8 bytes.
The value of \(L\) is ________.

Official answer (numeric): 5 to 5

---

**2022_FN_Q38** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Memory Management and Virtual Memory

Which one of the following statements is FALSE?

- A) The TLB performs an associative search in parallel on all its valid entries using page number of incoming virtual address.
- B) If the virtual address of a word given by CPU has a TLB hit, but the subsequent search for the word results in a cache miss, then the word will always be present in the main memory.
- C) The memory access time using a given inverted page table is always same for all incoming virtual addresses.  ✔ official
- D) In a system that uses hashed page tables, if two distinct virtual addresses V1 and V2 map to the same value while hashing, then the memory access time of these addresses will not be the same.

---

**2022_FN_Q64** · 2022-FN · NAT · 2 marks · Medium · bank topic: Memory Management and Virtual Memory

Consider a demand paging system with four page frames (initially empty) and LRU page replacement policy. For the following page reference string
7, 2, 7, 3, 2, 5, 3, 4, 6, 7, 7, 1, 5, 6, 1
the page fault rate, defined as the ratio of number of page faults to the number of memory accesses (rounded off to one decimal place) is _________.

Official answer (numeric): 0.6 to 0.6

---

**2021_FN_Q31** · 2021-FN · MSQ · 1 mark · Medium · bank topic: Memory Management and Virtual Memory

In the context of operating systems, which of the following statements is/are correct with respect to paging?

- A) Paging helps solve the issue of external fragmentation.  ✔ official
- B) Page size has no impact on internal fragmentation.
- C) Paging incurs memory overheads.  ✔ official
- D) Multi-level paging is necessary to support pages of different sizes.

---

**2021_AN_Q62** · 2021-AN · NAT · 2 marks · Hard · bank topic: Memory Management and Virtual Memory · HAS A FIGURE (not shown here)

Consider a three-level page table to translate a 39-bit virtual address to a physical address as shown below:

[IMAGE_Q_62_1]

The page size is 4 KB (1 KB = \(2^{10}\) bytes) and page table entry size at every level is 8 bytes. A process \(P\) is currently using 2 GB (1 GB = \(2^{30}\) bytes) virtual memory which is mapped to 2 GB of physical memory. The minimum amount of memory required for the page table of \(P\) across all levels is _________ KB.

Official answer (numeric): 4108 to 4108

---

**2020_FN_Q14** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Memory Management and Virtual Memory

Consider allocation of memory to a new process. Assume that none of the existing holes in the memory will exactly fit the process's memory requirement. Hence, a new hole of smaller size will be created if allocation is made in any of the existing holes. Which one of the following statements is TRUE?

- A) The hole created by first fit is always larger than the hole created by next fit.
- B) The hole created by worst fit is always larger than the hole created by first fit.
- C) The hole created by best fit is never larger than the hole created by first fit.  ✔ official
- D) The hole created by next fit is never larger than the hole created by best fit.

---

**2020_FN_Q37** · 2020-FN · NAT · 2 marks · Hard · bank topic: Memory Management and Virtual Memory

Consider a paging system that uses 1-level page table residing in main memory and a TLB for address translation. Each main memory access takes 100 ns and TLB lookup takes 20 ns. Each page transfer to/from the disk takes 5000 ns. Assume that the TLB hit ratio is 95%, page fault rate is 10%. Assume that for 20% of the total page faults, a dirty page has to be written back to disk before the required page is read in from disk. TLB update time is negligible. The average memory access time in ns (round off to 1 decimal places) is ________.

Official answer (numeric): 154.5 to 155.5

---

**2019_FN_Q42** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Memory Management and Virtual Memory

Assume that in a certain computer, the virtual addresses are 64 bits long and the physical addresses are 48 bits long. The memory is word addressable. The page size is 8 kB and the word size is 4 bytes. The Translation Look-aside Buffer (TLB) in the address translation path has 128 valid entries. At most how many distinct virtual addresses can be translated without any TLB miss?

- A) \( 16 \times 2^{10} \)
- B) \( 256 \times 2^{10} \)  ✔ official
- C) \( 4 \times 2^{20} \)
- D) \( 8 \times 2^{20} \)

---

**2018_FN_Q20** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Memory Management and Virtual Memory

Consider a process executing on an operating system that uses demand paging. The average time for a memory access in the system is \(M\) units if the corresponding memory page is available in memory, and \(D\) units if the memory access causes a page fault. It has been experimentally measured that the average time taken for a memory access in the process is \(X\) units.
Which one of the following is the correct expression for the page fault rate experienced by the process?

- A) \((D - M) / (X - M)\)
- B) \((X - M) / (D - M)\)  ✔ official
- C) \((D - X) / (D - M)\)
- D) \((X - M) / (D - X)\)

---

**2017_FN_Q36** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Memory Management and Virtual Memory

Recall that Belady's anomaly is that the page-fault rate may increase as the number of allocated frames increases. Now, consider the following statements:
S1: Random page replacement algorithm (where a page chosen at random is replaced) suffers from Belady's anomaly
S2: LRU page replacement algorithm suffers from Belady's anomaly
Which of the following is CORRECT?

- A) S1 is true, S2 is true
- B) S1 is true, S2 is false  ✔ official
- C) S1 is false, S2 is true
- D) S1 is false, S2 is false

