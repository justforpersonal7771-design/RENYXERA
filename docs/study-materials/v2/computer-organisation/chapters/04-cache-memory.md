# Review input: Computer Organisation, chapter 04: Cache memory

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-04-cache-memory.md` and `gemini-04-cache-memory.md` in this folder.

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

This is **one chapter** (4 of 6) of the Computer Organisation book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Cache memory**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (27)

**2026_FN_Q38** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

The size of the physical address space of a processor is \( 2^{32} \) bytes. The capacity of a cache memory unit is \( 2^{23} \) bytes. The cache block size is 128 bytes. The cache memory unit can be built as a direct mapped cache or as a \( K \)-way set-associative cache, where \( K = 2^k \) and \( L \in \{1, 2, 3\} \). Let the length of the TAG field be \( M \) bits for the direct mapped cache, and \( N \) bits for the set-associative cache.
Which one of the following options is true?

- A) \( N = M + L \)  ✔ official
- B) \( N = M - L \)
- C) \( N = M + K \)
- D) \( N = M - K \)

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

**2026_AN_Q56** · 2026-AN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a system with 1 MB physical memory and a word length of 1 byte. The system uses a direct mapped cache, with block numbers starting from 0. The word with physical address 0xA2C28 is mapped to the cache block number \( 176_{10} \). The maximum possible size of the cache (in KB) for this configuration is ________. (answer in integer)
Note: 1K = \( 2^{10} \) and 1M = \( 2^{20} \)

Official answer (numeric): 128 to 128

---

**2025_FN_Q36** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a memory system with 1 M bytes of main memory and 16 K bytes of cache memory. Assume that the processor generates 20-bit memory address, and the cache block size is 16 bytes. If the cache uses direct mapping, how many bits will be required to store all the tag values?
[Assume memory is byte addressable, \( 1\text{ K} = 2^{10}, 1\text{ M} = 2^{20} \)]

- A) \( 6 \times 2^{10} \)  ✔ official
- B) \( 8 \times 2^{10} \)
- C) \( 2^{12} \)
- D) 214

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

**2024_FN_Q41** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider two set-associative cache memory architectures: **WBC**, which uses the write back policy, and **WTC**, which uses the write through policy. Both of them use the LRU (Least Recently Used) block replacement policy. The cache memory is connected to the main memory. Which of the following statements is/are TRUE?

- A) A read miss in **WBC** never evicts a dirty block
- B) A read miss in **WTC** never triggers a write back operation of a cache block to main memory  ✔ official
- C) A write hit in **WBC** can modify the value of the dirty bit of a cache block  ✔ official
- D) A write miss in **WTC** always writes the victim cache block to main memory before loading the missed block to the cache

---

**2024_FN_Q56** · 2024-FN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

A given program has 25% load/store instructions. Suppose the ideal CPI (cycles per instruction) without any memory stalls is 2. The program exhibits 2% miss rate on instruction cache and 8% miss rate on data cache. The miss penalty is 100 cycles. The speedup (rounded off to two decimal places) achieved with a perfect cache (i.e., with NO data or instruction cache misses) is ________.

Official answer (numeric): 3.00 to 3.00

---

**2023_FN_Q64** · 2023-FN · NAT · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

An 8-way set associative cache of size 64 KB (1 KB = 1024 bytes) is used in a system with 32-bit address. The address is sub-divided into TAG, INDEX, and BLOCK OFFSET.
The number of bits in the TAG is ________.

Official answer (numeric): 19 to 19

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

**2021_AN_Q65** · 2021-AN · NAT · 1 mark · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

Consider a set-associative cache of size 2 KB (1 KB = \(2^{10}\) bytes) with cache block size of 64 bytes. Assume that the cache is byte-addressable and a 32-bit address is used for accessing the cache. If the width of the tag field is 22 bits, the associativity of the cache is _________.

Official answer (numeric): 2 to 2

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

**2018_FN_Q44** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Memory Hierarchy (Direct/Associative Cache Mapping)

The size of the physical address space of a processor is \(2^P\) bytes. The word length is \(2^W\) bytes. The capacity of cache memory is \(2^N\) bytes. The size of each cache block is \(2^M\) words. For a \(K\)-way set-associative cache memory, the length (in number of bits) of the tag field is

- A) \(P - N - \log_2 K\)
- B) \(P - N + \log_2 K\)  ✔ official
- C) \(P - N - M - W - \log_2 K\)
- D) \(P - N - M - W + \log_2 K\)

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

