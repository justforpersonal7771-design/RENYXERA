import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 14 "Structures, unions, enums, bit-fields and typedef" (28 Nov 2026). Real GATE question explained in full: 2018_FN_Q12 (a struct of three chars
 * read through a char pointer). Sizes are for the usual 64-bit machine (int 4 bytes, double 8 bytes, alignment equal to size). Every program was compiled
 * and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC14: Topic = {
  id: "cs.pds.c.structs14",
  title: "Structures, unions, enums and typedef",
  no: "14",
  book: [
    { t: "p", text: "An array holds many values of the **same** type. A **structure** holds several values of **different** types under one name: the name, the roll number and the marks of a student, the x and y of a point. A **union** holds one of several values in the same space. An **enumeration** gives names to small whole numbers. These are the tools C gives you to build your own types, and linked lists, trees and every other data structure in the second half of this book are made from them." },
    { t: "p", text: "The new ideas are few. The members of a structure sit side by side in memory, but the compiler may leave **gaps** between them (padding), so `sizeof` of a structure is not always the sum of its members. A union's members overlap. And a pointer to a structure has its own arrow notation. One real GATE question on structures is worked in full." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["declare a structure, fill it, and reach its members with `.` and `->`;", "work out the size of a structure with padding, and say where each member sits;", "say what a union is and what `sizeof` gives for one;", "use `enum` and `typedef` and read a bit-field declaration;", "pass a structure to a function by value and by address."] },

    { t: "h2", text: "Structures" },
    { t: "h3", text: "Declaring and using" },
    { t: "p", text: "`struct P { int x, y; };` declares a new type called `struct P`, with two members. It makes no variable yet; it describes the shape. A variable of that type is declared with `struct P p;`, and may be given starting values in braces in the order of the members: `struct P p = {1, 2};`. The members are reached with a dot: `p.x`, `p.y`." },
    { t: "code", text: `#include <stdio.h>

struct P { int x, y; };

int main(void) {
    struct P p = {3, 4};
    struct P *q = &p;
    printf("%d %d %d\\n", q->x, (*q).y, p.x + q->y);
    return 0;
}`, out: "3 4 7", file: "struct_basics.c" },
    { t: "p", text: "Through a **pointer** to a structure, a member is reached with the arrow: `q->x` means `(*q).x`: follow the pointer, then take the member. The brackets in `(*q).y` are needed because the dot binds tighter than the star; the arrow was invented to avoid writing them." },
    { t: "callout", kind: "key", text: "`p.x` for a structure variable, `q->x` for a pointer to a structure. `q->x` is just shorthand for `(*q).x`." },
    { t: "h3", text: "Structures are copied by value" },
    { t: "p", text: "Assigning one structure to another copies **every member**. Passing a structure to a function also copies it (call by value, chapter 6), so the function works on its own copy; to let it change the caller's structure, pass a pointer." },
    { t: "code", text: `#include <stdio.h>

struct P { int x, y; };

void moveby(struct P p)   { p.x += 10; }       /* changes a copy */
void moveptr(struct P *p) { p->x += 10; }      /* changes the original */

int main(void) {
    struct P p = {1, 2};
    moveby(p);
    printf("%d ", p.x);
    moveptr(&p);
    printf("%d\\n", p.x);
    return 0;
}`, out: "1 11", file: "struct_by_value.c" },
    { t: "trap", i: 0 },

    { t: "h2", text: "How a structure sits in memory: padding" },
    { t: "p", text: "The members are stored in the order they are declared, each at a higher address than the one before. But a processor prefers that a 4-byte `int` starts at an address that is a multiple of 4, and an 8-byte `double` at a multiple of 8. This is called **alignment**. To keep each member aligned, the compiler inserts unused bytes, **padding**, between members, and also at the end, so that an array of the structure keeps every element aligned." },
    { t: "table", head: ["Rule", "What it means"], rows: [["Each member starts at an offset that is a multiple of its own size (alignment)", "an `int` at 0, 4, 8, …; a `double` at 0, 8, 16, …; a `char` anywhere"], ["The size of the structure is rounded up to a multiple of its largest member's alignment", "so that every element of an array of the structure is aligned"], ["Padding bytes hold no value and cannot be used", "they are the cost of alignment"]], caption: "The usual rules on a 64-bit machine." },
    { t: "fig", id: "c14-f1" },
    { t: "p", text: "In `struct { char a; int b; char c; }`, `a` is at offset 0. The `int b` needs a multiple of 4, so three bytes of padding follow `a`, and `b` is at 4 to 7. Then `c` is at 8. The total, 9 bytes, is rounded up to a multiple of 4 (the largest alignment): 12. Reordering the members so that the two chars come together, `struct { char a; char b; int c; }`, needs only 2 bytes + 2 padding + 4 = 8." },
    { t: "code", text: `#include <stdio.h>
#include <stddef.h>

struct A { char a; int b; char c; };
struct B { char a; char b; int c; };
struct C { char a; double d; int i; };

int main(void) {
    printf("%zu %zu %zu\\n", sizeof(struct A), sizeof(struct B), sizeof(struct C));
    printf("%zu %zu %zu\\n", offsetof(struct A, a), offsetof(struct A, b), offsetof(struct A, c));
    return 0;
}`, out: "12 8 24\n0 4 8", file: "struct_padding.c" },
    { t: "p", text: "`offsetof(type, member)` gives the offset of a member from the start of the structure. The third structure, `{char; double; int}`, has the `double` at offset 8 (7 bytes of padding after the `char`), the `int` at 16, and a total of 20 rounded up to a multiple of 8: 24." },
    { t: "callout", kind: "shortcut", text: "To find a structure's size: go through the members in order. Put each at the next offset that is a multiple of its size. The last offset plus the last size, rounded up to a multiple of the biggest member's size, is `sizeof`." },
    { t: "trap", i: 1 },
    { t: "ex", id: "c14-e2" },
    { t: "p", text: "Structures can contain arrays and other structures, and a structure can hold a **pointer to its own type**, as in `struct Node { int value; struct Node *next; };`. That is how a linked list is made: each node has a value and the address of the next node (chapters 15 and D3). A structure cannot contain a structure of its own type, only a pointer to one, because it would then have to be infinitely large." },
    { t: "p", text: "A structure made only of `char` members needs no padding at all, since every member has size 1. `struct { char x, y, z; }` is exactly 3 bytes, and its members are at offsets 0, 1 and 2. That is the case in the GATE question below." },

    { t: "h2", text: "Unions" },
    { t: "p", text: "A **union** is declared like a structure, but all its members start at the **same address**: they share one block of memory, and only one is meaningful at a time. The size of a union is the size of its **largest** member (rounded up for alignment). Writing one member and reading another reinterprets the same bytes." },
    { t: "code", text: `#include <stdio.h>

union U { int i; double d; char c; };

int main(void) {
    union U u;
    u.i = 65;
    printf("%zu %d %c\\n", sizeof(union U), u.i, u.c);
    return 0;
}`, out: "8 65 A", file: "union_demo.c" },
    { t: "p", text: "The union above is 8 bytes (the size of the `double`). After `u.i = 65` the lowest byte holds 65, so reading `u.c` as a character gives `'A'` on a little-endian machine. Unions are used to save memory when only one of several values is ever needed, and to look at the bytes of a value in a different way." },
    { t: "trap", i: 2 },

    { t: "h2", text: "Enumerations, typedef and bit-fields" },
    { t: "h3", text: "enum" },
    { t: "p", text: "`enum Color { RED, GREEN = 5, BLUE };` creates three named constants. By default they count up from 0, and each is one more than the one before it unless a value is given. So RED is 0, GREEN is 5 and BLUE is 6. An `enum` variable is just an `int` underneath." },
    { t: "code", text: `#include <stdio.h>

enum Color { RED, GREEN = 5, BLUE };

int main(void) {
    enum Color c = BLUE;
    printf("%d %d %d\\n", RED, GREEN, c);
    return 0;
}`, out: "0 5 6", file: "enum_demo.c" },
    { t: "h3", text: "typedef" },
    { t: "p", text: "`typedef` gives a type another name, so you can write `Point` instead of `struct P`: `typedef struct P Point;` or `typedef struct { int x, y; } Point;`. It makes declarations shorter, and it is how the type of a function pointer is given a readable name." },
    { t: "h3", text: "Bit-fields" },
    { t: "p", text: "A **bit-field** is a member that takes a stated number of **bits**: `unsigned a : 3;` uses three bits. Several bit-fields of the same type are packed together into one unit. `struct { unsigned a : 3; unsigned b : 5; }` needs 8 bits, but it is stored in one `unsigned`, so its size is 4 bytes." },
    { t: "callout", kind: "note", text: "The exact layout of bit-fields (which end first, how they straddle units) depends on the compiler. Questions that ask only for `sizeof` use the rule 'packed into units of the declared type'." },

    { t: "h2", text: "Reading a structure through a char pointer" },
    { t: "p", text: "A structure's address is the address of its first byte, so a pointer to the structure can be converted to a `char *`, and each byte of the structure can then be read by adding to that pointer, one byte at a time (chapter 11). Because the move is in bytes, the result depends on the **offsets** of the members, and so on padding." },
    { t: "fig", id: "c14-f2" },
    { t: "p", text: "This is the trick in the GATE question: a structure of three `char` members, with no padding, so that the bytes are `x`, `y` and `z` in order, and `(char *)q + 1` is the address of the member `y`." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2018 (forenoon), Q12: a struct read as bytes" },
    { t: "p", text: "A one-mark multiple-choice question. A structure of three characters is initialised, a pointer to it is converted to a `char *`, and two bytes are printed with `%c`." },
    { t: "ex", id: "c14-e1" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "That a structure of chars has no padding, so its members are at offsets 0, 1 and 2, and that `(char *)q + 1` moves one **byte**. The initialiser sets x = `'1'`, y = `'0'` and z = `'a' + 2` = `'c'`. `*((char *)q + 1)` is the byte at offset 1, which is y, `'0'`. `*((char *)q + 2)` is the byte at offset 2, z, which is `'c'`. The output is `0, c`: option A. The expression `'a' + 2` is computed (to 99, the code of `'c'`), not printed as text." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option B, 0, a+2.** The student prints the expression as text; it is an arithmetic expression whose value is the character `'c'`.", "**Options C and D.** `%c` prints the character without any quote marks; the single quotes are part of the C source, not of the output.", "Reading the first byte as offset 1: the first member x is at offset **0**."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Expression", "Byte read", "Prints"], rows: [["`*((char *)q + 1)` (the question)", "y", "0"], ["`*((char *)q + 2)` (the question)", "z", "c"], ["`*(char *)q`", "x", "1"], ["`((char *)q)[2]`", "z", "c"]], caption: "The question's program was compiled and run and printed `0, c`." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A structure groups members of different types; reach them with `.` (variable) or `->` (pointer to a structure). Assignment and argument passing copy the whole structure.", "Members are stored in declaration order, but the compiler pads them so that each starts at a multiple of its own size, and rounds the total size up to the largest alignment.", "A structure of only `char` members has no padding.", "A union's members share one block; its size is that of the largest member.", "`enum` counts up from 0 (or from a given value); `typedef` gives a type a new name; a bit-field takes a stated number of bits.", "A pointer to a structure can be read as bytes with a `char *`; the offsets include any padding."] },
  ],
  blocks: [
    { type: "figure", id: "c14-f1", caption: "struct { char a; int b; char c; } is 12 bytes: three bytes of padding after a, three after c. Reordering the members to {char a; char b; int c;} makes it 8 bytes.", alt: "Two byte rows: the first struct with padding after a and c, 12 bytes; the second with two chars and padding then an int, 8 bytes.", fig: { kind: "frames", title: "the same three members, two orders", frames: [
      { caption: "{char a; int b; char c;}: a at 0, padding at 1 to 3, b at 4 to 7, c at 8, padding at 9 to 11. Total 12.", fig: { kind: "array", data: [["a", "pad", "pad", "pad", "b", "b", "b", "b", "c", "pad", "pad", "pad"]], index: true, tones: { "0,1": "dim", "0,2": "dim", "0,3": "dim", "0,9": "dim", "0,10": "dim", "0,11": "dim", "0,4": "hl", "0,5": "hl", "0,6": "hl", "0,7": "hl" } } },
      { caption: "{char a; char b; int c;}: a at 0, b at 1, padding at 2 to 3, c at 4 to 7. Total 8.", fig: { kind: "array", data: [["a", "b", "pad", "pad", "c", "c", "c", "c", "", "", "", ""]], index: true, tones: { "0,2": "dim", "0,3": "dim", "0,4": "hl", "0,5": "hl", "0,6": "hl", "0,7": "hl", "0,8": "dim", "0,9": "dim", "0,10": "dim", "0,11": "dim" } } },
    ] } },
    { type: "figure", id: "c14-f2", caption: "struct { char x, y, z; } has no padding: x, y and z are at offsets 0, 1 and 2. (char *)q + 1 points at y.", alt: "Three bytes x, y, z with a char pointer plus 1 on y and plus 2 on z.", fig: { kind: "array", title: "struct Ournode p = {'1', '0', 'a' + 2};", data: [["1", "0", "c"]], base: 1000, size: 1, index: true, tones: { "0,1": "hl", "0,2": "ok" }, pointers: [{ name: "(char *)q + 1", at: [0, 1] }, { name: "(char *)q + 2", at: [0, 2] }] } },

    { type: "example", id: "c14-e1", level: "gate", title: "GATE CS 2018 (forenoon), Q12 · 1 mark · MCQ", file: "gate2018_q12.c", given: `#include<stdio.h>

struct Ournode{
    char x,y,z;
};

int main(){
    struct Ournode p = {'1', '0', 'a'+2};
    struct Ournode *q = &p;
    printf ("%c, %c", *((char*)q+1), *((char*)q+2));
    return 0;
}`, find: "The output. Options: (A) 0, c  (B) 0, a+2  (C) '0', 'a+2'  (D) '0', 'c'", steps: [
      { say: "The members are all chars, so there is no padding: x is at offset 0, y at 1, z at 2.", result: "offsets 0, 1, 2" },
      { say: "The initialiser: x = '1', y = '0', z = 'a' + 2, which is the character 'c' (code 99).", result: "'1', '0', 'c'" },
      { say: "(char *)q + 1 is one byte on: y. (char *)q + 2 is two bytes on: z.", result: "y and z" },
      { say: "%c prints the characters themselves, with no quotes.", result: "0, c" },
    ], answer: "(A) 0, c", check: "Official answer (A). The program was compiled and run." },

    { type: "example", id: "c14-e2", level: "easy", title: "Trace by hand: the size of a structure with padding", file: "struct_size.txt", given: `struct S { char a; short b; int c; char d; };
/* char 1 byte, short 2 bytes, int 4 bytes */`, find: "The offset of each member and the size of the structure.", steps: [
      { say: "a is a char: offset 0, size 1.", result: "a at 0" },
      { say: "b is a short: it needs an offset that is a multiple of 2. The next free byte is 1, so one byte of padding, and b is at 2 to 3.", result: "b at 2" },
      { say: "c is an int: it needs a multiple of 4. The next free byte is 4, so c is at 4 to 7.", result: "c at 4" },
      { say: "d is a char: offset 8. The data ends at 9; the largest alignment is 4, so the size is rounded up to 12.", result: "d at 8, size 12" },
    ], answer: "a at 0, b at 2, c at 4, d at 8; sizeof is 12.", check: "Check by compiling: offsetof gives 0, 2, 4, 8 and sizeof gives 12 on the usual machines." },
    { type: "trap", wrong: "A function that takes a struct by value can change the caller's structure.", tempting: "A structure is one object, so it seems to be shared.", whyWrong: "The whole structure is copied into the parameter. The function works on its copy. To change the original, pass a pointer and use ->.", rule: "Structures are copied like int; pass a pointer to change one.", ex: { code: "void moveby(struct P p) { p.x += 10; }\nstruct P p = {1, 2};\nmoveby(p);\nprintf(\"%d\", p.x);", out: "1" } },
    { type: "trap", wrong: "sizeof a structure is the sum of its members' sizes.", tempting: "The members are placed one after another.", whyWrong: "The compiler pads between members so each is aligned, and at the end. A char, an int and a char need 1 + 4 + 1 = 6 bytes of data, but the structure takes 12.", rule: "Add the padding: align each member, then round the total.", ex: { code: "struct A { char a; int b; char c; };\nprintf(\"%zu\", sizeof(struct A));", out: "12" } },
    { type: "trap", wrong: "A union stores all its members at the same time.", tempting: "It is written like a structure.", whyWrong: "All members share the same bytes. Writing one overwrites the others; only the last one written is meaningful.", rule: "Union: one at a time; size = the largest member.", ex: { code: "union U { int i; double d; char c; };\nunion U u;\nu.i = 65;\nprintf(\"%zu %c\", sizeof(union U), u.c);", out: "8 A" } },
    { type: "gate", text: "One question has been asked on this chapter: a structure of chars read through a char pointer (2018 FN Q12, 1 mark), worked above. Padding and sizeof of structures and unions appear in the Programming and in the Computer Organisation papers of other years." },
    { type: "recall", cards: [
      { q: "How do you reach a member through a pointer to a struct?", a: "With ->: q->x is (*q).x." },
      { q: "Is a struct passed to a function by value or by address?", a: "By value: it is copied, unless you pass a pointer." },
      { q: "Why can sizeof(struct) exceed the sum of its members?", a: "Padding for alignment." },
      { q: "What is the size of struct { char a; int b; char c; }?", a: "12." },
      { q: "What is the size of struct { char a; char b; int c; }?", a: "8." },
      { q: "What is the size of a union?", a: "That of its largest member." },
      { q: "What is BLUE in enum { RED, GREEN = 5, BLUE }?", a: "6." },
      { q: "What does typedef do?", a: "Gives a type another name." },
      { q: "What is the size of struct { char x, y, z; }?", a: "3: no padding." },
    ] },
    { type: "check", questions: [
      { id: "m1", kind: "NAT", marks: 1, q: "struct { char a; int b; char c; } What is its size (4-byte int)?", answer: "12", solution: "a at 0, b at 4, c at 8, rounded to 12." },
      { id: "m2", kind: "NAT", marks: 1, q: "struct { char a; char b; int c; } What is its size?", answer: "8", solution: "2 + 2 padding + 4." },
      { id: "m3", kind: "NAT", marks: 1, q: "union { int i; double d; char c; } What is its size?", answer: "8", solution: "The largest member, double." },
      { id: "m4", kind: "NAT", marks: 1, q: "enum { RED, GREEN = 5, BLUE }; What is BLUE?", answer: "6", solution: "One more than GREEN." },
      { id: "m5", kind: "MCQ", marks: 1, q: "struct P { int x, y; }; struct P *q; Which expression is the same as (*q).x?", options: ["q.x", "q->x", "*q.x", "&q->x"], answer: "B", solution: "The arrow." },
      { id: "m6", kind: "NAT", marks: 2, q: "struct { char a; double d; int i; } What is its size (double 8 bytes)?", answer: "24", solution: "a at 0, d at 8, i at 16, rounded up to 24." },
      { id: "m7", kind: "NAT", marks: 2, q: "struct D { char x, y, z; } p = {'1', '0', 'c'}; What is the ASCII value printed by printf(\"%d\", *((char *)&p + 2))?", answer: "99", solution: "The byte at offset 2 is 'c' = 99." },
      { id: "m8", kind: "MSQ", marks: 2, q: "Which are true?", options: ["Assigning a struct copies all members", "sizeof a struct is always the sum of its members", "A union's members share the same memory", "A struct of three chars has no padding"], answer: "A, C, D", solution: "B is false: padding." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on structures", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: dynamic memory", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Pointers II (C11)", "Strings (C12)"], usedIn: ["Dynamic memory (C15)", "Linked lists (D3)", "Trees (D7)"], cross: ["Computer Organisation: alignment"] },
  ],
};
