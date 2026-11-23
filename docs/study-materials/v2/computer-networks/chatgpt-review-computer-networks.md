# GATE CS Computer Networks — Deep Student Review, PYQ Audit and Claude Writing Specification

**Review date:** 24 November 2026  
**Source reviewed:** `Pasted markdown(2).md` (the uploaded 2,007-line review-input file)  
**Version assessed:** Contents and PYQ bank v0  
**Intended exam:** GATE CS 2027  
**Verdict:** Correct the syllabus map and build a small teaching pilot. Do **not** start bulk rewriting or sell the subject book yet.

---

## 0. What I actually reviewed — and what I did not

The attached file contains three things:

1. A reviewer instruction set (Part A).
2. A short contents list, a five-chapter app status table, and a PYQ summary (Part B).
3. A bank of 76 question statements with selected options or numeric answer ranges (Part C).

It does **not** contain the actual 22 topic/lesson texts, diagrams, worked solutions, the `01-MASTER-PROMPT.md`, the old chapters, or the other supporting project documents. So this report can assess the **plan, chapter architecture, syllabus mapping, bank metadata, transcriptions and supplied keys**. It cannot honestly claim that it has audited the teaching quality of the unseen lesson text.

The five current chapter titles are:

| # | Current chapter | App status reported in the input |
|---|---|---|
| 01 | Layering and switching | 3 topics ready; old standard; to be rewritten |
| 02 | Data link and MAC | 6 topics ready; old standard; to be rewritten |
| 03 | IP addressing and routing | 6 topics ready; old standard; to be rewritten |
| 04 | TCP, UDP and flow control | 5 topics ready; old standard; to be rewritten |
| 05 | Application layer | 5 topics ready; old standard; to be rewritten |

**Important limitation:** “3 topics ready” or “6 topics ready” tells me nothing about whether those topics teach the required concepts correctly. A chapter title is not evidence of coverage. In Parts 2 and 3, I therefore use the careful wording **“not demonstrated in v0”** where the input does not show enough detail to prove that a topic is absent.

---

# PART 1. FEELINGS — as the student described in the brief

1. I could understand the five chapter names, but I could not tell what I would actually learn inside them.
2. “Layering and switching” sounds important, but I need someone to show me how one message becomes data, a segment, a packet and a frame.
3. I would be scared by a question about CIDR, fragmentation or TCP windows if the book jumps straight to formulas.
4. I need delay calculations taught with units and timelines; I do not want a formula dropped on me with no physical meaning.
5. I would feel more confident if every numerical question showed the first line, the next line and why that step is allowed.
6. I would be confused by the old chapter names because the GATE 2027 syllabus has changed and the input still lists several older topics.
7. I would worry that “5 topics ready” means five short notes, not a complete lesson that starts from zero.
8. The PYQ bank makes the subject look manageable, but nine questions have missing figures, so I cannot practise them from this file.
9. I would like a book that marks what is current for 2027 and what is only an older-paper extension.
10. **Would I pay ₹149 now? No.** I have seen a contents list and a question bank, not a finished beginner book, clear explanations, diagrams, worked examples or reliable lesson-level coverage.

---

# PART 2. GAP TABLE — problems I can identify from this v0 file

The table below deliberately separates (a) defects visible in the supplied file, (b) missing evidence that a beginner would need before the book can be trusted, and (c) syllabus corrections established by the GATE 2027 comparison.

| # | Where | What I could not understand or what is missing | Type | What to add or change | Priority |
|---:|---|---|---|---|---|
| 1 | Part B, status | “3 topics ready” does not tell me their names or learning outcomes. | UNCLEAR-ENGLISH | List every lesson title and the exact thing I should be able to do after it. | HIGH |
| 2 | Part B, all chapters | No lesson-level order is shown. | WRONG-ORDER | Add a prerequisite sequence from bits, units and basic arithmetic to packet calculations and protocols. | HIGH |
| 3 | Part B, all chapters | The actual lessons are not attached, so their beginner quality cannot be checked. | FACT-DOUBT | Treat this file as a contents draft, not as evidence that the books are complete. Attach the lesson exports before approving the rewrite. | HIGH |
| 4 | Part B, syllabus note | It says the syllabus was written from memory. That is not safe for a 2027 product. | FACT-DOUBT | Replace it with the exact 2027 official CS syllabus wording and retain the 2026 comparison in a separate change note. | HIGH |
| 5 | Part B, syllabus | The listed CN syllabus is the longer 2026 wording, not the revised 2027 wording. | MISSING-GATE-CONCEPT | Add the new explicit phrase “performance metrics” and use the revised 2027 list as the main scope. | HIGH |
| 6 | Chapter 01 | “Layering” is not broken into service, interface, protocol, encapsulation or decapsulation. | MISSING-PREREQUISITE | Teach what a layer provides, what it uses, peer communication, headers/trailers and data-unit names. | HIGH |
| 7 | Chapter 01 | I cannot see whether the book explains why a packet needs several headers. | NEEDS-DIAGRAM | Draw one message moving down a sender stack and up a receiver stack. | HIGH |
| 8 | Chapter 01 | “Switching” gives no indication of what happens inside a switch or router. | UNEXPLAINED-WORD | Define circuit, packet and virtual-circuit switching with a simple real-world analogy and a network example. | HIGH |
| 9 | Chapter 01 | The difference between a packet route and a reserved logical path is not visible. | NEEDS-EXAMPLE | Show the same source/destination under circuit, datagram packet and virtual-circuit switching. | HIGH |
| 10 | Chapter 01 | 2027 explicitly adds switching performance metrics, but no lesson title says “performance.” | MISSING-GATE-CONCEPT | Add transmission delay, propagation delay, processing delay, queuing delay, throughput, utilisation and bandwidth–delay product. | HIGH |
| 11 | Chapter 01 | I do not know whether “bandwidth” means bits per second or amount of data. | UNEXPLAINED-WORD | Explain bandwidth, data rate, capacity and throughput separately, with units. | HIGH |
| 12 | Chapter 01 | There is no visible method for multi-link file-transfer questions. | NEEDS-TRACE | Teach bottleneck throughput versus store-and-forward completion time; state the packetisation assumptions. | HIGH |
| 13 | Chapter 01 | No time-line is shown for transmission and propagation. | NEEDS-DIAGRAM | Use a sender–link–receiver time line with a packet entering and leaving the link. | HIGH |
| 14 | Chapter 01 | No mention of packetisation or pipelining appears in the outline. | MISSING-FINER-POINT | Show how later packets overlap on a multi-hop path and why the total time is not always the sum of whole-file transmission times on every hop. | HIGH |
| 15 | Chapter 01 | “OSI and TCP/IP stacks” are still implied by the title, but they are no longer named as memorisation targets in the 2027 CN wording. | FACT-DOUBT | Teach layering principles; keep the OSI/TCP-IP comparison as a short orientation, not a large memorisation chapter. | HIGH |
| 16 | Chapter 02 | “Data link and MAC” does not say how framing is taught. | MISSING-PREREQUISITE | Explain why a receiver needs frame boundaries; briefly cover length, delimiter/flag, byte stuffing and bit stuffing as background. | HIGH |
| 17 | Chapter 02 | “Framing” was explicitly present in the 2026 wording but is no longer separately named in 2027. | FACT-DOUBT | Keep only the framing knowledge needed to understand Ethernet and data-link operation; do not let it displace 2027 topics. | MEDIUM |
| 18 | Chapter 02 | Error detection is not broken down into parity, checksum and CRC. | MISSING-GATE-CONCEPT | Add a progressive sequence: parity first, then checksum concept, then CRC modulo-2 division. | HIGH |
| 19 | Chapter 02 | I need to know why XOR is used in CRC, not just how to divide bit strings. | MISSING-PREREQUISITE | Teach binary XOR and polynomial notation over GF(2) before CRC. | HIGH |
| 20 | Chapter 02 | No indication that CRC remainders are worked bit by bit. | NEEDS-TRACE | Add a division table showing each XOR step and the final remainder. | HIGH |
| 21 | Chapter 02 | Error detection and error correction may be mixed together. | FACT-DOUBT | Label parity/CRC as detection methods and Hamming code as error-correction background; explain the difference. | HIGH |
| 22 | Chapter 02 | Hamming distance is not visible in the outline. | MISSING-FINER-POINT | Add minimum distance, detectable errors and correctable errors as a short extension if retaining historical PYQs. | MEDIUM |
| 23 | Chapter 02 | MAC is a name, not a lesson. | UNEXPLAINED-WORD | Define a shared medium, a collision, carrier sensing, backoff and the purpose of a MAC protocol. | HIGH |
| 24 | Chapter 02 | ALOHA and CSMA are not named in the chapter list. | MISSING-GATE-CONCEPT | Add pure/slotted ALOHA and CSMA; connect collision probability and throughput only to the level required by the syllabus and PYQs. | HIGH |
| 25 | Chapter 02 | I cannot see whether CSMA/CD is included. | MISSING-GATE-CONCEPT | Teach classic shared Ethernet collision detection, round-trip propagation and minimum frame size. | HIGH |
| 26 | Chapter 02 | CSMA/CD and CSMA/CA could be confused. | UNEXPLAINED-WORD | Use a comparison box: collision detection versus collision avoidance; mark wireless details as enrichment unless needed. | MEDIUM |
| 27 | Chapter 02 | Ethernet is named, but its frame fields and MAC addresses are not listed. | MISSING-GATE-CONCEPT | Add destination/source MAC, type/length, payload and FCS at a beginner level. | HIGH |
| 28 | Chapter 02 | “Ethernet bridging” is in the older plan, but is not separately named in 2027. | FACT-DOUBT | Keep basic switch forwarding/MAC learning as supporting Ethernet knowledge; label bridge internals and switch-count puzzles as legacy extension. | MEDIUM |
| 29 | Chapter 02 | Sliding-window and stop-and-wait questions appear in the bank, but their location in the book is not stated. | WRONG-ORDER | Separate data-link reliability/window mechanisms from TCP flow control. Make the shared idea clear but do not mix the two layers. | HIGH |
| 30 | Chapter 02 | Link utilisation questions need a clear distinction between frame transmission time and round-trip propagation time. | NEEDS-TRACE | Give a standard utilisation timeline and solve at least one stop-and-wait and one sliding-window example. | HIGH |
| 31 | Chapter 03 | “IP addressing and routing” combines two large areas without showing their internal order. | WRONG-ORDER | Teach IPv4 addresses and binary first, CIDR/subnetting second, fragmentation third, NAT fourth, then routing algorithms. | HIGH |
| 32 | Chapter 03 | There is no visible IPv4 binary-address lesson. | MISSING-PREREQUISITE | Teach octets, binary place values, prefix bits and subnet masks from the beginning. | HIGH |
| 33 | Chapter 03 | CIDR notation is named only indirectly. | MISSING-GATE-CONCEPT | Teach /n prefix length, network bits, host bits, address count, block boundaries and alignment. | HIGH |
| 34 | Chapter 03 | Network and broadcast address rules are not shown. | MISSING-FINER-POINT | Explain traditional IPv4 subnet usable-host calculation and explicitly mention the special /31 and /32 cases only as an extension. | HIGH |
| 35 | Chapter 03 | No subnetting hand method is shown. | NEEDS-TRACE | Add the block-size method and a binary method; explain why both agree. | HIGH |
| 36 | Chapter 03 | Route aggregation/supernetting is not named. | MISSING-GATE-CONCEPT | Add prefix aggregation and alignment; show how several contiguous equal-sized blocks combine. | HIGH |
| 37 | Chapter 03 | Longest-prefix matching is not named, though multiple PYQs need it. | MISSING-GATE-CONCEPT | Add a routing-table lesson with overlapping prefixes and a step-by-step match. | HIGH |
| 38 | Chapter 03 | IPv4 fragmentation is not visible as its own lesson. | MISSING-GATE-CONCEPT | Teach MTU, IP header size, payload multiple-of-8 rule, fragment offset, MF and DF. | HIGH |
| 39 | Chapter 03 | The fragment offset’s unit is an easy trap. | MISSING-FINER-POINT | State and demonstrate that IPv4 fragment offset counts 8-byte units, not bytes. | HIGH |
| 40 | Chapter 03 | Fragmentation across two routers is not visibly taught. | NEEDS-TRACE | Include re-fragmentation of an already fragmented datagram and a table of each fragment’s payload, total length, offset and MF flag. | HIGH |
| 41 | Chapter 03 | The difference between IP fragmentation and TCP retransmission is not clear. | UNEXPLAINED-WORD | Explain that routers fragment datagrams where allowed, while TCP reliability is end-to-end and retransmits missing data. | HIGH |
| 42 | Chapter 03 | NAT is named but not broken into types or operation. | MISSING-PREREQUISITE | Teach inside/local/global address idea, translation table, source NAT and port translation. | HIGH |
| 43 | Chapter 03 | I do not know which fields change when NAT edits a packet. | NEEDS-TRACE | Trace an outbound and inbound packet; identify IP address, port and checksum changes. | HIGH |
| 44 | Chapter 03 | Routing protocol coverage is not separated into distance-vector and link-state. | MISSING-GATE-CONCEPT | Make one lesson for each, with a comparison table. | HIGH |
| 45 | Chapter 03 | Bellman–Ford may appear as a name without the update rule. | MISSING-PREREQUISITE | Teach the neighbour update equation, cost addition, minimum selection and repeated rounds. | HIGH |
| 46 | Chapter 03 | Count-to-infinity is not indicated. | MISSING-FINER-POINT | Include a small failure example and explain split horizon/poison reverse as ways to reduce the problem. | MEDIUM |
| 47 | Chapter 03 | Link-state routing needs a clear explanation of link-state advertisements and topology knowledge. | MISSING-PREREQUISITE | Show how routers learn the same graph before running shortest-path computation. | HIGH |
| 48 | Chapter 03 | Dijkstra’s algorithm is not named in the lesson titles. | MISSING-GATE-CONCEPT | Teach the shortest-path table step by step; do not assume the student remembers graph algorithms. | HIGH |
| 49 | Chapter 03 | Flooding and generic shortest-path routing appear in the 2026 outline but are no longer named in the 2027 CN wording. | FACT-DOUBT | Keep only the shortest-path mechanics needed for link-state routing; label flooding as optional/legacy. | MEDIUM |
| 50 | Chapter 03 | ARP, DHCP and ICMP are in the v0 scope even though they are no longer named in the 2027 CN section. | FACT-DOUBT | Move to a clearly labelled legacy/extra sheet; do not make them core 2027 lessons. | HIGH |
| 51 | Chapter 03 | IPv6 is suggested by old question labels, but neither the 2026 nor 2027 CN text names it. | FACT-DOUBT | Do not create a major IPv6 chapter for this exam target. Give a short comparison only if useful context. | MEDIUM |
| 52 | Chapter 04 | The chapter title still says UDP, but UDP is no longer named in the 2027 syllabus. | FACT-DOUBT | Rename it “TCP: flow control, congestion control and socket API”; move UDP to a one-page comparison/legacy section. | HIGH |
| 53 | Chapter 04 | TCP flow control and congestion control can sound like the same thing. | UNEXPLAINED-WORD | Explain receiver protection versus network congestion with two separate everyday examples and diagrams. | HIGH |
| 54 | Chapter 04 | The TCP segment and its sequence/acknowledgement numbers are not listed. | MISSING-PREREQUISITE | Teach byte-stream sequence numbering, acknowledgement meaning, MSS and segment payload. | HIGH |
| 55 | Chapter 04 | TCP connection setup is not shown. | MISSING-GATE-CONCEPT | Add the three-way handshake with SYN/ACK flags, sequence numbers and acknowledgement numbers. | HIGH |
| 56 | Chapter 04 | TCP connection closing states are not shown. | MISSING-FINER-POINT | Include FIN, ACK, FIN-WAIT-1, FIN-WAIT-2, CLOSE-WAIT, LAST-ACK and TIME-WAIT as a readable state diagram. | MEDIUM |
| 57 | Chapter 04 | Sliding-window arithmetic needs a clean sequence of sent, acknowledged and outstanding bytes. | NEEDS-TRACE | Add sender/receiver window pictures and numerical traces with a clear timeline. | HIGH |
| 58 | Chapter 04 | Receiver-advertised window and congestion window may be confused. | UNEXPLAINED-WORD | Define rwnd and cwnd; show the send limit as constrained by both. | HIGH |
| 59 | Chapter 04 | Slow start is not named as a lesson. | MISSING-GATE-CONCEPT | Graph cwnd against RTT rounds and show why it approximately doubles per RTT, not per ACK. | HIGH |
| 60 | Chapter 04 | Congestion avoidance and threshold changes are not visible. | MISSING-GATE-CONCEPT | Teach the additive-increase stage and what happens after timeout/duplicate ACK under the stated TCP model. | HIGH |
| 61 | Chapter 04 | TCP versions (Reno, Tahoe, etc.) can make a formula ambiguous. | FACT-DOUBT | State the congestion-control model assumed in each problem; do not present one response rule as universal TCP behaviour. | HIGH |
| 62 | Chapter 04 | Sequence-number wraparound questions need a byte-rate calculation. | NEEDS-TRACE | Show bytes/s × time, compare with 2^n sequence values and explain the assumptions about reuse/MSL. | MEDIUM |
| 63 | Chapter 04 | Socket API is in the 2027 syllabus but not in the chapter title. | MISSING-GATE-CONCEPT | Add socket, bind, listen, accept, connect, send/recv and close, with client/server call order. | HIGH |
| 64 | Chapter 04 | UDP questions from old papers are mixed with current TCP scope. | WRONG-ORDER | Label UDP as old-paper knowledge; do not let it consume the TCP lesson time. | MEDIUM |
| 65 | Chapter 05 | Only the title “Application layer” is supplied. | MISSING-GATE-CONCEPT | Make DNS and HTTP the two core 2027 sections; list their sub-lessons explicitly. | HIGH |
| 66 | Chapter 05 | DNS hierarchy is not shown. | NEEDS-DIAGRAM | Draw root, TLD and authoritative servers; trace recursive and iterative lookup. | HIGH |
| 67 | Chapter 05 | Cached and uncached DNS resolution are not distinguished. | MISSING-FINER-POINT | Explain cache hits, TTL, referrals and the number of query/response round trips. | HIGH |
| 68 | Chapter 05 | HTTP request/response is not shown. | NEEDS-DIAGRAM | Draw request line, headers, body, response status, headers and body. | HIGH |
| 69 | Chapter 05 | Persistent and non-persistent HTTP are not separated. | MISSING-GATE-CONCEPT | Compare TCP connections and RTTs for multiple objects. | HIGH |
| 70 | Chapter 05 | HTTP pipelining and parallel connections are likely to be confused. | UNEXPLAINED-WORD | Define each separately and show timelines; mark HTTP/1.1 assumptions where used. | HIGH |
| 71 | Chapter 05 | SMTP, FTP and Email still appear in the 2026 contents scope but are no longer named in 2027. | FACT-DOUBT | Move them to “older syllabus/PYQ archive”; keep only if the app sells a broader networking course. | HIGH |
| 72 | Chapter 05 | Security is mixed into the bank topic name, but it is not in the 2027 CN syllabus. | FACT-DOUBT | Remove RSA/digital-signature/birthday-attack content from the core CN book; do not label it application-layer networking. | HIGH |
| 73 | Part B, bank topics | “OSI & TCP/IP Protocol Layers” category contains a 2025 item that is really ARP plus TCP acknowledgement piggybacking. | FACT-DOUBT | Retag questions by the concept tested, not merely by their old topic bucket. | MEDIUM |
| 74 | Part B, bank topics | The Application Layer category includes RSA and a digital-signature birthday-attack question. | FACT-DOUBT | Retag these as cryptography/security legacy questions, outside the 2027 CN core. | HIGH |
| 75 | Part B, bank stats | The table reports 2017–2026 frequency but does not say how difficulty was assigned. | FACT-DOUBT | Document whether difficulty is official, teacher-labelled or estimated; it is not an official GATE field. | MEDIUM |
| 76 | Part B, bank stats | “Years asked (of 10)” is not the same as number of papers. | UNCLEAR-ENGLISH | State the counting rule; two sessions in one year still count as one calendar year for this column. | MEDIUM |
| 77 | Part B, bank stats | The 76 questions are presented as a bank, but the file gives no selection or completeness method. | FACT-DOUBT | Say whether this is every tagged question, a curated subset, or the app's current import. Do not imply completeness unless audited against all papers. | HIGH |
| 78 | Part C, figures | Nine questions include image placeholders but no actual figures. | NEEDS-DIAGRAM | Restore the exact original figures for all nine questions before publishing or claiming a complete PYQ bank. | HIGH |
| 79 | Part C, all questions | The file shows an answer tick but usually no solution. | NEEDS-TRACE | Add a worked solution with assumptions, units, intermediate values and a final answer check for every question. | HIGH |
| 80 | Part C, all questions | Some answer keys are given as a range, but the accepted answer precision is not explained. | UNEXPLAINED-WORD | Preserve exact official NAT ranges and explain rounding/units; do not replace ranges with a guessed single value. | MEDIUM |
| 81 | 2026_AN_Q21 | The 64-second bottleneck answer depends on treating the file transfer as a pipelined flow; a whole-file store-and-forward interpretation yields a different total. | FACT-DOUBT | Explain the assumed packetisation/pipelining model and distinguish bottleneck throughput from whole-message store-and-forward delay. | HIGH |
| 82 | 2025_AN_Q23 | UDP is named in the question although UDP itself is not listed in the 2027 syllabus. | FACT-DOUBT | Retain only as an IP-fragmentation context/legacy example; make clear the tested calculation is IPv4 fragmentation. | MEDIUM |
| 83 | 2025_FN_Q40 / 2024_FN_Q58 / 2023_FN_Q65 | Longest-prefix questions cannot be solved because their forwarding tables are missing. | NEEDS-DIAGRAM | Add the original table and show the binary prefix matching process. | HIGH |
| 84 | 2025_FN_Q57 | The MTU values are in the missing figure, so the reported “7” cannot be checked from this file. | NEEDS-DIAGRAM | Restore the route diagram and annotate MTU on every link. | HIGH |
| 85 | 2024_AN_Q36 | The answer relies on round-trip propagation time, not one-way propagation time. | MISSING-FINER-POINT | Explicitly teach the collision-detection condition and why the signal must be able to return before transmission ends. | HIGH |
| 86 | 2022_FN_Q22 | Subnet count depends on a missing network diagram. | NEEDS-DIAGRAM | Restore the topology; number each router interface/LAN segment and count distinct IP subnets. | HIGH |
| 87 | 2022_FN_Q55 | CIDR aggregation depends on a missing routing table. | NEEDS-DIAGRAM | Restore the prefix list and show which aligned supernets cover exactly the given blocks. | HIGH |
| 88 | 2022_FN_Q57 | Count-to-infinity probability depends on the missing three-router topology. | NEEDS-DIAGRAM | Restore the topology and explain the event ordering that creates a loop. | HIGH |
| 89 | 2021_FN_Q46 | The Hamming-code answer depends on missing data/check-bit tables. | NEEDS-DIAGRAM | Restore the bit table and show parity-check equations and syndrome. | HIGH |
| 90 | 2021_AN_Q53 | The diagram is absent, even though the text gives enough distance-vector values to compute the new routes. | NEEDS-DIAGRAM | Restore the topology for full question fidelity; separately show the text-only minimum-cost calculation. | MEDIUM |
| 91 | 2025_AN_Q17 / 2023_FN_Q25 | Students may memorise Bellman–Ford/Dijkstra names without knowing which routing algorithm exchanges what information. | MISSING-PREREQUISITE | Teach the algorithm mechanics and the router information model, not just a matching table. | HIGH |
| 92 | 2021_AN_Q32 | Pure ALOHA throughput formula appears without any visible derivation path. | MISSING-PREREQUISITE | Explain vulnerable period, offered load G, probability of no collision and the resulting throughput expression. | MEDIUM |
| 93 | 2017_FN_Q56 / 2025_AN_Q36 | Different stop-and-wait utilisation formulations may include ACK transmission and processing differently. | FACT-DOUBT | Declare exactly which times are included in the cycle for each question; never silently drop non-zero ACK or processing times. | HIGH |
| 94 | 2018_FN_Q35 / 2022_FN_Q60 / 2023_FN_Q50 / 2026_AN_Q65 | Sequence-number wrap problems use assumptions about byte numbering, bandwidth, MSL and space reuse. | MISSING-FINER-POINT | Put the assumption in every worked solution and show units through the calculation. | MEDIUM |
| 95 | 2024_FN_Q40 | The 8.008-second result is a pipelining result, not a simple “file size / one link rate” result. | NEEDS-TRACE | Add a packet-by-packet two-link Gantt chart and explain the first-packet latency plus the pipeline. | HIGH |
| 96 | Part B, chapter sizes | Three/five/six topics are counted without a target reading time. | UNCLEAR-ENGLISH | Define each lesson as a 45–90 minute unit with a small objective and practice set. | HIGH |
| 97 | Part B, course design | No practice quota, worked-example quota or review intervals are stated. | MISSING-GATE-CONCEPT | Set a consistent lesson template: explanation, one fully worked example, guided trace, independent practice and recap. | HIGH |
| 98 | Part B, course design | There is no indication that diagrams are required in every hard numerical topic. | NEEDS-DIAGRAM | Create a diagram checklist and block lesson approval when a listed diagram is missing. | HIGH |
| 99 | Part C, question labels | The category names still reflect 2026 and earlier syllabus language. | WRONG-ORDER | Add a 2027-scope tag to every question: CORE, FOUNDATION, LEGACY-2026, OUT-OF-SCOPE or NEEDS-REVIEW. | HIGH |
| 100 | Entire file | The input does not set a release gate for accuracy or beginner comprehension. | MISSING-GATE-CONCEPT | Require a beginner pilot, independent numerical checks, PYQ source verification and a final syllabus audit before release. | HIGH |

---

# PART 3. WHAT A COMPLETE GATE 2027 COMPUTER NETWORKS SUBJECT MUST HAVE

## 3.1 First correction: the source has copied the 2026 syllabus, not the 2027 one

The supplied file says that its syllabus lines were written from memory. Those lines closely match the **GATE 2026** Computer Networks wording. GATE 2027 has a revised syllabus. The official GATE 2027 site explicitly warns that the syllabi have been revised and directs candidates to the new CS syllabus. The 2027 CS syllabus text is reproduced in the linked syllabus PDF as follows:

> **Computer Networks:** Principles of Layering; Basics of switching (circuit, packet and virtual circuit) and performance metrics; Data link layer: error detection, Medium Access Control, Ethernet; Distance vector and link state routing; IPv4 - Fragmentation, CIDR Notation, Network Address Translation; TCP - flow control and congestion control, socket API; DNS and HTTP.

Use the official 2027 source as the authority:
- GATE 2027 official syllabus landing page: https://gate2027.iitm.ac.in/exam_papers_and_syllabus
- Official CS syllabus PDF URL: https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf

The 2026 official syllabus included a longer list: OSI and TCP/IP stacks; framing; Ethernet bridging; shortest path and flooding routing; ARP, DHCP and ICMP; UDP; SMTP, FTP and Email. Those terms are not separately named in the 2027 CN wording. Therefore the book should not be copied forward unchanged.

### 3.2 Syllabus-to-book coverage matrix

Frequency means the historical bank's count only where stated; it is **not** a forecast of how often GATE 2027 will ask a topic. For topics without a defensible frequency, the answer is **not sure**.

| GATE 2027 syllabus line | Complete topic/finer points to teach | Bank evidence in the supplied file | Frequency judgement | Typical question | Zero-level prerequisite |
|---|---|---|---|---|---|
| Principles of Layering | Why layers exist; services, interfaces and protocols; peer entities; encapsulation/decapsulation; headers/trailers; PDU names; addressing at each layer; end-to-end vs hop-to-hop delivery | Five bank questions were grouped under OSI/TCP-IP. Some are not pure layering questions. | Historical bank says 5 questions / 6 marks for the broad label; genuine layering-only frequency: **not sure** | Match function to layer; identify which address is used at each hop; trace headers through a path | Message, bits/bytes, sender/receiver, local link, router, basic idea of an address |
| Switching and performance metrics | Circuit, packet and virtual-circuit switching; connection setup; store-and-forward; packetisation; transmission delay; propagation delay; processing and queuing delay; throughput; bottleneck; utilisation; bandwidth–delay product; pipeline timing | Bank includes bottleneck/file transfer, two-hop pipeline and propagation/transmission questions in several labels | The source's layer/switching label has 5/6; performance-metric count is not separately supplied; **not sure** | Calculate end-to-end transfer time, bottleneck throughput, pipeline time, link utilisation or delay | Units; bits/bytes; seconds; rate; multiplication/division; basic timeline |
| Data link — error detection | Parity; checksum idea; CRC; generator polynomial; modulo-2 arithmetic; error detection versus correction; codeword; Hamming distance as enrichment/legacy support | Data-link bucket: 18 questions / 34 marks across 15 papers | Historical bucket count is source-provided; current-scope share is lower/uncertain because it includes old topics. 2027 frequency: **not sure** | Compute CRC remainder; identify an error-detection property; reason about code distance | Binary numbers, XOR, polynomial notation at a very basic level |
| Data link — MAC and Ethernet | Shared medium; collisions; random access; pure/slotted ALOHA; carrier sense; CSMA/CD; Ethernet MAC addresses; frame fields; Ethernet operation; minimum frame size/collision domain | ALOHA, CSMA timing, Ethernet collision-frame-size and switch-related questions appear in the bank | Historical data-link bucket includes these; separate frequency: **not sure** | Throughput, collision timing, minimum frame size, MAC-address interpretation, Ethernet behaviour | Transmission and propagation delay; frame; shared channel |
| Distance-vector routing | Router distance tables; neighbour advertisements; Bellman–Ford update; repeated rounds; route convergence; failure; count-to-infinity; split horizon/poison reverse as finer points | Routing bucket: 8 questions / 13 marks; several labelled distance-vector or RIP | Historical routing bucket count; exact DV share: **not sure** | Fill a new routing table; choose next hop; predict a loop after a link failure | Graph, vertices/edges, path cost, minimum |
| Link-state routing | Link-state database; advertisements; topology graph; Dijkstra; shortest path tree; next hop; route calculation | Routing bucket includes OSPF/Dijkstra questions | Historical routing bucket count; exact LS share: **not sure** | Run Dijkstra; select shortest path/next hop; compare DV and LS | Graphs, edge weights, minimum selection |
| IPv4 fragmentation | IP datagram; MTU; header length; fragment payload; 8-byte offset units; MF/DF; identification; fragmentation at routers; re-fragmentation; destination reassembly | IP-addressing bucket: 21 questions / 31 marks, including multiple fragment calculations | Historical bucket count; current-scope share includes ARP/DHCP/etc. and therefore cannot be used as a clean frequency. 2027 frequency: **not sure** | Compute fragment count, sizes, offsets and MF flags over one or several links | Bytes, division, multiples of 8, IPv4 header |
| CIDR notation | IPv4 binary; prefix length; mask; network and host bits; subnet count; address range; address alignment; route aggregation; longest-prefix match | IP bucket includes many subnet/CIDR and forwarding-table questions | Historical bucket count only; 2027 frequency: **not sure** | Determine subnet range, number of addresses, valid block, aggregate routes or longest match | Binary place values; octets; powers of two |
| Network Address Translation | Private/public mapping idea; NAT table; source translation; port translation; returning traffic; IP/header checksum consequences | IP bank includes a NAT header-field question | Only one clearly labelled NAT-specific question is visible in the listed bank; this is not a future frequency estimate. | Identify fields changed; trace a translation table | IPv4 address, port, packet header |
| TCP — flow control | Byte stream; sequence and ACK numbers; advertised receive window; sender/receiver windows; sliding-window operation; in-flight data; MSS; flow-control calculations | Transport bucket: 15 questions / 22 marks, which also includes UDP and older material | Historical bucket count; TCP flow-control-only frequency: **not sure** | Determine the allowed outstanding bytes; read ACK numbers; compute window-limited sending | Bytes, sequence, acknowledgement, buffer |
| TCP — congestion control | Network congestion; cwnd; ssthresh; slow start; congestion avoidance; timeout; duplicate ACK; loss response; RTT rounds; receiver-window cap | Several bank questions explicitly use slow start, threshold, cwnd and sequence-number rates | Historical bucket count; separate current-syllabus frequency: **not sure** | Trace cwnd round by round; determine when a phase begins; compute an advertised/usable window | RTT, MSS, ACK, window, powers of two |
| TCP — socket API | Socket endpoint; IP/port pair; client/server; socket, bind, listen, accept, connect, send/receive, close; basic TCP connection lifecycle | The old transport bucket includes socket API/UDP items, but v0 does not list socket lessons explicitly | **not sure** | Identify call sequence; determine which side performs which call; trace connection setup | Process, client, server, IP address, port |
| Application — DNS | Domain hierarchy; root/TLD/authoritative servers; resolver; recursive vs iterative query; referrals; records; caching; TTL; lookup RTT count | App bucket includes DNS questions | Historical app bucket count is 9/12 but includes email/security; DNS-only frequency: **not sure** | Count DNS round trips; trace query sequence; reason about caching | Host name, IP address, request/response, RTT |
| Application — HTTP | Request/response; methods at an elementary level; status codes; objects; persistent/non-persistent connections; pipelining; multiple connections; DNS/TCP/HTTP timeline | App bank includes HTTP object-transfer/RTT questions | Historical app bucket count includes email/security; HTTP-only frequency: **not sure** | Count TCP connections/RTTs; choose event order; compare persistent and non-persistent modes | TCP connection, client/server, object, RTT |

## 3.3 Topics to demote, not silently delete

These are useful for understanding older GATE papers and general networking, but they should be labelled accurately for the 2027 book.

| Topic | 2027 treatment | Why |
|---|---|---|
| OSI layer names and TCP/IP stack diagram | **Foundation / brief** | The syllabus says principles of layering, not memorise the full named stacks. |
| Framing and byte/bit stuffing | **Brief foundation** | Framing is no longer separately named, but a student needs to understand what an Ethernet frame is. |
| Ethernet bridging, switch learning tables | **Should / legacy** | “Ethernet” remains; “Ethernet bridging” is not separately named. Teach only what is needed to understand Ethernet and older questions. |
| Stop-and-wait and sliding-window link-layer protocols | **Should / legacy plus performance foundation** | Older bank questions use them. They are also useful for delay/utilisation reasoning, but are not a named 2027 CN bullet. |
| Hamming code and error correction | **Short extension** | Error detection remains explicit; error correction is not separately named. Keep as historical question support, not the main error-detection lesson. |
| Flooding | **Later / legacy** | Flooding is not named in 2027; distance-vector and link-state are. |
| Generic shortest-path topic | **Foundation inside link-state** | Dijkstra/shortest path is still needed to teach link-state routing. Do not expand flooding or generic routing beyond the required purpose. |
| ARP, DHCP and ICMP | **Legacy appendix** | They appear in the 2026 syllabus but not in the revised 2027 CN text. |
| IPv6 | **Later / optional** | IPv6 is not named in the 2027 CN line. The 2018 question in this bank should not force a full IPv6 chapter. |
| UDP | **Short comparison / legacy** | UDP is not named in 2027; TCP is named explicitly. |
| SMTP, FTP and Email | **Legacy appendix** | These are no longer named in the 2027 application-layer line; DNS and HTTP are. |
| RSA, digital signatures, birthday attacks | **Remove from CN core** | These are not Computer Networks syllabus topics in the GATE 2027 section and are misclassified as application-layer networking in the supplied bank. |

---

# PART 4. THE DIAGRAMS I NEED TO SEE

A text description is not enough for these topics. Every diagram should be introduced in words, labelled consistently, and followed by a question that uses it.

| Chapter / topic | What to draw | What I should notice | Format |
|---|---|---|---|
| Layering | Sender and receiver stacks, with one application message moving down and up | Each layer adds or removes its own header; peer layers are logical partners | Step-by-step series |
| Layering | Encapsulation stack: message → segment → packet → frame → bits | Data-unit names and which header belongs to which layer | Single picture |
| Layering | A packet travelling through two routers | Link-layer frame changes at each hop while the network-layer destination remains the end host (unless NAT is present) | Step-by-step series |
| Switching | Circuit, packet and virtual-circuit network sketches | Dedicated resources versus independent packet forwarding versus a pre-established logical path | Three side-by-side pictures |
| Switching | Store-and-forward switch with a complete frame entering and leaving | The switch waits for enough/all of the packet before forwarding, depending on the model | Single picture |
| Performance | Transmission and propagation time line | Transmission time depends on packet bits/rate; propagation time depends on distance/signal speed | Step-by-step timeline |
| Performance | Three-hop path with different link rates | The bottleneck rate limits the long-run flow; packet pipeline can overlap | Gantt/timeline |
| Performance | Throughput versus time for a pipelined file transfer | First-packet delay and steady packet spacing are different | Trace table |
| Data link | Ethernet frame field layout | Destination/source MAC, type/length, payload and FCS | Single picture |
| Data link | Bit/byte stuffing framing example | Reserved patterns are escaped so payload is not mistaken for a frame boundary | Step-by-step series |
| Error detection | Parity groups and parity bit | What can be detected; why some multi-bit errors may escape | Single picture |
| Error detection | CRC modulo-2 division | XOR happens where the leading bit is 1; final remainder is the check sequence | Trace table |
| Error correction extension | Hamming positions 1, 2, 4, 8 for parity bits | Which positions each parity bit checks; syndrome identifies a bit position | Single picture plus trace table |
| MAC | Two or more devices sharing one medium | More than one sender can use the medium; simultaneous transmissions can collide | Single picture |
| MAC | Pure ALOHA and slotted ALOHA time slots | A slot boundary changes when transmission may start | Step-by-step timeline |
| MAC | CSMA/CSMA-CD timeline for two stations | Signal propagation means two far-apart senders may both think the medium is idle | Step-by-step timeline |
| Ethernet | Collision domain and signal travelling to the farthest node and back | Why collision detection needs a round-trip propagation window | Single picture plus timeline |
| IPv4/CIDR | 32-bit IPv4 address split into four octets | Dotted decimal is just a readable form of 32 bits | Single picture |
| CIDR | Prefix bits shaded and host bits unshaded | `/n` means n network-prefix bits | Single picture |
| CIDR | Address block shown as a number line | Network start, broadcast/end and valid host range | Single picture |
| CIDR | Block alignment for /24, /23 and /22 | A valid block starts at a multiple of its block size | Step-by-step series |
| CIDR | Multiple route prefixes and one aggregate | The combined block must be contiguous, same-size-compatible and correctly aligned | Single picture |
| Longest-prefix match | Router table with overlapping prefixes and a destination address | The most specific matching prefix wins | Trace table |
| IPv4 fragmentation | IPv4 header with Identification, Flags and Fragment Offset fields highlighted | Fragment offset is measured in 8-byte units; MF indicates more fragments | Single picture |
| IPv4 fragmentation | One datagram broken into fragments for a given MTU | Payload sizes are multiples of eight except the final piece | Step-by-step series |
| IPv4 fragmentation | The same fragments passing through a second, smaller MTU | A router may split an already fragmented datagram again; offset values remain relative to the original payload | Step-by-step series plus table |
| NAT | Inside host, NAT router, public server and translation table | Private source address/port is rewritten; return packets use the mapping | Step-by-step series |
| Distance vector | Three-router triangle with link costs | Every router initially knows only nearby distances; updates improve route estimates | Single picture |
| Distance vector | Bellman–Ford update table by round | Cost via each neighbour = cost to neighbour + neighbour's advertised cost | Trace table |
| Distance vector | Link failure and count-to-infinity sequence | Stale information can be advertised back and forth | Step-by-step series |
| Link state | Network graph and link-state database | Every router builds a topology view | Single picture |
| Link state | Dijkstra table: tentative distance, predecessor, visited | The smallest tentative distance is finalised at each step | Trace table |
| TCP | TCP segment header with ports, sequence, acknowledgement, flags and window | Which fields identify a connection, number bytes, acknowledge bytes and control data flow | Single picture |
| TCP handshake | SYN → SYN-ACK → ACK arrows | SYN consumes one sequence number; ACK acknowledges the next expected sequence | Step-by-step series |
| TCP close | FIN/ACK state diagram | Active close, passive close, TIME-WAIT and why a connection does not simply vanish immediately | Step-by-step series |
| TCP flow control | Sender and receiver sliding windows on a byte sequence line | Sent, acknowledged, outstanding and permitted bytes are different | Step-by-step series |
| TCP congestion control | cwnd versus RTT-round graph | Slow start grows rapidly; congestion avoidance grows more slowly; threshold and loss alter the path | Graph plus trace table |
| TCP loss | A packet loss / timeout / duplicate ACK timeline | Timeout and duplicate ACK cases may trigger different responses depending on the specified TCP version | Step-by-step series |
| Socket API | Client and server call sequence | Server binds/listens/accepts; client connects; both send/receive; connection closes | Flowchart |
| DNS | Root → TLD → authoritative server tree | Referrals and final address record; recursive resolver versus iterative client | Single picture |
| DNS | Packet timeline for uncached lookup | Count each required query/response and avoid counting local cache hits as remote RTTs | Trace table |
| HTTP | HTTP request and response message | Start line, headers, blank line and optional body | Single picture |
| HTTP | One HTML page with embedded objects | The index page reveals more objects to fetch | Single picture |
| HTTP timing | Non-persistent, persistent and pipelined request timelines | Number of TCP handshakes and RTTs changes the total time | Three timelines |

---

# PART 5. THE FULL BEGINNER-FIRST PLAN, CHAPTER BY CHAPTER

**Lesson length:** each lesson is designed for 45–90 minutes.  
**Priority tags:** `[MUST]` = direct 2027 syllabus or prerequisite; `[SHOULD]` = useful supporting or recurring historical concept; `[LATER]` = lower priority or older-syllabus extension.

The student should not be expected to complete a lesson by memorising a list. Every lesson must contain: simple explanation, one tiny example, one fully worked example, a diagram, a hand trace, common mistakes, and a short self-test.

## Chapter 0 — Before networking (foundation)

### CN0.1 — Bits, bytes, rates and time [MUST]
- **Prerequisites:** none.
- **Beginner must-see:** bit versus byte; 8 bits = 1 byte; kilo/mega/giga units; seconds and milliseconds.
- **Finer points:** decimal k/M versus binary Ki/Mi; convert Mbps to bytes/s; keep units visible.
- **GATE level:** transmission-time calculations and data-size conversion.
- **Diagrams:** a byte made of eight bits; unit ladder.
- **Hand traces:** 50,000 bytes over a 1 Mbps link; convert the answer into milliseconds.
- **Common mistakes:** mixing bits and bytes; using 10^3 when the question says 2^10.

### CN0.2 — A network path and its devices [MUST]
- **Prerequisites:** CN0.1.
- **Beginner must-see:** host, NIC, switch, router, link, packet, frame, port and address.
- **Finer points:** a switch forwards frames locally; a router forwards network-layer packets between networks.
- **GATE level:** identify next-hop MAC versus final destination IP.
- **Diagrams:** two LANs joined by a router, with one switch on each LAN.
- **Hand traces:** trace one packet from a laptop to a server on another network.
- **Common mistakes:** thinking the switch is always the destination MAC; confusing an IP address with a MAC address.

## Chapter 1 — Principles of layering, switching and performance

### CN1.1 — Why networks use layers [MUST]
- **Prerequisites:** CN0.2.
- **Beginner must-see:** each layer solves one kind of problem and uses the layer below.
- **Finer points:** service, interface, protocol, peer entity, encapsulation and decapsulation.
- **GATE level:** function-to-layer matching; identify which header is added at each stage.
- **Diagrams:** sender/receiver protocol stacks and encapsulation ladder.
- **Hand traces:** wrap a short message in transport, network and link headers.
- **Common mistakes:** believing a real packet is physically sent between peer layers on the same machine.

### CN1.2 — Circuit, packet and virtual-circuit switching [MUST]
- **Prerequisites:** CN1.1.
- **Beginner must-see:** a network can reserve a path, forward independent packets or use a logical connection.
- **Finer points:** setup, state, sharing and ordering; store-and-forward.
- **GATE level:** compare delay, resource use and behaviour of the three switching types.
- **Diagrams:** three side-by-side network drawings.
- **Hand traces:** send three packets from A to B under each model.
- **Common mistakes:** treating a virtual circuit as a physical dedicated cable.

### CN1.3 — Delay, throughput and utilisation [MUST]
- **Prerequisites:** CN0.1, CN1.2.
- **Beginner must-see:** transmission delay = data bits / link bit rate; propagation delay = distance / propagation speed.
- **Finer points:** processing and queuing delay; bottleneck throughput; RTT; utilisation; bandwidth–delay product.
- **GATE level:** calculate one-hop/multi-hop delay, bottleneck rate, link utilisation and pipeline completion time.
- **Diagrams:** time line, three-link bottleneck path and two-hop packet pipeline.
- **Hand traces:** compute each delay separately and add only the delays the question asks for.
- **Common mistakes:** adding full-file transmission time at every hop when the model is pipelined; forgetting to distinguish one-way and round-trip propagation.

## Chapter 2 — Data link, error detection, MAC and Ethernet

### CN2.1 — Frames and Ethernet basics [MUST]
- **Prerequisites:** CN1.1.
- **Beginner must-see:** a frame is the data-link unit on one link; Ethernet uses source and destination MAC addresses.
- **Finer points:** Ethernet frame fields, FCS, frame payload and basic MTU relation.
- **GATE level:** identify fields and distinguish link-layer addresses from IP addresses.
- **Diagrams:** Ethernet frame layout and two-LAN path.
- **Hand traces:** follow a frame across one LAN and then across a router.
- **Common mistakes:** assuming the same Ethernet frame crosses every router hop unchanged.

### CN2.2 — Error detection: parity and checksum [SHOULD]
- **Prerequisites:** binary arithmetic and XOR.
- **Beginner must-see:** extra bits help the receiver detect some corrupted data.
- **Finer points:** even/odd parity, checksum idea and limitations.
- **GATE level:** compute parity/checksum and identify whether a stated corruption is detectable.
- **Diagrams:** parity groups and one's-complement checksum blocks.
- **Hand traces:** calculate a parity bit and a small checksum.
- **Common mistakes:** claiming an error-detection method corrects the corrupted data.

### CN2.3 — CRC from the beginning [MUST]
- **Prerequisites:** CN2.2, polynomial notation explained in simple language.
- **Beginner must-see:** CRC division uses XOR, not ordinary subtraction.
- **Finer points:** generator degree determines remainder length; append zeroes before division; transmitted codeword divides by generator with zero remainder.
- **GATE level:** compute check bits and verify a received codeword.
- **Diagrams:** binary long division with each XOR row shown.
- **Hand traces:** at least two complete CRC divisions.
- **Common mistakes:** using ordinary binary subtraction; forgetting appended zeros; dropping leading zeros in the remainder.

### CN2.4 — Hamming distance and correction extension [SHOULD]
- **Prerequisites:** binary strings and parity.
- **Beginner must-see:** Hamming distance counts positions that differ.
- **Finer points:** minimum distance, maximum detectable errors and maximum correctable errors; parity-check matrix/syndrome only if needed.
- **GATE level:** solve old Hamming-code questions.
- **Diagrams:** codeword comparisons and parity-check positions.
- **Hand traces:** calculate every pairwise distance in a small code.
- **Common mistakes:** confusing detection capability with correction capability.

### CN2.5 — Shared medium, ALOHA and carrier sensing [MUST]
- **Prerequisites:** CN1.3.
- **Beginner must-see:** multiple senders share a channel; overlapping transmissions can collide.
- **Finer points:** pure/slotted ALOHA; vulnerable period; offered load; CSMA; classic CSMA/CD.
- **GATE level:** throughput of pure ALOHA; carrier-sensing timeline; collision detection distance.
- **Diagrams:** two senders sharing a medium, ALOHA timeline and CSMA propagation timeline.
- **Hand traces:** identify whether two proposed transmissions collide.
- **Common mistakes:** ignoring signal propagation; confusing a collision with packet loss caused by a router.

### CN2.6 — Ethernet operation and collision timing [MUST]
- **Prerequisites:** CN2.1, CN2.5.
- **Beginner must-see:** classic shared Ethernet must detect a collision before a sender finishes transmitting.
- **Finer points:** minimum frame size, collision domain, propagation round trip; modern switched full-duplex Ethernet does not use CSMA/CD in the same way.
- **GATE level:** minimum frame size and Ethernet collision timing.
- **Diagrams:** farthest-node collision timeline and collision domain.
- **Hand traces:** distance × propagation speed → one-way time → round-trip time → minimum bits.
- **Common mistakes:** using one-way propagation delay in a round-trip collision condition.

### CN2.7 — Stop-and-wait and sliding windows [SHOULD]
- **Prerequisites:** CN1.3, frame transmission time.
- **Beginner must-see:** the sender may need to wait for acknowledgement; a window allows multiple outstanding frames.
- **Finer points:** sequence numbers, wraparound idea, ACK time and utilisation.
- **GATE level:** minimum window size for full utilisation; stop-and-wait efficiency.
- **Diagrams:** sender/receiver timeline with frames and ACKs.
- **Hand traces:** calculate transmission time, RTT and minimum W.
- **Common mistakes:** mixing link-layer ARQ with TCP's end-to-end flow control.

## Chapter 3 — IPv4 addressing, fragmentation, NAT and routing

### CN3.1 — IPv4 addresses in binary [MUST]
- **Prerequisites:** CN0.1.
- **Beginner must-see:** an IPv4 address has 32 bits written as four octets.
- **Finer points:** dotted decimal, binary place values and subnet masks.
- **GATE level:** convert between decimal and binary; count network/host bits.
- **Diagrams:** 32-bit address bar split into four octets.
- **Hand traces:** convert one address and one mask.
- **Common mistakes:** treating each octet as a decimal digit rather than an 8-bit number.

### CN3.2 — CIDR and subnetting [MUST]
- **Prerequisites:** CN3.1.
- **Beginner must-see:** `/n` means n prefix bits; remaining bits identify addresses within the block.
- **Finer points:** block size, network address, broadcast address, usable host range, alignment.
- **GATE level:** find the range, host count and valid assigned blocks.
- **Diagrams:** prefix/host split and an address number line.
- **Hand traces:** solve once with binary and once with block-size steps.
- **Common mistakes:** assuming every arbitrary address is a valid network base.

### CN3.3 — Route aggregation and longest-prefix match [MUST]
- **Prerequisites:** CN3.2.
- **Beginner must-see:** a router chooses a matching route; the most specific matching prefix wins.
- **Finer points:** aggregation must respect contiguous ranges and aligned boundaries.
- **GATE level:** choose an aggregate prefix; select a next hop from a routing table.
- **Diagrams:** prefix tree and overlapping routing entries.
- **Hand traces:** compare destination bits with each prefix row.
- **Common mistakes:** choosing the first matching route instead of the longest match.

### CN3.4 — IPv4 fragmentation [MUST]
- **Prerequisites:** CN3.1, bytes and division.
- **Beginner must-see:** MTU limits the size of an IP packet on a link; a datagram may need splitting.
- **Finer points:** header length, payload size, MF, DF, Identification and 8-byte offset units.
- **GATE level:** fragment one datagram, re-fragment across a second MTU and calculate offsets.
- **Diagrams:** original payload split into fragments; table of fragment fields.
- **Hand traces:** calculate maximum payload, number of fragments, lengths, offsets and MF.
- **Common mistakes:** calculating offset in bytes; forgetting that the last payload need not be a multiple of eight.

### CN3.5 — NAT [MUST]
- **Prerequisites:** CN3.1, ports introduced in CN4.1.
- **Beginner must-see:** NAT rewrites an address (and often a port) so internal machines can share an external address.
- **Finer points:** translation table; return path; checksum changes.
- **GATE level:** identify changed header fields and trace a mapping.
- **Diagrams:** private host → NAT → server and translation table.
- **Hand traces:** follow one outgoing packet and its reply.
- **Common mistakes:** assuming NAT changes the destination IP for every outbound packet.

### CN3.6 — Distance-vector routing [MUST]
- **Prerequisites:** simple weighted graph and minimum calculation.
- **Beginner must-see:** routers exchange their current distances with neighbours and improve their tables.
- **Finer points:** Bellman–Ford update, convergence, count-to-infinity and loop prevention ideas.
- **GATE level:** update a routing table after one round or a link failure.
- **Diagrams:** three/four-router graph and a distance table per round.
- **Hand traces:** compute each route cost through each neighbour.
- **Common mistakes:** using a neighbour's distance without adding the local link cost.

### CN3.7 — Link-state routing [MUST]
- **Prerequisites:** graph, edge weight, minimum selection.
- **Beginner must-see:** routers learn the topology and compute shortest paths.
- **Finer points:** link-state database, Dijkstra, shortest path tree, next hop.
- **GATE level:** run Dijkstra from a source and build a forwarding choice.
- **Diagrams:** weighted graph with Dijkstra tentative distances.
- **Hand traces:** one row per iteration showing chosen node and updated distances.
- **Common mistakes:** confusing Dijkstra with Bellman–Ford or confusing distance-vector advertisements with a topology database.

## Chapter 4 — TCP, flow control, congestion control and socket API

### CN4.1 — TCP from the beginning [MUST]
- **Prerequisites:** CN0.2, CN1.1.
- **Beginner must-see:** TCP provides a reliable byte stream between two endpoints.
- **Finer points:** port numbers, segment, MSS, sequence/ACK fields, ordering and retransmission at a conceptual level.
- **GATE level:** interpret a TCP segment and sequence/ACK numbers.
- **Diagrams:** TCP segment header and byte stream split into segments.
- **Hand traces:** number the bytes and determine the next expected ACK.
- **Common mistakes:** thinking a sequence number counts packets rather than bytes.

### CN4.2 — TCP handshake and close [SHOULD]
- **Prerequisites:** CN4.1.
- **Beginner must-see:** three-way handshake confirms both sides and synchronises sequence numbers.
- **Finer points:** SYN consumes one sequence number; simultaneous close; FIN/ACK and key TCP states.
- **GATE level:** find flags, sequence/ACK values or state after an event.
- **Diagrams:** SYN/SYN-ACK/ACK; simplified closing state machine.
- **Hand traces:** fill in sequence and acknowledgement numbers.
- **Common mistakes:** acknowledging the SYN with the same sequence number instead of next sequence number.

### CN4.3 — TCP flow control [MUST]
- **Prerequisites:** CN4.1, basic windows.
- **Beginner must-see:** receiver advertises how much buffer space it can accept.
- **Finer points:** rwnd, sliding window, outstanding data, ACK advancement and zero window.
- **GATE level:** determine sendable bytes and window movement.
- **Diagrams:** sender/receiver byte ranges and advertised window.
- **Hand traces:** update the window after ACKs.
- **Common mistakes:** treating the advertised window as a congestion-control signal.

### CN4.4 — TCP congestion control [MUST]
- **Prerequisites:** CN4.3, RTT and MSS.
- **Beginner must-see:** cwnd limits how much data the sender injects into the network.
- **Finer points:** slow start, ssthresh, congestion avoidance, timeout and duplicate ACK response; state the TCP version/model when needed.
- **GATE level:** trace cwnd across RTTs; find when congestion avoidance starts; apply a timeout.
- **Diagrams:** cwnd graph and event timeline.
- **Hand traces:** row per RTT with cwnd, ssthresh and acknowledged data.
- **Common mistakes:** saying cwnd doubles for every ACK; confusing cwnd with rwnd; forgetting the question's starting condition.

### CN4.5 — Socket API [MUST]
- **Prerequisites:** TCP client/server idea, IP and port.
- **Beginner must-see:** a socket is a programming endpoint for communication.
- **Finer points:** socket, bind, listen, accept, connect, send/recv and close.
- **GATE level:** identify server and client call order; know what each call does.
- **Diagrams:** client/server call flow.
- **Hand traces:** trace a client connection from creation to close.
- **Common mistakes:** assuming `listen()` is called by the client or that `accept()` creates the listening socket.

### CN4.6 — UDP comparison / older questions [LATER]
- **Prerequisites:** CN4.1.
- **Beginner must-see:** UDP is connectionless and message-oriented; TCP is a reliable byte stream.
- **Finer points:** UDP header and port numbers only as old-paper support.
- **GATE level:** answer older UDP comparison questions.
- **Diagrams:** TCP connection versus one UDP datagram.
- **Hand traces:** mark which protocol requires a connection handshake.
- **Common mistakes:** allocating equal study time to UDP when the current syllabus names TCP, not UDP.

## Chapter 5 — DNS and HTTP

### CN5.1 — DNS hierarchy and records [MUST]
- **Prerequisites:** host name, IP address, request/response.
- **Beginner must-see:** DNS finds records for names; the answer may require several servers.
- **Finer points:** root, TLD, authoritative server, resolver, cache, TTL and referrals.
- **GATE level:** count lookup steps/RTTs; identify iterative and recursive queries.
- **Diagrams:** DNS hierarchy tree and iterative message sequence.
- **Hand traces:** resolve a hostname without any cache; then repeat with one cached record.
- **Common mistakes:** counting the local cache lookup as a remote DNS round trip.

### CN5.2 — HTTP request/response [MUST]
- **Prerequisites:** TCP connection and client/server.
- **Beginner must-see:** browser sends a request; server returns a response and may send multiple objects.
- **Finer points:** request/response fields, object, connection reuse, HTTP/1.1 persistence and pipelining at the level used by PYQs.
- **GATE level:** order DNS/TCP/HTTP events; count connections and RTTs.
- **Diagrams:** request and response message; web page with embedded objects.
- **Hand traces:** fetch index plus ten objects using non-persistent, persistent and pipelined approaches.
- **Common mistakes:** counting one new TCP connection per object even when persistent reuse is assumed.

### CN5.3 — Mixed DNS + TCP + HTTP timing [MUST]
- **Prerequisites:** CN1.3, CN4.2, CN5.1, CN5.2.
- **Beginner must-see:** an application request can require DNS, TCP handshake, HTTP request and object fetches.
- **Finer points:** cached/uncached DNS; same-origin server; parallel connections; pipelining; negligible transmission assumptions.
- **GATE level:** count total RTTs and draw the event order.
- **Diagrams:** one combined timeline with labelled RTT intervals.
- **Hand traces:** write every remote round trip before adding.
- **Common mistakes:** adding an RTT for something assumed local or cached; overlooking a required TCP handshake.

---

# PART 6. AUDIT OF ALL 76 QUESTIONS IN THE SUPPLIED BANK

**How to read this audit:**
- “Key supported” means the answer tick/range in the supplied file is consistent with a direct conceptual check or a short calculation from the text.
- “Cannot verify — figure missing” means the required picture/table is absent; the supplied tick is not independently confirmed here.
- “Historical / out of 2027 core” identifies content that should not dominate the 2027 book.
- This is not a claim that every item was cross-checked against a separately downloaded official key. The GATE 2026 official master-paper and answer-key page explains that its key is matched to the master paper and defines MCQ/MSQ/NAT marking. For older questions, verify the original paper and final key before publication.

| # | Question ID | Chapter / lesson in revised plan | Exact concept tested | Trap / finer point | Audit of supplied key and transcription |
|---:|---|---|---|---|---|
| 1 | 2026_FN_Q18 | CN4.2 | TCP simultaneous close | Both endpoints may initiate close; TCP is full-duplex. | **D supported.** Text is readable; no apparent transcription issue. |
| 2 | 2026_FN_Q19 | CN5.2 | HTTP/1.1 persistent connections and pipelining | Same server/origin matters; pipelining allows another request before the earlier response completes. | **A, C, D supported.** Text readable. |
| 3 | 2026_AN_Q21 | CN1.3 | Bottleneck bandwidth and file-transfer time | 4 million bytes = 32 Mbits; slowest link is 500 kbps, giving 64 s under the pipelined/bottleneck-throughput interpretation. A whole-file store-and-forward model would differ. | **B = 64 supported only under the assumed pipelined flow model.** Solution must state this. |
| 4 | 2026_AN_Q22 | Legacy appendix | DHCP broadcast behaviour | DHCP discovery can use broadcast because the client may not yet know its IP/server. | **C supported.** Relevant to 2026/older syllabus, not a 2027 core topic. |
| 5 | 2026_AN_Q33 | CN3.2 | IPv4 subnet host count for /20 | 12 host bits gives 4096 total; traditional usable hosts = 4094. | **4094 supported.** State the conventional network/broadcast exclusion assumption. |
| 6 | 2026_AN_Q43 | CN2.3 | CRC remainder for data `110001011` and generator `1001` | Append three zeroes and divide using XOR. | **D = 100 supported by direct modulo-2 division.** No apparent text error. |
| 7 | 2026_FN_Q44 | CN4.4 | TCP slow-start timing to segment 2000 | Cumulative segments per RTT round; transmission of segment 2000 begins in the 11th round under cwnd 1,2,4,… | **B supported (10 ≤ t < 11 ms).** State the initial cwnd/round convention. |
| 8 | 2026_FN_Q45 | CN2.7 | Sliding-window minimum W for 100% utilisation | Frame transmit time = 10 ms; one-way propagation = 100 ms; W ≥ 1 + 2a = 21. | **B = 21 supported.** ACK transmit time is explicitly zero. |
| 9 | 2026_FN_Q56 | CN3.2 | CIDR allocation of at least 6000 addresses from /15 | Need an 8192-address /19 block and correct /19 boundary alignment. | **A, B, C supported.** D is not a correctly aligned /19 network base. |
| 10 | 2026_AN_Q58 | CN4.4 | TCP rounds until congestion avoidance | MSS 2 KB; ssthresh 16 KB = 8 MSS; slow-start growth from 1 MSS reaches 8 MSS after four rounds under standard textbook convention. | **4 supported.** State initial cwnd and whether the threshold round is counted as reaching the phase. |
| 11 | 2026_AN_Q65 | CN1.3 / CN4.4 | Sequence-number field size under bandwidth/MSL plus utilisation condition | Byte rate is 10^8/8 bytes/s; over 60 s it is 750 million bytes, requiring 30 bits of sequence space. | **30 supported for the no-wrap condition.** Explain both constraints; verify the exact interpretation of the “maximum utilisation” clause in the official solution. |
| 12 | 2025_FN_Q16 | CN1.1 / legacy | Map network, transport and data-link layer functions | Routing is network layer; host-to-host transport is transport layer; framing/error handling is data link. | **B supported.** OSI labels are a brief layering foundation, not a large 2027 memorisation topic. |
| 13 | 2025_AN_Q16 | CN0.2 / legacy | ARP mapping and TCP piggybacked acknowledgement | A TCP segment can carry data and an ACK together; ARP maps IP to link-layer address. | **B supported.** ARP is not named in the 2027 syllabus; the bank's “OSI layers” label is imprecise. |
| 14 | 2025_AN_Q17 | CN3.6–CN3.7 | Distance-vector/Bellman–Ford and link-state/Dijkstra association | Know the information each method exchanges, not only the algorithm names. | **A supported.** No apparent transcription problem. |
| 15 | 2025_AN_Q18 | Legacy appendix | IPv4 Protocol field versus UDP port-based RIP | ICMP, IGMP and OSPF use IP protocol numbers; RIP is normally carried over UDP. | **D supported.** RIP-specific protocol mapping is legacy enrichment, not a named 2027 bullet. |
| 16 | 2025_FN_Q22 | CN4.2 | TCP three-way handshake flags | SYN; SYN+ACK; ACK. | **B and D supported.** No apparent text issue. |
| 17 | 2025_AN_Q23 | CN3.4 | IPv4 fragmentation of a UDP-containing datagram | UDP header is part of IP payload; per-fragment IP payload is at most 1480 bytes and non-final fragments use an 8-byte multiple. | **D supported:** 6 fragments; last fragment is 116 bytes including IP header. UDP is contextual/legacy, while the tested skill is fragmentation. |
| 18 | 2025_AN_Q36 | CN2.7 | Stop-and-wait channel utilisation | Tt = 3000/2000 = 1.5 s; round-trip propagation = 0.2 s; U = 1.5/1.7 = 88.23%. | **A supported.** No apparent text problem. |
| 19 | 2025_FN_Q40 | CN3.3 | Longest-prefix forwarding-table lookup | Needs the actual forwarding table and its prefixes. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_40_1]`; the E3 key must not be presented as audited from this file alone. |
| 20 | 2025_FN_Q57 | CN3.4 | Fragmentation through two routers with different MTUs | MTU values and route order are only in the missing figure. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_57_1]`; cannot verify 7 fragments from this text alone. |
| 21 | 2024_FN_Q19 | CN5.1 / CN5.2 | DNS, TCP setup, index GET, embedded-object GET ordering | DNS resolution precedes TCP SYN; index page must arrive before its referenced objects are requested. | **C supported.** No apparent text issue. |
| 22 | 2024_AN_Q14 | CN0.2 / CN1.1 | Destination IP and destination MAC on a packet leaving the source | IP destination is final host Y; MAC destination is the next-hop router interface, not the switch and not Y. | **B supported.** The wording names a switch, which is a distractor; explain why a switch is not the L2 destination. |
| 23 | 2024_AN_Q30 | CN3.4 | IPv4 fragmentation and reassembly locations | A router can fragment a datagram when permitted and outgoing MTU requires it; reassembly is at destination. | **B and C supported.** The DF flag caveat should be explained in the lesson. |
| 24 | 2024_FN_Q23 | CN4.2 | Initial TCP sequence number and SYN-ACK acknowledgement | ISN is selected by each endpoint; ACK acknowledges the peer's SYN with N+1. | **A and D supported.** No apparent text issue. |
| 25 | 2024_FN_Q29 | CN3.5 | Fields changed by outbound NAT | Source IP is rewritten; IPv4 header checksum must be updated. | **A and C supported.** No apparent text issue. |
| 26 | 2024_AN_Q29 | CN3.4 / routing foundation | Fields changed by an IPv4 router | TTL decreases and header checksum is updated. | **C and D supported.** Avoid saying every field is changed. |
| 27 | 2024_FN_Q40 | CN1.3 | Two-link packet pipeline completion time | 1000 packets; each 1000-byte packet takes 8 ms per link; pipeline makes total approximately (1000+1)×8 ms = 8.008 s. | **B supported.** Needs a Gantt/timing diagram; no apparent text issue. |
| 28 | 2024_AN_Q45 | CN3.2 | CIDR prefix for an exact IPv4 address interval | 10.12.2.0 through 10.12.3.255 is one aligned /23 block. | **A supported.** No apparent text issue. |
| 29 | 2024_AN_Q58 | CN4.4 | TCP cwnd after timeout and two RTTs | Exact answer depends on the congestion-control model and the round/ACK timing convention. | **4 is plausible under the stated textbook model; include a round-by-round trace and identify the assumed TCP response.** |
| 30 | 2024_AN_Q36 | CN2.6 | Ethernet minimum frame size for collision detection | 500 m at 2×10^8 m/s gives 2.5 μs one-way; collision detection needs 5 μs round trip; at 10^8 bit/s = 500 bits. | **500 supported.** The round-trip factor must be explicit. |
| 31 | 2024_FN_Q58 | CN3.3 | Longest-prefix routing to multiple hosts | Needs the missing forwarding table. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_58_1]`; cannot independently confirm 40 packets via R2. |
| 32 | 2024_FN_Q43 | CN3.4 | Fragmentation through MTU 542 and then 360 | Payload fragments are aligned to 8-byte offsets; second router may further fragment first-hop fragments. | **6 supported by the stated MTU calculation.** Include a fragment table; no apparent text issue. |
| 33 | 2023_FN_Q17 | CN2.7 | Stop-and-wait utilisation trends | Longer propagation and higher transmission rate both increase the propagation/transmission ratio and reduce utilisation. | **B supported.** No apparent transcription issue. |
| 34 | 2023_FN_Q25 | CN3.6–CN3.7 | OSPF algorithm and protocol class | OSPF is link-state and uses Dijkstra; it is not Bellman–Ford and is not an inter-domain protocol. | **A and C supported as the incorrect statements.** No apparent text issue. |
| 35 | 2023_FN_Q50 | CN4.4 / sequence numbering | Sequence-number width needed to avoid reuse within MSL | 100 Mbps × 120 s = 1.5×10^9 bytes; 30 bits are insufficient, 32 bits and above satisfy the bound. | **B, C, D supported.** State that sequence numbers count bytes for a byte-stream protocol. |
| 36 | 2023_FN_Q52 | CN5.1 / CN5.2 | DNS iterative resolution plus HTTP page and ten embedded objects | Count DNS remote RTTs, TCP setup and object request/response RTTs; persistent pipelining and five parallel non-persistent connections differ. | **C and D supported under the assumptions as written.** Put the full event timeline in the solution. |
| 37 | 2023_FN_Q65 | CN3.3 | Forwarding-table longest-prefix match | Needs the missing forwarding table. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_65]`; cannot validate interface 3 from the current attachment. |
| 38 | 2022_FN_Q22 | CN3.2 | Count subnets in an enterprise topology | Needs the network diagram; each distinct IP network segment/subnet must be counted once. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_22]`; cannot validate 6 from text alone. |
| 39 | 2022_FN_Q35 | CN5.1 | Number of iterative DNS query/response pairs | Root, TLD and authoritative hierarchy produces four query/response pairs in the supplied domain example under the problem's assumptions. | **4 supported.** Explain the resolver's sequence rather than asking the student to memorise a number. |
| 40 | 2022_FN_Q55 | CN3.3 | Aggregate a set of prefixes | Needs the missing routing table; route aggregation depends on the precise prefix set. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_55]`; B and D cannot be checked without it. |
| 41 | 2022_FN_Q57 | CN3.6 | Count-to-infinity loop probability after a link failure | Depends on the missing three-router topology and the event-ordering setup. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_57]`; do not claim 0.5 is audited from the text. |
| 42 | 2022_FN_Q59 | CN1.3 | Satellite propagation plus packet transmission time | One-way propagation: 2100 km / 3×10^8 m/s = 7 ms; 1000 bytes at 100 Mbps = 0.08 ms. | **7.07–7.09 ms supported.** No apparent transcription issue. |
| 43 | 2022_FN_Q60 | CN4.4 / sequence numbering | TCP sequence-number width to avoid wrap during MSL | 1 Gbps / 8 × 60 s = 7.5×10^9 bytes; requires 33 bits. | **33 supported.** Explain byte-based sequence numbers and units. |
| 44 | 2021_AN_Q14 | CN4.2 | TCP SYN-ACK fields | Server chooses its own ISN Y and acknowledges X+1. | **C supported.** No apparent text issue. |
| 45 | 2021_FN_Q13 | Legacy appendix | ARP request and reply MAC destination | Request is broadcast; ordinary reply is unicast to requester. | **C supported.** ARP is not a 2027 core item. |
| 46 | 2021_FN_Q46 | CN2.4 | Hamming code parity/check-bit calculation | The data/check-bit table is only in a missing image. | **Cannot verify — figure/table missing.** Restore `[IMAGE_Q_46_1]`; cannot confirm x=0,y=0 from this file. |
| 47 | 2021_AN_Q50 | CN2.3 | CRC for generator polynomial x³+x+1 and message 11000 | Append three zeroes, perform XOR division; remainder is 100. | **C supported by direct division.** No apparent text issue. |
| 48 | 2021_FN_Q20 | CN4.2 / TCP behaviour | Client and server behaviour after server crash/reboot | Old TCP connection state is lost on reboot; a later segment can receive RST; client may wait if it sends nothing and has no keepalive. | **A, B, C supported.** The question explicitly says no keepalive timer. |
| 49 | 2021_FN_Q22 | CN3.4 / CN4.1 | IPv4 fragments of a TCP segment and loss recovery | First fragment carries transport header; second fragment's offset is in 8-byte units; TCP retransmission is end-to-end. | **A and C supported.** The 620-byte second fragment follows from 600-byte payload? Show the actual 800/600-byte fragment payload split in a trace table. |
| 50 | 2021_AN_Q53 | CN3.6 | One-round distance-vector update for P and Q | Cost via neighbour = local link cost + neighbour's advertised destination cost; P: min(10,8,10)=8 via Y; Q: min(7,8,13)=7 via X. | **B and C supported from the text values.** The absent figure should still be restored for full fidelity. |
| 51 | 2021_FN_Q42 | CN2.7 | Window size for 50% link utilisation | Includes data transmission, ACK transmission and round-trip propagation; ACK frame is small but non-zero. | **50–52 supported by the stated tolerance.** Solution must show the exact utilisation formula and rounding. |
| 52 | 2021_AN_Q32 | CN2.5 | Pure ALOHA throughput for Poisson attempts | Frame time = 1 ms; G=1; S=G e^(−2G), giving about 135 successful frames/s. | **130–140 supported.** Explain why the vulnerable period is two frame times. |
| 53 | 2020_FN_Q29 | CN3.4 / routing foundation | Router modifies packets; static routing; fragment reassembly | Router changes TTL/checksum; it need not run a dynamic routing protocol; reassembly is not done at intermediate routers. | **D supported.** No apparent text issue. |
| 54 | 2020_FN_Q31 | CN5.2 | Non-persistent HTTP connections for an HTML page and five images | Separate non-persistent TCP connection per object gives six connections. | **6 supported.** No apparent text issue. |
| 55 | 2020_FN_Q64 | CN3.2 | Select valid /21 blocks inside 202.61.0.0/17 | /21 blocks advance in steps of 8 in the third octet; candidate bases must be aligned and inside the /17. | **B (II and III) supported.** No apparent text issue. |
| 56 | 2020_FN_Q62 | CN4.4 | TCP cwnd after 60 ms with 6 ms RTT, ssthresh and rwnd cap | Trace ten RTTs; slow start reaches 32 KB, then additive increase, subject to 50 KB receiver window. | **44 supported under the usual textbook round convention.** Include the full RTT table; no apparent transcription issue. |
| 57 | 2019_FN_Q25 | Legacy appendix | SMTP sends email; POP3 retrieves it | Distinguish mail transfer from mailbox retrieval. | **B supported.** Email protocols are not in 2027 core. |
| 58 | 2019_FN_Q58 | CN3.2 | Membership of three addresses in /30 subnets | /30 ranges are four addresses each; .2 is in .0/30 and .5/.6 are in .4/30. | **C supported.** No apparent text issue. |
| 59 | 2019_FN_Q64 | Legacy appendix | ARP request to find a same-subnet MAC | ARP request is sent as a local broadcast. | **C supported.** ARP is not a 2027 core bullet. |
| 60 | 2019_FN_Q62 | CN2.1 / legacy Ethernet | Minimum number of 8-port switches for 15 hosts with no uplink ports | Inter-switch links consume two switch ports; usable host ports are 8k−2(k−1). | **3 supported.** Show port accounting; bridging/switch-count is a legacy extension. |
| 61 | 2019_FN_Q46 | Remove from CN core | RSA modulus and Euler totient factorisation | This is number theory/cryptography, not an application-layer networking protocol. | **97 is mathematically supported, but the bank classification is wrong.** Move it out of Computer Networks. |
| 62 | 2018_FN_Q23 | Legacy appendix | UDP port length, Ethernet MAC length, IPv6 Next Header and TCP sequence field | Values are 16, 48, 8 and 32 bits respectively. | **C supported.** UDP/IPv6 detail is not a 2027 core topic. |
| 63 | 2018_FN_Q24 | CN4.4 | TCP slow-start growth | cwnd grows by about one MSS per ACK and approximately doubles per RTT; not by two MSS per ACK. | **C supported.** The options are clear; explain the difference between ACK and RTT. |
| 64 | 2018_FN_Q35 | CN4.4 / sequence numbering | Time for a 32-bit TCP byte sequence space to wrap at 1 Gbps | 2^32 bytes × 8 / 10^9 bits/s ≈ 34.36 s. Starting value 1234 does not change the wrap interval. | **34–35 supported.** Make clear the sequence space counts bytes. |
| 65 | 2018_FN_Q64 | CN3.4 | Fragment offset for third IPv4 fragment | MTU 600 gives 580 bytes after header, rounded down to 576 payload bytes; third fragment offset = 1152/8 = 144. | **144 supported.** No apparent text issue. |
| 66 | 2018_FN_Q65 | CN2.5 / CN2.6 | CSMA carrier-sensing race and maximum node distance | Signal must reach Q within the five-unit sensing period; speed 10 m/unit gives d ≤ 50 m. | **50 supported.** No apparent text issue. |
| 67 | 2017_AN_Q34 | Legacy appendix / CN3.6–CN3.7 | RIP and OSPF properties | RIP is distance-vector and uses UDP; OSPF is link-state and does not use TCP. | **C supported.** RIP details are legacy; keep only as a short DV example. |
| 68 | 2017_FN_Q12 | CN4.2 | TCP FIN close state after ACK to active closer | Client enters FIN-WAIT-2 while waiting for peer FIN. | **D supported.** No apparent text issue. |
| 69 | 2017_FN_Q28 | Remove from CN core | Birthday attack against a digitally signed message | Cryptographic collision/birthday-attack reasoning; not one of the GATE 2027 CN syllabus topics. | **B is the tick shown, but do not present this as CN application-layer content.** Keep only in a separate security archive if the bank wants to preserve it. |
| 70 | 2017_AN_Q18 | Legacy appendix | Connected UDP socket peer behaviour | `connect()` on UDP sets/changes the default peer; it is not a TCP-style connection handshake. | **B supported.** UDP sockets are not named in the 2027 syllabus. |
| 71 | 2017_AN_Q27 | Legacy appendix | IPv4 Record Route option capacity | IPv4 option field is 40 bytes; the option uses 3 control bytes and 4 bytes per router address, so floor((40−3)/4)=9. | **9 supported.** IP options are not a 2027 core topic. |
| 72 | 2017_FN_Q63 | CN2.3 | CRC transmitted word for generator x³+x+1 | Remainder for 01011011 is 101; append it to the data. | **C supported.** No apparent text issue. |
| 73 | 2017_AN_Q65 | CN2.4 | Minimum Hamming distance and correction capability | Minimum pairwise Hamming distance is 3; correctable errors = floor((3−1)/2)=1. | **A supported.** Error correction should be an extension rather than a main 2027 chapter. |
| 74 | 2017_AN_Q56 | CN1.3 | Transmission versus propagation delay | 50,000 bytes = 400,000 bits, giving 400 ms transmission; 10,000 km at 2×10^8 m/s gives 50 ms propagation. | **D supported.** No apparent text issue. |
| 75 | 2017_FN_Q47 | Remove from CN core | RSA private exponent | φ(n)=192; inverse of 35 modulo 192 is 11. | **11 is supported mathematically, but this is cryptography, not a 2027 CN syllabus topic.** Retag outside CN. |
| 76 | 2017_FN_Q56 | CN2.7 | Stop-and-wait ARQ efficiency with processing and ACK times | Data frame is 2000 bytes including overhead; ACK is 20 bytes; include two-way propagation and the stated processing time. | **Official range 86.5–89.5 is consistent with an efficiency around 88.4%.** Show exactly which processing intervals are included; do not hide them. |

### 6.1 The nine missing figures

These questions cannot be fully checked from the supplied text because the needed visual data are absent:

1. `2025_FN_Q40` — forwarding table for longest-prefix match.
2. `2025_FN_Q57` — two-router MTU diagram.
3. `2024_FN_Q58` — forwarding table and prefixes.
4. `2023_FN_Q65` — forwarding table.
5. `2022_FN_Q22` — enterprise network topology.
6. `2022_FN_Q55` — routing table for CIDR aggregation.
7. `2022_FN_Q57` — three-router topology for count-to-infinity.
8. `2021_FN_Q46` — Hamming-code data/check-bit tables.
9. `2021_AN_Q53` — routing topology (text supplies enough numerical information to calculate the update, but the original figure is still missing).

The input's note “Figures are not shown” is not a harmless formatting issue. A question bank that has answer keys but omits essential diagrams is not a complete question bank.

### 6.2 Bank arithmetic and reliability

The arithmetic in the summary table is internally consistent:

- Questions: 18 + 21 + 15 + 8 + 9 + 5 = **76**.
- Marks: 34 + 31 + 22 + 13 + 12 + 6 = **118**.
- 118 / 1500 = **7.87%**, which rounds to **7.9%**.
- 118 / 15 papers = **7.87 marks per paper**, also rounding to **7.9**.

However:
- The 76-question bank is not proven complete against all 15 source papers.
- The topic buckets are coarse and at least three classifications are misleading: RSA and birthday-attack questions are under Application Layer/Security; the ARP/TCP item is under OSI/TCP-IP.
- Difficulty is subjective unless the creator records the rubric.
- “Years asked (of 10)” must be defined separately from “number of papers (15)”.
- The 2017–2026 historical distribution must not be presented as a prediction for the revised 2027 syllabus.
- Some questions are from content no longer named in the 2027 syllabus. Their historical frequency does not make them current core syllabus.

---

# PART 7. THREE NEW QUESTION IDEAS FOR EACH LESSON

These are ideas for newly authored practice questions, not claims that GATE has asked them. Use MCQ/MSQ/NAT as the practice format.

| Lesson | Three question ideas (one line each) |
|---|---|
| CN0.1 | **NAT:** Convert 12.5 MB to bits and find transmission time at 20 Mbps. **MCQ:** Identify which unit is a data rate. **NAT:** Convert 3.2×10^6 bits to bytes and KB using the stated convention. |
| CN0.2 | **MCQ:** Identify whether a switch or router is needed to reach another IP network. **MSQ:** Select which addresses remain end-to-end and which change at each link. **NAT:** Count the number of separate LAN subnets in a simple topology. |
| CN1.1 | **MCQ:** Match protocol, service and interface examples. **MSQ:** Select every header added during encapsulation. **NAT:** Count the number of headers/trailers at a specified point in the stack. |
| CN1.2 | **MCQ:** Choose which switching method requires a setup phase. **MSQ:** Compare resource reservation and packet ordering across the three switching types. **NAT:** Calculate the total setup plus transfer delay under a stated circuit-switching assumption. |
| CN1.3 | **NAT:** Calculate total transmission plus propagation delay for a two-link path. **NAT:** Find bottleneck throughput and total pipeline completion time for N equal packets. **MCQ:** Identify which delay changes when link distance doubles. |
| CN2.1 | **MCQ:** Identify the Ethernet source and destination MAC fields. **MSQ:** Select which fields are link-local and which are end-to-end. **NAT:** Find maximum payload when an Ethernet frame's stated size limit includes a fixed header/trailer. |
| CN2.2 | **MCQ:** Determine whether an even-parity bit detects a given error pattern. **NAT:** Calculate the parity bit for a binary word. **MSQ:** Distinguish error detection from correction in three coding methods. |
| CN2.3 | **NAT:** Compute CRC check bits for a new bit string and generator. **MCQ:** Determine remainder length from generator degree. **MSQ:** Identify which received bit strings pass/fail a given CRC check. |
| CN2.4 | **NAT:** Find minimum Hamming distance for a four-codeword set. **MCQ:** Find maximum detectable errors from a minimum distance. **NAT:** Find maximum correctable errors from a minimum distance. |
| CN2.5 | **NAT:** Calculate pure ALOHA throughput from frame time and attempt rate. **MCQ:** Identify a vulnerable period for slotted versus pure ALOHA. **NAT:** Find whether two carrier-sensing stations collide given distance and sensing interval. |
| CN2.6 | **NAT:** Calculate minimum Ethernet frame size from rate and propagation speed. **MCQ:** Identify when CSMA/CD is not used in modern switched full-duplex Ethernet. **MSQ:** Select the factors that affect a collision domain. |
| CN2.7 | **NAT:** Calculate minimum window size for 90% link utilisation. **NAT:** Calculate stop-and-wait efficiency with non-zero ACK transmission. **MCQ:** Identify why link-layer sequence numbers need a finite sequence space. |
| CN3.1 | **NAT:** Convert an IPv4 octet into binary. **MCQ:** Identify how many bits are in an IPv4 address. **NAT:** Count host bits from a given prefix. |
| CN3.2 | **NAT:** Find usable hosts in a /27 network. **MCQ:** Identify a valid network base address for a prefix. **NAT:** Find the address range containing a given interface. |
| CN3.3 | **NAT:** Find the longest-prefix route for a destination. **MSQ:** Select prefixes that can be aggregated exactly. **MCQ:** Explain why a more-specific route beats a less-specific match. |
| CN3.4 | **NAT:** Fragment a datagram over a given MTU and report offset/MF. **NAT:** Re-fragment one first-hop fragment at a smaller second-hop MTU. **MCQ:** Identify what happens when DF is set and MTU is too small. |
| CN3.5 | **MCQ:** Identify which fields outbound NAT changes. **NAT:** Complete a two-entry translation table for two internal hosts. **MSQ:** Select which reply packet matches a stored NAT mapping. |
| CN3.6 | **NAT:** Perform one distance-vector update with four neighbours. **MCQ:** Identify the count-to-infinity failure pattern. **MSQ:** Select which remedies reduce routing loops. |
| CN3.7 | **NAT:** Run Dijkstra on a five-router graph. **MCQ:** Identify which node is finalised next. **MSQ:** Select all valid shortest paths when equal-cost alternatives exist. |
| CN4.1 | **NAT:** Determine the next expected TCP ACK after receiving a byte range. **MCQ:** Distinguish segment from byte stream. **MSQ:** Identify the fields required to demultiplex TCP connections. |
| CN4.2 | **NAT:** Fill SYN/SYN-ACK/ACK sequence and acknowledgement numbers. **MCQ:** Identify TCP state after a specified FIN/ACK. **MSQ:** Identify which simultaneous-close events are possible. |
| CN4.3 | **NAT:** Compute the sender's permitted outstanding bytes from rwnd. **MCQ:** Distinguish advertised window from congestion window. **MSQ:** Select which ACK movement opens additional sending space. |
| CN4.4 | **NAT:** Trace cwnd through five RTT rounds including a timeout. **MCQ:** Identify when slow start changes to congestion avoidance. **NAT:** Calculate the maximum flight size from cwnd and rwnd. |
| CN4.5 | **MCQ:** Choose the correct server-side socket call order. **MSQ:** Identify all calls made by the client versus server. **NAT:** Count established connections after a small forked server trace (with process assumptions stated). |
| CN4.6 | **MCQ:** Compare TCP and UDP delivery guarantees. **MSQ:** Identify which UDP socket operations change its default peer. **NAT:** Calculate UDP datagram size from payload plus header. |
| CN5.1 | **NAT:** Count uncached iterative DNS query/response exchanges. **MCQ:** Identify which server is authoritative for a domain. **MSQ:** Determine which lookups can be skipped due to a cache entry. |
| CN5.2 | **NAT:** Count TCP connections for one HTML page and six objects. **MCQ:** Distinguish persistent connection from pipelining. **MSQ:** Select HTTP/1.1 behaviours that reuse a connection. |
| CN5.3 | **NAT:** Calculate complete rendering time for DNS + TCP + HTTP under explicit cache/parallelism assumptions. **MCQ:** Put all outgoing events in chronological order. **MSQ:** Compare total RTTs under pipelined and non-persistent modes. |

---

# PART 8. WHAT IS MISSING FROM THE SUBJECT

This section separates genuinely required 2027 content from topics that are merely absent in the five-title outline.

## 8.1 Required 2027 material not demonstrated in v0

1. **Switching performance metrics** — explicitly added in 2027; absent as a named lesson.
2. **Transmission, propagation, processing and queuing delay** — essential to performance questions.
3. **Throughput, utilisation and bandwidth–delay product** — essential to metrics and timing calculations.
4. **Packetisation and pipeline timing** — needed for multi-hop transfer questions.
5. **Layering concepts** — service, interface, protocol, encapsulation, decapsulation and PDU naming.
6. **CRC/XOR from first principles** — the bank has several CRC questions, but the chapter list gives no lesson details.
7. **MAC mechanisms** — ALOHA/CSMA and classic Ethernet collision behaviour must be visible in the plan.
8. **Ethernet frame and MAC address basics** — “Ethernet” is retained in 2027.
9. **CIDR alignment and route aggregation** — not just host count calculations.
10. **Longest-prefix forwarding lookup** — multiple questions depend on routing tables.
11. **IPv4 fragmentation across more than one MTU** — including offset and MF fields.
12. **NAT translation state and header changes**.
13. **Distance-vector update/convergence** — not just algorithm names.
14. **Link-state topology database and Dijkstra trace**.
15. **TCP flow control** — rwnd and sender window mechanics.
16. **TCP congestion control** — cwnd, ssthresh, slow start and congestion avoidance.
17. **TCP socket API** — explicitly named in the 2027 syllabus.
18. **DNS recursive/iterative hierarchy and caching**.
19. **HTTP persistence, pipelining and timing**.
20. **A reliable worked-solution system** for every numerical question.

These are “not demonstrated” because v0 has only chapter headings, not lesson contents. They must be confirmed in the forthcoming detailed plan and the actual chapters.

## 8.2 Older topics to keep in an appendix

- ARP, DHCP and ICMP.
- UDP.
- IPv6 overview.
- SMTP, FTP and Email.
- Ethernet bridge learning-table examples.
- Flooding.
- Hamming error correction.
- IPv4 Record Route option.
- RSA, digital signatures and birthday attacks should be removed from the CN book or placed in a separate cryptography/security archive, not presented as core Computer Networks content.

## 8.3 Topics not to add without evidence

Do not inflate the book with general internet topics simply because they are interesting. In particular, do not add a large section on wireless routing, BGP, IPv6 header detail, network security suites, TLS, QUIC, HTTP/3 or modern cloud networking unless the project has a separate broader-networking objective. They may be useful general knowledge, but they are not named in the GATE 2027 CN list cited here.

---

# PART 9. CHAPTER WEIGHTS AND FINAL DECISION

## 9.1 Revised 2027 priority weights

These are study priorities based on syllabus breadth and prerequisites, **not a prediction of marks**.

| Revised chapter | Weight | Reason |
|---|---|---|
| Principles of layering, switching and performance | **Foundation / High** | Introduces the whole subject; the 2027 wording explicitly adds performance metrics. |
| Data link, error detection, MAC and Ethernet | **High** | Direct 2027 syllabus line; substantial historical bank presence. |
| IPv4 addressing, CIDR, fragmentation and NAT | **High** | Multiple explicit 2027 subtopics and a large historical question bucket. |
| Distance-vector and link-state routing | **High** | Both are directly named and require hand calculation. |
| TCP flow control, congestion control and socket API | **High** | Three explicit 2027 areas; several numerical and state-trace question types. |
| DNS and HTTP | **Medium–High** | Both are direct 2027 syllabus items; timing and protocol sequence questions need practice. |
| Legacy appendix (ARP/DHCP/ICMP, UDP, IPv6, SMTP/FTP/Email, security, bridging) | **Low / Later** | Preserve older-paper context without allowing it to dominate the current book. |

## 9.2 Does the original bank-derived weighting look fair?

Not as a GATE 2027 priority model. The original table reports:
- Data Link: 18 questions / 34 marks.
- Fragmentation and IP Addressing: 21 / 31.
- Transport: 15 / 22.
- Routing: 8 / 13.
- Application: 9 / 12.
- OSI/TCP-IP: 5 / 6.

Those values sum correctly, but the buckets include topics removed or no longer named in 2027. In particular, IP-addressing also includes ARP/DHCP/ICMP; transport includes UDP; application includes Email/security; and data link includes framing/bridging. The table should be rebuilt with **2027 core, foundation and legacy tags** before using it for time allocation.

## 9.3 Decision: approve, pilot or stop?

**Approve:** the idea of a beginner-first Computer Networks book and a corrected lesson plan.

**Approve only as a pilot:** the revised lesson sequence and Claude's new writing workflow, once the prompt is updated to the 2027 syllabus.

**Do not approve yet:** rewriting every old lesson in bulk, publishing the book, or charging ₹149.

### Pilot lessons to write first

Write these six lessons and test them with at least five students who are genuinely weak in networking:

1. CN1.1 — Why networks use layers.
2. CN1.3 — Delay, throughput and utilisation.
3. CN2.3 — CRC from the beginning.
4. CN3.2 — CIDR and subnetting.
5. CN3.4 — IPv4 fragmentation.
6. CN4.4 — TCP congestion control.

These six lessons test the book's hardest teaching jobs: abstraction, units, binary calculation, address arithmetic, packet-field tracing and time-based protocol behaviour.

### Pilot acceptance criteria

A lesson passes only if:

- A weak student can explain the main idea without copying the wording.
- Every new technical word is defined before it is used in a solution.
- The first worked example starts with small numbers and shows every step.
- Each numerical question has a diagram or trace table when one would help.
- The solution shows units and states assumptions.
- The lesson contains at least one worked question, one guided question and independent practice.
- A reviewer can reproduce every numeric answer independently.
- There are no unsupported “very common” or “always asked” claims.
- The student can solve a new, unseen question of the same pattern after the lesson.
- At least four of five pilot students can complete the basic learning objective without requiring the teacher to fill in skipped steps. If they cannot, rewrite the lesson before moving forward.

---

# CLAUDE MASTER WRITING INSTRUCTIONS — PATCH FOR THIS PROJECT

Use the following as the revised project-level instruction for writing the GATE CS 2027 Computer Networks book.

```text
ROLE
You are writing a beginner-first GATE CS 2027 Computer Networks textbook.
The reader is 25, has failed GATE twice, has backlogs, remembers little from
college, is embarrassed to ask questions, and has approximately 100 days left.
Assume the reader has forgotten basic networking terms and cannot follow a
solution that skips steps.

SYLLABUS AUTHORITY
Use the official GATE 2027 CS syllabus as the scope authority.
The Computer Networks section is:
- Principles of Layering
- Basics of switching (circuit, packet and virtual circuit) and performance metrics
- Data link layer: error detection, Medium Access Control, Ethernet
- Distance vector and link state routing
- IPv4 - Fragmentation, CIDR Notation, Network Address Translation
- TCP - flow control and congestion control, socket API
- DNS and HTTP

Do not use the longer 2026 syllabus as if it were the 2027 syllabus.
Mark ARP, DHCP, ICMP, UDP, IPv6, SMTP, FTP, Email, flooding, Ethernet
bridging and security topics as FOUNDATION, LEGACY or LATER when appropriate.
Do not silently delete a topic that is necessary to understand a current topic;
explain why it is included and keep it short.

TEACHING RULES
1. Start from zero. Never assume the student remembers a definition.
2. Define every technical term before relying on it.
3. Explain the physical meaning before giving a formula.
4. Use one small example before the GATE-level example.
5. Never skip algebra, binary conversion, unit conversion or intermediate steps.
6. Use short paragraphs and simple English. Avoid unexplained abbreviations.
7. Use an analogy only to begin understanding; immediately connect it to the
   correct technical model and state where the analogy stops working.
8. Do not claim that a question type is frequent unless the verified bank
   supports the statement. Prefer "not sure" when the evidence is insufficient.
9. Distinguish the syllabus concept from enrichment and old-paper-only content.
10. State the model/assumption whenever TCP behaviour, packet forwarding,
    store-and-forward timing, fragmentation or utilisation depends on it.

MANDATORY LESSON STRUCTURE
A. What you will be able to do
B. Why this concept exists
C. Words you must understand (plain definitions)
D. Explanation from the beginning
E. One tiny example
F. One fully worked example with every step shown
G. Diagram(s) with labels and a sentence saying what to notice
H. Hand trace/table where the topic changes over time or over steps
I. GATE-level question pattern
J. Common mistakes and why they are wrong
K. Short practice set with full worked solutions
L. One-page recap and prerequisite links

NUMERICAL RULES
- Write units on every line.
- Keep bits and bytes separate.
- Show decimal or binary unit convention exactly as the question specifies.
- For delay, show transmission, propagation, processing and queuing separately.
- For CIDR, show prefix bits, host bits, block size and address alignment.
- For fragmentation, show each fragment's payload, total length, offset in 8-byte
  units, MF and DF status.
- For CRC, show XOR division row by row.
- For routing, show every neighbour cost or Dijkstra iteration.
- For TCP windows, show the value at every RTT/ACK event and state the initial
  cwnd, ssthresh, MSS, rwnd and TCP response model.
- Never output a final numeric answer without showing how it was obtained.

DIAGRAM RULES
Do not write "see diagram" without providing one.
Every diagram must have a title, labelled arrows/fields, a short caption and
one explicit observation question for the learner.
Use step-by-step frames for algorithms and packet/state changes.
Use trace tables for calculations that evolve over time.

PYQ RULES
- Keep the original question wording and ID traceable to the source paper.
- Restore every figure from the original paper.
- Preserve official answer ranges for NAT questions.
- Mark whether the question is CORE-2027, FOUNDATION, LEGACY-2026 or OUT-OF-SCOPE.
- Do not treat an old question as evidence that the topic is in the current syllabus.
- Independently solve every answer and record the calculation.
- If a figure is absent or a statement is ambiguous, mark NEEDS-SOURCE-CHECK.
- Do not invent a year, question number, mark value or official answer.

RELEASE GATE
Do not generate all chapters in one batch.
Write the six pilot lessons listed in the review, run them through the beginner
test, correct them, then write the remaining lessons using the approved style.
```

---

# SOURCES AND VERIFICATION NOTES

1. **Official GATE 2027 syllabus landing page — IIT Madras:**  
   https://gate2027.iitm.ac.in/exam_papers_and_syllabus  
   The page says the 2027 syllabi have been revised and links the CS syllabus. The official CS PDF is:  
   https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf

2. **GATE 2026 official syllabus wording — IIT Guwahati:**  
   https://gate2026.iitg.ac.in/doc/IB/GATE2026-IB-v22082025-1300.pdf  
   Section 10 includes the longer old wording, including OSI/TCP-IP stacks, framing, Ethernet bridging, shortest path, flooding, ARP/DHCP/ICMP, UDP and SMTP/FTP/Email. This is useful for explaining why the submitted v0 looks like the 2026 version.

3. **GATE 2026 official master question papers and answer keys — IIT Guwahati:**  
   https://gate2026.iitg.ac.in/QPs-answer-keys.html  
   The page states that answer keys correspond to the master paper ordering, explains MCQ/MSQ/NAT marking, and defines MTA (“Marks To All”). Always use the master paper and its final key when validating a published PYQ.

4. **GATE 2026 official CS1 master paper:**  
   https://gate2026.iitg.ac.in/doc/download/2026/QPs/CS1.pdf

5. **GATE 2026 official CS2 master paper:**  
   https://gate2026.iitg.ac.in/doc/download/2026/QPs/CS2.pdf

6. **GATE 2026 previous-year downloads page:**  
   https://gate2026.iitg.ac.in/download.html  
   Lists a bulk download of question papers from 2007 to 2025 and year-wise papers for recent years.

7. **Independent 2027 syllabus comparison (secondary source; use only to help interpret the change, not as the authority):**  
   https://themlhub.ai/blog/gate-cse-2027-syllabus-changes  
   This page compares the 2026 and 2027 CN scope and identifies the removed explicitly named topics. The official IIT Madras syllabus remains the source of truth.

---

## Final student verdict

I would not pay ₹149 for what is attached today. I would reconsider after I can read the six pilot lessons and solve new questions without a teacher filling in the missing steps. The plan has the right five broad areas, but it is still a contents list with an old syllabus map, incomplete evidence of coverage and a question bank missing nine figures. Fix the 2027 scope first, then prove the teaching works on weak students. That is the difference between a book that merely contains networking facts and a book that can actually teach me Computer Networks.
