import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 0 "How a computer runs a program" (26 Nov 2026), a bridge chapter: no PYQ asks it on its own, but every later chapter needs it.
 * Real GATE question used: 2017_AN_Q23 (Digital Logic: hexadecimal to octal), which is exactly the skill of section 0.3.
 * Every program was compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC0: Topic = {
  id: "cs.pds.c.how",
  title: "How a computer runs a program",
  no: "0",
  book: [
    { t: "p", text: "Before the first line of C, it helps to know what is happening inside the machine when a program runs. This chapter has no difficult idea in it, and no real GATE question asks it directly, yet almost every later question quietly uses it: where values are kept, why a byte holds a number up to 255, how to move between binary, octal and hexadecimal, and what the words compiler, linker and loader mean." },
    { t: "p", text: "Read it once, slowly, and do the small conversions with a pencil. The conversions are also the fastest marks in this chapter, because they appear again in Digital Logic and in Computer Organisation." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["say what the disk, the RAM and the CPU each do while a program runs;", "explain a bit, a byte and an address, and why one byte holds a number from 0 to 255;", "convert between decimal, binary, octal and hexadecimal quickly and without mistakes;", "work out how many bytes an address of n bits can reach;", "tell source code, object code, the executable and the running program apart, and say which step makes which error."] },

    { t: "h2", text: "What a program is" },
    { t: "h3", text: "Instructions and data" },
    { t: "p", text: "A program is a list of small instructions, such as _add these two numbers_ or _compare this with zero_, together with the data those instructions work on. A computer does nothing by itself. It only follows the list, one instruction after another, extremely fast." },
    { t: "h3", text: "Disk, RAM and CPU" },
    { t: "fig", id: "c0-f1" },
    { t: "p", text: "Three parts of the machine matter to a programmer. The **disk** keeps your files, including the finished program, even when the power is off. The **RAM** is the working memory: while a program runs, its instructions and its data are held there, because RAM is much faster than the disk. The **CPU** is the part that does the work: it fetches one instruction at a time from RAM, carries it out, and writes any result back to RAM." },
    { t: "callout", kind: "key", text: "Picture a kitchen. The disk is the fridge (everything is stored, but far away), the RAM is the counter (only what you are cooking now, close at hand) and the CPU is the cook. When the power goes, the counter is cleared." },
    { t: "p", text: "This explains something that surprises beginners. A variable in your program vanishes when the program ends, because variables live in RAM. Anything you want to keep, you must write to a file on the disk." },

    { t: "h2", text: "Memory: bits, bytes and addresses" },
    { t: "h3", text: "The bit" },
    { t: "p", text: "The smallest piece of memory is the **bit**: a tiny switch that is either off (0) or on (1). One bit can say only yes or no, but a row of bits can say much more, because every extra bit doubles the number of different patterns. Two bits give four patterns (00, 01, 10, 11), three bits give eight, and n bits give 2ⁿ." },
    { t: "h3", text: "The byte" },
    { t: "p", text: "Eight bits are grouped into one **byte**. A byte has 2⁸ = 256 patterns, so it can store a whole number from 0 to 255, or one letter of the alphabet. The byte is the unit in which memory is counted and addressed. The C standard only promises that a byte has _at least_ eight bits; on every machine used in this book it has exactly eight." },
    { t: "fig", id: "c0-f2" },
    { t: "p", text: "Figure 0.2 shows how one byte is read. Each switch has a place value, doubling from right to left: 1, 2, 4, 8, 16, 32, 64, 128. The number stored is the sum of the place values of the switches that are on. Here the switches for 128, 32, 16, 4 and 2 are on, and 128 + 32 + 16 + 4 + 2 = 182." },
    { t: "callout", kind: "tip", text: "The eight place values 128, 64, 32, 16, 8, 4, 2, 1 are worth learning by heart. Every binary conversion in this chapter is a way of adding some of them." },
    { t: "h3", text: "The address" },
    { t: "fig", id: "c0-f3" },
    { t: "p", text: "RAM is a very long row of bytes, and the computer must be able to name each one. It does this with a number, the **address** of the byte, counting from 0. Picture a street of numbered houses: house 1000 is next to 1001, and each house holds exactly one byte. Addresses are plain counting numbers, and this is what chapter 10 builds pointers on." },
    { t: "h4", text: "Counting bytes with address bits" },
    { t: "p", text: "If an address is written with n bits, there are 2ⁿ different addresses, so the memory can hold 2ⁿ bytes. This is a favourite short question." },
    { t: "table", head: ["Address bits", "Bytes reached", "Usual name"], rows: [["10", "1 024", "1 KB"], ["16", "65 536", "64 KB"], ["20", "1 048 576", "1 MB"], ["32", "4 294 967 296", "4 GB"]] },
    { t: "trap", i: 0 },

    { t: "h2", text: "Number systems" },
    { t: "p", text: "We write numbers in base ten because we have ten fingers. A computer's switches have two states, so inside the machine everything is base two. Writing a long string of 0s and 1s is tiresome and easy to get wrong, so programmers also use base eight (**octal**) and base sixteen (**hexadecimal**, or hex) as short ways to write the same bits. All four are just different ways of writing one number." },
    { t: "h3", text: "Place values" },
    { t: "p", text: "In every base the idea is the same: each position is worth the base times the position to its right. In decimal the positions are worth 1, 10, 100; in binary 1, 2, 4, 8; in octal 1, 8, 64; in hex 1, 16, 256. So the decimal number 345 means 3 × 100 + 4 × 10 + 5 × 1, and the hex number 1A3 means 1 × 256 + 10 × 16 + 3 × 1 = 419." },
    { t: "table", head: ["Decimal", "Binary", "Octal", "Hex"], rows: [["0", "0000", "0", "0"], ["1", "0001", "1", "1"], ["2", "0010", "2", "2"], ["3", "0011", "3", "3"], ["4", "0100", "4", "4"], ["5", "0101", "5", "5"], ["6", "0110", "6", "6"], ["7", "0111", "7", "7"], ["8", "1000", "10", "8"], ["9", "1001", "11", "9"], ["10", "1010", "12", "A"], ["11", "1011", "13", "B"], ["12", "1100", "14", "C"], ["13", "1101", "15", "D"], ["14", "1110", "16", "E"], ["15", "1111", "17", "F"]], caption: "Hex needs sixteen digits, so after 9 it borrows the letters A to F for ten to fifteen." },
    { t: "h3", text: "Decimal to binary" },
    { t: "p", text: "To write a decimal number in binary, divide it by 2 again and again and note each remainder. The remainders are the bits, but they come out last bit first, so the answer is read from the bottom of the list upward. Figure 0.4 does it for 45." },
    { t: "fig", id: "c0-f4" },
    { t: "ex", id: "c0-e1" },
    { t: "trap", i: 1 },
    { t: "h3", text: "Binary and hexadecimal" },
    { t: "p", text: "Here is the reason hex is so popular. Four bits have sixteen patterns, and a hex digit has sixteen values, so **one hex digit is exactly four bits**. To go from binary to hex, cut the bits into groups of four, starting from the right, and replace each group with its hex digit from the table. To go back, replace each hex digit with its four bits. Step through Figure 0.5." },
    { t: "fig", id: "c0-f5" },
    { t: "ex", id: "c0-e2" },
    { t: "trap", i: 2 },
    { t: "h3", text: "Binary and octal" },
    { t: "p", text: "Octal works the same way with groups of **three** bits, because three bits have eight patterns and an octal digit has eight values. Cut from the right into threes, pad the leftmost group with zeros if it is short, and read each group as one digit 0 to 7." },
    { t: "h3", text: "Between hex and octal: go through binary" },
    { t: "p", text: "Hex and octal do not match up directly, because one needs groups of four bits and the other groups of three. The easy route is to go through binary: hex to binary, then regroup the same bits in threes, then read octal. A real GATE question does exactly this." },
    { t: "ex", id: "c0-e3" },
    { t: "h3", text: "Reading a number in C" },
    { t: "p", text: "C lets you write a number in the base of your choice. A plain number is decimal, a number that starts with `0x` is hexadecimal, and a number that starts with a plain `0` followed by digits is octal. `printf` can print a value in any of the three with `%d`, `%x` and `%o`." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    printf("decimal %d, hex %x, octal %o\\n", 45, 45, 45);
    printf("0x2F is %d and 0xB6 is %d\\n", 0x2F, 0xB6);
    return 0;
}`, out: "decimal 45, hex 2d, octal 55\n0x2F is 47 and 0xB6 is 182", file: "bases_demo.c" },
    { t: "trap", i: 4 },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    printf("%d %d\\n", 010, 10);
    return 0;
}`, out: "8 10", file: "octal_trap.c" },

    { t: "h2", text: "Sizes and units" },
    { t: "p", text: "Memory sizes are counted in powers of two, because addresses are made of bits. So the prefixes are not powers of ten: 1 KB is 1024 bytes (2¹⁰), 1 MB is 1024 KB (2²⁰ bytes) and 1 GB is 1024 MB (2³⁰ bytes). The size of each data type in C is decided by the machine; the program below asks the compiler for the sizes on the machine you use." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    printf("%zu %zu %zu %zu\\n", sizeof(char), sizeof(short), sizeof(int), sizeof(long long));
    return 0;
}`, out: "1 2 4 8", file: "type_sizes.c" },
    { t: "callout", kind: "note", text: "These sizes (1, 2, 4 and 8 bytes) are the usual ones. When a GATE question states other sizes, use the question's sizes." },

    { t: "h2", text: "From source code to a running program" },
    { t: "h3", text: "Four steps, four names" },
    { t: "p", text: "You write a program as text, called **source code**, in a file such as `program.c`. The processor cannot read that text; it only understands machine instructions. Three tools bridge the gap, and then the program can run. Step through Figure 0.6, then read what each tool does." },
    { t: "fig", id: "c0-f6" },
    { t: "ul", items: ["The **compiler** translates your source code into machine instructions, and saves them as **object code** (a file such as `program.o`). It also checks your code for mistakes in the language.", "The **linker** joins your object code with the ready-made object code your program uses, for example the code of `printf`, and produces one **executable** file (`program.exe`).", "The **loader**, which is part of the operating system, copies the executable from the disk into RAM when you ask to run it, and tells the CPU where to start.", "The CPU then **runs** the program, one instruction at a time."] },
    { t: "h3", text: "Compile time and run time" },
    { t: "p", text: "Compiling and running are two separate moments, and different mistakes are found at each. A **compile-time error**, such as a missing semicolon or an unknown name, is found by the compiler and no executable is made. A **link error** is found by the linker, for example when you call a function that exists nowhere. A **run-time error**, such as dividing by zero or following a bad pointer, happens only when the program is running, even though the program compiled without a complaint. And a **logic error** does not stop anything: the program runs and prints the wrong answer." },
    { t: "code", text: `int a = 5, b = 0;
printf("%d", a / b);     /* compiles; fails when it runs */`, file: "runtime_error.c" },
    { t: "trap", i: 3 },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "No question in the Programming and Data Structures bank is about this chapter on its own. The same skills do appear in other subjects: conversions between bases are common in Digital Logic, and counting bytes with address bits in Computer Organisation. We take one real question, from the 2017 afternoon paper, that is exactly the skill of this chapter." },
    { t: "h3", text: "GATE 2017 (afternoon), Q23: hexadecimal to octal" },
    { t: "p", text: "A one-mark question set in Digital Logic. It looks like a long calculation, but it is two grouping steps and no arithmetic." },
    { t: "ex", id: "c0-e4" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Whether you know that one hex digit is four bits and one octal digit is three bits, and that the bits do not change when you regroup them. The 16-bit number has 16 bits, which do not divide evenly into threes, so the leftmost group of three has only one bit and is padded with two zeros." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Grouping the binary bits in threes from the **left** instead of from the right. The right end is the ones place, so groups must start there.", "Forgetting the padding and getting the wrong first digit.", "Converting through decimal. It works, but it is slow, and one slip in the arithmetic gives a wrong answer. The options in this question are close to each other, so one wrong digit still lands on an option."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Question", "Via binary", "Answer"], rows: [["hex `B6` to octal", "1011 0110, regroup 010 110 110", "266"], ["hex `2F` to octal", "0010 1111, regroup 101 111", "57"], ["octal `377` to hex", "011 111 111, regroup 1111 1111", "FF"], ["hex `D7` to binary", "1101 0111", "11010111"]], caption: "Each answer was checked by running the conversion." },
    { t: "callout", kind: "shortcut", text: "For hex to octal or octal to hex, never use decimal. Write the bits, cut them again, and read. The bits stay the same all the way through." },

    { t: "h2", text: "Tips, shortcuts and tricks" },
    { t: "ol", items: ["**Learn eight numbers.** 128, 64, 32, 16, 8, 4, 2, 1 for a byte; the sixteen rows of the 0000 to 1111 table. You will use them in every chapter.", "**Hex is bits in fours, octal is bits in threes.** Always cut from the right, and pad the left end with zeros.", "**Decimal to binary:** divide by 2 and read the remainders from the bottom up, or subtract the biggest place value that fits, 128 first.", "**Check your answer backwards.** Convert the result back to decimal. It takes ten seconds and catches nearly every slip.", "**Powers of two to remember:** 2⁸ = 256, 2¹⁰ = 1024, 2¹⁶ = 65 536, 2²⁰ ≈ one million, 2³² ≈ four thousand million.", "**n address bits reach 2ⁿ bytes.** To go the other way, the number of address bits is log₂ of the number of bytes.", "**A leading 0 means octal in C.** `012` is ten, not twelve, and `010` is eight."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A running program lives in RAM, fetched from the disk, and the CPU does the work. RAM forgets when the power goes.", "A bit is 0 or 1. Eight bits make a byte, which holds 0 to 255 or one letter.", "Every byte has an address, a plain counting number. n address bits reach 2ⁿ bytes.", "Binary, octal and hex are three ways to write the same number. One hex digit is four bits; one octal digit is three bits.", "To convert, go through binary and regroup the bits. Never trust a conversion you did not check backwards.", "Source code is compiled to object code, linked with library code into an executable, loaded into RAM and run. Errors can occur at compile time, link time or run time, and a program that compiles may still be wrong."] },
  ],
  blocks: [
    { type: "figure", id: "c0-f1", caption: "The disk keeps the program; the RAM holds what is being used now; the CPU takes instructions from RAM one at a time.", alt: "Disk, RAM and CPU as three boxes with arrows showing a program loading from disk to RAM and the CPU reading RAM.", fig: { kind: "frames", title: "disk, RAM and CPU", frames: [
      { caption: "The finished program waits on the disk. The disk keeps it even with the power off, but it is slow.", fig: { kind: "strip", items: [{ label: "Disk", sub: "keeps the program", state: "now" }, { label: "RAM", sub: "empty", state: "todo" }, { label: "CPU", sub: "idle", state: "todo" }] } },
      { caption: "When you run it, the program is copied from the disk into RAM, which is fast but forgets when the power goes.", fig: { kind: "strip", items: [{ label: "Disk", sub: "keeps the program", state: "done" }, { label: "RAM", sub: "holds the program", state: "now" }, { label: "CPU", sub: "idle", state: "todo" }] } },
      { caption: "The CPU fetches one instruction at a time from RAM, carries it out and writes the result back to RAM.", fig: { kind: "strip", items: [{ label: "Disk", sub: "keeps the program", state: "done" }, { label: "RAM", sub: "holds the program and its data", state: "done" }, { label: "CPU", sub: "fetch, run, write back", state: "now" }] } },
    ] } },
    { type: "figure", id: "c0-f2", caption: "One byte as eight switches. The switches that are on add their place values: 128 + 32 + 16 + 4 + 2 = 182.", alt: "The bits 10110110 with place values 128 to 1 above them and the total 182.", fig: { kind: "bits", title: "One byte: 10110110", weights: true, group: 4, rows: [{ label: "byte", bits: "10110110", value: 182, hl: [0, 2, 3, 5, 6] }] } },
    { type: "figure", id: "c0-f3", caption: "A street of numbered houses. Each box is one byte, and its address is its house number.", alt: "Eight memory bytes with addresses 1000 to 1007 and different values.", fig: { kind: "array", title: "Eight bytes at addresses 1000 to 1007", data: [[7, 200, 0, 255, 13, 99, 1, 42]], base: 1000, size: 1, index: true } },
    { type: "figure", id: "c0-f4", caption: "Divide by 2 until the quotient is 0 and keep each remainder. Read the remainders from the bottom up: 101101.", alt: "A table of repeated division of 45 by 2 with remainders 1, 0, 1, 1, 0, 1.", fig: { kind: "trace", title: "45 in binary: repeated division by 2", cols: ["Number", "÷ 2 gives", "Remainder"], rows: [{ cells: [45, 22, 1] }, { cells: [22, 11, 0] }, { cells: [11, 5, 1] }, { cells: [5, 2, 1] }, { cells: [2, 1, 0] }, { cells: [1, 0, 1], tone: "ok", note: "read the last column upward: 1 0 1 1 0 1" }] } },
    { type: "figure", id: "c0-f5", caption: "Cut the bits into groups of four from the right. Each group is one hex digit.", alt: "Four frames: the byte 10110110 split into the nibbles 1011 and 0110, which are B and 6.", fig: { kind: "frames", title: "10110110 in hexadecimal", frames: [
      { caption: "The byte 10110110, split into two groups of four bits (called nibbles).", fig: { kind: "bits", group: 4, rows: [{ label: "binary", bits: "10110110" }, { label: "left group", bits: "1011", tone: "dim", value: "?" }, { label: "right group", bits: "0110", tone: "dim", value: "?" }] } },
      { caption: "The left group 1011 is 8 + 2 + 1 = 11, which is the hex digit B.", fig: { kind: "bits", group: 4, rows: [{ label: "binary", bits: "10110110", hl: [0, 1, 2, 3] }, { label: "left group", bits: "1011", tone: "ok", value: "B" }, { label: "right group", bits: "0110", tone: "dim", value: "?" }] } },
      { caption: "The right group 0110 is 4 + 2 = 6, which is the hex digit 6.", fig: { kind: "bits", group: 4, rows: [{ label: "binary", bits: "10110110", hl: [4, 5, 6, 7] }, { label: "left group", bits: "1011", tone: "ok", value: "B" }, { label: "right group", bits: "0110", tone: "ok", value: "6" }] } },
      { caption: "Written together: 10110110 is 0xB6, and in decimal 11 × 16 + 6 = 182.", fig: { kind: "bits", group: 4, rows: [{ label: "binary", bits: "10110110", tone: "ok" }, { label: "left group", bits: "1011", tone: "ok", value: "B" }, { label: "right group", bits: "0110", tone: "ok", value: "6" }] } },
    ] } },
    { type: "figure", id: "c0-f6", caption: "The path of a C program. The compiler and the linker run before the program starts; the loader and the CPU run it.", alt: "Six frames along the chain source.c, compiler, program.o, linker, program.exe, loader, running.", fig: { kind: "frames", title: "source.c to running program", frames: [
      { caption: "You write the source code, a text file, on the disk.", fig: { kind: "strip", items: [{ label: "source.c", sub: "text", state: "now" }, { label: "compiler", state: "todo" }, { label: "program.o", sub: "object code", state: "todo" }, { label: "linker", state: "todo" }, { label: "program.exe", sub: "executable", state: "todo" }, { label: "loader", state: "todo" }, { label: "running", sub: "in RAM", state: "todo" }] } },
      { caption: "The compiler checks the language and translates the code into machine instructions.", fig: { kind: "strip", items: [{ label: "source.c", sub: "text", state: "done" }, { label: "compiler", state: "now" }, { label: "program.o", sub: "object code", state: "todo" }, { label: "linker", state: "todo" }, { label: "program.exe", sub: "executable", state: "todo" }, { label: "loader", state: "todo" }, { label: "running", sub: "in RAM", state: "todo" }] } },
      { caption: "The result is object code, a file of machine instructions with some names still unresolved.", fig: { kind: "strip", items: [{ label: "source.c", sub: "text", state: "done" }, { label: "compiler", state: "done" }, { label: "program.o", sub: "object code", state: "now" }, { label: "linker", state: "todo" }, { label: "program.exe", sub: "executable", state: "todo" }, { label: "loader", state: "todo" }, { label: "running", sub: "in RAM", state: "todo" }] } },
      { caption: "The linker joins it with the ready-made code your program calls, such as printf.", fig: { kind: "strip", items: [{ label: "source.c", sub: "text", state: "done" }, { label: "compiler", state: "done" }, { label: "program.o", sub: "object code", state: "done" }, { label: "linker", state: "now" }, { label: "program.exe", sub: "executable", state: "todo" }, { label: "loader", state: "todo" }, { label: "running", sub: "in RAM", state: "todo" }] } },
      { caption: "The executable is a complete program, saved on the disk.", fig: { kind: "strip", items: [{ label: "source.c", sub: "text", state: "done" }, { label: "compiler", state: "done" }, { label: "program.o", sub: "object code", state: "done" }, { label: "linker", state: "done" }, { label: "program.exe", sub: "executable", state: "now" }, { label: "loader", state: "todo" }, { label: "running", sub: "in RAM", state: "todo" }] } },
      { caption: "When you run it, the loader copies it into RAM and the CPU starts. Run-time errors can only happen from here on.", fig: { kind: "strip", items: [{ label: "source.c", sub: "text", state: "done" }, { label: "compiler", state: "done" }, { label: "program.o", sub: "object code", state: "done" }, { label: "linker", state: "done" }, { label: "program.exe", sub: "executable", state: "done" }, { label: "loader", state: "done" }, { label: "running", sub: "in RAM", state: "now" }] } },
    ] } },

    { type: "example", id: "c0-e1", level: "easy", title: "Trace by hand: 45 to binary and back", file: "to_binary.txt", given: `45 / 2 = 22  remainder 1
22 / 2 = 11  remainder 0
11 / 2 = 5   remainder 1
5 / 2  = 2   remainder 1
2 / 2  = 1   remainder 0
1 / 2  = 0   remainder 1`, find: "45 in binary, and a check by converting back.", steps: [
      { say: "Read the remainders from the bottom up: 1, 0, 1, 1, 0, 1.", result: "101101" },
      { say: "Check backwards with place values 32, 16, 8, 4, 2, 1: 32 + 0 + 8 + 4 + 0 + 1.", result: "45" },
    ], answer: "45 = 101101 in binary (and 2D in hex, 55 in octal).", check: "The program in section 0.3 prints 45 as 2d in hex and 55 in octal." },
    { type: "example", id: "c0-e2", level: "easy", title: "Trace by hand: binary to hex and to decimal", file: "to_hex.txt", given: `10110110  to hexadecimal
0x2F      to decimal`, find: "Both conversions.", steps: [
      { say: "Cut 10110110 into groups of four from the right: 1011 and 0110.", result: "1011 | 0110" },
      { say: "1011 is 11, hex B; 0110 is 6.", result: "0xB6" },
      { say: "For 0x2F: 2 is in the sixteens place and F is 15. So 2 × 16 + 15.", result: "47" },
    ], answer: "10110110 is 0xB6 (decimal 182); 0x2F is 47.", check: "The program in section 0.3 prints 0x2F as 47 and 0xB6 as 182." },
    { type: "example", id: "c0-e3", level: "easy", title: "Trace by hand: hexadecimal 1A3 to decimal", file: "hex_to_decimal.txt", given: `0x1A3   digits: 1  A  3
A means ten`, find: "The decimal value.", steps: [
      { say: "The place values from the left are 256, 16 and 1.", result: "256, 16, 1" },
      { say: "1 × 256 + 10 × 16 + 3 × 1.", result: "256 + 160 + 3" },
    ], answer: "419", check: "Convert back: 419 / 16 = 26 remainder 3; 26 / 16 = 1 remainder 10 (A); 1. So 1A3." },
    { type: "example", id: "c0-e4", level: "gate", title: "GATE CS 2017 (afternoon), Q23 · 1 mark · MCQ (Digital Logic)", file: "gate2017_q23.txt", given: `The 16-bit unsigned integer X is BCA9 in hexadecimal.
Its value in octal is:
(A) 571244    (B) 736251    (C) 571247    (D) 136251`, find: "The octal representation of X.", steps: [
      { say: "Write each hex digit as four bits: B = 1011, C = 1100, A = 1010, 9 = 1001.", result: "1011 1100 1010 1001" },
      { say: "Join the 16 bits and cut them into groups of three from the right. The leftmost group has one bit, so pad it with two zeros.", result: "001 011 110 010 101 001" },
      { say: "Read each group of three bits as one octal digit.", result: "1 3 6 2 5 1" },
    ], answer: "(D) 136251", check: "Official answer (D). 0xBCA9 is 48297 in decimal, and 48297 is 136251 in octal." },

    { type: "trap", wrong: "1 KB is 1000 bytes.", tempting: "Kilo means a thousand in every other subject.", whyWrong: "Memory is counted in powers of two, because an address of n bits reaches 2ⁿ bytes. So 1 KB is 2¹⁰ = 1024 bytes.", rule: "In memory, 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB." },
    { type: "trap", wrong: "To write 45 in binary, read the remainders from top to bottom.", tempting: "That is the order in which the remainders came out.", whyWrong: "The first remainder is the last bit (the ones place), so the order is reversed. Reading from the top writes the bits backwards: for 22 the correct answer 10110 would come out as 01101, which is 13.", rule: "Repeated division: read the remainders from the bottom up." },
    { type: "trap", wrong: "One hex digit stands for three bits.", tempting: "Octal uses three bits, and hex looks similar.", whyWrong: "Hex has sixteen digits, and sixteen is 2⁴, so a hex digit stands for four bits. Three bits belong to octal.", rule: "Hex: groups of 4 bits. Octal: groups of 3 bits." },
    { type: "trap", wrong: "A program that compiles is correct.", tempting: "No error message appeared, so the compiler seems to have approved it.", whyWrong: "The compiler only checks the rules of the language. It cannot see a division by zero that happens with certain input, or a formula that is wrong. Those appear when the program runs, or never as a message at all.", rule: "Compiling proves the grammar is right, nothing more." },
    { type: "trap", wrong: "010 in a C program is ten.", tempting: "A leading zero looks harmless, like in 010 for a date.", whyWrong: "In C a number that starts with 0 is written in octal, so 010 is 8 and 012 is 10.", rule: "No leading zeros on decimal numbers in C." },
    { type: "gate", text: "Conversions and counting bytes: (1) between binary, octal and hex, usually under Digital Logic, as in 2017 Q23 above; (2) number of bytes or bits an address can reach; (3) the sizes of the C types, which come back in chapters 2 and 14. No frequency is claimed; the questions are short and easy to get right, which is why they are worth getting right." },
    { type: "recall", cards: [
      { q: "What does RAM do that the disk does not?", a: "It is fast, and holds what the running program is using now." },
      { q: "How many values can a byte hold?", a: "256 (0 to 255)." },
      { q: "What is an address?", a: "The number of a byte in memory, counting from 0." },
      { q: "How many bytes can n address bits reach?", a: "2ⁿ." },
      { q: "How many bits is one hex digit? One octal digit?", a: "4 and 3." },
      { q: "In which order do you read remainders when converting to binary?", a: "From the bottom up." },
      { q: "What is 1 KB in bytes?", a: "1024." },
      { q: "What does the linker do?", a: "Joins your object code with the library code your program uses, making the executable." },
      { q: "Does the compiler find a division by zero?", a: "No: it happens at run time." },
      { q: "What is 010 in C?", a: "Octal, so 8." },
    ] },
    { type: "check", questions: [
      { id: "z1", kind: "NAT", marks: 1, q: "What is the decimal value of the binary number 100110?", answer: "38", solution: "32 + 4 + 2 = 38." },
      { id: "z2", kind: "NAT", marks: 1, q: "What is the decimal value of the hexadecimal number 3C?", answer: "60", solution: "3 × 16 + 12 = 60." },
      { id: "z3", kind: "MCQ", marks: 1, q: "How many bytes can a 12-bit address reach?", options: ["1024", "2048", "4096", "12 000"], answer: "C", solution: "2¹² = 4096." },
      { id: "z4", kind: "NAT", marks: 1, q: "What is the decimal value of the octal number 157?", answer: "111", solution: "1 × 64 + 5 × 8 + 7 = 111." },
      { id: "z5", kind: "NAT", marks: 2, q: "A computer has a 16-bit address and is byte-addressable. What is the memory size in KB?", answer: "64", solution: "2¹⁶ bytes = 65 536 bytes = 64 KB." },
      { id: "z6", kind: "MCQ", marks: 2, q: "What is the hexadecimal representation of the decimal number 200?", options: ["B8", "C8", "D0", "C4"], answer: "B", solution: "200 = 12 × 16 + 8, and 12 is C, so C8." },
      { id: "z7", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["One hex digit is four bits", "The compiler finds every run-time error", "1 KB is 1024 bytes", "The loader copies the executable into RAM"], answer: "A, C, D", solution: "B is false: run-time errors, such as division by zero, appear only when the program runs." },
      { id: "z8", kind: "NAT", marks: 2, q: "How many different values can 10 bits represent?", answer: "1024", solution: "2¹⁰ = 1024." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on number systems", sub: "Digital Logic", href: "/topics/digital-logic" }, { label: "The whole Programming in C book", sub: "next: your first program", href: "/study/c-programming" }] },
    { type: "links", prereq: [], usedIn: ["Your first program (C1)", "Variables and data types (C2)", "Pointers I: memory and addresses (C10)"], cross: ["Digital Logic: number systems", "Computer Organisation: memory addressing"] },
  ],
};
