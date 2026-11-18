import type { Chapter, Topic } from "@/lib/study/schema";
import { syscalls, threads } from "./os-processes-more";
import { deepen } from "./os-depth";

/**
 * Operating System → Processes and threads (docs/study-materials/BLUEPRINT-FINAL.md). Our own words and examples.
 * fork() counts checked by simulation (components/study/process-labs.tsx simulateFork): three forks → 8 processes, 8 prints;
 * for-loop of 3 with fork + print → 8 processes, 14 prints; if (fork()==0) fork() → 3; fork() && fork() → 3; fork() || fork() → 3.
 */

const states: Topic = {
  id: "cs.os.processes.states",
  title: "A program in motion: process states, the PCB and the context switch",
  blocks: [
    { type: "hook", text: "A program on disk is a recipe. A process is the recipe being cooked: it has a stove, half-chopped vegetables and a place it has reached in the steps. The operating system juggles dozens of these at once on one or a few CPUs." },
    { type: "objectives", items: ["Name the five process states and the event behind each move.", "List what a process control block (PCB) stores.", "Explain what a context switch saves and why it costs time."] },
    { type: "intuition", paras: ["A process is a running program plus everything needed to pause it and resume it later: its registers, its program counter, its open files and its memory.", "At any moment a process is New (being set up), Ready (could run, waiting for the CPU), Running (on the CPU), Waiting (needs an event such as a disk read) or Terminated (finished).", "Moving a process off the CPU and another one on is a context switch. The OS saves the old process's registers into its PCB and loads the new one's. No useful user work happens during the switch, so it is pure overhead."], analogyLimit: "A cook can pause mid-step and walk away; a CPU switch must save every register exactly, or the process resumes with wrong values." },
    { type: "definition", name: "Process and process control block", text: "A process is a program in execution. The kernel tracks each process in a process control block (PCB) that holds everything needed to stop and resume it.", items: ["PCB contents: process id, state, program counter, CPU registers, scheduling information (priority, queues), memory-management information (page table), open files and I/O status, accounting.", "Five-state model: New → Ready → Running → Waiting → Ready …, and Running → Terminated.", "Running → Ready happens on pre-emption (time slice over); Running → Waiting happens when the process asks for I/O or an event.", "Waiting → Ready (never straight to Running) when the event completes."] },
    { type: "walkthrough", steps: ["Find the event in the question: admitted, dispatched, time slice over, I/O request, I/O done, exit.", "Map it to a move: admit New → Ready, dispatch Ready → Running, timeout Running → Ready, I/O Running → Waiting, I/O done Waiting → Ready, exit Running → Terminated.", "Reject any move not on that list (Waiting → Running, Ready → Waiting, New → Running).", "Count context switches by counting how many times a different process is dispatched onto the CPU."], prompt: { q: "Why can't a Ready process move to Waiting?", a: "To ask for I/O a process must execute an instruction, and only a Running process executes instructions." } },
    { type: "figure", id: "ps-strip", caption: "The life of one process in the five-state model.", alt: "New to Ready to Running, then Waiting, back to Ready, then Running and Terminated.",
      fig: { kind: "strip", items: [{ label: "New", sub: "PCB created", state: "done" }, { label: "Ready", sub: "in ready queue", state: "done" }, { label: "Running", sub: "on the CPU", state: "now" }, { label: "Waiting", sub: "for I/O", state: "todo" }, { label: "Terminated", sub: "exit", state: "todo" }] } },
    { type: "example", id: "psex1", level: "gate", title: "Which transitions are possible?", given: "Consider the moves: (a) Running → Ready, (b) Waiting → Running, (c) Ready → Waiting, (d) Waiting → Ready.", find: "Which moves are valid in the five-state model?",
      steps: [
        { say: "(a) happens when a time slice ends or a higher-priority process arrives.", result: "valid" },
        { say: "(b) skips the ready queue. A finished I/O makes the process Ready; the scheduler must still pick it.", result: "not valid" },
        { say: "(c) needs the process to request I/O, which only a running process can do.", result: "not valid" },
        { say: "(d) happens when the I/O or event completes.", result: "valid" },
      ],
      answer: "(a) and (d) are valid; (b) and (c) are not.",
      check: "Every arrow into Running comes from Ready, and every arrow into Waiting comes from Running." },
    { type: "figure", id: "ps-pcb", for: "psex1", caption: "What the PCB keeps so the process can be paused and resumed.", alt: "Table of PCB fields.",
      fig: { kind: "matrix", title: "Process control block", cols: ["Field", "Why it is kept"], rows: [
        { label: "1", cells: ["Process id, state", "To find it and know where it is"] },
        { label: "2", cells: ["Program counter, registers", "To resume at the exact instruction"], hl: true },
        { label: "3", cells: ["Scheduling info", "Priority and queue pointers"] },
        { label: "4", cells: ["Memory info", "Page table or base and limit"] },
        { label: "5", cells: ["Open files, I/O status", "What it is using"] },
      ] } },
    { type: "example", id: "psex2", level: "edge", title: "Counting context switches", given: "One CPU. P1 runs, then asks for a disk read. P2 runs until its time slice ends. P1's read has finished, so P1 runs again and exits. Then P2 runs to the end.", find: "How many context switches happen after P1 first starts?",
      steps: [
        { say: "P1 → P2 when P1 asks for I/O.", result: "1" },
        { say: "P2 → P1 when P2's slice ends (P1 is Ready again).", result: "2" },
        { say: "P1 → P2 when P1 exits.", result: "3" },
      ],
      answer: "3 context switches.",
      check: "Count the changes of which process holds the CPU: P1, P2, P1, P2 has three changes." },
    { type: "lab", lab: "states" },
    { type: "faded", title: "Your turn", given: "A process is Running and its time slice ends while it still has work to do.",
      steps: [
        { say: "Which state does it go to?", blank: true, answer: "Ready. It can still run, it just lost the CPU." },
        { say: "What does the OS save, and where?", blank: true, answer: "Its program counter and registers, in its PCB." },
      ] },
    { type: "trap", wrong: "When I/O finishes, the process goes straight back to Running.", tempting: "It was running before it asked for I/O.", whyWrong: "Another process holds the CPU now. The finished process joins the ready queue and waits for the scheduler.", rule: "Waiting → Ready, never Waiting → Running." },
    { type: "trap", wrong: "A context switch does useful work for the processes.", tempting: "It is part of running several programs.", whyWrong: "During the switch the CPU only saves and loads state; no user instruction runs. Too many switches waste CPU time.", rule: "Context switching is pure overhead." },
    { type: "gate", text: "GATE asks which transitions are possible, what the PCB contains, and how many context switches occur in a schedule. Draw the five states and their six arrows once; every such question becomes a lookup." },
    { type: "recall", cards: [{ q: "Running → Ready happens when", a: "The time slice ends or it is pre-empted" }, { q: "Waiting → ? when I/O completes", a: "Ready" }, { q: "Where are registers saved in a switch", a: "In the process control block (PCB)" }] },
    { type: "check", questions: [
      { id: "ps1", kind: "MSQ", marks: 2, q: "Which state transitions are possible in the five-state model?", options: ["Ready → Running", "Waiting → Running", "Running → Waiting", "Ready → Terminated"], answer: "A, C", solution: "Ready → Running is a dispatch and Running → Waiting is an I/O request. Waiting must go through Ready, and only a running process can exit." },
      { id: "ps2", kind: "MCQ", marks: 1, q: "Which of these is NOT normally stored in a PCB?", options: ["Program counter", "Page table pointer", "The source code of the program", "List of open files"], answer: "C", solution: "The PCB holds state to pause and resume; the program's code lives in memory, not in the PCB." },
      { id: "ps3", kind: "NAT", marks: 2, q: "On one CPU the processes hold the CPU in this order: P1, P2, P1, P3, P2, P3. How many context switches occur?", answer: "5", solution: "Each change of the running process is one switch: P1→P2, P2→P1, P1→P3, P3→P2, P2→P3 = 5." },
      { id: "ps4", kind: "MCQ", marks: 1, q: "A running process requests a disk read. Its new state is", options: ["Ready", "Waiting", "New", "Terminated"], answer: "B", solution: "It cannot continue until the read completes, so it waits." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "Process states and system calls", href: "/topics/operating-systems-os" },
      { label: "Interrupts in Computer Organisation", sub: "The hardware side of a context switch", href: "/topics/computer-organization-and-architecture-coa" },
      { label: "Deadlock", sub: "What goes wrong when processes wait on each other", href: "/study/deadlock" },
    ] },
    { type: "links", prereq: ["What a program and memory are"], usedIn: ["CPU scheduling", "Synchronisation", "Deadlock"], cross: ["Computer Organisation: interrupts and saving registers"] },
  ],
};

const forks: Topic = {
  id: "cs.os.processes.fork",
  title: "fork(): one call, two processes, and counting them",
  blocks: [
    { type: "hook", text: "fork() is called once but returns twice: once in the parent and once in a brand-new child. GATE loves to hide a few forks in a loop and ask how many processes exist or how many lines are printed." },
    { type: "objectives", items: ["Explain what fork() returns in the parent and in the child.", "Count processes and printed lines for forks in sequence and in loops.", "Handle fork() inside if, && and ||."] },
    { type: "intuition", paras: ["fork() copies the calling process. After the call, two processes run the same code from the same point. The only difference is the return value: the child gets 0, the parent gets the child's id.", "Every process that reaches a fork() makes one more process. So after one fork there are 2 processes, after two forks 4, after n forks in a row 2ⁿ.", "Conditions change who reaches the next fork. With fork() && fork(), the child got 0, so the && stops and the child never runs the second fork. With fork() || fork(), the parent got a non-zero value and stops instead."], analogyLimit: "A photocopier makes an identical sheet; the child also gets a copy of memory, but changes made afterwards are private to each process." },
    { type: "definition", name: "fork()", text: "A system call that creates a new process (the child) as a copy of the calling process (the parent). It returns 0 in the child, the child's process id in the parent, and −1 if it fails.", items: ["n forks in sequence (each reached by every process): 2ⁿ processes, 2ⁿ − 1 created.", "A print after the forks runs once in every process.", "for (i = 0; i < n; i++) { fork(); print; }: prints = 2 + 4 + … + 2ⁿ = 2ⁿ⁺¹ − 2.", "if (fork() == 0) X: only the child runs X. fork() && fork(): 3 processes. fork() || fork(): 3 processes."] },
    { type: "walkthrough", steps: ["Start with one process.", "At each fork, double the number of processes that reach that line.", "For a condition, ask which side (parent: non-zero, child: 0) continues to the next fork.", "Count prints by counting how many processes execute each print line, then add."], prompt: { q: "Why does a print inside the loop body print more than a print after the loop?", a: "The print runs at every iteration, in every process alive at that iteration: 2 in the first, 4 in the second, and so on." } },
    { type: "figure", id: "fk-tree", caption: "Three forks in a row: each process splits at every fork, giving 8.", alt: "Process count doubling 1, 2, 4, 8.",
      fig: { kind: "strip", items: [{ label: "Start", sub: "1 process", state: "done" }, { label: "After fork 1", sub: "2", state: "done" }, { label: "After fork 2", sub: "4", state: "done" }, { label: "After fork 3", sub: "8", state: "now" }] } },
    { type: "example", id: "fkex1", level: "gate", title: "Prints inside a loop", given: "for (i = 0; i < 3; i++) { fork(); printf(\"x\"); }", find: "How many x's are printed, and how many processes exist at the end?",
      steps: [
        { say: "Iteration 1: one process forks into 2; both print.", result: "2 prints" },
        { say: "Iteration 2: 2 processes fork into 4; all print.", result: "4 prints" },
        { say: "Iteration 3: 4 fork into 8; all print.", result: "8 prints" },
        { say: "Total prints 2 + 4 + 8.", result: "14" },
      ],
      answer: "14 x's, and 8 processes at the end.",
      check: "Formula: 2ⁿ⁺¹ − 2 with n = 3 gives 16 − 2 = 14." },
    { type: "figure", id: "fk-loop", for: "fkex1", caption: "Prints per iteration for the loop.", alt: "Iteration 1: 2, iteration 2: 4, iteration 3: 8; total 14.",
      fig: { kind: "matrix", title: "for (i = 0; i < 3; i++) { fork(); print; }", cols: ["Processes after fork", "Prints"], rows: [{ label: "i = 0", cells: [2, 2] }, { label: "i = 1", cells: [4, 4] }, { label: "i = 2", cells: [8, 8] }, { label: "Total", cells: ["8", "14"], hl: true }] } },
    { type: "example", id: "fkex2", level: "edge", title: "Short-circuit forks", given: "Program A: fork() && fork(); printf(\"x\"); Program B: fork() || fork(); printf(\"x\");", find: "How many processes does each create in total?",
      steps: [
        { say: "A: the first fork makes a child. In the child fork() returned 0, so && stops; the child skips the second fork." },
        { say: "A: in the parent the first fork returned non-zero, so it runs the second fork and makes one more child.", result: "3 processes" },
        { say: "B: in the parent the first fork returned non-zero, so || stops." },
        { say: "B: in the child the first fork returned 0, so it runs the second fork and makes a grandchild.", result: "3 processes" },
      ],
      answer: "Both create 3 processes, so each prints x three times. In A both new processes are children of the original; in B the third is a grandchild.",
      check: "Run both in the lab and compare the trees." },
    { type: "lab", lab: "fork" },
    { type: "faded", title: "Your turn", given: "if (fork() == 0) fork(); printf(\"x\");",
      steps: [
        { say: "Who runs the inner fork?", blank: true, answer: "Only the child of the first fork (its fork() returned 0)." },
        { say: "How many processes print?", blank: true, answer: "3: the parent, the child, and the child's child." },
      ] },
    { type: "trap", wrong: "fork() returns the child's id to the child.", tempting: "It is the child's own id, so it seems natural.", whyWrong: "The child receives 0. The parent receives the child's id, so it can wait for or signal that child.", rule: "Child gets 0; parent gets the child's pid; −1 means failure." },
    { type: "trap", wrong: "n forks create 2ⁿ new processes.", tempting: "2ⁿ appears in the count.", whyWrong: "2ⁿ is the total, including the original. New ones are 2ⁿ − 1.", rule: "Total 2ⁿ, created 2ⁿ − 1." },
    { type: "trap", wrong: "A print inside a loop of n forks prints 2ⁿ times.", tempting: "That is the final number of processes.", whyWrong: "The print runs at every iteration in all processes alive then: 2 + 4 + … + 2ⁿ.", rule: "Print inside the loop: 2ⁿ⁺¹ − 2." },
    { type: "gate", text: "Expect a 1-mark or 2-mark NAT: count processes or prints for forks in a loop, or with if, && or ||. Draw the doubling, mark who continues at each condition, and add prints per line." },
    { type: "recall", cards: [{ q: "fork() returns in the child", a: "0" }, { q: "n forks in a row: total processes", a: "2ⁿ (2ⁿ − 1 created)" }, { q: "fork() && fork(): processes", a: "3" }] },
    { type: "check", questions: [
      { id: "fk1", kind: "NAT", marks: 1, q: "fork(); fork(); fork(); fork(); printf(\"x\"); How many x's are printed?", answer: "16", solution: "Four forks give 2⁴ = 16 processes, and each prints once." },
      { id: "fk2", kind: "NAT", marks: 2, q: "for (i = 0; i < 4; i++) { fork(); printf(\"x\"); } How many x's are printed?", answer: "30", solution: "2 + 4 + 8 + 16 = 30, which is 2⁵ − 2." },
      { id: "fk3", kind: "MCQ", marks: 1, q: "In the child process, fork() returns", options: ["The parent's process id", "The child's process id", "0", "−1"], answer: "C", solution: "The child gets 0; the parent gets the child's id; −1 means fork failed." },
      { id: "fk4", kind: "MCQ", marks: 2, q: "How many processes exist after fork() || fork(); runs (counting the original)?", options: ["2", "3", "4", "1"], answer: "B", solution: "The parent stops at || after a non-zero return; the child (0) runs the second fork. Original + child + grandchild = 3." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "fork() counting appears often", href: "/topics/operating-systems-os" },
      { label: "Recursion and trees", sub: "Programming: the process tree is a binary tree", href: "/topics/data-structures" },
      { label: "Geometric series", sub: "Aptitude: 2 + 4 + … + 2ⁿ", href: "/topics/quantitative-aptitude" },
    ] },
    { type: "links", prereq: ["Process states (Topic 1)"], usedIn: ["exec() and process creation", "Threads (next topic)"], cross: ["Data Structures: binary trees", "Quantitative aptitude: geometric series"] },
  ],
};

export const OS_PROCESSES: Chapter = {
  id: "cs.os.processes",
  subject: "Operating System",
  title: "Processes and threads",
  syllabus: ["CS · Operating System: Processes, threads, system calls"],
  pyqTopic: /process|thread|fork|system call/i,
  map: {
    kind: "strip",
    items: [
      { label: "1. Process states", sub: "PCB and context switch", state: "done" },
      { label: "2. fork()", sub: "counting processes and prints", state: "done" },
      { label: "3. Threads", sub: "user vs kernel threads", state: "done" },
      { label: "4. System calls", sub: "and the kernel boundary", state: "done" },
    ],
  },
  topics: deepen([states, forks, threads, syscalls]),
};
