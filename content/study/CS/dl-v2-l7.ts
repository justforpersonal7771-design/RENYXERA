import type { Topic } from "@/lib/study/schema";

/**
 * Digital Logic chapter L7 "Previous-year patterns and mixed practice" (28 Nov 2026). All 69 Digital Logic questions of 2017 to 2026 in the bank, grouped by the chapter that solves
 * them, the patterns the paper uses, a method for each, and mixed practice across the book. Bank statistics (checked 28 Nov 2026): 69 questions, 103 marks (6.9 percent of 1500),
 * 13 easy, 47 medium and 9 hard; 36 MCQ, 16 MSQ and 17 NAT. Two worked edge examples join chapters (a carry-lookahead check and a mixed overflow question).
 */
export const chapterL7: Topic = {
  id: "cs.dl.v2.practice7",
  title: "Previous-year patterns and mixed practice",
  no: "L7",
  book: [
    { t: "p", text: "The bank holds 69 Digital Logic questions from 2017 to 2026, worth 103 marks, about 6.9 percent of the 1500 marks in the bank: roughly one mark in fifteen. Only 9 of the 69 are hard; 13 are easy and 47 are of medium difficulty. That is good news: the subject is the most **learnable** in the paper, because the techniques are few and every question is settled by a table or a short calculation." },
    { t: "p", text: "This last chapter lists every question under the chapter that solves it, names the patterns the paper uses, gives a method for each, and finishes with mixed practice. Use it in two ways: skim the pattern list before you start, to see what the paper expects, and, after each chapter, come back to its row of the table and solve those questions without looking at the solutions." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["name the pattern of a Digital Logic question at a glance;", "apply the standard method for each pattern within the time the paper allows;", "find the questions of any chapter, and the ones that come with a picture;", "join ideas from different chapters in one answer."] },

    { t: "h2", text: "Where the marks are" },
    { t: "p", text: "The 69 questions fall into six groups: number representation 16, Boolean algebra 10, minimisation 9, combinational circuits 13, sequential circuits 11, and floating point 10. Number representation and floating point together (26 questions) are pure arithmetic with a pencil and carry about a third of the subject's marks; Boolean algebra and minimisation (19 questions) are the K-map and law skills; the two circuit chapters (24 questions) are about reading diagrams." },
    { t: "fig", id: "l7-f1" },
    { t: "p", text: "By type, there are 36 multiple-choice, 16 multiple-select and 17 numerical-answer questions. The multiple-select questions are the ones to be careful with: they give no partial credit for a partly right set, and they are the questions where a truth-table check of every option is worth the minute it takes." },
    { t: "p", text: "A study order by value: first number representation (L1) and floating point (L6), which are quick and certain; then Boolean algebra (L2) and minimisation (L3); then the two circuit chapters (L4, L5), where practice reading diagrams pays off." },

    { t: "h2", text: "Every question, by chapter" },
    { t: "p", text: "The table gives the year, shift and number of each question. A question that gives part of its data as a picture is marked (fig); it is solved in its chapter from the picture's values." },
    { t: "table", head: ["Chapter", "Questions"], rows: [
      ["L1 Number representation", "2026 FN Q22 · 2026 AN Q28 · 2025 FN Q25 · 2024 FN Q18 · 2024 AN Q60 · 2023 FN Q32 · 2022 FN Q18 · 2021 FN Q44 · 2021 AN Q36 · 2019 FN Q17, Q33 · 2018 FN Q43 · 2017 FN Q11, Q24 · 2017 AN Q23, Q25"],
      ["L2 Gates and Boolean algebra", "2026 FN Q21 · 2026 AN Q16 · 2025 FN Q24 · 2025 AN Q50 · 2024 FN Q62 · 2024 AN Q32 · 2021 FN Q64 · 2019 FN Q18 · 2018 FN Q14 · 2017 AN Q43"],
      ["L3 Minimisation", "2026 FN Q48 · 2026 AN Q40 · 2025 FN Q42 · 2025 AN Q43 (fig) · 2021 AN Q49 · 2019 FN Q49 · 2018 FN Q59 · 2017 FN Q26 (fig) · 2017 AN Q41"],
      ["L4 Combinational circuits", "2026 AN Q59 (fig) · 2025 AN Q31 (fig) · 2024 FN Q17 (fig), Q49 (fig) · 2024 AN Q46 (fig) · 2023 FN Q44 (fig) · 2022 FN Q40 (fig) · 2021 AN Q56 (fig) · 2020 FN Q25, Q26, Q54 (fig) · 2019 FN Q22 (fig), Q56 (fig)"],
      ["L5 Sequential circuits", "2026 FN Q37 (fig) · 2025 FN Q59 (fig), Q60 (fig) · 2025 AN Q34 · 2023 FN Q21 (fig), Q43 (fig) · 2021 FN Q55 (fig) · 2021 AN Q42 · 2018 FN Q32 (fig) · 2017 FN Q59 (fig) · 2017 AN Q45 (fig)"],
      ["L6 Floating point", "2026 FN Q36 · 2026 AN Q34 · 2025 AN Q49 · 2024 AN Q23 (fig) · 2023 FN Q45 · 2022 FN Q41 (fig) · 2021 FN Q65 · 2021 AN Q17 · 2020 FN Q59 · 2017 AN Q12"],
    ], caption: "All 69 Digital Logic questions of the bank, by chapter." },

    { t: "h2", text: "The five patterns" },
    { t: "p", text: "Nearly every question is one of five patterns. Naming the pattern first takes seconds and tells you the tool." },
    { t: "ol", items: [
      "**Convert or decode:** radix conversion, 2's complement, fixed point, IEEE 754 words. Tool: write the bits, split the fields, compute in decimal. Check with the range or the sign.",
      "**Overflow or range:** does this operation fit? Tool: convert to decimal, compute, compare with the range; or same-sign operands with opposite-sign result.",
      "**Equivalence or minimisation:** is this identity true, which expression is minimal, how many literals or gates? Tool: truth table or K-map; compare options by covering the 1s and avoiding the 0s.",
      "**Read a circuit:** what does this diagram compute? Tool: name each wire, substitute from the inputs outward; minterm lists combine by intersection, union and symmetric difference.",
      "**Step a machine:** what is the state after k clocks, how many states, which state never occurs? Tool: the flip-flop equations and a small table; partition refinement for state minimisation.",
    ] },
    { t: "fig", id: "l7-f2" },
    { t: "p", text: "For all five, the best check is **substitution of a small case**. If you have a formula for the state after k clocks, check k = 1. If you have a minimal SOP, check the 1s and 0s. If you have a decoded floating-point value, check the sign and the order of magnitude. Each check takes under a minute and catches the common slips." },
    { t: "ex", id: "l7-e1" },
    { t: "ex", id: "l7-e2" },

    { t: "h2", text: "Method for the multiple-select questions" },
    { t: "p", text: "A multiple-select question with four statements is four small true-or-false problems. For each statement, decide by a **counterexample** if it is false (one input where it fails) or by a **proof** (a law, or a full truth table) if it is true. Do not stop at the first true statement: every option is checked. A statement that looks plausible and has no proof is probably false, since the paper's false options are built to look plausible." },
    { t: "p", text: "Typical false options and their giveaways: a Boolean identity that mixes AND and OR roles (a · a′ = 1); a K-map group that wraps wrongly or crosses a zero; an overflow rule that confuses carry-out with signed overflow; a flip-flop equation with the wrong sign (T = Q ⊕ Q⁺, not Q + Q⁺); a floating-point value computed with the exponent field taken as the true exponent." },

    { t: "h2", text: "Mixed practice" },
    { t: "p", text: "The questions below need two ideas from different chapters. Try them before reading the answers." },
    { t: "ul", items: [
      "A 4-bit 2's complement adder adds 0111 and 0101. State the sum bits and say whether overflow occurs. (L1 and L4.)",
      "How many 2-input NAND gates are needed to build x ⊕ y if both complements are available? (L2 and L3.)",
      "A mod-6 counter is built from T flip-flops. How many flip-flops, and which state resets it? (L5.)",
      "The word 0x40800000 is added to 0x40800000. Give the result in hex. (L6.)",
      "A 5-to-32 decoder is used as a chip select for a memory of 32 chips of 1 KB each. How many address bits does the whole memory have? (L4.)",
    ] },
    { t: "p", text: "The answers: (1) 0111 + 0101 = 1100 with the carry-in to the sign 1 and carry-out 0: both operands are positive (+7, +5) and the sum 1100 is negative: overflow. (2) x ⊕ y = (x + y)(x̄ + ȳ), with complements available: NAND(NAND(x, ȳ), NAND(x̄, y)) is 3 NAND gates. (3) A mod-6 counter counts 0 to 5, so it needs 3 flip-flops (2³ = 8 ≥ 6) and resets when the state reaches 6 = 110. (4) 0x40800000 is 4.0; 4.0 + 4.0 = 8.0 = 1.0 × 2³: exponent 130 = 10000010, so the word is 0x41000000. (5) 32 chips of 1 KB: 5 bits to choose the chip and 10 bits within it: 15 address bits." },
    { t: "p", text: "Finally, a word on time. A one-mark question should take about two minutes and a two-mark question about four. If a K-map or a state table is going to take longer, write the truth table of the options instead, which is always fast for three or four variables." },

    { t: "h2", text: "Habits that save marks" },
    { t: "p", text: "**Read the picture twice.** For a circuit question, first name the blocks (decoder, mux, flip-flop) and the labels on every input; then read the question. Many marks are lost by assuming the select line order or which output is which." },
    { t: "p", text: "**Write units and fields.** For floating point, write the three fields (sign, exponent, fraction) before computing anything. For overflow, write the range of the number system first. For K-maps, write the Gray-code labels on both axes before you place a single 1." },
    { t: "p", text: "**Check the sign of small cases.** If the answer to a two's complement question is positive but both operands were negative, something is wrong. If a decoded floating-point number has the wrong order of magnitude, the exponent was misread. If a minimal expression covers a cell that is 0, a group was drawn too large." },
    { t: "p", text: "**Do not over-minimise.** A question that asks which options are *equivalent* needs no minimisation at all: test each by truth table. A question that asks which are *minimal* needs the minimum first. Reading which one the question asks saves several minutes." },
    { t: "p", text: "**Use symmetry and structure.** The majority function, the XOR chain and the Johnson counter all have regular shapes. Recognising the shape (a majority is 1 when two of three inputs are 1; an XOR of k variables is 1 for an odd number of ones; a Johnson counter has 2n states) answers the question without any table." },
    { t: "p", text: "**Revise by pattern, not by year.** After the first pass, take one pattern at a time (all the overflow questions, then all the K-map questions) and solve them together. The repeated structure becomes visible, and the second solve of each is much faster than the first." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["69 questions: number representation 16, Boolean algebra 10, minimisation 9, combinational circuits 13, sequential circuits 11, floating point 10.", "Five patterns: convert or decode, overflow or range, equivalence or minimisation, read a circuit, step a machine.", "Check small cases; use truth tables for MSQ; test each option separately.", "Study order: L1 and L6 first, then L2 and L3, then L4 and L5.", "Time: about 2 minutes for a one-mark question, 4 for a two-mark question."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "l7-f1", caption: "The 69 Digital Logic questions of 2017 to 2026 by chapter. Number representation (L1) is the largest group, then combinational circuits (L4); number representation and floating point together are 26 questions.", alt: "A table with each chapter and the number of questions it has.", fig: { kind: "trace", title: "Questions per chapter", cols: ["chapter", "questions", "share"], rows: [
      { cells: ["L1 Number representation", 16, "23%"], tone: "ok" }, { cells: ["L2 Gates, Boolean algebra", 10, "14%"] }, { cells: ["L3 Minimisation", 9, "13%"] },
      { cells: ["L4 Combinational circuits", 13, "19%"], tone: "ok" }, { cells: ["L5 Sequential circuits", 11, "16%"] }, { cells: ["L6 Floating point", 10, "14%"] },
    ] } },
    { type: "figure", id: "l7-f2", caption: "The five question patterns and the first tool for each.", alt: "A table of five patterns with the tool to reach for.", fig: { kind: "trace", title: "Pattern and tool", cols: ["pattern", "first tool"], rows: [
      { cells: ["Convert or decode", "write the bits, split the fields"] }, { cells: ["Overflow or range", "decimal check; same-sign rule"] },
      { cells: ["Equivalence, minimisation", "truth table or K-map; test each option"] }, { cells: ["Read a circuit", "name each wire; minterm set operations"] },
      { cells: ["Step a machine", "next-state equations and a table"] },
    ] } },

    { type: "example", id: "l7-e1", level: "edge", title: "A carry-lookahead check · generate and propagate for 0110 + 0111", file: "lookahead_check.txt", given: `Add a = 0110 and b = 0111 with carry-in c0 = 0. Compute g_i = a_i b_i and p_i = a_i xor b_i for each bit (bit 0 is least significant) and the carries c1..c4 by c_(i+1) = g_i + p_i c_i.`, find: "The carries and the sum.", steps: [
      { say: "Bits (a, b): bit 0: (0, 1), bit 1: (1, 1), bit 2: (1, 1), bit 3: (0, 0). g = 0, 1, 1, 0 and p = 1, 0, 0, 0.", result: "g3g2g1g0 = 0110, p3p2p1p0 = 0001" },
      { say: "c1 = g0 + p0 c0 = 0. c2 = g1 + p1 c1 = 1. c3 = g2 + p2 c2 = 1. c4 = g3 + p3 c3 = 0.", result: "carries 0, 1, 1, 0" },
      { say: "Sum bit i = p_i xor c_i: bit 0: 1 xor 0 = 1; bit 1: 0 xor 0 = 0; bit 2: 0 xor 1 = 1; bit 3: 0 xor 1 = 1. The sum is 1101 = 13 (6 + 7).", result: "1101" },
    ], answer: "carries 0, 1, 1, 0 and sum 1101", check: "6 + 7 = 13 = 1101. As 4-bit 2's complement this is a signed overflow: +6 + 7 gives a negative number." },
    { type: "example", id: "l7-e2", level: "edge", title: "A mixed question · overflow, then the same bits as a floating-point exponent", file: "mixed_overflow.txt", given: `5-bit 2's complement numbers A = 01101 and B = 00111. (a) Does A + B overflow? (b) The exponent field of a single-precision number is 01101101 (as unsigned); what is the true exponent?`, find: "Both answers.", steps: [
      { say: "(a) A = 13, B = 7; the sum 20 is above the range maximum 15 of 5 bits. Overflow: two positives give 10100, which reads as −12.", result: "yes, overflow" },
      { say: "(b) 01101101 = 109; the true exponent is 109 − 127 = −18.", result: "−18" },
    ], answer: "(a) yes, (b) −18", check: "Signed overflow is a range check; an exponent field is always read minus the bias." },

    { type: "trap", wrong: "Marks are decided only by hard questions, so skip the easy-looking arithmetic chapters.", tempting: "Number representation looks too simple to matter.", whyWrong: "Number representation and floating point together are 26 of the 69 questions, and almost all of them are easy or medium. They are the cheapest marks in the subject; a missed one is a pure loss.", rule: "Do the pencil-and-paper chapters first.", ex: { text: "16 + 10 = 26 questions, about three eighths of the subject, solved by conversions and a bias." } },

    { type: "gate", text: "This chapter ties together the questions of every earlier Digital Logic chapter: the two edge examples above are joint exercises; every real question is solved in the chapter named in the table." },
    { type: "recall", cards: [
      { q: "How many Digital Logic questions are in the bank (2017 to 2026)?", a: "69, worth 103 marks." },
      { q: "Which chapter has the most questions?", a: "L1, number representation, with 16; combinational circuits follow with 13." },
      { q: "The five patterns?", a: "Convert or decode; overflow or range; equivalence or minimisation; read a circuit; step a machine." },
      { q: "Best check for a multiple-select statement?", a: "A counterexample or a full truth table." },
      { q: "Time per mark?", a: "About two minutes." },
      { q: "Signed overflow rule?", a: "Same-sign operands, opposite-sign result." },
      { q: "T input for a change Q to Q⁺?", a: "T = Q ⊕ Q⁺." },
      { q: "Floating-point exponent field to true exponent?", a: "Subtract the bias 127." },
    ] },
    { type: "check", questions: [
      { id: "l7c1", kind: "NAT", marks: 1, q: "A 4-bit 2's complement adder adds 0111 and 0001. Does it overflow? Answer 1 for yes, 0 for no.", answer: "1", solution: "7 + 1 = 8, above the maximum 7: overflow." },
      { id: "l7c2", kind: "NAT", marks: 1, q: "How many select lines does a mux with 256 inputs need?", answer: "8", solution: "log₂ 256 = 8." },
      { id: "l7c3", kind: "MCQ", marks: 1, q: "The XOR of three variables x ⊕ y ⊕ z has how many minterms?", options: ["2", "4", "6", "8"], answer: "B", solution: "It is 1 when an odd number of inputs are 1: 4 of 8 rows." },
      { id: "l7c4", kind: "MSQ", marks: 2, q: "Which are true?", options: ["A Johnson counter of n flip-flops has 2n states", "2's complement has one zero", "x + x′ = 0", "A ripple counter divides the frequency by 2ⁿ"], answer: "A, B, D", solution: "x + x′ = 1." },
      { id: "l7c5", kind: "NAT", marks: 2, q: "The single-precision word 0x3F800000 plus itself gives a word whose exponent field in decimal is", answer: "128", solution: "1.0 + 1.0 = 2.0 = 1.0 × 2¹: exponent 1 + 127 = 128." },
      { id: "l7c6", kind: "NAT", marks: 2, q: "f = Σ(1, 3, 5, 7) of 3 variables a, b, c (a MSB). The minimal SOP has how many literals?", answer: "1", solution: "f = c." },
      { id: "l7c7", kind: "MCQ", marks: 2, q: "A chip-select AND gate has five inputs, two of them bubbled, on a 16-bit address bus. The number of addresses it enables is", options: ["2048", "1024", "4096", "32"], answer: "A", solution: "Five bits fixed, 11 free: 2¹¹ = 2048." },
      { id: "l7c8", kind: "NAT", marks: 2, q: "A mod-10 counter needs how many flip-flops at least?", answer: "4", solution: "2⁴ = 16 ≥ 10 > 8." },
    ] },
    { type: "practice", links: [{ label: "All Digital Logic questions", sub: "Digital Logic", href: "/topics/digital-logic" }, { label: "The Digital Logic book", sub: "back to the contents", href: "/study/number-codes" }] },
    { type: "links", prereq: ["L1 to L6"], usedIn: ["Revision before the exam"], cross: ["Computer Organisation: data representation and the ALU"] },
  ],
};
