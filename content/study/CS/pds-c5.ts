import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 5 "Loops" (28 Nov 2026). Real GATE questions explained in full: 2024_FN_Q21 (a loop that never ends), 2024_FN_Q47 (x = x + x + y, MSQ),
 * 2019_FN_Q48 (float loop, how many prints), 2017_AN_Q53 (division by repeated subtraction, loop invariant).
 * Every program was compiled and run with gcc (scripts/chapter-check.ts); the one that never ends is reported as such by the checker.
 */
export const chapterC5: Topic = {
  id: "cs.pds.c.loops",
  title: "Loops",
  no: "5",
  book: [
    { t: "p", text: "A **loop** repeats a block of statements. Almost every useful program has one, and almost every GATE output question about C has one too, because a loop turns a short piece of code into a long computation that you have to follow without a computer. The skill is not cleverness; it is bookkeeping: keep a table with one row per pass and one column per variable, and read the answer off the last row." },
    { t: "p", text: "C has three loops: `while`, `do … while` and `for`. They do the same job and differ only in where the test is placed and where the counting is written. This chapter covers them, how to count iterations in nested loops, how `break` and `continue` change the flow, how a loop can fail to end, and how to prove that a loop does what it should (a loop invariant). Four real GATE questions are worked in full." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["trace any `while`, `do … while` or `for` loop with a table of its variables;", "count the iterations of single and nested loops, including the ones with `i *= 2` and `j += i`;", "say exactly what `break` and `continue` do inside a loop;", "recognise a loop that never ends, including the traps with unsigned and decimal counters;", "use a loop invariant to check that a loop computes what it claims."] },

    { t: "h2", text: "The three loops" },
    { t: "h3", text: "while: test first" },
    { t: "p", text: "`while (condition) body` tests the condition **before** every pass. If it is false at the start, the body runs zero times. The body must change something that the condition looks at, or the loop never ends." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int s = 0, i = 1;
    while (i <= 5) {
        s += i;
        i++;
    }
    printf("%d\\n", s);
    return 0;
}`, out: "15", file: "while_sum.c" },
    { t: "h3", text: "do … while: test last" },
    { t: "p", text: "`do body while (condition);` runs the body first and tests afterwards, so the body runs **at least once**, even when the condition is false from the start. Note the semicolon after the closing bracket." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int i = 10;
    do {
        printf("%d ", i);
        i++;
    } while (i < 5);
    printf("\\n");
    return 0;
}`, out: "10", file: "do_while.c" },
    { t: "h3", text: "for: counting in one line" },
    { t: "p", text: "`for (init; condition; update) body` packs the three parts of a counting loop together. It runs `init` once, then repeats: test the condition, run the body, run `update`. It is the same as `init; while (condition) { body; update; }`. Any of the three parts may be empty; `for (;;)` is a loop that runs until a `break`." },
    { t: "fig", id: "c5-f1" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int i;
    for (i = 3; i > 0; i--)
        printf("%d ", i);
    printf("| %d\\n", i);
    return 0;
}`, out: "3 2 1 | 0", file: "for_countdown.c" },
    { t: "p", text: "The last number matters: when the loop ends, `i` is 0, the first value for which the condition was false. After a normal `for` loop the counter holds the value that **stopped** the loop." },
    { t: "callout", kind: "key", text: "The order of a `for` loop is: init (once) → test → body → update → test → body → update … → test fails. The update runs after the body and before the next test." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Counting iterations" },
    { t: "h3", text: "One loop" },
    { t: "p", text: "For `for (i = a; i < b; i++)` the body runs b − a times. For `i <= b` it is b − a + 1. When the update multiplies or divides (`i *= 2`, `i /= 2`) the counter climbs or falls geometrically and the loop runs about log₂ of the range, not the range itself. When the update adds a changing amount (`j += i`) the count is a sum, which for the harmonic pattern is about n ln n." },
    { t: "h3", text: "Nested loops" },
    { t: "p", text: "The inner loop runs completely for every pass of the outer loop, so the total is the **sum** over the outer passes of the inner count. The common patterns for n = 16 are in the table; all of them were run." },
    { t: "table", head: ["Loops", "Inner count", "Total for n = 16", "Order"], rows: [["`i < n`, `j < n`", "n each time", "256", "n²"], ["`i < n`, `j < i`", "i each time", "120", "n²/2"], ["`i *= 2` from 1", "single loop", "4", "log n"], ["`i < n`, `j *= 2` from 1", "log n each time", "64", "n log n"], ["`i = 1..n`, `j += i` from 1", "⌈n / i⌉ each time", "61", "n ln n"], ["`i * i < n`", "single loop", "4", "√n"]], caption: "Each total was produced by running the loops." },
    { t: "callout", kind: "shortcut", text: "For nested loops write the inner count as a function of the outer variable, then add it up: Σ i = n(n−1)/2 when the inner loop is `j < i`, Σ ⌈n/i⌉ when it is `j += i`. For a quick check, run the code for a small n, like 4, by hand." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int c = 0, n = 16;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < i; j++)
            c++;
    printf("%d\\n", c);
    return 0;
}`, out: "120", file: "triangular_loop.c" },

    { t: "h2", text: "break and continue" },
    { t: "p", text: "`break` leaves the **innermost** loop (or switch) at once. `continue` abandons the rest of the current pass and goes to the next one: in a `while` it goes straight to the test, and in a `for` it goes to the **update** first and then the test. A `continue` in a `for` loop does not skip the update, which is why a `for` is safer than a `while` when you use it." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        if (i == 3) continue;     /* skip 3 */
        if (i == 5) break;        /* leave at 5 */
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`, out: "1 2 4", file: "break_continue.c" },
    { t: "trap", i: 1 },
    { t: "p", text: "A loop can also be written with an assignment or a post-increment in its test, which hides a side effect. Trace each pass, including the failing test:" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int i = 0;
    while (i++ < 3) printf("%d", i);   /* test with the old i, then add 1 */
    printf(" ");
    i = 0;
    while (++i < 3) printf("%d", i);   /* add 1 first, then test */
    printf("\\n");
    return 0;
}`, out: "123 12", file: "increment_in_test.c" },

    { t: "h2", text: "Loops that never end" },
    { t: "p", text: "A loop never ends when its condition can never become false. Three causes appear in GATE questions. First, the body does not move the variable towards the end, or moves it back (`a = a / 12 + 1` keeps resetting a to 1). Second, an **unsigned** counter that is tested for `>= 0`, which is always true. Third, a **decimal** counter compared with `==`, which may never hit the value exactly." },
    { t: "trap", i: 2 },
    { t: "callout", kind: "tip", text: "To decide whether a loop ends, find the variable in the condition and ask: after each pass, is it always closer to making the condition false? If a pass can put it back, or leave it where it was, the loop may never end." },
    { t: "p", text: "Even a loop that does end can surprise you when its counter is a decimal number. Adding 0.1 ten times in `float` does not give exactly 1." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    float s = 0;
    for (int i = 0; i < 10; i++)
        s += 0.1f;
    printf("%d\\n", s == 1.0f);
    return 0;
}`, out: "0", file: "float_counter.c" },
    { t: "trap", i: 3 },

    { t: "h2", text: "Loop invariants" },
    { t: "p", text: "A **loop invariant** is a statement that is true before the loop, stays true after every pass, and, together with the condition that ended the loop, proves the loop did its job. It is the standard way to show that a loop is correct, and it is how GATE asks about loops that compute something such as a quotient." },
    { t: "p", text: "Take division by repeated subtraction. To divide x by y we subtract y from r again and again, counting the subtractions in q. The invariant is `x == y × q + r`: whatever has been taken off r is exactly what has been added up in q. At the start, q = 0 and r = x, so it holds. Each pass subtracts y from r and adds 1 to q, which keeps it true. The loop stops when r < y, and then q is the quotient and r the remainder." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    unsigned x = 17, y = 5, q = 0, r = x;
    while (r >= y) {
        r = r - y;
        q = q + 1;
    }
    printf("%u %u %d\\n", q, r, x == y * q + r);
    return 0;
}`, out: "3 2 1", file: "division_loop.c" },
    { t: "callout", kind: "note", text: "The loop also needs y > 0. If y is 0 the test `r >= 0` is always true for an unsigned r and the loop never ends." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2024 (forenoon), Q21: does it stop?" },
    { t: "p", text: "A one-mark multiple-choice question. It asks whether a loop prints something or never ends. All the work is to follow what the body does to the variable the condition looks at." },
    { t: "ex", id: "c5-e1" },
    { t: "fig", id: "c5-f2" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Whether you follow the loop instead of guessing from the numbers. The test is `a < 10`, so the loop runs while a is below 10. The body sets `a = a / 12 + 1`. For any a from 0 to 11, `a / 12` is 0 in integer division, so the new a is 1, and then `a += b` adds 0. So after every pass a is 1, which is below 10, and the loop starts again. It never ends, and nothing is printed." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option A, prints 9 or B, prints 10.** The student thinks a grows towards 10, because the starting value 6 is close to it.", "**Option D, prints 6.** The student does not run the body at all, or thinks the loop ends at once.", "Forgetting integer division: `6 / 12` is 0, not 0.5."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Result"], rows: [["`a = a / 2 + 1` instead", "6 → 4 → 3 → 2 → 2 … the value settles at 2, below 10", "never ends"], ["`a = a * 2 + b` with b = 1 (a = 6)", "6 → 13, which is not below 10", "ends, prints 13"], ["`b = 12` (and `a = a / 12 + 1; a += b;`)", "a becomes 1 + 12 = 13 after the first pass", "ends, prints 13"]], caption: "Work each by hand; the first row follows the same rule as the question." },

    { t: "h3", text: "GATE 2024 (forenoon), Q47: x = x + x + y" },
    { t: "p", text: "A two-mark multiple-select question about how large a value grows. The body doubles x and adds y on every pass, so you want a formula for the value after y passes, not a table of 20 rows." },
    { t: "ex", id: "c5-e2" },
    { t: "fig", id: "c5-f3" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "A closed form for a repeated update. If x_{k+1} = 2·x_k + y, then adding y to both sides gives x_{k+1} + y = 2·(x_k + y). So x + y doubles on every pass, and after n passes x_n + y = 2ⁿ·(x₀ + y). With n = y passes, x = 2^y · (x₀ + y) − y. For (20, 10): 2¹⁰ × 30 − 10 = 30 710, which is less than 2²⁰ (so A is false) and greater than 2¹⁰ (so C is false). For (20, 20): 2²⁰ × 40 − 20 = 41 943 020, larger than 2²⁰ (B true). For (10, 20): 2²⁰ × 30 − 20 = 31 457 260, larger than 2²⁰ (D true)." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Reading `x + x + y` as `x + (x + y)` and not seeing the doubling.", "Estimating that 10 passes give 'about 2²⁰'. The size is 2^y times (x + y), so y = 10 gives about 2¹⁰ × 30, not 2²⁰.", "Not checking all four options: A and C are about the same case (20, 10) and both are false."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Inputs", "Formula 2^y (x + y) − y", "Value"], rows: [["x = 20, y = 10", "1024 × 30 − 10", "30 710"], ["x = 20, y = 20", "1 048 576 × 40 − 20", "41 943 020"], ["x = 10, y = 20", "1 048 576 × 30 − 20", "31 457 260"], ["x = 1, y = 3", "8 × 4 − 3", "29"]], caption: "The first three were compiled and run; the last follows from the same formula (1 → 5 → 13 → 29)." },

    { t: "h3", text: "GATE 2019 (forenoon), Q48: how many times is sum printed?" },
    { t: "p", text: "A two-mark numerical question with a decimal loop. Because i and j are `float`, but all the values are powers of two, the arithmetic is exact, and you can follow the loop with a short table." },
    { t: "ex", id: "c5-e3" },
    { t: "fig", id: "c5-f4" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Careful counting of the passes and of the **exact** moment the test fails. j doubles each pass: 1, 2, 4, 8, 16, 32. The test is `i / j > 0.0625`, with i = 2. It is true for i/j = 2, 1, 0.5, 0.25, 0.125 (five times) and false for 0.0625 because the test is a strict `>`, and 2 / 32 is exactly 0.0625." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Answering 6, by counting the pass where i/j equals 0.0625 as a pass. The test is `>`, not `>=`.", "Answering 4, by stopping one pass early.", "Forgetting that j is doubled **before** the sum is updated, so the first value added is 2/2 = 1, not 2/1."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["`>=` instead of `>`", "the pass with i/j = 0.0625 now also runs: 6 passes", "6"], ["`i = 4.0`", "4/j is 4, 2, 1, 0.5, 0.25, 0.125 and then 0.0625 stops it: 6 passes", "6"], ["`j = j * 4`", "4/…: i/j = 2, 0.5, 0.125 and then 0.03125 stops it", "3"]], caption: "The key idea: list the values of the test expression until it fails." },

    { t: "h3", text: "GATE 2017 (afternoon), Q53: a loop invariant" },
    { t: "p", text: "A two-mark multiple-choice question about the division loop of section 5.4. It asks for the starting conditions that guarantee that, when the loop ends, `x == y × q + r`." },
    { t: "ex", id: "c5-e4" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Two properties together: the invariant must be true **before** the loop, and the loop must **end**. The invariant x = y·q + r holds at the start only if r = x and q = 0 (otherwise the relation is false from the first moment). The loop ends only if y > 0, because with y = 0 the test `r >= y` is always true for an unsigned r. That is exactly option C." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option B** has r == x and y > 0, but does not say q == 0. If q starts at 5, then x = y·q + r fails at the start.", "**Option D** has q == 0 and y > 0, but does not tie r to x. Then x = y·0 + r does not hold.", "**Option A** (q == r and r == 0) says nothing about x, so the invariant cannot be guaranteed."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Start", "Invariant true at the start?", "Ends?", "Result for x = 17, y = 5"], rows: [["q = 0, r = x, y > 0", "yes", "yes", "q = 3, r = 2; 17 = 5·3 + 2"], ["q = 1, r = x, y > 0", "no: 17 ≠ 5·1 + 17", "yes", "q = 4, r = 2; the relation is false"], ["q = 0, r = x, y = 0", "yes", "no (never ends)", "none"]], caption: "The first row was compiled and run." },
    { t: "callout", kind: "shortcut", text: "For a loop-invariant question, test each option against the loop with two checks: is the relation true before the first pass, and does the loop end? An option must pass both." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["`while` tests first, `do … while` tests last (at least one pass), `for` combines init, test and update. The update runs after the body.", "To count iterations: single loop, b − a for `i < b`; geometric update gives about log n; nested loops add the inner count over every outer value.", "`break` leaves the innermost loop; `continue` goes to the next pass (to the update in a `for`).", "A loop can fail to end when its body resets the variable, when an unsigned counter is tested for `>= 0`, or when a decimal counter is compared with `==`.", "A loop invariant is true before and after every pass; with the ending condition it proves the loop correct, and the loop must also end.", "Trace loops with a table: one row per pass, one column per variable."] },
  ],
  blocks: [
    { type: "figure", id: "c5-f1", caption: "The order of a for loop. The update comes after the body and before the next test.", alt: "A table of the steps of for (i = 3; i > 0; i--): init, test, body, update, ending with i equal to 0.", fig: { kind: "trace", title: "for (i = 3; i > 0; i--) printf(i);", cols: ["Step", "i", "Test i > 0", "Printed"], rows: [{ cells: ["init", 3, "", ""] }, { cells: ["test, body", 3, "true", "3"] }, { cells: ["update, test, body", 2, "true", "2"], changed: [1] }, { cells: ["update, test, body", 1, "true", "1"], changed: [1] }, { cells: ["update, test", 0, "false", "loop ends"], tone: "ok", changed: [1] }] } },
    { type: "figure", id: "c5-f2", caption: "GATE 2024 FN Q21: a / 12 is 0 for any small a, so every pass resets a to 1, and 1 < 10 is always true.", alt: "A table of the first passes of the loop showing a staying at 1.", fig: { kind: "trace", title: "a = 6, b = 0;  while (a < 10) { a = a / 12 + 1; a += b; }", cols: ["Pass", "a before", "a / 12", "a after", "a < 10"], rows: [{ cells: [1, 6, 0, 1, "true"] }, { cells: [2, 1, 0, 1, "true"], tone: "hl" }, { cells: [3, 1, 0, 1, "true"], tone: "hl" }, { cells: ["…", 1, 0, 1, "true: never ends"], tone: "bad" }] } },
    { type: "figure", id: "c5-f3", caption: "GATE 2024 FN Q47: x + y doubles on every pass, so after y passes x = 2^y (x₀ + y) − y.", alt: "A table with x, y and x plus y at each pass for x equal 20 and y equal 10.", fig: { kind: "trace", title: "x = x + x + y  with x = 20, y = 10", cols: ["Passes", "x", "x + y"], rows: [{ cells: [0, 20, 30] }, { cells: [1, 50, 60], changed: [1, 2] }, { cells: [2, 110, 120], changed: [1, 2] }, { cells: [3, 230, 240], changed: [1, 2] }, { cells: ["…", "…", "× 2 each pass"] }, { cells: [10, 30710, 30720], tone: "ok", note: "30 × 2¹⁰ = 30720; x = 30 710" }] } },
    { type: "figure", id: "c5-f4", caption: "GATE 2019 FN Q48: sum is printed five times. The test 2/32 > 0.0625 is false because 2/32 equals 0.0625.", alt: "A table of j, i over j, the test result and the printed sum for each pass.", fig: { kind: "trace", title: "i = 2, j = 1, sum = 0", cols: ["Test i / j > 0.0625", "Then j", "sum", "Printed"], rows: [{ cells: ["2 / 1 = 2: true", 2, 1, "1.000000"] }, { cells: ["2 / 2 = 1: true", 4, 1.5, "1.500000"] }, { cells: ["2 / 4 = 0.5: true", 8, 1.75, "1.750000"] }, { cells: ["2 / 8 = 0.25: true", 16, 1.875, "1.875000"] }, { cells: ["2 / 16 = 0.125: true", 32, 1.9375, "1.937500"] }, { cells: ["2 / 32 = 0.0625: false", "", "", "loop ends: 5 prints"], tone: "ok" }] } },

    { type: "example", id: "c5-e1", level: "gate", title: "GATE CS 2024 (forenoon), Q21 · 1 mark · MCQ", file: "gate2024_q21.c", given: `# include <stdio.h>

int main( ) {
    int a = 6;
    int b = 0;
    while (a < 10) {
        a = a/12 + 1;
        a += b;
    }
    printf("%d", a);
    return 0;
}`, find: "Which statement is correct? (A) prints 9  (B) prints 10  (C) gets stuck in an infinite loop  (D) prints 6", steps: [
      { say: "a = 6: the test 6 < 10 is true. The body: 6 / 12 is 0 in integer division, so a = 0 + 1 = 1; then a += 0 leaves it 1.", result: "a = 1" },
      { say: "a = 1: the test is true again. 1 / 12 is 0, so a = 1; a += 0 leaves it 1.", result: "a = 1" },
      { say: "From now on every pass gives a = 1, which is always below 10.", result: "never ends" },
    ], answer: "(C) infinite loop", check: "Official answer (C). The checker ran the program and it did not finish." },
    { type: "example", id: "c5-e2", level: "gate", title: "GATE CS 2024 (forenoon), Q47 · 2 marks · MSQ", file: "gate2024_q47.c", given: `int f (int x, int y) {
    for (int i = 0; i < y; i++ )
        x = x + x + y;
    return x;
}`, find: "Which are true? (A) x = 20, y = 10 gives more than 2²⁰  (B) x = 20, y = 20 gives more than 2²⁰  (C) x = 20, y = 10 gives less than 2¹⁰  (D) x = 10, y = 20 gives more than 2²⁰", steps: [
      { say: "Each pass is x → 2x + y. Add y to both sides: x + y becomes 2(x + y).", result: "x + y doubles" },
      { say: "After y passes: x = 2^y · (x₀ + y) − y.", result: "closed form" },
      { say: "(20, 10): 2¹⁰ · 30 − 10 = 30 710. That is less than 2²⁰ = 1 048 576 (A false) and more than 2¹⁰ = 1024 (C false).", result: "A, C false" },
      { say: "(20, 20): 2²⁰ · 40 − 20 = 41 943 020 > 2²⁰. (10, 20): 2²⁰ · 30 − 20 = 31 457 260 > 2²⁰.", result: "B, D true" },
    ], answer: "B and D", check: "Official answer B, D. The three values were computed by running the function." },
    { type: "example", id: "c5-e3", level: "gate", title: "GATE CS 2019 (forenoon), Q48 · 2 marks · NAT", file: "gate2019_q48.c", given: `#include <stdio.h>

int main ( ) {
    float sum = 0.0, j = 1.0, i = 2.0;
    while (i / j > 0.0625) {
        j = j + j;
        sum = sum + i / j;
        printf("%f\\n", sum);
    }
    return 0;
}`, find: "How many times is sum printed?", steps: [
      { say: "Test: 2/1 = 2 > 0.0625. j becomes 2, sum = 0 + 2/2 = 1. Printed once.", result: "1.000000" },
      { say: "Tests 2/2 = 1, 2/4 = 0.5, 2/8 = 0.25, 2/16 = 0.125 are all true. Each adds a smaller term to sum and prints.", result: "1.5, 1.75, 1.875, 1.9375" },
      { say: "Then j = 32 and the test is 2/32 = 0.0625 > 0.0625: false (equal, not greater).", result: "stop after 5 prints" },
    ], answer: "5", check: "Official answer 5. The program was compiled and run and printed five lines." },
    { type: "example", id: "c5-e4", level: "gate", title: "GATE CS 2017 (afternoon), Q53 · 2 marks · MCQ", file: "gate2017_q53.txt", given: `The variables x, y, q and r are all unsigned int.

while (r >= y)
{
    r = r - y;
    q = q + 1;
}

Which starting condition makes the loop end with x == (y * q + r)?
(A) (q == r) && (r == 0)
(B) (x > 0) && (r == x) && (y > 0)
(C) (q == 0) && (r == x) && (y > 0)
(D) (q == 0) && (y > 0)`, find: "The correct condition.", steps: [
      { say: "The relation x = y·q + r must be true before the loop. That needs q = 0 and r = x.", result: "q == 0 and r == x" },
      { say: "Each pass keeps it true: r goes down by y, q goes up by 1, and y·q + r does not change.", result: "invariant" },
      { say: "The loop must end. With an unsigned r and y = 0 the test r >= 0 is always true, so we need y > 0.", result: "y > 0" },
      { say: "Only option C has all three: q == 0, r == x and y > 0.", result: "C" },
    ], answer: "(C)", check: "Official answer (C). The loop with x = 17, y = 5 ends with q = 3, r = 2 and 17 = 5·3 + 2; the program was compiled and run." },

    { type: "trap", wrong: "After for (i = 3; i > 0; i--) the variable i is 1.", tempting: "1 was the last value printed in the loop.", whyWrong: "The update i-- runs once more after the last pass, and only then does the test fail. So the loop ends with i = 0, the first value that failed the test.", rule: "After a for loop, the counter holds the value that stopped the loop.", ex: { code: "int i;\nfor (i = 3; i > 0; i--)\n    printf(\"%d \", i);\nprintf(\"| %d\", i);", out: "3 2 1 | 0" } },
    { type: "trap", wrong: "continue in a for loop skips the update as well.", tempting: "It skips the rest of the pass, and the update is the last thing in the line.", whyWrong: "continue jumps to the update, and then to the test. In a while loop, where the update is inside the body, a continue before it really does skip it, and can make the loop endless.", rule: "In a for loop, continue goes to the update first.", ex: { code: "for (int i = 1; i <= 5; i++) {\n    if (i == 3) continue;\n    if (i == 5) break;\n    printf(\"%d \", i);\n}", out: "1 2 4" } },
    { type: "trap", wrong: "for (unsigned i = 10; i >= 0; i--) counts down from 10 to 0 and stops.", tempting: "i >= 0 looks like the natural way to stop at zero.", whyWrong: "An unsigned i is never below 0, so i >= 0 is always true. After 0 the next value wraps to the largest unsigned number, and the loop never ends.", rule: "Do not test an unsigned counter for >= 0.", ex: { text: "i = 2, 1, 0 and then i-- gives 4 294 967 295, which is again >= 0. Use `for (unsigned i = 10; i > 0; i--)` and handle 0 separately, or use an int." } },
    { type: "trap", wrong: "A float counter that adds 0.1 ten times reaches exactly 1.0.", tempting: "Ten tenths make one in ordinary arithmetic.", whyWrong: "0.1 cannot be stored exactly in binary, and the small errors add up. The sum is slightly off from 1.0, so a test with == can fail and a loop controlled by it may never end.", rule: "Never control a loop with == on decimal numbers.", ex: { code: "float s = 0;\nfor (int i = 0; i < 10; i++) s += 0.1f;\nprintf(\"%d\", s == 1.0f);", out: "0" } },
    { type: "gate", text: "Four questions have been asked on loops: (1) does a loop stop, and what does it print (2024 FN Q21, 1 mark); (2) how large does a repeated update grow, by closed form (2024 FN Q47, 2 marks, MSQ); (3) how many times is something printed in a decimal loop (2019 FN Q48, 2 marks); (4) which starting condition makes a loop satisfy an invariant (2017 AN Q53, 2 marks). All four are worked above." },
    { type: "recall", cards: [
      { q: "Where does a while loop test its condition?", a: "Before every pass, so it may run zero times." },
      { q: "How many times does a do-while body run at least?", a: "Once." },
      { q: "In what order does a for loop run its parts?", a: "init once, then test, body, update, test, body, update … until the test fails." },
      { q: "What is the value of i after for (i = 0; i < 3; i++)?", a: "3." },
      { q: "Where does continue jump in a for loop?", a: "To the update, then the test." },
      { q: "How many times does for (i = 1; i < n; i *= 2) run?", a: "About log₂ n (4 times for n = 16)." },
      { q: "How many passes does a nested loop with j < i make for n = 16?", a: "120 (n(n−1)/2)." },
      { q: "Why is for (unsigned i = n; i >= 0; i--) endless?", a: "An unsigned i is never below 0." },
      { q: "What is a loop invariant?", a: "A statement true before the loop and after every pass; with the exit condition it shows the loop is correct." },
      { q: "What does x = x + x + y do after n passes?", a: "x + y becomes 2ⁿ (x₀ + y)." },
    ] },
    { type: "check", questions: [
      { id: "l1", kind: "NAT", marks: 1, q: "int i; for (i = 0; i < 5; i++); What is i after the loop?", answer: "5", solution: "The loop ends when i reaches 5." },
      { id: "l2", kind: "NAT", marks: 1, q: "int c = 0, n = 16; for (int i = 0; i < n; i++) for (int j = 0; j < i; j++) c++; What is c?", answer: "120", solution: "0 + 1 + … + 15 = 120." },
      { id: "l3", kind: "NAT", marks: 1, q: "int c = 0; for (int i = 1; i < 16; i *= 2) c++; What is c?", answer: "4", solution: "i = 1, 2, 4, 8." },
      { id: "l4", kind: "NAT", marks: 1, q: "int i = 0; while (i++ < 3) printf(\"%d\", i); How many characters are printed?", answer: "3", solution: "It prints 123." },
      { id: "l5", kind: "MCQ", marks: 1, q: "int a = 6; while (a < 10) a = a / 12 + 1; What happens?", options: ["Prints 10", "Prints 9", "Never ends", "Prints 6"], answer: "C", solution: "a becomes 1 on every pass and 1 < 10 is always true." },
      { id: "l6", kind: "NAT", marks: 2, q: "int f(int x, int y) { for (int i = 0; i < y; i++) x = x + x + y; return x; }  What is f(1, 3)?", answer: "29", solution: "2³ (1 + 3) − 3 = 29." },
      { id: "l7", kind: "NAT", marks: 2, q: "float sum = 0.0, j = 1.0, i = 4.0; while (i / j > 0.0625) { j = j + j; sum = sum + i / j; } How many times does the body run?", answer: "6", solution: "i / j = 4, 2, 1, 0.5, 0.25, 0.125 are all > 0.0625; then 4/64 = 0.0625 stops it: 6 passes." },
      { id: "l8", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["A do-while body runs at least once", "continue in a for loop skips the update", "After for (i = 0; i < 3; i++) the value of i is 3", "An unsigned counter tested with i >= 0 always ends"], answer: "A, C", solution: "B is false: the update still runs. D is false: the test is always true." },
      { id: "l9", kind: "NAT", marks: 2, q: "unsigned x = 17, y = 5, q = 0, r = x; while (r >= y) { r = r - y; q = q + 1; } What is q + r?", answer: "5", solution: "q = 3, r = 2." },
      { id: "l10", kind: "NAT", marks: 2, q: "int c = 0; for (int i = 1; i <= 3; i++) for (int j = i; j <= 3; j++) c++; What is c?", answer: "6", solution: "3 + 2 + 1." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on loops", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: functions", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Operators (C3)", "Decisions (C4)"], usedIn: ["Functions (C6)", "Recursion (C8)", "Arrays (C9)"], cross: ["Algorithms: loop analysis and invariants"] },
  ],
};
