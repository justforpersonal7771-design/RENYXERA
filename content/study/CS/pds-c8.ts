import type { Topic } from "@/lib/study/schema";

/**
 * Chapter 8 "Recursion in C" (28 Nov 2026). Twelve real GATE questions, all explained: 2026_FN_Q61, 2026_AN_Q61, 2024_FN_Q27, 2023_FN_Q36, 2021_FN_Q62,
 * 2021_AN_Q47, 2021_AN_Q48, 2020_FN_Q48, 2019_FN_Q40, 2018_FN_Q31, 2017_FN_Q64, 2017_FN_Q57. Many of them are function fragments without a main; their
 * answers were checked by running each function inside a small test program (not by chapter-check). The options of 2023_FN_Q36 are pictures in the paper;
 * the activation tree is derived from the code and the official key is quoted.
 */
export const chapterC8: Topic = {
  id: "cs.pds.c.recursion8",
  title: "Recursion in C",
  no: "8",
  book: [
    { t: "p", text: "A function is **recursive** when it calls itself. It sounds circular, but it is the same idea as a staircase: to climb n steps, climb one step and then climb n − 1 steps. The task is cut into a smaller copy of itself, and a smallest case that needs no cutting stops the process. Recursion appears in GATE every year, with twelve questions in this bank alone, because it combines everything so far: functions, copies of arguments, the call stack, and output order." },
    { t: "p", text: "The method for every recursion question is the same and is purely mechanical: draw one frame per call, write down what each call returns or prints, and read the answer from the frames. This chapter teaches that method, shows the three things that recursion questions ask (what is returned, in what order things are printed, and how many calls are made), explains calls that never stop, and ends with all twelve real questions." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["identify the base case and the recursive case of any recursive function;", "draw the call stack or the call tree and read off the value returned;", "say whether output comes before or after the recursive call, and in what order it appears;", "count the number of calls made;", "recognise a recursion that never stops, and the effect of `static` and global variables on a recursive function;", "read an activation tree and use the pre-order and post-order facts about it."] },

    { t: "h2", text: "The shape of a recursive function" },
    { t: "p", text: "Every correct recursive function has two parts. The **base case** is the smallest input, which is answered directly and makes no further call. The **recursive case** calls the same function on a smaller input and uses its answer. If a function has no base case, or if its recursive calls do not get closer to it, it never stops." },
    { t: "code", text: `#include <stdio.h>

int fact(int n) {
    if (n <= 1)               /* base case: no further call */
        return 1;
    return n * fact(n - 1);   /* recursive case: a smaller problem */
}

int main(void) {
    printf("%d\\n", fact(5));
    return 0;
}`, out: "120", file: "factorial.c" },
    { t: "callout", kind: "key", text: "To trust a recursive function, check two things: is there a base case that makes no call, and does every recursive call get **closer** to it?" },

    { t: "h2", text: "How recursion runs: the call stack" },
    { t: "p", text: "Each call has its own frame with its own copy of the parameters and local variables (chapter 6). A recursive call is no different: it simply makes a new frame on top of the stack. The frames pile up as the function goes down to the base case, and then, as each call returns, they are removed one by one from the top, with the value being handed back down." },
    { t: "fig", id: "c8-f1" },
    { t: "p", text: "That picture explains why the work happens in two phases. **Going down**, each call does what comes before its recursive call and then waits. **Coming back**, each call does what comes after the recursive call, using the value returned by the one above. Most recursion questions are about which phase a statement is in." },

    { t: "h2", text: "Output order: before or after the call" },
    { t: "p", text: "A statement placed **before** the recursive call runs on the way down, in call order. A statement placed **after** it runs on the way back, in the reverse order. Putting the same `printf` on one side or the other reverses the output." },
    { t: "code", text: `#include <stdio.h>

void down(int n) {
    if (n == 0) return;
    printf("%d", n);      /* before the call: on the way down */
    down(n - 1);
}

void up(int n) {
    if (n == 0) return;
    up(n - 1);
    printf("%d", n);      /* after the call: on the way back */
}

int main(void) {
    down(4);
    printf(" ");
    up(4);
    printf("\\n");
    return 0;
}`, out: "4321 1234", file: "before_after.c" },
    { t: "p", text: "The same idea turns a number into binary. To print n in binary, print n / 2 in binary first (everything but the last digit), and then print the last digit, `n % 2`. The digit is printed **after** the call, so the digits come out in the right order." },
    { t: "code", text: `#include <stdio.h>

void conv(int n) {
    if (n == 0) return;
    conv(n / 2);
    printf("%d", n % 2);   /* the last digit, printed last */
}

int main(void) {
    conv(10);
    printf("\\n");
    return 0;
}`, out: "1010", file: "binary_recursion.c" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Counting calls and drawing the call tree" },
    { t: "p", text: "When a function makes **two** recursive calls, as in the Fibonacci function, the calls branch like a tree. Drawing the **call tree**, with one node for each call and the value returned beside it, makes both the answer and the number of calls easy to read." },
    { t: "fig", id: "c8-f2" },
    { t: "code", text: `#include <stdio.h>

int calls = 0;

int fib(int n) {
    calls++;
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

int main(void) {
    int r = fib(4);
    printf("%d %d\\n", r, calls);
    return 0;
}`, out: "3 9", file: "fib_calls.c" },
    { t: "p", text: "The call tree of `fib(4)` has nine nodes, so the function is called nine times, even though the answer is only 3. The numbers of calls grow quickly: each extra step roughly multiplies the work by 1.6, which is why a double recursion like this is slow." },
    { t: "callout", kind: "tip", text: "For a function that calls itself with `n / 3`, `n / 2` or any division, the calls make a **chain**, not a tree, and the number of calls is the number of times you can divide before the base case: for 81 divided by 3 until 3, that is 81 → 27 → 9 → 3, four calls." },

    { t: "h2", text: "Recursion that does not stop" },
    { t: "p", text: "If the recursion never reaches a base case, the calls pile up until the stack runs out of room, and the program crashes (a **stack overflow**). This is also called **abnormal termination**. Three things cause it: no base case at all, a base case that the input skips over (for example a test `n == 0` when n goes 5, 3, 1, −1, …), and a recursive call that does not make the input smaller." },
    { t: "trap", i: 1 },
    { t: "p", text: "A loop that never ends is a different thing from a recursion that never ends. The loop burns time but uses no extra memory, and the program hangs. The recursion uses a new frame each time, and the program is killed when the stack is full." },
    { t: "callout", kind: "warning", text: "A recursion that does not terminate has no output to give. If a question's recursion never reaches its base case, the answer is that the program does not terminate normally (infinite recursion or stack overflow), not a number." },

    { t: "h2", text: "Static variables and recursion" },
    { t: "p", text: "A `static` local variable (chapter 7) is **one** box shared by all the calls, not one per call. In a recursive function that means every call sees, and changes, the same variable. The value is not reset when a call returns; it simply keeps what the calls have done to it. Many people expect a separate copy in each frame, and that is the mistake the question below sets up." },
    { t: "trap", i: 2 },
    { t: "p", text: "The same is true for a global variable. When you see a counter that is `static` or global in a recursive function, keep a column for it in your table and **never reset it**." },

    { t: "h2", text: "Activation trees" },
    { t: "p", text: "An **activation tree** shows the calls made during a run. Each node is one call; its children are the calls it makes, from left to right in the order they are made. Two facts follow from how the stack works. The **sequence of calls** is a **pre-order** traversal of the tree (a call is made before the calls it makes). The **sequence of returns** is a **post-order** traversal (a call returns after all the calls it made have returned)." },
    { t: "fig", id: "c8-f3" },
    { t: "callout", kind: "shortcut", text: "Calls in the order made = pre-order of the activation tree. Returns in the order they happen = post-order. These two facts answer any question about the order of calls and returns." },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Twelve questions have been asked, in five groups. Each is explained below, with how marks are lost. Several are fragments of code without a `main`, and they were checked by running them inside a test program." },

    { t: "h3", text: "Group 1: what does the function return?" },
    { t: "h4", text: "GATE 2026 (forenoon), Q61: the smallest n with foo(n) = 5" },
    { t: "p", text: "A two-mark numerical question with two functions. `bar(n)` counts how many times n can be halved, that is the whole-number part of log₂ n. `foo(n)` is one more than `foo` of that. The question asks for the **smallest** n whose result is 5." },
    { t: "ex", id: "c8-e1" },
    { t: "p", text: "**What it tests.** Reading `bar` as the integer log (n halves until it reaches 1), and then working **backwards** from the answer instead of trying n = 1, 2, 3, … until 5 appears. If `foo(n) = 5`, then `foo(bar(n)) = 4`, so `bar(n)` must be the smallest number whose `foo` is 4, and so on down. The smallest numbers with foo = 1, 2, 3, 4, 5 are 1, 2, 4, 16 and 65536. **Where marks are lost:** answering 32 or 256 by guessing a pattern from small values, or giving the answer for foo = 4 (16) one step too early." },
    { t: "table", head: ["Change", "Reasoning", "Smallest n"], rows: [["`foo(n) = 3`", "need bar(n) = 2 (foo = 2), so n = 2² = 4", "4"], ["`foo(n) = 4`", "need bar(n) = 4 (the smallest with foo = 3), so n = 2⁴", "16"], ["`foo(n) = 6`", "need bar(n) = 65536, so n = 2^65536", "2^65536"]], caption: "foo(1…5) was computed by running the function: 1, 2, 3, 4, 5 for n = 1, 2, 4, 16, 65536." },

    { t: "h4", text: "GATE 2026 (afternoon), Q61: the largest value that func can return" },
    { t: "p", text: "A two-mark numerical question that asks for a **maximum over all inputs**. The function looks at the length of the range from start to end and removes one or two positions at a time, adding 1 only in one case." },
    { t: "ex", id: "c8-e2" },
    { t: "p", text: "**What it tests.** Following the remainder of the length modulo 3. A call returns 0 immediately when the length is below 1 or a position is negative. Otherwise: length % 3 = 0 removes one position (length − 1, which has remainder 2); length % 3 = 2 removes two (length − 2, remainder 0 again); only length % 3 = 1 adds 1, and removes one position (length − 1, remainder 0). So once the remainders 0 and 2 start to alternate, the remainder 1 never comes back, and the function can add 1 **at most once**, if the first length has remainder 1. The maximum is 1. **Where marks are lost:** answering the number of positions, or a large number, without noticing that the remainders cycle 1 → 0 → 2 → 0 → 2 … and never reach 1 again." },
    { t: "table", head: ["Starting length", "Remainders met", "Returns"], rows: [["4 (remainder 1)", "1 → 0 → 2 → 0 → …", "1"], ["3 (remainder 0)", "0 → 2 → 0 → …", "0"], ["5 (remainder 2)", "2 → 0 → 2 → …", "0"]], caption: "Checked by running func over all start and end values below 30: the largest result is 1." },

    { t: "h4", text: "GATE 2021 (afternoon), Q47: subtraction as division" },
    { t: "p", text: "A one-mark numerical question. The function subtracts the smaller number from the larger until the two are equal, which is a way of finding the greatest common divisor." },
    { t: "ex", id: "c8-e3" },
    { t: "p", text: "**What it tests.** Seeing the pattern instead of running 17 calls. Each call replaces the larger number by the difference, which does not change the gcd, and stops when the two are equal (that common value is the gcd) or one of them is 1. For (15, 255) the 255 is reduced by 15 each time: 240, 225, …, 15. Then x == y, and the function returns 15. **Where marks are lost:** answering 1 (the first `if`) when neither is 1, and answering 255 or 17 by mixing up the two arguments." },
    { t: "table", head: ["Call", "Reasoning", "Returns"], rows: [["SomeFunction(15, 255)", "255 − 15 repeatedly until (15, 15)", "15"], ["SomeFunction(12, 18)", "(12, 6) → (6, 6)", "6"], ["SomeFunction(7, 1)", "y == 1: the first test", "1"]], caption: "The first row was computed by running the function." },

    { t: "h4", text: "GATE 2021 (afternoon), Q48: a double recursion" },
    { t: "p", text: "A two-mark numerical question. The function makes two recursive calls, so the calls branch. The statement of the code has a missing semicolon, which the question tells you to ignore, and two `if` tests that can never be reached." },
    { t: "ex", id: "c8-e4" },
    { t: "fig", id: "c8-f4" },
    { t: "p", text: "**What it tests.** Careful evaluation of a tree of calls, and noticing which parts of the code are dead. The first test `(x <= 0) || (y <= 0)` already returns q in every case where the next two tests would apply, so those two lines never run. With q = 10, each call subtracts 10 from one argument. The nine calls give the leaves 10 (when an argument drops to 0 or below) and the sum is 60. **Where marks are lost:** following the unreachable `if` lines, or counting a leaf as 0 instead of q." },
    { t: "table", head: ["Change", "Reasoning", "Result"], rows: [["`foo(15, 15, 10)` (the question)", "the call tree has six leaves of value 10", "60"], ["`foo(5, 5, 10)`", "the first test is true at once: returns q", "10"]], caption: "The first row was computed by running the function." },

    { t: "h4", text: "GATE 2018 (forenoon), Q31: how many calls?" },
    { t: "p", text: "A one-mark numerical question that asks not for the returned value but for the value of a **global counter**, which counts the calls. The function divides b by 3 on every recursive call." },
    { t: "ex", id: "c8-e5" },
    { t: "p", text: "**What it tests.** Counting the length of a chain of calls. `counter++` runs at the start of every call. The values of b are 81, 27, 9 and 3, and at b == 3 the function returns without calling itself. That is four calls, so counter is 4. The returned value (4 cubed many times) is irrelevant. **Where marks are lost:** printing the returned value (a huge number), counting five calls by including b = 1, or counting three by forgetting the first call." },
    { t: "table", head: ["Call", "b", "counter after"], rows: [["calc(4, 81)", "81", "1"], ["calc(4, 27)", "27", "2"], ["calc(4, 9)", "9", "3"], ["calc(4, 3)", "3: base case", "4"]], caption: "Checked by running the program." },

    { t: "h3", text: "Group 2: what is printed, and in what order?" },
    { t: "h4", text: "GATE 2024 (forenoon), Q27: reading characters recursively" },
    { t: "p", text: "A one-mark multiple-choice question. The function reads one character, calls itself to read the rest, and prints the character **after** the call. The input is the four characters 1234 and a newline." },
    { t: "ex", id: "c8-e6" },
    { t: "p", text: "**What it tests.** Output order: the print is after the recursive call, so it happens on the way back, in reverse. The calls read 1, then 2, then 3, then 4, then the newline, which stops the recursion (and prints nothing: the second `if` also tests for the newline). Back in the call that read 4, it prints 4; then 3, then 2, then 1. The output is 4321. **Where marks are lost:** option D (1234), forgetting that the print is after the call; option B (does not terminate), because the function looks like an endless recursion; option A (no output), because of the second `if`." },
    { t: "table", head: ["Input", "Output", "Reason"], rows: [["1234 and Enter", "4321", "print after the call: reversed"], ["abc and Enter", "cba", "same rule"], ["Enter only", "nothing", "the first character is the newline"]], caption: "Run with the inputs shown." },

    { t: "h4", text: "GATE 2017 (forenoon), Q64: two functions that call each other" },
    { t: "p", text: "A two-mark multiple-choice question with **mutual recursion**: `fun1` calls `fun2`, which calls `fun1` again, and each prints its argument before and after." },
    { t: "ex", id: "c8-e7" },
    { t: "fig", id: "c8-f5" },
    { t: "p", text: "**What it tests.** A very careful trace, in which one function increases its parameter before the call (`++n`) and then prints the **increased** value afterwards. Following fun1(5): print 5, call fun2(3): print 3, call fun1(4) (since `++n` makes 4): print 4, call fun2(2): print 2, call fun1(3): print 3, call fun2(1): print 1, call fun1(2): print 2, call fun2(0) which returns. Then the prints after each call come back in the reverse order. The output is 53423122233445. **Where marks are lost:** forgetting that `fun2` prints the new value of `n` after `++n` on the way back (this is what separates option A from option C), or stopping early at fun2(0)." },
    { t: "table", head: ["Change", "Reasoning", "Output"], rows: [["`fun1(1)`", "prints 1, calls fun2(−1) (not 0, so it goes on): never ends", "does not terminate"], ["`fun1(2)`", "prints 2, fun2(0) returns, prints 2", "22"], ["`fun1(5)` (the question)", "the long trace above", "53423122233445"]], caption: "The last row was computed by running both functions." },

    { t: "h4", text: "GATE 2019 (forenoon), Q40: a recursion that never reaches its base case" },
    { t: "p", text: "A two-mark multiple-choice question. The function is meant to print binary, but its base case is wrong." },
    { t: "ex", id: "c8-e8" },
    { t: "p", text: "**What it tests.** Whether the base case is actually reachable. For a positive n the recursion calls `convert(n / 2)`, which goes 10, 5, 2, 1, 0 and then, for n = 0, the test `n < 0` is false, so it calls `convert(0 / 2)` = `convert(0)` again, for ever. Nothing is printed (all the prints are after the call), and the program never terminates normally. The answer is D. **Where marks are lost:** option A, because the function looks like the correct binary printer; the fix is `n == 0` as the base case, as in the `conv` function above." },
    { t: "table", head: ["n", "Chain of calls", "Result"], rows: [["10", "10 → 5 → 2 → 1 → 0 → 0 → 0 …", "never ends, prints nothing"], ["0", "0 → 0 → 0 …", "never ends"], ["with `n == 0` as base case", "10 → 5 → 2 → 1 → 0 stops", "prints 1010"]], caption: "The last row is the `conv` program of section 8.3, which was run." },

    { t: "h3", text: "Group 3: a static counter in a recursion" },
    { t: "h4", text: "GATE 2020 (forenoon), Q48: two functions, two statics" },
    { t: "p", text: "A two-mark numerical question. Both functions have their own `static int i`, and `fun2` adds the result of `fun1` to its own static again and again." },
    { t: "ex", id: "c8-e9" },
    { t: "fig", id: "c8-f6" },
    { t: "p", text: "**What it tests.** That each `static i` is a **single** box for the whole run (one for `fun1`, a different one for `fun2`) and that `fun1`'s static is **not reset** between calls. `fun1(n)` adds n to its static every time it is called (it recurses n times, adding 1 each time) and returns the static's total so far. So `fun1(5)` returns 5, then `fun1(4)` returns 9, `fun1(3)` returns 12, `fun1(2)` returns 14, `fun1(1)` returns 15. `fun2` adds these to its own static: 5 + 9 + 12 + 14 + 15 = 55. **Where marks are lost:** treating `fun1`'s `i` as fresh each time (the sum 5 + 4 + 3 + 2 + 1 = 15), or mixing up the two `i`s." },
    { t: "table", head: ["Call from fun2", "fun1's static i after", "fun1 returns", "fun2's i after"], rows: [["fun1(5)", "5", "5", "5"], ["fun1(4)", "9", "9", "14"], ["fun1(3)", "12", "12", "26"], ["fun1(2)", "14", "14", "40"], ["fun1(1)", "15", "15", "55"]], caption: "Checked by running both functions." },

    { t: "h3", text: "Group 4: does it terminate?" },
    { t: "h4", text: "GATE 2017 (forenoon), Q57: foo and bar" },
    { t: "p", text: "A two-mark multiple-choice question that asks what happens, not what value comes out. One function recurses without ever reducing its argument; the other loops without ever reducing its counter." },
    { t: "ex", id: "c8-e10" },
    { t: "p", text: "**What it tests.** The difference between a recursion that never ends and a loop that never ends. In `foo(3)`, the call `foo(val--)` passes the **old** value (3) and only then lowers `val`, so the new call is again `foo(3)`: an infinite recursion, which ends by overflowing the stack (abnormal termination). In `bar(3)` the recursive call is `bar(val - 1)`, which does reach `bar(0)` and return; but `val` itself is never changed inside `bar(3)`, so the `while (val > 0)` loop never ends: an infinite loop. So `foo` ends abnormally and `bar` is an infinite loop: option C. **Where marks are lost:** thinking `val--` lowers the value before the call (option B or A), and not noticing that the loop in `bar` never changes `val`." },
    { t: "table", head: ["Function", "What goes wrong", "Outcome"], rows: [["foo(3)", "foo(val--) passes the old 3, forever", "stack overflow (abnormal termination)"], ["bar(3)", "bar(2), bar(1), bar(0) return, but val stays 3", "infinite loop"]], caption: "foo(3) and bar(3) as in the question." },

    { t: "h3", text: "Group 5: activation trees" },
    { t: "h4", text: "GATE 2023 (forenoon), Q36: draw the activation tree" },
    { t: "p", text: "A two-mark question whose options are four pictures of trees. The answer follows from reading which function calls which, in order." },
    { t: "ex", id: "c8-e11" },
    { t: "fig", id: "c8-f7" },
    { t: "p", text: "**What it tests.** Reading the calls in order and drawing them as a tree. `main` calls `f1`, then `f2(2)`, then `f3`. `f2(2)` calls `f3` first (its first line), then, because X is not 1, calls `f2(1)`. `f2(1)` calls `f3` and then, because X == 1, `f1`. The tree under `main` is: f1; f2 with children f3 and f2, where that f2 has children f3 and f1; and f3. The official answer is option A (the options are pictures in the paper). **Where marks are lost:** forgetting the call to `f3` at the start of every `f2`, or putting `f1` under the wrong `f2`." },
    { t: "h4", text: "GATE 2021 (forenoon), Q62: pre-order and post-order" },
    { t: "p", text: "A one-mark question with two statements, and no code." },
    { t: "ex", id: "c8-e12" },
    { t: "p", text: "**What it tests.** The two facts of section 8.6. The sequence of calls is a pre-order traversal (a call is made before the calls it makes), and the sequence of returns is a post-order traversal (a call returns after the calls it made). Both are true, so the answer is C. **Where marks are lost:** thinking that returns follow the same order as calls (pre-order), or that calls follow post-order. Check with a small tree: main calls A and B. Calls: main, A, B (pre-order). Returns: A, B, main (post-order)." },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A recursive function needs a base case and a recursive case that gets closer to it. Without either, it never stops (stack overflow).", "Each call has its own frame; frames pile up on the way down and are removed on the way back.", "Statements before the call run in call order, statements after it in reverse order.", "A double recursion makes a call tree; count its nodes to count the calls. A division by a constant makes a chain.", "A static or global variable is one box shared by all calls, and it is not reset.", "The sequence of calls is the pre-order and the sequence of returns the post-order of the activation tree.", "Work backwards for \"smallest n such that …\" questions, and look for reachable base cases first."] },
  ],
  blocks: [
    { type: "figure", id: "c8-f1", caption: "fact(3): frames pile up on the way down and the values are multiplied on the way back.", alt: "Frames of fact(3): fact(3), fact(2), fact(1) on the way down, then returns 1, 2 and 6.", fig: { kind: "frames", title: "fact(3)", frames: [
      { caption: "main calls fact(3). A frame with n = 3.", fig: { kind: "stackframe", frames: [{ title: "fact", tone: "hl", rows: [{ name: "n", value: 3 }] }, { title: "main", rows: [{ name: "result", value: "?" }] }] } },
      { caption: "fact(3) calls fact(2); fact(2) calls fact(1). Three frames are waiting.", fig: { kind: "stackframe", frames: [{ title: "fact", tone: "hl", rows: [{ name: "n", value: 1 }] }, { title: "fact", rows: [{ name: "n", value: 2 }] }, { title: "fact", rows: [{ name: "n", value: 3 }] }, { title: "main", rows: [{ name: "result", value: "?" }] }] } },
      { caption: "fact(1) is the base case: it returns 1 and its frame is removed. fact(2) returns 2 × 1 = 2.", fig: { kind: "stackframe", frames: [{ title: "fact", tone: "hl", rows: [{ name: "n", value: 2 }, { name: "returns", value: 2, tone: "ok" }] }, { title: "fact", rows: [{ name: "n", value: 3 }] }, { title: "main", rows: [{ name: "result", value: "?" }] }] } },
      { caption: "fact(3) returns 3 × 2 = 6 to main.", fig: { kind: "stackframe", frames: [{ title: "main", tone: "ok", rows: [{ name: "result", value: 6, tone: "ok" }] }] } },
    ] } },
    { type: "figure", id: "c8-f2", caption: "The call tree of fib(4): nine calls. The value returned is written at each node.", alt: "The call tree of fib(4) with nine nodes and the values returned.", fig: { kind: "calltree", title: "fib(4) = 3, nine calls", root: { label: "fib(4)", ret: 3, kids: [{ label: "fib(3)", ret: 2, kids: [{ label: "fib(2)", ret: 1, kids: [{ label: "fib(1)", ret: 1 }, { label: "fib(0)", ret: 0 }] }, { label: "fib(1)", ret: 1 }] }, { label: "fib(2)", ret: 1, kids: [{ label: "fib(1)", ret: 1 }, { label: "fib(0)", ret: 0 }] }] } } },
    { type: "figure", id: "c8-f3", caption: "An activation tree. Calls happen in pre-order (main, A, C, B) and returns in post-order (C, A, B, main).", alt: "An activation tree with main, A, B and C.", fig: { kind: "calltree", title: "main calls A and B; A calls C", order: true, root: { label: "main", kids: [{ label: "A", kids: [{ label: "C" }] }, { label: "B" }] } } },
    { type: "figure", id: "c8-f4", caption: "GATE 2021 AN Q48 with q = 10: each leaf returns 10; the six leaves add up to 60.", alt: "The call tree of foo(15, 15, 10) with leaves of value 10 and a total of 60.", fig: { kind: "calltree", title: "foo(15, 15, 10) = 60", root: { label: "(15,15)", ret: 60, kids: [{ label: "(15,5)", ret: 30, kids: [{ label: "(15,-5)", ret: 10 }, { label: "(5,5)", ret: 20, kids: [{ label: "(5,-5)", ret: 10 }, { label: "(-5,5)", ret: 10 }] }] }, { label: "(5,15)", ret: 30, kids: [{ label: "(5,5)", ret: 20, kids: [{ label: "(5,-5)", ret: 10 }, { label: "(-5,5)", ret: 10 }] }, { label: "(-5,15)", ret: 10 }] }] } } },
    { type: "figure", id: "c8-f5", caption: "GATE 2017 FN Q64: the prints on the way down (5 3 4 2 3 1 2) and then on the way back (2 2 3 3 4 4 5) in reverse order of the calls.", alt: "A table of the calls of fun1 and fun2 with what each prints before and after.", fig: { kind: "trace", title: "fun1(5)", cols: ["Call", "prints before", "prints after", "calls next"], rows: [{ cells: ["fun1(5)", "5", "5", "fun2(3)"] }, { cells: ["fun2(3)", "3", "4 (n is now 4)", "fun1(4)"] }, { cells: ["fun1(4)", "4", "4", "fun2(2)"] }, { cells: ["fun2(2)", "2", "3 (n is now 3)", "fun1(3)"] }, { cells: ["fun1(3)", "3", "3", "fun2(1)"] }, { cells: ["fun2(1)", "1", "2 (n is now 2)", "fun1(2)"] }, { cells: ["fun1(2)", "2", "2", "fun2(0) returns"], tone: "ok" }] } },
    { type: "figure", id: "c8-f6", caption: "GATE 2020 FN Q48: fun1's static is never reset. fun2 adds fun1's running total every time.", alt: "A table of the calls from fun2 to fun1 with the static values.", fig: { kind: "trace", title: "fun2(5)", cols: ["n", "fun1(n) returns", "fun2's i"], rows: [{ cells: [5, 5, 5] }, { cells: [4, 9, 14], changed: [1, 2] }, { cells: [3, 12, 26], changed: [1, 2] }, { cells: [2, 14, 40], changed: [1, 2] }, { cells: [1, 15, 55], changed: [1, 2], tone: "ok" }] } },
    { type: "figure", id: "c8-f7", caption: "The activation tree of the main function in GATE 2023 FN Q36, read from the code in the order of the calls.", alt: "The activation tree: main with f1, f2 and f3; f2 with f3 and f2; the inner f2 with f3 and f1.", fig: { kind: "calltree", title: "main", order: true, root: { label: "main", kids: [{ label: "f1" }, { label: "f2(2)", kids: [{ label: "f3" }, { label: "f2(1)", kids: [{ label: "f3" }, { label: "f1" }] }] }, { label: "f3" }] } } },

    { type: "example", id: "c8-e1", level: "gate", title: "GATE CS 2026 (forenoon), Q61 · 2 marks · NAT", file: "gate2026_q61.txt", given: `int bar(int n){
    if (n == 1) return 0;
    else return 1 + bar(n/2);
}
int foo(int n){
    if (n == 1) return 1;
    else return 1 + foo(bar(n));
}
/* The smallest positive integer n for which foo(n) returns 5. */`, find: "The smallest n.", steps: [
      { say: "bar(n) counts the halvings of n down to 1: it is the whole-number part of log₂ n.", result: "bar(n) = ⌊log₂ n⌋" },
      { say: "foo(n) = 1 + foo(bar(n)), and foo(1) = 1. Work backwards: foo = 5 needs foo(bar(n)) = 4.", result: "need foo(bar n) = 4" },
      { say: "The smallest m with foo(m) = 2 is 2 (bar(2) = 1). With foo = 3, it is 4 (bar(4) = 2). With foo = 4, it is 16 (bar(16) = 4).", result: "1, 2, 4, 16" },
      { say: "So bar(n) must be 16, and the smallest n with ⌊log₂ n⌋ = 16 is 2¹⁶.", result: "65536" },
    ], answer: "65536", check: "Official answer 65536. foo(1), foo(2), foo(4), foo(16), foo(65536) were computed by running the functions: 1, 2, 3, 4, 5." },
    { type: "example", id: "c8-e2", level: "gate", title: "GATE CS 2026 (afternoon), Q61 · 2 marks · NAT", file: "gate2026_an_q61.txt", given: `int func(int start, int end){
    int length = end + 1 - start;
    if((length<1) || (start < 0) || (end<0)){ return(0); }
    if(length%3 == 0){
        return(func(start+1, end));
    } else if(length%3 == 1){
        return(1 + func(start, end -1));
    } else {
        return(func(start + 2, end));
    }
}
/* The maximum possible value that can be returned. */`, find: "The maximum value returned.", steps: [
      { say: "Only the branch length % 3 == 1 adds 1. That branch calls func(start, end − 1), so the length drops by 1.", result: "adds 1, length − 1" },
      { say: "After length % 3 == 1 the new length has remainder 0. Remainder 0 goes to length − 1 (remainder 2); remainder 2 goes to length − 2 (remainder 0).", result: "0 → 2 → 0 → 2 …" },
      { say: "The remainder 1 never returns, so 1 can be added at most once, and only if the first length has remainder 1.", result: "1" },
    ], answer: "1", check: "Official answer 1. func was run for every start and end below 30; the largest result was 1." },
    { type: "example", id: "c8-e3", level: "gate", title: "GATE CS 2021 (afternoon), Q47 · 1 mark · NAT", file: "gate2021_an_q47.txt", given: `int SomeFunction(int x, int y)
{
    if ((x == 1) || (y == 1)) return 1;
    if (x == y) return x;
    if (x > y) return SomeFunction(x - y, y);
    if (y > x) return SomeFunction(x, y - x);
}
/* The value returned by SomeFunction(15, 255). */`, find: "The value returned.", steps: [
      { say: "Neither 15 nor 255 is 1, and they are not equal. Since y > x the call is SomeFunction(15, 240).", result: "(15, 240)" },
      { say: "Each call subtracts 15 from the larger number: 225, 210, … The difference never changes the gcd.", result: "(15, 15) at the end" },
      { say: "When x == y the function returns x.", result: "15" },
    ], answer: "15", check: "Official answer 15. SomeFunction(15, 255) was run and returned 15. It computes the gcd by repeated subtraction." },
    { type: "example", id: "c8-e4", level: "gate", title: "GATE CS 2021 (afternoon), Q48 · 2 marks · NAT", file: "gate2021_an_q48.c", given: `#include <stdio.h>

int foo(int x, int y, int q)
{
    if ((x <= 0) || (y <= 0))
        return q;
    if (x <= 0)
        return foo(x, y - q, q);
    if (y <= 0)
        return foo(x - q, y, q);
    return foo(x, y - q, q) + foo(x - q, y, q);
}

int main( )
{
    int r = foo(15, 15, 10);
    printf("%d", r);
    return 0;
}`, find: "The output. (The missing semicolon in the original is to be ignored.)", steps: [
      { say: "The first test already returns q whenever x or y is 0 or less, so the next two tests never run.", result: "two tests are dead code" },
      { say: "foo(15, 5, 10) = foo(15, −5, 10) + foo(5, 5, 10) = 10 + (10 + 10) = 30.", result: "30" },
      { say: "foo(5, 15, 10) = foo(5, 5, 10) + foo(−5, 15, 10) = 20 + 10 = 30.", result: "30" },
      { say: "foo(15, 15, 10) = foo(15, 5, 10) + foo(5, 15, 10).", result: "60" },
    ], answer: "60", check: "Official answer 60. The program (with the semicolon added) was compiled and run." },
    { type: "example", id: "c8-e5", level: "gate", title: "GATE CS 2018 (forenoon), Q31 · 1 mark · NAT", file: "gate2018_q31.c", given: `#include <stdio.h>

int counter = 0;

int calc (int a, int b) {
    int c;
    counter++;
    if (b==3) return (a*a*a);
    else {
        c = calc(a, b/3);
        return (c*c*c);
    }
}

int main (){
    calc(4, 81);
    printf ("%d", counter);
}`, find: "The output.", steps: [
      { say: "calc(4, 81): counter = 1; b is not 3, so it calls calc(4, 27).", result: "counter = 1" },
      { say: "calc(4, 27): counter = 2; calls calc(4, 9). calc(4, 9): counter = 3; calls calc(4, 3).", result: "counter = 3" },
      { say: "calc(4, 3): counter = 4; b == 3: base case, no more calls.", result: "4" },
    ], answer: "4", check: "Official answer 4. The program was compiled and run." },
    { type: "example", id: "c8-e6", level: "gate", title: "GATE CS 2024 (forenoon), Q27 · 1 mark · MCQ", file: "gate2024_q27_input.c", given: `#include <stdio.h>

void fx( );

int main( ) {
    fx( );
    return 0;
}

void fx( ) {
    char a;
    if ((a=getchar( )) != '\\n')
        fx( );
    if (a != '\\n')
        putchar (a);
}`, find: "The input is 1234 followed by a newline. Options: (A) no output  (B) does not terminate  (C) prints 4321  (D) prints 1234", steps: [
      { say: "Each call reads one character, and calls itself if it is not the newline: the calls read 1, 2, 3, 4 and then the newline.", result: "five calls" },
      { say: "The call that read the newline does not recurse and prints nothing.", result: "unwinds" },
      { say: "On the way back, each call prints its own character after the recursive call: 4, then 3, then 2, then 1.", result: "4321" },
    ], answer: "(C) 4321", check: "Official answer (C). The program was compiled and run with the input 1234, and printed 4321." },
    { type: "example", id: "c8-e7", level: "gate", title: "GATE CS 2017 (forenoon), Q64 · 2 marks · MCQ", file: "gate2017_q64.txt", given: `void fun1 (int n) {
    if (n == 0) return;
    printf ("%d", n);
    fun2 (n - 2);
    printf ("%d", n);
}
void fun2 (int n) {
    if (n == 0) return;
    printf ("%d", n);
    fun1(++n);
    printf ("%d", n);
}
/* fun1(5) is called. Options:
 (A) 53423122233445   (B) 53423120112233
 (C) 53423122132435   (D) 53423120213243 */`, find: "The output printed.", steps: [
      { say: "Going down: fun1(5) prints 5; fun2(3) prints 3, then calls fun1(4) because ++n makes n 4.", result: "5 3" },
      { say: "fun1(4) prints 4; fun2(2) prints 2, calls fun1(3); fun1(3) prints 3, calls fun2(1).", result: "4 2 3" },
      { say: "fun2(1) prints 1, calls fun1(2); fun1(2) prints 2 and calls fun2(0), which returns at once.", result: "1 2" },
      { say: "Coming back: fun1(2) prints 2; fun2(1) prints its new n, 2; fun1(3) prints 3; fun2(2) prints 3; fun1(4) prints 4; fun2(3) prints 4; fun1(5) prints 5.", result: "2 2 3 3 4 4 5" },
    ], answer: "(A) 53423122233445", check: "Official answer (A). Both functions were run and printed 53423122233445." },
    { type: "example", id: "c8-e8", level: "gate", title: "GATE CS 2019 (forenoon), Q40 · 2 marks · MCQ", file: "gate2019_q40.txt", given: `void convert (int n) {
    if (n < 0)
        printf("%d", n);
    else {
        convert (n/2);
        printf("%d", n % 2);
    }
}
/* convert is called with any positive integer n. Options:
 (A) prints the binary of n and terminates
 (B) prints the binary in reverse order and terminates
 (C) prints the binary but does not terminate
 (D) prints nothing and does not terminate */`, find: "What happens?", steps: [
      { say: "For n > 0 the function calls convert(n / 2). The arguments go n, n/2, …, 1, 0.", result: "reaches 0" },
      { say: "For n = 0 the test n < 0 is false, so it calls convert(0 / 2) = convert(0) again. And again.", result: "endless recursion" },
      { say: "Every printf is after the recursive call, so nothing is printed before the stack overflows.", result: "D" },
    ], answer: "(D)", check: "Official answer (D). The correct base case is n == 0, as in the conv program of section 8.3." },
    { type: "example", id: "c8-e9", level: "gate", title: "GATE CS 2020 (forenoon), Q48 · 2 marks · NAT", file: "gate2020_q48.txt", given: `int fun1(int n) {
    static int i = 0;
    if (n > 0) {
        ++i;
        fun1(n - 1);
    }
    return(i);
}
int fun2(int n) {
    static int i = 0;
    if (n > 0) {
        i = i + fun1(n);
        fun2(n - 1);
    }
    return(i);
}
/* The return value of fun2(5). */`, find: "The return value of fun2(5).", steps: [
      { say: "fun1(n) recurses n times, adding 1 to its static i each time, and returns that static. It is never reset.", result: "fun1's i grows" },
      { say: "fun2(5): fun1(5) returns 5 (i = 5). fun2's i = 0 + 5 = 5.", result: "5" },
      { say: "fun2(4): fun1(4) adds 4 more: returns 9. fun2's i = 5 + 9 = 14. fun2(3): fun1 returns 12, i = 26.", result: "26" },
      { say: "fun2(2): fun1 returns 14, i = 40. fun2(1): fun1 returns 15, i = 55.", result: "55" },
    ], answer: "55", check: "Official answer 55. Both functions were run and fun2(5) returned 55." },
    { type: "example", id: "c8-e10", level: "gate", title: "GATE CS 2017 (forenoon), Q57 · 2 marks · MCQ", file: "gate2017_q57.txt", given: `int foo (int val) {
    int x = 0;
    while (val > 0) {
        x = x + foo (val --);
    }
    return val;
}
int bar (int val) {
    int x = 0;
    while (val > 0) {
        x = x + bar (val -1);
    }
    return val;
}
/* Invocations of foo(3) and bar(3) will result in:
 (A) return of 6 and 6   (B) infinite loop and abnormal termination
 (C) abnormal termination and infinite loop   (D) both terminating abnormally */`, find: "What happens for foo(3) and for bar(3)?", steps: [
      { say: "foo(val--) passes the old value of val, 3. So foo(3) calls foo(3), which calls foo(3), and so on: the recursion never ends and the stack overflows.", result: "foo: abnormal termination" },
      { say: "bar(val − 1) reaches bar(0), which returns, so the recursion is finite. But val is never changed in bar(3), so its while (val > 0) loop never ends.", result: "bar: infinite loop" },
    ], answer: "(C)", check: "Official answer (C)." },
    { type: "example", id: "c8-e11", level: "gate", title: "GATE CS 2023 (forenoon), Q36 · 2 marks · MCQ", file: "gate2023_q36.txt", given: `int main( ) { f1( ); f2(2); f3( ); return (0); }
int f1( ) { return(1); }
int f2(int X) {
    f3( );
    if (X == 1) return f1( );
    else return (X * f2(X - 1));
}
int f3( ) { return(5); }
/* Which option is the activation tree of main? (the four options are pictures in the paper) */`, find: "The activation tree.", steps: [
      { say: "main calls f1, then f2(2), then f3, in that order.", result: "main: f1, f2(2), f3" },
      { say: "f2(2) starts by calling f3. Since X is 2, not 1, it then calls f2(1).", result: "f2(2): f3, f2(1)" },
      { say: "f2(1) calls f3 first and then, because X == 1, f1.", result: "f2(1): f3, f1" },
    ], answer: "(A)", check: "Official answer (A). The tree is drawn in Figure 8.7; the options are pictures in the paper, so the option letter is quoted from the official key." },
    { type: "example", id: "c8-e12", level: "easy", title: "GATE CS 2021 (forenoon), Q62 · 1 mark · MCQ", file: "gate2021_q62.txt", given: `S1: The sequence of procedure calls corresponds to a preorder traversal of the activation tree.
S2: The sequence of procedure returns corresponds to a postorder traversal of the activation tree.

(A) S1 true, S2 false   (B) S1 false, S2 true
(C) both true           (D) both false`, find: "Which option is correct?", steps: [
      { say: "A procedure is called before the procedures it calls: that is the order of a pre-order traversal. S1 is true.", result: "S1 true" },
      { say: "A procedure returns after all the procedures it called have returned: the order of a post-order traversal. S2 is true.", result: "S2 true" },
    ], answer: "(C)", check: "Official answer (C). Small check: main calls A, then B. Calls: main, A, B. Returns: A, B, main." },

    { type: "trap", wrong: "A statement after the recursive call runs in the same order as one before it.", tempting: "Both are lines of the same function, read top to bottom.", whyWrong: "A statement before the call runs on the way down, once per call, in call order. A statement after it runs on the way back, in the reverse order, after the deeper calls have finished.", rule: "Before the call: forward. After the call: backward.", ex: { code: "down(4); up(4);   /* print before / print after */", out: "4321 1234" } },
    { type: "trap", wrong: "A recursive function always stops.", tempting: "Each call looks like it solves a smaller problem.", whyWrong: "It stops only if every chain of calls reaches a base case. A base case that is skipped over (n == 0 when n goes 5, 3, 1, −1 …), or a base case on the wrong condition, makes it run until the stack overflows.", rule: "Check that the base case is reachable.", ex: { text: "convert(n) with the test `n < 0`: n goes 10, 5, 2, 1, 0, 0, 0 … The value 0 never makes the test true, so it never stops. Changing the test to `n == 0` stops it at once." } },
    { type: "trap", wrong: "Each call of a recursive function has its own copy of its static variable.", tempting: "Each call has its own copies of the other locals.", whyWrong: "A static is one box for the whole program. All the calls share it and nothing resets it.", rule: "Keep a column for the static and never reset it.", ex: { text: "In fun1(n) of GATE 2020, `static int i` is incremented once per call: fun1(5) makes i = 5; a later fun1(4) starts from 5 and makes it 9, not 4." } },
    { type: "gate", text: "Twelve questions: values returned (2026 FN Q61, 2026 AN Q61, 2021 AN Q47, 2021 AN Q48, 2018 FN Q31), output order and termination (2024 FN Q27, 2017 FN Q64, 2019 FN Q40, 2017 FN Q57), a static in a recursion (2020 FN Q48), and activation trees (2023 FN Q36, 2021 FN Q62). All are explained above." },
    { type: "recall", cards: [
      { q: "What are the two parts of a recursive function?", a: "A base case and a recursive case that moves closer to it." },
      { q: "When does a statement placed before the recursive call run?", a: "On the way down, in call order." },
      { q: "And a statement placed after it?", a: "On the way back, in reverse order." },
      { q: "How many calls does fib(4) make?", a: "9." },
      { q: "What happens if a recursion never reaches a base case?", a: "Stack overflow (abnormal termination)." },
      { q: "How many boxes does a static local in a recursive function have?", a: "One, shared by all calls." },
      { q: "The sequence of calls is what traversal of the activation tree?", a: "Pre-order." },
      { q: "The sequence of returns is what traversal?", a: "Post-order." },
      { q: "What does foo(val--) pass to foo?", a: "The old value of val." },
      { q: "How do you find the smallest n with f(n) = k when f recurses on log n?", a: "Work backwards from k, finding the smallest input for each value." },
    ] },
    { type: "check", questions: [
      { id: "r1", kind: "NAT", marks: 1, q: "int fact(int n) { if (n <= 1) return 1; return n * fact(n - 1); }  What is fact(5)?", answer: "120", solution: "5 × 4 × 3 × 2 × 1." },
      { id: "r2", kind: "NAT", marks: 1, q: "int fib(int n) { if (n < 2) return n; return fib(n-1) + fib(n-2); }  How many calls does fib(4) make (including the first)?", answer: "9", solution: "The call tree has nine nodes." },
      { id: "r3", kind: "NAT", marks: 1, q: "void p(int n) { if (n == 0) return; printf(\"%d\", n); p(n - 1); }  How many characters does p(4) print?", answer: "4", solution: "It prints 4321." },
      { id: "r4", kind: "NAT", marks: 1, q: "int g(int n) { if (n == 0) return 0; return n % 10 + g(n / 10); }  What is g(1234)?", answer: "10", solution: "4 + 3 + 2 + 1." },
      { id: "r5", kind: "MCQ", marks: 1, q: "void h(int n) { printf(\"%d\", n); h(n + 1); }  What happens when h(0) is called?", options: ["Prints 0 and stops", "Prints 0 1 2 3 and stops", "Never terminates normally", "A compile error"], answer: "C", solution: "There is no base case: infinite recursion." },
      { id: "r6", kind: "NAT", marks: 2, q: "int counter = 0; int calc(int a, int b) { counter++; if (b == 3) return a; return calc(a, b / 3); }  After calc(4, 243), what is counter?", answer: "5", solution: "b = 243, 81, 27, 9, 3: five calls." },
      { id: "r7", kind: "NAT", marks: 2, q: "int gcd(int a, int b) { if (b == 0) return a; return gcd(b, a % b); }  What is gcd(48, 18)?", answer: "6", solution: "(48, 18) → (18, 12) → (12, 6) → (6, 0)." },
      { id: "r8", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["The sequence of calls is a pre-order traversal of the activation tree", "A static local has one box per call", "A print after the recursive call appears in reverse order of the calls", "Every recursive function terminates"], answer: "A, C", solution: "B is false (one box in total). D is false (no base case)." },
      { id: "r9", kind: "NAT", marks: 2, q: "int fun1(int n) { static int i = 0; if (n > 0) { ++i; fun1(n - 1); } return i; }  What does fun1(3) return the first time it is called, and fun1(2) the second time? Give the sum.", answer: "8", solution: "fun1(3) returns 3; then fun1(2) adds 2 more to the static: 5. 3 + 5 = 8." },
      { id: "r10", kind: "NAT", marks: 2, q: "int bar(int n){ if (n == 1) return 0; return 1 + bar(n/2); }  What is bar(64)?", answer: "6", solution: "64 → 32 → 16 → 8 → 4 → 2 → 1: six halvings." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on recursion", sub: "Programming in C", href: "/topics/programming-in-c" }, { label: "The whole Programming in C book", sub: "next: arrays", href: "/study/c-programming" }] },
    { type: "links", prereq: ["Functions (C6)", "Scope and storage (C7)"], usedIn: ["Trees (D7)", "Recursion on data structures (D6)", "Algorithms: divide and conquer"], cross: ["Algorithms: recurrences", "Compiler design: activation records"] },
  ],
};
