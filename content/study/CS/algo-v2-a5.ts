import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A5 "Greedy algorithms" (28 Nov 2026). The greedy idea, the exchange argument, activity selection, fractional against 0/1 knapsack, Huffman coding,
 * and the cases where greedy fails. Real GATE questions (texts from public/data/questions.json), each re-solved here:
 * 2018 FN Q58 (greedy knapsack by value-to-weight ratio: V_greedy = 44, V_opt = 60, difference 16),
 * 2021 AN Q57 (Huffman-style prefix codes for abbccdddee with the dictionary-order rule: minimum encoded length 23).
 * The questions that give their data as a picture (2017 AN Q59 Huffman probabilities, 2017 FN Q30 matching table) are covered by the method.
 * Programs compiled and run with gcc: 4 activities; 44 and 60; the Huffman cost 23; the coin example 3 against 2.
 */
export const chapterA5: Topic = {
  id: "cs.algo.v2.greedy5",
  title: "Greedy algorithms",
  no: "A5",
  book: [
    { t: "p", text: "A **greedy algorithm** builds its answer one step at a time and, at every step, takes the choice that looks best right now, never reconsidering it. It is the simplest design idea there is: no recursion, no table, often a sort followed by a single scan. When it works it is fast and short. The skill the paper tests is knowing **when it works**, because for many problems that look just like the ones where it works, it gives the wrong answer." },
    { t: "p", text: "This chapter has two jobs. The first is to teach the standard greedy algorithms, activity selection, fractional knapsack and Huffman coding, well enough to run them by hand. (Prim, Kruskal and Dijkstra are greedy too; they have their own chapters.) The second is to teach the habit of asking 'why is this choice safe?', which is the exchange argument, and the habit of looking for a counterexample, which is how the paper turns a greedy question into a trap." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["state the greedy-choice idea and prove a greedy choice safe with an exchange argument;", "run activity selection and the fractional knapsack greedy by hand;", "show by a counterexample that greedy fails for the 0/1 knapsack and for coin change with unusual coins;", "build a Huffman code, compute its cost and the code length of each symbol;", "recognise a greedy algorithm in a question and know which orders and tie-breaking rules to apply."] },

    { t: "h2", text: "The greedy idea and when it is safe" },
    { t: "p", text: "A greedy algorithm repeatedly picks the locally best option: the shortest remaining job, the cheapest edge, the item with the best value per kilogram. It never undoes a choice. This is fast, because each step is a quick decision, but it is not obviously correct: a choice that looks best now might block a better overall solution later." },
    { t: "p", text: "Two properties together make a greedy algorithm correct. The **greedy-choice property** says that some optimal solution contains the greedy first choice, so making it loses nothing. **Optimal substructure** says that after making the choice, what remains is a smaller problem of the same kind, whose optimal solution combines with the choice to give an optimal solution of the whole. If both hold, induction proves the algorithm optimal." },
    { t: "p", text: "The standard proof of the greedy-choice property is the **exchange argument**. Take any optimal solution O. If it does not contain the greedy choice g, **exchange**: swap one element of O for g and show that the result is still feasible and no worse. So there is an optimal solution containing g, and the greedy first step is safe. The argument is short, but it must name what is swapped and why the swap does not hurt. Keep this template; it will appear again for the minimum spanning tree." },
    { t: "callout", kind: "key", text: "Greedy is correct when (1) the greedy first choice is part of some optimal solution (prove by exchange) and (2) the rest is a smaller instance of the same problem. A counterexample with three or four items is enough to show greedy wrong." },

    { t: "h2", text: "Activity selection" },
    { t: "p", text: "A room is to be used for as many non-overlapping activities as possible. Each activity has a start time s and a finish time f; two activities are compatible if one finishes no later than the other starts. The greedy rule: **sort the activities by finish time, then repeatedly take the first one that is compatible with those already chosen**. Taking the activity that finishes earliest leaves the most room for the rest." },
    { t: "p", text: "Why is this safe? Let g be the activity with the earliest finish time and let O be any optimal schedule, whose first activity is x. Since g finishes no later than x, replacing x by g in O keeps the schedule free of overlap (g ends before x ended, so before the second activity starts), and it keeps the same number of activities. So some optimal schedule begins with g. The remaining activities are exactly those that start after g finishes, a smaller instance." },
    { t: "fig", id: "a5-f1" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    /* sorted by finish time */
    int s[] = {1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12};
    int f[] = {4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16};
    int last = 0, count = 0;                     /* finish time of the last chosen activity */
    for (int i = 0; i < 11; i++)
        if (s[i] >= last) { count++; last = f[i]; }
    printf("%d\\n", count);
    return 0;
}`, out: "4", file: "activity_selection.c" },
    { t: "p", text: "The figure traces it. The first activity (1, 4) is taken. (3, 5) starts at 3, before 4: skip. (0, 6): skip. (5, 7) starts at 5 ≥ 4: take. The next compatible one after finishing at 7 is (8, 11): take. After 11 the next is (12, 16): take. Four activities. Sorting by **start** time, or by **duration**, or by number of conflicts, all fail on small counterexamples, so the sort key matters." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Knapsack: where greedy works and where it fails" },
    { t: "p", text: "A thief with a bag that holds at most W kilograms must choose among items, each with a weight and a value. The **fractional** knapsack lets the thief take part of an item; the **0/1** knapsack allows only whole items, take it or leave it. The same greedy idea, **take items in decreasing order of value per kilogram**, behaves very differently in the two versions." },
    { t: "p", text: "For the **fractional** knapsack the greedy rule is optimal. Take whole items in decreasing order of ratio until the next one does not fit, then take the fraction of it that fills the bag. The exchange argument: if the best solution holds some lower-ratio material while a higher-ratio item is not fully taken, swap a kilogram of the first for a kilogram of the second; the value rises, so the best solution cannot be like that." },
    { t: "p", text: "For the **0/1** knapsack the same rule can fail, because the last item might not fit and the leftover room is wasted. GATE 2018 gives four items (weight, value): item 1 (10, 60), item 2 (7, 28), item 3 (4, 20), item 4 (2, 24), a bag of 11 kg, and no splitting. The ratios are 6, 4, 5 and 12. The greedy order is item 4 (12), item 1 (6), item 3 (5), item 2 (4)." },
    { t: "fig", id: "a5-f2" },
    { t: "p", text: "Run it. Take item 4 (2 kg, value 24), total weight 2. Item 1 weighs 10, and 2 + 10 = 12 > 11: skip. Item 3 weighs 4, and 2 + 4 = 6 ≤ 11: take, value 24 + 20 = 44. Item 2 weighs 7, and 6 + 7 = 13 > 11: skip. The greedy value is 44. But item 1 alone (10 kg) has value 60, which is better, and no combination does better than 60 (item 2 with item 3 weighs exactly 11 and is worth 48; items 4 and 2 give 52). So V_opt = 60, V_greedy = 44, and the difference is **16**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int w[] = {2, 10, 4, 7}, v[] = {24, 60, 20, 28};       /* in greedy order: ratio 12, 6, 5, 4 */
    int W = 11, used = 0, greedy = 0;
    for (int i = 0; i < 4; i++)
        if (used + w[i] <= W) { used += w[i]; greedy += v[i]; }
    int best = 0;
    for (int mask = 0; mask < 16; mask++) {                 /* every subset */
        int ww = 0, vv = 0;
        for (int i = 0; i < 4; i++) if (mask >> i & 1) { ww += w[i]; vv += v[i]; }
        if (ww <= W && vv > best) best = vv;
    }
    printf("%d %d\\n", greedy, best);
    return 0;
}`, out: "44 60", file: "knapsack_gap.c" },
    { t: "ex", id: "a5-e1" },
    { t: "p", text: "The 0/1 knapsack is solved correctly by dynamic programming (Chapter A6). The lesson is general: greedy depends on being able to **split** the last choice or to **repair** it. Where a choice is all-or-nothing, a locally best choice can fill the bag badly." },
    { t: "p", text: "Coin change shows the same thing. With coins 1, 5, 10, 25 the greedy rule 'take the largest coin that fits' is optimal. With coins 1, 3, 4 and an amount of 6, greedy takes 4 + 1 + 1 = three coins, while 3 + 3 = two coins is better. The coin system, not the algorithm, decides." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int coins[] = {4, 3, 1}, amount = 6, greedy = 0, left = amount;
    for (int i = 0; i < 3; i++) while (left >= coins[i]) { left -= coins[i]; greedy++; }
    int best = 99;                                          /* the best by trying all counts of 4s and 3s */
    for (int a = 0; a * 4 <= amount; a++)
        for (int b = 0; a * 4 + b * 3 <= amount; b++)
            if (a + b + (amount - 4 * a - 3 * b) < best) best = a + b + (amount - 4 * a - 3 * b);
    printf("%d %d\\n", greedy, best);
    return 0;
}`, out: "3 2", file: "coin_gap.c" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Huffman coding" },
    { t: "p", text: "A file of characters is stored most compactly if frequent characters get short codes and rare ones get long codes. A **prefix code** assigns each character a bit string such that no code is the beginning of another, so a stream of bits can be decoded without separators. A prefix code is a **binary tree**: each character is a leaf, the code is the path from the root (left = 0, right = 1), and the code length is the leaf's depth." },
    { t: "p", text: "The **cost** of a code is the total number of bits to store the file: the sum over characters of (frequency × code length). **Huffman's algorithm** builds the tree with the least cost greedily: put each character in a heap by frequency; repeatedly remove the two lowest-frequency nodes, make them the children of a new node whose frequency is their sum, and put the new node back; stop when one node remains. The two least frequent characters end up deepest, as siblings." },
    { t: "p", text: "GATE 2021 uses the string abbccdddee. The frequencies are a = 1, b = 2, c = 2, d = 3, e = 2: ten characters. Merge a (1) with a frequency-2 symbol, say e, to get a node of 3. The heap now holds b = 2, c = 2, d = 3 and the new node 3. Merge b and c to get 4. Merge d (3) with the new node (3) to get 6. Finally merge 4 and 6 to get 10." },
    { t: "fig", id: "a5-f3" },
    { t: "p", text: "Read off the lengths from the figure: b and c have length 2, d has length 2, and a and e have length 3. The cost is 1·3 + 2·2 + 2·2 + 3·2 + 2·3 = 3 + 4 + 4 + 6 + 6 = 23 bits. The question adds a **tie-breaking rule**: among letters of the same frequency (b, c and e all occur twice) the one earlier in the alphabet must not have a longer code than a later one. Here b (2) ≤ c (2) ≤ e (3): the rule holds, so 23 is achievable. It is also the Huffman minimum, so no assignment does better: the answer is 23." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int f[5] = {1, 2, 2, 3, 2};                  /* a b c d e */
    int n = 5, cost = 0;
    while (n > 1) {                              /* repeatedly merge the two smallest */
        int i1 = 0, i2 = -1;
        for (int i = 1; i < n; i++) if (f[i] < f[i1]) i1 = i;
        for (int i = 0; i < n; i++) if (i != i1 && (i2 < 0 || f[i] < f[i2])) i2 = i;
        int m = f[i1] + f[i2];
        cost += m;                               /* each merge adds the combined weight once */
        int lo = i1 < i2 ? i1 : i2, hi = i1 < i2 ? i2 : i1;
        f[lo] = m; f[hi] = f[n - 1]; n--;
    }
    printf("%d\\n", cost);
    return 0;
}`, out: "23", file: "huffman_cost.c" },
    { t: "p", text: "The program uses a handy fact: the cost of the Huffman code equals the **sum of the weights of all internal nodes**, because each character's frequency is counted once for every internal node above it, which is its depth. Here the internal nodes weigh 3, 4, 6 and 10, and 3 + 4 + 6 + 10 = 23." },
    { t: "ex", id: "a5-e2" },
    { t: "p", text: "For a question that gives the probabilities in a table (as in GATE 2017, 100 characters over five symbols), the method is identical: the expected length of the encoded message is 100 times the sum of probability × code length, which equals 100 times the sum of the internal node probabilities. Build the tree with the merge rule, add the internal nodes, multiply by the message length." },
    { t: "callout", kind: "key", text: "Huffman: repeatedly merge the two least frequent nodes. Cost = Σ frequency × depth = sum of all internal node weights. Ties may give different trees, but the cost is the same." },

    { t: "h2", text: "Other greedy problems, and how to recognise one" },
    { t: "p", text: "**Job sequencing with deadlines:** each job takes one unit of time, has a deadline and a profit; take jobs in decreasing profit, placing each in the latest free slot before its deadline. **Merging files:** to merge files of given sizes into one using the fewest total moves, repeatedly merge the two smallest: exactly Huffman's algorithm, where the cost of the final plan is the sum of internal weights. **Prim, Kruskal and Dijkstra:** greedy on a graph; their chapters follow." },
    { t: "p", text: "How do you know a question wants a greedy algorithm? The words 'at each step choose the', 'minimise the total', 'schedule the maximum number', 'sort by ... and take'. How do you know a given greedy rule is the right one? Test it on two or three tiny cases, and look for the exchange argument. When in doubt, search for a counterexample: a failed small case is a proof that greedy is wrong, and the paper often asks for the number such a failure costs." },

    { t: "h2", text: "Questions that come with a picture" },
    { t: "p", text: "Two more questions give their data as a picture: the table of probabilities for Huffman coding (2017) and the table that matches algorithms with design paradigms (2017). Both are solved here from the pictures." },
    { t: "ex", id: "a5-e3" },
    { t: "ex", id: "a5-e4" },
    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Greedy: make the locally best choice, never undo it; correct when the greedy choice is in some optimal solution (exchange argument) and the rest is a smaller instance.", "Activity selection: sort by FINISH time, take each activity that starts at or after the last finish. (Not by start time or by length.)", "Fractional knapsack: greedy by value per kilogram is optimal. 0/1 knapsack: greedy can fail; GATE 2018 gives greedy 44, optimal 60, difference 16.", "Coin change with 1, 3, 4: greedy gives 3 coins for 6, the best is 2.", "Huffman: merge the two least frequent; cost = Σ frequency × depth = sum of internal node weights; GATE 2021's abbccdddee costs 23.", "Merging files uses the same merge-two-smallest rule."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a5-f1", caption: "Activity selection on eleven activities sorted by finish time. The chosen ones (green) are (1, 4), (5, 7), (8, 11) and (12, 16).", alt: "A table of eleven activities with start, finish and a verdict of take or skip for each.", fig: { kind: "trace", title: "Greedy by finish time", cols: ["activity (s, f)", "start ≥ last finish?", "decision"], rows: [
      { cells: ["(1, 4)", "1 ≥ 0", "take"], tone: "ok" }, { cells: ["(3, 5)", "3 < 4", "skip"] }, { cells: ["(0, 6)", "0 < 4", "skip"] },
      { cells: ["(5, 7)", "5 ≥ 4", "take"], tone: "ok" }, { cells: ["(3, 9)", "3 < 7", "skip"] }, { cells: ["(5, 9)", "5 < 7", "skip"] }, { cells: ["(6, 10)", "6 < 7", "skip"] },
      { cells: ["(8, 11)", "8 ≥ 7", "take"], tone: "ok" }, { cells: ["(8, 12)", "8 < 11", "skip"] }, { cells: ["(2, 14)", "2 < 11", "skip"] },
      { cells: ["(12, 16)", "12 ≥ 11", "take"], tone: "ok" },
    ] } },
    { type: "figure", id: "a5-f2", caption: "The four items of GATE 2018 in greedy order. Greedy fills the bag with items 4 and 3 (value 44) and cannot fit item 1; item 1 alone is worth 60.", alt: "A table of four items with weight, value and ratio, with the greedy decision for each and the greedy total of 44 against the best of 60.", fig: { kind: "trace", title: "0/1 knapsack, bag of 11 kg", cols: ["item (kg, value)", "ratio", "bag so far", "greedy decision"], rows: [
      { cells: ["4: (2, 24)", 12, "2 kg", "take"], tone: "ok" },
      { cells: ["1: (10, 60)", 6, "2 + 10 = 12 > 11", "skip"], tone: "bad" },
      { cells: ["3: (4, 20)", 5, "2 + 4 = 6", "take"], tone: "ok" },
      { cells: ["2: (7, 28)", 4, "6 + 7 = 13 > 11", "skip"] },
      { cells: ["total", "", "", "greedy 44; best 60 (item 1 alone)"], changed: [3] },
    ] } },
    { type: "figure", id: "a5-f3", caption: "A Huffman tree for abbccdddee (a = 1, b = 2, c = 2, d = 3, e = 2). Code lengths: b 2, c 2, d 2, a 3, e 3. Cost 3 + 4 + 4 + 6 + 6 = 23, the sum of the internal nodes 3 + 4 + 6 + 10.", alt: "A binary tree with root 10, children 4 and 6; 4 has leaves b and c; 6 has leaf d and an internal node 3 with leaves a and e.", fig: { kind: "tree", title: "Internal node = sum of its children", root: { label: 10, kids: [
      { label: 4, edge: "0", kids: [{ label: "b 2", edge: "0", tone: "ok" }, { label: "c 2", edge: "1", tone: "ok" }] },
      { label: 6, edge: "1", kids: [{ label: "d 3", edge: "0", tone: "ok" }, { label: 3, edge: "1", kids: [{ label: "a 1", edge: "0", tone: "ok" }, { label: "e 2", edge: "1", tone: "ok" }] }] },
    ] } } },

    { type: "example", id: "a5-e1", level: "gate", title: "GATE CS 2018 (forenoon), Q58 · 2 marks · NAT: greedy against optimal knapsack", file: "gate2018_fn_q58.txt", given: `Items (weight kg, value Rs): 1: (10, 60), 2: (7, 28), 3: (4, 20), 4: (2, 24). One of each; bag of at most 11 kg; items cannot be split. V_opt is the best value; V_greedy is the value of the greedy algorithm that sorts by value-to-weight ratio, descending, and packs from the first. V_opt − V_greedy?`, find: "The difference.", steps: [
      { say: "Ratios: item 1 → 6, item 2 → 4, item 3 → 5, item 4 → 12. Order: 4, 1, 3, 2.", result: "4, 1, 3, 2" },
      { say: "Pack: item 4 (2 kg), item 1 would make 12 kg: skip, item 3 (4 kg) fits: total 6 kg, item 2 would make 13 kg: skip. Value 24 + 20 = 44.", result: "V_greedy = 44" },
      { say: "Best subsets within 11 kg: item 1 alone 60; items 2 + 3 = 48; items 4 + 2 = 52; items 4 + 3 = 44. The best is 60.", result: "V_opt = 60" },
    ], answer: "16", check: "The program in this chapter prints 44 60." },
    { type: "example", id: "a5-e2", level: "gate", title: "GATE CS 2021 (afternoon), Q57 · 2 marks · prefix codes for abbccdddee", file: "gate2021_an_q57.txt", given: `The string abbccdddee; each letter gets a binary code with (1) no code a prefix of another, (2) for letters of equal frequency, the earlier letter in dictionary order gets a code of length at most the later one's. The minimum length of the encoded string?
A) 21   B) 23   C) 25   D) 30`, find: "The minimum encoded length.", steps: [
      { say: "Frequencies: a 1, b 2, c 2, d 3, e 2 (ten letters).", result: "1 2 2 3 2" },
      { say: "Huffman: merge a + e = 3; b + c = 4; d + 3 = 6; 4 + 6 = 10. Internal weights 3 + 4 + 6 + 10.", result: "cost 23" },
      { say: "Lengths: b 2, c 2, d 2, a 3, e 3. Condition (2): among the frequency-2 letters b, c, e the lengths 2, 2, 3 do not decrease with the alphabet: it holds.", result: "valid" },
      { say: "Huffman's cost is the minimum over all prefix codes, so no valid code is shorter.", result: "23" },
    ], answer: "B", check: "The tempting 25 comes from giving a longer code to d; 21 would violate the Kraft inequality." },

    { type: "example", id: "a5-e3", level: "gate", title: "GATE CS 2017 (afternoon), Q59 · 2 marks · NAT: Huffman expected length of 100 characters", file: "gate2017_an_q59.txt", given: `Characters P, Q, R, S, T have probabilities 0.22, 0.34, 0.17, 0.19, 0.08 (total 1.00). A message of 100 characters over this set is Huffman-coded. The expected length of the encoded message in bits?`, find: "The expected length in bits.", steps: [
      { say: "Merge the two smallest: T 0.08 and R 0.17 give 0.25.", result: "0.25" },
      { say: "Now the smallest are S 0.19 and P 0.22: merge to 0.41.", result: "0.41" },
      { say: "Smallest now: 0.25 and Q 0.34: merge to 0.59. Finally 0.41 and 0.59 give 1.00.", result: "0.59, 1.00" },
      { say: "Expected bits per character = sum of the internal node probabilities = 0.25 + 0.41 + 0.59 + 1.00 = 2.25. Code lengths check it: Q 2, P 2, S 2, R 3, T 3: 0.34·2 + 0.22·2 + 0.19·2 + 0.17·3 + 0.08·3 = 2.25.", result: "2.25 bits" },
      { say: "For 100 characters: 100 × 2.25.", result: "225" },
    ], answer: "225", check: "The same total follows from either method: depth-weighted or internal-weight sum." },
    { type: "example", id: "a5-e4", level: "gate", title: "GATE CS 2017 (forenoon), Q30 · 1 mark · match algorithms with design paradigms", file: "gate2017_fn_q30.txt", given: `(P) Kruskal   (Q) Quicksort   (R) Floyd–Warshall      (i) Divide and Conquer   (ii) Greedy   (iii) Dynamic Programming
A) P-ii, Q-iii, R-i   B) P-iii, Q-i, R-ii   C) P-ii, Q-i, R-iii   D) P-i, Q-ii, R-iii`, find: "The correct matching.", steps: [
      { say: "Kruskal repeatedly takes the lightest edge that does not close a cycle: greedy.", result: "P → ii" },
      { say: "Quicksort partitions and recurses on the two parts: divide and conquer.", result: "Q → i" },
      { say: "Floyd–Warshall fills a table of shortest distances using intermediate vertices: dynamic programming.", result: "R → iii" },
    ], answer: "C", check: "Prim, Dijkstra and Huffman are greedy; merge sort and Strassen divide and conquer; matrix chain and LCS dynamic programming." },

    { type: "trap", wrong: "To fit the most activities, always take the activity that starts first (or the shortest one).", tempting: "Starting early or being short seems to leave the most room.", whyWrong: "An early start can be very long and block everything: (0, 100) starts first. A short activity can sit in the middle and block two others. Only the earliest FINISH is safe, by the exchange argument.", rule: "Sort by finish time.", ex: { text: "Activities (0, 100), (1, 2), (3, 4): by start time you take one, by finish time you take two." } },
    { type: "trap", wrong: "Greedy by value per kilogram is optimal for the knapsack.", tempting: "It is optimal for the fractional knapsack, and the problems look alike.", whyWrong: "With whole items only, the last item chosen may leave room unused. In GATE 2018 the greedy value is 44 while one single item is worth 60.", rule: "Fractional: greedy is optimal. 0/1: use dynamic programming.", ex: { text: "Bag 11 kg: greedy takes items worth 44; item 1 alone is worth 60." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2018 FN Q58 · 2021 AN Q57 · 2017 AN Q59 · 2017 FN Q30. Every greedy question of the bank is solved here." },
    { type: "recall", cards: [
      { q: "Two properties of a correct greedy algorithm?", a: "Greedy-choice property and optimal substructure." },
      { q: "The exchange argument?", a: "Swap an element of an optimal solution for the greedy choice without making it worse." },
      { q: "Activity selection order?", a: "By finish time, earliest first." },
      { q: "Is greedy optimal for the fractional knapsack?", a: "Yes, taking items by value per kilogram." },
      { q: "For the 0/1 knapsack?", a: "Not always; use dynamic programming." },
      { q: "Greedy coin change fails for which coins?", a: "For example 1, 3, 4 with amount 6." },
      { q: "Huffman's step?", a: "Merge the two least frequent nodes into one with the sum." },
      { q: "Cost of a Huffman code?", a: "Σ frequency × depth = the sum of the internal node weights." },
      { q: "Is a prefix code a tree?", a: "Yes: leaves are characters, code = path from the root." },
      { q: "Merging files with fewest moves?", a: "Merge the two smallest each time (Huffman)." },
    ] },
    { type: "check", questions: [
      { id: "a5c1", kind: "NAT", marks: 1, q: "Activities (1, 3), (2, 4), (3, 5), (4, 6), (5, 7), sorted by finish. How many does the greedy rule select?", answer: "3", solution: "(1,3), (3,5), (5,7)." },
      { id: "a5c2", kind: "NAT", marks: 1, q: "Characters with frequencies 5, 9, 12, 13, 16, 45. The Huffman cost (sum of internal weights)?", answer: "224", solution: "Merges: 14, 25, 30, 55, 100: 14 + 25 + 30 + 55 + 100 = 224." },
      { id: "a5c3", kind: "MCQ", marks: 1, q: "Greedy by ratio is guaranteed optimal for", options: ["0/1 knapsack", "fractional knapsack", "coin change with any coins", "longest path"], answer: "B", solution: "The fractional version." },
      { id: "a5c4", kind: "MSQ", marks: 2, q: "Which are greedy algorithms?", options: ["Kruskal's", "Huffman's", "Floyd–Warshall", "Dijkstra's"], answer: "A, B, D", solution: "Floyd–Warshall is dynamic programming." },
      { id: "a5c5", kind: "NAT", marks: 2, q: "Fractional knapsack, bag 50 kg: items (10 kg, Rs 60), (20 kg, Rs 100), (30 kg, Rs 120). The maximum value in rupees?", answer: "240", solution: "Ratios 6, 5, 4: take items 1 and 2 (30 kg, 160), then 20 of the 30 kg of item 3: 80. Total 240." },
      { id: "a5c6", kind: "NAT", marks: 2, q: "Coins 1, 3, 4; amount 9. How many coins does the greedy rule use?", answer: "3", solution: "4 + 4 + 1 = three coins; (3+3+3 also three)." },
      { id: "a5c7", kind: "MCQ", marks: 2, q: "Four files of sizes 2, 3, 4, 6 are merged pairwise with the least total cost (cost of a merge = sum of the two sizes). The total cost is", options: ["29", "30", "31", "32"], answer: "A", solution: "2+3 = 5; 4+5 = 9; 6+9 = 15: 5 + 9 + 15 = 29." },
      { id: "a5c8", kind: "NAT", marks: 2, q: "Items (weight, value): (5, 10), (4, 40), (6, 30), (3, 50); bag 10. The greedy 0/1 rule by ratio picks which total value?", answer: "90", solution: "Ratios: 2, 10, 5, 16.7. Order: (3,50), (4,40), (6,30), (5,10). Take 3 and 4 (7 kg, 90); 6 does not fit; 5 does not fit (12 > 10). Total 90." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on greedy algorithms", sub: "Algorithms", href: "/topics/algorithms" }, { label: "Dynamic programming", sub: "when greedy fails: the next chapter", href: "/study/dynamic-programming" }] },
    { type: "links", prereq: ["Searching and sorting (A2)", "Binary heaps (D10)", "Trees (D7)"], usedIn: ["Minimum spanning trees (A8)", "Shortest paths (A9)"], cross: ["Data Structures: heaps for the merge rule"] },
  ],
};
