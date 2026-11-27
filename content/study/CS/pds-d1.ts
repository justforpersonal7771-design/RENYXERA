import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D1 "Counting and growth: the maths toolkit" (27 Nov 2026). No real GATE question is tagged to this chapter (it is the
 * prerequisite for every cost question). Every program was compiled and run with gcc (scripts/chapter-check.ts):
 * loop counts for n = 16 are 16, 4, 136 and 64; f(n) = f(n-1) + f(n-1) makes 31 calls for n = 4 and halving makes 7 calls for n = 64;
 * 1+...+100 = 5050, 1+2+...+2^10 = 2047, sum of h/2^h is 2; a doubling array copies 1023 elements in 1000 pushes.
 */
export const chapterD1: Topic = {
  id: "cs.pds.ds.growth1",
  title: "Counting and growth: the maths toolkit",
  no: "D1",
  book: [
    { t: "p", text: "Almost every question on data structures ends with a cost: how many steps does this loop take, how tall can this tree be, how much work does this recursive function do. To answer them you need a small kit of tools: a way to **count steps**, a way to **compare growth** (Big-O), the **logarithm**, a few **sums**, and the habit of reading a **recurrence** off a call tree. None of it needs advanced mathematics, and all of it is used again in the chapters on arrays, trees, heaps and algorithms." },
    { t: "p", text: "This chapter builds each tool from a picture or a small program first, and the formula afterwards. Nothing here is asked as a long theory question; what GATE asks is a count, an ordering of growth rates, or the value of a recurrence, and each of those becomes quick once the tools are in your hands." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["count the steps of a loop or a nested loop as a formula in n;", "say what O, Ω and Θ mean and order common growth rates (log n, n, n log n, n², 2ⁿ);", "explain why log₂ n is the number of times n can be halved, and use powers of 2 without a calculator;", "evaluate 1 + 2 + … + n, 1 + 2 + 4 + … + 2ᵏ and the series of h / 2ʰ;", "read a recurrence such as T(n) = 2T(n−1) + 1 from a call tree and solve it by adding work level by level;", "say what amortised cost means and compute it for a doubling array;", "use the complement and the expected value in a simple probability question."] },

    { t: "h2", text: "Counting steps" },
    { t: "p", text: "To compare two ways of doing a job we count how many **basic steps** each takes. A basic step is one simple operation: one comparison, one addition, one assignment. We do not care exactly how long a step takes on a given machine; we count them, because the count is the same on every machine, and it is the count that grows when the input grows." },
    { t: "p", text: "The count depends on the **size of the input**, which we call **n**: the number of items in an array, the number of nodes in a list, the number of bits in a number. A good answer is not a single number but a formula in n: 'this loop does n steps', 'this one does n² steps'." },
    { t: "p", text: "Sometimes the count also depends on **which input** of that size you get. Searching for a value in an unsorted array takes 1 step if it is the first item and n steps if it is the last or absent. We then speak of the **best case** (the cheapest input of size n), the **worst case** (the dearest) and the **average case** (the mean over all inputs). Unless a question says otherwise, GATE means the worst case." },
    { t: "p", text: "The best way to learn to count is to count real loops. The program below runs four loops for n = 16 and counts how many times each body runs. Read each loop first and predict its count." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n = 16;
    long c1 = 0, c2 = 0, c3 = 0, c4 = 0;
    for (int i = 0; i < n; i++) c1++;                       /* one loop */
    for (int i = 1; i < n; i *= 2) c2++;                    /* i doubles */
    for (int i = 0; i < n; i++)
        for (int j = i; j < n; j++) c3++;                   /* inner shrinks */
    for (int i = 0; i < n; i++)
        for (int j = 1; j < n; j *= 2) c4++;                /* n times a doubling loop */
    printf("%ld %ld %ld %ld\\n", c1, c2, c3, c4);
    return 0;
}`, out: "16 4 136 64", file: "count_loops.c" },
    { t: "p", text: "The first loop is the simplest: the body runs once for each of the n values of `i`, so **n** times. The second loop **doubles** `i` (1, 2, 4, 8, and 16 stops it), so it runs only 4 times: about log₂ n. The third has an inner loop that starts at `i`, so the inner body runs n, n−1, …, 1 times: a total of 1 + 2 + … + n = n(n+1)/2 = 136. The fourth runs a doubling loop (4 times) for each of n values of `i`: n log₂ n = 64." },
    { t: "ex", id: "d1-e1" },
    { t: "callout", kind: "tip", text: "Counting a loop: (number of times the body runs) × (cost of the body). For nested loops multiply, unless the inner loop's count depends on the outer variable; then add the inner counts for each value of the outer variable, as the third loop does." },

    { t: "h2", text: "Growth rates and Big-O" },
    { t: "p", text: "Now suppose one program takes 3n + 5 steps and another takes n² steps. For n = 10 the first takes 35 and the second 100; for n = 1000 the first takes 3005 and the second 1,000,000. As n grows the second falls hopelessly behind, and the +5 in the first stops mattering at all. What counts is the **growth rate**: how the number of steps grows as n grows. Big-O notation is the language for it." },
    { t: "p", text: "**f(n) = O(g(n))** means: from some point on, f(n) is at most a constant times g(n). It says g is an **upper bound** on the growth of f, up to a constant factor. So 3n + 5 = O(n), because 3n + 5 ≤ 4n once n ≥ 5. In the same way, n² = O(n³): n² never exceeds n³. Constants and lower-order terms are thrown away: 7n² + 100n + 3 = O(n²)." },
    { t: "p", text: "Two companions complete the picture. **f(n) = Ω(g(n))** means g is a **lower bound** (f is at least a constant times g, eventually). **f(n) = Θ(g(n))** means both: f grows exactly like g, up to constants. So 3n + 5 = Θ(n), and also O(n²) and Ω(1), but those other statements are not tight." },
    { t: "table", head: ["Symbol", "Plain meaning", "Example"], rows: [["O(g)", "grows no faster than g (upper bound)", "3n + 5 is O(n) and O(n²)"], ["Ω(g)", "grows at least as fast as g (lower bound)", "3n + 5 is Ω(n) and Ω(1)"], ["Θ(g)", "grows exactly like g (tight)", "3n + 5 is Θ(n)"]], caption: "Θ is O and Ω together. O alone does not say the bound is tight." },
    { t: "p", text: "The growth rates you meet most, from slowest to fastest, are: constant, **log n**, **n**, **n log n**, **n²**, **n³**, **2ⁿ**, **n!**. The next figure shows how different they are for n = 10, 1,000 and a million." },
    { t: "fig", id: "d1-f1" },
    { t: "p", text: "Read the figure by columns. At n = 10 everything is small and the differences hide. At n = 1,000 the log is 10 and n² is a million. At n = 1,000,000 the log is only 20, while n² is a million million (10¹²): a program that takes n² steps would run for days, one that takes n log n finishes in a fraction of a second, and 2ⁿ is not even imaginable. This is why the growth rate, and not the constant, decides what works on large inputs." },
    { t: "callout", kind: "key", text: "Order to remember: 1 < log n < √n < n < n log n < n² < n³ < 2ⁿ < n! < nⁿ. In Big-O, drop constants and lower-order terms; keep the fastest-growing term." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Logarithms: halving until one" },
    { t: "p", text: "The **logarithm** log₂ n answers the question: how many times can you halve n before you reach 1? Halve 64 and you get 32, 16, 8, 4, 2, 1: six halvings, so log₂ 64 = 6. Equivalently, log₂ n is the power to which 2 must be raised to give n: 2⁶ = 64. Whenever an algorithm throws away half of what is left at each step, as binary search does, the number of steps is about log₂ n." },
    { t: "fig", id: "d1-f2" },
    { t: "p", text: "Because the count is so small, a logarithmic algorithm is almost as good as a constant one: a million items need only 20 halvings, a billion need 30. A handful of powers of 2 is enough for most questions, and it is worth memorising them." },
    { t: "table", head: ["Power", "Value", "Handy approximation"], rows: [["2¹⁰", "1,024", "about a thousand (10³)"], ["2²⁰", "1,048,576", "about a million (10⁶)"], ["2³⁰", "1,073,741,824", "about a billion (10⁹)"], ["2⁷", "128", "a signed byte's top value + 1"], ["2¹⁶", "65,536", "the number of 16-bit values"]], caption: "So log₂ 1000 is about 10, log₂ one million about 20, log₂ one billion about 30." },
    { t: "p", text: "Three rules are enough. The log of a product is the sum of the logs: log(ab) = log a + log b. The log of a power brings the exponent down: log(aᵏ) = k log a, so log₂(n²) = 2 log₂ n. And changing the **base** only multiplies by a constant: log₁₀ n = log₂ n / log₂ 10, so in Big-O the base does not matter, O(log₂ n) = O(log₁₀ n). When an exact count is asked, though, the base matters and the answer is usually rounded up: halving n = 20 reaches 1 after ⌈log₂ 20⌉ = 5 steps." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Sums GATE needs" },
    { t: "p", text: "Loops add up work, so a few sums keep coming back. Each one is easier to remember from a picture than from a formula." },
    { t: "h3", text: "1 + 2 + 3 + … + n" },
    { t: "p", text: "Write the numbers twice, once forwards and once backwards, and add column by column: every column adds to n + 1, and there are n columns. That is n(n+1) for two copies, so one copy is **n(n+1)/2**. For n = 100 this is 5050. It grows like n²/2, so it is Θ(n²). This is the sum behind the third loop above and behind every 'inner loop that shrinks' (selection sort, bubble sort, comparing all pairs)." },
    { t: "h3", text: "1 + 2 + 4 + … + 2ᵏ" },
    { t: "p", text: "Each term doubles. The sum of a doubling sequence is always **one less than the next term**: 1 + 2 = 3 (one less than 4), 1 + 2 + 4 = 7 (one less than 8), 1 + 2 + 4 + 8 = 15 (one less than 16). So 1 + 2 + … + 2ᵏ = **2ᵏ⁺¹ − 1**. The whole sum is about the same as its last term, doubled. This is why a tree with k + 1 full levels has 2ᵏ⁺¹ − 1 nodes, and why the work of a doubling array is small." },
    { t: "fig", id: "d1-f3" },
    { t: "h3", text: "The series h / 2ʰ" },
    { t: "p", text: "1/2 + 2/4 + 3/8 + 4/16 + … looks as if it might grow forever, but the terms shrink so fast that the sum is **exactly 2**. The first few partial sums are 0.5, 1.0, 1.375, 1.75, 1.97, … and they creep up to 2 without passing it. This series appears in the analysis of building a heap: most nodes are near the bottom and need little work, a few near the top need a lot, and the total comes out as a constant times n." },
    { t: "p", text: "The program below checks all three sums numerically. The first two use exact integers; the third adds thirty terms of h / 2ʰ and prints the result to six decimals." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    long s1 = 0, s2 = 0;
    for (int i = 1; i <= 100; i++) s1 += i;               /* 1 + ... + 100 */
    for (int k = 0; k <= 10; k++) s2 += 1L << k;          /* 1 + 2 + ... + 2^10 */
    double s3 = 0, p = 1;
    for (int h = 1; h <= 30; h++) { p *= 2; s3 += h / p; }  /* h / 2^h */
    printf("%ld %ld %.6f\\n", s1, s2, s3);
    return 0;
}`, out: "5050 2047 2.000000", file: "three_sums.c" },
    { t: "ex", id: "d1-e3" },
    { t: "trap", i: 2 },

    { t: "h2", text: "Reading a recurrence from a call tree" },
    { t: "p", text: "A recursive function calls itself on a smaller input, so its cost is described in terms of its own cost on smaller inputs: a **recurrence**. For example, a function that does one step of work and then calls itself on n − 1 has T(n) = T(n−1) + 1. The cleanest way to solve a recurrence is to **draw the call tree** and add up the work level by level." },
    { t: "p", text: "Take a function `f(n)` that, unless n is 0, calls `f(n-1)` twice. Its recurrence is T(n) = 2T(n−1) + 1: two calls on the smaller input, plus 1 for the work of the call itself. The call tree has one call at the top, two below it, four below those, and so on, with n + 1 levels in all." },
    { t: "fig", id: "d1-f4" },
    { t: "p", text: "The levels hold 1, 2, 4, 8, … calls, which is the doubling sum we have just met. For n = 2 the tree above has 1 + 2 + 4 = 7 calls; in general it has 2ⁿ⁺¹ − 1 calls, so T(n) is Θ(2ⁿ). The program below counts the calls for n = 4 (31) and, for a function that halves, for n = 64 (7)." },
    { t: "code", text: `#include <stdio.h>

long calls = 0;

void f(int n) {                 /* T(n) = 2 T(n-1) + 1 */
    calls++;
    if (n == 0) return;
    f(n - 1);
    f(n - 1);
}

void h(int n) {                 /* T(n) = T(n/2) + 1 */
    calls++;
    if (n <= 1) return;
    h(n / 2);
}

int main(void) {
    f(4);
    long a = calls;
    calls = 0;
    h(64);
    printf("%ld %ld\\n", a, calls);
    return 0;
}`, out: "31 7", file: "count_calls.c" },
    { t: "ex", id: "d1-e2" },
    { t: "p", text: "A second recurrence, T(n) = 2T(n/2) + n, comes from algorithms that split the input in half, solve both halves, and spend n steps combining them (merge sort is the best-known example). Its call tree has one call of size n, two of size n/2, four of size n/4, and so on, and the work **per level** is always the same: n." },
    { t: "fig", id: "d1-f5" },
    { t: "p", text: "Every level costs n and there are about log₂ n + 1 levels, so the total is n(log₂ n + 1), which is **Θ(n log n)**. The method is the same each time: draw the tree, find the work on one level, find the number of levels, multiply." },
    { t: "table", head: ["Recurrence", "Work per level", "Levels", "Total"], rows: [["T(n) = T(n−1) + 1", "1", "n", "Θ(n)"], ["T(n) = T(n/2) + 1", "1", "log₂ n", "Θ(log n)"], ["T(n) = 2T(n−1) + 1", "doubles: 1, 2, 4, …", "n", "Θ(2ⁿ)"], ["T(n) = 2T(n/2) + n", "n", "log₂ n", "Θ(n log n)"], ["T(n) = T(n−1) + n", "n, n−1, …, 1", "n", "Θ(n²)"]], caption: "Draw the tree; add the work on each level; multiply by the number of levels." },
    { t: "trap", i: 3 },
    { t: "ex", id: "d1-e5" },

    { t: "h2", text: "Amortised cost: the piggy bank" },
    { t: "p", text: "Some data structures have operations that are cheap almost always and dear very rarely. A dynamic array appends in one step unless it is full; then it must allocate an array twice as big and copy everything across, which takes n steps. Quoting the worst case, O(n), for every append would be unfair, because the dear ones are rare and pay for themselves." },
    { t: "p", text: "The **amortised cost** of an operation is the total cost of a whole sequence of operations, divided by the number of operations. It is a guarantee about the sequence in the worst case, not a guess about an average input. For the dynamic array, n appends cost n for the writes plus 1 + 2 + 4 + … < 2n for the copies at each doubling, under 3n in all, so the amortised cost of an append is **O(1)**." },
    { t: "p", text: "The piggy bank is a way of seeing this. Charge every append 3 coins. One pays for writing the item; the other two go into a piggy bank. When the array is full and doubles, the coins saved since the last doubling pay for the copying, so the bank never runs below zero." },
    { t: "fig", id: "d1-f6" },
    { t: "p", text: "The program counts the copied elements for 1000 appends into an array that starts at capacity 1 and doubles when full: the copies are 1 + 2 + 4 + … + 512 = 1023, about the same as the 1000 appends themselves, so the total cost is a small multiple of n." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    long cap = 1, size = 0, copies = 0;
    for (int i = 0; i < 1000; i++) {
        if (size == cap) { copies += size; cap *= 2; }    /* full: copy and double */
        size++;                                           /* the append itself */
    }
    printf("%ld\\n", copies);
    return 0;
}`, out: "1023", file: "doubling_copies.c" },
    { t: "ex", id: "d1-e6" },
    { t: "callout", kind: "warning", text: "Amortised is **not** average-case. Average-case averages over random inputs; amortised is a worst-case guarantee on any sequence of operations. A single append can still cost n." },
    { t: "trap", i: 4 },

    { t: "h2", text: "Just enough probability" },
    { t: "p", text: "A few cost questions (hashing, random inputs, expected comparisons) need two ideas. The **complement rule**: the probability that something happens is 1 minus the probability that it does not. The chance of at least one six in three rolls of a die is easier as 1 − (5/6)³ = 91/216 than by counting the cases with one, two or three sixes." },
    { t: "p", text: "The **expected value** of a quantity is its average, weighted by probability: add up (value × probability) over every outcome. A fair die has expected value (1 + 2 + 3 + 4 + 5 + 6) / 6 = 3.5. Expected values **add**, even when the quantities are not independent: the expected sum of two dice is 3.5 + 3.5 = 7. This single fact makes many 'expected number of …' questions short." },
    { t: "p", text: "A linear search is a good small example. If the wanted value is equally likely to be at any of the n positions, it takes 1, 2, …, n steps with equal probability, so the **expected** number of steps is (1 + 2 + … + n) / n = (n + 1) / 2. This is the average case; the worst case is n." },

    { t: "h2", text: "Space, and auxiliary space" },
    { t: "p", text: "Time is not the only resource. **Space** is the memory an algorithm needs. Two figures are quoted: the **total space** (the input plus everything else) and the **auxiliary space**, the extra memory beyond the input. Reversing an array in place needs only a couple of variables: O(1) auxiliary space. Making a second array to hold the reversed copy needs O(n)." },
    { t: "p", text: "Recursion costs space too, even when no array is made: each pending call sits in a stack frame (chapter C8), so a recursion n levels deep uses O(n) stack space. A function that halves has only log₂ n frames pending, so it uses O(log n)." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "No past question is tagged to this chapter by name, because these tools are used inside the questions of every other chapter: 'how many comparisons', 'what is the time complexity', 'what is the height'. Three forms appear again and again: ordering growth rates, counting loop iterations, and solving a recurrence." },
    { t: "ex", id: "d1-e4" },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you can turn code into a count and a count into a growth rate without being fooled by the shape of the loop. The quick checks are: a loop that adds 1 each time runs n times; a loop that multiplies by 2 runs log₂ n times; a loop nested inside it multiplies the count (or adds a shrinking sum); and a recursion that calls itself twice on n − 1 is exponential." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Treating a doubling loop as n steps: `for (i = 1; i < n; i *= 2)` runs log₂ n times.", "Forgetting that 1 + 2 + … + n is about n²/2, not n.", "Saying 2T(n−1) + 1 is linear; it is exponential, 2ⁿ.", "Thinking amortised O(1) means every operation is O(1).", "Ordering n log n and n² the wrong way round, or placing 2ⁿ below n³."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Count basic steps as a formula in n; best, worst and average case differ; GATE means worst case unless it says otherwise.", "O is an upper bound, Ω a lower bound, Θ is tight. Drop constants and lower-order terms.", "Order: 1 < log n < n < n log n < n² < n³ < 2ⁿ < n!.", "log₂ n is the number of halvings of n; 2¹⁰ ≈ 10³, 2²⁰ ≈ 10⁶; the base of a log does not matter in Big-O.", "1 + … + n = n(n+1)/2; 1 + 2 + … + 2ᵏ = 2ᵏ⁺¹ − 1; the sum of h/2ʰ is 2.", "Solve a recurrence by drawing the call tree: work per level × number of levels.", "Amortised cost is the total cost of a sequence divided by its length; a doubling array appends in O(1) amortised.", "Expected values add; the complement rule often shortens a probability question."] },
  ],
  blocks: [
    { type: "figure", id: "d1-f1", caption: "How many steps each growth rate takes. By n = 1,000,000 the difference between n log n and n² is the difference between a blink and days.", alt: "A table of log n, n, n log n, n squared and 2 to the n for n = 10, 1000 and one million.", fig: { kind: "matrix", title: "Steps", cols: ["n = 10", "n = 1,000", "n = 1,000,000"], rows: [{ label: "log₂ n", cells: ["3.3", "10", "20"] }, { label: "n", cells: ["10", "1,000", "1,000,000"] }, { label: "n log₂ n", cells: ["33", "10,000", "20 million"], hl: true }, { label: "n²", cells: ["100", "1,000,000", "10¹²"] }, { label: "2ⁿ", cells: ["1,024", "about 10³⁰¹", "beyond imagining"] }] } },
    { type: "figure", id: "d1-f2", caption: "Halving 64 until it reaches 1 takes six steps, so log₂ 64 = 6. A million would need only about twenty.", alt: "A strip of seven values 64, 32, 16, 8, 4, 2, 1, each half the one before.", fig: { kind: "strip", items: [{ label: "64", sub: "start", state: "done" }, { label: "32", sub: "1", state: "done" }, { label: "16", sub: "2", state: "done" }, { label: "8", sub: "3", state: "done" }, { label: "4", sub: "4", state: "done" }, { label: "2", sub: "5", state: "done" }, { label: "1", sub: "6 halvings", state: "now" }] } },
    { type: "figure", id: "d1-f3", caption: "A doubling sequence: each running total is one less than the next term. After 1, 2, 4, 8, 16 the sum is 31 = 32 − 1.", alt: "Terms 1, 2, 4, 8, 16 and running sums 1, 3, 7, 15, 31.", fig: { kind: "matrix", title: "1 + 2 + 4 + 8 + 16", cols: ["1", "2", "3", "4", "5"], rows: [{ label: "term", cells: [1, 2, 4, 8, 16] }, { label: "sum so far", cells: [1, 3, 7, 15, 31], hl: true }, { label: "next term − 1", cells: [1, 3, 7, 15, 31] }] } },
    { type: "figure", id: "d1-f4", caption: "The call tree of f(2) where f(n) calls f(n−1) twice. Levels hold 1, 2 and 4 calls: 7 in all. For n = 4 the same pattern gives 31 calls.", alt: "A binary tree of seven calls: f(2) at the top, two f(1), and four f(0).", fig: { kind: "calltree", title: "f(2): 7 calls, T(n) = 2T(n−1) + 1", root: { label: "f(2)", kids: [{ label: "f(1)", kids: [{ label: "f(0)" }, { label: "f(0)" }] }, { label: "f(1)", kids: [{ label: "f(0)" }, { label: "f(0)" }] }] } } },
    { type: "figure", id: "d1-f5", caption: "T(n) = 2T(n/2) + n for n = 8: every level costs 8, and there are log₂ 8 + 1 = 4 levels, so the total is 32 = n(log₂ n + 1).", alt: "A table with four levels, the number of calls, work per call and level total of 8 each.", fig: { kind: "matrix", title: "Level", cols: ["Calls", "Work per call", "Level total"], rows: [{ label: "0", cells: [1, 8, 8] }, { label: "1", cells: [2, 4, 8] }, { label: "2", cells: [4, 2, 8] }, { label: "3", cells: [8, 1, 8] }, { label: "total", cells: ["", "", 32], hl: true }] } },
    { type: "figure", id: "d1-f6", caption: "A doubling array, charging 3 coins per append. The bank never goes below zero, so the copies are paid for and the amortised cost of an append is 3, a constant.", alt: "A table of nine appends with actual cost, coins charged and the bank balance after each.", fig: { kind: "matrix", title: "Append", cols: ["Actual cost", "Charged", "Bank after"], rows: [{ label: "1", cells: [1, 3, 2] }, { label: "2 (copy 1)", cells: [2, 3, 3] }, { label: "3 (copy 2)", cells: [3, 3, 3] }, { label: "4", cells: [1, 3, 5] }, { label: "5 (copy 4)", cells: [5, 3, 3], hl: true }, { label: "6", cells: [1, 3, 5] }, { label: "7", cells: [1, 3, 7] }, { label: "8", cells: [1, 3, 9] }, { label: "9 (copy 8)", cells: [9, 3, 3], hl: true }] } },

    { type: "example", id: "d1-e1", level: "easy", title: "Count four loops", file: "count_loops.c", given: `n = 16
loop 1: for (i = 0; i < n; i++)
loop 2: for (i = 1; i < n; i *= 2)
loop 3: for (i = 0; i < n; i++) for (j = i; j < n; j++)
loop 4: for (i = 0; i < n; i++) for (j = 1; j < n; j *= 2)`, find: "How many times each body runs.", steps: [
      { say: "Loop 1 runs once for each value of i from 0 to 15.", result: "16" },
      { say: "Loop 2: i takes 1, 2, 4, 8 and then 16 stops it. That is log₂ 16 = 4 values.", result: "4" },
      { say: "Loop 3: the inner loop runs 16, 15, …, 1 times. The sum 1 + … + 16 is 16 × 17 / 2.", result: "136" },
      { say: "Loop 4: a doubling loop (4 times) for each of the 16 values of i.", result: "16 × 4 = 64" },
    ], answer: "16, 4, 136, 64", check: "The program was compiled and run." },
    { type: "example", id: "d1-e2", level: "edge", title: "Count the calls of two recursions", file: "count_calls.c", given: `void f(int n) { if (n == 0) return; f(n-1); f(n-1); }   /* n = 4 */
void h(int n) { if (n <= 1) return; h(n/2); }            /* n = 64 */`, find: "The total number of calls (counting the first and the base cases) for each.", steps: [
      { say: "f(4) makes two calls on 3, which each make two on 2, and so on down to f(0). Level sizes: 1, 2, 4, 8, 16.", result: "1 + 2 + 4 + 8 + 16" },
      { say: "That sum is 2⁵ − 1.", result: "31" },
      { say: "h(64) calls h(32), h(16), h(8), h(4), h(2), h(1): one call at each halving, plus the first.", result: "7" },
    ], answer: "f(4): 31 calls; h(64): 7 calls", check: "The program was compiled and run." },
    { type: "example", id: "d1-e3", level: "easy", title: "Three sums, checked", file: "three_sums.c", given: `1 + 2 + ... + 100
1 + 2 + 4 + ... + 2^10
1/2 + 2/4 + 3/8 + ... (thirty terms)`, find: "Each sum by its formula, then check with the program.", steps: [
      { say: "The first sum is n(n+1)/2 with n = 100.", result: "5050" },
      { say: "The second is the next power of 2, 2¹¹, minus 1.", result: "2047" },
      { say: "The third climbs towards its limit of 2 and, after thirty terms, prints as 2.000000.", result: "2.000000" },
    ], answer: "5050, 2047 and 2.000000", check: "The program was compiled and run." },
    { type: "example", id: "d1-e4", level: "gate", title: "Order the growth rates", file: "order_growth.txt", given: `Order from slowest to fastest growing:
n log n,  2^n,  n^2,  log n,  n^3,  n`, find: "The increasing order.", steps: [
      { say: "log n is the slowest of them: it grows by about 1 whenever n doubles.", result: "log n" },
      { say: "Next the straight line n, then n log n, which is a little above n.", result: "n, n log n" },
      { say: "Then the powers n² and n³; any polynomial is beaten by an exponential, so 2ⁿ comes last.", result: "n², n³, 2ⁿ" },
    ], answer: "log n < n < n log n < n² < n³ < 2ⁿ", check: "Check at n = 1,000: log n = 10, n = 1,000, n log n = 10,000, n² = 10⁶, n³ = 10⁹, 2ⁿ ≈ 10³⁰¹." },
    { type: "example", id: "d1-e5", level: "gate", title: "Solve T(n) = 2T(n−1) + 1 for n = 4, with T(0) = 0", file: "recurrence_unrolled.txt", given: `T(0) = 0
T(n) = 2 T(n-1) + 1`, find: "T(4), by building the values up.", steps: [
      { say: "T(1) = 2 × T(0) + 1.", result: "1" },
      { say: "T(2) = 2 × T(1) + 1.", result: "3" },
      { say: "T(3) = 2 × T(2) + 1.", result: "7" },
      { say: "T(4) = 2 × T(3) + 1. Each value is one less than a power of 2, so T(n) = 2ⁿ − 1.", result: "15" },
    ], answer: "T(4) = 15, and in general T(n) = 2ⁿ − 1", check: "This is the number of moves in the Tower of Hanoi with n discs." },
    { type: "example", id: "d1-e6", level: "edge", title: "Amortised cost of a doubling array", file: "doubling_copies.c", given: `capacity starts at 1; when full, allocate twice as much and copy
1000 appends`, find: "The total number of elements copied, and the total cost per append.", steps: [
      { say: "The array doubles when it is full at sizes 1, 2, 4, …, 512, copying that many elements each time.", result: "1 + 2 + … + 512" },
      { say: "This is a doubling sum: 2¹⁰ − 1.", result: "1023 copies" },
      { say: "Total cost: 1000 writes plus 1023 copies, about 2 per append. It stays a constant, however large n is.", result: "amortised O(1)" },
    ], answer: "1023 elements copied; amortised cost O(1) per append.", check: "The program was compiled and run." },

    { type: "trap", wrong: "O(n) means the program takes exactly n steps, so 100n is faster than n² for every n.", tempting: "100n looks like a bigger number than n for the same n.", whyWrong: "Big-O describes growth, not an exact count. 100n is bigger than n² only while n < 100; after that n² is larger, and it keeps pulling away. The constant hides in the notation, so it never decides the winner for large n.", rule: "For large inputs the growth rate wins; constants only matter for small n.", ex: { code: "n = 10:   100n = 1,000     n^2 = 100\nn = 1000: 100n = 100,000   n^2 = 1,000,000", out: "n^2 loses only when n is small" } },
    { type: "trap", wrong: "for (i = 1; i < n; i *= 2) runs about n / 2 times.", tempting: "Doubling sounds like stepping by 2.", whyWrong: "Stepping by 2 (i += 2) gives n / 2 steps. Multiplying by 2 (i *= 2) makes i race up the powers of 2, so it reaches n after only log₂ n steps. For n = 16, i takes 1, 2, 4, 8, which is 4 steps, not 8.", rule: "i += c runs n/c times; i *= c runs log base c of n times.", ex: { code: "int c = 0;\nfor (int i = 1; i < 16; i *= 2) c++;\nprintf(\"%d\", c);", out: "4" } },
    { type: "trap", wrong: "1 + 2 + 4 + 8 = 8.", tempting: "The sum seems to end at its biggest term.", whyWrong: "The last term is only part of the sum. A doubling sum is the next power minus 1: 1 + 2 + 4 + 8 = 15 = 16 − 1. The total is nearly twice the last term.", rule: "1 + 2 + … + 2ᵏ = 2ᵏ⁺¹ − 1.", ex: { code: "1 + 2 + 4 + 8 = 15\nnot 8, but 16 - 1", out: "15" } },
    { type: "trap", wrong: "T(n) = 2T(n−1) + 1 is O(n), because the work per call is 1.", tempting: "Each call does only one unit of work.", whyWrong: "The count of calls doubles at each level. With n + 1 levels the calls are 1 + 2 + 4 + … = 2ⁿ⁺¹ − 1: exponential. A recursion that makes two calls on n − 1 is never linear.", rule: "Work per call × number of calls: here calls double each level.", ex: { code: "f(4) with f(n) calling f(n-1) twice:\ncalls = 1 + 2 + 4 + 8 + 16", out: "31" } },
    { type: "trap", wrong: "Amortised O(1) means every single operation takes O(1).", tempting: "Constant amortised cost sounds like constant cost.", whyWrong: "Amortised cost is the total over a sequence divided by its length. A single append to a full doubling array copies every element and costs n; but such an append is rare, and the total over n appends is O(n), so the average per append is constant.", rule: "Amortised = total over a sequence ÷ number of operations; one operation can still be dear.", ex: { code: "append number 513 to a full array of 512\ncosts 512 copies + 1 write", out: "513 for one append, yet 1000 appends cost under 3 each" } },
    { type: "gate", text: "No GATE question is tagged to this chapter by name; its tools are used in questions on every other chapter. The direct forms are: ordering growth rates, counting loop iterations, and solving a recurrence read from code." },
    { type: "recall", cards: [
      { q: "What does f(n) = O(g(n)) mean?", a: "f grows no faster than g, up to a constant factor, from some point on (upper bound)." },
      { q: "What is Θ?", a: "Both O and Ω: f grows exactly like g, up to constants." },
      { q: "Order the common growth rates.", a: "1 < log n < n < n log n < n² < n³ < 2ⁿ < n!." },
      { q: "What is log₂ n?", a: "The number of times n can be halved to reach 1." },
      { q: "Value of 2¹⁰ and 2²⁰?", a: "About a thousand (1,024) and about a million (1,048,576)." },
      { q: "Formula for 1 + 2 + … + n?", a: "n(n+1)/2." },
      { q: "Formula for 1 + 2 + 4 + … + 2ᵏ?", a: "2ᵏ⁺¹ − 1." },
      { q: "What does the series of h / 2ʰ add up to?", a: "2." },
      { q: "How to solve a recurrence?", a: "Draw the call tree; work per level × number of levels." },
      { q: "What is amortised cost?", a: "Total cost of a sequence of operations divided by their number, in the worst case." },
      { q: "Does the base of a logarithm matter in Big-O?", a: "No: logs of different bases differ by a constant factor." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "How many times does the body of  for (i = 1; i <= 64; i *= 2)  run?", answer: "7", solution: "i takes 1, 2, 4, 8, 16, 32, 64: seven values." },
      { id: "h2", kind: "NAT", marks: 1, q: "Compute 1 + 2 + 4 + … + 2⁹ (ten terms).", answer: "1023", solution: "2¹⁰ − 1 = 1023." },
      { id: "h3", kind: "MCQ", marks: 1, q: "Which grows fastest as n becomes large?", options: ["n³", "n log n", "2ⁿ", "n²"], answer: "C", solution: "An exponential beats every polynomial." },
      { id: "h4", kind: "MCQ", marks: 1, q: "T(n) = T(n−1) + 1 with T(0) = 0. What is T(n)?", options: ["n", "2ⁿ", "log n", "n²"], answer: "A", solution: "One unit is added n times." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["3n + 5 = O(n)", "n² = O(n³)", "2ⁿ = O(n²)", "log₂ n = O(log₁₀ n)"], answer: "A, B, D", solution: "2ⁿ grows faster than n², so C is false; the log bases differ by a constant, so D is true." },
      { id: "h6", kind: "NAT", marks: 2, q: "void f(int n) { if (n == 0) return; f(n-1); f(n-1); }  How many calls (including the first and all base cases) does f(5) make?", answer: "63", solution: "1 + 2 + 4 + 8 + 16 + 32 = 63 = 2⁶ − 1." },
      { id: "h7", kind: "NAT", marks: 2, q: "int c = 0; for (int i = 1; i < 16; i *= 2) for (int j = 0; j < i; j++) c++;  What is c?", answer: "15", solution: "i = 1, 2, 4, 8, so the inner body runs 1 + 2 + 4 + 8 = 15 times." },
      { id: "h8", kind: "NAT", marks: 2, q: "A dynamic array starts with capacity 1 and doubles when full. How many elements are copied during 1000 appends in all?", answer: "1023", solution: "Copies at sizes 1, 2, 4, …, 512: sum 1023." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on asymptotic analysis", sub: "Algorithms", href: "/topics/algorithms" }, { label: "The Data Structures book", sub: "next: arrays", href: "/study/data-structures" }] },
    { type: "links", prereq: ["What a data structure is (D0)", "Loops (C5)", "Recursion in C (C8)"], usedIn: ["Every later chapter on cost", "Algorithms: asymptotic notation and recurrences"], cross: ["Discrete maths: counting and recurrences"] },
  ],
};
