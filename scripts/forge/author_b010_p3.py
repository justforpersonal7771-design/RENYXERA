"""Forge b010 part 3 (designed batch). Run: python scripts/forge/author_b010_p3.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b010")

# 12 SLR vs LALR vs LR(1) on a classic grammar (MCQ, key A)
K.add(12, r"A parser generator is given a toy protocol grammar whose terminals are \(a, b, c, d, e\) and whose non-terminals are \(S\) (the start), \(A\) and \(B\). The productions are \(S \to a\,A\,d \mid b\,B\,d \mid a\,B\,e \mid b\,A\,e\), \(A \to c\) and \(B \to c\). Which one of the following classifications of the grammar is TRUE?",
"""G = [("S'", ("S",)), ("S", ("a", "A", "d")), ("S", ("b", "B", "d")), ("S", ("a", "B", "e")), ("S", ("b", "A", "e")), ("A", ("c",)), ("B", ("c",))]
NT = ["S'", "S", "A", "B"]
def first(sym):
    if sym not in NT:
        return set([sym])
    out = set()
    for l, r in G:
        if l == sym:
            out |= first(r[0])
    return out
def closure(items):
    items = set(items)
    ch = True
    while ch:
        ch = False
        for (p, d, la) in list(items):
            lhs, rhs = G[p]
            if d < len(rhs) and rhs[d] in NT:
                beta = rhs[d + 1:]
                las = first(beta[0]) if beta else set([la])
                for q, (l2, r2) in enumerate(G):
                    if l2 == rhs[d]:
                        for x in las:
                            it = (q, 0, x)
                            if it not in items:
                                items.add(it)
                                ch = True
    return tuple(sorted(items))
def goto(st, X):
    moved = set((p, d + 1, la) for (p, d, la) in st if d < len(G[p][1]) and G[p][1][d] == X)
    return closure(moved) if moved else None
start = closure(set([(0, 0, '$')]))
states = [start]
seen = {start: 0}
syms = set()
for l, r in G:
    syms.add(l)
    for s in r:
        syms.add(s)
syms = sorted(syms)
i = 0
while i < len(states):
    for X in syms:
        g = goto(states[i], X)
        if g is not None and g not in seen:
            seen[g] = len(states)
            states.append(g)
    i += 1
def conflict(st, la_of):
    reds = []
    shifts = set()
    for (p, d, la) in st:
        if d == len(G[p][1]):
            for x in la_of(p, la):
                reds.append((p, x))
        elif G[p][1][d] not in NT:
            shifts.add(G[p][1][d])
    las = [x for p, x in reds]
    return any(x in shifts for x in las) or len(las) != len(set(las))
lr1_ok = not any(conflict(s, lambda p, la: [la]) for s in states)
groups = {}
for s in states:
    core = tuple(sorted(set((p, d) for (p, d, la) in s)))
    groups[core] = groups.get(core, set()) | set(s)
lalr_ok = not any(conflict(tuple(sorted(g)), lambda p, la: [la]) for g in groups.values())
follow = {n: set() for n in NT}
follow["S'"].add('$')
ch = True
while ch:
    ch = False
    for l, r in G:
        for k, s in enumerate(r):
            if s in NT:
                add = first(r[k + 1]) if k + 1 < len(r) else follow[l]
                if not add <= follow[s]:
                    follow[s] |= add
                    ch = True
slr_ok = not any(conflict(tuple(sorted(set((p, d, 'x') for (p, d) in core))), lambda p, la: sorted(follow[G[p][0]])) for core in groups.keys())
nstates = len(states)
ncores = len(groups)
truth = [slr_ok, lalr_ok and not slr_ok, lr1_ok and not lalr_ok, not lr1_ok]""",
stmts=[r"The grammar is SLR(1).", r"The grammar is LALR(1) but not SLR(1).", r"The grammar is LR(1) but not LALR(1).", r"The grammar is not LR(1)."],
steps=["After reading \\(a\\,c\\) the parser holds \\(A \\to c\\cdot\\) with look-ahead \\(d\\) and \\(B \\to c\\cdot\\) with look-ahead \\(e\\); after \\(b\\,c\\) the look-aheads are the other way round (\\(A\\): \\(e\\), \\(B\\): \\(d\\)). With full look-aheads there is no conflict, so the grammar is LR(1) (the canonical collection has «nstates» states).", "LALR(1) merges states with the same core: the two states \\(\\{A \\to c\\cdot,\\ B \\to c\\cdot\\}\\) merge into one in which both reductions have look-ahead set \\(\\{d, e\\}\\), a reduce-reduce conflict (the merged automaton has «ncores» states).", "SLR(1) uses \\(\\text{FOLLOW}(A) = \\text{FOLLOW}(B) = \\{d, e\\}\\) and conflicts in the same way. So the grammar is LR(1) but neither LALR(1) nor SLR(1)."],
trap="Assuming LALR(1) is as strong as LR(1): merging states can create reduce-reduce conflicts that full look-aheads avoid.", short="Compare the look-aheads of the two reductions before and after merging same-core states.", kind="msq_discriminator")

# 35 eigenvalues and the Fibonacci matrix (NAT)
K.add(35, r"A number generator advances its state vector by multiplying it with the \(2 \times 2\) matrix \(A = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}\), so that the state after \(n\) steps holds two consecutive Fibonacci numbers. Each of the two eigenvalues of \(A\) is raised to the tenth power and the two results are added. The sum is ______.",
"""M = [[1, 0], [0, 1]]
A = [[1, 1], [1, 0]]
for _ in range(10):
    M = [[M[0][0] * A[0][0] + M[0][1] * A[1][0], M[0][0] * A[0][1] + M[0][1] * A[1][1]], [M[1][0] * A[0][0] + M[1][1] * A[1][0], M[1][0] * A[0][1] + M[1][1] * A[1][1]]]
answer = M[0][0] + M[1][1]
f = [0, 1]
for _ in range(12):
    f.append(f[-1] + f[-2])
lucas = f[9] + f[11]""",
steps=["The eigenvalues of \\(A^{10}\\) are \\(\\lambda_1^{10}\\) and \\(\\lambda_2^{10}\\), so their sum is the trace of \\(A^{10}\\).", "\\(A^{n} = \\begin{pmatrix} F_{n+1} & F_{n} \\\\ F_{n} & F_{n-1} \\end{pmatrix}\\), so the trace is \\(F_{11} + F_{9} = 89 + 34 = «answer»\\) (the Lucas number \\(L_{10}\\)).", "Check: \\(\\lambda\\) are the roots of \\(x^2 = x + 1\\), the golden ratio and its conjugate; the power sum obeys the same recurrence as the Fibonacci numbers."],
trap="Computing the eigenvalues numerically and raising them to the tenth power with rounding, or reporting a Fibonacci number instead of the Lucas number.", short="Sum of eigenvalue powers = trace of the matrix power.", kind="multi_concept")

# 38 heap: Floyd build plus two extractions, swaps counted (NAT)
K.add(38, r"The array \([3, 9, 2, 1, 7, 5, 8, 6, 4]\) is turned into a binary max-heap by Floyd's bottom-up method (sift down every internal node from the last one to the root; at each step swap with the larger child while that child is larger than the node). Then the maximum is extracted twice (move the last element to the root, shrink the heap and sift down). The total number of swaps performed, in the build and the two extractions together, is ______.",
"""a = [3, 9, 2, 1, 7, 5, 8, 6, 4]
swaps = 0
def sift(a, i, n):
    global swaps
    while True:
        l = 2 * i + 1
        r = l + 1
        m = i
        if l < n and a[l] > a[m]:
            m = l
        if r < n and a[r] > a[m]:
            m = r
        if m == i:
            break
        a[i], a[m] = a[m], a[i]
        swaps += 1
        i = m
n = len(a)
for i in range(n // 2 - 1, -1, -1):
    sift(a, i, n)
build = swaps
for _ in range(2):
    a[0] = a[n - 1]
    n -= 1
    sift(a, 0, n)
answer = swaps
ext = swaps - build""",
steps=["Build phase: sift down indices \\(3, 2, 1, 0\\) (the internal nodes of a \\(9\\)-element heap), counting each swap with the larger child; this takes «build» swaps.", "Each extraction places the last element at the root and sifts it down; the two extractions take «ext» swaps.", "Total swaps \\(= «answer»\\)."],
trap="Building the heap by repeated insertion (sift-up), which gives a different heap and a different swap count.", short="Simulate Floyd's method exactly; the heap shape depends on the method.", kind="trace")

# 42 recurrence from a counting problem (MCQ, key C)
K.add(42, r"A transmitter sends binary strings of length \(10\) in which no three consecutive \(0\)s may appear. Let \(a_n\) be the number of valid strings of length \(n\). The value of \(a_{10}\) is",
"""cnt = 0
for x in range(1024):
    s = bin(x)[2:].zfill(10) if False else ''.join('1' if (x >> k) & 1 else '0' for k in range(10))
    if '000' not in s:
        cnt += 1
a = [1, 2, 4]
for n in range(3, 11):
    a.append(a[-1] + a[-2] + a[-3])
val = cnt
rec = a[10]
wrong = [274, 144, 233]""",
steps=["Classify a valid string by its last block of zeros: it ends in \\(1\\), \\(10\\) or \\(100\\), so \\(a_n = a_{n-1} + a_{n-2} + a_{n-3}\\) with \\(a_0 = 1,\\ a_1 = 2,\\ a_2 = 4\\).", "The sequence is \\(1, 2, 4, 7, 13, 24, 44, 81, 149, 274, 504\\) (indices \\(0\\) to \\(10\\)), so \\(a_{10} = «val»\\) (the recurrence gives «rec», and brute force over all \\(1024\\) strings agrees)."],
trap="Stopping one term early (274 is a_9, not a_10), or using the Fibonacci recurrence that forbids two consecutive zeros (144).", short="Condition on how the string ends: the recurrence has three terms.", kind="multi_concept")

# 45 hashing with chaining: average successful search (MCQ, key D)
K.add(45, r"Ten keys \(10, 25, 3, 18, 45, 12, 26, 33, 19, 40\) are inserted in this order into a hash table with \(7\) slots using \(h(k) = k \bmod 7\) and separate chaining (a new key is added at the end of its chain). Each key is then searched for once. The average number of key comparisons for a successful search, correct to three decimal places, is",
"""keys = [10, 25, 3, 18, 45, 12, 26, 33, 19, 40]
ch = {}
for k in keys:
    ch.setdefault(k % 7, []).append(k)
tot = 0
for k in keys:
    tot += ch[k % 7].index(k) + 1
val = round(tot / 10, 3)
wrong = [round(val + 0.2, 3), round(val - 0.3, 3), round(val + 0.5, 3)]
longest = max(len(v) for v in ch.values())""",
steps=["Chains (slot: keys in insertion order): the keys fall into slots by \\(k \\bmod 7\\); the longest chain has «longest» keys.", "A successful search for the \\(j\\)-th key of a chain costs \\(j\\) comparisons, so the total over all ten keys is «tot».", "Average \\(= «tot» / 10 = «val»\\)."],
trap="Averaging chain lengths (unsuccessful search) instead of the position of each key in its chain, or inserting at the head of the chain.", short="Successful search cost = position of the key in its chain.", kind="application")

# 52 stack-sortable permutations (NAT)
K.add(52, r"The numbers \(1, 2, 3, 4, 5, 6\) arrive in some order on an input line. A single stack is available: each arriving number may be pushed, and the top of the stack may be popped to the output at any time. A permutation of \(1, \dots, 6\) is called stack-sortable if some sequence of pushes and pops makes the output \(1, 2, 3, 4, 5, 6\) in that order. The number of stack-sortable permutations is ______.",
"""cnt = 0
for p in itertools.permutations(range(1, 7)):
    st = []
    need = 1
    for x in p:
        st.append(x)
        while st and st[-1] == need:
            st.pop()
            need += 1
    if need == 7:
        cnt += 1
answer = cnt
cat = math.comb(12, 6) // 7""",
steps=["Greedy rule: after each push, pop while the top equals the next number the output needs; if the stack still holds a number when the input ends, the permutation cannot be sorted.", "A permutation is sortable exactly when it avoids the pattern \\(2\\,3\\,1\\) (a larger number buried under a smaller one that is needed first); these permutations are counted by the Catalan number \\(C_6 = \\frac{1}{7}\\binom{12}{6} = «cat»\\).", "So there are «answer» stack-sortable permutations of \\(6\\) numbers."],
trap="Counting all \\(6!\\) permutations or the \\(2^{n-1}\\) permutations from a single pass of the greedy rule without checking the pattern.", short="Stack-sortable permutations avoid 231 and are Catalan-counted.", kind="multi_concept")

# 58 LU decomposition and pivoting (MSQ)
K.add(58, r"Let \(A = \begin{pmatrix} 2 & 4 & 2 \\ 1 & 2 & 3 \\ 3 & 5 & 1 \end{pmatrix}\). Which of the following statements is/are TRUE?",
"""F = fractions.Fraction
A = [[2, 4, 2], [1, 2, 3], [3, 5, 1]]
def nopivot(A):
    M = [[F(x) for x in r] for r in A]
    for c in range(3):
        if M[c][c] == 0:
            return False
        for r in range(c + 1, 3):
            f = M[r][c] / M[c][c]
            M[r] = [M[r][k] - f * M[c][k] for k in range(3)]
    return True
def det_pivot(A):
    M = [[F(x) for x in r] for r in A]
    sign = 1
    for c in range(3):
        p = None
        for r in range(c, 3):
            if M[r][c] != 0:
                p = r
                break
        if p is None:
            return 0
        if p != c:
            M[c], M[p] = M[p], M[c]
            sign = -sign
        for r in range(c + 1, 3):
            f = M[r][c] / M[c][c]
            M[r] = [M[r][k] - f * M[c][k] for k in range(3)]
    return sign * M[0][0] * M[1][1] * M[2][2]
det = (A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]))
dp = det_pivot(A)
truth = [nopivot(A), dp == det, det != 0, det == 0]
detv = int(det)""",
stmts=[r"\(A\) can be factorised as \(LU\) with \(L\) unit lower triangular and \(U\) upper triangular, using no row interchanges.", r"The determinant of \(A\) equals the product of the diagonal entries of \(U\) (from \(PA = LU\) with partial pivoting) multiplied by \((-1)^{s}\), where \(s\) is the number of row swaps.", r"\(A\) is invertible.", r"\(A\) has rank \(2\)."],
steps=["Eliminate below the first pivot \\(2\\): \\(R_2 - \\tfrac12 R_1 = (0, 0, 2)\\) and \\(R_3 - \\tfrac32 R_1 = (0, -1, -2)\\). The second pivot is \\(0\\), so elimination without a row swap breaks down: no \\(LU\\) without interchanges.", "Swapping rows \\(2\\) and \\(3\\) gives the pivots \\(2, -1, 2\\); the determinant is \\((-1)^{1} \\times 2 \\times (-1) \\times 2 = «detv»\\), which agrees with the cofactor expansion (the determinant rule holds with the sign for swaps).", "The determinant is non-zero, so \\(A\\) is invertible and its rank is \\(3\\), not \\(2\\)."],
trap="Reading a zero second pivot as singularity: it only calls for a row swap.", short="A zero pivot needs a swap, not a conclusion about rank; the determinant uses the sign of the swaps.", kind="msq_discriminator")

# 30 unsigned char loop with wrap-around (NAT)
K.add(30, r"The following C fragment is executed on a machine where \(\texttt{unsigned char}\) has \(8\) bits. The value of \(\texttt{count}\) when the loop ends is ______. ```c unsigned char i; int count = 0; for (i = 250; i != 4; i += 3) count++; ```",
"""i = 250
count = 0
guard = 0
while i != 4 and guard < 100000:
    count += 1
    i = (i + 3) % 256
    guard += 1
answer = count
inv = 171""",
steps=["Arithmetic on an unsigned 8-bit variable wraps modulo \\(256\\): after \\(k\\) steps \\(i = (250 + 3k) \\bmod 256\\).", "The loop stops when \\(250 + 3k \\equiv 4 \\pmod{256}\\), that is \\(3k \\equiv 10 \\pmod{256}\\). Since \\(3 \\times 171 = 513 \\equiv 1\\), \\(k \\equiv 10 \\times 171 = 1710 \\equiv 174 \\pmod{256}\\).", "The body runs once per step before the test succeeds: \\(«answer»\\) times. (The value \\(4\\) is reached only after wrapping past \\(255\\).)"],
trap="Assuming the loop never reaches 4 because 250 is above it, or counting only the iterations before the first wrap.", short="Solve 250 + 3k = 4 (mod 256) with the modular inverse of 3.", kind="multi_concept")

# 13 recursion with a pointer parameter (NAT)
K.add(13, r"Consider the C program below. ```c int f(int n, int *c) { if (n < 2) { (*c)++; return n; } return f(n - 1, c) + f(n - 2, c); } int main(void) { int calls = 0; int v = f(9, &calls); /* the value of v + calls is printed */ } ``` The value printed is ______.",
"""calls = 0
def f(n):
    global calls
    if n < 2:
        calls += 1
        return n
    return f(n - 1) + f(n - 2)
v = f(9)
answer = v + calls""",
steps=["\\(v = f(9)\\) is the Fibonacci number \\(F_9 = «v»\\).", "Every call with \\(n < 2\\) is a leaf and increments the shared counter: the number of leaves for \\(f(9)\\) is \\(F_{10} = «calls»\\).", "\\(v + \\text{calls} = «answer»\\)."],
trap="Counting every call (not only the leaves) or treating the counter as a local copy.", short="Leaf count for f(n) is the next Fibonacci number; the pointer shares one counter.", kind="trace")

K.save("p3")
