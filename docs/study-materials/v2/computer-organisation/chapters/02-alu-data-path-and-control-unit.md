# Review input: Computer Organisation, chapter 02: ALU, data path and control unit

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-02-alu-data-path-and-control-unit.md` and `gemini-02-alu-data-path-and-control-unit.md` in this folder.

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

This is **one chapter** (2 of 6) of the Computer Organisation book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **ALU, data path and control unit**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (4)

**2025_FN_Q27** · 2025-FN · MSQ · 1 mark · Medium · bank topic: ALU, Control Unit Design, Data-Path Operations · HAS A FIGURE (not shown here)

A partial data path of a processor is given in the figure, where RA, RB, and RZ are 32-bit registers. Which option(s) is/are CORRECT related to arithmetic operations using the data path as shown?
[IMAGE_Q_27_1]

- A) The data path can implement arithmetic operations involving two registers.  ✔ official
- B) The data path can implement arithmetic operations involving one register and one immediate value.  ✔ official
- C) The data path can implement arithmetic operations involving two immediate values.  ✔ official
- D) The data path can only implement arithmetic operations involving one register and one immediate value.

---

**2025_AN_Q32** · 2025-AN · NAT · 1 mark · Hard · bank topic: ALU, Control Unit Design, Data-Path Operations

The following two signed 2's complement numbers (multiplicand M and multiplier Q) are being multiplied using Booth's algorithm:
M : 1100 1101 1110 1101 and Q: 1010 0100 1010 1010
The total number of addition and subtraction operations to be performed is ________. (Answer in integer)

Official answer (numeric): 13 to 13

---

**2020_FN_Q30** · 2020-FN · MCQ · 1 mark · Medium · bank topic: ALU, Control Unit Design, Data-Path Operations · HAS A FIGURE (not shown here)

Consider the following data path diagram.
[IMAGE_Q_30]
Consider an instruction: R0 \(\leftarrow\) R1 + R2. The following steps are used to execute it over the given data path. Assume that PC is incremented appropriately. The subscripts r and w indicate read and write operations, respectively.
1. \( R2_r \), \( TEMP1_r \), \( ALU_{add} \), \( TEMP2_w \)
2. \( R1_r \), \( TEMP1_w \)
3. \( PC_r \), \( MAR_w \), \( MEM_r \)
4. \( TEMP2_r \), \( R0_w \)
5. \( MDR_r \), \( IR_w \)
Which one of the following is the correct order of execution of the above steps?

- A) 2, 1, 4, 5, 3
- B) 1, 2, 4, 3, 5
- C) 3, 5, 2, 1, 4  ✔ official
- D) 3, 5, 1, 2, 4

---

**2018_FN_Q15** · 2018-FN · MCQ · 1 mark · Easy · bank topic: ALU, Control Unit Design, Data-Path Operations

Consider the following processor design characteristics.
I. Register-to-register arithmetic operations only
II. Fixed-length instruction format
III. Hardwired control unit
Which of the characteristics above are used in the design of a RISC processor?

- A) I and II only
- B) II and III only
- C) I and III only
- D) I, II and III  ✔ official

