import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 20 "The output-prediction method and undefined behaviour" (28 Nov 2026). A skills chapter, with no tagged GATE question of its own; every real question
 * of chapters 1 to 19 uses its method, and it points back to them. Every program was compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC20: Topic = {
  id: "cs.pds.c.method20",
  title: "The output-prediction method and undefined behaviour",
  no: "20",
  book: [
    { t: "p", text: "Nineteen chapters have given you the rules of C. This one is about **using them under exam conditions**: reading a program you have never seen and writing down its exact output, with only paper. The skill is a method, not a trick, and it is the same method every time. It also teaches the one thing that stops people from writing a confident wrong answer: knowing when C does **not** define the answer." },
    { t: "p", text: "The chapter gives a five-step method, a checklist of the traps that earlier chapters taught, the four levels of 'not defined' in the C standard and what to answer in each, and a few short programs to practise on. Every real question of this book was solved with this method, and the chapter points back to them." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["trace any output question in five steps, with a table;", "run through a checklist of the usual traps before you commit to an answer;", "name the difference between defined, implementation-defined, unspecified and undefined behaviour;", "say, for a given piece of code, whether there is a single correct output;", "choose the right answer when a question lists 'undefined' or 'compile error' as an option."] },

    { t: "h2", text: "The method" },
    { t: "p", text: "**Step 1: set up the boxes.** Write every variable on your paper with its type and starting value. For an array, write the cells with indexes. For a pointer, draw the arrow. Do this before you read any statement. **Step 2: note the types.** Next to anything with a `char`, an `unsigned`, a `float` or a pointer, write the type: most wrong answers are a type that was ignored. **Step 3: execute line by line.** One new row of the table for every statement, in the order C runs them, never skipping and never running two at once. **Step 4: apply the checklist** below to each row. **Step 5: read the answer off the last row,** and format it exactly: spaces, newlines and the format letter." },
    { t: "callout", kind: "key", text: "Boxes first, then types, then one row per statement. The answer is the last row, written exactly as `printf` would write it." },
    { t: "fig", id: "c20-f1" },
    { t: "p", text: "After the table is finished, check it with a **second, smaller input** of the same shape. If the function reverses a number, try 12; if it counts something in an array, try an array of three. If the small case does not agree with your reading of the code, the reading is wrong, whatever the big case suggests." },
    { t: "p", text: "The table is not decoration. It is the only way to stay correct when a statement has two effects (`x = x++`, `*p++`, `a[i++] = i`) or when a loop runs many times. If you cannot write a row for a statement, you do not yet understand it." },
    { t: "callout", kind: "tip", text: "Use a pencil and a fresh table for each question. If the answer surprises you, redo the table from the top: a surprise is usually a skipped row." },

    { t: "h2", text: "The checklist of traps" },
    { t: "p", text: "Before you commit, run down this list. Each entry is a chapter's central warning, and each has cost marks in real papers." },
    { t: "table", head: ["Ask yourself", "Chapter", "Example"], rows: [["Is anything `unsigned` or the result of `strlen` / `sizeof`?", "2", "`strlen(s) - strlen(t)` is never negative"], ["Is it integer division, or does a cast change the order?", "2", "`7 / 2` is 3; `(float)7 / 2` is 3.5"], ["Does an operator have a lower precedence than I think (`==` against `&`)?", "3", "`x & 1 == 0` is `x & (1 == 0)`"], ["Is `i++` or `++i` used, and what is its value?", "3", "postfix gives the old value"], ["Is the right side of `&&` or `||` skipped?", "3", "`0 && i++` never runs `i++`"], ["Is there a `;` after an `if`, a missing `break`, or an `=` for `==`?", "4", "fall-through; `if (x = 5)`"], ["Which loop variable is tested, and does it end?", "5", "`a = a / 12 + 1` never ends"], ["Does a function change a copy, or the original?", "6, 10", "call by value"], ["Is a variable `static`, global, or shadowed?", "7", "`static` keeps its value"], ["Does the recursion have a reachable base case; is the print before or after the call?", "8", "4321 against 1234"], ["Is the array index in range; what is the layout of a 2-D array?", "9", "`arr[1][9]`: row-major"], ["Is a pointer moved, or the pointee changed (`*p++` against `(*p)++`)?", "10, 11", "pointer difference is in elements"], ["Does a string have its null; does a copy loop copy it?", "12", "`Hello World!d!`"], ["Is there padding in a structure?", "14", "`char, int, char` is 12 bytes"], ["Is anything leaked, freed twice or never set?", "15", "the last `next` of a list"], ["Is the macro expanded as text, with side effects repeated?", "16", "`SQ(1 + 2)` is 5"]], caption: "Run this list on every question. Most of the marks lost in this subject come from one of these rows." },

    { t: "h2", text: "Four levels of 'not defined'" },
    { t: "p", text: "The C standard does not say what every program does. It separates four situations, and the right response to a question depends on which one you are in." },
    { t: "table", head: ["Level", "Meaning", "Example", "What to answer"], rows: [["**Defined**", "the standard gives exactly one result", "`7 / 2` is 3; unsigned wraparound", "that result"], ["**Implementation-defined**", "each compiler chooses, and must document it", "the size of `int`; whether `char` is signed; `-17 >> 2`", "the value the question states or assumes; otherwise say what you assume"], ["**Unspecified**", "several results are allowed, and the compiler need not say which", "the order of evaluating function arguments", "the order the question states; if none, no single answer"], ["**Undefined**", "the standard promises nothing: anything may happen", "signed overflow; `a[10]` for `a[5]`; `i = i++ + ++i`; using freed memory; NULL dereference", "no single output; choose 'undefined' if offered"]] },
    { t: "fig", id: "c20-f2" },
    { t: "p", text: "The table of four levels is also a guide to time. A question about defined behaviour deserves a careful trace. A question that is plainly undefined deserves a quick check of the options for 'undefined' and no long calculation, because no calculation can produce an answer. Learn to recognise undefined code at a glance, and you save the time for the questions that need it." },
    { t: "p", text: "Undefined behaviour is the dangerous one. It does not mean 'crashes'. It means the compiler is allowed to assume it never happens, and the program may do something that looks sensible on your machine and something else on the next. A question whose answer depends on undefined behaviour either states an assumption (\"assume that the program compiles and runs\", or names the compiler order) or lists 'undefined' among the options." },
    { t: "callout", kind: "warning", text: "Never give a single number for an expression that changes a variable twice between sequence points (`i++ + ++i`), reads and writes it without an order (`x = x++`), overflows a signed integer, goes outside an array, uses a freed or NULL pointer, or reads an uninitialised variable." },
    { t: "trap", i: 0 },
    { t: "trap", i: 1 },
    { t: "p", text: "The comma operator is a place where order is guaranteed: in `(a, b)` the left operand is finished first, and the value is that of the right operand. Do not confuse it with the commas that separate function arguments or declarations, which are only punctuation and give no order at all." },

    { t: "h2", text: "Sequence points and order of evaluation" },
    { t: "p", text: "C guarantees an order of evaluation in only a few places: before `&&` and `||` (the left side is finished first), before the `?` of `?:`, after each full statement, and at the comma operator. **Everywhere else** the compiler may work on the parts of an expression in any order. So the arguments of a function call, the two operands of `+`, and the left and right of `=` may be done in any order." },
    { t: "p", text: "The practical rule: between two sequence points, a variable may be **changed at most once**, and if it is changed, it may be read only to work out the new value. `i = i + 1` is fine (the read is for the new value). `i++ + ++i` and `a[i] = i++` are not, and nor is `printf(\"%d %d\", i++, i++)`. The safe way to write such code is as separate statements, which is also the way to **trace** it." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int i = 5;
    int a = i++;          /* first statement: a is 5, i becomes 6 */
    int b = ++i;          /* second: i becomes 7, b is 7 */
    printf("%d %d %d\\n", a, b, i);
    int x = 0, y = 0;
    if (x++ || y++) { }   /* the left side is 0, so y++ runs */
    printf("%d %d\\n", x, y);
    return 0;
}`, out: "5 7 7\n1 1", file: "separate_statements.c" },
    { t: "p", text: "The two statements `a = i++` and `b = ++i` have a defined order, because each is a complete statement. And `x++ || y++` has a defined order because `||` guarantees that its left side is finished first: x++ is 0 (false), so the right side `y++` is evaluated, and both variables end at 1." },

    { t: "h2", text: "Worked examples" },
    { t: "p", text: "Each example below isolates one row of the checklist, so that you can see the method working on a small piece. In a real question several rows are combined, and the table keeps them apart. When you practise, name the row for each statement before you evaluate it." },
    { t: "p", text: "Four short programs, each with a trap from the checklist, solved with the method. Cover the answer, trace each on paper, and then compare." },
    { t: "h3", text: "Example 1: the comparison with sizeof" },
    { t: "p", text: "`sizeof` has an unsigned type (`size_t`), and a comparison between a signed and an unsigned number converts the signed one to unsigned (chapter 2). So `sizeof(int) > -1` compares 4 with 4 294 967 295 (or an even bigger number): false." },
    { t: "ex", id: "c20-e1" },
    { t: "h3", text: "Example 2: short-circuit and side effects" },
    { t: "ex", id: "c20-e2" },
    { t: "h3", text: "Example 3: a full trace on paper" },
    { t: "ex", id: "c20-e3" },
    { t: "callout", kind: "shortcut", text: "If you can name the checklist row a statement belongs to, you already know how to evaluate it. If you cannot, you have found the statement that needs the most care." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "A good strategy for marks is to spend the time where the question is easy to get wrong. A one-mark NAT with a three-line loop is worth a careful table; a two-mark MCQ with four tidy outputs is worth checking against all four options, since the wrong options are exactly the answers of the standard slips." },
    { t: "p", text: "The question styles are the ones that run through this book. **NAT** (numerical answer): trace carefully and write the number. **MCQ with output options**: the wrong options are produced by the standard slips, so do the trace and look for the option that matches, then check why each other option fails. **MSQ**: judge each statement separately. **'Which statement is correct'**, with options such as 'infinite loop', 'compile error', 'undefined behaviour': decide in this order: does it compile? does it end? is there undefined behaviour? what does it print?" },
    { t: "table", head: ["If the question says", "Do this"], rows: [["\"assume the program compiles and runs\"", "ignore syntax slips (a missing semicolon) and answer for the intended code"], ["\"assume parameters are evaluated from right to left\"", "follow it for arguments only; statements still run top to bottom"], ["\"ignore syntax errors\"", "read the code as if corrected"], ["\"assume 4-byte int / 8-byte pointer\"", "use those sizes, whatever your machine has"], ["no assumption, and the code is undefined", "choose the 'undefined' / 'compiler dependent' option if there is one"]], caption: "The assumptions are in the question for a reason; use them exactly." },
    { t: "p", text: "Many of the real questions of this book carry such a note. The recursion question of 2024 (chapter 8) states that arguments are evaluated from right to left; the 2026 recursion questions say 'ignore syntax errors'; the 2017 `strlen` question tells you that `strlen` returns an unsigned type. Read the notes first; they are part of the problem." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Method: set up the boxes, note the types, one table row per statement, apply the checklist, read and format the last row.", "The checklist has one row per chapter: unsigned, integer division, precedence, ++, short-circuit, semicolons and fall-through, loop ends, copies, static, recursion order, array layout, pointer moves, strings, padding, leaks, macros.", "Four levels: defined, implementation-defined (state the assumption), unspecified (use the stated order) and undefined (no single answer).", "Between two sequence points a variable may be changed at most once; separate statements give a defined order.", "Read the assumptions in the question first: they are part of the problem."] },
  ],
  blocks: [
    { type: "figure", id: "c20-f1", caption: "The method applied to a three-line program. One row per statement, one column per variable; the answer is the last row.", alt: "A trace table for int i = 5; int a = i++; int b = ++i; with columns i, a and b.", fig: { kind: "trace", title: "int i = 5;  int a = i++;  int b = ++i;", cols: ["Statement", "i", "a", "b"], rows: [{ cells: ["int i = 5;", 5, "?", "?"] }, { cells: ["int a = i++;", 6, 5, "?"], changed: [1, 2] }, { cells: ["int b = ++i;", 7, 5, 7], changed: [1, 3], tone: "ok" }] } },
    { type: "figure", id: "c20-f2", caption: "What to do with each kind of behaviour. Only the first is a safe basis for a single printed answer without an assumption.", alt: "A table of the four levels of behaviour and what to answer.", fig: { kind: "matrix", title: "Is there one answer?", cols: ["Single answer?"], rows: [{ label: "defined", cells: ["yes"], hl: true }, { label: "implementation-defined", cells: ["only with the assumption given"] }, { label: "unspecified", cells: ["only if the question states the order"] }, { label: "undefined", cells: ["no: 'undefined' is the answer"], hl: true }] } },

    { type: "example", id: "c20-e1", level: "edge", title: "sizeof is unsigned", file: "sizeof_compare.c", given: `#include <stdio.h>

int main(void) {
    printf("%d %d", sizeof(int) > -1, (int)sizeof(int) > -1);
    return 0;
}`, find: "The output.", steps: [
      { say: "sizeof(int) has the unsigned type size_t. Comparing it with the int -1 converts -1 to unsigned: a huge number.", result: "4 > 4294967295 (or larger)" },
      { say: "So the first comparison is false.", result: "0" },
      { say: "In the second, the cast makes the left side a signed int, so 4 > -1.", result: "1" },
    ], answer: "0 1", check: "The program was compiled and run." },
    { type: "example", id: "c20-e2", level: "gate", title: "Which side of && and || runs?", file: "short_circuit_trace.c", given: `#include <stdio.h>

int main(void) {
    int x = 0, y = 0;
    if (x++ || y++) { }
    printf("%d %d ", x, y);
    x = 0; y = 0;
    if (x++ && y++) { }
    printf("%d %d", x, y);
    return 0;
}`, find: "The output.", steps: [
      { say: "x++ || y++: x++ is 0 (false) and x becomes 1. The left side is false, so the right side y++ runs: y becomes 1.", result: "1 1" },
      { say: "x++ && y++: x++ is 0 (false) and x becomes 1. The left side is false, so && skips the right side: y stays 0.", result: "1 0" },
    ], answer: "1 1 1 0", check: "The program was compiled and run." },
    { type: "example", id: "c20-e3", level: "gate", title: "A full trace on paper", file: "full_trace.txt", given: `int a[3] = {1, 2, 3};
int *p = a;
int s = *p++;
s += *p++;
/* s and *p at the end? */`, find: "The values of s and *p.", steps: [
      { say: "Boxes: a = 1 2 3, p -> a[0], s is a new box.", result: "p -> a[0]" },
      { say: "s = *p++: use the element p points at (1), then move p to a[1]. s = 1.", result: "s = 1, p -> a[1]" },
      { say: "s += *p++: use the element (2), then move p to a[2]. s = 1 + 2.", result: "s = 3, p -> a[2]" },
      { say: "*p is a[2].", result: "3" },
    ], answer: "s = 3 and *p = 3", check: "Run in a test program: it printed 3 3." },

    { type: "trap", wrong: "An expression such as i++ + ++i has some value, and I just have to find it.", tempting: "It compiles, and one compiler gives an answer.", whyWrong: "The variable i is changed twice between sequence points. The behaviour is undefined: there is no correct single answer, and another compiler may give a different value.", rule: "Changed twice between sequence points: undefined.", ex: { text: "int i = 5; printf(\"%d\", i++ + ++i); can print 12 on one compiler and something else on another, and is not a valid exam answer. Written as separate statements, a = i++; b = ++i; it has a clear answer." } },
    { type: "trap", wrong: "If a program prints a number on my machine, that is the output.", tempting: "The machine is the final judge of what a program does.", whyWrong: "For defined behaviour that is true. For implementation-defined, unspecified or undefined behaviour the same program may print something else elsewhere, and a GATE answer must be correct everywhere the question's assumptions allow.", rule: "Check the level of definition before trusting a run.", ex: { text: "char c = 200; may be -56 (signed char) or 200 (unsigned char) depending on the compiler. A question that depends on it must say which." } },
    { type: "gate", text: "This chapter has no tagged question of its own: its method is used by every question in the book. The assumptions that questions state (\"assume right to left\", \"ignore syntax errors\", \"assume the program compiles and runs\") appear in the questions of 2024, 2025 and 2026, and are part of what you must read first." },
    { type: "recall", cards: [
      { q: "What are the five steps of the method?", a: "Boxes, types, one row per statement, the checklist, read the answer exactly." },
      { q: "Name the four levels of behaviour.", a: "Defined, implementation-defined, unspecified, undefined." },
      { q: "What is a classic unspecified behaviour?", a: "The order in which function arguments are evaluated." },
      { q: "What is a classic undefined behaviour?", a: "Signed overflow; a[n] out of range; i++ + ++i; using freed or NULL pointers." },
      { q: "Where does C guarantee an order of evaluation?", a: "Around &&, ||, ?: and the comma; after each full statement." },
      { q: "What do you answer when the code is undefined and 'undefined' is an option?", a: "Choose that option." },
      { q: "What should you read before tracing?", a: "The assumptions stated in the question." },
    ] },
    { type: "check", questions: [
      { id: "n1", kind: "NAT", marks: 1, q: "int i = 5; int a = i++; int b = ++i; What is a + b + i?", answer: "19", solution: "a = 5, b = 7, i = 7." },
      { id: "n2", kind: "NAT", marks: 1, q: "int x = 0, y = 0; if (x++ || y++) {} What is x + y?", answer: "2", solution: "x++ is 0, so y++ also runs." },
      { id: "n3", kind: "NAT", marks: 1, q: "int x = 0, y = 0; if (x++ && y++) {} What is x + y?", answer: "1", solution: "y++ is skipped." },
      { id: "n4", kind: "MCQ", marks: 1, q: "printf(\"%d\", sizeof(int) > -1); prints:", options: ["1", "0", "-1", "undefined"], answer: "B", solution: "-1 converts to a huge unsigned number." },
      { id: "n5", kind: "MCQ", marks: 2, q: "Which of these has undefined behaviour?", options: ["unsigned u = 0; u--;", "int i = 5; int a = i++;", "int i = 5; int a = i++ + ++i;", "int a = 7 / 2;"], answer: "C", solution: "i is changed twice with no sequence point." },
      { id: "n6", kind: "NAT", marks: 2, q: "int a[3] = {1, 2, 3}; int *p = a; int s = *p++; s += *p++; What is s + *p?", answer: "6", solution: "s = 3, *p = 3." },
      { id: "n7", kind: "MSQ", marks: 2, q: "Which are true?", options: ["The order of evaluating function arguments is unspecified", "Signed integer overflow is defined to wrap around", "The left side of && is evaluated first", "Unsigned wraparound is defined"], answer: "A, C, D", solution: "B is false: undefined." },
      { id: "n8", kind: "NAT", marks: 2, q: "unsigned u = 0; u--; Is u equal to the largest unsigned int? Answer 1 for yes, 0 for no.", answer: "1", solution: "Unsigned wraparound gives 4294967295." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on C programs", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "last: previous-year patterns", href: "/study/c-programming" }] },
    { type: "links", prereq: ["All earlier chapters"], usedIn: ["Previous-year patterns (C21)"], cross: ["Compiler design: undefined behaviour"] },
  ],
};
