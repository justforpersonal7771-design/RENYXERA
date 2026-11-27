import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D0 "What a data structure is" (27 Nov 2026). No real GATE question is tagged to this chapter; it is the bridge from
 * Programming in C to every later chapter. Both programs were compiled and run with gcc (scripts/chapter-check.ts):
 * the stack written twice (array, linked list) prints "3 2 1" both times; inserting 5 at the front of {10,20,30,40} in an array takes 4 moves.
 */
export const chapterD0: Topic = {
  id: "cs.pds.ds.what0",
  title: "What a data structure is",
  no: "D0",
  book: [
    { t: "p", text: "Every program works on data: names, marks, roads between cities, the instructions waiting for a printer. Before it can do anything useful with that data, the program has to decide **how to keep it**: in a row, in a chain, in a tree, in a table. That decision is the subject of this book. A **data structure** is a way of arranging data in memory so that the operations you need are quick and easy to perform." },
    { t: "p", text: "This first chapter has no difficult code. It gives you the three ideas that the other chapters keep using: the difference between **what** a structure does and **how** it does it (an abstract data type and its implementation), the two basic ways of placing data in memory (side by side, or linked by pointers), and the five operations that every structure is judged on. Once these are clear, arrays, lists, stacks, queues, trees and heaps are all variations on one theme." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["say what an abstract data type is and why one ADT can have several implementations;", "tell contiguous storage (an array) from linked storage (a list) and say what each is good at;", "name the five operations on a data structure and say roughly what each costs in an array and in a linked list;", "tell a fixed-size structure from a growing one, without confusing it with the C keyword `static`;", "separate linear structures from non-linear ones;", "answer the simple GATE question of the form 'which structure gives O(1) access or O(1) insertion'."] },

    { t: "h2", text: "Why we organise data" },
    { t: "p", text: "Think of the contacts on your phone. They are kept in alphabetical order, so finding \"Meera\" does not mean reading every name from the top. Think of a library, where books sit on shelves by subject and number, so a librarian can find one among a hundred thousand in a minute. Think of the queue at a ticket counter, where the person who came first is served first, and nobody needs to ask who is next." },
    { t: "p", text: "In each case somebody chose an **arrangement** of the items, and the arrangement made certain jobs easy: finding by name, finding by subject, serving in order of arrival. No arrangement makes every job easy. The alphabetical contact list is fast to search but slow to add to if you must keep the order. A pile of unsorted cards is fast to add to but slow to search. Choosing a data structure is choosing which jobs you want to be fast." },
    { t: "callout", kind: "key", text: "A data structure is an arrangement of data together with the operations that work on it. Every arrangement makes some operations cheap and others expensive; there is no structure that is best at everything." },
    { t: "p", text: "A program is a list of instructions and the data they work on; a data structure decides how that data is laid out, and so decides how many instructions a job needs. With the right structure a search over a million items takes about twenty steps; with the wrong one it takes a million. That difference is what GATE questions on this subject measure." },

    { t: "h2", text: "The abstract data type: the buttons" },
    { t: "p", text: "A television remote has buttons: power, volume up, volume down, next channel. You use the television through those buttons and need to know nothing about the circuits inside. Two television sets from different makers may have completely different circuits, yet if their remotes have the same buttons that do the same things, you can swap one for the other without noticing." },
    { t: "p", text: "An **abstract data type**, or **ADT**, is exactly the remote: a list of operations, and what each one is supposed to do, with nothing said about how it is done. A **stack**, for example, is the ADT with three operations: `push(x)` puts a value on top, `pop()` removes and returns the top value, and `isEmpty()` says whether anything is left. The rule it promises is last in, first out: after pushing 1, 2, 3, the first `pop()` gives 3." },
    { t: "p", text: "The word 'abstract' means that the description leaves out the details of memory. The stack ADT does not say whether the values are stored in an array or in a chain of nodes. Programs that use the stack only through its operations will work with either." },
    { t: "fig", id: "d0-f1" },

    { t: "h2", text: "The data structure: the wiring" },
    { t: "p", text: "A **data structure** is the wiring behind the buttons: the actual way the values are placed in memory, and the code that carries out each operation on that layout. The same ADT can be implemented by several data structures, and they do not behave identically in speed or in memory use, even though they obey the same rules." },
    { t: "p", text: "The next program writes the stack ADT twice. The first version keeps the values in an array and a counter `top`. The second keeps them in a chain of nodes, where each node points to the one below it. The `main` function pushes 1, 2, 3 and pops three times on each; the two stacks give the same answers because they obey the same ADT." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

/* Wiring 1: a fixed array and a counter */
#define MAX 8
typedef struct { int items[MAX]; int top; } ArrStack;
void a_push(ArrStack *s, int x) { s->items[++s->top] = x; }
int  a_pop(ArrStack *s)         { return s->items[s->top--]; }

/* Wiring 2: a chain of nodes, each pointing to the one below */
typedef struct Node { int val; struct Node *next; } Node;
typedef struct { Node *head; } ListStack;
void l_push(ListStack *s, int x) {
    Node *n = malloc(sizeof *n);
    n->val = x; n->next = s->head; s->head = n;
}
int l_pop(ListStack *s) {
    Node *n = s->head; int x = n->val;
    s->head = n->next; free(n);
    return x;
}

int main(void) {
    ArrStack a = { .top = -1 };
    ListStack l = { NULL };
    for (int x = 1; x <= 3; x++) { a_push(&a, x); l_push(&l, x); }
    printf("array:");
    for (int i = 0; i < 3; i++) printf(" %d", a_pop(&a));
    printf("\\nlist:");
    for (int i = 0; i < 3; i++) printf(" %d", l_pop(&l));
    printf("\\n");
    return 0;
}`, out: "array: 3 2 1\nlist: 3 2 1", file: "stack_two_ways.c" },
    { t: "p", text: "The caller never looks inside. The array version can hold at most `MAX` values and its `a_push` would write outside the array if you pushed a ninth one; the list version has no such limit but spends memory on a pointer in every node. Same buttons, different wiring, different strengths. Later chapters keep returning to this: each time you meet a new ADT, ask which wirings are possible and what each costs." },
    { t: "trap", i: 0 },
    { t: "ex", id: "d0-e1" },

    { t: "h2", text: "Two ways to place data in memory" },
    { t: "p", text: "Almost every data structure is built from one of two basic layouts, and both appeared in Programming in C. In **contiguous** storage the items sit side by side in one block of memory, one after another with no gaps, exactly like the elements of an array. In **linked** storage the items sit in separate pieces called nodes, which may be anywhere in memory, and each node holds the address of the next one." },
    { t: "fig", id: "d0-f2" },
    { t: "p", text: "Contiguous storage has a great strength: to reach the item at position `i`, the machine does one multiplication and one addition, `address = base + i * size`. It does not matter whether `i` is 0 or 999999; the cost is the same. This is called **random access**, and it takes constant time, written O(1)." },
    { t: "fig", id: "d0-f3" },
    { t: "p", text: "Linked storage trades that away. To reach the item at position `i` you must start at the head and follow `i` arrows, one after another, because nothing tells you where the `i`-th node is except the node before it. Reaching the last of a million nodes takes a million steps. In return, linked storage is flexible: a new node can be placed anywhere in memory and joined in by changing one or two pointers, and nothing else has to move." },
    { t: "table", head: ["", "Contiguous (array)", "Linked (list)"], rows: [["Where the items are", "one block, side by side", "separate nodes, anywhere"], ["Reach item number i", "one step: base + i × size", "follow i arrows"], ["Extra memory per item", "none", "one pointer (or two)"], ["Add an item in the middle", "shift the later items along", "change a pointer"], ["Size", "fixed when created", "grows one node at a time"]], caption: "The two layouts have opposite strengths. Chapters on arrays and linked lists work these differences out in full." },
    { t: "callout", kind: "tip", text: "When a question says 'access the k-th element', think array: O(1). When it says 'insert or delete after a node you already hold', think linked list: O(1). The cost of **finding** the node first is a separate matter." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Fixed size and growing" },
    { t: "p", text: "An array in C has a size that is fixed when it is created: `int a[4];` makes four boxes and there is no way to add a fifth to the same array. A structure with a size that cannot change after creation is called a **static structure**; one that can grow and shrink while the program runs is a **dynamic structure**. A linked list is the usual dynamic structure, because adding an item only means taking one more node from the heap." },
    { t: "p", text: "A fixed array can still be used for a changing collection if you keep a separate count of how many boxes are in use. The array `int items[8]` of the stack above has eight boxes, and `top` tells you how many are filled. When all eight are full, the only remedy is to allocate a bigger array and copy everything across. That copying is the price of a fixed size, and the chapter on dynamic arrays will show that doing it by doubling keeps the average cost low." },
    { t: "callout", kind: "warning", text: "'Static structure' here means 'fixed size'. It has nothing to do with the C keyword `static`, which is about where a variable lives and how long it lasts (chapter C7). The two uses of the word are unrelated." },
    { t: "trap", i: 2 },

    { t: "h2", text: "Linear and non-linear structures" },
    { t: "p", text: "In a **linear** structure the items form a single line: there is a first item, a last item, and every other item has exactly one item before it and one after it. Arrays, linked lists, stacks and queues are all linear. You can visit every item by walking along the line from one end." },
    { t: "p", text: "In a **non-linear** structure an item may be connected to several others. A tree has a root and each item can have several children below it; a graph allows any item to be joined to any other. There is no single line to walk along, so visiting every item needs a plan, such as 'all the children of this node, then their children'. Trees, heaps and graphs are non-linear." },
    { t: "table", head: ["Linear", "Non-linear"], rows: [["array, linked list, stack, queue", "tree, binary search tree, heap, graph"], ["each item has at most one next item", "an item may lead to several others"], ["one natural way to visit all", "need a traversal plan (chapters on trees and graphs)"]] },
    { t: "p", text: "Do not confuse the way an ADT is described with the way it is stored. A heap is a tree in how we think about it, yet it is usually stored in an array; a stack is a linear idea that can be stored in an array or a list. The words 'linear' and 'non-linear' describe the **arrangement of connections**, not whether memory addresses happen to be consecutive." },

    { t: "h2", text: "The five operations" },
    { t: "p", text: "Whatever the structure, five operations come up again and again, and they are how you compare one structure with another." },
    { t: "table", head: ["Operation", "What it does"], rows: [["**insert**", "add a new item"], ["**delete**", "remove an item"], ["**search**", "find out whether a value is there, and where"], ["**traverse**", "visit every item once"], ["**update**", "change the value of an item that is already there"]] },
    { t: "p", text: "The cost of each operation depends on the layout. Take **insert at the front**, adding a new first item. In an array there is no free box before the first one, so every existing item must move one place to the right to make room, which is as many moves as there are items. In a linked list you make a new node, point it at the old first node, and point the head at it: two pointer changes, whatever the length." },
    { t: "fig", id: "d0-f4" },
    { t: "fig", id: "d0-f5" },
    { t: "p", text: "The program below does the array version and counts the moves. With four items the count is 4; with a thousand items it would be a thousand. The linked version always does the same two pointer changes." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[6] = {10, 20, 30, 40};          /* four items, room for six */
    int n = 4, moves = 0;
    for (int i = n; i > 0; i--) {         /* shift right, last item first */
        a[i] = a[i - 1];
        moves++;
    }
    a[0] = 5;
    n++;
    printf("%d moves:", moves);
    for (int i = 0; i < n; i++) printf(" %d", a[i]);
    printf("\\n");
    return 0;
}`, out: "4 moves: 5 10 20 30 40", file: "array_insert_front.c" },
    { t: "p", text: "Notice the order of the shifting: the last item moves first. If you moved the first item first, it would overwrite the second before the second had been saved. This detail comes up again in the chapter on arrays." },
    { t: "ex", id: "d0-e2" },
    { t: "p", text: "Search is the other everyday operation. Both an array and a list, if their items are in no particular order, can only be searched by looking at the items one after another until the value is found or the end is reached. That takes anywhere from 1 step (it is the first item) to n steps (it is the last, or absent), which is why we talk about the best case and the worst case. Chapter D1 makes this precise." },
    { t: "fig", id: "d0-f6" },
    { t: "trap", i: 3 },

    { t: "h2", text: "Time and space" },
    { t: "p", text: "Two resources are used to compare structures. **Time** is the number of steps an operation takes, counted as a function of the number of items `n`. **Space** is the memory the structure occupies. A linked list uses more space than an array for the same values, because each node carries a pointer; a structure that stores an extra copy or an index uses more space still, and may buy speed with it." },
    { t: "p", text: "We write the time as a growth rate: O(1) for 'the same however big n is', O(n) for 'proportional to n', O(log n) for 'grows very slowly', and so on. Chapter D1 builds this language slowly. For now it is enough to know that a smaller growth rate means a faster operation on big inputs, and that the table at the end of each later chapter will tell you the growth rate of every operation of that structure." },
    { t: "callout", kind: "remember", text: "A data structure is judged by two things: how fast each operation runs, and how much memory it takes. Always ask: fast at what?" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "No past GATE question is tagged to this chapter by name: the ideas appear inside every question on arrays, lists, stacks, queues, trees and heaps. The form that does appear directly is a **choice-of-structure question**: a short description of what a program must do often, and a list of structures to pick from. The method is to name the operation that is done most often, find which layout makes it cheapest, and check the other operations are not made unbearable." },
    { t: "ex", id: "d0-e3" },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "That you know the cost of each operation on each layout. If you remember only two facts, remember these: an array reaches the k-th item in O(1) but shifts items on an insertion in the middle; a linked list inserts after a node it already holds in O(1) but must walk to reach the k-th item." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Saying a linked list inserts in O(1) **anywhere**; that is only true when you already hold the node before the place of insertion. Finding it may cost O(n).", "Saying an array deletes in O(1); deleting from the middle shifts the items after it.", "Mixing up 'static' (fixed size) with the keyword `static`."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A data structure is an arrangement of data plus the operations on it; every arrangement favours some operations over others.", "An abstract data type lists the operations and what they promise; a data structure is one particular way of implementing them.", "Contiguous storage (array): random access in O(1), insertion in the middle moves items, size fixed when created.", "Linked storage (list): reaching the k-th item costs k steps, insertion after a known node is O(1), size grows node by node.", "Linear structures form one line; non-linear structures (trees, graphs) branch.", "The five operations to compare structures: insert, delete, search, traverse, update. Time and space are the two costs."] },
  ],
  blocks: [
    { type: "figure", id: "d0-f1", caption: "The ADT says what the operations do; the data structure says how. One ADT can be implemented in several ways.", alt: "A table with two columns: abstract data type (buttons) and data structure (wiring).", fig: { kind: "matrix", title: "Stack", cols: ["Abstract data type (the buttons)", "Data structure (the wiring)"], rows: [{ label: "What it states", cells: ["push, pop, isEmpty; last in, first out", "an array and a counter, or a chain of nodes"] }, { label: "What it hides", cells: ["where the values are kept", "nothing: this is the real memory layout"], hl: true }, { label: "How many", cells: ["one description", "several implementations, same answers"] }] } },
    { type: "figure", id: "d0-f2", caption: "int a[4] = {10, 20, 30, 40}. The four boxes sit side by side; the address of a[i] is 1000 + 4i, so any element is reached in one step.", alt: "Four array cells with values 10, 20, 30, 40 at addresses 1000 to 1012.", fig: { kind: "array", title: "Contiguous: one block", data: [[10, 20, 30, 40]], base: 1000, size: 4, index: true, tones: { "0,2": "hl" } } },
    { type: "figure", id: "d0-f3", caption: "The same four values as a linked list. The nodes can be anywhere in memory; to reach the third node you must follow two arrows from the head.", alt: "A chain of four nodes 10, 20, 30, 40 joined by arrows, with head pointing at the first.", fig: { kind: "linked", title: "Linked: separate nodes joined by pointers", nodes: [{ id: "a", data: 10, next: "b" }, { id: "b", data: 20, next: "c" }, { id: "c", data: 30, next: "d", tone: "hl" }, { id: "d", data: 40, next: null }], heads: [{ name: "head", to: "a" }] } },
    { type: "figure", id: "d0-f4", caption: "Insert 5 at the front of an array holding 10, 20, 30, 40: every item moves one place right, last item first, then 5 is written. Four moves for four items.", alt: "Six frames of an array of five boxes as items shift right one at a time and 5 is written at the front.", fig: { kind: "frames", title: "Array: insert at the front", frames: [
      { caption: "Start: four items and one free box.", fig: { kind: "array", data: [[10, 20, 30, 40, "·"]], base: 1000, size: 4, index: true, tones: { "0,4": "dim" } } },
      { caption: "Move 1: a[4] = a[3]. The 40 is copied right.", fig: { kind: "array", data: [[10, 20, 30, 40, 40]], base: 1000, size: 4, index: true, tones: { "0,4": "hl" } } },
      { caption: "Move 2: a[3] = a[2].", fig: { kind: "array", data: [[10, 20, 30, 30, 40]], base: 1000, size: 4, index: true, tones: { "0,3": "hl" } } },
      { caption: "Move 3: a[2] = a[1].", fig: { kind: "array", data: [[10, 20, 20, 30, 40]], base: 1000, size: 4, index: true, tones: { "0,2": "hl" } } },
      { caption: "Move 4: a[1] = a[0]. Now a[0] is free to overwrite.", fig: { kind: "array", data: [[10, 10, 20, 30, 40]], base: 1000, size: 4, index: true, tones: { "0,1": "hl" } } },
      { caption: "Write a[0] = 5. Done: 4 moves.", fig: { kind: "array", data: [[5, 10, 20, 30, 40]], base: 1000, size: 4, index: true, tones: { "0,0": "ok" } } },
    ] } },
    { type: "figure", id: "d0-f5", caption: "Insert 5 at the front of a linked list: make the node, point it at the old first node, then move head. Two pointer changes, whatever the length.", alt: "Three frames: before, new node pointing at the first node, and head moved to the new node.", fig: { kind: "frames", title: "Linked list: insert at the front", frames: [
      { caption: "Start: head points at 10.", fig: { kind: "linked", nodes: [{ id: "a", data: 10, next: "b" }, { id: "b", data: 20, next: "c" }, { id: "c", data: 30, next: null }], heads: [{ name: "head", to: "a" }] } },
      { caption: "Make a new node 5 and set its next to the old first node (pointer change 1).", fig: { kind: "linked", nodes: [{ id: "n", data: 5, next: "a", tone: "hl" }, { id: "a", data: 10, next: "b" }, { id: "b", data: 20, next: "c" }, { id: "c", data: 30, next: null }], heads: [{ name: "head", to: "a" }] } },
      { caption: "Move head to the new node (pointer change 2). Nothing else moved.", fig: { kind: "linked", nodes: [{ id: "n", data: 5, next: "a", tone: "ok" }, { id: "a", data: 10, next: "b" }, { id: "b", data: 20, next: "c" }, { id: "c", data: 30, next: null }], heads: [{ name: "head", to: "n" }] } },
    ] } },
    { type: "figure", id: "d0-f6", caption: "Costs of the five operations on n items, for the two basic layouts (unsorted, position known where stated). Later chapters fill in every structure.", alt: "A table comparing array and linked list on access, insert at front, insert after a known node, search and traverse.", fig: { kind: "matrix", title: "Operation", cols: ["Array", "Linked list"], rows: [{ label: "Access k-th item", cells: ["O(1)", "O(k), up to O(n)"], hl: true }, { label: "Insert at the front", cells: ["O(n), shift", "O(1)"] }, { label: "Insert after a node you hold", cells: ["O(n), shift", "O(1)"] }, { label: "Search (unsorted)", cells: ["O(n)", "O(n)"] }, { label: "Traverse all", cells: ["O(n)", "O(n)"] }] } },

    { type: "example", id: "d0-e1", level: "easy", title: "One stack, two wirings", file: "stack_two_ways.c", given: `ArrStack a;  ListStack l;     /* both start empty */
push 1, 2, 3 on each
pop three times from each`, find: "What each stack prints, and why the two agree.", steps: [
      { say: "Both stacks obey the same ADT: push puts a value on top, pop removes the top one. After pushing 1, 2, 3 the top is 3 in both.", result: "top = 3" },
      { say: "The array stack reads items[top] and lowers top: 3, then 2, then 1. The list stack removes the head node: 3, then 2, then 1.", result: "3 2 1 on both" },
      { say: "The answers match because the ADT fixes them. What differs is hidden: one used a counter, the other freed nodes.", result: "same output, different wiring" },
    ], answer: "array: 3 2 1 and list: 3 2 1", check: "The program was compiled and run." },
    { type: "example", id: "d0-e2", level: "edge", title: "Count the moves: insert at the front", file: "front_insert_count.txt", given: `array holds 10 20 30 40 (n = 4, room for more)
insert 5 at the front
then the same on a linked list holding 10 20 30 40`, find: "The number of items moved in the array, and the number of pointer changes in the list. Then the same for n = 1000.", steps: [
      { say: "Every item of the array moves one place right: 40, 30, 20, 10, so four moves for n = 4.", result: "array: 4 moves" },
      { say: "In the list a new node is created and joined by two pointer assignments: new.next = head and head = new.", result: "list: 2 pointer changes" },
      { say: "For n = 1000 the array needs 1000 moves; the list still needs 2. The array cost grows with n, the list cost does not.", result: "array 1000, list 2" },
    ], answer: "Array: n moves (4, then 1000). List: 2 pointer changes, whatever n is.", check: "The array count is the program array_insert_front.c above." },
    { type: "example", id: "d0-e3", level: "gate", title: "Choose the structure", file: "choose_structure.txt", given: `A program receives a stream of numbers.
Operation 1 (very often): read the number at position k, for any k.
Operation 2 (rare): add a number at the end, when there is room.
Which layout is better: array or linked list?`, find: "The structure with the cheaper common operation, and the cost of the rare one.", steps: [
      { say: "The common operation is access by position. An array reaches position k in O(1); a list must follow k arrows, O(k).", result: "array wins the common operation" },
      { say: "The rare operation is appending when there is room. In an array with a count it writes to the next free box, O(1).", result: "append O(1) too" },
      { say: "Check the downside: the array has a fixed size, so it fails when full. As the task says there is room, that does not apply.", result: "array is the right choice" },
    ], answer: "An array: O(1) access and O(1) append (when there is room).", check: "Always name the common operation first, then check the others are not made unbearable." },

    { type: "trap", wrong: "An abstract data type and a data structure are the same thing.", tempting: "Both are called 'a stack' or 'a queue' in everyday speech.", whyWrong: "The ADT is the list of operations and their promises (the buttons). A data structure is a concrete way of storing the values and carrying out the operations (the wiring). One ADT has many data structures.", rule: "ADT = what; data structure = how.", ex: { code: "stack as an array: push 1,2,3 then pop -> 3\nstack as a list:  push 1,2,3 then pop -> 3", out: "same answer, different storage" } },
    { type: "trap", wrong: "A linked list is always better than an array because it can grow.", tempting: "Growing sounds like a clear advantage, and arrays have a fixed size.", whyWrong: "A list gives up random access: the k-th item costs k steps, and each node spends extra memory on a pointer. If the common operation is access by position, the array is much faster.", rule: "Each layout wins at different operations; ask which operation is the common one.", ex: { code: "read the 500th of 1000 items\narray: 1 step     list: 500 steps", out: "array wins here" } },
    { type: "trap", wrong: "A static data structure is one declared with the C keyword static.", tempting: "The same word is used.", whyWrong: "Here 'static' means 'size fixed at creation'. An ordinary array int a[4]; is a static structure even though it is not declared static. The C keyword static concerns storage duration and linkage.", rule: "Static structure = fixed size. Keyword static = lifetime and visibility.", ex: { code: "int a[4];\nprintf(\"%zu\", sizeof a);", out: "16" } },
    { type: "trap", wrong: "Searching an unsorted array of n items always takes n steps.", tempting: "You must look at every item to be sure.", whyWrong: "You must look at every item only if the value is last or absent. If it is the first item, one step is enough. The cost depends on where the value is, so we speak of best case (1 step) and worst case (n steps).", rule: "Say which case: best 1, worst n.", ex: { code: "search 10 in {10, 20, 30}  -> 1 step\nsearch 30 in {10, 20, 30}  -> 3 steps\nsearch 99 in {10, 20, 30}  -> 3 steps", out: "1, 3, 3" } },
    { type: "gate", text: "No GATE question is tagged to this chapter by name. The ideas are used in every question on arrays, lists, stacks, queues, trees and heaps; the direct form is 'which structure gives O(1) access or O(1) insertion'." },
    { type: "recall", cards: [
      { q: "What is a data structure?", a: "An arrangement of data in memory together with the operations on it." },
      { q: "What is an abstract data type?", a: "A list of operations and what they promise, with nothing said about storage." },
      { q: "Name two data structures that can implement a stack.", a: "An array with a counter, or a linked list." },
      { q: "What is contiguous storage?", a: "Items side by side in one block of memory, like an array." },
      { q: "What is linked storage?", a: "Separate nodes anywhere in memory, each holding the address of the next." },
      { q: "What does an array give that a list does not?", a: "Random access: the k-th item in O(1)." },
      { q: "What does a list give that an array does not?", a: "Insertion after a known node without shifting, O(1); it grows node by node." },
      { q: "Name the five operations.", a: "Insert, delete, search, traverse, update." },
      { q: "Is a stack linear or non-linear?", a: "Linear." },
      { q: "What does 'static structure' mean here?", a: "Fixed size at creation; not the C keyword static." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "An array holds 100 items and a new item is inserted at the front. How many existing items must move one place?", answer: "100", solution: "Every item shifts right: 100 moves." },
      { id: "h2", kind: "NAT", marks: 1, q: "int a[10]; with 4-byte ints and a base address of 2000. What is the address of a[7]?", answer: "2028", solution: "2000 + 7 × 4 = 2028." },
      { id: "h3", kind: "MCQ", marks: 1, q: "Which of these is an abstract data type, rather than a data structure?", options: ["a stack, described by push, pop and isEmpty", "an array of 100 ints", "a singly linked list of nodes", "a block of 400 bytes"], answer: "A", solution: "A stack described only by its operations says nothing about storage." },
      { id: "h4", kind: "MCQ", marks: 1, q: "Which operation is O(1) on an array but costs up to n steps on a linked list?", options: ["access the k-th item", "insert after a node you hold", "traverse all items", "insert at the front"], answer: "A", solution: "Random access is the array's strength." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which of these are linear data structures?", options: ["array", "stack", "queue", "binary tree"], answer: "A, B, C", solution: "A binary tree branches, so it is non-linear." },
      { id: "h6", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["A linked list needs extra memory for pointers", "An ADT fixes how values are stored in memory", "One ADT can have several implementations", "Insertion after a known node in a list needs no shifting"], answer: "A, C, D", solution: "B is false: the ADT says nothing about storage." },
      { id: "h7", kind: "NAT", marks: 2, q: "Insert one new item at the front of a singly linked list. How many pointer assignments are needed (new.next = head, head = new)?", answer: "2", solution: "Two assignments, independent of the length." },
      { id: "h8", kind: "NAT", marks: 2, q: "Search for a value in an unsorted array of 50 items; the value is the last item. How many items are examined?", answer: "50", solution: "Worst case: every item is examined." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on data structures", sub: "Programming and Data Structures", href: "/topics/data-structures" }, { label: "The Data Structures book", sub: "next: counting and growth", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Arrays (C9)", "Structures and linked lists in C (C14)", "Dynamic memory (C15)"], usedIn: ["Every later chapter of this book", "Algorithms: choosing a structure"], cross: ["Algorithms: asymptotic notation"] },
  ],
};
