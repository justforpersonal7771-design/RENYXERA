// The official GATE 2027 CS & IT and General Aptitude syllabus, as published by the organising
// institute (IIT Madras), structured as section → subject → unit → items. Every unit lists the
// question-bank topic tags it covers, so each unit can show its real past-paper weightage.
export const SYLLABUS_SOURCE = {
  exam: "GATE 2027",
  institute: "IIT Madras",
  cs: "https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf",
  ga: "https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/GA_GATE2027_Syllabus.pdf",
  page: "https://gate2027.iitm.ac.in/exam_papers_and_syllabus",
};

export type SyllabusGroup = "General Aptitude" | "Engineering Mathematics" | "Core Computer Science";
export type SyllabusUnit = { name: string; items: string[]; bank: string[] };
export type SyllabusSection = { title: string; group: SyllabusGroup; official: string; subjects: string[]; units: SyllabusUnit[] };

export const SYLLABUS_GROUPS: { name: SyllabusGroup; blurb: string }[] = [
  { name: "General Aptitude", blurb: "Common to every GATE paper · 15 marks" },
  { name: "Engineering Mathematics", blurb: "CS paper Section 1" },
  { name: "Core Computer Science", blurb: "CS paper Sections 2–10" },
];

export const SYLLABUS: SyllabusSection[] = [
  // ── General Aptitude ──
  { title: "Verbal Aptitude", group: "General Aptitude", official: "GA Section 1", subjects: ["Verbal Aptitude"], units: [
    { name: "Basic English grammar", items: ["Tenses", "Articles", "Adjectives", "Prepositions", "Conjunctions", "Verb-noun agreement", "Other parts of speech"], bank: ["Basic English Grammar (Tenses, Articles, Adjectives)", "Grammar Rules (Prepositions, Conjunctions, Verb-Noun Agreement, Other Parts of Speech)"] },
    { name: "Basic vocabulary", items: ["Words", "Idioms", "Phrases in context"], bank: ["Basic Vocabulary (Words, Idioms, Phrases in Context)", "Vocabulary Mechanics (Antonyms, Synonyms)"] },
    { name: "Reading & sequencing", items: ["Reading and comprehension", "Narrative sequencing"], bank: ["Reading Comprehension", "Narrative Sequencing"] },
  ] },
  { title: "Quantitative Aptitude", group: "General Aptitude", official: "GA Section 2", subjects: ["Quantitative Aptitude"], units: [
    { name: "Data interpretation", items: ["Bar graphs", "Pie charts", "Other data graphs", "2- and 3-dimensional plots", "Maps", "Tables"], bank: ["Data Interpretation (Bar Graphs, Pie Charts, Histograms)", "Graphical Representations (2D and 3D Plots, Maps, Tables)"] },
    { name: "Numerical computation & estimation", items: ["Ratios", "Percentages", "Powers, exponents and logarithms", "Permutations and combinations", "Series"], bank: ["Numerical Computation (Percentages, Ratios)", "Mathematical Operations (Powers, Exponents, Logarithms)", "Combinatorics Core (Permutations, Combinations, Series)", "Averages, Mixtures, and Alligations"] },
    { name: "Mensuration & geometry", items: ["Mensuration", "Geometry"], bank: ["Mensuration and Geometry"] },
    { name: "Elementary statistics & probability", items: ["Statistics", "Probability"], bank: ["Elementary Statistics and Probability"] },
  ] },
  { title: "Analytical Aptitude", group: "General Aptitude", official: "GA Section 3", subjects: ["Analytical Aptitude"], units: [
    { name: "Logic", items: ["Deduction", "Induction"], bank: ["Logic Deduction and Induction Frameworks", "Operational Puzzles and Systemic Reasoning"] },
    { name: "Analogy", items: ["Analogy"], bank: ["Analogy and Relationship Matching"] },
    { name: "Numerical relations & reasoning", items: ["Numerical relations", "Reasoning"], bank: ["Numerical Relations & Arithmetic Logic"] },
  ] },
  { title: "Spatial Aptitude", group: "General Aptitude", official: "GA Section 4", subjects: ["Spatial Aptitude"], units: [
    { name: "Transformation of shapes", items: ["Translation", "Rotation", "Scaling", "Mirroring", "Assembling", "Grouping"], bank: ["Shape Transformation (Translation, Rotation, Scaling)", "Structural Morphing (Mirroring, Assembling, Grouping)"] },
    { name: "Paper folding, cutting & patterns", items: ["Paper folding", "Cutting", "Patterns in 2 and 3 dimensions"], bank: ["Paper Folding and Cutting Diagnostics", "Pattern Identification in 2D and 3D Spaces"] },
  ] },

  // ── Engineering Mathematics (CS Section 1) ──
  { title: "Discrete Mathematics", group: "Engineering Mathematics", official: "CS Section 1", subjects: ["Discrete Mathematics"], units: [
    { name: "Logic", items: ["Propositional logic", "First order logic"], bank: ["Propositional and First-Order Quantifier Logic"] },
    { name: "Set theory & algebra", items: ["Sets", "Relations", "Functions", "Partial orders", "Lattices", "Monoids", "Groups"], bank: ["Sets, Relations, Functions, Partial Orders, Lattices", "Algebraic Structures (Monoids, Groups)"] },
    { name: "Graphs", items: ["Connectivity", "Matching", "Colouring"], bank: ["Graph Theory (Connectivity, Paths, Cycles, Trees)", "Advanced Graph Bounds (Matching, Coloring Theorems)"] },
    { name: "Combinatorics", items: ["Counting", "Recurrence relations", "Generating functions"], bank: ["Combinatorics (Counting Rules, Summation Formulas)", "Recurrence Relations and Generating Functions"] },
  ] },
  { title: "Linear Algebra", group: "Engineering Mathematics", official: "CS Section 1", subjects: ["Linear Algebra"], units: [
    { name: "Matrices & linear systems", items: ["Matrices", "Determinants", "System of linear equations"], bank: ["Matrices, Determinants, & Linear Equation Systems"] },
    { name: "Eigenvalues & eigenvectors", items: ["Eigenvalues", "Eigenvectors"], bank: ["Eigenvalues and Eigenvectors"] },
    { name: "LU decomposition", items: ["LU decomposition"], bank: ["Matrix Factorization & LU Decomposition"] },
  ] },
  { title: "Calculus", group: "Engineering Mathematics", official: "CS Section 1", subjects: ["Calculus"], units: [
    { name: "Limits & continuity", items: ["Limits", "Continuity", "Differentiability"], bank: ["Limits, Continuity, and Differentiability"] },
    { name: "Maxima & minima", items: ["Maxima", "Minima"], bank: ["Maxima and Minima Optimization Bounds"] },
    { name: "Mean value theorem & integration", items: ["Mean value theorem", "Integration"], bank: ["Mean Value Theorems & Definite Integration"] },
  ] },
  { title: "Probability and Statistics", group: "Engineering Mathematics", official: "CS Section 1", subjects: ["Probability & Statistics"], units: [
    { name: "Random variables & distributions", items: ["Random variables", "Uniform", "Normal", "Exponential", "Poisson", "Binomial"], bank: ["Random Variables & Sampling Rules", "Continuous/Discrete Distributions (Uniform, Normal, Exponential)", "Standard Distributions (Poisson, Binomial)"] },
    { name: "Descriptive statistics", items: ["Mean", "Median", "Mode", "Standard deviation"], bank: [] },
    { name: "Conditional probability", items: ["Conditional probability", "Bayes theorem"], bank: ["Conditional Probability & Bayes Theorem"] },
  ] },

  // ── Core Computer Science (CS Sections 2–10) ──
  { title: "Digital Logic", group: "Core Computer Science", official: "CS Section 2", subjects: ["Digital Logic"], units: [
    { name: "Boolean algebra & minimization", items: ["Algebraic technique", "Karnaugh map", "Tabular method"], bank: ["Boolean Algebra, Minimization, K-Maps"] },
    { name: "Circuit design", items: ["Combinational circuits", "Sequential circuits"], bank: ["Combinational Logic (Multiplexers, Decoders, Adders)", "Sequential Circuits (Flip-Flops, Registers, Counters)"] },
    { name: "Number representation & arithmetic", items: ["Fixed point", "Floating point"], bank: ["Number Representations & Fixed/Floating Point Math"] },
  ] },
  { title: "Computer Organization and Architecture", group: "Core Computer Science", official: "CS Section 3", subjects: ["Computer Organization and Architecture (COA)"], units: [
    { name: "Instruction set", items: ["Instruction set", "Addressing modes"], bank: ["Machine Instructions & Addressing Modes"] },
    { name: "ALU & control unit", items: ["Design of ALU", "Hardwired control", "Microprogrammed control"], bank: ["ALU, Control Unit Design, Data-Path Operations"] },
    { name: "Memory interfacing & hierarchy", items: ["Performance", "Cache memory mapping"], bank: ["Memory Hierarchy (Direct/Associative Cache Mapping)", "Main Memory & Virtual Memory Mechanics"] },
    { name: "I/O interface", items: ["Interrupt", "DMA"], bank: ["I/O Interfaces (Interrupts & DMA Control Modes)"] },
    { name: "Pipelining", items: ["Instruction pipelining", "Pipeline hazards"], bank: ["Instruction Pipelining, Performance, Hazard Management"] },
  ] },
  { title: "Programming and Data Structures", group: "Core Computer Science", official: "CS Section 4", subjects: ["Programming in C", "Data Structures"], units: [
    { name: "Programming in C", items: ["C language", "Pointers & arrays"], bank: ["Data Types, Syntax, Control Structures, Loops", "Pointers, Multi-Dimensional Arrays, Structures", "Dynamic Memory Allocation & File Handling"] },
    { name: "Recursion", items: ["Recursion"], bank: ["Functions, Parameter Passing, Scope Rules, Recursion"] },
    { name: "Linear structures", items: ["Arrays", "Stacks", "Queues", "Linked lists"], bank: ["Abstract Data Types (ADTs), Stacks, Queues", "Linked Lists & Binary Trees"] },
    { name: "Trees, heaps & graphs", items: ["Trees", "Binary search trees", "Binary heaps", "Graphs"], bank: ["Binary Search Trees (BSTs) & Binary Heaps", "BSTs & Binary Heaps"] },
  ] },
  { title: "Algorithms", group: "Core Computer Science", official: "CS Section 5", subjects: ["Algorithms"], units: [
    { name: "Searching, sorting & hashing", items: ["Searching", "Sorting", "Hashing"], bank: ["Searching, Sorting, Hashing Mechanisms"] },
    { name: "Complexity", items: ["Asymptotic worst case time complexity", "Space complexity"], bank: ["Asymptotic Analysis (O, Omega, Theta Complexities)"] },
    { name: "Design techniques", items: ["Greedy", "Dynamic programming", "Divide-and-conquer"], bank: ["Greedy Approach & Divide-and-Conquer Designs", "Dynamic Programming Infrastructure", "Divide-and-Conquer Designs"] },
    { name: "Graph algorithms", items: ["Graph traversals", "Minimum spanning trees", "Shortest paths"], bank: ["Graph Traversals (BFS, DFS) & Single-Source Shortest Paths", "Minimum Spanning Trees (Prim/Kruskal Algorithms)"] },
  ] },
  { title: "Theory of Computation", group: "Core Computer Science", official: "CS Section 6", subjects: ["Theory of Computation (TOC)"], units: [
    { name: "Regular languages", items: ["Regular expressions", "Finite automata"], bank: ["Regular Expressions & Finite Automata (DFA/NFA Min)"] },
    { name: "Context-free languages", items: ["Context-free grammars", "Push-down automata"], bank: ["Context-Free Grammars & Push-Down Automata"] },
    { name: "Language properties", items: ["Regular and context-free languages", "Pumping lemma"], bank: ["Regular and Context-Free Languages & Pumping Lemma"] },
    { name: "Turing machines", items: ["Turing machines", "Undecidability"], bank: ["Turing Machines & Undecidability"] },
  ] },
  { title: "Compiler Design", group: "Core Computer Science", official: "CS Section 7", subjects: ["Compiler Design"], units: [
    { name: "Lexical analysis & parsing", items: ["Lexical analysis", "Parsing"], bank: ["Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)"] },
    { name: "Translation & runtime", items: ["Syntax-directed translation", "Runtime environments"], bank: ["Syntax-Directed Translation & Runtime Environments"] },
    { name: "Intermediate code & optimisation", items: ["Intermediate code generation", "Local optimisation"], bank: ["Intermediate Code Generation & Local Code Optimization"] },
    { name: "Data flow analyses", items: ["Constant propagation", "Liveness analysis", "Common sub expression elimination"], bank: ["Data Flow Analysis: Constant Propagation, Liveliness Analysis, Common Subexpression Elimination"] },
  ] },
  { title: "Operating System", group: "Core Computer Science", official: "CS Section 8", subjects: ["Operating Systems (OS)"], units: [
    { name: "Processes & threads", items: ["System calls", "Processes", "Threads", "Inter-process communication"], bank: ["System Calls, Processes, Threads, InterProcess Communication"] },
    { name: "Concurrency & synchronization", items: ["Concurrency", "Synchronization"], bank: ["Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)"] },
    { name: "Deadlock", items: ["Deadlock"], bank: ["Deadlock Prevention, Avoidance, Detection, Recovery"] },
    { name: "Scheduling", items: ["CPU scheduling", "I/O scheduling"], bank: ["CPU and I/O Scheduling"] },
    { name: "Memory management", items: ["Memory management", "Virtual memory"], bank: ["Memory Management and Virtual Memory"] },
    { name: "File systems", items: ["File systems"], bank: ["File Systems Operations & Disk Scheduling Optimization"] },
  ] },
  { title: "Databases", group: "Core Computer Science", official: "CS Section 9", subjects: ["Database Management Systems (DBMS)"], units: [
    { name: "ER model", items: ["ER-model"], bank: ["ER-Model"] },
    { name: "Relational model", items: ["Relational algebra", "Tuple calculus"], bank: ["Relational Models, Relational Algebra, Tuple Calculus"] },
    { name: "SQL", items: ["SQL"], bank: ["SQL Queries (DDL/DML, Joins, Aggregations)"] },
    { name: "Constraints & normal forms", items: ["Integrity constraints", "Normal forms"], bank: ["Integrity Constraints & Functional Dependencies", "Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)"] },
    { name: "File organization & indexing", items: ["File organization", "B and B+ trees"], bank: ["File Organization & Indexing (e.g., B and B+ Trees)"] },
    { name: "Transactions", items: ["Transactions", "Concurrency control"], bank: ["Transactions, Concurrency Control, Conflict Serializability"] },
  ] },
  { title: "Computer Networks", group: "Core Computer Science", official: "CS Section 10", subjects: ["Computer Networks (CN)"], units: [
    { name: "Layering & switching", items: ["Principles of layering", "Circuit, packet and virtual circuit switching", "Performance metrics"], bank: ["OSI & TCP/IP Protocol Layers"] },
    { name: "Data link layer", items: ["Error detection", "Medium Access Control", "Ethernet"], bank: ["Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)"] },
    { name: "Routing", items: ["Distance vector routing", "Link state routing"], bank: ["Routing Protocols (Shortest Path, Flooding, Distance Vector, Link State Routing)"] },
    { name: "IPv4", items: ["Fragmentation", "CIDR notation", "Network Address Translation"], bank: ["Fragmentation and IP Addressing (IPv4, IPv6, CIDR, Basics of IP support Protocols (ARP, DHCP, ICMP), NAT)"] },
    { name: "TCP", items: ["Flow control", "Congestion control", "Socket API"], bank: ["Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)"] },
    { name: "Application layer", items: ["DNS", "HTTP"], bank: ["Application Layer (DNS, SMTP, HTTP, FTP, Email) & Security"] },
  ] },
];
