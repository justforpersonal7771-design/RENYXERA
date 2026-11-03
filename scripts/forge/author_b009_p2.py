"""Forge b009 part 2 (slots 25-49). Authored in a local Claude Code session; run: python scripts/forge/author_b009_p2.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
from forge_snippets import FF
K.use("b009")

# 25 cyclomatic number (NAT 1)
K.add(25, r"A connected undirected simple graph has \(9\) vertices and exactly \(2\) independent cycles (its cycle space has dimension \(2\)). The number of edges in the graph is ______.",
"""n = 9
k = 2
answer = n - 1 + k""",
steps=["A connected graph with \\(n\\) vertices and \\(m\\) edges has cycle-space dimension \\(m - n + 1\\).", "So \\(m = n - 1 + 2 = «answer»\\)."],
trap="Using \\(m = n - 1\\) (a tree) and forgetting that every independent cycle needs one extra edge.", short="Spanning tree (\\(n - 1\\) edges) plus one edge per independent cycle.", kind="conceptual")

# 26 excess-3 (MCQ 2, key D)
K.add(26, r"In the excess-3 binary-coded-decimal code each decimal digit \(d\) is stored as the 4-bit binary value of \(d + 3\). The excess-3 code of the decimal number \(59\) is",
"""def b4(x):
    return ''.join('1' if (x >> k) & 1 else '0' for k in (3, 2, 1, 0))
val = b4(5 + 3) + ' ' + b4(9 + 3)
wrong = [b4(5) + ' ' + b4(9), b4(8) + ' ' + b4(9), b4(9 + 3) + ' ' + b4(5 + 3)]""",
steps=["Digit 5: \\(5 + 3 = 8 = 1000_2\\). Digit 9: \\(9 + 3 = 12 = 1100_2\\).", "The code is «val»."],
trap="Writing plain BCD (0101 1001) or forgetting to add 3 to the second digit.", short="Add 3 to each digit separately, then convert.", kind="application")

# 27 which grammar is LL(1) (MCQ 2, key D)
K.add(27, r"Four grammars (start symbol \(S\)) are given. Exactly one of them is LL(1). Which one?",
FF + """def is_ll1(G, start):
    first, follow, nullable = first_follow(G, start)
    for A in G:
        seen = set()
        for rhs in G[A]:
            f = set()
            nul = True
            for X in rhs:
                f = f | (first[X] if X in G else set([X]))
                if not (nullable[X] if X in G else False):
                    nul = False
                    break
            sel = set(f)
            if nul:
                sel = sel | follow[A]
            if seen & sel:
                return False
            seen = seen | sel
    return True
G1 = {'S': [('a', 'S'), ('a',)]}
G2 = {'S': [('a', 'A')], 'A': [('b', 'A'), ()]}
G3 = {'S': [('S', 'A'), ('a',)], 'A': [('b',)]}
G4 = {'S': [('A', 'B')], 'A': [('a',), ()], 'B': [('a',)]}
truth = [is_ll1(G1, 'S'), is_ll1(G3, 'S'), is_ll1(G4, 'S'), is_ll1(G2, 'S')]""",
stmts=[r"\(S \to aS \mid a\)", r"\(S \to SA \mid a,\ A \to b\)", r"\(S \to AB,\ A \to a \mid \varepsilon,\ B \to a\)", r"\(S \to aA,\ A \to bA \mid \varepsilon\)"],
steps=["The first grammar has two productions that both start with \\(a\\) (needs left factoring); the second is left recursive.", "In the third, \\(A \\to \\varepsilon\\) is chosen on \\(\\text{FOLLOW}(A) = \\{a\\}\\), the same lookahead as \\(A \\to a\\): a conflict.", "In the last, \\(A \\to bA\\) is chosen on \\(b\\) and \\(A \\to \\varepsilon\\) on \\(\\text{FOLLOW}(A) = \\{\\$\\}\\): no clash, so it is LL(1)."],
trap="Forgetting the FOLLOW sets for nullable productions, and so accepting the third grammar.", short="For every nonterminal the lookahead sets of its productions must be disjoint.", kind="trap_aware")

# 28 context switches (NAT 1)
K.add(28, r"Three processes \(P_1, P_2, P_3\) all arrive at time \(0\) in this order with CPU bursts of \(10, 6, 3\) ms. Round-robin scheduling with a time quantum of \(4\) ms is used. Not counting the very first dispatch and the end of the last process, the number of context switches (changes from one running process to a different one) is ______.",
"""rem = [10, 6, 3]
queue = [0, 1, 2]
slices = []
while queue:
    i = queue.pop(0)
    run = min(4, rem[i])
    rem[i] -= run
    slices.append(i)
    if rem[i] > 0:
        queue.append(i)
answer = sum(1 for a, b in zip(slices, slices[1:]) if a != b)
order = ' '.join('P' + str(i + 1) for i in slices)""",
steps=["The time slices run in the order «order».", "Each change between two slices of different processes is a context switch: «answer»."],
trap="Counting the first dispatch or the last completion as switches.", short="Slices minus one, if no two neighbouring slices belong to the same process.", kind="trace")

# 29 reaching definitions (MCQ 1, key D)
K.add(29, r"A flow graph has blocks \(B_1, B_2, B_3, B_4\) with edges \(B_1 \to B_2,\ B_1 \to B_3,\ B_2 \to B_4,\ B_3 \to B_4\). Definitions: \(B_1\): \(d_1: x = 1\) and \(d_2: y = 2\). \(B_2\): \(d_3: x = 3\). \(B_3\): \(d_4: y = 4\) and \(d_5: z = x\). The number of definitions that reach the entry of \(B_4\) is",
"""gen = {1: set(['d1', 'd2']), 2: set(['d3']), 3: set(['d4', 'd5']), 4: set()}
kill = {1: set(), 2: set(['d1']), 3: set(['d2']), 4: set()}
pred = {1: [], 2: [1], 3: [1], 4: [2, 3]}
IN = {b: set() for b in range(1, 5)}
OUT = {b: set() for b in range(1, 5)}
ch = True
while ch:
    ch = False
    for b in range(1, 5):
        i = set()
        for p in pred[b]:
            i = i | OUT[p]
        o = gen[b] | (i - kill[b])
        if i != IN[b] or o != OUT[b]:
            IN[b], OUT[b] = i, o
            ch = True
val = len(IN[4])
ds = ' '.join(sorted(IN[4]))
wrong = [3, 4, 6]""",
steps=["Reaching definitions: \\(\\text{OUT}(B_2) = \\{d_2, d_3\\}\\) (\\(d_3\\) kills \\(d_1\\)) and \\(\\text{OUT}(B_3) = \\{d_1, d_4, d_5\\}\\) (\\(d_4\\) kills \\(d_2\\)).", "\\(\\text{IN}(B_4)\\) is the union: «ds», that is «val» definitions."],
trap="Intersecting the two OUT sets (as for available expressions) instead of taking the union.", short="Reaching definitions use union at the join points.", kind="trace")

# 30 safe sequences (MSQ 2)
K.add(30, r"A system uses the banker's algorithm with four processes and three resource types. Allocation: \(P_0 = (1,1,0),\ P_1 = (2,0,1),\ P_2 = (3,0,2),\ P_3 = (1,1,1)\). Maximum demand: \(P_0 = (4,3,2),\ P_1 = (3,2,2),\ P_2 = (6,0,3),\ P_3 = (2,2,2)\). Available: \((2,2,1)\). Which of the following orders is/are safe sequences?",
"""alloc = [(1, 1, 0), (2, 0, 1), (3, 0, 2), (1, 1, 1)]
mx = [(4, 3, 2), (3, 2, 2), (6, 0, 3), (2, 2, 2)]
need = [[mx[i][k] - alloc[i][k] for k in range(3)] for i in range(4)]
def safe(order):
    work = [2, 2, 1]
    for i in order:
        if any(need[i][k] > work[k] for k in range(3)):
            return False
        work = [work[k] + alloc[i][k] for k in range(3)]
    return True
truth = [safe([1, 3, 0, 2]), safe([3, 1, 2, 0]), safe([0, 1, 2, 3]), safe([2, 3, 1, 0])]""",
stmts=[r"\(P_1, P_3, P_0, P_2\)", r"\(P_3, P_1, P_2, P_0\)", r"\(P_0, P_1, P_2, P_3\)", r"\(P_2, P_3, P_1, P_0\)"],
steps=["Need \\(=\\) Max \\(-\\) Allocation: \\(P_0 = (3,2,2),\\ P_1 = (1,2,1),\\ P_2 = (3,0,0),\\ P_3 = (1,1,1)\\).", "A sequence is safe if each process's need fits in the work vector when its turn comes, and the work vector then grows by its allocation. Checking the four orders one by one in the way just described gives the marked sequences."],
trap="Comparing the maximum demand (instead of the remaining need) with the available resources.", short="Work vector \\(\\ge\\) need at each step, then add that process's allocation.", kind="msq_discriminator")

# 31 parse trees with two operators (MCQ 2, key B)
K.add(31, r"The ambiguous grammar \(E \to E + E \mid E * E \mid \text{id}\) is used to parse the string \(\text{id} + \text{id} * \text{id} + \text{id}\) (four operands, three operators). The number of distinct parse trees for this string is",
"""ops = ['+', '*', '+']
t = {}
def cnt(i, j):
    if i == j:
        return 1
    if (i, j) not in t:
        t[(i, j)] = sum(cnt(i, k) * cnt(k + 1, j) for k in range(i, j))
    return t[(i, j)]
val = cnt(0, 3)
wrong = [2, 3, 14]""",
steps=["Each parse tree corresponds to choosing which operator is the root and then parsing the left and right operands independently.", "For three operators the number of choices is the Catalan number \\(C_3 = «val»\\), whatever the operators are, because the grammar has no precedence rules."],
trap="Using precedence to reduce the count; an ambiguous grammar without precedence rules admits every grouping.", short="Number of full bracketings of \\(n\\) operands: \\(C_{n-1}\\).", kind="multi_concept")

# 32 DFA string count (MCQ 2, key D)
K.add(32, r"A DFA over \(\{0, 1\}\) has states \(q_0\) (start), \(q_1, q_2, q_3\) and the transitions: \(q_0\): on 0 to \(q_0\), on 1 to \(q_1\); \(q_1\): on 0 to \(q_2\), on 1 to \(q_0\); \(q_2\): on 0 to \(q_2\), on 1 to \(q_3\); \(q_3\): on 0 to \(q_1\), on 1 to \(q_3\). The only accepting state is \(q_3\). The number of strings of length \(6\) accepted by the DFA is",
"""delta = {0: (0, 1), 1: (2, 0), 2: (2, 3), 3: (1, 3)}
cnt = {0: 1, 1: 0, 2: 0, 3: 0}
for _ in range(6):
    nxt = {s: 0 for s in range(4)}
    for s, c in cnt.items():
        for sym in (0, 1):
            nxt[delta[s][sym]] += c
    cnt = nxt
val = cnt[3]
wrong = [val - 4, val + 6, val + 10]""",
steps=["Count, for every state, how many strings of the current length lead to it, starting from \\(q_0\\) with one string of length 0, and apply the transitions 6 times.", "The number of length-6 strings that end in \\(q_3\\) is «val»."],
trap="Counting accepting paths of length 6 that merely pass through \\(q_3\\) instead of ending there.", short="Dynamic programming over states: new count of a state = sum over its incoming transitions.", kind="numeric_chain")

# 33 sum of inverse entries (MCQ 1, key D)
K.add(33, r"For the matrix \(A = \begin{pmatrix} 2 & 1 & 0 \\ 1 & 3 & 1 \\ 0 & 1 & 3 \end{pmatrix}\), the sum of all nine entries of \(A^{-1}\) is",
"""A = [[fractions.Fraction(x) for x in r] for r in [[2, 1, 0], [1, 3, 1], [0, 1, 3]]]
b = [fractions.Fraction(1)] * 3
M = [A[i][:] + [b[i]] for i in range(3)]
for c in range(3):
    p = next(r for r in range(c, 3) if M[r][c] != 0)
    M[c], M[p] = M[p], M[c]
    M[c] = [x / M[c][c] for x in M[c]]
    for r in range(3):
        if r != c:
            f = M[r][c]
            M[r] = [M[r][k] - f * M[c][k] for k in range(4)]
x = [M[i][3] for i in range(3)]
s = sum(x)
def show(f):
    if f.denominator == 1:
        return '\\\\(' + str(f.numerator) + '\\\\)'
    sign = '-' if f < 0 else ''
    return '\\\\(' + sign + '\\\\frac{' + str(abs(f.numerator)) + '}{' + str(f.denominator) + '}\\\\)'
dn = s.denominator
val = show(s)
wrong = [show(s + fractions.Fraction(1, dn)), show(s - fractions.Fraction(1, dn)), show(s + fractions.Fraction(2, dn))]
ssum = show(s)""",
steps=["The sum of all entries of \\(A^{-1}\\) equals \\(\\mathbf{1}^{T}A^{-1}\\mathbf{1}\\), the sum of the solution of \\(A\\mathbf{x} = \\mathbf{1}\\).", "Solving \\(A\\mathbf{x} = \\mathbf{1}\\) by elimination gives entries that add up to «ssum»."],
trap="Adding the entries of \\(A\\) or inverting each entry separately.", short="Solve one linear system instead of inverting the whole matrix.", kind="application")

# 34 non-regular language (MCQ 1, key A)
K.add(34, r"Consider the languages \(L_1 = \{ w \in \{a,b\}^* : \#_a(w) - \#_b(w) \text{ is even} \}\), \(L_2 = \{ a^n b^m c^{n+m} : n, m \ge 0 \}\), \(L_3 = \{ a^n b^m : n + m \text{ is even} \}\) and \(L_4 = \{ w \in \{a,b\}^* : w \text{ contains } aba \}\). Exactly one of them is not regular. Which one?",
"""def words(alpha, n):
    out = ['']
    cur = ['']
    for _ in range(n):
        cur = [w + c for w in cur for c in alpha]
        out = out + cur
    return out
def pred(k):
    if k == 0:
        return lambda w: (w.count('a') - w.count('b')) % 2 == 0
    if k == 1:
        def f(w):
            n = len(w) - len(w.lstrip('a'))
            r = w[n:]
            m = len(r) - len(r.lstrip('b'))
            rest = r[m:]
            return rest == 'c' * (n + m)
        return f
    if k == 2:
        def g(w):
            r = w.lstrip('a')
            n = len(w) - len(r)
            m = len(r) - len(r.lstrip('b'))
            return n + m == len(w) and (n + m) % 2 == 0
        return g
    return lambda w: 'aba' in w
def classes(k, N):
    alpha = 'abc' if k == 1 else 'ab'
    W = words(alpha, N)
    p = pred(k)
    return len(set(tuple(p(u + v) for v in W) for u in W))
truth = [classes(k, 6) > classes(k, 4) for k in range(4)]
truth = [truth[1], truth[0], truth[2], truth[3]]""",
stmts=[r"\(L_2\)", r"\(L_1\)", r"\(L_3\)", r"\(L_4\)"],
steps=["\\(L_1\\) and \\(L_3\\) depend only on a parity, and \\(L_4\\) needs only to remember how much of \\(aba\\) has been seen: all three have finitely many Myhill-Nerode classes and are regular.", "\\(L_2\\) must compare the number of \\(c\\)'s with \\(n + m\\): the prefixes \\(a^i\\) (or \\(a^ib^j\\) with different \\(i + j\\)) are pairwise distinguishable, so there are infinitely many classes and \\(L_2\\) is not regular."],
trap="Judging a language by whether it 'counts' something; counting modulo a constant is fine, counting without a bound is not.", short="Parity and substring conditions are regular; matching an unbounded count is not.", kind="conceptual")

# 35 binomial tail (NAT 2)
K.add(35, r"A fair coin is replaced by a biased coin that shows heads with probability \(0.25\). The coin is tossed \(8\) times independently. The probability of getting at least \(2\) heads, correct to two decimal places, is ______.",
"""p = 0.25
n = 8
less = sum(math.comb(n, k) * p ** k * (1 - p) ** (n - k) for k in range(2))
answer = round(1 - less, 2)""",
steps=["\\(P(X = 0) = 0.75^8 \\approx 0.1001\\) and \\(P(X = 1) = 8 \\times 0.25 \\times 0.75^7 \\approx 0.2670\\).", "\\(P(X \\ge 2) = 1 - 0.1001 - 0.2670 \\approx «answer»\\)."],
trap="Computing \\(P(X = 2)\\) only, or \\(P(X > 2)\\).", short="At least 2 is the complement of at most 1.", kind="application")

# 36 cumulative ack (MCQ 1, key A)
K.add(36, r"A TCP receiver expects the first data byte to have sequence number \(1\). It receives, in this order, segments carrying bytes \(1\text{-}500\), \(501\text{-}1000\) and \(1501\text{-}2000\) (the segment with bytes \(1001\text{-}1500\) has been lost or delayed). The acknowledgement number carried by the ACK sent after the third segment arrives is",
"""got = set()
for lo, hi in [(1, 500), (501, 1000), (1501, 2000)]:
    for b in range(lo, hi + 1):
        got.add(b)
nxt = 1
while nxt in got:
    nxt += 1
val = nxt
wrong = [2001, 1501, 501]""",
steps=["TCP acknowledgements are cumulative: the ACK number is the next byte the receiver expects in order.", "Bytes 1-1000 arrived in order; byte 1001 is missing, so the ACK number stays at «val» even though bytes up to 2000 have arrived."],
trap="Acknowledging the highest byte received (2001), which TCP does not do without selective acknowledgements.", short="ACK = first missing byte.", kind="trap_aware")

# 37 branch misprediction CPI (NAT 2)
K.add(37, r"In a pipelined processor \(20\%\) of instructions are conditional branches. A branch predictor is correct for \(90\%\) of the branches; each misprediction costs \(4\) stall cycles and correct predictions cost none. All other instructions flow without stalls. The average cycles per instruction, correct to two decimal places, is ______.",
"""answer = round(1 + 0.20 * 0.10 * 4, 2)""",
steps=["Stall cycles per instruction \\(= 0.20 \\times 0.10 \\times 4 = 0.08\\).", "\\(\\text{CPI} = 1 + 0.08 = «answer»\\)."],
trap="Charging the penalty for every branch (CPI 1.8) rather than only for mispredicted ones.", short="CPI \\(= 1 + f_{\\text{branch}} \\times \\text{miss rate} \\times \\text{penalty}\\).", kind="numeric_chain")

# 38 Johnson counter flip-flops (MCQ 1, key C)
K.add(38, r"A twisted-ring (Johnson) counter is to cycle through exactly \(12\) distinct states. The minimum number of flip-flops it needs is",
"""states = 12
val = states // 2
wrong = [4, 5, 12]""",
steps=["An \\(n\\)-bit Johnson counter has \\(2n\\) distinct states.", "For 12 states: \\(n = 12/2 = «val»\\) flip-flops (a ring counter would need 12)."],
trap="Using \\(\\lceil \\log_2 12 \\rceil = 4\\), which is the size of a binary counter, not of a Johnson counter.", short="Johnson counter: \\(2n\\) states from \\(n\\) flip-flops.", kind="conceptual")

# 39 nested loop count (NAT 1)
K.add(39, r"""The following C fragment is executed. The value of `count` at the end is ______.
```c
int count = 0;
for (int i = 1; i <= 100; i *= 2)
    for (int j = i; j > 0; j /= 2)
        count++;
```""",
"""count = 0
i = 1
while i <= 100:
    j = i
    while j > 0:
        count += 1
        j //= 2
    i *= 2
answer = count""",
steps=["The outer loop runs with \\(i = 1, 2, 4, 8, 16, 32, 64\\).", "For \\(i = 2^k\\) the inner loop halves \\(j\\) from \\(2^k\\) down to 1, which is \\(k + 1\\) iterations: \\(1 + 2 + \\dots + 7 = «answer»\\)."],
trap="Counting \\(\\log^2 100\\) loosely or including \\(i = 128\\) (it exceeds 100).", short="Sum of \\(k + 1\\) for \\(k = 0, \\dots, 6\\).", kind="trace")

# 40 FIFO faults (NAT 2)
K.add(40, r"A process is given \(3\) page frames, initially empty, and uses FIFO page replacement. The page reference string is \(3, 2, 1, 0, 3, 2, 4, 3, 2, 1, 0, 4, 1, 0, 3\). The number of page faults is ______.",
"""refs = [3, 2, 1, 0, 3, 2, 4, 3, 2, 1, 0, 4, 1, 0, 3]
frames = []
faults = 0
for r in refs:
    if r not in frames:
        faults += 1
        if len(frames) == 3:
            frames.pop(0)
        frames.append(r)
answer = faults""",
steps=["Simulate the three frames in arrival order; a page already in a frame causes no fault, otherwise the oldest page is replaced.", "Counting the faults over the 15 references gives «answer»."],
trap="Using LRU (the oldest page is not necessarily the least recently used).", short="Keep the frames in a queue ordered by arrival.", kind="trace")

# 41 LRU faults (NAT 2)
K.add(41, r"With \(3\) initially empty page frames and LRU replacement, the reference string \(3, 2, 1, 0, 3, 2, 4, 3, 2, 1, 0, 4, 1, 0, 3\) is processed. The number of page faults is ______.",
"""refs = [3, 2, 1, 0, 3, 2, 4, 3, 2, 1, 0, 4, 1, 0, 3]
frames = []
faults = 0
for r in refs:
    if r in frames:
        frames.remove(r)
        frames.append(r)
    else:
        faults += 1
        if len(frames) == 3:
            frames.pop(0)
        frames.append(r)
answer = faults""",
steps=["Keep the frames ordered from least to most recently used; on a hit move the page to the end, on a miss evict the front page.", "The number of faults is «answer»."],
trap="Not refreshing the position of a page on a hit, which turns LRU into FIFO.", short="Recency, not arrival order, decides the victim.", kind="trace")

# 42 8-bit adder wrap (NAT 1)
K.add(42, r"An 8-bit adder adds the two's complement numbers \(\texttt{0x9A}\) and \(\texttt{0x8D}\) and discards the carry out of the top bit. The decimal value of the 8-bit result, read as a signed number, is ______.",
"""s = (0x9A + 0x8D) & 0xFF
answer = s - 256 if s >= 128 else s
raw = 0x9A + 0x8D""",
steps=["\\(\\texttt{0x9A} = -102\\) and \\(\\texttt{0x8D} = -115\\), so the true sum \\(-217\\) is below \\(-128\\): signed overflow.", "The adder keeps the low 8 bits of \\(«raw»\\), which read as «answer»."],
trap="Reporting the true sum -217 (not representable in 8 bits).", short="Overflow wraps modulo 256.", kind="application")

# 43 fork wait outputs (MSQ 2)
K.add(43, r"""The following program is run (all system calls succeed, and `wait` blocks until the child has terminated). Which of the following statements is/are TRUE?
```c
int main() {
    if (fork() == 0) {
        printf("A");
    } else {
        wait(NULL);
        printf("B");
    }
    printf("C");
    return 0;
}
```""",
"""outs = set()
child = 'A' + 'C'
parent = 'B' + 'C'
outs.add(child + parent)
truth = ['ACBC' in outs, 'BCAC' in outs, all(o.index('A') < o.index('B') for o in outs), all(o.count('C') == 2 for o in outs)]""",
stmts=[r"The output ACBC is possible.", r"The output BCAC is possible.", r"The letter A is always printed before the letter B.", r"The letter C is printed exactly twice."],
steps=["The child prints A then C and terminates; only then does `wait` return in the parent, which prints B then C. The only possible output is ACBC.", "So ACBC is possible, BCAC is not, A always precedes B, and C appears twice (once from each process)."],
trap="Forgetting that the parent's `wait` forces the child to finish first, which allows only one interleaving.", short="With `wait`, the child's output comes entirely before the parent's.", kind="trace")

# 44 memoryless exponential (NAT 1)
K.add(44, r"The lifetime \(X\) of a component is exponentially distributed with rate \(0.5\) per year. Given that the component has already survived \(2\) years, the probability that it survives at least \(4\) years in total, correct to two decimal places, is ______.",
"""lam = 0.5
answer = round(math.exp(-lam * 2), 2)""",
steps=["The exponential distribution is memoryless: \\(P(X > 4 \\mid X > 2) = P(X > 2)\\).", "\\(P(X > 2) = e^{-0.5 \\times 2} = e^{-1} \\approx «answer»\\)."],
trap="Computing \\(P(X > 4) = e^{-2}\\), which ignores the information that the component has already survived 2 years.", short="Memoryless: the past does not matter.", kind="conceptual")

# 45 C-SCAN (NAT 2)
K.add(45, r"A disk has cylinders \(0\) to \(199\). The head is at cylinder \(50\) moving towards higher numbers. The pending requests are for cylinders \(95, 180, 34, 119, 11, 123, 62, 64\). With C-SCAN scheduling the head serves requests upward, continues to cylinder \(199\), then jumps back to cylinder \(0\) and continues upward (the jump back is counted as a movement of \(199\) cylinders). It stops at the last request. The total head movement in cylinders is ______.",
"""head = 50
reqs = [95, 180, 34, 119, 11, 123, 62, 64]
up = sorted(r for r in reqs if r >= head)
low = sorted(r for r in reqs if r < head)
tot = 0
pos = head
for r in up:
    tot += r - pos
    pos = r
tot += 199 - pos
pos = 199
tot += 199
pos = 0
for r in low:
    tot += r - pos
    pos = r
answer = tot""",
steps=["Upward from 50 to 199: \\(199 - 50 = 149\\). Jump from 199 to 0: 199.", "Then upward from 0 to the last low request 34: 34 more. Total \\(149 + 199 + 34 = «answer»\\)."],
trap="Leaving out the return jump, or stopping the upward sweep at the last request instead of at 199.", short="Add the sweep to the end of the disk, the jump back, and the final partial sweep.", kind="trace")

# 46 linear probing slot (MCQ 2, key C)
K.add(46, r"An open-addressing hash table with \(11\) slots (numbered \(0\) to \(10\)) uses the hash function \(h(k) = k \bmod 11\) and linear probing (next slot, wrapping around). The keys \(22, 33, 44, 55, 47, 58\) are inserted in this order into an empty table. The slot in which the key \(58\) is stored is",
"""T = [None] * 11
pos = {}
for k in [22, 33, 44, 55, 47, 58]:
    i = k % 11
    while T[i] is not None:
        i = (i + 1) % 11
    T[i] = k
    pos[k] = i
val = pos[58]
wrong = [x for x in (0, 1, 2, 3, 4, 5, 6, 7) if x != val][:3]""",
steps=["\\(22, 33, 44, 55\\) all hash to 0, so they occupy slots 0, 1, 2, 3 in turn.", "\\(47 \\bmod 11 = 3\\) is occupied, so 47 goes to slot 4. \\(58 \\bmod 11 = 3\\): slots 3 and 4 are taken, so 58 is stored in slot «val»."],
trap="Forgetting that 47 also hashes to 3 and occupies slot 4 first.", short="Follow each probe sequence one key at a time.", kind="trace")

# 47 variance of sum (MCQ 2, key B)
K.add(47, r"Two fair six-faced dice are thrown independently and \(S\) is the sum of the two numbers shown. The variance of \(S\), correct to three decimal places, is",
"""vals = [a + b for a in range(1, 7) for b in range(1, 7)]
m = sum(vals) / 36
val = round(sum((v - m) ** 2 for v in vals) / 36, 3)
wrong = [round(35 / 12, 3), 35.0, 7.0]""",
steps=["For one die, \\(\\text{Var} = 35/12\\). For independent dice the variances add.", "\\(\\text{Var}(S) = 2 \\times 35/12 = 35/6 \\approx «val»\\)."],
trap="Reporting the variance of one die (2.917) or squaring the standard deviation twice.", short="Variances of independent variables add.", kind="application")

# 48 pumping length for 'contains 101' (MCQ 1, key D)
K.add(48, r"Let \(L = \{ w \in \{0, 1\}^* : w \text{ contains } 101 \text{ as a substring} \}\). The smallest integer \(p\) such that every \(w \in L\) with \(|w| \ge p\) can be written as \(w = xyz\) with \(|xy| \le p\), \(|y| \ge 1\) and \(xy^iz \in L\) for all \(i \ge 0\) is",
"""def inL(w):
    return '101' in w
words = []
for n in range(0, 11):
    for bits in range(2 ** n):
        words.append(''.join('1' if (bits >> j) & 1 else '0' for j in range(n)))
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
steps=["The string \\(101 \\in L\\) has length 3, and removing or repeating any part of it destroys the substring, so \\(p = 3\\) fails.", "With \\(p = «val»\\) every longer string in \\(L\\) has a symbol within the first \\(p\\) positions that can be pumped without breaking an occurrence of 101. The smallest such \\(p\\) is «val»."],
trap="Answering 3, the length of the pattern, which fails on \\(101\\) itself.", short="The minimum pumping length equals the number of states of the minimal DFA.", kind="multi_concept")

# 49 quadruples after CSE (MCQ 1, key C)
K.add(49, r"A compiler translates \((x + y) * (x + y) + (x + y) * z\) into three-address code and applies local common-subexpression elimination, so \(x + y\) is computed only once. The number of three-address instructions (assignments to temporaries) in the optimised code is",
"""instrs = []
seen = {}
def op(o, a, b):
    key = (o, a, b)
    if key not in seen:
        seen[key] = 't' + str(len(seen) + 1)
        instrs.append(key)
    return seen[key]
t1 = op('+', 'x', 'y')
t2 = op('*', t1, t1)
t3 = op('*', t1, 'z')
t4 = op('+', t2, t3)
val = len(instrs)
wrong = [3, 5, 6]""",
steps=["After elimination: \\(t_1 = x + y\\); \\(t_2 = t_1 * t_1\\); \\(t_3 = t_1 * z\\); \\(t_4 = t_2 + t_3\\).", "That is «val» instructions (without the optimisation there would be 6)."],
trap="Counting 6 (no elimination) or 5 (eliminating only one of the three occurrences).", short="One instruction per distinct operator application.", kind="application")

K.save("p2")
