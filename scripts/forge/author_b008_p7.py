"""Forge b008 part 7 (slots 105-129). Authored in a local Claude Code session; run: python scripts/forge/author_b008_p7.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b008")

# 105 dynamic programming facts (MSQ 2)
K.add(105, r"Four claims are made about classic dynamic-programming problems. Select every claim that is correct.",
"""def lcs(a, b):
    t = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            t[i][j] = t[i - 1][j - 1] + 1 if a[i - 1] == b[j - 1] else max(t[i - 1][j], t[i][j - 1])
    return t[-1][-1]
def knap(cap, w, v):
    best = [0] * (cap + 1)
    for i in range(len(w)):
        for c in range(cap, w[i] - 1, -1):
            best[c] = max(best[c], best[c - w[i]] + v[i])
    return best[cap]
def edit(a, b):
    d = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(len(a) + 1):
        d[i][0] = i
    for j in range(len(b) + 1):
        d[0][j] = j
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] != b[j - 1]))
    return d[-1][-1]
def lis(x):
    best = [1] * len(x)
    for i in range(len(x)):
        for j in range(i):
            if x[j] < x[i]:
                best[i] = max(best[i], best[j] + 1)
    return max(best)
l1 = lcs('ABCBDAB', 'BDCABA')
k1 = knap(10, [5, 4, 6, 3], [10, 40, 30, 50])
e1 = edit('kitten', 'sitting')
s1 = lis([5, 2, 8, 6, 3, 6, 9, 7])
truth = [l1 == 4, k1 == 90, e1 == 4, s1 == 5]""",
stmts=[r"The longest common subsequence of ABCBDAB and BDCABA has length 4.", r"For a 0/1 knapsack of capacity 10 with weights \((5, 4, 6, 3)\) and values \((10, 40, 30, 50)\), the maximum value is 90.", r"The edit distance (insertions, deletions, substitutions) between kitten and sitting is 4.", r"The longest strictly increasing subsequence of \(5, 2, 8, 6, 3, 6, 9, 7\) has length 5."],
steps=["Filling the tables gives LCS length «l1», knapsack optimum «k1» (items of weight 3 and 4), edit distance «e1» (two substitutions and one insertion) and LIS length «s1» (for example 2, 3, 6, 9).", "So the first two claims hold; the edit distance is not 4 and the longest increasing subsequence is not 5."],
trap="Counting the edit distance with substitutions costing 2, or taking a non-strict increasing subsequence.", short="Fill each table once; do not trust a remembered textbook value.", kind="msq_discriminator")

# 106 markup and discount (MCQ 1, key C)
K.add(106, r"A trader marks up the cost price of an article by \(40\%\) and then allows a discount of \(25\%\) on the marked price. The profit percentage on the cost price is",
"""cost = 100
marked = cost * 1.40
sell = marked * 0.75
val = round((sell - cost) / cost * 100, 1)
wrong = [15.0, 10.0, 0.0]""",
steps=["Take the cost as 100: marked price \\(= 140\\); selling price \\(= 0.75 \\times 140 = 105\\).", "Profit \\(= 5\\) on a cost of 100: «val» %."],
trap="Subtracting the percentages (\\(40 - 25 = 15\\)); the discount is on the marked price, not on the cost.", short="\\(1.4 \\times 0.75 = 1.05\\).", kind="application")

# 107 counting semaphore (MCQ 1, key C)
K.add(107, r"A counting semaphore \(S\) is initialised to \(3\). Processes execute the operations wait(S) and signal(S) in this global order: wait, wait, wait, wait, signal, wait, wait, signal. A process that finds the semaphore value not positive blocks, and a signal wakes one blocked process (if any). After all eight operations, the number of processes that are blocked is",
"""s = 3
ops = ['w', 'w', 'w', 'w', 's', 'w', 'w', 's']
for o in ops:
    s += -1 if o == 'w' else 1
val = max(0, -s)
final = s
wrong = [0, 2, 3]""",
steps=["Let the semaphore value go negative to count blocked processes: start at 3; each wait subtracts 1, each signal adds 1.", "Net change \\(= -(6) + 2 = -4\\), so the value ends at «final»; a value of \\(-k\\) means \\(k\\) blocked processes: «val»."],
trap="Forgetting that signals first wake blocked processes instead of raising the value.", short="Final value \\(= 3 - \\#\\text{waits} + \\#\\text{signals}\\); negative values count the blocked.", kind="trace")

# 108 labelled trees (NAT 1)
K.add(108, r"The number of distinct spanning trees of the complete graph \(K_7\) on seven labelled vertices, which equals the number of labelled trees on seven vertices, is ______.",
"""n = 7
L = [[fractions.Fraction(n - 1) if i == j else fractions.Fraction(-1) for j in range(n)] for i in range(n)]
M = [row[1:] for row in L[1:]]
m = n - 1
d = fractions.Fraction(1)
for i in range(m):
    p = next(r for r in range(i, m) if M[r][i] != 0)
    if p != i:
        M[i], M[p] = M[p], M[i]
        d = -d
    d = d * M[i][i]
    for r in range(i + 1, m):
        f = M[r][i] / M[i][i]
        M[r] = [M[r][k] - f * M[i][k] for k in range(m)]
answer = int(d)""",
steps=["By Cayley's formula there are \\(n^{n-2}\\) labelled trees on \\(n\\) vertices.", "For \\(n = 7\\): \\(7^5 = «answer»\\) (the matrix-tree theorem gives the same value)."],
trap="Using \\(n^{n-1}\\) or \\((n-1)!\\).", short="\\(n^{n-2}\\).", kind="conceptual")

# 109 MST weight (MCQ 1, key A)
K.add(109, r"A utility company must connect six sites \(A, \dots, F\) with the least total cable. The possible cable routes and their lengths in km are: AB 4, AC 3, BC 1, BD 2, CD 4, DE 2, CE 5, EF 3, DF 6. Using only these routes, the shortest total length of cable that keeps all six sites connected is, in km,",
"""E = [('A', 'B', 4), ('A', 'C', 3), ('B', 'C', 1), ('B', 'D', 2), ('C', 'D', 4), ('D', 'E', 2), ('C', 'E', 5), ('E', 'F', 3), ('D', 'F', 6)]
par = {v: v for v in 'ABCDEF'}
def f(x):
    while par[x] != x:
        x = par[x]
    return x
val = 0
picked = []
for a, b, w in sorted(E, key=lambda e: e[2]):
    if f(a) != f(b):
        par[f(a)] = f(b)
        val += w
        picked.append(a + b)
wrong = [12, 10, 13]
pk = ', '.join(picked)""",
steps=["Kruskal: sort the edges and add each one that does not close a cycle: «pk».", "The five chosen edges weigh «val» in total."],
trap="Taking the lightest edge at every vertex (which can create a cycle) instead of running Kruskal or Prim.", short="Five edges for six vertices: 1 + 2 + 2 + 3 + 3.", kind="application")

# 110 number of parse trees (MCQ 1, key C)
K.add(110, r"Consider the ambiguous grammar \(S \to SS \mid a\). The number of distinct parse trees for the string \(aaaaaa\) (six a's) is",
"""t = {1: 1}
for n in range(2, 7):
    t[n] = sum(t[k] * t[n - k] for k in range(1, n))
val = t[6]
wrong = [14, 32, 132]""",
steps=["Let \\(t(n)\\) be the number of parse trees for \\(a^n\\): \\(t(1) = 1\\) and \\(t(n) = \\sum_{k=1}^{n-1} t(k)\\,t(n-k)\\) (choose where the top \\(SS\\) splits).", "This gives \\(1, 1, 2, 5, 14, «val»\\) for \\(n = 1, \\dots, 6\\): Catalan numbers."],
trap="Confusing the number of strings (one) with the number of parse trees, or using \\(C_4 = 14\\) (that is for five a's).", short="Parse trees of \\(a^n\\) number \\(C_{n-1}\\).", kind="multi_concept")

# 111 total bytes with fragment headers (MCQ 1, key B)
K.add(111, r"A host sends one datagram with \(5000\) bytes of data plus a \(20\)-byte header over a link with an MTU of \(1500\) bytes. Counting every fragment with its own \(20\)-byte header, the total number of bytes sent on the link is",
"""data = 5000
per = (1500 - 20) // 8 * 8
n = -(-data // per)
val = data + 20 * n
wrong = [5020, 5060, 5100]""",
steps=["Each fragment carries at most 1480 data bytes: \\(\\lceil 5000/1480 \\rceil = 4\\) fragments.", "Total bytes \\(= 5000 + 4 \\times 20 = «val»\\)."],
trap="Adding only one header (5020).", short="Data plus one header per fragment.", kind="application")

# 112 Myhill-Nerode state counts (MSQ 1)
K.add(112, r"Four regular languages over \(\{0, 1\}\) are given. Which of the following claims about the number of states of their minimal complete DFAs is/are TRUE?",
"""def words(n):
    out = ['']
    for L in range(1, n + 1):
        for bits in range(2 ** L):
            out.append(''.join('1' if (bits >> j) & 1 else '0' for j in range(L)))
    return out
W = words(6)
def classes(pred):
    return len(set(tuple(pred(u + v) for v in W) for u in W))
L1 = lambda w: len(w) >= 3 and w[-3] == '1'
L2 = lambda w: w.endswith('11')
L3 = lambda w: '01' in w
L4 = lambda w: w.endswith('00')
c1, c2, c3, c4 = classes(L1), classes(L2), classes(L3), classes(L4)
truth = [c1 == 8, c2 == 3, c3 == 3, c4 == 4]""",
stmts=[r"'The third symbol from the right end is 1' needs 8 states.", r"'The string ends with 11' needs 3 states.", r"'The string contains 01 as a substring' needs 3 states.", r"'The string ends with 00' needs 4 states."],
steps=["The minimal DFA needs one state per Myhill-Nerode class: the DFA must remember the last 3 symbols for the first language (8 states), the length of the current suffix of 1s (0, 1, 2 or more) for the second (3), and whether 0, then 01 has been seen for the third (3).", "'Ends with 00' needs only the number of trailing zeros up to 2: 3 states, not 4."],
trap="Assuming the number of states is the length of the pattern plus one for every language.", short="Ask what the automaton must remember about the past.", kind="msq_discriminator")

# 113 live variables (MCQ 2, key B)
K.add(113, r"A control-flow graph has blocks \(B_1, B_2, B_3, B_4\) with edges \(B_1 \to B_2,\ B_1 \to B_3,\ B_2 \to B_4,\ B_3 \to B_4\). The blocks contain: \(B_1\): a = 1; b = 2; c = 3. \(B_2\): d = a + b. \(B_3\): e = b + c. \(B_4\): print(d + e). Using live-variable analysis, the number of variables live at the exit of \(B_1\) is",
"""use = {1: set(), 2: set('ab'), 3: set('bc'), 4: set('de')}
dfn = {1: set('abc'), 2: set('d'), 3: set('e'), 4: set()}
succ = {1: [2, 3], 2: [4], 3: [4], 4: []}
live_in = {b: set() for b in range(1, 5)}
live_out = {b: set() for b in range(1, 5)}
ch = True
while ch:
    ch = False
    for b in range(1, 5):
        out = set()
        for s in succ[b]:
            out = out | live_in[s]
        inn = use[b] | (out - dfn[b])
        if out != live_out[b] or inn != live_in[b]:
            live_out[b], live_in[b] = out, inn
            ch = True
val = len(live_out[1])
lv = ''.join(sorted(live_out[1]))
wrong = [3, 4, 6]""",
steps=["Work backwards: \\(\\text{live-in}(B_4) = \\{d, e\\}\\). \\(\\text{live-in}(B_2) = \\{a, b, e\\}\\) (uses \\(a, b\\); \\(e\\) passes through) and \\(\\text{live-in}(B_3) = \\{b, c, d\\}\\).", "\\(\\text{live-out}(B_1)\\) is the union of the live-in sets of its successors: \\(\\{«lv»\\}\\), «val» variables."],
trap="Counting only the variables used in the next block on one path instead of the union over both successors.", short="live-out of a block = union of live-in of its successors.", kind="trace")

# 114 limit (NAT 2)
K.add(114, r"Evaluate \(\displaystyle \lim_{x \to 0} \frac{\sin 3x - 3\sin x}{x^{3}}\): ______.",
"""x = 1e-2
answer = round((math.sin(3 * x) - 3 * math.sin(x)) / x ** 3, 1)""",
steps=["Expand \\(\\sin 3x = 3x - \\dfrac{27x^3}{6} + \\cdots\\) and \\(3\\sin x = 3x - \\dfrac{3x^3}{6} + \\cdots\\).", "The difference is \\(-\\dfrac{24x^3}{6} = -4x^3\\), so the limit is «answer»."],
trap="Using \\(\\sin 3x \\approx 3\\sin x\\) and concluding 0, which drops the cubic terms.", short="Triple-angle identity: \\(\\sin 3x - 3\\sin x = -4\\sin^3 x\\).", kind="application")

# 115 SSTF (NAT 1)
K.add(115, r"A disk head is at cylinder \(50\) and the pending requests are for cylinders \(95, 180, 34, 119, 11, 123, 62, 64\). Under shortest-seek-time-first (SSTF) scheduling, the total head movement in cylinders is ______.",
"""head = 50
pend = [95, 180, 34, 119, 11, 123, 62, 64]
tot = 0
order = []
while pend:
    nx = min(pend, key=lambda c: abs(c - head))
    tot += abs(nx - head)
    head = nx
    pend.remove(nx)
    order.append(nx)
answer = tot
od = ', '.join(str(x) for x in order)""",
steps=["Always go to the closest pending cylinder: the service order is «od».", "Adding the distances gives «answer» cylinders."],
trap="Serving in arrival order (FCFS) or sweeping in one direction (SCAN).", short="Recompute the nearest request after every move.", kind="trace")

# 116 digraph traversal (MSQ 2)
K.add(116, r"A directed graph on vertices \(0, 1, 2, 3, 4\) has the edges \(0 \to 1,\ 0 \to 2,\ 1 \to 3,\ 2 \to 3,\ 3 \to 4,\ 4 \to 1\). A depth-first search starts at vertex 0 and always explores out-neighbours in increasing order. Which of the following statements is/are TRUE?",
"""adj = {0: [1, 2], 1: [3], 2: [3], 3: [4], 4: [1]}
seen = []
fin = []
def dfs(u):
    seen.append(u)
    for v in adj[u]:
        if v not in seen:
            dfs(v)
    fin.append(u)
dfs(0)
def reach(a):
    r = set([a])
    st = [a]
    while st:
        u = st.pop()
        for v in adj[u]:
            if v not in r:
                r.add(v)
                st.append(v)
    return r
R = {a: reach(a) for a in range(5)}
comps = set()
for a in range(5):
    comps.add(tuple(sorted(b for b in range(5) if b in R[a] and a in R[b])))
has_cycle = any(a in reach_b for a in range(5) for reach_b in [set().union(*[R[v] for v in adj[a]])])
truth = [has_cycle, fin.index(4) < fin.index(3), 3 in R[2] and 2 in R[3], len(comps) == 3]""",
stmts=[r"The graph contains a directed cycle.", r"In the DFS, vertex 4 finishes before vertex 3 finishes.", r"Vertices 2 and 3 belong to the same strongly connected component.", r"The graph has exactly 3 strongly connected components."],
steps=["The cycle \\(1 \\to 3 \\to 4 \\to 1\\) exists, so the graph is not a DAG. The DFS goes \\(0, 1, 3, 4\\); vertex 4 has only the visited neighbour 1, so it finishes first, then 3.", "Vertex 2 cannot be reached from 3 (no edge leads back to it), so 2 and 3 are in different components. The components are \\(\\{0\\}\\), \\(\\{2\\}\\) and \\(\\{1, 3, 4\\}\\): three."],
trap="Merging all vertices on the DFS path into one component, or confusing reachability one way with mutual reachability.", short="Two vertices share a component only if each reaches the other.", kind="msq_discriminator")

# 117 priority scheduling (NAT 2)
K.add(117, r"Four processes arrive at times \(0, 1, 2, 3\) ms with CPU bursts \(6, 4, 2, 5\) ms and priorities \(3, 1, 4, 2\) (a smaller number means a higher priority). Non-preemptive priority scheduling is used. The average waiting time, in ms, is ______.",
"""procs = [(0, 6, 3), (1, 4, 1), (2, 2, 4), (3, 5, 2)]
t = 0
done = set()
wait = {}
while len(done) < 4:
    ready = [i for i in range(4) if procs[i][0] <= t and i not in done]
    if not ready:
        t += 1
        continue
    i = min(ready, key=lambda k: procs[k][2])
    wait[i] = t - procs[i][0]
    t += procs[i][1]
    done.add(i)
answer = sum(wait.values()) / 4
wl = [wait[i] for i in range(4)]""",
steps=["\\(P_1\\) starts at 0 and cannot be preempted (runs to 6). Then the highest-priority waiting process is chosen each time.", "Waiting times of \\(P_1, \\dots, P_4\\) are «wl» ms; the average is «answer» ms."],
trap="Preempting \\(P_1\\) when the higher-priority \\(P_2\\) arrives (that is preemptive priority).", short="Wait \\(=\\) start time \\(-\\) arrival time.", kind="trace")

# 118 minimum pumping length (MCQ 1, key D)
K.add(118, r"Let \(L = \{ w \in \{a, b\}^* : w \text{ ends with } abb \}\). The smallest integer \(p\) such that every \(w \in L\) with \(|w| \ge p\) can be split as \(w = xyz\) with \(|xy| \le p\), \(|y| \ge 1\) and \(xy^iz \in L\) for all \(i \ge 0\) is",
"""def inL(w):
    return w.endswith('abb')
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
steps=["The string \\(abb \\in L\\) has length 3: pumping any non-empty part of it down (\\(i = 0\\)) leaves a string that does not end with \\(abb\\), so \\(p = 3\\) fails.", "For \\(p = 4\\), every longer member can pump its first symbol (removing or repeating it keeps the suffix \\(abb\\)). The smallest \\(p\\) is «val», the number of states of the minimal DFA."],
trap="Answering 3 (the length of the pattern), which fails for the string \\(abb\\) itself.", short="For this language the minimum pumping length is the number of DFA states.", kind="multi_concept")

# 119 B+ tree order (NAT 2)
K.add(119, r"The internal nodes of a B+ tree index are stored in disk blocks of \(4096\) bytes. A search key is \(12\) bytes and a block pointer is \(8\) bytes. An internal node with \(p\) pointers holds \(p - 1\) keys and must fit in one block. The largest possible value of \(p\) (the order of the internal nodes) is ______.",
"""p = 1
while 8 * (p + 1) + 12 * p <= 4096:
    p += 1
answer = p""",
steps=["The node needs \\(8p + 12(p - 1) \\le 4096\\), that is \\(20p \\le 4108\\).", "So \\(p \\le 205.4\\): the largest order is «answer»."],
trap="Writing \\(8p + 12p \\le 4096\\) (one key per pointer), which gives 204.", short="Pointers outnumber keys by one.", kind="numeric_chain")

# 120 Poisson tail (NAT 2)
K.add(120, r"The number of requests that reach a server in a minute follows a Poisson distribution with mean \(2\). The probability that at least \(3\) requests arrive in a given minute, correct to two decimal places, is ______.",
"""lam = 2
p_less = sum(math.exp(-lam) * lam ** k / math.factorial(k) for k in range(3))
answer = round(1 - p_less, 2)""",
steps=["\\(P(X \\le 2) = e^{-2}(1 + 2 + 2) = 5e^{-2} \\approx 0.6767\\).", "\\(P(X \\ge 3) = 1 - 0.6767 \\approx «answer»\\)."],
trap="Computing \\(P(X > 3)\\) or \\(P(X = 3)\\) alone.", short="At least 3 is the complement of at most 2.", kind="application")

# 121 distinct outputs (MCQ 2, key C)
K.add(121, r"Semaphores \(S = 1\) and \(T = 0\) are shared. Process \(P_1\) executes twice the sequence: wait(S); print a; signal(T). Process \(P_2\) executes twice the sequence: wait(T); print b; signal(S). A third process \(P_3\) just prints c once, with no synchronisation. All three run concurrently in any interleaving. The number of distinct output strings that complete runs can produce is",
"""P1 = [('w', 'S'), ('p', 'a'), ('s', 'T')] * 2
P2 = [('w', 'T'), ('p', 'b'), ('s', 'S')] * 2
P3 = [('p', 'c')]
progs = [P1, P2, P3]
start = ((0, 0, 0), (1, 0), '')
seen = set([start])
stack = [start]
outs = set()
while stack:
    pcs, sem, out = stack.pop()
    moved = False
    for i, p in enumerate(progs):
        if pcs[i] >= len(p):
            continue
        op, x = p[pcs[i]]
        s = list(sem)
        o = out
        if op == 'w':
            k = 0 if x == 'S' else 1
            if s[k] == 0:
                continue
            s[k] -= 1
        elif op == 's':
            k = 0 if x == 'S' else 1
            s[k] += 1
        else:
            o = out + x
        npcs = list(pcs)
        npcs[i] += 1
        st = (tuple(npcs), tuple(s), o)
        moved = True
        if st not in seen:
            seen.add(st)
            stack.append(st)
    if not moved and all(pcs[i] >= len(progs[i]) for i in range(3)):
        outs.add(out)
val = len(outs)
ol = ', '.join(sorted(outs))
wrong = [1, 4, 10]""",
steps=["\\(P_1\\) and \\(P_2\\) are forced to alternate, so together they print \\(abab\\) in that order.", "The independent \\(c\\) can be inserted at any of the 5 positions of \\(abab\\): the strings are «ol» — «val» in all."],
trap="Answering 1 (the synchronised pair) and forgetting the unsynchronised third process.", short="Fixed order for the pair; 5 slots for the free symbol.", kind="multi_concept")

# 122 maximum file size (NAT 2)
K.add(122, r"A file system uses blocks of \(2\) KB and \(4\)-byte block pointers. Each inode has \(12\) direct pointers, one single indirect pointer and one double indirect pointer. The maximum size of a file, in megabytes (\(1\) MB \(= 1024\) KB), correct to two decimal places, is ______.",
"""ptrs = 2048 // 4
blocks = 12 + ptrs + ptrs * ptrs
kb = blocks * 2
answer = round(kb / 1024, 2)""",
steps=["Pointers per block \\(= 2048/4 = 512\\).", "Blocks \\(= 12 + 512 + 512^2 = 262668\\); size \\(= 262668 \\times 2\\) KB \\(= 525336\\) KB \\(\\approx «answer»\\) MB."],
trap="Leaving out the direct and single-indirect blocks, or using the block size 4 KB.", short="Add the three ranges: direct, single indirect, double indirect.", kind="numeric_chain")

# 123 second-best spanning tree (MCQ 2, key A)
K.add(123, r"A weighted undirected graph on vertices \(0, \dots, 5\) has edges \(01\,3,\ 02\,4,\ 12\,2,\ 13\,5,\ 23\,1,\ 24\,6,\ 34\,4,\ 35\,7,\ 45\,2\). Let \(W_1\) be the weight of a minimum spanning tree and \(W_2\) the smallest weight strictly greater than \(W_1\) among all spanning trees. The value of \(W_2 - W_1\) is",
"""E = [(0, 1, 3), (0, 2, 4), (1, 2, 2), (1, 3, 5), (2, 3, 1), (2, 4, 6), (3, 4, 4), (3, 5, 7), (4, 5, 2)]
def connected(es):
    par = list(range(6))
    def f(x):
        while par[x] != x:
            x = par[x]
        return x
    for a, b, w in es:
        par[f(a)] = f(b)
    return len(set(f(x) for x in range(6))) == 1
ws = sorted(set(sum(e[2] for e in c) for c in itertools.combinations(E, 5) if connected(c)))
val = ws[1] - ws[0]
w1 = ws[0]
w2 = ws[1]
wrong = [2, 3, 4]""",
steps=["Kruskal gives a minimum spanning tree of weight \\(W_1 = «w1»\\).", "Listing the weights of all spanning trees (swapping one tree edge for a non-tree edge), the next larger weight is \\(W_2 = «w2»\\), so \\(W_2 - W_1 = «val»\\)."],
trap="Assuming the second-best tree always differs by the smallest non-tree edge weight, without checking the cycle it closes.", short="Second-best tree: add a non-tree edge, drop the heaviest edge on the cycle it makes.", kind="multi_concept")

# 124 balanced strings (MCQ 2, key B)
K.add(124, r"A string generator starts from the symbol \(S\) and may rewrite it as \(aSb\), as \(bSa\), as \(SS\), or delete it, as described by the productions \(S \to aSb \mid bSa \mid SS \mid \varepsilon\). Counting the empty string, how many different strings of length at most \(4\) can it produce?",
"""S = set([''])
changed = True
while changed:
    changed = False
    new = set()
    for s in S:
        for t in ('a' + s + 'b', 'b' + s + 'a'):
            if len(t) <= 6:
                new.add(t)
    for s in S:
        for t in S:
            if len(s + t) <= 6:
                new.add(s + t)
    if not new <= S:
        S = S | new
        changed = True
val = len([s for s in S if len(s) <= 4])
wrong = [6, 12, 16]""",
steps=["The grammar generates exactly the strings with equally many a's and b's.", "Length 0: 1 string; length 2: \\(ab, ba\\) (2); length 4: \\(\\binom{4}{2} = 6\\). Total «val»."],
trap="Counting only the balanced-bracket strings (which gives 1 + 1 + 2 = 4) or forgetting the empty string.", short="Equal numbers of a and b: \\(\\binom{2k}{k}\\) strings of length \\(2k\\).", kind="numeric_chain")

# 125 speedup with CPI (NAT 2)
K.add(125, r"A non-pipelined processor has a clock period of \(10\) ns and a CPI of \(1\). A pipelined version of the same processor has a clock period of \(2.2\) ns and a CPI of \(1.4\) because of stalls. The speedup of the pipelined processor over the non-pipelined one, correct to two decimal places, is ______.",
"""answer = round((10 * 1) / (2.2 * 1.4), 2)""",
steps=["Time per instruction: non-pipelined \\(= 10 \\times 1 = 10\\) ns; pipelined \\(= 2.2 \\times 1.4 = 3.08\\) ns.", "Speedup \\(= 10 / 3.08 \\approx «answer»\\)."],
trap="Using only the ratio of clock periods (4.55) and ignoring the stalls.", short="Speedup \\(= \\dfrac{CPI_1 \\times T_1}{CPI_2 \\times T_2}\\).", kind="numeric_chain")

# 126 DNS messages (NAT 1)
K.add(126, r"A client asks its local recursive resolver for the address of \(\texttt{www.example.com}\). The resolver has an empty cache and resolves the name iteratively by asking one root server, one top-level-domain (TLD) server and one authoritative server in turn. Counting each query and each response as one message, and including the query from the client to the resolver and its final response, the total number of DNS messages exchanged is ______.",
"""servers = ['root', 'tld', 'authoritative']
msgs = 2
for s in servers:
    msgs += 2
answer = msgs""",
steps=["Client and resolver exchange a query and a response: 2 messages.", "The resolver then sends a query to each of the three servers and gets a response from each: \\(3 \\times 2 = 6\\). Total «answer»."],
trap="Counting the queries only (4) or forgetting the client-resolver pair.", short="One query and one response per hop.", kind="application")

# 127 population count loop (NAT 2)
K.add(127, r"""The following C fragment is executed with the 16-bit unsigned value `x = 0xB5C3`.
```c
int count = 0;
while (x != 0) {
    x = x & (x - 1);
    count++;
}
```
The value of `count` after the loop ends is ______.""",
"""x = 0xB5C3
count = 0
while x != 0:
    x = x & (x - 1)
    count += 1
answer = count""",
steps=["The statement `x & (x - 1)` clears the lowest set bit each time, so the loop runs once for each 1 bit.", "\\(\\texttt{0xB5C3} = 1011\\,0101\\,1100\\,0011_2\\) has «answer» one-bits."],
trap="Counting the bits in the word (16) or the number of hex digits.", short="Number of iterations \\(=\\) population count.", kind="trace")

# 128 postfix evaluation (NAT 1)
K.add(128, r"The postfix expression \(5\ 6\ 2\ +\ *\ 12\ 4\ /\ -\) is evaluated using a stack of integers (operators pop two operands; the first popped is the right operand). The value left on the stack is ______.",
"""stack = []
for tok in '5 6 2 + * 12 4 / -'.split():
    if tok in '+-*/' and len(tok) == 1:
        b = stack.pop()
        a = stack.pop()
        stack.append(a + b if tok == '+' else a - b if tok == '-' else a * b if tok == '*' else a // b)
    else:
        stack.append(int(tok))
answer = stack[0]""",
steps=["\\(6\\ 2\\ + = 8\\); \\(5\\ 8\\ * = 40\\); \\(12\\ 4\\ / = 3\\).", "\\(40\\ 3\\ - = «answer»\\)."],
trap="Taking the first popped operand as the left operand, which gives \\(3 - 40\\) for the final step.", short="Work left to right, applying each operator to the two latest values.", kind="trace")

# 129 sum growth (MCQ 2, key A)
K.add(129, r"Which of the following is the tightest asymptotic bound for \(S(n) = \sum_{i=1}^{n} i \log_2 i\)?",
"""def S(n):
    return sum(i * math.log2(i) for i in range(2, n + 1))
cands = [lambda n: n * math.log2(n), lambda n: n * n, lambda n: n * n * math.log2(n), lambda n: n ** 3]
def settles(f):
    n1, n2 = 2 ** 12, 2 ** 16
    r1, r2 = S(n1) / f(n1), S(n2) / f(n2)
    return abs(r2 / r1 - 1) < 0.1
truth = [settles(cands[2]), settles(cands[0]), settles(cands[1]), settles(cands[3])]""",
stmts=[r"\(\Theta(n^2 \log n)\)", r"\(\Theta(n \log n)\)", r"\(\Theta(n^2)\)", r"\(\Theta(n^3)\)"],
steps=["The sum is dominated by its large terms: at least \\(n/2\\) terms are each \\(\\ge \\tfrac n2 \\log \\tfrac n2\\), so \\(S(n) = \\Omega(n^2 \\log n)\\); every term is \\(\\le n \\log n\\), so \\(S(n) = O(n^2 \\log n)\\).", "Dividing \\(S(n)\\) by \\(n^2 \\log n\\) settles at a constant, while the ratios for \\(n^2\\), \\(n \\log n\\) and \\(n^3\\) keep drifting."],
trap="Using the integral \\(\\int x \\log x\\) bound without checking both ends, or picking \\(n^2\\) because of \\(\\sum i = \\Theta(n^2)\\).", short="Sum of \\(n\\) terms, half of them of size about \\(n \\log n\\).", kind="multi_concept")

K.save("p7")
