import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 13 "Pointers III: pointer to pointer, function pointers, reading declarations, const" (28 Nov 2026). Real GATE question explained in full:
 * 2018_FN_Q39 (swapping two char * by value and by address). Every program was compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC13: Topic = {
  id: "cs.pds.c.ptr3",
  title: "Pointers III: pointer to pointer, function pointers, declarations, const",
  no: "13",
  book: [
    { t: "p", text: "Chapters 10 and 11 gave you pointers to variables and to array elements. This chapter takes the same ideas one level further. A pointer is itself a variable, so it has an address, and you can point at it. A function is code in memory, so it has an address, and you can point at that too. And once the symbols pile up, `int *p[3]` against `int (*p)[3]`, you need a reliable way to read a declaration." },
    { t: "p", text: "None of this is new machinery. Each step is the same two operators, `&` (the address of) and `*` (follow it), applied once more. One real GATE question, on swapping two strings, is worked in full." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["draw and follow a pointer to a pointer (`**pp`);", "explain why a function needs a `char **` to change a caller's `char *`, and a plain `char *` is not enough;", "declare and call a function through a function pointer, and pass one as an argument;", "read any declaration with a pointer, an array and a function in it;", "tell `const int *p`, `int *const p` and `const int *const p` apart."] },

    { t: "h2", text: "Pointer to pointer" },
    { t: "p", text: "A pointer is a variable, so it lives at an address like any other. A **pointer to a pointer** holds that address. It is declared with two stars: `int **pp;` means `pp` points at a box that holds a pointer to an `int`. Following it takes two stars as well: `*pp` is the pointer, and `**pp` is the `int` that pointer points at." },
    { t: "fig", id: "c13-f1" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;          /* p holds the address of x */
    int **pp = &p;        /* pp holds the address of p */
    **pp = 7;             /* follow pp, then p: write into x */
    printf("%d %d %d\\n", x, *p, **pp);
    return 0;
}`, out: "7 7 7", file: "pointer_to_pointer.c" },
    { t: "callout", kind: "key", text: "Each star follows one arrow. `pp` → `p` → `x`: `*pp` is `p`, and `**pp` is `x`. Count the arrows and you know how many stars you need." },
    { t: "p", text: "The rule `*&x` is `x` (chapter 10) goes up a level as well: `*&p` is `p`, and `**&p` is `*p`, which is `x`. In an expression, a star removes one level of pointer; an ampersand adds one." },

    { t: "h2", text: "Changing a pointer in a function" },
    { t: "p", text: "A function gets **copies** of its arguments (chapter 6). If the argument is a pointer, the function gets a copy of the pointer. It can follow the copy to change what it points **at**, but if it changes the copy itself, to make it point somewhere else, the caller's pointer is unaffected. This is the same lesson as `swap(int, int)` against `swap(int *, int *)`, one level up." },
    { t: "p", text: "To make a function change **where a pointer points**, you must give it the address of the pointer: a pointer to a pointer. The function then follows that address and changes the caller's pointer." },
    { t: "code", text: `#include <stdio.h>

void setp(int **pp, int *q) {
    *pp = q;                    /* change the caller's pointer */
}

int main(void) {
    int a = 1, b = 2;
    int *p = &a;
    setp(&p, &b);               /* p now points at b */
    printf("%d\\n", *p);
    return 0;
}`, out: "2", file: "change_caller_pointer.c" },
    { t: "callout", kind: "shortcut", text: "To change an `int` in the caller, pass an `int *`. To change an `int *` in the caller, pass an `int **`. To change a `char *` (a string pointer), pass a `char **`. One more star every time the thing to change is one level higher." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Arrays of pointers" },
    { t: "p", text: "An array of pointers is a row of addresses. The commonest use is a table of strings: `char *names[3] = {\"ab\", \"cde\", \"f\"};` holds three pointers, each at the first character of a string literal. The array itself takes the room of three pointers (24 bytes on a 64-bit machine), whatever the lengths of the strings." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    char *names[3] = {"ab", "cde", "f"};
    printf("%s %c %zu\\n", names[1], names[1][2], sizeof(names));
    return 0;
}`, out: "cde e 24", file: "array_of_strings.c" },
    { t: "p", text: "Here `names[1]` is a pointer to the string \"cde\", so `names[1][2]` (the third character of that string) is `'e'`. The type of `names` is 'array of pointers to char', and when it is passed to a function it becomes a `char **`, which is exactly the type of `argv` in `int main(int argc, char *argv[])`." },

    { t: "h2", text: "Function pointers" },
    { t: "p", text: "The code of a function sits in memory and has an address. The name of a function, used without brackets, is that address. A **function pointer** holds it. It is declared with the return type, the star in brackets, and the parameter types: `int (*f)(int, int);` means `f` points at a function that takes two `int`s and returns an `int`. The brackets round `*f` matter, as the next section shows." },
    { t: "code", text: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

void apply(int (*op)(int, int), int x, int y) {
    printf("%d\\n", op(x, y));          /* call whatever op points at */
}

int main(void) {
    int (*f)(int, int) = add;          /* f points at add */
    printf("%d ", f(3, 4));
    f = mul;                           /* now at mul */
    printf("%d\\n", f(3, 4));
    apply(add, 5, 6);
    apply(mul, 5, 6);
    return 0;
}`, out: "7 12\n11\n30", file: "function_pointers.c" },
    { t: "p", text: "A function pointer can be called like a function, `f(3, 4)`, or with the star, `(*f)(3, 4)`; both mean the same. Passing a function as an argument, as `apply` does, is the way C writes a **callback**: `qsort` takes the comparison function this way." },
    { t: "code", text: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

int main(void) {
    int (*ops[2])(int, int) = {add, mul};    /* an array of function pointers */
    printf("%d %d\\n", ops[0](2, 3), ops[1](2, 3));
    return 0;
}`, out: "5 6", file: "function_pointer_array.c" },

    { t: "p", text: "The library function `qsort` is the standard example of a callback. It sorts any array, of any type, and does not know how to compare two elements; you hand it a function pointer, and it calls your comparison function whenever it needs to decide which of two elements comes first. The sorting code stays the same, and the function pointer changes what 'smaller' means." },

    { t: "h2", text: "Reading declarations" },
    { t: "p", text: "A declaration reads best from the **name outwards**, using two facts: the postfix symbols `[ ]` (array) and `( )` (function) bind tighter than the star, and brackets override. Start at the name, say what you see on the right (an array? a function?), then on the left (a star? a type?), and move outwards one step at a time." },
    { t: "table", head: ["Declaration", "Read from the name", "Meaning", "sizeof (64-bit)"], rows: [["`int *p[3]`", "p is an array of 3, of pointers to int", "three pointers", "24"], ["`int (*p)[3]`", "p is a pointer to an array of 3 ints", "one pointer", "8"], ["`int *f(int)`", "f is a function taking int, returning pointer to int", "a function", "—"], ["`int (*f)(int)`", "f is a pointer to a function taking int, returning int", "one pointer", "8"], ["`int **pp`", "pp is a pointer to a pointer to int", "one pointer", "8"]] },
    { t: "callout", kind: "tip", text: "Whenever a star and a `[ ]` or `( )` meet, the brackets win unless there are round brackets round the star. That is why `*p[3]` is an array of pointers, but `(*p)[3]` is a pointer to an array." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    printf("%zu %zu %zu\\n", sizeof(int *[3]), sizeof(int (*)[3]), sizeof(int (*)(int)));
    int a[3] = {1, 2, 3};
    int (*pa)[3] = &a;                       /* a pointer to the whole array */
    printf("%d %d\\n", (*pa)[1], (int)sizeof(*pa));
    return 0;
}`, out: "24 8 8\n2 12", file: "reading_declarations.c" },
    { t: "p", text: "A pointer to an array is also what a two-dimensional array turns into when it is passed to a function: `int (*p)[2]` points at a row of two `int`s, and `p + 1` moves a whole row, exactly as in chapter 11." },
    { t: "p", text: "Long declarations become easier to read with a `typedef`, which gives a type a short name. After `typedef int (*op_t)(int, int);` the name `op_t` means 'pointer to a function taking two ints and returning an int', so `void apply(op_t op, int x, int y)` is the same function as before, written so that it can be read at a glance." },
    { t: "trap", i: 1 },

    { t: "h2", text: "const and pointers" },
    { t: "p", text: "The word `const` promises that something will not be changed. With a pointer there are two things that could be protected, the box the pointer points at and the pointer itself, and the position of `const` says which." },
    { t: "table", head: ["Declaration", "Read as", "You may not change", "You may change"], rows: [["`const int *p`", "pointer to a constant int", "`*p` (the box, through p)", "p (point it elsewhere)"], ["`int *const p`", "constant pointer to an int", "p (it always points here)", "`*p` (the box)"], ["`const int *const p`", "constant pointer to a constant int", "both", "neither"]], caption: "A good rule: `const` applies to what is immediately to its left (or, at the start, to the type just after it)." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int x = 5, y = 9;
    const int *p = &x;        /* cannot write *p = ..., but x itself can change */
    x = 6;
    printf("%d\\n", *p);
    int *const q = &x;        /* q cannot point elsewhere */
    *q = 8;
    printf("%d %d\\n", x, y);
    return 0;
}`, out: "6\n8 9", file: "const_pointers.c" },
    { t: "p", text: "Notice that `const int *p` does not make `x` constant; it only forbids writing **through p**. The variable can still be changed by its own name, and the pointer then sees the new value." },
    { t: "p", text: "`const` is most often used on function parameters. A function declared `void show(const char *s)` promises not to modify the string it is given, and the compiler enforces it. A caller can then pass a string literal or a modifiable array without worry. When you write a function that only reads through a pointer, make the parameter `const`." },
    { t: "trap", i: 2 },
    { t: "ex", id: "c13-e2" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2018 (forenoon), Q39: swapping two strings" },
    { t: "p", text: "A two-mark multiple-choice question with two swap functions that look almost the same. One swaps the two string **pointers** it was given, the other swaps the **caller's** pointers through their addresses. The program prints the two strings after each call." },
    { t: "ex", id: "c13-e1" },
    { t: "fig", id: "c13-f2" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "The difference between changing a copy and changing the original, at the level of pointers. `fun1(char *s1, char *s2)` receives **copies** of `str1` and `str2`. It swaps the copies: its own `s1` and `s2` now point to the other strings, but `str1` and `str2` in `main` still point where they did. So the first print is `Hi Bye`. `fun2(char **s1, char **s2)` receives the **addresses** of `str1` and `str2`. It follows them (`*s1`, `*s2`) and swaps the caller's pointers, so after it, `str1` points at \"Bye\" and `str2` at \"Hi\". The second print is `Bye Hi`. The output is `Hi Bye Bye Hi`: option A." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option C, Bye Hi Hi Bye.** The student thinks fun1 works: the swap is real but local.", "**Option D, Bye Hi Bye Hi.** The student thinks both functions swap.", "**Option B, Hi Bye Hi Bye.** The student thinks neither swaps; fun2 changes the caller's pointers because it was given their addresses."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["only `fun2(&str1, &str2)` is called", "the caller's pointers are swapped once", "Bye Hi"], ["`fun2` is called twice in a row", "swapped, then swapped back", "Hi Bye"], ["`fun1(str1, str2)` then `fun1(str1, str2)`", "copies only; nothing changes", "Hi Bye"]], caption: "The question's own program was compiled and run; the others follow the same rule." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A pointer to a pointer (`int **pp`) holds the address of a pointer; each star follows one arrow.", "To make a function change a caller's pointer, pass the pointer's address (`char **`), not the pointer.", "An array of pointers (`char *names[3]`) is a row of addresses, the usual way to hold several strings.", "A function pointer (`int (*f)(int, int)`) holds a function's address and is called like the function; it is passed to other functions as a callback.", "Read a declaration from the name outwards: `[ ]` and `( )` bind tighter than `*`, and brackets override.", "`const int *p` protects the box; `int *const p` protects the pointer; `const int *const p` protects both."] },
  ],
  blocks: [
    { type: "figure", id: "c13-f1", caption: "pp holds the address of p, and p holds the address of x. **pp is x, and writing 7 through it changes x.", alt: "Three boxes: pp holds the address of p, p holds the address of x, and x holds 7.", fig: { kind: "memory", title: "int x = 10; int *p = &x; int **pp = &p; **pp = 7;", cells: [{ id: "x", addr: 1000, name: "x", value: 7, tone: "ok" }, { id: "p", addr: 1004, name: "p", value: 1000, ptr: "x" }, { addr: 1012, name: "pp", value: 1004, ptr: "p", tone: "hl" }] } },
    { type: "figure", id: "c13-f2", caption: "GATE 2018 FN Q39. fun1 swaps copies, so str1 and str2 are unchanged. fun2 swaps through their addresses, so the caller's pointers are exchanged.", alt: "Three frames: before, after fun1 (unchanged) and after fun2 (swapped).", fig: { kind: "frames", title: "fun1(str1, str2) then fun2(&str1, &str2)", frames: [
      { caption: "Start: str1 points at \"Hi\" and str2 at \"Bye\".", fig: { kind: "memory", cells: [{ id: "hi", addr: 3000, name: "\"Hi\"", value: "H i", tone: "dim" }, { id: "bye", addr: 3010, name: "\"Bye\"", value: "B y e", tone: "dim" }, { addr: 1000, name: "str1", value: 3000, ptr: "hi" }, { addr: 1008, name: "str2", value: 3010, ptr: "bye" }] } },
      { caption: "After fun1: it swapped its own copies of the pointers. str1 and str2 are unchanged: prints Hi Bye.", fig: { kind: "memory", cells: [{ id: "hi", addr: 3000, name: "\"Hi\"", value: "H i", tone: "dim" }, { id: "bye", addr: 3010, name: "\"Bye\"", value: "B y e", tone: "dim" }, { addr: 1000, name: "str1", value: 3000, ptr: "hi" }, { addr: 1008, name: "str2", value: 3010, ptr: "bye" }] } },
      { caption: "After fun2: it followed the addresses and swapped the caller's pointers. Prints Bye Hi.", fig: { kind: "memory", cells: [{ id: "hi", addr: 3000, name: "\"Hi\"", value: "H i", tone: "dim" }, { id: "bye", addr: 3010, name: "\"Bye\"", value: "B y e", tone: "dim" }, { addr: 1000, name: "str1", value: 3010, ptr: "bye", tone: "ok" }, { addr: 1008, name: "str2", value: 3000, ptr: "hi", tone: "ok" }] } },
    ] } },

    { type: "example", id: "c13-e1", level: "gate", title: "GATE CS 2018 (forenoon), Q39 · 2 marks · MCQ", file: "gate2018_q39.c", given: `#include<stdio.h>

void fun1(char *s1, char *s2){
    char *tmp;
    tmp = s1;
    s1 = s2;
    s2 = tmp;
}

void fun2(char **s1, char **s2){
    char *tmp;
    tmp = *s1;
    *s1 = *s2;
    *s2 = tmp;
}

int main(){
    char *str1 = "Hi", *str2 = "Bye";
    fun1(str1, str2); printf("%s %s ", str1, str2);
    fun2(&str1, &str2); printf("%s %s", str1, str2);
    return 0;
}`, find: "The output. Options: (A) Hi Bye Bye Hi  (B) Hi Bye Hi Bye  (C) Bye Hi Hi Bye  (D) Bye Hi Bye Hi", steps: [
      { say: "fun1 receives copies of str1 and str2. It swaps the copies, which are thrown away on return.", result: "str1, str2 unchanged" },
      { say: "The first printf prints the original pointers' strings.", result: "Hi Bye" },
      { say: "fun2 receives &str1 and &str2. *s1 is str1 and *s2 is str2 themselves, so the swap changes the caller's pointers.", result: "str1 -> \"Bye\", str2 -> \"Hi\"" },
      { say: "The second printf prints them.", result: "Bye Hi" },
    ], answer: "(A) Hi Bye Bye Hi", check: "Official answer (A). The program was compiled and run." },

    { type: "example", id: "c13-e2", level: "easy", title: "Trace by hand: two stars and a const", file: "ptr3_trace.txt", given: `int x = 5, y = 9;
int *p = &x;
int **pp = &p;
**pp = 8;        /* follow two arrows: write into x */
*pp = &y;        /* follow one arrow: change where p points */
**pp = 1;        /* now two arrows lead to y */`, find: "The values of x and y at the end, and where p points.", steps: [
      { say: "pp holds the address of p, p holds the address of x. **pp = 8 follows both arrows and writes 8 into x.", result: "x = 8" },
      { say: "*pp = &y follows one arrow, reaching p itself, and makes p point at y instead.", result: "p -> y" },
      { say: "Now **pp follows pp to p, and p to y. **pp = 1 writes 1 into y.", result: "y = 1" },
    ], answer: "x = 8, y = 1, p points at y.", check: "The number of stars says how many arrows are followed: one star reaches the pointer, two reach the int." },
    { type: "trap", wrong: "A function with a char * parameter can change which string the caller's pointer points at.", tempting: "It receives the pointer, so it seems to have control of it.", whyWrong: "It receives a copy of the pointer. Writing through the copy changes the characters, but assigning to the copy only moves the copy. To change the caller's pointer you must pass its address.", rule: "To change a pointer in the caller, pass a pointer to it.", ex: { code: "fun1(str1, str2);   /* swaps copies */\nprintf(\"%s %s\", str1, str2);", out: "Hi Bye" } },
    { type: "trap", wrong: "int *p[3] and int (*p)[3] are the same.", tempting: "They differ only by a pair of brackets.", whyWrong: "int *p[3] is an array of three pointers to int (24 bytes). int (*p)[3] is a single pointer to an array of three ints (8 bytes). The brackets change what the star applies to.", rule: "Brackets round *p make it a pointer first.", ex: { code: "printf(\"%zu %zu\", sizeof(int *[3]), sizeof(int (*)[3]));", out: "24 8" } },
    { type: "trap", wrong: "const int *p makes the variable p points at unchangeable.", tempting: "const is written next to the variable it applies to.", whyWrong: "It only forbids writing through p. The variable can still be changed by its own name, and p will see the new value. To forbid changing p itself, write int *const p.", rule: "const int *p: the box is read-only through p. int *const p: p is fixed.", ex: { code: "int x = 5;\nconst int *p = &x;\nx = 6;\nprintf(\"%d\", *p);", out: "6" } },
    { type: "gate", text: "One question has been asked on this chapter: swapping two char * by value and by address (2018 FN Q39, 2 marks), which is worked above. Function pointers, pointer-to-pointer and declarations are tested in the same output-prediction style in other years and in compiler-design questions." },
    { type: "recall", cards: [
      { q: "What does int **pp mean?", a: "pp points at a pointer to an int." },
      { q: "How many stars to reach the int from pp?", a: "Two: **pp." },
      { q: "How do you let a function change a caller's char *?", a: "Pass its address: a char **." },
      { q: "What is int (*f)(int, int)?", a: "A pointer to a function taking two ints and returning an int." },
      { q: "How do you call a function through f?", a: "f(3, 4) or (*f)(3, 4)." },
      { q: "What is int *p[3]?", a: "An array of three pointers to int." },
      { q: "What is int (*p)[3]?", a: "A pointer to an array of three ints." },
      { q: "What does const int *p forbid?", a: "Writing through p (*p = ...)." },
      { q: "What does int *const p forbid?", a: "Changing p to point elsewhere." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "int x = 10, *p = &x, **pp = &p; **pp = 7; What is x?", answer: "7", solution: "**pp is x." },
      { id: "h2", kind: "NAT", marks: 1, q: "int (*f)(int, int) = add; with int add(int a, int b) { return a + b; }  What is f(3, 4)?", answer: "7", solution: "f points at add." },
      { id: "h3", kind: "NAT", marks: 1, q: "char *names[3] = {\"ab\", \"cde\", \"f\"}; How many bytes is sizeof(names) on a 64-bit machine?", answer: "24", solution: "Three pointers of 8 bytes." },
      { id: "h4", kind: "MCQ", marks: 1, q: "To let a function change a caller's char *s so that it points elsewhere, the function's parameter should be:", options: ["char *", "char **", "char", "const char *"], answer: "B", solution: "A pointer to the pointer." },
      { id: "h5", kind: "MCQ", marks: 1, q: "What is int *p[3]?", options: ["a pointer to an array of 3 ints", "an array of 3 pointers to int", "a function returning a pointer", "a pointer to 3 pointers"], answer: "B", solution: "[ ] binds tighter than *." },
      { id: "h6", kind: "NAT", marks: 2, q: "char *a = \"Hi\", *b = \"Bye\"; With fun1(char *x, char *y) swapping its copies and fun2(char **x, char **y) swapping through addresses: after fun1(a, b); fun2(&a, &b); how many characters does printf(\"%s%s\", a, b) print? (Hint: what are a and b now?)", answer: "5", solution: "a is Bye and b is Hi: ByeHi, five characters." },
      { id: "h7", kind: "MSQ", marks: 2, q: "Which are true?", options: ["const int *p forbids *p = 3", "int *const p forbids p = &y", "int (*p)[3] is an array of three pointers", "A function name used without brackets is its address"], answer: "A, B, D", solution: "C is false: it is a pointer to an array." },
      { id: "h8", kind: "NAT", marks: 2, q: "int x = 5, y = 9; int *const q = &x; *q = 8; What is x + y?", answer: "17", solution: "x becomes 8: 8 + 9." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on pointers", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: structures", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Pointers I (C10)", "Pointers II (C11)", "Strings (C12)"], usedIn: ["Structures and linked lists (C14, D3)", "Dynamic memory (C15)"], cross: ["Compiler design: type expressions"] },
  ],
};
