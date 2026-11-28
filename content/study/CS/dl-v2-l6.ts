import type { Topic } from "@/lib/study/schema";

/**
 * Digital Logic chapter L6 "Computer arithmetic: IEEE 754 floating point" (28 Nov 2026). The single-precision format (sign, 8-bit biased exponent, 23-bit fraction with a hidden 1),
 * decoding and encoding, the special values and the extreme numbers, and addition, multiplication and division of floating-point numbers. Fixed-point and integer arithmetic are in L1.
 * Real GATE questions (texts from public/data/questions.json, pictures read from public/images), each re-solved here and checked by a C program:
 * 2026 FN Q36 (35C00000 + 34A00000 = 35E80000), 2026 AN Q34 (0xC2710000 = -60.25), 2025 AN Q49 (-9, 6 and 12: A, B and C), 2024 AN Q23 (the largest finite number: exponent 11111110, all-ones fraction),
 * 2023 FN Q45 (product 0xC15C2EF4), 2022 FN Q41 (B is false), 2021 FN Q65 (-7.75), 2021 AN Q17 (smallest normalised: exponent 00000001, fraction 0), 2020 FN Q59 (quotient 0xC0800000),
 * 2017 AN Q12 (0x3E6D0000 is about 0.23, closest to 2.27 x 10^-1).
 * Programs compiled and run with gcc: -60.25; 35E80000; the 2025 values; C15C2EF4; C0800000; -7.75; 0.231; 7F7FFFFF and 00800000.
 */
export const chapterL6: Topic = {
  id: "cs.dl.v2.float6",
  title: "Computer arithmetic: IEEE 754 floating point",
  no: "L6",
  book: [
    { t: "p", text: "Fixed point (Chapter L1) cannot store both the size of a galaxy and the size of an atom with the same bits. **Floating point** can: it stores a number the way scientific notation does, as a **sign**, a **significand** (the digits) and an **exponent** (the power of the base). Every modern computer follows one standard, **IEEE 754**, and the paper asks about its single-precision, 32-bit form again and again: ten of the 69 Digital Logic questions are on floating point." },
    { t: "p", text: "The questions are of three kinds: **decode** a hexadecimal word into a decimal number (or the reverse), **do arithmetic** (add, multiply, divide) and give the result as hexadecimal, and **name the extreme values** (the smallest normalised number, the largest finite number). Each is mechanical once you know the layout, which is why this chapter is high value for little reading." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["split a 32-bit word into sign, exponent and fraction and decode it;", "convert a decimal number to IEEE 754 single precision;", "state the special values: zero, denormals, infinity and NaN;", "give the smallest normalised positive number and the largest finite number;", "add, multiply and divide floating-point numbers and write the result in hex;", "estimate the precision of the format."] },

    { t: "h2", text: "The single-precision format" },
    { t: "p", text: "A 32-bit IEEE 754 single-precision number has three fields, from the left: **1 sign bit** s, **8 exponent bits** E and **23 fraction bits** F. For a normal number the value is" },
    { t: "callout", kind: "key", text: "value = (−1)ˢ × 1.F × 2^(E − 127), with E from 1 to 254. The leading 1 before the fraction point is not stored (the hidden bit). 127 is the bias." },
    { t: "p", text: "Three ideas are packed into that line. The **sign bit** is 0 for positive and 1 for negative (sign-magnitude, not 2's complement). The **exponent** is stored with a **bias** of 127 (excess-127), so that exponents from −126 to +127 are stored as the unsigned numbers 1 to 254; this lets floating-point numbers be compared as if they were integers. The **fraction** holds the digits after the binary point, and a **hidden 1** is understood before it: 1.F, so the significand lies from 1 up to just under 2, and 24 bits of precision are stored in 23 bits." },
    { t: "fig", id: "l6-f1" },
    { t: "p", text: "To read a hexadecimal word, write it in binary and split it 1 + 8 + 23. Take GATE 2021's number: sign 1, exponent 10000001, fraction 1111 0000 0000 0000 0000 000. The exponent is 129, so the power is 2^(129 − 127) = 2² = 4. The significand is 1.1111 in binary: 1 + ½ + ¼ + ⅛ + 1/16 = 1.9375. The value is −1.9375 × 4 = **−7.75**." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    unsigned u = (1u << 31) | (129u << 23) | (0x78u << 16);   /* S = 1, E = 10000001, F = 1111 0000... */
    float f;
    memcpy(&f, &u, 4);                                         /* read the same bits as a float */
    printf("%.2f\\n", f);
    return 0;
}`, out: "-7.75", file: "decode_float.c" },
    { t: "ex", id: "l6-e1" },
    { t: "p", text: "A hexadecimal word is quicker: GATE 2026 gives 0xC2710000. In binary this is 1100 0010 0111 0001 0000 0000 0000 0000. Split: sign 1; exponent 1000 0100 = 132, so the power is 2⁵ = 32; fraction 111 0001 0000…, so the significand is 1 + ½ + ¼ + ⅛ + 1/128 = 1.8828125. The value is −1.8828125 × 32 = **−60.25**." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    unsigned u = 0xC2710000u;
    float f;
    memcpy(&f, &u, 4);
    printf("%.2f\\n", f);
    return 0;
}`, out: "-60.25", file: "decode_hex.c" },
    { t: "ex", id: "l6-e2" },

    { t: "h2", text: "Converting a decimal number to IEEE 754" },
    { t: "p", text: "To encode a number, **normalise** it as ±1.F × 2ᵉ, then store e + 127 as the exponent and the digits after the point as the fraction. For 12: 12 = 1100₂ = 1.1 × 2³, so the sign is 0, the exponent is 3 + 127 = 130 = 1000 0010, and the fraction is 1000 0000 0000 0000 0000 000. As a word: 0 10000010 1000… = 0100 0001 0100 0000 … = **0x41400000**. Likewise 6 = 1.1 × 2² gives 0x40C00000 (exponent 129), and −9 = −1.001 × 2³ gives 0xC1100000." },
    { t: "p", text: "That is the working of GATE 2025, which gives three registers R_X = 0xC1100000, R_Y = 0x40C00000 and R_Z = 0x41400000 and asks which equations are correct. Decode: R_X is −1.125 × 2³ = −9; R_Y is 1.5 × 2² = 6; R_Z is 1.5 × 2³ = 12. Then A, 4(X + Y) + Z = 4(−3) + 12 = 0, is true. B, 2Y − Z = 12 − 12 = 0, is true. C, 4X + 3Z = −36 + 36 = 0, is true. D, X + Y + Z = −9 + 6 + 12 = 9, is false. The correct equations are A, B and C." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

float of(unsigned u) { float f; memcpy(&f, &u, 4); return f; }

int main(void) {
    float X = of(0xC1100000u), Y = of(0x40C00000u), Z = of(0x41400000u);
    printf("%.0f %.0f %.0f | %d %d %d %d\\n", X, Y, Z,
           4 * (X + Y) + Z == 0, 2 * Y - Z == 0, 4 * X + 3 * Z == 0, X + Y + Z == 0);
    return 0;
}`, out: "-9 6 12 | 1 1 1 0", file: "three_registers.c" },
    { t: "ex", id: "l6-e3" },
    { t: "p", text: "A binary fraction can be converted by repeated doubling: 0.8125 is 0.1101₂. Note that most decimal fractions such as 0.1 have **no finite binary form**: 0.1 = 0.0001100110011…₂, repeating, so it is stored only approximately and the error shows in sums. This is why a sum of ten 0.1s is not exactly 1.0 in a computer." },

    { t: "h2", text: "Special values and the extremes" },
    { t: "p", text: "The two end exponents, all zeros (E = 0) and all ones (E = 255), are reserved. **E = 0, F = 0** is **zero** (there is +0 and −0). **E = 0, F ≠ 0** is a **denormal** (subnormal) number, with value (−1)ˢ × 0.F × 2⁻¹²⁶: no hidden 1, so the numbers shrink smoothly towards zero instead of jumping. **E = 255, F = 0** is **infinity** (+∞ or −∞), and **E = 255, F ≠ 0** is **NaN** (not a number), the result of 0/0 or ∞ − ∞." },
    { t: "table", head: ["E", "F", "Meaning"], rows: [
      ["0", "0", "zero (±0)"], ["0", "≠ 0", "denormal: ±0.F × 2⁻¹²⁶"], ["1 to 254", "any", "normal: ±1.F × 2^(E−127)"], ["255", "0", "infinity"], ["255", "≠ 0", "NaN"],
    ], caption: "What each exponent field means in single precision." },
    { t: "p", text: "The extremes follow. The **smallest positive normalised** number has the smallest normal exponent E = 1 and F = 0: 1.0 × 2⁻¹²⁶ = 0x00800000. GATE 2021 offers four words; exponent 00000000 with a fraction of all zeros is zero, exponent 00000000 with a one in the last place is a denormal, and only exponent 00000001 with a zero fraction is the smallest **normalised** positive number: option A. The **largest finite** number has E = 254 and F all ones: (2 − 2⁻²³) × 2¹²⁷ = 0x7F7FFFFF, about 3.4 × 10³⁸." },
    { t: "p", text: "GATE 2024 shows four words in a picture and asks for the largest number. The word with exponent 0111 1111 and fraction all ones is just under 2; the word with exponent 0111 1111 and fraction zero is exactly 1; the word with exponent **1111 1111** and a nonzero fraction is **NaN**, which is not a number at all, so it cannot be 'largest'; and the word with exponent **1111 1110** and fraction all ones is the largest finite number. So the answer is the option whose picture shows exponent 1111 1110 with an all-ones fraction: in the app that picture is the one listed as option B." },
    { t: "fig", id: "l6-f2" },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    float big = 3.4028234663852886e38f, small = 1.17549435e-38f;     /* the extremes, found by name */
    unsigned a, b;
    memcpy(&a, &big, 4); memcpy(&b, &small, 4);
    printf("%08X %08X\\n", a, b);                                     /* largest finite, smallest normal */
    return 0;
}`, out: "7F7FFFFF 00800000", file: "float_extremes.c" },
    { t: "ex", id: "l6-e4" },

    { t: "h2", text: "Adding floating-point numbers" },
    { t: "p", text: "Addition needs the two exponents to match. The method: (1) **align**: shift the significand of the number with the smaller exponent right until the exponents agree; (2) **add** (or subtract, for opposite signs) the significands; (3) **normalise** the result to 1.F form, adjusting the exponent; (4) **round** to 23 fraction bits." },
    { t: "p", text: "GATE 2026: X = 0x35C00000 and Y = 0x34A00000. Decode X: sign 0, exponent 0110 1011 = 107, so 2^(107 − 127) = 2⁻²⁰; fraction 100…, significand 1.5: X = 1.5 × 2⁻²⁰. Decode Y: exponent 0110 1001 = 105, power 2⁻²²; fraction 010…, significand 1.25: Y = 1.25 × 2⁻²². Align Y to the larger exponent (2⁻²⁰): shift its significand right by 2: 1.25 becomes 0.3125 (× 2⁻²⁰). Add: 1.5 + 0.3125 = 1.8125 × 2⁻²⁰. Already normalised. Fraction: 0.8125 = 0.1101₂, so F = 1101 000…. Exponent 107 = 0110 1011. The word: 0 01101011 1101000… = 0011 0101 1110 1000 … = **0x35E80000**, option C." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    unsigned a = 0x35C00000u, b = 0x34A00000u, r;
    float x, y, z;
    memcpy(&x, &a, 4); memcpy(&y, &b, 4);
    z = x + y;                                      /* the hardware does the align, add, normalise, round */
    memcpy(&r, &z, 4);
    printf("%08X\\n", r);
    return 0;
}`, out: "35E80000", file: "float_add.c" },
    { t: "ex", id: "l6-e5" },
    { t: "p", text: "Two cautions. When numbers of very different size are added, the smaller is shifted so far right that its bits vanish: 1.0 + 2⁻³⁰ equals 1.0 in single precision. And floating-point addition is **not associative**: (a + b) + c can differ from a + (b + c) because of rounding at each step." },

    { t: "h2", text: "Multiplication and division" },
    { t: "p", text: "Multiplication is simpler than addition. The result's sign is the XOR of the signs; the exponents **add** (and one bias is subtracted, since both were stored with +127); the significands **multiply**, and the product is normalised and rounded. For division: signs XOR, exponents **subtract** (and the bias is added back), significands divide." },
    { t: "p", text: "GATE 2023 multiplies P = 0xC1800000 by Q = 0x3F5C2EF4. P: sign 1, exponent 1000 0011 = 131, power 2⁴, fraction 0: P = −16. Q: sign 0, exponent 0111 1110 = 126, power 2⁻¹, fraction 0x5C2EF4, so Q = 1.F × ½ (about 0.86). The product is −16 × Q: because 16 is a power of two, only the exponent changes: Q's exponent 126 plus 4 is 130 = 1000 0010, the fraction is unchanged, the sign is 1. The word: 1 10000010 followed by Q's fraction 0x5C2EF4: 1100 0001 0101 1100 0010 1110 1111 0100 = **0xC15C2EF4**, option C." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    unsigned a = 0xC1800000u, b = 0x3F5C2EF4u, r;
    float p, q, z;
    memcpy(&p, &a, 4); memcpy(&q, &b, 4);
    z = p * q;
    memcpy(&r, &z, 4);
    printf("%08X\\n", r);
    return 0;
}`, out: "C15C2EF4", file: "float_mul.c" },
    { t: "ex", id: "l6-e6" },
    { t: "p", text: "GATE 2020 divides R1 = 0x42200000 by R2 = 0xC1200000. R1: sign 0, exponent 1000 0100 = 132, power 2⁵, fraction 010…: 1.25 × 32 = 40. R2: sign 1, exponent 1000 0010 = 130, power 2³, fraction 010…: −1.25 × 8 = −10. The quotient is 40 / (−10) = −4 = −1.0 × 2²: sign 1, exponent 2 + 127 = 129 = 1000 0001, fraction 0. The word: 1 10000001 000… = 1100 0000 1000 0000 … = **0xC0800000**, option B." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    unsigned a = 0x42200000u, b = 0xC1200000u, r;
    float x, y, z;
    memcpy(&x, &a, 4); memcpy(&y, &b, 4);
    z = x / y;
    memcpy(&r, &z, 4);
    printf("%08X\\n", r);
    return 0;
}`, out: "C0800000", file: "float_div.c" },
    { t: "ex", id: "l6-e7" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Checking a set of statements about floating-point words" },
    { t: "p", text: "A common pattern is a picture or list of three registers followed by four equations, of which one is false. Decode each register to a decimal value first, then test the equations in decimal. GATE 2022 gives three registers R_A = 0xC1400000, R_B = 0x42100000 and R_C = 0x41400000 (the printed R_B has an extra digit; the reading that makes exactly one statement false is 0x42100000), and asks which statement is false. R_A = −12 (exponent 130, power 8, significand 1.5). R_B = 36 (exponent 132, power 32, significand 1.125). R_C = +12. Then A + C = 0 is true; B = 3C, 36 = 36, is true; B − C = 24 > 0 is true; but C = A + B asks whether 12 = −12 + 36 = 24, which is **false**. The false statement is B." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

float of(unsigned u) { float f; memcpy(&f, &u, 4); return f; }

int main(void) {
    float A = of(0xC1400000u), B = of(0x42100000u), C = of(0x41400000u);
    printf("%d %d %d %d\\n", A + C == 0, C == A + B, B == 3 * C, B - C > 0);
    return 0;
}`, out: "1 0 1 1", file: "false_statement.c" },
    { t: "ex", id: "l6-e8" },
    { t: "p", text: "The last decode in the paper is GATE 2017's: the 32-bit pattern 0011 1110 0110 1101 0000 0000 0000 0000 (0x3E6D0000) is positive, with exponent 0111 1100 = 124, so the power is 2⁻³ = 0.125, and a fraction beginning 1101101, so the significand is 1 + 0.5 + 0.25 + 0.0625 + 0.03125 + 0.0078125 = 1.8515625. The value is 1.8515625 × 0.125 = 0.2314…, which is closest to 2.27 × 10⁻¹ among the options." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    unsigned u = 0x3E6D0000u;
    float f;
    memcpy(&f, &u, 4);
    printf("%.3f\\n", f);
    return 0;
}`, out: "0.231", file: "decode_2017.c" },
    { t: "ex", id: "l6-e9" },

    { t: "h2", text: "Precision, range and double precision" },
    { t: "p", text: "Single precision has 24 bits of significand (23 stored plus the hidden bit), which is about **7 decimal digits** of precision, and a range of roughly 10⁻³⁸ to 10³⁸. **Double precision** (64 bits: 1 sign, 11 exponent with bias 1023, 52 fraction) has 53 bits of significand, about 16 decimal digits, and a range of roughly 10⁻³⁰⁸ to 10³⁰⁸. The gap between neighbouring numbers is not constant: it doubles each time the exponent increases by one, so large numbers are spaced further apart, and the **relative** spacing stays about 2⁻²³." },
    { t: "p", text: "Rounding to nearest, ties to even, is the default. Errors accumulate in long calculations, which is why equality tests on floating-point results are dangerous: compare with a small tolerance instead." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Single precision: 1 sign, 8 exponent (bias 127), 23 fraction; value = (−1)ˢ × 1.F × 2^(E − 127) for E = 1..254.", "Decode by splitting the binary 1 + 8 + 23; encode by normalising to 1.F × 2ᵉ and storing e + 127.", "E = 0: zero or denormal (no hidden 1); E = 255: infinity (F = 0) or NaN (F ≠ 0).", "Smallest normalised positive: E = 1, F = 0 (0x00800000). Largest finite: E = 254, F all ones (0x7F7FFFFF).", "Addition: align exponents, add significands, normalise, round. Multiplication: add exponents (minus bias), multiply significands. Division: subtract exponents.", "Floating-point addition is not associative; most decimals like 0.1 are inexact.", "Double precision: 1 + 11 + 52, bias 1023, about 16 digits."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "l6-f1", caption: "The 32 bits of an IEEE 754 single-precision number. 0xC2710000 splits as sign 1, exponent 10000100 (132), fraction 11100010000…; it is −1.8828125 × 2⁵ = −60.25.", alt: "A row of the three fields: sign 1, exponent 1000 0100, fraction 1110 0010 0000 0000 0000 000.", fig: { kind: "bits", title: "0xC2710000", weights: false, group: 4, rows: [
      { label: "sign", bits: "1", value: "negative" }, { label: "exponent", bits: "10000100", value: "132, so 2⁵", hl: [0, 5] }, { label: "fraction", bits: "11100010000000000000000", value: "1.8828125", tone: "ok" },
    ] } },
    { type: "figure", id: "l6-f2", caption: "Special and extreme values. The smallest normalised positive number and the largest finite number sit just inside the two reserved exponent codes.", alt: "A table of exponent and fraction fields with the value or name they give.", fig: { kind: "trace", title: "Fields and values", cols: ["exponent", "fraction", "value"], rows: [
      { cells: ["00000000", "0", "zero"] }, { cells: ["00000000", "000…001", "smallest denormal 2⁻¹⁴⁹"] },
      { cells: ["00000001", "0", "smallest normal 2⁻¹²⁶ (0x00800000)"], tone: "ok" }, { cells: ["01111111", "0", "exactly 1.0"] },
      { cells: ["11111110", "all ones", "largest finite (0x7F7FFFFF)"], tone: "ok" }, { cells: ["11111111", "0", "infinity"] }, { cells: ["11111111", "nonzero", "NaN"], tone: "bad" },
    ] } },

    { type: "example", id: "l6-e1", level: "gate", title: "GATE CS 2021 (forenoon), Q65 · 1 mark · NAT: decode S = 1, E = 10000001, F = 11110000…", file: "gate2021_fn_q65.txt", given: `IEEE 754 single precision, bias 127: S = 1, E = 10000001, F = 11110000000000000000000. The decimal value, to 2 places?`, find: "The decimal value.", steps: [
      { say: "E = 10000001 = 129, so the power is 2^(129 − 127) = 4.", result: "× 4" },
      { say: "Significand 1.1111 (binary) = 1 + 0.5 + 0.25 + 0.125 + 0.0625 = 1.9375.", result: "1.9375" },
      { say: "Sign 1: negative. −1.9375 × 4.", result: "−7.75" },
    ], answer: "−7.75", check: "The program in this chapter prints -7.75." },
    { type: "example", id: "l6-e2", level: "gate", title: "GATE CS 2026 (afternoon), Q34 · 1 mark · NAT: 0xC2710000 in decimal", file: "gate2026_an_q34.txt", given: `The 32-bit IEEE 754 single-precision representation of a number is 0xC2710000. The number in decimal, rounded to two places?`, find: "The decimal value.", steps: [
      { say: "0xC2710000 = 1100 0010 0111 0001 0000…: sign 1, exponent 10000100 = 132, fraction 1110001000…", result: "s = 1, E = 132" },
      { say: "Significand = 1 + 0.5 + 0.25 + 0.125 + 0.0078125 = 1.8828125; power 2^(132 − 127) = 32.", result: "1.8828125 × 32" },
      { say: "−1.8828125 × 32 = −60.25.", result: "−60.25" },
    ], answer: "−60.25", check: "The program in this chapter prints -60.25." },
    { type: "example", id: "l6-e3", level: "gate", title: "GATE CS 2025 (afternoon), Q49 · 2 marks · MSQ: three registers", file: "gate2025_an_q49.txt", given: `R_X = 0xC1100000, R_Y = 0x40C00000, R_Z = 0x41400000 in IEEE 754 single precision. Which are correct?
A) 4(X + Y) + Z = 0   B) 2Y − Z = 0   C) 4X + 3Z = 0   D) X + Y + Z = 0`, find: "The correct statements.", steps: [
      { say: "R_X: sign 1, exponent 130 (power 8), fraction .001: −1.125 × 8 = −9. R_Y: exponent 129 (power 4), fraction .1: 1.5 × 4 = 6. R_Z: exponent 130, fraction .1: 1.5 × 8 = 12.", result: "X = −9, Y = 6, Z = 12" },
      { say: "A: 4(−3) + 12 = 0. B: 12 − 12 = 0. C: −36 + 36 = 0. D: −9 + 6 + 12 = 9.", result: "A, B, C true; D false" },
    ], answer: "A, B, C", check: "The program in this chapter prints -9 6 12 | 1 1 1 0." },
    { type: "example", id: "l6-e4", level: "gate", title: "GATE CS 2024 (afternoon), Q23 · 1 mark · the largest floating-point number, and GATE CS 2021 (afternoon), Q17 · the smallest normalised", file: "gate2024_an_q23.txt", given: `2024: four single-precision words (picture): exponent 01111111 with all-ones fraction; exponent 01111111 with zero fraction; exponent 11111110 with all-ones fraction; exponent 11111111 with all-ones fraction. Which is the largest?
2021: the smallest normalised positive number has (exponent, mantissa) = ? Options include (00000001, all zeros), (00000000, …001), (00000000, all zeros), (00000001, …001).`, find: "The two answers.", steps: [
      { say: "Exponent 11111111 with a nonzero fraction is NaN, not a number. The next largest exponent is 11111110; with all-ones fraction it is (2 − 2⁻²³) × 2¹²⁷, bigger than any word with exponent 01111111.", result: "exponent 11111110, all ones" },
      { say: "Normalised means the hidden 1 is present, so the exponent field must be at least 00000001. The smallest is exponent 00000001, fraction 0: 2⁻¹²⁶.", result: "exponent 00000001, fraction 0" },
    ], answer: "the 11111110 word; (00000001, 0), which is option A of 2021", check: "The program in this chapter prints 7F7FFFFF and 00800000." },
    { type: "example", id: "l6-e5", level: "gate", title: "GATE CS 2026 (forenoon), Q36 · 2 marks · IEEE 754 addition", file: "gate2026_fn_q36.txt", given: `X = 0x35C00000 and Y = 0x34A00000 in IEEE 754 single precision. Z = X + Y. The binary representation of Z in hex?
A) 35C80000   B) 35CC0000   C) 35E80000   D) 35EC0000`, find: "The hexadecimal word of Z.", steps: [
      { say: "X: exponent 0x6B = 107, so 2⁻²⁰, fraction .1: X = 1.5 × 2⁻²⁰. Y: exponent 105, so 2⁻²², fraction .01: Y = 1.25 × 2⁻²².", result: "1.5 × 2⁻²⁰ and 1.25 × 2⁻²²" },
      { say: "Align Y to 2⁻²⁰: 1.25 / 4 = 0.3125. Add: 1.5 + 0.3125 = 1.8125, already normalised.", result: "1.8125 × 2⁻²⁰" },
      { say: "Fraction 0.8125 = .1101; exponent 107 = 01101011. Word: 0 01101011 1101000… = 0011 0101 1110 1000 …", result: "0x35E80000" },
    ], answer: "C", check: "The program in this chapter prints 35E80000." },
    { type: "example", id: "l6-e6", level: "gate", title: "GATE CS 2023 (forenoon), Q45 · 2 marks · IEEE 754 multiplication", file: "gate2023_fn_q45.txt", given: `P = 0xC1800000 and Q = 0x3F5C2EF4 in IEEE 754 single precision. P × Q in hex?
A) 0x404C2EF4   B) 0x405C2EF4   C) 0xC15C2EF4   D) 0xC14C2EF4`, find: "The product word.", steps: [
      { say: "P = −16: sign 1, exponent 131, fraction 0. Q: positive, exponent 126 (2⁻¹), fraction 0x5C2EF4.", result: "P = −16" },
      { say: "Multiplying by a power of two only changes the exponent: 126 + 4 = 130 = 10000010. Sign 1. Fraction unchanged.", result: "1 10000010 5C2EF4" },
      { say: "Word: 1100 0001 0101 1100 0010 1110 1111 0100.", result: "0xC15C2EF4" },
    ], answer: "C", check: "The program in this chapter prints C15C2EF4." },
    { type: "example", id: "l6-e7", level: "gate", title: "GATE CS 2020 (forenoon), Q59 · 2 marks · IEEE 754 division", file: "gate2020_fn_q59.txt", given: `R1 = 0x42200000 and R2 = 0xC1200000 in IEEE 754 single precision. R3 = R1 / R2. The value in R3?
A) 0x40800000   B) 0xC0800000   C) 0x83400000   D) 0xC8500000`, find: "The value in R3.", steps: [
      { say: "R1: exponent 132 (2⁵), fraction .01: 1.25 × 32 = 40. R2: sign 1, exponent 130 (2³), fraction .01: −10.", result: "40 and −10" },
      { say: "40 / −10 = −4 = −1.0 × 2²: sign 1, exponent 129 = 10000001, fraction 0.", result: "1 10000001 000…" },
      { say: "Word: 1100 0000 1000 0000 0000 0000 0000 0000.", result: "0xC0800000" },
    ], answer: "B", check: "The program in this chapter prints C0800000." },
    { type: "example", id: "l6-e8", level: "gate", title: "GATE CS 2022 (forenoon), Q41 · 2 marks · which statement about three registers is false", file: "gate2022_fn_q41.txt", given: `R_A = 0xC1400000, R_B = 0x42100000 (the printed word has an extra digit), R_C = 0x41400000 in IEEE 754 single precision. Which is FALSE?
A) A + C = 0   B) C = A + B   C) B = 3C   D) (B − C) > 0`, find: "The false statement.", steps: [
      { say: "R_A: sign 1, exponent 130, fraction .1: −12. R_B: exponent 132 (32), fraction .001: 1.125 × 32 = 36. R_C: +12.", result: "A = −12, B = 36, C = 12" },
      { say: "A + C = 0 true; B = 3C: 36 = 36 true; B − C = 24 > 0 true. C = A + B would need 12 = −12 + 36 = 24: false.", result: "B is false" },
    ], answer: "B", check: "The program in this chapter prints 1 0 1 1." },
    { type: "example", id: "l6-e9", level: "gate", title: "GATE CS 2017 (afternoon), Q12 · 1 mark · decode a 32-bit pattern", file: "gate2017_an_q12.txt", given: `00111110011011010000000000000000 in IEEE 754 single precision. The decimal value closest to it?
A) 1.45 × 10¹   B) 1.45 × 10⁻¹   C) 2.27 × 10⁻¹   D) 2.27 × 10¹`, find: "The closest value.", steps: [
      { say: "Sign 0; exponent 01111100 = 124, so 2⁻³ = 0.125; fraction 1101101…", result: "positive, × 0.125" },
      { say: "Significand 1 + 0.5 + 0.25 + 0.0625 + 0.03125 + 0.0078125 = 1.8515625. Value 1.8515625 × 0.125 = 0.2314.", result: "0.2314" },
      { say: "Closest of the four: 2.27 × 10⁻¹ = 0.227.", result: "C" },
    ], answer: "C", check: "The program in this chapter prints 0.231." },

    { type: "trap", wrong: "The exponent field is the true exponent, and the smallest exponent field (0) gives the smallest normal number.", tempting: "The 8 bits are the power of two.", whyWrong: "The field holds the true exponent plus the bias 127, so the true exponent is E − 127. And E = 0 is not a normal exponent: it means zero or a denormal, with no hidden 1. The smallest NORMAL number has E = 1.", rule: "True exponent = E − 127; normal needs E = 1 to 254.", ex: { text: "E = 01111111 = 127 means 2⁰ = 1, not 2¹²⁷." } },
    { type: "trap", wrong: "The word with the largest bit pattern is the largest number, so all-ones exponent and fraction is the biggest.", tempting: "Floating-point words compare like integers.", whyWrong: "They do compare like integers among FINITE positive numbers, but the pattern with exponent 11111111 is infinity or NaN, not a finite number. The largest finite number has exponent 11111110.", rule: "Largest finite: E = 254, F all ones (0x7F7FFFFF).", ex: { text: "0x7FFFFFFF is NaN; 0x7F800000 is infinity; 0x7F7FFFFF is the largest finite number." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q36 · 2026 AN Q34 · 2025 AN Q49 · 2024 AN Q23 · 2023 FN Q45 · 2022 FN Q41 · 2021 FN Q65 · 2021 AN Q17 · 2020 FN Q59 · 2017 AN Q12. Every floating-point question of the bank is solved here." },
    { type: "recall", cards: [
      { q: "Single-precision field widths?", a: "1 sign, 8 exponent, 23 fraction." },
      { q: "The value of a normal number?", a: "(−1)ˢ × 1.F × 2^(E − 127)." },
      { q: "The bias of single precision?", a: "127 (double: 1023)." },
      { q: "E = 0 and E = 255 mean?", a: "Zero or denormal; infinity or NaN." },
      { q: "Smallest normalised positive?", a: "E = 1, F = 0: 2⁻¹²⁶ (0x00800000)." },
      { q: "Largest finite?", a: "E = 254, F all ones: 0x7F7FFFFF, about 3.4 × 10³⁸." },
      { q: "Steps of floating-point addition?", a: "Align, add, normalise, round." },
      { q: "Exponent in a product?", a: "Sum of exponents, minus one bias." },
      { q: "Is 0.1 exact in binary?", a: "No: it repeats." },
      { q: "Digits of precision in single and double?", a: "About 7 and about 16." },
      { q: "Is floating-point addition associative?", a: "No." },
    ] },
    { type: "check", questions: [
      { id: "l6c1", kind: "NAT", marks: 1, q: "The decimal value of the single-precision word 0x40400000 is", answer: "3", solution: "Exponent 0x80 = 128 (2¹), fraction .1: 1.5 × 2 = 3." },
      { id: "l6c2", kind: "NAT", marks: 1, q: "The IEEE 754 single-precision exponent field (decimal) for the number 8.0 is", answer: "130", solution: "8 = 1.0 × 2³; 3 + 127 = 130." },
      { id: "l6c3", kind: "MCQ", marks: 1, q: "The hexadecimal word for 1.0 in single precision is", options: ["0x3F800000", "0x40000000", "0x3F000000", "0x7F800000"], answer: "A", solution: "Exponent 127 = 0111 1111, fraction 0: 0 01111111 000… = 0x3F800000." },
      { id: "l6c4", kind: "NAT", marks: 2, q: "What is the decimal value of 0xC0A00000 (single precision)?", answer: "-5", solution: "Sign 1, exponent 0x81 = 129 (2²), fraction .01: −1.25 × 4 = −5." },
      { id: "l6c5", kind: "MSQ", marks: 2, q: "Which are true of single-precision floating point?", options: ["0x7F800000 is infinity", "The exponent bias is 127", "The significand has a hidden leading 1 for normal numbers", "0x00000000 is NaN"], answer: "A, B, C", solution: "0x00000000 is zero." },
      { id: "l6c6", kind: "NAT", marks: 2, q: "Multiplying 6.0 by 0.5 in single precision gives the exponent field (decimal) of", answer: "128", solution: "6 × 0.5 = 3 = 1.5 × 2¹; 1 + 127 = 128." },
      { id: "l6c7", kind: "MCQ", marks: 2, q: "Adding 1.0 and 2⁻³⁰ in single precision gives", options: ["exactly 1.0", "1 + 2⁻³⁰", "NaN", "infinity"], answer: "A", solution: "2⁻³⁰ is below the last of the 23 fraction bits and is lost." },
      { id: "l6c8", kind: "NAT", marks: 2, q: "How many different normal single-precision numbers have exponent field 127 and a positive sign?", answer: "8388608", solution: "The 23 fraction bits are free: 2²³ = 8388608." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on floating point", sub: "Digital Logic", href: "/topics/digital-logic" }, { label: "Previous-year patterns", sub: "the last chapter", href: "/study/computer-arithmetic" }] },
    { type: "links", prereq: ["Number representation (L1)", "Combinational circuits (L4): adders"], usedIn: ["Computer Organisation: the ALU and floating-point unit"], cross: ["Programming in C: float and double"] },
  ],
};
