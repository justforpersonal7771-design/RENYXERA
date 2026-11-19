# Depth expansion for the finished books (owner, 19 Nov 2026)

The owner asked for full textbook depth with more topics per chapter, including the books already written (Operating Systems,
Computer Networks, Discrete Mathematics). Each new item below is a **full topic** (hook, idea, definition, in-depth sections,
method, 3 worked examples with figures, lab, finish-the-solution, traps, GATE note, recall, 5 checks, links), each with its
**own lab**, numbers checked by script. Sources: Galvin (OS), Kurose/Tanenbaum/Forouzan (CN), Rosen and Liu (DM).

Status: [ ] to write · [x] written

## Operating Systems
- Processes and threads: [x] schedulers and queues (long/medium/short term, context-switch cost) · [x] process termination, zombies, orphans, wait/exit
- CPU scheduling: [x] scheduling with I/O bursts (CPU utilisation, multiprocessor and real-time basics: RM, EDF)
- Synchronisation: [x] semaphore value questions (P/V traces, counting semaphores) · [x] monitors and condition variables · [x] readers–writers in depth · [x] dining philosophers in depth
- Memory management: [x] page-table size and structures (inverted, hashed) · [x] buddy and slab allocation
- Virtual memory: [x] LRU approximations (reference bits, clock, enhanced clock, counting policies) · [x] copy-on-write and memory-mapped files
- File systems and disk: [x] directory structures, links, mounting · [x] free-space management · [x] disk structure and access time · [x] RAID levels · [x] I/O systems (polling, interrupts, DMA, buffering, spooling)

## Computer Networks
- Layering and switching: [x] network performance (throughput, bandwidth-delay product, RTT, queueing intensity)
- Data link and MAC: [x] Hamming code construction and correction · [x] Ethernet frame, learning bridges and spanning tree · [x] wireless and CSMA/CA
- IP addressing and routing: [x] ARP, DHCP, ICMP and NAT · [x] IPv6 essentials · [x] classful addressing and supernetting
- TCP, UDP and flow control: [x] receive window and flow control · [x] TCP timers and RTO estimation (Jacobson, Karn) · [x] UDP and checksums
- Application layer: [x] DNS records and resolution in depth · [x] email: SMTP, MIME, POP3, IMAP · [x] HTTP versions, cookies and caching

## Discrete Mathematics
- Propositional logic: [x] rules of inference and proof methods · [x] normal forms and functional completeness
- First-order logic: [x] translating nested statements (practice-heavy)
- Sets, relations and functions: [x] set algebra, power sets, cardinality and countability · [x] composition, inverses and equivalence classes
- Partial orders and lattices: [x] Boolean algebra as a lattice
- Monoids and groups: [x] cosets, normal subgroups, isomorphism
- Graph theory: [x] trees and spanning trees (Cayley, counting) · [x] planarity and Euler's formula · [x] matching and Hall's theorem · [x] graph isomorphism
- Counting: [x] pigeonhole in depth · [x] binomial identities and the binomial theorem
- Recurrences: [x] non-homogeneous recurrences and divide-and-conquer recurrences

Order of work (owner's subject order): Discrete Mathematics expansions alongside the Databases book, then OS and CN expansions,
then Programming and DS, Algorithms, and the rest. One subject (book or expansion) per turn.
