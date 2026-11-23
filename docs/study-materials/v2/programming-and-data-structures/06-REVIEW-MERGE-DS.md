# 06 · Review merge for Data Structures (plan v1 → v2)

Two replies: `gemini-ds.md` (G) and `chatgpt-GATE_C_AND_DATA_STRUCTURES_MASTER_REVIEW.md` (C, which also reviews the C plan and the production rules). The improved plan is `04-DATA-STRUCTURES.md` (**v2**).

## 1. How good were they?

| Reply | Verdict |
|---|---|
| **G (Gemini)** | Excellent again: 52 gaps with exact places, 43 diagrams, and a cross-document audit. Caught real factual errors in my plan. |
| **C (ChatGPT master review)** | Much better than its earlier replies: it actually read the five files, separates syllabus-core from extensions, and corrects over-broad statements (including some in the earlier ChatGPT review and in my own C plan). It also says clearly what was *not* checkable (the PYQ bank, the diagram engine). Its "do not claim frequencies" rule is adopted. |

## 2. Errors in plan v1 that they exposed

1. **Hashing formulas were mixed.** I listed `1/(1−α)` and `(1/α) ln 1/(1−α)` next to chaining. Those are **open addressing** only; chaining is `1 + α` and `1 + α/2`. Fixed in D12.
2. **"A tail pointer makes the end fast" was incomplete.** It makes *insert* at the end O(1); *delete* at the end of a singly list is still O(n). Fixed in D3.
3. **No maths was taught** (Big-O, logs, sums, recurrences, expected value) although the C book never taught it and D0 used it. New chapter D1.
4. **Order errors:** recursive list reversal before recursion (moved to D6); stack using queues before queues (moved to D5); priority queue via heaps before heaps (idea in D5, heap in D10); amortised doubling in the first arrays lesson (now taught after D1, with a picture).
5. **Missing GATE traps**, now added: the `Node *head` vs `Node **head` trap; `p && p->next`; delete-by-pointer fails on the last node; prefix evaluation operand order and associativity flip; the `c … a … b` forbidden stack pattern; the three circular-queue conventions and the count formula; k-ary tree leaf formula; edge-based vs node-based height; traversal-equality conditions, `2^k` pre+post trees, labelled vs unlabelled trees; successor vs predecessor deletion; valid search paths and permutation counting for a BST; AVL base cases and insert-vs-delete rotation counts; B-tree "order" meanings and B+ block-size sums; heap positions (2nd and 3rd smallest), heap counting, repeated-insert vs build-heap arrays; quadratic probing failure and the double-hashing rules; tombstone trace; hashing probability questions; in-degree cost in a list; the four DFS edge types and three-state cycle detection; union-find array form.
6. **Stubs.** D10, D13, D14, D15 were two-line placeholders and most chapters had lost "beginner must see", "traces" and "code". All filled.
7. **D8 was too dense** (AVL, red-black, 2-3, B, B+, splay in one). Split: D9 AVL; D11 multi-way trees.
8. **Counting contradiction** (31 per sub-topic): same fix as C: 20 per lesson, defined units.

## 3. Scope decisions from the ChatGPT review (accepted)

| Item | Decision | Reason |
|---|---|---|
| AVL | [SHOULD], labelled as beyond the named syllabus line | Not named in Section 4; frequency unknown. |
| B and B+ | [LATER]; a short bridge here, full teaching in DBMS | The official syllabus lists indexing under databases. |
| Red-black, splay, 2-3 | One paragraph, [BEYOND] | Not named. |
| Tries, Fenwick, segment, k-d trees | Tries only, [LATER]; the rest dropped | Not named; scares a 100-day student. |
| Hashing | Taught fully here, one owner; Algorithms links | Named under Algorithms; avoid two chapters with different formulas. |
| Union-find | [LATER], cross-linked to graph algorithms | Not named in Section 4. |
| Frequencies | Always "not sure" until the tagged PYQ bank is counted | No audited data exists yet. |

## 4. Points about the C plan from the same reviews (applied to `03` v2.1 and `01`)

- **Machine assumptions**: v2 said "assume 32-bit unless stated". Now: use only what the question gives; otherwise separate what ISO C guarantees from what a common machine does; label addresses as illustrative. Applied in `03` and the master prompt.
- **Facts narrowed:** a C byte is `CHAR_BIT` bits; two's complement is the teaching model, not a guarantee; "stack / heap / .bss" is an implementation picture; indeterminate values for unassigned locals; `^` is XOR. Applied in `03`.
- **Conversion ladder** replaced by a two-step decision flow (promotions first, then the usual arithmetic conversions).
- **Other C facts to state precisely** (noted in the lesson briefs): pointer subtraction gives `ptrdiff_t` and is valid only in one array; relational vs equality pointer comparison have different rules; `sizeof` gives `size_t`; `calloc` gives all-bits-zero (not a promise about null pointers or float zero); union reading is nuanced (never claim "always undefined" or "always fine"); macro replacement is more than text pasting (teach the approximation, then the rules); `gets` removed in C11.
- **Master prompt:** practice ladder 20 per lesson with MCQ / MSQ / NAT tags; study-time and weight tags in the brief; machine-assumption rule replaced.

## 5. Rejected or deferred

- **One lesson = 3 to 6 sub-topics, about 35 to 40 topics per book** (G): accepted in spirit; my lesson count (about 75 for C, 55 for DS) is higher because the book is for a zero-level reader. I will merge lessons if the pilot shows they are too thin.
- **Diagram kinds** `BITS`, `HEAP`, `HASHTABLE`, `QUEUE_RING` (G): accepted (listed in `04` §2); added to the engine to-do list.
- **ChatGPT's 18 per lesson** (6+6+4+2): I chose 20; the difference is small. Say if you want 18.
- **Hard claims about GATE frequency**: none made.
