import * as DB2 from "./cn-deep-b";
import type { Chapter, Topic } from "@/lib/study/schema";

/**
 * Computer Networks → Application layer. Numbers from components/study/cn-labs.tsx (httpTime), checked by script:
 * RTT 20 ms, base page + 8 objects: non-persistent serial 18 RTT = 360 ms; persistent without pipelining 10 RTT = 200 ms;
 * pipelined 3 RTT = 60 ms. RTT 50 ms, 4 objects, non-persistent, DNS 30 ms: 10 RTT + 30 = 530 ms.
 */

const web: Topic = {
  id: "cs.cn.app.web",
  title: "DNS and HTTP",
  blocks: [
    { type: "hook", text: "Typing a web address sets off two conversations before a single pixel appears: one to turn the name into an address, one to fetch the page and everything it embeds. Counting round trips tells you how long both take." },
    { type: "objectives", items: ["Trace iterative and recursive DNS resolution.", "Count round trips for non-persistent, persistent and pipelined HTTP.", "Know what HTTP caching and cookies do."] },
    { type: "intuition", paras: ["DNS is a distributed, hierarchical database: root servers know the top-level domain servers (.com, .in), which know each domain's authoritative servers. Your local resolver walks this tree and caches the answers.", "HTTP runs over TCP. Opening a TCP connection costs one round trip; each request and its response another.", "Non-persistent HTTP opens a new connection for every object. Persistent HTTP reuses one connection; pipelining sends several requests without waiting for each response."], analogyLimit: "Like asking a librarian who asks another library; but DNS answers are cached for a time-to-live, so the next lookup is often instant." },
    { type: "definition", name: "DNS and HTTP timing", text: "Ignoring transmission time, with RTT r and a base page referencing N objects:", items: ["Non-persistent, serial: 2r for the base + 2r per object = 2r(N + 1).", "Persistent without pipelining: 2r for the base + r per object = (2 + N)r.", "Persistent with pipelining: 2r + r = 3r for everything.", "DNS adds its lookup time first (one RTT per server queried when not cached)."] },
    { type: "deep", sections: [
      { h: "Iterative versus recursive", paras: ["In an iterative lookup the local resolver asks the root, which replies 'ask the .in server'; the resolver then asks that server, and so on. In a recursive lookup each server asks the next on the client's behalf. Hosts usually ask their local resolver recursively, and the resolver works iteratively."] },
      { h: "Records", points: ["A: name to IPv4 address; AAAA: to IPv6.", "NS: the authoritative name server for a domain.", "CNAME: an alias to the canonical name.", "MX: the mail server for a domain."], paras: [] },
      { h: "HTTP messages", paras: ["A request has a method (GET, POST, HEAD, PUT, DELETE), a path and headers; a response has a status code (200 OK, 301 moved, 304 not modified, 404 not found, 500 server error) and headers. HTTP itself is stateless; cookies add state on top."] },
      { h: "Caching", paras: ["A conditional GET (If-Modified-Since) lets a cache or browser check freshness; the server replies 304 with no body if nothing changed. Web proxies cache popular objects near users, cutting delay and upstream traffic."] },
    ] },
    { type: "walkthrough", steps: ["Add the DNS time if the name is not cached.", "Base page: 2 RTT (TCP set-up + request).", "Objects: + 2 RTT each (non-persistent serial), + 1 RTT each (persistent), + 1 RTT total (pipelined).", "Add transmission times only if the question gives sizes and rates."], prompt: { q: "Why does a persistent connection save time?", a: "It skips the TCP handshake (one RTT) for every object after the first." } },
    { type: "figure", id: "http", caption: "RTT 20 ms, a base page plus 8 objects.", alt: "Non-persistent 360 ms, persistent 200 ms, pipelined 60 ms.", fig: { kind: "matrix", title: "Page load time", cols: ["RTTs", "ms"], rows: [{ label: "Non-persistent, serial", cells: [18, 360] }, { label: "Persistent", cells: [10, 200] }, { label: "Persistent, pipelined", cells: [3, 60], hl: true }] } },
    { type: "example", id: "hx1", level: "gate", title: "Three ways to load a page", given: "RTT 20 ms. A base HTML file references 8 small images. Ignore transmission time.", find: "Total time for each HTTP mode.",
      steps: [
        { say: "Non-persistent serial: 2 × (1 + 8) = 18 RTT.", result: "360 ms" },
        { say: "Persistent, no pipelining: 2 + 8 = 10 RTT.", result: "200 ms" },
        { say: "Persistent with pipelining: 2 + 1 = 3 RTT.", result: "60 ms" },
      ],
      answer: "360 ms, 200 ms and 60 ms.",
      check: "Five parallel non-persistent connections would need 2 + 2 × ⌈8/5⌉ = 6 RTT = 120 ms." },
    { type: "figure", id: "dns", for: "hx2", caption: "An iterative lookup for www.example.in with an empty cache.", alt: "Root, .in server, then authoritative server: three queries.", fig: { kind: "strip", items: [{ label: "Root", sub: "ask .in", state: "done" }, { label: ".in TLD", sub: "ask example.in", state: "done" }, { label: "Authoritative", sub: "A record", state: "now" }, { label: "Then HTTP", sub: "to the address", state: "done" }] } },
    { type: "example", id: "hx2", level: "gate", title: "DNS before HTTP", given: "Each DNS server is 10 ms away (RTT). The resolver's cache is empty, so it queries the root, the .in server and the authoritative server. Then a non-persistent page with 4 objects loads over RTT 50 ms.", find: "Total time.",
      steps: [
        { say: "DNS: 3 queries × 10 ms.", result: "30 ms" },
        { say: "HTTP: 2 × (1 + 4) = 10 RTT × 50.", result: "500 ms" },
        { say: "Total.", result: "530 ms" },
      ],
      answer: "530 ms.",
      check: "With the name cached, the DNS term disappears: 500 ms." },
    { type: "example", id: "hx3", level: "edge", title: "Conditional GET", given: "A browser has a cached copy of logo.png from yesterday. It sends GET with If-Modified-Since.", find: "What the server sends if the file is unchanged, and if it changed.",
      steps: [
        { say: "Unchanged: 304 Not Modified, no body; the browser uses its copy." },
        { say: "Changed: 200 OK with the new file.", result: "304 or 200" },
      ],
      answer: "304 with no body if unchanged; 200 with the new file otherwise.",
      check: "Either way, the round trip happens; only the transfer is saved." },
    { type: "lab", lab: "http" },
    { type: "faded", title: "Your turn", given: "RTT 30 ms, base page + 5 objects, persistent connection without pipelining.",
      steps: [{ say: "Total time?", blank: true, answer: "(2 + 5) × 30 = 210 ms." }] },
    { type: "trap", wrong: "A non-persistent fetch takes 1 RTT per object.", tempting: "One request, one response.", whyWrong: "Each object needs a new TCP connection first: 1 RTT for the handshake plus 1 for the request.", rule: "Non-persistent: 2 RTT per object." },
    { type: "trap", wrong: "DNS always uses TCP.", tempting: "Reliability matters for names.", whyWrong: "Ordinary queries use UDP port 53; TCP is used for zone transfers and large responses.", rule: "DNS queries: UDP 53." },
    { type: "gate", text: "GATE asks page-load time in RTTs for the HTTP variants, iterative versus recursive DNS query counts, and which protocol uses which transport. Write the RTT count before multiplying." },
    { type: "recall", cards: [{ q: "Non-persistent page", a: "2(N + 1) RTT" }, { q: "Pipelined persistent", a: "3 RTT" }, { q: "MX record", a: "Mail server for a domain" }] },
    { type: "check", questions: [
      { id: "wb1", kind: "NAT", marks: 2, q: "RTT 20 ms, base + 8 objects, non-persistent serial. Time in ms?", answer: "360", solution: "18 × 20." },
      { id: "wb2", kind: "NAT", marks: 2, q: "Same page, persistent without pipelining. Time in ms?", answer: "200", solution: "10 × 20." },
      { id: "wb3", kind: "NAT", marks: 1, q: "RTT 30 ms, base + 5 objects, persistent without pipelining. Time in ms?", answer: "210", solution: "7 × 30." },
      { id: "wb4", kind: "MSQ", marks: 2, q: "Which are true?", options: ["HTTP is stateless", "Cookies let servers keep state", "304 means the cached copy is still valid", "DNS queries normally use TCP"], answer: "A, B, C", solution: "DNS queries normally use UDP." },
      { id: "wb5", kind: "MCQ", marks: 1, q: "Which record maps a name to an IPv4 address?", options: ["MX", "NS", "A", "CNAME"], answer: "C", solution: "A record." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Computer Networks", sub: "HTTP and DNS", href: "/topics/computer-networks-cn" },
      { label: "TCP connections", sub: "Why set-up costs an RTT", href: "/study/transport" },
      { label: "Topic 2: email, FTP and DHCP", sub: "The other application protocols", href: "/study/application" },
    ] },
    { type: "links", prereq: ["TCP handshake"], usedIn: ["Web performance"], cross: ["Databases: caching ideas"] },
  ],
};

const protocols: Topic = {
  id: "cs.cn.app.protocols",
  title: "Email, FTP, DHCP and well-known ports",
  blocks: [
    { type: "hook", text: "Sending an email uses one protocol, reading it another. A laptop joining Wi-Fi gets its address from a third, before it even has an address to receive the reply at." },
    { type: "objectives", items: ["Place SMTP, POP3 and IMAP in the email path.", "Explain FTP's two connections and DHCP's four messages.", "Recall the transport and port of common protocols."] },
    { type: "intuition", paras: ["SMTP pushes mail from your client to your mail server and from server to server. POP3 or IMAP pulls mail from your server to your client. Webmail uses HTTP instead for the client side.", "FTP keeps a control connection (port 21) open for commands and opens a separate data connection (port 20 in active mode) for each file: control is 'out of band'.", "DHCP lets a new host discover a server and lease an address, all by broadcast over UDP, since it has no address yet."], analogyLimit: "Like posting a letter (push) versus collecting it from the post office (pull); but IMAP leaves the letters at the post office and just shows you them." },
    { type: "definition", name: "Protocols to know", text: "Application protocols with their transport and port.", items: ["SMTP 25 (TCP), POP3 110 (TCP), IMAP 143 (TCP).", "HTTP 80, HTTPS 443, SSH 22, Telnet 23, FTP 20/21: all TCP.", "DNS 53 (UDP mostly), DHCP 67 server / 68 client, SNMP 161, TFTP 69: UDP.", "DHCP: Discover, Offer, Request, Acknowledge (DORA)."] },
    { type: "deep", sections: [
      { h: "Email in full", paras: ["Alice's client sends via SMTP to her server; her server sends via SMTP to Bob's server (found by an MX lookup); Bob's client fetches by POP3 (download, usually delete) or IMAP (keep on the server, folders shared across devices). MIME lets SMTP carry attachments and non-ASCII text by encoding them."] },
      { h: "DORA", points: ["Discover: client broadcasts from 0.0.0.0 to 255.255.255.255.", "Offer: a server offers an address and lease time.", "Request: client broadcasts which offer it accepts (so other servers withdraw).", "Acknowledge: the server confirms; the lease starts."], paras: [] },
      { h: "ICMP", paras: ["ICMP carries network-layer error and control messages: echo request and reply (ping), destination unreachable, time exceeded (used by traceroute, which sends packets with TTL 1, 2, 3, … and collects the replies)."] },
      { h: "Stateful or not", paras: ["HTTP is stateless; FTP keeps state (current directory, login) for the whole control session. SMTP and POP3 are command–response protocols with simple state machines."] },
    ] },
    { type: "walkthrough", steps: ["For email questions, mark each hop as push (SMTP) or pull (POP3/IMAP/HTTP).", "For ports, recall the pairs; UDP for DNS, DHCP, SNMP, TFTP; TCP for the rest.", "For DHCP, list DORA and note which messages are broadcast.", "For traceroute, count hops by TTL steps."], prompt: { q: "Why does DHCP use UDP and broadcast?", a: "The client has no IP address and no server address yet, so it cannot open a TCP connection; it can only broadcast." } },
    { type: "figure", id: "mail", caption: "The path of one email.", alt: "Client to server by SMTP, server to server by SMTP, server to client by IMAP or POP3.", fig: { kind: "strip", items: [{ label: "Alice's client", sub: "SMTP push", state: "done" }, { label: "Alice's server", sub: "SMTP push", state: "done" }, { label: "Bob's server", sub: "IMAP/POP3 pull", state: "now" }, { label: "Bob's client", sub: "reads", state: "done" }] } },
    { type: "example", id: "px1", level: "gate", title: "Which protocols carry an email?", given: "Alice uses a desktop mail client; Bob reads mail in a browser (webmail).", find: "The protocols on each hop.",
      steps: [
        { say: "Alice's client → her server: SMTP." },
        { say: "Her server → Bob's server: SMTP." },
        { say: "Bob's server → Bob's browser: HTTP(S).", result: "SMTP, SMTP, HTTP" },
      ],
      answer: "SMTP, then SMTP, then HTTP.",
      check: "If Bob used a desktop client, the last hop would be POP3 or IMAP." },
    { type: "figure", id: "ports", for: "px2", caption: "Transport and port of common protocols.", alt: "Table of protocols with TCP or UDP and port numbers.", fig: { kind: "matrix", title: "Well-known ports", cols: ["Transport", "Port"], rows: [{ label: "DNS", cells: ["UDP", 53], hl: true }, { label: "DHCP", cells: ["UDP", "67/68"] }, { label: "SMTP", cells: ["TCP", 25] }, { label: "HTTP / HTTPS", cells: ["TCP", "80/443"] }, { label: "FTP", cells: ["TCP", "20/21"] }] } },
    { type: "example", id: "px2", level: "gate", title: "Transport for each protocol", given: "SNMP, FTP, DHCP, SSH, TFTP.", find: "Which use UDP?",
      steps: [
        { say: "SNMP: UDP 161. DHCP: UDP 67/68. TFTP: UDP 69." },
        { say: "FTP and SSH: TCP.", result: "SNMP, DHCP, TFTP" },
      ],
      answer: "SNMP, DHCP and TFTP use UDP; FTP and SSH use TCP.",
      check: "TFTP is the 'trivial' FTP: tiny, UDP-based, used for booting devices." },
    { type: "example", id: "px3", level: "edge", title: "Counting traceroute probes", given: "A destination is 4 router hops away. Traceroute sends 3 probes per TTL value.", find: "How many probes until the destination replies?",
      steps: [
        { say: "TTL 1 to 4 each expire at a router (time exceeded); TTL 5 reaches the host." },
        { say: "5 TTL values × 3 probes.", result: "15 probes" },
      ],
      answer: "15 probes (TTL 1 to 5, three each).",
      check: "The host replies with port unreachable (UDP traceroute) or echo reply (ICMP traceroute)." },
    { type: "lab", lab: "ports" },
    { type: "faded", title: "Your turn", given: "A host boots and needs an address.",
      steps: [{ say: "The four DHCP messages and which the client broadcasts?", blank: true, answer: "Discover (broadcast), Offer, Request (broadcast), Acknowledge." }] },
    { type: "trap", wrong: "POP3 sends mail between servers.", tempting: "It is a mail protocol.", whyWrong: "POP3 and IMAP only retrieve mail to a client. Server-to-server delivery is always SMTP.", rule: "SMTP pushes; POP3/IMAP pull." },
    { type: "trap", wrong: "FTP sends commands and data on one connection.", tempting: "HTTP does.", whyWrong: "FTP uses a separate control connection (21) and data connections (20 in active mode).", rule: "FTP control is out of band." },
    { type: "gate", text: "Expect MSQs matching protocols to ports and transports, the email path, DHCP steps, and which protocols are stateless or use out-of-band control." },
    { type: "recall", cards: [{ q: "SMTP port", a: "25 (TCP)" }, { q: "DHCP steps", a: "Discover, Offer, Request, Ack" }, { q: "FTP control port", a: "21" }] },
    { type: "check", questions: [
      { id: "pr1", kind: "MSQ", marks: 2, q: "Which normally run over UDP?", options: ["DNS queries", "DHCP", "SMTP", "SNMP"], answer: "A, B, D", solution: "SMTP uses TCP." },
      { id: "pr2", kind: "NAT", marks: 1, q: "Port number of SMTP?", answer: "25", solution: "Well-known port." },
      { id: "pr3", kind: "NAT", marks: 2, q: "A host is 4 router hops away; traceroute sends 3 probes per TTL. Probes sent until the host replies?", answer: "15", solution: "TTL 1–5, three each." },
      { id: "pr4", kind: "MCQ", marks: 1, q: "Bob reads mail in a desktop client that keeps messages on the server across devices. Protocol?", options: ["SMTP", "POP3", "IMAP", "FTP"], answer: "C", solution: "IMAP keeps mail on the server." },
      { id: "pr5", kind: "MCQ", marks: 2, q: "Which protocol uses a separate control connection?", options: ["HTTP", "FTP", "SMTP", "DNS"], answer: "B", solution: "FTP: control on 21, data on 20." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Computer Networks", sub: "Application protocols", href: "/topics/computer-networks-cn" },
      { label: "Topic 1: DNS and HTTP", sub: "Timing a page load", href: "/study/application" },
      { label: "IP addressing", sub: "What DHCP hands out", href: "/study/ip" },
    ] },
    { type: "links", prereq: ["TCP and UDP"], usedIn: ["Network administration"], cross: ["Operating System: daemons and ports"] },
  ],
};

export const CN_APP: Chapter = {
  id: "cs.cn.app",
  subject: "Computer Networks",
  title: "Application layer",
  syllabus: ["CS · Computer Networks: Application layer protocols: DNS, SMTP, HTTP, FTP, Email"],
  pyqTopic: /application layer|DNS|HTTP|SMTP|FTP|email/i,
  map: { kind: "strip", items: [
    { label: "1. DNS and HTTP", sub: "round trips", state: "done" },
    { label: "2. Email and ports", sub: "SMTP, DHCP, FTP", state: "done" },
  ] },
  topics: [web, protocols, DB2.dnsTopic, DB2.emailTopic, DB2.httpTopic],
};
