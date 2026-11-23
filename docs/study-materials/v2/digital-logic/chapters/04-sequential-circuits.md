# Review input: Digital Logic, chapter 04: Sequential circuits

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-04-sequential-circuits.md` and `gemini-04-sequential-circuits.md` in this folder.

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

This is **one chapter** (4 of 6) of the Digital Logic book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Sequential circuits**. Not written yet.



## The PYQs for this chapter (11)

**2026_FN_Q37** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider a 2-bit saturating up/down counter that performs the saturating up count when the input \( P \) is 0, and the saturating down count when \( P \) is 1. The Next State table of the counter is as shown. The counter is built as a synchronous sequential circuit using \( D \) flip-flops.
[IMAGE_Q_37_1]
Which one of the following options corresponds to the expressions for the inputs of the \( D \) flip-flops, \( D_1 \) and \( D_0 \)?

- A) \( D_1 = PQ_1 + \overline{P}Q_0 + Q_1Q_0 \quad D_0 = PQ_0 + \overline{P}Q_1 + Q_1\overline{Q_0} \)
- B) \( D_1 = \overline{P}Q_1 + \overline{P}Q_0 + Q_1Q_0 \quad D_0 = \overline{P}\overline{Q_0} + \overline{P}Q_1 + Q_1\overline{Q_0} \)  ✔ official
- C) \( D_1 = P\overline{Q_1} + P\overline{Q_0} + Q_1Q_0 \quad D_0 = PQ_0 + \overline{P}Q_1 + Q_1Q_0 \)
- D) \( D_1 = P\overline{Q_1} + \overline{P}Q_0 + Q_1Q_0 \quad D_0 = P\overline{Q_0} + \overline{P}Q_1 + Q_1\overline{Q_0} \)

---

**2025_AN_Q34** · 2025-AN · NAT · 1 mark · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters)

In a 4-bit ripple counter, if the period of the waveform at the last flip-flop is 64 microseconds, then the frequency of the ripple counter in kHz is ________. (Answer in integer)

Official answer (numeric): 250 to 250

---

**2025_FN_Q59** · 2025-FN · NAT · 2 marks · Hard · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider a finite state machine (FSM) with one input \( X \) and one output \( f \), represented by the given state transition table. The minimum number of states required to realize this FSM is ________. (Answer in integer)
[IMAGE_Q_59_1]

Official answer (numeric): 5 to 5

---

**2025_FN_Q60** · 2025-FN · NAT · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider the given sequential circuit designed using D-Flip-flops. The circuit is initialized with some value (initial state). The number of distinct states the circuit will go through before returning back to the initial state is ________. (Answer in integer)
[IMAGE_Q_60_1]

Official answer (numeric): 7 to 8

---

**2023_FN_Q21** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

The output of a 2-input multiplexer is connected back to one of its inputs as shown in the figure.
[IMAGE_Q_21_1]
Match the functional equivalence of this circuit to one of the following options.

- A) D Flip-flop
- B) D Latch  ✔ official
- C) Half-adder
- D) Demultiplexer

---

**2023_FN_Q43** · 2023-FN · MCQ · 2 marks · Hard · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider a sequential digital circuit consisting of \( T \) flip-flops and \( D \) flip-flops as shown in the figure. CLKIN is the clock input to the circuit. At the beginning, Q1, Q2 and Q3 have values 0, 1 and 1, respectively.
[IMAGE_Q_43_1]
Which one of the given values of (Q1, Q2, Q3) can NEVER be obtained with this digital circuit?

- A) (0, 0, 1)  ✔ official
- B) (1, 0, 0)
- C) (1, 0, 1)
- D) (1, 1, 1)

---

**2021_FN_Q55** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider a 3-bit counter, designed using T flip-flops, as shown below:

[IMAGE_Q_55_1]

Assuming the initial state of the counter given by \(PQR\) as 000. What are the next three states?

- A) 011, 101, 000  ✔ official
- B) 001, 010, 111
- C) 011, 101, 111
- D) 001, 010, 000

---

**2021_AN_Q42** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters)

Suppose we want to design a synchronous circuit that processes a string of 0's and 1's. Given a string, it produces another string by replacing the first 1 in any subsequence of consecutive 1's by a 0. Consider the following example.
Input sequence : 00100011000011100
Output sequence : 00000001000001100
A Mealy Machine is a state machine where both the next state and the output are functions of the present state and the current input.
The above mentioned circuit can be designed as a two-state Mealy machine. The states in the Mealy machine can be represented using Boolean values 0 and 1. We denote the current state, the next state, the next incoming bit, and the output bit of the Mealy machine by the variables \(s\), \(t\), \(b\) and \(y\) respectively.
Assume the initial state of the Mealy machine is 0.
What are the Boolean expressions corresponding to \(t\) and \(y\) in terms of \(s\) and \(b\)?

- A) \(t = s + b\) \(y = sb\)
- B) \(t = b\) \(y = sb\)  ✔ official
- C) \(t = b\) \(y = s\bar{b}\)
- D) \(t = s + b\) \(y = s\bar{b}\)

---

**2018_FN_Q32** · 2018-FN · NAT · 1 mark · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider the sequential circuit shown in the figure, where both flip-flops used are positive edge-triggered D flip-flops.
[IMAGE_Q_32]
The number of states in the state transition diagram of this circuit that have a transition back to the same state on some value of “in” is _____.

Official answer (numeric): 2 to 2

---

**2017_FN_Q59** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

Consider a combination of T and D flip-flops connected as shown below. The output of the D flip-flop is connected to the input of the T flip-flop and the output of the T flip-flop is connected to the input of the D flip-flop.
[IMAGE_Q_59]
Initially, both \(Q_0\) and \(Q_1\) are set to 1 (before the \(1^{\text{st}}\) clock cycle). The outputs

- A) \(Q_1\) \(Q_0\) after the \(3^{\text{rd}}\) cycle are 11 and after the \(4^{\text{th}}\) cycle are 00 respectively.
- B) \(Q_1\) \(Q_0\) after the \(3^{\text{rd}}\) cycle are 11 and after the \(4^{\text{th}}\) cycle are 01 respectively.  ✔ official
- C) \(Q_1\) \(Q_0\) after the \(3^{\text{rd}}\) cycle are 00 and after the \(4^{\text{th}}\) cycle are 11 respectively.
- D) \(Q_1\) \(Q_0\) after the \(3^{\text{rd}}\) cycle are 01 and after the \(4^{\text{th}}\) cycle are 01 respectively.

---

**2017_AN_Q45** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Sequential Circuits (Flip-Flops, Registers, Counters) · HAS A FIGURE (not shown here)

The next state table of a 2-bit saturating up-counter is given below.
[IMAGE_Q_45]
The counter is built as a synchronous sequential circuit using T flip-flops. The expressions for \(T_1\) and \(T_0\) are

- A) \(T_1 = Q_1 Q_0, T_0 = \bar{Q}_1 \bar{Q}_0\)
- B) \(T_1 = \bar{Q}_1 Q_0, T_0 = \bar{Q}_1 + \bar{Q}_0\)  ✔ official
- C) \(T_1 = Q_1 + Q_0, T_0 = \bar{Q}_1 + \bar{Q}_0\)
- D) \(T_1 = Q_1 Q_0, T_0 = Q_1 + Q_0\)

