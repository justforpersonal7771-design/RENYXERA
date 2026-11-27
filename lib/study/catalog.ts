/**
 * The study shelf (GATE CS). One book per subject, chapters in teaching order (blueprint §6 build order).
 * Status is honest: only chapters whose content exists in content/study are "ready"; everything else is "writing".
 * No reading times, progress or counts are shown that the app cannot measure.
 */
export type ShelfChapter = { id: string; title: string; href?: string; ready?: string; /** Regex (source) matching question-bank topic names, when the title words do not. */ match?: string; /** Section heading shown above this chapter in the contents (when it starts a new section). */ part?: string };
export type ShelfBook = { id: string; title: string; short: string; cloth: string; ink: string; band: "core" | "maths" | "aptitude"; chapters: ShelfChapter[]; paper?: string; dark?: string; tint?: string };

export const CS_SHELF: ShelfBook[] = [
  { id: "os", title: "Operating Systems", short: "OS", tint: "rose", cloth: "#E8C5B8", ink: "#1B1917", paper: "#7B1E22", dark: "#7B1E22", band: "core", chapters: [
    { id: "deadlock", title: "Deadlock", href: "/study/deadlock", ready: "6 topics ready, free" }, { id: "process", title: "Processes and threads", href: "/study/processes", ready: "7 topics ready" }, { id: "sched", title: "CPU scheduling", href: "/study/scheduling", ready: "6 topics ready" },
    { id: "sync", title: "Synchronisation", href: "/study/synchronisation", ready: "7 topics ready" }, { id: "memory", title: "Memory management", href: "/study/memory", ready: "6 topics ready" }, { id: "vm", title: "Virtual memory", href: "/study/virtual-memory", ready: "5 topics ready" },
    { id: "fs", title: "File systems and disk", href: "/study/files", ready: "7 topics ready" },
  ] },
  { id: "dbms", title: "Databases", short: "DBMS", tint: "mint", cloth: "#C4D9CC", ink: "#1B1917", paper: "#1F4D3A", dark: "#1F4D3A", band: "core", chapters: [
    { id: "er", title: "ER model", href: "/study/er-model", ready: "3 topics ready" }, { id: "relational", title: "Relational model and integrity constraints", href: "/study/relational-model", ready: "2 topics ready" }, { id: "ra", title: "Relational algebra and tuple calculus", href: "/study/relational-algebra", ready: "3 topics ready" },
    { id: "sql", title: "SQL", href: "/study/sql", ready: "4 topics ready" }, { id: "norm", title: "Functional dependencies and normal forms", href: "/study/normal-forms", ready: "4 topics ready" }, { id: "index", title: "File organisation and indexing (B and B+ trees)", href: "/study/indexing", ready: "3 topics ready" },
    { id: "txn", title: "Transactions", href: "/study/transactions", ready: "3 topics ready" }, { id: "cc", title: "Concurrency control", href: "/study/concurrency-control", ready: "4 topics ready" },
  ] },
  { id: "cn", title: "Computer Networks", short: "CN", tint: "butter", cloth: "#EBD8B0", ink: "#1B1917", paper: "#B07A1E", dark: "#B07A1E", band: "core", chapters: [
    { id: "layers", title: "Layering and switching", match: "OSI|Protocol Layers", href: "/study/layering", ready: "3 topics ready" }, { id: "dll", title: "Data link and MAC", href: "/study/data-link", ready: "6 topics ready" }, { id: "ip", title: "IP addressing and routing", href: "/study/ip", ready: "6 topics ready" },
    { id: "tcp", title: "TCP, UDP and flow control", href: "/study/transport", ready: "5 topics ready" }, { id: "app", title: "Application layer", href: "/study/application", ready: "5 topics ready" },
  ] },
  { id: "algo", title: "Algorithms", short: "Algo", tint: "peri", cloth: "#D9D2C2", ink: "#1B1917", paper: "#22324F", dark: "#22324F", band: "core", chapters: [
    { id: "asym", title: "Asymptotics and recurrences", href: "/study/asymptotics", ready: "3 topics ready" }, { id: "sort", title: "Searching and sorting", href: "/study/sorting", ready: "5 topics ready" }, { id: "hash", title: "Hashing", href: "/study/hashing", ready: "3 topics ready" },
    { id: "dc", title: "Divide and conquer", href: "/study/divide-conquer", ready: "3 topics ready" }, { id: "greedy", title: "Greedy", href: "/study/greedy", ready: "3 topics ready" }, { id: "dp", title: "Dynamic programming", href: "/study/dynamic-programming", ready: "4 topics ready" },
    { id: "graphs", title: "Graph traversals", href: "/study/graph-traversals", ready: "3 topics ready" }, { id: "mst", title: "Minimum spanning trees", href: "/study/mst", ready: "3 topics ready" }, { id: "sp", title: "Shortest paths", href: "/study/shortest-paths", ready: "3 topics ready" },
  ] },
  { id: "pds", title: "Programming and Data Structures", short: "P & DS", tint: "peach", cloth: "#E6CDB4", ink: "#1B1917", paper: "#9A3B1F", dark: "#9A3B1F", band: "core", chapters: [
    { id: "c", part: "Section 1 · Programming in C", title: "1. Foundations: types, operators, loops", href: "/study/c-programming", ready: "6 chapters ready", match: "Data Types|Control Structures" },
    { id: "c2", title: "2. Functions, recursion, arrays", href: "/study/c-functions", ready: "5 chapters ready", match: "Functions|Parameter Passing|Recursion|Arrays" },
    { id: "c3", title: "3. Pointers, strings, memory", href: "/study/c-pointers", ready: "6 chapters ready", match: "Pointers|Dynamic Memory|Strings|Structures" },
    { id: "c4", title: "4. Reading code and practice", href: "/study/c-reading", ready: "5 chapters ready", match: "Preprocessor|Files|programming in c" },
    { id: "ds-book", part: "Section 2 · Data Structures", title: "Data Structures: from arrays to graphs", href: "/study/data-structures", ready: "3 chapters ready", match: "Linked Lists|Stacks|Queues|Binary Search Trees|Binary Heaps|Abstract Data Types|data structures" },
    { id: "recursion", title: "Recursion", href: "/study/recursion", ready: "3 topics ready" }, { id: "lists", title: "Arrays", href: "/study/arrays", ready: "3 topics ready" },
    { id: "stackq", title: "Stacks and queues", href: "/study/stacks-queues", ready: "4 topics ready" }, { id: "linked", title: "Linked lists", href: "/study/linked-lists", ready: "3 topics ready" }, { id: "trees", title: "Trees and binary search trees", href: "/study/trees", ready: "4 topics ready" },
    { id: "heaps", title: "Binary heaps", href: "/study/heaps", ready: "3 topics ready" }, { id: "graph-ds", title: "Graphs: representation", href: "/study/graph-representation", ready: "3 topics ready" },
  ] },
  { id: "toc", title: "Theory of Computation", short: "TOC", tint: "sky", cloth: "#D6CFE6", ink: "#1B1917", paper: "#155E63", dark: "#155E63", band: "core", chapters: [
    { id: "regular", title: "Regular expressions and finite automata", href: "/study/finite-automata", ready: "4 topics ready", match: "Finite Automata|Regular Expression|Regular Language|DFA|NFA" }, { id: "reg-props", title: "Regular languages: closure and pumping lemma", href: "/study/regular-properties", ready: "3 topics ready", match: "Regular Language|Pumping|Closure" }, { id: "cfl", title: "Context-free grammars and PDAs", href: "/study/context-free", ready: "3 topics ready", match: "Context-free|Grammar|Pushdown|PDA|Ambig" },
    { id: "cfl-props", title: "Context-free languages: closure and pumping lemma", href: "/study/context-free-properties", ready: "3 topics ready", match: "Context-free|Pumping|Closure" }, { id: "tm", title: "Turing machines", href: "/study/turing-machines", ready: "3 topics ready", match: "Turing|Recursive|Recursively" }, { id: "undec", title: "Decidability and undecidability", href: "/study/decidability", ready: "3 topics ready", match: "Undecidab|Decidab|Halting|Reduction|Rice" },
  ] },
  { id: "cd", title: "Compiler Design", short: "Compiler", tint: "lilac", cloth: "#D8C7B5", ink: "#1B1917", paper: "#4A2C2A", dark: "#4A2C2A", band: "core", chapters: [
    { id: "lex", title: "Lexical analysis" }, { id: "parse", title: "Top-down parsing" }, { id: "lr", title: "Bottom-up parsing (LR, SLR, LALR)" },
    { id: "sdt", title: "Syntax-directed translation" }, { id: "runtime", title: "Runtime environments" }, { id: "icg", title: "Intermediate code generation" },
    { id: "codegen", title: "Local optimisation" }, { id: "dfa", title: "Data-flow analysis" },
  ] },
  { id: "coa", title: "Computer Organisation", short: "COA", tint: "butter", cloth: "#E3D3A8", ink: "#1B1917", paper: "#6B5A1E", dark: "#6B5A1E", band: "core", chapters: [
    { id: "isa", title: "Machine instructions and addressing modes", href: "/study/instructions-addressing", ready: "3 topics ready", match: "Instruction|Addressing" }, { id: "datapath", title: "ALU, data path and control unit", href: "/study/alu-datapath-control", ready: "3 topics ready", match: "ALU|Data.?path|Control Unit" }, { id: "pipeline", title: "Instruction pipelining and hazards", href: "/study/pipelining", ready: "3 topics ready", match: "Pipelin|Hazard" },
    { id: "memory-h", title: "Cache memory", href: "/study/cache-memory", ready: "3 topics ready", match: "Cache|Memory Hierarchy" }, { id: "mainmem", title: "Main memory and secondary storage", href: "/study/main-memory", ready: "4 topics ready", match: "Main Memory|DRAM|Disk|RAID|Secondary" }, { id: "io", title: "I/O interface: interrupts and DMA", href: "/study/io-interrupts-dma", ready: "4 topics ready", match: "Interrupt|DMA|I/O" },
  ] },
  { id: "dl", title: "Digital Logic", short: "Digital", tint: "mint", cloth: "#C9D6C2", ink: "#1B1917", paper: "#2E4A2A", dark: "#2E4A2A", band: "core", chapters: [
    { id: "bool", title: "Boolean algebra" }, { id: "kmap", title: "Minimisation" }, { id: "comb", title: "Combinational circuits" },
    { id: "seq", title: "Sequential circuits" }, { id: "num", title: "Number representation" }, { id: "arith", title: "Computer arithmetic: fixed and floating point" },
  ] },
  { id: "dm", title: "Discrete Mathematics", short: "Discrete", tint: "rose", cloth: "#E4C9D2", ink: "#1B1917", paper: "#6A1B3A", dark: "#6A1B3A", band: "maths", chapters: [
    { id: "logic", title: "Propositional logic", href: "/study/logic", ready: "4 topics ready" }, { id: "fol", title: "First-order logic", href: "/study/first-order-logic", ready: "3 topics ready" }, { id: "sets", title: "Sets, relations and functions", href: "/study/sets-relations", ready: "4 topics ready" },
    { id: "poset", title: "Partial orders and lattices", href: "/study/posets", ready: "3 topics ready" }, { id: "groups", title: "Monoids and groups", href: "/study/groups", ready: "3 topics ready" }, { id: "graph-t", title: "Graph theory: connectivity, matching, colouring", href: "/study/graph-theory", ready: "6 topics ready" },
    { id: "combi", title: "Counting and combinatorics", href: "/study/counting", ready: "4 topics ready" }, { id: "recur", title: "Recurrences and generating functions", href: "/study/recurrences", ready: "3 topics ready" },
  ] },
  { id: "la", title: "Linear Algebra", short: "Lin. Alg.", tint: "peach", cloth: "#E9D9B8", ink: "#1B1917", paper: "#8C5A12", dark: "#8C5A12", band: "maths", chapters: [
    { id: "matrices", title: "Matrices and determinants" }, { id: "systems", title: "Systems of linear equations" }, { id: "eigen", title: "Eigenvalues and eigenvectors" },
    { id: "lu", title: "LU decomposition" },
  ] },
  { id: "prob", title: "Probability and Statistics", short: "Probability", tint: "sky", cloth: "#CCDACF", ink: "#1B1917", paper: "#1E5A4A", dark: "#1E5A4A", band: "maths", chapters: [
    { id: "prob", title: "Probability, conditional probability and Bayes" }, { id: "rv", title: "Random variables" }, { id: "dist", title: "Distributions: uniform, normal, exponential, Poisson, binomial" },
    { id: "stats", title: "Mean, median, mode and standard deviation" },
  ] },
  { id: "calc", title: "Calculus", short: "Calculus", tint: "lilac", cloth: "#E2CDBA", ink: "#1B1917", paper: "#5A2E1A", dark: "#5A2E1A", band: "maths", chapters: [
    { id: "limits", title: "Limits, continuity and differentiability" }, { id: "maxmin", title: "Maxima and minima" }, { id: "mvt", title: "Mean value theorem" },
    { id: "integrals", title: "Integration" },
  ] },
  { id: "verbal", title: "Verbal Aptitude", short: "Verbal", tint: "peri", cloth: "#EBC9B8", ink: "#1B1917", band: "aptitude", chapters: [
    { id: "articles", title: "Articles and determiners" }, { id: "adj", title: "Adjectives and adverbs" }, { id: "prep", title: "Prepositions" },
    { id: "conj", title: "Conjunctions" }, { id: "agree", title: "Subject–verb agreement" }, { id: "grammar", title: "Tenses and other parts of speech" },
    { id: "vocab", title: "Vocabulary: words in context" }, { id: "idioms", title: "Idioms and phrases" }, { id: "reading", title: "Reading comprehension" },
    { id: "narrative", title: "Narrative sequencing" }, { id: "sentence", title: "Sentence completion", match: "Narrative Sequencing" },
  ] },
  { id: "quant", title: "Quantitative Aptitude", short: "Quant", tint: "mint", cloth: "#C9D6C2", ink: "#1B1917", band: "aptitude", chapters: [
    { id: "numbers", title: "Number system" }, { id: "percent", title: "Percentages" }, { id: "ratio", title: "Ratio and proportion" },
    { id: "avg", title: "Averages and mixtures" }, { id: "profit", title: "Profit, loss and interest" }, { id: "time", title: "Time, speed and distance" },
    { id: "work", title: "Time and work" }, { id: "powers", title: "Powers, exponents and logarithms" }, { id: "pnc", title: "Permutations and combinations" },
    { id: "series", title: "Series and progressions" }, { id: "qprob", title: "Probability" }, { id: "qstats", title: "Elementary statistics" },
    { id: "mensur", title: "Mensuration" }, { id: "geometry", title: "Geometry" }, { id: "data", title: "Data interpretation: tables and bar graphs" },
    { id: "data2", title: "Data interpretation: pie charts, line graphs, 2D and 3D plots, maps" }, { id: "estimate", title: "Numerical estimation" },
  ] },
  { id: "analytical", title: "Analytical Aptitude", short: "Analytical", tint: "butter", cloth: "#EBD8B0", ink: "#1B1917", band: "aptitude", chapters: [
    { id: "deduction", title: "Deduction: syllogisms and statements" }, { id: "induction", title: "Induction" }, { id: "analogy", title: "Analogy" },
    { id: "logic", title: "Numerical relations and reasoning" }, { id: "blood", title: "Blood relations and directions" }, { id: "arrange", title: "Seating arrangements" },
    { id: "puzzles", title: "Puzzles and grouping" }, { id: "critical", title: "Critical reasoning" },
  ] },
  { id: "spatial", title: "Spatial Aptitude", short: "Spatial", tint: "rose", cloth: "#E4C9D2", ink: "#1B1917", band: "aptitude", chapters: [
    { id: "transform", title: "Translation and scaling" }, { id: "shapes", title: "Rotation" }, { id: "mirror", title: "Mirror and water images" },
    { id: "assemble", title: "Assembling and grouping shapes" }, { id: "folding", title: "Paper folding" }, { id: "cutting", title: "Paper cutting and punching" },
    { id: "patterns", title: "Patterns in two dimensions" }, { id: "patterns3", title: "Patterns in three dimensions: cubes, dice, views" },
  ] },
];

/** The book colour for a chapter page (/study/<chapter>), or null elsewhere. */
export function bookTintFor(path: string): string | null {
  if (!path.startsWith("/study/")) return null;
  const b = CS_SHELF.find((x) => x.chapters.some((c) => c.href === path));
  return b?.tint ?? null;
}
