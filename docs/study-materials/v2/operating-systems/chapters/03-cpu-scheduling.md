# Review input: Operating Systems, chapter 03: CPU scheduling

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-03-cpu-scheduling.md` and `gemini-03-cpu-scheduling.md` in this folder.

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

This is **one chapter** (3 of 7) of the Operating Systems book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **CPU scheduling**. Written lessons today: 6 topics ready.



## The PYQs for this chapter (25)

**2026_AN_Q23** · 2026-AN · MCQ · 1 mark · Easy · bank topic: CPU and I/O Scheduling

Which one of the following CPU scheduling algorithms cannot be preemptive?

- A) Shortest Remaining Time First (SRTF) Scheduling
- B) First Come First Serve (FCFS) Scheduling  ✔ official
- C) Round Robin Scheduling
- D) Priority Scheduling

---

**2026_AN_Q53** · 2026-AN · NAT · 2 marks · Hard · bank topic: File Systems Operations & Disk Scheduling Optimization

To keep track of free blocks in a file system, one of the two approaches is generally used – using bitmaps (bit vectors) or using linked lists. Consider that the linked list approach is used to keep track of free blocks in a file system. Assume that the disk size is 16 GB, block size is 2 KB, and block numbers used are 32-bit long. A single pointer of size 4 bytes is used in each block of the list to point to the next block of the list. The number of blocks required to hold the free disk block numbers is ________. (answer in integer)
Note: 1K = \( 2^{10} \) and 1G = \( 2^{30} \)

Official answer (numeric): 16417 to 16417

---

**2026_FN_Q59** · 2026-FN · NAT · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider a hard disk with a rotational speed of 15000 rpm. The time to move the read/write head from a track to its adjacent track is 1 millisecond. Initially, the head is on track 0. The number of sectors per track is 400. The sector size is 1024 bytes. It is necessary to transfer data from 10 randomly located sectors in each of the following tracks in the order: 5, 12 and 7.
The total time for the data transfer (in milliseconds) from the hard disk is ________. (rounded off to one decimal place)

Official answer (numeric): 77.3 to 77.3

---

**2026_FN_Q64** · 2026-FN · NAT · 2 marks · Medium · bank topic: CPU and I/O Scheduling

Consider a CPU that has to execute two types of processes. The first type, Actuators (A), requires a CPU burst of 6 seconds. The second type, Controllers (C), requires a CPU burst of 8 seconds. A new process of type A arrives at time \( t = 10, 20, 30, 40, \) and \( 50 \) (in seconds). Similarly, a new process of type C arrives at time \( t = 11, 22, 33, 44, \) and \( 55 \) (in seconds). The CPU scheduling policy is First Come First Serve (FCFS). The first process of type A starts running at \( t = 10 \) seconds. The average waiting time (in seconds) for the 10 processes is ________. (rounded off to one decimal place)

Official answer (numeric): 9.5 to 9.5

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

**2025_FN_Q51** · 2025-FN · NAT · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

A disk of size 512 M bytes is divided into blocks of 64 K bytes. A file is stored in the disk using linked allocation. In linked allocation, each data block reserves 4 bytes to store the pointer to the next data block. The link part of the last data block contains a NULL pointer (also of 4 bytes). Suppose a file of 1 M bytes needs to be stored in the disk. Assume, \( 1\text{ K} = 2^{10} \) and \( 1\text{ M} = 2^{20} \). The amount of space in bytes that will be wasted due to internal fragmentation is ________. (Answer in integer)

Official answer (numeric): 65468 to 65468

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

**2024_AN_Q61** · 2024-AN · NAT · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider a disk with the following specifications: rotation speed of 6000 RPM, average seek time of 5 milliseconds, 500 sectors/track, 512 byte sectors. A file has content stored in 3000 sectors located randomly on the disk. Assuming average rotational latency, the total time (in seconds, rounded off to 2 decimal places) to read the entire file from the disk is ________.

Official answer (numeric): 29.50 to 30.50

---

**2024_FN_Q39** · 2024-FN · NAT · 2 marks · Easy · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider a 512 GB hard disk with 32 storage surfaces. There are 4096 sectors per track and each sector holds 1024 bytes of data. The number of cylinders in the hard disk is ________.

Official answer (numeric): 4096 to 4096

---

**2023_FN_Q27** · 2023-FN · MSQ · 1 mark · Easy · bank topic: CPU and I/O Scheduling

Which one or more of the following CPU scheduling algorithms can potentially cause starvation?

- A) First-in First-Out  ✔ official
- B) Round Robin
- C) Priority Scheduling  ✔ official
- D) Shortest Job First  ✔ official

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

**2018_FN_Q63** · 2018-FN · NAT · 2 marks · Medium · bank topic: File Systems Operations & Disk Scheduling Optimization

Consider a storage disk with 4 platters (numbered as 0, 1, 2 and 3), 200 cylinders (numbered as 0, 1, … , 199), and 256 sectors per track (numbered as 0, 1, … , 255). The following 6 disk requests of the form [sector number, cylinder number, platter number] are received by the disk controller at the same time:
[120, 72, 2] , [180, 134, 1] , [60, 20, 0] , [212, 86, 3] , [56, 116, 2] , [118, 16, 1]
Currently the head is positioned at sector number 100 of cylinder 80, and is moving towards higher cylinder numbers. The average power dissipation in moving the head over 100 cylinders is 20 milliwatts and for reversing the direction of the head movement once is 15 milliwatts. Power dissipation associated with rotational latency and switching of head between different platters is negligible.
The total power consumption in milliwatts to satisfy all of the above disk requests using the Shortest Seek Time First disk scheduling algorithm is _______.

Official answer (numeric): 85 to 85

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

**2017_FN_Q34** · 2017-FN · NAT · 1 mark · Medium · bank topic: CPU and I/O Scheduling · HAS A FIGURE (not shown here)

Consider the following CPU processes with arrival times (in milliseconds) and length of CPU bursts (in milliseconds) as given below:
[IMAGE_Q_34]
If the pre-emptive shortest remaining time first scheduling algorithm is used to schedule the processes, then the average waiting time across all processes is ________ milliseconds.

Official answer (numeric): 3.0 to 3.0

---

**2017_AN_Q57** · 2017-AN · NAT · 2 marks · Medium · bank topic: CPU and I/O Scheduling · HAS A FIGURE (not shown here)

Consider the set of processes with arrival time (in milliseconds), CPU burst time (in milliseconds), and priority (0 is the highest priority) shown below. None of the processes have I/O burst time.
[IMAGE_Q_57]
The average waiting time (in milliseconds) of all the processes using preemptive priority scheduling algorithm is ________.

Official answer (numeric): 29.0 to 29.0

