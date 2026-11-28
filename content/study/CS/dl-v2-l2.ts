import type { Topic } from "@/lib/study/schema";

/**
 * Digital Logic chapter L2 "Gates and Boolean algebra" (28 Nov 2026). Gates and truth tables, the laws of Boolean algebra (with the one students misremember: a . a' = 0),
 * XOR and XNOR identities, minterms and maxterms, sum of products and product of sums, proving equivalence, NAND and NOR as universal gates, and the majority function.
 * Real GATE questions (texts from public/data/questions.json), each re-solved here by truth table and by a program:
 * 2026 FN Q21 (F = (P' + Q) xor (P'Q) is XNOR: A and C), 2026 AN Q16 (a . a' = 1 is not a property: B), 2025 FN Q24 (majority function: B and D true),
 * 2025 AN Q50 (consensus and product forms: B and C true, A false), 2024 AN Q32 (x + 1 = x and x . x = 0 are false: B and C), 2024 FN Q62 (Sigma(3,5,6,7): A and B),
 * 2021 FN Q64 (the complement of F: B, C and D), 2019 FN Q18 (B is not an identity), 2018 FN Q14 (D is not correct), 2017 AN Q43 (C is incorrect).
 * Programs compiled and run with gcc: 1 0 0 1; 0 1 0 1; 0 1 1 1; 1 1 0 1; 3 5 6 7.
 */
export const chapterL2: Topic = {
  id: "cs.dl.v2.boolean2",
  title: "Gates and Boolean algebra",
  no: "L2",
  book: [
    { t: "p", text: "A digital circuit is built from a few kinds of gate, and the behaviour of any such circuit can be written as a Boolean expression. **Boolean algebra** is the arithmetic of those expressions: a small set of laws that let you simplify a circuit, prove two circuits equivalent, and rewrite one in a different form. It is the language the rest of the subject speaks, K-maps, adders, flip-flop inputs, so it is worth a chapter of its own." },
    { t: "p", text: "In the paper, Boolean algebra questions come in three shapes: **is this identity true** (decided by a truth table or by one law), **find an equivalent form** (a rewriting question), and **express a function as minterms or maxterms**. Ten of the 69 Digital Logic questions are of this kind, and every one is decided by writing the truth table, which has at most eight rows for three variables. This chapter gives the laws and the habit of checking by table." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["write the truth table of AND, OR, NOT, NAND, NOR, XOR and XNOR;", "use the laws of Boolean algebra, including De Morgan's laws, absorption and consensus;", "decide whether two expressions are equivalent, by laws or by truth table;", "convert a function between minterm (Σ) and maxterm (Π) form;", "write the complement of an expression;", "build any function from NAND gates alone or NOR gates alone;", "recognise the majority function and the XOR identities."] },

    { t: "h2", text: "Gates and truth tables" },
    { t: "p", text: "A Boolean variable takes the value 0 or 1. A **gate** computes a Boolean function of its inputs. The three basic gates are **AND** (output 1 only if all inputs are 1; written ab or a·b), **OR** (output 1 if any input is 1; written a + b) and **NOT** (output is the opposite; written a′ or ā). From these come **NAND** (NOT of AND), **NOR** (NOT of OR), **XOR** (output 1 when an odd number of inputs are 1, so for two inputs when they differ; written a ⊕ b) and **XNOR** (the complement of XOR: output 1 when the two inputs are equal; written a ⊙ b)." },
    { t: "table", head: ["a", "b", "AND", "OR", "NAND", "NOR", "XOR", "XNOR"], rows: [
      ["0", "0", "0", "0", "1", "1", "0", "1"], ["0", "1", "0", "1", "1", "0", "1", "0"], ["1", "0", "0", "1", "1", "0", "1", "0"], ["1", "1", "1", "1", "0", "0", "0", "1"],
    ], caption: "The two-input gates. Learn the XOR column: 0 1 1 0. XNOR is its complement, 1 0 0 1." },
    { t: "p", text: "A **truth table** lists the output of an expression for every combination of inputs: 2ⁿ rows for n variables. It is the ultimate judge in Boolean algebra: two expressions are equivalent exactly when their truth tables are the same. Everything else in this chapter, the laws, the simplifications, is a way to avoid writing the table, but when in doubt, write it." },
    { t: "p", text: "Take the function of GATE 2026, F(P, Q) = (P̄ + Q) ⊕ (P̄Q). Fill the table row by row. For P = 0, Q = 0: P̄ + Q = 1 and P̄Q = 0, so F = 1 ⊕ 0 = 1. For P = 0, Q = 1: P̄ + Q = 1 and P̄Q = 1, so F = 0. For P = 1, Q = 0: P̄ + Q = 0 and P̄Q = 0, so F = 0. For P = 1, Q = 1: P̄ + Q = 1 and P̄Q = 0, so F = 1. The column is 1 0 0 1, which is the **XNOR** of P and Q. It equals P ⊙ Q, the complement of P ⊕ Q (option A), and also P ⊕ Q̄ (option C), since complementing one input of an XOR complements its output." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    for (int p = 0; p <= 1; p++)
        for (int q = 0; q <= 1; q++) {
            int f = ((!p) | q) ^ ((!p) & q);          /* (P' + Q) xor (P'Q) */
            printf("%d ", f);
        }
    printf("\\n");
    return 0;
}`, out: "1 0 0 1", file: "truth_table_f.c" },
    { t: "ex", id: "l2-e1" },
    { t: "callout", kind: "key", text: "XOR column 0 1 1 0; XNOR column 1 0 0 1. Complementing one input of an XOR complements the output: a ⊕ b̄ = (a ⊕ b)′ = a ⊙ b. Complementing both inputs changes nothing: ā ⊕ b̄ = a ⊕ b." },

    { t: "h2", text: "The laws of Boolean algebra" },
    { t: "p", text: "Each law below can be checked with a two-row truth table for one variable, and each comes in two forms, one the **dual** of the other: swap AND and OR, and swap 0 and 1. If a law is true, so is its dual, which halves the number you must remember." },
    { t: "table", head: ["Law", "AND form", "OR form"], rows: [
      ["Identity", "a · 1 = a", "a + 0 = a"],
      ["Null (domination)", "a · 0 = 0", "a + 1 = 1"],
      ["Idempotent", "a · a = a", "a + a = a"],
      ["Complement", "a · a′ = 0", "a + a′ = 1"],
      ["Involution", "(a′)′ = a", ""],
      ["Commutative", "ab = ba", "a + b = b + a"],
      ["Associative", "(ab)c = a(bc)", "(a + b) + c = a + (b + c)"],
      ["Distributive", "a(b + c) = ab + ac", "a + bc = (a + b)(a + c)"],
      ["Absorption", "a(a + b) = a", "a + ab = a"],
      ["De Morgan", "(ab)′ = a′ + b′", "(a + b)′ = a′b′"],
      ["Consensus", "(a + b)(a′ + c)(b + c) = (a + b)(a′ + c)", "ab + a′c + bc = ab + a′c"],
    ], caption: "The laws of Boolean algebra, each with its dual. The OR form of distribution, a + bc = (a + b)(a + c), has no counterpart in ordinary arithmetic." },
    { t: "p", text: "Two of them are the ones students misremember. First, the **complement law is a · a′ = 0, not 1**: a variable and its opposite are never both 1, so their AND is 0 and their OR is 1. GATE 2026 asks which option is not a property of Boolean algebra, and the false one is 'a · a′ = 1'. Second, **x + 1 = 1**, not x, and **x · x = x**, not 0. GATE 2024 asks which of four statements are false: x · 1 = x (true), x + 1 = x (false), x · x = 0 (false), x + x̄ = 1 (true). The false statements are the second and third." },
    { t: "ex", id: "l2-e2" },
    { t: "p", text: "**De Morgan's laws** let you push a complement through a gate: the complement of an AND is the OR of the complements, and the complement of an OR is the AND of the complements. They extend to any number of terms and to whole expressions: to complement an expression, **complement every variable and swap AND with OR** (and 0 with 1). That is exactly how the complement of a product-of-sums is found in the next section's examples." },
    { t: "p", text: "**Absorption** is the law that cancels most terms in practice: a + ab = a (if a is 1, the whole is 1 whatever b is; if a is 0, ab is 0). Its cousin is the **consensus** law: in ab + āc + bc, the term bc is redundant, because whenever b and c are both 1, either a or ā is 1, so one of the other two terms is already 1. The two terms that give rise to the consensus term must have a variable in true form in one and in complemented form in the other. Consensus is the algebraic form of a K-map group that merely overlaps two others." },

    { t: "h2", text: "XOR, XNOR and their identities" },
    { t: "p", text: "XOR deserves its own rules because it appears everywhere (adders, parity, comparators). It is **commutative** and **associative**, so (x ⊕ y) ⊕ z = x ⊕ (y ⊕ z) and a long XOR is 1 exactly when an odd number of its inputs are 1. Other facts: a ⊕ 0 = a, a ⊕ 1 = ā, a ⊕ a = 0, a ⊕ ā = 1. And the expansion: a ⊕ b = ab̄ + āb." },
    { t: "p", text: "Test the identities in GATE 2019. 'x ⊕ y = x + y if xy = 0' is true: if x and y are never both 1, the only way the OR is 1 is when exactly one of them is, which is the XOR. 'x ⊕ y = (xy + x′y′)′' is true: xy + x′y′ is XNOR, and its complement is XOR. Associativity is true. But '(x + y) ⊕ z = x ⊕ (y + z)' is false: take x = 0, y = 1, z = 1. The left side is (0 + 1) ⊕ 1 = 0, the right side is 0 ⊕ (1 + 1) = 1. The option that is not a valid identity is that one." },
    { t: "p", text: "GATE 2018 does the same with the XNOR symbol ⊙. 'P ⊕ Q complemented equals P ⊙ Q' is the definition, true. 'P̄ ⊕ Q = P ⊙ Q' is true (complementing one input of an XOR gives XNOR). 'P̄ ⊕ Q̄ = P ⊕ Q' is true (two complements cancel). The fourth, '(P ⊕ P̄) ⊕ Q = (P ⊙ P̄) ⊙ Q̄', is the false one: the left side is 1 ⊕ Q = Q̄, the right side is 0 ⊙ Q̄ = (0 ⊕ Q̄)′ = Q, so they are opposite." },
    { t: "ex", id: "l2-e3" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Minterms, maxterms and the two canonical forms" },
    { t: "p", text: "A **minterm** is an AND of all the variables, each in true or complemented form, which is 1 for exactly one input combination. With three variables X, Y, Z, the combination 011 (X = 0, Y = 1, Z = 1) has the minterm X̄YZ, numbered m₃ because 011 is binary 3. A **maxterm** is an OR of all the variables, 0 for exactly one combination; the maxterm for 011 is X + Ȳ + Z̄, numbered M₃." },
    { t: "p", text: "A function can be written as the **sum of the minterms** for which it is 1 (the canonical **sum of products**, written Σm(…)), or as the **product of the maxterms** for which it is 0 (the canonical **product of sums**, written ΠM(…)). The two lists are complementary: the numbers in Σ and the numbers in Π together are all of 0 to 2ⁿ − 1. So F = Σ(3, 5, 6, 7) with three variables is the same as F = Π(0, 1, 2, 4)." },
    { t: "fig", id: "l2-f1" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    for (int m = 0; m < 8; m++) {
        int x = m >> 2 & 1, y = m >> 1 & 1, z = m & 1;       /* X is the most significant bit */
        int f = (x & y) | (y & z) | (x & z);                  /* the candidate: XY + YZ + XZ */
        if (f) printf("%d ", m);
    }
    printf("\\n");
    return 0;
}`, out: "3 5 6 7", file: "minterms.c" },
    { t: "p", text: "The program lists the minterms of XY + YZ + XZ: 3, 5, 6, 7, which is exactly the function of GATE 2024. So F = Σ(3, 5, 6, 7) = XY + YZ + XZ (statement B true), F = Π(0, 1, 2, 4) (statement A true), and F depends on all three variables, so it is not independent of Y or of X (C and D false). To test dependence on a variable, ask whether flipping it can change the output for some setting of the others: flipping Y in X = 1, Z = 0 changes F from 0 (minterm 4) to 1 (minterm 6)." },
    { t: "ex", id: "l2-e4" },
    { t: "p", text: "To **complement** a function in minterm form, take the minterms that are missing: the complement of Σ(3, 5, 6, 7) is Σ(0, 1, 2, 4). To convert an expression's complement to a product of sums, use De Morgan. GATE 2021 gives F = (X + Y + Z)(X̄ + Y)(Ȳ + Z) and asks which expressions equal F̄. The truth table of F shows it is 1 exactly at 001, 011 and 111, so F = Σ(1, 3, 7) and F̄ = Σ(0, 2, 4, 5, 6). Checking each option against that set: (X̄ + Ȳ + Z̄)(X + Ȳ)(Y + Z̄) is **not** F̄ (it is the dual, not the complement); XȲ + Z̄ is F̄; (X + Z̄)(Ȳ + Z̄) is F̄ (it expands to XȲ + Z̄); and XȲ + YZ̄ + X̄ȲZ̄ is F̄. The correct options are B, C and D." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int ok[4] = {1, 1, 1, 1};
    for (int m = 0; m < 8; m++) {
        int x = m >> 2 & 1, y = m >> 1 & 1, z = m & 1;
        int fbar = !((x | y | z) & (!x | y) & (!y | z));              /* the complement of F */
        int a = (!x | !y | !z) & (x | !y) & (y | !z);
        int b = (x & !y) | !z;
        int c = (x | !z) & (!y | !z);
        int d = (x & !y) | (y & !z) | (!x & !y & !z);
        ok[0] &= (a == fbar); ok[1] &= (b == fbar); ok[2] &= (c == fbar); ok[3] &= (d == fbar);
    }
    printf("%d %d %d %d\\n", ok[0], ok[1], ok[2], ok[3]);
    return 0;
}`, out: "0 1 1 1", file: "complement_options.c" },
    { t: "ex", id: "l2-e5" },

    { t: "h2", text: "Proving equivalence and simplifying" },
    { t: "p", text: "Two ways to show that two expressions are equal: **by laws** (rewrite one into the other) or **by truth table** (compare all rows). The first is faster when it works and gives insight; the second always works. For an MSQ question with four identities, run the table for each, or use a law for the quick ones." },
    { t: "p", text: "Look at GATE 2025's four equations. **B: AB + ĀC + BC = AB + ĀC** is the consensus law: true. **C: (A + C)(Ā + B) = AB + ĀC**: expand the left side to AĀ + AB + ĀC + BC = 0 + AB + ĀC + BC, and the term BC is the consensus term of AB and ĀC, so it is absorbed: true. **A**: the left side, the sum of five minterms ĀBC, AB̄C̄, ĀB̄C, ĀBC (a repeat) and ABC, is Σ(1, 3, 4, 7); the right side BC + B̄C̄ + ĀB is Σ(0, 2, 3, 4, 7): they differ at minterms 0, 1 and 2, so A is false. The fourth equation, a product of four sums with a claimed value ĀD + CD̄, is the one defective item in the question bank: as printed it fails at points where D = 1, so it cannot be checked from the printed text; the official key counts it as correct, and the identities B and C are the ones to rely on here." },
    { t: "ex", id: "l2-e6" },
    { t: "p", text: "Look at the algebra in GATE 2017: which of four simplifications is incorrect? **(A)** wx + w(x + y) + x(x + y) = x + wy: expand to wx + wx + wy + x + xy, absorb wx, xy into x: x + wy: correct. **(B)** the complement of w x̄ (y + z̄) is w̄ + x + ȳz by De Morgan; adding w̄x changes nothing: correct. **(D)** (w + y)(wxy + wyz) = wxy + wyz by absorption (the second factor already implies w and y): correct. **(C)** (w x̄ (y + x z̄) + w̄ x̄) y: the term x̄·x z̄ is zero, leaving (w x̄ y + w̄ x̄) y = w x̄ y + w̄ x̄ y = x̄ y, but the claimed value is x ȳ: **incorrect**. The answer is C." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int ok[4] = {1, 1, 1, 1};
    for (int m = 0; m < 16; m++) {
        int w = m >> 3 & 1, x = m >> 2 & 1, y = m >> 1 & 1, z = m & 1;
        ok[0] &= ((w & x | w & (x | y) | x & (x | y)) == (x | (w & y)));
        ok[1] &= ((!(w & !x & (y | !z)) | (!w & x)) == (!w | x | (!y & z)));
        ok[2] &= (((((w & !x & (y | (x & !z))) | (!w & !x)) & y)) == (x & !y));
        ok[3] &= ((((w | y) & ((w & x & y) | (w & y & z)))) == ((w & x & y) | (w & y & z)));
    }
    printf("%d %d %d %d\\n", ok[0], ok[1], ok[2], ok[3]);
    return 0;
}`, out: "1 1 0 1", file: "identities_2017.c" },
    { t: "ex", id: "l2-e7" },

    { t: "h2", text: "Universal gates and the majority function" },
    { t: "p", text: "NAND and NOR are called **universal gates**: every Boolean function can be built from NAND gates alone, or from NOR gates alone. For NAND: a NAND with its inputs tied together is a NOT; a NAND followed by a NOT is an AND; and NOT-ing the inputs of a NAND gives an OR, by De Morgan: (ā · b̄)′ = a + b. NOR works the same way with the roles swapped. This is why chips are built from one kind of gate, and why the minimum number of NOR gates to build a function is a standard question, answered in the next chapter after the function has been minimised." },
    { t: "p", text: "The **majority function** X(a, b, c) = ab + bc + ca is 1 when at least two of its three inputs are 1; it is the carry output of a full adder. It is **self-dual** (complementing all inputs complements the output) and symmetric in its inputs. GATE 2025 tests chains of it: 'X(a, b, X(a, b, c)) = X(a, b, c)' is true (if a = b, both sides equal a; otherwise the inner X equals c and the outer equals c), and 'X(a, b, c) = X(a, X(a, b, c), X(a, c, c))' is true because X(a, c, c) = c and the right side then reduces to X(a, X(a,b,c), c), which is the majority again. 'X(a, b, X(c, d, e)) = X(X(a, b, c), d, e)' is false: try a = b = 0, c = d = e = 1: the left is X(0, 0, 1) = 0, the right is X(0, 1, 1) = 1. And 'X(a, b, X(a, c, d)) = X(a, b, a) AND X(c, d, c)' is false, since X(a, b, a) = a and X(c, d, c) = c, but the left side is not simply a·c. The true statements are B and D." },
    { t: "code", text: `#include <stdio.h>

int X(int a, int b, int c) { return (a & b) | (b & c) | (a & c); }

int main(void) {
    int ok[4] = {1, 1, 1, 1};
    for (int m = 0; m < 32; m++) {
        int a = m >> 4 & 1, b = m >> 3 & 1, c = m >> 2 & 1, d = m >> 1 & 1, e = m & 1;
        ok[0] &= (X(a, b, X(c, d, e)) == X(X(a, b, c), d, e));
        ok[1] &= (X(a, b, X(a, b, c)) == X(a, b, c));
        ok[2] &= (X(a, b, X(a, c, d)) == (X(a, b, a) & X(c, d, c)));
        ok[3] &= (X(a, b, c) == X(a, X(a, b, c), X(a, c, c)));
    }
    printf("%d %d %d %d\\n", ok[0], ok[1], ok[2], ok[3]);
    return 0;
}`, out: "0 1 0 1", file: "majority_chain.c" },
    { t: "ex", id: "l2-e8" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Gates: AND, OR, NOT, NAND, NOR, XOR (0 1 1 0), XNOR (1 0 0 1). Equivalence = same truth table.", "Complement law: a · a′ = 0 and a + a′ = 1; null law: a + 1 = 1, a · 0 = 0; idempotent: a · a = a.", "De Morgan: complement every variable and swap AND with OR. Absorption: a + ab = a. Consensus: ab + āc + bc = ab + āc.", "XOR: associative; a ⊕ b̄ = (a ⊕ b)′; ā ⊕ b̄ = a ⊕ b; x + y = x ⊕ y only when xy = 0.", "Σ and Π lists are complementary within 0..2ⁿ − 1; the complement of Σ is the missing minterms; Σ(3, 5, 6, 7) = XY + YZ + XZ (majority) = Π(0, 1, 2, 4).", "NAND alone or NOR alone can build any function.", "When unsure, write the truth table: at most 8 rows for 3 variables, 16 for 4."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "l2-f1", caption: "The truth table of F(X, Y, Z) = Σ(3, 5, 6, 7), the majority function. The rows where F is 1 are the minterms; the rows where F is 0 are the maxterms 0, 1, 2, 4.", alt: "A table of the eight input combinations of X, Y, Z with the minterm number and the value of F, which is 1 for 3, 5, 6 and 7.", fig: { kind: "trace", title: "F = Σ(3, 5, 6, 7) = Π(0, 1, 2, 4)", cols: ["m", "X Y Z", "F"], rows: [
      { cells: [0, "0 0 0", 0] }, { cells: [1, "0 0 1", 0] }, { cells: [2, "0 1 0", 0] }, { cells: [3, "0 1 1", 1], tone: "ok" },
      { cells: [4, "1 0 0", 0] }, { cells: [5, "1 0 1", 1], tone: "ok" }, { cells: [6, "1 1 0", 1], tone: "ok" }, { cells: [7, "1 1 1", 1], tone: "ok" },
    ] } },
    { type: "figure", id: "l2-f2", caption: "De Morgan's laws as a table. The complement of an AND is the OR of the complements (the NAND column equals ā + b̄); the complement of an OR is the AND of the complements (the NOR column equals ā b̄).", alt: "A table with a and b, the NAND and NOR outputs and the matching expressions a-bar OR b-bar and a-bar AND b-bar.", fig: { kind: "trace", title: "(ab)′ = ā + b̄ and (a + b)′ = ā b̄", cols: ["a b", "(ab)′", "ā + b̄", "(a + b)′", "ā b̄"], rows: [
      { cells: ["0 0", 1, 1, 1, 1] }, { cells: ["0 1", 1, 1, 0, 0] }, { cells: ["1 0", 1, 1, 0, 0] }, { cells: ["1 1", 0, 0, 0, 0] },
    ] } },

    { type: "example", id: "l2-e1", level: "gate", title: "GATE CS 2026 (forenoon), Q21 · 1 mark · MSQ: what F = (P̄ + Q) ⊕ (P̄Q) equals", file: "gate2026_fn_q21.txt", given: `F(P, Q) = (P' + Q) xor (P'Q). Which are equivalent to F?
A) complement of (P xor Q)   B) P xor Q   C) P xor Q'   D) P' xor Q'`, find: "The equivalent expressions.", steps: [
      { say: "Truth table of F in the order PQ = 00, 01, 10, 11: (P' + Q) is 1, 1, 0, 1 and P'Q is 0, 1, 0, 0, so F = 1, 0, 0, 1.", result: "F = 1 0 0 1" },
      { say: "That column is XNOR. P xor Q is 0 1 1 0, so its complement (A) is 1 0 0 1: match. P xor Q' flips one input of an XOR, so it equals the complement of P xor Q: 1 0 0 1: match (C).", result: "A and C" },
      { say: "B is 0 1 1 0 and D, P' xor Q', equals P xor Q (two complements cancel): both are the opposite of F.", result: "B, D no" },
    ], answer: "A, C", check: "The program in this chapter prints 1 0 0 1." },
    { type: "example", id: "l2-e2", level: "gate", title: "GATE CS 2024 (afternoon), Q32 · 1 mark · MSQ: which statements about a Boolean variable are false", file: "gate2024_an_q32.txt", given: `For a Boolean variable x, which statements are FALSE?
A) x . 1 = x   B) x + 1 = x   C) x . x = 0   D) x + x' = 1`, find: "The false statements.", steps: [
      { say: "x · 1 = x is the identity law: true.", result: "A true" },
      { say: "x + 1 = 1 (null law), not x: false for x = 0.", result: "B false" },
      { say: "x · x = x (idempotent), not 0: false for x = 1.", result: "C false" },
      { say: "x + x' = 1 is the complement law: true.", result: "D true" },
    ], answer: "B, C", check: "The 2026 afternoon question asks the same law in reverse: a · a' = 1 is false, because a · a' = 0." },
    { type: "example", id: "l2-e3", level: "gate", title: "GATE CS 2019 (forenoon), Q18 · 1 mark · which is not a valid identity", file: "gate2019_fn_q18.txt", given: `A) (x xor y) xor z = x xor (y xor z)   B) (x + y) xor z = x xor (y + z)   C) x xor y = x + y if xy = 0   D) x xor y = (xy + x'y')'`, find: "The invalid identity.", steps: [
      { say: "A: XOR is associative. Valid.", result: "A valid" },
      { say: "C: if x and y are never both 1, the OR is 1 only when exactly one is 1: the XOR. Valid. D: xy + x'y' is XNOR, whose complement is XOR. Valid.", result: "C, D valid" },
      { say: "B: take x = 0, y = 1, z = 1. Left: (0 + 1) xor 1 = 0. Right: 0 xor (1 + 1) = 1. They differ.", result: "B invalid" },
    ], answer: "B", check: "A single counterexample settles an identity question." },
    { type: "example", id: "l2-e4", level: "gate", title: "GATE CS 2024 (forenoon), Q62 · 2 marks · MSQ: F = Σ(3, 5, 6, 7)", file: "gate2024_fn_q62.txt", given: `F(X, Y, Z) = Sigma(3, 5, 6, 7). Which are correct?
A) F = Pi(0, 1, 2, 4)   B) F = XY + YZ + XZ   C) F is independent of Y   D) F is independent of X`, find: "The correct statements.", steps: [
      { say: "With three variables the minterm numbers 0 to 7 split into Σ (where F = 1) and Π (where F = 0): the zeros are 0, 1, 2, 4.", result: "A true" },
      { say: "XY + YZ + XZ is 1 at 011, 101, 110 and 111: minterms 3, 5, 6, 7.", result: "B true" },
      { say: "Flipping Y at X = 1, Z = 0 changes F from 0 (minterm 4) to 1 (minterm 6): F depends on Y. By symmetry it depends on X too.", result: "C, D false" },
    ], answer: "A, B", check: "The program in this chapter prints 3 5 6 7." },
    { type: "example", id: "l2-e5", level: "gate", title: "GATE CS 2021 (forenoon), Q64 · 2 marks · MSQ: the complement of F", file: "gate2021_fn_q64.txt", given: `F = (X + Y + Z)(X' + Y)(Y' + Z). Which are equivalent to F'?
A) (X' + Y' + Z')(X + Y')(Y + Z')   B) X Y' + Z'   C) (X + Z')(Y' + Z')   D) X Y' + Y Z' + X' Y' Z'`, find: "The expressions equal to F'.", steps: [
      { say: "F is 1 only at XYZ = 001, 011, 111, so F = Σ(1, 3, 7) and F' = Σ(0, 2, 4, 5, 6).", result: "F' = 0 2 4 5 6" },
      { say: "B: XY' + Z' is 1 at 100, 101 (XY'), and at 000, 010, 100, 110 (Z'): minterms 0, 2, 4, 5, 6. Match.", result: "B yes" },
      { say: "C expands to X Y' + Z' (XZ' + XY' + Z'Y' + Z', and Z' absorbs the terms with Z'): match. D: XY' covers 4, 5; YZ' covers 2, 6; X'Y'Z' is 0: minterms 0, 2, 4, 5, 6: match.", result: "C, D yes" },
      { say: "A is the product of the complemented sums, the dual of F, not its complement: it is 1 at 000, 100 and 110 only.", result: "A no" },
    ], answer: "B, C, D", check: "The program in this chapter prints 0 1 1 1 for the four options." },
    { type: "example", id: "l2-e6", level: "gate", title: "GATE CS 2025 (afternoon), Q50 · 2 marks · MSQ: which equations are correct", file: "gate2025_an_q50.txt", given: `B) AB + A'C + BC = AB + A'C   C) (A + C)(A' + B) = AB + A'C   A) A'BC + AB'C' + A'B'C + A'BC + ABC = BC + B'C' + A'B`, find: "The correct equations.", steps: [
      { say: "B is the consensus law: BC is redundant.", result: "B true" },
      { say: "C: (A + C)(A' + B) = AA' + AB + A'C + BC = AB + A'C + BC, and BC is the consensus of AB and A'C, so it is absorbed.", result: "C true" },
      { say: "A: the left side lists minterms 3, 4, 1, 3, 7: Σ(1, 3, 4, 7). The right side BC + B'C' + A'B is Σ(3, 7) + Σ(0, 4) + Σ(2, 3) = Σ(0, 2, 3, 4, 7). They differ at 0, 1, 2.", result: "A false" },
    ], answer: "B, C", check: "The option with the product of four sums is printed incorrectly in the bank, so only B and C can be verified from the text." },
    { type: "example", id: "l2-e7", level: "gate", title: "GATE CS 2017 (afternoon), Q43 · 2 marks · which simplification is incorrect", file: "gate2017_an_q43.txt", given: `A) wx + w(x + y) + x(x + y) = x + wy
B) (w x' (y + z'))' + w'x = w' + x + y'z
C) (w x' (y + x z') + w' x') y = x y'
D) (w + y)(wxy + wyz) = wxy + wyz`, find: "The incorrect one.", steps: [
      { say: "A: expand to wx + wx + wy + x + xy, absorb wx and xy into x: x + wy. Correct.", result: "A correct" },
      { say: "B: De Morgan: the complement of w x' (y + z') is w' + x + y'z; adding w'x changes nothing. Correct. D: the second factor implies w and y, so (w + y) is absorbed. Correct.", result: "B, D correct" },
      { say: "C: x' · x z' = 0, so the bracket is w x' y + w' x'; times y gives w x' y + w' x' y = x' y. The claim is x y', which is different.", result: "C incorrect" },
    ], answer: "C", check: "The program in this chapter prints 1 1 0 1." },
    { type: "example", id: "l2-e8", level: "gate", title: "GATE CS 2025 (forenoon), Q24 · 1 mark · MSQ: chains of the majority function", file: "gate2025_fn_q24.txt", given: `X(a, b, c) = 1 when at least two inputs are 1. Which are correct?
A) X(a, b, X(c, d, e)) = X(X(a, b, c), d, e)   B) X(a, b, X(a, b, c)) = X(a, b, c)
C) X(a, b, X(a, c, d)) = X(a, b, a) AND X(c, d, c)   D) X(a, b, c) = X(a, X(a, b, c), X(a, c, c))`, find: "The correct statements.", steps: [
      { say: "A: a = b = 0 and c = d = e = 1. Left: X(0, 0, 1) = 0. Right: X(0, 1, 1) = 1. False.", result: "A false" },
      { say: "B: if a = b, both sides equal a; if a differs from b, the inner X equals c and the outer equals c. True.", result: "B true" },
      { say: "D: X(a, c, c) = c, so the right side is X(a, X(a, b, c), c). If a = c this is a (and X(a, b, c) = a); otherwise it equals X(a, b, c). True.", result: "D true" },
      { say: "C: X(a, b, a) = a and X(c, d, c) = c, so the right side is a AND c. Take a = 0, b = 1, c = d = 1: the left side is X(0, 1, X(0, 1, 1)) = X(0, 1, 1) = 1, the right is 0. False.", result: "C false" },
    ], answer: "B, D", check: "The program in this chapter checks all 32 input combinations and prints 0 1 0 1." },

    { type: "trap", wrong: "The complement law is a · a′ = 1.", tempting: "Complements 'add up' to 1, as a + a′ = 1.", whyWrong: "The two forms of the law are dual: a + a′ = 1 (a variable or its opposite is always 1) and a · a′ = 0 (a variable and its opposite are never both 1). Writing 1 for both is the commonest slip in Boolean algebra.", rule: "OR gives 1, AND gives 0.", ex: { text: "a = 1: a · a′ = 1 · 0 = 0; a = 0: 0 · 1 = 0." } },
    { type: "trap", wrong: "To complement an expression, complement every variable and keep the same operators.", tempting: "Complementing each variable seems to complement the whole.", whyWrong: "You must also swap AND with OR (De Morgan). Complementing only the variables of a product-of-sums gives its DUAL, which is a different function. In GATE 2021, (X′ + Y′ + Z′)(X + Y′)(Y + Z′) is the dual of F, not F′.", rule: "Complement of an expression: complement each variable AND swap AND with OR.", ex: { text: "(a + b)′ = a′b′, not a′ + b′." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q21 · 2026 AN Q16 (in the laws section) · 2025 FN Q24 · 2025 AN Q50 · 2024 FN Q62 · 2024 AN Q32 · 2021 FN Q64 · 2019 FN Q18 · 2018 FN Q14 · 2017 AN Q43. Every Boolean-algebra question of the bank that is not about minimisation is solved here." },
    { type: "recall", cards: [
      { q: "The XOR truth column?", a: "0 1 1 0 (inputs 00, 01, 10, 11); XNOR is 1 0 0 1." },
      { q: "a · a′ and a + a′?", a: "a · a′ = 0 and a + a′ = 1." },
      { q: "a + 1 and a · a?", a: "a + 1 = 1 and a · a = a." },
      { q: "De Morgan?", a: "(ab)′ = a′ + b′ and (a + b)′ = a′b′." },
      { q: "Absorption?", a: "a + ab = a and a(a + b) = a." },
      { q: "Consensus?", a: "ab + a′c + bc = ab + a′c." },
      { q: "a ⊕ b̄ equals?", a: "(a ⊕ b)′ = a ⊙ b." },
      { q: "When does x ⊕ y = x + y?", a: "When xy = 0." },
      { q: "Σ(3, 5, 6, 7) in product form?", a: "Π(0, 1, 2, 4)." },
      { q: "The majority function X(a, b, c)?", a: "ab + bc + ca; the carry of a full adder." },
      { q: "Which gates are universal?", a: "NAND and NOR." },
      { q: "The sure way to test an identity?", a: "Compare truth tables." },
    ] },
    { type: "check", questions: [
      { id: "l2c1", kind: "NAT", marks: 1, q: "How many rows does the truth table of a function of 5 variables have?", answer: "32", solution: "2⁵ = 32." },
      { id: "l2c2", kind: "MCQ", marks: 1, q: "x + x̄y simplifies to", options: ["x", "y", "x + y", "xy"], answer: "C", solution: "Distribute: (x + x̄)(x + y) = x + y." },
      { id: "l2c3", kind: "MSQ", marks: 2, q: "Which are true for all Boolean a, b?", options: ["(a + b)′ = a′b′", "a ⊕ a = 1", "a + ab = a", "a ⊕ 1 = a′"], answer: "A, C, D", solution: "a ⊕ a = 0." },
      { id: "l2c4", kind: "NAT", marks: 1, q: "How many minterms does the function XOR of three variables, x ⊕ y ⊕ z, have?", answer: "4", solution: "It is 1 when an odd number of inputs are 1: minterms 1, 2, 4, 7." },
      { id: "l2c5", kind: "MCQ", marks: 2, q: "The complement of F = Σ(0, 3, 5) of three variables is", options: ["Σ(1, 2, 4, 6, 7)", "Σ(1, 2, 4, 7)", "Π(0, 3, 5)", "Σ(0, 3, 5)"], answer: "A", solution: "The missing minterms of 0..7." },
      { id: "l2c6", kind: "NAT", marks: 2, q: "The function f = ab + a′c + bc has how many minterms (three variables a, b, c)?", answer: "4", solution: "Consensus: f = ab + a′c: minterms 110, 111, 001, 011: four." },
      { id: "l2c7", kind: "MCQ", marks: 2, q: "Which expression equals (A + B)(A + C)?", options: ["A + BC", "AB + AC", "A + B + C", "ABC"], answer: "A", solution: "The OR form of distribution." },
      { id: "l2c8", kind: "MSQ", marks: 2, q: "Which gate sets are universal?", options: ["NAND only", "NOR only", "AND and OR only", "XOR and NOT only"], answer: "A, B", solution: "AND and OR (no NOT) cannot make a complement; XOR and NOT cannot make AND." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on Boolean algebra", sub: "Digital Logic", href: "/topics/digital-logic" }, { label: "Minimisation: K-maps", sub: "the next chapter", href: "/study/minimisation" }] },
    { type: "links", prereq: ["Number representation (L1)"], usedIn: ["Minimisation (L3)", "Combinational circuits (L4)", "Sequential circuits (L5)"], cross: ["Discrete Mathematics: propositional logic"] },
  ],
};
