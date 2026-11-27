import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D3 "Linked lists: nodes and pointers" (28 Nov 2026). Real GATE questions explained (texts from public/data/questions.json):
 * 2026 FN Q39 (getListSize recursion, key B), 2023 FN Q13 (delete from a singly vs doubly list, key D), 2022 FN Q15 (reverse in O(1) space, key A),
 * 2025 FN Q62 (remove nodes of L1 found in L2: the lists are in a picture, so the method is shown on a variant with lists written out).
 * Programs compiled and run with gcc (scripts/chapter-check.ts).
 */
export const chapterD3: Topic = {
  id: "cs.pds.ds.lists3",
  title: "Linked lists: nodes and pointers",
  no: "D3",
  book: [
    { t: "p", text: "An array keeps its items in one rigid block. A **linked list** does the opposite: every item lives in its own small box, called a **node**, and each node holds a pointer to the next one. The boxes can be anywhere in memory; the pointers are the thread that joins them." },
    { t: "p", text: "This chapter builds the singly linked list from the node up: how to insert and delete, why each operation costs what it does, how to reverse a list in place, how doubly and circular lists change the costs, and how GATE tests all of it. You will need pointers and `malloc` from chapters C10 and C15." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["draw a linked list and say what each pointer holds;", "write insert at the head, insert at the tail, insert after a node, and delete, and state each one's cost;", "reverse a list with three pointers and no extra space;", "say why deleting a node given only a pointer to it costs O(n) in a singly list but O(1) in a doubly list;", "read a recursive function on a list and fill in its base case."] },

    { t: "h2", text: "A node, and a chain of nodes" },
    { t: "p", text: "A node is a `struct` with two parts: the **data** and a pointer to the next node. A pointer inside a struct that points to the same struct type is called a **self-referential** structure, and it is the one new idea in this chapter." },
    { t: "code", text: `#include <stdio.h>

struct node {
    int data;
    struct node *next;          /* points at a node of the same type */
};

int main(void) {
    struct node c = {30, NULL}, b = {20, &c}, a = {10, &b};
    struct node *head = &a;
    for (struct node *p = head; p != NULL; p = p->next) printf("%d ", p->data);
    return 0;
}`, out: "10 20 30 ", file: "node.c" },
    { t: "p", text: "The list as a whole is reached through one pointer, usually named `head`, that points to the first node. The last node's `next` is `NULL`, which means 'nothing follows'. An empty list is simply `head == NULL`. There is no length stored anywhere: to know how many nodes there are, you must walk the chain." },
    { t: "fig", id: "d3-f1" },
    { t: "p", text: "Compare this with the array of chapter D2. In an array, item i is at base + i × w, so you can jump to it. In a list there is no formula: to reach the third node you must start at `head` and follow two `next` pointers. That single difference explains almost every cost in this chapter." },
    { t: "callout", kind: "key", text: "Array: any item in one step, but rigid. Linked list: flexible, but you reach item k only by following k pointers." },

    { t: "h2", text: "Walking and searching" },
    { t: "p", text: "Visiting every node is a loop with one pointer that moves along the chain. The pointer starts at `head` and stops when it becomes `NULL`." },
    { t: "p", text: "Searching for a value is the same walk with a comparison. In the worst case (the value is last or absent) you visit all n nodes, so search is **Θ(n)**, and on average, if the value is present and equally likely anywhere, (n + 1) / 2 nodes. A linked list cannot use binary search even if it is sorted, because it cannot jump to the middle." },
    { t: "ex", id: "d3-e1" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Inserting" },
    { t: "p", text: "Inserting is where lists shine, because nothing has to move. To insert at the **head**: make a new node, point its `next` at the old first node, then make `head` point at the new node. The **order of the two pointer changes matters**: if you move `head` first, you lose the rest of the list." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct node { int data; struct node *next; };

struct node *push_front(struct node *head, int v) {
    struct node *n = malloc(sizeof *n);
    n->data = v;
    n->next = head;        /* 1. new node points at the old first node */
    return n;              /* 2. the new node becomes the head */
}

int main(void) {
    struct node *head = NULL;
    for (int v = 1; v <= 3; v++) head = push_front(head, v);
    for (struct node *p = head; p != NULL; p = p->next) printf("%d ", p->data);
    return 0;
}`, out: "3 2 1 ", file: "push_front.c" },
    { t: "p", text: "Three pushes of 1, 2, 3 give the list 3, 2, 1, because each new node goes in front. Insert at the head costs **Θ(1)**, whatever the length." },
    { t: "fig", id: "d3-f2" },
    { t: "p", text: "To insert **after** a node you already have a pointer to (call it `p`), do the same two steps: the new node's `next` takes `p->next`, then `p->next` takes the new node. That is also Θ(1). To insert at the **tail** you need the last node first; without a tail pointer you must walk the whole list, so it costs Θ(n). Many programs therefore keep a second pointer, `tail`, which makes insert at the tail Θ(1) as well." },
    { t: "callout", kind: "tip", text: "Insert: new->next = (the node after the spot); then (the node before the spot)->next = new. Always link the new node forward first." },

    { t: "h2", text: "Deleting" },
    { t: "p", text: "To delete the node `q` you must make the node **before** it skip over it: `prev->next = q->next`, and then free `q`. The catch is `prev`. A singly linked list has no pointer backwards, so unless you already have `prev`, you must walk from the head to find it." },
    { t: "p", text: "Deleting the **first** node is easy: `head = head->next`. Deleting a node given only a pointer to it, in the middle or at the end, needs the walk: **Θ(n)** in the worst case. This is exactly the contrast that GATE 2023 tests (example 4 below)." },
    { t: "ex", id: "d3-e2" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Reversing a list in place" },
    { t: "p", text: "To reverse a list we do not move any data; we turn every arrow around. The trick is to walk the list with **three pointers**: `prev` (the part already reversed), `cur` (the node being turned) and `next` (saved before we break the link, so we do not lose the rest)." },
    { t: "fig", id: "d3-f3" },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct node { int data; struct node *next; };

struct node *push_front(struct node *head, int v) {
    struct node *n = malloc(sizeof *n);
    n->data = v; n->next = head;
    return n;
}

struct node *reverse(struct node *head) {
    struct node *prev = NULL, *cur = head;
    while (cur != NULL) {
        struct node *next = cur->next;   /* save the rest */
        cur->next = prev;                /* turn the arrow around */
        prev = cur;                      /* step forward */
        cur = next;
    }
    return prev;                         /* prev is the new head */
}

int main(void) {
    struct node *head = NULL;
    for (int v = 4; v >= 1; v--) head = push_front(head, v);   /* 1 2 3 4 */
    head = reverse(head);
    for (struct node *p = head; p != NULL; p = p->next) printf("%d ", p->data);
    return 0;
}`, out: "4 3 2 1 ", file: "reverse_list.c" },
    { t: "p", text: "Each node is visited once and only three pointers are used, so reversing takes **Θ(n) time and O(1) extra space**. Nothing can be faster than Θ(n), because every node's pointer must change; and the O(1)-space limit does not make it slower. This is the fact asked in GATE 2022 (example 5)." },
    { t: "ex", id: "d3-e3" },

    { t: "h2", text: "Doubly and circular lists" },
    { t: "p", text: "A **doubly linked list** gives each node a second pointer, `prev`, to the node before it. Now the predecessor of any node is one step away, and a node can be deleted with only a pointer to itself: `q->prev->next = q->next` and `q->next->prev = q->prev`. The price is one more pointer in every node, and two pointers to fix on every insert and delete." },
    { t: "fig", id: "d3-f4" },
    { t: "p", text: "In a **circular** list the last node's `next` points back to the first instead of `NULL`. There is no end to fall off, so a loop must stop by comparing with its starting node, not with `NULL`. A circular list with a pointer to the **last** node reaches both ends in one step: the head is `last->next`. Circular lists are the natural home of round-robin scheduling." },
    { t: "table", head: ["Operation", "Array", "Singly linked", "Doubly linked"], rows: [["Access the k-th item", "Θ(1)", "Θ(k), up to n", "Θ(k), up to n"], ["Search", "Θ(n)", "Θ(n)", "Θ(n)"], ["Insert at the head", "Θ(n) (shift)", "Θ(1)", "Θ(1)"], ["Insert at the tail", "Θ(1) if room", "Θ(n), Θ(1) with a tail pointer", "Θ(1) with a tail pointer"], ["Insert after a given node", "Θ(n) (shift)", "Θ(1)", "Θ(1)"], ["Delete a given node", "Θ(n) (shift)", "Θ(n) (find the previous one)", "Θ(1)"], ["Extra space per item", "none", "one pointer", "two pointers"]] },
    { t: "ex", id: "d3-e4" },
    { t: "trap", i: 2 },

    { t: "h2", text: "Recursion on a list" },
    { t: "p", text: "A list is a recursive thing: a list is either empty, or one node followed by a **smaller list** (the rest). So a recursive function on a list naturally has a **base case** (the list is empty, or has one node) and a **recursive case** (do the work for this node, then call itself on `head->next`). The count of nodes is the classic example: the size of a list is 1 plus the size of its rest." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct node { int elt; struct node *next; };

int getListSize(struct node *head) {
    if (head->next == NULL) return 1;          /* one node: size 1 */
    return 1 + getListSize(head->next);        /* this node plus the rest */
}

int main(void) {
    struct node c = {30, NULL}, b = {20, &c}, a = {10, &b}, z = {5, &a};
    printf("%d\\n", getListSize(&z));
    return 0;
}`, out: "4", file: "list_size.c" },
    { t: "p", text: "Two details decide whether the function is correct. First, the base case must stop **before** the pointer becomes `NULL`, because the function dereferences `head->next`: for a non-empty list we stop at the last node, where `head->next == NULL`. Second, the recursive call must go to `head->next`, a **smaller** list; calling it on `head` again would never end." },
    { t: "ex", id: "d3-e5" },
    { t: "trap", i: 3 },
    { t: "h3", text: "Removing nodes found in another list" },
    { t: "p", text: "A harder pattern, used in GATE 2025, walks one list and removes every node whose value also appears in a second list, using a helper `find`. The idea: keep a pointer `ptr1` at the node **before** the one under test; if the next node's value is found in the second list, **skip it** (`ptr1->next = ptr1->next->next`) and do **not** move `ptr1`; otherwise move `ptr1` forward. Note what is never tested: the first node, because only `ptr1->next` is examined." },
    { t: "ex", id: "d3-e6" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Linked-list questions come in four forms: a **code completion** (fill in the base case or the pointer update, example 5), a **cost comparison** between singly and doubly linked lists or against arrays (example 4), a **pointer-manipulation trace** that deletes or inserts nodes (example 6), and a **conceptual** question such as reversing in O(1) space (example 3)." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you can follow pointers one assignment at a time. Draw the list, write each pointer variable next to the node it points at, and redraw after every assignment. The most common slip is losing the rest of the list by overwriting a pointer before saving it." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Moving `head` before pointing the new node at the old first node, which loses the list.", "Deleting a node in a singly list as if it were O(1); it needs the previous node.", "Dereferencing `NULL`: using `head->next` when the list may be empty.", "Forgetting that after skipping a node, the pointer stays where it is.", "Thinking a sorted linked list allows binary search."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A node holds data and a pointer to the next node; the list is reached through `head`; the last `next` is `NULL`.", "No random access: the k-th node costs k steps. Search is Θ(n).", "Insert at the head, or after a known node, is Θ(1): link the new node forward first.", "Delete needs the previous node: Θ(n) in a singly list, Θ(1) in a doubly list.", "Reverse in place with prev, cur, next: Θ(n) time, O(1) space.", "A list is recursive: size = 1 + size of the rest; the base case is the last node."] },
  ],
  blocks: [
    { type: "figure", id: "d3-f1", caption: "head points at the first node. Each node holds a value and the address of the next; the last holds NULL.", alt: "A chain of four nodes 10, 20, 30, 40 joined by arrows with head pointing at the first.", fig: { kind: "linked", title: "head → 10 → 20 → 30 → 40 → NULL", nodes: [{ id: "a", data: 10, next: "b" }, { id: "b", data: 20, next: "c" }, { id: "c", data: 30, next: "d" }, { id: "d", data: 40, next: null }], heads: [{ name: "head", to: "a" }] } },
    { type: "figure", id: "d3-f2", caption: "Insert 5 at the head. First the new node points at the old first node (10), then head points at the new node. Four steps of work for any length: just two pointers.", alt: "Two frames: the new node 5 pointing at 10, then head moved to 5.", fig: { kind: "frames", title: "Insert 5 at the head", frames: [
      { caption: "Before: head points at 10.", fig: { kind: "linked", nodes: [{ id: "a", data: 10, next: "b" }, { id: "b", data: 20, next: null }], heads: [{ name: "head", to: "a" }] } },
      { caption: "Step 1: the new node 5 points at 10. head still points at 10.", fig: { kind: "linked", nodes: [{ id: "n", data: 5, next: "a", tone: "hl" }, { id: "a", data: 10, next: "b" }, { id: "b", data: 20, next: null }], heads: [{ name: "head", to: "a" }] } },
      { caption: "Step 2: head moves to the new node. The list is 5, 10, 20.", fig: { kind: "linked", nodes: [{ id: "n", data: 5, next: "a", tone: "ok" }, { id: "a", data: 10, next: "b" }, { id: "b", data: 20, next: null }], heads: [{ name: "head", to: "n" }] } },
    ] } },
    { type: "figure", id: "d3-f3", caption: "Reversing 1, 2, 3 with prev and cur. Each step turns one arrow around; at the end prev is the new head.", alt: "Four frames of a three-node list as each arrow is turned around and prev advances.", fig: { kind: "frames", title: "Reverse 1 → 2 → 3", frames: [
      { caption: "Start: prev is NULL (not drawn), cur is the first node.", fig: { kind: "linked", nodes: [{ id: "a", data: 1, next: "b" }, { id: "b", data: 2, next: "c" }, { id: "c", data: 3, next: null }], heads: [{ name: "cur", to: "a" }] } },
      { caption: "After step 1: node 1 points to NULL. prev = 1, cur = 2.", fig: { kind: "linked", nodes: [{ id: "a", data: 1, next: null, tone: "ok" }, { id: "b", data: 2, next: "c" }, { id: "c", data: 3, next: null }], heads: [{ name: "prev", to: "a" }, { name: "cur", to: "b" }] } },
      { caption: "After step 2: node 2 points back to 1. prev = 2, cur = 3.", fig: { kind: "linked", nodes: [{ id: "c", data: 3, next: null }, { id: "b", data: 2, next: "a", tone: "ok" }, { id: "a", data: 1, next: null, tone: "ok" }], heads: [{ name: "prev", to: "b" }, { name: "cur", to: "c" }] } },
      { caption: "After step 3: node 3 points back to 2, cur is NULL. prev = 3 is the new head: 3, 2, 1.", fig: { kind: "linked", nodes: [{ id: "c", data: 3, next: "b", tone: "ok" }, { id: "b", data: 2, next: "a", tone: "ok" }, { id: "a", data: 1, next: null, tone: "ok" }], heads: [{ name: "head", to: "c" }] } },
    ] } },
    { type: "figure", id: "d3-f4", caption: "A doubly linked list: every node has a pointer both ways, so the node before any node is one step away.", alt: "Three nodes 5, 6, 7 joined by arrows in both directions, with head at the first.", fig: { kind: "linked", doubly: true, title: "NULL ← 5 ⇄ 6 ⇄ 7 → NULL", nodes: [{ id: "a", data: 5, next: "b", prev: null }, { id: "b", data: 6, next: "c", prev: "a" }, { id: "c", data: 7, next: null, prev: "b" }], heads: [{ name: "head", to: "a" }] } },

    { type: "example", id: "d3-e1", level: "easy", title: "Search a list: how many nodes are visited", file: "search_count.txt", given: `List: 7 -> 3 -> 9 -> 4 -> NULL
Search for 9, then for 8.`, find: "How many nodes are visited in each search.", steps: [
      { say: "Searching for 9 visits 7, 3 and then 9, where it stops.", result: "3 nodes" },
      { say: "Searching for 8 finds no match, so every node is visited before NULL.", result: "4 nodes" },
    ], answer: "3 nodes for 9; 4 nodes for 8 (worst case n)", check: "A miss always costs n; a hit costs its position." },
    { type: "example", id: "d3-e2", level: "easy", title: "Delete the last node of a singly list: count the steps", file: "delete_last.txt", given: `List of n = 6 nodes. You hold only a pointer q to the last node.
Delete it. How many links must be followed to find the previous node?`, find: "The links followed, and the cost in general.", steps: [
      { say: "There is no backward pointer, so start at head and walk until the node whose next is q.", result: "head → ... → 5th node" },
      { say: "From the 1st node to the 5th is 4 hops.", result: "4 links" },
      { say: "Then prev->next = NULL and free q. In general it takes n − 2 hops: Θ(n).", result: "Θ(n)" },
    ], answer: "4 links for n = 6; in general Θ(n)", check: "With a doubly list, q->prev is the node: 0 links." },
    { type: "example", id: "d3-e3", level: "gate", title: "GATE CS 2022 (forenoon), Q15 · 1 mark · MCQ: reverse a list in O(1) space", file: "gate2022_q15.txt", given: `Reverse a singly linked list of n nodes using O(1) extra space.
Which is true about the time of the best algorithm?
(A) Θ(n) in the worst case  (B) Θ(n log n)  (C) Θ(n²)  (D) not possible in O(1) space`, find: "The correct option.", steps: [
      { say: "Three pointers (prev, cur, next) are enough, so it is possible in O(1) space: D is false.", result: "D out" },
      { say: "One pass visits each node once and turns its arrow: Θ(n).", result: "upper bound n" },
      { say: "Every node's pointer must change, so no algorithm can take less than n steps. B and C are slower than needed.", result: "lower bound n" },
    ], answer: "A: Θ(n)", check: "The program in this chapter reverses 1 2 3 4 into 4 3 2 1 with three pointers." },
    { type: "example", id: "d3-e4", level: "gate", title: "GATE CS 2023 (forenoon), Q13 · 1 mark · MCQ: delete given a pointer to the node", file: "gate2023_q13.txt", given: `SLLdel deletes a node in a singly linked list, given a pointer to the node and a pointer to the head.
DLLdel does the same in a doubly linked list.
n nodes in each list. Worst-case time of SLLdel and DLLdel?
(A) O(1) and O(n)  (B) both O(log n)  (C) both O(1)  (D) O(n) and O(1)`, find: "The correct option.", steps: [
      { say: "SLLdel must reach the node before the target to change its next: walk from the head, up to n steps.", result: "SLLdel = O(n)" },
      { say: "DLLdel has node->prev, so it fixes both neighbours directly: prev->next = next and next->prev = prev.", result: "DLLdel = O(1)" },
    ], answer: "D: SLLdel is O(n) and DLLdel is O(1)", check: "Deleting the first node of a singly list is O(1), but the worst case is a late node." },
    { type: "example", id: "d3-e5", level: "gate", title: "GATE CS 2026 (forenoon), Q39 · 2 marks · MCQ: size of a list by recursion", file: "gate2026_q39.c", given: `#include <stdio.h>
struct node { int elt; struct node *next; };
int getListSize(struct node *head) {
    if (head->next == NULL) return 1;
    return 1 + getListSize(head->next);
}
int main(void) {
    struct node c = {3, NULL}, b = {2, &c}, a = {1, &b};
    printf("%d", getListSize(&a));
    return 0;
}`, find: "Which replacements for E1 and E2 make the function count the nodes of a non-empty list?", steps: [
      { say: "E1 must stop at the LAST node and return 1 there. If E1 were head == NULL, the function would return 1 for the empty list past the end and count one node too many.", result: "E1: head->next == NULL" },
      { say: "At the last node the size is 1.", result: "return 1" },
      { say: "Otherwise the size is this node plus the size of the rest, called on head->next (a smaller list).", result: "E2: 1 + getListSize(head->next)" },
      { say: "For 1 → 2 → 3: 1 + (1 + 1).", result: "3" },
    ], answer: "B: E1 is head->next == NULL; E2 is 1 + getListSize(head->next)", check: "The program was compiled and run." },
    { type: "example", id: "d3-e6", level: "gate", title: "Remove the nodes of L1 that are in L2 (variant of GATE CS 2025, Q62)", file: "gate2025_variant.c", given: `#include <stdio.h>
struct node { int data; struct node *next; };
int find(int q, struct node *l) {
    while (l != NULL) { if (l->data == q) return 1; l = l->next; }
    return 0;
}
int main(void) {
    struct node a5 = {5, NULL}, a4 = {4, &a5}, a3 = {3, &a4}, a2 = {2, &a3}, a1 = {1, &a2};
    struct node b4 = {4, NULL}, b2 = {2, &b4};
    struct node *p1 = &a1;
    while (p1->next != NULL) {
        int q = p1->next->data;
        if (find(q, &b2)) p1->next = p1->next->next;
        else p1 = p1->next;
    }
    for (struct node *p = &a1; p != NULL; p = p->next) printf("%d ", p->data);
    return 0;
}`, find: "The list L1 afterwards, with L1 = 1 2 3 4 5 and L2 = 2 4. (The real question gives its lists in a figure; this variant has them written out.)", steps: [
      { say: "p1 at 1; the next node is 2, which is in L2: skip it. p1 stays at 1.", result: "1 3 4 5" },
      { say: "Next is now 3, not in L2: move p1 to 3.", result: "p1 = 3" },
      { say: "Next is 4, in L2: skip it. p1 stays at 3.", result: "1 3 5" },
      { say: "Next is 5, not in L2: move p1 to 5. Now p1->next is NULL: stop.", result: "1 3 5" },
    ], answer: "1 3 5 (3 nodes)", check: "The program was compiled and run. The head node is never tested, because only p1->next is." },

    { type: "trap", wrong: "To find a value in a sorted linked list, use binary search.", tempting: "Binary search works on sorted arrays, and a sorted list is sorted too.", whyWrong: "Binary search needs to jump to the middle in one step. A linked list has no such jump: reaching the middle takes n / 2 pointer hops, so the search still costs Θ(n).", rule: "Binary search needs random access; a list has none.", ex: { code: "sorted list of 1000 nodes: reaching the middle node", out: "500 hops, not 1 step" } },
    { type: "trap", wrong: "Deleting a node of a singly linked list, given a pointer to it, takes O(1).", tempting: "It looks like one pointer change.", whyWrong: "The change is on the node BEFORE it (prev->next = q->next), and nothing points backwards. You must walk from the head to find prev, Θ(n). Only the first node is O(1). A doubly list keeps prev, so it is O(1).", rule: "Delete needs the previous node: singly Θ(n), doubly Θ(1).", ex: { code: "list 1 2 3 4 5 6, delete 6 (given a pointer to it)", out: "4 hops from node 1 to node 5" } },
    { type: "trap", wrong: "head = new_node; new_node->next = head; inserts at the front.", tempting: "Both lines appear, just in the other order.", whyWrong: "After head = new_node, head already points at the new node, so new_node->next = head makes the node point at itself, and the old list is lost. Point the new node at the old head first.", rule: "Link the new node forward first, then move head.", ex: { code: "wrong order: head -> new, new -> new (cycle), 10 20 lost", out: "the old list is unreachable" } },
    { type: "trap", wrong: "if (head == NULL) return 1; return 1 + getListSize(head->next); counts the nodes.", tempting: "A list ends at NULL, so NULL looks like the natural place to stop.", whyWrong: "Stopping at NULL and returning 1 counts the empty list past the end as one more node, so a 3-node list gives 4. The base case that returns 1 must be the last node (head->next == NULL); a base case at NULL must return 0. Also check the recursive call is on a smaller list: 1 + getListSize(head) would never end.", rule: "Return 1 at the last node, or 0 at NULL; and always recurse on head->next.", ex: { code: "3 nodes, base head == NULL returns 1:\n1 + (1 + (1 + 1))", out: "4 (one too many)" } },

    { type: "gate", text: "GATE 2026 Q39 (recursion on a list), 2025 Q62 (removing nodes found in another list), 2023 Q13 (delete cost, singly versus doubly), 2022 Q15 (reverse in O(1) space) and 2017 Q35 are the linked-list questions tagged to this chapter." },
    { type: "recall", cards: [
      { q: "What does a node of a singly linked list hold?", a: "The data and a pointer to the next node (NULL at the end)." },
      { q: "Cost of reaching the k-th node?", a: "k steps: Θ(n) in the worst case. There is no random access." },
      { q: "Cost of insert at the head?", a: "Θ(1): new->next = head; head = new." },
      { q: "Cost of insert at the tail of a singly list?", a: "Θ(n), or Θ(1) with a tail pointer." },
      { q: "Cost of deleting a given node in a singly list?", a: "Θ(n): you must find the previous node." },
      { q: "Cost of deleting a given node in a doubly list?", a: "Θ(1): the previous node is node->prev." },
      { q: "How do you reverse a list in place?", a: "Three pointers prev, cur, next: Θ(n) time, O(1) space." },
      { q: "Can binary search work on a sorted linked list?", a: "No gain: no jump to the middle." },
      { q: "The recursive size of a list?", a: "1 + size of the rest; base case: the last node (head->next == NULL)." },
      { q: "What is a circular list?", a: "The last node points back to the first; loops stop on returning to the start." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "A singly linked list has 10 nodes. In the worst case how many nodes are visited by a search?", answer: "10", solution: "The key is last or absent: every node is visited." },
      { id: "h2", kind: "MCQ", marks: 1, q: "Which operation on a singly linked list is Θ(1)?", options: ["Insert at the head", "Search", "Delete a given last node", "Access the k-th node"], answer: "A", solution: "Insert at the head changes two pointers only." },
      { id: "h3", kind: "MCQ", marks: 1, q: "Reversing a singly linked list of n nodes in place takes", options: ["Θ(1)", "Θ(log n)", "Θ(n)", "Θ(n²)"], answer: "C", solution: "One pass, each arrow turned once." },
      { id: "h4", kind: "MSQ", marks: 2, q: "Which are true?", options: ["Deleting a given node in a doubly list is O(1)", "Insert after a given node in a singly list is O(1)", "A sorted singly list supports binary search in O(log n)", "A circular list has no NULL next pointer"], answer: "A, B, D", solution: "C is false: no random access." },
      { id: "h5", kind: "NAT", marks: 2, q: "struct node {int d; struct node *next;}; A list holds 1 → 2 → 3 → 4 → 5. A function sets cur = head, then three times does cur = cur->next. What is cur->d?", answer: "4", solution: "After three hops cur is on the 4th node, whose data is 4." },
      { id: "h6", kind: "NAT", marks: 2, q: "A list is 1 → 2 → 3 → 4. The code p = head; while (p->next->next != NULL) p = p->next; p->next = NULL; runs. How many nodes remain?", answer: "3", solution: "p stops at the node before the last (3); its next becomes NULL, dropping 4." },
      { id: "h7", kind: "MCQ", marks: 2, q: "Which pair of statements inserts the node n at the head correctly?", options: ["head = n; n->next = head;", "n->next = head; head = n;", "n->next = NULL; head = n;", "head->next = n; head = n;"], answer: "B", solution: "Link forward first, then move head." },
      { id: "h8", kind: "NAT", marks: 2, q: "How many pointer fields are there in total in a doubly linked list of 25 nodes (next and prev in every node)?", answer: "50", solution: "Two per node." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on linked lists", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "next: stacks", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Arrays (D2)", "Pointers I (C10)", "Dynamic memory (C15)", "Structures (C14)"], usedIn: ["Stacks and queues (D4, D5)", "Trees (D7)", "Hash chaining", "Graph adjacency lists"], cross: ["Operating systems: free lists and process queues"] },
  ],
};
