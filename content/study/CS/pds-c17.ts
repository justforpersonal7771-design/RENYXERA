import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 17 "Parameter passing and scoping rules" (28 Nov 2026). No GATE question of this bank is tagged to this chapter on its own (07-PDS-BOOK-CONTENTS.md):
 * the questions that use these ideas are the pointer questions of chapters 10 to 13 and the language-neutral parameter-passing questions of the Compiler Design
 * paper. The "How GATE asks it" section works the standard comparison (value, reference, value-result, name) and static against dynamic scope, and
 * invents no question number. Programs were compiled and run with gcc (scripts/chapter-check.ts); value-result and call by name are not built into C and
 * are simulated by hand where shown.
 */
export const chapterC17: Topic = {
  id: "cs.pds.c.passing17",
  title: "Parameter passing and scoping rules",
  no: "17",
  book: [
    { t: "p", text: "Chapter 6 said that a C function gets copies of its arguments. That is **one** way to pass a parameter, and a language can pass them in several others. A programming-languages question may present a small piece of pseudo-code and ask what it prints under each of several rules, to test whether you know exactly what the rule is. This chapter names the four standard rules, shows how C gets the effect of the second one with pointers, and then looks at a second family of rules: which variable does a name in a function mean, the one where the function was written, or the one in the function that called it?" },
    { t: "p", text: "None of this is new machinery, but the vocabulary is exact and the examples are short, so the marks are there for the careful. By the end of this chapter you will be able to:" },
    { t: "ul", items: ["name the four parameter-passing mechanisms and say what each does to the caller's variable;", "work out the result of the standard `f(x, y)` example under each mechanism;", "explain how C simulates call by reference;", "tell static (lexical) scope from dynamic scope and say which one C uses;", "answer a question that gives pseudo-code and says which rule to assume."] },

    { t: "h2", text: "Words: formal and actual parameters" },
    { t: "p", text: "The names in a function's definition are its **formal parameters**: `x` and `y` in `void f(int x, int y)`. The expressions in a call are the **actual parameters** (or arguments): `a` and `b` in `f(a, b)`. A passing mechanism is the rule that connects each actual to its formal." },
    { t: "callout", kind: "key", text: "Formal parameter: the name inside the function. Actual parameter: the value or variable given in the call. The mechanism decides how they are connected." },
    { t: "p", text: "Why bother with the names? Because the same short function can print four different results under four rules, and an exam question may not tell you which language it has in mind. Knowing the exact meaning of each rule lets you answer for whichever one is asked, and recognise which one C has." },

    { t: "h2", text: "Call by value" },
    { t: "p", text: "In **call by value** the formal parameter is a new variable, and the value of the actual is **copied** into it at the call. Changing the formal changes only the copy; the caller's variable is never touched. This is what C does, for every argument." },
    { t: "code", text: `#include <stdio.h>

void fval(int x, int y) {
    x = x + 1;
    y = y + x;           /* both changes are to the copies */
}

int main(void) {
    int a = 5;
    fval(a, a);
    printf("%d\\n", a);
    return 0;
}`, out: "5", file: "call_by_value_f.c" },
    { t: "p", text: "After the call `a` is still 5. The two formals were two separate copies of 5; nothing the function did to them can reach `a`." },
    { t: "trap", i: 0 },
    { t: "p", text: "A pointer passed to a function is **also** passed by value: the pointer is copied. But the copy holds the same address as the original, so following it reaches the caller's variable. That is how C gets the effect of call by reference: the pointer is copied, the thing it points to is shared (chapters 10 and 13)." },

    { t: "h2", text: "Call by reference" },
    { t: "p", text: "In **call by reference** the formal parameter is not a copy: it is another **name for the actual variable itself**. The two names are the same box. So everything the function does to the formal happens to the caller's variable. If the same variable is passed twice, `f(a, a)`, both formals are names for it: they are **aliases** of each other." },
    { t: "fig", id: "c17-f1" },
    { t: "p", text: "C has no call by reference, but you can get the same effect by passing the **address** and following it (chapter 10). The pointer parameters `x` and `y` below both hold the address of `a`, so `*x` and `*y` are `a` itself." },
    { t: "code", text: `#include <stdio.h>

void fref(int *x, int *y) {
    *x = *x + 1;         /* a becomes 6 */
    *y = *y + *x;        /* a becomes 6 + 6 = 12 */
}

int main(void) {
    int a = 5;
    fref(&a, &a);
    printf("%d\\n", a);
    return 0;
}`, out: "12", file: "call_by_reference_f.c" },
    { t: "p", text: "Follow it carefully. After the first line `a` is 6. In the second line, `*y` **and** `*x` are both `a`, so it computes `a = a + a` = 6 + 6 = 12. The aliasing is the whole point of the question." },
    { t: "callout", kind: "tip", text: "When two formals can be aliases (the same variable passed twice), always trace through the **variable**, not the names: write one box for `a` and watch it." },
    { t: "p", text: "An array passed to a function behaves this way automatically: the name of the array turns into the address of its first element (chapter 9), so the function receives a copy of that address and can change the caller's elements. The language C++ adds true references with the symbol `&` in a parameter, `void f(int &x)`; C does not." },

    { t: "h2", text: "Call by value-result and call by name" },
    { t: "p", text: "**Call by value-result** (also called copy-in copy-out) is a mixture. At the call the actual's value is **copied in** to the formal, like call by value. The function works on the copy. When it returns, the final value of each formal is **copied back out** to the actual. When two formals are copies of the same actual, the order of copying back matters: a question must state it; the usual assumption is left to right, so the last formal wins." },
    { t: "code", text: `#include <stdio.h>

/* simulating value-result by hand: copy in, work, copy out */
void fvr(int *px, int *py) {
    int x = *px, y = *py;    /* copy in */
    x = x + 1;               /* x = 6 */
    y = y + x;               /* y = 5 + 6 = 11 */
    *px = x;                 /* copy out, left to right */
    *py = y;                 /* the last copy out wins: a = 11 */
}

int main(void) {
    int a = 5;
    fvr(&a, &a);
    printf("%d\\n", a);
    return 0;
}`, out: "11", file: "value_result_f.c" },
    { t: "p", text: "Here the two copies were made **before** either changed (both 5). `x` became 6 and `y` became 11, and when they were copied back, `x` first and then `y`, the variable `a` ended with the second one: 11." },
    { t: "p", text: "**Call by name** replaces each use of the formal by the **text of the actual**, re-evaluated every time it is used, rather like a macro (chapter 16). For a plain variable such as `a`, this behaves like call by reference. It differs when the actual is an expression such as `A[i]`: each use re-evaluates it with the **current** value of `i`, which can give surprising results." },
    { t: "p", text: "Of the four, call by value is the safest and the easiest to reason about, because nothing the function does can affect the caller. Call by reference is the fastest for large objects, because nothing is copied, and the most dangerous when two formals can be the same variable." },

    { t: "h2", text: "Comparing the four" },
    { t: "table", head: ["Mechanism", "What the formal is", "Caller's variable changes?", "`f(a, a)` with `x = x + 1; y = y + x;` and a = 5"], rows: [["value", "a copy of the value", "never", "a stays 5"], ["reference", "another name for the variable", "immediately, on every change", "a = 12"], ["value-result", "a copy, copied back on return", "only at the end", "a = 11 (assuming x, then y, is copied back)"], ["name", "the text of the actual, re-evaluated", "immediately (for a plain variable)", "a = 12"]], caption: "For the same code, the four mechanisms can give four different answers: 5, 12, 11 and 12." },
    { t: "fig", id: "c17-f2" },

    { t: "h2", text: "Scope: which variable does a name mean?" },
    { t: "p", text: "A second family of rules decides which **variable** a name refers to when the name is not declared in the current function. With **static** (or lexical) scope, the name means the variable that is visible at the place where the function is **written**, found by looking outwards through the text of the program. With **dynamic** scope, the name means the most recent variable of that name in the chain of **calls**: the variable of the function that called this one, found by looking back down the call stack." },
    { t: "code", text: `#include <stdio.h>

int x = 10;                       /* the global x */

void f(void) {
    printf("%d ", x);             /* which x? */
}

void g(void) {
    int x = 20;                   /* a local x in g */
    f();
    printf("%d\\n", x);
}

int main(void) {
    g();
    return 0;
}`, out: "10 20", file: "static_scope.c" },
    { t: "p", text: "`f` is written outside every function, next to the global `x`, so under static scope its `x` is the global one: 10. Under dynamic scope the same text would print 20, because `g`, which called `f`, has a local `x` more recent than the global. **C uses static scope**, and so do nearly all modern languages." },
    { t: "ex", id: "c17-e2" },
    { t: "p", text: "A related point: C has no functions inside functions, so the only outer scopes are the block structure inside a function, and the file level outside. Languages that allow nested functions, such as Pascal, have a richer static scope, in which an inner function may use the variables of the function that contains it, and the compiler finds them by looking outwards through the nesting." },
    { t: "p", text: "The two rules are implemented differently. Static scope is resolved by the compiler from the program text alone, so it is known before the program runs. Dynamic scope needs the running program to search the call stack for the most recent variable of that name, which is slower and makes it hard to know what a name means just by reading the function." },
    { t: "callout", kind: "shortcut", text: "Static scope: look **outwards in the text** where the function is written. Dynamic scope: look **backwards along the calls** that led here. Draw the call chain and the text nesting, and answer both." },
    { t: "trap", i: 1 },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "A parameter-passing question gives a function in pseudo-code, a call that passes the same variable (or an array element) twice, and four options that correspond to the four mechanisms. The marks go to those who trace the **variable**, not the names, and who copy in and copy out in the stated order." },
    { t: "h3", text: "Pattern 1: the same variable passed twice" },
    { t: "ex", id: "c17-e1" },
    { t: "table", head: ["Variation (a = 5)", "value", "reference", "value-result"], rows: [["`x = x + 1; y = y + x;` (the example)", "5", "12", "11"], ["`x = x + 1; y = y + 1;`", "5", "7", "6"], ["`f(a, b)` with b = 7, and the same body", "a = 5, b = 7", "a = 6, b = 13", "a = 6, b = 13"]], caption: "The first row was compiled and run for value, reference and value-result; the others follow from the same copy rules. In the second row, reference gives two increments of the same box; value-result gives 6 (x = 6 copied back, then y = 6)." },
    { t: "h3", text: "Pattern 2: static against dynamic scope" },
    { t: "table", head: ["Rule", "x printed inside f", "Reason"], rows: [["static (C)", "10", "the global x, where f is written"], ["dynamic", "20", "g's local x, the most recent in the call chain"]], caption: "Run the C program above to see the static answer." },
    { t: "callout", kind: "warning", text: "A question that says only 'what is printed' about code that is not C may intend a particular rule, and it must say which. If it does not say, state the rule you assumed: C always passes by value and uses static scope." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Formal parameters are the names in the definition; actuals are the expressions in the call.", "Call by value copies the value in; the caller never changes. C does this for everything.", "Call by reference makes the formal another name for the actual; with `f(a, a)` the two formals are aliases of each other. C simulates it by passing an address.", "Call by value-result copies in, then copies the final value back out; the order of copying out must be stated.", "Call by name substitutes the text of the actual at every use.", "Static scope finds a name by looking outwards in the program text; dynamic scope looks back along the call chain. C uses static scope."] },
  ],
  blocks: [
    { type: "figure", id: "c17-f1", caption: "Call by reference with f(a, a): both x and y are names for the same box a, so everything done to x or y is done to a.", alt: "One box a holding 12 with two arrows from the names x and y.", fig: { kind: "memory", title: "f(a, a) by reference", cells: [{ id: "a", addr: 1000, name: "a", value: 12, tone: "ok" }, { addr: 1004, name: "x (alias of a)", value: 1000, ptr: "a" }, { addr: 1008, name: "y (alias of a)", value: 1000, ptr: "a" }] } },
    { type: "figure", id: "c17-f2", caption: "x = x + 1; y = y + x; with a = 5 under each mechanism. By value a never changes; by reference both formals are a; by value-result the copies are made first and written back at the end.", alt: "A table of the steps for call by value, reference and value-result and the final a.", fig: { kind: "trace", title: "f(a, a), a = 5", cols: ["Mechanism", "x = x + 1", "y = y + x", "Final a"], rows: [{ cells: ["value", "x = 6 (copy)", "y = 5 + 6 = 11 (copy)", 5] }, { cells: ["reference", "a = 6", "a = 6 + 6 = 12", 12], tone: "ok" }, { cells: ["value-result", "x = 6 (copy)", "y = 5 + 6 = 11 (copy); copy out x then y", 11], tone: "hl" }] } },

    { type: "example", id: "c17-e1", level: "gate", title: "The same call under value, reference and value-result", file: "passing_compare.c", given: `#include <stdio.h>

void fval(int x, int y) { x = x + 1; y = y + x; }
void fref(int *x, int *y) { *x = *x + 1; *y = *y + *x; }
void fvr(int *px, int *py) {
    int x = *px, y = *py;
    x = x + 1; y = y + x;
    *px = x; *py = y;
}

int main(void) {
    int a = 5; fval(a, a);      printf("%d ", a);
    a = 5;     fref(&a, &a);    printf("%d ", a);
    a = 5;     fvr(&a, &a);     printf("%d", a);
    return 0;
}`, find: "The three values printed.", steps: [
      { say: "By value: the function changes copies; a is still 5.", result: "5" },
      { say: "By reference: x and y are both a. a becomes 6, then a = a + a = 12.", result: "12" },
      { say: "By value-result: x and y are copies of 5. x = 6, y = 5 + 6 = 11. Copied out in order, the last (y) wins.", result: "11" },
    ], answer: "5 12 11", check: "The program was compiled and run." },
    { type: "example", id: "c17-e2", level: "easy", title: "Static scope: which x does f print?", file: "static_scope_trace.c", given: `#include <stdio.h>

int x = 10;
void f(void) { printf("%d ", x); }
void g(void) { int x = 20; f(); printf("%d", x); }

int main(void) { g(); return 0; }`, find: "The output, and what it would be under dynamic scope.", steps: [
      { say: "f is written outside every function, so the x it sees is the global x: 10.", result: "f prints 10" },
      { say: "Back in g, its own local x is printed: 20.", result: "20" },
      { say: "Under dynamic scope, f would find the most recent x on the call chain, which is g's local 20, and print 20 20.", result: "dynamic: 20 20" },
    ], answer: "10 20 (static scope, which C uses)", check: "The program was compiled and run." },

    { type: "trap", wrong: "A formal parameter is the same variable as the actual in C.", tempting: "They have the same value at the start, and often the same name.", whyWrong: "C passes by value: the formal is a separate variable holding a copy. Changing it never changes the actual.", rule: "In C, only an address (a pointer) lets a function change the caller's variable.", ex: { code: "void fval(int x, int y) { x = x + 1; y = y + x; }\nint a = 5;\nfval(a, a);\nprintf(\"%d\", a);", out: "5" } },
    { type: "trap", wrong: "A name inside a function means the variable of whichever function called it.", tempting: "It seems natural that the most recent variable is the one used.", whyWrong: "That is dynamic scope, which C does not have. In C a name means the variable visible where the function is written.", rule: "C: static scope, looked up in the program text.", ex: { code: "int x = 10;\nvoid f(void) { printf(\"%d\", x); }\nvoid g(void) { int x = 20; f(); }", out: "10 (when g() is called)" } },
    { type: "gate", text: "No question of the bank's PDS tag is on this chapter alone. The ideas are the basis of the pointer questions (a function changes a variable through an address) and are asked directly, with pseudo-code, in the Compiler Design and programming-language questions of GATE: the standard comparison of call by value, reference, value-result and name for `f(a, a)`, and static against dynamic scope. Both patterns are worked above." },
    { type: "recall", cards: [
      { q: "What is a formal parameter?", a: "The name in the function's definition." },
      { q: "What does call by value do?", a: "Copies the value in; the caller's variable never changes." },
      { q: "What does call by reference do?", a: "The formal is another name for the actual variable." },
      { q: "What happens with f(a, a) by reference?", a: "x and y are aliases of the same variable a." },
      { q: "What does call by value-result do?", a: "Copies in, and copies the final value back out on return." },
      { q: "What does call by name do?", a: "Substitutes the text of the actual at each use." },
      { q: "Which passing mechanism does C use?", a: "Call by value (references are simulated with pointers)." },
      { q: "Which scope rule does C use?", a: "Static (lexical) scope." },
    ] },
    { type: "check", questions: [
      { id: "w1", kind: "NAT", marks: 1, q: "void f(int x, int y) { x = x + 1; y = y + x; } int a = 5; f(a, a); What is a? (C, call by value)", answer: "5", solution: "The function changes copies." },
      { id: "w2", kind: "NAT", marks: 1, q: "The same code with call by reference (x and y are names for a, a = 5). What is a afterwards?", answer: "12", solution: "a = 6, then a = 6 + 6 = 12." },
      { id: "w3", kind: "NAT", marks: 2, q: "The same code with call by value-result (copy in, copy out left to right, the last wins), a = 5. What is a afterwards?", answer: "11", solution: "x = 6, y = 5 + 6 = 11; y is copied out last." },
      { id: "w4", kind: "MCQ", marks: 1, q: "Which parameter-passing rule does C use for every argument?", options: ["call by reference", "call by value", "call by name", "call by value-result"], answer: "B", solution: "C always copies the value." },
      { id: "w5", kind: "MCQ", marks: 1, q: "int x = 10; void f(void) { printf(\"%d\", x); } void g(void) { int x = 20; f(); } What does g() print in C?", options: ["10", "20", "30", "nothing"], answer: "A", solution: "Static scope: f sees the global x." },
      { id: "w6", kind: "NAT", marks: 2, q: "Under dynamic scope, what would g() of the previous question print?", answer: "20", solution: "The most recent x on the call chain is g's local 20." },
      { id: "w7", kind: "MSQ", marks: 2, q: "Which are true?", options: ["C passes arguments by value", "Under call by reference, f(a, a) makes x and y aliases", "C uses dynamic scope", "A pointer parameter lets a function change the caller's variable"], answer: "A, B, D", solution: "C is false: C uses static scope." },
      { id: "w8", kind: "NAT", marks: 2, q: "void f(int *x, int *y) { *x = *x + 1; *y = *y + 1; } int a = 5; f(&a, &a); What is a?", answer: "7", solution: "Two increments of the same box." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on C programs", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: files and errors", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Functions (C6)", "Scope and storage (C7)", "Pointers I (C10)"], usedIn: ["Reading code (C19)", "Output prediction (C20)"], cross: ["Compiler design: parameter passing, scope"] },
  ],
};
