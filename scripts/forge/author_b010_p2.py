"""Forge b010 part 2 (designed batch). Run: python scripts/forge/author_b010_p2.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b010")

# 46 demand paging: TLB + page table + clean/dirty victims (NAT)
K.add(46, r"A demand-paged system has a single-level page table in memory. A TLB lookup takes \(5\) ns and a memory access takes \(100\) ns; the TLB is searched first and has a hit ratio of \(0.95\). On a TLB miss the page table is read from memory (one extra memory access) before the data access. In addition, a fraction \(10^{-5}\) of all memory references cause a page fault. Servicing a fault takes \(8\) ms when the victim page is clean and \(20\) ms when it is dirty; \(30\%\) of victims are dirty. The effective access time, in nanoseconds and correct to the nearest whole number, is ______.",
"""hit = 5 + 100
miss = 5 + 100 + 100
base = 0.95 * hit + 0.05 * miss
fault = 0.7 * 8e6 + 0.3 * 20e6
p = 1e-5
answer = round((1 - p) * base + p * fault, 2)
fault_ms = fault / 1e6""",
steps=["Without faults: TLB hit \\(5 + 100 = 105\\) ns, TLB miss \\(5 + 100 + 100 = 205\\) ns, so \\(0.95 \\times 105 + 0.05 \\times 205 = «base»\\) ns.", "Average fault service time \\(= 0.7 \\times 8 + 0.3 \\times 20 = «fault_ms»\\) ms \\(= 1.16 \\times 10^{7}\\) ns.", "\\(\\text{EAT} = (1 - 10^{-5}) \\times «base» + 10^{-5} \\times 1.16 \\times 10^{7} \\approx «answer»\\) ns: the rare faults add more than the whole fault-free time."],
trap="Treating the fault service time in milliseconds as if it were nanoseconds, or ignoring the dirty-victim mix.", short="EAT = (1 - p) x (TLB-weighted access) + p x (weighted fault time), all in the same unit.", kind="multi_concept")

# 55 cache misses over a matrix-multiply access stream (NAT)
K.add(55, r"The product \(C = A \times B\) of two \(8 \times 8\) matrices of \(4\)-byte integers is computed by the loops \(i, j, k\) (outermost to innermost) with the statement \(C[i][j] \mathrel{+}= A[i][k] \times B[k][j]\); only the reads of \(A\) and \(B\) go through a data cache (\(C\) is kept in a register). Both matrices are stored row by row, \(A\) from byte address \(0\) and \(B\) from byte address \(256\). The cache is direct-mapped with \(8\) lines of \(32\) bytes and is initially empty. The total number of cache misses is ______.",
"""cache = [-1] * 8
miss = 0
for i in range(8):
    for j in range(8):
        for k in range(8):
            for addr in (4 * (i * 8 + k), 256 + 4 * (k * 8 + j)):
                blk = addr // 32
                s = blk % 8
                if cache[s] != blk:
                    cache[s] = blk
                    miss += 1
answer = miss""",
steps=["Each \\(32\\)-byte line holds \\(8\\) integers; \\(A\\) occupies lines \\(0\\) to \\(7\\) of memory and \\(B\\) lines \\(8\\) to \\(15\\), so \\(A\\)'s row \\(i\\) (line \\(i\\)) and \\(B\\)'s row \\(i\\) (line \\(8 + i\\)) fight for the same cache line \\(i\\).", "In the innermost loop \\(A[i][k]\\) sits in the line of row \\(i\\) while \\(B[k][j]\\) moves down a column through all \\(8\\) lines; each \\(B\\) access evicts \\(A\\)'s row line when \\(k = i\\) and every other step brings in a fresh \\(B\\) line.", "Simulating all \\(512\\) iterations with the direct-mapped rule (line \\(= \\text{block} \\bmod 8\\)) gives «answer» misses."],
trap="Using the hit pattern of a single matrix (row access hits 7 of 8) and forgetting that the two matrices map to the same cache lines.", short="Trace both address streams through the direct-mapped mapping; the column walk of B conflicts with A.", kind="trace")

# 36 schedule classification with commits (MSQ)
K.add(36, r"The log of a three-user session on a bank database lists, in time order: user 1 reads then writes account \(A\); user 2 reads \(A\) and writes account \(B\); user 1 commits; user 3 reads \(B\); user 2 commits; user 3 commits. In shorthand the history is \(S: R_1(A)\ W_1(A)\ R_2(A)\ W_2(B)\ C_1\ R_3(B)\ C_2\ C_3\), where \(C_k\) is the commit of user \(k\). Pick every correct claim.",
"""ops = [(1, 'R', 'A'), (1, 'W', 'A'), (2, 'R', 'A'), (2, 'W', 'B'), (1, 'C', None), (3, 'R', 'B'), (2, 'C', None), (3, 'C', None)]
def csr(ops):
    edges = set()
    for x in range(len(ops)):
        for y in range(x + 1, len(ops)):
            a, b = ops[x], ops[y]
            if a[0] != b[0] and a[1] != 'C' and b[1] != 'C' and a[2] == b[2] and 'W' in (a[1], b[1]):
                edges.add((a[0], b[0]))
    nodes = set([1, 2, 3])
    while True:
        free = [n for n in nodes if not any(e[1] == n and e[0] in nodes for e in edges)]
        if not free:
            break
        nodes.remove(free[0])
    return len(nodes) == 0
def info(ops):
    commit = {}
    for idx, o in enumerate(ops):
        if o[1] == 'C':
            commit[o[0]] = idx
    rf = []
    for idx, o in enumerate(ops):
        if o[1] == 'R':
            w = None
            for y in range(idx):
                if ops[y][1] == 'W' and ops[y][2] == o[2]:
                    w = ops[y][0]
            if w is not None and w != o[0]:
                rf.append((w, o[0], idx))
    return commit, rf
def recoverable(ops):
    commit, rf = info(ops)
    return all(commit[w] < commit[t] for w, t, j in rf)
def cascadeless(ops):
    commit, rf = info(ops)
    return all(commit[w] < j for w, t, j in rf)
ops2 = list(ops)
ops2[4], ops2[6] = ops2[6], ops2[4]
truth = [csr(ops), recoverable(ops), cascadeless(ops), not recoverable(ops2)]""",
stmts=[r"\(S\) is conflict serializable.", r"\(S\) is recoverable.", r"\(S\) is cascadeless (avoids cascading aborts).", r"If the positions of \(C_1\) and \(C_2\) were swapped (nothing else changed), the schedule would not be recoverable."],
steps=["Conflict graph: \\(W_1(A)\\) before \\(R_2(A)\\) gives \\(T_1 \\to T_2\\); \\(W_2(B)\\) before \\(R_3(B)\\) gives \\(T_2 \\to T_3\\). No cycle, so the schedule is conflict serializable (order \\(T_1, T_2, T_3\\)).", "\\(T_2\\) reads \\(A\\) written by \\(T_1\\) and \\(T_3\\) reads \\(B\\) written by \\(T_2\\); each writer commits before its reader (\\(C_1\\) before \\(C_2\\) before \\(C_3\\)), so the schedule is recoverable.", "But both reads happen before the writer commits (\\(R_2(A)\\) precedes \\(C_1\\), \\(R_3(B)\\) precedes \\(C_2\\)): dirty reads, so it is not cascadeless.", "Swapping the two commits makes \\(T_2\\) commit before \\(T_1\\) although it read \\(T_1\\)'s write: not recoverable."],
trap="Mixing up recoverable (commit order of reader and writer) with cascadeless (no read of uncommitted data).", short="Serializability = acyclic conflict graph; recoverability = readers commit after writers; cascadelessness = no dirty reads.", kind="msq_discriminator")

# 41 minimal DFA: binary value divisible by 5 and even length (MCQ, key B)
K.add(41, r"A hardware checker reads a stream of bits, the first bit being the most significant, and must raise a valid flag after a prefix exactly when the number formed so far is a multiple of \(5\) and an even number of bits has been consumed (reading no bits means the number \(0\)). A deterministic machine with a transition defined for every state and input bit is to produce the flag. The smallest possible number of states of such a machine is",
"""def words(n):
    out = ['']
    cur = ['']
    for _ in range(n):
        cur = [w + c for w in cur for c in '01']
        out = out + cur
    return out
W = words(8)
def pred(w):
    v = 0
    for ch in w:
        v = v * 2 + int(ch)
    return v % 5 == 0 and len(w) % 2 == 0
val = len(set(tuple(pred(u + v) for v in W) for u in W))
wrong = [val - 1, val + 1, val + 2]""",
steps=["Divisibility by \\(5\\) needs the remainder of the value so far (\\(5\\) states, update \\(r \\to 2r + b \\bmod 5\\)); the length parity needs \\(2\\) states: at most \\(5 \\times 2 = 10\\).", "All pairs of these product states are reachable and no suffix merges them, so the minimal DFA has «val» states."],
trap="Adding the component sizes (5 + 2) instead of multiplying them for an intersection, or assuming two product states merge.", short="Independent conditions multiply; then check reachability and distinguishability.", kind="multi_concept")

# 56 Bayes with two conditionally independent tests (MSQ)
K.add(56, r"A condition affects \(2\%\) of a population. Test \(T_1\) is positive for \(90\%\) of affected and \(5\%\) of unaffected people. Test \(T_2\) is positive for \(80\%\) of affected and \(10\%\) of unaffected people. Given the person's true status, the two tests are independent. A randomly chosen person is tested with both. Which of the following statements is/are TRUE?",
"""p = 0.02
s1, f1 = 0.9, 0.05
s2, f2 = 0.8, 0.10
a = p * s1 / (p * s1 + (1 - p) * f1)
b = p * s1 * s2 / (p * s1 * s2 + (1 - p) * f1 * f2)
c = p * s1 * (1 - s2) / (p * s1 * (1 - s2) + (1 - p) * f1 * (1 - f2))
pt1 = p * s1 + (1 - p) * f1
pt2 = p * s2 + (1 - p) * f2
pboth = p * s1 * s2 + (1 - p) * f1 * f2
truth = [a > 0.25, b > 0.6, c < 0.02, abs(pboth - pt1 * pt2) < 1e-9]
pa = round(a, 3)
pb = round(b, 3)
pc = round(c, 3)""",
stmts=[r"The probability of the condition given only that \(T_1\) is positive exceeds \(0.25\).", r"The probability of the condition given that both tests are positive exceeds \(0.6\).", r"The probability of the condition given \(T_1\) positive and \(T_2\) negative is below \(0.02\).", r"The two test results are independent of each other when the person's status is not known."],
steps=["\\(P(D \\mid T_1^+) = 0.018 / (0.018 + 0.049) \\approx «pa»\\), above \\(0.25\\).", "\\(P(D \\mid T_1^+ T_2^+) = 0.0144 / (0.0144 + 0.0049) \\approx «pb»\\), above \\(0.6\\).", "\\(P(D \\mid T_1^+ T_2^-) = 0.0036 / (0.0036 + 0.0441) \\approx «pc»\\), well above \\(0.02\\), so the third statement is false.", "The tests are independent only given the status; unconditionally both depend on the status, so \\(P(T_1^+ T_2^+) \\ne P(T_1^+)P(T_2^+)\\)."],
trap="Applying the independence of the tests without conditioning on the status, or reading a low prior as a low posterior.", short="Multiply the likelihoods under each status, then normalise.", kind="msq_discriminator")

# 31 candidate keys of a relation with two cyclic FD clusters (NAT)
K.add(31, r"A table has seven columns named \(A\) to \(G\). The business rules are: the value of \(A\) fixes \(B\); the value of \(B\) fixes \(C\); the value of \(C\) fixes \(A\); the value of \(D\) fixes \(E\); the value of \(E\) fixes \(D\); and \(C\) and \(D\) together fix \(G\). No rule ever determines column \(F\). Counting every smallest set of columns that identifies a row uniquely, with no smaller subset doing so, the table has ______ such sets (candidate keys).",
"""attrs = 'ABCDEFG'
fds = [('A', 'B'), ('B', 'C'), ('C', 'A'), ('D', 'E'), ('E', 'D'), ('CD', 'G')]
def closure(x):
    s = set(x)
    ch = True
    while ch:
        ch = False
        for l, r in fds:
            if set(l) <= s and not set(r) <= s:
                s |= set(r)
                ch = True
    return s
keys = []
for n in range(1, 8):
    for comb in itertools.combinations(attrs, n):
        if closure(comb) == set(attrs) and not any(set(k) <= set(comb) for k in keys):
            keys.append(comb)
answer = len(keys)""",
steps=["\\(F\\) appears on no right-hand side, so it is in every key. \\(A, B, C\\) determine one another (a cycle), and so do \\(D, E\\).", "A key needs \\(F\\), one of \\(\\{A, B, C\\}\\) and one of \\(\\{D, E\\}\\); then \\(CD \\to G\\) supplies \\(G\\) through the closure. That is \\(3 \\times 2 = «answer»\\) keys, and no proper subset of any of them works."],
trap="Stopping at the first key found instead of letting every member of each cycle stand in for the others.", short="Attributes never on a right-hand side are in every key; each cycle contributes a free choice.", kind="multi_concept")

# 49 TCP Reno window evolution (NAT)
K.add(49, r"A TCP sender starts with a congestion window of \(1\) segment and a slow-start threshold of \(16\) segments. In every round-trip time (RTT) it sends a number of segments equal to the current window. At the end of an RTT with no loss the window doubles in slow start (but never above the threshold) and grows by \(1\) segment once it is at or above the threshold. At the end of the \(7\)th RTT three duplicate acknowledgements arrive: the threshold is set to half the current window (rounded down) and the window to the new threshold. At the end of the \(10\)th RTT a timeout occurs: the threshold is again set to half the current window (rounded down) and the window to \(1\). The total number of segments sent in the first \(14\) RTTs is ______.",
"""cwnd = 1
ss = 16
total = 0
for r in range(1, 15):
    total += cwnd
    if r == 7:
        ss = cwnd // 2
        cwnd = ss
    elif r == 10:
        ss = cwnd // 2
        cwnd = 1
    elif cwnd < ss:
        cwnd = min(2 * cwnd, ss)
    else:
        cwnd += 1
answer = total""",
steps=["Windows per RTT: \\(1, 2, 4, 8, 16\\) (slow start up to the threshold), then \\(17, 18\\) (additive increase): \\(66\\) segments in RTTs \\(1\\) to \\(7\\).", "After the triple duplicate acknowledgement the threshold and window become \\(9\\): RTTs \\(8\\) to \\(10\\) send \\(9, 10, 11 = 30\\).", "After the timeout the threshold is \\(5\\) and the window \\(1\\): RTTs \\(11\\) to \\(14\\) send \\(1, 2, 4, 5 = 12\\) (the doubling is capped at the threshold \\(5\\)).", "Total \\(= «answer»\\) segments."],
trap="Resetting the window to 1 after the triple duplicate acknowledgement (that is the timeout rule), or letting slow start overshoot the threshold.", short="Simulate RTT by RTT, applying the rule that matches each event.", kind="trace")

# 17 groups from modular multiplication (MSQ)
K.add(17, r"For a positive integer \(n\), let \(U_n\) denote the set of integers in \(\{1, \dots, n - 1\}\) that are coprime to \(n\), with multiplication modulo \(n\). Which of the following statements is/are TRUE?",
"""def units(n):
    return [x for x in range(1, n) if math.gcd(x, n) == 1]
def order(x, n):
    k = 1
    v = x % n
    while v != 1:
        v = v * x % n
        k += 1
    return k
def cyclic(n):
    u = units(n)
    return any(order(x, n) == len(u) for x in u)
def cnt2(n):
    return sum(1 for x in units(n) if order(x, n) == 2)
def group_mod(n):
    for x in range(n):
        if not any(x * y % n == 1 for y in range(n)):
            return False
    return True
truth = [cyclic(10), cyclic(12), cnt2(15) == 3, group_mod(6)]""",
stmts=[r"\(U_{10}\) is a cyclic group.", r"\(U_{12}\) is a cyclic group.", r"\(U_{15}\) has exactly \(3\) elements of order \(2\).", r"The set \(\{0, 1, 2, 3, 4, 5\}\) with multiplication modulo \(6\) is a group."],
steps=["\\(U_{10} = \\{1, 3, 7, 9\\}\\): the element \\(3\\) has order \\(4\\) (\\(3, 9, 7, 1\\)), so the group is cyclic.", "\\(U_{12} = \\{1, 5, 7, 11\\}\\): every element squares to \\(1\\), so no element has order \\(4\\) and the group is not cyclic.", "\\(U_{15} \\cong U_3 \\times U_5\\), of order \\(8\\); its elements of order \\(2\\) are \\(4, 11, 14\\): exactly three.", "In \\(\\{0, \\dots, 5\\}\\) under multiplication mod \\(6\\), \\(0\\) has no inverse (and neither do \\(2, 3, 4\\)), so it is not a group."],
trap="Assuming every group of units is cyclic, or including non-invertible elements in the set.", short="Check the element orders against the group order; remember zero divisors have no inverse.", kind="msq_discriminator")

K.save("p2")
