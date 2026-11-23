# Review input: Computer Networks, chapter 05: Application layer

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-05-application-layer.md` and `gemini-05-application-layer.md` in this folder.

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

This is **one chapter** (5 of 5) of the Computer Networks book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Application layer**. Written lessons today: 5 topics ready.



## The PYQs for this chapter (42)

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

**2025_FN_Q22** · 2025-FN · MSQ · 1 mark · Medium · bank topic: Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)

Consider the 3-way handshaking protocol for TCP connection establishment. Let the three packets exchanged during the connection establishment be denoted as P1, P2, and P3, in order. Which of the following option(s) is/are TRUE with respect to TCP header flags that are set in the packets?

- A) P3: SYN = 1, ACK = 1
- B) P2: SYN = 1, ACK = 1  ✔ official
- C) P2: SYN = 0, ACK = 1
- D) P1: SYN = 1  ✔ official

---

**2025_AN_Q36** · 2025-AN · MCQ · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Suppose we are transmitting frames between two nodes using Stop-and-Wait protocol. The frame size is 3000 bits. The transmission rate of the channel is 2000 bps (bits/second) and the propagation delay between the two nodes is 100 milliseconds. Assume that the processing times at the source and destination are negligible. Also, assume that the size of the acknowledgement packet is negligible. Which ONE of the following most accurately gives the channel utilization for the above scenario in percentage?

- A) 88.23  ✔ official
- B) 93.75
- C) 85.44
- D) 66.67

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

**2024_AN_Q36** · 2024-AN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider an Ethernet segment with a transmission speed of \( 10^8 \) bits/sec and a maximum segment length of 500 meters. If the speed of propagation of the signal in the medium is \( 2 \times 10^8 \) meters/sec, then the minimum frame size (in bits) required for collision detection is ________.

Official answer (numeric): 500 to 500

---

**2023_FN_Q17** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Suppose two hosts are connected by a point-to-point link and they are configured to use Stop-and-Wait protocol for reliable data transfer. Identify in which one of the following scenarios, the utilization of the link is the lowest.

- A) Longer link length and lower transmission rate
- B) Longer link length and higher transmission rate  ✔ official
- C) Shorter link length and lower transmission rate
- D) Shorter link length and higher transmission rate

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

**2022_FN_Q35** · 2022-FN · NAT · 1 mark · Medium · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

Consider the resolution of the domain name www.gate.org.in by a DNS resolver. Assume that no resource records are cached anywhere across the DNS servers and that iterative query mechanism is used in the resolution. The number of DNS query-response pairs involved in completely resolving the domain name is __________.

Official answer (numeric): 4 to 4

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

**2020_FN_Q31** · 2020-FN · NAT · 1 mark · Easy · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

Assume that you have made a request for a web page through your web browser to a web server. Initially the browser cache is empty. Further, the browser is configured to send HTTP requests in non-persistent mode. The web page contains text and five very small images. The minimum number of TCP connections required to display the web page completely in your browser is ________.

Official answer (numeric): 6 to 6

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

**2019_FN_Q62** · 2019-FN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider that 15 machines need to be connected in a LAN using 8-port Ethernet switches. Assume that these switches do not have any separate uplink ports. The minimum number of switches needed is ________.

Official answer (numeric): 3 to 3

---

**2019_FN_Q46** · 2019-FN · NAT · 2 marks · Hard · bank topic: Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security

In an RSA cryptosystem, the value of the public modulus parameter \( n \) is 3007. If it is also known that \( \phi(n) = 2880 \), where \( \phi() \) denotes Euler’s Totient Function, then the prime factor of \( n \) which is greater than 50 is ________.

Official answer (numeric): 97 to 97

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

**2018_FN_Q65** · 2018-FN · NAT · 2 marks · Medium · bank topic: Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)

Consider a simple communication system where multiple nodes are connected by a shared broadcast medium (like Ethernet or wireless). The nodes in the system use the following carrier-sense based medium access protocol. A node that receives a packet to transmit will carrier-sense the medium for 5 units of time. If the node does not detect any other transmission in this duration, it starts transmitting its packet in the next time unit. If the node detects another transmission, it waits until this other transmission finishes, and then begins to carrier-sense for 5 time units again. Once they start to transmit, nodes do not perform any collision detection and continue transmission even if a collision occurs. All transmissions last for 20 units of time. Assume that the transmission signal travels at the speed of 10 meters per unit time in the medium.
Assume that the system has two nodes P and Q, located at a distance \(d\) meters from each other. P starts transmitting a packet at time \(t=0\) after successfully completing its carrier-sense phase. Node Q has a packet to transmit at time \(t=0\) and begins to carrier-sense the medium.
The maximum distance \(d\) (in meters, rounded to the closest integer) that allows Q to successfully avoid a collision between its proposed transmission and P’s ongoing transmission is _____.

Official answer (numeric): 50 to 50

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

