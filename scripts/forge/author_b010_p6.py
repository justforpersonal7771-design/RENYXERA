"""Forge b010 part 6 (designed batch). Run: python scripts/forge/author_b010_p6.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b010")

# Quine-McCluskey helper reused by the K-map questions (runs inside the kit sandbox)
QM = """def qm(n, ones, dcs):
    terms = set((m, 0) for m in ones + dcs)
    primes = set()
    while terms:
        used = set()
        new = set()
        tl = sorted(terms)
        for i in range(len(tl)):
            for j in range(i + 1, len(tl)):
                a = tl[i]
                b = tl[j]
                if a[1] == b[1]:
                    d = a[0] ^ b[0]
                    if d and (d & (d - 1)) == 0:
                        new.add((a[0] & ~d, a[1] | d))
                        used.add(a)
                        used.add(b)
        primes |= (terms - used)
        terms = new
    return sorted(primes)
def solve(n, ones, dcs):
    pl = qm(n, ones, dcs)
    best = None
    cnt = 0
    for mask in range(1, 1 << len(pl)):
        sel = [pl[i] for i in range(len(pl)) if (mask >> i) & 1]
        if all(any((m & ~p[1]) == p[0] for p in sel) for m in ones):
            c = sum(n - bin(p[1]).count('1') for p in sel)
            if best is None or c < best:
                best = c
                cnt = 1
            elif c == best:
                cnt += 1
    return len(pl), best, cnt
"""

# 20 minimum literals with don't-cares (MCQ, key D)
K.add(20, r"A four-variable output \(f(A, B, C, D)\) of a sensor decoder is \(1\) for the input combinations \(2, 3, 7, 9, 11, 13\) (numbered with \(A\) as the most significant bit), is a don't-care for \(1, 10, 15\), and is \(0\) for all others. The minimum number of literals in a sum-of-products expression for \(f\), using the don't-cares to advantage, is",
QM + """npr, best, cnt = solve(4, [2, 3, 7, 9, 11, 13], [1, 10, 15])
val = best
wrong = [val - 1, val + 1, val + 2]""",
steps=["Group the \\(1\\)s and don't-cares on the Karnaugh map into the largest blocks: there are «npr» prime implicants once the don't-cares \\(1, 10, 15\\) are allowed to join groups.", "Choose the cheapest set of prime implicants that still covers every required \\(1\\) (the don't-cares need not be covered); the cheapest cover uses «val» literals in total."],
trap="Covering the don't-cares as well, or leaving them out of the groups so that the blocks come out smaller.", short="Use don't-cares to enlarge groups, but cover only the required ones.", kind="application")

# 34 number of minimal covers of a cyclic K-map (MCQ, key D)
K.add(34, r"The function \(f(A, B, C, D) = \sum m(0, 1, 5, 7, 8, 10, 14, 15)\) (with \(A\) the most significant bit) has no don't-cares. Among all sum-of-products expressions that use the fewest possible literals, how many different expressions (as sets of product terms) exist?",
QM + """npr, best, cnt = solve(4, [0, 1, 5, 7, 8, 10, 14, 15], [])
val = cnt
wrong = [1, 3, 4]""",
steps=["Every \\(1\\) lies in prime implicants of two cells each: all «npr» prime implicants are pairs, and none is essential (every minterm is covered by two of them), so the map is cyclic.", "The pairs form two cycles of covers that cost the same \\(«best»\\) literals, so the fewest-literal expressions are not unique: there are «val» of them."],
trap="Assuming a minimal expression is unique, or taking all prime implicants as essential.", short="A cyclic map has no essential primes; look for equally cheap alternative covers.", kind="trap_aware")

# 40 range of a small floating-point format (MCQ, key D)
K.add(40, r"A sensor uses an \(8\)-bit floating-point format: \(1\) sign bit, \(4\) exponent bits with bias \(7\) and \(3\) fraction bits. Exponent field \(0\) denotes subnormal numbers (value \(= 0.f \times 2^{1 - 7}\)), the all-ones exponent field is reserved for infinity and NaN, and all other fields are normalised (value \(= 1.f \times 2^{e - 7}\)). The ratio of the largest finite positive value to the smallest positive value, as an integer, is",
"""vals = []
for e in range(15):
    for f in range(8):
        v = (f / 8) * 2.0 ** (1 - 7) if e == 0 else (1 + f / 8) * 2.0 ** (e - 7)
        if v > 0:
            vals.append(v)
mx = max(vals)
mn = min(vals)
val = int(round(mx / mn))
wrong = [61440, 245760, 240]""",
steps=["Largest finite: exponent field \\(14\\) (the all-ones field \\(15\\) is reserved), fraction \\(111_2\\): \\((1 + 7/8) \\times 2^{14 - 7} = 240\\).", "Smallest positive: the subnormal \\(0.001_2 \\times 2^{-6} = 2^{-3} \\times 2^{-6} = 2^{-9}\\).", "Ratio \\(= 240 \\times 512 = «val»\\)."],
trap="Using exponent field 15 for the maximum, or taking the smallest normal number (2^-6) as the minimum instead of the subnormal 2^-9.", short="Largest = 1.111 x 2^7; smallest = 0.001 x 2^-6.", kind="conceptual")

# 57 Turing machine step count over all inputs (MCQ, key B)
K.add(57, r"A Turing machine increments a binary number. It starts in \(q_0\) on the leftmost bit of the input and moves right over all bits (one step per bit) until it reads the blank to the right of the input, then moves left in state \(q_1\) (one step for that move). In \(q_1\), on a \(1\) it writes \(0\) and moves left (one step), and on a \(0\) or on the blank to the left of the input it writes \(1\) and halts (one step). The machine is run once on each of the \(32\) binary strings of length \(5\) (\(00000\) to \(11111\)). The total number of steps (transitions executed) over all \(32\) runs is",
"""def run(w):
    tape = list(w) + ['_']
    pos = 0
    state = 'q0'
    steps = 0
    while True:
        if pos < 0:
            tape.insert(0, '_')
            pos = 0
        sym = tape[pos]
        if state == 'q0':
            if sym in '01':
                pos += 1
            else:
                state = 'q1'
                pos -= 1
            steps += 1
        else:
            if sym == '1':
                tape[pos] = '0'
                pos -= 1
                steps += 1
            else:
                tape[pos] = '1'
                steps += 1
                break
    return steps
tot = 0
for i in range(32):
    tot += run(format(i, '05b')) if False else run(''.join('1' if (i >> (4 - k)) & 1 else '0' for k in range(5)))
val = tot
wrong = [224, 256, 192]""",
steps=["Every run first spends \\(5\\) steps moving right over the bits and \\(1\\) step turning left at the blank: \\(6\\) steps, plus one step to write the final \\(1\\) and halt, plus one step for every trailing \\(1\\) it turns into \\(0\\).", "Over the \\(32\\) inputs the fixed part is \\(32 \\times 7 = 224\\); the number of trailing ones summed over all inputs is \\(16 + 8 + 4 + 2 + 1 = 31\\) (half of the strings end in \\(1\\), a quarter in \\(11\\), and so on).", "Total \\(= 224 + 31 = «val»\\) steps."],
trap="Counting only the carry steps (31) or forgetting the right-moving scan and the final writing step.", short="Fixed cost 7 per run plus the trailing ones; sum the trailing ones over all inputs.", kind="trace")

# 59 minimal pumping length (MCQ, key A)
K.add(59, r"Let \(L\) be the language over \(\{a, b\}\) of all strings that contain the substring \(bb\) or whose length is a multiple of \(5\). The pumping lemma for regular languages says that there is a number \(p\) such that every \(w \in L\) with \(|w| \ge p\) can be written \(w = xyz\) with \(|xy| \le p\), \(|y| \ge 1\) and \(xy^{i}z \in L\) for all \(i \ge 0\). The smallest such \(p\) for \(L\) is",
"""def words(n):
    out = ['']
    cur = ['']
    for _ in range(n):
        cur = [w + c for w in cur for c in 'ab']
        out = out + cur
    return out
W = words(11)
def pred(w):
    return 'bb' in w or len(w) % 5 == 0
Ls = [w for w in W if pred(w)]
def works(p):
    for w in Ls:
        if len(w) < p:
            continue
        ok = False
        for i in range(p + 1):
            for j in range(i + 1, p + 1):
                x = w[:i]
                y = w[i:j]
                z = w[j:]
                if all(pred(x + y * k + z) for k in range(4)):
                    ok = True
                    break
            if ok:
                break
        if not ok:
            return False
    return True
val = 1
while not works(val):
    val += 1
wrong = [val - 1, val + 1, val + 5]""",
steps=["\\(p = «val»\\) works: a word of \\(L\\) containing \\(bb\\) keeps a \\(bb\\) when we pump a single letter that is not part of it (some such letter lies among the first \\(5\\), and removing or repeating it never separates the two \\(b\\)s); a word with no \\(bb\\) has length divisible by \\(5\\), and pumping its first \\(5\\) letters changes the length by multiples of \\(5\\).", "\\(p = 4\\) fails: take \\(w = ababa\\) (length \\(5\\), no \\(bb\\)); every substring \\(y\\) of the first \\(4\\) letters, repeated or removed, either leaves a length that is not a multiple of \\(5\\) and no \\(bb\\), or breaks some pumped word. Smaller \\(p\\) fail for similar reasons.", "So the smallest pumping length is «val», even though the minimal DFA of \\(L\\) has more states."],
trap="Taking the number of states of the minimal DFA as the pumping length; the smallest valid p can be smaller.", short="Find the shortest word that cannot be pumped within p letters, then p is one more.", kind="conceptual")

# 24 limit by series expansion (NAT)
K.add(24, r"A designer approximates the difference between \(1/x^{2}\) and the cotangent-based term \(1/(x\tan x)\) for small \(x\). The value of \(\displaystyle \lim_{x \to 0}\left(\frac{1}{x^{2}} - \frac{1}{x \tan x}\right)\), correct to two decimal places, is ______.",
"""def g(x):
    return (math.sin(x) - x * math.cos(x)) / (x * x * math.sin(x))
answer = round(g(1e-3), 2)""",
steps=["Write \\(\\dfrac{1}{x^2} - \\dfrac{\\cos x}{x \\sin x} = \\dfrac{\\sin x - x\\cos x}{x^{2}\\sin x}\\).", "Expand: \\(\\sin x - x\\cos x = (x - x^3/6) - (x - x^3/2) + O(x^5) = x^3/3 + O(x^5)\\) and \\(x^2 \\sin x = x^3 + O(x^5)\\).", "The ratio tends to \\(1/3 \\approx «answer»\\)."],
trap="Treating the expression as infinity minus infinity and stopping, or using only the first term of each expansion so that the x^3 terms cancel.", short="Combine the fractions and expand sin and cos to third order.", kind="multi_concept")

# 44 normal forms with prime and non-prime attributes (MCQ, key A)
K.add(44, r"A product catalogue is stored as one table with five columns \(A, B, C, D, E\). Its only business rules are: columns \(A\) and \(B\) together fix \(C\); column \(C\) fixes \(A\); \(A\) and \(B\) together fix \(D\); and \(D\) fixes \(E\). The designer wants to know how far the table has been normalised. Which one of the following claims is TRUE?",
"""attrs = 'ABCDE'
fds = [('AB', 'C'), ('C', 'A'), ('AB', 'D'), ('D', 'E')]
def closure(x):
    s = set(x)
    ch = True
    while ch:
        ch = False
        for l, r in fds:
            if set(l) <= s and not set(r) <= s:
                s |= set(r)
                ch = True
    return s
keys = []
for n in range(1, 6):
    for comb in itertools.combinations(attrs, n):
        if closure(comb) == set(attrs) and not any(set(k) <= set(comb) for k in keys):
            keys.append(comb)
prime = set()
for k in keys:
    prime |= set(k)
def superkey(x):
    return closure(x) == set(attrs)
bcnf = all(superkey(l) for l, r in fds)
nf3 = all(superkey(l) or r in prime for l, r in fds)
nf2 = True
for k in keys:
    for n in range(1, len(k)):
        for sub in itertools.combinations(k, n):
            if any(a not in prime and a not in sub for a in closure(sub)):
                nf2 = False
truth = [bcnf, nf3 and not bcnf, nf2 and not nf3, not nf2]
kstr = ', '.join(''.join(k) for k in keys)""",
stmts=[r"The table already satisfies Boyce-Codd normal form.", r"The table satisfies third normal form but violates Boyce-Codd normal form.", r"The table satisfies second normal form but violates third normal form.", r"The table satisfies only first normal form because a non-key column depends on part of a key."],
steps=["Candidate keys: «kstr». The prime attributes are \\(A, B, C\\); \\(D\\) and \\(E\\) are non-prime.", "2NF: no non-prime attribute depends on a proper part of a key (\\(A\\), \\(B\\) or \\(C\\) alone fix only \\(A\\), \\(B\\) or \\(\\{C, A\\}\\), all prime), so \\(R\\) is in 2NF.", "3NF fails: \\(D \\to E\\) has a left side that is not a superkey and a non-prime right side. So \\(R\\) is in 2NF but not in 3NF (hence not in BCNF)."],
trap="Counting only AB as a key; C with B is also a key because C determines A.", short="List all keys, mark prime attributes, then test partial and transitive dependencies.", kind="conceptual")

# 47 chained addressing modes (NAT)
K.add(47, r"A processor supports register-indexed addressing with scaling, memory-indirect addressing and base-displacement addressing. Memory (byte addresses, \(4\)-byte words, addresses and values in decimal) holds: \(M[4108] = 8192\), \(M[8192] = 8200\), \(M[8204] = 25\). Registers: \(R_2 = 4096\), \(R_3 = 3\). The instructions run in order: \(I_1\): \(R_1 \leftarrow M[M[R_2 + R_3 \times 4]]\) (indexed with scale \(4\), then one level of indirection); \(I_2\): \(R_4 \leftarrow M[R_1 + 4]\) (base plus displacement); \(I_3\): \(R_5 \leftarrow R_1 + R_4\). The final value of \(R_5\) is ______.",
"""M = {4108: 8192, 8192: 8200, 8204: 25}
R2 = 4096
R3 = 3
ea = R2 + R3 * 4
R1 = M[M[ea]]
R4 = M[R1 + 4]
R5 = R1 + R4
answer = R5""",
steps=["\\(I_1\\): effective address \\(= 4096 + 3 \\times 4 = «ea»\\); \\(M[«ea»] = 8192\\) is a pointer, and \\(M[8192] = 8200\\), so \\(R_1 = 8200\\).", "\\(I_2\\): address \\(R_1 + 4 = 8204\\), and \\(M[8204] = 25\\), so \\(R_4 = 25\\).", "\\(I_3\\): \\(R_5 = 8200 + 25 = «answer»\\)."],
trap="Stopping after the first memory access (taking 8192 as R1) instead of following the pointer once more.", short="Evaluate each addressing mode in turn: address arithmetic first, memory reads after.", kind="trace")

# 50 struct array with pointer casts (MCQ, key A)
K.add(50, r"Consider the C fragment below on a machine where \(\texttt{int}\) occupies \(4\) bytes and a structure of two ints has no padding. ```c struct P { int a; int b; }; struct P arr[3] = {{1, 2}, {3, 4}, {5, 6}}; struct P *p = arr; p += 2; int r = (p - 1)->b + *(int *)p + ((int *)arr)[3]; ``` The value of \(r\) is",
"""flat = [1, 2, 3, 4, 5, 6]
pidx = 2
t1 = flat[(pidx - 1) * 2 + 1]
t2 = flat[pidx * 2]
t3 = flat[3]
val = t1 + t2 + t3
wrong = [11, 9, 17]""",
steps=["After \\(p \\mathrel{+}= 2\\) the pointer addresses \\(\\texttt{arr[2]}\\); pointer arithmetic moves in units of the whole structure (\\(8\\) bytes).", "\\((p - 1)\\text{->}b = \\texttt{arr[1].b} = «t1»\\); \\(*(\\texttt{int}*)p\\) is the first member of \\(\\texttt{arr[2]}\\), that is \\(«t2»\\); \\(((\\texttt{int}*)\\texttt{arr})[3]\\) treats the array as ints, so it is the fourth int, \\(«t3»\\).", "\\(r = «t1» + «t2» + «t3» = «val»\\)."],
trap="Scaling the pointer by 4 bytes instead of by the structure size, or indexing the int view as if it were the structure array.", short="Pointer arithmetic scales by the pointee type; a cast changes the unit.", kind="trace")

K.save("p6")
