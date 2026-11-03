"""Forge b008 part 2 (slots 13-28). Authored in a local Claude Code session; run: python scripts/forge/author_b008_p2.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b008")

FF = """def first_follow(G, start):
    NT = list(G)
    first = {A: set() for A in NT}
    nullable = {A: False for A in NT}
    ch = True
    while ch:
        ch = False
        for A in NT:
            for rhs in G[A]:
                nul = True
                for X in rhs:
                    add = first[X] if X in G else set([X])
                    if not add <= first[A]:
                        first[A] = first[A] | add
                        ch = True
                    if not (nullable[X] if X in G else False):
                        nul = False
                        break
                if nul and not nullable[A]:
                    nullable[A] = True
                    ch = True
    follow = {A: set() for A in NT}
    follow[start].add('$')
    ch = True
    while ch:
        ch = False
        for A in NT:
            for rhs in G[A]:
                for i, X in enumerate(rhs):
                    if X in G:
                        rest_null = True
                        add = set()
                        for Y in rhs[i + 1:]:
                            add = add | (first[Y] if Y in G else set([Y]))
                            if not (nullable[Y] if Y in G else False):
                                rest_null = False
                                break
                        if rest_null:
                            add = add | follow[A]
                        if not add <= follow[X]:
                            follow[X] = follow[X] | add
                            ch = True
    return first, follow, nullable
"""

# 13 FOLLOW size (MCQ 2, key B)
K.add(13, r"Consider the grammar with start symbol \(S\): \(S \to XYZ\), \(X \to xX \mid \varepsilon\), \(Y \to yY \mid X\), \(Z \to z \mid \varepsilon\). The number of terminal symbols (counting the end marker \(\$\)) in \(\text{FOLLOW}(X)\) is",
FF + """G = {'S': [('X', 'Y', 'Z')], 'X': [('x', 'X'), ()], 'Y': [('y', 'Y'), ('X',)], 'Z': [('z',), ()]}
first, follow, nullable = first_follow(G, 'S')
fx = sorted(follow['X'])
val = len(fx)
wrong = [2, 3, 5]""",
steps=["In \\(S \\to XYZ\\): \\(\\text{FIRST}(Y) = \\{y, x\\}\\); because \\(Y\\) and then \\(Z\\) can vanish, \\(\\text{FOLLOW}(X)\\) also receives \\(\\text{FIRST}(Z) = \\{z\\}\\) and \\(\\text{FOLLOW}(S) = \\{\\$\\}\\).", "From \\(X \\to xX\\) it receives \\(\\text{FOLLOW}(X)\\) itself, and from \\(Y \\to X\\) it receives \\(\\text{FOLLOW}(Y) = \\{z, \\$\\}\\).", "\\(\\text{FOLLOW}(X) = \\{«fx»\\}\\), so there are «val» symbols."],
trap="Using only the first symbol after \\(X\\) (giving \\(\\{x, y\\}\\)) and forgetting that nullable symbols let the lookahead pass through to \\(z\\) and \\(\\$\\).", short="Pass through every nullable symbol to the right of \\(X\\) until a non-nullable one or the end of the production.", kind="multi_concept")

# 14 activation records (MCQ 2, key C)
K.add(14, r"A function is defined as \(f(n) = 1\) for \(n \le 1\), and for \(n \ge 2\) it makes the two recursive calls \(f(n-1)\) and \(f(n-2)\) (each call needs one activation record). The total number of activation records created by the single call \(f(6)\), including the first, is",
"""calls = [0]
def f(n):
    calls[0] += 1
    if n >= 2:
        f(n - 1)
        f(n - 2)
f(6)
val = calls[0]
wrong = [15, 21, 31]""",
steps=["Let \\(C(n)\\) be the number of calls: \\(C(0) = C(1) = 1\\) and \\(C(n) = 1 + C(n-1) + C(n-2)\\).", "\\(C(2)=3,\\ C(3)=5,\\ C(4)=9,\\ C(5)=15,\\ C(6)=«val»\\)."],
trap="Reporting the stack depth (6) or the Fibonacci number \\(F(6)\\) instead of the count of all calls.", short="\\(C(n) = 2F(n+1) - 1\\) with \\(F(1)=F(2)=1\\); here \\(2 \\times 13 - 1\\).", kind="numeric_chain")

# 15 TCP cwnd (MCQ 1, key B)
K.add(15, r"A TCP sender starts with a congestion window of \(1\) MSS and a slow-start threshold of \(16\) MSS. There are no losses. The window is doubled each round trip while it is below the threshold (but never beyond the threshold in one step), and is increased by \(1\) MSS per round trip once it has reached the threshold. The window size (in MSS) after \(7\) round trips is",
"""cw = 1
for r in range(7):
    if cw < 16:
        cw = min(cw * 2, 16)
    else:
        cw += 1
val = cw
wrong = [18, 128, 24]""",
steps=["Rounds 1 to 4 double the window: \\(1 \\to 2 \\to 4 \\to 8 \\to 16\\), reaching the threshold.", "Rounds 5 to 7 add one MSS each: \\(16 \\to 17 \\to 18 \\to «val»\\)."],
trap="Doubling all 7 times (128), ignoring the threshold, or counting one round too few.", short="4 doublings to reach 16, then 3 additive steps: 16 + 3.", kind="trace")

# 16 standard deviation (MCQ 2, key B)
K.add(16, r"The scores of eight candidates in a test are \(6, 8, 8, 10, 14, 16, 16, 18\). The population standard deviation of these scores, correct to three decimal places, is",
"""x = [6, 8, 8, 10, 14, 16, 16, 18]
m = sum(x) / len(x)
ss = sum((a - m) ** 2 for a in x)
val = round(math.sqrt(ss / len(x)), 3)
wrong = [round(math.sqrt(ss / (len(x) - 1)), 3), round(ss / len(x), 3), 4.0]""",
steps=["Mean \\(= 96/8 = 12\\); squared deviations: \\(36, 16, 16, 4, 4, 16, 16, 36\\), sum \\(= «ss»\\).", "Population variance \\(= «ss»/8 = 18\\), so the standard deviation is \\(\\sqrt{18} \\approx «val»\\)."],
trap="Dividing by \\(n - 1\\) (sample standard deviation, 4.536) or reporting the variance 18.", short="Population: divide the sum of squares by \\(n\\) and take the root.", kind="numeric_chain")

# 17 serializable schedule (MCQ 2, key C)
K.add(17, r"Four interleaved schedules over items \(A, B\) are given, with \(R_i\) and \(W_i\) denoting read and write by transaction \(T_i\). Exactly one of them is conflict serializable. Which one?",
"""scheds = [
    [(1, 'R', 'A'), (2, 'W', 'A'), (2, 'R', 'B'), (1, 'W', 'B')],
    [(1, 'R', 'A'), (2, 'R', 'A'), (1, 'W', 'A'), (2, 'W', 'A')],
    [(1, 'R', 'A'), (1, 'W', 'A'), (2, 'R', 'A'), (2, 'W', 'A'), (3, 'R', 'B'), (3, 'W', 'B')],
    [(1, 'W', 'A'), (2, 'R', 'A'), (2, 'W', 'B'), (1, 'R', 'B')],
]
def acyclic(S):
    edges = set()
    for i in range(len(S)):
        for j in range(i + 1, len(S)):
            a, b = S[i], S[j]
            if a[0] != b[0] and a[2] == b[2] and 'W' in (a[1], b[1]):
                edges.add((a[0], b[0]))
    nodes = set(t for t, o, d in S)
    while nodes:
        free = [n for n in nodes if not any(b == n and a in nodes for a, b in edges)]
        if not free:
            return False
        nodes = nodes - set(free)
    return True
truth = [acyclic(S) for S in scheds]""",
stmts=[r"\(R_1(A)\ W_2(A)\ R_2(B)\ W_1(B)\)", r"\(R_1(A)\ R_2(A)\ W_1(A)\ W_2(A)\)", r"\(R_1(A)\ W_1(A)\ R_2(A)\ W_2(A)\ R_3(B)\ W_3(B)\)", r"\(W_1(A)\ R_2(A)\ W_2(B)\ R_1(B)\)"],
steps=["Draw an edge \\(T_i \\to T_j\\) for each conflicting pair with \\(T_i\\)'s operation first.", "Schedules 1, 2 and 4 each give edges both ways between \\(T_1\\) and \\(T_2\\): a cycle, so they are not conflict serializable.", "Schedule 3 only has \\(T_1 \\to T_2\\) (and \\(T_3\\) is independent), so it is serializable (equivalent to \\(T_1, T_2, T_3\\))."],
trap="Judging by whether the operations of each transaction look grouped together rather than by cycles in the precedence graph.", short="Look for a pair of transactions with conflicts in both directions.", kind="trace")

# 18 fork counting (MSQ 2)
K.add(18, r"""Consider the following C fragment executed by a single process (all calls succeed).
```c
fork();
if (fork() == 0) {
    fork();
}
printf("x");
```
Which of the following statements is/are TRUE?""",
"""P = 1
created1 = P
P = P * 2
executed2 = P
created2 = P
children = P
P = P * 2
executed3 = children
created3 = children
P = P + children
prints = P
total_new = created1 + created2 + created3
truth = [prints == 6, created3 == 3, executed2 == 4, total_new == 5]""",
stmts=[r"The statement printf prints x exactly six times in total.", r"The innermost fork() (inside the if) creates three new processes.", r"The fork() in the if condition is executed by exactly four processes.", r"Five new processes are created by the three fork() statements together."],
steps=["The first fork() is run by 1 process and creates 1 new one: 2 processes. The fork() in the if condition is run by both, creating 2 more: 4 processes.", "The innermost fork() runs only in the 2 children of the second fork, creating 2 more: 6 processes in total, and each prints once.", "New processes: \\(1 + 2 + 2 = 5\\). The condition fork is executed by 2 processes (not 4), and the innermost fork creates 2 processes (not 3)."],
trap="Applying the rule \\(2^n\\) for n forks (8 processes) without noticing that the innermost fork is guarded by the if.", short="Count how many processes reach each fork(), not just how many forks appear.", kind="msq_discriminator")

# 19 counting strings (MCQ 2, key C)
K.add(19, r"Let \(L_1 = \{ w \in \{a,b\}^* : \text{the number of } a\text{'s in } w \text{ is even} \}\) and \(L_2 = \{ w \in \{a,b\}^* : \text{the number of } b\text{'s in } w \equiv 1 \pmod 3 \}\). The number of strings of length \(6\) that belong to \(L_1\) but not to \(L_2\) is",
"""cnt = 0
for bits in range(64):
    w = [(bits >> j) & 1 for j in range(6)]
    na = 6 - sum(w)
    nb = sum(w)
    if na % 2 == 0 and nb % 3 != 1:
        cnt += 1
val = cnt
wrong = [15, 32, 47]""",
steps=["Strings of length 6 with an even number of a's: \\(2^5 = 32\\).", "Among them, those with the number of b's \\(\\equiv 1 \\pmod 3\\): 4 b's and 2 a's gives \\(\\binom{6}{4} = 15\\) (1 b would leave 5 a's, odd).", "Answer \\(= 32 - 15 = «val»\\)."],
trap="Subtracting the wrong count or forgetting that the a-count is tied to the b-count by the length.", short="Half of all strings have an even a-count; remove the intersection with \\(L_2\\).", kind="numeric_chain")

# 20 LL(1) conflicts (MCQ 2, key C)
K.add(20, r"For the grammar \(S \to aAb \mid aB \mid A\), \(A \to aA \mid \varepsilon\), \(B \to b\), the number of productions of \(S\) that the LL(1) parsing-table construction enters in the cell \(M[S, a]\) is",
FF + """G = {'S': [('a', 'A', 'b'), ('a', 'B'), ('A',)], 'A': [('a', 'A'), ()], 'B': [('b',)]}
first, follow, nullable = first_follow(G, 'S')
def first_of(rhs):
    out = set()
    nul = True
    for X in rhs:
        out = out | (first[X] if X in G else set([X]))
        if not (nullable[X] if X in G else False):
            nul = False
            break
    return out, nul
val = 0
for rhs in G['S']:
    f, nul = first_of(rhs)
    if 'a' in f or (nul and 'a' in follow['S']):
        val += 1
wrong = [1, 2, 4]""",
steps=["\\(\\text{FIRST}(aAb) = \\{a\\}\\) and \\(\\text{FIRST}(aB) = \\{a\\}\\).", "\\(\\text{FIRST}(A) = \\{a, \\varepsilon\\}\\), so \\(S \\to A\\) is also entered under \\(a\\).", "All «val» productions of \\(S\\) go into \\(M[S, a]\\): the grammar is not LL(1)."],
trap="Counting only the two productions that start with the terminal \\(a\\) and missing the one reached through the nullable \\(A\\).", short="Compute FIRST of every right-hand side, including those that start with a nonterminal.", kind="trap_aware")

# 21 protocol efficiency (MCQ 2, key D)
K.add(21, r"An application sends \(1200\) bytes of data in one TCP segment. The TCP header is \(20\) bytes, the IP header is \(20\) bytes, and Ethernet adds a \(14\)-byte header and a \(4\)-byte trailer. The percentage of the bytes on the wire that is application data, correct to one decimal place, is",
"""data = 1200
tot = data + 20 + 20 + 14 + 4
val = round(100 * data / tot, 1)
wrong = [round(100 * data / (data + 40), 1), round(100 * data / (data + 20), 1), 93.0]""",
steps=["Total bytes on the wire \\(= 1200 + 20 + 20 + 14 + 4 = 1258\\).", "Efficiency \\(= 1200 / 1258 \\approx «val»\\%\\)."],
trap="Leaving out the Ethernet header and trailer (96.8 %), or counting only one header.", short="Add every header of every layer to the denominator.", kind="application")

# 22 TCP window throughput (MCQ 1, key A)
K.add(22, r"A TCP connection uses a fixed window of \(65535\) bytes and has a round-trip time of \(80\) ms. The maximum throughput the window allows, in megabits per second (taking \(1\) Mb \(= 10^6\) bits), correct to two decimal places, is",
"""val = round(65535 * 8 / 0.080 / 1e6, 2)
wrong = [5.24, 52.43, 8.19]""",
steps=["At most one window can be sent per round trip: \\(65535 \\times 8\\) bits per \\(0.08\\) s.", "Throughput \\(= 524280 / 0.08 \\approx «val»\\) Mbps."],
trap="Forgetting to convert bytes to bits (giving 0.82 Mbps) or using the one-way delay.", short="Throughput \\(= W / RTT\\).", kind="application")

# 23 same-colour probability (MCQ 2, key A)
K.add(23, r"A box contains \(5\) red and \(4\) blue balls. Two balls are drawn at random without replacement. The probability that both balls have the same colour, correct to four decimal places, is",
"""tot = math.comb(9, 2)
same = math.comb(5, 2) + math.comb(4, 2)
val = round(same / tot, 4)
wrong = [0.5, round(math.comb(5, 1) * math.comb(4, 1) / tot, 4), 0.2778]""",
steps=["Pairs of the same colour: \\(\\binom{5}{2} + \\binom{4}{2} = 10 + 6 = 16\\).", "All pairs: \\(\\binom{9}{2} = 36\\). Probability \\(= 16/36 = «val»\\)."],
trap="Giving 0.5556, the probability of different colours, or using draws with replacement.", short="\\(P(\\text{same}) = 1 - P(\\text{different}) = 1 - 20/36\\).", kind="application")

# 24 deadlock aborts (MCQ 2, key C)
K.add(24, r"In a lock-based system the wait-for graph has an edge \(T_i \to T_j\) when \(T_i\) waits for \(T_j\). The edges are \(T_1 \to T_2,\ T_2 \to T_3,\ T_3 \to T_1,\ T_3 \to T_4,\ T_4 \to T_5,\ T_5 \to T_6,\ T_6 \to T_4\). The minimum number of transactions that must be aborted so that no deadlock remains is",
"""E = [(1, 2), (2, 3), (3, 1), (3, 4), (4, 5), (5, 6), (6, 4)]
def has_cycle(removed):
    nodes = set(range(1, 7)) - set(removed)
    es = [(a, b) for a, b in E if a in nodes and b in nodes]
    while nodes:
        free = [n for n in nodes if not any(b == n for a, b in es if a in nodes)]
        if not free:
            return True
        nodes = nodes - set(free)
    return False
val = next(k for k in range(0, 7) if any(not has_cycle(c) for c in itertools.combinations(range(1, 7), k)))
wrong = [1, 3, 4]""",
steps=["There are two cycles: \\(T_1 \\to T_2 \\to T_3 \\to T_1\\) and \\(T_4 \\to T_5 \\to T_6 \\to T_4\\). The edge \\(T_3 \\to T_4\\) only links them and is on no cycle.", "The cycles share no transaction, so one abort cannot break both; aborting one transaction in each (for example \\(T_1\\) and \\(T_4\\)) is enough: the minimum is «val»."],
trap="Aborting \\(T_3\\) because it appears to connect everything; that breaks only the first cycle.", short="Count disjoint cycles: each needs its own victim.", kind="trap_aware")

# 25 IEEE decode (MCQ 1, key B)
K.add(25, r"A 32-bit IEEE 754 single-precision number has the hexadecimal pattern \(\texttt{0xC1480000}\). The decimal value it represents is",
"""bits = 0xC1480000
sign = -1 if (bits >> 31) & 1 else 1
exp = (bits >> 23) & 0xFF
frac = bits & 0x7FFFFF
val = sign * (1 + frac / 2 ** 23) * 2 ** (exp - 127)
wrong = [-6.25, 12.5, -25.0]""",
steps=["Sign bit \\(= 1\\) (negative); exponent field \\(= \\texttt{0x82} = 130\\), so the exponent is \\(130 - 127 = 3\\).", "Fraction \\(= \\texttt{0x480000} / 2^{23} = 0.5625\\), so the significand is \\(1.5625\\).", "Value \\(= -1.5625 \\times 2^3 = «val»\\)."],
trap="Dropping the sign (12.5) or using bias 128.", short="1.5625 is 1 + 9/16; times 8 gives 12.5.", kind="application")

# 26 essential prime implicants (MCQ 2, key D)
K.add(26, r"The function \(f(A,B,C,D) = \sum m(0, 1, 2, 5, 6, 7, 8, 9, 10, 14)\) is minimised on a Karnaugh map. The number of essential prime implicants of \(f\) is",
"""on = set([0, 1, 2, 5, 6, 7, 8, 9, 10, 14])
cubes = []
for mask in range(16):
    for val0 in range(16):
        if val0 & (15 - mask):
            continue
        cover = set([m for m in range(16) if (m & mask) == val0])
        if cover <= on:
            cubes.append(cover)
primes = [c for c in cubes if not any(c < d for d in cubes)]
ess = []
for m in on:
    owners = [p for p in primes if m in p]
    if len(owners) == 1 and owners[0] not in ess:
        ess.append(owners[0])
val = len(ess)
npr = len(primes)
wrong = sorted(set([1, 2, 3, 4, 5]) - set([val]))[:3]""",
steps=["The prime implicants are the largest groups of 1s: there are «npr» of them.", "A prime implicant is essential when it covers a minterm that no other prime implicant covers.", "Checking each minterm, the essential prime implicants number «val»."],
trap="Counting all prime implicants, or all groups in the final minimal cover, instead of only the essential ones.", short="Look for 1s on the map that sit in exactly one maximal group.", kind="conceptual")

# 27 tokens (MCQ 1, key D)
K.add(27, r"A lexical analyser uses the longest-match rule with these token classes: identifiers (letter followed by letters or digits), unsigned numbers (digits with an optional fractional part such as 2.5), and the operators \(<=, >=, ==, !=, <, >, =, *\). Whitespace separates nothing here; the input is the string `x1=y<=z>=2.5*3!=w`. The number of tokens produced is",
"""s = 'x1=y<=z>=2.5*3!=w'
ops2 = ['<=', '>=', '==', '!=']
ops1 = ['<', '>', '=', '*']
i, n = 0, 0
while i < len(s):
    c = s[i]
    if c.isalpha():
        j = i + 1
        while j < len(s) and (s[j].isalpha() or s[j].isdigit()):
            j += 1
        i = j
    elif c.isdigit():
        j = i + 1
        while j < len(s) and s[j].isdigit():
            j += 1
        if j + 1 < len(s) and s[j] == '.' and s[j + 1].isdigit():
            j += 1
            while j < len(s) and s[j].isdigit():
                j += 1
        i = j
    elif s[i:i + 2] in ops2:
        i += 2
    else:
        i += 1
    n += 1
val = n
wrong = [9, 12, 14]""",
steps=["Scanning with the longest match: x1, =, y, <=, z, >=, 2.5, *, 3, !=, w.", "That is «val» tokens; \\(x1\\) is one identifier, \\(2.5\\) one number, and \\(<=\\), \\(>=\\), \\(!=\\) are single tokens."],
trap="Splitting \\(<=\\) into \\(<\\) and \\(=\\), or splitting \\(2.5\\) at the point.", short="Always take the longest string that matches some token class.", kind="trace")

# 28 BST facts (MSQ 1)
K.add(28, r"Keys \(40, 20, 60, 10, 30, 50, 70, 25, 35\) are inserted in this order into an initially empty binary search tree (no rebalancing). Which of the following statements is/are TRUE? (Height is the number of edges on the longest root-to-leaf path.)",
"""root = None
def ins(t, k):
    if t is None:
        return [k, None, None]
    if k < t[0]:
        t[1] = ins(t[1], k)
    else:
        t[2] = ins(t[2], k)
    return t
def height(t):
    return -1 if t is None else 1 + max(height(t[1]), height(t[2]))
def inorder(t):
    return [] if t is None else inorder(t[1]) + [t[0]] + inorder(t[2])
for k in [40, 20, 60, 10, 30, 50, 70, 25, 35]:
    root = ins(root, k)
h = height(root)
order = inorder(root)
succ30 = order[order.index(30) + 1]
levels = [root]
seq = []
while levels:
    nxt = []
    for t in levels:
        seq.append(t[0])
        if t[1]:
            nxt.append(t[1])
        if t[2]:
            nxt.append(t[2])
    levels = nxt
truth = [h == 3, succ30 == 35, order == sorted(order), seq[6] == 50]""",
stmts=[r"The height of the tree is 3.", r"The in-order successor of 30 is 35.", r"The in-order traversal prints the keys in increasing order.", r"The seventh key in level-order (breadth-first) traversal is 50."],
steps=["The tree is 40 (20 (10, 30 (25, 35)), 60 (50, 70)); the longest path is 40, 20, 30, 25: height 3.", "30 has a right child 35 with no left child, so its successor is 35; in-order traversal of any BST is sorted.", "Level-order is 40, 20, 60, 10, 30, 50, 70, 25, 35, whose seventh key is 70, not 50."],
trap="Reading level-order as sorted order, or counting nodes instead of edges for the height.", short="Draw the tree once and answer all four from the picture.", kind="msq_discriminator")

K.save("p2")
