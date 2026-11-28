import type { Topic } from "@/lib/study/schema";

/**
 * Digital Logic chapter L3 "Minimisation: K-maps, prime implicants, don't cares, NAND and NOR" (28 Nov 2026). The Karnaugh map and its Gray-code order, grouping rules, prime
 * and essential prime implicants, don't-care terms, minimal sum of products and product of sums, the tabular (Quine-McCluskey) method, and gate counts with NOR and NAND.
 * Real GATE questions (texts from public/data/questions.json, pictures read from public/images), each re-solved here by program:
 * 2026 FN Q48 (minimal SOPs of a 10-minterm function: B and D), 2026 AN Q40 (Sigma(0,1,2,3,8,9,10,11) is B'), 2025 FN Q42 (Sigma(0,2,4,8,10,11,12): option A),
 * 2025 AN Q43 (K-map picture: F = x'z' + xz, options A and D), 2021 AN Q49 (6 literals), 2019 FN Q49 (3 NOR gates), 2018 FN Q59 (3 essential prime implicants),
 * 2017 FN Q26 (K-map picture with don't cares: 1 NOR gate), 2017 AN Q41 (minimal POS: option A).
 * Programs compiled and run with gcc: 0 1 0 1; 1 0 0 1; 3; 1; 1 6.
 */
export const chapterL3: Topic = {
  id: "cs.dl.v2.minimise3",
  title: "Minimisation: K-maps, tabular method and NOR/NAND",
  no: "L3",
  book: [
    { t: "p", text: "A Boolean function can be written in many ways, and the way you write it decides how many gates the circuit needs. **Minimisation** is finding the cheapest form: the fewest product terms, then the fewest literals. It is the single most examined skill in Digital Logic, with nine of the 69 questions in the bank on it, and it rests on one picture, the **Karnaugh map**, which turns algebra into pattern spotting." },
    { t: "p", text: "The paper asks for minimisation in four ways: **find the minimal expression** (and choose it from options that are nearly alike), **count something** (essential prime implicants, literals, gates), **read a K-map given as a picture**, and **handle don't-care terms**. All four are the same skill: draw the map, group the 1s into the largest blocks, and read the groups." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["draw a 3- or 4-variable Karnaugh map with the rows and columns in Gray-code order;", "group the 1s into the biggest rectangles of size 1, 2, 4, 8 or 16, using the wrap-around;", "list the prime implicants and pick out the essential ones;", "use don't-care terms to make groups larger;", "write the minimal sum of products and the minimal product of sums;", "run the tabular (Quine–McCluskey) method on a small function;", "count the NAND or NOR gates a minimal form needs."] },

    { t: "h2", text: "The Karnaugh map" },
    { t: "p", text: "A **Karnaugh map** (K-map) is a truth table folded into a grid so that **neighbouring cells differ in exactly one variable**. For four variables w, x, y, z the grid has 16 cells: the rows are labelled by wx and the columns by yz, and both are written in **Gray-code order**, 00, 01, 11, 10, not in binary order. That order is what makes neighbouring cells differ in one bit." },
    { t: "p", text: "The payoff: two neighbouring 1s can be merged, because they differ in one variable and that variable cancels (xy + xȳ = x). Four 1s in a 2 × 2 block or in a row merge and lose two variables, eight lose three, and so on. The map is a **torus**: the left edge is next to the right edge and the top edge next to the bottom edge, since 00 and 10 also differ in one bit. So the four corners form a valid group of four." },
    { t: "fig", id: "l3-f1" },
    { t: "p", text: "To read the minterm number of a cell, write the row bits then the column bits: the cell in row wx = 01 and column yz = 11 is 0111 = 7. The figure shows the map of the function of GATE 2025, with 1s in the cells numbered 0, 2, 5, 7, 8, 10, 13 and 15. The four corners and the middle form two groups: the corners (cells 0, 2, 8, 10) are the group x̄z̄ (x = 0 and z = 0, whatever w and y are), and the centre block (5, 7, 13, 15) is the group xz. So F = x̄z̄ + xz, which is the XNOR of x and z. That agrees with options A and D of the question, and the other two options each contain a minterm that is 0 on the map (0100 in option B, 0001 in option C)." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int on[8] = {0, 2, 5, 7, 8, 10, 13, 15};              /* the 1s read off the map */
    int ok[4] = {1, 1, 1, 1};
    for (int m = 0; m < 16; m++) {
        int w = m >> 3 & 1, x = m >> 2 & 1, y = m >> 1 & 1, z = m & 1, f = 0;
        for (int i = 0; i < 8; i++) if (on[i] == m) f = 1;
        ok[0] &= (((!w & !x & y & !z) | (w & !x & !y & !z) | (w & !x & y & !z) | (!w & !x & !y & !z) | (x & z)) == f);
        ok[1] &= (((!w & !x & y & !z) | (!w & x & !y & !z) | (w & !x & y & !z) | (x & z)) == f);
        ok[2] &= (((w & !x & y & !z) | (w & !x & !y & !z) | (!w & !x & !y & z) | (x & z)) == f);
        ok[3] &= (((!x & !z) | (x & z)) == f);
    }
    printf("%d %d %d %d\\n", ok[0], ok[1], ok[2], ok[3]);
    return 0;
}`, out: "1 0 0 1", file: "kmap_options.c" },
    { t: "ex", id: "l3-e1" },
    { t: "callout", kind: "key", text: "K-map rows and columns go 00, 01, 11, 10 (Gray code). Groups are rectangles of 1, 2, 4, 8 or 16 cells, may wrap round the edges, and a group of 2ᵏ cells drops k variables." },

    { t: "h2", text: "Grouping rules, prime and essential prime implicants" },
    { t: "p", text: "To minimise a sum of products: **cover every 1 with a group, make each group as large as possible, and use as few groups as possible.** A group is an **implicant** of the function (an AND term that implies it). A group that cannot be enlarged any further is a **prime implicant**. A prime implicant is **essential** if some 1 is covered by it and by no other prime implicant: it must be in every minimal cover." },
    { t: "p", text: "The method: list all the prime implicants, then pick the essential ones first (they are forced), then cover the remaining 1s with as few extra primes as possible. Essential primes are found by looking for a 1 that has only one way to be covered." },
    { t: "p", text: "GATE 2018 asks for the number of **essential prime implicants** of F(P, Q, R, S) = Σm(0, 2, 5, 7, 9, 11) + d(3, 8, 10, 12, 14), where d marks don't-care minterms. Drawing the map and growing groups over the don't-cares gives six prime implicants: Q̄S̄, Q̄R, PS̄, P̄RS, PQ̄ and P̄QS. Now look for a minterm that only one prime covers. Minterm 0 (all zero) is covered only by Q̄S̄; minterm 5 (0101) is covered only by P̄QS; minterm 9 (1001) is covered only by PQ̄. So Q̄S̄, P̄QS and PQ̄ are essential: **three**. The other three primes are optional." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int covers(const char *p, int m) {                    /* pattern over P Q R S: '-' means either */
    for (int i = 0; i < 4; i++) {
        int bit = m >> (3 - i) & 1;
        if (p[i] != '-' && p[i] - '0' != bit) return 0;
    }
    return 1;
}

int main(void) {
    const char *prime[6] = {"-0-0", "-01-", "1--0", "0-11", "10--", "01-1"};   /* Q'S' Q'R PS' P'RS PQ' P'QS */
    int on[6] = {0, 2, 5, 7, 9, 11}, essential[6] = {0};
    for (int k = 0; k < 6; k++) {
        int count = 0, which = -1;
        for (int j = 0; j < 6; j++) if (covers(prime[j], on[k])) { count++; which = j; }
        if (count == 1) essential[which] = 1;           /* only one prime covers this minterm */
    }
    int n = 0;
    for (int j = 0; j < 6; j++) n += essential[j];
    printf("%d\\n", n);
    return 0;
}`, out: "3", file: "essential_primes.c" },
    { t: "ex", id: "l3-e2" },

    { t: "h2", text: "Don't-care terms" },
    { t: "p", text: "Sometimes an input combination can never occur, or its output does not matter. Such a minterm is a **don't care** (written d or X). In the map it may be treated as a 1 **or** a 0, whichever lets you make bigger groups. You are never forced to cover a don't care, so it never has to be included in a group by itself, and it should not be counted when you ask 'is this 1 covered only once'." },
    { t: "p", text: "In GATE 2017 the K-map is given as a picture, with columns labelled ba and rows dc, and four 1s and don't cares marked X. Reading it: the 1s are the minterms 4, 12 and 14 (dcba = 0100, 1100, 1110), and the X cells are the minterms 1, 3, 9, 11 and 6. Group the 1s with the X at 6: the cells 4, 6, 12 and 14 form a 2 × 2 block in which b and d vary and c = 1 and a = 0 are fixed. So the function is simply c·ā. The question asks for the minimum number of 2-input NOR gates, with every variable and its complement available: c·ā = (c̄ + a)′, one NOR gate with inputs c̄ and a. The answer is **1**." },
    { t: "ex", id: "l3-e3" },
    { t: "p", text: "Another picture-free example with don't cares is GATE 2021's question on literals. A function f(w, x, y, z) is described by three rules: f(w, 0, 0, z) = 1; f(1, x, 1, z) = x + z; and f(w, 1, y, z) = wz + y. The rules fix 14 of the 16 minterms (the two cells with w = 0, x = 0, y = 1 are never specified: don't cares). The 1s are 0, 1, 6, 7, 8, 9, 11, 13, 14, 15. The minimal sum of products is x̄ȳ + xy + wz: the first term covers 0, 1, 8, 9; the second 6, 7, 14, 15; the third covers 11, 13 and 15 (wz = 1 there), so together they cover every 1 and the unspecified cells can stay 0. It has 2 + 2 + 2 = **6 literals**." },
    { t: "fig", id: "l3-f2" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int bad = 0;
    for (int m = 0; m < 16; m++) {
        int w = m >> 3 & 1, x = m >> 2 & 1, y = m >> 1 & 1, z = m & 1, spec = 1, want = 0;
        if (!x && !y) want = 1;                                     /* f(w,0,0,z) = 1 */
        else if (w && y) want = x | z;                              /* f(1,x,1,z) = x + z */
        else if (x) want = (w & z) | y;                             /* f(w,1,y,z) = wz + y */
        else spec = 0;                                              /* w = 0, x = 0, y = 1: don't care */
        int got = (!x & !y) | (x & y) | (w & z);                    /* x'y' + xy + wz */
        if (spec && got != want) bad++;
    }
    printf("%d %d\\n", bad == 0, 2 + 2 + 2);
    return 0;
}`, out: "1 6", file: "literals_f.c" },
    { t: "ex", id: "l3-e4" },

    { t: "h2", text: "Choosing among nearly equal answers" },
    { t: "p", text: "The paper often lists four sums of products that look alike and asks which are minimal. The method is to first find a minimal cover yourself, then test each option **by covering**: does it include every 1, include no 0, and have the same number of terms and literals as the minimum? An option that misses a 1 or covers a 0 is wrong at once; an option that is correct but has more terms is correct but not minimal." },
    { t: "p", text: "GATE 2026 gives F(P, Q, R, S) = Σm(1, 2, 3, 4, 5, 7, 10, 12, 13, 14) and four candidates. The prime implicants are QR̄ (cells 4, 5, 12, 13), Q̄RS̄ (2, 10), P̄S (1, 3, 5, 7), PRS̄ (10, 14), PQS̄ (12, 14) and P̄Q̄R (2, 3). A minimal cover needs four terms with 10 literals. There are exactly three minimal covers: {QR̄, Q̄RS̄, P̄S, PRS̄}, {QR̄, Q̄RS̄, P̄S, PQS̄} and {QR̄, P̄S, PRS̄, P̄Q̄R}. Test the options against them. A: P̄S + QR̄ + P̄Q̄R + Q̄RS̄ leaves minterm 14 uncovered. B: P̄S + QR̄ + P̄Q̄R + PRS̄ is the third minimal cover. C: P̄S + QR̄ + PQS̄ + PRS̄ leaves minterm 2 uncovered. D: P̄S + QR̄ + PQS̄ + Q̄RS̄ is the second minimal cover. So B and D are the minimal expressions." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int on[10] = {1, 2, 3, 4, 5, 7, 10, 12, 13, 14}, ok[4] = {1, 1, 1, 1};
    for (int m = 0; m < 16; m++) {
        int P = m >> 3 & 1, Q = m >> 2 & 1, R = m >> 1 & 1, S = m & 1, f = 0;
        for (int i = 0; i < 10; i++) if (on[i] == m) f = 1;
        ok[0] &= (((!P & S) | (Q & !R) | (!P & !Q & R) | (!Q & R & !S)) == f);
        ok[1] &= (((!P & S) | (Q & !R) | (!P & !Q & R) | (P & R & !S)) == f);
        ok[2] &= (((!P & S) | (Q & !R) | (P & Q & !S) | (P & R & !S)) == f);
        ok[3] &= (((!P & S) | (Q & !R) | (P & Q & !S) | (!Q & R & !S)) == f);
    }
    printf("%d %d %d %d\\n", ok[0], ok[1], ok[2], ok[3]);
    return 0;
}`, out: "0 1 0 1", file: "minimal_options.c" },
    { t: "ex", id: "l3-e5" },
    { t: "p", text: "A simpler example: Σm(0, 1, 2, 3, 8, 9, 10, 11) with A as the most significant bit (GATE 2026). These are exactly the cells where B = 0, so the single group of eight gives F = B̄, one literal. And GATE 2025's Σ(0, 2, 4, 8, 10, 11, 12) groups as c̄d̄ (cells 0, 4, 8, 12), b̄d̄ (cells 0, 2, 8, 10) and a b̄ c (cells 10, 11), three terms and seven literals, which is option A once the variables are matched to b₃b₂b₁b₀." },
    { t: "ex", id: "l3-e6" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Product of sums" },
    { t: "p", text: "The **minimal product of sums** (POS) is found from the **0s** of the map. Group the 0s (don't cares may be used as 0s), read each group as a product term of the complement function F̄, then complement the result by De Morgan's law. Equivalently: read each group of 0s with the variables **complemented** when they are 1, and write the group as a sum." },
    { t: "p", text: "GATE 2017 gives f(w, x, y, z) = Σm(0, 1, 2, 3, 7, 8, 10) + Σd(5, 6, 11, 15) and asks for the minimal POS. The 0s of f (the minterms not in the list and not don't cares) are 4, 9, 12, 13 and 14. Treat the don't cares as 0s where that helps. The zeros 4, 12 and 14 with the don't care 6 form the group xz̄ (x = 1, z = 0: cells 4, 6, 12, 14); the zeros 9 and 13 with the don't cares 11 and 15 form the group wz (cells 9, 11, 13, 15). Every zero is covered, so F̄ = xz̄ + wz. Complement: F = (x̄ + z)(w̄ + z̄), which is option A." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int on[7] = {0, 1, 2, 3, 7, 8, 10}, dc[4] = {5, 6, 11, 15}, ok[4] = {1, 1, 1, 1};
    for (int m = 0; m < 16; m++) {
        int w = m >> 3 & 1, x = m >> 2 & 1, y = m >> 1 & 1, z = m & 1, f = 0, d = 0;
        for (int i = 0; i < 7; i++) if (on[i] == m) f = 1;
        for (int i = 0; i < 4; i++) if (dc[i] == m) d = 1;
        if (d) continue;                                              /* don't cares may be either */
        ok[0] &= (((!w | !z) & (!x | z)) == f);
        ok[1] &= (((!w | z) & (x | z)) == f);
        ok[2] &= (((w | z) & (!x | z)) == f);
        ok[3] &= (((w | !z) & (!x | z)) == f);
    }
    printf("%d %d %d %d\\n", ok[0], ok[1], ok[2], ok[3]);
    return 0;
}`, out: "1 0 0 0", file: "pos_options.c" },
    { t: "ex", id: "l3-e7" },

    { t: "h2", text: "The tabular method" },
    { t: "p", text: "The K-map is practical to four or five variables. For more, or to be certain, the **tabular method** (Quine–McCluskey) does the same job by routine. **Step 1:** list the minterms (and don't cares) in groups by the number of 1s in their binary form. **Step 2:** compare each group with the next one; two terms that differ in exactly one bit combine into a term with a dash in that place, and the two originals are ticked. Repeat on the new terms until nothing combines. The terms never ticked are the **prime implicants**. **Step 3:** draw a prime implicant chart (primes against the original minterms, not the don't cares) and choose the **essential** primes (a column with a single mark), then cover what is left with the fewest further primes." },
    { t: "p", text: "A tiny trace: Σ(0, 1, 2, 5). Groups by number of ones: {0}, {1, 2}, {5}. Combine 0 with 1: 00-0? Writing bits, 0000 and 0001 combine to 000-; 0000 and 0010 combine to 00-0; 0001 and 0101 combine to 0-01. Nothing further combines (the three results differ in two places). The primes are 000-, 00-0 and 0-01; the minterm 2 is covered only by 00-0 and 5 only by 0-01, so both are essential; 0 and 1 are covered by 000- as well, which is now redundant. The minimal form is w̄ x̄ z̄ + w̄ ȳ z (taking the variables w x y z)." },
    { t: "p", text: "The count of prime implicants can be large for a function with many don't cares, but the structure is the same. The tabular method is what a computer does; for GATE, the K-map is quicker, and the tabular method matters for the **question that asks how many prime implicants or essential prime implicants a function has**." },

    { t: "h2", text: "Gate counts: NAND and NOR implementations" },
    { t: "p", text: "A minimal sum of products maps onto **two levels of NAND** gates: replace every AND and the final OR by NAND gates (this uses De Morgan: a sum of products is a NAND of NANDs). A minimal product of sums maps onto two levels of **NOR** gates in the same way. Inverters on single variables are counted as gates unless the question says the complements of all inputs are available." },
    { t: "p", text: "GATE 2019 asks for the minimum number of 2-input NOR gates for f = Σ(0, 2, 5, 7, 8, 10, 13, 15), with all inputs and their complements available. This is the same function as GATE 2025's picture: with variables a b c d, it is b̄d̄ + bd, the XNOR of b and d. Using the complements, XNOR(b, d) = XOR(b, d̄) = (b + d̄)′ NORed with (b̄ + d)′: write n₁ = NOR(b, d̄), n₂ = NOR(b̄, d), and f = NOR(n₁, n₂). Check: NOR(n₁, n₂) = (b̄d + bd̄)′ = XNOR. Three NOR gates." },
    { t: "code", text: `#include <stdio.h>

int nor(int a, int b) { return !(a | b); }

int main(void) {
    int on[8] = {0, 2, 5, 7, 8, 10, 13, 15}, ok = 1;
    for (int m = 0; m < 16; m++) {
        int b = m >> 2 & 1, d = m & 1, f = 0;
        for (int i = 0; i < 8; i++) if (on[i] == m) f = 1;
        int n1 = nor(b, !d), n2 = nor(!b, d);                /* two gates fed by the inputs and their complements */
        ok &= (nor(n1, n2) == f);                            /* the third gate */
    }
    printf("%d\\n", ok);
    return 0;
}`, out: "1", file: "nor_three.c" },
    { t: "ex", id: "l3-e8" },
    { t: "ex", id: "l3-e9" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["K-map: Gray-code order 00 01 11 10; neighbours differ in one variable; edges wrap; a group of 2ᵏ cells drops k variables.", "Cover all 1s with the fewest, largest groups. Prime implicant = a group that cannot grow; essential = covers some 1 that nothing else covers.", "Don't cares may be used as 1 or 0 to enlarge groups; they need not be covered.", "To test options: find the minimal cover, then check each option for a missed 1, a covered 0, and the term and literal count.", "Minimal POS: group the 0s, read F′ as a sum of products, complement by De Morgan.", "Tabular method: group by number of ones, combine pairs differing in one bit, unticked terms are primes, then a prime chart.", "SOP = two levels of NAND, POS = two levels of NOR; XNOR(b, d) takes 3 NOR gates when complements are free."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "l3-f1", caption: "The K-map of GATE 2025 (rows wx, columns yz, both in Gray order). The four corners form the group x̄z̄ and the centre block the group xz, so F = x̄z̄ + xz.", alt: "A four-by-four grid with 1s in the four corners and in the four central cells.", fig: { kind: "array", title: "F(w, x, y, z): rows wx = 00 01 11 10, columns yz = 00 01 11 10", data: [[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 0], [1, 0, 0, 1]], colLabels: ["00", "01", "11", "10"], rowLabels: ["00", "01", "11", "10"], tones: { "0,0": "ok", "0,3": "ok", "3,0": "ok", "3,3": "ok", "1,1": "hl", "1,2": "hl", "2,1": "hl", "2,2": "hl" } } },
    { type: "figure", id: "l3-f2", caption: "The map of GATE 2017 with don't cares (X). Columns are ba, rows dc. The 1s are minterms 4, 12 and 14; with the X at 6 they form the group c·ā of four cells.", alt: "A four-by-four grid with three 1s, five X cells and the rest empty; the group of cells 4, 6, 12, 14 is highlighted.", fig: { kind: "array", title: "Rows dc = 00 01 11 10, columns ba = 00 01 11 10", data: [["·", "X", "X", "·"], [1, "·", "·", "X"], [1, "·", "·", 1], ["·", "X", "X", "·"]], colLabels: ["00", "01", "11", "10"], rowLabels: ["00", "01", "11", "10"], tones: { "1,0": "ok", "2,0": "ok", "2,3": "ok", "1,3": "hl" } } },

    { type: "example", id: "l3-e1", level: "gate", title: "GATE CS 2025 (afternoon), Q43 · 2 marks · MSQ: which expressions represent the K-map", file: "gate2025_an_q43.txt", given: `K-map of F(w, x, y, z) (picture): rows wx = 00, 01, 11, 10 and columns yz = 00, 01, 11, 10. Row 00: 1 0 0 1; row 01: 0 1 1 0; row 11: 0 1 1 0; row 10: 1 0 0 1.
Which expressions represent F?
A) w'x'yz' + wx'y'z' + wx'yz' + w'x'y'z' + xz   B) w'x'yz' + w'xy'z' + wx'yz' + xz   C) wx'yz' + wx'y'z' + w'x'y'z + xz   D) x'z' + xz`, find: "The correct expressions.", steps: [
      { say: "Read the 1s: row 00 gives minterms 0 and 2; row 01 gives 5 and 7; row 11 gives 13 and 15; row 10 gives 8 and 10. F = Σ(0, 2, 5, 7, 8, 10, 13, 15).", result: "0 2 5 7 8 10 13 15" },
      { say: "Corners 0, 2, 8, 10 are x'z'; centre 5, 7, 13, 15 is xz. So F = x'z' + xz: option D.", result: "D" },
      { say: "A lists 0010, 1000, 1010, 0000 (all inside x'z') plus xz: the same function. B contains 0100 (w'xy'z'), a 0 on the map. C contains 0001 (w'x'y'z), also a 0.", result: "A true; B, C false" },
    ], answer: "A, D", check: "The program in this chapter checks each option against the 1s and prints 1 0 0 1." },
    { type: "example", id: "l3-e2", level: "gate", title: "GATE CS 2018 (forenoon), Q59 · 2 marks · NAT: essential prime implicants", file: "gate2018_fn_q59.txt", given: `F(P, Q, R, S) = Σm(0, 2, 5, 7, 9, 11) + d(3, 8, 10, 12, 14). The number of essential prime implicants of F?`, find: "The number of essential prime implicants.", steps: [
      { say: "Grow groups over the don't cares. The prime implicants are Q'S' (0, 2, 8, 10), Q'R (2, 3, 10, 11), PS' (8, 10, 12, 14), P'RS (3, 7), PQ' (8, 9, 10, 11) and P'QS (5, 7).", result: "six primes" },
      { say: "Minterm 0 is covered only by Q'S'. Minterm 5 only by P'QS. Minterm 9 only by PQ'.", result: "3 essential" },
      { say: "Minterms 2, 7 and 11 each have more than one prime, so the other three primes are optional.", result: "3" },
    ], answer: "3", check: "The program in this chapter counts the primes that alone cover a minterm and prints 3." },
    { type: "example", id: "l3-e3", level: "gate", title: "GATE CS 2017 (forenoon), Q26 · 1 mark · NAT: NOR gates for a map with don't cares", file: "gate2017_fn_q26.txt", given: `K-map (picture), columns ba and rows dc: row dc = 00: blank, X, X, blank; row 01: 1, blank, blank, X; row 11: 1, blank, blank, 1; row 10: blank, X, X, blank (columns ba = 00, 01, 11, 10). X is don't care, blank is 0. The function is built with 2-input NOR gates only; every variable and its complement is available. The minimum number of gates?`, find: "The minimum number of NOR gates.", steps: [
      { say: "The 1s are dcba = 0100, 1100 and 1110 (minterms 4, 12, 14). The don't cares are 1, 3, 9, 11 and 6.", result: "1s: 4, 12, 14; X includes 6" },
      { say: "Cells 4, 6, 12, 14 form a block in which b and d change and c = 1, a = 0 stay: use X at 6. f = c·a'.", result: "f = c a'" },
      { say: "c·a' = (c' + a)': a single NOR gate fed by c' and a.", result: "1" },
    ], answer: "1", check: "Writing the function as c a' leaves nothing else to build." },
    { type: "example", id: "l3-e4", level: "gate", title: "GATE CS 2021 (afternoon), Q49 · 2 marks · NAT: literals in the minimal SOP", file: "gate2021_an_q49.txt", given: `f(w, x, y, z) with f(w, 0, 0, z) = 1; f(1, x, 1, z) = x + z; f(w, 1, y, z) = wz + y. The number of literals in the minimal sum-of-products expression of f?`, find: "The number of literals.", steps: [
      { say: "Evaluate the three rules on all 16 cells. The 1s are 0, 1, 6, 7, 8, 9, 11, 13, 14, 15. The cells with w = 0, x = 0, y = 1 (2 and 3) are not specified: don't cares.", result: "1s: 0 1 6 7 8 9 11 13 14 15" },
      { say: "Groups: x'y' (0, 1, 8, 9); xy (6, 7, 14, 15); wz (11, 13, 15).", result: "x'y' + xy + wz" },
      { say: "Three terms of two literals each.", result: "6" },
    ], answer: "6", check: "The program in this chapter checks the cover on every specified cell and prints 1 6." },
    { type: "example", id: "l3-e5", level: "gate", title: "GATE CS 2026 (forenoon), Q48 · 2 marks · MSQ: minimal sums of products", file: "gate2026_fn_q48.txt", given: `F(P, Q, R, S) = Σm(1, 2, 3, 4, 5, 7, 10, 12, 13, 14). Which are minimal SOP expressions?
A) P'S + QR' + P'Q'R + Q'RS'   B) P'S + QR' + P'Q'R + PRS'   C) P'S + QR' + PQS' + PRS'   D) P'S + QR' + PQS' + Q'RS'`, find: "The minimal SOPs.", steps: [
      { say: "Prime implicants: QR' (4, 5, 12, 13), Q'RS' (2, 10), P'S (1, 3, 5, 7), PRS' (10, 14), PQS' (12, 14), P'Q'R (2, 3). A minimal cover has 4 terms.", result: "4 terms, 10 literals" },
      { say: "A leaves minterm 14 uncovered. C leaves minterm 2 uncovered.", result: "A, C are not covers" },
      { say: "B = {QR', P'S, P'Q'R, PRS'} covers 4, 5, 12, 13, 1, 3, 7, 2, 10, 14: all ten. D = {QR', P'S, PQS', Q'RS'} covers all ten too. Both have 4 terms and 10 literals.", result: "B and D" },
    ], answer: "B, D", check: "The program in this chapter prints 0 1 0 1." },
    { type: "example", id: "l3-e6", level: "gate", title: "GATE CS 2025 (forenoon), Q42 · 2 marks · the minimised form of Σ(0, 2, 4, 8, 10, 11, 12)", file: "gate2025_fn_q42.txt", given: `F(b3, b2, b1, b0) = Σ(0, 2, 4, 8, 10, 11, 12), no don't cares. The correct minimised expression?
A) b1'b0' + b2'b0' + b1 b2' b3   B) b1'b0' + b2'b0'   C) b2'b0' + b1 b2 b3   D) b0'b2' + b3'`, find: "The minimised form.", steps: [
      { say: "Groups: cells 0, 4, 8, 12 have b1 = 0, b0 = 0: b1'b0'. Cells 0, 2, 8, 10 have b2 = 0, b0 = 0: b2'b0'. Cell 11 (1011) pairs only with 10 (1010): b3 b2' b1.", result: "b1'b0' + b2'b0' + b3 b2' b1" },
      { say: "B misses minterm 11. C and D cover minterms that are 0 (D covers all of b3' including 1 and 3).", result: "only A is right" },
    ], answer: "A", check: "Option A has 3 terms and 7 literals, the minimum." },
    { type: "example", id: "l3-e7", level: "gate", title: "GATE CS 2017 (afternoon), Q41 · 2 marks · the minimal product of sums", file: "gate2017_an_q41.txt", given: `f(w, x, y, z) = Σm(0, 1, 2, 3, 7, 8, 10) + Σd(5, 6, 11, 15). The minimal POS?
A) (w' + z')(x' + z)   B) (w' + z)(x + z)   C) (w + z)(x' + z)   D) (w + z')(x' + z)`, find: "The minimal POS.", steps: [
      { say: "The 0s are minterms 4, 9, 12, 13, 14 (those not listed). Group the 0s with the don't cares: xz' (cells 4, 6, 12, 14) and wz (cells 9, 11, 13, 15).", result: "f' = xz' + wz" },
      { say: "Complement: f = (x' + z)(w' + z').", result: "option A" },
    ], answer: "A", check: "The program in this chapter checks each option on the care set: only A passes." },
    { type: "example", id: "l3-e8", level: "gate", title: "GATE CS 2019 (forenoon), Q49 · 2 marks · NAT: 2-input NOR gates", file: "gate2019_fn_q49.txt", given: `f(a, b, c, d) = Σ(0, 2, 5, 7, 8, 10, 13, 15). The minimum number of 2-input NOR gates, all inputs and complements available?`, find: "The gate count.", steps: [
      { say: "The 1s: 0, 2, 8, 10 give b'd'; 5, 7, 13, 15 give bd. f = b'd' + bd = XNOR(b, d).", result: "f = b XNOR d" },
      { say: "XNOR(b, d) = XOR(b, d'). Build n1 = NOR(b, d'), n2 = NOR(b', d), f = NOR(n1, n2): (b'd + bd')' = XNOR.", result: "3 gates" },
    ], answer: "3", check: "The program in this chapter checks all 16 inputs with exactly these three NOR gates." },
    { type: "example", id: "l3-e9", level: "gate", title: "GATE CS 2026 (afternoon), Q40 · 2 marks · minimal SOP of Σ(0, 1, 2, 3, 8, 9, 10, 11)", file: "gate2026_an_q40.txt", given: `F(A, B, C, D) = Σm(0, 1, 2, 3, 8, 9, 10, 11), A the MSB. The minimal sum of products?
A) A' + B' + C' + D'   B) B'   C) A'B' + AB   D) A'`, find: "The minimal SOP.", steps: [
      { say: "In binary the minterms 0-3 are 00xx and 8-11 are 10xx: B = 0 for all of them, and B = 0 gives exactly these eight.", result: "the eight cells with B = 0" },
      { say: "One group of eight: F = B'.", result: "B'" },
    ], answer: "B", check: "A group of 2³ cells drops three variables, leaving one literal." },

    { type: "trap", wrong: "A minimal expression is any cover that includes all the 1s.", tempting: "If every 1 is covered, the function is right.", whyWrong: "Correct is not minimal. Option A of GATE 2025 (five terms) is the same function as D (two terms) and is correct but far from minimal. And a cover that includes a cell where F is 0 is wrong even if every 1 is covered.", rule: "Test an option three ways: no 0 covered, every 1 covered, minimum terms and literals.", ex: { text: "x'z' + xz and the five-term A are equal; only the first is minimal." } },
    { type: "trap", wrong: "Write the K-map rows and columns in binary order 00, 01, 10, 11.", tempting: "Binary counting is the natural order.", whyWrong: "Binary order puts 01 next to 10, which differ in two bits, so merging them is wrong. The Gray order 00, 01, 11, 10 keeps every neighbour one bit apart, including the wrap-around.", rule: "Label K-maps in Gray code.", ex: { text: "Cells 1 (0001) and 2 (0010) are not neighbours; cells 0 (0000) and 2 (0010) are." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q48 · 2026 AN Q40 · 2025 FN Q42 · 2025 AN Q43 · 2021 AN Q49 · 2019 FN Q49 · 2018 FN Q59 · 2017 FN Q26 · 2017 AN Q41. Every minimisation question of the bank is solved here." },
    { type: "recall", cards: [
      { q: "K-map order of rows and columns?", a: "Gray code: 00, 01, 11, 10." },
      { q: "A group of 2ᵏ cells drops how many variables?", a: "k." },
      { q: "Do K-map groups wrap round?", a: "Yes: left to right and top to bottom; the four corners are a group." },
      { q: "Prime implicant?", a: "A group that cannot be made larger." },
      { q: "Essential prime implicant?", a: "One that alone covers some 1; it is in every minimal cover." },
      { q: "A don't care in a group?", a: "May be used as 1 or 0 to enlarge groups; need not be covered." },
      { q: "Minimal POS recipe?", a: "Group the 0s, read F′ as SOP, complement by De Morgan." },
      { q: "Tabular method first step?", a: "Group minterms by the number of 1s; combine pairs differing in one bit." },
      { q: "SOP as NAND gates?", a: "Two levels of NAND." },
      { q: "XNOR with 2-input NOR gates, complements free?", a: "Three gates." },
      { q: "Is a correct cover always minimal?", a: "No: check terms and literals too." },
    ] },
    { type: "check", questions: [
      { id: "l3c1", kind: "NAT", marks: 1, q: "A 4-variable K-map has a group of 8 cells. How many literals does its product term have?", answer: "1", solution: "8 = 2³ drops three of four variables." },
      { id: "l3c2", kind: "MCQ", marks: 1, q: "Which cells of a 4-variable K-map are neighbours of cell 0 (0000)?", options: ["1, 2, 4, 8", "1, 2, 3, 4", "1, 3, 5, 7", "2, 4, 6, 8"], answer: "A", solution: "Neighbours differ in one bit: 0001, 0010, 0100, 1000." },
      { id: "l3c3", kind: "NAT", marks: 2, q: "f = Σm(0, 1, 2, 3, 4, 5, 6, 7) of 4 variables a, b, c, d (a MSB). The minimal SOP has how many literals?", answer: "1", solution: "It is a' (all cells with a = 0)." },
      { id: "l3c4", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["Don't cares can enlarge groups", "An essential prime implicant is in every minimal cover", "K-map rows are in binary order", "A correct SOP is always minimal"], answer: "A, B", solution: "C and D are false." },
      { id: "l3c5", kind: "NAT", marks: 2, q: "f(a, b, c) = Σ(1, 3, 5, 7). The minimal SOP has how many literals?", answer: "1", solution: "f = c (the cells with c = 1)." },
      { id: "l3c6", kind: "NAT", marks: 2, q: "f(w, x, y, z) = Σ(0, 2, 8, 10). The minimal SOP has how many literals?", answer: "2", solution: "The four corners: x'z'." },
      { id: "l3c7", kind: "MCQ", marks: 2, q: "The minimal product-of-sums form of a function is read from its K-map by grouping", options: ["the 1s", "the 0s", "the don't cares", "all cells"], answer: "B", solution: "A POS is read from the zeros." },
      { id: "l3c8", kind: "NAT", marks: 2, q: "How many 2-input NAND gates does a two-level NAND implementation of f = ab + cd need (complements not needed)?", answer: "3", solution: "A NAND for ab, a NAND for cd, and a final NAND of the two." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on minimisation", sub: "Digital Logic", href: "/topics/digital-logic" }, { label: "Combinational circuits", sub: "the next chapter", href: "/study/combinational" }] },
    { type: "links", prereq: ["Gates and Boolean algebra (L2)"], usedIn: ["Combinational circuits (L4)", "Sequential circuits (L5): flip-flop inputs"], cross: ["Computer Organisation: control unit design"] },
  ],
};
