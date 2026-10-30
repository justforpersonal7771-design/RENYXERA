"""Forge batch b002, authored in a Claude session ($0): every item carries `verify` code; this script RUNS that code, writes the
answer it computes into the item, and refuses to write the batch if any item's code fails. Then validate.py re-checks everything.

    python scripts/forge/author_b002.py && python scripts/forge/validate.py data/forge/CS/batches/b002.json
"""
import json, math, itertools, fractions, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
ALLOWED = {"math": math, "itertools": itertools, "fractions": fractions, "range": range, "len": len, "sum": sum, "min": min, "max": max, "abs": abs,
           "round": round, "sorted": sorted, "set": set, "list": list, "dict": dict, "tuple": tuple, "int": int, "float": float, "str": str,
           "enumerate": enumerate, "zip": zip, "pow": pow, "next": next, "iter": iter, "all": all, "any": any, "map": map, "filter": filter, "bin": bin, "divmod": divmod}


def run(code):
    env = {"__builtins__": ALLOWED}
    exec(code, env)
    return env["answer"]


def opts(*texts):
    return [{"option_id": "ABCD"[i], "text": t} for i, t in enumerate(texts)]


ITEMS = []


def add(id_, subject, topic, kind, diff, qtype, marks, text, code, solution, options=None, nat_tol=0.0):
    ITEMS.append(dict(id=id_, subject=subject, topic=topic, kind=kind, difficulty=diff, question_type=qtype, marks=marks, question_text=text,
                      options=options or [], verify={"lang": "python", "code": code}, solution=solution, _tol=nat_tol))


# 8 ---------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000008", "Engineering Mathematics", "Probability: Conditional Probability & Bayes", "multi_concept", "M", "NAT", 2,
    r"Two fair six-faced dice are rolled together. Given that the sum of the two numbers shown is a multiple of \(3\), the probability that both dice show the same number is ______ (rounded off to two decimal places).",
    """pairs = [(a, b) for a in range(1, 7) for b in range(1, 7)]
given = [p for p in pairs if (p[0] + p[1]) % 3 == 0]
both = [p for p in given if p[0] == p[1]]
answer = float(fractions.Fraction(len(both), len(given)))""",
    {"given": "two fair dice; sum is a multiple of 3", "find": r"P(equal numbers | sum is a multiple of 3)",
     "steps": [r"Sums that are multiples of 3: 3, 6, 9, 12. The number of ordered pairs giving them is \(2 + 5 + 4 + 1 = 12\).",
               r"Among these, the pairs with equal numbers are \((3,3)\) (sum 6) and \((6,6)\) (sum 12): \(2\) pairs.",
               r"\(P = 2/12 = 1/6 \approx 0.17\)."],
     "shortcut": "Count inside the reduced sample space: the given condition replaces all 36 outcomes by the 12 that satisfy it.",
     "trap": r"Dividing by 36 (or by the number of equal pairs, 6) instead of by the 12 outcomes allowed by the condition."}, nat_tol=0.006)

# 9 ---------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000009", "Algorithms", "Graph Algorithms: BFS, DFS, MST, Shortest Paths", "trace", "M", "NAT", 1,
    r"An undirected weighted graph has vertices \(A, B, C, D, E, F\) and the edges (with weights) \(AB = 4,\ AC = 2,\ BC = 1,\ BD = 5,\ CD = 8,\ CE = 10,\ DE = 2,\ DF = 6,\ EF = 3\). The total weight of a minimum spanning tree of this graph is ______.",
    """edges = [('A','B',4),('A','C',2),('B','C',1),('B','D',5),('C','D',8),('C','E',10),('D','E',2),('D','F',6),('E','F',3)]
parent = {v: v for v in 'ABCDEF'}
def find(x):
    while parent[x] != x:
        x = parent[x]
    return x
total = 0
for u, v, w in sorted(edges, key=lambda e: e[2]):
    ru, rv = find(u), find(v)
    if ru != rv:
        parent[ru] = rv
        total += w
answer = total""",
    {"given": "9 weighted edges on 6 vertices", "find": "weight of an MST",
     "steps": ["Sort the edges: BC 1, AC 2, DE 2, EF 3, AB 4, BD 5, DF 6, CD 8, CE 10.",
               "Kruskal: take BC (1), AC (2), DE (2), EF (3). AB (4) would close the cycle A-B-C, so skip it.",
               "BD (5) joins the two components {A, B, C} and {D, E, F}. Now 5 edges connect 6 vertices.",
               r"Weight \(= 1 + 2 + 2 + 3 + 5 = 13\)."],
     "shortcut": "An MST has V - 1 = 5 edges; stop as soon as you have them.",
     "trap": "Adding AB (weight 4) because it is cheaper than BD, although it forms a cycle with BC and AC."})

# 10 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000010", "Databases", "Normalization (1NF, 2NF, 3NF, BCNF Boundaries)", "multi_concept", "H", "NAT", 2,
    r"A relation \(R(A, B, C, D, E, F)\) satisfies exactly the functional dependencies \(A \to B,\ BC \to D,\ D \to E,\ E \to C,\ F \to A\) (and those implied by them). The number of candidate keys of \(R\) is ______.",
    """attrs = 'ABCDEF'
fds = [('A','B'),('BC','D'),('D','E'),('E','C'),('F','A')]
def closure(s):
    s = set(s)
    changed = True
    while changed:
        changed = False
        for l, r in fds:
            if set(l) <= s and not set(r) <= s:
                s |= set(r)
                changed = True
    return s
supers = [set(c) for n in range(1, 7) for c in itertools.combinations(attrs, n) if closure(c) == set(attrs)]
keys = [s for s in supers if not any(t < s for t in supers)]
answer = len(keys)""",
    {"given": "R(A,B,C,D,E,F) with five functional dependencies", "find": "number of candidate keys",
     "steps": ["F appears on no right-hand side, so every key contains F.",
               r"\(F^+ = \{F, A, B\}\) (F gives A, A gives B). We still need C, D, E.",
               r"Add C: \(\{F, C\}^+ = \{F, A, B, C, D, E\}\) because \(BC \to D\), then \(D \to E\). So \(FC\) is a key.",
               r"Add D instead: \(D \to E \to C\), so \(\{F, D\}^+\) contains \(C, D, E\) and \(BC \to D\) is not even needed: \(FD\) is a key. Likewise \(FE\) is a key (\(E \to C\), \(BC \to D\)).",
               "No key with only F, and none of F, C, D, E is a subset of another key. The keys are FC, FD and FE: 3 candidate keys."],
     "shortcut": "Attributes never on a right-hand side must be in every key; then test the small additions.",
     "trap": "Stopping at the first key (FC). D and E sit in a cycle with C (C is reached from E, D from BC, E from D), so each of them can replace C."})

# 11 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000011", "Algorithms", "Time Complexity: Asymptotic Notation and Recurrence Relations", "conceptual", "H", "MCQ", 2,
    r"Let \(T(n)\) satisfy \(T(n) = 2\,T(n/2) + \dfrac{n}{\log_2 n}\) for \(n = 2^k\), \(k \ge 2\), with \(T(2) = 1\). Which one of the following is the asymptotic growth of \(T(n)\)?",
    """# T(2^k) = 2^k * (H_k) up to lower terms: level i adds 2^i * (n/2^i)/log2(n/2^i) = n/(k-i).
def H(k):
    return sum(1.0 / j for j in range(1, k + 1))
def ratio(k, f):
    return H(k) / f(k)
k = 10 ** 6
is_n_loglog = abs(ratio(k, lambda x: math.log2(x)) - math.log(2)) < 0.05
is_not_nlogn = H(k) / k < 1e-4
is_not_n = H(k) > 10
opts = ['Theta(n log n)', 'Theta(n log log n)', 'Theta(n)', 'Theta(n / log n)']
answer = 'B' if (is_n_loglog and is_not_nlogn and is_not_n) else 'X'""",
    {"given": r"\(T(n) = 2T(n/2) + n/\log_2 n\)", "find": "the growth of T(n)",
     "steps": [r"Master theorem does not apply: \(f(n) = n/\log n\) is smaller than \(n\) but not polynomially smaller.",
               r"Expand level by level for \(n = 2^k\): level \(i\) has \(2^i\) subproblems of size \(n/2^i\), each costing \(\frac{n/2^i}{k-i}\), so the level costs \(\frac{n}{k-i}\).",
               r"Sum over the levels: \(n\left(\frac1k + \frac1{k-1} + \dots + \frac11\right) = n\,H_k = \Theta(n \ln k)\).",
               r"Since \(k = \log_2 n\), this is \(\Theta(n \log\log n)\)."],
     "shortcut": "When every level costs n/(k-i), the total is n times a harmonic sum, which is a logarithm of the depth.",
     "trap": r"Using the Master theorem case \(\Theta(n\log n)\) because the number of levels is \(\log n\), ignoring that each level costs less than \(n\)."},
    options=opts(r"\(\Theta(n \log n)\)", r"\(\Theta(n \log\log n)\)", r"\(\Theta(n)\)", r"\(\Theta(n / \log n)\)"))

# 12 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000012", "Operating Systems", "Memory Management and Virtual Memory", "trace", "M", "NAT", 2,
    r"A process with a demand-paged virtual memory has \(3\) page frames, initially empty, and uses the Least Recently Used (LRU) replacement policy. The page reference string is \(4, 7, 6, 1, 7, 6, 1, 2, 7, 2, 4, 6, 1, 7, 5, 2\). The number of page faults is ______.",
    """refs = [4, 7, 6, 1, 7, 6, 1, 2, 7, 2, 4, 6, 1, 7, 5, 2]
frames = []
faults = 0
for p in refs:
    if p in frames:
        frames.remove(p)
        frames.append(p)
    else:
        faults += 1
        if len(frames) == 3:
            frames.pop(0)
        frames.append(p)
answer = faults""",
    {"given": "3 frames, LRU, 16 references", "find": "number of page faults",
     "steps": ["Keep the frames ordered from least to most recently used.",
               "4 F [4]; 7 F [4,7]; 6 F [4,7,6]; 1 F [7,6,1] (4 evicted); 7 hit [6,1,7]; 6 hit [1,7,6]; 1 hit [7,6,1]; 2 F [6,1,2] (7 evicted).",
               "7 F [1,2,7]; 2 hit [1,7,2]; 4 F [7,2,4]; 6 F [2,4,6]; 1 F [4,6,1]; 7 F [6,1,7]; 5 F [1,7,5]; 2 F [7,5,2].",
               "Faults: 4, 7, 6, 1, 2, 7, 4, 6, 1, 7, 5, 2 = 12."],
     "shortcut": "On a hit, move the page to the most-recent end; on a fault, evict from the least-recent end.",
     "trap": "Evicting the page that arrived first (FIFO) instead of the one used longest ago."})

# 13 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000013", "Computer Networks", "IP Addressing, Subnetting and CIDR", "numeric_chain", "M", "NAT", 2,
    r"An organisation is allotted the CIDR block \(130.45.0.0/18\). It divides the block into \(6\) subnets of equal size, using the smallest subnet size that gives at least \(6\) subnets. The number of usable host addresses (excluding network and broadcast addresses) in each subnet is ______.",
    """prefix = 18
subnets_needed = 6
extra = 0
while 2 ** extra < subnets_needed:
    extra += 1
new_prefix = prefix + extra
answer = 2 ** (32 - new_prefix) - 2""",
    {"given": "130.45.0.0/18, 6 equal subnets", "find": "usable hosts per subnet",
     "steps": [r"Subnets must be a power of two: the smallest count \(\ge 6\) is \(8 = 2^3\), so \(3\) bits are borrowed.",
               r"New prefix length \(= 18 + 3 = 21\), leaving \(32 - 21 = 11\) host bits.",
               r"Usable hosts \(= 2^{11} - 2 = 2046\)."],
     "shortcut": "Round the subnet count up to a power of two first; the borrowed bits are its exponent.",
     "trap": r"Forgetting to subtract the network and broadcast addresses (giving 2048), or borrowing only 2 bits because 6 is 'about 4' (giving 8190)."})

# 14 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000014", "Computer Organization and Architecture", "Number Representations & Floating Point", "conceptual", "M", "MCQ", 1,
    r"The 32-bit pattern \(\texttt{0xC1E80000}\) is interpreted as an IEEE 754 single-precision floating-point number (1 sign bit, 8 exponent bits with bias 127, 23 fraction bits). The decimal value represented is",
    """bits = 0xC1E80000
sign = -1 if (bits >> 31) & 1 else 1
exp = (bits >> 23) & 0xFF
frac = bits & 0x7FFFFF
val = sign * (1 + frac / 2 ** 23) * 2 ** (exp - 127)
opts = ['-29', '-58', '-14.5', '-26.5']
answer = 'ABCD'[opts.index(str(int(val)) if val == int(val) else str(val))]""",
    {"given": "0xC1E80000, IEEE 754 single precision", "find": "decimal value",
     "steps": ["0xC1E80000 = 1100 0001 1110 1000 0000 ... : sign bit 1 (negative).",
               r"Exponent bits \(10000011_2 = 131\), so the true exponent is \(131 - 127 = 4\).",
               r"Fraction bits \(1101000\ldots\): significand \(= 1.1101_2 = 1 + 0.5 + 0.25 + 0.0625 = 1.8125\).",
               r"Value \(= -1.8125 \times 2^4 = -29\)."],
     "shortcut": "Write the hex in binary, split 1 + 8 + 23, and read the significand as 1.f.",
     "trap": "Using exponent 131 directly (or 129) instead of subtracting the bias 127."},
    options=opts("\\(-29\\)", "\\(-58\\)", "\\(-14.5\\)", "\\(-26.5\\)"))

# 15 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000015", "Data Structures", "Trees: Binary Search Trees, AVL, Heaps", "trace", "H", "NAT", 2,
    r"The keys \(50, 30, 70, 20, 40, 60, 80, 35, 45, 65\) are inserted, in this order, into an initially empty binary search tree. The root is then deleted using its inorder successor (the successor's key replaces the root and the successor node is removed). The key at the node visited fifth in the level-order (breadth-first) traversal of the resulting tree is ______.",
    """# node = [key, left, right]
def ins(t, k):
    if t is None:
        return [k, None, None]
    if k < t[0]:
        t[1] = ins(t[1], k)
    else:
        t[2] = ins(t[2], k)
    return t
def minnode(t):
    while t[1]:
        t = t[1]
    return t
def delete(t, k):
    if t is None:
        return None
    if k < t[0]:
        t[1] = delete(t[1], k)
    elif k > t[0]:
        t[2] = delete(t[2], k)
    else:
        if t[1] is None:
            return t[2]
        if t[2] is None:
            return t[1]
        s = minnode(t[2])
        t[0] = s[0]
        t[2] = delete(t[2], s[0])
    return t
root = None
for k in [50, 30, 70, 20, 40, 60, 80, 35, 45, 65]:
    root = ins(root, k)
root = delete(root, 50)
order = []
q = [root]
while q:
    n = q.pop(0)
    order.append(n[0])
    if n[1]:
        q.append(n[1])
    if n[2]:
        q.append(n[2])
answer = order[4]""",
    {"given": "10 keys inserted into a BST; root deleted via inorder successor", "find": "fifth key in level order",
     "steps": ["Tree: 50 (30 (20, 40 (35, 45)), 70 (60 (-, 65), 80)).",
               "The inorder successor of 50 is the smallest key in its right subtree: 60. Copy 60 to the root and delete the old node 60; it has only a right child 65, which takes its place.",
               "New tree: 60 (30 (20, 40 (35, 45)), 70 (65, 80)).",
               "Level order: 60, 30, 70, 20, 40, 65, 80, 35, 45. The fifth key is 40."],
     "shortcut": "Redraw only the part that changes: the successor moves up and its right child fills the gap.",
     "trap": "Using the inorder predecessor (45) or forgetting that the successor's old position must be repaired."})

# 16 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000016", "Theory of Computation (TOC)", "Regular Expressions & Finite Automata (DFA/NFA Min)", "multi_concept", "H", "NAT", 2,
    r"Let \(L\) be the language of all binary strings in which the third symbol from the right end exists and is \(1\) (so strings of length less than \(3\) are not in \(L\)). The number of states in the minimal DFA accepting \(L\) is ______.",
    """# state = the last three symbols seen (left-padded with 0); accept when the third from the right is 1
states = [(a, b, c) for a in (0, 1) for b in (0, 1) for c in (0, 1)]
def step(s, x):
    return (s[1], s[2], x)
acc = {s for s in states if s[0] == 1}
part = [set(acc), set(states) - acc]
changed = True
while changed:
    changed = False
    new = []
    for g in part:
        sig = {}
        for s in g:
            key = tuple(next(i for i, h in enumerate(part) if step(s, x) in h) for x in (0, 1))
            sig.setdefault(key, set()).add(s)
        new += list(sig.values())
        changed = changed or len(sig) > 1
    part = new
answer = len(part)""",
    {"given": "binary strings whose 3rd symbol from the right is 1", "find": "states in the minimal DFA",
     "steps": ["The DFA must remember the last 3 symbols: 8 possible patterns.",
               r"Any two different patterns differ in some position \(j \in \{1,2,3\}\). Append \(3 - j\) symbols (any) so that this position becomes the third from the right; one string is then accepted and the other rejected. So all 8 patterns are distinguishable.",
               r"Strings shorter than 3 behave like their left-padded-with-0 versions, so they add no new states.",
               r"Minimal DFA has \(2^3 = 8\) states."],
     "shortcut": r"'The k-th symbol from the right' needs \(2^k\) states in a DFA (an NFA needs only \(k + 1\)).",
     "trap": "Counting the NFA size (4 states) or adding extra start-up states for strings shorter than 3."})

# 17 --------------------------------------------------------------------------------------------------------------
add("FORGE_CS_000017", "Discrete Mathematics", "Sets, Relations and Functions", "trap_aware", "H", "MCQ", 2,
    r"Let \(S = \{1, 2, 3, 4\}\). The number of relations on \(S\) that are both reflexive and antisymmetric is",
    """n = 4
pairs = [(a, b) for a in range(n) for b in range(n)]
count = 0
# brute force over all relations that contain the diagonal: 2^12 choices of the 12 off-diagonal ordered pairs
offd = [p for p in pairs if p[0] != p[1]]
for mask in range(2 ** len(offd)):
    rel = {(i, i) for i in range(n)} | {offd[j] for j in range(len(offd)) if (mask >> j) & 1}
    if all(not ((b, a) in rel and a != b) for (a, b) in rel):
        count += 1
opts = ['64', '243', '729', '4096']
answer = 'ABCD'[opts.index(str(count))]""",
    {"given": "S has 4 elements", "find": "number of reflexive, antisymmetric relations",
     "steps": ["Reflexive: all 4 pairs (i, i) must be present, so only the 12 off-diagonal ordered pairs are free.",
               r"Group them into \(\binom{4}{2} = 6\) unordered pairs \(\{a, b\}\). Antisymmetry forbids having both \((a,b)\) and \((b,a)\).",
               "For each unordered pair there are 3 allowed choices: neither, only (a,b), only (b,a).",
               r"Total \(= 3^6 = 729\)."],
     "shortcut": "Reflexive fixes the diagonal; antisymmetric gives 3 choices per unordered pair. Symmetric would give 2 choices instead.",
     "trap": r"Answering \(2^6 = 64\), which counts reflexive and symmetric relations."},
    options=opts("\\(64\\)", "\\(243\\)", "\\(729\\)", "\\(4096\\)"))

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
    # MCQ distractor sanity: four options, unique
    if it["options"]:
        assert len({o["text"] for o in it["options"]}) == 4, it["id"]
    out.append(it)
    print(it["id"], it["question_type"], it["answer"])

path = ROOT / "data" / "forge" / "CS" / "batches" / "b002.json"
path.write_text(json.dumps({"branch": "CS", "batch": "b002", "note": "Authored in a Claude session; every answer computed by its own verify code (author_b002.py), then validate.py.", "items": out}, ensure_ascii=False, indent=1), encoding="utf-8")
print("wrote", path)
