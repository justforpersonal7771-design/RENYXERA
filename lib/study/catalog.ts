/**
 * The study shelf (GATE CS). One book per subject, chapters in teaching order (blueprint §6 build order).
 * Status is honest: only chapters whose content exists in content/study are "ready"; everything else is "writing".
 * No reading times, progress or counts are shown that the app cannot measure.
 */
export type ShelfChapter = { id: string; title: string; href?: string; ready?: string };
export type ShelfBook = { id: string; title: string; short: string; cloth: string; ink: string; band: "core" | "maths" | "aptitude"; chapters: ShelfChapter[]; paper?: string; dark?: string; tint?: string };

export const CS_SHELF: ShelfBook[] = [
  { id: "os", title: "Operating Systems", short: "OS", tint: "rose", cloth: "#E8C5B8", ink: "#1B1917", paper: "#7B1E22", dark: "#7B1E22", band: "core", chapters: [
    { id: "deadlock", title: "Deadlock", href: "/study/deadlock", ready: "6 topics ready, free" },
    { id: "process", title: "Processes and threads", href: "/study/processes", ready: "2 of 4 topics ready" }, { id: "sched", title: "CPU scheduling" }, { id: "sync", title: "Synchronisation" },
    { id: "memory", title: "Memory management" }, { id: "vm", title: "Virtual memory" }, { id: "fs", title: "File systems and disk" },
  ] },
  { id: "dbms", title: "Databases", short: "DBMS", tint: "mint", cloth: "#C4D9CC", ink: "#1B1917", paper: "#1F4D3A", dark: "#1F4D3A", band: "core", chapters: [
    { id: "er", title: "ER model" }, { id: "relational", title: "Relational algebra and SQL" }, { id: "norm", title: "Normalisation" },
    { id: "txn", title: "Transactions and concurrency" }, { id: "index", title: "Indexing and B+ trees" },
  ] },
  { id: "cn", title: "Computer Networks", short: "CN", tint: "butter", cloth: "#EBD8B0", ink: "#1B1917", paper: "#B07A1E", dark: "#B07A1E", band: "core", chapters: [
    { id: "layers", title: "Layering and switching" }, { id: "dll", title: "Data link and MAC" }, { id: "ip", title: "IP addressing and routing" },
    { id: "tcp", title: "TCP, UDP and flow control" }, { id: "app", title: "Application layer" },
  ] },
  { id: "algo", title: "Algorithms", short: "Algo", tint: "peri", cloth: "#D9D2C2", ink: "#1B1917", paper: "#22324F", dark: "#22324F", band: "core", chapters: [
    { id: "asym", title: "Asymptotics and recurrences" }, { id: "dc", title: "Divide and conquer" }, { id: "greedy", title: "Greedy" },
    { id: "dp", title: "Dynamic programming" }, { id: "graphs", title: "Graph algorithms" }, { id: "sort", title: "Sorting and searching" },
  ] },
  { id: "pds", title: "Programming and Data Structures", short: "P & DS", tint: "peach", cloth: "#E6CDB4", ink: "#1B1917", paper: "#9A3B1F", dark: "#9A3B1F", band: "core", chapters: [
    { id: "c", title: "Programming in C" }, { id: "recursion", title: "Recursion" }, { id: "lists", title: "Arrays, stacks, queues, lists" },
    { id: "trees", title: "Trees and heaps" }, { id: "hashing", title: "Hashing" },
  ] },
  { id: "toc", title: "Theory of Computation", short: "TOC", tint: "sky", cloth: "#D6CFE6", ink: "#1B1917", paper: "#155E63", dark: "#155E63", band: "core", chapters: [
    { id: "regular", title: "Regular languages" }, { id: "cfl", title: "Context-free languages" }, { id: "tm", title: "Turing machines and decidability" },
  ] },
  { id: "cd", title: "Compiler Design", short: "Compiler", tint: "lilac", cloth: "#D8C7B5", ink: "#1B1917", paper: "#4A2C2A", dark: "#4A2C2A", band: "core", chapters: [
    { id: "lex", title: "Lexical analysis" }, { id: "parse", title: "Parsing" }, { id: "sdt", title: "Syntax-directed translation" }, { id: "codegen", title: "Code generation and optimisation" },
  ] },
  { id: "coa", title: "Computer Organisation", short: "COA", tint: "butter", cloth: "#E3D3A8", ink: "#1B1917", paper: "#6B5A1E", dark: "#6B5A1E", band: "core", chapters: [
    { id: "isa", title: "Instructions and addressing" }, { id: "pipeline", title: "Pipelining" }, { id: "memory-h", title: "Memory hierarchy and cache" }, { id: "io", title: "I/O and interrupts" },
  ] },
  { id: "dl", title: "Digital Logic", short: "Digital", tint: "mint", cloth: "#C9D6C2", ink: "#1B1917", paper: "#2E4A2A", dark: "#2E4A2A", band: "core", chapters: [
    { id: "bool", title: "Boolean algebra and minimisation" }, { id: "comb", title: "Combinational circuits" }, { id: "seq", title: "Sequential circuits" }, { id: "num", title: "Number systems" },
  ] },
  { id: "dm", title: "Discrete Mathematics", short: "Discrete", tint: "rose", cloth: "#E4C9D2", ink: "#1B1917", paper: "#6A1B3A", dark: "#6A1B3A", band: "maths", chapters: [
    { id: "logic", title: "Logic" }, { id: "sets", title: "Sets, relations, functions" }, { id: "combi", title: "Combinatorics" }, { id: "graph-t", title: "Graph theory" }, { id: "groups", title: "Groups" },
  ] },
  { id: "la", title: "Linear Algebra", short: "Lin. Alg.", tint: "peach", cloth: "#E9D9B8", ink: "#1B1917", paper: "#8C5A12", dark: "#8C5A12", band: "maths", chapters: [{ id: "matrices", title: "Matrices and systems" }, { id: "eigen", title: "Eigenvalues" }] },
  { id: "prob", title: "Probability and Statistics", short: "Probability", tint: "sky", cloth: "#CCDACF", ink: "#1B1917", paper: "#1E5A4A", dark: "#1E5A4A", band: "maths", chapters: [{ id: "prob", title: "Probability" }, { id: "rv", title: "Random variables and distributions" }] },
  { id: "calc", title: "Calculus", short: "Calculus", tint: "lilac", cloth: "#E2CDBA", ink: "#1B1917", paper: "#5A2E1A", dark: "#5A2E1A", band: "maths", chapters: [{ id: "limits", title: "Limits, continuity, derivatives" }, { id: "integrals", title: "Integration" }] },
  { id: "verbal", title: "Verbal Aptitude", short: "Verbal", tint: "peri", cloth: "#EBC9B8", ink: "#1B1917", band: "aptitude", chapters: [
    { id: "grammar", title: "Grammar and usage" }, { id: "vocab", title: "Vocabulary and word meaning" }, { id: "reading", title: "Reading comprehension" }, { id: "sentence", title: "Sentence completion and ordering" },
  ] },
  { id: "quant", title: "Quantitative Aptitude", short: "Quant", tint: "mint", cloth: "#C9D6C2", ink: "#1B1917", band: "aptitude", chapters: [
    { id: "numbers", title: "Numbers and percentages" }, { id: "ratio", title: "Ratio, mixtures and averages" }, { id: "time", title: "Time, speed and work" }, { id: "data", title: "Data interpretation" },
  ] },
  { id: "analytical", title: "Analytical Aptitude", short: "Analytical", tint: "butter", cloth: "#EBD8B0", ink: "#1B1917", band: "aptitude", chapters: [
    { id: "logic", title: "Logical reasoning" }, { id: "deduction", title: "Deduction and induction" }, { id: "arrange", title: "Arrangements and puzzles" },
  ] },
  { id: "spatial", title: "Spatial Aptitude", short: "Spatial", tint: "rose", cloth: "#E4C9D2", ink: "#1B1917", band: "aptitude", chapters: [
    { id: "shapes", title: "Shapes, rotation and mirror images" }, { id: "folding", title: "Paper folding and cutting" }, { id: "patterns", title: "Patterns and figure series" },
  ] },
];
