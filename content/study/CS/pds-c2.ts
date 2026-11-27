import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 2 "Variables and data types" (27 Nov 2026). Real GATE question: 2017_FN_Q58 (the strlen difference, an unsigned trap), explained in full.
 * Every program was compiled and run with gcc (scripts/chapter-check.ts); sizes are the usual ones (int 4 bytes); long is 4 or 8 depending on the machine.
 */
export const chapterC2: Topic = {
  id: "cs.pds.c.types2",
  title: "Variables and data types",
  no: "2",
  book: [
    { t: "p", text: "A program works by keeping values in memory and changing them. In C every value has a **type**, and the type decides two things at once: how much memory the value takes, and how the 0s and 1s inside it are read. Most surprises in C output questions, such as a negative number that turns huge or a division that loses its fraction, come from a type doing exactly what it was told. This chapter makes those rules plain." },
    { t: "p", text: "We start with the variable as a labelled box, then the whole numbers (including how a computer stores negative ones), then characters, then what happens when types are mixed, and finally decimal numbers. The chapter ends with a real GATE question that is a trap built from one rule of this chapter." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["declare, initialise and assign variables, and say what `sizeof` returns;", "give the range of any integer type and build a negative number in two's complement;", "say what happens when a value is too big for its type (unsigned wraps, signed is undefined);", "predict the result of an expression that mixes signed and unsigned numbers, or integers and decimals;", "explain endianness, the four zeros (`0`, `'0'`, `'\\0'`, `\"0\"`) and why `0.1 + 0.2` is not 0.3."] },

    { t: "h2", text: "A variable is a labelled box" },
    { t: "h3", text: "Declaration, initialisation, assignment" },
    { t: "p", text: "A **declaration** tells the compiler to reserve a box of some type and gives it a name: `int count;`. An **initialisation** puts a first value in at the same moment: `int total = 0;`. An **assignment** later replaces what is in the box: `count = 5;`. The sign `=` in C is not a question or an equation; it means _store the value on the right in the box on the left_." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int count;            /* declaration: a box, nothing sensible inside yet */
    int total = 0;        /* declaration with a first value */
    count = 5;            /* assignment: put 5 in the box */
    total = total + count;
    printf("%d %d\\n", count, total);
    return 0;
}`, out: "5 5", file: "variables_demo.c" },
    { t: "callout", kind: "key", text: "A variable declared without a value holds rubbish (whatever the memory had before). Always give a variable a value before you read it." },
    { t: "h3", text: "Naming rules" },
    { t: "p", text: "A name is made of letters, digits and the underscore, must not start with a digit, and must not be a keyword such as `int` or `return`. Names are **case sensitive**: `Total` and `total` are two different boxes." },
    { t: "h3", text: "sizeof, and what it does not do" },
    { t: "p", text: "The operator `sizeof` gives the size in bytes of a type or of an expression's type. There is one trap that GATE likes: `sizeof` looks only at the **type** of its operand and never runs it. So `sizeof(i++)` does not increase `i`." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int i = 5;
    int s = sizeof(i++);   /* i++ is not executed */
    printf("%d %d\\n", s, i);
    return 0;
}`, out: "4 5", file: "sizeof_trap.c" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Integers" },
    { t: "h3", text: "The integer types and their ranges" },
    { t: "p", text: "C has several whole-number types that differ in size. Each can be **signed** (it can hold negative numbers) or **unsigned** (zero and up). With n bits there are 2ⁿ patterns. An unsigned type uses them all for 0 to 2ⁿ − 1. A signed type uses half of them for negatives, giving −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1." },
    { t: "table", head: ["Type", "Bytes", "Signed range", "Unsigned range"], rows: [["`char`", "1", "−128 to 127", "0 to 255"], ["`short`", "2", "−32 768 to 32 767", "0 to 65 535"], ["`int`", "4", "−2 147 483 648 to 2 147 483 647", "0 to 4 294 967 295"], ["`long long`", "8", "about ±9.2 × 10¹⁸", "0 to about 1.8 × 10¹⁹"]], caption: "`long` is 4 bytes on Windows and 8 on Linux, so a question that uses it states the size." },
    { t: "code", text: `#include <stdio.h>
#include <limits.h>

int main(void) {
    printf("%d %d %u\\n", INT_MIN, INT_MAX, UINT_MAX);
    return 0;
}`, out: "-2147483648 2147483647 4294967295", file: "limits_demo.c" },
    { t: "callout", kind: "tip", text: "To get a range fast, remember 2⁸ = 256, 2¹⁶ = 65 536 and 2³² ≈ 4.29 billion. Unsigned: 0 to that minus 1. Signed: minus half of it to half of it minus 1." },
    { t: "h3", text: "How a computer stores a negative number" },
    { t: "p", text: "The machine has only bits, so a negative number has to be a pattern of bits. The idea that every computer uses is **two's complement**. It is easiest to understand by seeing why the two simpler ideas fail." },
    { t: "ul", items: ["**Sign and magnitude:** use the first bit as a sign (1 means minus) and the rest as the size. It is easy to read, but it has two zeros (+0 and −0) and addition needs special rules.", "**One's complement:** flip every bit to negate. Addition mostly works, but there are still two zeros.", "**Two's complement:** flip every bit and add 1. There is one zero, and the same adder circuit works for positive and negative numbers."] },
    { t: "fig", id: "c2-f1" },
    { t: "p", text: "Figure 2.1 builds −5 in eight bits. Start with 5, which is 00000101. Flip every bit to get 11111010. Add 1 to get 11111011. That pattern is −5. The check is that 5 + (−5) must be 0: 00000101 + 11111011 = 100000000, and the carry out of the eighth bit is thrown away, leaving 00000000." },
    { t: "ex", id: "c2-e1" },
    { t: "callout", kind: "shortcut", text: "To read a two's complement number whose first bit is 1, flip all the bits, add 1, and put a minus sign in front. The first bit being 1 means negative." },
    { t: "h3", text: "Too big for the box: overflow" },
    { t: "p", text: "What happens when a value does not fit depends on whether the type is signed. An **unsigned** type wraps around, like a clock: after its largest value comes 0. This is well defined and is the same as taking the remainder modulo 2ⁿ. For a **signed** type, going past the range is **undefined behaviour**: the C standard promises nothing, so a question that needs a signed overflow to give one answer is a bad question, and you should never give one answer to it." },
    { t: "fig", id: "c2-f2" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    unsigned char c = 250;
    c = c + 10;
    printf("%d\\n", c);
    unsigned int big = 4294967295u;
    big = big + 1;
    printf("%u\\n", big);
    return 0;
}`, out: "4\n0", file: "unsigned_wrap.c" },
    { t: "callout", kind: "tip", text: "Unsigned never goes below 0: a subtraction that would be negative wraps to a huge number. That is also why `for (unsigned i = 10; i >= 0; i--)` never ends." },
    { t: "p", text: "Storing a constant that is too big into a smaller type does the same modulo trick: `signed char c = 200;` stores 200 − 256 = −56 on the usual machines, and `unsigned char u = -1;` stores 255, because −1 is all ones." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    signed char c = 200;
    unsigned char u = -1;
    printf("%d %d\\n", c, u);
    return 0;
}`, out: "-56 255", file: "out_of_range.c" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Bytes in memory: endianness" },
    { t: "p", text: "A four-byte integer occupies four neighbouring addresses (chapter 0). The question is which byte goes first. **Little-endian** machines (such as the ones in your laptop) store the least significant byte at the lowest address. **Big-endian** machines store the most significant byte first. The number is the same; only the order of its bytes in memory differs." },
    { t: "fig", id: "c2-f3" },
    { t: "p", text: "Figure 2.3 shows `unsigned int x = 0x12345678;` stored at address 1000. On a little-endian machine the byte at 1000 is 78, the lowest-order byte. You can look at the bytes through a pointer to `unsigned char`; pointers are explained in chapter 10, so treat the program as a preview." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    unsigned int x = 0x12345678;
    unsigned char *p = (unsigned char *)&x;   /* look at x one byte at a time */
    printf("%02x %02x %02x %02x\\n", p[0], p[1], p[2], p[3]);
    return 0;
}`, out: "78 56 34 12", file: "endian_demo.c" },
    { t: "callout", kind: "note", text: "The output above is for a little-endian machine. On a big-endian machine the same program prints 12 34 56 78. Questions on endianness always say which one they mean." },

    { t: "h2", text: "Characters" },
    { t: "h3", text: "A char is a small integer" },
    { t: "p", text: "A `char` is a one-byte integer. The letter A is stored as its **ASCII** code, 65; `'a'` is 97 and `'0'` is 48. The quotes make the compiler look up the code. Because it is a number, you can do arithmetic on it: `'a' - 'A'` is 32, and `'A' + 1` is 66, which prints as `B`." },
    { t: "p", text: "In C a character constant like `'A'` has the type `int`, not `char`, so `sizeof('A')` is 4, while `sizeof(char)` is 1. (This is one place where C differs from C++.)" },
    { t: "h3", text: "The four zeros" },
    { t: "p", text: "Four different things look like zero, and mixing them up is a common slip." },
    { t: "fig", id: "c2-f4" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    printf("%zu %zu\\n", sizeof('A'), sizeof(char));
    printf("%d %d %d %zu\\n", 0, '0', '\\0', sizeof("0"));
    return 0;
}`, out: "4 1\n0 48 0 2", file: "char_demo.c" },
    { t: "p", text: "`0` is the number zero. `'0'` is the character for the digit, code 48. `'\\0'` is the null character, code 0, which ends every string. `\"0\"` is a string of two bytes: the character `'0'` and then the null character." },
    { t: "trap", i: 2 },
    { t: "callout", kind: "tip", text: "For letters: `'a'` is 97, `'A'` is 65, `'0'` is 48. A lower-case letter minus 32 is its upper-case. `'7' - '0'` is the number 7." },

    { t: "h2", text: "Mixing types: conversions" },
    { t: "h3", text: "The two rules" },
    { t: "p", text: "C quietly converts values before it does arithmetic. Two rules cover nearly everything. First, **integer promotion**: any `char` or `short` in an expression is first widened to `int`. Second, the **usual arithmetic conversions**: when two operands still differ, the smaller or less capable type is converted to the other. The order, from weakest to strongest, is `int`, `unsigned int`, `long`, `unsigned long`, `float`, `double`." },
    { t: "table", head: ["Mixed in one expression", "Both become", "Example", "Result"], rows: [["`int` and `float` or `double`", "the decimal type", "`3 / 2.0`", "1.5"], ["`int` and `unsigned int`", "`unsigned int`", "`-1 < 1u`", "0 (false)"], ["two `int`", "`int`, so the fraction is dropped", "`3 / 2`", "1"], ["`char` and `char`", "both promoted to `int` first", "`'a' - 'A'`", "32"]] },
    { t: "h3", text: "Signed against unsigned" },
    { t: "p", text: "This is the rule that costs the most marks. When a signed `int` is compared with, or used in arithmetic with, an `unsigned int`, the signed one is converted to unsigned. A negative number becomes a huge positive one. So `-1 < 1u` is **false**, because −1 becomes 4 294 967 295." },
    { t: "ex", id: "c2-e2" },
    { t: "h3", text: "Division and remainder" },
    { t: "p", text: "Dividing two integers gives an integer: the fraction is thrown away towards zero. To get a decimal answer at least one operand must be a decimal, or you must **cast** one with a type in brackets. The cast applies to the value next to it, so `(float)7 / 2` is 3.5 but `(float)(7 / 2)` is 3.0. The remainder `%` takes the sign of the left operand in C99 and later: `-7 % 2` is −1 and `7 % -2` is 1." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    printf("%d %.1f %.1f %d\\n", 3 / 2, 3 / 2.0, (float)7 / 2, 7 / 2);
    printf("%d %d\\n", -7 % 2, 7 % -2);
    return 0;
}`, out: "1 1.5 3.5 3\n-1 1", file: "division_demo.c" },
    { t: "trap", i: 3 },
    { t: "callout", kind: "tip", text: "Integer division drops the fraction (`7 / 2` is 3, `-7 / 2` is −3). The remainder takes the sign of the left operand (`-7 % 2` is −1). Write the type of every sub-expression before you evaluate." },
    { t: "h3", text: "Sign extension" },
    { t: "p", text: "When a small signed value is widened to a bigger type, its sign bit is copied into the new high bits, so the number keeps its value. A `char` holding −1 is 11111111; widened to a 32-bit `int` it becomes 32 ones, still −1. Printed as hex or unsigned, those 32 ones show up as `ffffffff` and `4294967295`." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    char c = -1;
    printf("%x %u\\n", c, c);
    return 0;
}`, out: "ffffffff 4294967295", file: "sign_extension.c" },
    { t: "callout", kind: "note", text: "Whether a plain `char` is signed or unsigned depends on the machine. The program above assumes signed, as on the usual laptops." },

    { t: "h2", text: "Decimal numbers and constants" },
    { t: "h3", text: "float and double" },
    { t: "p", text: "A `float` (4 bytes) and a `double` (8 bytes) hold numbers with a fraction. Inside, they are stored in binary with an exponent, so most decimal fractions cannot be stored exactly, just as 1/3 cannot be written exactly in decimal. The result is tiny errors that make equality tests unreliable." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    float f = 0.7;
    printf("%d %d\\n", 0.1 + 0.2 == 0.3, f < 0.7);
    return 0;
}`, out: "0 1", file: "float_trap.c" },
    { t: "p", text: "`0.1 + 0.2 == 0.3` is false, because the sum is a hair above 0.3. And `f < 0.7` is true: `f` holds the nearest `float` to 0.7, which is slightly smaller than the nearest `double`, and the comparison is done in `double`. A `float` is rounder than a `double`." },
    { t: "trap", i: 4 },
    { t: "h3", text: "Constants, const and #define" },
    { t: "p", text: "A number written in a program is a **constant**. By default a whole number is an `int` and a number with a point is a `double`. Suffixes change that: `10u` is unsigned, `10L` is long, `1.5f` is float. A leading `0x` means hexadecimal and a leading `0` means octal, as chapter 0 showed. The word `const` in front of a declaration promises the variable will not change after it is set, and the compiler refuses any assignment to it." },
    { t: "p", text: "A second way to name a constant is the preprocessor line `#define PI 3.14`. It is a find-and-replace done before the compiler runs: every `PI` in the file becomes `3.14`. Chapter 16 covers it fully; for now notice that it is text replacement, not a variable." },
    { t: "trap", i: 5 },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2017 (forenoon), Q58: the subtraction that cannot be negative" },
    { t: "p", text: "A two-mark numerical question. It looks like a question about string lengths and a conditional expression, but the whole question is one rule of this chapter: `strlen` returns an **unsigned** number, so subtracting a bigger length from a smaller one does not give a negative number; it wraps around to a huge positive one." },
    { t: "ex", id: "c2-e3" },
    { t: "fig", id: "c2-f5" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Whether you notice that `strlen(s) - strlen(t)` is the difference of two **unsigned** values, and that `c` is declared `unsigned int` too. With s = \"abc\" and t = \"defgh\" the lengths are 3 and 5. In ordinary arithmetic 3 − 5 = −2, which is not greater than 0, and you would pick `strlen(t)` and answer 5. In unsigned arithmetic 3 − 5 wraps to 4 294 967 294, which **is** greater than 0, so the condition is true and the program prints `strlen(s)`, which is 3. The statement in the question that `strlen` returns `size_t`, an unsigned type, is the hint." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Answering 5.** They do the subtraction in ordinary numbers (−2), find it is not greater than 0, and print `strlen(t)`. This is the intended wrong answer.", "**Not noticing `c` is unsigned.** Even if only one operand were unsigned, the other would be converted to unsigned too.", "**Stopping at the conversion.** The condition being true means the first branch is taken, which is `strlen(s)`, and that is 3, not the huge number."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Why", "Prints"], rows: [["swap the strings: `x = \"defgh\"`, `y = \"abc\"`", "5 − 3 = 2 is greater than 0 in either arithmetic, so `strlen(s)`", "5"], ["cast both lengths: `((int)strlen(s) - (int)strlen(t)) > 0`", "now the difference is the signed −2, which is not greater than 0, so `strlen(t)`", "5"], ["compare directly: `strlen(s) > strlen(t)`", "3 > 5 is false, so `strlen(t)`", "5"], ["equal lengths: `x = \"abc\"`, `y = \"xyz\"`", "3 − 3 = 0 is not greater than 0 even when unsigned, so `strlen(t)`", "3"]], caption: "All four were compiled and run, together with the original, which prints 3." },
    { t: "callout", kind: "shortcut", text: "Whenever a subtraction with a `strlen`, `sizeof` or any unsigned value is compared with 0, stop and ask: can it go negative? If yes, in unsigned arithmetic it cannot, and the comparison is true for every non-zero difference." },


    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A variable is a named box of some type. The type decides its size and how its bits are read.", "An n-bit unsigned type holds 0 to 2ⁿ − 1; a signed type holds −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1, stored in two's complement.", "Unsigned arithmetic wraps modulo 2ⁿ. Signed overflow is undefined behaviour.", "Endianness is the order of a number's bytes in memory: little-endian puts the lowest byte first.", "A `char` is a small integer (ASCII); `'A'` has type `int` in C. `0`, `'0'`, `'\\0'` and `\"0\"` are four different things.", "When types mix, `char` and `short` become `int`, then the weaker type converts to the stronger. A signed number meeting an unsigned one becomes unsigned.", "Integer division drops the fraction; a cast applies to the value next to it.", "`float` and `double` are inexact, so never test them for equality."] },
  ],
  blocks: [
    { type: "figure", id: "c2-f1", caption: "Flip every bit of 5 and add 1: the result 11111011 is −5.", alt: "Three frames showing 5 as 00000101, its flipped form 11111010 and the sum 11111011 which is minus five.", fig: { kind: "frames", title: "building -5 in eight bits", frames: [
      { caption: "Start with 5 in eight bits: 00000101.", fig: { kind: "bits", group: 4, rows: [{ label: "5", bits: "00000101", value: 5 }, { label: "flip every bit", bits: "11111010", tone: "dim", value: "?" }, { label: "add 1", bits: "11111011", tone: "dim", value: "?" }] } },
      { caption: "Flip every bit (0 becomes 1, 1 becomes 0): 11111010. This is the one's complement.", fig: { kind: "bits", group: 4, rows: [{ label: "5", bits: "00000101", value: 5 }, { label: "flip every bit", bits: "11111010", tone: "hl", value: 250 }, { label: "add 1", bits: "11111011", tone: "dim", value: "?" }] } },
      { caption: "Add 1: 11111011. This pattern is −5 in two's complement. Check: 5 + (−5) = 100000000, and dropping the carry leaves 0.", fig: { kind: "bits", group: 4, rows: [{ label: "5", bits: "00000101", value: 5 }, { label: "flip every bit", bits: "11111010", value: 250 }, { label: "add 1", bits: "11111011", tone: "ok", value: -5 }] } },
    ] } },
    { type: "figure", id: "c2-f2", caption: "An unsigned char counts 250, 251, … 255 and then wraps to 0: 250 + 10 gives 4.", alt: "A table of an unsigned char going from 250 to 255 and then 0 to 4.", fig: { kind: "trace", title: "unsigned char c = 250; then adding 1, ten times", cols: ["After adding", "Value of c"], rows: [{ cells: ["0", 250] }, { cells: ["1", 251] }, { cells: ["5", 255] }, { cells: ["6", 0], tone: "bad", note: "wraps: 256 mod 256" }, { cells: ["10", 4], tone: "ok" }] } },
    { type: "figure", id: "c2-f3", caption: "The four bytes of 0x12345678 at addresses 1000 to 1003. Little-endian keeps the lowest byte (78) first; big-endian keeps the highest (12) first.", alt: "Two frames: bytes 78 56 34 12 for little-endian and 12 34 56 78 for big-endian.", fig: { kind: "frames", title: "unsigned int x = 0x12345678; at 1000", frames: [
      { caption: "Little-endian: the least significant byte, 78, sits at the lowest address.", fig: { kind: "array", data: [["78", "56", "34", "12"]], base: 1000, size: 1, index: true, tones: { "0,0": "hl" } } },
      { caption: "Big-endian: the most significant byte, 12, sits at the lowest address.", fig: { kind: "array", data: [["12", "34", "56", "78"]], base: 1000, size: 1, index: true, tones: { "0,0": "hl" } } },
    ] } },
    { type: "figure", id: "c2-f4", caption: "Four things that look like zero. Only the third is the null character that ends a string.", alt: "A table of 0, '0', '\\0' and \"0\" with their types, values and sizes.", fig: { kind: "matrix", title: "the four zeros", cols: ["What it is", "Value", "Size"], rows: [{ label: "0", cells: ["the number zero (int)", 0, 4] }, { label: "'0'", cells: ["the character for the digit", 48, 4] }, { label: "'\\0'", cells: ["the null character", 0, 4], hl: true }, { label: "\"0\"", cells: ["a string: '0' then the null", "2 bytes", 2] }] } },
    { type: "figure", id: "c2-f5", caption: "The lengths are unsigned, so 3 − 5 wraps to a huge number, which is greater than 0.", alt: "A table showing strlen(s) 3, strlen(t) 5, and the unsigned difference 4294967294.", fig: { kind: "trace", title: "GATE 2017 FN Q58 with s = \"abc\", t = \"defgh\"", cols: ["Step", "Value", "Why"], rows: [{ cells: ["strlen(s)", 3, "unsigned"] }, { cells: ["strlen(t)", 5, "unsigned"] }, { cells: ["strlen(s) - strlen(t)", 4294967294, "unsigned arithmetic: 3 − 5 wraps (2³² − 2)"], tone: "bad" }, { cells: ["… > c  (c = 0)", "true", "4294967294 > 0"], tone: "hl" }, { cells: ["len = strlen(s)", 3, "the first branch is taken"], tone: "ok" }] } },

    { type: "example", id: "c2-e1", level: "easy", title: "Trace by hand: −5 and −128 in eight bits", file: "twos_complement.txt", given: `-5:    5 = 00000101
       flip   11111010
       add 1  11111011

-128:  128 = 10000000  (does not fit as positive)
       flip    01111111
       add 1   10000000`, find: "The eight-bit patterns, and what each reads as.", steps: [
      { say: "For −5, flip 00000101 and add 1.", result: "11111011" },
      { say: "Read it back: the first bit is 1, so negative. Flip 11111011 to 00000100, add 1.", result: "00000101 = 5, so −5" },
      { say: "For −128, the pattern 10000000 is its own complement: flipping gives 01111111 and adding 1 returns 10000000.", result: "10000000" },
      { say: "That is why a signed byte holds −128 but only +127: there is no +128.", result: "range −128 to 127" },
    ], answer: "−5 is 11111011; −128 is 10000000.", check: "As an unsigned byte, 11111011 is 251, and the program in the chapter prints (unsigned char) −5 as 251." },
    { type: "example", id: "c2-e2", level: "edge", title: "Signed against unsigned: −1 < 1u", file: "signed_unsigned.c", given: `#include <stdio.h>

int main(void) {
    printf("%d\\n", -1 < 1u);
    return 0;
}`, find: "What is printed?", steps: [
      { say: "The left operand is an int (−1), the right is an unsigned int (1u). They differ, so the usual arithmetic conversions apply.", result: "int becomes unsigned int" },
      { say: "−1 as 32 bits is all ones, which read as unsigned is 4 294 967 295.", result: "4294967295 < 1" },
      { say: "That is false, so the comparison gives 0.", result: "0" },
    ], answer: "0", check: "The program was compiled and run." },
    { type: "example", id: "c2-e3", level: "gate", title: "GATE CS 2017 (forenoon), Q58 · 2 marks · NAT", file: "gate2017_q58.c", given: `#include <stdio.h>
#include <string.h>

void printlength(char *s, char *t) {
    unsigned int c = 0;
    int len = ((strlen(s) - strlen(t)) > c) ? strlen(s) : strlen(t);
    printf("%d\\n", len);
}

void main() {
    char *x = "abc";
    char *y = "defgh";
    printlength(x, y);
}`, find: "The output. (strlen returns size_t, an unsigned type.)", steps: [
      { say: "strlen(s) is 3 and strlen(t) is 5. Both are unsigned.", result: "3 and 5" },
      { say: "Their difference is unsigned too, so 3 − 5 wraps around to 2³² − 2 = 4 294 967 294.", result: "4294967294" },
      { say: "Compare with c, which is unsigned 0: 4 294 967 294 > 0 is true.", result: "condition true" },
      { say: "So len gets the first branch, strlen(s), and that is printed.", result: "3" },
    ], answer: "3", check: "Official answer 3. The program was compiled and run. (The 32-bit wrap is the question's own picture; with a 64-bit size_t the number is larger, but is still greater than 0.)" },

    { type: "trap", wrong: "sizeof(i++) increases i.", tempting: "i++ is an assignment, and assignments run.", whyWrong: "sizeof only looks at the type of its operand at compile time and never runs it.", rule: "Nothing inside sizeof is executed.", ex: {"code":"int i = 5;\nint s = sizeof(i++);\nprintf(\"%d %d\", s, i);","out":"4 5"} },
    { type: "trap", wrong: "A signed int that overflows wraps around like an unsigned one.", tempting: "They are stored as the same bits, so they should behave the same.", whyWrong: "Unsigned wraparound is defined by the standard; signed overflow is undefined behaviour, and a compiler may assume it never happens.", rule: "Wraparound questions are only valid for unsigned types.", ex: {"text":"unsigned char c = 255; c++ gives 0 every time (defined). But for int i = INT_MAX; i++ the standard promises nothing: a compiler may give −2 147 483 648, or may assume it never happens and delete a test such as `i + 1 > i`."} },
    { type: "trap", wrong: "'0' and 0 and \"0\" are all the same zero.", tempting: "They all look like a zero on the page.", whyWrong: "0 is a number, '0' is the character with code 48, '\\0' is the null character (code 0) and \"0\" is a two-byte string.", rule: "Count the quotes: none is a number, single is one character, double is a string.", ex: {"code":"printf(\"%d %d %d %zu\\n\", 0, '0', '\\0', sizeof(\"0\"));","out":"0 48 0 2"} },
    { type: "trap", wrong: "(float)7 / 2 and (float)(7 / 2) both give 3.5.", tempting: "Both mention float and 7 and 2.", whyWrong: "A cast applies to the value right after it. (float)7 / 2 is 7.0 / 2, which is 3.5. In (float)(7 / 2) the integer division 7 / 2 = 3 happens first, so the result is 3.0.", rule: "Do the integer divisions that are inside the brackets before the cast.", ex: {"code":"printf(\"%.1f %.1f\", (float)7 / 2, (float)(7 / 2));","out":"3.5 3.0"} },
    { type: "trap", wrong: "float f = 0.7; f == 0.7 is true.", tempting: "The same number is written on both sides.", whyWrong: "f holds the nearest float to 0.7; the constant 0.7 is a double. They are different binary numbers, so the comparison is false, and f < 0.7 is true.", rule: "Never compare decimal numbers with ==, and remember a float is coarser than a double.", ex: {"code":"float f = 0.7;\nprintf(\"%d %d\", f == 0.7, f < 0.7);","out":"0 1"} },
    { type: "trap", wrong: "#define N 5 creates a variable called N.", tempting: "It looks like an assignment, and N behaves like a name.", whyWrong: "It is a text replacement done before compiling: every N becomes 5. There is no box and no type.", rule: "#define replaces text; const makes a typed variable.", ex: {"code":"#define N 5\nint a[N];     /* the compiler sees: int a[5]; */\n/* &N is an error: N is not a box, it has no address */"} },
    { type: "gate", text: "Two forms: (1) the value after a type conversion or an unsigned wrap, such as the subtraction in 2017 FN Q58 (2 marks); (2) signed against unsigned comparisons, integer division, casts, sizeof of an expression, and the sign of a remainder inside output questions of the later chapters (loops, pointers, functions). Question 2017 FN Q58 is worked above." },
    { type: "recall", cards: [
      { q: "What range does an n-bit unsigned type have?", a: "0 to 2ⁿ − 1." },
      { q: "What range does an n-bit signed type have?", a: "−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1." },
      { q: "How do you negate a number in two's complement?", a: "Flip every bit and add 1." },
      { q: "What happens when an unsigned type overflows?", a: "It wraps around (modulo 2ⁿ); this is defined." },
      { q: "And a signed type?", a: "Undefined behaviour." },
      { q: "Which byte comes first in little-endian?", a: "The least significant byte." },
      { q: "What is sizeof('A') in C?", a: "4, because 'A' has type int." },
      { q: "What does sizeof(i++) do to i?", a: "Nothing: sizeof never runs its operand." },
      { q: "What is -1 < 1u?", a: "False (0): −1 becomes a huge unsigned number." },
      { q: "What is 7 / 2 and (float)7 / 2?", a: "3 and 3.5." },
      { q: "What is -7 % 2?", a: "−1 (the sign of the left operand)." },
      { q: "Is 0.1 + 0.2 == 0.3 true?", a: "No, floating-point numbers are inexact." },
    ] },
    { type: "check", questions: [
      { id: "t1", kind: "NAT", marks: 1, q: "signed char c = 200; What is the value of c? (usual machines)", answer: "-56", solution: "200 − 256 = −56." },
      { id: "t2", kind: "NAT", marks: 1, q: "unsigned char u = -1; What is the value of u?", answer: "255", solution: "−1 is all ones: 11111111 = 255." },
      { id: "t3", kind: "NAT", marks: 1, q: "int i = 5; int s = sizeof(i++); What is i afterwards?", answer: "5", solution: "sizeof does not execute i++." },
      { id: "t4", kind: "NAT", marks: 1, q: "What is the value of -7 % 2 in C99?", answer: "-1", solution: "The remainder takes the sign of the left operand." },
      { id: "t5", kind: "MCQ", marks: 1, q: "What is printed by printf(\"%d\", -1 < 1u);?", options: ["0", "1", "-1", "undefined"], answer: "A", solution: "−1 becomes 4294967295 as unsigned, so the comparison is false." },
      { id: "t6", kind: "NAT", marks: 2, q: "unsigned char c = 250; c = c + 10; What is c?", answer: "4", solution: "260 mod 256 = 4." },
      { id: "t7", kind: "NAT", marks: 2, q: "void f(char *s, char *t) { unsigned int c = 0; int len = ((strlen(s) - strlen(t)) > c) ? strlen(s) : strlen(t); printf(\"%d\", len); } Called with s = \"defgh\" and t = \"abc\". What is printed?", answer: "5", solution: "5 − 3 = 2 > 0, so strlen(s) = 5." },
      { id: "t8", kind: "MSQ", marks: 2, q: "Which are true?", options: ["sizeof('A') is 4 in C", "(float)7 / 2 is 3.5", "Signed overflow wraps around in C", "'0' has the value 48"], answer: "A, B, D", solution: "C is false: signed overflow is undefined." },
      { id: "t9", kind: "NAT", marks: 2, q: "How many bytes does an unsigned int use for the number 0x12345678, and which hex byte is stored first on a little-endian machine? Answer with the byte as a decimal number.", answer: "120", solution: "Little-endian stores the lowest byte first: 0x78 = 120." },
      { id: "t10", kind: "MCQ", marks: 2, q: "What is the value of (float)(7 / 2)?", options: ["3.5", "3.0", "4.0", "3.25"], answer: "B", solution: "7 / 2 is 3 first, then it is cast to float: 3.0." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on data types", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: operators and expressions", href: "/study/c-programming" }] },
    { type: "links", prereq: ["How a computer runs a program (C0)", "Your first program (C1)"], usedIn: ["Operators (C3)", "Loops (C5)", "Pointers I (C10)", "Structures and padding (C14)"], cross: ["Digital Logic: number representation", "Computer Organisation: data representation"] },
  ],
};
