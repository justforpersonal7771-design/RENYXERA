# In-depth review input: Computer Networks

**One file, one review.** Paste everything below the line into ChatGPT (new chat), and again into Gemini (new chat). If the chat refuses the length, attach this file and write: "Follow the instructions inside the file."

Save the replies in this folder as `chatgpt-review-computer-networks.md` and `gemini-review-computer-networks.md`, then tell me.

Contains: reviewer instructions (A), the subject's contents with the PYQ statistics (B), and all 76 PYQs with full text and the official key (C).

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

This is the **in-depth review of the whole Computer Networks book**. Take your time. Go chapter by chapter, and give a much deeper answer than a quick review: at least **80 rows** in the gap table in Part 2 (spread across every chapter).

If your reply gets too long, **stop at the end of a chapter** and write "CONTINUE FROM CHAPTER <number>". I will answer "continue" and you carry on. Do not shorten later chapters to fit; every chapter gets the same depth.

In addition to Parts 1 to 4 above, answer these parts:

PART 5. THE FULL PLAN, CHAPTER BY CHAPTER
 For every chapter (the ones given below, plus any you think are missing), list the lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with the reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind and what it shows); hand traces; common mistakes.

PART 6. EVERY PYQ LISTED BELOW
 For EACH previous-year question: (a) the chapter and lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree show the working and write FACT-DOUBT), (e) whether the question text looks mis-transcribed (say exactly what).

PART 7. MORE QUESTIONS NEEDED
 For each lesson, three question ideas GATE could ask that the PYQs do not cover (one line each, with the type MCQ / MSQ / NAT).

PART 8. WHAT IS MISSING FROM THE SUBJECT
 Topics GATE has asked, or could ask, that no chapter below covers.

PART 9. WEIGHTS
 Give each chapter a weight tag (High / Medium / Low / Foundation) and say whether the one derived from the bank (below) looks fair. Do not invent frequencies; write "not sure".
```

---

## PART B. THE CONTENTS TO REVIEW


Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(official GATE 2027 CS syllabus, copied verbatim from the IIT Madras PDF)*

- Principles of Layering; Basics of switching (circuit, packet and virtual circuit) and performance metrics.
- Data link layer: error detection, Medium Access Control, Ethernet.
- Distance vector and link state routing.
- IPv4 - Fragmentation, CIDR Notation, Network Address Translation.
- TCP - flow control and congestion control, socket API.
- DNS and HTTP.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Layering and switching | 3 topics ready | written (old standard; to be rewritten) |
| 02 | Data link and MAC | 6 topics ready | written (old standard; to be rewritten) |
| 03 | IP addressing and routing | 6 topics ready | written (old standard; to be rewritten) |
| 04 | TCP, UDP and flow control | 5 topics ready | written (old standard; to be rewritten) |
| 05 | Application layer | 5 topics ready | written (old standard; to be rewritten) |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **76**; marks: **118** = **7.9%** of all 1500 marks (about 7.9 marks a paper).
- Forge (our own) questions for this subject: **28**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging) | 18 | 34 | 2.27% | 9 | 0/17/1 | MCQ2×8, NAT2×8, MSQ1×1, MCQ1×1 |
| Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT) | 21 | 31 | 2.07% | 9 | 7/13/1 | MSQ2×3, MCQ1×6, NAT1×2, NAT2×3, MSQ1×3, MCQ2×4 |
| Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets) | 15 | 22 | 1.47% | 9 | 3/11/1 | MCQ1×5, MCQ2×1, NAT2×4, MSQ1×2, MSQ2×2, NAT1×1 |
| Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing) | 8 | 13 | 0.87% | 6 | 2/6/0 | MCQ2×1, MCQ1×2, NAT2×3, MSQ1×1, MSQ2×1 |
| Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security | 9 | 12 | 0.80% | 7 | 2/5/2 | MSQ1×1, MCQ1×3, MSQ2×1, NAT1×2, NAT2×2 |
| OSI & TCP/IP Protocol Layers | 5 | 6 | 0.40% | 4 | 3/2/0 | MCQ1×4, MCQ2×1 |


---

## PART C. ALL 76 PREVIOUS-YEAR QUESTIONS (Computer Networks)

Official key marked "✔ official". Figures are not shown; the question says so.

**2026_FN_Q18** · 2026-FN · MCQ · 1 mark · Easy · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

With respect to a TCP connection between a client and a server, which one of the following statements is true?

- A) The client and server use a two-way handshake mechanism before the start of data transmission.
- B) The server cannot initiate closing of the connection before the client initiates closing of the connection.
- C) The TCP connection is half-duplex.
- D) The client and server can initiate closing of the connection at the same time.  ✔ official

---

**2026_FN_Q19** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

Which of the following statements is/are true with respect to the interaction of a web browser with a web server using HTTP 1.1?

- A) HTTP 1.1 facilitates downloading multiple objects of the same webpage over the same TCP connection, if the objects are stored in the same server.  ✔ official
- B) HTTP 1.1 facilitates downloading multiple objects of the same webpage over the same TCP connection, even if they are stored in different servers.
- C) HTTP 1.1 facilitates sending a request for downloading one object without waiting for a previously requested object to be downloaded completely.  ✔ official
- D) HTTP 1.1 facilitates downloading multiple webpages on the same server to be downloaded over a single TCP connection.  ✔ official

---

**2026_AN_Q21** · 2026-AN · MCQ · 1 mark · Medium · bank topic: OSI & TCP/IP Protocol Layers

Consider a file of size 4 million bytes being transferred between two hosts connected via a path consisting of three consecutive links of bandwidth 2 Mbps, 500 kbps, and 1 Mbps, respectively. All processing delays and propagation delays are negligible. Assume that there is no other background traffic over the path and no other additional overhead to transfer the file.
Which one of the following is the total time (in seconds) to transfer the file?
**Note:** 1M = \( 10^6 \), 1k = \( 10^3 \)

- A) 731
- B) 64  ✔ official
- C) 8
- D) 16

---

**2026_AN_Q22** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Which one of the following protocols may need to broadcast some of its messages?

- A) SMTP
- B) FTP
- C) DHCP  ✔ official
- D) HTTP

---

**2026_AN_Q33** · 2026-AN · NAT · 1 mark · Easy · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

If an IP network uses a subnet mask of 255.255.240.0, the maximum number of IP addresses that can be assigned to network interfaces is ________. (answer in integer)

Official answer (numeric): 4094 to 4094

---

**2026_AN_Q43** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider the transmission of data bits 110001011 over a link that uses Cyclic Redundancy Check (CRC) code for error detection. If the generator bit pattern is given to be 1001, which one of the following options shows the remainder bit pattern appended to the data bits before transmission?

- A) 011
- B) 101
- C) 000
- D) 100  ✔ official

---

**2026_FN_Q44** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

A TCP sender successfully establishes a connection with a TCP receiver and starts the transmission of segments. The TCP congestion control mechanism's slow-start threshold is set to 10000 segments. Assume that the round-trip time is fixed at 1 millisecond. Assume that the sender always has data to send, the segments are numbered from 1, and no segment is lost. Let \( t \) denote the time (in milliseconds) at which the transmission of segment number 2000 starts. Which one of the following options is correct?

- A) \( 9 \le t < 10 \)
- B) \( 10 \le t < 11 \)  ✔ official
- C) \( 11 \le t < 12 \)
- D) \( 12 \le t < 13 \)

---

**2026_FN_Q45** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider the implementation of sliding window protocol over a lossless link, with a window size of \( W \) frames, where each frame is of size 1000 bits (including header). The bandwidth of the link is 100 kbps (1k = \( 10^3 \)) and the one-way propagation delay is 100 milliseconds. Assume that processing times at the sender and receiver are zero and the transmission time of acknowledgements is also zero. Which one of the following options gives the minimum size of \( W \) (in number of frames) required to achieve 100% link utilization?

- A) 10
- B) 21  ✔ official
- C) 20
- D) 11

---

**2026_FN_Q56** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

An ISP having an address block 202.16.0.0/15 assigns a block of 6000 IP addresses to a client, using the classless internet domain routing (CIDR) super-netting approach.
Which of the following address blocks can be assigned by the ISP?

- A) 202.16.0.0/19  ✔ official
- B) 202.17.64.0/19  ✔ official
- C) 202.16.32.0/19  ✔ official
- D) 202.17.24.0/19

---

**2026_AN_Q58** · 2026-AN · NAT · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider a new TCP connection between a sender and a receiver. The receiver advertised window is constant at 48 KB, the maximum segment size (MSS) is 2 KB, and the slow start threshold for TCP congestion control is 16 KB. Assume that there are no timeouts or duplicate acknowledgements. The number of rounds of transmission required for the congestion control algorithm of the TCP connection to reach the congestion avoidance phase is ________. (answer in integer)
Note: 1K = \( 2^{10} \)

Official answer (numeric): 4 to 4

---

**2026_AN_Q65** · 2026-AN · NAT · 2 marks · Hard · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

It is necessary to design a link-layer protocol between two hosts that are directly connected over a lossless link of length 3000 kilometers. Assume that the link bandwidth is \( 10^8 \) bits per second and that the propagation delay in the link is 5 nanoseconds per meter. Every transmitted data byte is assigned a unique sequence number.
Let \( N \) be the minimum number of bits needed for the sequence number field in the protocol header such that
(i) the sequence numbers do not wrap around before 60 seconds, and
(ii) the maximum utilization of the link is achieved.
The value of \( N \) is ________. (answer in integer)

Official answer (numeric): 30 to 30

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

**2025_AN_Q18** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

A machine receives an IPv4 datagram. The protocol field of the IPv4 header has the protocol number of a protocol X.
Which ONE of the following is NOT a possible candidate for X?

- A) Internet Control Message Protocol (ICMP)
- B) Internet Group Management Protocol (IGMP)
- C) Open Shortest Path First (OSPF)
- D) Routing Information Protocol (RIP)  ✔ official

---

**2025_FN_Q22** · 2025-FN · MSQ · 1 mark · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider the 3-way handshaking protocol for TCP connection establishment. Let the three packets exchanged during the connection establishment be denoted as P1, P2, and P3, in order. Which of the following option(s) is/are TRUE with respect to TCP header flags that are set in the packets?

- A) P3: SYN = 1, ACK = 1
- B) P2: SYN = 1, ACK = 1  ✔ official
- C) P2: SYN = 0, ACK = 1
- D) P1: SYN = 1  ✔ official

---

**2025_AN_Q23** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Consider a network that uses Ethernet and IPv4. Assume that IPv4 headers do not use any options field. Each Ethernet frame can carry a maximum of 1500 bytes in its data field. A UDP segment is transmitted. The payload (data) in the UDP segment is 7488 bytes.
Which ONE of the following choices has the CORRECT total number of fragments transmitted and the size of the last fragment including IPv4 header?

- A) 5 fragments, 1488 bytes
- B) 6 fragments, 88 bytes
- C) 6 fragments, 108 bytes
- D) 6 fragments, 116 bytes  ✔ official

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

**2025_FN_Q57** · 2025-FN · NAT · 2 marks · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT) · HAS A FIGURE (not shown here)

Suppose a message of size 15000 bytes is transmitted from a source to a destination using IPv4 protocol via two routers as shown in the figure. Each router has a defined maximum transmission unit (MTU) as shown in the figure, including IP header. The number of fragments that will be delivered to the destination is ________. (Answer in integer)
[IMAGE_Q_57_1]

Official answer (numeric): 7 to 7

---

**2024_FN_Q19** · 2024-FN · MCQ · 1 mark · Medium · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

A user starts browsing a webpage hosted at a remote server. The browser opens a single connection to fetch the entire webpage from the server. The webpage consists of a top-level index page with multiple embedded image objects. Assume that all caches (e.g., DNS cache, browser cache) are all initially empty. The following packets leave the user's computer in some order.
(i) HTTP GET request for the index page.
(ii) DNS request to resolve the web server's name to its IP address.
(iii) HTTP GET request for an image object.
(iv) TCP SYN to open a connection to the web server.
Which one of the following is the CORRECT chronological order (earliest in time to latest) of the packets leaving the computer ?

- A) (iv), (ii), (iii), (i)
- B) (ii), (iv), (iii), (i)
- C) (ii), (iv), (i), (iii)  ✔ official
- D) (iv), (ii), (i), (iii)

---

**2024_AN_Q14** · 2024-AN · MSQ · 1 mark · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Node X has a TCP connection open to node Y. The packets from X to Y go through an intermediate IP router R. Ethernet switch S is the first switch on the network path between X and R. Consider a packet sent from X to Y over this connection.
Which of the following statements is/are TRUE about the destination IP and MAC addresses on this packet at the time it leaves X?

- A) The destination IP address is the IP address of R.
- B) The destination IP address is the IP address of Y.  ✔ official
- C) The destination MAC address is the MAC address of S.
- D) The destination MAC address is the MAC address of Y.

---

**2024_AN_Q30** · 2024-AN · MSQ · 1 mark · Easy · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Which of the following statements about IPv4 fragmentation is/are TRUE?

- A) The fragmentation of an IP datagram is performed only at the source of the datagram.
- B) The fragmentation of an IP datagram is performed at any IP router which finds that the size of the datagram to be transmitted exceeds the MTU.  ✔ official
- C) The reassembly of fragments is performed only at the destination of the datagram.  ✔ official
- D) The reassembly of fragments is performed at all intermediate routers along the path from the source to the destination.

---

**2024_FN_Q23** · 2024-FN · MSQ · 1 mark · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

TCP client P successfully establishes a connection to TCP server Q. Let \( N_P \) denote the sequence number in the SYN sent from \( P \) to \( Q \). Let \( N_Q \) denote the acknowledgement number in the SYN ACK from \( Q \) to \( P \). Which of the following statements is/are CORRECT?

- A) The sequence number \( N_P \) is chosen randomly by \( P \)  ✔ official
- B) The sequence number \( N_Q \) is always 0 for a new connection
- C) The acknowledgement number \( N_Q \) is equal to \( N_P \)
- D) The acknowledgement number \( N_Q \) is equal to \( N_P + 1 \)  ✔ official

---

**2024_FN_Q29** · 2024-FN · MSQ · 1 mark · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Which of the following fields is/are modified in the IP header of a packet going out of a network address translation (NAT) device from an internal network to an external network?

- A) Source IP  ✔ official
- B) Destination IP
- C) Header Checksum  ✔ official
- D) Total Length

---

**2024_AN_Q29** · 2024-AN · MSQ · 1 mark · Easy · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Which of the following fields of an IP header is/are always modified by any router before it forwards the IP packet?

- A) Source IP Address
- B) Protocol
- C) Time to Live (TTL)  ✔ official
- D) Header Checksum  ✔ official

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

**2024_AN_Q45** · 2024-AN · MCQ · 2 marks · Easy · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Which one of the following CIDR prefixes exactly represents the range of IP addresses 10.12.2.0 to 10.12.3.255?

- A) 10.12.2.0/23  ✔ official
- B) 10.12.2.0/24
- C) 10.12.0.0/22
- D) 10.12.2.0/22

---

**2024_AN_Q58** · 2024-AN · NAT · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider a TCP connection operating at a point of time with the congestion window of size 12 MSS (Maximum Segment Size), when a timeout occurs due to packet loss. Assuming that all the segments transmitted in the next two RTTs (Round Trip Time) are acknowledged correctly, the congestion window size (in MSS) during the third RTT will be ________.

Official answer (numeric): 4 to 4

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

**2024_FN_Q43** · 2024-FN · NAT · 2 marks · Hard · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Consider sending an IP datagram of size 1420 bytes (including 20 bytes of IP header) from a sender to a receiver over a path of two links with a router between them. The first link (sender to router) has an MTU (Maximum Transmission Unit) size of 542 bytes, while the second link (router to receiver) has an MTU size of 360 bytes. The number of fragments that would be delivered at the receiver is ________.

Official answer (numeric): 6 to 6

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

**2023_FN_Q50** · 2023-FN · MSQ · 2 marks · Hard · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Suppose you are asked to design a new reliable byte-stream transport protocol like TCP. This protocol, named myTCP, runs over a 100 Mbps network with Round Trip Time of 150 milliseconds and the maximum segment lifetime of 2 minutes. Which of the following is/are valid lengths of the Sequence Number field in the myTCP header?

- A) 30 bits
- B) 32 bits  ✔ official
- C) 34 bits  ✔ official
- D) 36 bits  ✔ official

---

**2023_FN_Q52** · 2023-FN · MSQ · 2 marks · Medium · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

Suppose in a web browser, you click on the www.gate-2023.in URL. The browser cache is empty. The IP address for this URL is not cached in your local host, so a DNS lookup is triggered (by the local DNS server deployed on your local host) over the 3-tier DNS hierarchy in an iterative mode. No resource records are cached anywhere across all DNS servers.
Let RTT denote the round trip time between your local host and DNS servers in the DNS hierarchy. The round trip time between the local host and the web server hosting www.gate-2023.in is also equal to RTT. The HTML file associated with the URL is small enough to have negligible transmission time and negligible rendering time by your web browser, which references 10 equally small objects on the same web server.
Which of the following statements is/are CORRECT about the minimum elapsed time between clicking on the URL and your browser fully rendering it?

- A) 7 RTTs, in case of non-persistent HTTP with 5 parallel TCP connections.
- B) 5 RTTs, in case of persistent HTTP with pipelining.
- C) 9 RTTs, in case of non-persistent HTTP with 5 parallel TCP connections.  ✔ official
- D) 6 RTTs, in case of persistent HTTP with pipelining.  ✔ official

---

**2023_FN_Q65** · 2023-FN · NAT · 2 marks · Medium · bank topic: Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing) · HAS A FIGURE (not shown here)

The forwarding table of a router is shown below:
[IMAGE_Q_65]
A packet addressed to a destination address 200.150.68.118 arrives at the router. It will be forwarded to the interface with ID ________.

Official answer (numeric): 3 to 3

---

**2022_FN_Q22** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT) · HAS A FIGURE (not shown here)

Consider an enterprise network with two Ethernet segments, a web server and a firewall, connected via three routers as shown below.

[IMAGE_Q_22]

What is the number of subnets inside the enterprise network?

- A) 3
- B) 12
- C) 6  ✔ official
- D) 8

---

**2022_FN_Q35** · 2022-FN · NAT · 1 mark · Medium · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

Consider the resolution of the domain name www.gate.org.in by a DNS resolver. Assume that no resource records are cached anywhere across the DNS servers and that iterative query mechanism is used in the resolution. The number of DNS query-response pairs involved in completely resolving the domain name is __________.

Official answer (numeric): 4 to 4

---

**2022_FN_Q55** · 2022-FN · MSQ · 2 marks · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT) · HAS A FIGURE (not shown here)

Consider routing table of an organization's router shown below:

[IMAGE_Q_55]

Which of the following prefixes in CIDR notation can be collectively used to correctly aggregate all of the subnets in the routing table?

- A) 12.20.164.0/20
- B) 12.20.164.0/22  ✔ official
- C) 12.20.164.0/21
- D) 12.20.168.0/22  ✔ official

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

**2021_FN_Q13** · 2021-FN · MCQ · 1 mark · Easy · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Consider the following two statements:
\(S_1\) : Destination MAC address of an ARP reply is a broadcast address.
\(S_2\) : Destination MAC address of an ARP request is a broadcast address.
Which one of the following choices is correct?

- A) Both \(S_1\) and \(S_2\) are true.
- B) \(S_1\) is true and \(S_2\) is false.
- C) \(S_1\) is false and \(S_2\) is true.  ✔ official
- D) Both \(S_1\) and \(S_2\) are false.

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

**2021_FN_Q20** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

A TCP server application is programmed to listen on port number \(P\) on host \(S\). A TCP client is connected to the TCP server over the network.
Consider that while the TCP connection was active, the server machine \(S\) crashed and rebooted. Assume that the client does not use the TCP keepalive timer.
Which of the following behaviors is/are possible?

- A) If the client was waiting to receive a packet, it may wait indefinitely.  ✔ official
- B) The TCP server application on \(S\) can listen on \(P\) after reboot.  ✔ official
- C) If the client sends a packet after the server reboot, it will receive a RST segment.  ✔ official
- D) If the client sends a packet after the server reboot, it will receive a FIN segment.

---

**2021_FN_Q22** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Consider two hosts \(P\) and \(Q\) connected through a router \(R\). The maximum transfer unit (MTU) value of the link between \(P\) and \(R\) is 1500 bytes, and between \(R\) and \(Q\) is 820 bytes.
A TCP segment of size 1400 bytes was transferred from \(P\) to \(Q\) through \(R\), with IP identification value as 0x1234. Assume that the IP header size is 20 bytes. Further, the packet is allowed to be fragmented, i.e., Don't Fragment (DF) flag in the IP header is not set by \(P\).
Which of the following statements is/are correct?

- A) Two fragments are created at \(R\) and the IP datagram size carrying the second fragment is 620 bytes.  ✔ official
- B) If the second fragment is lost, \(R\) will resend the fragment with the IP identification value 0x1234
- C) If the second fragment is lost, \(P\) is required to resend the whole TCP segment.  ✔ official
- D) TCP destination port can be determined by analysing only the second fragment.

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

**2020_FN_Q29** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Consider the following statements about the functionality of an IP based router.
I. A router does not modify the IP packets during forwarding.
II. It is not necessary for a router to implement any routing protocol.
III. A router should reassemble IP fragments if the MTU of the outgoing link is larger than the size of the incoming IP packet.
Which of the above statements is/are TRUE?

- A) I and II only
- B) I only
- C) II and III only
- D) II only  ✔ official

---

**2020_FN_Q31** · 2020-FN · NAT · 1 mark · Easy · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

Assume that you have made a request for a web page through your web browser to a web server. Initially the browser cache is empty. Further, the browser is configured to send HTTP requests in non-persistent mode. The web page contains text and five very small images. The minimum number of TCP connections required to display the web page completely in your browser is ________.

Official answer (numeric): 6 to 6

---

**2020_FN_Q64** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

An organization requires a range of IP addresses to assign one to each of its 1500 computers. The organization has approached an Internet Service Provider (ISP) for this task. The ISP uses CIDR and serves the requests from the available IP address space 202.61.0.0/17. The ISP wants to assign an address space to the organization which will minimize the number of routing entries in the ISP's router using route aggregation.
Which of the following address spaces are potential candidates from which the ISP can allot any one to the organization?
I. 202.61.84.0/21
II. 202.61.104.0/21
III. 202.61.64.0/21
IV. 202.61.144.0/21

- A) I and II only
- B) II and III only  ✔ official
- C) III and IV only
- D) I and IV only

---

**2020_FN_Q62** · 2020-FN · NAT · 2 marks · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider a TCP connection between a client and a server with the following specifications: the round trip time is 6 ms, the size of the receiver advertised window is 50 KB, slow-start threshold at the client is 32 KB, and the maximum segment size is 2 KB. The connection is established at time \( t = 0 \). Assume that there are no timeouts and errors during transmission. Then the size of the congestion window (in KB) at time \( t + 60 \) ms after all acknowledgments are processed is ________.

Official answer (numeric): 44 to 44

---

**2019_FN_Q25** · 2019-FN · MCQ · 1 mark · Easy · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

Which of the following protocol pairs can be used to send and retrieve e-mails (in that order)?

- A) IMAP, POP3
- B) SMTP, POP3  ✔ official
- C) SMTP, MIME
- D) IMAP, SMTP

---

**2019_FN_Q58** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Consider three machines M, N and P with IP addresses 100.10.5.2, 100.10.5.5 and 100.10.5.6 respectively. The subnet mask is set to 255.255.255.252 for all the three machines. Which one of the following is true?

- A) M, N and P all belong to the same subnet
- B) Only M and N belong to the same subnet
- C) Only N and P belong to the same subnet  ✔ official
- D) M, N, and P belong to three different subnets

---

**2019_FN_Q64** · 2019-FN · MCQ · 2 marks · Easy · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Suppose that in an IP-over-Ethernet network, a machine X wishes to find the MAC address of another machine Y in its subnet. Which one of the following techniques can be used for this?

- A) X sends an ARP request packet to the local gateway’s IP address which then finds the MAC address of Y and sends to X
- B) X sends an ARP request packet to the local gateway’s MAC address which then finds the MAC address of Y and sends to X
- C) X sends an ARP request packet with broadcast MAC address in its local subnet  ✔ official
- D) X sends an ARP request packet with broadcast IP address in its local subnet

---

**2019_FN_Q62** · 2019-FN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider that 15 machines need to be connected in a LAN using 8-port Ethernet switches. Assume that these switches do not have any separate uplink ports. The minimum number of switches needed is ________.

Official answer (numeric): 3 to 3

---

**2019_FN_Q46** · 2019-FN · NAT · 2 marks · Hard · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

In an RSA cryptosystem, the value of the public modulus parameter \( n \) is 3007. If it is also known that \( \phi(n) = 2880 \), where \( \phi() \) denotes Euler’s Totient Function, then the prime factor of \( n \) which is greater than 50 is ________.

Official answer (numeric): 97 to 97

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

**2018_FN_Q64** · 2018-FN · NAT · 2 marks · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Consider an IP packet with a length of 4,500 bytes that includes a 20-byte IPv4 header and a 40-byte TCP header. The packet is forwarded to an IPv4 router that supports a Maximum Transmission Unit (MTU) of 600 bytes. Assume that the length of the IP header in all the outgoing fragments of this packet is 20 bytes. Assume that the fragmentation offset value stored in the first fragment is 0.
The fragmentation offset value stored in the third fragment is _______.

Official answer (numeric): 144 to 144

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

**2017_FN_Q12** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider a TCP client and a TCP server running on two different machines. After completing data transfer, the TCP client calls close to terminate the connection and a FIN segment is sent to the TCP server. Server-side TCP responds by sending an ACK, which is received by the client-side TCP. As per the TCP connection state diagram (RFC 793), in which state does the client-side TCP connection wait for the FIN from the server-side TCP?

- A) LAST-ACK
- B) TIME-WAIT
- C) FIN-WAIT-1
- D) FIN-WAIT-2  ✔ official

---

**2017_FN_Q28** · 2017-FN · MCQ · 1 mark · Hard · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

A sender S sends a message \(m\) to receiver R, which is digitally signed by S with its private key. In this scenario, one or more of the following security violations can take place.
I. S can launch a birthday attack to replace \(m\) with a fraudulent message.
II. A third party attacker can launch a birthday attack to replace \(m\) with a fraudulent message.
III. R can launch a birthday attack to replace \(m\) with a fraudulent message.
Which of the following are possible security violations?

- A) I and II only
- B) I only  ✔ official
- C) II only
- D) II and III only

---

**2017_AN_Q18** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider socket API on a Linux machine that supports connected UDP sockets. A connected UDP socket is a UDP socket on which connect function has already been called. Which of the following statements is/are CORRECT?
I. A connected UDP socket can be used to communicate with multiple peers simultaneously.
II. A process can successfully call connect function again for an already connected UDP socket.

- A) I only
- B) II only  ✔ official
- C) Both I and II
- D) Neither I nor II

---

**2017_AN_Q27** · 2017-AN · NAT · 1 mark · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

The maximum number of IPv4 router addresses that can be listed in the record route (RR) option field of an IPv4 header is ________.

Official answer (numeric): 9.0 to 9.0

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

**2017_FN_Q47** · 2017-FN · NAT · 2 marks · Medium · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

In a RSA cryptosystem, a participant A uses two prime numbers \(p = 13\) and \(q = 17\) to generate her public and private keys. If the public key of A is 35, then the private key of A is ________.

Official answer (numeric): 11.0 to 11.0

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

