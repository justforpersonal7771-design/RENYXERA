import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 1 "Your first program" (27 Nov 2026). No real GATE question is tagged to this chapter on its own in the bank (see 07-PDS-BOOK-CONTENTS.md);
 * printf and scanf return values, escape sequences and tokenising appear inside output questions of later chapters. Every program was compiled
 * and run with gcc (scripts/chapter-check.ts); the two programs that read input (file names ending _input.c) were run by hand with the input shown.
 */
export const chapterC1: Topic = {
  id: "cs.pds.c.first",
  title: "Your first program",
  no: "1",
  book: [
    { t: "p", text: "Every language is learned by writing something small that works. This chapter gets C running on your own machine, explains the smallest useful program one symbol at a time, and then teaches the two functions every C program uses to talk to a person: `printf`, which writes, and `scanf`, which reads. It ends with how a program is broken into tokens and the four kinds of mistake you will meet." },
    { t: "p", text: "None of this is hard, but it is exact. C does precisely what you wrote, not what you meant, and many GATE output questions are built on one small detail from this chapter: a format letter, an escape, a returned value, a leftover newline. Read slowly, and run every program." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["write, compile and run a C program, and explain every symbol in the smallest one;", "predict exactly what `printf` prints for any format, including width, precision and escapes;", "use `scanf` correctly, and say why it needs the address of a variable;", "use the numbers that `printf` and `scanf` give back;", "tokenise a line of C the way the compiler does, and name the four kinds of error."] },

    { t: "h2", text: "Getting C running" },
    { t: "h3", text: "What you need" },
    { t: "p", text: "You need a **compiler**: the tool from chapter 0 that turns your source code into a program. The easiest choice is **GCC**. On Windows install MSYS2 and its `gcc` package, on Linux it is usually already there, and on macOS the command `clang` (which behaves the same way for this book) comes with the developer tools. If you do not want to install anything, an online compiler works too. Save your code in a file that ends in `.c`." },
    { t: "p", text: "From a terminal, compiling and running look like this. The first command compiles `first.c` into a program called `first`; the second runs it." },
    { t: "code", text: `gcc -Wall -o first first.c
./first`, file: "terminal" },
    { t: "callout", kind: "tip", text: "Always compile with `-Wall`. It asks the compiler to warn you about code that is legal but suspicious, and most beginner mistakes show up as a warning before they show up as a wrong answer." },
    { t: "h3", text: "The smallest program" },
    { t: "fig", id: "c1-f1" },
    { t: "p", text: "Here is a complete program. It stores the number 72 in a variable called `marks` and prints it. Figure 1.1 takes it line by line; read the table first, then the program." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int marks = 72;
    printf("Marks: %d\\n", marks);
    return 0;
}`, out: "Marks: 72", file: "first_program.c" },
    { t: "h3", text: "Reading it line by line" },
    { t: "ul", items: ["`#include <stdio.h>` asks for the header file that tells the compiler about `printf` and `scanf`. The name stands for _standard input and output_. Without this line the compiler does not know what `printf` is.", "`int main(void)` begins the function called `main`. Every C program starts running at `main`. The word `int` says it will hand back a whole number when it finishes, and `void` says it takes no input.", "`{` and `}` open and close the body of the function: everything between them belongs to `main`.", "`int marks = 72;` makes a box called `marks` that holds a whole number, and puts 72 in it. Each statement ends with a semicolon `;`.", "`printf(\"Marks: %d\\n\", marks);` prints the text, putting the value of `marks` where `%d` stands, then starts a new line with `\\n`.", "`return 0;` hands the number 0 back to the operating system, which by long convention means _everything went well_."] },
    { t: "h3", text: "Old habits to drop" },
    { t: "p", text: "Many older books and college labs use Turbo C, a compiler from the 1990s, and teach habits that are not standard C and fail on every modern compiler. You will see them in old notes, so know them and do not copy them." },
    { t: "table", head: ["Old Turbo C habit", "Why it is wrong", "Write this instead"], rows: [["`void main()`", "The standard says `main` returns an `int`", "`int main(void)` with `return 0;`"], ["`#include <conio.h>`", "A Turbo C file that does not exist elsewhere", "leave it out"], ["`clrscr();` and `getch();`", "Also from `conio.h`; not C", "leave them out"], ["`fflush(stdin);`", "Flushing an input stream is undefined in C", "read and discard the extra characters (section 1.3)"]] },
    { t: "trap", i: 0 },

    { t: "h2", text: "Printing with printf" },
    { t: "h3", text: "Text and escape sequences" },
    { t: "p", text: "`printf` writes whatever is between the double quotes, except for two kinds of special character. A backslash starts an **escape sequence**, which stands for a character you cannot type directly. A percent sign starts a **format specifier**, covered next. The escapes you must know are these." },
    { t: "table", head: ["Written", "Means", "Notes"], rows: [["`\\n`", "new line", "moves to the start of the next line"], ["`\\t`", "tab", "jumps to the next tab stop"], ["`\\\\`", "one backslash", "a backslash must be doubled to appear"], ["`\\\"`", "a double quote", "so a quote does not end the text"], ["`\\'`", "a single quote", "needed inside a character constant"], ["`\\0`", "the null character", "value 0; ends every string"], ["`\\b` `\\r`", "backspace, carriage return", "rarely needed"], ["`\\101` `\\x41`", "the character with code 65", "octal and hex escapes; both are `A`"]] },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    printf("He said \\"hi\\"\\n");
    printf("C:\\\\temp\\n");
    return 0;
}`, out: "He said \"hi\"\nC:\\temp", file: "escapes_demo.c" },
    { t: "callout", kind: "key", text: "Each escape sequence is **one character**, however many keys it takes to type. `\\n` is one character, `\\\\` is one character. This matters when a question asks for the length of a string." },
    { t: "h3", text: "Format specifiers" },
    { t: "p", text: "A format specifier is a placeholder: `printf` replaces it with the next value from its argument list, written in the style the letter asks for. The same bits can be shown in many ways." },
    { t: "table", head: ["Specifier", "Prints", "Example value", "Shown as"], rows: [["`%d` or `%i`", "a signed whole number", "65", "65"], ["`%u`", "an unsigned whole number", "65", "65"], ["`%c`", "one character", "65", "A"], ["`%s`", "a string", "\"hi\"", "hi"], ["`%f`", "a decimal number", "3.5", "3.500000"], ["`%x`", "hexadecimal", "65", "41"], ["`%o`", "octal", "65", "101"], ["`%p`", "an address", "&x", "0x7ffd…"], ["`%%`", "a percent sign itself", "none", "%"]] },
    { t: "fig", id: "c1-f4" },
    { t: "p", text: "Figure 1.4 shows one value, 65, printed through four specifiers. The value stored never changes; only the way it is displayed does. In particular `%c` shows the character whose code is 65, which is `A`." },
    { t: "h3", text: "Width, precision and alignment" },
    { t: "p", text: "Between the percent sign and the letter you may put a number that controls how much space the value takes. A number after a dot sets the **precision**: for `%f` it is the digits after the decimal point, and for `%s` the largest number of characters printed. A minus sign left-aligns, and a leading zero pads with zeros." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    printf("[%5d] [%-5d] [%05d]\\n", 42, 42, 42);
    printf("[%.2f] [%8.3f]\\n", 3.14159, 3.14159);
    printf("[%s] [%10s] [%-10s] [%.3s]\\n", "GATE", "GATE", "GATE", "GATE2027");
    return 0;
}`, out: "[   42] [42   ] [00042]\n[3.14] [   3.142]\n[GATE] [      GATE] [GATE      ] [GAT]", file: "width_demo.c" },
    { t: "callout", kind: "tip", text: "Read `%8.3f` as: use at least 8 places in all, with 3 digits after the point. Count the output spaces by hand once; it is the whole trick." },
    { t: "h3", text: "printf gives back a number" },
    { t: "p", text: "`printf` is a function, and like most functions it returns a value: the **number of characters it printed**. We rarely look at it, but output questions use it. The newline in `\"Hello\\n\"` counts as a character, so the call below returns 6." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n = printf("Hello\\n");
    printf("%d\\n", n);
    printf("%d", printf("%d", 10));
    return 0;
}`, out: "Hello\n6\n102", file: "printf_returns.c" },
    { t: "p", text: "The last line is the classic puzzle. C works out the argument first, so the inner `printf(\"%d\", 10)` runs and prints 10, and returns 2 (two characters). The outer `printf` then prints that 2. The screen shows 10 and then 2, which reads as 102." },
    { t: "trap", i: 4 },
    { t: "trap", i: 6 },

    { t: "h2", text: "Reading with scanf" },
    { t: "h3", text: "Reading a value" },
    { t: "p", text: "`scanf` reads characters typed by the user and turns them into values. Its first argument is a format string, like `printf`'s, which says what to expect; the rest say where to put the values. Notice the `&` in front of the variables." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a = -1, b = -1;
    int n = scanf("%d %d", &a, &b);
    printf("read %d values: %d and %d\\n", n, a, b);
    return 0;
}`, out: "input 25 7  →  read 2 values: 25 and 7\ninput x     →  read 0 values: -1 and -1", file: "scanf_input.c" },
    { t: "h3", text: "Why scanf needs an address" },
    { t: "p", text: "A function gets copies of what you pass it. If you wrote `scanf(\"%d\", a)`, it would receive a copy of `a`'s value and could never put a number _into_ `a`. So you give it the **address** of `a`, written `&a`: where the box is. With the address it can walk to the box and fill it. `printf`, which only reads values, needs no address. Chapter 10 explains this fully; for now remember the rule." },
    { t: "trap", i: 1 },
    { t: "h3", text: "What scanf gives back" },
    { t: "p", text: "`scanf` returns the number of values it successfully read. In the program above it returns 2 when you type two numbers, and 0 if you type a letter where a number was expected. It returns the special value `EOF` (usually −1) if the input ends before anything is read. Good programs check it." },
    { t: "h3", text: "The keyboard buffer and the leftover newline" },
    { t: "p", text: "When you type, the characters are not given to the program at once. They wait in a **buffer** until you press Enter, and Enter itself is a character, the newline. `scanf(\"%d\")` takes the digits and stops at the newline, **leaving the newline in the buffer**. A later `scanf(\"%c\")` reads one character of any kind, so it takes that leftover newline instead of waiting for you. Step through Figure 1.2." },
    { t: "fig", id: "c1-f2" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int k;
    char c = '?';
    scanf("%d", &k);
    scanf("%c", &c);
    printf("%d [%d]\\n", k, c);
    return 0;
}`, out: "input 25 and Enter  →  25 [10]", file: "leftover_newline_input.c" },
    { t: "p", text: "The program prints `25 [10]`: the character that `%c` read has code 10, the newline. The usual cure is a space before the percent sign, `scanf(\" %c\", &c)`. A space in a `scanf` format means _skip any white space here_, so the leftover newline is discarded." },
    { t: "trap", i: 2 },

    { t: "h2", text: "Tokens, comments and mistakes" },
    { t: "h3", text: "Tokens" },
    { t: "p", text: "Before it understands your program, the compiler cuts the text into the smallest meaningful pieces, called **tokens**. The kinds are keywords (`int`, `return`), names you invent (`marks`), constants (`72`, `'A'`, `\"hi\"`), operators (`+`, `++`, `=`) and punctuation (`;`, `{`, `}`). Spaces separate tokens but are otherwise ignored, which is why a program can be laid out in any way you like." },
    { t: "h3", text: "Maximal munch" },
    { t: "p", text: "When the compiler cuts the text, it always takes the **longest** piece that is a valid token, and never looks back. This is called **maximal munch**. It decides what `a+++b` means: reading left to right, after the name `a` the longest valid token starting at the first plus is `++`. Figure 1.5 does it step by step." },
    { t: "fig", id: "c1-f5" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a = 5, b = 2;
    int r = a+++b;        /* tokens: a ++ + b */
    printf("%d %d\\n", r, a);
    return 0;
}`, out: "7 6", file: "maximal_munch.c" },
    { t: "p", text: "So `a+++b` is `(a++) + b`: it uses the old a (5) plus b (2), giving 7, and afterwards a becomes 6. Writing `a + ++b` instead would be a different program. Put spaces around operators and this puzzle never arises in your own code." },
    { t: "trap", i: 3 },
    { t: "h3", text: "Comments" },
    { t: "p", text: "A comment is text for people; the compiler ignores it. `/* ... */` can span several lines, and `//` (C99) comments out the rest of one line. Block comments do **not** nest: the first `*/` ends the comment, whatever came before it." },
    { t: "trap", i: 5 },
    { t: "h3", text: "The four kinds of mistake" },
    { t: "fig", id: "c1-f3" },
    { t: "p", text: "Chapter 0 named these; now you can meet them. A **syntax error** breaks the grammar, such as a missing semicolon, and the compiler reports it with a line number. A **link error** means the linker could not find a function you used. A **run-time error** appears only when the program runs. A **logic error** is the hardest: no message at all, only a wrong answer. Reading a compiler message is a skill: look at the **first** error only (later ones are often caused by it), at the line it names and the line just before." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "This chapter's ideas are tested inside output questions rather than as separate questions, so the best preparation is to be exact about each small rule. These are the four patterns, each with variations that were compiled and run." },
    { t: "h3", text: "Pattern 1: what does printf return?" },
    { t: "ex", id: "c1-e1" },
    { t: "table", head: ["Change", "Why", "Output"], rows: [["`printf(\"%d\", printf(\"hello\"));`", "inner prints hello (5 characters) and returns 5", "hello5"], ["`printf(\"%d\", printf(\"%d\", printf(\"%d\", 1)));`", "innermost prints 1 and returns 1; the middle prints 1 and returns 1; the outer prints 1", "111"], ["`printf(\"%d\", printf(\"\\n\"));`", "the inner prints a newline and returns 1", "a newline, then 1"]], caption: "The first two were compiled and run." },
    { t: "h3", text: "Pattern 2: the length of a string with escapes" },
    { t: "ex", id: "c1-e2" },
    { t: "h3", text: "Pattern 3: width and precision" },
    { t: "ex", id: "c1-e3" },
    { t: "h3", text: "Pattern 4: tokenising" },
    { t: "ex", id: "c1-e4" },
    { t: "callout", kind: "shortcut", text: "For any `printf` output question: (1) work out every argument first, innermost call first; (2) match each specifier with its value in order; (3) write the characters one by one, counting widths. Never skip step 3." },

    { t: "h2", text: "Tips, shortcuts and tricks" },
    { t: "ol", items: ["**Compile with `-Wall`.** Most mistakes in this chapter produce a warning.", "**Every escape is one character.** To count the length of a string, count `\\n` and `\\\\` as one each.", "**printf returns the count of characters printed; scanf returns the count of values read.**", "**`%d` for a number, `%c` for a character, `%f` for a decimal, `%s` for a string.** The wrong letter for the value gives rubbish.", "**For widths: the number is the minimum space, the minus sign pads on the right, a dot number is the digits after the point.**", "**After a number, `scanf(\" %c\")` with a leading space** skips the leftover newline.", "**Put spaces round operators.** `a++ + b` is clear; `a+++b` is a puzzle.", "**Never write `void main`, `getch`, `clrscr` or `fflush(stdin)`.**"] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A C program starts at `int main(void)`. `#include <stdio.h>` lets you use `printf` and `scanf`. Statements end with a semicolon; `return 0;` ends `main`.", "`printf` writes text; escapes such as `\\n` and `\\\\` are single characters; format letters (`%d %c %s %f %x %o %%`) place values; width and precision shape them.", "`printf` returns the number of characters it printed.", "`scanf` reads values into variables, so it needs their addresses (`&x`). It returns the number of values read.", "A leftover newline can be read by a later `%c`; a space before `%c` skips it.", "The compiler cuts text into tokens using maximal munch: `a+++b` is `a++ + b`. Comments do not nest.", "The four kinds of mistake are syntax, link, run-time and logic."] },
  ],
  blocks: [
    { type: "figure", id: "c1-f1", caption: "The six lines of the smallest program and what each does.", alt: "A table with each line of the first program and a short description of its job.", fig: { kind: "trace", title: "first_program.c, line by line", cols: ["Line", "Code", "What it does"], rows: [{ cells: [1, "#include <stdio.h>", "brings in printf and scanf"] }, { cells: [3, "int main(void) {", "the program starts here"] }, { cells: [4, "int marks = 72;", "makes a box marks and stores 72"], changed: [2], tone: "hl" }, { cells: [5, "printf(\"Marks: %d\\n\", marks);", "prints the text with the value of marks"] }, { cells: [6, "return 0;", "hands 0 back: all went well"] }, { cells: [7, "}", "the end of main"] }] } },
    { type: "figure", id: "c1-f2", caption: "The user types 25 and presses Enter. scanf takes 25 and leaves the newline; the next scanf with %c takes the newline.", alt: "Four frames of the keyboard buffer holding 2, 5 and a newline, showing which characters each scanf takes.", fig: { kind: "frames", title: "scanf(\"%d\", &k);  scanf(\"%c\", &c);", frames: [
      { caption: "You type 25 and press Enter: three characters wait in the buffer, the digits and the newline.", fig: { kind: "array", data: [["2", "5", "↵"]], pointers: [{ name: "next", at: [0, 0] }] } },
      { caption: "scanf(\"%d\") takes 2 and 5, builds the number 25 and stops at the newline. The newline stays.", fig: { kind: "array", data: [["2", "5", "↵"]], tones: { "0,0": "dim", "0,1": "dim", "0,2": "bad" }, pointers: [{ name: "next", at: [0, 2] }] } },
      { caption: "scanf(\"%c\") reads one character of any kind. The next one is the newline, so c gets code 10 and the program never waits for you.", fig: { kind: "array", data: [["2", "5", "↵"]], tones: { "0,0": "dim", "0,1": "dim", "0,2": "ok" }, pointers: [{ name: "next", at: [0, 2] }] } },
      { caption: "With scanf(\" %c\") the space skips the newline first, and the program waits for a real character.", fig: { kind: "array", data: [["2", "5", "↵"]], tones: { "0,0": "dim", "0,1": "dim", "0,2": "dim" }, pointers: [{ name: "next", at: [0, 2] }] } },
    ] } },
    { type: "figure", id: "c1-f3", caption: "Four kinds of mistake: who finds each one, and when.", alt: "A table of syntax, link, run-time and logic errors with who finds them and when.", fig: { kind: "matrix", title: "Four kinds of mistake", cols: ["Found by", "When"], rows: [{ label: "Syntax error", cells: ["the compiler", "before the program exists"] }, { label: "Link error", cells: ["the linker", "before the program exists"] }, { label: "Run-time error", cells: ["the running program", "while it runs"], hl: true }, { label: "Logic error", cells: ["you", "wrong answer, no message"], hl: true }] } },
    { type: "figure", id: "c1-f4", caption: "The value 65 stored once, shown four ways. A width such as %5d only adds spaces.", alt: "The same value 65 printed with %d, %c, %x, %o and %5d.", fig: { kind: "matrix", title: "printf with the value 65", cols: ["Prints"], rows: [{ label: "%d", cells: ["65"] }, { label: "%c", cells: ["A"], hl: true }, { label: "%x", cells: ["41"] }, { label: "%o", cells: ["101"] }, { label: "[%5d]", cells: ["[   65]"] }] } },
    { type: "figure", id: "c1-f5", caption: "The compiler always takes the longest valid token. After the name a, the longest token that starts at the first plus is ++, not +++.", alt: "A table showing a+++b being cut into the tokens a, ++, + and b.", fig: { kind: "trace", title: "tokenising a+++b", cols: ["Text left", "Token taken", "Why"], rows: [{ cells: ["a+++b", "a", "a name"] }, { cells: ["+++b", "++", "+++ is not a token, ++ is the longest"], tone: "hl" }, { cells: ["+b", "+", "the longest that is left"] }, { cells: ["b", "b", "a name"] }, { cells: ["", "a ++ + b", "that is (a++) + b"], tone: "ok" }] } },

    { type: "example", id: "c1-e1", level: "gate", title: "Nested printf: what is printed, and what is returned", file: "nested_printf.c", given: `#include <stdio.h>

int main(void) {
    printf("%d", printf("%d", 10));
    return 0;
}`, find: "What appears on the screen?", steps: [
      { say: "C works out the arguments of the outer printf first. That means running the inner printf(\"%d\", 10).", result: "prints 10" },
      { say: "The inner call returns the number of characters it printed: 10 is two characters.", result: "returns 2" },
      { say: "The outer printf now prints that 2 with %d.", result: "prints 2" },
      { say: "The screen shows the two outputs one after the other.", result: "102" },
    ], answer: "102", check: "The program was compiled and run." },
    { type: "example", id: "c1-e2", level: "edge", title: "The length of a string with escapes", file: "escape_length.c", given: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "ab\\tc\\n\\\\";
    printf("%zu %zu\\n", strlen(s), sizeof s);
    return 0;
}`, find: "What is printed?", steps: [
      { say: "Cut the text into characters: a, b, the tab \\t, c, the newline \\n and the single backslash \\\\.", result: "6 characters" },
      { say: "strlen counts the characters before the ending null character.", result: "6" },
      { say: "The array also holds the null character at the end, and sizeof counts it.", result: "7" },
    ], answer: "6 7", check: "Each escape is one character. The program was compiled and run." },
    { type: "example", id: "c1-e3", level: "easy", title: "Width, precision and alignment", file: "width_trace.c", given: `printf("[%5d] [%-5d] [%05d]", 42, 42, 42);
printf("[%.2f] [%8.3f]", 3.14159, 3.14159);`, find: "The exact output, counting spaces.", steps: [
      { say: "%5d: five places, right aligned, so three spaces then 42.", result: "[   42]" },
      { say: "%-5d: five places, left aligned, so 42 then three spaces.", result: "[42   ]" },
      { say: "%05d: five places padded with zeros.", result: "[00042]" },
      { say: "%.2f: two digits after the point, rounded.", result: "[3.14]" },
      { say: "%8.3f: three digits after the point (3.142, five characters) in eight places, so three spaces first.", result: "[   3.142]" },
    ], answer: "[   42] [42   ] [00042][3.14] [   3.142]", check: "The first program of section 1.2 prints exactly these lines." },
    { type: "example", id: "c1-e4", level: "gate", title: "Tokenising a+++b", file: "munch_trace.c", given: `int a = 5, b = 2;
int r = a+++b;
printf("%d %d", r, a);`, find: "What is printed?", steps: [
      { say: "Cut a+++b with maximal munch: a, then ++, then +, then b.", result: "a ++ + b" },
      { say: "That is (a++) + b: use a (5), add b (2), then increase a.", result: "r = 7" },
      { say: "After the statement a has been increased.", result: "a = 6" },
    ], answer: "7 6", check: "Variation: `x---y` with x = 5, y = 2 is `(x--) - y`, which gives 3 and leaves x = 4. Both were compiled and run." },

    { type: "trap", wrong: "void main() is fine because it ran in Turbo C.", tempting: "Many lab books and old notes use it, and the program seems to work.", whyWrong: "The C standard requires main to return an int. Modern compilers warn or refuse, and the habit shows you learned from old notes.", rule: "Write int main(void) and return 0;" },
    { type: "trap", wrong: "scanf(\"%d\", x); reads into x.", tempting: "printf(\"%d\", x) works with x alone, so scanf looks the same.", whyWrong: "scanf must store a number into x, so it needs the address of x. Passing x passes a copy of its value, and the number goes to a random place or crashes.", rule: "printf gets values: x. scanf gets addresses: &x." },
    { type: "trap", wrong: "scanf(\"%c\", &c) waits for a new character after a number.", tempting: "It looks like a fresh question to the user.", whyWrong: "The newline typed after the number is still in the buffer, and %c reads any character, so it takes the newline at once.", rule: "After reading a number, write scanf(\" %c\", &c) with a space." },
    { type: "trap", wrong: "a+++b means a + (++b).", tempting: "The plus signs seem to belong to b, the nearer operand.", whyWrong: "Maximal munch takes the longest token ++ first, so it is (a++) + b.", rule: "The compiler reads left to right and always takes the longest token." },
    { type: "trap", wrong: "printf returns nothing.", tempting: "It is used as a statement and its result is never shown.", whyWrong: "printf returns the number of characters it printed, including the newline. printf(\"%d\", printf(\"%d\", 10)) prints 10 then 2.", rule: "Evaluate the inner printf first, then use its count." },
    { type: "trap", wrong: "Comments can be nested: /* a /* b */ c */.", tempting: "Brackets nest, so comments seem to as well.", whyWrong: "The first */ ends the whole comment, so c */ is left as code and does not compile.", rule: "A block comment ends at the first */." },
    { type: "trap", wrong: "printf(\"%d\", 3.5) prints 3.", tempting: "Converting a decimal to a whole number drops the fraction.", whyWrong: "printf does not convert: %d expects an int, and a double is stored differently. The result is undefined (usually rubbish).", rule: "The letter must match the value: %d for int, %f for double." },
    { type: "gate", text: "No question of the bank is on this chapter alone. printf and scanf return values, escape sequences in a string, field widths, a leftover newline and tokenising by maximal munch each appear inside output-prediction questions of the later chapters. The exact rules above are what let you finish those lines without a mistake." },
    { type: "recall", cards: [
      { q: "Where does a C program start?", a: "At the function main." },
      { q: "What does #include <stdio.h> give you?", a: "The declarations of printf and scanf." },
      { q: "What does printf return?", a: "The number of characters printed." },
      { q: "What does scanf return?", a: "The number of values it read successfully." },
      { q: "Why does scanf need &x?", a: "It has to store into x, so it needs the address of x." },
      { q: "How many characters is \\n?", a: "One." },
      { q: "What does %8.3f mean?", a: "At least 8 places, 3 digits after the decimal point." },
      { q: "Why does scanf(\"%c\") sometimes not wait?", a: "A newline from the earlier input is still in the buffer." },
      { q: "How is a+++b cut into tokens?", a: "a, ++, +, b: that is (a++) + b." },
      { q: "Do block comments nest?", a: "No, the first */ ends the comment." },
      { q: "What are the four kinds of mistake?", a: "Syntax, link, run-time and logic." },
    ] },
    { type: "check", questions: [
      { id: "f1", kind: "NAT", marks: 1, q: "printf(\"%d\", printf(\"%d\", 10)); How many characters does this statement print in total?", answer: "3", solution: "The inner call prints 10 (2 characters) and returns 2; the outer prints 2 (1 character): 3 characters." },
      { id: "f2", kind: "NAT", marks: 1, q: "char s[] = \"ab\\tc\\n\\\\\"; What is strlen(s)?", answer: "6", solution: "a, b, tab, c, newline and backslash: six characters." },
      { id: "f3", kind: "NAT", marks: 1, q: "int a = 5, b = 2; int r = a+++b; What is r?", answer: "7", solution: "It is (a++) + b: 5 + 2." },
      { id: "f4", kind: "MCQ", marks: 1, q: "What does int n = printf(\"Hi\\n\"); store in n?", options: ["2", "3", "0", "1"], answer: "B", solution: "H, i and the newline are three characters." },
      { id: "f5", kind: "NAT", marks: 2, q: "How many characters are printed by printf(\"%6.2f\", 3.14159)? (Count the spaces.)", answer: "6", solution: "3.14 is four characters, padded with two spaces to six places." },
      { id: "f6", kind: "MCQ", marks: 2, q: "int n; char c; scanf(\"%d\", &n); scanf(\"%c\", &c); The user types 7 and presses Enter. What is stored in c?", options: ["'7'", "the newline character", "nothing, scanf waits", "the null character"], answer: "B", solution: "The newline typed after 7 is still in the buffer, and %c reads it." },
      { id: "f7", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["scanf returns the number of values it read", "printf returns the number of characters it printed", "Block comments can be nested", "void main() is required by the C standard"], answer: "A, B", solution: "C is false: the first */ ends a comment. D is false: the standard requires int main." },
      { id: "f8", kind: "NAT", marks: 2, q: "int x = 5, y = 2; int q = x---y; What is the value of x after the statement?", answer: "4", solution: "It is (x--) - y: q is 3 and x becomes 4." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on C programs", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: variables and data types", href: "/study/c-programming" }] },
    { type: "links", prereq: ["How a computer runs a program (C0)"], usedIn: ["Variables and data types (C2)", "Operators (C3)", "Pointers I (C10)"], cross: ["Digital Logic: character codes"] },
  ],
};
