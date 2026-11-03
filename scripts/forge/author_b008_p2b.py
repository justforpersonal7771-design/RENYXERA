"""Forge b008 replacements for slots 13, 15, 26, 29, 31, 32 (the first versions overlapped with questions already in the set).
Run: python scripts/forge/author_b008_p2b.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
from forge_snippets import FF, CUBES
K.use("b008")

# 13 SLR(1) conflicts (MCQ 2, key B)
K.add(13, r"Consider the grammar \(S' \to S\), \(S \to L = R \mid R\), \(L \to *R \mid \text{id}\), \(R \to L\). The number of states of its LR(0) automaton that contain a shift-reduce conflict when SLR(1) lookaheads (FOLLOW sets) are used is",
FF + """G0 = {'S': [('L', '=', 'R'), ('R',)], 'L': [('*', 'R'), ('id',)], 'R': [('L',)]}
first, follow, nullable = first_follow(G0, 'S')
P = [("S'", ('S',))] + [(a, r) for a in G0 for r in G0[a]]
NT = set(["S'", 'S', 'L', 'R'])
def closure(items):
    items = set(items)
    ch = True
    while ch:
        ch = False
        for (l, r, d) in list(items):
            if d < len(r) and r[d] in NT:
                for (l2, r2) in P:
                    if l2 == r[d] and (l2, r2, 0) not in items:
                        items.add((l2, r2, 0))
                        ch = True
    return tuple(sorted(items))
start = closure(set([("S'", ('S',), 0)]))
seen = [start]
i = 0
while i < len(seen):
    st = seen[i]
    for X in ['S', 'L', 'R', '=', '*', 'id']:
        nxt = set((l, r, d + 1) for (l, r, d) in st if d < len(r) and r[d] == X)
        if nxt:
            c = closure(nxt)
            if c not in seen:
                seen.append(c)
    i += 1
val = 0
for st in seen:
    shifts = set(r[d] for (l, r, d) in st if d < len(r) and r[d] not in NT)
    conflict = False
    for (l, r, d) in st:
        if d == len(r) and l != "S'":
            if follow[l] & shifts:
                conflict = True
    if conflict:
        val += 1
ns = len(seen)
wrong = [0, 2, 3]""",
steps=["The LR(0) automaton has «ns» states. The state containing \\(S \\to L \\cdot = R\\) and \\(R \\to L \\cdot\\) can shift \\(=\\) or reduce by \\(R \\to L\\).", "\\(\\text{FOLLOW}(L)\\) contains \\(=\\) (from \\(S \\to L = R\\)); since \\(R \\to L\\) and \\(L \\to *R\\), \\(\\text{FOLLOW}(L)\\) and \\(\\text{FOLLOW}(R)\\) are contained in each other, so \\(= \\in \\text{FOLLOW}(R)\\). SLR(1) therefore also puts the reduction \\(R \\to L\\) on the lookahead \\(=\\), next to the shift of \\(=\\): a shift-reduce conflict.", "No other state has this clash: the number of conflicting states is «val»."],
trap="Concluding that the grammar is unambiguous, so it must be SLR(1); this grammar is not SLR(1) but it is LALR(1) and LR(1).", short="SLR uses FOLLOW(R), which is larger than the lookahead that actually follows R in this state.", kind="multi_concept")

# 15 sliding window (MCQ 1, key B)
K.add(15, r"Two hosts are joined by a \(4\) Mbps link with a one-way propagation delay of \(12\) ms. Frames are \(1000\) bytes long, and acknowledgements are very short (their transmission time is negligible). The smallest sender window size, in frames, that lets the sender transmit continuously (full link utilisation) is",
"""tt = 1000 * 8 / 4e6
tp = 0.012
val = math.ceil(1 + 2 * tp / tt - 1e-12)
wrong = [7, 12, 25]""",
steps=["Transmission time of one frame \\(= 8000 / 4\\times 10^6 = 2\\) ms.", "A round trip takes \\(2 \\times 12 = 24\\) ms after the last bit leaves, so the sender must have \\(1 + 24/2 = «val»\\) frames in flight before the first acknowledgement returns."],
trap="Dividing the round-trip time by the frame time without adding the frame being sent (12), or using the one-way delay.", short="Window \\(= 1 + 2T_p / T_t\\).", kind="numeric_chain")

# 26 minimum POS literals (MCQ 2, key D)
K.add(26, r"A Boolean function is specified by its maxterms: \(f(A,B,C,D) = \prod M(0, 1, 4, 5, 9, 13, 14)\). The minimum number of literals in a product-of-sums expression for \(f\) is",
CUBES + """zeros = set([0, 1, 4, 5, 9, 13, 14])
pr = primes_of(zeros, 4)
def lits(c):
    n = 0
    for bit in range(4):
        vals = set((m >> bit) & 1 for m in c)
        if len(vals) == 1:
            n += 1
    return n
val = 99
for r in range(1, len(pr) + 1):
    for combo in itertools.combinations(pr, r):
        if set().union(*combo) == zeros:
            val = min(val, sum(lits(c) for c in combo))
wrong = sorted(set([4, 5, 6, 7, 8]) - set([val]))[:3]""",
steps=["Treat the maxterms as the 1s of the complement \\(\\bar f\\) and find its minimum sum of products on the map.", "The zeros 0, 1, 4, 5 form the group \\(\\bar{A}\\bar{C}\\) (2 literals), the zeros 1, 5, 9, 13 form \\(\\bar{C}D\\) (2 literals), and the isolated zero 14 needs a full product of 4 literals: a cover with \\(2 + 2 + 4 = «val»\\) literals, which no other cover beats.", "By De Morgan, each product term of \\(\\bar f\\) becomes a sum term of \\(f\\) with the same number of literals, so the minimum product of sums has «val» literals."],
trap="Grouping the 1s of \\(f\\) instead of its 0s, which gives the minimum sum of products.", short="Group the zeros, write the complement as a sum of products, then invert (De Morgan).", kind="conceptual")

# 29 minimal cover size (MCQ 2, key A)
K.add(29, r"A relation \(R(A, B, C, D)\) has the set of functional dependencies \(F = \{A \to BC,\ B \to C,\ A \to B,\ AB \to C,\ AC \to D\}\). The number of dependencies in a minimal (canonical) cover of \(F\) is",
"""F = [('A', 'B'), ('A', 'C'), ('B', 'C'), ('A', 'B'), ('AB', 'C'), ('AC', 'D')]
def closure(s, fds):
    s = set(s)
    ch = True
    while ch:
        ch = False
        for l, r in fds:
            if set(l) <= s and not set(r) <= s:
                s = s | set(r)
                ch = True
    return s
fds = []
for l, r in F:
    if (l, r) not in fds:
        fds.append((l, r))
changed = True
while changed:
    changed = False
    for i, (l, r) in enumerate(fds):
        for a in l:
            if len(l) > 1:
                l2 = l.replace(a, '')
                if set(r) <= closure(l2, fds):
                    fds[i] = (l2, r)
                    changed = True
                    break
        if changed:
            break
    if changed:
        continue
    for i, (l, r) in enumerate(fds):
        rest = fds[:i] + fds[i + 1:]
        if set(r) <= closure(l, rest):
            fds = rest
            changed = True
            break
val = len(fds)
cover = ', '.join(l + '->' + r for l, r in fds)
wrong = [2, 4, 5]""",
steps=["Split right-hand sides: \\(A \\to B,\\ A \\to C,\\ B \\to C,\\ AB \\to C,\\ AC \\to D\\) (with \\(A \\to B\\) repeated).", "Remove extraneous attributes: \\(A \\to C\\) follows from \\(A \\to B\\) and \\(B \\to C\\); in \\(AB \\to C\\) the \\(A\\) is extraneous and in \\(AC \\to D\\) the \\(C\\) is extraneous (\\(A\\) alone gives \\(C\\)), so it becomes \\(A \\to D\\).", "Remove redundant dependencies. A minimal cover is «cover», with «val» dependencies."],
trap="Not reducing the left side of \\(AC \\to D\\), which leaves 4 dependencies.", short="First shrink left sides using closures, then drop any dependency implied by the rest.", kind="multi_concept")

# 31 error correction (MCQ 2, key A)
K.add(31, r"A block code uses exactly the four codewords \(00000, 01011, 10101, 11110\). Let \(e\) be the largest number of bit errors that are always detected and \(c\) the largest number of bit errors that are always corrected (nearest-codeword decoding). The value of \(e + c\) is",
"""W = ['00000', '01011', '10101', '11110']
d = min(sum(1 for x, y in zip(a, b) if x != y) for a, b in itertools.combinations(W, 2))
e = d - 1
c = (d - 1) // 2
val = e + c
wrong = [2, 4, 5]""",
steps=["The minimum Hamming distance between any two codewords is \\(d = «d»\\).", "A code detects up to \\(d - 1 = «e»\\) errors and corrects up to \\(\\lfloor (d-1)/2 \\rfloor = «c»\\) errors.", "\\(e + c = «val»\\)."],
trap="Using \\(d\\) itself as the number of detectable errors, or \\(d/2\\) for correction.", short="Detect \\(d-1\\), correct \\(\\lfloor (d-1)/2 \\rfloor\\).", kind="application")

# 32 roads, shortest routes (MSQ 2)
K.add(32, r"Six towns numbered \(0\) to \(5\) are linked by two-way roads whose lengths in km are: road 0-1: 4, road 0-2: 1, road 1-2: 2, road 1-3: 1, road 2-3: 5, road 3-4: 3, road 4-5: 2, road 3-5: 6. A courier plans routes starting from town 0. Which of the following statements is/are TRUE?",
"""W = {}
for a, b, w in [(0, 1, 4), (0, 2, 1), (1, 2, 2), (1, 3, 1), (2, 3, 5), (3, 4, 3), (4, 5, 2), (3, 5, 6)]:
    W[(a, b)] = w
    W[(b, a)] = w
dist = {v: 10 ** 9 for v in range(6)}
dist[0] = 0
prev = {}
done = set()
while len(done) < 6:
    u = min([v for v in range(6) if v not in done], key=lambda v: dist[v])
    done.add(u)
    for v in range(6):
        if (u, v) in W and dist[u] + W[(u, v)] < dist[v]:
            dist[v] = dist[u] + W[(u, v)]
            prev[v] = u
def path(v):
    p = [v]
    while v in prev:
        v = prev[v]
        p.append(v)
    return p[::-1]
order = [0]
q = [0]
while q:
    u = q.pop(0)
    for v in range(6):
        if (u, v) in W and v not in order:
            order.append(v)
            q.append(v)
truth = [dist[5] == 9, 2 in path(3), path(1) == [0, 1], order.index(4) < order.index(3)]""",
stmts=[r"The shortest route from town 0 to town 5 is 9 km long.", r"The shortest route from town 0 to town 3 goes through town 2.", r"The shortest route from town 0 to town 1 is the direct road between them.", r"A breadth-first search from town 0 (taking neighbours in increasing order) reaches town 4 before town 3."],
steps=["Dijkstra's algorithm from town 0 gives the distances 0, 3, 1, 4, 7, 9 for towns 0 to 5.", "Town 1 is reached via town 2 (1 + 2 = 3 km) rather than directly (4 km); town 3 is then reached via 2 and 1 (4 km), so the route to 3 passes through 2, and town 5 costs 9 km.", "Breadth-first search ignores lengths: it visits 0, then 1 and 2, then 3, and only then 4 and 5, so town 3 comes before town 4."],
trap="Assuming the road with the fewest hops is the shortest, or reading the BFS order as the order of distance.", short="Compute all distances once with Dijkstra, then check each statement.", kind="msq_discriminator")

K.save("p2b")
