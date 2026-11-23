# Review input: Computer Networks, chapter 03: IP addressing and routing

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-03-ip-addressing-and-routing.md` and `gemini-03-ip-addressing-and-routing.md` in this folder.

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

This is **one chapter** (3 of 5) of the Computer Networks book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **IP addressing and routing**. Written lessons today: 6 topics ready.



## The PYQs for this chapter (29)

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

**2026_FN_Q56** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

An ISP having an address block 202.16.0.0/15 assigns a block of 6000 IP addresses to a client, using the classless internet domain routing (CIDR) super-netting approach.
Which of the following address blocks can be assigned by the ISP?

- A) 202.16.0.0/19  ✔ official
- B) 202.17.64.0/19  ✔ official
- C) 202.16.32.0/19  ✔ official
- D) 202.17.24.0/19

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

**2025_AN_Q23** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Consider a network that uses Ethernet and IPv4. Assume that IPv4 headers do not use any options field. Each Ethernet frame can carry a maximum of 1500 bytes in its data field. A UDP segment is transmitted. The payload (data) in the UDP segment is 7488 bytes.
Which ONE of the following choices has the CORRECT total number of fragments transmitted and the size of the last fragment including IPv4 header?

- A) 5 fragments, 1488 bytes
- B) 6 fragments, 88 bytes
- C) 6 fragments, 108 bytes
- D) 6 fragments, 116 bytes  ✔ official

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

**2024_AN_Q30** · 2024-AN · MSQ · 1 mark · Easy · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Which of the following statements about IPv4 fragmentation is/are TRUE?

- A) The fragmentation of an IP datagram is performed only at the source of the datagram.
- B) The fragmentation of an IP datagram is performed at any IP router which finds that the size of the datagram to be transmitted exceeds the MTU.  ✔ official
- C) The reassembly of fragments is performed only at the destination of the datagram.  ✔ official
- D) The reassembly of fragments is performed at all intermediate routers along the path from the source to the destination.

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

**2024_AN_Q45** · 2024-AN · MCQ · 2 marks · Easy · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Which one of the following CIDR prefixes exactly represents the range of IP addresses 10.12.2.0 to 10.12.3.255?

- A) 10.12.2.0/23  ✔ official
- B) 10.12.2.0/24
- C) 10.12.0.0/22
- D) 10.12.2.0/22

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

**2022_FN_Q22** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT) · HAS A FIGURE (not shown here)

Consider an enterprise network with two Ethernet segments, a web server and a firewall, connected via three routers as shown below.

[IMAGE_Q_22]

What is the number of subnets inside the enterprise network?

- A) 3
- B) 12
- C) 6  ✔ official
- D) 8

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

**2018_FN_Q64** · 2018-FN · NAT · 2 marks · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

Consider an IP packet with a length of 4,500 bytes that includes a 20-byte IPv4 header and a 40-byte TCP header. The packet is forwarded to an IPv4 router that supports a Maximum Transmission Unit (MTU) of 600 bytes. Assume that the length of the IP header in all the outgoing fragments of this packet is 20 bytes. Assume that the fragmentation offset value stored in the first fragment is 0.
The fragmentation offset value stored in the third fragment is _______.

Official answer (numeric): 144 to 144

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

**2017_AN_Q27** · 2017-AN · NAT · 1 mark · Medium · bank topic: Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)

The maximum number of IPv4 router addresses that can be listed in the record route (RR) option field of an IPv4 header is ________.

Official answer (numeric): 9.0 to 9.0

