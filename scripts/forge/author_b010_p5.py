"""Forge b010 part 5 (designed batch). Run: python scripts/forge/author_b010_p5.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b010")

# 6 static local plus global interplay (NAT)
K.add(6, r"Consider the C program below. ```c int g = 1; int f(int x) { static int s = 0; s += x; g += s; return g * x; } int main(void) { int a = f(1); int b = f(2); int c = f(3); /* a + b + c is printed */ } ``` The value printed is ______.",
"""g = 1
s = 0
res = []
for x in (1, 2, 3):
    s += x
    g += s
    res.append(g * x)
a, b, c = res
answer = a + b + c""",
steps=["Calls run in the order shown. The static variable \\(s\\) keeps its value between calls, the global \\(g\\) accumulates \\(s\\).", "\\(f(1)\\): \\(s = 1,\\ g = 2\\), returns \\(2\\). \\(f(2)\\): \\(s = 3,\\ g = 5\\), returns \\(10\\). \\(f(3)\\): \\(s = 6,\\ g = 11\\), returns \\(33\\).", "\\(a + b + c = «a» + «b» + «c» = «answer»\\)."],
trap="Re-initialising the static variable on each call, or updating g with x instead of with the running total s.", short="Track s (static) and g (global) call by call.", kind="trace")

# 8 two-bit comparator through a decoder (MCQ, key C)
K.add(8, r"A \(2\)-bit magnitude comparator has inputs \(A_1A_0\) and \(B_1B_0\) and three outputs \(A>B\), \(A=B\) and \(A<B\). It is built from a \(4\)-to-\(16\) decoder (all \(16\) input combinations decoded, active-high outputs) followed by one OR gate per comparator output, each OR gate receiving exactly the decoder lines of the combinations for which its output is \(1\). The total number of OR-gate inputs used is",
"""gt = 0
eq = 0
lt = 0
for a in range(4):
    for b in range(4):
        if a > b:
            gt += 1
        elif a == b:
            eq += 1
        else:
            lt += 1
val = gt + eq + lt
wrong = [12, 10, 24]""",
steps=["Each of the \\(16\\) input combinations \\((a, b)\\) makes exactly one output \\(1\\): \\(a > b\\) in \\(6\\) cases, \\(a = b\\) in \\(4\\), \\(a < b\\) in \\(6\\).", "An OR gate needs one input per combination in its output's minterm list: \\(6 + 4 + 6 = «val»\\) inputs in total (the decoder lines are partitioned among the three gates)."],
trap="Counting the 16 decoder outputs once per gate, or forgetting that every combination belongs to exactly one comparison result.", short="The three output functions partition the 16 minterms.", kind="application")

# 11 ordering of growth rates (MCQ, key A)
K.add(11, r"Let \(f_1(n) = n^{2}\), \(f_2(n) = (\log_2 n)^{\log_2 n}\), \(f_3(n) = n^{\log_2 n}\), \(f_4(n) = 2^{\sqrt{n}}\) and \(f_5(n) = n!\). Write \(f \prec g\) when \(f(n) = o(g(n))\). Which one of the following chains is correct?",
"""L = math.log(2)
def lns(k):
    return [2 * k * L, k * math.log(k), k * k * L, math.sqrt(2.0 ** k) * L, 2.0 ** k * k * L - 2.0 ** k]
def holds(order):
    for k in (64, 128):
        v = lns(k)
        for a, b in zip(order, order[1:]):
            if not v[a] < v[b]:
                return False
    return True
truth = [holds([0, 1, 2, 3, 4]), holds([0, 2, 1, 3, 4]), holds([0, 1, 2, 4, 3]), holds([1, 0, 2, 3, 4])]""",
stmts=[r"\(f_1 \prec f_2 \prec f_3 \prec f_4 \prec f_5\)", r"\(f_1 \prec f_3 \prec f_2 \prec f_4 \prec f_5\)", r"\(f_1 \prec f_2 \prec f_3 \prec f_5 \prec f_4\)", r"\(f_2 \prec f_1 \prec f_3 \prec f_4 \prec f_5\)"],
steps=["Compare logarithms with \\(n = 2^k\\): \\(\\ln f_1 = 2k\\ln 2\\), \\(\\ln f_2 = k \\ln k\\), \\(\\ln f_3 = k^2 \\ln 2\\), \\(\\ln f_4 = 2^{k/2}\\ln 2\\), \\(\\ln f_5 \\approx 2^k k \\ln 2\\).", "These grow as \\(k\\), \\(k\\log k\\), \\(k^2\\), \\(2^{k/2}\\), \\(2^k k\\): strictly in this order for large \\(k\\), so the chain \\(f_1 \\prec f_2 \\prec f_3 \\prec f_4 \\prec f_5\\) is correct.", "In the other chains an adjacent pair is swapped, which contradicts the comparison of the logarithms."],
trap="Judging by small values of n: (log n)^(log n) overtakes n^2 only when log n exceeds 4.", short="Compare logarithms of the functions (in terms of k = log n), not the functions themselves.", kind="conceptual")

# 19 BST with insertions and deletions: final height (MCQ, key B)
K.add(19, r"The keys \(50, 30, 70, 20, 40, 60, 80, 35, 45, 65, 38, 48\) are inserted in this order into an initially empty binary search tree. Then the keys \(30\) and \(50\) are deleted in that order (a node with two children is replaced by its inorder successor, which is then removed from the right subtree), and finally \(36, 46, 62\) are inserted in that order. The height of the resulting tree (the number of edges on its longest root-to-leaf path) is",
"""def ins(t, k):
    if t is None:
        return [k, None, None]
    if k < t[0]:
        t[1] = ins(t[1], k)
    else:
        t[2] = ins(t[2], k)
    return t
def dele(t, k):
    if t is None:
        return None
    if k < t[0]:
        t[1] = dele(t[1], k)
    elif k > t[0]:
        t[2] = dele(t[2], k)
    else:
        if t[1] is None:
            return t[2]
        if t[2] is None:
            return t[1]
        s = t[2]
        while s[1] is not None:
            s = s[1]
        t[0] = s[0]
        t[2] = dele(t[2], s[0])
    return t
def height(t):
    return -1 if t is None else 1 + max(height(t[1]), height(t[2]))
t = None
for k in [50, 30, 70, 20, 40, 60, 80, 35, 45, 65, 38, 48]:
    t = ins(t, k)
h0 = height(t)
t = dele(t, 30)
t = dele(t, 50)
h1 = height(t)
for k in [36, 46, 62]:
    t = ins(t, k)
val = height(t)
root = t[0]
wrong = [val - 1, val + 1, val + 2]""",
steps=["After the twelve insertions the tree has height «h0». Deleting \\(30\\) (two children) copies its inorder successor \\(35\\) into its place; deleting the root \\(50\\) copies its successor \\(60\\) to the root.", "After the two deletions the height is «h1», and the root is «root».", "Insert \\(36, 46, 62\\) by the usual comparisons from the new root; the deepest of the new leaves sets the final height «val»."],
trap="Using the inorder predecessor, or forgetting that the successor itself must be removed from the right subtree.", short="Simulate each operation carefully; the shape depends on which neighbour replaces a deleted node.", kind="trace")

# 33 VIPT cache page colours (NAT)
K.add(33, r"A processor has a virtually indexed, physically tagged data cache of \(256\) KB that is \(8\)-way set-associative with \(64\)-byte lines. The operating system uses \(4\) KB pages and wants to avoid cache aliasing by giving each virtual page a physical frame of the same cache colour (the same value of the index bits that lie above the page offset). The number of distinct page colours is ______.",
"""cache = 256 * 1024
ways = 8
page = 4 * 1024
way_size = cache // ways
answer = way_size // page
sets = cache // (ways * 64)""",
steps=["Number of sets \\(= 256\\text{ KB} / (8 \\times 64) = «sets»\\), so the index uses \\(\\log_2 «sets» = 9\\) bits and the line offset \\(6\\) bits: \\(15\\) bits in all.", "A \\(4\\) KB page fixes only the lowest \\(12\\) bits, so \\(15 - 12 = 3\\) index bits depend on the physical frame number: the cache looks at the page in «answer» different groups of sets.", "Equivalently, one way is \\(32\\) KB and a page is \\(4\\) KB, so there are \\(32/4 = «answer»\\) page colours."],
trap="Dividing the whole cache size by the page size (64) instead of the size of one way.", short="Colours = (cache size / associativity) / page size.", kind="application")

# 51 page-table pages for a sparse address space (NAT)
K.add(51, r"A process on a machine with \(32\)-bit virtual addresses uses a two-level page table: pages are \(4\) KB, page-table entries are \(4\) bytes, and every table (top-level or second-level) occupies exactly one page. The process maps three regions: code from address \(\texttt{0x00400000}\) of size \(1\) MB, heap from \(\texttt{0x10000000}\) of size \(6\) MB, and a stack of \(2\) MB ending just below \(\texttt{0xC0000000}\). Only second-level tables that contain at least one valid entry are allocated. The total number of pages occupied by the page tables is ______.",
"""regions = [(0x00400000, 1 << 20), (0x10000000, 6 << 20), (0xC0000000 - (2 << 20), 2 << 20)]
l1 = set()
for start, size in regions:
    p0 = start >> 12
    p1 = (start + size - 1) >> 12
    for p in range(p0, p1 + 1):
        l1.add(p >> 10)
nsecond = len(l1)
answer = 1 + nsecond""",
steps=["A table page holds \\(4096/4 = 1024\\) entries, so the top-level index is the upper \\(10\\) address bits, and each second-level table covers \\(1024 \\times 4\\) KB \\(= 4\\) MB of address space.", "Code (\\(1\\) MB inside one \\(4\\) MB block): \\(1\\) table; heap (\\(6\\) MB starting on a \\(4\\) MB boundary): \\(2\\) tables; stack (\\(2\\) MB ending at a \\(4\\) MB boundary): \\(1\\) table: «nsecond» second-level tables.", "Add the single top-level table: \\(1 + «nsecond» = «answer»\\) pages."],
trap="Allocating all 1024 second-level tables, or counting by region size without checking which 4 MB blocks each region touches.", short="Count the distinct 4 MB blocks touched, then add the top-level table.", kind="application")

# 53 tree rebuilt from preorder and inorder: nodes with exactly one child (MCQ, key C)
K.add(53, r"A binary tree has the preorder traversal \(1, 2, 4, 7, 5, 3, 6, 8, 9\) and the inorder traversal \(7, 4, 2, 5, 1, 6, 3, 8, 9\). The number of nodes of the tree that have exactly one child is",
"""pre = [1, 2, 4, 7, 5, 3, 6, 8, 9]
ino = [7, 4, 2, 5, 1, 6, 3, 8, 9]
one = []
def build(pre, ino):
    if not pre:
        return None
    r = pre[0]
    i = ino.index(r)
    left = build(pre[1:1 + i], ino[:i])
    right = build(pre[1 + i:], ino[i + 1:])
    if (left is None) != (right is None):
        one.append(r)
    return (r, left, right)
build(pre, ino)
val = len(one)
lst = ', '.join(str(x) for x in sorted(one))
wrong = [val - 1, val + 1, val + 2]""",
steps=["The first preorder element \\(1\\) is the root; in the inorder sequence it splits the left part \\(7, 4, 2, 5\\) from the right part \\(6, 3, 8, 9\\). Repeat on each part using the preorder blocks of the same sizes.", "Left subtree: root \\(2\\) with left part \\(7, 4\\) (root \\(4\\), left child \\(7\\)) and right child \\(5\\). Right subtree: root \\(3\\) with left child \\(6\\) and right part \\(8, 9\\) (root \\(8\\), right child \\(9\\)).", "Nodes with exactly one child: «lst», that is «val» nodes."],
trap="Mixing up the left and right blocks when splitting the preorder sequence.", short="Preorder gives each root; inorder gives the sizes of the left and right parts.", kind="trace")

# 54 CSMA/CD backoff probabilities (MCQ, key D)
K.add(54, r"Two stations on a CSMA/CD Ethernet start transmitting at exactly the same instant and collide. After the \(i\)-th collision each station independently picks a backoff delay uniformly at random from \(\{0, 1, \dots, 2^{i} - 1\}\) slot times (binary exponential backoff) and, when the two delays are equal, they collide again; when the delays differ, the station with the smaller delay transmits successfully. The probability that the stations collide exactly three times in total and then one of them succeeds on its fourth attempt, correct to three decimal places, is",
"""F = fractions.Fraction
p_coll = [F(1, 2 ** i) for i in (1, 2, 3)]
pr = p_coll[0] * p_coll[1] * (1 - p_coll[2])
val = round(float(pr), 3)
wrong = [0.125, 0.25, 0.063]""",
steps=["After collision \\(i\\) the delays come from \\(2^i\\) values, so the stations pick the same value with probability \\(2^{-i}\\): \\(1/2\\) after the first, \\(1/4\\) after the second, \\(1/8\\) after the third.", "Exactly three collisions in total means collision \\(1\\) (given), collision \\(2\\) again after the first backoff (\\(1/2\\)), collision \\(3\\) again after the second (\\(1/4\\)), then no collision after the third (\\(1 - 1/8 = 7/8\\)).", "Probability \\(= \\tfrac12 \\times \\tfrac14 \\times \\tfrac78 = \\tfrac{7}{64} \\approx «val»\\)."],
trap="Multiplying the collision probabilities without the final success factor, or using the same backoff range every time.", short="Multiply 2^-i for each repeated collision, then the success probability of the last round.", kind="multi_concept")

# 32 stop-and-wait throughput with frame errors (MCQ, key C)
K.add(32, r"A stop-and-wait link carries \(1000\)-bit frames at \(2\) Mbps with a one-way propagation delay of \(2\) ms; acknowledgements are tiny and their transmission time is negligible. Each frame is corrupted independently with probability \(0.1\), a lost frame or acknowledgement is detected after a timeout exactly equal to one round trip, and the frame is then resent. The useful throughput (correct frames delivered), in kilobits per second and correct to the nearest whole number, is",
"""tx = 1000 / 2e6
cycle = tx + 2 * 0.002
p = 0.1
val = round(1000 * (1 - p) / cycle / 1000)
wrong = [222, 180, 250]
cyc_ms = cycle * 1000""",
steps=["One attempt takes the transmission time \\(1000/(2 \\times 10^6) = 0.5\\) ms plus the round trip \\(2 \\times 2 = 4\\) ms: «cyc_ms» ms.", "A frame succeeds with probability \\(0.9\\), so the expected time per delivered frame is «cyc_ms»\\(/0.9\\) ms.", "Throughput \\(= 1000\\text{ bits} \\times 0.9 / «cyc_ms»\\text{ ms} = «val»\\) kbps."],
trap="Ignoring the retransmission factor, or computing the efficiency with the frame transmission time alone (2 Mbps).", short="Throughput = L(1 - p) / (t_tx + 2 t_prop).", kind="application")

K.save("p5")
