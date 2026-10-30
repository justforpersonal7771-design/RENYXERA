"""Forge batch b004 (CS), authored in a Claude session ($0). Every item's `verify` code is RUN here and its answer written into the item;
the batch is refused if any code fails. Then validate.py re-checks.

    python scripts/forge/author_b004.py && python scripts/forge/validate.py data/forge/CS/batches/b004.json
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


def add(id_, subject, topic, kind, diff, qtype, marks, text, code, solution, tol=0.0):
    ITEMS.append(dict(id=id_, subject=subject, topic=topic, kind=kind, difficulty=diff, question_type=qtype, marks=marks, question_text=text,
                      options=[], verify={"lang": "python", "code": code}, solution=solution, _tol=tol))


def sol(given, find, steps, shortcut, trap):
    return {"given": given, "find": find, "steps": steps, "shortcut": shortcut, "trap": trap}


# 30 B+ tree -----------------------------------------------------------------------------------------------------
add("FORGE_CS_000030", "Databases", "File Organization & Indexing (e.g., B and B+ Trees)", "numeric_chain", "H", "NAT", 2,
    r"A B+ tree index is built on a file. Each disk block is \(4096\) bytes, a search key is \(12\) bytes, a record pointer is \(8\) bytes and a block pointer is \(8\) bytes. Every internal node and every leaf node occupies exactly one block, and each leaf also stores one block pointer to the next leaf. The maximum number of record pointers that a \(3\)-level B+ tree (the root, one level of internal nodes, and the leaf level) can hold is ______.",
    """block = 4096
key = 12
rec = 8
ptr = 8
p = 0
while (p + 1) * ptr + p * key <= block:
    p += 1
q = 0
while (q + 1) * (key + rec) + ptr <= block:
    q += 1
answer = p * p * q""",
    sol("block 4096 B, key 12 B, record pointer 8 B, block pointer 8 B", "maximum record pointers in a 3-level B+ tree",
        [r"Internal node with \(p\) children holds \(p\) block pointers and \(p-1\) keys: \(8p + 12(p-1) \le 4096\), so \(20p \le 4108\) and \(p = 205\).",
         r"Leaf node with \(q\) keys holds \(q\) keys, \(q\) record pointers and one next-leaf pointer: \(20q + 8 \le 4096\), so \(q = 204\).",
         r"A 3-level tree: the root has up to \(205\) children, each of those has up to \(205\) leaf children, and each leaf has up to \(204\) record pointers.",
         r"Maximum \(= 205 \times 205 \times 204 = 8{,}573{,}100\)."],
        "Solve the block-size inequality once for internal nodes and once for leaves; then multiply fan-outs level by level.",
        "Using the same capacity for internal nodes and leaves, or forgetting the next-leaf pointer in the leaf."))

# 31 CRC ---------------------------------------------------------------------------------------------------------
def crc_trace(data, gen):
    d = list(map(int, data)) + [0] * (len(gen) - 1)
    g = list(map(int, gen))
    rows = []
    for i in range(len(data)):
        if d[i]:
            for j in range(len(g)):
                d[i + j] ^= g[j]
            rows.append("".join(map(str, d)))
    return rows


_rows = crc_trace("1101011", "1011")
add("FORGE_CS_000031", "Computer Networks", "Data Link Layer (Framing, Error Detection, MAC, Ethernet Bridging)", "numeric_chain", "M", "NAT", 1,
    r"A sender uses CRC error detection with the generator polynomial \(G(x) = x^3 + x + 1\). The data bits are \(1101011\). The CRC (the remainder appended to the data) is a \(3\)-bit string. The decimal value of this \(3\)-bit CRC is ______.",
    """data = [1, 1, 0, 1, 0, 1, 1]
gen = [1, 0, 1, 1]
d = data + [0, 0, 0]
for i in range(len(data)):
    if d[i] == 1:
        for j in range(len(gen)):
            d[i + j] = d[i + j] ^ gen[j]
rem = d[-3:]
answer = rem[0] * 4 + rem[1] * 2 + rem[2]""",
    sol("data 1101011, generator 1011", "decimal value of the 3-bit CRC",
        ["Generator \\(x^3 + x + 1\\) is the bit string 1011 (4 bits), so append 3 zeros: 1101011000.",
         "Divide by XOR (no borrows). Each line shows the bits after one XOR step, with the leading 1 cleared: " + ", ".join(_rows) + ".",
         "The last 3 bits after the final step are 110, which is the CRC.",
         r"\(110_2 = 6\)."],
        "Mod-2 long division: wherever the current leading bit is 1, XOR the generator under it; the last r bits are the CRC.",
        "Using ordinary subtraction instead of XOR, or appending 4 zeros (the generator length) instead of 3 (its degree)."))

# 32 Multi-level paging ------------------------------------------------------------------------------------------
add("FORGE_CS_000032", "Operating Systems", "Memory Management and Virtual Memory", "numeric_chain", "M", "NAT", 2,
    r"A system has a \(46\)-bit virtual address, a page size of \(8\) KB and a page-table entry of \(8\) bytes. The page table is organised as a multi-level table in which every table (at every level) occupies exactly one page. The minimum number of levels of page tables required to translate every virtual address is ______.",
    """va = 46
page = 8192
pte = 8
offset = 0
while 2 ** (offset + 1) <= page:
    offset += 1
per_level = 0
while 2 ** (per_level + 1) <= page // pte:
    per_level += 1
need = va - offset
levels = 0
covered = 0
while covered < need:
    covered += per_level
    levels += 1
answer = levels""",
    sol("46-bit virtual address, 8 KB pages, 8-byte entries", "minimum number of page-table levels",
        [r"Page offset \(= \log_2 8192 = 13\) bits, so the page number has \(46 - 13 = 33\) bits.",
         r"One page holds \(8192 / 8 = 1024 = 2^{10}\) entries, so each level can resolve \(10\) bits.",
         r"\(3\) levels resolve only \(30\) bits, which is not enough for \(33\); \(4\) levels resolve \(40 \ge 33\)."],
        r"Levels \(= \lceil (\text{VA bits} - \text{offset bits}) / \log_2(\text{entries per page}) \rceil\).",
        "Dividing the address size by the page size in bytes, or forgetting that every table must fit exactly one page."))

# 33 Huffman ------------------------------------------------------------------------------------------------------
add("FORGE_CS_000033", "Algorithms", "Greedy Approach & Divide-and-Conquer Designs", "trace", "M", "NAT", 2,
    r"A message of \(100\) characters uses six symbols whose frequencies (counts out of 100) are \(a = 5,\ b = 7,\ c = 10,\ d = 15,\ e = 20,\ f = 43\). Each symbol is given a Huffman code. The total number of bits needed to encode the whole message is ______.",
    """freq = [5, 7, 10, 15, 20, 43]
nodes = sorted(freq)
total = 0
while len(nodes) > 1:
    a = nodes.pop(0)
    b = nodes.pop(0)
    total += a + b
    nodes.append(a + b)
    nodes.sort()
answer = total""",
    sol("six symbol frequencies summing to 100", "total encoded length in bits",
        ["Repeatedly merge the two smallest: 5 + 7 = 12; 10 + 12 = 22; 15 + 20 = 35; 22 + 35 = 57; 43 + 57 = 100.",
         "The total encoded length equals the sum of the weights of all internal (merged) nodes, because each merge adds one bit to every symbol beneath it.",
         r"\(12 + 22 + 35 + 57 + 100 = 226\) bits.",
         "Check by code lengths: f = 1 bit (43), e = 3 bits (20), d = 3 bits (15), c = 3 bits (10), a and b = 4 bits (5, 7): 43 + 60 + 45 + 30 + 20 + 28 = 226."],
        "Sum of the internal-node weights equals the weighted path length: no need to assign the codes.",
        "Adding only the leaf frequencies (100), or merging the largest two by mistake."))

# 34 Dijkstra -----------------------------------------------------------------------------------------------------
add("FORGE_CS_000034", "Algorithms", "Graph Traversals (BFS, DFS) & Single-Source Shortest Paths", "trace", "M", "NAT", 2,
    r"An undirected weighted graph on vertices \(S, A, B, C, D\) has the edges \(SA = 4,\ SB = 1,\ BA = 2,\ AC = 1,\ BC = 5,\ CD = 3,\ BD = 9\). Dijkstra's algorithm is run from \(S\). The sum of the shortest-path distances from \(S\) to all five vertices (including \(S\) itself) is ______.",
    """edges = [('S','A',4),('S','B',1),('B','A',2),('A','C',1),('B','C',5),('C','D',3),('B','D',9)]
verts = ['S','A','B','C','D']
dist = {v: 10 ** 9 for v in verts}
dist['S'] = 0
done = set()
while len(done) < len(verts):
    u = min((v for v in verts if v not in done), key=lambda v: dist[v])
    done.add(u)
    for a, b, w in edges:
        if a == u and dist[u] + w < dist[b]:
            dist[b] = dist[u] + w
        if b == u and dist[u] + w < dist[a]:
            dist[a] = dist[u] + w
answer = sum(dist.values())""",
    sol("7 undirected weighted edges", "sum of shortest distances from S",
        ["Start: S = 0. Edges from S give A = 4, B = 1. Take the closest unvisited vertex B (1).",
         "From B: A = min(4, 1 + 2) = 3, C = 1 + 5 = 6, D = 1 + 9 = 10. Next closest: A (3).",
         "From A: C = min(6, 3 + 1) = 4. Next closest: C (4). From C: D = min(10, 4 + 3) = 7.",
         r"Distances: \(S = 0, B = 1, A = 3, C = 4, D = 7\); sum \(= 15\)."],
        "Write the distance table and update it only from the vertex just finalised.",
        "Using the direct edge SA = 4 or BD = 9 without checking shorter routes through other vertices."))

# 35 Heap ---------------------------------------------------------------------------------------------------------
add("FORGE_CS_000035", "Data Structures", "Binary Search Trees (BSTs) & Binary Heaps", "trace", "M", "NAT", 2,
    r"The keys \(25, 14, 32, 8, 41, 19, 27, 36\) are inserted one by one, in this order, into an initially empty binary max-heap stored in an array (index \(1\) is the root). Then the maximum is extracted twice (each extraction moves the last element to the root and sifts it down). The key stored at array index \(2\) after both extractions is ______.",
    """arr = []
def up(i):
    while i > 0 and arr[(i - 1) // 2] < arr[i]:
        arr[(i - 1) // 2], arr[i] = arr[i], arr[(i - 1) // 2]
        i = (i - 1) // 2
def down(i):
    n = len(arr)
    while True:
        l = 2 * i + 1
        r = 2 * i + 2
        m = i
        if l < n and arr[l] > arr[m]:
            m = l
        if r < n and arr[r] > arr[m]:
            m = r
        if m == i:
            break
        arr[i], arr[m] = arr[m], arr[i]
        i = m
for k in [25, 14, 32, 8, 41, 19, 27, 36]:
    arr.append(k)
    up(len(arr) - 1)
for _ in range(2):
    arr[0] = arr[-1]
    arr.pop()
    down(0)
answer = arr[1]""",
    sol("8 keys inserted into a max-heap, then two extract-max operations", "array element at index 2",
        ["Insertions (sift up): [25]; [25,14]; [32,14,25]; [32,14,25,8]; [41,32,25,8,14]; [41,32,25,8,14,19]; [41,32,27,8,14,19,25]; [41,36,27,32,14,19,25,8].",
         "First extract-max (remove 41): move 8 to the root and sift down: [36,32,27,8,14,19,25].",
         "Second extract-max (remove 36): move 25 to the root and sift down: [32,25,27,8,14,19].",
         "Index 2 (1-based) holds 25."],
        "Write the heap as an array after every step; sift-up compares with the parent (index i/2), sift-down with the larger child.",
        "Using 0-based indexing when the question counts from 1, or sifting the moved element only one level."))

# 36 No two consecutive ones ------------------------------------------------------------------------------------
add("FORGE_CS_000036", "Discrete Mathematics", "Combinatorics (Counting Rules, Summation Formulas)", "multi_concept", "M", "NAT", 1,
    r"The number of binary strings of length \(8\) that do not contain two consecutive \(1\)s is ______.",
    """count = 0
for x in range(256):
    if x & (x >> 1) == 0:
        count += 1
answer = count""",
    sol("binary strings of length 8", "strings with no two adjacent 1s",
        [r"Let \(a_n\) be the count for length \(n\). A valid string ends in 0 (any valid string of length \(n-1\) before it) or in 01 (any valid string of length \(n-2\) before it): \(a_n = a_{n-1} + a_{n-2}\).",
         r"\(a_1 = 2\) (0, 1) and \(a_2 = 3\) (00, 01, 10).",
         r"\(a_3 = 5,\ a_4 = 8,\ a_5 = 13,\ a_6 = 21,\ a_7 = 34,\ a_8 = 55\)."],
        "It is a Fibonacci recurrence: a_n = a_(n-1) + a_(n-2).",
        "Using 2^8 minus the strings that contain a 11 pair without handling overlaps (inclusion-exclusion gets messy); the recurrence is cleaner."))

# 37 DMA ----------------------------------------------------------------------------------------------------------
add("FORGE_CS_000037", "Computer Organization and Architecture", "I/O Interfaces (Interrupts & DMA Control Modes)", "numeric_chain", "M", "NAT", 1,
    r"A device transfers data to memory through a DMA controller in cycle-stealing mode at \(1\) MB/s (\(10^6\) bytes per second). The controller moves one byte per stolen CPU cycle. The CPU clock frequency is \(100\) MHz. The percentage of CPU cycles stolen by DMA is ______.",
    """bytes_per_sec = 1_000_000
cycles_per_byte = 1
cpu_hz = 100_000_000
answer = bytes_per_sec * cycles_per_byte / cpu_hz * 100""",
    sol("1 MB/s, one stolen cycle per byte, 100 MHz CPU", "percentage of CPU cycles stolen",
        [r"Stolen cycles per second \(= 10^6\) bytes \(\times 1\) cycle \(= 10^6\).",
         r"CPU cycles per second \(= 100 \times 10^6 = 10^8\).",
         r"Fraction stolen \(= 10^6 / 10^8 = 0.01 = 1\%\)."],
        "Percentage stolen = (bytes per second x cycles per byte) / clock frequency x 100.",
        "Comparing bytes per second with bits per second, or forgetting the clock is 100 times faster than the byte rate."))

# 38 Ripple counter -----------------------------------------------------------------------------------------------
add("FORGE_CS_000038", "Digital Logic", "Sequential Circuits (Flip-Flops, Registers, Counters)", "numeric_chain", "M", "NAT", 2,
    r"A modulo-\(100\) asynchronous (ripple) counter is built from the minimum number of flip-flops. Each flip-flop has a propagation delay of \(12\) ns, and the counter output is read only after the clock change has rippled through all the flip-flops. The maximum clock frequency at which the counter works correctly is ______ MHz (up to one decimal place).",
    """n = 0
while 2 ** n < 100:
    n += 1
period_ns = n * 12
answer = round(1000 / period_ns, 1)""",
    sol("mod-100 ripple counter, 12 ns per flip-flop", "maximum clock frequency",
        [r"Flip-flops needed: \(2^6 = 64 < 100 \le 128 = 2^7\), so \(n = 7\).",
         r"In a ripple counter the change travels through all stages one after another: settling time \(= 7 \times 12 = 84\) ns.",
         r"The clock period must be at least \(84\) ns, so \(f_{max} = 1/84\text{ ns} = 11.9\) MHz."],
        "Ripple counter: minimum clock period = (number of flip-flops) x (delay of one).",
        "Using the delay of one flip-flop (83.3 MHz): that is the limit for a synchronous counter, not a ripple counter."), tol=0.05)

# 39 Three-address code -------------------------------------------------------------------------------------------
add("FORGE_CS_000039", "Compiler Design", "Intermediate Code Generation & Local Code Optimization", "trace", "E", "NAT", 1,
    r"The expression \(a * b + c * d - e / (f + g)\) is translated into three-address code with no optimisation, one binary operation per instruction. The number of three-address instructions generated is ______.",
    """expr = "a*b+c*d-e/(f+g)"
answer = sum(1 for ch in expr if ch in "+-*/")""",
    sol("a*b + c*d - e/(f+g)", "number of three-address instructions",
        ["t1 = a * b; t2 = c * d; t3 = t1 + t2; t4 = f + g; t5 = e / t4; t6 = t3 - t5.",
         "Every binary operator needs exactly one instruction. The expression has 6 operators (*, *, +, +, /, -)."],
        "Count the binary operators: each one becomes one three-address instruction.",
        "Counting the operands (7) or forgetting the operator inside the parentheses."))

# 40 Natural join -------------------------------------------------------------------------------------------------
add("FORGE_CS_000040", "Databases", "Relational Models, Relational Algebra, Tuple Calculus", "trace", "E", "NAT", 1,
    r"Relation \(R(A, B)\) has the tuples \((1,x), (2,y), (3,x), (4,z), (5,y)\). Relation \(S(B, C)\) has the tuples \((x,10), (x,20), (y,30), (w,40)\). The number of tuples in the natural join \(R \bowtie S\) is ______.",
    """R = [(1, 'x'), (2, 'y'), (3, 'x'), (4, 'z'), (5, 'y')]
S = [('x', 10), ('x', 20), ('y', 30), ('w', 40)]
answer = sum(1 for a, b in R for c, d in S if b == c)""",
    sol("R(A,B) with 5 tuples, S(B,C) with 4 tuples", "size of the natural join",
        ["The join matches tuples on B. For B = x: R has 2 tuples (1 and 3), S has 2 tuples (10 and 20), giving 2 x 2 = 4.",
         "For B = y: R has 2 tuples (2 and 5), S has 1 tuple (30): 2 x 1 = 2.",
         "B = z appears only in R and B = w only in S, so they join with nothing.",
         "Total = 4 + 2 = 6."],
        "Group by the join value and multiply the counts from the two relations.",
        "Counting tuples that do not match (a left outer join would give 7), or multiplying all 5 x 4 tuples."))

# 41 Bayes --------------------------------------------------------------------------------------------------------
add("FORGE_CS_000041", "Engineering Mathematics", "Conditional Probability & Bayes Theorem", "multi_concept", "M", "NAT", 2,
    r"A disease affects \(1\%\) of a population. A test detects the disease in \(95\%\) of the people who have it (true positive rate), and wrongly reports it in \(10\%\) of the people who do not have it. A randomly chosen person tests positive. The probability that this person actually has the disease is ______ (rounded off to two decimal places).",
    """p_d = 0.01
tp = 0.95
fp = 0.10
answer = p_d * tp / (p_d * tp + (1 - p_d) * fp)""",
    sol("prevalence 1%, true positive 95%, false positive 10%", "P(disease | positive)",
        [r"\(P(+) = 0.01 \times 0.95 + 0.99 \times 0.10 = 0.0095 + 0.099 = 0.1085\).",
         r"\(P(D \mid +) = 0.0095 / 0.1085 \approx 0.0876\).",
         r"Rounded to two decimals: \(0.09\)."],
        "Bayes with a small prevalence: most positives are false positives, so the answer is much smaller than the test's 95%.",
        "Answering 0.95 (the test's sensitivity) instead of the probability of disease given a positive result."), tol=0.005)

# 42 Spanning trees ---------------------------------------------------------------------------------------------
add("FORGE_CS_000042", "Discrete Mathematics", "Graph Theory (Connectivity, Paths, Cycles, Trees)", "multi_concept", "H", "NAT", 2,
    r"Let \(G\) be the graph obtained from the complete graph \(K_4\) (4 vertices, 6 edges) by deleting exactly one edge. The number of distinct spanning trees of \(G\) is ______.",
    """edges = [(0, 1), (0, 2), (0, 3), (1, 2), (1, 3)]
n = 4
L = [[0] * n for _ in range(n)]
for a, b in edges:
    L[a][a] += 1
    L[b][b] += 1
    L[a][b] -= 1
    L[b][a] -= 1
M = [[fractions.Fraction(L[i][j]) for j in range(1, n)] for i in range(1, n)]
det = fractions.Fraction(1)
m = n - 1
for i in range(m):
    piv = next(r for r in range(i, m) if M[r][i] != 0)
    if piv != i:
        M[i], M[piv] = M[piv], M[i]
        det = -det
    det *= M[i][i]
    for r in range(i + 1, m):
        f = M[r][i] / M[i][i]
        for c in range(i, m):
            M[r][c] -= f * M[i][c]
answer = int(det)""",
    sol("K4 minus one edge", "number of spanning trees",
        [r"Cayley's formula: \(K_4\) has \(4^{4-2} = 16\) spanning trees, each with \(3\) edges.",
         r"By symmetry every one of the \(6\) edges lies in the same number of spanning trees: \(16 \times 3 / 6 = 8\).",
         r"Spanning trees that avoid the deleted edge \(= 16 - 8 = 8\)."],
        "Count the trees of the full graph that do NOT use the deleted edge: total minus those containing it.",
        "Answering 16 (the number for K4) or 10 (counting edge subsets instead of trees)."))

# ---------------------------------------------------------------------------------------------------------------
out = []
for it in ITEMS:
    tol = it.pop("_tol")
    val = run(it["verify"]["code"])
    it["answer"] = {"range": [round(val - tol, 6), round(val + tol, 6)]}
    out.append(it)
    print(it["id"], it["answer"])

path = ROOT / "data" / "forge" / "CS" / "batches" / "b004.json"
path.write_text(json.dumps({"branch": "CS", "batch": "b004", "note": "Authored in a Claude session; every answer computed by its own verify code (author_b004.py), then validate.py.", "items": out}, ensure_ascii=False, indent=1), encoding="utf-8")
print("wrote", path)
