/**
 * The study shelf (GATE CS). One book per subject, chapters in teaching order (blueprint §6 build order).
 * Status is honest: only chapters whose content exists in content/study are "ready"; everything else is "writing".
 * No reading times, progress or counts are shown that the app cannot measure.
 */
export type ShelfChapter = { id: string; title: string; href?: string; ready?: string };
export type ShelfBook = { id: string; title: string; short: string; cloth: string; ink: string; band: "core" | "maths" | "aptitude"; chapters: ShelfChapter[] };

export const CS_SHELF: ShelfBook[] = [
  { id: "os", title: "Operating Systems", short: "OS", cloth: "#7a2e2a", ink: "#f3e3c3", band: "core", chapters: [
    { id: "deadlock", title: "Deadlock", href: "/study/deadlock", ready: "Topic 1 of 6 ready, free" },
    { id: "process", title: "Processes and threads" }, { id: "sched", title: "CPU scheduling" }, { id: "sync", title: "Synchronisation" },
    { id: "memory", title: "Memory management" }, { id: "vm", title: "Virtual memory" }, { id: "fs", title: "File systems and disk" },
  ] },
  { id: "dbms", title: "Databases", short: "DBMS", cloth: "#2f5d46", ink: "#efe6cf", band: "core", chapters: [
    { id: "er", title: "ER model" }, { id: "relational", title: "Relational algebra and SQL" }, { id: "norm", title: "Normalisation" },
    { id: "txn", title: "Transactions and concurrency" }, { id: "index", title: "Indexing and B+ trees" },
  ] },
  { id: "cn", title: "Computer Networks", short: "CN", cloth: "#c8962e", ink: "#2a1d10", band: "core", chapters: [
    { id: "layers", title: "Layering and switching" }, { id: "dll", title: "Data link and MAC" }, { id: "ip", title: "IP addressing and routing" },
    { id: "tcp", title: "TCP, UDP and flow control" }, { id: "app", title: "Application layer" },
  ] },
  { id: "algo", title: "Algorithms", short: "Algo", cloth: "#4a5560", ink: "#f0ebe0", band: "core", chapters: [
    { id: "asym", title: "Asymptotics and recurrences" }, { id: "dc", title: "Divide and conquer" }, { id: "greedy", title: "Greedy" },
    { id: "dp", title: "Dynamic programming" }, { id: "graphs", title: "Graph algorithms" }, { id: "sort", title: "Sorting and searching" },
  ] },
  { id: "pds", title: "Programming and Data Structures", short: "P & DS", cloth: "#b5583a", ink: "#f6ead6", band: "core", chapters: [
    { id: "c", title: "Programming in C" }, { id: "recursion", title: "Recursion" }, { id: "lists", title: "Arrays, stacks, queues, lists" },
    { id: "trees", title: "Trees and heaps" }, { id: "hashing", title: "Hashing" },
  ] },
  { id: "toc", title: "Theory of Computation", short: "TOC", cloth: "#2c6e6a", ink: "#eaf0e8", band: "core", chapters: [
    { id: "regular", title: "Regular languages" }, { id: "cfl", title: "Context-free languages" }, { id: "tm", title: "Turing machines and decidability" },
  ] },
  { id: "cd", title: "Compiler Design", short: "Compiler", cloth: "#5b3a29", ink: "#f2e2c8", band: "core", chapters: [
    { id: "lex", title: "Lexical analysis" }, { id: "parse", title: "Parsing" }, { id: "sdt", title: "Syntax-directed translation" }, { id: "codegen", title: "Code generation and optimisation" },
  ] },
  { id: "coa", title: "Computer Organisation", short: "COA", cloth: "#8a6d3b", ink: "#1f160c", band: "core", chapters: [
    { id: "isa", title: "Instructions and addressing" }, { id: "pipeline", title: "Pipelining" }, { id: "memory-h", title: "Memory hierarchy and cache" }, { id: "io", title: "I/O and interrupts" },
  ] },
  { id: "dl", title: "Digital Logic", short: "Digital", cloth: "#3d4a3a", ink: "#ecebd8", band: "core", chapters: [
    { id: "bool", title: "Boolean algebra and minimisation" }, { id: "comb", title: "Combinational circuits" }, { id: "seq", title: "Sequential circuits" }, { id: "num", title: "Number systems" },
  ] },
  { id: "dm", title: "Discrete Mathematics", short: "Discrete", cloth: "#6b2f45", ink: "#f2e4dc", band: "maths", chapters: [
    { id: "logic", title: "Logic" }, { id: "sets", title: "Sets, relations, functions" }, { id: "combi", title: "Combinatorics" }, { id: "graph-t", title: "Graph theory" }, { id: "groups", title: "Groups" },
  ] },
  { id: "la", title: "Linear Algebra", short: "Lin. Alg.", cloth: "#a3742c", ink: "#1f160c", band: "maths", chapters: [{ id: "matrices", title: "Matrices and systems" }, { id: "eigen", title: "Eigenvalues" }] },
  { id: "prob", title: "Probability and Statistics", short: "Probability", cloth: "#46604f", ink: "#eef0e4", band: "maths", chapters: [{ id: "prob", title: "Probability" }, { id: "rv", title: "Random variables and distributions" }] },
  { id: "calc", title: "Calculus", short: "Calculus", cloth: "#7d5a3a", ink: "#f4e8d4", band: "maths", chapters: [{ id: "limits", title: "Limits, continuity, derivatives" }, { id: "integrals", title: "Integration" }] },
  { id: "ga", title: "General Aptitude", short: "Aptitude", cloth: "#9a3b2e", ink: "#f6e7d2", band: "aptitude", chapters: [
    { id: "verbal", title: "Verbal" }, { id: "quant", title: "Quantitative" }, { id: "analytical", title: "Analytical" }, { id: "spatial", title: "Spatial" },
  ] },
];
