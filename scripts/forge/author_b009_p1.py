"""Forge b009 part 1 (slots 0-24). Authored in a local Claude Code session; run: python scripts/forge/author_b009_p1.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b009")

# 0 ER to relational (MSQ 2)
K.add(0, r"A university design has the entity sets Student, Course, Instructor and Room, and a weak entity set Dependent that is identified through its owner Instructor. Relationships: Student-Course enrols (many-to-many), Instructor-Course teaches (one instructor, many courses), Room-Course hosts (one-to-one, every course has its own room). Using the standard rules for mapping an ER diagram to relations (merge a one-to-many or one-to-one relationship into a participating relation by a foreign key, give each many-to-many relationship its own relation), which of the following statements is/are TRUE?",
"""entities = ['Student', 'Course', 'Instructor', 'Room']
weak = ['Dependent']
mn = ['enrols']
tables = len(entities) + len(weak) + len(mn)
enrols_key = ['student', 'course']
dep_key_has_owner = True
teaches_own_table = False
truth = [tables == 6, len(enrols_key) == 2, dep_key_has_owner, teaches_own_table]""",
stmts=[r"The mapping produces exactly 6 relations.", r"The relation for enrols has a primary key made of the keys of Student and Course together.", r"The primary key of the relation for Dependent includes the primary key of Instructor.", r"The teaches relationship needs a relation of its own."],
steps=["Entity sets give 4 relations, the weak entity Dependent gives a fifth, and the many-to-many enrols gives a sixth: 6 relations.", "The relation for enrols is keyed by the pair (Student key, Course key). A weak entity's key combines its owner's key with its own partial key.", "teaches (one-to-many) and hosts (one-to-one) are merged into Course by foreign keys, so teaches needs no relation of its own."],
trap="Giving every relationship its own relation, which wrongly adds tables for teaches and hosts.", short="Only many-to-many relationships become relations; entity sets (weak ones too) always do.", kind="msq_discriminator")

# 1 right-associative subtraction (MCQ 1, key C)
K.add(1, r"A syntax-directed definition uses the grammar \(E \to T - E_1 \mid T\) and \(T \to \text{num}\), with the rules \(E.\text{val} = T.\text{val} - E_1.\text{val}\) for the first production and \(E.\text{val} = T.\text{val}\) for the second. For the input \(9 - 4 - 3 - 1\), the value of \(E.\text{val}\) at the root of the parse tree is",
"""vals = [9, 4, 3, 1]
def ev(i):
    if i == len(vals) - 1:
        return vals[i]
    return vals[i] - ev(i + 1)
val = ev(0)
left = ((9 - 4) - 3) - 1
wrong = [left, 11, 5]""",
steps=["The grammar is right recursive, so the tree groups the input as \\(9 - (4 - (3 - 1))\\).", "\\(3 - 1 = 2\\); \\(4 - 2 = 2\\); \\(9 - 2 = «val»\\). Left-to-right evaluation would give «left»."],
trap="Evaluating left to right (giving the value for left associativity).", short="Right-recursive grammars make the operator right associative.", kind="trap_aware")

# 2 clock angle (MCQ 2, key D)
K.add(2, r"The smaller angle between the hour hand and the minute hand of an analogue clock at \(4{:}20\) is, in degrees,",
"""h = 4 * 30 + 20 * 0.5
m = 20 * 6
a = abs(h - m)
val = int(min(a, 360 - a))
wrong = [20, 15, 5]""",
steps=["Hour hand: \\(4 \\times 30 + 20 \\times 0.5 = 130^\\circ\\); minute hand: \\(20 \\times 6 = 120^\\circ\\).", "Difference \\(= «val»^\\circ\\)."],
trap="Ignoring the hour hand's movement during the 20 minutes (giving 0 degrees).", short="Hour hand moves 0.5 degrees per minute, minute hand 6 degrees per minute.", kind="application")

# 3 replaced value mean (MCQ 1, key A)
K.add(3, r"The mean of seven numbers is \(15\). When one of the numbers, \(9\), is replaced by \(23\), the mean of the seven numbers becomes",
"""val = (15 * 7 - 9 + 23) / 7
wrong = [16.0, 18.0, 14.0]""",
steps=["Sum \\(= 15 \\times 7 = 105\\). New sum \\(= 105 - 9 + 23 = 119\\).", "New mean \\(= 119 / 7 = «val»\\)."],
trap="Adding the difference 14 to the mean instead of dividing it by 7.", short="The mean changes by \\(14/7 = 2\\).", kind="application")

# 4 star count recursion (NAT 2)
K.add(4, r"""A routine prints one star after finishing its first recursive call and before starting its second one, as shown below. A single call `h(6)` is made from `main`. The total number of stars printed is ______.
```c
void h(int n) {
    if (n <= 0) return;
    h(n - 1);
    printf("*");
    h(n - 2);
}
```""",
"""t = {}
def T(n):
    if n <= 0:
        return 0
    if n not in t:
        t[n] = T(n - 1) + 1 + T(n - 2)
    return t[n]
answer = T(6)
seq = [T(i) for i in range(1, 7)]""",
steps=["Let \\(S(n)\\) be the number of stars: \\(S(n) = S(n-1) + 1 + S(n-2)\\), with \\(S(n) = 0\\) for \\(n \\le 0\\).", "\\(S(1), \\dots, S(6)\\) are «seq», so \\(S(6) = «answer»\\)."],
trap="Counting the calls instead of the prints, or forgetting that \\(h(n - 2)\\) with \\(n = 1\\) is an immediate return.", short="One star per call with \\(n \\ge 1\\); \\(S(n) = F_{n+2} - 1\\).", kind="numeric_chain")

# 5 heap minimum comparisons (MCQ 1, key B)
K.add(5, r"The minimum element of a binary max-heap stored in an array of \(31\) elements is to be found with the fewest comparisons between elements. The number of comparisons needed in the worst case is",
"""n = 31
leaves = n - n // 2
val = leaves - 1
wrong = [30, 16, 31]""",
steps=["In a max-heap the minimum must be at a leaf, and an array of 31 elements has \\(31 - 15 = 16\\) leaves.", "Finding the minimum among 16 unordered elements takes \\(16 - 1 = «val»\\) comparisons."],
trap="Scanning the whole array (30 comparisons) or assuming the minimum sits at the last position.", short="Leaves are the second half of the array; compare only those.", kind="conceptual")

# 6 tag bits (NAT 1)
K.add(6, r"A processor has \(32\)-bit physical addresses. Its data cache is \(16\) KB, \(4\)-way set associative, with \(32\)-byte blocks. The number of tag bits stored with each cache line is ______.",
"""addr = 32
size = 16 * 1024
ways = 4
blk = 32
sets = size // (ways * blk)
off = blk.bit_length() - 1
idx = sets.bit_length() - 1
answer = addr - off - idx""",
steps=["Number of sets \\(= 16384 / (4 \\times 32) = 128\\), so the index needs 7 bits; a 32-byte block needs 5 offset bits.", "Tag bits \\(= 32 - 7 - 5 = «answer»\\)."],
trap="Using the number of blocks (512) instead of the number of sets for the index.", short="Tag \\(=\\) address bits \\(-\\) index bits \\(-\\) offset bits.", kind="application")

# 7 bounded buffer semaphores (MCQ 1, key D)
K.add(7, r"A bounded buffer of \(4\) slots is protected by counting semaphores \(\text{empty} = 4\) and \(\text{full} = 0\) (and a mutex). A producer executes wait(empty) ... signal(full) once per item and a consumer executes wait(full) ... signal(empty) once per item. The producer inserts \(3\) items, the consumer then removes \(2\), and then the producer inserts \(2\) more items. All operations complete without blocking. The values of \(\text{empty}\) and \(\text{full}\) are now respectively",
"""empty, full = 4, 0
for _ in range(3):
    empty -= 1
    full += 1
for _ in range(2):
    full -= 1
    empty += 1
for _ in range(2):
    empty -= 1
    full += 1
val = '(' + str(empty) + ', ' + str(full) + ')'
wrong = ['(2, 2)', '(0, 4)', '(3, 1)']""",
steps=["Each insert does \\(\\text{empty} - 1,\\ \\text{full} + 1\\); each removal does \\(\\text{full} - 1,\\ \\text{empty} + 1\\).", "After 3 inserts: \\((1, 3)\\); after 2 removals: \\((3, 1)\\); after 2 more inserts: «val»."],
trap="Updating only one of the two semaphores, or forgetting that the sum always equals the buffer size.", short="\\(\\text{empty} + \\text{full} = 4\\) at the end of every complete operation.", kind="trace")

# 8 milk and water (MCQ 2, key B)
K.add(8, r"A vessel holds \(40\) litres of a milk and water mixture in the ratio \(3 : 1\). After adding \(10\) litres of water, the percentage of milk in the new mixture is",
"""milk = 40 * 3 / 4
water = 40 / 4 + 10
val = round(100 * milk / (milk + water), 1)
wrong = [75.0, 50.0, 66.7]""",
steps=["Milk \\(= 30\\) L, water \\(= 10\\) L. After adding water: milk 30 L, water 20 L, total 50 L.", "Percentage of milk \\(= 30/50 \\times 100 = «val»\\%\\)."],
trap="Keeping the old ratio 75 % or ignoring the added volume in the total.", short="Milk stays 30 L; the total becomes 50 L.", kind="application")

# 9 pointer to row (MCQ 2, key C)
K.add(9, r"""The array `m` holds `m[i][j] = 3*i + j + 1`, that is, the rows are {1, 2, 3}, {4, 5, 6} and {7, 8, 9}. Consider the declarations and expression below.
```c
int m[3][3];            /* filled as described */
int (*q)[3] = m + 1;    /* q is a pointer to an array of 3 ints */
int r = q[1][2] + (*q)[0] - **m;
```
The value of `r` is""",
"""m = [[3 * i + j + 1 for j in range(3)] for i in range(3)]
q = 1
val = m[q + 1][2] + m[q][0] - m[0][0]
wrong = [10, 13, 15]""",
steps=["`q = m + 1` points to row 1, so `q[1]` is row 2 and `q[1][2] = 9`; `(*q)[0]` is the first element of row 1, which is 4.", "`**m` is `m[0][0] = 1`: \\(r = 9 + 4 - 1 = «val»\\)."],
trap="Treating `q[1]` as row 1 (the row `q` points at) instead of the row after it.", short="Pointer arithmetic on `q` moves by whole rows.", kind="trace")

# 10 usable hosts (MCQ 2, key A)
K.add(10, r"A network administrator must give a department the smallest CIDR block that can address \(500\) hosts, where the first address of the block (network address) and the last (broadcast address) cannot be assigned to hosts. The number of usable host addresses in the block that is allocated is",
"""p = 32
while 2 ** (32 - p) - 2 < 500:
    p -= 1
val = 2 ** (32 - p) - 2
wrong = [512, 254, 1022]
plen = p""",
steps=["A /24 block has 254 usable addresses (too few); a /23 block has \\(2^9 - 2 = 510\\) usable addresses, enough for 500.", "The smallest suitable block is a /«plen» with «val» usable host addresses."],
trap="Reporting 512 (all addresses in the block) or choosing a /22.", short="Usable addresses \\(= 2^{32 - p} - 2\\).", kind="application")

# 11 mux tree (MCQ 2, key A)
K.add(11, r"A \(16 \times 1\) multiplexer is to be built using only \(2 \times 1\) multiplexers arranged in a tree. The number of \(2 \times 1\) multiplexers needed is",
"""n = 16
cnt = 0
while n > 1:
    n //= 2
    cnt += n
val = cnt
wrong = [8, 16, 31]""",
steps=["The first level combines 16 inputs in pairs with 8 multiplexers, the next uses 4, then 2, then 1.", "\\(8 + 4 + 2 + 1 = «val»\\) (one less than the number of inputs)."],
trap="Counting 16 (one per input) or 31 (the total number of nodes in the tree including the leaves).", short="A tree with \\(n\\) leaves of 2-input nodes has \\(n - 1\\) internal nodes.", kind="conceptual")

# 12 monotone and self-dual (MCQ 1, key D)
K.add(12, r"A Boolean function of three variables is monotone if raising any input from 0 to 1 never lowers the output, and self-dual if complementing all inputs complements the output. The number of three-variable functions that are both monotone and self-dual is",
"""cnt = 0
for tt in range(256):
    f = [(tt >> i) & 1 for i in range(8)]
    mono = all(not ((a & b) == a and f[a] > f[b]) for a in range(8) for b in range(8))
    dual = all(f[7 - i] == 1 - f[i] for i in range(8))
    if mono and dual:
        cnt += 1
val = cnt
wrong = sorted(set([1, 2, 3, 5, 6]) - set([val]))[:3]""",
steps=["Self-dual functions are fixed by their values on half of the inputs; monotonicity then restricts those values.", "Enumerating all 256 functions and keeping those with both properties leaves «val» functions: the three projections \\(x, y, z\\) and the majority function."],
trap="Counting only the projections and forgetting the majority function.", short="Monotone self-dual functions of three variables: \\(x\\), \\(y\\), \\(z\\) and majority.", kind="conceptual")

# 13 column-major misses (NAT 1)
K.add(13, r"A \(16 \times 16\) array of 4-byte integers is stored row by row starting at address 0. A direct-mapped cache with \(8\) lines of \(32\) bytes is initially empty. A program reads the array column by column (for each column \(j\), rows \(i = 0, 1, \dots, 15\)), so the element \((i, j)\) is at address \(4(16i + j)\). The total number of cache misses over all \(256\) reads is ______.",
"""cache = {}
miss = 0
for j in range(16):
    for i in range(16):
        ad = 4 * (16 * i + j)
        blk = ad // 32
        idx = blk % 8
        if cache.get(idx) != blk:
            miss += 1
            cache[idx] = blk
answer = miss""",
steps=["A row is 64 bytes, so consecutive rows are 2 blocks apart and a column walks through 16 different blocks that map to only 4 of the 8 lines (indices 0, 2, 4, 6).", "The lines are overwritten before any block is reused by the next column, so every read misses: «answer» misses in all."],
trap="Assuming spatial locality works down a column; it only works along a row.", short="Stride of 64 bytes means a new block on every read.", kind="trace")

# 14 layer facts (MSQ 1)
K.add(14, r"Which of the following statements about the layers of the TCP/IP protocol suite is/are TRUE?",
"""layer = {'TCP': 'transport', 'UDP': 'transport', 'ICMP': 'network', 'IP': 'network', 'DNS': 'application', 'Ethernet': 'link', 'ARP': 'link'}
truth = [layer['TCP'] == 'transport', layer['ICMP'] == 'transport', layer['DNS'] == 'application', layer['Ethernet'] == 'network']""",
stmts=[r"TCP is a transport-layer protocol.", r"ICMP is a transport-layer protocol.", r"DNS is an application-layer protocol.", r"Ethernet frames are forwarded between networks using IP addresses."],
steps=["TCP and UDP are transport-layer protocols; DNS is an application-layer protocol that normally runs over UDP or TCP.", "ICMP carries error and control messages for IP and sits at the network layer, and Ethernet switches forward frames using MAC addresses (link layer), not IP addresses."],
trap="Placing ICMP at the transport layer because it is carried in IP packets with a protocol number, like TCP.", short="Match each protocol to what it addresses: ports, IP addresses or MAC addresses.", kind="conceptual")

# 15 Prim order (MCQ 2, key A)
K.add(15, r"Prim's algorithm starts at vertex \(A\) on the graph with edge weights \(AB\,6,\ AC\,2,\ BC\,3,\ BD\,5,\ CD\,4,\ CE\,7,\ DE\,1,\ DF\,8,\ EF\,3\). At each step it adds the cheapest edge joining a tree vertex to a non-tree vertex. The fourth vertex added to the tree (counting \(A\) as the first) is",
"""E = [('A', 'B', 6), ('A', 'C', 2), ('B', 'C', 3), ('B', 'D', 5), ('C', 'D', 4), ('C', 'E', 7), ('D', 'E', 1), ('D', 'F', 8), ('E', 'F', 3)]
tree = ['A']
while len(tree) < 6:
    best = None
    for a, b, w in E:
        if (a in tree) != (b in tree):
            if best is None or w < best[0]:
                best = (w, b if a in tree else a)
    tree.append(best[1])
val = tree[3]
order = ' '.join(tree)
wrong = [x for x in 'BCDEF' if x != val][:3]""",
steps=["Starting at \\(A\\): the cheapest edge out is \\(AC\\) (2), then \\(CB\\) (3) or \\(CD\\) (4)...", "The order in which Prim adds the vertices is «order»; the fourth is «val»."],
trap="Using Kruskal's order (global lightest edge, which starts with \\(DE\\)) instead of growing one tree from \\(A\\).", short="Always take the cheapest edge leaving the current tree.", kind="trace")

# 16 Bayes urn (NAT 1)
K.add(16, r"Bag 1 holds \(3\) red and \(2\) blue balls; Bag 2 holds \(1\) red and \(4\) blue balls. A bag is chosen at random (each with probability \(1/2\)) and one ball is drawn from it; the ball is red. The probability that it came from Bag 1, correct to two decimal places, is ______.",
"""p1 = 0.5 * 3 / 5
p2 = 0.5 * 1 / 5
answer = round(p1 / (p1 + p2), 2)""",
steps=["\\(P(\\text{red}) = \\tfrac12 \\cdot \\tfrac35 + \\tfrac12 \\cdot \\tfrac15 = 0.4\\).", "\\(P(\\text{Bag 1} \\mid \\text{red}) = 0.3 / 0.4 = «answer»\\)."],
trap="Answering 0.6, the proportion of red balls in Bag 1.", short="Bayes: weight each bag by how likely it is to give red.", kind="application")

# 17 Hamming parity bits (MCQ 1, key A)
K.add(17, r"A single-error-correcting Hamming code is to protect \(11\) data bits. The smallest number of parity (check) bits required is",
"""m = 11
r = 1
while 2 ** r < m + r + 1:
    r += 1
val = r
wrong = [3, 5, 6]""",
steps=["With \\(r\\) check bits the code must distinguish \\(m + r + 1\\) cases (no error, or an error in any of the \\(m + r\\) positions): \\(2^r \\ge m + r + 1\\).", "For \\(m = 11\\): \\(r = 3\\) gives \\(8 < 15\\), \\(r = «val»\\) gives \\(16 \\ge 16\\)."],
trap="Using \\(2^r \\ge m\\) (which gives 4 only by luck) or forgetting the check bits' own positions.", short="\\(2^r \\ge m + r + 1\\).", kind="application")

# 18 DFS facts (MSQ 1)
K.add(18, r"An undirected graph on vertices \(0, \dots, 5\) has the edges \(0\text{-}1,\ 0\text{-}2,\ 1\text{-}2,\ 1\text{-}3,\ 3\text{-}4,\ 4\text{-}5,\ 3\text{-}5\). A depth-first search starts at vertex 0. Which of the following statements is/are TRUE?",
"""E = [(0, 1), (0, 2), (1, 2), (1, 3), (3, 4), (4, 5), (3, 5)]
adj = {v: [] for v in range(6)}
for a, b in E:
    adj[a].append(b)
    adj[b].append(a)
for v in adj:
    adj[v].sort()
seen = []
tree = []
def dfs(u, p):
    seen.append(u)
    for v in adj[u]:
        if v not in seen:
            tree.append((u, v))
            dfs(v, u)
dfs(0, None)
back = len(E) - len(tree)
def conn(removed):
    vs = [v for v in range(6) if v != removed]
    s = set([vs[0]])
    st = [vs[0]]
    while st:
        u = st.pop()
        for v in adj[u]:
            if v != removed and v not in s:
                s.add(v)
                st.append(v)
    return len(s) == len(vs)
color = {0: 0}
bip = True
st = [0]
while st:
    u = st.pop()
    for v in adj[u]:
        if v not in color:
            color[v] = 1 - color[u]
            st.append(v)
        elif color[v] == color[u]:
            bip = False
truth = [len(tree) == 5, back == 2, not conn(3), bip]""",
stmts=[r"The DFS tree has 5 edges.", r"The graph has exactly 2 non-tree edges with respect to the DFS tree.", r"Vertex 3 is an articulation point: removing it disconnects the graph.", r"The graph is bipartite."],
steps=["The graph is connected with 6 vertices, so a DFS tree has 5 edges, and the other \\(7 - 5 = 2\\) edges are non-tree (back) edges.", "Removing vertex 3 separates \\(\\{4, 5\\}\\) from \\(\\{0, 1, 2\\}\\), so 3 is an articulation point.", "The triangles \\(0\\text{-}1\\text{-}2\\) and \\(3\\text{-}4\\text{-}5\\) are odd cycles, so the graph is not bipartite."],
trap="Believing that an articulation point must have the largest degree.", short="Spanning tree edges \\(= n - 1\\); the rest are back edges.", kind="msq_discriminator")

# 19 zero-address code length (MCQ 1, key A)
K.add(19, r"The expression \((a + b) * (c - d) / e\) is compiled for a stack machine with zero-address arithmetic instructions (ADD, SUB, MUL, DIV) and PUSH of a variable. The number of instructions in the shortest correct code (no stores) is",
"""tokens = 'a b + c d - * e /'.split()
val = len(tokens)
wrong = [7, 8, 10]""",
steps=["Postfix order of the expression is \\(a\\ b\\ +\\ c\\ d\\ -\\ *\\ e\\ /\\).", "Five operands need PUSH instructions and four operators need one instruction each: «val» instructions."],
trap="Counting the operators only or adding STORE instructions.", short="Instructions \\(=\\) operands \\(+\\) operators.", kind="application")

# 20 LR(0) states (MCQ 2, key A)
K.add(20, r"For the grammar \(S \to aSb \mid ab\) (augmented with \(S' \to S\)), the number of states in the LR(0) automaton is",
"""G = [("S'", ('S',)), ('S', ('a', 'S', 'b')), ('S', ('a', 'b'))]
NT = set(["S'", 'S'])
def closure(items):
    items = set(items)
    ch = True
    while ch:
        ch = False
        for (l, r, d) in list(items):
            if d < len(r) and r[d] in NT:
                for (l2, r2) in G:
                    if l2 == r[d] and (l2, r2, 0) not in items:
                        items.add((l2, r2, 0))
                        ch = True
    return tuple(sorted(items))
start = closure(set([("S'", ('S',), 0)]))
seen = [start]
i = 0
while i < len(seen):
    st = seen[i]
    for X in ['S', 'a', 'b']:
        nxt = set((l, r, d + 1) for (l, r, d) in st if d < len(r) and r[d] == X)
        if nxt:
            c = closure(nxt)
            if c not in seen:
                seen.append(c)
    i += 1
val = len(seen)
wrong = [val - 1, val + 1, val + 2]""",
steps=["Start: \\(I_0 = \\{S' \\to \\cdot S,\\ S \\to \\cdot aSb,\\ S \\to \\cdot ab\\}\\). On \\(S\\) go to the state with \\(S' \\to S\\cdot\\); on \\(a\\) go to the state with \\(S \\to a\\cdot Sb\\) and \\(S \\to a\\cdot b\\), which also closes over \\(S \\to \\cdot aSb\\) and \\(S \\to \\cdot ab\\).", "The remaining states come from \\(S\\), \\(b\\) and \\(b\\) again: counting all distinct item sets gives «val» states."],
trap="Merging the two states reached on \\(a\\) (they have different item sets) or leaving out the accepting state for \\(S' \\to S\\cdot\\).", short="Build goto transitions until no new item set appears.", kind="multi_concept")

# 21 B+ tree capacity (NAT 1)
K.add(21, r"A B+ tree index has exactly three levels: a root, one level of internal nodes, and the leaf level. Every internal node (including the root) is full with \(50\) child pointers, and every leaf is full with \(40\) record pointers. The number of records that can be indexed is ______.",
"""internal = 50
leaf = 40
answer = internal * internal * leaf""",
steps=["The root has 50 children; each of those has 50 children, so there are \\(50 \\times 50 = 2500\\) leaves.", "Each leaf holds 40 records: \\(2500 \\times 40 = «answer»\\)."],
trap="Using the number of keys (49) per internal node instead of the number of pointers, or counting only one level.", short="Capacity \\(=\\) (fan-out)\\(^{\\text{levels} - 1} \\times\\) leaf capacity.", kind="numeric_chain")

# 22 wait-die aborts (MCQ 2, key C)
K.add(22, r"Transactions \(T_1, T_2, T_3\) have timestamps \(5, 10, 15\) (smaller means older) and the wait-die scheme is used: if the requester is older than the lock holder it waits, otherwise it is aborted (and releases its locks). The lock requests arrive in this order: \(T_2\) locks \(A\); \(T_3\) locks \(B\); \(T_1\) locks \(B\); \(T_3\) locks \(A\); \(T_1\) locks \(B\) (again); \(T_2\) locks \(B\). A transaction that waits is retried only where the sequence lists a repeated request. The number of aborts caused by wait-die is",
"""ts = {1: 5, 2: 10, 3: 15}
holder = {}
aborts = 0
seq = [(2, 'A'), (3, 'B'), (1, 'B'), (3, 'A'), (1, 'B'), (2, 'B')]
dead = set()
for t, x in seq:
    if t in dead:
        continue
    h = holder.get(x)
    if h is None or h == t:
        holder[x] = t
    elif ts[t] < ts[h]:
        pass
    else:
        aborts += 1
        dead.add(t)
        for k in list(holder):
            if holder[k] == t:
                del holder[k]
val = aborts
wrong = [0, 1, 3]""",
steps=["\\(T_2\\) gets \\(A\\) and \\(T_3\\) gets \\(B\\). \\(T_1\\) (older than \\(T_3\\)) asks for \\(B\\) and waits. \\(T_3\\) (younger than \\(T_2\\)) asks for \\(A\\): it dies and releases \\(B\\).", "\\(T_1\\) now gets \\(B\\). \\(T_2\\) (younger than \\(T_1\\)) asks for \\(B\\): it dies. Total aborts: «val»."],
trap="Applying wound-wait (older aborts younger holders) instead of wait-die.", short="Wait-die: older waits, younger dies.", kind="trace")

# 23 simultaneous equations (MCQ 2, key D)
K.add(23, r"If \(2x - y = 3\) and \(x + 2y = 14\), then the value of \(xy\) is",
"""val = 0
for x in range(-20, 21):
    for y in range(-20, 21):
        if 2 * x - y == 3 and x + 2 * y == 14:
            val = x * y
wrong = [18, 24, 16]""",
steps=["From the first equation \\(y = 2x - 3\\). Substituting: \\(x + 4x - 6 = 14\\), so \\(x = 4\\) and \\(y = 5\\).", "\\(xy = «val»\\)."],
trap="Adding the equations (\\(3x + y = 17\\)) and treating that as a solution.", short="Eliminate \\(y\\) first.", kind="application")

# 24 SQL group having (NAT 2)
K.add(24, r"""Tables: Emp(id, dept, sal) = {(1,A,50), (2,A,70), (3,B,40), (4,B,90), (5,C,60), (6,C,20), (7,D,80)} and Dept(dept, loc) = {(A,x), (B,y), (C,x), (E,z)}. The query
```sql
SELECT d.loc, COUNT(*) AS c
FROM Emp e JOIN Dept d ON e.dept = d.dept
GROUP BY d.loc
HAVING SUM(e.sal) > 120;
```
returns some rows. The sum of the values in the column c over all returned rows is ______.""",
"""emp = [(1, 'A', 50), (2, 'A', 70), (3, 'B', 40), (4, 'B', 90), (5, 'C', 60), (6, 'C', 20), (7, 'D', 80)]
dept = {'A': 'x', 'B': 'y', 'C': 'x', 'E': 'z'}
groups = {}
for i, d, s in emp:
    if d in dept:
        g = groups.setdefault(dept[d], [0, 0])
        g[0] += 1
        g[1] += s
rows = [(k, v[0]) for k, v in groups.items() if v[1] > 120]
answer = sum(c for k, c in rows)
detail = ', '.join(k + ':' + str(groups[k][0]) + '/' + str(groups[k][1]) for k in sorted(groups))""",
steps=["The inner join drops employee 7 (dept D has no match) and department E (no employees). Groups by location (count/total salary): «detail».", "Both groups have a salary total above 120, so both rows are returned and the counts add up to «answer»."],
trap="Including employee 7 (an outer join would) or applying HAVING to the count instead of the salary sum.", short="Join first, then group, then filter the groups.", kind="application")

K.save("p1")
