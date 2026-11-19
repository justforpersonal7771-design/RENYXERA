import * as DA from "./cn-deep-a";
import type { Chapter, Topic } from "@/lib/study/schema";

/**
 * Computer Networks → Layering and switching. Numbers from components/study/cn-labs.tsx (encapsulate, delays), checked by script:
 * 1000 bytes + TCP 20 + IP 20 + Ethernet 18 = 1058 (94.5% useful). 1000-byte packet, 1 Mbps, 2000 km links: Tt 8 ms, Tp 10 ms;
 * 3 links, 1 packet: 54 ms; 3 links, 5 packets: 86 ms.
 */

const layers: Topic = {
  id: "cs.cn.layers.stack",
  title: "Layers, encapsulation and devices",
  blocks: [
    { type: "hook", text: "When you open a web page, your browser never thinks about radio waves, and your Wi-Fi card never thinks about HTML. Each part of the network does one job and trusts the layer below to do the next. That split is why the internet can change one piece without breaking the rest." },
    { type: "objectives", items: ["Name the layers of the OSI and TCP/IP models and the job of each.", "Trace encapsulation and compute header overhead.", "Place hubs, switches and routers at the right layer."] },
    { type: "intuition", paras: ["Think of sending a letter inside an envelope, inside a courier bag, inside a lorry. Each wrapper carries the information its own handler needs and nothing more.", "Going down the stack, each layer adds its header (and the data link layer a trailer too). Going up at the receiver, each layer removes its own header and hands the rest upward. A layer only talks to the same layer on the other side.", "Devices work up to a certain layer: a hub just repeats bits (physical), a switch reads MAC addresses (data link), a router reads IP addresses (network)."], analogyLimit: "Envelopes are opened only at the destination; in a network, every router opens the frame and the packet header on every hop, then wraps it again for the next link." },
    { type: "definition", name: "Layered model", text: "Network functions are split into layers; each layer offers a service to the one above and uses the service of the one below.", items: ["OSI (7): physical, data link, network, transport, session, presentation, application.", "TCP/IP (5 as usually taught): physical, link, network (IP), transport (TCP/UDP), application.", "Data units: message (application), segment (transport), packet or datagram (network), frame (link), bits (physical).", "Hub, repeater: physical. Switch, bridge: data link. Router: network. Gateways and hosts: all layers."] },
    { type: "deep", sections: [
      { h: "What each layer adds", points: ["Transport: port numbers so the right program receives the data; TCP also adds sequence numbers and acknowledgements.", "Network: source and destination IP addresses, TTL, and fragmentation fields.", "Data link: source and destination MAC addresses for this one link, plus a CRC trailer for error detection.", "Physical: no header; it turns bits into signals."], paras: [] },
      { h: "Overhead in numbers", paras: ["1000 bytes of application data gains a 20-byte TCP header, a 20-byte IP header and 18 bytes of Ethernet header and trailer: 1058 bytes on the wire, so 94.5% of the frame is useful. Smaller messages waste a larger share: 500 bytes of data become 558 (89.6%)."] },
      { h: "Collision and broadcast domains", paras: ["A hub forwards every bit to every port, so all its ports share one collision domain. A switch gives each port its own collision domain but forwards broadcasts everywhere: one broadcast domain. A router separates broadcast domains: each interface is its own."] },
      { h: "Session and presentation", paras: ["OSI's session layer manages dialogues and checkpoints; the presentation layer handles encoding, compression and encryption. In TCP/IP these jobs live inside applications, which is why the five-layer model has no separate layers for them."] },
    ] },
    { type: "walkthrough", steps: ["Start with the application data size.", "Add each header from transport down to data link (plus the link trailer).", "Efficiency = data ÷ total frame size.", "For a device question, ask: what is the highest layer header it must read to do its job?"], prompt: { q: "Does a switch look at IP addresses?", a: "A plain (layer 2) switch does not. It forwards using MAC addresses only. Layer 3 switches are routers in switch form." } },
    { type: "figure", id: "stack", caption: "Encapsulation of 1000 bytes of data on the way down.", alt: "Sizes at each layer: 1000, 1020, 1040, 1058.", fig: { kind: "matrix", title: "Size at each layer", cols: ["Adds", "Size (bytes)"], rows: [{ label: "Application", cells: ["–", 1000] }, { label: "Transport (TCP)", cells: [20, 1020] }, { label: "Network (IP)", cells: [20, 1040] }, { label: "Data link (Ethernet)", cells: ["14 + 4", 1058], hl: true }] } },
    { type: "example", id: "lx1", level: "gate", title: "Header overhead", given: "An application sends 1000 bytes over TCP/IP on Ethernet. TCP and IP headers are 20 bytes each; Ethernet adds 14 bytes of header and 4 of trailer.", find: "Frame size and the share that is application data.",
      steps: [
        { say: "Add the headers: 1000 + 20 + 20 + 18.", result: "1058 bytes" },
        { say: "Efficiency = 1000 / 1058.", result: "≈ 94.5%" },
      ],
      answer: "1058 bytes; about 94.5% of it is application data.",
      check: "With 500 bytes of data, the frame is 558 bytes and only 89.6% is useful: headers hurt small messages most." },
    { type: "figure", id: "devices", for: "lx2", caption: "Which layer each device works up to.", alt: "Hub physical, switch data link, router network.", fig: { kind: "matrix", title: "Devices", cols: ["Highest layer", "Separates"], rows: [{ label: "Hub / repeater", cells: ["Physical", "nothing"] }, { label: "Switch / bridge", cells: ["Data link", "collision domains"] }, { label: "Router", cells: ["Network", "broadcast domains"], hl: true }] } },
    { type: "example", id: "lx2", level: "gate", title: "Counting domains", given: "A router has 2 interfaces. One connects to a switch with 6 hosts; the other to a hub with 4 hosts.", find: "Collision domains and broadcast domains.",
      steps: [
        { say: "Broadcast domains: one per router interface.", result: "2" },
        { say: "Collision domains: each switch port is one (6 hosts + the uplink to the router = 7); the hub with its 4 hosts and its link to the router is 1.", result: "8" },
      ],
      answer: "2 broadcast domains and 8 collision domains.",
      check: "Replace the hub with a switch and the hub side would give 5 collision domains instead of 1." },
    { type: "example", id: "lx3", level: "edge", title: "Which header changes on each hop?", given: "A packet crosses 3 routers between two hosts.", find: "Which addresses stay fixed and which change at each hop?",
      steps: [
        { say: "IP source and destination stay the same end to end (ignoring NAT)." },
        { say: "MAC addresses are rewritten at every router, because each link has its own sender and receiver.", result: "MAC changes, IP stays" },
      ],
      answer: "The IP addresses stay; the MAC addresses change on every hop. The TTL also drops by 1 at each router.",
      check: "This is why ARP is needed on every link: each router must find the next hop's MAC address." },
    { type: "lab", lab: "encap" },
    { type: "faded", title: "Your turn", given: "200 bytes of data over UDP (8-byte header), IP (20) and Ethernet (18).",
      steps: [{ say: "Frame size and efficiency?", blank: true, answer: "200 + 8 + 20 + 18 = 246 bytes; 200 / 246 ≈ 81.3%." }] },
    { type: "trap", wrong: "A switch separates broadcast domains.", tempting: "It separates collision domains, so it seems to separate everything.", whyWrong: "A layer-2 switch forwards broadcast frames out of every port. Only a router (or VLANs) splits broadcast domains.", rule: "Switch: collision domains. Router: broadcast domains." },
    { type: "trap", wrong: "Each layer adds a header and a trailer.", tempting: "Ethernet frames have a trailer.", whyWrong: "Only the data link layer adds a trailer (the CRC). Transport and network layers add headers only.", rule: "Trailers belong to the data link layer." },
    { type: "gate", text: "GATE asks which layer does what (often as MSQs), which device works at which layer, collision and broadcast domain counts, and header overhead NATs. Learn the layer order both ways." },
    { type: "recall", cards: [{ q: "Router works at", a: "Network layer" }, { q: "Transport data unit", a: "Segment" }, { q: "Who adds a trailer", a: "Data link layer (CRC)" }] },
    { type: "check", questions: [
      { id: "ly1", kind: "NAT", marks: 1, q: "1000 bytes of data, TCP 20, IP 20, Ethernet 18 bytes. Frame size in bytes?", answer: "1058", solution: "1000 + 20 + 20 + 18." },
      { id: "ly2", kind: "NAT", marks: 2, q: "A router has 2 interfaces: one to a 6-host switch, one to a 4-host hub. How many collision domains?", answer: "8", solution: "7 switch ports (6 hosts + uplink) + 1 hub domain." },
      { id: "ly3", kind: "MSQ", marks: 2, q: "Which are true?", options: ["A hub works at the physical layer", "A switch reads MAC addresses", "A router separates broadcast domains", "A switch separates broadcast domains"], answer: "A, B, C", solution: "Switches forward broadcasts to all ports." },
      { id: "ly4", kind: "MCQ", marks: 1, q: "Which field changes at every router hop?", options: ["Destination IP", "Source IP", "Destination MAC", "Destination port"], answer: "C", solution: "Link-layer addresses are per hop." },
      { id: "ly5", kind: "NAT", marks: 2, q: "200 bytes of data over UDP (8), IP (20) and Ethernet (18). Efficiency in percent? (One decimal.)", answer: "81.3", solution: "200 / 246 = 0.813." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Computer Networks", sub: "Layers and devices", href: "/topics/computer-networks-cn" },
      { label: "Topic 2: switching and delays", sub: "How long a packet takes", href: "/study/layering" },
      { label: "Operating System: system calls", sub: "Sockets are the API to the transport layer", href: "/study/processes" },
    ] },
    { type: "links", prereq: ["None"], usedIn: ["Every other Computer Networks chapter"], cross: ["Operating System: sockets"] },
  ],
};

const switching: Topic = {
  id: "cs.cn.layers.delay",
  title: "Switching and delays",
  blocks: [
    { type: "hook", text: "A 1000-byte packet on a 1 Mbps link takes 8 ms just to push out its bits, then 10 ms more to cross 2000 km of fibre. Send it through three routers and those numbers add up in a pattern you can predict exactly." },
    { type: "objectives", items: ["Separate transmission, propagation, queueing and processing delay.", "Compute end-to-end delay for store-and-forward packet switching.", "Compare circuit and packet switching."] },
    { type: "intuition", paras: ["Transmission delay is how long it takes to put all the bits on the wire: packet size divided by link rate. It depends on the link's speed, not its length.", "Propagation delay is how long one bit takes to travel the distance: length divided by signal speed (about 2 × 10⁸ m/s in cable). It does not depend on packet size.", "In store-and-forward switching, a router must receive the whole packet before sending it on. With several packets in a row, the links work in parallel like an assembly line, so later packets add only one transmission time each."], analogyLimit: "A convoy of lorries through toll gates: every gate waits for the whole lorry to arrive, but while lorry 2 is at gate 1, lorry 1 is already at gate 2." },
    { type: "definition", name: "Delays", text: "Total nodal delay = transmission + propagation + queueing + processing.", items: ["Transmission Tt = L / R (bits ÷ bits per second).", "Propagation Tp = d / v.", "Store-and-forward, k links, 1 packet: k × (Tt + Tp).", "k links, P packets back to back: (k + P − 1) × Tt + k × Tp.", "Circuit switching: set-up first, then a dedicated path; packet switching: no set-up, links shared."] },
    { type: "deep", sections: [
      { h: "Why (k + P − 1)", paras: ["The first packet needs k transmission times to cross k links. Each later packet finishes one transmission time behind the one before it, because every link is busy with exactly one packet at a time. So P packets need k + (P − 1) transmission slots, plus the propagation of the last packet over each link."] },
      { h: "Bandwidth-delay product", paras: ["R × Tp is how many bits fit 'in flight' on the link. A 1 Mbps link with 10 ms propagation holds 10,000 bits: more than a 1000-byte (8000-bit) packet, so its first bit arrives after the last bit has left."] },
      { h: "Circuit versus packet switching", points: ["Circuit: guaranteed rate, no queueing, but capacity wasted when idle and a set-up delay.", "Packet (datagram): links shared statistically, no set-up, but queueing and possible loss.", "Virtual circuit: a path is chosen at set-up, packets carry a short circuit number, and resources can be reserved."], paras: [] },
      { h: "Queueing", paras: ["Queueing delay depends on traffic intensity La/R (a packets per second of L bits). Near 1 it grows without bound, and above 1 the queue overflows and packets are dropped."] },
    ] },
    { type: "walkthrough", steps: ["Convert sizes to bits and rates to bits per second.", "Tt = L / R; Tp = d / v.", "Count links k (routers + 1) and packets P.", "Total = (k + P − 1) × Tt + k × Tp (add set-up time for circuits)."], prompt: { q: "Does a faster link reduce propagation delay?", a: "No. A faster rate shortens transmission time; propagation depends only on distance and signal speed." } },
    { type: "figure", id: "sf", caption: "Three links, store-and-forward, one 1000-byte packet at 1 Mbps over 2000 km per link.", alt: "Each link costs 8 ms transmission plus 10 ms propagation: 54 ms.", fig: { kind: "strip", items: [{ label: "Link 1", sub: "8 + 10 ms", state: "done" }, { label: "Link 2", sub: "8 + 10 ms", state: "done" }, { label: "Link 3", sub: "8 + 10 ms", state: "done" }, { label: "Arrives", sub: "54 ms", state: "now" }] } },
    { type: "example", id: "sx1", level: "gate", title: "One packet, three links", given: "A 1000-byte packet crosses 3 links (2 routers). Each link is 1 Mbps and 2000 km long; signals travel at 2 × 10⁸ m/s. Ignore queueing and processing.", find: "Time until the last bit arrives.",
      steps: [
        { say: "Tt = 8000 bits / 10⁶ bps.", result: "8 ms" },
        { say: "Tp = 2 × 10⁶ m / 2 × 10⁸ m/s.", result: "10 ms" },
        { say: "Total = 3 × (8 + 10).", result: "54 ms" },
      ],
      answer: "54 ms.",
      check: "With a single direct link it would be 18 ms: each router adds a full transmission time." },
    { type: "figure", id: "pipe", for: "sx2", caption: "Five packets pipeline through three links.", alt: "Total (3 + 5 − 1) × 8 + 3 × 10 = 86 ms.", fig: { kind: "matrix", title: "Delay with P packets (k = 3)", cols: ["Total (ms)"], rows: [{ label: "P = 1", cells: [54] }, { label: "P = 5", cells: [86], hl: true }] } },
    { type: "example", id: "sx2", level: "gate", title: "A train of packets", given: "Same network. The message is 5 packets of 1000 bytes, sent back to back.", find: "Time until the last bit of the last packet arrives.",
      steps: [
        { say: "Slots: k + P − 1 = 3 + 5 − 1 = 7 transmission times = 56 ms." },
        { say: "Add propagation over 3 links: 30 ms.", result: "86 ms" },
      ],
      answer: "86 ms, not 5 × 54 = 270 ms, because the links work in parallel.",
      check: "Sending the 5000 bytes as one big packet would take 3 × (40 + 10) = 150 ms: splitting into packets pipelines the work." },
    { type: "example", id: "sx3", level: "edge", title: "Circuit switching with set-up", given: "A circuit takes 50 ms to set up, then gives 1 Mbps end to end over a 6000 km path (2 × 10⁸ m/s). Send 5000 bytes.", find: "Total time.",
      steps: [
        { say: "Transmission once over the whole circuit: 40,000 bits / 10⁶.", result: "40 ms" },
        { say: "Propagation: 6000 km / 2 × 10⁵ km/s.", result: "30 ms" },
        { say: "Total: 50 + 40 + 30.", result: "120 ms" },
      ],
      answer: "120 ms. There is no per-router store-and-forward cost, but the set-up time is paid first.",
      check: "For a short message, set-up dominates; for a long one, circuit switching's lack of per-hop delay wins." },
    { type: "lab", lab: "delay" },
    { type: "faded", title: "Your turn", given: "A 500-byte packet over 2 links of 2 Mbps; each link has 5 ms propagation.",
      steps: [{ say: "Total delay?", blank: true, answer: "Tt = 4000 / 2×10⁶ = 2 ms. 2 × (2 + 5) = 14 ms." }] },
    { type: "trap", wrong: "Propagation delay depends on packet size.", tempting: "Bigger packets take longer.", whyWrong: "Bigger packets take longer to transmit; each bit still travels at the same speed over the same distance.", rule: "Tt = L/R (size). Tp = d/v (distance)." },
    { type: "trap", wrong: "P packets over k links take P × k × (Tt + Tp).", tempting: "Each packet seems to pay the whole path.", whyWrong: "The links pipeline: after the first packet, each extra packet adds only one Tt.", rule: "(k + P − 1) Tt + k Tp." },
    { type: "gate", text: "Delay NATs appear almost every year, often with store-and-forward and several packets or a message split into packets with headers. Convert units first and count links, not routers." },
    { type: "recall", cards: [{ q: "Transmission delay", a: "L / R" }, { q: "Propagation delay", a: "d / v" }, { q: "P packets, k links", a: "(k + P − 1) Tt + k Tp" }] },
    { type: "check", questions: [
      { id: "sw1", kind: "NAT", marks: 2, q: "1000-byte packet, 3 links of 1 Mbps, 10 ms propagation each, store-and-forward. Delay in ms?", answer: "54", solution: "3 × (8 + 10)." },
      { id: "sw2", kind: "NAT", marks: 2, q: "Same network, 5 packets of 1000 bytes back to back. Delay until the last bit arrives, in ms?", answer: "86", solution: "(3 + 5 − 1) × 8 + 3 × 10." },
      { id: "sw3", kind: "NAT", marks: 1, q: "500-byte packet, 2 links of 2 Mbps, 5 ms propagation each. Delay in ms?", answer: "14", solution: "2 × (2 + 5)." },
      { id: "sw4", kind: "MSQ", marks: 2, q: "Which are true of packet switching compared with circuit switching?", options: ["No call set-up is needed", "Link capacity is shared", "Delay is guaranteed", "Packets may queue at routers"], answer: "A, B, D", solution: "Guaranteed delay is a circuit-switching property." },
      { id: "sw5", kind: "MCQ", marks: 1, q: "Doubling the link rate halves", options: ["Propagation delay", "Transmission delay", "Both", "Neither"], answer: "B", solution: "Tt = L/R." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Computer Networks", sub: "Delay calculations", href: "/topics/computer-networks-cn" },
      { label: "Flow control", sub: "Tt and Tp decide sliding window efficiency", href: "/study/data-link" },
      { label: "Topic 1: layers", sub: "Where the headers come from", href: "/study/layering" },
    ] },
    { type: "links", prereq: ["Topic 1"], usedIn: ["Sliding window efficiency", "CSMA/CD minimum frame"], cross: ["Computer Organisation: pipelining"] },
  ],
};

export const CN_LAYERS: Chapter = {
  id: "cs.cn.layers",
  subject: "Computer Networks",
  title: "Layering and switching",
  syllabus: ["CS · Computer Networks: Concept of layering, OSI and TCP/IP protocol stacks", "CS · Computer Networks: Packet, circuit and virtual circuit switching"],
  pyqTopic: /OSI|Protocol Layers|switching/i,
  map: { kind: "strip", items: [
    { label: "1. Layers", sub: "encapsulation and devices", state: "done" },
    { label: "2. Switching", sub: "delays end to end", state: "done" },
  ] },
  topics: [layers, switching, DA.perfTopic],
};
