import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 18 "Files, errors and variable arguments" (28 Nov 2026). Priority LATER in 07-PDS-BOOK-CONTENTS.md: no question of this bank is tagged to it, so the chapter
 * teaches the core ideas that an output question could use and claims no GATE question. Programs that use files use tmpfile() (a throw-away file) so that running them
 * leaves nothing behind. Every program was compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC18: Topic = {
  id: "cs.pds.c.files18",
  title: "Files, errors and variable arguments",
  no: "18",
  book: [
    { t: "p", text: "Everything so far read from the keyboard and wrote to the screen, and everything vanished when the program ended. A **file** keeps data on the disk (chapter 0), after the program has stopped. This chapter covers the standard way to read and write files in C, how to tell when something has gone wrong, and a feature that `printf` itself uses: functions that take a **variable number of arguments**." },
    { t: "p", text: "No question of the GATE bank is tagged to this chapter, so it is shorter than the others and does not claim any. The ideas are small and exact, and a few details, such as how to detect the end of a file, are the sort of thing that an output question could build on." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["open, read, write and close a file with `fopen`, `fprintf`, `fscanf`, `fgets` and `fclose`;", "check whether an operation succeeded, and why `while (!feof(f))` is the wrong loop;", "say what `EOF` is and what `getchar` and `fgetc` return;", "write a function with a variable number of arguments using `<stdarg.h>`;", "say what a text file and a binary file are."] },

    { t: "h2", text: "Streams and FILE" },
    { t: "p", text: "C treats every source or sink of data as a **stream**: a sequence of characters to read or write. The keyboard is the stream `stdin`, the screen is `stdout` and the error screen is `stderr`; `printf` is just `fprintf(stdout, …)`. A file you open becomes a stream too, and you refer to it by a pointer of type `FILE *`." },
    { t: "table", head: ["Stream", "What it is", "Functions that use it by default"], rows: [["`stdin`", "standard input (the keyboard)", "`scanf`, `getchar`, `gets`"], ["`stdout`", "standard output (the screen)", "`printf`, `putchar`, `puts`"], ["`stderr`", "standard error (the screen, unbuffered)", "`perror`, `fprintf(stderr, …)`"], ["a `FILE *`", "a file you opened", "`fscanf`, `fprintf`, `fgets`, `fputs`, `fgetc`, `fputc`"]] },
    { t: "callout", kind: "key", text: "`printf(\"…\")` is `fprintf(stdout, \"…\")` and `scanf(\"…\")` is `fscanf(stdin, \"…\")`. The `f` versions take the stream as their first argument." },

    { t: "h2", text: "Opening and closing" },
    { t: "p", text: "`fopen(name, mode)` opens a file and returns a `FILE *`, or `NULL` if it could not. The mode is a short string that says what you intend: `\"r\"` to read (the file must exist), `\"w\"` to write (it is created, or **emptied** if it exists), `\"a\"` to append to the end. `fclose(f)` finishes writing and releases the file; a program that forgets it may lose data." },
    { t: "table", head: ["Mode", "Meaning", "If the file does not exist", "If it exists"], rows: [["`\"r\"`", "read", "fopen fails (NULL)", "read from the start"], ["`\"w\"`", "write", "created", "emptied first"], ["`\"a\"`", "append", "created", "writes go to the end"], ["`\"r+\"`", "read and write", "fopen fails", "keeps the contents"]], caption: "Add b (\"rb\", \"wb\") for a binary file; on some systems the difference matters." },
    { t: "p", text: "**Always test the result of `fopen`.** A `NULL` means the file could not be opened (it does not exist, or you may not read it), and using it would crash the program." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    FILE *f = fopen("no_such_file_c18.txt", "r");
    if (f == NULL)
        printf("cannot open\\n");
    else
        fclose(f);
    return 0;
}`, out: "cannot open", file: "fopen_fail.c" },
    { t: "trap", i: 0 },
    { t: "p", text: "Every file you open should be closed. The operating system lets a program have only a limited number of files open at once, and data written with `fprintf` may sit in a memory buffer until the file is closed or flushed with `fflush(f)`. If the program ends in a crash before `fclose`, the last part of the output can be lost." },

    { t: "h2", text: "Reading and writing text" },
    { t: "p", text: "`fprintf(f, …)` writes formatted text into a file exactly as `printf` does onto the screen, and `fscanf(f, …)` reads it back as `scanf` does from the keyboard. Like `scanf`, `fscanf` returns the number of values it **read**, which is 1 or more on success and `EOF` (usually −1) or 0 when nothing could be read. The loop `while (fscanf(f, \"%d\", &x) == 1)` therefore reads every integer in a file and stops cleanly." },
    { t: "fig", id: "c18-f1" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    FILE *f = tmpfile();              /* a throw-away file */
    fprintf(f, "10 20 30\\n");         /* write three numbers */
    rewind(f);                        /* back to the start */
    int x, s = 0;
    while (fscanf(f, "%d", &x) == 1)  /* stop when nothing is read */
        s += x;
    printf("%d\\n", s);
    fclose(f);
    return 0;
}`, out: "60", file: "file_sum.c" },
    { t: "p", text: "For whole lines use `fgets(buffer, size, f)`: it reads up to `size - 1` characters or to the end of the line, keeps the newline, adds the null, and returns `NULL` at the end of the file. For single characters use `fgetc` and `fputc`, which return an `int` so that the special value `EOF` can be told apart from every real character." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    FILE *f = tmpfile();
    fputs("one\\ntwo\\nthree\\n", f);
    rewind(f);
    char line[20];
    int n = 0;
    while (fgets(line, sizeof line, f))   /* NULL at the end */
        n++;
    printf("%d\\n", n);
    fclose(f);
    return 0;
}`, out: "3", file: "file_lines.c" },

    { t: "h2", text: "The end of a file" },
    { t: "p", text: "`EOF` is a negative constant, usually −1, that the input functions return when there is nothing more to read. It is returned as an **int**, never as a `char`, because a `char` cannot hold both −1 and every character code: reading into a `char` and comparing with `EOF` is a classic bug. The correct loop for characters is `while ((c = fgetc(f)) != EOF)` with `int c`." },
    { t: "p", text: "The function `feof(f)` tells you whether the end of the file has **already been reached by a read**. It is not a way to ask 'is there more?' before reading, and a loop `while (!feof(f))` that reads inside it runs **one time too many**: after the last value has been read, the end has not yet been noticed, so the loop goes round again, the read fails, and the old value is used a second time." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    FILE *f = tmpfile();
    fprintf(f, "1 2 3\\n");
    rewind(f);
    int x = 0;
    while (!feof(f)) {            /* wrong loop */
        fscanf(f, "%d", &x);
        printf("%d ", x);
    }
    printf("\\n");
    fclose(f);
    return 0;
}`, out: "1 2 3 3", file: "feof_trap.c" },
    { t: "p", text: "The file holds `1 2 3` and a newline. After `fscanf` reads the 3, the newline is still unread, so `feof` is still false and the loop runs again. That time `fscanf` finds nothing, returns without changing `x`, and the 3 is printed twice. The cure is to test the **return value** of the read, as in the sum program above." },
    { t: "trap", i: 1 },
    { t: "p", text: "Two more functions are worth knowing. `rewind(f)` moves the reading position back to the start of the file, as the programs above use after writing. And `fseek(f, offset, SEEK_SET)` moves it to a chosen byte, which is how a program jumps to a record in a binary file without reading everything before it; `ftell(f)` reports the current position." },

    { t: "h2", text: "Text and binary files" },
    { t: "p", text: "A **text file** holds characters, with lines ended by a newline. `fprintf` writes the number 100 as the three characters `1`, `0`, `0`. A **binary file** holds the bytes of values exactly as they are in memory: `fwrite(a, sizeof(int), 3, f)` writes the twelve bytes of three `int`s, and `fread` reads them back. Binary files are smaller and faster for numbers, but only the same kind of machine can read them back reliably, and a person cannot read them in an editor." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    FILE *f = tmpfile();
    int a[3] = {1, 2, 3};
    fwrite(a, sizeof(int), 3, f);          /* 12 bytes, as in memory */
    rewind(f);
    int b[3];
    size_t k = fread(b, sizeof(int), 3, f); /* how many items were read */
    printf("%zu %d\\n", k, b[2]);
    fclose(f);
    return 0;
}`, out: "3 3", file: "binary_file.c" },
    { t: "p", text: "`fread` and `fwrite` return the **number of items** transferred, not the number of bytes. A result smaller than requested means the end of the file or an error." },

    { t: "h2", text: "When something goes wrong" },
    { t: "p", text: "Most library functions signal failure by their return value: `fopen` returns `NULL`, `malloc` returns `NULL`, `scanf` and `fscanf` return fewer items than expected, and the character functions return `EOF`. A robust program tests these and stops or recovers. The standard header `<errno.h>` also gives the variable `errno`, set to a code that says why the last call failed, and `perror(\"text\")` prints your text followed by the matching message on `stderr`." },
    { t: "callout", kind: "tip", text: "Make it a habit: after `fopen`, `malloc` or `scanf`, check the result before you use anything it gave you. Most 'it crashed on someone else's computer' failures are an unchecked `NULL`." },
    { t: "p", text: "Error messages should go to `stderr`, not `stdout`: then they appear on the screen even when the normal output is sent to a file or a pipe. `exit(code)` ends the program at once; by convention a code of 0 means success and anything else means failure, which is why `main` returns 0 at the end." },

    { t: "h2", text: "Variable numbers of arguments" },
    { t: "p", text: "`printf` takes a format and then **any number** of further arguments. You can write such functions yourself with the header `<stdarg.h>`. The definition has at least one fixed parameter and then `...`: `int sum(int n, ...)`. Inside, a `va_list` walks the extra arguments: `va_start` begins at the fixed parameter, each `va_arg(ap, type)` takes the next argument **as that type**, and `va_end` finishes." },
    { t: "fig", id: "c18-f2" },
    { t: "code", text: `#include <stdio.h>
#include <stdarg.h>

int sum(int n, ...) {              /* n says how many numbers follow */
    va_list ap;
    va_start(ap, n);
    int s = 0;
    for (int i = 0; i < n; i++)
        s += va_arg(ap, int);      /* take the next argument as an int */
    va_end(ap);
    return s;
}

int main(void) {
    printf("%d %d\\n", sum(3, 1, 2, 3), sum(0));
    return 0;
}`, out: "6 0", file: "variable_arguments.c" },
    { t: "p", text: "The function cannot find out how many arguments it was given, or their types, by itself: you must tell it, as `sum` does with `n`, or as `printf` does with the format string. If the format says `%d` and you pass a `double`, `printf` reads the wrong bytes, and the output is rubbish." },
    { t: "trap", i: 2 },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "No question of this bank is on files, errors or variable arguments. The ideas that could appear in an output question are the ones with an exact answer: what the loop `while (!feof(f))` prints (one extra copy of the last value), what `fscanf` and `fread` return, that `EOF` is an `int`, and that a variable-argument function depends on the caller to describe its arguments." },
    { t: "ex", id: "c18-e1" },
    { t: "ex", id: "c18-e2" },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A file is used through a `FILE *`; `stdin`, `stdout` and `stderr` are the standard streams, and `printf` is `fprintf(stdout, …)`.", "`fopen(name, mode)` returns NULL on failure: always test it. Mode \"w\" empties an existing file.", "`fscanf` returns the number of items read; loop on that, not on `feof`. `fgets` returns NULL at the end.", "`EOF` is an int (usually −1): use an `int` variable for characters.", "Text files hold characters; binary files hold the bytes of values (`fwrite`, `fread`, which return item counts).", "Check results, report errors on `stderr`; variable-argument functions use `<stdarg.h>` and need the caller to describe the arguments."] },
  ],
  blocks: [
    { type: "figure", id: "c18-f1", caption: "Reading ints with fscanf. The loop stops when fscanf returns something other than 1, because nothing was read.", alt: "A table of fscanf calls on the file 10 20 30 with the value read, the return value and the running sum.", fig: { kind: "trace", title: "while (fscanf(f, \"%d\", &x) == 1) s += x;   file: 10 20 30", cols: ["Call", "x", "fscanf returns", "s"], rows: [{ cells: [1, 10, 1, 10] }, { cells: [2, 20, 1, 30] }, { cells: [3, 30, 1, 60] }, { cells: [4, "unchanged", "EOF (not 1)", "loop ends"], tone: "ok" }] } },
    { type: "figure", id: "c18-f2", caption: "sum(3, 1, 2, 3): the fixed parameter n says how many extra arguments to take. Each va_arg takes the next one.", alt: "A table of the va_arg calls for sum(3, 1, 2, 3) and the running total.", fig: { kind: "trace", title: "int sum(int n, ...) called as sum(3, 1, 2, 3)", cols: ["Pass", "va_arg(ap, int)", "s"], rows: [{ cells: [1, 1, 1] }, { cells: [2, 2, 3] }, { cells: [3, 3, 6], tone: "ok" }] } },

    { type: "example", id: "c18-e1", level: "gate", title: "The extra read of while (!feof(f))", file: "feof_trace.c", given: `#include <stdio.h>

int main(void) {
    FILE *f = tmpfile();
    fprintf(f, "1 2 3\\n");
    rewind(f);
    int x = 0;
    while (!feof(f)) {
        fscanf(f, "%d", &x);
        printf("%d ", x);
    }
    return 0;
}`, find: "The output.", steps: [
      { say: "The file holds 1 2 3 and a newline. Each pass reads one number and prints it: 1, then 2, then 3.", result: "1 2 3" },
      { say: "After reading 3 the newline is still unread, so feof is still false and the loop goes round again.", result: "one more pass" },
      { say: "fscanf now finds nothing, leaves x as 3, and sets the end-of-file flag. 3 is printed again. Then feof is true.", result: "3 again" },
    ], answer: "1 2 3 3", check: "The program was compiled and run." },
    { type: "example", id: "c18-e2", level: "easy", title: "A function with a variable number of arguments", file: "variable_trace.c", given: `#include <stdio.h>
#include <stdarg.h>

int sum(int n, ...) {
    va_list ap;
    va_start(ap, n);
    int s = 0;
    for (int i = 0; i < n; i++)
        s += va_arg(ap, int);
    va_end(ap);
    return s;
}

int main(void) {
    printf("%d %d", sum(3, 1, 2, 3), sum(0));
    return 0;
}`, find: "The output.", steps: [
      { say: "sum(3, 1, 2, 3): n is 3, so three int arguments are taken: 1, 2, 3.", result: "s = 6" },
      { say: "sum(0): n is 0, so no argument is taken and the loop does not run.", result: "s = 0" },
    ], answer: "6 0", check: "The program was compiled and run." },

    { type: "trap", wrong: "fopen always returns a usable FILE *.", tempting: "It returns a pointer, and pointers seem to be valid addresses.", whyWrong: "On failure (a missing file, no permission) fopen returns NULL. Using it crashes the program.", rule: "Test the result of fopen before use.", ex: { code: "FILE *f = fopen(\"no_such_file_c18.txt\", \"r\");\nif (f == NULL) printf(\"cannot open\");", out: "cannot open" } },
    { type: "trap", wrong: "while (!feof(f)) is the way to read until the end of a file.", tempting: "It reads like 'while not end of file'.", whyWrong: "feof becomes true only after a read has failed. The loop runs once more after the last value, and the last value is used twice.", rule: "Loop on the return value of the read, not on feof.", ex: { code: "while (!feof(f)) { fscanf(f, \"%d\", &x); printf(\"%d \", x); }", out: "1 2 3 3   (file: 1 2 3)" } },
    { type: "trap", wrong: "A variable-argument function knows how many arguments it was called with.", tempting: "printf seems to know.", whyWrong: "It does not. printf reads the format string, which tells it. A function of your own needs a count or an end marker in its fixed arguments.", rule: "The caller must describe the extra arguments.", ex: { text: "sum(3, 1, 2, 3) works because n = 3 says three follow. sum(5, 1, 2, 3) would read two more values from nowhere: undefined behaviour." } },
    { type: "recall", cards: [
      { q: "What does fopen return on failure?", a: "NULL." },
      { q: "What does mode \"w\" do to an existing file?", a: "It empties it." },
      { q: "What does fscanf return?", a: "The number of items read (EOF if nothing could be read)." },
      { q: "What type should the variable holding fgetc's result be?", a: "int, so that EOF can be told from every character." },
      { q: "Why is while (!feof(f)) wrong?", a: "feof is true only after a failed read, so the loop runs once too often." },
      { q: "What do fread and fwrite return?", a: "The number of items transferred." },
      { q: "Where should error messages go?", a: "stderr." },
      { q: "How does a function with ... know how many arguments there are?", a: "The caller tells it: a count or a format." },
    ] },
    { type: "check", questions: [
      { id: "v1", kind: "NAT", marks: 1, q: "A file holds 10 20 30. How many times does fscanf(f, \"%d\", &x) return 1 before it fails?", answer: "3", solution: "Once per number." },
      { id: "v2", kind: "MCQ", marks: 1, q: "What does fopen return if the file cannot be opened?", options: ["0 as an int", "NULL", "EOF", "-1"], answer: "B", solution: "A null FILE pointer." },
      { id: "v3", kind: "NAT", marks: 1, q: "int sum(int n, ...) adds n int arguments. What is sum(4, 1, 2, 3, 4)?", answer: "10", solution: "1 + 2 + 3 + 4." },
      { id: "v4", kind: "NAT", marks: 2, q: "A file holds 1 2 3 and a newline. while (!feof(f)) { fscanf(f, \"%d\", &x); printf(\"%d \", x); } How many numbers are printed?", answer: "4", solution: "1, 2, 3 and the last value again." },
      { id: "v5", kind: "MCQ", marks: 1, q: "EOF should be stored in a variable of type:", options: ["char", "int", "unsigned char", "any of these"], answer: "B", solution: "An int can hold EOF and every character code." },
      { id: "v6", kind: "MSQ", marks: 2, q: "Which are true?", options: ["fopen with \"w\" empties an existing file", "feof(f) tells you before reading whether more data remains", "fread returns the number of items read", "printf is fprintf(stdout, ...)"], answer: "A, C, D", solution: "B is false." },
      { id: "v7", kind: "NAT", marks: 2, q: "A file has the three lines one, two, three. How many times does fgets(line, 20, f) return non-NULL?", answer: "3", solution: "Once per line." },
      { id: "v8", kind: "NAT", marks: 2, q: "int a[3] = {1, 2, 3}; fwrite(a, sizeof(int), 3, f); with 4-byte ints. How many bytes are written?", answer: "12", solution: "3 × 4." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on C programs", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: the output-prediction method", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Functions (C6)", "Strings (C12)", "Dynamic memory (C15)"], usedIn: ["Output prediction (C20)"], cross: ["Operating systems: file systems"] },
  ],
};
