import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 12 "Strings" (28 Nov 2026). Real GATE questions explained in full: 2025_AN_Q19 (copy with overlap), 2024_AN_Q19 (length by pointer difference, MSQ),
 * 2017_AN_Q49 (strlen of c + 2[p] - 6[p] - 1). Every program was compiled and run with gcc (scripts/chapter-check.ts); the function fx of 2024_AN_Q19
 * has no main in the question and was run inside a test program.
 */
export const chapterC12: Topic = {
  id: "cs.pds.c.strings12",
  title: "Strings",
  no: "12",
  book: [
    { t: "p", text: "C has no string type. A **string** is just an array of characters whose last element is the special character `'\\0'`, the null character (code 0). Everything that works on strings, `printf(\"%s\")`, `strlen`, `strcpy`, your own loops, knows where the string ends by looking for that zero. Once you see a string as an array of `char` and a pointer that walks along it, string questions in GATE become pointer questions you already know how to solve." },
    { t: "p", text: "This chapter shows how a string sits in memory, the two ways to make one (an array and a pointer to a literal) and the difference between them, the library functions and their exact behaviour, the loops that copy and measure strings with pointers, and the one subtle fact behind most string traps: the terminating zero is a real character with a real place in memory. Three real GATE questions are explained in full." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["draw a string with its terminating `'\\0'` and say what `sizeof` and `strlen` give for it;", "tell `char s[] = \"…\"` from `char *p = \"…\"` and say which can be changed;", "predict the result of `strlen`, `strcpy`, `strcat` and `strcmp`;", "trace a loop such as `while (*t) *s++ = *t++;` and say what remains in the destination;", "evaluate expressions such as `c + 2[p] - 6[p] - 1` on a string."] },

    { t: "h2", text: "A string is a character array with a zero at the end" },
    { t: "p", text: "The string \"hi\" has **three** characters in memory: `'h'`, `'i'` and the null character `'\\0'`. The null is not shown when you print the string, and it is not counted by `strlen`, but it occupies a byte, and any array that holds the string must have room for it." },
    { t: "fig", id: "c12-f1" },
    { t: "p", text: "`strlen(s)` counts the characters **before** the null: 2 for \"hi\". `sizeof(s)` is the size of the whole array, which is 10 if you wrote `char s[10] = \"hi\";`, and 3 if you wrote `char s[] = \"hi\";`, where the compiler sized the array to fit the string with its null." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s[10] = "hi";
    char t[] = "abc";
    printf("%zu %zu\\n", sizeof s, strlen(s));
    printf("%zu %zu %d %d\\n", sizeof t, strlen(t), t[3], t[2]);
    return 0;
}`, out: "10 2\n4 3 0 99", file: "string_sizes.c" },
    { t: "callout", kind: "key", text: "A string of n characters needs an array of at least n + 1 bytes. `strlen` stops at the first `'\\0'`; `sizeof` of an array does not care about it." },
    { t: "p", text: "The null character stops the string wherever it is. In the array `\"ab\\0cd\"` the characters after the `'\\0'` are still in the array, but `strlen` and `printf(\"%s\")` stop at the first zero, so the string is only \"ab\"." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    char s[] = "ab\\0cd";
    printf("%zu %zu\\n", strlen(s), sizeof s);
    return 0;
}`, out: "2 6", file: "embedded_null.c" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Two ways to make a string" },
    { t: "h3", text: "A character array" },
    { t: "p", text: "`char s[] = \"hello\";` makes an array of six `char` boxes in your own memory and **copies** the characters into it. The array is yours: you can change its elements, `s[0] = 'J';` turns the string into \"Jello\"." },
    { t: "h3", text: "A pointer to a string literal" },
    { t: "p", text: "`char *p = \"hello\";` does something different. The string \"hello\" is a **string literal**: it is stored once, in a read-only part of memory, and `p` is only a pointer that holds its address. You may read through `p`, but changing the characters is **undefined behaviour** and usually crashes." },
    { t: "table", head: ["", "`char s[] = \"hello\";`", "`char *p = \"hello\";`"], rows: [["what it is", "an array of 6 chars", "a pointer to a literal"], ["`sizeof`", "6", "8 on a 64-bit machine (the size of a pointer)"], ["`strlen`", "5", "5"], ["may you change characters?", "yes", "no (undefined behaviour)"], ["may you move it (`s++`, `p++`)?", "no: an array name is not a variable", "yes: p is a variable"]] },
    { t: "callout", kind: "tip", text: "If you need to modify the text, use an array. Use `const char *p = \"…\"` for a pointer to a literal, so that the compiler stops you from writing through it." },
    { t: "trap", i: 1 },

    { t: "h2", text: "The string library" },
    { t: "p", text: "The header `<string.h>` has the standard functions. Four are enough for most questions. Each one relies on the null terminator, both to know where its input ends and, for `strcpy` and `strcat`, to write one at the end of its output." },
    { t: "table", head: ["Function", "What it does", "Returns"], rows: [["`strlen(s)`", "counts characters before the null", "the length, as an unsigned number (size_t)"], ["`strcpy(d, s)`", "copies s, including its null, into d", "d"], ["`strcat(d, s)`", "copies s onto the end of d (overwriting d's null)", "d"], ["`strcmp(a, b)`", "compares character by character", "negative, 0 or positive"]] },
    { t: "p", text: "`strcmp(a, b)` returns a negative number if `a` comes before `b` in dictionary (ASCII) order, 0 if they are equal, and a positive number if `a` comes after. It does **not** return 1 or −1; only the **sign** is promised. `strcpy` and `strcat` need the destination array to be big enough for the whole result including the null; they do not check." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    char d[20] = "ab";
    strcat(d, "cd");
    printf("%s %zu\\n", d, strlen(d));
    printf("%d %d %d\\n", strcmp("abc", "abd") < 0, strcmp("abc", "abc") == 0, strcmp("b", "a") > 0);
    return 0;
}`, out: "abcd 4\n1 1 1", file: "string_library.c" },
    { t: "callout", kind: "warning", text: "`strlen` returns an **unsigned** number. The expression `strlen(s) - strlen(t)` can never be negative; if t is longer it wraps to a huge number (chapter 2)." },

    { t: "h2", text: "Walking a string with a pointer" },
    { t: "p", text: "Since a string ends with a zero and zero is false, a loop can run **until the end of a string** without knowing its length: `while (*p)` is true as long as the character `p` points at is not the null. A pointer that moves along with `p++` visits every character." },
    { t: "code", text: `#include <stdio.h>

int fx(char *a) {
    char *b = a;
    while (*b)          /* stop at the null */
        b++;
    return b - a;       /* elements between: the length */
}

int main(void) {
    printf("%d %d %d\\n", fx("abcd"), fx(""), fx("hello world"));
    return 0;
}`, out: "4 0 11", file: "length_by_pointer.c" },
    { t: "p", text: "This is `strlen` written in three lines. The pointer `b` starts at the first character and stops at the null, and the pointer difference `b - a` (chapter 11) is the number of characters between, because `char` is one byte." },
    { t: "p", text: "The same idea copies a string. The line `*s++ = *t++;` means: copy the character `t` points at into the place `s` points at, then move both pointers on by one. Using the character itself as the loop condition combines the copy and the test: `while ((*s++ = *t++));` copies up to and **including** the null, because the value of the assignment is the copied character, and it is zero at the null." },
    { t: "code", text: `#include <stdio.h>

void copyz(char *s, char *t) {
    while ((*s++ = *t++))     /* copy; stop after copying the null */
        ;
}

int main(void) {
    char a[20];
    copyz(a, "hello");
    printf("%s\\n", a);
    return 0;
}`, out: "hello", file: "copy_with_null.c" },
    { t: "callout", kind: "shortcut", text: "For a loop over a string with a pointer: the pointer is the position, `*p` is the character, and the loop ends when `*p` is the null. After the loop, the pointer points at the null, so `p - start` is the length." },
    { t: "trap", i: 2 },

    { t: "h2", text: "Copying when the pieces overlap" },
    { t: "p", text: "If the source and destination of a copy are **parts of the same array**, the order of copying matters. Copying from the front with a forward loop is safe when the destination is **before** the source (we write places we have already read). Copying from `a + 2` to `a`, as in the question below, is exactly that case. But a copy loop that does **not** copy the null leaves the old end of the string untouched, and the string appears to have extra characters after the new end." },
    { t: "fig", id: "c12-f2" },
    { t: "callout", kind: "note", text: "The library function `memmove` copies correctly when the two regions overlap, and copies the null if you ask for one more byte; `strcpy` on overlapping strings is undefined." },
    { t: "trap", i: 3 },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2025 (afternoon), Q19: copying a string onto itself" },
    { t: "p", text: "A one-mark multiple-choice question. A function copies a string starting from two characters in, back onto the front of the same array. Four options differ in what is left at the end." },
    { t: "ex", id: "c12-e1" },
    { t: "fig", id: "c12-f3" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "That the copy loop does **not** copy the terminating null, and that the old characters beyond the new end are still there. The array holds \"@#Hello World!\", fourteen characters. `stringcopy(a, a + 2)` copies from the 'H' at index 2 to the front, one character at a time, until `*t` is zero. That is twelve characters (`H e l l o   W o r l d !`), written to indexes 0 to 11. Indexes 12 and 13 keep their old values, `'d'` and `'!'`, and index 14 is still the original null. So the string now reads \"Hello World!d!\": option D." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option B, Hello World!.** The student assumes the copy writes a null at the new end, as `strcpy` does.", "**Option A or C.** The student thinks the copy shifts nothing, or removes the wrong number of characters.", "Not noticing that the loop stops when `*t` is the null, **before** it is copied."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["`while ((*s++ = *t++));` (copies the null)", "the null is copied at index 12, so the string ends there", "Hello World!"], ["`memmove(a, a + 2, strlen(a + 2) + 1)`", "copies the 12 characters and the null", "Hello World!"], ["`stringcopy(a, a + 3)`", "copies the 11 characters `ello World!` to indexes 0 to 10; indexes 11, 12 and 13 keep `l`, `d` and `!`", "ello World!ld!"]], caption: "All three were compiled and run." },

    { t: "h3", text: "GATE 2024 (afternoon), Q19: length by pointer difference" },
    { t: "p", text: "A one-mark question in which several statements about a function are to be marked true or false. The function finds the length of a string by walking a pointer to its end." },
    { t: "ex", id: "c12-e2" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Whether the function is correct and compiles for three ways of passing a string. It compiles (C is false). A string literal, an array initialised from a literal, and a pointer to a literal are all strings ending in a null, so the loop always stops, and the pointer difference is an `int`. So `fx(\"abcd\")`, `fx(c)` with an array and `fx(c)` with a pointer all always return a value, and statements A, B and D are true." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Marking only one of the three true statements: array and pointer are different things, but both work here.", "Thinking `b - a` is in bytes and the function does not compile or is wrong; it is the number of elements, and for `char` it equals the number of bytes.", "Ticking C, because the function mixes `int` and a pointer difference; the pointer difference converts to int without a problem."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Call", "Reasoning", "fx returns"], rows: [["`fx(\"abcd\")`", "four characters before the null", "4"], ["`fx(\"\")`", "the empty string: the first character is the null", "0"], ["`fx(c)` with `char c[] = \"hello world\"`", "eleven characters", "11"], ["a char array with no null, `char c[3] = {'a','b','c'}`", "the loop runs past the array: undefined", "no value is promised"]], caption: "The first three were compiled and run. The last is why the word *always* in the question matters." },

    { t: "h3", text: "GATE 2017 (afternoon), Q49: strlen of a computed address" },
    { t: "p", text: "A two-mark numerical question with an unusual expression: `c + 2[p] - 6[p] - 1`. It is a pointer plus some **characters** used as numbers, and then a `strlen` of the resulting address." },
    { t: "ex", id: "c12-e3" },
    { t: "fig", id: "c12-f4" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Three ideas together: `2[p]` is the same as `p[2]` (chapter 11), characters are small integers (chapter 2), and `c + n` moves a pointer by n characters. The string is \"GATECSIT2017\" and `p = c`. `p[2]` is `'T'` (code 84) and `p[6]` is `'I'` (code 73). So `2[p] - 6[p] - 1` is 84 − 73 − 1 = 10, and `c + 10` points at the eleventh character, the '1' of \"17\". The string from there is \"17\", of length 2." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Reading `2[p]` as an error, or as the number 2 times p.", "Using the wrong indexes: G is index 0, so the third letter T is `p[2]` and the seventh letter I is `p[6]`.", "Using the ASCII code of `'T'` or `'I'` wrongly (84 and 73); only the difference matters, and the difference of two letters is the same as the difference of their positions in the alphabet (T is 11 after I)."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Expression", "Value", "strlen of the result"], rows: [["`c + 2[p] - 6[p] - 1` (the question)", "c + 10", "2"], ["`c + 7[p] - 2[p]`", "T − T = 0, so c + 0", "12"], ["`c + 6[p] - 2[p] - 1`", "73 − 84 − 1 = −12, before the start: undefined", "undefined"]], caption: "The first row was compiled and run." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A string is a `char` array ending in `'\\0'`. `strlen` counts the characters before it; `sizeof` the whole array. A string of n characters needs n + 1 bytes.", "`char s[] = \"…\"` is a changeable array; `char *p = \"…\"` points at a read-only literal (do not write through it).", "`strcpy` and `strcat` write the null; a hand-written copy loop must copy it too, or the old tail remains.", "`while (*p)` walks to the end of a string; `b - a` then gives the length.", "`strlen` returns an unsigned number; `strcmp` gives only a sign.", "`2[p]` is `p[2]`; characters are small integers, so `'T' - 'I' - 1` is arithmetic."] },
  ],
  blocks: [
    { type: "figure", id: "c12-f1", caption: "char s[10] = \"hi\"; Three characters are used (h, i and the null); the other seven boxes are also zero. strlen is 2; sizeof is 10.", alt: "Ten char cells: h, i, then eight null characters shown as 0, with indexes 0 to 9.", fig: { kind: "array", title: "char s[10] = \"hi\";", data: [["h", "i", "\\0", "\\0", "\\0", "\\0", "\\0", "\\0", "\\0", "\\0"]], base: 1000, size: 1, index: true, tones: { "0,0": "hl", "0,1": "hl", "0,2": "ok" } } },
    { type: "figure", id: "c12-f2", caption: "Copying \"Hello World!\" from index 2 to index 0 without copying the null: the last two old characters, d and !, remain.", alt: "The array before and after the copy: @#Hello World! and then Hello World!d!.", fig: { kind: "frames", title: "stringcopy(a, a + 2)", frames: [
      { caption: "Before: a = \"@#Hello World!\" (14 characters, then the null).", fig: { kind: "array", data: [["@", "#", "H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d", "!", "\\0"]], index: true } },
      { caption: "After: the 12 characters from index 2 are copied to indexes 0 to 11. Indexes 12 and 13 still hold d and !, and the old null is at 14.", fig: { kind: "array", data: [["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d", "!", "d", "!", "\\0"]], index: true, tones: { "0,12": "bad", "0,13": "bad", "0,14": "dim" } } },
    ] } },
    { type: "figure", id: "c12-f3", caption: "GATE 2025 AN Q19: s writes at the front, t reads two places ahead. The loop stops when *t is the null, before it is copied.", alt: "A table of the steps of the copy: which index s writes and which t reads.", fig: { kind: "trace", title: "while (*t) *s++ = *t++;   s = a, t = a + 2", cols: ["Step", "t reads", "s writes at", "Array now begins"], rows: [{ cells: [1, "a[2] = H", "a[0]", "H # H e …"] }, { cells: [2, "a[3] = e", "a[1]", "H e H e …"] }, { cells: ["…", "…", "…", "…"] }, { cells: [12, "a[13] = !", "a[11]", "Hello World!d!"] }, { cells: [13, "a[14] = null: the test is false", "nothing written", "stop"], tone: "bad" }] } },
    { type: "figure", id: "c12-f4", caption: "GATE 2017 AN Q49: 2[p] is T (84), 6[p] is I (73). 84 − 73 − 1 = 10, so c + 10 points at the 1 of 17.", alt: "The string GATECSIT2017 with c plus 10 pointing at the 1 of 17.", fig: { kind: "array", title: "\"GATECSIT2017\", c + 10", data: [["G", "A", "T", "E", "C", "S", "I", "T", "2", "0", "1", "7"]], index: true, tones: { "0,2": "hl", "0,6": "hl", "0,10": "ok", "0,11": "ok" }, pointers: [{ name: "c + 10", at: [0, 10] }] } },

    { type: "example", id: "c12-e1", level: "gate", title: "GATE CS 2025 (afternoon), Q19 · 1 mark · MCQ", file: "gate2025_an_q19.c", given: `#include <stdio.h>

void stringcopy(char *, char *);

int main( ) {
    char a[30] = "@#Hello World!";
    stringcopy(a, a + 2);
    printf("%s\\n", a);
    return 0;
}

void stringcopy(char *s, char *t) {
    while(*t)
        *s++ = *t++;
}`, find: "The output. Options: (A) @#Hello World!  (B) Hello World!  (C) ello World!  (D) Hello World!d!", steps: [
      { say: "a has 14 characters, \"@#Hello World!\", then the null at index 14. t starts at a[2], the 'H'.", result: "t = a + 2" },
      { say: "The loop copies a[2], a[3], … a[13] to a[0], a[1], … a[11]: twelve characters, H e l l o space W o r l d !.", result: "indexes 0 to 11 rewritten" },
      { say: "It stops when *t is the null (t is at index 14), so no null is copied. Indexes 12 and 13 still hold d and !.", result: "…d!" },
      { say: "printf reads from the start up to the old null at index 14.", result: "Hello World!d!" },
    ], answer: "(D) Hello World!d!", check: "Official answer (D). The program was compiled and run." },
    { type: "example", id: "c12-e2", level: "gate", title: "GATE CS 2024 (afternoon), Q19 · 1 mark · MSQ", file: "gate2024_an_q19.txt", given: `int fx(char *a) {
    char *b = a;
    while (*b)
        b++;
    return b - a;
}
/* Which are true?
 (A) fx("abcd") will always return a value.
 (B) With char c[] = "abcd" in main, fx(c) will always return a value.
 (C) The code of the function will not compile.
 (D) With char *c = "abcd" in main, fx(c) will always return a value. */`, find: "Which statements are true?", steps: [
      { say: "The function is valid C: a pointer, a loop until the null, and a pointer difference converted to int. It compiles, so C is false.", result: "C false" },
      { say: "\"abcd\" is a string literal ending in a null: the loop stops after four steps. fx returns 4.", result: "A true" },
      { say: "An array initialised from \"abcd\" holds the same characters and the null: the same result.", result: "B true" },
      { say: "A pointer to the literal \"abcd\" is the same string.", result: "D true" },
    ], answer: "A, B and D", check: "Official answer A, B, D. fx was run on \"abcd\" (4), \"\" (0) and \"hello world\" (11) in a test program." },
    { type: "example", id: "c12-e3", level: "gate", title: "GATE CS 2017 (afternoon), Q49 · 2 marks · NAT", file: "gate2017_an_q49.c", given: `# include <stdio.h>
# include <string.h>

int main( )
{
    char* c = "GATECSIT2017";
    char* p = c;
    printf("%d", (int) strlen (c+2[p] - 6[p]-1));
    return 0;
}`, find: "The output.", steps: [
      { say: "2[p] is p[2], the third character, 'T' = 84. 6[p] is p[6], 'I' = 73.", result: "84 and 73" },
      { say: "2[p] − 6[p] − 1 = 84 − 73 − 1 = 10.", result: "10" },
      { say: "c + 10 points at the eleventh character; the string from there is \"17\".", result: "\"17\"" },
      { say: "strlen(\"17\").", result: "2" },
    ], answer: "2", check: "Official answer 2. The program was compiled and run." },

    { type: "trap", wrong: "strlen(\"hello\") and sizeof(\"hello\") are the same.", tempting: "Both seem to measure the length of the word.", whyWrong: "strlen counts the characters before the null: 5. sizeof of the literal counts every byte including the null: 6.", rule: "sizeof includes the null; strlen does not.", ex: { code: "char s[] = \"abc\";\nprintf(\"%zu %zu\", sizeof s, strlen(s));", out: "4 3" } },
    { type: "trap", wrong: "char *p = \"hello\"; p[0] = 'J'; changes the string to Jello.", tempting: "It works for char s[] = \"hello\";.", whyWrong: "p points at a string literal in read-only memory. Writing through it is undefined behaviour and usually crashes.", rule: "Change characters only in an array.", ex: { code: "char s[] = \"hello\";\ns[0] = 'J';\nprintf(\"%s\", s);", out: "Jello", text: "With `char *p = \"hello\"; p[0] = 'J';` the program typically crashes instead." } },
    { type: "trap", wrong: "A hand-written copy loop `while (*t) *s++ = *t++;` makes a complete copy.", tempting: "It copies every character of the string.", whyWrong: "The loop stops when *t is the null, before it is copied. The destination gets no terminator, so whatever was there before still follows the copy.", rule: "Copy the null too: `while ((*s++ = *t++));`, or write `*s = '\\0'` at the end.", ex: { code: "char a[30] = \"@#Hello World!\";\nstringcopy(a, a + 2);   /* no null copied */\nprintf(\"%s\", a);", out: "Hello World!d!" } },
    { type: "trap", wrong: "strcmp returns 1, 0 or −1.", tempting: "Many tutorials show only these values.", whyWrong: "Only the sign is promised: negative, zero or positive. The magnitude depends on the machine, so compare with < 0, == 0 or > 0, never with 1 or −1.", rule: "Test the sign of strcmp.", ex: { code: "printf(\"%d %d\", strcmp(\"abc\", \"abd\") < 0, strcmp(\"b\", \"a\") > 0);", out: "1 1" } },
    { type: "gate", text: "Three questions have been asked on this chapter: copying a string onto itself with no terminator (2025 AN Q19, 1 mark), length by pointer difference with an array and a pointer (2024 AN Q19, 1 mark, MSQ), and a computed pointer into a string with unusual index forms (2017 AN Q49, 2 marks). All three are worked above." },
    { type: "recall", cards: [
      { q: "What ends a string in C?", a: "The null character '\\0'." },
      { q: "How many bytes does a string of n characters need?", a: "n + 1." },
      { q: "What is strlen(\"abc\")? And sizeof of char s[] = \"abc\"?", a: "3 and 4." },
      { q: "Can you change characters of char *p = \"abc\"?", a: "No: it points at a read-only literal." },
      { q: "What does strcmp return?", a: "A negative, zero or positive number; only the sign is promised." },
      { q: "What does b − a give when b points at the null of the string a?", a: "The length of the string." },
      { q: "Does `while (*t) *s++ = *t++;` copy the null?", a: "No." },
      { q: "What is 2[p]?", a: "p[2]." },
      { q: "What type does strlen return?", a: "An unsigned number (size_t)." },
    ] },
    { type: "check", questions: [
      { id: "g1", kind: "NAT", marks: 1, q: "char s[] = \"hello\"; What is sizeof(s)?", answer: "6", solution: "Five characters and the null." },
      { id: "g2", kind: "NAT", marks: 1, q: "char s[10] = \"hi\"; What is strlen(s)?", answer: "2", solution: "Characters before the null." },
      { id: "g3", kind: "NAT", marks: 1, q: "char *p = \"abcd\"; char *b = p; while (*b) b++; What is b - p?", answer: "4", solution: "The length of the string." },
      { id: "g4", kind: "MCQ", marks: 1, q: "Which statement about char *p = \"hello\"; is true?", options: ["p[0] = 'J' is safe", "p points at a read-only literal", "sizeof(p) is 6", "p cannot be moved"], answer: "B", solution: "The literal is stored in read-only memory." },
      { id: "g5", kind: "NAT", marks: 2, q: "char *c = \"GATECSIT2017\"; What is strlen(c + 3)?", answer: "9", solution: "The string from index 3 is ECSIT2017, 9 characters." },
      { id: "g6", kind: "NAT", marks: 2, q: "char a[30] = \"@#Hello World!\"; stringcopy(a, a + 3) with the copy loop of this chapter (no null copied). How many characters does printf(\"%s\", a) print?", answer: "14", solution: "11 characters are copied; the old tail keeps the string 14 characters long." },
      { id: "g7", kind: "MSQ", marks: 2, q: "Which are true?", options: ["strlen counts the null", "A string of n characters needs n + 1 bytes", "strcmp always returns 1, 0 or -1", "strcpy copies the null"], answer: "B, D", solution: "A is false; C is false." },
      { id: "g8", kind: "NAT", marks: 2, q: "char s[] = \"ab\\0cd\"; What is strlen(s) + sizeof(s)?", answer: "8", solution: "2 + 6." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on strings", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: pointers to pointers", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Arrays (C9)", "Pointers II (C11)"], usedIn: ["Pointers III (C13)", "Structures (C14)", "Reading code (C19)"], cross: ["Algorithms: string matching"] },
  ],
};
