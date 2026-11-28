import type { Topic } from "@/lib/study/schema";

/**
 * Algorithms chapter A3 "Hashing" (28 Nov 2026). The Data Structures chapter D12 is the short bridge; this chapter is the full treatment the official syllabus
 * assigns to Algorithms: the hash function, chaining and its expected cost, open addressing (linear, quadratic, double hashing, deletion), the expected number of
 * probes, and universal hashing against an adversary. Real GATE questions (texts from public/data/questions.json), each re-solved here:
 * 2026 FN Q24 (linear probing, h = (x + 7) mod 11, empty slots), 2026 AN Q30 (chaining, longest chain 3), 2025 FN Q65 (double hashing, key 24 in slot 10),
 * 2020 FN Q28 (probe 1 of key 90 is 13), 2022 FN Q16 (expected keys per slot n/m), 2023 FN Q20 (universal hashing against an adversary).
 * Programs compiled and run with gcc: the double-hashing table (63 50 25 79 67 24 to slots 8 6 3 2 1 10), the deletion bug (naive and tombstone), the chain lengths.
 */
export const chapterA3: Topic = {
  id: "cs.algo.v2.hash3",
  title: "Hashing",
  no: "A3",
  book: [
    { t: "p", text: "A hash table answers 'is this key present?' by **calculating** where it would be rather than searching for it. Done well, insert, search and delete each take a constant number of steps on average, however many keys are stored. This is the single most useful fact in practical programming, and in the paper it gives a steady stream of questions that are almost all tracing: fill a table by a stated rule and read off a slot." },
    { t: "p", text: "The official syllabus names hashing under Algorithms (in the line 'searching, sorting, hashing'), so this chapter is its full treatment. The earlier Data Structures chapter gave the picture and the two ways of handling collisions; here we add the cost analysis, the other probing rules, the problem of deletion, and universal hashing, which is the answer to a malicious opponent." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["insert keys into a table by chaining, linear probing, quadratic probing and double hashing, and read off the final layout;", "state the expected cost of a search for chaining and for open addressing in terms of the load factor;", "explain why a deleted slot must become a tombstone;", "say what a good hash function is and why a fixed function can be attacked;", "explain universal hashing and why it is the best defence against an adversary."] },

    { t: "h2", text: "The hash function and the load factor" },
    { t: "p", text: "A hash table is an array of m **slots**. A **hash function** h turns a key k into a slot number h(k) between 0 and m − 1. To store k we put it in slot h(k); to find it we look in slot h(k). Because there are far more possible keys than slots, two different keys can share a slot, and this is a **collision**. Every scheme is defined by its function and by its rule for collisions." },
    { t: "p", text: "The **division method** is h(k) = k mod m. It is fast, and it works well when m is a prime not close to a power of 2; if m were 2ᵖ, only the last p bits of the key would matter. The **multiplication method** is h(k) = ⌊m · (kA mod 1)⌋ for a constant A between 0 and 1 (a good choice is about 0.618): multiply, keep the fractional part, scale. It works well for any m." },
    { t: "p", text: "The **load factor** α = n/m measures how full the table is, where n is the number of stored keys. The cost of every operation rises with α, which is why real tables grow (and rehash) when α passes a limit such as 0.7." },
    { t: "p", text: "The standard model for analysis is **simple uniform hashing**: each key is equally likely to hash to any of the m slots, independently of the others. It is an assumption about the keys and the function together, and under it the expected number of keys in a slot is n/m = α. This is GATE 2022's question: even when the odd keys use one simple uniform function and the even keys use another, each key still lands in each slot with probability 1/m, so the expected number of keys in a slot is n/m." },
    { t: "ex", id: "a3-e1" },
    { t: "callout", kind: "key", text: "Load factor α = n / m. Simple uniform hashing: every key is equally likely to go to each of the m slots, so a slot holds α keys on average." },

    { t: "h2", text: "Chaining" },
    { t: "p", text: "In **chaining** each slot holds a linked list of the keys that hash to it. Insert puts the key at the front of its list in constant time. Search and delete scan the list of slot h(k). The table can hold more keys than slots, so α can be above 1." },
    { t: "p", text: "Under simple uniform hashing the list in the slot of the sought key has α keys on average. An **unsuccessful search** scans a whole list: about 1 + α steps (one to compute the hash, α to scan). A **successful search** stops on average about halfway through the list: about 1 + α/2 steps. If α is kept below a constant, both are Θ(1). In the worst case all n keys fall in one slot and a search scans n of them: Θ(n)." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    int chain[9] = {0}, longest = 0, ks[] = {5, 28, 19, 15, 26, 33, 12, 17, 10};
    for (int j = 0; j < 9; j++) {
        int b = ks[j] % 9;                      /* h(k) = k mod 9 */
        chain[b]++;
        if (chain[b] > longest) longest = chain[b];
    }
    printf("%d\\n", longest);
    return 0;
}`, out: "3", file: "chain_longest.c" },
    { t: "ex", id: "a3-e2" },
    { t: "p", text: "Chaining never fails and degrades gracefully, which is why it is the simplest scheme to reason about. Its costs are the pointer for every key and the poor use of the cache by linked lists." },

    { t: "h2", text: "Open addressing: the probe sequence" },
    { t: "p", text: "In **open addressing** every key lives in the table itself, with no lists. When the slot h(k) is taken, the key tries other slots in a fixed order, the **probe sequence** h(k, 0), h(k, 1), h(k, 2), …, until it finds a free slot. The table can never hold more than m keys, so α ≤ 1, and it must stay well below 1 for speed. Search follows the same sequence and stops at the key (success) or at an empty slot (failure)." },
    { t: "table", head: ["Scheme", "Probe i for key k", "Weakness"], rows: [
      ["Linear probing", "(h(k) + i) mod m", "primary clustering: long runs of full slots grow"],
      ["Quadratic probing", "(h(k) + c₁·i + c₂·i²) mod m", "secondary clustering: keys with the same h(k) follow the same path"],
      ["Double hashing", "(h₁(k) + i · h₂(k)) mod m", "needs h₂(k) coprime to m (for example m prime)"],
    ], caption: "The three probe sequences. Double hashing comes closest to ideal uniform hashing." },
    { t: "p", text: "**Linear probing** tries the next slot, then the next, wrapping from the last slot to slot 0. It is simple and fast on a modern machine, but it suffers from **primary clustering**: a run of occupied slots makes it likelier that the next key lands in or next to the run, and the run grows. **Quadratic probing** jumps by growing steps and breaks up the runs, but keys with the same first slot still follow identical paths. **Double hashing** makes the step depend on the key through a second function h₂, so keys with the same first slot generally follow different paths." },
    { t: "p", text: "A worked trace is the most valuable practice. GATE 2025 uses m = 11, h₁(k) = k mod 11 and h₂(k) = 1 + (k mod 7) and inserts 63, 50, 25, 79, 67, 24. The first five keys find their first slots free: 63 → 8, 50 → 6, 25 → 3, 79 → 2, 67 → 1. Key 24 has h₁ = 2, which is taken. Its step is h₂ = 1 + (24 mod 7) = 4. Probe 1 is (2 + 4) mod 11 = 6, taken. Probe 2 is (2 + 8) mod 11 = 10, free. Key 24 goes to slot 10." },
    { t: "fig", id: "a3-f1" },
    { t: "code", text: `#include <stdio.h>

#define M 11
int t[M];

int main(void) {
    int keys[] = {63, 50, 25, 79, 67, 24};
    for (int i = 0; i < M; i++) t[i] = -1;
    for (int j = 0; j < 6; j++) {
        int k = keys[j], h1 = k % 11, h2 = 1 + k % 7, s;
        for (int i = 0; ; i++) {
            s = (h1 + i * h2) % M;                    /* probe i */
            if (t[s] == -1) break;
        }
        t[s] = k;
        printf("%d->%d ", k, s);
    }
    printf("\\n");
    return 0;
}`, out: "63->8 50->6 25->3 79->2 67->1 24->10", file: "double_hash_table.c" },
    { t: "ex", id: "a3-e3" },
    { t: "ex", id: "a3-e4" },
    { t: "p", text: "Linear probing also appears in the 2026 question with h(x) = (x + 7) mod 11, inserting 1, 13, 22, 15, 11, 24, where the question asks which of the positions 0, 10, 2 and 1 are empty. The first four keys go to slots 8, 9, 7 and 0. Key 11 hashes to 7, finds 7, 8 and 9 taken, and lands in 10. Key 24 hashes to 9, finds 9, 10 and 0 taken (the probe **wraps round**), and lands in 1. The filled slots are 0, 1, 7, 8, 9 and 10; of the four asked, only position 2 is empty." },
    { t: "ex", id: "a3-e5" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Deletion: why a slot needs a tombstone" },
    { t: "p", text: "Deleting from a chained table is easy: unlink the node. Deleting from an open-addressed table is not. A key stored far from its home slot was placed there because every slot on its probe path was occupied at the time. If you empty one of those slots, the search for the far key stops at the now-empty slot and wrongly reports 'not found'." },
    { t: "code", text: `#include <stdio.h>

#define M 10
int t[M];

int find(int k) {
    for (int i = 0; i < M; i++) {
        int s = (k % M + i) % M;
        if (t[s] == -1) return 0;                 /* an empty slot ends the search */
        if (t[s] == k) return 1;
    }
    return 0;
}

int main(void) {
    for (int i = 0; i < M; i++) t[i] = -1;
    t[2] = 12;  t[3] = 22;                        /* 22 collided with 12 and moved to slot 3 */
    t[2] = -1;                                    /* naive delete of 12: back to empty */
    printf("naive: %s, ", find(22) ? "found" : "not found");
    t[2] = -2;                                    /* tombstone: not empty, not a key */
    printf("tombstone: %s\\n", find(22) ? "found" : "not found");
    return 0;
}`, out: "naive: not found, tombstone: found", file: "tombstone.c" },
    { t: "p", text: "The remedy is a **tombstone** (also called a deleted marker): the slot is marked 'deleted, but not empty'. Search treats it as occupied and keeps probing; insert may reuse it. Tombstones accumulate, so a table that has seen many deletions is periodically rebuilt. Chaining needs none of this." },

    { t: "h2", text: "How many probes? The expected cost" },
    { t: "p", text: "Assume the ideal model for open addressing: **uniform hashing**, where the probe sequence of each key is equally likely to be any of the m! orders of the slots. Then, for load factor α < 1, an **unsuccessful search** makes at most 1/(1 − α) probes on average: each probe finds an occupied slot with probability α, so the number of probes is a geometric variable with mean 1/(1 − α). A **successful search** makes at most (1/α) ln(1/(1 − α)) probes on average." },
    { t: "fig", id: "a3-f2" },
    { t: "p", text: "The figure shows what these formulas mean in practice. At α = 0.5 an unsuccessful search needs 2 probes on average and a successful one needs 1.39. At α = 0.9 an unsuccessful search needs 10 probes. The cost blows up as α approaches 1, which is why open addressing is run at a load factor well below 1, and why chaining, whose cost rises only linearly in α, is happy at α near 1." },
    { t: "p", text: "Linear probing is worse than uniform hashing because of clustering: for linear probing the expected probes are about ½(1 + 1/(1 − α)) for a successful search and ½(1 + 1/(1 − α)²) for an unsuccessful one. At α = 0.9 the unsuccessful search costs about 50 probes, against 10 for ideal hashing." },
    { t: "callout", kind: "key", text: "Chaining: unsuccessful 1 + α, successful about 1 + α/2. Open addressing with uniform hashing: unsuccessful ≤ 1/(1 − α), successful ≤ (1/α) ln(1/(1 − α)). Worst case of any scheme: Θ(n)." },
    { t: "p", text: "When a question asks for the **worst case** of a hash table operation, the answer is Θ(n), because every key may collide. When it asks for the **expected** case under simple uniform hashing, the answer is Θ(1 + α). The two words, 'worst' and 'expected', are the whole question." },
    { t: "trap", i: 1 },

    { t: "h2", text: "Choosing a good function, and the adversary" },
    { t: "p", text: "A good hash function spreads the keys evenly and uses every part of the key. Real keys are not random: keys that are multiples of 10 hashed with k mod 10 all land in slot 0. Choosing m prime, or hashing with the multiplication method, avoids many of the patterns that occur by accident." },
    { t: "p", text: "A different problem is an **adversary**: someone who knows your function and deliberately chooses keys that collide. Against a fixed function, such as k mod m or the multiplication method with a fixed constant A, an adversary can always find k > m keys that all hash to the same slot (by pigeonhole, some slot must receive at least k/m of any set of k keys, and the adversary simply picks that set). Then a search costs Θ(n)." },
    { t: "p", text: "**Universal hashing** is the defence. Instead of fixing one function, the algorithm picks **at random** from a family H of functions at the start of the run, so that for any two different keys x and y, the probability that a randomly chosen h in H sends them to the same slot is at most 1/m. The adversary does not know which function was chosen, so no set of keys is bad in advance. Whatever keys it sends, the expected number of collisions with any one key is at most n/m, and the expected search cost is Θ(1 + α) **for every input set**. This is GATE 2023's answer: against a malicious adversary the best strategy is universal hashing, not the division or the multiplication method (both fixed) and not a mixture of them chosen by a property of the keys." },
    { t: "ex", id: "a3-e6" },
    { t: "p", text: "A classic universal family for integer keys is h(k) = ((a·k + b) mod p) mod m, where p is a prime larger than every key and a ∈ {1, …, p − 1}, b ∈ {0, …, p − 1} are chosen at random once. The randomness is in the choice of the function, not in the later behaviour, so the same key always goes to the same slot during a run." },
    { t: "p", text: "A related idea is **dynamic hashing**, used for tables that grow on disk: the table is split on demand, using more bits of the hash (the 3rd and then 4th least significant bit in GATE 2021's version) only for the buckets that overflow. The questions on it give the bit rule and ask which insertion sequence could produce a given final shape; the method is to apply the rule key by key and see which sequences can build the picture." },

    { t: "h2", text: "Questions that come with a picture" },
    { t: "p", text: "The dynamic-hashing question of 2021 gives its final table as a picture: slot 00 empty, slot 01 with a tree of three keys, slot 10 with a tree of two keys and slot 11 with one key. It is solved here from that picture." },
    { t: "ex", id: "a3-e7" },
    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Hash table: slot = h(k); collisions are unavoidable; load factor α = n/m; simple uniform hashing gives α keys per slot.", "Chaining: a list per slot; unsuccessful search 1 + α, successful about 1 + α/2; α may exceed 1.", "Open addressing: probe sequence; α ≤ 1; linear probing (h + i), quadratic, double hashing (h₁ + i·h₂); the probe wraps mod m.", "Deletion in open addressing needs a tombstone; otherwise later keys on the path become unfindable.", "Open addressing with uniform hashing: unsuccessful ≤ 1/(1 − α), successful ≤ (1/α) ln(1/(1 − α)); the cost explodes near α = 1.", "Worst case is Θ(n); against an adversary use universal hashing: random choice of function, collision probability ≤ 1/m."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "a3-f1", caption: "The table of GATE 2025 after inserting 63, 50, 25, 79, 67 and 24 by double hashing. Key 24 wanted slot 2, then slot 6, and settled in slot 10.", alt: "A table of 11 slots: empty, 67, 79, 25, empty, empty, 50, empty, 63, empty, 24.", fig: { kind: "hashtable", title: "m = 11; h₁ = k mod 11; h₂ = 1 + k mod 7", slots: [
      { key: null }, { key: 67 }, { key: 79 }, { key: 25 }, { key: null }, { key: null }, { key: 50 }, { key: null }, { key: 63 }, { key: null }, { key: 24, tone: "hl" },
    ], probes: [2, 6, 10] } },
    { type: "figure", id: "a3-f2", caption: "Expected probes as the table fills (uniform hashing). Unsuccessful search 1/(1 − α) rises steeply; successful search is gentler; chaining's 1 + α is a straight line.", alt: "A table of load factors 0.25, 0.5, 0.75 and 0.9 against expected probes for three kinds of search.", fig: { kind: "trace", title: "Expected number of steps", cols: ["α", "chaining, unsuccessful 1 + α", "open addr., successful", "open addr., unsuccessful"], rows: [
      { cells: [0.25, 1.25, 1.15, 1.33] },
      { cells: [0.5, 1.5, 1.39, 2] },
      { cells: [0.75, 1.75, 1.85, 4] },
      { cells: [0.9, 1.9, 2.56, 10], tone: "bad", changed: [3] },
    ] } },

    { type: "example", id: "a3-e1", level: "gate", title: "GATE CS 2022 (forenoon), Q16 · 1 mark · expected keys per slot with two functions", file: "gate2022_fn_q16.txt", given: `n keys, m slots, two simple uniform hash functions h1 and h2. The scheme uses h1 for odd keys and h2 for even keys. The expected number of keys in a slot?
A) m/n   B) n/m   C) 2n/m   D) n/2m`, find: "The expected number of keys in a slot.", steps: [
      { say: "Each key, odd or even, is sent by a simple uniform function, so it lands in any given slot with probability 1/m.", result: "1/m" },
      { say: "By linearity of expectation the expected number of the n keys in one slot is n · (1/m).", result: "n/m" },
    ], answer: "B", check: "The split into odd and even changes nothing: only the probability per key matters." },
    { type: "example", id: "a3-e2", level: "gate", title: "GATE CS 2026 (afternoon), Q30 · 1 mark · NAT: the longest chain", file: "gate2026_an_q30.txt", given: `Keys 5, 28, 19, 15, 26, 33, 12, 17, 10 are inserted with h(k) = k mod 9, collisions by chaining. The length of the longest chain?`, find: "The longest chain.", steps: [
      { say: "Slots: 5→5, 28→1, 19→1, 15→6, 26→8, 33→6, 12→3, 17→8, 10→1.", result: "5 1 1 6 8 6 3 8 1" },
      { say: "Slot 1 holds 28, 19, 10: three. Slots 6 and 8 hold two each.", result: "3" },
    ], answer: "3", check: "The program in this chapter prints 3." },
    { type: "example", id: "a3-e3", level: "gate", title: "GATE CS 2025 (forenoon), Q65 · 2 marks · NAT: double hashing", file: "gate2025_fn_q65.txt", given: `m = 11, h1(k) = k mod 11, h2(k) = 1 + (k mod 7), probe i at (h1 + i·h2) mod 11. Insert 63, 50, 25, 79, 67, 24. The slot at which 24 is stored?`, find: "The slot.", steps: [
      { say: "63 → 8, 50 → 6, 25 → 3, 79 → 2, 67 → 1: all free at probe 0.", result: "8 6 3 2 1" },
      { say: "24: h1 = 2 (taken), h2 = 1 + 3 = 4. Probe 1: (2 + 4) mod 11 = 6, taken.", result: "6 taken" },
      { say: "Probe 2: (2 + 8) mod 11 = 10, free.", result: "10" },
    ], answer: "10", check: "The program in this chapter prints 24->10." },
    { type: "example", id: "a3-e4", level: "easy", title: "GATE CS 2020 (forenoon), Q28 · 1 mark · NAT: the address of probe 1", file: "gate2020_fn_q28.txt", given: `h1(k) = k mod 23, h2(k) = 1 + (k mod 19), table size 23, probes numbered from 0. The address of probe 1 for k = 90?`, find: "The address.", steps: [
      { say: "h1(90) = 90 mod 23 = 21. h2(90) = 1 + (90 mod 19) = 1 + 14 = 15.", result: "21 and 15" },
      { say: "Probe 1 = (21 + 1·15) mod 23 = 36 mod 23.", result: "13" },
    ], answer: "13", check: "Probe 0 is slot 21; probe 2 would be (21 + 30) mod 23 = 5." },
    { type: "example", id: "a3-e5", level: "gate", title: "GATE CS 2026 (forenoon), Q24 · 1 mark · MSQ: which positions are empty", file: "gate2026_fn_q24.txt", given: `P[0..10], open addressing with linear probing, h(x) = (x + 7) mod 11. Insert 1, 13, 22, 15, 11, 24. Which of the positions 0, 10, 2, 1 are empty?`, find: "The empty positions.", steps: [
      { say: "1 → 8; 13 → 20 mod 11 = 9; 22 → 29 mod 11 = 7; 15 → 22 mod 11 = 0.", result: "slots 8, 9, 7, 0" },
      { say: "11 → 18 mod 11 = 7: taken, 8 taken, 9 taken, 10 free.", result: "slot 10" },
      { say: "24 → 31 mod 11 = 9: taken, 10 taken, 0 taken (wrapped), 1 free.", result: "slot 1" },
      { say: "Filled: 0, 1, 7, 8, 9, 10. Of the four asked, only 2 is empty.", result: "2" },
    ], answer: "C only", check: "Without the wrap-round, key 24 would be misplaced." },
    { type: "example", id: "a3-e6", level: "gate", title: "GATE CS 2023 (forenoon), Q20 · 1 mark · the best strategy against an adversary", file: "gate2023_fn_q20.txt", given: `An algorithm stores k keys generated by a malicious adversary in a table of m slots, k > m. The best hashing strategy to counteract the adversary?
A) h(k) = k mod m   B) the multiplication method   C) universal hashing   D) division if k is prime, else multiplication`, find: "The best strategy.", steps: [
      { say: "A and B use ONE fixed function. An adversary who knows it can choose keys that all collide (by pigeonhole some slot gets k/m of any key set; the adversary picks that set).", result: "A, B attackable" },
      { say: "D only chooses between two fixed functions by a property of k; it is still deterministic.", result: "D attackable" },
      { say: "Universal hashing chooses the function at random from a family with collision probability ≤ 1/m, so no key set is bad in advance.", result: "C" },
    ], answer: "C", check: "The guarantee is on the expected cost, for every input set." },

    { type: "example", id: "a3-e7", level: "gate", title: "GATE CS 2021 (forenoon), Q49 · 2 marks · MSQ: dynamic hashing of 4-bit keys", file: "gate2021_fn_q49.txt", given: `Main table of size 4, indexed by the 2 least significant bits. A colliding bucket becomes a binary tree: the 3rd least significant bit splits left (0) and right (1), then the 4th. A split is made only on a collision.
Final state (picture): 00 empty; 01 a tree with a left leaf and a right node that splits into two leaves (three keys); 10 a node with two leaves (two keys); 11 one key.
Which insertion sequences can cause it?
A) 5, 9, 4, 13, 10, 7   B) 9, 5, 10, 6, 7, 1   C) 10, 9, 6, 7, 5, 13   D) 9, 5, 13, 6, 10, 14`, find: "The valid sequences.", steps: [
      { say: "What the picture requires: bucket 00 holds nothing, so no key may end in 00 (0, 4, 8, 12 are forbidden).", result: "no key ≡ 0 mod 4" },
      { say: "Bucket 01: the 3rd bit splits the keys; the right side splits again by the 4th bit, so two keys have bit 2 = 1 and differ in bit 3: 5 (0101) and 13 (1101). The left side has one key with bit 2 = 0: 1 (0001) or 9 (1001).", result: "5, 13 and one of 1, 9" },
      { say: "Bucket 10: one key with bit 2 = 0 (2 or 10) and one with bit 2 = 1 (6 or 14). Bucket 11: one key from 3, 7, 11, 15.", result: "two keys; one key" },
      { say: "A has 4 (ends in 00): no. B has 9, 5, 1 in bucket 01 (9 and 1 both have bit 2 = 0, so the left side would need a split) and no 13: no. D has 6 and 14 both with bit 2 = 1 in bucket 10, needing a further split, and nothing for bucket 11: no.", result: "A, B, D fail" },
      { say: "C: 10 and 6 go to bucket 10 and split on bit 2 (10 left, 6 right); 9 and 5 go to bucket 01 and split on bit 2 (9 left, 5 right); 13 joins 5 on the right, splitting on bit 3 (5 left, 13 right); 7 is alone in bucket 11. This is exactly the picture.", result: "C builds the state" },
    ], answer: "C", check: "In C the sequence ends with 13 splitting the right side of bucket 01, the only extra split in the picture." },

    { type: "trap", wrong: "With linear probing, a key whose slot is taken moves to the next higher slot and fails at the end of the table.", tempting: "The slots are numbered 0 to m − 1 in a line.", whyWrong: "The table is a ring: after slot m − 1 the probe returns to slot 0. In the 2026 question, key 24 passes slots 9 and 10 and wraps to 0 before finding slot 1 free.", rule: "Every probe slot is taken mod m.", ex: { text: "m = 11, key hashes to 9, slots 9, 10, 0 taken: next probe is slot 1." } },
    { type: "trap", wrong: "A hash table always searches in constant time.", tempting: "It computes the slot directly.", whyWrong: "Constant time is the EXPECTED cost under simple uniform hashing with a modest load factor. The worst case is Θ(n): all keys in one slot, or one probe sequence covering the whole table.", rule: "Expected Θ(1 + α); worst case Θ(n).", ex: { text: "Every key ≡ 3 (mod 11) with h = k mod 11: all keys in slot 3, a search scans all n." } },

    { type: "gate", text: "Real GATE questions solved in this chapter: 2026 FN Q24 · 2026 AN Q30 · 2025 FN Q65 · 2023 FN Q20 · 2022 FN Q16 · 2021 FN Q49 · 2020 FN Q28. Every hashing question of the bank is solved here." },
    { type: "recall", cards: [
      { q: "Load factor?", a: "α = n / m." },
      { q: "Simple uniform hashing?", a: "Each key is equally likely to go to each slot, independently." },
      { q: "Chaining: unsuccessful search?", a: "About 1 + α steps." },
      { q: "Linear probing sequence?", a: "(h(k) + i) mod m." },
      { q: "Double hashing probe i?", a: "(h₁(k) + i · h₂(k)) mod m." },
      { q: "Why a tombstone?", a: "An emptied slot would cut off keys that probed past it." },
      { q: "Open addressing, unsuccessful probes?", a: "At most 1 / (1 − α)." },
      { q: "Primary clustering belongs to?", a: "Linear probing." },
      { q: "Worst case of any hash table?", a: "Θ(n)." },
      { q: "Best defence against an adversary?", a: "Universal hashing: random choice of function." },
      { q: "Universal family property?", a: "For x ≠ y, Pr[h(x) = h(y)] ≤ 1/m." },
      { q: "Maximum α in open addressing?", a: "1: no more keys than slots." },
    ] },
    { type: "check", questions: [
      { id: "a3c1", kind: "NAT", marks: 1, q: "h(k) = k mod 7, chaining. Keys 5, 12, 19, 26, 8 are inserted. The length of the longest chain?", answer: "4", solution: "5, 12, 19, 26 all hash to slot 5." },
      { id: "a3c2", kind: "NAT", marks: 1, q: "m = 10, linear probing, h(k) = k mod 10. Keys 12, 22, 32 are inserted in that order. In which slot does 32 go?", answer: "4", solution: "12 → 2, 22 → 3, 32 → 4." },
      { id: "a3c3", kind: "MCQ", marks: 1, q: "Which scheme can hold more keys than slots?", options: ["Linear probing", "Double hashing", "Chaining", "Quadratic probing"], answer: "C", solution: "Chains grow without limit." },
      { id: "a3c4", kind: "MSQ", marks: 2, q: "Which statements are true?", options: ["Open addressing needs α ≤ 1", "Deleting from an open-addressed table can simply empty the slot", "Universal hashing chooses its function at random", "The worst-case search in a chained table is Θ(n)"], answer: "A, C, D", solution: "B is false: an emptied slot breaks the probe path of later keys." },
      { id: "a3c5", kind: "NAT", marks: 2, q: "Open addressing, uniform hashing, α = 0.75. At most how many probes does an unsuccessful search make on average (1/(1 − α))?", answer: "4", solution: "1 / 0.25 = 4." },
      { id: "a3c6", kind: "NAT", marks: 2, q: "m = 7, h₁(k) = k mod 7, h₂(k) = 1 + (k mod 5). Key 8 finds slot 1 taken. In which slot does probe 1 put it?", answer: "5", solution: "h₂ = 1 + 3 = 4; (1 + 4) mod 7 = 5." },
      { id: "a3c7", kind: "MCQ", marks: 2, q: "n = 200 keys in a chained table of m = 100 slots under simple uniform hashing. The expected number of steps of an unsuccessful search (1 + α) is", options: ["1", "2", "3", "200"], answer: "C", solution: "α = 2; 1 + 2 = 3." },
      { id: "a3c8", kind: "NAT", marks: 2, q: "m = 5, linear probing, h(k) = k mod 5. Keys 5, 10, 15 are inserted in that order. In which slot does 15 end up?", answer: "2", solution: "5 → 0, 10 → 0 taken so 1, 15 → 0, 1 taken, so 2." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on hashing", sub: "Algorithms", href: "/topics/algorithms" }, { label: "Hashing: a short bridge", sub: "Data Structures D12", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Arrays (D2)", "Linked lists (D3)", "Asymptotics (A1)"], usedIn: ["Compiler Design: symbol tables", "Databases: hash indexes"], cross: ["Data Structures: hashing bridge (D12)"] },
  ],
};
