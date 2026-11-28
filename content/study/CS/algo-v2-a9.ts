import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A9 "Shortest paths" (28 Nov 2026). Relaxation, BFS for unit weights, shortest paths in a DAG, Dijkstra (and why negative edges break it),
 * Bellman-Ford and its rounds (paths of at most k edges), negative cycles, Floyd-Warshall, reweighting (Johnson), and the contrast with the MST.
 * Real GATE questions (texts from public/data/questions.json), each re-solved here:
 * 2026 FN Q41 (d_k, paths of at most k edges: S1 true, S2 false: only S1), 2026 AN Q37 (shortest paths in a DAG: Theta(m + n)),
 * 2020 FN Q57 (reweighting w'(u, v) = w(u, v) + f(u) - f(v): shortest paths are preserved for every f), and 2025 AN Q37 (adding a constant, see A8).
 * Programs compiled and run with gcc: Dijkstra 0 7 3 9 5; the negative-edge failure 2 against 1; d_k rounds; the DAG 0 2 5 1 3; Floyd-Warshall 6; reweighting.
 */
export const chapterA9: Topic = {
  id: "cs.algo.v2.sp9",
  title: "Shortest paths",
  no: "A9",
  book: [
    { t: "p", text: "A **shortest path** problem asks for the cheapest route between vertices of a weighted graph: the quickest drive, the fewest network hops, the lowest fare. The weight of a path is the sum of its edge weights, and the **distance** from s to t is the least weight of any path. This chapter has the four algorithms the syllabus names, in the order of the conditions under which each works: BFS (all weights equal), the DAG method, Dijkstra (no negative weights), and Bellman–Ford and Floyd–Warshall (negative weights allowed)." },
    { t: "p", text: "The paper asks two kinds of question. One gives a small graph and asks you to **run** an algorithm and read a distance or an order. The other gives a **statement** and asks whether it is true: does Dijkstra still work, what is the complexity of the best algorithm, do shortest paths survive a change of weights. Both depend on one operation, relaxation, and on knowing exactly when each algorithm fails." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["relax an edge and explain why every algorithm here is built from relaxations;", "run Dijkstra's algorithm by hand and state its cost with an array, a binary heap and a Fibonacci heap;", "show with a three-vertex example why negative edges break Dijkstra;", "run Bellman–Ford, state its cost and use it to detect a negative cycle;", "find shortest paths in a DAG in linear time;", "run Floyd–Warshall and state its cost;", "decide which weight changes preserve shortest paths."] },

    { t: "h2", text: "Relaxation: the one operation" },
    { t: "p", text: "Every algorithm in this chapter keeps, for each vertex v, an estimate dist[v] of the distance from the source s, starting at ∞ for every vertex except dist[s] = 0. The estimate is always the weight of some real path, so it is never below the true distance. **Relaxing** an edge (u, v) of weight w asks: is the way to v through u shorter than the best way found so far? If dist[u] + w < dist[v], set dist[v] = dist[u] + w (and remember u as the predecessor of v)." },
    { t: "p", text: "The algorithms differ only in **which edges they relax and in what order**. Dijkstra relaxes the edges out of the closest unfinished vertex. Bellman–Ford relaxes every edge, over and over. The DAG method relaxes edges in topological order. Correctness always rests on the same fact: **a shortest path to v has a last edge (u, v), and the prefix up to u is itself a shortest path to u** (optimal substructure). So if the edges of a shortest path are relaxed in the order they appear on the path, the final estimate is exact, whatever else is relaxed in between." },
    { t: "callout", kind: "key", text: "Relax(u, v, w): if dist[u] + w < dist[v] then dist[v] = dist[u] + w. A shortest path is correct once its edges have been relaxed in path order." },

    { t: "h2", text: "Equal weights and DAGs: linear time" },
    { t: "p", text: "If every edge has the same weight (say 1), **BFS** from s gives the distances in Θ(n + m): the ring in which a vertex is found is its distance. That is the whole algorithm, and it was met in the traversal chapter." },
    { t: "p", text: "If the graph is a **directed acyclic graph**, there is a method that handles **any** weights, even negative ones, in linear time. Sort the vertices topologically. Then take the vertices in that order and relax all edges out of each. When a vertex u is taken, every edge into u has already been relaxed (its tail came earlier), so dist[u] is final. The cost is Θ(n + m): the topological sort and one pass over the edges." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    /* DAG on vertices 0..4 (already in topological order); edges (from, to, weight), sorted by from */
    int e[7][3] = {{0, 1, 2}, {0, 2, 6}, {1, 2, 3}, {1, 3, 7}, {2, 3, -4}, {2, 4, 1}, {3, 4, 2}};
    int dist[5] = {0, 1000, 1000, 1000, 1000};
    for (int i = 0; i < 7; i++)
        if (dist[e[i][0]] + e[i][2] < dist[e[i][1]]) dist[e[i][1]] = dist[e[i][0]] + e[i][2];
    for (int i = 0; i < 5; i++) printf("%d ", dist[i]);
    printf("\\n");
    return 0;
}`, out: "0 2 5 1 3", file: "dag_shortest.c" },
    { t: "p", text: "The program handles the edge of weight −4 without trouble, and the distances from vertex 0 are 0, 2, 5, 1 and 3. This is GATE 2026's answer: for a weighted DAG with n vertices and m edges, the fastest algorithm for single-source shortest paths takes **Θ(m + n)**, better than Dijkstra's Θ(m + n log n) and better than Bellman–Ford's Θ(nm)." },
    { t: "ex", id: "a9-e1" },

    { t: "h2", text: "Dijkstra's algorithm" },
    { t: "p", text: "For graphs with **non-negative** weights, **Dijkstra's algorithm** is the standard. Keep a set of **finished** vertices, whose distances are final, and for every other vertex its current estimate. Repeat: **pick the unfinished vertex with the smallest estimate**, declare it finished, and relax all edges out of it. When all reachable vertices are finished, the estimates are the distances." },
    { t: "p", text: "Why is the smallest estimate final? Suppose u has the smallest estimate among the unfinished vertices. Any other route to u leaves the finished set through some edge to an unfinished vertex x, and dist[x] ≥ dist[u] (u is the smallest), so with **non-negative** edges the rest of that route cannot make it shorter than dist[u]. So no route beats the current estimate of u. The argument uses non-negativity at exactly one point, which is where negative edges break it." },
    { t: "fig", id: "a9-f1" },
    { t: "code", text: `#include <stdio.h>

#define INF 1000000
int main(void) {
    int n = 5, w[5][5] = {{0}};
    int e[7][3] = {{0, 1, 10}, {0, 2, 3}, {2, 1, 4}, {1, 3, 2}, {2, 3, 8}, {2, 4, 2}, {4, 3, 7}};
    for (int i = 0; i < 7; i++) w[e[i][0]][e[i][1]] = e[i][2];
    int dist[5], done[5] = {0};
    for (int i = 0; i < n; i++) dist[i] = INF;
    dist[0] = 0;
    for (int round = 0; round < n; round++) {
        int u = -1;
        for (int i = 0; i < n; i++) if (!done[i] && (u < 0 || dist[i] < dist[u])) u = i;
        done[u] = 1;                                           /* the smallest estimate is final */
        for (int v = 0; v < n; v++)
            if (w[u][v] && dist[u] + w[u][v] < dist[v]) dist[v] = dist[u] + w[u][v];
    }
    for (int i = 0; i < n; i++) printf("%d ", dist[i]);
    printf("\\n");
    return 0;
}`, out: "0 7 3 9 5", file: "dijkstra.c" },
    { t: "p", text: "The table in the figure traces the program: the source 0 is finished first (estimates 10 for vertex 1 and 3 for vertex 2). Next is vertex 2 (distance 3), which improves vertex 1 to 3 + 4 = 7, sets vertex 3 to 11 and vertex 4 to 5. Then vertex 4 (distance 5) offers 5 + 7 = 12 to vertex 3, which is worse than 11, so nothing changes. Then vertex 1 (distance 7) improves vertex 3 to 7 + 2 = 9. Finally vertex 3 (distance 9). The distances are 0, 7, 3, 9, 5." },
    { t: "p", text: "**Cost.** With an array the minimum is found by scanning all vertices: Θ(n) per round, n rounds, plus Θ(m) relaxations: Θ(n² + m) = Θ(n²). With a **binary heap** each extraction and each decrease-key costs Θ(log n): Θ((n + m) log n) = Θ(m log n). With a **Fibonacci heap**, decrease-key is Θ(1) on average, giving Θ(m + n log n). For a dense graph the array version is as good as the heap versions; for a sparse graph the heap is far better." },
    { t: "h3", text: "Why negative edges break it" },
    { t: "p", text: "Dijkstra finishes a vertex once and never revisits it. With a negative edge, a vertex that looked finished can later be improved. Take s with an edge of weight 2 to a, an edge of weight 3 to b, and an edge of weight −2 from b to a. Dijkstra finishes a first with distance 2 (the smaller estimate). But the path s → b → a costs 3 − 2 = 1, which is shorter. Dijkstra reports 2; the truth is 1." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    /* vertices: 0 = s, 1 = a, 2 = b.  edges: s->a 2, s->b 3, b->a -2 */
    int dist[3] = {0, 1000, 1000}, done[3] = {0}, w[3][3] = {{0, 2, 3}, {0, 0, 0}, {0, -2, 0}};
    for (int round = 0; round < 3; round++) {
        int u = -1;
        for (int i = 0; i < 3; i++) if (!done[i] && (u < 0 || dist[i] < dist[u])) u = i;
        done[u] = 1;
        for (int v = 0; v < 3; v++)
            if (w[u][v] && !done[v] && dist[u] + w[u][v] < dist[v]) dist[v] = dist[u] + w[u][v];
    }
    printf("%d %d\\n", dist[1], 3 + (-2));                      /* Dijkstra's answer for a, and the true one */
    return 0;
}`, out: "2 1", file: "dijkstra_negative.c" },
    { t: "callout", kind: "trap", title: "Trap: adding a constant to repair negative edges", text: "Adding a big constant to every edge to make all weights non-negative does NOT work: a path with more edges gains more, so the ranking of paths changes. Only reweighting by a potential f(u) − f(v) (below) preserves shortest paths." },

    { t: "h2", text: "Bellman–Ford" },
    { t: "p", text: "**Bellman–Ford** works when weights may be negative. Its idea is brute force made safe: **relax every edge, and repeat n − 1 times**. After round k, dist[v] is at most the weight of the shortest path to v that uses **at most k edges**. Since a shortest path in a graph with no negative cycle has at most n − 1 edges (it visits each vertex at most once), n − 1 rounds suffice. The cost is Θ(n · m)." },
    { t: "p", text: "A **negative cycle** is a cycle whose total weight is negative: going round it again and again lowers the weight without limit, so distances are not defined for vertices reachable from it. Bellman–Ford detects this: run one more round (round n); if any edge still relaxes, a negative cycle is reachable from the source. Dijkstra and the DAG method need no such check (non-negative weights and acyclic graphs have no negative cycles)." },
    { t: "p", text: "The rounds have a meaning that GATE 2026 tests. Let d_k(u) be the weight of a shortest path from s to u **using at most k edges**, or ∞ if there is none. Then **d_{k+1}(u) ≤ d_k(u)**: a path with at most k edges also has at most k + 1 edges, so allowing more edges can only help. That is statement S1: true. Statement S2 claims that for any edge (u, v) on a shortest path to v, d_k(u) ≤ d_k(v) for **every** k. It fails for small k: take a path s–a–u–v of weight 1 + 1 + 1 and an extra heavy edge s–v of weight 100. With k = 1 the only way to reach v is the heavy edge, d₁(v) = 100, but u cannot be reached in one edge, d₁(u) = ∞ > 100. So S2 is false and only S1 holds." },
    { t: "code", text: `#include <stdio.h>

#define INF 1000
int main(void) {
    /* undirected: s-a 1, a-u 1, u-v 1, s-v 100.  vertices 0 = s, 1 = a, 2 = u, 3 = v */
    int e[4][3] = {{0, 1, 1}, {1, 2, 1}, {2, 3, 1}, {0, 3, 100}};
    int d[4] = {0, INF, INF, INF};
    for (int k = 1; k <= 3; k++) {
        int nd[4];
        for (int i = 0; i < 4; i++) nd[i] = d[i];
        for (int i = 0; i < 4; i++) {                        /* paths with at most k edges */
            int a = e[i][0], b = e[i][1], w = e[i][2];
            if (d[a] + w < nd[b]) nd[b] = d[a] + w;
            if (d[b] + w < nd[a]) nd[a] = d[b] + w;
        }
        for (int i = 0; i < 4; i++) d[i] = nd[i];
        printf("k=%d: d(u)=%d d(v)=%d\\n", k, d[2] >= INF ? -1 : d[2], d[3]);
    }
    return 0;
}`, out: "k=1: d(u)=-1 d(v)=100\nk=2: d(u)=2 d(v)=100\nk=3: d(u)=2 d(v)=3", file: "bellman_rounds.c" },
    { t: "fig", id: "a9-f2" },
    { t: "p", text: "The output reads: after 1 round u is still unreachable (printed as −1 for ∞) while v is 100; after 2 rounds u is 2; after 3 rounds v drops to 3. At k = 1, d(u) = ∞ exceeds d(v) = 100, which refutes S2." },
    { t: "ex", id: "a9-e2" },

    { t: "h2", text: "All pairs: Floyd–Warshall" },
    { t: "p", text: "To find the distances between **every pair** of vertices, one could run Dijkstra from each vertex, Θ(n · m log n). **Floyd–Warshall** does it by dynamic programming in Θ(n³) with three short loops. Let D_k[i][j] be the shortest distance from i to j using only the vertices 1, …, k as intermediate stops. Then D_k[i][j] = min(D_{k−1}[i][j], D_{k−1}[i][k] + D_{k−1}[k][j]): either the best path avoids k, or it goes i to k and then k to j. Start with D₀ equal to the edge weights (0 on the diagonal, ∞ for non-edges)." },
    { t: "code", text: `#include <stdio.h>

#define INF 1000
int main(void) {
    int d[4][4] = {{0, 3, INF, 7}, {8, 0, 2, INF}, {5, INF, 0, 1}, {2, INF, INF, 0}};
    for (int k = 0; k < 4; k++)                         /* k outermost: intermediate vertices 0..k */
        for (int i = 0; i < 4; i++)
            for (int j = 0; j < 4; j++)
                if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
    printf("%d\\n", d[0][3]);
    return 0;
}`, out: "6", file: "floyd_warshall.c" },
    { t: "p", text: "In this four-vertex graph the direct edge from vertex 0 to vertex 3 costs 7, but the route 0 → 1 → 2 → 3 costs 3 + 2 + 1 = 6, which the loops find. The **order of the loops matters**: k must be the outermost loop, because each pass of k assumes that all paths through the earlier intermediate vertices are already complete. Negative edges are allowed; a negative cycle shows up as a negative value on the diagonal." },
    { t: "table", head: ["Algorithm", "Problem", "Weights", "Time"], rows: [
      ["BFS", "single source", "all equal", "Θ(n + m)"],
      ["DAG relaxation", "single source, DAG", "any", "Θ(n + m)"],
      ["Dijkstra", "single source", "non-negative", "Θ(m log n) heap; Θ(n²) array"],
      ["Bellman–Ford", "single source", "any (detects negative cycles)", "Θ(nm)"],
      ["Floyd–Warshall", "all pairs", "any (no negative cycle)", "Θ(n³)"],
    ], caption: "Which shortest-path algorithm for which conditions." },

    { t: "h2", text: "Changing weights: potentials and Johnson's idea" },
    { t: "p", text: "Sometimes a question changes the weights of a graph and asks whether shortest paths are preserved. **Reweighting by a potential** is the safe change: pick any function f from vertices to numbers and define the new weight w′(u, v) = w(u, v) + f(u) − f(v). The weight of a path from s to t under w′ equals its weight under w plus f(s) − f(t), because the intermediate terms cancel in pairs: (f(s) − f(v₁)) + (f(v₁) − f(v₂)) + … + (f(vₖ) − f(t)) = f(s) − f(t). That correction depends only on the endpoints, not on the path, so **the ranking of paths between s and t is unchanged**: shortest paths under w are shortest paths under w′, for **every** function f." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    /* two s->t paths: s->a->t with weights 4, 1 and s->b->t with weights 2, 5.  Potentials f(s)=0, f(a)=3, f(b)=-2, f(t)=1 */
    int f_s = 0, f_a = 3, f_b = -2, f_t = 1;
    int pa = (4 + f_s - f_a) + (1 + f_a - f_t);                /* new weight of path via a */
    int pb = (2 + f_s - f_b) + (5 + f_b - f_t);                /* new weight of path via b */
    printf("%d %d | old %d %d\\n", pa, pb, 4 + 1, 2 + 5);
    return 0;
}`, out: "4 6 | old 5 7", file: "reweighting.c" },
    { t: "p", text: "Both paths shift by the same amount, f(s) − f(t) = −1: 5 becomes 4 and 7 becomes 6, and the path via a stays the shorter. This is GATE 2020's answer: the shortest paths are preserved **for every** function f, not only when f is positive, negative, or a distance. **Johnson's algorithm** uses this on purpose. It first runs Bellman–Ford from a new vertex joined by zero-weight edges to all vertices, and takes f(v) = that distance (so w′ is **non-negative**); then it runs Dijkstra from every vertex on w′. The cost is Θ(nm + n · m log n), better than Floyd–Warshall on sparse graphs, and it handles negative edges." },
    { t: "ex", id: "a9-e3" },
    { t: "p", text: "Contrast this with **adding a constant to every edge**, which is not a potential change: the path from s to t gains kα, where k is its number of edges, so paths with different edge counts are re-ranked. In the previous chapter we saw that this preserves MSTs (every tree has n − 1 edges) but not shortest paths. A path with the same number of edges stays comparable; a path with more edges is penalised." },
    { t: "trap", i: 0 },
    { t: "trap", i: 1 },

    { t: "h2", text: "Choosing the algorithm" },
    { t: "p", text: "Read the conditions of the question and match. **All weights equal:** BFS. **A DAG:** relax in topological order, Θ(n + m), even with negative weights. **Non-negative weights, one source:** Dijkstra, with the heap variant for sparse graphs. **Negative weights, one source:** Bellman–Ford, which also detects negative cycles. **Every pair:** Floyd–Warshall for dense graphs, Johnson for sparse ones. **Unweighted but asked for a 'shortest path' by edge count:** BFS again." },
    { t: "p", text: "A last connection to the MST chapter: the shortest-path tree from a source and the MST of the same graph are different objects, because one minimises each distance from the source and the other minimises the total weight. They coincide only in special cases. When a question mixes them, apply each definition separately." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Relax (u, v, w): if dist[u] + w < dist[v], update. Every algorithm is a schedule of relaxations.", "BFS: equal weights, Θ(n + m). DAG: relax in topological order, Θ(n + m), any weights (GATE 2026: Θ(m + n)).", "Dijkstra: finish the smallest estimate; needs non-negative weights; Θ(n²) array, Θ(m log n) heap, Θ(m + n log n) Fibonacci heap; fails on s→a 2, s→b 3, b→a −2.", "Bellman–Ford: n − 1 rounds of relaxing all edges, Θ(nm), round k gives paths of at most k edges; a relaxation in round n means a negative cycle. d_{k+1}(u) ≤ d_k(u) always, but d_k(u) ≤ d_k(v) along a shortest path can fail.", "Floyd–Warshall: Θ(n³), k outermost.", "Reweighting w′ = w + f(u) − f(v) preserves shortest paths for every f; adding a constant to all weights does not.", "MST is not a shortest-path tree."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a9-f1", caption: "Dijkstra's algorithm on a five-vertex graph (edges 0→1 10, 0→2 3, 2→1 4, 1→3 2, 2→3 8, 2→4 2, 4→3 7). Each row finishes one vertex; the estimates after relaxing its edges are shown.", alt: "A table of five rounds: the finished vertex and the distance estimates of the five vertices after each round.", fig: { kind: "trace", title: "Dijkstra from vertex 0: estimates for vertices 0 1 2 3 4", cols: ["round", "finished vertex (distance)", "estimates 0 1 2 3 4"], rows: [
      { cells: ["start", "–", "0  ∞  ∞  ∞  ∞"] },
      { cells: [1, "0 (0)", "0  10  3  ∞  ∞"], changed: [2] },
      { cells: [2, "2 (3)", "0  7  3  11  5"], changed: [2], tone: "ok" },
      { cells: [3, "4 (5)", "0  7  3  11  5"], note: "5 + 7 = 12 is worse than 11" },
      { cells: [4, "1 (7)", "0  7  3  9  5"], changed: [2], tone: "ok" },
      { cells: [5, "3 (9)", "0  7  3  9  5"] },
    ] } },

    { type: "figure", id: "a9-f2", caption: "Paths of at most k edges on the graph s–a 1, a–u 1, u–v 1, s–v 100. For k = 1, u is unreachable (∞) while v costs 100, so d₁(u) is larger than d₁(v) although (u, v) lies on the shortest path to v.", alt: "A table of k from 1 to 3 with d_k of u and d_k of v: infinity and 100, then 2 and 100, then 2 and 3.", fig: { kind: "trace", title: "d_k(u) and d_k(v)", cols: ["k", "d_k(u)", "d_k(v)", "comment"], rows: [
      { cells: [1, "∞", 100], tone: "bad", note: "d₁(u) > d₁(v): S2 fails" },
      { cells: [2, 2, 100], changed: [1] },
      { cells: [3, 2, 3], changed: [2], tone: "ok" },
    ] } },

    { type: "example", id: "a9-e1", level: "gate", title: "GATE CS 2026 (afternoon), Q37 · 2 marks · shortest paths in a weighted DAG", file: "gate2026_an_q37.txt", given: `G is a weighted directed acyclic graph with m edges and n vertices; s is a source. The worst-case time of the fastest algorithm to find the lengths of shortest paths from s to all vertices reachable from s?
A) Θ(m + n)   B) Θ(m + n log n)   C) Θ(nm)   D) Θ(n³)`, find: "The best complexity.", steps: [
      { say: "Sort the vertices topologically: Θ(n + m).", result: "Θ(n + m)" },
      { say: "Relax the out-edges of each vertex in that order. When a vertex is reached, all edges into it have been relaxed, so its estimate is final. One pass over the edges: Θ(m).", result: "Θ(n + m)" },
      { say: "This beats Dijkstra (m + n log n), which is the tempting answer B, and works even with negative weights.", result: "A" },
    ], answer: "A", check: "The program in this chapter runs it on a DAG with a negative edge." },
    { type: "example", id: "a9-e2", level: "gate", title: "GATE CS 2026 (forenoon), Q41 · 2 marks · paths of at most k edges", file: "gate2026_fn_q41.txt", given: `G is undirected, edge-weighted with integer weights. d_k(u) is the weight of a shortest path from s to u with at most k edges (∞ if none).
S1: For every k ≥ 0 and u, d_{k+1}(u) ≤ d_k(u).
S2: For every edge (u, v) that is part of a shortest path from s to v, for every k ≥ 0, d_k(u) ≤ d_k(v).
A) only S1   B) only S2   C) both   D) neither`, find: "Which statements are true.", steps: [
      { say: "S1: a path with at most k edges also has at most k + 1 edges, so the set of paths only grows and the minimum can only fall.", result: "S1 true" },
      { say: "S2: take the path s–a–u–v (weights 1, 1, 1) and an edge s–v of weight 100. The edge (u, v) is on the shortest path to v. For k = 1, d₁(v) = 100 (the direct edge), but u needs two edges, so d₁(u) = ∞ > 100.", result: "S2 false" },
    ], answer: "A", check: "The program in this chapter prints d_k(u) and d_k(v) for k = 1, 2, 3." },
    { type: "example", id: "a9-e3", level: "gate", title: "GATE CS 2020 (forenoon), Q57 · 2 marks · reweighting by a function of the vertices", file: "gate2020_fn_q57.txt", given: `G = (V, E) is directed and weighted with w. For some f: V → R, define w'(u, v) = w(u, v) + f(u) − f(v). "The shortest paths in G under w are shortest paths under w' too, ______."
A) for every f   B) iff f(u) is positive for all u   C) iff f(u) is negative for all u   D) iff f(u) is the distance from a new vertex s joined to all vertices by zero-weight edges`, find: "The correct completion.", steps: [
      { say: "For a path s = v0, v1, …, vk = t the f-terms telescope: Σ (f(v_{i−1}) − f(v_i)) = f(s) − f(t).", result: "w'(path) = w(path) + f(s) − f(t)" },
      { say: "The correction depends only on the endpoints, so all s–t paths shift by the same amount: the shortest stays the shortest, for every f.", result: "for every f" },
    ], answer: "A", check: "The program in this chapter shifts two paths by the same −1." },

    { type: "trap", wrong: "Dijkstra's algorithm works on any graph without a negative cycle.", tempting: "Bellman–Ford needs the no-negative-cycle condition, so it seems the same.", whyWrong: "Dijkstra needs NO NEGATIVE EDGE at all, because it finishes a vertex once. With s→a 2, s→b 3, b→a −2 there is no negative cycle, yet Dijkstra reports 2 for a where the true distance is 1.", rule: "Dijkstra: non-negative weights. Negative edges, no negative cycle: Bellman–Ford.", ex: { text: "Dijkstra gives dist(a) = 2; the path s → b → a costs 3 − 2 = 1." } },
    { type: "trap", wrong: "To use Dijkstra on a graph with negative edges, add a big constant to every weight.", tempting: "All weights become non-negative.", whyWrong: "A path with k edges gains kα, so paths with more edges become relatively worse and the shortest path can change.", rule: "Only f(u) − f(v) reweighting preserves shortest paths.", ex: { text: "s→t direct 8; s→a→t with 4 and 3 (total 7): after adding 3 to each edge the direct edge is 11 and the two-edge path is 13: the shortest path changed." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q41 · 2026 AN Q37 · 2020 FN Q57 · 2025 AN Q37 (with the MST, Chapter A8). The question that gives a DAG as a picture and asks for the sum of the best path products (2021 AN Q19) is solved in the traversals chapter by the DAG method, with 'product' and 'maximum' in place of 'sum' and 'minimum'." },
    { type: "recall", cards: [
      { q: "What does relaxing (u, v, w) do?", a: "If dist[u] + w < dist[v], set dist[v] = dist[u] + w." },
      { q: "Shortest paths in a DAG?", a: "Relax in topological order: Θ(n + m), any weights." },
      { q: "Dijkstra's requirement?", a: "No negative edge weights." },
      { q: "Dijkstra's cost with an array, heap, Fibonacci heap?", a: "Θ(n²); Θ(m log n); Θ(m + n log n)." },
      { q: "Bellman–Ford rounds and cost?", a: "n − 1 rounds of relaxing all edges; Θ(nm)." },
      { q: "Detecting a negative cycle?", a: "A relaxation still succeeds in round n." },
      { q: "What is d_k(u)?", a: "The best path weight to u using at most k edges; d_{k+1}(u) ≤ d_k(u)." },
      { q: "Floyd–Warshall cost and loop order?", a: "Θ(n³); k is the outermost loop." },
      { q: "Reweighting that preserves shortest paths?", a: "w'(u, v) = w(u, v) + f(u) − f(v), for any f." },
      { q: "Johnson's algorithm?", a: "Bellman–Ford once for potentials, then Dijkstra from every vertex." },
      { q: "Add a constant to every weight?", a: "Shortest paths can change; MSTs do not." },
    ] },
    { type: "check", questions: [
      { id: "a9c1", kind: "NAT", marks: 1, q: "Edges s→a 2, a→t 3, s→t 6. The shortest distance from s to t?", answer: "5", solution: "2 + 3 = 5." },
      { id: "a9c2", kind: "MCQ", marks: 1, q: "The time of Bellman–Ford on a graph of n vertices and m edges is", options: ["Θ(n + m)", "Θ(m log n)", "Θ(nm)", "Θ(n³)"], answer: "C", solution: "n − 1 rounds over m edges." },
      { id: "a9c3", kind: "MSQ", marks: 2, q: "Which algorithms can handle a negative edge weight (and no negative cycle)?", options: ["Dijkstra", "Bellman–Ford", "Floyd–Warshall", "DAG relaxation (on a DAG)"], answer: "B, C, D", solution: "Dijkstra cannot." },
      { id: "a9c4", kind: "NAT", marks: 2, q: "Dijkstra from s on edges s→a 4, s→b 1, b→a 2, a→t 1, b→t 6. The distance to t?", answer: "4", solution: "s→b→a→t = 1 + 2 + 1 = 4; direct via b to t is 7." },
      { id: "a9c5", kind: "MCQ", marks: 2, q: "A Fibonacci-heap Dijkstra takes", options: ["Θ(n²)", "Θ(m log n)", "Θ(m + n log n)", "Θ(nm)"], answer: "C", solution: "Θ(1) decrease-key, Θ(log n) extract-min." },
      { id: "a9c6", kind: "NAT", marks: 2, q: "Floyd–Warshall on a graph with 10 vertices does about how many inner relaxations? (n³)", answer: "1000", solution: "10 × 10 × 10." },
      { id: "a9c7", kind: "NAT", marks: 2, q: "Edge s→t has weight 5. Potentials f(s) = 2 and f(t) = 6. The new weight w'(s, t) = w + f(s) − f(t)?", answer: "1", solution: "5 + 2 − 6 = 1." },
      { id: "a9c8", kind: "MCQ", marks: 2, q: "Adding 10 to every edge weight of a graph with positive weights always preserves", options: ["every shortest path", "every MST", "both", "neither"], answer: "B", solution: "Every spanning tree has n − 1 edges, so all gain the same." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on shortest paths", sub: "Algorithms", href: "/topics/algorithms" }, { label: "Minimum spanning trees", sub: "the contrast: total against each distance", href: "/study/mst" }] },
    { type: "links", prereq: ["Graph traversals (A7)", "Minimum spanning trees (A8)", "Dynamic programming (A6)", "Binary heaps (D10)"], usedIn: ["Computer Networks: routing (distance vector is Bellman–Ford, link state is Dijkstra)"], cross: ["Data Structures: priority queues"] },
  ],
};
