"""Forge b008 part 4 (slots 45-62). Authored in a local Claude Code session; run: python scripts/forge/author_b008_p4.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b008")

# 45 CSMA/CD minimum frame (MCQ 1, key B)
K.add(45, r"A shared Ethernet-like bus of length \(2000\) m runs at \(10\) Mbps and signals travel at \(2 \times 10^8\) m/s. For CSMA/CD to detect every collision before a sender finishes transmitting, the minimum frame size, in bits, is",
"""bw = 10e6
d = 2000
v = 2e8
val = int(round(2 * (d / v) * bw))
wrong = [100, 400, 25]""",
steps=["One-way propagation time \\(= 2000 / (2 \\times 10^8) = 10\\ \\mu s\\).", "The sender must still be transmitting when a collision signal returns after a round trip of \\(20\\ \\mu s\\): frame \\(\\ge 20\\ \\mu s \\times 10\\) Mbps \\(= «val»\\) bits."],
trap="Using the one-way delay (100 bits) or reporting 25 bytes without converting.", short="Minimum frame time \\(= 2T_p\\).", kind="application")

# 46 knights and knaves (MCQ 2, key C)
K.add(46, r"Each of three people \(A, B, C\) is either a truth-teller (always tells the truth) or a liar (always lies). A says: 'Exactly one of us is a liar.' B says: 'C is a liar.' C says: 'A and B are both truth-tellers.' The number of liars among the three is",
"""sols = []
for tA in (True, False):
    for tB in (True, False):
        for tC in (True, False):
            liars = [tA, tB, tC].count(False)
            sA = liars == 1
            sB = not tC
            sC = tA and tB
            if tA == sA and tB == sB and tC == sC:
                sols.append((tA, tB, tC))
assert len(sols) == 1
val = sols[0].count(False)
wrong = [0, 1, 3]""",
steps=["Suppose C is a truth-teller: then A and B are truth-tellers, but B says C is a liar: contradiction. So C is a liar.", "Then B's statement is true, so B is a truth-teller, and C's statement is false, so A and B are not both truthful: A is a liar.", "Check: liars are A and C, so the statement 'exactly one of us is a liar' is false, as it must be for a liar. The number of liars is «val»."],
trap="Accepting A's statement as true without testing it against the other two statements.", short="Start with the person whose truth value is forced by contradiction (C).", kind="multi_concept")

# 47 pipeline speedup (NAT 1)
K.add(47, r"An instruction is executed in five stages with stage delays \(200, 150, 250, 180, 170\) ps. In a pipelined processor every stage is followed by a latch of delay \(20\) ps. The non-pipelined processor needs the sum of the stage delays per instruction. For \(1000\) instructions with no stalls, the speedup of the pipelined processor over the non-pipelined one, correct to two decimal places, is ______.",
"""stages = [200, 150, 250, 180, 170]
clock = max(stages) + 20
n = 1000
nonpipe = n * sum(stages)
pipe = (len(stages) + n - 1) * clock
answer = round(nonpipe / pipe, 2)
seq = sum(stages)""",
steps=["Non-pipelined time per instruction \\(= «seq»\\) ps; for 1000 instructions \\(= 950000\\) ps.", "Pipelined clock \\(= 250 + 20 = «clock»\\) ps; time \\(= (5 + 999) \\times 270 = 271080\\) ps.", "Speedup \\(= 950000 / 271080 \\approx «answer»\\)."],
trap="Using the ideal speedup of 5, or forgetting the latch delay and the pipeline fill time.", short="Clock \\(= \\max(\\text{stage}) + \\text{latch}\\); time \\(= (k + n - 1) \\times\\) clock.", kind="numeric_chain")

# 48 static variable recursion (NAT 2)
K.add(48, r"""A programmer keeps a running total inside a routine by declaring a counter with static storage, hoping each activation will add to the same location. The routine is shown below. In a fresh run of the program, the very first activation is made with the argument 4. What number does that outermost activation hand back to its caller? ______
```c
int f(int n) {
    static int c = 0;
    c += n;
    if (n > 1) f(n - 1);
    return c;
}
```""",
"""c = [0]
def f(n):
    c[0] += n
    if n > 1:
        f(n - 1)
    return c[0]
answer = f(4)""",
steps=["The static variable \\(c\\) is shared by all calls: the calls add 4, 3, 2 and 1 in that order, so \\(c\\) becomes 4, 7, 9, 10.", "The outermost call returns \\(c\\) after the recursion has finished, so it returns «answer»."],
trap="Returning the value \\(c\\) had at the time of the call (4) as if it were a local variable.", short="Static means one shared copy: the final value is \\(4 + 3 + 2 + 1\\).", kind="trace")

# 49 DAG nodes (MCQ 2, key A)
K.add(49, r"A compiler builds a directed acyclic graph (DAG) with value numbering for the expression \((a + b) * (a + b) + (a + b) * c\), merging every repeated subexpression. The total number of nodes in the DAG, counting leaves and operator nodes, is",
"""nodes = {}
def mk(*key):
    if key not in nodes:
        nodes[key] = len(nodes)
    return nodes[key]
a = mk('leaf', 'a')
b = mk('leaf', 'b')
c = mk('leaf', 'c')
s1 = mk('+', a, b)
s2 = mk('+', a, b)
p1 = mk('*', s1, s2)
p2 = mk('*', s1, c)
top = mk('+', p1, p2)
val = len(nodes)
wrong = [6, 8, 10]""",
steps=["Leaves: \\(a, b, c\\): 3 nodes. The two occurrences of \\(a + b\\) share one node (4 nodes so far).", "\\((a+b)*(a+b)\\) is one node, \\((a+b)*c\\) another, and the final \\(+\\) a third: \\(4 + 3 = «val»\\) nodes."],
trap="Building a tree (12 nodes) or merging the two products into one node.", short="Count each distinct (operator, operands) pair once.", kind="trace")

# 50 orderings (MCQ 1, key D)
K.add(50, r"Five runners \(P, Q, R, S, T\) finish a race with no ties. It is known that \(P\) finishes before \(Q\); \(S\) finishes immediately before \(R\); and \(T\) neither wins nor comes last. The number of possible finishing orders is",
"""cnt = 0
for o in itertools.permutations('PQRST'):
    pos = {x: i for i, x in enumerate(o)}
    if pos['P'] < pos['Q'] and pos['R'] - pos['S'] == 1 and pos['T'] not in (0, 4):
        cnt += 1
val = cnt
wrong = [8, 12, 18]""",
steps=["Treat \\(SR\\) as one block; arrange the 4 units \\(P, Q, T, [SR]\\) in a row: \\(4! = 24\\) ways.", "Keep \\(P\\) before \\(Q\\): half, 12. Of these, remove the ones where \\(T\\) is first or last; the remaining number is «val»."],
trap="Counting arrangements of the block as 2 (allowing \\(RS\\)), or forgetting that the block takes two places.", short="Glue S and R, use symmetry for P before Q, then subtract the cases with T at an end.", kind="multi_concept")

# 51 lossless and dependency preserving (MSQ 2)
K.add(51, r"A relation \(R(A, B, C, D)\) has the functional dependencies \(A \to B,\ B \to C,\ C \to D\). Two decompositions are considered: \(D_1 = \{AB, BC, CD\}\) and \(D_2 = \{AC, BD\}\). Which of the following statements is/are TRUE?",
"""attrs = 'ABCD'
F = [('A', 'B'), ('B', 'C'), ('C', 'D')]
def closure(s, fds):
    s = set(s)
    ch = True
    while ch:
        ch = False
        for l, r in fds:
            if set(l) <= s and not set(r) <= s:
                s = s | set(r)
                ch = True
    return s
def lossless(rels):
    tab = [[0 if x in r else i + 1 for x in attrs] for i, r in enumerate(rels)]
    ch = True
    while ch:
        ch = False
        for l, r in F:
            li = [attrs.index(x) for x in l]
            ri = attrs.index(r)
            for i in range(len(tab)):
                for j in range(len(tab)):
                    if i != j and all(tab[i][k] == tab[j][k] for k in li) and tab[i][ri] != tab[j][ri]:
                        lo = min(tab[i][ri], tab[j][ri])
                        hi = max(tab[i][ri], tab[j][ri])
                        for row in tab:
                            if row[ri] == hi:
                                row[ri] = lo
                        ch = True
    return any(all(v == 0 for v in row) for row in tab)
def preserving(rels):
    for l, r in F:
        z = set(l)
        ch = True
        while ch:
            ch = False
            for rel in rels:
                add = closure(z & set(rel), F) & set(rel)
                if not add <= z:
                    z = z | add
                    ch = True
        if not set(r) <= z:
            return False
    return True
D1 = ['AB', 'BC', 'CD']
D2 = ['AC', 'BD']
truth = [lossless(D1), preserving(D1), lossless(D2), preserving(D2)]""",
stmts=[r"\(D_1\) is a lossless-join decomposition.", r"\(D_1\) is dependency preserving.", r"\(D_2\) is a lossless-join decomposition.", r"\(D_2\) is dependency preserving."],
steps=["\\(D_1\\) keeps each dependency inside one relation (\\(A \\to B\\) in \\(AB\\), \\(B \\to C\\) in \\(BC\\), \\(C \\to D\\) in \\(CD\\)), so it is dependency preserving, and joining along the chain \\(B\\), \\(C\\) is lossless.", "\\(D_2 = \\{AC, BD\\}\\) share no attribute, so their join is a Cartesian product: lossy.", "For \\(D_2\\), \\(A \\to B\\) cannot be recovered: from \\(A\\) the projections only give \\(C\\), never \\(B\\), so it is not dependency preserving."],
trap="Assuming that any decomposition into 2NF or 3NF pieces keeps both properties; each property has to be tested separately.", short="Lossless: test with the chase (or common attributes for two pieces). Preserving: grow the closure of each left side inside the pieces.", kind="msq_discriminator")

# 52 pipes (MCQ 2, key D)
K.add(52, r"A tank is filled by pipe \(P\) alone in \(12\) hours and by pipe \(Q\) alone in \(15\) hours. A drain pipe \(R\) empties the full tank in \(20\) hours. If the tank is initially empty and all three pipes are opened together, the time taken to fill the tank, in hours, is",
"""rate = fractions.Fraction(1, 12) + fractions.Fraction(1, 15) - fractions.Fraction(1, 20)
val = int(1 / rate)
wrong = [8, 12, 15]""",
steps=["Net rate \\(= \\tfrac1{12} + \\tfrac1{15} - \\tfrac1{20} = \\tfrac{5 + 4 - 3}{60} = \\tfrac{6}{60} = \\tfrac1{10}\\) of the tank per hour.", "Time \\(= 1 / (1/10) = «val»\\) hours."],
trap="Adding the drain's rate instead of subtracting it (giving 6.67 hours).", short="Use the common denominator 60: 5 + 4 - 3 = 6 parts per hour out of 60.", kind="application")

# 53 work and wages (MCQ 2, key B)
K.add(53, r"\(A\) alone can complete a job in \(10\) days and \(B\) alone in \(15\) days. They start together, and \(A\) leaves after \(4\) days. The number of additional days \(B\) needs to finish the remaining work alone is",
"""done = 4 * (fractions.Fraction(1, 10) + fractions.Fraction(1, 15))
rest = 1 - done
val = int(rest / fractions.Fraction(1, 15))
wrong = [4, 6, 7]""",
steps=["In 4 days together they complete \\(4(\\tfrac1{10} + \\tfrac1{15}) = \\tfrac23\\) of the job.", "Remaining \\(\\tfrac13\\); \\(B\\) does \\(\\tfrac1{15}\\) per day, so he needs \\(\\tfrac13 \\div \\tfrac1{15} = «val»\\) days."],
trap="Subtracting only \\(A\\)'s share of the first four days.", short="Combined rate \\(= 1/6\\) per day: 4 days finish two thirds.", kind="application")

# 54 timestamp ordering (MSQ 2)
K.add(54, r"Basic timestamp ordering is used with timestamps \(TS(T_1) = 10\), \(TS(T_2) = 20\), \(TS(T_3) = 30\). The operations arrive in the order \(R_1(A)\ W_2(A)\ R_3(A)\ W_1(A)\ R_2(B)\ W_3(B)\ W_2(B)\). An operation that violates the rules causes its transaction to abort (its later operations are ignored). Which of the following statements is/are TRUE?",
"""TS = {1: 10, 2: 20, 3: 30}
rts = {'A': 0, 'B': 0}
wts = {'A': 0, 'B': 0}
aborted = set()
ops = [(1, 'R', 'A'), (2, 'W', 'A'), (3, 'R', 'A'), (1, 'W', 'A'), (2, 'R', 'B'), (3, 'W', 'B'), (2, 'W', 'B')]
for t, o, x in ops:
    if t in aborted:
        continue
    if o == 'R':
        if TS[t] < wts[x]:
            aborted.add(t)
        else:
            rts[x] = max(rts[x], TS[t])
    else:
        if TS[t] < rts[x] or TS[t] < wts[x]:
            aborted.add(t)
        else:
            wts[x] = TS[t]
truth = [1 in aborted, 2 in aborted, 3 in aborted, len(aborted) == 2]""",
stmts=[r"\(T_1\) is aborted.", r"\(T_2\) is aborted.", r"\(T_3\) is aborted.", r"Exactly two transactions are aborted."],
steps=["\\(R_1(A)\\), \\(W_2(A)\\), \\(R_3(A)\\) are allowed: \\(\\text{RTS}(A) = 30\\), \\(\\text{WTS}(A) = 20\\).", "\\(W_1(A)\\) has \\(TS = 10 < \\text{RTS}(A) = 30\\): \\(T_1\\) aborts. \\(R_2(B)\\) and \\(W_3(B)\\) are allowed (\\(\\text{RTS}(B) = 20\\), \\(\\text{WTS}(B) = 30\\)).", "\\(W_2(B)\\) has \\(TS = 20 < \\text{WTS}(B) = 30\\): \\(T_2\\) aborts. \\(T_3\\) completes. So \\(T_1\\) and \\(T_2\\) abort: two transactions."],
trap="Applying the rules to the order of the operations of one transaction only, or letting an aborted transaction's later operations still update the timestamps.", short="Track RTS and WTS of each item after every operation.", kind="trace")

# 55 recursion value (NAT 2)
K.add(55, r"""The routine below splits its argument twice at every level, once into halves and once into quarters, using truncating integer division, and adds up the parity (remainder modulo 2) of every argument it meets until the argument reaches zero. Work out the total that the call with argument 20 produces. ______
```c
int g(int n) {
    if (n == 0) return 0;
    return n % 2 + g(n / 2) + g(n / 4);
}
```""",
"""def g(n):
    if n == 0:
        return 0
    return n % 2 + g(n // 2) + g(n // 4)
answer = g(20)""",
steps=["Integer division truncates. \\(g(20) = 0 + g(10) + g(5)\\); \\(g(10) = 0 + g(5) + g(2)\\); \\(g(5) = 1 + g(2) + g(1)\\).", "Working down: \\(g(1) = 1\\), \\(g(2) = 0 + g(1) + g(0) = 1\\), \\(g(5) = 1 + 1 + 1 = 3\\), \\(g(10) = 3 + 1 = 4\\), \\(g(20) = 4 + 3 = «answer»\\)."],
trap="Evaluating \\(n/4\\) as a real number or forgetting that \\(g(0) = 0\\) ends the recursion.", short="Tabulate \\(g(0), g(1), g(2), g(5), g(10), g(20)\\) bottom-up.", kind="trace")

# 56 effective access time (NAT 1)
K.add(56, r"A system has a single-level page table in main memory. A TLB lookup takes \(20\) ns and a main-memory access takes \(100\) ns. The TLB hit ratio is \(90\%\) and the TLB is searched before the page table is read on a miss. The effective memory access time, in nanoseconds, is ______.",
"""hit = 0.9
tlb = 20
mem = 100
answer = round(hit * (tlb + mem) + (1 - hit) * (tlb + mem + mem), 6)""",
steps=["A hit costs \\(20 + 100 = 120\\) ns; a miss costs \\(20 + 100 + 100 = 220\\) ns (extra access for the page-table entry).", "Effective time \\(= 0.9 \\times 120 + 0.1 \\times 220 = «answer»\\) ns."],
trap="Leaving out the TLB lookup time on a miss, or counting the page-table access on a hit.", short="EAT \\(= t_{TLB} + t_{mem} + (1 - h)\\,t_{mem}\\).", kind="numeric_chain")

# 57 seating (MCQ 2, key B)
K.add(57, r"Five friends \(P, Q, R, S, T\) sit in a row of five chairs. \(P\) and \(Q\) refuse to sit next to each other. The number of different seating arrangements is",
"""cnt = 0
for o in itertools.permutations('PQRST'):
    if abs(o.index('P') - o.index('Q')) != 1:
        cnt += 1
val = cnt
wrong = [48, 96, 60]""",
steps=["Total arrangements \\(5! = 120\\).", "Arrangements with \\(P\\) and \\(Q\\) adjacent: treat them as a block, \\(4! \\times 2 = 48\\).", "Required \\(= 120 - 48 = «val»\\)."],
trap="Reporting the 48 adjacent arrangements.", short="Count the complement.", kind="trap_aware")

# 58 limit (NAT 1)
K.add(58, r"A student wants to know how closely the second-degree Taylor polynomial of \(e^{3x}\) about \(0\) approximates the function near the origin. Evaluate the limit \(\displaystyle \lim_{x \to 0} \dfrac{e^{3x} - 1 - 3x - \tfrac{9}{2}x^{2}}{x^{3}}\), correct to one decimal place: ______.",
"""x = 1e-3
answer = round((math.exp(3 * x) - 1 - 3 * x - 4.5 * x * x) / (x ** 3), 1)""",
steps=["Expand \\(e^{3x} = 1 + 3x + \\dfrac{(3x)^2}{2} + \\dfrac{(3x)^3}{6} + \\cdots\\); the first three terms cancel the polynomial in the numerator.", "What remains is \\(\\dfrac{27}{6}x^3 + \\cdots = 4.5\\,x^3 + \\cdots\\), so the limit is \\(«answer»\\). (L'Hopital three times gives \\(27/6\\) as well.)"],
trap="Stopping the expansion one term early (limit 0), or using \\((3x)^3/3!\\) with 3 instead of 27 in the numerator.", short="The limit is the next Taylor coefficient: \\(3^3/3!\\).", kind="application")

# 59 asymptotics (MCQ 2, key A)
K.add(59, r"Which one of the following statements is TRUE for the growth of functions as \(n \to \infty\) (all logarithms are to base 2)?",
"""n = 2.0 ** 500
ln = math.log
lg = math.log2(n)
lnA = lg * ln(n)
lnA2 = 100 * ln(n)
lnB = math.sqrt(n) * ln(2)
lnB2 = 50 * ln(lg)
lnC = lg * ln(lg)
lnC2 = 2 * ln(n)
lnD = math.lgamma(n + 1)
lnD2 = n * ln(2)
truth = [lnA <= lnA2, lnB <= lnB2, lnC >= lnC2, lnD <= lnD2]""",
stmts=[r"\(n^{\log n} = O(n^{100})\)", r"\(2^{\sqrt{n}} = O((\log n)^{50})\)", r"\((\log n)^{\log n} = \Omega(n^{2})\)", r"\(n! = O(2^{n})\)"],
steps=["Compare logarithms of the two sides for large \\(n\\). \\(n^{\\log n}\\) has logarithm \\(\\log n \\ln n\\), which eventually exceeds \\(100 \\ln n\\): the first statement is false.", "\\(2^{\\sqrt n}\\) grows faster than any polynomial in \\(\\log n\\): false. \\(n!\\) grows faster than \\(2^n\\): false.", "\\((\\log n)^{\\log n} = n^{\\log\\log n}\\), and \\(\\log \\log n\\) eventually exceeds 2, so it is \\(\\Omega(n^2)\\): true."],
trap="Judging by the look of the exponent (a bigger constant exponent seems 'faster') instead of comparing logarithms.", short="Rewrite each function as \\(2^{\\text{something}}\\) and compare the somethings.", kind="trap_aware")

# 60 train and platform (MCQ 2, key B)
K.add(60, r"A train \(150\) m long crosses a platform \(250\) m long in \(20\) seconds at a constant speed. The speed of the train, in km/h, is",
"""dist = 150 + 250
ms = dist / 20
val = int(round(ms * 3.6))
wrong = [60, 54, 90]""",
steps=["To cross the platform the train covers its own length plus the platform: \\(150 + 250 = 400\\) m.", "Speed \\(= 400/20 = 20\\) m/s \\(= 20 \\times 3.6 = «val»\\) km/h."],
trap="Using only the platform length (12.5 m/s = 45 km/h).", short="Distance \\(=\\) train \\(+\\) platform.", kind="application")

# 61 determinant (MCQ 1, key A)
K.add(61, r"The determinant of the matrix \(M = \begin{pmatrix} 2 & 1 & 0 & 3 \\ 1 & 3 & 2 & 1 \\ 0 & 2 & 4 & 1 \\ 3 & 1 & 1 & 2 \end{pmatrix}\) is",
"""M = [[2, 1, 0, 3], [1, 3, 2, 1], [0, 2, 4, 1], [3, 1, 1, 2]]
def det(A):
    A = [[fractions.Fraction(x) for x in r] for r in A]
    n = len(A)
    d = fractions.Fraction(1)
    for i in range(n):
        p = next((r for r in range(i, n) if A[r][i] != 0), None)
        if p is None:
            return 0
        if p != i:
            A[i], A[p] = A[p], A[i]
            d = -d
        d = d * A[i][i]
        for r in range(i + 1, n):
            f = A[r][i] / A[i][i]
            A[r] = [A[r][k] - f * A[i][k] for k in range(n)]
    return d
val = int(det(M))
wrong = [val + 12, -val, 2 * val]""",
steps=["Reduce to upper triangular form with row operations (swaps change the sign; adding a multiple of a row does not).", "The product of the diagonal entries after elimination, with the sign changes, is «val»."],
trap="Forgetting the sign change for each row swap, or scaling a row without dividing the determinant.", short="Eliminate below the pivots and multiply the diagonal.", kind="trace")

# 62 monotone functions (NAT 1)
K.add(62, r"A Boolean function \(f(x, y, z)\) is monotone if \(f(a) \le f(b)\) whenever \(a \le b\) bitwise (that is, changing any input from 0 to 1 never changes the output from 1 to 0). The number of monotone Boolean functions of three variables is ______.",
"""cnt = 0
for tt in range(256):
    f = [(tt >> i) & 1 for i in range(8)]
    ok = True
    for a in range(8):
        for b in range(8):
            if (a & b) == a and f[a] > f[b]:
                ok = False
    if ok:
        cnt += 1
answer = cnt""",
steps=["Monotone functions correspond to up-sets of the 8-element cube of inputs (an antichain of minimal true points).", "Counting the antichains in the Boolean lattice of 3 elements gives «answer» functions (the Dedekind number \\(M(3)\\))."],
trap="Counting only the functions built from AND and OR without constants (18) and missing the constants 0 and 1.", short="Dedekind numbers: 2, 3, 6, 20, 168 for \\(n = 0, 1, 2, 3, 4\\).", kind="conceptual")

K.save("p4")
