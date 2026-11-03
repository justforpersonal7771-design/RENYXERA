"""Forge b008 part 3 (slots 29-44). Authored in a local Claude Code session; run: python scripts/forge/author_b008_p3.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b008")

CUBES = """def primes_of(on, nv):
    full = (1 << nv) - 1
    cubes = []
    for mask in range(full + 1):
        for v in range(full + 1):
            if v & (full - mask):
                continue
            cover = set([m for m in range(full + 1) if (m & mask) == v])
            if cover <= on:
                cubes.append(cover)
    return [c for c in cubes if not any(c < d for d in cubes)]
"""

# 29 candidate keys (MCQ 2, key A)
K.add(29, r"A relation \(R(A, B, C, D, E)\) satisfies the functional dependencies \(A \to B,\ BC \to D,\ D \to A,\ E \to C\). The number of candidate keys of \(R\) is",
"""attrs = 'ABCDE'
F = [('A', 'B'), ('BC', 'D'), ('D', 'A'), ('E', 'C')]
def closure(s):
    s = set(s)
    ch = True
    while ch:
        ch = False
        for l, r in F:
            if set(l) <= s and not set(r) <= s:
                s = s | set(r)
                ch = True
    return s
keys = []
for k in range(1, 6):
    for c in itertools.combinations(attrs, k):
        if closure(c) == set(attrs) and not any(set(x) <= set(c) for x in keys):
            keys.append(c)
val = len(keys)
names = [''.join(k) for k in keys]
wrong = [1, 2, 4]""",
steps=["\\(E\\) appears on no right-hand side, so every key contains \\(E\\); \\(E \\to C\\) then supplies \\(C\\).", "The remaining attributes \\(A, B, D\\) are linked by \\(D \\to A \\to B\\) and \\(BC \\to D\\): any one of \\(A\\), \\(B\\), \\(D\\) together with \\(E\\) (and so \\(C\\)) determines everything.", "Candidate keys: «names»: «val» keys."],
trap="Stopping at one key found by the usual closure from \\(A\\) and forgetting that cyclic dependencies give several keys.", short="Start from attributes that never appear on a right-hand side, then see which single attribute completes the closure.", kind="multi_concept")

# 30 ages (MCQ 1, key D)
K.add(30, r"The sum of the present ages of a father and his son is \(54\) years. Six years ago the father was exactly five times as old as his son was then. The present age of the son, in years, is",
"""val = 0
for s in range(7, 54):
    f = 54 - s
    if f - 6 == 5 * (s - 6):
        val = s
wrong = [12, 14, 11]""",
steps=["Let the son be \\(s\\) now: the father is \\(54 - s\\).", "Six years ago: \\(54 - s - 6 = 5(s - 6)\\), so \\(48 - s = 5s - 30\\) and \\(6s = 78\\): \\(s = «val»\\)."],
trap="Applying the ratio 5 : 1 to the present ages instead of the ages six years ago.", short="Sum of ages six years ago \\(= 54 - 12 = 42\\), split 5 : 1 gives son 7 then, 13 now.", kind="application")

# 31 CRC (MCQ 2, key A)
K.add(31, r"A sender uses CRC with the generator polynomial \(x^4 + x + 1\) (bit pattern 10011). The data word is \(1101011011\). The four check bits appended to the data word by the sender are",
"""data = '1101011011'
gen = '10011'
bits = [int(c) for c in data + '0000']
for i in range(len(data)):
    if bits[i] == 1:
        for j in range(5):
            bits[i + j] ^= int(gen[j])
val = ''.join(str(b) for b in bits[-4:])
wrong = ['0111', '1010', '1011']""",
steps=["Append four zeros to the data: \\(11010110110000\\).", "Divide by \\(10011\\) with modulo-2 (XOR) division, bringing down bits as needed.", "The remainder is «val»; these four bits are sent after the data word."],
trap="Using ordinary subtraction instead of XOR, or sending the quotient instead of the remainder.", short="XOR the generator under every leading 1, left to right, and read the last four bits.", kind="application")

# 32 BFS / Dijkstra statements (MSQ 2)
K.add(32, r"An undirected graph on vertices \(0, 1, \dots, 5\) has edges (weights): \(0\text{-}1\,(4)\), \(0\text{-}2\,(1)\), \(1\text{-}2\,(2)\), \(1\text{-}3\,(1)\), \(2\text{-}3\,(5)\), \(3\text{-}4\,(3)\), \(4\text{-}5\,(2)\), \(3\text{-}5\,(6)\). Which of the following statements is/are TRUE?",
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
stmts=[r"The shortest distance from vertex 0 to vertex 5 is 9.", r"Every shortest path from vertex 0 to vertex 3 passes through vertex 2.", r"The shortest path from vertex 0 to vertex 1 is the direct edge 0-1.", r"A breadth-first search from vertex 0 (visiting neighbours in increasing order) reaches vertex 4 before vertex 3."],
steps=["Dijkstra from 0 gives the distances 0, 3, 1, 4, 7, 9 for vertices 0 to 5.", "Vertex 1 is reached through 0-2-1 (cost 3) rather than the direct edge (cost 4), and vertex 3 through 0-2-1-3 (cost 4), so vertex 2 is on that path; vertex 5 costs 9.", "Breadth-first search visits 0, then 1 and 2, then 3, then 4 and 5: vertex 3 comes before vertex 4."],
trap="Taking the direct edge to a vertex as the shortest path, or confusing the BFS level order with distance in weighted edges.", short="Compute all distances once with Dijkstra, then check each statement.", kind="msq_discriminator")

# 33 minimum number of product terms (MCQ 2, key B)
K.add(33, r"The function \(f(A,B,C,D) = \sum m(1, 3, 4, 5, 9, 10, 11, 12, 13, 15)\) is to be realised as a sum of products. The minimum number of product terms needed is",
CUBES + """on = set([1, 3, 4, 5, 9, 10, 11, 12, 13, 15])
pr = primes_of(on, 4)
val = None
for r in range(1, len(pr) + 1):
    if any(set().union(*c) == on for c in itertools.combinations(pr, r)):
        val = r
        break
npr = len(pr)
wrong = sorted(set([3, 4, 5, 6]) - set([val]))[:3]""",
steps=["The function has «npr» prime implicants (maximal groups on the map).", "Trying covers of size 1, 2, 3, ... the smallest cover that includes all ten minterms has «val» terms."],
trap="Using every prime implicant, or choosing groups greedily by size, which can need one term more than the minimum.", short="Take the essential prime implicants first and then the fewest extra groups for what is left.", kind="conceptual")

# 34 LR(0) closure size (MCQ 1, key B)
K.add(34, r"Consider the grammar \(S' \to S\), \(S \to E\), \(E \to E + T \mid T\), \(T \to T * F \mid F\), \(F \to (E) \mid \text{id}\). The number of LR(0) items in the closure of the initial item set \(\{S' \to \cdot S\}\) is",
"""G = [("S'", ('S',)), ('S', ('E',)), ('E', ('E', '+', 'T')), ('E', ('T',)), ('T', ('T', '*', 'F')), ('T', ('F',)), ('F', ('(', 'E', ')')), ('F', ('id',))]
NT = set(["S'", 'S', 'E', 'T', 'F'])
items = set([("S'", ('S',), 0)])
ch = True
while ch:
    ch = False
    for (l, r, d) in list(items):
        if d < len(r) and r[d] in NT:
            for (l2, r2) in G:
                if l2 == r[d] and (l2, r2, 0) not in items:
                    items.add((l2, r2, 0))
                    ch = True
val = len(items)
wrong = [5, 6, 9]""",
steps=["Start with \\(S' \\to \\cdot S\\). The dot is before \\(S\\), so add \\(S \\to \\cdot E\\).", "Before \\(E\\): add \\(E \\to \\cdot E + T\\) and \\(E \\to \\cdot T\\); before \\(T\\): \\(T \\to \\cdot T * F\\) and \\(T \\to \\cdot F\\); before \\(F\\): \\(F \\to \\cdot (E)\\) and \\(F \\to \\cdot \\text{id}\\).", "Total «val» items."],
trap="Counting grammar productions (8) or missing the item for the augmented production.", short="One item per production, because every nonterminal is reachable from the start.", kind="trace")

# 35 logarithms (MCQ 2, key B)
K.add(35, r"If \(\log_2 x + \log_4 x = 6\) for a positive real number \(x\), then \(x\) equals",
"""val = 0
for x in range(1, 5000):
    if abs(math.log2(x) + math.log(x, 4) - 6) < 1e-9:
        val = x
wrong = [8, 32, 64]""",
steps=["\\(\\log_4 x = \\tfrac12 \\log_2 x\\), so \\(\\tfrac32 \\log_2 x = 6\\).", "\\(\\log_2 x = 4\\), hence \\(x = 2^4 = «val»\\)."],
trap="Writing \\(\\log_4 x = 2\\log_2 x\\) (inverting the change of base), which gives \\(x = 8\\).", short="Convert both logarithms to base 2 first.", kind="trap_aware")

# 36 sum of shortest paths (NAT 2)
K.add(36, r"A network has routers A to F and links with costs: A-B \(7\), A-C \(9\), A-F \(14\), B-C \(10\), B-D \(12\), C-D \(11\), C-F \(2\), D-E \(5\), E-F \(9\). Using the least-cost routes computed by link-state routing at router A, the sum of the costs of the least-cost paths from A to the other five routers is ______.",
"""W = {}
for a, b, w in [('A', 'B', 7), ('A', 'C', 9), ('A', 'F', 14), ('B', 'C', 10), ('B', 'D', 12), ('C', 'D', 11), ('C', 'F', 2), ('D', 'E', 5), ('E', 'F', 9)]:
    W[(a, b)] = w
    W[(b, a)] = w
nodes = 'ABCDEF'
dist = {v: 10 ** 9 for v in nodes}
dist['A'] = 0
done = set()
while len(done) < 6:
    u = min([v for v in nodes if v not in done], key=lambda v: dist[v])
    done.add(u)
    for v in nodes:
        if (u, v) in W and dist[u] + W[(u, v)] < dist[v]:
            dist[v] = dist[u] + W[(u, v)]
answer = sum(dist[v] for v in nodes if v != 'A')
dd = [dist[v] for v in nodes if v != 'A']""",
steps=["Dijkstra from A settles B at 7, C at 9, F at 11 (A-C-F), D at 19 (A-B-D), E at 20 (A-C-F-E).", "Costs to B, C, D, E, F are «dd»; their sum is «answer»."],
trap="Using the direct link A-F (14) instead of A-C-F (11), or A-C-D (20) instead of A-B-D (19).", short="Settle vertices in order of distance and relax their neighbours.", kind="numeric_chain")

# 37 divisibility poset (MSQ 2)
K.add(37, r"Consider the set \(P = \{1, 2, 3, 4, 6, 12\}\) partially ordered by divisibility (\(a \preceq b\) iff \(a\) divides \(b\)). Which of the following statements is/are TRUE?",
"""P = [1, 2, 3, 4, 6, 12]
le = lambda a, b: b % a == 0
def lub(a, b):
    ub = [x for x in P if le(a, x) and le(b, x)]
    low = [x for x in ub if all(le(x, y) for y in ub)]
    return low[0] if low else None
def glb(a, b):
    lb = [x for x in P if le(x, a) and le(x, b)]
    hi = [x for x in lb if all(le(y, x) for y in lb)]
    return hi[0] if hi else None
is_lattice = all(lub(a, b) is not None and glb(a, b) is not None for a in P for b in P)
minimal = [x for x in P if not any(y != x and le(y, x) for y in P)]
covers1 = [y for y in P if y != 1 and not any(z not in (1, y) and le(1, z) and le(z, y) for z in P)]
best = 0
for r in range(1, 7):
    for c in itertools.combinations(P, r):
        if all(le(a, b) or le(b, a) for a in c for b in c):
            best = max(best, r)
truth = [is_lattice, len(minimal) == 2, len(covers1) == 2, best == 3]""",
stmts=[r"The poset is a lattice.", r"The poset has exactly two minimal elements.", r"Exactly two elements cover 1 in the Hasse diagram.", r"The longest chain in the poset has exactly 3 elements."],
steps=["Any two elements of \\(P\\) have a gcd and an lcm inside \\(P\\), so every pair has a greatest lower bound and a least upper bound: it is a lattice.", "The only minimal element is 1 (everything is a multiple of 1); 2 and 3 are the elements that cover 1.", "The chain \\(1 \\prec 2 \\prec 4 \\prec 12\\) has 4 elements, so the longest chain is not 3."],
trap="Counting the chain length by edges (3) while the statement counts elements, or taking 2 and 3 as minimal.", short="Draw the Hasse diagram: 1 at the bottom, 12 at the top, 2, 3, 4, 6 in between.", kind="msq_discriminator")

# 38 relation properties (MSQ 1)
K.add(38, r"Let \(R\) be the relation on \(A = \{1, 2, 3, 4\}\) defined by \((a, b) \in R\) iff \(a + b\) is even. Which of the following statements is/are TRUE?",
"""A = [1, 2, 3, 4]
R = set((a, b) for a in A for b in A if (a + b) % 2 == 0)
refl = all((a, a) in R for a in A)
symm = all((b, a) in R for (a, b) in R)
trans = all((a, d) in R for (a, b) in R for (c, d) in R if b == c)
anti = all(a == b for (a, b) in R if (b, a) in R)
truth = [refl, symm, trans, anti]""",
stmts=[r"\(R\) is reflexive.", r"\(R\) is symmetric.", r"\(R\) is transitive.", r"\(R\) is antisymmetric."],
steps=["\\(a + a = 2a\\) is always even, so \\(R\\) is reflexive; \\(a + b = b + a\\) makes it symmetric.", "If \\(a + b\\) and \\(b + c\\) are even then \\(a\\) and \\(c\\) have the same parity as \\(b\\), so \\(a + c\\) is even: transitive.", "But \\((1,3)\\) and \\((3,1)\\) are both in \\(R\\) with \\(1 \\ne 3\\), so it is not antisymmetric. \\(R\\) is an equivalence relation with classes \\(\\{1,3\\}\\) and \\(\\{2,4\\}\\)."],
trap="Thinking symmetric relations must be antisymmetric or the reverse; an equivalence relation with a class larger than one element is never antisymmetric.", short="\\(R\\) is 'same parity': an equivalence relation.", kind="conceptual")

# 39 one's complement (MCQ 1, key B)
K.add(39, r"The 8-bit one's complement representation of the decimal number \(-37\), written in hexadecimal, is",
"""n = 37
v = 255 - n
val = '0x' + '0123456789ABCDEF'[v // 16] + '0123456789ABCDEF'[v % 16]
wrong = ['0xDB', '0xA5', '0x25']""",
steps=["\\(37 = \\texttt{00100101}_2 = \\texttt{0x25}\\).", "Inverting every bit gives \\(\\texttt{11011010}_2 = «val»\\) (the same as \\(255 - 37 = 218\\))."],
trap="Writing the two's complement (0xDB) or just setting the sign bit (0xA5, sign-magnitude).", short="One's complement of \\(n\\) in 8 bits is \\(255 - n\\).", kind="application")

# 40 self-dual functions (MCQ 1, key B)
K.add(40, r"A Boolean function \(f\) of three variables is self-dual if \(f(\bar{x}, \bar{y}, \bar{z}) = \overline{f(x, y, z)}\) for all inputs. The number of self-dual functions of three variables is",
"""cnt = 0
for tt in range(256):
    f = [(tt >> i) & 1 for i in range(8)]
    if all(f[7 - i] == 1 - f[i] for i in range(8)):
        cnt += 1
val = cnt
wrong = [8, 32, 64]""",
steps=["Pair each input with its complement: 4 pairs of rows, such as (000, 111).", "Choosing \\(f\\) on one row of each pair fixes the other row, so there are \\(2^4 = «val»\\) self-dual functions."],
trap="Using \\(2^8\\) (all functions) or \\(2^3\\).", short="\\(2^{2^{n-1}}\\) self-dual functions of \\(n\\) variables.", kind="conceptual")

# 41 fragment offset (MCQ 2, key A)
K.add(41, r"An IPv4 datagram of total length \(4000\) bytes (including a \(20\)-byte header) must cross a link with an MTU of \(1500\) bytes. The fragment offset field (in units of 8 bytes) of the last fragment is",
"""payload = 4000 - 20
per = (1500 - 20) // 8 * 8
off = 0
offs = []
rem = payload
while rem > 0:
    offs.append(off // 8)
    take = min(per, rem)
    rem -= take
    off += take
val = offs[-1]
nf = len(offs)
wrong = [185, 497, 369]""",
steps=["Each fragment carries at most \\(1500 - 20 = 1480\\) bytes of data (a multiple of 8).", "The 3980 data bytes need «nf» fragments of 1480, 1480 and 1020 bytes; the offsets in 8-byte units are «offs».", "The last fragment's offset is «val»."],
trap="Giving the byte offset 2960 or computing 3980/8 = 497.", short="Offset \\(= \\) bytes before the fragment divided by 8: \\(2960 / 8\\).", kind="application")

# 42 TM steps (MCQ 2, key A)
K.add(42, r"A Turing machine has states \(q_0\) (start), \(q_1\) and a halting state \(q_h\); the tape alphabet is \(\{0, 1, \sqcup\}\). Transitions: in \(q_0\), reading 0 or 1 it leaves the symbol and moves right (stay in \(q_0\)); reading \(\sqcup\) it moves left into \(q_1\). In \(q_1\), reading 1 it writes 0 and moves left; reading 0 or \(\sqcup\) it writes 1 and halts. Started in \(q_0\) on the leftmost symbol of the input \(10111\), the number of moves (transitions) made before halting is",
"""tape = {i: c for i, c in enumerate('10111')}
pos, state, steps = 0, 'q0', 0
while state != 'qh':
    c = tape.get(pos, '_')
    if state == 'q0':
        if c in '01':
            pos += 1
        else:
            state = 'q1'
            pos -= 1
    else:
        if c == '1':
            tape[pos] = '0'
            pos -= 1
        else:
            tape[pos] = '1'
            state = 'qh'
    steps += 1
val = steps
final = ''.join(tape[i] for i in sorted(tape))
wrong = [9, 11, 15]""",
steps=["The machine adds 1 to the binary number: it scans right to the blank, then carries leftwards.", "Moves: 5 to the right over \\(10111\\), 1 to step back onto the last symbol, then three carry steps (1 to 0) and one final write: «val» moves in all; the tape ends as «final»."],
trap="Forgetting the move that turns around at the blank, or counting the halting write as no move.", short="Scan right (n moves), turn around (1 move), then one move per carried 1 plus the final write.", kind="trace")

# 43 normal form (MCQ 2, key C)
K.add(43, r"A relation \(R(A, B, C, D, E)\) has the functional dependencies \(AB \to C,\ C \to D,\ D \to E\). Which one of the following statements about its highest normal form is correct?",
"""attrs = 'ABCDE'
F = [('AB', 'C'), ('C', 'D'), ('D', 'E')]
def closure(s):
    s = set(s)
    ch = True
    while ch:
        ch = False
        for l, r in F:
            if set(l) <= s and not set(r) <= s:
                s = s | set(r)
                ch = True
    return s
keys = []
for k in range(1, 6):
    for c in itertools.combinations(attrs, k):
        if closure(c) == set(attrs) and not any(set(x) <= set(c) for x in keys):
            keys.append(c)
prime = set(a for k in keys for a in k)
def superkey(x):
    return closure(x) == set(attrs)
bcnf = all(superkey(l) for l, r in F)
nf3 = all(superkey(l) or set(r) <= prime for l, r in F)
partial = any(set(l) < set(k) and not set(r) <= prime for l, r in F for k in keys) or any(set(k) > set(l) and set(r) - prime for l, r in F for k in keys if set(l) < set(k))
for l, r in F:
    for k in keys:
        if set(l) < set(k) and (set(closure(l)) - set(l) - prime):
            partial = True
nf2 = not partial
truth = [bcnf, nf3 and not bcnf, nf2 and not nf3, not nf2]""",
stmts=[r"R is in BCNF.", r"R is in 3NF but not in BCNF.", r"R is in 2NF but not in 3NF.", r"R is in 1NF but not in 2NF."],
steps=["The only candidate key is \\(AB\\) (closure \\(AB \\to C \\to D \\to E\\)); \\(C, D, E\\) are non-prime.", "No proper subset of \\(AB\\) determines a non-prime attribute, so there is no partial dependency: R is in 2NF.", "\\(C \\to D\\) and \\(D \\to E\\) are transitive dependencies of non-prime attributes on the key (\\(C\\) and \\(D\\) are not superkeys and \\(D\\), \\(E\\) are not prime): R is not in 3NF."],
trap="Stopping at the check for partial dependencies and calling the relation 3NF.", short="2NF removes partial dependencies; 3NF also removes transitive ones on non-prime attributes.", kind="trap_aware")

# 44 group axioms (MSQ 1)
K.add(44, r"Which of the following structures is/are groups?",
"""def is_group(S, op):
    S = list(S)
    if not all(op(a, b) in S for a in S for b in S):
        return False
    if not all(op(op(a, b), c) == op(a, op(b, c)) for a in S for b in S for c in S):
        return False
    ids = [e for e in S if all(op(e, a) == a and op(a, e) == a for a in S)]
    if not ids:
        return False
    e = ids[0]
    return all(any(op(a, b) == e and op(b, a) == e for b in S) for a in S)
truth = [is_group([1, 3, 5, 7], lambda a, b: a * b % 8), is_group(range(8), lambda a, b: a * b % 8), is_group([1, 2, 3, 4], lambda a, b: a * b % 5), is_group([1, 2, 3, 4, 5], lambda a, b: a * b % 6)]""",
stmts=[r"\(\{1, 3, 5, 7\}\) under multiplication modulo 8", r"\(\{0, 1, \dots, 7\}\) under multiplication modulo 8", r"\(\{1, 2, 3, 4\}\) under multiplication modulo 5", r"\(\{1, 2, 3, 4, 5\}\) under multiplication modulo 6"],
steps=["The units modulo \\(n\\) form a group under multiplication: \\(\\{1,3,5,7\\}\\) mod 8 and \\(\\{1,2,3,4\\}\\) mod 5 are groups.", "Including 0 (mod 8) destroys inverses; and \\(\\{1,\\dots,5\\}\\) mod 6 is not even closed (\\(2 \\times 3 = 0\\))."],
trap="Assuming any set closed under multiplication mod \\(n\\) is a group; inverses exist only for numbers coprime to \\(n\\).", short="Keep only the residues coprime to the modulus.", kind="conceptual")

K.save("p3")
