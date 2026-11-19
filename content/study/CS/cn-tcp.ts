import * as DB2 from "./cn-deep-b";
import type { Chapter, Topic } from "@/lib/study/schema";

/**
 * Computer Networks → TCP, UDP and flow control. Numbers from components/study/cn-labs.tsx, checked by script:
 * Handshake ISN 4000 / 9000, data 300 then 500 bytes: acks 4001, 9001, 4301, 4801. Sequence wrap: 34.36 s at 1 Gbps, 3.44 s at 10 Gbps.
 * cwnd (ssthresh 16, loss in round 9 at cwnd 20): Tahoe 1,2,4,8,16,17,18,19,20,1,2,4,8,10,11,12; Reno …20,10,11,12,13,14,15,16.
 * ssthresh 8, timeout in round 7: 1,2,4,8,9,10,11,1,2,4,5,6.
 */

const tcp: Topic = {
  id: "cs.cn.tcp.basics",
  title: "UDP, TCP segments and connections",
  blocks: [
    { type: "hook", text: "UDP throws a datagram at the network and hopes. TCP turns the same unreliable network into an ordered, lossless byte stream, using nothing more than numbers in its header and a few rules about when to send them." },
    { type: "objectives", items: ["Compare UDP and TCP and their headers.", "Track sequence and acknowledgement numbers through a handshake and data.", "Compute window-limited throughput and sequence wrap-around time."] },
    { type: "intuition", paras: ["Ports let one host run many programs: the transport layer delivers each segment to the socket matching its port numbers.", "TCP numbers bytes, not segments. The acknowledgement number is the next byte the receiver expects, so it says 'everything before this has arrived'.", "A connection starts with a three-way handshake (SYN, SYN-ACK, ACK) that agrees on both sides' starting sequence numbers, and ends with FINs from each side."], analogyLimit: "Like numbering every page of a long letter; but TCP numbers every byte, and starts from a random number, not 1." },
    { type: "definition", name: "Transport protocols", text: "UDP gives connectionless, unreliable delivery with an 8-byte header. TCP gives connection-oriented, reliable, ordered byte-stream delivery with a 20–60 byte header.", items: ["SYN and FIN each consume one sequence number; data consumes one per byte; a pure ACK consumes none.", "ACK number = next byte expected.", "Receive window (rwnd): bytes the receiver can still buffer; throughput ≤ window / RTT.", "The 16-bit window field allows 65,535 bytes unless the window-scale option is used."] },
    { type: "deep", sections: [
      { h: "Sockets", points: ["A socket is an endpoint: IP address + port + protocol. A TCP connection is identified by the 4-tuple (source IP, source port, destination IP, destination port).", "Server: socket → bind → listen → accept (returns a new socket per client) → read/write → close.", "Client: socket → connect (performs the three-way handshake) → read/write → close.", "UDP sockets skip listen/accept/connect: sendto and recvfrom carry the address with each datagram."], paras: [] },
      { h: "Headers side by side", points: ["UDP: source port, destination port, length, checksum: 8 bytes.", "TCP: ports (2 + 2), sequence (4), acknowledgement (4), header length and flags (2), window (2), checksum (2), urgent pointer (2): 20 bytes, plus up to 40 bytes of options.", "Flags: SYN, ACK, FIN, RST, PSH, URG."], paras: [] },
      { h: "Connection close and TIME_WAIT", paras: ["Each direction closes separately: FIN, ACK in each direction (four segments, or three if a FIN and ACK are combined). The side that closes first waits in TIME_WAIT for 2 × MSL so late segments from the old connection die out."] },
      { h: "Wrap-around", paras: ["The 32-bit sequence space holds 2³² bytes. At 1 Gbps (125 MB/s) it wraps in about 34.4 s; at 10 Gbps in about 3.4 s. If a segment could live longer than that, old and new bytes could be confused, hence the timestamp option on fast links."] },
      { h: "Timers", paras: ["The retransmission timeout is set from a smoothed RTT estimate plus four times its deviation (Jacobson). Karn's rule: ignore the RTT of retransmitted segments, since you cannot tell which copy was acknowledged."] },
    ] },
    { type: "walkthrough", steps: ["Write the client and server ISNs.", "SYN seq = ISN_c; SYN-ACK seq = ISN_s, ack = ISN_c + 1; ACK ack = ISN_s + 1.", "Each data segment: seq = next unsent byte; the receiver acks seq + length.", "Throughput limit = window ÷ RTT; wrap time = 2³² bytes ÷ byte rate."], prompt: { q: "Why does SYN use up a sequence number although it has no data?", a: "So it can be acknowledged unambiguously; the same goes for FIN." } },
    { type: "figure", id: "hs", caption: "Handshake and two data segments (client ISN 4000, server ISN 9000).", alt: "SYN 4000; SYN-ACK 9000 ack 4001; ACK 9001; data 300 bytes acked 4301; data 500 bytes acked 4801.", fig: { kind: "matrix", title: "Sequence and ack numbers", cols: ["Seq", "Ack"], rows: [{ label: "SYN (C→S)", cells: [4000, "–"] }, { label: "SYN-ACK (S→C)", cells: [9000, 4001] }, { label: "ACK (C→S)", cells: [4001, 9001] }, { label: "300 bytes (C→S)", cells: [4001, 9001] }, { label: "ACK (S→C)", cells: [9001, 4301], hl: true }] } },
    { type: "example", id: "tx1", level: "gate", title: "Sequence and acknowledgement numbers", given: "Client ISN 4000, server ISN 9000. After the handshake the client sends 300 bytes, then 500 bytes.", find: "The ack numbers the server sends.",
      steps: [
        { say: "SYN-ACK acknowledges the SYN.", result: "ack 4001" },
        { say: "First data segment: seq 4001, 300 bytes, so the next expected byte is 4301.", result: "ack 4301" },
        { say: "Second segment: seq 4301, 500 bytes.", result: "ack 4801" },
      ],
      answer: "4001, then 4301, then 4801.",
      check: "If the 300-byte segment were lost, the server would keep acking 4001 even after the 500 bytes arrive." },
    { type: "figure", id: "wnd", for: "tx2", caption: "Window-limited throughput.", alt: "65,535 bytes per 100 ms RTT is about 5.24 Mbps.", fig: { kind: "strip", items: [{ label: "Window", sub: "65,535 bytes", state: "done" }, { label: "÷ RTT", sub: "100 ms", state: "done" }, { label: "Max", sub: "≈ 5.24 Mbps", state: "now" }] } },
    { type: "example", id: "tx2", level: "gate", title: "Window limits throughput", given: "Receive window 65,535 bytes, RTT 100 ms, link 1 Gbps.", find: "Maximum TCP throughput.",
      steps: [
        { say: "At most one window per RTT: 65,535 bytes / 0.1 s = 655,350 bytes/s." },
        { say: "× 8.", result: "≈ 5.24 Mbps" },
      ],
      answer: "About 5.24 Mbps, far below the 1 Gbps link, which is why window scaling exists.",
      check: "To fill 1 Gbps at 100 ms RTT, the window must be 12.5 MB (the bandwidth-delay product)." },
    { type: "example", id: "tx3", level: "edge", title: "Sequence numbers wrap", given: "A 1 Gbps link carrying one TCP connection at full speed.", find: "Time for the sequence numbers to wrap.",
      steps: [
        { say: "Byte rate: 10⁹ / 8 = 1.25 × 10⁸ bytes/s." },
        { say: "2³² / 1.25 × 10⁸.", result: "≈ 34.36 s" },
      ],
      answer: "About 34.4 seconds.",
      check: "At 10 Gbps it is 3.44 s, shorter than a typical maximum segment lifetime of 2 minutes." },
    { type: "lab", lab: "seq" },
    { type: "faded", title: "Your turn", given: "Server ISN 9000 acknowledged; the server now sends 200 bytes to the client.",
      steps: [{ say: "Seq of that segment and the client's ack?", blank: true, answer: "Seq 9001; the client acks 9201." }] },
    { type: "trap", wrong: "TCP sequence numbers count segments.", tempting: "Data link sliding windows number frames.", whyWrong: "TCP numbers bytes. A 500-byte segment advances the sequence number by 500.", rule: "Seq and ack count bytes." },
    { type: "trap", wrong: "A pure ACK uses one sequence number.", tempting: "SYN and FIN do.", whyWrong: "Only SYN, FIN and data bytes consume sequence numbers.", rule: "SYN + 1, FIN + 1, data + length, ACK + 0." },
    { type: "gate", text: "GATE asks ack numbers after a handshake and data, header sizes and fields, window-limited throughput, sequence-number wrap time, and UDP versus TCP properties." },
    { type: "recall", cards: [{ q: "UDP header", a: "8 bytes" }, { q: "TCP minimum header", a: "20 bytes" }, { q: "Ack number means", a: "Next byte expected" }] },
    { type: "check", questions: [
      { id: "tc1", kind: "NAT", marks: 2, q: "Client ISN 4000. After the handshake it sends 300 bytes and then 500 bytes. The server's ack for the second segment?", answer: "4801", solution: "4001 + 300 + 500." },
      { id: "tc2", kind: "NAT", marks: 2, q: "Window 65,535 bytes, RTT 100 ms. Maximum throughput in Mbps? (Two decimals.)", answer: "5.24", solution: "655,350 × 8 / 10⁶." },
      { id: "tc3", kind: "NAT", marks: 2, q: "Seconds for TCP sequence numbers to wrap at 1 Gbps? (Two decimals.)", answer: "34.36", solution: "2³² / 1.25 × 10⁸." },
      { id: "tc4", kind: "MSQ", marks: 2, q: "Which are true of UDP?", options: ["It has an 8-byte header", "It guarantees in-order delivery", "It needs no connection set-up", "DNS queries usually use it"], answer: "A, C, D", solution: "UDP gives no ordering." },
      { id: "tc5", kind: "MCQ", marks: 1, q: "Which consumes a TCP sequence number?", options: ["A pure ACK", "A SYN", "A window update", "None of these"], answer: "B", solution: "SYN and FIN do." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Computer Networks", sub: "TCP numbers and headers", href: "/topics/computer-networks-cn" },
      { label: "Sliding windows", sub: "Efficiency and window size", href: "/study/data-link" },
      { label: "Topic 2: congestion control", sub: "How fast to send", href: "/study/transport" },
    ] },
    { type: "links", prereq: ["Sliding window protocols"], usedIn: ["Congestion control (Topic 2)"], cross: ["Operating System: sockets and ports"] },
  ],
};

const congestion: Topic = {
  id: "cs.cn.tcp.congestion",
  title: "TCP congestion control",
  blocks: [
    { type: "hook", text: "If every sender pushed as fast as its own link allowed, routers in the middle would overflow and almost nothing would get through. TCP probes for spare capacity, backs off when packets drop, and so shares the network fairly." },
    { type: "objectives", items: ["Trace cwnd through slow start and congestion avoidance.", "Apply the Tahoe and Reno reactions to timeouts and triple duplicate ACKs.", "Compute the effective window."] },
    { type: "intuition", paras: ["Slow start begins with one segment and doubles cwnd every RTT (each ACK adds one MSS). It is 'slow' only because it starts small.", "Once cwnd reaches ssthresh, TCP switches to congestion avoidance: plus one MSS per RTT, a gentle linear climb.", "A loss means congestion. On a timeout (Tahoe and Reno), ssthresh becomes half the current cwnd and cwnd restarts at 1. On three duplicate ACKs, Reno halves cwnd and continues linearly (fast recovery)."], analogyLimit: "Like easing into traffic: speed up quickly on an empty road, then carefully; brake hard when you see brake lights." },
    { type: "definition", name: "Congestion control", text: "The sender limits data in flight to min(cwnd, rwnd).", items: ["Slow start: cwnd doubles each RTT while cwnd < ssthresh (capped at ssthresh in GATE-style questions).", "Congestion avoidance: cwnd += 1 MSS per RTT.", "Timeout: ssthresh = cwnd / 2, cwnd = 1 (Tahoe and Reno).", "Three duplicate ACKs (Reno): ssthresh = cwnd / 2, cwnd = ssthresh, then linear growth.", "This pattern is AIMD: additive increase, multiplicative decrease."] },
    { type: "deep", sections: [
      { h: "Conventions to read for", paras: ["Questions differ in small ways: whether cwnd may jump past ssthresh when doubling (most GATE answers cap it at ssthresh), whether Reno sets cwnd to ssthresh or ssthresh + 3, and whether the round of the loss is counted. Our lab caps at ssthresh and sets cwnd = ssthresh after three duplicate ACKs."] },
      { h: "Why halve?", paras: ["Multiplicative decrease drains queues quickly; additive increase approaches capacity carefully. Two flows using AIMD converge towards an equal share of a bottleneck link, which is TCP's fairness argument."] },
      { h: "Effective window", paras: ["The sender can have min(cwnd, rwnd) bytes unacknowledged. A slow receiver (small rwnd) limits throughput even on an empty network; that is flow control, separate from congestion control."] },
      { h: "Time to reach a window", paras: ["Starting from 1 MSS with ssthresh S, slow start takes log₂S RTTs to reach S; each further MSS takes one more RTT. To reach cwnd 20 with ssthresh 16 takes 4 + 4 = 8 RTTs after the first."] },
    ] },
    { type: "walkthrough", steps: ["List rounds with cwnd: start at 1.", "Below ssthresh: double (but do not pass ssthresh). At or above: add 1.", "At a loss: new ssthresh = ⌊cwnd / 2⌋. Timeout → cwnd 1; three duplicate ACKs (Reno) → cwnd = new ssthresh.", "Carry on with the same rules."], prompt: { q: "Why treat three duplicate ACKs more gently than a timeout?", a: "Duplicate ACKs mean later segments are still getting through, so the network is only mildly congested." } },
    { type: "figure", id: "tahoe", caption: "ssthresh 16, a timeout when cwnd = 20 (round 9).", alt: "Tahoe trace 1 2 4 8 16 17 18 19 20 then 1 2 4 8 10 11 12.", fig: { kind: "matrix", title: "cwnd per round (Tahoe)", cols: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"], rows: [{ label: "cwnd", cells: [1, 2, 4, 8, 16, 17, 18, 19, 20, 1, 2, 4, 8, 10, 11, 12], hl: true }] } },
    { type: "example", id: "cx1", level: "gate", title: "Timeout under Tahoe", given: "Initial ssthresh 16 MSS. cwnd starts at 1. A timeout occurs in round 9.", find: "cwnd in every round up to 16.",
      steps: [
        { say: "Slow start: 1, 2, 4, 8, 16 (rounds 1–5)." },
        { say: "Congestion avoidance: 17, 18, 19, 20 (rounds 6–9). Timeout at 20." },
        { say: "ssthresh = 10, cwnd = 1. Then 1, 2, 4, 8, 10 (capped), 11, 12.", result: "1,2,4,8,16,17,18,19,20,1,2,4,8,10,11,12" },
      ],
      answer: "cwnd: 1, 2, 4, 8, 16, 17, 18, 19, 20, 1, 2, 4, 8, 10, 11, 12.",
      check: "The second slow start stops at 10 = 20/2, not at the old 16." },
    { type: "figure", id: "reno", for: "cx2", caption: "Same flow, but the loss is signalled by three duplicate ACKs (Reno).", alt: "After 20, cwnd becomes 10 and grows 11, 12, …, 16.", fig: { kind: "strip", items: [{ label: "Rounds 1–9", sub: "1 … 20", state: "done" }, { label: "3 dup ACKs", sub: "ssthresh = cwnd = 10", state: "bad" }, { label: "Rounds 11–16", sub: "11, 12, …, 16", state: "now" }] } },
    { type: "example", id: "cx2", level: "gate", title: "Fast recovery under Reno", given: "Same flow, but the loss in round 9 is detected by three duplicate ACKs.", find: "cwnd in rounds 10 to 16.",
      steps: [
        { say: "ssthresh = 10 and cwnd = 10." },
        { say: "Linear growth: 11, 12, 13, 14, 15, 16.", result: "10, 11, 12, 13, 14, 15, 16" },
      ],
      answer: "Rounds 10–16: 10, 11, 12, 13, 14, 15, 16.",
      check: "Reno at round 16 has 16 segments in flight against Tahoe's 12." },
    { type: "example", id: "cx3", level: "edge", title: "A smaller threshold", given: "Initial ssthresh 8. Timeout in round 7.", find: "cwnd over 12 rounds.",
      steps: [
        { say: "1, 2, 4, 8, then 9, 10, 11 (round 7: timeout at 11)." },
        { say: "ssthresh = ⌊11 / 2⌋ = 5. Then 1, 2, 4, 5, 6.", result: "1,2,4,8,9,10,11,1,2,4,5,6" },
      ],
      answer: "1, 2, 4, 8, 9, 10, 11, 1, 2, 4, 5, 6.",
      check: "Doubling 4 would give 8, but the threshold is 5, so cwnd stops at 5." },
    { type: "lab", lab: "cwnd" },
    { type: "faded", title: "Your turn", given: "ssthresh 12, cwnd starts at 1, no losses.",
      steps: [{ say: "cwnd in rounds 1–7?", blank: true, answer: "1, 2, 4, 8, 12 (capped), 13, 14." }] },
    { type: "trap", wrong: "After a timeout, slow start runs up to the old ssthresh again.", tempting: "The threshold seems fixed.", whyWrong: "A loss resets ssthresh to half the cwnd at the moment of loss.", rule: "New ssthresh = cwnd at loss ÷ 2." },
    { type: "trap", wrong: "Slow start adds one segment per RTT.", tempting: "'Slow' suggests linear.", whyWrong: "Slow start grows exponentially (doubling); congestion avoidance is the linear phase.", rule: "Below ssthresh: double. Above: +1." },
    { type: "gate", text: "A favourite NAT: give ssthresh, loss rounds and loss type, ask cwnd at round n or the number of rounds to reach a window. Tabulate round by round and check the capping convention." },
    { type: "recall", cards: [{ q: "Timeout reaction", a: "ssthresh = cwnd/2, cwnd = 1" }, { q: "3 dup ACKs (Reno)", a: "ssthresh = cwnd = cwnd/2" }, { q: "Send window", a: "min(cwnd, rwnd)" }] },
    { type: "check", questions: [
      { id: "cg1", kind: "NAT", marks: 2, q: "ssthresh 16, timeout in round 9 (cwnd 20), Tahoe. cwnd in round 14?", answer: "10", solution: "1, 2, 4, 8, 10 in rounds 10–14." },
      { id: "cg2", kind: "NAT", marks: 2, q: "Same flow with Reno (3 duplicate ACKs in round 9). cwnd in round 14?", answer: "14", solution: "10, 11, 12, 13, 14 in rounds 10–14." },
      { id: "cg3", kind: "NAT", marks: 1, q: "ssthresh 12, no losses. cwnd in round 7?", answer: "14", solution: "1, 2, 4, 8, 12, 13, 14." },
      { id: "cg4", kind: "MSQ", marks: 2, q: "Which are true?", options: ["Slow start doubles cwnd each RTT", "A timeout sets cwnd to 1", "Reno halves cwnd on triple duplicate ACKs", "The sender's window is max(cwnd, rwnd)"], answer: "A, B, C", solution: "It is the minimum." },
      { id: "cg5", kind: "NAT", marks: 2, q: "ssthresh 8, timeout in round 7. The new ssthresh?", answer: "5", solution: "cwnd 11 at the loss; ⌊11/2⌋." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Computer Networks", sub: "Congestion window traces", href: "/topics/computer-networks-cn" },
      { label: "Topic 1: TCP basics", sub: "Sequence numbers and windows", href: "/study/transport" },
      { label: "Application layer", sub: "What rides on TCP", href: "/study/application" },
    ] },
    { type: "links", prereq: ["Topic 1"], usedIn: ["Throughput estimates"], cross: ["Algorithms: exponential vs linear growth"] },
  ],
};

export const CN_TCP: Chapter = {
  id: "cs.cn.tcp",
  subject: "Computer Networks",
  title: "TCP, UDP and flow control",
  syllabus: ["CS · Computer Networks: Transport layer: flow control and congestion control, UDP, TCP, sockets"],
  pyqTopic: /TCP|UDP|transport|congestion/i,
  map: { kind: "strip", items: [
    { label: "1. TCP and UDP", sub: "segments and connections", state: "done" },
    { label: "2. Congestion", sub: "slow start, AIMD", state: "done" },
  ] },
  topics: [tcp, congestion, DB2.flowTopic, DB2.rtoTopic, DB2.udpTopic],
};
