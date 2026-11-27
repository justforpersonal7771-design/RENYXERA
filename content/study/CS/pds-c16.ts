import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 16 "The preprocessor and macros" (28 Nov 2026). No GATE question of this bank is tagged to this chapter (07-PDS-BOOK-CONTENTS.md), so the
 * "How GATE asks it" section works the patterns that macro questions in other papers use, with compiled programs; it quotes no question number.
 * Every program was compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC16: Topic = {
  id: "cs.pds.c.preproc16",
  title: "The preprocessor and macros",
  no: "16",
  book: [
    { t: "p", text: "Before the compiler reads your program, another tool reads it first: the **preprocessor**. It does not understand C. It looks only for lines that start with `#`, and for the names you have defined with them, and it does **text replacement**: it cuts, pastes and deletes text. What is left is handed to the compiler. Everything in this chapter follows from that one fact: a macro is not a function and not a variable; it is a find-and-replace done before the program is compiled." },
    { t: "p", text: "That is why macros are powerful and why they are dangerous. They can do things functions cannot, and they can give wrong answers that look right. Output questions about macros are about expanding the text exactly as the preprocessor would, and then evaluating the result with the ordinary rules of precedence." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["expand an object-like or function-like macro by hand, replacing text exactly;", "explain why `SQ(1 + 2)` can give 5, and fix it with brackets;", "say what happens to a macro argument that has a side effect, such as `x++`;", "use `#`, `##`, `#ifdef`, `#if` and an include guard;", "choose between a macro, a `const` and a function."] },

    { t: "h2", text: "What the preprocessor does" },
    { t: "p", text: "The preprocessor runs before the compiler and does four jobs: it **includes** files (`#include`), it **defines and expands** macros (`#define`), it **chooses** which parts of the file to keep (`#if`, `#ifdef`), and it removes comments. A line that begins with `#` is a preprocessor line, not C." },
    { t: "table", head: ["Directive", "What it does"], rows: [["`#include <file>` or `\"file\"`", "pastes the whole text of the file here"], ["`#define NAME text`", "from now on, replaces the word NAME by text"], ["`#undef NAME`", "forgets the definition of NAME"], ["`#if`, `#ifdef`, `#ifndef`, `#else`, `#endif`", "keeps or drops the lines in between"]], caption: "You can see the result of the preprocessor with the command `gcc -E file.c`." },
    { t: "fig", id: "c16-f1" },
    { t: "callout", kind: "key", text: "A macro is replaced by its text **before** compiling. The compiler never sees the macro name: it sees the replacement." },

    { t: "h2", text: "Object-like macros" },
    { t: "p", text: "`#define N 5` makes `N` a name for the text `5`. Every later `N` in the program (apart from inside strings) is replaced by `5`. It is used for constants that you want to change in one place. A macro has no type, no box and no address: `&N` is an error, because there is nothing to take the address of." },
    { t: "code", text: `#include <stdio.h>

#define N 5
#define PI 3.14

int main(void) {
    printf("%d\\n", N * 2);          /* becomes 5 * 2 */
    printf("%.2f\\n", PI * 2);       /* becomes 3.14 * 2 */
    return 0;
}`, out: "10\n6.28", file: "object_macros.c" },
    { t: "p", text: "A `const` variable, such as `const int n = 5;`, is the typed alternative: it has a type, a scope and an address, and the compiler checks its use. Prefer `const` (or `enum`) in new code, and understand macros because older code, and GATE, use them." },
    { t: "p", text: "Because the replacement is plain text, a macro can hold more than a number: `#define LOOP for (int i = 0; i < 3; i++)` is allowed. The rule that bites is the same: what you write is what you get, with no brackets added for you." },
    { t: "p", text: "A macro must fit on one logical line. To spread a long definition over several lines, end each line except the last with a backslash `\`. A macro that stands for several statements is usually wrapped in `do { … } while (0)`, so that it behaves like one statement when it is followed by a semicolon, for example in an `if` without braces." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Function-like macros" },
    { t: "p", text: "A macro can take **arguments**, written in brackets right after the name: `#define MAX(a, b) ((a) > (b) ? (a) : (b))`. Using `MAX(3, 7)` replaces the call by the text of the macro with `a` and `b` replaced by the **text** of the arguments. There is no call, no stack frame and no evaluation of the arguments before the replacement: only text." },
    { t: "h3", text: "The brackets rule" },
    { t: "p", text: "Because the argument text is pasted in unchanged, precedence can change its meaning. The macro `#define SQ_BAD(x) x * x` turns `SQ_BAD(1 + 2)` into `1 + 2 * 1 + 2`, which is 1 + 2 + 2 = 5, not 9. Putting every use of the parameter, and the whole body, in brackets fixes it: `#define SQ(x) ((x) * (x))` turns `SQ(1 + 2)` into `((1 + 2) * (1 + 2))`, which is 9." },
    { t: "code", text: `#include <stdio.h>

#define SQ_BAD(x) x * x
#define SQ(x) ((x) * (x))

int main(void) {
    printf("%d %d\\n", SQ_BAD(1 + 2), SQ(1 + 2));
    return 0;
}`, out: "5 9", file: "macro_brackets.c" },
    { t: "fig", id: "c16-f2" },
    { t: "p", text: "The outer brackets matter too. With `#define ADD_BAD(a, b) a + b`, the expression `10 * ADD_BAD(2, 3)` becomes `10 * 2 + 3` = 23, not 50. A correct macro is `#define ADD(a, b) ((a) + (b))`." },
    { t: "code", text: `#include <stdio.h>

#define ADD_BAD(a, b) a + b
#define TWICE(x) (2 * (x))

int main(void) {
    printf("%d %d\\n", 10 * ADD_BAD(2, 3), 10 * TWICE(3));
    return 0;
}`, out: "23 60", file: "macro_outer_brackets.c" },
    { t: "h3", text: "An argument with a side effect" },
    { t: "p", text: "Since an argument is pasted wherever the parameter appears, an argument that **appears twice in the body is evaluated twice**. With `MAX(x++, 3)`, the replacement is `((x++) > (3) ? (x++) : (3))`. The test runs `x++` once; if it is true, the result runs `x++` a second time, so `x` is increased twice and the value returned is the second old value." },
    { t: "code", text: `#include <stdio.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main(void) {
    int x = 5;
    printf("%d\\n", MAX(x++, 3));
    printf("%d\\n", x);
    return 0;
}`, out: "6\n7", file: "macro_side_effect.c" },
    { t: "p", text: "The choice between a macro and a function is a trade. A macro has no call overhead and works for any type (the same MAX works for ints and doubles), but it evaluates its arguments by text, has no type checking and can repeat a side effect. A function evaluates each argument once, checks types and can be stepped through in a debugger, at a small cost per call. For anything but the smallest operations, prefer a function." },
    { t: "callout", kind: "warning", text: "Never give a macro an argument with a side effect (`x++`, a function call that prints, `rand()`). If the parameter appears twice in the body, the side effect happens twice. A real function evaluates its arguments exactly once." },
    { t: "trap", i: 1 },
    { t: "trap", i: 2 },

    { t: "h2", text: "Stringizing and token pasting" },
    { t: "p", text: "Two special operators work **inside** a macro body. `#x` turns the argument text into a string literal: `STR(hello)` becomes `\"hello\"`. And `a ## b` glues two pieces of text into one name: `JOIN(x, y)` becomes `xy`, which can be a variable." },
    { t: "code", text: `#include <stdio.h>

#define STR(x) #x
#define JOIN(a, b) a##b

int main(void) {
    int xy = 9;
    printf("%s %s\\n", STR(hello), STR(1 + 2));
    printf("%d\\n", JOIN(x, y));          /* becomes xy */
    return 0;
}`, out: "hello 1 + 2\n9", file: "stringize_paste.c" },
    { t: "p", text: "Note that `STR(1 + 2)` is the **text** \"1 + 2\", not the number 3: the argument is never evaluated." },

    { t: "h2", text: "Conditional compilation and #include" },
    { t: "p", text: "`#ifdef NAME` keeps the following lines only if NAME is defined; `#if expression` keeps them if a constant expression is true; `#else` and `#endif` close the choice. The dropped lines are not compiled at all, so they can even contain code that would be an error. This is used to switch debugging output, and to write code for different machines." },
    { t: "code", text: `#include <stdio.h>

#define DEBUG 1
#define N 5

int main(void) {
#ifdef DEBUG
    printf("debug on\\n");
#endif
#if N > 3
    printf("N big\\n");
#else
    printf("N small\\n");
#endif
    return 0;
}`, out: "debug on\nN big", file: "conditional.c" },
    { t: "p", text: "`#include <name>` pastes the system header of that name; `#include \"name\"` looks first in your own folder. A header may be pasted twice by accident, if two files include it, and a repeated definition is an error. The standard cure is an **include guard**: `#ifndef FILE_H`, then `#define FILE_H`, then the declarations, then `#endif`. The second time, `FILE_H` is already defined, so the whole body is skipped." },
    { t: "callout", kind: "note", text: "`#define` and `#undef` can change a name part-way through a file: the replacement used at a given point is the latest definition before it." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Macro questions are always of one of the patterns above: expand the text and evaluate it, watch for a missing bracket, or watch for a side effect that is repeated. The method is mechanical, and two worked traces follow." },
    { t: "h3", text: "Pattern 1: a macro without brackets" },
    { t: "p", text: "The program defines `SQ_BAD(x)` as `x * x` and calls it with a sum. The expansion is plain text, so the sum's `+` ends up with a lower precedence than the `*`s around it." },
    { t: "ex", id: "c16-e1" },
    { t: "table", head: ["Call", "Expansion", "Value"], rows: [["`SQ_BAD(1 + 2)`", "`1 + 2 * 1 + 2`", "5"], ["`SQ(1 + 2)`", "`((1 + 2) * (1 + 2))`", "9"], ["`SQ_BAD(3)`", "`3 * 3`", "9"], ["`100 / SQ_BAD(2 + 3)`", "`100 / 2 + 3 * 2 + 3`", "59"]], caption: "The first two were compiled and run; the last follows from the expansion: 100 / 2 = 50, plus 6, plus 3 = 59." },
    { t: "h3", text: "Pattern 2: the argument evaluated twice" },
    { t: "p", text: "The `MAX` macro uses each of its parameters twice, so an argument with a side effect is evaluated twice. This is the favourite macro trap." },
    { t: "ex", id: "c16-e2" },
    { t: "table", head: ["Call", "Expansion", "Output"], rows: [["`MAX(x++, 3)`, x = 5", "`((x++) > (3) ? (x++) : (3))`", "6, and x is 7 afterwards"], ["`MAX(3, 7)`", "`((3) > (7) ? (3) : (7))`", "7"], ["`MAX(2 + 3, 4)`", "`((2 + 3) > (4) ? (2 + 3) : (4))`", "5"]], caption: "The first row was compiled and run." },
    { t: "h3", text: "Pattern 3: tracing the expansion by hand" },
    { t: "ex", id: "c16-e3" },
    { t: "callout", kind: "shortcut", text: "To answer a macro question: (1) write the expansion as text, exactly, without evaluating anything; (2) add the brackets that **are** in the text and none that are not; (3) evaluate the result with the usual precedence rules." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["The preprocessor runs before the compiler and does text replacement: includes, macros, conditional compilation.", "`#define N 5` replaces N by 5 everywhere; a macro has no type and no address.", "A function-like macro pastes its arguments as text: put brackets round each parameter and round the whole body.", "An argument that appears twice in the macro body is evaluated twice, so side effects such as `x++` happen twice.", "`#x` makes a string, `a##b` joins two names; `#ifdef`/`#if`/`#endif` select code; an include guard prevents double inclusion.", "To answer a macro question, expand first as text, then evaluate."] },
  ],
  blocks: [
    { type: "figure", id: "c16-f1", caption: "The preprocessor works on text, before the compiler. The compiler never sees the macro names.", alt: "Four stages: source with macros, the preprocessor, expanded source, the compiler.", fig: { kind: "frames", title: "source with macros to compiled program", frames: [
      { caption: "Your file, with #define and macro calls in it.", fig: { kind: "strip", items: [{ label: "source.c", sub: "with macros", state: "now" }, { label: "preprocessor", sub: "text replacement", state: "todo" }, { label: "expanded source", sub: "no macros left", state: "todo" }, { label: "compiler", sub: "real C", state: "todo" }] } },
      { caption: "The preprocessor replaces every macro call by its text, includes files and drops the lines that #if removes.", fig: { kind: "strip", items: [{ label: "source.c", sub: "with macros", state: "done" }, { label: "preprocessor", sub: "text replacement", state: "now" }, { label: "expanded source", sub: "no macros left", state: "todo" }, { label: "compiler", sub: "real C", state: "todo" }] } },
      { caption: "What it produces is ordinary C text, with no # lines: SQ_BAD(1 + 2) has become 1 + 2 * 1 + 2.", fig: { kind: "strip", items: [{ label: "source.c", sub: "with macros", state: "done" }, { label: "preprocessor", sub: "text replacement", state: "done" }, { label: "expanded source", sub: "no macros left", state: "now" }, { label: "compiler", sub: "real C", state: "todo" }] } },
      { caption: "Only now does the compiler read the program, and it applies the usual precedence rules to the expanded text.", fig: { kind: "strip", items: [{ label: "source.c", sub: "with macros", state: "done" }, { label: "preprocessor", sub: "text replacement", state: "done" }, { label: "expanded source", sub: "no macros left", state: "done" }, { label: "compiler", sub: "real C", state: "now" }] } },
    ] } },
    { type: "figure", id: "c16-f2", caption: "The same call with and without brackets. The text decides the value, not the idea of squaring.", alt: "A table with the expansion and value of SQ_BAD and SQ applied to 1 + 2.", fig: { kind: "trace", title: "x = 1 + 2", cols: ["Macro", "Expansion of the call", "Value"], rows: [{ cells: ["x * x", "1 + 2 * 1 + 2", 5], tone: "bad" }, { cells: ["((x) * (x))", "((1 + 2) * (1 + 2))", 9], tone: "ok" }] } },
    { type: "example", id: "c16-e1", level: "easy", title: "Expand a macro that has no brackets", file: "macro_expand.c", given: `#include <stdio.h>

#define SQ_BAD(x) x * x
#define SQ(x) ((x) * (x))

int main(void) {
    printf("%d %d", SQ_BAD(1 + 2), SQ(1 + 2));
    return 0;
}`, find: "The output.", steps: [
      { say: "SQ_BAD(1 + 2) is replaced by the text of the macro with x = 1 + 2: 1 + 2 * 1 + 2.", result: "1 + 2 * 1 + 2" },
      { say: "Multiplication first: 2 * 1 = 2, then 1 + 2 + 2.", result: "5" },
      { say: "SQ(1 + 2) keeps its brackets: ((1 + 2) * (1 + 2)) = 3 * 3.", result: "9" },
    ], answer: "5 9", check: "The program was compiled and run." },
    { type: "example", id: "c16-e2", level: "gate", title: "An argument with a side effect", file: "macro_max.c", given: `#include <stdio.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main(void) {
    int x = 5;
    printf("%d\\n", MAX(x++, 3));
    printf("%d", x);
    return 0;
}`, find: "The output.", steps: [
      { say: "The call is replaced by ((x++) > (3) ? (x++) : (3)). The parameter a appears twice.", result: "x++ twice" },
      { say: "The test runs x++: it compares 5 > 3 (true), and x becomes 6.", result: "x = 6" },
      { say: "Because the test is true, the result is the second (x++): its value is the old 6, and x becomes 7.", result: "value 6, x = 7" },
    ], answer: "6 and 7", check: "The program was compiled and run." },
    { type: "example", id: "c16-e3", level: "easy", title: "Trace by hand: the expansion of a call inside an expression", file: "macro_trace.txt", given: `#define ADD_BAD(a, b) a + b
#define TWICE(x) (2 * (x))

10 * ADD_BAD(2, 3)
10 * TWICE(3)`, find: "The two values.", steps: [
      { say: "ADD_BAD(2, 3) is replaced by the text 2 + 3, without brackets. So 10 * ADD_BAD(2, 3) becomes 10 * 2 + 3.", result: "10 * 2 + 3" },
      { say: "Multiplication first: 20 + 3.", result: "23" },
      { say: "TWICE(3) becomes (2 * (3)), with its own brackets: 10 * (2 * (3)).", result: "60" },
    ], answer: "23 and 60", check: "The program macro_outer_brackets.c above prints 23 60." },

    { type: "trap", wrong: "A macro is evaluated like a function: the arguments are worked out first.", tempting: "The call looks exactly like a function call.", whyWrong: "A macro is text replacement. The argument text is pasted in unchanged and evaluated afterwards, in the middle of the expression it lands in.", rule: "Expand as text, then evaluate.", ex: { code: "#define SQ_BAD(x) x * x\nprintf(\"%d\", SQ_BAD(1 + 2));", out: "5", text: "A function SQ(1 + 2) would receive 3 and return 9." } },
    { type: "trap", wrong: "#define SQ(x) x * x is enough to square any expression.", tempting: "It is the textbook definition of the square.", whyWrong: "Without brackets round the parameter and the body, the pasted text mixes with the surrounding operators.", rule: "Brackets round each parameter and round the whole body.", ex: { code: "#define ADD_BAD(a, b) a + b\nprintf(\"%d\", 10 * ADD_BAD(2, 3));", out: "23", text: "It is 10 * 2 + 3, not 10 * (2 + 3) = 50." } },
    { type: "trap", wrong: "MAX(x++, 3) increases x once.", tempting: "x++ appears once in the call.", whyWrong: "The macro uses a twice, so x++ appears twice in the expansion. When the test is true, x++ runs twice.", rule: "If a parameter appears twice in the body, its argument is evaluated twice.", ex: { code: "int x = 5;\nprintf(\"%d \", MAX(x++, 3));\nprintf(\"%d\", x);", out: "6 7" } },
    { type: "gate", text: "No question of this bank is tagged to this chapter on its own: macro questions appear inside output-prediction questions in other years. They always follow one of the three patterns of this section: missing brackets, an argument that is evaluated twice, or an expansion that must be written out by hand." },
    { type: "recall", cards: [
      { q: "When does the preprocessor run?", a: "Before the compiler; it does text replacement." },
      { q: "Does a macro have a type or an address?", a: "No: it is only replaced text." },
      { q: "What is wrong with #define SQ(x) x*x?", a: "No brackets: SQ(1 + 2) becomes 1 + 2*1 + 2 = 5." },
      { q: "Why is MAX(x++, 3) dangerous?", a: "x++ is evaluated twice when the macro body uses a twice." },
      { q: "What does #x do in a macro body?", a: "Turns the argument text into a string literal." },
      { q: "What does a##b do?", a: "Joins the two pieces of text into one name." },
      { q: "What is an include guard?", a: "#ifndef / #define / #endif round a header, to prevent double inclusion." },
      { q: "Where can you see the preprocessor's output?", a: "gcc -E." },
    ] },
    { type: "check", questions: [
      { id: "e1", kind: "NAT", marks: 1, q: "#define SQ(x) x * x   What is SQ(1 + 2)?", answer: "5", solution: "1 + 2 * 1 + 2 = 5." },
      { id: "e2", kind: "NAT", marks: 1, q: "#define SQ(x) ((x) * (x))   What is SQ(1 + 2)?", answer: "9", solution: "((1 + 2) * (1 + 2))." },
      { id: "e3", kind: "NAT", marks: 1, q: "#define ADD(a, b) a + b   What is 10 * ADD(2, 3)?", answer: "23", solution: "10 * 2 + 3." },
      { id: "e4", kind: "NAT", marks: 2, q: "#define MAX(a, b) ((a) > (b) ? (a) : (b))   int x = 5; MAX(x++, 3); What is x afterwards?", answer: "7", solution: "x++ runs twice." },
      { id: "e5", kind: "MCQ", marks: 1, q: "What is STR(1 + 2) with #define STR(x) #x?", options: ["3", "\"1 + 2\"", "\"3\"", "1 + 2"], answer: "B", solution: "The text of the argument as a string." },
      { id: "e6", kind: "NAT", marks: 2, q: "#define SQ(x) x * x   What is 100 / SQ(2 + 3)?", answer: "59", solution: "100 / 2 + 3 * 2 + 3 = 50 + 6 + 3." },
      { id: "e7", kind: "MSQ", marks: 2, q: "Which are true?", options: ["A macro is replaced by text before compilation", "&N is valid if N is a macro for 5", "MAX(a, b) may evaluate an argument twice", "const int n = 5 is a typed alternative to a macro"], answer: "A, C, D", solution: "B is false: a macro has no address." },
      { id: "e8", kind: "NAT", marks: 2, q: "#define TWICE(x) (2 * (x))   What is 10 * TWICE(3)?", answer: "60", solution: "10 * (2 * (3))." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on C programs", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: parameter passing", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Operators (C3)", "Variables and types (C2)"], usedIn: ["Output prediction (C20)", "Previous-year patterns (C21)"], cross: ["Compiler design: lexical analysis, macro expansion"] },
  ],
};
