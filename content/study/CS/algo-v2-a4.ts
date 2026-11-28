import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A4 "Divide and conquer" (28 Nov 2026). The pattern (split, solve, combine), its recurrence, and the standard examples beyond the sorts of A2:
 * the maximum subarray, recursive minimum and maximum, fast multiplication (Karatsuba, Strassen) and linear-time selection (median of medians).
 * Real GATE question (text from public/data/questions.json) re-solved here: 2019 FN Q14 (maximum subarray sum of a 14-element sequence: 29).
 * The other worked examples are edge cases written for this chapter and marked as such. Programs compiled and run with gcc: 29 (divide and conquer, split at the
 * middle, crossing sum 19 + 10), and 10 comparisons for the recursive min-max of 8 numbers.
 */
export const chapterA4: Topic = {
  id: "cs.algo.v2.dc4",
  title: "Divide and conquer",
  no: "A4",
  book: [
    { t: "p", text: "**Divide and conquer** is the most important design idea in this book after plain iteration. To solve a big problem, split it into smaller copies of the same problem, solve each copy by the same method (recursively), and combine the answers. Merge sort, quicksort and binary search, all met in the sorting chapter, are the three standard cases. This chapter names the pattern, gives its recurrence, and adds four more examples that GATE has used." },
    { t: "p", text: "The design idea is easy; what the paper tests is whether you can **write the recurrence correctly and solve it**, which is the toolkit of Chapter A1, and whether you can carry out the **combine step** by hand on a small input. The combine step is where the problem-specific thinking lives. In merge sort it is the merge; in the maximum-subarray problem it is a pair of scans outward from the middle." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["describe the three steps of divide and conquer and write the recurrence of a given algorithm;", "find the maximum subarray sum by divide and conquer and by hand;", "count the comparisons of the recursive minimum-and-maximum algorithm;", "explain why Karatsuba and Strassen beat the schoolbook methods and state their recurrences;", "state the idea and the cost of the median-of-medians selection algorithm;", "recognise when divide and conquer does not help."] },

    { t: "h2", text: "The pattern and its recurrence" },
    { t: "p", text: "Every divide-and-conquer algorithm has three steps. **Divide** the input of size n into a pieces of size about n/b. **Conquer** by solving each piece recursively; a piece small enough (often size 1) is solved directly. **Combine** the a answers into the answer for the whole input, at a cost f(n). Its running time satisfies T(n) = a · T(n/b) + f(n), the divide recurrence solved by the Master theorem in A1." },
    { t: "table", head: ["Algorithm", "a", "b", "f(n)", "T(n)"], rows: [
      ["Binary search", "1", "2", "1", "Θ(log n)"],
      ["Merge sort", "2", "2", "n (merge)", "Θ(n log n)"],
      ["Quicksort, even split", "2", "2", "n (partition)", "Θ(n log n)"],
      ["Maximum subarray (below)", "2", "2", "n (crossing scan)", "Θ(n log n)"],
      ["Recursive min and max (below)", "2", "2", "2 (two comparisons)", "Θ(n)"],
      ["Karatsuba multiplication", "3", "2", "n", "Θ(n^(log₂ 3)) ≈ n^1.585"],
      ["Strassen's matrix product", "7", "2", "n²", "Θ(n^(log₂ 7)) ≈ n^2.81"],
    ], caption: "Divide-and-conquer algorithms and their recurrences." },
    { t: "p", text: "Compare these rows. Merge sort and the maximum subarray share the shape 2T(n/2) + n, and so both cost n log n. The recursive minimum and maximum has the same a and b but only constant work in the combine step, so the leaves dominate and the cost is linear. The two multiplication rows save one recursive call over the obvious method, and that saving changes the **exponent**, which is the whole point of the two famous algorithms." },
    { t: "callout", kind: "key", text: "Divide and conquer costs T(n) = a·T(n/b) + f(n). A cheaper combine step lowers f; fewer recursive calls lower a. Lowering a lowers the exponent log_b a." },

    { t: "h2", text: "The maximum subarray" },
    { t: "p", text: "Given a sequence of numbers, some negative, find the **contiguous** stretch with the largest sum. For the sequence [−5, −10, 6, 3, −1, −2, 13, 4, −9, −1, 4, 12, −3, 0] of 14 numbers (GATE 2019), the best stretch runs from the 6 at index 2 to the 12 at index 11, with sum 6 + 3 − 1 − 2 + 13 + 4 − 9 − 1 + 4 + 12 = 29. A brute-force check of all stretches takes Θ(n²)." },
    { t: "p", text: "Divide and conquer splits the sequence at the middle. The best stretch is in exactly one of three places: **entirely in the left half**, **entirely in the right half**, or **crossing the middle**. The first two are the same problem on half the input, so the recursion solves them. The crossing case is easy: the best crossing stretch is the best stretch ending at the middle plus the best stretch starting just after it, and each is found by one scan outward from the middle in Θ(n). The answer is the largest of the three numbers." },
    { t: "fig", id: "a4-f1" },
    { t: "p", text: "Split the 14 numbers at index 6 (left half indexes 0 to 6, right half 7 to 13). Scanning left from index 6 gives running sums 13, 11, 10, 13, 19, 9, 4, so the best stretch ending at 6 is 19, reached at index 2. Scanning right from index 7 gives 4, −5, −6, −2, 10, 7, 7, so the best stretch starting at 7 is 10, reached at index 11. The crossing stretch has sum 19 + 10 = 29. The halves alone give less, so the answer is 29, as the brute-force check found." },
    { t: "fig", id: "a4-f2" },
    { t: "code", text: `#include <stdio.h>

int A[14] = {-5, -10, 6, 3, -1, -2, 13, 4, -9, -1, 4, 12, -3, 0};

int maxsub(int lo, int hi) {                          /* best sum inside A[lo..hi] */
    if (lo == hi) return A[lo];
    int mid = (lo + hi) / 2;
    int left = maxsub(lo, mid), right = maxsub(mid + 1, hi);
    int s = 0, bl = -1000000, br = -1000000;
    for (int i = mid; i >= lo; i--) { s += A[i]; if (s > bl) bl = s; }        /* best ending at mid */
    s = 0;
    for (int j = mid + 1; j <= hi; j++) { s += A[j]; if (s > br) br = s; }    /* best starting after mid */
    int cross = bl + br;
    int best = left > right ? left : right;
    return cross > best ? cross : best;
}

int main(void) {
    printf("%d\\n", maxsub(0, 13));
    return 0;
}`, out: "29", file: "max_subarray.c" },
    { t: "ex", id: "a4-e1" },
    { t: "p", text: "The running time is T(n) = 2T(n/2) + Θ(n) = Θ(n log n). There is a cleverer one-pass method (keep the best sum ending at the current element: it is the larger of the element alone and the element added to the previous best), which is Θ(n) and is a small dynamic-programming idea. Divide and conquer is still the method the paper names." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Recursive minimum and maximum" },
    { t: "p", text: "To find both the smallest and the largest of n numbers by divide and conquer, split the array in two halves, find the minimum and maximum of each half recursively, and combine with **two** comparisons: the smaller of the two minima and the larger of the two maxima. A single element is its own minimum and maximum (no comparison), and two elements need one comparison. That gives T(n) = 2T(n/2) + 2 with T(2) = 1." },
    { t: "p", text: "Unroll it for n a power of 2. The tree has n/2 leaves (the pairs), each costing 1, and n/2 − 1 internal combine steps, each costing 2, so T(n) = n/2 + 2(n/2 − 1) = 3n/2 − 2. This is the same optimal count as the pairing method of A2, reached by a different route, and it is linear, not n log n, because the combine step costs a constant." },
    { t: "code", text: `#include <stdio.h>

int cmp = 0;
int A[8] = {7, 3, 9, 1, 8, 2, 6, 5};

void minmax(int lo, int hi, int *mn, int *mx) {
    if (lo == hi) { *mn = *mx = A[lo]; return; }
    if (hi == lo + 1) {                                   /* two elements: one comparison */
        cmp++;
        if (A[lo] < A[hi]) { *mn = A[lo]; *mx = A[hi]; } else { *mn = A[hi]; *mx = A[lo]; }
        return;
    }
    int mid = (lo + hi) / 2, mn1, mx1, mn2, mx2;
    minmax(lo, mid, &mn1, &mx1);
    minmax(mid + 1, hi, &mn2, &mx2);
    cmp += 2;                                             /* combine: min of mins, max of maxes */
    *mn = mn1 < mn2 ? mn1 : mn2;
    *mx = mx1 > mx2 ? mx1 : mx2;
}

int main(void) {
    int mn, mx;
    minmax(0, 7, &mn, &mx);
    printf("%d\\n", cmp);
    return 0;
}`, out: "10", file: "min_max_dc.c" },
    { t: "p", text: "For n = 8 the program counts 10 comparisons, which equals 3 · 8/2 − 2. Compare the naive method, which makes 2(n − 1) = 14 comparisons. The saving is about a quarter." },

    { t: "h2", text: "Fast multiplication: fewer recursive calls" },
    { t: "p", text: "Multiplying two n-digit numbers the schoolbook way takes Θ(n²) digit operations. Split each number into a high and a low half: x = x₁·10^(n/2) + x₀ and y = y₁·10^(n/2) + y₀. Then xy = x₁y₁·10ⁿ + (x₁y₀ + x₀y₁)·10^(n/2) + x₀y₀, which needs **four** half-size products and additions: T(n) = 4T(n/2) + Θ(n) = Θ(n²), no gain." },
    { t: "p", text: "**Karatsuba's** trick computes the middle term from one more product instead of two: (x₁ + x₀)(y₁ + y₀) − x₁y₁ − x₀y₀ = x₁y₀ + x₀y₁. So only **three** half-size products are needed: T(n) = 3T(n/2) + Θ(n). The Master theorem, with log₂ 3 ≈ 1.585 > 1, gives Θ(n^(log₂ 3)) ≈ Θ(n^1.585), a real gain." },
    { t: "p", text: "**Strassen's** algorithm does the same for n × n matrices. Splitting each matrix into four n/2 × n/2 blocks, the obvious method makes **eight** block products: T(n) = 8T(n/2) + Θ(n²) = Θ(n³). Strassen found seven combinations of blocks whose products give the answer: T(n) = 7T(n/2) + Θ(n²) = Θ(n^(log₂ 7)) ≈ Θ(n^2.81). The cost of the extra additions is only n², which is absorbed." },
    { t: "ex", id: "a4-e2" },
    { t: "callout", kind: "note", text: "You need not memorise Strassen's seven formulas; you need to know that it makes 7 recursive products of half-size matrices instead of 8, that the recurrence is 7T(n/2) + Θ(n²), and that the answer is n^(log₂ 7)." },

    { t: "h2", text: "Selection in linear time" },
    { t: "p", text: "The **k-th smallest** element of an unsorted array can be found without sorting it. **Quickselect** partitions around a pivot as in quicksort, then recurses into only the part that contains the k-th element: on average T(n) = T(n/2) + n = Θ(n). Its worst case is Θ(n²) when the pivot is always bad. The **median-of-medians** algorithm guarantees a good pivot and so reaches Θ(n) in the **worst** case." },
    { t: "p", text: "The idea: split the array into groups of 5, find each group's median (a constant amount of work per group), find the median of those n/5 medians **recursively**, and use it as the pivot. At least about 3n/10 elements are smaller than this pivot and about 3n/10 are larger, so the recursive call is on at most 7n/10 elements. The work is T(n) = T(n/5) + T(7n/10) + Θ(n): one recursive call to find the pivot, one to continue the search. The two fractions add to 1/5 + 7/10 = 0.9 < 1, so by the rule of A1 (the sizes sum to less than n) the total is Θ(n)." },
    { t: "ex", id: "a4-e3" },
    { t: "p", text: "This is the algorithm behind the answer to a question we met in the sorting chapter: the median of one unsorted array takes O(n), and so the median of the medians of n arrays of n elements takes O(n²). The group size 5 is chosen so that the fractions add up to less than 1: with groups of 3 the sum would be 1/3 + 2/3 = 1 and the cost would be n log n." },

    { t: "h2", text: "When divide and conquer helps, and when it does not" },
    { t: "p", text: "Divide and conquer pays when the pieces are **independent**, so that solving them separately loses nothing, and the combine step is **cheaper than the whole problem**. Merge sort, quicksort, maximum subarray and fast multiplication all satisfy this." },
    { t: "p", text: "It does not pay when the pieces **overlap**: the same smaller problem appears in many branches of the recursion tree and is solved again and again. The Fibonacci recurrence F(n) = F(n − 1) + F(n − 2) is the classic example, with exponential work in the plain recursion. There the cure is not another split but to **remember** each answer once computed, which is dynamic programming (Chapter A6). The greedy method (A5) goes the other way and commits to one choice without branching." },
    { t: "p", text: "A GATE question may ask you to match algorithms with their design paradigm. The usual pairings: merge sort, quicksort, binary search, Strassen, maximum subarray (by splitting): divide and conquer; Dijkstra, Prim, Kruskal, Huffman, fractional knapsack: greedy; Floyd–Warshall, matrix-chain multiplication, longest common subsequence, 0/1 knapsack: dynamic programming." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Divide and conquer: divide into a pieces of size n/b, conquer recursively, combine at cost f(n): T(n) = aT(n/b) + f(n).", "Maximum subarray: the best stretch is in the left half, the right half or crossing the middle; the crossing stretch is two outward scans; Θ(n log n); the sequence of GATE 2019 gives 29.", "Recursive min and max: T(n) = 2T(n/2) + 2 gives 3n/2 − 2 comparisons, 10 for n = 8.", "Karatsuba uses 3 half-size products (Θ(n^1.585)); Strassen uses 7 block products (Θ(n^2.81)).", "Median of medians: groups of 5, T(n) = T(n/5) + T(7n/10) + n = Θ(n) worst case.", "Divide and conquer needs independent pieces; overlapping pieces call for dynamic programming."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a4-f1", caption: "Maximum subarray by divide and conquer on the 14 numbers of GATE 2019. The best stretch (indexes 2 to 11, sum 29) crosses the middle: its left part (best ending at index 6) is 19, its right part (best starting at index 7) is 10.", alt: "A row of 14 numbers split at index 6, with the crossing stretch from index 2 to 11 highlighted.", fig: { kind: "array", title: "Split at index 6; the best stretch crosses the split", data: [[-5, -10, 6, 3, -1, -2, 13, 4, -9, -1, 4, 12, -3, 0]], base: 0, size: 1, index: true, tones: { "0,2": "ok", "0,3": "ok", "0,4": "ok", "0,5": "ok", "0,6": "ok", "0,7": "hl", "0,8": "hl", "0,9": "hl", "0,10": "hl", "0,11": "hl", "0,0": "dim", "0,1": "dim", "0,12": "dim", "0,13": "dim" } } },
    { type: "figure", id: "a4-f2", caption: "The two outward scans from the split between index 6 and 7. Left: running sums moving left from index 6; right: running sums moving right from index 7. The largest of each is kept.", alt: "A table of running sums for the left scan and the right scan with the best of each marked.", fig: { kind: "trace", title: "Crossing scans", cols: ["step", "left scan: sum of A[i..6]", "right scan: sum of A[7..j]"], rows: [
      { cells: [1, 13, 4] }, { cells: [2, 11, -5] }, { cells: [3, 10, -6] }, { cells: [4, 13, -2] },
      { cells: [5, "19 (best)", "10 (best)"], changed: [1, 2], tone: "ok" }, { cells: [6, 9, 7] }, { cells: [7, 4, 7] },
    ] } },

    { type: "example", id: "a4-e1", level: "gate", title: "GATE CS 2019 (forenoon), Q14 · 1 mark · NAT: the maximum subsequence sum", file: "gate2019_fn_q14.txt", given: `A = [−5, −10, 6, 3, −1, −2, 13, 4, −9, −1, 4, 12, −3, 0], S(i, j) = A[i] + … + A[j]. The maximum of S(i, j) over 0 ≤ i ≤ j < 14? (Divide and conquer may be used.)`, find: "The maximum sum.", steps: [
      { say: "Split between index 6 and 7. The best stretch ending at 6: running sums leftward 13, 11, 10, 13, 19, 9, 4, best 19.", result: "19" },
      { say: "The best stretch starting at 7: 4, −5, −6, −2, 10, 7, 7, best 10.", result: "10" },
      { say: "The crossing stretch is 19 + 10 = 29. The left half alone gives at most 19 (indexes 2 to 6) and the right half alone at most 16 (indexes 10 and 11: 4 + 12), so the crossing stretch wins.", result: "29" },
    ], answer: "29", check: "The program in this chapter prints 29, and a check of all stretches finds the same, from index 2 to index 11." },
    { type: "example", id: "a4-e2", level: "edge", title: "Strassen against the obvious method · solve both recurrences", file: "strassen_recurrence.txt", given: `Obvious: T(n) = 8T(n/2) + n². Strassen: T(n) = 7T(n/2) + n². Find the order of each.`, find: "The two orders.", steps: [
      { say: "Obvious: log₂ 8 = 3, critical function n³, f = n² is polynomially smaller: case 1.", result: "Θ(n³)" },
      { say: "Strassen: log₂ 7 ≈ 2.807, critical function n^2.807, f = n² is polynomially smaller: case 1.", result: "Θ(n^2.807)" },
    ], answer: "Θ(n³) and Θ(n^(log₂ 7))", check: "Saving one of eight products lowers the exponent from 3 to 2.807." },
    { type: "example", id: "a4-e3", level: "edge", title: "Median of medians with groups of 5, and with groups of 3", file: "mom_groups.txt", given: `Groups of 5: T(n) = T(n/5) + T(7n/10) + n. Groups of 3: T(n) = T(n/3) + T(2n/3) + n. Find the order of each.`, find: "The two orders.", steps: [
      { say: "Groups of 5: the sizes add to 1/5 + 7/10 = 0.9 < 1, so the root dominates.", result: "Θ(n)" },
      { say: "Groups of 3: the sizes add to 1/3 + 2/3 = 1, so every level costs n.", result: "Θ(n log n)" },
    ], answer: "Θ(n) and Θ(n log n)", check: "That is why 5 is the standard group size." },

    { type: "trap", wrong: "The best stretch of a sequence is the best of the left half or the best of the right half.", tempting: "The problem is split into two independent halves.", whyWrong: "The best stretch may CROSS the split. In GATE 2019 the left half alone has best 19 and the right half alone has best 16, but the crossing stretch has 19 + 10 = 29.", rule: "Divide and conquer for the maximum subarray has three cases: left, right, crossing.", ex: { text: "Halves give 19 and 16; the true answer is 29, from index 2 to index 11." } },
    { type: "trap", wrong: "Divide and conquer always improves a recursive algorithm.", tempting: "Smaller problems are always easier.", whyWrong: "If the pieces overlap, as in F(n) = F(n − 1) + F(n − 2), the recursion repeats the same work exponentially often. Divide and conquer needs independent pieces; overlapping ones need memoisation (dynamic programming).", rule: "Independent pieces: divide and conquer. Overlapping pieces: dynamic programming.", ex: { text: "F(30) by plain recursion makes about 2.7 million calls; by remembering each value, 30." } },

    { type: "gate", text: "Real GATE question solved in this chapter: 2019 FN Q14. The related questions on the median of medians (2019 FN Q61), on merge sort (2026 AN Q32), and on the minimum and maximum (2021 FN Q30) are explained in the sorting chapter. The question that matches algorithms with design paradigms (2017 FN Q30) is answered by the pairings in the last section." },
    { type: "recall", cards: [
      { q: "Three steps of divide and conquer?", a: "Divide, conquer (recursively), combine." },
      { q: "Its general recurrence?", a: "T(n) = aT(n/b) + f(n)." },
      { q: "Where can the best subarray be?", a: "Left half, right half, or crossing the middle." },
      { q: "Cost of the maximum subarray by divide and conquer?", a: "Θ(n log n)." },
      { q: "Recursive min and max recurrence and result?", a: "T(n) = 2T(n/2) + 2; 3n/2 − 2 comparisons." },
      { q: "How many half-size products in Karatsuba?", a: "3, giving Θ(n^1.585)." },
      { q: "In Strassen's algorithm?", a: "7 block products, giving Θ(n^2.81)." },
      { q: "Median of medians: group size and recurrence?", a: "5; T(n) = T(n/5) + T(7n/10) + n = Θ(n)." },
      { q: "Quickselect average cost?", a: "Θ(n); worst case Θ(n²)." },
      { q: "When does divide and conquer fail?", a: "When subproblems overlap: use dynamic programming." },
    ] },
    { type: "check", questions: [
      { id: "a4c1", kind: "NAT", marks: 1, q: "The maximum subarray sum of [2, −5, 3, 4, −1, 2, −8, 6] is", answer: "8", solution: "3 + 4 − 1 + 2 = 8; the final 6 alone is less." },
      { id: "a4c2", kind: "NAT", marks: 1, q: "By the recursive min-max method (T(n) = 2T(n/2) + 2, T(2) = 1), how many comparisons are needed for n = 16?", answer: "22", solution: "3 · 16/2 − 2 = 22." },
      { id: "a4c3", kind: "MCQ", marks: 1, q: "Karatsuba's multiplication has the recurrence", options: ["T(n) = 4T(n/2) + n", "T(n) = 3T(n/2) + n", "T(n) = 2T(n/2) + n", "T(n) = 7T(n/2) + n²"], answer: "B", solution: "Three half-size products." },
      { id: "a4c4", kind: "MSQ", marks: 2, q: "Which are solved by divide and conquer in Θ(n log n)?", options: ["Merge sort", "Maximum subarray (split at the middle)", "Binary search", "Recursive min and max"], answer: "A, B", solution: "Binary search is Θ(log n) and min-max is Θ(n)." },
      { id: "a4c5", kind: "MCQ", marks: 2, q: "T(n) = 7T(n/2) + n² is", options: ["Θ(n²)", "Θ(n² log n)", "Θ(n^(log₂ 7))", "Θ(n³)"], answer: "C", solution: "log₂ 7 ≈ 2.81 > 2: leaves dominate." },
      { id: "a4c6", kind: "NAT", marks: 2, q: "In median of medians with groups of 7, the recurrence is T(n) = T(n/7) + T(5n/7) + n (approximately). What is the sum of the two fractions as a decimal to 3 places?", answer: "0.857", solution: "1/7 + 5/7 = 6/7 ≈ 0.857 < 1, so the cost is Θ(n)." },
      { id: "a4c7", kind: "MSQ", marks: 2, q: "Which problems have overlapping subproblems, so that plain divide and conquer is wasteful?", options: ["Fibonacci numbers by F(n−1) + F(n−2)", "Merge sort", "Counting paths in a grid by P(i−1, j) + P(i, j−1)", "Binary search"], answer: "A, C", solution: "The same smaller values are needed in many branches in A and C." },
      { id: "a4c8", kind: "NAT", marks: 2, q: "Merge sort of 8 elements makes how many merge operations?", answer: "7", solution: "n − 1 merges for n elements: 7." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on divide and conquer", sub: "Algorithms", href: "/topics/algorithms" }, { label: "Searching and sorting", sub: "the sorts that use this pattern", href: "/study/sorting" }] },
    { type: "links", prereq: ["Asymptotics and recurrences (A1)", "Searching and sorting (A2)", "Recursion (C8)"], usedIn: ["Dynamic programming (A6): when it fails", "Algorithms: the median of medians"], cross: ["Data Structures: recursion on trees (D6)"] },
  ],
};
