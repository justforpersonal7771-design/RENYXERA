"""Forge batch b003 (CS), authored in a Claude session ($0). Same rule as b002: every item's `verify` code is RUN here, its answer is written
into the item, and the batch is refused if any code fails. Then validate.py re-checks.

    python scripts/forge/author_b003.py && python scripts/forge/validate.py data/forge/CS/batches/b003.json
"""
import json, math, itertools, fractions, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
ALLOWED = {"math": math, "itertools": itertools, "fractions": fractions, "range": range, "len": len, "sum": sum, "min": min, "max": max, "abs": abs,
           "round": round, "sorted": sorted, "set": set, "list": list, "dict": dict, "tuple": tuple, "int": int, "float": float, "str": str,
           "enumerate": enumerate, "zip": zip, "pow": pow, "next": next, "iter": iter, "all": all, "any": any, "map": map, "filter": filter, "bin": bin, "divmod": divmod}


def run(code):
    env = {"__builtins__": ALLOWED}
    exec(code, env)
    return env["answer"]


ITEMS = []


def add(id_, subject, topic, kind, diff, qtype, marks, text, code, solution, options=None, tol=0.0):
    ITEMS.append(dict(id=id_, subject=subject, topic=topic, kind=kind, difficulty=diff, question_type=qtype, marks=marks, question_text=text,
                      options=options or [], verify={"lang": "python", "code": code}, solution=solution, _tol=tol))


def sol(given, find, steps, shortcut, trap):
    return {"given": given, "find": find, "steps": steps, "shortcut": shortcut, "trap": trap}


# 18 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000018", "Operating Systems", "CPU Scheduling Algorithms (FCFS, SJF, RR, Priority)", "trace", "M", "NAT", 2,
    r"Four processes arrive and need CPU time as follows: \(P1\) (arrival \(0\), burst \(7\)), \(P2\) (\(1\), \(4\)), \(P3\) (\(2\), \(9\)), \(P4\) (\(3\), \(5\)). They are scheduled by Round Robin with time quantum \(3\). If a new process arrives at the same instant a quantum expires, the new process is placed in the ready queue before the preempted one. The average waiting time is ______ (up to two decimal places).",
    """procs = [('P1', 0, 7), ('P2', 1, 4), ('P3', 2, 9), ('P4', 3, 5)]
Q = 3
rem = {p: b for p, a, b in procs}
arr = {p: a for p, a, b in procs}
t = 0
queue = []
seen = set()
done = {}
def admit(t):
    for p, a, b in procs:
        if a <= t and p not in seen:
            queue.append(p)
            seen.add(p)
admit(0)
while queue:
    p = queue.pop(0)
    run_for = min(Q, rem[p])
    t += run_for
    rem[p] -= run_for
    admit(t)
    if rem[p] > 0:
        queue.append(p)
    else:
        done[p] = t
waits = [done[p] - arr[p] - b for p, a, b in procs]
answer = sum(waits) / len(waits)""",
    sol("RR, quantum 3; arrivals 0, 1, 2, 3; bursts 7, 4, 9, 5", "average waiting time",
        ["Gantt chart: P1 0-3, P2 3-6, P3 6-9, P4 9-12, P1 12-15, P2 15-16, P3 16-19, P4 19-21, P1 21-22, P3 22-25. (At time 3 the newly arrived P4 is queued before the preempted P1.)",
         "Completion times: P1 = 22, P2 = 16, P3 = 25, P4 = 21.",
         "Turnaround = completion - arrival: 22, 15, 23, 18. Waiting = turnaround - burst: 15, 11, 14, 13.",
         r"Average \(= (15 + 11 + 14 + 13)/4 = 53/4 = 13.25\)."],
        "Waiting time = completion - arrival - burst; total waiting is the sum over processes.",
        "Putting the preempted process ahead of the new arrival at the same instant, which changes every later slot."), tol=0.0)

# 19 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000019", "Operating Systems", "Deadlock: Prevention, Avoidance (Banker's) and Detection", "multi_concept", "H", "NAT", 2,
    r"A system has \(4\) processes \(P0\)-\(P3\) and \(3\) resource types \((X, Y, Z)\). The Allocation matrix rows are \(P0 = (1,3,1)\), \(P1 = (3,2,0)\), \(P2 = (3,3,3)\), \(P3 = (0,1,1)\). The Maximum matrix rows are \(P0 = (2,3,2)\), \(P1 = (6,3,3)\), \(P2 = (5,4,4)\), \(P3 = (0,1,1)\). The Available vector is \((1,3,1)\). The number of distinct safe sequences in which all four processes can complete is ______.",
    """alloc = {'P0': (1, 3, 1), 'P1': (3, 2, 0), 'P2': (3, 3, 3), 'P3': (0, 1, 1)}
mx = {'P0': (2, 3, 2), 'P1': (6, 3, 3), 'P2': (5, 4, 4), 'P3': (0, 1, 1)}
avail = (1, 3, 1)
count = 0
for seq in itertools.permutations(alloc):
    work = list(avail)
    ok = True
    for p in seq:
        need = [mx[p][i] - alloc[p][i] for i in range(3)]
        if any(need[i] > work[i] for i in range(3)):
            ok = False
            break
        work = [work[i] + alloc[p][i] for i in range(3)]
    if ok:
        count += 1
answer = count""",
    sol("Allocation, Maximum and Available as given", "number of safe sequences",
        ["Need = Maximum - Allocation: P0 = (1,0,1), P1 = (3,1,3), P2 = (2,1,1), P3 = (0,0,0). Available = (1,3,1).",
         "At the start only P0 (needs 1,0,1) and P3 (needs 0,0,0) can run. P2 needs 2 of X but only 1 is free, and P1 needs 3.",
         "After P0 finishes, Work becomes (2,6,2), so P2 can run; after P2 finishes Work becomes (5,9,5), so P1 can run. P1 can never run before both P0 and P2 have finished.",
         "P3 needs nothing and releases (0,1,1), which never blocks anyone, so it can sit anywhere. The order is P0 < P2 < P1 with P3 inserted in any of 4 positions.",
         "Number of safe sequences = 4: P0 P2 P1 P3, P0 P2 P3 P1, P0 P3 P2 P1, P3 P0 P2 P1."],
        "Find which processes are blocked by which others (an ordering chain), then count the free insertions.",
        "Counting only one safe sequence, or letting P2 run first although it needs 2 units of X when only 1 is free."))

# 20 --------------------------------------------------------------------------------------------------------------
ADDRS = [0, 4, 16, 128, 132, 0, 16, 144, 20, 260, 4, 512, 16]
def cache_trace():
    cache, rows, hits = {}, [], 0
    for a in ADDRS:
        blk = a // 16
        idx = blk % 8
        hit = cache.get(idx) == blk
        hits += hit
        cache[idx] = blk
        rows.append(f"{a}: block {blk}, line {idx}, {'hit' if hit else 'miss'}")
    return rows, hits
_rows, _hits = cache_trace()
add("FORGE_CS_000020", "Computer Organization and Architecture", "Cache Memory: Mapping and Replacement", "trace", "M", "NAT", 2,
    r"A byte-addressable machine has a direct-mapped cache with \(8\) lines and a block size of \(16\) bytes. The cache is initially empty. The following byte addresses are accessed in order: \(0, 4, 16, 128, 132, 0, 16, 144, 20, 260, 4, 512, 16\). The number of cache hits is ______.",
    """addrs = [0, 4, 16, 128, 132, 0, 16, 144, 20, 260, 4, 512, 16]
cache = {}
hits = 0
for a in addrs:
    blk = a // 16
    idx = blk % 8
    if cache.get(idx) == blk:
        hits += 1
    cache[idx] = blk
answer = hits""",
    sol("8 lines, 16-byte blocks, direct mapped", "number of hits",
        [r"Block number \(= \lfloor \text{address}/16 \rfloor\); line \(=\) block number mod \(8\)."] + ["; ".join(_rows[:7]) + ".", "; ".join(_rows[7:]) + ".",
         f"Total hits = {_hits}."],
        "Convert every address to (block, line) first; a hit needs the same block still sitting in that line.",
        "Assuming a block stays cached forever: block 0 and block 8 share line 0, so each evicts the other."))

# 21 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000021", "Computer Organization and Architecture", "Instruction Pipelining and Hazards", "numeric_chain", "M", "NAT", 2,
    r"A non-pipelined processor takes \(5\) clock cycles for every instruction. A \(5\)-stage pipelined version of it has an ideal CPI of \(1\), but \(20\%\) of the instructions are branches that each cost \(3\) extra stall cycles, and \(10\%\) of the instructions are loads that each cost \(1\) extra stall cycle because of a load-use hazard. Both processors have the same clock period. The speedup of the pipelined processor over the non-pipelined one is ______ (up to two decimal places).",
    """cpi = 1 + 0.20 * 3 + 0.10 * 1
answer = 5 / cpi""",
    sol("5-cycle non-pipelined; branches 20% x 3 stalls; loads 10% x 1 stall", "speedup",
        [r"Pipelined CPI \(= 1 + 0.20 \times 3 + 0.10 \times 1 = 1.7\).",
         r"Same clock period, so speedup \(=\) non-pipelined CPI \(/\) pipelined CPI \(= 5/1.7 \approx 2.94\)."],
        "CPI = ideal CPI + sum of (frequency x stall cycles); same clock means speedup is the ratio of CPIs.",
        "Quoting the ideal speedup of 5 and ignoring the stalls, or adding the stall percentages instead of multiplying them by their penalties."), tol=0.006)

# 22 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000022", "Databases", "Transactions and Concurrency Control (Serializability, 2PL)", "multi_concept", "H", "NAT", 2,
    r"Consider the schedule \(S: R_1(A)\ W_2(A)\ R_3(B)\ W_1(B)\ R_3(C)\ W_2(C)\ R_4(D)\), where \(R_i(X)\) and \(W_i(X)\) denote read and write of data item \(X\) by transaction \(T_i\). The number of distinct serial schedules of \(T_1, T_2, T_3, T_4\) that are conflict equivalent to \(S\) is ______.",
    """ops = [(1, 'R', 'A'), (2, 'W', 'A'), (3, 'R', 'B'), (1, 'W', 'B'), (3, 'R', 'C'), (2, 'W', 'C'), (4, 'R', 'D')]
edges = set()
for i in range(len(ops)):
    for j in range(i + 1, len(ops)):
        a, b = ops[i], ops[j]
        if a[0] != b[0] and a[2] == b[2] and 'W' in (a[1], b[1]):
            edges.add((a[0], b[0]))
count = 0
for perm in itertools.permutations([1, 2, 3, 4]):
    if all(perm.index(u) < perm.index(v) for u, v in edges):
        count += 1
answer = count""",
    sol("a schedule over A, B, C, D with four transactions", "number of conflict-equivalent serial schedules",
        ["List the conflicting pairs (different transactions, same item, at least one write), in schedule order: R1(A) before W2(A) gives T1 -> T2; R3(B) before W1(B) gives T3 -> T1; R3(C) before W2(C) gives T3 -> T2.",
         "T4 only reads D, which nobody writes, so it has no edges.",
         "The precedence graph T3 -> T1 -> T2 (plus T3 -> T2) has no cycle, so S is conflict serializable and its order among T1, T2, T3 is forced to be T3, T1, T2.",
         "T4 can be placed in any of the 4 positions of that order: 4 serial schedules."],
        "Draw the precedence graph; the number of serial orders is the number of topological orders.",
        "Answering 1 because the T3, T1, T2 order is forced, forgetting that the isolated transaction T4 can go anywhere."))

# 23 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000023", "Computer Networks", "Flow Control and Reliable Transmission (Sliding Window)", "numeric_chain", "M", "NAT", 2,
    r"A sender uses a sliding window protocol on a \(1\) Mbps link. Every frame is \(1000\) bits long and the one-way propagation delay is \(20\) ms. Acknowledgements are very short, so their transmission time can be ignored. The minimum window size (in frames) needed to keep the sender transmitting continuously is ______.",
    """tt = 1000 / 1_000_000
tp = 0.020
answer = math.ceil(1 + 2 * tp / tt)""",
    sol("1 Mbps, 1000-bit frames, 20 ms one-way delay", "minimum window for 100% utilisation",
        [r"Transmission time \(T_t = 1000 / 10^6 = 1\) ms; propagation \(T_p = 20\) ms.",
         r"The sender must keep sending for one full cycle: \(T_t + 2T_p = 1 + 40 = 41\) ms.",
         r"Window \(\ge (T_t + 2T_p)/T_t = 41\) frames."],
        r"Window \(= 1 + 2a\) where \(a = T_p / T_t\).",
        "Using the one-way delay (giving 21) instead of the round trip."))

# 24 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000024", "Compiler Design", "Syntax Analysis: FIRST, FOLLOW and Parsers", "multi_concept", "M", "NAT", 2,
    r"Consider the grammar with start symbol \(S\): \(S \to A\,B\,c\), \(A \to a\,A \mid \varepsilon\), \(B \to b\,B \mid \varepsilon\). The number of elements in \(\text{FOLLOW}(S) \cup \text{FOLLOW}(A) \cup \text{FOLLOW}(B)\) is ______. (\(\$\) is the end marker and counts as an element.)",
    """G = {'S': [['A', 'B', 'c']], 'A': [['a', 'A'], []], 'B': [['b', 'B'], []]}
nts = set(G)
first = {n: set() for n in G}
nullable = {n: False for n in G}
changed = True
while changed:
    changed = False
    for n, prods in G.items():
        for p in prods:
            all_null = True
            for s in p:
                if s in nts:
                    new = first[s] - first[n]
                    if new:
                        first[n] |= new
                        changed = True
                    if not nullable[s]:
                        all_null = False
                        break
                else:
                    if s not in first[n]:
                        first[n].add(s)
                        changed = True
                    all_null = False
                    break
            if all_null and not nullable[n]:
                nullable[n] = True
                changed = True
follow = {n: set() for n in G}
follow['S'].add('$')
changed = True
while changed:
    changed = False
    for n, prods in G.items():
        for p in prods:
            for i, s in enumerate(p):
                if s not in nts:
                    continue
                rest_null = True
                for t in p[i + 1:]:
                    add_set = first[t] if t in nts else {t}
                    if not add_set <= follow[s]:
                        follow[s] |= add_set
                        changed = True
                    if t in nts and nullable[t]:
                        continue
                    rest_null = False
                    break
                if rest_null and not follow[n] <= follow[s]:
                    follow[s] |= follow[n]
                    changed = True
answer = len(follow['S'] | follow['A'] | follow['B'])""",
    sol("S -> A B c; A -> a A | epsilon; B -> b B | epsilon", r"size of the union of the three FOLLOW sets",
        [r"\(\text{FOLLOW}(S) = \{\$\}\) because \(S\) is the start symbol and appears on no right-hand side.",
         r"In \(S \to A\,B\,c\), \(A\) is followed by \(B\,c\). \(\text{FIRST}(B) = \{b, \varepsilon\}\), so \(\text{FOLLOW}(A) \supseteq \{b\}\) and, since \(B\) can vanish, also \(\{c\}\): \(\text{FOLLOW}(A) = \{b, c\}\).",
         r"\(B\) is followed by \(c\): \(\text{FOLLOW}(B) = \{c\}\). The \(A \to aA\) and \(B \to bB\) rules add nothing new.",
         r"The union is \(\{\$, b, c\}\), which has \(3\) elements."],
        "Walk each production and look at what comes after every non-terminal; if the rest can vanish, add FOLLOW of the left side.",
        "Forgetting that B can derive epsilon, so c also follows A; or leaving $ out of the count."))

# 25 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000025", "Programming and Data Structures", "Recursion and Static Variables in C", "trace", "M", "NAT", 1,
    "What is the value returned by the call f(4) in the following C program?\n```\nint f(int x) {\n    static int c = 0;\n    c = c + x;\n    if (x > 1) f(x - 1);\n    return c;\n}\n```\nThe value returned is ______.",
    """# the static variable is shared by every call
state = [0]
def call(x):
    state[0] = state[0] + x
    if x > 1:
        call(x - 1)
    return state[0]
answer = call(4)""",
    sol("static int c shared by all calls", "value returned by f(4)",
        [r"There is only one \(c\) for the whole program, initialised once to \(0\).",
         r"The calls add as they go down: \(c = 4\), then \(7\) (after \(f(3)\)), then \(9\) (after \(f(2)\)), then \(10\) (after \(f(1)\)).",
         r"Each call returns \(c\) only after the deeper calls have finished, so \(f(4)\) returns \(10\)."],
        "A static local lives across calls: treat it like one global counter.",
        "Treating c as a fresh local in each call and returning 4."))

# 26 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000026", "Digital Logic", "Boolean Algebra, Minimization and K-Maps", "multi_concept", "H", "NAT", 2,
    r"A Boolean function of four variables \(A, B, C, D\) (with \(A\) the most significant) is \(f = \sum m(0, 1, 2, 5, 6, 7, 8, 9, 10, 14)\). The number of essential prime implicants of \(f\) is ______.",
    """mins = [0, 1, 2, 5, 6, 7, 8, 9, 10, 14]
def covers(imp, m):
    return all(c == '-' or int(c) == ((m >> (3 - i)) & 1) for i, c in enumerate(imp))
cur = {bin(m)[2:].zfill(4) for m in mins}
primes = set()
while cur:
    nxt = set()
    used = set()
    for a, b in itertools.combinations(sorted(cur), 2):
        d = [i for i in range(4) if a[i] != b[i]]
        if len(d) == 1 and a[d[0]] != '-' and b[d[0]] != '-':
            nxt.add(a[:d[0]] + '-' + a[d[0] + 1:])
            used.add(a)
            used.add(b)
    primes |= cur - used
    cur = nxt
ess = set()
for m in mins:
    c = [p for p in primes if covers(p, m)]
    if len(c) == 1:
        ess.add(c[0])
answer = len(ess)""",
    sol("f = sum m(0,1,2,5,6,7,8,9,10,14)", "number of essential prime implicants",
        [r"Prime implicants: \(C D'\) (minterms 2, 6, 10, 14), \(B'D'\) (0, 2, 8, 10), \(B'C'\) (0, 1, 8, 9), \(A'C'D\) (1, 5), \(A'BD\) (5, 7), \(A'BC\) (6, 7). That is 6 prime implicants.",
         r"A prime implicant is essential if it is the only one covering some minterm. Minterm 14 is covered only by \(CD'\); minterm 9 only by \(B'C'\).",
         r"Every other minterm is covered by at least two prime implicants (for example 0 by \(B'D'\) and \(B'C'\); 5 by \(A'C'D\) and \(A'BD\); 7 by \(A'BD\) and \(A'BC\)), so \(B'D'\), \(A'C'D\), \(A'BD\), \(A'BC\) are not essential.",
         "Essential prime implicants: 2."],
        "Scan the K-map for minterms that sit in exactly one maximal group.",
        "Counting every prime implicant (6) or treating the large corner group B'D' as essential."))

# 27 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000027", "Engineering Mathematics", "Linear Algebra: Matrices, Eigenvalues and Eigenvectors", "multi_concept", "M", "NAT", 2,
    r"Let \(M = \begin{pmatrix} 2 & 1 & 1 \\ 1 & 2 & 1 \\ 1 & 1 & 2 \end{pmatrix}\). If \(\lambda_1, \lambda_2, \lambda_3\) are the eigenvalues of \(M\), then \(\lambda_1^2 + \lambda_2^2 + \lambda_3^2\) equals ______.",
    """M = [[2, 1, 1], [1, 2, 1], [1, 1, 2]]
# sum of squared eigenvalues = trace(M^2)
answer = sum(sum(M[i][k] * M[k][i] for k in range(3)) for i in range(3))""",
    sol("a 3 x 3 symmetric matrix", "sum of squares of its eigenvalues",
        [r"\(M = I + J\) where \(J\) is the all-ones matrix. \(J\) has eigenvalues \(3, 0, 0\), so \(M\) has eigenvalues \(4, 1, 1\).",
         r"\(4^2 + 1^2 + 1^2 = 18\).",
         r"Check with \(\operatorname{trace}(M^2)\): the diagonal of \(M^2\) is \(6, 6, 6\), so the trace is \(18\)."],
        r"Sum of squared eigenvalues \(= \operatorname{trace}(M^2)\); no eigenvalues needed.",
        r"Squaring the trace (\(6^2 = 36\)) instead of adding the squared eigenvalues."))

# 28 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000028", "Algorithms", "Dynamic Programming (LCS, Knapsack, Matrix Chain)", "trace", "M", "NAT", 2,
    r"The longest common subsequence (LCS) of the strings \(X = \texttt{BDCABAXYZ}\) and \(Y = \texttt{BADCBXZAY}\) has length ______.",
    """X = "BDCABAXYZ"
Y = "BADCBXZAY"
L = [[0] * (len(Y) + 1) for _ in range(len(X) + 1)]
for i in range(1, len(X) + 1):
    for j in range(1, len(Y) + 1):
        if X[i - 1] == Y[j - 1]:
            L[i][j] = L[i - 1][j - 1] + 1
        else:
            L[i][j] = max(L[i - 1][j], L[i][j - 1])
answer = L[len(X)][len(Y)]""",
    sol("two strings of length 9", "LCS length",
        [r"Fill the table \(L[i][j] = L[i-1][j-1] + 1\) if \(X_i = Y_j\), else \(\max(L[i-1][j], L[i][j-1])\).",
         "One common subsequence of length 6 is B D C B X Z (BDC in the first half, then B, X, Z in order in both strings).",
         "The table's last cell is 6, and no common subsequence of length 7 exists."],
        "Work the table row by row; the answer is the bottom-right cell.",
        "Counting common letters regardless of order: the characters must appear in the same order in both strings."))

# 29 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000029", "Programming and Data Structures", "Hashing: Open Addressing and Collision Resolution", "trace", "M", "NAT", 1,
    r"The keys \(43, 36, 92, 87, 11, 4, 71, 13, 14\) are inserted in this order into a hash table of size \(11\) (indices \(0\)-\(10\)) using \(h(k) = k \bmod 11\) and linear probing for collisions. The index at which the key \(14\) is stored is ______.",
    """table = [None] * 11
for k in [43, 36, 92, 87, 11, 4, 71, 13, 14]:
    i = k % 11
    while table[i] is not None:
        i = (i + 1) % 11
    table[i] = k
    last = i
answer = last""",
    sol("size 11, h(k) = k mod 11, linear probing", "index of key 14",
        ["43 -> 10; 36 -> 3; 92 -> 4; 87 -> 10 is taken, wrap to 0; 11 -> 0 is taken, so 1; 4 -> 4 is taken, so 5; 71 -> 5 is taken, so 6; 13 -> 2.",
         "Now the table is [87, 11, 13, 36, 92, 4, 71, -, -, -, 43].",
         r"\(14 \bmod 11 = 3\): indices 3, 4, 5, 6 are all occupied, so 14 goes to index 7."],
        "Keep the table written out; probe forward and wrap from 10 to 0.",
        "Stopping at the first collision or forgetting the wrap-around for 87."))

# ---------------------------------------------------------------------------------------------------------------
out = []
for it in ITEMS:
    tol = it.pop("_tol")
    val = run(it["verify"]["code"])
    if it["question_type"] == "NAT":
        it["answer"] = {"range": [round(val - tol, 6), round(val + tol, 6)]}
    else:
        assert val in "ABCD", (it["id"], val)
        it["answer"] = {"options": [val]}
    out.append(it)
    print(it["id"], it["question_type"], it["answer"])

path = ROOT / "data" / "forge" / "CS" / "batches" / "b003.json"
path.write_text(json.dumps({"branch": "CS", "batch": "b003", "note": "Authored in a Claude session; every answer computed by its own verify code (author_b003.py), then validate.py.", "items": out}, ensure_ascii=False, indent=1), encoding="utf-8")
print("wrote", path)
