"""Forge b009 replacements for slots 6, 18, 30, 34, 41, 42, 45, 47, 48 (the first versions overlapped existing questions).
Run: python scripts/forge/author_b009_p3.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b009")

# 6 cache metadata bits (NAT 1)
K.add(6, r"A direct-mapped write-back data cache holds \(8\) KB of data in \(16\)-byte lines. Addresses are \(32\) bits wide. Every line stores a tag, one valid bit and one dirty bit in addition to its data. The total number of bits used for tags, valid bits and dirty bits over the whole cache is ______.",
"""lines = 8 * 1024 // 16
off = 4
idx = lines.bit_length() - 1
tag = 32 - off - idx
answer = lines * (tag + 2)""",
steps=["Number of lines \\(= 8192/16 = 512\\), so the index uses 9 bits and the offset 4 bits; the tag is \\(32 - 9 - 4 = 19\\) bits.", "Per line: \\(19 + 1 + 1 = 21\\) bits; over 512 lines: «answer» bits."],
trap="Counting only the tags, or using the cache size in bytes as the number of lines.", short="Lines \\(\\times\\) (tag + valid + dirty).", kind="numeric_chain")

# 18 BFS distance facts (MSQ 1)
K.add(18, r"A messaging app links ten-minute-apart relay nodes \(0, \dots, 5\) with the connections \(0\text{-}1,\ 0\text{-}2,\ 1\text{-}3,\ 2\text{-}3,\ 3\text{-}4,\ 4\text{-}5,\ 2\text{-}5\). Messages travel along connections and each hop takes the same time. Which of the following statements is/are TRUE?",
"""E = [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4), (4, 5), (2, 5)]
adj = {v: [] for v in range(6)}
for a, b in E:
    adj[a].append(b)
    adj[b].append(a)
def bfs(s):
    d = {s: 0}
    ways = {s: 1}
    q = [s]
    while q:
        u = q.pop(0)
        for v in adj[u]:
            if v not in d:
                d[v] = d[u] + 1
                ways[v] = 0
                q.append(v)
            if d[v] == d[u] + 1:
                ways[v] += ways[u]
    return d, ways
d0, w0 = bfs(0)
diam = max(max(bfs(s)[0].values()) for s in range(6))
truth = [d0[5] == 3, w0[3] == 2, diam == 3, d0[4] == 3]""",
stmts=[r"The fewest hops from node 0 to node 5 is 3.", r"There are exactly 2 different shortest paths from node 0 to node 3.", r"The largest of all shortest-path distances between pairs of nodes (the diameter) is 3.", r"The fewest hops from node 0 to node 4 is 3."],
steps=["Breadth-first search from node 0: level 1 is \\(\\{1, 2\\}\\); level 2 is \\(\\{3, 5\\}\\) (5 via 2); level 3 is \\(\\{4\\}\\).", "So node 5 is 2 hops away (not 3), node 4 is 3 hops away, and node 3 is reached by two shortest paths (via 1 and via 2).", "The largest distance between any pair is 3, between 0 and 4 (and between 1 and 5)."],
trap="Following the chain 3-4-5 instead of using the shortcut 2-5.", short="Run BFS level by level and count the parents at the previous level.", kind="msq_discriminator")

# 30 deadlock detection (MSQ 2)
K.add(30, r"A system with three resource types uses deadlock detection with multiple instances. Current allocation: \(P_0 = (1,0,0),\ P_1 = (0,1,1),\ P_2 = (1,1,0),\ P_3 = (0,0,1)\). Outstanding requests: \(P_0 = (0,1,0),\ P_1 = (1,0,0),\ P_2 = (0,0,0),\ P_3 = (1,1,2)\). Currently free: \((0,0,0)\). Which of the following statements is/are TRUE?",
"""alloc = [(1, 0, 0), (0, 1, 1), (1, 1, 0), (0, 0, 1)]
req = [(0, 1, 0), (1, 0, 0), (0, 0, 0), (1, 1, 2)]
work = [0, 0, 0]
fin = [False] * 4
ch = True
while ch:
    ch = False
    for i in range(4):
        if not fin[i] and all(req[i][k] <= work[k] for k in range(3)):
            work = [work[k] + alloc[i][k] for k in range(3)]
            fin[i] = True
            ch = True
dead = [i for i in range(4) if not fin[i]]
truth = [len(dead) > 0, 3 in dead, 0 in dead, fin[2] and fin[1]]
dl = ', '.join('P' + str(i) for i in dead)""",
stmts=[r"The system is in a deadlocked state.", r"\(P_3\) is deadlocked.", r"\(P_0\) is deadlocked.", r"Both \(P_1\) and \(P_2\) can run to completion."],
steps=["\\(P_2\\) requests nothing, so it finishes and frees \\((1,1,0)\\); then \\(P_0\\) (needs \\((0,1,0)\\)) and \\(P_1\\) (needs \\((1,0,0)\\)) can finish in turn, freeing their allocations.", "After all three have finished the free vector is \\((2,2,1)\\), but \\(P_3\\) still needs \\((1,1,2)\\): it can never be satisfied, so the deadlocked set is «dl»."],
trap="Running the safety algorithm with the maximum demand instead of the outstanding requests.", short="Mark every process whose current request can be met, release its resources, repeat; the unmarked ones are deadlocked.", kind="msq_discriminator")

# 34 DFA states (MCQ 1, key A)
K.add(34, r"Let \(L = \{ w \in \{a, b\}^* : |w| \ge 3 \text{ and the third symbol of } w \text{ (from the left) is } a \}\). The number of states in the minimal complete DFA for \(L\) is",
"""def words(n):
    out = ['']
    cur = ['']
    for _ in range(n):
        cur = [w + c for w in cur for c in 'ab']
        out = out + cur
    return out
W = words(6)
pred = lambda w: len(w) >= 3 and w[2] == 'a'
val = len(set(tuple(pred(u + v) for v in W) for u in W))
wrong = [4, 6, 8]""",
steps=["The DFA must count the first three symbols: states for lengths 0, 1 and 2 (3 states).", "After the third symbol the outcome is fixed: one state that accepts everything afterwards (third symbol \\(a\\)) and one dead state (third symbol \\(b\\)). Total «val» states."],
trap="Forgetting the dead state, or splitting the first two positions by their symbols (they do not matter).", short="Count what must be remembered: only the position, until the third symbol decides.", kind="multi_concept")

# 41 optimal page replacement (NAT 2)
K.add(41, r"A process has \(3\) page frames, initially empty, and the operating system uses the optimal page-replacement policy (replace the page whose next use lies farthest in the future, or that is never used again). The reference string is \(2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2\). The number of page faults is ______.",
"""refs = [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2]
frames = []
faults = 0
for t, r in enumerate(refs):
    if r in frames:
        continue
    faults += 1
    if len(frames) < 3:
        frames.append(r)
    else:
        def nxt(p):
            for k in range(t + 1, len(refs)):
                if refs[k] == p:
                    return k
            return 10 ** 9
        victim = max(frames, key=nxt)
        frames[frames.index(victim)] = r
answer = faults""",
steps=["On each fault with full frames, look ahead and evict the resident page whose next reference is farthest away.", "Tracing the twelve references gives «answer» faults; no policy can do better."],
trap="Using LRU or FIFO, which can only match or exceed the optimal count.", short="OPT needs the future: look ahead from the current position.", kind="trace")

# 42 ripple-carry delay (NAT 1)
K.add(42, r"A 16-bit ripple-carry adder is built from full adders. In each full adder the carry output becomes valid \(20\) ps after its carry input, and a sum output becomes valid \(30\) ps after its carry input (the operands are available at time 0, and the carry into the lowest stage is available at time 0 too). The time, in picoseconds, at which the most significant sum bit becomes valid is ______.",
"""n = 16
answer = (n - 1) * 20 + 30""",
steps=["The carry into the most significant stage has to ripple through the 15 lower stages: \\(15 \\times 20 = 300\\) ps.", "The top sum bit then needs 30 ps more: \\(300 + 30 = «answer»\\) ps."],
trap="Multiplying all 16 stages by 20 and adding 30 (350 ps), which counts one carry delay too many.", short="\\((n - 1) \\times t_{carry} + t_{sum}\\).", kind="numeric_chain")

# 45 LOOK scheduling (NAT 2)
K.add(45, r"A disk head is at cylinder \(120\) and moving towards lower cylinder numbers. The pending requests are for cylinders \(30, 145, 90, 15, 160, 55, 110, 75\). With the LOOK algorithm the head serves requests in its current direction until the last request in that direction, then reverses (without going to the end of the disk) and serves the remaining requests, stopping at the last one. The total head movement, in cylinders, is ______.",
"""head = 120
reqs = [30, 145, 90, 15, 160, 55, 110, 75]
down = sorted((r for r in reqs if r <= head), reverse=True)
up = sorted(r for r in reqs if r > head)
tot = 0
pos = head
for r in down:
    tot += pos - r
    pos = r
for r in up:
    tot += r - pos
    pos = r
answer = tot""",
steps=["Moving down from 120 to the lowest request 15: \\(120 - 15 = 105\\).", "Reversing and moving up to the highest request 160: \\(160 - 15 = 145\\). Total \\(105 + 145 = «answer»\\)."],
trap="Sweeping to cylinder 0 first (that is SCAN) or serving the requests in arrival order.", short="Movement = distance to the nearest extreme request, then the full span between the extreme requests.", kind="trace")

# 47 hypergeometric variance (MCQ 2, key B)
K.add(47, r"A box holds \(3\) white and \(5\) black balls. Four balls are drawn at random without replacement. Let \(X\) be the number of white balls drawn. The variance of \(X\), correct to three decimal places, is",
"""tot = math.comb(8, 4)
pm = {k: math.comb(3, k) * math.comb(5, 4 - k) / tot for k in range(0, 4)}
m = sum(k * p for k, p in pm.items())
val = round(sum((k - m) ** 2 * p for k, p in pm.items()), 3)
wrong = [0.469, 0.938, 1.5]""",
steps=["\\(X\\) is hypergeometric with \\(N = 8,\\ K = 3,\\ n = 4\\): \\(E[X] = 4 \\times 3/8 = 1.5\\).", "\\(\\text{Var}(X) = n\\frac{K}{N}\\left(1 - \\frac{K}{N}\\right)\\frac{N - n}{N - 1} = 4 \\cdot \\frac38 \\cdot \\frac58 \\cdot \\frac47 \\approx «val»\\)."],
trap="Using the binomial variance \\(np(1-p) = 0.9375\\), which ignores the finite-population correction.", short="Hypergeometric variance has the extra factor \\((N - n)/(N - 1)\\).", kind="application")

# 48 product DFA states (MCQ 1, key D)
K.add(48, r"A sensor emits a stream of two kinds of pulses, a and b. A controller must raise its output flag exactly when the number of a pulses so far is a multiple of \(3\) and, at the same time, the number of b pulses so far is a multiple of \(4\) (zero counts as a multiple). The controller is to be implemented as a finite-state machine with the fewest possible states that gives the correct flag after every prefix of the stream. The number of states of such a machine is",
"""def words(n):
    out = ['']
    cur = ['']
    for _ in range(n):
        cur = [w + c for w in cur for c in 'ab']
        out = out + cur
    return out
W = words(7)
pred = lambda w: w.count('a') % 3 == 0 and w.count('b') % 4 == 0
val = len(set(tuple(pred(u + v) for v in W) for u in W))
wrong = [7, 8, 16]""",
steps=["The DFA must remember the number of a's modulo 3 and the number of b's modulo 4 independently: \\(3 \\times 4\\) combinations.", "All pairs are reachable and pairwise distinguishable (add enough a's or b's to reach acceptance from only one of them), so the minimal DFA has «val» states."],
trap="Adding the state counts (3 + 4 = 7) instead of multiplying them for an intersection.", short="Independent counters multiply the number of states.", kind="multi_concept")

K.save("p3")
