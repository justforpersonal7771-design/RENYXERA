import type { Topic } from "@/lib/study/schema";

/**
 * Computer Organisation chapter O4 "Cache memory" (29 Nov 2026). Locality and the memory hierarchy, blocks and the address split (tag, index, offset), direct-mapped, set-associative and fully associative
 * placement, replacement (LRU), write policies (write through, write back, allocate), the average memory access time with one and two levels, and the miss-penalty and bandwidth questions.
 * Real GATE questions (texts from public/data/questions.json), each re-solved here, 27 in all: 2026 FN Q38 (A), 2026 AN Q52 (A,B), Q56 (128 KB), 2025 FN Q36 (A), Q53 (11.85), 2025 AN Q39 (A), Q55 (4.0),
 * 2024 FN Q41 (B,C), Q56 (3.00), 2023 FN Q64 (19), 2022 FN Q24 (A,B,D), Q33 (0.85), Q54 (A,B,D), 2021 FN Q51 (17), 2021 AN Q65 (2), Q39 (A), 2020 FN Q27 (13.5), Q55 (B), 2019 FN Q11 (D), Q60 (160),
 * 2018 FN Q44 (B), 2017 FN Q20 (0.05), Q53 (76), Q65 (14), 2017 AN Q47 (A), Q39 (4.72), Q36 (18).
 * Programs compiled and run with gcc: the tag-bit formula; a cache simulator for the P, Q, R, S questions; the 2017 conflict-miss count; the access-time formulas; the largest cache of the 2026 question.
 */
export const chapterO4: Topic = {
  id: "cs.coa.v2.cache4",
  title: "Cache memory",
  no: "O4",
  book: [
    { t: "p", text: "A processor can execute an instruction in a fraction of a nanosecond, but a read from the main memory (DRAM) takes tens of nanoseconds. If every instruction waited for the memory, the processor would spend nearly all its time idle. The cure is a small, fast memory placed between the two: the **cache**. It keeps copies of the memory words the program is likely to need soon, and most accesses are then answered at the speed of the cache." },
    { t: "p", text: "Cache memory is the largest topic of Computer Organisation in GATE: 27 real questions, more than a third of the subject. They fall into three families, and the whole chapter is organised around them: **counting address bits** (the tag, index and offset fields), **tracing a sequence of accesses** (which ones hit, which are evicted), and **computing the average access time**. A fourth, smaller family asks about the write policies in words." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["explain why caches work (temporal and spatial locality);", "split an address into tag, index and block offset for a direct-mapped, a set-associative and a fully associative cache, and count the bits;", "work out which set an address maps to;", "trace an access sequence and count hits, misses and conflict misses under LRU;", "state what write through, write back, write allocate and no-write allocate do;", "compute the average memory access time for one and two cache levels, and the speedup from a better cache."] },

    { t: "h2", text: "Locality and the memory hierarchy" },
    { t: "p", text: "Programs do not touch memory at random. They show two kinds of **locality**. **Temporal locality**: a word used now is likely to be used again soon (a loop counter, an instruction in a loop). **Spatial locality**: a word near the one used now is likely to be used soon (the next element of an array, the next instruction). A cache exploits both: it keeps recently used words (temporal) and it always loads a whole **block** of neighbouring words, not a single word (spatial)." },
    { t: "p", text: "The memory hierarchy has registers at the top (fastest, smallest, costliest per byte), then the L1, L2 and sometimes L3 caches, then the main memory, then the disk at the bottom (slowest, largest, cheapest). Each level holds a subset of the one below it, and the trick is that the average access time of the whole system comes out close to the fastest level, while the cost per byte comes out close to the cheapest." },
    { t: "p", text: "When the processor asks for a word, the cache is searched. If the word is there, it is a **hit** and the cost is the **hit time** (the cache access time). If it is not, it is a **miss**: the block holding the word is fetched from the next level, at the cost of the **miss penalty**, and then the word is delivered. The **hit ratio** (hit rate) is the fraction of accesses that hit; the miss ratio is 1 minus that." },
    { t: "callout", kind: "key", text: "Hit: the word is in the cache. Miss: fetch the whole block from the next level. Locality makes the hit ratio high; the average access time = hit time + miss ratio × miss penalty." },

    { t: "h2", text: "Blocks and the address split" },
    { t: "p", text: "The cache is divided into **lines** (or **blocks**) of equal size, a power of two number of bytes. The main memory is divided into blocks of the same size. A memory block can be placed only in certain lines of the cache, depending on the organisation, and each cache line stores the block's data plus a **tag**, which says which memory block currently lives there, and a **valid bit**, which says the line holds something." },
    { t: "p", text: "To find a word, the address is cut into three fields. The low bits are the **block offset**: they pick the byte inside the block, so a block of B bytes needs log₂ B offset bits. The next bits are the **index**: they pick the line (or the set of lines) in the cache. The remaining high bits are the **tag**: stored with the line and compared with the address to tell whether the right block is there." },
    { t: "table", head: ["Organisation", "A block can go in", "Index bits", "Comparators"], rows: [
      ["Direct mapped", "exactly one line", "log₂ (number of lines)", "1"],
      ["K-way set associative", "any of K lines of one set", "log₂ (number of sets)", "K"],
      ["Fully associative", "any line", "0", "all lines"],
    ], caption: "The three placements. Direct mapped and fully associative are the two ends of the set-associative family: K = 1 and K = number of lines." },
    { t: "p", text: "The counts follow from the sizes. With a cache of C bytes, blocks of B bytes and K ways, the number of lines is C ÷ B and the number of sets is C ÷ (B × K). The offset has log₂ B bits, the index has log₂ (sets) bits, and the tag takes what remains of the address: **tag = address bits − index bits − offset bits**." },
    { t: "fig", id: "o4-f1" },
    { t: "code", text: `#include <stdio.h>
#include <math.h>

/* tag bits = address bits - log2(sets) - log2(block), sets = cache / (block * ways) */
static int tag_bits(int addr_bits, double cache, double block, double ways) {
    double sets = cache / (block * ways);
    return addr_bits - (int)log2(sets) - (int)log2(block);
}

int main(void) {
    printf("%d ", tag_bits(32, 32 * 1024, 64, 1));        /* GATE 2021 FN Q51: 32 KB direct mapped, 64-byte blocks */
    printf("%d ", tag_bits(32, 512.0 * 32, 32, 1));       /* GATE 2017 AN Q36: 512 lines of 32 bytes */
    printf("%d ", tag_bits(32, 64 * 1024, 64, 8));        /* GATE 2023 FN Q64: 64 KB 8-way (the block size cancels) */
    printf("%d\\n", tag_bits(32, 16 * 1024, 16, 1024));    /* GATE 2019 FN Q11: fully associative, 1024 lines */
    return 0;
}`, out: "17 18 19 28", file: "tag_bits.c" },

    { t: "h2", text: "Counting tag, index and offset bits" },
    { t: "p", text: "**Direct mapped.** GATE 2021: 2³² bytes of memory (a 32-bit address), a 32 KB cache, 64-byte blocks. The cache has 32 KB ÷ 64 = 512 lines, so the index is 9 bits; the offset is 6 bits; the tag is 32 − 9 − 6 = **17 bits**. Equivalently: the index and offset together span the whole cache, 15 bits (2¹⁵ = 32 KB), so the tag is 32 − 15 = 17. That shortcut avoids the block size: the **tag of a direct-mapped cache is the address bits minus log₂ (cache size)**. GATE 2017 AN: 512 lines of 32 bytes is 16 KB, 14 bits, so the tag is 32 − 14 = **18**." },
    { t: "ex", id: "o4-e1" },
    { t: "p", text: "The count can go the other way, from the fields to the sizes. GATE 2025 AN: a direct-mapped cache with a 4-bit tag, a 12-bit index and one-byte blocks. The address has 4 + 12 + 0 = 16 bits, so the memory has 2¹⁶ = 64 KB; the cache has 2¹² lines of 1 byte = 4 KB. That is **option A** (64 KB and 4 KB)." },
    { t: "p", text: "GATE 2025 FN asks for the total number of bits needed to store **all the tag values**: 1 M of memory (20-bit address), a 16 KB direct-mapped cache, 16-byte blocks. The cache has 1024 lines; the index is 10 bits, the offset 4, the tag 20 − 14 = 6 bits. Every line stores one tag, so the total is 1024 × 6 = **6 × 2¹⁰ bits** (option A)." },
    { t: "ex", id: "o4-e2" },
    { t: "p", text: "A hard version asks for the **largest** cache that is consistent with one observation. GATE 2026 AN: a 1 MB memory (20-bit addresses), a direct-mapped cache, and the byte at 0xA2C28 lands in cache block number 176. The block size and the number of blocks are unknown. For a block of 2^o bytes and 2^i lines the block number is (address >> o) mod 2^i. Trying every split with o + i ≤ 20 and 2^i > 176, the largest cache with block number 176 has o + i = 17 bits (o = 6 and i = 11), so the cache is 2¹⁷ bytes = **128 KB**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    long addr = 0xA2C28;                  /* a 20-bit address in a 1 MB memory */
    int best = 0;
    for (int o = 0; o <= 20; o++)         /* offset bits */
        for (int i = 8; o + i <= 20; i++) /* index bits; 176 needs at least 8 */
            if (((addr >> o) & ((1L << i) - 1)) == 176 && o + i > best) best = o + i;
    printf("%d %ld\\n", best, (1L << best) / 1024);   /* bits of cache, and its size in KB */
    return 0;
}`, out: "17 128", file: "largest_cache.c" },
    { t: "ex", id: "o4-e3" },

    { t: "h2", text: "Set-associative and fully associative caches" },
    { t: "p", text: "A direct-mapped cache is simple, but two blocks that share an index keep evicting each other even when the rest of the cache is empty. A **set-associative** cache lets a block go in any of K lines of its set. With K ways the number of sets is the number of lines divided by K, so the index shrinks by log₂ K bits and the **tag grows by log₂ K bits**. A **fully associative** cache has one set containing every line: no index, and the tag is the address minus the offset." },
    { t: "p", text: "The general formula, which GATE 2018 asks for in symbols: the address has P bits, the word is 2^W bytes, the cache has 2^N bytes, the block is 2^M words, and the cache is K-way. The offset is M + W bits, the number of sets is 2^N ÷ (2^(M+W) × K), so the index is N − M − W − log₂ K bits, and the tag is P − (N − M − W − log₂ K) − (M + W) = **P − N + log₂ K**. That is option B. The block size cancels, as in the shortcut: for a K-way cache, the tag is the address bits minus log₂ (cache size) plus log₂ K." },
    { t: "ex", id: "o4-e4" },
    { t: "p", text: "Use the formula both ways. GATE 2026 FN: a 2³²-byte space and a 2²³-byte cache. Direct mapped: the tag M = 32 − 23 = 9. K-way with K = 2^L: N = 32 − 23 + L = 9 + L, so **N = M + L** (option A). GATE 2023: a 64 KB 8-way cache and a 32-bit address; the tag is 32 − 16 + 3 = **19**, whatever the block size. GATE 2019: a fully associative 16 KB cache with 16-byte blocks and a 32-bit address; there is no index, the offset is 4, so the tag is **28** and the index is **0** (option D)." },
    { t: "p", text: "GATE 2017 AN: with a direct-mapped cache the tag is 10 bits; the cache is redesigned as 16-way. The index loses log₂ 16 = 4 bits and the tag gains them: **14 bits**. And GATE 2021 AN asks the associativity: a 2 KB cache, 64-byte blocks (32 lines), a 32-bit address and a 22-bit tag. The offset is 6, so the index is 32 − 22 − 6 = 4 bits, 16 sets, so the associativity is 32 ÷ 16 = **2**." },
    { t: "ex", id: "o4-e5" },
    { t: "ex", id: "o4-e6" },

    { t: "h2", text: "Which set does an address map to" },
    { t: "p", text: "To place an address, write it in binary, drop the offset bits, and read the index bits: that is the set number. Two addresses that give the same set number compete for the same lines. This is a bit-slicing exercise, and the quick way in hexadecimal is to count which hex digits the index covers." },
    { t: "p", text: "GATE 2020: 16 MB memory (24-bit addresses), a 64 KB 4-way cache, 256-byte blocks. There are 64 KB ÷ (256 × 4) = 64 sets: 6 index bits, 8 offset bits, so the index is bits 13 down to 8 of the address, that is the low six bits of the second hex digit pair from the right. For the four addresses: 0x42C8A4 has middle byte 0xC8 = 1100 1000, low six bits 001000 = set 8; 0x546888 has 0x68 = 0110 1000, low six bits 101000 = set 40; 0x6A289C has 0x28 = 0010 1000, low six bits 101000 = set 40; 0x5E4880 has 0x48 = 0100 1000, low six bits 001000 = set 8. So A2 and A3 share set 40: **option B**; A1 and A4 share set 8, so option A is false." },
    { t: "fig", id: "o4-f2" },
    { t: "ex", id: "o4-e7" },

    { t: "h2", text: "Replacement and tracing a sequence" },
    { t: "p", text: "When a block must be placed in a full set, the cache evicts one. **LRU** (least recently used) evicts the line that has gone unused longest; **FIFO** evicts the oldest arrival; random evicts any. LRU follows temporal locality and is the one the paper uses." },
    { t: "p", text: "Misses come in three kinds. A **compulsory** (cold) miss is the first access to a block: it cannot be avoided. A **capacity** miss happens because the cache is too small to hold the working set. A **conflict** miss happens because too many blocks map to one set, even though the cache has room elsewhere. A direct-mapped cache has the most conflicts; a fully associative one has none." },
    { t: "p", text: "Tracing is the dependable method: write down the set of each access, keep the contents of each set, and apply the replacement rule. GATE 2026 AN uses a 4 KB direct-mapped cache with 16-byte blocks in a 16 MB memory, so there are 256 sets, 4 offset bits and 8 index bits. The four addresses are P = 0x845B32, Q = 0x845B26, R = 0x845B36, S = 0x846B32. P, Q, R and S have the sets 0xB3, 0xB2, 0xB3 and 0xB3. P and R are in the same block (0x845B3) and S is a different block of the same set; Q is alone in its set." },
    { t: "p", text: "In the first round P misses, Q misses, R **hits** (P loaded its block), S misses and evicts that block. From the second round, P misses (S evicted it) and R hits (P has just reloaded the block); S misses again. Q hits every time after the first. So **every P access misses (A)**, **every R access hits (B)**, Q does not always miss (C false) and S never hits (D false). The answer is **A, B**." },
    { t: "p", text: "GATE 2022 has a 2 KB direct-mapped cache with 64-byte blocks (32 sets), a 64 KB space, and P = 0xA248, Q = 0xC28A, R = 0xCA8A, S = 0xA262. The sets are 9, 10, 10 and 9. P and S are in the same block, Q and R compete for set 10. P misses first; S then hits and every later P and S hits and P is never evicted (A and B true). Q and R evict each other in every round: R evicts Q and Q evicts R (D true). At the end the cache holds the block of P and S as well as R, so C, which says only R and S reside, is false. The answer is **A, B, D**." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

static long tags[256][4];
static int valid[256][4], used[256][4], clk;

static int access_block(long addr, int offbits, int sets, int ways) {
    long block = addr >> offbits;
    int s = (int)(block % sets);
    for (int w = 0; w < ways; w++)
        if (valid[s][w] && tags[s][w] == block) { used[s][w] = ++clk; return 1; }   /* hit */
    int victim = 0;
    for (int w = 0; w < ways; w++) {
        if (!valid[s][w]) { victim = w; break; }
        if (used[s][w] < used[s][victim]) victim = w;                                /* least recently used */
    }
    valid[s][victim] = 1; tags[s][victim] = block; used[s][victim] = ++clk;
    return 0;
}

static void run(const long a[4], int offbits, int sets) {
    int hits[4] = {0, 0, 0, 0};
    memset(valid, 0, sizeof valid);
    for (int rep = 0; rep < 10; rep++)
        for (int k = 0; k < 4; k++) hits[k] += access_block(a[k], offbits, sets, 1);
    printf("P %d Q %d R %d S %d\\n", hits[0], hits[1], hits[2], hits[3]);
}

int main(void) {
    long g26[4] = {0x845B32, 0x845B26, 0x845B36, 0x846B32};
    long g22[4] = {0xA248, 0xC28A, 0xCA8A, 0xA262};
    run(g26, 4, 256);                       /* 4 KB, 16-byte blocks: GATE 2026 AN Q52 */
    run(g22, 6, 32);                        /* 2 KB, 64-byte blocks: GATE 2022 FN Q54 */
    return 0;
}`, out: "P 0 Q 9 R 10 S 0\nP 9 Q 0 R 0 S 10", file: "cache_trace.c" },
    { t: "ex", id: "o4-e8" },
    { t: "ex", id: "o4-e9" },
    { t: "fig", id: "o4-f3" },
    { t: "p", text: "GATE 2017 counts the **conflict misses** for a 2-way cache with 256 blocks (128 sets) and LRU, on a repeated sequence of memory blocks. The blocks 0, 128 and 256 all map to set 0 and 1, 129 and 257 to set 1, and each set holds only two of its three blocks. The sequence (0, 128, 256, 128, 0, 128, 256, 128, 1, 129, 257, 129, 1, 129, 257, 129) is repeated 10 times. The program simulates it. It prints 82 misses in all; of these, 6 are compulsory (the six distinct blocks), so the conflict misses are 82 − 6 = **76**." },
    { t: "code", text: `#include <stdio.h>
#include <string.h>

int main(void) {
    int seq[16] = {0, 128, 256, 128, 0, 128, 256, 128, 1, 129, 257, 129, 1, 129, 257, 129};
    int tag[128][2], used[128][2], valid[128][2], clk = 0, seen[300];
    int misses = 0, compulsory = 0;
    memset(valid, 0, sizeof valid); memset(seen, 0, sizeof seen);
    for (int rep = 0; rep < 10; rep++)
        for (int k = 0; k < 16; k++) {
            int b = seq[k], s = b % 128, hit = 0;
            for (int w = 0; w < 2; w++)
                if (valid[s][w] && tag[s][w] == b) { used[s][w] = ++clk; hit = 1; }
            if (hit) continue;
            misses++;
            if (!seen[b]) { seen[b] = 1; compulsory++; }
            int v = 0;
            for (int w = 0; w < 2; w++) {
                if (!valid[s][w]) { v = w; break; }
                if (used[s][w] < used[s][v]) v = w;
            }
            valid[s][v] = 1; tag[s][v] = b; used[s][v] = ++clk;
        }
    printf("%d %d %d\\n", misses, misses - compulsory, compulsory);
    return 0;
}`, out: "82 76 6", file: "conflict_misses.c" },
    { t: "ex", id: "o4-e10" },
    { t: "trap", i: 0 },

    { t: "h2", text: "Write policies" },
    { t: "p", text: "A read can be served by any copy, but a **write** must keep the cache and the memory consistent. There are two policies for a write that hits. **Write through** sends every write to the main memory as well as the cache: memory is always up to date, so a line never needs to be written back, and there is **no dirty bit**; the cost is a lot of memory traffic (a write buffer hides some of it). **Write back** writes only the cache and sets the line's **dirty bit**; the memory is updated only when the dirty line is **evicted**. It saves traffic, since many writes to the same block cost one memory write." },
    { t: "p", text: "There are also two policies for a write that **misses**. **Write allocate** loads the block into the cache and then writes it (good when the block will be used again). **No-write allocate** writes straight to the memory and does not load the block. The usual pairings are write back with write allocate, and write through with no-write allocate, but they are habits, not rules: any pair is possible." },
    { t: "table", head: ["", "Write through", "Write back"], rows: [
      ["A write hit goes to", "cache and memory", "cache only (dirty bit set)"], ["Dirty bit", "none", "one per line"],
      ["Eviction of a line", "never writes to memory", "writes to memory if dirty"], ["Read miss can evict a dirty line", "no (none are dirty)", "yes"],
      ["Memory traffic", "high", "low"],
    ], caption: "Write through against write back." },
    { t: "p", text: "These statements are the questions. GATE 2022 asks which statements about a write-back cache WB and a write-through cache WT are **false**: 'each block in WB and WT has a dirty bit' is false (WT has none); 'every write hit in WB leads to a transfer to memory' is false (only the eviction does); 'eviction of a block from WT does not lead to a transfer to memory' is true; 'a read miss in WB never evicts a dirty block' is false. The false statements are **A, B, D**." },
    { t: "p", text: "GATE 2024 asks which are true: 'a read miss in WBC never evicts a dirty block' is false; 'a read miss in WTC never triggers a write back to memory' is **true**; 'a write hit in WBC can change the dirty bit' is **true** (a clean line becomes dirty); 'a write miss in WTC always writes the victim to memory' is false. The answer is **B, C**. GATE 2021 AN: S₁, 'read misses in a write-through L1 do not result in write backs of dirty lines to L2', is true because the cache has no dirty lines; S₂, 'write allocate must be used with write through, and no-write allocate with write back', is false because it says *must*. The answer is **S₁ true, S₂ false (A)**." },
    { t: "ex", id: "o4-e11" },
    { t: "ex", id: "o4-e12" },

    { t: "h2", text: "Average memory access time" },
    { t: "p", text: "The **average memory access time** (AMAT) of one cache level is the hit time plus the miss ratio times the miss penalty: **AMAT = t_hit + m × t_penalty**. Some questions give the miss time as the full time of a miss path instead; then AMAT = h × t_hit + (1 − h) × t_miss. Read which one the question gives. Both forms agree when t_miss = t_hit + t_penalty." },
    { t: "p", text: "GATE 2022 asks the hit rate needed after an optimisation. The cache has a hit rate of 0.8, a latency of 10 ns and a miss penalty of 100 ns, so AMAT = 10 + 0.2 × 100 = 30 ns. After the optimisation the latency is 15 ns, and the AMAT must not rise: 15 + (1 − h) × 100 ≤ 30, so 1 − h ≤ 0.15, and the minimum hit rate is **0.85**." },
    { t: "p", text: "When the miss penalty is a block transfer, count its parts. GATE 2020: a 1 MB direct-mapped cache, 256-byte blocks, a 64-bit (8-byte) word, an access time of 3 ns and a hit rate of 94%. A block has 256 ÷ 8 = 32 words; a miss takes 20 ns for the first word and 5 ns for each of the other 31: 20 + 31 × 5 = 175 ns. AMAT = 3 + 0.06 × 175 = **13.5 ns** (the key accepts 13.3 to 13.5, since 13.3 treats the 175 ns as the whole miss time)." },
    { t: "ex", id: "o4-e13" },
    { t: "p", text: "With **two levels** the miss penalty of L1 is itself the average time of L2: AMAT = t_L1 + m₁ × (t_L2 + m₂ × t_memory). The miss ratios used here are **local** ones: m₂ is the fraction of the L1 misses that L2 also misses. GATE 2025 AN: L1 is 1 ns with a 90% hit rate; L2 has a miss penalty of 10 ns to L1 and a hit rate of 80%; memory costs 100 ns to L2. AMAT = 1 + 0.1 × (10 + 0.2 × 100) = 1 + 0.1 × 30 = **4.0 ns**." },
    { t: "p", text: "GATE 2025 FN gives the access times already including the lower penalties: L1 has a 95% hit rate at 10 ns, L2 an 85% hit rate at 20 ns (including the L1 miss penalty), and memory 200 ns (including both). Then AMAT = 0.95 × 10 + 0.05 × (0.85 × 20 + 0.15 × 200) = 9.5 + 0.05 × 47 = **11.85 ns**. The two ways of writing the formula give the same answer when the times are read as the question defines them." },
    { t: "fig", id: "o4-f4" },
    { t: "p", text: "Separate instruction and data caches mix two hit ratios. GATE 2017 AN: the I-cache is 2 ns with 0.8 hits, the D-cache 2 ns with 0.9 hits, L2 8 ns with 0.9 hits, memory 90 ns; 60% of the reads are instruction fetches and 40% are operand fetches. Instructions: 2 + 0.2 × (8 + 0.1 × 90) = 5.4 ns; data: 2 + 0.1 × (8 + 9) = 3.7 ns. The average is 0.6 × 5.4 + 0.4 × 3.7 = **4.72 ns**." },
    { t: "p", text: "A miss rate may have to be found from the others. GATE 2017 AN Q47: L1 takes 1 cycle, L2 takes 8, memory costs 18 more cycles, and the L1 miss rate m₁ is twice the L2 miss rate m₂; the AMAT is 2 cycles. Then 2 = 1 + 2 m₂ (8 + 18 m₂), which is 36 m₂² + 16 m₂ − 1 = 0, and m₂ = (−16 + 20) ÷ 72 = 0.056, m₁ = 0.111: **option A**." },
    { t: "p", text: "GATE 2017 FN asks the L2 miss rate from counts: 1.4 memory accesses per instruction, an L1 miss rate of 0.1, and 7 L2 misses per 1000 instructions. The L1 misses per instruction are 1.4 × 0.1 = 0.14, and L2 sees 0.14 accesses per instruction and misses 0.007 of them, so the L2 (local) miss rate is 0.007 ÷ 0.14 = **0.05**." },
    { t: "code", text: `#include <stdio.h>

int main(void) {
    double a = 0.95 * 10 + 0.05 * (0.85 * 20 + 0.15 * 200);          /* GATE 2025 FN Q53 */
    double b = 1 + 0.1 * (10 + 0.2 * 100);                            /* GATE 2025 AN Q55 */
    double i = 2 + 0.2 * (8 + 0.1 * 90), d = 2 + 0.1 * (8 + 0.1 * 90);
    double c = 0.6 * i + 0.4 * d;                                     /* GATE 2017 AN Q39 */
    double e = 3 + 0.06 * (20 + 31 * 5);                              /* GATE 2020 FN Q27 */
    printf("%.2f %.2f %.2f %.2f\\n", a, b, c, e);
    return 0;
}`, out: "11.85 4.00 4.72 13.50", file: "amat.c" },
    { t: "ex", id: "o4-e14" },
    { t: "ex", id: "o4-e15" },
    { t: "ex", id: "o4-e16" },
    { t: "p", text: "The CPI form of the same idea is the memory-stall question. GATE 2024 FN: 25% of the instructions are loads or stores, the ideal CPI is 2, the instruction cache misses 2% of the time, the data cache 8%, and the penalty is 100 cycles. Every instruction is fetched, and only 25% access data, so the stall per instruction is 0.02 × 100 + 0.25 × 0.08 × 100 = 2 + 2 = 4 cycles. The real CPI is 6; the speedup with a perfect cache is 6 ÷ 2 = **3.00**." },
    { t: "p", text: "Finally the bandwidth question. GATE 2019: the block is 8 words of 4 bytes (32 bytes), the memory system has a 60 MHz clock, and a miss costs 1 cycle to accept the address, 3 cycles to fetch the block, and 8 cycles to send the eight words at one per cycle: 12 cycles for 32 bytes. The maximum bandwidth is 32 bytes ÷ (12 ÷ 60 × 10⁶ s) = **160 × 10⁶ bytes per second**." },
    { t: "ex", id: "o4-e17" },
    { t: "ex", id: "o4-e18" },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["Locality (temporal and spatial) makes caches work; a miss loads a whole block.", "Address = tag | index | offset. Offset = log₂ block; index = log₂ sets; tag = the rest. Direct mapped: tag = address − log₂ cache size.", "K-way: sets = cache ÷ (block × K); the tag grows by log₂ K. Fully associative: no index.", "Which set: drop the offset bits, read the index bits. Same set number means competing blocks.", "Trace with LRU, set by set; separate compulsory misses (first use) from conflict misses.", "Write through: no dirty bit, memory always current. Write back: dirty bit, write on eviction. Write allocate loads the block on a write miss.", "AMAT = t_hit + miss ratio × penalty; two levels nest: t₁ + m₁ (t₂ + m₂ t_mem), with local miss ratios.", "Memory stall CPI: every instruction fetches, only loads and stores access data."] },
    { t: "gate" },
  ],
  blocks: [
    { type: "figure", id: "o4-f1", caption: "A 32-bit address cut for a 32 KB direct-mapped cache with 64-byte blocks (GATE 2021 FN Q51): 6 offset bits, 9 index bits, 17 tag bits.", alt: "A row of 32 address bits split into 17 tag bits, 9 index bits and 6 offset bits.", fig: { kind: "bits", title: "Address of a 32 KB direct-mapped cache, 64-byte blocks", weights: false, group: 8, rows: [
      { label: "tag (17)", bits: "11111111111111111", tone: "ok" }, { label: "index (9)", bits: "000000000" }, { label: "offset (6)", bits: "000000" },
    ] } },
    { type: "figure", id: "o4-f2", caption: "The four addresses of GATE 2020 FN Q55. The index is bits 13 to 8; the middle byte gives the set from its low six bits. A2 and A3 meet in set 40; A1 and A4 meet in set 8.", alt: "A table that gives, for each of the four addresses, the middle byte, the six index bits and the set number.", fig: { kind: "trace", title: "64 KB, 4-way, 256-byte blocks: 64 sets", cols: ["address", "middle byte", "index (6 bits)", "set"], rows: [
      { cells: ["A1 = 0x42C8A4", "0xC8", "001000", 8] }, { cells: ["A2 = 0x546888", "0x68", "101000", 40], tone: "ok" }, { cells: ["A3 = 0x6A289C", "0x28", "101000", 40], tone: "ok" }, { cells: ["A4 = 0x5E4880", "0x48", "001000", 8] },
    ] } },
    { type: "figure", id: "o4-f3", caption: "Why every access to P misses in GATE 2026 AN Q52: S has the same index as P and R but a different tag, so S evicts the shared block of P and R in each round; P reloads it, so R then hits.", alt: "A table of the first two rounds of accesses with the set, hit or miss and the block in set 0xB3.", fig: { kind: "trace", title: "Set 0xB3 over two rounds (4 KB, 16-byte blocks)", cols: ["access", "set", "result", "block in set 0xB3 after"], rows: [
      { cells: ["P", "0xB3", "miss", "845B3"] }, { cells: ["Q", "0xB2", "miss", "845B3"] }, { cells: ["R", "0xB3", "hit", "845B3"], tone: "ok" }, { cells: ["S", "0xB3", "miss", "846B3"], tone: "bad" }, { cells: ["P", "0xB3", "miss", "845B3"], tone: "bad" }, { cells: ["Q", "0xB2", "hit", "845B3"] }, { cells: ["R", "0xB3", "hit", "845B3"], tone: "ok" }, { cells: ["S", "0xB3", "miss", "846B3"], tone: "bad" },
    ] } },
    { type: "figure", id: "o4-f4", caption: "The two-level lookup of GATE 2025 FN Q53. Each branch is weighted by the probability of reaching it; the times already include the penalties of the levels above.", alt: "A table of the three outcomes with their probabilities, times and weighted contributions to the average access time.", fig: { kind: "trace", title: "AMAT = 11.85 ns", cols: ["outcome", "probability", "time (ns)", "contribution"], rows: [
      { cells: ["L1 hit", "0.95", 10, 9.5] }, { cells: ["L1 miss, L2 hit", "0.05 × 0.85 = 0.0425", 20, 0.85] }, { cells: ["L1 and L2 miss", "0.05 × 0.15 = 0.0075", 200, 1.5] }, { cells: ["total", "1", "", 11.85], tone: "ok" },
    ] } },

    { type: "example", id: "o4-e1", level: "gate", title: "GATE CS 2021 (forenoon), Q51 · 1 mark · the tag of a direct-mapped cache", file: "gate2021_fn_q51.txt", given: `A byte-addressable primary memory of 2³² bytes, a direct-mapped cache of 32 KB, 64-byte blocks. The size of the tag field in bits?`, find: "The tag bits.", steps: [
      { say: "Lines = 32 KB ÷ 64 = 512, so 9 index bits; offset = 6 bits.", result: "9 + 6 = 15" },
      { say: "Tag = 32 − 15.", result: "17" },
    ], answer: "17", check: "The tag of a direct-mapped cache = address bits − log₂(cache size) = 32 − 15." },
    { type: "example", id: "o4-e2", level: "gate", title: "GATE CS 2025 (forenoon), Q36 · 2 marks · the bits that store all the tags", file: "gate2025_fn_q36.txt", given: `1 M bytes of main memory, 16 K bytes of cache, a 20-bit address, 16-byte blocks, direct mapped. How many bits store all the tag values?
A) 6 × 2¹⁰   B) 8 × 2¹⁰   C) 2¹²   D) 2¹⁴`, find: "The total tag storage.", steps: [
      { say: "Lines = 16 K ÷ 16 = 1024: 10 index bits; offset 4 bits.", result: "14" },
      { say: "Tag = 20 − 14.", result: "6 bits" },
      { say: "One tag per line: 1024 × 6.", result: "6 × 2¹⁰" },
    ], answer: "A", check: "Do not forget to multiply by the number of lines." },
    { type: "example", id: "o4-e3", level: "gate", title: "GATE CS 2026 (afternoon), Q56 · 2 marks · the largest cache for block number 176", file: "gate2026_an_q56.txt", given: `A 1 MB physical memory, byte words, a direct-mapped cache with blocks numbered from 0. The word at 0xA2C28 maps to cache block 176. The maximum size of the cache in KB?`, find: "The largest size.", steps: [
      { say: "Block number = (address >> o) mod 2^i, with 2^i > 176 so i ≥ 8, and o + i ≤ 20.", result: "search" },
      { say: "o = 6, i = 11: 0xA2C28 >> 6 = 0x28B0, mod 2048 = 0x0B0 = 176.", result: "17 bits" },
      { say: "Cache size 2¹⁷ bytes.", result: "128 KB" },
    ], answer: "128", check: "The program in this chapter prints 17 and 128." },
    { type: "example", id: "o4-e4", level: "gate", title: "GATE CS 2018 (forenoon), Q44 · 2 marks · the tag field in symbols", file: "gate2018_fn_q44.txt", given: `Physical address space 2^P bytes, word 2^W bytes, cache 2^N bytes, block 2^M words, K-way set associative. The tag length?
A) P − N − log₂K   B) P − N + log₂K   C) P − N − M − W − log₂K   D) P − N − M − W + log₂K`, find: "The tag length.", steps: [
      { say: "Offset = M + W. Sets = 2^N ÷ (2^(M+W) × K), so index = N − M − W − log₂K.", result: "fields" },
      { say: "Tag = P − index − offset = P − (N − M − W − log₂K) − (M + W).", result: "P − N + log₂K" },
    ], answer: "B", check: "Direct mapped is K = 1: tag = P − N, as the shortcut says." },
    { type: "example", id: "o4-e5", level: "gate", title: "GATE CS 2023 (forenoon), Q64 and 2019 (forenoon), Q11 · the tag of a set-associative and a fully associative cache", file: "gate2023_fn_q64.txt", given: `(a) An 8-way 64 KB cache, a 32-bit address: the tag? (b) A fully associative 16 KB cache, 16-byte blocks, a 32-bit address: the tag and index bits?`, find: "The tag bits.", steps: [
      { say: "(a) index + offset = log₂(64 KB ÷ 8) = 13.", result: "tag = 19" },
      { say: "(b) No index; offset = 4.", result: "tag 28, index 0" },
    ], answer: "19; 28 and 0 (option D)", check: "The program prints 19 and 28." },
    { type: "example", id: "o4-e6", level: "gate", title: "GATE CS 2026 FN Q38, 2025 AN Q39, 2021 AN Q65, 2017 FN Q65, 2017 AN Q36 · the field counts in reverse", file: "gate2026_fn_q38.txt", given: `(1) 2³² space, 2²³ cache, direct tag M, K-way (K = 2^L) tag N: how are they related? (2) Direct mapped, 4-bit tag, 12-bit index, 1-byte blocks: memory and cache sizes? (3) 2 KB cache, 64-byte blocks, 32-bit address, 22-bit tag: the associativity? (4) A direct-mapped tag of 10 bits becomes 16-way: the tag? (5) 2³² memory, 32-byte blocks, 512 lines, direct mapped: the tag?`, find: "The five answers.", steps: [
      { say: "(1) M = 9; N = 9 + L.", result: "N = M + L (A)" },
      { say: "(2) 16-bit address: 64 KB; 2¹² lines of 1 byte.", result: "64 KB and 4 KB (A)" },
      { say: "(3) 32 lines; index = 32 − 22 − 6 = 4: 16 sets.", result: "2-way" },
      { say: "(4) The index loses 4 bits.", result: "14" },
      { say: "(5) 512 × 32 = 16 KB = 2¹⁴.", result: "32 − 14 = 18" },
    ], answer: "A; A; 2; 14; 18", check: "Each is the same bit budget: address = tag + index + offset." },
    { type: "example", id: "o4-e7", level: "gate", title: "GATE CS 2020 (forenoon), Q55 · 2 marks · which addresses share a set", file: "gate2020_fn_q55.txt", given: `16 MB memory, a 64 KB 4-way cache, 256-byte blocks. A1 = 0x42C8A4, A2 = 0x546888, A3 = 0x6A289C, A4 = 0x5E4880. Which is true?
A) A1 and A4 map to different sets   B) A2 and A3 map to the same set   C) A3 and A4 map to the same set   D) A1 and A3 map to the same set`, find: "The true statement.", steps: [
      { say: "Sets = 64 KB ÷ (256 × 4) = 64: index = 6 bits above the 8 offset bits.", result: "bits 13..8" },
      { say: "Low six bits of the middle byte: A1: 8, A2: 40, A3: 40, A4: 8.", result: "sets" },
      { say: "A2 and A3 are both in set 40.", result: "B" },
    ], answer: "B", check: "A1 and A4 are in the same set, which makes A false." },
    { type: "example", id: "o4-e8", level: "gate", title: "GATE CS 2026 (afternoon), Q52 · 2 marks · MSQ: P, Q, R, S in a 4 KB direct-mapped cache", file: "gate2026_an_q52.txt", given: `4 KB direct mapped, 16-byte blocks, 16 MB memory. P, Q, R, S accessed in that order 10 times. P = 0x845B32, Q = 0x845B26, R = 0x845B36, S = 0x846B32.
A) every access to P misses   B) every access to R hits   C) every access to Q misses   D) except the first access to S, all accesses to S hit`, find: "The true statements.", steps: [
      { say: "256 sets: index bits 11..4. P, R: set 0xB3 and the same block; Q: set 0xB2; S: set 0xB3 and a different block.", result: "S conflicts with P and R" },
      { say: "S evicts the shared block each round, so P misses every time; P then reloads it for R.", result: "A true, B true" },
      { say: "Q is alone in its set: it hits after the first miss. S misses every time.", result: "C false, D false" },
    ], answer: "A, B", check: "The simulator of this chapter prints P 0 Q 9 R 10 S 0 hits." },
    { type: "example", id: "o4-e9", level: "gate", title: "GATE CS 2022 (forenoon), Q54 · 2 marks · MSQ: P, Q, R, S in a 2 KB direct-mapped cache", file: "gate2022_fn_q54.txt", given: `2 KB direct mapped, 64-byte blocks, 64 KB space. P = 0xA248, Q = 0xC28A, R = 0xCA8A, S = 0xA262, accessed in that order 10 times.
A) every access to S is a hit   B) once P is brought in it is never evicted   C) at the end only R and S reside   D) every access to R evicts Q`, find: "The true statements.", steps: [
      { say: "32 sets. P and S: set 9, the same block. Q and R: set 10, different blocks.", result: "P,S share; Q,R conflict" },
      { say: "S hits every time (P loaded the block); P stays; Q and R evict each other.", result: "A, B, D true" },
      { say: "At the end the cache holds the block of P and S and R, so C is false.", result: "C false" },
    ], answer: "A, B, D", check: "The simulator prints P 9 Q 0 R 0 S 10 hits." },
    { type: "example", id: "o4-e10", level: "gate", title: "GATE CS 2017 (forenoon), Q53 · 2 marks · the conflict misses of a repeated sequence", file: "gate2017_fn_q53.txt", given: `A 2-way set associative cache with 256 blocks, LRU, initially empty. The sequence (0, 128, 256, 128, 0, 128, 256, 128, 1, 129, 257, 129, 1, 129, 257, 129) is repeated 10 times. The number of conflict misses?`, find: "The conflict misses.", steps: [
      { say: "128 sets: blocks 0, 128, 256 share set 0; 1, 129, 257 share set 1; each set holds two of its three blocks.", result: "conflicts" },
      { say: "Simulate with LRU: 82 misses in all.", result: "82" },
      { say: "Six of them are the first access of six distinct blocks.", result: "6 compulsory" },
    ], answer: "76", check: "The program prints 82 76 6." },
    { type: "example", id: "o4-e11", level: "gate", title: "GATE CS 2022 (forenoon), Q24 and 2024 (forenoon), Q41 · MSQ: write policies", file: "gate2022_fn_q24.txt", given: `2022: which are FALSE? A) every block in WB and WT has a dirty bit  B) every write hit in WB transfers data to memory  C) eviction of a block from WT does not transfer data to memory  D) a read miss in WB never evicts a dirty block. 2024: which are TRUE? A) a read miss in WBC never evicts a dirty block  B) a read miss in WTC never triggers a write back  C) a write hit in WBC can change the dirty bit  D) a write miss in WTC always writes the victim to memory.`, find: "The false (2022) and true (2024) statements.", steps: [
      { say: "WT has no dirty bit; a WB write hit only sets the dirty bit; a read miss in WB can evict a dirty line.", result: "2022: A, B, D false" },
      { say: "WT lines are never dirty, so no write back; a write hit can turn a clean line dirty in WB.", result: "2024: B, C true" },
    ], answer: "2022: A, B, D. 2024: B, C", check: "WT: no dirty bit, never a write back. WB: dirty bit, write back on evicting a dirty line." },
    { type: "example", id: "o4-e12", level: "gate", title: "GATE CS 2021 (afternoon), Q39 · 2 marks · two statements on write policies", file: "gate2021_an_q39.txt", given: `S1: read misses in a write-through L1 cache do not result in write backs of dirty lines to L2. S2: write allocate must be used with write through caches and no-write allocate with write back caches.`, find: "Which is correct?", steps: [
      { say: "A write-through cache has no dirty lines, so S1 is true.", result: "S1 true" },
      { say: "The pairing is a habit, not a rule: 'must' makes S2 false.", result: "S2 false" },
    ], answer: "A", check: "Any statement that says 'must' about a cache policy pairing is suspect." },
    { type: "example", id: "o4-e13", level: "gate", title: "GATE CS 2022 (forenoon), Q33 and 2020 (forenoon), Q27 · 1 mark each · access time of one level", file: "gate2022_fn_q33.txt", given: `2022: hit rate 0.8, latency 10 ns, miss penalty 100 ns. After an optimisation the latency is 15 ns. The least hit rate that does not raise the AMAT? 2020: a 1 MB direct-mapped cache, 256-byte blocks, 64-bit word, access time 3 ns, hit rate 94%; a miss takes 20 ns for the first word and 5 ns for each following word. The AMAT?`, find: "The two answers.", steps: [
      { say: "2022: old AMAT = 10 + 0.2 × 100 = 30. New: 15 + (1 − h) × 100 ≤ 30.", result: "h ≥ 0.85" },
      { say: "2020: 32 words per block; miss = 20 + 31 × 5 = 175 ns; AMAT = 3 + 0.06 × 175.", result: "13.5 ns" },
    ], answer: "0.85; 13.5", check: "The program prints 13.50 for the second." },
    { type: "example", id: "o4-e14", level: "gate", title: "GATE CS 2025 (forenoon), Q53 and (afternoon), Q55 · 2 marks each · two-level access time", file: "gate2025_fn_q53.txt", given: `FN: L1 hit 95% at 10 ns; L2 hit 85% at 20 ns (including the L1 miss penalty); memory 200 ns (including both). AN: L1 1 ns, 90% hits; L2 hit rate 80%, 10 ns miss penalty from L2 to L1; 100 ns from memory to L2. The AMAT of each?`, find: "The two averages.", steps: [
      { say: "FN: 0.95 × 10 + 0.05 × (0.85 × 20 + 0.15 × 200) = 9.5 + 0.05 × 47.", result: "11.85" },
      { say: "AN: 1 + 0.1 × (10 + 0.2 × 100).", result: "4.0" },
    ], answer: "11.85; 4.0", check: "In the FN question the times already contain the penalties, so there is no '+ penalty' term." },
    { type: "example", id: "o4-e15", level: "gate", title: "GATE CS 2017 (afternoon), Q39 · 2 marks · split caches and a shared L2", file: "gate2017_an_q39.txt", given: `I-cache 2 ns, hit 0.8; D-cache 2 ns, hit 0.9; L2 8 ns, hit 0.9; memory 90 ns. 60% of the reads are instruction fetches, 40% operand fetches. The average read time?`, find: "The average read time.", steps: [
      { say: "Instruction: 2 + 0.2 × (8 + 0.1 × 90) = 2 + 0.2 × 17.", result: "5.4" },
      { say: "Data: 2 + 0.1 × 17.", result: "3.7" },
      { say: "Mix: 0.6 × 5.4 + 0.4 × 3.7.", result: "4.72" },
    ], answer: "4.72", check: "The same L2 term, 8 + 0.1 × 90 = 17, is added after each L1 miss." },
    { type: "example", id: "o4-e16", level: "gate", title: "GATE CS 2017 (afternoon), Q47 and (forenoon), Q20 · finding a miss rate", file: "gate2017_an_q47.txt", given: `AN: L1 1 cycle, L2 8 cycles, memory miss penalty 18 cycles; the L1 miss rate is twice the L2 miss rate; AMAT = 2 cycles. FN: 1.4 accesses per instruction, L1 miss rate 0.1, 7 L2 misses per 1000 instructions: the L2 miss rate?`, find: "The miss rates.", steps: [
      { say: "AN: 2 = 1 + 2m₂(8 + 18m₂) gives 36m₂² + 16m₂ − 1 = 0.", result: "m₂ = 0.056, m₁ = 0.111" },
      { say: "FN: L2 accesses per instruction = 1.4 × 0.1 = 0.14; misses 0.007.", result: "0.007 ÷ 0.14 = 0.05" },
    ], answer: "A (0.111 and 0.056); 0.05", check: "Substitute m₂ = 0.056: 1 + 0.111 × (8 + 1.0) = 2.0." },
    { type: "example", id: "o4-e17", level: "gate", title: "GATE CS 2024 (forenoon), Q56 · 2 marks · the speedup from a perfect cache", file: "gate2024_fn_q56.txt", given: `25% load/store instructions, ideal CPI 2, instruction cache miss rate 2%, data cache miss rate 8%, miss penalty 100 cycles. The speedup with a perfect cache?`, find: "The speedup.", steps: [
      { say: "Stalls per instruction: 0.02 × 100 + 0.25 × 0.08 × 100.", result: "2 + 2 = 4" },
      { say: "Real CPI = 2 + 4 = 6.", result: "6" },
      { say: "Perfect-cache CPI is 2: speedup 6 ÷ 2.", result: "3.00" },
    ], answer: "3.00", check: "Every instruction is fetched (0.02), but only 25% touch data." },
    { type: "example", id: "o4-e18", level: "gate", title: "GATE CS 2019 (forenoon), Q60 · 2 marks · the memory bandwidth on a miss", file: "gate2019_fn_q60.txt", given: `Block of 8 words of 4 bytes; a 60 MHz memory clock; a miss takes 1 cycle to accept the address, 3 cycles to fetch the block, then transmits 1 word per cycle. The maximum bandwidth in 10⁶ bytes per second?`, find: "The bandwidth.", steps: [
      { say: "Cycles per block: 1 + 3 + 8.", result: "12" },
      { say: "Bytes per block: 8 × 4.", result: "32" },
      { say: "Bandwidth = 32 ÷ (12 ÷ 60 × 10⁶) = 32 × 5 × 10⁶.", result: "160 × 10⁶" },
    ], answer: "160", check: "Transmission of the eight words is the 8 in the 12." },

    { type: "trap", wrong: "A fully associative cache has a bigger tag-plus-index than a direct-mapped one.", tempting: "More freedom in placement sounds like more bits of address.", whyWrong: "The address is the same length. Freedom moves bits from the index to the tag: a K-way cache has log₂ K fewer index bits and log₂ K more tag bits, and a fully associative cache has no index at all, so its tag is the address minus the offset (28 bits in GATE 2019).", rule: "Tag + index + offset = address bits; more ways shrink the index and grow the tag.", ex: { text: "A 4 KB cache, 16-byte blocks, 24-bit address: direct tag 12; 4-way tag 14; fully associative tag 20." } },

    { type: "gate", text: "Real GATE questions solved in this chapter, 27 of them: 2026 FN Q38 · 2026 AN Q52, Q56 · 2025 FN Q36, Q53 · 2025 AN Q39, Q55 · 2024 FN Q41, Q56 · 2023 FN Q64 · 2022 FN Q24, Q33, Q54 · 2021 FN Q51 · 2021 AN Q39, Q65 · 2020 FN Q27, Q55 · 2019 FN Q11, Q60 · 2018 FN Q44 · 2017 FN Q20, Q53, Q65 · 2017 AN Q36, Q39, Q47. The tag is the address bits minus log₂ of the cache size, plus log₂ of the ways." },
    { type: "recall", cards: [
      { q: "Temporal and spatial locality?", a: "Reuse of the same word soon; use of nearby words soon." },
      { q: "The three address fields?", a: "Tag, index, block offset." },
      { q: "Offset bits?", a: "log₂ (block size in bytes)." },
      { q: "Index bits?", a: "log₂ (number of sets) = log₂ (cache ÷ (block × ways))." },
      { q: "Tag bits of a direct-mapped cache?", a: "Address bits minus log₂ (cache size)." },
      { q: "What does K ways do to the tag?", a: "Adds log₂ K bits to it." },
      { q: "Fully associative index?", a: "None: 0 bits." },
      { q: "Compulsory against conflict miss?", a: "First use of a block; too many blocks for one set." },
      { q: "Write through against write back?", a: "Write through: no dirty bit, memory current. Write back: dirty bit, write on eviction." },
      { q: "AMAT with two levels?", a: "t₁ + m₁ (t₂ + m₂ t_mem)." },
    ] },
    { type: "check", questions: [
      { id: "o4c1", kind: "NAT", marks: 1, q: "A 32-bit address, a 16 KB direct-mapped cache, 32-byte blocks. The tag has how many bits?", answer: "18", solution: "Tag = 32 − log₂(16 KB) = 32 − 14 = 18." },
      { id: "o4c2", kind: "NAT", marks: 1, q: "A 4-way 32 KB cache, 64-byte blocks, 32-bit address. The number of index bits is", answer: "7", solution: "Sets = 32768 ÷ (64 × 4) = 128 = 2⁷." },
      { id: "o4c3", kind: "MCQ", marks: 1, q: "Which cache needs no index?", options: ["Direct mapped", "2-way set associative", "Fully associative", "None"], answer: "C", solution: "A fully associative cache has one set." },
      { id: "o4c4", kind: "NAT", marks: 2, q: "A cache has hit time 2 ns, hit rate 95% and miss penalty 80 ns. The AMAT in ns is", answer: "6", solution: "2 + 0.05 × 80 = 6." },
      { id: "o4c5", kind: "NAT", marks: 2, q: "L1: 1 ns, miss rate 10%. L2: 6 ns, local miss rate 25%. Memory: 60 ns. The AMAT in ns is", answer: "3.1", solution: "1 + 0.1 × (6 + 0.25 × 60) = 1 + 0.1 × 21 = 3.1." },
      { id: "o4c6", kind: "MSQ", marks: 2, q: "Which statements about a write-through cache are true?", options: ["It needs a dirty bit per line", "Memory is always up to date", "A write hit goes to the cache and the memory", "Evicting a line writes it to memory"], answer: "B, C", solution: "No dirty bit and no write back on eviction." },
      { id: "o4c7", kind: "NAT", marks: 2, q: "A direct-mapped cache has 8 lines of 1 word. The word addresses 1, 9, 1, 9, 1, 9 are accessed with an empty cache. The number of hits is", answer: "0", solution: "1 and 9 both map to line 1 (mod 8) and evict each other every time." },
      { id: "o4c8", kind: "MCQ", marks: 2, q: "A program's ideal CPI is 1.5 with 30% loads and stores. The data-cache miss rate is 5% and the miss penalty 60 cycles (ignore instruction misses). The CPI is", options: ["2.1", "2.4", "2.7", "3.0"], answer: "B", solution: "0.3 × 0.05 × 60 = 0.9 stall cycles; CPI = 1.5 + 0.9 = 2.4." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on cache memory", sub: "Computer Organisation", href: "/topics/computer-organization-and-architecture-coa" }, { label: "Main memory and storage", sub: "the next chapter", href: "/study/main-memory" }] },
    { type: "links", prereq: ["Performance equation (O0)", "Pipelining (O3)", "Number representation (L1)"], usedIn: ["Virtual memory (OS)", "Main memory (O5)"], cross: ["Data structures: array locality"] },
  ],
};
