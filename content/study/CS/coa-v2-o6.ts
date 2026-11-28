import type { Topic } from "@/lib/study/schema";

/**
 * Computer Organisation chapter O6 "I/O: polling, interrupts and DMA" (29 Nov 2026). The I/O interface and ports, programmed I/O and polling, interrupt-driven I/O (the steps of an interrupt, vectored and
 * non-vectored, priorities and daisy chaining), and direct memory access (burst, cycle stealing). Real GATE questions (texts from public/data/questions.json), each re-solved here, nine in all:
 * 2026 AN Q18 (C), 2025 FN Q11 (A), 2024 FN Q33 (C), 2024 AN Q24 (2,560,000), 2023 FN Q34 (10.2), 2022 FN Q17 (A), 2021 AN Q11 (80,000), 2020 FN Q33 (C), 2018 FN Q19 (A).
 * Programs compiled and run with gcc: the polling against interrupt time ratio; the cycle-stealing data rates.
 */
export const chapterO6: Topic = {
  id: "cs.coa.v2.io6",
  title: "I/O: polling, interrupts and DMA",
  no: "O6",
  book: [
    { t: "p", text: "A computer is useless without a way to talk to the world: a keyboard, a disk, a network card. These **devices** are slow, they run on their own timing, and they deliver data when they are ready, not when the program asks. The **I/O interface** is the hardware and the protocol that hides those differences from the processor. There are three ways for the processor to handle a device, and the whole chapter is the comparison of them: **polling**, **interrupts** and **direct memory access (DMA)**." },
    { t: "p", text: "Nine real GATE questions come from this chapter. Four of them are statements to judge true or false, two ask for the order of the steps of an interrupt, and three are small calculations of how much processor time a device takes. Each type is solved below." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["describe how the processor addresses a device (memory-mapped and isolated I/O);", "compare polling, interrupt-driven I/O and DMA by CPU cost and throughput;", "list the steps of an interrupt in order;", "tell vectored from non-vectored interrupts, and explain daisy chaining and priorities;", "describe DMA transfer modes and compute a DMA data rate and its processor cost;", "compute the time fraction used by polling and by interrupt service."] },

    { t: "h2", text: "The I/O interface" },
    { t: "p", text: "A device has a **controller** with a few registers: a **status** register (is the device ready, did an error occur), a **control** register (start, stop) and a **data** register (the byte being transferred). The processor reads and writes these registers like memory, and the registers are called **ports**." },
    { t: "p", text: "There are two ways to give ports their addresses. In **memory-mapped I/O** the ports share the address space with memory: an ordinary load or store instruction reaches a device, and no special instructions are needed, but some memory addresses are used up. In **isolated** (port-mapped) I/O the ports have a separate address space and special IN and OUT instructions reach them; the memory addresses are not used up, but the instruction set needs the extra instructions." },
    { t: "p", text: "Transfers can be **synchronous** (tied to a clock) or **asynchronous** (a handshake: the sender says 'data ready', the receiver says 'data taken'). A device that is slow compared with the processor needs the handshake, or needs the processor to wait." },

    { t: "h2", text: "Programmed I/O and polling" },
    { t: "p", text: "In **programmed I/O** the processor does everything. It sits in a loop reading the device's status register until the device says ready (**polling**), then reads the data register, then goes back to polling. The program is simple and the hardware is minimal. The cost is that the processor is **busy waiting**: it spends cycles checking a device that is usually not ready, and it can do nothing else meanwhile, or it has to interleave the checks with its other work." },
    { t: "p", text: "A common refinement is to poll at **regular intervals** instead of continuously. Suppose a keyboard is used at 1 keystroke per second, and the system polls every 10 ms. Each poll costs a little time, and a poll that finds a key costs more. The processor now does useful work between polls, but the keystroke can wait up to 10 ms before it is noticed, and the polls still cost time when no key is pressed." },
    { t: "p", text: "GATE 2023 puts numbers on this. The keyboard is polled every 10 ms (100 polls per second), each poll takes 100 µs, and a poll that finds a key needs 200 µs more to process it; there is one keystroke per second. The time per second spent in polling and processing is 100 × 100 µs + 200 µs = 10 000 µs + 200 µs = 10.2 ms, so T₁ = 0.0102. With interrupts, the whole service takes 1 ms for the one keystroke, so T₂ = 0.001. The ratio T₁ ÷ T₂ is **10.2**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    double polls = 100, poll_us = 100, process_us = 200;   /* every 10 ms for one second */
    double t1 = (polls * poll_us + process_us) / 1e6;      /* seconds per second in polling mode */
    double t2 = 1000.0 / 1e6;                              /* one interrupt of 1 ms per keystroke */
    printf("%.1f\\n", t1 / t2);
    return 0;
}`, out: "10.2", file: "polling_ratio.c" },
    { t: "ex", id: "o6-e1" },

    { t: "h2", text: "Interrupt-driven I/O" },
    { t: "p", text: "With **interrupts** the processor does not wait. It starts the device and goes on with other work; when the device is ready it sends an **interrupt request** signal on a wire to the processor. The processor stops what it is doing, runs a small program called the **interrupt service routine** (ISR) that handles the device, and then resumes the interrupted program. Nothing is wasted while the device is idle, and the cost of a keystroke is just the ISR." },
    { t: "p", text: "The processor checks for interrupts **between instructions**, not in the middle of one, so that the interrupted program can be resumed cleanly. The steps are always in the same order. **First the processor finishes the current instruction.** Then it **saves the program counter** (and the status) so that it can return, usually by pushing it on the control stack. Then it **loads the program counter with the address of the ISR**, and the ISR runs. At the end the saved state is **popped** and the program resumes." },
    { t: "fig", id: "o6-f1" },
    { t: "p", text: "GATE 2025 asks for the order of three steps: save the PC, load the PC with the ISR address, finish the current instruction. The order is finish, save, load: **(iii), (i), (ii)**. GATE 2018 extends the list to five events, P (push the status of L), Q (finish the current instruction), R (execute the ISR), S (pop the status), T (load the new PC value). The order is Q, P, T, R, S: **option A**." },
    { t: "ex", id: "o6-e2" },
    { t: "ex", id: "o6-e3" },
    { t: "p", text: "How does the processor know **which device** interrupted, and which ISR to run? In a **non-vectored** interrupt the processor goes to one fixed address, and the ISR there has to find the source, usually by **polling** the devices' status registers, which takes time. In a **vectored** interrupt the device (or the interrupt controller) supplies a **vector**, a number that selects an entry of a table of ISR addresses, so the processor jumps straight to the right routine. Vectored interrupts therefore **start the ISR faster**." },
    { t: "p", text: "When several devices interrupt at once, a **priority** rule decides. In **daisy chaining** the devices are connected in a line, and the interrupt-acknowledge signal travels along the chain from the processor: the first device that has a request takes it and stops the signal. A device nearer the processor therefore has a higher priority. Daisy chaining is a way to **assign priorities**; the processor does **not** poll the devices one by one, because the acknowledge signal finds the requester by itself. An **interrupt mask** can disable lower-priority requests while a high-priority ISR runs." },
    { t: "p", text: "GATE 2026 gives two statements. S1: in non-vectored interrupts it usually takes more time to start the ISR than in vectored ones: **true**. S2: in daisy chaining the CPU polls all the input devices individually to find the source: **false**. The option is **C**. GATE 2020 gives four: I (daisy chaining assigns priorities) is true; II (with a vectored interrupt the CPU does polling to find the source) is false, since the vector gives the source; III (in polling the CPU periodically checks status bits) is true; IV (during DMA both CPU and DMA controller are bus masters at the same time) is false, since only one can be. The answer is **I and III (C)**." },
    { t: "ex", id: "o6-e4" },
    { t: "ex", id: "o6-e5" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Direct memory access" },
    { t: "p", text: "Interrupts are good for a keyboard, but a disk delivers a block of thousands of bytes, and an interrupt per byte would swamp the processor. **DMA** moves the data without the processor. A **DMA controller** is a small processor of its own that can read and write the memory. The CPU programs it with the memory address, the number of bytes and the direction, and then goes on with other work; the DMA controller moves the whole block and raises **one interrupt at the end**." },
    { t: "p", text: "The DMA controller needs the bus, which the CPU also uses, so one of them must be the **bus master** at a time; during a DMA cycle the CPU is not. There are three modes. In **burst** (block) mode the controller takes the bus and moves the whole block at once: the highest throughput, but the CPU is locked out of the memory for the whole burst. In **cycle stealing** mode the controller takes the bus for one cycle at a time, **one word per stolen cycle**, between CPU cycles: lower throughput, but the CPU is slowed only slightly. In **transparent** mode the controller uses the bus only when the CPU does not." },
    { t: "p", text: "For **bulk data from a disk** DMA has the highest throughput, so GATE 2022's answer is **DMA-based I/O (A)**. GATE 2024 asks which statement is false: cycle stealing moves one word per stolen cycle (true); burst mode has higher throughput than cycle stealing for bulk data (true); **programmed I/O has better CPU utilisation than interrupt-driven I/O** (false: polling wastes the CPU, interrupts do not); vectored interrupts start the ISR faster than non-vectored ones (true). The false one is **C**." },
    { t: "table", head: ["", "Programmed I/O (polling)", "Interrupt-driven", "DMA"], rows: [
      ["Who moves the data", "CPU", "CPU, in the ISR", "DMA controller"], ["CPU while the device is slow", "busy waiting", "free for other work", "free for other work"],
      ["CPU cost per word", "high", "medium (one interrupt per word)", "very low (one interrupt per block)"], ["Best for", "very simple or very fast devices", "slow devices, such as a keyboard", "bulk transfers, such as a disk"],
    ], caption: "The three ways to handle a device." },
    { t: "fig", id: "o6-f2" },
    { t: "p", text: "The processor cost of DMA in cycle stealing mode is easy to count. If the DMA module transfers a word every so often and uses a fraction f of the processor cycles, the cycles per second it uses are f × (clock rate), and each stolen cycle moves one word. The **data rate** is therefore f × clock × (bits per cycle)." },
    { t: "p", text: "GATE 2024: a 4 MHz processor and a DMA controller that moves 8 bytes (64 bits) in one stolen cycle, using 1% of the cycles: 0.01 × 4 × 10⁶ = 40 000 stolen cycles per second, so the rate is 40 000 × 64 = **2 560 000 bits per second** (option C). GATE 2021: a 2 MHz processor, one 8-bit character per stolen cycle, 0.5% of the cycles: 0.005 × 2 × 10⁶ = 10 000 cycles, so 10 000 × 8 = **80 000 bits per second**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    double r24 = 0.01 * 4e6 * 64;          /* GATE 2024 AN Q24: 1% of 4 MHz, 64 bits per cycle */
    double r21 = 0.005 * 2e6 * 8;          /* GATE 2021 AN Q11: 0.5% of 2 MHz, 8 bits per cycle */
    printf("%.0f %.0f\\n", r24, r21);
    return 0;
}`, out: "2560000 80000", file: "dma_rate.c" },
    { t: "ex", id: "o6-e6" },
    { t: "ex", id: "o6-e7" },

    { t: "h2", text: "Choosing a method, and who owns the bus" },
    { t: "p", text: "The choice follows the device. A fast, steady device that is always ready (some sensors) can be polled cheaply. A slow or irregular one (keyboard, mouse) wastes polling time and suits interrupts. A device that moves large blocks (disk, network card, display) suits DMA. Real systems mix them: the disk uses DMA for the data and an interrupt to say it is done." },
    { t: "p", text: "Whenever more than one unit can drive the bus (the CPU and a DMA controller, or several DMA controllers) a rule is needed to say who goes next: **bus arbitration**. It can be **centralised** (one arbiter grants the bus, by daisy chaining the grant signal or by a priority encoder) or **distributed** (the units compete among themselves). The same ideas as interrupt priority appear again, which is why daisy chaining shows up in both." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Ports: memory-mapped I/O uses ordinary loads and stores; isolated I/O has separate IN and OUT instructions.", "Polling: the CPU checks the status register; it wastes cycles. Fraction of time = polls per second × poll time + processing time.", "Interrupt order: finish the instruction, save the PC (and status), load the ISR address, run the ISR, restore.", "Vectored: the device supplies the vector, so the ISR starts faster. Non-vectored: the ISR must find the source.", "Daisy chain: a priority scheme where the acknowledge signal passes down the chain; the CPU does not poll each device.", "DMA: highest throughput for bulk data; one interrupt per block; burst locks the bus, cycle stealing takes one word per stolen cycle; only one bus master at a time.", "DMA rate = fraction of cycles × clock × bits per stolen cycle."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "o6-f1", caption: "What the processor does when an interrupt arrives, in order. The saved PC is how the interrupted program is resumed.", alt: "A table that lists the six steps of an interrupt in order.", fig: { kind: "trace", title: "The steps of an interrupt", cols: ["step", "what happens"], rows: [
      { cells: [1, "device raises the request; the CPU finishes the current instruction"] }, { cells: [2, "the CPU saves the PC and the status (pushes them on the control stack)"] }, { cells: [3, "the CPU loads the PC with the address of the ISR (from the vector, if vectored)"] }, { cells: [4, "the ISR runs and serves the device"] }, { cells: [5, "the CPU pops the saved status and PC"], tone: "ok" }, { cells: [6, "the interrupted program resumes"], tone: "ok" },
    ] } },
    { type: "figure", id: "o6-f2", caption: "The processor time spent in the keyboard example of GATE 2023: polling costs 10.2 ms of every second, an interrupt costs 1 ms. The ratio is 10.2.", alt: "A table that compares the processor time per second for polling and for interrupts.", fig: { kind: "trace", title: "Time per second spent on a keyboard", cols: ["method", "work per second", "time (ms)"], rows: [
      { cells: ["polling", "100 polls × 100 µs + 200 µs to process", "10.2"] }, { cells: ["interrupt", "one service of 1 ms", "1.0"], tone: "ok" }, { cells: ["ratio", "10.2 ÷ 1.0", "10.2"] },
    ] } },

    { type: "example", id: "o6-e1", level: "gate", title: "GATE CS 2023 (forenoon), Q34 · 1 mark · polling against interrupts", file: "gate2023_fn_q34.txt", given: `A keyboard is used at 1 keystroke per second. The system polls every 10 ms, each poll 100 µs; if a key is found, 200 µs more are used. With interrupts, one keystroke takes 1 ms in all. T1 is the fraction of a second in polling and processing; T2 the fraction with interrupts. T1 ÷ T2?`, find: "The ratio.", steps: [
      { say: "Polls per second: 1000 ms ÷ 10 ms = 100; time 100 × 100 µs = 10 ms; plus 0.2 ms.", result: "T₁ = 10.2 ms per second" },
      { say: "T₂ = 1 ms per second.", result: "1 ms" },
      { say: "T₁ ÷ T₂.", result: "10.2" },
    ], answer: "10.2", check: "The program in this chapter prints 10.2." },
    { type: "example", id: "o6-e2", level: "gate", title: "GATE CS 2025 (forenoon), Q11 · 1 mark · the first steps of an interrupt", file: "gate2025_fn_q11.txt", given: `On the arrival of an interrupt: (i) the processor saves the PC; (ii) the PC is loaded with the start address of the ISR; (iii) the processor finishes the present instruction. Which sequence is correct?
A) (iii), (i), (ii)   B) (i), (iii), (ii)   C) (i), (ii), (iii)   D) (iii), (ii), (i)`, find: "The order.", steps: [
      { say: "The current instruction is finished before anything else.", result: "(iii)" },
      { say: "The PC is saved before it is overwritten.", result: "(i)" },
      { say: "Only then is the ISR address loaded.", result: "(ii)" },
    ], answer: "A", check: "Saving after loading would lose the return address." },
    { type: "example", id: "o6-e3", level: "gate", title: "GATE CS 2018 (forenoon), Q19 · 1 mark · five events of an interrupt", file: "gate2018_fn_q19.txt", given: `Events after a device issues an interrupt while process L runs: (P) push the status of L on the control stack; (Q) finish the current instruction; (R) execute the ISR; (S) pop the status of L; (T) load the new PC value. The correct order?
A) QPTRS   B) PTRSQ   C) TRPQS   D) QTPRS`, find: "The order.", steps: [
      { say: "Finish the instruction (Q), push the status (P), load the new PC (T), run the ISR (R), pop the status (S).", result: "Q P T R S" },
    ], answer: "A", check: "Option D loads the new PC before pushing the status." },
    { type: "example", id: "o6-e4", level: "gate", title: "GATE CS 2026 (afternoon), Q18 · 1 mark · vectored interrupts and daisy chaining", file: "gate2026_an_q18.txt", given: `S1: non-vectored interrupts usually take more time to start the ISR than vectored ones. S2: in daisy chaining the CPU polls all the input devices individually to find the source.
A) both true   B) both false   C) S1 true, S2 false   D) S1 false, S2 true`, find: "The correct option.", steps: [
      { say: "Non-vectored: the ISR must first find the source. Vectored: the vector gives the address.", result: "S1 true" },
      { say: "In a daisy chain the acknowledge signal reaches the requesting device; no polling by the CPU.", result: "S2 false" },
    ], answer: "C", check: "Daisy chaining is a priority scheme." },
    { type: "example", id: "o6-e5", level: "gate", title: "GATE CS 2020 (forenoon), Q33 · 1 mark · four statements on interrupts, polling and DMA", file: "gate2020_fn_q33.txt", given: `I. Daisy chaining is used to assign priorities in attending interrupts. II. When a device raises a vectored interrupt, the CPU does polling to identify the source. III. In polling, the CPU periodically checks status bits to know if any device needs attention. IV. During DMA, both the CPU and the DMA controller can be bus masters at the same time.
A) I and II only   B) I and IV only   C) I and III only   D) III only`, find: "The true statements.", steps: [
      { say: "I is true (priority by position in the chain); III is the definition of polling.", result: "I, III true" },
      { say: "II: the vector identifies the source, no polling. IV: only one bus master at a time.", result: "II, IV false" },
    ], answer: "C", check: "A vectored interrupt carries its own identification." },
    { type: "example", id: "o6-e6", level: "gate", title: "GATE CS 2024 (afternoon), Q24 and 2021 (afternoon), Q11 · DMA data rate by cycle stealing", file: "gate2024_an_q24.txt", given: `2024: a 4 MHz processor; the DMA controller moves 8 bytes per cycle by cycle stealing and uses 1% of the processor cycles. The data rate in bits per second? 2021: a 2 MHz processor; one 8-bit character per stolen cycle; 0.5% of the cycles. The data rate?`, find: "The two data rates.", steps: [
      { say: "2024: stolen cycles = 0.01 × 4 × 10⁶ = 40 000 per second; each moves 64 bits.", result: "2 560 000" },
      { say: "2021: 0.005 × 2 × 10⁶ = 10 000 cycles; each moves 8 bits.", result: "80 000" },
    ], answer: "2,560,000 (option C); 80,000", check: "The program prints 2560000 80000." },
    { type: "example", id: "o6-e7", level: "gate", title: "GATE CS 2022 (forenoon), Q17 and 2024 (forenoon), Q33 · the best method and a false statement", file: "gate2022_fn_q17.txt", given: `2022: which facilitates transfer of bulk data from hard disk to main memory with the highest throughput? A) DMA based I/O  B) interrupt-driven I/O  C) polling-based I/O  D) programmed I/O. 2024: which is FALSE? A) in cycle stealing one word is moved in a stolen cycle  B) burst mode has higher throughput than cycle stealing for bulk data  C) programmed I/O has better CPU utilisation than interrupt-driven I/O  D) the CPU starts an ISR faster with vectored interrupts.`, find: "The two answers.", steps: [
      { say: "Bulk data: the DMA controller moves it without the CPU.", result: "2022: A" },
      { say: "Programmed I/O keeps the CPU busy waiting, so its utilisation is worse, not better.", result: "2024: C is false" },
    ], answer: "A; C", check: "A, B and D of 2024 are the standard facts of this chapter." },

    { type: "trap", wrong: "Daisy chaining means the CPU polls the devices one by one.", tempting: "The word 'chain' suggests a sequence of checks.", whyWrong: "In a daisy chain the interrupt-acknowledge signal passes from device to device, and the first requesting device takes it and stops it. No software loop checks them, and the position in the chain sets the priority. Polling is a separate technique in which software reads status registers.", rule: "Daisy chain = hardware priority; polling = software search.", ex: { text: "GATE 2026 S2 (the CPU polls all devices in a daisy chain) is false." } },

    { type: "gate", text: "Real GATE questions solved in this chapter, nine of them: 2026 AN Q18 · 2025 FN Q11 · 2024 FN Q33 · 2024 AN Q24 · 2023 FN Q34 · 2022 FN Q17 · 2021 AN Q11 · 2020 FN Q33 · 2018 FN Q19. Interrupt order: finish, save, load, run, restore." },
    { type: "recall", cards: [
      { q: "Memory-mapped against isolated I/O?", a: "Memory-mapped: ports in the memory address space, ordinary loads and stores. Isolated: separate space, IN and OUT." },
      { q: "What is polling?", a: "The CPU repeatedly reads the device status register." },
      { q: "Order of an interrupt?", a: "Finish the instruction, save PC, load the ISR address, run, restore." },
      { q: "Vectored interrupt?", a: "The device supplies a vector that selects the ISR, so the ISR starts faster." },
      { q: "Daisy chaining?", a: "Hardware priority: the acknowledge signal passes down the chain." },
      { q: "DMA does what?", a: "Moves blocks between device and memory without the CPU; one interrupt at the end." },
      { q: "Burst against cycle stealing?", a: "Burst takes the bus for the whole block; cycle stealing takes it one word at a time." },
      { q: "DMA rate by cycle stealing?", a: "Fraction of cycles × clock × bits per cycle." },
    ] },
    { type: "check", questions: [
      { id: "o6c1", kind: "NAT", marks: 1, q: "A 1 MHz processor gives 2% of its cycles to DMA cycle stealing, 16 bits per stolen cycle. The data rate in kilobits per second is", answer: "320", solution: "0.02 × 10⁶ = 20 000 cycles × 16 bits = 320 000 bits/s." },
      { id: "o6c2", kind: "MCQ", marks: 1, q: "Which method gives the highest throughput for a disk?", options: ["Polling", "Interrupt per byte", "DMA", "Programmed I/O"], answer: "C", solution: "DMA moves the block without the CPU." },
      { id: "o6c3", kind: "NAT", marks: 2, q: "A device is polled 50 times a second, each poll costs 200 µs, and the device sends 5 items a second, each costing 400 µs more to process. The time per second in milliseconds is", answer: "12", solution: "50 × 0.2 ms = 10 ms; 5 × 0.4 ms = 2 ms; total 12 ms." },
      { id: "o6c4", kind: "MSQ", marks: 2, q: "Which are true?", options: ["Vectored interrupts start the ISR faster", "In DMA, CPU and DMA controller are bus masters together", "Polling keeps the CPU busy", "An interrupt is checked between instructions"], answer: "A, C, D", solution: "Only one bus master at a time." },
      { id: "o6c5", kind: "MCQ", marks: 1, q: "In an interrupt, the program counter is saved", options: ["After the ISR starts", "Before it is loaded with the ISR address", "Never", "Only for vectored interrupts"], answer: "B", solution: "Otherwise the return address is lost." },
      { id: "o6c6", kind: "NAT", marks: 2, q: "A DMA transfer moves 512 bytes in one burst; the setup takes 1000 CPU cycles, and the end interrupt handler 500 cycles. How many CPU cycles does the whole transfer cost the CPU (ignoring the bus time)?", answer: "1500", solution: "Setup 1000 plus end handler 500 = 1500." },
      { id: "o6c7", kind: "MCQ", marks: 1, q: "Which interrupt mechanism assigns priority by position in a line of devices?", options: ["Vectored table", "Daisy chaining", "Polling", "DMA"], answer: "B", solution: "The acknowledge signal reaches the nearest requester first." },
      { id: "o6c8", kind: "NAT", marks: 2, q: "A 10 MHz CPU gives 0.1% of its cycles to cycle stealing at 32 bits per cycle. The data rate in bits per second is", answer: "320000", solution: "0.001 × 10⁷ = 10⁴ cycles × 32 = 320 000." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on I/O", sub: "Computer Organisation", href: "/topics/computer-organization-and-architecture-coa" }, { label: "Practice table of every question", sub: "the next chapter", href: "/study/io-interrupts-dma" }] },
    { type: "links", prereq: ["Main memory (O5)", "Pipelining (O3)"], usedIn: ["Operating Systems: device drivers and interrupts"], cross: ["Operating Systems: processes"] },
  ],
};
