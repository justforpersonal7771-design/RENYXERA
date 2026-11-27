import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 3 "Operators and expressions" (27 Nov 2026). Real GATE questions: 2017_AN_Q58 (prefix and postfix), 2021_FN_Q58 (&& short-circuit),
 * 2022_FN_Q44 (bitwise on characters) are explained in full; 2024_FN_Q30 gives its precedence table as a picture in the paper, so only the method is shown.
 * Every program was compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC3: Topic = {
  id: "cs.pds.c.operators",
  title: "Operators and expressions",
  no: "3",
  book: [
    { t: "p", text: "An **expression** is a piece of code that has a value: `a + b * 2`, `x > 3 && y < 5`, `i++`. An **operator** is the symbol that combines values. Almost every output question in GATE contains an expression, and most wrong answers come from three small facts: which operator is done first, what `++` does at which moment, and which side of `&&` is skipped. This chapter makes each of them mechanical." },
    { t: "p", text: "We go through the kinds of operator, then precedence and associativity, then `++` and `--`, then the logical and bitwise operators, and finally the cases where C refuses to promise an answer. Three real GATE questions are worked in full." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["evaluate any arithmetic expression using precedence and associativity, one reduction at a time;", "tell what `i++` and `++i` do, and what the expression itself is worth;", "predict which operand of `&&`, `||` and `?:` is evaluated and which is skipped;", "apply `&`, `|`, `^`, `~`, `<<` and `>>` to characters and integers, bit by bit;", "recognise an expression whose value C does not define."] },

    { t: "h2", text: "Kinds of operator" },
    { t: "h3", text: "Arithmetic, relational and logical" },
    { t: "p", text: "The **arithmetic** operators are `+ - * / %`. With whole numbers `/` drops the fraction and `%` gives the remainder (chapter 2). The **relational** operators `< <= > >= == !=` compare two values. In C there is no separate true/false type: a comparison gives the whole number 1 for true and 0 for false, and any non-zero value counts as true when tested. The **logical** operators `&& || !` combine truth values and also give 1 or 0." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a = 5, b = 0, c = 7;
    printf("%d %d %d\\n", !a, !b, !!a);
    printf("%d %d %d\\n", c > 3 && c < 10, c < 3 || c > 5, c > 3 > 1);
    return 0;
}`, out: "0 1 1\n1 1 0", file: "logic_values.c" },
    { t: "p", text: "The last value deserves a second look. `c > 3 > 1` is not a range test. It is read left to right: `c > 3` is 1, and then `1 > 1` is 0." },
    { t: "h3", text: "Assignment is an expression" },
    { t: "p", text: "In C `=` is an operator, and the assignment itself has a value: the value stored. That is why `a = b = c = 7` works: it is `a = (b = (c = 7))`, and it is also why `if (x = 0)` compiles and is almost always a mistake for `==`. The **compound** assignments `+= -= *= /= %=` and so on update a variable in place: `x += 3 * 2` is `x = x + (3 * 2)`, and the right side is worked out first." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int x = 5;
    x += 3 * 2;  printf("%d ", x);
    x *= 2 + 1;  printf("%d ", x);
    x /= 2;      printf("%d ", x);
    x %= 4;      printf("%d\\n", x);
    return 0;
}`, out: "11 33 16 0", file: "compound_assign.c" },
    { t: "callout", kind: "tip", text: "For a compound assignment, evaluate the **whole right side first**, then apply the operator. `x *= 2 + 1` is `x = x * (2 + 1)`, not `x = x * 2 + 1`." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Precedence and associativity" },
    { t: "h3", text: "Which operator goes first" },
    { t: "p", text: "When an expression has several operators, **precedence** says which one is done first, as in school arithmetic where multiplication comes before addition. **Associativity** settles a tie between operators of the same level: left to right for most, so `a - b - c` is `(a - b) - c`, but right to left for assignment and the unary operators." },
    { t: "table", head: ["Level (high to low)", "Operators", "Associativity"], rows: [["1", "`()` `[]` `.` `->` postfix `++` `--`", "left to right"], ["2", "prefix `++` `--`, unary `+` `-`, `!` `~`, `*` (follow) `&` (address), `sizeof`, casts", "right to left"], ["3", "`*` `/` `%`", "left to right"], ["4", "`+` `-`", "left to right"], ["5", "`<<` `>>`", "left to right"], ["6", "`<` `<=` `>` `>=`", "left to right"], ["7", "`==` `!=`", "left to right"], ["8", "`&`", "left to right"], ["9", "`^`", "left to right"], ["10", "`|`", "left to right"], ["11", "`&&`", "left to right"], ["12", "`||`", "left to right"], ["13", "`?:`", "right to left"], ["14", "`=` `+=` `-=` …", "right to left"], ["15", "`,`", "left to right"]], caption: "Notice that the bitwise operators `& ^ |` come below the comparisons. This is the source of a famous trap (section 3.5)." },
    { t: "fig", id: "c3-f1" },
    { t: "p", text: "To evaluate, repeat one step: find the operator that is done first, work it out, and replace it and its operands by the result. Figure 3.1 does this for a long expression. Notice that `5 * 2 / 7` is two operators of the same level, so associativity decides: `(5 * 2) / 7 = 10 / 7 = 1`, because the division is of two integers." },
    { t: "callout", kind: "shortcut", text: "Evaluate in this order: brackets; unary operators; `* / %`; `+ -`; shifts; comparisons; `== !=`; `&`; `^`; `|`; `&&`; `||`; `?:`; assignment. Within one level go left to right (right to left for unary, `?:` and assignment)." },
    { t: "h3", text: "A different table gives a different answer" },
    { t: "p", text: "Some GATE questions replace the usual table with a made-up one. The method does not change: use the table you are given, reduce one operator at a time, and be careful with integer division. For example, if a question said that `+` and `-` bind **tighter** than `*` and `/`, then the same expression as in Figure 3.1 is read as `(3 + 1 + 5) * 2 / (7 + 2 - 4 - 7 - 6) / 2 = 9 * 2 / (−8) / 2 = 18 / (−8) / 2 = −2 / 2 = −1`, a different number from the usual −7." },
    { t: "callout", kind: "note", text: "GATE 2024 (forenoon) Q30 is of this kind: it prints a table of precedence and associativity as a picture and asks for the value of `3 + 1 + 5 * 2 / 7 + 2 - 4 - 7 - 6 / 2` under it (the official answer is 6). The table is only in the paper, so it is not reproduced here; the method above is all that is needed." },
    { t: "trap", i: 1 },
    { t: "p", text: "Brackets override everything. `(a + b) * c` adds first." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a = 2, b = 3, c = 4;
    printf("%d %d %d\\n", a + b * c, (a + b) * c, a - b - c);
    int x, y, z;
    x = y = z = 7;
    printf("%d %d %d\\n", x, y, z);
    return 0;
}`, out: "14 20 -5\n7 7 7", file: "precedence_demo.c" },

    { t: "h2", text: "Increment and decrement" },
    { t: "p", text: "`++` adds 1 to a variable and `--` subtracts 1. Each has two forms, and the difference is the **value of the expression**, not what happens to the variable (the variable always changes by one)." },
    { t: "table", head: ["Form", "Name", "What happens", "Value of the expression"], rows: [["`++i`", "prefix", "add 1 first", "the new value"], ["`i++`", "postfix", "add 1 after", "the old value"], ["`--i`", "prefix", "subtract 1 first", "the new value"], ["`i--`", "postfix", "subtract 1 after", "the old value"]] },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int i = 3;
    int r = i++ * 2;           /* uses 3, then i becomes 4 */
    printf("%d %d\\n", r, i);
    int s = ++i * 2;           /* i becomes 5 first, then uses 5 */
    printf("%d %d\\n", s, i);
    return 0;
}`, out: "6 4\n10 5", file: "prefix_postfix.c" },
    { t: "callout", kind: "key", text: "The variable changes the same way in both forms. Only the **value of the whole expression** differs: postfix gives the old value, prefix gives the new one." },
    { t: "trap", i: 2 },

    { t: "h2", text: "Logical operators and short-circuit" },
    { t: "p", text: "`&&` and `||` evaluate their left operand first, and they **stop as soon as the result is known**. For `a && b`, if `a` is false the answer is false whatever `b` is, so `b` is **not evaluated at all**. For `a || b`, if `a` is true, `b` is skipped. This is called short-circuit evaluation. It matters when the right side has a side effect, such as `i++`." },
    { t: "table", head: ["Expression", "Right side is evaluated when", "Skipped when"], rows: [["`a && b`", "`a` is true (non-zero)", "`a` is false"], ["`a || b`", "`a` is false (zero)", "`a` is true"], ["`a ? b : c`", "only `b` if `a` is true, only `c` if not", "the other one"]] },
    { t: "p", text: "The single operators `&` and `|` (section 3.5) do **not** short-circuit: both sides are always evaluated." },
    { t: "trap", i: 3 },

    { t: "h2", text: "Bitwise operators" },
    { t: "h3", text: "Working bit by bit" },
    { t: "p", text: "The bitwise operators work on the individual bits of a whole number. `&` (and) gives 1 where both bits are 1; `|` (or) gives 1 where either is 1; `^` (exclusive or) gives 1 where the bits differ; `~` flips every bit. The shifts `<<` and `>>` slide the bits left or right and fill with zeros (for a right shift of a negative number, with the sign bit on most machines)." },
    { t: "fig", id: "c3-f2" },
    { t: "table", head: ["Operation", "Meaning", "Example (x = 12, 00001100)", "Result"], rows: [["`x & 1`", "lowest bit: odd or even", "00001100 & 1", "0"], ["`x & (x - 1)`", "clears the lowest 1 bit", "1100 & 1011", "8"], ["`x << 2`", "multiply by 4", "x shifted two places left", "48"], ["`x >> 1`", "divide by 2", "x shifted one place right", "6"]] },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int x = 12;
    printf("%d %d %d %d\\n", x & 1, x & (x - 1), x << 2, x >> 1);
    printf("%d %d\\n", x & 1 == 0, (x & 1) == 0);
    return 0;
}`, out: "0 8 48 6\n0 1", file: "bitwise_demo.c" },
    { t: "p", text: "The last line shows the famous trap. In `x & 1 == 0`, the `==` binds tighter than `&`, so it means `x & (1 == 0)`, which is `x & 0`, which is 0. The brackets in `(x & 1) == 0` are not decoration." },
    { t: "trap", i: 4 },
    { t: "h3", text: "Shifts and negative numbers" },
    { t: "p", text: "Shifting left by n is multiplying by 2ⁿ (until bits fall off the top). Shifting right by n is dividing by 2ⁿ, rounding down. For a signed negative number the right shift is implementation-defined; on the usual machines it keeps the sign. Note that `-17 >> 2` is −5 (rounds down) while `-17 / 4` is −4 (rounds towards zero)." },
    { t: "callout", kind: "tip", text: "The value of `x << n` is `x × 2ⁿ`, and `x >> n` is `x ÷ 2ⁿ` rounded down. `x & 1` tests odd, `x & (x - 1)` removes the lowest set bit, and `x & (x - 1) == 0` (with brackets!) tests for a power of two." },

    { t: "h2", text: "When the value is not defined" },
    { t: "p", text: "C does not say in which order the operands of most operators are evaluated, and it forbids changing a variable twice, or changing it and reading it, between two sequence points. An expression such as `i = i++ + ++i` or `n = m++ + ++m` has **undefined behaviour**: the compiler may produce any value, and a question that depends on it has no single answer. The only operators that fix an order are `&&`, `||`, `?:` and the comma." },
    { t: "callout", kind: "warning", text: "If a question changes the same variable twice in one expression (`a[i] = i++`, `x = x++ + 1`, `f(i++, i++)`), the answer is undefined: do not give one number." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2017 (afternoon), Q58: prefix and postfix" },
    { t: "p", text: "A two-mark numerical question that is nothing but careful bookkeeping of `++` and `--`. The variable `n` and `n1` take their values from the two forms of `++`, and then the statements change them again." },
    { t: "ex", id: "c3-e1" },
    { t: "fig", id: "c3-f3" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "That the prefix form `++m` gives the **new** value of m, and the postfix form `m++` gives the **old** one, while in both cases m itself grows by one. After `n = ++m;` both m and n are 11. After `n1 = m++;` n1 gets 11 (the old value) and m becomes 12. Then `n--` and `--n1` each take one off, and the subtraction gives 0." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Giving `n1` the value 12, using the new value of `m++`.", "Forgetting that m changes in the second statement as well, and using 11 for it afterwards.", "Treating `n -= n1` as `n1 -= n`, or computing 10 − 10 wrongly. Keep a table with one column per variable."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["swap the forms: `n = m++; n1 = ++m;`", "n = 10 (m = 11), then m becomes 12 and n1 = 12; n−− is 9, −−n1 is 11; 9 − 11", "−2"], ["use the same variable twice: `n = m++ + ++m;`", "m is changed twice in one expression: undefined behaviour", "no single answer"]], caption: "The first row was compiled and run; the second shows what to refuse to answer." },

    { t: "h3", text: "GATE 2021 (forenoon), Q58: short-circuit in a loop" },
    { t: "p", text: "A two-mark question. The condition `(j >= 0) && (i++)` has a side effect on its right-hand side, so you must work out **when the right side runs**. Once you see that for negative j it never runs, the rest is a short table." },
    { t: "ex", id: "c3-e2" },
    { t: "fig", id: "c3-f4" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Short-circuit evaluation. For j = −3, −2, −1 the left side `j >= 0` is false, so the right side `i++` is **never evaluated** and i stays 0. At j = 0 the left side is true, so `i++` runs: it gives the old value 0 (false, so `count` is not changed) and i becomes 1. From then on `i++` is non-zero, so `count` grows by j each time while i keeps growing." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Thinking `i++` runs on every pass, so i would reach 7 and the answer would be different.", "Forgetting that the first time `i++` runs its value is 0, so j = 0 adds nothing.", "Forgetting the last line `count = count + i`, which adds the final value of i, 4."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["`||` instead of `&&`", "for j < 0 the left is false, so `i++` runs (old values 0, 1, 2); for j ≥ 0 the left is true and `i++` is skipped", "6"], ["a single `&` (no short-circuit)", "both sides always run, so `i++` runs on all seven passes", "9"]], caption: "Both were compiled and run; the original prints 10." },

    { t: "h3", text: "GATE 2022 (forenoon), Q44: bitwise operators on characters" },
    { t: "p", text: "A two-mark question with four options. A character is a small number (its ASCII code), so `&`, `|` and `^` work on its bits, and the result, when printed with `%c`, is the character with that code. The only work is writing the bits." },
    { t: "ex", id: "c3-e3" },
    { t: "fig", id: "c3-f5" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Converting characters to bits and back. `'P'` is 80 (01010000) and `'x'` is 120 (01111000). `a & b` keeps the bits that are on in both: 01010000 = 80. Adding `'*'` (42) gives 122, which is `z`. `a | b` is 01111000 = 120, minus `'-'` (45) gives 75, which is `K`. `a ^ b` is 00101000 = 40, plus `'+'` (43) gives 83, which is `S`." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option B, 122 75 83.** The numbers are right, but `%c` prints characters, not codes.", "**Option C, * - +.** The student forgot to add or subtract the codes and printed the three constants.", "**Option D, P x +.** The student did not apply the operators at all.", "Mistakes in the bits of 80 and 120; write them in two rows and compare column by column."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Question on the same a = 'P', b = 'x'", "Working", "Result"], rows: [["`printf(\"%d %d %d\", a & b, a | b, a ^ b)`", "80, 120, 40", "80 120 40"], ["`a << 1`", "01010000 shifted left one place is 10100000", "160"], ["`~a & 0xff`", "flip 01010000 to 10101111", "175"]], caption: "Compiled and run." },
    { t: "callout", kind: "shortcut", text: "Write the two operands as 8-bit rows one above the other. For `&` write 1 only where both have 1; for `|` where either has 1; for `^` where they differ. Then read the row as a number and add or subtract any character constant." },


    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Comparisons and logical operators give 1 or 0; any non-zero value counts as true. Assignment is an expression whose value is the value stored.", "Precedence decides which operator goes first, associativity breaks ties. Reduce one operator at a time and remember integer division.", "`++i` has the new value, `i++` the old one; the variable changes either way.", "`&&` and `||` evaluate left to right and skip the right operand when the result is known; `&` and `|` never skip.", "`& | ^ ~ << >>` work on bits; `==` binds tighter than `&`, so bracket bit tests.", "Changing a variable twice in one expression is undefined behaviour: do not give a single answer.", "A table of made-up precedence rules is solved by the same method, using the table you are given."] },
  ],
  blocks: [
    { type: "figure", id: "c3-f1", caption: "One operator at a time, highest precedence first. Integer division throws the fraction away.", alt: "A table that reduces 3 + 1 + 5 * 2 / 7 + 2 - 4 - 7 - 6 / 2 step by step to minus seven.", fig: { kind: "trace", title: "3 + 1 + 5 * 2 / 7 + 2 - 4 - 7 - 6 / 2", cols: ["Step", "Expression now"], rows: [{ cells: ["start", "3 + 1 + 5 * 2 / 7 + 2 - 4 - 7 - 6 / 2"] }, { cells: ["5 * 2 (left to right among * /)", "3 + 1 + 10 / 7 + 2 - 4 - 7 - 6 / 2"], changed: [1] }, { cells: ["10 / 7 (integer division)", "3 + 1 + 1 + 2 - 4 - 7 - 6 / 2"], changed: [1] }, { cells: ["6 / 2", "3 + 1 + 1 + 2 - 4 - 7 - 3"], changed: [1] }, { cells: ["+ and - from the left", "−7"], tone: "ok" }] } },
    { type: "figure", id: "c3-f2", caption: "'P' is 80 and 'x' is 120. Column by column: and keeps 1s that are in both, or keeps 1s that are in either, xor keeps 1s that differ.", alt: "Bit rows for P, x and the results of and, or, and xor.", fig: { kind: "bits", title: "a = 'P', b = 'x'", group: 4, rows: [{ label: "a = 'P'", bits: "01010000", value: 80 }, { label: "b = 'x'", bits: "01111000", value: 120 }, { label: "a & b", bits: "01010000", value: 80, tone: "hl" }, { label: "a | b", bits: "01111000", value: 120, tone: "hl" }, { label: "a ^ b", bits: "00101000", value: 40, tone: "hl" }] } },
    { type: "figure", id: "c3-f3", caption: "GATE 2017 AN Q58, statement by statement. n gets the new value of m, n1 the old value after m++.", alt: "A table of m, n and n1 after each statement of the program, ending with n equal to 0.", fig: { kind: "trace", title: "GATE 2017 AN Q58", cols: ["Statement", "m", "n", "n1"], rows: [{ cells: ["int m = 10;", 10, "?", "?"] }, { cells: ["n = ++m;", 11, 11, "?"], changed: [1, 2] }, { cells: ["n1 = m++;", 12, 11, 11], changed: [1, 3] }, { cells: ["n--;", 12, 10, 11], changed: [2] }, { cells: ["--n1;", 12, 10, 10], changed: [3] }, { cells: ["n -= n1;", 12, 0, 10], changed: [2], tone: "ok" }] } },
    { type: "figure", id: "c3-f4", caption: "GATE 2021 FN Q58. The right side i++ runs only when j >= 0; its first value is 0, so count stays 0 at j = 0.", alt: "A table of j from minus three to three with whether i++ ran, the value of i and count.", fig: { kind: "trace", title: "GATE 2021 FN Q58: (j >= 0) && (i++)", cols: ["j", "j >= 0", "i++ runs?", "i after", "count"], rows: [{ cells: [-3, "false", "no", 0, 0] }, { cells: [-2, "false", "no", 0, 0] }, { cells: [-1, "false", "no", 0, 0] }, { cells: [0, "true", "yes, value 0 (false)", 1, 0], changed: [3] }, { cells: [1, "true", "yes, value 1", 2, 1], changed: [3, 4] }, { cells: [2, "true", "yes, value 2", 3, 3], changed: [3, 4] }, { cells: [3, "true", "yes, value 3", 4, 6], changed: [3, 4] }, { cells: ["end", "", "count = count + i", 4, 10], tone: "ok" }] } },
    { type: "figure", id: "c3-f5", caption: "GATE 2022 FN Q44 with a = 'P' and b = 'x'. The three values 80, 120 and 40 are adjusted by the constants and printed as characters.", alt: "A table: a and b codes, the bitwise results and the characters z, K and S.", fig: { kind: "trace", title: "GATE 2022 FN Q44", cols: ["Expression", "Bits result", "+ or − constant", "As a character"], rows: [{ cells: ["(a & b) + '*'", "80", "80 + 42 = 122", "z"] }, { cells: ["(a | b) - '-'", "120", "120 − 45 = 75", "K"] }, { cells: ["(a ^ b) + '+'", "40", "40 + 43 = 83", "S"], tone: "ok" }] } },

    { type: "example", id: "c3-e1", level: "gate", title: "GATE CS 2017 (afternoon), Q58 · 2 marks · NAT", file: "gate2017_q58_ops.c", given: `# include <stdio.h>

int main( )
{
    int m = 10;
    int n, n1;
    n = ++m;
    n1 = m++;
    n--;
    --n1;
    n -= n1;
    printf("%d", n);
    return 0;
}`, find: "The output.", steps: [
      { say: "n = ++m; : m becomes 11 first, and n gets the new value.", result: "m = 11, n = 11" },
      { say: "n1 = m++; : n1 gets the old value 11, then m becomes 12.", result: "n1 = 11, m = 12" },
      { say: "n--; and --n1; take one off each.", result: "n = 10, n1 = 10" },
      { say: "n -= n1; is n = n − n1.", result: "n = 0" },
    ], answer: "0", check: "Official answer 0. The program was compiled and run." },
    { type: "example", id: "c3-e2", level: "gate", title: "GATE CS 2021 (forenoon), Q58 · 2 marks · MCQ", file: "gate2021_q58.c", given: `#include <stdio.h>

int main( )
{
    int i, j, count;
    count = 0;
    i = 0;
    for (j = -3; j <= 3; j++)
    {
        if ((j >= 0) && (i++))
            count = count + j;
    }
    count = count + i;
    printf("%d", count);
    return 0;
}`, find: "The output. Options: (A) does not compile  (B) 10  (C) 8  (D) 13", steps: [
      { say: "For j = −3, −2, −1 the left side j >= 0 is false, so && skips i++. i stays 0 and count stays 0.", result: "i = 0, count = 0" },
      { say: "At j = 0 the left side is true, so i++ runs. Its value is 0, which is false, so count is not changed. i becomes 1.", result: "i = 1, count = 0" },
      { say: "At j = 1, 2, 3 the value of i++ is 1, 2, 3 (non-zero, true), so count gets 1, then 2, then 3. i ends at 4.", result: "count = 6, i = 4" },
      { say: "After the loop count = count + i.", result: "10" },
    ], answer: "(B) 10", check: "Official answer (B). The program was compiled and run." },
    { type: "example", id: "c3-e3", level: "gate", title: "GATE CS 2022 (forenoon), Q44 · 2 marks · MCQ", file: "gate2022_q44.c", given: `#include <stdio.h>

int main(int argc, char *argv[ ]) {
    char a = 'P';
    char b = 'x';
    char c = (a & b) + '*';
    char d = (a | b) - '-';
    char e = (a ^ b) + '+';
    printf("%c %c %c\\n", c, d, e);
    return 0;
}`, find: "The output. Options: (A) z K S  (B) 122 75 83  (C) * - +  (D) P x +", steps: [
      { say: "'P' is 80 = 01010000 and 'x' is 120 = 01111000.", result: "write both as bits" },
      { say: "a & b keeps common 1s: 01010000 = 80. Add '*' (42).", result: "122 = 'z'" },
      { say: "a | b has 1s from either: 01111000 = 120. Subtract '-' (45).", result: "75 = 'K'" },
      { say: "a ^ b has 1s where they differ: 00101000 = 40. Add '+' (43).", result: "83 = 'S'" },
    ], answer: "(A) z K S", check: "Official answer (A). The program was compiled and run." },

    { type: "trap", wrong: "x *= 2 + 1 means x = x * 2 + 1.", tempting: "The text reads left to right, so x * 2 comes first.", whyWrong: "A compound assignment evaluates its whole right side first: x *= 2 + 1 is x = x * (2 + 1).", rule: "Put brackets round the right side of every compound assignment.", ex: {"code":"int x = 5;\nx *= 2 + 1;\nprintf(\"%d\", x);","out":"15","text":"If it meant x = x * 2 + 1 the answer would be 11. It is x = x * (2 + 1)."} },
    { type: "trap", wrong: "5 * 2 / 7 is 5 * (2 / 7).", tempting: "It looks as if the 2 / 7 stands together.", whyWrong: "* and / have the same level and associate left to right, so it is (5 * 2) / 7 = 10 / 7 = 1.", rule: "Same level means left to right: group from the left.", ex: {"code":"printf(\"%d %d\", 5 * 2 / 7, 5 * (2 / 7));","out":"1 0"} },
    { type: "trap", wrong: "i++ and ++i give the same value in an expression.", tempting: "They both add 1 to i, and afterwards i is the same.", whyWrong: "The expression i++ is worth the old value of i, and ++i the new one. n = i++ and n = ++i store different numbers in n.", rule: "Postfix: use the old value, then add. Prefix: add, then use.", ex: {"code":"int i = 3;\nint a = i++;\nint b = ++i;\nprintf(\"%d %d %d\", a, b, i);","out":"3 5 5"} },
    { type: "trap", wrong: "In (a && b) both a and b are always evaluated.", tempting: "Both are written there, so both seem to run.", whyWrong: "If a is false, b is skipped; a side effect such as i++ in b never happens. For || the right side is skipped when the left is true.", rule: "Ask for each && and ||: is the right side reached?", ex: {"code":"int i = 0;\nif (0 && i++) { }\nprintf(\"%d\", i);","out":"0","text":"The left side is 0, so `i++` is skipped and i never changes."} },
    { type: "trap", wrong: "x & 1 == 0 tests that x is even.", tempting: "It reads like (x & 1) == 0.", whyWrong: "== binds tighter than &, so it is x & (1 == 0) = x & 0 = 0, always false.", rule: "Bracket every bitwise operand that is compared.", ex: {"code":"int x = 6;\nprintf(\"%d %d\", x & 1 == 0, (x & 1) == 0);","out":"0 1"} },
    { type: "gate", text: "Four forms: (1) a long expression with a precedence table, sometimes made up and printed as a picture, as in 2024 FN Q30 (1 mark); (2) prefix and postfix bookkeeping, as in 2017 AN Q58 (2 marks); (3) short-circuit with a side effect in a loop, as in 2021 FN Q58 (2 marks); (4) bitwise operators on characters, as in 2022 FN Q44 (2 marks). Questions 2, 3 and 4 are worked above." },
    { type: "recall", cards: [
      { q: "What does a comparison evaluate to in C?", a: "1 for true, 0 for false." },
      { q: "What is the value of the expression i++? And ++i?", a: "The old value, and the new value; i grows by 1 either way." },
      { q: "When is the right side of a && b evaluated?", a: "Only when a is true (non-zero)." },
      { q: "When is the right side of a || b evaluated?", a: "Only when a is false (zero)." },
      { q: "Is 5 * 2 / 7 equal to 1 or 0 in C?", a: "1: (5 * 2) / 7 = 10 / 7 = 1." },
      { q: "Which binds tighter, == or &?", a: "==, so bracket bit tests." },
      { q: "What does x & (x - 1) do?", a: "Clears the lowest set bit." },
      { q: "What is x << 3?", a: "x × 8." },
      { q: "What is the value of i = i++ + ++i?", a: "Undefined: i is changed twice." },
      { q: "In a = b = c = 7, which assignment happens first?", a: "c = 7 (right to left)." },
    ] },
    { type: "check", questions: [
      { id: "o1", kind: "NAT", marks: 1, q: "int a = 2, b = 3, c = 4; What is the value of a + b * c?", answer: "14", solution: "b * c = 12 first, then 2 + 12." },
      { id: "o2", kind: "NAT", marks: 1, q: "int i = 3; int r = i++ * 2; What is r?", answer: "6", solution: "i++ is worth 3; then i becomes 4." },
      { id: "o3", kind: "NAT", marks: 1, q: "int x = 12; What is x & (x - 1)?", answer: "8", solution: "1100 & 1011 = 1000." },
      { id: "o4", kind: "NAT", marks: 1, q: "int x = 5; x *= 2 + 1; What is x?", answer: "15", solution: "x = 5 * (2 + 1)." },
      { id: "o5", kind: "MCQ", marks: 1, q: "In int c = 7, what is the value of c > 3 > 1?", options: ["0", "1", "2", "undefined"], answer: "A", solution: "(7 > 3) is 1, and 1 > 1 is 0." },
      { id: "o6", kind: "NAT", marks: 2, q: "int m = 10, n, n1; n = m++; n1 = ++m; n--; --n1; n -= n1; What is n at the end?", answer: "-2", solution: "n = 10, n1 = 12; then 9 and 11; 9 − 11 = −2." },
      { id: "o7", kind: "NAT", marks: 2, q: "int i = 0, j, count = 0; for (j = -3; j <= 3; j++) { if ((j >= 0) || (i++)) count = count + j; } count = count + i; What is count?", answer: "6", solution: "j = −3: i++ runs, value 0 (false), nothing added, i = 1. j = −2 and −1: i++ gives 1 and 2 (true), so −2 and −1 are added (count −3), i = 3. j = 0 to 3: the left side is true, so i++ is skipped and 0 + 1 + 2 + 3 = 6 is added (count 3). Finally count + i = 3 + 3 = 6." },
      { id: "o8", kind: "MSQ", marks: 2, q: "Which are true in C?", options: ["x & 1 == 0 is the same as (x & 1) == 0", "In a && b, b is skipped when a is 0", "++i has the new value of i", "n = m++ + ++m has a defined value"], answer: "B, C", solution: "A is false: == binds tighter than &. D is false: m is changed twice (undefined)." },
      { id: "o9", kind: "NAT", marks: 2, q: "char a = 'P', b = 'x'; What is (int)(a ^ b)?", answer: "40", solution: "01010000 xor 01111000 = 00101000 = 40." },
      { id: "o10", kind: "NAT", marks: 2, q: "unsigned int u = 1; What is (u << 31) >> 31?", answer: "1", solution: "The bit moves to the top and back: 1." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on operators", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: decisions", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Variables and data types (C2)"], usedIn: ["Decisions (C4)", "Loops (C5)", "Pointers II (C11)"], cross: ["Digital Logic: Boolean operations"] },
  ],
};
