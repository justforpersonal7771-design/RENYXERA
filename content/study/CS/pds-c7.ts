import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 7 "Scope, lifetime and storage classes" (28 Nov 2026). Real GATE questions explained in full: 2026_FN_Q34 (shadowing), 2023_FN_Q35 (static local),
 * 2019_FN_Q52 (static counter in a for loop), 2017_FN_Q43 (static count, bits), 2017_AN_Q17 (matching storage terms; a match question, no program).
 * Every program was compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC7: Topic = {
  id: "cs.pds.c.storage7",
  title: "Scope, lifetime and storage classes",
  no: "7",
  book: [
    { t: "p", text: "Two questions can be asked about every variable: **where can its name be used**, and **how long does its box exist**? The first is its **scope**, the second its **lifetime**. They are different, and mixing them up is the root of most wrong answers in this chapter. A third idea, the **storage class**, is the keyword (`auto`, `static`, `register`, `extern`) that changes them." },
    { t: "p", text: "These ideas decide, for example, whether a local counter starts again at 0 each time its function is called, or remembers its value. Five real GATE questions have been built on them, and all are explained in full here." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["say where a name can be used, and which of two variables with the same name an expression refers to;", "give the lifetime and the starting value of an automatic, a static and a global variable;", "predict what a function with a `static` local remembers from call to call;", "explain `extern` and `register` in a sentence each;", "place each kind of variable in the right region of the memory map."] },

    { t: "h2", text: "Scope: where a name can be used" },
    { t: "h3", text: "Block, function and file scope" },
    { t: "p", text: "A name is usable from its declaration to the end of the **block** in which it is declared: the nearest pair of braces `{ }`. A variable declared inside a function is local to it. A variable declared outside every function is **global** (file scope) and can be used in every function below it." },
    { t: "p", text: "The variable in a `for` loop header, as in `for (int i = 0; …)`, belongs to the loop: it cannot be used after it." },
    { t: "h3", text: "Shadowing" },
    { t: "p", text: "A name may be declared again in an inner block. Inside that block the new variable **hides**, or shadows, the outer one with the same name; the outer one still exists, but cannot be reached by that name until the block ends. This is the rule behind the 2026 question below." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int i = 1;
    {
        int i = 2;            /* a new box that hides the first */
        printf("%d", i);
    }
    printf("%d\\n", i);        /* the block has ended: the first box again */
    return 0;
}`, out: "21", file: "shadowing.c" },
    { t: "p", text: "The same applies to a global variable and a local one of the same name: inside the function, the local one wins." },
    { t: "code", text: `#include <stdio.h>

int gx = 10;                   /* global */

void shadow(void) {
    int gx = 20;               /* local: hides the global inside this function */
    printf("%d ", gx);
}

int main(void) {
    shadow();
    printf("%d\\n", gx);       /* here the global is visible */
    return 0;
}`, out: "20 10", file: "global_shadow.c" },
    { t: "callout", kind: "shortcut", text: "To find which variable a name means, look outwards from the use: the nearest enclosing block that declares the name wins. A name declared in an inner block never affects the outer one." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Lifetime: how long the box exists" },
    { t: "p", text: "The **lifetime** of a variable is the time its box exists in memory. An **automatic** variable (an ordinary local) is created when its block is entered and destroyed when the block is left; each call to a function makes new ones. A **static** or **global** variable exists for the whole run of the program." },
    { t: "table", head: ["Variable", "Created", "Destroyed", "Value at start"], rows: [["ordinary local (`auto`)", "each time its block is entered", "when the block is left", "rubbish (undefined)"], ["`static` local", "once, before the program runs", "when the program ends", "0 unless you give a value"], ["global", "once, before the program runs", "when the program ends", "0 unless you give a value"]] },
    { t: "callout", kind: "key", text: "Scope is about **where the name works**. Lifetime is about **when the box exists**. A `static` local has the scope of its block but the lifetime of the whole program." },
    { t: "p", text: "A static variable is initialised **once**, not on every call. The line `static int n = 0;` is not an assignment that runs each time; it only sets the starting value when the program begins." },
    { t: "trap", i: 1 },
    { t: "trap", i: 3 },

    { t: "h2", text: "Storage classes" },
    { t: "h3", text: "auto and register" },
    { t: "p", text: "`auto` is the default for a local variable and is almost never written. `register` is a request to the compiler to keep the variable in a CPU register for speed. It is only a hint, which the compiler may ignore, and a register variable has **no address**: you may not apply `&` to it." },
    { t: "h3", text: "static" },
    { t: "p", text: "`static` has two uses. Inside a function it makes the variable keep its value between calls (a static local). Outside a function, it hides the name from other files, so that only this file can use it. In both cases the variable lives for the whole program." },
    { t: "fig", id: "c7-f1" },
    { t: "code", text: `#include <stdio.h>

int counter(void) {
    static int n = 0;       /* set once, before main runs */
    n++;
    return n;
}

int main(void) {
    printf("%d ", counter());
    printf("%d ", counter());
    printf("%d\\n", counter());
    return 0;
}`, out: "1 2 3", file: "static_counter.c" },
    { t: "callout", kind: "tip", text: "To trace a function with a static local, keep a table with a column for the static variable. Its value carries over from one row (call) to the next; an ordinary local starts fresh every time." },
    { t: "h3", text: "extern" },
    { t: "p", text: "`extern` says that a variable is declared somewhere else, usually in another file: this line does not make a box, it only tells the compiler the name and type so that it can be used here. A program may declare a global many times with `extern`, but define it (create its box) only once." },
    { t: "trap", i: 2 },

    { t: "h2", text: "The memory map" },
    { t: "p", text: "A running program's memory is divided into regions, and the storage class decides which region a variable lives in. The **code** (or text) region holds the instructions. The **data** region holds initialised globals and statics, and the **BSS** holds those without an initial value (set to zero). The **heap** is for memory you ask for while running (chapter 15). The **stack** holds the frames of function calls, with their local variables." },
    { t: "fig", id: "c7-f2" },
    { t: "p", text: "This is why `static char var;` is a variable located in the **data** section: a static lives for the whole run, so it cannot be on the stack, where boxes appear and disappear with calls." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2026 (forenoon), Q34: shadowing" },
    { t: "p", text: "A one-mark numerical question. A function declares a variable with the **same name as its own parameter**, in an inner block, and the question asks which one is printed afterwards." },
    { t: "ex", id: "c7-e1" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Scope. The parameter `i` belongs to the whole function. Inside the `if` block, `int i = 0;` creates a new variable that hides it, and everything in the block, the `while` loop and its `i++`, changes only that inner `i`. When the block ends, the inner `i` is gone and the name means the parameter again, which was never changed: 9. The variable `j` is the function's and is changed, but it is not printed." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Answering 10, thinking the loop's `i++` changed the parameter.", "Answering 0, by thinking the new declaration replaced the parameter.", "Forgetting that the `printf` is **after** the closing brace of the `if`, where the inner `i` no longer exists."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["`printf` moved inside the `if` block, after the `while`", "the inner i has been counted up to 10", "10"], ["`int i = 0;` removed from the block", "now the loop changes the parameter: it runs from 9 to 10", "10"], ["`func(11, 10)`", "the test `i < j` is false, so the block is skipped", "11"]], caption: "Work out each from the scope rule." },

    { t: "h3", text: "GATE 2023 (forenoon), Q35: a static local" },
    { t: "p", text: "A one-mark numerical question with one function that remembers its value." },
    { t: "ex", id: "c7-e2" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "That `static int x = 1;` is initialised once and keeps its value between calls, and that the `x` in `main` is another variable. First call: x becomes 2 and 2 is returned, stored in main's x. Second call: x becomes 3, and `3 + 2` is stored in y: 5. The answer is x + y = 2 + 5 = 7." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Treating the static as reset to 1 on every call, which would give 2 + 4 = 6.", "Confusing the `x` of `main` with the static `x` of `funcp`.", "Forgetting that the second call's result is added to main's x **after** the call."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["`static` removed", "x is created as rubbish each time (undefined), so no single answer", "undefined"], ["a third call `z = funcp()` added", "the static reaches 4", "z = 4"], ["`static int x = 5;`", "calls return 6 and 7: x = 6, y = 7 + 6 = 13", "19"]], caption: "Keep a column for the static." },

    { t: "h3", text: "GATE 2019 (forenoon), Q52: static in a for loop" },
    { t: "p", text: "A two-mark question. The function `r` returns the old value of a static and then decrements it (`num--`), and `r()` is called in all three parts of a `for` loop and in its body." },
    { t: "ex", id: "c7-e3" },
    { t: "fig", id: "c7-f3" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "A careful sequence of calls, each with a side effect on the static. In `for (r(); r(); r())` the first `r()` is the init, the second the test, the third the update, and the body has its own `r()`. Each call returns the old `num`, then lowers it. The calls return 7 (init), 6 (test, true), 5 (body, printed), 4 (update), 3 (test), 2 (body, printed), 1 (update), 0 (test, false). The program prints 52." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Forgetting that the init part runs once and uses up a value (7).", "Using the **new** value after `num--`; postfix returns the old one.", "Forgetting that the update `r()` also lowers the static, so it takes a value between two body calls."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["`return --num;` (prefix)", "the values returned are 6, 5, 4, ...: test 5 true, body 4 prints, update 3, test 2 true, body 1 prints, update 0, test −1 true …", "never ends"], ["the loop is `for (r(); r(); )` (no update)", "7 (init); test 6 true, body 5; test 4 true, body 3; test 2 true, body 1; test 0 false", "531"]], caption: "The first row is for you to check: each call changes the static." },

    { t: "h3", text: "GATE 2017 (forenoon), Q43: a static count that never resets" },
    { t: "p", text: "A two-mark numerical question. The function counts the 1 bits of a number, but its counter is **static**, so it keeps growing across calls instead of starting from 0." },
    { t: "ex", id: "c7-e4" },
    { t: "fig", id: "c7-f4" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "That the running total of 1 bits is carried from call to call, and that `x` adds the **current** value of `count` each time, not the number of bits of the current i. The numbers 5, 4, 3, 2, 1 have 2, 1, 2, 1, 1 bits, so `count` after each call is 2, 3, 5, 6, 7, and x adds up to 2 + 3 + 5 + 6 + 7 = 23." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Answering 7 (the total number of bits), forgetting that x adds count **every time**.", "Answering 7 for each call (resetting count): 2 + 1 + 2 + 1 + 1 = 7.", "Wrong bit counts: 5 is 101 (two bits), 3 is 11 (two bits)."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["`static` removed from `count`", "count restarts at 0: x = 2 + 1 + 2 + 1 + 1", "7"], ["the loop runs `i = 3, 2, 1`", "count 2, 3, 4: 2 + 3 + 4", "9"]], caption: "Both follow from the same carry-over rule." },

    { t: "h3", text: "GATE 2017 (afternoon), Q17: match the terms" },
    { t: "p", text: "A one-mark matching question with no program. It checks that you know the meaning of four pieces of C, using the ideas of this chapter." },
    { t: "ex", id: "c7-e5" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Four short facts: a `static` variable lives in the data section; if you overwrite the only pointer to malloc'd memory, the memory is lost (a leak, chapter 15); an array of pointers is a sequence of addresses; and `register` asks for a CPU register. The correct matching is option A." },
    { t: "callout", kind: "tip", text: "For a matching question, do the pairs you are sure of first, and cross out every option that has a wrong pair. Here `static char var` ↔ data section (ii) rules out option D immediately." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Scope is where a name can be used (from its declaration to the end of its block); an inner declaration hides an outer one with the same name.", "Lifetime is how long the box exists: an automatic variable per block entry, a static or global for the whole run.", "A static local is initialised once and keeps its value between calls; a global or static without a value starts at 0, an automatic one has rubbish.", "`register` is a hint and gives no address; `extern` only declares a name defined elsewhere.", "Code, data/BSS (globals and statics), heap and stack are the regions of memory; locals live on the stack, statics in the data region."] },
  ],
  blocks: [
    { type: "figure", id: "c7-f1", caption: "A function with a static local, called three times. The static n keeps its value; a plain local would start at 0 each time.", alt: "A table of three calls to counter, the static n before and after, and the value returned.", fig: { kind: "trace", title: "static int n = 0; n++; return n;", cols: ["Call", "n before", "n after", "Returned"], rows: [{ cells: [1, 0, 1, 1], changed: [2] }, { cells: [2, 1, 2, 2], changed: [2] }, { cells: [3, 2, 3, 3], changed: [2], tone: "ok" }] } },
    { type: "figure", id: "c7-f2", caption: "The regions of a running program and what each holds. Locals live on the stack; globals and statics live in the data region.", alt: "A table of code, data, BSS, heap and stack with what each holds and how long it lasts.", fig: { kind: "matrix", title: "The memory map", cols: ["Holds", "Lifetime"], rows: [{ label: "Code (text)", cells: ["the instructions", "whole run"] }, { label: "Data", cells: ["globals and statics with a value", "whole run"], hl: true }, { label: "BSS", cells: ["globals and statics without a value (zero)", "whole run"], hl: true }, { label: "Heap", cells: ["memory from malloc (chapter 15)", "until free"] }, { label: "Stack", cells: ["frames: parameters and locals", "one call"] }] } },
    { type: "figure", id: "c7-f3", caption: "GATE 2019 FN Q52: every call to r() returns the old num and then lowers it. Only the body's call prints.", alt: "A table of the calls to r in order, the value returned and what the loop does with it.", fig: { kind: "trace", title: "for (r(); r(); r()) printf(\"%d\", r());", cols: ["Part of the loop", "r() returns", "num after", "Effect"], rows: [{ cells: ["init", 7, 6, ""] }, { cells: ["test", 6, 5, "true"] }, { cells: ["body", 5, 4, "prints 5"], tone: "hl" }, { cells: ["update", 4, 3, ""] }, { cells: ["test", 3, 2, "true"] }, { cells: ["body", 2, 1, "prints 2"], tone: "hl" }, { cells: ["update", 1, 0, ""] }, { cells: ["test", 0, -1, "false: loop ends"], tone: "ok" }] } },
    { type: "figure", id: "c7-f4", caption: "GATE 2017 FN Q43: count is static, so it carries on growing; x adds its current value after each call.", alt: "A table of i, the bits of i, count after the call, and the running x.", fig: { kind: "trace", title: "x = x + total(i), i = 5, 4, 3, 2, 1", cols: ["i", "binary", "bits set", "count after the call", "x"], rows: [{ cells: [5, "101", 2, 2, 2] }, { cells: [4, "100", 1, 3, 5] }, { cells: [3, "011", 2, 5, 10] }, { cells: [2, "010", 1, 6, 16] }, { cells: [1, "001", 1, 7, 23], tone: "ok" }] } },

    { type: "example", id: "c7-e1", level: "gate", title: "GATE CS 2026 (forenoon), Q34 · 1 mark · NAT", file: "gate2026_q34.c", given: `#include <stdio.h>

void func(int i, int j) {
    if(i < j) {
        int i = 0;
        while (i < 10) {
            j += 2;
            i++;
        }
    }
    printf("%d", i);
}

int main() {
    int i = 9, j = 10;
    func(i, j);
    return 0;
}`, find: "The output.", steps: [
      { say: "func gets i = 9 and j = 10. The test 9 < 10 is true, so the block runs.", result: "enter the block" },
      { say: "Inside the block, int i = 0 creates a new variable that hides the parameter. The loop changes this inner i (0 to 10) and j.", result: "inner i = 10" },
      { say: "The block ends: the inner i is destroyed. The name i now means the parameter again, still 9.", result: "i = 9" },
    ], answer: "9", check: "Official answer 9. The program was compiled and run." },
    { type: "example", id: "c7-e2", level: "gate", title: "GATE CS 2023 (forenoon), Q35 · 1 mark · NAT", file: "gate2023_q35.c", given: `#include<stdio.h>

int funcp( ) {
    static int x = 1;
    x++;
    return x;
}

int main( ) {
    int x, y;
    x = funcp( );
    y = funcp( ) + x;
    printf("%d\\n", (x + y));
    return 0;
}`, find: "The integer value printed.", steps: [
      { say: "First call: the static x (1) becomes 2 and 2 is returned. main's x = 2.", result: "x = 2" },
      { say: "Second call: the static x is still 2, so it becomes 3 and 3 is returned. y = 3 + 2 = 5.", result: "y = 5" },
      { say: "x + y.", result: "7" },
    ], answer: "7", check: "Official answer 7. The program was compiled and run." },
    { type: "example", id: "c7-e3", level: "gate", title: "GATE CS 2019 (forenoon), Q52 · 2 marks · MCQ", file: "gate2019_q52.c", given: `#include<stdio.h>

int r( )
{
    static int num = 7;
    return num--;
}

int main( )
{
    for ( r( ); r( ); r( ) )
        printf("%d", r( ) );
    return 0;
}`, find: "The values displayed. Options: (A) 41  (B) 52  (C) 63  (D) 630", steps: [
      { say: "The init r() returns 7, leaving num = 6.", result: "num = 6" },
      { say: "Test r() returns 6 (true), num = 5. Body r() returns 5, num = 4: prints 5.", result: "prints 5" },
      { say: "Update r() returns 4, num = 3. Test r() returns 3 (true), num = 2. Body r() returns 2, num = 1: prints 2.", result: "prints 2" },
      { say: "Update r() returns 1, num = 0. Test r() returns 0: false. The loop ends.", result: "52" },
    ], answer: "(B) 52", check: "Official answer (B). The program was compiled and run." },
    { type: "example", id: "c7-e4", level: "gate", title: "GATE CS 2017 (forenoon), Q43 · 2 marks · NAT", file: "gate2017_q43.c", given: `#include <stdio.h>

int total (int v) {
    static int count = 0;
    while (v) {
        count += v & 1;
        v >>= 1;
    }
    return count;
}

void main ( ) {
    static int x = 0;
    int i = 5;
    for (; i > 0; i--) {
        x = x + total (i);
    }
    printf ("%d\\n", x);
}`, find: "The output.", steps: [
      { say: "total(5): 5 = 101 has two 1 bits, so count = 2. x = 2.", result: "x = 2" },
      { say: "total(4): 100 has one, count = 3 (it was not reset). x = 2 + 3.", result: "x = 5" },
      { say: "total(3): 11 has two, count = 5. x = 5 + 5 = 10. total(2): count = 6, x = 16.", result: "x = 16" },
      { say: "total(1): one more, count = 7. x = 16 + 7.", result: "23" },
    ], answer: "23", check: "Official answer 23. The program was compiled and run." },
    { type: "example", id: "c7-e5", level: "easy", title: "GATE CS 2017 (afternoon), Q17 · 1 mark · match", file: "gate2017_q17.txt", given: `Match the following:
(P) static char var;
(Q) m = malloc(10); m = NULL;
(R) char *ptr[10];
(S) register int var1;

(i)   Sequence of memory locations to store addresses
(ii)  A variable located in data section of memory
(iii) Request to allocate a CPU register to store data
(iv)  A lost memory which cannot be freed

(A) P-ii, Q-iv, R-i, S-iii    (B) P-ii, Q-i, R-iv, S-iii
(C) P-ii, Q-iv, R-iii, S-i    (D) P-iii, Q-iv, R-i, S-ii`, find: "The correct matching.", steps: [
      { say: "P: a static variable lives for the whole run, so it is in the data section.", result: "P - ii" },
      { say: "Q: m is the only pointer to the malloc'd block; setting it to NULL loses the block, which can no longer be freed.", result: "Q - iv" },
      { say: "R: char *ptr[10] is an array of ten pointers: a sequence of addresses.", result: "R - i" },
      { say: "S: register asks for a CPU register.", result: "S - iii" },
    ], answer: "(A)", check: "Official answer (A)." },

    { type: "trap", wrong: "A variable declared in an inner block changes the outer variable of the same name.", tempting: "They have the same name, so they look like the same thing.", whyWrong: "The inner declaration creates a new box that hides the outer one. Changes inside the block go to the new box. When the block ends it vanishes and the outer one is as before.", rule: "Same name, different box: look for the nearest declaration.", ex: { code: "int i = 1;\n{\n    int i = 2;\n    printf(\"%d\", i);\n}\nprintf(\"%d\", i);", out: "21" } },
    { type: "trap", wrong: "A static local is reset to its initial value each time the function is called.", tempting: "The line static int n = 0; looks like an assignment that runs every time.", whyWrong: "A static is initialised only once, before the program runs. The value then carries from call to call.", rule: "Static: initialised once, remembered between calls.", ex: { code: "int counter(void) { static int n = 0; n++; return n; }\n/* three calls, in three statements */", out: "1 2 3", text: "A plain local `int n = 0;` would return 1 every time." } },
    { type: "trap", wrong: "extern int x; creates a variable x.", tempting: "It looks like a declaration, like int x;.", whyWrong: "extern only announces that x is defined elsewhere; it makes no box. If no other file defines x, the linker fails.", rule: "extern declares; the definition creates the box.", ex: { text: "File a.c has `int x = 5;` (the definition). File b.c has `extern int x;` and can then use x, which is the same box. If both files wrote `int x = 5;`, there would be two definitions and the linker would report an error." } },
    { type: "trap", wrong: "A local variable that is not initialised starts at 0.", tempting: "Globals and statics start at 0, so locals seem to as well.", whyWrong: "Only globals and statics are set to 0. An ordinary local holds whatever the stack had before: rubbish. Using it before giving it a value is undefined behaviour.", rule: "Initialise every local before you read it.", ex: { code: "static int s;\nprintf(\"%d\", s);", out: "0", text: "The same declaration without static, inside a function, would print an unpredictable number." } },
    { type: "gate", text: "Five questions have been asked: shadowing a parameter in a block (2026 FN Q34, 1 mark), a static local across two calls (2023 FN Q35, 1 mark), a static in a for loop with a side effect (2019 FN Q52, 2 marks), a static count carried across calls (2017 FN Q43, 2 marks), and a matching question on data section, memory leak, arrays of pointers and register (2017 AN Q17, 1 mark). All five are worked above." },
    { type: "recall", cards: [
      { q: "What is the scope of a local variable?", a: "From its declaration to the end of its block." },
      { q: "What does an inner declaration of the same name do?", a: "It hides the outer variable inside the block; the outer one is untouched." },
      { q: "What is the lifetime of an automatic variable?", a: "From entering its block to leaving it." },
      { q: "What is the lifetime of a static or global variable?", a: "The whole run of the program." },
      { q: "How many times is a static local initialised?", a: "Once, before the program runs." },
      { q: "What do globals and statics without a value start as?", a: "Zero." },
      { q: "What does register give you?", a: "A hint for the compiler; the variable has no address." },
      { q: "What does extern do?", a: "Declares a variable defined elsewhere; makes no box." },
      { q: "In which region is a static variable?", a: "The data region (BSS if it has no value)." },
      { q: "What does num-- return?", a: "The old value; then num is lowered." },
    ] },
    { type: "check", questions: [
      { id: "s1", kind: "NAT", marks: 1, q: "int i = 1; { int i = 2; } What is i after the block?", answer: "1", solution: "The block's i is a different variable." },
      { id: "s2", kind: "NAT", marks: 1, q: "int counter(void) { static int n = 0; n++; return n; }  What does the third call of counter() return?", answer: "3", solution: "The static keeps its value: 1, 2, 3." },
      { id: "s3", kind: "NAT", marks: 1, q: "static int s; printf(\"%d\", s); What is printed?", answer: "0", solution: "Statics start at 0." },
      { id: "s4", kind: "MCQ", marks: 1, q: "Where is a static local variable stored?", options: ["The stack", "The data region", "The heap", "A CPU register"], answer: "B", solution: "It lives for the whole run, so it is in the data region." },
      { id: "s5", kind: "NAT", marks: 2, q: "int funcp(){ static int x = 1; x++; return x; }  int x = funcp(); int y = funcp() + x; What is x + y?", answer: "7", solution: "x = 2, then funcp() = 3, so y = 5; 2 + 5 = 7." },
      { id: "s6", kind: "NAT", marks: 2, q: "int r(){ static int num = 7; return num--; }  What does the 4th call of r() return?", answer: "4", solution: "The calls return 7, 6, 5, 4." },
      { id: "s7", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["A register variable has no address", "A static local is initialised on every call", "An inner declaration hides an outer one of the same name", "extern int x; creates the box for x"], answer: "A, C", solution: "B is false (once); D is false (declares only)." },
      { id: "s8", kind: "NAT", marks: 2, q: "int total(int v){ static int count = 0; while (v) { count += v & 1; v >>= 1; } return count; }  What is total(3) + total(1)?", answer: "5", solution: "total(3): 3 = 11 has two bits, so count = 2 and it returns 2. total(1): one more, count = 3, returns 3. 2 + 3 = 5." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on storage classes", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: parameter passing and scope rules", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Functions (C6)"], usedIn: ["Recursion (C8)", "Pointers I (C10)", "Dynamic memory (C15)"], cross: ["Operating systems: process memory layout", "Compiler design: storage allocation"] },
  ],
};
