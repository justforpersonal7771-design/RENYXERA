# Official GATE 2027 syllabus, Computer Science and Information Technology (CS)

Source: IIT Madras, `https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf` (PDF, 2 pages). Text extracted from the downloaded file on 24 Nov 2026 and copied verbatim below. This replaces the "written from memory" syllabus lines used in the first review packs.

**Section 1 · Engineering Mathematics**
- Discrete Mathematics: Propositional and first order logic. Sets, relations, functions, partial orders and lattices. Monoids, Groups. Graphs: connectivity, matching, colouring. Combinatorics: counting, recurrence relations, generating functions.
- Linear Algebra: Matrices, determinants, system of linear equations, eigenvalues and eigenvectors, LU decomposition.
- Calculus: Limits, continuity and differentiability, Maxima and minima, Mean value theorem, Integration.
- Probability and Statistics: Random variables, Uniform, normal, exponential, Poisson and binomial distributions. Mean, median, mode and standard deviation. Conditional probability and Bayes theorem.

**Section 2 · Digital Logic**
Boolean algebra and minimization – algebraic technique, Karnaugh map, tabular method. Design of combinational and sequential circuits. Number representation and arithmetic (fixed and floating point).

**Section 3 · Computer Organization and Architecture**
Instruction set and addressing modes. Design of arithmetic and logic unit (ALU). Design of control unit – hardwired and microprogrammed. Memory interfacing and hierarchy: performance, cache memory mapping. I/O interface (interrupt and DMA). Instruction pipelining, pipeline hazards.

**Section 4 · Programming and Data Structures**
Programming in C. Recursion. Arrays, stacks, queues, linked lists, trees, binary search trees, binary heaps, graphs.

**Section 5 · Algorithms**
Searching, sorting, hashing. Asymptotic worst case time and space complexity. Algorithm design techniques: greedy, dynamic programming and divide-and-conquer. Graph traversals, minimum spanning trees, shortest paths.

**Section 6 · Theory of Computation**
Regular expressions and finite automata. Context-free grammars and push-down automata. Regular and context-free languages, pumping lemma. Turing machines and undecidability.

**Section 7 · Compiler Design**
Lexical analysis, parsing, syntax-directed translation. Runtime environments. Intermediate code generation. Local optimisation, Data flow analyses: constant propagation, liveness analysis, common sub expression elimination.

**Section 8 · Operating System**
System calls, processes, threads, inter-process communication, concurrency and synchronization. Deadlock. CPU and I/O scheduling. Memory management and virtual memory. File systems.

**Section 9 · Databases**
ER-model. Relational model: relational algebra, tuple calculus, SQL. Integrity constraints, normal forms. File organization, indexing (e.g., B and B+ trees). Transactions and concurrency control.

**Section 10 · Computer Networks**
Principles of Layering; Basics of switching (circuit, packet and virtual circuit) and performance metrics; Data link layer: error detection, Medium Access Control, Ethernet; Distance vector and link state routing; IPv4 - Fragmentation, CIDR Notation, Network Address Translation; TCP- flow control and congestion control, socket API; DNS and HTTP.

## What changed compared with the lines we had from memory (2026 style)
- **Computer Networks (big change):** no ARP, DHCP, ICMP, UDP, SMTP, FTP, e-mail, flooding, IPv6 or bridging by name. "Error detection" replaces "framing, error detection". **Performance metrics** and **socket API** are explicit; Ethernet stays. Application layer is **DNS and HTTP** only.
- **Digital Logic:** minimization now names the **algebraic technique, Karnaugh map and tabular method** (Quine–McCluskey), and says **design** of combinational and sequential circuits.
- **Computer Organization:** adds **hardwired and microprogrammed control unit design** and **memory interfacing**; cache is "memory mapping"; secondary storage is not named.
- **Unchanged:** P&DS, Algorithms, TOC, Compiler Design, OS, Databases, and the Engineering Mathematics lines.

**Rule for the book:** content outside these lines is not deleted. It carries the tag [LEGACY-ASKED] (asked in 2017–2026 papers) or [BEYOND] and is kept as a lesson or note, so no concept is lost; only its priority changes.
