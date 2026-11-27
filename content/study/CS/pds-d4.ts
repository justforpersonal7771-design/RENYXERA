import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D4 "Stacks: last in, first out" (28 Nov 2026). Real GATE questions (texts from public/data/questions.json):
 * 2026 AN Q50 (stack and queue assignment, keys A and B), 2025 AN Q45 (stack with an O(1) MIN, key A). Programs compiled and run with gcc:
 * array stack pops 3 2 1; postfix "234*+" = 14 and "82/3-" = 1; bracket checker 1 0 0; 14 valid output orders for 4 pushed items (Catalan).
 */
export const chapterD4: Topic = {
  id: "cs.pds.ds.stacks4",
  title: "Stacks: last in, first out",
  no: "D4",
  book: [
    { t: "p", text: "A stack of plates has one rule: you add a plate on top and you take a plate from the top. The last plate put on is the first one taken off. A **stack** in computing is exactly that: a collection where insertion and removal happen at one end only. The rule is called **LIFO**, last in, first out." },
    { t: "p", text: "The stack is the first example of an **abstract data type**, a promise about what operations exist and how they behave, with the layout left open (chapter D0). It matters far beyond its size: every function call, every undo button, every bracket checker and every expression evaluator is a stack at work." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["state the stack operations and implement them on an array and on a linked list;", "check brackets and evaluate postfix expressions with a stack;", "convert infix to postfix by hand;", "decide which output orders a stack can produce, and count them;", "design a stack that also returns its minimum in O(1)."] },

    { t: "h2", text: "The stack and its operations" },
    { t: "p", text: "A stack has two main operations. **Push(x)** puts x on the top. **Pop()** removes the top item and returns it. Two small helpers are usually added: **Peek** (or top) reads the top item without removing it, and **IsEmpty** tests whether anything is stored. Popping an empty stack is an error called **underflow**; pushing onto a full fixed-size stack is **overflow**." },
    { t: "fig", id: "d4-f1" },
    { t: "p", text: "All four operations touch only the top, so each costs **Θ(1)**. This is the whole point of the structure: nothing ever has to move, and there is no searching. The price is that you can reach only the top; the item beneath is out of reach until you pop the one above it." },
    { t: "callout", kind: "key", text: "Stack: push and pop at the same end. LIFO. Every operation is Θ(1)." },

    { t: "h2", text: "Stack in an array" },
    { t: "p", text: "The simplest implementation is an array and one integer, `top`, the index of the most recent item (−1 when empty). Push increments `top` and writes there; pop reads there and decrements. Check for overflow before pushing and for underflow before popping." },
    { t: "code", text: `#include <stdio.h>

#define CAP 8
int st[CAP], top = -1;

void push(int x) { if (top == CAP - 1) return; st[++top] = x; }   /* overflow check */
int  pop(void)   { return st[top--]; }                             /* caller checks empty */

int main(void) {
    push(1); push(2); push(3);
    while (top != -1) printf("%d ", pop());
    return 0;
}`, out: "3 2 1 ", file: "array_stack.c" },
    { t: "p", text: "Items 1, 2, 3 went in, and 3, 2, 1 came out: the order reverses. That reversal is the heart of every stack algorithm. A stack in a **linked list** is just as easy: push is insert at the head, pop is delete at the head, and both are Θ(1) (chapter D3), with no fixed capacity." },
    { t: "trap", i: 0 },

    { t: "h2", text: "Matching brackets" },
    { t: "p", text: "A bracket expression is balanced if every closer matches the most recent unmatched opener. 'Most recent unmatched' is exactly what a stack gives. Scan left to right: push every opener; at a closer, pop and check that the popped opener is its partner. At the end the stack must be empty." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int balanced(const char *s) {
    char st[64]; int top = -1;
    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') st[++top] = c;
        else {
            if (top < 0) return 0;                    /* closer with no opener */
            char o = st[top--];
            if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) return 0;
        }
    }
    return top == -1;                                 /* nothing left open */
}

int main(void) {
    printf("%d %d %d\\n", balanced("{[()]}"), balanced("([)]"), balanced("(("));
    return 0;
}`, out: "1 0 0", file: "balanced.c" },
    { t: "p", text: "`{[()]}` is balanced. `([)]` fails: at `)` the top is `[`, not `(`. `((` fails at the end: two openers are still on the stack. The same idea checks begin and end blocks, HTML tags, and the nesting of function calls." },
    { t: "ex", id: "d4-e1" },

    { t: "h2", text: "Postfix expressions" },
    { t: "p", text: "We normally write operators **between** their operands: a + b. This is **infix**, and it needs brackets and precedence rules to be unambiguous. In **postfix** (reverse Polish) the operator comes **after** its operands: a b +. Postfix needs neither brackets nor precedence; the order of the symbols says everything. In **prefix** the operator comes before: + a b." },
    { t: "p", text: "A postfix expression is evaluated with one stack and one rule. Scan left to right. If the symbol is an operand, push it. If it is an operator, pop **two** operands, apply the operator, and push the result. At the end the one item left is the answer." },
    { t: "fig", id: "d4-f2" },
    { t: "p", text: "Careful with the **order** of the two popped values. The first pop gives the **right** operand and the second pop the **left**: for `8 2 /` pop 2 first, then 8, and compute 8 / 2, not 2 / 8. For + and × the order does not matter; for − and / it does." },
    { t: "code", text: `#include <stdio.h>

int eval(const char *e) {
    int st[32], top = -1;
    for (int i = 0; e[i]; i++) {
        char c = e[i];
        if (c >= '0' && c <= '9') st[++top] = c - '0';
        else {
            int r = st[top--], l = st[top--];            /* right operand pops first */
            st[++top] = c == '+' ? l + r : c == '-' ? l - r : c == '*' ? l * r : l / r;
        }
    }
    return st[top];
}

int main(void) {
    printf("%d %d\\n", eval("234*+"), eval("82/3-"));
    return 0;
}`, out: "14 1", file: "postfix_eval.c" },
    { t: "p", text: "`2 3 4 * +` pushes 2, 3, 4; `*` pops 4 and 3 and pushes 12; `+` pops 12 and 2 and pushes 14. `8 2 / 3 -` gives 8 / 2 = 4, then 4 − 3 = 1." },
    { t: "ex", id: "d4-e2" },
    { t: "trap", i: 1 },
    { t: "h3", text: "Infix to postfix" },
    { t: "p", text: "To convert by hand, write the operands in their original order and place each operator just after its right operand, respecting precedence (× and / bind tighter than + and −) and left-to-right order for equal precedence. With a stack the rule is: operands go straight to the output; an operator first pops from the stack every operator of **greater or equal** precedence to the output, then is pushed; a `(` is pushed and a `)` pops until the matching `(`; at the end pop everything." },
    { t: "ex", id: "d4-e3" },

    { t: "h2", text: "Which orders can a stack produce?" },
    { t: "p", text: "Push 1, 2, 3 in that order into a stack, and pop whenever you like, between the pushes. Which output orders are possible? Pop after every push gives 1 2 3. Push all three and pop all gives 3 2 1. Push 1, push 2, pop, push 3, pop, pop gives 2 3 1. But **3 1 2** is impossible: to pop 3 first, 1 and 2 must already be below it, with 2 on top of 1; so 2 must come out before 1." },
    { t: "fig", id: "d4-f3" },
    { t: "p", text: "The number of valid orders for n items pushed in a fixed order is the **Catalan number** C(n) = (2n)! / ((n + 1)! n!): 1, 2, 5, 14, 42, … for n = 1, 2, 3, 4, 5. For three items 5 of the 6 permutations are possible. The program counts every valid push-pop sequence for four items and finds 14." },
    { t: "code", text: `#include <stdio.h>

/* Count the ways to push n items and pop them all: at each step push (if items remain) or pop (if the stack is not empty). */
int ways(int pushed, int stack, int n) {
    if (pushed == n && stack == 0) return 1;
    int w = 0;
    if (pushed < n) w += ways(pushed + 1, stack + 1, n);
    if (stack > 0)  w += ways(pushed, stack - 1, n);
    return w;
}

int main(void) {
    printf("%d\\n", ways(0, 0, 4));
    return 0;
}`, out: "14", file: "stack_orders.c" },
    { t: "p", text: "A faster test for one given output is to **simulate**: push inputs in order; whenever the top equals the next wanted output, pop it. If you finish with an empty stack the order is possible. A useful pattern: an order is impossible if it contains a **3 1 2** shape: an item, then a smaller one, then one between them, in that order (the item popped first sat above both)." },
    { t: "ex", id: "d4-e4" },
    { t: "trap", i: 2 },

    { t: "h2", text: "A stack that knows its minimum" },
    { t: "p", text: "Suppose we want a stack with the usual push and pop, plus **Min**, which returns the smallest item present, and every operation must still be Θ(1). Keeping a single pointer to the minimum fails: when the minimum is popped, the new minimum is unknown. The fix is to store, **with every item, the minimum of the stack at that moment**, that is, the minimum of that item and everything below it. Push computes `min(x, minimum of the item below)` in constant time, pop discards it with the item, and Min reads the top's stored value." },
    { t: "fig", id: "d4-f4" },
    { t: "p", text: "Each item costs one extra word, but nothing else changes. Alternatives that keep a sorted array or a heap of the items make push or pop cost Θ(n) or Θ(log n), which breaks the rule that the standard operations must not become slower." },
    { t: "ex", id: "d4-e5" },
    { t: "trap", i: 3 },

    { t: "h2", text: "The stack inside your program" },
    { t: "p", text: "Every running C program has a **call stack**. Calling a function pushes a **frame** holding its parameters, its local variables and the place to return to; returning pops the frame. This is why recursion works, and why recursion deeper than the stack's capacity ends in a **stack overflow** (chapters C6 and C8). A recursive algorithm can always be rewritten with an explicit stack of your own, and tree traversals in the next chapters can be done either way." },
    { t: "ex", id: "d4-e6" },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Stack questions come in four forms: **evaluating or converting** an expression (examples 2 and 3), **tracing** push and pop operations to find the top or a printed sequence, deciding **which orders are possible** (example 4), and **designing** an augmented stack (example 5). Stack and queue operations are often combined in one question; the queue half is in the next chapter." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you can follow LIFO without slips. Draw the stack after every operation with the top at the right, and for postfix keep the order of the two popped operands straight." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Swapping the operands of − or / when evaluating postfix.", "Thinking any permutation of the input can be output by a stack.", "Writing `top++` where `++top` was meant (an off-by-one on the first item).", "Keeping only one pointer to the minimum in a MIN stack.", "Confusing overflow (full) with underflow (empty)."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A stack is LIFO: push and pop at the top, all Θ(1).", "An array stack keeps an index `top` (−1 when empty); a linked stack is insert and delete at the head.", "Brackets: push openers, pop at closers, empty at the end.", "Postfix: push operands; an operator pops two (right operand first) and pushes the result.", "A stack can produce 1/(n+1) · C(2n, n) of the orders of n items, 5 for n = 3, 14 for n = 4.", "To get Min in O(1), store the running minimum with every item."] },
  ],
  blocks: [
    { type: "figure", id: "d4-f1", caption: "A stack holding 10, 20, 30 with 30 on top. push(40) puts 40 above 30; pop() would remove 30 first.", alt: "Four boxes in a column with the top pointer at the box holding 30.", fig: { kind: "array", title: "stack, top pointer at the last item", data: [[10, 20, 30, "·"]], base: 1000, size: 4, index: true, tones: { "0,3": "dim", "0,2": "hl" }, pointers: [{ name: "top", at: [0, 2] }] } },
    { type: "figure", id: "d4-f2", caption: "Evaluating 5 6 2 + * 12 4 / − step by step. The stack is drawn bottom to top.", alt: "A table of the scanned symbol and the stack after each of the nine symbols, ending with 37.", fig: { kind: "matrix", title: "5 6 2 + * 12 4 / −", cols: ["symbol", "stack after"], rows: [{ label: "1", cells: ["5", "5"] }, { label: "2", cells: ["6", "5 6"] }, { label: "3", cells: ["2", "5 6 2"] }, { label: "4", cells: ["+", "5 8"], hl: true }, { label: "5", cells: ["*", "40"], hl: true }, { label: "6", cells: ["12", "40 12"] }, { label: "7", cells: ["4", "40 12 4"] }, { label: "8", cells: ["/", "40 3"], hl: true }, { label: "9", cells: ["−", "37"], hl: true }] } },
    { type: "figure", id: "d4-f3", caption: "Input 1, 2, 3. Five of the six orders are possible; 3 1 2 is not, because 1 would have to leave before 2, which lies above it.", alt: "A table of the six permutations of 1 2 3 with the push and pop sequence for each, and 3 1 2 marked impossible.", fig: { kind: "matrix", title: "Output orders of 1 2 3", cols: ["push / pop sequence", "possible"], rows: [{ label: "1 2 3", cells: ["push 1, pop, push 2, pop, push 3, pop", "yes"] }, { label: "1 3 2", cells: ["push 1, pop, push 2, push 3, pop, pop", "yes"] }, { label: "2 1 3", cells: ["push 1, push 2, pop, pop, push 3, pop", "yes"] }, { label: "2 3 1", cells: ["push 1, push 2, pop, push 3, pop, pop", "yes"] }, { label: "3 2 1", cells: ["push 1, 2, 3, then pop, pop, pop", "yes"] }, { label: "3 1 2", cells: ["3 pops first, then 2 is above 1", "no"], hl: true }] } },
    { type: "figure", id: "d4-f4", caption: "Each item stores the minimum of itself and everything below. Pushing 5, 3, 8, 2 gives mins 5, 3, 3, 2. Min reads the top's value; after popping 2, the top is 8 and Min is 3 again.", alt: "A table of four stack items with their running minimum.", fig: { kind: "matrix", title: "Stack with a running minimum", cols: ["item", "min below and including"], rows: [{ label: "bottom", cells: [5, 5] }, { label: "", cells: [3, 3] }, { label: "", cells: [8, 3] }, { label: "top", cells: [2, 2], hl: true }] } },

    { type: "example", id: "d4-e1", level: "easy", title: "Bracket checking: trace the stack", file: "bracket_trace.txt", given: `Expression: ( [ ] { } )
Scan left to right, pushing openers and popping at closers.`, find: "Is it balanced? What is the greatest depth of the stack?", steps: [
      { say: "( is pushed: stack ( .", result: "depth 1" },
      { say: "[ is pushed: stack ( [ .", result: "depth 2" },
      { say: "] pops [ : matches. { is pushed, then } pops { : matches.", result: "depth 2" },
      { say: ") pops ( : matches. The stack is empty.", result: "balanced" },
    ], answer: "Balanced; greatest depth 2", check: "If the stack were not empty at the end, or a closer met a different opener, the answer would be no." },
    { type: "example", id: "d4-e2", level: "gate", title: "Evaluate a postfix expression", file: "postfix_trace.txt", given: `5 6 2 + * 12 4 / -`, find: "The value.", steps: [
      { say: "Push 5, 6, 2. The + pops 2 and 6 and pushes 8.", result: "stack 5 8" },
      { say: "The * pops 8 and 5 and pushes 40.", result: "stack 40" },
      { say: "Push 12 and 4. The / pops 4 (right operand) then 12 (left): 12 / 4 = 3.", result: "stack 40 3" },
      { say: "The − pops 3 (right) then 40 (left): 40 − 3.", result: "37" },
    ], answer: "37", check: "In infix this is 5 × (6 + 2) − 12 / 4 = 40 − 3." },
    { type: "example", id: "d4-e3", level: "gate", title: "Convert infix to postfix", file: "infix_to_postfix.txt", given: `a + b * c - d`, find: "The postfix form.", steps: [
      { say: "* has higher precedence than + and −, so b * c is grouped first: b c *.", result: "a (b c *) + ..." },
      { say: "Then a + (b c *) becomes a b c * +.", result: "a b c * +" },
      { say: "Then − d is applied to that result, left to right: a b c * + d −.", result: "a b c * + d −" },
    ], answer: "a b c * + d −", check: "Evaluate with a = 2, b = 3, c = 4, d = 1: 2 3 4 * + 1 − = 14 − 1 = 13, and 2 + 12 − 1 = 13." },
    { type: "example", id: "d4-e4", level: "gate", title: "GATE CS 2026 (afternoon), Q50 · 2 marks · MSQ: stack and queue assignment", file: "gate2026_an_q50.txt", given: `A stack S and a queue Q, both initially empty. The elements 1, 2, 3, 4, 5 arrive in order; each is pushed on S or enqueued to Q.
Then S is emptied by popping everything, then Q is emptied by dequeueing everything.
The output is 4 3 1 2 5.
Which assignments are possible?
(A) 1S 2Q 3S 4S 5Q   (B) 1Q 2Q 3S 4S 5Q   (C) 1Q 2Q 3Q 4S 5S   (D) 1S 2S 3S 4Q 5Q`, find: "The valid assignments.", steps: [
      { say: "The output is the popped stack items (newest first) followed by the queue items (oldest first). Test each option.", result: "pops, then dequeues" },
      { say: "A: S has 1, 3, 4 and pops 4 3 1. Q has 2, 5 and gives 2 5. Output 4 3 1 2 5.", result: "valid" },
      { say: "B: S has 3, 4 and pops 4 3. Q has 1, 2, 5 and gives 1 2 5. Output 4 3 1 2 5.", result: "valid" },
      { say: "C: S has 4, 5 and pops 5 4: the output would begin with 5. D: S has 1, 2, 3 and pops 3 2 1: it would begin with 3.", result: "both invalid" },
    ], answer: "A and B", check: "Both valid options produce 4 3 1 2 5; the stack part is always a reversed run, the queue part is in arrival order." },
    { type: "example", id: "d4-e5", level: "gate", title: "GATE CS 2025 (afternoon), Q45 · 2 marks · MSQ: a stack with an O(1) MIN", file: "gate2025_an_q45.txt", given: `A stack of records with distinct positive keys. Add an O(1) MIN that returns the record with the smallest key, without deleting it, and without making PUSH or POP slower.
(A) keep with every record a pointer to the smallest-key record below it
(B) keep one pointer to the smallest-key record in the stack
(C) keep a sorted auxiliary array of the keys
(D) keep a min-heap of the keys`, find: "The approaches that work.", steps: [
      { say: "A: the pointer is set on push in O(1) from the record below, and disappears on pop. MIN reads the top's pointer.", result: "works" },
      { say: "B: when the minimum is popped, the next minimum is not known without scanning: pop would become Θ(n) or MIN would fail.", result: "fails" },
      { say: "C: inserting into a sorted array shifts items: push becomes Θ(n).", result: "fails" },
      { say: "D: a heap makes push and pop O(log n), slower than O(1).", result: "fails" },
    ], answer: "A only", check: "Only A keeps push, pop and min all at Θ(1)." },
    { type: "example", id: "d4-e6", level: "edge", title: "Greatest stack depth for an expression", file: "stack_depth.txt", given: `((a+b)*(c+(d)))`, find: "The most openers that are on the stack at once.", steps: [
      { say: "Scan: ( 1, ( 2, ) 1, ( 2, ( 3, ) 2, ) 1, ) 0.", result: "depths 1 2 1 2 3 2 1 0" },
      { say: "The largest value reached is the greatest depth.", result: "3" },
    ], answer: "3", check: "The stack needs a capacity of at least 3 to check this expression." },

    { type: "trap", wrong: "Pushing is st[top++] = x with top starting at -1.", tempting: "Post-increment looks like the usual way to append.", whyWrong: "With top = -1, st[top++] writes to st[-1] (before the array) and leaves top at 0 with nothing stored at 0. The pre-increment st[++top] = x first moves top to 0 and then writes. Whether you use pre or post depends on what top means.", rule: "If top is the index of the last item (empty = −1): push is st[++top] = x; pop is st[top--].", ex: { code: "top = -1; st[++top] = 7;  -> top = 0, st[0] = 7", out: "top = 0" } },
    { type: "trap", wrong: "For the postfix expression 8 2 /, pop 2 then 8 and compute 2 / 8.", tempting: "The first popped value feels like the first operand.", whyWrong: "The stack hands back the most recent item first, which is the RIGHT operand. The first pop is the right operand and the second pop the left: 8 / 2 = 4. For + and × the order does not matter, so the slip only shows with − and /.", rule: "Pop right operand first, then left; compute left op right.", ex: { code: "8 2 /   : pop 2 (right), pop 8 (left)\n8 2 / 3 -  ->  4 - 3", out: "1 (not −2.75)" } },
    { type: "trap", wrong: "A stack can output the items 1 2 3 in any order.", tempting: "You can choose when to pop, so the order seems free.", whyWrong: "Only the top can leave. To output 3 first with input 1, 2, 3, both 1 and 2 must already be inside, with 2 above 1, so 2 must leave before 1: 3 1 2 is impossible. Only 5 of the 6 orders work (the Catalan number for n = 3).", rule: "Simulate: push in order, pop whenever the top equals the next wanted output.", ex: { code: "want 3 1 2: push 1, push 2, push 3, pop 3; top is 2, want 1", out: "stuck: impossible" } },
    { type: "trap", wrong: "Keeping a single pointer to the smallest item gives MIN in O(1).", tempting: "The pointer is always correct while the minimum stays.", whyWrong: "When the minimum is popped, the new minimum is somewhere below and the single pointer no longer knows where. Finding it costs Θ(n). The running minimum stored with each item answers instantly because every item remembers the minimum beneath it.", rule: "Store min-so-far with every item.", ex: { code: "stack 5 3 8 2: pop 2, then pop 8, then pop 3 (the min)", out: "new min is 5: not known to one pointer" } },

    { type: "gate", text: "GATE 2026 AN Q50 (stack and queue assignment) and 2025 AN Q45 (stack with an O(1) MIN) are tagged to this chapter. Postfix evaluation, infix to postfix and stack-order questions appeared in earlier papers of the syllabus and are covered by the same ideas." },
    { type: "recall", cards: [
      { q: "What is LIFO?", a: "Last in, first out: the most recently pushed item is the first popped." },
      { q: "Cost of push, pop and peek?", a: "Θ(1) each." },
      { q: "What is stack underflow? Overflow?", a: "Underflow: pop on an empty stack. Overflow: push on a full one." },
      { q: "How do you check brackets with a stack?", a: "Push openers; at a closer pop and compare; the stack must be empty at the end." },
      { q: "How do you evaluate postfix?", a: "Push operands; an operator pops two, applies, pushes the result." },
      { q: "In postfix evaluation, which operand pops first?", a: "The right operand." },
      { q: "a + b * c in postfix?", a: "a b c * +." },
      { q: "How many output orders can a stack give for 1 2 3?", a: "5 (the Catalan number); 3 1 2 is impossible." },
      { q: "How to get MIN in O(1) on a stack?", a: "Store the minimum so far with every item." },
      { q: "Where is the stack in a running program?", a: "The call stack: one frame per active function call." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "Evaluate the postfix expression 6 2 3 + * 4 - .", answer: "26", solution: "2 + 3 = 5; 6 × 5 = 30; 30 − 4 = 26." },
      { id: "h2", kind: "MCQ", marks: 1, q: "Items 1, 2, 3, 4 are pushed in order, with pops allowed between pushes. Which output is impossible?", options: ["1 2 3 4", "4 3 2 1", "2 1 4 3", "4 2 3 1"], answer: "D", solution: "To output 4 first, 1, 2, 3 are stacked with 3 on top, so 3 leaves before 2." },
      { id: "h3", kind: "MCQ", marks: 1, q: "The postfix form of (a + b) * (c - d) is", options: ["a b + c d - *", "a b c d + - *", "a + b c - d *", "* + a b - c d"], answer: "A", solution: "Postfix places each operator after its two operands: a b + and c d −, then *." },
      { id: "h4", kind: "NAT", marks: 1, q: "How many distinct output orders can a stack produce for 4 items pushed in a fixed order?", answer: "14", solution: "The Catalan number C(4) = 14." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which statements are true of a stack?", options: ["Push and pop are Θ(1) in an array stack with a top index", "A stack can output 3 1 2 from input 1 2 3", "A stack of brackets is empty at the end for a balanced string", "Min can be Θ(1) if every item stores the minimum below it"], answer: "A, C, D", solution: "3 1 2 is impossible." },
      { id: "h6", kind: "NAT", marks: 2, q: "Evaluate the postfix expression 8 3 - 2 4 * + 5 /  (integer division).", answer: "2", solution: "8 − 3 = 5; 2 × 4 = 8; 5 + 8 = 13; 13 / 5 = 2." },
      { id: "h7", kind: "NAT", marks: 2, q: "Push 1, 2, 3, 4, 5; pop twice; push 6, 7; pop once. What is the top item now?", answer: "6", solution: "Pops remove 5 and 4; pushes add 6 and 7; the pop removes 7; the top is 6." },
      { id: "h8", kind: "NAT", marks: 2, q: "The most items on the stack at once while checking the brackets of  ( ( ) ( ( ) ) )  is", answer: "3", solution: "Depths: 1 2 1 2 3 2 1 0, so 3." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on stacks and queues", sub: "Programming and Data Structures", href: "/topics/programming-and-data-structures" }, { label: "The Data Structures book", sub: "next: queues", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Arrays (D2)", "Linked lists (D3)", "Recursion in C (C8)"], usedIn: ["Queues (D5)", "Tree traversals (D7)", "Compiler design: parsing", "Operating systems: the call stack"], cross: ["Compiler design: expression evaluation"] },
  ],
};
