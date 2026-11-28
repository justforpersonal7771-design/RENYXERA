import type { Topic } from "@/lib/study/schema";

/**
 * Digital Logic chapter L4 "Combinational circuits and hazards" (28 Nov 2026). Multiplexers, demultiplexers, decoders, encoders, adders, address decoding and chip select,
 * reading a circuit as a function, and static hazards (glitches). Real GATE questions (texts from public/data/questions.json, circuits read from public/images), each re-solved here:
 * 2026 AN Q59 (decoder feeding a 4-to-1 mux: 6), 2024 FN Q49 (three 2-to-1 muxes: 4), 2023 FN Q44 (two 4-to-1 and one 2-to-1 mux: option C), 2021 AN Q56 (f as a 4-to-1 mux: option A),
 * 2024 AN Q46 (AND, OR and XOR of minterm lists: C and D), 2019 FN Q56 (AND then XOR: Sigma(7, 8, 11)), 2025 AN Q31 (NAND, NOT, AND into OR: A, B and C),
 * 2020 FN Q54 (OR of a and b'c: Sigma(1, 4, 5, 6, 7)), 2024 FN Q17 (X AND NOT X: always 0, a transient 1 after a rise: A and C), 2019 FN Q22 (chip select: C800 to CFFF),
 * 2022 FN Q40 (decoders and a 2-to-1 mux: option C), 2020 FN Q25 (5 select lines) and Q26 (m + n = 1034).
 * Programs compiled and run with gcc: 6; 1; 7 8 11 and 0..7; C800 CFFF; the glitch simulation.
 */
export const chapterL4: Topic = {
  id: "cs.dl.v2.comb4",
  title: "Combinational circuits and hazards",
  no: "L4",
  book: [
    { t: "p", text: "A **combinational circuit** is one whose output depends only on its inputs **right now**: no memory, no clock. Every circuit of gates without a loop is combinational. The standard building blocks are the **multiplexer**, the **decoder**, the **encoder** and the **adder**, and a large part of the paper asks you to read a small circuit of such blocks and say what function it computes, or to design one." },
    { t: "p", text: "Thirteen questions in the bank are on this chapter, and eleven of them show a circuit as a picture. The skill is always the same: **write down the output of each block as a function of its inputs, then substitute**, working from the inputs towards the output. This chapter gives the behaviour of each block, then reads every circuit of the paper from its picture." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["state what a multiplexer, demultiplexer, decoder and encoder do and how many select lines each needs;", "implement a Boolean function with a multiplexer;", "read a circuit made of gates and multiplexers and write its truth table or minterm list;", "design an address decoder and find the range of addresses a chip-select circuit enables;", "build a full adder and explain carry propagation;", "recognise a static hazard and say when a glitch can occur."] },

    { t: "h2", text: "Multiplexers" },
    { t: "p", text: "A **multiplexer** (mux) is a data selector: with n select lines it chooses one of 2ⁿ data inputs and sends it to the single output. A 2-to-1 mux has one select line S: the output is I₀ when S = 0 and I₁ when S = 1, that is, Y = S̄·I₀ + S·I₁. A 4-to-1 mux has two select lines S₁S₀ (S₁ the more significant) and Y = I_(S₁S₀). A 32-to-1 mux, as in the register-to-accumulator question of GATE 2020, needs log₂ 32 = **5** select lines." },
    { t: "p", text: "A mux is a **universal** logic element: any function of n variables can be built from a 2ⁿ⁻¹-to-1 mux, by connecting n − 1 of the variables to the select lines and feeding each data input with 0, 1, the last variable or its complement. The rule: for each combination of the select variables, look at what the function does as the remaining variable changes, and write 0, 1, x or x̄ accordingly." },
    { t: "p", text: "GATE 2021 asks which 4-to-1 mux circuit implements f(x, y, z) = m₀ + m₁ + m₃ + m₄ + m₅ + m₆, with y and z on the select lines (s₁ = y, s₀ = z). For yz = 00 the minterms 0 (x = 0) and 4 (x = 1) are both in f: input 0 is 1. For yz = 01 the minterms 1 and 5 are both in f: input 1 is 1. For yz = 10 only minterm 6 (x = 1) is in f (minterm 2 is not): input 2 is x. For yz = 11 only minterm 3 (x = 0) is in f (minterm 7 is not): input 3 is x̄. So the circuit has inputs (1, 1, x, x̄): the one drawn as option (d), which is listed as option A in the question." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int ok = 1;
    for (int m = 0; m < 8; m++) {
        int x = m >> 2 & 1, y = m >> 1 & 1, z = m & 1;
        int want = (m == 0 || m == 1 || m == 3 || m == 4 || m == 5 || m == 6);   /* the function */
        int in[4] = {1, 1, x, !x};                                                 /* data inputs of the mux */
        ok &= (in[y * 2 + z] == want);                                             /* select = yz */
    }
    printf("%d\\n", ok);
    return 0;
}`, out: "1", file: "mux_function.c" },
    { t: "fig", id: "l4-f2" },
    { t: "ex", id: "l4-e1" },
    { t: "p", text: "Muxes can be **chained**: the outputs of two muxes are the data inputs of a third. In GATE 2024 three 2-to-1 muxes are arranged so that M₁ (select A) chooses between X₁ and X₂, M₂ (select B) between X₃ and X₄, and M₃ (select C) between the outputs of M₁ and M₂. With X₁ = X₂ = 1, M₁ outputs 1 whatever A is; with X₃ = X₄ = 0, M₂ outputs 0 whatever B is. So Y = 1 exactly when M₃ passes M₁, that is, when C = 0: of the eight combinations of A, B, C, four give Y = 1." },
    { t: "p", text: "A bigger chain appears in GATE 2023: two 4-to-1 muxes M₁ and M₂ share the selects A (as S₁) and C (as S₀), and a 2-to-1 mux M₃ with select B chooses between them. So the function is a three-variable function with B as the most significant choice: for B = 0 the inputs X₀ to X₃ matter, for B = 1 the inputs X₄ to X₇. The question: which inputs realise Ā + Ā·C̄ + A·B̄·C, which simplifies to Ā + A B̄ C? For B = 0: with (A, C) = 00, 01, 10, 11 the function is 1, 1, 0 (A = 1, C = 0 is 0), 1 (A B̄ C = 1): so X₀..X₃ = 1, 1, 0, 1. For B = 1: A = 0 gives 1, A = 1 gives 0 (B̄ is 0): X₄..X₇ = 1, 1, 0, 0. The inputs are (1, 1, 0, 1, 1, 1, 0, 0): option C." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int X[8] = {1, 1, 0, 1, 1, 1, 0, 0}, ok = 1;
    for (int m = 0; m < 8; m++) {
        int A = m >> 2 & 1, B = m >> 1 & 1, C = m & 1;
        int q1 = X[A * 2 + C], q2 = X[4 + A * 2 + C];               /* M1 and M2: selects A (S1) and C (S0) */
        int y = B ? q2 : q1;                                         /* M3 selected by B */
        int want = !A | (A & !B & C);                                /* A' + A B' C */
        ok &= (y == want);
    }
    printf("%d\\n", ok);
    return 0;
}`, out: "1", file: "mux_chain.c" },
    { t: "ex", id: "l4-e2" },
    { t: "ex", id: "l4-e3" },

    { t: "h2", text: "Decoders, encoders and demultiplexers" },
    { t: "p", text: "A **decoder** (n-to-2ⁿ) takes an n-bit code and raises exactly one of its 2ⁿ outputs: the output whose number equals the input. An active-high 2-to-4 decoder with inputs A, B has outputs D₀ = ĀB̄, D₁ = ĀB, D₂ = AB̄, D₃ = AB: each output is **one minterm** of the inputs. That is why a decoder plus an OR gate implements any function given as a sum of minterms, and why a decoder with an enable input is the basic address decoder." },
    { t: "p", text: "A **demultiplexer** (demux) is the reverse of a mux: one data input is steered to one of 2ⁿ outputs chosen by the select lines. A decoder with the enable line used as data input is a demux. An **encoder** is the reverse of a decoder: 2ⁿ input lines (one active) are turned into the n-bit number of the active line; a **priority encoder** gives the highest-numbered active input when several are active." },
    { t: "p", text: "GATE 2026 joins a decoder to a mux. The decoder Q has inputs A and B and its outputs D₀ to D₃ go to the mux M as follows: D₀ to input 0, constant 0 to input 1, constant 1 to input 2, D₃ to input 3; the mux selects with S₁S₀. How many of the 16 combinations of [A B S₁ S₀] give Y = 1? For S₁S₀ = 00 the output is D₀, which is 1 only when AB = 00: 1 combination. For S₁S₀ = 01 the output is the constant 0: none. For S₁S₀ = 10 it is the constant 1: all four AB values. For S₁S₀ = 11 it is D₃, 1 only when AB = 11: 1 combination. Total 1 + 0 + 4 + 1 = **6**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int count = 0;
    for (int m = 0; m < 16; m++) {
        int A = m >> 3 & 1, B = m >> 2 & 1, s1 = m >> 1 & 1, s0 = m & 1;
        int d[4] = {0, 0, 0, 0};
        d[A * 2 + B] = 1;                                    /* the 2-to-4 decoder raises one output */
        int in[4] = {d[0], 0, 1, d[3]};                      /* what feeds the mux inputs 0..3 */
        count += in[s1 * 2 + s0];
    }
    printf("%d\\n", count);
    return 0;
}`, out: "6", file: "decoder_mux.c" },
    { t: "ex", id: "l4-e4" },
    { t: "fig", id: "l4-f1" },

    { t: "h2", text: "Reading a circuit of gates" },
    { t: "p", text: "For a circuit of plain gates, name every wire. The output of each gate is a function of the wires that feed it. Work from the left, and simplify as you go." },
    { t: "p", text: "GATE 2020's circuit has an OR gate fed by a and by the output of an AND gate; the AND gate is fed by c and by b passed through a NOT. So z = a + b̄c. The minterms (taking a as the most significant bit): a = 1 gives 4, 5, 6, 7; b̄c = 1 for b = 0, c = 1, which are 001 and 101, minterms 1 and 5. So z = Σ(1, 4, 5, 6, 7): option B." },
    { t: "p", text: "GATE 2025's circuit has three branches feeding an OR gate. A NAND of Y and X gives (XY)′; a NOT of X gives X̄; an AND of X and the NOT of Y gives XȲ. So F = (XY)′ + X̄ + XȲ. Since (XY)′ = X̄ + Ȳ, F = X̄ + Ȳ + XȲ = X̄ + Ȳ (Ȳ absorbs XȲ), which is (XY)′. The options equal to it are A, (XY)′ itself; B, X̄ + Ȳ + XȲ, which simplifies to X̄ + Ȳ; and C, which is the circuit's own expression. D, X + Ȳ, is not equal." },
    { t: "ex", id: "l4-e5" },
    { t: "ex", id: "l4-e6" },
    { t: "p", text: "Circuits can also combine **whole functions**, given as minterm lists, with gates. The output of an AND gate is the **intersection** of the two minterm sets, an OR gate the **union**, an XOR gate the **symmetric difference** (the minterms in exactly one of them), and a NOT the complement within 0 to 2ⁿ − 1. GATE 2019 uses f₁ = Σ(0, 2, 5, 8, 14), f₂ = Σ(2, 3, 6, 8, 14, 15), f₃ = Σ(2, 7, 11, 14) with an AND gate on f₁ and f₂ and an XOR with f₃. The AND gives {2, 8, 14}; XOR with {2, 7, 11, 14} cancels 2 and 14 and keeps the rest: **Σ(7, 8, 11)**. GATE 2024 does the same with an AND of f₁, f₂, an OR of f₃, f₄, and an XOR of the two: the AND is {3, 5, 7, 11, 13}, the OR is {0, 1, 2, 4, 6, 11, 13}, and their symmetric difference is {0, 1, 2, 3, 4, 5, 6, 7}, so Y = Σ(0, …, 7) = Π(8, …, 15): options C and D." },
    { t: "code", text: `#include <stdio.h>

int in(const int *s, int n, int m) { for (int i = 0; i < n; i++) if (s[i] == m) return 1; return 0; }

int main(void) {
    int f1[5] = {0, 2, 5, 8, 14}, f2[6] = {2, 3, 6, 8, 14, 15}, f3[4] = {2, 7, 11, 14};
    for (int m = 0; m < 16; m++) if ((in(f1, 5, m) & in(f2, 6, m)) ^ in(f3, 4, m)) printf("%d ", m);   /* 2019 */
    printf("\\n");
    int g1[8] = {0, 2, 3, 5, 7, 8, 11, 13}, g2[7] = {1, 3, 5, 7, 11, 13, 15}, g3[4] = {0, 1, 4, 11}, g4[4] = {0, 2, 6, 13};
    for (int m = 0; m < 16; m++) if ((in(g1, 8, m) & in(g2, 7, m)) ^ (in(g3, 4, m) | in(g4, 4, m))) printf("%d ", m);   /* 2024 */
    printf("\\n");
    return 0;
}`, out: "7 8 11 \n0 1 2 3 4 5 6 7", file: "minterm_sets.c" },
    { t: "ex", id: "l4-e7" },

    { t: "h2", text: "Adders" },
    { t: "p", text: "A **half adder** adds two bits: sum = a ⊕ b, carry = a·b. A **full adder** adds two bits and a carry-in: sum = a ⊕ b ⊕ cᵢₙ, carry-out = ab + cᵢₙ(a ⊕ b), which is the majority function of the three inputs. A **ripple-carry adder** chains n full adders, the carry-out of each feeding the carry-in of the next; its delay is proportional to n, because the top bit must wait for the carry to ripple through all the others." },
    { t: "p", text: "A **carry-lookahead adder** removes the wait. For each bit define the **generate** gᵢ = aᵢbᵢ (this bit makes a carry by itself) and the **propagate** pᵢ = aᵢ ⊕ bᵢ (this bit passes a carry along). Then every carry is a two-level function of the inputs: c₁ = g₀ + p₀c₀, c₂ = g₁ + p₁g₀ + p₁p₀c₀, and so on. The cost is more gates and wider ones, the gain is a delay that grows only like log n with tree grouping. Subtraction a − b is done by adding the 2's complement: invert b and set the carry-in to 1; the same adder serves both." },
    { t: "p", text: "The overflow flag of an adder (met in Chapter L1) is the XOR of the carry into and the carry out of the sign bit. A **comparator** that tests a = b is a row of XNOR gates ANDed together; a **parity generator** is a chain of XOR gates." },

    { t: "h2", text: "Addresses and chip select" },
    { t: "p", text: "A memory system turns the address lines into a chip-select signal with a combinational circuit, usually one AND gate (sometimes with inverted inputs, drawn as a small circle, a **bubble**) or a decoder. The number of lines needed is the base-2 logarithm of the number of items, rounded up." },
    { t: "p", text: "A decoder that addresses a byte-addressable 1 KB RAM has 1024 = 2¹⁰ locations to select, so it needs m = 10 input lines and n = 2¹⁰ = 1024 output lines: m + n = **1034** (GATE 2020). The same reasoning sizes the display system of GATE 2022: the memory segment S has 1024 words, so the circuit P that takes the 10-bit S-address and picks one word is a 10 : 2¹⁰ **decoder**; the 32-word register file R needs a 5 : 2⁵ decoder Q; and T, which picks between the S word and the R word under the control of the single mode bit M, is a 2 : 1 **multiplexer**. That is option C." },
    { t: "p", text: "GATE 2019 draws the chip-select logic: one AND gate with five inputs A₁₅, A₁₄, A₁₃, A₁₂, A₁₁, of which A₁₃ and A₁₂ have bubbles (inverted). CS = 1 exactly when A₁₅ = 1, A₁₄ = 1, A₁₃ = 0, A₁₂ = 0 and A₁₁ = 1. The top five bits of the 16-bit address are therefore 11001, and the lower eleven bits are free. The smallest such address is 1100 1000 0000 0000 = C800 and the largest is 1100 1111 1111 1111 = CFFF. The chip is enabled for the addresses **C800 to CFFF**, a block of 2¹¹ = 2048 locations." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int lo = 0xFFFF, hi = 0;
    for (int a = 0; a < 65536; a++) {
        int a15 = a >> 15 & 1, a14 = a >> 14 & 1, a13 = a >> 13 & 1, a12 = a >> 12 & 1, a11 = a >> 11 & 1;
        if (a15 & a14 & !a13 & !a12 & a11) { if (a < lo) lo = a; if (a > hi) hi = a; }   /* CS = 1 */
    }
    printf("%X %X\\n", lo, hi);
    return 0;
}`, out: "C800 CFFF", file: "chip_select.c" },
    { t: "ex", id: "l4-e8" },
    { t: "ex", id: "l4-e9" },

    { t: "h2", text: "Hazards: when the gates are not instant" },
    { t: "p", text: "Everything above treated gates as instantaneous. Real gates have a **propagation delay**, and when the inputs of a circuit change, different paths can settle at different times. The output can then show a short, wrong pulse before the correct value appears: a **glitch**, or **hazard**. A **static-0 hazard** is a brief 1 on an output that should stay 0; a **static-1 hazard** is a brief 0 on an output that should stay 1; a **dynamic hazard** is several changes where one was expected." },
    { t: "p", text: "The simplest example is Y = X · X̄, in which a signal is ANDed with its own complement. Without delays, X and X̄ are never both 1, so Y is always 0 (statement A of GATE 2024 is true, B is false). With delays, the NOT gate is slow. When X rises from 0 to 1, the AND gate sees the new X = 1 at once but the old X̄ = 1 for a short time, so Y glitches to 1 (C is true). When X falls from 1 to 0, the AND sees X = 0 at once, so Y stays 0 whatever X̄ does (D is false). The hazard exists only for the rising edge." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int rise[6] = {0, 0, 1, 1, 1, 1}, fall[6] = {1, 1, 1, 0, 0, 0};
    int *seq[2] = {rise, fall};
    for (int s = 0; s < 2; s++) {
        int prev = seq[s][0];                              /* the NOT gate sees X one tick late */
        for (int t = 0; t < 6; t++) {
            int nx = !prev;                                /* delayed X-bar */
            printf("%d ", seq[s][t] & nx);                 /* Y = X AND delayed X-bar */
            prev = seq[s][t];
        }
        printf(s == 0 ? "| " : "\\n");
    }
    return 0;
}`, out: "0 0 1 0 0 0 | 0 0 0 0 0 0", file: "glitch.c" },
    { t: "ex", id: "l4-e10" },
    { t: "p", text: "Hazards in a two-level sum-of-products circuit are removed by **adding the consensus term**: if two product terms cover adjacent cells of the K-map that no single term covers, the output can glitch as the input moves from one cell to the next, and adding the term that covers both cells (the consensus) fills the gap. This is the only place in the course where a **non-minimal** expression is the better design." },
    { t: "trap", i: 0 },
    { t: "trap", i: 1 },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Mux: n selects choose one of 2ⁿ inputs; 32-to-1 needs 5 select lines; a mux with n − 1 variables as selects implements any n-variable function with data inputs 0, 1, x or x̄.", "Decoder n-to-2ⁿ: one output per minterm; address decoders: 1 KB needs 10 inputs and 1024 outputs (m + n = 1034). Demux is the reverse of a mux.", "Reading circuits: name every wire, substitute from inputs to output; AND = intersection, OR = union, XOR = symmetric difference of minterm sets.", "Full adder: sum a ⊕ b ⊕ c, carry = majority; ripple carry is slow, lookahead uses generate and propagate; subtract by inverting b and carry-in 1.", "Chip select: an AND of address bits (bubbles = inverted); the enabled block is the fixed top bits with the rest free: 11001 gives C800 to CFFF.", "Hazard: X · X̄ is 0 without delays but glitches to 1 when X rises; a fall gives no glitch; consensus terms remove SOP hazards."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "l4-f1", caption: "The circuit of GATE 2026: a 2-to-4 decoder (outputs D₀ to D₃) feeding a 4-to-1 mux with inputs D₀, 0, 1, D₃. For each value of the select lines S₁S₀ the table shows how many of the four AB values give Y = 1; the total is 6.", alt: "A table of the four select values with the mux input chosen and the number of AB combinations giving 1: 1, 0, 4 and 1.", fig: { kind: "trace", title: "Y = 1 combinations by select value", cols: ["S₁S₀", "mux passes", "AB values with Y = 1", "count"], rows: [
      { cells: ["00", "D₀", "AB = 00", 1] }, { cells: ["01", "constant 0", "none", 0] }, { cells: ["10", "constant 1", "all four", 4], tone: "ok" }, { cells: ["11", "D₃", "AB = 11", 1] }, { cells: ["total", "", "", 6], tone: "ok", changed: [3] },
    ] } },
    { type: "figure", id: "l4-f2", caption: "A 4-to-1 multiplexer that implements f of GATE 2021 with y and z on the selects: the data inputs are 1, 1, x and x̄.", alt: "A table of the select value yz and the minterms involved, with the data input that results.", fig: { kind: "trace", title: "f = Σ(0, 1, 3, 4, 5, 6) as a mux on y z", cols: ["y z", "minterms (x = 0, x = 1)", "data input"], rows: [
      { cells: ["00", "0 and 4: both in f", "1"] }, { cells: ["01", "1 and 5: both in f", "1"] }, { cells: ["10", "2 no, 6 yes", "x"], tone: "ok" }, { cells: ["11", "3 yes, 7 no", "x̄"], tone: "ok" },
    ] } },

    { type: "example", id: "l4-e1", level: "gate", title: "GATE CS 2021 (afternoon), Q56 · 1 mark · which circuit implements f = m0 + m1 + m3 + m4 + m5 + m6", file: "gate2021_an_q56.txt", given: `f(x, y, z) = m0 + m1 + m3 + m4 + m5 + m6. Four circuits (pictures) each use a 4-to-1 mux with s1 = y, s0 = z and data inputs: (a) x', 1, x, 1; (b) x, 1, x', 1; (c) 1, 1, x', x; (d) 1, 1, x, x'. The question's options list them as A = (d), B = (a), C = (c), D = (b). Which implements f?`, find: "The correct circuit.", steps: [
      { say: "For yz = 00 the minterms 0 and 4 are in f, so input 0 must be 1. For yz = 01 the minterms 1 and 5 are in f: input 1 is 1.", result: "inputs 0, 1 = 1, 1" },
      { say: "For yz = 10: minterm 2 is not in f, minterm 6 is: input 2 = x. For yz = 11: minterm 3 is in f, 7 is not: input 3 = x'.", result: "inputs 2, 3 = x, x'" },
      { say: "The circuit with data inputs (1, 1, x, x') is the one pictured as (d), which is option A.", result: "A" },
    ], answer: "A", check: "The program in this chapter prints 1." },
    { type: "example", id: "l4-e2", level: "gate", title: "GATE CS 2024 (forenoon), Q49 · 2 marks · NAT: three 2-to-1 multiplexers", file: "gate2024_fn_q49.txt", given: `M1 selects X1 (S1 = 0) or X2 (S1 = 1) with select A; M2 selects X3 or X4 with select B; M3 selects the output of M1 (C = 0) or of M2 (C = 1). With X1 = 1, X2 = 1, X3 = 0, X4 = 0, how many of the combinations of A, B, C give Y = 1?`, find: "The number of combinations.", steps: [
      { say: "M1 outputs X1 or X2, both 1: its output is 1 for either A.", result: "Q1 = 1" },
      { say: "M2 outputs X3 or X4, both 0: its output is 0 for either B.", result: "Q2 = 0" },
      { say: "M3 outputs Q1 when C = 0 and Q2 when C = 1. So Y = 1 exactly when C = 0, for any A and B: 4 of the 8 combinations.", result: "4" },
    ], answer: "4", check: "Y = C′ here, true for 4 of the 8 rows." },
    { type: "example", id: "l4-e3", level: "gate", title: "GATE CS 2023 (forenoon), Q44 · 2 marks · multiplexer inputs for a function", file: "gate2023_fn_q44.txt", given: `Two 4-to-1 muxes M1 and M2 (selects A as S1 and C as S0, inputs X0-X3 and X4-X7) and a 2-to-1 mux M3 (select B, choosing M1 for B = 0 and M2 for B = 1). Which (X0..X7) realise A' + A'C' + A B' C?
A) 1,1,0,0,1,1,1,0   B) 1,1,0,0,1,1,0,1   C) 1,1,0,1,1,1,0,0   D) 0,0,1,1,0,1,1,1`, find: "The input values.", steps: [
      { say: "Simplify: A' + A'C' + AB'C = A' + AB'C (A' absorbs A'C').", result: "A' + A B' C" },
      { say: "B = 0 (M1), index 2A + C: A = 0 gives 1, 1; A = 1, C = 0 gives 0; A = 1, C = 1 gives B'C·A = 1. So X0..X3 = 1, 1, 0, 1.", result: "1 1 0 1" },
      { say: "B = 1 (M2): A = 0 gives 1, 1; A = 1 gives 0 (because B' = 0). So X4..X7 = 1, 1, 0, 0.", result: "1 1 0 0" },
    ], answer: "C", check: "The program in this chapter checks all 8 inputs and prints 1." },
    { type: "example", id: "l4-e4", level: "gate", title: "GATE CS 2026 (afternoon), Q59 · 2 marks · NAT: decoder feeding a multiplexer", file: "gate2026_an_q59.txt", given: `A 2-to-4 active-high decoder Q (inputs A, B, outputs D0..D3) drives a 4-to-1 mux M with inputs (D0, 0, 1, D3) and selects S1, S0. Of the 16 combinations of [A B S1 S0], how many give Y = 1?`, find: "The number of combinations.", steps: [
      { say: "S1S0 = 00: Y = D0, which is 1 only for AB = 00: one combination.", result: "1" },
      { say: "S1S0 = 01: Y = 0: none. S1S0 = 10: Y = 1 for all four AB: four.", result: "0 and 4" },
      { say: "S1S0 = 11: Y = D3, 1 only for AB = 11: one.", result: "1" },
    ], answer: "6", check: "The program in this chapter counts 6." },
    { type: "example", id: "l4-e5", level: "gate", title: "GATE CS 2020 (forenoon), Q54 · 2 marks · minterms of a gate circuit", file: "gate2020_fn_q54.txt", given: `z(a, b, c): an OR gate fed by a and by an AND gate; the AND gate is fed by c and by b through a NOT. Which minterm list is z?
A) Σ(0,1,3,7)   B) Σ(1,4,5,6,7)   C) Σ(2,4,5,6,7)   D) Σ(2,3,5)`, find: "The minterm list.", steps: [
      { say: "z = a + b'c.", result: "z = a + b'c" },
      { say: "a = 1 gives minterms 4, 5, 6, 7. b'c = 1 for abc = 001 and 101: minterms 1 and 5.", result: "1 4 5 6 7" },
    ], answer: "B", check: "Option C has minterm 2 (010), where a = 0, b = 1, c = 0 gives z = 0." },
    { type: "example", id: "l4-e6", level: "gate", title: "GATE CS 2025 (afternoon), Q31 · 1 mark · MSQ: output of a logic circuit", file: "gate2025_an_q31.txt", given: `Circuit (picture): a NAND of Y and X; a NOT of X; an AND of X and the NOT of Y; the three outputs go to an OR gate F.
A) (XY)'   B) X' + Y' + XY'   C) (XY)' + X' + XY'   D) X + Y'`, find: "The correct expressions for F.", steps: [
      { say: "F = (XY)' + X' + XY'.", result: "this is option C as drawn" },
      { say: "(XY)' = X' + Y'. So F = X' + Y' + X' + XY' = X' + Y' + XY' = X' + Y' (Y' absorbs XY').", result: "F = X' + Y' = (XY)'" },
      { say: "A is (XY)': equal. B is X' + Y' + XY' = X' + Y': equal. C is F itself. D = X + Y' differs (at X = 1, Y = 1 it is 1, but F = 0).", result: "A, B, C" },
    ], answer: "A, B, C", check: "At X = Y = 1: F = 0 + 0 + 0 = 0, so D (1) is wrong." },
    { type: "example", id: "l4-e7", level: "gate", title: "GATE CS 2019 (forenoon), Q56 · 2 marks · AND then XOR of three functions", file: "gate2019_fn_q56.txt", given: `f1 = Σ(0, 2, 5, 8, 14), f2 = Σ(2, 3, 6, 8, 14, 15), f3 = Σ(2, 7, 11, 14). One AND gate on f1 and f2, then an XOR gate with f3: the output f is
A) Σ(7, 8, 11)   B) Σ(2, 7, 8, 11, 14)   C) Σ(2, 14)   D) Σ(0, 2, 3, 5, 6, 7, 8, 11, 14, 15)`, find: "The output function.", steps: [
      { say: "AND: the minterms in both f1 and f2 are 2, 8 and 14.", result: "{2, 8, 14}" },
      { say: "XOR with f3 = {2, 7, 11, 14}: keep the minterms in exactly one: 2 and 14 are in both and cancel; 8 is only in the first; 7 and 11 only in f3.", result: "{7, 8, 11}" },
    ], answer: "A", check: "The program in this chapter prints 7 8 11." },
    { type: "example", id: "l4-e8", level: "gate", title: "GATE CS 2019 (forenoon), Q22 · 1 mark · the address range a chip-select enables", file: "gate2019_fn_q22.txt", given: `Chip select CS = AND(A15, A14, A13', A12', A11) (A13 and A12 inverted). 16 address lines A15..A0. The range of addresses (hex) enabled?
A) C800 to CFFF   B) CA00 to CAFF   C) C800 to C8FF   D) DA00 to DFFF`, find: "The address range.", steps: [
      { say: "CS = 1 needs A15 = 1, A14 = 1, A13 = 0, A12 = 0, A11 = 1: the top five bits are 11001.", result: "11001..." },
      { say: "The other 11 bits are free. Smallest: 1100 1000 0000 0000 = C800. Largest: 1100 1111 1111 1111 = CFFF.", result: "C800 to CFFF" },
    ], answer: "A", check: "The program in this chapter scans all 65536 addresses and prints C800 CFFF." },
    { type: "example", id: "l4-e9", level: "gate", title: "GATE CS 2022 (forenoon) Q40 · 2 marks, and GATE CS 2020 Q25 and Q26 · what a decoder or mux must be", file: "gate2022_fn_q40.txt", given: `2022: a 16-bit code word holds a mode bit M, an S-address (10 bits, a 1024-word memory S) and an R-address (5 bits, a 32-word register file R). P and Q turn the addresses into a selected word of S and R; T chooses between them under M. What are P, Q and T?
2020 Q25: a multiplexer between 32 registers and an accumulator: how many select lines? 2020 Q26: a decoder addressing a byte-addressable 1 KB RAM: the minimum value of m + n?`, find: "The functions and the counts.", steps: [
      { say: "P selects one of 1024 words from a 10-bit address: a 10 : 2¹⁰ decoder. Q selects one of 32 registers from 5 bits: a 5 : 2⁵ decoder. T picks one of two words under the one-bit mode M: a 2 : 1 multiplexer. Option C.", result: "C" },
      { say: "32 registers need log2 32 = 5 select lines.", result: "5" },
      { say: "1 KB = 1024 bytes: the decoder has m = 10 inputs and n = 1024 outputs.", result: "m + n = 1034" },
    ], answer: "C, 5 and 1034", check: "A decoder selects (many outputs, one active); a multiplexer picks one of many inputs." },
    { type: "example", id: "l4-e10", level: "gate", title: "GATE CS 2024 (forenoon), Q17 · 1 mark · MSQ: X AND NOT X with gate delays", file: "gate2024_fn_q17.txt", given: `Circuit (picture): Y = AND(X, NOT(X)). Gates may have propagation delays; wires have none.
A) with no delays, Y is always 0   B) with no delays, Y is always 1   C) with delays, Y can have a transient 1 after X goes 0 to 1   D) with delays, Y can have a transient 0 after X goes 1 to 0`, find: "The correct statements.", steps: [
      { say: "Without delays X and X' are never both 1: Y = 0 always. A true, B false.", result: "A true" },
      { say: "X rises 0 to 1: the AND sees X = 1 immediately but the NOT output is still 1 for a delay: Y = 1 briefly. C true.", result: "C true" },
      { say: "X falls 1 to 0: the AND sees X = 0 at once, so Y stays 0 while X' catches up. D false (Y is 0 anyway, no transient 0 to see).", result: "D false" },
    ], answer: "A, C", check: "The program in this chapter shows the glitch on the rising edge only." },

    { type: "trap", wrong: "A combinational circuit with the right function has no glitches.", tempting: "The truth table is correct for every input.", whyWrong: "The truth table describes settled values. When inputs change, unequal gate delays can produce a brief wrong output (a hazard) even in a correct circuit, as in X · X̄. Hazards matter when the output drives a clock or a latch.", rule: "Correct function is not the same as glitch-free; the glitch exists only in transition.", ex: { text: "Y = X · X̄ is 0 for X = 0 and for X = 1, but pulses to 1 when X rises." } },
    { type: "trap", wrong: "The first multiplexer select line is the least significant bit.", tempting: "S0 is written first or the order of the figure looks left to right.", whyWrong: "Index = 2·S1 + S0. In GATE 2023 the selects are A (S1) and C (S0), so the index is 2A + C, not 2C + A. Swapping them reorders the inputs and picks the wrong option.", rule: "Index of a 4-to-1 mux = 2·S1 + S0.", ex: { text: "A = 1, C = 0 selects input 2; A = 0, C = 1 selects input 1." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 AN Q59 · 2025 AN Q31 · 2024 FN Q17, Q49 · 2024 AN Q46 (in the text) · 2023 FN Q44 · 2022 FN Q40 · 2021 AN Q56 · 2020 FN Q25, Q26, Q54 · 2019 FN Q22, Q56. Every combinational-circuit question of the bank is solved here." },
    { type: "recall", cards: [
      { q: "A multiplexer with n selects chooses among how many inputs?", a: "2ⁿ." },
      { q: "Select lines for a 32-to-1 mux?", a: "5." },
      { q: "Index of a 4-to-1 mux?", a: "2·S1 + S0." },
      { q: "A decoder output equals?", a: "One minterm of its inputs." },
      { q: "Inputs and outputs of a decoder for 1 KB of RAM?", a: "10 inputs, 1024 outputs." },
      { q: "Full adder sum and carry?", a: "Sum a ⊕ b ⊕ c; carry = ab + c(a ⊕ b), the majority." },
      { q: "Generate and propagate?", a: "g = ab, p = a ⊕ b." },
      { q: "AND, OR, XOR of two minterm lists?", a: "Intersection, union, symmetric difference." },
      { q: "A chip-select AND gate with bubbles?", a: "Bubbled address bits must be 0, others 1; the rest are free." },
      { q: "Static-0 hazard?", a: "A brief 1 on an output that should stay 0." },
      { q: "Remove an SOP hazard by?", a: "Adding the consensus term." },
    ] },
    { type: "check", questions: [
      { id: "l4c1", kind: "NAT", marks: 1, q: "How many select lines does a 64-to-1 multiplexer have?", answer: "6", solution: "log₂ 64 = 6." },
      { id: "l4c2", kind: "NAT", marks: 1, q: "A 3-to-8 decoder has how many outputs that are 1 at any time (enable on)?", answer: "1", solution: "Exactly one." },
      { id: "l4c3", kind: "MCQ", marks: 1, q: "Which has a delay proportional to n for n-bit addition?", options: ["Ripple-carry adder", "Carry-lookahead adder", "Decoder", "Multiplexer"], answer: "A", solution: "The carry ripples through all stages." },
      { id: "l4c4", kind: "NAT", marks: 2, q: "A 4-to-1 mux has selects S1 = 1, S0 = 0 and inputs I0..I3 = 0, 1, 1, 0. The output is", answer: "1", solution: "Index 2·1 + 0 = 2; I2 = 1." },
      { id: "l4c5", kind: "MSQ", marks: 2, q: "Which can be built from a 4-to-1 mux and inverters alone?", options: ["Any function of 3 variables", "XOR of two variables", "A full adder's sum", "A flip-flop"], answer: "A, B, C", solution: "A flip-flop needs memory." },
      { id: "l4c6", kind: "NAT", marks: 2, q: "Chip select = AND(A15', A14', A13) on a 16-bit address bus. How many addresses are enabled?", answer: "8192", solution: "Three bits are fixed: 2¹³ = 8192." },
      { id: "l4c7", kind: "MCQ", marks: 2, q: "f1 = Σ(1, 2, 3), f2 = Σ(2, 3, 4): the XOR of f1 and f2 is", options: ["Σ(1, 4)", "Σ(2, 3)", "Σ(1, 2, 3, 4)", "Σ(1, 2)"], answer: "A", solution: "Minterms in exactly one: 1 and 4." },
      { id: "l4c8", kind: "NAT", marks: 2, q: "A full adder adds 1, 1 and a carry-in of 1. What is the carry-out?", answer: "1", solution: "1 + 1 + 1 = 11 in binary: sum 1, carry 1." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on combinational circuits", sub: "Digital Logic", href: "/topics/digital-logic" }, { label: "Sequential circuits", sub: "the next chapter", href: "/study/sequential" }] },
    { type: "links", prereq: ["Gates and Boolean algebra (L2)", "Minimisation (L3)"], usedIn: ["Sequential circuits (L5)", "Computer Organisation: ALU and memory addressing"], cross: ["Computer Organisation: memory chips and address decoding"] },
  ],
};
