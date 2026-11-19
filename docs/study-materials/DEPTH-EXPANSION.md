# Depth expansion for the finished books (owner, 19 Nov 2026)

The owner asked for full textbook depth with more topics per chapter, including the books already written (Operating Systems,
Computer Networks, Discrete Mathematics). Each new item below is a **full topic** (hook, idea, definition, in-depth sections,
method, 3 worked examples with figures, lab, finish-the-solution, traps, GATE note, recall, 5 checks, links), each with its
**own lab**, numbers checked by script. Sources: Galvin (OS), Kurose/Tanenbaum/Forouzan (CN), Rosen and Liu (DM).

Status: [ ] to write · [x] written

## Operating Systems
- Processes and threads: [ ] schedulers and queues (long/medium/short term, context-switch cost) · [ ] process termination, zombies, orphans, wait/exit
- CPU scheduling: [ ] scheduling with I/O bursts (CPU utilisation, multiprocessor and real-time basics: RM, EDF)
- Synchronisation: [ ] semaphore value questions (P/V traces, counting semaphores) · [ ] monitors and condition variables · [ ] readers–writers in depth · [ ] dining philosophers in depth
- Memory management: [ ] page-table size and structures (inverted, hashed) · [ ] buddy and slab allocation
- Virtual memory: [ ] LRU approximations (reference bits, clock, enhanced clock, counting policies) · [ ] copy-on-write and memory-mapped files
- File systems and disk: [ ] directory structures, links, mounting · [ ] free-space management · [ ] disk structure and access time · [ ] RAID levels · [ ] I/O systems (polling, interrupts, DMA, buffering, spooling)

## Computer Networks
- Layering and switching: [ ] network performance (throughput, bandwidth-delay product, RTT, queueing intensity)
- Data link and MAC: [ ] Hamming code construction and correction · [ ] Ethernet frame, learning bridges and spanning tree · [ ] wireless and CSMA/CA
- IP addressing and routing: [ ] ARP, DHCP, ICMP and NAT · [ ] IPv6 essentials · [ ] classful addressing and supernetting
- TCP, UDP and flow control: [ ] receive window and flow control · [ ] TCP timers and RTO estimation (Jacobson, Karn) · [ ] UDP and checksums
- Application layer: [ ] DNS records and resolution in depth · [ ] email: SMTP, MIME, POP3, IMAP · [ ] HTTP versions, cookies and caching

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
