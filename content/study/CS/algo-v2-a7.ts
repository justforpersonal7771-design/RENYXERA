import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A7 "Graph traversals" (28 Nov 2026). Representations, BFS (levels, distances, the edge fact), DFS (discovery and finishing times, the four edge classes,
 * the parenthesis theorem), components and cycles, topological order, strongly connected components, articulation points, and the BFS uses (bipartite test, tree diameter).
 * Real GATE questions (texts from public/data/questions.json), each re-solved here:
 * 2026 FN Q50 (DFS on a DAG: the options that never occur are B and D), 2025 AN Q29 (B, C and D are true), 2024 FN Q60 (a tree that is both a DFS and a BFS tree of a directed graph: only C holds for every such graph),
 * 2024 FN Q37 (a DFS forest with 40 edges on 100 vertices: 60 components), 2021 FN Q39 (articulation points: only B), 2021 AN Q25 (|A - B| = 1), 2018 FN Q40 (only I).
 * Questions that give their graph as a picture (2025 AN Q59 the two-BFS diameter, 2021 AN Q30, 2017 AN Q13) are covered by the methods.
 * Programs compiled and run with gcc: DFS times and edge classes of a 5-vertex digraph; BFS distances; articulation points 1 3; components 60.
 */
export const chapterA7: Topic = {
  id: "cs.algo.v2.graph7",
  title: "Graph traversals",
  no: "A7",
  book: [
    { t: "p", text: "A **graph** is a set of vertices joined by edges, and it is the model for roads, networks, dependencies, states and relationships. To use a graph you must be able to **visit** every vertex systematically. The two standard ways are **breadth-first search** (BFS), which explores in rings around the start, and **depth-first search** (DFS), which goes as deep as it can before backing up. Together with the minimum spanning tree and shortest-path chapters that follow, graph algorithms carry the largest share of the marks of the Algorithms subject." },
    { t: "p", text: "The questions in this chapter are almost all **reasoning about traversals**: what can an edge look like in a DFS tree, which statements about BFS levels hold, how many components does a forest imply, when is a vertex an articulation point. Each has a short argument, and the arguments are the same few ideas used again and again. This chapter gives the ideas first, then the questions." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["choose between an adjacency list and an adjacency matrix and state the costs;", "run BFS and DFS by hand and record distances, discovery times and finishing times;", "classify every edge as tree, back, forward or cross and say which kinds can occur in which graphs;", "count components from a DFS forest and detect a cycle;", "produce a topological order and find strongly connected components;", "decide whether a vertex is an articulation point;", "use BFS for shortest paths in unweighted graphs, bipartiteness and the diameter of a tree."] },

    { t: "h2", text: "Representing a graph" },
    { t: "p", text: "A graph G = (V, E) has |V| = n vertices and |E| = m edges. In an **undirected** graph an edge joins two vertices both ways; in a **directed** graph an edge (u, v) goes from u to v only. A graph is **simple** if it has no loops and no repeated edges, and then m ≤ n(n − 1)/2 for undirected graphs. A **tree** is a connected graph with no cycle; it has exactly n − 1 edges." },
    { t: "table", head: ["", "Adjacency list", "Adjacency matrix"], rows: [
      ["Space", "Θ(n + m)", "Θ(n²)"],
      ["Is (u, v) an edge?", "Θ(degree of u)", "Θ(1)"],
      ["List the neighbours of u", "Θ(degree of u)", "Θ(n)"],
      ["BFS or DFS of the whole graph", "Θ(n + m)", "Θ(n²)"],
    ], caption: "The two representations. For a sparse graph (m much less than n²) the list is better; for a dense graph the matrix is competitive and answers 'is there an edge?' at once." },
    { t: "p", text: "The traversal cost Θ(n + m) with a list is the figure to remember: each vertex is visited once and each edge is looked at once (twice if undirected). With a matrix, scanning for the neighbours of every vertex costs n per vertex, so Θ(n²)." },

    { t: "h2", text: "Breadth-first search" },
    { t: "p", text: "BFS starts at a source vertex s. It visits s, then all neighbours of s, then all their unvisited neighbours, and so on: ring after ring. It uses a **queue**: take the vertex at the front, append its unvisited neighbours to the back, mark them. Each vertex enters the queue at most once, so BFS costs Θ(n + m) with lists." },
    { t: "p", text: "The ring in which a vertex is found is its **BFS distance** from s: the least number of edges on a path from s to it. So in an **unweighted graph, BFS computes shortest paths**, and the BFS tree (each vertex hangs from the vertex that discovered it) contains a shortest path from s to every reachable vertex. A DFS tree is **not** a shortest-path tree: it goes deep and the paths it finds can be long. That is why 'a DFS tree of G is a shortest-path tree' is false in GATE 2025." },
    { t: "p", text: "One fact about undirected graphs settles several questions. If (u, v) is any edge of an undirected graph, the BFS distances of u and v from s differ by **at most 1**: if v were two or more steps farther, then going to u and taking the edge would be a shorter way to v. Equal distances are possible (an edge between two vertices in the same ring), so it is false that they must differ by exactly 1, as GATE 2018 statement II claims. For directed graphs the rule is only that the distance of v is at most the distance of u plus 1." },
    { t: "fig", id: "a7-f1" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    /* undirected: triangle 0-1-2, bridge 1-3, triangle 3-4-5 */
    int adj[6][6] = {{0}};
    int e[7][2] = {{0, 1}, {1, 2}, {2, 0}, {1, 3}, {3, 4}, {4, 5}, {5, 3}};
    for (int i = 0; i < 7; i++) adj[e[i][0]][e[i][1]] = adj[e[i][1]][e[i][0]] = 1;
    int dist[6], q[6], head = 0, tail = 0;
    for (int i = 0; i < 6; i++) dist[i] = -1;
    dist[0] = 0; q[tail++] = 0;
    while (head < tail) {
        int u = q[head++];
        for (int v = 0; v < 6; v++)
            if (adj[u][v] && dist[v] < 0) { dist[v] = dist[u] + 1; q[tail++] = v; }
    }
    for (int i = 0; i < 6; i++) printf("%d ", dist[i]);
    printf("\\n");
    return 0;
}`, out: "0 1 1 2 3 3", file: "bfs_distances.c" },
    { t: "p", text: "In the figure and the program the source is vertex 0, and the distances are 0, 1, 1, 2, 3, 3. The edge from vertex 1 to vertex 2 joins two vertices of the same ring (both 1); the edge from 4 to 5 joins two of ring 3. Neither breaks the rule that distances differ by at most 1." },
    { t: "ex", id: "a7-e1" },
    { t: "callout", kind: "key", text: "BFS: queue; Θ(n + m); shortest paths in unweighted graphs; for an undirected edge (u, v) the BFS distances differ by 0 or 1. DFS trees are not shortest-path trees." },
    { t: "trap", i: 0 },
    { t: "trap", i: 1 },

    { t: "h2", text: "Depth-first search and its clock" },
    { t: "p", text: "DFS starts at a vertex and follows an edge to an unvisited neighbour, then follows an edge from there, going deeper, until it reaches a vertex with no unvisited neighbour. It then **backs up** to the previous vertex and tries its next neighbour. When all vertices reachable from the start are done, DFS starts again from any unvisited vertex, so that every vertex is visited. It uses recursion (or an explicit stack) and costs Θ(n + m) with lists." },
    { t: "p", text: "DFS keeps a **clock**. It ticks once when a vertex is first reached, giving the **discovery time** d[v], and once when the vertex is finished, giving the **finishing time** f[v], after all its descendants are done. So each vertex has an interval [d[v], f[v]], and the intervals have a strict structure. The **parenthesis theorem** says that for any two vertices, the intervals are either **nested** (one inside the other, when one is an ancestor of the other in the DFS tree) or **disjoint** (neither is an ancestor of the other). Two intervals can never partly overlap." },
    { t: "p", text: "The edges followed to discover new vertices form the **DFS forest** (a tree for each start). Every other edge falls into one of three classes, according to the intervals of its ends. For a directed edge (u, v), when DFS examines it from u:" },
    { t: "table", head: ["Class", "What v is", "Intervals"], rows: [
      ["Tree edge", "v undiscovered; the edge discovers it", "[d(v), f(v)] inside [d(u), f(u)]"],
      ["Back edge", "v is an ancestor of u (still open)", "[d(u), f(u)] inside [d(v), f(v)]"],
      ["Forward edge", "v is a descendant of u, already finished, not a child", "[d(v), f(v)] inside [d(u), f(u)]"],
      ["Cross edge", "v is in a different branch, already finished", "[d(v), f(v)] entirely before [d(u), f(u)]"],
    ], caption: "The four edge classes in a directed graph. A forward edge and a tree edge both go to a descendant; the difference is that a tree edge is the one that discovered v." },
    { t: "fig", id: "a7-f2" },
    { t: "code", text: `#include <stdio.h>

int adj[5][4] = {{1, 2, 3, -1}, {3, -1}, {3, -1}, {4, -1}, {1, -1}};
int d[5], f[5], clk = 0, tree = 0, back = 0, fwd = 0, cross = 0;

void dfs(int u) {
    d[u] = ++clk;
    for (int k = 0; adj[u][k] >= 0; k++) {
        int v = adj[u][k];
        if (d[v] == 0) { tree++; dfs(v); }
        else if (f[v] == 0) back++;                  /* v is still open: an ancestor */
        else if (d[u] < d[v]) fwd++;                 /* finished descendant */
        else cross++;                                /* finished, in another branch */
    }
    f[u] = ++clk;
}

int main(void) {
    dfs(0);
    for (int i = 0; i < 5; i++) printf("%d ", d[i]);
    printf("| ");
    for (int i = 0; i < 5; i++) printf("%d ", f[i]);
    printf("| tree=%d back=%d forward=%d cross=%d\\n", tree, back, fwd, cross);
    return 0;
}`, out: "1 2 8 3 4 | 10 7 9 6 5 | tree=4 back=1 forward=1 cross=1", file: "dfs_times.c" },
    { t: "p", text: "The program runs DFS on a directed graph with edges 0→1, 0→2, 0→3, 1→3, 2→3, 3→4 and 4→1. From vertex 0 the search goes to 1, then 3, then 4. From 4 the edge to 1 is a **back edge**, because 1 is still open. The search backs up to 0 and takes 0→2; from 2 the edge 2→3 goes to the finished vertex 3 in another branch: a **cross edge**. Back at 0, the edge 0→3 goes to a finished descendant that was not discovered through this edge: a **forward edge**. The tree edges are 0→1, 1→3, 3→4 and 0→2." },
    { t: "p", text: "Which classes can occur depends on the graph. In an **undirected** graph there are **no cross edges** and no forward edges as separate kinds: every non-tree edge joins a vertex to an ancestor (called a back edge, seen as 'forward' from the other end). If there were an edge between two branches, the search would have crossed it and put the two vertices in one branch. This is why GATE 2018 statement I, 'no edge is a cross edge for the DFS tree of a simple undirected graph', is true, and statement II (distances differ by exactly 1) is false: the answer is 'I only'." },
    { t: "ex", id: "a7-e2" },

    { t: "h2", text: "Edges in a directed acyclic graph" },
    { t: "p", text: "A directed graph is a **DAG** if it has no directed cycle. A fundamental fact ties cycles to DFS: **a directed graph has a cycle if and only if some DFS finds a back edge.** A back edge (u, v) plus the tree path from v down to u forms a cycle; conversely, in any cycle the first vertex to be discovered has an edge coming back to it from the cycle's last vertex, while it is still open. So a DAG has **no back edges** in any DFS." },
    { t: "p", text: "Use this on GATE 2026. For an edge (u, v) of a DAG, which of the four interval arrangements will **never** occur? Option A, d[u] < d[v] < f[v] < f[u], is the nesting of a tree or a forward edge: possible. Option B, d[v] < d[u] < f[u] < f[v], puts u inside v: a back edge: **never** in a DAG. Option C, d[v] < f[v] < d[u] < f[u], has v finished before u starts: a cross edge: possible. Option D, d[u] < d[v] < f[u] < f[v], is a partial overlap of the two intervals, which the parenthesis theorem forbids: **never**, in any graph. The answer is B and D." },
    { t: "ex", id: "a7-e3" },
    { t: "p", text: "A second question stacks a restriction. Suppose T is a DFS tree of a directed graph rooted at v **and also a BFS tree** of it. Which statements hold for every such graph? Back edges can exist (an edge from a leaf back to the root does not disturb either tree). Cross edges can exist (two sibling leaves with an edge between them: the DFS reached one first, and BFS distances are unaffected). Other edges besides the tree edges can exist, so 'only tree edges' is false. But a **forward edge** cannot exist: it would run from a vertex to a descendant at least two levels below, which would be a shorter path to that descendant than the tree path, so T would not be a BFS tree. The only statement true for every such graph is: no forward edges." },
    { t: "ex", id: "a7-e4" },
    { t: "callout", kind: "key", text: "Directed cycle ⇔ a DFS back edge. Undirected graphs: no cross edges. DFS intervals are nested or disjoint, never partly overlapping. If a DFS tree is also a BFS tree, there are no forward edges." },

    { t: "h2", text: "Components, cycles and the DFS forest" },
    { t: "p", text: "In an undirected graph a **connected component** is a maximal set of vertices that can reach one another. Each DFS (or BFS) start discovers exactly one whole component, so the DFS forest has **one tree per component**. A forest of c trees on n vertices has n − c edges, since each tree on k vertices has k − 1 edges. Hence the number of components is **n minus the number of forest edges**. GATE 2024: 100 vertices and a DFS forest of 40 edges give 100 − 40 = 60 components." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n = 100, forest_edges = 40;
    printf("%d\\n", n - forest_edges);
    return 0;
}`, out: "60", file: "components.c" },
    { t: "ex", id: "a7-e5" },
    { t: "p", text: "A cycle in an **undirected** graph shows up in a DFS as a non-tree edge to a vertex other than the parent. A graph is a forest exactly when a DFS finds no such edge, which also means m = n − c. Both BFS and DFS find the connected components in Θ(n + m), which is the last statement of GATE 2025 (true)." },
    { t: "p", text: "A small exercise with the two orders of exploration (GATE 2021): in a complete binary tree with 7 nodes, label the nodes 1 (root), 2 and 3 (its children), 4, 5, 6, 7 (the leaves, left to right). BFS from the root visits 1, 2, 3 first. DFS goes down the left side: 1, 2, 4. The first three elements are A = {1, 2, 3} and B = {1, 2, 4}, and |A − B| = |{3}| = 1." },

    { t: "h2", text: "Topological order and strongly connected components" },
    { t: "p", text: "A **topological order** of a DAG lists the vertices so that every edge goes from an earlier vertex to a later one. It exists exactly when the graph is a DAG. It is the order in which tasks can be done when edges mean 'must come before'. Two methods give it in Θ(n + m): run DFS and list the vertices in **decreasing finishing time**, or repeatedly remove a vertex with no incoming edges (Kahn's algorithm). The first works because for every edge (u, v) of a DAG, f[u] > f[v]: the interval of v is inside that of u or entirely before it." },
    { t: "p", text: "A **strongly connected component** (SCC) of a directed graph is a maximal set of vertices in which every vertex can reach every other. The graph of components, with one node per SCC, is always a DAG. **Kosaraju's algorithm** finds them: run DFS on G and note the finishing times; then run DFS on the **reverse graph** (all edges flipped), starting the searches in decreasing order of finishing time; each tree of the second search is one SCC. It costs Θ(n + m). A directed graph is strongly connected if it has exactly one SCC; a DAG has n SCCs of one vertex each." },

    { t: "h2", text: "Articulation points" },
    { t: "p", text: "An **articulation point** (cut vertex) of a connected undirected graph is a vertex whose removal, with its edges, disconnects the graph. The DFS tree gives a clean test. The **root** is an articulation point exactly when it has **two or more children** in the DFS tree: without the root, the subtrees of different children have no edges between them (there are no cross edges in an undirected DFS). A **non-root** vertex u is an articulation point exactly when it has a child c such that no vertex in c's subtree has a back edge to a proper ancestor of u: then removing u cuts that subtree off." },
    { t: "p", text: "A **leaf** of the DFS tree is never an articulation point, since removing it leaves the rest of the tree connected. And if u is an articulation point with x an ancestor and y a descendant of u, it is **not** true that all x–y paths pass through u: y may lie in a subtree that has a back edge to a vertex above u, which gives a path around u. So GATE 2021 has one true statement: the root is an articulation point if and only if it has two or more children." },
    { t: "fig", id: "a7-f3" },
    { t: "ex", id: "a7-e6" },

    { t: "h2", text: "BFS at work: bipartite graphs and the diameter of a tree" },
    { t: "p", text: "A graph is **bipartite** if its vertices can be split into two sets with every edge between the sets (equivalently, two-colourable, equivalently it has no odd cycle). BFS tests it: colour the source red, its neighbours blue, theirs red, and so on by level parity. If an edge ever joins two vertices of the same colour (two vertices in the same ring), the graph has an odd cycle and is not bipartite. Otherwise it is bipartite." },
    { t: "p", text: "The **diameter** of a tree is the length of its longest path. There is a neat method: run BFS from any vertex and take a farthest vertex u; run BFS again from u and take a farthest vertex z; the distance from u to z is the diameter. The question in GATE 2025 runs exactly this on a tree given as a figure, so you carry out the two searches on the picture; the answer is the largest distance found in the second search." },
    { t: "p", text: "DFS also yields the DFS order for **cycle detection** and for the **number of paths** in a DAG, which leads into dynamic programming over a DAG: process vertices in topological order and compute, for each vertex, the best value over its incoming edges. The 'quality-score' question in GATE 2021 (the best product of weights along a path from the source in a DAG) is of this kind, and we meet its cousin, shortest paths in a DAG, in the shortest-paths chapter." },

    { t: "h2", text: "Questions that come with a picture" },
    { t: "p", text: "Four traversal questions give their graph as a picture. Each is solved here from the picture, by reading the edges and running the method of this chapter." },
    { t: "ex", id: "a7-e7" },
    { t: "ex", id: "a7-e8" },
    { t: "ex", id: "a7-e9" },
    { t: "ex", id: "a7-e10" },
    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Adjacency list: Θ(n + m) space and traversal; matrix: Θ(n²) both.", "BFS: queue, rings, Θ(n + m); BFS distances = shortest paths in an unweighted graph; for undirected edge (u, v) the distances differ by 0 or 1; a DFS tree is not a shortest-path tree.", "DFS: discovery and finishing times; intervals nested or disjoint; edge classes tree, back, forward, cross.", "Undirected DFS: no cross edges. Directed cycle ⇔ DFS back edge, so a DAG has none; DFS tree = BFS tree implies no forward edges.", "Components = n − (forest edges); BFS and DFS both find components.", "Topological order = decreasing finish time; SCCs by Kosaraju (two DFS passes).", "Articulation point: root with ≥ 2 children, or a vertex with a child subtree having no back edge above it; leaves never are."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a7-f1", caption: "BFS from vertex 0 on two triangles joined by a bridge. The rings are {0}, {1, 2}, {3}, {4, 5}; the distances are 0, 1, 1, 2, 3, 3. Edges inside a ring join vertices of equal distance.", alt: "Two triangles 0-1-2 and 3-4-5 joined by the edge 1-3, with the vertices labelled by their BFS distance from vertex 0.", fig: { kind: "net", w: 520, h: 220, nodes: [
      { id: "0", label: "0", x: 50, y: 110, hl: true }, { id: "1", label: "1", x: 150, y: 50 }, { id: "2", label: "2", x: 150, y: 170 },
      { id: "3", label: "3", x: 290, y: 110 }, { id: "4", label: "4", x: 410, y: 50 }, { id: "5", label: "5", x: 410, y: 170 },
    ], edges: [
      { a: "0", b: "1" }, { a: "0", b: "2" }, { a: "1", b: "2" }, { a: "1", b: "3" }, { a: "3", b: "4" }, { a: "3", b: "5" }, { a: "4", b: "5" },
    ] } },
    { type: "figure", id: "a7-f2", caption: "DFS on the directed graph of the program: tree edges 0→1, 1→3, 3→4, 0→2; back edge 4→1; cross edge 2→3; forward edge 0→3. Intervals: vertex 0 [1, 10], 1 [2, 7], 3 [3, 6], 4 [4, 5], 2 [8, 9].", alt: "A directed graph on vertices 0 to 4 with each edge labelled tree, back, cross or forward.", fig: { kind: "net", w: 520, h: 250, nodes: [
      { id: "0", label: "0", x: 60, y: 60, hl: true }, { id: "1", label: "1", x: 200, y: 40 }, { id: "3", label: "3", x: 330, y: 80 }, { id: "4", label: "4", x: 440, y: 170 }, { id: "2", label: "2", x: 150, y: 190 },
    ], edges: [
      { a: "0", b: "1", dir: true, label: "tree" }, { a: "1", b: "3", dir: true, label: "tree" }, { a: "3", b: "4", dir: true, label: "tree" }, { a: "0", b: "2", dir: true, label: "tree" },
      { a: "4", b: "1", dir: true, label: "back", hl: true }, { a: "2", b: "3", dir: true, label: "cross" }, { a: "0", b: "3", dir: true, label: "forward" },
    ] } },
    { type: "figure", id: "a7-f3", caption: "Articulation points of the two-triangle graph: removing vertex 1 separates vertex 0 and 2 from the rest, and removing vertex 3 separates 4 and 5. DFS lowlink values: 0, 0, 0, 3, 3, 3.", alt: "Two triangles joined by the edge 1-3, with vertices 1 and 3 highlighted as articulation points.", fig: { kind: "net", w: 520, h: 220, nodes: [
      { id: "0", label: "0", x: 50, y: 110 }, { id: "1", label: "1", x: 150, y: 50, hl: true }, { id: "2", label: "2", x: 150, y: 170 },
      { id: "3", label: "3", x: 290, y: 110, hl: true }, { id: "4", label: "4", x: 410, y: 50 }, { id: "5", label: "5", x: 410, y: 170 },
    ], edges: [
      { a: "0", b: "1" }, { a: "0", b: "2" }, { a: "1", b: "2" }, { a: "1", b: "3", hl: true }, { a: "3", b: "4" }, { a: "3", b: "5" }, { a: "4", b: "5" },
    ] } },

    { type: "example", id: "a7-e1", level: "gate", title: "GATE CS 2025 (afternoon), Q29 · 1 mark · MSQ: BFS and DFS on an undirected graph", file: "gate2025_an_q29.txt", given: `Which statements about BFS and DFS on an undirected simple graph G are TRUE?
A) A DFS tree of G is a shortest-path tree of G.
B) Every non-tree edge w.r.t. a DFS tree is a forward/back edge.
C) If (u, v) is a non-tree edge w.r.t. a BFS tree, the distances from s to u and v in the BFS tree are within ±1.
D) Both BFS and DFS can find the connected components.`, find: "The true statements.", steps: [
      { say: "A: DFS goes deep, so tree paths can be long. In a triangle s, a, b the DFS tree may be s–a–b, putting b at depth 2, while the true distance is 1.", result: "A false" },
      { say: "B: an undirected DFS has no cross edges; each non-tree edge joins a vertex and an ancestor: a back edge (forward from the other end).", result: "B true" },
      { say: "C: BFS distances of adjacent vertices differ by 0 or 1.", result: "C true" },
      { say: "D: each BFS or DFS start discovers one whole component.", result: "D true" },
    ], answer: "B, C, D", check: "The BFS program in this chapter shows edges inside a ring (difference 0) and between rings (difference 1)." },
    { type: "example", id: "a7-e2", level: "gate", title: "GATE CS 2018 (forenoon), Q40 · 2 marks · cross edges and BFS depths", file: "gate2018_fn_q40.txt", given: `G is a simple undirected graph, T_D a DFS tree, T_B a BFS tree.
(I) No edge of G is a cross edge with respect to T_D.
(II) For every edge (u, v) of G, if u is at depth i and v at depth j in T_B, then |i − j| = 1.
Which must necessarily be true?   A) I only   B) II only   C) both   D) neither`, find: "Which statements are necessarily true.", steps: [
      { say: "(I): in an undirected DFS an edge between two different branches cannot exist: the search would have followed it while the first branch was open.", result: "I is true" },
      { say: "(II): an edge inside a ring (a triangle) joins two vertices of equal depth, so |i − j| = 0.", result: "II is false" },
    ], answer: "A", check: "In the BFS example of this chapter, vertices 1 and 2 are adjacent and both at depth 1." },
    { type: "example", id: "a7-e3", level: "gate", title: "GATE CS 2026 (forenoon), Q50 · 2 marks · MSQ: DFS times on a DAG", file: "gate2026_fn_q50.txt", given: `DFS on a directed acyclic graph with discovery times d and finishing times f. For an edge (u, v), which options will NEVER be correct?
A) d[u] < d[v] < f[v] < f[u]   B) d[v] < d[u] < f[u] < f[v]   C) d[v] < f[v] < d[u] < f[u]   D) d[u] < d[v] < f[u] < f[v]`, find: "The impossible arrangements.", steps: [
      { say: "A: v's interval inside u's: v is a descendant of u (tree or forward edge). Possible.", result: "A possible" },
      { say: "B: u's interval inside v's: v is an ancestor of u, so (u, v) is a back edge, which would mean a cycle. Never in a DAG.", result: "B never" },
      { say: "C: v finishes before u starts: a cross edge to a finished vertex. Possible.", result: "C possible" },
      { say: "D: the intervals partly overlap, which the parenthesis theorem forbids in any graph.", result: "D never" },
    ], answer: "B, D", check: "The DFS program in this chapter shows intervals that are only ever nested or disjoint." },
    { type: "example", id: "a7-e4", level: "gate", title: "GATE CS 2024 (forenoon), Q60 · 2 marks · MSQ: a tree that is both a DFS and a BFS tree", file: "gate2024_fn_q60.txt", given: `G is a directed graph and T is a DFS spanning tree of G rooted at v. T is also a BFS tree of G rooted at v. Which are TRUE for every such G and T?
A) No back edges   B) No cross edges   C) No forward edges   D) The only edges of G are the edges of T`, find: "The statements true for every such graph.", steps: [
      { say: "A: take v with child a and an edge a → v. T is still both a DFS and a BFS tree, and a → v is a back edge. A false.", result: "A false" },
      { say: "B: take v with leaves a and b and an edge b → a, with a visited first. T is both trees and b → a is a cross edge. B false.", result: "B false" },
      { say: "C: a forward edge goes from u to a descendant at least two levels deeper, giving a shorter path than the tree path, which contradicts T being a BFS tree.", result: "C true" },
      { say: "D is false by the examples in A and B.", result: "D false" },
    ], answer: "C", check: "A tree path in a BFS tree is a shortest path, so no edge can shortcut it." },
    { type: "example", id: "a7-e5", level: "gate", title: "GATE CS 2024 (forenoon), Q37 · 2 marks · NAT: components from a DFS forest", file: "gate2024_fn_q37.txt", given: `The DFS forest of an undirected graph G with 100 vertices has 40 edges. The number of connected components of G?`, find: "The number of components.", steps: [
      { say: "Each DFS tree is one component. A tree with k vertices has k − 1 edges, so a forest of c trees on n vertices has n − c edges.", result: "edges = n − c" },
      { say: "40 = 100 − c.", result: "c = 60" },
    ], answer: "60", check: "If there were 1 component the forest would have 99 edges." },
    { type: "example", id: "a7-e6", level: "gate", title: "GATE CS 2021 (forenoon), Q39 · 2 marks · MSQ: articulation points and the DFS tree", file: "gate2021_fn_q39.txt", given: `T is a DFS tree of a connected undirected graph G. Which are correct?
A) The root of T can never be an articulation point.
B) The root of T is an articulation point iff it has 2 or more children.
C) A leaf of T can be an articulation point.
D) If u is an articulation point, x an ancestor and y a descendant of u in T, all paths from x to y pass through u.`, find: "The correct statements.", steps: [
      { say: "A and B: with two children, the subtrees of the children have no edge between them in an undirected DFS (no cross edges), so removing the root splits them. With one child, removing the root leaves the subtree connected. B is true, A false.", result: "B true, A false" },
      { say: "C: removing a leaf leaves the rest of the tree intact and connected.", result: "C false" },
      { say: "D: y may lie in a child subtree with a back edge to a vertex above u, giving a path around u.", result: "D false" },
    ], answer: "B", check: "In the two-triangle graph rooted at 0, vertex 0 has one child, so it is not an articulation point, while vertices 1 and 3 are." },

    { type: "example", id: "a7-e7", level: "gate", title: "GATE CS 2017 (afternoon), Q13 · 1 mark · a possible BFS order", file: "gate2017_an_q13.txt", given: `Graph (picture): edges M–N, N–O, M–Q, N–Q, O–Q, O–P, Q–P, M–R. BFS uses a queue. Which is a possible order of visiting the nodes?
A) MNOPQR   B) NQMPOR   C) QMNROP   D) POQNMR`, find: "The possible BFS order.", steps: [
      { say: "A possible BFS order starts at some vertex, then lists all its neighbours (any order), then the vertices at distance 2, and so on: every ring complete before the next.", result: "rings in order" },
      { say: "A: start M. Its neighbours are N, Q, R, but O comes before Q and R, and O is at distance 2. Not BFS.", result: "A no" },
      { say: "B: start N. Its neighbours are M, O, Q, but P (distance 2) appears before O. Not BFS. C: start Q: its neighbours are M, N, O, P, but R (distance 2) comes before O and P. Not BFS.", result: "B, C no" },
      { say: "D: start P. Neighbours O, Q (ring 1). Then ring 2: N (from O or Q) and M (from Q). Then ring 3: R (from M). The order P, O, Q, N, M, R follows the rings.", result: "D yes" },
    ], answer: "D", check: "In D every vertex is preceded by a neighbour that is one ring closer to P." },
    { type: "example", id: "a7-e8", level: "gate", title: "GATE CS 2021 (afternoon), Q30 · 2 marks · MSQ: a directed 4 × 4 grid", file: "gate2021_an_q30.txt", given: `Directed graph (picture): 16 vertices in a 4 × 4 grid with arrows; S is the bottom-left vertex. Reading the picture by (row, column) with the top row 0 and S = (3, 0):
row 0: (0,0)→(0,1), (0,2)→(0,1), (0,2)→(0,3); row 1: (1,0)→(1,1)→(1,2)→(1,3); row 2: (2,1)→(2,0), (2,1)→(2,2), (2,3)→(2,2); row 3: (3,0)→(3,1)→(3,2)→(3,3).
Vertical: column 0: (2,0)→(3,0), (2,0)→(1,0)→(0,0); column 1: (3,1)→(2,1)→(1,1), (0,1)→(1,1); column 2: (2,2)→(1,2)→(0,2), (2,2)→(3,2); column 3: (3,3)→(2,3)→(1,3)→(0,3).
A) no topological order   B) a DFS from S classifies three edges as back edges   C) no strongly connected component   D) a directed path between every pair`, find: "The correct statements.", steps: [
      { say: "A directed cycle exists: S = (3,0) → (3,1) → (2,1) → (2,0) → (3,0). A graph with a cycle has no topological order. A is true.", result: "A true" },
      { say: "There are three four-vertex cycles in all: the one above; (1,1)→(1,2)→(0,2)→(0,1)→(1,1); and (2,2)→(3,2)→(3,3)→(2,3)→(2,2). They lie in three different strongly connected components, each a simple 4-cycle, so any DFS closes each exactly once with one back edge. Three back edges. B is true.", result: "B true" },
      { say: "Every graph has strongly connected components (a single vertex counts), so C is false.", result: "C false" },
      { say: "The top rows cannot reach S: from row 1 there is no edge down to row 2, so (0,0) has no path to S. D is false.", result: "D false" },
    ], answer: "A, B", check: "The strongly connected components are the three 4-cycles and the single vertices around them." },
    { type: "example", id: "a7-e9", level: "gate", title: "GATE CS 2025 (afternoon), Q59 · 2 marks · NAT: someAlgo on a tree (two BFS runs)", file: "gate2025_an_q59.txt", given: `someAlgo(G): BFS from any v to a farthest vertex u; BFS from u to a farthest vertex z; output the distance between u and z. The tree T is given as a picture with 14 vertices. Labelling them n1 to n14 by position, its edges are n1–n2, n2–n5, n2–n4, n3–n4, n4–n6, n6–n7, n4–n8, n8–n9, n8–n10, n8–n11, n11–n12, n11–n13, n13–n14. The output of someAlgo(T)?`, find: "The output.", steps: [
      { say: "The tree has 13 edges on 14 vertices, as a tree must.", result: "13 edges, 14 vertices" },
      { say: "The longest path: n7–n6–n4–n8–n11–n13–n14, with 6 edges. The paths n1–n2–n4–n8–n11–n13–n14 and n5–n2–n4–n8–n11–n13–n14 also have 6 edges.", result: "6 edges" },
      { say: "The two-BFS method returns the diameter of a tree: whichever start is chosen, the first search ends at an end of a longest path and the second finds the opposite end at distance 6.", result: "6" },
    ], answer: "6", check: "The diameter of this tree is 6." },
    { type: "example", id: "a7-e10", level: "gate", title: "GATE CS 2021 (afternoon), Q19 · 2 marks · NAT: quality-scores in a DAG", file: "gate2021_an_q19.txt", given: `A DAG with source s; the quality-score of a path is the product of its edge weights; the quality-score of v is the maximum over all paths from s to v; that of s is 1. Graph (picture): s→a 9, a→b 1, s→c 1, a→d 1, b→e 1, c→d 1, d→e 9, c→f 9, d→g 9, e→t 9, f→g 1, g→t 1. The sum of the quality-scores of all vertices?`, find: "The sum.", steps: [
      { say: "Process in topological order. s = 1. a = 1 × 9 = 9. c = 1 × 1 = 1.", result: "s 1, a 9, c 1" },
      { say: "b = a × 1 = 9. d = max(a × 1, c × 1) = max(9, 1) = 9. f = c × 9 = 9.", result: "b 9, d 9, f 9" },
      { say: "e = max(b × 1, d × 9) = max(9, 81) = 81. g = max(d × 9, f × 1) = max(81, 9) = 81.", result: "e 81, g 81" },
      { say: "t = max(e × 9, g × 1) = max(729, 81) = 729.", result: "t 729" },
      { say: "Sum: 1 + 9 + 1 + 9 + 9 + 9 + 81 + 81 + 729.", result: "929" },
    ], answer: "929", check: "The best path to t is s→a→d→e→t with 9 × 1 × 9 × 9 = 729." },

    { type: "trap", wrong: "In a BFS of an undirected graph, the two ends of every edge are at distances differing by exactly 1.", tempting: "BFS moves outward one ring at a time.", whyWrong: "An edge can join two vertices in the same ring (distance difference 0), such as the edge 1–2 in the triangle 0–1–2 with source 0. The distances differ by at most 1.", rule: "Undirected BFS: |dist(u) − dist(v)| ≤ 1.", ex: { text: "Triangle 0-1-2, source 0: vertices 1 and 2 are both at distance 1." } },
    { type: "trap", wrong: "A DFS tree gives shortest paths, because DFS finds paths.", tempting: "Every tree path is a path.", whyWrong: "DFS follows the first unvisited neighbour deeply. In a triangle s, a, b, the DFS tree s–a–b has b at depth 2 though b is adjacent to s. Only a BFS tree has shortest-path depths.", rule: "Shortest paths in an unweighted graph: BFS.", ex: { text: "Triangle with source s: BFS depth of b is 1; one DFS tree gives depth 2." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q50 · 2025 AN Q29, Q59 · 2024 FN Q37, Q60 · 2021 FN Q39 · 2021 AN Q19, Q25, Q30 · 2018 FN Q40 · 2017 AN Q13. Every graph-traversal question of the bank is solved here." },
    { type: "recall", cards: [
      { q: "BFS and DFS cost with an adjacency list?", a: "Θ(n + m)." },
      { q: "Which data structure drives BFS?", a: "A queue." },
      { q: "BFS distance in an undirected edge?", a: "The two ends differ by 0 or 1." },
      { q: "Parenthesis theorem?", a: "DFS intervals are nested or disjoint, never partly overlapping." },
      { q: "Four edge classes?", a: "Tree, back, forward, cross." },
      { q: "Cross edges in an undirected DFS?", a: "None." },
      { q: "Directed cycle test with DFS?", a: "A back edge exists." },
      { q: "Components from a DFS forest?", a: "n minus the number of forest edges." },
      { q: "Topological order from DFS?", a: "Decreasing finishing time." },
      { q: "SCC algorithm?", a: "Kosaraju: DFS, then DFS on the reverse graph in decreasing finish order." },
      { q: "When is the DFS root an articulation point?", a: "When it has two or more children." },
      { q: "Tree diameter by BFS?", a: "BFS from any vertex to a farthest u, BFS from u: the farthest distance." },
    ] },
    { type: "check", questions: [
      { id: "a7c1", kind: "NAT", marks: 1, q: "An undirected graph has 50 vertices and a DFS forest with 47 edges. How many connected components?", answer: "3", solution: "50 − 47 = 3." },
      { id: "a7c2", kind: "MCQ", marks: 1, q: "BFS on a graph with n vertices and m edges, stored as adjacency lists, takes", options: ["Θ(n)", "Θ(m)", "Θ(n + m)", "Θ(n m)"], answer: "C", solution: "Each vertex and each edge is handled once." },
      { id: "a7c3", kind: "MSQ", marks: 2, q: "Which can occur in a DFS of a directed graph?", options: ["Tree edge", "Back edge", "Forward edge", "Cross edge"], answer: "A, B, C, D", solution: "All four classes occur in directed graphs." },
      { id: "a7c4", kind: "MCQ", marks: 1, q: "A DFS of a directed graph finds a back edge. The graph", options: ["is a DAG", "has a directed cycle", "is strongly connected", "is a tree"], answer: "B", solution: "A back edge closes a cycle with the tree path." },
      { id: "a7c5", kind: "NAT", marks: 2, q: "In a DFS, vertex u has d[u] = 3 and f[u] = 10, and vertex v has d[v] = 5 and f[v] = 8. How many of the following are possible as an edge u→v class: tree, forward, back, cross? (count the possible classes)", answer: "2", solution: "v's interval is inside u's, so v is a descendant: the edge u→v is a tree or a forward edge. Two classes." },
      { id: "a7c6", kind: "MCQ", marks: 2, q: "Vertices of a DAG are listed in decreasing DFS finishing time. For every edge (u, v) the list has", options: ["v before u", "u before v", "either order", "u and v adjacent"], answer: "B", solution: "f[u] > f[v] for every edge of a DAG, so u comes first." },
      { id: "a7c7", kind: "NAT", marks: 2, q: "A path graph with 7 vertices (a straight chain). Its diameter, found by the two-BFS method, is", answer: "6", solution: "The longest path has 6 edges." },
      { id: "a7c8", kind: "MSQ", marks: 2, q: "For a connected undirected graph with a DFS tree T, which are true?", options: ["A leaf of T is never an articulation point", "The root with one child is not an articulation point", "A bridge's endpoints are always articulation points", "The root with 2 children is an articulation point"], answer: "A, B, D", solution: "C is false: a bridge may end at a leaf of degree 1." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on graph traversals", sub: "Algorithms", href: "/topics/algorithms" }, { label: "Graph representation", sub: "Data Structures D13", href: "/study/graph-representation" }] },
    { type: "links", prereq: ["Graphs: representation (D13)", "Stacks and queues (D4, D5)", "Recursion (C8)"], usedIn: ["Minimum spanning trees (A8)", "Shortest paths (A9)"], cross: ["Compiler Design: control-flow graphs", "Operating Systems: deadlock detection by cycles"] },
  ],
};
