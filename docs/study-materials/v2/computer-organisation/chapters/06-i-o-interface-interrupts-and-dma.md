# Review input: Computer Organisation, chapter 06: I/O interface: interrupts and DMA

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-06-i-o-interface-interrupts-and-dma.md` and `gemini-06-i-o-interface-interrupts-and-dma.md` in this folder.

*Note: chapters are matched to PYQs by the words in their titles, so a question can appear in more than one chapter. Say which chapter it really belongs to.*

---

## PART A. REVIEWER INSTRUCTIONS

```
YOU ARE NOT AN EXPERT. YOU ARE THIS STUDENT:
You are 25 years old. You sat at the back of the class. You failed GATE twice and have plenty of backlogs. You studied
Programming and Data Structures (and the other subjects) in college only to pass, copied the assignments, and
remember almost nothing. You are ashamed of that, you do not want to ask, and you are now preparing again with
about 100 days left. You have read Made Easy notes, Unacademy PDFs and GateWallah books and they left you confused:
they use words they never explain, jump steps and show few pictures. You will only believe a book that is teaching
you from the very beginning.

I will give you a document. Read it as this student. Do NOT be polite and do NOT be an expert reviewer who nods.
Stop at every place where this student would get stuck. Then answer in the four parts below.

PART 1. FEELINGS (10 lines)
 How did you feel reading it? Where did you feel lost, bored, scared, or tricked? Where did you feel "I can do this"?
 Would you pay Rs 149 per subject book for this? Yes or no, and the real reason.

PART 2. GAP TABLE (the main part; at least 40 rows if the document is a plan, 15 if it is one topic)
 | # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
 Type is one of: MISSING-PREREQUISITE, UNEXPLAINED-WORD, STEP-SKIPPED, NEEDS-DIAGRAM, NEEDS-EXAMPLE, NEEDS-TRACE,
 MISSING-GATE-CONCEPT, MISSING-FINER-POINT, WRONG-ORDER, TOO-HARD-TOO-EARLY, TOO-LONG-BORING, UNCLEAR-ENGLISH, FACT-DOUBT.
 Priority is HIGH / MEDIUM / LOW.

PART 3. WHAT A COMPLETE SUBJECT MUST HAVE
 From your knowledge of GATE (previous-year papers, Made Easy, Unacademy, GateWallah, standard university textbooks,
 NPTEL), list every chapter, topic and finer sub-topic that this subject has but the document does NOT cover, with:
 the syllabus line it serves, how often GATE asks it (if you really know; otherwise say "not sure"), the typical
 question type, and the prerequisite a zero-level student needs first.

PART 4. THE DIAGRAMS I NEED
 List every diagram this student needs to SEE in order to understand each chapter. For each: what to draw, what the
 student should notice, and whether it should be a single picture, a step-by-step series of pictures, or a trace table.

RULES FOR YOU
 - Do not invent GATE years, question numbers or statistics. If you are not sure, write "not sure".
 - Do not just praise. If you find fewer than 40 problems in a long plan, you read too fast; read again.
 - Say it in simple English.
 - If a fact in the document looks wrong, say exactly which and why (FACT-DOUBT).

This is **one chapter** (6 of 6) of the Computer Organisation book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

In addition to Parts 1 to 4 of the instructions above, answer these chapter-specific parts:

PART 5. THE FULL LESSON PLAN FOR THIS CHAPTER
 Propose the complete list of lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with a reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind + what it shows); hand traces; common mistakes.

PART 6. THE PYQs BELOW
 For EACH previous-year question listed below: (a) which lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree, show the working and say "FACT-DOUBT"), (e) whether the question text looks mis-transcribed.

PART 7. MORE QUESTIONS
 For each lesson, list the question types GATE could ask that are NOT covered by the PYQs below (give 3 ideas each, one line each).

PART 8. WHAT IS MISSING FROM THIS CHAPTER'S SCOPE
 Topics GATE has asked (or could ask) about this chapter that the draft chapter list does not cover.
```

---

## PART B. THE CHAPTER

## Chapter details

Existing chapter in the app: **I/O interface: interrupts and DMA**. Written lessons today: 4 topics ready.



## The PYQs for this chapter (9)

**2026_AN_Q18** · 2026-AN · MCQ · 1 mark · Medium · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Consider the following two statements about interrupt handling mechanisms in a CPU.
S1: In non-vectored interrupt mechanism, it usually takes more time to start the Interrupt Service Routine (ISR) when compared to that in a vectored interrupt mechanism.
S2: In daisy-chain interrupt mechanism, the CPU polls all the input devices individually to determine the source of the interrupt.
Which one of the following options is correct with respect to S1 and S2?

- A) Both S1 and S2 are true
- B) Both S1 and S2 are false
- C) S1 is true and S2 is false  ✔ official
- D) S1 is false and S2 is true

---

**2025_FN_Q11** · 2025-FN · MCQ · 1 mark · Easy · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Suppose a program is running on a non-pipelined single processor computer system. The computer is connected to an external device that can interrupt the processor asynchronously. The processor needs to execute the interrupt service routine (ISR) to serve this interrupt. The following steps (not necessarily in order) are taken by the processor when the interrupt arrives:
(i) The processor saves the content of the program counter.
(ii) The program counter is loaded with the start address of the ISR.
(iii) The processor finishes the present instruction.
Which ONE of the following is the CORRECT sequence of steps?

- A) (iii), (i), (ii)  ✔ official
- B) (i), (iii), (ii)
- C) (i), (ii), (iii)
- D) (iii), (ii), (i)

---

**2024_AN_Q24** · 2024-AN · MCQ · 1 mark · Medium · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Consider a computer with a 4 MHz processor. Its DMA controller can transfer 8 bytes in 1 cycle from a device to main memory through cycle stealing at regular intervals. Which one of the following is the data transfer rate (in bits per second) of the DMA controller if 1% of the processor cycles are used for DMA?

- A) 2,56,000
- B) 3,200
- C) 25,60,000  ✔ official
- D) 32,000

---

**2024_FN_Q33** · 2024-FN · MCQ · 1 mark · Medium · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Which one of the following statements is FALSE?

- A) In the cycle stealing mode of DMA, one word of data is transferred between an I/O device and main memory in a stolen cycle
- B) For bulk data transfer, the burst mode of DMA has a higher throughput than the cycle stealing mode
- C) Programmed I/O mechanism has a better CPU utilization than the interrupt driven I/O mechanism  ✔ official
- D) The CPU can start executing an interrupt service routine faster with vectored interrupts than with non-vectored interrupts

---

**2023_FN_Q34** · 2023-FN · NAT · 1 mark · Hard · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

A keyboard connected to a computer is used at a rate of 1 keystroke per second. The computer system polls the keyboard every 10 ms (milli seconds) to check for a keystroke and consumes 100 \(\mu\)s (micro seconds) for each poll. If it is determined after polling that a key has been pressed, the system consumes an additional 200 \(\mu\)s to process the keystroke. Let \( T_1 \) denote the fraction of a second spent in polling and processing a keystroke.
In an alternative implementation, the system uses interrupts instead of polling. An interrupt is raised for every keystroke. It takes a total of 1 ms for servicing an interrupt and processing a keystroke. Let \( T_2 \) denote the fraction of a second spent in servicing the interrupt and processing a keystroke.
The ratio \( \frac{T_1}{T_2} \) is ________. (Rounded off to one decimal place)

Official answer (numeric): 10.2 to 10.2

---

**2022_FN_Q17** · 2022-FN · MCQ · 1 mark · Easy · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Which one of the following facilitates transfer of bulk data from hard disk to main memory with the highest throughput?

- A) DMA based I/O transfer  ✔ official
- B) Interrupt driven I/O transfer
- C) Polling based I/O transfer
- D) Programmed I/O transfer

---

**2021_AN_Q11** · 2021-AN · NAT · 1 mark · Medium · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Consider a computer system with DMA support. The DMA module is transferring one 8-bit character in one CPU cycle from a device to memory through cycle stealing at regular intervals. Consider a 2 MHz processor. If 0.5% processor cycles are used for DMA, the data transfer rate of the device is _____ bits per second.

Official answer (numeric): 80000 to 80000

---

**2020_FN_Q33** · 2020-FN · MCQ · 1 mark · Medium · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

Consider the following statements:
I. Daisy chaining is used to assign priorities in attending interrupts.
II. When a device raises a vectored interrupt, the CPU does polling to identify the source of interrupt.
III. In polling, the CPU periodically checks the status bits to know if any device needs its attention.
IV. During DMA, both the CPU and DMA controller can be bus masters at the same time.
Which of the above statements is/are TRUE?

- A) I and II only
- B) I and IV only
- C) I and III only  ✔ official
- D) III only

---

**2018_FN_Q19** · 2018-FN · MCQ · 1 mark · Easy · bank topic: I/O Interfaces (Interrupts & DMA Control Modes)

The following are some events that occur after a device controller issues an interrupt while process \(L\) is under execution.
(P) The processor pushes the process status of \(L\) onto the control stack.
(Q) The processor finishes the execution of the current instruction.
(R) The processor executes the interrupt service routine.
(S) The processor pops the process status of \(L\) from the control stack.
(T) The processor loads the new PC value based on the interrupt.
Which one of the following is the correct order in which the events above occur?

- A) QPTRS  ✔ official
- B) PTRSQ
- C) TRPQS
- D) QTPRS

