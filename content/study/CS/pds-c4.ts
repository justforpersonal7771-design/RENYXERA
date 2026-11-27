import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 4 "Decisions" (28 Nov 2026). No GATE question in the bank is tagged to this chapter alone (07-PDS-BOOK-CONTENTS.md: decisions appear inside
 * output questions), so the "How GATE asks it" section uses compiled variations of the three patterns that appear there, and invents no question number.
 * Every program was compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC4: Topic = {
  id: "cs.pds.c.decisions",
  title: "Decisions",
  no: "4",
  book: [
    { t: "p", text: "A program that always does the same thing is not very useful. A **decision** lets it choose: print one message or another, take one path or another. C has three tools for this: the `if` statement, the `switch` statement and the conditional operator `?:`. They are simple, but each has one detail that GATE output questions build on: a stray semicolon, an `else` that pairs with the wrong `if`, an `=` where `==` was meant, and a `switch` that keeps running into the next case." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["write and trace `if`, `else if` and `else`, and say which branch runs;", "pair an `else` with the right `if`;", "trace a `switch` including fall-through and `default`;", "use the conditional operator, and say what type its result has;", "spot the four classic mistakes before they cost marks."] },

    { t: "h2", text: "The if statement" },
    { t: "h3", text: "One condition, one branch" },
    { t: "p", text: "`if (condition) statement;` runs the statement only when the condition is true. In C there is no separate true/false type: the condition is any expression, and **zero is false while every other value is true**. An optional `else` runs when the condition is false. When a branch has more than one statement, put them in braces `{ }`." },
    { t: "h3", text: "The else-if ladder" },
    { t: "p", text: "To choose among several cases, chain the tests: `if … else if … else if … else`. C tests them from the top, runs the **first** branch whose condition is true, and skips the rest of the ladder, even if later conditions would also be true. So the order of the tests matters." },
    { t: "fig", id: "c4-f1" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int marks = 72;
    if (marks >= 90)
        printf("A");
    else if (marks >= 70)
        printf("B");
    else if (marks >= 40)
        printf("C");
    else
        printf("F");
    printf("\\n");
    return 0;
}`, out: "B", file: "grade_ladder.c" },
    { t: "callout", kind: "tip", text: "In an else-if ladder, put the **most specific** test first. If you write `marks >= 40` before `marks >= 70`, a mark of 80 stops at the first test and the better grades can never be reached." },
    { t: "trap", i: 0 },
    { t: "h3", text: "Assignment in a condition" },
    { t: "p", text: "The sign `=` stores a value and **has a value**: the value stored (chapter 3). So `if (x = 5)` is legal: it stores 5 in x, and then tests the 5, which is non-zero, so it is always true. It is the famous slip for `if (x == 5)`." },
    { t: "trap", i: 1 },
    { t: "h3", text: "A semicolon after the condition" },
    { t: "p", text: "A semicolon on its own is an **empty statement**. If it comes straight after the closing bracket of the condition, it becomes the whole body of the `if`, and the line that follows is no longer controlled by it." },
    { t: "trap", i: 2 },
    { t: "h3", text: "Which if does the else belong to?" },
    { t: "p", text: "An `else` always pairs with the **nearest unmatched `if`** above it, whatever the indentation says. This is the **dangling else**. Braces are the only way to make a different pairing." },
    { t: "fig", id: "c4-f2" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a = 1, b = 0;
    if (a)
        if (b)
            printf("x");
        else
            printf("y");
    printf("\\n");
    return 0;
}`, out: "y", file: "dangling_else.c" },
    { t: "p", text: "The `else` is attached to `if (b)`, not to `if (a)`, so with a = 1 and b = 0 the program prints y. With a = 0 nothing is printed at all, because the outer test fails and the inner `if` with its `else` is skipped together." },
    { t: "callout", kind: "shortcut", text: "To read nested ifs, ignore the indentation and the layout. Pair each `else` with the closest `if` above it that has no `else` yet." },

    { t: "h2", text: "The switch statement" },
    { t: "h3", text: "Cases, break and default" },
    { t: "p", text: "`switch (expression)` compares one whole-number expression with a list of `case` constants and jumps to the matching one. A `default:` label catches everything else. The expression must be an integer or a character, and each case must be a constant, so you cannot switch on a decimal number or write `case x:` with a variable." },
    { t: "h3", text: "Fall-through" },
    { t: "p", text: "A `switch` only **jumps in** at the matching case. It does not stop at the next label: it carries on running, through every following case, until it meets a `break` or the closing brace. This is called **fall-through**. Forgetting `break` is the most common `switch` mistake, and it is the basis of many GATE questions." },
    { t: "fig", id: "c4-f3" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int x = 2, s = 0;
    switch (x) {
        case 1: s += 1;
        case 2: s += 2;
        case 3: s += 3; break;
        default: s += 10;
    }
    printf("%d\\n", s);
    return 0;
}`, out: "5", file: "fall_through.c" },
    { t: "p", text: "With x = 2 the switch jumps to `case 2`, adds 2, falls into `case 3`, adds 3 and meets the `break`. The total is 5. Case 1 and the default are never run." },
    { t: "trap", i: 3 },
    { t: "h3", text: "Grouping cases and the position of default" },
    { t: "p", text: "Several labels can share one body by stacking them, with no code between. And `default` does not have to be last: it is where the jump lands when nothing matches, and then execution simply continues downwards from there." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    char c = 'e';
    switch (c) {
        case 'a': case 'e': case 'i':
            printf("vowel");
            break;
        default:
            printf("other");
    }
    switch (5) {
        default: printf(" d");
        case 1:  printf("1"); break;
        case 2:  printf("2");
    }
    printf("\\n");
    return 0;
}`, out: "vowel d1", file: "grouped_cases.c" },
    { t: "callout", kind: "tip", text: "To trace a switch: find the matching case (or `default` if none matches), then run **downwards** until you reach `break` or the end. Never run a case that is above the one you jumped to." },

    { t: "h2", text: "The conditional operator" },
    { t: "p", text: "`condition ? a : b` is an expression that gives `a` when the condition is true and `b` when it is false. Only the chosen side is evaluated. It is the short form of a small `if … else`, such as `big = a > b ? a : b;`." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a = 3, b = 8;
    int big = a > b ? a : b;
    printf("%d\\n", big);
    printf("%f\\n", 1 ? 2 : 3.0);
    return 0;
}`, out: "8\n2.000000", file: "conditional_demo.c" },
    { t: "p", text: "The second line shows a small surprise. The result of `?:` has one type, found by the usual arithmetic conversions, so `1 ? 2 : 3.0` is a `double` even though the condition chose the integer 2. It prints as 2.000000." },
    { t: "trap", i: 4 },

    { t: "h2", text: "Combining conditions" },
    { t: "p", text: "A real test is often made of several parts joined by `&&` (and), `||` (or) and `!` (not). `&&` is true only when both sides are; `||` is true when either is. Remember from chapter 3 that both stop early: the right side of `&&` is skipped when the left is false, and the right side of `||` is skipped when the left is true." },
    { t: "p", text: "That early stop is not only a speed-up; it makes a **guard**. Put the safe check on the left and the risky one on the right, and the risky one never runs when the check fails. Here the division would be an error, but the left test protects it." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int x = 5, y = 0;
    if (y != 0 && x / y > 1)
        printf("big");
    else
        printf("safe");
    printf("\\n");
    return 0;
}`, out: "safe", file: "guard_demo.c" },
    { t: "p", text: "A range test must be written as two comparisons joined by `&&`. The mathematical `0 < x < 10` is read in C as `(0 < x) < 10`: the first comparison gives 0 or 1, and 0 or 1 is always less than 10, so the whole test is **always true**." },
    { t: "callout", kind: "warning", text: "Write a range as `x > 0 && x < 10`. The chain `0 < x < 10` compiles, never complains, and is true for x = 50." },
    { t: "p", text: "When several conditions overlap, order them from the most specific to the most general. A number that is a multiple of both 3 and 5 must be tested for **both** first, before the tests for 3 alone or 5 alone, or the combined case is never reached." },

    { t: "h2", text: "Choosing between if, switch and ?:" },
    { t: "p", text: "Use `if` when the test is a range or a combination of conditions, such as `marks >= 70` or `x > 0 && y > 0`. Use `switch` when one integer or character is compared with many exact values, such as a menu choice or a letter; it is easier to read, and the compiler can often turn it into a direct jump." },
    { t: "p", text: "Use `?:` only for choosing between two small values, such as the larger of two numbers. If a branch needs several statements, or the expression becomes hard to read, a plain `if … else` is better. In every case, the more complicated the layout, the more important it is to put braces round each branch, so that the pairing of `else` can never be misread." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "These are the three patterns, each with a worked trace. The variations were compiled and run." },
    { t: "h3", text: "Pattern 1: fall-through" },
    { t: "ex", id: "c4-e1" },
    { t: "table", head: ["Change", "Reasoning", "Final s"], rows: [["x = 1", "jumps to case 1, falls through 2 and 3 until the break: 1 + 2 + 3", "6"], ["x = 3", "jumps to case 3 and breaks: 3", "3"], ["x = 4", "no case matches, so default: 10", "10"], ["remove the `break` after case 3 (with x = 2)", "falls on into default: 2 + 3 + 10", "15"]], caption: "The first three were compiled and run; the last follows the same rule." },
    { t: "h3", text: "Pattern 2: the dangling else" },
    { t: "ex", id: "c4-e2" },
    { t: "table", head: ["a", "b", "Prints"], rows: [["1", "0", "y"], ["1", "1", "x"], ["0", "0 or 1", "nothing"]], caption: "The else belongs to if (b)." },
    { t: "h3", text: "Pattern 3: a side effect or a mistake in the condition" },
    { t: "ex", id: "c4-e3" },
    { t: "callout", kind: "shortcut", text: "For every if, switch or ?: ask three things: which test is evaluated first, which branch is taken, and where does execution go next (stop at `break`, or fall through)?" },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Zero is false, every other value is true. `if` runs its statement when the condition is true.", "In an else-if ladder only the first true branch runs, so the order of the tests matters.", "An `else` pairs with the nearest unmatched `if`, whatever the indentation. Braces change the pairing.", "`if (x = 5)` is an assignment, always true; `if (x > 3);` ends the if with an empty statement.", "A `switch` jumps to the matching case and then runs downwards until `break`: fall-through. `default` may be anywhere.", "`a ? b : c` evaluates only the chosen side, and its result has one common type."] },
  ],
  blocks: [
    { type: "figure", id: "c4-f1", caption: "The ladder is tested from the top. For marks = 72 the first true test is the second one, so the rest are skipped.", alt: "A table of the four tests of the grade ladder for marks 72 and which one is the first true.", fig: { kind: "trace", title: "marks = 72", cols: ["Test", "Is it true?", "What happens"], rows: [{ cells: ["marks >= 90", "false", "go on"] }, { cells: ["marks >= 70", "true", "print B, leave the ladder"], tone: "ok" }, { cells: ["marks >= 40", "not tested", "skipped"], tone: "dim" }, { cells: ["else", "not tested", "skipped"], tone: "dim" }] } },
    { type: "figure", id: "c4-f2", caption: "The else pairs with the nearest if above it, which is if (b), whatever the indentation says.", alt: "A table of a and b values and what the nested if prints.", fig: { kind: "trace", title: "if (a) if (b) x; else y;", cols: ["a", "b", "outer if (a)", "inner if (b)", "prints"], rows: [{ cells: [1, 0, "true: go in", "false: else runs", "y"], tone: "ok" }, { cells: [1, 1, "true: go in", "true", "x"] }, { cells: [0, 0, "false: skip all", "not reached", "nothing"] }] } },
    { type: "figure", id: "c4-f3", caption: "With x = 2 the switch jumps in at case 2 and runs downwards until the break. Case 1 and default are never run.", alt: "Four frames: skipped case 1, case 2 adds 2, case 3 adds 3 and breaks, default skipped.", fig: { kind: "frames", title: "switch (x) with x = 2", frames: [
      { caption: "x is 2, so the switch jumps straight to case 2. Case 1 is skipped. s = 0.", fig: { kind: "strip", items: [{ label: "case 1", sub: "skipped", state: "todo" }, { label: "case 2", sub: "s = 0", state: "now" }, { label: "case 3", sub: "next", state: "todo" }, { label: "break", state: "todo" }, { label: "default", sub: "skipped", state: "todo" }] } },
      { caption: "case 2: s += 2, so s = 2. There is no break, so execution falls on.", fig: { kind: "strip", items: [{ label: "case 1", sub: "skipped", state: "todo" }, { label: "case 2", sub: "s = 2", state: "done" }, { label: "case 3", sub: "next", state: "now" }, { label: "break", state: "todo" }, { label: "default", sub: "skipped", state: "todo" }] } },
      { caption: "case 3: s += 3, so s = 5. Then the break is reached.", fig: { kind: "strip", items: [{ label: "case 1", sub: "skipped", state: "todo" }, { label: "case 2", sub: "s = 2", state: "done" }, { label: "case 3", sub: "s = 5", state: "done" }, { label: "break", state: "now" }, { label: "default", sub: "skipped", state: "todo" }] } },
      { caption: "The break leaves the switch. default never ran. s = 5 is printed.", fig: { kind: "strip", items: [{ label: "case 1", sub: "skipped", state: "todo" }, { label: "case 2", sub: "s = 2", state: "done" }, { label: "case 3", sub: "s = 5", state: "done" }, { label: "break", sub: "left", state: "done" }, { label: "default", sub: "skipped", state: "todo" }] } },
    ] } },

    { type: "example", id: "c4-e1", level: "gate", title: "Trace a switch with fall-through", file: "switch_trace.c", given: `#include <stdio.h>

int main(void) {
    int x = 2, s = 0;
    switch (x) {
        case 1: s += 1;
        case 2: s += 2;
        case 3: s += 3; break;
        default: s += 10;
    }
    printf("%d", s);
    return 0;
}`, find: "The output.", steps: [
      { say: "x is 2, so the switch jumps to case 2. Case 1 is not run.", result: "start at case 2" },
      { say: "case 2: s += 2.", result: "s = 2" },
      { say: "No break, so it falls into case 3: s += 3, then break.", result: "s = 5" },
      { say: "default is below the break and is never reached.", result: "5" },
    ], answer: "5", check: "The program was compiled and run." },
    { type: "example", id: "c4-e2", level: "edge", title: "The dangling else", file: "dangling_trace.c", given: `#include <stdio.h>

int main(void) {
    int a = 1, b = 0;
    if (a)
        if (b)
            printf("x");
        else
            printf("y");
    return 0;
}`, find: "What is printed?", steps: [
      { say: "The else pairs with the nearest unmatched if, which is if (b).", result: "else belongs to (b)" },
      { say: "a is 1, so the outer if lets us in. b is 0, so the inner test is false and its else runs.", result: "y" },
    ], answer: "y", check: "The program was compiled and run." },
    { type: "example", id: "c4-e3", level: "gate", title: "A mistake in the condition", file: "condition_trace.c", given: `#include <stdio.h>

int main(void) {
    int x = 0;
    if (x = 5)
        printf("yes");
    printf(" %d", x);
    return 0;
}`, find: "What is printed?", steps: [
      { say: "x = 5 is an assignment, not a comparison. It stores 5 in x.", result: "x = 5" },
      { say: "The value of the assignment is 5, which is non-zero, so the condition is true.", result: "prints yes" },
      { say: "Then the last printf prints the new value of x.", result: "yes 5" },
    ], answer: "yes 5", check: "The program was compiled and run." },

    { type: "trap", wrong: "Writing the broader test first in an else-if ladder is fine.", tempting: "All the tests look correct and each branch seems to be reachable.", whyWrong: "The first true test wins and the rest are skipped, so a broad test placed first catches every value and the later branches never run.", rule: "Put the most specific test first.", ex: { code: "int m = 80;\nif (m >= 40) printf(\"pass\");\nelse if (m >= 75) printf(\"dist\");", out: "pass", text: "80 is a distinction, but the first test already succeeded." } },
    { type: "trap", wrong: "if (x = 5) tests whether x equals 5.", tempting: "It reads like the question 'is x five?'.", whyWrong: "A single = stores 5 in x, and then the 5 is tested; it is non-zero, so the condition is always true, and x has changed.", rule: "Compare with ==. Use = only to store.", ex: { code: "int x = 0;\nif (x = 5) printf(\"yes\");\nprintf(\" %d\", x);", out: "yes 5" } },
    { type: "trap", wrong: "if (x > 3); printf(\"big\"); prints big only when x is more than 3.", tempting: "The printf is on the next line, indented under the if.", whyWrong: "The semicolon after the condition is an empty statement and becomes the whole body of the if. The printf is a separate statement that always runs.", rule: "No semicolon after the closing bracket of an if.", ex: { code: "int x = 1;\nif (x > 3);\nprintf(\"always\");", out: "always" } },
    { type: "trap", wrong: "A switch runs only the matching case.", tempting: "Each case is written like a separate branch.", whyWrong: "A switch jumps to the matching case and then keeps running every statement below it until a break or the end. Forgetting break makes the following cases run too.", rule: "Without a break, execution falls through.", ex: { code: "int i = 2;\nswitch (i) {\n  case 1: printf(\"a\");\n  case 2: printf(\"b\");\n  case 3: printf(\"c\");\n  default: printf(\"d\");\n}", out: "bcd" } },
    { type: "trap", wrong: "1 ? 2 : 3.0 gives the integer 2.", tempting: "The condition is true, so the first value is chosen as it is.", whyWrong: "The result of ?: has one type for both branches. An int and a double are converted to double, so the value is 2.0.", rule: "Both branches of ?: are converted to a common type.", ex: { code: "printf(\"%f\", 1 ? 2 : 3.0);", out: "2.000000" } },
    { type: "gate", text: "Decisions are tested inside output questions rather than on their own. Three patterns recur: a switch with missing breaks (fall-through), nested ifs with an else that is easy to pair wrongly, and a condition that contains a side effect or an assignment. The loop questions of the next chapter often wrap one of these inside a for or while." },
    { type: "recall", cards: [
      { q: "What counts as true in C?", a: "Any non-zero value. Zero is false." },
      { q: "Which branch of an else-if ladder runs?", a: "The first one whose test is true; the rest are skipped." },
      { q: "Which if does an else belong to?", a: "The nearest unmatched if above it." },
      { q: "What does if (x = 5) do?", a: "Stores 5 in x and tests 5: always true." },
      { q: "What does a semicolon after if (cond) do?", a: "It becomes the empty body, so the next line is not controlled." },
      { q: "What is fall-through?", a: "A switch runs on into the following cases until a break." },
      { q: "Can default be in the middle of a switch?", a: "Yes. Execution lands there when nothing matches and continues downwards." },
      { q: "Which expression types can a switch use?", a: "Integers and characters, with constant case labels." },
      { q: "What type does 1 ? 2 : 3.0 have?", a: "double." },
    ] },
    { type: "check", questions: [
      { id: "d1", kind: "NAT", marks: 1, q: "int x = 1, s = 0; switch (x) { case 1: s += 1; case 2: s += 2; case 3: s += 3; break; default: s += 10; } What is s?", answer: "6", solution: "Jump to case 1, fall through case 2 and 3 until break: 1 + 2 + 3." },
      { id: "d2", kind: "NAT", marks: 1, q: "int x = 4, s = 0; switch (x) { case 1: s += 1; case 2: s += 2; case 3: s += 3; break; default: s += 10; } What is s?", answer: "10", solution: "No case matches, so default runs." },
      { id: "d3", kind: "NAT", marks: 1, q: "int x = 0; if (x = 5) x = x + 1; What is x?", answer: "6", solution: "x = 5 is true and stores 5; then x becomes 6." },
      { id: "d4", kind: "MCQ", marks: 1, q: "int a = 1, b = 1; if (a) if (b) printf(\"x\"); else printf(\"y\"); What is printed?", options: ["x", "y", "xy", "nothing"], answer: "A", solution: "The else belongs to if (b); b is true, so x is printed." },
      { id: "d5", kind: "NAT", marks: 1, q: "int x = 1; if (x > 3); x = x + 10; What is x?", answer: "11", solution: "The if has an empty body; x = x + 10 always runs." },
      { id: "d6", kind: "NAT", marks: 2, q: "int i = 2; switch (i) { case 1: printf(\"a\"); case 2: printf(\"b\"); case 3: printf(\"c\"); default: printf(\"d\"); } How many characters are printed?", answer: "3", solution: "It prints bcd: three characters." },
      { id: "d7", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["A switch may use a double as its expression", "default can appear before other cases", "An else pairs with the nearest unmatched if", "In a ladder, the later true tests also run"], answer: "B, C", solution: "A is false (integers only); D is false (only the first true branch runs)." },
      { id: "d8", kind: "NAT", marks: 2, q: "int a = 3, b = 8; printf(\"%d\", a > b ? a : b); What is printed?", answer: "8", solution: "a > b is false, so b is chosen." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on C programs", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: loops", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Operators and expressions (C3)"], usedIn: ["Loops (C5)", "Functions (C6)"], cross: ["Digital Logic: conditions"] },
  ],
};
