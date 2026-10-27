/**
 * Sample data for the upcoming-feature screens (Forge, Study materials, Battles).
 * The Forge items are our own pilot items (data/forge/CS/batches/b000-pilot.json), shortened.
 * Nothing here is shown as real progress: every screen carries a "Sample data" banner.
 */

export type ForgeKind = "multi_concept" | "numeric_chain" | "conceptual" | "trap_aware" | "trace";
export const KIND_LABEL: Record<ForgeKind, string> = {
  multi_concept: "Multi-concept",
  numeric_chain: "Numeric chain",
  conceptual: "Concept check",
  trap_aware: "Trap",
  trace: "Code trace",
};

export interface SampleForgeItem {
  id: string; subject: string; topic: string; kind: ForgeKind; difficulty: "E" | "M" | "H";
  type: "MCQ" | "NAT"; marks: 1 | 2; text: string; options?: string[]; answer: string;
  solution: { steps: string[]; shortcut: string; trap: string }; solvedBy: number; accuracy: number;
}

export const FORGE_ITEMS: SampleForgeItem[] = [
  { id: "FORGE_CS_000001", subject: "Computer Organization", topic: "Cache mapping", kind: "multi_concept", difficulty: "H", type: "NAT", marks: 2,
    text: "A byte-addressable machine has 34-bit physical addresses and a 128 KB, 8-way set-associative cache with 32-byte blocks. Each line also stores a valid bit and a dirty bit. The total size of the tag directory, in bits, is ____.",
    answer: "90112", solvedBy: 412, accuracy: 38,
    solution: { steps: ["Lines = 128 KB / 32 B = 4096; sets = 4096 / 8 = 512, so 9 index bits.", "Offset = 5 bits; tag = 34 − 9 − 5 = 20 bits; each line keeps 22 bits.", "Directory = 4096 × 22 = 90112 bits."], shortcut: "Lines × (tag + extra bits).", trap: "Multiplying by the number of sets instead of lines." } },
  { id: "FORGE_CS_000002", subject: "Computer Organization", topic: "Pipelining", kind: "numeric_chain", difficulty: "H", type: "NAT", marks: 2,
    text: "A 5-stage pipeline has stage delays 200, 150, 250, 200 and 150 ps and a 10 ps latch. 1000 instructions run; 20% are branches with a 2-cycle stall each. The execution time in ns is ____.",
    answer: "365.04", solvedBy: 388, accuracy: 44,
    solution: { steps: ["Clock = 250 + 10 = 260 ps.", "Cycles = 5 + 999 + 200 × 2 = 1404.", "1404 × 260 ps = 365.04 ns."], shortcut: "k + n − 1 + stalls.", trap: "Forgetting the latch delay." } },
  { id: "FORGE_CS_000003", subject: "Theory of Computation", topic: "DFA minimisation", kind: "conceptual", difficulty: "M", type: "MCQ", marks: 1,
    text: "Binary strings (MSB first) whose value is divisible by 6. The number of states in the minimal DFA is",
    options: ["3", "4", "5", "6"], answer: "B", solvedBy: 530, accuracy: 51,
    solution: { steps: ["Remainder DFA has 6 states.", "1 ≡ 4 and 2 ≡ 5 (same moves).", "{0}, {1,4}, {2,5}, {3}: 4 states."], shortcut: "Check equivalent remainders when the divisor is even.", trap: "Answering 6." } },
  { id: "FORGE_CS_000004", subject: "Digital Logic", topic: "Two's complement", kind: "trap_aware", difficulty: "M", type: "MCQ", marks: 1,
    text: "8-bit two's complement A = B4h and B = 6Eh are added. Which is correct about the 8-bit result?",
    options: ["34, no overflow", "34, overflow (carry out of MSB)", "−222, overflow", "−34, no overflow"], answer: "A", solvedBy: 601, accuracy: 63,
    solution: { steps: ["A = −76, B = +110.", "Sum = 34, in range.", "Opposite signs never overflow."], shortcut: "Overflow only when both signs match and the result's differs.", trap: "Treating carry-out as overflow." } },
  { id: "FORGE_CS_000005", subject: "Operating Systems", topic: "Virtual memory", kind: "numeric_chain", difficulty: "H", type: "NAT", marks: 2,
    text: "TLB 10 ns, memory 100 ns, hit ratio 0.9, two-level page table, page-fault rate 10⁻⁶ with 8 ms service. The effective access time in ns is ____.",
    answer: "138", solvedBy: 297, accuracy: 35,
    solution: { steps: ["Hit 110 ns; miss 310 ns.", "0.9 × 110 + 0.1 × 310 = 130 ns.", "+ 10⁻⁶ × 8 000 000 = 8 ns → 138 ns."], shortcut: "TLB + levels × memory + memory on a miss.", trap: "8 ms as 8000 ns." } },
  { id: "FORGE_CS_000006", subject: "Programming in C", topic: "Recursion", kind: "trace", difficulty: "M", type: "NAT", marks: 1,
    text: "int f(int n) { if (n <= 1) return 1; return f(n-1) + 2*f(n-2); }  The value of f(8) is ____.",
    answer: "171", solvedBy: 702, accuracy: 72,
    solution: { steps: ["f(0)=f(1)=1, f(2)=3, f(3)=5, f(4)=11.", "f(5)=21, f(6)=43, f(7)=85, f(8)=171."], shortcut: "Tabulate bottom-up.", trap: "Mixing n−1 and n−2." } },
];

export const FORGE_DAILY = { streak: 6, best: 11, doneToday: 3, total: 10, boardRank: 128, boardSize: 2140 };

export const FORGE_MOCKS = [
  { id: "fm1", title: "Forge Mock 1", date: "Sun 8 Nov, 10:00", questions: 65, marks: 100, state: "upcoming" as const, registered: 1840 },
  { id: "fm2", title: "Forge Mock 2", date: "Sun 22 Nov, 10:00", questions: 65, marks: 100, state: "upcoming" as const, registered: 610 },
  { id: "fm0", title: "Forge Mock 0 (pilot)", date: "Sun 25 Oct", questions: 65, marks: 100, state: "done" as const, registered: 2210, score: 58.33, rank: 214 },
];

export interface StudyChapter { id: string; title: string; topics: number; minutes: number; weight: number; done: number; free?: boolean }
export interface StudySubject { id: string; name: string; tint: string; marks: number; chapters: StudyChapter[] }

export const STUDY_SUBJECTS: StudySubject[] = [
  { id: "os", name: "Operating Systems", tint: "peri", marks: 9.2, chapters: [
    { id: "deadlock", title: "Deadlock", topics: 7, minutes: 85, weight: 2.1, done: 3, free: true },
    { id: "sched", title: "CPU scheduling", topics: 6, minutes: 70, weight: 2.4, done: 0 },
    { id: "sync", title: "Process synchronisation", topics: 8, minutes: 110, weight: 2.6, done: 0 },
    { id: "vm", title: "Memory management and virtual memory", topics: 9, minutes: 120, weight: 2.1, done: 0 },
  ] },
  { id: "dbms", name: "Databases", tint: "mint", marks: 7.8, chapters: [
    { id: "er", title: "ER model and relational algebra", topics: 5, minutes: 60, weight: 1.6, done: 0 },
    { id: "norm", title: "Normalisation", topics: 6, minutes: 75, weight: 2.2, done: 0 },
    { id: "txn", title: "Transactions and concurrency", topics: 6, minutes: 80, weight: 2.0, done: 0 },
  ] },
  { id: "toc", name: "Theory of Computation", tint: "lilac", marks: 8.4, chapters: [
    { id: "fa", title: "Finite automata and regular languages", topics: 7, minutes: 95, weight: 3.1, done: 0 },
    { id: "cfl", title: "Context-free languages", topics: 6, minutes: 80, weight: 2.4, done: 0 },
  ] },
];

/** The reference lesson: our own words and numbers (R12-A5 skeleton). */
export const SAMPLE_LESSON = {
  chapter: "Deadlock", subject: "Operating Systems", topic: "Banker's algorithm",
  why: "Asked in 7 of the last 10 GATE CS papers, usually as a 2-mark safe-sequence question.",
  intuition: "A banker lends only if, after lending, there is still some order in which every customer can finish and repay. The OS does the same with resources.",
  definition: "A state is safe if there is an order of all processes such that each one's remaining need can be met by the currently free resources plus what the earlier processes release.",
  table: { head: ["Process", "Allocated", "Max", "Need"], rows: [["P0", "1 0 1", "3 2 2", "2 2 1"], ["P1", "2 1 0", "3 2 1", "1 1 1"], ["P2", "0 1 1", "2 2 2", "2 1 1"]], available: "1 1 1" },
  steps: ["Available (1 1 1) covers P1's need (1 1 1): run P1, available becomes 3 2 1.", "3 2 1 covers P0's need (2 2 1): run P0, available becomes 4 2 2.", "4 2 2 covers P2's need (2 1 1). Safe sequence: P1, P0, P2."],
  trap: "Comparing Max (not Need) with Available.",
  check: { q: "If P1 asks for 1 more unit of the first resource now, should it be granted?", a: "No: its Need would exceed its declared Max." },
  pyqs: ["GATE CS 2024 Q41", "GATE CS 2021 Set 1 Q29", "GATE CS 2018 Q24"],
};

export interface BattlePlayer { name: string; avatar: string; status: "opened" | "started" | "submitted"; answered: number; score?: number; you?: boolean }
export const BATTLE = {
  title: "OS + COA mixed set", questions: 20, maxMarks: 30, expires: "6 days left",
  players: [
    { name: "You", avatar: "A", status: "submitted", answered: 20, score: 21.33, you: true },
    { name: "Aarav", avatar: "Aa", status: "started", answered: 13 },
    { name: "Meera", avatar: "M", status: "opened", answered: 0 },
  ] as BattlePlayer[],
  past: [
    { vs: "Rohan", you: 18.67, them: 15.0, won: true, when: "2 days ago" },
    { vs: "Aarav", you: 12.33, them: 16.0, won: false, when: "Last week" },
  ],
  topics: [{ topic: "Cache mapping", you: 4, them: 2 }, { topic: "Pipelining", you: 2, them: 4 }, { topic: "Scheduling", you: 6, them: 4 }],
};
