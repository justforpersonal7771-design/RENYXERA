import type { Chapter, Topic } from "@/lib/study/schema";

/**
 * Operating System → Virtual memory. Our own numbers; fault counts produced by components/study/vm-labs.tsx (replace)
 * and checked by hand. Lesson string 2 3 2 1 5 2 4 5 3 2 5 2: 3 frames FIFO 9, LRU 7, Optimal 6; 4 frames FIFO 6, LRU 6,
 * Optimal 5. Belady string 1 2 3 4 1 2 5 1 2 3 4 5: FIFO 9 faults with 3 frames, 10 with 4.
 */
const STR = "2 3 2 1 5 2 4 5 3 2 5 2";

const demand: Topic = {
  id: "cs.os.vm.demand",
  title: "Demand paging and page faults",
  blocks: [
    { type: "hook", text: "A 2 GB game starts in seconds on a machine with less free memory than that. It works because the operating system loads only the pages actually used, when they are first needed." },
    { type: "objectives", items: ["Explain demand paging and the valid bit.", "List the steps of handling a page fault.", "Compute effective access time with a page-fault rate."] },
    { type: "intuition", paras: ["Virtual memory lets a process use an address space larger than physical memory. Pages live on disk until they are touched; only those in use sit in frames.", "Each page-table entry has a valid bit. If a process touches a page whose bit says not in memory, the hardware traps: a page fault. The OS finds the page on disk, loads it into a free frame (or frees one), fixes the table and restarts the instruction.", "A page fault costs milliseconds, about ten thousand times a memory access. So even a tiny fault rate dominates the average access time."], analogyLimit: "A library brings a book from storage when someone asks; a page fault must also pause the program and restart the exact instruction that faulted." },
    { type: "definition", name: "Demand paging", text: "Pages are loaded into memory only when they are first referenced. A reference to a page not in memory causes a page fault, handled by the operating system.", items: ["Valid bit 1: page in memory. 0: not in memory (or not part of the process).", "Page-fault service: trap, find the page on disk, get a frame (replace one if none free), read the page, update the table, restart the instruction.", "EAT = (1 − p) × memory access + p × page-fault service time, for fault rate p.", "Pure demand paging starts with no pages loaded: the very first instruction faults."] },
    { type: "deep", sections: [
      { h: "The page-fault steps", points: ["The reference traps to the OS because the valid bit is 0.", "The OS checks the address is legal; if not, the process is ended.", "It finds a free frame, or chooses a victim with a replacement policy (writing it back if dirty).", "It schedules a disk read and lets another process run meanwhile.", "When the read finishes, it updates the page table and sets the valid bit.", "It restarts the faulting instruction as if nothing happened."], paras: [] },
      { h: "Why even rare faults hurt", paras: ["With a 100 ns memory access and an 8 ms fault service, a fault rate of 1 in 1000 gives EAT = 0.999 × 100 + 0.001 × 8,000,000 ≈ 8100 ns: 81 times slower. To stay within 10% of memory speed, fewer than about 1 in 800,000 accesses may fault."] },
      { h: "The dirty bit saves writes", paras: ["If a victim page was never written since loading, its copy on disk is still correct and need not be written back. The dirty (modify) bit records writes, so replacement of clean pages costs one disk read instead of a write and a read."] },
      { h: "Copy-on-write and memory-mapped files", paras: ["After fork, parent and child share pages until one writes (copy-on-write), which demand paging makes cheap. Memory-mapped files use the same machinery: a file's blocks are paged in as the program touches them."] },
    ] },
    { type: "walkthrough", steps: ["Convert every time to the same unit (milliseconds to nanoseconds: × 1,000,000).", "Write the fault rate p as a fraction.", "EAT = (1 − p) × m + p × fault time.", "If asked for the largest p within a slowdown, set EAT ≤ limit and solve for p."], prompt: { q: "Does a page fault mean the program has a bug?", a: "No. In demand paging, faults are the normal way pages arrive. Only a reference to an illegal address is an error." } },
    { type: "figure", id: "pf-steps", caption: "Handling one page fault.", alt: "Trap, find on disk, load into a frame, update the table, restart.", fig: { kind: "strip", items: [{ label: "Reference", sub: "valid bit 0", state: "bad" }, { label: "Trap to OS", sub: "page fault", state: "done" }, { label: "Load page", sub: "disk → free frame", state: "done" }, { label: "Update table", sub: "valid = 1", state: "done" }, { label: "Restart", sub: "instruction", state: "now" }] } },
    { type: "example", id: "dx1", level: "gate", title: "Effective access time with page faults", given: "Memory access 100 ns, page-fault service 8 ms, and one fault per 1000 accesses.", find: "The effective access time.",
      steps: [
        { say: "8 ms = 8,000,000 ns; p = 0.001." },
        { say: "EAT = 0.999 × 100 + 0.001 × 8,000,000 = 99.9 + 8000.", result: "8099.9 ns" },
      ],
      answer: "About 8100 ns: one fault per thousand makes memory about 81 times slower.",
      check: "The fault term (8000 ns) dwarfs the normal access term (99.9 ns)." },
    { type: "figure", id: "pf-eat", for: "dx2", caption: "How the fault rate drives the effective access time (memory 100 ns, fault 8 ms).", alt: "Table of fault rates and access times.", fig: { kind: "matrix", title: "Fault rate vs EAT", cols: ["EAT (ns)"], rows: [{ label: "p = 0", cells: [100] }, { label: "p = 1/800,000", cells: [110], hl: true }, { label: "p = 1/1000", cells: ["≈ 8100"] }] } },
    { type: "example", id: "dx2", level: "gate", title: "How rare must faults be?", given: "Memory 100 ns, fault service 8 ms. We want EAT at most 110 ns (10% slowdown).", find: "The largest page-fault rate.",
      steps: [
        { say: "110 ≥ (1 − p) × 100 + p × 8,000,000 = 100 + p × 7,999,900." },
        { say: "p ≤ 10 / 7,999,900.", result: "about 1 in 800,000" },
      ],
      answer: "At most about one fault in 800,000 accesses.",
      check: "This is why good page replacement, which keeps the fault rate tiny, matters so much." },
    { type: "example", id: "dx3", level: "edge", title: "Dirty victims cost double", given: "Disk read or write of a page takes 8 ms. Half the victim pages are dirty.", find: "The average page-fault service time (ignore other overheads).",
      steps: [
        { say: "Clean victim: one read, 8 ms. Dirty victim: write it back, then read the new page, 16 ms." },
        { say: "Average: 0.5 × 8 + 0.5 × 16.", result: "12 ms" },
      ],
      answer: "12 ms on average.",
      check: "Preferring clean victims (as enhanced clock does) lowers this cost." },
    { type: "lab", lab: "pagefault" },
    { type: "faded", title: "Your turn", given: "Memory 200 ns, page-fault service 10 ms, fault rate 1 in 10,000.",
      steps: [
        { say: "EAT?", blank: true, answer: "0.9999 × 200 + 0.0001 × 10,000,000 = 199.98 + 1000 ≈ 1200 ns." },
      ] },
    { type: "trap", wrong: "Mixing milliseconds and nanoseconds in the EAT formula.", tempting: "The numbers are given in different units.", whyWrong: "8 ms is 8,000,000 ns, not 8. Leaving units mixed gives an answer off by a factor of a million.", rule: "Convert every time to one unit first." },
    { type: "trap", wrong: "A page fault ends the program.", tempting: "It is called a fault.", whyWrong: "A fault on a valid page is normal: the OS loads the page and restarts the instruction. Only an illegal address ends the program.", rule: "Page fault = page not in memory yet, usually harmless." },
    { type: "gate", text: "Expect EAT-with-page-fault NATs (watch units and whether dirty pages double the cost) and statements about what happens on a fault. Write EAT = (1 − p)m + p × service." },
    { type: "recall", cards: [{ q: "EAT with page faults", a: "(1 − p) × m + p × fault service" }, { q: "Valid bit 0 on access", a: "Page fault (trap to OS)" }, { q: "Dirty bit", a: "Victim must be written back" }] },
    { type: "check", questions: [
      { id: "dm1", kind: "NAT", marks: 2, q: "Memory access 100 ns, fault service 8 ms, fault rate 0.001. EAT in ns? (Round to the nearest whole number.)", answer: "8100", solution: "0.999 × 100 + 0.001 × 8,000,000 = 8099.9 ≈ 8100." },
      { id: "dm2", kind: "NAT", marks: 2, q: "Page read or write takes 8 ms; half of the victims are dirty. Average fault service time in ms?", answer: "12", solution: "0.5 × 8 + 0.5 × 16 = 12." },
      { id: "dm3", kind: "MSQ", marks: 2, q: "Which steps are part of handling a page fault?", options: ["Trap to the operating system", "Read the page from disk into a frame", "Restart the faulting instruction", "Terminate the process"], answer: "A, B, C", solution: "The process is only ended if the address is illegal." },
      { id: "dm4", kind: "MCQ", marks: 1, q: "In pure demand paging, when is the first page fault?", options: ["Never", "On the first instruction", "Only when memory is full", "Only on writes"], answer: "B", solution: "No pages are loaded at the start." },
      { id: "dm5", kind: "NAT", marks: 1, q: "Memory 200 ns, fault service 10 ms, fault rate 1 in 10,000. EAT in ns? (Nearest whole number.)", answer: "1200", solution: "199.98 + 1000 ≈ 1200." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "Virtual memory and page faults", href: "/topics/operating-systems-os" },
      { label: "Memory management", sub: "Paging and the TLB first", href: "/study/memory" },
      { label: "Caches in Computer Organisation", sub: "The same average-time formula", href: "/topics/computer-organization-and-architecture-coa" },
    ] },
    { type: "links", prereq: ["Paging and page tables"], usedIn: ["Page replacement (Topic 2)", "Thrashing (Topic 3)"], cross: ["Computer Organisation: average memory access time"] },
  ],
};

const replacement: Topic = {
  id: "cs.os.vm.replacement",
  title: "Page replacement: FIFO, LRU and Optimal",
  blocks: [
    { type: "hook", text: "Memory is full and a new page must come in. Which page goes out? Pick badly and you evict a page you need a moment later, and pay another 8 ms fault." },
    { type: "objectives", items: ["Count page faults for FIFO, LRU and Optimal on a reference string.", "Explain Belady's anomaly and which algorithms suffer from it.", "Describe how LRU is approximated in practice (clock)."] },
    { type: "intuition", paras: ["FIFO evicts the page that has been in memory longest. It is simple but blind: an old page may be used all the time.", "Optimal evicts the page that will not be used for the longest time in the future. It gives the fewest faults possible, but needs the future, so it is only a yardstick.", "LRU (least recently used) evicts the page unused for the longest time in the past, betting that the recent past predicts the near future. It usually comes close to Optimal."], analogyLimit: "A desk with three books keeps the ones you use; real pages are touched millions of times a second, so exact LRU bookkeeping is too costly and hardware approximates it." },
    { type: "definition", name: "Replacement policies", text: "When a page must be loaded and no frame is free, a victim page is chosen and evicted.", items: ["FIFO: evict the oldest loaded page.", "Optimal (OPT/MIN): evict the page whose next use is furthest away (or never used again).", "LRU: evict the page whose last use is oldest.", "Belady's anomaly: more frames giving more faults. FIFO can show it; LRU and Optimal cannot (they are stack algorithms)."] },
    { type: "deep", sections: [
      { h: "Counting policies and the enhanced clock", paras: ["LFU evicts the page with the fewest references; MFU evicts the most-used, on the theory that a page with a small count has just arrived. Both are expensive and neither approximates Optimal well. The enhanced clock looks at (reference bit, dirty bit) pairs and evicts in the order (0,0), (0,1), (1,0), (1,1): unused and clean first, so it avoids both re-faults and write-backs."] },
      { h: "Counting faults reliably", paras: ["Draw a column per reference and a row per frame. Frames start empty, so the first k distinct pages always fault (compulsory faults). After that, a reference to a page already in a frame is a hit; otherwise apply the policy to choose the victim."] },
      { h: "Stack algorithms", paras: ["An algorithm is a stack algorithm if the set of pages in memory with n frames is always a subset of the set with n + 1 frames. Then adding frames can never add a fault. LRU and Optimal have this property; FIFO does not, which is how Belady's anomaly happens."] },
      { h: "Approximating LRU: the clock", paras: ["Each frame has a reference bit set by hardware on use. A pointer sweeps round the frames like a clock hand: a page with bit 1 gets a second chance (bit cleared, move on); the first page with bit 0 is evicted. The enhanced version also prefers clean (not dirty) pages."] },
      { h: "Global versus local replacement", paras: ["Global replacement may take a frame from any process; local replacement only from the faulting process. Global usually gives better throughput but one process's behaviour can hurt others."] },
    ] },
    { type: "walkthrough", steps: ["Write the reference string and the number of frames.", "Fill frames with the first distinct pages, counting each as a fault.", "For each later reference: hit if present; otherwise evict by the policy and count a fault.", "FIFO: oldest loaded. LRU: least recently used so far. Optimal: next use furthest ahead (or never)."], prompt: { q: "Why does Optimal never do worse than LRU?", a: "Optimal chooses with full knowledge of the future, so no other policy can produce fewer faults on the same string and frame count." } },
    { type: "figure", id: "fifo3", caption: `FIFO with 3 frames on ${STR}: 9 faults.`, alt: "FIFO trace with 9 faults.", fig: { kind: "matrix", title: "FIFO, 3 frames", cols: ["2", "3", "2", "1", "5", "2", "4", "5", "3", "2", "5", "2"], rows: [{ label: "Frames", cells: ["2", "23", "23", "231", "531", "521", "524", "524", "324", "324", "354", "352"] }, { label: "Fault?", cells: ["F", "F", "", "F", "F", "F", "F", "", "F", "", "F", "F"], hl: true }] } },
    { type: "example", id: "rpx1", level: "gate", title: "FIFO, LRU and Optimal on one string", given: `Reference string ${STR}, 3 frames, initially empty.`, find: "Page faults for each policy.",
      steps: [
        { say: "FIFO: 2, 3, 1 fault (3). 5 evicts 2; 2 evicts 3; 4 evicts 1; 5 hits; 3 evicts 5; 2 hits; 5 evicts 2; 2 evicts 4.", result: "9 faults" },
        { say: "LRU: 2, 3, 1 (3). 5 evicts 3 (least recent); 2 hits; 4 evicts 1; 5 hits; 3 evicts 2; 2 evicts 4; 5 and 2 hit.", result: "7 faults" },
        { say: "Optimal: 2, 3, 1 (3). 5 evicts 1 (never used again); 2 hits; 4 evicts 2 (next use furthest); 5, 3 hit; 2 evicts 4 (never again); 5, 2 hit.", result: "6 faults" },
      ],
      answer: "FIFO 9, LRU 7, Optimal 6.",
      check: "With 4 frames: FIFO 6, LRU 6, Optimal 5. More frames never hurt LRU or Optimal." },
    { type: "figure", id: "belady", for: "rpx2", caption: "Belady's anomaly under FIFO: 4 frames fault more than 3.", alt: "9 faults with 3 frames, 10 with 4.", fig: { kind: "matrix", title: "String 1 2 3 4 1 2 5 1 2 3 4 5", cols: ["3 frames", "4 frames"], rows: [{ label: "FIFO faults", cells: [9, 10], hl: true }, { label: "LRU faults", cells: [10, 8] }] } },
    { type: "example", id: "rpx2", level: "gate", title: "Belady's anomaly", given: "Reference string 1 2 3 4 1 2 5 1 2 3 4 5 under FIFO.", find: "Faults with 3 frames and with 4 frames.",
      steps: [
        { say: "3 frames: 1, 2, 3, 4, 1, 2, 5 fault (7); 1, 2 hit; 3, 4 fault; 5 hits.", result: "9 faults" },
        { say: "4 frames: 1, 2, 3, 4 fault (4); 1, 2 hit; 5 evicts 1, then 1 evicts 2, 2 evicts 3, 3 evicts 4, 4 evicts 5, 5 evicts 1.", result: "10 faults" },
      ],
      answer: "9 faults with 3 frames but 10 with 4: more memory, more faults.",
      check: "LRU on the same string: 10 faults with 3 frames, 8 with 4, never worse with more frames." },
    { type: "example", id: "rpx3", level: "edge", title: "The clock gives a second chance", given: "3 frames hold pages A (bit 1), B (bit 0), C (bit 1); the hand points at A. Page D must come in.", find: "Which page is evicted?",
      steps: [
        { say: "A has bit 1: clear it, move to B." },
        { say: "B has bit 0: evict B, put D there, move the hand on.", result: "B is evicted" },
      ],
      answer: "B is evicted; A loses its reference bit but stays.",
      check: "If all bits were 1, the hand would clear them all and evict the page it started at: FIFO as a fallback." },
    { type: "lab", lab: "replace" },
    { type: "faded", title: "Your turn", given: "Reference string 1 2 3 1 4 1 2, 3 frames, LRU.",
      steps: [
        { say: "Faults on 1, 2, 3?", blank: true, answer: "3 (compulsory)." },
        { say: "1 then 4?", blank: true, answer: "1 hits. 4 faults and evicts 2 (least recently used)." },
        { say: "1 then 2? Total?", blank: true, answer: "1 hits. 2 faults (evicts 3). Total 5 faults." },
      ] },
    { type: "trap", wrong: "More frames always mean fewer page faults.", tempting: "More memory should help.", whyWrong: "FIFO can fault more with more frames (Belady's anomaly). LRU and Optimal never do.", rule: "Belady's anomaly: FIFO yes; LRU and Optimal no." },
    { type: "trap", wrong: "LRU evicts the page used least often.", tempting: "'Least recently used' sounds like 'least used'.", whyWrong: "LRU looks at when the page was last used, not how many times. Counting uses is LFU, a different policy.", rule: "LRU = oldest last use." },
    { type: "gate", text: "The most common OS NAT: count faults for FIFO, LRU or Optimal on a given string and frame count. Draw the table; do not try to do it in your head. Also MSQs on Belady's anomaly." },
    { type: "recall", cards: [{ q: "Fewest possible faults", a: "Optimal" }, { q: "Can show Belady's anomaly", a: "FIFO" }, { q: "Clock algorithm approximates", a: "LRU" }] },
    { type: "check", questions: [
      { id: "rp1", kind: "NAT", marks: 2, q: `Reference string ${STR}, 3 frames, LRU. How many page faults?`, answer: "7", solution: "Compulsory 3, then 5, 4, 3 and 2 fault; the others hit: 7." },
      { id: "rp2", kind: "NAT", marks: 2, q: `Same string, 3 frames, Optimal. How many faults?`, answer: "6", solution: "Compulsory 3, then 5, 4 and the second 2 fault: 6." },
      { id: "rp3", kind: "NAT", marks: 2, q: "String 1 2 3 4 1 2 5 1 2 3 4 5, FIFO with 4 frames. How many faults?", answer: "10", solution: "Belady's anomaly: one more than with 3 frames (9)." },
      { id: "rp4", kind: "MSQ", marks: 2, q: "Which can suffer from Belady's anomaly?", options: ["FIFO", "LRU", "Optimal", "Second-chance (clock) in its FIFO fallback"], answer: "A, D", solution: "LRU and Optimal are stack algorithms. Clock, which falls back to FIFO order, is not a stack algorithm." },
      { id: "rp5", kind: "NAT", marks: 1, q: "Reference string 1 2 3 1 4 1 2, 3 frames, LRU. Faults?", answer: "5", solution: "1, 2, 3, 4 and the last 2 fault." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "Page replacement counts every year", href: "/topics/operating-systems-os" },
      { label: "Cache replacement in Computer Organisation", sub: "The same policies for cache lines", href: "/topics/computer-organization-and-architecture-coa" },
      { label: "Topic 1: demand paging", sub: "Why faults are so costly", href: "/study/virtual-memory" },
    ] },
    { type: "links", prereq: ["Topic 1: demand paging"], usedIn: ["Thrashing and frame allocation (Topic 3)"], cross: ["Computer Organisation: cache replacement"] },
  ],
};

const thrashing: Topic = {
  id: "cs.os.vm.thrashing",
  title: "Frame allocation, thrashing and the working set",
  blocks: [
    { type: "hook", text: "Add one more program and the machine suddenly crawls: the disk light never stops, the CPU sits idle. The system is spending all its time moving pages, not running programs. That is thrashing." },
    { type: "objectives", items: ["Explain thrashing and why adding processes can make it worse.", "Compute a working set from a reference string and window.", "Describe frame allocation and the page-fault-frequency approach."] },
    { type: "intuition", paras: ["Each process needs a certain number of frames to hold the pages it is actively using. Give it fewer and it faults constantly, each fault evicting a page it needs again soon.", "When many processes are short of frames, the CPU waits on the disk. A naive scheduler sees low CPU use and admits more processes, which takes even more frames: the slide into thrashing.", "The working set is the set of pages a process used in its recent past. If the system keeps each process's working set in memory and suspends processes when the total does not fit, thrashing is avoided."], analogyLimit: "A desk too small for the books you need forces constant trips to the shelf; adding more people to the same desk makes everyone slower." },
    { type: "definition", name: "Working set and thrashing", text: "The working set WS(t, Δ) is the set of distinct pages referenced in the last Δ references. Thrashing is when processes spend more time paging than executing.", items: ["If the sum of working-set sizes exceeds the number of frames, thrashing is likely; suspend a process.", "Equal allocation: frames divided equally. Proportional allocation: frames in proportion to process size.", "Page-fault frequency: give a process more frames if its fault rate is above an upper bound, take frames away if below a lower bound.", "Locality: programs use a small set of pages for a while, then move to another set."] },
    { type: "deep", sections: [
      { h: "Why CPU use drops", paras: ["Utilisation rises with the degree of multiprogramming, until processes start competing for frames. Beyond that point faults pile up, processes wait for the disk, and CPU use falls sharply. The long-term scheduler must not respond by admitting more work."] },
      { h: "Choosing the window Δ", paras: ["Too small a window misses part of the current locality; too large a window spans several localities and over-allocates. The working set approximates the locality the program is in right now."] },
      { h: "Proportional allocation in numbers", paras: ["With 62 free frames and two processes of 10 and 127 pages, proportional allocation gives the first 10/137 × 62 ≈ 4 frames and the second 127/137 × 62 ≈ 57 frames. Each process should also get at least the minimum the instruction set needs."] },
      { h: "Page size and locality", paras: ["Bigger pages mean fewer faults for sequential access and smaller page tables, but more internal fragmentation and more unused data brought in. Programs written to touch memory in order (row by row in a row-major array) fault far less."] },
    ] },
    { type: "walkthrough", steps: ["For a working set at time t with window Δ, take the last Δ references up to and including t.", "List the distinct pages: that set is the working set; its size is the count.", "Add the working-set sizes of all processes and compare with available frames.", "If the total is larger, suspend a process to avoid thrashing."], prompt: { q: "Why does a program that walks a large array column by column fault more?", a: "In a row-major array, consecutive elements of a column are a whole row apart, often on different pages, so each step can touch a new page." } },
    { type: "figure", id: "ws", caption: "Working set with window Δ = 5 at the 10th reference of 1 2 1 3 4 4 3 5 3 4.", alt: "Last five references 4 3 5 3 4 give working set {3, 4, 5}.", fig: { kind: "strip", items: [{ label: "References 6–10", sub: "4 3 5 3 4", state: "done" }, { label: "Distinct pages", sub: "{3, 4, 5}", state: "now" }, { label: "Size", sub: "3", state: "done" }] } },
    { type: "example", id: "tx1v", level: "gate", title: "Computing a working set", given: "References 1 2 1 3 4 4 3 5 3 4. Window Δ = 5.", find: "The working set after the 10th reference, and after the 5th.",
      steps: [
        { say: "After the 10th: the last five are 4, 3, 5, 3, 4.", result: "{3, 4, 5}, size 3" },
        { say: "After the 5th: references 1 to 5 are 1, 2, 1, 3, 4.", result: "{1, 2, 3, 4}, size 4" },
      ],
      answer: "Size 3 after the 10th reference ({3, 4, 5}) and size 4 after the 5th ({1, 2, 3, 4}).",
      check: "The working set shrank as the program settled into a smaller locality." },
    { type: "figure", id: "util", for: "tx2v", caption: "CPU utilisation against the degree of multiprogramming.", alt: "Utilisation rises, peaks, then collapses when thrashing begins.", fig: { kind: "strip", items: [{ label: "Few processes", sub: "CPU often idle", state: "done" }, { label: "More processes", sub: "CPU busy", state: "done" }, { label: "Too many", sub: "thrashing, CPU idle", state: "bad" }] } },
    { type: "example", id: "tx2v", level: "gate", title: "Will it thrash?", given: "60 free frames. Four processes have working-set sizes 18, 12, 20 and 15.", find: "Is thrashing likely, and what should the OS do?",
      steps: [
        { say: "Total demand: 18 + 12 + 20 + 15.", result: "65 frames" },
        { say: "65 > 60, so at least one process cannot keep its working set.", result: "thrashing likely" },
        { say: "Suspend one process (for example the one with 12) to bring demand to 53 ≤ 60." },
      ],
      answer: "Yes, demand (65) exceeds supply (60); suspend a process.",
      check: "Suspending the 20-frame process would also work (demand 45)." },
    { type: "example", id: "tx3v", level: "edge", title: "Proportional allocation", given: "62 free frames. Process A has 10 pages, B has 127 pages.", find: "Frames for each under proportional allocation.",
      steps: [
        { say: "Total size 137. A gets 10/137 × 62 ≈ 4.5, B gets 127/137 × 62 ≈ 57.5." },
        { say: "Rounding down and handing the spare frame to one of them gives roughly 4 and 57 (or 5 and 57).", result: "≈ 4 and 57" },
      ],
      answer: "About 4 frames for A and 57 for B (plus one spare to place).",
      check: "Equal allocation would give 31 each, wasting frames on the small process." },
    { type: "lab", lab: "workingset" },
    { type: "faded", title: "Your turn", given: "References 5 6 5 7 5 8 8 7, window Δ = 4.",
      steps: [
        { say: "Working set after the 8th reference?", blank: true, answer: "Last four: 5, 8, 8, 7: {5, 7, 8}, size 3." },
      ] },
    { type: "trap", wrong: "Low CPU use means the system should admit more processes.", tempting: "Idle CPU looks like spare capacity.", whyWrong: "If the CPU is idle because processes wait on page faults, adding more processes takes more frames and worsens thrashing.", rule: "Low CPU + high paging = reduce multiprogramming." },
    { type: "trap", wrong: "The working set is the set of pages a process will use next.", tempting: "It is used to predict.", whyWrong: "It is defined by the past: the distinct pages in the last Δ references. It works because of locality.", rule: "Working set = recent past, used as a guess for the near future." },
    { type: "gate", text: "GATE asks working-set size for a window, statements about thrashing and the cause of falling CPU use, and occasionally frame allocation. Count distinct pages in the window carefully." },
    { type: "recall", cards: [{ q: "Working set", a: "Distinct pages in the last Δ references" }, { q: "Thrashing cure", a: "Lower the degree of multiprogramming" }, { q: "Page-fault frequency", a: "Adjust frames to keep the fault rate in a band" }] },
    { type: "check", questions: [
      { id: "wt1", kind: "NAT", marks: 2, q: "References 1 2 1 3 4 4 3 5 3 4, window Δ = 5. Working-set size after the 10th reference?", answer: "3", solution: "{3, 4, 5}." },
      { id: "wt2", kind: "NAT", marks: 1, q: "References 5 6 5 7 5 8 8 7, window Δ = 4. Working-set size after the 8th reference?", answer: "3", solution: "{5, 7, 8}." },
      { id: "wt3", kind: "MCQ", marks: 1, q: "The best response to thrashing is to", options: ["Admit more processes", "Reduce the degree of multiprogramming", "Use a smaller page size", "Switch to FIFO replacement"], answer: "B", solution: "Fewer processes leave enough frames for each working set." },
      { id: "wt4", kind: "MSQ", marks: 2, q: "Which are true?", options: ["Thrashing raises paging activity", "Thrashing lowers CPU utilisation", "The working-set model uses the recent past", "Larger page size always reduces faults"], answer: "A, B, C", solution: "Larger pages can bring in unused data and raise waste; it is not always better." },
      { id: "wt5", kind: "NAT", marks: 2, q: "60 free frames; working sets 18, 12, 20 and 15. By how many frames does demand exceed supply?", answer: "5", solution: "65 − 60 = 5." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "Thrashing and working sets", href: "/topics/operating-systems-os" },
      { label: "Topic 2: page replacement", sub: "What happens inside each process", href: "/study/virtual-memory" },
      { label: "CPU scheduling", sub: "The long-term scheduler controls multiprogramming", href: "/study/scheduling" },
    ] },
    { type: "links", prereq: ["Topics 1 and 2"], usedIn: ["System tuning"], cross: ["Computer Organisation: locality of reference"] },
  ],
};

export const OS_VM: Chapter = {
  id: "cs.os.vm",
  subject: "Operating System",
  title: "Virtual memory",
  syllabus: ["CS · Operating System: Virtual memory"],
  pyqTopic: /virtual memory|memory management/i,
  map: { kind: "strip", items: [
    { label: "1. Demand paging", sub: "page faults and EAT", state: "done" },
    { label: "2. Page replacement", sub: "FIFO, LRU, Optimal", state: "done" },
    { label: "3. Thrashing", sub: "working sets and allocation", state: "done" },
  ] },
  topics: [demand, replacement, thrashing],
};
