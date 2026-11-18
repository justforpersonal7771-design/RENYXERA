import type { Chapter, Topic } from "@/lib/study/schema";

/**
 * Discrete Mathematics → Counting and combinatorics; Recurrences and generating functions. Numbers from lib/study/dm.ts, checked by script:
 * P(7,3) 210, C(7,3) 35, C(10,4) 210; 3 items from 5 kinds with repetition C(7,3) = 35; x1+…+x4 = 10 non-negative C(13,3) = 286.
 * Derangements 1, 2, 9, 44, 265 (n = 2..6 → 1, 2, 9, 44, 265 for n = 2, 3, 4, 5, 6). Onto 5 → 3: 150. Catalan 1, 1, 2, 5, 14, 42, 132.
 * aₙ = 5aₙ₋₁ − 6aₙ₋₂, a₀ = 1, a₁ = 4: 1, 4, 14, 46, 146 = 2·3ⁿ − 2ⁿ. aₙ = 4aₙ₋₁ − 4aₙ₋₂, a₀ = 1, a₁ = 6: 1, 6, 20, 56 = (1 + 2n)2ⁿ.
 * Hanoi 0, 1, 3, 7, 15 = 2ⁿ − 1. Bounded: x1+x2+x3 = 10 each 0..10: 66; each ≥ 1: 36; 0..3, 0..4, 0..5 summing to 8: 14; four digits summing to 12: 415.
 */

const counting: Topic = {
  id: "cs.dm.count.basic",
  title: "Permutations, combinations and the pigeonhole principle",
  blocks: [
    { type: "hook", text: "How many ways can 10 identical chocolates go to 4 children? Not 4¹⁰, not C(10, 4), but 286. Choosing the right counting model, ordered or not, repeats or not, is the whole skill." },
    { type: "objectives", items: ["Apply the sum and product rules.", "Choose between P(n, r), C(n, r), nʳ and C(n + r − 1, r).", "Use the pigeonhole principle to force a conclusion."] },
    { type: "intuition", paras: ["Product rule: a task done in stages with a and b choices has a·b outcomes. Sum rule: disjoint options with a and b choices give a + b.", "Two questions pick the formula: does order matter, and can items repeat? Ordered without repeats: P(n, r) = n!/(n − r)!. Unordered without: C(n, r). Ordered with repeats: nʳ. Unordered with repeats: C(n + r − 1, r), counted by 'stars and bars'.", "Pigeonhole: put N objects in k boxes and some box gets at least ⌈N/k⌉. It proves something must exist without finding it."], analogyLimit: "Like choosing a team (order does not matter) versus electing captain, vice-captain and secretary (order matters)." },
    { type: "definition", name: "The four models", text: "Choosing r items from n kinds or n distinct objects:", items: ["Ordered, no repetition: P(n, r) = n(n − 1)…(n − r + 1).", "Unordered, no repetition: C(n, r) = n! / (r!(n − r)!).", "Ordered, repetition allowed: nʳ.", "Unordered, repetition allowed: C(n + r − 1, r) = C(n + r − 1, n − 1).", "Permutations of a multiset with counts n₁, …, nₖ: n! / (n₁!…nₖ!)."] },
    { type: "deep", sections: [
      { h: "Stars and bars", paras: ["Non-negative integer solutions of x₁ + … + xₖ = n: write n stars and k − 1 bars in a row; each arrangement is a solution. That is C(n + k − 1, k − 1). If each xᵢ ≥ 1, give one to each first: C(n − 1, k − 1)."] },
      { h: "Binomial theorem and identities", points: ["(x + y)ⁿ = Σ C(n, k) xᵏ yⁿ⁻ᵏ; the coefficients sum to 2ⁿ.", "Pascal: C(n, k) = C(n − 1, k − 1) + C(n − 1, k).", "Symmetry: C(n, k) = C(n, n − k). Vandermonde: Σ C(m, i)C(n, k − i) = C(m + n, k).", "Σ k·C(n, k) = n·2ⁿ⁻¹."], paras: [] },
      { h: "Circular arrangements", paras: ["n people around a round table: (n − 1)! (rotations are the same). If reflections are also the same (a necklace you can flip): (n − 1)!/2."] },
      { h: "Generalised pigeonhole in GATE style", paras: ["To guarantee k of one kind among n kinds, take n(k − 1) + 1 items: with n(k − 1), each kind could have exactly k − 1. Among any 13 people, two share a birth month."] },
    ] },
    { type: "walkthrough", steps: ["Ask: are the objects distinct or identical? Do the boxes/positions differ?", "Does order matter? Is repetition allowed?", "Pick the formula; split into cases (sum rule) or stages (product rule) if needed.", "Check with a tiny case you can list by hand."], prompt: { q: "How many 3-letter strings over {a, b, c, d, e} have no repeated letter?", a: "P(5, 3) = 60." } },
    { type: "figure", id: "models", caption: "Choosing 3 from 7 under each model.", alt: "210, 35, 343, 84.", fig: { kind: "matrix", title: "n = 7, r = 3", cols: ["No repeats", "Repeats"], rows: [{ label: "Ordered", cells: [210, 343] }, { label: "Unordered", cells: [35, 84], hl: true }] } },
    { type: "example", id: "cx1", level: "gate", title: "Choosing the model", given: "A club of 7 people.", find: "Ways to pick a president, secretary and treasurer; and ways to pick a committee of 3.",
      steps: [
        { say: "Distinct roles: order matters, no repeats: P(7, 3) = 7·6·5.", result: "210" },
        { say: "Committee: unordered: C(7, 3) = 210/3!.", result: "35" },
      ],
      answer: "210 ordered selections; 35 committees.",
      check: "Each committee can fill the three roles in 3! = 6 ways: 35 × 6 = 210." },
    { type: "figure", id: "stars", for: "cx2", caption: "Stars and bars: 10 chocolates, 4 children.", alt: "10 stars and 3 bars in a row of 13 symbols.", fig: { kind: "strip", items: [{ label: "★★★", sub: "child 1: 3", state: "done" }, { label: "|", sub: "bar", state: "now" }, { label: "★★★★", sub: "child 2: 4", state: "done" }, { label: "|", sub: "bar", state: "now" }, { label: "(empty)", sub: "child 3: 0", state: "todo" }, { label: "| ★★★", sub: "child 4: 3", state: "done" }] } },
    { type: "example", id: "cx2", level: "gate", title: "Identical objects into distinct boxes", given: "10 identical chocolates, 4 children; a child may get none.", find: "The number of distributions, and with each child getting at least one.",
      steps: [
        { say: "Solutions of x₁ + x₂ + x₃ + x₄ = 10, xᵢ ≥ 0: C(13, 3).", result: "286" },
        { say: "Each ≥ 1: give one each, then distribute 6: C(9, 3).", result: "84" },
      ],
      answer: "286 distributions; 84 if everyone gets at least one.",
      check: "The lab's generating-function view gives the same coefficients." },
    { type: "example", id: "cx3", level: "edge", title: "Pigeonhole", given: "Socks of 5 colours in a drawer, in the dark.", find: "How many socks guarantee 3 of one colour?",
      steps: [
        { say: "Worst case: 2 of each colour = 10 socks with no triple." },
        { say: "One more forces a triple.", result: "11" },
      ],
      answer: "11 socks: n(k − 1) + 1 = 5·2 + 1.",
      check: "For a matching pair (k = 2): 6 socks." },
    { type: "lab", lab: "count-dm" },
    { type: "faded", title: "Your turn", given: "Arrangements of the letters of BANANA.",
      steps: [{ say: "Count them.", blank: true, answer: "6!/(3!·2!·1!) = 60." }] },
    { type: "trap", wrong: "Distributing r identical items into n boxes: nʳ.", tempting: "Each item picks a box.", whyWrong: "That counts distinct items. Identical items only care how many go where: C(n + r − 1, r).", rule: "Identical items: stars and bars." },
    { type: "trap", wrong: "n people at a round table: n!.", tempting: "Arrange n people in n seats.", whyWrong: "Rotating everyone gives the same seating; divide by n.", rule: "Circular: (n − 1)!." },
    { type: "gate", text: "GATE asks counting NATs: strings with conditions, distributions (stars and bars), committee choices with restrictions, and pigeonhole minimums. Decide 'ordered?' and 'repeats?' before writing a formula." },
    { type: "recall", cards: [{ q: "Unordered with repetition", a: "C(n + r − 1, r)" }, { q: "Round table", a: "(n − 1)!" }, { q: "k of one kind among n kinds", a: "n(k − 1) + 1" }] },
    { type: "check", questions: [
      { id: "ct1", kind: "NAT", marks: 1, q: "Ways to choose a president, secretary and treasurer from 7 people?", answer: "210", solution: "P(7, 3)." },
      { id: "ct2", kind: "NAT", marks: 2, q: "Non-negative integer solutions of x₁ + x₂ + x₃ + x₄ = 10?", answer: "286", solution: "C(13, 3)." },
      { id: "ct3", kind: "NAT", marks: 2, q: "Fewest socks (5 colours) to guarantee 3 of the same colour?", answer: "11", solution: "5·2 + 1." },
      { id: "ct4", kind: "NAT", marks: 1, q: "Arrangements of the letters of BANANA?", answer: "60", solution: "6!/(3!2!)." },
      { id: "ct5", kind: "MCQ", marks: 1, q: "Ways to seat 6 people at a round table (rotations equal)?", options: ["720", "120", "60", "36"], answer: "B", solution: "5!." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Discrete Mathematics", sub: "Combinatorics", href: "/topics/discrete-mathematics" },
      { label: "Topic 2: inclusion–exclusion", sub: "Derangements and onto maps", href: "/study/counting" },
      { label: "Probability", sub: "Counting outcomes", href: "/topics/probability-and-statistics" },
    ] },
    { type: "links", prereq: ["None"], usedIn: ["Probability", "Algorithm analysis"], cross: ["Probability: classical probability"] },
  ],
};

const inclusion: Topic = {
  id: "cs.dm.count.ie",
  title: "Inclusion–exclusion and derangements",
  blocks: [
    { type: "hook", text: "Five letters go into five addressed envelopes at random. The chance that no letter reaches the right envelope is about 37%, and it hardly changes whether there are 5 letters or 500. Inclusion–exclusion explains why." },
    { type: "objectives", items: ["Apply inclusion–exclusion to two, three and n sets.", "Count derangements and onto functions.", "Count integers in a range divisible by none of several numbers."] },
    { type: "intuition", paras: ["Adding |A| + |B| counts the overlap twice, so subtract |A ∩ B|. With three sets, subtracting the pairwise overlaps removes the triple overlap too often, so add it back. The signs alternate.", "To count objects with none of several bad properties, start from the total and apply inclusion–exclusion to the bad sets.", "A derangement is a permutation with no fixed point. The bad property Aᵢ is 'item i is in its own place'; inclusion–exclusion gives Dₙ = n! Σ (−1)ᵏ/k!, which is close to n!/e."], analogyLimit: "Like correcting a headcount where some people were counted in two rooms; but the corrections themselves overcorrect, so they alternate." },
    { type: "definition", name: "Inclusion–exclusion", text: "For finite sets:", items: ["|A ∪ B| = |A| + |B| − |A ∩ B|.", "|A ∪ B ∪ C| = Σ|A| − Σ|A ∩ B| + |A ∩ B ∩ C|.", "Derangements: Dₙ = n! (1 − 1/1! + 1/2! − … + (−1)ⁿ/n!); Dₙ = (n − 1)(Dₙ₋₁ + Dₙ₋₂). D₂…D₆ = 1, 2, 9, 44, 265.", "Onto functions from m to n: Σₖ (−1)ᵏ C(n, k)(n − k)ᵐ."] },
    { type: "deep", sections: [
      { h: "Divisibility counts", paras: ["Numbers from 1 to N divisible by d: ⌊N/d⌋. By both a and b (coprime): ⌊N/ab⌋. So numbers from 1 to 100 divisible by 2, 3 or 5: 50 + 33 + 20 − 16 − 10 − 6 + 3 = 74, and 26 are divisible by none."] },
      { h: "Why the derangement probability tends to 1/e", paras: ["Dₙ/n! = Σ (−1)ᵏ/k! up to k = n, which is the series for e⁻¹ cut off at n. The tail is smaller than 1/(n + 1)!, so even at n = 5 the probability is 0.3667 against 1/e = 0.3679."] },
      { h: "Partial derangements", paras: ["Permutations of n with exactly k fixed points: choose the fixed points, derange the rest: C(n, k)·Dₙ₋ₖ. For n = 4: 9 with none fixed, 8 with one, 6 with two, 0 with three, 1 with four: total 24."] },
      { h: "Euler's φ by inclusion–exclusion", paras: ["φ(n) counts numbers up to n sharing no prime with n: φ(n) = n Π (1 − 1/p) over primes p dividing n. φ(60) = 60 · 1/2 · 2/3 · 4/5 = 16."] },
    ] },
    { type: "walkthrough", steps: ["Name the 'bad' sets A₁, …, Aₖ.", "Compute every intersection size (often by symmetry, C(k, j) terms of equal size).", "Alternate signs: + singles, − pairs, + triples, …", "Subtract from the total if you want 'none of them'."], prompt: { q: "How many permutations of 4 items leave no item in place?", a: "D₄ = 9." } },
    { type: "figure", id: "derange", caption: "Derangements grow like n!/e.", alt: "D2 to D6: 1, 2, 9, 44, 265.", fig: { kind: "matrix", title: "Dₙ", cols: ["Dₙ", "n!", "Dₙ / n!"], rows: [{ label: "n = 3", cells: [2, 6, "0.3333"] }, { label: "n = 4", cells: [9, 24, "0.3750"] }, { label: "n = 5", cells: [44, 120, "0.3667"], hl: true }, { label: "n = 6", cells: [265, 720, "0.3681"] }] } },
    { type: "example", id: "ix1", level: "gate", title: "Letters and envelopes", given: "5 letters placed at random in 5 addressed envelopes.", find: "The number of ways with no letter correct, and the probability.",
      steps: [
        { say: "D₅ = 5!(1 − 1 + 1/2 − 1/6 + 1/24 − 1/120) = 60 − 20 + 5 − 1 = 44." },
        { say: "Probability 44/120.", result: "≈ 0.367" },
      ],
      answer: "44 ways; probability 11/30 ≈ 0.367.",
      check: "Recurrence: D₅ = 4(D₄ + D₃) = 4(9 + 2) = 44." },
    { type: "figure", id: "venn3", for: "ix2", caption: "Three-set inclusion–exclusion for multiples of 2, 3, 5 up to 100.", alt: "50 + 33 + 20 minus 16, 10, 6 plus 3 equals 74.", fig: { kind: "strip", items: [{ label: "Singles", sub: "50 + 33 + 20", state: "done" }, { label: "− Pairs", sub: "16 + 10 + 6", state: "done" }, { label: "+ Triple", sub: "3", state: "done" }, { label: "Union", sub: "74", state: "now" }] } },
    { type: "example", id: "ix2", level: "gate", title: "Divisible by none", given: "Integers from 1 to 100.", find: "How many are divisible by none of 2, 3 and 5?",
      steps: [
        { say: "Singles: 50 + 33 + 20 = 103." },
        { say: "Pairs: ⌊100/6⌋ + ⌊100/10⌋ + ⌊100/15⌋ = 16 + 10 + 6 = 32. Triple: ⌊100/30⌋ = 3." },
        { say: "Union: 103 − 32 + 3 = 74. None: 100 − 74.", result: "26" },
      ],
      answer: "26.",
      check: "Including 1 and primes such as 7, 11, 13, …, 97, and 49, 77, 91." },
    { type: "example", id: "ix3", level: "edge", title: "Onto functions", given: "Functions from a 5-element set onto a 3-element set.", find: "How many?",
      steps: [
        { say: "3⁵ − C(3,1)·2⁵ + C(3,2)·1⁵ = 243 − 96 + 3." },
        { say: "Total.", result: "150" },
      ],
      answer: "150 onto functions.",
      check: "= 3! · S(5, 3) = 6 · 25." },
    { type: "lab", lab: "derange" },
    { type: "faded", title: "Your turn", given: "Permutations of {1, 2, 3, 4} with exactly one fixed point.",
      steps: [{ say: "Count them.", blank: true, answer: "C(4, 1) · D₃ = 4 · 2 = 8." }] },
    { type: "trap", wrong: "|A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B ∩ C|.", tempting: "Subtract the overlap once.", whyWrong: "Pairwise overlaps must be subtracted and the triple added back.", rule: "+ singles − pairs + triple." },
    { type: "trap", wrong: "Derangements of n = n! − n.", tempting: "Remove the n ways to fix one item.", whyWrong: "Permutations fixing several items get removed more than once; inclusion–exclusion is needed.", rule: "Dₙ = n! Σ (−1)ᵏ/k!." },
    { type: "gate", text: "GATE asks derangement counts and probabilities, 'divisible by none of' counts, onto functions, and Venn-style survey questions. Write the alternating sum term by term." },
    { type: "recall", cards: [{ q: "D₄, D₅", a: "9, 44" }, { q: "Derangement probability → ", a: "1/e ≈ 0.368" }, { q: "Onto 5 → 3", a: "150" }] },
    { type: "check", questions: [
      { id: "ie1", kind: "NAT", marks: 1, q: "D₅ (derangements of 5 items)?", answer: "44", solution: "4(D₄ + D₃)." },
      { id: "ie2", kind: "NAT", marks: 2, q: "Integers from 1 to 100 divisible by none of 2, 3, 5?", answer: "26", solution: "100 − 74." },
      { id: "ie3", kind: "NAT", marks: 2, q: "Onto functions from a 5-element set to a 3-element set?", answer: "150", solution: "243 − 96 + 3." },
      { id: "ie4", kind: "NAT", marks: 1, q: "Permutations of 4 items with exactly one fixed point?", answer: "8", solution: "4 · D₃." },
      { id: "ie5", kind: "MCQ", marks: 1, q: "For large n, the probability that a random permutation has no fixed point is about", options: ["0", "1/2", "1/e", "1 − 1/e"], answer: "C", solution: "≈ 0.368." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Discrete Mathematics", sub: "Inclusion–exclusion", href: "/topics/discrete-mathematics" },
      { label: "Topic 1: counting models", sub: "The basic formulas", href: "/study/counting" },
      { label: "Probability", sub: "Matching problems", href: "/topics/probability-and-statistics" },
    ] },
    { type: "links", prereq: ["Topic 1"], usedIn: ["Probability"], cross: ["Probability: complements"] },
  ],
};

const recur: Topic = {
  id: "cs.dm.recur.linear",
  title: "Linear recurrence relations",
  blocks: [
    { type: "hook", text: "Moving n discs in the Tower of Hanoi takes 2ⁿ − 1 moves. That formula comes straight from one line, Tₙ = 2Tₙ₋₁ + 1, and a method that solves every recurrence of this shape." },
    { type: "objectives", items: ["Set up a recurrence from a counting problem.", "Solve linear homogeneous recurrences with distinct and repeated roots.", "Handle a constant or polynomial non-homogeneous term."] },
    { type: "intuition", paras: ["A recurrence defines each term from earlier ones. Many counting problems split on the first choice: a string of length n either starts with this or with that, leaving a shorter problem.", "For aₙ = c₁aₙ₋₁ + c₂aₙ₋₂, guess aₙ = rⁿ. Dividing by rⁿ⁻² gives the characteristic equation r² = c₁r + c₂. Distinct roots r₁, r₂ give aₙ = A r₁ⁿ + B r₂ⁿ; a repeated root r gives aₙ = (A + Bn) rⁿ. Initial values fix A and B.", "With an extra constant (non-homogeneous), add a particular solution, often a constant, to the homogeneous one."], analogyLimit: "Like compound interest; but two terms back means two growth rates mixed together, weighted by the starting values." },
    { type: "definition", name: "Solving aₙ = c₁aₙ₋₁ + c₂aₙ₋₂", text: "Characteristic equation r² − c₁r − c₂ = 0.", items: ["Distinct roots: aₙ = A r₁ⁿ + B r₂ⁿ.", "Repeated root r: aₙ = (A + Bn) rⁿ.", "Non-homogeneous + f(n): add a particular solution of the same form as f(n) (multiply by n if it clashes with a root).", "Fibonacci: r² = r + 1, roots (1 ± √5)/2."] },
    { type: "deep", sections: [
      { h: "Setting up recurrences", points: ["Binary strings of length n with no two consecutive 1s: sₙ = sₙ₋₁ + sₙ₋₂ (start with 0, or with 10). s₁ = 2, s₂ = 3: Fibonacci shifted.", "Tilings of a 2 × n board with dominoes: same recurrence.", "Regions formed by n lines in general position: Lₙ = Lₙ₋₁ + n, so Lₙ = 1 + n(n + 1)/2.", "Hanoi: Tₙ = 2Tₙ₋₁ + 1."], paras: [] },
      { h: "Particular solutions", paras: ["For aₙ = 2aₙ₋₁ + 1, try a constant c: c = 2c + 1 gives c = −1. The homogeneous part is A·2ⁿ, so aₙ = A·2ⁿ − 1; a₀ = 0 gives A = 1: 2ⁿ − 1. If f(n) = kⁿ and k is a root, try c·n·kⁿ instead."] },
      { h: "Divide-and-conquer recurrences", paras: ["T(n) = aT(n/b) + f(n) is not linear in this sense; it is solved by the master theorem (Algorithms). Substituting n = 2ᵏ turns T(n) = 2T(n/2) + n into tₖ = 2tₖ₋₁ + 2ᵏ, whose solution k·2ᵏ gives n log n."] },
      { h: "Checking a closed form", paras: ["Always test the formula on a₀, a₁, a₂ against the recurrence. A wrong sign in the characteristic equation (r² = c₁r + c₂ versus r² + c₁r + c₂) is the most common slip."] },
    ] },
    { type: "walkthrough", steps: ["Write the characteristic equation r² = c₁r + c₂.", "Find the roots; choose the distinct or repeated-root form.", "Use a₀ and a₁ to solve for A and B.", "Check a₂ from the recurrence against the formula."], prompt: { q: "What form does the solution take if the roots are both 2?", a: "aₙ = (A + Bn)·2ⁿ." } },
    { type: "figure", id: "rec-seq", caption: "aₙ = 5aₙ₋₁ − 6aₙ₋₂ with a₀ = 1, a₁ = 4.", alt: "Terms 1, 4, 14, 46, 146, 454 matching 2·3ⁿ − 2ⁿ.", fig: { kind: "matrix", title: "Sequence vs formula", cols: ["n=0", "1", "2", "3", "4", "5"], rows: [{ label: "aₙ", cells: [1, 4, 14, 46, 146, 454] }, { label: "2·3ⁿ − 2ⁿ", cells: [1, 4, 14, 46, 146, 454], hl: true }] } },
    { type: "example", id: "rx1", level: "gate", title: "Distinct roots", given: "aₙ = 5aₙ₋₁ − 6aₙ₋₂, a₀ = 1, a₁ = 4.", find: "A closed form.",
      steps: [
        { say: "r² = 5r − 6 → (r − 2)(r − 3) = 0: roots 3 and 2." },
        { say: "aₙ = A·3ⁿ + B·2ⁿ. a₀: A + B = 1. a₁: 3A + 2B = 4." },
        { say: "A = 2, B = −1.", result: "aₙ = 2·3ⁿ − 2ⁿ" },
      ],
      answer: "aₙ = 2·3ⁿ − 2ⁿ.",
      check: "a₂ = 18 − 4 = 14 = 5·4 − 6·1." },
    { type: "figure", id: "rec-rep", for: "rx2", caption: "Repeated root: aₙ = 4aₙ₋₁ − 4aₙ₋₂, a₀ = 1, a₁ = 6.", alt: "1, 6, 20, 56, 144 matching (1 + 2n)2ⁿ.", fig: { kind: "matrix", title: "Sequence vs formula", cols: ["n=0", "1", "2", "3", "4"], rows: [{ label: "aₙ", cells: [1, 6, 20, 56, 144] }, { label: "(1 + 2n)·2ⁿ", cells: [1, 6, 20, 56, 144], hl: true }] } },
    { type: "example", id: "rx2", level: "gate", title: "A repeated root", given: "aₙ = 4aₙ₋₁ − 4aₙ₋₂, a₀ = 1, a₁ = 6.", find: "A closed form.",
      steps: [
        { say: "r² − 4r + 4 = (r − 2)² : root 2, repeated." },
        { say: "aₙ = (A + Bn)·2ⁿ. a₀ = A = 1. a₁ = (1 + B)·2 = 6 → B = 2.", result: "aₙ = (1 + 2n)·2ⁿ" },
      ],
      answer: "aₙ = (1 + 2n)·2ⁿ.",
      check: "a₃ = 7·8 = 56 = 4·20 − 4·6." },
    { type: "example", id: "rx3", level: "edge", title: "Strings with no two consecutive 1s", given: "sₙ = number of binary strings of length n with no '11'.", find: "s₅.",
      steps: [
        { say: "A valid string starts with 0 (then any valid string of length n − 1) or with 10 (then length n − 2): sₙ = sₙ₋₁ + sₙ₋₂." },
        { say: "s₁ = 2, s₂ = 3, s₃ = 5, s₄ = 8.", result: "s₅ = 13" },
      ],
      answer: "13.",
      check: "sₙ = Fₙ₊₂ (Fibonacci with F₁ = F₂ = 1): F₇ = 13." },
    { type: "lab", lab: "recur" },
    { type: "faded", title: "Your turn", given: "Tₙ = 2Tₙ₋₁ + 1, T₀ = 0 (Tower of Hanoi).",
      steps: [{ say: "Closed form and T₁₀?", blank: true, answer: "Tₙ = 2ⁿ − 1; T₁₀ = 1023." }] },
    { type: "trap", wrong: "With a repeated root r, aₙ = A rⁿ + B rⁿ.", tempting: "Two roots, two terms.", whyWrong: "That is just (A + B) rⁿ: one free constant, not enough to fit two initial values.", rule: "Repeated root: (A + Bn) rⁿ." },
    { type: "trap", wrong: "The characteristic equation of aₙ = 5aₙ₋₁ − 6aₙ₋₂ is r² + 5r − 6 = 0.", tempting: "Copying the coefficients directly.", whyWrong: "Move everything to one side: r² − 5r + 6 = 0, roots 2 and 3.", rule: "r² − c₁r − c₂ = 0." },
    { type: "gate", text: "GATE asks closed forms of given recurrences, the n-th term, setting up recurrences for strings or tilings, and Fibonacci-type counts. Always check the answer against the first three terms." },
    { type: "recall", cards: [{ q: "Distinct roots form", a: "A r₁ⁿ + B r₂ⁿ" }, { q: "Hanoi closed form", a: "2ⁿ − 1" }, { q: "No '11' strings of length n", a: "Fₙ₊₂" }] },
    { type: "check", questions: [
      { id: "rc1", kind: "NAT", marks: 2, q: "aₙ = 5aₙ₋₁ − 6aₙ₋₂, a₀ = 1, a₁ = 4. a₄ = ?", answer: "146", solution: "2·81 − 16." },
      { id: "rc2", kind: "NAT", marks: 2, q: "aₙ = 4aₙ₋₁ − 4aₙ₋₂, a₀ = 1, a₁ = 6. a₃ = ?", answer: "56", solution: "(1 + 6)·8." },
      { id: "rc3", kind: "NAT", marks: 1, q: "Binary strings of length 5 with no two consecutive 1s?", answer: "13", solution: "Fibonacci." },
      { id: "rc4", kind: "NAT", marks: 1, q: "Moves to solve the Tower of Hanoi with 10 discs?", answer: "1023", solution: "2¹⁰ − 1." },
      { id: "rc5", kind: "MCQ", marks: 2, q: "The general solution of aₙ = 6aₙ₋₁ − 9aₙ₋₂ is", options: ["A·3ⁿ + B·(−3)ⁿ", "(A + Bn)·3ⁿ", "A·6ⁿ + B·9ⁿ", "A·3ⁿ"], answer: "B", solution: "(r − 3)², repeated root." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Discrete Mathematics", sub: "Recurrences", href: "/topics/discrete-mathematics" },
      { label: "Algorithms: recurrences", sub: "Master theorem", href: "/topics/algorithms" },
      { label: "Topic 2: generating functions", sub: "Another way to solve them", href: "/study/recurrences" },
    ] },
    { type: "links", prereq: ["Counting"], usedIn: ["Algorithm analysis"], cross: ["Algorithms: master theorem"] },
  ],
};

const genfun: Topic = {
  id: "cs.dm.recur.gf",
  title: "Generating functions",
  blocks: [
    { type: "hook", text: "How many ways can three dice show a total of 10? Multiply (x + x² + … + x⁶) by itself three times and read the coefficient of x¹⁰: 27. Generating functions turn counting into polynomial multiplication." },
    { type: "objectives", items: ["Write the generating function of a sequence and read coefficients.", "Count bounded integer solutions with a product of polynomials.", "Recognise Catalan numbers and the standard series."] },
    { type: "intuition", paras: ["The generating function of a₀, a₁, a₂, … is G(x) = a₀ + a₁x + a₂x² + …. The variable x is just a place-holder; the coefficients carry the information.", "Multiplying generating functions convolves their sequences: the coefficient of xⁿ in A(x)B(x) counts ways to split n as i + j with a-ways for i and b-ways for j. So each independent choice is a factor, and its allowed values are the exponents.", "A few series do almost all the work: 1/(1 − x) = 1 + x + x² + …, 1/(1 − x)ᵏ = Σ C(n + k − 1, k − 1)xⁿ, and (1 − xᵐ)/(1 − x) = 1 + x + … + xᵐ⁻¹."], analogyLimit: "Like a clothesline holding numbers on pegs 0, 1, 2, …; multiplying two lines adds up every way of reaching each peg." },
    { type: "definition", name: "Standard series", text: "Useful identities:", items: ["1/(1 − x) = Σ xⁿ; 1/(1 − ax) = Σ aⁿxⁿ.", "1/(1 − x)ᵏ = Σ C(n + k − 1, k − 1) xⁿ.", "(1 + x)ⁿ = Σ C(n, k) xᵏ.", "Bounded choice 0 ≤ xᵢ ≤ m: factor (1 + x + … + xᵐ). At least ℓ: factor xˡ/(1 − x).", "Catalan: Cₙ = C(2n, n)/(n + 1): 1, 1, 2, 5, 14, 42, 132."] },
    { type: "deep", sections: [
      { h: "Solving a recurrence with a generating function", paras: ["For aₙ = 2aₙ₋₁ + 1 with a₀ = 0: multiply by xⁿ and sum: G − 0 = 2xG + x/(1 − x), so G = x/((1 − x)(1 − 2x)) = 1/(1 − 2x) − 1/(1 − x). Reading coefficients: aₙ = 2ⁿ − 1."] },
      { h: "Catalan numbers", points: ["Valid bracket sequences with n pairs: Cₙ.", "Binary trees with n nodes (shapes): Cₙ. Full binary trees with n + 1 leaves: Cₙ.", "Ways to triangulate a convex (n + 2)-gon: Cₙ.", "Monotone lattice paths that never cross the diagonal: Cₙ."], paras: [] },
      { h: "Exponential generating functions", paras: ["For arrangements (labelled objects), use Σ aₙ xⁿ/n!. The EGF of all permutations is 1/(1 − x), and of derangements e⁻ˣ/(1 − x), which is where Dₙ ≈ n!/e comes from."] },
      { h: "Partitions of an integer", paras: ["The number of ways to write n as a sum of positive integers (order ignored) has generating function Π 1/(1 − xᵏ). With distinct parts: Π (1 + xᵏ). These equal the number of partitions into odd parts (Euler)."] },
    ] },
    { type: "walkthrough", steps: ["One factor per variable (or choice).", "Each factor lists the allowed values as exponents.", "Multiply (or use the closed forms) and find the coefficient of xⁿ.", "For upper bounds, subtract with (1 − xᵐ⁺¹) or just multiply small polynomials."], prompt: { q: "What factor represents a variable that can be 0, 1 or 2?", a: "1 + x + x²." } },
    { type: "figure", id: "gf-bounded", caption: "x₁ + x₂ + x₃ = 8 with x₁ ≤ 3, x₂ ≤ 4, x₃ ≤ 5.", alt: "Coefficient of x⁸ in the product is 14.", fig: { kind: "strip", items: [{ label: "(1+x+x²+x³)", sub: "x₁ ≤ 3", state: "done" }, { label: "(1+…+x⁴)", sub: "x₂ ≤ 4", state: "done" }, { label: "(1+…+x⁵)", sub: "x₃ ≤ 5", state: "done" }, { label: "[x⁸]", sub: "14", state: "now" }] } },
    { type: "example", id: "gx1", level: "gate", title: "Bounded solutions", given: "x₁ + x₂ + x₃ = 8 with 0 ≤ x₁ ≤ 3, 0 ≤ x₂ ≤ 4, 0 ≤ x₃ ≤ 5.", find: "The number of integer solutions.",
      steps: [
        { say: "Unbounded: C(10, 2) = 45." },
        { say: "Subtract violations: x₁ ≥ 4: C(6, 2) = 15; x₂ ≥ 5: C(5, 2) = 10; x₃ ≥ 6: C(4, 2) = 6. Pairs: x₁ ≥ 4 and x₂ ≥ 5 would need 9 > 8, so none; likewise the others." },
        { say: "45 − 31.", result: "14" },
      ],
      answer: "14, the coefficient of x⁸ in (1 + … + x³)(1 + … + x⁴)(1 + … + x⁵).",
      check: "The lab multiplies the three polynomials and highlights x⁸ = 14." },
    { type: "figure", id: "catalan", for: "gx2", caption: "Catalan numbers.", alt: "C0 to C6: 1, 1, 2, 5, 14, 42, 132.", fig: { kind: "matrix", title: "Cₙ = C(2n, n)/(n + 1)", cols: ["0", "1", "2", "3", "4", "5", "6"], rows: [{ label: "Cₙ", cells: [1, 1, 2, 5, 14, 42, 132], hl: true }] } },
    { type: "example", id: "gx2", level: "gate", title: "Counting binary tree shapes", given: "Binary trees with 4 nodes (distinct shapes, unlabelled).", find: "How many?",
      steps: [
        { say: "Shapes satisfy Tₙ = Σ Tᵢ Tₙ₋₁₋ᵢ: the Catalan recurrence." },
        { say: "C₄ = C(8, 4)/5 = 70/5.", result: "14" },
      ],
      answer: "14 shapes.",
      check: "With labels 1–4 placed as a BST, still 14: each shape gives exactly one BST." },
    { type: "example", id: "gx3", level: "edge", title: "Digits with a fixed sum", given: "4-digit strings (0000 to 9999) whose digits add up to 12.", find: "How many?",
      steps: [
        { say: "Unbounded: C(15, 3) = 455." },
        { say: "Subtract strings with some digit ≥ 10: 4 · C(5, 3) = 40 (two such digits would need 20 > 12)." },
        { say: "455 − 40.", result: "415" },
      ],
      answer: "415.",
      check: "Coefficient of x¹² in (1 + x + … + x⁹)⁴." },
    { type: "lab", lab: "genfun" },
    { type: "faded", title: "Your turn", given: "x₁ + x₂ + x₃ = 10 with each xᵢ ≥ 1.",
      steps: [{ say: "Count via generating functions.", blank: true, answer: "Coefficient of x¹⁰ in (x/(1 − x))³ = coefficient of x⁷ in 1/(1 − x)³ = C(9, 2) = 36." }] },
    { type: "trap", wrong: "Upper bounds can be ignored if they look large.", tempting: "Most solutions satisfy them anyway.", whyWrong: "Any bound below n removes solutions; check whether a variable could exceed it.", rule: "Subtract every violation (or multiply the bounded factors)." },
    { type: "trap", wrong: "Cₙ = C(2n, n).", tempting: "The central binomial coefficient is close.", whyWrong: "Catalan divides by n + 1: C₄ = 70/5 = 14, not 70.", rule: "Cₙ = C(2n, n)/(n + 1)." },
    { type: "gate", text: "GATE asks coefficients of products (often as 'number of solutions with constraints'), Catalan counts of trees or bracket sequences, and generating functions of simple sequences." },
    { type: "recall", cards: [{ q: "1/(1 − x)ᵏ coefficient of xⁿ", a: "C(n + k − 1, k − 1)" }, { q: "C₄", a: "14" }, { q: "Factor for 0 ≤ x ≤ m", a: "1 + x + … + xᵐ" }] },
    { type: "check", questions: [
      { id: "gf1", kind: "NAT", marks: 2, q: "Solutions of x₁ + x₂ + x₃ = 8 with x₁ ≤ 3, x₂ ≤ 4, x₃ ≤ 5 (non-negative)?", answer: "14", solution: "45 − 15 − 10 − 6." },
      { id: "gf2", kind: "NAT", marks: 1, q: "Number of distinct binary tree shapes with 4 nodes?", answer: "14", solution: "C₄." },
      { id: "gf3", kind: "NAT", marks: 2, q: "4-digit strings whose digits sum to 12?", answer: "415", solution: "455 − 40." },
      { id: "gf4", kind: "NAT", marks: 1, q: "Solutions of x₁ + x₂ + x₃ = 10 with each xᵢ ≥ 1?", answer: "36", solution: "C(9, 2)." },
      { id: "gf5", kind: "MCQ", marks: 1, q: "The generating function of 1, 2, 4, 8, … is", options: ["1/(1 − x)", "1/(1 − 2x)", "2/(1 − x)", "1/(1 − x)²"], answer: "B", solution: "Σ 2ⁿxⁿ." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Discrete Mathematics", sub: "Generating functions", href: "/topics/discrete-mathematics" },
      { label: "Topic 1: recurrences", sub: "Characteristic equations", href: "/study/recurrences" },
      { label: "Data Structures: BSTs", sub: "Catalan counts of trees", href: "/topics/data-structures" },
    ] },
    { type: "links", prereq: ["Counting", "Recurrences"], usedIn: ["Algorithm analysis"], cross: ["Data Structures: tree counting"] },
  ],
};

export const DM_COUNT: Chapter = {
  id: "cs.dm.count", subject: "Discrete Mathematics", title: "Counting and combinatorics",
  syllabus: ["CS · Discrete Mathematics: Combinatorics: counting"], pyqTopic: /combinator|counting|permutation|pigeonhole/i,
  map: { kind: "strip", items: [{ label: "1. Counting models", sub: "P, C, stars and bars", state: "done" }, { label: "2. Inclusion–exclusion", sub: "derangements", state: "done" }] },
  topics: [counting, inclusion],
};
export const DM_RECUR: Chapter = {
  id: "cs.dm.recur", subject: "Discrete Mathematics", title: "Recurrences and generating functions",
  syllabus: ["CS · Discrete Mathematics: Recurrence relations, generating functions"], pyqTopic: /recurrence|generating function/i,
  map: { kind: "strip", items: [{ label: "1. Linear recurrences", sub: "characteristic roots", state: "done" }, { label: "2. Generating functions", sub: "coefficients, Catalan", state: "done" }] },
  topics: [recur, genfun],
};
