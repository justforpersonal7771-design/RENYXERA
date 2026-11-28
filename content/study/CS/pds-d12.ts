import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D12 "Hashing: a short bridge" (29 Nov 2026). The full treatment belongs to the Algorithms book (the official 2027 syllabus names
 * hashing under Algorithms); this chapter keeps the idea, chaining and open addressing with worked traces. Real GATE questions (texts from public/data/questions.json):
 * 2026 FN Q24 (linear probing, only slot 2 is empty), 2026 AN Q30 (longest chain 3), 2025 FN Q65 (double hashing, key 24 goes to slot 10),
 * 2020 FN Q28 (probe 1 of key 90 is 13). Programs compiled and run with gcc: the 2026 FN table 15 24 -1 -1 -1 -1 -1 22 1 13 11; 10 and 3.
 */
export const chapterD12: Topic = {
  id: "cs.pds.ds.hashing12",
  title: "Hashing: a short bridge",
  no: "D12",
  book: [
    { t: "p", text: "Every structure so far finds a key by walking: along a list, down a tree, through a sorted array by halving. **Hashing** finds a key by **calculating where it is**. A function turns the key into a number, and that number is the slot of an array in which the key is kept. When it works, a lookup, an insert and a delete each cost a constant number of steps, whatever the number of keys." },
    { t: "p", text: "This chapter is a bridge. Hashing is officially part of the Algorithms subject, and that book has the full treatment. Here we keep the ideas you need from the data-structure side: the hash function, what happens when two keys want the same slot, and the two standard answers, chaining and open addressing, each traced by hand the way the questions ask." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["explain what a hash table is and why collisions are unavoidable;", "insert keys by chaining and by linear probing and write the final table;", "compute the probe sequence of double hashing;", "state the cost of an operation on average and in the worst case."] },

    { t: "h2", text: "The idea: a locker for every key" },
    { t: "p", text: "Imagine a row of m lockers numbered 0 to m − 1 and a rule that tells you, from a key, which locker to use. To store a key, apply the rule and put it in that locker. To find it, apply the rule and look in that locker. There is no search at all. The rule is the **hash function** h(k), and the row of lockers is the **hash table**." },
    { t: "p", text: "The simplest rule is the **division method**: h(k) = k mod m. A good table size m is a prime not close to a power of 2, so that the keys spread evenly. A second common rule is the multiplication method, and others fold the digits of the key; the questions almost always give you the function." },
    { t: "p", text: "Since there are far more possible keys than slots, two different keys sometimes get the same slot. This is a **collision**. It cannot be avoided (the pigeonhole principle), so every hash table needs a rule for handling it. The load factor α = n/m (keys divided by slots) measures how full the table is: the fuller the table, the more collisions." },
    { t: "fig", id: "d12-f1" },
    { t: "callout", kind: "key", text: "Hash table: slot = h(key). A collision is two keys with the same slot. Load factor α = n / m." },

    { t: "h2", text: "Chaining" },
    { t: "p", text: "In **chaining** each slot holds a linked list (a chain) of all the keys that hash to it. Insert a key by adding it to the chain of its slot; look it up by scanning that chain. A chain is usually short, so the work is small. The table can hold more keys than slots (α can exceed 1), since the chains simply grow." },
    { t: "p", text: "With n keys in m slots and an even spread, an average chain has α = n/m keys, so an unsuccessful search takes about 1 + α steps. In the worst case all the keys land in one slot and the table becomes a single list of n keys, so the worst case is Θ(n)." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int chain[9] = {0}, longest = 0, ks[] = {5, 28, 19, 15, 26, 33, 12, 17, 10};
    for (int j = 0; j < 9; j++) {
        int b = ks[j] % 9;                       /* h(k) = k mod 9 */
        chain[b]++;                              /* one more key in that chain */
        if (chain[b] > longest) longest = chain[b];
    }
    printf("%d\\n", longest);
    return 0;
}`, out: "3", file: "chain_lengths.c" },
    { t: "p", text: "This program replays GATE 2026 (afternoon). The keys 5, 28, 19, 15, 26, 33, 12, 17, 10 give the slots 5, 1, 1, 6, 8, 6, 3, 8, 1. Slot 1 receives 28, 19 and 10: a chain of 3, the longest. Slots 6 and 8 have two keys each." },
    { t: "p", text: "Choose the table size and the function together. If every key is a multiple of 10 and m = 10, every key lands in slot 0 and the table is useless; a prime m, or a function that mixes all the digits, avoids this. The worst case is a property of the keys given to you, not of the table." },
    { t: "ex", id: "d12-e1" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Open addressing: linear probing" },
    { t: "p", text: "In **open addressing** there are no chains: every key is in the table itself, so the table must be at least as large as the number of keys (α ≤ 1). When a slot is taken, the key looks for another slot by following a **probe sequence**. With **linear probing** the sequence is h(k), h(k) + 1, h(k) + 2, … all taken modulo m, so the key takes the next free slot, wrapping round the end." },
    { t: "code", text: `#include <stdio.h>

#define M 11
int t[M];                                              /* -1 = empty */

void insert_linear(int key) {
    int h = (key + 7) % M;
    while (t[h] != -1) h = (h + 1) % M;               /* next slot, wrapping round */
    t[h] = key;
}

int main(void) {
    for (int i = 0; i < M; i++) t[i] = -1;
    int keys[] = {1, 13, 22, 15, 11, 24};
    for (int i = 0; i < 6; i++) insert_linear(keys[i]);
    for (int i = 0; i < M; i++) printf("%d ", t[i]);
    printf("\\n");
    return 0;
}`, out: "15 24 -1 -1 -1 -1 -1 22 1 13 11 ", file: "linear_probing.c" },
    { t: "p", text: "The program is GATE 2026 (forenoon): h(x) = (x + 7) mod 11, keys 1, 13, 22, 15, 11, 24. Key 1 goes to slot 8, 13 to 9, 22 to 7, 15 to 0. Key 11 hashes to 7, taken, then 8, taken, then 9, taken, then 10: free. Key 24 hashes to 9, taken, then 10 taken, then 0 taken, then 1: free. The final table has slot 2 empty, along with 3 to 6." },
    { t: "fig", id: "d12-f2" },
    { t: "p", text: "Linear probing has a known weakness, **clustering**: a run of occupied slots makes it more likely that the next key lands in the run and extends it, so long runs form. Another is **deletion**: removing a key leaves a hole that breaks the probe sequences of the keys behind it, so a deleted slot is marked with a special tombstone, not emptied. The final layout also depends on the **order of insertion**." },
    { t: "p", text: "To find a key in a linearly probed table, start at h(k) and move along until you meet the key (found) or an empty slot (not present). That is why a deleted slot cannot simply be emptied: an empty slot in the middle of a run would stop the search too early." },
    { t: "ex", id: "d12-e2" },
    { t: "trap", i: 1 },

    { t: "h2", text: "Double hashing" },
    { t: "p", text: "**Double hashing** removes much of the clustering by making the step size depend on the key as well. The i-th probe for key k goes to (h₁(k) + i × h₂(k)) mod m, where h₂(k) is a second hash function that is never zero. Two keys that collide at the first probe usually have different steps, so their paths part." },
    { t: "code", text: `#include <stdio.h>

#define M 11
int main(void) {
    int t[M]; for (int i = 0; i < M; i++) t[i] = -1;
    int keys[] = {63, 50, 25, 79, 67, 24}, where = -1;
    for (int j = 0; j < 6; j++) {
        int k = keys[j], h1 = k % 11, h2 = 1 + (k % 7), i = 0;
        while (t[(h1 + i * h2) % M] != -1) i++;           /* double hashing: step h2 */
        t[(h1 + i * h2) % M] = k;
        if (k == 24) where = (h1 + i * h2) % M;
    }
    printf("%d\\n", where);
    return 0;
}`, out: "10", file: "double_hashing.c" },
    { t: "p", text: "This is GATE 2025 (forenoon): h₁ = k mod 11, h₂ = 1 + (k mod 7). Keys 63, 50, 25, 79, 67 land in slots 8, 6, 3, 2, 1. Key 24 has h₁ = 2 (taken) and h₂ = 1 + 3 = 4: probe 1 is (2 + 4) mod 11 = 6, taken by 50; probe 2 is (2 + 8) mod 11 = 10: free. Key 24 is stored at slot 10." },
    { t: "p", text: "For double hashing to visit every slot, the step h₂(k) must have no common factor with the table size m. A prime m guarantees this for every step from 1 to m − 1, which is another reason for prime table sizes." },
    { t: "ex", id: "d12-e3" },
    { t: "ex", id: "d12-e4" },
    { t: "p", text: "Compare the three side by side. Chaining is the most forgiving and the simplest to delete from. Linear probing is the simplest open-addressing scheme and the most cache friendly, but clusters. Double hashing spreads the keys best but costs a second hash function." },
    { t: "table", head: ["", "Chaining", "Linear probing", "Double hashing"], rows: [["Where keys live", "chains outside the table", "in the table", "in the table"], ["Load factor α", "may exceed 1", "at most 1", "at most 1"], ["Clustering", "none", "primary clusters", "much less"], ["Deletion", "remove from the chain", "needs a tombstone", "needs a tombstone"], ["Average search", "about 1 + α", "grows fast as α nears 1", "grows slowly"], ["Worst case", "Θ(n)", "Θ(n)", "Θ(n)"]] },

    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "Hashing questions in the paper are of three kinds: **fill a table by a stated rule** and list the empty slots or the slot of the last key (examples 2 and 3), **count in the chains** (example 1), and **compute a probe** (example 4). A few ask for the cost on average against the worst case, or the effect of a malicious set of keys; the answer for the worst case is always Θ(n)." },
    { t: "h4", text: "What these questions are really testing" },
    { t: "p", text: "Whether you follow the rule exactly, one key at a time, and keep the table drawn. Redo the whole insertion order; do not skip, because every key can change the path of the next." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Forgetting to wrap round (mod m) when a probe passes the last slot.", "Using h₂ alone as the probe, or forgetting to add h₁.", "Inserting in the wrong order, which changes the layout under probing.", "Saying hashing is O(1) in the worst case.", "Counting the key itself twice when asked for the length of a chain."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A hash function maps a key to a slot; k mod m is the usual rule.", "Collisions are unavoidable; the load factor α = n/m measures how full the table is.", "Chaining: a list per slot, α can exceed 1. Open addressing: keys in the table, α ≤ 1.", "Linear probing: next free slot, wrapping round. Double hashing: probe i is (h₁ + i h₂) mod m.", "Average cost is constant for a good table; the worst case is Θ(n).", "The order of insertion decides the layout under probing."] },
  ],
  blocks: [
    { type: "figure", id: "d12-f1", caption: "A hash table with 11 slots and h(k) = k mod 11. Key 25 goes to slot 3 and key 14 also to slot 3: a collision.", alt: "A row of 11 slots numbered 0 to 10 with the keys 25 and 14 both belonging to slot 3.", fig: { kind: "array", title: "h(k) = k mod 11", data: [["·", "·", "·", "25", "·", "·", "·", "·", "·", "·", "·"]], base: 0, size: 1, index: false, tones: { "0,3": "bad" } } },
    { type: "figure", id: "d12-f2", caption: "The table of GATE 2026 FN Q24 after the six insertions: 15 24 and slots 2 to 6 empty, then 22, 1, 13, 11 in slots 7 to 10.", alt: "A table of 11 slots holding 15, 24, five empty slots, then 22, 1, 13 and 11.", fig: { kind: "array", title: "Linear probing, h(x) = (x + 7) mod 11", data: [[15, 24, "·", "·", "·", "·", "·", 22, 1, 13, 11]], base: 0, size: 1, index: false, tones: { "0,2": "ok", "0,3": "dim", "0,4": "dim", "0,5": "dim", "0,6": "dim" } } },

    { type: "example", id: "d12-e1", level: "gate", title: "GATE CS 2026 (afternoon), Q30 · 1 mark · NAT: the longest chain", file: "gate2026_an_q30.txt", given: `Keys 5, 28, 19, 15, 26, 33, 12, 17, 10 are inserted into a hash table with h(k) = k mod 9, collisions resolved by chaining.
The length of the longest chain?`, find: "The longest chain.", steps: [
      { say: "Compute h: 5→5, 28→1, 19→1, 15→6, 26→8, 33→6, 12→3, 17→8, 10→1.", result: "slots 5 1 1 6 8 6 3 8 1" },
      { say: "Count per slot: slot 1 has 28, 19, 10; slot 6 has 15, 33; slot 8 has 26, 17; slots 3 and 5 have one each.", result: "3, 2, 2, 1, 1" },
    ], answer: "3", check: "The program in this chapter prints 3." },
    { type: "example", id: "d12-e2", level: "gate", title: "GATE CS 2026 (forenoon), Q24 · 1 mark · MSQ: which positions are empty", file: "gate2026_fn_q24.txt", given: `Hash table P[0..10], open addressing with linear probing, h(x) = (x + 7) mod 11. Insert 1, 13, 22, 15, 11, 24.
Which of the positions 0, 10, 2, 1 are empty?`, find: "The empty positions.", steps: [
      { say: "1 → 8. 13 → 20 mod 11 = 9. 22 → 29 mod 11 = 7. 15 → 22 mod 11 = 0.", result: "slots 8, 9, 7, 0" },
      { say: "11 → 18 mod 11 = 7, taken; 8 taken; 9 taken; 10 free.", result: "slot 10" },
      { say: "24 → 31 mod 11 = 9, taken; 10 taken; 0 taken; 1 free.", result: "slot 1" },
      { say: "Filled: 0, 1, 7, 8, 9, 10. Of the four asked, only 2 is empty.", result: "2" },
    ], answer: "Only position 2", check: "The program in this chapter prints the table 15 24 -1 -1 -1 -1 -1 22 1 13 11." },
    { type: "example", id: "d12-e3", level: "gate", title: "GATE CS 2025 (forenoon), Q65 · 2 marks · NAT: double hashing", file: "gate2025_q65.txt", given: `Double hashing, m = 11, h1(k) = k mod 11, h2(k) = 1 + (k mod 7), probe i at (h1 + i·h2) mod 11. Insert 63, 50, 25, 79, 67, 24.
The slot at which 24 is stored?`, find: "The slot.", steps: [
      { say: "63 → 8, 50 → 6, 25 → 3, 79 → 2, 67 → 1 (all free at the first probe).", result: "slots 8 6 3 2 1" },
      { say: "24: h1 = 2 (taken), h2 = 1 + 3 = 4. Probe 1: (2 + 4) mod 11 = 6, taken.", result: "6 taken" },
      { say: "Probe 2: (2 + 8) mod 11 = 10, free.", result: "10" },
    ], answer: "10", check: "The program in this chapter prints 10." },
    { type: "example", id: "d12-e4", level: "easy", title: "GATE CS 2020 (forenoon), Q28 · 1 mark · NAT: probe 1 of a key", file: "gate2020_q28.txt", given: `Double hashing, h1(k) = k mod 23, h2(k) = 1 + (k mod 19), table size 23, probes numbered from 0. The address of probe 1 for k = 90?`, find: "The address.", steps: [
      { say: "h1(90) = 90 mod 23 = 21. h2(90) = 1 + (90 mod 19) = 1 + 14 = 15.", result: "h1 = 21, h2 = 15" },
      { say: "Probe 1 is (21 + 1 × 15) mod 23 = 36 mod 23.", result: "13" },
    ], answer: "13", check: "Probe 0 is 21; probe 2 would be (21 + 30) mod 23 = 5." },

    { type: "trap", wrong: "A hash table always searches in constant time.", tempting: "It computes the slot directly.", whyWrong: "Constant time is the AVERAGE with a good function and a table that is not too full. If all keys hash to one slot, chaining becomes a single list and probing walks the whole table: Θ(n) in the worst case.", rule: "Average Θ(1); worst case Θ(n).", ex: { code: "every key ≡ 3 (mod 11), chaining", out: "one chain of n keys" } },
    { type: "trap", wrong: "With linear probing a key that finds its slot taken goes to the slot with the next free number, without wrapping.", tempting: "The slots are numbered 0 to m − 1 in a line.", whyWrong: "The table is a ring: after the last slot the probe returns to slot 0. In the 2026 question, key 24 passes 9 and 10 and wraps to 0 before reaching the free slot 1.", rule: "Probe slots are taken mod m.", ex: { code: "m = 11, start at 9: 9, 10, 0, 1", out: "wrap after 10" } },

    { type: "gate", text: "GATE 2026 FN Q24, 2026 AN Q30, 2025 FN Q65 and 2020 FN Q28 are explained here. The questions on the average cost and on an adversary choosing keys (2023 FN Q20, 2022 FN Q16) are in the Algorithms book." },
    { type: "recall", cards: [
      { q: "What is a collision?", a: "Two different keys with the same slot." },
      { q: "Load factor?", a: "α = n / m, the keys divided by the slots." },
      { q: "Can chaining hold more keys than slots?", a: "Yes: α can exceed 1." },
      { q: "Can open addressing?", a: "No: α ≤ 1." },
      { q: "Linear probing sequence?", a: "h, h + 1, h + 2, … modulo m." },
      { q: "Double hashing probe i?", a: "(h₁(k) + i · h₂(k)) mod m." },
      { q: "Why a tombstone on deletion?", a: "An emptied slot would break the probe sequences of keys behind it." },
      { q: "Average and worst-case search?", a: "Θ(1) on average; Θ(n) in the worst case." },
      { q: "What is clustering?", a: "Runs of occupied slots that grow, making probes longer." },
      { q: "Does the order of insertion matter under probing?", a: "Yes: it decides the layout." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "h(k) = k mod 7, chaining. Keys 5, 12, 19, 26, 8 are inserted. What is the length of the longest chain?", answer: "4", solution: "5, 12, 19, 26 all give 5." },
      { id: "h2", kind: "NAT", marks: 1, q: "Linear probing, m = 10, h(k) = k mod 10. Keys 12, 22, 32 are inserted. In which slot does 32 go?", answer: "4", solution: "12 to 2, 22 to 3, 32 to 4." },
      { id: "h3", kind: "MCQ", marks: 1, q: "Which method can hold more keys than slots?", options: ["Linear probing", "Double hashing", "Chaining", "None"], answer: "C", solution: "Chains grow without limit." },
      { id: "h4", kind: "MCQ", marks: 1, q: "The worst-case search time of any hash table with n keys is", options: ["Θ(1)", "Θ(log n)", "Θ(n)", "Θ(n²)"], answer: "C", solution: "All keys in one slot." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["The load factor is n/m", "Chaining needs α ≤ 1", "Deleting from an open-addressed table needs a tombstone", "Average search is constant for a good table"], answer: "A, C, D", solution: "Chaining allows α > 1." },
      { id: "h6", kind: "NAT", marks: 2, q: "m = 7, linear probing, h(k) = k mod 7. Insert 15, 22, 8 in that order. Which slot does 8 get?", answer: "3", solution: "15 to 1, 22 to 1 taken so 2, 8 to 1 taken, 2 taken, so 3." },
      { id: "h7", kind: "NAT", marks: 2, q: "Double hashing, m = 7, h1(k) = k mod 7, h2(k) = 1 + (k mod 5). Key 8 finds slot 1 taken. In which slot does it go if that next probe is free? (probe 1)", answer: "5", solution: "h1 = 1, h2 = 1 + 3 = 4: (1 + 4) mod 7 = 5." },
      { id: "h8", kind: "NAT", marks: 2, q: "Linear probing, m = 5, h(k) = k mod 5. Keys 5, 10, 15 are inserted. How many probes does inserting 15 make in total, counting the slot it finally takes?", answer: "3", solution: "15 tries slot 0 (taken by 5), slot 1 (taken? 10 went to slot 1), then slot 2: three probes." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on hashing", sub: "Algorithms", href: "/topics/algorithms" }, { label: "The Data Structures book", sub: "back to the contents", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Arrays (D2)", "Linked lists (D3)", "Counting and growth (D1)"], usedIn: ["Algorithms: hashing"], cross: ["Algorithms: hashing, expected probes"] },
  ],
};
