"""Forge b008 part 6 (slots 80-104). Authored in a local Claude Code session; run: python scripts/forge/author_b008_p6.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b008")

# 80 branch target (NAT 2)
K.add(80, r"A processor has fixed 32-bit instructions aligned on 4-byte boundaries. A conditional branch contains a 16-bit signed offset that counts instructions, not bytes, and the target address is computed as (address of the next instruction) + offset \(\times 4\). The branch is at address \(4096\) (decimal) and its offset field is the hexadecimal value \(\texttt{0xFFF0}\). The target address, written as a decimal number, is ______.",
"""off = 0xFFF0
if off >= 0x8000:
    off -= 0x10000
nxt = 4096 + 4
answer = nxt + off * 4""",
steps=["\\(\\texttt{0xFFF0}\\) as a 16-bit two's complement number is \\(-16\\).", "Target \\(= (4096 + 4) + (-16) \\times 4 = «answer»\\)."],
trap="Using the branch address instead of the next instruction's address, or treating 0xFFF0 as the positive number 65520.", short="Sign-extend the offset, scale by 4, add to PC + 4.", kind="application")

# 81 pointer arithmetic (MCQ 1, key C)
K.add(81, r"""A programmer inspects the expression below after the array is set up.
```c
int x[] = {10, 20, 30, 40, 50};
int *p = x;
p += 3;
int r = *(p - 1) + p[1] - *x;
```
What is the value left in `r`?""",
"""x = [10, 20, 30, 40, 50]
p = 3
val = x[p - 1] + x[p + 1] - x[0]
wrong = [60, 80, 90]""",
steps=["After `p += 3`, `p` points at `x[3] = 40`.", "`*(p - 1)` is `x[2] = 30`, `p[1]` is `x[4] = 50` and `*x` is `x[0] = 10`: \\(30 + 50 - 10 = «val»\\)."],
trap="Taking `p[1]` as the element after `x[1]`, forgetting that `p` has moved.", short="Index relative to where `p` points now.", kind="trace")

# 82 nullity (MCQ 1, key B)
K.add(82, r"An engineer collects three measurements of five unknown quantities \(x_1, \dots, x_5\). Writing every measurement as a linear equation equal to zero gives the coefficient table \(\begin{pmatrix} 1 & 2 & 0 & 1 & 3 \\ 0 & 1 & 1 & 0 & 2 \\ 1 & 3 & 1 & 1 & 5 \end{pmatrix}\). The number of free parameters needed to describe every solution of this system (the dimension of the null space) is",
"""M = [[1, 2, 0, 1, 3], [0, 1, 1, 0, 2], [1, 3, 1, 1, 5]]
A = [[fractions.Fraction(x) for x in r] for r in M]
rank = 0
for c in range(5):
    p = next((r for r in range(rank, 3) if A[r][c] != 0), None)
    if p is None:
        continue
    A[rank], A[p] = A[p], A[rank]
    for r in range(3):
        if r != rank and A[r][c] != 0:
            f = A[r][c] / A[rank][c]
            A[r] = [A[r][k] - f * A[rank][k] for k in range(5)]
    rank += 1
val = 5 - rank
wrong = [2, 4, 5]""",
steps=["The third row equals the sum of the first two, so the rank is \\(«rank»\\).", "Dimension of the solution space \\(= 5 - \\text{rank} = «val»\\)."],
trap="Reporting the rank (2) or the number of equations minus the rank (1).", short="Nullity \\(=\\) number of unknowns \\(-\\) rank.", kind="application")

# 83 CPI with hazards (NAT 2)
K.add(83, r"In a five-stage pipelined processor an ideal instruction takes one cycle per instruction. \(25\%\) of the instructions are loads and \(30\%\) of the loads are immediately followed by an instruction that uses the loaded value, costing \(1\) stall cycle. \(20\%\) of the instructions are branches; \(40\%\) of the branches are taken, each taken branch costing \(3\) stall cycles. The average cycles per instruction, correct to three decimal places, is ______.",
"""answer = round(1 + 0.25 * 0.30 * 1 + 0.20 * 0.40 * 3, 3)""",
steps=["Load-use stalls per instruction \\(= 0.25 \\times 0.30 \\times 1 = 0.075\\).", "Branch stalls per instruction \\(= 0.20 \\times 0.40 \\times 3 = 0.24\\).", "\\(\\text{CPI} = 1 + 0.075 + 0.24 = «answer»\\)."],
trap="Charging the branch penalty for all branches (not just the taken ones).", short="CPI \\(= 1 + \\sum (\\text{frequency} \\times \\text{probability} \\times \\text{penalty})\\).", kind="numeric_chain")

# 84 calculus facts (MSQ 2)
K.add(84, r"Four claims are made about the values of some definite integrals and about the mean value theorem for a cubic function. Select every claim that is correct.",
"""def simpson(f, a, b, n=2000):
    h = (b - a) / n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i % 2 else 2) * f(a + i * h)
    return s * h / 3
i1 = simpson(math.sin, 0, math.pi)
i2 = simpson(lambda x: x * math.exp(x), 0, 1)
c = math.sqrt(4 / 3)
mvt = 0 < c < 2 and abs(3 * c * c - (8 - 0) / 2) < 1e-9
i4 = simpson(lambda x: x ** 3, -1, 1)
truth = [abs(i1 - 2) < 1e-6, abs(i2 - 1) < 1e-6, mvt, abs(i4 - 2) < 1e-6]""",
stmts=[r"\(\int_0^{\pi} \sin x \, dx = 2\)", r"\(\int_0^{1} x e^{x} \, dx = 1\)", r"For \(f(x) = x^3\) on \([0, 2]\), the mean value theorem holds with some \(c \in (0, 2)\) satisfying \(3c^2 = 4\).", r"\(\int_{-1}^{1} x^3 \, dx = 2\)"],
steps=["\\(\\int_0^\\pi \\sin x\\,dx = [-\\cos x]_0^\\pi = 2\\), and by parts \\(\\int_0^1 x e^x dx = [(x-1)e^x]_0^1 = 1\\).", "The mean value theorem needs \\(f'(c) = (8 - 0)/2 = 4\\), i.e. \\(c = 2/\\sqrt3 \\approx 1.155 \\in (0, 2)\\).", "\\(x^3\\) is an odd function, so \\(\\int_{-1}^{1} x^3 dx = 0\\), not 2."],
trap="Forgetting that an odd integrand over a symmetric interval integrates to 0.", short="Check each integral by the antiderivative; use symmetry for the last one.", kind="msq_discriminator")

# 85 division (MCQ 1, key B)
K.add(85, r"""A relation \(\text{Took}(S, C)\) records which student took which course: \((s_1, c_1), (s_1, c_2), (s_2, c_1), (s_3, c_1), (s_3, c_2), (s_3, c_3), (s_4, c_2)\). Another relation \(\text{Need}(C)\) holds \(\{c_1, c_2\}\). The number of tuples in \(\text{Took} \div \text{Need}\) (the students who took every course in Need) is""",
"""took = [('s1', 'c1'), ('s1', 'c2'), ('s2', 'c1'), ('s3', 'c1'), ('s3', 'c2'), ('s3', 'c3'), ('s4', 'c2')]
need = set(['c1', 'c2'])
students = sorted(set(s for s, c in took))
res = [s for s in students if need <= set(c for t, c in took if t == s)]
val = len(res)
names = ', '.join(res)
wrong = [1, 3, 4]""",
steps=["Group by student: \\(s_1 \\to \\{c_1, c_2\\}\\), \\(s_2 \\to \\{c_1\\}\\), \\(s_3 \\to \\{c_1, c_2, c_3\\}\\), \\(s_4 \\to \\{c_2\\}\\).", "Only «names» contain both \\(c_1\\) and \\(c_2\\): «val» tuples."],
trap="Counting the students who took at least one required course (4).", short="Division keeps the groups that contain the whole divisor set.", kind="application")

# 86 insertion-sort comparisons (MCQ 2, key D)
K.add(86, r"Insertion sort (scanning each new element leftwards, comparing it with the element before it and stopping as soon as that element is not larger) is applied to the array \(7, 3, 9, 1, 8, 2, 6\). The total number of key comparisons made is",
"""a = [7, 3, 9, 1, 8, 2, 6]
cmp_ = 0
for i in range(1, len(a)):
    k = a[i]
    j = i - 1
    while j >= 0:
        cmp_ += 1
        if a[j] > k:
            a[j + 1] = a[j]
            j -= 1
        else:
            break
    a[j + 1] = k
val = cmp_
inv = sum(1 for i in range(7) for j in range(i + 1, 7) if [7, 3, 9, 1, 8, 2, 6][i] > [7, 3, 9, 1, 8, 2, 6][j])
wrong = [val + 1, val - 2, val + 3]""",
steps=["The number of shifts equals the number of inversions: «inv».", "Each insertion also makes one extra comparison that stops the scan, except when the element reaches the front. Counting step by step gives «val» comparisons."],
trap="Reporting the number of inversions (the shifts) and forgetting the comparison that stops each scan.", short="Comparisons \\(=\\) inversions \\(+\\) (insertions that stop before the front).", kind="trace")

# 87 effective address (NAT 1)
K.add(87, r"An addressing mode computes the effective address as base register + (index register \(\times\) scale) + displacement. The base register holds \(\texttt{0x2000}\), the index register holds \(5\), the scale factor is \(8\), and the displacement is \(\texttt{0x24}\). The effective address, as a decimal number, is ______.",
"""answer = 0x2000 + 5 * 8 + 0x24""",
steps=["\\(\\texttt{0x2000} = 8192\\), \\(5 \\times 8 = 40\\), \\(\\texttt{0x24} = 36\\).", "Effective address \\(= 8192 + 40 + 36 = «answer»\\)."],
trap="Multiplying the base or the displacement by the scale factor.", short="Only the index is scaled.", kind="application")

# 88 SRTF waiting (NAT 1)
K.add(88, r"Five processes arrive at times \(0, 1, 2, 3, 4\) with CPU bursts \(8, 4, 2, 1, 3\) ms. Under shortest-remaining-time-first (preemptive SJF, ties broken in favour of the process that arrived earlier), the average waiting time, in ms, is ______.",
"""procs = [(0, 8), (1, 4), (2, 2), (3, 1), (4, 3)]
rem = [b for a, b in procs]
t = 0
fin = {}
while len(fin) < 5:
    ready = [i for i, (a, b) in enumerate(procs) if a <= t and rem[i] > 0]
    if not ready:
        t += 1
        continue
    i = min(ready, key=lambda k: (rem[k], procs[k][0]))
    rem[i] -= 1
    t += 1
    if rem[i] == 0:
        fin[i] = t
wait = [fin[i] - procs[i][0] - procs[i][1] for i in range(5)]
answer = sum(wait) / 5""",
steps=["Simulate one millisecond at a time, always running the process with the least remaining time.", "Completion times give waiting times «wait» ms; the average is «answer» ms."],
trap="Treating the schedule as non-preemptive SJF.", short="Waiting \\(=\\) completion \\(-\\) arrival \\(-\\) burst.", kind="trace")

# 89 direct mapped hits (NAT 1)
K.add(89, r"A small data cache is organised with one possible line for each memory block (direct mapping), eight lines in all, each line holding sixteen consecutive bytes. The cache starts out holding nothing. A program then reads the following byte addresses one after another: \(0, 4, 16, 128, 0, 16, 132, 256, 0, 128\). Counting a read as a hit only when its block is already in its line, the number of hits observed is ______.",
"""cache = {}
hits = 0
for ad in [0, 4, 16, 128, 0, 16, 132, 256, 0, 128]:
    blk = ad // 16
    idx = blk % 8
    if cache.get(idx) == blk:
        hits += 1
    else:
        cache[idx] = blk
answer = hits""",
steps=["Block number \\(= \\lfloor \\text{address}/16 \\rfloor\\), index \\(=\\) block number mod 8. Addresses 0, 128 and 256 all map to index 0 and keep evicting each other.", "Tracking the cache contents after each access gives «answer» hits."],
trap="Forgetting that blocks 0, 8 and 16 share index 0 and conflict.", short="Write index and tag for each address, then replay.", kind="trace")

# 90 pipeline cycles with hazards (NAT 2)
K.add(90, r"A five-stage pipeline (IF, ID, EX, MEM, WB) has no forwarding. The register file is written in the first half of a cycle and read in the second half, so an instruction can read a register in the same cycle in which the producer writes it back. The six instructions \(I_1\): ADD R1,R2,R3; \(I_2\): SUB R4,R1,R5; \(I_3\): MUL R6,R4,R7; \(I_4\): AND R8,R9,R10; \(I_5\): OR R11,R6,R8; \(I_6\): XOR R12,R11,R1 are executed in this order. The total number of cycles to complete all six is ______.",
"""deps = {0: [], 1: [0], 2: [1], 3: [], 4: [2, 3], 5: [4, 0]}
t = [0] * 6
t[0] = 2
for i in range(1, 6):
    t[i] = t[i - 1] + 1
    for j in deps[i]:
        t[i] = max(t[i], t[j] + 3)
answer = t[5] + 3""",
steps=["An instruction's ID can be in the cycle where its producer is in WB, which is 3 cycles after the producer's ID.", "Scheduling the IDs gives «t» as the ID cycles of \\(I_1, \\dots, I_6\\); \\(I_6\\) finishes 3 cycles after its ID: «answer» cycles in all."],
trap="Using full forwarding (10 cycles) or stalling two cycles after every dependent instruction.", short="ID of a consumer \\(\\ge\\) ID of its producer \\(+ 3\\).", kind="trace")

# 91 postorder (MCQ 2, key A)
K.add(91, r"The keys \(30, 20, 10, 25, 40, 35, 50, 45\) are inserted in this order into an initially empty binary search tree. The third key visited in a postorder traversal of the tree is",
"""root = None
def ins(t, k):
    if t is None:
        return [k, None, None]
    if k < t[0]:
        t[1] = ins(t[1], k)
    else:
        t[2] = ins(t[2], k)
    return t
for k in [30, 20, 10, 25, 40, 35, 50, 45]:
    root = ins(root, k)
def post(t):
    return [] if t is None else post(t[1]) + post(t[2]) + [t[0]]
po = post(root)
val = po[2]
wrong = [x for x in po if x != val][:3]
order = po""",
steps=["The tree is 30 (20 (10, 25), 40 (35, 50 (45, -))).", "Postorder (left, right, root) visits «order»; the third key is «val»."],
trap="Reading the postorder as the reverse of the insertion order or as the preorder.", short="Postorder visits both subtrees before the node.", kind="trace")

# 92 shortest path to destination (MCQ 2, key D)
K.add(92, r"A network of routers \(S, A, B, C, D, T\) has links with costs: S-A \(2\), S-B \(5\), A-B \(1\), A-C \(7\), B-C \(3\), B-D \(6\), C-D \(2\), C-T \(4\), D-T \(1\). Each router forwards packets for \(T\) along its least-cost path. The number of routers, other than \(D\) and \(T\) themselves, whose least-cost path to \(T\) passes through \(D\) is",
"""W = {}
for a, b, w in [('S', 'A', 2), ('S', 'B', 5), ('A', 'B', 1), ('A', 'C', 7), ('B', 'C', 3), ('B', 'D', 6), ('C', 'D', 2), ('C', 'T', 4), ('D', 'T', 1)]:
    W[(a, b)] = w
    W[(b, a)] = w
nodes = 'SABCDT'
dist = {v: 10 ** 9 for v in nodes}
dist['T'] = 0
nxt = {}
done = set()
while len(done) < 6:
    u = min([v for v in nodes if v not in done], key=lambda v: dist[v])
    done.add(u)
    for v in nodes:
        if (u, v) in W and dist[u] + W[(u, v)] < dist[v]:
            dist[v] = dist[u] + W[(u, v)]
            nxt[v] = u
def through(v):
    while v in nxt:
        v = nxt[v]
        if v == 'D':
            return True
    return False
val = len([v for v in nodes if v not in ('T', 'D') and through(v)])
ds = ' '.join(str(dist[v]) for v in 'SABCD')
wrong = [2, 3, 5]""",
steps=["Dijkstra from \\(T\\) gives the least costs to \\(T\\) for \\(S, A, B, C, D\\): «ds».", "\\(C\\) goes through \\(D\\) (\\(2 + 1 = 3 < 4\\) for the direct link); \\(B\\) goes through \\(C\\) (cost \\(3 + 3 = 6\\), whereas going straight to \\(D\\) costs \\(6 + 1 = 7\\)), so \\(B\\) also passes through \\(D\\); \\(A\\) goes through \\(B\\) and \\(S\\) through \\(A\\), hence also through \\(D\\). The routers are \\(S, A, B, C\\): «val» of them."],
trap="Using the direct link C-T (cost 4) instead of C-D-T (cost 3).", short="Run Dijkstra from the destination and follow the next hops.", kind="trap_aware")

# 93 stack permutations (MSQ 2)
K.add(93, r"The numbers \(1, 2, 3, 4\) are pushed onto an initially empty stack in this order, and pops may be interleaved with pushes at any time. Which of the following output sequences is/are possible?",
"""def possible(out):
    stack = []
    nxt = 1
    for x in out:
        while (not stack or stack[-1] != x) and nxt <= 4:
            stack.append(nxt)
            nxt += 1
        if not stack or stack[-1] != x:
            return False
        stack.pop()
    return True
truth = [possible([3, 2, 1, 4]), possible([3, 1, 2, 4]), possible([2, 4, 3, 1]), possible([4, 1, 2, 3])]""",
stmts=[r"\(3, 2, 1, 4\)", r"\(3, 1, 2, 4\)", r"\(2, 4, 3, 1\)", r"\(4, 1, 2, 3\)"],
steps=["To output 3 first, 1 and 2 must already be under 3 on the stack, so they can only come out as 2 then 1: \\(3, 2, 1, 4\\) is possible and \\(3, 1, 2, 4\\) is not.", "\\(2, 4, 3, 1\\): push 1, 2, pop 2; push 3, 4, pop 4, 3, then 1: possible. \\(4, 1, 2, 3\\) needs 1 before 3 but 1 is buried under 2 and 3: impossible."],
trap="Checking only the first element of each sequence.", short="Once a larger number is output, the smaller ones still on the stack must come out in decreasing order.", kind="msq_discriminator")

# 94 spanning trees of a wheel (NAT 2)
K.add(94, r"The wheel graph \(W_4\) has a hub vertex joined to each of four rim vertices, and the four rim vertices form a cycle (8 edges, 5 vertices). The number of distinct spanning trees of \(W_4\) is ______.",
"""n = 5
E = [(0, i) for i in range(1, 5)] + [(1, 2), (2, 3), (3, 4), (4, 1)]
L = [[fractions.Fraction(0)] * n for _ in range(n)]
for a, b in E:
    L[a][a] += 1
    L[b][b] += 1
    L[a][b] -= 1
    L[b][a] -= 1
M = [row[1:] for row in L[1:]]
m = n - 1
d = fractions.Fraction(1)
for i in range(m):
    p = next((r for r in range(i, m) if M[r][i] != 0), None)
    if p != i:
        M[i], M[p] = M[p], M[i]
        d = -d
    d = d * M[i][i]
    for r in range(i + 1, m):
        f = M[r][i] / M[i][i]
        M[r] = [M[r][k] - f * M[i][k] for k in range(m)]
answer = int(d)""",
steps=["Build the Laplacian matrix (degree on the diagonal, \\(-1\\) for each edge) and delete one row and column (Kirchhoff's matrix-tree theorem).", "The determinant of the remaining \\(4 \\times 4\\) matrix is «answer», the number of spanning trees."],
trap="Counting the spanning trees of the rim cycle alone (4) or using the number of edges.", short="For the wheel \\(W_n\\): \\(L_{2n} - 2\\) with Lucas numbers; \\(n = 4\\) gives 45.", kind="multi_concept")

# 95 pointer to pointer (MCQ 2, key B)
K.add(95, r"""A programme manipulates two integers through a pointer and a pointer to a pointer.
```c
int a = 5, b = 7;
int *p = &a, *q = &b;
int **r = &p;
**r += *q;
*r = q;
**r *= 2;
int v = a + b + *p;
```
The final value of `v` is""",
"""mem = {'a': 5, 'b': 7}
p = 'a'
q = 'b'
r = 'p'
ptr = {'p': 'a', 'q': 'b'}
mem[ptr[r]] += mem[ptr['q']]
ptr[r] = ptr['q']
mem[ptr[r]] *= 2
val = mem['a'] + mem['b'] + mem[ptr['p']]
wrong = [38, 26, 31]""",
steps=["`**r += *q` adds 7 to `a` through `p`: \\(a = 12\\). `*r = q` makes `p` point to `b`.", "`**r *= 2` now doubles `b`: \\(b = 14\\), and `*p` is `b`.", "\\(v = 12 + 14 + 14 = «val»\\)."],
trap="Forgetting that after `*r = q` the pointer `p` no longer points to `a`, so `*p` is 14, not 12.", short="Track what each pointer points to after each statement.", kind="trace")

# 96 AMAT two-level (NAT 2)
K.add(96, r"A two-level cache hierarchy has an L1 hit time of \(1\) ns and an L1 miss rate of \(5\%\). The L2 hit time is \(10\) ns and its local miss rate is \(20\%\). Main memory takes \(100\) ns to access. The average memory access time, in nanoseconds, is ______.",
"""answer = round(1 + 0.05 * (10 + 0.20 * 100), 4)""",
steps=["Cost of an L1 miss \\(= 10 + 0.2 \\times 100 = 30\\) ns.", "\\(\\text{AMAT} = 1 + 0.05 \\times 30 = «answer»\\) ns."],
trap="Using the global instead of the local L2 miss rate.", short="AMAT \\(= t_1 + m_1(t_2 + m_2 t_{mem})\\).", kind="numeric_chain")

# 97 two-hop fragments (MCQ 2, key A)
K.add(97, r"A datagram with \(3000\) bytes of data (plus a \(20\)-byte IP header) crosses a network with an MTU of \(1500\) bytes and then a second network with an MTU of \(600\) bytes; intermediate routers fragment as needed and fragments are never reassembled before the destination. The number of fragments that arrive at the destination is",
"""def frag(sizes, mtu):
    per = (mtu - 20) // 8 * 8
    out = []
    for s in sizes:
        while s > per:
            out.append(per)
            s -= per
        out.append(s)
    return out
f1 = frag([3000], 1500)
f2 = frag(f1, 600)
val = len(f2)
wrong = [4, 6, 9]""",
steps=["First link: \\(\\lfloor 1480/8 \\rfloor \\times 8 = 1480\\) data bytes per fragment: 1480, 1480 and 40 (3 fragments).", "Second link: at most 576 data bytes per fragment: each 1480-byte fragment becomes 576, 576, 328 (3 each), and the 40-byte one stays whole: \\(3 + 3 + 1 = «val»\\)."],
trap="Computing the fragment count from the smaller MTU alone (6), without the first split.", short="Fragment each existing fragment again; the data of a fragment can only shrink to multiples of 8.", kind="multi_concept")

# 98 Bayes (NAT 2)
K.add(98, r"A health department screens a large town for a rare infection that is present in one person out of every hundred. The screening kit gives a positive reading for \(95\%\) of infected people, but it also gives a positive reading for \(8\%\) of people who are not infected. One resident, picked at random, is found positive. Correct to two decimal places, the chance that this resident really is infected is ______.",
"""p = 0.01
sens = 0.95
fp = 0.08
answer = round(p * sens / (p * sens + (1 - p) * fp), 2)""",
steps=["\\(P(+) = 0.01 \\times 0.95 + 0.99 \\times 0.08 = 0.0095 + 0.0792 = 0.0887\\).", "\\(P(D \\mid +) = 0.0095 / 0.0887 \\approx «answer»\\)."],
trap="Answering 0.95 (the sensitivity) and ignoring the low prevalence.", short="Most positives come from the large healthy group.", kind="application")

# 99 MUX data input (MCQ 2, key A)
K.add(99, r"A function \(f(A, B, C) = \sum m(1, 2, 4, 7)\) (with \(A\) the most significant bit) is implemented with a \(4 \times 1\) multiplexer whose select lines are \(S_1 = A\) and \(S_0 = B\). The data input \(I_1\) (selected when \(A = 0, B = 1\)) must be connected to",
"""f = lambda a, b, c: 1 if (a * 4 + b * 2 + c) in (1, 2, 4, 7) else 0
lo, hi = f(0, 1, 0), f(0, 1, 1)
names = {(0, 0): '\\\\(0\\\\)', (1, 1): '\\\\(1\\\\)', (0, 1): '\\\\(C\\\\)', (1, 0): '\\\\(\\\\bar{C}\\\\)'}
val = names[(lo, hi)]
wrong = [x for x in names.values() if x != val][:3]""",
steps=["For \\(A = 0, B = 1\\) the function becomes a function of \\(C\\) alone: \\(f(0,1,0) = f(m_2) = 1\\) and \\(f(0,1,1) = f(m_3) = 0\\).", "The function equals 1 when \\(C = 0\\) and 0 when \\(C = 1\\): that is \\(\\bar{C}\\), so \\(I_1\\) is connected to «val»."],
trap="Reading the minterm numbers with \\(C\\) as the most significant bit.", short="Fix the select lines, then read the output as a function of the remaining variable.", kind="application")

# 100 quicksort comparisons (MCQ 2, key A)
K.add(100, r"Quicksort with the last element as pivot (Lomuto partition: each of the other elements in the current subarray is compared once with the pivot) is applied to \(4, 9, 2, 7, 5, 1, 8\). The total number of comparisons with a pivot, over the whole run, is",
"""a = [4, 9, 2, 7, 5, 1, 8]
cnt = [0]
def qs(lo, hi):
    if lo >= hi:
        return
    pv = a[hi]
    i = lo - 1
    for j in range(lo, hi):
        cnt[0] += 1
        if a[j] <= pv:
            i += 1
            a[i], a[j] = a[j], a[i]
    a[i + 1], a[hi] = a[hi], a[i + 1]
    qs(lo, i)
    qs(i + 2, hi)
qs(0, 6)
val = cnt[0]
wrong = [val + 1, val - 2, val + 4]""",
steps=["Each partition of a subarray of size \\(m\\) makes \\(m - 1\\) comparisons: the first partition makes 6.", "Following the recursion on the two sides of each pivot and adding the comparisons gives «val» in total."],
trap="Using the average-case estimate \\(n \\log_2 n\\) instead of simulating this input.", short="Sum \\(m - 1\\) over every subarray of size \\(m \\ge 2\\) that gets partitioned.", kind="trace")

# 101 divide and conquer recurrence (MCQ 2, key C)
K.add(101, r"Which of the following gives the correct asymptotic growth of the recurrence \(T(n) = 2T(n/2) + n \log_2 n\) with \(T(1) = 1\)?",
"""def T(k):
    t = 1.0
    for j in range(1, k + 1):
        n = 2.0 ** j
        t = 2 * t + n * j
    return t
def ratio(f, k):
    return T(k) / f(2.0 ** k, k)
cands = [lambda n, k: n * k, lambda n, k: n * n, lambda n, k: n * k * k, lambda n, k: n * k ** 3]
def settles(f):
    r1, r2 = ratio(f, 30), ratio(f, 60)
    return abs(r2 / r1 - 1) < 0.05 and r2 > 0.01
truth = [settles(f) for f in cands]""",
stmts=[r"\(\Theta(n \log n)\)", r"\(\Theta(n^2)\)", r"\(\Theta(n \log^2 n)\)", r"\(\Theta(n \log^3 n)\)"],
steps=["The recursion tree has \\(\\log n\\) levels; level \\(i\\) costs \\(\\sum n \\log(n/2^i) \\approx n(\\log n - i)\\).", "Summing over the levels: \\(n \\sum_{i}(\\log n - i) = \\Theta(n \\log^2 n)\\) (case 2 of the extended master theorem with \\(k = 1\\)). Dividing \\(T(n)\\) by \\(n \\log^2 n\\) settles at a constant, while the other ratios drift."],
trap="Applying the plain master theorem case 2 (\\(\\Theta(n \\log n)\\)), which holds only when the driving term is \\(\\Theta(n)\\).", short="Extended master theorem: \\(f(n) = n \\log^k n\\) gives \\(\\Theta(n \\log^{k+1} n)\\).", kind="multi_concept")

# 102 closed sets (NAT 2)
K.add(102, r"A relation \(R(A, B, C, D)\) satisfies the dependencies \(A \to B,\ B \to C,\ D \to A\). A set of attributes \(X\) is closed if \(X^{+} = X\). The number of closed subsets of \(\{A, B, C, D\}\) (including the empty set) is ______.",
"""attrs = 'ABCD'
F = [('A', 'B'), ('B', 'C'), ('D', 'A')]
def closure(s):
    s = set(s)
    ch = True
    while ch:
        ch = False
        for l, r in F:
            if set(l) <= s and not set(r) <= s:
                s = s | set(r)
                ch = True
    return s
closed = []
for k in range(0, 5):
    for c in itertools.combinations(attrs, k):
        if closure(c) == set(c):
            closed.append(''.join(c) or 'empty')
answer = len(closed)
cl = ', '.join(closed)""",
steps=["A set is closed when applying the dependencies adds nothing: it is closed under implication.", "The closed sets are «cl»: «answer» of the 16 subsets."],
trap="Counting the superkeys or the candidate keys instead of the closed sets.", short="Test each of the 16 subsets by taking its closure.", kind="multi_concept")

# 103 2-way LRU hits (NAT 1)
K.add(103, r"A two-way set-associative cache has \(4\) sets and \(8\)-byte blocks, uses LRU replacement and is initially empty. Byte addresses \(0, 32, 64, 0, 32, 96, 0, 64\) are read in this order. The number of cache hits is ______.",
"""sets = {i: [] for i in range(4)}
hits = 0
for ad in [0, 32, 64, 0, 32, 96, 0, 64]:
    blk = ad // 8
    s = blk % 4
    if blk in sets[s]:
        hits += 1
        sets[s].remove(blk)
        sets[s].append(blk)
    else:
        if len(sets[s]) == 2:
            sets[s].pop(0)
        sets[s].append(blk)
answer = hits""",
steps=["Block number \\(= \\lfloor \\text{address}/8 \\rfloor\\), set \\(=\\) block number mod 4. Addresses 0, 32, 64, 96 are blocks 0, 4, 8, 12, all in set 0 (two ways).", "Replaying with LRU gives «answer» hits."],
trap="Using FIFO instead of LRU, which changes which block is evicted.", short="Keep each set as a list ordered from least to most recently used.", kind="trace")

# 104 last fragment length (MCQ 2, key B)
K.add(104, r"A router receives a packet carrying \(4000\) bytes of user data behind a \(20\)-byte network header and has to forward it on an outgoing interface whose largest permitted frame payload is \(1400\) bytes. Each piece it creates repeats the \(20\)-byte header and (except the last) is filled with the most data that the offset rules allow. What does the Total Length field of the final piece contain?",
"""data = 4000
per = (1400 - 20) // 8 * 8
rem = data
while rem > per:
    rem -= per
val = rem + 20
wrong = [rem, per, 1400]""",
steps=["Data per fragment \\(= \\lfloor 1380/8 \\rfloor \\times 8 = 1376\\) bytes.", "Two full fragments carry 2752 bytes, leaving \\(4000 - 2752 = 1248\\) bytes; with the header, total length \\(= «val»\\)."],
trap="Reporting the data length without the header, or the MTU.", short="The last fragment carries whatever is left.", kind="application")

K.save("p6")
