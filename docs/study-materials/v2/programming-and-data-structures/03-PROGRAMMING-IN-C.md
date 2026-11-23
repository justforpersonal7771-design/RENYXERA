# 03 · Subject plan: Programming in C (plan **v2**, after three reviews)

**Reader:** a dropper with almost no programming knowledge. **Goal:** after this book the reader can read any GATE-size C program and say what it prints, what it computes, why, and what can go wrong; and can write the small programs GATE needs.

**What changed from v1** (full list and reasons in `05-REVIEW-MERGE-C.md`): a recursion chapter inside C; a mystery-function chapter; ten order fixes; a corrected struct-alignment rule; a corrected overflow picture; the missing GATE traps added; every chapter now has all five parts; two tracks and hour estimates; clear counting.

---

## 0. What does GATE do with C? (in plain words)

| GATE asks | What you need to be able to do |
|---|---|
| "What is the output?" | Read code line by line; know what `printf` prints and how; follow loops and pointers |
| "What is the value of x after ...?" | Know the order in which C works things out; know when a result is not defined |
| "How many bytes?" | Know the size of each type; know how a group of variables is laid out in memory |
| "Which statement is true / which are true (MSQ)?" | Know the rules of the language exactly, including what is allowed and what is an error |
| "Find the error / which line crashes?" | Spot a pointer that points nowhere, a box that was never filled, a loop that goes too far |
| "What does f(5) return? How many calls?" | Follow a function that calls itself, and count the calls |
| "What does this function compute for any n?" | Read an unfamiliar loop or function and say what it does (GCD, digits, bits, primes ...) |
| "What is printed after the macro is expanded?" | Do find-and-replace by hand before reading the result |
| "What is passed to the function and what changes?" | Know exactly which values are copied and which boxes are shared |

(GATE answer formats: MCQ, **MSQ** (more than one correct) and **NAT** (type the number). Every practice ladder uses all three.)

### 0.1 Words used in this plan

- **Chapter** (C0, C1, ...): a big area. **Lesson**: one piece of a chapter, written in one go with the master prompt, 45 to 90 minutes of reading. **Sub-topic** (C2.7): a line inside a lesson.
- **Tags:** **[MUST]** GATE-weighted, needed on the 100-day path. **[SHOULD]** asked sometimes. **[LATER]** rarely asked; read if time allows. (Hour counts are estimates until the pilot lesson calibrates them.)

---

## 1. The order of chapters (every chapter uses only what came before)

```
Part A  Foundations     C0  How a computer runs a program                 [MUST]  ~5 h
                        C1  Your first program                            [MUST]  ~6 h
                        C2  Variables and data types                      [MUST]  ~10 h
                        C3  Operators and expressions                     [MUST]  ~8 h
Part B  Control         C4  Decisions                                     [MUST]  ~3 h
                        C5  Loops                                         [MUST]  ~6 h
Part C  Functions       C6  Functions and the call stack                  [MUST]  ~6 h
                        C7  Scope, lifetime and storage classes           [MUST]  ~6 h
                        C8  Recursion                                     [MUST]  ~8 h
Part D  Memory          C9  Arrays                                        [MUST]  ~7 h
                        C10 Pointers I: memory and addresses              [MUST]  ~7 h
                        C11 Pointers II: arithmetic, arrays with pointers [MUST]  ~8 h
                        C12 Strings                                       [MUST]  ~7 h
                        C13 Pointers III: advanced                        [SHOULD] ~7 h
Part E  Structures      C14 struct, union, enum, bit-fields, typedef      [MUST]  ~8 h
                        C15 Dynamic memory: the heap                      [MUST]  ~7 h
Part F  The rest        C16 Preprocessor and macros                       [MUST]  ~4 h
                        C17 Parameter passing and scope (the GATE view)   [SHOULD] ~5 h
                        C18 Files, errors, variable arguments             [LATER] ~3 h
Part G  GATE skills     C19 Reading mystery functions                     [MUST]  ~5 h
                        C20 Output-prediction method and undefined behaviour [MUST] ~5 h
                        C21 Previous-year patterns and mixed practice     [MUST]  ~8 h
```
About 75 lessons. Reading plus practice: roughly 140 h in all; the [MUST]-only path about 100 h. **Estimates, to be checked on the pilot.**

**Machine rule for the whole book (from the ChatGPT master review):** never assume sizes silently. Use exactly the sizes, signedness, alignment and endianness the *question* gives. When a question gives none, say what the C standard guarantees and what a common machine does, and label every address in a picture as *illustrative* (like 1000). For teaching, the usual GATE picture is a 32-bit little-endian machine (`int` 4 B, pointer 4 B); your laptop is 64-bit (`sizeof(int *)` prints 8, addresses look like `0x7ffe...`). Both are right. Other points the book states plainly: a C byte is `CHAR_BIT` bits (8 on every machine we use); two's complement is the assumed teaching model, not a guarantee of the standard; "stack", "heap" and ".bss" are a common *implementation picture*, while the language itself speaks of automatic, static and allocated storage; C `^` is XOR, never power; a local that was never assigned holds an *indeterminate* value (reading it is a bug, not just "garbage").

---

## 2. The shape of every chapter

Every lesson follows the 12-station ladder of the master prompt. For each chapter below: **Lessons → Beginner must see → Finer points → GATE level → Diagrams → Traces by hand.**

---

## C0 · How a computer runs a program  [MUST]

- **Lessons:** (1) What a program is; disk, RAM and CPU, the "kitchen model" (fridge = disk, counter = RAM, chef = CPU). (2) Memory as a street of numbered boxes; bits as switches; bytes. (3) Binary, octal, hex: place values, grouping 4 bits into a hex digit. (4) Source, compiler, linker, loader: what each does and what "running" means.
- **Beginner must see:** why data disappears when power goes; what an *address* is; why a byte holds 0 to 255; hex as a short way of writing 4 bits; compile and run are two separate moments.
- **Finer points:** 1 KB = 1024; a byte is 8 bits on every machine we use (the C standard only says "at least 8"); what the linker joins (your code plus the ready-made code for `printf`); a program that compiles can still fail when it runs.
- **GATE level:** fast binary ↔ octal ↔ hex conversion; counting bytes and addresses.
- **Diagrams:** disk → RAM → CPU; one byte as 8 switches with place values 128 to 1; binary ↔ hex 4-bit bridge (series); source → .o → linker → .exe → loader (series); the street of boxes 1000 to 1015.
- **Traces:** 45 to binary; 10110110 to hex; 0x2F to decimal.

## C1 · Your first program  [MUST]

- **Lessons:** (1) Get C running today (GCC or an online compiler), the smallest program, every symbol explained, and the **old Turbo C habits to drop** (`void main`, `conio.h`, `clrscr`, `getch`, `fflush(stdin)`). (2) `printf`: text, escapes, **format specifiers** (`%d %i %u %c %s %f %lf %x %o %p %%`, width and precision such as `%5.2f`). (3) `scanf`: reading values, why it needs the box's address (two-line analogy), and its traps. (4) Tokens, comments, errors: syntax, linker, run-time, logic. The 3-step trace habit begins here.
- **Beginner must see:** the smallest program line by line; what `;` and `{ }` do; how to read a compiler error.
- **Finer points:** `main` returns `int`; case sensitivity; escapes `\n \t \\ \" \' \0 \b \r`, octal `\101` and hex `\x41` escapes; **maximal munch** (`a+++b` is `a++ + b`); comments do not nest; `printf` and `scanf` also give back a number (details in C6); `scanf("%c")` taking a left-over newline; typing letters for `%d`; why `fflush(stdin)` is not allowed.
- **GATE level:** string length with escapes; `printf` format output; tokenising puzzles; `scanf` return value.
- **Diagrams:** the six-line program with coloured call-outs; keyboard → buffer → `scanf` picks `25` and leaves `\n` for the next `scanf("%c")` (series); four error stations (syntax, linker, run-time, logic); format-specifier table with a picture of one value printed five ways.
- **Traces:** a three-line program; a `scanf` buffer trace; tokenising `a+++b`.

## C2 · Variables and data types  [MUST]

- **Lessons:** (1) A variable as a labelled box; declaration, initialisation, assignment; `sizeof` (and the trap that **`sizeof` never runs what is inside it**: `sizeof(i++)` leaves `i` alone). (2) Integers: `int short long long long`, `signed`/`unsigned`, ranges; building negative numbers slowly (sign and magnitude → why `-0` hurts → ones' complement → **two's complement**), traced for `-5` and `-128`. (3) **Endianness:** how a 4-byte `0x12345678` sits in four boxes, little vs big. (4) `char` and ASCII: `'A'` is an `int` in C (`sizeof('A')` is 4); the four zeros `0`, `'0'`, `'\0'`, `"0"`. (5) Conversions: promotion, usual arithmetic conversions, sign extension, casts, signed vs unsigned comparison; overflow (unsigned wraps, signed is undefined). (6) `float` and `double` (intuition and traps, not the bit layout), constants and literals (octal `012`, hex, suffixes), `const`, and a two-line **preview of `#define`** ("find and replace before compiling").
- **Beginner must see:** the type decides both how many boxes and how the 0s and 1s are read; why `3/2` is 1; why `0.1 + 0.2` is not 0.3.
- **Finer points:** sizes are decided by the machine, with GATE's assumption stated every time; `char` may be signed or unsigned (implementation-defined); integer promotion of `char` and `short`; negative `%` follows the dividend (`-7 % 2` is -1, `7 % -2` is 1; C99); `float f = 0.7; f < 0.7` is true (a `float` is rounder than a `double`); `float` → `int` truncates; `char c = -1; printf("%x %u", c, c)` shows sign extension; octal trap `010` is 8; `unsigned` loop counters never go below 0.
- **GATE level:** `sizeof` of expressions; signed/unsigned comparison (`-1 < 1u` is false); overflow output; casts in expressions; endian-dependent output; sign-extension prints.
- **Diagrams:** variable boxes of different sizes at addresses; little vs big endian byte placement; two's complement built step by step (flip, add 1, 5 + (-5) = 0); **unsigned** number clock (255 → 0) beside a "signed overflow = undefined" warning sign (never a signed wrap circle); the conversion rules as a short **decision flow** (integer promotion first, then the usual arithmetic conversions) rather than one fixed ladder; sign-extension frames; the 4-box `0 '0' '\0' "0"` picture.
- **Traces:** `unsigned char c = 250; c = c + 10;` in bits; `-1 < 1u` in bits; `(float)7/2` vs `7/2`; `sizeof(i++)`.

## C3 · Operators and expressions  [MUST]

- **Lessons:** (1) Arithmetic, relational, logical, short-circuit; **lvalue and rvalue** in plain words (a real box you can write to vs a temporary number). (2) Bitwise `& | ^ ~ << >>` with the full set of bit tricks. (3) Assignment, `++` and `--` (prefix, postfix), `?:`, comma, casts and `sizeof` as operators. (4) **Precedence and associativity** (the table) and why **precedence is not order of evaluation**. (5) Sequence points, side effects, and **undefined behaviour** with `i = i++ + ++i`.
- **Beginner must see:** an expression becomes one value; `=` is not `==`; why `a < b < c` does not mean what it means in maths (`5 > 3 > 1` is 0).
- **Finer points:** `&&` and `||` skip the right side when the left decides, so its side effects never happen; relational results are `int` 0 or 1; `~0` is -1; **`1 << 32` is undefined**, shift by a negative count is undefined; `>>` of a negative number is implementation-defined (arithmetic vs logical shift); bit tricks: test, set, clear, toggle, `n & (n-1)`, `n & -n`, power-of-two test, XOR swap (and why it fails when both names are the same box); `a++` gives the old value, `++a` the new; `x = y = 5` goes right to left; the comma operator vs the comma between function arguments; the exact list of sequence points; precedence traps `*p++`, `a & b == c`, `!x == y`.
- **GATE level:** nested `++`/`--` output; "which of these are undefined"; bit-manipulation output; short-circuit hiding a side effect; precedence of pointer operators.
- **Diagrams:** expression trees for `a + b * c`, `a = b = 5`, `5 > 3 > 1`; **precedence builds the tree but not the timeline**: `f() + g() * h()` with two valid run orders; two compiler orderings for `i++ + ++i` (so no single trace exists); short-circuit as two switches in series and in parallel; bit rows for each operator, and logical vs arithmetic right shift; `n & (n-1)` for 40 as a trace table.
- **Traces:** `n & (n-1)` counting bits of 40; a short-circuit example with a printing side effect; prefix vs postfix table (initial i, value of expression, final i).

## C4 · Decisions  [MUST]

- **Lessons:** (1) `if`, `else if`, `else`, nested `if`, the dangling `else`, what counts as true. (2) `switch`: cases, `default`, fall-through, `break`, **`continue` inside a `switch` inside a loop**; `enum` met here only as "named constants" (full lesson in C14).
- **Beginner must see:** a decision as a fork in the road with a picture.
- **Finer points:** `else` pairs with the nearest `if`; `if (x = 5)` assigns; `;` right after `if (...)` ends it; `switch` takes integer values only (no `float`, no strings), case labels must be constant and unique; `default` may sit anywhere; statements before the first `case` never run; `5 > 3 > 1` again.
- **GATE level:** fall-through output; dangling-else output; `switch` with `default` in the middle; `break` vs `continue` inside a loop with a switch.
- **Diagrams:** if / else-if flowchart; switch with a trapdoor arrow for fall-through; brace-matching picture for dangling else; loop + switch showing where `break` and `continue` land.
- **Traces:** a `switch` without `break` for each input.

## C5 · Loops  [MUST]

- **Lessons:** (1) `while`, `do-while`, `for`, `break`, `continue` (and where `continue` lands), `goto` as a note. (2) Nested loops and printing patterns. (3) **Counting how many times a loop runs**: `n`, `n/2`, `i *= 2` (log n), `i = i*i` (log log n), triangular `n(n-1)/2`, Euclid's `while (a != b)`. (4) Loop traps: trailing `;` after `for(...)`, off-by-one, unsigned counter that never ends, float counters, a variable declared inside `for` (lives only inside the loop; C99 and later).
- **Beginner must see:** a loop as "do this again while the door is open"; every loop has a start, a test, a change.
- **Finer points:** `do-while` runs at least once; `for(;;)`; in a `for`, `continue` jumps to the increment first, in a `while` straight to the test (infinite-loop trap); the loop variable after the loop; multiple variables with `,`.
- **GATE level:** how many times a statement runs (leads to time complexity); output of nested loops with `break` and `continue`; recognising an infinite loop; the value after the loop.
- **Diagrams:** flowcharts for the three loops with the `continue` wire; the `(i, j)` grid (square, triangle); doubling ladder; trace tables (step, i, j, condition, output); unsigned `i >= 0` wrapping to 255.
- **Traces:** triangle pattern; loop with `continue`; `for (i = 1; i < n; i *= 2)` for n = 100.

## C6 · Functions and the call stack  [MUST]

- **Lessons:** (1) Why functions; prototype, definition, call; parameters and return; `void`. (2) **Call by value** and the **stack frame**: what is created when a function is called and what disappears when it returns ("a function's scratch boxes vanish on return"). (3) Functions calling functions; **nested `printf` return-value puzzles** (`printf("%d", printf("ab"))`) and the order in which arguments are worked out. (4) Library functions overview.
- **Beginner must see:** a function as a small machine with its own room; the caller's variables are *copied* into the room.
- **Finer points:** no function inside a function in standard C; missing `return` in a non-`void` function; calling an undeclared function (old implicit `int`, removed in C99); order of evaluation of arguments is unspecified; a function cannot change the caller's variable by value; each call has its own copies of locals; `main` returns `int`.
- **GATE level:** output of nested calls with side effects in the arguments; return-value traps; number of boxes alive at one time.
- **Diagrams:** stack frames pushing and popping for a call (series); the `swap(a, b)` that does not swap (series); timeline of call and return; two functions each with their own `x`.
- **Traces:** `f(g(2), g(3))` with a printing `g` (both orders shown); three nested calls with the stack redrawn at each step.

## C7 · Scope, lifetime and storage classes  [MUST]

- **Lessons:** (1) Block, function and file **scope**; shadowing; **lifetime** (when a variable is born and dies). (2) `auto`, `static` (local and global), `extern`, `register`; **declaration vs definition**; tentative definitions (`int g; int g;`); default initial values. (3) **The memory map of a running program:** `.text`, `.data`, `.bss`, heap, stack; where each variable lives. (4) `const`, and `volatile` explained with a hardware-button picture.
- **Beginner must see:** scope is about *where you can use a name*; lifetime is about *how long the box exists*; they are different.
- **Finer points:** a `static` local is set up once and keeps its value; **`static int y = x;` with a local `x` is a compile error** (the starting value must be a constant); locals start as garbage, globals and statics start at 0; `static` has two meanings (keeps value / file-private); `extern` declares and does not create; `register` takes no `&`; the same name in three scopes.
- **GATE level:** repeated calls to a function with a `static` counter; shadowing output; which variables live where; initial-value questions; scope puzzles.
- **Diagrams:** the tall memory map with sample variables in each zone; nested yards for scope and shadowing; lifetime timeline (auto vs static vs global over three calls); `static` counter trace (call 1, 2, 3, 4).
- **Traces:** a function called four times with `static` and `auto` side by side; one name in three scopes.

## C8 · Recursion  [MUST] *(new chapter inside the C book)*

- **Lessons:** (1) A function that calls itself: base case and recursive case; the stack grows and shrinks (every frame drawn); factorial, power, sum of digits. (2) The **recursion tree**, counting calls, maximum stack depth; Fibonacci; `printf` **before, between and after** the recursive call (down-going vs coming-back output). (3) Recursion with **`static` and global variables** (all calls share one box, each call has its own `n`); tail, direct, indirect and mutual recursion (`even`/`odd`); nested recursion `f(f(n))`. (4) Recursion with pointer parameters (preview, full in C11); turning a recursive function into the maths function it computes; recursion vs loops; stack overflow.
- **Beginner must see:** every call is a new room with its own copies; the answer comes back up the stairs.
- **Finer points:** missing base case; the two printing positions; the number of calls for Fibonacci; stack depth `n` vs `log n`; the recurrence for time (link to Algorithms).
- **GATE level:** "what does f(n) return", "how many times is f called" (NAT), "what does f compute"; static-with-recursion output.
- **Diagrams:** stack-frame series for `fact(3)`; call tree for `fib(5)` with returned values; `f(3)` with green down-arrows (prints before) and blue up-arrows (prints after); stack frames all pointing to **one** shared `static` box; Hanoi frames for 3 discs.
- **Traces:** `fact(4)`; `fib(5)` call counts; a function that prints before and after; recursion with `static int c`.

## C9 · Arrays  [MUST]

- **Lessons:** (1) A row of boxes: declaring, initialising (partial, `{0}`, size deduced), indexing from 0, the address of an element (base + i × size), no bounds checking (**`a[-1]` and `a[n]` are undefined**). (2) Two-dimensional arrays: row-major layout drawn as a grid *and* as one long street; `int a[][3]` is valid, `int a[2][]` is not. (3) **Address formulas:** row-major and column-major, 2-D and 3-D, with **non-zero lower bounds** (`A[lb1..ub1][lb2..ub2]`). (4) Common programs: sum, max, reverse, search, bubble-sort pass. (Passing arrays to functions and `sizeof` of a parameter come in C11, after pointers.)
- **Beginner must see:** an array is boxes in a row, side by side; memory is one long street, never a grid.
- **Finer points:** an array name cannot be assigned; arrays are not copied by `=`; uninitialised elements; a 2-D array is an array of arrays; a variable-length array is a C99 note only; stepping off the end can overwrite a neighbouring variable.
- **GATE level:** address calculation (very common, many forms); output with out-of-bounds access (undefined); `sizeof(a)/sizeof(a[0])` in the same function; 2-D indexing puzzles.
- **Diagrams:** 1-D array with indices above and addresses below, then `a[5]` running into a neighbour; 2-D grid flattening into a street (row-major) beside column-major; 3-D as stacked grids; bubble-sort pass frames.
- **Traces:** `&a[2][3]` for three shapes and both orders; fill-and-print loop; one bubble pass.

## C10 · Pointers I: memory and addresses  [MUST] *(the biggest fear; most time here; the pilot lesson)*

- **Lessons:** (1) Every variable has a name *and* an address; `&`; a pointer is another box that holds an address; declaring (`int *p`); `*` (follow the arrow); read and write through a pointer. (2) `NULL`, **wild** and **dangling** pointers compared in one picture; pointer size (4 or 8 whatever it points to); `%p`. (3) Aliasing (two pointers, one box); `*&x`, `&*p`, `**pp` previews. (4) Swapping with pointers: why `swap(&a, &b)` works when `swap(a, b)` did not.
- **Beginner must see:** the *name* view and the *address* view of the same box; `*` and `&` are opposites; an arrow is how we draw "points to".
- **Finer points:** `*` means two things (declare vs follow); `int *p, q;` makes only `p` a pointer; the pointer type says how many bytes to read and how; dereferencing `NULL` is undefined; changing the pointer vs changing the box it points to; why `printf` needs the value and `scanf` the address (closing the C1 loop).
- **GATE level:** several pointers to one variable, "what is printed"; chains of `*` and `&`; values after assignments through pointers.
- **Diagrams:** memory with name view and address view; frames for `p = &x; *p = 25; q = p; *q = 99;`; NULL (grounded) vs wild (random house) vs dangling (demolished house); swap frames showing arrows reaching back into the caller.
- **Traces:** five-line pointer programs, memory redrawn after every line.

## C11 · Pointers II: arithmetic, and arrays with pointers  [MUST]

- **Lessons:** (1) Pointer plus integer (scaled steps), pointer minus pointer (a count, valid only inside one array), comparisons, **one past the end**; why `p + q` is forbidden. (2) Array name as the address of the first element; `a[i]` is `*(a+i)` (and `i[a]`); **array decay**, its exceptions (`sizeof`, `&`); passing an array to a function and why `sizeof` of the parameter changes; `a + 1` vs `&a + 1`. (3) The 2-D family: `a`, `*a`, `a[i]`, `*(a+i)+j`, `&a`, `**a`; pointer to array vs array of pointers; **`int a[3][4]` cannot be passed as `int **`**; `void *` (cannot be followed or stepped in standard C). (4) The four increments `*p++`, `(*p)++`, `*++p`, `++*p`.
- **Beginner must see:** adding 1 to a pointer adds the size of what it points to, not 1 byte.
- **Finer points:** `ptrdiff_t`; `char *` moves by 1; same address, different type (`a`, `&a[0]`, `&a`); valid `p[-1]` inside an array vs invalid `a[-1]` at its start; arrays cannot be assigned but pointers can.
- **GATE level:** the full 2-D family with addresses; `*p++` puzzles; loops walking with pointers; the array-vs-pointer `sizeof` question.
- **Diagrams:** two streets, `char *` (+1) and `int *` (+4); `p`, `p+1`, `p+2` over an array; array decay in a call; `a + 1` vs `&a + 1` jumping 16 vs 48 bytes; the 2-D ladder; `int (*p)[4]` vs `int **p`; the increment maze as a trace table plus frames.
- **Traces:** each of the four increments on a 5-element array; the 2-D family for `int a[3][4]` at 1000.

## C12 · Strings  [MUST]

- **Lessons:** (1) A string is a `char` array ending in `'\0'`; literals; **`char s[]` (a writable copy) vs `char *p` (a pointer into read-only memory)**; `sizeof` vs `strlen`. (2) Reading and writing strings: `%s`, `%c`, `fgets`, and **`gets` (removed in C11, never use)**; `string.h`: `strlen`, `strcpy`, `strncpy`, `strcat`, `strcmp`, `strchr`, `strstr`, and `memcpy` vs `memmove`. (3) Writing them yourself with pointers; **`while (*d++ = *s++);`** traced. (4) Arrays of strings (`char a[3][10]` vs `char *a[3]`); string pointer tricks (`"GATE" + 2`, `1["GATE"]`, `p + p[3] - p[1]`); `ctype.h`; `atoi`, `sprintf`.
- **Beginner must see:** how the `'\0'` is the only thing that marks the end.
- **Finer points:** missing terminator; copying into too small a box; `strcmp` returns a negative, zero or positive number (not necessarily -1 / 0 / 1); `strncpy` may not add `'\0'`; `==` compares addresses; changing a literal is undefined; `scanf("%s")` stops at a space; the empty string.
- **GATE level:** pointer-walking string loops; `strlen`/`sizeof` combos; string offset tricks; swapping strings in the two array forms.
- **Diagrams:** char cells with `'\0'`; `char s[]` on the stack vs `p` pointing into locked read-only memory; rectangular grid vs three arrows to strings of different lengths; the `strcpy` loop frames; a ruler for `"GATE"` and `+2`.
- **Traces:** `strlen` two ways; reverse in place; `while (*d++ = *s++)` for "hi".

## C13 · Pointers III: advanced  [SHOULD]

- **Lessons:** (1) Pointer to pointer; passing `&p` so a function can move the caller's pointer. (2) Function pointers: declare, assign, call, arrays of them, callbacks. (3) **Reading declarations** (right-left / spiral rule) and `typedef` to clean them up; `const` with pointers (the four forms). (4) Pointers returned from functions (safe: passed-in, `static`, global, literal, heap; unsafe: a local), dangling from a returned local; `argc` and `argv`.
- **Beginner must see:** one more arrow to follow, drawn the same way as before.
- **Finer points:** `int *f()` vs `int (*f)()`; `int *a[5]` vs `int (*a)[5]`; `const int *p` = `int const *p`; the const grid; aliasing.
- **GATE level:** decode a declaration; a function-pointer call chain; which `const` form allows which assignment.
- **Diagrams:** three-level arrows `pp → p → x`; function pointer into the code area; declaration decoder with numbered spiral; the 2×2 const grid.
- **Traces:** five declarations read aloud step by step.

## C14 · Structures, unions, enums, bit-fields, typedef  [MUST]

- **Lessons:** (1) `struct`: declare, define, access (`.`), nested, arrays of structs, pointer to struct and `->`, assignment (`=` works, `==` does not), structs and functions. (2) **Layout, alignment and padding** and `sizeof(struct)`, with the **correct rule**: each member starts at a multiple of *its own alignment* (a `char` array aligns like a `char`; a nested struct aligns like its largest member), and the whole struct is padded to a multiple of its largest alignment; reordering changes the size; padding is implementation-defined, with GATE's usual assumption stated. (3) `union`, `enum`, bit-fields (no `&`, no `sizeof` on a bit-field), reading a union through another member (endianness). (4) `typedef` (and the **`typedef int *IP` vs `#define IP int *`** trap); self-referential structs (the start of linked lists).
- **Beginner must see:** a struct as a form with several labelled fields in one block of memory.
- **Finer points:** union size is the largest member rounded up to its alignment; a struct copy copies arrays inside it; `(*p).x` is `p->x`; enum values start at 0 and continue.
- **GATE level:** `sizeof` with padding (very common, with arrays and nested structs); union read-back values; `p->next->next` chains.
- **Diagrams:** byte ruler with grey padding; the same struct reordered; one struct with `char arr[5]`; struct (separate rooms) vs union (one room, many labels); `[data | next]` node; the `IP a, b;` picture.
- **Traces:** `sizeof` for four member orders; a union write then read.

## C15 · Dynamic memory: the heap  [MUST]

- **Lessons:** (1) Why we need memory at run time; stack vs heap vs data; `malloc`, `calloc`, `free`; always check for `NULL`. (2) `realloc` and its **leak trap** (`p = realloc(p, n)` loses the block if it fails; use a temporary); how `free` knows the size (the hidden header); `malloc(0)`, `free(NULL)`. (3) Leaks, **dangling pointers**, double free, use after free. (4) 1-D and 2-D dynamic arrays (`int **p` rows vs one block `int (*p)[C]`); heap nodes (preview of linked lists).
- **Beginner must see:** the heap as a big shared yard where you rent a plot and must return it.
- **Finer points:** `malloc` does not clear, `calloc` does; casting `malloc` (needed in C++, not in C); `realloc` may move the block; `sizeof(p)` is the pointer's size, not the block's; freeing the middle of a block is wrong; heap lives until freed, stack until return.
- **GATE level:** leak counting; spotting the dangling or double free; the size to ask `malloc` for; behaviour after `free`.
- **Diagrams:** full process map; `malloc` / `realloc` / `free` frames with the hidden header; leak vs dangling pictures; rows-of-pointers vs one block.
- **Traces:** a leaking program, fixed; a use-after-free.

## C16 · Preprocessor and macros  [MUST]

- **Lessons:** (1) What the preprocessor is (text, before compiling): `#include <>` vs `""`, `#define` constants. (2) Function-like macros; **outer and inner brackets**; side-effect traps (`SQ(i++)`); multi-statement macros and **`do { } while (0)`**; `#` and `##`. (3) `#if`, `#ifdef`, header guards; macros vs functions vs `inline`; macros ignore C scope and cannot recurse.
- **Beginner must see:** the preprocessor knows no C maths; it only copies and pastes text.
- **Finer points:** no `;` at the end of a `#define`; arguments are pasted as text each time they appear.
- **GATE level:** expand a macro by hand and compute (frequent).
- **Diagrams:** before / after text frames; `2 + 3 * 2 + 3` (= 11) not 25; the `CUBE(i++)` picture; macro vs function table.
- **Traces:** `SQ(2+3)` and the fixed version; `2 * ADD(3, 4)`.

## C17 · Parameter passing and scope rules (the GATE view)  [SHOULD]

- **Lessons:** (1) What C really does (call by value) and call by reference with pointers; aliasing (`swap(x, x)`, `swap(i, a[i])`). (2) **Value-result, call by name** (Jensen's device) as taught for GATE, and **static vs dynamic scoping**, each with the *same* six-line program traced under every mode.
- **Beginner must see:** the same program gives different answers under different rules, and that is the question.
- **Finer points:** where reference and value-result differ; dynamic scoping depends on who called whom; C itself has neither call by name nor dynamic scope (they are for GATE's theory questions).
- **GATE level:** "what is printed under call by reference / value-result / name"; scope-rule output.
- **Diagrams:** four columns, one program; the static scope lookup (written boxes) vs dynamic (active frames).
- **Traces:** one aliasing program, five times.

## C18 · Files, errors, variable arguments  [LATER]

- **Lessons:** `FILE *`, `fopen`, `fclose`, `fprintf`, `fscanf`, `fgetc`, `fgets`; `EOF`; `errno`, `exit`, `abort`; variable arguments ([BEYOND]).
- **Beginner must see:** a file as a long tape with a reading cursor.
- **Finer points:** the **`int c` vs `char c`** bug with `getchar`; `feof` extra-pass bug.
- **GATE level:** rarely asked; EOF and return-value questions only.
- **Diagrams:** a file with a moving cursor; `255` vs `-1` squeezed into one byte.
- **Traces:** a read loop to EOF.

## C19 · Reading mystery functions  [MUST] *(new)*

- **Lessons:** (1) How to find out what an unfamiliar function computes: run it on 3 small inputs, find the pattern, then check the loop's logic. (2) The patterns GATE reuses: GCD (subtraction and `%`), digit extraction (`n % 10`, `n / 10`), base conversion, reverse digits, fast exponentiation, primality (`i * i <= n`), divisors, perfect numbers, bit count / parity / power of two, Horner's rule, integer square root, max / second max.
- **Beginner must see:** a short function is a recipe; try it with small numbers.
- **Finer points:** when does the loop end; what happens for 0, 1 and negative inputs.
- **GATE level:** "for all positive n what does foo(n) compute", "for which inputs does it end".
- **Diagrams:** trace tables for each pattern on small inputs; the input → output pattern table.
- **Traces:** each pattern on 3 inputs.

## C20 · Output-prediction method and undefined behaviour  [MUST]

- **Lessons:** (1) The **7-step method**: list the variables; draw memory; apply precedence; run line by line; watch side effects; check types; check undefined behaviour. (2) **Undefined vs unspecified vs implementation-defined**, in one 3-way table with examples (`*NULL` and `i++ + ++i` are undefined; `f() + g()` order is unspecified; `sizeof(int)` and signed `>>` are implementation-defined). (3) The 20 most repeated trick patterns.
- **Beginner must see:** one habit that works on every question.
- **Finer points:** "anything can happen" really means anything, not only a crash.
- **GATE level:** MSQ "which are undefined"; machine-assumption questions.
- **Diagrams:** the three-colour trap map; one reusable worksheet (memory boxes, trace table, check list, output box).
- **Traces:** three full worksheets on mixed questions.

## C21 · Previous-year patterns and mixed practice  [MUST]

- **Lessons:** (1) Pattern library: each pattern with one model solved question from our PYQ bank (tagged by chapter). (2) Full mixed sets in **MCQ, MSQ and NAT** formats. (3) Time per question; what to skip.
- **Source:** our own PYQ bank, tagged; no external links needed inside the book.
- **Diagrams:** a pattern map from question type to chapter.

---

## 3. Practice

Each **lesson** ends with a ladder: **Warm-up 5, Core 6, GATE-level 6, Twisted 3 = 20**, every one with a worked solution, and a mix of MCQ, MSQ and NAT. About 75 lessons ≈ **1,500 problems**, of which the GATE-level ones are drawn first from the tagged PYQ bank. A mistake box after each set ("the three errors this set catches").

## 4. Tools to build alongside

Memory visualiser (the most valuable: type a few lines, step through, watch boxes, addresses and arrows) · stack-frame stepper (with `static` and the data area) · pointer-arithmetic playground · struct-padding calculator · macro expander · expression-tree explorer · binary and two's-complement explorer · loop-iteration counter · endian viewer.

## 5. How the book verifies itself

Every program is compiled with `gcc -std=c11 -Wall` and its output pasted from the real run (32-bit view stated). Undefined-behaviour examples are marked and never given a single "answer". Every diagram has a caption saying what to look at.

## 6. Open points for your decision

1. Recursion fully in C8 (chosen). The DS book keeps only the data-structure uses.
2. 20 problems per lesson (about 1,500 for C). Cut or raise?
3. Do you want the 100-day [MUST] path printed at the front of the book with day numbers?
4. The setup help in C1 (compiler install): should it also have a screenshot walkthrough for Windows?
