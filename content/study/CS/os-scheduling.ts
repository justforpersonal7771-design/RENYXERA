import type { Chapter, Topic } from "@/lib/study/schema";
import { OS_HRRN, OS_MLFQ } from "@/content/study/CS/os-extra";

/**
 * Operating System → CPU scheduling. Our own words and numbers. Every schedule here was produced by
 * lib/study/scheduling.ts and checked by hand: the running set is P1 (arrives 0, burst 5), P2 (1, 3), P3 (2, 1), P4 (4, 2),
 * priorities 3, 1, 4, 2 (1 = highest). Average waiting: FCFS 3.75, SJF 3, SRTF 2, RR(q=2) 4.25, priority 4.
 */
const SET = "P1 arrives at 0 needing 5, P2 at 1 needing 3, P3 at 2 needing 1, P4 at 4 needing 2.";
const gantt = (items: [string, number, number][]) => ({ kind: "strip" as const, items: items.map(([p, a, b], i) => ({ label: p, sub: `${a}–${b}`, state: (i === items.length - 1 ? "now" : "done") as "now" | "done" })) });

const basics: Topic = {
  id: "cs.os.sched.basics",
  title: "Measuring a schedule, FCFS and SJF",
  blocks: [
    { type: "hook", text: "Four students queue at one printer. Print the long thesis first and three people wait half an hour for a one-page form. Print the forms first and everyone is done sooner on average. CPU scheduling is choosing that order, for programs, thousands of times a second." },
    { type: "objectives", items: ["Compute completion, turnaround, waiting and response time from a Gantt chart.", "Schedule a set of processes with FCFS and with non-pre-emptive SJF.", "Explain the convoy effect and why SJF gives the smallest average waiting time."] },
    { type: "intuition", paras: ["The CPU can run one process at a time. The short-term scheduler picks which ready process goes next. A Gantt chart is simply a timeline of who held the CPU when.", "First-come first-served (FCFS) runs processes in arrival order, each to completion. It is fair in a simple way but one long job at the front makes everyone behind it wait: the convoy effect.", "Shortest job first (SJF) always picks the ready process with the smallest burst. Moving short jobs ahead of long ones reduces the waiting of many processes while adding a little to one, so the average drops."], analogyLimit: "At a printer you can see each job's length. A real CPU does not know how long the next burst will be; systems estimate it from past bursts." },
    { type: "definition", name: "Scheduling measures", text: "For each process: completion time is when it finishes; turnaround time = completion − arrival; waiting time = turnaround − burst (time spent ready but not running); response time = first time on the CPU − arrival.", items: ["Throughput: processes finished per unit time. CPU utilisation: fraction of time the CPU is busy.", "FCFS: non-pre-emptive, in arrival order.", "SJF (non-pre-emptive): when the CPU is free, pick the ready process with the smallest burst; ties by arrival.", "SJF gives the minimum average waiting time among non-pre-emptive schedules when all jobs are available together."] },
    { type: "deep", sections: [
      { h: "Reading times off a Gantt chart", paras: ["Write the chart with times under every boundary. A process's completion time is the right edge of its last block. Then turnaround and waiting follow by subtraction; you never need to add up gaps by hand."] },
      { h: "Why shortest-first minimises waiting", paras: ["Swap two neighbouring jobs where the longer one runs first. Running the shorter one first makes the longer one wait by the short burst, but saves the shorter one the long burst. The total waiting drops by (long − short). Repeat until no swap helps: that order is shortest first."] },
      { h: "Predicting the next burst", paras: ["Systems guess the next burst with exponential averaging: τ(n+1) = α·t(n) + (1 − α)·τ(n), where t(n) is the burst just measured and τ is the estimate. α = 1/2 is common: half the latest burst, half the old estimate."] },
      { h: "Idle time and arrival gaps", paras: ["If no process is ready, the CPU idles until the next arrival. FCFS with arrivals 0 (burst 4) and 6 (burst 2) runs the first from 0 to 4, idles from 4 to 6, then runs the second from 6 to 8."] },
    ] },
    { type: "walkthrough", steps: ["List each process with arrival and burst.", "Start at time 0 (or the first arrival). Among processes that have arrived, pick by the rule: earliest arrival (FCFS) or smallest burst (SJF).", "Run it to completion and move the clock to its end.", "Repeat; if nothing has arrived, idle until the next arrival.", "Fill the table: completion, turnaround = completion − arrival, waiting = turnaround − burst."], prompt: { q: "In SJF, a short job arrives while a long one is running. Does it interrupt?", a: "Not in non-pre-emptive SJF. The running job finishes first; the short job is picked next. Interrupting is SRTF (next topic)." } },
    { type: "figure", id: "fcfs-g", caption: `FCFS on the running set: ${SET}`, alt: "Gantt: P1 0–5, P2 5–8, P3 8–9, P4 9–11.", fig: gantt([["P1", 0, 5], ["P2", 5, 8], ["P3", 8, 9], ["P4", 9, 11]]) },
    { type: "example", id: "bx1", level: "gate", title: "FCFS on the running set", given: SET, find: "Average waiting and turnaround time under FCFS.",
      steps: [
        { say: "Order of arrival: P1, P2, P3, P4. Chart: P1 0–5, P2 5–8, P3 8–9, P4 9–11." },
        { say: "Turnaround = completion − arrival: P1 5, P2 7, P3 7, P4 7.", result: "sum 26" },
        { say: "Waiting = turnaround − burst: P1 0, P2 4, P3 6, P4 5.", result: "sum 15" },
        { say: "Averages over 4 processes.", result: "waiting 3.75, turnaround 6.5" },
      ],
      answer: "Average waiting time 3.75, average turnaround time 6.5.",
      check: "Total busy time is 5 + 3 + 1 + 2 = 11, matching the chart's end, with no idle gaps." },
    { type: "figure", id: "sjf-g", for: "bx2", caption: "SJF on the same set: at time 5 the shortest ready job is P3, then P4, then P2.", alt: "Gantt: P1 0–5, P3 5–6, P4 6–8, P2 8–11.", fig: gantt([["P1", 0, 5], ["P3", 5, 6], ["P4", 6, 8], ["P2", 8, 11]]) },
    { type: "example", id: "bx2", level: "gate", title: "SJF on the same set", given: SET, find: "Average waiting time under non-pre-emptive SJF.",
      steps: [
        { say: "At 0 only P1 has arrived, so it runs 0–5 (no pre-emption)." },
        { say: "At 5, ready: P2 (3), P3 (1), P4 (2). Shortest first: P3 5–6, P4 6–8, P2 8–11." },
        { say: "Waiting: P1 0, P2 8 − 1 = 7, P3 5 − 2 = 3, P4 6 − 4 = 2.", result: "sum 12" },
      ],
      answer: "Average waiting time 3, better than FCFS's 3.75.",
      check: "P2 waits longer than under FCFS (7 instead of 4), but P3 and P4 gain more, so the average falls." },
    { type: "example", id: "bx3", level: "edge", title: "The convoy effect", given: "All arrive at 0: P1 needs 20, P2 needs 2, P3 needs 2.", find: "Average waiting under FCFS (order P1, P2, P3) and under SJF.",
      steps: [
        { say: "FCFS: P1 0–20, P2 20–22, P3 22–24. Waiting 0, 20, 22.", result: "average 14" },
        { say: "SJF: P2 0–2, P3 2–4, P1 4–24. Waiting 4, 0, 2 for P1, P2, P3.", result: "average 2" },
      ],
      answer: "FCFS 14, SJF 2: one long job at the front makes the short ones wait in a convoy.",
      check: "P1 itself waits only 4 under SJF; the long job barely suffers." },
    { type: "lab", lab: "sched" },
    { type: "faded", title: "Your turn", given: "All arrive at 0, in this order: P1 needs 6, P2 needs 3, P3 needs 8.",
      steps: [
        { say: "FCFS waiting times?", blank: true, answer: "0, 6, 9: average 5." },
        { say: "SJF order and waiting times?", blank: true, answer: "P2, P1, P3: waiting P2 0, P1 3, P3 9: average 4." },
      ] },
    { type: "trap", wrong: "Waiting time is the time until a process first starts.", tempting: "With FCFS and SJF they happen to be equal.", whyWrong: "That is response time. Waiting time counts every moment the process is ready but not running; with pre-emption the two differ.", rule: "Waiting = completion − arrival − burst." },
    { type: "trap", wrong: "SJF always pre-empts the running process when a shorter one arrives.", tempting: "It is 'shortest first', so the shortest should run now.", whyWrong: "Plain SJF is non-pre-emptive: it decides only when the CPU becomes free. The pre-emptive version is SRTF.", rule: "SJF decides at completions; SRTF decides at every arrival." },
    { type: "gate", text: "Expect a 2-mark NAT: a table of arrival and burst times and a request for average waiting or turnaround time. Draw the Gantt chart with times, then use completion − arrival − burst. Watch for idle gaps and for ties." },
    { type: "recall", cards: [{ q: "Turnaround time", a: "Completion − arrival" }, { q: "Waiting time", a: "Turnaround − burst" }, { q: "Minimum average waiting (non-pre-emptive)", a: "SJF" }] },
    { type: "check", questions: [
      { id: "k1", kind: "NAT", marks: 2, q: "All arrive at time 0 in the order P1, P2, P3 with bursts 6, 3 and 8. What is the average waiting time under FCFS?", answer: "5", solution: "Waiting 0, 6, 9; (0 + 6 + 9)/3 = 5." },
      { id: "k2", kind: "NAT", marks: 2, q: "Same processes under SJF. Average waiting time?", answer: "4", solution: "Order P2, P1, P3: waiting P2 0, P1 3, P3 9; 12/3 = 4." },
      { id: "k3", kind: "MCQ", marks: 1, q: "The convoy effect is associated with", options: ["Round robin", "FCFS", "SRTF", "Priority with ageing"], answer: "B", solution: "In FCFS a long job at the front delays every short job behind it." },
      { id: "k4", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["Turnaround = completion − arrival", "Waiting = turnaround − burst", "Response time is always equal to waiting time", "FCFS is non-pre-emptive"], answer: "A, B, D", solution: "Response equals waiting only when a process runs in one piece without pre-emption." },
      { id: "k5", kind: "NAT", marks: 1, q: "In the running set under FCFS, what is P3's turnaround time?", answer: "7", solution: "P3 completes at 9 and arrived at 2: 9 − 2 = 7." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "CPU scheduling is one of the most asked OS topics", href: "/topics/operating-systems-os" },
      { label: "Processes and threads", sub: "Ready, running and waiting states", href: "/study/processes" },
      { label: "Greedy algorithms", sub: "SJF is a greedy choice with an exchange-argument proof", href: "/topics/algorithms" },
    ] },
    { type: "links", prereq: ["Process states and the ready queue"], usedIn: ["SRTF and round robin (Topic 2)", "Priority scheduling (Topic 3)"], cross: ["Algorithms: exchange arguments for greedy choices"] },
  ],
};

const preemptive: Topic = {
  id: "cs.os.sched.preemptive",
  title: "Pre-emptive scheduling: SRTF and round robin",
  blocks: [
    { type: "hook", text: "A new one-minute job arrives while a ten-minute job is running. Should it wait nine more minutes? Pre-emptive schedulers say no: they can take the CPU back and give it to someone better." },
    { type: "objectives", items: ["Schedule with shortest remaining time first (SRTF).", "Schedule with round robin for a given time quantum, using the standard queue rule.", "Explain how the quantum affects response time and context switches."] },
    { type: "intuition", paras: ["SRTF is SJF that can interrupt. Whenever a process arrives, compare its burst with what the running process still needs; if the newcomer is shorter, it takes the CPU. SRTF gives the minimum average waiting time of all schedules.", "Round robin gives each ready process a fixed slice of CPU time, the quantum, in turn. A process that still has work after its slice goes to the back of the queue. Nobody waits more than (n − 1) quanta for its next turn, which is good for interactive use.", "The quantum is a balance. Very large, and round robin becomes FCFS. Very small, and the CPU spends much of its time switching instead of working."], analogyLimit: "A queue at a counter cannot interrupt someone halfway; a CPU can, at a cost: every switch saves and restores state." },
    { type: "definition", name: "SRTF and round robin", text: "SRTF (pre-emptive SJF) runs the ready process with the least remaining time and re-decides at every arrival. Round robin runs processes from a FIFO ready queue for at most one quantum each; an unfinished process rejoins the tail.", items: ["SRTF: minimum average waiting time; long jobs can starve; needs remaining-time estimates.", "Round robin: response time bounded by (n − 1) × quantum; average waiting often higher than SJF.", "Standard queue rule (used in GATE answers): a process that arrives during a slice joins the queue before the process whose slice just ended.", "Switch overhead: each switch costs time; small quanta mean many switches."] },
    { type: "deep", sections: [
      { h: "SRTF step by step", paras: ["Advance time in arrival events. At each arrival, compare remaining times and run the smallest. Between arrivals the running process continues. Ties go to the earlier arrival. Response and waiting time now differ: a process can start, be interrupted and wait again."] },
      { h: "The queue rule in round robin", paras: ["Exam answers depend on one convention: when a slice ends at the same moment a new process arrives, the newcomer is queued first and the pre-empted process goes behind it. Write the queue after every slice and you will not slip."] },
      { h: "Choosing the quantum", paras: ["A common rule is that about 80% of CPU bursts should be shorter than the quantum, so most processes finish within one slice. The quantum must also be much larger than the switch time; with a 10 ms quantum and 0.1 ms switch, about 1% of time goes to switching."] },
      { h: "Counting overhead", paras: ["If each switch costs s and the CPU does useful work u in a period, efficiency is u / (u + s × switches). With n processes always ready, quantum q and switch time s, the CPU is useful q / (q + s) of the time."] },
    ] },
    { type: "walkthrough", steps: ["SRTF: at every arrival, compare remaining times; run the smallest; record each block on the chart.", "Round robin: keep the ready queue written out. Take the head, run it for min(quantum, remaining).", "Add arrivals that happened during the slice to the tail, then the pre-empted process if it still has work.", "Repeat until all finish, then compute the table as before."], prompt: { q: "When does round robin behave exactly like FCFS?", a: "When the quantum is at least as long as every burst: each process finishes in its first slice, in arrival order." } },
    { type: "figure", id: "srtf-g", caption: "SRTF on the running set: P2 pre-empts P1 at 1, P3 pre-empts P2 at 2.", alt: "Gantt: P1 0–1, P2 1–2, P3 2–3, P2 3–5, P4 5–7, P1 7–11.", fig: gantt([["P1", 0, 1], ["P2", 1, 2], ["P3", 2, 3], ["P2", 3, 5], ["P4", 5, 7], ["P1", 7, 11]]) },
    { type: "example", id: "px1", level: "gate", title: "SRTF on the running set", given: SET, find: "Average waiting time under SRTF.",
      steps: [
        { say: "0: P1 runs. 1: P2 arrives needing 3, P1 still needs 4: P2 takes over." },
        { say: "2: P3 arrives needing 1 < P2's remaining 2: P3 runs 2–3. 3: P2 (2 left) beats P1 (4): P2 runs 3–5 (P4 arrives at 4 needing 2, not less than P2's 1)." },
        { say: "5: P4 (2) before P1 (4): P4 5–7, P1 7–11." },
        { say: "Waiting = completion − arrival − burst: P1 11 − 0 − 5 = 6, P2 5 − 1 − 3 = 1, P3 3 − 2 − 1 = 0, P4 7 − 4 − 2 = 1.", result: "sum 8" },
      ],
      answer: "Average waiting time 2, the best of all five algorithms on this set.",
      check: "P1, the longest job, waits 6: SRTF helps the many at the cost of the long job." },
    { type: "figure", id: "rr-g", for: "px2", caption: "Round robin, quantum 2, on the running set.", alt: "Gantt: P1 0–2, P2 2–4, P3 4–5, P1 5–7, P4 7–9, P2 9–10, P1 10–11.", fig: gantt([["P1", 0, 2], ["P2", 2, 4], ["P3", 4, 5], ["P1", 5, 7], ["P4", 7, 9], ["P2", 9, 10], ["P1", 10, 11]]) },
    { type: "example", id: "px2", level: "gate", title: "Round robin with quantum 2", given: SET, find: "The schedule, average waiting time and number of switches.",
      steps: [
        { say: "P1 runs 0–2. P2 (1) and P3 (2) arrived during or at the end of the slice and join first: queue P2, P3, P1." },
        { say: "P2 2–4 (1 left). P4 arrives at 4: queue P3, P1, P4, P2." },
        { say: "P3 4–5 (done). P1 5–7 (1 left): queue P4, P2, P1. P4 7–9 (done), P2 9–10 (done), P1 10–11 (done)." },
        { say: "Waiting: P1 11 − 0 − 5 = 6, P2 10 − 1 − 3 = 6, P3 5 − 2 − 1 = 2, P4 9 − 4 − 2 = 3.", result: "sum 17" },
      ],
      answer: "Average waiting time 4.25, with 6 switches between processes.",
      check: "Round robin's average is worse than SRTF here, but no process waited more than 3 quanta for a turn." },
    { type: "example", id: "px3", level: "edge", title: "A bigger quantum", given: "A arrives at 0 needing 5, B at 0 needing 3. Round robin with quantum 3.", find: "The schedule and average waiting time.",
      steps: [
        { say: "A runs 0–3 (2 left), B runs 3–6 (done), A runs 6–8 (done)." },
        { say: "Waiting: A 8 − 5 = 3, B 6 − 3 = 3.", result: "average 3" },
      ],
      answer: "Average waiting time 3, with 2 switches.",
      check: "With quantum 5 it would be FCFS: A 0–5, B 5–8, average waiting 2.5." },
    { type: "lab", lab: "rr" },
    { type: "faded", title: "Your turn", given: "Round robin, quantum 2: X arrives at 0 needing 3, Y at 0 needing 2.",
      steps: [
        { say: "Schedule?", blank: true, answer: "X 0–2, Y 2–4, X 4–5." },
        { say: "Average waiting time?", blank: true, answer: "X: 5 − 3 = 2, Y: 4 − 2 = 2. Average 2." },
      ] },
    { type: "trap", wrong: "In round robin the pre-empted process goes back in front of a process that arrived at the same moment.", tempting: "It was already in the system longer.", whyWrong: "The standard rule queues the newly arrived process first, then the pre-empted one. Answers differ if you swap them.", rule: "Arrivals join the queue before the process whose slice just ended." },
    { type: "trap", wrong: "A smaller quantum always makes round robin better.", tempting: "Smaller slices mean faster response.", whyWrong: "Each switch costs time; with tiny slices the CPU spends a large share switching.", rule: "Quantum ≫ switch time, and larger than most bursts." },
    { type: "gate", text: "GATE favourites: SRTF average waiting time with staggered arrivals, round robin with a given quantum (often counting context switches), and statements about quantum size. Write the queue after every slice." },
    { type: "recall", cards: [{ q: "Minimum average waiting of all schedules", a: "SRTF" }, { q: "RR with a huge quantum", a: "Becomes FCFS" }, { q: "RR queue rule", a: "New arrivals before the pre-empted process" }] },
    { type: "check", questions: [
      { id: "m1", kind: "NAT", marks: 2, q: "In the running set under SRTF, what is the average turnaround time?", answer: "4.75", solution: "Turnaround: P1 11, P2 4, P3 1, P4 3; 19/4 = 4.75." },
      { id: "m2", kind: "NAT", marks: 2, q: "Round robin with quantum 2 on the running set: how many context switches between different processes occur (not counting the first dispatch)?", answer: "6", solution: "Order P1, P2, P3, P1, P4, P2, P1: six changes." },
      { id: "m3", kind: "NAT", marks: 1, q: "A arrives at 0 needing 5 and B at 0 needing 3. Round robin with quantum 3: average waiting time?", answer: "3", solution: "A 0–3, B 3–6, A 6–8: waiting A 3, B 3." },
      { id: "m4", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["SRTF can starve long processes", "Round robin with a very large quantum behaves like FCFS", "Round robin always gives lower average waiting than SJF", "A very small quantum increases switching overhead"], answer: "A, B, D", solution: "Round robin usually has higher average waiting than SJF; it trades that for fair, quick response." },
      { id: "m5", kind: "NAT", marks: 1, q: "With the quantum equal to 10 ms and each switch costing 0.5 ms, and processes always ready, what percentage of CPU time does useful work? (Give the number, rounded to one decimal place.)", answer: "95.2", solution: "10 / (10 + 0.5) = 0.952…, about 95.2%." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "SRTF and round robin tables", href: "/topics/operating-systems-os" },
      { label: "Topic 1: FCFS and SJF", sub: "The non-pre-emptive versions", href: "/study/scheduling" },
      { label: "Queues in Data Structures", sub: "The ready queue is a FIFO queue", href: "/topics/data-structures" },
    ] },
    { type: "links", prereq: ["Topic 1: measures, FCFS and SJF"], usedIn: ["Multilevel feedback queues (Topic 3)"], cross: ["Data Structures: queues"] },
  ],
};

const priority: Topic = {
  id: "cs.os.sched.priority",
  title: "Priority scheduling and multilevel queues",
  blocks: [
    { type: "hook", text: "An exam-paper printing job and a student's holiday photos should not be treated alike. Priority scheduling lets the system say which work matters more, and multilevel queues let it treat whole classes of work differently." },
    { type: "objectives", items: ["Schedule with non-pre-emptive priority (1 = highest in this course).", "Explain starvation under priority scheduling and how ageing fixes it.", "Describe multilevel queue and multilevel feedback queue scheduling."] },
    { type: "intuition", paras: ["Each process gets a priority number. When the CPU is free, the ready process with the best priority runs. SJF is a special case where the priority is the burst length.", "The danger is starvation: a low-priority process may never run if better ones keep arriving. Ageing raises the priority of a process the longer it waits, so it eventually gets its turn.", "Real systems mix policies. A multilevel queue keeps separate queues (for example, interactive and batch) each with its own algorithm. A multilevel feedback queue lets processes move: one that uses its whole slice drops to a lower queue; one that waits long rises."], analogyLimit: "Priorities in a hospital follow a fixed medical rule; in an operating system they may be set by users, by the kind of process, or adjusted automatically." },
    { type: "definition", name: "Priority and multilevel feedback queues", text: "Priority scheduling runs the ready process with the highest priority (here, the smallest number). A multilevel feedback queue (MLFQ) has several queues of different priority and quantum; processes move between them according to how they use the CPU.", items: ["Non-pre-emptive priority: decide only when the CPU is free. Pre-emptive: a newly arrived higher-priority process takes the CPU.", "Starvation is possible; ageing prevents it.", "MLFQ example: Q0 round robin q = 8, Q1 round robin q = 16, Q2 FCFS. New jobs enter Q0; a job that uses its full slice moves down.", "MLFQ favours short, interactive jobs without knowing burst lengths in advance."] },
    { type: "deep", sections: [
      { h: "Where priorities come from", paras: ["Internally: memory needs, number of open files, the ratio of I/O to CPU bursts. Externally: importance set by an administrator, payment, the department that owns the job. Some systems use larger numbers for higher priority; always read which way a question counts."] },
      { h: "Multilevel queues", paras: ["Processes are permanently assigned to a queue by type: system, interactive, batch. Queues are scheduled against each other either by fixed priority (a lower queue runs only when higher ones are empty) or by time slices between queues (for example 80% to interactive, 20% to batch)."] },
      { h: "Multilevel feedback queues in action", paras: ["A CPU-heavy job sinks: with Q0 q = 8 and Q1 q = 16, a job needing 30 units runs 8 in Q0, 16 in Q1, and the last 6 in Q2. An interactive job that gives up the CPU early stays in the top queue and gets fast response."] },
      { h: "Many processors", paras: ["With several CPUs, each may keep its own ready queue. Processor affinity keeps a process on the CPU whose cache already holds its data; load balancing moves processes from busy CPUs to idle ones. The two goals pull against each other."] },
    ] },
    { type: "walkthrough", steps: ["Read whether a smaller or larger number means higher priority, and whether the scheme is pre-emptive.", "When the CPU is free, pick the ready process with the best priority; ties by arrival.", "For pre-emptive priority, re-decide at every arrival.", "For MLFQ, follow each job through the queues: subtract each queue's quantum until the job finishes."], prompt: { q: "How is SJF a kind of priority scheduling?", a: "Take each process's priority to be its (predicted) burst length, smaller is better. Then priority scheduling picks the shortest job." } },
    { type: "figure", id: "prio-g", caption: "Non-pre-emptive priority on the running set (P2 = 1 is highest, then P4 = 2, P1 = 3, P3 = 4).", alt: "Gantt: P1 0–5, P2 5–8, P4 8–10, P3 10–11.", fig: gantt([["P1", 0, 5], ["P2", 5, 8], ["P4", 8, 10], ["P3", 10, 11]]) },
    { type: "example", id: "qx1", level: "gate", title: "Non-pre-emptive priority", given: `${SET} Priorities: P1 3, P2 1, P3 4, P4 2 (1 = highest).`, find: "Average waiting time.",
      steps: [
        { say: "At 0 only P1 is ready: it runs 0–5 (no pre-emption, even though P2 arrives at 1)." },
        { say: "At 5, ready: P2 (1), P3 (4), P4 (2). Best first: P2 5–8, P4 8–10, P3 10–11." },
        { say: "Waiting = completion − arrival − burst: P1 0, P2 8 − 1 − 3 = 4, P3 11 − 2 − 1 = 8, P4 10 − 4 − 2 = 4.", result: "sum 16" },
      ],
      answer: "Average waiting time 4. P3, the lowest priority, waits the longest (8).",
      check: "Had more high-priority jobs kept arriving, P3 could have waited for ever: that is starvation." },
    { type: "figure", id: "mlfq", for: "qx2", caption: "A job needing 30 units sinks through three queues.", alt: "Q0 runs 8, Q1 runs 16, Q2 runs the last 6.", fig: { kind: "strip", items: [{ label: "Q0 (q = 8)", sub: "runs 8, 22 left", state: "done" }, { label: "Q1 (q = 16)", sub: "runs 16, 6 left", state: "done" }, { label: "Q2 (FCFS)", sub: "runs 6, done", state: "now" }] } },
    { type: "example", id: "qx2", level: "edge", title: "Following a job through MLFQ", given: "Q0: round robin q = 8. Q1: round robin q = 16. Q2: FCFS. A job needing 30 units arrives alone.", find: "How much does it run in each queue, and when does it finish?",
      steps: [
        { say: "It uses its whole 8 in Q0: 22 left, moves to Q1." },
        { say: "It uses its whole 16 in Q1: 6 left, moves to Q2." },
        { say: "It runs its last 6 in Q2 (FCFS).", result: "finishes at 30" },
      ],
      answer: "8 units in Q0, 16 in Q1, 6 in Q2; it finishes at time 30 (alone, it never waits).",
      check: "A job needing 5 units would finish in Q0 and never move down: short jobs stay at high priority." },
    { type: "example", id: "qx3", level: "gate", title: "Ageing in numbers", given: "Smaller number = higher priority. A job starts at priority 20; its priority number drops by 1 every 15 minutes it waits. New jobs keep arriving at priority 4.", find: "After how long does the waiting job first beat the newcomers?",
      steps: [
        { say: "It must reach a number below 4, that is 3.", result: "from 20 to 3" },
        { say: "That is 17 steps of 15 minutes.", result: "255 minutes" },
      ],
      answer: "After 255 minutes (4 hours 15 minutes) it outranks the newcomers.",
      check: "At 240 minutes it reaches 4 and only ties; one more step makes it strictly better." },
    { type: "lab", lab: "sched-prio" },
    { type: "faded", title: "Your turn", given: "All arrive at 0. Bursts and priorities (1 = highest): A burst 4 priority 2, B burst 2 priority 1, C burst 3 priority 3.",
      steps: [
        { say: "Order?", blank: true, answer: "B, A, C." },
        { say: "Average waiting time?", blank: true, answer: "B 0, A 2, C 6: average 8/3 ≈ 2.67." },
      ] },
    { type: "trap", wrong: "A bigger priority number always means more important.", tempting: "Bigger often sounds better.", whyWrong: "Conventions differ: many systems (and many GATE questions) use smaller numbers for higher priority.", rule: "Read the question's convention every time." },
    { type: "trap", wrong: "Pre-emption fixes starvation in priority scheduling.", tempting: "Pre-emption seems to make scheduling fairer.", whyWrong: "Pre-emptive priority still always favours the highest priority, so low-priority jobs can still starve. Ageing fixes starvation.", rule: "Starvation fix: ageing, not pre-emption." },
    { type: "gate", text: "GATE asks priority scheduling tables (check the number convention and pre-emption), statements about starvation and ageing, and MLFQ behaviour such as which queue a job ends in." },
    { type: "recall", cards: [{ q: "Starvation fix in priority scheduling", a: "Ageing" }, { q: "MLFQ: a job uses its whole slice", a: "It moves down a queue" }, { q: "SJF as priority", a: "Priority = burst length" }] },
    { type: "check", questions: [
      { id: "r1", kind: "NAT", marks: 1, q: "In the priority example (non-pre-emptive), what is P3's waiting time?", answer: "8", solution: "P3 runs 10–11; 11 − 2 − 1 = 8." },
      { id: "r2", kind: "MCQ", marks: 1, q: "Which technique prevents starvation in priority scheduling?", options: ["Making the scheduler pre-emptive", "Ageing", "A larger quantum", "Spooling"], answer: "B", solution: "Ageing raises a waiting process's priority over time." },
      { id: "r3", kind: "MSQ", marks: 2, q: "In a multilevel feedback queue, which are typical?", options: ["New jobs start in the highest-priority queue", "A job that uses its full quantum moves to a lower queue", "Jobs never move between queues", "Short interactive jobs tend to stay in higher queues"], answer: "A, B, D", solution: "Movement between queues is what makes it a feedback queue." },
      { id: "r4", kind: "NAT", marks: 2, q: "MLFQ with Q0 q = 4, Q1 q = 8, Q2 FCFS. A job needing 20 units arrives alone. How many units does it run in Q2?", answer: "8", solution: "4 in Q0, 8 in Q1, leaving 20 − 12 = 8 for Q2." },
      { id: "r5", kind: "NAT", marks: 2, q: "All arrive at 0. A burst 4 priority 2, B burst 2 priority 1, C burst 3 priority 3 (1 = highest), non-pre-emptive. Average turnaround time? (Two decimal places.)", answer: "5.67", solution: "B 0–2, A 2–6, C 6–9: turnaround 2, 6, 9; 17/3 ≈ 5.67." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Operating Systems", sub: "Priority and multilevel queue questions", href: "/topics/operating-systems-os" },
      { label: "Deadlock vs starvation", sub: "Ageing in more depth", href: "/study/deadlock" },
      { label: "Heaps in Data Structures", sub: "Priority queues behind the scheduler", href: "/topics/data-structures" },
    ] },
    { type: "links", prereq: ["Topics 1 and 2"], usedIn: ["Real OS schedulers"], cross: ["Data Structures: priority queues (heaps)"] },
  ],
};

export const OS_SCHEDULING: Chapter = {
  id: "cs.os.scheduling",
  subject: "Operating System",
  title: "CPU scheduling",
  syllabus: ["CS · Operating System: CPU and I/O scheduling"],
  pyqTopic: /scheduling/i,
  map: { kind: "strip", items: [
    { label: "1. Measures, FCFS, SJF", sub: "Gantt charts and the convoy effect", state: "done" },
    { label: "2. SRTF and round robin", sub: "pre-emption and the quantum", state: "done" },
    { label: "3. Priority and MLFQ", sub: "starvation and ageing", state: "done" },
    { label: "4. HRRN and LJF", sub: "response ratio", state: "done" },
    { label: "5. Multilevel queues", sub: "feedback queues", state: "done" },
  ] },
  topics: [basics, preemptive, priority, OS_HRRN, OS_MLFQ],
};
