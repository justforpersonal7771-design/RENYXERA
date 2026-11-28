import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A8 "Minimum spanning trees" (28 Nov 2026). Spanning trees, the cut property and the cycle property (with the template for distinct weights),
 * Kruskal with disjoint sets, Prim, counting MSTs, what changes when weights change, and MST against shortest path.
 * Real GATE questions (texts from public/data/questions.json), each re-solved here:
 * 2026 FN Q49 (distinct weights: A and D), 2022 FN Q49 (A, B and C), 2021 AN Q64 (S1 false, S2 true), 2019 FN Q44 (both true), 2017 FN Q48 (I only),
 * 2025 AN Q37 (add a constant: MSTs stay, shortest paths may change), 2025 FN Q18 (d1 at most d2), 2020 FN Q39 (is T still an MST after adding an edge: Theta(V)),
 * 2020 FN Q56 (complete graph with weight |i - j|: 99).
 * The questions that give the graph as a picture (2025 FN Q64, 2024 AN Q53, 2021 FN Q48, 2018 FN Q57) are covered by the counting method.
 * Programs compiled and run with gcc: Kruskal 14 and Prim 14 on an 8-edge graph; 99.
 */
export const chapterA8: Topic = {
  id: "cs.algo.v2.mst8",
  title: "Minimum spanning trees",
  no: "A8",
  book: [
    { t: "p", text: "Suppose a company must connect a set of offices with cable so that every office can reach every other, and each possible link has a cost. The cheapest set of links that connects everything is a **minimum spanning tree** (MST). It is the cleanest greedy problem on graphs, and in the paper it is the most reliable source of marks in the graph part of Algorithms: the questions are almost all **true-or-false statements about MSTs**, each decided by one of two properties." },
    { t: "p", text: "The two properties, the **cut property** and the **cycle property**, are the whole theory. If you can state them precisely and know what changes when the weights are distinct, you can settle every statement in the paper. This chapter states them, proves them in three lines each, runs the two standard algorithms (Kruskal and Prim) by hand, and then applies the properties to the real questions." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["define a spanning tree and a minimum spanning tree and say how many edges they have;", "state the cut property and the cycle property and use them for distinct weights;", "run Kruskal and Prim by hand and state their costs;", "decide when an MST is unique and count MSTs when weights tie;", "say what happens to an MST when every weight is changed by the same amount, or one edge is added;", "explain why an MST is not a shortest-path tree."] },

    { t: "h2", text: "Spanning trees" },
    { t: "p", text: "A **spanning tree** of a connected undirected graph G with n vertices is a subgraph that contains all n vertices, is connected, and has no cycle. Every spanning tree has exactly **n − 1 edges**: fewer edges would leave it disconnected, more would create a cycle. With edge weights, the **weight** of a spanning tree is the sum of its edge weights, and an **MST** is a spanning tree of least weight. A graph can have many spanning trees (the complete graph on n vertices has nⁿ⁻² of them) and may have more than one MST when weights repeat." },
    { t: "p", text: "Two small facts will be used again. Adding an edge to a tree creates exactly **one cycle**. Removing an edge from a tree splits it into **two components**, and the edges between those two components form a **cut**." },

    { t: "h2", text: "The cut property and the cycle property" },
    { t: "p", text: "A **cut** of a graph splits the vertices into two non-empty sets S and V∖S; the edges with one end in each set **cross** the cut. The **cut property** says: **the lightest edge crossing a cut belongs to some MST.** If the lightest crossing edge is **unique** (no other crossing edge has the same weight), it belongs to **every** MST." },
    { t: "p", text: "The proof is an exchange argument. Let e be the lightest edge crossing the cut and let T be an MST that does not contain e. Adding e to T creates a cycle, and that cycle must cross the cut again by some other edge f. Then T − f + e is a spanning tree, and since e is no heavier than f, it is no heavier than T. So an MST containing e exists. If e is strictly lighter than f, the new tree is lighter, which contradicts T being an MST: so every MST contains e." },
    { t: "p", text: "The **cycle property** says: **the heaviest edge on a cycle is not in some MST**; if it is the **unique** heaviest edge of that cycle, it is in **no** MST. Proof: if an MST T contained the unique heaviest edge e of a cycle, removing e splits T into two parts; some other edge f of the cycle reconnects them (the cycle must cross the cut), and f is strictly lighter than e, so T − e + f is a lighter spanning tree, a contradiction." },
    { t: "callout", kind: "key", text: "Cut property: the lightest edge across any cut is in an MST (in every MST if it is the unique lightest across that cut). Cycle property: the heaviest edge on any cycle is out of an MST (out of every MST if it is the unique heaviest on that cycle)." },
    { t: "p", text: "When **all weights are distinct**, every cut has a unique lightest edge and every cycle has a unique heaviest edge, so the properties become exact. Then the MST is **unique** (the cut property forces each edge in or out, with no choice left). This is the usual setting of the questions, and the words 'distinct weights' or 'unique weights' in a statement are the cue to apply the properties without hedging." },
    { t: "ex", id: "a8-e1" },
    { t: "ex", id: "a8-e2" },

    { t: "h2", text: "Kruskal's algorithm" },
    { t: "p", text: "**Kruskal's algorithm** is the cut property used edge by edge. Sort all edges by weight, lightest first. Go down the list and take each edge unless it would form a cycle with the edges already taken. Stop when n − 1 edges have been taken. To test 'would this edge form a cycle?' quickly, Kruskal keeps a **disjoint-set (union-find)** structure: the edge (u, v) closes a cycle exactly when u and v are already in the same set; otherwise take it and **merge** the two sets." },
    { t: "fig", id: "a8-f1" },
    { t: "code", text: `#include <stdio.h>

int par[6];
int find(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main(void) {
    /* edges sorted by weight: a, b, weight */
    int e[8][3] = {{1, 2, 1}, {1, 3, 2}, {3, 4, 2}, {0, 2, 3}, {0, 1, 4}, {2, 3, 4}, {4, 5, 6}, {3, 5, 7}};
    int total = 0;
    for (int i = 0; i < 6; i++) par[i] = i;
    for (int i = 0; i < 8; i++) {
        int ra = find(e[i][0]), rb = find(e[i][1]);
        if (ra != rb) { par[ra] = rb; total += e[i][2]; }      /* no cycle: take the edge */
    }
    printf("%d\\n", total);
    return 0;
}`, out: "14", file: "kruskal.c" },
    { t: "p", text: "The table in the figure traces the program on a graph of six vertices and eight edges. Edge (1, 2) of weight 1 is taken; so are (1, 3) of weight 2, (3, 4) of weight 2 and (0, 2) of weight 3. The next two, (0, 1) and (2, 3), would close cycles (vertices 0 and 1 are already connected through 2), so they are skipped. Edge (4, 5) of weight 6 is taken, and (3, 5) is skipped. Five edges, total weight 1 + 2 + 2 + 3 + 6 = 14." },
    { t: "p", text: "The cost is dominated by sorting the edges, Θ(m log m) = Θ(m log n), since m ≤ n² gives log m ≤ 2 log n. With union-find the cycle tests cost almost nothing (nearly constant each). So Kruskal is **Θ(m log n)**, good for sparse graphs." },

    { t: "h2", text: "Prim's algorithm" },
    { t: "p", text: "**Prim's algorithm** grows one tree from a starting vertex. At each step it looks at all edges with exactly one end in the tree, takes the lightest, and adds its other end to the tree. This is again the cut property: the cut separates the tree from the rest, and the lightest crossing edge is safe. With a binary heap of the crossing edges the cost is **Θ(m log n)**; with a Fibonacci heap it is Θ(m + n log n); with an adjacency matrix and a plain array of 'best edge to the tree' for each vertex it is Θ(n²), which is better for dense graphs." },
    { t: "fig", id: "a8-f2" },
    { t: "p", text: "On the same graph, starting from vertex 0, Prim adds (0, 2) of weight 3, then (2, 1) of weight 1, then (1, 3) of weight 2, then (3, 4) of weight 2, and finally (4, 5) of weight 6: the same total 14. The order differs from Kruskal's, but the set of edges, and so the weight, is the same: with distinct weights both algorithms must produce the unique MST." },
    { t: "table", head: ["", "Kruskal", "Prim"], rows: [
      ["Grows", "a forest of components that merge", "one tree from a start vertex"],
      ["Needs", "sorted edges and union-find", "a priority queue of crossing edges"],
      ["Time", "Θ(m log n)", "Θ(m log n) with a heap; Θ(n²) with a matrix"],
      ["Best for", "sparse graphs", "dense graphs"],
    ], caption: "Kruskal against Prim: the same answer, found two ways." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    /* one MST: path 1-2-3-...-100 in the complete graph with weight |i - j| */
    int total = 0;
    for (int i = 1; i < 100; i++) total += 1;                 /* each edge (i, i+1) has weight 1 */
    printf("%d\\n", total);
    return 0;
}`, out: "99", file: "mst_complete_graph.c" },
    { t: "p", text: "A question in GATE 2020 puts this to use: a complete graph on vertices v₁ to v₁₀₀ where the edge (vᵢ, vⱼ) has weight |i − j|. The lightest edges are those of weight 1, joining consecutive vertices, and the 99 of them form a path through all the vertices, a spanning tree. Any spanning tree needs 99 edges and every edge weighs at least 1, so 99 is the minimum." },
    { t: "ex", id: "a8-e3" },

    { t: "h2", text: "Is the MST unique? Counting MSTs" },
    { t: "p", text: "If all the edge weights are distinct, the MST is unique. If some weights repeat, there may be several MSTs, but **they all have the same weight**, and they all contain, for each weight value, the same **number** of edges of that weight. A statement that 'a minimum-weight edge is in every MST' fails when the minimum is attained by several edges that can substitute for each other." },
    { t: "p", text: "The standard small counterexample is a triangle with three equal weights. Any two of the three edges make an MST, so there are three MSTs, and no single edge belongs to all of them. So 'there exists a minimum-weight edge present in every MST' is **false** in general (GATE 2021, statement S₁), while 'if every edge has a distinct weight, the MST is unique' is **true** (statement S₂). The answer is S₁ false, S₂ true." },
    { t: "ex", id: "a8-e4" },
    { t: "p", text: "Two further statements often paired with these. 'Statement I: G has a unique MST if no two edges have the same weight' is true. 'Statement II: G has a unique MST if for every cut there is a unique minimum-weight crossing edge' is also true, since that condition is exactly what the cut property needs to force every MST edge: both are true in GATE 2019. And 'the MST is unique and so is the shortest path between any two vertices' is false for the second part: two different paths can have the same total weight even when all the individual weights are distinct (1 + 4 = 2 + 3). So in GATE 2017 only statement I is true." },
    { t: "p", text: "To **count** MSTs of a graph given as a picture (the questions with figures in 2018, 2021, 2024), process the edges in groups of equal weight, as Kruskal does. For each weight value, look at how many edges of that weight Kruskal must take and in how many ways it can choose them without forming a cycle with the lighter edges already taken; the number of MSTs is the **product** of these counts over the weight values. A parameter x in the figure that decides ties (to maximise the count, or to force an edge into every MST) is solved by placing x relative to its neighbours: an edge is in every MST if every cycle through it has another edge no lighter than it that is not forced, and is out of every MST if it is the unique heaviest edge of some cycle." },

    { t: "h2", text: "When the graph changes" },
    { t: "p", text: "**Add the same constant to every weight.** Every spanning tree has exactly n − 1 edges, so adding α to every weight adds (n − 1)α to the weight of **every** spanning tree. The ranking of spanning trees does not change: every MST stays an MST, and no new one appears. But shortest paths **can** change: a path with k edges gains kα, so a path with few heavy edges may beat a path with many light edges after the addition. GATE 2025: MSTs unchanged, shortest paths may change." },
    { t: "p", text: "A small example makes it concrete. A graph has vertices s, a, t with edges s–a of weight 1, a–t of weight 1 and s–t of weight 3. The shortest path from s to t is s–a–t with length 2. Add α = 5: the edges weigh 6, 6, 8, so the path via a costs 12 and the direct edge costs 8. The shortest path changes from the two-edge path to the direct edge. The MST edges, {s–a, a–t} before and after, do not change." },
    { t: "p", text: "**Add one edge (u, v) to G and ask whether T is still an MST.** By the cycle property, T stays an MST exactly when the new edge is **not lighter than the heaviest edge on the tree path from u to v**. Finding that path in T takes a traversal of the tree (T has n − 1 edges), which costs Θ(n) with adjacency lists. So the whole test costs **Θ(|V|)**, which is GATE 2020's answer D: the check does not need to look at the other edges of G at all." },
    { t: "ex", id: "a8-e5" },
    { t: "p", text: "**MST against shortest path.** In a graph with positive weights let T be an MST and let d₁(u, v) and d₂(u, v) be the shortest distances between u and v in G and in T. Since T is a subgraph of G, every path of T is a path of G, so **d₁ ≤ d₂** always. They can differ: the MST may leave out a heavy-looking edge that is the shortest route between its ends. In a triangle with weights 2, 2, 3, the MST uses the two weight-2 edges; the distance between the ends of the weight-3 edge is 3 in G but 4 in T. The two trees solve different problems: the MST minimises the **total** weight, a shortest-path tree minimises each **individual** distance from a source." },
    { t: "ex", id: "a8-e6" },
    { t: "trap", i: 0 },
    { t: "trap", i: 1 },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Spanning tree: connects all n vertices with n − 1 edges and no cycle; MST: least total weight.", "Cut property: the lightest edge across a cut is in an MST (every MST if unique). Cycle property: the heaviest edge on a cycle is out of an MST (every MST if unique).", "Distinct weights ⇒ unique MST; every min-weight-edge-in-every-MST claim needs a unique minimum.", "Kruskal: sort edges, union-find, Θ(m log n). Prim: grow from a vertex with a heap, Θ(m log n), or Θ(n²) with a matrix.", "Add a constant to all weights: MSTs unchanged, shortest paths can change.", "New edge (u, v): T stays an MST unless the new edge is lighter than the heaviest edge on the tree path u–v; the test costs Θ(|V|).", "d₁(u, v) ≤ d₂(u, v): a shortest path in G is never longer than one in the MST."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a8-f1", caption: "Kruskal's algorithm on a graph of six vertices: edges in order of weight, with the decision for each. The five taken edges (weights 1, 2, 2, 3, 6) form the MST of weight 14.", alt: "A table of eight edges sorted by weight with take or skip for each; five are taken.", fig: { kind: "trace", title: "Kruskal: take an edge unless it closes a cycle", cols: ["edge", "weight", "same set already?", "decision"], rows: [
      { cells: ["1–2", 1, "no", "take"], tone: "ok" }, { cells: ["1–3", 2, "no", "take"], tone: "ok" }, { cells: ["3–4", 2, "no", "take"], tone: "ok" },
      { cells: ["0–2", 3, "no", "take"], tone: "ok" }, { cells: ["0–1", 4, "yes: 0 and 1 joined via 2", "skip"], tone: "bad" }, { cells: ["2–3", 4, "yes", "skip"], tone: "bad" },
      { cells: ["4–5", 6, "no", "take"], tone: "ok" }, { cells: ["3–5", 7, "yes", "skip"], tone: "bad" },
    ] } },
    { type: "figure", id: "a8-f2", caption: "The graph with its MST edges highlighted (weight 14). Prim from vertex 0 adds the edges in the order 0–2, 2–1, 1–3, 3–4, 4–5.", alt: "A graph on six vertices with edge weights; the five MST edges are highlighted.", fig: { kind: "net", w: 540, h: 260, nodes: [
      { id: "0", label: "0", x: 50, y: 120 }, { id: "1", label: "1", x: 160, y: 40 }, { id: "2", label: "2", x: 160, y: 200 },
      { id: "3", label: "3", x: 300, y: 120 }, { id: "4", label: "4", x: 420, y: 60 }, { id: "5", label: "5", x: 480, y: 200 },
    ], edges: [
      { a: "0", b: "1", label: "4" }, { a: "0", b: "2", label: "3", hl: true }, { a: "1", b: "2", label: "1", hl: true }, { a: "1", b: "3", label: "2", hl: true },
      { a: "2", b: "3", label: "4" }, { a: "3", b: "4", label: "2", hl: true }, { a: "4", b: "5", label: "6", hl: true }, { a: "3", b: "5", label: "7" },
    ] } },

    { type: "example", id: "a8-e1", level: "gate", title: "GATE CS 2026 (forenoon), Q49 · 2 marks · MSQ: unique edge weights", file: "gate2026_fn_q49.txt", given: `G is a simple undirected graph with unique edge weights. Which statements about its MSTs are true?
A) In every cycle C, the edge with the largest weight in C is not in any MST.
B) In every cycle C, the edge with the smallest weight in C is in every MST.
C) For every vertex v, the edge with the largest weight incident on v is not in any MST.
D) For every vertex v, the edge with the smallest weight incident on v is in every MST.`, find: "The true statements.", steps: [
      { say: "A: the cycle property with a unique heaviest edge: that edge is in no MST.", result: "A true" },
      { say: "B: the lightest edge of one cycle may be the heaviest edge of another cycle through it, and then it is excluded. A triangle with weights 5, 6, 7 and a second cycle 5, 1, 2, 3 (the edge of weight 5 closing a path of 1, 2, 3): the edge of weight 5 is the lightest in the triangle but the heaviest in the second cycle, so it is in no MST.", result: "B false" },
      { say: "C: a vertex of degree 1 has only one edge, the largest incident, and it must be in every spanning tree. A path graph breaks C.", result: "C false" },
      { say: "D: take the cut ({v}, rest). The lightest edge crossing it is the lightest edge at v, and it is unique, so it is in every MST.", result: "D true" },
    ], answer: "A, D", check: "A leaf edge is both the lightest and the heaviest at its leaf and is always in the tree: this kills C." },
    { type: "example", id: "a8-e2", level: "gate", title: "GATE CS 2022 (forenoon), Q49 · 2 marks · MSQ: distinct weights and MSTs", file: "gate2022_fn_q49.txt", given: `G is a simple undirected weighted graph, all edge weights distinct.
A) The edge with the second smallest weight is always part of any MST.
B) One or both of the edges with the third and fourth smallest weights are part of any MST.
C) For S ⊂ V (non-empty, proper), the minimum-weight edge with one end in S and the other in V∖S is always part of any MST.
D) G can have multiple MSTs.`, find: "The true statements.", steps: [
      { say: "A: the two lightest edges cannot form a cycle (a cycle in a simple graph has at least 3 edges), so Kruskal takes both.", result: "A true" },
      { say: "B: the third lightest edge is rejected only if it closes a triangle with the two lightest. Then the fourth lightest cannot also close a cycle with the first two (a simple graph has no parallel edge to the third), so it is taken. At least one of the two is in.", result: "B true" },
      { say: "C: the cut property with distinct weights: the minimum crossing edge is unique and in every MST.", result: "C true" },
      { say: "D: distinct weights give a unique MST.", result: "D false" },
    ], answer: "A, B, C", check: "Kruskal's order makes each of A, B visible." },
    { type: "example", id: "a8-e3", level: "gate", title: "GATE CS 2020 (forenoon), Q56 · 2 marks · NAT: the MST of a complete graph with weight |i − j|", file: "gate2020_fn_q56.txt", given: `G has vertices v1..v100, an edge (vi, vj) for every pair i < j, with weight |i − j|. The weight of a minimum spanning tree?`, find: "The MST weight.", steps: [
      { say: "Every edge weighs at least 1, and a spanning tree has 99 edges, so the weight is at least 99.", result: "≥ 99" },
      { say: "The 99 edges (vi, vi+1) each weigh 1 and form a path through all vertices: a spanning tree of weight 99.", result: "99" },
    ], answer: "99", check: "The program in this chapter adds 99 ones." },
    { type: "example", id: "a8-e4", level: "gate", title: "GATE CS 2021 (afternoon), Q64 · 1 mark · two statements about MSTs", file: "gate2021_an_q64.txt", given: `G is a connected undirected weighted graph.
S1: There exists a minimum weight edge in G which is present in every MST.
S2: If every edge has a distinct weight, then G has a unique MST.
A) both true   B) S1 true, S2 false   C) S1 false, S2 true   D) both false`, find: "Which statements are true.", steps: [
      { say: "S1: a triangle with all weights 1. The minimum weight edges are all three; every MST uses two of them, so no edge is in all MSTs. S1 is false.", result: "S1 false" },
      { say: "S2: distinct weights make every cut's lightest edge unique, so the cut property fixes every edge: one MST.", result: "S2 true" },
    ], answer: "C", check: "If S1 said 'the MST contains AT LEAST ONE minimum-weight edge' it would be true." },
    { type: "example", id: "a8-e5", level: "gate", title: "GATE CS 2020 (forenoon), Q39 · 2 marks · is T still an MST after an edge is added?", file: "gate2020_fn_q39.txt", given: `G = (V, E) is a weighted undirected graph, T an MST kept as adjacency lists. A new weighted edge (u, v) is added. The worst-case time to determine whether T is still an MST of the new graph?
A) Θ(|E| + |V|)   B) Θ(|E||V|)   C) Θ(|E| log |V|)   D) Θ(|V|)`, find: "The complexity.", steps: [
      { say: "By the cycle property, T is still an MST iff the new edge is not lighter than the heaviest edge on the tree path from u to v.", result: "one path to check" },
      { say: "Find the path in T by one traversal from u: T has |V| − 1 edges, so Θ(|V|). No other edge of G needs looking at.", result: "Θ(|V|)" },
    ], answer: "D", check: "Recomputing the MST from scratch would cost Θ(|E| log |V|): that is the wrong, tempting answer." },
    { type: "example", id: "a8-e6", level: "gate", title: "GATE CS 2025 (forenoon), Q18 · 1 mark · distances in G and in an MST", file: "gate2025_fn_q18.txt", given: `G is an undirected graph with positive edge weights, T an MST. d1(u, v) and d2(u, v) are the shortest distances between u and v in G and in T. Which is correct for all G, T, u, v?
A) d1 = d2   B) d1 ≤ d2   C) d1 ≥ d2   D) d1 ≠ d2`, find: "The relation that always holds.", steps: [
      { say: "T is a subgraph of G, so every path in T is a path in G. The shortest path in G is at most as long as the shortest path in T.", result: "d1 ≤ d2" },
      { say: "Equality can fail: a triangle with weights 2, 2, 3 has MST edges 2, 2; the distance across the weight-3 edge is 3 in G and 4 in T.", result: "A and D are not always true" },
    ], answer: "B", check: "Dropping edges can only lengthen shortest paths." },

    { type: "trap", wrong: "The lightest edge of a cycle is in every MST (and the heaviest edge at a vertex is in no MST).", tempting: "Light edges are cheap, so they are always chosen.", whyWrong: "The cycle property is about the HEAVIEST edge of a cycle. The lightest edge of one cycle may be the heaviest edge of another cycle through it, and then it is excluded. And the heaviest edge at a vertex may be its only edge (a leaf), which every spanning tree contains.", rule: "Cycle: the heaviest is out. Cut: the lightest crossing edge is in.", ex: { text: "A leaf's single edge is both the lightest and the heaviest at the leaf, and it is in every spanning tree." } },
    { type: "trap", wrong: "Adding a constant to every edge weight can change the MST, and shortest paths stay the same.", tempting: "It sounds the wrong way round: heavier edges change which tree is cheapest.", whyWrong: "Every spanning tree has exactly n − 1 edges, so every one gains (n − 1)α and the order of trees is unchanged: the MST stays. A path with k edges gains kα, so shortest paths with different edge counts are re-ranked: shortest paths can change.", rule: "Add a constant: MST same, shortest path may change.", ex: { text: "s–a 1, a–t 1, s–t 3: the shortest s–t path has 2 edges; after +5 the direct edge (8) beats the two-edge path (12)." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q49 · 2025 AN Q37 (in the section on changes) · 2025 FN Q18 · 2022 FN Q49 · 2021 AN Q64 · 2020 FN Q39, Q56 · 2019 FN Q44 · 2017 FN Q48. The questions that give their graph as a figure (2025 FN Q64, 2024 AN Q53, 2021 FN Q48, 2018 FN Q57) are answered by processing the edges in groups of equal weight, as in the counting method of the section on uniqueness." },
    { type: "recall", cards: [
      { q: "Edges of a spanning tree of n vertices?", a: "n − 1." },
      { q: "Cut property?", a: "The lightest edge across a cut is in some MST; in every MST if unique." },
      { q: "Cycle property?", a: "The heaviest edge on a cycle is out of some MST; out of every MST if unique." },
      { q: "Distinct weights imply?", a: "A unique MST." },
      { q: "Kruskal's idea and cost?", a: "Sort edges, take those that do not close a cycle (union-find); Θ(m log n)." },
      { q: "Prim's idea and cost?", a: "Grow a tree by the lightest crossing edge; Θ(m log n) with a heap, Θ(n²) with a matrix." },
      { q: "Add a constant to every weight?", a: "MSTs unchanged; shortest paths may change." },
      { q: "Is T still an MST after adding edge (u, v)?", a: "Yes iff the edge is not lighter than the heaviest edge on the tree path u–v; test costs Θ(|V|)." },
      { q: "d₁ against d₂ (G against its MST)?", a: "d₁ ≤ d₂." },
      { q: "Is the shortest path unique when weights are distinct?", a: "No: 1 + 4 = 2 + 3." },
      { q: "Is the MST unique when some weights tie?", a: "Not necessarily; all MSTs have the same weight." },
    ] },
    { type: "check", questions: [
      { id: "a8c1", kind: "NAT", marks: 1, q: "A connected graph has 12 vertices. How many edges does each of its spanning trees have?", answer: "11", solution: "n − 1 = 11." },
      { id: "a8c2", kind: "NAT", marks: 1, q: "A triangle has edge weights 2, 3, 3. How many distinct MSTs does it have?", answer: "2", solution: "The MST takes the weight-2 edge and one of the two weight-3 edges." },
      { id: "a8c3", kind: "MCQ", marks: 1, q: "Kruskal's algorithm with union-find on a graph of n vertices and m edges takes", options: ["Θ(n)", "Θ(m)", "Θ(m log n)", "Θ(n m)"], answer: "C", solution: "Sorting the edges dominates." },
      { id: "a8c4", kind: "MSQ", marks: 2, q: "G has distinct positive edge weights. Which are true?", options: ["G has a unique MST", "G has a unique shortest path between any two vertices", "The heaviest edge of every cycle is in no MST", "Adding 1 to every weight changes the MST"], answer: "A, C", solution: "B is false (1 + 4 = 2 + 3). D is false: every tree gains the same amount." },
      { id: "a8c5", kind: "NAT", marks: 2, q: "The MST of a graph has weight 50 and 9 edges. All weights are increased by 3. What is the new MST weight?", answer: "77", solution: "50 + 9 × 3 = 77." },
      { id: "a8c6", kind: "NAT", marks: 2, q: "Edges (u, v, weight): (a, b, 1), (b, c, 2), (a, c, 3), (c, d, 4), (b, d, 5). The weight of the MST?", answer: "7", solution: "Take 1, 2, 4: a–b, b–c, c–d. Total 7." },
      { id: "a8c7", kind: "MCQ", marks: 2, q: "T is an MST. A new edge (u, v) of weight 10 is added; the heaviest edge on the T-path from u to v has weight 12. Then", options: ["T is still an MST", "T is no longer an MST", "T has a cycle", "The new graph has no MST"], answer: "B", solution: "Replacing the weight-12 edge by the new weight-10 edge gives a lighter tree." },
      { id: "a8c8", kind: "NAT", marks: 2, q: "A complete graph on 5 vertices has edge (vi, vj) of weight |i − j|. The weight of its MST?", answer: "4", solution: "The path v1–v2–v3–v4–v5 has 4 edges of weight 1." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on spanning trees", sub: "Algorithms", href: "/topics/algorithms" }, { label: "Graph traversals", sub: "the chapter before this one", href: "/study/graph-traversals" }] },
    { type: "links", prereq: ["Graph traversals (A7)", "Greedy algorithms (A5)", "Disjoint sets (D14)", "Binary heaps (D10)"], usedIn: ["Shortest paths (A9): the contrast", "Computer Networks: spanning tree protocol"], cross: ["Data Structures: union-find, priority queues"] },
  ],
};
