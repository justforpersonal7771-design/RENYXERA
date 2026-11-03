"""Forge b008 part 1 (slots 0-12). Authored in a local Claude Code session; run: python scripts/forge/author_b008_p1.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b008")

# 0 BST & heaps (MCQ 2, key D)
K.add(0, r"Keys \(15, 22, 9, 30, 12, 27, 5, 18\) are inserted one by one into an initially empty array-based max-heap (each key is placed at the end and moved up while it is larger than its parent). The maximum is then removed twice (each removal moves the last element to the root and sifts it down, swapping with the larger child). The array, from index 1, after the two removals is",
"""H = []
def up(i):
    while i > 0 and H[(i - 1) // 2] < H[i]:
        H[(i - 1) // 2], H[i] = H[i], H[(i - 1) // 2]
        i = (i - 1) // 2
def down(i):
    n = len(H)
    while True:
        l, r, m = 2 * i + 1, 2 * i + 2, i
        if l < n and H[l] > H[m]:
            m = l
        if r < n and H[r] > H[m]:
            m = r
        if m == i:
            return
        H[m], H[i] = H[i], H[m]
        i = m
def extract():
    top = H[0]
    H[0] = H[-1]
    H.pop()
    if H:
        down(0)
    return top
for k in [15, 22, 9, 30, 12, 27, 5, 18]:
    H.append(k)
    up(len(H) - 1)
H0 = list(H)
a = extract()
H1 = list(H)
b = extract()
val = list(H)
wrong = [H1, sorted(val)[::-1], [x for x in H0 if x not in (a, b)]]""",
steps=["Insertions with sift-up give the heap «H0».", "First removal returns «a» and leaves «H1» after the sift-down.", "Second removal returns «b»; the final array is «val»."],
trap="Stopping after one removal, or deleting the two largest keys from the original array without repairing the heap order.",
short="Do each removal separately: last element to the root, then swap with the larger child until the heap order holds.", kind="trace")

# 1 mensuration (MCQ 2, key C)
K.add(1, r"A solid metal cone has base radius \(6\) cm and height \(8\) cm. It is melted and recast into identical solid spheres of radius \(1\) cm, with no loss of metal. The number of spheres obtained is",
"""cone = fractions.Fraction(1, 3) * 36 * 8
sphere = fractions.Fraction(4, 3) * 1
val = int(cone / sphere)
wrong = [int(fractions.Fraction(36 * 8) / sphere), int(cone / (fractions.Fraction(1, 3) * 1)), int(cone / (4 * fractions.Fraction(1, 3) * 2))]""",
steps=["Volume of the cone \\(= \\tfrac13 \\pi r^2 h = \\tfrac13 \\pi \\cdot 36 \\cdot 8 = 96\\pi\\).", "Volume of one sphere \\(= \\tfrac43 \\pi \\cdot 1^3 = \\tfrac43 \\pi\\).", "Number of spheres \\(= 96\\pi \\div \\tfrac43\\pi = «val»\\)."],
trap="Forgetting the factor \\(\\tfrac13\\) in the cone volume (giving 216).", short="Both volumes carry the same \\(\\pi\\): compare \\(\\tfrac13 r^2 h = 96\\) with \\(\\tfrac43 = 1.33\\).", kind="application")

# 2 random variables (MCQ 2, key A)
K.add(2, r"Two fair six-faced dice are thrown and \(X\) is the larger of the two numbers shown. The expected value \(E[X]\), correct to three decimal places, is",
"""tot = 0
mn = 0
for a in range(1, 7):
    for b in range(1, 7):
        tot += max(a, b)
        mn += min(a, b)
val = round(tot / 36, 3)
wrong = [3.5, round(mn / 36, 3), 5.0]""",
steps=["\\(P(X = k) = \\dfrac{2k - 1}{36}\\) for \\(k = 1, \\dots, 6\\), because \\(2k-1\\) of the 36 outcomes have maximum \\(k\\).", "\\(E[X] = \\dfrac{1}{36}\\sum_{k=1}^{6} k(2k-1) = \\dfrac{161}{36} \\approx «val»\\)."],
trap="Using \\(E[\\text{one die}] = 3.5\\), or computing the expected minimum instead.", short="\\(E[\\max] + E[\\min] = 7\\), and \\(E[\\min] = 91/36\\).", kind="numeric_chain")

# 3 MST (MCQ 2, key A)
K.add(3, r"A connected undirected graph has vertices \(0\) to \(6\) and edges (weights in brackets): \(0\text{-}1\,(2)\), \(0\text{-}2\,(2)\), \(1\text{-}2\,(2)\), \(1\text{-}3\,(3)\), \(2\text{-}3\,(3)\), \(3\text{-}4\,(1)\), \(3\text{-}5\,(2)\), \(4\text{-}5\,(2)\), \(5\text{-}6\,(4)\), \(4\text{-}6\,(4)\). The number of distinct minimum spanning trees of this graph is",
"""E = [(0, 1, 2), (0, 2, 2), (1, 2, 2), (1, 3, 3), (2, 3, 3), (3, 4, 1), (3, 5, 2), (4, 5, 2), (5, 6, 4), (4, 6, 4)]
def connected(es):
    par = list(range(7))
    def f(x):
        while par[x] != x:
            x = par[x]
        return x
    for a, b, w in es:
        par[f(a)] = f(b)
    return len(set(f(x) for x in range(7))) == 1
best, cnt = 10 ** 9, 0
for c in itertools.combinations(E, 6):
    if connected(c):
        w = sum(e[2] for e in c)
        if w < best:
            best, cnt = w, 1
        elif w == best:
            cnt += 1
val = cnt
wrong = [12, 18, 36]""",
steps=["Kruskal takes the weight-1 edge, then the weight-2 edges in every possible way that avoids cycles; ties are where different trees appear.", "Enumerating all 6-edge subsets that connect the 7 vertices and keeping those of least weight gives «val» minimum spanning trees (weight «best»)."],
trap="Reporting 1 because the minimum weight is unique; the weight is unique but the tree is not.", short="Count independent tie choices: choosing 2 of the 3 equal edges in a triangle gives 3 ways, and two parallel equal routes give 2 more.", kind="trap_aware")

# 4 CFG (MCQ 2, key B)
K.add(4, r"Consider the context-free grammar \(G: S \to aSb \mid SS \mid \varepsilon\). The number of distinct strings of length \(8\) in \(L(G)\) is",
"""S = set([''])
changed = True
while changed:
    changed = False
    new = set()
    for s in S:
        t = 'a' + s + 'b'
        if len(t) <= 8:
            new.add(t)
    for s in S:
        for t in S:
            if len(s + t) <= 8:
                new.add(s + t)
    if not new <= S:
        S = S | new
        changed = True
val = len([s for s in S if len(s) == 8])
wrong = [16, 70, 42]""",
steps=["\\(L(G)\\) is the set of balanced bracket strings (with \\(a\\) as an opening and \\(b\\) as a closing bracket).", "Generating strings from the rules until nothing new of length at most 8 appears gives «val» strings of length 8, the Catalan number \\(C_4\\)."],
trap="Counting all strings with four a's and four b's (\\(\\binom{8}{4} = 70\\)), which ignores the balance condition.", short="Balanced strings of length \\(2n\\) number \\(\\frac{1}{n+1}\\binom{2n}{n}\\); for \\(n = 4\\) that is 14.", kind="numeric_chain")

# 5 pumping length (MCQ 2, key C)
K.add(5, r"Let \(L = \{ w \in \{a, b\}^* : \text{the number of } a\text{'s in } w \equiv 2 \pmod 4 \}\). The smallest integer \(p\) for which \(L\) satisfies the pumping lemma for regular languages (every \(w \in L\) with \(|w| \ge p\) can be written \(w = xyz\) with \(|xy| \le p\), \(|y| \ge 1\) and \(xy^iz \in L\) for all \(i \ge 0\)) is",
"""def inL(w):
    return w.count('a') % 4 == 2
words = []
for n in range(0, 11):
    for bits in range(2 ** n):
        words.append(''.join('a' if (bits >> j) & 1 else 'b' for j in range(n)))
def ok(p):
    for w in words:
        if len(w) >= p and inL(w):
            good = False
            for i in range(0, p + 1):
                for j in range(i + 1, p + 1):
                    if j <= len(w):
                        x, y, z = w[:i], w[i:j], w[j:]
                        if all(inL(x + y * k + z) for k in range(0, 4)):
                            good = True
            if not good:
                return False
    return True
val = next(p for p in range(1, 9) if ok(p))
wrong = [3, 5, 2]""",
steps=["A pumped piece \\(y\\) must keep the count of a's unchanged modulo 4, so either \\(y\\) contains no a, or it contains a multiple of 4 a's.", "The string \\(a^6 \\in L\\) has no b to pump, so \\(y\\) would have to be a block of 4 a's inside the first \\(p\\) symbols: \\(p \\ge 4\\).", "With \\(p = 4\\) every long enough string works (pump a b, or a block of 4 a's). The smallest valid \\(p\\) is «val», the number of states of the minimal DFA."],
trap="Answering 3 or 2 from short strings such as \\(aa\\) or \\(aab\\), without checking strings like \\(a^6\\).", short="For this kind of language the minimum pumping length equals the number of states of the minimal DFA: 4.", kind="multi_concept")

# 6 canonical LR(1) vs LR(0) (MCQ 2, key D)
K.add(6, r"Consider the grammar \(S' \to S\), \(S \to AA\), \(A \to aA \mid b\). Let \(m\) be the number of states in the canonical LR(1) automaton and \(n\) the number of states in the LR(0) automaton of this (augmented) grammar. The value of \(m - n\) is",
"""G = [('S1', ('S',)), ('S', ('A', 'A')), ('A', ('a', 'A')), ('A', ('b',))]
NT = set(['S1', 'S', 'A'])
FIRST = {'S': set(['a', 'b']), 'A': set(['a', 'b']), 'a': set(['a']), 'b': set(['b'])}
def closure(items, lr1):
    items = set(items)
    ch = True
    while ch:
        ch = False
        for (l, r, d, la) in list(items):
            if d < len(r) and r[d] in NT:
                beta = r[d + 1:]
                las = (FIRST[beta[0]] if beta else set([la])) if lr1 else set([''])
                for (l2, r2) in G:
                    if l2 == r[d]:
                        for x in las:
                            it = (l2, r2, 0, x)
                            if it not in items:
                                items.add(it)
                                ch = True
    return tuple(sorted(items))
def count(lr1):
    start = closure(set([('S1', ('S',), 0, '$' if lr1 else '')]), lr1)
    seen = [start]
    i = 0
    while i < len(seen):
        st = seen[i]
        for X in ['S', 'A', 'a', 'b']:
            nxt = set((l, r, d + 1, la) for (l, r, d, la) in st if d < len(r) and r[d] == X)
            if nxt:
                c = closure(nxt, lr1)
                if c not in seen:
                    seen.append(c)
        i += 1
    return len(seen)
m = count(True)
n = count(False)
val = m - n
wrong = [2, 4, 5]""",
steps=["Building the LR(0) automaton from \\(S' \\to \\cdot S\\) gives \\(n = «n»\\) states.", "In LR(1) the items carry lookaheads, so the two sets that LR(0) merges for \\(A \\to aA\\cdot\\) and \\(A \\to b\\cdot\\) split into copies with lookahead \\(\\{a,b\\}\\) and \\(\\$\\): the canonical LR(1) automaton has \\(m = «m»\\) states.", "\\(m - n = «val»\\)."],
trap="Assuming LR(1) has the same states as LR(0) (difference 0) or confusing it with the LALR(1) automaton, which merges them back to \\(n\\) states.", short="Count the states whose items differ only in lookahead: they merge in LR(0) and LALR(1) but not in canonical LR(1).", kind="multi_concept")

# 7 sequential circuit (MCQ 2, key D)
K.add(7, r"A 4-bit right-shift register \(Q_3Q_2Q_1Q_0\) is clocked synchronously. On each clock the new value of \(Q_3\) is \(Q_0 \oplus Q_1\), and \(Q_2, Q_1, Q_0\) take the old values of \(Q_3, Q_2, Q_1\) respectively. Starting from \(Q_3Q_2Q_1Q_0 = 1000\), the number of clock pulses after which the register first returns to \(1000\) is",
"""s = (1, 0, 0, 0)
n = 0
while True:
    q3, q2, q1, q0 = s
    s = (q0 ^ q1, q3, q2, q1)
    n += 1
    if s == (1, 0, 0, 0):
        break
val = n
wrong = [16, 14, 7]""",
steps=["Apply the rule repeatedly: \\(Q_3' = Q_0 \\oplus Q_1\\), \\(Q_2' = Q_3\\), \\(Q_1' = Q_2\\), \\(Q_0' = Q_1\\).", "The state sequence starting at 1000 returns to 1000 after «val» pulses."],
trap="Answering 16 (all states of a 4-bit register); the all-zero state can never be reached from a non-zero state, so a cycle has at most 15 states.", short="The taps \\(Q_0, Q_1\\) give a maximal-length sequence: \\(2^4 - 1 = 15\\) pulses.", kind="trace")

# 8 rectangle (MCQ 1, key A)
K.add(8, r"A rectangle has a perimeter of \(34\) cm and a diagonal of \(13\) cm. Its area, in square centimetres, is",
"""val = 0
for a in range(1, 17):
    b = 17 - a
    if a * a + b * b == 169:
        val = a * b
wrong = [52, 66, 72]""",
steps=["Let the sides be \\(a, b\\): \\(a + b = 17\\) and \\(a^2 + b^2 = 169\\).", "\\(2ab = (a+b)^2 - (a^2+b^2) = 289 - 169 = 120\\), so \\(ab = «val»\\)."],
trap="Trying to find the sides first (5 and 12) and then mis-multiplying; use the identity instead.", short="\\(ab = \\dfrac{(a+b)^2 - d^2}{2}\\).", kind="application")

# 9 binomial variance (MCQ 1, key D)
K.add(9, r"A random variable \(X\) follows a binomial distribution with \(n = 10\) trials and success probability \(p = 0.3\). The variance of \(X\) is",
"""pmf = [math.comb(10, k) * 0.3 ** k * 0.7 ** (10 - k) for k in range(11)]
mean = sum(k * pmf[k] for k in range(11))
val = round(sum((k - mean) ** 2 * pmf[k] for k in range(11)), 6)
wrong = [3, 0.21, 4.2]""",
steps=["For a binomial variable \\(\\text{Var}(X) = np(1-p) = 10 \\times 0.3 \\times 0.7 = «val»\\).", "Summing \\((k - 3)^2 P(X = k)\\) over \\(k = 0, \\dots, 10\\) confirms the value."],
trap="Reporting the mean \\(np = 3\\) as the variance.", short="\\(npq\\): \\(10 \\times 0.3 \\times 0.7\\).", kind="conceptual")

# 10 serial equivalent (MCQ 2, key A)
K.add(10, r"Three transactions \(T_1, T_2, T_3\) run interleaved in the order \(R_2(Z)\ R_3(Y)\ R_1(X)\ W_3(Z)\ W_1(Y)\ R_2(X)\ W_1(Z)\); here \(R_i(D)\) means \(T_i\) reads item \(D\) and \(W_i(D)\) means \(T_i\) writes it. Exactly one of the serial executions below produces a conflict-equivalent schedule. Which one is it?",
"""S = [(2, 'R', 'Z'), (3, 'R', 'Y'), (1, 'R', 'X'), (3, 'W', 'Z'), (1, 'W', 'Y'), (2, 'R', 'X'), (1, 'W', 'Z')]
edges = set()
for i in range(len(S)):
    for j in range(i + 1, len(S)):
        a, b = S[i], S[j]
        if a[0] != b[0] and a[2] == b[2] and 'W' in (a[1], b[1]):
            edges.add((a[0], b[0]))
def valid(order):
    pos = {t: k for k, t in enumerate(order)}
    return all(pos[a] < pos[b] for a, b in edges)
cands = [(1, 2, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)]
truth = [valid(c) for c in cands]""",
stmts=[r"\(T_1, T_2, T_3\)", r"\(T_2, T_3, T_1\)", r"\(T_3, T_1, T_2\)", r"\(T_3, T_2, T_1\)"],
steps=["Conflicting pairs from different transactions: \\(R_2(Z)\\) before \\(W_3(Z)\\) gives \\(T_2 \\to T_3\\); \\(R_3(Y)\\) before \\(W_1(Y)\\) gives \\(T_3 \\to T_1\\); \\(R_2(Z)\\) and \\(W_3(Z)\\) before \\(W_1(Z)\\) give \\(T_2 \\to T_1\\) and \\(T_3 \\to T_1\\).", "The precedence graph is acyclic with the single topological order \\(T_2, T_3, T_1\\); that is the only conflict-equivalent serial schedule."],
trap="Ordering by the position of each transaction's first operation (which gives \\(T_2, T_3, T_1\\) here only by luck of this schedule); always build the precedence graph.", short="List conflict edges, then topologically sort.", kind="trace")

# 11 two's complement (MCQ 1, key C)
K.add(11, r"The 8-bit two's complement numbers \(\texttt{0x7B}\) and \(\texttt{0x59}\) are added using an 8-bit adder and the 8-bit result is read as a signed number. The value read is",
"""s = (0x7B + 0x59) & 0xFF
val = s - 256 if s >= 128 else s
wrong = [212, 44, -84]""",
steps=["\\(\\texttt{0x7B} = 123\\) and \\(\\texttt{0x59} = 89\\), so the true sum 212 does not fit in 8 bits (maximum 127): signed overflow.", "The adder keeps the low 8 bits, \\(212 - 256\\), which reads as «val»."],
trap="Giving the mathematical sum 212, or its magnitude 44 without the sign.", short="Overflow: two positives give a negative; subtract 256 from the sum.", kind="application")

# 12 non-regular language (MCQ 1, key B)
K.add(12, r"Consider the languages over \(\{a, b\}\): \(L_1 = \{ w : |w| \text{ is divisible by } 3 \}\), \(L_2 = \{ a^m b^n : m, n \ge 0 \}\), \(L_3 = \{ a^n b^n : n \ge 0 \}\), \(L_4 = \{ w : w \text{ ends with } ab \}\). Which one of the following languages is NOT regular?",
"""def inL(k, w):
    if k == 0:
        return len(w) % 3 == 0
    if k == 1:
        return 'ba' not in w
    if k == 2:
        n = len(w) // 2
        return w == 'a' * n + 'b' * n
    return w.endswith('ab')
def words(n):
    out = ['']
    for L in range(1, n + 1):
        for bits in range(2 ** L):
            out.append(''.join('a' if (bits >> j) & 1 else 'b' for j in range(L)))
    return out
def classes(k, N):
    P = words(N)
    S = words(N)
    return len(set(tuple(inL(k, u + v) for v in S) for u in P))
grow = [classes(k, 9) > classes(k, 6) for k in range(4)]
truth = grow""",
stmts=[r"\(L_1\)", r"\(L_2\)", r"\(L_3\)", r"\(L_4\)"],
steps=["A language is regular exactly when it has finitely many Myhill-Nerode classes. \\(L_1\\) has 3, \\(L_2\\) has 3 and \\(L_4\\) has 3 classes.", "For \\(L_3 = \\{a^nb^n\\}\\) the prefixes \\(a^0, a^1, a^2, \\dots\\) are pairwise distinguishable (use the suffix \\(b^n\\)), so the number of classes is unbounded and \\(L_3\\) is not regular."],
trap="Treating \\(L_2 = a^*b^*\\) as non-regular because it looks like \\(a^nb^n\\); it has no matching of counts.", short="Spot the language that compares two unbounded counts.", kind="conceptual")

K.save("p1")
