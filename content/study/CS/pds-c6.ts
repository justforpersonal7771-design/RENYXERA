import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 6 "Functions and the call stack" (28 Nov 2026). Real GATE questions explained in full: 2025_AN_Q63 (nested calls, sum), 2024_AN_Q21 (argument
 * evaluation order, prints), 2019_FN_Q24 (jumble, call by value). 2026_AN_Q19 (three programs P1, P2, P3 given as a picture) is only mentioned: its programs
 * are not in the data. Every program was compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC6: Topic = {
  id: "cs.pds.c.functions6",
  title: "Functions and the call stack",
  no: "6",
  book: [
    { t: "p", text: "A **function** is a named piece of code that you can use again and again. You have used two already, `main` and `printf`. Writing your own functions lets you break a big problem into small ones, give each a name, and test it on its own. In GATE, a function question is almost always a question about what happens to **values** as they are passed in, passed out and changed on the way." },
    { t: "p", text: "The idea that settles most of them is simple: a function gets **copies** of its arguments, in boxes of its own, and those boxes disappear when it returns. This chapter shows the shape of a function, how a call is drawn on the call stack, what is returned, and in what order the arguments are worked out. Three real GATE questions are explained in full." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["write a function with parameters and a return value, and give it a prototype;", "explain why a function cannot change the caller's variables by assigning to its parameters;", "draw the call stack for a chain of calls and read the answer from it;", "evaluate nested calls such as `g(f(n))` from the inside out;", "say what C promises, and what it does not, about the order of evaluating arguments."] },

    { t: "h2", text: "What a function is" },
    { t: "h3", text: "Parts of a function" },
    { t: "p", text: "A function has a **return type**, a **name**, a list of **parameters** in brackets, and a **body** in braces. The parameters are the names the function uses for the values it receives; the values you actually give it in a call are called **arguments**. The statement `return value;` ends the function and sends a value back to the place that called it." },
    { t: "code", text: `#include <stdio.h>

int add(int a, int b) {      /* int: it returns a whole number */
    return a + b;
}

int main(void) {
    printf("%d\\n", add(3, 4));   /* 3 and 4 are the arguments */
    return 0;
}`, out: "7", file: "add_demo.c" },
    { t: "h3", text: "void and no value" },
    { t: "p", text: "A function that does something but returns nothing has the return type `void`, and it needs no `return value;`. A call to it is a statement of its own. A function that returns a value can be used inside an expression, as in `add(3, 4) * 2`, or its value can simply be thrown away." },

    { t: "h2", text: "Defining, declaring and calling" },
    { t: "p", text: "The compiler reads a file from the top. If you call a function before it has seen its definition, it does not yet know the function's types. The cure is a **prototype**: a line that gives the return type, the name and the parameter types, ending with a semicolon. The definition can then come later, even after `main`." },
    { t: "code", text: `#include <stdio.h>

int sq(int n);               /* prototype: the shape only */

int main(void) {
    printf("%d\\n", sq(5));   /* the compiler knows sq here */
    return 0;
}

int sq(int n) {              /* the definition, below */
    return n * n;
}`, out: "25", file: "prototype_demo.c" },
    { t: "callout", kind: "tip", text: "Write a prototype for every function you define after its first use. Without it, an old compiler guesses that the function returns `int` and takes any arguments, which hides real mistakes." },
    { t: "trap", i: 2 },
    { t: "p", text: "Calls can be **nested**: the value of one call is used as an argument of another. They are evaluated from the inside out. In `twice(sq(3))` the inner call `sq(3)` is worked out first (9), and its value is then passed to `twice`." },

    { t: "h2", text: "Passing arguments: copies" },
    { t: "p", text: "When a function is called, C **copies** the value of each argument into a new variable, the parameter, which lives in the function's own box. This is **call by value**. The function can read its parameters and change them freely, but it is only changing its copies. When the function returns, those boxes are thrown away, and the caller's variables are exactly as they were." },
    { t: "code", text: `#include <stdio.h>

void inc(int x) {
    x = x + 1;          /* changes the copy only */
}

int main(void) {
    int x = 5;
    inc(x);
    printf("%d\\n", x);
    return 0;
}`, out: "5", file: "call_by_value.c" },
    { t: "p", text: "Even though the parameter in `inc` is also called `x`, it is a different variable from the `x` in `main`. Names belong to the function in which they are declared (chapter 7 returns to this)." },
    { t: "trap", i: 0 },
    { t: "trap", i: 4 },
    { t: "callout", kind: "key", text: "A function gets **copies**. To let a function change your variable, you must give it the **address** of the variable (chapter 10), or use the value it returns." },

    { t: "h2", text: "The call stack" },
    { t: "p", text: "Each running call has a **frame**, a block of memory that holds its parameters, its local variables and the place to return to. A new frame is placed on top of the caller's frame (a **stack**), and removed when the call returns. The call at the top is the one running. Figure 6.1 follows one pass of a loop that calls `f`, which calls `g`." },
    { t: "fig", id: "c6-f1" },
    { t: "p", text: "Reading the stack gives a method for any chain of calls: go down into the innermost call, work out its value, return it to the caller, and continue. Never try to hold the whole chain in your head; draw one frame per call." },
    { t: "callout", kind: "shortcut", text: "For nested calls such as `g(f(n))`, evaluate from the inside: first `f(n)`, then pass that value to `g`. Write each intermediate value on its own line." },

    { t: "h2", text: "Return values" },
    { t: "p", text: "`return` ends the function at once and hands one value back. Statements after it in the same path are never run. A function whose return type is `int` should return an int on every path; reaching the end of such a function without a `return` and then using its value is an error in the program." },
    { t: "code", text: `#include <stdio.h>

int noret(int a) {
    if (a > 0)
        return 1;      /* leaves here when a > 0 */
    return 0;
}

int main(void) {
    printf("%d %d\\n", noret(5), noret(-5));
    return 0;
}`, out: "1 0", file: "return_paths.c" },
    { t: "p", text: "A function returns **one** value. If you need two results, for example a quotient and a remainder, you cannot return both with `return`. You either pass the addresses of two variables for the function to fill in (chapter 10), or you return a `struct` that holds both (chapter 14). The value that is returned is a copy as well, so changing the variable that held it inside the function, after the return, has no effect." },
    { t: "trap", i: 3 },

    { t: "h2", text: "Order of evaluating arguments" },
    { t: "p", text: "In `f(g(10), h(20))` the arguments are themselves calls, and each prints something. Which one runs first? The C standard does **not say**: the order in which the arguments of a call are evaluated is **unspecified**. Compilers differ, and some work from right to left. This is why a GATE question that depends on it always states the order in the question: \"assume parameters are evaluated from right to left\"." },
    { t: "trap", i: 1 },
    { t: "callout", kind: "warning", text: "If a question does not say in which order arguments are evaluated and the answer depends on it, no single answer is correct. When it does say, follow it exactly." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2025 (afternoon), Q63: nested calls in a loop" },
    { t: "p", text: "A two-mark numerical question. It has a loop, a sum, and two functions that call each other. The only skill needed is to evaluate each nested call from the inside, one pass of the loop at a time." },
    { t: "ex", id: "c6-e1" },
    { t: "fig", id: "c6-f2" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Inside-out evaluation, and bookkeeping of the loop. The loop runs for n = 1 and n = 2 only, because the test is `n < 3`. On each pass the line `sum += g(f(n))` first needs `f(n)`, which is `g(n * 2)`, which is `n * 2 + 10`; then that value goes into `g` again, adding another 10. So each pass adds n·2 + 20. For n = 1 that is 22, for n = 2 it is 24, and the sum is 46." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Counting a third pass (n = 3) because they read `n < 3` as `n <= 3`. That gives 46 + 26 = 72.", "Forgetting that `g` is applied **twice** (once inside `f`, once outside), and adding only one 10.", "Doing the work in the wrong order: calling `g` with n and not with the value of `f(n)`."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["`f` is `g(n * 3)` instead", "n = 1: g(3) = 13, g(13) = 23; n = 2: g(6) = 16, g(16) = 26", "49"], ["`n <= 3` in the loop", "adds n = 3: g(6) = 16, g(16) = 26 → 46 + 26", "72"], ["`sum += f(n)` (no outer g)", "12 + 14", "26"]], caption: "The first row was compiled and run; the others follow the same pass-by-pass rule." },

    { t: "h3", text: "GATE 2024 (afternoon), Q21: the order of evaluating arguments" },
    { t: "p", text: "A one-mark multiple-choice question in which every function prints its argument. The statement of the question says that parameters are evaluated from **right to left**, which is the information that makes it answerable." },
    { t: "ex", id: "c6-e2" },
    { t: "fig", id: "c6-f3" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Two different orders in two different places. The call `f(g(10), h(20))` in `main` evaluates its arguments right to left: `h(20)` runs first and prints 20, then `g(10)` runs and prints 10. After that `f` runs with x = 10 and y = 20, and its own body calls `g(x)` and then `h(y)` **in the order written**, printing 10 and then 20. The output is 20, 10, 10, 20." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option B, 10202010.** The student evaluates the arguments left to right (10 then 20) and then, wrongly, the body right to left.", "**Option D, 10201020.** The student uses left to right everywhere.", "**Option C, 20102010.** The student gets the first half right and then reverses the body's calls as well.", "Believing the right-to-left rule applies to statements inside the body; it applies only to the arguments of one call."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Assumption or change", "Reasoning", "Prints"], rows: [["arguments evaluated left to right", "g(10), h(20), then the body g(x), h(y): 10, 20, 10, 20", "10201020"], ["right to left, body calls swapped (`h(y); g(x);`)", "20, 10 from main, then h(y) = 20 and g(x) = 10", "20102010"], ["right to left, `f` has only `g(x)`", "20, 10, then 10", "201010"]], caption: "The question's own program, run with right-to-left evaluation, prints 20101020; the rows follow the same two rules." },

    { t: "h3", text: "GATE 2019 (forenoon), Q24: call by value with a change in the body" },
    { t: "p", text: "A one-mark numerical question. The function changes its first parameter and returns it. The variables in `main` are updated only by what the calls **return**, which is the whole point." },
    { t: "ex", id: "c6-e3" },
    { t: "fig", id: "c6-f4" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "That a function's assignment to its parameter is private, and that only the returned value reaches the caller. Both calls are of the form `variable = jumble(a, b)`, so the result is stored back. The first call passes y = 5 as x and x = 2 as y, so it returns 2·5 + 2 = 12, which becomes the new y. The second passes the new y = 12 and x = 2, returning 2·12 + 2 = 26, which becomes the new x." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Passing the arguments in the wrong order: `jumble(y, x)` is not `jumble(x, y)`. The first argument is the one that is doubled.", "Using the **old** y in the second call. y was changed by the first call.", "Thinking `x = 2 * x + y` inside `jumble` changes `x` in `main`. It changes only the copy."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Calls in main (x = 2, y = 5 at the start)", "Reasoning", "Final x"], rows: [["`y = jumble(x, y); x = jumble(y, x);`", "y = 2·2 + 5 = 9; x = 2·9 + 2 = 20", "20"], ["`jumble(y, x);` with the result thrown away, then print x", "nothing is stored, so x is still 2", "2"], ["`y = jumble(y, x); x = jumble(y, x);` (the question)", "y = 12; x = 26", "26"]], caption: "Rows 1 and 3 were compiled and run." },

    { t: "callout", kind: "note", text: "GATE 2026 (afternoon) Q19 gives three whole programs, P1, P2 and P3, as a picture and asks which of them compile. The official answer is that only P1 compiles. The three programs are not in the question text, so they are not reproduced here; the rules of this chapter that matter for such a question are: a function must be declared before use, the number and types of arguments must match, and a non-void function should return a value." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A function has a return type, a name, parameters and a body. `return` ends it and sends back one value.", "A prototype lets you call a function before its definition.", "Arguments are passed by value: the function works on copies, in boxes that vanish on return.", "A call is drawn as a frame on the call stack; nested calls are evaluated from the inside out.", "The order of evaluating the arguments of one call is unspecified in C; a GATE question that depends on it states the order.", "To change a caller's variable, use the returned value (or an address, chapter 10)."] },
  ],
  blocks: [
    { type: "figure", id: "c6-f1", caption: "One pass (n = 1) of GATE 2025 AN Q63. f(1) calls g(2) = 12; then main calls g(12) = 22. Step through to see frames pushed and removed.", alt: "Four frames of the call stack for g of f of 1: main, then f, then g, then back to main with 22.", fig: { kind: "frames", title: "sum += g(f(n))   with n = 1", frames: [
      { caption: "main calls f(1): a frame for f appears on top, with n = 1.", fig: { kind: "stackframe", frames: [{ title: "f", tone: "hl", rows: [{ name: "n", value: 1 }] }, { title: "main", rows: [{ name: "sum", value: 0 }, { name: "n", value: 1 }] }] } },
      { caption: "f calls g(n * 2) = g(2): a frame for g with n = 2. g returns 2 + 10 = 12.", fig: { kind: "stackframe", frames: [{ title: "g", tone: "hl", rows: [{ name: "n", value: 2 }] }, { title: "f", rows: [{ name: "n", value: 1 }] }, { title: "main", rows: [{ name: "sum", value: 0 }, { name: "n", value: 1 }] }] } },
      { caption: "f returns 12 and its frame is gone. main now calls g(12): a frame for g with n = 12.", fig: { kind: "stackframe", frames: [{ title: "g", tone: "hl", rows: [{ name: "n", value: 12 }] }, { title: "main", rows: [{ name: "sum", value: 0 }, { name: "n", value: 1 }] }] } },
      { caption: "g returns 22. main adds it: sum = 22.", fig: { kind: "stackframe", frames: [{ title: "main", tone: "ok", rows: [{ name: "sum", value: 22, tone: "ok" }, { name: "n", value: 1 }] }] } },
    ] } },
    { type: "figure", id: "c6-f2", caption: "GATE 2025 AN Q63, pass by pass. Each pass adds g(f(n)) = 2n + 20.", alt: "A table of n, f(n), g of f(n) and the running sum for n equal 1 and 2.", fig: { kind: "trace", title: "for (n = 1; n < 3; n++) sum += g(f(n));", cols: ["n", "f(n) = g(2n)", "g(f(n))", "sum"], rows: [{ cells: [1, "g(2) = 12", "g(12) = 22", 22], changed: [3] }, { cells: [2, "g(4) = 14", "g(14) = 24", 46], changed: [3], tone: "ok" }, { cells: [3, "", "n < 3 is false", "loop ends"] }] } },
    { type: "figure", id: "c6-f3", caption: "GATE 2024 AN Q21. Right to left for the arguments: h(20) first, then g(10). Then f's body runs in the order written.", alt: "A table of the calls in order and what each prints, giving 20 10 10 20.", fig: { kind: "trace", title: "f(g(10), h(20))   (arguments right to left)", cols: ["Step", "Call", "Prints"], rows: [{ cells: [1, "h(20): the right argument first", "20"] }, { cells: [2, "g(10): the left argument", "10"] }, { cells: [3, "f(10, 20) runs; its body calls g(x) = g(10)", "10"] }, { cells: [4, "then h(y) = h(20)", "20"], tone: "ok" }, { cells: ["", "all together", "20101020"], tone: "ok" }] } },
    { type: "figure", id: "c6-f4", caption: "GATE 2019 FN Q24. Each call returns a new value that is stored back into main's variable.", alt: "A table of the two calls to jumble, the values passed in and the values stored back.", fig: { kind: "trace", title: "x = 2, y = 5;  y = jumble(y, x);  x = jumble(y, x);", cols: ["Statement", "jumble(first, second)", "returns 2·first + second", "main afterwards"], rows: [{ cells: ["y = jumble(y, x)", "jumble(5, 2)", 12, "x = 2, y = 12"], changed: [3] }, { cells: ["x = jumble(y, x)", "jumble(12, 2)", 26, "x = 26, y = 12"], changed: [3], tone: "ok" }] } },

    { type: "example", id: "c6-e1", level: "gate", title: "GATE CS 2025 (afternoon), Q63 · 2 marks · NAT", file: "gate2025_q63.c", given: `#include <stdio.h>

int g(int n) {
    return (n+10);
}

int f(int n) {
    return g(n*2);
}

int main( ) {
    int sum, n;
    sum=0;
    for (n=1; n<3; n++)
        sum += g(f(n));
    printf("%d", sum);
    return 0;
}`, find: "The output.", steps: [
      { say: "n = 1: f(1) = g(2) = 12. Then g(12) = 22. sum = 22.", result: "sum = 22" },
      { say: "n = 2: f(2) = g(4) = 14. Then g(14) = 24. sum = 22 + 24.", result: "sum = 46" },
      { say: "n = 3: the test n < 3 is false, so the loop ends.", result: "46" },
    ], answer: "46", check: "Official answer 46. The program was compiled and run." },
    { type: "example", id: "c6-e2", level: "gate", title: "GATE CS 2024 (afternoon), Q21 · 1 mark · MCQ", file: "gate2024_q21_fn.c", given: `# include <stdio.h>

int g(int p) { printf("%d", p); return p; }
int h(int q) { printf("%d", q); return q; }

void f(int x, int y) {
    g(x);
    h(y);
}

int main( ) {
    f(g(10), h(20));
}`, find: "The output, assuming parameters are evaluated from right to left. Options: (A) 20101020  (B) 10202010  (C) 20102010  (D) 10201020", steps: [
      { say: "In main, the arguments of f are evaluated right to left: first h(20), which prints 20 and returns 20.", result: "prints 20" },
      { say: "Then g(10), which prints 10 and returns 10.", result: "prints 10" },
      { say: "f(10, 20) runs. Its body calls g(x) = g(10): prints 10.", result: "prints 10" },
      { say: "Then h(y) = h(20): prints 20.", result: "prints 20" },
    ], answer: "(A) 20101020", check: "Official answer (A). The program was compiled and run and printed 20101020." },
    { type: "example", id: "c6-e3", level: "gate", title: "GATE CS 2019 (forenoon), Q24 · 1 mark · NAT", file: "gate2019_q24.c", given: `#include <stdio.h>

int jumble(int x, int y) {
    x = 2 * x + y;
    return x;
}

int main ( ) {
    int x = 2, y = 5;
    y = jumble(y, x);
    x = jumble(y, x);
    printf("%d\\n", x);
    return 0;
}`, find: "The value printed.", steps: [
      { say: "y = jumble(y, x) = jumble(5, 2): inside, x = 2·5 + 2 = 12, and 12 is returned and stored in main's y.", result: "y = 12" },
      { say: "x = jumble(y, x) = jumble(12, 2): inside, x = 2·12 + 2 = 26, returned and stored in main's x.", result: "x = 26" },
    ], answer: "26", check: "Official answer 26. The program was compiled and run." },

    { type: "trap", wrong: "A function can change the caller's variable by assigning to its parameter.", tempting: "The parameter has the same name as the variable, so they look like one box.", whyWrong: "The parameter is a copy in a box of the function's own. Assigning to it changes the copy, which is thrown away on return.", rule: "Only the returned value (or an address) reaches the caller.", ex: { code: "void inc(int x) { x = x + 1; }\n/* in main: */\nint x = 5;\ninc(x);\nprintf(\"%d\", x);", out: "5" } },
    { type: "trap", wrong: "Arguments are always evaluated from left to right.", tempting: "Everything else in C is read left to right.", whyWrong: "The standard leaves the order unspecified, and some compilers go right to left. A question that depends on it states the order. The order of **statements** in a body is always top to bottom.", rule: "Use the order the question gives; never assume one.", ex: { text: "With f(g(10), h(20)) and right-to-left evaluation, h(20) prints first: 20, then 10. With left-to-right, 10, then 20. The same program prints 20101020 or 10201020 depending on the order." } },
    { type: "trap", wrong: "A function must be defined above main to be used.", tempting: "The compiler reads the file from the top, so order seems to matter.", whyWrong: "The definition may come later if there is a prototype before the first call. The prototype tells the compiler the function's shape.", rule: "Prototype first; define anywhere.", ex: { code: "int sq(int n);\nint main(void) { printf(\"%d\", sq(5)); }\nint sq(int n) { return n * n; }", out: "25" } },
    { type: "trap", wrong: "Code after a return statement in the same path still runs.", tempting: "It is written in the same function.", whyWrong: "return ends the function at once. Statements after it on that path are never reached.", rule: "return leaves immediately.", ex: { code: "int f(void) {\n    return 1;\n    printf(\"never\");\n}", text: "Calling f() returns 1 and prints nothing." } },
    { type: "trap", wrong: "A parameter and a caller's variable with the same name are the same variable.", tempting: "Same name, so same box.", whyWrong: "Every function has its own boxes. The name x in jumble and the name x in main are two different variables.", rule: "A name belongs to the function that declares it.", ex: { code: "x = 2, y = 5;\ny = jumble(y, x);\nprintf(\"%d %d\", x, y);", out: "2 12", text: "jumble changed its own x, so main's x is still 2; only y was updated from the returned value." } },
    { type: "gate", text: "Three questions have been asked on this chapter: nested calls in a loop (2025 AN Q63, 2 marks), the order of evaluating arguments with printing functions (2024 AN Q21, 1 mark), and call by value with a returned value (2019 FN Q24, 1 mark). A fourth, 2026 AN Q19 (three programs given as a picture, which of them compile), tests prototypes and matching of arguments. The first three are worked above." },
    { type: "recall", cards: [
      { q: "What does call by value mean?", a: "The function receives copies of the arguments." },
      { q: "Can a function change the caller's variable by assigning to its parameter?", a: "No. Only the returned value (or an address) reaches the caller." },
      { q: "What is a prototype?", a: "A declaration of a function's return type, name and parameter types, before its first call." },
      { q: "How are nested calls such as g(f(n)) evaluated?", a: "From the inside: f(n) first, then g with that value." },
      { q: "In what order are the arguments of one call evaluated?", a: "Unspecified in C; GATE states it when it matters." },
      { q: "What does return do?", a: "Ends the function at once and sends back one value." },
      { q: "What is a stack frame?", a: "The block of memory for one call: its parameters, locals and return point." },
      { q: "Are the statements in a function body run top to bottom?", a: "Yes, always, whatever the order of evaluating arguments." },
    ] },
    { type: "check", questions: [
      { id: "u1", kind: "NAT", marks: 1, q: "int add(int a, int b) { return a + b; }  What is add(3, 4)?", answer: "7", solution: "3 + 4." },
      { id: "u2", kind: "NAT", marks: 1, q: "void inc(int x) { x = x + 1; }  int x = 5; inc(x); What is x?", answer: "5", solution: "inc changed only its copy." },
      { id: "u3", kind: "NAT", marks: 1, q: "int jumble(int x, int y) { x = 2 * x + y; return x; }  What is jumble(2, 5)?", answer: "9", solution: "2·2 + 5." },
      { id: "u4", kind: "NAT", marks: 1, q: "int sq(int n) { return n * n; }  int twice(int n) { return n + n; }  What is twice(sq(3))?", answer: "18", solution: "sq(3) = 9; twice(9) = 18." },
      { id: "u5", kind: "NAT", marks: 2, q: "int g(int n) { return n + 5; }  int f(int n) { return g(n * 2); }  int sum = 0; for (int n = 1; n < 3; n++) sum += g(f(n)); What is sum?", answer: "26", solution: "n = 1: f = g(2) = 7, g(7) = 12; n = 2: f = g(4) = 9, g(9) = 14; 12 + 14 = 26." },
      { id: "u6", kind: "MCQ", marks: 1, q: "void f(int x, int y) { g(x); h(y); } with g and h printing their argument. f(g(10), h(20)) is called, arguments evaluated right to left. What is printed?", options: ["10202010", "20101020", "10201020", "20102010"], answer: "B", solution: "h(20) 20, g(10) 10, then the body g(10) 10, h(20) 20." },
      { id: "u7", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["A function gets copies of its arguments", "The standard fixes the order of evaluating the arguments of a call", "A prototype lets a function be called before its definition", "Code after a return in the same path still runs"], answer: "A, C", solution: "B is false (unspecified); D is false." },
      { id: "u8", kind: "NAT", marks: 2, q: "int add(int a, int b) { return a + b; }  int sq(int n) { return n * n; }  int r = 0; for (int i = 1; i <= 3; i++) r = add(r, sq(i)); What is r?", answer: "14", solution: "1 + 4 + 9." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on functions", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: scope and storage classes", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Operators (C3)", "Loops (C5)"], usedIn: ["Scope and storage (C7)", "Recursion (C8)", "Pointers I (C10)"], cross: ["Compiler design: activation records"] },
  ],
};
