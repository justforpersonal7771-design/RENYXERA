import type { Topic } from "@/lib/study/schema";

/**
 * Data Structures chapter D14 "Extras: tries and disjoint sets" (29 Nov 2026), enrichment: neither is named in the official syllabus and no past question
 * in the bank asks them directly (the idea of disjoint sets is behind Kruskal's algorithm in the Algorithms book). Programs compiled and run with gcc:
 * a trie of cat, car, dog, do answers 1 0 1 0 and has 8 nodes; a union-find on 8 items with six unions has 2 components, 0 and 3 joined, size 4.
 */
export const chapterD14: Topic = {
  id: "cs.pds.ds.extras14",
  title: "Extras: tries and disjoint sets",
  no: "D14",
  book: [
    { t: "p", text: "Two small structures finish the book. The **trie** stores a set of words so that a word, or every word starting with a given prefix, is found by following letters one at a time. The **disjoint-set** structure (also called union-find) keeps track of a collection of groups that merge over time and answers the question 'are these two items in the same group?' almost instantly." },
    { t: "p", text: "Neither is named in the official syllabus, and no past question in the bank asks about them directly. They are here because the ideas recur: the disjoint-set structure is the heart of Kruskal's minimum spanning tree algorithm in the Algorithms book, and the trie is the clearest example of a structure whose cost depends on the length of the key, not the number of keys." },
    { t: "p", text: "By the end of this chapter you will be able to:" },
    { t: "ul", items: ["build a trie, search it, and count its nodes;", "say what a trie costs in time and in space;", "carry out union and find on a disjoint-set forest;", "explain union by size and path compression and their effect on the cost."] },

    { t: "h2", text: "The trie: a tree of letters" },
    { t: "p", text: "A **trie** (from retrieval, said 'try') is a tree in which each edge is labelled with a letter and each path from the root spells a prefix. A word is stored as a path, and the node at the end of the path is marked as the end of a word. Words that share a beginning share the first part of their path: 'cat' and 'car' share the nodes for c and a." },
    { t: "fig", id: "d14-f1" },
    { t: "p", text: "Look at the figure: the words cat, car, dog and do. The path c, a, t spells cat; the path c, a, r spells car and branches off after the a. The node after d, o is marked as a word end (for 'do') and also has a child g (for 'dog'). A node can be a word end and still have children." },
    { t: "code", text: `#include <stdio.h>
#include <stdlib.h>

struct trie { struct trie *next[26]; int end; };
int nodes = 1;
struct trie *mk(void) { return calloc(1, sizeof(struct trie)); }

void insert(struct trie *t, const char *w) {
    for (; *w; w++) {
        int c = *w - 'a';
        if (!t->next[c]) { t->next[c] = mk(); nodes++; }     /* a new node only if the letter is new here */
        t = t->next[c];
    }
    t->end = 1;                                               /* mark the end of a word */
}
int search(struct trie *t, const char *w) {
    for (; *w; w++) { t = t->next[*w - 'a']; if (!t) return 0; }
    return t->end;
}

int main(void) {
    struct trie *root = mk();
    const char *words[] = {"cat", "car", "dog", "do"};
    for (int i = 0; i < 4; i++) insert(root, words[i]);
    printf("%d %d %d %d | %d\\n", search(root, "car"), search(root, "ca"), search(root, "do"), search(root, "dot"), nodes);
    return 0;
}`, out: "1 0 1 0 | 8", file: "trie.c" },
    { t: "p", text: "The program inserts the four words and asks four questions. `car` is found. `ca` is a prefix of words but is not marked as a word end, so the answer is 0. `do` is found. `dot` falls off the trie at the t, so 0. The trie has 8 nodes in all: the root, then c, a, t, r for the first two words and d, o, g for the others." },
    { t: "callout", kind: "key", text: "Trie: one letter per edge, shared prefixes shared. Search or insert costs Θ(length of the word), whatever the number of words. A word end must be marked." },
    { t: "ex", id: "d14-e1" },
    { t: "trap", i: 0 },
    { t: "p", text: "The cost of a trie is easy to state. Looking up a word of length L takes L steps, independent of how many words are stored, which makes it faster than a balanced search tree (log n comparisons of whole words) when the words are short and many. The price is **space**: each node holds an array of pointers, one per letter, most of them unused. The number of nodes is at most the total number of letters of all the words, and it is smaller when words share prefixes." },
    { t: "p", text: "A trie also answers **prefix** questions that a hash table cannot: 'list all words starting with ca' is a walk to the node for ca followed by a traversal of what hangs below it. This is why tries are used for autocomplete and for the longest-prefix match of an IP address in a router." },
    { t: "p", text: "A common variation stores the children of a node in a small list or a hash map instead of a 26-slot array. That saves space when the alphabet is large (Unicode text) at the cost of a little extra time per step; the shape of the trie and the number of nodes stay the same." },
    { t: "ex", id: "d14-e2" },

    { t: "h2", text: "Disjoint sets: groups that merge" },
    { t: "p", text: "Suppose n items start in n groups of one, and over time pairs of groups are merged. The two operations are **find(x)**, which names the group of x, and **union(a, b)**, which merges the groups of a and b. The question 'are a and b in the same group?' is answered by comparing find(a) and find(b)." },
    { t: "p", text: "The standard structure is a **forest**: each group is a tree, the root is the group's name, and every item stores a pointer to its parent (the root points to itself). Find follows parent pointers up to the root. Union makes the root of one tree a child of the root of the other." },
    { t: "fig", id: "d14-f2" },
    { t: "p", text: "Done naively, this can build a long chain and find then costs Θ(n). Two small ideas fix that. **Union by size**: hang the smaller tree under the root of the larger, so trees stay shallow (the height is at most log₂ n). **Path compression**: during a find, make every item on the path point straight to the root, so the next find on any of them is one step." },
    { t: "code", text: `#include <stdio.h>

int parent[8], sz[8];
int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }      /* path compression */
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (sz[a] < sz[b]) { int t = a; a = b; b = t; }                                   /* union by size */
    parent[b] = a; sz[a] += sz[b];
}

int main(void) {
    for (int i = 0; i < 8; i++) { parent[i] = i; sz[i] = 1; }
    unite(0, 1); unite(2, 3); unite(1, 3); unite(4, 5); unite(6, 7); unite(5, 7);
    int comps = 0; for (int i = 0; i < 8; i++) if (find(i) == i) comps++;
    printf("%d %d %d\\n", comps, find(3) == find(0), sz[find(4)]);
    return 0;
}`, out: "2 1 4", file: "union_find.c" },
    { t: "p", text: "Eight items start alone. The six unions join 0 and 1, 2 and 3, then the two pairs (so 0, 1, 2, 3 form one group), then 4 and 5, 6 and 7, then those two pairs (4 to 7 form another). The program counts the roots: 2 groups; 0 and 3 are in the same group; the group of 4 has 4 members. With both improvements a sequence of m operations on n items takes almost linear time, written O(m α(n)) with α the inverse Ackermann function, which is below 5 for any practical n." },
    { t: "ex", id: "d14-e3" },
    { t: "trap", i: 1 },
    { t: "p", text: "The same idea answers the question 'does adding this edge create a cycle?' for a graph: if the two ends of the edge are already in the same group, the edge closes a cycle; if not, it joins two groups. Kruskal's algorithm sorts the edges by weight and adds each one that joins two different groups, which is a series of find and union operations." },
    { t: "ex", id: "d14-e4" },

    { t: "h2", text: "Where each is used" },
    { t: "p", text: "Tries sit behind every search box that completes your words as you type: the program walks to the node of what you have typed and lists the words below it. Routers use a trie of binary digits (a binary trie) to find the longest prefix of an IP address in a forwarding table, and spell checkers and phone dictionaries use them for the same reason." },
    { t: "p", text: "Disjoint sets are used wherever groups only merge: finding the connected components of a graph as edges arrive, deciding whether two accounts or pixels belong together, and building a minimum spanning tree with Kruskal's algorithm. The structure never splits a group, which is why it can be so fast." },
    { t: "p", text: "A second use of the trie is to sort strings: insert every word, then read the words off in alphabetical order by visiting the children from a to z. The cost is proportional to the total number of letters, with no comparisons of whole words." },
    { t: "h2", text: "Comparing with the structures you know" },
    { t: "table", head: ["Structure", "Lookup of a key", "Prefix query", "Ordered listing", "Space"], rows: [["Hash table", "Θ(1) average", "no", "no", "Θ(n)"], ["Balanced BST", "Θ(log n) comparisons", "awkward", "yes, inorder", "Θ(n)"], ["Trie", "Θ(length of the key)", "yes", "yes, by walking a to z", "up to total letters × alphabet size"], ["Sorted array", "Θ(log n)", "binary search for the start", "yes", "Θ(n)"]] },
    { t: "p", text: "None of them wins everywhere. If keys are whole numbers or you only need exact lookup, a hash table is hard to beat. If you need order, a balanced tree. If the keys are strings and you need prefixes, a trie. This is the same lesson as chapter D15: choose from the operation the program does most." },
    { t: "h2", text: "How GATE asks it" },
    { t: "gate" },
    { t: "p", text: "No past question in the bank asks about tries or disjoint sets by name. They matter because they appear in the reasoning of other questions: counting the nodes of a prefix tree, the cost of a lookup that depends on the key length, and the union-find steps inside Kruskal's algorithm in the Algorithms subject. Treat the chapter as a short reference, not as a priority." },
    { t: "h4", text: "What these questions would test" },
    { t: "p", text: "Whether you can build the structure from a given sequence without losing a step, and whether you know the cost: Θ(L) for a trie lookup, near-constant for union-find with the two improvements." },
    { t: "h4", text: "Where students lose marks" },
    { t: "ul", items: ["Forgetting to mark the end of a word, so that a prefix is taken for a word.", "Counting the root as a letter, or counting a shared prefix twice.", "Hanging the larger tree under the smaller one.", "Forgetting that find with path compression changes the structure.", "Saying a trie lookup depends on the number of words."] },

    { t: "h2", text: "Chapter summary" },
    { t: "ul", items: ["A trie stores words as paths of letters; shared prefixes share nodes; a word end is marked.", "Trie search and insert cost Θ(length of the word); space is up to the total number of letters.", "A trie answers prefix queries; a hash table does not.", "Disjoint sets: find names the group, union merges two groups; a forest with parent pointers.", "Union by size keeps trees at height at most log₂ n; path compression flattens them.", "Together they give almost constant time per operation; used in Kruskal's algorithm."] },
  ],
  blocks: [
    { type: "figure", id: "d14-f1", caption: "A trie of the words cat, car, dog and do. The node after d, o is a word end (do) and has a child g (dog). There are 8 nodes including the root.", alt: "A tree with a root having children c and d; c has a, which has t and r; d has o, which has g.", fig: { kind: "tree", title: "cat, car, dog, do", root: { label: "·", kids: [{ label: "c", kids: [{ label: "a", kids: [{ label: "t", tone: "ok" }, { label: "r", tone: "ok" }] }] }, { label: "d", kids: [{ label: "o", tone: "ok", kids: [{ label: "g", tone: "ok" }] }] }] } } },
    { type: "figure", id: "d14-f2", caption: "Disjoint sets as a forest: the groups {0, 1, 2, 3} and {4, 5, 6, 7}. The root names the group; find(3) follows 3 to its root 0.", alt: "Two trees: 0 with children 1 and 2 and 2 having child 3; and 4 with children 5 and 6 and 6 having child 7.", fig: { kind: "tree", title: "Two groups", root: { label: "0 | 4", kids: [{ label: "0: 1, 2 (3 under 2)" }, { label: "4: 5, 6 (7 under 6)" }] } } },

    { type: "example", id: "d14-e1", level: "easy", title: "Nodes of a trie", file: "trie_count.txt", given: `Insert the words bat, bad, be, cat into an empty trie.`, find: "The number of nodes, counting the root.", steps: [
      { say: "bat: root, b, a, t: 3 new nodes.", result: "3" },
      { say: "bad shares b and a and adds d: 1 new node. be shares b and adds e: 1 new node.", result: "2" },
      { say: "cat shares nothing: c, a, t: 3 new nodes.", result: "3" },
      { say: "Total: 1 (root) + 3 + 1 + 1 + 3.", result: "9" },
    ], answer: "9 nodes", check: "The total number of letters is 3 + 3 + 2 + 3 = 11; sharing saves 2 nodes." },
    { type: "example", id: "d14-e2", level: "easy", title: "Is it a word or a prefix?", file: "trie_search.txt", given: `The trie holds cat, car, dog, do. Search for ca, car, dot and d.`, find: "The result of each.", steps: [
      { say: "ca: the path exists but its last node is not a word end.", result: "no" },
      { say: "car: the path exists and is marked.", result: "yes" },
      { say: "dot: the path falls off after d, o.", result: "no" },
      { say: "d: the path exists but is not marked.", result: "no" },
    ], answer: "Only car is a word", check: "Every prefix of a word exists as a path, but only marked nodes are words." },
    { type: "example", id: "d14-e3", level: "gate", title: "Union and find on eight items", file: "uf_trace.txt", given: `Items 0 to 7, each alone. Unions: (0,1), (2,3), (1,3), (4,5), (6,7), (5,7).`, find: "The number of groups and the size of the group of 4.", steps: [
      { say: "After (0,1) and (2,3): groups {0, 1}, {2, 3}. (1,3) joins them: {0, 1, 2, 3}.", result: "{0, 1, 2, 3}" },
      { say: "(4,5) and (6,7) make {4, 5} and {6, 7}. (5,7) joins them: {4, 5, 6, 7}.", result: "{4, 5, 6, 7}" },
      { say: "Two groups; the group of 4 has 4 members.", result: "2 groups, size 4" },
    ], answer: "2 groups; the group of 4 has 4 items", check: "The program in this chapter prints 2 1 4." },
    { type: "example", id: "d14-e4", level: "edge", title: "Does this edge close a cycle?", file: "cycle_check.txt", given: `Edges added in this order to 5 vertices: 0-1, 1-2, 3-4, 2-0, 2-3. Using find and union, which edge closes a cycle?`, find: "The edge.", steps: [
      { say: "0-1: different groups, union. 1-2: different, union. 3-4: different, union.", result: "{0,1,2}, {3,4}" },
      { say: "2-0: find(2) = find(0): the same group, so this edge closes a cycle.", result: "2-0 closes a cycle" },
      { say: "2-3: different groups: union (no cycle).", result: "{0,1,2,3,4}" },
    ], answer: "The edge 2-0", check: "The final graph has 5 vertices and 4 useful edges: a tree plus the one extra edge 2-0." },

    { type: "trap", wrong: "In a trie, every path from the root to a node is a word stored in it.", tempting: "Every path spells something.", whyWrong: "Every path spells a PREFIX of some word, but only the nodes marked as a word end are words. 'ca' is a path in the trie of cat and car and is not a word.", rule: "Search succeeds only on a marked node.", ex: { code: "words cat, car: search for ca", out: "path exists, not marked: no" } },
    { type: "trap", wrong: "Union can hang either tree under the other with the same result.", tempting: "Both ways merge the two groups.", whyWrong: "The groups are the same either way, but hanging the larger tree under the smaller makes the larger tree one level deeper, and repeated, it builds a chain with find cost Θ(n). Union by size keeps the height at most log₂ n.", rule: "Hang the smaller tree under the larger.", ex: { code: "union(0,1), union(0,2), union(0,3) always larger under smaller", out: "a chain of height 3" } },

    { type: "gate", text: "No past question in the bank asks about tries or disjoint sets by name. The disjoint-set idea is used in Kruskal's algorithm (Algorithms book); the trie is enrichment." },
    { type: "recall", cards: [
      { q: "What does each edge of a trie carry?", a: "One letter." },
      { q: "How is a word stored in a trie?", a: "As a path from the root, the last node marked as a word end." },
      { q: "Cost of a trie lookup?", a: "Θ(length of the word), independent of the number of words." },
      { q: "What does a trie do that a hash table does not?", a: "Prefix queries." },
      { q: "What do find and union do?", a: "Find names the group of an item; union merges two groups." },
      { q: "How is a group stored?", a: "As a tree with parent pointers; the root names the group." },
      { q: "What is union by size?", a: "Hang the smaller tree under the root of the larger." },
      { q: "What is path compression?", a: "During find, point every item on the path straight at the root." },
      { q: "What do they give together?", a: "Almost constant time per operation." },
      { q: "Which famous algorithm uses union-find?", a: "Kruskal's minimum spanning tree." },
    ] },
    { type: "check", questions: [
      { id: "h1", kind: "NAT", marks: 1, q: "Words an, and, ant, at are inserted into an empty trie. How many nodes does it have, counting the root?", answer: "6", solution: "Root, a, n, d, t (under n), t (under a): 6." },
      { id: "h2", kind: "MCQ", marks: 1, q: "The time to search a trie for a word of length L is", options: ["Θ(1)", "Θ(L)", "Θ(n)", "Θ(L log n)"], answer: "B", solution: "One step per letter." },
      { id: "h3", kind: "NAT", marks: 1, q: "Ten items start alone. Five different unions each merge two groups. How many groups remain?", answer: "5", solution: "Each merge reduces the count by 1." },
      { id: "h4", kind: "MCQ", marks: 1, q: "Union by size hangs", options: ["the larger tree under the smaller", "the smaller tree under the larger", "any tree anywhere", "both under a new root"], answer: "B", solution: "This keeps the height at most log₂ n." },
      { id: "h5", kind: "MSQ", marks: 2, q: "Which are true?", options: ["A trie can answer prefix queries", "Every path in a trie is a stored word", "Union-find tells whether two items are in the same group", "Path compression flattens the trees"], answer: "A, C, D", solution: "Only marked nodes are words." },
      { id: "h6", kind: "NAT", marks: 2, q: "The words to, tea, ted, ten, in are inserted into an empty trie. How many nodes does it have, counting the root?", answer: "9", solution: "Root; t, o; e, a, d, n (under t-e); i, n: 1 + 2 + 4 + 2 = 9." },
      { id: "h7", kind: "NAT", marks: 2, q: "Items 0 to 5 start alone. Unions: (0,1), (2,3), (4,5), (1,3). How many groups are there?", answer: "2", solution: "{0,1,2,3} and {4,5}." },
      { id: "h8", kind: "NAT", marks: 2, q: "Edges are added to 4 vertices in this order: 0-1, 1-2, 2-3, 3-0, 0-2. How many of them close a cycle (the two ends are already in one group)?", answer: "2", solution: "3-0 closes the cycle 0-1-2-3, and 0-2 then joins vertices already together: 2 edges." },
    ] },
    { type: "practice", links: [{ label: "Real GATE questions on spanning trees", sub: "Algorithms", href: "/topics/algorithms" }, { label: "The Data Structures book", sub: "back to the contents", href: "/study/data-structures" }] },
    { type: "links", prereq: ["Trees (D7)", "Arrays (D2)", "Graphs (D13)"], usedIn: ["Algorithms: minimum spanning trees (Kruskal)"], cross: ["Algorithms: spanning trees"] },
  ],
};
