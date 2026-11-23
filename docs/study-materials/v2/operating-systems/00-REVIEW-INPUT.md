# In-depth review input: Operating Systems

**One file, one review.** Paste everything below the line into ChatGPT (new chat), and again into Gemini (new chat). If the chat refuses the length, attach this file and write: "Follow the instructions inside the file."

Save the replies in this folder as `chatgpt-review-operating-systems.md` and `gemini-review-operating-systems.md`, then tell me.

Contains: reviewer instructions (A), the subject's contents with the PYQ statistics (B), and all 78 PYQs with full text and the official key (C).

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

This is the **in-depth review of the whole Operating Systems book**. Take your time. Go chapter by chapter, and give a much deeper answer than a quick review: at least **80 rows** in the gap table in Part 2 (spread across every chapter).

If your reply gets too long, **stop at the end of a chapter** and write "CONTINUE FROM CHAPTER <number>". I will answer "continue" and you carry on. Do not shorten later chapters to fit; every chapter gets the same depth.

In addition to Parts 1 to 4 above, answer these parts:

PART 5. THE FULL PLAN, CHAPTER BY CHAPTER
 For every chapter (the ones given below, plus any you think are missing), list the lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with the reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind and what it shows); hand traces; common mistakes.

PART 6. EVERY PYQ LISTED BELOW
 For EACH previous-year question: (a) the chapter and lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree show the working and write FACT-DOUBT), (e) whether the question text looks mis-transcribed (say exactly what).

PART 7. MORE QUESTIONS NEEDED
 For each lesson, three question ideas GATE could ask that the PYQs do not cover (one line each, with the type MCQ / MSQ / NAT).

PART 8. WHAT IS MISSING FROM THE SUBJECT
 Topics GATE has asked, or could ask, that no chapter below covers.

PART 9. WEIGHTS
 Give each chapter a weight tag (High / Medium / Low / Foundation) and say whether the one derived from the bank (below) looks fair. Do not invent frequencies; write "not sure".
```

---

## PART B. THE CONTENTS TO REVIEW


Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- System calls, processes, threads, inter-process communication, concurrency and synchronization.
- Deadlock.
- CPU and I/O scheduling.
- Memory management and virtual memory.
- File systems.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Deadlock | 6 topics ready, free | written (old standard; to be rewritten) |
| 02 | Processes and threads | 7 topics ready | written (old standard; to be rewritten) |
| 03 | CPU scheduling | 6 topics ready | written (old standard; to be rewritten) |
| 04 | Synchronisation | 7 topics ready | written (old standard; to be rewritten) |
| 05 | Memory management | 6 topics ready | written (old standard; to be rewritten) |
| 06 | Virtual memory | 5 topics ready | written (old standard; to be rewritten) |
| 07 | File systems and disk | 7 topics ready | written (old standard; to be rewritten) |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **78**; marks: **126** = **8.4%** of all 1500 marks (about 8.4 marks a paper).
- Forge (our own) questions for this subject: **30**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Memory Management and Virtual Memory | 21 | 37 | 2.47% | 10 | 2/13/6 | NAT2×11, MCQ1×3, MSQ2×1, MSQ1×2, MCQ2×4 |
| CPU and I/O Scheduling | 14 | 21 | 1.40% | 9 | 3/8/3 | NAT2×4, MCQ1×2, NAT1×3, MCQ2×3, MSQ1×2 |
| File Systems Operations & Disk Scheduling Optimization | 11 | 20 | 1.33% | 9 | 2/8/1 | NAT2×8, MSQ1×1, MCQ2×1, MCQ1×1 |
| Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks) | 11 | 20 | 1.33% | 9 | 1/8/2 | MSQ2×4, MCQ2×5, MCQ1×1, NAT1×1 |
| Deadlock Prevention, Avoidance, Detection, Recovery | 9 | 14 | 0.93% | 7 | 0/8/1 | MSQ1×2, NAT1×2, MSQ2×2, MCQ2×3 |
| System Calls, Processes, Threads, InterProcess Communication | 12 | 14 | 0.93% | 7 | 7/4/1 | NAT2×2, MSQ1×6, MCQ1×3, NAT1×1 |


---

## PART C. ALL 78 PREVIOUS-YEAR QUESTIONS (Operating Systems)

Official key marked "✔ official". Figures are not shown; the question says so.

**2026_AN_Q23** · 2026-AN · MCQ · 1 mark · Easy · bank topic: CPU and I/O Scheduling

Which one of the following CPU scheduling algorithms cannot be preemptive?

- A) Shortest Remaining Time First (SRTF) Scheduling
- B) First Come First Serve (FCFS) Scheduling  ✔ official
- C) Round Robin Scheduling
- D) Priority Scheduling

---

**2026_FN_Q29** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

With respect to deadlocks in an operating system, which of the following statements is/are FALSE?

- A) Banker's algorithm is used to prevent deadlocks  ✔ official
- B) Deadlock formation can be prevented by ensuring that the hold and wait condition is not allowed
- C) An assignment edge in a resource allocation graph is marked from a process to a resource  ✔ official
- D) A safe state guarantees that all processes can finish without formation of a deadlock

---

**2026_FN_Q35** · 2026-FN · NAT · 1 mark · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

Consider a system consisting of \( k \) instances of a resource \( R \), being shared by 5 processes. Assume that each process requires a maximum of two instances of resource \( R \) and a process can request or release only one instance at a time. Further, a process can request the second instance of the resource only after acquiring the first instance.
The minimum value of \( K \) for the system to be deadlock-free is ________. (answer in integer)

Official answer (numeric): 6 to 6

---

**2026_AN_Q51** · 2026-AN · MSQ · 2 marks · Hard · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider three processes P1, P2, and P3 running identical code, as shown in the pseudocode below. A and B are two binary semaphores initialized to 1 and 0, respectively. X is a shared variable initialized to 0. Each line in the pseudocode is executed atomically.
Pseudocode of P1, P2, and P3
```
Wait(A);
Print(*);
X = X+1;
If (X == 2)
{
    Print($);
    Signal(B);
}
Signal(A);
Wait(B);
Print(#);
Signal(B);
```
Assume that any of the three processes can start to execute first and context switching can happen between these processes at any arbitrary time and in any arbitrary order.
Which of the following patterns is/are possible to be generated as an outcome of the execution of these three processes?

- A) **$*###  ✔ official
- B) **$#*##  ✔ official
- C) **$*##*#  ✔ official
- D) ***$###

---

**2026_AN_Q53** · 2026-AN · NAT · 2 marks · Hard · bank topic: File Systems Operations & Disk Scheduling Optimization

To keep track of free blocks in a file system, one of the two approaches is generally used – using bitmaps (bit vectors) or using linked lists. Consider that the linked list approach is used to keep track of free blocks in a file system. Assume that the disk size is 16 GB, block size is 2 KB, and block numbers used are 32-bit long. A single pointer of size 4 bytes is used in each block of the list to point to the next block of the list. The number of blocks required to hold the free disk block numbers is ________. (answer in integer)
Note: 1K = \( 2^{10} \) and 1G = \( 2^{30} \)

Official answer (numeric): 16417 to 16417

---

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

**2026_FN_Q59** · 2026-FN · NAT · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider a hard disk with a rotational speed of 15000 rpm. The time to move the read/write head from a track to its adjacent track is 1 millisecond. Initially, the head is on track 0. The number of sectors per track is 400. The sector size is 1024 bytes. It is necessary to transfer data from 10 randomly located sectors in each of the following tracks in the order: 5, 12 and 7.
The total time for the data transfer (in milliseconds) from the hard disk is ________. (rounded off to one decimal place)

Official answer (numeric): 77.3 to 77.3

---

**2026_FN_Q63** · 2026-FN · NAT · 2 marks · Medium · bank topic: System Calls, Processes, Threads, InterProcess Communication

Consider the following program snippet. Assume that the program compiles and runs successfully. Further, assume that the `fork()` system call is always successful in creating a process.
```c
int main() {
    int i;
    for (i = 0; i < 3; i++){
        if (fork() == 0){
            continue;
        }
        break;
    }
    printf("Hello!");
    return 0;
}
```
The total number of times that the printf statement gets executed is ________. (answer in integer)

Official answer (numeric): 4 to 4

---

**2026_FN_Q64** · 2026-FN · NAT · 2 marks · Medium · bank topic: CPU and I/O Scheduling

Consider a CPU that has to execute two types of processes. The first type, Actuators (A), requires a CPU burst of 6 seconds. The second type, Controllers (C), requires a CPU burst of 8 seconds. A new process of type A arrives at time \( t = 10, 20, 30, 40, \) and \( 50 \) (in seconds). Similarly, a new process of type C arrives at time \( t = 11, 22, 33, 44, \) and \( 55 \) (in seconds). The CPU scheduling policy is First Come First Serve (FCFS). The first process of type A starts running at \( t = 10 \) seconds. The average waiting time (in seconds) for the 10 processes is ________. (rounded off to one decimal place)

Official answer (numeric): 9.5 to 9.5

---

**2025_FN_Q14** · 2025-FN · MCQ · 1 mark · Easy · bank topic: Memory Management and Virtual Memory

Consider a demand paging memory management system with 32-bit logical address, 20-bit physical address, and page size of 2048 bytes. Assuming that the memory is byte addressable, what is the maximum number of entries in the page table?

- A) \( 2^{21} \)  ✔ official
- B) \( 2^{20} \)
- C) \( 2^{22} \)
- D) \( 2^{24} \)

---

**2025_AN_Q26** · 2025-AN · MCQ · 1 mark · Medium · bank topic: CPU and I/O Scheduling

Processes \( P1 \), \( P2 \), \( P3 \), \( P4 \) arrive in that order at times 0, 1, 2, and 8 milliseconds respectively, and have execution times of 10, 13, 6, and 9 milliseconds respectively. Shortest Remaining Time First (SRTF) algorithm is used as the CPU scheduling policy. Ignore context switching times.
Which ONE of the following correctly gives the average turnaround time of the four processes in milliseconds?

- A) 22
- B) 15
- C) 37
- D) 19  ✔ official

---

**2025_FN_Q29** · 2025-FN · NAT · 1 mark · Medium · bank topic: CPU and I/O Scheduling

Suppose in a multiprogramming environment, the following C program segment is executed. A process goes into I/O queue whenever an I/O related operation is performed. Assume that there will always be a context switch whenever a process requests for an I/O, and also whenever the process returns from an I/O. The number of times the process will enter the ready queue during its lifetime (not counting the time the process enters the ready queue when it is run initially) is ________. (Answer in integer)
```c
int main( )
{
    int x = 0, i = 0;
    scanf("%d", &x);
    for(i = 0; i < 20; i++)
    {
        x = x + 20;
        printf("%d\n", x);
    }
    return 0;
}
```

Official answer (numeric): 21 to 21

---

**2025_FN_Q38** · 2025-FN · MCQ · 2 marks · Hard · bank topic: CPU and I/O Scheduling

A computer has two processors, \( M_1 \) and \( M_2 \). Four processes \( P_1, P_2, P_3, P_4 \) with CPU bursts of 20, 16, 25, and 10 milliseconds, respectively, arrive at the same time and these are the only processes in the system. The scheduler uses non-preemptive priority scheduling, with priorities decided as follows:
• \( M_1 \) uses priority of execution for the processes as, \( P_1 > P_3 > P_2 > P_4 \), i.e., \( P_1 \) and \( P_4 \) have highest and lowest priorities, respectively.
• \( M_2 \) uses priority of execution for the processes as, \( P_2 > P_3 > P_4 > P_1 \), i.e., \( P_2 \) and \( P_1 \) have highest and lowest priorities, respectively.
A process \( P_i \) is scheduled to a processor \( M_k \), if the processor is free and no other process \( P_j \) is waiting with higher priority. At any given point of time, a process can be allocated to any one of the free processors without violating the execution priority rules. Ignore the context switch time. What will be the average waiting time of the processes in milliseconds?

- A) 9.00  ✔ official
- B) 8.75
- C) 6.50
- D) 7.50

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

**2025_AN_Q48** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

\( P = \{P_1, P_2, P_3, P_4\} \) consists of all active processes in an operating system. \( R = \{R_1, R_2, R_3, R_4\} \) consists of single instances of distinct types of resources in the system.
The resource allocation graph has the following assignment and claim edges.
Assignment edges: \( R_1 \rightarrow P_1, R_2 \rightarrow P_2, R_3 \rightarrow P_3, R_4 \rightarrow P_4 \) (the assignment edge \( R_1 \rightarrow P_1 \) means resource \( R_1 \) is assigned to process \( P_1 \), and so on for others)
Claim edges: \( P_1 \rightarrow R_2, P_2 \rightarrow R_3, P_3 \rightarrow R_1, P_2 \rightarrow R_4, P_4 \rightarrow R_2 \) (the claim edge \( P_1 \rightarrow R_2 \) means process \( P_1 \) is waiting for resource \( R_2 \), and so on for others)
Which of the following statement(s) is/are CORRECT?

- A) Aborting \( P_1 \) makes the system deadlock free.
- B) Aborting \( P_3 \) makes the system deadlock free.
- C) Aborting \( P_2 \) makes the system deadlock free.  ✔ official
- D) Aborting \( P_1 \) and \( P_4 \) makes the system deadlock free.  ✔ official

---

**2025_FN_Q51** · 2025-FN · NAT · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

A disk of size 512 M bytes is divided into blocks of 64 K bytes. A file is stored in the disk using linked allocation. In linked allocation, each data block reserves 4 bytes to store the pointer to the next data block. The link part of the last data block contains a NULL pointer (also of 4 bytes). Suppose a file of 1 M bytes needs to be stored in the disk. Assume, \( 1\text{ K} = 2^{10} \) and \( 1\text{ M} = 2^{20} \). The amount of space in bytes that will be wasted due to internal fragmentation is ________. (Answer in integer)

Official answer (numeric): 65468 to 65468

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

**2024_FN_Q12** · 2024-FN · MSQ · 1 mark · Medium · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which of the following statements about threads is/are TRUE?

- A) Threads can only be implemented in Kernel space
- B) Each thread has its own file descriptor table for open files
- C) All the threads belonging to a process share a common stack
- D) Threads belonging to a process are by default not protected from each other  ✔ official

---

**2024_AN_Q28** · 2024-AN · MSQ · 1 mark · Medium · bank topic: Memory Management and Virtual Memory

Which of the following tasks is/are the responsibility/responsibilities of the memory management unit (MMU) in a system with paging-based memory management?

- A) Allocate a new page table for a newly created process.
- B) Translate a virtual address to a physical address using the page table.  ✔ official
- C) Raise a trap when a virtual address is not found in the page table.  ✔ official
- D) Raise a trap when a process tries to write to a page marked with read-only permission in the page table.  ✔ official

---

**2024_FN_Q26** · 2024-FN · MSQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which of the following process state transitions is/are NOT possible?

- A) Running to Ready
- B) Waiting to Running  ✔ official
- C) Ready to Waiting  ✔ official
- D) Running to Terminated

---

**2024_AN_Q12** · 2024-AN · MSQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Consider a process P running on a CPU. Which one or more of the following events will always trigger a context switch by the OS that results in process P moving to a non-running state (e.g., ready, blocked)?

- A) P makes a blocking system call to read a block of data from the disk.  ✔ official
- B) P tries to access a page that is in the swap space, triggering a page fault.  ✔ official
- C) An interrupt is raised by the disk to deliver data requested by some other process.
- D) A timer interrupt is raised by the hardware.

---

**2024_AN_Q54** · 2024-AN · MCQ · 2 marks · Medium · bank topic: CPU and I/O Scheduling

Consider a single processor system with four processes A, B, C, and D, represented as given below, where for each process the first value is its arrival time, and the second value is its CPU burst time.
A(0, 10), B(2, 6), C(4, 3) and D(6, 7)
Which one of the following options gives the average waiting times when preemptive Shortest Remaining Time First (SRTF) and Non-Preemptive Shortest Job First (NP-SJF) CPU scheduling algorithms are applied to the processes?

- A) SRTF = 6, NP-SJF = 7
- B) SRTF = 6, NP-SJF = 7.5  ✔ official
- C) SRTF = 7, NP-SJF = 7.5
- D) SRTF = 7, NP-SJF = 8.5

---

**2024_FN_Q64** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the following two threads T1 and T2 that update two shared variables \( a \) and \( b \). Assume that initially \( a = b = 1 \). Though context switching between threads can happen at any time, each statement of T1 or T2 is executed atomically without interruption.
**T1**
\( a = a + 1; \)
\( b = b + 1; \)
**T2**
\( b = 2 * b; \)
\( a = 2 + a; \)
Which one of the following options lists all the possible combinations of values of \( a \) and \( b \) after both T1 and T2 finish execution?

- A) \( (a = 4, b = 4); (a = 3, b = 3); (a = 4, b = 3) \)  ✔ official
- B) \( (a = 3, b = 4); (a = 4, b = 3); (a = 3, b = 3) \)
- C) \( (a = 4, b = 4); (a = 4, b = 3); (a = 3, b = 4) \)
- D) \( (a = 2, b = 2); (a = 2, b = 3); (a = 3, b = 4) \)

---

**2024_AN_Q44** · 2024-AN · MSQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider a multi-threaded program with two threads T1 and T2. The threads share two semaphores: s1 (initialized to 1) and s2 (initialized to 0). The threads also share a global variable \( x \) (initialized to 0). The threads execute the code shown below.
```c
// code of T1
wait (s1);
x = x + 1;
print(x);
wait(s2);
signal(s1);

// code of T2
wait (s1);
x = x + 1;
print(x);
signal(s2);
signal(s1);
```
Which of the following outcomes is/are possible when threads T1 and T2 execute concurrently?

- A) T1 runs first and prints 1, T2 runs next and prints 2
- B) T2 runs first and prints 1, T1 runs next and prints 2  ✔ official
- C) T1 runs first and prints 1, T2 does not print anything (deadlock)  ✔ official
- D) T2 runs first and prints 1, T1 does not print anything (deadlock)

---

**2024_AN_Q61** · 2024-AN · NAT · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider a disk with the following specifications: rotation speed of 6000 RPM, average seek time of 5 milliseconds, 500 sectors/track, 512 byte sectors. A file has content stored in 3000 sectors located randomly on the disk. Assuming average rotational latency, the total time (in seconds, rounded off to 2 decimal places) to read the entire file from the disk is ________.

Official answer (numeric): 29.50 to 30.50

---

**2024_FN_Q39** · 2024-FN · NAT · 2 marks · Easy · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider a 512 GB hard disk with 32 storage surfaces. There are 4096 sectors per track and each sector holds 1024 bytes of data. The number of cylinders in the hard disk is ________.

Official answer (numeric): 4096 to 4096

---

**2024_FN_Q53** · 2024-FN · NAT · 2 marks · Hard · bank topic: System Calls, Processes, Threads, InterProcess Communication

Consider the following code snippet using the `fork()` and `wait()` system calls. Assume that the code compiles and runs correctly, and that the system calls run successfully without any errors.
```c
int x = 3;
while (x > 0) {
    fork( );
    printf("hello");
    wait(NULL);
    x--;
}
```
The total number of times the printf statement is executed is ________.

Official answer (numeric): 14 to 14

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

**2023_FN_Q22** · 2023-FN · MSQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which one or more of the following need to be saved on a context switch from one thread (T1) of a process to another thread (T2) of the same process?

- A) Page table base register
- B) Stack pointer  ✔ official
- C) Program counter  ✔ official
- D) General purpose registers  ✔ official

---

**2023_FN_Q23** · 2023-FN · MSQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which one or more of the following options guarantee that a computer system will transition from user mode to Kernel mode?

- A) Function call
- B) Malloc call
- C) Page fault  ✔ official
- D) System call  ✔ official

---

**2023_FN_Q27** · 2023-FN · MSQ · 1 mark · Easy · bank topic: CPU and I/O Scheduling

Which one or more of the following CPU scheduling algorithms can potentially cause starvation?

- A) First-in First-Out  ✔ official
- B) Round Robin
- C) Priority Scheduling  ✔ official
- D) Shortest Job First  ✔ official

---

**2023_FN_Q38** · 2023-FN · MCQ · 2 marks · Hard · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the two functions incr and decr shown below:
```c
incr( ) {
    wait(s);
    X = X + 1;
    signal(s);
}
decr( ) {
    wait(s);
    X = X - 1;
    signal(s);
}
```
There are 5 threads each invoking incr once, and 3 threads each invoking decr once, on the same shared variable X. The initial value of X is 10.
Suppose there are two implementations of the semaphore s, as follows:
I-1: s is a binary semaphore initialized to 1.
I-2: s is a counting semaphore initialized to 2.
Let V1, V2 be the values of X at the end of execution of all the threads with implementations I-1, I-2, respectively.
Which one of the following choices corresponds to the minimum possible values of V1, V2, respectively?

- A) 15, 7
- B) 7, 7
- C) 12, 7  ✔ official
- D) 12, 8

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

**2022_FN_Q19** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the following threads, \(T_1\), \(T_2\) and \(T_3\) executing on a single processor, synchronized using three binary semaphore variables, \(S_1\), \(S_2\) and \(S_3\), operated upon using standard wait( ) and signal( ). The threads can be context switched in any order and at any time.

```c
// T1
while (true) {
  wait (S_3);
  print ("C");
  signal (S_2);
}

// T2
while (true) {
  wait (S_1);
  print ("B");
  signal (S_3);
}

// T3
while (true) {
  wait (S_2);
  print ("A");
  signal (S_1);
}
```
Which initialization of the semaphores would print the sequence BCABCABCA.....?

- A) \(S_1 = 1; S_2 = 1; S_3 = 1\)
- B) \(S_1 = 1; S_2 = 1; S_3 = 0\)
- C) \(S_1 = 1; S_2 = 0; S_3 = 0\)  ✔ official
- D) \(S_1 = 0; S_2 = 1; S_3 = 1\)

---

**2022_FN_Q26** · 2022-FN · MSQ · 1 mark · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

Which of the following statements is/are TRUE with respect to deadlocks?

- A) Circular wait is a necessary condition for the formation of deadlock.  ✔ official
- B) In a system where each resource has more than one instance, a cycle in its wait-for graph indicates the presence of a deadlock.
- C) If the current allocation of resources to processes leads the system to unsafe state, then deadlock will necessarily occur.
- D) In the resource-allocation graph of a system, if every edge is an assignment edge, then the system is not in deadlock state.  ✔ official

---

**2022_FN_Q38** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Memory Management and Virtual Memory

Which one of the following statements is FALSE?

- A) The TLB performs an associative search in parallel on all its valid entries using page number of incoming virtual address.
- B) If the virtual address of a word given by CPU has a TLB hit, but the subsequent search for the word results in a cache miss, then the word will always be present in the main memory.
- C) The memory access time using a given inverted page table is always same for all incoming virtual addresses.  ✔ official
- D) In a system that uses hashed page tables, if two distinct virtual addresses V1 and V2 map to the same value while hashing, then the memory access time of these addresses will not be the same.

---

**2022_FN_Q42** · 2022-FN · MCQ · 2 marks · Hard · bank topic: CPU and I/O Scheduling

Consider four processes P, Q, R, and S scheduled on a CPU as per round robin algorithm with a time quantum of 4 units. The processes arrive in the order P, Q, R, S, all at time \(t = 0\). There is exactly one context switch from S to Q, exactly one context switch from R to Q, and exactly two context switches from Q to R. There is no context switch from S to P. Switching to a ready process after the termination of another process is also considered a context switch. Which one of the following is NOT possible as CPU burst time (in time units) of these processes?

- A) P = 4, Q = 10, R = 6, S = 2
- B) P = 2, Q = 9, R = 5, S = 1
- C) P = 4, Q = 12, R = 5, S = 4
- D) P = 3, Q = 7, R = 7, S = 3  ✔ official

---

**2022_FN_Q63** · 2022-FN · NAT · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider two files systems A and B, that use contiguous allocation and linked allocation, respectively. A file of size 100 blocks is already stored in A and also in B. Now, consider inserting a new block in the middle of the file (between \(50^{\text{th}}\) and \(51^{\text{st}}\) block), whose data is already available in the memory. Assume that there are enough free blocks at the end of the file and that the file control blocks are already in memory. Let the number of disk accesses required to insert a block in the middle of the file in A and B are \(n_A\) and \(n_B\), respectively, then the value of \(n_A + n_B\) is _________.

Official answer (numeric): 153 to 153

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

**2021_FN_Q60** · 2021-FN · MSQ · 1 mark · Medium · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which of the following standard C library functions will always invoke a system call when executed from a single-threaded process in a UNIX/Linux operating system?

- A) exit  ✔ official
- B) malloc
- C) sleep  ✔ official
- D) strlen

---

**2021_AN_Q29** · 2021-AN · MSQ · 1 mark · Easy · bank topic: CPU and I/O Scheduling

Which of the following statement(s) is/are correct in the context of CPU scheduling?

- A) Turnaround time includes waiting time.  ✔ official
- B) The goal is to only maximize CPU utilization and minimize throughput.
- C) Round-robin policy can be used even when the CPU time required by each of the processes is not known apriori.  ✔ official
- D) Implementing preemptive scheduling needs hardware support.  ✔ official

---

**2021_FN_Q34** · 2021-FN · MSQ · 1 mark · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider a linear list based directory implementation in a file system. Each directory is a list of nodes, where each node contains the file name along with the file metadata, such as the list of pointers to the data blocks. Consider a given directory foo.
Which of the following operations will necessarily require a full scan of foo for successful completion?

- A) Creation of a new file in foo  ✔ official
- B) Deletion of an existing file from foo
- C) Renaming of an existing file in foo  ✔ official
- D) Opening of an existing file in foo

---

**2021_FN_Q14** · 2021-FN · NAT · 1 mark · Medium · bank topic: CPU and I/O Scheduling

Three processes arrive at time zero with CPU bursts of 16, 20 and 10 milliseconds. If the scheduler has prior knowledge about the length of the CPU bursts, the minimum achievable average waiting time for these three processes in a non-preemptive scheduler (round to nearest integer) is _________ milliseconds.

Official answer (numeric): 12 to 12

---

**2021_AN_Q41** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the following multi-threaded code segment (in a mix of C and pseudo-code), invoked by two processes \(P_1\) and \(P_2\), and each of the processes spawns two threads \(T_1\) and \(T_2\):
```c
int x = 0;    // global
Lock L1;      // global
main( ) {
    create a thread to execute foo( ); // Thread T1
    create a thread to execute foo( ); // Thread T2
    wait for the two threads to finish execution;
    print (x);
}
foo( ) {
    int y = 0;
    Acquire L1;
    x = x + 1;
    y = y + 1;
    Release L1;
    print (y);
}
```
Which of the following statement(s) is/are correct?

- A) Both \(P_1\) and \(P_2\) will print the value of \(x\) as 2.  ✔ official
- B) At least one of \(P_1\) and \(P_2\) will print the value of \(x\) as 4.
- C) At least one of the threads will print the value of \(y\) as 2.
- D) Both \(T_1\) and \(T_2\), in both the processes, will print the value of \(y\) as 1.  ✔ official

---

**2021_AN_Q13** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

Consider a computer system with multiple shared resource types, with one instance per resource type. Each instance can be owned by only one process at a time. Owning and freeing of resources are done by holding a global lock (L). The following scheme is used to own a resource instance:
```
function OwnResource (Resource R)
    Acquire lock L // a global lock
    if R is available then
        Acquire R
        Release lock L
    else
        if R is owned by another process P then
            Terminate P, after releasing all resources owned by P
            Acquire R
            Restart P
            Release lock L
        end if
    end if
end function
```
Which of the following choice(s) about the above scheme is/are correct?

- A) The scheme ensures that deadlocks will not occur.  ✔ official
- B) The scheme may lead to live-lock.  ✔ official
- C) The scheme may lead to starvation.  ✔ official
- D) The scheme violates the mutual exclusion property.

---

**2021_FN_Q59** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the following pseudocode, where S is a semaphore initialized to 5 in line#2 and counter is a shared variable initialized to 0 in line#1. Assume that the increment operation in line#7 is not atomic.
```c
1. int counter = 0;
2. Semaphore S = init(5);
3. void parop(void)
4. {
5.     wait(S);
6.     wait(S);
7.     counter++;
8.     signal(S);
9.     signal(S);
10. }
```
If five threads execute the function parop concurrently, which of the following program behavior(s) is/are possible?

- A) The value of counter is 5 after all the threads successfully complete the execution of parop.  ✔ official
- B) The value of counter is 1 after all the threads successfully complete the execution of parop.  ✔ official
- C) The value of counter is 0 after all the threads successfully complete the execution of parop.
- D) There is a deadlock involving all the threads.  ✔ official

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

**2020_FN_Q18** · 2020-FN · MCQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Consider the following statements about process state transitions for a system using preemptive scheduling.
I. A running process can move to ready state.
II. A ready process can move to running state.
III. A blocked process can move to running state.
IV. A blocked process can move to ready state.
Which of the above statements are TRUE?

- A) I, II and III only
- B) II and III only
- C) I, II and IV only  ✔ official
- D) I, II, III and IV

---

**2020_FN_Q38** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Each of a set of \( n \) processes executes the following code using two semaphores \( a \) and \( b \) initialized to 1 and 0, respectively. Assume that count is a shared variable initialized to 0 and not used in CODE SECTION P.
```c
/* CODE SECTION P */
wait(a); count=count+1;
if (count==n) signal(b);
signal(a); wait(b); signal(b);
/* CODE SECTION Q */
```
What does the code achieve?

- A) It ensures that no process executes CODE SECTION Q before every process has finished CODE SECTION P.  ✔ official
- B) It ensures that at most two processes are in CODE SECTION Q at any time.
- C) It ensures that all processes execute CODE SECTION P mutually exclusively.
- D) It ensures that at most \( n - 1 \) processes are in CODE SECTION P at any time.

---

**2020_FN_Q40** · 2020-FN · MCQ · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider the following five disk access requests of the form (request id, cylinder number) that are present in the disk scheduler queue at a given time.
(P, 155), (Q, 85), (R, 110), (S, 30), (T, 115)
Assume the head is positioned at cylinder 100. The scheduler follows Shortest Seek Time First scheduling to service the requests.
Which one of the following statements is FALSE?

- A) T is serviced before P.
- B) Q is serviced after S but before T.  ✔ official
- C) The head reverses its direction of movement between servicing of Q and P.
- D) R is serviced before P.

---

**2020_FN_Q61** · 2020-FN · NAT · 2 marks · Medium · bank topic: CPU and I/O Scheduling · HAS A FIGURE (not shown here)

Consider the following set of processes, assumed to have arrived at time 0. Consider the CPU scheduling algorithms Shortest Job First (SJF) and Round Robin (RR). For RR, assume that the processes are scheduled in the order \( P_1, P_2, P_3, P_4 \).
[IMAGE_Q_61]
If the time quantum for RR is 4 ms, then the absolute value of the difference between the average turnaround times (in ms) of SJF and RR (round off to 2 decimal places) is ________.

Official answer (numeric): 5.25 to 5.25

---

**2020_FN_Q37** · 2020-FN · NAT · 2 marks · Hard · bank topic: Memory Management and Virtual Memory

Consider a paging system that uses 1-level page table residing in main memory and a TLB for address translation. Each main memory access takes 100 ns and TLB lookup takes 20 ns. Each page transfer to/from the disk takes 5000 ns. Assume that the TLB hit ratio is 95%, page fault rate is 10%. Assume that for 20% of the total page faults, a dirty page has to be written back to disk before the required page is read in from disk. TLB update time is negligible. The average memory access time in ns (round off to 1 decimal places) is ________.

Official answer (numeric): 154.5 to 155.5

---

**2019_FN_Q29** · 2019-FN · NAT · 1 mark · Medium · bank topic: System Calls, Processes, Threads, InterProcess Communication

Consider the following C program is executed on a Unix/Linux system:
```c
#include<unistd.h>
int main( )
{
    int i;
    for (i = 0; i < 10; i++)
        if (i % 2 == 0) fork( );
    return 0;
}
```
The total number of child processes created is ________.

Official answer (numeric): 31 to 31

---

**2019_FN_Q32** · 2019-FN · NAT · 1 mark · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks) · HAS A FIGURE (not shown here)

Consider three concurrent processes P1, P2 and P3 as shown below, which access a shared variable D that has been initialized to 100.
[IMAGE_Q_32]
The processes are executed on a uniprocessor system running a time-shared operating system. If the minimum and maximum possible values of D after the three processes have completed executed are X and Y respectively, then the value of Y – X is ________.

Official answer (numeric): 80 to 80

---

**2019_FN_Q42** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Memory Management and Virtual Memory

Assume that in a certain computer, the virtual addresses are 64 bits long and the physical addresses are 48 bits long. The memory is word addressable. The page size is 8 kB and the word size is 4 bytes. The Translation Look-aside Buffer (TLB) in the address translation path has 128 valid entries. At most how many distinct virtual addresses can be translated without any TLB miss?

- A) \( 16 \times 2^{10} \)
- B) \( 256 \times 2^{10} \)  ✔ official
- C) \( 4 \times 2^{20} \)
- D) \( 8 \times 2^{20} \)

---

**2019_FN_Q43** · 2019-FN · MCQ · 2 marks · Hard · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

Consider the following snapshot of a system running \( n \) concurrent processes. Process \( i \) is holding \( X_i \) instances of a resource R, \( 1 \le i \le n \). Assume that all instances of R are currently in use. Further, for all \( i \), process \( i \) can place a request for at most \( Y_i \) additional instances of R while holding the \( X_i \) instances it already has. Of the \( n \) processes, there are exactly two processes \( p \) and \( q \) such that \( Y_p = Y_q = 0 \). Which one of the following conditions guarantees that no other process apart from \( p \) and \( q \) can complete execution?

- A) \( X_p + X_q < \min \{Y_k \mid 1 \le k \le n, k \neq p, k \neq q\} \)  ✔ official
- B) \( X_p + X_q < \max \{Y_k \mid 1 \le k \le n, k \neq p, k \neq q\} \)
- C) \( \min (X_p, X_q) \ge \min \{Y_k \mid 1 \le k \le n, k \neq p, k \neq q\} \)
- D) \( \min (X_p, X_q) \le \max \{Y_k \mid 1 \le k \le n, k \neq p, k \neq q\} \)

---

**2019_FN_Q51** · 2019-FN · NAT · 2 marks · Hard · bank topic: CPU and I/O Scheduling · HAS A FIGURE (not shown here)

Consider the following four processes with arrival times (in milliseconds) and their length of CPU burst (in milliseconds) as shown below:
[IMAGE_Q_51]
These processes are run on a single processor using preemptive Shortest Remaining Time First scheduling algorithm. If the average waiting time of the processes is 1 millisecond, then the value of Z is ________.

Official answer (numeric): 2 to 2

---

**2019_FN_Q63** · 2019-FN · NAT · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

The index node (inode) of a Unix-like file system has 12 direct, one single-indirect and one double-indirect pointers. The disk block size is 4 kB and the disk block address is 32-bits long. The maximum possible file size is (rounded off to 1 decimal place) ________ GB.

Official answer (numeric): 3.7 to 3.8 OR 4.0 to 4.1

---

**2018_FN_Q20** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Memory Management and Virtual Memory

Consider a process executing on an operating system that uses demand paging. The average time for a memory access in the system is \(M\) units if the corresponding memory page is available in memory, and \(D\) units if the memory access causes a page fault. It has been experimentally measured that the average time taken for a memory access in the process is \(X\) units.
Which one of the following is the correct expression for the page fault rate experienced by the process?

- A) \((D - M) / (X - M)\)
- B) \((X - M) / (D - M)\)  ✔ official
- C) \((D - X) / (D - M)\)
- D) \((X - M) / (D - X)\)

---

**2018_FN_Q34** · 2018-FN · NAT · 1 mark · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

Consider a system with 3 processes that share 4 instances of the same resource type. Each process can request a maximum of \(K\) instances. Resource instances can be requested and released only one at a time. The largest value of \(K\) that will always avoid deadlock is ____.

Official answer (numeric): 2 to 2

---

**2018_FN_Q49** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

In a system, there are three types of resources: \(E, F\) and \(G\). Four processes \(P_0, P_1, P_2\) and \(P_3\) execute concurrently. At the outset, the processes have declared their maximum resource requirements using a matrix named Max as given below. For example, Max[\(P_2,F\)] is the maximum number of instances of \(F\) that \(P_2\) would require. The number of instances of the resources allocated to the various processes at any given state is given by a matrix named Allocation.
Consider a state of the system with the Allocation matrix as shown below, and in which 3 instances of \(E\) and 3 instances of \(F\) are the only resources available.

Allocation
E F G
\(P_0\) 1 0 1
\(P_1\) 1 1 2
\(P_2\) 1 0 3
\(P_3\) 2 0 0

Max
E F G
\(P_0\) 4 3 1
\(P_1\) 2 1 4
\(P_2\) 1 3 3
\(P_3\) 5 4 1

From the perspective of deadlock avoidance, which one of the following is true?

- A) The system is in safe state.  ✔ official
- B) The system is not in safe state, but would be safe if one more instance of E were available
- C) The system is not in safe state, but would be safe if one more instance of F were available
- D) The system is not in safe state, but would be safe if one more instance of G were available

---

**2018_FN_Q50** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the following solution to the producer-consumer synchronization problem. The shared buffer size is \(N\). Three semaphores empty, full and mutex are defined with respective initial values of 0, \(N\) and 1. Semaphore empty denotes the number of available slots in the buffer, for the consumer to read from. Semaphore full denotes the number of available slots in the buffer, for the producer to write to. The placeholder variables, denoted by P, Q, R, and S, in the code below can be assigned either empty or full. The valid semaphore operations are: wait() and signal().
Producer:
```c
do{
    wait(P);
    wait(mutex);
    //Add item to buffer
    signal(mutex);
    signal(Q);
}while(1);
```
Consumer:
```c
do{
    wait(R);
    wait(mutex);
    //Consume item from buffer
    signal(mutex);
    signal(S);
}while(1);
```
Which one of the following assignments to P, Q, R and S will yield the correct solution?

- A) P: full, Q: full, R: empty, S: empty
- B) P: empty, Q: empty, R: full, S: full
- C) P: full, Q: empty, R: empty, S: full  ✔ official
- D) P: empty, Q: full, R: full, S: empty

---

**2018_FN_Q63** · 2018-FN · NAT · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider a storage disk with 4 platters (numbered as 0, 1, 2 and 3), 200 cylinders (numbered as 0, 1, … , 199), and 256 sectors per track (numbered as 0, 1, … , 255). The following 6 disk requests of the form [sector number, cylinder number, platter number] are received by the disk controller at the same time:
[120, 72, 2] , [180, 134, 1] , [60, 20, 0] , [212, 86, 3] , [56, 116, 2] , [118, 16, 1]
Currently the head is positioned at sector number 100 of cylinder 80, and is moving towards higher cylinder numbers. The average power dissipation in moving the head over 100 cylinders is 20 milliwatts and for reversing the direction of the head movement once is 15 milliwatts. Power dissipation associated with rotational latency and switching of head between different platters is negligible.
The total power consumption in milliwatts to satisfy all of the above disk requests using the Shortest Seek Time First disk scheduling algorithm is _______.

Official answer (numeric): 85 to 85

---

**2017_AN_Q14** · 2017-AN · MCQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which of the following is/are shared by all the threads in a process?
I. Program counter
II. Stack
III. Address space
IV. Registers

- A) I and II only
- B) III only  ✔ official
- C) IV only
- D) III and IV only

---

**2017_AN_Q21** · 2017-AN · MCQ · 1 mark · Easy · bank topic: File Systems Operations & Disk Scheduling Optimization

In a file allocation system, which of the following allocation scheme(s) can be used if no external fragmentation is allowed?
I. Contiguous
II. Linked
III. Indexed

- A) I and III only
- B) II only
- C) III only
- D) II and III only  ✔ official

---

**2017_FN_Q25** · 2017-FN · MCQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Threads of a process share

- A) global variables but not heap
- B) heap but not global variables
- C) neither global variables nor heap
- D) both heap and global variables  ✔ official

---

**2017_FN_Q34** · 2017-FN · NAT · 1 mark · Medium · bank topic: CPU and I/O Scheduling · HAS A FIGURE (not shown here)

Consider the following CPU processes with arrival times (in milliseconds) and length of CPU bursts (in milliseconds) as given below:
[IMAGE_Q_34]
If the pre-emptive shortest remaining time first scheduling algorithm is used to schedule the processes, then the average waiting time across all processes is ________ milliseconds.

Official answer (numeric): 3.0 to 3.0

---

**2017_FN_Q61** · 2017-FN · MCQ · 2 marks · Easy · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

A multithreaded program P executes with \(x\) number of threads and uses \(y\) number of locks for ensuring mutual exclusion while operating on shared memory locations. All locks in the program are non-reentrant, i.e., if a thread holds a lock \(l\), then it cannot re-acquire lock \(l\) without releasing it. If a thread is unable to acquire a lock, it blocks until the lock becomes available. The minimum value of \(x\) and the minimum value of \(y\) together for which execution of P can result in a deadlock are:

- A) \(x = 1\), \(y = 2\)
- B) \(x = 2\), \(y = 1\)
- C) \(x = 2\), \(y = 2\)
- D) \(x = 1\), \(y = 1\)  ✔ official

---

**2017_AN_Q42** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery · HAS A FIGURE (not shown here)

A system shares 9 tape drives. The current allocation and maximum requirement of tape drives for three processes are shown below:
[IMAGE_Q_42]
Which of the following best describes current state of the system?

- A) Safe, Deadlocked
- B) Safe, Not Deadlocked  ✔ official
- C) Not Safe, Deadlocked
- D) Not Safe, Not Deadlocked

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

---

**2017_AN_Q57** · 2017-AN · NAT · 2 marks · Medium · bank topic: CPU and I/O Scheduling · HAS A FIGURE (not shown here)

Consider the set of processes with arrival time (in milliseconds), CPU burst time (in milliseconds), and priority (0 is the highest priority) shown below. None of the processes have I/O burst time.
[IMAGE_Q_57]
The average waiting time (in milliseconds) of all the processes using preemptive priority scheduling algorithm is ________.

Official answer (numeric): 29.0 to 29.0

