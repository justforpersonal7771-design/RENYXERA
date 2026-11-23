# Review input: Computer Networks, chapter 04: TCP, UDP and flow control

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-04-tcp-udp-and-flow-control.md` and `gemini-04-tcp-udp-and-flow-control.md` in this folder.

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

This is **one chapter** (4 of 5) of the Computer Networks book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **TCP, UDP and flow control**. Written lessons today: 5 topics ready.



## The PYQs for this chapter (15)

**2026_FN_Q18** · 2026-FN · MCQ · 1 mark · Easy · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

With respect to a TCP connection between a client and a server, which one of the following statements is true?

- A) The client and server use a two-way handshake mechanism before the start of data transmission.
- B) The server cannot initiate closing of the connection before the client initiates closing of the connection.
- C) The TCP connection is half-duplex.
- D) The client and server can initiate closing of the connection at the same time.  ✔ official

---

**2026_FN_Q44** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

A TCP sender successfully establishes a connection with a TCP receiver and starts the transmission of segments. The TCP congestion control mechanism's slow-start threshold is set to 10000 segments. Assume that the round-trip time is fixed at 1 millisecond. Assume that the sender always has data to send, the segments are numbered from 1, and no segment is lost. Let \( t \) denote the time (in milliseconds) at which the transmission of segment number 2000 starts. Which one of the following options is correct?

- A) \( 9 \le t < 10 \)
- B) \( 10 \le t < 11 \)  ✔ official
- C) \( 11 \le t < 12 \)
- D) \( 12 \le t < 13 \)

---

**2026_AN_Q58** · 2026-AN · NAT · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider a new TCP connection between a sender and a receiver. The receiver advertised window is constant at 48 KB, the maximum segment size (MSS) is 2 KB, and the slow start threshold for TCP congestion control is 16 KB. Assume that there are no timeouts or duplicate acknowledgements. The number of rounds of transmission required for the congestion control algorithm of the TCP connection to reach the congestion avoidance phase is ________. (answer in integer)
Note: 1K = \( 2^{10} \)

Official answer (numeric): 4 to 4

---

**2025_FN_Q22** · 2025-FN · MSQ · 1 mark · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider the 3-way handshaking protocol for TCP connection establishment. Let the three packets exchanged during the connection establishment be denoted as P1, P2, and P3, in order. Which of the following option(s) is/are TRUE with respect to TCP header flags that are set in the packets?

- A) P3: SYN = 1, ACK = 1
- B) P2: SYN = 1, ACK = 1  ✔ official
- C) P2: SYN = 0, ACK = 1
- D) P1: SYN = 1  ✔ official

---

**2024_FN_Q23** · 2024-FN · MSQ · 1 mark · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

TCP client P successfully establishes a connection to TCP server Q. Let \( N_P \) denote the sequence number in the SYN sent from \( P \) to \( Q \). Let \( N_Q \) denote the acknowledgement number in the SYN ACK from \( Q \) to \( P \). Which of the following statements is/are CORRECT?

- A) The sequence number \( N_P \) is chosen randomly by \( P \)  ✔ official
- B) The sequence number \( N_Q \) is always 0 for a new connection
- C) The acknowledgement number \( N_Q \) is equal to \( N_P \)
- D) The acknowledgement number \( N_Q \) is equal to \( N_P + 1 \)  ✔ official

---

**2024_AN_Q58** · 2024-AN · NAT · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider a TCP connection operating at a point of time with the congestion window of size 12 MSS (Maximum Segment Size), when a timeout occurs due to packet loss. Assuming that all the segments transmitted in the next two RTTs (Round Trip Time) are acknowledged correctly, the congestion window size (in MSS) during the third RTT will be ________.

Official answer (numeric): 4 to 4

---

**2023_FN_Q50** · 2023-FN · MSQ · 2 marks · Hard · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Suppose you are asked to design a new reliable byte-stream transport protocol like TCP. This protocol, named myTCP, runs over a 100 Mbps network with Round Trip Time of 150 milliseconds and the maximum segment lifetime of 2 minutes. Which of the following is/are valid lengths of the Sequence Number field in the myTCP header?

- A) 30 bits
- B) 32 bits  ✔ official
- C) 34 bits  ✔ official
- D) 36 bits  ✔ official

---

**2022_FN_Q60** · 2022-FN · NAT · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider the data transfer using TCP over a 1 Gbps link. Assuming that the maximum segment lifetime (MSL) is set to 60 seconds, the minimum number of bits required for the sequence number field of the TCP header, to prevent the sequence number space from wrapping around during the MSL is __________.

Official answer (numeric): 33 to 33

---

**2021_AN_Q14** · 2021-AN · MCQ · 1 mark · Easy · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider the three-way handshake mechanism followed during TCP connection establishment between hosts \(P\) and \(Q\). Let \(X\) and \(Y\) be two random 32-bit starting sequence numbers chosen by \(P\) and \(Q\) respectively. Suppose \(P\) sends a TCP connection request message to \(Q\) with a TCP segment having SYN bit = 1. SEQ number = \(X\), and ACK bit = 0. Suppose \(Q\) accepts the connection request. Which one of the following choices represents the information present in the TCP segment header that is sent by \(Q\) to \(P\)?

- A) SYN bit = 1, SEQ number = \(X + 1\), ACK bit = 0, ACK number = \(Y\), FIN bit = 0
- B) SYN bit = 0, SEQ number = \(X + 1\), ACK bit = 0, ACK number = \(Y\), FIN bit = 1
- C) SYN bit = 1, SEQ number = \(Y\), ACK bit = 1, ACK number = \(X + 1\), FIN bit = 0  ✔ official
- D) SYN bit = 1, SEQ number = \(Y\), ACK bit = 1, ACK number = \(X\), FIN bit = 0

---

**2021_FN_Q20** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

A TCP server application is programmed to listen on port number \(P\) on host \(S\). A TCP client is connected to the TCP server over the network.
Consider that while the TCP connection was active, the server machine \(S\) crashed and rebooted. Assume that the client does not use the TCP keepalive timer.
Which of the following behaviors is/are possible?

- A) If the client was waiting to receive a packet, it may wait indefinitely.  ✔ official
- B) The TCP server application on \(S\) can listen on \(P\) after reboot.  ✔ official
- C) If the client sends a packet after the server reboot, it will receive a RST segment.  ✔ official
- D) If the client sends a packet after the server reboot, it will receive a FIN segment.

---

**2020_FN_Q62** · 2020-FN · NAT · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider a TCP connection between a client and a server with the following specifications: the round trip time is 6 ms, the size of the receiver advertised window is 50 KB, slow-start threshold at the client is 32 KB, and the maximum segment size is 2 KB. The connection is established at time \( t = 0 \). Assume that there are no timeouts and errors during transmission. Then the size of the congestion window (in KB) at time \( t + 60 \) ms after all acknowledgments are processed is ________.

Official answer (numeric): 44 to 44

---

**2018_FN_Q24** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider the following statements regarding the slow start phase of the TCP congestion control algorithm. Note that cwnd stands for the TCP congestion window and MSS denotes the Maximum Segment Size.
(i) The cwnd increases by 2 MSS on every successful acknowledgment.
(ii) The cwnd approximately doubles on every successful acknowledgement.
(iii) The cwnd increases by 1 MSS every round trip time.
(iv) The cwnd approximately doubles every round trip time.
Which one of the following is correct?

- A) Only (ii) and (iii) are true
- B) Only (i) and (iii) are true
- C) Only (iv) is true  ✔ official
- D) Only (i) and (iv) are true

---

**2018_FN_Q35** · 2018-FN · NAT · 1 mark · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider a long-lived TCP session with an end-to-end bandwidth of 1 Gbps (\(= 10^9\) bits-per-second). The session starts with a sequence number of 1234. The minimum time (in seconds, rounded to the closest integer) before this sequence number can be used again is _______.

Official answer (numeric): 34 to 35

---

**2017_FN_Q12** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider a TCP client and a TCP server running on two different machines. After completing data transfer, the TCP client calls close to terminate the connection and a FIN segment is sent to the TCP server. Server-side TCP responds by sending an ACK, which is received by the client-side TCP. As per the TCP connection state diagram (RFC 793), in which state does the client-side TCP connection wait for the FIN from the server-side TCP?

- A) LAST-ACK
- B) TIME-WAIT
- C) FIN-WAIT-1
- D) FIN-WAIT-2  ✔ official

---

**2017_AN_Q18** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider socket API on a Linux machine that supports connected UDP sockets. A connected UDP socket is a UDP socket on which connect function has already been called. Which of the following statements is/are CORRECT?
I. A connected UDP socket can be used to communicate with multiple peers simultaneously.
II. A process can successfully call connect function again for an already connected UDP socket.

- A) I only
- B) II only  ✔ official
- C) Both I and II
- D) Neither I nor II

