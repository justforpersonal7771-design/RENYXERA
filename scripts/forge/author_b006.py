"""Forge batch b006 (CS), authored in a Claude session ($0): 6 MCQ, 4 MSQ, 2 NAT. Every item's `verify` code is RUN here and its answer written
into the item; the batch is refused if any code fails. Then validate.py re-checks.

    python scripts/forge/author_b006.py && python scripts/forge/validate.py data/forge/CS/batches/b006.json
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


# 55 FIRST set (MCQ) ---------------------------------------------------------------------------------------------
add("FORGE_CS_000055", "Compiler Design", "Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)", "multi_concept", "M", "MCQ", 2,
    r"Consider the grammar with start symbol \(S\): \(S \to A\,a\,B \mid B\), \(A \to b\,A \mid \varepsilon\), \(B \to c\,B \mid d\). Which one of the following is \(\text{FIRST}(S)\)?",
    """G = {'S': [['A', 'a', 'B'], ['B']], 'A': [['b', 'A'], []], 'B': [['c', 'B'], ['d']]}
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
                    if not first[s] <= first[n]:
                        first[n] |= first[s]
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
res = set(first['S'])
if nullable['S']:
    res.add('eps')
cands = [{'a', 'b', 'c'}, {'a', 'b', 'c', 'd'}, {'b', 'c', 'd', 'eps'}, {'a', 'c', 'd', 'eps'}]
answer = 'ABCD'[cands.index(res)]""",
    sol("S -> A a B | B; A -> b A | epsilon; B -> c B | d", "FIRST(S)",
        [r"\(\text{FIRST}(B) = \{c, d\}\) (B always starts with \(c\) or \(d\)); \(B\) is not nullable.",
         r"\(\text{FIRST}(A) = \{b, \varepsilon\}\): A starts with \(b\) or vanishes.",
         r"\(S \to A\,a\,B\): FIRST starts with FIRST(A) minus \(\varepsilon\), which is \(\{b\}\). Because \(A\) can vanish, \(a\) is also a possible first symbol: add \(\{a\}\).",
         r"\(S \to B\) adds \(\{c, d\}\). So \(\text{FIRST}(S) = \{a, b, c, d\}\), and \(\varepsilon\) is not in it because \(B\) cannot derive \(\varepsilon\)."],
        "Walk each production left to right, adding FIRST of each symbol while the previous symbols are nullable.",
        r"Forgetting that a nullable \(A\) exposes the next symbol \(a\), or adding \(\varepsilon\) to FIRST(S) just because A is nullable."),
    options=opts("{a, b, c}", "{a, b, c, d}", "{b, c, d, ε}", "{a, c, d, ε}"))

# 56 DFA language (MCQ) ------------------------------------------------------------------------------------------
add("FORGE_CS_000056", "Theory of Computation (TOC)", "Regular Expressions & Finite Automata (DFA/NFA Min)", "trace", "M", "MCQ", 1,
    r"A DFA over \(\{0, 1\}\) has start state \(q_0\) and the single accepting state \(q_2\). Its transitions are \(\delta(q_0,0) = q_1,\ \delta(q_0,1) = q_0,\ \delta(q_1,0) = q_1,\ \delta(q_1,1) = q_2,\ \delta(q_2,0) = q_1,\ \delta(q_2,1) = q_0\). The language accepted by this DFA is",
    """delta = {('q0', '0'): 'q1', ('q0', '1'): 'q0', ('q1', '0'): 'q1', ('q1', '1'): 'q2', ('q2', '0'): 'q1', ('q2', '1'): 'q0'}
def accepts(w):
    s = 'q0'
    for c in w:
        s = delta[(s, c)]
    return s == 'q2'
preds = [lambda w: w.endswith('01'), lambda w: '01' in w, lambda w: w.startswith('01'), lambda w: w.endswith('10')]
strings = []
for n in range(0, 10):
    for t in itertools.product('01', repeat=n):
        strings.append(''.join(t))
match = [i for i, f in enumerate(preds) if all(accepts(w) == f(w) for w in strings)]
answer = 'ABCD'[match[0]] if len(match) == 1 else 'X'""",
    sol("a 3-state DFA", "the accepted language",
        [r"\(q_1\) means 'the last symbol was \(0\)'; \(q_2\) means 'the last two symbols were \(01\)'; \(q_0\) is everything else.",
         r"From \(q_0\): a \(0\) goes to \(q_1\), a \(1\) stays. From \(q_1\): a \(0\) stays, a \(1\) reaches \(q_2\). From \(q_2\): any symbol leaves (a \(0\) goes to \(q_1\), a \(1\) goes to \(q_0\)), so the DFA is in \(q_2\) only right after reading \(01\) as the final two symbols.",
         "So it accepts exactly the strings ending in 01. (Checked against every string of length up to 9.)"],
        "Name each state by what it remembers; a state that is left on any further symbol marks an 'ends with' language.",
        "Choosing 'contains 01': the DFA does not stay accepting after seeing 01, since q2 moves on."),
    options=opts("All strings ending in 01", "All strings containing 01", "All strings starting with 01", "All strings ending in 10"))

# 57 Belady (MCQ) ------------------------------------------------------------------------------------------------
add("FORGE_CS_000057", "Operating Systems", "Memory Management and Virtual Memory", "trap_aware", "M", "MCQ", 1,
    r"The page reference string \(1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5\) is processed by a demand-paged system with FIFO page replacement. Initially all frames are empty. Which one of the following statements is TRUE?",
    """refs = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
def fifo(n):
    frames = []
    faults = 0
    for p in refs:
        if p not in frames:
            faults += 1
            if len(frames) == n:
                frames.pop(0)
            frames.append(p)
    return faults
f3 = fifo(3)
f4 = fifo(4)
answer = 'A' if f4 < f3 else ('B' if f4 > f3 else 'C')""",
    sol("FIFO, reference string of 12 pages", "relation between 3 and 4 frames",
        ["With 3 frames FIFO faults on: 1, 2, 3, 4, 1, 2, 5, 3, 4 = 9 page faults (the three hits are the 1 and 2 right after the first 5, and the final 5).",
         "With 4 frames FIFO faults on: 1, 2, 3, 4, 5, 1, 2, 3, 4, 5 = 10 page faults.",
         "More frames gave MORE faults: this is Belady's anomaly, which can occur with FIFO (but never with LRU or the optimal policy)."],
        "Simulate both frame counts; if the larger one faults more, it is Belady's anomaly.",
        "Assuming more memory can never hurt: that holds for stack algorithms (LRU, optimal) but not for FIFO."),
    options=opts("Four frames give fewer page faults than three", "Four frames give more page faults than three", "Three and four frames give the same number of faults", "The faults depend on the initial frame contents"))

# 58 SQL HAVING (MCQ) ---------------------------------------------------------------------------------------------
add("FORGE_CS_000058", "Databases", "SQL Queries (DDL/DML, Joins, Aggregations)", "trace", "E", "MCQ", 1,
    r"The table \(\text{Emp}(\text{dept}, \text{sal})\) has the rows \((A, 40000), (A, 70000), (B, 45000), (B, 50000), (C, 90000), (C, 20000), (C, 70000)\). The query SELECT dept FROM Emp GROUP BY dept HAVING AVG(sal) > 50000 returns the departments",
    """rows = [('A', 40000), ('A', 70000), ('B', 45000), ('B', 50000), ('C', 90000), ('C', 20000), ('C', 70000)]
depts = sorted({d for d, s in rows})
out = []
for d in depts:
    xs = [s for dd, s in rows if dd == d]
    if sum(xs) / len(xs) > 50000:
        out.append(d)
cands = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'B', 'C']]
answer = 'ABCD'[cands.index(out)]""",
    sol("a 7-row table, GROUP BY dept HAVING AVG(sal) > 50000", "departments returned",
        ["Averages: A = (40000 + 70000)/2 = 55000; B = (45000 + 50000)/2 = 47500; C = (90000 + 20000 + 70000)/3 = 60000.",
         "HAVING keeps the groups whose average is greater than 50000: A and C."],
        "GROUP BY first, then compute the aggregate per group, then filter groups with HAVING.",
        "Filtering rows with WHERE sal > 50000 before grouping (a different query), or using the overall average."),
    options=opts("A and B", "A and C", "B and C", "A, B and C"))

# 59 TCP slow start (MCQ) -----------------------------------------------------------------------------------------
add("FORGE_CS_000059", "Computer Networks", "Transport Layer (Flow Control and Congestion Control, TCP, UDP, Sockets)", "numeric_chain", "M", "MCQ", 1,
    r"A TCP sender starts with a congestion window of \(1\) MSS and a slow-start threshold of \(16\) MSS. There are no losses. In slow start the window doubles every RTT until it reaches the threshold; after that it grows by \(1\) MSS per RTT. During the \(7\)th RTT the congestion window (in MSS) is",
    """cwnd = 1
ssthresh = 16
w = []
for rtt in range(1, 8):
    w.append(cwnd)
    if cwnd < ssthresh:
        cwnd = min(cwnd * 2, ssthresh)
    else:
        cwnd += 1
opts = [17, 18, 19, 32]
answer = 'ABCD'[opts.index(w[6])]""",
    sol("initial cwnd 1, ssthresh 16, no loss", "cwnd in the 7th RTT",
        ["Slow start: RTT 1 = 1, RTT 2 = 2, RTT 3 = 4, RTT 4 = 8, RTT 5 = 16 (the threshold is reached).",
         "Congestion avoidance adds 1 per RTT: RTT 6 = 17, RTT 7 = 18."],
        "List the window RTT by RTT; the doubling stops exactly at the threshold.",
        "Continuing to double after reaching the threshold (32), or counting the window at the end instead of the start of the RTT."),
    options=opts("17", "18", "19", "32"))

# 60 Expanding opcode (MCQ) ---------------------------------------------------------------------------------------
add("FORGE_CS_000060", "Computer Organization and Architecture", "Machine Instructions & Addressing Modes", "numeric_chain", "H", "MCQ", 2,
    r"A processor has \(16\)-bit instructions and uses expanding opcodes. Every address field is \(4\) bits. Instructions have \(12\) three-address formats and \(30\) two-address formats already defined. The maximum number of one-address instructions that can still be defined is",
    """field = 4
first = 2 ** field
left3 = first - 12
two_space = left3 * 2 ** field
left2 = two_space - 30
one_space = left2 * 2 ** field
opts = [544, 512, 576, 510]
answer = 'ABCD'[opts.index(one_space)]""",
    sol("16-bit instructions, 4-bit address fields, 12 three-address and 30 two-address instructions", "maximum one-address instructions",
        [r"A three-address instruction has a 4-bit opcode and three 4-bit addresses. The 4-bit opcode has \(16\) patterns; \(12\) are used, so \(4\) patterns are free for longer opcodes.",
         r"Each free pattern is extended with another 4 bits (two-address instructions have an 8-bit opcode): \(4 \times 16 = 64\) two-address opcodes available; \(30\) are used, so \(34\) are free.",
         r"Each of those is extended by 4 more bits (one-address instructions have a 12-bit opcode): \(34 \times 16 = 544\)."],
        "Free patterns at one level, times 2^(address bits), become the available patterns at the next level.",
        "Multiplying by 2^4 only once, or counting the zero-address instructions as well (that would use up the patterns)."),
    options=opts("544", "512", "576", "510"))

# 61 Equivalent functions (MSQ) -----------------------------------------------------------------------------------
add("FORGE_CS_000061", "Digital Logic", "Combinational Logic (Multiplexers, Decoders, Adders)", "multi_concept", "M", "MSQ", 2,
    r"Let \(f(A, B) = \overline{A}B + A\overline{B} + AB\). Which of the following expressions is/are equal to \(f\) for all values of \(A\) and \(B\)? (Select all that apply.)",
    """f = lambda a, b: ((not a) and b) or (a and (not b)) or (a and b)
cands = [
    lambda a, b: a or b,
    lambda a, b: not ((not a) and (not b)),
    lambda a, b: a != b,
    lambda a, b: a or ((not a) and b),
]
vals = list(itertools.product([False, True], repeat=2))
answer = ['ABCD'[i] for i, g in enumerate(cands) if all((not f(a, b)) == (not g(a, b)) for a, b in vals)]""",
    sol("f = A'B + AB' + AB", "equivalent expressions",
        [r"\(f\) is true for \((0,1), (1,0), (1,1)\) and false only for \((0,0)\), so \(f = A + B\).",
         r"\(A + B\): equal. \(\overline{\overline{A}\,\overline{B}}\) is \(A + B\) by De Morgan: equal. \(A \oplus B\) is false at \((1,1)\): not equal. \(A + \overline{A}B = A + B\) (absorption): equal."],
        "Build the 4-row truth table of f once and compare each option with it.",
        r"Reading \(A \oplus B\) as equal because two of the three terms match: the term \(AB\) makes \(f\) true at (1,1), but XOR is false there."),
    options=opts(r"\(A + B\)", r"\(\overline{\overline{A}\,\overline{B}}\)", r"\(A \oplus B\)", r"\(A + \overline{A}B\)"))

# 62 Safe sequences (MSQ) -----------------------------------------------------------------------------------------
add("FORGE_CS_000062", "Operating Systems", "Deadlock Prevention, Avoidance, Detection, Recovery", "multi_concept", "H", "MSQ", 2,
    r"A system has \(4\) processes and \(3\) resource types. Allocation: \(P0 = (0,2,3),\ P1 = (0,1,3),\ P2 = (2,2,3),\ P3 = (0,0,3)\). Maximum: \(P0 = (1,4,6),\ P1 = (1,3,5),\ P2 = (5,2,6),\ P3 = (1,3,3)\). Available \(= (3,0,3)\). Which of the following orderings is/are safe sequences? (Select all that apply.)",
    """alloc = {'P0': (0, 2, 3), 'P1': (0, 1, 3), 'P2': (2, 2, 3), 'P3': (0, 0, 3)}
mx = {'P0': (1, 4, 6), 'P1': (1, 3, 5), 'P2': (5, 2, 6), 'P3': (1, 3, 3)}
avail = (3, 0, 3)
def safe(seq):
    work = list(avail)
    for p in seq:
        need = [mx[p][i] - alloc[p][i] for i in range(3)]
        if any(need[i] > work[i] for i in range(3)):
            return False
        work = [work[i] + alloc[p][i] for i in range(3)]
    return True
cands = [('P2', 'P0', 'P1', 'P3'), ('P0', 'P2', 'P1', 'P3'), ('P2', 'P1', 'P3', 'P0'), ('P3', 'P2', 'P0', 'P1')]
answer = ['ABCD'[i] for i, c in enumerate(cands) if safe(c)]""",
    sol("Allocation, Maximum and Available as given", "which orderings are safe",
        ["Need = Maximum - Allocation: P0 = (1,2,3), P1 = (1,2,2), P2 = (3,0,3), P3 = (1,3,0). Available = (3,0,3).",
         "Only P2 (needs 3,0,3) can run first: P0 needs 2 of Y and P1 needs 2 of Y, but none is free, and P3 needs 3 of Y.",
         "Order A: P2 runs (Work becomes 6,2,6), then P0 (needs 1,2,3), then P1, then P3: safe.",
         "Order B starts with P0, which needs (1,2,3) but only (3,0,3) is available: not safe. Order D starts with P3 (needs 1,3,0): not safe.",
         "Order C: P2, then P1 (needs 1,2,2 with Work 6,2,6), then P3, then P0: safe."],
        "A safe sequence must start with a process whose Need fits the Available vector, and each step adds the finished process's Allocation.",
        "Judging by process numbering: P0 first looks natural but its Need exceeds Available."),
    options=opts("P2, P0, P1, P3", "P0, P2, P1, P3", "P2, P1, P3, P0", "P3, P2, P0, P1"))

# 63 Stable sorts (MSQ) -------------------------------------------------------------------------------------------
add("FORGE_CS_000063", "Algorithms", "Searching, Sorting, Hashing Mechanisms", "conceptual", "M", "MSQ", 2,
    r"A sorting algorithm is stable if equal keys keep their original relative order. Which of the following implementations is/are stable? (Select all that apply.)",
    """def insertion(a):
    a = list(a)
    for i in range(1, len(a)):
        x = a[i]
        j = i - 1
        while j >= 0 and a[j][0] > x[0]:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = x
    return a
def selection(a):
    a = list(a)
    for i in range(len(a)):
        m = min(range(i, len(a)), key=lambda k: (a[k][0], k))
        a[i], a[m] = a[m], a[i]
    return a
def merge(a):
    if len(a) <= 1:
        return list(a)
    mid = len(a) // 2
    l = merge(a[:mid])
    r = merge(a[mid:])
    out = []
    i = j = 0
    while i < len(l) and j < len(r):
        if l[i][0] <= r[j][0]:
            out.append(l[i])
            i += 1
        else:
            out.append(r[j])
            j += 1
    return out + l[i:] + r[j:]
def heap(a):
    a = list(a)
    n = len(a)
    def sift(i, n):
        while True:
            l = 2 * i + 1
            r = 2 * i + 2
            m = i
            if l < n and a[l][0] > a[m][0]:
                m = l
            if r < n and a[r][0] > a[m][0]:
                m = r
            if m == i:
                return
            a[i], a[m] = a[m], a[i]
            i = m
    for i in range(n // 2 - 1, -1, -1):
        sift(i, n)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift(0, end)
    return a
data = [(2, 'a'), (2, 'b'), (1, 'c'), (2, 'd'), (1, 'e')]
def is_stable(f):
    for perm in itertools.permutations(data):
        if f(list(perm)) != sorted(perm, key=lambda x: x[0]):
            return False
    return True
answer = [l for l, f in zip('ABCD', [insertion, selection, merge, heap]) if is_stable(f)]""",
    sol("four textbook implementations", "which are stable",
        ["Insertion sort shifts only elements strictly greater than the key, so equal keys never pass each other: stable.",
         "Selection sort swaps the minimum into position i, which can jump an element over equal keys (for example 2a, 2b, 1c becomes 1c, 2b, 2a): not stable.",
         "Merge sort that takes from the left half when keys are equal keeps the original order: stable.",
         "Heap sort moves elements through swaps with far-away positions: not stable.",
         "(The code was also run on every ordering of a 5-element list with repeated keys to confirm.)"],
        "Ask whether the algorithm ever swaps or moves an element across an equal key.",
        "Assuming every comparison sort is stable, or thinking selection sort is stable because it 'always picks the first minimum'."),
    options=opts("Insertion sort", "Selection sort (swap the minimum into place)", "Merge sort (left half first on ties)", "Heap sort"))

# 64 Tautologies (MSQ) ------------------------------------------------------------------------------------------------
add("FORGE_CS_000064", "Discrete Mathematics", "Propositional and First-Order Quantifier Logic", "multi_concept", "M", "MSQ", 2,
    r"Which of the following propositional formulas is/are tautologies? (Select all that apply.)",
    """imp = lambda a, b: (not a) or b
cands = [
    lambda p, q, r: imp(p, q) or imp(q, p),
    lambda p, q, r: imp(imp(p, q), imp(q, p)),
    lambda p, q, r: imp(imp(p, q) and imp(q, r), imp(p, r)),
    lambda p, q, r: imp(p, q) and imp(q, p),
]
vals = list(itertools.product([False, True], repeat=3))
answer = ['ABCD'[i] for i, f in enumerate(cands) if all(f(*v) for v in vals)]""",
    sol("four formulas in p, q, r", "which are tautologies",
        [r"A: \((p \to q) \lor (q \to p)\). If \(p\) is false the first part is true; if \(p\) is true then \(q\to p\) is true. A tautology.",
         r"B: \((p \to q) \to (q \to p)\) is false when \(p\) is false and \(q\) is true (the premise is true, the conclusion false). Not a tautology.",
         r"C: \(((p \to q) \land (q \to r)) \to (p \to r)\) is the hypothetical syllogism: a tautology.",
         r"D: \((p \to q) \land (q \to p)\) is the equivalence \(p \leftrightarrow q\), false when \(p\) and \(q\) differ. Not a tautology."],
        "Look for one assignment that makes the formula false; if you cannot find one, check by truth table.",
        "Reading 'p -> q' and 'q -> p' as the same statement: the converse is not equivalent to the implication."),
    options=opts(r"\((p \to q) \lor (q \to p)\)", r"\((p \to q) \to (q \to p)\)", r"\(((p \to q) \land (q \to r)) \to (p \to r)\)", r"\((p \to q) \land (q \to p)\)"))

# 65 BOOKKEEPER (NAT) ---------------------------------------------------------------------------------------------------
add("FORGE_CS_000065", "Discrete Mathematics", "Combinatorics (Counting Rules, Summation Formulas)", "multi_concept", "M", "NAT", 1,
    r"The number of distinct arrangements of all the letters of the word BOOKKEEPER is ______.",
    """word = "BOOKKEEPER"
counts = {}
for ch in word:
    counts[ch] = counts.get(ch, 0) + 1
den = 1
for v in counts.values():
    den *= math.factorial(v)
answer = math.factorial(len(word)) // den""",
    sol("the letters B, O, O, K, K, E, E, E, P, R", "number of distinct arrangements",
        [r"There are \(10\) letters: B once, O twice, K twice, E three times, P once, R once.",
         r"Arrangements \(= \dfrac{10!}{2!\,2!\,3!} = \dfrac{3{,}628{,}800}{24} = 151{,}200\)."],
        "n! divided by the factorial of each repeated letter's count.",
        "Using 10! (treating identical letters as different) or dividing only by 3! for the three E's."))

# 66 C loop (NAT) -------------------------------------------------------------------------------------------------------
add("FORGE_CS_000066", "Programming in C", "Data Types, Syntax, Control Structures, Loops", "trace", "M", "NAT", 1,
    "What is the value returned by f(12) in the following C function?\n```\nint f(int n) {\n    int s = 0;\n    for (int i = 1; i <= n; i++) {\n        if (i % 3 == 0) continue;\n        if (i > 8) break;\n        s += i;\n    }\n    return s;\n}\n```\nThe value returned is ______.",
    """n = 12
s = 0
i = 1
while i <= n:
    if i % 3 == 0:
        i += 1
        continue
    if i > 8:
        break
    s += i
    i += 1
answer = s""",
    sol("loop with continue and break", "value of f(12)",
        [r"For \(i = 1, 2\): added (1 + 2 = 3). \(i = 3\): multiple of 3, skipped by continue.",
         r"\(i = 4, 5\): added (3 + 4 + 5 = 12). \(i = 6\): skipped. \(i = 7, 8\): added (12 + 7 + 8 = 27). \(i = 9\): multiple of 3, skipped.",
         r"\(i = 10\): not a multiple of 3 and \(i > 8\), so the loop breaks. The function returns \(27\)."],
        "Tabulate i, then apply continue (skip) before break (stop).",
        "Checking the break condition before the continue, which would stop at i = 9 instead of skipping it (same sum here, but the order matters in general)."))

# ---------------------------------------------------------------------------------------------------------------
out = []
for it in ITEMS:
    tol = it.pop("_tol")
    val = run(it["verify"]["code"])
    if it["question_type"] == "NAT":
        it["answer"] = {"range": [round(val - tol, 6), round(val + tol, 6)]}
    elif it["question_type"] == "MCQ":
        assert isinstance(val, str) and val in ["A", "B", "C", "D"], (it["id"], val)
        it["answer"] = {"options": [val]}
    else:
        assert isinstance(val, list) and val and all(v in "ABCD" for v in val), (it["id"], val)
        it["answer"] = {"options": val}
    if it["options"]:
        assert len({o["text"] for o in it["options"]}) == 4, it["id"]
    out.append(it)
    print(it["id"], it["question_type"], it["answer"])

path = ROOT / "data" / "forge" / "CS" / "batches" / "b006.json"
path.write_text(json.dumps({"branch": "CS", "batch": "b006", "note": "Authored in a Claude session; every answer computed by its own verify code (author_b006.py), then validate.py.", "items": out}, ensure_ascii=False, indent=1), encoding="utf-8")
print("wrote", path)
