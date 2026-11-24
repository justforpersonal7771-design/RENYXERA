# C10 · Pointers I: memory and addresses  (PILOT LESSON, v0.1)

**Book:** Programming and Data Structures · **Chapter:** 06 Pointers · **Tag:** [MUST] · **Reading time:** about 75 minutes, plus practice.
**Prerequisites (taught earlier in this book, restated in one line each):** a *variable* is a named box that holds one value (C2); an `int` is 4 bytes here (C2); you can read a short C program (C1). If any of these is shaky, read C0 to C2 first.
**Standard and machine:** every program below is C11, compiled with `gcc -std=c11 -Wall -Wextra`, and its printed output was produced by running it (`npm run check:lesson`). Addresses in pictures are *illustrative* (1000, 1004, ...). Real programs print other numbers, and 64-bit machines use 8-byte pointers; GATE usually says what to assume, and you always use what the question gives.
**Reviewer guidance used:** ChatGPT's "no silent machine assumptions, one idea at a time, undefined behaviour never given one answer" and Gemini's "name view vs address view, NULL vs wild vs dangling in one picture, close the `scanf` loop". Source: `reviews-received/` in this folder.

> **After this lesson you can:** draw any short pointer program as boxes and arrows, say what it prints, and explain why `swap(&a, &b)` works when `swap(a, b)` does not.

---

## S1 · Why do I need this?

Imagine a friend asks you to add one to the number in your notebook. Two ways:

1. You **photocopy** the page and hand over the copy. Your friend adds one to the copy. Your notebook has not changed.
2. You tell your friend **the page number**. Your friend opens *your* notebook at that page and changes it.

In C, a function normally gets the photocopy (a copy of the value). Sometimes you need method 2: a function that changes the caller's own variable, or two names that reach the same box. The "page number" is called an **address**, and a variable that stores an address is called a **pointer**. That is the whole subject. The rest of this lesson makes the idea exact.

## S2 · Words you must know

| Word | Plain meaning | Everyday picture |
|---|---|---|
| **Memory** | A long row of numbered boxes, each holding one byte | A street of numbered houses |
| **Address** | The number of a box | The house number |
| **Variable** | A named box that holds a value | A house with a name board |
| **`&x`** ("address of x") | The address of the box called `x` | Asking "what is x's house number?" |
| **Pointer** | A variable whose value is an address | A card with a house number written on it |
| **`*p`** ("follow p") | Go to the address stored in `p` and use the box there | Walk to the house on the card |
| **Pointee** | The box that a pointer points to | The house the card names |
| **`NULL`** | The special address that means "no box" | A card that says "nowhere" |

## S3 · See it first

Two boxes. `x` is a number box. `p` is a pointer box. The arrow shows that `p` holds the address of `x`.

```diagram
{"kind":"memory","title":"int x = 10; int *p = &x;","note":"Look at p: its value, 1000, is the address of x. The arrow is how we draw 'points to'.","cells":[{"id":"x","addr":1000,"name":"x","value":10,"size":4,"tone":"hl"},{"addr":1004,"name":"","value":"?","size":4,"tone":"dim"},{"id":"p","addr":1008,"name":"p","value":1000,"size":4,"ptr":"x"}]}
```
```text
 name    address   box
  x      1000     [  10  ] <-----+
         1004     [  ?   ]       |
  p      1008     [ 1000 ] ------+      p holds 1000 = the address of x
```

Five things to notice: (1) every box has an **address**; (2) `x` has a **name** too, `p` has one; (3) the box `p` holds a *number*, and that number is an address; (4) the arrow is just a drawing of "1000 is where x lives"; (5) `p` is itself a box with its own address (1008).

## S4 · Build it step by step

**Step 1. Every variable has two things: a value and an address.**

```c
#include <stdio.h>
int main(void) {
    int x = 10;
    printf("%d\n", x);
    return 0;
}
```
```output
10
```
`x` is a box with 10 inside. It also lives somewhere. We cannot see where yet.

**Step 2. `&` asks for the address.** `&x` is "the address of x". We store it in a pointer. A pointer variable is declared with a `*`: `int *p` means "p is a box that holds the address of an int".

**Step 3. `*` follows the arrow.** `*p` means "go to the address inside p and use that box". It works for reading *and* for writing.

```c
#include <stdio.h>
int main(void) {
    int x = 10;
    int *p = &x;
    printf("%d %d\n", x, *p);
    *p = 25;
    printf("%d\n", x);
    return 0;
}
```
```output
10 10
25
```
`*p = 25;` walked along the arrow to `x` and wrote 25 there. We never used the name `x` on that line, yet `x` changed. Watch it happen, one line at a time:

```diagram
{"kind":"frames","title":"int x = 10; int *p = &x; *p = 25;","frames":[
{"caption":"After int x = 10; : x is a box holding 10. Nothing points anywhere yet.","fig":{"kind":"memory","cells":[{"id":"x","addr":1000,"name":"x","value":10}]}},
{"caption":"After int *p = &x; : p is a new box. It holds 1000, the address of x.","fig":{"kind":"memory","cells":[{"id":"x","addr":1000,"name":"x","value":10},{"addr":1004,"name":"p","value":1000,"ptr":"x","tone":"hl"}]}},
{"caption":"After *p = 25; : follow the arrow from p and write 25 into x. p itself did not change.","fig":{"kind":"memory","cells":[{"id":"x","addr":1000,"name":"x","value":25,"tone":"ok"},{"addr":1004,"name":"p","value":1000,"ptr":"x"}]}}]}
```

**Step 4. Two names, one box.** A pointer can be copied. After `q = p`, both hold the same address, so both reach the same box.

```c
#include <stdio.h>
int main(void) {
    int x = 10;
    int *p = &x;
    int *q = p;
    *q = 99;
    printf("%d %d %d\n", x, *p, *q);
    return 0;
}
```
```output
99 99 99
```
```diagram
{"kind":"memory","title":"Two pointers, one box","note":"p and q both hold 1000. Writing through q changed what p sees.","cells":[{"id":"x","addr":1000,"name":"x","value":99,"tone":"ok"},{"addr":1004,"name":"p","value":1000,"ptr":"x"},{"addr":1008,"name":"q","value":1000,"ptr":"x"}]}
```

**Step 5. Change the arrow, or change the box?** These are two different actions. Keep them apart.

```c
#include <stdio.h>
int main(void) {
    int a = 1, b = 2;
    int *p = &a;
    p = &b;
    *p = 7;
    printf("%d %d\n", a, b);
    return 0;
}
```
```output
1 7
```
`p = &b;` moves the **arrow** (p now holds b's address). `*p = 7;` changes the **box** the arrow ends at (that is now b). `a` was never touched.

```diagram
{"kind":"frames","title":"Arrow first, then box","frames":[
{"caption":"p = &a : p points at a.","fig":{"kind":"memory","cells":[{"id":"a","addr":1000,"name":"a","value":1},{"id":"b","addr":1004,"name":"b","value":2},{"addr":1008,"name":"p","value":1000,"ptr":"a"}]}},
{"caption":"p = &b : the arrow moves. No number in a or b changed.","fig":{"kind":"memory","cells":[{"id":"a","addr":1000,"name":"a","value":1},{"id":"b","addr":1004,"name":"b","value":2},{"addr":1008,"name":"p","value":1004,"ptr":"b","tone":"hl"}]}},
{"caption":"*p = 7 : follow the arrow and write into b.","fig":{"kind":"memory","cells":[{"id":"a","addr":1000,"name":"a","value":1},{"id":"b","addr":1004,"name":"b","value":7,"tone":"ok"},{"addr":1008,"name":"p","value":1004,"ptr":"b"}]}}]}
```

## S5 · Do it by hand

Trace each program by drawing the boxes after **every** line. (Before = the state above the line, after = the state below it.)

**Trace 1.** `int a = 5, b = 8; int *p = &a; *p = b; b = 1;`

| After line | a | b | p points to |
|---|---|---|---|
| `int a = 5, b = 8;` | 5 | 8 | (not yet) |
| `int *p = &a;` | 5 | 8 | a |
| `*p = b;` | **8** | 8 | a |
| `b = 1;` | 8 | **1** | a |

`a` is 8, not 1: `*p = b` copied b's *value* (8) at that moment; it did not tie a to b.

**Trace 2.** `int x = 3; int *p = &x; int *q = &x; *p = *p + *q;` Both reach x. `*p + *q` is 3 + 3 = 6, written into x. Result: x is 6.

**Trace 3 (swap).** The reason pointers matter, in two versions side by side.

```c
#include <stdio.h>
void swap_copy(int a, int b) { int t = a; a = b; b = t; }
void swap_ptr(int *a, int *b) { int t = *a; *a = *b; *b = t; }
int main(void) {
    int x = 3, y = 7;
    swap_copy(x, y);
    printf("%d %d\n", x, y);
    swap_ptr(&x, &y);
    printf("%d %d\n", x, y);
    return 0;
}
```
```output
3 7
7 3
```
`swap_copy` receives **copies** of 3 and 7 in its own boxes and swaps those. When it ends, its boxes vanish; `x` and `y` are untouched. `swap_ptr` receives the **addresses** of x and y, so `*a` and `*b` *are* x and y.

```diagram
{"kind":"frames","title":"swap_ptr(&x, &y)","frames":[
{"caption":"main has x = 3 and y = 7. swap_ptr is called with their addresses 1000 and 1004.","fig":{"kind":"stackframe","frames":[{"title":"swap_ptr","tone":"hl","rows":[{"name":"a","value":1000},{"name":"b","value":1004},{"name":"t","value":"?"}]},{"title":"main","rows":[{"name":"x (at 1000)","value":3},{"name":"y (at 1004)","value":7}]}]}},
{"caption":"t = *a; copies x's value (3) into t.","fig":{"kind":"stackframe","frames":[{"title":"swap_ptr","rows":[{"name":"a","value":1000},{"name":"b","value":1004},{"name":"t","value":3,"tone":"ok"}]},{"title":"main","rows":[{"name":"x","value":3},{"name":"y","value":7}]}]}},
{"caption":"*a = *b; writes y's value into x. Then *b = t; writes 3 into y.","fig":{"kind":"stackframe","frames":[{"title":"swap_ptr","rows":[{"name":"a","value":1000},{"name":"b","value":1004},{"name":"t","value":3}]},{"title":"main","tone":"ok","rows":[{"name":"x","value":7,"tone":"ok"},{"name":"y","value":3,"tone":"ok"}]}]}}]}
```

## S6 · Now the exact rules

1. `&x` has the type "pointer to the type of x". Its value is the address of x.
2. `T *p;` declares `p` as a pointer to `T`. In a declaration the `*` means "pointer to"; in an expression `*p` means "the object p points to". Same symbol, two jobs.
3. `*p` can be on the left of `=` (write) or in an expression (read).
4. `*&x` is just `x`. `&*p` is just `p` (when p is valid).
5. In `int *p, q;` only `p` is a pointer; `q` is a plain `int`. Write `int *p; int q;` to avoid the trap.
6. Pointers to different types are different types. The type tells how many bytes to read at the address and how to read them.
7. A pointer variable takes the same space whatever it points to. How much space is **implementation-defined** (4 bytes in the usual GATE picture, 8 on most laptops). Use the number the question gives.

```c
#include <stdio.h>
int main(void) {
    int x = 5;
    int *p = &x;
    printf("%d %d\n", *&x, (&*p == p));
    printf("%d\n", (int)(sizeof(char *) == sizeof(int *)));
    return 0;
}
```
```output
5 1
1
```

## S7 · The finer points

**[CORE] Reading an uninitialised pointer is a bug.** A pointer that was never given an address has an *indeterminate* value (not "zero", not "garbage you can rely on").

**[CORE] `NULL`, wild and dangling pointers.** Three different ways a pointer can be unusable:

| Kind | What it holds | Using `*p` |
|---|---|---|
| **NULL** | The special "no box" address | Undefined behaviour (usually a crash, but never promised) |
| **Wild** | Never assigned, so no meaning | Undefined behaviour: may hit some other variable silently |
| **Dangling** | The address of a box that no longer exists | Undefined behaviour: the box may now hold something else |

```c-nocheck
int *p;            /* wild: never assigned          */
*p = 5;            /* undefined behaviour           */

int *q = NULL;     /* NULL: deliberately "nowhere"  */
printf("%d", *q);  /* undefined behaviour           */
```
**Undefined behaviour** means the C standard promises nothing: the program may crash, print rubbish, or appear to work. Never give one output as "the answer" for such code. (Dangling pointers from function locals come in C13, and from `free` in C15.)

```diagram
{"kind":"memory","title":"Three pointers that cannot be used","note":"p1 = NULL (nowhere), p2 = never assigned (a random house), p3 = a box that no longer exists (dim).","cells":[{"id":"n","addr":"-","name":"NULL","value":"nowhere","tone":"dim"},{"addr":1000,"name":"p1","value":0,"ptr":"n","tone":"hl"},{"addr":1004,"name":"p2","value":"?","tone":"bad"},{"id":"gone","addr":1100,"name":"gone","value":"freed","tone":"dim"},{"addr":1008,"name":"p3","value":1100,"ptr":"gone","tone":"bad"}]}
```

**[CORE] A function gets copies of its arguments, including pointers.** Assigning to the parameter `p` inside a function changes the copy of the arrow only; writing through `*p` changes the caller's box.

```c
#include <stdio.h>
void set(int *p) { int z = 50; p = &z; }
int main(void) {
    int x = 1;
    set(&x);
    printf("%d\n", x);
    return 0;
}
```
```output
1
```
**[GATE+] Aliasing.** Two names for one box can surprise you: `swap(&x, &x)` with the temporary-variable swap leaves x unchanged, but the XOR swap makes it 0 (see practice T1).

**Closing the `scanf` loop (from C1).** `printf("%d", x)` needs the **value** of `x`, so it gets a copy. `scanf("%d", &x)` must *put* a number into `x`, so it needs the **address** of `x`:

```c
/* stdin: 42 */
#include <stdio.h>
int main(void) {
    int n;
    scanf("%d", &n);
    printf("%d\n", n);
    return 0;
}
```
```output
42
```

**[BEYOND]** Printing an address uses `%p` with a `(void *)` cast; the number differs on every machine and run, so no exam question can depend on it.

## S8 · How GATE asks this

Four forms. The model questions below are real previous-year questions; the official answers were also confirmed by running the programs.

**Form 1: values after assignments through pointers (NAT).**
*GATE CS 2026, afternoon session, Q60 (bank id 2026_AN_Q60), 2 marks.*
```c
#include <stdio.h>
int main() {
    int *ptr, a, b, c;
    a = 5; b = 11; c = 20;
    ptr = &a; *ptr = c;
    ptr = &c; a = *(&b);
    c = *ptr - a;
    printf("%d", c);
    return 0;
}
```
```output
9
```
*Think:* draw a, b, c, ptr. `ptr = &a; *ptr = c;` → a = 20. `ptr = &c;` moves the arrow to c. `a = *(&b);` is `a = b` → a = 11. `c = *ptr - a;` and `*ptr` is c itself: 20 − 11 = **9**. Official answer: 9. ✔

**Form 2: a function changes a variable through a pointer (NAT).**
*GATE CS 2025, forenoon session, Q34 (2025_FN_Q34), 1 mark.*
```c
#include <stdio.h>
void foo(int *p, int x) { *p = x; }
int main() {
    int *z;
    int a = 20, b = 25;
    z = &a;
    foo(z, b);
    printf("%d", a);
    return 0;
}
```
```output
25
```
*Think:* `z` holds the address of `a`. `foo` gets a copy of that address in `p` and a copy of `b`'s value 25 in `x`. `*p = x` writes 25 into `a`. Official answer: **25**. ✔

**Form 3: call by value with a pointer parameter (MCQ).**
*GATE CS 2017, afternoon session, Q32 (2017_AN_Q32), 1 mark.* `printxy(1, 1)` is called.
```c
#include <stdio.h>
void printxy(int x, int y) {
    int *ptr;
    x = 0;
    ptr = &x;
    y = *ptr;
    *ptr = 1;
    printf("%d, %d", x, y);
}
int main(void) { printxy(1, 1); return 0; }
```
```output
1, 0
```
*Think:* `x` and `y` are the function's own copies. `x = 0;` → x is 0. `ptr` points at x. `y = *ptr;` copies x's 0 into y. `*ptr = 1;` writes 1 into x. So x = 1, y = 0. Official answer: **(C) 1, 0**. ✔

**Form 4: which statements are true / which lines are undefined (MSQ).** Appears in other years; for this lesson, practise by asking of each line: "is every pointer here pointing at a real box?" (Source records for these forms will be added when the PYQ bank is tagged; no frequency is claimed.)

## S9 · Mistakes everyone makes

1. **"`*p = b` ties the two together."** It copies the value once. (Trace 1.)
2. **Mixing the two jobs of `*`.** In `int *p = &x;` the `*` is part of the *declaration*; the line does **not** write to `*p`. Read it as `int *p; p = &x;`.
3. **`int *p, q;`** makes `q` an `int`, not a pointer.
4. **Changing the pointer when you meant the pointee** (`p = &z` inside a function). The caller never sees it. (S7 example.)
5. **Using a pointer before giving it an address.** The line `*p = 5;` with an unassigned `p` is undefined.
6. **Assuming a pointer is 4 bytes.** It depends on the machine; use the value the question states.

## S10 · Shortcuts

- *"Follow the arrow"* trick: to evaluate `*p`, find p's box, read its address, go to that box. If you cannot draw the arrow, you cannot evaluate it. Valid for every pointer question in this chapter.
- `*&x` → `x`, and `&*p` → `p`. Valid whenever `p` points at a real box.
- When two names reach one box (aliasing), write **both** names next to the one box in your drawing.

## S11 · Practice (20 questions; answers are under each; all outputs were run)

**Warm-up (5).** What does each print?

```c
#include <stdio.h>
int main(void) {
    int a = 4; int *p = &a;
    printf("%d\n", *p);
    return 0;
}
```
<details><summary>W1 answer</summary>

```output
4
```
`*p` follows the arrow to a.
</details>

```c
#include <stdio.h>
int main(void) {
    int a = 4, b = 9; int *p = &a;
    *p = b;
    printf("%d %d\n", a, b);
    return 0;
}
```
<details><summary>W2 answer</summary>

```output
9 9
```
b's value (9) is copied into a. b is unchanged.
</details>

```c
#include <stdio.h>
int main(void) {
    int a = 4; int *p = &a;
    (*p)++;
    printf("%d\n", a);
    return 0;
}
```
<details><summary>W3 answer</summary>

```output
5
```
`(*p)++` adds one to the box p points at. (The brackets matter: C13 and C11 return to `*p++`.)
</details>

```c
#include <stdio.h>
int main(void) {
    int a = 2; int *p = &a, *q = &a;
    *p = *p + *q;
    printf("%d\n", a);
    return 0;
}
```
<details><summary>W4 answer</summary>

```output
4
```
Both reach a: 2 + 2.
</details>

```c
#include <stdio.h>
int main(void) {
    int a = 5, b = 6; int *p = &a;
    p = &b;
    printf("%d\n", *p);
    return 0;
}
```
<details><summary>W5 answer</summary>

```output
6
```
The arrow moved to b.
</details>

**Core (6).**

```c
#include <stdio.h>
int main(void) {
    int x = 1, y = 2; int *p = &x, *q = &y;
    *p = *q; *q = 10;
    printf("%d %d\n", x, y);
    return 0;
}
```
<details><summary>C1 answer</summary>

```output
2 10
```
x gets y's value (2) first; then y becomes 10.
</details>

```c
#include <stdio.h>
int main(void) {
    int x = 3; int *p = &x; int *q = p;
    *q = *q * 2;
    printf("%d %d\n", x, *p);
    return 0;
}
```
<details><summary>C2 answer</summary>

```output
6 6
```
</details>

```c
#include <stdio.h>
void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }
int main(void) {
    int x = 8, y = 1;
    swap(&x, &y);
    printf("%d %d\n", x, y);
    return 0;
}
```
<details><summary>C3 answer</summary>

```output
1 8
```
</details>

```c
#include <stdio.h>
void inc(int *n) { *n = *n + 1; }
int main(void) {
    int x = 0;
    inc(&x); inc(&x); inc(&x);
    printf("%d\n", x);
    return 0;
}
```
<details><summary>C4 answer</summary>

```output
3
```
</details>

```c
#include <stdio.h>
void f(int n) { n = n + 10; }
int main(void) {
    int x = 5;
    f(x);
    printf("%d\n", x);
    return 0;
}
```
<details><summary>C5 answer</summary>

```output
5
```
`f` changed its own copy only.
</details>

```c
#include <stdio.h>
int main(void) {
    int x = 7; int *p = &x;
    printf("%d\n", *&*p + 1);
    return 0;
}
```
<details><summary>C6 answer</summary>

```output
8
```
`*&*p` is `*p` is x (7); then +1.
</details>

**GATE-level (6)** (three are the real PYQs in S8; do these without looking back).

```c
#include <stdio.h>
int main(void) {
    int a = 1, b = 2, c = 3; int *p = &a, *q = &b;
    *p = *q + c;
    q = p;
    *q = *q * 2;
    printf("%d %d\n", a, b);
    return 0;
}
```
<details><summary>G4 answer</summary>

```output
10 2
```
`*p = 2 + 3` → a = 5. `q = p` points q at a. `*q = 5 * 2` → a = 10. b stays 2.
</details>

```c
#include <stdio.h>
void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }
int main(void) {
    int x = 5;
    swap(&x, &x);
    printf("%d\n", x);
    return 0;
}
```
<details><summary>G5 answer</summary>

```output
5
```
t = 5; *a = *b writes 5 into x; *b = t writes 5 again.
</details>

```c
#include <stdio.h>
int main(void) {
    int a = 3, b = 4; int *p = &a, *q = &b;
    p = q;
    *p = 9;
    printf("%d %d %d\n", a, b, *p);
    return 0;
}
```
<details><summary>G6 answer</summary>

```output
3 9 9
```
</details>

*(G1 to G3 = the three PYQs: 2026_AN_Q60 → 9, 2025_FN_Q34 → 25, 2017_AN_Q32 → 1, 0.)*

**Twisted (3).**

```c
#include <stdio.h>
int main(void) {
    int x = 5; int *p = &x, *q = &x;
    *p ^= *q; *q ^= *p; *p ^= *q;
    printf("%d\n", x);
    return 0;
}
```
<details><summary>T1 answer</summary>

```output
0
```
The XOR-swap trick breaks when both names are the same box: x ^ x = 0, and 0 stays 0.
</details>

```c
#include <stdio.h>
void set(int *p) { int z = 50; p = &z; }
int main(void) {
    int x = 1;
    set(&x);
    printf("%d\n", x);
    return 0;
}
```
<details><summary>T2 answer</summary>

```output
1
```
`p = &z` moves only the function's copy of the arrow. (The compiler may warn that `p` is set but not used.)
</details>

```c
#include <stdio.h>
int main(void) {
    int x = 2; int *p = &x;
    *p = *p * *p;
    *p += 1;
    printf("%d\n", x);
    return 0;
}
```
<details><summary>T3 answer</summary>

```output
5
```
`*p * *p` is 2 × 2 = 4, written into x; then +1.
</details>

## S12 · Recap

1. Every variable has a value and an address. `&x` is the address.
2. A pointer is a variable that holds an address. `int *p` declares one.
3. `*p` follows the arrow: it reads or writes the box `p` points at.
4. `p = ...` moves the arrow; `*p = ...` changes the box.
5. Two pointers with the same address reach one box.
6. A function receives copies; pass an address to let it change your variable.
7. A pointer that points nowhere useful (NULL, wild, dangling) must not be followed.
8. Pointer size and addresses are machine facts; use what the question says.
9. `printf` needs a value; `scanf` needs an address.
10. Draw boxes and arrows for every pointer question.

**Flash cards.** What does `&x` give? *The address of x.* · What does `*p` do? *Follows p's address to the box.* · `int *p, q;` how many pointers? *One (p).* · Does `*p = b` link p's box to b? *No: copies b's value once.* · What can `swap(&x,&y)` do that `swap(x,y)` cannot? *Change the caller's x and y.* · Is `*NULL` safe? *No: undefined.* · Why does `scanf` need `&`? *It must write into your variable.* · Is a pointer 4 bytes? *Depends on the machine; use the given value.*

**Cheat picture:** a box named `x` (value 10), a box named `p` (value 1000, the address of x), and an arrow from p to x labelled `*p` goes here. The `memory` figure in S3 is that picture.

**What comes next and why:** C11 adds `p + 1`: because memory is a street of boxes, a pointer can step to the next box. That lesson explains arrays through pointers, and the PYQs that use `*(&z[0] + 1)` and `*(arr[1] + 9)`.

---
**Self-check (honest):** all programs compile and their outputs match (`npm run check:lesson docs/study-materials/v2/programming-and-data-structures/pilot/C10-pointers-1.md`). Six figure blocks use the master figure kinds (three are step-by-step frames, so nine pictures in all); the master prompt's old "8 diagrams" floor is replaced by ChatGPT's rule that every diagram must teach something. **Not done / to verify:** the three PYQ citations lack the official paper and answer-key links (to be added from the source records); GATE frequencies are deliberately not stated; the lesson has not yet been read by real weak readers (the pilot test the reviewers require).
