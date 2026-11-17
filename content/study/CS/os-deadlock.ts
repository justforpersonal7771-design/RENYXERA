import type { Chapter } from "@/lib/study/schema";

/**
 * Reference chapter: Operating System → Deadlock (docs/study-materials/BLUEPRINT-FINAL.md).
 * Written by Claude in our own words and numbers. Topic 1 is complete; topics 2–6 follow the same blueprint.
 */
export const OS_DEADLOCK: Chapter = {
  id: "cs.os.deadlock",
  subject: "Operating System",
  title: "Deadlock",
  syllabus: ["CS · Operating System: Deadlock"],
  map: {
    kind: "strip",
    items: [
      { label: "1. The four conditions", sub: "and the resource graph", state: "now" },
      { label: "2. Prevention", sub: "break one condition", state: "todo" },
      { label: "3. Avoidance", sub: "safe states, Banker's", state: "todo" },
      { label: "4. Detection", sub: "and recovery", state: "todo" },
      { label: "5. How many resources?", sub: "the n(k-1)+1 problems", state: "todo" },
      { label: "6. Deadlock vs starvation", sub: "and livelock", state: "todo" },
    ],
  },
  topics: [
    {
      id: "cs.os.deadlock.conditions",
      title: "When processes get stuck: the four conditions and the resource graph",
      blocks: [
        { type: "hook", text: "Two programs each hold one file and wait for the other's file. Neither will let go, so neither can finish. The machine is not slow; it is stuck for ever. This is a deadlock." },
        { type: "objectives", items: ["State the four conditions that must all hold for a deadlock.", "Draw a resource-allocation graph and read a cycle in it.", "Tell when a cycle means deadlock and when it does not."] },
        {
          type: "intuition",
          paras: [
            "Think of a narrow one-lane bridge. A car enters from each end at the same time. Each car needs the other to back up, and neither will. Both drivers are polite, both are waiting, and nobody moves.",
            "Processes in an operating system behave the same way with resources: files, printers, memory buffers, locks. A process takes a resource, keeps it while it works, and may ask for another. If two or more processes end up waiting for each other in a closed loop, none of them can ever continue.",
            "The important word is loop. One process waiting for another is normal: it waits, the other finishes, life goes on. A deadlock is a ring of waiting where every process in the ring waits for the next one, so the waiting never ends.",
          ],
          analogyLimit: "The bridge breaks down in one way: a real driver can reverse. In the operating system, a process cannot give a resource back on its own unless the system allows it. That is exactly the 'no pre-emption' condition below.",
        },
        {
          type: "definition",
          name: "Deadlock and its four necessary conditions",
          text: "A set of processes is deadlocked when every process in the set is waiting for an event (usually a resource being released) that only another process in the same set can cause. A deadlock can happen only if all four conditions below hold at the same time. Remove any one, and deadlock is impossible.",
          items: [
            "Mutual exclusion: at least one resource can be used by only one process at a time.",
            "Hold and wait: a process holds at least one resource while waiting for another.",
            "No pre-emption: a resource cannot be taken away from a process; the process must release it itself.",
            "Circular wait: there is a chain P1 → P2 → … → Pn → P1 where each process waits for a resource held by the next.",
          ],
        },
        {
          type: "walkthrough",
          steps: [
            "Draw every process as a circle and every resource type as a rectangle. Put one dot inside the rectangle for each instance of that resource.",
            "If a process is waiting for a resource, draw a request edge from the process to the rectangle (P → R).",
            "If an instance of a resource is given to a process, draw an assignment edge from that instance's dot to the process (R → P).",
            "Now follow the arrows. If you can start at a process and come back to it, the graph has a cycle.",
            "If every resource on that cycle has exactly one instance, the cycle is a deadlock. If some resource on the cycle has more than one instance, the cycle only says a deadlock is possible; you must check further (the reduction method in Example 2).",
          ],
          prompt: { q: "Why does an extra instance of a resource break the 'cycle means deadlock' rule?", a: "Because a process outside the cycle may hold the extra instance. When it finishes and releases it, a process on the cycle can get what it is waiting for, and the ring opens." },
        },
        {
          type: "figure",
          id: "rag-single",
          caption: "Single-instance resources: the cycle P1 → R2 → P2 → R1 → P1 is a deadlock.",
          alt: "P1 holds R1 and requests R2. P2 holds R2 and requests R1. The arrows form a closed loop.",
          fig: {
            kind: "graph", w: 360, h: 230,
            nodes: [
              { id: "P1", label: "P1", kind: "process", x: 70, y: 115 },
              { id: "P2", label: "P2", kind: "process", x: 290, y: 115 },
              { id: "R1", label: "R1", kind: "resource", x: 180, y: 40, instances: 1 },
              { id: "R2", label: "R2", kind: "resource", x: 180, y: 190, instances: 1 },
            ],
            edges: [
              { from: "R1", to: "P1", kind: "assign", hl: true },
              { from: "P1", to: "R2", kind: "request", hl: true },
              { from: "R2", to: "P2", kind: "assign", hl: true },
              { from: "P2", to: "R1", kind: "request", hl: true },
            ],
          },
        },
        {
          type: "example", id: "ex1", level: "gate",
          title: "A three-process ring",
          given: "Every resource has one instance. P1 holds R1 and asks for R2. P2 holds R2 and asks for R3. P3 holds R3 and asks for R1.",
          find: "Is the system deadlocked? If yes, which processes are involved?",
          steps: [
            { say: "Draw the edges: R1 → P1, P1 → R2, R2 → P2, P2 → R3, R3 → P3, P3 → R1." },
            { say: "Follow the arrows from P1: P1 → R2 → P2 → R3 → P3 → R1 → P1. We are back at P1, so there is a cycle.", result: "Cycle found" },
            { say: "Check the instances on the cycle: R1, R2 and R3 each have one instance." },
            { say: "With single-instance resources, a cycle is enough for a deadlock. Each process waits for a resource held by the next one in the ring, and no process outside the ring can release anything to help." },
          ],
          answer: "Yes. P1, P2 and P3 are deadlocked.",
          check: "Try removing any one edge, for example P3's request for R1. The ring opens, P3 can finish, release R3, then P2 can finish, then P1. So all four conditions were needed.",
        },
        {
          type: "figure",
          id: "rag-multi",
          caption: "R1 has two instances. There is a cycle, but P3 is not waiting, so no deadlock.",
          alt: "R1 with two dots: one assigned to P1 and one to P3. P1 requests R2. R2 is assigned to P2. P2 requests R1. P3 has no request.",
          fig: {
            kind: "graph", w: 380, h: 250,
            nodes: [
              { id: "P1", label: "P1", kind: "process", x: 60, y: 130 },
              { id: "P2", label: "P2", kind: "process", x: 300, y: 130 },
              { id: "P3", label: "P3", kind: "process", x: 330, y: 40 },
              { id: "R1", label: "R1", kind: "resource", x: 180, y: 40, instances: 2 },
              { id: "R2", label: "R2", kind: "resource", x: 180, y: 215, instances: 1 },
            ],
            edges: [
              { from: "R1", to: "P1", kind: "assign", hl: true },
              { from: "R1", to: "P3", kind: "assign" },
              { from: "P1", to: "R2", kind: "request", hl: true },
              { from: "R2", to: "P2", kind: "assign", hl: true },
              { from: "P2", to: "R1", kind: "request", hl: true },
            ],
          },
        },
        {
          type: "example", id: "ex2", level: "edge",
          title: "A cycle that is not a deadlock",
          given: "R1 has 2 instances, R2 has 1. P1 holds one R1 and asks for R2. P2 holds R2 and asks for R1. P3 holds the other R1 and asks for nothing.",
          find: "Is there a deadlock?",
          steps: [
            { say: "There is a cycle: P1 → R2 → P2 → R1 → P1. But R1 has two instances, so the cycle alone does not decide it." },
            { say: "Use reduction: find a process whose requests can all be met right now, let it finish, and give back what it held. P3 asks for nothing, so P3 can finish.", result: "P3 finishes, one R1 becomes free" },
            { say: "P2 is waiting for one R1. One R1 is now free, so P2 gets it, finishes, and releases R1 and R2.", result: "P2 finishes" },
            { say: "P1 is waiting for R2, which is now free. P1 gets it and finishes.", result: "P1 finishes" },
            { say: "Every process could finish in the order P3, P2, P1. If all processes can be removed this way, there is no deadlock." },
          ],
          answer: "No deadlock. A safe finishing order is P3 → P2 → P1.",
          check: "Change one fact: suppose P3 also asks for R2. Now P3 cannot finish first, P1 and P2 still wait for each other, and nobody can be reduced. That version is a deadlock.",
        },
        {
          type: "figure",
          id: "rag-reduce",
          caption: "Reducing the graph from Example 2, one finished process at a time.",
          alt: "Three steps: P3 finishes, then P2, then P1.",
          fig: { kind: "strip", items: [{ label: "P3 finishes", sub: "frees one R1", state: "done" }, { label: "P2 finishes", sub: "gets R1, frees R1 + R2", state: "done" }, { label: "P1 finishes", sub: "gets R2", state: "done" }, { label: "No deadlock", sub: "every process reduced", state: "now" }] },
        },
        {
          type: "faded",
          title: "Your turn",
          given: "Every resource has one instance. P1 holds R1 and asks for R2. P2 holds R2 and asks for nothing.",
          steps: [
            { say: "Draw the edges: R1 → P1, P1 → R2, R2 → P2." },
            { say: "Is there a cycle starting at P1?", blank: true, answer: "No. P1 → R2 → P2 stops at P2, which asks for nothing." },
            { say: "So is the system deadlocked?", blank: true, answer: "No. P2 finishes and releases R2, then P1 gets R2 and finishes." },
          ],
        },
        { type: "trap", wrong: "Any cycle in a resource-allocation graph means deadlock.", tempting: "A cycle looks exactly like processes waiting on each other in a ring.", whyWrong: "With more than one instance of a resource, a process outside the cycle can release an instance and open the ring (Example 2).", rule: "Single instance: cycle ⇔ deadlock. Multiple instances: cycle is necessary, not sufficient; reduce the graph to decide." },
        { type: "trap", wrong: "Deadlock and starvation are the same thing.", tempting: "In both, a process waits and does not finish.", whyWrong: "In starvation the system keeps making progress; one unlucky process is always passed over. In deadlock no process in the set can ever move.", rule: "Deadlock: a closed ring where nobody progresses. Starvation: others progress, one waits for ever." },
        { type: "trap", wrong: "If a deadlock happened, removing mutual exclusion is always the fix.", tempting: "It is listed first, so it looks like the easiest condition to break.", whyWrong: "Many resources (a printer, a write lock) cannot be shared by nature. Making them shareable is often impossible.", rule: "Pick the condition that is cheap to break for that resource; mutual exclusion usually is not." },
        { type: "gate", text: "GATE tests this topic mostly as 1-mark and 2-mark conceptual MCQs and MSQs: which conditions are necessary, what a cycle in a graph implies, and whether a described allocation is deadlocked. Practise reading the graph quickly and always check the number of instances before deciding." },
        { type: "recall", cards: [{ q: "The four necessary conditions for deadlock", a: "Mutual exclusion, hold and wait, no pre-emption, circular wait" }, { q: "Single-instance resources: what does a cycle mean?", a: "A deadlock (cycle ⇔ deadlock)" }, { q: "Multiple instances: what does a cycle mean?", a: "Deadlock is possible; reduce the graph to decide" }] },
        {
          type: "check",
          questions: [
            { id: "q1", kind: "MCQ", marks: 1, q: "Which of these is NOT one of the four necessary conditions for deadlock?", options: ["Mutual exclusion", "Hold and wait", "Pre-emption", "Circular wait"], answer: "C", solution: "The condition is NO pre-emption: resources cannot be taken away. Allowing pre-emption actually helps prevent deadlock, so 'pre-emption' is not a condition." },
            { id: "q2", kind: "MSQ", marks: 2, q: "In a resource-allocation graph where every resource has exactly one instance, which statements are true?", options: ["A cycle implies a deadlock", "A deadlock implies a cycle", "No cycle implies no deadlock", "A cycle implies starvation but never deadlock"], answer: "A, B, C", solution: "With single instances, cycle and deadlock are equivalent, so A and B hold, and C is B said the other way. D is false: the cycle is a deadlock." },
            { id: "q3", kind: "NAT", marks: 2, q: "Every resource has one instance. P1 holds R1 and asks for R2. P2 holds R2 and asks for R1. P3 holds R3 and asks for R1. P4 holds nothing and asks for R3. How many processes lie on a cycle of the graph?", answer: "2", solution: "Edges: R1→P1, P1→R2, R2→P2, P2→R1, R3→P3, P3→R1, P4→R3. The only cycle is P1 → R2 → P2 → R1 → P1. P3 and P4 wait, but they are not on the cycle. Answer: 2." },
            { id: "q4", kind: "MCQ", marks: 1, q: "Which statement correctly separates deadlock from starvation?", options: ["In starvation, no process in the system makes progress", "In deadlock, the processes in the set wait in a closed ring; in starvation, others progress while one process waits indefinitely", "Starvation can only happen with single-instance resources", "Deadlock can be removed by giving the starving process a higher priority"], answer: "B", solution: "B is the definition. A describes deadlock, not starvation. C is false: starvation is about scheduling, not instances. D fixes starvation (ageing), not deadlock." },
            { id: "q5", kind: "MCQ", marks: 2, q: "R1 has 2 instances and R2 has 1. P1 holds one R1 and requests R2. P2 holds R2 and requests R1. P3 holds one R1 and requests nothing. Which is true?", options: ["The system is deadlocked because there is a cycle", "The system is not deadlocked; P3, then P2, then P1 can finish", "The system is deadlocked only if P3 never finishes", "The state cannot be decided without knowing the maximum needs"], answer: "B", solution: "This is Example 2. P3 needs nothing, finishes and frees an R1; P2 takes it, finishes and frees R2; P1 takes R2 and finishes. A cycle with a multi-instance resource is not a deadlock by itself. D confuses detection with avoidance: detection uses current requests, not maximum needs." },
          ],
        },
        { type: "links", prereq: ["Process states and the ready/waiting queues", "Locks and semaphores (Synchronisation)"], usedIn: ["Deadlock prevention: breaking one condition", "Banker's algorithm (avoidance)", "Detection with a wait-for graph"], cross: ["Algorithms: cycle detection in a directed graph (DFS)", "Databases: wait-for graphs between transactions holding locks"] },
      ],
    },
  ],
};
