import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 10 "Pointers I: memory and addresses", written as a textbook chapter (26 Nov 2026).
 * Plan: docs/study-materials/v2/programming-and-data-structures/pilot/C10-pointers-1.md. Every program in it was compiled and run with gcc;
 * addresses in pictures are illustrative. Real GATE questions in this chapter (lesson C10 in pds-pyq-tags.tsv): 2026_AN_Q60, 2025_FN_Q34, 2022_FN_Q21, 2017_AN_Q32.
 */
export const pilotPointers: Topic = {
  id: "cs.pds.c.ptr1",
  title: "Pointers I: memory and addresses",
  no: "10",
  book: [
    { t: "p", text: "Every program you run, whether a game, a browser or one of the C programs in this book, lives inside the computer's **memory** while it works. Memory is where a program keeps the numbers, letters and instructions it is using at this moment. When the program ends, the memory is handed back." },
    { t: "p", text: "This chapter is about one idea: a program can know _where_ in memory a value is kept, and can use that place directly. That idea is called a **pointer**, and it is the most important and the most feared topic in C. We reach it slowly, starting with what memory actually is, so that by the time the word pointer appears it will feel like a small step and not a jump." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["draw any short pointer program as boxes and arrows and say what it prints;", "say the difference between moving an arrow (`p = &b;`) and changing the box at its end (`*p = 7;`);", "explain why `swap(&a, &b)` works when `swap(a, b)` does not;", "name the three pointers that must never be followed: NULL, wild and dangling;", "solve every kind of GATE question that has appeared on this topic, and spot the variations coming."] },

    { t: "h2", text: "Memory" },
    { t: "h3", text: "Disk and RAM" },
    { t: "p", text: "A computer keeps information in two different places. The **disk** (a hard disk or an SSD) keeps files for a very long time, even when the power is off, but it is slow. The **RAM** (random-access memory) is fast, but it forgets everything the moment the power goes. When you start a program, the computer copies it from the disk into RAM, and the processor then reads and writes RAM while the program runs. In C, the word memory always means RAM." },
    { t: "callout", kind: "key", text: "Disk keeps things for a long time and is slow. RAM is fast and is forgotten when the power goes. A running program lives in RAM." },
    { t: "h3", text: "Bytes and bits" },
    { t: "fig", id: "p-f0" },
    { t: "p", text: "RAM is organised as a very long row of tiny storage cells called **bytes**. Figure 10.1 draws eight of them side by side. Each byte holds eight on/off switches, called **bits**, so a byte can be in 2⁸ = 256 different states." },
    { t: "h4", text: "How many values can a byte hold?" },
    { t: "p", text: "With one bit you can tell two things apart (0 or 1). Each extra bit doubles the count. So n bits give 2ⁿ patterns, and the table lists the first few." },
    { t: "table", head: ["Bits", "Patterns (2ⁿ)", "Example use"], rows: [["1", "2", "yes / no"], ["4", "16", "one hex digit"], ["8", "256", "one byte: a number 0 to 255, or one letter"], ["16", "65 536", "a `short`"], ["32", "4 294 967 296", "a typical `int`"]] },
    { t: "h5", text: "Why eight?" },
    { t: "p", text: "Eight bits became the standard size of a byte because it is enough for one letter of the alphabet and is a convenient power of two. The C language itself only promises that a byte has _at least_ eight bits; on every machine in this book it has exactly eight." },
    { t: "callout", kind: "note", text: "Everything a program stores is built out of bytes: a `char` takes one byte and an `int` usually takes four." },

    { t: "h2", text: "Addresses" },
    { t: "h3", text: "The address of a byte" },
    { t: "p", text: "If memory is a long row of bytes, the computer needs a way to say which byte it means. It does this the way a post office does with houses: every byte has a number, called its **address**, counting up from 0. The byte at address 1000 sits right between the bytes at 999 and 1001. Neighbouring bytes have neighbouring addresses, and this fact, that addresses are plain counting numbers, is what makes pointers so powerful later." },
    { t: "h3", text: "Values that need several bytes" },
    { t: "fig", id: "p-f0b" },
    { t: "p", text: "A value bigger than one byte takes several neighbouring bytes. A four-byte `int` stored at address 1000 uses the bytes 1000, 1001, 1002 and 1003, and we say that the `int` _lives at_ 1000, the address of its first byte. The next four-byte value can start at 1004. So the address of a variable is always the address of its **first** byte." },
    { t: "callout", kind: "note", text: "The addresses in this book (1000, 1004, …) are made-up round numbers so that the arithmetic stays easy. A real machine shows much larger numbers, and they change from one run to the next." },
    { t: "h3", text: "How big is each type?" },
    { t: "p", text: "The size of a type is the number of bytes one value of it needs. C gives you the operator `sizeof` to ask. On the machines GATE questions are written for, the common sizes are the ones in the table. When a question states a different size, always use the one it states." },
    { t: "table", head: ["Type", "Usual size", "Why it matters here"], rows: [["`char`", "1 byte", "the smallest box; each address holds one"], ["`short`", "2 bytes", "occupies two neighbouring addresses"], ["`int`", "4 bytes", "the next `int` starts 4 addresses later"], ["`float`", "4 bytes", "same space as an `int`, read differently"], ["`double`", "8 bytes", "the next one starts 8 later"]] },

    { t: "h2", text: "Variables: name, value and address" },
    { t: "p", text: "People cannot remember addresses, so C lets us put a name on a box. When we write `int x = 10;` the compiler picks four bytes somewhere in memory, remembers that the name `x` stands for that place, and stores 10 in it. A variable therefore has three things: a **name**, a **value** and an **address**. So far you have used only the name and the value." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int x = 10;          /* name x, value 10 */
    printf("%d\\n", x);   /* uses the name and the value */
    return 0;
}`, out: "10", file: "variable_demo.c" },
    { t: "p", text: "The third thing, the address, is hidden until you ask for it. The operator `&` (read it as _address of_) asks, and `printf` prints an address with the format `%p`. The number you see will be different on every machine and sometimes on every run, which is exactly why this book draws round numbers instead." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int x = 10;
    printf("value   = %d\\n", x);
    printf("address = %p\\n", (void *)&x);
    printf("size    = %zu bytes\\n", sizeof x);
    return 0;
}`, out: "value   = 10\naddress = 0x7ffd5c3a9b4c   (differs on every machine)\nsize    = 4 bytes", file: "address_demo.c" },
    { t: "callout", kind: "key", text: "Every variable is a box with three things: a **name** you type, a **value** inside, and an **address** that tells where the box is. A pointer will be a box whose value is an address." },

    { t: "h2", text: "Pointers" },
    { t: "h3", text: "An address stored in a variable" },
    { t: "fig", id: "p-f1" },
    { t: "p", text: "C lets you ask for the address of a variable with the operator `&`. The expression `&x` means the address of x. An address is just a number, so it can be stored in a variable too. A variable that stores an address is called a **pointer**. It is declared with a `*` before its name: `int *p;` says that `p` will hold the address of an `int`. After `p = &x;` we say that p _points to_ x, and we draw the address as an arrow." },
    { t: "callout", kind: "key", title: "Definition", text: "A **pointer** is a variable whose value is the address of another variable. `&x` gives the address of x; `int *p` declares a pointer to an int." },
    { t: "h3", text: "Declaring a pointer" },
    { t: "p", text: "A pointer is declared with the type of the box it will point to, then a star, then the name. So `int *p;` is a pointer to an `int`, `char *s;` is a pointer to a `char` and `double *d;` a pointer to a `double`. You may write the pointer and its target together: `int x = 10, *p = &x;`. In this book we write one declaration per line, because a long line hides the most famous mistake." },
    { t: "trap", i: 1 },
    { t: "trap", i: 2 },
    { t: "h3", text: "The type of a pointer, and its size" },
    { t: "p", text: "Why does a pointer remember what type it points to, when an address is just a number? Because the type tells the computer how to treat the bytes at that address. An `int *` reads four bytes and treats them as an integer; a `char *` reads one byte. The pointer itself is only one address, so every pointer needs the same amount of space whatever it points to." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    printf("%zu %zu %zu\\n", sizeof(int *), sizeof(char *), sizeof(double *));
    return 0;
}`, out: "8 8 8", file: "pointer_sizes.c" },
    { t: "trap", i: 4 },
    { t: "h3", text: "Initialise at birth" },
    { t: "p", text: "A pointer that has not been given an address holds rubbish, and rubbish addresses are dangerous (section 10.7). So always give a pointer a value when you declare it: the address of a real variable, or `NULL` when it points at nothing yet." },
    { t: "callout", kind: "tip", text: "Write `int *p = &x;` or `int *p = NULL;`. Never leave `int *p;` alone on a line." },

    { t: "h2", text: "Following a pointer" },
    { t: "h3", text: "The star in an expression" },
    { t: "fig", id: "p-f2" },
    { t: "p", text: "Holding an address is only useful if we can reach the box it names. The operator `*` does that: `*p` means _the box that p points to_. It can be read or written like any variable, so `*p = 25;` stores 25 in the box p points at. The name `x` never appears on that line, yet x changes. Step through Figure 10.4 with the Next button; the key observation is on the last step: only the number inside x changed, and the arrow did not move." },
    { t: "walk" },
    { t: "callout", kind: "tip", text: "Draw before you read: one box for every variable, with its name and a value (or `?` if it has none), then one arrow for every pointer that has an address. Only then execute the lines, and keep a small table with one row per line." },
    { t: "callout", kind: "remember", text: "Two jobs for one symbol: in a **declaration** `int *p;` the star only means _p is a pointer_. In an **expression** `*p` means _go to the box p points at_." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;
    printf("%d\\n", x);
    printf("%d\\n", *p);   /* follow the arrow, read */
    *p = 25;              /* follow the arrow, write */
    printf("%d\\n", x);
    return 0;
}`, out: "10\n10\n25", file: "follow_pointer.c" },
    { t: "h3", text: "Moving the arrow and changing the box" },
    { t: "fig", id: "p-f4" },
    { t: "p", text: "There are exactly two things you can do with a pointer, and mixing them up causes most wrong answers. You can **move the arrow**: `p = &b;` changes the value inside p, so p now points somewhere else, and no other box changes. Or you can **change the box at the end of the arrow**: `*p = 7;` writes into whatever p points at, and p itself stays as it is. Figure 10.5 shows both in one run." },
    { t: "callout", kind: "tip", text: "Ask one question of every line that has a star or an ampersand: does this line change p (the arrow) or does it change *p (the box)? Write it beside the line before you trace anything." },
    { t: "h3", text: "Copying a pointer" },
    { t: "fig", id: "p-f3" },
    { t: "p", text: "Assigning one pointer to another copies the address, not the box. After `int *q = p;` both p and q hold the same address, so both reach one box. A write through either is visible through the other, because there is only one box. This is called **aliasing**, and Figure 10.6 shows it." },
    { t: "ex", id: "p-e1" },
    { t: "trap", i: 0 },
    { t: "h3", text: "Star and ampersand undo each other" },
    { t: "p", text: "The two operators are opposites. `&x` turns a variable into its address; `*p` turns an address back into the variable. So `*&x` is x itself, and `&*p` is p again, as long as p points at something real. This is why the 2026 GATE line `a = *(&b);` is just `a = b;`." },
    { t: "callout", kind: "shortcut", text: "`*&x` is `x`, and `&*p` is `p`. Cancel them on sight, the way you cancel a plus and a minus." },
    { t: "h3", text: "Changing the value, not the pointer" },
    { t: "p", text: "Be careful with increment. `(*p)++` follows the arrow and adds one to the box, so x becomes x + 1. But `*p++` is read as `*(p++)`: it reads the box and then moves the arrow one box along. The box is not changed at all. Chapter 11 explains why moving an arrow is allowed; for now remember that the brackets decide." },
    { t: "trap", i: 5 },
    { t: "shortcut" },
    { t: "faded" },

    { t: "h2", text: "Pointers and functions" },
    { t: "h3", text: "A function gets copies" },
    { t: "p", text: "When you call a function, C copies each argument into a new box that belongs to the function. The function can do anything it likes to its own boxes; when it returns, those boxes vanish and the caller's variables are untouched. This is **call by value**. It is why a function `swap(int a, int b)` cannot swap anything of yours." },
    { t: "h3", text: "Passing an address" },
    { t: "p", text: "If the function needs to change your variable, give it the address of your variable. The function still gets a copy, but a copy of an _address_, and an address copied is still the same address. So `*a` and `*b` inside the function are your own boxes. Figure 10.7 follows `swap_ptr(&x, &y)` line by line, with main's boxes at the bottom and the function's boxes on top." },
    { t: "fig", id: "p-f5" },
    { t: "ex", id: "p-e2" },
    { t: "callout", kind: "note", text: "`scanf(\"%d\", &x)` needs the address for the same reason: it has to write a number into your x. `printf(\"%d\", x)` only reads x, so a copy of the value is enough." },
    { t: "h3", text: "The parameter is a copy, too" },
    { t: "p", text: "The pointer parameter is itself a copy. If the function _assigns to the parameter_, `p = &z;`, it moves only its own copy of the arrow, and the caller's pointer stays exactly where it was. Only writing through the star, `*p = …`, reaches the caller's box." },
    { t: "fig", id: "p-f7" },
    { t: "trap", i: 3 },
    { t: "lab", lab: "ptr" },

    { t: "h2", text: "Pointers that must not be followed" },
    { t: "p", text: "Not every pointer points at a usable box. There are three kinds that must never be followed with a star, and Figure 10.9 draws them. Following any of them is **undefined behaviour**: the C standard promises nothing, the program may crash, print rubbish or even appear to work. So when a GATE question follows one of them, the answer is never a particular number." },
    { t: "fig", id: "p-f6" },
    { t: "h3", text: "NULL" },
    { t: "p", text: "`NULL` is the special address that means _no box_. A pointer that holds it points nowhere on purpose, and that is useful: it can mean _nothing found yet_ or _end of the list_. You can test for it, `if (p != NULL)`, but you must never follow it." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int *p = NULL;
    if (p != NULL)
        printf("%d\\n", *p);
    else
        printf("p points nowhere\\n");
    return 0;
}`, out: "p points nowhere", file: "null_guard.c" },
    { t: "h3", text: "Wild" },
    { t: "p", text: "A **wild** pointer was declared but never given an address, so it holds whatever rubbish was already in that box. It points to some random house, and a write through it may silently damage another variable. It is the reason for the habit in section 10.4: initialise at birth." },
    { t: "h3", text: "Dangling" },
    { t: "p", text: "A **dangling** pointer holds the address of a box that no longer exists. The most common way is returning the address of a local variable: the box belongs to the function and is given back when the function returns, but the address lives on in the caller. Memory freed by `free` creates the same problem; chapter 15 deals with that." },
    { t: "code", text: `int *make(void) {
    int z = 50;
    return &z;       /* z is gone when make returns */
}
/* the caller now holds a dangling pointer */`, file: "dangling_pointer.c" },
    { t: "callout", kind: "warning", text: "NULL, wild and dangling: following any of them is undefined behaviour. Never write a single number as the output of a program that does so." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Four real questions have been asked on exactly this chapter. We take them from the simplest idea to the most compact, and each is solved the same way: draw the boxes, draw the arrows, execute line by line. After each solution you will find what it really tests, where marks are lost, and variations of it that GATE could ask next." },

    { t: "h3", text: "GATE 2017 (afternoon), Q32: a function with its own copies" },
    { t: "p", text: "This one-mark question is the cleanest test of the two ideas of the chapter together: a function's parameters are its own boxes, and `*ptr` is a way to reach one of them. The question gives four options, and three of them are what you get from mixing the ideas up." },
    { t: "ex", id: "p-e5" },
    { t: "fig", id: "p-f11" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "It tests whether you know that `x` and `y` are separate boxes, whose values are copies of the 1 and the 1 in the call, and whether you can tell that `*ptr` here is the very box called `x`. After `ptr = &x;` the two names `x` and `*ptr` are two names for one box. So `y = *ptr;` copies the current value of x, which is 0, and `*ptr = 1;` changes x only." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option A, 0, 0.** The student stops after `y = *ptr;` or forgets that `*ptr = 1;` also changes x, which is a name for the same box.", "**Option B, 0, 1.** The student thinks `*ptr = 1;` changes y, as if ptr pointed at y, or that `y = *ptr` copies the 1.", "**Option D, 1, 1.** The student ignores `x = 0;` because the call passed 1, or thinks the 1 in the call is the final value.", "Doing the lines in the wrong order. Here the order is everything: `y = *ptr;` happens _before_ `*ptr = 1;`."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "What changes", "Output"], rows: [["swap the last two lines: `ptr = &x; *ptr = 1; y = *ptr; x = 0;`", "y copies the 1, then x is set to 0", "0, 1"], ["point at y instead: `x = 0; ptr = &y; y = *ptr; *ptr = 5;`", "`y = *ptr` copies y to itself; then 5 goes into y", "0, 5"], ["add a global `int x = 7;` and delete the parameter `x`", "x is now one global box and the function's x is gone", "0 or other, depending on the lines; redraw"]], caption: "The first two were compiled and run; the third reminds you that a different scope means a different picture." },
    { t: "callout", kind: "tip", text: "When two names might be the same box, draw the arrow at once. Once `ptr = &x` is drawn, `x` and `*ptr` are the same box and you stop treating them as two things." },

    { t: "h3", text: "GATE 2025 (forenoon), Q34: a pointer passed to a function" },
    { t: "p", text: "A one-mark numerical-answer question. It has three moving parts: a pointer `z` set to `&a`, a call that hands `foo` a copy of that pointer and a copy of `b`'s value, and a write through the pointer inside `foo`." },
    { t: "ex", id: "p-e4" },
    { t: "fig", id: "p-f10" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Two things at once. First, that the pointer parameter `p` holds the same address as `z`, so `*p` inside `foo` is the box `a` in main. Second, that the second parameter `x` receives only a copy of `b`'s value (25) and has nothing to do with `b` afterwards. The statement `*p = x;` then writes 25 into `a`. The only answer that is a plain number from the program is `25`; `b` does not change, which is one thing students often get wrong." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Answering 20 because they think `foo` only works on copies. It does, but one of the copies is an address.", "Thinking `*p = x;` changes `x`, or that `x` and `b` are linked. They are not.", "Not seeing that `z` is already `&a`, so `foo(z, b)` and `foo(&a, b)` are the same call."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change in `foo` or the call", "Reasoning", "Prints a"], rows: [["`void foo(int *p, int x) { x = 100; p = &x; *p = 100; }`", "`p = &x` moves foo's copy of the arrow, so the write never reaches a", "20"], ["`void foo(int *p, int x) { x = *p; *p = x + 1; }`", "x copies a (20), then a becomes 21; b stays 25", "21"], ["`foo(&a, &b)` with `void foo(int *p, int *q) { *p = *q; }`", "both are real addresses, so a copies b's value", "25 (and b is 25 too)"], ["`*z = b + 1;` written in main, no call", "no function at all: just a write through z", "26"]], caption: "All four were compiled and run." },
    { t: "callout", kind: "shortcut", text: "In a function that receives a pointer, underline every `*p` that is written. Those are the only lines that can change the caller. A line that assigns `p = …` without a star cannot." },

    { t: "h3", text: "GATE 2026 (afternoon), Q60: many pointer moves in one program" },
    { t: "p", text: "A two-mark numerical-answer question and the most recent one. It has one pointer, three integers and six assignments, and it uses every idea of the chapter: a write through the pointer, moving the arrow, the cancelling pair `*(&b)`, and reading through the pointer at the end. Nothing here is hard; it only needs you to keep track, so do exactly that, with a picture." },
    { t: "ex", id: "p-e3" },
    { t: "fig", id: "p-f8" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Whether you can keep the arrow and the boxes apart. The first assignment writes through the pointer (the box changes), the second moves the arrow (no box changes), the third copies a value, and the last reads through the pointer. The trap is that `*ptr` means a different box before and after `ptr = &c;`: first it is a, then it is c. The whole question is to notice that." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Using the original a = 5 in the last line. The write `*ptr = c;` has already changed a to 20, and the later `a = *(&b);` changes it again to 11.", "Forgetting that after `ptr = &c;` the expression `*ptr` is c itself, so `c = *ptr - a;` is `c = c - a;`, which is 20 - 11 = 9.", "Reading `*(&b)` as something hard. The star undoes the ampersand, so it is b."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Result"], rows: [["start with `ptr = &b; *ptr = a; ptr = &c; c = *ptr + b;`", "b becomes 5; the arrow moves to c; c = 20 + 5", "c = 25"], ["same program, print `a b c`", "a stays 5, b is 5, c is 25", "5 5 25"], ["`ptr = &a; a = *(&b); *ptr = c;` and print a", "a becomes 11, then the write through ptr (which is a) puts 20 there", "20"], ["add a second pointer `q = ptr; *q = c; ptr = &b; *ptr = *q + 1;`", "q keeps pointing at a; the arrow of ptr moves to b", "a = 20, b = 21, c = 20"]], caption: "Every row was compiled and run." },
    { t: "callout", kind: "shortcut", text: "Keep a small table with one column per variable and one for what the pointer points to. Write one new row for each line. Never overwrite a cell in your head, write a new row. The answer is the last row." },

    { t: "h3", text: "GATE 2022 (forenoon), Q21: a pointer and an array element" },
    { t: "p", text: "A one-mark question with four options. It adds one new thing to the picture: the array `z`, whose two boxes sit side by side. The expression `&z[0] + 1` is a preview of the next chapter: adding 1 to an address of an `int` moves to the next `int`, which is the address of `z[1]`. Here we only need that one fact." },
    { t: "ex", id: "p-e6" },
    { t: "fig", id: "p-f12" },
    { t: "fig", id: "p-f9" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Two writes through pointers and one array element, in the right order. The first write, `*p = 10;`, goes to x because p points at x at that moment. Then the arrow moves to `z[1]`, but the next line does not even use p: it computes an address (`&z[0] + 1`, which is `&z[1]`), follows it with the star and adds 3. So z[1] becomes 14 and z[0] keeps 10." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option A, 1, 10, 11.** Nothing was written; the student forgot that `*p = 10;` changes x.", "**Option B, 1, 10, 14.** The student wrote z[1] correctly but forgot the first write, thinking p was unused.", "**Option C, 10, 14, 11.** The student added 3 to z[0] and not to z[1], reading `&z[0] + 1` as _z[0] plus one_ instead of _the box after z[0]_.", "Thinking that `p = &z[1];` itself changes z[1]. It only moves the arrow."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints x, z[0], z[1]"], rows: [["`*(&z[0]) += 3;` instead of `*(&z[0] + 1) += 3;`", "`*&z[0]` is z[0]", "10, 13, 11"], ["`p = &z[1]; *p += 3; *(&x) = z[1];`", "z[1] becomes 14, then x gets a copy of it", "14, 10, 14"]], caption: "Both were compiled and run, with the same starting lines." },
    { t: "callout", kind: "tip", text: "Whenever an address has `+ 1` added to it, count it in _boxes_, not bytes. The compiler multiplies by the size of the thing pointed at. We come back to that in chapter 11." },

    { t: "callout", kind: "remember", text: "Pointer questions on GATE are never about knowing hidden facts. They are about following instructions exactly, one line at a time, with a picture." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Memory is a long row of numbered bytes. The number of a byte is its address, and the address of a bigger variable is the address of its first byte.", "A variable has a name, a value and an address. `&x` gives the address; `sizeof` gives the size.", "A pointer is a variable whose value is an address. `int *p;` declares it, `p = &x;` makes it point at x.", "`*p` follows the arrow: it is the box p points at, and it can be read or written.", "You can move the arrow (`p = &b;`) or change the box at its end (`*p = 7;`). Keep the two apart.", "Assigning a pointer copies the address; both pointers then reach the same box.", "A function gets copies of its arguments. To change the caller's variable, pass its address and write through the star.", "NULL, wild and dangling pointers must never be followed: the result is undefined behaviour, never a single number."] },
  ],
  blocks: [
    { type: "figure", id: "p-f0", caption: "Eight bytes side by side. Each has its own address (below); each holds eight bits, so a value from 0 to 255.", alt: "A row of eight memory bytes with addresses 1000 to 1007 and values.", fig: { kind: "array", title: "A row of bytes in memory", data: [[72, 105, 33, 0, 255, 7, 0, 64]], base: 1000, size: 1, index: true } },
    { type: "figure", id: "p-f0b", caption: "A four-byte int stored at address 1000 occupies the bytes 1000 to 1003 (shaded). Its address is that of its first byte.", alt: "Eight bytes with four shaded bytes showing an int at address 1000.", fig: { kind: "array", title: "int x = 10; at address 1000", data: [[10, 0, 0, 0, 0, 0, 0, 0]], base: 1000, size: 1, index: true, tones: { "0,0": "hl", "0,1": "hl", "0,2": "hl", "0,3": "hl" }, pointers: [{ name: "x", at: [0, 0] }] } },
    { type: "figure", id: "p-f1", caption: "x lives at 1000 and p holds 1000. Look at p: its value is the address of x. The arrow is how we draw 'points to'.", alt: "Memory boxes: x holds 10 at address 1000; p holds 1000 and has an arrow to x.", fig: { kind: "memory", title: "int x = 10; int *p = &x;", cells: [{ id: "x", addr: 1000, name: "x", value: 10, size: 4, tone: "hl" }, { id: "p", addr: 1004, name: "p", value: 1000, size: 4, ptr: "x" }] } },
    { type: "figure", id: "p-f2", caption: "Step through it with Next. Only the last step changes a number; p itself never changes.", alt: "Three frames: x alone, then p pointing to x, then x changed to 25 through p.", fig: { kind: "frames", title: "int x = 10; int *p = &x; *p = 25;", frames: [
      { caption: "After int x = 10; : x is a box holding 10. The box for p is not used yet.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 10 }, { addr: 1004, name: "p", value: "?", tone: "dim" }] } },
      { caption: "After int *p = &x; : p is a new box. It holds 1000, the address of x.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 10 }, { addr: 1004, name: "p", value: 1000, ptr: "x", tone: "hl" }] } },
      { caption: "After *p = 25; : follow the arrow from p and write 25 into x. p did not change.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 25, tone: "ok" }, { addr: 1004, name: "p", value: 1000, ptr: "x" }] } },
    ] } },
    { type: "figure", id: "p-f3", caption: "p and q both hold 1000. Writing 99 through q is visible through p, because there is only one box.", alt: "x holds 99; p and q both have arrows to x.", fig: { kind: "memory", title: "int *q = p; *q = 99;", cells: [{ id: "x", addr: 1000, name: "x", value: 99, tone: "ok" }, { addr: 1004, name: "p", value: 1000, ptr: "x" }, { addr: 1008, name: "q", value: 1000, ptr: "x" }] } },
    { type: "figure", id: "p-f4", caption: "Arrow first, then box. Watch which frame changes a number: only the last one.", alt: "Three frames: p to a, p moved to b, then b changed to 7.", fig: { kind: "frames", title: "p = &b; *p = 7;", frames: [
      { caption: "p = &a : p points at a.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 1 }, { id: "b", addr: 1004, name: "b", value: 2 }, { addr: 1008, name: "p", value: 1000, ptr: "a" }] } },
      { caption: "p = &b : the arrow moves. No number in a or b changed.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 1 }, { id: "b", addr: 1004, name: "b", value: 2 }, { addr: 1008, name: "p", value: 1004, ptr: "b", tone: "hl" }] } },
      { caption: "*p = 7 : follow the arrow and write into b.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 1 }, { id: "b", addr: 1004, name: "b", value: 7, tone: "ok" }, { addr: 1008, name: "p", value: 1004, ptr: "b" }] } },
    ] } },
    { type: "figure", id: "p-f5", caption: "swap_ptr(&x, &y): the function receives the addresses 1000 and 1004, so *a and *b are x and y themselves.", alt: "Three frames of the call stack while swap_ptr swaps x and y in main.", fig: { kind: "frames", title: "swap_ptr(&x, &y)", frames: [
      { caption: "main has x = 3 and y = 7. swap_ptr is called with their addresses.", fig: { kind: "stackframe", frames: [{ title: "swap_ptr", tone: "hl", rows: [{ name: "a", value: 1000 }, { name: "b", value: 1004 }, { name: "t", value: "?" }] }, { title: "main", rows: [{ name: "x (at 1000)", value: 3 }, { name: "y (at 1004)", value: 7 }] }] } },
      { caption: "t = *a; copies x's value (3) into t.", fig: { kind: "stackframe", frames: [{ title: "swap_ptr", rows: [{ name: "a", value: 1000 }, { name: "b", value: 1004 }, { name: "t", value: 3, tone: "ok" }] }, { title: "main", rows: [{ name: "x (at 1000)", value: 3 }, { name: "y (at 1004)", value: 7 }] }] } },
      { caption: "*a = *b; writes y's value into x. Then *b = t; writes 3 into y.", fig: { kind: "stackframe", frames: [{ title: "swap_ptr", rows: [{ name: "a", value: 1000 }, { name: "b", value: 1004 }, { name: "t", value: 3 }] }, { title: "main", tone: "ok", rows: [{ name: "x (at 1000)", value: 7, tone: "ok" }, { name: "y (at 1004)", value: 3, tone: "ok" }] }] } },
    ] } },
    { type: "figure", id: "p-f7", caption: "The function moves its own copy of the arrow to z, then writes through it. The caller's p and x are not touched.", alt: "Three frames of a function that reassigns its pointer parameter; the caller's pointer is unchanged.", fig: { kind: "frames", title: "void set(int *p) { int z = 50; p = &z; *p = 99; }", frames: [
      { caption: "main has x = 5 and p pointing at x. set(p) is called: its parameter p holds a copy, the same address 1000.", fig: { kind: "stackframe", frames: [{ title: "set", tone: "hl", rows: [{ name: "p", value: 1000 }, { name: "z", value: "?", tone: "dim" }] }, { title: "main", rows: [{ name: "x (at 1000)", value: 5 }, { name: "p", value: 1000 }] }] } },
      { caption: "p = &z; moves set's copy of the arrow to z (at 2000). main's p still says 1000.", fig: { kind: "stackframe", frames: [{ title: "set", tone: "hl", rows: [{ name: "p", value: 2000, tone: "hl" }, { name: "z (at 2000)", value: 50 }] }, { title: "main", rows: [{ name: "x (at 1000)", value: 5 }, { name: "p", value: 1000 }] }] } },
      { caption: "*p = 99; writes into z. After set returns, z is gone and main still has x = 5.", fig: { kind: "stackframe", frames: [{ title: "set", rows: [{ name: "p", value: 2000 }, { name: "z (at 2000)", value: 99, tone: "ok" }] }, { title: "main", tone: "ok", rows: [{ name: "x (at 1000)", value: 5 }, { name: "p", value: 1000 }] }] } },
    ] } },
    { type: "figure", id: "p-f6", caption: "Three pointers that cannot be used. p1 points at nowhere (NULL), p2 was never assigned (a random house), p3 points at a box that is gone.", alt: "Three pointer boxes: a NULL pointer, an unassigned wild pointer and a dangling pointer.", fig: { kind: "memory", title: "NULL, wild and dangling", cells: [{ id: "n", addr: "-", name: "NULL", value: "nowhere", tone: "dim" }, { addr: 1000, name: "p1", value: 0, ptr: "n", tone: "hl" }, { addr: 1004, name: "p2", value: "?", tone: "bad" }, { id: "gone", addr: 1100, name: "gone", value: "freed", tone: "dim" }, { addr: 1008, name: "p3", value: 1100, ptr: "gone", tone: "bad" }] } },
    { type: "figure", id: "p-f8", caption: "GATE 2026 AN Q60, drawn line by line. The arrow from ptr goes to a first, then to c. Watch which frames change a number and which move the arrow.", alt: "Five frames of boxes a, b, c and pointer ptr as the program runs; the final c is 9.", fig: { kind: "frames", title: "ptr = &a; *ptr = c; ptr = &c; a = *(&b); c = *ptr - a;", frames: [
      { caption: "Start: a = 5, b = 11, c = 20. ptr has no value yet.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 5 }, { id: "b", addr: 1004, name: "b", value: 11 }, { id: "c", addr: 1008, name: "c", value: 20 }, { addr: 1012, name: "ptr", value: "?", tone: "dim" }] } },
      { caption: "ptr = &a; *ptr = c; : ptr points at a, and the write copies c (20) into a.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 20, tone: "ok" }, { id: "b", addr: 1004, name: "b", value: 11 }, { id: "c", addr: 1008, name: "c", value: 20 }, { addr: 1012, name: "ptr", value: 1000, ptr: "a", tone: "hl" }] } },
      { caption: "ptr = &c; : the arrow moves to c. No number changes.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 20 }, { id: "b", addr: 1004, name: "b", value: 11 }, { id: "c", addr: 1008, name: "c", value: 20 }, { addr: 1012, name: "ptr", value: 1008, ptr: "c", tone: "hl" }] } },
      { caption: "a = *(&b); : the star undoes the ampersand, so this is a = b. a becomes 11.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 11, tone: "ok" }, { id: "b", addr: 1004, name: "b", value: 11 }, { id: "c", addr: 1008, name: "c", value: 20 }, { addr: 1012, name: "ptr", value: 1008, ptr: "c" }] } },
      { caption: "c = *ptr - a; : *ptr is c itself (20), so c = 20 - 11 = 9. That is printed.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 11 }, { id: "b", addr: 1004, name: "b", value: 11 }, { id: "c", addr: 1008, name: "c", value: 9, tone: "ok" }, { addr: 1012, name: "ptr", value: 1008, ptr: "c" }] } },
    ] } },
    { type: "figure", id: "p-f9", caption: "GATE 2022 FN Q21, line by line. The write through p goes to x; the second write goes to z[1] through an address that was worked out, not through p.", alt: "Three frames with x, the array z and pointer p; the final values are 10, 10 and 14.", fig: { kind: "frames", title: "*p = 10; p = &z[1]; *(&z[0] + 1) += 3;", frames: [
      { caption: "p = &x; *p = 10; : p points at x, and the write changes x from 1 to 10.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 10, tone: "ok" }, { id: "z0", addr: 2000, name: "z[0]", value: 10 }, { id: "z1", addr: 2004, name: "z[1]", value: 11 }, { addr: 3000, name: "p", value: 1000, ptr: "x", tone: "hl" }] } },
      { caption: "p = &z[1]; : the arrow moves to z[1]. No number changes.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 10 }, { id: "z0", addr: 2000, name: "z[0]", value: 10 }, { id: "z1", addr: 2004, name: "z[1]", value: 11 }, { addr: 3000, name: "p", value: 2004, ptr: "z1", tone: "hl" }] } },
      { caption: "*(&z[0] + 1) += 3; : &z[0] + 1 is the address of z[1]; the star follows it and adds 3. z[1] = 14.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 10 }, { id: "z0", addr: 2000, name: "z[0]", value: 10 }, { id: "z1", addr: 2004, name: "z[1]", value: 14, tone: "ok" }, { addr: 3000, name: "p", value: 2004, ptr: "z1" }] } },
    ] } },
    { type: "figure", id: "p-f10", caption: "GATE 2025 FN Q34. foo gets the address in p and a copy of b's value in x. *p = x writes into a, which lives in main.", alt: "Three frames of the call stack: main with a, b and z; foo with p and x; and the result a = 25.", fig: { kind: "frames", title: "foo(z, b);   with   *p = x;", frames: [
      { caption: "z = &a. The call foo(z, b) is about to copy z and the value of b.", fig: { kind: "stackframe", frames: [{ title: "main", rows: [{ name: "a (at 1000)", value: 20 }, { name: "b (at 1004)", value: 25 }, { name: "z", value: 1000 }] }] } },
      { caption: "Inside foo: p is a copy of the address 1000; x is a copy of 25. b is not connected to x.", fig: { kind: "stackframe", frames: [{ title: "foo", tone: "hl", rows: [{ name: "p", value: 1000 }, { name: "x", value: 25 }] }, { title: "main", rows: [{ name: "a (at 1000)", value: 20 }, { name: "b (at 1004)", value: 25 }, { name: "z", value: 1000 }] }] } },
      { caption: "*p = x; writes 25 into the box at 1000, which is a. After foo returns, only main is left: a = 25.", fig: { kind: "stackframe", frames: [{ title: "foo", rows: [{ name: "p", value: 1000 }, { name: "x", value: 25 }] }, { title: "main", tone: "ok", rows: [{ name: "a (at 1000)", value: 25, tone: "ok" }, { name: "b (at 1004)", value: 25 }, { name: "z", value: 1000 }] }] } },
    ] } },
    { type: "figure", id: "p-f11", caption: "GATE 2017 AN Q32. x and y are the function's own boxes. After ptr = &x, the names x and *ptr are two names for one box.", alt: "Four frames: x and y are 1, then x is 0, then y copies 0, then x is set to 1 through ptr.", fig: { kind: "frames", title: "printxy(1, 1)", frames: [
      { caption: "Call printxy(1, 1): x = 1, y = 1 are copies. ptr has no value yet.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 1 }, { addr: 1004, name: "y", value: 1 }, { addr: 1008, name: "ptr", value: "?", tone: "dim" }] } },
      { caption: "x = 0; ptr = &x; : x is now 0, and ptr points at x.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 0, tone: "ok" }, { addr: 1004, name: "y", value: 1 }, { addr: 1008, name: "ptr", value: 1000, ptr: "x", tone: "hl" }] } },
      { caption: "y = *ptr; : follow the arrow and copy x's value (0) into y.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 0 }, { addr: 1004, name: "y", value: 0, tone: "ok" }, { addr: 1008, name: "ptr", value: 1000, ptr: "x" }] } },
      { caption: "*ptr = 1; : follow the arrow and write 1 into x. The program prints x, y = 1, 0.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 1, tone: "ok" }, { addr: 1004, name: "y", value: 0 }, { addr: 1008, name: "ptr", value: 1000, ptr: "x" }] } },
    ] } },
    { type: "figure", id: "p-f12", caption: "Adding 1 to the address of an int moves to the next int. So &z[0] + 1 is the address of z[1], and *(&z[0] + 1) is z[1].", alt: "Two-element array z with arrows showing that &z[0] + 1 is the address of z[1].", fig: { kind: "array", title: "int z[2] = {10, 11};", data: [[10, 11]], base: 2000, size: 4, index: true, tones: { "0,1": "hl" }, pointers: [{ name: "&z[0]", at: [0, 0] }, { name: "&z[0] + 1", at: [0, 1] }] } },

    { type: "example", id: "p-e1", level: "easy", title: "Trace by hand: values after assignments", file: "trace_easy.c", given: `int a = 5, b = 8;
int *p = &a;
*p = b;
b = 1;`, find: "The values of a and b at the end.", steps: [
      { say: "int a = 5, b = 8; : two boxes.", result: "a = 5, b = 8" },
      { say: "int *p = &a; : p points at a.", result: "p -> a" },
      { say: "*p = b; : copy b's value (8) into the box p points at, which is a.", result: "a = 8" },
      { say: "b = 1; : changes b only. a was a copy, not a link.", result: "b = 1" },
    ], answer: "a = 8 and b = 1.", check: "*p = b copied the value once; it did not tie a to b." },
    { type: "example", id: "p-e2", level: "edge", title: "Why swap(x, y) does nothing but swap(&x, &y) works", file: "swap_demo.c", given: `void swap_copy(int a, int b) { int t = a; a = b; b = t; }
void swap_ptr(int *a, int *b) { int t = *a; *a = *b; *b = t; }

int main(void) {
    int x = 3, y = 7;
    swap_copy(x, y);
    printf("%d %d ", x, y);
    swap_ptr(&x, &y);
    printf("%d %d", x, y);
    return 0;
}`, find: "What is printed?", steps: [
      { say: "swap_copy gets copies of 3 and 7 in its own boxes and swaps those. The boxes vanish when it returns.", result: "x, y still 3, 7" },
      { say: "swap_ptr gets the addresses of x and y. *a is x and *b is y, so the swap happens in main's boxes.", result: "x, y become 7, 3" },
    ], answer: "3 7 7 3", check: "A function gets copies of its arguments. To let it change your variable, pass an address." },
    { type: "example", id: "p-e3", level: "gate", title: "GATE CS 2026 (afternoon), Q60 · 2 marks · NAT", file: "gate2026_q60.c", given: `#include <stdio.h>

int main() {
    int *ptr, a, b, c;
    a = 5;  b = 11;  c = 20;
    ptr = &a;
    *ptr = c;
    ptr = &c;
    a = *(&b);
    c = *ptr - a;
    printf("%d", c);
    return 0;
}`, find: "The output.", steps: [
      { say: "Draw a = 5, b = 11, c = 20 and ptr. ptr = &a; *ptr = c; writes c (20) into the box ptr points at, which is a.", result: "a = 20" },
      { say: "ptr = &c; moves the arrow to c. No number changes.", result: "ptr -> c" },
      { say: "a = *(&b); is a = b, because * undoes &.", result: "a = 11" },
      { say: "c = *ptr - a; and *ptr is c itself, so c = 20 - 11.", result: "c = 9" },
    ], answer: "9", check: "Official answer 9. The program was also compiled and run." },
    { type: "example", id: "p-e4", level: "gate", title: "GATE CS 2025 (forenoon), Q34 · 1 mark · NAT", file: "gate2025_q34.c", given: `#include <stdio.h>

void foo(int *p, int x) {
    *p = x;
}

int main() {
    int *z;
    int a = 20, b = 25;
    z = &a;
    foo(z, b);
    printf("%d", a);
    return 0;
}`, find: "The output.", steps: [
      { say: "z holds the address of a.", result: "z -> a" },
      { say: "foo gets a copy of that address in p and a copy of b's value 25 in x.", result: "p -> a, x = 25" },
      { say: "*p = x writes 25 into a.", result: "a = 25" },
    ], answer: "25", check: "Official answer 25. The program was also compiled and run." },
    { type: "example", id: "p-e5", level: "gate", title: "GATE CS 2017 (afternoon), Q32 · 1 mark · MCQ", file: "gate2017_q32.c", given: `void printxy(int x, int y)
{
    int *ptr;
    x = 0;
    ptr = &x;
    y = *ptr;
    *ptr = 1;
    printf("%d, %d", x, y);
}
/* the call: printxy(1, 1) */`, find: "The output of invoking printxy(1, 1). Options: (A) 0, 0   (B) 0, 1   (C) 1, 0   (D) 1, 1", steps: [
      { say: "x and y are the function's own copies, both 1. x = 0 sets x to 0.", result: "x = 0" },
      { say: "ptr = &x; y = *ptr; : ptr points at x, and y copies x's 0.", result: "y = 0" },
      { say: "*ptr = 1; writes 1 into x.", result: "x = 1" },
    ], answer: "(C) 1, 0", check: "Official answer (C) 1, 0. The program was also compiled and run." },
    { type: "example", id: "p-e6", level: "gate", title: "GATE CS 2022 (forenoon), Q21 · 1 mark · MCQ", file: "gate2022_q21.c", given: `#include <stdio.h>

int main(int argc, char *argv[])
{
    int x = 1, z[2] = {10, 11};
    int *p = NULL;
    p = &x;
    *p = 10;
    p = &z[1];
    *(&z[0] + 1) += 3;
    printf("%d, %d, %d\\n", x, z[0], z[1]);
    return 0;
}`, find: "What is printed? Options: (A) 1, 10, 11   (B) 1, 10, 14   (C) 10, 14, 11   (D) 10, 10, 14", steps: [
      { say: "p = &x; *p = 10; : p points at x, and the write changes x.", result: "x = 10" },
      { say: "p = &z[1]; : the arrow moves; no number changes.", result: "p -> z[1]" },
      { say: "&z[0] + 1 is the address of the next int, which is z[1]. The star follows it and adds 3 to z[1].", result: "z[1] = 14" },
      { say: "z[0] was never changed.", result: "10, 10, 14" },
    ], answer: "(D) 10, 10, 14", check: "Official answer (D). The program was also compiled and run." },

    { type: "walkthrough", steps: [
      "Step 1. Every variable has a value and an address. int x = 10; makes a box named x holding 10.",
      "Step 2. & asks for the address. int *p = &x; makes a second box p and puts x's address in it.",
      "Step 3. * follows the arrow. *p = 25; goes to the box p points at and writes 25 there. x changes, though the name x never appears on that line.",
      "Step 4. Pointers can be copied. After int *q = p; both p and q hold the same address, so both reach one box.",
      "Step 5. Moving an arrow and changing a box are different. p = &b moves the arrow. *p = 7 changes the box at its end.",
    ], prompt: { q: "int a = 1, b = 2; int *p = &a; p = &b; *p = 7; What are a and b?", a: "a is still 1. p = &b moved the arrow to b, and *p = 7 wrote into b, so b is 7." } },
    { type: "trap", wrong: "*p = b ties p's box to b.", tempting: "It looks like a link, like in a spreadsheet.", whyWrong: "It copies b's value once. Changing b afterwards does not change *p.", rule: "Assignment copies values. Only an address makes two names share a box.", ex: {"code":"int a = 5, b = 8;\nint *p = &a;\n*p = b;\nb = 1;\nprintf(\"%d %d\", a, b);","out":"8 1","text":"a is 8, not 1: the write copied b's value once, and changing b afterwards does not reach a."} },
    { type: "trap", wrong: "int *p = &x; writes to *p.", tempting: "The star and the equals sign sit next to each other.", whyWrong: "In a declaration the * only says p is a pointer. The line sets p, not *p.", rule: "Read int *p = &x; as int *p; p = &x;", ex: {"code":"int x = 10;\nint *p = &x;    /* sets p, not *p */\nprintf(\"%d\", x);","out":"10"} },
    { type: "trap", wrong: "int *p, q; makes two pointers.", tempting: "The star seems to belong to the type for both names.", whyWrong: "The star belongs to p only. q is an int.", rule: "One declaration per pointer: int *p; int *q;", ex: {"code":"int *p, q;\nprintf(\"%zu %zu\", sizeof(p), sizeof(q));","out":"8 4   (a 64-bit machine)"} },
    { type: "trap", wrong: "Assigning to a pointer parameter changes the caller's pointer.", tempting: "The pointer reaches the caller's variable, so everything about it seems shared.", whyWrong: "The function holds a copy of the arrow. Moving the copy leaves the caller's arrow alone; only *p reaches the caller's box.", rule: "Change *p to change the caller's variable; change p to change nothing outside.", ex: {"code":"void set(int *p) { int z = 50; p = &z; }\n/* in main: */\nint x = 5;\nint *p = &x;\nset(p);\nprintf(\"%d %d\", x, *p);","out":"5 5"} },
    { type: "trap", wrong: "A pointer is always 4 bytes.", tempting: "Old textbooks and many GATE pictures use 4.", whyWrong: "It is implementation-defined: 8 on most laptops.", rule: "Use the size the question gives; otherwise say what you assume.", ex: {"code":"printf(\"%zu\", sizeof(int *));","out":"8   (a 64-bit laptop)"} },
    { type: "trap", wrong: "*p++ adds one to the box p points at.", tempting: "It reads like 'p, plus plus', and the star is in front.", whyWrong: "++ binds to p first, so *p++ means *(p++): it reads the box and then moves the arrow. The box is unchanged.", rule: "To add one to the box write (*p)++ or *p += 1.", ex: {"code":"int x = 5;\nint *p = &x;\n*p++;           /* reads x, then moves p on */\nprintf(\"%d\", x);","out":"5","text":"To add one to the box write (*p)++, which makes x 6."} },
    { type: "shortcut", text: "To evaluate *p, find p's box, read the address in it, go to that box. If you cannot draw the arrow, you cannot evaluate it. Also: *&x is x and &*p is p.", validWhen: "Whenever every pointer involved points at a real box (not NULL, wild or dangling)." },
    { type: "gate", text: "Four forms have appeared. (1) Values after a run of assignments through pointers, as numerical answers: 2026 Q60 (2 marks). (2) A function that changes a variable through a pointer parameter: 2025 Q34 (1 mark). (3) A function's own copies, with a pointer to one of them: 2017 Q32 (1 mark). (4) A pointer together with an array element, with four options that are each one slip: 2022 Q21 (1 mark). Other questions on the same ideas have appeared in the C11 to C13 lessons (pointer arithmetic, pointer to pointer, local addresses); they are in the next chapter." },
    { type: "faded", title: "Your turn", given: "int x = 1, y = 2; int *p = &x, *q = &y; *p = *q; *q = 10;", steps: [
      { say: "After *p = *q; what is x?", blank: true, answer: "2: x gets y's value." },
      { say: "After *q = 10; what are x and y?", blank: true, answer: "x = 2 and y = 10." },
    ] },
    { type: "recall", cards: [
      { q: "What does &x give?", a: "The address of x." },
      { q: "What does *p do?", a: "Follows the address in p to the box, to read or write it." },
      { q: "int *p, q; How many pointers?", a: "One. q is an int." },
      { q: "Does *p = b link p's box to b?", a: "No. It copies b's value once." },
      { q: "What can swap(&x, &y) do that swap(x, y) cannot?", a: "Change the caller's x and y." },
      { q: "Is *NULL safe?", a: "No: undefined behaviour." },
      { q: "Why does scanf need &?", a: "It must write into your variable, so it needs the address." },
      { q: "Is a pointer 4 bytes?", a: "Machine-dependent; use the size the question gives." },
      { q: "What is *&x?", a: "x itself: the star undoes the ampersand." },
      { q: "(*p)++ versus *p++?", a: "(*p)++ adds one to the box; *p++ moves the arrow and leaves the box alone." },
      { q: "Does p = &b change a or b?", a: "Neither. It moves the arrow." },
      { q: "What is a dangling pointer?", a: "One that holds the address of a box that no longer exists." },
    ] },
    { type: "check", questions: [
      { id: "p1", kind: "NAT", marks: 1, q: "int a = 4; int *p = &a; (*p)++; printf(\"%d\", a); What is printed?", answer: "5", solution: "(*p)++ adds one to the box p points at." },
      { id: "p2", kind: "NAT", marks: 1, q: "int x = 1, y = 2; int *p = &x, *q = &y; *p = *q; *q = 10; What is x + y at the end?", answer: "12", solution: "x gets y's value (2); then y becomes 10: 2 + 10." },
      { id: "p3", kind: "MCQ", marks: 1, q: "What does int *p, q; declare?", options: ["Two pointers", "One pointer p and one int q", "One int p and one pointer q", "A syntax error"], answer: "B", solution: "The star belongs to p only." },
      { id: "p4", kind: "NAT", marks: 2, q: "int a = 5, b = 11, c = 20; int *ptr = &a; *ptr = c; ptr = &c; a = *(&b); c = *ptr - a; What is c? (GATE 2026 AN Q60)", answer: "9", solution: "a = 20, then ptr -> c, a = 11, c = 20 - 11 = 9." },
      { id: "p5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["*&x is the same as x", "In int *p, q; both are pointers", "swap(&x, &y) can change the caller's x and y", "Assigning to a pointer parameter changes the caller's pointer"], answer: "A, C", solution: "B: only p is a pointer. D: the function holds a copy of the arrow." },
      { id: "p6", kind: "NAT", marks: 2, q: "void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }  int x = 5; swap(&x, &x); What is x?", answer: "5", solution: "t = 5; *a = *b writes 5; *b = t writes 5." },
      { id: "p7", kind: "NAT", marks: 1, q: "int a = 5, b = 11, c = 20; int *ptr = &b; *ptr = a; ptr = &c; c = *ptr + b; What is c?", answer: "25", solution: "b becomes 5; the arrow moves to c; c = 20 + 5 = 25." },
      { id: "p8", kind: "NAT", marks: 1, q: "void foo(int *p, int x) { x = *p; *p = x + 1; }  int a = 20, b = 25; foo(&a, b); What is a?", answer: "21", solution: "x copies a (20); *p = x + 1 writes 21 into a." },
      { id: "p9", kind: "MCQ", marks: 2, q: "int x = 1, z[2] = {10, 11}; int *p = &x; *p = 10; p = &z[1]; *(&z[0]) += 3; printf(\"%d, %d, %d\", x, z[0], z[1]); What is printed?", options: ["1, 13, 11", "10, 13, 11", "10, 10, 14", "10, 14, 11"], answer: "B", solution: "x becomes 10; *(&z[0]) is z[0], so it becomes 13; z[1] stays 11." },
      { id: "p10", kind: "MSQ", marks: 2, q: "Which of these cause undefined behaviour?", options: ["int *p = NULL; *p = 3;", "int *p; *p = 3;", "int x = 3; int *p = &x; *p = 4;", "int *f(void) { int z = 5; return &z; } followed by *f() = 6;"], answer: "A, B, D", solution: "NULL, a wild pointer and a dangling pointer must not be followed. C follows a valid pointer." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on pointers", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: pointers and arrays", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Variables and types (C2)"], usedIn: ["Pointers II: arithmetic and arrays (C11)", "Linked lists", "Dynamic memory"], cross: ["COA: memory addresses"] },
  ],
};
