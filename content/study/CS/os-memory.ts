import type { Chapter, Topic } from "@/lib/study/schema";
import { OS_SEGMENT } from "@/content/study/CS/os-extra";

/**
 * Operating System → Memory management. Our own numbers; placement and access times checked with the lab functions
 * (components/study/memory-labs.tsx: place, eat). Holes 150, 400, 250, 300, 500 KB; requests 220, 410, 110, 280 KB.
 * First fit and best fit place all four; worst fit cannot place 410 KB although 990 KB is free.
 */

const contiguous: Topic = {
  id: "cs.os.mem.contiguous",
  title: "Contiguous allocation and fragmentation",
  blocks: [
    { type: "hook", text: "A cinema has 990 empty seats but cannot seat a group of 410, because no single row has 410 seats together. Memory has the same problem when each program must sit in one unbroken block." },
    { type: "objectives", items: ["Place requests with first fit, best fit and worst fit.", "Tell internal fragmentation from external fragmentation.", "Explain compaction and why paging removes external fragmentation."] },
    { type: "intuition", paras: ["In contiguous allocation each process gets one continuous range of addresses. As processes come and go, free memory breaks into holes of different sizes scattered between allocated blocks.", "When a new process arrives, the OS must choose a hole. First fit takes the first hole that is big enough; best fit takes the smallest that is big enough; worst fit takes the largest.", "External fragmentation is free memory split into pieces too small to use. Internal fragmentation is space wasted inside an allocated block, for example when memory is handed out in fixed sizes larger than asked for."], analogyLimit: "People in a cinema can shuffle along a row; moving programs in memory (compaction) is possible but costs time, because every moved program must be copied and its addresses fixed." },
    { type: "definition", name: "Placement and fragmentation", text: "Contiguous allocation gives each process a single block. A placement policy picks which free hole to use.", items: ["First fit: the first hole large enough (fast).", "Best fit: the smallest hole large enough (leaves tiny leftovers).", "Worst fit: the largest hole (leaves big leftovers, but uses up large holes).", "External fragmentation: enough total free memory, but not in one piece.", "Internal fragmentation: unused space inside an allocated block."] },
    { type: "deep", sections: [
      { h: "The buddy system", paras: ["Memory is handed out in blocks whose sizes are powers of two. A request is rounded up to the next power of two; a larger free block is split in halves (buddies) until one of the right size appears. When a block is freed and its buddy is also free, the two merge back. A 70 KB request from a free 512 KB block splits 512 → 256 → 128 and takes a 128 KB block: fast splitting and merging, but up to almost half the block wasted inside (internal fragmentation: 58 KB here)."] },
      { h: "Fixed versus variable partitions", paras: ["With fixed partitions memory is cut into blocks in advance; a small process in a big partition wastes the rest (internal fragmentation). With variable partitions each process gets exactly what it asks for, which avoids internal waste but creates holes (external fragmentation)."] },
      { h: "The 50-percent rule", paras: ["Studies of first fit show that, with N allocated blocks, about another 0.5N blocks are lost to fragmentation: roughly one third of memory can become unusable. That is why pure contiguous allocation is rare today."] },
      { h: "Compaction", paras: ["Compaction moves all allocated blocks to one end so the free space becomes one big hole. It needs dynamic relocation (addresses translated at run time by a base register) and can take a long time, so systems avoid doing it often."] },
      { h: "Base and limit registers", paras: ["Hardware protects contiguous blocks with two registers: base (where the block starts) and limit (its size). Every address the process uses is checked against the limit and then added to the base. A larger address traps to the operating system."] },
    ] },
    { type: "walkthrough", steps: ["List the holes in memory order and the requests in arrival order.", "For each request, find all holes that are large enough.", "Pick by the policy: first in order, smallest, or largest.", "Shrink that hole by the request size and continue.", "If no hole is large enough, the request fails; compare with the total free memory to spot external fragmentation."], prompt: { q: "Does best fit always waste the least memory?", a: "No. It leaves very small leftovers that are often too small to use, so it can fragment memory badly; which policy wins depends on the request pattern." } },
    { type: "figure", id: "holes", caption: "The starting holes, in memory order.", alt: "Holes of 150, 400, 250, 300 and 500 KB.", fig: { kind: "matrix", title: "Free holes (KB)", cols: ["Size"], rows: [{ label: "Hole 1", cells: [150] }, { label: "Hole 2", cells: [400] }, { label: "Hole 3", cells: [250] }, { label: "Hole 4", cells: [300] }, { label: "Hole 5", cells: [500] }] } },
    { type: "example", id: "fx1", level: "gate", title: "First fit and best fit", given: "Holes 150, 400, 250, 300, 500 KB. Requests in order: 220, 410, 110, 280 KB.", find: "Where does each request go under first fit and best fit?",
      steps: [
        { say: "First fit: 220 → first hole ≥ 220 is 400 (180 left). 410 → 500 (90 left). 110 → 150 (40 left). 280 → 300 (20 left).", result: "all placed" },
        { say: "Best fit: 220 → smallest ≥ 220 is 250 (30 left). 410 → 500 (90 left). 110 → 150 (40 left). 280 → 300 (20 left).", result: "all placed" },
      ],
      answer: "Both place all four. First fit leaves holes 40, 180, 250, 20, 90; best fit leaves 40, 400, 30, 20, 90 (keeping the 400 KB hole whole).",
      check: "Total free afterwards is the same for both: 1600 − 1020 = 580 KB. Only its shape differs." },
    { type: "figure", id: "worst", for: "fx2", caption: "Worst fit: after 220 KB takes the 500 KB hole, no hole is large enough for 410 KB.", alt: "Worst fit fails for the 410 KB request.", fig: { kind: "strip", items: [{ label: "220 → 500", sub: "280 left", state: "done" }, { label: "410", sub: "largest hole 400: fails", state: "bad" }, { label: "110 → 400", sub: "290 left", state: "done" }, { label: "280 → 300", sub: "20 left", state: "done" }] } },
    { type: "example", id: "fx2", level: "gate", title: "Worst fit fails", given: "Same holes and requests.", find: "What happens under worst fit?",
      steps: [
        { say: "220 → the largest hole, 500 (280 left). Holes: 150, 400, 250, 300, 280." },
        { say: "410 → the largest hole is now 400, which is too small.", result: "410 cannot be placed" },
        { say: "110 → 400 (290 left). 280 → largest is 300 (20 left)." },
        { say: "Free memory now totals 150 + 290 + 250 + 20 + 280.", result: "990 KB free" },
      ],
      answer: "Worst fit cannot place the 410 KB process even though 990 KB is free: external fragmentation.",
      check: "Worst fit broke up the only hole big enough for 410 KB before that request arrived." },
    { type: "example", id: "fx3", level: "edge", title: "Internal fragmentation", given: "Memory is handed out in blocks of 4 KB. A process asks for 13 KB.", find: "How much is wasted inside its allocation?",
      steps: [
        { say: "13 KB needs 4 blocks (16 KB), since 3 blocks are only 12 KB.", result: "16 KB given" },
        { say: "Unused inside the allocation: 16 − 13.", result: "3 KB" },
      ],
      answer: "3 KB of internal fragmentation.",
      check: "On average a process wastes about half a block this way: the reason paging still has some internal fragmentation." },
    { type: "lab", lab: "fit" },
    { type: "faded", title: "Your turn", given: "Holes 100, 300, 200 KB (in that order). A request for 150 KB arrives.",
      steps: [
        { say: "First fit chooses?", blank: true, answer: "300 KB (the first hole ≥ 150)." },
        { say: "Best fit chooses?", blank: true, answer: "200 KB (the smallest hole ≥ 150)." },
        { say: "Worst fit chooses?", blank: true, answer: "300 KB (the largest hole)." },
      ] },
    { type: "trap", wrong: "External fragmentation means memory is full.", tempting: "A request fails, so memory seems full.", whyWrong: "There is enough free memory in total; it is just split into pieces too small for the request.", rule: "External: free but scattered. Internal: wasted inside a block." },
    { type: "trap", wrong: "Best fit always gives the best result.", tempting: "The name says so.", whyWrong: "It leaves many tiny, useless holes and must search the whole list. Simulations often show first fit as good or better, and faster.", rule: "Judge policies on the given request sequence, not on their names." },
    { type: "gate", text: "GATE gives holes and requests and asks which policy places them all, or how much memory is left in which holes. Track the holes after every request, and check total free memory against a failed request." },
    { type: "recall", cards: [{ q: "First fit", a: "First hole large enough" }, { q: "Best fit", a: "Smallest hole large enough" }, { q: "Free memory exists but no single hole fits", a: "External fragmentation" }] },
    { type: "check", questions: [
      { id: "ct1", kind: "MCQ", marks: 2, q: "Holes 150, 400, 250, 300, 500 KB; requests 220, 410, 110, 280 KB in order. Which policy fails to place a request?", options: ["First fit", "Best fit", "Worst fit", "None of them"], answer: "C", solution: "Worst fit puts 220 in the 500 KB hole, leaving no hole of 410 KB." },
      { id: "ct2", kind: "NAT", marks: 1, q: "Memory is allocated in 4 KB blocks. A process needs 13 KB. How many KB are lost to internal fragmentation?", answer: "3", solution: "4 blocks = 16 KB; 16 − 13 = 3." },
      { id: "ct3", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["Compaction removes external fragmentation", "Paging removes external fragmentation", "Fixed partitions cause internal fragmentation", "Best fit never leaves small holes"], answer: "A, B, C", solution: "Best fit tends to leave the smallest holes." },
      { id: "ct4", kind: "NAT", marks: 2, q: "Under worst fit in the lesson's example, how many KB are free in total after placing the requests that fit?", answer: "990", solution: "150 + 290 + 250 + 20 + 280 = 990 KB." },
      { id: "ct5", kind: "MCQ", marks: 1, q: "Holes 100, 300, 200 KB in that order; a request for 150 KB. Best fit chooses", options: ["100", "300", "200", "It fails"], answer: "C", solution: "200 is the smallest hole of at least 150." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "Memory management questions", href: "/topics/operating-systems-os" },
      { label: "Topic 2: paging", sub: "How paging removes external fragmentation", href: "/study/memory" },
      { label: "Heaps and allocation in Programming", sub: "malloc faces the same problem", href: "/topics/programming-in-c" },
    ] },
    { type: "links", prereq: ["Processes and their address spaces"], usedIn: ["Paging (Topic 2)"], cross: ["Programming in C: dynamic memory allocation"] },
  ],
};

const paging: Topic = {
  id: "cs.os.mem.paging",
  title: "Paging and address translation",
  blocks: [
    { type: "hook", text: "Instead of finding one big empty row in the cinema, give every group seats wherever they are free and hand each person a card saying which seat is theirs. Paging does exactly that with memory." },
    { type: "objectives", items: ["Split a logical address into page number and offset.", "Translate it to a physical address with a page table.", "Compute the number of pages, frames, address bits and page-table size."] },
    { type: "intuition", paras: ["Paging cuts the program's logical address space into equal pieces called pages, and physical memory into pieces of the same size called frames. Any page can go into any free frame.", "A page table, one per process, records which frame holds each page. The CPU splits every address into a page number (which entry to look up) and an offset (where inside the page), swaps the page number for the frame number, and keeps the offset.", "Because every frame is the same size, any free frame fits any page: external fragmentation disappears. Only the last page of a process may be partly empty (internal fragmentation, half a page on average)."], analogyLimit: "Seat cards are printed once; a page table can change while the program runs, for example when a page is moved out to disk." },
    { type: "definition", name: "Paging", text: "Logical memory is divided into pages and physical memory into frames of the same size; a page table maps page numbers to frame numbers.", items: ["With page size 2ᵈ, the low d bits of an address are the offset and the remaining high bits are the page number.", "Physical address = frame number × page size + offset.", "Number of pages = logical address space / page size. Number of frames = physical memory / page size.", "Page-table size = number of pages × size of one entry."] },
    { type: "deep", sections: [
      { h: "Why the split is just bits", paras: ["Page sizes are powers of two so that splitting an address needs no division: the offset is the low d bits and the page number is the rest. For page size 1 KB = 2¹⁰, address 2500 = 100111000100 in binary; the low 10 bits (0111000100 = 452) are the offset and the high bits (10 = 2) are the page."] },
      { h: "What a page-table entry holds", points: ["Frame number.", "Valid/invalid bit: is this page part of the process and in memory?", "Protection bits: read, write, execute.", "Dirty bit: has the page been written since it was loaded?", "Reference bit: has it been used recently (helps page replacement)?"], paras: [] },
      { h: "Page tables get big", paras: ["A 32-bit logical address with 4 KB pages has 2³² / 2¹² = 2²⁰ pages. With 4-byte entries the page table is 2²⁰ × 4 = 4 MB per process. That is why multilevel page tables exist (next topic)."] },
      { h: "Sharing and protection", paras: ["Two processes can share code by pointing their page-table entries at the same frames, with the read-only bit set. Each process still has private pages for its data. Protection comes free: a process can only reach frames listed in its own table."] },
    ] },
    { type: "walkthrough", steps: ["Find the page size, and write it as 2ᵈ: the offset has d bits.", "Page number = address ÷ page size (integer part); offset = address mod page size.", "Look up the frame for that page in the page table.", "Physical address = frame × page size + offset.", "For sizes: count pages and frames, and multiply entries by entry size for the table."], prompt: { q: "Does the offset change during translation?", a: "No. Pages and frames are the same size, so the position inside the page stays the same; only the page number is replaced by the frame number." } },
    { type: "figure", id: "split", caption: "Address 2500 with 1 KB pages: page 2, offset 452.", alt: "2500 split into page 2 and offset 452, mapped to frame 5, physical 5572.", fig: { kind: "strip", items: [{ label: "Logical 2500", sub: "1 KB pages", state: "done" }, { label: "Page 2", sub: "2500 ÷ 1024", state: "done" }, { label: "Offset 452", sub: "2500 mod 1024", state: "done" }, { label: "Frame 5", sub: "physical 5572", state: "now" }] } },
    { type: "example", id: "gx1", level: "gate", title: "Translate one address", given: "Page size 1024 bytes. The page table maps page 2 to frame 5. Logical address 2500.", find: "The physical address.",
      steps: [
        { say: "Page number: ⌊2500 / 1024⌋ = 2. Offset: 2500 − 2 × 1024 = 452.", result: "page 2, offset 452" },
        { say: "Frame for page 2 is 5." },
        { say: "Physical = 5 × 1024 + 452.", result: "5572" },
      ],
      answer: "Physical address 5572.",
      check: "5572 − 5 × 1024 = 452: the offset is unchanged, as it must be." },
    { type: "figure", id: "sizes", for: "gx2", caption: "Address bits for a 32-bit address and 4 KB pages.", alt: "20 bits page number, 12 bits offset.", fig: { kind: "matrix", title: "32-bit address, 4 KB pages", cols: ["Bits", "Meaning"], rows: [{ label: "Page number", cells: [20, "2²⁰ pages"], hl: true }, { label: "Offset", cells: [12, "4096 bytes per page"] }] } },
    { type: "example", id: "gx2", level: "gate", title: "How big is the page table?", given: "32-bit logical addresses, 4 KB pages, 4-byte page-table entries. Physical memory is 1 GB.", find: "Pages, frames, bits in a frame number, and page-table size.",
      steps: [
        { say: "Offset bits: 4 KB = 2¹², so 12 bits. Page-number bits: 32 − 12 = 20.", result: "2²⁰ pages" },
        { say: "Frames: 1 GB / 4 KB = 2³⁰ / 2¹² = 2¹⁸ frames, so a frame number needs 18 bits.", result: "2¹⁸ frames" },
        { say: "Page table: 2²⁰ entries × 4 bytes = 2²² bytes.", result: "4 MB" },
      ],
      answer: "2²⁰ pages, 2¹⁸ frames, 18-bit frame numbers, and a 4 MB page table per process.",
      check: "An 18-bit frame number fits in a 4-byte entry with room left for valid, dirty and protection bits." },
    { type: "example", id: "gx3", level: "edge", title: "Internal fragmentation in paging", given: "Page size 4 KB. A process is 18 KB.", find: "How many pages, and how much is wasted?",
      steps: [
        { say: "18 KB needs 5 pages (20 KB), since 4 pages are only 16 KB.", result: "5 pages" },
        { say: "Wasted in the last page: 20 − 18.", result: "2 KB" },
      ],
      answer: "5 pages, with 2 KB of internal fragmentation in the last page.",
      check: "Larger pages mean smaller page tables but more waste in the last page: a trade-off." },
    { type: "lab", lab: "paging" },
    { type: "faded", title: "Your turn", given: "Page size 512 bytes. Logical address 1300. The page table maps page 2 to frame 7.",
      steps: [
        { say: "Page and offset?", blank: true, answer: "⌊1300 / 512⌋ = 2; 1300 − 1024 = 276." },
        { say: "Physical address?", blank: true, answer: "7 × 512 + 276 = 3860." },
      ] },
    { type: "trap", wrong: "Paging has no fragmentation at all.", tempting: "It removes the holes between processes.", whyWrong: "It removes external fragmentation, but the last page of a process is usually not full: internal fragmentation, half a page on average.", rule: "Paging: no external, some internal fragmentation." },
    { type: "trap", wrong: "The number of page-table entries depends on physical memory size.", tempting: "Entries hold frame numbers, which come from physical memory.", whyWrong: "There is one entry per page of the logical address space. Physical memory only decides how many bits a frame number needs.", rule: "Entries = logical space / page size. Frame bits = log₂(physical / page size)." },
    { type: "gate", text: "GATE very often asks bit counts and page-table sizes (2-mark NAT), and sometimes a translation. Write every size as a power of two and subtract exponents." },
    { type: "recall", cards: [{ q: "Physical address", a: "Frame × page size + offset" }, { q: "Offset bits for page size 2ᵈ", a: "d" }, { q: "Page-table size", a: "Number of pages × entry size" }] },
    { type: "check", questions: [
      { id: "pg1", kind: "NAT", marks: 1, q: "Page size 1024 bytes; page 2 is in frame 5. What is the physical address of logical address 2500?", answer: "5572", solution: "Offset 452; 5 × 1024 + 452 = 5572." },
      { id: "pg2", kind: "NAT", marks: 2, q: "32-bit logical addresses, 4 KB pages, 4-byte entries. What is the page-table size in MB?", answer: "4", solution: "2²⁰ entries × 4 bytes = 4 MB." },
      { id: "pg3", kind: "NAT", marks: 2, q: "Physical memory 1 GB and page size 4 KB. How many bits are needed for a frame number?", answer: "18", solution: "2³⁰ / 2¹² = 2¹⁸ frames." },
      { id: "pg4", kind: "MCQ", marks: 1, q: "Paging eliminates", options: ["Internal fragmentation", "External fragmentation", "Both", "Neither"], answer: "B", solution: "Any frame fits any page; only the last page wastes space." },
      { id: "pg5", kind: "NAT", marks: 1, q: "Page size 512 bytes; page 2 is in frame 7. Physical address of logical 1300?", answer: "3860", solution: "Offset 1300 − 1024 = 276; 7 × 512 + 276 = 3860." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "Paging bit-count questions", href: "/topics/operating-systems-os" },
      { label: "Memory hierarchy in Computer Organisation", sub: "Address bits and caches", href: "/topics/computer-organization-and-architecture-coa" },
      { label: "Number systems in Digital Logic", sub: "Powers of two and binary splits", href: "/topics/digital-logic" },
    ] },
    { type: "links", prereq: ["Topic 1: contiguous allocation"], usedIn: ["TLB and multilevel tables (Topic 3)", "Virtual memory"], cross: ["Computer Organisation: address decoding"] },
  ],
};

const tlb: Topic = {
  id: "cs.os.mem.tlb",
  title: "The TLB, effective access time and multilevel page tables",
  blocks: [
    { type: "hook", text: "If every memory access needs a page-table lookup in memory first, every program runs at half speed. A tiny, fast cache of recent translations, the TLB, wins most of that back." },
    { type: "objectives", items: ["Compute the effective memory access time with a TLB.", "Explain why page tables are split into levels and count the levels and bits.", "Know where inverted page tables and segmentation fit in."] },
    { type: "intuition", paras: ["The page table lives in main memory, so a plain paged access costs two memory reads: one for the entry, one for the data. The translation look-aside buffer (TLB) is a small, very fast associative memory that remembers recent page-to-frame translations.", "On a TLB hit the frame is known at once and only the data read is needed. On a miss the page table is read from memory, the TLB is updated, and then the data is read. Because programs reuse the same pages, hit ratios are usually very high.", "Huge page tables are split into levels: an outer table points to smaller inner tables, and only the inner tables actually in use need to exist. Each level adds a memory read on a TLB miss."], analogyLimit: "A phone's recent-calls list is small and fast like the TLB, but the TLB must be searched in parallel in a single cycle, which is why it stays small." },
    { type: "definition", name: "TLB and effective access time", text: "With TLB lookup time t, memory access time m, hit ratio h, and a k-level page table: EAT = h(t + m) + (1 − h)(t + (k + 1)m).", items: ["Without a TLB, a k-level paged access costs (k + 1) memory reads.", "Some questions ignore the TLB lookup time, or overlap it with the memory read; read the wording.", "Multilevel paging: split the page-number bits into fields, one per level; each level's table should fit in one page.", "Inverted page table: one entry per physical frame (not per page), searched by (process, page); small, but lookups need hashing."] },
    { type: "deep", sections: [
      { h: "Hashed page tables", paras: ["For large, sparse address spaces (64-bit), the virtual page number is hashed into a table whose entries are chains of (page, frame) pairs. Lookup hashes the page number and walks the chain. Like the inverted table, its size depends on the pages actually in use, not on the size of the address space."] },
      { h: "Two-level paging in numbers", paras: ["32-bit addresses, 4 KB pages, 4-byte entries: 20 page-number bits. A page holds 4096 / 4 = 1024 = 2¹⁰ entries, so each level can index 10 bits: outer 10 bits, inner 10 bits, offset 12 bits. A process using little memory needs the 4 KB outer table and only a few 4 KB inner tables, instead of 4 MB."] },
      { h: "How many levels?", paras: ["Levels = page-number bits ÷ bits per level, rounded up, where bits per level = log₂(page size / entry size). With 64-bit addresses this gives four or more levels, which is why 64-bit systems rely heavily on the TLB."] },
      { h: "TLB details", points: ["TLB entries may carry an address-space identifier so the TLB need not be flushed on every context switch.", "Without identifiers, a context switch flushes the TLB, and the new process starts with misses.", "TLB reach = entries × page size: how much memory the TLB covers; larger pages increase reach."], paras: [] },
      { h: "Segmentation", paras: ["Segmentation divides a program into variable-size logical parts (code, data, stack). An address is (segment, offset); a segment table holds base and limit for each segment. It matches how programmers think but brings back external fragmentation; many systems page each segment."] },
    ] },
    { type: "walkthrough", steps: ["Write t, m, h and the number of levels k.", "Hit: t + m. Miss: t + (k + 1) × m.", "EAT = h × hit cost + (1 − h) × miss cost.", "For levels: entries per page = page size / entry size; bits per level = log₂ of that; levels = ⌈page-number bits / bits per level⌉."], prompt: { q: "With a 100% hit ratio, what is the EAT?", a: "t + m: one TLB lookup and one memory read. The page table is never touched." } },
    { type: "figure", id: "tlb-flow", caption: "A TLB hit needs one memory read; a miss needs the page table first.", alt: "TLB hit path versus miss path.", fig: { kind: "strip", items: [{ label: "Look in TLB", sub: "t", state: "done" }, { label: "Hit", sub: "read data: m", state: "done" }, { label: "Miss", sub: "read page table: k × m", state: "bad" }, { label: "Then data", sub: "m", state: "now" }] } },
    { type: "example", id: "tx1", level: "gate", title: "Effective access time", given: "TLB lookup 20 ns, memory access 100 ns, single-level page table, hit ratio 80%.", find: "The effective access time, and with a 98% hit ratio.",
      steps: [
        { say: "Hit: 20 + 100 = 120 ns. Miss: 20 + 100 + 100 = 220 ns." },
        { say: "EAT = 0.8 × 120 + 0.2 × 220 = 96 + 44.", result: "140 ns" },
        { say: "At 98%: 0.98 × 120 + 0.02 × 220 = 117.6 + 4.4.", result: "122 ns" },
      ],
      answer: "140 ns at 80%; 122 ns at 98%. Without a TLB every access costs 200 ns.",
      check: "Raising the hit ratio from 80% to 98% cuts the slowdown from 40% to 22% over a bare 100 ns access." },
    { type: "figure", id: "two-level", for: "tx2", caption: "32-bit address split for two-level paging with 4 KB pages and 4-byte entries.", alt: "10 bits outer, 10 bits inner, 12 bits offset.", fig: { kind: "matrix", title: "Two-level split", cols: ["Bits", "Indexes"], rows: [{ label: "Outer", cells: [10, "1024 entries"] }, { label: "Inner", cells: [10, "1024 entries"], hl: true }, { label: "Offset", cells: [12, "4096 bytes"] }] } },
    { type: "example", id: "tx2", level: "gate", title: "Two levels and their cost", given: "32-bit addresses, 4 KB pages, 4-byte entries. TLB 10 ns, memory 100 ns, hit ratio 90%.", find: "The bit split and the EAT with a two-level page table.",
      steps: [
        { say: "Entries per page: 4096 / 4 = 1024 = 2¹⁰, so 10 bits per level. Page-number bits: 32 − 12 = 20.", result: "2 levels: 10 + 10 + 12" },
        { say: "Hit: 10 + 100 = 110 ns. Miss: 10 + 2 × 100 (tables) + 100 (data) = 310 ns." },
        { say: "EAT = 0.9 × 110 + 0.1 × 310 = 99 + 31.", result: "130 ns" },
      ],
      answer: "Split 10 | 10 | 12; EAT 130 ns.",
      check: "Without the TLB, every access would cost 300 ns with two levels." },
    { type: "example", id: "tx3", level: "edge", title: "How many levels for a bigger address?", given: "48-bit virtual addresses, 4 KB pages, 8-byte entries; each table must fit in one page.", find: "How many levels?",
      steps: [
        { say: "Offset 12 bits, so 48 − 12 = 36 page-number bits." },
        { say: "Entries per page: 4096 / 8 = 512 = 2⁹, so 9 bits per level." },
        { say: "Levels: 36 / 9.", result: "4 levels" },
      ],
      answer: "4 levels (9 + 9 + 9 + 9 bits, then a 12-bit offset).",
      check: "This is the layout used by x86-64 processors." },
    { type: "lab", lab: "tlb" },
    { type: "faded", title: "Your turn", given: "TLB 0 ns (ignored), memory 50 ns, single level, hit ratio 90%.",
      steps: [
        { say: "Hit and miss costs?", blank: true, answer: "Hit 50 ns, miss 100 ns." },
        { say: "EAT?", blank: true, answer: "0.9 × 50 + 0.1 × 100 = 55 ns." },
      ] },
    { type: "trap", wrong: "On a TLB miss only one extra memory read is needed.", tempting: "True for a single-level table.", whyWrong: "With k levels, a miss reads k table entries from memory before the data.", rule: "Miss cost = t + (k + 1) × m." },
    { type: "trap", wrong: "Multilevel page tables make translation faster.", tempting: "They are the advanced version.", whyWrong: "They save memory (only used inner tables exist) but each miss needs more memory reads; the TLB is what makes them fast.", rule: "Multilevel: less memory, slower misses." },
    { type: "gate", text: "Expect EAT NATs (check whether the TLB time counts on a miss and how many levels there are) and level-count or bit-split questions. Always write hit cost and miss cost separately first." },
    { type: "recall", cards: [{ q: "EAT", a: "h(t + m) + (1 − h)(t + (k + 1)m)" }, { q: "Bits per level", a: "log₂(page size / entry size)" }, { q: "What multilevel tables save", a: "Memory for page tables" }] },
    { type: "check", questions: [
      { id: "tl1", kind: "NAT", marks: 2, q: "TLB 20 ns, memory 100 ns, single-level table, hit ratio 80%. Effective access time in ns?", answer: "140", solution: "0.8 × 120 + 0.2 × 220 = 140." },
      { id: "tl2", kind: "NAT", marks: 2, q: "TLB 10 ns, memory 100 ns, two-level table, hit ratio 90%. EAT in ns?", answer: "130", solution: "0.9 × 110 + 0.1 × 310 = 130." },
      { id: "tl3", kind: "NAT", marks: 2, q: "48-bit addresses, 4 KB pages, 8-byte entries, each table fits in one page. How many levels?", answer: "4", solution: "36 page bits / 9 bits per level = 4." },
      { id: "tl4", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["A TLB hit avoids reading the page table", "Multilevel paging reduces page-table memory", "An inverted page table has one entry per physical frame", "Segmentation has no external fragmentation"], answer: "A, B, C", solution: "Variable-size segments bring external fragmentation back." },
      { id: "tl5", kind: "NAT", marks: 1, q: "Memory 50 ns, TLB time ignored, single level, hit ratio 90%. EAT in ns?", answer: "55", solution: "0.9 × 50 + 0.1 × 100 = 55." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "EAT and multilevel paging", href: "/topics/operating-systems-os" },
      { label: "Caches in Computer Organisation", sub: "The TLB is a cache with the same maths", href: "/topics/computer-organization-and-architecture-coa" },
      { label: "Topic 2: paging", sub: "Address bits and page tables", href: "/study/memory" },
    ] },
    { type: "links", prereq: ["Topic 2: paging"], usedIn: ["Virtual memory and page faults"], cross: ["Computer Organisation: cache hit ratio and average access time"] },
  ],
};

export const OS_MEMORY: Chapter = {
  id: "cs.os.memory",
  subject: "Operating System",
  title: "Memory management",
  syllabus: ["CS · Operating System: Memory management"],
  pyqTopic: /memory management/i,
  map: { kind: "strip", items: [
    { label: "1. Contiguous allocation", sub: "fits and fragmentation", state: "done" },
    { label: "2. Paging", sub: "address translation", state: "done" },
    { label: "3. TLB and multilevel tables", sub: "effective access time", state: "done" },
  ] },
  topics: [contiguous, paging, tlb, OS_SEGMENT],
};
