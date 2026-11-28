import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A0 "Before the algorithms: the toolbox" (28 Nov 2026). What an algorithm is, input size, counting steps, correctness and the loop invariant,
 * edge cases, and the small maths kit every later chapter uses: logarithms, floors and ceilings, sums (arithmetic, geometric, harmonic), induction.
 * No GATE question tests this chapter directly; its worked examples are edge cases written for it and marked as such, and each ties to the real questions that use the tool later
 * (A1 loops and recurrences, A2 insertion sort, A8 counting). Programs compiled and run with gcc: 5050; 2047; 7.485; 9; the insertion-sort prefixes.
 */
export const chapterA0: Topic = {
  id: "cs.algo.v2.toolbox0",
  title: "Before the algorithms: the toolbox",
  no: "A0",
  book: [
    { t: "p", text: "Algorithms is the subject where a little mathematics goes a very long way. Almost every question in the next ten chapters is answered by a few ideas used again and again: count the steps, name how the count grows, check that the method is correct, and reduce a sum or a logarithm. This short chapter collects those ideas in one place, with no GATE question to solve, so that the later chapters can use them without stopping to explain." },
    { t: "p", text: "Read it once, slowly, with a pencil. Nothing here is hard, but every later chapter will quietly assume you know it: that log₂ 1024 is 10, that 1 + 2 + … + n is n(n + 1)/2, that a loop that halves its variable runs about log₂ n times. The check questions at the end are quick; if you answer them all you can skip straight to Chapter A1." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["say precisely what an algorithm is and what 'input size' means for the usual problems;", "count the steps of a simple algorithm and distinguish worst, best and average cases;", "prove a simple algorithm correct with a loop invariant;", "use the logarithm identities, floors and ceilings with confidence;", "evaluate arithmetic, geometric and harmonic sums;", "use induction to confirm a formula."] },

    { t: "h2", text: "What an algorithm is" },
    { t: "p", text: "An **algorithm** is a finite, unambiguous sequence of steps that takes an **input** and produces an **output**, and that always stops. 'Find the largest number in a list' is a problem; 'look at each number in turn and remember the largest so far' is an algorithm that solves it. A problem usually has many algorithms, and the study of algorithms is largely the study of how to choose among them." },
    { t: "p", text: "Two questions are asked of every algorithm. **Is it correct?** For every valid input it must stop and give the right output. **Is it efficient?** It should use few steps (time) and little memory (space) as the input grows. This book is mostly about the second question, but the first always comes first: a fast wrong algorithm is worth nothing." },
    { t: "p", text: "Efficiency is measured against the **size of the input**, written n. For a list or an array, n is the number of elements. For a graph, it is the number of vertices n and the number of edges m. For a number, it is the number of digits or bits. The choice of what counts as size is part of the problem, and a question that hides it (the 'n' in a number-theoretic algorithm is the number of bits, not the number itself) is one of the classic traps." },

    { t: "h2", text: "Counting steps" },
    { t: "p", text: "We count **basic steps**: one comparison, one addition, one assignment, one array access, each as one unit. We ignore the speed of the machine, because a faster machine only multiplies every count by a constant. What matters is how the count grows with n." },
    { t: "p", text: "Different inputs of the same size can cost different amounts, so we name the case. The **worst case** is the largest cost over all inputs of size n; the **best case** is the smallest; the **average case** is the mean over a stated distribution of inputs. The worst case is the safest guarantee and the usual default in the paper. Searching an unsorted list of n numbers for a key costs 1 comparison in the best case, n in the worst case, and about n/2 on average if the key is equally likely to be anywhere." },
    { t: "p", text: "Once you have the count, you simplify it by keeping only the **dominant term** and dropping its constant: 3n² + 7n + 2 is 'of order n²'. The next chapter makes this precise as the notation O, Ω and Θ. Here we only need the habit: when you count, decide which loop or call dominates, and count that carefully." },
    { t: "fig", id: "a0-f1" },
    { t: "ex", id: "a0-e1" },

    { t: "h2", text: "Correctness and the loop invariant" },
    { t: "p", text: "An algorithm is correct if it gives the right output for every valid input. Testing on a few inputs cannot show this; a short argument can. For an algorithm built around a loop the standard argument uses a **loop invariant**: a statement that is true before the loop starts, stays true after every pass, and, together with the reason the loop stopped, implies the answer is right." },
    { t: "p", text: "Take **insertion sort**, which sorts an array by taking each element in turn and sliding it left into its place among the elements before it. Its invariant is: **before the pass for position i, the elements at positions 0 to i − 1 are the original elements of those positions, in sorted order.** Initially (i = 1) the single element at position 0 is trivially sorted. Each pass inserts the element at position i into the sorted prefix, so the prefix of length i + 1 is sorted. When the loop ends (i = n), the whole array is the sorted prefix, and so the algorithm is correct." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[6] = {5, 2, 4, 6, 1, 3};
    for (int i = 1; i < 6; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }   /* slide larger elements right */
        a[j + 1] = key;
        /* invariant: a[0..i] is sorted */
        for (int k = 0; k <= i; k++) printf("%d ", a[k]);
        printf("| ");
    }
    printf("\\n");
    return 0;
}`, out: "2 5 | 2 4 5 | 2 4 5 6 | 1 2 4 5 6 | 1 2 3 4 5 6 |", file: "insertion_invariant.c" },
    { t: "p", text: "The program prints the sorted prefix after every pass, and each printed prefix is sorted, which is the invariant at work. The same three-part argument (initialisation, maintenance, termination) is how correctness is proved for binary search, for the partition step of quicksort and for Dijkstra's algorithm." },
    { t: "fig", id: "a0-f2" },
    { t: "ex", id: "a0-e2" },
    { t: "callout", kind: "key", text: "Loop invariant: true before the loop (initialisation), kept true by every pass (maintenance), and, when the loop stops, strong enough to give the answer (termination)." },

    { t: "h2", text: "Edge cases" },
    { t: "p", text: "Many wrong answers in the paper come from the edges of the input rather than its middle. An algorithm should be tried on the **smallest inputs** (an empty list, one element, two elements), on inputs with **repeated values** (are keys distinct?), on inputs **already in the best or worst order** (sorted, reversed), and on inputs at the **limits of a loop bound** (does the loop run to n − 1 or to n?)." },
    { t: "p", text: "Three examples recur. A binary search on one element must still compare it. A hash probe that wraps past the last slot must return to slot 0. A recurrence such as T(n) = T(⌈n/2⌉) + 1 never ends at n = 1 if its base case is stated for n = 0 only, because ⌈1/2⌉ = 1. Before accepting a result, run it on n = 1, n = 2 and n = 3." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Logarithms, floors and ceilings" },
    { t: "p", text: "The **logarithm** log_b x answers 'to what power must b be raised to give x?'. So log₂ 1024 = 10 because 2¹⁰ = 1024. In algorithms, the base is 2 unless said otherwise, and since changing the base multiplies by a constant (log_b x = log₂ x / log₂ b), the base does not matter inside Θ notation. The logarithm of n is, to a good approximation, **how many times you can halve n before reaching 1**, and so it counts the passes of any loop or recursion that halves." },
    { t: "table", head: ["Identity", "Example"], rows: [
      ["log(xy) = log x + log y", "log₂ 8 + log₂ 4 = 3 + 2 = log₂ 32 = 5"],
      ["log(x / y) = log x − log y", "log₂ 64 − log₂ 8 = 6 − 3 = 3"],
      ["log(xʸ) = y · log x", "log₂ 2¹⁰ = 10"],
      ["b^(log_b x) = x", "2^(log₂ n) = n"],
      ["a^(log_b c) = c^(log_b a)", "n^(log₂ 3) = 3^(log₂ n)"],
      ["log_b x = log_a x / log_a b", "log₂ x = ln x / ln 2"],
    ], caption: "The logarithm identities used throughout the book. The fifth, the swap rule, is useful for comparing growth rates." },
    { t: "p", text: "The **floor** ⌊x⌋ is the largest integer not above x and the **ceiling** ⌈x⌉ the smallest integer not below x: ⌊3.7⌋ = 3, ⌈3.2⌉ = 4. They appear because halving an odd number gives a half. The number of times you can halve n (with floors) before it drops below 2 is ⌊log₂ n⌋, and the number of bits needed to write n in binary is ⌊log₂ n⌋ + 1. A binary search of n elements takes at most ⌊log₂ n⌋ + 1 probes." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n = 1000, halvings = 0;
    while (n > 1) { n = n / 2; halvings++; }
    printf("%d\\n", halvings);
    return 0;
}`, out: "9", file: "halvings.c" },
    { t: "p", text: "A loop that halves 1000 until it reaches 1 runs 9 times, and ⌊log₂ 1000⌋ = 9 because 2⁹ = 512 ≤ 1000 < 1024 = 2¹⁰. That is the whole content of 'logarithmic time'. A useful fact: log₂ of 10³ is about 10, of 10⁶ is about 20 and of 10⁹ is about 30. A logarithmic algorithm needs at most 30 steps for a billion items." },

    { t: "h2", text: "Sums you must know" },
    { t: "p", text: "Loop costs turn into sums. Four sums cover almost all of them." },
    { t: "table", head: ["Sum", "Value", "Order"], rows: [
      ["1 + 2 + 3 + … + n  (arithmetic)", "n(n + 1)/2", "Θ(n²)"],
      ["1 + 2 + 4 + … + 2ᵏ  (geometric, ratio 2)", "2ᵏ⁺¹ − 1", "Θ(last term)"],
      ["1 + r + r² + … + rᵏ with r < 1", "(1 − rᵏ⁺¹)/(1 − r) < 1/(1 − r)", "Θ(1)"],
      ["1 + 1/2 + 1/3 + … + 1/n  (harmonic)", "Hₙ ≈ ln n + 0.58", "Θ(log n)"],
    ], caption: "The sums of loop analysis. A geometric series with ratio above 1 is dominated by its last term; with ratio below 1 by its first." },
    { t: "p", text: "The arithmetic sum is the cost of a loop in which the inner bound grows by one each time (bubble sort's n(n − 1)/2 comparisons). The geometric sum is the cost of a loop that halves or doubles: 1 + 2 + 4 + … + 1024 = 2047, less than twice the last term, so doubling loops cost only about twice their last pass. The harmonic sum is the cost of a loop like 'for j = 1; j < n; j += i' summed over i, and it grows as log n." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    long arith = 0, geo = 0;
    double harm = 0;
    for (int i = 1; i <= 100; i++) arith += i;
    for (int i = 0; i <= 10; i++) geo += 1L << i;
    for (int i = 1; i <= 1000; i++) harm += 1.0 / i;
    printf("%ld %ld %.3f\\n", arith, geo, harm);
    return 0;
}`, out: "5050 2047 7.485", file: "sums.c" },
    { t: "p", text: "The program prints the three values: 1 + … + 100 = 5050 = 100 · 101/2; 1 + 2 + … + 1024 = 2047 = 2¹¹ − 1; and H₁₀₀₀ = 7.485, close to ln 1000 + 0.58 = 6.91 + 0.58. Remember each as a picture: a triangle of area n²/2, a doubling pile dominated by its top, and a very slowly growing logarithm." },
    { t: "ex", id: "a0-e3" },

    { t: "h2", text: "Induction and the small proofs" },
    { t: "p", text: "**Mathematical induction** proves a statement for every n ≥ 1 in two steps. **Base case:** show it for n = 1. **Inductive step:** assume it for n = k (the inductive hypothesis) and show it for n = k + 1. Then it holds for 1, hence for 2, hence for 3, and so on." },
    { t: "p", text: "Prove 1 + 2 + … + n = n(n + 1)/2. Base case: n = 1 gives 1 = 1 · 2/2. Step: assume the formula for k. Then 1 + … + k + (k + 1) = k(k + 1)/2 + (k + 1) = (k + 1)(k/2 + 1) = (k + 1)(k + 2)/2, which is the formula for k + 1. Induction is also how recurrences are verified: guess T(n) ≤ c · g(n), check the base case, and show the recurrence preserves the inequality. The proofs in the book are mostly of this kind, and each is only a few lines." },
    { t: "p", text: "A second small tool is **proof by counting**: to show that no comparison sort beats n log n, count the n! possible orders and note that k yes/no questions distinguish at most 2ᵏ of them. A third is **the pigeonhole principle**: if more than m items go into m boxes, some box gets two; this is why a hash table must have collisions. You will meet both again." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["An algorithm: a finite, unambiguous procedure that always stops; judged by correctness and by cost against the input size n.", "Count basic steps; name the case (worst, best, average); keep the dominant term.", "Loop invariant: initialisation, maintenance, termination.", "Test on n = 0, 1, 2, sorted and reversed inputs, repeated values, and loop-bound limits.", "log₂ n counts halvings: ⌊log₂ n⌋ halvings, ⌊log₂ n⌋ + 1 bits; 2^(log n) = n; the base does not matter inside Θ.", "Sums: 1 + … + n = n(n + 1)/2; 1 + 2 + … + 2ᵏ = 2ᵏ⁺¹ − 1; geometric with ratio below 1 is constant; harmonic is log n.", "Induction: base case and inductive step; pigeonhole and counting are the other small proof tools."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a0-f1", caption: "The same task, two algorithms, two growth rates. Linear search for a key among n items takes up to n steps; binary search on a sorted list takes about log₂ n. The gap widens without limit.", alt: "A table with n and the worst-case number of steps for linear search and for binary search, for four sizes.", fig: { kind: "trace", title: "Worst-case steps", cols: ["n", "linear search", "binary search"], rows: [
      { cells: [16, 16, 5] }, { cells: [1024, 1024, 11] }, { cells: [1000000, 1000000, 20] }, { cells: ["10⁹", "10⁹", 30], tone: "ok" },
    ] } },
    { type: "figure", id: "a0-f2", caption: "The sorted prefix of insertion sort on 5 2 4 6 1 3. After each pass the elements at positions 0 to i are sorted: this is the loop invariant, shown pass by pass.", alt: "A table of passes 1 to 5 with the sorted prefix after each.", fig: { kind: "trace", title: "Insertion sort: the invariant after each pass", cols: ["pass i", "array", "sorted prefix"], rows: [
      { cells: [0, "5 2 4 6 1 3", "5"] }, { cells: [1, "2 5 4 6 1 3", "2 5"], changed: [1] }, { cells: [2, "2 4 5 6 1 3", "2 4 5"], changed: [1] },
      { cells: [3, "2 4 5 6 1 3", "2 4 5 6"] }, { cells: [4, "1 2 4 5 6 3", "1 2 4 5 6"], changed: [1] }, { cells: [5, "1 2 3 4 5 6", "1 2 3 4 5 6"], changed: [1], tone: "ok" },
    ] } },

    { type: "example", id: "a0-e1", level: "edge", title: "Counting the comparisons of a linear search · worst, best and average", file: "linear_search_cases.txt", given: `A list of n distinct numbers, a key that is present, each position equally likely. Count the comparisons of linear search in the worst, best and average cases.`, find: "Three counts.", steps: [
      { say: "Best case: the key is first: 1 comparison.", result: "1" },
      { say: "Worst case: the key is last: n comparisons.", result: "n" },
      { say: "Average: position i costs i comparisons, each with probability 1/n: (1 + 2 + … + n)/n = (n + 1)/2.", result: "(n + 1)/2" },
    ], answer: "1, n and (n + 1)/2", check: "For n = 9 the three values are 1, 9 and 5." },
    { type: "example", id: "a0-e2", level: "edge", title: "A loop invariant for finding the maximum", file: "max_invariant.txt", given: `max = a[0]; for (i = 1; i < n; i++) if (a[i] > max) max = a[i];
State a loop invariant and prove the algorithm correct.`, find: "The invariant and the proof.", steps: [
      { say: "Invariant: before the pass for index i, max is the largest of a[0..i − 1].", result: "invariant" },
      { say: "Initialisation: i = 1; max = a[0] is the largest of a[0..0].", result: "true at start" },
      { say: "Maintenance: if a[i] > max it becomes the new max, otherwise max stays; either way max is the largest of a[0..i].", result: "kept" },
      { say: "Termination: the loop stops with i = n; the invariant says max is the largest of a[0..n − 1]: the answer.", result: "correct" },
    ], answer: "max is the largest of the prefix; correct", check: "The loop makes exactly n − 1 comparisons." },
    { type: "example", id: "a0-e3", level: "edge", title: "Using the sums: the cost of two loop nests", file: "two_nests.txt", given: `(a) for i = 1..n, for j = 1..i: step.   (b) for i = 1..n, for j = 1; j < n; j += i: step.
Find the number of steps of each in Θ notation.`, find: "Two orders.", steps: [
      { say: "(a): the inner loop runs i times: 1 + 2 + … + n = n(n + 1)/2.", result: "Θ(n²)" },
      { say: "(b): the inner loop runs about n/i times: n(1 + 1/2 + … + 1/n) = n Hₙ.", result: "Θ(n log n)" },
    ], answer: "Θ(n²) and Θ(n log n)", check: "The nest in (b) is GATE 2017's loop, solved in the next chapter." },

    { type: "trap", wrong: "An algorithm that works on a few examples is correct.", tempting: "It gave the right answer on every case I tried.", whyWrong: "Examples cannot cover the edges: the empty input, one element, repeated values, the already-sorted case and the loop-bound limits. Only an argument (a loop invariant, an induction) covers every input.", rule: "Test the edges, and prove with an invariant.", ex: { text: "A 'find the second largest' that tracks max and second max wrongly fails only when the largest is the first element: [9, 3, 5]." } },

    { type: "gate", text: "No GATE question tests this chapter directly, but every Algorithms question uses its tools. The questions that use the sums and logarithms are in Chapter A1; the loop invariant for insertion sort underlies the sorting questions in Chapter A2." },
    { type: "recall", cards: [
      { q: "What is an algorithm?", a: "A finite, unambiguous procedure that takes an input and always stops with the output." },
      { q: "Worst, best, average case?", a: "Largest, smallest cost over inputs of size n; mean over a stated distribution." },
      { q: "Loop invariant parts?", a: "Initialisation, maintenance, termination." },
      { q: "⌊log₂ n⌋ counts what?", a: "How many times n can be halved before reaching 1." },
      { q: "Bits needed to write n?", a: "⌊log₂ n⌋ + 1." },
      { q: "2^(log₂ n)?", a: "n." },
      { q: "1 + 2 + … + n?", a: "n(n + 1)/2." },
      { q: "1 + 2 + 4 + … + 2ᵏ?", a: "2ᵏ⁺¹ − 1." },
      { q: "The harmonic sum Hₙ?", a: "About ln n: Θ(log n)." },
      { q: "Two steps of induction?", a: "Base case, then inductive step from k to k + 1." },
    ] },
    { type: "check", questions: [
      { id: "a0c1", kind: "NAT", marks: 1, q: "How many times can 4096 be halved before reaching 1?", answer: "12", solution: "4096 = 2¹², so 12 halvings." },
      { id: "a0c2", kind: "NAT", marks: 1, q: "1 + 2 + 3 + … + 20 = ?", answer: "210", solution: "20 · 21 / 2 = 210." },
      { id: "a0c3", kind: "MCQ", marks: 1, q: "1 + 2 + 4 + 8 + … + 512 equals", options: ["511", "512", "1023", "1024"], answer: "C", solution: "2¹⁰ − 1 = 1023." },
      { id: "a0c4", kind: "MSQ", marks: 2, q: "Which are true?", options: ["log₂ 64 = 6", "2^(log₂ 50) = 50", "log(xy) = (log x)(log y)", "⌈3.2⌉ = 4"], answer: "A, B, D", solution: "log(xy) = log x + log y, not the product." },
      { id: "a0c5", kind: "NAT", marks: 2, q: "A list of 1000 numbers, each position equally likely for a present key. The average number of comparisons of linear search, (n + 1)/2, is", answer: "500.5", solution: "(1000 + 1)/2 = 500.5." },
      { id: "a0c6", kind: "NAT", marks: 2, q: "The number of bits needed to write the number 1000 in binary is", answer: "10", solution: "⌊log₂ 1000⌋ + 1 = 9 + 1 = 10." },
      { id: "a0c7", kind: "MCQ", marks: 2, q: "A loop invariant must be true", options: ["before the loop only", "after the loop only", "before the loop and after every pass", "only at termination"], answer: "C", solution: "Initialisation and maintenance." },
      { id: "a0c8", kind: "NAT", marks: 2, q: "The sum 1 + 1/2 + 1/4 + 1/8 + … (infinitely many terms) is", answer: "2", solution: "Geometric with ratio 1/2: 1/(1 − 1/2) = 2." },
    ] },
    { type: "practice", links: [{ label: "Asymptotics and recurrences", sub: "the next chapter, A1", href: "/study/asymptotics" }, { label: "Counting and growth", sub: "Data Structures D1", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Loops (C4)", "Recursion (C8)"], usedIn: ["Every later Algorithms chapter"], cross: ["Data Structures: counting and growth (D1)", "Discrete Mathematics: induction and counting"] },
  ],
};
