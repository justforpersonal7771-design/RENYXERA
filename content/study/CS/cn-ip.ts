import * as DA from "./cn-deep-a";
import type { Chapter, Topic } from "@/lib/study/schema";

/**
 * Computer Networks → IP addressing and routing. Numbers from components/study/cn-labs.tsx, checked by script:
 * 172.20.77.130/26 → network .128, broadcast .191, 62 hosts, mask 255.255.255.192. 10.1.200.9/20 → 10.1.192.0–10.1.207.255, 4094 hosts.
 * 192.168.5.77/27 → .64–.95, 30 hosts. Fragmenting 4020 bytes (20 header) over MTU 1500: 1500, 1500, 1060; offsets 0, 185, 370.
 * 2420 over MTU 820: three of 820, offsets 0, 100, 200. Dijkstra from A on the lab graph: C 2, B 3, D 8, E 10, F 13.
 */

const addressing: Topic = {
  id: "cs.cn.ip.subnet",
  title: "IPv4 addressing, subnetting and CIDR",
  blocks: [
    { type: "hook", text: "Every device on the internet has a 32-bit address, yet routers don't keep a line for each of the 4 billion. They route by prefix, the first bits of the address, just as the post office routes by PIN code before it reads the street." },
    { type: "objectives", items: ["Find the network, broadcast and host range from an address and prefix.", "Split a block into subnets of a required size.", "Apply longest-prefix match in a forwarding table."] },
    { type: "intuition", paras: ["A prefix /n says the first n bits name the network and the remaining 32 − n bits name a host inside it. The mask is n ones followed by zeros.", "Setting all host bits to 0 gives the network address; all host bits to 1 gives the broadcast address. Neither can be given to a host, hence 2^(32 − n) − 2 usable addresses.", "Borrowing host bits makes subnets: each borrowed bit doubles the number of subnets and halves their size."], analogyLimit: "A PIN code has a fixed length; an IP prefix can be any length, and routers pick the longest one that matches." },
    { type: "definition", name: "CIDR", text: "An address block written a.b.c.d/n has a network part of n bits.", items: ["Block size = 2^(32 − n); usable hosts = 2^(32 − n) − 2.", "Network = address AND mask. Broadcast = network + block size − 1.", "Longest-prefix match: a router forwards on the most specific matching entry.", "Private ranges: 10/8, 172.16/12, 192.168/16 (used behind NAT)."] },
    { type: "deep", sections: [
      { h: "The quick method", paras: ["Find the octet where the prefix ends. The block size in that octet is 256 ÷ 2^(bits of the prefix in that octet), or simply 2^(host bits in that octet). The network address there is the largest multiple of the block size not above the address's octet. For /26 the block is 64, so 130 falls in 128–191."] },
      { h: "Variable-length subnets", paras: ["Give the largest subnet its block first, on a boundary of its own size, then the next largest. A /24 can hold one /25 (126 hosts), one /26 (62) and two /27s (30 each)."] },
      { h: "Classful addressing, for old questions", points: ["Class A: first bit 0, /8 by default (1–126).", "Class B: 10, /16 (128–191).", "Class C: 110, /24 (192–223).", "Class D (1110) is multicast; class E is reserved."], paras: [] },
      { h: "NAT and ARP", paras: ["NAT lets many private hosts share one public address by rewriting addresses and ports at the router. ARP maps an IP address to a MAC address on the local link by broadcasting a request; the owner replies by unicast."] },
    ] },
    { type: "walkthrough", steps: ["Host bits h = 32 − n; block size = 2^h (across octets as needed).", "Network = the address rounded down to a multiple of the block size.", "Broadcast = network + block − 1; hosts are everything in between.", "For forwarding, compare the destination against each entry and take the longest matching prefix."], prompt: { q: "Why is 2^h − 2, not 2^h, the host count?", a: "The all-zeros host part names the network and the all-ones part is the broadcast address." } },
    { type: "figure", id: "sub", caption: "172.20.77.130/26: the last octet 130 = 10|000010.", alt: "Network 172.20.77.128, broadcast .191, hosts .129–.190.", fig: { kind: "matrix", title: "172.20.77.130/26", cols: ["Value"], rows: [{ label: "Mask", cells: ["255.255.255.192"] }, { label: "Network", cells: ["172.20.77.128"], hl: true }, { label: "Broadcast", cells: ["172.20.77.191"] }, { label: "Usable hosts", cells: [62] }] } },
    { type: "example", id: "ax1", level: "gate", title: "Network and broadcast", given: "Host 172.20.77.130/26.", find: "Mask, network, broadcast and usable hosts.",
      steps: [
        { say: "26 bits: 24 + 2 in the last octet. Mask 255.255.255.192; block 64." },
        { say: "130 lies in 128–191.", result: "network .128, broadcast .191" },
        { say: "Hosts: 2⁶ − 2.", result: "62" },
      ],
      answer: "Mask 255.255.255.192; network 172.20.77.128; broadcast 172.20.77.191; 62 hosts (.129 to .190).",
      check: "The /27 containing 192.168.5.77 runs .64–.95 with 30 hosts: same method, block 32." },
    { type: "figure", id: "lpm", for: "ax2", caption: "Longest-prefix match picks the most specific route.", alt: "Destination 10.1.200.9 matches /8 and /20; /20 wins.", fig: { kind: "matrix", title: "Forwarding table", cols: ["Range", "Matches 10.1.200.9?"], rows: [{ label: "10.0.0.0/8 → if 1", cells: ["10.0.0.0–10.255.255.255", "yes"] }, { label: "10.1.192.0/20 → if 2", cells: ["10.1.192.0–10.1.207.255", "yes"], hl: true }, { label: "10.1.208.0/20 → if 3", cells: ["10.1.208.0–10.1.223.255", "no"] }] } },
    { type: "example", id: "ax2", level: "gate", title: "Longest-prefix match", given: "Table: 10.0.0.0/8 → interface 1; 10.1.192.0/20 → interface 2; 10.1.208.0/20 → interface 3. Destination 10.1.200.9.", find: "Which interface?",
      steps: [
        { say: "/20 blocks in the third octet have size 16: 192–207 and 208–223." },
        { say: "200 is in 192–207, so 10.1.192.0/20 matches; /8 matches too." },
        { say: "Choose the longer prefix.", result: "interface 2" },
      ],
      answer: "Interface 2 (the /20 route), because it is more specific than the /8.",
      check: "That /20 block has 2¹² − 2 = 4094 usable host addresses." },
    { type: "example", id: "ax3", level: "edge", title: "Variable-length subnets", given: "Block 200.10.4.0/24 must serve LANs of 100, 50, 25 and 25 hosts.", find: "A prefix for each.",
      steps: [
        { say: "100 hosts need 7 host bits (126): 200.10.4.0/25." },
        { say: "50 need 6 bits (62): 200.10.4.128/26." },
        { say: "25 need 5 bits (30): 200.10.4.192/27 and 200.10.4.224/27.", result: "fits exactly" },
      ],
      answer: "/25 at .0, /26 at .128, /27 at .192 and /27 at .224.",
      check: "128 + 64 + 32 + 32 = 256: the whole /24 is used." },
    { type: "lab", lab: "subnet" },
    { type: "faded", title: "Your turn", given: "Host 10.1.200.9/20.",
      steps: [{ say: "Network and broadcast?", blank: true, answer: "Block 16 in the third octet: 192–207. Network 10.1.192.0, broadcast 10.1.207.255." }] },
    { type: "trap", wrong: "A /26 has 64 usable hosts.", tempting: "2⁶ = 64.", whyWrong: "Two addresses are reserved: network and broadcast. 62 are usable.", rule: "Hosts = 2^h − 2." },
    { type: "trap", wrong: "The router picks the first matching entry.", tempting: "Tables are read top to bottom.", whyWrong: "IP forwarding uses the longest matching prefix, whatever the order.", rule: "Most specific match wins." },
    { type: "gate", text: "GATE gives a forwarding table and asks the outgoing interface, or asks network/broadcast addresses, the number of subnets or hosts, and whether two hosts share a subnet. Work in binary only in the octet where the prefix ends." },
    { type: "recall", cards: [{ q: "Usable hosts in /n", a: "2^(32 − n) − 2" }, { q: "Network address", a: "Address AND mask" }, { q: "Forwarding rule", a: "Longest-prefix match" }] },
    { type: "check", questions: [
      { id: "ip1", kind: "NAT", marks: 1, q: "Usable host addresses in a /26?", answer: "62", solution: "2⁶ − 2." },
      { id: "ip2", kind: "MCQ", marks: 2, q: "The broadcast address of 172.20.77.130/26 is", options: ["172.20.77.127", "172.20.77.191", "172.20.77.255", "172.20.77.192"], answer: "B", solution: "Block 128–191." },
      { id: "ip3", kind: "NAT", marks: 2, q: "Usable hosts in the /20 containing 10.1.200.9?", answer: "4094", solution: "2¹² − 2." },
      { id: "ip4", kind: "MSQ", marks: 2, q: "Which addresses are in 192.168.5.64/27?", options: ["192.168.5.65", "192.168.5.94", "192.168.5.96", "192.168.5.63"], answer: "A, B", solution: "The block runs .64–.95." },
      { id: "ip5", kind: "NAT", marks: 1, q: "How many /27 subnets fit in one /24?", answer: "8", solution: "2³." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Computer Networks", sub: "Subnetting and forwarding tables", href: "/topics/computer-networks-cn" },
      { label: "Topic 2: fragmentation", sub: "The rest of the IP header", href: "/study/ip" },
      { label: "Digital Logic", sub: "Binary and bitwise AND", href: "/topics/digital-logic" },
    ] },
    { type: "links", prereq: ["Binary numbers"], usedIn: ["Routing (Topic 3)"], cross: ["Digital Logic: number systems"] },
  ],
};

const frag: Topic = {
  id: "cs.cn.ip.frag",
  title: "The IPv4 header and fragmentation",
  blocks: [
    { type: "hook", text: "A 4020-byte datagram reaches a link that carries at most 1500 bytes. The router chops it into three pieces, and the receiver puts them back together using just three header fields." },
    { type: "objectives", items: ["Know the key IPv4 header fields and their sizes.", "Fragment a datagram: sizes, offsets and the MF flag.", "Explain TTL and the header checksum."] },
    { type: "intuition", paras: ["Every fragment gets its own 20-byte header, so only MTU − 20 bytes of data fit, rounded down to a multiple of 8 because the offset is counted in 8-byte units.", "All fragments carry the same identification number. The offset says where this piece's data starts in the original; MF (more fragments) is 1 on every piece except the last.", "Reassembly happens only at the destination host, never at routers in between."], analogyLimit: "Like numbering the boxes of a house move; but the offset counts in 8-byte steps, not box numbers." },
    { type: "definition", name: "IPv4 fragmentation", text: "When a datagram is larger than the outgoing link's MTU, it is split into fragments.", items: ["Data per fragment = ⌊(MTU − header) / 8⌋ × 8.", "Offset field = byte position of the fragment's data ÷ 8.", "MF = 1 except on the last fragment; DF = 1 forbids fragmenting (the packet is dropped).", "Header: 20–60 bytes; HLEN counts 4-byte words; total length counts bytes (max 65,535); TTL drops by 1 per router."] },
    { type: "deep", sections: [
      { h: "Header fields to know", points: ["Version (4 bits), HLEN (4 bits, × 4 bytes), type of service, total length (16 bits).", "Identification (16), flags (DF, MF), fragment offset (13 bits, × 8 bytes).", "TTL (8), protocol (8: 6 TCP, 17 UDP, 1 ICMP), header checksum (16).", "Source and destination addresses (32 each), then options."], paras: [] },
      { h: "Why the checksum is recomputed", paras: ["The header checksum covers only the header. Every router changes TTL (and may change fragment fields), so it recomputes the checksum on every hop."] },
      { h: "Fragments of fragments", paras: ["A fragment can be fragmented again on a smaller link. Offsets stay relative to the original datagram, and the MF of the new pieces follows the old piece's MF on its last part."] },
      { h: "IPv6 differs", paras: ["IPv6 routers never fragment; senders use path MTU discovery. The fixed header is 40 bytes with no checksum and 128-bit addresses."] },
    ] },
    { type: "walkthrough", steps: ["Data in the original = total length − header.", "Per fragment: ⌊(MTU − 20) / 8⌋ × 8 data bytes.", "Fill fragments in order; the last gets the remainder.", "Offset_i = (data bytes before it) / 8; MF = 1 except the last; total length = data + 20."], prompt: { q: "Why must every fragment except the last carry a multiple of 8 data bytes?", a: "The next fragment's offset is stored in 8-byte units, so its starting byte must be a multiple of 8." } },
    { type: "figure", id: "fr", caption: "4020-byte datagram (4000 data) over MTU 1500.", alt: "Three fragments: 1500, 1500 and 1060 bytes; offsets 0, 185, 370.", fig: { kind: "matrix", title: "Fragments", cols: ["Total length", "Offset", "MF"], rows: [{ label: "1", cells: [1500, 0, 1] }, { label: "2", cells: [1500, 185, 1] }, { label: "3", cells: [1060, 370, 0], hl: true }] } },
    { type: "example", id: "fx1", level: "gate", title: "Fragmenting a datagram", given: "A 4020-byte IPv4 datagram (20-byte header) meets a link with MTU 1500.", find: "Fragment sizes, offsets and MF bits.",
      steps: [
        { say: "Data: 4000 bytes. Per fragment: ⌊1480 / 8⌋ × 8 = 1480." },
        { say: "Pieces of data: 1480, 1480, 1040.", result: "lengths 1500, 1500, 1060" },
        { say: "Offsets: 0, 1480/8 = 185, 2960/8 = 370. MF: 1, 1, 0." },
      ],
      answer: "Three fragments: (1500, offset 0, MF 1), (1500, 185, 1), (1060, 370, 0).",
      check: "1480 + 1480 + 1040 = 4000 data bytes; 60 bytes of extra headers in total." },
    { type: "figure", id: "fr2", for: "fx2", caption: "When MTU − 20 is not a multiple of 8, round down.", alt: "MTU 820: 800 data bytes per fragment.", fig: { kind: "strip", items: [{ label: "MTU 820", sub: "820 − 20 = 800", state: "done" }, { label: "800 / 8", sub: "= 100, exact", state: "done" }, { label: "Offsets", sub: "0, 100, 200", state: "now" }] } },
    { type: "example", id: "fx2", level: "gate", title: "Offsets in 8-byte units", given: "A 2420-byte datagram (20-byte header) over MTU 820.", find: "Fragments and offsets.",
      steps: [
        { say: "Data 2400; per fragment 800." },
        { say: "Three fragments of 800 data bytes, each 820 total.", result: "offsets 0, 100, 200" },
      ],
      answer: "Three fragments of 820 bytes; offsets 0, 100, 200; MF 1, 1, 0.",
      check: "If the MTU were 830, data per fragment would still be 808 (⌊810/8⌋ × 8), not 810." },
    { type: "example", id: "fx3", level: "edge", title: "Reading a fragment", given: "A fragment arrives with offset 185, MF 1 and total length 1500, header 20 bytes.", find: "Which bytes of the original data does it carry, and is it the last?",
      steps: [
        { say: "Start = 185 × 8 = 1480." },
        { say: "Data length 1480: bytes 1480 to 2959.", result: "middle fragment" },
      ],
      answer: "Data bytes 1480–2959; MF 1 says more follow, so it is not the last.",
      check: "The first fragment has offset 0 and MF 1; the last has MF 0." },
    { type: "lab", lab: "frag" },
    { type: "faded", title: "Your turn", given: "A 3000-byte datagram (20-byte header) over MTU 1000.",
      steps: [{ say: "Fragments?", blank: true, answer: "Data 2980; per fragment 976 (⌊980/8⌋ × 8). Pieces 976, 976, 976, 52; offsets 0, 122, 244, 366; four fragments." }] },
    { type: "trap", wrong: "Offset is in bytes.", tempting: "Every other length field counts bytes.", whyWrong: "The 13-bit offset counts 8-byte units, so it can address the full 65,535-byte range.", rule: "Byte position = offset × 8." },
    { type: "trap", wrong: "Routers reassemble fragments before forwarding.", tempting: "It sounds tidy.", whyWrong: "Fragments may take different paths; only the destination host reassembles.", rule: "Reassembly at the destination only." },
    { type: "gate", text: "Fragmentation NATs ask the number of fragments, an offset, the total length of the last fragment, or which bytes a fragment holds. Remember the 8-byte rounding and the 20-byte header per fragment." },
    { type: "recall", cards: [{ q: "Offset unit", a: "8 bytes" }, { q: "HLEN unit", a: "4 bytes" }, { q: "Who reassembles", a: "The destination host" }] },
    { type: "check", questions: [
      { id: "fr1", kind: "NAT", marks: 2, q: "4020-byte datagram (20-byte header), MTU 1500. Offset of the last fragment?", answer: "370", solution: "2960 / 8." },
      { id: "fr2", kind: "NAT", marks: 2, q: "Same datagram. Total length of the last fragment in bytes?", answer: "1060", solution: "1040 + 20." },
      { id: "fr3", kind: "NAT", marks: 1, q: "HLEN field value for a 20-byte header?", answer: "5", solution: "20 / 4." },
      { id: "fr4", kind: "MSQ", marks: 2, q: "Which are true?", options: ["All fragments share the identification value", "The last fragment has MF = 0", "Routers reassemble fragments", "TTL is decremented at every router"], answer: "A, B, D", solution: "Only the destination reassembles." },
      { id: "fr5", kind: "NAT", marks: 2, q: "A 3000-byte datagram (20-byte header) over MTU 1000. How many fragments?", answer: "4", solution: "976 × 3 + 52." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Computer Networks", sub: "IPv4 header and fragmentation", href: "/topics/computer-networks-cn" },
      { label: "Topic 1: addressing", sub: "The addresses in the header", href: "/study/ip" },
      { label: "Topic 3: routing", sub: "Where the packet goes next", href: "/study/ip" },
    ] },
    { type: "links", prereq: ["Topic 1"], usedIn: ["TCP MSS", "Path MTU"], cross: ["Data link: MTU of Ethernet (1500)"] },
  ],
};

const routing: Topic = {
  id: "cs.cn.ip.routing",
  title: "Routing: distance vector and link state",
  blocks: [
    { type: "hook", text: "No router sees the whole internet, yet packets find good paths across it. Some routers gossip their distances to neighbours; others flood a map of their links and each computes shortest paths for itself." },
    { type: "objectives", items: ["Run Dijkstra's algorithm for link-state routing.", "Apply the distance-vector (Bellman–Ford) update.", "Explain count-to-infinity and its fixes."] },
    { type: "intuition", paras: ["Link state: every router floods the costs of its own links to all routers. With the full map, each runs Dijkstra and builds its forwarding table. OSPF works this way.", "Distance vector: each router tells its neighbours its current distance to every destination. A router's best distance to D is the smallest (cost to neighbour + neighbour's distance to D). RIP works this way.", "Distance vector spreads good news fast but bad news slowly: after a link fails, routers can keep pointing at each other, raising the cost step by step: count to infinity."], analogyLimit: "Like asking neighbours for directions versus everyone owning the full map; but the network changes, and stale gossip can loop." },
    { type: "definition", name: "Routing algorithms", text: "Routing builds forwarding tables by computing least-cost paths.", items: ["Dijkstra: repeatedly settle the unsettled node with the smallest tentative distance, then relax its edges.", "Distance vector: D_x(y) = min over neighbours v of (c(x, v) + D_v(y)).", "Count to infinity: slow convergence after a failure; split horizon and poisoned reverse reduce it.", "Intra-domain: RIP (DV), OSPF (LS). Inter-domain: BGP (path vector)."] },
    { type: "deep", sections: [
      { h: "Flooding", paras: ["Flooding sends every packet out of every link except the one it arrived on. It always finds the shortest path (some copy takes it) and is used to spread link-state advertisements, but it multiplies traffic. Hop counts (TTL) or sequence numbers with a seen-before list stop copies circulating forever. In a network where every router floods once per packet, a packet crosses each link at most once in each direction."] },
      { h: "Dijkstra step by step", paras: ["Start with distance 0 at the source and ∞ elsewhere. Each step settles the closest unsettled node; its distance is now final. Then for each neighbour, if going through the settled node is shorter, update the neighbour's distance and remember the previous hop."] },
      { h: "Split horizon and poisoned reverse", paras: ["Split horizon: do not advertise a route back to the neighbour you learned it from. Poisoned reverse: advertise it back with cost ∞. Both stop two-node loops but not every longer loop; RIP also caps distances at 16."] },
      { h: "Comparing the two", points: ["Messages: LS floods link costs to everyone; DV sends vectors to neighbours only.", "Convergence: LS is fast; DV may loop and count to infinity.", "Robustness: a wrong LS advertisement affects only that router's links; a wrong DV vector spreads."], paras: [] },
      { h: "BGP", paras: ["Between autonomous systems, BGP advertises whole paths (lists of AS numbers), which lets it avoid loops and apply policy, not just shortest distance."] },
    ] },
    { type: "walkthrough", steps: ["Dijkstra: write a distance table; settle the smallest; relax its edges; repeat.", "Record the predecessor of each node to read off the path.", "DV: for each destination, take the minimum of link cost + neighbour's advertised distance.", "Count the rounds if asked how long convergence takes."], prompt: { q: "Can Dijkstra handle negative link costs?", a: "No. Settling assumes later paths can't get shorter. Network link costs are positive, so routing is safe." } },
    { type: "figure", id: "dj", caption: "Dijkstra from A on the lab's six-router network.", alt: "Settle order A, C, B, D, E, F with distances 0, 2, 3, 8, 10, 13.", fig: { kind: "matrix", title: "Shortest distances from A", cols: ["Distance", "Previous hop"], rows: [{ label: "C", cells: [2, "A"] }, { label: "B", cells: [3, "C"] }, { label: "D", cells: [8, "B"] }, { label: "E", cells: [10, "D"] }, { label: "F", cells: [13, "E"], hl: true }] } },
    { type: "example", id: "rx1", level: "gate", title: "Dijkstra", given: "Links: A–B 4, A–C 2, B–C 1, B–D 5, C–D 8, C–E 10, D–E 2, D–F 6, E–F 3.", find: "Shortest distances from A and the order routers are settled.",
      steps: [
        { say: "Settle A (0). Relax: B 4, C 2." },
        { say: "Settle C (2). B improves to 3 (via C); D 10; E 12." },
        { say: "Settle B (3). D improves to 8 (via B)." },
        { say: "Settle D (8). E improves to 10; F 14." },
        { say: "Settle E (10). F improves to 13. Settle F.", result: "A, C, B, D, E, F" },
      ],
      answer: "C 2, B 3, D 8, E 10, F 13; settled in the order A, C, B, D, E, F.",
      check: "Path to F: A → C → B → D → E → F, cost 2 + 1 + 5 + 2 + 3 = 13." },
    { type: "figure", id: "dv", for: "rx2", caption: "Distance-vector update at router X.", alt: "Via A: 2 + 7 = 9. Via B: 5 + 3 = 8. Choose B.", fig: { kind: "matrix", title: "X's route to D", cols: ["Link cost", "Neighbour's distance", "Total"], rows: [{ label: "via A", cells: [2, 7, 9] }, { label: "via B", cells: [5, 3, 8], hl: true }] } },
    { type: "example", id: "rx2", level: "gate", title: "A distance-vector update", given: "Router X has links to A (cost 2) and B (cost 5). A advertises distance 7 to D; B advertises 3.", find: "X's distance to D and next hop.",
      steps: [
        { say: "Via A: 2 + 7 = 9. Via B: 5 + 3 = 8." },
        { say: "Take the minimum.", result: "8 via B" },
      ],
      answer: "Distance 8, next hop B.",
      check: "If B's distance to D rose to 10, X would switch to A (9) at the next update." },
    { type: "example", id: "rx3", level: "edge", title: "Count to infinity", given: "A line A – B – C with unit costs. B reaches C at 1, A reaches C at 2 via B. The B–C link fails. No split horizon.", find: "What B and A do next.",
      steps: [
        { say: "B loses its direct route; A still advertises 2, so B sets 1 + 2 = 3 via A." },
        { say: "A hears B's 3 and sets 4 via B; B then sets 5; and so on.", result: "counts upward" },
      ],
      answer: "They bounce the route between them, raising the cost by 2 each exchange until it reaches 'infinity' (16 in RIP).",
      check: "With poisoned reverse, A would have advertised ∞ to B for C, and B would drop the route at once." },
    { type: "lab", lab: "route" },
    { type: "faded", title: "Your turn", given: "In the lab graph, run Dijkstra from F.",
      steps: [{ say: "Distance from F to A?", blank: true, answer: "F–E 3, E–D 2, D–B 5, B–C 1, C–A 2: 13 (paths are symmetric)." }] },
    { type: "trap", wrong: "Dijkstra settles nodes in order of their hop count.", tempting: "Breadth-first search does.", whyWrong: "It settles by total path cost. B is settled after C here, though both are one hop from A.", rule: "Settle by smallest tentative cost." },
    { type: "trap", wrong: "Split horizon cures every count-to-infinity case.", tempting: "It fixes the two-router example.", whyWrong: "Loops of three or more routers can still count up.", rule: "Split horizon handles two-node loops only." },
    { type: "gate", text: "GATE asks distance-vector tables after one exchange, Dijkstra results or settling order, and statements about count-to-infinity and the protocols (RIP, OSPF, BGP). Tabulate each round carefully." },
    { type: "recall", cards: [{ q: "OSPF uses", a: "Link state (Dijkstra)" }, { q: "RIP uses", a: "Distance vector" }, { q: "DV update", a: "min over v of c(x,v) + D_v(y)" }] },
    { type: "check", questions: [
      { id: "rt1", kind: "NAT", marks: 2, q: "In the lab graph, shortest distance from A to F?", answer: "13", solution: "A–C–B–D–E–F." },
      { id: "rt2", kind: "NAT", marks: 2, q: "X: link to A cost 2, to B cost 5. A says 7 to D, B says 3. X's distance to D?", answer: "8", solution: "min(9, 8)." },
      { id: "rt3", kind: "MCQ", marks: 1, q: "Which router does Dijkstra from A settle second in the lab graph?", options: ["B", "C", "D", "E"], answer: "B", solution: "C at distance 2." },
      { id: "rt4", kind: "MSQ", marks: 2, q: "Which are true?", options: ["RIP is a distance-vector protocol", "OSPF floods link-state advertisements", "BGP is used inside one autonomous system only", "Poisoned reverse advertises ∞ back to the next hop"], answer: "A, B, D", solution: "BGP is the inter-domain protocol." },
      { id: "rt5", kind: "NAT", marks: 1, q: "In RIP, what hop count means 'unreachable'?", answer: "16", solution: "RIP's infinity." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Computer Networks", sub: "Routing tables", href: "/topics/computer-networks-cn" },
      { label: "Algorithms: shortest paths", sub: "Dijkstra and Bellman–Ford in depth", href: "/topics/algorithms" },
      { label: "Topic 1: forwarding", sub: "Longest-prefix match", href: "/study/ip" },
    ] },
    { type: "links", prereq: ["Graphs"], usedIn: ["Forwarding tables"], cross: ["Algorithms: Dijkstra, Bellman–Ford"] },
  ],
};

export const CN_IP: Chapter = {
  id: "cs.cn.ip",
  subject: "Computer Networks",
  title: "IP addressing and routing",
  syllabus: ["CS · Computer Networks: IPv4/IPv6, routers and routing algorithms (distance vector, link state)", "CS · Computer Networks: IP addressing, subnetting, fragmentation, ARP, DHCP, ICMP, NAT"],
  pyqTopic: /IP|subnet|routing|network layer/i,
  map: { kind: "strip", items: [
    { label: "1. Addressing", sub: "subnets and CIDR", state: "done" },
    { label: "2. Fragmentation", sub: "the IPv4 header", state: "done" },
    { label: "3. Routing", sub: "DV and link state", state: "done" },
  ] },
  topics: [addressing, frag, routing, DA.arpNat, DA.ipv6Topic, DA.classfulTopic],
};
