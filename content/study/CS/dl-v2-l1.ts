import type { Topic } from "@/lib/study/schema";

/**
 * Digital Logic chapter L1 "Number representation and codes" (28 Nov 2026), moved to the front of the book because K-maps, adders, counters and floating point all need it.
 * Radix and conversion, unsigned and fixed point, sign-magnitude, 1's and 2's complement, arithmetic and overflow, BCD, Gray and parity codes.
 * Real GATE questions (texts from public/data/questions.json), each re-solved here: 2026 FN Q22 (sign-magnitude overflow: B and C), 2026 AN Q28 (4-bit 2's complement overflow: B and D),
 * 2025 FN Q25 (-6 in 8 and 16 bits: B and D), 2024 FN Q18 (5-bit overflow: A - B), 2024 AN Q60 (224 in radix 5 equals 64: A, B, D), 2023 FN Q32 (132 in radix 4 is 110 in radix 5),
 * 2022 FN Q18 (4-bit overflow: B), 2021 FN Q44 (210 in base 3 is 15 in hex), 2021 AN Q36 (0.1101 = 0.8125: x + y = 3), 2019 FN Q17 (-28 in 16 bits: C),
 * 2019 FN Q33 (sign-magnitude difference needs n + 1 bits), 2018 FN Q43 (fixed point: only 12.100 and 3.001 are inexact), 2017 FN Q24 (range 0 to 2^i - 2^-f),
 * 2017 FN Q11 (overflow test: C), 2017 AN Q23 (BCA9 is 136251 in octal), 2017 AN Q25 (base b = 8).
 * Programs compiled and run with gcc: 110; 136251; B D; -52 76 | B C; 1 1 0 0; FA FFFA.
 */
export const chapterL1: Topic = {
  id: "cs.dl.v2.number1",
  title: "Number representation and codes",
  no: "L1",
  book: [
    { t: "p", text: "A computer holds everything as patterns of bits, and every digital circuit in this book, an adder, a counter, a comparator, works on such patterns. Before a gate or a flip-flop can be understood, you need to know what a pattern **means**: which number it stands for, how a negative number is written, when a result is too big to fit. That is the content of this chapter, and it is why it comes first: later chapters on adders and floating point assume all of it." },
    { t: "p", text: "Number representation is also the most generous part of the Digital Logic paper. Sixteen of the 69 Digital Logic questions in the bank are on it, and almost every one is solved with a pencil in under two minutes if you know the rules. The rules are few: radix conversion, the range of each signed format, and the overflow test. Learn them once and these marks are yours." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["convert between decimal, binary, octal, hexadecimal and any other radix;", "state the range of an n-bit number in unsigned, sign-magnitude, 1's complement and 2's complement form;", "write a negative number in 2's complement and extend its width correctly;", "decide whether an addition or subtraction overflows;", "work with fixed-point numbers and say which decimals are exactly representable;", "use BCD, Gray code and parity bits."] },

    { t: "h2", text: "Positional notation and radix" },
    { t: "p", text: "A number written with digits dₙ₋₁ … d₁ d₀ in **radix** (base) r has the value dₙ₋₁·rⁿ⁻¹ + … + d₁·r + d₀. The digits run from 0 to r − 1. In radix 10 the digits are 0 to 9; in radix 2, 0 and 1; in radix 8, 0 to 7; in radix 16, 0 to 9 and then A to F for ten to fifteen. So the number 132 in radix 4 is 1·16 + 3·4 + 2 = 30." },
    { t: "p", text: "Digits after a point carry negative powers: in radix r the digit after the point has weight r⁻¹, the next r⁻², and so on. So (0.1101)₂ = ½ + ¼ + 1/16 = 0.8125. This is GATE 2021: if (0.1101)₂ = (0.8xy5)₁₀ then x = 1 and y = 2, and x + y = 3." },
    { t: "ex", id: "l1-e1" },
    { t: "p", text: "To convert a whole number **from decimal to radix r**, divide repeatedly by r and collect the remainders; the first remainder is the last digit. To convert 30 to radix 5: 30 ÷ 5 = 6 remainder 0; 6 ÷ 5 = 1 remainder 1; 1 ÷ 5 = 0 remainder 1. Reading the remainders from last to first gives 110. So 132 in radix 4 is 110 in radix 5, which is GATE 2023's answer. To convert a fraction, multiply repeatedly by r and collect the integer parts." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n = 1 * 16 + 3 * 4 + 2;                 /* 132 in radix 4 */
    char digits[16];
    int k = 0;
    while (n > 0) { digits[k++] = '0' + n % 5; n = n / 5; }   /* remainders, last digit first */
    for (int i = k - 1; i >= 0; i--) putchar(digits[i]);
    printf("\\n");
    return 0;
}`, out: "110", file: "radix_convert.c" },
    { t: "p", text: "Two small facts save time. A number in radix r with k digits is below rᵏ, so n bits hold 0 to 2ⁿ − 1. And to compare a base-r equation with a decimal one, convert each side. The equation of GATE 2017, x² − 13x + 36 = 0 with roots 5 and 6 in an unknown base b, is solved by noting that the sum of the roots is 11 and equals the number written 13 in base b, which is b + 3, so b = 8; the check is the product, 5 × 6 = 30 = 36 in base 8 (3 · 8 + 6)." },

    { t: "h2", text: "Binary, octal and hexadecimal" },
    { t: "p", text: "Binary is the language of the hardware, but long bit strings are hard to read, so people write them in octal (groups of 3 bits) or hexadecimal (groups of 4 bits). The conversion needs no arithmetic: **group the bits from the point outward and replace each group by its digit.** Since 8 = 2³ and 16 = 2⁴, each octal digit is exactly 3 bits and each hex digit exactly 4." },
    { t: "table", head: ["Decimal", "Binary", "Octal", "Hex"], rows: [
      ["0", "0000", "0", "0"], ["5", "0101", "5", "5"], ["8", "1000", "10", "8"], ["10", "1010", "12", "A"], ["15", "1111", "17", "F"], ["16", "10000", "20", "10"],
    ], caption: "The numbers worth knowing at sight. A hex digit is four bits; an octal digit is three." },
    { t: "p", text: "GATE 2017 gives the 16-bit number BCA9 in hexadecimal and asks for octal. Write each hex digit as four bits: B = 1011, C = 1100, A = 1010, 9 = 1001, so the number is 1011 1100 1010 1001. Regroup from the right in threes: 1 011 110 010 101 001. Each group is an octal digit: 1, 3, 6, 2, 5, 1. The answer is 136251. The same trick turns hex into binary into octal without ever passing through decimal." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    unsigned x = 0xBCA9;
    printf("%o\\n", x);                  /* the same bits written in octal */
    return 0;
}`, out: "136251", file: "hex_to_octal.c" },
    { t: "ex", id: "l1-e2" },
    { t: "p", text: "A mixed-radix question such as GATE 2021's 'base 3 representation 210; what is it in hexadecimal' is two steps: 210 in base 3 is 2·9 + 1·3 + 0 = 21 in decimal, and 21 is 1·16 + 5 = 0x15. And 'which of these is equal to 224 in radix 5?' (GATE 2024) is the same: 224₅ = 2·25 + 2·5 + 4 = 64; then 64 in decimal is 64, 100 in octal is 64, 50 in hex is 80, and 121 in radix 7 is 49 + 14 + 1 = 64. The equal ones are the three that give 64." },

    { t: "h2", text: "Unsigned numbers and fixed point" },
    { t: "p", text: "An n-bit **unsigned** integer takes the values 0 to 2ⁿ − 1: 8 bits hold 0 to 255, 16 bits hold 0 to 65535. Adding one to the largest value wraps round to zero; this is unsigned overflow, signalled by a carry out of the top bit." },
    { t: "p", text: "A **fixed-point** number places the binary point at a fixed position. If an n-bit unsigned number has f bits after the point and i = n − f before it, the value is the integer pattern divided by 2ᶠ. The smallest step is 2⁻ᶠ, the largest value is 2ⁱ − 2⁻ᶠ, and the range is 0 to (2ⁱ − 2⁻ᶠ), which is the answer D of GATE 2017." },
    { t: "p", text: "Which decimals can be written exactly? Only those that are a whole multiple of the step 2⁻ᶠ. GATE 2018 uses the 8-bit format b₇b₆b₅b₄b₃.b₂b₁b₀, five bits before the point and three after, so the step is 1/8 = 0.125. The numbers 31.500 = 252 × 0.125 and 0.875 = 7 × 0.125 are multiples of 0.125, so they are exact (31.5 is 11111.100 and 0.875 is 00000.111). 12.100 is not a multiple (12.1 = 96.8 steps) and neither is 3.001, so those two cannot be represented exactly." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    double v[4] = {31.5, 0.875, 12.1, 3.001};
    for (int i = 0; i < 4; i++) {
        double steps = v[i] * 8;                         /* the step is 1/8 */
        printf("%d ", steps == (int)steps ? 1 : 0);      /* 1 = a whole number of steps */
    }
    printf("\\n");
    return 0;
}`, out: "1 1 0 0", file: "fixed_point_exact.c" },
    { t: "ex", id: "l1-e3" },
    { t: "callout", kind: "key", text: "n-bit unsigned: 0 to 2ⁿ − 1. Fixed point with f fraction bits: step 2⁻ᶠ, range 0 to 2ⁱ − 2⁻ᶠ where i = n − f. A decimal is exact only if it is a whole multiple of the step." },

    { t: "h2", text: "Signed integers: three representations" },
    { t: "p", text: "To store negative numbers, one pattern of the bits must be given a meaning for the sign. Three schemes have been used, and the paper asks about all three." },
    { t: "p", text: "**Sign-magnitude:** the leftmost bit is the sign (0 positive, 1 negative) and the other n − 1 bits are the magnitude. In 8 bits, 10110100 is negative with magnitude 0110100 = 52, so it is −52. The range is −(2ⁿ⁻¹ − 1) to +(2ⁿ⁻¹ − 1), which is −127 to +127 in 8 bits. There are two zeros, 00000000 and 10000000." },
    { t: "p", text: "**1's complement:** a negative number is the bitwise inversion of the positive one. The range is the same as sign-magnitude, and there are again two zeros (all 0s and all 1s)." },
    { t: "p", text: "**2's complement:** a negative number is the inversion plus one. The leftmost bit again tells the sign, but the whole pattern has a clean weight: the leftmost bit has weight −2ⁿ⁻¹. The range is −2ⁿ⁻¹ to +(2ⁿ⁻¹ − 1), which is −128 to +127 in 8 bits and −8 to +7 in 4 bits. There is **one** zero, and the range has one more negative number than positive. Every modern computer uses 2's complement, because the same adder works for signed and unsigned numbers." },
    { t: "fig", id: "l1-f1" },
    { t: "p", text: "To write −6 in 4 bits of 2's complement: +6 is 0110; invert to 1001; add 1 to get 1010. To check, use the weights −8, 4, 2, 1: −8 + 0 + 2 + 0 = −6. Now widen it. **To widen a 2's complement number, copy the sign bit into the new leftmost bits (sign extension).** So −6 is 1111 1010 in 8 bits and 1111 1111 1111 1010 in 16 bits. The patterns 1000 1010 and 1000 0000 0000 1010 are what you get by padding a sign-magnitude number, and they mean something else (−10 in 8 bits sign-magnitude). That is GATE 2025: the correct ones are the sign-extended patterns." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    signed char a = -6;
    short b = -6;
    printf("%02X %04X\\n", (unsigned char)a, (unsigned short)b);   /* the same value in 8 and 16 bits */
    return 0;
}`, out: "FA FFFA", file: "sign_extension.c" },
    { t: "ex", id: "l1-e4" },
    { t: "p", text: "The same method gives −28 in 16 bits (GATE 2019): +28 = 0000 0000 0001 1100; invert: 1111 1111 1110 0011; add one: 1111 1111 1110 0100. The other options are traps: 1111 1111 0001 1100 is inverted wrongly (it lacks the +1 and has the wrong bits), 0000 0000 1110 0100 is positive, and 1000 0000 1110 0100 is a sign-magnitude style pattern." },
    { t: "table", head: ["Scheme", "Negative of x", "Range for n bits", "Zeros"], rows: [
      ["Sign-magnitude", "flip the sign bit", "−(2ⁿ⁻¹ − 1) to 2ⁿ⁻¹ − 1", "two"],
      ["1's complement", "flip every bit", "−(2ⁿ⁻¹ − 1) to 2ⁿ⁻¹ − 1", "two"],
      ["2's complement", "flip every bit, add 1", "−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1", "one"],
    ], caption: "The three signed representations compared." },
    { t: "fig", id: "l1-f2" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Addition, subtraction and overflow" },
    { t: "p", text: "In 2's complement, **addition is plain binary addition**, ignoring the carry out of the top bit. **Subtraction** x − y is done as x + (−y), where −y is the 2's complement of y, so one adder handles both. The result is correct if it fits in the range. If it does not fit, the result is wrong and an **overflow** has happened; a hardware flag signals it." },
    { t: "p", text: "The easiest test by hand is to **convert to decimal, compute, and compare with the range**. For 4-bit numbers (range −8 to +7): N1 = 1011 = −5, N2 = 1101 = −3, N3 = 1010 = −6, N4 = 1001 = −7. Then N1 + N2 = −8 fits; N2 + N3 = −9 is below −8, so it overflows; N3 − N4 = −6 + 7 = 1 fits; N1 + N4 = −12 overflows. The overflowing operations are N2 + N3 and N1 + N4." },
    { t: "p", text: "The rule hardware uses is a statement about signs: **overflow occurs exactly when two numbers of the same sign are added and the result has the opposite sign.** (Numbers of opposite signs can never overflow when added.) With the sign bits A₇, B₇ of the operands and S₇ of the sum, the overflow condition is A₇B₇S̄₇ + Ā₇B̄₇S₇, which is GATE 2017's option C. Equivalent: the carry into the sign bit differs from the carry out of it. The carry out of the top bit alone (option A) is the **unsigned** overflow signal, not the signed one." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n1 = -5, n2 = -3, n3 = -6, n4 = -7;          /* 1011, 1101, 1010, 1001 as 4-bit 2's complement */
    int r[4] = {n1 + n2, n2 + n3, n3 - n4, n1 + n4};
    for (int i = 0; i < 4; i++) if (r[i] < -8 || r[i] > 7) printf("%c ", 'A' + i);   /* outside -8..7 */
    printf("\\n");
    return 0;
}`, out: "B D", file: "overflow_4bit.c" },
    { t: "ex", id: "l1-e5" },
    { t: "ex", id: "l1-e6" },
    { t: "p", text: "In **sign-magnitude** the arithmetic is different: the numbers are decoded to sign and magnitude, the operation is done on the values, and the result overflows if it is outside −(2ⁿ⁻¹ − 1) to +(2ⁿ⁻¹ − 1). With X = 10110100 = −52 and Y = 01001100 = +76 in 8 bits (range −127 to 127), X + Y = 24 fits and −X − Y = −24 fits, but X − Y = −128 and −X + Y = +128 both fall outside, so they overflow (GATE 2026). For the **width** of a difference Z = X − Y of two n-bit sign-magnitude numbers (GATE 2019), the magnitude can reach 2(2ⁿ⁻¹ − 1) = 2ⁿ − 2, which needs n magnitude bits, so Z needs n + 1 bits in all." },
    { t: "code", text: `#include <stdio.h>

int sm(int bits) {                                  /* decode an 8-bit sign-magnitude pattern */
    int mag = bits & 0x7F;
    return (bits & 0x80) ? -mag : mag;
}

int main(void) {
    int x = sm(0xB4), y = sm(0x4C);                 /* 10110100 and 01001100 */
    int z[4] = {x + y, x - y, -x + y, -x - y};
    printf("%d %d | ", x, y);
    for (int i = 0; i < 4; i++) if (z[i] < -127 || z[i] > 127) printf("%c ", 'A' + i);
    printf("\\n");
    return 0;
}`, out: "-52 76 | B C", file: "sign_magnitude_overflow.c" },
    { t: "ex", id: "l1-e7" },
    { t: "callout", kind: "key", text: "2's complement overflow ⇔ same-sign operands, opposite-sign result (carry into the sign bit ≠ carry out). The carry out alone is the unsigned overflow. A 4-bit 2's complement range is −8 to +7; 5 bits, −16 to +15." },

    { t: "h2", text: "Codes: BCD, Gray and parity" },
    { t: "p", text: "Besides numbers, bit patterns also carry **codes**. **BCD** (binary-coded decimal) writes each decimal digit in its own 4 bits: 59 is 0101 1001. It wastes six of the sixteen patterns per digit, but converting to and from decimal is trivial, so it is used in displays and in money arithmetic. A **Gray code** is a sequence in which consecutive values differ in exactly **one** bit: 00, 01, 11, 10. It is used in encoders (a shaft position read between two positions is wrong by at most one step) and in the rows and columns of a Karnaugh map. The Gray code of a binary number is g = b XOR (b shifted right by one)." },
    { t: "p", text: "A **parity bit** is one extra bit that makes the total number of 1s even (even parity) or odd (odd parity). It detects any single-bit error, because a flipped bit changes the parity, but it cannot correct it or detect two flipped bits. Codes with more check bits (Hamming codes) can also locate and correct a single error. These appear in the Computer Organisation and Networks books." },
    { t: "p", text: "Another encoding worth knowing is the **excess (biased) representation**, used for the exponent of floating-point numbers: the stored value is the true value plus a fixed bias, so that the range of negative to positive exponents becomes a range of non-negative integers that compares correctly as an unsigned number. Chapter L6 uses it." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Value of digits d in radix r: Σ d·rᵏ; fractions use negative powers; n bits hold 0 to 2ⁿ − 1.", "Decimal to radix r: divide and collect remainders (last remainder is the first digit). Hex = 4 bits per digit, octal = 3 bits per digit.", "Fixed point: step 2⁻ᶠ, range 0 to 2ⁱ − 2⁻ᶠ; a decimal is exact only if it is a multiple of the step.", "Sign-magnitude and 1's complement: ±(2ⁿ⁻¹ − 1), two zeros. 2's complement: −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1, one zero, −x = invert + 1, widen by sign extension.", "2's complement overflow: same-sign operands with opposite-sign result; carry out of the top bit alone is unsigned overflow.", "Sign-magnitude overflow: decode, compute, compare with ±(2ⁿ⁻¹ − 1); a difference of two n-bit values needs n + 1 bits.", "BCD, Gray code (one bit changes), parity (detects one error), excess code for exponents."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "l1-f1", caption: "All 4-bit patterns as 2's complement numbers. The leftmost bit has weight −8; the range is −8 to +7, and there is one zero. −6 is 1010.", alt: "A table of 4-bit patterns with their unsigned and 2's complement values for the patterns 0000, 0111, 1000, 1010 and 1111.", fig: { kind: "bits", title: "Weights −8 4 2 1", weights: false, group: 4, rows: [
      { label: "+7", bits: "0111", value: "unsigned 7" }, { label: "+1", bits: "0001", value: "unsigned 1" }, { label: "0", bits: "0000", value: "only one zero" },
      { label: "−1", bits: "1111", value: "unsigned 15" }, { label: "−6", bits: "1010", value: "unsigned 10", hl: [0, 2], tone: "ok" }, { label: "−8", bits: "1000", value: "most negative", tone: "hl" },
    ] } },
    { type: "figure", id: "l1-f2", caption: "Four ways to read the same eight bits 1011 0100. As unsigned it is 180; as sign-magnitude it is −52; as 2's complement it is −76; as 1's complement it is −75.", alt: "A table of the same bit pattern read as unsigned, sign-magnitude, 1's complement and 2's complement.", fig: { kind: "trace", title: "10110100 read four ways", cols: ["scheme", "how", "value"], rows: [
      { cells: ["unsigned", "128 + 32 + 16 + 4", 180] }, { cells: ["sign-magnitude", "sign 1, magnitude 0110100 = 52", -52] },
      { cells: ["1's complement", "invert to 01001011 = 75", -75] }, { cells: ["2's complement", "invert and add 1: 01001100 = 76", -76], tone: "ok" },
    ] } },

    { type: "example", id: "l1-e1", level: "gate", title: "GATE CS 2021 (afternoon), Q36 · 1 mark · NAT: a binary fraction", file: "gate2021_an_q36.txt", given: `x and y are decimal digits and (0.1101)₂ = (0.8xy5)₁₀. The decimal value of x + y?`, find: "x + y.", steps: [
      { say: "Weights after the point: ½, ¼, ⅛, 1/16. The bits 1101 select ½, ¼ and 1/16.", result: "0.5 + 0.25 + 0.0625" },
      { say: "Sum: 0.8125. Compare with 0.8xy5: x = 1, y = 2.", result: "x = 1, y = 2" },
    ], answer: "3", check: "A binary fraction of 4 bits always ends in 5 in decimal, because 1/16 = 0.0625." },
    { type: "example", id: "l1-e2", level: "gate", title: "GATE CS 2017 (afternoon), Q23 · 1 mark · the octal form of BCA9", file: "gate2017_an_q23.txt", given: `The 16-bit unsigned integer X is BCA9 in hexadecimal. Its octal representation?
A) 571244   B) 736251   C) 571247   D) 136251`, find: "The octal form.", steps: [
      { say: "Hex to bits: B = 1011, C = 1100, A = 1010, 9 = 1001.", result: "1011 1100 1010 1001" },
      { say: "Regroup from the right in threes: 1 | 011 | 110 | 010 | 101 | 001.", result: "1 3 6 2 5 1" },
    ], answer: "D", check: "The program in this chapter prints 136251." },
    { type: "example", id: "l1-e3", level: "gate", title: "GATE CS 2018 (forenoon), Q43 · 2 marks · which decimals are exact in b₇b₆b₅b₄b₃.b₂b₁b₀", file: "gate2018_fn_q43.txt", given: `Unsigned 8-bit fixed point with the binary point between b3 and b2. Which of (i) 31.500, (ii) 0.875, (iii) 12.100, (iv) 3.001 cannot be represented exactly?
A) none   B) only (ii)   C) only (iii) and (iv)   D) only (i) and (ii)`, find: "The inexact numbers.", steps: [
      { say: "Three fraction bits: the step is 1/8 = 0.125. A number is exact if it is a multiple of 0.125 within the range 0 to 31.875.", result: "multiple of 0.125" },
      { say: "31.500 = 252 steps (exact); 0.875 = 7 steps (exact). 12.100 = 96.8 steps, 3.001 = 24.008 steps: not whole.", result: "(iii) and (iv) inexact" },
    ], answer: "C", check: "The program in this chapter prints 1 1 0 0." },
    { type: "example", id: "l1-e4", level: "gate", title: "GATE CS 2025 (forenoon), Q25 · 1 mark · MSQ: −6 in wider 2's complement", file: "gate2025_fn_q25.txt", given: `−6 is 1010 in 4-bit 2's complement. Which are correct 2's complement representations of −6?
A) 1000 1010 in 8 bits   B) 1111 1010 in 8 bits   C) 1000 0000 0000 1010 in 16 bits   D) 1111 1111 1111 1010 in 16 bits`, find: "The correct representations.", steps: [
      { say: "To widen a 2's complement number copy the sign bit leftwards. The sign bit of 1010 is 1.", result: "pad with 1s" },
      { say: "8 bits: 1111 1010. 16 bits: 1111 1111 1111 1010. The patterns with a leading 1 and then zeros pad the sign-magnitude form, not 2's complement.", result: "B and D" },
    ], answer: "B, D", check: "The program in this chapter prints FA FFFA." },
    { type: "example", id: "l1-e5", level: "gate", title: "GATE CS 2026 (afternoon), Q28 · 1 mark · MSQ: overflow in 4-bit 2's complement", file: "gate2026_an_q28.txt", given: `4-bit 2's complement numbers N1 = 1011, N2 = 1101, N3 = 1010, N4 = 1001. Which operations overflow?
A) N1 + N2   B) N2 + N3   C) N3 − N4   D) N1 + N4`, find: "The overflowing operations.", steps: [
      { say: "Values: N1 = −5, N2 = −3, N3 = −6, N4 = −7. The range is −8 to +7.", result: "−5 −3 −6 −7" },
      { say: "N1 + N2 = −8 fits. N2 + N3 = −9: overflow. N3 − N4 = −6 + 7 = 1 fits. N1 + N4 = −12: overflow.", result: "B and D" },
    ], answer: "B, D", check: "The program in this chapter prints B D." },
    { type: "example", id: "l1-e6", level: "gate", title: "GATE CS 2024 (forenoon), Q18 · 1 mark · overflow or underflow in 5 bits", file: "gate2024_fn_q18.txt", given: `5-bit 2's complement integers A = 01010 and B = 11010. Which operation results in an overflow or underflow?
A) A + B   B) A − B   C) B − A   D) 2 * B`, find: "The operation that overflows.", steps: [
      { say: "A = 10, B = −6. The range of 5 bits is −16 to +15.", result: "10, −6" },
      { say: "A + B = 4 fits; A − B = 16 exceeds 15; B − A = −16 fits; 2B = −12 fits.", result: "only A − B" },
    ], answer: "B", check: "10 − (−6) = 16 is one above the largest value 15." },
    { type: "example", id: "l1-e7", level: "gate", title: "GATE CS 2026 (forenoon), Q22 · 1 mark · MSQ: overflow in 8-bit sign-magnitude", file: "gate2026_fn_q22.txt", given: `8-bit sign-magnitude X = 10110100, Y = 01001100. Which operations overflow?
A) Z = X + Y   B) Z = X − Y   C) Z = −X + Y   D) Z = −X − Y`, find: "The overflowing operations.", steps: [
      { say: "X = −52, Y = +76. Sign-magnitude range: −127 to +127.", result: "−52, 76" },
      { say: "X + Y = 24 fits. X − Y = −128: overflow. −X + Y = 128: overflow. −X − Y = −24 fits.", result: "B and C" },
    ], answer: "B, C", check: "The program in this chapter prints -52 76 | B C." },

    { type: "trap", wrong: "A carry out of the top bit means a signed overflow.", tempting: "Carry out is the overflow flag of an adder.", whyWrong: "The carry out of the top bit is the UNSIGNED overflow. For 2's complement the signed overflow is: two operands of the same sign give a result of the opposite sign. In 1111 + 0001 (that is −1 + 1) there is a carry out but the result 0000 is correct.", rule: "Signed overflow: same-sign operands, opposite-sign result.", ex: { text: "4 bits: 1111 + 0001 = 1 0000: carry out 1, result 0, correct. 0111 + 0001 = 1000: no carry out, but +7 + 1 = −8 is wrong." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q22 · 2026 AN Q28, Q34 (in the floating-point chapter) · 2025 FN Q25 · 2024 FN Q18 · 2024 AN Q60 · 2023 FN Q32 · 2022 FN Q18 · 2021 FN Q44 · 2021 AN Q36 · 2019 FN Q17, Q33 · 2018 FN Q43 · 2017 FN Q11, Q24 · 2017 AN Q23, Q25. Radix questions not given a separate example (2024 AN Q60, 2023 FN Q32, 2021 FN Q44, 2019 FN Q17, 2019 FN Q33, 2017 FN Q11, 2017 FN Q24, 2017 AN Q25, 2022 FN Q18) are solved in the text above." },
    { type: "recall", cards: [
      { q: "Value of digits in radix r?", a: "Σ d·rᵏ; fractions use r⁻¹, r⁻², …" },
      { q: "Decimal to radix r?", a: "Divide repeatedly by r and collect remainders (last remainder = first digit)." },
      { q: "Hex and octal from binary?", a: "Group bits in fours (hex) or threes (octal) from the point." },
      { q: "Range of n-bit unsigned?", a: "0 to 2ⁿ − 1." },
      { q: "Range of n-bit 2's complement?", a: "−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1." },
      { q: "Range of n-bit sign-magnitude?", a: "−(2ⁿ⁻¹ − 1) to 2ⁿ⁻¹ − 1." },
      { q: "Negative of x in 2's complement?", a: "Invert all bits and add 1." },
      { q: "Widening a 2's complement number?", a: "Sign-extend: copy the sign bit." },
      { q: "Signed overflow condition?", a: "Same-sign operands, opposite-sign result." },
      { q: "Bits to store a difference of two n-bit sign-magnitude numbers?", a: "n + 1." },
      { q: "Fixed point with f fraction bits: step and range?", a: "Step 2⁻ᶠ; range 0 to 2ⁱ − 2⁻ᶠ." },
      { q: "Gray code property?", a: "Neighbours differ in exactly one bit." },
    ] },
    { type: "check", questions: [
      { id: "l1c1", kind: "NAT", marks: 1, q: "The decimal value of the base-8 number 725 is", answer: "469", solution: "7·64 + 2·8 + 5 = 448 + 16 + 5 = 469." },
      { id: "l1c2", kind: "NAT", marks: 1, q: "How many bits does the hexadecimal number 3FF take when written in binary, without leading zeros?", answer: "10", solution: "3FF = 11 1111 1111: ten bits." },
      { id: "l1c3", kind: "MCQ", marks: 1, q: "The 8-bit 2's complement representation of −1 is", options: ["10000001", "11111110", "11111111", "10000000"], answer: "C", solution: "Invert 00000001 to 11111110 and add 1." },
      { id: "l1c4", kind: "MSQ", marks: 2, q: "Which 4-bit 2's complement additions overflow?", options: ["0111 + 0001", "1000 + 1111", "0011 + 0011", "1100 + 0011"], answer: "A, B", solution: "7 + 1 = 8 and −8 + (−1) = −9 are out of range; 3 + 3 = 6 and −4 + 3 = −1 fit." },
      { id: "l1c5", kind: "NAT", marks: 2, q: "The largest value of an unsigned 12-bit fixed-point number with 4 fraction bits is (give the decimal value to 4 decimal places)", answer: "255.9375", solution: "i = 8, f = 4: 2⁸ − 2⁻⁴ = 256 − 0.0625 = 255.9375." },
      { id: "l1c6", kind: "MCQ", marks: 2, q: "In the 4-bit reflected Gray code sequence 0000, 0001, 0011, 0010, 0110, ... the code that follows 0110 is", options: ["0111", "0101", "1110", "0100"], answer: "A", solution: "The sequence continues 0110, 0111, 0101, 0100: one bit changes each step." },
      { id: "l1c7", kind: "NAT", marks: 2, q: "A number is 45 in base 6. Written in base 9, it is ...", answer: "29", solution: "45₆ = 4·6 + 5 = 29 decimal; 29 = 3·9 + 2, so 32 in base 9." },
      { id: "l1c8", kind: "NAT", marks: 2, q: "A 7-bit sign-magnitude number system is used. What is the largest positive number it can hold?", answer: "63", solution: "2⁶ − 1 = 63." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on number representation", sub: "Digital Logic", href: "/topics/digital-logic" }, { label: "Computer arithmetic", sub: "fixed and floating point, the last chapter", href: "/study/computer-arithmetic" }] },
    { type: "links", prereq: ["How a computer runs a program (C0)", "Binary and hexadecimal (C0)"], usedIn: ["Every later Digital Logic chapter", "Computer Organisation: data representation"], cross: ["Programming in C: data types and overflow"] },
  ],
};
