import type { Topic } from "@/lib/study/schema";

/**
 * Computer Organisation chapter O5 "Main memory and secondary storage" (29 Nov 2026). SRAM and DRAM, building a memory from chips, DRAM refresh, interleaving, ROM, the disk (capacity, seek,
 * rotational latency, transfer), RAID, and how the TLB, the page table and the cache can follow one another on a reference. Real GATE questions (texts from public/data/questions.json), each re-solved
 * here: 2026 FN Q54 (the events that can never happen: B and C) and 2018 FN Q33 (the time left after refresh: 59 per cent).
 * Programs compiled and run with gcc: the number of chips and the refresh share of the 2018 question; a disk access time.
 */
export const chapterO5: Topic = {
  id: "cs.coa.v2.mem5",
  title: "Main memory and secondary storage",
  no: "O5",
  book: [
    { t: "p", text: "Below the cache sits the **main memory**, built from DRAM chips, and below that the **secondary storage**, the disk. They are far larger and far slower than the cache. Two real GATE questions test this part directly, one on DRAM refresh and one on the order in which the TLB, the page table and the cache can answer a reference. The rest of the chapter is the background that makes those two questions, and any variation of them, easy." },
    { t: "p", text: "The chapter is deliberately short in questions and long in ideas: the memory systems of a computer are described by a handful of formulas (capacity from rows and columns, refresh time, disk access time, RAID capacity), and each is one line of arithmetic once the picture is clear." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["tell SRAM from DRAM and say why DRAM needs refresh;", "build a wide, large memory from small chips and count the chips and address lines;", "compute the share of time a memory loses to refresh;", "explain interleaving and what it speeds up;", "compute the capacity of a disk and its average access time;", "name the RAID levels by what they store and how much capacity they keep;", "decide which sequences of TLB, page-table and cache events can happen."] },

    { t: "h2", text: "SRAM and DRAM" },
    { t: "p", text: "A memory cell holds one bit. In **SRAM** (static RAM) a cell is a small latch of about six transistors. It keeps its value as long as power is on, it is fast, and it takes a lot of silicon per bit, so it is used for registers and caches. In **DRAM** (dynamic RAM) a cell is one transistor and one tiny capacitor: the bit is the charge on the capacitor. It is small and cheap, so it is used for the main memory, but the charge leaks away." },
    { t: "p", text: "Because the charge leaks, every DRAM row must be read and written back (**refreshed**) within a fixed **refresh period**, typically a few milliseconds. A DRAM chip is a grid of rows and columns; the address is sent in two halves, first the **row address** and then the **column address**, which halves the number of pins. A refresh operation refreshes one row at a time, so refreshing the whole chip takes (number of rows) refresh operations." },
    { t: "table", head: ["", "SRAM", "DRAM"], rows: [
      ["Cell", "latch (about 6 transistors)", "1 transistor + 1 capacitor"], ["Speed", "fast", "slower"], ["Density and cost", "low density, costly", "high density, cheap"],
      ["Refresh", "none", "needed every few ms"], ["Used for", "registers, cache", "main memory"],
    ], caption: "SRAM against DRAM." },
    { t: "callout", kind: "key", text: "DRAM loses its charge, so every row is refreshed within the refresh period. The memory is unavailable for reads and writes while a row is being refreshed." },

    { t: "h2", text: "Building a memory from chips" },
    { t: "p", text: "A chip is described as (words) × (bits per word), for example 256M × 4 bits: 256 M locations of 4 bits each, a total of 1 Gbit. To build a memory of W words of B bits from chips of w words of b bits, we need **(W ÷ w) × (B ÷ b)** chips: the second factor widens the word, the first deepens the memory." },
    { t: "p", text: "A 1 GB memory that is 32 bits wide has 2³⁰ × 8 ÷ 32 = 2²⁸ = 256 M words of 32 bits. Built from 256M × 4-bit chips, each chip supplies 4 bits of the word: 32 ÷ 4 = 8 chips side by side and 256M ÷ 256M = 1 row of chips, so **8 chips** in all. The address of the memory has 28 bits for the word, and the 2 low bits of a byte address select the byte within the word." },
    { t: "p", text: "The address lines of the memory split into **chip-select** bits (which row of chips) and the **internal address** bits (which word inside a chip). With 2 rows of chips, for example, one top bit of the address chooses the row through a decoder and the rest go to every chip." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    long long words = (1LL << 30) * 8 / 32;          /* 1 GB organised as 32-bit words */
    long long chip_words = 256LL << 20;              /* a 256M x 4-bit chip */
    int chips = (int)((words / chip_words) * (32 / 4));
    printf("%d\\n", chips);
    return 0;
}`, out: "8", file: "chip_count.c" },

    { t: "h2", text: "DRAM refresh and the time it costs" },
    { t: "p", text: "The refresh costs time: while a row is refreshed the memory cannot serve a read or a write. If a chip has R rows, each refresh operation takes t_r, and the whole chip must be refreshed once every refresh period T, then the refresh work per period is R × t_r. The fraction of time lost is **R × t_r ÷ T**, and the fraction available for real reads and writes is one minus that." },
    { t: "p", text: "GATE 2018: a 1 GB, 32-bit memory built of 256M × 4 chips, each chip with 2¹⁴ rows, a refresh operation of 50 ns, a refresh period of 2 ms. All the chips of a row are refreshed in parallel, so the memory refreshes 2¹⁴ rows in each period. The time is 2¹⁴ × 50 ns = 16384 × 50 ns = 819.2 µs. The fraction lost is 819.2 µs ÷ 2000 µs = 0.4096, so about 41% of the time goes to refresh and **59%** is left for reads and writes." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    double rows = 16384, t_refresh = 50e-9, period = 2e-3;
    double lost = rows * t_refresh / period;          /* share of every period spent refreshing */
    printf("%.0f\\n", 100.0 * (1.0 - lost));          /* percent left for reads and writes */
    return 0;
}`, out: "59", file: "refresh_share.c" },
    { t: "ex", id: "o5-e1" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Interleaving and ROM" },
    { t: "p", text: "A single memory bank can serve one access at a time, and after an access it needs a recovery time. **Interleaving** splits the memory into several banks and spreads consecutive addresses over them. In **low-order interleaving** with k banks, the low log₂ k bits of the address choose the bank, so consecutive words are in different banks and the banks can work on consecutive accesses in an overlapping way. A sequential read of a block then proceeds at nearly one word per bank-cycle divided by k." },
    { t: "p", text: "The same idea is why a cache miss can fetch a block faster than one word at a time, as in the bandwidth question of the cache chapter. **High-order interleaving** uses the top bits to choose the bank, so each bank holds a contiguous range; it helps when several independent programs use different ranges, not for a sequential sweep." },
    { t: "p", text: "A **ROM** keeps its contents without power. A mask ROM is written at the factory; a **PROM** can be written once; an **EPROM** is erased with ultraviolet light and written again; an **EEPROM** and **flash** memory are erased electrically, flash a block at a time. Flash is what the solid-state drives are made of." },

    { t: "h2", text: "Secondary storage: the disk" },
    { t: "p", text: "A hard disk has one or more **platters**, each with two **surfaces**. Each surface has concentric **tracks**, and each track is divided into **sectors**, the unit of transfer (commonly 512 bytes or 4 KB). The tracks at the same position on all the surfaces form a **cylinder**. The capacity is **surfaces × tracks per surface × sectors per track × bytes per sector**." },
    { t: "p", text: "The time to read a sector is the sum of three parts. The **seek time** moves the arm to the right track. The **rotational latency** waits for the sector to come under the head, on average **half a rotation**. The **transfer time** is the time for the sector to pass under the head, one rotation divided by the number of sectors per track. So **access time = seek + ½ rotation + sector transfer**." },
    { t: "p", text: "For a 7200 rpm disk, one rotation takes 60 ÷ 7200 s = 8.33 ms, so the average rotational latency is 4.17 ms. With 100 sectors per track the transfer of one sector is 8.33 ÷ 100 = 0.083 ms. If the average seek is 5 ms, the average access time is 5 + 4.167 + 0.083 = **9.25 ms**. The mechanical parts dominate: the transfer is under 1% of the total, which is why the operating system schedules requests to reduce seeks." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    double rpm = 7200, seek_ms = 5.0, sectors = 100;
    double rot_ms = 60000.0 / rpm;                    /* one rotation in ms */
    double access = seek_ms + rot_ms / 2 + rot_ms / sectors;
    printf("%.2f\\n", access);
    return 0;
}`, out: "9.25", file: "disk_access.c" },
    { t: "fig", id: "o5-f1" },
    { t: "ex", id: "o5-e2" },
    { t: "p", text: "Two details of the disk matter in questions. The **sector** is read as a whole, so reading 4 sectors in a row costs one seek and one rotational wait but four transfers. And the disk's **data rate** while a sector passes under the head is the sector size divided by the transfer time: 512 bytes in 0.083 ms is about 6 MB/s per track, far above what the seek-dominated average gives." },
    { t: "p", text: "**RAID** (redundant array of independent disks) combines disks for speed, safety or both. **RAID 0** stripes data over the disks with no redundancy: all the capacity, the best speed, no protection. **RAID 1** mirrors each disk: half the capacity, survives one failure. **RAID 5** stripes data and spreads one disk's worth of **parity** over all the disks: with n disks the capacity is (n − 1) disks and it survives one failure. **RAID 6** keeps two parities, capacity (n − 2), and survives two failures." },
    { t: "table", head: ["RAID", "Stores", "Usable capacity of n disks", "Failures survived"], rows: [
      ["0", "striping", "n", "0"], ["1", "mirroring", "n ÷ 2", "1 (at least)"], ["5", "striping + distributed parity", "n − 1", "1"], ["6", "striping + two parities", "n − 2", "2"],
    ], caption: "The RAID levels in the syllabus." },
    { t: "ex", id: "o5-e3" },

    { t: "h2", text: "TLB, page table and cache on one reference" },
    { t: "p", text: "With virtual memory, a reference passes through the **MMU**: the **TLB** (translation lookaside buffer, a small cache of page-table entries) is searched first. On a **TLB hit** the physical address is ready at once. On a **TLB miss** the **page table** in memory is consulted: if the page is in memory (a **page-table hit**) the entry is loaded into the TLB; if not, a **page fault** occurs and the operating system brings the page from disk. Only then does the physical address go to the cache, which hits or misses." },
    { t: "p", text: "That order fixes which combinations of events can happen. GATE 2026 adds a rule: when a page leaves the main memory, the cache blocks that belong to it are marked **invalid**. Check each sequence. **TLB miss, page-table hit, cache hit:** the page is in memory and its block can be in the cache: possible. **TLB hit, page-table miss, cache hit:** a TLB entry exists only for a page that is in memory, so the page table cannot miss: **never**. **TLB miss, page-table miss, cache hit:** the page is not in memory, so its cache blocks are invalid and cannot hit: **never**. **TLB miss, page-table miss, cache miss:** a page fault, then the block is fetched: possible. The impossible ones are **B and C**." },
    { t: "fig", id: "o5-f2" },
    { t: "ex", id: "o5-e4" },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["SRAM: latch cell, fast, no refresh, caches. DRAM: transistor and capacitor, slow, refresh, main memory.", "Chips needed = (W ÷ w) × (B ÷ b).", "Refresh share = rows × refresh time ÷ refresh period; the rest is for reads and writes (59% in GATE 2018).", "Low-order interleaving spreads consecutive addresses over banks.", "Disk capacity = surfaces × tracks × sectors × bytes; access = seek + half a rotation + transfer.", "RAID 0 n, RAID 1 n ÷ 2, RAID 5 n − 1, RAID 6 n − 2 of capacity.", "Reference path: TLB, then page table, then cache. A TLB hit means the page is in memory; an evicted page's cache blocks are invalid."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "o5-f1", caption: "The three parts of a disk access for the 7200 rpm example. The arm movement and the wait for the sector turn up almost the whole time; the transfer is under one per cent.", alt: "A table of the three parts of the disk access time with their values in milliseconds.", fig: { kind: "trace", title: "Average access time, 7200 rpm, 100 sectors, 5 ms seek", cols: ["part", "how", "ms"], rows: [
      { cells: ["seek", "given", "5.000"] }, { cells: ["rotational latency", "½ × 8.333", "4.167"] }, { cells: ["transfer", "8.333 ÷ 100", "0.083"] }, { cells: ["access time", "sum", "9.250"], tone: "ok" },
    ] } },
    { type: "figure", id: "o5-f2", caption: "The four sequences of GATE 2026 FN Q54. A TLB hit means the page is resident; a page-table miss means it is not, and the cache blocks of an evicted page are invalid.", alt: "A table of the four event sequences and whether each can happen, with the reason.", fig: { kind: "trace", title: "Can it happen?", cols: ["TLB", "page table", "cache", "possible", "why"], rows: [
      { cells: ["miss", "hit", "hit", "yes", "page resident, block cached"], tone: "ok" }, { cells: ["hit", "miss", "hit", "never", "a TLB entry means the page is resident"], tone: "bad" }, { cells: ["miss", "miss", "hit", "never", "evicted page: blocks invalid"], tone: "bad" }, { cells: ["miss", "miss", "miss", "yes", "page fault, then a fetch"], tone: "ok" },
    ] } },
    { type: "example", id: "o5-e1", level: "gate", title: "GATE CS 2018 (forenoon), Q33 · 1 mark · the time left after DRAM refresh", file: "gate2018_fn_q33.txt", given: `A 32-bit wide main memory of 1 GB is built from 256M × 4-bit DRAM chips. A chip has 2¹⁴ rows of cells. One refresh operation takes 50 ns. The refresh period is 2 ms. The percentage of the time available for read and write operations, rounded to the closest integer?`, find: "The percentage.", steps: [
      { say: "All chips of the single row of 8 refresh together, so the memory refreshes 2¹⁴ rows per period.", result: "16384 rows" },
      { say: "Refresh time per period: 16384 × 50 ns.", result: "819.2 µs" },
      { say: "Share lost: 819.2 µs ÷ 2000 µs.", result: "40.96%" },
      { say: "Time left: 100 − 40.96.", result: "59%" },
    ], answer: "59", check: "The program in this chapter prints 59." },
    { type: "example", id: "o5-e2", level: "edge", title: "Disk access time and capacity", file: "disk_edge.txt", given: `A disk has 4 surfaces, 1000 tracks per surface, 200 sectors per track and 512 bytes per sector; it spins at 6000 rpm; the average seek is 8 ms. Find its capacity and the average time to read one sector.`, find: "The capacity and the access time.", steps: [
      { say: "Capacity = 4 × 1000 × 200 × 512 bytes.", result: "409 600 000 bytes ≈ 390.6 MiB" },
      { say: "One rotation = 60 ÷ 6000 = 10 ms; half = 5 ms.", result: "5 ms" },
      { say: "Sector transfer = 10 ms ÷ 200.", result: "0.05 ms" },
      { say: "Access = 8 + 5 + 0.05.", result: "13.05 ms" },
    ], answer: "409 600 000 bytes; 13.05 ms", check: "The seek and the rotational latency are 99.6% of the time." },
    { type: "example", id: "o5-e3", level: "edge", title: "RAID capacity", file: "raid_edge.txt", given: `Six disks of 2 TB each are used in RAID 0, RAID 1, RAID 5 and RAID 6. What is the usable capacity of each?`, find: "The four capacities.", steps: [
      { say: "RAID 0: all six.", result: "12 TB" },
      { say: "RAID 1: half.", result: "6 TB" },
      { say: "RAID 5: n − 1 = 5.", result: "10 TB" },
      { say: "RAID 6: n − 2 = 4.", result: "8 TB" },
    ], answer: "12, 6, 10 and 8 TB", check: "More protection means less usable capacity." },
    { type: "example", id: "o5-e4", level: "gate", title: "GATE CS 2026 (forenoon), Q54 · 2 marks · MSQ: event sequences that can never happen", file: "gate2026_fn_q54.txt", given: `A cache holds physical addresses; the MMU has a TLB. When a page is evicted from main memory, the cache blocks of that page are marked invalid. Which of the following sequences can NEVER happen?
A) TLB miss, page table hit, cache hit   B) TLB hit, page table miss, cache hit   C) TLB miss, page table miss, cache hit   D) TLB miss, page table miss, cache miss`, find: "The impossible sequences.", steps: [
      { say: "A: the page is in memory and its block may be cached.", result: "possible" },
      { say: "B: a TLB hit means the page is in memory, so the page table cannot miss.", result: "never" },
      { say: "C: a page-table miss means the page is not in memory, so its blocks are invalid and the cache cannot hit.", result: "never" },
      { say: "D: a page fault, then the block is fetched: possible.", result: "possible" },
    ], answer: "B, C", check: "The path is TLB, then page table, then cache." },

    { type: "trap", wrong: "Refresh time is the time to refresh one row.", tempting: "The question quotes 'one refresh operation takes 50 ns'.", whyWrong: "The memory must refresh every row once per period. One operation refreshes one row, so the refresh work per period is the number of rows times the operation time: 2¹⁴ × 50 ns = 819.2 µs, not 50 ns.", rule: "Lost share = rows × t_refresh ÷ refresh period.", ex: { text: "Using 50 ns ÷ 2 ms would give 0.0025%, and an answer of 100 instead of 59." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q54 · 2018 FN Q33. Refresh: rows × time ÷ period. Reference path: TLB, page table, cache." },
    { type: "recall", cards: [
      { q: "SRAM against DRAM cell?", a: "SRAM: a latch. DRAM: a transistor and a capacitor, so it needs refresh." },
      { q: "Chips for W × B memory from w × b chips?", a: "(W ÷ w) × (B ÷ b)." },
      { q: "Share of time lost to refresh?", a: "Rows × refresh time ÷ refresh period." },
      { q: "Low-order interleaving?", a: "The low address bits choose the bank, so consecutive words use different banks." },
      { q: "Disk capacity?", a: "Surfaces × tracks × sectors × bytes per sector." },
      { q: "Disk access time?", a: "Seek + half a rotation + sector transfer." },
      { q: "RAID 5 capacity?", a: "n − 1 disks, with distributed parity." },
      { q: "What does a TLB hit imply?", a: "The page is in main memory." },
    ] },
    { type: "check", questions: [
      { id: "o5c1", kind: "NAT", marks: 1, q: "A memory of 64M words × 32 bits is built from 16M × 8 chips. The number of chips is", answer: "16", solution: "(64M ÷ 16M) × (32 ÷ 8) = 4 × 4 = 16." },
      { id: "o5c2", kind: "NAT", marks: 2, q: "A DRAM has 8192 rows, refresh takes 100 ns per row, the period is 4 ms. The percentage of time available for access is (rounded to an integer)", answer: "80", solution: "8192 × 100 ns = 819.2 µs; ÷ 4 ms = 20.48%; 79.52% ≈ 80." },
      { id: "o5c3", kind: "MCQ", marks: 1, q: "Which memory needs periodic refresh?", options: ["SRAM", "DRAM", "ROM", "Cache"], answer: "B", solution: "DRAM stores charge on capacitors." },
      { id: "o5c4", kind: "NAT", marks: 2, q: "A disk at 5400 rpm has an average seek of 10 ms and 120 sectors per track. The average access time for a sector, in ms (two decimals), is", answer: "15.65", solution: "One rotation 11.11 ms; half = 5.556; transfer 11.111 ÷ 120 = 0.0926; total 10 + 5.556 + 0.093 = 15.65." },
      { id: "o5c5", kind: "MSQ", marks: 2, q: "Which are true of RAID 5?", options: ["It survives one disk failure", "It keeps parity distributed over all disks", "Its capacity of n disks is n ÷ 2", "It stripes data"], answer: "A, B, D", solution: "Capacity is n − 1 disks." },
      { id: "o5c6", kind: "NAT", marks: 1, q: "Five disks of 4 TB each are used in RAID 5. The usable capacity in TB is", answer: "16", solution: "(5 − 1) × 4 = 16." },
      { id: "o5c7", kind: "MCQ", marks: 1, q: "A TLB hit and a page-table miss for the same reference", options: ["Can happen", "Never happens", "Happens only for writes", "Happens only after a context switch"], answer: "B", solution: "A TLB entry exists only for a resident page." },
      { id: "o5c8", kind: "MCQ", marks: 1, q: "Low-order interleaving puts consecutive addresses in", options: ["The same bank", "Different banks", "The cache", "The TLB"], answer: "B", solution: "The low bits select the bank." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on memory", sub: "Computer Organisation", href: "/topics/computer-organization-and-architecture-coa" }, { label: "I/O, interrupts and DMA", sub: "the next chapter", href: "/study/io-interrupts-dma" }] },
    { type: "links", prereq: ["Cache memory (O4)"], usedIn: ["Virtual memory (Operating Systems)", "Disk scheduling (Operating Systems)"], cross: ["Operating Systems: virtual memory and files"] },
  ],
};
