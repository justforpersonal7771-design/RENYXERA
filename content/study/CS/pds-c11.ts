import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 11 "Pointers II: arithmetic, and arrays with pointers" (28 Nov 2026). Seven real GATE questions explained in full: 2025_FN_Q61 (pointer into an array
 * as a recursive argument), 2025_AN_Q62 (pointer and ++), 2024_AN_Q50 (pointer difference), 2021_AN_Q52 (arr[1] + 9 in a 2-D array), 2020_FN_Q16
 * (*(*(a + **a + 2) + 3)), 2019_FN_Q15 (ip[1]), 2019_FN_Q65 (b - i). Every program was compiled and run with gcc (scripts/chapter-check.ts) and every variation was run.
 */
export const chapterC11: Topic = {
  id: "cs.pds.c.ptr2",
  title: "Pointers II: arithmetic, and arrays with pointers",
  no: "11",
  book: [
    { t: "p", text: "Chapter 10 taught that a pointer is a variable whose value is an address, and that `*p` follows it. This chapter adds one idea that makes pointers far more useful: because addresses are numbers, and because array elements sit side by side, you can **move** a pointer along an array by adding to it. The expression `p + 1` is the address of the next element, wherever it is." },
    { t: "p", text: "That one idea explains why an array name works like a pointer, why `a[i]` and `*(a + i)` are the same thing, how a pointer walks through a row, and how GATE writes expressions such as `*(*(a + **a + 2) + 3)` that look frightening and are only a few steps of arithmetic. Seven real questions are worked in full at the end." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["say what `p + n`, `p - q` and `p < q` mean for pointers into an array;", "use the equality `a[i]` = `*(a + i)` in both directions, including `i[a]` and negative indexes through a pointer;", "tell `*p++`, `(*p)++` and `*++p` apart;", "evaluate pointer expressions on two-dimensional arrays, including `*(arr[1] + 9)` that crosses a row;", "pass the middle of an array to a function with `S + 1`."] },

    { t: "h2", text: "Adding to a pointer" },
    { t: "h3", text: "p + 1 moves by one element, not one byte" },
    { t: "p", text: "If `p` points to an `int`, then `p + 1` is the address of the **next `int`**, which is 4 bytes further on, not 1 byte. The compiler multiplies the amount you add by the size of the thing pointed at. For a pointer to `double` it adds 8 per step, for a pointer to `char` it adds 1." },
    { t: "fig", id: "c11-f1" },
    { t: "p", text: "So in `int a[4]` at address 1000, `a + 1` is 1004 and `a + 3` is 1012, and the expression `*(a + 3)` follows that address and gives `a[3]`. Pointer arithmetic is always in **elements** of the pointer's type." },
    { t: "callout", kind: "key", text: "`p + n` is the address of the element n places after `*p`: its value is `p` plus n times the size of the pointed-to type." },
    { t: "h3", text: "Subtracting two pointers" },
    { t: "p", text: "Two pointers into the **same array** can be subtracted. The result is not a number of bytes but a number of **elements** between them: `q - p` is how many elements apart they are. Pointers can also be compared with `<` and `==`, which compares their positions in the array." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    int *p = a, *q = a + 4;
    printf("%d %d %d\\n", (int)(q - p), p < q, *q - *p);
    printf("%d\\n", (int)((char *)q - (char *)p));
    return 0;
}`, out: "4 1 4\n16", file: "pointer_difference.c" },
    { t: "p", text: "The first number is 4: the pointers are four elements apart. The last line converts both to `char *`, which counts in bytes: sixteen bytes (four `int`s). The same two pointers give 4 as `int *` and 16 as `char *`, which is the point: the unit is the size of the pointed-to type." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Arrays and pointers" },
    { t: "p", text: "Chapter 9 said that the name of an array turns into the address of its first element. So `a` and `&a[0]` have the same value, and **`a[i]` is defined as `*(a + i)`**: move i elements along from the start and follow the address. This is not a coincidence; it is the definition of the square brackets." },
    { t: "table", head: ["Expression", "Meaning", "For `int a[3] = {10, 20, 30}`"], rows: [["`a`", "address of a[0]", "address 1000, say"], ["`a + 1`", "address of a[1]", "1004"], ["`*(a + 1)`", "the box a[1]", "20"], ["`a[1]`", "the same as `*(a + 1)`", "20"], ["`1[a]`", "`*(1 + a)`, the same again", "20"]], caption: "Since addition does not care about the order, `1[a]` is legal C." },
    { t: "p", text: "A pointer can also be **indexed** like an array. If `ip` points into the middle of an array, then `ip[1]` is `*(ip + 1)`: the element after the one `ip` points at. A negative index is allowed through a pointer and reaches backwards: `ip[-1]` is the element before. The only rule is that the final address must lie inside the array." },
    { t: "fig", id: "c11-f2" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int arr[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 5};
    int *ip = arr + 4;                   /* points at arr[4], the value 5 */
    printf("%d %d %d\\n", ip[1], ip[-1], *(ip + 3));
    return 0;
}`, out: "6 4 8", file: "pointer_index.c" },
    { t: "callout", kind: "tip", text: "To read `ip[k]` where `ip = arr + m`, the element is `arr[m + k]`. Write the starting index next to the pointer and add." },
    { t: "p", text: "There is one difference between an array and a pointer that matters. An array name is not a variable: you cannot write `a = a + 1` or `a++`. A pointer is a variable, and `p++` moves it." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Increment with pointers" },
    { t: "p", text: "The three forms of `++` on a pointer give three different results, and they are the favourite trap of pointer questions. The brackets and the order of the symbols decide everything. `++` binds tighter than `*` when it is written after the pointer, and the unary `*` and a prefix `++` go from right to left." },
    { t: "table", head: ["Expression", "Reads as", "Value of the expression", "What changes"], rows: [["`*p++`", "`*(p++)`", "the element p points at (old p)", "p moves to the next element"], ["`(*p)++`", "add 1 to the element", "the old element value", "the element is increased by 1; p stays"], ["`*++p`", "`*(++p)`", "the element after p", "p moves to the next element"], ["`++*p`", "`++(*p)`", "the new element value", "the element is increased by 1"]] },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[3] = {10, 20, 30};
    int *p = a;
    int x = *p++;                         /* x = 10, then p moves on */
    printf("%d %d ", x, *p);
    int y = *++p;                         /* p moves on, then y = 30 */
    printf("%d %d\\n", y, *p);
    int b[3] = {10, 20, 30};
    int *q = b;
    (*q)++;                               /* the element becomes 11, q stays */
    printf("%d %d\\n", b[0], *q);
    return 0;
}`, out: "10 20 30 30\n11 11", file: "pointer_increment.c" },
    { t: "callout", kind: "shortcut", text: "`*p++`: use the element, then move the pointer. `*++p`: move the pointer, then use the element. `(*p)++`: the pointer never moves; the **box** changes." },
    { t: "trap", i: 2 },

    { t: "h2", text: "Two-dimensional arrays and pointers" },
    { t: "p", text: "A two-dimensional array is an array of rows, and each row is an array. So `a` has the type 'array of rows': the expression `a + 1` moves a whole **row** (not one element). The name `a[1]` is the second row, which is itself an array and turns into the address of the first element of that row, an `int *`. Adding to it moves one **element** at a time." },
    { t: "table", head: ["Expression (a is `int a[3][4]`)", "What it is", "Step of `+ 1`"], rows: [["`a`", "address of row 0 (type pointer to a row of 4 ints)", "a whole row (4 ints = 16 bytes)"], ["`a[1]` or `*(a + 1)`", "row 1 as an array: the address of a[1][0] (an `int *`)", "one int (4 bytes)"], ["`a[1] + 2` or `*(a + 1) + 2`", "address of a[1][2]", "one int"], ["`*(a[1] + 2)` or `*(*(a + 1) + 2)` or `a[1][2]`", "the element a[1][2]", "an int"], ["`**a`", "the element a[0][0]", "an int"]] },
    { t: "fig", id: "c11-f3" },
    { t: "p", text: "Because all the elements are laid out row after row in one block (chapter 9), an `int *` that points into one row can run **past the end of that row into the next**, as long as it stays inside the whole array. So `a[1] + 5` is the address of `a[2][0]` in an array with five columns, and `*(a[1] + 9)` is `a[2][4]`." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[3][4];
    printf("%d %d\\n", (int)((char *)(a + 1) - (char *)a),
                       (int)((char *)(*(a + 1) + 1) - (char *)a));
    return 0;
}`, out: "16 20", file: "row_steps.c" },
    { t: "p", text: "The first number is 16: `a + 1` moves a whole row of four `int`s. The second is 20: `*(a + 1)` is the start of row 1 (16 bytes in) and `+ 1` moves one more `int` (4 bytes)." },
    { t: "trap", i: 3 },

    { t: "h2", text: "Passing part of an array" },
    { t: "p", text: "Since an array argument is just an address, you can pass **the middle** of an array by passing a later address: `foo(S + 1, size - 1)` hands the function the same array without its first element, and one element shorter. A recursive function that does this works its way along the array, one element per call, which is how the first question below is built." },
    { t: "callout", kind: "note", text: "`S + 1` and `&S[1]` are the same address. In the called function, `S[0]` is the element that was `S[1]` in the caller." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Seven questions, and all of them reduce to the same steps: write the array with its indexes, mark where each pointer points, and apply each move. Every variation below was compiled and run." },

    { t: "h3", text: "GATE 2019 (forenoon), Q15: indexing a pointer" },
    { t: "p", text: "A one-mark numerical question with the shortest possible code. A pointer is set into the middle of an array and then indexed with `ip[1]`." },
    { t: "ex", id: "c11-e1" },
    { t: "p", text: "**What it tests.** That `ip[1]` is `*(ip + 1)`. The pointer starts at `arr + 4`, which is `arr[4]` (the value 5), so `ip[1]` is `arr[5]`, which is 6. **Where marks are lost:** answering 5 (the element the pointer points at, `ip[0]`), or counting the index from 1 and answering 7." },
    { t: "table", head: ["Expression", "Element", "Value"], rows: [["`ip[0]`", "arr[4]", "5"], ["`ip[1]` (the question)", "arr[5]", "6"], ["`ip[-1]`", "arr[3]", "4"], ["`*(ip + 3)`", "arr[7]", "8"]], caption: "Compiled and run." },

    { t: "h3", text: "GATE 2024 (afternoon), Q50: pointer difference" },
    { t: "p", text: "A two-mark multiple-choice question about a pointer to `double`, with two numbers printed: the difference of the pointers and the difference of the values they point at." },
    { t: "ex", id: "c11-e2" },
    { t: "p", text: "**What it tests.** That subtracting two pointers gives a count of **elements**, not bytes. `q` is `p + 1`, so `q - p` is 1, even though the two addresses are 8 bytes apart. The second number is the difference of the doubles: 25.0 − 20.0 = 5.0, and the cast `(int)` makes it 5. So the output is `1, 5`: option B. **Where marks are lost:** option A or C (4, 8; 8, 5), by giving the byte distance 8 for the first number; option D (1, 8), by giving the size of a double for the second." },
    { t: "table", head: ["Expression", "Value", "Reason"], rows: [["`(int)(q - p)`", "1", "pointers one element apart"], ["`(int)(*q - *p)`", "5", "25.0 − 20.0"], ["`(int)((char *)q - (char *)p)`", "8", "as bytes: one double is 8 bytes"]], caption: "Compiled and run." },

    { t: "h3", text: "GATE 2025 (afternoon), Q62: changing the element, then moving the pointer" },
    { t: "p", text: "A two-mark numerical question mixing the two forms of `++`: one increases a **value**, one moves the **pointer**." },
    { t: "ex", id: "c11-e3" },
    { t: "fig", id: "c11-f4" },
    { t: "p", text: "**What it tests.** Following two different `++`s in order. `arr` is {30, 50, 10, 0, 0}. `ptr = &arr[0] + 1` points at `arr[1]` (50). `a = *ptr` copies 50. `(*ptr)++` adds one to the **element**: `arr[1]` becomes 51 (ptr does not move). `ptr++` moves the **pointer** to `arr[2]`, which is 10. The print is `a + *ptr + arr[1]` = 50 + 10 + 51 = 111. **Where marks are lost:** using the old `arr[1]` = 50 (giving 110), or treating `(*ptr)++` as moving the pointer." },
    { t: "table", head: ["Change", "Reasoning", "Prints"], rows: [["`ptr = &arr[0] + 2;`", "a = 10; arr[2] becomes 11; ptr moves to arr[3] = 0; 10 + 0 + 50", "60"], ["`ptr = &arr[0]; a = *ptr++;` then `a + *ptr`", "a = 30; ptr now at arr[1] = 50", "80"], ["the question as asked", "50 + 10 + 51", "111"]], caption: "Compiled and run." },

    { t: "h3", text: "GATE 2019 (forenoon), Q65: stepping backwards with b - i" },
    { t: "p", text: "A two-mark numerical question. A pointer is set to the **last** element, and the loop reads elements backwards with `*(b - i)`." },
    { t: "ex", id: "c11-e4" },
    { t: "p", text: "**What it tests.** Separating the two terms of the sum. `*b` is always 10 (the last element, `a[4]`), so `(*b - i)` is the **value** 10 − i. `*(b - i)` is the element i places **before** the last: `a[4 - i]`. For i = 0 to 4 the terms are (10 − 0) − 10, (10 − 1) − 8, (10 − 2) − 6, (10 − 3) − 4 and (10 − 4) − 2, which are 0, 1, 2, 3, 4: the total is 10. **Where marks are lost:** treating `*b - i` as `*(b - i)` (a pointer move), which changes the sum to 0." },
    { t: "table", head: ["i", "(*b − i)", "*(b − i)", "term"], rows: [["0", "10", "10", "0"], ["1", "9", "8", "1"], ["2", "8", "6", "2"], ["3", "7", "4", "3"], ["4", "6", "2", "4"]], caption: "The sum of the last column is 10." },

    { t: "h3", text: "GATE 2021 (afternoon), Q52: arr[1] + 9 in a two-dimensional array" },
    { t: "p", text: "A one-mark multiple-choice question. The array is filled with `10 * i + j`, and the program prints `*(arr[1] + 9)`, an address that **runs past the end of row 1**." },
    { t: "ex", id: "c11-e5" },
    { t: "p", text: "**What it tests.** That `arr[1]` is a pointer to the first element of row 1, that adding 9 steps nine **elements** (not rows), and that the rows are stored one after another. Row 1 has five elements, so `arr[1] + 5` is the start of row 2, and `arr[1] + 9` is four further, the last element of row 2: `arr[2][4]`, which holds 10·2 + 4 = 24. The answer is option C. **Where marks are lost:** option A (14), by reading `arr[1][4]` and thinking an address cannot leave its row; option B or D (20, 30), by moving by rows instead of elements." },
    { t: "table", head: ["Expression", "Element", "Value"], rows: [["`*(arr[1] + 9)` (the question)", "arr[2][4]", "24"], ["`*(arr[2] + 3)`", "arr[2][3]", "23"], ["`*(arr[1] + 5)`", "arr[2][0]", "20"], ["`*(*(arr + 1) + 4)`", "arr[1][4]", "14"]], caption: "Compiled and run." },

    { t: "h3", text: "GATE 2020 (forenoon), Q16: a double dereference" },
    { t: "p", text: "A one-mark numerical question with an expression of three nested stars and plus signs. It looks hard, and it is four small steps if you take it from the inside." },
    { t: "ex", id: "c11-e6" },
    { t: "fig", id: "c11-f5" },
    { t: "p", text: "**What it tests.** Evaluating inside out. `**a` is `*(*a)`: `a` is the address of row 0, `*a` is row 0 (as an address of `a[0][0]`), and `**a` is the element `a[0][0]` = 1. So `a + **a + 2` is `a + 1 + 2` = `a + 3`, the address of **row 3**. `*(a + 3)` is row 3 as an address of `a[3][0]`, and `+ 3` moves three elements to `a[3][3]`. The last `*` gives 19. **Where marks are lost:** adding the **value** 1 to `a` as though it were bytes, or not seeing that `a + 3` moves by rows." },
    { t: "table", head: ["Step", "Expression", "Meaning", "Value"], rows: [["1", "`**a`", "a[0][0]", "1"], ["2", "`a + **a + 2`", "a + 1 + 2 = a + 3", "address of row 3"], ["3", "`*(a + 3)`", "row 3, as the address of a[3][0]", "address"], ["4", "`*(a + 3) + 3`", "address of a[3][3]", "address"], ["5", "`*(…)`", "the element a[3][3]", "19"]], caption: "Other expressions on the same array, compiled and run: `*(*(a+1)+2)` = 8, `**(a+3)` = 16, `*(a[2]+1)` = 12." },

    { t: "h3", text: "GATE 2025 (forenoon), Q61: a recursive count over a moving pointer" },
    { t: "p", text: "A two-mark numerical question that combines this chapter with recursion (chapter 8). The function counts something about an array, and moves along it by passing `S + 1` with one less element." },
    { t: "ex", id: "c11-e7" },
    { t: "fig", id: "c11-f6" },
    { t: "p", text: "**What it tests.** Reading what the function counts, and not tracing nine calls blindly. At each step it compares the first two elements. If they are different, it counts 1 and goes on; if they are equal, it counts nothing and goes on. When one element is left it returns 1 for that last element. So it returns the number of **runs**, that is, the number of groups of equal neighbours: 0 | 1 | 2 2 2 | 0 0 | 1 1, which is 5 groups. **Where marks are lost:** answering 9 (the length), 4 (the number of changes, forgetting the final 1), or the number of distinct values (3)." },
    { t: "table", head: ["Array", "Runs", "foo returns"], rows: [["0, 1, 2, 2, 2, 0, 0, 1, 1 (the question)", "0 | 1 | 222 | 00 | 11", "5"], ["1, 1, 1, 1", "one run", "1"], ["1, 2, 3", "three runs", "3"], ["5, 5, 6, 6, 5", "55 | 66 | 5", "3"]], caption: "Compiled and run." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["`p + n` moves a pointer by n **elements** (n times the size of the pointed-to type). `q - p` is a count of elements; pointers into one array can be compared.", "`a[i]` is `*(a + i)`; a pointer can be indexed too: `ip[k]` is `*(ip + k)`, and a negative k reaches backwards.", "An array name is not a variable (`a++` is an error); a pointer is.", "`*p++` uses the element then moves p; `*++p` moves p then uses the element; `(*p)++` changes the element and leaves p alone.", "In a two-dimensional array, `a + 1` moves a whole row, while `a[1] + 1` and `*(a + 1) + 1` move one element; an element pointer can run past the end of its row into the next.", "`foo(S + 1, n - 1)` passes the rest of an array; recursive functions use it to walk along an array."] },
  ],
  blocks: [
    { type: "figure", id: "c11-f1", caption: "int a[4] at address 1000: a + 1 is 1004, a + 3 is 1012. The pointer moves by whole elements of 4 bytes.", alt: "Four int cells at addresses 1000 to 1012 with pointers a and a plus 3.", fig: { kind: "array", title: "int a[4] = {10, 20, 30, 40};", data: [[10, 20, 30, 40]], base: 1000, size: 4, index: true, tones: { "0,3": "hl" }, pointers: [{ name: "a", at: [0, 0] }, { name: "a + 3", at: [0, 3] }] } },
    { type: "figure", id: "c11-f2", caption: "ip = arr + 4. Then ip[1] is arr[5] (6), ip[-1] is arr[3] (4), and *(ip + 3) is arr[7] (8).", alt: "The array 1 to 9 with the pointer ip at index 4 and ip[1] highlighted at index 5.", fig: { kind: "array", title: "int *ip = arr + 4;", data: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 5]], index: true, tones: { "0,5": "hl", "0,3": "dim", "0,7": "dim" }, pointers: [{ name: "ip", at: [0, 4] }] } },
    { type: "figure", id: "c11-f3", caption: "int a[3][4] at 1000. a + 1 moves a whole row (16 bytes). a[1] + 1 moves one element (4 bytes). The rows lie one after another in memory.", alt: "A three by four array with the row pointer a plus 1 at row 1 and the element pointer a[1] plus 2 at a[1][2].", fig: { kind: "array", title: "int a[3][4]", data: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], base: 1000, size: 4, index: true, rowIndex: true, tones: { "1,2": "hl" } } },
    { type: "figure", id: "c11-f4", caption: "GATE 2025 AN Q62 step by step. (*ptr)++ changes the element; ptr++ moves the pointer.", alt: "Three frames of the array 30, 50, 10 with the pointer ptr at index 1, then arr[1] equal to 51, then ptr at index 2.", fig: { kind: "frames", title: "ptr = &arr[0] + 1; a = *ptr; (*ptr)++; ptr++;", frames: [
      { caption: "ptr = &arr[0] + 1 points at arr[1] (50). a = *ptr copies 50.", fig: { kind: "array", data: [[30, 50, 10, 0, 0]], index: true, tones: { "0,1": "hl" }, pointers: [{ name: "ptr", at: [0, 1] }] } },
      { caption: "(*ptr)++ adds 1 to the element arr[1]: it becomes 51. ptr does not move.", fig: { kind: "array", data: [[30, 51, 10, 0, 0]], index: true, tones: { "0,1": "ok" }, pointers: [{ name: "ptr", at: [0, 1] }] } },
      { caption: "ptr++ moves the pointer on to arr[2] (10). The print is 50 + 10 + 51 = 111.", fig: { kind: "array", data: [[30, 51, 10, 0, 0]], index: true, tones: { "0,1": "dim", "0,2": "hl" }, pointers: [{ name: "ptr", at: [0, 2] }] } },
    ] } },
    { type: "figure", id: "c11-f5", caption: "GATE 2020 FN Q16: **a is 1, so a + 1 + 2 is row 3, and the element at column 3 of row 3 is 19.", alt: "The four by five array with a[3][3] equal to 19 highlighted.", fig: { kind: "array", title: "*(*(a + **a + 2) + 3) = a[3][3]", data: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20]], index: true, rowIndex: true, tones: { "3,3": "ok" } } },
    { type: "figure", id: "c11-f6", caption: "GATE 2025 FN Q61: foo counts runs of equal neighbours. Each call looks at the first two elements and moves on by S + 1.", alt: "A table of the calls of foo with the first two elements and what each call returns.", fig: { kind: "trace", title: "foo(A, 9) with A = 0 1 2 2 2 0 0 1 1", cols: ["Call (elements left)", "S[0], S[1]", "different?", "adds"], rows: [{ cells: ["9: 0 1 2 2 2 0 0 1 1", "0, 1", "yes", "1"] }, { cells: ["8: 1 2 2 2 0 0 1 1", "1, 2", "yes", "1"] }, { cells: ["7: 2 2 2 0 0 1 1", "2, 2", "no", "0"] }, { cells: ["6: 2 2 0 0 1 1", "2, 2", "no", "0"] }, { cells: ["5: 2 0 0 1 1", "2, 0", "yes", "1"] }, { cells: ["4: 0 0 1 1", "0, 0", "no", "0"] }, { cells: ["3: 0 1 1", "0, 1", "yes", "1"] }, { cells: ["2: 1 1", "1, 1", "no", "0"] }, { cells: ["1: 1", "size 1: return 1", "", "1"], tone: "ok", note: "1+1+1+1+1 = 5" }] } },

    { type: "example", id: "c11-e1", level: "gate", title: "GATE CS 2019 (forenoon), Q15 · 1 mark · NAT", file: "gate2019_q15.c", given: `#include <stdio.h>

int main ( ) {
    int arr[ ] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 5}, *ip = arr + 4;
    printf ("%d\\n", ip[1]);
    return 0;
}`, find: "The number displayed.", steps: [
      { say: "ip = arr + 4 points at arr[4], which is 5.", result: "ip -> arr[4]" },
      { say: "ip[1] is *(ip + 1), the element after: arr[5].", result: "arr[5] = 6" },
    ], answer: "6", check: "Official answer 6. The program was compiled and run." },
    { type: "example", id: "c11-e2", level: "gate", title: "GATE CS 2024 (afternoon), Q50 · 2 marks · MCQ", file: "gate2024_an_q50.c", given: `#include <stdio.h>

int main() {
    double a[2]={20.0,25.0},*p, *q;
    p = a;
    q = p + 1;
    printf ("%d, %d",(int)(q - p),(int)(*q - *p));
    return 0;
}`, find: "The output. Options: (A) 4, 8  (B) 1, 5  (C) 8, 5  (D) 1, 8", steps: [
      { say: "q = p + 1 is the next double. Subtracting pointers counts elements, not bytes.", result: "q − p = 1" },
      { say: "*q is 25.0 and *p is 20.0; the difference 5.0 is cast to int.", result: "5" },
    ], answer: "(B) 1, 5", check: "Official answer (B). The program was compiled and run and printed 1, 5." },
    { type: "example", id: "c11-e3", level: "gate", title: "GATE CS 2025 (afternoon), Q62 · 2 marks · NAT", file: "gate2025_an_q62.c", given: `#include <stdio.h>

int main( ) {
    int a;
    int arr[5] = {30, 50, 10};
    int *ptr;
    ptr = &arr[0] + 1;
    a = *ptr;
    (*ptr)++;
    ptr++;
    printf("%d", a + (*ptr) + arr[1]);
    return 0;
}`, find: "The output.", steps: [
      { say: "arr = {30, 50, 10, 0, 0}. ptr = &arr[0] + 1 points at arr[1], so a = 50.", result: "a = 50" },
      { say: "(*ptr)++ increases the element arr[1] to 51. ptr does not move.", result: "arr[1] = 51" },
      { say: "ptr++ moves ptr to arr[2], which is 10.", result: "*ptr = 10" },
      { say: "a + *ptr + arr[1] = 50 + 10 + 51.", result: "111" },
    ], answer: "111", check: "Official answer 111. The program was compiled and run." },
    { type: "example", id: "c11-e4", level: "gate", title: "GATE CS 2019 (forenoon), Q65 · 2 marks · NAT", file: "gate2019_q65.c", given: `#include <stdio.h>

int main ( )
{
    int a[ ] = {2, 4, 6, 8, 10};
    int i, sum = 0, *b = a + 4;
    for (i = 0; i < 5; i++)
        sum = sum + (*b - i) - *(b - i);
    printf ("%d\\n", sum);
    return 0;
}`, find: "The output.", steps: [
      { say: "b = a + 4 points at a[4] = 10, so *b is always 10.", result: "*b = 10" },
      { say: "(*b − i) is the value 10 − i; *(b − i) is the element a[4 − i].", result: "10 − i, a[4 − i]" },
      { say: "The terms for i = 0 to 4: (10 − 10), (9 − 8), (8 − 6), (7 − 4), (6 − 2) = 0, 1, 2, 3, 4.", result: "sum = 10" },
    ], answer: "10", check: "Official answer 10. The program was compiled and run." },
    { type: "example", id: "c11-e5", level: "gate", title: "GATE CS 2021 (afternoon), Q52 · 1 mark · MCQ", file: "gate2021_an_q52.c", given: `#include <stdio.h>

int main( ) {
    int arr[4] [5] ;
    int i, j;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 5; j++) {
            arr[i] [j] = 10 * i + j;
        }
    }
    printf("%d", *(arr[1] + 9));
    return 0;
}`, find: "The output. Options: (A) 14  (B) 20  (C) 24  (D) 30", steps: [
      { say: "arr[i][j] holds 10·i + j. Row 1 has five elements.", result: "5 columns" },
      { say: "arr[1] is the address of arr[1][0]. Adding 9 moves nine elements along, through the end of row 1.", result: "9 elements on" },
      { say: "Row 1 uses 5 of them; the remaining 4 land in row 2: that is arr[2][4].", result: "arr[2][4]" },
      { say: "arr[2][4] = 10 × 2 + 4.", result: "24" },
    ], answer: "(C) 24", check: "Official answer (C). The program was compiled and run." },
    { type: "example", id: "c11-e6", level: "gate", title: "GATE CS 2020 (forenoon), Q16 · 1 mark · NAT", file: "gate2020_q16.c", given: `#include <stdio.h>

int main( ) {
    int a[4][5] = {{1, 2, 3, 4, 5},
                   {6, 7, 8, 9, 10},
                   {11, 12, 13, 14, 15},
                   {16, 17, 18, 19, 20}};
    printf("%d\\n",*(*(a+**a+2)+3));
    return(0);
}`, find: "The output.", steps: [
      { say: "**a is *(*a): *a is row 0, and *(*a) is a[0][0].", result: "1" },
      { say: "a + **a + 2 = a + 1 + 2 = a + 3: three rows on, the address of row 3.", result: "row 3" },
      { say: "*(a + 3) is row 3 as the address of a[3][0]; + 3 gives the address of a[3][3].", result: "a[3][3]" },
      { say: "The outer * reads it.", result: "19" },
    ], answer: "19", check: "Official answer 19. The program was compiled and run." },
    { type: "example", id: "c11-e7", level: "gate", title: "GATE CS 2025 (forenoon), Q61 · 2 marks · NAT", file: "gate2025_q61.c", given: `#include <stdio.h>

int foo(int S[ ], int size) {
    if(size == 0) return 0;
    if(size == 1) return 1;
    if(S[0] != S[1]) return 1 + foo(S + 1, size - 1);
    return foo(S + 1, size - 1);
}

int main( ) {
    int A[ ] = {0, 1, 2, 2, 2, 0, 0, 1, 1};
    printf("%d", foo(A, 9));
    return 0;
}`, find: "The value printed.", steps: [
      { say: "Each call compares S[0] and S[1] and then moves on with S + 1 and one element less.", result: "walks along the array" },
      { say: "A difference adds 1; an equal pair adds 0. The differences are at 0|1, 1|2, 2|0 and 0|1: four of them.", result: "4 differences" },
      { say: "The last call (one element) returns 1.", result: "+ 1" },
    ], answer: "5", check: "Official answer 5. The program was compiled and run. It counts runs of equal neighbours." },

    { type: "trap", wrong: "q - p gives the distance between two pointers in bytes.", tempting: "Addresses are byte numbers, so their difference should be bytes.", whyWrong: "Pointer subtraction divides by the element size: it counts elements. Only after casting both to char * do you get bytes.", rule: "Pointer difference is in elements.", ex: { code: "int a[5] = {1, 2, 3, 4, 5};\nint *p = a, *q = a + 4;\nprintf(\"%d %d\", (int)(q - p), (int)((char *)q - (char *)p));", out: "4 16" } },
    { type: "trap", wrong: "An array name can be incremented like a pointer: a++.", tempting: "a[i] is *(a + i), so a seems to be a pointer.", whyWrong: "The array name stands for a fixed address and is not a variable. a++ and a = a + 1 are errors. Copy it into a pointer first.", rule: "Pointers move; array names do not.", ex: { text: "`int a[3]; int *p = a; p++;` is fine: p moves to a[1]. `a++;` does not compile." } },
    { type: "trap", wrong: "*p++ adds 1 to the element p points at.", tempting: "It reads like 'p, plus plus', and the star is in front.", whyWrong: "++ binds to p first: *p++ is *(p++): it uses the element and then moves the pointer. (*p)++ is the one that changes the element.", rule: "Use brackets to decide: (*p)++ changes the box, *p++ moves the pointer.", ex: { code: "int a[3] = {10, 20, 30};\nint *p = a;\nint x = *p++;\nprintf(\"%d %d\", x, *p);", out: "10 20" } },
    { type: "trap", wrong: "a + 1 and a[1] + 1 both move one element in a 2-D array.", tempting: "Both add 1 to something that looks like an address.", whyWrong: "a is an array of rows: a + 1 moves a whole row. a[1] is a row, which turns into a pointer to an element: a[1] + 1 moves one element.", rule: "a + 1: one row. a[1] + 1: one element.", ex: { code: "int a[3][4];\nprintf(\"%d %d\", (int)((char *)(a + 1) - (char *)a),\n        (int)((char *)(a[0] + 1) - (char *)a));", out: "16 4" } },
    { type: "gate", text: "Seven questions have been asked on this chapter: indexing a pointer (2019 FN Q15), pointer difference (2024 AN Q50), element versus pointer increment (2025 AN Q62), stepping backwards from the last element (2019 FN Q65), crossing a row with arr[1] + 9 (2021 AN Q52), a nested dereference of a two-dimensional array (2020 FN Q16) and a recursive walk with S + 1 (2025 FN Q61). All seven are worked above." },
    { type: "recall", cards: [
      { q: "What does p + 1 do for an int pointer?", a: "Moves to the next int, 4 bytes on." },
      { q: "What is q − p for two pointers into one array?", a: "The number of elements between them." },
      { q: "What is a[i] in terms of pointers?", a: "*(a + i)." },
      { q: "What is ip[-1]?", a: "*(ip − 1), the element before." },
      { q: "What does *p++ do?", a: "Uses the element p points at, then moves p." },
      { q: "What does (*p)++ do?", a: "Adds 1 to the element; p does not move." },
      { q: "In int a[3][4], what does a + 1 point at?", a: "Row 1 (16 bytes further on)." },
      { q: "In the same array, what does a[1] + 1 point at?", a: "a[1][1], one element further." },
      { q: "Can a pointer into one row reach the next row?", a: "Yes, as long as it stays inside the whole array." },
      { q: "What does foo(S + 1, size − 1) pass?", a: "The rest of the array without its first element." },
    ] },
    { type: "check", questions: [
      { id: "q1", kind: "NAT", marks: 1, q: "int arr[] = {1,2,3,4,5,6,7,8,9}; int *ip = arr + 4; What is ip[1]?", answer: "6", solution: "arr[5]." },
      { id: "q2", kind: "NAT", marks: 1, q: "int arr[] = {1,2,3,4,5,6,7,8,9}; int *ip = arr + 4; What is ip[-2]?", answer: "3", solution: "arr[2]." },
      { id: "q3", kind: "NAT", marks: 1, q: "double a[2] = {20.0, 25.0}, *p = a, *q = a + 1; What is (int)(q - p)?", answer: "1", solution: "One element apart." },
      { id: "q4", kind: "NAT", marks: 1, q: "int a[3] = {10, 20, 30}; int *p = a; int x = *p++; What is *p?", answer: "20", solution: "p moved to a[1]." },
      { id: "q5", kind: "MCQ", marks: 1, q: "int a[3] = {10, 20, 30}; int *p = a; (*p)++; What is a[0]?", options: ["10", "11", "20", "30"], answer: "B", solution: "(*p)++ increases the element." },
      { id: "q6", kind: "NAT", marks: 2, q: "int a[4][5] with a[i][j] = 10 * i + j. What is *(a[2] + 3)?", answer: "23", solution: "a[2][3]." },
      { id: "q7", kind: "NAT", marks: 2, q: "int a[4][5] with a[i][j] = 10 * i + j. What is *(a[1] + 5)?", answer: "20", solution: "a[1] + 5 is the start of row 2: a[2][0]." },
      { id: "q8", kind: "NAT", marks: 2, q: "int a[] = {2,4,6,8,10}; int i, sum = 0, *b = a + 4; for (i = 0; i < 5; i++) sum += *(b - i); What is sum?", answer: "30", solution: "10 + 8 + 6 + 4 + 2." },
      { id: "q9", kind: "MSQ", marks: 2, q: "Which are true?", options: ["For int *p, p + 1 is 4 bytes further than p (4-byte int)", "q − p counts bytes", "a[i] is the same as *(a + i)", "The array name a can be incremented with a++"], answer: "A, C", solution: "B: elements, not bytes. D: not allowed." },
      { id: "q10", kind: "NAT", marks: 2, q: "int foo(int S[], int n) { if (n == 1) return 1; if (S[0] != S[1]) return 1 + foo(S + 1, n - 1); return foo(S + 1, n - 1); }  What is foo for the array {5, 5, 6, 6, 5} with n = 5?", answer: "3", solution: "Three runs: 55, 66, 5." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on pointers", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: strings", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Arrays (C9)", "Pointers I (C10)"], usedIn: ["Strings (C12)", "Pointers III (C13)", "Linked lists (D3)"], cross: ["Computer Organisation: addressing"] },
  ],
};
