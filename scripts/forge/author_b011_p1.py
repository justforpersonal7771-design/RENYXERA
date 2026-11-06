"""Forge b011 part 1 (X-tier challenge batch, slots 0 to 9). Run: python scripts/forge/author_b011_p1.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b011")

# 0 disk scheduling: SSTF versus the best possible order (NAT)
K.add(0, r"A disk head is at cylinder \(53\) and the pending requests are for cylinders \(98, 183, 37, 122, 14, 124, 65, 67\). Shortest-seek-time-first (SSTF) serves the nearest pending request each time. An offline planner that knows all the requests may serve them in any order it likes. The number of extra cylinders that SSTF moves compared with the best possible order is ______.",
"""head = 53
reqs = [98, 183, 37, 122, 14, 124, 65, 67]
def cost(order):
    pos = head
    t = 0
    for r in order:
        t += abs(r - pos)
        pos = r
    return t
left = list(reqs)
pos = head
order = []
while left:
    nxt = min(left, key=lambda r: (abs(r - pos), r))
    left.remove(nxt)
    order.append(nxt)
    pos = nxt
sstf = cost(order)
best = min(cost(p) for p in itertools.permutations(reqs))
answer = sstf - best""",
steps=["SSTF repeatedly jumps to the nearest request: from \\(53\\) it goes \\(65, 67, 37, 14, 98, 122, 124, 183\\), moving a total of «sstf» cylinders.", "The cheapest order sweeps one side first and then the other; checking all \\(8! = 40320\\) service orders gives a minimum of «best» cylinders.", "Difference \\(= «sstf» - «best» = «answer»\\): greedy nearest-first is not optimal."],
trap="Assuming SSTF is optimal because every step is the cheapest one, or comparing it with SCAN instead of the true optimum.", short="Compute SSTF greedily, then compare with the minimum over all service orders.", kind="multi_concept")

# 1 LRU hit probability for skewed random accesses (MCQ, key B)
K.add(1, r"A \(2\)-way set-associative cache set with LRU replacement serves a stream of independent random accesses to three blocks \(X, Y, Z\) that all map to this set, with probabilities \(0.5, 0.3\) and \(0.2\) respectively. In the long run, the fraction of accesses that hit in the set, correct to three decimal places, is",
"""p = [0.5, 0.3, 0.2]
states = [(a, b) for a in range(3) for b in range(3) if a != b]
idx = {s: i for i, s in enumerate(states)}
pi = [1.0 / len(states)] * len(states)
for _ in range(3000):
    new = [0.0] * len(states)
    for s in states:
        mru, lru = s
        for b in range(3):
            if b == mru:
                t = s
            else:
                t = (b, mru)
            new[idx[t]] += pi[idx[s]] * p[b]
    pi = new
val = round(sum(pi[idx[s]] * (p[s[0]] + p[s[1]]) for s in states), 3)
wrong = [round(val + 0.02, 3), round(val - 0.05, 3), 0.667]""",
steps=["The state of the set is the ordered pair (most recently used, least recently used). A hit leaves the pair unchanged or swaps it; a miss brings in the third block, evicting the least recently used one.", "Solve the \\(6\\)-state Markov chain for its stationary distribution \\(\\pi\\) (power iteration converges quickly).", "In state \\((m, l)\\) the hit probability is \\(p_m + p_l\\); averaging over \\(\\pi\\) gives the long-run hit fraction «val», above the uniform-access value \\(2/3\\) because the popular blocks stay resident."],
trap="Using the uniform value 2/3 or the sum of the two largest probabilities (0.8), which assumes the two hottest blocks are always the resident ones.", short="Stationary distribution of the LRU-stack Markov chain, then average the hit probability.", kind="multi_concept")

# 2 binary strings with 1s at least three apart (NAT)
K.add(2, r"A line encoder sends binary strings of length \(14\) in which any two \(1\)s must be at least \(3\) positions apart (so \(1001\) is allowed, \(101\) and \(11\) are not). The number of strings the encoder can send is ______.",
"""cnt = 0
for x in range(1 << 14):
    ones = [i for i in range(14) if (x >> i) & 1]
    if all(b - a >= 3 for a, b in zip(ones, ones[1:])):
        cnt += 1
f = [1, 2, 3]
for n in range(3, 15):
    f.append(f[-1] + f[-3])
answer = cnt
rec = f[14]""",
steps=["Look at the last symbol: if it is \\(0\\), the first \\(n - 1\\) symbols form any valid string; if it is \\(1\\), the two symbols before it must be \\(0\\) and the first \\(n - 3\\) symbols are any valid string.", "So \\(a_n = a_{n-1} + a_{n-3}\\) with \\(a_0 = 1,\\ a_1 = 2,\\ a_2 = 3\\), giving \\(a_{14} = «rec»\\); checking all \\(2^{14}\\) strings gives «answer».", "Equivalently, this counts the strings accepted by a \\(4\\)-state DFA, the recurrence is its characteristic polynomial \\(x^3 = x^2 + 1\\)."],
trap="Using the Fibonacci recurrence (distance 2) or counting the spacing as an exact distance instead of a minimum.", short="Condition on the last symbol: a_n = a_{n-1} + a_{n-3}.", kind="multi_concept")

# 3 randomized quickselect expected comparisons (MCQ, key C)
K.add(3, r"Randomized quickselect finds the \(4\)-th smallest of \(7\) distinct numbers. In each round it picks a pivot uniformly at random from the current elements, compares every other element with the pivot (so a round on \(m\) elements costs \(m - 1\) comparisons), and recurses only into the part that contains the target. The expected number of comparisons, correct to three decimal places, is",
"""F = fractions.Fraction
E = {}
def e(n, k):
    if n <= 1:
        return F(0)
    if (n, k) in E:
        return E[(n, k)]
    tot = F(0)
    for i in range(1, n + 1):
        if i == k:
            pass
        elif i > k:
            tot += e(i - 1, k)
        else:
            tot += e(n - i, k - i)
    E[(n, k)] = (n - 1) + tot / n
    return E[(n, k)]
val = round(float(e(7, 4)), 3)
wrong = [round(val - 1.1, 3), round(val + 1.3, 3), 12.0]""",
steps=["Let \\(E(n, k)\\) be the expected number of comparisons for rank \\(k\\) among \\(n\\) elements; \\(E(1, k) = 0\\). With a pivot of rank \\(i\\) (probability \\(1/n\\)): done if \\(i = k\\), otherwise recurse on the \\(i - 1\\) smaller elements (if \\(i > k\\)) or on the \\(n - i\\) larger ones with rank \\(k - i\\) (if \\(i < k\\)).", "\\(E(n, k) = (n - 1) + \\frac1n \\sum_i \\bigl(\\text{cost of the recursion for pivot rank } i\\bigr)\\); evaluating the recurrence from small sizes up to \\(E(7, 4)\\) gives «val»."],
trap="Using the quicksort recurrence (recursing on both sides) or ignoring that the target's rank changes after a right-hand recursion.", short="Dynamic programming over (size, rank) with a uniformly random pivot.", kind="multi_concept")

# 4 serial orders equivalent to a conflict-serializable schedule (NAT)
K.add(4, r"Seven transactions \(T_1, \dots, T_7\) run the schedule \(S\) (in time order): \(R_1(A)\ R_4(B)\ R_6(C)\ W_2(A)\ W_5(B)\ W_7(C)\ R_3(A)\ W_3(D)\ R_7(D)\), where \(R_i(X)\) and \(W_i(X)\) are a read and a write of item \(X\) by \(T_i\). \(S\) is conflict serializable. The number of different serial schedules (orders of the seven transactions) that are conflict equivalent to \(S\) is ______.",
"""ops = [(1, 'R', 'A'), (4, 'R', 'B'), (6, 'R', 'C'), (2, 'W', 'A'), (5, 'W', 'B'), (7, 'W', 'C'), (3, 'R', 'A'), (3, 'W', 'D'), (7, 'R', 'D')]
edges = set()
for x in range(len(ops)):
    for y in range(x + 1, len(ops)):
        a = ops[x]
        b = ops[y]
        if a[0] != b[0] and a[2] == b[2] and 'W' in (a[1], b[1]):
            edges.add((a[0], b[0]))
cnt = 0
for perm in itertools.permutations(range(1, 8)):
    pos = {t: i for i, t in enumerate(perm)}
    if all(pos[a] < pos[b] for a, b in edges):
        cnt += 1
answer = cnt
elist = ', '.join('T%d to T%d' % e for e in sorted(edges))""",
steps=["Conflicting pairs (different transactions, same item, at least one write) give the precedence edges: «elist».", "A serial schedule is equivalent to \\(S\\) exactly when it respects every edge, so the count is the number of topological orders of this graph.", "The graph splits into the chain \\(T_1 \\to T_2 \\to T_3 \\to T_7\\) joined by \\(T_6 \\to T_7\\), and the pair \\(T_4 \\to T_5\\); counting the valid orders of the seven transactions gives «answer»."],
trap="Reporting one serial order (the usual 'the' equivalent serial schedule), or ignoring edges that arise through a third transaction.", short="Build the precedence graph and count its topological orders.", kind="multi_concept")

# 5 slotted ALOHA at the best transmission probability (MCQ, key D)
K.add(5, r"Ten stations share a slotted ALOHA channel. In every slot each station independently transmits with the same probability \(p\); a slot is successful when exactly one station transmits. When \(p\) is chosen to maximise the long-run fraction of successful slots, the average number of slots the channel needs per delivered frame is, correct to two decimal places,",
"""n = 10
bestS = 0.0
bestp = 0.0
for i in range(1, 1000):
    p = i / 1000.0
    S = n * p * (1 - p) ** (n - 1)
    if S > bestS:
        bestS = S
        bestp = p
val = round(1 / bestS, 2)
wrong = [2.0, 2.72, 3.0]
sp = round(bestS, 4)""",
steps=["The success probability of a slot is \\(S(p) = 10\\,p\\,(1 - p)^{9}\\); setting \\(S'(p) = 0\\) gives \\(p = 1/10\\).", "\\(S(0.1) = 10 \\times 0.1 \\times 0.9^{9} \\approx «sp»\\).", "The average number of slots per delivered frame is \\(1/S \\approx «val»\\)."],
trap="Using the large-n limit 1/e (giving e = 2.72 slots) instead of the exact value for ten stations.", short="Maximise n p (1-p)^(n-1) at p = 1/n and invert.", kind="multi_concept")

# 6 Booth radix-4 recoding of a negative multiplier (NAT)
K.add(6, r"An \(8\)-bit two's complement multiplier register holds \(-57\) (the bit pattern \(11000111\)). A radix-4 Booth multiplier recodes it into four digits from the set \(\{-2, -1, 0, +1, +2\}\) by examining overlapping triples of bits (with an extra \(0\) appended to the right of the least significant bit), and generates one partial product per digit but skips a partial product whose digit is \(0\). The number of non-zero partial products is ______.",
"""bits = [1, 1, 0, 0, 0, 1, 1, 1]
b = bits[::-1] + [0]
digits = []
for i in range(4):
    b0 = b[2 * i]
    b1 = b[2 * i + 1]
    bm = b[2 * i - 1] if i > 0 else 0
    digits.append(-2 * b1 + b0 + bm)
value = sum(d * 4 ** i for i, d in enumerate(digits))
answer = sum(1 for d in digits if d != 0)
ds = ', '.join(str(d) for d in digits)""",
steps=["Recode each triple \\((b_{2i+1}, b_{2i}, b_{2i-1})\\) as \\(-2 b_{2i+1} + b_{2i} + b_{2i-1}\\); starting from the least significant pair the digits are «ds».", "Check: \\(\\sum d_i 4^i = «value»\\), which is the multiplier \\(-57\\).", "Only the digits that are not zero need a partial product: «answer» of the four."],
trap="Forgetting the appended zero on the right, or counting all four digits as partial products.", short="Recode in overlapping triples; skip zero digits.", kind="multi_concept")

# 7 LALR(1) but not SLR(1) (MCQ, key A)
K.add(7, r"A compiler course uses the grammar with terminals \(a, b, c, d\) and start symbol \(S\): \(S \to A\,a \mid b\,A\,c \mid d\,c \mid b\,d\,a\), \(A \to d\). Which one of the following classifications of the grammar is TRUE?",
"""G = [("S'", ("S",)), ("S", ("A", "a")), ("S", ("b", "A", "c")), ("S", ("d", "c")), ("S", ("b", "d", "a")), ("A", ("d",))]
NT = ["S'", "S", "A"]
def first(sym):
    if sym not in NT:
        return set([sym])
    out = set()
    for l, r in G:
        if l == sym and r[0] != sym:
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
steps=["Consider the state reached after reading \\(d\\) from the start: it holds \\(A \\to d\\cdot\\) (the reduction needed for \\(S \\to Aa\\)) and \\(S \\to d\\cdot c\\) (a shift on \\(c\\)).", "With SLR(1), the reduction \\(A \\to d\\) is used on \\(\\text{FOLLOW}(A) = \\{a, c\\}\\), which contains \\(c\\): a shift-reduce conflict, so the grammar is not SLR(1).", "With look-aheads the reduction in that state applies only on \\(a\\), and the state reached after \\(b\\,d\\) (look-ahead \\(c\\)) has a different core, so no states merge in LALR(1): the grammar is LR(1) and LALR(1) (the automaton has «nstates» states) but not SLR(1)."],
trap="Judging the grammar by FOLLOW sets alone (SLR) and concluding it cannot be LR(1)-family at all.", short="Look for the state where FOLLOW overlaps a shift symbol; check whether look-aheads separate it.", kind="msq_discriminator")

# 8 pipeline with load-use and branch stalls over a loop (NAT)
K.add(8, r"A \(5\)-stage pipeline (IF, ID, EX, MEM, WB) has full forwarding for ALU results, but a load followed immediately by an instruction that uses its result still stalls for \(1\) cycle. Conditional branches are resolved in the ID stage: if the branch needs a register produced by the immediately preceding ALU instruction it stalls for \(1\) cycle (\(2\) cycles if that instruction is a load), and a taken branch costs \(1\) extra cycle (the fetched instruction is squashed; not taken costs nothing). The loop \(\texttt{L: lw r1,0(r2);\ add r3,r3,r1;\ addi r2,r2,4;\ bne r2,r5,L}\) is executed \(10\) times (the branch is taken \(9\) times). Counting from the first instruction fetch to the last write-back, the total number of cycles is ______.",
"""trace = []
for it in range(10):
    trace += [('lw', 'r1', ['r2']), ('add', 'r3', ['r3', 'r1']), ('addi', 'r2', ['r2']), ('bne', None, ['r2', 'r5'])]
stalls = 0
for k in range(1, len(trace)):
    prev = trace[k - 1]
    cur = trace[k]
    if cur[0] == 'bne':
        if prev[1] in cur[2]:
            stalls += 2 if prev[0] == 'lw' else 1
    else:
        if prev[0] == 'lw' and prev[1] in cur[2]:
            stalls += 1
n = len(trace)
taken = 9
answer = n + 4 + stalls + taken""",
steps=["Dynamic instructions: \\(4 \\times 10 = 40\\). An ideal pipeline needs \\(40 + 4 = 44\\) cycles.", "Per iteration: the \\(\\texttt{add}\\) uses the register just loaded (1 stall), and \\(\\texttt{bne}\\) uses \\(\\texttt{r2}\\) written by the \\(\\texttt{addi}\\) just before it (1 stall): \\(2 \\times 10 = 20\\) stall cycles.", "The branch is taken \\(9\\) times, each adding one squashed fetch: \\(9\\) cycles.", "Total \\(= 44 + «stalls» + «taken» = «answer»\\)."],
trap="Charging the load-use stall to the branch as well, or adding a branch penalty to the final not-taken branch.", short="Cycles = instructions + 4 + stalls + branch penalties.", kind="trace")

# 9 expected probes for an unsuccessful search with linear probing (NAT)
K.add(9, r"An open-addressing hash table has \(8\) slots and uses linear probing (next slot, wrapping around). Five keys are inserted one after another; the hash value of each key is independently and uniformly random over the \(8\) slots. A sixth, new key (not in the table) with a uniformly random hash value is then searched for. The search examines slots starting at its hash slot until it finds an empty slot, and the empty slot examined counts as a probe. The expected number of probes, correct to three decimal places, is ______.",
"""m = 8
total = 0
for hs in itertools.product(range(m), repeat=5):
    t = [0] * m
    for h in hs:
        j = h
        while t[j]:
            j = (j + 1) % m
        t[j] = 1
    for h in range(m):
        j = h
        pr = 1
        while t[j]:
            j = (j + 1) % m
            pr += 1
        total += pr
answer = round(total / (m ** 6), 3)""",
steps=["Average over all \\(8^5\\) equally likely hash sequences for the five keys and over the \\(8\\) hash values of the new key.", "For a given final table the search for hash value \\(h\\) takes \\(1 + \\) (length of the run of occupied slots starting at \\(h\\)) probes, so clusters make the average larger than the \\(1 + 5/8\\) a random placement would suggest.", "Exact enumeration of all \\(8^6\\) cases gives «answer»."],
trap="Using the textbook large-table formula for linear probing or the load factor alone (about 1.6), which ignores primary clustering at this size.", short="Enumerate all hash sequences; probes = 1 + run length of occupied slots from the hash position.", kind="multi_concept")

K.save("p1")
