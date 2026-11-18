import type { Block, CheckQ, Topic } from "@/lib/study/schema";

/**
 * Deeper material for the Operating Systems topics (owner, 19 Nov: "the content is not detailed enough").
 * Each topic gets an "In depth" section, one more GATE-level worked example and two more check questions.
 * Numbers are worked out in the solutions; the single-resource Banker's and detection examples were hand-checked.
 */
type Extra = { deep: Extract<Block, { type: "deep" }>; example: Extract<Block, { type: "example" }>; checks: CheckQ[] };

const D: Record<string, Extra> = {
  "cs.os.deadlock.conditions": {
    deep: { type: "deep", sections: [
      { h: "Kinds of resources", paras: ["A reusable resource (CPU, memory, a file, a lock, a printer) is used and then given back; it is not used up. A consumable resource (a message, a signal) disappears once taken. Classic deadlock questions are about reusable resources.", "A resource is pre-emptable if it can be taken away and given back without harm (CPU time, memory pages that can be swapped). It is non-pre-emptable if taking it away breaks the work (a printer halfway through a page, a lock in the middle of an update). Deadlocks come from non-pre-emptable resources."] },
      { h: "Reading the graph precisely", paras: ["A resource-allocation graph has two kinds of vertices: processes (circles) and resource types (rectangles, one dot per instance)."], points: ["Request edge P → R: the process is waiting for one instance of R.", "Assignment edge R → P: one instance of R is held by P (drawn from a dot).", "Claim edge P ⇢ R (dashed, used in avoidance): P may ask for R in the future.", "A process with no outgoing request edge is not waiting for anything; it can run to completion."] },
      { h: "Why the cycle test needs care", paras: ["With one instance per resource, every edge in a cycle points to the only holder of what is wanted, so nobody on the cycle can ever be served: cycle means deadlock.", "With several instances, a process outside the cycle may hold an instance of a resource on the cycle. When it finishes, that instance frees someone on the cycle and the ring opens. So the cycle is necessary but not enough; you must reduce the graph."] },
      { h: "Where deadlocks really happen", paras: ["Databases: two transactions each lock a row the other needs. Multithreaded programs: two threads take two mutexes in opposite orders. Operating systems: a process holding a buffer waits for a device held by a process waiting for that buffer. All four conditions are present each time."] },
    ] },
    example: { type: "example", id: "ex-chain", level: "gate", title: "A long chain is not a deadlock", given: "Single instances. P1 holds R1 and asks for R2. P2 holds R2 and asks for R3. P3 holds R3 and asks for nothing. P4 asks for R1.", find: "Is any process deadlocked?",
      steps: [
        { say: "Draw the waits: P1 waits for P2 (R2), P2 waits for P3 (R3), P4 waits for P1 (R1)." },
        { say: "P3 asks for nothing, so it can run and release R3.", result: "P3 finishes" },
        { say: "P2 gets R3, finishes, releases R2 and R3. Then P1 gets R2, finishes, releases R1 and R2. Then P4 gets R1.", result: "everyone finishes" },
        { say: "There is a long chain of waiting, but no cycle: the chain ends at P3, which can move." },
      ],
      answer: "No deadlock. A chain of waits ending at a process that can run always unwinds.",
      check: "Add one edge, P3 asks for R1, and the chain closes into a cycle P1 → P2 → P3 → P1: now P1, P2 and P3 are deadlocked." },
    checks: [
      { id: "q6", kind: "MCQ", marks: 1, q: "Which of these resources is usually pre-emptable?", options: ["A printer in the middle of a job", "Main memory pages that can be swapped out", "A write lock on a database row", "A tape drive mid-write"], answer: "B", solution: "Memory pages can be saved to disk and restored later without harm. The others cannot be taken away mid-use." },
      { id: "q7", kind: "NAT", marks: 2, q: "Single instances. P1 holds R1 and asks for R2. P2 holds R2 and asks for R3. P3 holds R3 and asks for R1. P4 holds R4 and asks for nothing. How many processes are deadlocked?", answer: "3", solution: "P1 → P2 → P3 → P1 is a cycle of single-instance resources, so those three are deadlocked. P4 can finish." },
    ],
  },
  "cs.os.deadlock.prevention": {
    deep: { type: "deep", sections: [
      { h: "Spooling: sharing an unshareable device", paras: ["A printer cannot print two jobs at once. Spooling puts each job in a file on disk and lets one system daemon own the printer. Processes never wait for the printer itself, only for disk space, so the printer leaves the deadlock picture. This is the usual example of breaking mutual exclusion."] },
      { h: "Two ways to break hold and wait", paras: ["Protocol 1: a process asks for everything it will ever need before it starts. Protocol 2: a process may ask only when it holds nothing; to get more it must release what it has and ask again for all of it.", "Both stop a process from holding while waiting. Both waste resources (things held long before use) and risk starvation for a process that needs several popular resources at the same moment."] },
      { h: "Pre-emption done safely", paras: ["If a process holding resources asks for one that is not free, the system takes back everything it holds and adds those to the list it is waiting for. It restarts only when it can get all of them. This works for resources whose state can be saved, like registers and memory."] },
      { h: "Why ordering always works", paras: ["Give each resource type a number F. Suppose a circular wait existed among P0 … Pn, with Pi holding Ri and waiting for Ri+1, and Pn waiting for R0. Ordered requests force F(R0) < F(R1) < … < F(Rn) < F(R0), which is impossible. So no circular wait can form."] },
    ] },
    example: { type: "example", id: "pex3", level: "gate", title: "Three locks, three threads", given: "T1 takes lock A then C. T2 takes C then B. T3 takes B then A.", find: "Can they deadlock? Fix it with an ordering.",
      steps: [
        { say: "Worst timing: T1 holds A, T2 holds C, T3 holds B." },
        { say: "T1 waits for C (T2), T2 waits for B (T3), T3 waits for A (T1).", result: "circular wait: deadlock" },
        { say: "Number the locks A = 1, B = 2, C = 3 and require increasing order." },
        { say: "T1 (A then C) is fine. T2 must take B then C. T3 must take A then B.", result: "no cycle possible" },
      ],
      answer: "Yes, they can deadlock. With the order A < B < C, T2 takes B before C and T3 takes A before B, and deadlock becomes impossible.",
      check: "With the order, whoever holds the highest-numbered lock in use can always finish, so the ring never closes." },
    checks: [
      { id: "p6", kind: "NAT", marks: 1, q: "Locks are ordered A = 1, B = 2, C = 3. How many of these acquisition sequences are allowed? (A, C), (C, B), (B, C), (A, B, C), (C, A).", answer: "3", solution: "Allowed sequences only increase: (A, C), (B, C) and (A, B, C). (C, B) and (C, A) decrease." },
      { id: "p7", kind: "MCQ", marks: 2, q: "Why does strict resource ordering make circular wait impossible?", options: ["It makes every resource shareable", "Around any cycle the numbers would have to increase forever and return to the start, which is impossible", "It forces processes to release everything before asking", "It lets the OS take resources away"], answer: "B", solution: "A cycle would need F(R0) < F(R1) < … < F(R0), a contradiction." },
    ],
  },
  "cs.os.deadlock.avoidance": {
    deep: { type: "deep", sections: [
      { h: "Safe, unsafe, deadlocked", paras: ["Think of three nested sets. Every state is either safe or unsafe. Deadlocked states are a small part of the unsafe ones. Avoidance keeps the system in the safe set, so it can never drift into deadlock; an unsafe state only means that guarantee is lost."] },
      { h: "What it costs", paras: ["With n processes and m resource types, the safety algorithm can scan the n processes up to n times, comparing m numbers each time: O(m × n²) per check. Banker's runs this on every request, which is why real general-purpose systems rarely use it."] },
      { h: "Single instances: the claim-edge graph", paras: ["When every resource has one instance, draw claim edges P ⇢ R for everything P may ever ask for. A request is granted only if turning its claim edge into an assignment edge (R → P) does not create a cycle. A cycle check is cheaper than the full Banker's run."] },
      { h: "What avoidance needs, and why that hurts", points: ["Every process must declare its maximum need in advance.", "The number of processes and resources is assumed fixed.", "Processes must eventually release everything they hold.", "It is conservative: it refuses some requests that would not have caused deadlock."], paras: [] },
    ] },
    example: { type: "example", id: "bex3", level: "gate", title: "One resource type, three processes", given: "10 units of one resource. P0: max 7, holds 3. P1: max 4, holds 2. P2: max 6, holds 2. So 7 are allocated and 3 are free.", find: "Is the state safe? Can P2 get 1 more? Can P0 get 2 more?",
      steps: [
        { say: "Needs: P0 needs 4, P1 needs 2, P2 needs 4. Work = 3." },
        { say: "P1 (2 ≤ 3) finishes and returns 2: Work = 5. P0 (4 ≤ 5) finishes, returns 3: Work = 8. P2 (4 ≤ 8) finishes.", result: "safe: P1, P0, P2" },
        { say: "P2 asks for 1: Work becomes 2 and P2 needs 3. P1 (2 ≤ 2) → Work 4; P0 (4 ≤ 4) → Work 7; P2 (3 ≤ 7).", result: "safe: grant" },
        { say: "P0 asks for 2 instead: Work becomes 1. Needs are P0 2, P1 2, P2 4; none fits in 1.", result: "unsafe: refuse" },
      ],
      answer: "Safe (sequence P1, P0, P2). P2's request for 1 is granted; P0's request for 2 is refused.",
      check: "The total check: after everyone finishes, Work returns to 10, the full number of units." },
    checks: [
      { id: "b6", kind: "NAT", marks: 1, q: "In Example 3 (10 units; P0 holds 3, P1 holds 2, P2 holds 2), how many units are free right after P1 finishes in the safety run?", answer: "5", solution: "Work starts at 3; P1 returns its 2: 3 + 2 = 5." },
      { id: "b7", kind: "MCQ", marks: 1, q: "The time to run the Banker's safety check for n processes and m resource types grows as", options: ["O(m + n)", "O(m × n)", "O(m × n²)", "O(2ⁿ)"], answer: "C", solution: "Up to n passes over n processes, comparing m values each time." },
    ],
  },
  "cs.os.deadlock.detection": {
    deep: { type: "deep", sections: [
      { h: "How often to look", paras: ["Running detection on every request finds a deadlock at once and even names the request that caused it, but costs time on every request. Running it every few minutes, or when CPU use drops sharply, is cheaper but lets a deadlock sit for a while and makes it hard to tell which request started it."] },
      { h: "The wait-for graph, and its cost", paras: ["Collapse each resource node: if Pi waits for a resource held by Pj, draw Pi → Pj. A cycle search with depth-first search takes O(n + e) for n processes and e edges, which is O(n²) in the worst case."] },
      { h: "Recovery by ending processes", points: ["Abort all deadlocked processes: simple, but all their work is lost.", "Abort one at a time, re-running detection after each: less work lost, more checking.", "Choose the victim by priority, how long it has run and how long it still needs, how many resources it holds, and whether it is interactive."], paras: [] },
      { h: "Recovery by taking resources", paras: ["Take resources from a victim and roll it back to a safe earlier point (or restart it). The danger is starvation: the same process might be picked every time. A common guard is to count how many times a process has been rolled back and include that count in the cost."] },
    ] },
    example: { type: "example", id: "dex3", level: "gate", title: "Detection with one resource type", given: "6 identical units. P0 holds 2, P1 holds 1, P2 holds 2, so 1 is free. Current requests: P0 2, P1 1, P2 2.", find: "Is anyone deadlocked? What if P1 asked for 2 instead?",
      steps: [
        { say: "Work = 1. P1 asks for 1: fits. P1 finishes and returns 1: Work = 2." },
        { say: "P0 asks for 2: fits. Returns 2: Work = 4. P2 asks for 2: fits.", result: "no deadlock" },
        { say: "Now P1 asks for 2. With Work = 1, P0 (2), P1 (2) and P2 (2) all need more than 1.", result: "nobody can finish" },
      ],
      answer: "As given, no deadlock. If P1 asks for 2, all three are deadlocked.",
      check: "One unit more (7 in total) would let any of them finish first, and the rest would follow." },
    checks: [
      { id: "d6", kind: "NAT", marks: 2, q: "6 units in total. P0 holds 2, P1 holds 1, P2 holds 2. Requests now: P0 2, P1 2, P2 2. How many processes are deadlocked?", answer: "3", solution: "Only 1 unit is free and every request is 2, so nobody can proceed: all 3." },
      { id: "d7", kind: "MCQ", marks: 1, q: "What guards against starvation when resources are pre-empted from deadlocked processes?", options: ["Always choosing the lowest-numbered process", "Counting roll-backs and including the count in the victim cost", "Never rolling back", "Running detection more often"], answer: "B", solution: "Otherwise the same cheap process could be chosen as the victim every time." },
    ],
  },
  "cs.os.deadlock.counting": {
    deep: { type: "deep", sections: [
      { h: "Why the worst case is everyone one short", paras: ["For a deadlock with one resource type, every process in the deadlock must be waiting, so each holds fewer than it needs. The most instances such a stuck state can use is when each holds exactly one less than its need. If there are more instances than that, at least one process can always get its last instance, finish and free everything it held."] },
      { h: "It is the pigeonhole principle", paras: ["n(k − 1) + 1 instances into n processes: if every process held at most k − 1, only n(k − 1) instances would be used. With one more instance, some process must hold k, which means it has all it needs. This is the pigeonhole principle from Discrete Mathematics."] },
      { h: "Turning it around", paras: ["Asked for the largest number of processes, solve n(k − 1) + 1 ≤ R for n: n ≤ (R − 1)/(k − 1), and take the floor. Asked for the smallest k that can deadlock, look for the smallest k with n(k − 1) ≥ R."] },
      { h: "When the rule does not apply", points: ["Several different resource types: a cycle across types can deadlock even with plenty of each; use Banker's or detection.", "A process whose maximum need is more than R can never finish at all; that is not a deadlock question.", "Needs that change over time: the rule uses the maximum need."], paras: [] },
    ] },
    example: { type: "example", id: "cex3", level: "gate", title: "Both directions in one question", given: "Part A: 6 processes each need at most 3 printers. Part B: a lab has 20 identical plotters; each process needs at most 5.", find: "Part A: fewest printers for no deadlock. Part B: most processes guaranteed deadlock-free.",
      steps: [
        { say: "Part A: worst case 6 × 2 = 12 printers, everyone one short.", result: "12" },
        { say: "Add one.", result: "13 printers" },
        { say: "Part B: n(5 − 1) + 1 ≤ 20, so 4n ≤ 19.", result: "n ≤ 4.75" },
        { say: "Take the floor: 4. Check 5: worst case 5 × 4 = 20 uses every plotter with everyone one short.", result: "4 processes" },
      ],
      answer: "Part A: 13 printers. Part B: at most 4 processes.",
      check: "Formula for B: ⌊(20 − 1)/(5 − 1)⌋ = ⌊19/4⌋ = 4." },
    checks: [
      { id: "c5", kind: "NAT", marks: 1, q: "5 processes each need at most 4 units. What is the fewest number of units that guarantees no deadlock?", answer: "16", solution: "5 × 3 + 1 = 16." },
      { id: "c6", kind: "NAT", marks: 2, q: "A system has 10 units; each process needs at most 3. What is the largest number of processes that is guaranteed deadlock-free?", answer: "4", solution: "⌊(10 − 1)/(3 − 1)⌋ = ⌊4.5⌋ = 4. With 5 processes, 5 × 2 = 10 units can all be held with everyone short." },
    ],
  },
  "cs.os.deadlock.starvation": {
    deep: { type: "deep", sections: [
      { h: "Where starvation comes from", points: ["Strict priority scheduling, when high-priority work never stops arriving.", "Shortest-job-first and shortest-remaining-time-first, when short jobs keep arriving.", "Readers-writers solutions that favour readers, which can starve writers.", "Deadlock recovery that keeps choosing the same victim."], paras: [] },
      { h: "Ageing, precisely", paras: ["Ageing raises a waiting process's priority as time passes, for example by 1 every few minutes. Any process eventually becomes the most important one in the queue, so it cannot wait for ever. The rate decides how long the worst wait can be."] },
      { h: "Livelock and back-off", paras: ["Two processes that react to each other in exactly the same way can keep undoing each other's progress. Randomness breaks the tie. Ethernet uses binary exponential back-off: after the k-th collision a station waits a random number of slots between 0 and 2ᵏ − 1, so repeated clashes become unlikely."] },
      { h: "A cousin: priority inversion", paras: ["A high-priority task waits for a lock held by a low-priority task, while medium-priority tasks keep running and stop the low one from releasing the lock. Priority inheritance fixes it: while it holds the lock, the low task temporarily runs at the high task's priority."] },
    ] },
    example: { type: "example", id: "sex3", level: "gate", title: "How random is back-off?", given: "A station uses binary exponential back-off: after the k-th collision it picks a random wait of 0 to 2ᵏ − 1 slots.", find: "How many choices does it have after the 3rd collision, and what is the chance two stations pick the same slot?",
      steps: [
        { say: "After the 3rd collision the range is 0 to 2³ − 1 = 7.", result: "8 choices" },
        { say: "Two stations choose independently; the chance the second matches the first is 1 in 8.", result: "1/8" },
      ],
      answer: "8 choices; the chance of another clash is 1/8 = 0.125.",
      check: "After the 1st collision the range is 0 to 1 (2 choices, clash chance 1/2): the range doubles each time, so clashes quickly become rare." },
    checks: [
      { id: "s5", kind: "NAT", marks: 1, q: "With binary exponential back-off, how many different waiting slots can a station choose from after its 4th collision?", answer: "16", solution: "0 to 2⁴ − 1 = 15, which is 16 choices." },
      { id: "s6", kind: "MCQ", marks: 1, q: "Priority inheritance is used to fix", options: ["Deadlock", "Priority inversion", "Thrashing", "Livelock"], answer: "B", solution: "The lock holder temporarily takes the waiting high-priority task's priority so it can finish and release the lock." },
    ],
  },
  "cs.os.processes.states": {
    deep: { type: "deep", sections: [
      { h: "A process in memory", paras: ["A process's address space has four parts: text (the code), data (globals), heap (memory from malloc, growing upward) and stack (function calls and local variables, growing downward). The heap and stack grow toward each other from opposite ends."] },
      { h: "Queues and the three schedulers", points: ["Long-term (job) scheduler: decides which jobs are admitted into memory; it controls the degree of multiprogramming.", "Short-term (CPU) scheduler: picks the next ready process to run; it runs very often, so it must be fast.", "Medium-term scheduler: swaps processes out of memory and back in to reduce load."], paras: [] },
      { h: "When memory is short: suspended states", paras: ["Some systems add two states: a waiting process swapped out to disk is Suspended-Waiting, and a ready process swapped out is Suspended-Ready. They must be brought back into memory before they can run."] },
      { h: "What a switch really costs", paras: ["Saving and loading registers is quick. The hidden cost is that caches and the TLB were filled for the old process, so the new one starts with many misses. That is why switching between threads of one process (same address space) is cheaper than between processes."] },
    ] },
    example: { type: "example", id: "psex3", level: "gate", title: "Which scheduler does what?", given: "Three situations: (a) memory is full, so a waiting process is copied to disk; (b) the CPU is idle and the OS picks a ready process; (c) a batch job is let into the system.", find: "Which scheduler handles each?",
      steps: [
        { say: "(a) Swapping a process out of memory is the medium-term scheduler.", result: "medium-term" },
        { say: "(b) Choosing who runs on the CPU next is the short-term scheduler.", result: "short-term" },
        { say: "(c) Admitting a new job is the long-term scheduler, which sets how many processes are in memory.", result: "long-term" },
      ],
      answer: "(a) medium-term, (b) short-term, (c) long-term.",
      check: "The short-term scheduler runs the most often, every few milliseconds; the long-term one the least." },
    checks: [
      { id: "ps5", kind: "MCQ", marks: 1, q: "Which scheduler controls the degree of multiprogramming?", options: ["Short-term", "Medium-term", "Long-term", "Dispatcher"], answer: "C", solution: "The long-term scheduler decides how many processes are admitted into memory." },
      { id: "ps6", kind: "MSQ", marks: 2, q: "Which parts of a process's memory change size while it runs?", options: ["Text (code)", "Heap", "Stack", "Initialised global data"], answer: "B, C", solution: "The heap grows with malloc and the stack with function calls. Code and globals keep a fixed size." },
    ],
  },
  "cs.os.processes.fork": {
    deep: { type: "deep", sections: [
      { h: "Copy-on-write", paras: ["Copying a whole address space on every fork would be slow, especially since the child often calls exec right away. Modern systems use copy-on-write: parent and child share the same physical pages, marked read-only, and a page is copied only when one of them writes to it."] },
      { h: "fork, exec, wait, exit", points: ["fork: create a copy of the calling process.", "exec: replace the current program with a new one (same process id).", "wait: the parent pauses until a child exits and collects its exit status.", "exit: end the process; its status is kept until the parent collects it."], paras: [] },
      { h: "Zombies and orphans", paras: ["A child that has exited but whose parent has not yet called wait is a zombie: it holds only its entry in the process table. A child whose parent exits first is an orphan; it is adopted by the init process, which waits for it."] },
      { h: "A counting method that never fails", paras: ["Go line by line. Keep the number of processes that reach each line. A plain fork doubles it. A fork inside a condition doubles only the processes that take that branch. Add the prints line by line using the count at that line."] },
    ] },
    example: { type: "example", id: "fkex3", level: "gate", title: "Different prints in parent and child", given: "if (fork()) { printf(\"A\"); } else { printf(\"B\"); fork(); printf(\"C\"); }", find: "How many times is each letter printed?",
      steps: [
        { say: "fork() returns non-zero in the parent, so the parent takes the if branch.", result: "A once" },
        { say: "The child gets 0 and takes the else branch: it prints B.", result: "B once" },
        { say: "The child forks again; now two processes (child and grandchild) run printf(\"C\").", result: "C twice" },
      ],
      answer: "A once, B once, C twice: 4 lines in total.",
      check: "Total processes: original, child, grandchild = 3." },
    checks: [
      { id: "fk5", kind: "NAT", marks: 2, q: "if (fork()) { printf(\"A\"); } else { printf(\"B\"); fork(); printf(\"C\"); } How many characters are printed in total?", answer: "4", solution: "Parent prints A; child prints B; child and grandchild both print C: 1 + 1 + 2 = 4." },
      { id: "fk6", kind: "MCQ", marks: 1, q: "A process has exited but its parent has not called wait. The process is a", options: ["Orphan", "Zombie", "Daemon", "Thread"], answer: "B", solution: "Its exit status waits in the process table for the parent to collect it." },
    ],
  },
  "cs.os.processes.threads": {
    deep: { type: "deep", sections: [
      { h: "Why use threads at all", points: ["Responsiveness: one thread can wait for the network while another keeps the screen alive.", "Sharing: threads share memory without setting up shared segments or pipes.", "Economy: creating and switching threads is cheaper than processes.", "Scalability: threads can run in parallel on several cores."], paras: [] },
      { h: "How many threads are worth it: Amdahl's law", paras: ["If a fraction S of a program must run serially and the rest can be split across N cores, the speed-up is at most 1 / (S + (1 − S)/N). Even with infinite cores the limit is 1/S, so the serial part caps the gain."] },
      { h: "Threads in Linux", paras: ["Linux does not separate processes and threads strongly: both are tasks created with clone(). Flags decide what the new task shares (memory, files, signal handlers). A thread is a task that shares the address space."] },
      { h: "Per-thread data and cancelling", paras: ["Thread-local storage gives each thread its own copy of a variable that looks global. Cancelling a thread can be asynchronous (stop now, risky if it holds a lock) or deferred (the thread checks at safe points and exits cleanly)."] },
    ] },
    example: { type: "example", id: "thex3", level: "gate", title: "Speed-up with four cores", given: "25% of a program is serial; the rest parallelises perfectly. It runs on 4 cores.", find: "The maximum speed-up, and the limit with unlimited cores.",
      steps: [
        { say: "S = 0.25 and N = 4. Speed-up ≤ 1 / (0.25 + 0.75/4)." },
        { say: "0.75/4 = 0.1875, so the denominator is 0.4375.", result: "0.4375" },
        { say: "1 / 0.4375 ≈ 2.29.", result: "about 2.29×" },
        { say: "With unlimited cores the parallel term goes to 0: the limit is 1/0.25.", result: "4×" },
      ],
      answer: "About 2.29× on 4 cores, and never more than 4× however many cores are added.",
      check: "Four cores do not give 4× because a quarter of the work still runs on one core." },
    checks: [
      { id: "th5", kind: "NAT", marks: 2, q: "20% of a program is serial; the rest is perfectly parallel. What is the maximum speed-up on 4 cores?", answer: "2.5", solution: "1 / (0.2 + 0.8/4) = 1 / (0.2 + 0.2) = 1 / 0.4 = 2.5." },
      { id: "th6", kind: "MCQ", marks: 1, q: "With deferred cancellation, a thread that is asked to stop", options: ["Stops immediately, wherever it is", "Stops at the next point where it checks for cancellation", "Never stops", "Stops only if it holds no memory"], answer: "B", solution: "Deferred cancellation lets the thread end at a safe point, for example after releasing its locks." },
    ],
  },
  "cs.os.processes.syscalls": {
    deep: { type: "deep", sections: [
      { h: "The families of system calls", points: ["Process control: fork, exec, exit, wait.", "File management: open, read, write, close.", "Device management: ioctl, read and write on devices.", "Information: getpid, time.", "Communication: pipe, shared memory, sockets.", "Protection: chmod, setuid."], paras: [] },
      { h: "Passing arguments to the kernel", paras: ["Three common ways: put the values in registers (fast, few arguments); put them in a block in memory and pass its address in a register; or push them on the stack for the kernel to pop. Linux on x86-64 uses registers."] },
      { h: "Traps, interrupts and exceptions", paras: ["An interrupt comes from hardware outside the running program (a disk finished, a timer tick) and can arrive at any time. A trap or exception is caused by the running instruction itself: a system call instruction on purpose, or a divide by zero or page fault by accident. All three switch the CPU into kernel mode."] },
      { h: "The library in between", paras: ["Programs rarely make raw system calls. They call an API such as POSIX through the C library, which prepares the arguments and executes the trap. printf, for example, buffers text and eventually calls write."] },
    ] },
    example: { type: "example", id: "scex3", level: "gate", title: "Counting mode switches", given: "A program opens a file, reads it once, writes the result once and closes the file. It also calls strlen twice.", find: "How many switches between user and kernel mode happen for these calls?",
      steps: [
        { say: "System calls: open, read, write, close: 4 calls.", result: "4 calls" },
        { say: "Each system call switches into the kernel and back: 2 switches.", result: "8 switches" },
        { say: "strlen is a library function in user mode: no switch." },
      ],
      answer: "8 mode switches.",
      check: "A page fault during strlen would add a trap, but that is an exception, not one of the calls asked about." },
    checks: [
      { id: "sc5", kind: "NAT", marks: 1, q: "A program makes 5 system calls and 12 ordinary function calls. How many user↔kernel mode switches do the system calls cause?", answer: "10", solution: "2 per system call; ordinary calls stay in user mode: 5 × 2 = 10." },
      { id: "sc6", kind: "MCQ", marks: 1, q: "How does a trap differ from a hardware interrupt?", options: ["A trap is caused by the running instruction; an interrupt comes from a device", "A trap never enters the kernel", "An interrupt is always caused by a bug", "They are the same"], answer: "A", solution: "Traps (system calls, faults) come from the current instruction; interrupts come from outside it." },
    ],
  },
};

/** Put each topic's deep section after its definition, its extra example after the existing examples, and its extra checks with the others. */
export function deepen(topics: Topic[]): Topic[] {
  return topics.map((t) => {
    const x = D[t.id];
    if (!x) return t;
    const blocks = [...t.blocks];
    const defAt = blocks.findIndex((b) => b.type === "definition");
    blocks.splice(defAt + 1, 0, x.deep);
    let lastEx = -1; blocks.forEach((b, i) => { if (b.type === "example" || (b.type === "figure" && b.for)) lastEx = i; });
    blocks.splice(lastEx + 1, 0, x.example);
    blocks.push({ type: "check", questions: x.checks });
    return { ...t, blocks };
  });
}
