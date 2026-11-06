"""Forge b010 part 4 (designed batch). Run: python scripts/forge/author_b010_p4.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b010")

# 1 CYK table top cell (MCQ, key D)
K.add(1, r"A grammar in Chomsky normal form for a small command language has the rules \(S \to AB \mid BC\), \(A \to BA \mid a\), \(B \to CC \mid b\), \(C \to AB \mid a\). The CYK algorithm is run on the string \(baaba\). The table cell that covers the whole string contains exactly how many non-terminals?",
"""bins = [('S', 'A', 'B'), ('S', 'B', 'C'), ('A', 'B', 'A'), ('B', 'C', 'C'), ('C', 'A', 'B')]
terms = [('A', 'a'), ('B', 'b'), ('C', 'a')]
w = 'baaba'
n = len(w)
T = {}
for i in range(n):
    T[(i, 1)] = set(l for l, t in terms if t == w[i])
for L in range(2, n + 1):
    for i in range(n - L + 1):
        cell = set()
        for k in range(1, L):
            for l, X, Y in bins:
                if X in T[(i, k)] and Y in T[(i + k, L - k)]:
                    cell.add(l)
        T[(i, L)] = cell
top = sorted(T[(0, n)])
val = len(top)
names = ', '.join(top)
wrong = [1, 2, 4]""",
steps=["Length-1 cells: \\(b \\to \\{B\\}\\), each \\(a \\to \\{A, C\\}\\).", "Combine shorter cells for every split point of each substring (\\(O(n^3)\\) work); the cell for all five symbols is built from the splits \\(b \\mid aaba\\), \\(ba \\mid aba\\), \\(baa \\mid ba\\) and \\(baab \\mid a\\).", "Its entry is \\(\\{«names»\\}\\): «val» non-terminals, and since the start symbol \\(S\\) is among them, \\(baaba\\) is in the language."],
trap="Reading the table off by length-1 cells only, or counting rule applications instead of distinct non-terminals in the cell.", short="Fill the table by increasing substring length, trying every split.", kind="trace")

# 4 linear system with a parameter: no-solution cases (MCQ, key C)
K.add(4, r"For an integer \(k\) in the range \(-5 \le k \le 5\), consider the system \(x + y + kz = 1\), \(x + ky + z = 1\), \(kx + y + z = 1\), which models three symmetric balance conditions. For how many of these \(11\) values of \(k\) does the system have no solution at all?",
"""F = fractions.Fraction
def rank(M):
    M = [[F(x) for x in r] for r in M]
    r = 0
    for c in range(len(M[0])):
        p = None
        for i in range(r, len(M)):
            if M[i][c] != 0:
                p = i
                break
        if p is None:
            continue
        M[r], M[p] = M[p], M[r]
        for i in range(len(M)):
            if i != r and M[i][c] != 0:
                f = M[i][c] / M[r][c]
                M[i] = [M[i][j] - f * M[r][j] for j in range(len(M[0]))]
        r += 1
    return r
none = []
many = []
for k in range(-5, 6):
    A = [[1, 1, k], [1, k, 1], [k, 1, 1]]
    Ab = [[1, 1, k, 1], [1, k, 1, 1], [k, 1, 1, 1]]
    ra = rank(A)
    rb = rank(Ab)
    if ra < rb:
        none.append(k)
    elif ra < 3:
        many.append(k)
val = len(none)
nlist = ', '.join(str(k) for k in none)
mlist = ', '.join(str(k) for k in many)
wrong = [0, 2, 3]""",
steps=["The coefficient determinant is \\((k - 1)^2 (k + 2)\\), so the system is singular only for \\(k = 1\\) and \\(k = -2\\); for every other value the solution is unique.", "At each singular value compare the rank of the coefficient matrix with the rank of the augmented matrix: a larger augmented rank means no solution, equal ranks below \\(3\\) mean infinitely many.", "Over \\(-5 \\le k \\le 5\\) the inconsistent values are \\(k \\in \\{«nlist»\\}\\) (and the dependent but consistent values are «mlist»), so «val» values give no solution."],
trap="Treating every singular matrix as having no solution; consistency depends on the right-hand side.", short="Singular coefficient matrix, then compare ranks of A and [A | b].", kind="multi_concept")

# 9 coupon collector (MCQ, key D)
K.add(9, r"A breakfast cereal puts exactly one of \(6\) different collectible cards in each box, and every card is equally likely in every box, independently of the others. A fan keeps buying boxes until every one of the \(6\) cards has been collected. The expected number of boxes bought, correct to one decimal place, is",
"""val = round(6 * sum(1 / i for i in range(1, 7)), 1)
wrong = [12.0, 9.8, 21.0]
h6 = round(sum(1 / i for i in range(1, 7)), 3)""",
steps=["After \\(i\\) different cards have been collected, a new card appears with probability \\((6 - i)/6\\), so the number of boxes until the next new card is geometric with mean \\(6/(6 - i)\\).", "By linearity the expected total is \\(6\\left(\\tfrac16 + \\tfrac15 + \\tfrac14 + \\tfrac13 + \\tfrac12 + 1\\right) = 6 H_6 = 6 \\times «h6» = «val»\\)."],
trap="Using the mean of the last stage only (6) or the expected number for a fixed number of boxes instead of summing the six geometric waiting times.", short="Sum of 6/(6 - i) for i = 0..5, that is 6 times the sixth harmonic number.", kind="multi_concept")

# 16 edges common to every minimum spanning tree (NAT)
K.add(16, r"A utility plans cables between seven sites numbered \(0\) to \(6\). The possible cables and their costs are \(0\text{-}1: 2\), \(0\text{-}2: 2\), \(1\text{-}2: 2\), \(2\text{-}3: 3\), \(3\text{-}4: 3\), \(3\text{-}5: 1\), \(4\text{-}5: 3\), \(5\text{-}6: 4\) and \(4\text{-}6: 4\). Several different cheapest ways to connect all the sites exist. The number of cables that are used in every one of these cheapest connections (every minimum spanning tree) is ______.",
"""E = [(0, 1, 2), (0, 2, 2), (1, 2, 2), (2, 3, 3), (3, 4, 3), (3, 5, 1), (4, 5, 3), (5, 6, 4), (4, 6, 4)]
def tree(sub):
    par = list(range(7))
    def f(x):
        while par[x] != x:
            x = par[x]
        return x
    for a, b, w in sub:
        ra = f(a)
        rb = f(b)
        if ra == rb:
            return False
        par[ra] = rb
    return True
best = None
msts = []
for sub in itertools.combinations(E, 6):
    if tree(sub):
        w = sum(e[2] for e in sub)
        if best is None or w < best:
            best = w
            msts = [sub]
        elif w == best:
            msts.append(sub)
common = set(msts[0])
for m in msts[1:]:
    common &= set(m)
answer = len(common)
nm = len(msts)
cost = best""",
steps=["The minimum total cost is «cost». Ties (the three cost-2 edges of the triangle \\(0, 1, 2\\), and the cost-3 edges around \\(3, 4, 5\\) together with the cost-4 pair at vertex \\(6\\)) create several equal-cost trees: «nm» in all.", "An edge is in every minimum spanning tree only if no tie can replace it. Intersecting all «nm» trees leaves «answer» edges."],
trap="Counting the edges of one MST (6) instead of the edges that no tie can exchange.", short="An edge is forced when it is the unique cheapest edge across some cut.", kind="multi_concept")

# 18 task-order lattice on the divisors of 72 (MSQ)
K.add(18, r"In a build system the tasks are labelled by the positive divisors of \(72\), and task \(a\) must finish before task \(b\) whenever \(a\) divides \(b\). Treat this order as a partial order whose meet is the gcd and whose join is the lcm. Which of the following statements is/are TRUE?",
"""N = 72
D = [d for d in range(1, N + 1) if N % d == 0]
def meet(a, b):
    return math.gcd(a, b)
def join(a, b):
    return a * b // math.gcd(a, b)
dist = all(meet(x, join(y, z)) == join(meet(x, y), meet(x, z)) for x in D for y in D for z in D)
comp = all(any(meet(x, y) == 1 and join(x, y) == N for y in D) for x in D)
def covers(e, d):
    return d % e == 0 and e < d and not any(e < m < d and m % e == 0 and d % m == 0 for m in D)
paths = {1: 1}
for d in D:
    if d != 1:
        paths[d] = sum(paths[e] for e in D if covers(e, d))
chains = paths[N]
atoms = sum(1 for d in D if covers(1, d))
truth = [dist, comp, chains == 10, atoms == 2]
nd = len(D)""",
stmts=[r"The lattice of tasks is distributive.", r"The lattice of tasks is complemented.", r"There are exactly \(10\) maximal chains from task \(1\) to task \(72\).", r"Exactly \(2\) tasks cover task \(1\) (the atoms of the lattice)."],
steps=[r"\(72 = 2^3 \cdot 3^2\), so the order is the product of a chain of \(4\) elements and a chain of \(3\): «nd» tasks, meet gcd, join lcm. Divisor lattices are always distributive.", r"A complement of \(2\) would need gcd \(1\) and lcm \(72\), impossible because the \(2\)-part of such an lcm would stay \(2\); the lattice is complemented only for square-free numbers, so it is not complemented.", r"A maximal chain raises one prime exponent at a time: \(3\) steps in \(2\) and \(2\) in \(3\), \(\binom{5}{2} = «chains»\) orders; the elements covering \(1\) are \(2\) and \(3\), so there are «atoms» atoms."],
trap="Assuming every divisor lattice is complemented; that needs a square-free number.", short="Divisor lattices are distributive; complemented only for square-free n; chains = multinomial of exponents.", kind="msq_discriminator")

# 22 serial asymmetric relations on three elements (MCQ, key D)
K.add(22, r"An interpretation of a binary predicate \(R\) over the three-element domain \(\{1, 2, 3\}\) is just a subset of \(\{1,2,3\} \times \{1,2,3\}\). The number of interpretations that make both \(\forall x\, \exists y\, R(x, y)\) and \(\forall x\, \forall y\, (R(x, y) \rightarrow \neg R(y, x))\) true is",
"""pairs = [(a, b) for a in range(3) for b in range(3)]
cnt = 0
for mask in range(512):
    R = set(pairs[i] for i in range(9) if (mask >> i) & 1)
    serial = all(any((x, y) in R for y in range(3)) for x in range(3))
    asym = all(not ((x, y) in R and (y, x) in R) for x in range(3) for y in range(3))
    if serial and asym:
        cnt += 1
val = cnt
wrong = [343, 512, 27]
serial_only = 343""",
steps=["The second sentence says \\(R\\) is asymmetric: no pair \\((x, x)\\) and never both \\((x, y)\\) and \\((y, x)\\). So each of the \\(3\\) unordered pairs \\(\\{x, y\\}\\) has \\(3\\) states (none, \\(x \\to y\\), \\(y \\to x\\)): \\(27\\) asymmetric relations.", "An asymmetric relation on \\(3\\) elements has at most \\(3\\) pairs (one per unordered pair). The first sentence needs every element to have an outgoing pair, which forces exactly \\(3\\) pairs with exactly one outgoing pair per element: a function with no fixed point and no \\(2\\)-cycle, that is, one of the two \\(3\\)-cycles. So there are «val» interpretations."],
trap="Counting serial relations alone (343) or asymmetric relations alone (27).", short="Count asymmetric relations (3 states per pair) that also leave no vertex without an outgoing pair.", kind="multi_concept")

# 37 Petersen graph properties (MSQ)
K.add(37, r"The Petersen graph has \(10\) vertices: an outer \(5\)-cycle, an inner five-pointed star (vertex \(i\) joined to vertex \(i + 2\) modulo \(5\) on the inner ring) and five spokes joining each outer vertex to its inner partner; every vertex has degree \(3\). Which of the following statements is/are TRUE?",
"""E = set()
for i in range(5):
    E.add((i, (i + 1) % 5))
    E.add((i, i + 5))
    E.add((5 + i, 5 + (i + 2) % 5))
adj = {v: set() for v in range(10)}
for a, b in E:
    adj[a].add(b)
    adj[b].add(a)
def colourable(k):
    col = [-1] * 10
    def go(v):
        if v == 10:
            return True
        for c in range(k):
            if all(col[u] != c for u in adj[v] if u < v):
                col[v] = c
                if go(v + 1):
                    return True
        col[v] = -1
        return False
    return go(0)
chi = 1
while not colourable(chi):
    chi += 1
def perfect(rem):
    if not rem:
        return True
    v = min(rem)
    for u in adj[v]:
        if u in rem:
            if perfect(rem - set([v, u])):
                return True
    return False
pm = perfect(set(range(10)))
alpha = 0
for mask in range(1024):
    s = [v for v in range(10) if (mask >> v) & 1]
    if all(b not in adj[a] for a in s for b in s):
        alpha = max(alpha, len(s))
def ham():
    path = [0]
    used = [False] * 10
    used[0] = True
    def go():
        if len(path) == 10:
            return 0 in adj[path[-1]]
        for u in adj[path[-1]]:
            if not used[u]:
                used[u] = True
                path.append(u)
                if go():
                    return True
                path.pop()
                used[u] = False
        return False
    return go()
hc = ham()
truth = [chi == 3, pm, alpha == 4, hc]""",
stmts=[r"The chromatic number of the Petersen graph is \(3\).", r"The Petersen graph has a perfect matching.", r"The largest set of pairwise non-adjacent vertices of the Petersen graph has exactly \(4\) vertices.", r"The Petersen graph has a Hamiltonian cycle."],
steps=["It contains \\(5\\)-cycles, so it is not bipartite (\\(\\chi \\ge 3\\)); a proper \\(3\\)-colouring exists, so \\(\\chi = «chi»\\).", "A cubic graph without bridges has a perfect matching (Petersen's theorem), and the Petersen graph has \\(6\\) of them.", "Its independence number is \\(«alpha»\\) (every independent set of size \\(5\\) would force an edge to a neighbour covered twice).", "Famously the Petersen graph has no Hamiltonian cycle (a search over all vertex orders confirms it), although it has a Hamiltonian path."],
trap="Assuming a regular, highly symmetric graph must be Hamiltonian.", short="Check colouring, matching, independence and Hamiltonicity one by one; the Petersen graph is the classic exception for Hamiltonicity.", kind="msq_discriminator")

# 39 NOT IN with NULL versus NOT EXISTS (MCQ, key B)
K.add(39, r"The table \(\text{Staff}(\text{id}, \text{boss})\) holds the rows \((1, \text{NULL}), (2, 1), (3, 1), (4, 2), (5, \text{NULL})\). Query \(Q_1\) is SELECT id FROM Staff WHERE id NOT IN (SELECT boss FROM Staff). Query \(Q_2\) is SELECT s.id FROM Staff s WHERE NOT EXISTS (SELECT 1 FROM Staff t WHERE t.boss = s.id). The number of rows returned by \(Q_2\) minus the number of rows returned by \(Q_1\) is",
"""rows = [(1, None), (2, 1), (3, 1), (4, 2), (5, None)]
bosses = [b for i, b in rows]
def not_in(x):
    res = True
    for b in bosses:
        if b is None:
            r = None
        else:
            r = (x != b)
        if r is False:
            return False
        if r is None:
            res = None
    return res
q1 = sum(1 for i, b in rows if not_in(i) is True)
q2 = sum(1 for i, b in rows if not any(t == i for t in bosses if t is not None))
val = q2 - q1
wrong = [0, 2, 5]""",
steps=["The subquery of \\(Q_1\\) returns \\(\\{\\text{NULL}, 1, 1, 2, \\text{NULL}\\}\\). \\(x \\text{ NOT IN } (\\dots, \\text{NULL})\\) is \\(\\text{false}\\) when \\(x\\) matches a value and \\(\\text{unknown}\\) otherwise, never true, so \\(Q_1\\) returns \\(«q1»\\) rows.", "\\(Q_2\\) compares only with real values: the ids that nobody has as a boss are \\(3, 4, 5\\), so it returns \\(«q2»\\) rows.", "Difference \\(= «q2» - «q1» = «val»\\)."],
trap="Expecting NOT IN to behave like NOT EXISTS: a single NULL in the subquery makes NOT IN return no rows.", short="Three-valued logic: x NOT IN (..., NULL) can never be true.", kind="trap_aware")

# 48 LL(1) conflicts in a grammar with epsilon rules (MCQ, key C)
K.add(48, r"A grammar for a data-record format has start symbol \(S\) and the productions \(S \to A\,B\,c\), \(A \to a\,A \mid \varepsilon\), \(B \to a\,B \mid b \mid \varepsilon\). When the LL(1) predictive parsing table is built, the number of table cells that contain more than one production is",
"""G = [('S', ['A', 'B', 'c']), ('A', ['a', 'A']), ('A', []), ('B', ['a', 'B']), ('B', ['b']), ('B', [])]
NT = ['S', 'A', 'B']
nullable = set()
ch = True
while ch:
    ch = False
    for l, r in G:
        if l not in nullable and all(x in nullable for x in r):
            nullable.add(l)
            ch = True
first = {n: set() for n in NT}
ch = True
while ch:
    ch = False
    for l, r in G:
        for x in r:
            add = first[x] if x in NT else set([x])
            if not add <= first[l]:
                first[l] |= add
                ch = True
            if not (x in nullable):
                break
def fseq(seq):
    out = set()
    for x in seq:
        out |= first[x] if x in NT else set([x])
        if not (x in nullable):
            return out, False
    return out, True
follow = {n: set() for n in NT}
follow['S'].add('$')
ch = True
while ch:
    ch = False
    for l, r in G:
        for k, x in enumerate(r):
            if x in NT:
                f, nl = fseq(r[k + 1:])
                add = set(f)
                if nl:
                    add |= follow[l]
                if not add <= follow[x]:
                    follow[x] |= add
                    ch = True
table = {}
for p, (l, r) in enumerate(G):
    f, nl = fseq(r)
    cells = set(f)
    if nl:
        cells |= follow[l]
    for t in cells:
        table.setdefault((l, t), []).append(p)
val = sum(1 for v in table.values() if len(v) > 1)
fa = ', '.join(sorted(follow['A']))
wrong = [0, 2, 3]""",
steps=["\\(\\text{FIRST}(A) = \\{a, \\varepsilon\\}\\), \\(\\text{FIRST}(B) = \\{a, b, \\varepsilon\\}\\); since \\(A\\) and \\(B\\) can vanish, \\(\\text{FOLLOW}(A) = \\{«fa»\\}\\) (the first symbols of \\(B\\,c\\)) and \\(\\text{FOLLOW}(B) = \\{c\\}\\).", "For \\(A\\): the rule \\(A \\to aA\\) is entered under \\(a\\), and \\(A \\to \\varepsilon\\) is entered under every symbol of \\(\\text{FOLLOW}(A)\\), which includes \\(a\\): cell \\([A, a]\\) holds two productions.", "For \\(B\\): \\(aB\\) under \\(a\\), \\(b\\) under \\(b\\), \\(\\varepsilon\\) under \\(c\\): no clash. Cells with more than one production: «val»."],
trap="Ignoring that an epsilon production is entered under FOLLOW, which can overlap FIRST of a sibling alternative.", short="Check each nullable non-terminal: FIRST of its other alternatives against its FOLLOW.", kind="trace")

K.save("p4")
