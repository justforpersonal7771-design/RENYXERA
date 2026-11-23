# Computer Networks: contents draft v0 (from the app's catalog and the PYQ bank)

Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Concept of layering: OSI and TCP/IP protocol stacks; basics of packet, circuit and virtual circuit switching.
- Data link layer: framing, error detection, Medium Access Control, Ethernet bridging.
- Routing protocols: shortest path, flooding, distance vector and link state routing.
- Fragmentation and IP addressing, IPv4, CIDR notation, basics of IP support protocols (ARP, DHCP, ICMP), Network Address Translation (NAT).
- Transport layer: flow control and congestion control, UDP, TCP, sockets.
- Application layer protocols: DNS, SMTP, HTTP, FTP, Email.

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

### Question IDs by bank topic (so a reviewer can say which ones a lesson should use)

- **Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)**: 2026_FN_Q18, 2026_FN_Q44, 2026_AN_Q58, 2025_FN_Q22, 2024_FN_Q23, 2024_AN_Q58, 2023_FN_Q50, 2022_FN_Q60, 2021_FN_Q20, 2021_AN_Q14, 2020_FN_Q62, 2018_FN_Q24, 2018_FN_Q35, 2017_FN_Q12, 2017_AN_Q18
- **Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security**: 2026_FN_Q19, 2024_FN_Q19, 2023_FN_Q52, 2022_FN_Q35, 2020_FN_Q31, 2019_FN_Q25, 2019_FN_Q46, 2017_FN_Q28, 2017_FN_Q47
- **Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)**: 2026_FN_Q45, 2026_AN_Q43, 2026_AN_Q65, 2025_AN_Q36, 2024_AN_Q14, 2024_AN_Q36, 2023_FN_Q17, 2022_FN_Q59, 2021_FN_Q46, 2021_FN_Q42, 2021_AN_Q50, 2021_AN_Q32, 2019_FN_Q62, 2018_FN_Q65, 2017_FN_Q63, 2017_FN_Q56, 2017_AN_Q65, 2017_AN_Q56
- **Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)**: 2026_FN_Q56, 2026_AN_Q22, 2026_AN_Q33, 2025_FN_Q57, 2025_AN_Q18, 2025_AN_Q23, 2024_FN_Q29, 2024_FN_Q43, 2024_AN_Q30, 2024_AN_Q29, 2024_AN_Q45, 2022_FN_Q22, 2022_FN_Q55, 2021_FN_Q13, 2021_FN_Q22, 2020_FN_Q29, 2020_FN_Q64, 2019_FN_Q58, 2019_FN_Q64, 2018_FN_Q64, 2017_AN_Q27
- **OSI & TCP/IP Protocol Layers**: 2026_AN_Q21, 2025_FN_Q16, 2025_AN_Q16, 2024_FN_Q40, 2018_FN_Q23
- **Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing)**: 2025_FN_Q40, 2025_AN_Q17, 2024_FN_Q58, 2023_FN_Q25, 2023_FN_Q65, 2022_FN_Q57, 2021_AN_Q53, 2017_AN_Q34

## 4. What we need from this review

1. A **complete chapter and lesson list** for a beginner-first book on this subject (use the syllabus lines above, the standard books and what GATE really asks).
2. For each lesson: **finer points**, **GATE question patterns**, **diagrams needed**, **hand traces**, and which **prerequisite** a zero-level reader needs.
3. Which of the bank's topic labels map to which lesson, and which PYQs are **mis-labelled**.
4. A **weight tag** for each lesson ([MUST] / [SHOULD] / [LATER]) with a reason; do not invent frequencies; say "not sure".
5. The **question supply** needed: how many practice questions per lesson (20 for High-weight chapters, 10 for Low and foundation ones), and what types are missing in the bank.
