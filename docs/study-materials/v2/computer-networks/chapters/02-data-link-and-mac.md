# Review input: Computer Networks, chapter 02: Data link and MAC

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-02-data-link-and-mac.md` and `gemini-02-data-link-and-mac.md` in this folder.

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

This is **one chapter** (2 of 5) of the Computer Networks book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Data link and MAC**. Written lessons today: 6 topics ready.



## The PYQs for this chapter (26)

**2026_AN_Q43** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider the transmission of data bits 110001011 over a link that uses Cyclic Redundancy Check (CRC) code for error detection. If the generator bit pattern is given to be 1001, which one of the following options shows the remainder bit pattern appended to the data bits before transmission?

- A) 011
- B) 101
- C) 000
- D) 100  ✔ official

---

**2026_FN_Q45** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider the implementation of sliding window protocol over a lossless link, with a window size of \( W \) frames, where each frame is of size 1000 bits (including header). The bandwidth of the link is 100 kbps (1k = \( 10^3 \)) and the one-way propagation delay is 100 milliseconds. Assume that processing times at the sender and receiver are zero and the transmission time of acknowledgements is also zero. Which one of the following options gives the minimum size of \( W \) (in number of frames) required to achieve 100% link utilization?

- A) 10
- B) 21  ✔ official
- C) 20
- D) 11

---

**2026_AN_Q65** · 2026-AN · NAT · 2 marks · Hard · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

It is necessary to design a link-layer protocol between two hosts that are directly connected over a lossless link of length 3000 kilometers. Assume that the link bandwidth is \( 10^8 \) bits per second and that the propagation delay in the link is 5 nanoseconds per meter. Every transmitted data byte is assigned a unique sequence number.
Let \( N \) be the minimum number of bits needed for the sequence number field in the protocol header such that
(i) the sequence numbers do not wrap around before 60 seconds, and
(ii) the maximum utilization of the link is achieved.
The value of \( N \) is ________. (answer in integer)

Official answer (numeric): 30 to 30

---

**2025_AN_Q17** · 2025-AN · MCQ · 1 mark · Easy · bank topic: Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing)

Consider the routing protocols given in List-I and the names given in List-II:
List-I
(i) Distance vector routing
(ii) Link state routing
List-II
(a) Bellman-Ford
(b) Dijkstra
For matching of items in List-I with those in List-II, which ONE of the following options is CORRECT?

- A) (i) – (a) and (ii) – (b)  ✔ official
- B) (i) – (a) and (ii) – (a)
- C) (i) – (b) and (ii) – (a)
- D) (i) – (b) and (ii) – (b)

---

**2025_AN_Q36** · 2025-AN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Suppose we are transmitting frames between two nodes using Stop-and-Wait protocol. The frame size is 3000 bits. The transmission rate of the channel is 2000 bps (bits/second) and the propagation delay between the two nodes is 100 milliseconds. Assume that the processing times at the source and destination are negligible. Also, assume that the size of the acknowledgement packet is negligible. Which ONE of the following most accurately gives the channel utilization for the above scenario in percentage?

- A) 88.23  ✔ official
- B) 93.75
- C) 85.44
- D) 66.67

---

**2025_FN_Q40** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing) · HAS A FIGURE (not shown here)

A packet with the destination IP address 145.36.109.70 arrives at a router whose routing table is shown. Which interface will the packet be forwarded to?
[IMAGE_Q_40_1]

- A) E3  ✔ official
- B) E1
- C) E2
- D) E5

---

**2024_AN_Q14** · 2024-AN · MSQ · 1 mark · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Node X has a TCP connection open to node Y. The packets from X to Y go through an intermediate IP router R. Ethernet switch S is the first switch on the network path between X and R. Consider a packet sent from X to Y over this connection.
Which of the following statements is/are TRUE about the destination IP and MAC addresses on this packet at the time it leaves X?

- A) The destination IP address is the IP address of R.
- B) The destination IP address is the IP address of Y.  ✔ official
- C) The destination MAC address is the MAC address of S.
- D) The destination MAC address is the MAC address of Y.

---

**2024_AN_Q36** · 2024-AN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider an Ethernet segment with a transmission speed of \( 10^8 \) bits/sec and a maximum segment length of 500 meters. If the speed of propagation of the signal in the medium is \( 2 \times 10^8 \) meters/sec, then the minimum frame size (in bits) required for collision detection is ________.

Official answer (numeric): 500 to 500

---

**2024_FN_Q58** · 2024-FN · NAT · 2 marks · Medium · bank topic: Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing) · HAS A FIGURE (not shown here)

Consider the entries shown below in the forwarding table of an IP router. Each entry consists of an IP prefix and the corresponding next hop router for packets whose destination IP address matches the prefix. The notation “/N” in a prefix indicates a subnet mask with the most significant N bits set to 1.
[IMAGE_Q_58_1]
This router forwards 20 packets each to 5 hosts. The IP addresses of the hosts are 10.1.1.16, 10.1.1.72, 10.1.1.132, 10.1.1.191, and 10.1.1.205. The number of packets forwarded via the next hop router R2 is ________.

Official answer (numeric): 40 to 40

---

**2023_FN_Q17** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Suppose two hosts are connected by a point-to-point link and they are configured to use Stop-and-Wait protocol for reliable data transfer. Identify in which one of the following scenarios, the utilization of the link is the lowest.

- A) Longer link length and lower transmission rate
- B) Longer link length and higher transmission rate  ✔ official
- C) Shorter link length and lower transmission rate
- D) Shorter link length and higher transmission rate

---

**2023_FN_Q25** · 2023-FN · MSQ · 1 mark · Medium · bank topic: Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing)

Which of the following statements is/are INCORRECT about the OSPF (Open Shortest Path First) routing protocol used in the Internet?

- A) OSPF implements Bellman-Ford algorithm to find shortest paths.  ✔ official
- B) OSPF uses Dijkstra's shortest path algorithm to implement least-cost path routing.
- C) OSPF is used as an inter-domain routing protocol.  ✔ official
- D) OSPF implements hierarchical routing.

---

**2023_FN_Q65** · 2023-FN · NAT · 2 marks · Medium · bank topic: Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing) · HAS A FIGURE (not shown here)

The forwarding table of a router is shown below:
[IMAGE_Q_65]
A packet addressed to a destination address 200.150.68.118 arrives at the router. It will be forwarded to the interface with ID ________.

Official answer (numeric): 3 to 3

---

**2022_FN_Q57** · 2022-FN · NAT · 2 marks · Medium · bank topic: Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing) · HAS A FIGURE (not shown here)

Consider a network with three routers P, Q, R shown in the figure below. All the links have cost of unity.

[IMAGE_Q_57]

The routers exchange distance vector routing information and have converged on the routing tables, after which the link Q-R fails. Assume that P and Q send out routing updates at random times, each at the same average rate. The probability of a routing loop formation (rounded off to one decimal place) between P and Q, leading to count-to-infinity problem, is __________.

Official answer (numeric): 0.5 to 0.5

---

**2022_FN_Q59** · 2022-FN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider a 100 Mbps link between an earth station (sender) and a satellite (receiver) at an altitude of 2100 km. The signal propagates at a speed of \(3 \times 10^8\) m/s. The time taken (in milliseconds, rounded off to two decimal places) for the receiver to completely receive a packet of 1000 bytes transmitted by the sender is _________.

Official answer (numeric): 7.07 to 7.09

---

**2021_FN_Q46** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging) · HAS A FIGURE (not shown here)

Assume that a 12-bit Hamming codeword consisting of 8-bit data and 4 check bits is \(d_8\ d_7\ d_6\ d_5\ c_8\ d_4\ d_3\ d_2\ c_4\ d_1\ c_2\ c_1\), where the data bits and the check bits are given in the following tables:

[IMAGE_Q_46_1]

Which one of the following choices gives the correct values of \(x\) and \(y\)?

- A) \(x\) is 0 and \(y\) is 0  ✔ official
- B) \(x\) is 0 and \(y\) is 1
- C) \(x\) is 1 and \(y\) is 0
- D) \(x\) is 1 and \(y\) is 1

---

**2021_AN_Q50** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider the cyclic redundancy check (CRC) based error detecting scheme having the generator polynomial \(X^3 + X + 1\). Suppose the message \(m_4m_3m_2m_1m_0 = 11000\) is to be transmitted. Check bits \(c_2c_1c_0\) are appended at the end of the message by the transmitter using the above CRC scheme. The transmitted bit string is denoted by \(m_4m_3m_2m_1m_0c_2c_1c_0\). The value of the checkbit sequence \(c_2c_1c_0\) is

- A) 101
- B) 110
- C) 100  ✔ official
- D) 111

---

**2021_AN_Q53** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing) · HAS A FIGURE (not shown here)

Consider a computer network using the distance vector routing algorithm in its network layer. The partial topology of the network is as shown below.

[IMAGE_Q_53_1]

The objective is to find the shortest-cost path from the router \(R\) to routers \(P\) and \(Q\). Assume that \(R\) does not initially know the shortest routes to \(P\) and \(Q\). Assume that \(R\) has three neighbouring routers denoted as \(X\), \(Y\) and \(Z\). During one iteration, \(R\) measures its distance to its neighbours \(X\), \(Y\) and \(Z\) as 3, 2 and 5, respectively. Router \(R\) gets routing vectors from its neighbours that indicate that the distance to router \(P\) from routers \(X\), \(Y\) and \(Z\) are 7, 6 and 5, respectively. The routing vector also indicates that the distance to router \(Q\) from routers \(X\), \(Y\) and \(Z\) are 4, 6 and 8, respectively. Which of the following statement(s) is/are correct with respect to the new routing table of \(R\), after updation during this iteration?

- A) The distance from \(R\) to \(P\) will be stored as 10.
- B) The distance from \(R\) to \(Q\) will be stored as 7.  ✔ official
- C) The next hop router for a packet from \(R\) to \(P\) is \(Y\).  ✔ official
- D) The next hop router for a packet from \(R\) to \(Q\) is \(Z\).

---

**2021_FN_Q42** · 2021-FN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider the sliding window flow-control protocol operating between a sender and a receiver over a full-duplex error-free link. Assume the following:
• The time taken for processing the data frame by the receiver is negligible.
• The time taken for processing the acknowledgement frame by the sender is negligible.
• The sender has infinite number of frames available for transmission.
• The size of the data frame is 2000 bits and the size of the acknowledgement frame is 10 bits.
• The link data rate in each direction is 1 Mbps (\(= 10^6\) bits per second).
• One way propagation delay of the link is 100 milliseconds.
The minimum value of the sender’s window size in terms of the number of frames, (rounded to the nearest integer) needed to achieve a link utilization of 50% is _________.

Official answer (numeric): 50 to 52

---

**2021_AN_Q32** · 2021-AN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider a network using the pure ALOHA medium access control protocol, where each frame is of length 1,000 bits. The channel transmission rate is 1 Mbps (\(= 10^6\) bits per second). The aggregate number of transmissions across all the nodes (including new frame transmissions and retransmitted frames due to collisions) is modelled as a Poisson process with a rate of 1,000 frames per second, Throughput is defined as the average number of frames successfully transmitted per second. The throughput of the network (rounded to the nearest integer) is _________.

Official answer (numeric): 130 to 140

---

**2019_FN_Q62** · 2019-FN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider that 15 machines need to be connected in a LAN using 8-port Ethernet switches. Assume that these switches do not have any separate uplink ports. The minimum number of switches needed is ________.

Official answer (numeric): 3 to 3

---

**2018_FN_Q65** · 2018-FN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider a simple communication system where multiple nodes are connected by a shared broadcast medium (like Ethernet or wireless). The nodes in the system use the following carrier-sense based medium access protocol. A node that receives a packet to transmit will carrier-sense the medium for 5 units of time. If the node does not detect any other transmission in this duration, it starts transmitting its packet in the next time unit. If the node detects another transmission, it waits until this other transmission finishes, and then begins to carrier-sense for 5 time units again. Once they start to transmit, nodes do not perform any collision detection and continue transmission even if a collision occurs. All transmissions last for 20 units of time. Assume that the transmission signal travels at the speed of 10 meters per unit time in the medium.
Assume that the system has two nodes P and Q, located at a distance \(d\) meters from each other. P starts transmitting a packet at time \(t=0\) after successfully completing its carrier-sense phase. Node Q has a packet to transmit at time \(t=0\) and begins to carrier-sense the medium.
The maximum distance \(d\) (in meters, rounded to the closest integer) that allows Q to successfully avoid a collision between its proposed transmission and P’s ongoing transmission is _____.

Official answer (numeric): 50 to 50

---

**2017_AN_Q34** · 2017-AN · MCQ · 1 mark · Easy · bank topic: Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing)

Consider the following statements about the routing protocols, Routing Information Protocol (RIP) and Open Shortest Path First (OSPF) in an IPv4 network.
I: RIP uses distance vector routing
II: RIP packets are sent using UDP
III: OSPF packets are sent using TCP
IV: OSPF operation is based on link-state routing
Which of the statements above are CORRECT?

- A) I and IV only
- B) I, II and III only
- C) I, II and IV only  ✔ official
- D) II, III and IV only

---

**2017_FN_Q63** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

A computer network uses polynomials over \(GF(2)\) for error checking with 8 bits as information bits and uses \(x^3 + x + 1\) as the generator polynomial to generate the check bits. In this network, the message 01011011 is transmitted as

- A) 01011011010
- B) 01011011011
- C) 01011011101  ✔ official
- D) 01011011100

---

**2017_AN_Q65** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider a binary code that consists of only four valid codewords as given below:
00000, 01011, 10101, 11110
Let the minimum Hamming distance of the code be p and the maximum number of erroneous bits that can be corrected by the code be q. Then the values of p and q are

- A) p = 3 and q = 1  ✔ official
- B) p = 3 and q = 2
- C) p = 4 and q = 1
- D) p = 4 and q = 2

---

**2017_AN_Q56** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider two hosts X and Y, connected by a single direct link of rate \(10^6\) bits/sec. The distance between the two hosts is 10,000 km and the propagation speed along the link is \(2 \times 10^8\) m/sec. Host X sends a file of 50,000 bytes as one large message to host Y continuously. Let the transmission and propagation delays be p milliseconds and q milliseconds, respectively. Then the values of p and q are

- A) \(p = 50\) and \(q = 100\)
- B) \(p = 50\) and \(q = 400\)
- C) \(p = 100\) and \(q = 50\)
- D) \(p = 400\) and \(q = 50\)  ✔ official

---

**2017_FN_Q56** · 2017-FN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

The values of parameters for the Stop-and-Wait ARQ protocol are as given below:
Bit rate of the transmission channel = 1 Mbps.
Propagation delay from sender to receiver = 0.75 ms.
Time to process a frame = 0.25 ms.
Number of bytes in the information frame = 1980.
Number of bytes in the acknowledge frame = 20.
Number of overhead bytes in the information frame = 20.
Assume that there are no transmission errors. Then, the transmission efficiency (expressed in percentage) of the Stop-and-Wait ARQ protocol for the above parameters is________(correct to 2 decimal places).

Official answer (numeric): 86.5 to 89.5

