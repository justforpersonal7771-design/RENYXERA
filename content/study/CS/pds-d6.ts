import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D6 "Recursion on data structures" (29 Nov 2026). Real GATE question (text from public/data/questions.json, figure from
 * public/images/2023-FN/47_1.png): 2023 FN Q47, a function that prints the sum of every subtree, key C (3 8 16 13 24 50).
 * Programs compiled and run with gcc: that tree prints 3 8 16 13 24 50; reverse printing, length and sum of a list 3 2 1 | 3 6;
 * Tower of Hanoi moves 7 15 1023 for 3, 4 and 10 discs; fib(10) = 55 with 177 calls.
 */
export const chapterD6: Topic = {
  id: "cs.pds.ds.recursion6",
  title: "Recursion on data structures",
  no: "D6",
  book: [
    { t: "p", text: "A list is either empty or one node followed by a smaller list. A tree is either empty or a root with two smaller trees. Each of these definitions uses the thing being defined, and that is what **recursion** is: a function that solves a problem by solving the same problem on a smaller piece. You met recursion on numbers in chapter C8; this chapter uses it on the structures of this book, where it is the natural way to write almost everything." },
    { t: "p", text: "We look at the shape every recursive function on a list or a tree has, trace one that GATE asked about, and count what recursion costs in time and in memory. We finish with two classics, the Tower of Hanoi and the Fibonacci calls, because their call trees are the standard way to read a recurrence." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["write a recursive function on a list or a tree with the right base case;", "trace one by drawing the call tree and the order of the output;", "say what a recursive function costs in time and in stack space;", "solve the recurrences of Hanoi and Fibonacci from their call trees."] },

    { t: "h2", text: "The shape of a recursive function" },
    { t: "p", text: "Every recursive function has the same two parts. The **base case** answers the smallest problem directly, with no further call: the empty list, the empty tree, n = 0. The **recursive case** makes the problem smaller, calls itself on the smaller piece, and combines that answer with the work of the current step." },
    { t: "p", text: "Two checks catch most mistakes. First, does every chain of calls reach a base case? That needs each call to be on a strictly **smaller** piece (the next node, a child, n − 1). Second, does the base case return the value that makes the combination correct: 0 for a sum, 1 for a product, −1 for the height of an empty tree?" },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct node { int data; struct node *next; };

void print_reverse(struct node *h) { if (h == NULL) return; print_reverse(h->next); printf("%d ", h->data); }   /* print after the rest */
int length(struct node *h) { return h == NULL ? 0 : 1 + length(h->next); }
int sum(struct node *h)    { return h == NULL ? 0 : h->data + sum(h->next); }

int main(void) {
    struct node c = {3, NULL}, b = {2, &c}, a = {1, &b};
    print_reverse(&a);
    printf("| %d %d\\n", length(&a), sum(&a));
    return 0;
}`, out: "3 2 1 | 3 6", file: "list_recursion.c" },
    { t: "p", text: "Three small functions show the pattern on a list. `length` is 1 plus the length of the rest; `sum` is this value plus the sum of the rest; and `print_reverse` makes the call **first** and prints **afterwards**, so the last node prints first. Where the work sits, before or after the recursive call, decides the order of the output." },
    { t: "callout", kind: "key", text: "Work before the recursive call happens on the way down (preorder-like). Work after it happens on the way back (postorder-like). Move the print and the output reverses." },
    { t: "p", text: "A good habit when you write one is to say the function in a sentence first: 'the length of a list is 1 plus the length of what follows; the length of an empty list is 0'. If the sentence is right and the code follows it word for word, the function is right." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Recursion on a tree" },
    { t: "p", text: "A tree has two smaller pieces, the left and right subtrees, so a recursive function on a tree calls itself twice. The three traversals of chapter D7 are exactly the three places to put the work: before both calls (preorder), between them (inorder), after both (postorder)." },
    { t: "p", text: "GATE 2023 asked for the output of a function that returns the value of a node plus the values returned for its two subtrees, and prints what it returns. Because the print comes after both calls, the output follows the **postorder**, and each printed number is the sum of a whole subtree." },
    { t: "fig", id: "d6-f1" },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

typedef struct node { int val; struct node *left, *right; } node;
node *mk(int v, node *l, node *r) { node *n = malloc(sizeof *n); n->val = v; n->left = l; n->right = r; return n; }

int foo(node *p) {
    if (p == NULL) return 0;
    int retval = p->val + foo(p->left) + foo(p->right);
    printf("%d ", retval);                       /* printed after both subtrees */
    return retval;
}

int main(void) {
    node *t = mk(10, mk(5, mk(3, NULL, NULL), mk(8, NULL, NULL)), mk(11, NULL, mk(13, NULL, NULL)));
    foo(t);
    return 0;
}`, out: "3 8 16 13 24 50 ", file: "gate2023_q47.c" },
    { t: "p", text: "Follow it by hand. The leaves print their own value: 3 and 8. Their parent 5 returns 5 + 3 + 8 = 16 and prints it. On the right, 13 prints 13, then 11 returns 11 + 0 + 13 = 24 and prints it. The root returns 10 + 16 + 24 = 50 and prints last. The output is 3 8 16 13 24 50." },
    { t: "p", text: "A quick way to check your trace: the last number printed must be the answer for the whole tree (here 50, the sum of all six values), and the first number printed is a leaf. If your output does not end with the total, the order is wrong." },
    { t: "ex", id: "d6-e1" },
    { t: "p", text: "Height and size are the other two classic tree recursions. The height of an empty tree is −1 (or 0 if the question counts nodes), and the height of a tree is 1 plus the larger height of its two subtrees. The number of nodes is 1 plus the sizes of the two subtrees. Both are exactly the functions of chapter D7." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Reading a recursion from its call tree" },
    { t: "p", text: "To see what a recursive function really does, draw its **call tree**: the root is the first call, and each call has a child for every call it makes. The number of nodes of the call tree is the number of calls; the longest path is the deepest the stack gets; and the work per level gives the running time (chapter D1)." },
    { t: "fig", id: "d6-f2" },
    { t: "p", text: "The Fibonacci function `fib(n) = fib(n−1) + fib(n−2)` makes two calls on nearly the same size, so its call tree doubles at each level: about 2ⁿ calls. The tree for fib(4) has nine calls, and fib(10) makes 177 calls to compute 55. The same value is computed again and again, which is why the plain recursion is exponential and why a loop or a stored table is far better." },
    { t: "code", text: `#include <stdio.h>

long moves = 0;
void hanoi(int n, char from, char to, char via) {
    if (n == 0) return;
    hanoi(n - 1, from, via, to);          /* move the n-1 smaller discs out of the way */
    moves++;                               /* move the biggest disc */
    hanoi(n - 1, via, to, from);          /* move the n-1 discs on top of it */
}
long calls = 0;
int fib(int n) { calls++; return n < 2 ? n : fib(n - 1) + fib(n - 2); }

int main(void) {
    long m[3]; int ns[3] = {3, 4, 10};
    for (int i = 0; i < 3; i++) { moves = 0; hanoi(ns[i], 'A', 'C', 'B'); m[i] = moves; }
    int f = fib(10);
    printf("%ld %ld %ld | %d %ld\\n", m[0], m[1], m[2], f, calls);
    return 0;
}`, out: "7 15 1023 | 55 177", file: "hanoi_fib.c" },
    { t: "p", text: "The **Tower of Hanoi** moves n discs from one peg to another, one at a time, never putting a bigger disc on a smaller one. The recursion says: move the n − 1 upper discs to the spare peg, move the biggest disc, then move the n − 1 discs back on top. So the number of moves obeys T(n) = 2T(n − 1) + 1 with T(0) = 0, which is exactly the recurrence of chapter D1, and T(n) = 2ⁿ − 1: 7 moves for 3 discs, 15 for 4, 1023 for 10." },
    { t: "fig", id: "d6-f3" },
    { t: "p", text: "Notice how Hanoi and Fibonacci differ although both double: in Hanoi the two calls are on n − 1 and the work between them is one move, so the count is 2ⁿ − 1 and the calls are all needed; in Fibonacci the two calls overlap in what they compute, so memory of earlier results turns an exponential cost into a linear one." },
    { t: "ex", id: "d6-e2" },
    { t: "ex", id: "d6-e3" },
    { t: "trap", i: 2 },

    { t: "h2", text: "What recursion costs" },
    { t: "p", text: "Each call that is still waiting for its inner calls keeps a **stack frame** (chapter C6): its arguments, its locals and where to return to. So the memory used is the **depth** of the recursion, not the number of calls. Walking a list of n nodes recursively reaches depth n and uses Θ(n) stack space; a balanced tree has depth about log₂ n and uses Θ(log n); a chain-shaped tree has depth n again." },
    { t: "p", text: "That is why a recursion that is fine on a balanced tree can overflow the stack on a long list or on a skewed tree. A loop with an explicit stack of your own, or a rewrite as a loop, avoids the problem. For time, count the calls: each recursion above makes one call per node (Θ(n)), except the doubling ones (Hanoi, plain Fibonacci), which make an exponential number." },
    { t: "table", head: ["Function", "Calls", "Time", "Greatest depth (stack space)"], rows: [["length of a list of n nodes", "n + 1", "Θ(n)", "Θ(n)"], ["sum or print of a balanced tree", "about 2n + 1", "Θ(n)", "Θ(log n)"], ["the same on a chain-shaped tree", "about 2n + 1", "Θ(n)", "Θ(n)"], ["Hanoi with n discs", "2ⁿ⁺¹ − 1", "Θ(2ⁿ)", "Θ(n)"], ["plain fib(n)", "about 1.6ⁿ", "exponential", "Θ(n)"], ["binary search, recursive", "about log₂ n", "Θ(log n)", "Θ(log n)"]] },
    { t: "ex", id: "d6-e4" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Recursion questions on data structures are of three kinds: **output of a recursive function** on a tree or list (example 1, the 2023 question), **count the calls or moves** (examples 2 and 3), and **time and space of a recursion** (example 4). Chapters C8 (recursion in C) and D3, D7 and D8 contain more of the same: the recursive list size of 2026 FN Q39 and the tree functions of chapters D7 and D8." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you can follow the order of the calls without losing the pending ones. Draw the structure, write the value of each call beside its node, and note whether the print comes before or after the recursive calls." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Putting the print on the wrong side of the recursive call, which reverses the order.", "Forgetting the base case value (0 against 1, or −1 for the height of an empty tree).", "Counting the stack space as the number of calls instead of the depth.", "Saying plain recursive Fibonacci is O(n).", "Writing 2ⁿ for Hanoi instead of 2ⁿ − 1."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A recursive function has a base case and a recursive case on a strictly smaller piece.", "Work before the call happens going down; work after it happens coming back: this decides the output order.", "On a tree the function calls itself twice; its three positions are the three traversals.", "Call tree: nodes are calls, depth is the stack, work per level is the time.", "Hanoi: T(n) = 2T(n − 1) + 1 = 2ⁿ − 1. Plain Fibonacci: exponential, 177 calls for n = 10.", "Stack space equals the depth of the recursion: Θ(n) for a list, Θ(log n) for a balanced tree."] },
  ],
  blocks: [
    { type: "figure", id: "d6-f1", caption: "The tree of GATE 2023 FN Q47. foo returns the sum of a subtree and prints it after both subtrees, so the sums print in postorder: 3, 8, 16, 13, 24, 50.", alt: "A binary tree with root 10, left child 5 with leaves 3 and 8, right child 11 with a right child 13.", fig: { kind: "tree", title: "Prints the sum of every subtree", root: { label: 10, kids: [{ label: 5, kids: [{ label: 3 }, { label: 8 }] }, { label: 11, kids: [null, { label: 13 }] }] } } },
    { type: "figure", id: "d6-f2", caption: "The call tree of fib(4): nine calls. fib(2) is computed twice and fib(1) three times, which is why plain recursion grows exponentially.", alt: "The call tree of fib(4) with fib(3) and fib(2) below the root and so on down to fib(1) and fib(0).", fig: { kind: "calltree", order: true, title: "fib(4)", root: { label: "fib(4)", ret: 3, kids: [{ label: "fib(3)", ret: 2, kids: [{ label: "fib(2)", ret: 1, kids: [{ label: "fib(1)", ret: 1 }, { label: "fib(0)", ret: 0 }] }, { label: "fib(1)", ret: 1 }] }, { label: "fib(2)", ret: 1, kids: [{ label: "fib(1)", ret: 1 }, { label: "fib(0)", ret: 0 }] }] } } },
    { type: "figure", id: "d6-f3", caption: "Moves needed for the Tower of Hanoi: each extra disc doubles the work and adds one move.", alt: "A table with the number of discs 1 to 5 and the number of moves 1, 3, 7, 15, 31.", fig: { kind: "matrix", title: "T(n) = 2 T(n − 1) + 1", cols: ["1", "2", "3", "4", "5"], rows: [{ label: "discs", cells: [1, 2, 3, 4, 5] }, { label: "moves", cells: [1, 3, 7, 15, 31], hl: true }, { label: "2ⁿ − 1", cells: [1, 3, 7, 15, 31] }] } },

    { type: "example", id: "d6-e1", level: "gate", title: "GATE CS 2023 (forenoon), Q47 · 2 marks · MCQ: what does foo print", file: "gate2023_q47.c", given: `#include <stdio.h>
#include <stdlib.h>
typedef struct node { int val; struct node *left, *right; } node;
node *mk(int v, node *l, node *r) { node *n = malloc(sizeof *n); n->val = v; n->left = l; n->right = r; return n; }
int foo(node *p) {
    if (p == NULL) return 0;
    int retval = p->val + foo(p->left) + foo(p->right);
    printf("%d ", retval);
    return retval;
}
int main(void) {
    node *t = mk(10, mk(5, mk(3, NULL, NULL), mk(8, NULL, NULL)), mk(11, NULL, mk(13, NULL, NULL)));
    foo(t);
    return 0;
}`, find: "The output for the tree in the figure (root 10; 5 with leaves 3 and 8; 11 with a right child 13). Options: (A) 3 8 5 13 11 10  (B) 3 5 8 10 11 13  (C) 3 8 16 13 24 50  (D) 3 16 8 50 24 13.", steps: [
      { say: "The print comes after both recursive calls, so nodes print in postorder: 3, 8, 5, 13, 11, 10 are the nodes in that order.", result: "postorder" },
      { say: "Each printed number is the value returned: a leaf returns its own value (3, 8, 13).", result: "3, 8, 13" },
      { say: "Node 5 returns 5 + 3 + 8 = 16. Node 11 returns 11 + 0 + 13 = 24. The root returns 10 + 16 + 24.", result: "16, 24, 50" },
      { say: "In order: 3, 8, 16, then 13, 24, then 50.", result: "3 8 16 13 24 50" },
    ], answer: "C: 3 8 16 13 24 50", check: "The program was compiled and run." },
    { type: "example", id: "d6-e2", level: "easy", title: "Moves of the Tower of Hanoi", file: "hanoi_count.txt", given: `5 discs, T(0) = 0, T(n) = 2 T(n − 1) + 1.`, find: "The number of moves.", steps: [
      { say: "Build up: T(1) = 1, T(2) = 3, T(3) = 7, T(4) = 15.", result: "15" },
      { say: "T(5) = 2 × 15 + 1.", result: "31" },
    ], answer: "31 = 2⁵ − 1", check: "The program counts 7, 15 and 1023 moves for 3, 4 and 10 discs." },
    { type: "example", id: "d6-e3", level: "gate", title: "Calls made by fib", file: "fib_calls.txt", given: `fib(n) = fib(n−1) + fib(n−2), fib(0) = 0, fib(1) = 1. c(n) is the number of calls fib(n) makes, counting itself.`, find: "c(5), and c(10).", steps: [
      { say: "c(0) = c(1) = 1 (one call, no more). Otherwise c(n) = 1 + c(n−1) + c(n−2).", result: "c(2) = 3, c(3) = 5, c(4) = 9" },
      { say: "c(5) = 1 + 9 + 5.", result: "15" },
      { say: "Continue: c(6) = 25, c(7) = 41, c(8) = 67, c(9) = 109, c(10) = 1 + 109 + 67.", result: "177" },
    ], answer: "c(5) = 15; c(10) = 177", check: "The program in this chapter counts 177 calls for fib(10) = 55." },
    { type: "example", id: "d6-e4", level: "gate", title: "Stack space of a recursion", file: "stack_space.txt", given: `A function walks a linked list of n = 100000 nodes with one recursive call per node. The same idea is used on a balanced tree of n nodes.`, find: "The stack depth in each.", steps: [
      { say: "The list: each call waits for the next, so n frames are pending at the end.", result: "Θ(n) = 100000 frames" },
      { say: "The balanced tree: the depth is the height, about log₂ n.", result: "Θ(log n), about 17 frames" },
    ], answer: "List Θ(n); balanced tree Θ(log n)", check: "A skewed tree has depth n, like the list." },

    { type: "trap", wrong: "print_reverse prints the list in the order of the nodes, because the print is in the function.", tempting: "The print statement sits in a function that walks the list from the head.", whyWrong: "The print is placed AFTER the recursive call, so it runs only when the deeper calls have returned. The last node prints first. Move the print before the call and the order becomes forward.", rule: "Before the call: forward order. After the call: reverse order.", ex: { code: "list 1 → 2 → 3, print after the call", out: "3 2 1" } },
    { type: "trap", wrong: "The height of an empty tree is 0, so a function for the height returns 0 at NULL.", tempting: "Nothing is there, so zero.", whyWrong: "If the height counts EDGES, a single node has height 0, so the empty tree must be −1 for 1 + max(−1, −1) to give 0. With 0 at NULL a single node would come out as 1 (the node count of the longest path). The base case must match the definition the question uses.", rule: "Edges: empty tree −1. Nodes: empty tree 0.", ex: { code: "single node, base case −1: 1 + max(−1, −1)", out: "0 edges" } },
    { type: "trap", wrong: "Tower of Hanoi with n discs takes 2ⁿ moves.", tempting: "Each disc doubles the work.", whyWrong: "T(n) = 2T(n − 1) + 1 and T(0) = 0 gives 2ⁿ − 1: the +1 in each step (the move of the largest disc) reduces the doubling by one. For 3 discs it is 7, not 8.", rule: "Hanoi: 2ⁿ − 1 moves.", ex: { code: "T(1)=1, T(2)=3, T(3)=7, T(4)=15", out: "2ⁿ − 1" } },

    { type: "gate", text: "GATE 2023 FN Q47 (the sum of every subtree, printed in postorder) is the recursion question tagged to this chapter; 2026 FN Q39 (recursive list size, chapter D3) and the tree functions of D7 and D8 are the others. Recursion on numbers is in chapter C8." },
    { type: "recall", cards: [
      { q: "What are the two parts of a recursive function?", a: "A base case and a recursive case on a strictly smaller piece." },
      { q: "Where must the print go to reverse a list?", a: "After the recursive call." },
      { q: "Which traversal does 'work after both recursive calls' give?", a: "Postorder." },
      { q: "Base case for the height of a tree counted in edges?", a: "−1 for the empty tree." },
      { q: "Moves of the Tower of Hanoi for n discs?", a: "2ⁿ − 1." },
      { q: "Calls of plain fib(10)?", a: "177." },
      { q: "What decides the stack space of a recursion?", a: "The depth, not the number of calls." },
      { q: "Stack space for a list of n nodes? A balanced tree?", a: "Θ(n); Θ(log n)." },
      { q: "How do you read a recurrence from code?", a: "Draw the call tree: work per level times the number of levels." },
      { q: "Why is plain recursive Fibonacci slow?", a: "It recomputes the same values: about 1.6ⁿ calls." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "How many moves does the Tower of Hanoi need for 6 discs?", answer: "63", solution: "2⁶ − 1." },
      { id: "h2", kind: "NAT", marks: 1, q: "A recursive function returns 1 + length(rest) and 0 for an empty list. What does it return for a list of 12 nodes?", answer: "12", solution: "One for each node." },
      { id: "h3", kind: "MCQ", marks: 1, q: "A function walks a linked list of n nodes recursively. Its stack space is", options: ["Θ(1)", "Θ(log n)", "Θ(n)", "Θ(n²)"], answer: "C", solution: "n frames pending at the deepest point." },
      { id: "h4", kind: "NAT", marks: 1, q: "How many calls does fib(6) make in all, counting the first? (fib(0) = 0, fib(1) = 1, calls counted as in this chapter)", answer: "25", solution: "c(6) = 1 + c(5) + c(4) = 1 + 15 + 9." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["Printing after the recursive call reverses the order of a list", "Plain recursive Fibonacci is exponential", "Hanoi takes 2ⁿ moves", "Recursion on a balanced tree uses Θ(log n) stack space"], answer: "A, B, D", solution: "Hanoi takes 2ⁿ − 1." },
      { id: "h6", kind: "NAT", marks: 2, q: "void p(node *t) { if (!t) return; p(t->left); p(t->right); printf(\"%d \", t->val); } is called on the tree with root 1, left child 2, right child 3, where 2 has a left child 4. What is the third number printed?", answer: "3", solution: "Postorder: 4, 2, 3, 1 (left subtree, right subtree, root); the third number is 3." },
      { id: "h7", kind: "NAT", marks: 2, q: "int f(int n) { if (n == 0) return 0; return n + f(n - 1) + f(n - 1); } What does f(3) return?", answer: "11", solution: "f(1) = 1 + 0 + 0 = 1; f(2) = 2 + 1 + 1 = 4; f(3) = 3 + 4 + 4 = 11." },
      { id: "h8", kind: "NAT", marks: 2, q: "A recursive function on a tree prints the sum of each subtree after its two subtrees, like foo in this chapter. On the tree with root 4, left child 1 and right child 2, what is the last number printed?", answer: "7", solution: "The root prints 4 + 1 + 2 = 7, after 1 and 2." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on recursion", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "back to the contents", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Recursion in C (C8)", "Linked lists (D3)", "Counting and growth (D1)"], usedIn: ["Trees and traversals (D7)", "Binary search trees (D8)", "Algorithms: divide and conquer"], cross: ["Algorithms: recurrences"] },
  ],
};
