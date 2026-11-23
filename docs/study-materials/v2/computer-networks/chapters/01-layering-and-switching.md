# Review input: Computer Networks, chapter 01: Layering and switching

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-01-layering-and-switching.md` and `gemini-01-layering-and-switching.md` in this folder.

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

This is **one chapter** (1 of 5) of the Computer Networks book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Layering and switching**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (5)

**2026_AN_Q21** · 2026-AN · MCQ · 1 mark · Medium · bank topic: OSI & TCP/IP Protocol Layers

Consider a file of size 4 million bytes being transferred between two hosts connected via a path consisting of three consecutive links of bandwidth 2 Mbps, 500 kbps, and 1 Mbps, respectively. All processing delays and propagation delays are negligible. Assume that there is no other background traffic over the path and no other additional overhead to transfer the file.
Which one of the following is the total time (in seconds) to transfer the file?
**Note:** 1M = \( 10^6 \), 1k = \( 10^3 \)

- A) 731
- B) 64  ✔ official
- C) 8
- D) 16

---

**2025_FN_Q16** · 2025-FN · MCQ · 1 mark · Easy · bank topic: OSI & TCP/IP Protocol Layers

Identify the ONE CORRECT matching between the OSI layers and their corresponding functionalities as shown.
**OSI Layers**
(a) Network layer
(b) Transport layer
(c) Datalink layer
**Functionalities**
(I) Packet routing
(II) Framing and error handling
(III) Host to host communication

- A) (a)-(I), (b)-(II), (c)-(III)
- B) (a)-(I), (b)-(III), (c)-(II)  ✔ official
- C) (a)-(II), (b)-(I), (c)-(III)
- D) (a)-(III), (b)-(II), (c)-(I)

---

**2025_AN_Q16** · 2025-AN · MCQ · 1 mark · Easy · bank topic: OSI & TCP/IP Protocol Layers

Consider the following statements:
(i) Address Resolution Protocol (ARP) provides a mapping from an IP address to the corresponding hardware (link-layer) address.
(ii) A single TCP segment from a sender S to a receiver R cannot carry both data from S to R and acknowledgement for a segment from R to S.
Which ONE of the following is CORRECT?

- A) Both (i) and (ii) are TRUE
- B) (i) is TRUE and (ii) is FALSE  ✔ official
- C) (i) is FALSE and (ii) is TRUE
- D) Both (i) and (ii) are FALSE

---

**2024_FN_Q40** · 2024-FN · MCQ · 2 marks · Medium · bank topic: OSI & TCP/IP Protocol Layers

Consider a network path \( P - Q - R \) between nodes \( P \) and \( R \) via router \( Q \). Node \( P \) sends a file of size \( 10^6 \) bytes to \( R \) via this path by splitting the file into chunks of \( 10^3 \) bytes each. Node \( P \) sends these chunks one after the other without any wait time between the successive chunk transmissions. Assume that the size of extra headers added to these chunks is negligible, and that the chunk size is less than the MTU.
Each of the links \( P - Q \) and \( Q - R \) has a bandwidth of \( 10^6 \) bits/sec, and negligible propagation latency. Router \( Q \) immediately transmits every packet it receives from \( P \) to \( R \), with negligible processing and queueing delays. Router \( Q \) can simultaneously receive on link \( P - Q \) and transmit on link \( Q - R \).
Assume \( P \) starts transmitting the chunks at time \( t = 0 \).
Which one of the following options gives the time (in seconds, rounded off to 3 decimal places) at which \( R \) receives all the chunks of the file?

- A) 8.000
- B) 8.008  ✔ official
- C) 15.992
- D) 16.000

---

**2018_FN_Q23** · 2018-FN · MCQ · 1 mark · Easy · bank topic: OSI & TCP/IP Protocol Layers

Match the following:
Field	Length in bits
P. UDP Header’s Port Number	I. 48
Q. Ethernet MAC Address	II. 8
R. IPv6 Next Header	III. 32
S. TCP Header’s Sequence Number	IV. 16

- A) P-III, Q-IV, R-II, S-I
- B) P-II, Q-I, R-IV, S-III
- C) P-IV, Q-I, R-II, S-III  ✔ official
- D) P-IV, Q-I, R-III, S-II

