import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 21 "Previous-year patterns and mixed practice" (28 Nov 2026). The count of real questions (56 questions, 88 marks over chapters 2 to 19) comes from
 * docs/study-materials/v2/programming-and-data-structures/pds-pyq-tags.tsv. The two combined examples and every answer of the mixed set were compiled and run
 * or taken from variations that were compiled and run in the chapter named in each solution.
 */
export const chapterC21: Topic = {
  id: "cs.pds.c.practice21",
  title: "Previous-year patterns and mixed practice",
  no: "21",
  book: [
    { t: "p", text: "This is the last chapter of Programming in C, and it has a different job. The earlier chapters taught one idea at a time. A real paper does not: a single question can use a loop, a pointer and a macro together, and nothing tells you which chapter to open. So this chapter does three things. It maps **every real question** of the bank back to its chapter and its pattern. It shows how the patterns **combine**. And it gives you a **mixed set** to solve without knowing the chapter in advance." },
    { t: "p", text: "Use it after the others, not instead of them. If a question in the mixed set stops you, the solution names the chapter to reread. The goal is to reach the point where you look at a program and, before tracing, can say 'this is the unsigned trap' or 'this is a static in a recursion'." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["say for any C question which chapter's idea it is built on;", "recognise the eight patterns that the real questions of this bank follow;", "handle a question that combines two or three patterns, with a table;", "judge where the marks are, and where to spend your time;", "review your mistakes by pattern, not by question."] },

    { t: "h2", text: "The real questions, chapter by chapter" },
    { t: "p", text: "The bank holds **56 questions worth 88 marks** that are about C programming and are tagged to chapters 2 to 19 of this book. The table says how many there are in each chapter, and how many marks they carry. Recursion has the most (12 questions, 20 marks), followed by pointers with arrays (7 questions, 11 marks); nothing else is close." },
    { t: "fig", id: "c21-f1" },
    { t: "p", text: "The numbers are a guide to where the marks have been, not a promise of where they will be. But the shape is stable: the questions are about **following code exactly**, and the chapters that teach that most directly, recursion, pointers, static variables, operators and loops, are the ones that have supplied the most." },
    { t: "callout", kind: "note", text: "The data structures chapters (linked lists, trees, heaps, graphs) of the second part of the book carry many more questions. The count above is only for the C programming chapters 2 to 19." },

    { t: "h2", text: "The eight patterns" },
    { t: "p", text: "Looking across the 56 questions, each fits one of eight patterns. Every pattern has a tell-tale shape, a chapter and a method; naming the pattern in the first ten seconds tells you what to do next." },
    { t: "table", head: ["Pattern", "Tell-tale", "Chapters", "Method"], rows: [["1. Trace a short program", "assignments, `++`, a few lines", "3, 4, 10", "one table row per statement"], ["2. Count loop passes", "`for` with `i *= 2`, `j += i`, nested loops", "5", "inner count as a function of the outer variable"], ["3. Recursion: value, order, count", "a function that calls itself", "8", "frames; before/after the call; call tree"], ["4. Static, scope and shadowing", "`static`, same name twice", "7", "a column for the static; nearest declaration"], ["5. Pointers and arrays", "`*p++`, `a + 1`, `arr[1] + 9`", "9, 10, 11", "draw cells and arrows; row-major formula"], ["6. Strings", "`while (*t)`, `strlen`, `2[p]`", "12", "walk the pointer; mind the null"], ["7. Structures and heap", "`struct`, `malloc`, `next`", "14, 15", "padding; leaks; uninitialised pointers"], ["8. Read the mystery function", "digit loops, subtraction, doubling and adding", "19", "small input, pattern, check"]] },
    { t: "p", text: "**Pattern 1: trace a short program.** The commonest and the easiest to lose marks on. Examples in this bank: the six assignments through a pointer (2026 AN Q60), prefix and postfix (2017 AN Q58), `&&` with `i++` (2021 FN Q58). The only way to go wrong is to skip a row." },
    { t: "p", text: "**Pattern 2: count the loop passes.** Four questions (2024 FN Q21 and Q47, 2019 FN Q48, 2017 AN Q53) ask for a number of iterations, a final value, or whether a loop ends. The tells are a variable that is changed in an unexpected way (`a = a / 12 + 1`, `x = x + x + y`) and a test whose exact boundary matters (`>` against `>=`)." },
    { t: "p", text: "**Pattern 3: recursion.** The biggest group. Some ask for the value returned (the smallest n with `foo(n) = 5`), some for the order of output (4321, or 53423122233445), some for the number of calls (4), some whether it ends. The method is always frames, and for output questions, 'before the call: forward; after the call: backward'." },
    { t: "p", text: "**Pattern 4: static, scope and shadowing.** Five questions ask what a `static` variable remembers (7, 52, 23) and one which of two variables with the same name is printed (9). A column for the static, and the rule 'nearest enclosing declaration', answer all of them." },
    { t: "p", text: "**Pattern 5: pointers and arrays.** Eleven questions in this group, from the plain (`ip[1]`) to the nested (`*(*(a + **a + 2) + 3)`) to the swap of two string pointers. The tools are the cell-and-arrow picture, the rule that `p + 1` moves one element, and the row-major layout of two-dimensional arrays." },
    { t: "p", text: "**Pattern 6: strings.** Three questions (copying a string onto itself, length by pointer difference, `strlen` of a computed address). The tell is a loop that stops at the null, and the question is almost always what is **left** after the loop." },
    { t: "p", text: "**Pattern 7: structures and the heap.** Four questions, each on a single fact: a struct of chars has no padding (2018 FN Q12), only `malloc` memory is on the heap (2026 AN Q17), a list whose last pointer was not set (2021 AN Q35), a block lost when its only pointer is overwritten (2017 FN Q32)." },
    { t: "p", text: "**Pattern 8: read the mystery function.** Five questions (every second digit, gcd by subtraction, Horner's rule, binary exponentiation, a window over an array). Each is a standard algorithm in disguise: find it on a small input, and the big input is a calculation." },

    { t: "h2", text: "When the patterns combine" },
    { t: "p", text: "A recent trend is to combine patterns, so that two ideas are needed at once, such as recursion over a pointer that moves along an array (2025 FN Q61), or a static counter inside a recursion (2020 FN Q48). The method is the same, but the table has more columns: one for every variable and, for a recursion, one for the frame. Two combined examples follow." },
    { t: "ex", id: "c21-e1" },
    { t: "ex", id: "c21-e2" },
    { t: "callout", kind: "tip", text: "For a combined question, write down **first** the list of patterns you see (for example: recursion + pointer move + global counter). Then build one table with a column for each variable that the patterns involve." },

    { t: "trap", i: 0 },

    { t: "h2", text: "Reading a question in thirty seconds" },
    { t: "p", text: "Before you trace anything, spend half a minute on a first look. Read the **notes** at the end of the question (assumptions, 'ignore syntax errors'), then the **question itself** (a number, a statement that is true, an option about termination), then glance at the code for the **tell-tale** symbols. The symbols usually name the pattern." },
    { t: "fig", id: "c21-f2" },
    { t: "p", text: "If the glance shows two tell-tales, the question combines two patterns, and you should plan the table before starting. If it shows none you recognise, it is probably a mystery function: trace it on a tiny input." },

    { t: "h2", text: "Marks, time and review" },
    { t: "p", text: "A one-mark question has about 90 seconds in the exam, a two-mark question about three minutes, and the whole paper 180 minutes for 65 questions. Output questions look short but cost the most time: the table is the work. Do the easy ones first, and mark for later any question where you cannot name the pattern within thirty seconds." },
    { t: "p", text: "After a practice session, **review by pattern**. For every wrong answer, write down which of the eight patterns it was, and which row of the checklist (chapter 20) you skipped. After ten wrong answers you will see that two or three rows account for most of them, and those are the ones to drill." },
    { t: "p", text: "The mixed set that follows, in the exercises, has twelve questions drawn from all the patterns, not in chapter order. Cover the chapter names in the solutions, try each one with a table, and only then read the solution." },
    { t: "callout", kind: "remember", text: "Name the pattern. Draw the boxes. One row per statement. Check the checklist. Write the answer exactly as the program would print it." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["The bank has 56 real questions (88 marks) on C programming; recursion, pointers with arrays, loops, operators and static variables supply most of them.", "Eight patterns cover them: tracing, counting loop passes, recursion, static and scope, pointers and arrays, strings, structures and the heap, mystery functions.", "Name the pattern first; the method follows from it.", "For combined questions, list the patterns and build one table with a column per variable.", "Review mistakes by pattern, and drill the checklist rows you skip most."] },
  ],
  blocks: [
    { type: "figure", id: "c21-f1", caption: "Real GATE questions on C programming by chapter (bank of 2017 to 2026): 56 questions, 88 marks.", alt: "A table of chapter, topic, number of questions and marks, with recursion the largest.", fig: { kind: "trace", title: "Questions and marks per chapter", cols: ["Chapter", "Topic", "Questions", "Marks"], rows: [{ cells: ["2", "Variables and data types", 1, 2] }, { cells: ["3", "Operators", 4, 7] }, { cells: ["5", "Loops", 4, 7] }, { cells: ["6", "Functions", 4, 5] }, { cells: ["7", "Scope and storage", 5, 7] }, { cells: ["8", "Recursion", 12, 20], tone: "hl" }, { cells: ["9", "Arrays", 2, 4] }, { cells: ["10", "Pointers I", 4, 5] }, { cells: ["11", "Pointers II", 7, 11], tone: "hl" }, { cells: ["12", "Strings", 3, 4] }, { cells: ["13", "Pointers III", 1, 2] }, { cells: ["14", "Structures", 1, 1] }, { cells: ["15", "Dynamic memory", 3, 4] }, { cells: ["19", "Mystery functions", 5, 9] }, { cells: ["", "Total", 56, 88], tone: "ok" }] } },

    { type: "figure", id: "c21-f2", caption: "What to look for in the first thirty seconds. The symbols in the code name the pattern.", alt: "A table of the symbols seen in the code and the pattern and chapter each one points to.", fig: { kind: "matrix", title: "First glance", cols: ["Pattern", "Chapter"], rows: [{ label: "i++, ++i, &&, ||, &, ==", cells: ["trace a short program", "3, 4"] }, { label: "for with i *= 2, j += i; while with a strange update", cells: ["count loop passes", "5"] }, { label: "a function that calls itself; a print before or after", cells: ["recursion", "8"] }, { label: "static, the same name twice", cells: ["static and scope", "7"] }, { label: "*p++, a + 1, arr[1] + 9, **pp", cells: ["pointers and arrays", "9, 10, 11, 13"] }, { label: "*t, strlen, the null, 2[p]", cells: ["strings", "12"] }, { label: "struct, malloc, next, free", cells: ["structures and the heap", "14, 15"] }, { label: "n % 10, x * total + y, x - y until x == y", cells: ["mystery function", "19"] }] } },
    { type: "example", id: "c21-e1", level: "gate", title: "Recursion + a pointer that moves + a global counter", file: "combined_one.c", given: `#include <stdio.h>

int cnt = 0;

int f(int *a, int n) {
    cnt++;
    if (n == 0) return 0;
    return *a + f(a + 1, n - 1);
}

int main(void) {
    int v[4] = {3, 1, 4, 1};
    int r = f(v, 4);
    printf("%d %d", r, cnt);
    return 0;
}`, find: "The output. (Patterns: recursion, pointer arithmetic, a global counter.)", steps: [
      { say: "f(v, 4): cnt = 1, *a = 3, then f(a + 1, 3): the pointer moves one element on and n drops by 1.", result: "calls so far: 1" },
      { say: "f(·, 3): cnt = 2, *a = 1. f(·, 2): cnt = 3, *a = 4. f(·, 1): cnt = 4, *a = 1.", result: "cnt = 4" },
      { say: "f(·, 0): cnt = 5 and it returns 0 (base case). The sums come back: 1 + 0, then 4 + 1, then 1 + 5, then 3 + 6.", result: "9" },
      { say: "Notice cnt counts calls, including the last one with n = 0: five calls for four elements.", result: "cnt = 5" },
    ], answer: "9 5", check: "The program was compiled and run." },
    { type: "example", id: "c21-e2", level: "gate", title: "A macro in a loop, then a pointer walk", file: "combined_two.c", given: `#include <stdio.h>

#define SQ(x) ((x) * (x))

int main(void) {
    int i = 1, s = 0;
    while (i <= 3) {
        s += SQ(i);
        i++;
    }
    printf("%d %d ", s, i);

    char *p = "abcde";
    int n = 0;
    while (*p++)
        n++;
    printf("%d", n);
    return 0;
}`, find: "The output. (Patterns: a macro, a loop, a pointer over a string.)", steps: [
      { say: "SQ(i) is ((i) * (i)): the macro has brackets, and i is not changed inside it. The loop adds 1, 4, 9.", result: "s = 14" },
      { say: "The loop ends when i is 4.", result: "i = 4" },
      { say: "*p++ reads the character and then moves p, so the loop runs once for each of the five letters, and stops when it reads the null.", result: "n = 5" },
    ], answer: "14 4 5", check: "The program was compiled and run." },

    { type: "trap", wrong: "Each question belongs to one chapter, so I can solve it with one idea.", tempting: "The chapters were taught one at a time.", whyWrong: "Recent papers combine ideas: a recursion over a moving pointer, a macro inside a loop, a static counter in a recursion. Using only one of the ideas gives a wrong answer that looks right.", rule: "List every pattern you see, then build a table with a column for each variable.", ex: { code: ["int cnt = 0;", "int f(int *a, int n) { cnt++; if (n == 0) return 0; return *a + f(a + 1, n - 1); }", "/* with v = {3, 1, 4, 1}: */", "int r = f(v, 4);", "printf(\"%d %d\", r, cnt);"].join("\n"), out: "9 5", text: "Both the sum (a pointer walk) and the call count (a recursion with a global) are needed." } },
    { type: "gate", text: "Over the ten years of the bank, 56 questions worth 88 marks are on C programming and fall into the eight patterns above: recursion (12 questions), pointers and arrays (11 across chapters 10, 11 and 13), static and scope (6), operators and loops (8 each of 4), reading mystery functions (5), functions (4), strings (3), dynamic memory (3), arrays (2), structures (1) and data types (1)." },
    { type: "recall", cards: [
      { q: "How many real C-programming questions are in the bank (chapters 2 to 19)?", a: "56, worth 88 marks." },
      { q: "Which chapter has the most?", a: "Recursion: 12 questions, 20 marks." },
      { q: "What are the first things to do with a new question?", a: "Name the pattern, draw the boxes, write one row per statement." },
      { q: "How should you review wrong answers?", a: "By pattern, and by the checklist row you skipped." },
      { q: "What do you do with a combined question?", a: "List the patterns, then one table with a column per variable." },
      { q: "How much time has a 2-mark question?", a: "About three minutes." },
    ] },
    { type: "check", questions: [
      { id: "x1", kind: "NAT", marks: 1, q: "unsigned char c = 250; c = c + 10; What is c? (chapter 2)", answer: "4", solution: "260 mod 256 = 4." },
      { id: "x2", kind: "NAT", marks: 1, q: "int x = 12; What is x & (x - 1)? (chapter 3)", answer: "8", solution: "1100 & 1011 = 1000." },
      { id: "x3", kind: "NAT", marks: 1, q: "int c = 0; for (int i = 0; i < 16; i++) for (int j = 0; j < i; j++) c++; What is c? (chapter 5)", answer: "120", solution: "0 + 1 + … + 15." },
      { id: "x4", kind: "NAT", marks: 1, q: "int counter(void) { static int n = 0; n++; return n; }  What does the third call return? (chapter 7)", answer: "3", solution: "The static keeps its value." },
      { id: "x5", kind: "NAT", marks: 2, q: "int bar(int n){ if (n == 1) return 0; return 1 + bar(n/2); }  What is bar(64)? (chapter 8)", answer: "6", solution: "Six halvings." },
      { id: "x6", kind: "NAT", marks: 2, q: "int fib(int n) { if (n < 2) return n; return fib(n-1) + fib(n-2); }  How many calls does fib(4) make? (chapter 8)", answer: "9", solution: "The call tree has nine nodes." },
      { id: "x7", kind: "NAT", marks: 2, q: "int a[3][3][3] holds 1 to 27 in order. What is a[2][1][2]? (chapter 9)", answer: "24", solution: "Element number (2 × 3 + 1) × 3 + 2 = 23, so the value is 24." },
      { id: "x8", kind: "NAT", marks: 2, q: "int a[4][5] with a[i][j] = 10 * i + j. What is *(a[2] + 3)? (chapter 11)", answer: "23", solution: "a[2][3]." },
      { id: "x9", kind: "NAT", marks: 2, q: "char *c = \"GATECSIT2017\"; What is strlen(c + 3)? (chapter 12)", answer: "9", solution: "ECSIT2017 has 9 characters." },
      { id: "x10", kind: "NAT", marks: 1, q: "struct { char a; int b; char c; } What is its size with a 4-byte int? (chapter 14)", answer: "12", solution: "a at 0, b at 4, c at 8, rounded to 12." },
      { id: "x11", kind: "MCQ", marks: 1, q: "int *x = malloc(sizeof(int)); x = malloc(sizeof(int)); free(x); What is the problem? (chapter 15)", options: ["a dangling pointer", "a memory leak", "a double free", "none"], answer: "B", solution: "The first block's only pointer was overwritten." },
      { id: "x12", kind: "NAT", marks: 2, q: "pp(a, b) computes a to the power b by squaring and multiplying at the 1 bits of b. What is pp(2, 10)? (chapter 19)", answer: "1024", solution: "2¹⁰." },
      { id: "x13", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["A function gets copies of its arguments (chapter 6)", "(*p)++ moves the pointer p (chapter 11)", "x & 1 == 0 tests that x is even (chapter 3)", "strcpy copies the terminating null (chapter 12)"], answer: "A, D", solution: "B: it changes the element, not p. C: == binds tighter than &." },
      { id: "x14", kind: "NAT", marks: 2, q: "int cnt = 0; int f(int *a, int n) { cnt++; if (n == 0) return 0; return *a + f(a + 1, n - 1); }  With v = {2, 2, 2}: r = f(v, 3). What is r + cnt?", answer: "10", solution: "r = 6; the calls are n = 3, 2, 1, 0: cnt = 4; 6 + 4." },
    ] },
    { type: "practice", links: [{ label: "All the real GATE questions on C programs", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "then: the data structures chapters", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Chapters 2 to 20"], usedIn: ["Data structures (D0 to D16)"], cross: ["Algorithms: program analysis"] },
  ],
};
