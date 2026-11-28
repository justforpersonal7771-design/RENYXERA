import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A1 "Asymptotics and recurrences" (28 Nov 2026), written to the textbook standard. The Data Structures chapter D1 is the gentle on-ramp;
 * this chapter goes deeper: the notation with its constants, the growth ladder, reading loops, writing and solving recurrences (recursion tree, substitution,
 * Master theorem, unequal splits, change of variable). Real GATE questions (texts from public/data/questions.json), each re-solved here:
 * 2026 AN Q24 (order of four functions), 2018 FN Q42 (double log loop, answer 5), 2017 AN Q61 (harmonic loop, Theta(n log n)), 2018 FN Q55 (10230 prints),
 * 2024 FN Q57 (sqrt recurrence, Theta(n log log n)), 2021 FN Q50 (unequal split, Theta(n)), 2025 FN Q20 (T(n-1) with n 2^n), 2026 FN Q17 (two coupled recurrences, Theta(n^2)),
 * 2021 FN Q61 (10^n, n^(log n), n^(sqrt n)), 2017 AN Q50 (T(sqrt n) with +1), 2020 FN Q34 (T(n^(1/a)) + 1), 2023 FN Q29 and Q54, 2022 FN Q11, 2021 AN Q55.
 * Programs compiled and run with gcc: 2046 (halving loop), 5 (double log), 22 (harmonic loop at n = 8), 10230 (Count).
 */
export const chapterA1: Topic = {
  id: "cs.algo.v2.asym1",
  title: "Asymptotics and recurrences",
  no: "A1",
  book: [
    { t: "p", text: "Every algorithm question in GATE eventually asks the same thing in different clothes: **how much work does this do when the input gets large?** A loop, a recursion, a sorting routine and a graph search are all answered by the same three tools: counting the work, naming its growth with a notation, and, when the algorithm calls itself, solving a recurrence. This chapter builds those three tools carefully, because the next ten chapters use them on every page." },
    { t: "p", text: "The chapter is about one fifth of the marks the Algorithms subject carries in the question bank, and it is the fastest early win, because almost no question here needs more than a pencil and the five facts in the boxes. Read the boxes first, then the worked questions, which are real GATE questions solved line by line." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["count the basic steps of a loop nest and name the growth of the count;", "use O, Ω, Θ, o and ω correctly and decide which of them is true for a pair of functions;", "put any set of the usual functions (logarithms, powers, n log n, factorials, exponentials) in order of growth;", "write the recurrence of a recursive routine and solve it by the recursion tree, by substitution or by the Master theorem;", "handle the tricky shapes the paper loves: unequal splits, T(n − 1), T(√n) and double logarithms."] },

    { t: "h2", text: "Counting work, not seconds" },
    { t: "p", text: "A running time in seconds depends on the machine, the language and the weather. An algorithm's cost is therefore counted in **basic steps**: a comparison, an addition, an assignment, each taken as one unit. What matters is how the count grows with the **input size n**, the number of elements, the number of vertices, the number of bits, whichever the problem names as its size." },
    { t: "p", text: "Two inputs of the same size can cost different amounts. Searching for a key in an array costs one step if the key is first and n steps if it is last. We therefore name the case: the **worst case** (the largest cost over all inputs of size n), the **best case** (the smallest) and the **average case** (the mean over some stated distribution). GATE almost always asks for the worst case unless it says otherwise; the phrase is part of the question, so read it." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    long count = 0;
    for (int n = 1024; n > 1; n = n / 2)        /* n takes the values 1024, 512, ..., 2 */
        for (int i = 1; i <= n; i++)
            count++;                              /* the basic step */
    printf("%ld\\n", count);
    return 0;
}`, out: "2046", file: "halving_work.c" },
    { t: "p", text: "The outer loop runs with n = 1024, 512, …, 2, and the inner loop does n steps each time, so the count is 1024 + 512 + … + 2 = 2046. That is a geometric series: each term is half the one before, so the whole sum is less than twice its largest term. The loop is therefore Θ(n), not Θ(n log n), although it has a loop that runs log n times. Remember this picture: **the work shrinks as fast as the loop count grows**." },
    { t: "callout", kind: "key", text: "Count the basic step, not the lines. A loop that runs k times around a body of cost c costs k · c. A nest multiplies, unless the inner bound depends on the outer variable; then you add the inner costs." },

    { t: "h2", text: "The growth notation: O, Ω, Θ, o and ω" },
    { t: "p", text: "Exact counts such as 3n² + 7n + 2 hide what we care about. For large n the 3n² term dominates, the constant 3 depends on the machine, and the rest is noise. Asymptotic notation keeps only the shape. Write f and g for positive functions of n." },
    { t: "table", head: ["Notation", "Reads as", "Formal meaning (for all large n)", "Think"], rows: [
      ["f = O(g)", "f is at most g", "f(n) ≤ c · g(n) for some constant c > 0", "f ≤ g"],
      ["f = Ω(g)", "f is at least g", "f(n) ≥ c · g(n) for some constant c > 0", "f ≥ g"],
      ["f = Θ(g)", "f is the same order as g", "both O(g) and Ω(g)", "f = g"],
      ["f = o(g)", "f is strictly smaller", "f(n) / g(n) → 0", "f < g"],
      ["f = ω(g)", "f is strictly larger", "f(n) / g(n) → ∞", "f > g"],
    ], caption: "Five notations. The last two are strict: o and ω never hold when the two functions are of the same order." },
    { t: "p", text: "The easiest honest test is the **limit of the ratio** f(n) / g(n). If it tends to 0, then f = o(g) and so also O(g). If it tends to a positive constant, f = Θ(g). If it tends to infinity, f = ω(g). Take f(n) = n and g(n) = n²: the ratio is 1/n, which tends to 0, so n = o(n²), n = O(n²), and n is **not** Ω(n²) and not Θ(n²). That is exactly the GATE 2023 question, and the answers are the two statements A and C." },
    { t: "p", text: "Two beginner mistakes are worth killing now. First, O is an **upper** bound only: saying the running time is O(n²) is true of an algorithm that takes n steps, because n steps is at most n². It is not wrong, merely weak. Second, O, Θ and Ω describe functions, not cases: the worst case, best case and average case each have their own function, and each can be given its own O, Ω and Θ. GATE 2024 asks about an array-sorted check that makes one pass; its worst case is Θ(N), so it is both O(N) and Ω(N)." },
    { t: "ex", id: "a1-e1" },
    { t: "callout", kind: "trap", title: "Trap: Θ is not a synonym for 'tight enough'", text: "A function can be O(g) without being Θ(g). To claim Θ you need the matching lower bound as well. 'f is O(n²)' and 'f is Ω(n²)' together give Θ(n²); neither alone does." },

    { t: "h2", text: "The growth ladder" },
    { t: "p", text: "Almost every comparison in the paper is between functions from one short ladder. Memorise the ladder, from slowest to fastest: a constant; then log log n; then log n; then powers of log n; then n^(1/3) and √n (any power below 1); then n; then n log n; then n², n³ and every fixed power; then 2ⁿ; then n!; then nⁿ. Each rung beats every rung below it eventually, however large the constants on the lower rungs." },
    { t: "fig", id: "a1-f1" },
    { t: "p", text: "Look at the table in the figure. At n = 64, log n is 6 and n is 64, but 2ⁿ already exceeds 10¹⁹. An exponential does not merely grow faster than a polynomial; it leaves it behind permanently. That is why an algorithm of cost 2ⁿ is hopeless beyond n = 50 and one of cost n² is usable for n = 10⁵." },
    { t: "p", text: "Three facts settle most of the awkward items. **log(n!) = Θ(n log n)**: the product n! has n factors, half of them at least n/2, so log(n!) ≥ (n/2) log(n/2), and trivially log(n!) ≤ n log n. **2^(log₂ n) = n** exactly, because raising 2 to a base-2 logarithm undoes it. And **nᵏ for any fixed k is below 2ⁿ, but n^(log n) is above every fixed power and below 2ⁿ**." },
    { t: "p", text: "To compare two functions that are not obviously ordered, **take logarithms of both** and compare the logs. If log f is smaller by more than a constant factor, then f is smaller. For f = n^(log n) the log is (log n)², for g = n^(√n) the log is √n · log n, and for h = 10ⁿ the log is n log 10. Now (log n)² < √n · log n < n · log 10, so the order is f, g, h. This is GATE 2021 and the method works every time." },
    { t: "ex", id: "a1-e2" },
    { t: "callout", kind: "key", text: "To rank messy functions: (1) simplify (2^log n = n, log n! = n log n), (2) place each on the ladder, (3) for ties on the same rung, take logs of both." },

    { t: "h2", text: "Reading a loop" },
    { t: "p", text: "A single loop is easy; a nest needs one question: **how many times does the inner body run, in total?** If the inner bound is fixed, multiply. If the inner bound depends on the outer variable, write the total as a sum over the outer variable and evaluate the sum with the standard series: 1 + 2 + … + n = n(n + 1)/2 = Θ(n²); 1 + 2 + 4 + … + n = Θ(n) (a geometric series is dominated by its last term); and 1 + 1/2 + 1/3 + … + 1/n = Θ(log n), the **harmonic series**." },
    { t: "p", text: "Loops that change the variable by multiplication or division run **logarithmically many** times. A loop that sets i = i / 2 starting from n runs about log₂ n times; one that sets i = i * 2 up to n does the same. A loop that sets j = j + i runs about n/i times when j starts at 1 and stops at n. The last shape is the one GATE 2017 asked, and it hides the harmonic series." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n = 8, count = 0;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j < n; j += i)
            count++;
    printf("%d\\n", count);
    return 0;
}`, out: "22", file: "harmonic_loop.c" },
    { t: "p", text: "For a given i the inner loop runs about n/i times. The total is therefore n/1 + n/2 + … + n/n = n(1 + 1/2 + … + 1/n) = n · Hₙ = Θ(n log n). The program shows the count 22 for n = 8; the formula gives 8 · H₈ ≈ 21.7, close, and the gap closes in relative terms as n grows. The answer to the GATE question is Θ(n log n), not Θ(n²) as the two nested loops suggest." },
    { t: "ex", id: "a1-e3" },
    { t: "p", text: "A loop that halves a variable **twice** is one more trap. In GATE 2018 the first loop halves i from n down to 1 and counts the halvings in j, so j = log₂ n; the second loop halves j down to 1 and counts in sum, so sum = log₂ j = log₂ log₂ n. For n = 2⁴⁰ this is: j = 40, then 40 → 20 → 10 → 5 → 2 → 1, which is five steps. The returned value is 5." },
    { t: "ex", id: "a1-e4" },
    { t: "trap", i: 0 },

    { t: "h2", text: "From a recursive routine to a recurrence" },
    { t: "p", text: "A recursive algorithm calls itself on smaller inputs, so its cost T(n) is described by itself: T(n) = (cost of the calls on smaller inputs) + (cost of the work done in this call). That equation, together with the cost of the smallest input, is a **recurrence**. Three shapes cover nearly every question." },
    { t: "ul", items: ["**Shrink by one:** T(n) = T(n − 1) + f(n), as in a loop written recursively;", "**Divide:** T(n) = a · T(n / b) + f(n): a calls, each on a piece of size n / b, plus f(n) to split and combine (merge sort has a = 2, b = 2, f = n);", "**Square root:** T(n) = a · T(√n) + f(n), which arises in some algorithms on numbers and in the paper's trickier questions."] },
    { t: "p", text: "Writing the recurrence correctly is half the work. Count **calls** (the multiplier a), **size of each call** (the divisor b or the subtraction) and **work outside the calls** (the function f). Binary search calls itself once, on half the array, and does one comparison: T(n) = T(n / 2) + 1, so it costs Θ(log n). A recursive Fibonacci calls itself twice on sizes n − 1 and n − 2 with constant work: T(n) = T(n − 1) + T(n − 2) + 1, which grows like the Fibonacci numbers themselves, exponentially." },
    { t: "p", text: "Look at what 'Θ(n)' means in GATE 2026's question on which recurrences give a linear algorithm. T(n) = T(n − 1) + 1 unrolls to n ones: Θ(n). T(n) = 2T(n/2) + 1 has n leaves each costing 1 and n − 1 internal nodes costing 1: Θ(n). T(n) = 2T(n/2) + n costs n at each of log n levels: Θ(n log n). T(n) = T(n − 1) + n sums 1 + 2 + … + n: Θ(n²). The answers are the first two." },
    { t: "ex", id: "a1-e5" },

    { t: "h2", text: "Solving recurrences: the recursion tree" },
    { t: "p", text: "The **recursion tree** turns the recurrence into a picture: each node is one call, labelled with the work it does outside its own calls. The total cost is the sum over all nodes. You add level by level, then add the levels. For T(n) = 2T(n/2) + n, the root costs n, its two children cost n/2 each (together n), the four grandchildren n/4 each (together n), and so on for log₂ n levels. So each level costs n and there are log n levels: Θ(n log n)." },
    { t: "fig", id: "a1-f2" },
    { t: "p", text: "The tree tells you which of two forces wins. If the work per level **grows** as you go down (many small calls with more total work), the **leaves** dominate and the answer is the number of leaves, n^(log_b a). If the work per level **shrinks**, the **root** dominates and the answer is f(n). If the work per level is **the same**, every level counts and you multiply by the number of levels. This single idea is the Master theorem in disguise, and it also handles the cases the Master theorem refuses." },
    { t: "p", text: "Take T(n) = T(n/2) + T(2n/5) + 7n, from GATE 2021. The two children have sizes n/2 and 2n/5, which sum to 0.9n, **less than n**. So the total work per level is at most 7n · 0.9ᵏ at depth k: a decreasing geometric series dominated by the root, 7n. The answer is Θ(n). The floors and ceilings in the printed recurrence do not matter, and neither does the base case, since the sizes shrink to the base geometrically." },
    { t: "fig", id: "a1-f3" },
    { t: "ex", id: "a1-e6" },
    { t: "callout", kind: "shortcut", text: "Unequal split T(n) = T(αn) + T(βn) + cn: if α + β < 1 the answer is Θ(n); if α + β = 1 it is Θ(n log n); if α + β > 1 the tree has more than n worth of work per level and the answer is polynomially larger than n. Quicksort's average case is the α + β = 1 case." },

    { t: "h2", text: "The Master theorem" },
    { t: "p", text: "For recurrences of the divide shape T(n) = a · T(n/b) + f(n), with constants a ≥ 1 and b > 1, compare f(n) with the **critical function** n^(log_b a), the number of leaves of the tree. There are three cases." },
    { t: "table", head: ["Case", "Condition", "Result", "Who wins"], rows: [
      ["1", "f(n) = O(n^(log_b a − ε)) for some ε > 0", "Θ(n^(log_b a))", "leaves"],
      ["2", "f(n) = Θ(n^(log_b a) · log^k n), k ≥ 0", "Θ(n^(log_b a) · log^(k+1) n)", "every level"],
      ["3", "f(n) = Ω(n^(log_b a + ε)) and a·f(n/b) ≤ c·f(n) for some c < 1", "Θ(f(n))", "root"],
    ], caption: "Master theorem. In case 2 with k = 0 the result is Θ(n^(log_b a) · log n)." },
    { t: "p", text: "Always start by computing **log_b a**. For T(n) = 4T(n/2) + n the critical function is n^(log₂ 4) = n², which is polynomially larger than f(n) = n: case 1, Θ(n²). For T(n) = 2T(n/2) + n it is n¹ = f: case 2, Θ(n log n). For T(n) = 2T(n/2) + n² the critical function is n and f = n² beats it by a polynomial factor: case 3, Θ(n²), since 2 · (n/2)² = n²/2 ≤ ½ n². For T(n) = 8T(n/2) + n³, f equals n³: case 2, Θ(n³ log n)." },
    { t: "p", text: "The theorem has **gaps**, and GATE tests the gaps. If f(n) is only logarithmically smaller or larger than the critical function, no case applies. For T(n) = 2T(n/2) + n/log n, f is smaller than n but not by a polynomial factor, so case 1 fails; the recursion tree gives n · (1/log n + 1/(log n − 1) + … ) = Θ(n log log n). For T(n) = 2T(n/2) + n log n, the extended case 2 with k = 1 gives Θ(n log² n). In GATE 2021 the option 'if f(n) = n log n then T(n) = Θ(n log n)' is therefore false, and so are the option claiming Θ(log n) for f = n/log n and the option claiming that f = Θ(n^(log_b a)) gives Θ(n^(log_b a)): that last one is case 2 and has an extra log. Only the case 1 option is correct." },
    { t: "ex", id: "a1-e7" },
    { t: "p", text: "The theorem also applies to **coupled** recurrences if you solve them in order. GATE 2026 gave T₂(n) = 5T₂(n/4) + Θ(log n) and T₁(n) = 4T₁(n/2) + T₂(n). The first is case 1 with critical function n^(log₄ 5) ≈ n^1.16, so T₂ = Θ(n^(log₄ 5)). Feed that into the second: the critical function is n², and f = T₂ = n^1.16 is polynomially smaller than n², so case 1 again: T₁ = Θ(n²)." },
    { t: "ex", id: "a1-e8" },
    { t: "callout", kind: "gate", text: "Before using the Master theorem check three things: the recurrence really is a · T(n/b) + f(n) with constant a and b (not T(n − 1)); f is polynomially larger or smaller than n^(log_b a), not just by a log; and in case 3 the regularity condition holds." },

    { t: "h2", text: "Subtraction and substitution" },
    { t: "p", text: "Recurrences that **subtract** (T(n − 1), T(n − 2)) are outside the Master theorem. Unroll them. T(n) = T(n − 1) + n gives n + (n − 1) + … + 1 = Θ(n²). T(n) = 2T(n − 1) + 1 doubles at each step: 2ⁿ − 1 steps in total, as in the towers of Hanoi, Θ(2ⁿ). T(n) = T(n − 1) + T(n − 2) is Fibonacci, exponential with base the golden ratio." },
    { t: "p", text: "When the extra work is itself exponential, **divide through by the exponential**. In GATE 2025 the recurrence is T(n) = 2T(n − 1) + n·2ⁿ with T(0) = 1. Put T(n) = 2ⁿ · U(n). Then 2ⁿU(n) = 2 · 2ⁿ⁻¹ U(n − 1) + n · 2ⁿ, and dividing by 2ⁿ gives U(n) = U(n − 1) + n, so U(n) = Θ(n²) and T(n) = Θ(n² 2ⁿ). The tempting answers Θ(n 2ⁿ) and Θ(4ⁿ) both fail: the first forgets that n is added n times, the second is the wrong exponential base." },
    { t: "ex", id: "a1-e9" },
    { t: "p", text: "**Substitution** (guess and verify by induction) is the formal tool. Guess T(n) ≤ c · g(n), substitute into the recurrence, and see whether the inequality closes. It is slow in the exam, so use it only to confirm a guess from the tree. The common slip is guessing a bound that is **correct in order but too tight in form**: T(n) = 2T(n/2) + n is Θ(n log n), but the induction hypothesis T(n) ≤ cn log n needs a lower-order term to close, so the proof must prove T(n) ≤ c(n log n) − dn." },

    { t: "h2", text: "Square roots and double logarithms" },
    { t: "p", text: "A recurrence that shrinks the input to its square root, T(n) = a·T(√n) + f(n), is solved by a **change of variable**: put n = 2ᵐ, so m = log₂ n and √n = 2^(m/2). Define S(m) = T(2ᵐ). The recurrence becomes S(m) = a·S(m/2) + f(2ᵐ), an ordinary divide recurrence in m, which the Master theorem or the tree solves. Then convert back with m = log n." },
    { t: "p", text: "GATE 2017 gave T(n) = 2T(√n) + 1. With n = 2ᵐ this is S(m) = 2S(m/2) + 1, which is case 1 (critical function m, f = 1): S(m) = Θ(m) = Θ(log n). The tempting answer Θ(log log n) is the answer for T(n) = T(√n) + 1, which has **one** call; with two calls the leaves multiply and the bound becomes logarithmic." },
    { t: "p", text: "GATE 2024 gave T(n) = √n · T(√n) + n. Write T(n) = n · U(n). Then n·U(n) = √n · √n · U(√n) + n, that is U(n) = U(√n) + 1, which is Θ(log log n), since the exponent halves each time. So T(n) = Θ(n log log n). Dividing by n turned a recurrence with a multiplier into the simplest square-root recurrence." },
    { t: "ex", id: "a1-e10" },
    { t: "p", text: "The same idea gives the general rule asked in GATE 2020: for T(n) = T(n^(1/a)) + 1 with T(b) = 1, each step replaces n by its a-th root, so after k steps the size is n^(1/aᵏ). The recursion stops when that equals b, that is when aᵏ = log_b n, so k = log_a(log_b n). The number of steps is Θ(log_a log_b n)." },
    { t: "trap", i: 1 },
    { t: "callout", kind: "key", text: "One call on √n, constant work: Θ(log log n). Two calls on √n, constant work: Θ(log n). Divide by the multiplier first if the recurrence has √n · T(√n)." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Count basic steps against the input size; GATE usually means the worst case.", "O is at most, Ω at least, Θ both; o and ω are strict; the limit of f/g decides.", "Ladder: constant, log log n, log n, powers of log, n^(1/k), n, n log n, n², 2ⁿ, n!; log(n!) = Θ(n log n) and 2^(log n) = n.", "Nested loops: sum the inner count over the outer variable (harmonic, geometric and arithmetic series).", "Divide recurrences: compare f(n) with n^(log_b a); watch the log-gaps. Unequal splits: add the fractions.", "Subtraction recurrences: unroll, or divide out an exponential. Square-root recurrences: n = 2ᵐ, or divide by the multiplier."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a1-f1", caption: "Growth of the common functions: values for n = 8, 16, 32, 64. The exponential column leaves every other column behind.", alt: "A table of log n, n, n log n, n squared and 2 to the n for four sizes of n.", fig: { kind: "trace", title: "Values of the common functions", cols: ["n", "log₂ n", "n log₂ n", "n²", "2ⁿ"], rows: [
      { cells: [8, 3, 24, 64, 256] },
      { cells: [16, 4, 64, 256, 65536] },
      { cells: [32, 5, 160, 1024, "4.3 × 10⁹"] },
      { cells: [64, 6, 384, 4096, "1.8 × 10¹⁹"], changed: [4], tone: "bad" },
    ] } },
    { type: "figure", id: "a1-f2", caption: "The recursion tree of T(n) = 2T(n/2) + n. Every level costs n, and there are log₂ n levels.", alt: "A binary tree whose root costs n, the next level two nodes of n over 2, then four nodes of n over 4.", fig: { kind: "calltree", title: "T(n) = 2T(n/2) + n: each level adds up to n", root: { label: "n", ret: "level cost n", kids: [
      { label: "n/2", kids: [{ label: "n/4" }, { label: "n/4" }] },
      { label: "n/2", kids: [{ label: "n/4" }, { label: "n/4" }] },
    ] } } },
    { type: "figure", id: "a1-f3", caption: "The tree of T(n) = T(n/2) + T(2n/5) + 7n. The two children carry 0.9 of the parent's size, so each level costs less than the one above.", alt: "A tree whose root n has two children n over 2 and 2n over 5, each with two further children.", fig: { kind: "calltree", title: "Sizes shrink: n, then 0.9n, then 0.81n", root: { label: "n", ret: "7n", kids: [
      { label: "n/2", ret: "3.5n", kids: [{ label: "n/4" }, { label: "n/5" }] },
      { label: "2n/5", ret: "2.8n", kids: [{ label: "n/5" }, { label: "4n/25" }] },
    ] } } },

    { type: "example", id: "a1-e1", level: "gate", title: "GATE CS 2023 (forenoon), Q29 · 1 mark · MSQ: f(n) = n against g(n) = n²", file: "gate2023_fn_q29.txt", given: `f(n) = n and g(n) = n². Which statements are true?
A) f ∈ O(g)   B) f ∈ Ω(g)   C) f ∈ o(g)   D) f ∈ Θ(g)`, find: "The true statements.", steps: [
      { say: "The ratio f/g = n / n² = 1/n, which tends to 0 as n grows.", result: "ratio → 0" },
      { say: "A ratio tending to 0 gives f = o(g), and therefore also f = O(g).", result: "A and C" },
      { say: "f = Ω(g) would need f ≥ c·n² for large n, but n < c·n² once n > 1/c. And Θ needs both bounds.", result: "B and D are false" },
    ], answer: "A, C", check: "o implies O, and o excludes Θ and Ω." },
    { type: "example", id: "a1-e2", level: "gate", title: "GATE CS 2021 (forenoon), Q61 · 1 mark · order f₁ = 10ⁿ, f₂ = n^(log n), f₃ = n^(√n)", file: "gate2021_fn_q61.txt", given: `f1 = 10^n, f2 = n^(log n), f3 = n^(sqrt n).
Which option arranges them in increasing order of asymptotic growth?
A) f3, f2, f1   B) f2, f1, f3   C) f1, f2, f3   D) f2, f3, f1`, find: "The increasing order.", steps: [
      { say: "Take the logarithm (base 2) of each: log f₁ = n·log 10 ≈ 3.32n; log f₂ = (log n)²; log f₃ = √n · log n.", result: "3.32n, (log n)², √n log n" },
      { say: "Compare the logs: (log n)² is below √n · log n (divide both by log n: log n against √n), and √n · log n is below 3.32n (divide by √n: log n against 3.32√n).", result: "f₂ < f₃ < f₁" },
    ], answer: "D", check: "At n = 2¹⁰⁰ the logs are (log n)² = 10⁴, √n · log n = 100 · 2⁵⁰ and 3.32n = 3.32 · 2¹⁰⁰: strictly increasing." },
    { type: "example", id: "a1-e3", level: "gate", title: "GATE CS 2017 (afternoon), Q61 · 2 marks · the loop j += i", file: "gate2017_an_q61.txt", given: `for (i = 1; i <= n; i++)
    for (j = 1; j < n; j += i)
        printf("%d %d", i, j);
Time complexity of fun in Θ notation?
A) Θ(n√n)   B) Θ(n²)   C) Θ(n log n)   D) Θ(n² log n)`, find: "The complexity.", steps: [
      { say: "For a fixed i the inner loop starts at 1 and steps by i up to n: about n/i iterations.", result: "n/i" },
      { say: "Total = n/1 + n/2 + … + n/n = n · (1 + 1/2 + … + 1/n) = n · Hₙ.", result: "n · Hₙ" },
      { say: "The harmonic number Hₙ is Θ(log n).", result: "Θ(n log n)" },
    ], answer: "C", check: "The program in this chapter counts 22 iterations at n = 8; 8 · H₈ ≈ 21.7." },
    { type: "example", id: "a1-e4", level: "gate", title: "GATE CS 2018 (forenoon), Q42 · 2 marks · the double halving loop", file: "gate2018_fn_q42.txt", given: `unsigned long fun(unsigned long n) {
    unsigned long i, j = 0, sum = 0;
    for (i = n; i > 1; i = i/2) j++;
    for ( ; j > 1; j = j/2) sum++;
    return sum;
}
fun(2^40) returns?   A) 4   B) 5   C) 6   D) 40`, find: "The value returned.", steps: [
      { say: "First loop: i = 2⁴⁰, 2³⁹, …, 2 stays above 1 for 40 steps, so j = 40.", result: "j = 40" },
      { say: "Second loop on j = 40: the values with j > 1 are 40, 20, 10, 5, 2. At j = 1 it stops.", result: "5 passes" },
    ], answer: "B", check: "⌊log₂ 40⌋ = 5. In general the value is ⌊log₂ log₂ n⌋." },
    { type: "example", id: "a1-e5", level: "gate", title: "GATE CS 2026 (afternoon), Q25 · 1 mark · MSQ: which recurrences are Θ(n)", file: "gate2026_an_q25.txt", given: `A) T(n) = T(n−1) + 1, T(1) = 1
B) T(n) = 2T(n/2) + 1, T(1) = 1
C) T(n) = 2T(n/2) + n, T(1) = 1
D) T(n) = T(n−1) + n, T(1) = 1
Which can correspond to an algorithm with time Θ(n)?`, find: "The linear recurrences.", steps: [
      { say: "A unrolls to n ones: Θ(n).", result: "A: Θ(n)" },
      { say: "B: critical function n^(log₂ 2) = n, f = 1 is smaller by a polynomial: case 1, Θ(n).", result: "B: Θ(n)" },
      { say: "C is case 2: Θ(n log n). D sums 1 + 2 + … + n: Θ(n²).", result: "C, D are not" },
    ], answer: "A, B", check: "Count leaves: B has n leaves, each costing 1." },
    { type: "example", id: "a1-e6", level: "gate", title: "GATE CS 2021 (forenoon), Q50 · 2 marks · an unequal split", file: "gate2021_fn_q50.txt", given: `T(n) = T(⌈n/2⌉) + T(⌊2n/5⌋) + 7n for n > 0, T(0) = 1.
A) Θ(n^(5/2))   B) Θ(n log n)   C) Θ(n)   D) Θ((log n)^(5/2))`, find: "The order of T(n).", steps: [
      { say: "The sizes of the two calls add to n/2 + 2n/5 = 0.9n, which is less than n.", result: "0.9 < 1" },
      { say: "So level k of the tree costs at most 7n · 0.9ᵏ. Summing this decreasing geometric series gives at most 70n.", result: "T(n) ≤ 70n" },
      { say: "The root alone costs 7n, so T(n) ≥ 7n.", result: "Θ(n)" },
    ], answer: "C", check: "If the fractions were 1/2 and 1/2 the answer would be n log n; if 1/2 and 3/5 it would be polynomially larger than n." },
    { type: "example", id: "a1-e7", level: "gate", title: "GATE CS 2021 (afternoon), Q55 · 2 marks · which Master-theorem statement is correct", file: "gate2021_an_q55.txt", given: `T(n) = a · T(⌈n/b⌉) + f(n), a ≥ 1, b > 1.
A) f = n log₂ n, then T = Θ(n log₂ n)
B) f = n / log₂ n, then T = Θ(log₂ n)
C) f = O(n^(log_b a − ε)) for some ε > 0, then T = Θ(n^(log_b a))
D) f = Θ(n^(log_b a)), then T = Θ(n^(log_b a))`, find: "The correct statement.", steps: [
      { say: "D is case 2 with k = 0, which gives an extra log factor: Θ(n^(log_b a) · log n). D is false.", result: "D false" },
      { say: "A and B name f but not a and b, and the answer depends on them: for a = 2, b = 2 the first gives Θ(n log² n) and the second Θ(n log log n). Both are false.", result: "A, B false" },
      { say: "C is exactly case 1.", result: "C true" },
    ], answer: "C", check: "Check A with a = b = 2: the extended case 2 gives n log² n, not n log n." },
    { type: "example", id: "a1-e8", level: "gate", title: "GATE CS 2026 (forenoon), Q17 · 1 mark · two coupled recurrences", file: "gate2026_fn_q17.txt", given: `T₁(n) = 4T₁(n/2) + T₂(n),  T₂(n) = 5T₂(n/4) + Θ(log₂ n),  both 1 for n ≤ 1.
A) T₁ = Θ(n²)   B) Θ(n² log n)   C) Θ(n^(log₄ 5))   D) Θ(n^(log₄ 5) log n)`, find: "The order of T₁.", steps: [
      { say: "T₂: critical function n^(log₄ 5) ≈ n^1.16; f = log n is polynomially smaller, case 1.", result: "T₂ = Θ(n^(log₄ 5))" },
      { say: "T₁: critical function n^(log₂ 4) = n². f = T₂ ≈ n^1.16 is polynomially smaller than n², case 1.", result: "T₁ = Θ(n²)" },
    ], answer: "A", check: "log₄ 5 = ln 5 / ln 4 ≈ 1.161, below 2." },
    { type: "example", id: "a1-e9", level: "gate", title: "GATE CS 2025 (forenoon), Q20 · 1 mark · T(n) = 2T(n−1) + n·2ⁿ", file: "gate2025_fn_q20.txt", given: `T(n) = 2T(n−1) + n·2ⁿ for n > 0, T(0) = 1.
A) Θ(n² 2ⁿ)   B) Θ(n 2ⁿ)   C) Θ((log n)² 2ⁿ)   D) Θ(4ⁿ)`, find: "The order of T(n).", steps: [
      { say: "Put T(n) = 2ⁿ·U(n). Then 2ⁿU(n) = 2·2ⁿ⁻¹U(n−1) + n·2ⁿ.", result: "U(n) = U(n−1) + n" },
      { say: "U(n) = n + (n−1) + … + 1 + U(0) = Θ(n²).", result: "U = Θ(n²)" },
      { say: "So T(n) = 2ⁿ · Θ(n²).", result: "Θ(n² 2ⁿ)" },
    ], answer: "A", check: "Numerically T(n)/(n²·2ⁿ) is 0.56 at n = 10, 0.505 at n = 100 and tends to 1/2." },
    { type: "example", id: "a1-e10", level: "gate", title: "GATE CS 2024 (forenoon), Q57 · 2 marks · T(n) = √n·T(√n) + n", file: "gate2024_fn_q57.txt", given: `T(n) = √n · T(√n) + n for n > 1, T(1) = 1.
A) Θ(n log log n)   B) Θ(n log n)   C) Θ(n² log n)   D) Θ(n² log log n)`, find: "The order of T(n).", steps: [
      { say: "Put T(n) = n·U(n). Then n·U(n) = √n · √n · U(√n) + n = n·U(√n) + n.", result: "U(n) = U(√n) + 1" },
      { say: "Each step takes a square root; the exponent halves until the value is constant: log log n steps.", result: "U = Θ(log log n)" },
    ], answer: "A", check: "The tempting Θ(n log n) comes from treating √n as n/2." },

    { type: "trap", wrong: "A loop nested inside a loop is always Θ(n²).", tempting: "Two loops each run to n, so n times n.", whyWrong: "The inner loop may run fewer times as the outer variable grows. In 'for i = 1..n, for j = 1; j < n; j += i' the inner loop runs n/i times, and the total is n·Hₙ = Θ(n log n). In 'for n halving, inner loop runs n times' the total is a geometric series, Θ(n).", rule: "Write the total as a sum over the outer variable, then evaluate the sum.", ex: { text: "n = 1024, outer halves, inner runs n times: total 2046, not 1024 × 10 = 10240." } },
    { type: "trap", wrong: "T(n) = 2T(√n) + 1 is Θ(log log n).", tempting: "Taking a square root each time gives log log n steps.", whyWrong: "log log n is the DEPTH. With two calls at each level the number of leaves doubles at each level, so there are 2^(log log n) = log n leaves, each costing 1: the total is Θ(log n). With ONE call it would be log log n.", rule: "Depth log log n, but count the calls: one call gives log log n, two calls give log n.", ex: { text: "n = 2⁶⁴: depth 6 (64, 32, 16 ... in the exponent); 2⁶ = 64 leaves = log n." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 AN Q24, Q25 · 2026 FN Q17 · 2025 FN Q20 · 2024 FN Q20, Q57 · 2023 FN Q29, Q54 · 2022 FN Q11 · 2021 FN Q50, Q61 · 2021 AN Q55 · 2020 FN Q34 · 2018 FN Q42, Q55 · 2017 FN Q21 · 2017 AN Q19, Q50, Q61." },
    { type: "recall", cards: [
      { q: "O, Ω, Θ in one line each?", a: "O: at most; Ω: at least; Θ: the same order (both)." },
      { q: "How do you decide f = o(g)?", a: "The ratio f(n)/g(n) tends to 0." },
      { q: "What is log(n!)?", a: "Θ(n log n)." },
      { q: "What is 2^(log₂ n)?", a: "Exactly n." },
      { q: "Order: log n, √n, n, n log n, n², 2ⁿ, n!", a: "That order, slowest to fastest." },
      { q: "A loop with i = i/2 runs how often?", a: "About log₂ n times." },
      { q: "1 + 1/2 + … + 1/n?", a: "Θ(log n), the harmonic series." },
      { q: "Master theorem: first step?", a: "Compute the critical function n^(log_b a) and compare it with f(n)." },
      { q: "T(n) = T(αn) + T(βn) + cn with α + β < 1?", a: "Θ(n): the root dominates." },
      { q: "T(n) = 2T(n − 1) + 1?", a: "Θ(2ⁿ)." },
      { q: "T(n) = T(√n) + 1?", a: "Θ(log log n)." },
      { q: "T(n) = 2T(n/2) + n/log n: can the Master theorem solve it?", a: "No: it falls in a gap; the tree gives Θ(n log log n)." },
    ] },
    { type: "check", questions: [
      { id: "a1c1", kind: "NAT", marks: 1, q: "for (i = 1; i <= n; i = i * 2) with n = 1024: how many times does the body run?", answer: "11", solution: "i = 1, 2, 4, …, 1024: eleven values." },
      { id: "a1c2", kind: "MCQ", marks: 1, q: "Which is true for f(n) = n log n and g(n) = n²?", options: ["f = Ω(g)", "f = o(g)", "f = Θ(g)", "g = O(f)"], answer: "B", solution: "f/g = (log n)/n tends to 0, so f = o(g)." },
      { id: "a1c3", kind: "MCQ", marks: 1, q: "log₂(n!) is", options: ["Θ(n)", "Θ(n log n)", "Θ(n²)", "Θ(log n)"], answer: "B", solution: "The product has n factors, half of them at least n/2." },
      { id: "a1c4", kind: "MSQ", marks: 2, q: "Which recurrences are Θ(n log n)?", options: ["T(n) = 2T(n/2) + n", "T(n) = T(n/2) + n", "T(n) = 3T(n/3) + n", "T(n) = 4T(n/2) + n"], answer: "A, C", solution: "a = b and f = n in A and C (case 2). B is Θ(n); D is Θ(n²)." },
      { id: "a1c5", kind: "NAT", marks: 2, q: "T(n) = T(n − 1) + 2 with T(1) = 1. What is T(50)?", answer: "99", solution: "T(n) = 2n − 1; T(50) = 99." },
      { id: "a1c6", kind: "MCQ", marks: 2, q: "T(n) = 3T(n/3) + n²", options: ["Θ(n)", "Θ(n log n)", "Θ(n²)", "Θ(n³)"], answer: "C", solution: "Critical function n; f = n² is polynomially larger, and 3(n/3)² = n²/3 ≤ n²/3 satisfies regularity: case 3." },
      { id: "a1c7", kind: "MCQ", marks: 2, q: "T(n) = T(√n) + 1, T(2) = 1. Then T(n) is", options: ["Θ(log log n)", "Θ(log n)", "Θ(√n)", "Θ(n)"], answer: "A", solution: "Each call takes the square root; the exponent halves each time." },
      { id: "a1c8", kind: "NAT", marks: 2, q: "T(n) = T(n/2) + T(n/4) + n. If T(n) = c·n for large n, what is c? (T(n) = T(n/2) + T(n/4) + n gives c = c/2 + c/4 + 1)", answer: "4", solution: "c = 0.75c + 1, so c = 4." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on asymptotics", sub: "Algorithms", href: "/topics/algorithms" }, { label: "Counting and growth", sub: "the gentle start, Data Structures D1", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Counting and growth (D1)", "Recursion (C8)"], usedIn: ["Every later Algorithms chapter", "Compiler Design: parsing costs"], cross: ["Data Structures: the cost of operations"] },
  ],
};
