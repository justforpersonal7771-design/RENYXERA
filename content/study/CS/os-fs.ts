import * as DB2 from "./os-deep-b";
import type { Chapter, Topic } from "@/lib/study/schema";

/**
 * Operating System → File systems and disk. Numbers produced by components/study/fs-labs.tsx and checked by hand.
 * Inode: 4 KB blocks, 4-byte pointers, 12 direct + single + double + triple = (12 + 1024 + 1024² + 1024³) × 4096 bytes ≈ 4 TB.
 * 1 KB blocks, 4-byte pointers, 10 direct + single + double = (10 + 256 + 65536) × 1024 = 67,381,248 bytes.
 * Disk: head 50 moving up, cylinders 0–199, requests 82 170 43 140 24 16 190:
 * FCFS 642, SSTF 208, SCAN 332, C-SCAN 391 (return counted), LOOK 314, C-LOOK 341.
 */
const REQ = "82, 170, 43, 140, 24, 16, 190";

const alloc: Topic = {
  id: "cs.os.fs.alloc",
  title: "Files, directories and allocation methods",
  blocks: [
    { type: "hook", text: "A file looks like one long stream of bytes, yet on disk it is scattered over blocks wherever space was free. The file system keeps the map. How it keeps that map decides how fast you can jump to the middle of a file, and how big a file can ever be." },
    { type: "objectives", items: ["Compare contiguous, linked and indexed allocation.", "Compute the largest file an inode can address.", "Count disk reads needed to reach a given block."] },
    { type: "intuition", paras: ["Contiguous allocation stores a file in consecutive blocks: fast, with direct access by arithmetic, but files cannot grow easily and free space fragments.", "Linked allocation chains blocks with a pointer in each: no external fragmentation, easy growth, but reaching block 500 means following 500 pointers. FAT moves the chain into a table kept in memory.", "Indexed allocation keeps all of a file's block addresses in an index block. Unix inodes combine a few direct pointers for small files with single, double and triple indirect blocks for large ones."], analogyLimit: "A book's index points straight to the page; an inode's indirect blocks are an index of indexes, each level one more disk read." },
    { type: "definition", name: "Allocation methods", text: "How a file system records which disk blocks belong to a file.", items: ["Contiguous: start block and length. Direct access, external fragmentation.", "Linked: each block points to the next. Sequential only; a lost pointer loses the rest.", "FAT: the chain is stored in a file allocation table, cached in memory.", "Indexed (inode): an index of block addresses. Max file size = (direct + P + P² + P³) × block size, where P = block size ÷ pointer size."] },
    { type: "deep", sections: [
      { h: "Access methods and protection", points: ["Sequential access: read the next record, rewind; suits tapes, logs and most text files.", "Direct (random) access: read block n; needs contiguous or indexed allocation to be fast.", "Indexed sequential: an index points into a sorted file, as in databases.", "Protection: owner, group and others, each with read, write and execute bits (rwx); an access-control list names users one by one; the access matrix is the general model of both."], paras: [] },
      { h: "Counting pointers per block", paras: ["An indirect block is just a data block full of addresses. With 4 KB blocks and 4-byte addresses it holds 4096 / 4 = 1024 addresses. A double indirect block points to 1024 single indirect blocks, each with 1024 addresses: 1024² data blocks."] },
      { h: "Disk reads to reach a block", paras: ["With the inode already in memory: a direct block needs 1 read, a block under the single indirect needs 2 (the indirect block, then the data), double needs 3, triple needs 4. Linked allocation needs as many reads as the block's position in the chain."] },
      { h: "Directories", points: ["Single-level: one directory for everyone; name clashes.", "Two-level: one directory per user.", "Tree: subdirectories and path names, the usual design.", "Acyclic graph: shared files through links. Hard links point to the same inode; symbolic links store a path."], paras: [] },
      { h: "Free-space management", paras: ["A bit vector uses one bit per block: 1 TB of 4 KB blocks needs 2²⁸ bits = 32 MB. A linked free list needs no extra table but is slow to search; grouping and counting are compromises."] },
    ] },
    { type: "walkthrough", steps: ["Find P = block size ÷ pointer size.", "Data blocks reachable = direct + P (single) + P² (double) + P³ (triple), keeping only the levels given.", "Multiply by the block size for bytes.", "For reads to a byte offset: block number = offset ÷ block size; see which range (direct, single, double) it falls in."] , prompt: { q: "Why give inodes direct pointers at all if indirect blocks can address so much more?", a: "Most files are small. Direct pointers reach them with no extra read." } },
    { type: "figure", id: "inode", caption: "One inode: direct pointers, then single, double and triple indirect blocks (4 KB blocks, 4-byte pointers).", alt: "12 direct blocks, then 1024, 1024 squared and 1024 cubed blocks.", fig: { kind: "matrix", title: "Blocks reachable", cols: ["Blocks", "Bytes"], rows: [{ label: "12 direct", cells: ["12", "48 KB"] }, { label: "Single", cells: ["1024", "4 MB"] }, { label: "Double", cells: ["1024²", "4 GB"] }, { label: "Triple", cells: ["1024³", "4 TB"], hl: true }] } },
    { type: "example", id: "fx1", level: "gate", title: "Largest file with an inode", given: "Block 4 KB, block address 4 bytes. Inode: 12 direct, 1 single, 1 double, 1 triple indirect.", find: "The maximum file size.",
      steps: [
        { say: "P = 4096 / 4 = 1024 addresses per block." },
        { say: "Blocks = 12 + 1024 + 1024² + 1024³ = 1,074,791,436." },
        { say: "× 4096 bytes.", result: "4,402,345,721,856 bytes ≈ 4 TB" },
      ],
      answer: "About 4 TB, dominated by the triple indirect block (1024³ × 4 KB = 4 TB).",
      check: "Without the triple level, the limit would be about 4 GB." },
    { type: "figure", id: "methods", for: "fx2", caption: "Allocation methods compared.", alt: "Contiguous, linked and indexed against access and fragmentation.", fig: { kind: "matrix", title: "Allocation", cols: ["Direct access", "External frag.", "Grows easily"], rows: [{ label: "Contiguous", cells: ["yes", "yes", "no"] }, { label: "Linked", cells: ["no", "no", "yes"] }, { label: "Indexed", cells: ["yes", "no", "yes"], hl: true }] } },
    { type: "example", id: "fx2", level: "gate", title: "No triple indirect", given: "Block 1 KB, address 4 bytes, 10 direct pointers, one single and one double indirect.", find: "The maximum file size in bytes.",
      steps: [
        { say: "P = 1024 / 4 = 256." },
        { say: "Blocks = 10 + 256 + 65,536 = 65,802." },
        { say: "× 1024.", result: "67,381,248 bytes ≈ 64.26 MB" },
      ],
      answer: "67,381,248 bytes, a little over 64 MB.",
      check: "The double indirect block alone gives 64 MB; the direct and single add only 266 KB." },
    { type: "example", id: "fx3", level: "edge", title: "Disk reads to reach a byte", given: "4 KB blocks, 4-byte addresses, 12 direct pointers; the inode is in memory. A process reads byte 100,000 of a file.", find: "How many disk reads?",
      steps: [
        { say: "Block number = 100,000 ÷ 4096 = 24 (blocks 0–11 are direct)." },
        { say: "Block 24 is in the single indirect range (12 to 1035): read the indirect block, then the data block.", result: "2 reads" },
      ],
      answer: "2 disk reads.",
      check: "A byte in block 1036 or later would need the double indirect: 3 reads." },
    { type: "lab", lab: "alloc" },
    { type: "faded", title: "Your turn", given: "Block 2 KB, address 4 bytes, 12 direct, one single and one double indirect.",
      steps: [
        { say: "Addresses per block?", blank: true, answer: "2048 / 4 = 512." },
        { say: "Total blocks and size?", blank: true, answer: "12 + 512 + 262,144 = 262,668 blocks × 2 KB = 537,944,064 bytes ≈ 513 MB." },
      ] },
    { type: "trap", wrong: "Counting the indirect blocks themselves as file data.", tempting: "They are blocks belonging to the file.", whyWrong: "Indirect blocks hold addresses, not data. Maximum file size counts only data blocks reachable.", rule: "Size = data blocks reachable × block size." },
    { type: "trap", wrong: "Using bits for the address size when bytes are given (or the reverse).", tempting: "Disk addresses are often quoted as 32-bit.", whyWrong: "A 32-bit address is 4 bytes. P = block size in bytes ÷ address size in bytes.", rule: "Convert both to bytes before dividing." },
    { type: "gate", text: "GATE regularly asks the maximum file size for an inode layout, sometimes in reverse (find the block size). Also MSQs on which allocation suits direct access, and occasionally disk reads to reach a block." },
    { type: "recall", cards: [{ q: "Addresses per block", a: "Block size ÷ address size" }, { q: "Max file size", a: "(direct + P + P² + P³) × block size" }, { q: "Linked allocation weakness", a: "No direct access" }] },
    { type: "check", questions: [
      { id: "fa1", kind: "NAT", marks: 2, q: "Block 1 KB, address 4 bytes, 10 direct, one single and one double indirect. Maximum file size in bytes?", answer: "67381248", solution: "(10 + 256 + 65,536) × 1024 = 67,381,248." },
      { id: "fa2", kind: "NAT", marks: 1, q: "Block 4 KB, address 4 bytes. How many addresses fit in one indirect block?", answer: "1024", solution: "4096 / 4." },
      { id: "fa3", kind: "NAT", marks: 2, q: "4 KB blocks, 4-byte addresses, 12 direct; inode in memory. Disk reads to fetch byte 100,000?", answer: "2", solution: "Block 24 is under the single indirect block: 2 reads." },
      { id: "fa4", kind: "MSQ", marks: 2, q: "Which allocation methods give direct (random) access?", options: ["Contiguous", "Linked", "Indexed", "FAT with the table in memory"], answer: "A, C, D", solution: "Plain linked allocation must follow the chain on disk. FAT follows the chain in memory, which is fast." },
      { id: "fa5", kind: "MCQ", marks: 1, q: "External fragmentation is a problem for", options: ["Contiguous allocation", "Linked allocation", "Indexed allocation", "None of them"], answer: "A", solution: "Only contiguous allocation needs runs of free blocks." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "File systems and inodes", href: "/topics/operating-systems-os" },
      { label: "Topic 2: disk scheduling", sub: "Moving the head efficiently", href: "/study/files" },
      { label: "Data structures", sub: "Trees behind directories", href: "/topics/data-structures" },
    ] },
    { type: "links", prereq: ["Basic powers of two"], usedIn: ["Disk scheduling (Topic 2)"], cross: ["Databases: B+ tree indexes"] },
  ],
};

const disk: Topic = {
  id: "cs.os.fs.disk",
  title: "Disk structure and disk scheduling",
  blocks: [
    { type: "hook", text: "Seven requests wait for a hard disk. Serve them in arrival order and the head swings back and forth 642 cylinders. Serve them nearest-first and it moves 208. Same work, a third of the travel." },
    { type: "objectives", items: ["Compute disk access time from seek, rotation and transfer.", "Trace FCFS, SSTF, SCAN, C-SCAN, LOOK and C-LOOK and total the head movement.", "Name the trade-off each algorithm makes."] },
    { type: "intuition", paras: ["A hard disk's arm moves the head across cylinders (seek), then waits for the sector to spin under it (rotational latency), then reads (transfer). Seek usually dominates, so schedulers try to shorten head travel.", "FCFS is fair but wanders. SSTF picks the nearest request: short travel, but far requests can starve. SCAN sweeps like a lift to the end of the disk and back; C-SCAN only serves on the way up and jumps back, for more even waiting.", "LOOK and C-LOOK are SCAN and C-SCAN that turn at the last request instead of going to the disk's edge."], analogyLimit: "A lift serves floors in sweeps; a disk does the same, but SSD drives have no head at all, so these algorithms matter only for spinning disks." },
    { type: "definition", name: "Disk scheduling", text: "Choosing the order in which pending disk requests are served to reduce total head movement (seek).", items: ["Access time = seek + rotational latency + transfer.", "Average rotational latency = half a rotation: at 7200 rpm, 60/7200/2 s ≈ 4.17 ms.", "SCAN goes to the disk end; LOOK turns at the last request.", "C-SCAN and C-LOOK serve in one direction only, then return to the other end."] },
    { type: "deep", sections: [
      { h: "The I/O side: polling, interrupts, DMA, buffering, spooling", points: ["Polling: the CPU repeatedly checks a device's status register; wasteful when the device is slow.", "Interrupts: the device signals the CPU when ready; the CPU runs a handler.", "DMA: a controller copies a whole block between device and memory and interrupts once at the end, freeing the CPU.", "Buffering: hold data in memory to smooth speed differences (double buffering lets one buffer fill while the other drains).", "Spooling: queue jobs for a device that cannot interleave them, such as a printer.", "Caching keeps copies of disk blocks in memory; a buffer holds the only copy in transit."], paras: [] },
      { h: "Tracing reliably", paras: ["Sort the requests. Note the head and its direction. For SCAN and LOOK, take the requests in the current direction in order, then reverse. For C-SCAN and C-LOOK, after the last request in the direction, jump to the far end and continue in the same direction. Add the absolute differences along the path."] },
      { h: "Does the return sweep count?", paras: ["Questions differ on whether C-SCAN's jump from the end back to cylinder 0 counts as head movement. Our lab counts it (it is real arm travel). Read each question: if it says the return is not counted, subtract it."] },
      { h: "Starvation and fairness", paras: ["SSTF can leave a far request waiting forever if near requests keep arriving. SCAN bounds every wait to about two sweeps, and C-SCAN makes waits more even because requests at the edges are not served twice as rarely as those in the middle."] },
      { h: "RAID in brief", points: ["RAID 0: striping, speed, no redundancy.", "RAID 1: mirroring, half the capacity usable.", "RAID 5: striping with distributed parity; survives one disk failure.", "RAID 6: two parity blocks; survives two failures."], paras: [] },
    ] },
    { type: "walkthrough", steps: ["Write the head position, direction and the disk's last cylinder.", "Sort the requests and split them into those above and below the head.", "Build the path by the algorithm's rule.", "Total = sum of |next − current| along the path."], prompt: { q: "Why is SSTF not optimal even though it always picks the nearest request?", a: "Being greedy can strand the head on one side so it must travel far later. It is short on average, not always minimal." } },
    { type: "figure", id: "disk-paths", caption: `Head at 50, moving up, requests ${REQ}: total movement by algorithm.`, alt: "Totals: FCFS 642, SSTF 208, SCAN 332, C-SCAN 391, LOOK 314, C-LOOK 341.", fig: { kind: "matrix", title: "Total head movement (cylinders)", cols: ["Total"], rows: [{ label: "FCFS", cells: [642] }, { label: "SSTF", cells: [208], hl: true }, { label: "SCAN", cells: [332] }, { label: "C-SCAN", cells: [391] }, { label: "LOOK", cells: [314] }, { label: "C-LOOK", cells: [341] }] } },
    { type: "example", id: "dsx1", level: "gate", title: "FCFS and SSTF", given: `Cylinders 0–199, head at 50, requests in order ${REQ}.`, find: "Total head movement under FCFS and SSTF.",
      steps: [
        { say: "FCFS: 50→82→170→43→140→24→16→190 = 32 + 88 + 127 + 97 + 116 + 8 + 174.", result: "642" },
        { say: "SSTF: nearest to 50 is 43, then 24, 16, then 82, 140, 170, 190. Moves: 7 + 19 + 8 + 66 + 58 + 30 + 20.", result: "208" },
      ],
      answer: "FCFS 642 cylinders; SSTF 208.",
      check: "SSTF went down first only because 43 (7 away) was nearer than 82 (32 away)." },
    { type: "figure", id: "scan-look", for: "dsx2", caption: "SCAN goes to the edge (199) before turning; LOOK turns at the last request (190).", alt: "SCAN path 50 to 199 then down to 16; LOOK path 50 to 190 then down to 16.", fig: { kind: "strip", items: [{ label: "SCAN", sub: "50 → 190 → 199 → 16: 332", state: "done" }, { label: "LOOK", sub: "50 → 190 → 16: 314", state: "now" }, { label: "Saved", sub: "18 cylinders", state: "done" }] } },
    { type: "example", id: "dsx2", level: "gate", title: "SCAN, LOOK and their circular versions", given: `Same disk, head at 50 moving towards higher cylinders.`, find: "Total movement for SCAN, LOOK, C-SCAN and C-LOOK.",
      steps: [
        { say: "SCAN: 50→82→140→170→190→199, then 43→24→16. (199 − 50) + (199 − 16) = 149 + 183.", result: "332" },
        { say: "LOOK: turn at 190. (190 − 50) + (190 − 16) = 140 + 174.", result: "314" },
        { say: "C-SCAN: up to 199, jump to 0, then 16→24→43. 149 + 199 + 43.", result: "391 (348 if the return is not counted)" },
        { say: "C-LOOK: up to 190, jump to 16, then 24→43. 140 + 174 + 27.", result: "341" },
      ],
      answer: "SCAN 332, LOOK 314, C-SCAN 391 (with return), C-LOOK 341.",
      check: "LOOK ≤ SCAN always: it never travels past the last request." },
    { type: "example", id: "dsx3", level: "edge", title: "Access time for one block", given: "Average seek 5 ms, 7200 rpm, transfer of one 4 KB block 0.05 ms.", find: "Average time to read one block.",
      steps: [
        { say: "One rotation = 60 / 7200 s = 8.33 ms; average latency is half: 4.17 ms." },
        { say: "Total = 5 + 4.17 + 0.05.", result: "≈ 9.22 ms" },
      ],
      answer: "About 9.2 ms, almost all seek and rotation.",
      check: "This is why the page-fault service time is milliseconds." },
    { type: "lab", lab: "disk" },
    { type: "faded", title: "Your turn", given: "Cylinders 0–99, head at 40 moving up, requests 10, 60, 30, 80.",
      steps: [
        { say: "LOOK path and total?", blank: true, answer: "40→60→80→30→10: 20 + 20 + 50 + 20 = 110." },
        { say: "SCAN total?", blank: true, answer: "40→60→80→99→30→10: 59 + 89 = 148." },
      ] },
    { type: "trap", wrong: "SCAN turns at the last request.", tempting: "Going further seems pointless.", whyWrong: "That is LOOK. SCAN, by definition, goes all the way to the end of the disk before turning.", rule: "SCAN/C-SCAN: to the edge. LOOK/C-LOOK: to the last request." },
    { type: "trap", wrong: "SSTF never starves a request.", tempting: "It serves everything eventually in the example.", whyWrong: "With a steady stream of near requests, a far one may wait indefinitely.", rule: "SSTF: short travel, possible starvation." },
    { type: "gate", text: "A near-certain NAT every few years: total head movement for a named algorithm. Watch the head's direction, the disk's last cylinder, and whether the C-SCAN return counts." },
    { type: "recall", cards: [{ q: "Lift-like sweep to the edge", a: "SCAN" }, { q: "Can starve far requests", a: "SSTF" }, { q: "Average rotational latency", a: "Half a rotation" }] },
    { type: "check", questions: [
      { id: "ds1", kind: "NAT", marks: 2, q: `Cylinders 0–199, head at 50, requests ${REQ}. Total head movement under SSTF?`, answer: "208", solution: "50→43→24→16→82→140→170→190." },
      { id: "ds2", kind: "NAT", marks: 2, q: "Same requests, head at 50 moving up. Total movement under LOOK?", answer: "314", solution: "140 up to 190, then 174 down to 16." },
      { id: "ds3", kind: "NAT", marks: 1, q: "Same requests, FCFS. Total movement?", answer: "642", solution: "32 + 88 + 127 + 97 + 116 + 8 + 174." },
      { id: "ds4", kind: "MSQ", marks: 2, q: "Which are true?", options: ["SSTF can cause starvation", "LOOK never moves more than SCAN on the same input", "C-SCAN serves requests in both directions", "SCAN goes to the end of the disk before turning"], answer: "A, B, D", solution: "C-SCAN serves in one direction only." },
      { id: "ds5", kind: "NAT", marks: 2, q: "Average seek 5 ms, 7200 rpm, transfer 0.05 ms. Average access time in ms? (Two decimals.)", answer: "9.22", solution: "5 + 4.17 + 0.05 ≈ 9.22." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "Disk scheduling", href: "/topics/operating-systems-os" },
      { label: "Virtual memory", sub: "Why page faults cost milliseconds", href: "/study/virtual-memory" },
      { label: "Computer Organisation: I/O", sub: "Disks, DMA and interrupts", href: "/topics/computer-organization-and-architecture-coa" },
    ] },
    { type: "links", prereq: ["Topic 1: allocation"], usedIn: ["Page-fault service time"], cross: ["Computer Organisation: secondary storage"] },
  ],
};

export const OS_FS: Chapter = {
  id: "cs.os.fs",
  subject: "Operating System",
  title: "File systems and disk",
  syllabus: ["CS · Operating System: File systems", "CS · Operating System: Disk scheduling"],
  pyqTopic: /file system|disk/i,
  map: { kind: "strip", items: [
    { label: "1. Allocation", sub: "inodes and file size", state: "done" },
    { label: "2. Disk scheduling", sub: "FCFS to C-LOOK", state: "done" },
  ] },
  topics: [alloc, disk, DB2.dirs, DB2.freeSpaceTopic, DB2.diskTimeTopic, DB2.raidTopic, DB2.ioTopic],
};
