"""Forge b011 part 2 (X-tier challenge batch, slots 10 to 19). Run: python scripts/forge/author_b011_p2.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b011")

# 10 expected absorption time of a Markov chain via a linear system (NAT)
K.add(10, r"A job moves between three processing stages \(1, 2, 3\) and finishes (is absorbed) at some step. In each step: from stage \(1\) it stays with probability \(0.6\), goes to stage \(2\) with probability \(0.3\) and finishes with probability \(0.1\); from stage \(2\) it goes to stage \(1\), stays, or goes to stage \(3\) with probabilities \(0.3, 0.4, 0.3\); from stage \(3\) it goes to stage \(2\) with probability \(0.4\), stays with probability \(0.1\) and finishes with probability \(0.5\). A job starts in stage \(1\). The expected number of steps until it finishes, correct to two decimal places, is ______.",
"""F = fractions.Fraction
Q = [[F('0.6'), F('0.3'), F(0)], [F('0.3'), F('0.4'), F('0.3')], [F(0), F('0.4'), F('0.1')]]
A = [[(1 if i == j else 0) - Q[i][j] for j in range(3)] + [F(1)] for i in range(3)]
for c in range(3):
    p = next(r for r in range(c, 3) if A[r][c] != 0)
    A[c], A[p] = A[p], A[c]
    A[c] = [x / A[c][c] for x in A[c]]
    for r in range(3):
        if r != c:
            f = A[r][c]
            A[r] = [A[r][k] - f * A[c][k] for k in range(4)]
h = [A[i][3] for i in range(3)]
answer = round(float(h[0]), 2)
h2 = round(float(h[1]), 2)
h3 = round(float(h[2]), 2)""",
steps=["Let \\(h_i\\) be the expected number of steps to finish from stage \\(i\\). Conditioning on the first step: \\(h_1 = 1 + 0.6h_1 + 0.3h_2\\), \\(h_2 = 1 + 0.3h_1 + 0.4h_2 + 0.3h_3\\), \\(h_3 = 1 + 0.4h_2 + 0.1h_3\\).", "In matrix form \\((I - Q)h = \\mathbf 1\\) where \\(Q\\) holds the transitions among stages; solving the \\(3 \\times 3\\) system gives \\(h_2 \\approx «h2»\\), \\(h_3 \\approx «h3»\\) and \\(h_1 \\approx «answer»\\)."],
trap="Using the finishing probability of stage 1 alone (1/0.1 = 10 steps) or averaging the three stages' finishing probabilities.", short="Solve (I - Q)h = 1 for the expected absorption times.", kind="multi_concept")

# 11 labelled trees with prescribed degrees (NAT)
K.add(11, r"A network planner wants to connect \(8\) labelled sites \(1, \dots, 8\) with a tree (any labelled tree on the \(8\) sites). Site \(1\) must have exactly \(4\) neighbours and site \(2\) exactly \(3\) neighbours. The number of such labelled trees is ______.",
"""cnt = 0
for seq in itertools.product(range(1, 9), repeat=6):
    if seq.count(1) == 3 and seq.count(2) == 2:
        cnt += 1
answer = cnt
formula = math.factorial(6) // (math.factorial(3) * math.factorial(2) * math.factorial(1)) * 6""",
steps=["Labelled trees on \\(8\\) vertices correspond one-to-one with Prufer sequences of length \\(6\\); in the sequence a vertex appears exactly \\(\\deg - 1\\) times.", "Site \\(1\\) (degree \\(4\\)) appears \\(3\\) times and site \\(2\\) (degree \\(3\\)) appears \\(2\\) times; the sixth position holds one of the other \\(6\\) labels: \\(\\frac{6!}{3!\\,2!\\,1!} \\times 6 = «formula»\\) sequences.", "Counting the sequences directly gives «answer» trees."],
trap="Counting spanning trees of a specific graph, or placing the free sixth label in the formula as a seventh class without the factor 6.", short="Prufer sequences: degree minus one occurrences, then a multinomial.", kind="multi_concept")

# 12 distance-vector count to infinity (NAT)
K.add(12, r"Routers \(A\), \(B\), \(C\) form a chain with link costs \(A\text{-}B = 1\) and \(B\text{-}C = 2\). Distance-vector routing (no split horizon, no hold-down) has converged: \(B\) reaches \(A\) at cost \(1\) and \(C\) reaches \(A\) at cost \(3\) through \(B\). Then the link \(A\text{-}B\) fails. From then on \(B\) first recomputes its cost to \(A\) using \(C\)'s last advertised cost, then \(C\) recomputes using \(B\)'s new cost, then \(B\) again, alternately, one update at a time. Infinity is taken as \(16\). The number of updates until a router's cost to \(A\) first reaches \(16\) or more is ______.",
"""cost_bc = 2
b = 1
c = 3
updates = 0
turn = 'B'
while b < 16 and c < 16:
    if turn == 'B':
        b = cost_bc + c
        turn = 'C'
    else:
        c = cost_bc + b
        turn = 'B'
    updates += 1
answer = updates
last = max(b, c)""",
steps=["After the failure \\(B\\) has no direct route and believes \\(C\\)'s stale route: \\(B = 2 + 3 = 5\\); then \\(C = 2 + 5 = 7\\); then \\(B = 9\\), \\(C = 11\\), \\(B = 13\\), \\(C = 15\\), \\(B = 17\\).", "Each update raises the advertised cost by \\(2 \\times 2 = 4\\) over two updates; the first value that reaches \\(16\\) or more is «last» after «answer» updates."],
trap="Stopping at 16 exactly (the sequence jumps over it by steps of 2) or forgetting that the first update uses C's stale value.", short="Simulate the alternating updates: each router adds the link cost to its neighbour's last advertisement.", kind="trace")

# 13 number of AVL tree shapes (NAT)
K.add(13, r"Two AVL trees have the same shape if they are identical as unlabelled binary trees (the left and right subtrees of every node are compared in order). An AVL tree is a binary search tree in which, for every node, the heights of its two subtrees differ by at most \(1\). The number of different AVL tree shapes with exactly \(12\) nodes is ______.",
"""cnt = {}
def f(n, h):
    if (n, h) in cnt:
        return cnt[(n, h)]
    if n == 0:
        r = 1 if h == -1 else 0
    elif h < 0:
        r = 0
    else:
        r = 0
        for l in range(n):
            rr = n - 1 - l
            r += f(l, h - 1) * f(rr, h - 1) + f(l, h - 1) * f(rr, h - 2) + f(l, h - 2) * f(rr, h - 1)
    cnt[(n, h)] = r
    return r
answer = sum(f(12, h) for h in range(-1, 12))
hh = [h for h in range(-1, 12) if f(12, h) > 0]
hs = ', '.join(str(h) for h in hh)""",
steps=["Let \\(f(n, h)\\) be the number of AVL shapes with \\(n\\) nodes and height \\(h\\) (\\(f(0, -1) = 1\\)). The root has subtrees of \\(l\\) and \\(n - 1 - l\\) nodes whose heights are \\((h - 1, h - 1)\\), \\((h - 1, h - 2)\\) or \\((h - 2, h - 1)\\).", "A \\(12\\)-node AVL tree can have height «hs» only, and summing \\(f(12, h)\\) over those heights counts every shape: «answer»."],
trap="Counting only complete trees or the number of BSTs (Catalan number 208012), which ignores the balance condition.", short="Dynamic programming over (nodes, height) with the three allowed height combinations.", kind="multi_concept")

# 14 CRC undetected error probability (MCQ, key C)
K.add(14, r"A \(7\)-bit codeword (\(4\) data bits and a \(3\)-bit CRC) uses the generator polynomial \(G(x) = x^{3} + x + 1\). A burst of noise flips each of the \(7\) bits according to an error pattern that is uniformly random over the \(127\) non-zero patterns. The probability that the error is NOT detected by the CRC, correct to three decimal places, is",
"""g = 0b1011
def mod(v):
    for i in range(6, 2, -1):
        if (v >> i) & 1:
            v ^= g << (i - 3)
    return v
und = sum(1 for e in range(1, 128) if mod(e) == 0)
val = round(und / 127, 3)
wrong = [0.125, 0.063, 0.25]""",
steps=["An error pattern is missed exactly when its polynomial is divisible by \\(G(x)\\), that is, when it is itself a non-zero codeword.", "The code has \\(2^4 = 16\\) codewords, so \\(15\\) non-zero error patterns are undetectable (a division of all \\(127\\) patterns by \\(G\\) confirms «und»).", "Probability \\(= «und»/127 \\approx «val»\\), slightly below the \\(1/8\\) a random-looking check would give."],
trap="Using 2^-3 = 0.125 (a random check of 3 bits), which counts the zero error pattern's share and ignores that there are 127 non-zero patterns.", short="Undetected errors = non-zero codewords: (2^k - 1) of the (2^n - 1) non-zero patterns.", kind="multi_concept")

# 15 count of safe sequences in the banker's algorithm (NAT)
K.add(15, r"A system has \(5\) processes and \(3\) resource types with the allocation, maximum-demand and currently available vectors \(\text{Alloc}: P_0 = (0,1,0), P_1 = (2,0,0), P_2 = (3,0,2), P_3 = (2,1,1), P_4 = (0,0,2)\); \(\text{Max}: P_0 = (7,5,3), P_1 = (3,2,2), P_2 = (9,0,2), P_3 = (2,2,2), P_4 = (4,3,3)\); \(\text{Available} = (3,3,2)\). A safe sequence is an order of all five processes in which each can finish with the resources available at its turn (finished processes release everything they hold). The number of different safe sequences is ______.",
"""alloc = [(0, 1, 0), (2, 0, 0), (3, 0, 2), (2, 1, 1), (0, 0, 2)]
mx = [(7, 5, 3), (3, 2, 2), (9, 0, 2), (2, 2, 2), (4, 3, 3)]
avail = (3, 3, 2)
need = [tuple(mx[i][k] - alloc[i][k] for k in range(3)) for i in range(5)]
cnt = 0
for perm in itertools.permutations(range(5)):
    w = list(avail)
    ok = True
    for p in perm:
        if all(need[p][k] <= w[k] for k in range(3)):
            w = [w[k] + alloc[p][k] for k in range(3)]
        else:
            ok = False
            break
    if ok:
        cnt += 1
answer = cnt""",
steps=["Need \\(= \\text{Max} - \\text{Alloc}\\): \\(P_0 = (7,4,3),\\ P_1 = (1,2,2),\\ P_2 = (6,0,0),\\ P_3 = (0,1,1),\\ P_4 = (4,3,1)\\).", "A sequence is safe when every process finds its remaining need within the resources available at its turn (those plus everything released earlier). Checking all \\(5! = 120\\) orders gives «answer» safe sequences.", "A single safe sequence only proves the state is safe; the number of safe sequences measures how much scheduling freedom remains."],
trap="Stopping at the first safe sequence found, or testing demand (Max) instead of remaining need.", short="Compute Need, then count the permutations where each step is satisfiable.", kind="multi_concept")

# 16 number of shortest paths (NAT)
K.add(16, r"A delivery network has junctions \(S, A, B, C, D, E, T\) and two-way roads with lengths \(S\text{-}A: 2\), \(S\text{-}B: 2\), \(A\text{-}C: 3\), \(B\text{-}C: 3\), \(A\text{-}D: 5\), \(B\text{-}E: 5\), \(C\text{-}D: 2\), \(C\text{-}E: 2\), \(D\text{-}T: 3\), \(E\text{-}T: 3\), \(C\text{-}T: 5\). The number of different shortest routes from \(S\) to \(T\) (different sequences of junctions with the minimum total length) is ______.",
"""E = [('S', 'A', 2), ('S', 'B', 2), ('A', 'C', 3), ('B', 'C', 3), ('A', 'D', 5), ('B', 'E', 5), ('C', 'D', 2), ('C', 'E', 2), ('D', 'T', 3), ('E', 'T', 3), ('C', 'T', 5)]
adj = {}
for a, b, w in E:
    adj.setdefault(a, []).append((b, w))
    adj.setdefault(b, []).append((a, w))
INF = 10 ** 9
dist = {v: INF for v in adj}
dist['S'] = 0
done = set()
while len(done) < len(adj):
    u = min((v for v in adj if v not in done), key=lambda v: dist[v])
    done.add(u)
    for v, w in adj[u]:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
ways = {v: 0 for v in adj}
ways['S'] = 1
for u in sorted(adj, key=lambda v: dist[v]):
    for v, w in adj[u]:
        if dist[u] + w == dist[v] and u != v:
            ways[v] += ways[u]
answer = ways['T']
d = dist['T']""",
steps=["Dijkstra gives the shortest distance \\(d(S, T) = «d»\\).", "Count shortest routes by dynamic programming in order of distance: a junction's count is the sum of the counts of its neighbours \\(u\\) with \\(d(u) + w(u, v) = d(v)\\).", "The count at \\(T\\) is «answer»."],
trap="Counting all routes of any length, or stopping at the first shortest path found.", short="Dijkstra for distances, then add the path counts along tight edges.", kind="multi_concept")

# 17 serializable interleavings of two transactions (NAT)
K.add(17, r"Transactions \(T_1\) and \(T_2\) each execute the same four operations in the same order: read \(A\), write \(A\), read \(B\), write \(B\). An interleaving merges the two sequences of four operations into one schedule of eight operations (the order inside each transaction is kept). Among all the possible interleavings, the number that are conflict serializable is ______.",
"""ops = ['RA', 'WA', 'RB', 'WB']
total = 0
good = 0
for pos in itertools.combinations(range(8), 4):
    t1 = list(pos)
    seq = []
    i1 = 0
    i2 = 0
    for k in range(8):
        if k in t1:
            seq.append((1, ops[i1]))
            i1 += 1
        else:
            seq.append((2, ops[i2]))
            i2 += 1
    edges = set()
    for x in range(8):
        for y in range(x + 1, 8):
            a = seq[x]
            b = seq[y]
            if a[0] != b[0] and a[1][1] == b[1][1] and 'W' in (a[1][0], b[1][0]):
                edges.add((a[0], b[0]))
    total += 1
    if not ((1, 2) in edges and (2, 1) in edges):
        good += 1
answer = good""",
steps=["There are \\(\\binom{8}{4} = 70\\) interleavings. Two operations conflict when they touch the same item and at least one is a write.", "The schedule is conflict serializable exactly when the precedence graph has no cycle, that is, when the conflicts do not force both \\(T_1 \\to T_2\\) and \\(T_2 \\to T_1\\).", "Checking every interleaving leaves «answer» serializable ones (the serial schedules and those where all conflicts on \\(A\\) and on \\(B\\) point the same way)."],
trap="Counting only the 2 serial schedules, or treating any interleaving as serializable because the operations are identical.", short="Enumerate the 70 interleavings and test the precedence graph for a cycle.", kind="trace")

# 18 affine Boolean functions (NAT)
K.add(18, r"A circuit designer examines every possible truth table with three input wires and one output wire. She calls a truth table \(f\) affine when, for every choice of three input vectors \(x, y, z \in \{0, 1\}^3\), the four outputs \(f(x), f(y), f(z)\) and \(f(x \oplus y \oplus z)\) combine by exclusive-or to \(0\) (the \(\oplus\) inside \(f\) acts bit by bit on the vectors). The number of affine truth tables among all \(256\) is ______.",
"""pts = list(range(8))
cnt = 0
for table in range(256):
    f = [(table >> x) & 1 for x in pts]
    if all((f[x] ^ f[y] ^ f[z] ^ f[x ^ y ^ z]) == 0 for x in pts for y in pts for z in pts):
        cnt += 1
answer = cnt""",
steps=["The condition says that \\(g(x) = f(x) \\oplus f(0)\\) is linear over \\(\\mathrm{GF}(2)\\): such functions are \\(a_1x_1 \\oplus a_2x_2 \\oplus a_3x_3\\), possibly complemented.", "That gives \\(2^3\\) choices of the coefficients and \\(2\\) choices for the constant: \\(16\\) functions; testing all \\(256\\) truth tables confirms «answer»."],
trap="Counting only linear functions without the constant term (8), or all monotone functions.", short="Affine = linear function over GF(2) plus a constant: 2^(n+1) functions.", kind="multi_concept")

# 19 joint distribution statements (MSQ)
K.add(19, r"The random variables \(X \in \{0, 1, 2\}\) and \(Y \in \{0, 1\}\) have the joint probabilities \(P(0,0) = 0.10\), \(P(1,0) = 0.20\), \(P(2,0) = 0.10\), \(P(0,1) = 0.05\), \(P(1,1) = 0.25\), \(P(2,1) = 0.30\). Which of the following statements is/are TRUE?",
"""P = {(0, 0): 0.10, (1, 0): 0.20, (2, 0): 0.10, (0, 1): 0.05, (1, 1): 0.25, (2, 1): 0.30}
EX = sum(x * p for (x, y), p in P.items())
EY = sum(y * p for (x, y), p in P.items())
EXY = sum(x * y * p for (x, y), p in P.items())
cov = EXY - EX * EY
py = {0: sum(p for (x, y), p in P.items() if y == 0), 1: sum(p for (x, y), p in P.items() if y == 1)}
ex0 = sum(x * p for (x, y), p in P.items() if y == 0) / py[0]
ex1 = sum(x * p for (x, y), p in P.items() if y == 1) / py[1]
varx = sum((x - EX) ** 2 * p for (x, y), p in P.items())
px = {x: sum(p for (a, b), p in P.items() if a == x) for x in range(3)}
indep = all(abs(P[(x, y)] - px[x] * py[y]) < 1e-12 for x in range(3) for y in range(2))
even = sum(p for (x, y), p in P.items() if (x + y) % 2 == 0)
truth = [indep, cov > 0, ex1 > ex0, even > 0.5]
cv = round(cov, 3)
e0 = round(ex0, 3)
e1 = round(ex1, 3)
ev = round(even, 2)""",
stmts=[r"\(X\) and \(Y\) are independent.", r"\(\operatorname{Cov}(X, Y) > 0\).", r"\(E[X \mid Y = 1] > E[X \mid Y = 0]\).", r"\(P(X + Y \text{ is even}) > 0.5\)."],
steps=["Independence would need \\(P(x, y) = P(x)P(y)\\) in every cell; for example \\(P(0,0) = 0.10\\) but \\(P(X = 0)P(Y = 0) = 0.15 \\times 0.40 = 0.06\\), so the variables are dependent.", "\\(E[X] = 1.25\\), \\(E[Y] = 0.6\\) and \\(E[XY] = 0.25 + 0.60 = 0.85\\), so \\(\\operatorname{Cov} = «cv» > 0\\); consistently \\(E[X \\mid Y = 1] = «e1»\\) exceeds \\(E[X \\mid Y = 0] = «e0»\\).", "\\(P(X + Y \\text{ even}) = P(0,0) + P(2,0) + P(1,1) = «ev»\\), which is not above \\(0.5\\)."],
trap="Reading a positive covariance as independence, or confusing E[X | Y] with E[X].", short="Compare each cell with the product of marginals, then compute covariance and conditional means.", kind="msq_discriminator")

K.save("p2")
