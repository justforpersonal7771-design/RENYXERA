"""Forge b010 part 7: General Aptitude slots (numeric and logic, all computed). Run: python scripts/forge/author_b010_p7.py"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import author_kit as K
K.use("b010")

# 0 counting claims (MSQ)
K.add(0, r"A club secretary makes four counting claims. Which of the following claims is/are correct?",
"""circ = sum(1 for p in itertools.permutations(range(6)) if p[0] == 0)
strings = sum(1 for p in itertools.product('ABCD', repeat=3) if len(set(p)) == 3)
comm = sum(1 for c in itertools.combinations(range(7), 3) if not (0 in c and 1 in c))
sols = sum(1 for x in range(11) for y in range(11) for z in range(11) if x + y + z == 10)
truth = [circ == 120, strings == 24, comm == 28, sols == 66]
true_comm = comm""",
stmts=[r"Six people can be seated around a round table (rotations count as the same arrangement) in \(120\) ways.", r"The number of \(3\)-letter strings over \(\{A, B, C, D\}\) in which no letter is repeated is \(24\).", r"From \(7\) people a committee of \(3\) is formed so that two particular people are never both on it; this can be done in \(28\) ways.", r"The number of non-negative integer solutions of \(x + y + z = 10\) is \(66\)."],
steps=["Round table: fix one person and arrange the other five: \\(5! = 120\\), so the first claim is correct.", "No repeated letter: \\(4 \\times 3 \\times 2 = 24\\), correct.", "Committees: \\(\\binom{7}{3} = 35\\) minus the \\(5\\) that contain both particular people gives «true_comm», not \\(28\\): the third claim is wrong.", "Stars and bars: \\(\\binom{12}{2} = 66\\), correct."],
trap="Subtracting the number of people (7) instead of the number of committees that contain the forbidden pair (5).", short="Check each count by the standard formula: circular (n-1)!, product rule, complement, stars and bars.", kind="msq_discriminator")

# 10 water level rise (MCQ, key C)
K.add(10, r"A cylindrical vessel of radius \(5\) cm holds water to a depth of \(12\) cm. A solid iron sphere of radius \(3\) cm is dropped in and sinks completely, with no water spilling. By how many centimetres does the water level rise, correct to two decimal places?",
"""vs = 4 / 3 * math.pi * 27
area = math.pi * 25
val = round(vs / area, 2)
wrong = [1.2, 1.8, 2.16]""",
steps=["The water level rises until the extra volume equals the volume of the sphere: \\(\\tfrac43 \\pi \\times 3^3 = 36\\pi\\) cm\\(^3\\).", "Rise \\(= 36\\pi / (\\pi \\times 5^2) = 36/25 = «val»\\) cm."],
trap="Using the area of the sphere's cross-section or adding the sphere's diameter to the depth.", short="Rise = sphere volume / base area of the vessel.", kind="application")

# 14 combined standard deviation (MCQ, key B)
K.add(14, r"A first group of \(10\) students scored a mean of \(12\) with a standard deviation of \(2\); a second group of \(15\) students scored a mean of \(18\) with a standard deviation of \(3\) (both are population standard deviations). The population standard deviation of all \(25\) scores together, correct to two decimal places, is",
"""n1, m1, s1 = 10, 12.0, 2.0
n2, m2, s2 = 15, 18.0, 3.0
N = n1 + n2
M = (n1 * m1 + n2 * m2) / N
var = (n1 * (s1 ** 2 + (m1 - M) ** 2) + n2 * (s2 ** 2 + (m2 - M) ** 2)) / N
val = round(var ** 0.5, 2)
wrong = [2.6, 4.5, 3.0]
gm = M
v2 = round(var, 2)""",
steps=["The combined mean is \\((10 \\times 12 + 15 \\times 18)/25 = «gm»\\).", "Combined variance \\(= \\dfrac{10(2^2 + 3.6^2) + 15(3^2 + 2.4^2)}{25} = «v2»\\): the spread of the group means around the grand mean adds to the within-group variances.", "Standard deviation \\(= \\sqrt{«v2»} \\approx «val»\\)."],
trap="Averaging the two standard deviations (about 2.6), which ignores the gap between the group means.", short="Total variance = average within-group variance + variance of the group means.", kind="multi_concept")

# 15 liars puzzle (NAT)
K.add(15, r"Seven islanders are numbered \(1\) to \(7\). Knights always speak truly and knaves always speak falsely, and every islander is one or the other. Islander \(i\) declares: ``Among the seven of us, precisely \(i\) are knaves.'' The number of knaves among the seven islanders is ______.",
"""sols = []
for mask in range(128):
    truth = [(mask >> k) & 1 for k in range(7)]
    liars = 7 - sum(truth)
    ok = True
    for i in range(7):
        statement = (liars == i + 1)
        if (truth[i] == 1) != statement:
            ok = False
            break
    if ok:
        sols.append(liars)
answer = sols[0]
nsol = len(sols)""",
steps=["If the number of knaves is \\(L\\), then exactly one declaration (the one by islander \\(L\\)) is true and the other six are false, so there is exactly one knight and \\(L = 7 - 1 = 6\\).", "Check: islander \\(6\\) says precisely \\(6\\) are knaves, which is true, and the other six speak falsely: consistent. A search over all \\(128\\) assignments finds «nsol» consistent assignment, with «answer» knaves."],
trap="Trying to make several statements true together; only one statement can match the actual number of liars.", short="Exactly one of the seven statements can be true, so exactly one truth-teller.", kind="multi_concept")

# 21 numerical claims (MSQ)
K.add(21, r"A quiz-setter prints four statements about whole numbers and asks the class to mark all of the ones that are right.",
"""c1 = sum(1 for n in range(100, 1000) if n % 4 == 0 and n % 6 == 0)
c2 = sum(n for n in range(10, 100) if n % 7 == 0)
c3 = sum(1 for n in range(10, 32) if 100 <= n * n <= 1000)
def isp(n):
    return n > 1 and all(n % d for d in range(2, int(n ** 0.5) + 1))
c4 = sum(1 for n in range(50) if isp(n))
truth = [c1 == 75, c2 == 728, c3 == 21, c4 == 15]
true3 = c3""",
stmts=[r"There are exactly \(75\) three-digit numbers divisible by both \(4\) and \(6\).", r"The sum of all two-digit multiples of \(7\) is \(728\).", r"There are exactly \(21\) perfect squares between \(100\) and \(1000\) inclusive.", r"There are exactly \(15\) prime numbers less than \(50\)."],
steps=["Divisible by \\(4\\) and \\(6\\) means divisible by \\(12\\): \\(\\lfloor 999/12 \\rfloor - \\lfloor 99/12 \\rfloor = 83 - 8 = 75\\), correct.", "Two-digit multiples of \\(7\\) are \\(7 \\times 2, \\dots, 7 \\times 14\\); their sum is \\(7 \\times 104 = 728\\), correct.", "Squares from \\(10^2 = 100\\) to \\(31^2 = 961\\) number \\(«true3»\\), not \\(21\\): wrong.", "The primes below \\(50\\) are \\(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47\\): \\(15\\), correct."],
trap="Forgetting that both end points are included when counting squares from 10^2 to 31^2.", short="Count with floor differences and check the endpoints.", kind="msq_discriminator")

# 28 data interpretation: revenue growth (MCQ, key C)
K.add(28, r"A company sells three products. The table gives, for two years, the units sold (in thousands) and the price per unit (in rupees). | Product | Units 2022 | Price 2022 | Units 2024 | Price 2024 | |---|---|---|---|---| | A | 40 | 50 | 55 | 60 | | B | 30 | 80 | 25 | 90 | | C | 20 | 120 | 35 | 110 |. The percentage increase in total revenue from 2022 to 2024, correct to one decimal place, is",
"""r22 = 40 * 50 + 30 * 80 + 20 * 120
r24 = 55 * 60 + 25 * 90 + 35 * 110
val = round((r24 - r22) / r22 * 100, 1)
wrong = [37.5, 40.0, 34.5]""",
steps=["Revenue (in thousands of rupees) in 2022: \\(40 \\times 50 + 30 \\times 80 + 20 \\times 120 = «r22»\\).", "Revenue in 2024: \\(55 \\times 60 + 25 \\times 90 + 35 \\times 110 = «r24»\\).", "Increase \\(= («r24» - «r22»)/«r22» \\times 100 \\approx «val»\\%\\)."],
trap="Adding units and prices separately, or comparing only the price columns.", short="Revenue = sum of units x price for each year, then the percentage change.", kind="data_interpretation")

# 29 exponent relation (MCQ, key D)
K.add(29, r"Let \(a, b, c\) be non-zero real numbers with \(3^{a} = 5^{b} = 15^{c}\). Which one of the following relations is TRUE?",
"""k = 1.7
a = math.log(k) / math.log(3)
b = math.log(k) / math.log(5)
c = math.log(k) / math.log(15)
truth = [abs(a + b - c) < 1e-9, abs(a * b - c * c) < 1e-9 and abs(a + b - c) < 1e-9, abs(1 / a + 1 / b - 1 / c) < 1e-9, abs(a + b - 2 * c) < 1e-9 and abs(a - b) < 1e-9]""",
stmts=[r"\(a + b = c\)", r"\(ab = c^{2}\) and \(a + b = c\)", r"\(1/a + 1/b = 1/c\)", r"\(a + b = 2c\) and \(a = b\)"],
steps=["Let the common value be \\(k\\). Then \\(a = \\log_3 k\\)-type: \\(a \\ln 3 = b \\ln 5 = c \\ln 15 = \\ln k\\), so \\(1/a = \\ln 3 / \\ln k\\), \\(1/b = \\ln 5 / \\ln k\\), \\(1/c = \\ln 15 / \\ln k\\).", "Since \\(\\ln 15 = \\ln 3 + \\ln 5\\), we get \\(1/c = 1/a + 1/b\\): the third relation holds, and the other three do not (a numeric check with \\(k = 1.7\\) confirms)."],
trap="Adding the exponents themselves instead of their reciprocals.", short="Take logarithms: each reciprocal is ln(base)/ln(k), and ln 15 = ln 3 + ln 5.", kind="conceptual")

# 43 water jug puzzle (MCQ, key A)
K.add(43, r"Two jugs hold exactly \(3\) litres and \(5\) litres and have no markings. There is an unlimited supply of water. One operation is: fill a jug completely, empty a jug completely, or pour from one jug into the other until the source is empty or the target is full. The least number of operations needed to leave exactly \(4\) litres in one of the jugs is",
"""from_state = (0, 0)
dist = {from_state: 0}
queue = [from_state]
caps = (3, 5)
while queue:
    s = queue.pop(0)
    nxt = []
    for i in range(2):
        t = list(s)
        t[i] = caps[i]
        nxt.append(tuple(t))
        t = list(s)
        t[i] = 0
        nxt.append(tuple(t))
        j = 1 - i
        amt = min(s[i], caps[j] - s[j])
        t = list(s)
        t[i] -= amt
        t[j] += amt
        nxt.append(tuple(t))
    for n in nxt:
        if n not in dist:
            dist[n] = dist[s] + 1
            queue.append(n)
best = min(d for st, d in dist.items() if 4 in st)
val = best
wrong = [4, 5, 7]""",
steps=["Describe a state as the pair of contents \\((x, y)\\) and search level by level over the three kinds of moves.", "One shortest sequence: fill \\(5\\) \\(\\to (0,5)\\); pour into \\(3\\) \\(\\to (3,2)\\); empty \\(3\\) \\(\\to (0,2)\\); pour \\(\\to (2,0)\\); fill \\(5\\) \\(\\to (2,5)\\); pour into \\(3\\) \\(\\to (3,4)\\).", "That is «val» operations, and the breadth-first search shows no shorter sequence exists."],
trap="Starting by filling the 3-litre jug: that route needs more operations, and a greedy choice can miss the shortest one.", short="Breadth-first search over states (x, y).", kind="multi_concept")

K.save("p7")
