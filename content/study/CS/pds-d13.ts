import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D13 "Graphs: representation and traversal" (29 Nov 2026). No past question is tagged to this chapter in the bank
 * (graph questions sit under Algorithms and Discrete Maths); the chapter builds the representations and the two traversals those questions use.
 * Programs compiled and run with gcc: BFS 0 1 2 3 4 5, DFS 0 1 3 5 4 2, degree sum 12; A squared of the 4-cycle has 2 and 2.
 */
export const chapterD13: Topic = {
  id: "cs.pds.ds.graphs13",
  title: "Graphs: representation and traversal",
  no: "D13",
  book: [
    { t: "p", text: "A tree is a special kind of network: one root, no loops, every item reached by exactly one path. Many real structures are less tidy. Cities joined by roads, people joined by friendships, web pages joined by links, tasks joined by 'must come before': items can be connected in any pattern, with loops, with several routes between two items, or with no route at all. The general structure for this is the **graph**." },
    { t: "p", text: "This chapter introduces the vocabulary of graphs, the two ways of storing a graph in memory (a matrix and a set of lists), what each costs, and the two basic ways of visiting every vertex: breadth-first and depth-first. These are the tools behind every graph algorithm in the Algorithms subject, such as shortest paths and spanning trees." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["state what a graph is and use the words vertex, edge, degree, path, cycle, connected and component;", "count edges from degrees, and bound the number of edges of a graph;", "store a graph as an adjacency matrix and as adjacency lists, and compare their space and time;", "carry out breadth-first and depth-first search by hand and in C;", "state the running time of each traversal for each representation."] },

    { t: "h2", text: "What a graph is" },
    { t: "p", text: "A **graph** G = (V, E) is a set V of **vertices** (also called nodes) and a set E of **edges**, each edge joining two vertices. In an **undirected** graph an edge is a two-way link: the edge {a, b} is the same as {b, a}. In a **directed** graph (digraph) each edge is an arrow from one vertex to another, and a → b is different from b → a. We write n for the number of vertices and e for the number of edges." },
    { t: "fig", id: "d13-f1" },
    { t: "p", text: "Two vertices joined by an edge are **adjacent** or neighbours. The **degree** of a vertex is the number of edges that touch it. In a directed graph we separate the **in-degree** (arrows arriving) and the **out-degree** (arrows leaving). A **path** is a sequence of vertices with an edge between each consecutive pair; a **cycle** is a path that returns to its start without repeating an edge. A graph is **connected** if there is a path between every pair of vertices; if not, it breaks into **connected components**." },
    { t: "p", text: "A simple graph has no loops (an edge from a vertex to itself) and no repeated edges. For a simple undirected graph two facts are used constantly. The **handshake rule**: the sum of all degrees is exactly 2e, because each edge adds 1 to the degree of each of its two ends. And the largest possible number of edges is **n(n − 1)/2**, one for each pair of vertices; a graph with that many is called complete. A directed simple graph can have up to n(n − 1)." },
    { t: "callout", kind: "key", text: "Handshake rule: the sum of the degrees is 2e. Most edges possible in a simple undirected graph: n(n − 1)/2. A tree is a connected graph with n − 1 edges and no cycle." },
    { t: "ex", id: "d13-e1" },
    { t: "trap", i: 0 },

    { t: "h2", text: "The adjacency matrix" },
    { t: "p", text: "The first way to store a graph is a table with a row and a column for each vertex. The entry in row i and column j is 1 if there is an edge from i to j, and 0 if not. This is the **adjacency matrix**. For an undirected graph the matrix is **symmetric** (the entry at (i, j) equals the entry at (j, i)) and the diagonal is 0 for a simple graph." },
    { t: "fig", id: "d13-f2" },
    { t: "p", text: "The matrix has n × n cells, so it needs **Θ(n²)** space however few edges there are. In return, asking 'is there an edge from i to j?' costs one array access, **Θ(1)**. Listing all the neighbours of a vertex means scanning a whole row: **Θ(n)**. Counting all edges means scanning the whole matrix: Θ(n²)." },
    { t: "p", text: "The matrix has a useful algebraic property. The entry (i, j) of the **square** of the matrix counts the walks of length exactly 2 from i to j; more generally the entry of the k-th power counts the walks of length k. The program below checks it on the four-cycle 0-1-3-2-0: A² has 2 at (0, 0), the degree of vertex 0, and 2 at (0, 3), the two walks 0-1-3 and 0-2-3." },
    { t: "code", text: `#include <stdio.h>

#define N 4
int main(void) {
    int A[N][N] = {{0,1,1,0},{1,0,0,1},{1,0,0,1},{0,1,1,0}};   /* the 4-cycle 0-1-3-2-0 */
    int B[N][N] = {0};
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            for (int k = 0; k < N; k++) B[i][j] += A[i][k] * A[k][j];   /* A squared */
    printf("%d %d\\n", B[0][0], B[0][3]);
    return 0;
}`, out: "2 2", file: "matrix_square.c" },
    { t: "ex", id: "d13-e2" },

    { t: "h2", text: "Adjacency lists" },
    { t: "p", text: "The second way is to keep, for every vertex, a **list of its neighbours**: an array of n lists (each a linked list or a small array). The graph needs n list heads plus one entry for each edge end: for an undirected graph that is n + 2e cells, which is **Θ(n + e)**. For a graph with few edges (a **sparse** graph) this is far smaller than n²." },
    { t: "fig", id: "d13-f3" },
    { t: "p", text: "Listing the neighbours of a vertex v is quick, **Θ(deg v)**, because they are the entries of its list. Visiting all neighbours of all vertices costs Θ(n + e). But testing 'is there an edge from i to j?' means scanning the list of i: **Θ(deg i)**, up to Θ(n), where the matrix needs Θ(1)." },
    { t: "table", head: ["Operation", "Adjacency matrix", "Adjacency lists"], rows: [["Space", "Θ(n²)", "Θ(n + e)"], ["Is there an edge i–j?", "Θ(1)", "Θ(deg i)"], ["List the neighbours of v", "Θ(n)", "Θ(deg v)"], ["Visit every edge", "Θ(n²)", "Θ(n + e)"], ["Add an edge", "Θ(1)", "Θ(1) (insert at the head of a list)"], ["Best for", "dense graphs, quick edge tests", "sparse graphs, traversals"]] },
    { t: "p", text: "A graph is **dense** when e is close to n² and **sparse** when e is of the order of n. Real networks (roads, friendships, the web) are almost always sparse: a person has hundreds of friends, not billions. So adjacency lists are the usual choice, and the standard graph algorithms are analysed for them in time Θ(n + e)." },
    { t: "ex", id: "d13-e3" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Breadth-first search" },
    { t: "p", text: "To **traverse** a graph is to visit every vertex reachable from a starting vertex, once each. **Breadth-first search** (BFS) explores the graph in rings. Visit the start vertex, then all its neighbours, then all the neighbours of those neighbours, and so on: first everything one step away, then everything two steps away. It uses a **queue** (chapter D5): take a vertex from the front, visit it, and put its unseen neighbours at the back." },
    { t: "p", text: "The one subtle point is the **marking** of vertices as seen. A vertex can be reached from several of its neighbours, and if it were put in the queue each time it would be visited several times, and a graph with a cycle would loop forever. So mark a vertex as seen **when it is put into the queue** and put in only unseen vertices." },
    { t: "fig", id: "d13-f4" },
    { t: "code", text: `#include <stdio.h>

#define N 6
int adj[N][N];                                   /* adjacency matrix */

void edge(int a, int b) { adj[a][b] = adj[b][a] = 1; }   /* undirected edge */

void bfs(int s) {
    int seen[N] = {0}, q[N], f = 0, r = 0;
    seen[s] = 1; q[r++] = s;
    while (f < r) {
        int v = q[f++];
        printf("%d ", v);
        for (int w = 0; w < N; w++)
            if (adj[v][w] && !seen[w]) { seen[w] = 1; q[r++] = w; }   /* mark when queued */
    }
}

int seen2[N];
void dfs(int v) {
    seen2[v] = 1; printf("%d ", v);
    for (int w = 0; w < N; w++) if (adj[v][w] && !seen2[w]) dfs(w);
}

int main(void) {
    edge(0, 1); edge(0, 2); edge(1, 3); edge(2, 4); edge(3, 5); edge(4, 5);
    bfs(0); printf("| "); dfs(0); printf("| ");
    int deg = 0, sum = 0;
    for (int v = 0; v < N; v++) { deg = 0; for (int w = 0; w < N; w++) deg += adj[v][w]; sum += deg; }
    printf("%d\\n", sum);
    return 0;
}`, out: "0 1 2 3 4 5 | 0 1 3 5 4 2 | 12", file: "bfs_dfs.c" },
    { t: "p", text: "The graph in the program has six vertices and edges 0-1, 0-2, 1-3, 2-4, 3-5, 4-5. BFS from 0 visits 0, then its neighbours 1 and 2, then the neighbours of those (3 and 4), then 5. Because BFS goes ring by ring, the order in which it reaches a vertex gives the **fewest edges** from the start to that vertex: BFS finds shortest paths in an unweighted graph. The last number printed, 12, is the sum of the degrees: twice the 6 edges." },
    { t: "ex", id: "d13-e4" },

    { t: "h2", text: "Depth-first search" },
    { t: "p", text: "**Depth-first search** (DFS) does the opposite: from the current vertex go to an unseen neighbour and carry on from there, as far as possible; when there is nothing new to go to, **back up** one step and try the next neighbour. It is naturally recursive, and the recursion is a **stack** (chapter D4) in disguise: each call remembers where to come back to." },
    { t: "p", text: "In the program above, DFS from 0 goes 0 → 1 → 3 → 5 → 4 → 2: it dives down the path 0-1-3-5, then at 5 goes to 4, and at 4 finds vertex 2 as the only unseen neighbour. The order depends on the order in which each vertex lists its neighbours; the question usually says to take them in increasing order." },
    { t: "table", head: ["", "Breadth-first (BFS)", "Depth-first (DFS)"], rows: [["Helper structure", "queue", "stack (or recursion)"], ["Explores", "ring by ring, nearest first", "as deep as possible, then backs up"], ["Time with lists", "Θ(n + e)", "Θ(n + e)"], ["Time with a matrix", "Θ(n²)", "Θ(n²)"], ["Good for", "fewest edges between two vertices", "cycles, components, topological order"]] },
    { t: "p", text: "Both traversals visit each vertex once and look at each edge a constant number of times. With adjacency lists that is **Θ(n + e)**. With an adjacency matrix, finding the neighbours of a vertex costs Θ(n) by scanning its row, and this is done for each of the n vertices, so the total is **Θ(n²)**." },
    { t: "ex", id: "d13-e5" },
    { t: "trap", i: 2 },

    { t: "h2", text: "Components, cycles and trees" },
    { t: "p", text: "A traversal from one vertex visits exactly the vertices of its **connected component**. To count components, start a traversal at an unvisited vertex, count one, and repeat until every vertex is visited. The number of times you have to start is the number of components. This costs Θ(n + e) in total." },
    { t: "p", text: "A traversal also detects cycles. In an undirected graph, if the search meets a neighbour that is already seen and is not the vertex we just came from, there is a cycle. A connected graph with n vertices and exactly n − 1 edges has no cycle: it is a **tree**. A connected graph with more than n − 1 edges must contain a cycle." },
    { t: "ex", id: "d13-e6" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "No past question is tagged to this chapter by the Programming and Data Structures label: graph questions in the bank sit under Algorithms (traversals, spanning trees, shortest paths) and Discrete Mathematics (degrees, connectivity, colouring). The questions that use this chapter are of four kinds: counting edges from degrees or bounds, comparing the cost of the two representations, writing the order in which BFS or DFS visits the vertices, and the running time of a traversal." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you keep the two traversals apart and whether you know what they cost for each representation. For the visiting order, write the queue or the stack after every step and always take neighbours in the order the question gives." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Forgetting that the sum of the degrees is 2e, not e.", "Using n(n − 1) for the edges of a simple undirected graph (that is the directed bound).", "Saying graph traversal is Θ(n + e) with a matrix; it is Θ(n²).", "Using a stack for BFS or a queue for DFS.", "Marking a vertex as seen only when it is taken from the queue, which lets it be queued twice."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A graph is vertices and edges; directed edges are arrows. Degree sum = 2e; at most n(n − 1)/2 edges in a simple undirected graph.", "Adjacency matrix: Θ(n²) space, edge test Θ(1), neighbours Θ(n). Adjacency lists: Θ(n + e) space, neighbours Θ(deg).", "The k-th power of the matrix counts walks of length k.", "BFS uses a queue and goes ring by ring; it gives fewest-edge paths. DFS uses a stack or recursion and goes deep first.", "Traversal costs Θ(n + e) with lists and Θ(n²) with a matrix.", "Components = number of traversal starts; a connected graph with n − 1 edges is a tree."] },
  ],
  blocks: [
    { type: "figure", id: "d13-f1", caption: "An undirected graph with six vertices and six edges. Vertex 0 has degree 2, vertex 3 has degree 2. Adding the six degrees gives 12 = 2 × 6.", alt: "A graph with vertices 0 to 5 and edges 0-1, 0-2, 1-3, 2-4, 3-5 and 4-5.", fig: { kind: "net", w: 360, h: 200, nodes: [{ id: "0", label: "0", x: 40, y: 100 }, { id: "1", label: "1", x: 140, y: 40 }, { id: "2", label: "2", x: 140, y: 160 }, { id: "3", label: "3", x: 240, y: 40 }, { id: "4", label: "4", x: 240, y: 160 }, { id: "5", label: "5", x: 330, y: 100 }], edges: [{ a: "0", b: "1" }, { a: "0", b: "2" }, { a: "1", b: "3" }, { a: "2", b: "4" }, { a: "3", b: "5" }, { a: "4", b: "5" }] } },
    { type: "figure", id: "d13-f2", caption: "The adjacency matrix of the graph above. The matrix is symmetric because the edges are undirected; row 0 has two 1s (degree 2).", alt: "A 6 by 6 table of zeros and ones with a one wherever two vertices are joined.", fig: { kind: "matrix", title: "Adjacency matrix", cols: ["0", "1", "2", "3", "4", "5"], rows: [{ label: "0", cells: [0, 1, 1, 0, 0, 0] }, { label: "1", cells: [1, 0, 0, 1, 0, 0] }, { label: "2", cells: [1, 0, 0, 0, 1, 0] }, { label: "3", cells: [0, 1, 0, 0, 0, 1] }, { label: "4", cells: [0, 0, 1, 0, 0, 1] }, { label: "5", cells: [0, 0, 0, 1, 1, 0] }] } },
    { type: "figure", id: "d13-f3", caption: "The same graph as adjacency lists. Each vertex keeps the list of its neighbours; there are 2e = 12 entries in all.", alt: "A table listing each vertex and its neighbours.", fig: { kind: "matrix", title: "Adjacency lists", cols: ["neighbours"], rows: [{ label: "0", cells: ["1, 2"] }, { label: "1", cells: ["0, 3"] }, { label: "2", cells: ["0, 4"] }, { label: "3", cells: ["1, 5"] }, { label: "4", cells: ["2, 5"] }, { label: "5", cells: ["3, 4"] }] } },
    { type: "figure", id: "d13-f4", caption: "BFS from 0. The queue is shown after each vertex is taken out. Vertices are marked as soon as they enter the queue, so none is queued twice.", alt: "A table of the BFS steps with the vertex taken out and the queue after it.", fig: { kind: "matrix", title: "BFS from 0", cols: ["visit", "queue after"], rows: [{ label: "1", cells: [0, "1, 2"] }, { label: "2", cells: [1, "2, 3"] }, { label: "3", cells: [2, "3, 4"] }, { label: "4", cells: [3, "4, 5"] }, { label: "5", cells: [4, "5"] }, { label: "6", cells: [5, "empty"], hl: true }] } },

    { type: "example", id: "d13-e1", level: "easy", title: "Edges from degrees", file: "degrees.txt", given: `A simple undirected graph has 5 vertices with degrees 3, 3, 2, 2, 2.`, find: "The number of edges, and the largest number of edges a simple graph on 5 vertices can have.", steps: [
      { say: "Handshake rule: the degree sum is 2e.", result: "3 + 3 + 2 + 2 + 2 = 12" },
      { say: "So the number of edges is half of that.", result: "e = 6" },
      { say: "The largest number is one edge for each pair of vertices: 5 × 4 / 2.", result: "10" },
    ], answer: "6 edges; at most 10", check: "The degree sum of any graph is even: here 12." },
    { type: "example", id: "d13-e2", level: "easy", title: "Which representation uses less space?", file: "space.txt", given: `A graph with n = 1000 vertices and e = 2000 edges (undirected).`, find: "The cells used by an adjacency matrix and by adjacency lists.", steps: [
      { say: "The matrix has n × n cells.", result: "1,000,000 cells" },
      { say: "The lists need n list heads and 2e entries.", result: "1000 + 4000 = 5000" },
      { say: "The graph is sparse (2000 edges against about 500,000 possible), so lists use about 200 times less space.", result: "lists win" },
    ], answer: "Matrix 1,000,000 cells; lists 5,000", check: "For a complete graph the lists would need n + n(n − 1) cells, no better than the matrix." },
    { type: "example", id: "d13-e3", level: "gate", title: "Cost of finding out whether an edge exists", file: "edge_test.txt", given: `A vertex v has 3 neighbours in a graph with n = 100000 vertices.
Cost of testing "is w a neighbour of v?" with a matrix and with lists.`, find: "Both costs.", steps: [
      { say: "Matrix: look at the entry (v, w).", result: "Θ(1)" },
      { say: "Lists: scan the three entries of the list of v.", result: "Θ(deg v) = 3 steps (up to n in general)" },
    ], answer: "Matrix Θ(1); lists Θ(deg v)", check: "Lists lose this one test and win on space and on listing neighbours." },
    { type: "example", id: "d13-e4", level: "easy", title: "BFS order", file: "bfs_trace.txt", given: `Edges: 0-1, 0-2, 1-3, 2-4, 3-5, 4-5. BFS from 0, neighbours in increasing order.`, find: "The order of visiting.", steps: [
      { say: "Visit 0; queue its unseen neighbours 1 and 2.", result: "queue 1, 2" },
      { say: "Visit 1; queue 3. Visit 2; queue 4.", result: "queue 3, 4" },
      { say: "Visit 3; queue 5. Visit 4: its neighbour 5 is already seen. Visit 5.", result: "0 1 2 3 4 5" },
    ], answer: "0 1 2 3 4 5", check: "The program in this chapter prints the same." },
    { type: "example", id: "d13-e5", level: "gate", title: "DFS order and the running time", file: "dfs_trace.txt", given: `The same graph, DFS from 0, neighbours in increasing order.`, find: "The order of visiting, and the cost on an n-vertex, e-edge graph.", steps: [
      { say: "From 0 go to its first neighbour 1, then from 1 to 3, then from 3 to 5.", result: "0 1 3 5" },
      { say: "At 5 the neighbours are 3 (seen) and 4: go to 4. At 4 the neighbour 2 is unseen: go to 2.", result: "0 1 3 5 4 2" },
      { say: "Each vertex is visited once and each edge looked at twice: with lists Θ(n + e), with a matrix Θ(n²).", result: "Θ(n + e)" },
    ], answer: "0 1 3 5 4 2; Θ(n + e) with lists", check: "The program in this chapter prints the same." },
    { type: "example", id: "d13-e6", level: "edge", title: "Count the components", file: "components.txt", given: `7 vertices and the edges 0-1, 1-2, 3-4, 5-6.`, find: "The number of connected components, and whether the graph has a cycle.", steps: [
      { say: "Start a traversal at 0: it reaches 0, 1, 2. One component.", result: "{0, 1, 2}" },
      { say: "Start again at 3: it reaches 3 and 4. Start again at 5: it reaches 5 and 6.", result: "{3, 4}, {5, 6}" },
      { say: "There are 4 edges on 7 vertices in 3 components. A forest of c trees has n − c = 4 edges, so there is no cycle.", result: "no cycle" },
    ], answer: "3 components; no cycle", check: "n − c = 7 − 3 = 4 edges, as counted." },

    { type: "trap", wrong: "The sum of the degrees of a graph equals the number of edges.", tempting: "Each edge seems to count once.", whyWrong: "Each edge has two ends, and each end adds 1 to a degree. So the sum of the degrees is 2e. A triangle has degrees 2, 2, 2 (sum 6) and 3 edges.", rule: "Degree sum = 2e.", ex: { code: "triangle: degrees 2 + 2 + 2", out: "6 = 2 × 3 edges" } },
    { type: "trap", wrong: "A graph traversal always takes Θ(n + e) time.", tempting: "That is the usual statement for BFS and DFS.", whyWrong: "Θ(n + e) holds when the graph is stored as adjacency lists. With an adjacency matrix the neighbours of a vertex are found by scanning a whole row of n entries, so the traversal costs Θ(n²), even if the graph has only a few edges.", rule: "Traversal: Θ(n + e) with lists, Θ(n²) with a matrix.", ex: { code: "n = 1000, e = 999 (a path), matrix", out: "about 1,000,000 steps, not 2,000" } },
    { type: "trap", wrong: "Breadth-first search takes a stack and depth-first search a queue.", tempting: "'Depth' sounds like deep stacks.", whyWrong: "BFS must serve the OLDEST discovered vertex first, which is a queue (FIFO). DFS must go back to the MOST RECENT unfinished vertex, which is a stack (LIFO) or the recursion. Swapping them swaps the two orders.", rule: "BFS: queue. DFS: stack or recursion.", ex: { code: "BFS from 0 on the example: 0 1 2 3 4 5\nDFS from 0 on the example: 0 1 3 5 4 2", out: "different orders" } },

    { type: "gate", text: "No past question is tagged to this chapter by the Programming and Data Structures label. The graph questions of the paper sit under Algorithms (traversals, spanning trees, shortest paths) and Discrete Mathematics (degrees, connectivity)." },
    { type: "recall", cards: [
      { q: "State the handshake rule.", a: "The sum of the degrees equals 2e." },
      { q: "Most edges in a simple undirected graph on n vertices?", a: "n(n − 1)/2." },
      { q: "Space of the adjacency matrix? Of adjacency lists?", a: "Θ(n²); Θ(n + e)." },
      { q: "Cost of testing an edge i–j with a matrix? With lists?", a: "Θ(1); Θ(deg i)." },
      { q: "Cost of listing the neighbours of v with each?", a: "Matrix Θ(n); lists Θ(deg v)." },
      { q: "What does the k-th power of the adjacency matrix count?", a: "Walks of length k." },
      { q: "Which structure does BFS use? DFS?", a: "A queue; a stack or recursion." },
      { q: "When must a vertex be marked seen in BFS?", a: "When it is put into the queue." },
      { q: "Traversal time with lists? With a matrix?", a: "Θ(n + e); Θ(n²)." },
      { q: "What is a tree as a graph?", a: "A connected graph with n − 1 edges and no cycle." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "A simple undirected graph has 6 vertices, each of degree 3. How many edges does it have?", answer: "9", solution: "Degree sum 18 = 2e, so e = 9." },
      { id: "h2", kind: "NAT", marks: 1, q: "What is the largest number of edges in a simple undirected graph with 8 vertices?", answer: "28", solution: "8 × 7 / 2." },
      { id: "h3", kind: "MCQ", marks: 1, q: "Which structure does breadth-first search use?", options: ["Stack", "Queue", "Heap", "Binary search tree"], answer: "B", solution: "The oldest discovered vertex is served first." },
      { id: "h4", kind: "MCQ", marks: 1, q: "The time of a depth-first traversal on an adjacency matrix of n vertices is", options: ["Θ(n)", "Θ(n log n)", "Θ(n²)", "Θ(n³)"], answer: "C", solution: "Each of the n vertices scans a row of n entries." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["The sum of degrees is 2e", "Adjacency lists use Θ(n + e) space", "An adjacency matrix tests an edge in Θ(1)", "BFS uses a stack"], answer: "A, B, C", solution: "BFS uses a queue." },
      { id: "h6", kind: "NAT", marks: 2, q: "A graph has the edges 0-1, 0-2, 0-3, 1-4, 2-4. BFS from 0, taking neighbours in increasing order, visits the vertices in some order. Which position (counting from 1) does vertex 4 take?", answer: "5", solution: "Order 0, 1, 2, 3, 4: vertex 4 is fifth." },
      { id: "h7", kind: "NAT", marks: 2, q: "For the graph with edges 0-1, 0-2, 0-3, 1-4, 2-4, DFS from 0 (neighbours in increasing order) visits vertices in the order 0, 1, 4, 2, 3. At which position does vertex 3 occur?", answer: "5", solution: "0, 1, 4, 2, 3: vertex 3 is fifth." },
      { id: "h8", kind: "NAT", marks: 2, q: "A graph on 10 vertices has 3 connected components and no cycle. How many edges does it have?", answer: "7", solution: "A forest has n − c edges: 10 − 3." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on graph traversals", sub: "Algorithms", href: "/topics/algorithms" }, { label: "The Data Structures book", sub: "back to the contents", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Queues (D5)", "Stacks (D4)", "Recursion (C8)", "Linked lists (D3)"], usedIn: ["Algorithms: shortest paths, spanning trees, graph traversals", "Discrete maths: connectivity and colouring"], cross: ["Discrete maths: graph theory"] },
  ],
};
