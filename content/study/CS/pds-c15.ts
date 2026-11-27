import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 15 "Dynamic memory: the heap" (28 Nov 2026). Real GATE questions explained in full: 2026_AN_Q17 (what lives in the heap), 2021_AN_Q35 (a linked list
 * whose last pointer is never set), 2017_FN_Q32 (a memory leak). The programs of the last two were not run as printed (one is undefined behaviour, one needs
 * a header the question omits); the same ideas were run in corrected programs. Every other program was compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterC15: Topic = {
  id: "cs.pds.c.heap15",
  title: "Dynamic memory: the heap",
  no: "15",
  book: [
    { t: "p", text: "Every variable you have declared so far had a size fixed by the program text: an `int`, an array of 10, a structure. But often the size is known only while the program runs: how many numbers will the user type, how many nodes will the list need? **Dynamic memory** lets a program ask for a block of memory of any size **at run time**, use it, and give it back when it is finished. The memory comes from a region called the **heap**." },
    { t: "p", text: "Dynamic memory is the foundation of linked lists, trees and graphs. It also brings new ways to go wrong: forgetting to give memory back (a leak), using memory after it has been given back (a dangling pointer) and following a pointer that was never set. Three real GATE questions cover exactly these." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["say which region of memory holds each kind of variable: code, data, heap or stack;", "use `malloc`, `calloc`, `realloc` and `free`, and say what each does to the contents;", "build a linked list node by node on the heap;", "recognise a memory leak, a dangling pointer, a double free and an uninitialised pointer;", "answer questions on what lives in the heap and what happens when a pointer to a block is lost."] },

    { t: "h2", text: "Where memory comes from" },
    { t: "p", text: "A running program uses four regions (chapter 7). The **code** region holds the instructions. The **data** region holds global and static variables. The **stack** holds the frames of the function calls: the parameters and local variables, which come and go with each call. The **heap** is the region for memory the program asks for by hand, and it is not tied to any function call: a block stays until the program gives it back." },
    { t: "fig", id: "c15-f1" },
    { t: "p", text: "The difference matters. A local array lives on the stack and disappears when its function returns. A block from `malloc` lives on the heap and survives the function that made it, which is exactly what you need when a function builds something that the caller will use. In return, the program is responsible for freeing it." },
    { t: "callout", kind: "key", text: "Stack: automatic, freed on return. Heap: requested with `malloc`, kept until `free`. Data: globals and statics, for the whole run. Code: the instructions." },

    { t: "h2", text: "The four functions" },
    { t: "p", text: "The functions are declared in `<stdlib.h>`. The first three ask for memory and return a **pointer** to the first byte of the block, or `NULL` if the memory could not be provided. `free` gives a block back." },
    { t: "table", head: ["Function", "What it does", "Contents of the new memory"], rows: [["`malloc(n)`", "asks for n bytes", "uninitialised: rubbish"], ["`calloc(k, n)`", "asks for k blocks of n bytes", "all zero"], ["`realloc(p, n)`", "changes a block to n bytes, keeping the old contents (copying if it must move)", "the old part kept; any new part uninitialised"], ["`free(p)`", "gives the block back", "—"]], caption: "malloc returns void *, which converts to any pointer type without a cast in C." },
    { t: "p", text: "The size is given in **bytes**, so for an array of n ints you ask for `n * sizeof(int)` bytes, never just n. A block from `malloc` is used like an array: `a[i]` means `*(a + i)` (chapter 11) whatever the origin of `a`." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *a = malloc(3 * sizeof(int));       /* room for three ints */
    int s = 0;
    for (int i = 0; i < 3; i++)
        a[i] = i + 1;
    for (int i = 0; i < 3; i++)
        s += a[i];
    printf("%d\\n", s);
    free(a);                                /* give it back */
    return 0;
}`, out: "6", file: "malloc_array.c" },
    { t: "p", text: "`calloc` is `malloc` plus clearing: every byte starts as zero, which is handy for counters. `realloc` grows or shrinks a block and keeps what was in it; because the block may have to move, always use the pointer it **returns**, not the old one." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *z = calloc(3, sizeof(int));
    printf("%d %d %d\\n", z[0], z[1], z[2]);
    free(z);

    int *a = malloc(2 * sizeof(int));
    a[0] = 1;  a[1] = 2;
    a = realloc(a, 4 * sizeof(int));        /* grow; the old values stay */
    a[2] = 3;  a[3] = 4;
    for (int i = 0; i < 4; i++)
        printf("%d ", a[i]);
    printf("\\n");
    free(a);
    return 0;
}`, out: "0 0 0\n1 2 3 4", file: "calloc_realloc.c" },
    { t: "callout", kind: "tip", text: "After `free(p)`, set `p = NULL`. A freed pointer still holds the old address (dangling); setting it to NULL makes a later mistake fail loudly, and `free(NULL)` is always safe." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Building things on the heap" },
    { t: "p", text: "The usual use of the heap is to build a structure one piece at a time. A **linked list** node holds a value and a pointer to the next node (chapter 14): `struct Node { int value; struct Node *next; };`. Each node is made with `malloc(sizeof(struct Node))`, filled in, and linked to the previous one. The last node's `next` should be `NULL`, to mark the end." },
    { t: "fig", id: "c15-f2" },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct Node { int value; struct Node *next; };

int main(void) {
    struct Node *head = malloc(sizeof(struct Node));
    struct Node *e = head;
    head->value = 0;
    for (int i = 1; i <= 3; i++) {
        struct Node *n = malloc(sizeof(struct Node));
        n->value = i;
        e->next = n;          /* link the new node to the end */
        e = n;
    }
    e->next = NULL;           /* mark the end */
    for (struct Node *p = head; p; p = p->next)
        printf("%d ", p->value);
    printf("\\n");
    return 0;
}`, out: "0 1 2 3", file: "linked_list_build.c" },
    { t: "p", text: "Notice `e->next = NULL;` before the printing loop. A `malloc`ed node's fields are rubbish until you set them, and a node whose `next` was never set holds a random address. Following that address is what the second GATE question below is about." },
    { t: "trap", i: 1 },

    { t: "h2", text: "What goes wrong" },
    { t: "h3", text: "Memory leak" },
    { t: "p", text: "A **memory leak** is a block that is no longer reachable, because the only pointer to it was overwritten or lost, and so can never be passed to `free`. The memory stays reserved until the program ends. Reassigning a pointer that is the only reference to a block is the classic way to leak." },
    { t: "fig", id: "c15-f3" },
    { t: "h3", text: "Dangling pointer and use after free" },
    { t: "p", text: "After `free(p)` the block no longer belongs to you, but `p` still holds its address: a **dangling pointer**. Reading or writing through it is undefined behaviour. It may seem to work for a while, and then fail somewhere else." },
    { t: "h3", text: "Double free, and an uninitialised pointer" },
    { t: "p", text: "Calling `free` twice on the same block is undefined (it can corrupt the heap). And a pointer that was never given an address, including the `next` field of a node nobody set, points to a random place; following it is undefined too. These are the wild pointers of chapter 10." },
    { t: "table", head: ["Mistake", "What happens", "Prevention"], rows: [["leak", "memory reserved, never reusable", "free every block once; do not overwrite the only pointer"], ["dangling pointer", "undefined behaviour on use", "set the pointer to NULL after free"], ["double free", "undefined behaviour", "free once; free(NULL) is safe"], ["uninitialised pointer", "undefined behaviour when followed", "set every pointer; set `next` to NULL"], ["writing past the end", "corrupts neighbouring memory", "ask for enough bytes: n * sizeof(type)"]] },
    { t: "p", text: "A related mistake is asking for too little. If you need room for ten `int`s and write `malloc(10)`, you have only ten bytes, enough for two and a half ints, and the writes after that go past the end of the block into whatever is next to it. The heap does not check. Always ask for `n * sizeof(type)` bytes." },
    { t: "trap", i: 2 },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "h3", text: "GATE 2026 (afternoon), Q17: what lives in the heap?" },
    { t: "p", text: "A one-mark question with no program: four things are listed, and you must say which one is stored in the heap." },
    { t: "ex", id: "c15-e1" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "The memory map of chapter 7. The four candidates belong to three different regions. A static variable declared inside a function lives in the **data** region. An array of integers declared inside a function is an ordinary local, so it lives on the **stack**. The return address of a function is saved on the **stack** when the call is made. Only the array created by `malloc` lives on the **heap**, which is option C." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option A.** The static variable has the whole program as its lifetime, and people think it must then be on the heap; it is in the data region.", "**Option B.** An array can be large, and people think large things are on the heap; a local array is on the stack however large it is.", "**Option D.** The return address outlives the call? No: it is on the stack, as part of the call frame."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Item", "Region"], rows: [["`int x;` declared inside a function", "stack"], ["`static int count;` inside a function", "data (BSS)"], ["`int g = 5;` outside all functions", "data"], ["`malloc(100)`", "heap"], ["the function's machine instructions", "code"], ["the parameter of a function", "stack"]], caption: "Use the memory map: only malloc, calloc and realloc blocks are on the heap." },

    { t: "h3", text: "GATE 2021 (afternoon), Q35: the last next is never set" },
    { t: "p", text: "A two-mark multiple-choice question. A program builds a linked list of four nodes and then prints from the head, looking one step ahead each time. The question asks what is true of the program." },
    { t: "ex", id: "c15-e2" },
    { t: "fig", id: "c15-f4" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Counting the nodes, and noticing that the last `next` is never set. The first `malloc` makes the head (value 0). The loop for index 1, 2 and 3 adds three more nodes, so there are **four** nodes, not five. Each new node's `next` is never set, and the loop links node k to node k + 1, but the node with value 3 is the last, so its `next` is left holding rubbish. The printing loop runs index 0 to 3, and in the last pass it executes `head = head->next` when `head` is the last node, then dereferences `head->value`: that uses the uninitialised pointer, which may crash. The answer is D." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option A, five nodes.** The loop count `index <= 3` is read as four iterations plus the head plus one more.", "**Option B, infinite loop.** There is no cycle; the loops are counted `for` loops that end.", "**Option C, a missing return.** In C99 a `main` with no return behaves as if it returned 0; and it is not a compile error."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Effect"], rows: [["add `boxE->next = NULL;` after the loop", "the last next is NULL; the first loop is fine, but the print loop's last `head->next` is NULL and `head->value` then dereferences NULL: still a run-time error"], ["print loop `index <= 2`", "the loop never reads past the last node: no error"], ["the corrected program of section 15.3", "sets the last next to NULL and prints with `for (p = head; p; p = p->next)`: prints 0 1 2 3"]], caption: "The last row was compiled and run." },

    { t: "h3", text: "GATE 2017 (forenoon), Q32: a lost block" },
    { t: "p", text: "A one-mark multiple-choice question with a short program that allocates twice through the same pointer. The question asks what problem the code suffers from." },
    { t: "ex", id: "c15-e3" },
    { t: "fig", id: "c15-f5" },
    { t: "h4", text: "What the question is really testing" },
    { t: "p", text: "Whether you follow the pointer `x` through two allocations. The first `malloc` gives `x` the address of a block, which is filled with 0. The `if (x)` test is true, and inside it `x = (int *) malloc(...)` makes `x` point to a **new** block. The only pointer to the first block has been overwritten, so the first block can never be freed: a **memory leak**. The final `free(x)` frees only the second block. The answer is D." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["**Option A.** In C the result of `malloc` needs no cast, and the cast to `int *` is harmless.", "**Option B.** `NULL == x` is a perfectly valid way of writing the comparison (some people write it this way to catch a mistaken `=`).", "**Option C, dangling pointer.** `x` is never used after the free; the problem is a block that was never freed."] },
    { t: "h4", text: "Variations to practise" },
    { t: "table", head: ["Change", "Problem"], rows: [["`free(x); x = NULL;` before the second malloc", "no leak"], ["delete the second `malloc`", "no leak, and one `free` for the one block"], ["`free(x); printf(\"%d\", *x);`", "dangling pointer: undefined behaviour"], ["`free(x); free(x);`", "double free: undefined behaviour"]], caption: "The program, with the header added, was compiled and run and printed 10; the leak does not show in the output, which is why the question asks about the problem." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Code, data, stack and heap are the four regions. Locals and return addresses are on the stack, globals and statics in the data region, and `malloc` blocks on the heap.", "`malloc(n)` gives n uninitialised bytes, `calloc(k, n)` gives zeroed memory, `realloc` resizes keeping the contents, `free` returns a block. Sizes are in bytes: use `n * sizeof(type)`.", "A linked list is built node by node with malloc; set every `next`, and end the list with NULL.", "A leak is a block with no pointer left; a dangling pointer points at a freed block; a double free is freeing twice; an uninitialised pointer must never be followed.", "After `free(p)`, set `p = NULL`."] },
  ],
  blocks: [
    { type: "figure", id: "c15-f1", caption: "Where each kind of variable lives. Only blocks from malloc, calloc and realloc are on the heap.", alt: "A table of code, data, stack and heap with what each holds and how long.", fig: { kind: "matrix", title: "The four regions", cols: ["Holds", "Freed"], rows: [{ label: "Code", cells: ["instructions", "never (read-only)"] }, { label: "Data", cells: ["globals and statics", "when the program ends"] }, { label: "Stack", cells: ["locals, parameters, return addresses", "when the function returns"] }, { label: "Heap", cells: ["malloc, calloc, realloc blocks", "when you call free"], hl: true }] } },
    { type: "figure", id: "c15-f2", caption: "A linked list of four nodes built on the heap. head points at the first; the last next is NULL.", alt: "Four linked nodes with values 0, 1, 2 and 3 and a head pointer, the last next being NULL.", fig: { kind: "linked", title: "head → 0 → 1 → 2 → 3 → NULL", nodes: [{ id: "n0", data: 0, next: "n1" }, { id: "n1", data: 1, next: "n2" }, { id: "n2", data: 2, next: "n3" }, { id: "n3", data: 3, next: null, tone: "ok" }], heads: [{ name: "head", to: "n0" }] } },
    { type: "figure", id: "c15-f3", caption: "A leak: x is the only pointer to the first block. After x is given the second block, nobody can reach, or free, the first.", alt: "Two frames: x points at the first block; then x points at the second block and the first block is lost.", fig: { kind: "frames", title: "x = malloc(...); ...; x = malloc(...);", frames: [
      { caption: "After the first malloc: x points at block 1.", fig: { kind: "memory", cells: [{ id: "b1", addr: 3000, name: "block 1", value: 0, tone: "ok" }, { id: "b2", addr: 3016, name: "block 2", value: "—", tone: "dim" }, { addr: 1000, name: "x", value: 3000, ptr: "b1" }] } },
      { caption: "After the second malloc: x points at block 2. Block 1 is still reserved, but no pointer leads to it: it can never be freed. A leak.", fig: { kind: "memory", cells: [{ id: "b1", addr: 3000, name: "block 1", value: 0, tone: "bad" }, { id: "b2", addr: 3016, name: "block 2", value: 10, tone: "ok" }, { addr: 1000, name: "x", value: 3016, ptr: "b2" }] } },
    ] } },
    { type: "figure", id: "c15-f4", caption: "GATE 2021 AN Q35: four nodes (values 0 to 3). The last node's next was never set and holds rubbish, shown in red; the print loop follows it.", alt: "Four linked nodes with the last next uninitialised.", fig: { kind: "linked", title: "head → 0 → 1 → 2 → 3 → ??", nodes: [{ id: "n0", data: 0, next: "n1" }, { id: "n1", data: 1, next: "n2" }, { id: "n2", data: 2, next: "n3" }, { id: "n3", data: 3, next: null, tone: "bad" }], heads: [{ name: "head", to: "n0" }], note: "the last next is NOT NULL here: it holds whatever was in memory" } },
    { type: "figure", id: "c15-f5", caption: "GATE 2017 FN Q32: the first block is lost when x is given the second. The final free(x) frees block 2 only.", alt: "x pointing at the second block, with the first block unreachable.", fig: { kind: "memory", title: "after the if block", cells: [{ id: "b1", addr: 3000, name: "block 1 (value 0)", value: "lost", tone: "bad" }, { id: "b2", addr: 3016, name: "block 2 (value 10)", value: 10, tone: "ok" }, { addr: 1000, name: "x", value: 3016, ptr: "b2" }] } },

    { type: "example", id: "c15-e1", level: "easy", title: "GATE CS 2026 (afternoon), Q17 · 1 mark · MCQ", file: "gate2026_an_q17.txt", given: `In the C runtime environment, which one of the following is stored in the heap?
(A) A static variable declared inside a function
(B) An array of integers declared inside a function
(C) A dynamically allocated array of integers created using malloc()
(D) The return address of a function`, find: "The correct option.", steps: [
      { say: "A static variable has the whole program as its lifetime: it is in the data region.", result: "A: data" },
      { say: "An array declared inside a function is an ordinary local: it is on the stack.", result: "B: stack" },
      { say: "The return address is saved in the call's frame, on the stack.", result: "D: stack" },
      { say: "malloc takes its memory from the heap.", result: "C: heap" },
    ], answer: "(C)", check: "Official answer (C)." },
    { type: "example", id: "c15-e2", level: "gate", title: "GATE CS 2021 (afternoon), Q35 · 2 marks · MCQ", file: "gate2021_an_q35.txt", given: `struct Node{
    int value;
    struct Node *next;
};
int main( ) {
    struct Node *boxE, *head, *boxN; int index = 0;
    boxE = head = (struct Node *) malloc(sizeof(struct Node));
    head -> value = index;
    for (index = 1; index <= 3; index++) {
        boxN = (struct Node *) malloc(sizeof(struct Node));
        boxE -> next = boxN;
        boxN -> value = index;
        boxE = boxN; }
    for (index = 0; index <= 3; index++) {
        printf("Value at index %d is %d\\n", index, head -> value);
        head = head -> next;
        printf("Value at index %d is %d\\n", index+1, head -> value); } }
/* Options: (A) a linked list of five nodes  (B) an infinite loop
 (C) a missing return reported as a compile error
 (D) it dereferences an uninitialised pointer: a possible run-time error */`, find: "Which statement is correct?", steps: [
      { say: "The head is created first (value 0). The loop for index 1, 2, 3 adds three nodes: four nodes in all, not five.", result: "4 nodes: A is false" },
      { say: "Every node is linked to the next, but the last node (value 3) never gets its next set: it holds rubbish.", result: "last next uninitialised" },
      { say: "The print loop runs index 0 to 3. In the last pass head is the node with value 3; head = head->next copies the rubbish, and head->value dereferences it.", result: "uninitialised pointer followed" },
      { say: "Both loops end (they are counted loops), and a missing return in main is not an error.", result: "B and C are false: D" },
    ], answer: "(D)", check: "Official answer (D). The ideas were run in the corrected program of section 15.3 (last next set to NULL)." },
    { type: "example", id: "c15-e3", level: "gate", title: "GATE CS 2017 (forenoon), Q32 · 1 mark · MCQ", file: "gate2017_q32.txt", given: `int *assignval (int *x, int val) {
    *x = val;
    return x;
}
void main ( ) {
    int *x = malloc (sizeof(int));
    if (NULL == x) return;
    x = assignval(x, 0);
    if(x) {
        x = (int *) malloc (sizeof(int));
        if (NULL == x) return;
        x = assignval (x, 10);
    }
    printf ("%d\\n", *x);
    free (x);
}
/* Options: (A) compile error: the return of malloc is not typecast
 (B) compile error: the comparison should be x == NULL
 (C) compiles, but execution may result in a dangling pointer
 (D) compiles, but execution may result in a memory leak */`, find: "What problem does the code suffer from?", steps: [
      { say: "The first malloc gives x the address of block 1, which assignval fills with 0. x is returned and stored back in x.", result: "x -> block 1" },
      { say: "x is not NULL, so the if body runs: a second malloc makes x point at block 2, filled with 10.", result: "x -> block 2" },
      { say: "The only pointer to block 1 was x, and it has been overwritten. Block 1 can never be freed.", result: "block 1 is lost" },
      { say: "free(x) frees block 2 only. The code compiles (no cast is needed; NULL == x is fine) and no pointer is used after free.", result: "a memory leak" },
    ], answer: "(D)", check: "Official answer (D). With #include <stdlib.h> added, the program compiles and prints 10." },

    { type: "trap", wrong: "malloc(n) gives memory that is already zero.", tempting: "New memory feels like it should be empty.", whyWrong: "malloc does not clear anything: the block holds whatever was there before. calloc clears. Reading a malloc block before writing it is undefined.", rule: "malloc: rubbish. calloc: zeros.", ex: { code: "int *z = calloc(3, sizeof(int));\nprintf(\"%d %d %d\", z[0], z[1], z[2]);", out: "0 0 0", text: "With malloc in place of calloc, the three numbers would be unpredictable." } },
    { type: "trap", wrong: "A node made with malloc has next equal to NULL.", tempting: "It is a new, empty node.", whyWrong: "The fields of a malloc block are uninitialised. next holds a random address until you set it. Following it is undefined behaviour.", rule: "Set every pointer field, including next = NULL.", ex: { text: "In the list of GATE 2021, the node with value 3 never gets `next` set. The print loop reads head->next from it and then head->value from the garbage address: a possible crash." } },
    { type: "trap", wrong: "After free(p), the pointer p is NULL.", tempting: "The memory is gone, so the pointer seems to be cleared.", whyWrong: "free gives the block back but does not change p. It still holds the old address: a dangling pointer. Using it is undefined.", rule: "After free(p), write p = NULL.", ex: { code: "int *p = malloc(sizeof(int));\n*p = 5;\nfree(p);\np = NULL;\nprintf(\"%d\", p == NULL);", out: "1" } },
    { type: "gate", text: "Three questions have been asked on this chapter: which region holds a malloc block (2026 AN Q17, 1 mark), a linked list whose last pointer is never set (2021 AN Q35, 2 marks) and a memory leak from overwriting the only pointer (2017 FN Q32, 1 mark). The same ideas, together with the memory-map matching question of chapter 7, are the whole of what has been asked on dynamic memory. All are worked above." },
    { type: "recall", cards: [
      { q: "What are the four regions of memory?", a: "Code, data, stack and heap." },
      { q: "Where do local variables live?", a: "On the stack." },
      { q: "Where does a malloc block live?", a: "On the heap." },
      { q: "What does malloc do to the contents of the block?", a: "Nothing: they are rubbish." },
      { q: "How does calloc differ from malloc?", a: "It zeroes the block." },
      { q: "What does realloc do to the old contents?", a: "Keeps them (copying if it moves the block)." },
      { q: "What is a memory leak?", a: "A block with no pointer left to it, so it can never be freed." },
      { q: "What is a dangling pointer?", a: "A pointer to a block that has been freed." },
      { q: "What should you do after free(p)?", a: "Set p = NULL." },
    ] },
    { type: "check", questions: [
      { id: "k1", kind: "MCQ", marks: 1, q: "Where is a block created by malloc stored?", options: ["Stack", "Data region", "Heap", "Code region"], answer: "C", solution: "malloc allocates from the heap." },
      { id: "k2", kind: "MCQ", marks: 1, q: "Where is a local int variable stored?", options: ["Heap", "Stack", "Data region", "Code region"], answer: "B", solution: "Locals are on the stack." },
      { id: "k3", kind: "NAT", marks: 1, q: "int *a = malloc(5 * sizeof(int)); How many bytes does this request (4-byte int)?", answer: "20", solution: "5 × 4." },
      { id: "k4", kind: "NAT", marks: 1, q: "int *z = calloc(4, sizeof(int)); What is z[2]?", answer: "0", solution: "calloc clears the memory." },
      { id: "k5", kind: "MCQ", marks: 1, q: "int *x = malloc(sizeof(int)); x = malloc(sizeof(int)); free(x); What problem does this have?", options: ["a dangling pointer", "a memory leak", "a double free", "a compile error"], answer: "B", solution: "The first block's only pointer was overwritten." },
      { id: "k6", kind: "NAT", marks: 2, q: "A list is built with a head node plus a loop that adds nodes for index = 1, 2, 3, 4. How many nodes are there?", answer: "5", solution: "The head and four more." },
      { id: "k7", kind: "MSQ", marks: 2, q: "Which are true?", options: ["malloc clears the block", "free(p) sets p to NULL", "A static variable declared in a function is not on the heap", "free(NULL) is safe"], answer: "C, D", solution: "A and B are false." },
      { id: "k8", kind: "NAT", marks: 2, q: "struct Node { int value; struct Node *next; }; What is sizeof(struct Node) on a 64-bit machine?", answer: "16", solution: "4 + 4 padding + 8." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on dynamic memory", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: the preprocessor", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Pointers (C10, C11)", "Structures (C14)", "Scope and storage (C7)"], usedIn: ["Linked lists (D3)", "Trees (D7)", "Operating systems: memory management"], cross: ["Operating systems: heap and stack"] },
  ],
};
