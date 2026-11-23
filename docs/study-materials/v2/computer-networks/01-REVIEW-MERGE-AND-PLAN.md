# Computer Networks: review merge and plan v1

Merged: ChatGPT (`reviews-received/chatgpt-review-computer-networks.md`) and Gemini (`reviews-received/gemini.txt`).

## 1. How good were they
Both are strong, with different strengths. ChatGPT checked the **2027 syllabus** and warns that our syllabus text (written from memory) may be out of date, and it separates "required now" from "legacy". Gemini maps every missing topic to the PYQs that test it and notices that Computer Networks is arithmetic-heavy and easy-to-medium (only 4 of 76 questions are Hard; 16 of 18 data-link questions are 2-mark).

## 2. The one disagreement that matters: what is in the 2027 syllabus
ChatGPT says the 2027 CN lines are shorter: layering, **switching and performance metrics** (new), data link / MAC / Ethernet, routing, IPv4 / CIDR / fragmentation / NAT, TCP (flow and congestion control, sockets), and application layer **DNS and HTTP** only. It treats ARP, DHCP, ICMP, UDP, SMTP, FTP, e-mail, bridging, flooding, IPv6 and security as legacy. A web search found the official PDF (`gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf`) and secondary sites that agree the section was revised and shortened, but they disagree on details, and I could not read the PDF text itself. **Status: not yet verified by me.**

**Decision (critical, to avoid losing concepts either way):** nothing is deleted. Every topic is kept and carries a **syllabus-status tag**: [2027-CORE] (named in the 2027 lines), [LEGACY-ASKED] (not in the 2027 lines as far as the reviewers can tell, but asked in our 2017–2026 papers, so it stays as a [SHOULD] lesson or a short section), or [BEYOND] (kept as a one-page note). When the official lines are confirmed, only the tags change, not the content. Do not add large new areas (BGP, TLS, QUIC, wireless routing) without a syllabus reason.

## 3. Data findings about our question bank
- **Security questions sit in the wrong subject.** 2019_FN_Q46 (RSA), 2017_FN_Q47 (RSA) and 2017_FN_Q28 (digital signature and birthday attack) are cryptography, filed under Application Layer. They are not Computer Networks content. Keep them as an optional cryptography note and retag.
- **Retagging by concept, not bucket:** 2025_AN_Q16 (ARP and TCP piggybacking) is filed under "OSI & TCP/IP layers"; several "IP addressing" items are ARP/DHCP/ICMP.
- **Nine figure-dependent questions** cannot be re-solved from text alone: 2025_FN_Q40, 2025_FN_Q57, 2024_FN_Q58, 2023_FN_Q65, 2022_FN_Q22, 2022_FN_Q55, 2022_FN_Q57, 2021_FN_Q46, 2021_AN_Q53. Their figures are in our images folder and must be checked when writing each lesson.
- **No transcription error was reported** for the 76 questions by either reviewer (unlike TOC and OS). Both did note that difficulty labels have no rubric and that the bank is not proven complete.
- Bank arithmetic is correct: 76 questions, 118 marks, 7.9% of all marks.

## 4. The plan (chapters, lessons, tags)
Bank evidence is coarse. The weights below combine syllabus breadth with it, and are study priorities, not forecasts.

**0 · Before networking** [MUST, Foundation] ~5 h. Units (bit vs byte, 10³ vs 2¹⁰), bandwidth vs speed, transmission, propagation, processing and queuing delay, throughput, utilisation, bandwidth–delay product, pipelining timing. The reviewers call this the number-one beginner failure point.

**1 · Layering, switching and performance** [2027-CORE, Foundation/High] ~8 h. 1.1 why layers; service, interface, protocol, encapsulation, PDU names; 1.2 OSI vs TCP/IP; 1.3 circuit, packet and virtual-circuit switching; **performance metrics** and multi-hop store-and-forward timing; 1.4 hop-by-hop MAC vs end-to-end IP (what changes at each hop).

**2 · Data link, error detection, MAC and Ethernet** [2027-CORE, Very High: 18 q / 34 marks] ~16 h. 2.1 framing and bit stuffing; 2.2 parity, checksum, **CRC from first principles** (XOR division); Hamming distance and Hamming codes; 2.3 **stop-and-wait and sliding window (link ARQ, utilisation, window size, sequence bits)**, kept here (Gemini: they were wrongly in the transport chapter); 2.4 MAC: pure and slotted ALOHA, CSMA, CSMA/CD and the minimum frame size; 2.5 Ethernet frames, MAC addresses, bridges and learning switches [LEGACY-ASKED], switch port counting.

**3 · IPv4, CIDR, fragmentation, NAT and routing** [2027-CORE, Very High: 29 q / 44 marks with routing] ~18 h. 3.1 IPv4 header fields and protocol numbers; 3.2 **CIDR, subnet masks, VLSM, alignment, route aggregation, subnet counting**; 3.3 **longest-prefix match**; 3.4 **fragmentation across several MTUs** (offset in 8-byte units, MF, header size); 3.5 NAT (which fields change); 3.6 ARP, DHCP, ICMP [LEGACY-ASKED]; 3.7 **distance-vector** (update, count to infinity, convergence), 3.8 **link-state** (Dijkstra trace), flooding [LEGACY-ASKED]; 3.9 IPv6 overview [LEGACY-ASKED/BEYOND]; hierarchical routing RIP/OSPF facts.

**4 · Transport: TCP, flow and congestion control, sockets** [2027-CORE, High: 15 q / 22 marks] ~13 h. 4.1 ports, sockets and the socket API (including connected UDP sockets); 4.2 UDP [LEGACY-ASKED]; 4.3 TCP segment, three-way handshake (flags, sequence and acknowledgement numbers), connection close, state diagram, RST after reboot; 4.4 flow control (receiver window); 4.5 **congestion control** (slow start, congestion avoidance, timeout vs three duplicate ACKs, round-by-round tables); 4.6 sequence-number wrap-around and the maximum segment lifetime; leaky and token bucket shaping [SHOULD].

**5 · DNS and HTTP** [2027-CORE, Medium–High] ~7 h. 5.1 DNS hierarchy, iterative vs recursive, caching, counting query pairs; 5.2 HTTP non-persistent vs persistent, pipelining and parallel connections (RTT formulas); 5.3 SMTP, POP3, IMAP, MIME, FTP, e-mail [LEGACY-ASKED]; 5.4 a short cryptography note (RSA, signatures, birthday attack) [BEYOND, outside CN].

**6 · Previous-year practice** [MUST] ~6 h. Every PYQ by pattern, MCQ / MSQ / NAT, with a unit drill.

## 5. Pilot lessons (ChatGPT's suggestion, adopted)
Test with real weak readers first: why layers; delay, throughput and utilisation; CRC from the beginning; CIDR and subnetting; IPv4 fragmentation; TCP congestion control. A lesson passes only if a weak reader can solve a new question of the same pattern afterwards.

## 6. Next steps
1. **You:** open the official PDF above, copy the Computer Networks lines, and paste them to me so the status tags can be set.
2. Tag the 76 PYQs one-per-chapter and by concept; retag the three security questions.
3. Check the nine figure questions against their images.
4. Build subnetting, fragmentation, CRC and congestion-window labs on the figure engine.
