"""Forge b010 part 1: designed to the Forge rubric (blend of topics, realistic scenario, 3+ steps, misconception distractors).
Run: python scripts/forge/author_b010_p1.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b010")

# 3 pipeline + branch prediction + two caches -> execution time (NAT)
K.add(3, r"A \(2\) GHz processor has a 5-stage pipeline with an ideal CPI of \(1\). Of its instructions, \(25\%\) are loads and \(20\%\) are branches. Forwarding is used, but a load followed immediately by a dependent instruction still costs \(1\) stall cycle, and \(40\%\) of loads are followed by such an instruction. The branch predictor is correct for \(85\%\) of the branches; a misprediction costs \(3\) cycles. Every instruction fetch misses the instruction cache with probability \(0.02\), and every load misses the data cache with probability \(0.05\); each cache miss costs \(40\) cycles. The program has \(10^8\) instructions. Its execution time, in milliseconds, is ______.",
"""cpi = 1 + 0.25 * 0.4 * 1 + 0.2 * 0.15 * 3 + 0.02 * 40 + 0.25 * 0.05 * 40
answer = round(cpi * 1e8 / 2e9 * 1000, 2)""",
steps=["Add every stall source to the ideal CPI: load-use \\(0.25 \\times 0.4 \\times 1 = 0.10\\); branch \\(0.2 \\times 0.15 \\times 3 = 0.09\\); instruction cache \\(0.02 \\times 40 = 0.80\\); data cache \\(0.25 \\times 0.05 \\times 40 = 0.50\\).", "\\(\\text{CPI} = 1 + 0.10 + 0.09 + 0.80 + 0.50 = «cpi»\\).", "Time \\(= \\text{CPI} \\times 10^8 / (2 \\times 10^9)\\) s \\(= «answer»\\) ms."],
trap="Charging the instruction-cache miss only to loads, or the data-cache miss to every instruction, instead of weighting each by how often it happens.", short="CPI = 1 + sum of (frequency x probability x penalty) over every stall source; then time = CPI x N / f.", kind="multi_concept")

# 2 file system reads: inode, index blocks, data blocks (NAT)
K.add(2, r"A backup tool reads a file of exactly \(5{,}000{,}000\) bytes sequentially from its first byte. The file system uses \(1\) KB blocks (\(1024\) bytes) and \(4\)-byte block pointers. Each inode holds \(12\) direct pointers, one single-indirect pointer and one double-indirect pointer. The inode is read once, and each index block (single-indirect, double-indirect or second-level) is read from disk once and then kept in memory while the file is read; every data block is read once. The total number of disk block reads is ______.",
"""block = 1024
per = block // 4
size = 5000000
data = -(-size // block)
rest = data - 12 - per
second = -(-rest // per)
answer = 1 + data + 1 + 1 + second""",
steps=["Data blocks: \\(\\lceil 5{,}000{,}000 / 1024 \\rceil = «data»\\). Each index block holds \\(1024/4 = «per»\\) pointers.", "The first \\(12\\) blocks are direct and the next \\(«per»\\) are reached through the single-indirect block, leaving «rest» blocks for the double-indirect tree, which needs \\(\\lceil «rest» / «per» \\rceil = «second»\\) second-level index blocks.", "Reads: inode \\(1\\) + data «data» + single-indirect \\(1\\) + double-indirect \\(1\\) + second-level «second» \\(= «answer»\\)."],
trap="Forgetting the first-level double-indirect block, or counting the second-level blocks as 256 instead of only those the file actually uses.", short="Count data blocks, then only the index blocks whose pointers the file really needs.", kind="application")

# 5 shortest paths with a negative edge: Dijkstra vs Bellman-Ford vs the weight-shift trick (MSQ)
K.add(5, r"A directed graph on vertices \(0\) to \(4\) has the weighted edges \(0 \to 1\,(1)\), \(0 \to 2\,(3)\), \(2 \to 1\,(-3)\), \(1 \to 3\,(1)\) and \(3 \to 4\,(2)\); it has no negative cycle. Single-source shortest paths from vertex \(0\) are wanted. Which of the following statements is/are TRUE? (Dijkstra's algorithm here means: repeatedly remove the unfinished vertex of least estimate, finalise it, and relax its outgoing edges only towards unfinished vertices.)",
"""E = [(0, 1, 1), (0, 2, 3), (2, 1, -3), (1, 3, 1), (3, 4, 2)]
N = 5
INF = 10 ** 9
def bf(E):
    d = [INF] * N
    d[0] = 0
    passes = 0
    while True:
        ch = False
        for a, b, w in E:
            if d[a] < INF and d[a] + w < d[b]:
                d[b] = d[a] + w
                ch = True
        if not ch:
            break
        passes += 1
    return d, passes
true, passes = bf(E)
def dij(E):
    d = [INF] * N
    d[0] = 0
    done = [False] * N
    for _ in range(N):
        u = -1
        for v in range(N):
            if not done[v] and d[v] < INF and (u == -1 or d[v] < d[u]):
                u = v
        if u == -1:
            break
        done[u] = True
        for a, b, w in E:
            if a == u and not done[b] and d[u] + w < d[b]:
                d[b] = d[u] + w
    return d
dj = dij(E)
Es = [(a, b, w + 2) for a, b, w in E]
def bfp(E):
    d = [INF] * N
    d[0] = 0
    par = [-1] * N
    for _ in range(N):
        for a, b, w in E:
            if d[a] < INF and d[a] + w < d[b]:
                d[b] = d[a] + w
                par[b] = a
    return d, par
ds, par = bfp(Es)
wmap = {(a, b): w for a, b, w in E}
v = 4
cost = 0
while par[v] != -1:
    cost += wmap[(par[v], v)]
    v = par[v]
t4 = true[4]
d4 = dj[4]
t1 = true[1]
truth = [dj[4] == true[4], true[1] == 0, passes == 1, cost == true[4]]""",
stmts=[r"Dijkstra's algorithm, as described, reports the correct shortest distance to vertex \(4\).", r"The true shortest distance from vertex \(0\) to vertex \(1\) is \(0\).", r"Bellman-Ford, relaxing the edges in the order listed, changes some estimate only in its first pass; the second pass changes nothing.", r"Adding \(2\) to every edge weight (to make all weights non-negative) and running Dijkstra gives a path to vertex \(4\) whose original weight is the true shortest distance."],
steps=["Bellman-Ford (edges in the listed order): after one pass \\(d_1 = 0\\) (through \\(2\\)), \\(d_2 = 3\\), \\(d_3 = 1\\), \\(d_4 = «t4»\\); a second pass changes nothing.", "Dijkstra finalises vertex \\(1\\) with estimate \\(1\\) before it has seen the edge \\(2 \\to 1\\), so it never improves \\(d_1\\) to \\(«t1»\\) and finally reports \\(d_4 = «d4»\\) instead of \\(«t4»\\).", "After adding \\(2\\) to every edge, paths with more edges are penalised more: the route \\(0 \\to 1 \\to 3 \\to 4\\) (3 edges) becomes cheaper than the true shortest route \\(0 \\to 2 \\to 1 \\to 3 \\to 4\\) (4 edges), so its original weight is \\(4\\), not «t4»."],
trap="Believing a uniform shift removes negative edges safely: it changes the ranking of paths with different numbers of edges.", short="Negative edges break Dijkstra's finalising rule; a uniform shift is not a fix; Bellman-Ford copes.", kind="msq_discriminator")

# 7 DMA + interrupts: CPU overhead (MCQ, key C)
K.add(7, r"A disk delivers data at \(4 \times 10^{6}\) bytes per second to memory through a DMA controller. The controller transfers one \(4\)-byte word per stolen bus cycle (cycle stealing), and one bus cycle lasts \(100\) ns, during which the CPU cannot use memory. The data moves in blocks of \(16000\) bytes. For every block the CPU runs two interrupt handlers (one to start the transfer, one at its end), each lasting \(20\ \mu\text{s}\). The percentage of CPU time lost to this device is",
"""words = 4e6 / 4
cycle = words * 100e-9
blocks = 4e6 / 16000
irq = blocks * 2 * 20e-6
val = round((cycle + irq) * 100, 2)
wrong = [10.0, 1.0, 21.0]""",
steps=["Words per second \\(= 4 \\times 10^6 / 4 = 10^6\\); each steals \\(100\\) ns, so \\(10^6 \\times 10^{-7} = «cycle»\\), that is \\(10\\%\\) of the CPU's memory time.", "Blocks per second \\(= 4 \\times 10^6 / 16000 = «blocks»\\); interrupt time \\(= «blocks» \\times 2 \\times 20\\ \\mu\\text{s} = «irq»\\), that is \\(1\\%\\).", "Total \\(= «val»\\%\\)."],
trap="Counting only the stolen cycles (10%) and forgetting the two interrupt handlers per block, or the reverse.", short="Add the DMA cycle-stealing fraction to the interrupt-handler fraction.", kind="application")

# 27 minimal DFA of a union language (NAT)
K.add(27, r"A log-line filter accepts a string over \(\{a, b\}\) if its length is a multiple of \(3\) or if it ends with \(ab\) (the empty string is accepted because its length \(0\) is a multiple of \(3\)). The number of states in the minimal complete DFA for this language is ______.",
"""def words(n):
    out = ['']
    cur = ['']
    for _ in range(n):
        cur = [w + c for w in cur for c in 'ab']
        out = out + cur
    return out
W = words(7)
pred = lambda w: len(w) % 3 == 0 or w.endswith('ab')
answer = len(set(tuple(pred(u + v) for v in W) for u in W))""",
steps=["Build the product of a length-mod-3 counter (\\(3\\) states) and a tracker of the last two symbols relevant for ending in \\(ab\\) (\\(3\\) states: nothing useful, ends in \\(a\\), ends in \\(ab\\)): at most \\(9\\) states.", "Not all of the \\(9\\) product states are distinguishable: some pairs accept exactly the same continuations, so merging by the Myhill-Nerode test leaves «answer» states."],
trap="Stopping at the product bound of 9 without testing which states can be merged.", short="Start from the product DFA, then merge states that no suffix can separate.", kind="multi_concept")

# 26 BST and min-heap: depths compared (MCQ, key C)
K.add(26, r"The keys \(40, 25, 60, 10, 30, 50, 70, 5, 15, 28\) are inserted one by one, in this order, into an initially empty binary search tree and, separately, into an initially empty array-based min-heap (each key is added at the end and moved up while it is smaller than its parent; the root is at depth \(0\)). The number of keys whose depth in the binary search tree equals their depth in the heap is",
"""keys = [40, 25, 60, 10, 30, 50, 70, 5, 15, 28]
L = {}
R = {}
depth = {}
root = None
for k in keys:
    if root is None:
        root = k
        depth[k] = 0
        continue
    cur = root
    dd = 0
    while True:
        dd += 1
        if k < cur:
            if cur in L:
                cur = L[cur]
            else:
                L[cur] = k
                break
        else:
            if cur in R:
                cur = R[cur]
            else:
                R[cur] = k
                break
    depth[k] = dd
h = []
for k in keys:
    h.append(k)
    i = len(h) - 1
    while i > 0 and h[(i - 1) // 2] > h[i]:
        h[(i - 1) // 2], h[i] = h[i], h[(i - 1) // 2]
        i = (i - 1) // 2
hd = {}
for i, k in enumerate(h):
    hd[k] = (i + 1).bit_length() - 1
val = sum(1 for k in keys if depth[k] == hd[k])
wrong = [val + 1, val + 2, val + 3]""",
steps=["Insert into the BST: depths are \\(40\\!:\\!0,\\ 25\\!:\\!1,\\ 60\\!:\\!1,\\ 10\\!:\\!2,\\ 30\\!:\\!2,\\ 50\\!:\\!2,\\ 70\\!:\\!2,\\ 5\\!:\\!3,\\ 15\\!:\\!3,\\ 28\\!:\\!3\\).", "Insert into the min-heap with sift-up and read each key's depth from its array index (index \\(i\\) has depth \\(\\lfloor \\log_2 (i + 1) \\rfloor\\)); the heap shape is complete, so only the keys' positions change.", "Comparing the two depths key by key gives «val» key(s) with equal depth; the BST and the heap shape the same keys very differently."],
trap="Assuming both structures place a key at the same depth because both are binary trees; the BST shape follows the insertion order, the heap shape follows array positions.", short="Build both structures, then compare depth per key.", kind="multi_concept")

# 25 connected labelled graphs with 6 edges (NAT)
K.add(25, r"A network designer lists every labelled simple graph on the \(5\) sites \(\{1, 2, 3, 4, 5\}\) that has exactly \(6\) links. The number of those graphs that are connected is ______.",
"""edges = list(itertools.combinations(range(5), 2))
count = 0
for sub in itertools.combinations(edges, 6):
    par = list(range(5))
    def f(x):
        while par[x] != x:
            x = par[x]
        return x
    for a, b in sub:
        ra = f(a)
        rb = f(b)
        if ra != rb:
            par[ra] = rb
    if len(set(f(x) for x in range(5))) == 1:
        count += 1
total = math.comb(10, 6)
disc = total - count
answer = count""",
steps=["There are \\(\\binom{10}{6} = «total»\\) labelled graphs with \\(6\\) of the \\(10\\) possible edges.", "With \\(6\\) edges the only way to be disconnected is to put all \\(6\\) edges on four vertices (a complete \\(K_4\\)) and leave one vertex isolated: one choice of the isolated vertex each, so «disc» graphs (a component of size \\(3\\) holds at most \\(3\\) edges and one of size \\(2\\) at most \\(1\\), so no other split works).", "Connected graphs: \\(«total» - «disc» = «answer»\\)."],
trap="Counting spanning trees or unlabelled graphs instead of labelled connected graphs with a fixed number of edges.", short="Total edge subsets minus the disconnected ones.", kind="multi_concept")

# 23 synchronous counter with carry chain: maximum clock frequency (NAT)
K.add(23, r"A \(6\)-bit synchronous binary counter uses T flip-flops. The toggle input of bit \(i\) is the AND of all lower bits, built as a chain of \(2\)-input AND gates, so the input of the most significant stage passes through \(4\) AND gates in series. Each AND gate has a delay of \(8\) ns, a flip-flop has a clock-to-output delay of \(15\) ns and a set-up time of \(5\) ns. Ignoring clock skew, the maximum clock frequency of the counter, in MHz and correct to two decimal places, is ______.",
"""tcq = 15
tand = 8
tsu = 5
gates = 4
period = tcq + gates * tand + tsu
answer = round(1000 / period, 2)""",
steps=["The slowest path starts at a flip-flop output, ripples through the \\(4\\) AND gates and must meet the set-up time of the last flip-flop.", "Minimum period \\(= 15 + 4 \\times 8 + 5 = «period»\\) ns, so \\(f_{max} = 1000 / «period» = «answer»\\) MHz."],
trap="Using a ripple-counter formula (adding every flip-flop delay) or leaving out the set-up time.", short="Clock period = clock-to-Q + chain of gates + set-up.", kind="application")

K.save("p1")
