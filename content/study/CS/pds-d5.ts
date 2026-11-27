import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D5 "Queues: first in, first out" (28 Nov 2026). Real GATE questions (texts from public/data/questions.json):
 * 2023 FN Q59 (stack and queue operations, top = 8 when "repeat VII three times" means three more), 2018 FN Q13 (queue on a singly list with
 * head and tail pointers, key B). Programs compiled and run with gcc: circular queue "2 3 4 5 front=1"; queue from two stacks "1 2 3 4"; GATE 2023 trace 8.
 */
export const chapterD5: Topic = {
  id: "cs.pds.ds.queues5",
  title: "Queues: first in, first out",
  no: "D5",
  book: [
    { t: "p", text: "A queue is what you stand in at a ticket counter: people join at the back and are served from the front, so the one who has waited longest goes first. This rule is **FIFO**, first in, first out. Where a stack reverses, a queue keeps order." },
    { t: "p", text: "Queues appear wherever work must be done in arrival order: printer jobs, processes waiting for the CPU, network packets, and the level-by-level visit of a tree or a graph. This chapter builds the queue on an array (with the clever wrap-around that makes it efficient) and on a linked list, then shows queues and stacks built from each other." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["state the queue operations and their costs;", "implement a circular queue and tell full from empty;", "choose which end of a linked list to enqueue and dequeue to keep both Θ(1);", "build a queue from two stacks and say what it costs;", "trace mixed stack and queue operations without slips."] },

    { t: "h2", text: "The queue and its operations" },
    { t: "p", text: "A queue has two ends. **Enqueue(x)** adds x at the **rear** (back). **Dequeue()** removes and returns the item at the **front**. Usually there are also **Peek** (read the front) and **IsEmpty**. As with the stack, dequeuing from an empty queue is underflow and enqueuing on a full fixed-size queue is overflow." },
    { t: "callout", kind: "key", text: "Queue: add at the rear, remove from the front. FIFO. A good implementation makes both Θ(1)." },
    { t: "p", text: "The obvious array implementation keeps two indices, `front` and `rear`, and moves `rear` up on enqueue and `front` up on dequeue. It has a flaw: both indices only ever move **forward**, so after enough operations `rear` reaches the end of the array even though there is free space at the start, where items have left. We can shift everything left, but that costs Θ(n). The better answer is to let the indices **wrap around**." },

    { t: "h2", text: "The circular queue" },
    { t: "p", text: "Imagine the array bent into a ring. When `rear` passes the last box it returns to box 0, provided that box is free. The arithmetic is **modulo** the capacity: the next index after i is `(i + 1) % N`. A third variable `count` (or a deliberately empty box) tells the full queue from the empty one." },
    { t: "fig", id: "d5-f1" },
    { t: "p", text: "The problem a ring creates is that `front == rear` can mean **empty** or **full**. There are two standard cures. Keep a separate **count**: empty when count is 0, full when count is N. Or keep **one box always unused**: empty when `front == rear`, full when `(rear + 1) % N == front`, so a queue of capacity N holds at most N − 1 items." },
    { t: "code", text: `#include <stdio.h>

#define N 4
int q[N], front = 0, count = 0;

void enqueue(int x) { q[(front + count) % N] = x; count++; }   /* rear = front + count, wrapped */
int  dequeue(void)  { int x = q[front]; front = (front + 1) % N; count--; return x; }

int main(void) {
    enqueue(1); enqueue(2); enqueue(3);
    dequeue();                          /* removes 1 */
    enqueue(4); enqueue(5);             /* 5 wraps to box 0 */
    for (int i = 0; i < count; i++) printf("%d ", q[(front + i) % N]);
    printf("front=%d\\n", front);
    return 0;
}`, out: "2 3 4 5 front=1", file: "circular_queue.c" },
    { t: "p", text: "After 1, 2, 3 go in and 1 leaves, `front` is 1. The next item, 4, goes to box (1 + 2) % 4 = 3, and 5 to box (1 + 3) % 4 = 0: it wrapped round to the start. The queue now holds 2, 3, 4, 5 and is full (count = N)." },
    { t: "ex", id: "d5-e1" },
    { t: "trap", i: 0 },

    { t: "h2", text: "A queue on a linked list" },
    { t: "p", text: "On a linked list a queue needs no wrap-around trick, but you must choose the ends carefully. A singly linked node knows only its **next** node. Insertion is cheap at either end if you hold a `tail` pointer (insert after the tail), and deletion is cheap **only at the head** (`head = head->next`). Deleting the **tail** needs its predecessor, which costs Θ(n)." },
    { t: "p", text: "So the efficient arrangement is: **enqueue at the tail, dequeue at the head**, both Θ(1) with a `head` and a `tail` pointer. The reverse arrangement (enqueue at the head, dequeue at the tail) makes enqueue Θ(1) but dequeue Θ(n), exactly the trap in GATE 2018 (example 3)." },
    { t: "p", text: "There is one edge case that causes real bugs. When the queue has a single node, dequeue makes `head` become `NULL`, and `tail` must be set to `NULL` as well, otherwise it still points at a node that has been freed. In the same way, enqueue on an empty queue must set **both** `head` and `tail` to the new node, because the new node is at once the front and the rear." },
    { t: "p", text: "Compared with the circular array, the linked queue never fills up (until memory does) and never wastes a box, but every item pays for an extra pointer and a separate allocation. The array is faster in practice and uses less memory when the maximum size is known; the list is better when it is not." },
    { t: "fig", id: "d5-f2" },
    { t: "ex", id: "d5-e2" },
    { t: "ex", id: "d5-e3" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Queues from stacks, and stacks from queues" },
    { t: "p", text: "A famous exercise: build a queue from two stacks, `inbox` and `outbox`. **Enqueue** pushes onto `inbox`. **Dequeue** pops from `outbox`; if `outbox` is empty, first pour every item from `inbox` into `outbox` (popping from one and pushing onto the other), which **reverses** the order, so the oldest item is now on top. Two reversals restore the original order, which is why the queue works." },
    { t: "code", text: `#include <stdio.h>

int inbox[16], nin = 0, outbox[16], nout = 0;

void enqueue(int x) { inbox[nin++] = x; }
int dequeue(void) {
    if (nout == 0) while (nin > 0) outbox[nout++] = inbox[--nin];   /* pour: reverses the order */
    return outbox[--nout];
}

int main(void) {
    enqueue(1); enqueue(2); enqueue(3);
    printf("%d ", dequeue());
    enqueue(4);
    printf("%d ", dequeue());
    printf("%d ", dequeue());
    printf("%d ", dequeue());
    return 0;
}`, out: "1 2 3 4 ", file: "queue_from_stacks.c" },
    { t: "p", text: "A single dequeue can cost n (the pour), but each item is poured only once in its life, so over n operations the total is O(n): **amortised Θ(1)** per operation, the same idea as the doubling array of chapter D1. A stack can likewise be built from two queues, but there one of the two operations must cost Θ(n) every time." },
    { t: "p", text: "Two relatives of the queue are worth knowing. A **deque** (double-ended queue) allows insert and delete at both ends, and generalises both the stack and the queue. A **priority queue** serves the item with the highest priority first rather than the oldest; the usual implementation is a heap (chapter D10)." },
    { t: "trap", i: 2 },

    { t: "h2", text: "Tracing stack and queue operations together" },
    { t: "p", text: "GATE likes to give a list of numbered operations on a stack and a queue at once. The method is mechanical: keep two small drawings, the stack with its top on the right and the queue with its front on the left, and redraw after every line. Never carry the state in your head." },
    { t: "p", text: "Two reading habits save marks. First, translate each instruction into plain words before you act on it: 'dequeue and push the same element into S' means take the front of Q away and put that very value on top of S. Second, watch the phrase **repeat k times**: in GATE 2023 'repeat VII three times' means three **more** executions after the first, four in all, and the answer depends on it." },
    { t: "p", text: "The program below replays the 2023 question exactly. Indices stand in for the structures: `top` is the stack's top, `f` and `r` are the queue's front and rear." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int a[6] = {1, 5, 7, 8, 9, 2};
    int s[16], top = -1, q[16], f = 0, r = 0;
    for (int i = 0; i < 6; i++) s[++top] = a[i];        /* I   : push all */
    for (int i = 0; i < 6; i++) q[r++] = a[i];          /* II  : enqueue all */
    top--;                                              /* III : pop */
    f++;                                                /* IV  : dequeue */
    top--;                                              /* V   : pop */
    f++;                                                /* VI  : dequeue */
    for (int k = 0; k < 4; k++) s[++top] = q[f++];      /* VII, then VIII three more times */
    top--; top--;                                       /* IX and X : pop twice */
    printf("%d\\n", s[top]);
    return 0;
}`, out: "8", file: "gate2023_trace.c" },
    { t: "ex", id: "d5-e4" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Queue questions come in three forms: **cost** questions about an implementation (example 3), **tracing** mixed stack and queue operations (example 4), and questions on **circular queues**: the full and empty conditions or the number of items from `front` and `rear` (example 1). Questions on breadth-first search and on process scheduling use the queue indirectly, in later chapters." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you keep FIFO and LIFO apart and update the drawing after every operation. For circular queues, whether you use the modulo correctly and know which convention (count, or one empty box) the question assumes." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Treating the front of the queue as the top of a stack.", "Reading 'repeat three times' as three in total instead of three more.", "Forgetting that a ring with one box kept empty holds only N − 1 items.", "Putting dequeue at the tail of a singly linked list and calling it Θ(1).", "Forgetting the modulo when an index passes the end."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A queue is FIFO: enqueue at the rear, dequeue from the front, both Θ(1).", "A circular array reuses freed boxes: next index (i + 1) % N.", "Full and empty both look like front == rear; use a count or leave one box empty (then capacity is N − 1).", "On a singly linked list: enqueue at the tail, dequeue at the head. The opposite makes dequeue Θ(n).", "A queue from two stacks is amortised Θ(1) per operation.", "Trace mixed operations by redrawing both structures after each step."] },
  ],
  blocks: [
    { type: "figure", id: "d5-f1", caption: "A circular queue with N = 6 boxes. A, B were enqueued at the far end and D at the start: the queue wraps round. front is at A; rear is the next free box.", alt: "A ring of six boxes holding D, empty, empty, empty, A, B with front pointing at A and rear at the box after D.", fig: { kind: "ring", n: 6, items: ["D", null, null, null, "A", "B"], front: 4, rear: 0 } },
    { type: "figure", id: "d5-f2", caption: "A queue on a singly linked list. head is the front, tail the rear. Enqueue links after tail; dequeue moves head along. Both touch one end only.", alt: "Four nodes 10, 20, 30, 40 with head at 10 and tail at 40.", fig: { kind: "linked", title: "dequeue here (head) … enqueue here (tail)", nodes: [{ id: "a", data: 10, next: "b" }, { id: "b", data: 20, next: "c" }, { id: "c", data: 30, next: "d" }, { id: "d", data: 40, next: null }], heads: [{ name: "head", to: "a" }, { name: "tail", to: "d" }] } },

    { type: "example", id: "d5-e1", level: "gate", title: "Circular queue: how many items?", file: "circular_count.txt", given: `A circular queue of capacity N = 8 uses one box kept empty. front = 6 and rear = 2 (rear is the next free box).`, find: "The number of items, and the largest number the queue can hold.", steps: [
      { say: "Items run from box 6 up to box 1, wrapping: boxes 6, 7, 0, 1.", result: "4 items" },
      { say: "As a formula: (rear − front + N) % N = (2 − 6 + 8) % 8.", result: "4" },
      { say: "With one box kept empty the most it can hold is N − 1.", result: "7" },
    ], answer: "4 items now; at most 7", check: "When (rear + 1) % N == front, the queue is full." },
    { type: "example", id: "d5-e2", level: "easy", title: "Dequeue from a linked queue: which end?", file: "linked_queue.txt", given: `A queue on a singly linked list with head and tail pointers, n nodes.
Option X: enqueue at the tail, dequeue at the head.
Option Y: enqueue at the head, dequeue at the tail.`, find: "The cost of enqueue and dequeue in each.", steps: [
      { say: "X: insert after tail is two pointer changes; delete at the head is head = head->next.", result: "Θ(1), Θ(1)" },
      { say: "Y: insert at the head is Θ(1). Deleting the tail needs the node before it, found by walking from the head.", result: "Θ(1), Θ(n)" },
    ], answer: "X is Θ(1) and Θ(1); Y is Θ(1) and Θ(n)", check: "A doubly linked list would make Y's dequeue Θ(1) too." },
    { type: "example", id: "d5-e3", level: "gate", title: "GATE CS 2018 (forenoon), Q13 · 1 mark · MCQ: the time of enqueue and dequeue", file: "gate2018_q13.txt", given: `A queue is implemented with a non-circular singly linked list with a head pointer and a tail pointer. n nodes.
enqueue inserts a new node at the head; dequeue deletes a node from the tail.
Time of the most time-efficient implementation of enqueue and dequeue?
(A) Θ(1), Θ(1)  (B) Θ(1), Θ(n)  (C) Θ(n), Θ(1)  (D) Θ(n), Θ(n)`, find: "The correct option.", steps: [
      { say: "Enqueue inserts at the head: new->next = head; head = new. Two pointer changes.", result: "Θ(1)" },
      { say: "Dequeue deletes the tail. The tail pointer finds the last node, but the node before it is needed to set its next to NULL, and a singly list has no backward link. The walk from the head is n − 2 steps.", result: "Θ(n)" },
    ], answer: "B: Θ(1) and Θ(n)", check: "The tail pointer helps enqueue at the tail, not delete from it." },
    { type: "example", id: "d5-e4", level: "gate", title: "GATE CS 2023 (forenoon), Q59 · 2 marks · NAT: stack and queue operations", file: "gate2023_q59.txt", given: `a = 1, 5, 7, 8, 9, 2. A stack S and a queue Q, both empty.
I: push a0..a5 into S.       II: enqueue a0..a5 into Q.
III: pop S.   IV: dequeue Q.   V: pop S.   VI: dequeue Q.
VII: dequeue Q and push the same element into S.
VIII: repeat VII three times (three more times).
IX: pop S.   X: pop S.`, find: "The top element of S afterwards.", steps: [
      { say: "After I and II: S (bottom to top) 1 5 7 8 9 2; Q (front to rear) 1 5 7 8 9 2.", result: "S = 1 5 7 8 9 2" },
      { say: "III pops 2. IV dequeues 1. V pops 9. VI dequeues 5.", result: "S = 1 5 7 8; Q = 7 8 9 2" },
      { say: "VII moves 7 from Q to S. VIII repeats it three more times: 8, 9, 2.", result: "S = 1 5 7 8 7 8 9 2; Q empty" },
      { say: "IX pops 2. X pops 9.", result: "S = 1 5 7 8 7 8" },
    ], answer: "8", check: "The program in this chapter reproduces the trace and prints 8." },

    { type: "trap", wrong: "In a circular queue, front == rear always means the queue is empty.", tempting: "When nothing is stored, both indices coincide.", whyWrong: "After N enqueues with no dequeue, rear wraps around and is again equal to front, but now the queue is full. The two states look the same unless you add a count, or keep one box empty so that full is (rear + 1) % N == front.", rule: "Use a count, or leave one box unused.", ex: { code: "N = 4: enqueue 4 items from front = 0", out: "rear = 0 = front, but the queue is full" } },
    { type: "trap", wrong: "A singly linked queue can dequeue at the tail in Θ(1) because it has a tail pointer.", tempting: "A tail pointer reaches the last node at once.", whyWrong: "Deleting the last node means setting the second-to-last node's next to NULL, and a singly linked node cannot go backwards. Finding the second-to-last node walks the whole list: Θ(n).", rule: "Singly list: delete at the head, insert at the tail.", ex: { code: "list 1 2 3 4: reaching node 3 from the head", out: "2 hops; Θ(n) in general" } },
    { type: "trap", wrong: "A queue made from two stacks costs Θ(n) for every dequeue.", tempting: "The pour moves all n items.", whyWrong: "The pour happens only when the outbox stack is empty, and each item is poured exactly once. A sequence of n operations moves at most n items in total, so the amortised cost is Θ(1) per operation, although one dequeue may cost n.", rule: "Amortised: total work of the sequence divided by its length.", ex: { code: "enqueue 1000 items, then dequeue 1000 times", out: "1000 pours in total, not 1000 × 1000" } },

    { type: "gate", text: "GATE 2023 FN Q59 (stack and queue trace) and 2018 FN Q13 (queue on a singly linked list) are tagged to this chapter. 2022 FN Q62 (reverse a queue using another) depends on a figure; the method is the same pouring idea." },
    { type: "recall", cards: [
      { q: "What is FIFO?", a: "First in, first out: the oldest item is served first." },
      { q: "Where do you add and remove in a queue?", a: "Add at the rear, remove from the front." },
      { q: "Next index in a circular array of size N?", a: "(i + 1) % N." },
      { q: "How can a circular queue tell full from empty?", a: "A count, or one box kept empty (then full is (rear + 1) % N == front)." },
      { q: "Capacity of a ring that keeps one box empty?", a: "N − 1 items." },
      { q: "Best ends for a singly linked queue?", a: "Enqueue at the tail, dequeue at the head." },
      { q: "Cost of dequeue at the tail of a singly list?", a: "Θ(n): the previous node must be found." },
      { q: "How to build a queue from two stacks?", a: "Push on one; pour into the other when popping: amortised Θ(1)." },
      { q: "What is a deque?", a: "A double-ended queue: insert and delete at both ends." },
      { q: "What is a priority queue?", a: "Serves the highest-priority item first; usually a heap." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "A circular queue has N = 10 boxes, count-free, one box kept empty. What is the largest number of items it can hold?", answer: "9", solution: "N − 1." },
      { id: "h2", kind: "MCQ", marks: 1, q: "Which gives Θ(1) enqueue and dequeue on a singly linked list with head and tail pointers?", options: ["Enqueue at head, dequeue at tail", "Enqueue at tail, dequeue at head", "Enqueue at tail, dequeue at tail", "Neither"], answer: "B", solution: "Only the head can be deleted in constant time." },
      { id: "h3", kind: "NAT", marks: 1, q: "Enqueue 1, 2, 3, 4, then dequeue twice. What is at the front?", answer: "3", solution: "1 and 2 leave; 3 is the oldest left." },
      { id: "h4", kind: "MCQ", marks: 1, q: "Which structure serves the item that arrived earliest?", options: ["Stack", "Queue", "Binary search tree", "Max-heap"], answer: "B", solution: "FIFO." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["A queue can be built from two stacks", "In a circular queue with one empty box, full means (rear + 1) % N == front", "Dequeue at the tail of a singly list is Θ(1)", "A priority queue always serves the oldest item"], answer: "A, B", solution: "C and D are false." },
      { id: "h6", kind: "NAT", marks: 2, q: "Circular queue, N = 8, front = 5, rear = 1 (next free box), no empty box rule needed, count unknown but the queue is not full. How many items does it hold?", answer: "4", solution: "(1 − 5 + 8) % 8 = 4: boxes 5, 6, 7, 0." },
      { id: "h7", kind: "NAT", marks: 2, q: "Queue Q holds 3, 6, 9 (3 at front). S is empty. Dequeue from Q and push on S, repeatedly, until Q is empty. Then pop S once. What is returned?", answer: "9", solution: "S ends 3, 6, 9 with 9 on top; pop returns 9." },
      { id: "h8", kind: "NAT", marks: 2, q: "A queue is made from two stacks (inbox, outbox). Enqueue 1, 2, 3, dequeue, enqueue 4, dequeue. How many items are poured from inbox to outbox in total?", answer: "3", solution: "The first dequeue pours 1, 2, 3 (three moves). The second dequeue finds outbox non-empty (it has 2, 3): no pour." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on stacks and queues", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "next: trees", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Stacks (D4)", "Linked lists (D3)", "Arrays (D2)"], usedIn: ["Breadth-first search (graphs)", "Level-order traversal (trees)", "Priority queues and heaps (D10)", "Operating systems: scheduling queues"], cross: ["Operating systems: ready queue"] },
  ],
};
