import type { Topic } from "@/lib/study/schema";

/**
 * PILOT lesson (24 Nov 2026): C10 "Pointers I: memory and addresses", written to the v2 standard
 * (docs/study-materials/v2/programming-and-data-structures/pilot/C10-pointers-1.md). Every program in it was compiled and run
 * (npm run check:lesson); addresses in pictures are illustrative. PYQs: 2026_AN_Q60 (9), 2025_FN_Q34 (25), 2017_AN_Q32 (1, 0).
 */
export const pilotPointers: Topic = {
  id: "cs.pds.c.ptr1",
  title: "Pointers I: memory and addresses (pilot)",
  blocks: [
    { type: "hook", text: "Ask a friend to add one to the number in your notebook. If you hand over a photocopy, your notebook never changes. If you hand over the page number, your friend changes your own page. In C a function normally gets the photocopy. A pointer is the page number." },
    { type: "objectives", items: ["Draw any short pointer program as boxes and arrows, and say what it prints.", "Say the difference between moving an arrow (p = &b) and changing the box it points to (*p = 7).", "Explain why swap(&a, &b) works when swap(a, b) does not.", "Know which pointers must never be followed: NULL, wild and dangling."] },
    { type: "intuition", paras: [
      "Memory is a long row of numbered boxes. The number of a box is its address. A variable is a box with a name on it, so x has a value and an address.",
      "A pointer is an ordinary box whose value happens to be an address. We draw that address as an arrow from the pointer's box to the box it names. The arrow is only a drawing: the real thing is the number inside the pointer.",
      "Two small operators do all the work. &x means: give me the address of x. *p means: go to the address inside p and use the box there, to read it or to write it. They are opposites: * undoes &.",
    ], analogyLimit: "A house number on a card is a good picture, but real addresses are plain numbers you can add to. Later lessons use that; this lesson does not." },
    { type: "definition", name: "Words you must know", text: "Each word is used only after this box.", items: [
      "Address: the number of a memory box (like a house number).",
      "&x (address of x): the address of the box called x.",
      "Pointer: a variable whose value is an address. int *p declares a pointer to an int.",
      "*p (follow p): the box that p points at. It can be read or written.",
      "Pointee: the box a pointer points to.",
      "NULL: the special address that means no box. Following it is undefined behaviour.",
      "Undefined behaviour: the C standard promises nothing. The program may crash, print rubbish, or look fine. Never give one output as the answer.",
    ] },
    { type: "figure", id: "p-f1", caption: "x lives at 1000 and p holds 1000. Look at p: its value is the address of x. The arrow is how we draw 'points to'.", alt: "Memory boxes: x holds 10 at address 1000; p holds 1000 and has an arrow to x.", fig: { kind: "memory", title: "int x = 10; int *p = &x;", cells: [{ id: "x", addr: 1000, name: "x", value: 10, size: 4, tone: "hl" }, { addr: 1004, name: "", value: "?", size: 4, tone: "dim" }, { id: "p", addr: 1008, name: "p", value: 1000, size: 4, ptr: "x" }] } },
    { type: "walkthrough", steps: [
      "Step 1. Every variable has a value and an address. int x = 10; makes a box named x holding 10.",
      "Step 2. & asks for the address. int *p = &x; makes a second box p and puts x's address in it.",
      "Step 3. * follows the arrow. *p = 25; goes to the box p points at and writes 25 there. x changes, though the name x never appears on that line.",
      "Step 4. Pointers can be copied. After int *q = p; both p and q hold the same address, so both reach one box.",
      "Step 5. Moving an arrow and changing a box are different. p = &b moves the arrow. *p = 7 changes the box at its end.",
    ], prompt: { q: "int a = 1, b = 2; int *p = &a; p = &b; *p = 7; What are a and b?", a: "a is still 1. p = &b moved the arrow to b, and *p = 7 wrote into b, so b is 7." } },
    { type: "figure", id: "p-f2", caption: "Step through it with Next. Only the last step changes a number; p itself never changes.", alt: "Three frames: x alone, then p pointing to x, then x changed to 25 through p.", fig: { kind: "frames", title: "int x = 10; int *p = &x; *p = 25;", frames: [
      { caption: "After int x = 10; : x is a box holding 10. Nothing points anywhere yet.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 10 }] } },
      { caption: "After int *p = &x; : p is a new box. It holds 1000, the address of x.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 10 }, { addr: 1004, name: "p", value: 1000, ptr: "x", tone: "hl" }] } },
      { caption: "After *p = 25; : follow the arrow from p and write 25 into x. p did not change.", fig: { kind: "memory", cells: [{ id: "x", addr: 1000, name: "x", value: 25, tone: "ok" }, { addr: 1004, name: "p", value: 1000, ptr: "x" }] } },
    ] } },
    { type: "figure", id: "p-f3", caption: "p and q both hold 1000. Writing 99 through q is visible through p, because there is only one box.", alt: "x holds 99; p and q both have arrows to x.", fig: { kind: "memory", title: "int *q = p; *q = 99;", cells: [{ id: "x", addr: 1000, name: "x", value: 99, tone: "ok" }, { addr: 1004, name: "p", value: 1000, ptr: "x" }, { addr: 1008, name: "q", value: 1000, ptr: "x" }] } },
    { type: "figure", id: "p-f4", caption: "Arrow first, then box. Watch which frame changes a number: only the last one.", alt: "Three frames: p to a, p moved to b, then b changed to 7.", fig: { kind: "frames", title: "p = &b; *p = 7;", frames: [
      { caption: "p = &a : p points at a.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 1 }, { id: "b", addr: 1004, name: "b", value: 2 }, { addr: 1008, name: "p", value: 1000, ptr: "a" }] } },
      { caption: "p = &b : the arrow moves. No number in a or b changed.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 1 }, { id: "b", addr: 1004, name: "b", value: 2 }, { addr: 1008, name: "p", value: 1004, ptr: "b", tone: "hl" }] } },
      { caption: "*p = 7 : follow the arrow and write into b.", fig: { kind: "memory", cells: [{ id: "a", addr: 1000, name: "a", value: 1 }, { id: "b", addr: 1004, name: "b", value: 7, tone: "ok" }, { addr: 1008, name: "p", value: 1004, ptr: "b" }] } },
    ] } },
    { type: "example", id: "p-e1", level: "easy", title: "Trace by hand: values after assignments", given: "int a = 5, b = 8;\nint *p = &a;\n*p = b;\nb = 1;", find: "The values of a and b at the end.", steps: [
      { say: "int a = 5, b = 8; : two boxes.", result: "a = 5, b = 8" },
      { say: "int *p = &a; : p points at a.", result: "p -> a" },
      { say: "*p = b; : copy b's value (8) into the box p points at, which is a.", result: "a = 8" },
      { say: "b = 1; : changes b only. a was a copy, not a link.", result: "b = 1" },
    ], answer: "a = 8 and b = 1.", check: "*p = b copied the value once; it did not tie a to b." },
    { type: "figure", id: "p-f5", caption: "swap_ptr(&x, &y): the function receives the addresses 1000 and 1004, so *a and *b are x and y themselves.", alt: "Three frames of the call stack while swap_ptr swaps x and y in main.", fig: { kind: "frames", title: "swap_ptr(&x, &y)", frames: [
      { caption: "main has x = 3 and y = 7. swap_ptr is called with their addresses.", fig: { kind: "stackframe", frames: [{ title: "swap_ptr", tone: "hl", rows: [{ name: "a", value: 1000 }, { name: "b", value: 1004 }, { name: "t", value: "?" }] }, { title: "main", rows: [{ name: "x (at 1000)", value: 3 }, { name: "y (at 1004)", value: 7 }] }] } },
      { caption: "t = *a; copies x's value (3) into t.", fig: { kind: "stackframe", frames: [{ title: "swap_ptr", rows: [{ name: "a", value: 1000 }, { name: "b", value: 1004 }, { name: "t", value: 3, tone: "ok" }] }, { title: "main", rows: [{ name: "x", value: 3 }, { name: "y", value: 7 }] }] } },
      { caption: "*a = *b; writes y's value into x. Then *b = t; writes 3 into y.", fig: { kind: "stackframe", frames: [{ title: "swap_ptr", rows: [{ name: "a", value: 1000 }, { name: "b", value: 1004 }, { name: "t", value: 3 }] }, { title: "main", tone: "ok", rows: [{ name: "x", value: 7, tone: "ok" }, { name: "y", value: 3, tone: "ok" }] }] } },
    ] } },
    { type: "example", id: "p-e2", level: "edge", title: "Why swap(x, y) does nothing but swap(&x, &y) works", given: "void swap_copy(int a, int b) { int t = a; a = b; b = t; }\nvoid swap_ptr(int *a, int *b) { int t = *a; *a = *b; *b = t; }\nint x = 3, y = 7;\nswap_copy(x, y);  printf(\"%d %d\", x, y);\nswap_ptr(&x, &y); printf(\" %d %d\", x, y);", find: "What is printed?", steps: [
      { say: "swap_copy gets copies of 3 and 7 in its own boxes and swaps those. The boxes vanish when it returns.", result: "x, y still 3, 7" },
      { say: "swap_ptr gets the addresses of x and y. *a is x and *b is y, so the swap happens in main's boxes.", result: "x, y become 7, 3" },
    ], answer: "3 7 7 3", check: "A function gets copies of its arguments. To let it change your variable, pass an address." },
    { type: "deep", sections: [
      { h: "The exact rules", paras: ["Read these once, then use the pictures."], points: [
        "&x has the type pointer to the type of x; its value is the address of x.",
        "T *p; declares p as a pointer to T. In a declaration the * means pointer to; in an expression *p means the object p points at. Same symbol, two jobs.",
        "*p can be on the left of = (write) or inside an expression (read). *&x is x. &*p is p, when p is valid.",
        "In int *p, q; only p is a pointer; q is a plain int. Write int *p; int q; to be safe.",
        "The pointer's type tells how many bytes to read at the address and how to read them.",
        "A pointer takes the same space whatever it points to. How much is implementation-defined: 4 bytes in the usual GATE picture, 8 on most laptops. Use the value the question gives.",
      ] },
      { h: "Pointers that must not be followed", paras: ["Three different ways a pointer can be unusable. In all three, *p is undefined behaviour, so never give one output as the answer."], points: [
        "NULL: the special 'no box' address. Following it is undefined (usually a crash, never promised).",
        "Wild: never assigned, so its value is indeterminate. It may hit some other variable silently.",
        "Dangling: holds the address of a box that no longer exists. (Pointers to function locals come in C13, and to freed memory in C15.)",
      ] },
      { h: "A function gets copies, including a copy of the pointer", paras: ["Assigning to the parameter p inside a function moves only the function's copy of the arrow. Writing through *p changes the caller's box. So void set(int *p) { int z = 50; p = &z; } leaves the caller's x alone.", "printf(\"%d\", x) needs the value, so it gets a copy. scanf(\"%d\", &x) must put a number into x, so it needs the address. That closes the loop opened in C1."] },
    ] },
    { type: "figure", id: "p-f6", caption: "Three pointers that cannot be used. p1 points at nowhere (NULL), p2 was never assigned (a random house), p3 points at a box that is gone.", alt: "Three pointer boxes: a NULL pointer, an unassigned wild pointer and a dangling pointer.", fig: { kind: "memory", title: "NULL, wild and dangling", cells: [{ id: "n", addr: "-", name: "NULL", value: "nowhere", tone: "dim" }, { addr: 1000, name: "p1", value: 0, ptr: "n", tone: "hl" }, { addr: 1004, name: "p2", value: "?", tone: "bad" }, { id: "gone", addr: 1100, name: "gone", value: "freed", tone: "dim" }, { addr: 1008, name: "p3", value: 1100, ptr: "gone", tone: "bad" }] } },
    { type: "example", id: "p-e3", level: "gate", title: "GATE CS 2026 (afternoon), Q60 · 2 marks", given: "int *ptr, a, b, c;\na = 5; b = 11; c = 20;\nptr = &a;  *ptr = c;\nptr = &c;  a = *(&b);\nc = *ptr - a;\nprintf(\"%d\", c);", find: "The output.", steps: [
      { say: "Draw a, b, c, ptr. ptr = &a; *ptr = c; writes c (20) into a.", result: "a = 20" },
      { say: "ptr = &c; moves the arrow to c.", result: "ptr -> c" },
      { say: "a = *(&b); is a = b, because * undoes &.", result: "a = 11" },
      { say: "c = *ptr - a; and *ptr is c itself, so c = 20 - 11.", result: "c = 9" },
    ], answer: "9", check: "Official answer 9. The program was also run." },
    { type: "example", id: "p-e4", level: "gate", title: "GATE CS 2025 (forenoon), Q34 · 1 mark", given: "void foo(int *p, int x) { *p = x; }\nint main() {\n  int *z; int a = 20, b = 25;\n  z = &a;\n  foo(z, b);\n  printf(\"%d\", a);\n}", find: "The output.", steps: [
      { say: "z holds the address of a.", result: "z -> a" },
      { say: "foo gets a copy of that address in p and a copy of b's value 25 in x.", result: "p -> a, x = 25" },
      { say: "*p = x writes 25 into a.", result: "a = 25" },
    ], answer: "25", check: "Official answer 25. The program was also run." },
    { type: "example", id: "p-e5", level: "gate", title: "GATE CS 2017 (afternoon), Q32 · 1 mark", given: "void printxy(int x, int y) {\n  int *ptr;\n  x = 0;\n  ptr = &x;\n  y = *ptr;\n  *ptr = 1;\n  printf(\"%d, %d\", x, y);\n}\nprintxy(1, 1);", find: "The output.", steps: [
      { say: "x and y are the function's own copies, both 1. x = 0 sets x to 0.", result: "x = 0" },
      { say: "ptr points at x. y = *ptr copies x's 0 into y.", result: "y = 0" },
      { say: "*ptr = 1 writes 1 into x.", result: "x = 1" },
    ], answer: "1, 0", check: "Official answer (C) 1, 0. The program was also run." },
    { type: "trap", wrong: "*p = b ties p's box to b.", tempting: "It looks like a link, like in a spreadsheet.", whyWrong: "It copies b's value once. Changing b afterwards does not change *p.", rule: "Assignment copies values. Only an address makes two names share a box." },
    { type: "trap", wrong: "int *p = &x; writes to *p.", tempting: "The star and the equals sign sit next to each other.", whyWrong: "In a declaration the * only says p is a pointer. The line sets p, not *p.", rule: "Read int *p = &x; as int *p; p = &x;" },
    { type: "trap", wrong: "int *p, q; makes two pointers.", tempting: "The star seems to belong to the type for both names.", whyWrong: "The star belongs to p only. q is an int.", rule: "One declaration per pointer: int *p; int *q;" },
    { type: "trap", wrong: "Assigning to a pointer parameter changes the caller's pointer.", tempting: "The pointer reaches the caller's variable, so everything about it seems shared.", whyWrong: "The function holds a copy of the arrow. Moving the copy leaves the caller's arrow alone; only *p reaches the caller's box.", rule: "Change *p to change the caller's variable; change p to change nothing outside." },
    { type: "trap", wrong: "A pointer is always 4 bytes.", tempting: "Old textbooks and many GATE pictures use 4.", whyWrong: "It is implementation-defined: 8 on most laptops.", rule: "Use the size the question gives; otherwise say what you assume." },
    { type: "shortcut", text: "To evaluate *p, find p's box, read the address in it, go to that box. If you cannot draw the arrow, you cannot evaluate it. Also: *&x is x and &*p is p.", validWhen: "Whenever every pointer involved points at a real box (not NULL, wild or dangling)." },
    { type: "gate", text: "Four question forms: (1) values after assignments through pointers (NAT); (2) a function changes a variable through a pointer; (3) call by value with a pointer parameter; (4) which statements are true or which lines are undefined (MSQ). Three real examples are worked above. No frequency is claimed here; it will be added when the questions are tagged from the full bank." },
    { type: "faded", title: "Your turn", given: "int x = 1, y = 2; int *p = &x, *q = &y; *p = *q; *q = 10;", steps: [
      { say: "After *p = *q; what is x?", blank: true, answer: "2: x gets y's value." },
      { say: "After *q = 10; what are x and y?", blank: true, answer: "x = 2 and y = 10." },
    ] },
    { type: "recall", cards: [
      { q: "What does &x give?", a: "The address of x." },
      { q: "What does *p do?", a: "Follows the address in p to the box, to read or write it." },
      { q: "int *p, q; How many pointers?", a: "One. q is an int." },
      { q: "Does *p = b link p's box to b?", a: "No. It copies b's value once." },
      { q: "What can swap(&x, &y) do that swap(x, y) cannot?", a: "Change the caller's x and y." },
      { q: "Is *NULL safe?", a: "No: undefined behaviour." },
      { q: "Why does scanf need &?", a: "It must write into your variable, so it needs the address." },
      { q: "Is a pointer 4 bytes?", a: "Machine-dependent; use the size the question gives." },
    ] },
    { type: "check", questions: [
      { id: "p1", kind: "NAT", marks: 1, q: "int a = 4; int *p = &a; (*p)++; printf(\"%d\", a); What is printed?", answer: "5", solution: "(*p)++ adds one to the box p points at." },
      { id: "p2", kind: "NAT", marks: 1, q: "int x = 1, y = 2; int *p = &x, *q = &y; *p = *q; *q = 10; What is x + y at the end?", answer: "12", solution: "x gets y's value (2); then y becomes 10: 2 + 10." },
      { id: "p3", kind: "MCQ", marks: 1, q: "What does int *p, q; declare?", options: ["Two pointers", "One pointer p and one int q", "One int p and one pointer q", "A syntax error"], answer: "B", solution: "The star belongs to p only." },
      { id: "p4", kind: "NAT", marks: 2, q: "int a = 5, b = 11, c = 20; int *ptr = &a; *ptr = c; ptr = &c; a = *(&b); c = *ptr - a; What is c? (GATE 2026 AN Q60)", answer: "9", solution: "a = 20, then ptr -> c, a = 11, c = 20 - 11 = 9." },
      { id: "p5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["*&x is the same as x", "In int *p, q; both are pointers", "swap(&x, &y) can change the caller's x and y", "Assigning to a pointer parameter changes the caller's pointer"], answer: "A, C", solution: "B: only p is a pointer. D: the function holds a copy of the arrow." },
      { id: "p6", kind: "NAT", marks: 2, q: "void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }  int x = 5; swap(&x, &x); What is x?", answer: "5", solution: "t = 5; *a = *b writes 5; *b = t writes 5." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on pointers", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "Full lesson text with 20 graded questions", sub: "docs/study-materials/v2/programming-and-data-structures/pilot", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Variables and types (C2)"], usedIn: ["Pointers II: arithmetic and arrays (C11)", "Linked lists", "Dynamic memory"], cross: ["COA: memory addresses"] },
  ],
};
