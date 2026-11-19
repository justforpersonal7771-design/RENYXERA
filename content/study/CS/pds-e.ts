import type { Chapter, Topic } from "@/lib/study/schema";

/**
 * Programming and Data Structures → Graphs: representation. Numbers from lib/study/pds.ts, checked by script:
 * Undirected A-B, A-C, B-D, C-D, D-E: degrees A2 B2 C2 D3 E1, 10 list entries (2E), 25 matrix cells.
 * BFS from A: A B C D E (levels A0 B1 C1 D2 E3); DFS: A B D C E with times A 1/10, B 2/9, D 3/8, C 4/5, E 6/7; back edge C–A.
 * Directed A>B, B>C, C>A, A>D, D>C: BFS A B D C; DFS A B C D; edges A→B tree, B→C tree, C→A back, A→D tree, D→C cross.
 * V = 1000, E = 5000: visiting all edges ≈ 1 000 000 steps with a matrix vs 6000 with lists; space 10⁶ vs 6000.
 */
const DS = "/topics/data-structures";

const reps: Topic = {
  id: "cs.pds.graph.rep",
  title: "Adjacency matrix, adjacency list and other representations",
  blocks: [
    { type: "hook", text: "A road map of 1000 towns with 5000 roads needs a million matrix cells but only 6000 list entries. Choosing a graph representation decides the running time of every algorithm that follows." },
    { type: "objectives", items: ["Build adjacency matrices and lists for directed and undirected graphs.", "Compute space and the cost of basic queries in each.", "Use the handshake lemma and degree facts read from a representation."] },
    { type: "intuition", paras: ["An adjacency matrix is a V × V table with a 1 at (u, v) if the edge exists. Edge lookup is O(1); listing u's neighbours means scanning a whole row, O(V). Space is Θ(V²) however few edges there are.", "An adjacency list keeps, for each vertex, a list of its neighbours. Space is Θ(V + E): each undirected edge appears twice, each directed edge once. Listing neighbours costs O(deg u); checking a specific edge costs O(deg u).", "Dense graphs (E close to V²) suit matrices; sparse graphs (E close to V) suit lists. Most real graphs are sparse."], analogyLimit: "A matrix is a mileage chart listing every pair of cities; a list is each city's own page of direct roads." },
    { type: "definition", name: "Representations", text: "For V vertices and E edges:", items: ["Matrix: Θ(V²) space; edge test O(1); neighbours O(V).", "List: Θ(V + E) space; edge test O(deg u); neighbours O(deg u).", "Undirected: matrix symmetric; list has 2E entries. Directed: E entries.", "Handshake lemma: Σ deg(v) = 2E (undirected); Σ in = Σ out = E (directed).", "Incidence matrix: V × E, one column per edge."] },
    { type: "deep", sections: [
      { h: "Reading facts from a matrix", points: ["Row sum = out-degree; column sum = in-degree.", "Diagonal 1s are self-loops.", "A² (matrix square) counts walks of length 2: (A²)[u][v] = number of u → w → v paths.", "Transpose = reverse every edge."], paras: [] },
      { h: "Weighted graphs", paras: ["Store the weight instead of 1 (with ∞ or a sentinel for no edge) in a matrix, or (neighbour, weight) pairs in a list. Floyd–Warshall uses matrices; Dijkstra and Prim on sparse graphs use lists with a heap."] },
      { h: "Edge lists and compressed forms", paras: ["An edge list (array of pairs) is the simplest format, ideal for Kruskal's algorithm, which sorts edges. CSR (offsets plus a neighbour array) packs adjacency lists contiguously for speed."] },
      { h: "Counting edges", paras: ["A simple undirected graph has at most V(V − 1)/2 edges; a simple directed graph at most V(V − 1). The number of simple undirected graphs on V labelled vertices is 2^(V(V−1)/2)."] },
    ] },
    { type: "walkthrough", steps: ["List the vertices in order.", "For each edge set the matrix cell (both cells if undirected) and append to the lists.", "Degrees: row sums or list lengths.", "Check: degree sum = 2E undirected, list entries = 2E."], prompt: { q: "List entries for an undirected graph with 7 edges?", a: "14." } },
    { type: "figure", id: "mat", caption: "Undirected graph A-B, A-C, B-D, C-D, D-E.", alt: "Symmetric matrix; degrees 2, 2, 2, 3, 1.", fig: { kind: "matrix", title: "Adjacency matrix", cols: ["A", "B", "C", "D", "E"], rows: [{ label: "A", cells: [0, 1, 1, 0, 0] }, { label: "B", cells: [1, 0, 0, 1, 0] }, { label: "C", cells: [1, 0, 0, 1, 0] }, { label: "D", cells: [0, 1, 1, 0, 1], hl: true }, { label: "E", cells: [0, 0, 0, 1, 0] }] } },
    { type: "example", id: "ex1", level: "gate", title: "Building both representations", given: "Undirected edges A-B, A-C, B-D, C-D, D-E.", find: "Degrees, list entries, matrix size.",
      steps: [{ say: "Degrees: A 2, B 2, C 2, D 3, E 1." }, { say: "Sum 10 = 2E; lists hold 10 entries.", result: "10 entries" }, { say: "Matrix 5 × 5.", result: "25 cells" }],
      answer: "Degrees 2, 2, 2, 3, 1; 10 list entries; 25 matrix cells.",
      check: "The matrix is symmetric with 10 ones." },
    { type: "figure", id: "dense", for: "ex2", caption: "Sparse graph: V = 1000, E = 5000.", alt: "Matrix 10⁶ cells vs list 6000 entries.", fig: { kind: "matrix", title: "Space", cols: ["Units"], rows: [{ label: "Matrix V²", cells: ["1 000 000"] }, { label: "List V + E", cells: ["6 000"], hl: true }] } },
    { type: "example", id: "ex2", level: "gate", title: "Choosing a representation", given: "V = 1000, E = 5000 (directed).", find: "Space of each, and the cost of visiting all edges.",
      steps: [{ say: "Matrix: 10⁶ cells; scanning all of them costs 10⁶." }, { say: "List: 1000 heads + 5000 entries.", result: "6000" }],
      answer: "Matrix 10⁶ vs list 6000, for both space and a full edge scan.",
      check: "For a complete graph (E ≈ 10⁶) the two would be comparable and the matrix's O(1) edge test would win." },
    { type: "example", id: "ex3", level: "edge", title: "Walks from the matrix square", given: "Path graph a–b–c (undirected).", find: "(A²)[a][c] and (A²)[b][b].",
      steps: [{ say: "Walks of length 2 from a to c: a → b → c.", result: "1" }, { say: "From b back to b: b → a → b and b → c → b.", result: "2 = deg b" }],
      answer: "1 and 2.",
      check: "The diagonal of A² always gives the degrees in a simple undirected graph." },
    { type: "lab", lab: "graphrep" },
    { type: "faded", title: "Your turn", given: "A simple undirected graph on 6 vertices.", steps: [{ say: "Maximum edges and matrix cells?", blank: true, answer: "15 edges; 36 cells." }] },
    { type: "trap", wrong: "An adjacency list always uses less space.", tempting: "It skips missing edges.", whyWrong: "For dense graphs, pointers and list overhead can exceed a bit matrix.", rule: "Lists win for sparse graphs." },
    { type: "trap", wrong: "Undirected adjacency lists hold E entries.", tempting: "One per edge.", whyWrong: "Each edge appears in both endpoints' lists.", rule: "2E entries undirected, E directed." },
    { type: "gate", text: "GATE asks space and time with each representation, degree sums, counts of possible edges or graphs, and matrix properties." },
    { type: "recall", cards: [{ q: "Matrix space", a: "Θ(V²)" }, { q: "List space", a: "Θ(V + E)" }, { q: "Handshake lemma", a: "Σ deg = 2E" }] },
    { type: "check", questions: [
      { id: "gr1", kind: "NAT", marks: 1, q: "List entries for undirected A-B, A-C, B-D, C-D, D-E?", answer: "10", solution: "2E." },
      { id: "gr2", kind: "NAT", marks: 1, q: "Maximum edges in a simple undirected graph on 6 vertices?", answer: "15", solution: "6·5/2." },
      { id: "gr3", kind: "NAT", marks: 2, q: "V = 1000, E = 5000 directed: adjacency-list size V + E?", answer: "6000", solution: "Heads plus entries." },
      { id: "gr4", kind: "MCQ", marks: 1, q: "Fastest structure to test whether (u, v) is an edge?", options: ["Adjacency matrix", "Adjacency list", "Edge list", "Incidence list"], answer: "A", solution: "O(1) lookup." },
      { id: "gr5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["Row sums of a directed matrix give out-degrees", "A² counts walks of length 2", "An undirected matrix is symmetric", "Kruskal prefers an adjacency matrix"], answer: "A, B, C", solution: "Kruskal sorts an edge list." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on Data Structures", sub: "Graphs", href: DS }, { label: "Graph theory", sub: "Degrees and paths", href: "/study/graph-theory" }, { label: "Topic 2: BFS and DFS", sub: "Traversals", href: "/study/graph-representation" }] },
    { type: "links", prereq: ["Arrays", "Linked lists"], usedIn: ["Every graph algorithm"], cross: ["DM: graph theory", "Linear algebra: matrices"] },
  ],
};

const traverse: Topic = {
  id: "cs.pds.graph.bfsdfs",
  title: "Breadth-first and depth-first search",
  blocks: [
    { type: "hook", text: "From A, breadth-first search visits A B C D E level by level; depth-first search dives A B D C E and records when each vertex is entered and left. Those timestamps classify every edge, and that classification powers cycle detection and topological sort." },
    { type: "objectives", items: ["Run BFS with a queue and give visiting order and distances.", "Run DFS with discovery and finish times.", "Classify edges as tree, back, forward or cross, and use them."] },
    { type: "intuition", paras: ["BFS uses a queue: dequeue a vertex, enqueue its unvisited neighbours. It visits vertices in order of distance (number of edges) from the source, so it finds shortest paths in unweighted graphs.", "DFS uses a stack (or recursion): go as deep as possible, then backtrack. Each vertex gets a discovery time d and a finish time f; descendants' intervals nest inside their ancestors'.", "In a directed graph, an edge u → v is a tree edge if it discovered v, a back edge if v is an ancestor still open (a cycle!), a forward edge to a finished descendant, and a cross edge to a finished vertex elsewhere. Undirected graphs have only tree and back edges."], analogyLimit: "BFS is ripples spreading on a pond; DFS is exploring a maze by always taking the next unexplored corridor and backing up at dead ends." },
    { type: "definition", name: "Traversals", text: "With adjacency lists:", items: ["BFS: O(V + E); queue; gives shortest edge-count distances.", "DFS: O(V + E); stack or recursion; gives d[v] and f[v].", "Parenthesis theorem: intervals [d, f] are nested or disjoint.", "Directed graph has a cycle ⇔ DFS finds a back edge.", "With an adjacency matrix both become O(V²)."] },
    { type: "deep", sections: [
      { h: "Uses of BFS", points: ["Shortest paths in unweighted graphs.", "Testing bipartiteness (2-colour by level parity).", "Connected components (repeat from unvisited vertices).", "Level-order traversal of trees."], paras: [] },
      { h: "Uses of DFS", points: ["Cycle detection (back edges).", "Topological sort: order vertices by decreasing finish time.", "Strongly connected components (Kosaraju, Tarjan).", "Articulation points and bridges (low-link values)."], paras: [] },
      { h: "Order depends on neighbour order", paras: ["Both traversals depend on the order in which neighbours are listed. GATE fixes it (alphabetical, or the order given) or asks which sequences are possible BFS/DFS orders."] },
      { h: "BFS tree vs DFS tree", paras: ["In an undirected graph, BFS non-tree edges join vertices whose levels differ by at most 1; DFS non-tree edges always go to an ancestor. These facts identify which traversal produced a given tree."] },
    ] },
    { type: "walkthrough", steps: ["BFS: queue the source; repeatedly dequeue, then enqueue unvisited neighbours in order.", "DFS: visit, stamp d, recurse on unvisited neighbours in order, stamp f.", "Classify each edge by the colour of its endpoint when examined.", "Read off orders, distances and edge types."], prompt: { q: "Which traversal finds shortest paths in an unweighted graph?", a: "BFS." } },
    { type: "figure", id: "bfs", caption: "Graph A-B, A-C, B-D, C-D, D-E from A.", alt: "BFS A B C D E; DFS A B D C E.", fig: { kind: "net", w: 300, h: 160, nodes: [{ id: "A", label: "A", x: 40, y: 80, hl: true }, { id: "B", label: "B", x: 120, y: 30 }, { id: "C", label: "C", x: 120, y: 130 }, { id: "D", label: "D", x: 200, y: 80 }, { id: "E", label: "E", x: 270, y: 80 }], edges: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "B", b: "D" }, { a: "C", b: "D" }, { a: "D", b: "E" }] } },
    { type: "example", id: "ex1", level: "gate", title: "BFS and DFS orders", given: "Undirected A-B, A-C, B-D, C-D, D-E; neighbours in alphabetical order; start A.", find: "BFS order and levels; DFS order and times.",
      steps: [{ say: "BFS: A; B, C; D; E.", result: "A B C D E (levels 0, 1, 1, 2, 3)" }, { say: "DFS: A → B → D → C (A already open: back edge C–A), back to D → E.", result: "A B D C E" }],
      answer: "BFS A B C D E; DFS A B D C E with times A 1/10, B 2/9, D 3/8, C 4/5, E 6/7.",
      check: "C–A is the only non-tree edge, so the graph has exactly one cycle (A B D C)." },
    { type: "figure", id: "dir", for: "ex2", caption: "Directed A→B, B→C, C→A, A→D, D→C.", alt: "Edge types: tree, tree, back, tree, cross.", fig: { kind: "net", w: 280, h: 160, nodes: [{ id: "A", label: "A", x: 50, y: 80, hl: true }, { id: "B", label: "B", x: 140, y: 30 }, { id: "C", label: "C", x: 230, y: 80 }, { id: "D", label: "D", x: 140, y: 135 }], edges: [{ a: "A", b: "B", dir: true }, { a: "B", b: "C", dir: true }, { a: "C", b: "A", dir: true, label: "back" }, { a: "A", b: "D", dir: true }, { a: "D", b: "C", dir: true, label: "cross" }] } },
    { type: "example", id: "ex2", level: "gate", title: "Classifying directed edges", given: "Directed edges A→B, B→C, C→A, A→D, D→C; start A, alphabetical order.", find: "DFS order and the type of each edge.",
      steps: [{ say: "A → B → C; C → A finds A still open: back edge (a cycle)." }, { say: "C, B finish; A → D; D → C finds C finished in another branch: cross edge.", result: "A B C D" }],
      answer: "DFS A B C D; A→B, B→C, A→D tree; C→A back; D→C cross.",
      check: "One back edge, so the graph is not a DAG." },
    { type: "example", id: "ex3", level: "edge", title: "Is it a valid BFS order?", given: "Same undirected graph; candidate orders A C B D E and A B D C E.", find: "Which can be BFS orders (any neighbour order)?",
      steps: [{ say: "A C B D E: level 1 (B, C) in either order, then D, then E." }, { say: "A B D C E: D (level 2) before C (level 1).", result: "not BFS" }],
      answer: "A C B D E is a BFS order; A B D C E is not (it is a DFS order).",
      check: "BFS orders never visit a farther level before a nearer one." },
    { type: "lab", lab: "bfsdfs" },
    { type: "faded", title: "Your turn", given: "DFS finds a back edge in a directed graph.", steps: [{ say: "What does that prove?", blank: true, answer: "The graph has a cycle, so it has no topological order." }] },
    { type: "trap", wrong: "DFS finds shortest paths.", tempting: "It visits everything reachable.", whyWrong: "It may reach a vertex by a long path first.", rule: "Unweighted shortest paths: BFS." },
    { type: "trap", wrong: "Undirected DFS produces cross edges.", tempting: "Directed DFS does.", whyWrong: "In undirected graphs every non-tree edge goes to an ancestor.", rule: "Undirected: tree and back edges only." },
    { type: "gate", text: "GATE asks BFS/DFS orders, possible traversal sequences, discovery/finish times, edge classification, and complexity with each representation." },
    { type: "recall", cards: [{ q: "BFS uses", a: "A queue" }, { q: "Cycle in directed graph", a: "DFS back edge" }, { q: "Traversal cost with lists", a: "O(V + E)" }] },
    { type: "check", questions: [
      { id: "bd1", kind: "MCQ", marks: 1, q: "BFS from A on A-B, A-C, B-D, C-D, D-E (alphabetical)?", options: ["A B C D E", "A B D C E", "A C D B E", "A B D E C"], answer: "A", solution: "Level by level." },
      { id: "bd2", kind: "MCQ", marks: 1, q: "DFS from A on the same graph (alphabetical)?", options: ["A B D C E", "A B C D E", "A C D E B", "A B D E C"], answer: "A", solution: "B, then D, then C before E." },
      { id: "bd3", kind: "NAT", marks: 2, q: "Finish time of A in that DFS (times start at 1)?", answer: "10", solution: "Last to finish." },
      { id: "bd4", kind: "MCQ", marks: 2, q: "Directed A→B, B→C, C→A, A→D, D→C, DFS from A: type of D→C?", options: ["Tree", "Back", "Forward", "Cross"], answer: "D", solution: "C finished in another branch." },
      { id: "bd5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["BFS and DFS are O(V + E) with lists", "With a matrix they are O(V²)", "Topological order = decreasing finish time", "BFS can visit level 2 before level 1"], answer: "A, B, C", solution: "BFS is level-ordered." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on Data Structures", sub: "Graph traversal", href: DS }, { label: "Algorithms", sub: "Topological sort, SCCs", href: "/topics/algorithms" }, { label: "Queues and stacks", sub: "The structures behind them", href: "/study/stacks-queues" }] },
    { type: "links", prereq: ["Queues", "Recursion"], usedIn: ["Shortest paths, SCC, topological sort"], cross: ["Algorithms: graph search"] },
  ],
};

const ops: Topic = {
  id: "cs.pds.graph.ops",
  title: "Operation costs and choosing a graph structure",
  blocks: [
    { type: "hook", text: "Transposing a graph costs O(V²) with a matrix and O(V + E) with lists; adding a vertex is trivial with lists and means copying the whole matrix. Good algorithm analysis starts by asking which structure the input uses." },
    { type: "objectives", items: ["Give the cost of common graph operations in each representation.", "Pick the representation for a workload (dense vs sparse, query mix).", "Analyse the effect of representation on algorithm complexity."] },
    { type: "intuition", paras: ["Every graph algorithm is built from a few primitives: test an edge, list neighbours, visit all edges, add or remove an edge or vertex, transpose. Their cost depends on the structure.", "Algorithms that visit every edge (BFS, DFS, topological sort) cost O(V + E) with lists but O(V²) with a matrix, since each row must be scanned fully.", "Algorithms that test many specific pairs (Floyd–Warshall, checking whether a graph is complete or a clique) prefer the matrix."], analogyLimit: "Like choosing between a phone book sorted by name and one sorted by street: both hold the same data, but each makes different questions fast." },
    { type: "definition", name: "Costs", text: "Matrix vs list (V vertices, E edges):", items: ["Edge (u, v)?: O(1) vs O(deg u).", "Neighbours of u: O(V) vs O(deg u).", "Visit all edges: O(V²) vs O(V + E).", "Add vertex: O(V²) copy vs O(1).", "Transpose: O(V²) vs O(V + E). Remove an edge: O(1) vs O(deg u)."] },
    { type: "deep", sections: [
      { h: "Effect on classic algorithms", points: ["BFS, DFS: O(V²) matrix, O(V + E) list.", "Dijkstra with a binary heap: O((V + E) log V) needs lists; O(V²) array version suits dense matrices.", "Prim: O(V²) with a matrix and no heap; O(E log V) with lists and a heap.", "Floyd–Warshall: O(V³) on a matrix in any case."], paras: [] },
      { h: "Hybrid structures", paras: ["Adjacency lists whose neighbour sets are hash tables give expected O(1) edge tests while keeping O(V + E) space. Bit-packed matrices cut space by 8 to 64 times for dense unweighted graphs."] },
      { h: "Universal sink in O(V)", paras: ["With a matrix, a vertex with in-degree V − 1 and out-degree 0 can be found in O(V) by walking: at (i, j), if a[i][j] = 1 move down (i cannot be the sink), else move right. A neat matrix-only trick that GATE has used."] },
      { h: "Space units", paras: ["A matrix of bits uses V²/8 bytes; a list uses about (V + 2E) words for an undirected graph (heads plus entries), each word 4 or 8 bytes. For V = 10⁶ and E = 10⁷ that is 125 GB versus about 170 MB."] },
    ] },
    { type: "walkthrough", steps: ["List the primitives the algorithm uses and how often.", "Look up each primitive's cost in the chosen structure.", "Multiply and add.", "Compare with the other structure for this graph's density."], prompt: { q: "Cost of DFS on an adjacency matrix?", a: "O(V²)." } },
    { type: "figure", id: "cost", caption: "Operation costs.", alt: "Matrix vs list table.", fig: { kind: "matrix", title: "Operation", cols: ["Matrix", "List"], rows: [{ label: "Edge (u, v)?", cells: ["O(1)", "O(deg u)"] }, { label: "Neighbours of u", cells: ["O(V)", "O(deg u)"] }, { label: "All edges", cells: ["O(V²)", "O(V + E)"], hl: true }, { label: "Add vertex", cells: ["O(V²)", "O(1)"] }, { label: "Transpose", cells: ["O(V²)", "O(V + E)"] }] } },
    { type: "example", id: "ex1", level: "gate", title: "Traversal cost", given: "V = 1000, E = 5000.", find: "Steps to visit all edges with a matrix and with lists.",
      steps: [{ say: "Matrix: every cell, 1000² = 10⁶." }, { say: "Lists: V + E = 6000.", result: "≈ 167 times fewer" }],
      answer: "About 10⁶ versus 6000 steps.",
      check: "For E ≈ V² the costs would be similar." },
    { type: "figure", id: "sink", for: "ex2", caption: "Universal sink walk.", alt: "Move right on 0, down on 1.", fig: { kind: "strip", items: [{ label: "start (0, 0)", sub: "", state: "done" }, { label: "a[i][j] = 1", sub: "i is not a sink → down", state: "done" }, { label: "a[i][j] = 0", sub: "j is not a sink → right", state: "done" }, { label: "check final i", sub: "O(V)", state: "now" }] } },
    { type: "example", id: "ex2", level: "gate", title: "Choosing for Dijkstra", given: "Graph A: V = 10⁴, E = 5 × 10⁴. Graph B: V = 10⁴, E ≈ 5 × 10⁷.", find: "Better Dijkstra implementation for each.",
      steps: [{ say: "A (sparse): heap + lists, (V + E) log V ≈ 6 × 10⁴ × 14 ≈ 8.4 × 10⁵." }, { say: "B (dense): array version O(V²) = 10⁸ beats (V + E) log V ≈ 7 × 10⁸.", result: "array for dense" }],
      answer: "Heap with lists for A; the O(V²) array version for B.",
      check: "The crossover is around E ≈ V²/log V." },
    { type: "example", id: "ex3", level: "edge", title: "Transposing", given: "Reverse every edge of a directed graph with V = 1000, E = 5000.", find: "Cost with each structure.",
      steps: [{ say: "Matrix: swap a[i][j] and a[j][i] for all pairs: about V²/2." }, { say: "Lists: walk every list, appending u to v's new list.", result: "O(V + E) = 6000" }],
      answer: "About 500 000 operations with a matrix (Θ(V²)) versus 6000 with lists.",
      check: "Kosaraju's SCC algorithm needs the transpose." },
    { type: "lab", lab: "graphops" },
    { type: "faded", title: "Your turn", given: "Checking whether a graph with V = 2000 is complete.", steps: [{ say: "Better structure?", blank: true, answer: "Matrix: test all pairs directly (or simply count E = V(V − 1)/2 with lists)." }] },
    { type: "trap", wrong: "BFS is always O(V + E).", tempting: "That is the textbook bound.", whyWrong: "With an adjacency matrix it is O(V²).", rule: "State the representation with the bound." },
    { type: "trap", wrong: "Adding a vertex to a matrix is O(1).", tempting: "Just add a row.", whyWrong: "A fixed 2-D array must be reallocated and copied.", rule: "Matrix growth is O(V²)." },
    { type: "gate", text: "GATE asks complexities of graph algorithms under a stated representation and which representation suits a given graph or operation." },
    { type: "recall", cards: [{ q: "DFS with matrix", a: "O(V²)" }, { q: "Transpose with lists", a: "O(V + E)" }, { q: "Universal sink with matrix", a: "O(V)" }] },
    { type: "check", questions: [
      { id: "go1", kind: "MCQ", marks: 1, q: "BFS on an adjacency matrix costs", options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"], answer: "B", solution: "Scan each row." },
      { id: "go2", kind: "NAT", marks: 1, q: "V = 1000, E = 5000: steps to visit all edges with lists (V + E)?", answer: "6000", solution: "Heads plus entries." },
      { id: "go3", kind: "MCQ", marks: 1, q: "Cost of testing whether (u, v) is an edge with an adjacency list?", options: ["O(1)", "O(deg u)", "O(V²)", "O(E)"], answer: "B", solution: "Scan u's list." },
      { id: "go4", kind: "MCQ", marks: 2, q: "For a very dense graph, which Dijkstra is better?", options: ["O(V²) array version", "Binary heap with lists", "Both equal always", "BFS"], answer: "A", solution: "V² < E log V when dense." },
      { id: "go5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["Transpose is O(V + E) with lists", "A universal sink can be found in O(V) with a matrix", "Adding a vertex to a list structure is O(1)", "Floyd–Warshall prefers lists"], answer: "A, B, C", solution: "Floyd–Warshall works on matrices." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on Data Structures", sub: "Graphs", href: DS }, { label: "Algorithms", sub: "Shortest paths, MST", href: "/topics/algorithms" }, { label: "Topic 1: representations", sub: "Matrix and list", href: "/study/graph-representation" }] },
    { type: "links", prereq: ["Representations"], usedIn: ["Algorithm analysis"], cross: ["Algorithms: graph algorithms"] },
  ],
};

export const PDS_GRAPH: Chapter = { id: "cs.pds.graph", subject: "Programming and Data Structures", title: "Graphs: representation", syllabus: ["CS · Programming and Data Structures: graphs"], pyqTopic: /graph|adjacency|BFS|DFS|breadth|depth/i, map: { kind: "strip", items: [{ label: "1. Representations", sub: "matrix, list", state: "done" }, { label: "2. BFS and DFS", sub: "edge types", state: "done" }, { label: "3. Costs", sub: "choosing", state: "done" }] }, topics: [reps, traverse, ops] };
