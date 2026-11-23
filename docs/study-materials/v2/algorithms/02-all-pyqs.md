# Algorithms: every PYQ in the bank (73 questions)

Full text with options. "✔ official" marks the official key. Figures are not included (the question says so).

---

**2026_FN_Q17** · 2026-FN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following recurrence relations:
For all \( n > 1 \),
$$ T_1(n) = 4T_1\left(\frac{n}{2}\right) + T_2(n) $$
$$ T_2(n) = 5T_2\left(\frac{n}{4}\right) + \theta(\log_2 n) $$
Assume that for all \( n \le 1 \), \( T_1(n) = 1 \) and \( T_2(n) = 1 \).
Which one of the following options is correct?

- A) \( T_1(n) = \theta(n^2) \)  ✔ official
- B) \( T_1(n) = \theta(n^2 \log_2 n) \)
- C) \( T_1(n) = \theta(n^{\log_4 5}) \)
- D) \( T_1(n) = \theta(n^{\log_4 5} \log_2 n) \)

---

**2026_FN_Q24** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Consider a hash table \( P[0, 1, \dots, 10] \) that is initially empty. The hash table is maintained using open addressing with linear probing. The hash function used is \( h(x) = (x + 7) \bmod 11 \).
Consider the following sequence of insertions performed on \( P \):
1, 13, 22, 15, 11, 24
Which of the following positions in the hash table is/are empty after these insertions are performed?

- A) 0
- B) 10
- C) 2  ✔ official
- D) 1

---

**2026_AN_Q24** · 2026-AN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following functions, where \( n \) is a positive integer.
$$ n^{1/3}, \log(n), \log(n!), 2^{\log(n)} $$
Which one of the following options lists the functions in increasing order of asymptotic growth rate?
*Note:* Assume the base of log to be 2.

- A) \( \log(n), n^{1/3}, 2^{\log(n)}, \log(n!) \)  ✔ official
- B) \( n^{1/3}, \log(n), \log(n!), 2^{\log(n)} \)
- C) \( \log(n), n^{1/3}, \log(n!), 2^{\log(n)} \)
- D) \( 2^{\log(n)}, n^{1/3}, \log(n), \log(n!) \)

---

**2026_AN_Q25** · 2026-AN · MSQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Which of the following can be recurrence relation(s) corresponding to an algorithm with time complexity \( \Theta(n) \)?

- A) \( T(n) = T(n - 1) + 1, \quad T(1) = 1 \)  ✔ official
- B) \( T(n) = 2T\left(\frac{n}{2}\right) + 1, \quad T(1) = 1 \)  ✔ official
- C) \( T(n) = 2T\left(\frac{n}{2}\right) + n, \quad T(1) = 1 \)
- D) \( T(n) = T(n - 1) + n, \quad T(1) = 1 \)

---

**2026_AN_Q30** · 2026-AN · NAT · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

The keys 5, 28, 19, 15, 26, 33, 12, 17, 10 are inserted into a hash table using the hash function \( h(k) = k \bmod 9 \). The collisions are resolved by chaining. After all the keys are inserted, the length of the longest chain is ________. (answer in integer)

Official answer (numeric): 3 to 3

---

**2026_AN_Q32** · 2026-AN · NAT · 1 mark · Hard · bank topic: Divide-and-Conquer Designs

Consider an array \( A = [10, 7, 8, 19, 41, 35, 25, 31] \). Suppose the merge sort algorithm is executed on array \( A \) to sort it in increasing order. The merge sort algorithm will carry out a total of 7 merge operations.
A merge operation on sorted left array \( L \) and sorted right array \( R \) is said to be void if the output of the merge operation is the elements of array \( L \) followed by the elements of array \( R \).
The number of void merge operations among these 7 merge operations is ________. (answer in integer)

Official answer (numeric): 3 to 3

---

**2026_AN_Q37** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Let \( G \) be a weighted directed acyclic graph with \( m \) edges and \( n \) vertices. Given \( G \) and a source vertex \( s \) in \( G \), which one of the following options gives the worst case time complexity of the fastest algorithm to find the lengths of shortest paths from \( s \) to all vertices that are reachable from \( s \) in \( G \)?

- A) \( \theta(m + n) \)  ✔ official
- B) \( \theta(m + n \log(n)) \)
- C) \( \theta(nm) \)
- D) \( \theta(n^3) \)

---

**2026_AN_Q38** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Consider an array \( A \) of integers of size \( n \). The indices of \( A \) run from 1 to \( n \). An algorithm is to be designed to check whether \( A \) satisfies the condition given below.
\( \forall i, j \in \{1, \dots, n - 1\} \) such that \( i > j \), \( (A[i + 1] - A[i]) > (A[j + 1] - A[j]) \)
Which one of the following gives the worst case time complexity of the fastest algorithm that can be designed for the problem?

- A) \( \theta(n) \)  ✔ official
- B) \( \theta(\log(n)) \)
- C) \( \theta(n \log(n)) \)
- D) \( \theta(n^2) \)

---

**2026_AN_Q39** · 2026-AN · MCQ · 2 marks · Hard · bank topic: Dynamic Programming Infrastructure

Consider a table \( T \), where the elements \( T[i][j], 0 \le i, j \le n \), represent the cost of the optimal solutions of different subproblems of a problem that is being solved using a dynamic programming algorithm. The recursive formulation to compute the table entries is as follows:
\( T[0][k] = T[k][0] = 1 \) for \( k = 0, 1, 2, \dots, n \)
\( T[i][j] = 2T[i - 1][j] + 3T[i][j - 1] \) for \( 1 \le i, j \le n \)
Consider the following two algorithms to compute entries of \( T \). Assume that for both the algorithms, for all \( 0 \le i, j \le n \), \( T[i][j] \) has been initialized to 1.
Algorithm \( B_1 \): For \( i = 1, 2, \dots, n \)
For \( j = 1, 2, \dots, n \)
\( T[i][j] = 2T[i - 1][j] + 3T[i][j - 1] \)
Algorithm \( B_2 \): For \( s = 2, 3, \dots, 2n \)
For \( i = 1, 2, \dots, n \)
For \( j = 1, 2, \dots, n \)
If \( (i + j == s) \)
\( T[i][j] = 2T[i - 1][j] + 3T[i][j - 1] \)
Algorithm \( B_k, k \in \{1, 2\} \) is said to be correct if and only if it calculates the correct values of \( T[i][j] \), for all \( 0 \le i, j \le n \), (as per the recursive formulation) at the end of the execution of the algorithm \( B_k \).
Which one of the following statements is true?

- A) Both algorithms \( B_1 \) and \( B_2 \) are correct  ✔ official
- B) Algorithm \( B_1 \) is correct, but algorithm \( B_2 \) is incorrect
- C) Algorithm \( B_2 \) is correct, but algorithm \( B_1 \) is incorrect
- D) Both algorithms \( B_1 \) and \( B_2 \) are incorrect

---

**2026_FN_Q41** · 2026-FN · MCQ · 2 marks · Hard · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Let \( G(V, E) \) be an undirected, edge-weighted graph with integer weights. The weight of a path is the sum of the weights of the edges in that path. The length of a path is the number of edges in that path.
Let \( s \in V \) be a vertex in \( G \). For every \( u \in V \) and for every \( k \ge 0 \), let \( d_k(u) \) denote the weight of a shortest path (in terms of weight) from \( s \) to \( u \) of length at most \( k \). If there is no path from \( s \) to \( u \) of length at most \( k \), then \( d_k(u) = \infty \).
Consider the statements:
S1: For every \( k \ge 0 \) and \( u \in V \), \( d_{k+1}(u) \le d_k(u) \).
S2: For every \( (u, v) \in E \), if \( (u, v) \) is part of a shortest path (in terms of weight) from \( s \) to \( v \), then for every \( k \ge 0 \), \( d_k(u) \le d_k(v) \).
Which one of the following options is correct?

- A) Only S1 is true  ✔ official
- B) Only S2 is true
- C) Both S1 and S2 are true
- D) Neither S1 nor S2 is true

---

**2026_FN_Q49** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \( G(V, E) \) be a simple, undirected, edge-weighted graph with unique edge weights. Which of the following statements about the minimum spanning trees (MST) of \( G \) is/are true?

- A) In every cycle \( C \) of \( G \), the edge with the largest weight in \( C \) is not in any MST  ✔ official
- B) In every cycle \( C \) of \( G \), the edge with the smallest weight in \( C \) is in every MST
- C) For every vertex \( v \in V \), the edge with the largest weight incident on \( v \) is not in any MST
- D) For every vertex \( v \in V \), the edge with the smallest weight incident on \( v \) is in every MST  ✔ official

---

**2026_FN_Q50** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Consider the following pseudocode for depth-first search (DFS) algorithm which takes a directed graph \( G(V, E) \) as input, where \( d[v] \) and \( f[v] \) are the discovery time and finishing time, respectively, of the vertex \( v \in V \).
```
DFS(G):
  unmark all v ∈ V
  t ← 0
  for each v ∈ V
    if v is unmarked
      t ← Explore(G, v, t)
    end if
  end for

Explore(G, v, t):
  mark v
  t ← t + 1
  d[v] ← t
  for each (v, w) ∈ E
    if w is unmarked
      t ← Explore(G, w, t)
    end if
  end for
  t ← t + 1
  f[v] ← t
  return t
```
Suppose that the input directed graph \( G(V, E) \) is a directed acyclic graph (DAG). For an edge \( (u, v) \in E \), which of the following options will NEVER be correct?

- A) \( d[u] < d[v] < f[v] < f[u] \)
- B) \( d[v] < d[u] < f[u] < f[v] \)  ✔ official
- C) \( d[v] < f[v] < d[u] < f[u] \)
- D) \( d[u] < d[v] < f[u] < f[v] \)  ✔ official

---

**2025_FN_Q18** · 2025-FN · MCQ · 1 mark · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \( G \) be any undirected graph with positive edge weights, and \( T \) be a minimum spanning tree of \( G \). For any two vertices, \( u \) and \( v \), let \( d_1(u, v) \) and \( d_2(u, v) \) be the shortest distances between \( u \) and \( v \) in \( G \) and \( T \), respectively. Which ONE of the options is CORRECT for all possible \( G \), \( T \), \( u \) and \( v \)?

- A) \( d_1(u, v) = d_2(u, v) \)
- B) \( d_1(u, v) \le d_2(u, v) \)  ✔ official
- C) \( d_1(u, v) \ge d_2(u, v) \)
- D) \( d_1(u, v) \neq d_2(u, v) \)

---

**2025_FN_Q20** · 2025-FN · MCQ · 1 mark · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following recurrence relation:
\( T(n) = 2T(n - 1) + n2^n \) for \( n > 0 \), \( T(0) = 1 \)
Which ONE of the following options is CORRECT?

- A) \( T(n) = \Theta(n^2 2^n) \)  ✔ official
- B) \( T(n) = \Theta(n 2^n) \)
- C) \( T(n) = \Theta((\log n)^2 2^n) \)
- D) \( T(n) = \Theta(4^n) \)

---

**2025_AN_Q20** · 2025-AN · MCQ · 1 mark · Easy · bank topic: Searching, Sorting, Hashing Mechanisms

Consider an unordered list of \( N \) distinct integers.
What is the minimum number of element comparisons required to find an integer in the list that is NOT the largest in the list?

- A) 1  ✔ official
- B) \( N - 1 \)
- C) \( N \)
- D) \( 2N - 1 \)

---

**2025_AN_Q29** · 2025-AN · MSQ · 1 mark · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Which of the following statements regarding Breadth First Search (BFS) and Depth First Search (DFS) on an undirected simple graph G is/are TRUE?

- A) A DFS tree of \( G \) is a Shortest Path tree of \( G \).
- B) Every non-tree edge of \( G \) with respect to a DFS tree is a forward/back edge.  ✔ official
- C) If \( (u, v) \) is a non-tree edge of \( G \) with respect to a BFS tree, then the distances from the source vertex \( s \) to \( u \) and \( v \) in the BFS tree are within \( \pm 1 \) of each other.  ✔ official
- D) Both BFS and DFS can be used to find the connected components of \( G \).  ✔ official

---

**2025_FN_Q33** · 2025-FN · NAT · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

The pseudocode of a function fun( ) is given below:
```c
fun(int A[0, ..., n - 1]) {
    for i = 0 to n - 2
        for j = 0 to n - i - 2
            if (A[j] > A[j + 1])
                then swap A[j] and A[j + 1]
}
```
Let A[0, ..., 29] be an array storing 30 distinct integers in descending order. The number of swap operations that will be performed, if the function fun( ) is called with A[0, ..., 29] as argument, is ________. (Answer in integer)

Official answer (numeric): 435 to 435

---

**2025_AN_Q37** · 2025-AN · MCQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \( G \) be an edge-weighted undirected graph with positive edge weights. Suppose a positive constant \( \alpha \) is added to the weight of every edge.
Which ONE of the following statements is TRUE about the minimum spanning trees (MSTs) and shortest paths (SPs) in \( G \) before and after the edge weight update?

- A) Every MST remains an MST, and every SP remains an SP.
- B) MSTs need not remain MSTs, and every SP remains an SP.
- C) Every MST remains an MST, and SPs need not remain SPs.  ✔ official
- D) MSTs need not remain MSTs, and SPs need not remain SPs.

---

**2025_AN_Q41** · 2025-AN · MCQ · 2 marks · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

An array \( A \) of length \( n \) with distinct elements is said to be bitonic if there is an index \( 1 = i = n \) such that \( A[1..i] \) is sorted in the non-decreasing order and \( A[i+1..n] \) is sorted in the non-increasing order.
Which ONE of the following represents the best possible asymptotic bound for the worst-case number of comparisons by an algorithm that searches for an element in a bitonic array \( A \)?

- A) \( \Theta(n) \)
- B) \( \Theta(1) \)
- C) \( \Theta(\log^2 n) \)
- D) \( \Theta(\log n) \)  ✔ official

---

**2025_AN_Q59** · 2025-AN · NAT · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths · HAS A FIGURE (not shown here)

Consider the following algorithm `someAlgo` that takes an undirected graph G as input.
`someAlgo(G)`
1. Let \( v \) be any vertex in \( G \). Run BFS on \( G \) starting at \( v \). Let \( u \) be a vertex in \( G \) at maximum distance from \( v \) as given by the BFS.
2. Run BFS on \( G \) again with \( u \) as the starting vertex. Let \( z \) be the vertex at maximum distance from \( u \) as given by the BFS.
3. Output the distance between \( u \) and \( z \) in \( G \).
The output of `someAlgo(T)` for the tree shown in the given figure is ________. (Answer in integer)
[IMAGE_Q_59_1]

Official answer (numeric): 6 to 6

---

**2025_FN_Q64** · 2025-FN · NAT · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms) · HAS A FIGURE (not shown here)

The maximum value of \( x \) such that the edge between the nodes B and C is included in every minimum spanning tree of the given graph is ________. (Answer in integer)
[IMAGE_Q_64_1]

Official answer (numeric): 5 to 5

---

**2025_FN_Q65** · 2025-FN · NAT · 2 marks · Hard · bank topic: Searching, Sorting, Hashing Mechanisms

In a double hashing scheme, \( h_1(k) = k \bmod 11 \) and \( h_2(k) = 1 + (k \bmod 7) \) are the auxiliary hash functions. The size \( m \) of the hash table is 11. The hash function for the \( i^{\text{th}} \) probe in the open address table is \( [h_1(k) + i \cdot h_2(k)] \bmod m \). The following keys are inserted in the given order: 63, 50, 25, 79, 67, 24.
The slot at which key 24 gets stored is ________. (Answer in integer)

Official answer (numeric): 10 to 11

---

**2024_FN_Q20** · 2024-FN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Given an integer array of size \( N \), we want to check if the array is sorted (in either ascending or descending order). An algorithm solves this problem by making a single pass through the array and comparing each element of the array only with its adjacent elements. The worst-case time complexity of this algorithm is

- A) Both \( O(N) \) and \( \Omega(N) \)  ✔ official
- B) \( O(N) \) but not \( \Omega(N) \)
- C) \( \Omega(N) \) but not \( O(N) \)
- D) Neither \( O(N) \) nor \( \Omega(N) \)

---

**2024_AN_Q11** · 2024-AN · NAT · 1 mark · Medium · bank topic: Dynamic Programming Infrastructure

Let \( A \) be an array containing integer values. The distance of \( A \) is defined as the minimum number of elements in \( A \) that must be replaced with another integer so that the resulting array is sorted in non-decreasing order. The distance of the array [2, 5, 3, 1, 4, 2, 6] is ________.

Official answer (numeric): 3 to 3

---

**2024_FN_Q57** · 2024-FN · MCQ · 2 marks · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following recurrence relation:
\[ T(n) = \begin{cases} \sqrt{n} T(\sqrt{n}) + n & \text{for } n \ge 1 \\ 1 & \text{for } n = 1 \end{cases} \]
Which one of the following options is CORRECT?

- A) \( T(n) = \Theta(n \log \log n) \)  ✔ official
- B) \( T(n) = \Theta(n \log n) \)
- C) \( T(n) = \Theta(n^2 \log n) \)
- D) \( T(n) = \Theta(n^2 \log \log n) \)

---

**2024_FN_Q60** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Let \( G \) be a directed graph and \( T \) a depth first search (DFS) spanning tree in \( G \) that is rooted at a vertex \( v \). Suppose \( T \) is also a breadth first search (BFS) tree in \( G \), rooted at \( v \). Which of the following statements is/are TRUE for every such graph \( G \) and tree \( T \)?

- A) There are no back-edges in \( G \) with respect to the tree \( T \).
- B) There are no cross-edges in \( G \) with respect to the tree \( T \).
- C) There are no forward-edges in \( G \) with respect to the tree \( T \).  ✔ official
- D) The only edges in \( G \) are the edges in \( T \).

---

**2024_AN_Q53** · 2024-AN · NAT · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms) · HAS A FIGURE (not shown here)

The number of distinct minimum-weight spanning trees of the following graph is ________.
[IMAGE_Q_53_1]

Official answer (numeric): 9 to 9

---

**2024_FN_Q37** · 2024-FN · NAT · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

The number of edges present in the forest generated by the DFS traversal of an undirected graph \( G \) with 100 vertices is 40. The number of connected components in \( G \) is ________.

Official answer (numeric): 60 to 60

---

**2023_FN_Q20** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

An algorithm has to store several keys generated by an adversary in a hash table. The adversary is malicious who tries to maximize the number of collisions. Let \( k \) be the number of keys, \( m \) be the number of slots in the hash table, and \( k > m \).
Which one of the following is the best hashing strategy to counteract the adversary?

- A) Division method, i.e., use the hash function \( h(k) = k \bmod m \).
- B) Multiplication method, i.e., use the hash function \( h(k) = \lfloor m (kA - \lfloor kA \rfloor) \rfloor \), where \( A \) is a carefully chosen constant.
- C) Universal hashing method.  ✔ official
- D) If \( k \) is a prime number, use Division method. Otherwise, use Multiplication method.

---

**2023_FN_Q29** · 2023-FN · MSQ · 1 mark · Easy · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Let \( f \) and \( g \) be functions of natural numbers given by \( f(n) = n \) and \( g(n) = n^2 \).
Which of the following statements is/are TRUE?

- A) \( f \in O(g) \)  ✔ official
- B) \( f \in \Omega(g) \)
- C) \( f \in o(g) \)  ✔ official
- D) \( f \in \Theta(g) \)

---

**2023_FN_Q54** · 2023-FN · MSQ · 2 marks · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider functions Function 1 and Function 2 expressed in pseudocode as follows:
Function 1
```
while n > 1 do
    for i = 1 to n do
        x = x + 1;
    end for
    n = \lfloor n/2 \rfloor;
end while
```
Function 2
```
for i = 1 to 100 * n do
    x = x + 1;
end for
```
Let \(f_1(n)\) and \(f_2(n)\) denote the number of times the statement "x = x + 1" is executed in Function_1 and Function_2, respectively.
Which of the following statements is/are TRUE?

- A) \(f_1(n) \in \Theta(f_2(n))\)  ✔ official
- B) \(f_1(n) \in o(f_2(n))\)
- C) \(f_1(n) \in \omega(f_2(n))\)
- D) \(f_1(n) \in O(n)\)  ✔ official

---

**2022_FN_Q11** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Which one of the following statements is TRUE for all positive functions \(f(n)\)?

- A) \(f(n^2) = \theta(f(n)^2)\), when \(f(n)\) is a polynomial  ✔ official
- B) \(f(n^2) = o(f(n)^2)\)
- C) \(f(n^2) = O(f(n)^2)\), when \(f(n)\) is an exponential function
- D) \(f(n^2) = \Omega(f(n)^2)\)

---

**2022_FN_Q16** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Suppose we are given \(n\) keys, \(m\) hash table slots, and two simple uniform hash functions \(h_1\) and \(h_2\). Further suppose our hashing scheme uses \(h_1\) for the odd keys and \(h_2\) for the even keys. What is the expected number of keys in a slot?

- A) \(\frac{m}{n}\)
- B) \(\frac{n}{m}\)  ✔ official
- C) \(\frac{2n}{m}\)
- D) \(\frac{n}{2m}\)

---

**2022_FN_Q49** · 2022-FN · MSQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Consider a simple undirected weighted graph \(G\), all of whose edge weights are distinct. Which of the following statements about the minimum spanning trees of \(G\) is/are TRUE?

- A) The edge with the second smallest weight is always part of any minimum spanning tree of \(G\).  ✔ official
- B) One or both of the edges with the third smallest and the fourth smallest weights are part of any minimum spanning tree of \(G\).  ✔ official
- C) Suppose \(S \subseteq V\) be such that \(S \neq \phi\) and \(S \neq V\). Consider the edge with the minimum weight such that one of its vertices is in \(S\) and the other in \(V \setminus S\). Such an edge will always be part of any minimum spanning tree of \(G\).  ✔ official
- D) \(G\) can have multiple minimum spanning trees.

---

**2021_AN_Q64** · 2021-AN · MCQ · 1 mark · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \(G\) be a connected undirected weighted graph. Consider the following two statements.
\(S_1\) : There exists a minimum weight edge in \(G\) which is present in every minimum spanning tree of \(G\).
\(S_2\) : If every edge in \(G\) has distinct weight, then \(G\) has a unique minimum spanning tree.
Which one of the following options is correct?

- A) Both \(S_1\) and \(S_2\) are true.
- B) \(S_1\) is true and \(S_2\) is false.
- C) \(S_1\) is false and \(S_2\) is true.  ✔ official
- D) Both \(S_1\) and \(S_2\) are false.

---

**2021_FN_Q30** · 2021-FN · MCQ · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Let \(P\) be an array containing \(n\) integers. Let \(t\) be the lowest upper bound on the number of comparisons of the array elements, required to find the minimum and maximum values in an arbitrary array of \(n\) elements. Which one of the following choices is correct?

- A) \(t > 2n - 2\)
- B) \(t > 3 \left\lceil \frac{n}{2} \right\rceil\) and \(t \leq 2n - 2\)
- C) \(t > n\) and \(t \leq 3 \left\lceil \frac{n}{2} \right\rceil\)  ✔ official
- D) \(t > \lceil \log_2(n) \rceil\) and \(t \leq n\)

---

**2021_FN_Q61** · 2021-FN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following three functions:
\(f_1 = 10^n, f_2 = n^{\log n}, f_3 = n^{\sqrt{n}}\) 
Which one of the following options arranges the functions in the increasing order of asymptotic growth rate?

- A) \(f_3, f_2, f_1\)
- B) \(f_2, f_1, f_3\)
- C) \(f_1, f_2, f_3\)
- D) \(f_2, f_3, f_1\)  ✔ official

---

**2021_AN_Q31** · 2021-AN · MCQ · 1 mark · Easy · bank topic: Searching, Sorting, Hashing Mechanisms

What is the worst-case number of arithmetic operations performed by recursive binary search on a sorted array of size \(n\)?

- A) \(\Theta(\sqrt{n})\)
- B) \(\Theta(\log_2 (n))\)  ✔ official
- C) \(\Theta(n^2)\)
- D) \(\Theta(n)\)

---

**2021_FN_Q25** · 2021-FN · MCQ · 1 mark · Easy · bank topic: Searching, Sorting, Hashing Mechanisms · HAS A FIGURE (not shown here)

Consider the following array:

[IMAGE_Q_25_1]

Which algorithm out of the following options uses the least number of comparisons (among the array elements) to sort the above array in ascending order?

- A) Selection sort
- B) Mergesort
- C) Insertion sort  ✔ official
- D) Quicksort using the last element as pivot

---

**2021_AN_Q25** · 2021-AN · NAT · 1 mark · Easy · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Consider a complete binary tree with 7 nodes. Let \(A\) denote the set of first 3 elements obtained by performing Breadth-First Search (BFS) starting from the root. Let \(B\) denote the set of first 3 elements obtained by performing Depth-First Search (DFS) starting from the root. The value of \(|A - B|\) is _________.

Official answer (numeric): 1 to 1

---

**2021_FN_Q48** · 2021-FN · NAT · 1 mark · Hard · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms) · HAS A FIGURE (not shown here)

Consider the following undirected graph with edge weights as shown:

[IMAGE_Q_48_1]

The number of minimum-weight spanning trees of the graph is _________.

Official answer (numeric): 3 to 3

---

**2021_AN_Q57** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Greedy Approach & Divide-and-Conquer Designs

Consider the string abbccdddee. Each letter in the string must be assigned a binary code satisfying the following properties:
1. For any two letters, the code assigned to one letter must not be a prefix of the code assigned to the other letter.
2. For any two letters of the same frequency, the letter which occurs earlier in the dictionary order is assigned a code whose length is at most the length of the code assigned to the other letter.
Among the set of all binary code assignments which satisfy the above two properties, what is the minimum length of the encoded string?

- A) 21
- B) 23  ✔ official
- C) 25
- D) 30

---

**2021_FN_Q50** · 2021-FN · MCQ · 2 marks · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following recurrence relation:
$$ T(n) = \begin{cases} T\left(\left\lceil \frac{n}{2} \right\rceil\right) + T\left(\left\lfloor \frac{2n}{5} \right\rfloor\right) + 7n & \text{if } n > 0 \\ 1 & \text{if } n = 0 \end{cases} $$
Which one of the following options is correct?

- A) \(T(n) = \theta(n^{5/2})\)
- B) \(T(n) = \theta(n \log n)\)
- C) \(T(n) = \theta(n)\)  ✔ official
- D) \(T(n) = \theta((\log n)^{5/2})\)

---

**2021_AN_Q55** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

For constants \(a \geq 1\) and \(b > 1\), consider the following recurrence defined on the non-negative integers:
$$ T(n) = a \cdot T\left(\left\lceil \frac{n}{b} \right\rceil\right) + f(n) $$
Which one of the following options is correct about the recurrence \(T(n)\)?

- A) If \(f(n)\) is \(n \log_2(n)\), then \(T(n)\) is \(\Theta(n \log_2(n))\).
- B) If \(f(n)\) is \(\frac{n}{\log_2(n)}\), then \(T(n)\) is \(\Theta(\log_2(n))\).
- C) If \(f(n)\) is \(O(n^{\log_b(a) - \epsilon})\) for some \(\epsilon > 0\), then \(T(n)\) is \(\Theta(n^{\log_b(a)})\).  ✔ official
- D) If \(f(n)\) is \(\Theta(n^{\log_b(a)})\), then \(T(n)\) is \(\Theta(n^{\log_b(a)})\).

---

**2021_FN_Q17** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Dynamic Programming Infrastructure

Define \(R_n\) to be the maximum amount earned by cutting a rod of length \(n\) meters into one or more pieces of integer length and selling them. For \(i > 0\), let \(p[i]\) denote the selling price of a rod whose length is \(i\) meters. Consider the array of prices:
\(p[1] = 1, p[2] = 5, p[3] = 8, p[4] = 9, p[5] = 10, p[6] = 17, p[7] = 18\)
Which of the following statements is/are correct about \(R_7\)?

- A) \(R_7 = 18\)  ✔ official
- B) \(R_7 = 19\)
- C) \(R_7\) is achieved by three different solutions.  ✔ official
- D) \(R_7\) cannot be achieved by a solution consisting of three pieces.

---

**2021_FN_Q39** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

An articulation point in a connected graph is a vertex such that removing the vertex and its incident edges disconnects the graph into two or more connected components.
Let \(T\) be a DFS tree obtained by doing DFS in a connected undirected graph \(G\).
Which of the following options is/are correct?

- A) Root of \(T\) can never be an articulation point in \(G\).
- B) Root of \(T\) is an articulation point in \(G\) if and only if it has 2 or more children.  ✔ official
- C) A leaf of \(T\) can be an articulation point in \(G\).
- D) If \(u\) is an articulation point in \(G\) such that \(x\) is an ancestor of \(u\) in \(T\) and \(y\) is a descendent of \(u\) in \(T\), then all paths from \(x\) to \(y\) in \(G\) must pass through \(u\).

---

**2021_AN_Q30** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths · HAS A FIGURE (not shown here)

Consider the following directed graph:

[IMAGE_Q_30_1]

Which of the following is/are correct about the graph?

- A) The graph does not have a topological order.  ✔ official
- B) A depth-first traversal starting at vertex \(S\) classifies three directed edges as back edges.  ✔ official
- C) The graph does not have a strongly connected component.
- D) For each pair of vertices \(u\) and \(v\), there is a directed path from \(u\) to \(v\).

---

**2021_FN_Q49** · 2021-FN · MSQ · 2 marks · Hard · bank topic: Searching, Sorting, Hashing Mechanisms · HAS A FIGURE (not shown here)

Consider a dynamic hashing approach for 4-bit integer keys:
1. There is a main hash table of size 4.
2. The 2 least significant bits of a key is used to index into the main hash table.
3. Initially, the main hash table entries are empty.
4. Thereafter, when more keys are hashed into it, to resolve collisions, the set of all keys corresponding to a main hash table entry is organized as a binary tree that grows on demand.
5. First, the \(3^{\text{rd}}\) least significant bit is used to divide the keys into left and right subtrees.
6. To resolve more collisions, each node of the binary tree is further sub-divided into left and right subtrees based on the \(4^{\text{th}}\) least significant bit.
7. A split is done only if it is needed, i.e., only when there is a collision.
Consider the following state of the hash table.

[IMAGE_Q_49_1]

Which of the following sequences of key insertions can cause the above state of the hash table (assume the keys are in decimal notation)?

- A) 5, 9, 4, 13, 10, 7
- B) 9, 5, 10, 6, 7, 1
- C) 10, 9, 6, 7, 5, 13  ✔ official
- D) 9, 5, 13, 6, 10, 14

---

**2021_AN_Q19** · 2021-AN · NAT · 2 marks · Hard · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths · HAS A FIGURE (not shown here)

In a directed acyclic graph with a source vertex \(s\), the quality-score of a directed path is defined to be the product of the weights of the edges on the path. Further, for a vertex \(v\) other than \(s\), the quality-score of \(v\) is defined to be the maximum among the quality-scores of all the paths from \(s\) to \(v\). The quality-score of \(s\) is assumed to be 1.

[IMAGE_Q_19_1]

The sum of the quality-scores of all the vertices in the graph shown above is _________.

Official answer (numeric): 929 to 929

---

**2020_FN_Q34** · 2020-FN · MCQ · 1 mark · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

For parameters \( a \) and \( b \), both of which are \( \omega(1) \), \( T(n) = T(n^{1/a}) + 1 \), and \( T(b) = 1 \). Then \( T(n) \) is

- A) \( \Theta(\log_a \log_b n) \)  ✔ official
- B) \( \Theta(\log_{ab} n) \)
- C) \( \Theta(\log_b \log_a n) \)
- D) \( \Theta(\log_2 \log_2 n) \)

---

**2020_FN_Q28** · 2020-FN · NAT · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Consider a double hashing scheme in which the primary hash function is \( h_1(k) = k \bmod 23 \) and the secondary hash function is \( h_2(k) = 1 + (k \bmod 19) \). Assume that the table size is 23. Then the address returned by probe 1 in the probe sequence (assume that the probe sequence begins at probe 0) for key value \( k = 90 \) is ________.

Official answer (numeric): 13 to 13

---

**2020_FN_Q39** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \( G = (V, E) \) be a weighted undirected graph and let \( T \) be a Minimum Spanning Tree (MST) of \( G \) maintained using adjacency lists. Suppose a new weighted edge \( (u, v) \in V \times V \) is added to \( G \). The worst case time complexity of determining if \( T \) is still an MST of the resultant graph is

- A) \( \Theta(|E| + |V|) \)
- B) \( \Theta(|E||V|) \)
- C) \( \Theta(|E| \log |V|) \)
- D) \( \Theta(|V|) \)  ✔ official

---

**2020_FN_Q57** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Let \( G = (V, E) \) be a directed, weighted graph with weight function \( w : E \rightarrow \mathbb{R} \). For some function \( f : V \rightarrow \mathbb{R} \), for each edge \( (u, v) \in E \), define \( w'(u, v) \) as \( w(u, v) + f(u) - f(v) \).
Which one of the options completes the following sentence so that it is TRUE?
"The shortest paths in G under w are shortest paths under w' too, ________".

- A) for every \( f : V \rightarrow \mathbb{R} \)  ✔ official
- B) if and only if \( \forall u \in V, f(u) \) is positive
- C) if and only if \( \forall u \in V, f(u) \) is negative
- D) if and only if \( f(u) \) is the distance from \( s \) to \( u \) in the graph obtained by adding a new vertex \( s \) to \( G \) and edges of zero weight from \( s \) to every vertex of \( G \)

---

**2020_FN_Q56** · 2020-FN · NAT · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Consider a graph \( G = (V, E) \), where \( V = \{v_1, v_2, ..., v_{100}\} \), \( E = \{(v_i, v_j) \mid 1 \le i < j \le 100\} \) and weight of the edge \( (v_i, v_j) \) is \( |i - j| \). The weight of minimum spanning tree of \( G \) is ________.

Official answer (numeric): 99 to 99

---

**2019_FN_Q31** · 2019-FN · NAT · 1 mark · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

An array of 25 distinct elements is to be sorted using quicksort. Assume that the pivot element is chosen uniformly at random. The probability that the pivot element gets placed in the worst possible location in the first round of partitioning (rounded off to 2 decimal places) is ________.

Official answer (numeric): 0.08 to 0.08

---

**2019_FN_Q14** · 2019-FN · NAT · 1 mark · Hard · bank topic: Divide-and-Conquer Designs

Consider a sequence of 14 elements: A = [–5, –10, 6, 3, –1, –2, 13, 4, –9, –1, 4, 12, –3, 0]. The subsequence sum \( S(i, j) = \sum_{k=i}^{j} A[k] \). Determine the maximum of \( S(i, j) \), where \( 0 \le i \le j < 14 \). (Divide and conquer approach may be used.)

Official answer (numeric): 29 to 29

---

**2019_FN_Q61** · 2019-FN · MCQ · 2 marks · Hard · bank topic: Searching, Sorting, Hashing Mechanisms

There are \( n \) unsorted arrays: \( A_1, A_2, ...., A_n \). Assume that \( n \) is odd. Each of \( A_1, A_2, ...., A_n \) contains \( n \) distinct elements. There are no common elements between any two arrays. The worst-case time complexity of computing the median of the medians of \( A_1, A_2, ...., A_n \) is

- A) \( \mathcal{O}(n) \)
- B) \( \mathcal{O}(n \log n) \)
- C) \( \mathcal{O}(n^2) \)  ✔ official
- D) \( \Omega(n^2 \log n) \)

---

**2019_FN_Q44** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let G be any connected, weighted, undirected graph:
I. G has a unique minimum spanning tree, if no two edges of G have the same weight.
II. G has a unique minimum spanning tree, if, for every cut of G, there is a unique minimum-weight edge crossing the cut.
Which of the above two statements is/are TRUE?

- A) I only
- B) II only
- C) Both I and II  ✔ official
- D) Neither I nor II

---

**2018_FN_Q40** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths

Let \(G\) be a simple undirected graph. Let \(T_D\) be a depth first search tree of \(G\). Let \(T_B\) be a breadth first search tree of \(G\). Consider the following statements.
(I) No edge of \(G\) is a cross edge with respect to \(T_D\). (A cross edge in \(G\) is between two nodes neither of which is an ancestor of the other in \(T_D\).)
(II) For every edge \((u,v)\) of \(G\), if \(u\) is at depth \(i\) and \(v\) is at depth \(j\) in \(T_B\), then \(|i - j| = 1\).
Which of the statements above must necessarily be true?

- A) I only  ✔ official
- B) II only
- C) Both I and II
- D) Neither I nor II

---

**2018_FN_Q41** · 2018-FN · MCQ · 2 marks · Hard · bank topic: Dynamic Programming Infrastructure

Assume that multiplying a matrix \(G_1\) of dimension \(p \times q\) with another matrix \(G_2\) of dimension \(q \times r\) requires \(pqr\) scalar multiplications. Computing the product of \(n\) matrices \(G_1G_2G_3\dots G_n\) can be done by parenthesizing in different ways. Define \(G_i G_{i+1}\) as an explicitly computed pair for a given paranthesization if they are directly multiplied. For example, in the matrix multiplication chain \(G_1G_2G_3G_4G_5G_6\) using parenthesization \((G_1(G_2G_3))(G_4(G_5G_6))\), \(G_2G_3\) and \(G_5G_6\) are the only explicitly computed pairs.
Consider a matrix multiplication chain \(F_1F_2F_3F_4F_5\), where matrices \(F_1, F_2, F_3, F_4\) and \(F_5\) are of dimensions \(2 \times 25, 25 \times 3, 3 \times 16, 16 \times 1\) and \(1 \times 1000\), respectively. In the parenthesization of \(F_1F_2F_3F_4F_5\) that minimizes the total number of scalar multiplications, the explicitly computed pairs is/are

- A) \(F_1F_2\) and \(F_3F_4\) only
- B) \(F_2F_3\) only
- C) \(F_3F_4\) only  ✔ official
- D) \(F_1F_2\) and \(F_4F_5\) only

---

**2018_FN_Q42** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following C code. Assume that unsigned long int type length is 64 bits.
```c
unsigned long int fun(unsigned long int n){
    unsigned long int i, j = 0, sum = 0;
    for (i = n; i > 1; i = i/2) j++;
    for ( ; j > 1; j = j/2) sum++;
    return(sum);
}
```
The value returned when we call `fun` with the input \(2^{40}\) is

- A) 4
- B) 5  ✔ official
- C) 6
- D) 40

---

**2018_FN_Q55** · 2018-FN · NAT · 2 marks · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following program written in pseudo-code. Assume that x and y are integers.
```c
Count(x,y) {
    if (y != 1){ 
        if (x != 1) {
            print("*");
            Count(x/2, y);
        }
        else {
            y = y-1;
            Count(1024, y);
        }
    }
}
```
The number of times that the print statement is executed by the call Count(1024,1024) is _____.

Official answer (numeric): 10230 to 10230

---

**2018_FN_Q57** · 2018-FN · NAT · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms) · HAS A FIGURE (not shown here)

Consider the following undirected graph G:
[IMAGE_Q_57]
Choose a value for \(x\) that will maximize the number of minimum weight spanning trees (MWSTs) of G. The number of MWSTs of G for this value of \(x\) is ______.

Official answer (numeric): 4 to 4

---

**2018_FN_Q58** · 2018-FN · NAT · 2 marks · Medium · bank topic: Greedy Approach & Divide-and-Conquer Designs

Consider the weights and values of items listed below. Note that there is only one unit of each item.
Item number Weight (in Kgs) Value (in Rupees)
1 10 60
2 7 28
3 4 20
4 2 24
The task is to pick a subset of these items such that their total weight is no more than 11 Kgs and their total value is maximized. Moreover, no item may be split. The total value of items picked by an optimal algorithm is denoted by \(V_{opt}\). A greedy algorithm sorts the items by their value-to-weight ratios in descending order and packs them greedily, starting from the first item in the ordered list. The total value of items picked by the greedy algorithm is denoted by \(V_{greedy}\).
The value of \(V_{opt} - V_{greedy}\) is ____________.

Official answer (numeric): 16 to 16

---

**2017_AN_Q19** · 2017-AN · MCQ · 1 mark · Easy · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Match the algorithms with their time complexities:
List-I (Algorithm)
(P) Towers of Hanoi with n disks
(Q) Binary search given n sorted numbers
(R) Heap sort given n numbers at the worst case
(S) Addition of two \(n \times n\) matrices
List-II (Time complexity)
(i) \(\Theta(n^2)\)
(ii) \(\Theta(n \log n)\)
(iii) \(\Theta(2^n)\)
(iv) \(\Theta(\log n)\)

- A) P - (iii), Q - (iv), R - (i), S - (ii)
- B) P - (iv), Q - (iii), R - (i), S - (ii)
- C) P - (iii), Q - (iv), R - (ii), S - (i)  ✔ official
- D) P - (iv), Q - (iii), R - (ii), S - (i)

---

**2017_FN_Q21** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following functions from positive integers to real numbers:
\(10, \sqrt{n}, n, \log_2 n, \frac{100}{n}\)
The CORRECT arrangement of the above functions in increasing order of asymptotic complexity is:

- A) \(\log_2 n, \frac{100}{n}, 10, \sqrt{n}, n\)
- B) \(\frac{100}{n}, 10, \log_2 n, \sqrt{n}, n\)  ✔ official
- C) \(10, \frac{100}{n}, \sqrt{n}, \log_2 n, n\)
- D) \(\frac{100}{n}, \log_2 n, 10, \sqrt{n}, n\)

---

**2017_FN_Q30** · 2017-FN · MCQ · 1 mark · Easy · bank topic: Greedy Approach & Divide-and-Conquer Designs · HAS A FIGURE (not shown here)

Consider the following table:
[IMAGE_Q_30]
Match the algorithms to the design paradigms they are based on.

- A) (P) \(\leftrightarrow\) (ii), (Q) \(\leftrightarrow\) (iii), (R) \(\leftrightarrow\) (i)
- B) (P) \(\leftrightarrow\) (iii), (Q) \(\leftrightarrow\) (i), (R) \(\leftrightarrow\) (ii)
- C) (P) \(\leftrightarrow\) (ii), (Q) \(\leftrightarrow\) (i), (R) \(\leftrightarrow\) (iii)  ✔ official
- D) (P) \(\leftrightarrow\) (i), (Q) \(\leftrightarrow\) (ii), (R) \(\leftrightarrow\) (iii)

---

**2017_AN_Q13** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Graph Traversals (BFS, DFS) & Single-Source Shortest Paths · HAS A FIGURE (not shown here)

The Breadth First Search (BFS) algorithm has been implemented using the queue data structure. Which one of the following is a possible order of visiting the nodes in the graph below?
[IMAGE_Q_13]

- A) MNOPQR
- B) NQMPOR
- C) QMNROP
- D) POQNMR  ✔ official

---

**2017_FN_Q48** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Minimum Spanning Trees (Prim/Kruskal Algorithms)

Let \(G = (V, E)\) be any connected undirected edge-weighted graph. The weights of the edges in \(E\) are positive and distinct. Consider the following statements:
I. Minimum Spanning Tree of \(G\) is always unique.
II. Shortest path between any two vertices of \(G\) is always unique.
Which of the above statements is/are necessarily true?

- A) I only  ✔ official
- B) II only
- C) Both I and II
- D) Neither I nor II

---

**2017_AN_Q50** · 2017-AN · MCQ · 2 marks · Hard · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the recurrence function
\(T(n) = \begin{cases} 2T(\sqrt{n}) + 1, & n > 2 \\ 2, & 0 < n \leq 2 \end{cases}\)
Then \(T(n)\) in terms of \(\Theta\) notation is

- A) \(\Theta(\log \log n)\)
- B) \(\Theta(\log n)\)  ✔ official
- C) \(\Theta(\sqrt{n})\)
- D) \(\Theta(n)\)

---

**2017_AN_Q61** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Asymptotic Analysis (O, Omega, Theta Complexities)

Consider the following C function.
```c
int fun (int n)
{
    int i, j;
    for (i = 1; i <= n; i++)
    {
        for (j = 1; j < n; j += i)
        {
            printf("%d %d", i, j);
        }
    }
}
```
Time complexity of fun in terms of \(\Theta\) notation is

- A) \(\Theta(n\sqrt{n})\)
- B) \(\Theta(n^2)\)
- C) \(\Theta(n \log n)\)  ✔ official
- D) \(\Theta(n^2 \log n)\)

---

**2017_FN_Q45** · 2017-FN · NAT · 2 marks · Medium · bank topic: Searching, Sorting, Hashing Mechanisms

Let \(A\) be an array of 31 numbers consisting of a sequence of 0's followed by a sequence of 1's. The problem is to find the smallest index \(i\) such that \(A[i]\) is 1 by probing the minimum number of locations in \(A\). The worst case number of probes performed by an optimal algorithm is ________.

Official answer (numeric): 5.0 to 5.0

---

**2017_AN_Q59** · 2017-AN · NAT · 2 marks · Medium · bank topic: Greedy Approach & Divide-and-Conquer Designs · HAS A FIGURE (not shown here)

A message is made up entirely of characters from the set X = \{P, Q, R, S, T\}. The table of probabilities for each of the characters is shown below:
[IMAGE_Q_59]
If a message of 100 characters over X is encoded using Huffman coding, then the expected length of the encoded message in bits is ________.

Official answer (numeric): 225.0 to 225.0

---

