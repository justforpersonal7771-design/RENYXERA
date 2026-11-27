import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D2 "Arrays: the block of boxes" (27 Nov 2026). Programs compiled and run with gcc (scripts/chapter-check.ts):
 * insert at index 2 shifts three items; a[3][4] of int has a[2][1] at byte offset 36; packed lower triangle of a 4x4 puts (3,1) at 7 and needs 10 cells;
 * binary search over 15 sorted items needs 4 probes for the first item and 4 for a missing one; realloc doubling after 10 pushes has capacity 16.
 */
export const chapterD2: Topic = {
  id: "cs.pds.ds.arrays2",
  title: "Arrays: the block of boxes",
  no: "D2",
  book: [
    { t: "p", text: "The array is the oldest and simplest data structure: a row of equal-sized boxes, side by side in memory, each reached by its number. Almost everything else in this book is either built on an array or defined by what it does better than one. If you know exactly what an array costs, and why, every later structure becomes easy to judge." },
    { t: "p", text: "In this chapter we treat the array as a data structure rather than a C feature: what each operation costs, how the computer finds an element from its index, how two-dimensional and special arrays are laid out, how binary search uses the order, and how a growing array keeps its promise of cheap appends." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["state the cost of access, search, insert and delete in an array, and explain each from the picture;", "compute the address of any element of a 1-D, 2-D or 3-D array with any lower bound, in row-major or column-major order;", "find the position of an element in a packed triangular, symmetric or tri-diagonal matrix;", "count the comparisons of binary search, best and worst;", "explain why a doubling array appends in amortised constant time."] },

    { t: "h2", text: "What an array is" },
    { t: "p", text: "An **array** is a collection of n items of the **same type** stored in **consecutive memory locations**. Because every item has the same size w bytes, the computer does not need to search for an item: it calculates where the item is. This calculation takes one multiplication and one addition, whatever n is. That is called **random access** and it is the great strength of the array." },
    { t: "fig", id: "d2-f1" },
    { t: "p", text: "Look at the figure: the array starts at address 1000, each int takes 4 bytes, so item number i sits at 1000 + 4i. The first item has index 0 in C. The address of an item is its **base address** plus **index × width**. The rest of this chapter is variations on that one sentence." },
    { t: "p", text: "The price of this neat layout is that the array is **rigid**. Its size is fixed when it is made, and the items are packed with no gaps. You cannot slip a new item between two others without moving the ones behind it; you cannot remove a middle item without closing the hole; and you cannot make the array one box longer if the next box in memory belongs to something else." },
    { t: "callout", kind: "key", text: "An array trades flexibility for speed of access: any item in one step, but insert and delete in the middle move many items." },

    { t: "h2", text: "What each operation costs" },
    { t: "p", text: "Let the array hold n items in positions 0 to n − 1 with room to spare. We count item moves and comparisons." },
    { t: "table", head: ["Operation", "How it works", "Cost"], rows: [["Access a[i]", "address = base + i × w", "Θ(1)"], ["Search, unsorted", "compare one by one", "Θ(n) worst, (n+1)/2 on average if present"], ["Search, sorted", "binary search (below)", "Θ(log n)"], ["Insert at the end", "write into the next free box", "Θ(1) (if room)"], ["Insert at position k", "shift items k..n−1 right, then write", "up to n moves"], ["Delete at position k", "shift items k+1..n−1 left", "up to n − 1 moves"]] },
    { t: "p", text: "The program below inserts 99 at index 2 of the array 10, 20, 30, 40. The loop moves the **last item first**; if it moved the first one first it would overwrite its neighbour before copying it." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[6] = {10, 20, 30, 40};
    int n = 4, k = 2;
    for (int i = n; i > k; i--) a[i] = a[i - 1];   /* shift right, last item first */
    a[k] = 99;
    n++;
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    return 0;
}`, out: "10 20 99 30 40 ", file: "array_insert.c" },
    { t: "ex", id: "d2-e1" },
    { t: "p", text: "Inserting at the front is the worst case: all n items move. Inserting at the end is the best: none move. If the position is equally likely to be anywhere from 0 to n, the **average** is n / 2 moves, still Θ(n). Deleting is the same story in reverse." },
    { t: "callout", kind: "tip", text: "Insert or delete in an array: (items after the position) moves. Position 0 is the worst, the end is the best." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Finding the address of an element" },
    { t: "p", text: "GATE likes the address formula, partly because it also reveals whether you understand the layout. For a 1-D array whose first index is **L** (the **lower bound**) the item with index i is the (i − L)th one from the start, so" },
    { t: "callout", kind: "key", text: "address of A[i] = base + (i − L) × w" },
    { t: "p", text: "In C, L is 0, so it reduces to base + i × w. Other languages allow any lower bound: an array declared A[−5..10] has 16 items, and A[−5] is the first. The formula is the same; only L changes." },
    { t: "ex", id: "d2-e2" },
    { t: "p", text: "A quick way to check any such formula is to test the first item: i = L gives address base, as it must. If your formula fails this, it is wrong." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Two-dimensional arrays: rows first or columns first" },
    { t: "p", text: "Memory is one long line, so a table must be flattened. There are two standard ways. **Row-major** order stores row 0 completely, then row 1, and so on: this is what C does. **Column-major** order stores column 0 first, then column 1: this is what Fortran does. The two orders give the same table but different addresses." },
    { t: "fig", id: "d2-f2" },
    { t: "p", text: "For an array declared with rows from R₀ to R₁ and columns from C₀ to C₁, let **nr** be the number of rows and **nc** the number of columns. Then for the item in row i and column j:" },
    { t: "table", head: ["Order", "Items before it", "Address"], rows: [["Row-major", "(i − R₀) full rows of nc items, plus (j − C₀) in its own row", "base + [(i − R₀) × nc + (j − C₀)] × w"], ["Column-major", "(j − C₀) full columns of nr items, plus (i − R₀) in its own column", "base + [(j − C₀) × nr + (i − R₀)] × w"]] },
    { t: "p", text: "Notice that **row-major multiplies by the number of columns**, nc, and column-major by the number of rows, nr. Reading the formulas off the picture, not from memory, is the safest way: count how many whole rows (or columns) come first, then how far along its own row (or column) the item is." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[3][4];
    long off = (char *)&a[2][1] - (char *)&a[0][0];     /* bytes from the start */
    printf("%ld\\n", off);
    return 0;
}`, out: "36", file: "row_major_offset.c" },
    { t: "p", text: "The program confirms it: for int a[3][4], item a[2][1] has two whole rows (8 items) plus one before it, 9 items, so its offset is 9 × 4 = 36 bytes. A three-dimensional array adds one more level: A[i][j][k] for sizes d₁ × d₂ × d₃ sits (i × d₂ + j) × d₃ + k items from the start, in row-major order." },
    { t: "ex", id: "d2-e3" },
    { t: "ex", id: "d2-e4" },
    { t: "trap", i: 2 },

    { t: "h2", text: "Special matrices stored compactly" },
    { t: "p", text: "A **square matrix** n × n normally takes n² cells. If many entries are known in advance (zero, or equal to another entry) we can store only the **useful** ones in a one-dimensional array and compute where each lives. GATE asks for the position of an element and the size of the packed array." },
    { t: "h3", text: "Lower triangular matrix" },
    { t: "p", text: "In a lower triangular matrix every entry above the diagonal is 0, so only entries with i ≥ j are kept. Row 0 has 1 useful entry, row 1 has 2, row 2 has 3 and so on. Storing them row by row, with 0-based indices, entry (i, j) comes after 1 + 2 + … + i = **i(i + 1)/2** earlier entries, and then j more in its own row:" },
    { t: "callout", kind: "key", text: "Lower triangle, row-wise, 0-based: position of (i, j) = i(i + 1)/2 + j, and the packed array has n(n + 1)/2 cells." },
    { t: "p", text: "This is the sum 1 + 2 + … + n from chapter D1, put to work. With 1-based indices the position is i(i − 1)/2 + j, counted from 1. Do not mix the two: check with the first entry (0,0) or (1,1), which must be the very first cell." },
    { t: "fig", id: "d2-f3" },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int n = 4, count = 0, pos31 = -1;
    for (int i = 0; i < n; i++)
        for (int j = 0; j <= i; j++) {            /* only i >= j is stored */
            if (i == 3 && j == 1) pos31 = count;  /* where (3,1) lands */
            count++;
        }
    printf("%d %d\\n", pos31, count);
    return 0;
}`, out: "7 10", file: "triangle_pack.c" },
    { t: "p", text: "The program walks the stored entries in order: (3,1) is the 8th entry, at position 7 from 0, and the whole triangle has 4 × 5 / 2 = 10 cells instead of 16. A **symmetric** matrix (a[i][j] = a[j][i]) stores the same triangle and reads the mirror entry when i < j. An upper triangle works the same way with the roles reversed, or can be stored column by column." },
    { t: "h3", text: "Diagonal, tri-diagonal and sparse" },
    { t: "p", text: "A **diagonal** matrix keeps only the n diagonal entries: a[i][i] is at position i. A **tri-diagonal** matrix keeps the diagonal and the two diagonals next to it, 3n − 2 entries in all, and entry (i, j) with |i − j| ≤ 1 sits at position 2i + j in 0-based row-wise storage (for the first row, check: (0,0) → 0, (0,1) → 1, then (1,0) → 2). A **sparse** matrix has few non-zero entries; we store them as triples (row, column, value), trading the cheap formula for a big saving in space." },
    { t: "ex", id: "d2-e5" },
    { t: "trap", i: 3 },

    { t: "h2", text: "Binary search: using the order" },
    { t: "p", text: "If the array is **sorted**, you do not have to look at every item. Compare the key with the **middle** item. If they are equal, you are done; if the key is smaller, it can only be in the left half; if larger, in the right half. Either way you throw away half of what remains, and repeat." },
    { t: "fig", id: "d2-f4" },
    { t: "p", text: "Each probe halves the range, and a range of n can be halved only about log₂ n times before one item is left. That is the logarithm of chapter D1 at work. So binary search takes **at most ⌊log₂ n⌋ + 1** comparisons. For 1,000 items that is 10; for a million, 20; for a billion, 30." },
    { t: "code", text: `#include <stdio.h>

int probes(int a[], int n, int key) {
    int lo = 0, hi = n - 1, c = 0;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        c++;
        if (a[mid] == key) return c;
        if (a[mid] < key) lo = mid + 1; else hi = mid - 1;
    }
    return c;
}

int main(void) {
    int a[15];
    for (int i = 0; i < 15; i++) a[i] = i + 1;
    printf("%d %d\\n", probes(a, 15, 1), probes(a, 15, 16));
    return 0;
}`, out: "4 4", file: "binary_search.c" },
    { t: "p", text: "For the 15 sorted items 1 to 15, finding 1 takes 4 probes (positions 7, 3, 1, 0) and so does the missing 16. Searching for the middle item takes 1. The key to remember is that binary search needs **random access**: it jumps to the middle in one step, which an array allows and a linked list does not (chapter D3). A sorted linked list gains nothing from the idea." },
    { t: "callout", kind: "warning", text: "Binary search needs a sorted array. Sorting costs more than one linear search, so for a single lookup in unsorted data, just scan." },
    { t: "ex", id: "d2-e6" },
    { t: "trap", i: 4 },

    { t: "h2", text: "Arrays that grow" },
    { t: "p", text: "A plain array cannot grow, but a **dynamic array** can pretend to. It keeps a **capacity** (the boxes allocated) and a **size** (the boxes in use). An append writes into the next free box in one step. When size equals capacity it allocates a block **twice** as large, copies the items across, and frees the old block. This is what `realloc` is for, and what C++'s vector and Python's list do inside." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int cap = 1, size = 0;
    int *a = malloc(cap * sizeof *a);
    for (int i = 0; i < 10; i++) {
        if (size == cap) { cap *= 2; a = realloc(a, cap * sizeof *a); }
        a[size++] = i;
    }
    printf("%d %d\\n", size, cap);
    free(a);
    return 0;
}`, out: "10 16", file: "dynamic_array.c" },
    { t: "p", text: "After ten appends the size is 10 and the capacity 16, because the array doubled at sizes 1, 2, 4 and 8. A single append that triggers a doubling costs n, but we saw in chapter D1 that the doubling sum 1 + 2 + 4 + … keeps the **total** under about 2n, so an append has **amortised** cost O(1). Growing by a fixed amount (say 10 boxes each time) would not: its total is Θ(n²) for n appends, which is why doubling is used." },
    { t: "trap", i: 5 },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Arrays appear in three forms. The first is a **address or offset** question: a declaration with odd bounds and a base address, asking for the address of one item (examples 2 to 4). The second is a **cost** question: how many moves to insert or delete, or how many comparisons binary search takes. The third is a **compact storage** question: the position of an element in a packed triangle, or the size of the packed array (example 5). Arrays also hide inside questions on other structures: heaps are arrays, and hash tables are arrays." },
    { t: "ex", id: "d2-e7" },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you count the items **before** the one you want and multiply by the width. Draw the layout, count whole rows or columns first, then the steps along the row. Keep the lower bound in the subtraction and check the first element." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Forgetting to subtract the lower bound (i − L).", "Using nr instead of nc when the order is row-major, or the reverse for column-major.", "Mixing 0-based and 1-based formulas for the triangle.", "Forgetting the width w, or giving an answer in items rather than bytes.", "Using binary search on an unsorted array, or counting ⌈log₂ n⌉ when the answer is ⌊log₂ n⌋ + 1."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["An array is one block of equal boxes; access is address = base + (i − L) × w, in one step.", "Insert and delete in the middle move items: Θ(n); at the end, Θ(1).", "Row-major multiplies by the number of columns, column-major by the number of rows; check the first item.", "Lower triangle (0-based): position i(i+1)/2 + j; size n(n+1)/2.", "Binary search needs a sorted array with random access: at most ⌊log₂ n⌋ + 1 probes.", "A dynamic array doubles when full: amortised O(1) append."] },
  ],
  blocks: [
    { type: "figure", id: "d2-f1", caption: "int a[5] at address 1000. Item i sits at 1000 + 4i, so any item is found by arithmetic, in one step.", alt: "Five array cells with values 12, 7, 31, 4, 20 and addresses 1000 to 1016.", fig: { kind: "array", title: "One block of equal boxes", data: [[12, 7, 31, 4, 20]], base: 1000, size: 4, index: true, tones: { "0,3": "hl" } } },
    { type: "figure", id: "d2-f2", caption: "A 2 × 3 table stored in row-major and in column-major order. The same six values land in different places.", alt: "Two rows of six cells: row-major order 1 2 3 4 5 6 and column-major order 1 4 2 5 3 6 for the table 1 2 3 over 4 5 6.", fig: { kind: "matrix", title: "Table 1 2 3 / 4 5 6", cols: ["0", "1", "2", "3", "4", "5"], rows: [{ label: "row-major", cells: [1, 2, 3, 4, 5, 6] }, { label: "column-major", cells: [1, 4, 2, 5, 3, 6], hl: true }] } },
    { type: "figure", id: "d2-f3", caption: "A 4 × 4 lower triangle stored row by row. Row i holds i + 1 entries, so (3,1) is preceded by 1 + 2 + 3 = 6 entries and then one more in its own row: position 7.", alt: "A table of the ten stored entries with their position numbers 0 to 9.", fig: { kind: "matrix", title: "Packed lower triangle, n = 4", cols: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], rows: [{ label: "entry (i,j)", cells: ["00", "10", "11", "20", "21", "22", "30", "31", "32", "33"] }, { label: "position", cells: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], hl: true }] } },
    { type: "figure", id: "d2-f4", caption: "Binary search for 11 in 1 to 15. Probes at 8, then 12, then 10, then 11: the range shrinks 15, 7, 3, 1.", alt: "Four frames of the sorted array 1 to 15 showing the shrinking range around 11.", fig: { kind: "frames", title: "Find 11 in 1..15", frames: [
      { caption: "Probe 1: middle is 8. 11 is larger, so look right.", fig: { kind: "array", data: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]], base: 0, size: 1, index: true, tones: { "0,7": "hl" } } },
      { caption: "Probe 2: the range is 9 to 15, middle is 12. 11 is smaller, so look left.", fig: { kind: "array", data: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]], base: 0, size: 1, index: true, tones: { "0,11": "hl", "0,7": "dim" } } },
      { caption: "Probe 3: the range is 9 to 11, middle is 10. 11 is larger, so look right.", fig: { kind: "array", data: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]], base: 0, size: 1, index: true, tones: { "0,9": "hl", "0,11": "dim" } } },
      { caption: "Probe 4: one item left, 11. Found, after 4 probes.", fig: { kind: "array", data: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]], base: 0, size: 1, index: true, tones: { "0,10": "ok" } } },
    ] } },

    { type: "example", id: "d2-e1", level: "easy", title: "Insert into an array and count the moves", file: "array_insert.c", given: `a = {10, 20, 30, 40}, capacity 6
insert 99 at index 2`, find: "The array afterwards and the number of items moved.", steps: [
      { say: "The items at index 2 and 3 (30 and 40) must move right, last first.", result: "2 moves" },
      { say: "a[4] = a[3] puts 40 at index 4; a[3] = a[2] puts 30 at index 3.", result: "10 20 30 30 40" },
      { say: "Now index 2 is free: write 99.", result: "10 20 99 30 40" },
    ], answer: "10 20 99 30 40, after 2 moves", check: "The program was compiled and run." },
    { type: "example", id: "d2-e2", level: "easy", title: "Address with a lower bound that is not zero", file: "address_1d.txt", given: `A[-5..10] of 4-byte integers, base address 2000
Find the address of A[3] and the total size.`, find: "The address of A[3], and the size of the array in bytes.", steps: [
      { say: "A[3] is the (3 − (−5)) = 8th item after A[−5].", result: "8" },
      { say: "Address = 2000 + 8 × 4.", result: "2032" },
      { say: "There are 10 − (−5) + 1 = 16 items, 4 bytes each.", result: "64 bytes" },
    ], answer: "2032; 64 bytes", check: "Check the first item: A[−5] gives 2000 + 0 = 2000, as it must." },
    { type: "example", id: "d2-e3", level: "gate", title: "Row-major and column-major address", file: "address_2d.txt", given: `A[1..5][1..4], each item 2 bytes, base address 100
Address of A[3][2]: row-major and column-major.`, find: "Both addresses.", steps: [
      { say: "There are nr = 5 rows and nc = 4 columns. In row-major, before A[3][2] come (3 − 1) = 2 whole rows of 4 and (2 − 1) = 1 item.", result: "2 × 4 + 1 = 9 items" },
      { say: "Address = 100 + 9 × 2.", result: "118" },
      { say: "In column-major, before it come (2 − 1) = 1 whole column of 5 and (3 − 1) = 2 items.", result: "1 × 5 + 2 = 7 items" },
      { say: "Address = 100 + 7 × 2.", result: "114" },
    ], answer: "Row-major 118; column-major 114", check: "The two orders differ, as they should; the first item A[1][1] is at 100 in both." },
    { type: "example", id: "d2-e4", level: "gate", title: "A three-dimensional array", file: "address_3d.txt", given: `int A[10][20][30] in C, base address 0, int is 4 bytes
Address of A[2][3][4].`, find: "The byte address.", steps: [
      { say: "Row-major: A[i][j][k] is (i × 20 + j) × 30 + k items from the start.", result: "(2 × 20 + 3) × 30 + 4" },
      { say: "Compute: 43 × 30 + 4.", result: "1294 items" },
      { say: "Multiply by 4 bytes.", result: "5176" },
    ], answer: "5176", check: "The innermost size (30) multiplies the combined outer index; the outermost size (10) is never used." },
    { type: "example", id: "d2-e5", level: "gate", title: "Position in a packed lower triangle", file: "triangle_pos.txt", given: `5 x 5 lower triangular matrix, entries with i >= j stored row by row in a 1-D array, 0-based.
Where is entry (4, 2)? How many cells are needed?`, find: "The position and the size.", steps: [
      { say: "Rows 0 to 3 hold 1 + 2 + 3 + 4 entries before row 4.", result: "10 entries" },
      { say: "Within row 4, column 2 is preceded by columns 0 and 1.", result: "2 more" },
      { say: "Position = 4 × 5 / 2 + 2.", result: "12" },
      { say: "Size = 5 × 6 / 2.", result: "15" },
    ], answer: "Position 12; 15 cells", check: "The last entry (4,4) is at 4 × 5 / 2 + 4 = 14, the last of 15 cells (0 to 14)." },
    { type: "example", id: "d2-e6", level: "gate", title: "Comparisons in binary search", file: "binary_count.txt", given: `A sorted array of 1000 elements. Binary search, worst case.`, find: "The most comparisons (probes) needed.", steps: [
      { say: "Each probe halves the range: 1000, 500, 250, 125, 62, 31, 15, 7, 3, 1.", result: "10 probes to reach one item" },
      { say: "Formula: ⌊log₂ 1000⌋ + 1, since log₂ 1000 is about 9.97.", result: "9 + 1 = 10" },
    ], answer: "10", check: "2⁹ = 512 < 1000 < 1024 = 2¹⁰, so the range can be halved 9 times and one more probe finishes." },
    { type: "example", id: "d2-e7", level: "gate", title: "Items moved to delete from an array", file: "delete_cost.txt", given: `An array holds n = 100 elements.
Delete the element at index 10 and close the gap.`, find: "The number of elements moved, and the worst case.", steps: [
      { say: "The elements at indices 11 to 99 each move one place left.", result: "99 − 10 = 89 moves" },
      { say: "The worst case is deleting index 0: all of the others move.", result: "99 moves" },
    ], answer: "89 moves; worst case 99 = n − 1", check: "Deleting the last element moves nothing." },

    { type: "trap", wrong: "To insert in the middle of an array you just write the new value there.", tempting: "Writing a[k] = x looks like an insert.", whyWrong: "That overwrites the old a[k]: the old item is lost and the length is unchanged. A true insert first shifts the items from the end down to k one place right, starting with the last, and only then writes.", rule: "Insert = shift right (last item first), then write.", ex: { code: "a = {10,20,30}  a[1] = 99  ->  {10,99,30}   (20 is gone)", out: "shift first: {10,99,20,30}" } },
    { type: "trap", wrong: "The address of A[i] is base + i × w, always.", tempting: "That is the formula for C, where arrays start at 0.", whyWrong: "If the lower bound is L, the item is the (i − L)th from the start. With A[−5..10] and base 2000, A[3] is at 2000 + 8 × 4 = 2032, not 2000 + 3 × 4 = 2012.", rule: "address = base + (i − L) × w.", ex: { code: "A[-5..10], base 2000, w 4:\nA[3] -> 2000 + (3 + 5) * 4", out: "2032" } },
    { type: "trap", wrong: "Row-major address of A[i][j] is base + (j × nr + i) × w.", tempting: "The formula looks familiar from column-major.", whyWrong: "That is the column-major formula. In row-major each full row before the item has nc items, so you multiply the row index by the number of columns: (i × nc + j).", rule: "Row-major: i × nc + j. Column-major: j × nr + i. Test with the first element.", ex: { code: "int a[3][4]; &a[2][1] - &a[0][0]  ->  2 * 4 + 1 items", out: "9 items = 36 bytes" } },
    { type: "trap", wrong: "A 4 × 4 lower triangle has n(n−1)/2 = 6 entries.", tempting: "The triangle seems to leave out the diagonal.", whyWrong: "The diagonal belongs to the lower triangle (i ≥ j). Row i has i + 1 entries, so the total is 1 + 2 + 3 + 4 = 10 = n(n + 1)/2.", rule: "Triangle with diagonal: n(n+1)/2 entries.", ex: { code: "n = 4: 1 + 2 + 3 + 4", out: "10" } },
    { type: "trap", wrong: "Binary search on 1000 items takes about log₂ 1000 = 9.97, so at most 9 probes.", tempting: "Rounding the logarithm down seems to give the count.", whyWrong: "The count of halvings is ⌊log₂ n⌋ = 9, but the last range of one item still needs a probe. The worst-case probes are ⌊log₂ n⌋ + 1 = 10.", rule: "Worst-case probes = ⌊log₂ n⌋ + 1.", ex: { code: "range: 1000 500 250 125 62 31 15 7 3 1  (10 probes)", out: "10" } },
    { type: "trap", wrong: "Growing a dynamic array by 10 boxes each time is as good as doubling.", tempting: "Both are rare copies.", whyWrong: "With a fixed step the copies happen every 10 appends and each copy is bigger: 10 + 20 + 30 + … which sums to Θ(n²) for n appends. Doubling gives 1 + 2 + 4 + … = O(n), so appends are amortised O(1).", rule: "Grow geometrically (double), never by a constant.", ex: { code: "n = 1000 appends, step 10: copies 10+20+...+990", out: "49,500 copies (doubling: 1,023)" } },

    { type: "gate", text: "Arrays are tested through address and offset formulas (1-D with a lower bound, 2-D in either order, 3-D), through the cost of insert, delete and binary search, and through packed triangular and symmetric matrices. Fragments of these appear inside questions on heaps and hash tables, which are arrays underneath." },
    { type: "recall", cards: [
      { q: "Address of A[i] with lower bound L?", a: "base + (i − L) × w." },
      { q: "Cost of a[i] access?", a: "Θ(1): one multiplication and one addition." },
      { q: "Cost of insert or delete in the middle?", a: "Up to n moves: Θ(n)." },
      { q: "Row-major address of A[i][j] (0-based, nc columns)?", a: "base + (i × nc + j) × w." },
      { q: "Column-major address of A[i][j] (0-based, nr rows)?", a: "base + (j × nr + i) × w." },
      { q: "Position of (i, j) in a packed lower triangle, 0-based, row-wise?", a: "i(i + 1)/2 + j." },
      { q: "Cells in a packed triangle of an n × n matrix?", a: "n(n + 1)/2." },
      { q: "Entries in a tri-diagonal n × n matrix?", a: "3n − 2." },
      { q: "Worst-case probes of binary search on n items?", a: "⌊log₂ n⌋ + 1." },
      { q: "Why does a doubling array append in O(1) amortised?", a: "Copies total 1 + 2 + 4 + … < 2n over n appends." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "An array int A[100] starts at address 5000 (4-byte ints, C indexing). What is the address of A[25]?", answer: "5100", solution: "5000 + 25 × 4 = 5100." },
      { id: "h2", kind: "NAT", marks: 1, q: "How many elements are moved to insert a value at the front of an array that holds 50 elements?", answer: "50", solution: "Every one of the 50 elements shifts right by one." },
      { id: "h3", kind: "MCQ", marks: 1, q: "Which operation on an array of n elements is Θ(1)?", options: ["Insert at the front", "Access a[i]", "Delete from the middle", "Unsorted search"], answer: "B", solution: "Access is a single address calculation." },
      { id: "h4", kind: "MCQ", marks: 1, q: "For a row-major array A[m][n], the address of A[i][j] is base + w × ...", options: ["(i × n + j)", "(j × m + i)", "(i × m + j)", "(i + j)"], answer: "A", solution: "Each of the i full rows before has n items." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["Binary search works on any array", "Appending to a doubling array is amortised O(1)", "A 5 × 5 lower triangle packs into 15 cells", "Random access makes insert in the middle fast"], answer: "B, C", solution: "Binary search needs a sorted array; insert in the middle still shifts items." },
      { id: "h6", kind: "NAT", marks: 2, q: "int A[10][20] in C (row-major), base 1000, int is 4 bytes. What is the address of A[3][5]?", answer: "1260", solution: "(3 × 20 + 5) × 4 = 260; 1000 + 260 = 1260." },
      { id: "h7", kind: "NAT", marks: 2, q: "A[1..6][1..5] in column-major order, 1 byte per item, base 0. What is the address of A[4][3]?", answer: "15", solution: "(3 − 1) × 6 + (4 − 1) = 15 items before it." },
      { id: "h8", kind: "NAT", marks: 2, q: "A sorted array has 2000 elements. What is the maximum number of comparisons binary search makes?", answer: "11", solution: "⌊log₂ 2000⌋ = 10 (since 1024 ≤ 2000 < 2048); +1 = 11." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on arrays", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "next: linked lists", href: "/study/data-structures" }] },
    { type: "links", prereq: ["What a data structure is (D0)", "Counting and growth (D1)", "Arrays in C (C9)", "Pointers II (C11)"], usedIn: ["Heaps (D10)", "Hashing", "Sorting and searching in Algorithms"], cross: ["COA: memory addressing"] },
  ],
};
