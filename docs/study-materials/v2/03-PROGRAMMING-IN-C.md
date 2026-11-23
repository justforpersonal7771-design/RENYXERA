# 03 · Subject plan: Programming in C (plan v1, for review)

**Reader:** a dropper with almost zero programming knowledge. **Goal:** after this book the reader can read any C program of GATE size and say what it prints, why, and what can go wrong; and can write the small programs GATE needs.

## 0. How big is this subject, really?

The GATE syllabus names it in three words: *"Programming in C"* (inside the paper's "Programming and Data Structures"). But to answer the questions GATE asks, a student needs **about 18 chapters** of C, because GATE questions are *output prediction*, *memory layout*, *undefined behaviour*, *pointer puzzles*, *recursion traces* and *size calculations*. Every one of these needs several underlying ideas to be solid first.

| What GATE does with C | What the student must therefore know |
|---|---|
| "What is the output?" | Reading code line by line, `printf` formats, operator precedence, side effects, loops, pointers |
| "What is the value of x after ...?" | Evaluation order, `++`/`--`, type conversion, integer overflow, short-circuit |
| "What is `sizeof`?" | Sizes of types, struct padding, arrays, pointers, unions |
| "Which statement is true?" | Storage classes, scope, `const`, strings vs arrays, `malloc` rules |
| "Find the error / which line crashes?" | Dangling pointers, out-of-bounds, string literals, uninitialised data, undefined behaviour |
| "Recursion: what does f(5) return?" | Stack frames, call trees, base cases |
| "Macro expansion output" | Preprocessor text substitution, brackets, side effects |
| "Parameter passing: what is printed?" | Call by value, by reference (pointers), by name/copy-restore as taught in GATE |

> **To verify from our own question bank before writing:** the exact number of C questions per year, the share of 1-mark and 2-mark, and the list of every C topic already asked. The numbers above are the *kinds*, not statistics.

## 1. The ladder of chapters (order matters: each one only uses what came before)

```
Part A  Foundations          C0  How a computer runs a program
                             C1  The first program: main, printf, scanf, compile
                             C2  Variables and data types
                             C3  Operators and expressions
Part B  Control              C4  Decisions: if, else, switch
                             C5  Loops, break, continue, goto
Part C  Functions            C6  Functions and the call stack
                             C7  Scope, lifetime and storage classes
Part D  Memory and pointers  C8  Arrays
                             C9  Pointers I: memory and addresses
                             C10 Pointers II: arithmetic, arrays and pointers
                             C11 Strings
                             C12 Pointers III: advanced (pointer to pointer, function pointers, declarations)
Part E  Structures           C13 struct, union, enum, bit-fields, typedef
                             C14 Dynamic memory: the heap
Part F  The rest of the language
                             C15 Preprocessor and macros
                             C16 Parameter passing and scope rules (the GATE view)
                             C17 Files and error handling (light)
Part G  GATE skills          C18 Output-prediction method and undefined behaviour
                             C19 Previous-year patterns and mixed practice
```

Recursion and the data structures that use C (linked lists, stacks, trees) belong to the **Data Structures** plan; C14 and C12 prepare the ground for them.

## 2. How each chapter is written

Every chapter is made of **topics**; every topic follows the 12-station ladder from the master prompt (why, words, see it, build it, do it by hand, exact rules, finer points, how GATE asks, mistakes, tricks, practice, recap). Below, for each chapter: **Topics → Beginner must see → Finer points → GATE level → Diagrams → Traces to do by hand.**

---

## C0 · How a computer runs a program  *(prerequisite for everything; a beginner is lost without it)*

- **Topics:** C0.1 what a program is; C0.2 memory as a long street of numbered boxes; C0.3 bits and bytes; C0.4 numbers in binary, octal and hex (just enough); C0.5 compiler, linker, loader; C0.6 what is "running".
- **Beginner must see:** a program is a list of instructions; the computer only knows numbers; memory is boxes each with an *address*; a *byte* is one box; a variable is a named box.
- **Finer points:** how many values a byte can hold (256); why 1 KB is 1024; positive numbers in binary; hex as a short way of writing binary; what "compile" and "run" mean as two separate moments; source file → object file → executable.
- **GATE level:** converting between binary, octal and hex quickly; knowing that sizes are fixed by the machine, not by C.
- **Diagrams:** MEMORY (a street of 16 boxes with addresses 1000 to 1015); byte with its 8 bits; compile-link-run pipeline as FLOW; binary place-value table.
- **Traces:** converting 45 to binary and 0x2F to decimal by hand.

## C1 · The first program

- **Topics:** C1.1 `main`; C1.2 `#include <stdio.h>`; C1.3 `printf` and the text it prints; C1.4 `scanf` and reading; C1.5 comments, tokens, keywords, identifiers; C1.6 compile, run and read errors (syntax vs run-time vs logic); C1.7 the structure of a C program.
- **Beginner must see:** the smallest program; what each line means; what `;` and `{ }` are; compile errors in plain words.
- **Finer points:** `main` returns `int`; return values and `exit`; case sensitivity; whitespace is free; string literals and escape sequences (`\n`, `\t`, `\\`, `\"`); `printf` returns the number of characters printed; `scanf` returns the number of items read; `&` in `scanf` (forward reference to C9).
- **GATE level:** `printf` return-value puzzles (`printf("%d", printf("ab"))`); `scanf` return value; unusual spacing.
- **Diagrams:** a program with arrows labelling every part; FLOW of compile-and-run; screen-and-keyboard picture for `printf` and `scanf`.
- **Traces:** a three-line program line by line; a nested `printf` evaluated from the inside out.

## C2 · Variables and data types

- **Topics:** C2.1 what a variable is (a labelled box); C2.2 declaration, initialisation, assignment; C2.3 `int`, `short`, `long`, `long long`; C2.4 `signed` and `unsigned`; C2.5 two's complement picture; C2.6 `char` and ASCII; C2.7 `float` and `double` (what the number looks like inside, precision); C2.8 constants and literals (decimal, octal `012`, hex `0x1F`, `L`, `U`, `f` suffixes, char constants); C2.9 `const` and `#define` for constants; C2.10 `sizeof`; C2.11 type conversion: implicit promotion, usual arithmetic conversions, casting; C2.12 overflow and wrap-around; C2.13 `enum` basics.
- **Beginner must see:** each variable is a box of a fixed size; the type decides the size and meaning; what a number looks like when stored; why `3/2` is `1`.
- **Finer points:** sizes are implementation-defined (GATE assumption: 32-bit `int` = 4 B, `char` = 1 B, `short` = 2 B, `long` = 4 or 8 B as stated, `float` 4 B, `double` 8 B); ranges `-2^(n-1)..2^(n-1)-1` and `0..2^n-1`; `char` signedness is implementation-defined; what happens on signed overflow (undefined) vs unsigned overflow (wraps); integer promotion of `char` and `short` to `int`; converting a negative `int` to `unsigned`; comparison of signed and unsigned (`-1 < 1u` is false); `float` to `int` truncates; precision loss (`0.1 + 0.2 != 0.3`); integer division and modulus with negatives (`-7 / 2`, `-7 % 2`); character arithmetic (`'a' + 1`).
- **GATE level:** `sizeof` of expressions; the signed/unsigned comparison trap; overflow output; casts in expressions; octal literals (`010` is 8).
- **Diagrams:** MEMORY (an `int` as 4 boxes, a `char` as 1, with the bits shown); number circle for signed 8-bit wrap-around (127 → -128); two's-complement table; type-promotion ladder (char → int → unsigned → long → float → double); FLOW for "which type does `a + b` have?".
- **Traces:** `unsigned char c = 250; c = c + 10;` step by step in bits; `-1 < 1u` in bits; `(float)7 / 2` vs `7 / 2`.

## C3 · Operators and expressions

- **Topics:** C3.1 arithmetic; C3.2 relational; C3.3 logical and short-circuit evaluation; C3.4 bitwise (`& | ^ ~ << >>`); C3.5 assignment and compound assignment; C3.6 increment and decrement, prefix and postfix; C3.7 conditional `?:`; C3.8 comma operator; C3.9 `sizeof` and casts as operators; C3.10 precedence and associativity (the full table); C3.11 order of evaluation, sequence points, undefined behaviour (`i = i++ + ++i`, `a[i] = i++`).
- **Beginner must see:** an expression becomes one value; the order is decided by precedence; `=` is not `==`.
- **Finer points:** `&&` and `||` stop early (the right side may never run); `!` gives 0 or 1; results of relational operators are `int` 0/1; `>>` on negative numbers is implementation-defined, `<<` overflow; bit tricks: test, set, clear, toggle a bit, count set bits (`n & (n-1)`), power-of-two test, swap with XOR, isolate lowest set bit (`n & -n`); `a++` returns the old value, `++a` the new one; `x = y = 5` associates right to left; `?:` associativity; comma returns the right value; precedence traps (`*p++`, `a & b == c`, `!x == y`).
- **GATE level:** evaluate nested `++`/`--` expressions; the "which are undefined" question; bit-manipulation outputs; short-circuit hiding a side effect; precedence of pointer operators.
- **Diagrams:** TREE (expression tree: how the compiler sees `a + b * c`, drawn for several expressions); precedence ladder; truth tables; BIT rows for `& | ^ << >>` with arrows; TRACE for prefix/postfix.
- **Traces:** `i = 5; j = i++ + ++i;` (and why it is not safe); a short-circuit example with a printing side effect; `n & (n-1)` counting bits for 40.

## C4 · Decisions

- **Topics:** C4.1 `if`, `else`, `else if`; C4.2 nested `if` and the dangling `else`; C4.3 `switch`: cases, `default`, fall-through, `break`; C4.4 what counts as true/false (0 vs non-zero); C4.5 common errors (`if (x = 5)`, missing braces, `;` after `if`).
- **Finer points:** `switch` works on integer-type values only; case labels must be constants and unique; `default` may be anywhere; fall-through through missing `break`; `else` pairs with the nearest `if`; empty statement.
- **GATE level:** fall-through output; dangling-else output; `switch` with `default` in the middle; `if` with assignment.
- **Diagrams:** FLOW for if/else-if chain; FLOW for `switch` with fall-through arrows; BRACE-matching picture for dangling else.
- **Traces:** a `switch` without `break` for each input value.

## C5 · Loops

- **Topics:** C5.1 `while`; C5.2 `do-while`; C5.3 `for` (the three parts, any can be empty); C5.4 `break`, `continue`; C5.5 `goto` and labels; C5.6 nested loops and printing patterns; C5.7 infinite loops and loops that never run; C5.8 loop-and-counter arithmetic (how many times does it run?); C5.9 loops with multiple variables and `,`; C5.10 loops and floating-point/unsigned traps.
- **Finer points:** loop variable after the loop; scope of a variable declared in `for`; `continue` in `for` jumps to the increment; `do-while` runs at least once; `for(;;)`; counting iterations of `for (i = 1; i < n; i *= 2)` (log) and `i += i` patterns; off-by-one; unsigned loop counters that never go negative.
- **GATE level:** number of times a statement executes (leads to time complexity); output of nested loops with `break` and `continue`; "what is printed after the loop"; infinite loop recognition.
- **Diagrams:** FLOW for each loop type; TRACE tables (iteration, i, j, output); grids for nested loops (the 2-D picture of which (i, j) pairs run); doubling-sequence diagram.
- **Traces:** triangle patterns; a loop with `continue`; a `for` with `i *= 2` for n = 100.

## C6 · Functions and the call stack

- **Topics:** C6.1 why functions; C6.2 declaration (prototype), definition, call; C6.3 parameters and return; C6.4 call by value in detail; C6.5 what happens in memory on a call: the **stack frame**; C6.6 returning values, `void`; C6.7 functions calling functions; C6.8 recursion as a function calling itself (the full chapter is in Data Structures/Algorithms plans, here only the mechanism); C6.9 `main` with `argc` and `argv`; C6.10 variable arguments (how `printf` works); C6.11 library functions overview.
- **Finer points:** default `int` and implicit declarations (old C); order of evaluation of function arguments (unspecified); a function cannot change the caller's variable by value; stack grows and shrinks; local variables vanish on return; returning the address of a local variable is wrong; `return` without a value; `static` function.
- **GATE level:** output of nested calls with side effects in arguments; recursion depth and stack use; return-value traps.
- **Diagrams:** STACKFRAME series (one frame per call: return address, parameters, locals, with push/pop FRAMES); a call/return timeline; MEMORY showing two functions with the same variable name in different frames.
- **Traces:** `f(g(2), g(3))` with printing `g`; three nested calls with the stack drawn at every step.

## C7 · Scope, lifetime and storage classes

- **Topics:** C7.1 block, function, file scope; C7.2 shadowing; C7.3 lifetime (when a variable is born and dies); C7.4 `auto`; C7.5 `static` (local: keeps its value; global: file-private); C7.6 `extern`; C7.7 `register`; C7.8 where each lives: stack, data segment, heap; C7.9 default initial values; C7.10 `const` and `volatile`.
- **Finer points:** static locals initialised once, before the program starts, to 0 by default; locals are *not* initialised (garbage); a global and a local with the same name; `static` has two meanings; `extern` declares, does not define; `register` cannot take `&`; `const int *p` vs `int * const p` (forward reference to C12).
- **GATE level:** repeated calls to a function with a `static` counter; shadowing output; "which variables are on the stack?"; initial-value questions.
- **Diagrams:** MEMORY map of a process: code, data (initialised, uninitialised), heap, stack, with each variable placed; scope-nesting picture (boxes inside boxes); lifetime TIMELINE.
- **Traces:** a function called 4 times with a `static` local; a program with the same name in three scopes.

## C8 · Arrays

- **Topics:** C8.1 what an array is (a row of boxes); C8.2 declaration and initialisation (partial, `{0}`, size deduction); C8.3 indexing and zero-based counting; C8.4 how an element's address is computed; C8.5 out-of-bounds (no check); C8.6 two-dimensional arrays: row-major layout; C8.7 address formulas for 2-D and 3-D arrays; C8.8 passing arrays to functions (what is really passed); C8.9 arrays of characters (forward to C11); C8.10 variable-length arrays (note); C8.11 common programs: sum, max, reverse, search, bubble pass; C8.12 array and loop complexity counts.
- **Finer points:** array name is not a variable you can assign; `sizeof` of an array vs of a parameter; size must be a positive constant (VLA aside); uninitialised elements; `a[-1]`; `a[i]` and `i[a]`; a 2-D array is an array of arrays; row-major vs column-major (and the formula for each); address of `a[i][j]` = base + (i × columns + j) × size; arrays are not copied by `=`; initialising with fewer values.
- **GATE level:** address calculation questions (very common); output with out-of-bound access (UB); `sizeof(a)/sizeof(a[0])`; 2-D indexing puzzles; memory for triangular storage (links to Data Structures).
- **Diagrams:** ARRAY (indices above, values inside, base address, size); a 2-D array drawn as a grid AND as one long row (row-major) with the formula; a pointer-to-first-element arrow; the 3-D array as stacked grids; out-of-bounds drawn running into a neighbouring variable.
- **Traces:** compute `&a[2][3]` for three shapes; loop that fills and prints an array; a bubble-sort pass with the array drawn after every swap.

## C9 · Pointers I: memory and addresses  *(the biggest fear; give it the most time)*

- **Topics:** C9.1 the street of boxes again: every variable has an address; C9.2 the `&` operator (address-of); C9.3 a pointer variable is a box that holds an address; C9.4 declaring pointers (`int *p`); C9.5 the `*` operator (go to that address); C9.6 reading and writing through a pointer; C9.7 `NULL` and uninitialised (wild) pointers; C9.8 pointer size (4 or 8 bytes whatever it points to); C9.9 `%p` and printing addresses; C9.10 swapping two numbers with pointers; C9.11 pointers and functions: why we pass addresses (preview of C16).
- **Beginner must see:** the same box has a *name* and an *address*; a pointer is just another box whose content is an address; `*` and `&` are opposites; an arrow is how we draw "points to".
- **Finer points:** `*` means two things (declaration vs use); pointer type tells how many bytes to read and how to interpret them; `int *p, q;` makes only `p` a pointer; dereferencing `NULL` is undefined; two pointers to one box (aliasing); a pointer can be compared and assigned; changing the pointer vs changing the pointee.
- **GATE level:** "what is printed" with several pointers to the same variable; `*&x`, `&*p`, `**pp` chains; values after assignments through pointers.
- **Diagrams:** MEMORY (boxes with address on the left, name on the right, value inside, arrows from pointer boxes); FRAMES showing `p = &x; *p = 5;` line by line; side-by-side "name view" vs "address view"; swap(a, b) by pointers as FRAMES.
- **Traces:** five-line pointer programs with the memory redrawn after every line.

## C10 · Pointers II: arithmetic, and arrays with pointers

- **Topics:** C10.1 pointer plus integer (steps of the pointed-to size); C10.2 pointer minus pointer; C10.3 relational comparison of pointers; C10.4 array name as the address of the first element; C10.5 `a[i]` is `*(a+i)`; C10.6 array decay and its exceptions (`sizeof`, `&`); C10.7 pointers to 2-D arrays (`a`, `*a`, `a[i]`, `*(a+i)+j`, `**a` all explained and drawn); C10.8 pointer to array vs array of pointers; C10.9 `p++` vs `(*p)++` vs `*p++` vs `*++p`; C10.10 passing a 2-D array to a function; C10.11 `void *` and casts.
- **Finer points:** pointer arithmetic is scaled; `char *` moves 1; unequal-type pointer arithmetic; valid pointer range is *one past the end*; subtracting pointers gives an `int`-like count; `&a[0]`, `a`, `&a` have the same address and different types; `a + 1` vs `&a + 1`; arrays cannot be assigned but pointers can.
- **GATE level:** the full 2-D family `a + 2`, `*(a+2)`, `*(a+2)+3`, `&a + 1` with addresses; `*p++` puzzles; output of loops walking with pointers; pointer-and-array mix-ups.
- **Diagrams:** ARRAY with arrows for `p`, `p+1`, `p+2` and the byte gaps; 2-D array with a ladder of arrows for `a`, `*a`, `a[1]`, `&a`; side-by-side of `a + 1` and `&a + 1` jumping different distances; the four increment forms as TRACE.
- **Traces:** each of the four expressions on a 5-element array; the 2-D family for `int a[3][4]` at 1000.

## C11 · Strings

- **Topics:** C11.1 a string is a char array that ends with `'\0'`; C11.2 string literals; C11.3 `char s[]` vs `char *s` (modifiable copy vs read-only literal); C11.4 `printf`/`scanf` with `%s`, `%c`; `gets`, `fgets`; C11.5 `string.h`: `strlen`, `strcpy`, `strcat`, `strcmp`, `strncpy`, `strchr`, `strstr`; C11.6 writing these functions yourself with pointers; C11.7 arrays of strings; C11.8 character functions (`ctype.h`); C11.9 string and number conversion (`atoi`, `sprintf`).
- **Finer points:** `sizeof` vs `strlen`; missing terminator; copying without space; `strcmp` returns 0 when equal; comparing strings with `==` compares addresses; modifying a literal is undefined; `scanf("%s")` stops at whitespace; buffer overflow; `char` arithmetic; the empty string.
- **GATE level:** output of pointer-walking string loops; `strlen` and `sizeof` combos; self-written `strcpy` variants like `while (*d++ = *s++);` traced.
- **Diagrams:** ARRAY of chars with `\0`; MEMORY showing `char s[]` (a copy on the stack) vs `char *p` (arrow into read-only memory); FRAMES for `while (*d++ = *s++)`.
- **Traces:** `strlen` written two ways; reversing a string in place; the `strcpy` one-liner for "hi".

## C12 · Pointers III: advanced

- **Topics:** C12.1 pointer to pointer (`**pp`); C12.2 function pointers (declare, assign, call, array of function pointers, callbacks); C12.3 reading complicated declarations (the right-left / spiral rule); C12.4 `const` with pointers (the four combinations); C12.5 dangling pointers; C12.6 pointers returned from functions; C12.7 pointer aliasing; C12.8 `restrict` (note); C12.9 pointers to structures (forward to C13).
- **Finer points:** `int *f()` vs `int (*f)()`; `int *a[5]` vs `int (*a)[5]`; `const int *p`, `int *const p`, `const int *const p`; returning a pointer to a local; a pointer to a pointer lets a function change the caller's pointer.
- **GATE level:** decode a declaration; output of a function-pointer call chain; which `const` combination allows which assignment.
- **Diagrams:** MEMORY with three levels of arrows (`pp → p → x`); a declaration broken into pieces with an arrow reading it; a function-pointer table pointing into code memory; a four-cell grid for the `const` combinations (what can change).
- **Traces:** reading five declarations aloud, step by step.

## C13 · Structures, unions, enums, bit-fields, typedef

- **Topics:** C13.1 `struct`: declare, define, access (`.`); C13.2 nested structs and arrays of structs; C13.3 pointer to struct and `->`; C13.4 structures and functions (by value copies the whole thing); C13.5 memory layout, **alignment and padding**; C13.6 `sizeof(struct)`; C13.7 `union` and shared memory; C13.8 `enum`; C13.9 bit-fields; C13.10 `typedef`; C13.11 self-referential structures (a node with a pointer to its own type; the start of linked lists).
- **Finer points:** members are laid out in order; each member is aligned to its own size; the struct is padded to the largest alignment; reordering members changes `sizeof`; union size = largest member; writing one member and reading another; a struct copy copies arrays inside it; `(*p).x` is `p->x`; enum values start at 0 and continue; bit-field widths.
- **GATE level:** `sizeof` with padding (very common); union read-back values (endianness is stated); `p->next->next` chains.
- **Diagrams:** MEMORY with the bytes of a struct, padding bytes hatched; the same struct with members reordered; a union drawn as one box with several labels; LINKED node as a struct (data | next).
- **Traces:** `sizeof` for 4 different member orders; a union write/read.

## C14 · Dynamic memory: the heap

- **Topics:** C14.1 why we need memory at run time; C14.2 stack vs heap vs data segment (full picture); C14.3 `malloc`; C14.4 `calloc`; C14.5 `realloc`; C14.6 `free`; C14.7 memory leaks; C14.8 dangling pointers and double free; C14.9 allocating 1-D and 2-D arrays (and arrays of pointers); C14.10 allocating structures and linked nodes; C14.11 checking for `NULL`; C14.12 `sizeof` idioms.
- **Finer points:** `malloc` does not initialise, `calloc` does; `malloc(0)`; `free(NULL)` is safe; freeing the middle of a block is wrong; `realloc` may move the block; `sizeof(p)` of a pointer is not the block size; heap memory lives until freed; stack memory lives until return.
- **GATE level:** leak counting; identify the dangling/double free; sizes asked in `malloc(sizeof...)`; behaviour of `free` then use.
- **Diagrams:** MEMORY layout of a process (code | data | heap ↑ | ↓ stack) with arrows for growth; FRAMES for `malloc` then `free`; a 2-D dynamic array as an array of row pointers, row by row.
- **Traces:** a program with a leak; the same program fixed; a use-after-free.

## C15 · Preprocessor and macros

- **Topics:** C15.1 what the preprocessor does (text, before compiling); C15.2 `#include`; C15.3 `#define` constants; C15.4 function-like macros and the need for brackets; C15.5 side-effect traps (`SQUARE(i++)`); C15.6 `#`, `##` (stringify, paste); C15.7 conditional compilation `#if`, `#ifdef`, header guards; C15.8 macros vs functions vs `inline`.
- **Finer points:** macros are replaced text, no type check, no evaluation until used; missing brackets change meaning; macro arguments are evaluated each time they appear; no `;` at the end of a `#define`.
- **GATE level:** expand a macro and compute the result (frequent).
- **Diagrams:** FRAMES showing the text before and after expansion, step by step; COMPARE table macro vs function.
- **Traces:** `#define SQ(x) x*x` with `SQ(2+3)`, and the fixed version.

## C16 · Parameter passing and scope rules (the GATE view)

- **Topics:** C16.1 call by value (what C really does); C16.2 call by reference simulated with pointers; C16.3 call by value-result (copy-restore); C16.4 call by name (as in GATE theory questions); C16.5 aliasing effects; C16.6 static (lexical) scope vs dynamic scope with worked examples; C16.7 arrays as parameters; C16.8 nested functions and closures (concept only, since C does not have them).
- **GATE level:** the "what is printed under call by reference / value-result / name" puzzles; static vs dynamic scoping output.
- **Diagrams:** STACKFRAME series per mechanism; COMPARE across mechanisms on one program; scope-chain picture for dynamic scoping.

## C17 · Files and error handling (light, low priority)

- **Topics:** C17.1 `FILE *`; C17.2 `fopen`, `fclose`; C17.3 `fprintf`, `fscanf`, `fgetc`, `fputc`, `fgets`; C17.4 `EOF`; C17.5 return values and `errno`; C17.6 `exit`, `abort`.
- **Note:** rarely asked; kept short and clearly marked [BEYOND].

## C18 · Output-prediction method and undefined behaviour  *(a skills chapter)*

- **Topics:** C18.1 the 7-step method for any "what is the output" question (list variables, draw memory, apply precedence, run line by line, watch side effects, check types, check UB); C18.2 the catalogue of undefined, unspecified and implementation-defined behaviour; C18.3 how to spot UB quickly; C18.4 the 20 most repeated trick patterns in GATE C questions.
- **Diagrams:** a single reusable TRACE template; a map of UB sources.

## C19 · Previous-year patterns and mixed practice

- **Topics:** C19.1 pattern library (each pattern with one model solved question); C19.2 full-length mixed sets; C19.3 timing: how long a C question deserves.
- **Source:** our own PYQ bank (`/topics/...`), tagged by C-chapter.

---

## 3. Practice ladder per topic (applies to every topic above)

Warm-up 6 · Core 10 · GATE-level 10 · Twisted 5, each with a worked solution. Total per chapter: at least 60 problems; the whole subject: about **1,000 graded problems** (many exist already in the question bank and only need tagging and solutions).

## 4. Hands-on and visual tools to build with the content

- **Memory visualiser lab** (the single most valuable tool for C): type a few lines, step through, watch boxes, addresses and arrows change.
- **Stack-frame stepper** for function calls and recursion.
- **Pointer arithmetic playground:** change the type and the offset, see the address jump.
- **Struct-padding calculator** with the bytes drawn.
- **Macro expander** showing each substitution.
- **Operator precedence explorer:** type an expression, see its tree.
- **Binary / two's complement explorer** for conversions and overflow.

## 5. Open questions for your review

1. Is the order of chapters right for a zero-level reader (C9 pointers comes after arrays and strings are drawn as memory)?
2. Is anything GATE asks missing? (Please list it.)
3. Should C0 (how a computer runs a program) be a separate free "bridge" chapter for all subjects?
4. Do you agree on the machine assumption (32-bit int 4 B, pointer 4 B unless the question says otherwise)?
