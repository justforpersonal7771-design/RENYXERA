import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A6 "Dynamic programming" (28 Nov 2026). Recognising a DP problem (overlapping subproblems, optimal substructure), the four steps (state, transition,
 * base case, order), rod cutting, the 0/1 knapsack, longest common subsequence, longest non-decreasing subsequence, matrix-chain multiplication and the order of filling a table.
 * Real GATE questions (texts from public/data/questions.json), each re-solved here:
 * 2021 FN Q17 (rod cutting R7 = 18, achieved by three solutions: A and C), 2024 AN Q11 (distance to a sorted array: n - LNDS = 3),
 * 2018 FN Q41 (matrix chain F1..F5: parenthesization (F1(F2(F3F4)))F5, only F3F4 is an explicitly computed pair, cost 2173), 2026 AN Q39 (both fill orders B1 and B2 are correct).
 * Programs compiled and run with gcc: 18; 60; 4 and 3; 2173; LCS 4; 1349 1349.
 */
export const chapterA6: Topic = {
  id: "cs.algo.v2.dp6",
  title: "Dynamic programming",
  no: "A6",
  book: [
    { t: "p", text: "**Dynamic programming** (DP) solves a problem by breaking it into smaller subproblems, solving each smaller problem **once**, writing the answer in a table, and building the answer to the big problem from the table. It is divide and conquer with a memory. It is the technique to reach for when a problem asks for the best of exponentially many choices, and a plain recursion would solve the same small problem again and again." },
    { t: "p", text: "In the paper dynamic programming appears in two ways: **run the table by hand** (rod cutting, matrix-chain multiplication, a longest subsequence) and **reason about the table** (which order of filling is correct, which entries a cell depends on). This chapter teaches the standard problems with their tables, each solved on a real GATE question." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["decide whether a problem has overlapping subproblems and optimal substructure;", "define the state, the transition, the base case and the order of filling for a DP;", "fill the tables of rod cutting, 0/1 knapsack, longest common subsequence and matrix-chain multiplication by hand;", "turn 'minimum replacements to sort' into a longest non-decreasing subsequence;", "check whether a given loop order fills a table correctly."] },

    { t: "h2", text: "When a problem needs dynamic programming" },
    { t: "p", text: "Two properties mark a DP problem. **Optimal substructure:** an optimal solution to the whole problem is built from optimal solutions to subproblems. **Overlapping subproblems:** the same subproblem is needed by many different larger problems, so solving it once and remembering the answer saves work." },
    { t: "p", text: "The standard example is the Fibonacci number, F(n) = F(n − 1) + F(n − 2). The plain recursion makes about 1.6ⁿ calls, because F(n − 2) is computed once on its own and again inside F(n − 1), and so on all the way down. There are only n + 1 different subproblems, F(0) to F(n). Store each value when first computed (**memoisation**, top-down) or compute them in order from the bottom (**tabulation**, bottom-up), and the cost falls to Θ(n)." },
    { t: "p", text: "Compare with divide and conquer: merge sort's subproblems are disjoint halves, never repeated, so no table helps. Compare with greedy: greedy needs no table because one choice is provably safe. When a choice is not provably safe, **try all the choices and keep the best**, but do it through a table so that no subproblem is solved twice. That is DP." },
    { t: "callout", kind: "key", text: "DP = optimal substructure + overlapping subproblems. Cost = (number of table cells) × (work to fill one cell)." },

    { t: "h2", text: "The four steps" },
    { t: "p", text: "Every DP solution is designed in the same four steps, and a GATE question gives you some of them and asks for the rest." },
    { t: "ol", items: ["**State:** what does one table cell mean? (For rod cutting: R[n], the best income from a rod of length n.)", "**Transition:** how is a cell computed from smaller cells? (R[n] is the maximum over the first piece i of p[i] + R[n − i].)", "**Base case:** the cells that need no computing (R[0] = 0).", "**Order:** fill the cells so that every cell is computed after the cells it depends on. The answer is the cell for the whole problem."] },
    { t: "p", text: "The cost of a DP is the number of cells multiplied by the work per cell. Rod cutting has n cells with up to n choices each: Θ(n²). The 0/1 knapsack has n × W cells with 2 choices each: Θ(nW). Longest common subsequence has m × n cells at constant work: Θ(mn). Matrix chain has n² cells with up to n choices each: Θ(n³)." },

    { t: "h2", text: "Rod cutting" },
    { t: "p", text: "A rod of length n can be cut into pieces of integer lengths, and a piece of length i sells for p[i]. Find the cut with the greatest total income. With the prices p[1..7] = 1, 5, 8, 9, 10, 17, 18 of GATE 2021, what is the income R₇ for a rod of length 7, and how many different cuttings achieve it?" },
    { t: "p", text: "State: R[k] is the best income for length k. Transition: R[k] = max over i from 1 to k of p[i] + R[k − i]: sell a first piece of length i and cut the rest optimally. Base: R[0] = 0. Fill k = 1, 2, …, 7, as in the figure. R[1] = 1; R[2] = max(1 + 1, 5) = 5; R[3] = max(1 + 5, 5 + 1, 8) = 8; R[4] = max(1 + 8, 5 + 5, 8 + 1, 9) = 10 (two pieces of 2); R[5] = 13 (a piece of 2 and a piece of 3); R[6] = 17 (the whole rod); R[7] = max(1 + 17, 5 + 13, 8 + 10, 9 + 8, 10 + 5, 17 + 1, 18) = 18." },
    { t: "fig", id: "a6-f1" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int p[8] = {0, 1, 5, 8, 9, 10, 17, 18}, R[8] = {0};
    for (int k = 1; k <= 7; k++)
        for (int i = 1; i <= k; i++)
            if (p[i] + R[k - i] > R[k]) R[k] = p[i] + R[k - i];
    printf("%d\\n", R[7]);
    return 0;
}`, out: "18", file: "rod_cutting.c" },
    { t: "p", text: "The income is R₇ = 18. Which cuttings give 18? Three: the whole rod (18), a piece of 6 and a piece of 1 (17 + 1), and two pieces of 2 with one of 3 (5 + 5 + 8). So the statement 'R₇ is achieved by three different solutions' is true, 'R₇ = 19' is false, and 'R₇ cannot be achieved with three pieces' is false since 2 + 2 + 3 has three pieces. The true statements are R₇ = 18 and the three solutions." },
    { t: "ex", id: "a6-e1" },
    { t: "trap", i: 1 },

    { t: "h2", text: "The 0/1 knapsack" },
    { t: "p", text: "In the greedy chapter the 0/1 knapsack defeated the ratio rule. DP solves it exactly. State: K[i][w] is the best value using only the first i items with a bag of capacity w. Transition: either item i is left out, K[i − 1][w], or taken (if its weight allows), value[i] + K[i − 1][w − weight[i]]; take the larger. Base: K[0][w] = 0. The table has n × W cells with constant work each: Θ(nW)." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int wt[5] = {0, 10, 7, 4, 2}, val[5] = {0, 60, 28, 20, 24}, K[5][12] = {{0}};
    for (int i = 1; i <= 4; i++)
        for (int w = 0; w <= 11; w++) {
            K[i][w] = K[i - 1][w];                                     /* leave item i out */
            if (wt[i] <= w && val[i] + K[i - 1][w - wt[i]] > K[i][w])
                K[i][w] = val[i] + K[i - 1][w - wt[i]];                /* or take it */
        }
    printf("%d\\n", K[4][11]);
    return 0;
}`, out: "60", file: "knapsack_dp.c" },
    { t: "p", text: "On the items of GATE 2018 (weights 10, 7, 4, 2; values 60, 28, 20, 24; bag 11) the table's last cell is 60, the true optimum that greedy missed. A careful reader notes that Θ(nW) is not polynomial in the **size of the input**, since W is written in about log W bits; this is why the problem is called pseudo-polynomial. For GATE you only need the formula." },

    { t: "h2", text: "Longest common subsequence" },
    { t: "p", text: "A **subsequence** of a string keeps some of its characters in order, with gaps allowed; BCBA is a subsequence of ABCBDAB. The **longest common subsequence** (LCS) of two strings is the longest string that is a subsequence of both. State: L[i][j] is the LCS length of the first i characters of X and the first j of Y. Transition: if X[i] = Y[j], then L[i][j] = L[i − 1][j − 1] + 1; otherwise L[i][j] = max(L[i − 1][j], L[i][j − 1]). Base: L[0][j] = L[i][0] = 0." },
    { t: "fig", id: "a6-f2" },
    { t: "p", text: "The figure shows the table for X = ABCBDAB and Y = BDCABA. The bottom-right cell is 4: the LCS has length 4 (BCBA is one of them). The table has m × n cells, constant work each: Θ(mn). To recover a longest subsequence itself, walk back from the corner: a diagonal step where the characters matched, otherwise to the larger neighbour." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    char *x = "ABCBDAB", *y = "BDCABA";
    int m = strlen(x), n = strlen(y), L[8][7] = {{0}};
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (x[i - 1] == y[j - 1]) L[i][j] = L[i - 1][j - 1] + 1;
            else L[i][j] = L[i - 1][j] > L[i][j - 1] ? L[i - 1][j] : L[i][j - 1];
    printf("%d\\n", L[m][n]);
    return 0;
}`, out: "4", file: "lcs.c" },

    { t: "h2", text: "Longest non-decreasing subsequence and the distance to sorted" },
    { t: "p", text: "A **longest non-decreasing subsequence** (LNDS) of an array is the longest subsequence whose values never decrease. State: L[i] is the length of the longest one **ending at position i**. Transition: L[i] = 1 + max(L[j]) over earlier positions j with A[j] ≤ A[i] (or 1 if there is none). The answer is the largest L[i]. There are n cells and up to n predecessors each: Θ(n²) (a cleverer method gives Θ(n log n))." },
    { t: "p", text: "GATE 2024 defines the **distance** of an array as the least number of elements that must be replaced by other integers to make the array sorted in non-decreasing order. The elements you do **not** replace must already be in non-decreasing order, so they form a non-decreasing subsequence; the more you keep, the fewer you replace. And any non-decreasing subsequence can be kept: the replaced elements can be given values that fit in between, since any integer is allowed. So the distance is n minus the length of the LNDS." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[7] = {2, 5, 3, 1, 4, 2, 6}, L[7], best = 0;
    for (int i = 0; i < 7; i++) {
        L[i] = 1;                                         /* a subsequence of just a[i] */
        for (int j = 0; j < i; j++)
            if (a[j] <= a[i] && L[j] + 1 > L[i]) L[i] = L[j] + 1;
        if (L[i] > best) best = L[i];
    }
    printf("%d %d\\n", best, 7 - best);
    return 0;
}`, out: "4 3", file: "lnds_distance.c" },
    { t: "p", text: "For the array [2, 5, 3, 1, 4, 2, 6] the table is L = 1, 2, 2, 1, 3, 2, 4, and the longest non-decreasing subsequence has length 4 (for example 2, 3, 4, 6). The distance is 7 − 4 = 3. The three elements that are replaced are 5, 1 and 2, and they can be given the values 2, 3 and 3, for instance, giving 2, 2, 3, 3, 4, 4, 6." },
    { t: "ex", id: "a6-e2" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Matrix-chain multiplication" },
    { t: "p", text: "Multiplying a p × q matrix by a q × r matrix takes pqr scalar multiplications and gives a p × r matrix. Matrix multiplication is associative, so a chain F₁F₂…Fₙ can be parenthesised in many ways with very different costs. The problem is to find the cheapest. The dimensions are given as an array d, with matrix Fᵢ of size d[i − 1] × d[i]." },
    { t: "p", text: "State: M[i][j] is the cheapest cost of computing the product Fᵢ…Fⱼ. Transition: choose the last split point k, between i and j − 1: the product is (Fᵢ…Fₖ)(Fₖ₊₁…Fⱼ), costing M[i][k] + M[k + 1][j] + d[i − 1]·d[k]·d[j]; take the smallest over k. Base: M[i][i] = 0. The table has about n²/2 cells, each with up to n choices: Θ(n³). It is filled by **increasing chain length**, because a long chain depends on shorter ones." },
    { t: "p", text: "GATE 2018 has five matrices with dimensions 2 × 25, 25 × 3, 3 × 16, 16 × 1 and 1 × 1000, so d = [2, 25, 3, 16, 1, 1000]. Fill the table by chain length. The cheapest cost is 2173, with the parenthesization ((F₁(F₂(F₃F₄)))F₅): first F₃F₄ (3 × 16 × 1 = 48 multiplications, giving a 3 × 1 matrix), then F₂ by that result (25 × 3 × 1 = 75, giving 25 × 1), then F₁ by that (2 × 25 × 1 = 50, giving 2 × 1), then by F₅ (2 × 1 × 1000 = 2000). The total is 48 + 75 + 50 + 2000 = 2173." },
    { t: "fig", id: "a6-f3" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int d[6] = {2, 25, 3, 16, 1, 1000}, M[6][6] = {{0}};
    for (int len = 2; len <= 5; len++)                     /* chain length */
        for (int i = 1; i + len - 1 <= 5; i++) {
            int j = i + len - 1;
            M[i][j] = 1 << 30;
            for (int k = i; k < j; k++) {
                int c = M[i][k] + M[k + 1][j] + d[i - 1] * d[k] * d[j];
                if (c < M[i][j]) M[i][j] = c;
            }
        }
    printf("%d\\n", M[1][5]);
    return 0;
}`, out: "2173", file: "matrix_chain.c" },
    { t: "p", text: "The question asks for the **explicitly computed pairs**, the pairs of single matrices Fᵢ, Fᵢ₊₁ that are multiplied directly. In ((F₁(F₂(F₃F₄)))F₅) the only direct product of two original matrices is F₃F₄; the others multiply a matrix by an intermediate result. So the answer is 'F₃F₄ only'." },
    { t: "ex", id: "a6-e3" },

    { t: "h2", text: "The order of filling a table" },
    { t: "p", text: "A DP table is correct only if every cell is computed **after** the cells it depends on. Draw an arrow from each cell to the cells it needs and check that the loop order respects every arrow. Two orders are common: **row by row** (left to right inside a row) when a cell needs its neighbour above and the neighbour on its left, and **by anti-diagonals** (cells with i + j constant) when dependencies lie on the previous diagonals; the matrix chain is filled **by chain length**." },
    { t: "p", text: "GATE 2026 gives T[0][k] = T[k][0] = 1 and T[i][j] = 2T[i − 1][j] + 3T[i][j − 1], and two algorithms. B₁ fills row by row, i from 1 to n and j from 1 to n inside. B₂ loops s = 2 to 2n and fills the cells with i + j = s. Both are correct. In B₁ the cell (i, j) needs (i − 1, j), in an earlier row, and (i, j − 1), earlier in the same row, both already computed. In B₂ the cell needs two cells with sum s − 1, which belong to the previous value of s and are already filled. (B₂ is slower, as it scans all the cells for each s, but slower is not incorrect.)" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    long A[4][4], B[4][4];
    for (int i = 0; i <= 3; i++) for (int j = 0; j <= 3; j++) A[i][j] = B[i][j] = 1;
    for (int i = 1; i <= 3; i++) for (int j = 1; j <= 3; j++) A[i][j] = 2 * A[i - 1][j] + 3 * A[i][j - 1];
    for (int s = 2; s <= 6; s++)
        for (int i = 1; i <= 3; i++) for (int j = 1; j <= 3; j++)
            if (i + j == s) B[i][j] = 2 * B[i - 1][j] + 3 * B[i][j - 1];
    printf("%ld %ld\\n", A[3][3], B[3][3]);
    return 0;
}`, out: "1349 1349", file: "fill_orders.c" },
    { t: "p", text: "The program fills a 3 × 3 version both ways and both give 1349. An incorrect order would be, for example, filling column by column from the right, or a loop that goes from i = n down to 1, which would use cells not yet computed. Whenever a question asks 'is this order correct', find a cell whose dependency is not yet filled." },
    { t: "ex", id: "a6-e4" },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["DP = optimal substructure + overlapping subproblems; store each subproblem's answer once; cost = cells × work per cell.", "Four steps: state, transition, base case, order of filling.", "Rod cutting: R[k] = max over i of p[i] + R[k − i]; for the prices of GATE 2021, R₇ = 18 with three solutions (7; 6 + 1; 2 + 2 + 3).", "0/1 knapsack: K[i][w] = max(K[i − 1][w], v + K[i − 1][w − wt]); Θ(nW); gives 60 where greedy gave 44.", "LCS: match gives diagonal + 1, else the larger of up and left; Θ(mn). Distance to sorted = n − LNDS = 7 − 4 = 3.", "Matrix chain: M[i][j] = min over k of M[i][k] + M[k + 1][j] + d[i − 1]d[k]d[j]; Θ(n³); the answer 2173 with only F₃F₄ explicitly computed.", "A fill order is correct when every cell comes after its dependencies; row-by-row and anti-diagonal orders both work for T[i][j] = 2T[i−1][j] + 3T[i][j−1]."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a6-f1", caption: "Rod cutting: the table R[0..7] for the prices of GATE 2021. R[7] = 18 is reached by three cuttings.", alt: "A table of rod length k with the best first piece and the income R[k] for lengths 0 to 7.", fig: { kind: "trace", title: "R[k] = max over i of p[i] + R[k − i]", cols: ["k", "best income R[k]", "a best first piece"], rows: [
      { cells: [0, 0, "–"] }, { cells: [1, 1, "1"] }, { cells: [2, 5, "2"] }, { cells: [3, 8, "3"] },
      { cells: [4, 10, "2 (then 2)"] }, { cells: [5, 13, "2 (then 3)"] }, { cells: [6, 17, "6"] },
      { cells: [7, 18, "7, or 6 + 1, or 2 + 2 + 3"], tone: "ok", changed: [1] },
    ] } },
    { type: "figure", id: "a6-f2", caption: "The LCS table for X = ABCBDAB (rows) and Y = BDCABA (columns). The corner cell is the answer, 4.", alt: "A grid of numbers with rows for the prefixes of ABCBDAB and columns for the prefixes of BDCABA; the bottom right cell is 4.", fig: { kind: "array", title: "L[i][j]: rows A B C B D A B, columns B D C A B A", data: [
      [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 1], [0, 1, 1, 1, 1, 2, 2], [0, 1, 1, 2, 2, 2, 2], [0, 1, 1, 2, 2, 3, 3], [0, 1, 2, 2, 2, 3, 3], [0, 1, 2, 2, 3, 3, 4], [0, 1, 2, 2, 3, 4, 4],
    ], base: 0, size: 1, index: true, rowIndex: true, tones: { "7,6": "ok" } } },
    { type: "figure", id: "a6-f3", caption: "The cheapest parenthesization of F1 F2 F3 F4 F5 (GATE 2018): ((F1 (F2 (F3 F4))) F5), cost 2173. Each node shows the size of the matrix it produces.", alt: "A tree: the root splits into a subtree for F1 to F4 and the leaf F5; F1 to F4 splits into F1 and a subtree for F2 to F4, which splits into F2 and F3 F4.", fig: { kind: "tree", title: "Cost 48 + 75 + 50 + 2000 = 2173", root: { label: "2×1000", sub: "2000", kids: [
      { label: "2×1", sub: "50", kids: [{ label: "F1 2×25" }, { label: "25×1", sub: "75", kids: [{ label: "F2 25×3" }, { label: "3×1", sub: "48", kids: [{ label: "F3 3×16" }, { label: "F4 16×1" }] }] }] },
      { label: "F5 1×1000" },
    ] } } },

    { type: "example", id: "a6-e1", level: "gate", title: "GATE CS 2021 (forenoon), Q17 · 2 marks · MSQ: rod cutting R₇", file: "gate2021_fn_q17.txt", given: `Prices p[1..7] = 1, 5, 8, 9, 10, 17, 18. R_n is the maximum income from cutting a rod of length n into integer pieces. About R₇:
A) R₇ = 18   B) R₇ = 19   C) R₇ is achieved by three different solutions   D) R₇ cannot be achieved by a solution with three pieces`, find: "The correct statements.", steps: [
      { say: "Fill R: 0, 1, 5, 8, 10, 13, 17, then R[7] = max(1 + 17, 5 + 13, 8 + 10, 9 + 8, 10 + 5, 17 + 1, 18) = 18.", result: "R₇ = 18" },
      { say: "The ways to reach 18: the whole rod (18); 6 + 1 (17 + 1); 2 + 2 + 3 (5 + 5 + 8). No other set of pieces totals 18.", result: "three solutions" },
      { say: "2 + 2 + 3 has three pieces, so D is false. B is false.", result: "A and C" },
    ], answer: "A, C", check: "The program in this chapter prints 18; other splits give at most 17 (for example 3 + 4 gives 8 + 9)." },
    { type: "example", id: "a6-e2", level: "gate", title: "GATE CS 2024 (afternoon), Q11 · 1 mark · NAT: the distance of an array", file: "gate2024_an_q11.txt", given: `The distance of an array is the minimum number of elements that must be replaced by another integer so that the array becomes sorted in non-decreasing order. The distance of [2, 5, 3, 1, 4, 2, 6]?`, find: "The distance.", steps: [
      { say: "The elements kept must already be in non-decreasing order (a subsequence), and any such subsequence can be kept, since replaced elements take any integer.", result: "distance = n − LNDS" },
      { say: "LNDS ending at each position: 1, 2, 2, 1, 3, 2, 4. The longest has length 4, for example 2, 3, 4, 6.", result: "4" },
      { say: "7 − 4.", result: "3" },
    ], answer: "3", check: "The program in this chapter prints 4 3." },
    { type: "example", id: "a6-e3", level: "gate", title: "GATE CS 2018 (forenoon), Q41 · 2 marks · explicitly computed pairs in the best matrix chain", file: "gate2018_fn_q41.txt", given: `F1..F5 have dimensions 2×25, 25×3, 3×16, 16×1, 1×1000. In the parenthesization that minimises the number of scalar multiplications, which pairs of the original matrices are explicitly computed (directly multiplied)?
A) F1F2 and F3F4 only   B) F2F3 only   C) F3F4 only   D) F1F2 and F4F5 only`, find: "The explicitly computed pairs.", steps: [
      { say: "d = [2, 25, 3, 16, 1, 1000]. Cheapest M[3][4] = 3 × 16 × 1 = 48 (F3F4 gives 3 × 1).", result: "M[3][4] = 48" },
      { say: "Cheapest M[2][4] = 25 × 3 × 1 + 48 = 123 (F2 times F3F4); M[1][4] = 2 × 25 × 1 + 123 = 173 (F1 times F2F3F4).", result: "M[1][4] = 173" },
      { say: "Whole chain: 173 + 2 × 1 × 1000 = 2173, which beats every other split. So the order is ((F1(F2(F3F4)))F5).", result: "2173" },
      { say: "Pairs of two original matrices multiplied directly: only F3F4.", result: "F3F4 only" },
    ], answer: "C", check: "The program in this chapter prints 2173." },
    { type: "example", id: "a6-e4", level: "gate", title: "GATE CS 2026 (afternoon), Q39 · 2 marks · are the two fill orders correct?", file: "gate2026_an_q39.txt", given: `T[0][k] = T[k][0] = 1; T[i][j] = 2T[i−1][j] + 3T[i][j−1] for 1 ≤ i, j ≤ n. B1: for i = 1..n, for j = 1..n, T[i][j] = 2T[i−1][j] + 3T[i][j−1]. B2: for s = 2..2n, for i = 1..n, for j = 1..n, if i + j == s then T[i][j] = 2T[i−1][j] + 3T[i][j−1]. Which is correct?
A) both   B) B1 only   C) B2 only   D) neither`, find: "Which algorithms are correct.", steps: [
      { say: "B1: cell (i, j) needs (i − 1, j), from the previous row, and (i, j − 1), earlier in the same row. Both are filled before (i, j).", result: "B1 correct" },
      { say: "B2: cell (i, j) with i + j = s needs two cells whose indexes sum to s − 1, filled in the previous round of s (or the base row and column).", result: "B2 correct" },
    ], answer: "A", check: "The program in this chapter fills a 3 × 3 table both ways and prints 1349 1349." },

    { type: "trap", wrong: "The minimum number of replacements to sort an array is the number of inversions, or the number of elements out of place.", tempting: "Each wrong element needs to be fixed.", whyWrong: "You keep the longest non-decreasing subsequence and replace everything else. For [2, 5, 3, 1, 4, 2, 6] there are 9 inversions and the array has many elements out of place, yet only 3 replacements are needed.", rule: "Distance to sorted = n − length of the longest non-decreasing subsequence.", ex: { text: "[2, 5, 3, 1, 4, 2, 6]: LNDS 4, so 3 replacements; inversions 9." } },
    { type: "trap", wrong: "In rod cutting the best first piece is the one with the best price per unit length.", tempting: "Greedy by ratio is optimal for the fractional knapsack.", whyWrong: "Pieces must be whole. For the prices of GATE 2021 and a rod of length 4, the best ratio is for length 3 (8 for 3 units, 2.67 per unit), and the greedy cutting 3 + 1 earns 8 + 1 = 9. The table gives R[4] = 10, by cutting 2 + 2.", rule: "Try every first piece and use the table.", ex: { text: "n = 4: greedy by ratio 3 + 1 = 9; the best is 2 + 2 = 10." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2021 FN Q17 · 2024 AN Q11 · 2018 FN Q41 · 2026 AN Q39. The dynamic-programming tables are also used in Algorithms for shortest paths (Bellman–Ford and Floyd–Warshall, Chapter A9) and in Compiler Design (the CYK parser in Theory of Computation)." },
    { type: "recall", cards: [
      { q: "Two properties of a DP problem?", a: "Optimal substructure and overlapping subproblems." },
      { q: "The four steps of a DP design?", a: "State, transition, base case, order of filling." },
      { q: "Cost of a DP?", a: "Number of cells × work per cell." },
      { q: "Rod cutting recurrence?", a: "R[k] = max over i of p[i] + R[k − i], R[0] = 0." },
      { q: "0/1 knapsack recurrence and cost?", a: "K[i][w] = max(K[i−1][w], v + K[i−1][w−wt]); Θ(nW)." },
      { q: "LCS recurrence?", a: "Match: L[i−1][j−1] + 1; else max(L[i−1][j], L[i][j−1])." },
      { q: "Distance of an array to sorted?", a: "n − LNDS." },
      { q: "Matrix chain recurrence and cost?", a: "M[i][j] = min over k of M[i][k] + M[k+1][j] + d[i−1]d[k]d[j]; Θ(n³)." },
      { q: "Matrix chain fill order?", a: "By increasing chain length." },
      { q: "Memoisation versus tabulation?", a: "Top-down with a cache versus bottom-up in order." },
      { q: "Why is Θ(nW) called pseudo-polynomial?", a: "W is a number written in log W bits, so nW is exponential in the input size." },
    ] },
    { type: "check", questions: [
      { id: "a6c1", kind: "NAT", marks: 1, q: "Prices p[1] = 2, p[2] = 5, p[3] = 7. What is R[3], the best income for a rod of length 3?", answer: "7", solution: "Options: 7 (whole), 5 + 2 = 7, 2 + 2 + 2 = 6. The maximum is 7." },
      { id: "a6c2", kind: "NAT", marks: 1, q: "The LCS length of ABCD and ACBD?", answer: "3", solution: "ABD or ACD, length 3." },
      { id: "a6c3", kind: "MCQ", marks: 1, q: "The time of the matrix-chain DP for n matrices is", options: ["Θ(n)", "Θ(n²)", "Θ(n³)", "Θ(2ⁿ)"], answer: "C", solution: "n² cells, n choices each." },
      { id: "a6c4", kind: "MSQ", marks: 2, q: "Which problems have overlapping subproblems?", options: ["Fibonacci by F(n−1) + F(n−2)", "Merge sort", "LCS", "Binary search"], answer: "A, C", solution: "Merge sort and binary search split into disjoint pieces." },
      { id: "a6c5", kind: "NAT", marks: 2, q: "Matrices of sizes 10×20, 20×30, 30×40 (d = [10, 20, 30, 40]). The least number of scalar multiplications for the product of all three?", answer: "18000", solution: "(AB)C: 10·20·30 + 10·30·40 = 6000 + 12000 = 18000; A(BC): 20·30·40 + 10·20·40 = 24000 + 8000 = 32000." },
      { id: "a6c6", kind: "NAT", marks: 2, q: "The distance (n − LNDS) of the array [3, 1, 2, 5, 4]?", answer: "2", solution: "The longest non-decreasing subsequences are 1, 2, 5 and 1, 2, 4, of length 3. The distance is 5 − 3 = 2." },
      { id: "a6c7", kind: "MCQ", marks: 2, q: "A DP table T[i][j] depends on T[i−1][j−1], T[i−1][j] and T[i][j−1]. Which fill order is correct?", options: ["Row by row, left to right", "Row by row, right to left", "Columns from the right", "Rows from the bottom"], answer: "A", solution: "All three dependencies are in earlier rows or earlier columns of the same row." },
      { id: "a6c8", kind: "NAT", marks: 2, q: "0/1 knapsack, bag 5; items (weight, value): (2, 3), (3, 4), (4, 5), (5, 8). The maximum value?", answer: "8", solution: "Item 4 alone gives 8; items 1 + 2 weigh 5 and give 7." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on dynamic programming", sub: "Algorithms", href: "/topics/algorithms" }, { label: "Greedy algorithms", sub: "when no table is needed", href: "/study/greedy" }] },
    { type: "links", prereq: ["Asymptotics (A1)", "Divide and conquer (A4)", "Arrays and 2-D arrays (D2)"], usedIn: ["Shortest paths: Bellman–Ford and Floyd–Warshall (A9)", "Theory of Computation: CYK parsing"], cross: ["Data Structures: recursion (D6)"] },
  ],
};
