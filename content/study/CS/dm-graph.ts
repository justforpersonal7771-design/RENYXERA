import type { Chapter, Topic } from "@/lib/study/schema";

/**
 * Discrete Mathematics → Graph theory. Numbers from lib/study/dm.ts, checked by script:
 * K4: degrees 3333, 6 edges, no Euler path, χ 4, matching 2. C5: Euler circuit, χ 3, matching 2, α 2. Bow tie: degrees 22422, Euler circuit,
 * cut vertex 3 (index 2). Two triangles + bridge: degrees 223322, Euler path not circuit, cut vertices 3 and 4, bridge 3–4, χ 3, matching 3.
 * K3,3: 9 edges, χ 2, matching 3, α 3. Wheel W6: degrees 533333, χ 4, matching 3.
 */

const basics: Topic = {
  id: "cs.dm.graph.basic",
  title: "Degrees, connectivity, Euler and Hamilton",
  blocks: [
    { type: "hook", text: "Königsberg had seven bridges, and nobody could cross each exactly once. Euler proved in 1736 that nobody ever would, by counting how many bridges touched each piece of land. That count, the degree, still answers most graph questions." },
    { type: "objectives", items: ["Use the handshake lemma and degree sequences.", "Find components, cut vertices and bridges.", "Decide when Euler circuits and paths exist, and what is known about Hamiltonian cycles."] },
    { type: "intuition", paras: ["A graph is a set of vertices and edges. The degree of a vertex is the number of edges touching it. Every edge adds 2 to the total degree, so the sum of degrees is twice the number of edges, and the number of odd-degree vertices is always even.", "A graph is connected if every vertex can reach every other. A cut vertex or bridge is one whose removal disconnects the graph.", "An Euler circuit uses every edge once and returns home; it exists exactly when the graph is connected (ignoring isolated vertices) and every degree is even. With exactly two odd vertices you get an Euler path between them. Hamiltonian cycles (every vertex once) have no such simple test."], analogyLimit: "Euler is about edges (roads to sweep), Hamilton about vertices (cities to visit). The first is easy to decide; the second is NP-complete." },
    { type: "definition", name: "Basic facts", text: "For a graph with n vertices and m edges:", items: ["Handshake: Σ deg(v) = 2m; the number of odd-degree vertices is even.", "Kₙ has n(n − 1)/2 edges; K_{a,b} has ab; a tree has n − 1.", "Euler circuit ⇔ connected and all degrees even. Euler path ⇔ connected and 0 or 2 odd vertices.", "Dirac: if n ≥ 3 and every degree ≥ n/2, the graph is Hamiltonian (sufficient, not necessary)."] },
    { type: "deep", sections: [
      { h: "Trees", points: ["A tree is connected and acyclic; equivalently connected with n − 1 edges; equivalently a unique path between any two vertices.", "Every tree with n ≥ 2 has at least two leaves.", "Cayley: there are nⁿ⁻² labelled trees on n vertices.", "A forest with k trees has n − k edges."], paras: [] },
      { h: "Components and edge counts", paras: ["With n vertices and k components, a graph has at least n − k edges and at most C(n − k + 1, 2) edges (one big complete component, the rest isolated). A simple graph with more than C(n − 1, 2) edges must be connected."] },
      { h: "Isomorphism", paras: ["Isomorphic graphs have the same number of vertices and edges, the same degree sequence, and the same cycle structure. Equal degree sequences are necessary but not sufficient: a 6-cycle and two triangles both have all degrees 2."] },
      { h: "Complements and self-complementary graphs", paras: ["The complement of G has an edge exactly where G does not. A graph on n vertices and its complement together have n(n − 1)/2 edges. A self-complementary graph needs n(n − 1)/4 edges, so n ≡ 0 or 1 mod 4."] },
    ] },
    { type: "walkthrough", steps: ["Write the degree of every vertex and check the sum is even.", "Count odd vertices: 0 → Euler circuit, 2 → Euler path, more → neither (if connected).", "Remove each vertex (or edge) in turn to find cut vertices (bridges).", "For trees: m = n − 1 and connected."], prompt: { q: "Can a graph have exactly three vertices of odd degree?", a: "No. The number of odd-degree vertices is always even." } },
    { type: "figure", id: "bridge", caption: "Two triangles joined by a bridge.", alt: "Triangle 1-2-3, triangle 4-5-6, edge 3-4.", fig: { kind: "net", w: 300, h: 160, nodes: [{ id: "1", label: "1", x: 30, y: 40 }, { id: "2", label: "2", x: 30, y: 120 }, { id: "3", label: "3", x: 110, y: 80, hl: true }, { id: "4", label: "4", x: 190, y: 80, hl: true }, { id: "5", label: "5", x: 270, y: 40 }, { id: "6", label: "6", x: 270, y: 120 }], edges: [{ a: "1", b: "2" }, { a: "2", b: "3" }, { a: "3", b: "1" }, { a: "3", b: "4", hl: true }, { a: "4", b: "5" }, { a: "5", b: "6" }, { a: "6", b: "4" }], note: "Cut vertices 3 and 4; bridge 3–4." } },
    { type: "example", id: "gx1", level: "gate", title: "Reading a graph", given: "The two-triangle graph in the figure.", find: "Degrees, Euler path or circuit, cut vertices and bridges.",
      steps: [
        { say: "Degrees: 2, 2, 3, 3, 2, 2 (sum 14 = 2 × 7 edges)." },
        { say: "Two odd vertices (3 and 4): an Euler path from 3 to 4, no circuit." },
        { say: "Removing 3 or 4 disconnects; removing edge 3–4 disconnects.", result: "cut vertices 3, 4; bridge 3–4" },
      ],
      answer: "Euler path (not circuit); cut vertices 3 and 4; bridge 3–4.",
      check: "An Euler path must start and end at the odd vertices." },
    { type: "figure", id: "bowtie", for: "gx2", caption: "The bow tie: two triangles sharing vertex 3.", alt: "Triangles 1-2-3 and 3-4-5.", fig: { kind: "net", w: 260, h: 160, nodes: [{ id: "1", label: "1", x: 30, y: 40 }, { id: "2", label: "2", x: 30, y: 120 }, { id: "3", label: "3", x: 130, y: 80, hl: true }, { id: "4", label: "4", x: 230, y: 40 }, { id: "5", label: "5", x: 230, y: 120 }], edges: [{ a: "1", b: "2" }, { a: "2", b: "3" }, { a: "3", b: "1" }, { a: "3", b: "4" }, { a: "4", b: "5" }, { a: "5", b: "3" }] } },
    { type: "example", id: "gx2", level: "gate", title: "Euler circuit but not Hamiltonian", given: "The bow tie.", find: "Euler circuit? Hamiltonian cycle?",
      steps: [
        { say: "Degrees 2, 2, 4, 2, 2: all even, connected.", result: "Euler circuit exists" },
        { say: "A Hamiltonian cycle would pass through 3 twice (it joins the two triangles).", result: "no Hamiltonian cycle" },
      ],
      answer: "Euler circuit yes (1-2-3-4-5-3-1); Hamiltonian cycle no. Vertex 3 is a cut vertex.",
      check: "A graph with a cut vertex can never have a Hamiltonian cycle." },
    { type: "example", id: "gx3", level: "edge", title: "Counting edges with components", given: "A simple graph on 10 vertices with 3 components.", find: "The fewest and most edges possible.",
      steps: [
        { say: "Fewest: a forest of 3 trees: n − k = 7." },
        { say: "Most: K₈ plus two isolated vertices: C(8, 2).", result: "28" },
      ],
      answer: "Between 7 and 28 edges.",
      check: "With 37 or more edges (more than C(9, 2) = 36), 10 vertices must be connected." },
    { type: "lab", lab: "graph-basic" },
    { type: "faded", title: "Your turn", given: "A tree with 12 vertices.",
      steps: [{ say: "Edges, and the sum of degrees?", blank: true, answer: "11 edges; degree sum 22." }] },
    { type: "trap", wrong: "Equal degree sequences mean isomorphic graphs.", tempting: "Isomorphic graphs do share degree sequences.", whyWrong: "C₆ and two disjoint triangles both have six vertices of degree 2 but are not isomorphic.", rule: "Degree sequence is necessary, not sufficient." },
    { type: "trap", wrong: "Euler circuits need every vertex visited once.", tempting: "Mixing up Euler and Hamilton.", whyWrong: "Euler uses every edge exactly once; vertices may repeat.", rule: "Euler: edges. Hamilton: vertices." },
    { type: "gate", text: "GATE asks degree-sum and edge-count NATs, Euler path existence, number of components or edges in forests, cut vertices, and statements about trees and complements." },
    { type: "recall", cards: [{ q: "Handshake lemma", a: "Σ deg = 2m" }, { q: "Euler circuit iff", a: "Connected, all degrees even" }, { q: "Labelled trees on n vertices", a: "nⁿ⁻²" }] },
    { type: "check", questions: [
      { id: "gb1", kind: "NAT", marks: 1, q: "Sum of degrees of a graph with 15 edges?", answer: "30", solution: "2m." },
      { id: "gb2", kind: "NAT", marks: 2, q: "Maximum edges of a simple graph on 10 vertices with 3 components?", answer: "28", solution: "C(8, 2)." },
      { id: "gb3", kind: "NAT", marks: 1, q: "Number of labelled trees on 4 vertices?", answer: "16", solution: "4²." },
      { id: "gb4", kind: "MSQ", marks: 2, q: "For the bow tie (two triangles sharing a vertex), which are true?", options: ["It has an Euler circuit", "It has a Hamiltonian cycle", "It has a cut vertex", "All degrees are even"], answer: "A, C, D", solution: "No Hamiltonian cycle through a cut vertex." },
      { id: "gb5", kind: "MCQ", marks: 1, q: "A connected graph has exactly two odd-degree vertices. It has", options: ["An Euler circuit", "An Euler path but no circuit", "Neither", "A Hamiltonian cycle"], answer: "B", solution: "Path between the odd vertices." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Discrete Mathematics", sub: "Graph theory", href: "/topics/discrete-mathematics" },
      { label: "Topic 2: colouring and matching", sub: "χ, matchings, planarity", href: "/study/graph-theory" },
      { label: "Algorithms: graph traversals", sub: "BFS and DFS", href: "/topics/algorithms" },
    ] },
    { type: "links", prereq: ["Sets"], usedIn: ["Algorithms: graphs", "Networks"], cross: ["Algorithms: BFS, DFS, MST"] },
  ],
};

const colouring: Topic = {
  id: "cs.dm.graph.colour",
  title: "Colouring, matching and planarity",
  blocks: [
    { type: "hook", text: "Exam timetabling is graph colouring: subjects are vertices, a shared student is an edge, and colours are time slots. The fewest slots you need is the chromatic number." },
    { type: "objectives", items: ["Find chromatic numbers of standard graphs and bound them.", "Find maximum matchings and use Hall's and König's theorems.", "Use Euler's formula to test planarity."] },
    { type: "intuition", paras: ["A proper colouring gives neighbours different colours. The chromatic number χ(G) is the fewest colours that work. A clique of size ω needs ω colours, so χ ≥ ω; and χ ≥ n/α, where α is the largest independent set.", "A matching is a set of edges with no shared vertex. A perfect matching covers every vertex, so n must be even.", "A planar graph can be drawn without crossings. For a connected planar graph, n − m + f = 2 (Euler's formula), which caps the edges: m ≤ 3n − 6, and m ≤ 2n − 4 if there are no triangles."], analogyLimit: "Like assigning rooms so no two clashing meetings share one; but finding the minimum is NP-hard in general, so GATE asks about special graphs." },
    { type: "definition", name: "Key results", text: "Standard values and theorems:", items: ["χ(Kₙ) = n. χ(Cₙ) = 2 if n even, 3 if odd. χ(tree) = 2 (n ≥ 2). χ(bipartite) = 2. χ(wheel Wₙ) = 3 if n − 1 even rim, 4 if odd.", "A graph is bipartite ⇔ it has no odd cycle ⇔ χ ≤ 2.", "Four colour theorem: every planar graph has χ ≤ 4.", "König: in a bipartite graph, maximum matching = minimum vertex cover. Hall: a bipartite graph has a matching saturating side A ⇔ every S ⊆ A has |N(S)| ≥ |S|."] },
    { type: "deep", sections: [
      { h: "Bounds on χ", points: ["ω ≤ χ ≤ Δ + 1 (Δ = largest degree); greedy colouring achieves Δ + 1.", "Brooks: χ ≤ Δ unless the graph is complete or an odd cycle.", "χ ≥ n/α because each colour class is an independent set."], paras: [] },
      { h: "Planarity", paras: ["K₅ (10 edges > 3·5 − 6 = 9) and K₃,₃ (9 edges > 2·6 − 4 = 8, no triangles) are not planar. Kuratowski: a graph is planar exactly when it contains no subdivision of K₅ or K₃,₃. In a planar graph some vertex has degree at most 5."] },
      { h: "Matching sizes", paras: ["A maximum matching has at most ⌊n/2⌋ edges. Kₙ has a perfect matching when n is even; K_{a,b} has a maximum matching of min(a, b). The number of perfect matchings of K₂ₙ is (2n − 1)!! = 1·3·5·…·(2n − 1)."] },
      { h: "Edge colouring", paras: ["Colouring edges so that edges at a vertex differ needs at least Δ colours; Vizing says Δ or Δ + 1 always suffice. Bipartite graphs need exactly Δ (König)."] },
    ] },
    { type: "walkthrough", steps: ["Look for odd cycles: none means χ ≤ 2.", "Find the largest clique for a lower bound.", "Try to colour with that many; add one colour if forced.", "For planarity: compare m with 3n − 6 (or 2n − 4 if triangle-free)."], prompt: { q: "What is χ of a cycle with 7 vertices?", a: "3: an odd cycle is not bipartite, and 3 colours suffice." } },
    { type: "figure", id: "wheel", caption: "Wheel W₆: a hub joined to a 5-cycle.", alt: "Hub in the centre connected to five rim vertices forming a cycle.", fig: { kind: "net", w: 220, h: 210, nodes: [{ id: "h", label: "1", x: 110, y: 105, hl: true }, { id: "a", label: "2", x: 110, y: 25 }, { id: "b", label: "3", x: 190, y: 80 }, { id: "c", label: "4", x: 160, y: 180 }, { id: "d", label: "5", x: 60, y: 180 }, { id: "e", label: "6", x: 30, y: 80 }], edges: [{ a: "h", b: "a" }, { a: "h", b: "b" }, { a: "h", b: "c" }, { a: "h", b: "d" }, { a: "h", b: "e" }, { a: "a", b: "b" }, { a: "b", b: "c" }, { a: "c", b: "d" }, { a: "d", b: "e" }, { a: "e", b: "a" }], note: "The rim is an odd cycle (5)." } },
    { type: "example", id: "cx1", level: "gate", title: "Chromatic number of a wheel", given: "Wheel W₆: a hub joined to every vertex of a 5-cycle.", find: "χ(W₆).",
      steps: [
        { say: "The rim C₅ is an odd cycle: it needs 3 colours." },
        { say: "The hub touches all rim vertices: it needs a fourth.", result: "χ = 4" },
      ],
      answer: "4. (With an even rim, as in W₇ with a 6-cycle, χ would be 3.)",
      check: "The lab colours W₆ with 4 colours and finds a maximum matching of 3." },
    { type: "figure", id: "k33", for: "cx2", caption: "K₃,₃: every left vertex joined to every right vertex.", alt: "Three vertices on the left, three on the right, nine edges.", fig: { kind: "net", w: 240, h: 200, nodes: [{ id: "a", label: "a", x: 50, y: 30 }, { id: "b", label: "b", x: 50, y: 100 }, { id: "c", label: "c", x: 50, y: 170 }, { id: "x", label: "x", x: 190, y: 30 }, { id: "y", label: "y", x: 190, y: 100 }, { id: "z", label: "z", x: 190, y: 170 }], edges: [{ a: "a", b: "x", hl: true }, { a: "a", b: "y" }, { a: "a", b: "z" }, { a: "b", b: "x" }, { a: "b", b: "y", hl: true }, { a: "b", b: "z" }, { a: "c", b: "x" }, { a: "c", b: "y" }, { a: "c", b: "z", hl: true }], note: "Highlighted: a perfect matching." } },
    { type: "example", id: "cx2", level: "gate", title: "K₃,₃: colouring, matching, planarity", given: "K₃,₃ (6 vertices, 9 edges).", find: "χ, maximum matching, and whether it is planar.",
      steps: [
        { say: "Bipartite: χ = 2." },
        { say: "Perfect matching a–x, b–y, c–z.", result: "matching 3" },
        { say: "Triangle-free planar bound: m ≤ 2n − 4 = 8 < 9.", result: "not planar" },
      ],
      answer: "χ = 2, maximum matching 3, not planar.",
      check: "K₅ fails the general bound: 10 > 9." },
    { type: "example", id: "cx3", level: "edge", title: "Euler's formula", given: "A connected planar graph with 10 vertices, every face a triangle.", find: "Edges and faces.",
      steps: [
        { say: "Every face a triangle: 3f = 2m, and m = 3n − 6 = 24." },
        { say: "f = 2 − n + m = 2 − 10 + 24.", result: "16 faces" },
      ],
      answer: "24 edges and 16 faces (including the outer face).",
      check: "3 × 16 = 48 = 2 × 24, consistent." },
    { type: "lab", lab: "colour" },
    { type: "faded", title: "Your turn", given: "A tree with 8 vertices; the complete graph K₈.",
      steps: [{ say: "χ of each, and a maximum matching in K₈?", blank: true, answer: "Tree: 2. K₈: 8. K₈ has a perfect matching of 4 edges." }] },
    { type: "trap", wrong: "χ equals the size of the largest clique.", tempting: "Cliques force colours.", whyWrong: "ω is only a lower bound: C₅ has ω = 2 but χ = 3.", rule: "χ ≥ ω; equality can fail." },
    { type: "trap", wrong: "m ≤ 3n − 6 proves a graph is planar.", tempting: "It is the planarity bound.", whyWrong: "It is necessary, not sufficient: K₃,₃ has 9 ≤ 12 edges but is not planar.", rule: "The bound only rules graphs out." },
    { type: "gate", text: "GATE asks chromatic numbers of named graphs (cycles, wheels, complete, bipartite), maximum matchings, planarity via Euler's formula, and face counts. Odd cycles and the two edge bounds settle most of them." },
    { type: "recall", cards: [{ q: "Bipartite iff", a: "No odd cycle" }, { q: "Planar edge bound", a: "m ≤ 3n − 6" }, { q: "Euler's formula", a: "n − m + f = 2" }] },
    { type: "check", questions: [
      { id: "gc1", kind: "NAT", marks: 1, q: "Chromatic number of the cycle C₇?", answer: "3", solution: "Odd cycle." },
      { id: "gc2", kind: "NAT", marks: 2, q: "Chromatic number of the wheel W₆ (hub + 5-cycle)?", answer: "4", solution: "3 for the odd rim + 1 for the hub." },
      { id: "gc3", kind: "NAT", marks: 2, q: "Faces of a connected planar graph with 10 vertices and 24 edges?", answer: "16", solution: "f = 2 − n + m." },
      { id: "gc4", kind: "MSQ", marks: 2, q: "Which are not planar?", options: ["K₄", "K₅", "K₃,₃", "C₁₀"], answer: "B, C", solution: "Kuratowski's two graphs." },
      { id: "gc5", kind: "NAT", marks: 1, q: "Size of a maximum matching in K₃,₅?", answer: "3", solution: "min(3, 5)." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Discrete Mathematics", sub: "Colouring and matching", href: "/topics/discrete-mathematics" },
      { label: "Topic 1: graph basics", sub: "Degrees and Euler", href: "/study/graph-theory" },
      { label: "Compiler Design", sub: "Register allocation is graph colouring", href: "/topics/compiler-design" },
    ] },
    { type: "links", prereq: ["Topic 1"], usedIn: ["Register allocation", "Scheduling"], cross: ["Compiler Design: register allocation"] },
  ],
};

export const DM_GRAPH: Chapter = {
  id: "cs.dm.graph", subject: "Discrete Mathematics", title: "Graph theory: connectivity, matching, colouring",
  syllabus: ["CS · Discrete Mathematics: Graphs: connectivity, matching, colouring"], pyqTopic: /graph/i,
  map: { kind: "strip", items: [{ label: "1. Basics", sub: "degrees, Euler, trees", state: "done" }, { label: "2. Colouring", sub: "matching, planarity", state: "done" }] },
  topics: [basics, colouring],
};
