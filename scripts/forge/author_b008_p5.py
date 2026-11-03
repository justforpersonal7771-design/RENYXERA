"""Forge b008 part 5 (slots 63-79). Authored in a local Claude Code session; run: python scripts/forge/author_b008_p5.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b008")

# 63 data interpretation (MCQ 2, key D)
K.add(63, r"""The table gives the number of units sold (in hundreds) by four products in the four quarters of a year.

| Product | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|
| P | 120 | 135 | 150 | 165 |
| Q | 200 | 180 | 170 | 160 |
| R | 90 | 110 | 140 | 180 |
| S | 150 | 150 | 160 | 170 |

The largest percentage increase in sales from Q1 to Q4 among the four products is""",
"""T = {'P': (120, 165), 'Q': (200, 160), 'R': (90, 180), 'S': (150, 170)}
g = {k: 100 * (b - a) / a for k, (a, b) in T.items()}
val = round(max(g.values()), 1)
wrong = [round(g['P'], 1), round(g['S'], 1), 20.0]""",
steps=["Percentage change \\(= (Q4 - Q1)/Q1\\): P \\(= 37.5\\%\\), Q \\(= -20\\%\\), R \\(= 100\\%\\), S \\(= 13.3\\%\\).", "The largest is «val» %, for product R."],
trap="Comparing absolute increases (P and R both rise by 45 and 90) instead of percentages, or picking Q for its large base.", short="R doubles from 90 to 180: 100 %.", kind="data_interpretation")

# 64 eigenvalues (MCQ 1, key D)
K.add(64, r"The matrix \(A = \begin{pmatrix} 4 & 1 \\ 2 & 3 \end{pmatrix}\) has eigenvalues \(\lambda_1\) and \(\lambda_2\). The value of \(\lambda_1^2 + \lambda_2^2\) is",
"""tr = 4 + 3
det = 4 * 3 - 1 * 2
disc = math.sqrt(tr * tr - 4 * det)
l1 = (tr + disc) / 2
l2 = (tr - disc) / 2
val = int(round(l1 ** 2 + l2 ** 2))
wrong = [49, 21, 35]""",
steps=["Characteristic equation: \\(\\lambda^2 - 7\\lambda + 10 = 0\\), so \\(\\lambda = 5\\) and \\(2\\).", "\\(\\lambda_1^2 + \\lambda_2^2 = 25 + 4 = «val»\\) (also \\((\\text{trace})^2 - 2\\det = 49 - 20\\))."],
trap="Squaring the trace (49) and forgetting the cross term \\(2\\lambda_1\\lambda_2\\).", short="Sum of squares \\(= \\text{tr}^2 - 2\\det\\).", kind="application")

# 65 graph facts on K3,3 (MSQ 2)
K.add(65, r"Let \(G = K_{3,3}\), the complete bipartite graph with parts \(\{a_1, a_2, a_3\}\) and \(\{b_1, b_2, b_3\}\). Which of the following statements is/are TRUE?",
"""A = [0, 1, 2]
B = [3, 4, 5]
E = set()
for a in A:
    for b in B:
        E.add((a, b))
        E.add((b, a))
pm = any(all((i, 3 + p[i]) in E for i in range(3)) for p in itertools.permutations(range(3)))
chi = next(k for k in range(1, 7) if any(all(c[u] != c[v] for (u, v) in E) for c in itertools.product(range(k), repeat=6)))
deg = [sum(1 for (u, v) in E if u == x) for x in range(6)]
euler = all(d % 2 == 0 for d in deg)
ham = False
for p in itertools.permutations(range(1, 6)):
    cyc = (0,) + p
    if all((cyc[i], cyc[(i + 1) % 6]) in E for i in range(6)):
        ham = True
truth = [pm, chi == 2, euler, ham]""",
stmts=[r"\(G\) has a perfect matching.", r"The chromatic number of \(G\) is 2.", r"\(G\) has an Eulerian circuit.", r"\(G\) has a Hamiltonian cycle."],
steps=["Match \\(a_i\\) with \\(b_i\\): a perfect matching exists. A bipartite graph is 2-colourable, and it has an edge, so \\(\\chi = 2\\).", "Every vertex has degree 3 (odd), so there is no Eulerian circuit.", "\\(a_1 b_1 a_2 b_2 a_3 b_3 a_1\\) is a Hamiltonian cycle."],
trap="Applying the Euler condition to the number of edges (9) instead of to the degrees of the vertices.", short="Degrees decide Euler circuits; alternating parts give Hamiltonian cycles in complete bipartite graphs with equal parts.", kind="msq_discriminator")

# 66 superkeys (NAT 1)
K.add(66, r"A relation \(R(A, B, C, D)\) satisfies exactly the functional dependencies \(A \to B,\ B \to C,\ C \to A\). The number of superkeys of \(R\) is ______.",
"""attrs = 'ABCD'
F = [('A', 'B'), ('B', 'C'), ('C', 'A')]
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
cnt = 0
for k in range(1, 5):
    for c in itertools.combinations(attrs, k):
        if closure(c) == set(attrs):
            cnt += 1
answer = cnt""",
steps=["\\(D\\) is on no right-hand side, so every key contains \\(D\\); the cycle \\(A \\to B \\to C \\to A\\) means any one of \\(A, B, C\\) determines the other two.", "A superkey must contain \\(D\\) and at least one of \\(A, B, C\\): \\(2^3 - 1 = 7\\) of the 8 subsets of \\(\\{A, B, C\\}\\), giving «answer» superkeys."],
trap="Counting only the candidate keys (3) rather than all supersets of them.", short="Superkeys \\(= \\) subsets containing \\(D\\) minus the one with none of \\(A, B, C\\).", kind="multi_concept")

# 67 round robin turnaround (NAT 1)
K.add(67, r"Four processes \(P_1, P_2, P_3, P_4\) arrive at times \(0, 1, 2, 3\) with CPU bursts \(7, 4, 1, 4\) ms. Round-robin scheduling with a time quantum of \(2\) ms is used; a process that arrives at the same instant as a quantum expiry is queued before the preempted process. The average turnaround time, in ms, is ______.",
"""procs = [(0, 7), (1, 4), (2, 1), (3, 4)]
q = 2
rem = [b for a, b in procs]
t = 0
queue = []
arrived = set()
fin = {}
def admit(t):
    for i, (a, b) in enumerate(procs):
        if a <= t and i not in arrived:
            arrived.add(i)
            queue.append(i)
admit(0)
while len(fin) < 4:
    if not queue:
        t = min(a for i, (a, b) in enumerate(procs) if i not in arrived)
        admit(t)
        continue
    i = queue.pop(0)
    run = min(q, rem[i])
    t += run
    rem[i] -= run
    admit(t)
    if rem[i] > 0:
        queue.append(i)
    else:
        fin[i] = t
answer = sum(fin[i] - procs[i][0] for i in range(4)) / 4
fl = [fin[i] for i in range(4)]""",
steps=["Following the queue with quantum 2 (new arrivals join before the preempted process), the completion times of \\(P_1, \\dots, P_4\\) are «fl» ms.", "Turnaround \\(=\\) completion \\(-\\) arrival; the average is «answer» ms."],
trap="Queuing the preempted process ahead of the new arrival, which changes the order and the answer.", short="Draw the Gantt chart with the ready queue after each slice.", kind="trace")

# 68 semaphore deadlock (MSQ 2)
K.add(68, r"Three processes share two binary semaphores \(A\) and \(B\), both initialised to 1. \(P_1\) runs: wait(A); wait(B); signal(B); signal(A). \(P_2\) runs: wait(B); wait(A); signal(A); signal(B). \(P_3\) runs: wait(A); signal(A). The processes are scheduled in any interleaving, one operation at a time. Which of the following statements is/are TRUE?",
"""def explore(progs):
    start = (tuple(0 for p in progs), (1, 1))
    seen = set([start])
    stack = [start]
    deadlocks = set()
    finals = set()
    while stack:
        pcs, sem = stack.pop()
        moves = 0
        for i, p in enumerate(progs):
            if pcs[i] >= len(p):
                continue
            op, x = p[pcs[i]]
            k = 0 if x == 'A' else 1
            s = list(sem)
            if op == 'wait':
                if s[k] == 0:
                    continue
                s[k] -= 1
            else:
                s[k] += 1
            npcs = list(pcs)
            npcs[i] += 1
            st = (tuple(npcs), tuple(s))
            moves += 1
            if st not in seen:
                seen.add(st)
                stack.append(st)
        if moves == 0:
            if all(pcs[i] >= len(progs[i]) for i in range(len(progs))):
                finals.add(sem)
            else:
                deadlocks.add((pcs, sem))
    return deadlocks, finals
P1 = [('wait', 'A'), ('wait', 'B'), ('signal', 'B'), ('signal', 'A')]
P2 = [('wait', 'B'), ('wait', 'A'), ('signal', 'A'), ('signal', 'B')]
P2b = [('wait', 'A'), ('wait', 'B'), ('signal', 'B'), ('signal', 'A')]
P3 = [('wait', 'A'), ('signal', 'A')]
d1, f1 = explore([P1, P2, P3])
d2, f2 = explore([P1, P2b, P3])
nd = len(d1)
truth = [len(d1) > 0, len(d2) == 0, nd == 1, f1 == set([(1, 1)])]""",
stmts=[r"The system can reach a deadlock.", r"If \(P_2\) is changed to acquire \(A\) before \(B\), no deadlock can occur.", r"Exactly one distinct deadlock state is reachable.", r"In every execution that does not deadlock, both semaphores end with the value 1."],
steps=["\\(P_1\\) takes \\(A\\) then asks for \\(B\\) while \\(P_2\\) takes \\(B\\) then asks for \\(A\\): both can hold one resource and wait for the other, a circular wait. Exploring all interleavings gives «nd» distinct deadlock states.", "If every process takes \\(A\\) before \\(B\\), there is no circular wait and no deadlock. Every completed run signals as many times as it waits, so both semaphores return to 1."],
trap="Looking only at the pair \\(P_1, P_2\\) and assuming the third process cannot change the number of deadlock states.", short="Check for a circular wait: two processes taking the same two locks in opposite orders.", kind="msq_discriminator")

# 69 fragments (MCQ 1, key C)
K.add(69, r"A \(5000\)-byte IPv4 datagram (including its \(20\)-byte header) is sent over links with an MTU of \(1000\) bytes. The number of fragments produced is",
"""payload = 5000 - 20
per = (1000 - 20) // 8 * 8
val = -(-payload // per)
wrong = [5, 7, 4]""",
steps=["Each fragment can carry \\(1000 - 20 = 980\\) data bytes rounded down to a multiple of 8: 976.", "The 4980 data bytes need \\(\\lceil 4980/976 \\rceil = «val»\\) fragments."],
trap="Dividing 5000 by 1000 (5), ignoring the header and the multiple-of-8 rule.", short="Round the per-fragment data down to a multiple of 8 before dividing.", kind="application")

# 70 committees (MCQ 2, key D)
K.add(70, r"A committee of \(4\) people is to be chosen from \(6\) men and \(5\) women so that it contains at least \(2\) women. The number of ways is",
"""cnt = 0
for w in range(2, 5):
    cnt += math.comb(5, w) * math.comb(6, 4 - w)
val = cnt
wrong = [185, 225, 315]""",
steps=["Count by number of women: \\(\\binom52\\binom62 + \\binom53\\binom61 + \\binom54\\binom60 = 150 + 60 + 5 = «val»\\).", "Check by complement: \\(\\binom{11}{4} - \\binom64 - 5\\binom63 = 330 - 15 - 100 = 215\\)."],
trap="Subtracting only the committees with no women (giving 315).", short="Total minus 'no women' minus 'exactly one woman'.", kind="multi_concept")

# 71 trace of A^3 (MCQ 2, key C)
K.add(71, r"A coupled oscillator system is described by a symmetric array whose first two rows and columns form one block and whose last row and column form a separate block: \(A = \begin{pmatrix} 2 & 1 & 0 \\ 1 & 2 & 0 \\ 0 & 0 & 3 \end{pmatrix}\). Using the fact that the spectrum of a block-diagonal array is the union of the spectra of its blocks, the sum of the diagonal entries of the cube of \(A\) equals",
"""A = [[2, 1, 0], [1, 2, 0], [0, 0, 3]]
def mul(X, Y):
    return [[sum(X[i][k] * Y[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
A3 = mul(A, mul(A, A))
val = sum(A3[i][i] for i in range(3))
wrong = [36, 63, 45]""",
steps=["The eigenvalues of \\(A\\) are 1, 3 (from the upper block) and 3.", "\\(\\text{tr}(A^3) = 1^3 + 3^3 + 3^3 = «val»\\) (multiplying out \\(A^3\\) gives the same trace)."],
trap="Cubing the trace of \\(A\\) (343) or using only the largest eigenvalue.", short="Trace of a power is the sum of powers of eigenvalues.", kind="application")

# 72 graph facts (MSQ 1)
K.add(72, r"Four claims are made about standard families of graphs, their proper vertex colourings and their matchings. Select every claim that is correct.",
"""def chi(n, E):
    return next(k for k in range(1, n + 1) if any(all(c[u] != c[v] for (u, v) in E) for c in itertools.product(range(k), repeat=n)))
C7 = [(i, (i + 1) % 7) for i in range(7)]
c7chi = chi(7, C7)
K5me = [(i, j) for i in range(5) for j in range(i + 1, 5) if (i, j) != (0, 1)]
k5chi = chi(5, K5me)
K34 = [(i, 3 + j) for i in range(3) for j in range(4)]
Es = set(K34)
best = 0
for r in range(1, 4):
    for pairs in itertools.combinations(sorted(Es), r):
        us = [u for u, v in pairs]
        vs = [v for u, v in pairs]
        if len(set(us)) == r and len(set(vs)) == r:
            best = max(best, r)
truth = [c7chi == 3, 7 % 2 == 0, best == 3, k5chi == 3]""",
stmts=[r"The cycle \(C_7\) needs exactly 3 colours in a proper vertex colouring.", r"The cycle \(C_7\) has a perfect matching.", r"The complete bipartite graph \(K_{3,4}\) has a matching with 3 edges.", r"\(K_5\) with one edge removed can be properly coloured with 3 colours."],
steps=["An odd cycle is not bipartite, so \\(C_7\\) needs 3 colours; a perfect matching needs an even number of vertices, and 7 is odd.", "\\(K_{3,4}\\) has a matching that covers the 3 vertices of the smaller part.", "\\(K_5\\) minus an edge still contains a \\(K_4\\), which needs 4 colours."],
trap="Using the number of edges, not the parity of the vertex count, for perfect matchings.", short="Odd cycle: chromatic number 3, no perfect matching.", kind="msq_discriminator")

# 73 closure size (NAT 1)
K.add(73, r"A relation has attributes \(A, B, C, D, E, F, G\) and the dependencies \(A \to B,\ BC \to D,\ D \to E,\ E \to F,\ G \to A\). The number of attributes in the closure \(\{A, C\}^{+}\) is ______.",
"""F = [('A', 'B'), ('BC', 'D'), ('D', 'E'), ('E', 'F'), ('G', 'A')]
s = set('AC')
ch = True
while ch:
    ch = False
    for l, r in F:
        if set(l) <= s and not set(r) <= s:
            s = s | set(r)
            ch = True
answer = len(s)
cl = ''.join(sorted(s))""",
steps=["Start with \\(\\{A, C\\}\\). \\(A \\to B\\) adds \\(B\\); then \\(BC \\to D\\) adds \\(D\\); \\(D \\to E\\) adds \\(E\\); \\(E \\to F\\) adds \\(F\\).", "\\(G \\to A\\) cannot be used backwards. The closure is \\(\\{«cl»\\}\\), with «answer» attributes."],
trap="Using \\(G \\to A\\) to add \\(G\\) (a dependency is not reversible).", short="Chain the dependencies in the direction they point.", kind="multi_concept")

# 74 pointer arithmetic (MCQ 1, key D)
K.add(74, r"""A two-dimensional array is declared and filled so that a[i][j] = 4*i + j.
```c
int a[3][4];
/* a[i][j] = 4*i + j for all valid i, j */
int r = *(*(a + 2) - 3) + **(a + 1);
```
The value of `r` is""",
"""flat = [4 * i + j for i in range(3) for j in range(4)]
val = flat[8 - 3] + flat[4]
wrong = [8, 10, 13]""",
steps=["Rows are contiguous in memory: the flat array holds \\(0, 1, \\dots, 11\\). `*(a + 2)` points to the first element of row 2 (flat index 8).", "Subtracting 3 gives flat index 5, whose value is 5; `**(a + 1)` is `a[1][0] = 4`. The sum is «val»."],
trap="Treating `*(a + 2) - 3` as a subtraction on the value (giving 5 from 8) rather than on the address, or stepping back by whole rows.", short="Pointer arithmetic on `*(a + i)` moves by elements, not rows.", kind="trace")

# 75 rank (MCQ 1, key D)
K.add(75, r"A homogeneous system of four linear equations in four unknowns has the coefficient array \(\begin{pmatrix} 1 & 2 & 3 & 4 \\ 2 & 4 & 6 & 8 \\ 1 & 0 & 1 & 0 \\ 0 & 2 & 2 & 5 \end{pmatrix}\). The number of linearly independent equations (the dimension of the row space) is",
"""M = [[1, 2, 3, 4], [2, 4, 6, 8], [1, 0, 1, 0], [0, 2, 2, 5]]
A = [[fractions.Fraction(x) for x in r] for r in M]
rank = 0
rows, cols = 4, 4
for c in range(cols):
    p = next((r for r in range(rank, rows) if A[r][c] != 0), None)
    if p is None:
        continue
    A[rank], A[p] = A[p], A[rank]
    for r in range(rows):
        if r != rank and A[r][c] != 0:
            f = A[r][c] / A[rank][c]
            A[r] = [A[r][k] - f * A[rank][k] for k in range(cols)]
    rank += 1
val = rank
wrong = [2, 4, 1]""",
steps=["Row 2 is twice row 1, so it adds no new direction.", "Eliminating the other rows leaves three independent rows: the rank is «val»."],
trap="Reading the rank as the number of non-zero rows without noticing that row 2 is a multiple of row 1.", short="Spot the proportional rows first, then eliminate.", kind="trace")

# 76 mutual recursion (NAT 2)
K.add(76, r"""Two mutually recursive C functions are defined as follows.
```c
int f(int n) { if (n <= 0) return 1; return f(n - 1) + g(n - 2); }
int g(int n) { if (n <= 0) return 2; return g(n - 1) + f(n - 1); }
```
The value of `f(6)` is ______.""",
"""def f(n):
    if n <= 0:
        return 1
    return f(n - 1) + g(n - 2)
def g(n):
    if n <= 0:
        return 2
    return g(n - 1) + f(n - 1)
answer = f(6)""",
steps=["Tabulate \\(f(n)\\) and \\(g(n)\\) for small \\(n\\): \\(f(0) = 1,\\ g(0) = 2,\\ f(1) = f(0) + g(-1) = 3,\\ g(1) = g(0) + f(0) = 3, \\dots\\)", "Continuing the table up to \\(n = 6\\) gives \\(f(6) = «answer»\\)."],
trap="Using \\(g(n)\\) for \\(n \\le 0\\) as 1 (it is 2) or mixing the arguments \\(n - 1\\) and \\(n - 2\\).", short="Build both tables bottom-up instead of expanding the recursion.", kind="numeric_chain")

# 77 propositional statements (MSQ 1)
K.add(77, r"Four claims are made about compound propositions built from the propositional variables \(p, q, r\) using implication, conjunction, disjunction and negation. Select every claim that is correct.",
"""def imp(a, b):
    return (not a) or b
rows = list(itertools.product([False, True], repeat=3))
s1 = all(imp(imp(p, q) and imp(q, r), imp(p, r)) for p, q, r in rows)
s2 = all(imp(p or q, p and q) for p, q, r in rows)
s3 = all(imp(p, q) == imp(not q, not p) for p, q, r in rows)
s4 = not any(imp(p, q) or imp(q, p) for p, q, r in rows)
truth = [s1, s2, s3, s4]""",
stmts=[r"\(((p \to q) \wedge (q \to r)) \to (p \to r)\) is a tautology.", r"\((p \vee q) \to (p \wedge q)\) is a tautology.", r"\((p \to q)\) is logically equivalent to \((\neg q \to \neg p)\).", r"\((p \to q) \vee (q \to p)\) is a contradiction."],
steps=["The first is hypothetical syllogism (always true), and the third is the contrapositive equivalence.", "\\((p \\vee q) \\to (p \\wedge q)\\) fails when exactly one of \\(p, q\\) is true, so it is not a tautology.", "\\((p \\to q) \\vee (q \\to p)\\) is true for every assignment, so it is a tautology, not a contradiction."],
trap="Confusing 'not a tautology' with 'a contradiction'.", short="Check the single falsifying row for each claimed tautology.", kind="conceptual")

# 78 left outer join (MCQ 1, key D)
K.add(78, r"""Relation \(R(A, B)\) has the tuples \((1, a), (2, a), (3, b), (4, c)\) and relation \(S(B, C)\) has the tuples \((a, x), (a, y), (b, z), (d, w)\). The number of tuples in the left outer join of \(R\) and \(S\) on the common attribute \(B\) is""",
"""R = [(1, 'a'), (2, 'a'), (3, 'b'), (4, 'c')]
S = [('a', 'x'), ('a', 'y'), ('b', 'z'), ('d', 'w')]
out = []
for a, b in R:
    m = [c for bb, c in S if bb == b]
    if m:
        for c in m:
            out.append((a, b, c))
    else:
        out.append((a, b, None))
val = len(out)
wrong = [5, 4, 8]""",
steps=["Matching tuples: \\((1,a)\\) and \\((2,a)\\) each match two tuples of \\(S\\) (4 results), and \\((3,b)\\) matches one: 5 tuples in the inner join.", "A left outer join also keeps each tuple of \\(R\\) without a match: \\((4, c)\\) gives one more tuple padded with NULL. Total «val»."],
trap="Reporting the inner-join size 5 or adding the unmatched tuple of \\(S\\) (that is a right/full outer join).", short="Inner join plus one row for each unmatched left tuple.", kind="application")

# 79 integer solutions (MCQ 2, key D)
K.add(79, r"The number of pairs of positive integers \((x, y)\) satisfying \(3x + 2y = 18\) is",
"""val = len([(x, y) for x in range(1, 19) for y in range(1, 19) if 3 * x + 2 * y == 18])
wrong = [1, 3, 4]""",
steps=["\\(3x\\) must be even, so \\(x\\) is even; \\(x = 2\\) gives \\(y = 6\\), \\(x = 4\\) gives \\(y = 3\\), and \\(x = 6\\) gives \\(y = 0\\) (not positive).", "There are «val» pairs."],
trap="Allowing \\(x = 0\\) or \\(y = 0\\), or counting odd values of \\(x\\).", short="Parity forces \\(x\\) even.", kind="numeric_chain")

K.save("p5")
