"""Forge batch b005 (CS), authored in a Claude session ($0): 7 MCQ, 4 MSQ, 1 NAT. Every item's `verify` code is RUN here and its answer
(option letters, or a numeric range) is written into the item; the batch is refused if any code fails. Then validate.py re-checks.

    python scripts/forge/author_b005.py && python scripts/forge/validate.py data/forge/CS/batches/b005.json
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


def opts(*t):
    return [{"option_id": "ABCD"[i], "text": x} for i, x in enumerate(t)]


ITEMS = []


def add(id_, subject, topic, kind, diff, qtype, marks, text, code, solution, options=None, tol=0.0):
    ITEMS.append(dict(id=id_, subject=subject, topic=topic, kind=kind, difficulty=diff, question_type=qtype, marks=marks, question_text=text,
                      options=options or [], verify={"lang": "python", "code": code}, solution=solution, _tol=tol))


def sol(given, find, steps, shortcut, trap):
    return {"given": given, "find": find, "steps": steps, "shortcut": shortcut, "trap": trap}


# 43 Subnetting (MCQ) ----------------------------------------------------------------------------------------------
add("FORGE_CS_000043", "Computer Networks", "IP Addressing, Subnetting and CIDR", "trap_aware", "M", "MCQ", 1,
    r"A host has the IP address \(192.168.37.200\) and the subnet mask \(255.255.248.0\). Which one of the following addresses is in the same network as this host?",
    """def ip(a, b, c, d):
    return (a << 24) | (b << 16) | (c << 8) | d
mask = ip(255, 255, 248, 0)
host = ip(192, 168, 37, 200)
cands = [ip(192, 168, 31, 255), ip(192, 168, 40, 1), ip(192, 168, 35, 7), ip(192, 168, 48, 9)]
same = [i for i, c in enumerate(cands) if (c & mask) == (host & mask)]
answer = 'ABCD'[same[0]] if len(same) == 1 else 'X'""",
    sol("192.168.37.200 with mask 255.255.248.0", "the address in the same network",
        [r"The mask 248 in the third octet is \(11111000_2\), so the network size in that octet is \(256 - 248 = 8\) (a /21).",
         r"The third octet 37 lies in the block \(32\) to \(39\) (since \(\lfloor 37/8 \rfloor \times 8 = 32\)), so the network is 192.168.32.0 and its hosts run 192.168.32.0 to 192.168.39.255.",
         "Only 192.168.35.7 lies in that range; 31.255 is the previous network, 40.1 and 48.9 are in later networks."],
        "Block size = 256 - mask octet; the network starts at the multiple of the block size at or below the host's octet.",
        "Treating the mask as /24 (it would put 37.x only) or rounding the third octet to 40 instead of down to 32."),
    options=opts("192.168.31.255", "192.168.40.1", "192.168.35.7", "192.168.48.9"))

# 44 Normal form (MCQ) ---------------------------------------------------------------------------------------------
add("FORGE_CS_000044", "Databases", "Normalization (1NF, 2NF, 3NF, BCNF Boundaries)", "multi_concept", "M", "MCQ", 2,
    r"A relation \(R(A, B, C, D)\) satisfies exactly the functional dependencies \(AB \to C\) and \(C \to D\) (and those implied by them). Which one of the following describes the highest normal form that \(R\) is in?",
    """attrs = 'ABCD'
fds = [('AB', 'C'), ('C', 'D')]
def closure(s):
    s = set(s)
    ch = True
    while ch:
        ch = False
        for l, r in fds:
            if set(l) <= s and not set(r) <= s:
                s |= set(r)
                ch = True
    return s
supers = [set(c) for n in range(1, 5) for c in itertools.combinations(attrs, n) if closure(c) == set(attrs)]
keys = [s for s in supers if not any(t < s for t in supers)]
prime = set().union(*keys)
def is_super(x):
    return closure(x) == set(attrs)
bcnf = all(is_super(l) for l, r in fds)
nf3 = all(is_super(l) or set(r) <= prime for l, r in fds)
partial = any(set(l) < k and (set(r) - prime) for l, r in fds for k in keys)
if bcnf:
    ans = 3
elif nf3:
    ans = 2
elif not partial:
    ans = 1
else:
    ans = 0
answer = 'ABCD'[ans]""",
    sol("R(A,B,C,D) with AB -> C and C -> D", "highest normal form",
        [r"Closure of \(AB\): \(AB \to C \to D\), so \(AB^+ = ABCD\). \(AB\) is the only candidate key, so \(A\) and \(B\) are prime and \(C, D\) are non-prime.",
         r"2NF: no non-prime attribute depends on a proper subset of the key. \(C\) needs both \(A\) and \(B\), and \(D\) depends on \(C\), not on \(A\) or \(B\) alone: no partial dependency, so R is in 2NF.",
         r"3NF: \(C \to D\) has a left side \(C\) that is not a superkey, and \(D\) is not prime. This is a transitive dependency, so R is not in 3NF."],
        "Find the key first; then a dependency X -> Y breaks 3NF if X is not a superkey and Y is not prime.",
        "Calling it 3NF or BCNF because AB is the key; the transitive dependency C -> D is what stops it."),
    options=opts("1NF but not 2NF", "2NF but not 3NF", "3NF but not BCNF", "BCNF"))

# 45 Scheduling (MCQ) ----------------------------------------------------------------------------------------------
add("FORGE_CS_000045", "Operating Systems", "CPU Scheduling Algorithms (FCFS, SJF, RR, Priority)", "trace", "M", "MCQ", 2,
    r"Four processes arrive and need CPU time as follows: \(P1\) (arrival \(0\), burst \(8\)), \(P2\) (\(1\), \(4\)), \(P3\) (\(2\), \(9\)), \(P4\) (\(3\), \(5\)). If a process arrives at the same instant a quantum expires, the new process is queued first. Which one of the following scheduling policies gives the smallest average waiting time for these processes?",
    """procs = [('P1', 0, 8), ('P2', 1, 4), ('P3', 2, 9), ('P4', 3, 5)]
def avg(finish):
    return sum(finish[p] - a - b for p, a, b in procs) / len(procs)
# FCFS
t = 0
fin = {}
for p, a, b in sorted(procs, key=lambda x: x[1]):
    t = max(t, a) + b
    fin[p] = t
fcfs = avg(fin)
# non-preemptive SJF
t = 0
fin = {}
left = list(procs)
while left:
    ready = [x for x in left if x[1] <= t] or [min(left, key=lambda x: x[1])]
    p, a, b = min(ready, key=lambda x: (x[2], x[1]))
    t = max(t, a) + b
    fin[p] = t
    left.remove((p, a, b))
sjf = avg(fin)
# SRTF
rem = {p: b for p, a, b in procs}
fin = {}
t = 0
while rem:
    ready = [p for p, a, b in procs if a <= t and p in rem]
    if not ready:
        t += 1
        continue
    p = min(ready, key=lambda x: (rem[x], x))
    rem[p] -= 1
    t += 1
    if rem[p] == 0:
        del rem[p]
        fin[p] = t
srtf = avg(fin)
# RR q = 4
Q = 4
rem = {p: b for p, a, b in procs}
fin = {}
queue = []
seen = set()
def admit(t):
    for p, a, b in procs:
        if a <= t and p not in seen:
            queue.append(p)
            seen.add(p)
t = 0
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
        fin[p] = t
rr = avg(fin)
vals = [fcfs, sjf, srtf, rr]
answer = 'ABCD'[vals.index(min(vals))]""",
    sol("four processes; FCFS, non-preemptive SJF, SRTF, RR with quantum 4", "policy with the smallest average waiting time",
        ["FCFS: P1 0-8, P2 8-12, P3 12-21, P4 21-26. Waiting 0, 7, 10, 18; average 35/4 = 8.75.",
         "Non-preemptive SJF: P1 0-8, then P2 8-12, P4 12-17, P3 17-26. Waiting 0, 7, 15, 9; average 31/4 = 7.75.",
         "SRTF: P1 runs 0-1, P2 1-5, P4 5-10, P1 10-17, P3 17-26. Waiting P1 = 9, P2 = 0, P3 = 15, P4 = 2; average 26/4 = 6.5.",
         "RR (q = 4): P1 0-4, P2 4-8, P3 8-12, P4 12-16, P1 16-20, P3 20-24, P4 24-25, P3 25-26. Waiting 12, 3, 15, 17; average 47/4 = 11.75.",
         "The smallest is SRTF (6.5)."],
        "Preemptive shortest-job-first (SRTF) minimises the average waiting time among these policies.",
        "Picking non-preemptive SJF as 'the shortest job first policy': once P1 starts at time 0 it cannot be preempted by the shorter P2."),
    options=opts("First come, first served", "Non-preemptive SJF", "Preemptive SJF (SRTF)", "Round robin, quantum 4"))

# 46 Recurrence (MCQ) -----------------------------------------------------------------------------------------------
add("FORGE_CS_000046", "Algorithms", "Time Complexity: Asymptotic Notation and Recurrence Relations", "conceptual", "M", "MCQ", 2,
    r"Let \(T(n) = T(n/2) + T(n/4) + n\) for \(n \ge 2\) and \(T(1) = 1\), where \(n\) is a power of \(2\). Which one of the following is the tightest asymptotic bound for \(T(n)\)?",
    """memo = {}
def T(n):
    if n <= 1:
        return 1
    if n not in memo:
        memo[n] = T(n // 2) + T(n // 4) + n
    return memo[n]
n = 2 ** 40
r = T(n) / n
linear = 3.9 < r < 4.01
not_nlogn = T(n) / (n * 40) < 0.2
opts = ['Theta(n)', 'Theta(n log n)', 'Theta(n^2)', 'Theta(log n)']
answer = 'A' if (linear and not_nlogn) else 'X'""",
    sol("T(n) = T(n/2) + T(n/4) + n", "tightest bound",
        [r"The two subproblems have sizes \(n/2\) and \(n/4\), which add up to \(3n/4 < n\).",
         r"So the work per level shrinks by a factor of \(3/4\) each time: level costs are \(n, \tfrac34 n, (\tfrac34)^2 n, \dots\), a geometric series.",
         r"The sum is \(n / (1 - 3/4) = 4n\), so \(T(n) = \Theta(n)\). (A numerical check for \(n = 2^{40}\) gives \(T(n)/n\) very close to 4.)"],
        "If the subproblem sizes add up to less than n, the root dominates and T(n) = Theta(f(n)).",
        r"Answering \(\Theta(n \log n)\) because the recurrence 'looks like' merge sort: there the two halves add up to exactly \(n\)."),
    options=opts(r"\(\Theta(n)\)", r"\(\Theta(n \log n)\)", r"\(\Theta(n^2)\)", r"\(\Theta(\log n)\)"))

# 47 BST postorder (MCQ) --------------------------------------------------------------------------------------------
add("FORGE_CS_000047", "Data Structures", "Binary Search Trees (BSTs) & Binary Heaps", "trace", "M", "MCQ", 1,
    r"The preorder traversal of a binary search tree is \(30, 20, 10, 25, 40, 35, 50\). Which one of the following is the postorder traversal of the same tree?",
    """pre = [30, 20, 10, 25, 40, 35, 50]
tree = None
def ins(t, k):
    if t is None:
        return [k, None, None]
    if k < t[0]:
        t[1] = ins(t[1], k)
    else:
        t[2] = ins(t[2], k)
    return t
for k in pre:
    tree = ins(tree, k)
def post(t):
    if t is None:
        return []
    return post(t[1]) + post(t[2]) + [t[0]]
cands = [[10, 25, 20, 35, 50, 40, 30], [10, 20, 25, 35, 40, 50, 30], [25, 10, 20, 50, 35, 40, 30], [10, 25, 20, 50, 35, 40, 30]]
answer = 'ABCD'[cands.index(post(tree))]""",
    sol("preorder of a BST: 30, 20, 10, 25, 40, 35, 50", "the postorder traversal",
        ["Insert the keys in preorder order: 30 is the root; 20 and 10, 25 go to its left (20 is the left child, with children 10 and 25); 40, 35, 50 go to its right (40 with children 35 and 50).",
         "Postorder visits left subtree, right subtree, then the root: left subtree (20: 10, 25) gives 10, 25, 20; right subtree (40: 35, 50) gives 35, 50, 40; then 30.",
         "Postorder: 10, 25, 20, 35, 50, 40, 30."],
        "A BST's preorder fixes the tree: inserting the keys in that order rebuilds it exactly.",
        "Sorting the keys (that is the inorder) and calling it postorder, or visiting the right child before the left."),
    options=opts("10, 25, 20, 35, 50, 40, 30", "10, 20, 25, 35, 40, 50, 30", "25, 10, 20, 50, 35, 40, 30", "10, 25, 20, 50, 35, 40, 30"))

# 48 Tag bits (MCQ) -------------------------------------------------------------------------------------------------
add("FORGE_CS_000048", "Computer Organization and Architecture", "Memory Hierarchy (Direct/Associative Cache Mapping)", "numeric_chain", "M", "MCQ", 1,
    r"A \(4\)-way set-associative cache has a total capacity of \(64\) KB and a block size of \(32\) bytes. The processor issues \(32\)-bit byte addresses. The number of tag bits in each cache line is",
    """cap = 64 * 1024
block = 32
ways = 4
sets = cap // block // ways
off = 0
while 2 ** off < block:
    off += 1
idx = 0
while 2 ** idx < sets:
    idx += 1
tag = 32 - idx - off
opts = [16, 17, 18, 19]
answer = 'ABCD'[opts.index(tag)]""",
    sol("64 KB, 32-byte blocks, 4-way, 32-bit addresses", "tag bits",
        [r"Blocks \(= 64\text{ KB} / 32\text{ B} = 2048\); sets \(= 2048 / 4 = 512\).",
         r"Block offset \(= \log_2 32 = 5\) bits; set index \(= \log_2 512 = 9\) bits.",
         r"Tag \(= 32 - 9 - 5 = 18\) bits."],
        "tag = address bits - log2(sets) - log2(block size); the associativity only changes the number of sets.",
        "Using the number of blocks (2048) instead of the number of sets for the index, which would give 16."),
    options=opts("16", "17", "18", "19"))

# 49 DFA states (MCQ) -----------------------------------------------------------------------------------------------
add("FORGE_CS_000049", "Theory of Computation (TOC)", "Regular Expressions & Finite Automata (DFA/NFA Min)", "multi_concept", "M", "MCQ", 2,
    r"Let \(L\) be the set of all strings over \(\{a, b\}\) in which the number of \(a\)s is divisible by \(3\) and the number of \(b\)s is even. The number of states in the minimal DFA accepting \(L\) is",
    """states = [(i, j) for i in range(3) for j in range(2)]
def step(s, c):
    return ((s[0] + 1) % 3, s[1]) if c == 'a' else (s[0], (s[1] + 1) % 2)
acc = {(0, 0)}
part = [set(acc), set(states) - acc]
changed = True
while changed:
    changed = False
    new = []
    for g in part:
        sig = {}
        for s in g:
            key = tuple(next(i for i, h in enumerate(part) if step(s, c) in h) for c in 'ab')
            sig.setdefault(key, set()).add(s)
        new += list(sig.values())
        changed = changed or len(sig) > 1
    part = new
opts = [5, 6, 9, 12]
answer = 'ABCD'[opts.index(len(part))]""",
    sol("a-count divisible by 3 and b-count even", "minimal DFA size",
        [r"Track \((\#a \bmod 3, \#b \bmod 2)\): \(3 \times 2 = 6\) states; accepting state \((0, 0)\), which is also the start state.",
         "Any two of these 6 states are distinguishable: if their a-residues differ, append enough a's (and b's) to make one of them accept and not the other; if only their b-parities differ, append the right string over a, b.",
         "So the minimal DFA has 6 states."],
        "A condition on counts modulo m and modulo k needs m x k states when both are independent.",
        "Answering 5 or 9 by adding the two moduli (3 + 2) or multiplying 3 x 3 by mistake; the states multiply: 3 x 2."),
    options=opts("5", "6", "9", "12"))

# 50 Equivalence relations (MSQ) ------------------------------------------------------------------------------------
add("FORGE_CS_000050", "Discrete Mathematics", "Sets, Relations and Functions", "multi_concept", "M", "MSQ", 2,
    r"Consider these relations on the set \(S = \{1, 2, 3\}\): \(R_A = \{(1,1),(2,2),(3,3),(1,2),(2,1)\}\); \(R_B = \{(1,1),(2,2),(3,3),(1,2)\}\); \(R_C = \{(1,1),(2,2),(3,3),(1,2),(2,1),(2,3),(3,2)\}\); \(R_D = S \times S\). Which of the relations is/are equivalence relations? (Select all that apply.)",
    """S = [1, 2, 3]
rels = [
    {(1, 1), (2, 2), (3, 3), (1, 2), (2, 1)},
    {(1, 1), (2, 2), (3, 3), (1, 2)},
    {(1, 1), (2, 2), (3, 3), (1, 2), (2, 1), (2, 3), (3, 2)},
    {(a, b) for a in S for b in S},
]
def equivalence(r):
    refl = all((x, x) in r for x in S)
    sym = all((b, a) in r for a, b in r)
    trans = all((a, d) in r for a, b in r for c, d in r if b == c)
    return refl and sym and trans
answer = ['ABCD'[i] for i, r in enumerate(rels) if equivalence(r)]""",
    sol("four relations on {1, 2, 3}", "which are equivalence relations",
        [r"\(R_A\): reflexive; symmetric because \((1,2)\) and \((2,1)\) both appear; transitive (the only chains are within \(\{1,2\}\)). Equivalence relation.",
         r"\(R_B\): not symmetric, since \((1,2)\) is present but \((2,1)\) is not.",
         r"\(R_C\): \((1,2)\) and \((2,3)\) are present, so transitivity needs \((1,3)\), which is missing. Not transitive.",
         r"\(R_D = S \times S\): reflexive, symmetric and transitive. Equivalence relation (one class holding all elements)."],
        "Check the three properties one at a time; one missing pair is enough to rule a relation out.",
        r"Accepting \(R_C\) because it is symmetric and reflexive: transitivity needs \((1,3)\) and \((3,1)\) too."),
    options=opts(r"\(R_A\)", r"\(R_B\)", r"\(R_C\)", r"\(R_D\)"))

# 51 Conflict serializability (MSQ) -----------------------------------------------------------------------------------
add("FORGE_CS_000051", "Databases", "Transactions and Concurrency Control (Serializability, 2PL)", "multi_concept", "H", "MSQ", 2,
    r"Four schedules are given, where \(R_i(X)\) and \(W_i(X)\) are a read and a write of item \(X\) by transaction \(T_i\). \(S_A: R_1(X)\ R_2(Y)\ W_1(Y)\ W_2(X)\). \(S_B: R_1(X)\ W_1(X)\ R_2(X)\ W_2(X)\). \(S_C: R_2(X)\ R_1(X)\ W_2(X)\ W_1(X)\). \(S_D: R_1(X)\ R_3(Y)\ W_3(Y)\ R_2(X)\ W_1(X)\). Which of the schedules is/are conflict serializable? (Select all that apply.)",
    """scheds = [
    [(1, 'R', 'X'), (2, 'R', 'Y'), (1, 'W', 'Y'), (2, 'W', 'X')],
    [(1, 'R', 'X'), (1, 'W', 'X'), (2, 'R', 'X'), (2, 'W', 'X')],
    [(2, 'R', 'X'), (1, 'R', 'X'), (2, 'W', 'X'), (1, 'W', 'X')],
    [(1, 'R', 'X'), (3, 'R', 'Y'), (3, 'W', 'Y'), (2, 'R', 'X'), (1, 'W', 'X')],
]
def serializable(ops):
    tx = sorted({o[0] for o in ops})
    edges = set()
    for i in range(len(ops)):
        for j in range(i + 1, len(ops)):
            a, b = ops[i], ops[j]
            if a[0] != b[0] and a[2] == b[2] and 'W' in (a[1], b[1]):
                edges.add((a[0], b[0]))
    return any(all(p.index(u) < p.index(v) for u, v in edges) for p in itertools.permutations(tx))
answer = ['ABCD'[i] for i, s in enumerate(scheds) if serializable(s)]""",
    sol("four schedules over items X and Y", "which are conflict serializable",
        [r"\(S_A\): \(R_1(X)\) before \(W_2(X)\) gives \(T_1 \to T_2\); \(R_2(Y)\) before \(W_1(Y)\) gives \(T_2 \to T_1\). The graph has a cycle: not serializable.",
         r"\(S_B\): \(T_1\) finishes with \(X\) before \(T_2\) touches it: only \(T_1 \to T_2\). Serializable.",
         r"\(S_C\): \(R_1(X)\) before \(W_2(X)\) gives \(T_1 \to T_2\); \(R_2(X)\) before \(W_1(X)\) gives \(T_2 \to T_1\). Cycle: not serializable.",
         r"\(S_D\): \(R_2(X)\) before \(W_1(X)\) gives \(T_2 \to T_1\); \(R_1(X)\) and \(R_2(X)\) are both reads, so no edge; \(T_3\) only uses \(Y\). No cycle: serializable."],
        "Draw the precedence graph from conflicting pairs (different transactions, same item, at least one write); a cycle means not serializable.",
        "Adding an edge between two reads, or between operations of different items."),
    options=opts(r"\(S_A\)", r"\(S_B\)", r"\(S_C\)", r"\(S_D\)"))

# 52 MST edges (MSQ) -----------------------------------------------------------------------------------------------------
add("FORGE_CS_000052", "Algorithms", "Graph Traversals (BFS, DFS) & Single-Source Shortest Paths", "multi_concept", "M", "MSQ", 2,
    r"An undirected graph on vertices \(1, 2, 3, 4, 5\) has these edges with distinct weights: \((1,2) = 3,\ (1,3) = 7,\ (2,3) = 5,\ (2,4) = 8,\ (3,4) = 4,\ (3,5) = 9,\ (4,5) = 6\). Which of the following edges belong to the minimum spanning tree? (Select all that apply.)",
    """edges = [(1, 2, 3), (1, 3, 7), (2, 3, 5), (2, 4, 8), (3, 4, 4), (3, 5, 9), (4, 5, 6)]
parent = {v: v for v in range(1, 6)}
def find(x):
    while parent[x] != x:
        x = parent[x]
    return x
mst = set()
for u, v, w in sorted(edges, key=lambda e: e[2]):
    ru, rv = find(u), find(v)
    if ru != rv:
        parent[ru] = rv
        mst.add((u, v))
asked = [(1, 2), (1, 3), (4, 5), (3, 5)]
answer = ['ABCD'[i] for i, e in enumerate(asked) if e in mst]""",
    sol("7 weighted edges on 5 vertices", "edges in the MST",
        ["Kruskal: sort by weight: (1,2)=3, (3,4)=4, (2,3)=5, (4,5)=6, (1,3)=7, (2,4)=8, (3,5)=9.",
         "Take (1,2), (3,4), (2,3) (joins {1,2} with {3,4}), (4,5) (adds vertex 5): 4 edges for 5 vertices, total weight 18.",
         "(1,3), (2,4) and (3,5) would each close a cycle, so they are rejected. The asked edges in the MST: (1,2) and (4,5)."],
        "An MST of V vertices has V - 1 edges; stop Kruskal as soon as you have them.",
        "Including (1,3) = 7 because it is 'cheap': it closes the cycle 1-2-3."),
    options=opts("(1,2) with weight 3", "(1,3) with weight 7", "(4,5) with weight 6", "(3,5) with weight 9"))

# 53 Cache line mapping (MSQ) ----------------------------------------------------------------------------------------
add("FORGE_CS_000053", "Computer Organization and Architecture", "Memory Hierarchy (Direct/Associative Cache Mapping)", "multi_concept", "H", "MSQ", 2,
    r"A direct-mapped cache has a capacity of \(16\) KB with \(64\)-byte blocks, and the processor uses \(32\)-bit byte addresses. Which of the following addresses map to the same cache line as the address \(\texttt{0x0001A2C4}\)? (Select all that apply.)",
    """cap = 16 * 1024
block = 64
lines = cap // block
def line(a):
    return (a // block) % lines
base = 0x0001A2C4
cands = [0x0003A2C4, 0x0001A304, 0x0001E2C4, 0x0001A8C4]
answer = ['ABCD'[i] for i, c in enumerate(cands) if line(c) == line(base)]""",
    sol("16 KB direct-mapped, 64-byte blocks", "addresses sharing the line of 0x0001A2C4",
        [r"Lines \(= 16384 / 64 = 256\); offset \(= 6\) bits, line index \(= 8\) bits (address bits 6 to 13).",
         "Two addresses share a line when their line indices are equal, i.e. when they differ by a multiple of 16 KB (0x4000) or are inside the same 64-byte block.",
         "0x0003A2C4 - 0x0001A2C4 = 0x20000 = 8 x 16 KB: same line. 0x0001E2C4 - 0x0001A2C4 = 0x4000 = 16 KB: same line.",
         "0x0001A304 is 0x40 = 64 bytes further, the next block and the next line. 0x0001A8C4 is 0x600 = 1536 bytes further, 24 lines on."],
        "Same line means (address / block size) mod lines is equal; a difference of a multiple of the cache size always works.",
        "Thinking only the offset matters, or that addresses 64 bytes apart share a line."),
    options=opts("0x0003A2C4", "0x0001A304", "0x0001E2C4", "0x0001A8C4"))

# 54 Catalan (NAT) ----------------------------------------------------------------------------------------------------
add("FORGE_CS_000054", "Data Structures", "Binary Search Trees (BSTs) & Binary Heaps", "multi_concept", "M", "NAT", 1,
    r"The number of structurally different binary search trees that can be built from \(5\) distinct keys is ______.",
    """n = 5
c = [1, 1]
for m in range(2, n + 1):
    c.append(sum(c[i] * c[m - 1 - i] for i in range(m)))
answer = c[n]""",
    sol("5 distinct keys", "number of different BST shapes",
        [r"Let \(C_n\) be the count. Choosing key \(i\) as the root leaves \(i-1\) keys on the left and \(n-i\) on the right: \(C_n = \sum_{i=1}^{n} C_{i-1} C_{n-i}\).",
         r"\(C_0 = 1,\ C_1 = 1,\ C_2 = 2,\ C_3 = 5,\ C_4 = 14\).",
         r"\(C_5 = C_0C_4 + C_1C_3 + C_2C_2 + C_3C_1 + C_4C_0 = 14 + 5 + 4 + 5 + 14 = 42\)."],
        r"These are the Catalan numbers: \(C_n = \binom{2n}{n}/(n+1)\); for \(n = 5\), \(252/6 = 42\).",
        "Counting orderings of the keys (5! = 120): different insertion orders can give the same tree."))

# ---------------------------------------------------------------------------------------------------------------
out = []
for it in ITEMS:
    tol = it.pop("_tol")
    val = run(it["verify"]["code"])
    if it["question_type"] == "NAT":
        it["answer"] = {"range": [round(val - tol, 6), round(val + tol, 6)]}
    elif it["question_type"] == "MCQ":
        assert val in "ABCD" and len(val) == 1, (it["id"], val)
        it["answer"] = {"options": [val]}
    else:
        assert isinstance(val, list) and val and all(v in "ABCD" for v in val), (it["id"], val)
        it["answer"] = {"options": val}
    if it["options"]:
        assert len({o["text"] for o in it["options"]}) == 4, it["id"]
    out.append(it)
    print(it["id"], it["question_type"], it["answer"])

path = ROOT / "data" / "forge" / "CS" / "batches" / "b005.json"
path.write_text(json.dumps({"branch": "CS", "batch": "b005", "note": "Authored in a Claude session; every answer computed by its own verify code (author_b005.py), then validate.py.", "items": out}, ensure_ascii=False, indent=1), encoding="utf-8")
print("wrote", path)
