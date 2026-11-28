import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A2 "Searching and sorting" (28 Nov 2026). Real GATE questions (texts from public/data/questions.json), each re-solved here:
 * 2025 FN Q33 (bubble sort on 30 descending numbers: 435 swaps), 2026 AN Q32 (void merges in merge sort: 3), 2019 FN Q31 (random pivot in the worst place: 2/25 = 0.08),
 * 2017 FN Q45 (first 1 in 31 probes: 5), 2025 AN Q41 (bitonic search Theta(log n)), 2021 FN Q30 (min and max: 3 ceil(n/2) - 2), 2025 AN Q20 (an element that is not the largest: 1),
 * 2026 AN Q38 (checking strictly increasing differences: Theta(n)), 2019 FN Q61 (median of medians: O(n^2)), 2021 AN Q31 (binary search Theta(log n)).
 * Programs compiled and run with gcc: 435 swaps; 3 void merges; the partition of 8 3 9 1 6 2 7 5 around 5; 5 probes.
 */
export const chapterA2: Topic = {
  id: "cs.algo.v2.sort2",
  title: "Searching and sorting",
  no: "A2",
  book: [
    { t: "p", text: "Searching and sorting are the oldest algorithm problems and the best training ground, because each has a small number of algorithms, each with a clean cost, and each question in the paper asks you to **trace one by hand or to state its cost**. This chapter covers linear and binary search, the three elementary sorts, merge sort, quicksort and heap sort, the comparison lower bound, and the small family of questions on finding the minimum, the maximum and the median." },
    { t: "p", text: "Almost every question here is one of three kinds: **count an operation** (swaps, comparisons, merges, probes) on a given input; **state a complexity** for a clever twist (a bitonic array, a check on differences, the median of medians); or **trace a partition or a merge** and read off a position. The worked questions below cover all three." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["search a sorted array by halving and state the worst-case number of probes;", "count the swaps and comparisons of bubble, selection and insertion sort, using inversions;", "trace merge sort and quicksort, including the partition step;", "state best, worst and average cost, stability and in-place use of the standard sorts;", "explain why no comparison sort beats n log n, and what counting and radix sort do instead;", "solve the minimum-and-maximum and selection questions."] },

    { t: "h2", text: "Searching" },
    { t: "p", text: "**Linear search** looks at the elements one after the other until it finds the key or runs out. It works on any array, needs no order, and in the worst case compares the key with all n elements: Θ(n). **Binary search** needs a **sorted** array. It compares the key with the middle element; if they match it stops, otherwise it discards the half that cannot contain the key and repeats on the other half. Each probe halves the number of candidates, so the worst case is about log₂ n probes: Θ(log n)." },
    { t: "p", text: "The recurrence is T(n) = T(n/2) + 1, with the single comparison as the work outside the call, and it solves to Θ(log n). The number of arithmetic operations is also Θ(log n), since each round computes one midpoint; this is the GATE 2021 question, which asks about arithmetic operations rather than comparisons and has the same answer. The exact worst case for an array of n elements is ⌊log₂ n⌋ + 1 probes." },
    { t: "p", text: "Binary search is not limited to finding a key. Whenever you can answer 'is the answer to the left or to the right of this point?' with one probe, you can halve the range. **Transition search** is the standard example: an array of 31 elements holds a run of 0s followed by a run of 1s, and you want the smallest index holding 1. Probe the middle: a 0 means the transition is to the right, a 1 means it is at or to the left. There are 32 possible answers (the first 1 can be at any of the 31 indices, or there may be none), and each probe at best halves the possibilities, so ⌈log₂ 32⌉ = 5 probes are needed and enough." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int candidates = 32, probes = 0;            /* 31 places for the first 1, plus "there is none" */
    while (candidates > 1) {
        candidates = (candidates + 1) / 2;      /* a probe keeps at most the larger half */
        probes++;
    }
    printf("%d\\n", probes);
    return 0;
}`, out: "5", file: "transition_probes.c" },
    { t: "ex", id: "a2-e1" },
    { t: "p", text: "**Bitonic search** adds one more twist. A bitonic array rises to a peak and then falls. You cannot binary-search it directly, but you can find the peak by binary search: compare A[mid] with A[mid + 1]; if the array is still rising the peak is to the right, otherwise to the left. That takes Θ(log n) probes. Then binary-search the increasing part and the decreasing part, each in Θ(log n). The total is Θ(log n) comparisons, which is GATE 2025's answer D." },
    { t: "fig", id: "a2-f1" },
    { t: "ex", id: "a2-e2" },
    { t: "callout", kind: "key", text: "Linear search: Θ(n), any array. Binary search: Θ(log n), sorted array only. Any question that lets you throw away half the candidates with one test is a binary search in disguise." },

    { t: "h2", text: "The three elementary sorts" },
    { t: "p", text: "Sorting rearranges n elements into increasing order. Three simple sorts all take Θ(n²) in the worst case, and the paper asks about their **counts** rather than their code, so know exactly what each one does." },
    { t: "p", text: "**Bubble sort** makes passes over the array. In each pass it compares neighbouring elements and swaps them if they are out of order, so the largest remaining element 'bubbles' to the end. After pass i the last i elements are in their final places. **Selection sort** finds the smallest element of the unsorted part and swaps it to the front: it makes about n²/2 comparisons whatever the input, but at most n − 1 swaps. **Insertion sort** takes each element in turn and slides it left into its place among the elements already sorted, as when sorting a hand of cards." },
    { t: "p", text: "The key to counting is the **inversion**: a pair of positions i < j with A[i] > A[j], that is, a pair in the wrong order. A sorted array has 0 inversions and a reversed array of n distinct elements has the maximum, n(n − 1)/2. Every swap of two **adjacent** elements removes exactly one inversion, so bubble sort makes exactly as many swaps as there are inversions, and insertion sort makes exactly that many shifts. That one fact answers most counting questions." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[30], n = 30, swaps = 0;
    for (int i = 0; i < n; i++) a[i] = n - i;               /* 30, 29, ..., 1: descending */
    for (int i = 0; i <= n - 2; i++)
        for (int j = 0; j <= n - i - 2; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                swaps++;
            }
    printf("%d\\n", swaps);
    return 0;
}`, out: "435", file: "bubble_swaps.c" },
    { t: "p", text: "This program is GATE 2025's function. For a descending array every pair is inverted, so there are 30 · 29 / 2 = 435 inversions and therefore 435 swaps. Equivalently, pass 0 makes 29 swaps, pass 1 makes 28, and so on down to 1: 29 + 28 + … + 1 = 435. The comparisons are the same 435 here, and in general bubble sort as written makes n(n − 1)/2 comparisons on every input, however sorted." },
    { t: "ex", id: "a2-e3" },
    { t: "table", head: ["Sort", "Best", "Worst", "Comparisons / swaps", "Stable", "In place"], rows: [
      ["Bubble (as above)", "Θ(n²)", "Θ(n²)", "n(n−1)/2 comparisons; swaps = inversions", "yes", "yes"],
      ["Selection", "Θ(n²)", "Θ(n²)", "n(n−1)/2 comparisons; at most n−1 swaps", "no", "yes"],
      ["Insertion", "Θ(n)", "Θ(n²)", "comparisons ≈ inversions + n − 1", "yes", "yes"],
    ], caption: "The elementary sorts. Insertion sort is the only one that is fast on an already sorted array (it is adaptive)." },
    { t: "p", text: "Two properties appear in the table. A sort is **stable** if equal keys keep their original order, which matters when sorting records by one field after another. It is **in place** if it uses only a constant amount of extra memory beyond the array. Insertion sort being adaptive is why it beats the Θ(n log n) sorts on nearly sorted input, and why a library sort uses it for tiny pieces." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Merge sort" },
    { t: "p", text: "**Merge sort** is divide and conquer in its purest form: split the array into two halves, sort each half recursively, then **merge** the two sorted halves into one sorted array. Merging two sorted lists is easy and fast: keep a finger at the front of each, repeatedly copy the smaller of the two front elements to the output, and advance that finger. Merging lists of total length n takes at most n − 1 comparisons and Θ(n) time." },
    { t: "p", text: "The recurrence is T(n) = 2T(n/2) + Θ(n). Its recursion tree has log₂ n levels, each costing Θ(n) in merging, so T(n) = Θ(n log n) in **every** case: best, worst and average. It is stable if the merge takes from the left list on ties, and it uses Θ(n) extra memory for the output, so it is not in place." },
    { t: "fig", id: "a2-f2" },
    { t: "p", text: "A merge of a sorted left list L and a sorted right list R is called **void** in GATE 2026 if the output is just L followed by R, which happens exactly when every element of L is smaller than every element of R, that is, when the **last element of L is smaller than the first element of R**. Trace the question's array [10, 7, 8, 19, 41, 35, 25, 31] in the figure: merge sort performs 7 merges, and the void ones are the merge of [8] with [19], the merge of [25] with [31], and the final merge of [7, 8, 10, 19] with [25, 31, 35, 41]. The answer is 3." },
    { t: "code", text: `#include <stdio.h>

int voids = 0;

void msort(int a[], int lo, int hi) {                  /* sorts a[lo..hi-1] */
    if (hi - lo < 2) return;
    int mid = (lo + hi) / 2;
    msort(a, lo, mid);
    msort(a, mid, hi);
    if (a[mid - 1] < a[mid]) voids++;                 /* largest of L below smallest of R */
    int tmp[16], i = lo, j = mid, k = 0;
    while (i < mid && j < hi) tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi) tmp[k++] = a[j++];
    for (k = 0; k < hi - lo; k++) a[lo + k] = tmp[k];
}

int main(void) {
    int a[8] = {10, 7, 8, 19, 41, 35, 25, 31};
    msort(a, 0, 8);
    printf("%d\\n", voids);
    return 0;
}`, out: "3", file: "void_merges.c" },
    { t: "ex", id: "a2-e4" },
    { t: "callout", kind: "key", text: "Merge sort: always Θ(n log n); stable; Θ(n) extra space. Merging n elements costs at most n − 1 comparisons. A merge is void when the last of the left list is below the first of the right list." },

    { t: "h2", text: "Quicksort" },
    { t: "p", text: "**Quicksort** also divides, but it does the hard work before the recursion rather than after. It picks a **pivot**, **partitions** the array so that every element before the pivot is no larger and every element after it is larger, which puts the pivot in its final place, and then sorts the two parts recursively. No merging is needed." },
    { t: "p", text: "The common partition (Lomuto's) takes the last element as the pivot. A boundary i marks the end of the 'small' part; a scan j moves left to right, and whenever A[j] is at most the pivot, i advances and A[i] and A[j] swap. At the end the pivot swaps with A[i + 1]. The figure traces the partition of 8 3 9 1 6 2 7 5 around the pivot 5: the result is 3 1 2 5 6 9 7 8, with the pivot at index 3." },
    { t: "fig", id: "a2-f3" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[8] = {8, 3, 9, 1, 6, 2, 7, 5}, n = 8, p = a[n - 1], i = -1;
    for (int j = 0; j < n - 1; j++)
        if (a[j] <= p) {
            i++;
            int t = a[i]; a[i] = a[j]; a[j] = t;
        }
    int t = a[i + 1]; a[i + 1] = a[n - 1]; a[n - 1] = t;
    for (int k = 0; k < n; k++) printf("%d ", a[k]);
    printf("| %d\\n", i + 1);
    return 0;
}`, out: "3 1 2 5 6 9 7 8 | 3", file: "lomuto_partition.c" },
    { t: "p", text: "The cost depends on how even the split is. If the pivot lands in the middle every time, T(n) = 2T(n/2) + Θ(n) = Θ(n log n). If the pivot is always the smallest or the largest, the split is 0 and n − 1, so T(n) = T(n − 1) + Θ(n) = Θ(n²): this is the **worst case**, and with the last element as pivot it happens on an array that is already sorted or reversed. On average over random inputs, or with a **randomly chosen pivot**, the expected time is Θ(n log n), because even a split of 1 to 9 gives T(n) = T(n/10) + T(9n/10) + n, whose two fractions add up to 1 and so cost n log n." },
    { t: "p", text: "Randomisation makes the bad case a matter of luck rather than of the input. GATE 2019 asks for the probability that a uniformly random pivot is placed in the worst possible location in the first partition of 25 distinct elements. The worst locations are the two ends: the pivot is the smallest element (it lands at the first position) or the largest (the last), which are 2 of the 25 equally likely choices: 2/25 = 0.08." },
    { t: "ex", id: "a2-e5" },
    { t: "p", text: "Quicksort is **not stable** and uses only the recursion stack as extra memory (Θ(log n) on average, Θ(n) in the worst case), so it is in place. Despite its Θ(n²) worst case it is usually the fastest in practice, because its inner loop is short and works on neighbouring memory." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Heap sort, stability and the whole table" },
    { t: "p", text: "**Heap sort** builds a max-heap from the array in Θ(n), then repeatedly swaps the root (the largest) with the last element of the heap, shrinks the heap by one, and sifts the new root down in Θ(log n). That is n sift-downs of Θ(log n) each: Θ(n log n) in **every** case, in place, with no extra array. It is not stable. The heap itself is explained in Data Structures D10; the question to remember is its cost, Θ(n log n) worst case, which GATE asks directly in a matching question." },
    { t: "table", head: ["Sort", "Best", "Average", "Worst", "Stable", "Extra space"], rows: [
      ["Insertion", "n", "n²", "n²", "yes", "1"],
      ["Selection", "n²", "n²", "n²", "no", "1"],
      ["Bubble", "n²", "n²", "n²", "yes", "1"],
      ["Merge", "n log n", "n log n", "n log n", "yes", "n"],
      ["Quick (last pivot)", "n log n", "n log n", "n²", "no", "log n"],
      ["Heap", "n log n", "n log n", "n log n", "no", "1"],
    ], caption: "The comparison sorts at a glance. Bubble sort 'best' is n if it stops when a pass makes no swap; as printed in GATE 2025 it always makes all passes." },
    { t: "p", text: "Which sort uses the **fewest comparisons** on a given array? It depends on the array. On an already sorted array insertion sort uses n − 1 comparisons, the least possible, while selection sort still uses n(n − 1)/2 and quicksort with a last-element pivot hits its worst case. A nearly sorted array again favours insertion sort; a random array favours merge or quick. A GATE question with a figure of an array asks exactly this, so inspect the array's order before choosing." },

    { t: "h2", text: "Why n log n is the limit, and how to beat it" },
    { t: "p", text: "A **comparison sort** learns about the input only by comparing pairs of elements. There are n! possible orders of n distinct elements, and each comparison has two outcomes, so after k comparisons the algorithm can tell apart at most 2ᵏ cases. To tell apart all n! orders it needs 2ᵏ ≥ n!, that is k ≥ log₂(n!) = Θ(n log n). So **no comparison sort can beat Ω(n log n)** in the worst case, and merge sort and heap sort are optimal." },
    { t: "p", text: "The bound holds only for comparison sorts. **Counting sort** sorts n integers from the range 0 to k without comparing them: count how many times each value occurs, turn the counts into positions, and place each element. It takes Θ(n + k) and is stable. **Radix sort** sorts numbers digit by digit, from the least significant digit, using a stable sort such as counting sort for each digit: for d digits it takes Θ(d(n + k)). **Bucket sort** spreads uniformly distributed numbers into buckets and sorts each bucket. They are fast, but they need the keys to be integers (or uniformly spread) in a known range, so they do not contradict the lower bound." },
    { t: "callout", kind: "key", text: "Every comparison sort needs Ω(n log n) comparisons in the worst case, because n! orders need log₂(n!) = Θ(n log n) yes/no answers. Counting sort breaks the bound by not comparing: Θ(n + k) for keys in 0..k." },

    { t: "h2", text: "Minimum, maximum and the median" },
    { t: "p", text: "Finding the **largest** element of n takes n − 1 comparisons, and no algorithm can do better, since each of the other n − 1 elements must lose at least one comparison. Finding the largest and the smallest **together** by two separate scans costs 2(n − 1) = 2n − 2 comparisons. The pairing trick does better: take the elements two at a time, compare the two with each other (one comparison), compare the larger with the running maximum and the smaller with the running minimum (two more). That is three comparisons per pair, 3⌈n/2⌉ − 2 in total, which is the best possible. GATE 2021's choice 'above n and at most 3⌈n/2⌉' is this statement." },
    { t: "ex", id: "a2-e6" },
    { t: "p", text: "The **second-largest** and the **k-th smallest** are selection problems. Sorting solves them in Θ(n log n). A clever algorithm solves them in Θ(n) worst case (the median of medians) and the randomised Quickselect in Θ(n) on average: partition around a pivot as in quicksort, then recurse into only the side that contains the k-th element. A smaller special case is the question 'find any element that is not the largest': compare any two elements, and the smaller of the two is certainly not the largest. One comparison is enough, which is GATE 2025's answer." },
    { t: "p", text: "Two Θ(n) questions deserve their own notes. To decide whether an array satisfies 'all consecutive differences are strictly increasing' (GATE 2026), you must check A[i + 1] − A[i] > A[i] − A[i − 1] for every i; the condition for all pairs i > j follows from the consecutive checks by chaining. A single missed element could break the property, so every element must be read, and the answer is Θ(n). And for the **median of medians** of n unsorted arrays of n elements (GATE 2019): finding the median of one array takes O(n) with the linear selection algorithm, doing this for all n arrays takes O(n²), and finding the median of the n medians takes O(n) more. The total is O(n²), and it is also Ω(n²) since every one of the n² elements must be read." },
    { t: "ex", id: "a2-e7" },
    { t: "ex", id: "a2-e8" },
    { t: "p", text: "A last remark on using the right tool. If the question says 'sorted', think binary search; if it says 'unsorted', think linear scan, partition or selection. If it asks for a **bound on the best algorithm**, argue both ways: show an algorithm that achieves it, then show why fewer steps cannot work, as in the 'every element must be read' arguments above." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Binary search on a sorted array: ⌊log₂ n⌋ + 1 probes, Θ(log n); a transition among 31 items needs 5 probes.", "Inversions = swaps of bubble sort = shifts of insertion sort; a descending array of n has n(n−1)/2.", "Merge sort: Θ(n log n) always, stable, Θ(n) extra space; a merge is void when the last of L is below the first of R.", "Quicksort: Θ(n²) worst case (sorted input with a last-element pivot), Θ(n log n) on average; random pivot in the worst place has probability 2/n.", "Heap sort: Θ(n log n) always, in place, not stable. Comparison sorting needs Ω(n log n); counting sort is Θ(n + k).", "Min and max together: 3⌈n/2⌉ − 2 comparisons; any element that is not the largest: 1 comparison."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a2-f1", caption: "A bitonic array rises to a peak and then falls. Binary search finds the peak by comparing A[mid] with A[mid + 1], then each side is an ordinary sorted array.", alt: "A row of eleven numbers rising from 2 to 19 then falling to 1, with the peak 19 highlighted.", fig: { kind: "array", title: "Bitonic array: peak at index 5", data: [[2, 5, 8, 12, 15, 19, 14, 9, 6, 3, 1]], base: 0, size: 1, index: true, tones: { "0,5": "hl", "0,0": "ok", "0,1": "ok", "0,2": "ok", "0,3": "ok", "0,4": "ok", "0,6": "dim", "0,7": "dim", "0,8": "dim", "0,9": "dim", "0,10": "dim" } } },
    { type: "figure", id: "a2-f2", caption: "Merge sort on the array of GATE 2026. The seven merges are the seven internal nodes; the three void ones are the merge of 8 with 19, of 25 with 31 and the final merge.", alt: "A tree: the array of eight numbers splits into halves of four and then pairs, and merges back up with the sorted results shown.", fig: { kind: "calltree", title: "Merge sort of 10 7 8 19 41 35 25 31", root: { label: "10 7 8 19 41 35 25 31", ret: "7 8 10 19 25 31 35 41 (void)", kids: [
      { label: "10 7 8 19", ret: "7 8 10 19", kids: [{ label: "10 7", ret: "7 10", kids: [{ label: "10" }, { label: "7" }] }, { label: "8 19", ret: "8 19 (void)", kids: [{ label: "8" }, { label: "19" }] }] },
      { label: "41 35 25 31", ret: "25 31 35 41", kids: [{ label: "41 35", ret: "35 41", kids: [{ label: "41" }, { label: "35" }] }, { label: "25 31", ret: "25 31 (void)", kids: [{ label: "25" }, { label: "31" }] }] },
    ] } } },
    { type: "figure", id: "a2-f3", caption: "Partition of 8 3 9 1 6 2 7 5 around the pivot 5 (Lomuto, last element). i marks the end of the small part; the last row puts the pivot at index 3.", alt: "A trace table with one row per scan step j showing the array and the value of i, ending with the pivot swapped into index 3.", fig: { kind: "trace", title: "Lomuto partition, pivot 5", cols: ["j", "array", "i"], rows: [
      { cells: ["start", "8 3 9 1 6 2 7 5", -1] },
      { cells: [0, "8 3 9 1 6 2 7 5", -1], note: "8 > 5: skip" },
      { cells: [1, "3 8 9 1 6 2 7 5", 0], changed: [1, 2], note: "3 ≤ 5: swap with A[0]" },
      { cells: [2, "3 8 9 1 6 2 7 5", 0], note: "9 > 5" },
      { cells: [3, "3 1 9 8 6 2 7 5", 1], changed: [1, 2], note: "1 ≤ 5" },
      { cells: [4, "3 1 9 8 6 2 7 5", 1], note: "6 > 5" },
      { cells: [5, "3 1 2 8 6 9 7 5", 2], changed: [1, 2], note: "2 ≤ 5" },
      { cells: [6, "3 1 2 8 6 9 7 5", 2], note: "7 > 5" },
      { cells: ["end", "3 1 2 5 6 9 7 8", 2], changed: [1], tone: "ok", note: "swap pivot with A[i + 1]: index 3" },
    ] } },

    { type: "example", id: "a2-e1", level: "gate", title: "GATE CS 2017 (forenoon), Q45 · 2 marks · NAT: the first 1 in a run of 0s then 1s", file: "gate2017_fn_q45.txt", given: `A is an array of 31 numbers: a sequence of 0s followed by a sequence of 1s. Find the smallest index i such that A[i] is 1 by probing the minimum number of locations. The worst-case number of probes of an optimal algorithm?`, find: "The worst-case number of probes.", steps: [
      { say: "The answer is one of 32 things: the first 1 is at one of the 31 indices, or there is no 1.", result: "32 possibilities" },
      { say: "Each probe has two outcomes, so after k probes at most 2ᵏ possibilities are told apart. We need 2ᵏ ≥ 32.", result: "k ≥ 5" },
      { say: "Binary search achieves it: probing the middle halves the candidates each time.", result: "5" },
    ], answer: "5", check: "The program in this chapter halves 32 candidates and prints 5." },
    { type: "example", id: "a2-e2", level: "gate", title: "GATE CS 2025 (afternoon), Q41 · 2 marks · searching a bitonic array", file: "gate2025_an_q41.txt", given: `A bitonic array has A[1..i] non-decreasing and A[i+1..n] non-increasing. The best possible worst-case number of comparisons to search for an element?
A) Θ(n)   B) Θ(1)   C) Θ(log² n)   D) Θ(log n)`, find: "The best bound.", steps: [
      { say: "Find the peak: compare A[mid] with A[mid + 1]. If A[mid] < A[mid + 1] the peak is to the right, otherwise to the left. This halves the range each time.", result: "Θ(log n)" },
      { say: "Binary search the increasing part, then the decreasing part (reverse the comparison). Each is Θ(log n).", result: "Θ(log n)" },
      { say: "Total: three phases of Θ(log n) is still Θ(log n). The answer is not Θ(log² n): the phases are added, not multiplied.", result: "Θ(log n)" },
    ], answer: "D", check: "The phases run one after another, so the costs add." },
    { type: "example", id: "a2-e3", level: "gate", title: "GATE CS 2025 (forenoon), Q33 · 1 mark · NAT: swaps of a bubble sort", file: "gate2025_fn_q33.txt", given: `for i = 0 to n−2
    for j = 0 to n−i−2
        if (A[j] > A[j+1]) swap A[j] and A[j+1]
A[0..29] holds 30 distinct integers in descending order. The number of swaps?`, find: "The number of swaps.", steps: [
      { say: "In a descending array every pair is out of order: all 30·29/2 pairs are inversions.", result: "435 inversions" },
      { say: "Each swap of neighbours removes exactly one inversion, and the sort ends with none, so the swaps equal the inversions.", result: "435" },
    ], answer: "435", check: "Pass by pass: 29 + 28 + … + 1 = 435. The program in this chapter prints 435." },
    { type: "example", id: "a2-e4", level: "gate", title: "GATE CS 2026 (afternoon), Q32 · 1 mark · NAT: void merges", file: "gate2026_an_q32.txt", given: `Merge sort on A = [10, 7, 8, 19, 41, 35, 25, 31]; 7 merges are made. A merge of sorted L and R is void if the output is the elements of L followed by those of R. The number of void merges?`, find: "The number of void merges.", steps: [
      { say: "Bottom level: [10]+[7] not void (10 > 7); [8]+[19] void; [41]+[35] not void; [25]+[31] void.", result: "2 void" },
      { say: "Next level: [7, 10]+[8, 19]: last of L is 10 > 8, not void. [35, 41]+[25, 31]: 41 > 25, not void.", result: "0 void" },
      { say: "Top: [7, 8, 10, 19]+[25, 31, 35, 41]: 19 < 25, void.", result: "1 void" },
    ], answer: "3", check: "The program in this chapter prints 3." },
    { type: "example", id: "a2-e5", level: "gate", title: "GATE CS 2019 (forenoon), Q31 · 1 mark · NAT: probability of the worst location", file: "gate2019_fn_q31.txt", given: `An array of 25 distinct elements is sorted by quicksort, the pivot chosen uniformly at random. The probability that the pivot is placed in the worst possible location in the first partitioning round, rounded to 2 decimals?`, find: "The probability.", steps: [
      { say: "The pivot lands at the position given by its rank. The worst locations are the two ends: rank 1 (first position) and rank 25 (last), giving splits 0 and 24.", result: "2 bad ranks of 25" },
      { say: "Each rank is equally likely: 2/25.", result: "0.08" },
    ], answer: "0.08", check: "A split into 0 and 24 is the only kind that costs a full extra n at every level." },
    { type: "example", id: "a2-e6", level: "gate", title: "GATE CS 2021 (forenoon), Q30 · 1 mark · the least number of comparisons for min and max", file: "gate2021_fn_q30.txt", given: `t is the lowest upper bound on the comparisons needed to find the minimum and maximum of an arbitrary array of n elements.
A) t > 2n − 2   B) t > 3⌈n/2⌉ and t ≤ 2n − 2   C) t > n and t ≤ 3⌈n/2⌉   D) t > ⌈log₂ n⌉ and t ≤ n`, find: "The correct statement.", steps: [
      { say: "Pairing trick: one comparison inside each pair, then the larger against the max and the smaller against the min: 3 comparisons per pair.", result: "about 3n/2" },
      { say: "Exactly t = 3⌈n/2⌉ − 2, and this is optimal.", result: "t = 3⌈n/2⌉ − 2" },
      { say: "Check C: is t > n? For n = 8, t = 10 > 8. And t ≤ 3⌈n/2⌉ clearly holds.", result: "C" },
    ], answer: "C", check: "n = 4: t = 4 comparisons (two pair comparisons, then max and min among the winners); 3⌈4/2⌉ − 2 = 4." },
    { type: "example", id: "a2-e7", level: "gate", title: "GATE CS 2026 (afternoon), Q38 · 2 marks · checking that every difference grows", file: "gate2026_an_q38.txt", given: `A[1..n]. Check whether for all i > j in 1..n−1, (A[i+1] − A[i]) > (A[j+1] − A[j]). The worst-case time of the fastest algorithm?
A) Θ(n)   B) Θ(log n)   C) Θ(n log n)   D) Θ(n²)`, find: "The complexity.", steps: [
      { say: "The condition over all pairs i > j is equivalent to the consecutive check A[i+1] − A[i] > A[i] − A[i−1] for every i from 2 to n − 1: if each difference exceeds its predecessor, the differences are strictly increasing.", result: "n − 2 checks" },
      { say: "Every element of A can change the answer, so any algorithm must read all n of them: Ω(n). One scan suffices: O(n).", result: "Θ(n)" },
    ], answer: "A", check: "Binary search does not apply: a violation can hide anywhere." },
    { type: "example", id: "a2-e8", level: "gate", title: "GATE CS 2019 (forenoon), Q61 · 2 marks · the median of the medians of n arrays", file: "gate2019_fn_q61.txt", given: `n unsorted arrays A1..An, n odd, each with n distinct elements, no element common to two arrays. The worst-case time to compute the median of the medians?
A) O(n)   B) O(n log n)   C) O(n²)   D) Ω(n² log n)`, find: "The worst-case time.", steps: [
      { say: "The median of one unsorted array of n elements takes O(n) by the linear selection algorithm. Doing it for all n arrays: n · O(n) = O(n²).", result: "O(n²)" },
      { say: "The median of the n medians takes O(n) more, which is smaller.", result: "total O(n²)" },
      { say: "All n² elements must be read, so the bound is tight; D claims too much, since n² log n is not needed.", result: "C" },
    ], answer: "C", check: "Sorting each array would cost n · n log n, which is where D tempts you." },

    { type: "trap", wrong: "Bubble sort makes about n² / 2 swaps on every input.", tempting: "It has two nested loops and compares n(n − 1)/2 pairs.", whyWrong: "The number of COMPARISONS is n(n − 1)/2, but the number of SWAPS equals the number of inversions: 0 for a sorted array, n(n − 1)/2 only for a reversed one.", rule: "Swaps of adjacent elements = inversions.", ex: { text: "A = 2 1 3 4 5: one inversion, so one swap, though the loops compare 10 pairs." } },
    { type: "trap", wrong: "Quicksort is Θ(n log n) in the worst case.", tempting: "It is the fastest sort in practice and Θ(n log n) on average.", whyWrong: "With a fixed pivot (the last element) an already sorted array gives splits 0 and n − 1 every time: T(n) = T(n − 1) + n = Θ(n²). The average is n log n; the worst case is n².", rule: "Quick: average n log n, worst n². Merge and heap: n log n always.", ex: { text: "Sorted input 1 2 3 4 5 with pivot = last: partitions leave 4, 3, 2, 1 elements: 4 + 3 + 2 + 1 = 10 comparisons." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2025 FN Q33 · 2025 AN Q20, Q41 · 2026 AN Q32, Q38 · 2021 FN Q30 · 2021 AN Q31 · 2019 FN Q31, Q61 · 2017 FN Q45. The question on an array shown as a picture (2021 FN Q25: which sort uses the fewest comparisons) is answered by the rule in the section on the whole table: look at how sorted the array is." },
    { type: "recall", cards: [
      { q: "Worst case of binary search?", a: "⌊log₂ n⌋ + 1 probes: Θ(log n)." },
      { q: "What is an inversion?", a: "A pair i < j with A[i] > A[j]." },
      { q: "Swaps of bubble sort on a descending array of n?", a: "n(n − 1)/2." },
      { q: "Merge of two lists totalling n elements?", a: "At most n − 1 comparisons, Θ(n)." },
      { q: "Merge sort: best, worst, space?", a: "Θ(n log n) both; Θ(n) extra space; stable." },
      { q: "When is a merge void?", a: "When the last element of L is below the first of R." },
      { q: "Quicksort worst case and when?", a: "Θ(n²): sorted or reversed input with an end pivot." },
      { q: "Probability a random pivot lands at an end?", a: "2/n." },
      { q: "Heap sort cost?", a: "Θ(n log n) always, in place, not stable." },
      { q: "Comparison-sort lower bound?", a: "Ω(n log n), from log₂(n!)." },
      { q: "Counting sort cost?", a: "Θ(n + k) for keys in 0..k; stable." },
      { q: "Min and max together?", a: "3⌈n/2⌉ − 2 comparisons." },
    ] },
    { type: "check", questions: [
      { id: "a2c1", kind: "NAT", marks: 1, q: "A sorted array has 1000 elements. What is the largest number of probes binary search can need to find a key that is present (use ⌊log₂ n⌋ + 1)?", answer: "10", solution: "⌊log₂ 1000⌋ + 1 = 9 + 1 = 10." },
      { id: "a2c2", kind: "NAT", marks: 1, q: "How many inversions does 3 1 4 2 have?", answer: "3", solution: "(3,1), (3,2), (4,2)." },
      { id: "a2c3", kind: "MCQ", marks: 1, q: "Which sort is both stable and Θ(n log n) in the worst case?", options: ["Quicksort", "Heap sort", "Merge sort", "Selection sort"], answer: "C", solution: "Merge sort." },
      { id: "a2c4", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["Insertion sort is Θ(n) on a sorted array", "Selection sort makes at most n − 1 swaps", "Quicksort with a last-element pivot is Θ(n log n) on sorted input", "Heap sort is in place"], answer: "A, B, D", solution: "C is false: sorted input is the worst case, Θ(n²)." },
      { id: "a2c5", kind: "NAT", marks: 2, q: "Merge sort merges two sorted lists of 7 and 9 elements. What is the largest number of comparisons the merge can make?", answer: "15", solution: "At most 7 + 9 − 1 = 15." },
      { id: "a2c6", kind: "NAT", marks: 2, q: "How many comparisons are needed to find the minimum and the maximum of 10 numbers by the pairing method?", answer: "13", solution: "3 · 5 − 2 = 13." },
      { id: "a2c7", kind: "MCQ", marks: 2, q: "A sorting algorithm for n numbers uses only comparisons. The least worst-case number of comparisons it can guarantee is", options: ["Θ(n)", "Θ(n log n)", "Θ(n²)", "Θ(log n)"], answer: "B", solution: "log₂(n!) = Θ(n log n)." },
      { id: "a2c8", kind: "NAT", marks: 2, q: "Partition 4 7 2 9 5 around the last element as pivot (Lomuto). At which index does the pivot end up?", answer: "2", solution: "Elements ≤ 5 are 4 and 2: two of them, so the pivot goes to index 2." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on sorting and searching", sub: "Algorithms", href: "/topics/algorithms" }, { label: "Heaps (the data structure behind heap sort)", sub: "Data Structures", href: "/study/heaps" }] },
    { type: "links", prereq: ["Asymptotics and recurrences (A1)", "Arrays (D2)", "Recursion (C8)"], usedIn: ["Divide and conquer (A4)", "Greedy (A5)"], cross: ["Data Structures: binary heaps (D10)"] },
  ],
};
