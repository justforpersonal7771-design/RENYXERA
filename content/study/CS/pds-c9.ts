import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 9 "Arrays in C" (28 Nov 2026). Real GATE questions explained in full: 2022_FN_Q43 (a three-dimensional array printed with a fixed middle index)
 * and 2017_AN_Q64 (a two-direction bubble sort, which element is at index 3). Every program was compiled and run with gcc (scripts/chapter-check.ts);
 * the fragment of 2017_AN_Q64 was checked inside a test program that also prints the array after every pass.
 */
export const chapterC9: Topic = {
  id: "cs.pds.c.arrays9",
  title: "Arrays in C",
  no: "9",
  book: [
    { t: "p", text: "An **array** is a row of boxes of the same type, one after another in memory, that share one name. Instead of ten variables `m0`, `m1`, …, `m9`, you write one array of ten numbers and reach each by its number. Arrays are the first data structure in C, and they are the foundation of strings (chapter 12), of pointer arithmetic (chapter 11) and of most of the structures later in the book." },
    { t: "p", text: "The ideas are small: the first box is number 0, the boxes are side by side so that an address can be worked out with a formula, and C does not check that you stay inside the array. Two real GATE questions test them, one on a three-dimensional array and one on a sorting loop." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["declare and initialise one-, two- and three-dimensional arrays, and say what the unfilled elements hold;", "work out the number of elements with `sizeof`;", "find the address of any element using the row-major formula;", "read a three-dimensional initialiser and know which element each value goes to;", "say what happens when an array is passed to a function;", "trace a loop that changes an array, pass by pass."] },

    { t: "h2", text: "One-dimensional arrays" },
    { t: "h3", text: "Declaring and indexing" },
    { t: "p", text: "`int a[5];` makes five `int` boxes in a row, named `a[0]`, `a[1]`, `a[2]`, `a[3]` and `a[4]`. The **index** (or subscript) is the number in the brackets. It starts at **0**, so the valid indexes of an array of n elements are 0 to n − 1. The last box of `a[5]` is `a[4]`; there is no `a[5]`." },
    { t: "p", text: "Because the boxes are side by side, the address of `a[i]` is the address of `a[0]` plus i times the size of one element. This is the most useful fact about arrays, and the formula for the address of any element comes from it." },
    { t: "fig", id: "c9-f1" },
    { t: "h3", text: "Initialising" },
    { t: "p", text: "You can give the starting values in braces: `int a[5] = {1, 2};`. When there are **fewer** values than elements, the rest are set to **0**, not left as rubbish. If you leave out the size, the compiler counts the values: `int b[] = {7, 8, 9};` has three elements. An array declared with no braces inside a function, such as `int a[5];`, holds rubbish, like any local variable." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[5] = {1, 2};
    for (int i = 0; i < 5; i++)
        printf("%d ", a[i]);
    printf("\\n");
    return 0;
}`, out: "1 2 0 0 0", file: "partial_init.c" },
    { t: "trap", i: 0 },
    { t: "h3", text: "How many elements? sizeof" },
    { t: "p", text: "`sizeof(a)` is the size of the whole array in bytes, and `sizeof(a[0])` the size of one element. So the number of elements is their ratio, `sizeof(a) / sizeof(a[0])`. This works only where the array itself is in scope, not for an array parameter (section 9.4)." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[5];
    int b[] = {7, 8, 9};
    printf("%zu %zu %zu\\n", sizeof(a), sizeof(a[0]), sizeof(a) / sizeof(a[0]));
    printf("%zu\\n", sizeof(b) / sizeof(b[0]));
    return 0;
}`, out: "20 4 5\n3", file: "array_sizeof.c" },
    { t: "h3", text: "No bounds checking" },
    { t: "p", text: "C does **not** check the index. Writing `a[5]` for a five-element array, or `a[-1]`, does not give an error message: it reads or writes whatever memory is next to the array, which may belong to another variable. This is undefined behaviour, and a question that uses an out-of-range index has no single correct answer." },
    { t: "callout", kind: "warning", text: "The valid indexes of `int a[n]` are 0 to n − 1. Using `a[n]` is a classic off-by-one error; C will not warn you." },
    { t: "p", text: "The name of an array can also be used as an address, and `a[i]` is exactly the same as `*(a + i)`. Chapter 11 explains this fully." },

    { t: "h2", text: "Two- and three-dimensional arrays" },
    { t: "h3", text: "Rows and columns" },
    { t: "p", text: "A two-dimensional array is an array of arrays. `int m[2][3];` is two rows, each of three `int` boxes. The first index chooses the row, the second the column in that row: `m[1][2]` is the last box of the last row. It can be filled with nested braces, or with one list in order." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int n[2][3] = {1, 2, 3, 4, 5, 6};      /* one list: filled row by row */
    int s = 0;
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 3; j++)
            s += m[i][j];
    printf("%d %d %d %d\\n", s, m[1][2], n[0][2], n[1][0]);
    return 0;
}`, out: "21 6 3 4", file: "two_dim.c" },
    { t: "h3", text: "How the boxes are laid out: row-major order" },
    { t: "p", text: "Memory is a single row of boxes, so a two-dimensional array has to be flattened. C stores it **row by row**: the whole of row 0, then the whole of row 1, and so on. This is called **row-major order**. So in `int a[R][C]`, the element `a[i][j]` is the `(i × C + j)`-th element from the start, and its address is" },
    { t: "callout", kind: "key", title: "Address formula", text: "address of `a[i][j]` = base + (i × C + j) × size, where C is the number of columns and size the size of one element." },
    { t: "fig", id: "c9-f2" },
    { t: "p", text: "For `int a[3][4]` at address 1000 with 4-byte ints, `a[1][2]` is the (1 × 4 + 2) = 6th element, at 1000 + 6 × 4 = 1024, and `a[2][3]` is the 11th, at 1044. Notice that the number of **rows** does not appear in the formula; only the number of columns does." },
    { t: "p", text: "For three dimensions `a[X][Y][Z]`, the element `a[i][j][k]` is number `(i × Y + j) × Z + k`, and its address is base + ((i × Y + j) × Z + k) × size." },
    { t: "callout", kind: "shortcut", text: "To find an element's address, count how many whole elements lie before it in row-major order, multiply by the element size, and add the base. Never use the number of rows." },
    { t: "trap", i: 1 },
    { t: "h3", text: "A three-dimensional initialiser" },
    { t: "p", text: "In `int a[3][3][3] = {{1,2,3,4,5,6,7,8,9}, {10,…,18}, {19,…,27}};`, the three inner braces fill `a[0]`, `a[1]` and `a[2]` in turn, and each holds nine values that are filled in row-major order: the first three values are `a[i][0][0..2]`, the next three `a[i][1][0..2]`, and so on. So `a[1][0][0]` is 10, the first value of the second brace." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[3][3][3] = {{1, 2, 3, 4, 5, 6, 7, 8, 9},
                      {10, 11, 12, 13, 14, 15, 16, 17, 18},
                      {19, 20, 21, 22, 23, 24, 25, 26, 27}};
    printf("%d %d %d\\n", a[0][0][0], a[1][1][1], a[2][2][2]);
    printf("%d %d\\n", a[1][0][0], a[0][1][0]);
    return 0;
}`, out: "1 14 27\n10 4", file: "three_dim.c" },

    { t: "h2", text: "Arrays and functions" },
    { t: "p", text: "When you pass an array to a function you do not pass a copy of all its boxes: the name of the array turns into the **address of its first element**, and the function receives that address. So a parameter written `int a[]` is really a pointer, `int *a`. Because the function holds the address of the caller's array, it **can change the caller's elements**, unlike a plain `int` parameter." },
    { t: "code", text: `#include <stdio.h>

void zero(int a[], int n) {        /* a is really an address */
    for (int i = 0; i < n; i++)
        a[i] = 0;
}

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    zero(a, 3);                    /* the first three become 0 */
    for (int i = 0; i < 5; i++)
        printf("%d ", a[i]);
    printf("\\n");
    return 0;
}`, out: "0 0 0 4 5", file: "array_param.c" },
    { t: "p", text: "A consequence is that `sizeof` of an array **parameter** is the size of a pointer, not of the array, and the function cannot discover the length. You must pass the length as a separate argument, as `zero` does with `n`." },
    { t: "trap", i: 2 },
    { t: "callout", kind: "tip", text: "An array argument is passed by address: changes to its elements stay after the function returns. A plain variable argument is passed by value: changes to it do not." },

    { t: "h2", text: "Loops over arrays" },
    { t: "p", text: "Almost every array program is a loop over the index: add the elements, find the largest, reverse the array, count the elements that satisfy a test. The classic one that GATE likes is a **bubble sort**, which repeatedly compares neighbours and swaps them when they are out of order. The way to understand any such loop is to print the array after each pass, and that is what the figure below does for the question in this chapter." },
    { t: "p", text: "A pass that swaps neighbouring elements moves a large (or small) element a long way in one sweep. A sweep from the left that swaps when `array[i] < array[i + 1]` carries the **smallest** element to the right end; a sweep from the right that swaps when `array[i] > array[i - 1]` carries the **largest** to the left end. Doing both in turn is called a cocktail (bidirectional bubble) sort." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[6] = {1, 2, 3, 4, 5, 6};
    for (int i = 0, j = 5; i < j; i++, j--) {   /* reverse in place */
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
    for (int i = 0; i < 6; i++)
        printf("%d", a[i]);
    printf("\\n");
    return 0;
}`, out: "654321", file: "reverse.c" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2022 (forenoon), Q43: a fixed middle index" },
    { t: "p", text: "A two-mark multiple-choice question. The program prints elements of a three-dimensional array, but the middle index `j` is **never changed**: it is 0 throughout. The four options are four different patterns of numbers, and only one matches." },
    { t: "ex", id: "c9-e1" },
    { t: "fig", id: "c9-f3" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Two things together: how the nested braces fill a 3-D array, and which indexes the loops actually vary. The loops vary `i` (the first index) and `k` (the third), and `j` stays 0. For each i the loop prints `a[i][0][0]`, `a[i][0][1]` and `a[i][0][2]`, the first row of the i-th block. The blocks start with 1, 10 and 19, so the lines are `1 2 3`, `10 11 12` and `19 20 21`. That is option A." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option C, 1 2 3 / 4 5 6 / 7 8 9.** The student thinks the three loops of values are the three rows of one block, so that `i` chooses the row. In fact `i` chooses the whole 3 × 3 block.", "**Option B, 1 4 7 / 10 13 16 / 19 22 25.** The student treats the fixed `j` as the varying index and the printed index as a column, reading down the columns of each block.", "**Option D, 1 2 3 / 13 14 15 / 25 26 27.** The student uses the middle row and the last row in the later blocks, mixing up the formula."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Elements printed", "Output (3 lines)"], rows: [["`j = 1` instead of 0", "a[i][1][0..2]: the second row of each block", "4 5 6 / 13 14 15 / 22 23 24"], ["`a[0][j][k]` with `j` from 0 to 2, `k` fixed 0", "first element of each row of block 0", "1 / 4 / 7"], ["the question as asked", "a[i][0][0..2]", "1 2 3 / 10 11 12 / 19 20 21"]], caption: "The third row was compiled and run; the others follow the same formula." },

    { t: "h3", text: "GATE 2017 (afternoon), Q64: a two-direction bubble sort" },
    { t: "p", text: "A two-mark numerical question. A loop sweeps the array forwards and backwards, swapping neighbours, until a full round makes no swap. The question asks which number ends up at index 3." },
    { t: "ex", id: "c9-e2" },
    { t: "fig", id: "c9-f4" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Whether you see what the loop produces without tracing every comparison. Both sweeps swap **out-of-order** neighbours, and both treat a larger number on the left as correct: the forward sweep swaps when `array[i] < array[i + 1]`, and the backward sweep when `array[i] > array[i - 1]`. The loop only ends when a whole round has no swap, which means the array is **sorted in descending order**: 6, 5, 4, 3, 2, 1. The element at index 3 is therefore 3. The figure shows the array after each sweep." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Stopping after one pass. The loop repeats until `done` is still 1 after a whole round, which here takes three rounds.", "Sorting in ascending order, by reading `array[i] < array[i + 1]` as 'ascending'. The swap is made when the left one is **smaller**, so larger numbers move left.", "Counting from 1: index 3 is the **fourth** element, 3, not the third."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Final array", "array[3]"], rows: [["the question as asked", "6 5 4 3 2 1", "3"], ["the first comparison reversed: `array[i] > array[i + 1]` and `array[i] < array[i - 1]`", "1 2 3 4 5 6", "4"], ["`array[0]` printed", "6 5 4 3 2 1", "6"]], caption: "The first row was compiled and run." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["An array is a row of same-type boxes; indexes run from 0 to n − 1, and C does not check them.", "Fewer initial values than elements: the rest are 0. Without braces, a local array holds rubbish.", "`sizeof(a) / sizeof(a[0])` is the number of elements, for an array in scope.", "Two-dimensional arrays are stored row by row; address of a[i][j] = base + (i × C + j) × size. The number of rows is not in the formula.", "An array passed to a function is passed by address, so the function changes the caller's elements, and `sizeof` of the parameter is only a pointer.", "To understand a loop over an array, print or write the array after every pass."] },
  ],
  blocks: [
    { type: "figure", id: "c9-f1", caption: "int a[5] = {1, 2}; five boxes side by side. The address of a[i] is 1000 + 4i for 4-byte ints; the unfilled elements are 0.", alt: "Five array cells with values 1, 2, 0, 0, 0 and indexes 0 to 4.", fig: { kind: "array", title: "int a[5] = {1, 2};", data: [[1, 2, 0, 0, 0]], base: 1000, size: 4, index: true, tones: { "0,2": "dim", "0,3": "dim", "0,4": "dim" } } },
    { type: "figure", id: "c9-f2", caption: "int a[3][4] at 1000. Row-major: row 0, then row 1, then row 2. a[1][2] is the sixth element, at 1000 + 6 × 4 = 1024.", alt: "A 3 by 4 array with the element a[1][2] highlighted at address 1024.", fig: { kind: "array", title: "int a[3][4];  a[1][2] is highlighted", data: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], base: 1000, size: 4, index: true, rowIndex: true, tones: { "1,2": "hl" } } },
    { type: "figure", id: "c9-f3", caption: "GATE 2022 FN Q43: the loops vary i and k, and j stays 0. Each line is the first row of one 3 × 3 block.", alt: "A table of i, j, k and the printed values for the three blocks.", fig: { kind: "trace", title: "printf(a[i][0][k]) for k = 0, 1, 2", cols: ["i", "block a[i] starts with", "prints a[i][0][0], a[i][0][1], a[i][0][2]"], rows: [{ cells: [0, 1, "1 2 3"] }, { cells: [1, 10, "10 11 12"] }, { cells: [2, 19, "19 20 21"], tone: "ok" }] } },
    { type: "figure", id: "c9-f4", caption: "GATE 2017 AN Q64 after every sweep. F is the forward sweep (smaller numbers move right), B the backward one (larger numbers move left). The round that ends with no swap stops the loop.", alt: "The array after each sweep: 3 5 1 4 6 2, then 5 3 4 6 2 1, then 6 5 3 4 2 1, then 6 5 4 3 2 1.", fig: { kind: "frames", title: "bubble sort in both directions", frames: [
      { caption: "Start: 3 5 1 4 6 2. Index 3 holds 4.", fig: { kind: "array", data: [[3, 5, 1, 4, 6, 2]], index: true, tones: { "0,3": "hl" } } },
      { caption: "After the first forward sweep: 5 3 4 6 2 1.", fig: { kind: "array", data: [[5, 3, 4, 6, 2, 1]], index: true, tones: { "0,3": "hl" } } },
      { caption: "After the first backward sweep: 6 5 3 4 2 1.", fig: { kind: "array", data: [[6, 5, 3, 4, 2, 1]], index: true, tones: { "0,3": "hl" } } },
      { caption: "The second forward sweep swaps 3 and 4: 6 5 4 3 2 1. A swap happened, so another round follows.", fig: { kind: "array", data: [[6, 5, 4, 3, 2, 1]], index: true, tones: { "0,3": "hl" } } },
      { caption: "A third round makes no swap, so done stays 1 and the loop ends. array[3] = 3.", fig: { kind: "array", data: [[6, 5, 4, 3, 2, 1]], index: true, tones: { "0,3": "ok" } } },
    ] } },

    { type: "example", id: "c9-e1", level: "gate", title: "GATE CS 2022 (forenoon), Q43 · 2 marks · MCQ", file: "gate2022_q43.c", given: `#include<stdio.h>

int main(int argc, char *argv[ ])
{
    int a[3][3][3] = {{1, 2, 3, 4, 5, 6, 7, 8, 9},
                      {10, 11, 12, 13, 14, 15, 16, 17, 18},
                      {19, 20, 21, 22, 23, 24, 25, 26, 27}};
    int i = 0, j = 0, k = 0;
    for(i = 0; i < 3; i++) {
        for(k = 0; k < 3; k++)
            printf("%d ", a[i][j][k]);
        printf("\\n");
    }
    return 0;
}`, find: "What is printed? Options: (A) 1 2 3 / 10 11 12 / 19 20 21  (B) 1 4 7 / 10 13 16 / 19 22 25  (C) 1 2 3 / 4 5 6 / 7 8 9  (D) 1 2 3 / 13 14 15 / 25 26 27", steps: [
      { say: "The three inner braces fill a[0], a[1] and a[2], nine values each, in row-major order. So a[1] starts with 10 and a[2] with 19.", result: "blocks start at 1, 10, 19" },
      { say: "j stays 0. For each i, k runs 0, 1, 2, so the line is a[i][0][0], a[i][0][1], a[i][0][2]: the first row of block i.", result: "first row of each block" },
      { say: "Block 0: 1 2 3. Block 1: 10 11 12. Block 2: 19 20 21.", result: "A" },
    ], answer: "(A)", check: "Official answer (A). The program was compiled and run." },
    { type: "example", id: "c9-e2", level: "gate", title: "GATE CS 2017 (afternoon), Q64 · 2 marks · NAT", file: "gate2017_an_q64.txt", given: `int main() {
    int array[] = {3, 5, 1, 4, 6, 2};
    int done = 0;
    int i;
    while (done == 0) {
        done = 1;
        for (i = 0; i <= 4; i++) {
            if (array[i] < array[i + 1]) {
                swap(&array[i], &array[i + 1]);
                done = 0;
            }
        }
        for (i = 5; i >= 1; i--) {
            if (array[i] > array[i - 1]) {
                swap(&array[i], &array[i - 1]);
                done = 0;
            }
        }
    }
    printf("%d", array[3]);
}
/* swap(&x, &y) exchanges the contents of x and y. */`, find: "The output.", steps: [
      { say: "Round 1, forward: 3 5 1 4 6 2 becomes 5 3 4 6 2 1. Backward: it becomes 6 5 3 4 2 1.", result: "6 5 3 4 2 1" },
      { say: "Round 2, forward: 3 < 4 swaps them: 6 5 4 3 2 1. Backward: nothing to swap. done is 0 because of the swap.", result: "6 5 4 3 2 1" },
      { say: "Round 3: no swap in either sweep, so done stays 1 and the loop ends.", result: "sorted, descending" },
      { say: "array[3] is the fourth element of 6 5 4 3 2 1.", result: "3" },
    ], answer: "3", check: "Official answer 3. The loop was compiled and run inside a test program (with swap defined) and printed 3, after three rounds." },

    { type: "trap", wrong: "An array of five elements has the valid indexes 1 to 5.", tempting: "People count from 1, and the declaration says 5.", whyWrong: "Indexes start at 0, so the five boxes are a[0] … a[4]. a[5] is just past the end: C does not stop you, and the result is undefined behaviour.", rule: "int a[n] has indexes 0 to n − 1.", ex: { code: "int a[5] = {10, 20, 30, 40, 50};\nprintf(\"%d %d\", a[0], a[4]);   /* a[5] would be out of range */", out: "10 50" } },
    { type: "trap", wrong: "The address of a[i][j] uses the number of rows: base + (j × R + i) × size.", tempting: "A grid has rows and columns, so either could be the multiplier.", whyWrong: "C stores arrays row by row, so a whole row of C elements comes before the next. The multiplier of i is the number of columns: base + (i × C + j) × size.", rule: "Row-major: i × columns + j.", ex: { text: "For int a[3][4] at 1000 (4-byte ints), a[1][2] is at 1000 + (1 × 4 + 2) × 4 = 1024. Using the number of rows (3) instead would give 1000 + (1 × 3 + 2) × 4 = 1020, which is the address of a[1][1]." } },
    { type: "trap", wrong: "sizeof tells a function how many elements its array parameter has.", tempting: "It works in main, where the array is declared.", whyWrong: "An array parameter is really a pointer, so sizeof gives the size of a pointer (usually 8), not of the array.", rule: "Pass the length as an argument.", ex: { code: "int sz(int a[]) { return sizeof(a); }\n/* in main: */\nint a[5];\nprintf(\"%zu %d\", sizeof(a), sz(a));", out: "20 8" } },
    { type: "gate", text: "Two questions have been asked on this chapter: a three-dimensional array printed with a fixed index (2022 FN Q43, 2 marks, MCQ) and a two-direction bubble sort with the element at one index asked (2017 AN Q64, 2 marks, NAT). Array formulas for addresses also appear in the Computer Organisation and Algorithms papers. Both questions are worked above." },
    { type: "recall", cards: [
      { q: "What are the valid indexes of int a[n]?", a: "0 to n − 1." },
      { q: "What are the unfilled elements of int a[5] = {1, 2}?", a: "Zero." },
      { q: "How do you get the number of elements of an array?", a: "sizeof(a) / sizeof(a[0]), where the array is in scope." },
      { q: "In what order does C store a 2-D array?", a: "Row by row (row-major)." },
      { q: "What is the address of a[i][j] for a[R][C]?", a: "base + (i × C + j) × size." },
      { q: "Does C check array indexes?", a: "No; out-of-range access is undefined." },
      { q: "How is an array passed to a function?", a: "As the address of its first element (so changes are visible to the caller)." },
      { q: "What does sizeof give for an array parameter?", a: "The size of a pointer." },
    ] },
    { type: "check", questions: [
      { id: "a1", kind: "NAT", marks: 1, q: "int a[5] = {1, 2}; What is a[3]?", answer: "0", solution: "The unfilled elements are zero." },
      { id: "a2", kind: "NAT", marks: 1, q: "int a[10]; How many elements are there? (sizeof(a) / sizeof(a[0]))", answer: "10", solution: "The ratio of the array size to the element size." },
      { id: "a3", kind: "NAT", marks: 1, q: "int a[3][4] at address 1000, 4-byte int. What is the address of a[2][1]?", answer: "1036", solution: "(2 × 4 + 1) × 4 = 36." },
      { id: "a4", kind: "NAT", marks: 1, q: "int m[2][3] = {1, 2, 3, 4, 5, 6}; What is m[1][0]?", answer: "4", solution: "The second row starts with 4." },
      { id: "a5", kind: "MCQ", marks: 1, q: "A function receives int a[]. What does sizeof(a) give inside it?", options: ["the number of elements", "the size of the whole array", "the size of a pointer", "zero"], answer: "C", solution: "An array parameter is a pointer." },
      { id: "a6", kind: "NAT", marks: 2, q: "int a[3][3][3] filled with 1 to 27 in order. What is a[2][1][2]?", answer: "24", solution: "Element number (2 × 3 + 1) × 3 + 2 = 23, counting from 0, so the value is 24." },
      { id: "a7", kind: "NAT", marks: 2, q: "int a[2][5] at address 2000, 2-byte element. What is the address of a[1][3]?", answer: "2016", solution: "(1 × 5 + 3) × 2 = 16." },
      { id: "a8", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["The valid indexes of int a[5] are 0 to 4", "C checks that an index is in range", "A function can change the caller's array elements", "Arrays are stored column by column in C"], answer: "A, C", solution: "B is false. D is false: row by row." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on arrays", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: pointers (chapter 10)", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Loops (C5)", "Functions (C6)"], usedIn: ["Pointers II (C11)", "Strings (C12)", "Arrays as a data structure (D2)"], cross: ["Computer Organisation: array addressing", "Algorithms: sorting"] },
  ],
};
