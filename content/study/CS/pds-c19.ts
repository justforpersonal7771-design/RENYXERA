import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 19 "Reading mystery functions" (28 Nov 2026). Five real GATE questions explained in full: 2025_FN_Q63 (every second digit), 2025_AN_Q33 (gcd by
 * subtraction), 2021_FN_Q33 (Horner's rule), 2020_FN_Q42 (binary exponentiation), 2024_AN_Q62 (longest subarray with two distinct values, a missing-expression
 * question). The answers and the 2024 choice (B) were checked inside a test program, including the 2024 code against a brute-force search on four arrays.
 */
export const chapterC19: Topic = {
  id: "cs.pds.c.mystery19",
  title: "Reading mystery functions",
  no: "19",
  book: [
    { t: "p", text: "Many GATE questions give you a short function with no name and no comment and ask what it computes: a value for a given input, or a missing line. These are **mystery functions**. They are easier than they look, because there are only a handful of patterns in real questions, and each pattern has a tell-tale shape: a loop that peels digits off a number, a loop that subtracts one number from the other, a loop that doubles and adds." },
    { t: "p", text: "This chapter teaches a method for reading any such function, then shows the common patterns, then works the five real questions of this type. The method is the same each time: trace a tiny input, spot the pattern, and name what the function does. After that, a new input is just a calculation." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["trace an unfamiliar loop with a table of its variables;", "recognise digit-peeling, gcd by subtraction, Horner's rule and binary exponentiation;", "say what a function computes without running it, and check it on a second input;", "find the missing expression in a function by reasoning from its stated purpose;", "choose between tracing by hand and recognising the pattern."] },

    { t: "h2", text: "A method for reading code" },
    { t: "p", text: "Four steps, in order. **One:** read the variables and say what each might be (a counter, an accumulator, a place value). **Two:** trace the function on the smallest input that exercises every branch, writing one table row per pass. **Three:** look at the rows and say in words what changed; that is the pattern. **Four:** test your guess on a second input before using it." },
    { t: "callout", kind: "key", text: "Do not guess from the names of the variables. Run a small input by hand, find the pattern in the table, and only then apply it to the real input." },
    { t: "p", text: "The table is the most valuable thing you can write. A function that looks mysterious becomes obvious after three rows. And when the real input is large, the pattern lets you jump to the answer: the table is only needed for the small example." },
    { t: "callout", kind: "tip", text: "Choose a small input of the same **shape** as the real one: a number with the same number of digits, an array with the same pattern of repeats. The pattern then carries over." },

    { t: "h2", text: "Digit-peeling loops" },
    { t: "p", text: "The two operations `n % 10` and `n / 10` take a number apart: `n % 10` is the last digit, and `n / 10` is the number without its last digit. A loop that repeats them, `while (n) { d = n % 10; n /= 10; … }`, visits the digits from the right. It is used for the sum of the digits, the reverse of a number, the number of digits, and many variations." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n = 1234, s = 0, r = 0, m = n;
    while (m) {
        s += m % 10;           /* the last digit, added */
        r = r * 10 + m % 10;   /* the last digit, appended to r */
        m /= 10;               /* drop the last digit */
    }
    printf("%d %d\\n", s, r);
    return 0;
}`, out: "10 4321", file: "digit_loops.c" },
    { t: "p", text: "Here `s` is the sum of the digits (1 + 2 + 3 + 4 = 10) and `r` is the number written backwards (4321). Both come from the same peeling loop; only the use of the digit `m % 10` differs." },
    { t: "p", text: "A variation extracts the digits from the **left**, by dividing by a power of ten: `d = n / t` is the leading digit when `t` is the largest power of ten not above `n`, and `n % t` removes it. The first question below does exactly this." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Loops that subtract: gcd" },
    { t: "p", text: "A loop that repeatedly replaces the larger of two numbers by the difference, and stops when they are equal, finds their **greatest common divisor**. It works because subtracting the smaller number from the larger does not change the gcd, and the numbers shrink until they meet at the gcd itself. Chapter 8 saw the same idea written recursively." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int x = 126, y = 105;
    do {
        if (x > y) x = x - y;
        else       y = y - x;
    } while (x != y);
    printf("%d\\n", x);
    return 0;
}`, out: "21", file: "gcd_subtraction.c" },
    { t: "ex", id: "c19-e3" },
    { t: "p", text: "Euclid's version replaces the subtraction by the remainder: `gcd(a, b) = gcd(b, a % b)`, which reaches the answer much faster. Both are the same function." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Loops that multiply and add: Horner's rule" },
    { t: "p", text: "The statement `total = x * total + Y[i]`, repeated over an array, is **Horner's rule**. Starting with `total = Y[0]` and applying it for each following element evaluates the polynomial Y[0]·xⁿ⁻¹ + Y[1]·xⁿ⁻² + … + Y[n−1]. For x = 10 it reads the elements as the digits of a decimal number, and for x = 2 as the bits of a binary number." },
    { t: "fig", id: "c19-f1" },
    { t: "callout", kind: "shortcut", text: "`total = x * total + digit` over an array is reading the array as a number in base x. With x = 2 and all ones, ten elements give 1111111111 in binary, which is 2¹⁰ − 1 = 1023." },
    { t: "trap", i: 2 },

    { t: "h2", text: "Binary exponentiation" },
    { t: "p", text: "To compute aᵇ quickly, write b in binary and square a repeatedly: a, a², a⁴, a⁸, … Multiply into the answer only those squares that correspond to a **1** bit of b. This needs about log₂ b multiplications instead of b. The function `tob` in the question below writes b in binary, least significant bit first, and `pp` then does exactly this selection." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a = 3, b = 4, tot = 1, ex = a;
    while (b > 0) {
        if (b % 2) tot = tot * ex;   /* this bit of b is 1: use ex */
        ex = ex * ex;                /* a, a^2, a^4, ... */
        b = b / 2;
    }
    printf("%d\\n", tot);
    return 0;
}`, out: "81", file: "power_squaring.c" },
    { t: "p", text: "For b = 4 (binary 100) only the third bit is 1, and by then `ex` has been squared twice: 3 → 9 → 81. So the result is 3⁴ = 81." },

    { t: "h2", text: "Windows over an array" },
    { t: "p", text: "A harder pattern keeps a few counters that describe the **window** ending at the current element: how long is the run of equal values ending here, and how long is the longest stretch with at most two distinct values. Each new element either extends the run, switches between the two values, or starts a new window. The counters are updated by a small case analysis, and the missing expressions in the question below are the updates." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2025 (forenoon), Q63: every second digit" },
    { t: "p", text: "A two-mark numerical question. A function takes the digits of a number from the left, and a flag decides which ones to keep." },
    { t: "ex", id: "c19-e1" },
    { t: "fig", id: "c19-f2" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Recognising digit extraction from the left, and following the flag. First, `t` becomes the largest power of ten not above `n`: for 14362 it is 10000. Then each pass takes the leading digit `d = n / t`, removes it (`n = n % t`), and divides `t` by 10. The variable `turn` alternates 0, 1, 0, 1, …, and the digit is appended to `newnum` only when `turn` is 1. So the digits 1, 4, 3, 6, 2 are seen with turn = 0, 1, 0, 1, 0: the second and fourth digits are kept, 4 and 6, giving 46." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Keeping the digits with `turn` = 0 (the first, third and fifth, giving 132).", "Starting `t` one power of ten too high or too low.", "Forgetting the `% 2` that makes `turn` alternate, and thinking it keeps counting."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Input", "Digits kept (2nd, 4th, …)", "Returns"], rows: [["14362 (the question)", "4, 6", "46"], ["123456", "2, 4, 6", "246"], ["12", "2", "2"]], caption: "Compiled and run." },

    { t: "h3", text: "GATE 2025 (afternoon), Q33: the gcd loop" },
    { t: "p", text: "A one-mark numerical question with a short code segment: the subtraction loop of section 19.3, with two numbers given." },
    { t: "ex", id: "c19-e2" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "That this loop computes gcd(126, 105) without being told so. Recognising the pattern gives the answer at once: 126 = 2 · 3² · 7 and 105 = 3 · 5 · 7, so the gcd is 3 · 7 = 21. A trace confirms it: (126, 105) → (21, 105) → (21, 84) → (21, 63) → (21, 42) → (21, 21), and the loop stops with x = 21. **Where marks are lost:** answering 105 or 126, by stopping early; or 1 (the numbers are not coprime); or printing y when x != y." },
    { t: "table", head: ["Input", "gcd", "Printed"], rows: [["x = 126, y = 105", "21", "21"], ["x = 48, y = 18", "6", "6"], ["x = 7, y = 5", "1", "1"]], caption: "The first two were compiled and run." },

    { t: "h3", text: "GATE 2021 (forenoon), Q33: Horner's rule on an array of ones" },
    { t: "p", text: "A two-mark numerical question. The array has ten elements, all equal to 1, and x is 2." },
    { t: "ex", id: "c19-e3b" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Horner's rule, or at least a tolerance for a doubling pattern. Starting with `total = 1`, each pass makes `total = 2 * total + 1`: 1, 3, 7, 15, … After the nine passes (`loopIndex` from 1 to 9) it is 2¹⁰ − 1 = 1023. Equivalently, the array is read as the binary number 1111111111. **Where marks are lost:** answering 1024 (off by one), or 511 (only nine terms)." },
    { t: "table", head: ["Array, x", "Meaning", "Result"], rows: [["ten ones, x = 2", "binary 1111111111", "1023"], ["{1, 0, 1}, x = 2", "binary 101", "5"], ["{1, 0, 1}, x = 10", "decimal 101", "101"]], caption: "Compiled and run." },

    { t: "h3", text: "GATE 2020 (forenoon), Q42: binary exponentiation" },
    { t: "p", text: "A two-mark numerical question with two functions. `tob` writes a number in binary, lowest bit first, and `pp` uses those bits to compute a power." },
    { t: "ex", id: "c19-e4" },
    { t: "fig", id: "c19-f3" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Reading `tob` as 'the binary digits of b, least significant first' and `pp` as 'square ex each time, and multiply into tot when the bit is 1'. For b = 4, `tob` gives the bits 0, 0, 1 (length 3). In `pp(3, 4)` the variable ex goes 3, 9, 81, and only the third bit is 1, so tot = 81, which is 3⁴. **Where marks are lost:** reading the bits most significant first, which would multiply by the wrong squares; or forgetting that `ex` is squared on every pass whether or not the bit is 1." },
    { t: "table", head: ["Call", "Bits of b (low first)", "Result"], rows: [["pp(3, 4)", "0, 0, 1", "81"], ["pp(2, 10)", "0, 1, 0, 1", "1024"], ["pp(5, 3)", "1, 1", "125"]], caption: "Compiled and run. pp(a, b) is aᵇ." },

    { t: "h3", text: "GATE 2024 (afternoon), Q62: missing expressions in a window" },
    { t: "p", text: "A two-mark multiple-choice question. A code snippet finds the length of the longest block of consecutive array elements that has **at most two distinct values**, but two of its expressions are missing. A hint tells you what the counters mean at the end of each pass." },
    { t: "ex", id: "c19-e5" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Deriving the update rules from the meaning of the counters rather than from the code. `len1` is the length of the run of **equal** values ending at X[i]; `len2` is the length of the longest block ending at X[i] with at most two distinct values. Case 1, X[i] equals the previous value (`first`): both runs grow by one. Case 2, X[i] equals the older value (`second`), different from the previous one: the block grows (`len2++`), but the run of equal values restarts: `len1 = 1`. That is (P) = 1. Case 3, X[i] is a new value, different from both: the block can only include the previous run of equal values plus this element, so `len2 = len1 + 1`, and `len1 = 1`. That is (Q) = len1 + 1. The answer is B." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option A or D**, using `len2 + 1` somewhere: in the third case the old window is too long, because it contains **two** other values, and only the last run can be kept.", "**Option C**, (Q) = len2 + 1: the same slip.", "Not using the hint: the code is easier to derive from the meaning of `len1` and `len2` than to test."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Array X", "Longest block with at most two distinct values", "Code with (P) = 1, (Q) = len1 + 1"], rows: [["1 2 1 2 3 3", "1 2 1 2 (length 4)", "4"], ["1 1 1 1", "the whole array (4)", "4"], ["1 2 3 4", "any two neighbours (2)", "2"], ["4 4 5 5 4 4 6", "4 4 5 5 4 4 (6)", "6"]], caption: "The code with option B was compiled and run on all four arrays, and agrees with a brute-force search each time." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Read unknown code in four steps: name the variables, trace a small input in a table, state the pattern in words, check it on a second input.", "`n % 10` and `n / 10` peel digits from the right; dividing by powers of ten peels them from the left.", "Repeated subtraction of the smaller number from the larger finds the gcd.", "`total = x * total + element` evaluates an array as a number in base x (Horner's rule).", "Squaring and using the bits of the exponent computes a power in about log b steps.", "For missing expressions, derive them from what each counter is supposed to mean."] },
  ],
  blocks: [
    { type: "figure", id: "c19-f1", caption: "Horner's rule with x = 2 on ten ones: total = 2 · total + 1 each pass gives 1, 3, 7, 15, … 1023.", alt: "A table of the loop index, the total and its binary form for ten ones.", fig: { kind: "trace", title: "total = x * total + Y[i], x = 2, Y all ones", cols: ["i", "total", "in binary"], rows: [{ cells: [0, 1, "1"] }, { cells: [1, 3, "11"] }, { cells: [2, 7, "111"] }, { cells: [3, 15, "1111"] }, { cells: ["…", "…", "…"] }, { cells: [9, 1023, "1111111111"], tone: "ok" }] } },
    { type: "figure", id: "c19-f2", caption: "GATE 2025 FN Q63 with n = 14362. The flag turn is 0, 1, 0, 1, 0, and a digit is kept only when turn is 1.", alt: "A table of the digit taken, turn, and newnum after each pass.", fig: { kind: "trace", title: "gate(14362)", cols: ["t", "d = n / t", "turn", "kept?", "newnum"], rows: [{ cells: [10000, 1, 0, "no", 0] }, { cells: [1000, 4, 1, "yes", 4], changed: [4] }, { cells: [100, 3, 0, "no", 4] }, { cells: [10, 6, 1, "yes", 46], changed: [4], tone: "ok" }, { cells: [1, 2, 0, "no", 46] }] } },
    { type: "figure", id: "c19-f3", caption: "GATE 2020 FN Q42 for pp(3, 4): the bits of 4 (low first) are 0, 0, 1. ex goes 3, 9, 81 and is used only at the 1 bit.", alt: "A table of i, the bit, ex and tot for pp(3, 4).", fig: { kind: "trace", title: "pp(3, 4)", cols: ["i", "arr[i] (bit)", "ex before", "tot after"], rows: [{ cells: [0, 0, 3, 1] }, { cells: [1, 0, 9, 1] }, { cells: [2, 1, 81, 81], changed: [3], tone: "ok" }] } },

    { type: "example", id: "c19-e1", level: "gate", title: "GATE CS 2025 (forenoon), Q63 · 2 marks · NAT", file: "gate2025_q63_digits.c", given: `#include <stdio.h>

int gate (int n) {
    int d, t, newnum, turn;
    newnum = turn = 0; t = 1;
    while (n >= t) t *= 10;
    t /=10;
    while (t > 0) {
        d = n/t;
        n = n%t;
        t /= 10;
        if (turn) newnum = 10*newnum + d;
        turn = (turn + 1) % 2;
    }
    return newnum;
}

int main( ) {
    printf ("%d", gate(14362));
    return 0;
}`, find: "The value printed.", steps: [
      { say: "t grows to 100000 (not above n fails), then t /= 10 gives 10000: the place value of the leading digit.", result: "t = 10000" },
      { say: "Each pass takes d = n / t (the leading digit), n = n % t (removes it), t /= 10. The digits are 1, 4, 3, 6, 2.", result: "digits from the left" },
      { say: "turn alternates 0, 1, 0, 1, 0, and the digit is appended only when turn is 1: the second and fourth digits, 4 and 6.", result: "newnum = 46" },
    ], answer: "46", check: "Official answer 46. The program was compiled and run." },
    { type: "example", id: "c19-e2", level: "gate", title: "GATE CS 2025 (afternoon), Q33 · 1 mark · NAT", file: "gate2025_an_q33.txt", given: `int x = 126, y = 105;
do {
    if(x > y) x = x - y;
    else y = y - x;
} while(x!=y);
printf("%d", x);`, find: "The output.", steps: [
      { say: "The loop subtracts the smaller from the larger until the two are equal: that is the gcd of 126 and 105.", result: "gcd(126, 105)" },
      { say: "Trace: (126, 105) → (21, 105) → (21, 84) → (21, 63) → (21, 42) → (21, 21).", result: "x = y = 21" },
      { say: "The test x != y is false, and x is printed.", result: "21" },
    ], answer: "21", check: "Official answer 21. The loop was compiled and run (see the program gcd_subtraction.c above)." },
    { type: "example", id: "c19-e3", level: "easy", title: "Trace by hand: gcd by subtraction", file: "gcd_trace.txt", given: `x = 48, y = 18
repeat: if x > y then x = x - y, else y = y - x
until x == y`, find: "The value of x at the end.", steps: [
      { say: "48 > 18, so x = 30.", result: "(30, 18)" },
      { say: "30 > 18, so x = 12.", result: "(12, 18)" },
      { say: "12 < 18, so y = 6.", result: "(12, 6)" },
      { say: "12 > 6, so x = 6. Now x == y.", result: "(6, 6): 6" },
    ], answer: "6", check: "gcd(48, 18) = 6. The harness gave the same value." },
    { type: "example", id: "c19-e3b", level: "gate", title: "GATE CS 2021 (forenoon), Q33 · 2 marks · NAT", file: "gate2021_q33.txt", given: `int SimpleFunction (int Y[ ], int n, int x)
{
    int total = Y[0], loopIndex;
    for (loopIndex = 1; loopIndex <= n - 1; loopIndex++)
        total = x * total + Y[loopIndex];
    return total;
}
/* Z has 10 elements, all equal to 1. The value of SimpleFunction(Z, 10, 2). */`, find: "The value returned.", steps: [
      { say: "total = x * total + Y[i] is Horner's rule: it reads the array as a number in base x.", result: "base 2" },
      { say: "With ten ones and x = 2 the array is the binary number 1111111111.", result: "ten 1 bits" },
      { say: "That equals 2¹⁰ − 1. Check on the first rows: 1, 3, 7, 15, …", result: "1023" },
    ], answer: "1023", check: "Official answer 1023. The function was run on ten ones with x = 2." },
    { type: "example", id: "c19-e4", level: "gate", title: "GATE CS 2020 (forenoon), Q42 · 2 marks · NAT", file: "gate2020_q42.txt", given: `int tob(int b, int* arr) {
    int i;
    for(i=0; b>0; i++) {
        if(b%2) arr[i]=1;
        else arr[i]=0;
        b=b/2;
    }
    return(i);
}
int pp(int a, int b) {
    int arr[20];
    int i, tot=1, ex, len;
    ex=a;
    len=tob(b,arr);
    for(i=0; i<len; i++) {
        if(arr[i]==1)
            tot=tot * ex;
        ex = ex * ex;
    }
    return(tot);
}
/* The value returned by pp(3, 4). */`, find: "The value returned by pp(3, 4).", steps: [
      { say: "tob(4, arr): 4 = binary 100, written low bit first: arr = 0, 0, 1 and it returns 3.", result: "arr = [0, 0, 1], len = 3" },
      { say: "pp: ex starts at 3. i = 0: bit 0, so tot stays 1; ex = 9. i = 1: bit 0, so tot stays 1; ex = 81.", result: "ex = 81" },
      { say: "i = 2: bit 1, so tot = 1 × 81. ex is squared again but not used.", result: "tot = 81" },
    ], answer: "81", check: "Official answer 81. pp(3, 4) is 3⁴; the functions were run." },
    { type: "example", id: "c19-e5", level: "gate", title: "GATE CS 2024 (afternoon), Q62 · 2 marks · MCQ", file: "gate2024_an_q62.txt", given: `int first = 0, second = 0, len1 = 0, len2 = 0, maxlen = 0;
for (int i = 0; i < n; i++) {
    if (X[i] == first) {
        len2++; len1++;
    }
    else if (X[i] == second) {
        len2++;
        len1 = ____(P)____;
        second = first;
    }
    else {
        len2 = ____(Q)____;
        len1 = 1; second = first;
    }
    if (len2 > maxlen) {
        maxlen = len2;
    }
    first = X[i];
}
/* len1: length of the longest subarray ending at X[i] with all values equal.
   len2: length of the longest subarray ending at X[i] with at most two distinct values.
   Options: (A) P = len1 + 1, Q = len2 + 1   (B) P = 1, Q = len1 + 1
            (C) P = 1, Q = len2 + 1          (D) P = len2 + 1, Q = len1 + 1 */`, find: "The correct missing expressions.", steps: [
      { say: "Case X[i] == first: the new element equals the previous one. Both the run of equal values and the two-valued block grow by one. (Given.)", result: "len1++, len2++" },
      { say: "Case X[i] == second (not the previous one): the two-valued block grows, but the run of equal values restarts, since the previous element is different.", result: "(P) = 1" },
      { say: "Case a new value: the block can contain only the previous run of equal values plus this element.", result: "(Q) = len1 + 1" },
    ], answer: "(B)", check: "Official answer (B). The code with option B was run against a brute-force search on four arrays and agreed on every one." },

    { type: "trap", wrong: "A loop with n % 10 and n / 10 always reverses the number.", tempting: "Reversing is the most familiar use of those two operations.", whyWrong: "The loop only peels digits. What it does with each digit decides the function: add it (sum of digits), append it (reverse), count it (number of digits), compare it, or keep it only on alternate turns.", rule: "Read what happens to each digit.", ex: { text: "With n = 1234: adding each digit gives 10; appending each to r (r = r * 10 + digit) gives 4321; counting passes gives 4. The same peeling loop, three different results." } },
    { type: "trap", wrong: "gcd by subtraction stops when one number reaches 0.", tempting: "Euclid's remainder method does.", whyWrong: "In the subtraction version the numbers never reach 0 (the larger is reduced by the smaller, which is positive); the loop stops when they are equal, and that value is the gcd.", rule: "Subtraction: stop at x == y. Remainder: stop at b == 0.", ex: { code: "int x = 126, y = 105;\ndo { if (x > y) x -= y; else y -= x; } while (x != y);\nprintf(\"%d\", x);", out: "21" } },
    { type: "trap", wrong: "In Horner's rule the first element is multiplied last.", tempting: "It is the first thing in the array.", whyWrong: "total starts as Y[0] and is multiplied by x on every later pass, so Y[0] is multiplied the most times: it is the most significant digit.", rule: "Y[0] is the leading digit of the number in base x.", ex: { text: "For Y = {1, 0, 1} and x = 10 the result is 101 (the digits in order); for x = 2 it is binary 101 = 5. Reversing the array gives the same here but not for {1, 2, 3} (123 against 321)." } },
    { type: "gate", text: "Five questions have been asked on this chapter: digit extraction with a flag (2025 FN Q63, 2 marks), gcd by subtraction (2025 AN Q33, 1 mark), Horner's rule (2021 FN Q33, 2 marks), binary exponentiation (2020 FN Q42, 2 marks) and a missing-expression question on a window over an array (2024 AN Q62, 2 marks). All five are worked above." },
    { type: "recall", cards: [
      { q: "What do n % 10 and n / 10 do?", a: "Give the last digit and the number without its last digit." },
      { q: "What does repeated subtraction of the smaller from the larger compute?", a: "The gcd." },
      { q: "What is total = x * total + Y[i] called?", a: "Horner's rule." },
      { q: "What does it compute for x = 10?", a: "The digits Y read as a decimal number." },
      { q: "How is a power computed by squaring?", a: "Square repeatedly; multiply into the answer at each 1 bit of the exponent." },
      { q: "What are the four steps for reading a mystery function?", a: "Name the variables, trace a small input, state the pattern, check on a second input." },
      { q: "In the window code, what does len1 mean?", a: "The length of the run of equal values ending at the current element." },
    ] },
    { type: "check", questions: [
      { id: "y1", kind: "NAT", marks: 1, q: "int n = 1234, s = 0; while (n) { s += n % 10; n /= 10; } What is s?", answer: "10", solution: "1 + 2 + 3 + 4." },
      { id: "y2", kind: "NAT", marks: 1, q: "int x = 48, y = 18; do { if (x > y) x = x - y; else y = y - x; } while (x != y); What is x?", answer: "6", solution: "gcd(48, 18)." },
      { id: "y3", kind: "NAT", marks: 1, q: "int Y[3] = {1, 0, 1}; total = Y[0]; for (i = 1; i < 3; i++) total = 2 * total + Y[i]; What is total?", answer: "5", solution: "Binary 101." },
      { id: "y4", kind: "NAT", marks: 2, q: "gate(n) from GATE 2025 keeps every second digit counted from the left. What is gate(123456)?", answer: "246", solution: "2, 4 and 6." },
      { id: "y5", kind: "NAT", marks: 2, q: "pp(a, b) computes a to the power b by squaring. What is pp(2, 10)?", answer: "1024", solution: "2¹⁰." },
      { id: "y6", kind: "NAT", marks: 2, q: "int r = 0, m = 1234; while (m) { r = r * 10 + m % 10; m /= 10; } What is r?", answer: "4321", solution: "The digits reversed." },
      { id: "y7", kind: "MCQ", marks: 2, q: "In the longest-block code, when X[i] equals neither the previous value nor the one before it, len1 is set to 1 and len2 is set to:", options: ["len2 + 1", "len1 + 1", "1", "len1"], answer: "B", solution: "Only the last run of equal values can be kept, plus this element." },
      { id: "y8", kind: "NAT", marks: 2, q: "int n = 13, c = 0; while (n) { n &= n - 1; c++; } What is c?", answer: "3", solution: "13 = 1101 has three 1 bits; each pass clears the lowest." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on reading code", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: the output-prediction method", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Loops (C5)", "Functions (C6)", "Operators (C3)"], usedIn: ["Output prediction (C20)", "Previous-year patterns (C21)"], cross: ["Algorithms: gcd, exponentiation, sliding window"] },
  ],
};
