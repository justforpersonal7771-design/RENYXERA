import type { Topic } from "@/lib/study/schema";

/**
 * Digital Logic chapter L5 "Sequential circuits: latches, flip-flops, counters and state machines" (28 Nov 2026). Latch against flip-flop, the SR, D, JK and T flip-flops with
 * characteristic and excitation tables, registers and shift registers, ripple and synchronous counters, ring and Johnson counters, Moore and Mealy machines, state-table
 * minimisation, and designing the next-state logic. Real GATE questions (texts from public/data/questions.json, pictures read from public/images), each re-solved here:
 * 2026 FN Q37 (2-bit saturating up/down counter with D flip-flops: option B), 2025 FN Q59 (minimum number of states: 5), 2025 FN Q60 (Johnson counter: 8 states),
 * 2025 AN Q34 (ripple counter, last period 64 microseconds: 250 kHz), 2023 FN Q21 (a mux with feedback is a D latch: B), 2023 FN Q43 (the state (0,0,1) is never reached: A),
 * 2021 FN Q55 (T flip-flop counter: 011, 101, 000: A), 2021 AN Q42 (Mealy machine: t = b, y = sb: B), 2018 FN Q32 (shift register: 2 states with a self-loop),
 * 2017 FN Q59 (T and D flip-flops: B), 2017 AN Q45 (T inputs of a saturating counter: B).
 * Programs compiled and run with gcc: 011 101 000; 11 01; 001; 8; 5; 1; 250; the Mealy output string; 2.
 */
export const chapterL5: Topic = {
  id: "cs.dl.v2.seq5",
  title: "Sequential circuits: flip-flops, counters and state machines",
  no: "L5",
  book: [
    { t: "p", text: "A **sequential circuit** has memory: its output depends on its inputs **and on what happened before**. The memory is held in **flip-flops**, one bit each, and a **clock** tells all of them when to update together. Counters, registers, traffic-light controllers and the control unit of a processor are sequential circuits, and so every question in this chapter is, underneath, about a table of present states and next states." },
    { t: "p", text: "Eleven of the 69 Digital Logic questions are on sequential circuits, eight of them with a circuit or table shown as a picture. The method for all of them is the same: **write the next-state equation of every flip-flop** from its type, then step the circuit through the clock edges one at a time, keeping a small table. This chapter gives the equations, then runs each circuit of the paper." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["say the difference between a latch and an edge-triggered flip-flop;", "write the characteristic equation of the SR, D, JK and T flip-flops and use the excitation tables to design;", "step a counter or shift register through its states;", "tell a ripple counter from a synchronous counter and compute its frequency division;", "recognise ring and Johnson counters and count their states;", "write the next-state logic of a counter from its table;", "minimise the states of a state machine."] },

    { t: "h2", text: "Latches and flip-flops" },
    { t: "p", text: "The simplest memory is a **latch**: a pair of cross-coupled gates that hold one bit. A **D latch** has a data input D and an enable (or gate) input G. While G = 1 the latch is **transparent**: its output Q follows D. When G falls to 0 the latch **holds** the last value of D. Because it reacts to the *level* of G, a latch changes whenever D changes during the transparent period." },
    { t: "p", text: "A **flip-flop** is **edge-triggered**: it samples its inputs only at the instant of a clock edge (the rising edge, for a 'positive edge-triggered' flip-flop) and holds the result until the next edge. In between, changes at the inputs are ignored. This is what makes synchronous design possible: all flip-flops update together on the edge, using the values that were stable just before it." },
    { t: "p", text: "A multiplexer can be made to remember. GATE 2023 shows a 2-to-1 mux whose output Q is fed back to its input 0, with the data on input 1 and a control signal on the select S. When S = 1 the mux passes the data input: Q follows the data. When S = 0 it passes input 0, which is Q itself: Q **holds**. That is the behaviour of a **D latch**, with S as the enable. It is not a flip-flop, since it responds to the level of S, not to an edge. The answer is B." },
    { t: "ex", id: "l5-e1" },
    { t: "callout", kind: "key", text: "Latch: level-sensitive, transparent while enabled. Flip-flop: edge-triggered, samples at the clock edge only. A mux with its output fed back to one input is a D latch." },

    { t: "h2", text: "The four flip-flops" },
    { t: "p", text: "Each flip-flop type is defined by its **characteristic equation**: the next state Q⁺ in terms of the present state Q and the inputs." },
    { t: "table", head: ["Flip-flop", "Inputs", "Next state Q⁺", "Behaviour"], rows: [
      ["D", "D", "D", "copies D"],
      ["T", "T", "T ⊕ Q", "T = 1 toggles, T = 0 holds"],
      ["JK", "J, K", "J Q̄ + K̄ Q", "00 hold, 01 reset, 10 set, 11 toggle"],
      ["SR", "S, R", "S + R̄ Q (with S R = 0)", "01 reset, 10 set, 00 hold, 11 forbidden"],
    ], caption: "Characteristic equations of the four flip-flops." },
    { t: "p", text: "To design a circuit you often need the reverse: given the wanted change Q → Q⁺, what must the inputs be? The **excitation table** answers. For a **D** flip-flop, D = Q⁺ always. For a **T** flip-flop, T = Q ⊕ Q⁺: it must toggle exactly when the state is to change. For a **JK**: 0 → 0 needs J = 0 and K any; 0 → 1 needs J = 1 and K any; 1 → 0 needs K = 1 and J any; 1 → 1 needs K = 0 and J any. The 'any' entries are don't cares, which often shrink the logic." },
    { t: "p", text: "Use these on the table of GATE 2017: a 2-bit **saturating up-counter** has Q₁Q₀ going 00 → 01 → 10 → 11 → 11 (it stops at 11). Built with T flip-flops, T = Q ⊕ Q⁺ for each bit. For Q₁: the changes are 00→0 (T = 0), 01→1 (T = 1), 10→1 (T = 0), 11→1 (T = 0). So T₁ = Q̄₁Q₀. For Q₀: 00→1 (T = 1), 01→0 (T = 1), 10→1 (T = 1), 11→1 (T = 0). So T₀ = Q̄₁ + Q̄₀, the NAND of Q₁ and Q₀. The answer is option B." },
    { t: "ex", id: "l5-e2" },
    { t: "p", text: "The same table with **D** flip-flops is easier, since D = Q⁺ directly, but the equations must be simplified from a K-map. GATE 2026 gives an up/down saturating counter with input P (P = 0 counts up, P = 1 counts down), with the next-state table: for P = 0: 00→01, 01→10, 10→11, 11→11; for P = 1: 00→00, 01→00, 10→01, 11→10. D₁ is 1 when Q₁⁺ = 1: for P = 0 at 01, 10, 11, and for P = 1 at 11. That is P̄(Q₁ + Q₀) + P Q₁ Q₀ = P̄Q₁ + P̄Q₀ + Q₁Q₀. D₀ is 1 at P̄Q̄₁Q̄₀, P̄Q₁Q̄₀, P̄Q₁Q₀ and PQ₁Q̄₀: grouping gives P̄Q̄₀ + P̄Q₁ + Q₁Q̄₀. Both match option B." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    /* rows indexed by P*4 + Q1*2 + Q0; the next-state table of GATE 2026 */
    int n1[8] = {0, 1, 1, 1, 0, 0, 0, 1}, n0[8] = {1, 0, 1, 1, 0, 0, 1, 0}, ok = 1;
    for (int r = 0; r < 8; r++) {
        int P = r >> 2 & 1, Q1 = r >> 1 & 1, Q0 = r & 1;
        int D1 = (!P & Q1) | (!P & Q0) | (Q1 & Q0);                  /* option B */
        int D0 = (!P & !Q0) | (!P & Q1) | (Q1 & !Q0);
        ok &= (D1 == n1[r]) & (D0 == n0[r]);
    }
    printf("%d\\n", ok);
    return 0;
}`, out: "1", file: "counter_logic.c" },
    { t: "ex", id: "l5-e3" },

    { t: "h2", text: "Registers and shift registers" },
    { t: "p", text: "A **register** is a row of flip-flops sharing a clock, storing a word. A **shift register** connects each flip-flop's output to the next one's input, so that on every clock edge the whole word moves one place. A serial-in serial-out shift register of k flip-flops delays its input by k clock periods." },
    { t: "p", text: "GATE 2018 shows two D flip-flops: the input `in` goes to the first, whose output goes to the second, whose output is `out`. The state is the pair (Q₁, Q₂) of the two outputs. At each clock edge, Q₁⁺ = in and Q₂⁺ = Q₁. So from the state (Q₁, Q₂) the next state is (in, Q₁). The question asks how many of the four states have a transition back to **themselves** for some value of in. State 00 goes to (in, 0): with in = 0 it stays at 00: yes. State 11 goes to (in, 1): with in = 1 it stays: yes. State 01 goes to (in, 0), which is never 01: no. State 10 goes to (in, 1), never 10: no. The answer is **2**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int count = 0;
    for (int s = 0; s < 4; s++) {                       /* s = Q1 * 2 + Q2 */
        int Q1 = s >> 1 & 1, self = 0;
        for (int in = 0; in < 2; in++) {
            int next = in * 2 + Q1;                     /* new state = (in, old Q1) */
            if (next == s) self = 1;
        }
        count += self;
    }
    printf("%d\\n", count);
    return 0;
}`, out: "2", file: "shift_register_selfloops.c" },
    { t: "ex", id: "l5-e4" },

    { t: "h2", text: "Counters: ripple and synchronous" },
    { t: "p", text: "A **counter** is a register whose state steps through a fixed sequence on each clock pulse. In a **ripple (asynchronous) counter** the flip-flops are T flip-flops with T = 1 (toggle on every edge), and the output of each is the clock of the next. The first toggles at the input frequency, the second at half of it, and so on: an n-bit ripple counter **divides the clock frequency by 2ⁿ** at the last flip-flop, so the period of the last output is 2ⁿ times the clock period. It is called a ripple counter because the change ripples through the stages, one flip-flop delay after another." },
    { t: "p", text: "GATE 2025 asks: in a 4-bit ripple counter the period of the waveform at the last flip-flop is 64 μs; what is the clock frequency? The last output has period 2⁴ = 16 clock periods, so the clock period is 64 μs / 16 = 4 μs, and the frequency is 1 / 4 μs = **250 kHz**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    double last_period = 64e-6;                   /* seconds */
    double clock_period = last_period / 16;       /* 4 bits: 2^4 */
    printf("%.0f\\n", 1.0 / clock_period / 1000);  /* in kHz */
    return 0;
}`, out: "250", file: "ripple_frequency.c" },
    { t: "p", text: "In a **synchronous counter** all flip-flops share the same clock, and the logic in front of each input decides whether it toggles. It is faster, since there is no ripple, and free of the glitches a ripple counter shows between edges, but it needs the extra gates (as in the saturating counter above). A **mod-n counter** counts 0 to n − 1 and then returns to 0; a mod-10 counter needs 4 flip-flops and logic that resets at 10." },
    { t: "p", text: "Now step a circuit. GATE 2021 draws three T flip-flops P, Q and R on a common clock. The inputs are T_P = R (the output of R fed back to the first), T_Q = P′ and T_R = Q′. The next-state equations are P⁺ = P ⊕ R, Q⁺ = Q ⊕ P′, R⁺ = R ⊕ Q′. From PQR = 000: P⁺ = 0 ⊕ 0 = 0, Q⁺ = 0 ⊕ 1 = 1, R⁺ = 0 ⊕ 1 = 1, so the next state is 011. From 011: P⁺ = 0 ⊕ 1 = 1, Q⁺ = 1 ⊕ 1 = 0, R⁺ = 1 ⊕ 0 = 1: 101. From 101: P⁺ = 1 ⊕ 1 = 0, Q⁺ = 0 ⊕ 0 = 0, R⁺ = 1 ⊕ 1 = 0: back to 000. The next three states are 011, 101, 000: option A." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int P = 0, Q = 0, R = 0;
    for (int k = 0; k < 3; k++) {
        int nP = P ^ R, nQ = Q ^ !P, nR = R ^ !Q;      /* T flip-flops: Q+ = Q xor T */
        P = nP; Q = nQ; R = nR;
        printf("%d%d%d%s", P, Q, R, k < 2 ? " " : "\\n");
    }
    return 0;
}`, out: "011 101 000", file: "t_counter.c" },
    { t: "ex", id: "l5-e5" },
    { t: "fig", id: "l5-f1" },
    { t: "p", text: "Two circuits of the same family are in the 2017 and 2023 papers. In GATE 2017 a T flip-flop (output Q₁) and a D flip-flop (output Q₀) are cross-connected: the D flip-flop's output feeds the T input, and the T flip-flop's output feeds the D input. So Q₁⁺ = Q₁ ⊕ Q₀ and Q₀⁺ = Q₁. Starting at Q₁Q₀ = 11: after the 1st clock Q₁ = 1 ⊕ 1 = 0, Q₀ = 1: state 01; after the 2nd, Q₁ = 0 ⊕ 1 = 1, Q₀ = 0: state 10; after the 3rd, Q₁ = 1 ⊕ 0 = 1, Q₀ = 1: **11**; after the 4th: **01**. That is option B." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int q1 = 1, q0 = 1;
    for (int c = 1; c <= 4; c++) {
        int n1 = q1 ^ q0, n0 = q1;                 /* T flip-flop Q1 gets T = Q0; D flip-flop Q0 gets D = Q1 */
        q1 = n1; q0 = n0;
        if (c >= 3) printf("%d%d%s", q1, q0, c == 3 ? " " : "\\n");
    }
    return 0;
}`, out: "11 01", file: "t_and_d.c" },
    { t: "ex", id: "l5-e6" },
    { t: "p", text: "GATE 2023's circuit has a T flip-flop Q₁ whose T input is the **complement** of Q₃ (through a NOT gate), a D flip-flop Q₂ whose D input is Q₁, and a T flip-flop Q₃ whose T input is Q₂, all on one clock. The next-state equations are Q₁⁺ = Q₁ ⊕ Q̄₃, Q₂⁺ = Q₁, Q₃⁺ = Q₃ ⊕ Q₂. Start at (Q₁, Q₂, Q₃) = (0, 1, 1). The sequence is 011 → 000 → 100 → 010 → 101 → 111 → 110 → 011, a cycle of **seven** states. Of the eight possible states, the one missing is 001, so the value (0, 0, 1) can never be obtained (option A); the others (100, 101, 111) all occur." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int q1 = 0, q2 = 1, q3 = 1, seen[8] = {0};
    for (int i = 0; i < 20; i++) {
        seen[q1 * 4 + q2 * 2 + q3] = 1;
        int n1 = q1 ^ !q3, n2 = q1, n3 = q3 ^ q2;
        q1 = n1; q2 = n2; q3 = n3;
    }
    for (int s = 0; s < 8; s++) if (!seen[s]) printf("%d%d%d\\n", s >> 2 & 1, s >> 1 & 1, s & 1);
    return 0;
}`, out: "001", file: "unreachable_state.c" },
    { t: "ex", id: "l5-e7" },

    { t: "h2", text: "Ring and Johnson counters" },
    { t: "p", text: "A **ring counter** is a shift register whose last output is fed back to the first input; it is started with a single 1, which circulates. An n-bit ring counter has **n states**. A **Johnson (twisted-ring) counter** feeds back the **complement** of the last output, and it has **2n states**: starting from all zeros, the register fills with ones from one end, one place per clock, until it is all ones, and then fills with zeros in the same way." },
    { t: "p", text: "GATE 2025 draws four D flip-flops in a chain, with the output Q̄₃ of the last fed back to the input of the first: a 4-bit Johnson counter. The question asks for the number of distinct states before the circuit returns to its initial state. Whatever the start, the cycle has 2 × 4 = **8** states: from 0000 it goes 1000, 1100, 1110, 1111, 0111, 0011, 0001 and back to 0000. (A state not on this cycle, such as 0101, would lead to a second cycle, but each starting state still returns to itself after the length of its own cycle; for the standard initialisation the answer is 8.)" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    unsigned s = 0, start = 0;
    int n = 0;
    do {
        unsigned fb = !(s >> 3 & 1);                  /* the complement of the last output */
        s = ((s << 1) & 15) | fb;                     /* shift and feed it back */
        n++;
    } while (s != start);
    printf("%d\\n", n);
    return 0;
}`, out: "8", file: "johnson_counter.c" },
    { t: "ex", id: "l5-e8" },
    { t: "table", head: ["Counter", "Feedback", "States for n flip-flops"], rows: [
      ["Binary ripple", "output to next clock", "2ⁿ"], ["Ring", "last output to first input", "n"], ["Johnson (twisted ring)", "complement of last output to first input", "2n"],
    ], caption: "Counters compared by their number of states." },

    { t: "h2", text: "State machines: Moore and Mealy" },
    { t: "p", text: "A general sequential circuit is a **finite state machine**: a set of states, a next-state function and an output function. In a **Moore** machine the output depends only on the **state**; in a **Mealy** machine it depends on the state **and the current input**, so it can respond one clock sooner and often needs fewer states. A machine is described by a **state table**: for each present state and input, the next state and the output." },
    { t: "p", text: "GATE 2021 asks for a circuit that replaces the first 1 of every run of consecutive 1s by 0, for example 00100011000011100 becomes 00000001000001100. A two-state Mealy machine suffices: the state s remembers whether the previous input bit was 1. The output is 1 only when the current bit b is 1 **and** the previous bit was also 1, so y = s·b; the first 1 of a run (s = 0) is output as 0, and the later ones pass. The next state is simply the current bit: t = b. That is option B: t = b, y = sb." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    const char *in = "00100011000011100";
    int s = 0;                                         /* was the previous bit a 1? */
    for (int i = 0; in[i]; i++) {
        int b = in[i] - '0';
        printf("%d", s & b);                           /* y = s b */
        s = b;                                         /* t = b */
    }
    printf("\\n");
    return 0;
}`, out: "00000001000001100", file: "mealy_detector.c" },
    { t: "ex", id: "l5-e9" },

    { t: "h2", text: "Minimising the states of a machine" },
    { t: "p", text: "Two states are **equivalent** if no sequence of inputs can tell them apart: for every input they give the same output **and** their next states are equivalent. Equivalent states can be merged, and a machine with the fewest states is **minimal**. The standard method is **partition refinement**: start with the states grouped by their outputs, then repeatedly split any group whose members have next states in different groups, until nothing splits." },
    { t: "p", text: "GATE 2025 gives an eight-state machine A to H with one input X and one output f. The next states are A: F, B; B: D, C; C: F, E; D: G, A; E: D, C; F: F, B; G: G, H; H: G, A (for X = 0, X = 1) and the outputs (X = 0, X = 1) are A 00, B 00, C 00, D 10, E 00, F 11, G 01, H 10. Group by output: {A, B, C, E}, {D, H}, {F}, {G}. Now refine {A, B, C, E} by next-state groups: A goes to (F, B) = ({F}, group 1), B to (D, C) = (group {D,H}, group 1), C to (F, E) = ({F}, group 1), E to (D, C) = ({D,H}, group 1). So {A, C} (first next state F) is separated from {B, E} (first next state in {D, H}). Check {D, H}: D goes to (G, A), H goes to (G, A): the same. The classes are {A, C}, {B, E}, {D, H}, {F}, {G}: **5** states." },
    { t: "fig", id: "l5-f2" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    /* states A..H = 0..7; next state for X = 0 and X = 1; output pair (X=0)*2 + (X=1) */
    int nx[8][2] = {{5, 1}, {3, 2}, {5, 4}, {6, 0}, {3, 2}, {5, 1}, {6, 7}, {6, 0}};
    int ou[8] = {0, 0, 0, 2, 0, 3, 1, 2};
    int cls[8], count = 0, prev = -1;
    for (int s = 0; s < 8; s++) cls[s] = ou[s];                      /* start: grouped by output */
    while (1) {
        int sig[8], ids[8], n = 0, next[8];
        for (int s = 0; s < 8; s++) sig[s] = cls[s] * 100 + cls[nx[s][0]] * 10 + cls[nx[s][1]];
        for (int s = 0; s < 8; s++) {
            int k = -1;
            for (int j = 0; j < n; j++) if (ids[j] == sig[s]) k = j;
            if (k < 0) { ids[n] = sig[s]; k = n++; }
            next[s] = k;
        }
        for (int s = 0; s < 8; s++) cls[s] = next[s];
        count = n;
        if (count == prev) break;
        prev = count;
    }
    printf("%d\\n", count);
    return 0;
}`, out: "5", file: "minimise_states.c" },
    { t: "ex", id: "l5-e10" },
    { t: "trap", i: 0 },
    { t: "trap", i: 1 },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Latch: level-sensitive; flip-flop: edge-triggered. A mux with output fed back to one input is a D latch.", "D: Q⁺ = D. T: Q⁺ = T ⊕ Q (T = Q ⊕ Q⁺ in design). JK: Q⁺ = JQ̄ + K̄Q.", "To step a circuit: write each flip-flop's next-state equation, then iterate one clock at a time and keep a table.", "n-bit ripple counter divides the frequency by 2ⁿ: last period 64 μs on 4 bits means a 250 kHz clock.", "Ring counter: n states; Johnson counter: 2n states (feed back the complement).", "Saturating 2-bit up counter with T flip-flops: T₁ = Q̄₁Q₀, T₀ = Q̄₁ + Q̄₀.", "Mealy output depends on state and input; Moore on state only. State minimisation: group by output, then refine by next-state groups."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "l5-f1", caption: "The sequence of the three-T-flip-flop counter of GATE 2021 from PQR = 000: it returns to 000 after the third pulse.", alt: "A table of clock pulses with the states PQR: 000, 011, 101, 000.", fig: { kind: "trace", title: "T_P = R, T_Q = P′, T_R = Q′", cols: ["pulse", "P", "Q", "R", "state"], rows: [
      { cells: [0, 0, 0, 0, "000"] }, { cells: [1, 0, 1, 1, "011"], changed: [2, 3, 4] }, { cells: [2, 1, 0, 1, "101"], changed: [1, 2, 4] }, { cells: [3, 0, 0, 0, "000"], changed: [1, 3, 4], tone: "ok" },
    ] } },
    { type: "figure", id: "l5-f2", caption: "Partition refinement on the machine of GATE 2025. The output pairs split the states into four groups; the next states then split {A, B, C, E} into {A, C} and {B, E}. Five equivalence classes remain.", alt: "A table of the eight states A to H with their output pair, next states and final class.", fig: { kind: "trace", title: "Eight states, five classes", cols: ["state", "next (X=0, X=1)", "output (X=0, X=1)", "class"], rows: [
      { cells: ["A", "F, B", "0, 0", "{A, C}"] }, { cells: ["C", "F, E", "0, 0", "{A, C}"] }, { cells: ["B", "D, C", "0, 0", "{B, E}"] }, { cells: ["E", "D, C", "0, 0", "{B, E}"] },
      { cells: ["D", "G, A", "1, 0", "{D, H}"] }, { cells: ["H", "G, A", "1, 0", "{D, H}"] }, { cells: ["F", "F, B", "1, 1", "{F}"] }, { cells: ["G", "G, H", "0, 1", "{G}"] },
    ] } },

    { type: "example", id: "l5-e1", level: "gate", title: "GATE CS 2023 (forenoon), Q21 · 1 mark · a multiplexer with its output fed back", file: "gate2023_fn_q21.txt", given: `A 2-input multiplexer: its output Q is connected back to its input 0; input 1 is the data and S is the select. Which is the functional equivalent?
A) D flip-flop   B) D latch   C) Half-adder   D) Demultiplexer`, find: "The equivalent circuit.", steps: [
      { say: "S = 1: the mux passes input 1 (the data): Q follows the data.", result: "transparent" },
      { say: "S = 0: the mux passes input 0, which is Q: Q keeps its value.", result: "holds" },
      { say: "Transparent while S = 1, holding while S = 0, responding to the level of S: a D latch. A flip-flop would need an edge.", result: "B" },
    ], answer: "B", check: "No clock edge appears anywhere in the circuit." },
    { type: "example", id: "l5-e2", level: "gate", title: "GATE CS 2017 (afternoon), Q45 · 2 marks · T inputs of a saturating up-counter", file: "gate2017_an_q45.txt", given: `Next-state table (Q1 Q0 to Q1+ Q0+): 00 → 01, 01 → 10, 10 → 11, 11 → 11. Built with T flip-flops. T1 and T0?
A) T1 = Q1Q0, T0 = Q1'Q0'   B) T1 = Q1'Q0, T0 = Q1' + Q0'   C) T1 = Q1 + Q0, T0 = Q1' + Q0'   D) T1 = Q1Q0, T0 = Q1 + Q0`, find: "The T inputs.", steps: [
      { say: "T = Q xor Q+. For Q1: 00: 0 xor 0 = 0; 01: 0 xor 1 = 1; 10: 1 xor 1 = 0; 11: 1 xor 1 = 0. So T1 = 1 only at Q1Q0 = 01: T1 = Q1'Q0.", result: "T1 = Q1'Q0" },
      { say: "For Q0: 00: 0 xor 1 = 1; 01: 1 xor 0 = 1; 10: 0 xor 1 = 1; 11: 1 xor 1 = 0. T0 = 0 only at 11: T0 = (Q1Q0)' = Q1' + Q0'.", result: "T0 = Q1' + Q0'" },
    ], answer: "B", check: "At 11 neither flip-flop toggles: the counter saturates." },
    { type: "example", id: "l5-e3", level: "gate", title: "GATE CS 2026 (forenoon), Q37 · 2 marks · D inputs of an up/down saturating counter", file: "gate2026_fn_q37.txt", given: `A 2-bit saturating counter, input P (0 = up, 1 = down), built with D flip-flops. Next-state table (P Q1 Q0 → Q1+ Q0+): 000→01, 001→10, 010→11, 011→11, 100→00, 101→00, 110→01, 111→10. Which gives D1 and D0?
B) D1 = P'Q1 + P'Q0 + Q1Q0, D0 = P'Q0' + P'Q1 + Q1Q0'   (and three other options)`, find: "The D inputs.", steps: [
      { say: "D1 = Q1+. It is 1 at 010, 011, 001 (P = 0: Q1Q0 = 01, 10, 11) and at 111. So D1 = P'(Q1 + Q0) + P Q1 Q0, and Q1Q0 already covers both P values: D1 = P'Q1 + P'Q0 + Q1Q0.", result: "D1 = P'Q1 + P'Q0 + Q1Q0" },
      { say: "D0 = Q0+. It is 1 at 000, 010, 011, 110: group 000 and 010 as P'Q0', 010 and 011 as P'Q1, 010 and 110 as Q1Q0'.", result: "D0 = P'Q0' + P'Q1 + Q1Q0'" },
    ], answer: "B", check: "The program in this chapter checks all eight rows and prints 1." },
    { type: "example", id: "l5-e4", level: "gate", title: "GATE CS 2018 (forenoon), Q32 · 1 mark · NAT: states with a self-transition", file: "gate2018_fn_q32.txt", given: `Two positive-edge D flip-flops in a chain: in feeds the first, its output feeds the second, whose output is out. The number of states of the state diagram that have a transition back to the same state for some value of in?`, find: "The number of states.", steps: [
      { say: "State (Q1, Q2); next state is (in, Q1).", result: "next = (in, Q1)" },
      { say: "00 → (in, 0): in = 0 gives 00. Yes. 11 → (in, 1): in = 1 gives 11. Yes.", result: "2 so far" },
      { say: "01 → (in, 0): never 01. 10 → (in, 1): never 10.", result: "no" },
    ], answer: "2", check: "The program in this chapter prints 2." },
    { type: "example", id: "l5-e5", level: "gate", title: "GATE CS 2021 (forenoon), Q55 · 2 marks · the next three states of a T-flip-flop counter", file: "gate2021_fn_q55.txt", given: `Three T flip-flops P, Q, R on one clock, with T_P = R, T_Q = P', T_R = Q'. Starting from PQR = 000, the next three states?
A) 011, 101, 000   B) 001, 010, 111   C) 011, 101, 111   D) 001, 010, 000`, find: "The next three states.", steps: [
      { say: "P+ = P xor R, Q+ = Q xor P', R+ = R xor Q'.", result: "equations" },
      { say: "000: P+ = 0, Q+ = 0 xor 1 = 1, R+ = 0 xor 1 = 1: 011. 011: P+ = 0 xor 1 = 1, Q+ = 1 xor 1 = 0, R+ = 1 xor 0 = 1: 101. 101: P+ = 1 xor 1 = 0, Q+ = 0 xor 0 = 0, R+ = 1 xor 1 = 0: 000.", result: "011, 101, 000" },
    ], answer: "A", check: "The program in this chapter prints 011 101 000." },
    { type: "example", id: "l5-e6", level: "gate", title: "GATE CS 2017 (forenoon), Q59 · 2 marks · T and D flip-flops cross-connected", file: "gate2017_fn_q59.txt", given: `A T flip-flop (Q1) and a D flip-flop (Q0): the D flip-flop's output feeds the T input and the T flip-flop's output feeds the D input. Initially Q1 = Q0 = 1. The outputs Q1Q0 after the 3rd and 4th clock?
A) 11 and 00   B) 11 and 01   C) 00 and 11   D) 01 and 01`, find: "The states after the 3rd and 4th clock.", steps: [
      { say: "Q1+ = Q1 xor Q0 and Q0+ = Q1.", result: "equations" },
      { say: "Start 11. After 1: Q1 = 1 xor 1 = 0, Q0 = 1: 01. After 2: Q1 = 0 xor 1 = 1, Q0 = 0: 10. After 3: Q1 = 1 xor 0 = 1, Q0 = 1: 11. After 4: Q1 = 1 xor 1 = 0, Q0 = 1: 01.", result: "11, then 01" },
    ], answer: "B", check: "The program in this chapter prints 11 01." },
    { type: "example", id: "l5-e7", level: "gate", title: "GATE CS 2023 (forenoon), Q43 · 2 marks · which state can never be obtained", file: "gate2023_fn_q43.txt", given: `A T flip-flop (Q1, T = complement of Q3), a D flip-flop (Q2, D = Q1) and a T flip-flop (Q3, T = Q2) on one clock. Initially (Q1, Q2, Q3) = (0, 1, 1). Which of (Q1, Q2, Q3) can NEVER be obtained?
A) (0, 0, 1)   B) (1, 0, 0)   C) (1, 0, 1)   D) (1, 1, 1)`, find: "The unreachable state.", steps: [
      { say: "Q1+ = Q1 xor Q3', Q2+ = Q1, Q3+ = Q3 xor Q2.", result: "equations" },
      { say: "From 011: 000, 100, 010, 101, 111, 110, 011: a cycle of seven states.", result: "7 states" },
      { say: "The eight possible states minus the seven on the cycle leaves 001.", result: "001 never occurs" },
    ], answer: "A", check: "The program in this chapter prints the missing state 001." },
    { type: "example", id: "l5-e8", level: "gate", title: "GATE CS 2025 (forenoon), Q60 · 2 marks · NAT: states of a four-flip-flop feedback circuit", file: "gate2025_fn_q60.txt", given: `Four D flip-flops in a chain on one clock; the last output (complement Q3') is fed back to D of the first. The circuit starts in some state. The number of distinct states it goes through before returning to the initial state?`, find: "The number of states.", steps: [
      { say: "Feeding back the complement of the last output makes a Johnson (twisted-ring) counter.", result: "Johnson counter" },
      { say: "From 0000: 1000, 1100, 1110, 1111, 0111, 0011, 0001, 0000. Eight different states, then it repeats.", result: "8" },
    ], answer: "8", check: "A Johnson counter of n flip-flops has 2n states." },
    { type: "example", id: "l5-e9", level: "gate", title: "GATE CS 2021 (afternoon), Q42 · 2 marks · a Mealy machine for the first 1 of each run", file: "gate2021_an_q42.txt", given: `Replace the first 1 of every run of 1s by 0: input 00100011000011100 gives output 00000001000001100. A two-state Mealy machine with current state s, next state t, input bit b and output y. Initial state 0. t and y?
A) t = s + b, y = sb   B) t = b, y = sb   C) t = b, y = s b'   D) t = s + b, y = s b'`, find: "t and y.", steps: [
      { say: "The output is 1 only for the second and later 1s of a run: y = 1 when b = 1 and the previous bit was 1.", result: "y = s b, with s = previous bit" },
      { say: "So the state must remember the last input bit: t = b.", result: "t = b" },
    ], answer: "B", check: "The program in this chapter reproduces the output string exactly." },
    { type: "example", id: "l5-e10", level: "gate", title: "GATE CS 2025 (forenoon), Q59 · 2 marks · NAT: the minimum number of states", file: "gate2025_fn_q59.txt", given: `A machine with one input X and one output f. State table (next state for X = 0, X = 1; output for X = 0, X = 1): A: F, B; 0, 0.  B: D, C; 0, 0.  C: F, E; 0, 0.  D: G, A; 1, 0.  E: D, C; 0, 0.  F: F, B; 1, 1.  G: G, H; 0, 1.  H: G, A; 1, 0. The minimum number of states?`, find: "The number of states in the minimal machine.", steps: [
      { say: "Group by output: {A, B, C, E} (0,0), {D, H} (1,0), {F} (1,1), {G} (0,1).", result: "4 groups" },
      { say: "Split {A, B, C, E} by next states: A and C go to F on X = 0; B and E go to a state in {D, H}. So {A, C} and {B, E}. D and H have identical next states (G, A): they stay together.", result: "{A, C}, {B, E}, {D, H}" },
      { say: "Five classes: {A, C}, {B, E}, {D, H}, {F}, {G}.", result: "5" },
    ], answer: "5", check: "The program in this chapter refines the partition and prints 5." },

    { type: "trap", wrong: "A flip-flop and a latch are the same: both store a bit.", tempting: "Both hold one bit of data.", whyWrong: "A latch is transparent for the whole time its enable is active, so its output can change several times in one pulse. A flip-flop samples only at the clock edge. A feedback multiplexer, as in GATE 2023, is a latch.", rule: "Level-sensitive means latch; edge-triggered means flip-flop.", ex: { text: "Enable high for 5 ns while D goes 0, 1, 0: the latch output follows all three; a flip-flop shows only the value at the edge." } },
    { type: "trap", wrong: "A 4-bit Johnson counter has 4 states, like a 4-bit ring counter, or 16 like a binary counter.", tempting: "Four flip-flops, so the count is 4 or 2⁴.", whyWrong: "A ring counter of n flip-flops has n states and a binary counter 2ⁿ; a Johnson counter has 2n: 8 for n = 4.", rule: "Ring n, Johnson 2n, binary 2ⁿ.", ex: { text: "0000 → 1000 → 1100 → 1110 → 1111 → 0111 → 0011 → 0001 → 0000: eight states." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q37 · 2025 FN Q59, Q60 · 2025 AN Q34 · 2023 FN Q21, Q43 · 2021 FN Q55 · 2021 AN Q42 · 2018 FN Q32 · 2017 FN Q59 · 2017 AN Q45. Every sequential-circuit question of the bank is solved here." },
    { type: "recall", cards: [
      { q: "Latch versus flip-flop?", a: "Latch: level-sensitive and transparent; flip-flop: edge-triggered." },
      { q: "D flip-flop next state?", a: "Q⁺ = D." },
      { q: "T flip-flop next state?", a: "Q⁺ = T ⊕ Q." },
      { q: "JK flip-flop next state?", a: "Q⁺ = JQ̄ + K̄Q." },
      { q: "T input needed for a change Q → Q⁺?", a: "T = Q ⊕ Q⁺." },
      { q: "Frequency division of an n-bit ripple counter?", a: "2ⁿ at the last output." },
      { q: "States of a ring counter and a Johnson counter?", a: "n and 2n." },
      { q: "Moore versus Mealy?", a: "Moore: output from state only; Mealy: from state and input." },
      { q: "Two states are equivalent when?", a: "Same outputs and equivalent next states for every input." },
      { q: "How do you step a circuit?", a: "Write each flip-flop's next-state equation and iterate clock by clock." },
      { q: "Saturating up counter T inputs?", a: "T1 = Q1′Q0; T0 = (Q1Q0)′." },
    ] },
    { type: "check", questions: [
      { id: "l5c1", kind: "NAT", marks: 1, q: "A 3-bit ripple counter is driven by a 80 kHz clock. The frequency at the last flip-flop output in kHz is", answer: "10", solution: "80 / 2³ = 10." },
      { id: "l5c2", kind: "NAT", marks: 1, q: "How many states does a 5-bit Johnson counter have?", answer: "10", solution: "2n = 10." },
      { id: "l5c3", kind: "MCQ", marks: 1, q: "A T flip-flop with T = 1 on every clock edge", options: ["holds its value", "toggles on every edge", "is always set", "is always reset"], answer: "B", solution: "Q⁺ = 1 ⊕ Q = Q′." },
      { id: "l5c4", kind: "NAT", marks: 2, q: "D flip-flops Q1, Q0 with D1 = Q0 and D0 = Q1′. Starting at Q1Q0 = 00, what is the state (as a decimal 0 to 3) after 3 clocks?", answer: "2", solution: "Q1⁺ = Q0 and Q0⁺ = Q1′. After 1 clock the state is 01; after 2 it is 11; after 3 it is 10, which is 2." },
      { id: "l5c5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["A ring counter of 6 flip-flops has 6 states", "A Johnson counter of 6 flip-flops has 12 states", "A 6-bit binary counter has 32 states", "A latch is edge-triggered"], answer: "A, B", solution: "6-bit binary counter has 64 states; latches are level-sensitive." },
      { id: "l5c6", kind: "NAT", marks: 2, q: "A JK flip-flop has J = K = 1. Q = 0 before a clock edge. After 5 edges, Q is", answer: "1", solution: "It toggles each edge: 1, 0, 1, 0, 1." },
      { id: "l5c7", kind: "MCQ", marks: 2, q: "In a Mealy machine the output depends on", options: ["the present state only", "the present state and the present input", "the input only", "the next state only"], answer: "B", solution: "That is the definition." },
      { id: "l5c8", kind: "NAT", marks: 2, q: "A mod-12 counter needs at least how many flip-flops?", answer: "4", solution: "2⁴ = 16 ≥ 12 > 2³." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on sequential circuits", sub: "Digital Logic", href: "/topics/digital-logic" }, { label: "Computer arithmetic", sub: "the next chapter", href: "/study/computer-arithmetic" }] },
    { type: "links", prereq: ["Gates and Boolean algebra (L2)", "Minimisation (L3)", "Combinational circuits (L4)"], usedIn: ["Computer Organisation: registers and the control unit", "Computer Organisation: pipelines"], cross: ["Theory of Computation: finite automata"] },
  ],
};
