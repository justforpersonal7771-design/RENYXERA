## PART 1. FEELINGS

1. Reading `Part B` felt daunting right from the start: look at the difficulty column in `Part B.3` — **31 Hard and 34 Medium questions out of 75 (only 10 Easy!)**, making Discrete Math the toughest theory hurdle in GATE!
2. When I opened `Part C`, I panicked immediately at Question 1: nested quantifiers `∃y ∀x (x ≠ y -> ...)`, `A = A^{-1}`, `Z_2 × Z_3 × Z_4`, `tr(A^3)/6`, `OGF (1+z)/(1-z)^3`, and `Hasse lattice` hit me with zero warm-up!
3. There is NO **Chapter 00** teaching basic **Proof Techniques (Contrapositive, Contradiction, Induction `2025_AN_Q15`)**, **Modular Arithmetic (`3^{51} mod 5`)**, or **Divisibility / Prime Factorization (`2026_AN_Q26`, `2019_FN_Q54`)**, yet Ch 01–06 expect them right away!
4. Worse, `2021_FN_Q27` has a broken formula (`-> p` printed instead of `-> q`!) that makes its own official key **wrong**, and `2019_FN_Q12` marks BOTH `1` and `(n-1)!/2` `✔ official` with zero note explaining why!
5. `Part B.2` gives only `"3 topics ready"` or `"6 topics ready"` — hiding gigantic GATE subtopics like *FOL Finite Model bounds (`2018_FN_Q38`)*, *Circular Relations (`2021_FN_Q29`)*, *Total Orders (`2024_AN_Q18`)*, *Matchings & Vertex Covers (`2026_FN_Q47`, `2026_FN_Q57`)*, *Vizing's Edge Coloring (`2020_FN_Q53`)*, and *Derangements with Duplicates (`2020_FN_Q52`)*!
6. Notice how `Part B.2` lists `06 Graph theory` as 1 single chapter (`6` topics) while `Part B.3` splits Graphs across `17 + 7 = 24` Qs (`40` marks = **35% of Discrete Math!**) — way too cramped for a beginner!
7. With 100 days left and zero reading-hour or `[MUST]` / `[LATER]` priority tags, a back-bencher could get stuck for weeks on Generating Functions (`9` marks) instead of locking Logic, Graphs, and Counting (`74` marks!).
8. **Would I pay ₹149 for this right now? NO.**
9. Why? Because Discrete Math is where Made Easy/GateWallah lose every back-bencher by throwing symbols before pictures (`Hasse diagrams, Venn buckets, Matrix walks, Bipartite matchings`), and right now `Part B.2` is a bare index with a broken PYQ key (`2021_FN_Q27`).
10. Add Chapter 00 (proofs & modular arithmetic), split Graph Theory cleanly into Core vs Coloring/Matching, draw visual Hasse/Group/Truth-tree pictures for every concept, and fix `2021_FN_Q27` — then I will happily pay ₹149.

---

## PART 2. GAP TABLE

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 1 | `Part B.2` (Missing Ch 00) | Jumps into Logic, Equivalence Relations (`2026_AN_Q26`), and Modulo Groups (`2019_FN_Q21`) without teaching **Proof Techniques (Direct, Contrapositive, Contradiction, Induction `2025_AN_Q15`)**, **Divisibility & Primes (`2019_FN_Q54`)**, and **Modular Arithmetic / Fermat's Little Theorem (`3^{51} mod 5`)**! | MISSING-PREREQUISITE | Add **Chapter 00: Proof Techniques, Divisibility & Modular Arithmetic** before Ch 01. | HIGH |
| 2 | `Part B.2` (Whole outline) | Only lists `"3 topics ready"`..`"6 topics ready"` with zero lesson names, finer points, traces, or diagrams. | STEP-SKIPPED | Replace this v0 outline with the complete lesson-by-lesson syllabus (Part 5). | HIGH |
| 3 | `Part B.2` & `Part B.3` (100-day plan) | No study hours and no `[MUST]` / `[SHOULD]` / `[LATER]` guidance for 100-day droppers (`Hard` questions = `31/75`!). | TOO-LONG-BORING | Tag every lesson with time estimate and GATE priority so medium/guaranteed topics come before `Hard` olympiad-style outliers. | HIGH |
| 4 | `Ch 01 Prop Logic` (`->` Implication & English Traps!) | Beginners ALWAYS misread English **`"A only if B"` (`A -> B`)**, **`"A when B"` / `"A if B"` (`B -> A`, `2024_AN_Q26`)**, **`"A unless B"` (`¬B -> A`)**, and **`"sufficient vs necessary"`** (`2017_AN_Q31`, `2017_FN_Q29`)! | UNEXPLAINED-WORD | Build a 6-row "English-to-Arrow Translation Cheat Table" with concrete everyday examples (`2024_AN_Q26`, `2017_AN_Q31`). | HIGH |
| 5 | `Ch 01 Prop Logic` (Tautology, Contradiction, Contingency & Fast Falsification!) | Doesn't teach the **Backward Falsification Method** for checking tautologies (`assume RHS = False, force LHS = True` in 10 seconds instead of writing an 8-row truth table! `2021_FN_Q27`, `2021_AN_Q60`, `2017_FN_Q55`)! | MISSING-GATE-CONCEPT | Teach the 3-step Falsification Method + normal forms (`DNF, CNF, PDNF/PCNF`) and Functional Completeness (`{NAND}`, `{NOR}`, `{¬, ->}`). | HIGH |
| 6 | `Ch 01 Prop Logic` (Rules of Inference & Valid Arguments) | Doesn't list **Modus Ponens, Modus Tollens, Hypothetical Syllogism, Resolution, Disjunctive Syllogism**, or **Fallacies** (Affirming the Consequent!). | MISSING-FINER-POINT | Add a Visual Argument-Validity Table + 2 Resolution derivations. | MEDIUM |
| 7 | `Ch 02 First-Order Logic` (Quantifiers & Domain Restriction Traps!) | Beginners ALWAYS get `∀x (P(x) -> Q(x))` vs `∀x (P(x) ∧ Q(x))` and `∃x (P(x) -> Q(x))` vs `∃x (P(x) ∧ Q(x))` backward (`2026_AN_Q11`, `2023_FN_Q26`)! | MISSING-GATE-CONCEPT | Put a giant Red Warning Box: **`∀` pairs with `->`, `∃` pairs with `∧`!** Show concrete tiny-universe counterexamples when swapped! | HIGH |
| 8 | `Ch 02 First-Order Logic` (`"Exactly One"` Pattern & Negating Nested Quantifiers) | `2025_FN_Q48` tests two equivalent ways to write **"Everyone has exactly one mother"** (`∀z (z != y -> ¬M)` vs `¬∃z (z != y ∧ M)`). Nowhere is the `"At least 1 / At most 1 / Exact 1"` template taught! | MISSING-GATE-CONCEPT | Teach the 3 templates (`∃x P`, `∀x∀y (P(x)∧P(y) -> x=y)`, and combined `"Exact 1"`) + quantifier negation flipping (`¬∀ <-> ∃¬`). | HIGH |
| 9 | `Ch 02 First-Order Logic` (Scope Pulling Rules & Valid Equivalences) | `2020_FN_Q46` tests pulling free formula `W` out of `∀x (p(x) -> W)` -> `(∃x p(x)) -> W` (flips `∀` to `∃` when on the LHS of `->`!!)! Students blindly keep `∀`! | MISSING-GATE-CONCEPT | Derive all 4 quantifier-distribution rules with `W` free (`∀x(p->W) ≡ (∃x p)->W` vs `∀x(W->p) ≡ W->(∀x p)`!). | HIGH |
| 10 | `Ch 02 First-Order Logic` (Swapping `∀∃` vs `∃∀` & Non-Empty Domain!) | Doesn't visually prove `∃y ∀x R(x,y) => ∀x ∃y R(x,y)` (and NOT converse! `2017_FN_Q15`), or explain what **"assuming non-empty domain"** means (`∀x P(x) => ∃x P(x)` fails on empty universe!). | NEEDS-DIAGRAM | Draw a 2×2 relation grid comparing `"everyone loves someone"` (`∀x∃y`) vs `"one celebrity loved by all"` (`∃y∀x`). | HIGH |
| 11 | `Ch 02 First-Order Logic` (Model Size Bounds: Bernays-Schönfinkel `∃^* ∀^*`!) | `2018_FN_Q38` tests the **Finite Model Property** (`∃^3 ∀^4` without functions with size-7 model MUST have model of size `<= 3`)! Never taught in brief FOL chapters! | MISSING-GATE-CONCEPT | Explain sub-model restriction (`keep only the witnesses of ∃ variables!`) visually for `∃^k ∀^m` formulas without function symbols (`2018_FN_Q38`). | MEDIUM |
| 12 | `Ch 02 First-Order Logic` (Universe Domain Sensitivity) | `2019_FN_Q54` shows how the EXACT SAME prime-number predicate becomes FALSE on `{1..100}` (`97` has no larger prime!) yet TRUE on `Z^+` and `Z`! | NEEDS-EXAMPLE | Trace `2019_FN_Q54` over `{1..100}`, `Z^+`, and `Z` (checking `1`, `0`, negatives!). | MEDIUM |
| 13 | `Ch 03 Sets & Relations` (Relation Properties & Counting Matrices!) | Never builds the **Relation Property & Matrix Counting Table**: total relations ($2^{n^2}$), Reflexive ($2^{n(n-1)}$, `2020_FN_Q11` prob `0.125`), Irreflexive ($2^{n(n-1)}$), Symmetric ($2^{n(n+1)/2}$), Antisymmetric ($2^n \cdot 3^{n(n-1)/2}$), Asymmetric ($3^{n(n-1)/2}$), **Circular (`2021_FN_Q29`)**, and Equivalence (`Bell numbers`)! | MISSING-GATE-CONCEPT | Teach both matrix visual patterns (`diagonal` & `upper/lower triangle pairs`) + exact counting formulas + Circular relation traps! | HIGH |
| 14 | `Ch 03 Sets & Relations` (Equivalence Relations, Partitions & Quotient Maps!) | Doesn't connect **Equivalence Classes $\leftrightarrow$ Disjoint Partitions** (`2026_AN_Q26` squarefree partition, `2019_FN_Q35` conjugacy in groups!), or prove **Quotient Map Well-Definedness & Bijection (`2023_FN_Q49`)**! | NEEDS-DIAGRAM | Draw `A` partitioned into equivalence buckets `[x]` mapping 1-to-1 onto `B` via `F([x]) = f(x)` (`2023_FN_Q49`)! | HIGH |
| 15 | `Ch 03 Functions` (Injective, Surjective, Bijective & Composition Rules!) | Misses: (1) formulas for # of **functions ($n^m$)**, **injections ($P(n, m)$)**, **surjections (`Stirling / PIE`: $\sum (-1)^k \binom{n}{k}(n-k)^m$)**, **bijections ($n!$)**; (2) **Composition lemmas** (`f \circ g` onto $\implies f$ onto, NOT `g`! `2025_FN_Q17`; `f \circ g` 1-1 $\implies g$ 1-1, NOT `f`!); (3) Pigeonhole bijection cardinality tricks (`2024_FN_Q28`, `2021_AN_Q27`)! | MISSING-GATE-CONCEPT | Draw arrow-mapping diagrams proving BOTH composition rules (`f \circ g` onto vs 1-1, `2025_FN_Q17`) + formula table for function counts! | HIGH |
| 16 | `Ch 03 Sets` (Countability & Uncountability of Functions / Subsets!) | `2018_FN_Q37` asks which of `Q` (rationals), `{0,1} -> N`, `N -> {0,1}`, and `finite subsets of N` are countable! Never contrasts **$|\mathbb{N}^k| = \aleph_0$ (countable)** vs **$|\{0,1\}^\mathbb{N}| = 2^{\aleph_0}$ (uncountable)**! | MISSING-GATE-CONCEPT | Add a Countability Matrix (`N, Z, Q, N^k, finite subsets of N` = countable vs `R, P(N), {0,1}^N` = uncountable) (`2018_FN_Q37`). | HIGH |
| 17 | `Ch 04 POSETs & Lattices` (POSET, Hasse Diagram Rules & Special Elements!) | Never walks through **how to draw a Hasse Diagram** (remove self-loops -> remove transitive shortcuts -> draw strictly upwards without arrows!), or distinguishes **Maximal/Minimal** vs **Greatest/Least** vs **Upper/Lower Bounds** vs **LUB (Join) / GLB (Meet)**! | UNEXPLAINED-WORD | Step-by-step Hasse construction frames (`remove reflexive -> remove transitive -> point up`) + diagram contrasting Maximal vs Greatest! | HIGH |
| 18 | `Ch 04 POSETs & Lattices` (Counting Linear Extensions / Total Orders!) | `2024_AN_Q18` asks **how many Total Orders contain a Partial Order `P`** (`5`)! Beginners have zero systematic method (topological sorts of Hasse diagram!). | MISSING-GATE-CONCEPT | Trace counting valid topological sorts of a 4-node Hasse diagram (`2024_AN_Q18`: `5`). | HIGH |
| 19 | `Ch 04 Lattices` (Lattice Checks, Pointwise Function Lattice, Sublattices & Types!) | Misses: (1) testing whether Hasse diagram is a **Lattice (`every pair has unique LUB and GLB`)** & min edges/pairs to add (`2017_AN_Q28`), (2) **Pointwise Function Lattice `({0,1}^n, <=)`** (`2025_AN_Q42`), (3) **Bounded, Distributive ($M_3, N_5$ forbidden!), Complemented, and Boolean Algebras (`2^k` elements!)**! | MISSING-GATE-CONCEPT | Draw $M_3$ (diamond, non-distributive) and $N_5$ (pentagon, non-modular/non-distributive, `2017_AN_Q28`) + Boolean Algebra `2^k` rule! | HIGH |
| 20 | `Ch 05 Monoids & Groups` (Algebraic Hierarchy: Groupoid -> Semigroup -> Monoid -> Group -> Abelian!) | Doesn't visually map the 4 axioms (**Closure, Associativity, Identity, Inverse**) + **Commutativity** into the ladder (`2025_FN_Q49` `(N^N, +)` is Abelian Monoid; `2024_FN_Q65` checking associativity & distributivity of custom operators `◇, □`!)! | NEEDS-DIAGRAM | Draw the 5-step Algebraic Axiom Ladder + test custom operators (`◇, □`) cleanly (`2024_FN_Q65`, `2025_FN_Q49`). | HIGH |
| 21 | `Ch 05 Groups` (Group Identities, Subgroups, Lagrange's Theorem & Cyclic Groups!) | Misses: (1) **Self-inverse / Exponent-2 Abelian proof (`x^2 = 1 => Abelian`, `(xy)^2 = x^2 y^2 => Abelian`, `2022_FN_Q27`)**, (2) **Power-Set Symmetric Difference Group `(2^X, Δ)` (`2023_FN_Q51`)**, (3) **Lagrange's Theorem (`|H|` divides `|G|`, `2020_FN_Q32`: `7`, `2018_FN_Q29`: `42`)**, (4) **Prime-order groups ALWAYS cyclic (`2021_FN_Q52`: order 6 proper subgroup has order 2 or 3 -> always cyclic!)**, and (5) **Counting Self-Inverse Elements in Direct Products `Z_2 × Z_3 × Z_4` (`2024_AN_Q41`: `4`)**! | MISSING-GATE-CONCEPT | Dedicate a full Group Theorems & Subgroups lesson solving `2024_AN_Q41`, `2023_FN_Q51`, `2022_FN_Q27`, `2021_FN_Q52`, `2020_FN_Q32`, `2019_FN_Q35`! | HIGH |
| 22 | `Ch 05 Groups` (Generators of $Z_n$ & Euler's $\phi(n)$ + Order of Elements!) | Doesn't teach **finding order of an element `ord(a)`** (`lcm` in $Z_m \times Z_n$), **counting generators of cyclic group $Z_n$ ($\phi(n)$ generators!)**, or **Fermat/Euler modular exponentiation (`3^{51} mod 5`, `2019_FN_Q21`)**! | MISSING-GATE-CONCEPT | Add an Element Order & Generators box ($\text{ord}(a) \mid |G|$, # generators = $\phi(n)$) + modular power trace! | MEDIUM |
| 23 | `Ch 06 Graphs` (Chapter Too Cramped: `24/75` PYQs = `35%` of DM!) | Lumps ALL of Graph Theory (`Handshake, Trees, Cayley, Planar, Euler/Hamilton, Adjacency Matrix Powers, Independent Set, Vertex Cover, Matching, Coloring`) into ONE chapter! Beginners drown! | TOO-LONG-BORING | Split `06 Graph Theory` cleanly into **Ch 06A: Graph Basics, Matrices, Connectivity, Trees & Planarity** and **Ch 06B: Traversals (Euler/Hamilton), Matching, Cover & Coloring**! | HIGH |
| 24 | `Ch 06 Graphs` (Handshaking Lemma, Max Edges & Disconnected Bounds!) | Misses **Handshaking Lemma (`\sum deg = 2|E|`, `2017_AN_Q16`: `3n <= 50 => n <= 16`)**, **Sum of tree degrees (`2n - 2`, `2017_FN_Q19`)**, **Max edges in disconnected simple graph ($\binom{n-1}{2}$, `2022_FN_Q30`: `36`)**, and **Max BFS tree height (`>= diam/2`, `2025_FN_Q43`: `15`)**! | MISSING-GATE-CONCEPT | Build a "Degree, Edges & Connectivity Bounds" formula card solving `2025_FN_Q43`, `2022_FN_Q30`, `2017_FN_Q19`, `2017_AN_Q16`. | HIGH |
| 25 | `Ch 06 Graphs` (Adjacency Matrix Powers $A^2, A^3$, Traces & Diameters!) | Completely misses **Walk-Counting Theorem (`(A^k)_{ij} = walks of exact length k`)**: `diag(A^2) = degrees` (`2022_FN_Q52`), `tr(A^3)/6 = triangles` (`2022_FN_Q37`), `A = A^{-1} <=> Perfect Matching` (`2024_AN_Q15`), and `G_2 = M + M^2 => diam <= ceil(diam/2)` (`2021_FN_Q35`)! | MISSING-GATE-CONCEPT | Dedicate an entire lesson to **Algebraic Graph Theory (`A, A^2, A^3`)** covering all 4 PYQs! | HIGH |
| 26 | `Ch 06 Graphs` (Counting Spanning Trees: Cayley's $n^{n-2}$, Disjoint Trees, Directed Arborescence & Cycle Parity!) | Misses: **Cayley's $n^{n-2}$ (`2024_FN_Q31`: `16`)**, **Two edge-disjoint spanning trees in $K_n$ (`Jaccard = 0`, `2026_AN_Q36`)**, **Rooted Directed Spanning Trees (`2022_FN_Q58`: `24`)**, and **Even-weight Spanning-Tree Cycle Parity (`2024_AN_Q37`)**! | MISSING-GATE-CONCEPT | Teach Cayley's formula, Matrix-Tree Kirchhoff (brief `[SHOULD]`), DAG parent-product counting (`2022_FN_Q58`), and cycle-parity swaps (`2024_AN_Q37`)! | HIGH |
| 27 | `Ch 06 Graphs` (Graph Isomorphism, Petersen Graph, Permutation Graphs & Powerset BFS!) | Misses **Isomorphism Invariants (`V, E, degree sequence, girth, cycles`) & Petersen Graph (`3-reg, 10V, 15E, girth 5, \chi=3, Ham path yes, Ham cycle no, \alpha=4`, `2022_FN_Q50`)**, **Permutation Swap Graph (`2018_FN_Q53`: `109`)**, and **Powerset Comparability BFS (`2023_FN_Q56`: `7! = 5040`)**! | MISSING-GATE-CONCEPT | Draw the Petersen Graph anatomy card + Isomorphism Checklist + trace `2018_FN_Q53` (`109`). | HIGH |
| 28 | `Ch 06 Graphs` (Planar Graphs: Euler $V - E + F = 2$, $K_5, K_{3,3}$, & Component Formula!) | Doesn't distinguish **Connected Euler (`V - E + F = 2`, `2021_FN_Q24`: `11`)** from **Disconnected $c$ components (`V - E + F = c + 1`)**, or **$E \le 3V - 6$** / **$E \le 2V - 4$ (triangle-free)** & **Kuratowski ($K_5, K_{3,3}$)**! | MISSING-GATE-CONCEPT | Draw Euler's formula on 1 connected + 1 disconnected planar graph and prove why $K_5, K_{3,3}$ are non-planar! | HIGH |
| 29 | `Ch 06 Graphs` (Eulerian vs Hamiltonian Paths/Cycles!) | Misses **Eulerian circuit (`all even deg`) / path (`0 or 2 odd deg`)**, **Hamiltonian counting in $K_n$ (`(n-1)!/2` edge-sets vs `1` up to isomorphism, `2019_FN_Q12`!)**, and **Dirac / Ore theorems**! | MISSING-GATE-CONCEPT | Compare Euler vs Hamilton side-by-side + resolve `2019_FN_Q12` dual-interpretation trap explicitly! | HIGH |
| 30 | `Ch 06 Graphs` (Independent Sets, Vertex Cover, Cliques & Matching!) | Misses: **Gallai's Identity (`\alpha(G) + \tau(G) = n`)**, **König's Theorem (bipartite `max matching = min vertex cover`)**, **Minimum Vertex Cover degree guarantee (`deg >= k+1 => v \in S`, `2026_FN_Q47`)**, and **Counting matchings in a path $P_n$ (`Fibonacci`, `2026_FN_Q57`: `34`)**! | MISSING-GATE-CONCEPT | Draw the `Independent Set <-> Vertex Cover <-> Clique` triangle + trace `2026_FN_Q47` and `2026_FN_Q57` (`34`)! | HIGH |
| 31 | `Ch 06 Graphs` (Vertex Coloring, 2-Coloring, Greedy $\Delta + 1$ & Edge Coloring!) | Misses: **2-colorable <=> Bipartite <=> No odd cycle (`O(V+E)`, `2026_FN_Q55`)**, **Chromatic lower bounds (`\chi >= \omega` & `\chi >= n/\alpha`, `E >= k(k-1)/2`, `2024_FN_Q59`)**, **Brooks' & Greedy coloring (`<= \Delta + 1`, `2023_FN_Q55`)**, and **Vizing's Edge Coloring (`\Delta <= \chi' <= \Delta + 1`, `2020_FN_Q53`: `K_{3,4} + s` = `7`)**! | MISSING-GATE-CONCEPT | Add a Coloring Theorems Cheat Card covering `2-coloring`, `Greedy`, `Brooks'`, `Vizing's`, and `n / \alpha` / `k(k-1)/2` (`2024_FN_Q59`)! | HIGH |
| 32 | `Ch 07 Combinatorics` (Permutations, Parity Matrices & Subsets `(A, B)` with $A \subseteq B$!) | Misses systematic **3-state / Product-Rule Grid Counting**: `4×4` even-parity matrices (`2^{(n-1)^2} = 512`, `2026_FN_Q12`), pairs `(A \subseteq B)` (`3^n = 59049`, `2021_AN_Q37`), pairs `(x \in X)` (`n 2^{n-1}`, `2019_FN_Q26`), and separating disjoint `k`-subsets (`2 \binom{n}{2k}(n-2k)!(k!)^2`, `2023_FN_Q48`)! | MISSING-GATE-CONCEPT | Teach the **"Per-Element Choice Box"** trick (`3` choices per element for $A \subseteq B$; free `(n-1)^2` core for parity matrices)! | HIGH |
| 33 | `Ch 07 Combinatorics` (Stars & Bars, Identical Balls/Bins = Partitions, Stirling S2 & Derangements!) | Beginners ALWAYS confuse the **Twelvefold Way**: **Distinguishable vs Identical Balls × Bins** (`Stars & Bars` vs **Integer Partitions `6` into `<=3` identical bins = `7`, `2022_FN_Q32`** vs **Onto/Stirling `65`, `2021_FN_Q21`**), **Complement adjacent-string counting (`195`, `2025_FN_Q30`)**, **Inclusion-Exclusion (`271`, `2017_FN_Q41`)**, and **Derangements with repeated letters (`LILAC -> 12`, `2020_FN_Q52`)**! | MISSING-GATE-CONCEPT | Build a clean **Balls-into-Bins 2×2 Matrix** (`Dist/Ident × Dist/Ident`) + Derangement formula $D_n$ & `LILAC` case-work! | HIGH |
| 34 | `Ch 08 Recurrences & GF` (Characteristic Equation Roots, Cancellation & Josephus Binary!) | Misses **Linear Homogeneous Recurrences (`distinct` & `repeated` roots, `2024_AN_Q20` cancellation trap where `c_2 = 0` leaves `\Theta(2^n)`!, `2023_FN_Q15` Lucas)** AND **Binary/Divide-by-2 Recurrences (`2022_FN_Q51`: Josephus-style binary representation!)**! | MISSING-GATE-CONCEPT | Trace `2024_AN_Q20` (`c_2 = 0` cancellation!), `2023_FN_Q15`, and `2022_FN_Q51` binary pattern induction! | HIGH |
| 35 | `Ch 08 Generating Functions` (Closed Forms, Derivative/Odd Tricks & Binomial Expansion!) | Misses the **5 Master OGF Identities** (`1/(1-x)`, `1/(1-x)^2`, `1/(1-x)^k = \sum \binom{n+k-1}{k-1} x^n`, odd-term extraction `(f(x) - f(-x))/2`!), needed for `2022_FN_Q36`, `2018_FN_Q11`, and `2017_AN_Q48` (`(1+z)/(1-z)^3` -> `a_3 - a_0 = 15`)! | MISSING-GATE-CONCEPT | Put all 5 OGF Building Blocks on one visual card and trace `2022_FN_Q36`, `2018_FN_Q11`, and `2017_AN_Q48`! | HIGH |
| 36 | `Part C` (`2021_FN_Q27` Key Bug!) | **CRITICAL MIS-TRANSCRIPTION / `FACT-DOUBT`!** Printed `S_1: (¬p ∧ (p ∨ q)) -> p` (`-> p` instead of `-> q`!). With `-> p`, setting `p=F, q=T` makes `S_1` FALSE (`TRUE -> FALSE`), so NEITHER `S_1` nor `S_2` is a tautology (`D`), directly contradicting official key **`B`**! | FACT-DOUBT | Fix `S_1` in `2021_FN_Q27` from `-> p` to `-> q`! | HIGH |
| 37 | `Part C` (`2022_FN_Q51` Typo & `2019_FN_Q12` Dual Key & `2017_FN_Q55` Wording) | `2022_FN_Q51(C)` prints `f(5.2^n)` (looks like decimal `5.2` instead of `5 · 2^n`); `2019_FN_Q12` marks both `C (1)` and `D ((n-1)!/2)` `✔ official` with no note; `2017_FN_Q55` says `"is a contradiction"` meaning *"evaluates to false for this assignment"*! | UNCLEAR-ENGLISH | Fix `5.2^n` -> `5 \cdot 2^n`, explain `2019_FN_Q12` isomorphism vs edge-set ambiguity, and clarify `2017_FN_Q55` assignment wording! | MEDIUM |
| 38 | `Part C` (4 Missing Figures!) | **4 PYQs** (`2024_AN_Q63`, `2022_FN_Q50`, `2018_FN_Q28`, `2017_AN_Q28`) have `[IMAGE_...]` missing (`2017_AN_Q28` is solvable from `R`, while the 3 chromatic/isomorphism graphs aren't!). | NEEDS-DIAGRAM | Restore/transcribe the 3 missing graphs and 1 Hasse diagram into `Part C`. | HIGH |
| 39 | `Part B.2` (Old Standard Warning) | All 29 existing lessons were written *"for people who already know"*, with zero truth-falsification walkthroughs, Hasse diagrams, or combinatorial bijections. | UNCLEAR-ENGLISH | Rewrite from zero with pictures, tables, and step-by-step proofs (Parts 4 & 5). | MEDIUM |

*(Adding 43 more granular rows spread cleanly across Ch 00–08 to reach 80+ rows in Part 2!)*

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 40 | `Ch 00` (Truth & Contradiction Proofs vs Direct Proofs) | Beginners read *"Suppose for contradiction..."* in Ch 06/Ch 07 and lose the thread because they never saw a 3-line contradiction warm-up (e.g. "no largest prime" `2019_FN_Q54`)! | MISSING-PREREQUISITE | Teach Direct, Contrapositive (`¬q -> ¬p`), and Contradiction proofs on tiny integer examples in Ch 00. | MEDIUM |
| 41 | `Ch 00` (Divisibility `a | b` Rules Including `0` and Negatives!) | In `2019_FN_Q54`, `z | x` over `Z` includes negative divisors (`-1 | -2`) and `0` (`any z != 0 divides 0`, `0` divides ONLY `0`)! Beginners miss negative divisors! | MISSING-FINER-POINT | State formal `a | b` definition over `Z` (checking `0` and `-1`) in Ch 00. | MEDIUM |
| 42 | `Ch 01` (Logical Equivalence Laws: Absorption, De Morgan, Implication Rewrite) | Students only memorize truth tables instead of fast algebraic identities **`p -> q ≡ ¬p ∨ q`**, **Contrapositive `¬q -> ¬p` (`2017_FN_Q29`)**, **`(P ∧ Q) -> R ≡ (P ∧ Q) -> (Q -> R)` (`2021_AN_Q60`)**! | STEP-SKIPPED | Put the 10 Logical Equivalence Laws on one card + simplify `2021_AN_Q60` algebraically in 2 lines! | HIGH |
| 43 | `Ch 01` (Vacuous Truth of `FALSE -> ANYTHING`) | Beginners get shocked when `p -> q` is `TRUE` whenever `p` is `FALSE` (`2017_FN_Q55`, `2026_AN_Q11`: `(x != y) -> ...` is TRUE when `x = y`!). | UNEXPLAINED-WORD | Explain `"Promise Principle"` (`if it rains I bring umbrella`: if it didn't rain, I never broke my promise -> TRUE!). | HIGH |
| 44 | `Ch 02` (Why `(x != y) -> ...` vs `(x != y) ∧ ...` with `∀` vs `∃`!) | Look at `2026_AN_Q11`: `(∃y)(∀x)((x != y) -> ...)`! Students ask *"Why didn't they use `∧` instead of `->`?"* (Because `∀x (x != y ∧ ...)` fails immediately when `x = y`!). | NEEDS-EXAMPLE | Show `∀x (x != y ∧ ...)` breaking at `x = y` vs `∀x (x != y -> ...)` passing vacuously at `x = y`! | HIGH |
| 45 | `Ch 02` (Prenex Normal Form & Skolemization — Light Note) | Briefly show moving all quantifiers to the front (`Prenex`) so formulas like `2020_FN_Q46` and `2018_FN_Q38` (`∃^* ∀^*`) look crystal clear! | MISSING-FINER-POINT | Show 2 Prenex conversion examples in Ch 02. | LOW |
| 46 | `Ch 03` (Empty Set `∅`, Power Set `|P(A)| = 2^n`, & Cartesian Product `A × B`) | Clarify `{∅} != ∅`, `∅ ∈ P(A)` AND `∅ ⊆ P(A)`, and `|A × B| = |A|·|B|` (`2024_FN_Q28`, `2021_AN_Q27`). | UNEXPLAINED-WORD | Draw `∅` vs `{∅}` + small 2-element Power Set `P({a,b})` listing all 4 subsets. | MEDIUM |
| 47 | `Ch 03` (Why "Reflexive + Symmetric" Does NOT Imply Transitive!) | `2021_FN_Q29(A)` tests the famous false belief: `aRb, bRc` needn't link `a` to `c`! Needs a 3-node counterexample `(1,2),(2,1),(2,3),(3,2)` missing `(1,3)`! | NEEDS-DIAGRAM | Draw the 3-node directed graph showing Reflexive + Symmetric failing Transitivity (`2021_FN_Q29(A)`). | HIGH |
| 48 | `Ch 03` (Partial Order vs Equivalence vs Asymmetric vs Antisymmetric!) | Beginners ALWAYS confuse **Symmetric** (`(a,b) => (b,a)`), **Asymmetric** (`no (a,b) & (b,a)`, NO loops!), and **Antisymmetric** (`loops (a,a) OK!`, no `(a,b) & (b,a)` for `a != b`)! | UNEXPLAINED-WORD | Draw 3 small directed graphs comparing Symmetric, Antisymmetric (loops allowed!), and Asymmetric (no loops!). | HIGH |
| 49 | `Ch 03` (Symmetric & Transitive Does NOT Imply Reflexive!) | Classic trap: an isolated vertex with ZERO edges has Symmetric + Transitive vacuously true, yet FAILS Reflexivity! (Links directly to `2021_FN_Q29(B)`!). | NEEDS-EXAMPLE | Show `{ (1,1), (1,2), (2,1), (2,2) }` on `{1, 2, 3}` (missing `(3,3)`!) failing Reflexivity! | HIGH |
| 50 | `Ch 03` (How Many Functions / Bijections Between Finite Sets vs Infinite Sets) | Show why `|S1| = |S2|` for `n × n` matrices `{a,b,c}` and `{0..n^2-1} -> {0,1,2}` (`2021_AN_Q27`) by explicit flattening bijection! | NEEDS-EXAMPLE | Draw a 2×2 matrix flattening into indices `0, 1, 2, 3` (`2021_AN_Q27`). | MEDIUM |
| 51 | `Ch 04` (Covers Relation / Immediate Successor in Hasse Diagrams) | Explain that an edge `(x, y)` in a Hasse diagram means **`y` covers `x`** (no intermediate `z` with `x < z < y`), NOT arbitrary `x < y`! | UNEXPLAINED-WORD | Trace turning explicit relation `R` (`2017_AN_Q28`) into its minimal Hasse diagram edges (`a->b->c->e`, `a->d->e`). | MEDIUM |
| 52 | `Ch 04` (Distributive Lattice & Boolean Algebra `2^k` Check) | A lattice is **Boolean Algebra** iff Finite + Bounded + Complemented + Distributive — hence size MUST be **$2^k$** (never `6` or `10`!) and isomorphic to $(2^S, \subseteq)$ (`2025_AN_Q42`!)! | MISSING-FINER-POINT | Show why a 6-element lattice can NEVER be a Boolean Algebra while `({0,1}^n, <=)` ALWAYS is (`2025_AN_Q42`). | HIGH |
| 53 | `Ch 04` (Unique Complements in Distributive vs Multiple Complements in `M_3`!) | In a Distributive lattice, complements (if they exist) are **unique**; in non-distributive `M_3`, elements have 2 complements; in `N_5` (`2017_AN_Q28`), complements aren't unique! | NEEDS-DIAGRAM | Label complements directly on `B_2` (square), `M_3`, and `N_5` Hasse diagrams. | MEDIUM |
| 54 | `Ch 05` (Cayley Multiplication Table Checks for Monoid & Group!) | Beginners don't know how to check Group axioms quickly on a small `4 × 4` Cayley table (**Latin Square property**: every row & column is a permutation of `G`, symmetry across main diagonal = Abelian!). | NEEDS-TRACE | Show a `4 × 4` Cayley table checking Identity row/col, Inverses, and Abelian symmetry! | MEDIUM |
| 55 | `Ch 05` (Uniqueness of Identity & Inverse + Cancellation Law) | Explain *why* `ab = ac => b = c` holds in Groups (exists inverse!) yet FAILS in Monoids like `(N, ×)` or matrices (`det=0`), and why `(ab)^{-1} = b^{-1} a^{-1}` (socks-and-shoes rule, `2022_FN_Q27(B)`)! | STEP-SKIPPED | Prove socks-and-shoes `(ab)^{-1} = b^{-1}a^{-1}` and derive `x^2 = 1 => Abelian` (`2022_FN_Q27(B)`). | HIGH |
| 56 | `Ch 05` (Subgroup One-Step / Finite Test!) | Testing if subset `H` is a subgroup: `a b^{-1} \in H` (and for **finite** groups, **closure `ab \in H` alone** suffices!). | MISSING-FINER-POINT | Add the 1-line Finite Subgroup Closure Shortcut. | MEDIUM |
| 57 | `Ch 05` (Direct Product of Cyclic Groups `Z_m × Z_n` Cyclic IFF `gcd(m, n) = 1`!) | `2024_AN_Q41` uses `Z_2 × Z_3 × Z_4`! Note when `Z_m × Z_n` IS cyclic (`Z_2 × Z_3 \cong Z_6`) vs NOT cyclic (`Z_2 × Z_4` is NOT cyclic -> `4` self-inverses instead of `2`!)! | MISSING-GATE-CONCEPT | Compare `Z_2 × Z_3` (`gcd=1`, cyclic!) vs `Z_2 × Z_4` (`gcd=2`, non-cyclic -> `4` elements of order `<=2`, `2024_AN_Q41`)! | HIGH |
| 58 | `Ch 05` (Converse of Lagrange's Theorem Fails at `A_4`!) | Lagrange says `|H|` divides `|G|`; warn that the converse is FALSE in general (e.g. `A_4` has order `12` and NO subgroup of order `6`), though TRUE for Abelian/Cyclic groups! | MISSING-FINER-POINT | Add a warning box: `|H| divides |G|` (`2020_FN_Q32`, `2018_FN_Q29`), yet converse fails for non-Abelian groups! | LOW |
| 59 | `Ch 05` (Fields & Integral Domains — Light Definition Awareness) | Briefly define **Ring, Integral Domain, Field (`Z_p` for prime `p`)** (`[LATER]` 1-table recap linking `2024_FN_Q65` distributivity). | MISSING-FINER-POINT | Add a tiny 3-line Ring/Field extension at the end of Ch 05. | LOW |
| 60 | `Ch 06` (Graph Degrees: Havel-Hakimi Degree Sequence Validity!) | Missing how to check whether a degree sequence like `[4, 4, 3, 2, 1]` can form a simple graph (**Even sum** + **Havel-Hakimi reduction**!). | MISSING-GATE-CONCEPT | Trace 1 valid and 1 invalid degree sequence via Havel-Hakimi. | MEDIUM |
| 61 | `Ch 06` (Complete `K_n`, Complete Bipartite `K_{m,n}`, Cycles `C_n`, Wheel `W_n`, Hypercube `Q_n`!) | Never gives a cheat card of standard graph families (`V, E, degree, \chi, Euler/Hamilton, bipartite?, planar?`) — needed for `K_n` (`2026_AN_Q36`, `2024_FN_Q31`, `2019_FN_Q12`), `K_{3,4}` (`2020_FN_Q53`), and Hypercube `Q_3`! | NEEDS-DIAGRAM | Build a Standard Graph Families Cheat Table (`K_n, C_n, W_n, K_{m,n}, Q_n, Petersen`). | HIGH |
| 62 | `Ch 06` (Tree Equivalent Characterizations & Spanning Forest Formula) | Show all 5 equivalent definitions of a Tree (`connected + acyclic`, `connected + n-1 edges`, `acyclic + n-1 edges`, `unique path`, `maximally acyclic/minimally connected`). | MISSING-FINER-POINT | Add a 5-equivalence Tree Box + `edges = n - k` for $k$-component forest. | MEDIUM |
| 63 | `Ch 06` (Why `tr(A^3) / 6` Counts Triangles & `diag(A^2)` Counts Degrees!) | In `2022_FN_Q37` & `2022_FN_Q52`, beginners memorize `tr(A^3)/6` without knowing WHY `6` (`3` starting vertices × `2` clockwise/anticlockwise directions per triangle!). | STEP-SKIPPED | Draw ONE triangle `1-2-3` listing all `6` closed length-3 walks `(1->2->3->1, 1->3->2->1, ...)`! | HIGH |
| 64 | `Ch 06` (Directed Spanning Tree Arborescence Counting Trap!) | `2022_FN_Q58` counts directed spanning trees rooted at `5` (`24` = `1·2·3·4`): beginners use undirected Cayley ($5^3 = 125$) instead of counting **independent in-degree parent choices** in a DAG (`in-degree product`)! | NEEDS-TRACE | Draw the `5 -> 4 -> 3 -> 2 -> 1` transitive tournament DAG showing why choosing 1 parent `> i` for each `i` gives `4!` trees (`2022_FN_Q58`)! | HIGH |
| 65 | `Ch 06` (Bridge, Cut-Vertex & Vertex/Edge Connectivity $\kappa \le \lambda \le \delta$) | State Whitney's inequality ($\kappa(G) \le \lambda(G) \le \delta(G)$) and clarify $k$-connected vs $k$-edge-connected. | MISSING-FINER-POINT | Draw a dumbbell/bowtie graph showing $\kappa = 1 < \lambda = 2 < \delta = 3$. | LOW |
| 66 | `Ch 06` (Matching, Maximal vs Maximum Matching & Hall's Marriage Theorem!) | Explain **Perfect Matching (`2024_AN_Q15`)**, **Maximal vs Maximum Matching**, and **Hall's Marriage Theorem** (`|N(S)| >= |S|` in bipartite graphs)! | MISSING-GATE-CONCEPT | Draw a 6-node path/bipartite graph contrasting Maximal (stuck at 1 edge) vs Maximum (`2` edges) vs Perfect Matching! | MEDIUM |
| 67 | `Ch 06` (Vertex Coloring: Chromatic Polynomial of Trees $k(k-1)^{n-1}$ & Cycles!) | Briefly give chromatic numbers of $C_n$ (`2` even, `3` odd), $K_n$ (`n`), $K_{m,n}$ (`2`), Trees (`2`), and chromatic polynomial of a tree ($k(k-1)^{n-1}$)! | MISSING-FINER-POINT | Add a Chromatic Number & Polynomial Quick Box in Ch 06B. | MEDIUM |
| 68 | `Ch 06` (Planarity: Max Edges in Triangle-Free / Girth-$g$ Planar Graphs!) | In `E <= 3V - 6`, beginners forget that **bipartite / triangle-free** planar graphs tighten to **`E <= 2V - 4`** (`proves K_{3,3} non-planar: 9 > 2(6)-4 = 8!`)! | STEP-SKIPPED | Show BOTH `E <= 3V - 6` ($K_5$: `10 > 9`) and `E <= 2V - 4` ($K_{3,3}$: `9 > 8`)! | HIGH |
| 69 | `Ch 07` (Addition Rule vs Multiplication Rule & Symmetry Overcounting) | Beginners write `6!` or `\binom{n}{k}` twice (overcounting `2x` when picking two equal-sized teams!) — `2023_FN_Q48` specifically doubles (`× 2`) ONLY because `(A before B)` vs `(B before A)` are distinguishable! | NEEDS-EXAMPLE | Compare picking 2 labelled teams vs 2 unlabelled teams + trace `2023_FN_Q48`! | MEDIUM |
| 70 | `Ch 07` (Combinations with Repetition: Stars & Bars $x_1 + \dots + x_r = n$) | Distinguish `x_i >= 0` ($\binom{n+r-1}{r-1}$) vs `x_i >= 1` ($\binom{n-1}{r-1}$) vs `x_1 + ... + x_r <= n` (add slack variable $x_{r+1} \ge 0$!). | MISSING-GATE-CONCEPT | Draw 6 identical stars + 2 bars visually proving $\binom{n+r-1}{r-1}$, contrasting with identical bins (`2022_FN_Q32`)! | HIGH |
| 71 | `Ch 07` (Distinguishable Balls into Identical Bins vs Identical Balls into Identical Bins!) | Students confuse **Stirling Numbers of 2nd Kind $S(n, k)$** (distinguishable balls, identical non-empty bins — e.g. `2021_FN_Q21` variant!) with **Integer Partitions $p_k(n)$** (identical balls, identical bins, `2022_FN_Q32`)! | UNCLEAR-ENGLISH | Put the full **Twelvefold Way 2×2 Matrix** (`Dist/Ident Balls × Dist/Ident Bins × Empty OK/No Empty`) in Ch 07! | HIGH |
| 72 | `Ch 07` (Inclusion-Exclusion Principle `|A ∪ B ∪ C|` & Onto Function Formula!) | Show 3-set PIE (`2017_FN_Q41`), Onto functions (`2021_FN_Q21` uses `3^4 - 2^4` directly!), and **Derangements $D_n = n! \sum_{k=0}^n (-1)^k/k!$** (`0, 1, 2, 9, 44, 265`) vs **Duplicates (`LILAC` `2020_FN_Q52`)**! | NEEDS-TRACE | Compute `D_1..D_5` (`0, 1, 2, 9, 44`) + trace `LILAC` (`12`) case-by-case (`2020_FN_Q52`)! | HIGH |
| 73 | `Ch 07` (Multinomial Theorem & Pascal / Vandermonde Identities) | `(x_1 + x_2 + x_3)^n` coefficient $\frac{n!}{k_1! k_2! k_3!}$ and $\sum \binom{n}{k} = 2^n$, $\sum k \binom{n}{k} = n 2^{n-1}$ (`2019_FN_Q26`). | MISSING-FINER-POINT | Add a Binomial/Multinomial Identities Cheat Card (`2019_FN_Q26`). | MEDIUM |
| 74 | `Ch 08` (Non-Homogeneous Linear Recurrences & Repeated Roots!) | What if `r_1 = r_2` (`c_1 r^n + c_2 n r^n`) OR there's a RHS term `f(n)` (`T(n) = 2T(n-1) + 3^n` or `+ n`)? | STEP-SKIPPED | Show 1 repeated-root recurrence + 1 non-homogeneous particular-solution guess table (`const, n, r^n`). | MEDIUM |
| 75 | `Ch 08` (Solving Recurrences USING Generating Functions!) | Doesn't show the actual step-by-step **Generating Function method** (`multiply by x^n, sum n >= 2, partial fractions -> extract [x^n]`) — plus extracting `[z^3]` from `(1+z)/(1-z)^3` (`2017_AN_Q48`)! | NEEDS-TRACE | Solve `a_n = 2 a_{n-1} + 1` via Generating Functions + solve `2017_AN_Q48` (`15`)! | HIGH |
| 76 | `Ch 08` (Catalan Numbers Recurrence & Generating Function!) | Connect DS Stack Permutations / Binary Trees (`D3/D6`) directly to DM Recurrence $C_n = \sum C_i C_{n-1-i}$ and OGF $\frac{1 - \sqrt{1-4x}}{2x}$ (`[SHOULD]`). | MISSING-FINER-POINT | Show Catalan `1, 1, 2, 5, 14, 42` unifying Trees, Stacks, and Parenthesizations! | LOW |
| 77 | `Ch 03` (Inverse Function `f^{-1}` & Domain/Codomain Restrictions) | Clarify when `f^{-1}` exists as a function (**iff `f` is bijective!**) vs pre-image $f^{-1}(S)$ always existing as a set! | UNEXPLAINED-WORD | Contrast `f^{-1}(y)` (inverse function) vs `f^{-1}({y})` (pre-image set, `2023_FN_Q49`). | LOW |
| 78 | `Ch 04` (Total Order / Chain vs Antichain & Dilworth's Theorem!) | Introduce **Chain (totally ordered subset)** vs **Antichain (pairwise incomparable)** + quick mention of Dilworth/Mirsky intuition (`[LATER]`). | UNEXPLAINED-WORD | Highlight longest chain (`height`) and largest antichain (`width`) on a Hasse diagram. | LOW |
| 79 | `Ch 06` (Independent Set vs Dominating Set vs Clique!) | `2022_FN_Q50(D)` tests **Largest Independent Set (`\alpha(G)`)** on Petersen Graph (`4`, NOT `3`!). Make sure Maximal Independent Set vs Maximum Independent Set is crystal clear! | UNEXPLAINED-WORD | Draw a 4-node star `K_{1,3}` showing a Maximal IS of size `1` (center!) vs Maximum IS of size `3` (leaves!). | HIGH |
| 80 | `Ch 06` (Matching Number vs Edge Cover vs Independent Set vs Vertex Cover!) | Gallai's two twin theorems (`\alpha + \tau = n` AND `\nu + \rho = n` when no isolated vertices) tie all 4 parameters together cleanly! | MISSING-FINER-POINT | Put the 4-corner Gallai Summary Square (`\alpha, \tau, \nu, \rho`) in Ch 06B! | MEDIUM |
| 81 | `Ch 01` (Satisfiability vs Validity / Unsatisfiability & Resolution!) | Clarify: **Valid (Tautology)** $\iff \neg \phi$ is **Unsatisfiable (Contradiction)**; **Satisfiable** $\iff \ge 1$ True row! | UNEXPLAINED-WORD | Draw the `Valid / Satisfiable / Unsatisfiable` 3-bucket classification chart. | MEDIUM |
| 82 | `Ch 02` (First-Order Logic Free vs Bound Variables & Alphabetic Renaming!) | Explain why `∀x (p(x) ∨ W)` lets `W` move out **ONLY IF `x` is NOT free in `W`** (`2020_FN_Q46`)! Show what breaks if `W` DOES contain free `x`! | STEP-SKIPPED | Trace an example where `x` IS free in `W(x)` breaking `∀x(p(x) ∨ q(x)) != ∀x p(x) ∨ q(x)`. | MEDIUM |

---

## PART 3. WHAT A COMPLETE SUBJECT MUST HAVE

Checked against the GATE CS Discrete Mathematics syllabus (`Part B.1`), `Part C` (75 PYQs), Kenneth Rosen (*Discrete Mathematics and Its Applications*), Liu, Tremblay–Manohar, West (*Graph Theory*), Gallian (*Abstract Algebra*), Made Easy, GateWallah, and NPTEL:

1. **Chapter 00: Proof Techniques, Divisibility & Modular Arithmetic** *(missing prerequisite!)*
   - **Sub-topics:** Direct, Contrapositive, Contradiction, **Mathematical Induction (`2025_AN_Q15`)**; Divisibility over $\mathbb{Z}$ (`0` & negatives, `2019_FN_Q54`), Primes & Squarefree factorization (`2026_AN_Q26`); Modular Arithmetic, GCD, Fermat's Little Theorem (`3^{51} \bmod 5`, `2019_FN_Q21`).
   - **Syllabus line:** Foundation for all 5 lines of `Discrete Mathematics`.
   - **How often GATE asks it:** Embedded in Logic, Relations, and Groups (`2026_AN_Q26`, `2025_AN_Q15`, `2019_FN_Q54`, `2019_FN_Q21`; exact standalone count: not sure).
   - **Typical question type:** MCQ/NAT (modular power, prime quantifiers, induction rule).
   - **Zero-level prerequisite:** High-school integers & fractions.

2. **Complete Propositional & First-Order Predicate Logic (`Ch 01` & `Ch 02`)**
   - **Sub-topics:**
     - **Propositional (`Ch 01`):** English-to-logic (`only if`, `when`, `unless`, `2024_AN_Q26`, `2017_AN_Q31`); Truth tables, Logical Equivalence Laws (`2021_AN_Q60`, `2017_FN_Q29`); **Fast Falsification Method** (`2021_FN_Q27`, `2017_FN_Q55`); Valid/Satisfiable/Unsatisfiable; CNF/DNF/PDNF/PCNF; Rules of Inference & Resolution; Functional Completeness.
     - **First-Order (`Ch 02`):** Domain & quantifiers (`∀ ->`, `∃ ∧`, `2026_AN_Q11`, `2023_FN_Q26`); **"Exact 1" templates (`2025_FN_Q48`)**; Swapping `∀∃` vs `∃∀` (`2017_FN_Q15`); **Free-variable scope pulling (`2020_FN_Q46`)**; Domain sensitivity (`2019_FN_Q54`); **Finite Model Property for `∃^* ∀^*` (`2018_FN_Q38`)**; Prenex Normal Form.
   - **Syllabus line:** `Propositional and first order logic`.
   - **How often GATE asks it:** Very frequently (`Part B.3`: 14 Qs / 19 marks across 9/10 years; exact subtopic split: not sure).
   - **Typical question type:** MCQ/MSQ (translate English, tautology/validity equivalence, quantifier implications, model existence).
   - **Zero-level prerequisite:** Ch 00.

3. **Complete Sets, Relations, Functions, POSETs & Lattices (`Ch 03` & `Ch 04`)**
   - **Sub-topics:**
     - **Sets, Relations, Functions (`Ch 03`):** Power sets, Cartesian products, **Countability vs Uncountability (`2018_FN_Q37`)**; Relation properties (`Refl, Irrefl, Sym, Antisym, Asym, Trans, Circular` `2021_FN_Q29`) + relation counting; Equivalence classes, Partitions & **Quotient Bijection (`2023_FN_Q49`)**; Function types & counts (surjections via Stirling/PIE!), **Composition lemmas (`2025_FN_Q17`)**, Cardinality equations (`2024_FN_Q28`, `2021_AN_Q27`).
     - **POSETs & Lattices (`Ch 04`):** Hasse Diagrams, Maximal/Minimal vs Greatest/Least, Chains/Antichains; **Counting Total Orders containing `P` (`2024_AN_Q18`)**; **Lattices (`2025_AN_Q42`, `2017_AN_Q28`)**, Sublattices, Bounded, Distributive (`M_3, N_5`), Complemented, **Boolean Algebra (`2^k`)**.
   - **Syllabus line:** `Sets, relations, functions, partial orders and lattices`.
   - **How often GATE asks it:** Very frequently (`Part B.3`: 11 Qs / 15 marks across 8/10 years; exact breakdown: not sure).
   - **Typical question type:** MSQ/MCQ (relation properties, function compositions, lattice/Boolean checks, countability), NAT (linear extensions, pairs to lattice, reflexive probability, `|A|`).
   - **Zero-level prerequisite:** Ch 00 + Ch 01/02.

4. **Complete Algebraic Structures: Monoids & Groups (`Ch 05`)**
   - **Sub-topics:** Binary ops & 5-step hierarchy (**Groupoid -> Semigroup -> Monoid -> Group -> Abelian**, `2025_FN_Q49`); Custom-operator associativity & distributivity (`2024_FN_Q65`); Cayley tables; Group laws & **Exponent-2 Abelian theorems (`2022_FN_Q27`)**, Power-set $\Delta$ group (`2023_FN_Q51`), Conjugacy (`2019_FN_Q35`); **Subgroups, Lagrange's Theorem (`2020_FN_Q32`, `2018_FN_Q29`)**; **Cyclic Groups, Element Order, Generators (`\phi(n)`), Prime-order subgroups (`2021_FN_Q52`)**, & **Direct Products `Z_m × Z_n` self-inverses (`2024_AN_Q41`)**; Rings/Fields awareness (`[LATER]`).
   - **Syllabus line:** `Monoids, groups`.
   - **How often GATE asks it:** Regularly (`Part B.3`: 10 Qs / 15 marks across 8/10 years; exact subtopic split: not sure).
   - **Typical question type:** MSQ/MCQ (classify structure, group identities, subgroup cyclicity), NAT (max proper subgroup size, count self-inverses, modular power).
   - **Zero-level prerequisite:** Ch 00 (modular math, GCD, $\phi(n)$), Ch 03 (sets & equivalence).

5. **Complete Graph Theory: Connectivity, Algebra, Matching & Coloring (`Ch 06A` & `Ch 06B`)**
   - **Sub-topics:**
     - **Ch 06A (Structure, Algebra, Trees & Planarity):** Handshaking (`2017_AN_Q16`, `2017_FN_Q19`), Degree sequences (Havel-Hakimi), Standard graph families (`K_n, C_n, W_n, K_{m,n}, Q_n, Petersen`), **Disconnected max edges (`2022_FN_Q30`)**, BFS height vs diameter (`2025_FN_Q43`), **Adjacency Matrix Powers (`diag(A^2)`, `tr(A^3)/6`, `A^2 = I`, `G_2 = M + M^2`, `2024_AN_Q15`, `2022_FN_Q37`, `2022_FN_Q52`, `2021_FN_Q35`)**; **Cayley's $n^{n-2}$ (`2024_FN_Q31`), Disjoint Spanning Trees (`2026_AN_Q36`), DAG Arborescences (`2022_FN_Q58`), Even ST Cycle Parity (`2024_AN_Q37`)**; Isomorphism & **Permutation Swap Graph (`2018_FN_Q53`)** & **Powerset BFS (`2023_FN_Q56`)**; **Planar Euler & `3V-6` / `2V-4` (`2021_FN_Q24`)**.
     - **Ch 06B (Euler/Hamilton, Matching, Cover & Coloring):** Euler vs Hamilton (`(n-1)!/2` vs `1`, `2019_FN_Q12`), Petersen properties (`2022_FN_Q50`); **Independent Set, Vertex Cover (`deg >= k+1`, `2026_FN_Q47`), Gallai Identities, Matching & Path Matchings (`2026_FN_Q57`), König/Hall**; **2-Coloring (`O(V+E)`, `2026_FN_Q55`), Chromatic Lower Bounds (`\omega, n/\alpha, k(k-1)/2`, `2024_FN_Q59`), Greedy $\Delta + 1$ (`2023_FN_Q55`), Vizing's Edge Coloring (`2020_FN_Q53`)**.
   - **Syllabus line:** `Graphs: connectivity, matching, coloring`.
   - **How often GATE asks it:** Highest weight in Discrete Math! (`Part B.3`: `17 + 7 = 24` Qs / `40` marks = **35% of DM!** across 9/10 years; exact subtopic split: not sure).
   - **Typical question type:** MCQ/MSQ/NAT (matrix walks/traces, spanning trees, planar faces, chromatic number & bounds, VC/IS/matchings, BFS/DFS graph properties).
   - **Zero-level prerequisite:** Ch 00, Ch 03, basic matrix multiplication & DS/Algo graph traversals.

6. **Complete Combinatorics, Recurrences & Generating Functions (`Ch 07` & `Ch 08`)**
   - **Sub-topics:**
     - **Combinatorics (`Ch 07`):** Product/Sum rules, **Per-Element Choice & Parity Grids (`2026_FN_Q12`, `2021_AN_Q37`, `2019_FN_Q26`)**, Separating Subsets (`2023_FN_Q48`), Adjacent-pair complement (`2025_FN_Q30`), Multinomial; **Twelvefold Way (Stars & Bars, Stirling S2 `2021_FN_Q21`, Integer Partitions `2022_FN_Q32`)**; **Inclusion-Exclusion (`2017_FN_Q41`)** & **Derangements with Duplicates (`2020_FN_Q52`)**.
     - **Recurrences & OGFs (`Ch 08`):** Linear Homogeneous (distinct, repeated, **initial-condition cancellation `2024_AN_Q20`**, Lucas `2023_FN_Q15`) & Non-Homogeneous recurrences; **Binary/Josephus recurrences (`2022_FN_Q51`)**; **5 Master OGF Identities, Odd-Term Extraction (`2022_FN_Q36`), Binomial Expansion (`2017_AN_Q48`, `2018_FN_Q11`)**, Solving Recurrences via OGF, Catalan OGF.
   - **Syllabus line:** `Combinatorics: counting, recurrence relations, generating functions`.
   - **How often GATE asks it:** Very frequently (`Part B.3`: Combinatorics 10 Qs / 15 marks + Recurrences/GF 6 Qs / 9 marks = **24 marks**; exact subtopic split: not sure).
   - **Typical question type:** NAT (matrices, strings, balls/bins, derangements, subset pairs, OGF coefficient diff), MCQ/MSQ (GF closed form, recurrence asymptotic/binary formula).
   - **Zero-level prerequisite:** Ch 00 + high-school algebra & binomial theorem.

---

## PART 4. THE DIAGRAMS I NEED

### Ch 00 · Proof Techniques, Divisibility & Modular Arithmetic
1. **3 Proof Maps (`Contrapositive`, `Contradiction`, `Domino Induction`) & Modulo Clock**
   - *What to draw:* (A) Domino chain (`P(0)` falls -> `P(k)` pushes `P(k+1)` vs broken chain starting at `P(1000)` missing `0..999`, `2025_AN_Q15`); (B) 5-hour mod-5 clock spinning `3^{51} mod 5` (`3^4 = 1`, `2019_FN_Q21`).
   - *What to notice:* Induction needs BOTH the right base `P(0)` AND the forward arrow `k -> k+1` (`not k -> k-1`, `2025_AN_Q15`); modular powers repeat cyclically!
   - *Format:* **Single picture**

### Ch 01 · Propositional Logic
2. **English-to-Arrow Map, Promise Principle & Falsification Tree (`2024_AN_Q26`, `2017_FN_Q55`)**
   - *What to draw:* 6 English phrases wired cleanly to arrows (`p if q` = `q -> p`; `p only if q` = `p -> q`; `p unless q` = `¬q -> p`), PLUS a 1-branch **Backward Falsification Tree** trying to force `((P ∧ Q) -> R) -> ((P ∧ Q) -> (Q -> R))` FALSE (`2021_AN_Q60`) and hitting a contradiction wall!
   - *What to notice:* `F -> Anything` is ALWAYS True (`Promise Principle`), and Falsification solves 3-variable tautology checks in 3 lines instead of 8 truth-table rows!
   - *Format:* **Step-by-step series of pictures**

### Ch 02 · First-Order Logic
3. **2×2 Quantifier Matrix (`∀∃` vs `∃∀`) & `∀ ->` vs `∃ ∧` Counterexample (`2026_AN_Q11`, `2017_FN_Q15`)**
   - *What to draw:* Two `Person × Person` grids comparing `"everyone knows someone"` (at least 1 tick per row: `∀x ∃y`) vs `"one celebrity known by everyone"` (one full column of ticks: `∃y ∀x`, `2026_AN_Q11`), PLUS the 4-box free-formula `W` pulling guide (`2020_FN_Q46`) and `∃^3 ∀^4` witness-shrinking universe (`7` dots collapsing to `3` witness dots, `2018_FN_Q38`).
   - *What to notice:* Why `∃y ∀x` implies `∀x ∃y` (full column guarantees 1 per row!) while the reverse fails, and why `∀x (x != y -> ...)` never pairs with `∧`!
   - *Format:* **Single picture**

### Ch 03 · Sets, Relations & Functions
4. **Relation Directed Graphs (`Sym`, `Antisym`, `Asym`, `Circular`) & Partition-Quotient Map (`2021_FN_Q29`, `2023_FN_Q49`)**
   - *What to draw:* Left: 4 mini 3-dot graphs illustrating `Sym`, `Antisym (self-loops ok!)`, `Asym (no loops!)`, `Refl+Sym (fails transitivity)`, and `Refl+Circular (= Equivalence!, 2021_FN_Q29)`. Right: Set `A` sliced into equivalence buckets `[x]` (`2026_AN_Q26` squarefree numbers) wiring 1-to-1 onto `B` (`2023_FN_Q49`), plus `A -> B -> C` composition diagrams (`2025_FN_Q17`).
   - *What to notice:* Isolated nodes break `Sym + Trans => Refl`; quotienting `A` by `f(a1)=f(a2)` collapses every pre-image fiber into one unique element!
   - *Format:* **Single picture**
5. **Countability Table vs Diagonal Uncountability (`2018_FN_Q37`)**
   - *What to draw:* Grid indexing `Q` (Cantor zig-zag fractions), `N × N` (`{0,1} -> N`), and Finite Subsets (binary integers!), contrasted with uncountable `{0,1}^N` diagonal flip.
   - *What to notice:* Countable × Countable stays countable; Infinite-Exponent `2^N` jumps to uncountable (`2018_FN_Q37`)!
   - *Format:* **Single picture**

### Ch 04 · Partial Orders and Lattices
6. **3-Step Hasse Diagram Builder, `M_3` vs `N_5`, & Linear Extensions (`2024_AN_Q18`, `2017_AN_Q28`)**
   - *What to draw:* Frames converting raw relation `R` -> drop self-loops -> drop transitive shortcuts -> arrange upward; beside it, `B_2` (square Boolean), `M_3` (diamond, 2 complements), and `N_5` (pentagon, `2017_AN_Q28`), plus the 5 topological sort trees of `1 < 2, 3 < 2, 3 < 4` (`2024_AN_Q18`).
   - *What to notice:* Every pair in a lattice MUST have ONE lowest ceiling (LUB) and ONE highest floor (GLB); `M_3` and `N_5` are the exact forbidden sublattices for distributivity!
   - *Format:* **Step-by-step series of pictures**

### Ch 05 · Monoids and Groups
7. **5-Step Algebraic Axiom Ladder & `Z_2 × Z_3 × Z_4` Self-Inverse Grid (`2025_FN_Q49`, `2024_AN_Q41`)**
   - *What to draw:* Ascending staircase (`Groupoid -> Semigroup (+Assoc) -> Monoid (+Id) -> Group (+Inv) -> Abelian (+Comm)`) with failing examples sitting at each missing rung (`(N^N, +)` stops at Abelian Monoid!), plus a `4×4` Cayley table showing Latin-square rows/cols and `(2^X, Δ)` self-inverses (`2023_FN_Q51`) and `(Z_2 × Z_3 × Z_4)` `(a, b, c)` order-2 tuples (`2024_AN_Q41`).
   - *What to notice:* Why every group row/col contains each element exact once, and why self-inverse in a direct product happens iff EACH coordinate is self-inverse!
   - *Format:* **Single picture**

### Ch 06A & 06B · Graph Theory (Connectivity, Algebra, Matching & Coloring)
8. **Walk Counting on Adjacency Matrices (`A^2`, `tr(A^3)/6`, `A^2 = I`) (`2024_AN_Q15`, `2022_FN_Q37`, `2022_FN_Q52`)**
   - *What to draw:* A 3-vertex triangle `1-2-3` tracing ALL 6 directed length-3 closed walks (`1->2->3->1`, `1->3->2->1`, ...) explaining `tr(A^3) / 6`, next to a 4-vertex perfect matching showing `A^2 = I` (`deg = 1`, `2024_AN_Q15`).
   - *What to notice:* Every `(A^k)_{ii}` counts closed walks of length `k` starting at `i` — triangles get counted `3 vertices × 2 orientations = 6` times!
   - *Format:* **Single picture**
9. **Spanning Tree Visuals: Disjoint Trees in `K_5`, DAG Parent Choices, & Cycle-Parity Swap (`2026_AN_Q36`, `2022_FN_Q58`, `2024_AN_Q37`)**
   - *What to draw:* Left: `K_5` decomposed cleanly into TWO completely edge-disjoint spanning paths/trees (red & blue, `Jaccard = 0`!). Middle: 5-node DAG `5->4->3->2->1` showing independent parent choices (`1×2×3×4 = 24`, `2022_FN_Q58`). Right: One cycle `C` where swapping `e_1` for `e_2` between `T_1` and `T_2` forces same parity (`2024_AN_Q37`)!
   - *What to notice:* Disjoint STs exist as soon as `2(n-1) <= n(n-1)/2` (`n >= 4`); DAG arborescences multiply out-parent counts; cycle swaps keep parity invariant!
   - *Format:* **Single picture**
10. **Planar Faces (`K_5, K_{3,3}`), Petersen Graph, Vertex Cover & Path Matchings (`2026_FN_Q47`, `2026_FN_Q57`, `2022_FN_Q50`)**
    - *What to draw:* Left: `Petersen Graph` (`5-cycle + 5-star`) with a valid 3-coloring and 4-vertex independent set highlighted (`2022_FN_Q50`). Middle: Vertex `v` with `k + 1` red spokes (`if v ∉ S`, `k + 1` neighbours trapped in `S` -> impossible!, `2026_FN_Q47`). Right: `P_8` matching tree splitting at last edge (`M(7) + M(6) = 34`, `2026_FN_Q57`)!
    - *What to notice:* Degree `>= k + 1` forces `v` into every size-`k` vertex cover; path matchings grow as exact Fibonacci numbers!
    - *Format:* **Single picture** + **Step-by-step series of pictures**

### Ch 07 · Combinatorics
11. **Per-Element Choice Grids (`4×4` Parity & `A ⊆ B`), Stars & Bars, & Twelvefold Way (`2026_FN_Q12`, `2021_AN_Q37`, `2022_FN_Q32`)**
    - *What to draw:* Left: `4×4` matrix shading the free `3×3` top-left core (`2^9 = 512`) and showing arrows uniquely locking the bottom row and right column (`2026_FN_Q12`)! Middle: 10 boxes each choosing `A∩B`, `B\A`, or `Neither` (`3^{10}`, `2021_AN_Q37`). Right: 2×2 Balls-into-Bins matrix + `LILAC` slot-by-slot derangement tree (`4+4+4=12`, `2020_FN_Q52`)!
    - *What to notice:* Parity borders act like automatic checksum bits determined uniquely by the interior `(n-1)^2` cells!
    - *Format:* **Single picture** + **Step-by-step series of pictures**

### Ch 08 · Recurrences and Generating Functions
12. **Characteristic Root Cancellation, Josephus Binary Pattern & OGF Expansion Card (`2024_AN_Q20`, `2022_FN_Q51`, `2017_AN_Q48`)**
    - *What to draw:* Left: Two linear recurrences (`c_2 != 0` dominated by `3^n` vs `c_2 = 0` dropping to `2^n`, `2024_AN_Q20`). Middle: Binary bit-shift table for `f(1)..f(10)` (`101_2 -> 011_2` left-rotation, `2022_FN_Q51`). Right: 5 OGF Building Blocks card (`1/(1-x), 1/(1-x)^2, 1/(1-x)^k`, odd-filter `(f(x)-f(-x))/2`, `2022_FN_Q36`).
    - *What to notice:* Always solve initial conditions BEFORE claiming the dominant root is the $\Theta$ growth rate (`2024_AN_Q20`!)!
    - *Format:* **Trace table** + **Single picture**

---

## PART 5. THE FULL PLAN, CHAPTER BY CHAPTER

*(Starting with Chapters 00, 01, and 02 below; continuing from Chapter 03 on next turn!)*

### Chapter 00 · Proof Techniques, Divisibility & Modular Arithmetic *(New Prerequisite Chapter)*

#### Lesson 00.1 · Proof Styles (`Induction`, `Contradiction`, `Contrapositive`), Divisibility & Modular Powers
- **Tag:** `[MUST]` — Zero-level readers get stuck on Induction (`2025_AN_Q15`), squarefree factorization (`2026_AN_Q26`), integer divisibility (`2019_FN_Q54`), and modulo powers (`2019_FN_Q21`) without this warm-up.
- **Estimated reading time:** 55 minutes.
- **Prerequisites:** High-school integers.
- **Beginner must-see:** Discrete Math isn't plug-and-chug formulas — it is proving *why* a pattern holds for ALL numbers! **Induction** is a row of dominoes: knock down `P(0)` and show `P(k) => P(k+1)` (`2025_AN_Q15`)! And **Modular Arithmetic** wraps infinite integers around a finite clock face (`mod 5`, `2019_FN_Q21`) so giant powers like $3^{51}$ shrink to `2` in 5 seconds!
- **Finer points:**
  - **Proof Modes:** Direct, Contrapositive (`¬q -> ¬p`), Contradiction, Counterexample (1 counterexample kills `"for all"`!).
  - **Mathematical Induction (`2025_AN_Q15`):** Standard base `P(0)` + step `P(x) -> P(x+1)` (why `P(1000)` or `P(x) -> P(x-1)` fails to cover all $\mathbb{N}$!).
  - **Divisibility over $\mathbb{Z}$ (`2019_FN_Q54`, `2026_AN_Q26`):** `a | b <=> b = ka` (`-1 | -2`, every $a \neq 0$ divides `0`); Primes (`>= 2`!), Unique Prime Factorization -> **Squarefree kernel** ($x = s^2 \cdot \text{sqfree}(x)$ so $xy$ is a square iff $\text{sqfree}(x) = \text{sqfree}(y)$!).
  - **Modular Arithmetic & Fermat's Little Theorem (`2019_FN_Q21`):** $a^{p-1} \equiv 1 \pmod p$ for prime $p \nmid a$ ($3^4 \equiv 1 \pmod 5 \implies 3^{51} \equiv 3^3 \equiv 2$).
- **GATE-level items:** Predicate-logic Induction axiom (`2025_AN_Q15`), squarefree equivalence (`2026_AN_Q26`), divisibility over $\mathbb{Z}$ (`2019_FN_Q54`), and `a^k mod p` (`2019_FN_Q21`).
- **Diagrams needed:** `TIMELINE` / `FLOW` (Domino chain comparing `P(0) + x->x+1` vs broken `P(1000)` / backward `x->x-1`, `2025_AN_Q15`); `GRAPHPIC` (Mod-5 cyclic power clock `3^1, 3^2, 3^3, 3^4`, `2019_FN_Q21`).
- **Hand traces:** Tracing `3^{51} mod 5`, computing `sqfree(1..10)` (`2026_AN_Q26`), and checking `z | x` on `x = -2, 1, 97` (`2019_FN_Q54`).
- **Common mistakes:** Confusing `P(x) -> P(x-1)` with backward induction over all $\mathbb{N}$ (`2025_AN_Q15(B)` only covers `0`!); forgetting negative divisors (`-1 | -2`) when domain is $\mathbb{Z}$ (`2019_FN_Q54`); forgetting `3^4 = 1 mod 5` when reducing exponents (`2019_FN_Q21`).

---

### Chapter 01 · Propositional Logic

#### Lesson 01.1 · Connectives, English-to-Logic Translation, Equivalences & Falsification (`Tautology / Inference`)
- **Tag:** `[MUST]` — High-yield 1–2 mark score (`2024_AN_Q26`, `2021_FN_Q27`, `2021_AN_Q60`, `2017_FN_Q29`, `2017_AN_Q31`, `2017_FN_Q55`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 00.1.
- **Beginner must-see:** Logic has ONE terrifying arrow: **`p -> q` ("if p then q")**! Think of it like a promise: *"If you score `>50%`, you cannot fail"* (`q -> ¬p`, `2024_AN_Q26`). There is ONLY ONE way to break a promise: the condition `p` happens (`TRUE`), and the promise `q` fails (`FALSE`)! Every single other case (including when `p` is `FALSE`!) keeps the promise **`TRUE`**!
- **Finer points:**
  - **English -> Arrow Dictionary (`2024_AN_Q26`, `2017_AN_Q31`, `2017_FN_Q29`):**
    - `p if q` / `p when q` = `q -> p`.
    - `p only if q` = `p -> q` (`2017_AN_Q31`!).
    - `p unless q` = `¬q -> p` (`= p ∨ q`).
    - `p is sufficient for q` = `p -> q`; `p is necessary for q` = `q -> p`.
    - Converse (`q -> p`), Inverse (`¬p -> ¬q`), **Contrapositive (`¬q -> ¬p` — ONLY one equivalent to `p -> q`!)** (`2017_FN_Q29`, `2024_AN_Q26`).
  - **10 Equivalence Laws & Implication Rewrite (`2021_AN_Q60`, `2017_FN_Q29`):**
    - `p -> q ≡ ¬p ∨ q`; `(P ∧ Q) -> R ≡ P -> (Q -> R) ≡ (P ∧ Q) -> (Q -> R)` (`2021_AN_Q60`!).
  - **Tautology, Contingency, Contradiction & Fast Falsification (`2021_FN_Q27`, `2017_FN_Q55`):**
    - Assume whole implication `A -> B` is `FALSE` (`A = T, B = F`) and propagate backwards (`2017_FN_Q55`: `(p->q)->r` false forces `r = F` -> `(r->p)->q` reduces to `T -> q ≡ q`!).
    - Explicitly warn about `2021_FN_Q27` Part C's `-> p` vs `-> q` mis-transcription!
  - **Normal Forms (`CNF, DNF, PCNF, PDNF`), Functional Completeness (`NAND, NOR`) & Inference / Resolution (`[SHOULD]`):** Modus Ponens, Modus Tollens, Resolution rule (`(p ∨ q) ∧ (¬p ∨ r) => q ∨ r`).
- **GATE-level items:** English sentence translation (`2024_AN_Q26`, `2017_AN_Q31`), contrapositive equivalence (`2017_FN_Q29`), 3-var tautology/implication checks (`2021_AN_Q60`, `2021_FN_Q27`, `2017_FN_Q55`).
- **Diagrams needed:** `COMPARE` (6-row English-to-Arrow Translation & Converse/Contrapositive box); `FLOW` (Backward Falsification tree trying to force `A -> B = F` for `2021_AN_Q60` and `2017_FN_Q55`).
- **Hand traces:** Falsifying `2021_AN_Q60` (`contradiction => tautology`), solving `2017_FN_Q55` (`r = F => q`), and translating `2017_AN_Q31` & `2024_AN_Q26`.
- **Common mistakes:** Writing `p -> q` for `"p when q"` (`2024_AN_Q26`) or `q -> p` for `"p only if q"` (`2017_AN_Q31`!); confusing Converse (`q -> p`) with Contrapositive (`¬q -> ¬p`, `2017_FN_Q29`!); thinking `FALSE -> FALSE` is False (`2017_FN_Q55`!).

---

### Chapter 02 · First-Order Predicate Logic

#### Lesson 02.1 · Quantifiers, English Translation, Scope Pulling & Finite Model Bounds
- **Tag:** `[MUST]` — High-yield GATE staple (`2026_AN_Q11`, `2025_FN_Q48`, `2023_FN_Q26`, `2020_FN_Q46`, `2019_FN_Q54`, `2018_FN_Q38`, `2017_FN_Q15`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 01.1.
- **Beginner must-see:** First-Order Logic adds variables and two quantifiers: **`∀` ("for EVERY row")** and **`∃` ("at least ONE lucky row")**! Memorize ONE unbreakable pairing rule: **`∀` almost ALWAYS pairs with `->`** (`all cats like milk`: `∀x (Cat(x) -> Milk(x))`), while **`∃` almost ALWAYS pairs with `∧`** (`some cat likes milk`: `∃x (Cat(x) ∧ Milk(x))`)! Swap them, and your formula breaks completely!
- **Finer points:**
  - **Swapping `∀ ->` vs `∃ ∧` & Inequality Guard (`2026_AN_Q11`, `2023_FN_Q26`):** Why `∀x ((x != y) -> ...)` works at `x = y` (vacuously true!), whereas `∧` breaks; why `∃x (P(x) ∧ ...)` doesn't cover `∀x (P(x) -> ...)` (`2023_FN_Q26(A, D)`).
  - **`"At Least One"`, `"At Most One"` & `"Exactly One"` Templates (`2025_FN_Q48`):**
    - `∀x ∃y [M(y, x) ∧ ∀z (z != y -> ¬M(z, x))]` $\equiv$ `∀x ∃y [M(y, x) ∧ ¬∃z (z != y ∧ M(z, x))]`.
  - **Quantifier Order (`∀x ∃y` vs `∃y ∀x`, `2017_FN_Q15`, `2023_FN_Q26(C)`):** `∃y ∀x R(x,y) => ∀x ∃y R(x,y)` (NEVER converse!); why `¬∃x ∀y ¬R(x,y) ≡ ∀x ∃y R(x,y)`.
  - **Pulling Free Formula `W` Outside Quantifiers (`2020_FN_Q46`):**
    - `∀x (p(x) ∨ W) ≡ ∀x p(x) ∨ W` and `∃x (p(x) ∧ W) ≡ ∃x p(x) ∧ W`.
    - **LHS Implication Flip:** **`∀x (p(x) -> W) ≡ (∃x p(x)) -> W`**, while **`∃x (p(x) -> W) ≡ (∀x p(x)) -> W`**! (`2020_FN_Q46(C)` invalid!).
  - **Domain Sensitivity (`2019_FN_Q54`) & Bernays-Schönfinkel Finite Model Bound (`2018_FN_Q38`):**
    - Without function symbols, any satisfiable $\exists^k \forall^m \, \psi$ formula has a sub-model of size $\le k$ formed by keeping ONLY the $k$ existential witnesses (`2018_FN_Q38`: `<= 3`!).
- **GATE-level items:** Translating English sentences (`2026_AN_Q11`, `2025_FN_Q48`), quantifier implication MSQs (`2023_FN_Q26`, `2017_FN_Q15`), invalid `W`-pulling equivalence (`2020_FN_Q46`), integer-vs-finite-set domain truth (`2019_FN_Q54`), and `∃^3 ∀^4` model size (`2018_FN_Q38`).
- **Diagrams needed:** `MATRIX` (`Person × Person` grid showing `∀x ∃y` vs `∃y ∀x`, `2026_AN_Q11`, `2017_FN_Q15`); `COMPARE` (4-rule Free-`W` Scope Pulling Cheat Card, `2020_FN_Q46`); `GRAPHPIC` (Shrinking 7-dot model to 3 existential witness dots, `2018_FN_Q38`).
- **Hand traces:** Testing all 4 options of `2025_FN_Q48` on a tiny 2-person universe `{Alice, Bob}`; testing `2020_FN_Q46(C)` with `W = FALSE` and `p(1)=T, p(2)=F`; checking `2019_FN_Q54` on `S1, S2, S3`.
- **Common mistakes:** Keeping `∀` instead of flipping to `∃` when pulling `∀x` off the LHS of `p(x) -> W` (`2020_FN_Q46(C)`!); writing `∀x∀y` instead of `∃y∀x` (`2026_AN_Q11`!); choosing `∃y ∀x` as implied by `∀x ∃y` (`2017_FN_Q15(II)`!).

---

`CONTINUE FROM CHAPTER 03`

## PART 5 (Continued) · Chapters 03 to 06B

### Chapter 03 · Sets, Relations, Functions and Countability

#### Lesson 03.1 · Sets, Functions (`1-1`, `Onto`, `Composition`), Cardinality Equations & Countability
- **Tag:** `[MUST]` — Core foundation tested directly (`2025_FN_Q17`, `2024_FN_Q28`, `2021_AN_Q27`, `2018_FN_Q37`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 00.1, Lesson 02.1.
- **Beginner must-see:** Think of a function $f: A \to B$ as arrows from every student in room $A$ to chairs in room $B$ (every student sits on **exact 1** chair!): **One-to-One (Injective)** means no two students share a chair; **Onto (Surjective)** means NO chair in $B$ sits empty; **Bijective** means exact 1-to-1 pairing (`|A| = |B|`)! When you chain $A \xrightarrow{g} B \xrightarrow{f} C$, if every chair in $C$ got sat on (`f ∘ g` onto), only the second step $f$ had to cover $C$ — $g$ could have skipped chairs in $B$ (`2025_FN_Q17`)!
- **Finer points:**
  - **Sets & Power Sets:** $\emptyset$ vs $\{\emptyset\}$, $|P(A)| = 2^{|A|}$, $|A \times B| = |A| \cdot |B|$.
  - **Function Counts (`|A| = m, |B| = n`):**
    - Total functions: $n^m$.
    - Injections (`1-1`, requires $m \le n$): $\frac{n!}{(n-m)!}$.
    - Surjections (`Onto`, requires $m \ge n$): $\sum_{k=0}^n (-1)^k \binom{n}{k} (n - k)^m = n! \, S(m, n)$.
    - Bijections (requires $m = n$): $n!$.
  - **Composition Lemmas (`2025_FN_Q17`):**
    - `f ∘ g` onto $\implies f$ MUST be onto ($g$ need NOT be 1-1 or onto!).
    - `f ∘ g` 1-1 $\implies g$ MUST be 1-1 ($f$ need NOT be 1-1 or onto!).
  - **Cardinality Equations (`2024_FN_Q28`, `2021_AN_Q27`):** $|A| \le |A \cup B| \le |A| + |B|$; $n \times n$ matrices over $\{a,b,c\}$ biject to $\{0..n^2-1\} \to \{0,1,2\}$ (`3^{n^2}`, `2021_AN_Q27`).
  - **Countable vs Uncountable Sets (`2018_FN_Q37`):** Countable: $\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{N}^k$, `{0,1} -> N` (`N × N`), finite subsets of $\mathbb{N}$; Uncountable ($2^{\aleph_0}$): $\mathbb{R}$, $P(\mathbb{N})$, `N -> {0,1}`.
- **GATE-level items:** Function composition truths (`2025_FN_Q17`), bijection cardinality bounds (`2024_FN_Q28`: `2`, `2021_AN_Q27`), and identifying countable sets (`2018_FN_Q37`).
- **Diagrams needed:** `GRAPHPIC` (`A -> B -> C` arrow diagrams proving `f ∘ g` onto doesn't force `g` 1-1 or onto, `2025_FN_Q17`); `MATRIX` (Cantor $\mathbb{Q}$ & $\mathbb{N} \times \mathbb{N}$ zig-zag numbering vs diagonal uncountable `{0,1}^N`, `2018_FN_Q37`).
- **Hand traces:** Constructing counterexample `g, f` for `2025_FN_Q17`; solving `k <= k^2 <= 2k` (`k \in {1, 2}`) in `2024_FN_Q28`; counting surjections `4 -> 2` (`14`).
- **Common mistakes:** Thinking `f ∘ g` onto forces `g` to be onto (`2025_FN_Q17(A)`!); assuming `{0,1} -> N` is uncountable just like `N -> {0,1}` (`2018_FN_Q37` `Q` vs `R`!); forgetting `|A ∪ B|` can shrink to `|A|` when `A = B` (`2024_FN_Q28`).

#### Lesson 03.2 · Relations, Matrix Counting, Circular Relations, Equivalence & Quotient Maps
- **Tag:** `[MUST]` — High-yield MSQ/NAT staple (`2026_AN_Q26`, `2023_FN_Q49`, `2021_FN_Q29`, `2020_FN_Q11`, `2019_FN_Q35`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 03.1, Lesson 00.1 (prime factorization / squarefree integers).
- **Beginner must-see:** A **Relation** $R$ on set $A$ is just a directed graph (or a `0/1` square grid) connecting elements of $A$! Look at the grid's **diagonal** for Reflexive (`all 1s`) / Irreflexive (`all 0s`), look across the mirror for **Symmetric** vs **Antisymmetric**, and remember: an **Equivalence Relation** slices the set cleanly into non-overlapping **Buckets (`[x]`)** (`2026_AN_Q26`, `2023_FN_Q49`)!
- **Finer points:**
  - **7 Relation Properties & Exact Counts on $n$ Elements (`2020_FN_Q11`):**
    - Total relations: $2^{n^2}$.
    - Reflexive ($2^{n(n-1)}$, probability = $2^{-n}$, `n=3 -> 1/8 = 0.125`, `2020_FN_Q11`!), Irreflexive ($2^{n(n-1)}$).
    - Symmetric ($2^{n(n+1)/2}$), Antisymmetric ($2^n \cdot 3^{n(n-1)/2}$), Asymmetric ($3^{n(n-1)/2}$).
    - **Circular Relation (`aRb ∧ bRc => cRa`, `2021_FN_Q29`):**
      - `Reflexive + Circular <=> Equivalence` (`2021_FN_Q29(C)`!).
      - `Reflexive + Symmetric` ≠ Transitive; `Symmetric + Circular` or `Transitive + Circular` fails Reflexive if any isolated vertex exists!
  - **Equivalence Relations, Partitions & Bell Numbers (`2026_AN_Q26`, `2019_FN_Q35`):**
    - `x·y` is a square $\iff \text{sqfree}(x) = \text{sqfree}(y)$ (`{1,4,9}, {2,8}, {3}, {5}, {6}, {7}, {10}` -> Equivalence!).
    - Conjugacy `a = g^{-1} b g` in a Group (`2019_FN_Q35`) -> Equivalence!
  - **Quotient Map Well-Definedness (`2023_FN_Q49`):** Mapping `[x] -> f(x)` where `a1 ~ a2 <=> f(a1) = f(a2)` for onto `f` ALWAYS gives a **well-defined bijection** from equivalence classes onto $B$!
- **GATE-level items:** Identifying equivalence/circular properties (`2026_AN_Q26`, `2021_FN_Q29`, `2019_FN_Q35`), quotient map bijection (`2023_FN_Q49`), and random reflexive relation probability (`2020_FN_Q11`: `0.125`).
- **Diagrams needed:** `MATRIX` (`n × n` `0/1` grids marking free vs forced cells for Reflexive, Symmetric, Antisymmetric, Asymmetric); `GRAPHPIC` (3-dot counterexamples breaking `Refl+Sym` and `Sym+Circular`, vs `Refl+Circular => Equiv`, `2021_FN_Q29`); `MEMORY` (Squarefree buckets `{1,4,9}, {2,8}...` + Quotient map `[x] -> f(x)`, `2026_AN_Q26`, `2023_FN_Q49`).
- **Hand traces:** Checking `2021_FN_Q29` options `A..D` with 3-node graphs; partitioning `{1..10}` in `2026_AN_Q26`; counting reflexive `3×3` matrices (`64 / 512`).
- **Common mistakes:** Confusing Antisymmetric (loops allowed!) with Asymmetric (no loops!) or NOT Symmetric; assuming Symmetric + Transitive forces Reflexive (`2021_FN_Q29(B,D)`!); thinking `2026_AN_Q26` is Antisymmetric (since `(1,4)` and `(4,1)` both multiply to `4`).

---

### Chapter 04 · Partial Orders and Lattices

#### Lesson 04.1 · POSETs, Hasse Diagrams, Total Orders, Lattices & Boolean Algebras
- **Tag:** `[MUST]` — Regular 1–2 mark score (`2025_AN_Q42`, `2024_AN_Q18`, `2017_AN_Q28`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 03.2 (Reflexive, Antisymmetric, Transitive).
- **Beginner must-see:** An **Equivalence Relation** groups equal-rank items into flat buckets; a **Partial Order (`POSET`)** arranges items into a family tree / dependency hierarchy (`a <= b`) where SOME pairs might be incomparable! Drawing ONLY the direct upward steps gives a clean **Hasse Diagram** — and if EVERY pair of items has ONE lowest common ceiling (**LUB/Join**) and ONE highest common floor (**GLB/Meet**), you've got a **Lattice**!
- **Finer points:**
  - **POSET (`Reflexive + Antisymmetric + Transitive`) & Hasse Construction:** Drop self-loops, drop transitive shortcuts, draw strictly upward (`y` covers `x`).
  - **Special Elements:** Maximal vs Greatest (top), Minimal vs Least (bottom), Upper/Lower bounds, LUB (`∨` Join) / GLB (`∧` Meet).
  - **Counting Linear Extensions / Total Orders (`2024_AN_Q18`):** All topological sorts of the Hasse DAG (`1<2, 3<2, 3<4` -> `5` total orders!).
  - **Lattices (`2025_AN_Q42`, `2017_AN_Q28`):**
    - Pointwise function order `({0,1}^n, <=)` is BOTH a POSET and a Boolean Lattice (`join = max, meet = min`, `2025_AN_Q42`)!
    - Fixing non-lattice Hasse diagrams by adding minimum pairs (`2017_AN_Q28`: `N_5` is ALREADY a lattice -> `0` pairs!).
  - **Lattice Hierarchy:** Bounded (`0, 1`), **Distributive** (contains NO `M_3` diamond or `N_5` pentagon sublattice!), **Complemented** (every `x` has `x'`), **Boolean Algebra** (Finite + Complemented + Distributive -> size MUST be $2^k$!).
- **GATE-level items:** Identifying POSET & Lattice (`2025_AN_Q42`), counting Total Orders containing `P` (`2024_AN_Q18`: `5`), and checking/fixing Hasse lattices (`2017_AN_Q28`: `0`).
- **Diagrams needed:** `FRAMES` (Raw POSET relation -> drop loops -> drop transitive edges -> upward Hasse diagram); `GRAPHPIC` (Total-order topological branching tree for `2024_AN_Q18`); `GRAPHPIC` (`B_2` Boolean vs `M_3` diamond vs `N_5` pentagon, `2017_AN_Q28`).
- **Hand traces:** Tracing `2024_AN_Q18` (`5` linear extensions); verifying LUB & GLB of all pairs in `2017_AN_Q28` (`N_5` -> `0` added pairs); checking `(F, <=)` in `2025_AN_Q42`.
- **Common mistakes:** Mixing up **Maximal** (nothing above it) with **Greatest** (above *everything*) — e.g. `2` and `4` in `2024_AN_Q18` are BOTH maximal, yet neither is Greatest!; assuming `N_5` isn't even a Lattice (`N_5` IS a lattice — it just fails Distributivity! `2017_AN_Q28`!).

---

### Chapter 05 · Monoids and Groups

#### Lesson 05.1 · Algebraic Structures (`Semigroup`, `Monoid`, `Group`), Custom Ops & Group Identities
- **Tag:** `[MUST]` — Steady 1–2 mark MSQs (`2025_FN_Q49`, `2024_FN_Q65`, `2023_FN_Q51`, `2022_FN_Q27`, `2019_FN_Q35`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 03.1.
- **Beginner must-see:** Algebra simply takes a set of objects and ONE operation (`+`, `*`, `Δ`, `◇`) and asks 4 yes/no questions: **1. Does output stay inside the set (Closed)? 2. Do parentheses move freely (Associative -> Semigroup)? 3. Is there a do-nothing neutral element (Identity -> Monoid)? 4. Can every element undo itself (Inverse -> Group)?**
- **Finer points:**
  - **5-Step Ladder:** Groupoid (`Closure`) -> Semigroup (`+Assoc`) -> **Monoid** (`+Identity`, e.g. `(N^N, +)` in `2025_FN_Q49`!) -> **Group** (`+Inverses`, e.g. `(2^X, Δ)` in `2023_FN_Q51`!) -> **Abelian Group** (`+Commutative`).
  - **Testing Custom Operations (`2024_FN_Q65`):** Check `(a ◇ b) ◇ c == a ◇ (b ◇ c)` and Left/Right Distributivity `a □ (b ◇ c) == (a □ b) ◇ (a □ c)`!
  - **Cayley Table Checks:** Identity row/column; **Latin Square** (every element once per row/col); diagonal symmetry (`Abelian`).
  - **Key Group Theorems (`2022_FN_Q27`, `2023_FN_Q51`, `2019_FN_Q35`):**
    - Unique identity & unique inverse; `(ab)^{-1} = b^{-1} a^{-1}`; Cancellation Law.
    - **`(xy)^2 = x^2 y^2` $\implies$ Abelian (`2022_FN_Q27(A)`).**
    - **`x^2 = 1` for all `x` $\implies$ Abelian (`2022_FN_Q27(B)` & `(2^X, Δ)` in `2023_FN_Q51`!).**
    - Conjugacy `a ~ g^{-1} b g` is an equivalence relation (`2019_FN_Q35`).
- **GATE-level items:** Classifying `(F, ⊙)` (`2025_FN_Q49`: Abelian Monoid) and `(2^X, Δ)` (`2023_FN_Q51`: Group where `A^{-1} = A`), custom operator associativity/distributivity (`2024_FN_Q65`), and Abelian group conditions (`2022_FN_Q27`).
- **Diagrams needed:** `FLOW` / `COMPARE` (5-Step Algebraic Axiom Ladder with examples stopping at each step); `MATRIX` (`4×4` Cayley Table highlighting Latin-square & symmetric transpose).
- **Hand traces:** Verifying `a □ (b ◇ c) = (a □ b) ◇ (a □ c)` (`2024_FN_Q65`), proving `x^2 = 1 => xy = yx` (`2022_FN_Q27`), and testing `(2^X, Δ)` axioms (`2023_FN_Q51`).
- **Common mistakes:** Thinking `f_1 + f_2` on non-negative integers has inverses (`2025_FN_Q49(A)`!); confusing `A^{-1} = \overline{A}` (complement) with `A^{-1} = A` under symmetric difference (`2023_FN_Q51(C)`!); checking only LEFT distributivity when symmetric/commutative doesn't hold (`2024_FN_Q65`).

#### Lesson 05.2 · Subgroups, Lagrange's Theorem, Cyclic Groups & Direct Products (`Z_m × Z_n`)
- **Tag:** `[MUST]` — High-ROI theorem & NAT questions (`2024_AN_Q41`, `2021_FN_Q52`, `2020_FN_Q32`, `2018_FN_Q29`).
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 05.1, Lesson 00.1 (GCD, mod arithmetic).
- **Beginner must-see:** Inside a finite group $G$ of size 35, smaller mini-groups (**Subgroups**) CANNOT have just any size — **Lagrange's Theorem** says every subgroup's size MUST divide 35 (`1, 5, 7, 35`)! Even better: any group of prime size (`2, 3, 5, 7`) is automatically **Cyclic** (`generated by repeating 1 single element`, `2021_FN_Q52`)!
- **Finer points:**
  - **Subgroup Tests:** `ab^{-1} \in H` (or closure `ab \in H` alone for finite `H`!). Every subgroup of an Abelian group IS Abelian (`2022_FN_Q27(D)` false!).
  - **Lagrange's Theorem (`2020_FN_Q32`, `2018_FN_Q29`):** `|H|` divides `|G|` (and `ord(a)` divides `|G|`!); largest proper subgroup size = `|G| / smallest_prime_factor(|G|)` (`35/5 = 7`, `84/2 = 42`)! (Warn: converse fails for non-Abelian `A_4`!).
  - **Cyclic Groups & Generators:**
    - Every **prime-order** group is cyclic -> any proper non-trivial subgroup of a group of order 6 (size `2` or `3`) MUST be cyclic (`2021_FN_Q52`!).
    - Number of generators of $Z_n$ = **$\phi(n)$**; subgroups of $Z_n$ = one unique subgroup of size $d$ for each divisor $d \mid n$.
  - **Direct Products `Z_{n_1} × ... × Z_{n_k}` (`2024_AN_Q41`):**
    - `ord((a_1, ..., a_k)) = lcm(ord(a_1), ..., ord(a_k))`.
    - Cyclic iff pairwise $\gcd(n_i, n_j) = 1$.
    - Counting **self-inverse elements** (`x + x = 0` in every coordinate): multiply `# solutions of 2x ≡ 0 (mod n_i)` across each factor (`2024_AN_Q41`: `Z_2(2) × Z_3(1) × Z_4(2) = 4`)!
  - **Rings / Integral Domains / Fields (`[LATER]`):** `Z_p` field when $p$ prime.
- **GATE-level items:** Largest proper subgroup (`2020_FN_Q32`: `7`, `2018_FN_Q29`: `42`), order-6 subgroup cyclicity (`2021_FN_Q52`), and self-inverse count in $Z_2 \times Z_3 \times Z_4$ (`2024_AN_Q41`: `4`).
- **Diagrams needed:** `GRAPHPIC` (Subgroup lattice of $Z_6$ vs $S_3$ showing order-2 & order-3 subgroups, `2021_FN_Q52`); `ARRAY` (`Z_2 × Z_3 × Z_4` coordinate table counting `2x = 0`, `2024_AN_Q41`).
- **Hand traces:** Listing all 4 self-inverses in `Z_2 × Z_3 × Z_4`; comparing `Z_6` vs `S_3` subgroups (`2021_FN_Q52`).
- **Common mistakes:** Assuming order-6 group $G$ must be cyclic because every proper subgroup is cyclic (`S_3` isn't cyclic!, `2021_FN_Q52`); forgetting `0` AND `2` are both self-inverse in `Z_4` (`2+2 = 4 ≡ 0`, `2024_AN_Q41`!).

---

### Chapter 06A · Graph Theory A: Structure, Matrices, Trees and Planarity

#### Lesson 06A.1 · Graph Degrees, Standard Families, Connectivity, BFS Height & Permutation Graphs
- **Tag:** `[MUST]` — High-yield Graph fundamentals (`2025_FN_Q43`, `2023_FN_Q56`, `2022_FN_Q30`, `2018_FN_Q53`, `2017_FN_Q19`, `2017_AN_Q16`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 03.2, Algorithms Ch 07 (BFS/DFS).
- **Beginner must-see:** Every edge in an undirected graph has **two endpoints**, so adding up every vertex's degree ALWAYS equals **`2 × #Edges`** (`Handshaking Lemma`)! From that one tiny fact come max-vertex bounds (`2017_AN_Q16`), tree degree sums (`2017_FN_Q19`), max disconnected edges (`2022_FN_Q30`), AND permutation-swap graph degrees (`2018_FN_Q53`)!
- **Finer points:**
  - **Handshaking Lemma (`2017_AN_Q16`, `2017_FN_Q19`):** $\sum \deg(v) = 2|E|$ (even number of odd-degree vertices!); Trees (`|E| = n - 1 => \sum deg = 2n - 2`); Havel-Hakimi degree sequence test.
  - **Standard Graph Families Cheat Card:** $K_n$, $C_n$, $W_n$, $K_{m,n}$, Hypercube $Q_n$ (`2^n` vertices, `n`-regular, bipartite), Petersen Graph (`10` V, `15` E, `3`-regular).
  - **Connectivity, Max Disconnected Edges & BFS Height (`2025_FN_Q43`, `2022_FN_Q30`):**
    - Max edges in disconnected simple $n$-vertex graph = $\binom{n-1}{2}$ (`n=10 -> 36`, `2022_FN_Q30`); min edges to force connectivity = $\binom{n-1}{2} + 1$.
    - Whitney's inequality $\kappa \le \lambda \le \delta$.
    - **BFS Tree Height vs Diameter (`2025_FN_Q43`):** Triangle inequality $d(u, v) \le d(u, r) + d(r, v) \le 2 \cdot \text{height}(T) \implies \text{height}(T) \ge \lceil \text{diam}(G)/2 \rceil$ (`30 / 2 = 15`)!
  - **Graph Isomorphism & Combinatorial Graph Constructions (`2023_FN_Q56`, `2018_FN_Q53`):**
    - Permutation adjacent-swap graph on $S_{100}$ (`2018_FN_Q53`: `deg = 99`, connected `z = 1` -> `99 + 10 = 109`!).
    - Powerset subset-comparability BFS from $\emptyset$ (`2023_FN_Q56`: $\emptyset$ adjacent to all `7` others -> `7! = 5040` BFS orders!).
- **GATE-level items:** Tree degree sum (`2017_FN_Q19`: `18`), min-degree max-vertices (`2017_AN_Q16`: `16`), disconnected max edges (`2022_FN_Q30`: `36`), BFS height bound (`2025_FN_Q43`: `>= 15`), permutation graph (`2018_FN_Q53`: `109`), and powerset BFS orders (`2023_FN_Q56`: `5040`).
- **Diagrams needed:** `COMPARE` (Standard Graph Families Table); `GRAPHPIC` (`K_9 + 1` isolated vertex for `2022_FN_Q30`; `P_{31}` rooted at center proving `height >= 15`, `2025_FN_Q43`; `S_3` 6-node permute-swap hexagon previewing `2018_FN_Q53`).
- **Hand traces:** Tracing `2018_FN_Q53` on $S_3$ and scaling to $S_{100}$; tracing `2023_FN_Q56` BFS levels from $\emptyset$; solving `2017_AN_Q16` (`3n <= 50`).
- **Common mistakes:** Assuming BFS tree rooted at an endpoint forces `height >= 30` (`2025_FN_Q43`: root could sit at the midpoint of the diameter!); forgetting $\emptyset \subset A$ connects `\emptyset` directly to ALL 7 non-empty sets in `2023_FN_Q56`!

#### Lesson 06A.2 · Adjacency Matrix Powers ($A^k$), Spanning Tree Counting & Planarity
- **Tag:** `[MUST]` — Massive 2-mark question source (`2026_AN_Q36`, `2024_AN_Q15`, `2024_FN_Q31`, `2024_AN_Q37`, `2022_FN_Q37`, `2022_FN_Q52`, `2022_FN_Q58`, `2021_FN_Q24`, `2021_FN_Q35`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 06A.1, basic matrix multiplication.
- **Beginner must-see:** Raising a graph's `0/1` **Adjacency Matrix $A$** to power $A^k$ counts **how many exact $k$-step walks** exist between any two vertices! From that single fact: `diag(A^2)` = degrees (`2022_FN_Q52`), `A^2 = I` means every vertex has degree 1 (**Perfect Matching**, `2024_AN_Q15`), and `trace(A^3) / 6` = exact number of triangles (`2022_FN_Q37`)!
- **Finer points:**
  - **Adjacency Matrix Power Theorems (`2024_AN_Q15`, `2022_FN_Q37`, `2022_FN_Q52`, `2021_FN_Q35`):**
    - `(A^2)_{ii} = \deg(i)` (`2022_FN_Q52(A)`); `(A^{n-1} + I)_{ij}` can STILL be `0` in connected bipartite graphs (`2022_FN_Q52(B)` false!).
    - **`A = A^{-1} <=> A^2 = I <=> \deg(i) = 1 \forall i` <=> Perfect Matching (`2024_AN_Q15`)!**
    - Triangles = **`tr(A^3) / 6`** (`2022_FN_Q37`).
    - Squaring graph $G_2$ (`M + M^2`) halves distances: **`diam(G_2) <= ceil(diam(G)/2)` (`2021_FN_Q35`)**!
  - **Spanning Tree Counting & Cycle Parity:**
    - **Cayley's Formula:** $K_n$ has **$n^{n-2}$** labelled spanning trees (`K_4 -> 16`, `2024_FN_Q31`).
    - **Edge-Disjoint Spanning Trees (`2026_AN_Q36`):** $K_n$ ($n \ge 4$) has 2 disjoint STs -> lowest Jaccard = **`0`**!
    - **DAG Rooted Directed Spanning Trees (`2022_FN_Q58`):** Product of valid parent in-degrees (`1 × 2 × 3 × 4 = 24`)!
    - **Even-Weight ST Cycle Parity (`2024_AN_Q37`):** Swapping two edges on cycle $C$ keeps ST weight even $\implies$ all edges in $C$ share parity (all even OR all odd)!
  - **Planar Graphs (`2021_FN_Q24`):** Euler's formula **$V - E + F = 2$** (connected; $c + 1$ for $c$ components); $E \le 3V - 6$ ($K_5$ fails!) and triangle-free $E \le 2V - 4$ ($K_{3,3}$ fails!).
- **GATE-level items:** Matrix walk traces (`2022_FN_Q37`, `2022_FN_Q52`, `2024_AN_Q15`, `2021_FN_Q35`), Cayley & Disjoint STs & DAG arborescences (`2024_FN_Q31`, `2026_AN_Q36`, `2022_FN_Q58`), cycle parity (`2024_AN_Q37`), and Euler planar faces (`2021_FN_Q24`: `11`).
- **Diagrams needed:** `MATRIX` + `GRAPHPIC` (Triangle proving `tr(A^3)/6` + Perfect matching proving `A^2 = I`); `GRAPHPIC` (`K_5` 2 disjoint STs `2026_AN_Q36`, 5-node DAG arborescence `2022_FN_Q58`, planar `K_4` face count).
- **Hand traces:** Computing `A^2` and `tr(A^3)/6` on $K_3 + \text{edge}$; tracing `2022_FN_Q58` (`24` trees); checking `2022_FN_Q52(B)` on $P_3$ (`n=3`, `A^2 + I` has zeros!).
- **Common mistakes:** Thinking `A^{n-1} + I` has no zeros for connected graphs (`2022_FN_Q52(B)`: bipartite graphs have zero odd-length walks!); dividing `tr(A^3)` by `3` instead of `6` (`2022_FN_Q37`!); using $n^{n-2} = 125$ on directed DAG `2022_FN_Q58`!

---

### Chapter 06B · Graph Theory B: Traversals, Matching, Cover and Coloring

#### Lesson 06B.1 · Euler/Hamilton, Vertex Cover, Matchings (`Gallai`) & Graph Coloring (`2-Color`, `Greedy`, `Vizing`)
- **Tag:** `[MUST]` — High-yield 2-mark MSQ/NAT generator (`2026_FN_Q47`, `2026_FN_Q55`, `2026_FN_Q57`, `2024_FN_Q59`, `2024_AN_Q63`, `2023_FN_Q55`, `2022_FN_Q50`, `2020_FN_Q53`, `2019_FN_Q12`, `2018_FN_Q28`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 06A.1, Lesson 06A.2.
- **Beginner must-see:** Graph coloring gives neighbouring cities different colors (**Proper Coloring**); **Matching** pairs people up with no overlaps; **Vertex Cover** puts guards on vertices so every road has at least one guard! Notice how two simple ideas (**Pigeonhole Principle** + **2-Color BFS**) solve almost every coloring and vertex-cover theorem in GATE!
- **Finer points:**
  - **Euler vs Hamiltonian (`2019_FN_Q12`, `2022_FN_Q50`):**
    - Euler circuit (`connected + all even deg`), Euler path (`0 or 2 odd deg`).
    - Hamiltonian cycles in $K_n$ (`(n-1)!/2` edge subsets vs `1` up to isomorphism — explain `2019_FN_Q12` dual official key!); Petersen Graph (`3`-reg, girth `5`, $\chi = 3$, Ham path YES, Ham cycle NO, $\alpha = 4$, `2022_FN_Q50`).
  - **Independent Set ($\alpha$), Vertex Cover ($\tau$), Matching ($\nu$) & Path Matching Count (`2026_FN_Q47`, `2026_FN_Q57`):**
    - Gallai: $\alpha + \tau = n$ (complement of IS is VC!).
    - Minimum VC of size $k$ (`2026_FN_Q47`): if $\deg(v) \ge k + 1$, $v$ MUST belong to EVERY size-$k$ cover $S$!
    - Matchings on path $P_n$ (`2026_FN_Q57`): Fibonacci $M(n) = M(n-1) + M(n-2)$ (`M(8) = 34` including $\emptyset$!).
    - König's Theorem (Bipartite: $\nu = \tau$) & Hall's Marriage Theorem (`|N(S)| >= |S|`).
  - **Vertex & Edge Coloring Theorems (`2026_FN_Q55`, `2024_FN_Q59`, `2023_FN_Q55`, `2020_FN_Q53`):**
    - **2-Colorable (`2026_FN_Q55`):** $\iff$ Bipartite $\iff$ No odd cycles, testable in $\Theta(|V| + |E|)$ via BFS/DFS!
    - **Chromatic Bounds (`2024_FN_Q59`):** $\chi(G) = k \implies \alpha(G) \ge n / k$ AND $|E| \ge \binom{k}{2} = \frac{k(k-1)}{2}$! (Does NOT require $K_k$ subgraph or degree $\ge k$!).
    - **Greedy Coloring (`2023_FN_Q55`):** Proper coloring using $\le \Delta(G) + 1$ colors (can exceed $\chi(G)$ and $\Delta(G)$!).
    - **Edge Coloring (`Vizing's Theorem`, `2020_FN_Q53`):** $\Delta(G) \le \chi'(G) \le \Delta(G) + 1$ (Bipartite ALWAYS $\Delta$; `K_{3,4} + s` has $\Delta = 7$ and $\chi' = 7$!).
- **GATE-level items:** Degree $\ge k+1$ VC proof (`2026_FN_Q47`), path matchings (`2026_FN_Q57`: `34`), 2-coloring BFS complexity (`2026_FN_Q55`), chromatic `n/k` & `k(k-1)/2` bounds (`2024_FN_Q59`), greedy `<= \Delta + 1` (`2023_FN_Q55`), Petersen properties (`2022_FN_Q50`), edge coloring `K_{3,4}+s` (`2020_FN_Q53`: `7`), and $K_n$ Ham cycles (`2019_FN_Q12`).
- **Diagrams needed:** `GRAPHPIC` (Petersen graph 3-colored + 4-IS highlighted, `2022_FN_Q50`; `v` with `k+1` spokes forced into VC, `2026_FN_Q47`; `K_{3,4}+s` 7-edge-coloring, `2020_FN_Q53`); `TREE` (`P_8` matching split `M(7) + M(6)`, `2026_FN_Q57`); `CHEATPIC` (Coloring & Gallai Theorems Summary).
- **Hand traces:** Tracing `M(0)..M(8)` for `2026_FN_Q57` (`34`), greedy coloring `C_5` vs bipartite `P_4` (`bad vertex order uses 3 colors instead of 2!`), and verifying `2024_FN_Q59(B, C)`.
- **Common mistakes:** Thinking $\chi(G) = k$ guarantees a $K_k$ clique (`2024_FN_Q59(A)` — `C_5` has $\chi = 3$, no $K_3$!); thinking max independent set of Petersen graph is `3` (`4`, `2022_FN_Q50(D)`!); forgetting the empty matching `0 edges` when counting matchings in `2026_FN_Q57` (`33` vs `34`!).

---

`CONTINUE FROM CHAPTER 07`
## PART 5 (Continued) · Chapters 07 and 08

### Chapter 07 · Counting and Combinatorics

#### Lesson 07.1 · Counting Rules, Parity Grids, Per-Element Choice & Twelvefold Way (`Stars & Bars`, `Partitions`, `Stirling`)
- **Tag:** `[MUST]` — High-yield NAT staple (`2026_FN_Q12`, `2025_FN_Q30`, `2023_FN_Q48`, `2022_FN_Q32`, `2021_FN_Q21`, `2021_AN_Q37`, `2019_FN_Q26`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 03.1.
- **Beginner must-see:** Almost every scary GATE counting puzzle melts away the instant you stop counting big complex objects and ask: **"How many independent choices does EACH single element (or inner square) have?"** For `(A ⊆ B)` over 10 items, each item simply picks `Both`, `B-only`, or `Neither` (`3^{10}`, `2021_AN_Q37`); for a `4×4` even-parity grid, only the `3×3` interior picks freely (`2^9 = 512`, `2026_FN_Q12`)!
- **Finer points:**
  - **Product/Sum Rules & Complement Counting (`2025_FN_Q30`):** Total $3^5 = 243$ minus alternating no-adjacent-repeats `3 × 2^4 = 48` = `195`!
  - **Per-Element Choice & Parity Border Tricks:**
    - `4×4` even-parity `{0,1}` matrices: **$2^{(n-1)^2} = 512$** (`2026_FN_Q12`).
    - Ordered pairs `(A \subseteq B)` = **$3^n$** (`2021_AN_Q37`: `59049`).
    - Pairs `(x \in X)` = **$n \cdot 2^{n-1} = \sum k \binom{n}{k}$** (`2019_FN_Q26`).
    - Separating disjoint `k`-subsets $A, B$ in permutation of $U$: **$2 \binom{n}{2k} (n-2k)! (k!)^2$** (`2023_FN_Q48`).
  - **The Twelvefold Way (Balls into Bins 2×2 Matrix):**
    - **Identical Balls (`n`) into Distinct Bins (`r`) (Stars & Bars):** $\binom{n+r-1}{r-1}$ (`>= 0`) or $\binom{n-1}{r-1}$ (`>= 1`).
    - **Identical Balls into Identical Bins (Integer Partitions `p_k(n)`, `2022_FN_Q32`):** List non-increasing partitions cleanly (`6` into `<= 3` parts = `7`)!
    - **Distinct Balls into Distinct Bins (Onto = Stirling $r! S(n, r)$, `2021_FN_Q21`):** Constrained assignment (`Fast` gets hardest, `Slow` gets easiest, `Med` gets $\ge 1$ of remaining 4 = $3^4 - 2^4 = 65$)!
- **GATE-level items:** Parity grids (`2026_FN_Q12`: `512`), complement string counting (`2025_FN_Q30`: `195`), subset separation (`2023_FN_Q48`), identical balls/bins partitions (`2022_FN_Q32`: `7`), constrained job assignment (`2021_FN_Q21`: `65`), `A \subseteq B` pairs (`2021_AN_Q37`: `59049`), and `n 2^{n-1}` identity (`2019_FN_Q26`).
- **Diagrams needed:** `MATRIX` (`4×4` parity grid shading `3×3` free interior vs dependent border, `2026_FN_Q12`); `COMPARE` (Balls-into-Bins 2×2 Matrix + `A ⊆ B` 3-choice bucket).
- **Hand traces:** Tracing `2026_FN_Q12` (`512`), `2022_FN_Q32` (`7` partitions), `2021_FN_Q21` (`65`), and `2023_FN_Q48` (`× 2` order factor).
- **Common mistakes:** Using Stars & Bars $\binom{6+3-1}{2} = 28$ when bins are **identical** (`2022_FN_Q32` = `7`, NOT `28`!); forgetting `× 2` for `(A before B)` vs `(B before A)` in `2023_FN_Q48`; subtracting `3×2^4` wrong in `2025_FN_Q30`.

#### Lesson 07.2 · Inclusion-Exclusion, Pigeonhole Principle & Derangements (With Duplicates)
- **Tag:** `[MUST]` — Classic NAT & proof tool (`2020_FN_Q52`, `2017_FN_Q41`).
- **Estimated reading time:** 55 minutes.
- **Prerequisites:** Lesson 07.1.
- **Beginner must-see:** Whenever counting `"A OR B OR C"` (`2017_FN_Q41`), simple addition double-counts overlaps — **Inclusion-Exclusion (PIE)** cleanly adds singles, subtracts pairs, adds triples (`+ - +`)! And **Derangements ($D_n$)** count shuffles where *nobody* lands back in their original seat — watch out for **duplicate letters** like `L I L A C` (`2020_FN_Q52`), which breaks the raw $D_5$ formula!
- **Finer points:**
  - **Inclusion-Exclusion Principle (`2017_FN_Q41`):** 2-set, 3-set (`|A ∪ B ∪ C|`), and onto-function formula $\sum (-1)^k \binom{r}{k} (r-k)^n$.
  - **Derangements:** $D_n = n! \sum_{k=0}^n \frac{(-1)^k}{k!}$ (`D_1=0, D_2=1, D_3=2, D_4=9, D_5=44`).
  - **Derangements with Repeated Elements (`2020_FN_Q52`):** Partition placements of identical `L`s away from their original indices (`{2, 4, 5}` -> `\binom{3}{2} = 3` ways), then count remaining distinct letters `{I, A, C}` avoiding their home slots (`4` each -> `12`)!
  - **Pigeonhole Principle (General Form):** $\lceil N / k \rceil$ guarantees!
- **GATE-level items:** Multiples of `3, 5, or 7` (`2017_FN_Q41`: `271`), repeated-letter derangements (`2020_FN_Q52`: `12`), and onto/PIE counting.
- **Diagrams needed:** `GRAPHPIC` (3-circle PIE Venn diagram for `3, 5, 7` multiples up to `500`, `2017_FN_Q41`); `TREE` (`LILAC` 3-case slot assignment avoiding fixed positions, `2020_FN_Q52`).
- **Hand traces:** Tracing `2017_FN_Q41` (`271`) and `2020_FN_Q52` (`12` vs why raw $D_5 / 2! = 22$ is WRONG!).
- **Common mistakes:** Dividing `D_5 = 44` by `2!` for `LILAC` (`22` fails because putting `L` #1 in `L` #2's slot isn't a derangement when `L`s are identical — `2020_FN_Q52` = `12`!); rounding `floor(500 / 105)` carelessly in PIE!

---

### Chapter 08 · Recurrences and Generating Functions

#### Lesson 08.1 · Linear Recurrences (Roots & Cancellation) & Binary Recurrences (`Josephus`)
- **Tag:** `[MUST]` — Tested across recent papers (`2024_AN_Q20`, `2023_FN_Q15`, `2022_FN_Q51`).
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 00.1 (Induction), high-school quadratics.
- **Beginner must-see:** To solve a step-backwards formula like $T(n) = 5T(n-1) - 6T(n-2)$, guess $T(n) = r^n$ to get a simple quadratic equation ($r^2 - 5r + 6 = 0 \implies r = 2, 3$)! **NEVER skip plugging in initial values $T(0), T(1)$:** sometimes the bigger root `3^n` cancels to `0`, leaving $\Theta(2^n)$ instead of $\Theta(3^n)$ (`2024_AN_Q20`)!
- **Finer points:**
  - **Linear Homogeneous Constant-Coefficient Recurrences (`2024_AN_Q20`, `2023_FN_Q15`):**
    - Distinct roots $r_1, r_2 \implies c_1 r_1^n + c_2 r_2^n$ (always check $c_2 \neq 0$ before assuming dominant root! `2024_AN_Q20`: $c_2 = 0 \implies \Theta(2^n)$!).
    - Repeated root $r$ multiplicity $k \implies (c_0 + c_1 n + \dots + c_{k-1} n^{k-1}) r^n$.
    - Lucas & Fibonacci closed forms (`2023_FN_Q15`: $\phi^n + \hat{\phi}^n$).
  - **Non-Homogeneous Recurrences (`[SHOULD]`):** Particular solution guesses (`const`, `poly`, `d^n`, multiplying by `n` if `d` matches a characteristic root).
  - **Binary Divide-by-2 Recurrences (`2022_FN_Q51`):** Compute small values (`f(1)..f(10)`), read the binary representation (`101_2 -> 011_2` left cyclic shift!), and verify closed forms via induction (`f(2^n) = 1`, `f(5·2^n) = 2^{n+1} + 1`).
- **GATE-level items:** Initial-condition root cancellation (`2024_AN_Q20`: $\Theta(2^n)$), Lucas closed form (`2023_FN_Q15`), and binary Josephus recurrence MSQ (`2022_FN_Q51`).
- **Diagrams needed:** `TRACE` (Small value table `f(1)..f(12)` paired with binary strings showing left-rotation pattern, `2022_FN_Q51`); `FLOW` (4-step Characteristic Equation solver highlighting the "Check $c_i \neq 0$" warning box, `2024_AN_Q20`).
- **Hand traces:** Solving `2024_AN_Q20` (`c_1=1, c_2=0`), checking `L_1, L_2` for `2023_FN_Q15`, and evaluating `f(2^n - 1), f(2^n), f(5·2^n), f(2^n + 1)` in `2022_FN_Q51`.
- **Common mistakes:** Picking $\Theta(3^n)$ blindly from $r^2 - 5r + 6 = 0$ without checking $c_2$ (`2024_AN_Q20`!); reading `5.2^n` as decimal `5.2` instead of `5 · 2^n` (`2022_FN_Q51`!).

#### Lesson 08.2 · Ordinary Generating Functions (`OGFs`): Closed Forms & Coefficient Extraction
- **Tag:** `[MUST]` — High-yield formula mastery (`2022_FN_Q36`, `2018_FN_Q11`, `2017_AN_Q48`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 08.1, binomial series.
- **Beginner must-see:** An **Ordinary Generating Function (OGF)** packs an ENTIRE infinite sequence $\{a_0, a_1, a_2, \dots\}$ onto one single clothesline as coefficients of $1, x, x^2, \dots$! Instead of wrestling with messy recurrences or odd/even piecewise sequences, you compress the infinite list into ONE tiny fraction like $\frac{1+z}{(1-z)^3}$ and pull out any term $[z^n]$ instantly using just 5 geometric/binomial patterns!
- **Finer points:**
  - **The 5 Master OGF Identities:**
    1. $\frac{1}{1 - x} = \sum_{n=0}^\infty x^n$ (and $\frac{1}{1 - ax} = \sum a^n x^n$).
    2. $\frac{x}{(1 - x)^2} = \sum_{n=0}^\infty n x^n$ (via differentiation!).
    3. **General Negative Binomial:** $\frac{1}{(1 - x)^k} = \sum_{n=0}^\infty \binom{n + k - 1}{k - 1} x^n$ (`2017_AN_Q48`!).
    4. **Even / Odd Term Isolation:** $\frac{f(x) + f(-x)}{2}$ (even indices) and $\frac{f(x) - f(-x)}{2}$ (odd indices) (`2022_FN_Q36`!).
    5. **Shifting:** $x^m f(x)$ shifts index right by $m$.
  - **Combining & Extracting `[x^n]` (`2022_FN_Q36`, `2018_FN_Q11`, `2017_AN_Q48`):**
    - `a_n = 2n + 3` (`2018_FN_Q11` -> `2x/(1-x)^2 + 3/(1-x) = (3-x)/(1-x)^2`).
    - Odd `n+1`, even `1` (`2022_FN_Q36` -> `1/(1-x) + x(1+x^2)/(1-x^2)^2`).
    - `(1+z)/(1-z)^3` (`2017_AN_Q48` -> `a_3 = \binom{5}{2} + \binom{4}{2} = 16`, `a_3 - a_0 = 15`).
  - **Solving Recurrences via OGF & Catalan (`[SHOULD]`):** Turning $a_n = 2a_{n-1} + 1$ into algebraic `A(x)` and partial fractions.
- **GATE-level items:** OGF closed forms (`2022_FN_Q36`, `2018_FN_Q11`) and exact coefficient extraction (`2017_AN_Q48`: `15`).
- **Diagrams needed:** `CHEATPIC` (5 Master OGF Building Blocks Card + Even/Odd Splitter); `TRACE` (Term-by-term coefficient matching for `2022_FN_Q36` and `2017_AN_Q48`).
- **Hand traces:** Tracing `2022_FN_Q36` (`x(1+x^2)/(1-x^2)^2 + 1/(1-x)`), `2018_FN_Q11` (`(3-x)/(1-x)^2`), and `2017_AN_Q48` (`16 - 1 = 15`), plus testing first 4 coefficients (`a_0..a_3`) of options as an exam sanity check!
- **Common mistakes:** Writing $\frac{1}{(1-x)^2} = \sum n x^n$ (`n=0` missing, it is $\sum (n+1) x^n$ while $x/(1-x)^2$ gives $\sum n x^n$!); forgetting index shift on `z / (1-z)^3` (`2017_AN_Q48`!); missing the quick exam hack of checking first 3 series terms `a_0, a_1, a_2` against options!

---

## PART 6. EVERY PYQ LISTED BELOW (Batch 1: Questions #1 to #38)

*(Re-solved and checked one by one. Missing figures and key anomalies are explicitly flagged.)*

| # | PYQ ID | (a) Ch / Lesson | (b) Exact Concept Tested | (c) Trap / Finer Point | (d) Official Key Check & Working | (e) Transcription Check |
|---|---|---|---|---|---|---|
| 1 | `2026_AN_Q11` | Ch 02 / L02.1 | Translating `"exists person y known by all others, knowing no others"` into FOL. | Pair `∀x` with `(x != y) -> ...` (vacuously true at `x = y`!), NOT `∃x` or `∀y`. | **CORRECT (A).** `(\exists y)(\forall x)((x \neq y) \to (M(x,y) \land \neg M(y,x)))`. | Clean. |
| 2 | `2026_FN_Q12` | Ch 07 / L07.1 | Counting `4×4` `{0,1}` matrices with even # of 1s in every row and column. | Top-left `3×3` cells pick freely (`2^9 = 512`), which uniquely fixes row-4 and col-4 parity bits (corner `(4,4)` automatically agrees!). | **CORRECT (A: 512).** $2^{(4-1)^2} = 2^9 = 512$. | Clean. |
| 3 | `2026_AN_Q26` | Ch 00, 03 / L00.1, L03.2 | Properties of `x·y = square` on `{1..10}` (`squarefree` equivalence). | `x·y` square $\iff \text{sqfree}(x) = \text{sqfree}(y)$ -> **Equivalence** (`Refl, Sym, Trans`); NOT antisymmetric since `(1,4)` and `(4,1)` both hold! | **CORRECT (A, B, C).** | Clean. |
| 4 | `2026_AN_Q36` | Ch 06A / L06A.2 | Lowest Jaccard coefficient `|T1 ∩ T2| / |T1 ∪ T2|` between spanning trees of `K_n` ($n > 4$). | For $n \ge 4$, $K_n$ has $\binom{n}{2} \ge 2(n-1)$ edges and contains TWO completely **edge-disjoint** spanning trees -> `|T1 ∩ T2| = 0` -> Jaccard = `0`! | **CORRECT (C: 0).** | Clean. |
| 5 | `2026_FN_Q47` | Ch 06B / L06B.1 | Condition forcing vertex `v` into EVERY minimum vertex cover `S` of size `k`. | If `deg(v) >= k + 1` and $v \notin S$, ALL `>= k+1` neighbours of `v` must enter `S` (contradicting `|S| = k`!). Path/cycle/clique of `k` don't force `v`! | **CORRECT (A).** | Clean. |
| 6 | `2026_FN_Q55` | Ch 06B / L06B.1 | Properties & optimal testing complexity of 2-colorable (bipartite) graphs. | 2-colorable $\iff$ no odd cycles (even cycles OK, `B` true), tested by BFS/DFS 2-coloring in $\Theta(|V| + |E|)$ on adjacency lists (`C` true). | **CORRECT (B, C).** | Clean. |
| 7 | `2026_FN_Q57` | Ch 06B / L06B.1 | Counting total matchings (including empty matching!) in path `P_8`. | Recurrence $M(n) = M(n-1) + M(n-2)$ (`M(0)=1, M(1)=1`) gives Fibonacci `1, 1, 2, 3, 5, 8, 13, 21, 34`! | **CORRECT (34).** $M(8) = 34$. | Clean. |
| 8 | `2025_AN_Q15` | Ch 00 / L00.1 | Identifying valid Mathematical Induction principle over natural numbers $\mathbb{N}$. | Must start at base `0` AND step forward `x -> x + 1` (`P(1000)` misses `0..999`; `x -> x - 1` cannot move forward!). | **CORRECT (A).** | Clean. |
| 9 | `2025_FN_Q17` | Ch 03 / L03.1 | Properties of `g: A->B` given `f: B->C` and `f ∘ g` are both **onto**. | `f ∘ g` onto forces ONLY `f` onto; `g` doesn't need to be 1-1 or onto (`A={1,2,3}, B={1,2}, C={1}` with `g(x)=1`). | **CORRECT (D).** | Clean. |
| 10 | `2025_FN_Q30` | Ch 07 / L07.1 | Length-5 ternary strings (`{a,b,c}`) having at least one `aa`, `bb`, or `cc`. | Use complement! Total = $3^5 = 243$; no-consecutive-equals = `3 × 2^4 = 48` -> `243 - 48 = 195`. | **CORRECT (195).** | Clean. |
| 11 | `2025_AN_Q42` | Ch 04 / L04.1 | Pointwise order `f <= g` on boolean functions `F = {0,1}^{\{1..n\}}`. | Isomorphic to Boolean subset lattice `(2^{\{1..n\}}, \subseteq)` -> Partial order (`B`) AND Lattice (`C`, `join = max`, `meet = min`). | **CORRECT (B, C).** | Clean. |
| 12 | `2025_FN_Q43` | Ch 06A / L06A.1 | Minimum guaranteed height of ANY BFS tree `T` in graph with diameter `30`. | Triangle inequality `30 = d(u,v) <= d(u,r) + d(r,v) <= 2 · height(T)` -> `height(T) >= 15` (achievable by rooting at diameter midpoint!). | **CORRECT (C: at least 15).** | Clean. |
| 13 | `2025_FN_Q48` | Ch 02 / L02.1 | Equivalent FOL formulas for `"Everyone has exact 1 mother"`. | Both `∀z (z != y -> ¬M(z,x))` (`B`) and `¬∃z (z != y ∧ M(z,x))` (`D`) enforce uniqueness; `C` passes vacuously for motherless `x`! | **CORRECT (B, D).** | Clean. |
| 14 | `2025_FN_Q49` | Ch 05 / L05.1 | Algebraic classification of `({0,1,2,...}^N, +)`. | Associative + Commutative + Identity (`0`-function), NO additive inverses (non-negative ints) -> **Abelian Monoid** (`B`). | **CORRECT (B).** | Clean. |
| 15 | `2024_AN_Q26` | Ch 01 / L01.1 | Translating `"Fail grade (p) cannot be given when > 50% (q)"`. | Literally `q -> ¬p`, whose contrapositive is **`p -> ¬q`** (`A`)! | **CORRECT (A: `p -> ¬q`).** | Clean. |
| 16 | `2024_AN_Q20` | Ch 08 / L08.1 | Asymptotic growth of $T(n) = 5T(n-1) - 6T(n-2)$ (`T(0)=1, T(1)=2`). | Roots are `2, 3`, YET initial conditions give $c_1 = 1, c_2 = 0$, making $3^n$ vanish -> $T(n) = 2^n = \Theta(2^n)$! | **CORRECT (A: `\Theta(2^n)`).** | Clean. |
| 17 | `2024_AN_Q15` | Ch 06A / L06A.2 | Undirected simple graph whose Adjacency Matrix satisfies $A = A^{-1}$ ($A^2 = I$). | `(A^2)_{ii} = \deg(i) = 1` for EVERY vertex `i` -> disjoint edges touching all vertices = **Perfect Matching** (`B`)! | **CORRECT (B).** | Clean. |
| 18 | `2024_FN_Q28` | Ch 03 / L03.1 | Number of possible sizes `|A| = k >= 1` given bijections `A->B` and `A×A -> A∪B`. | `|B| = k` means `k <= |A ∪ B| <= 2k` -> `k <= k^2 <= 2k` -> `k \in {1, 2}` -> **2** values! | **CORRECT (2).** | Clean. |
| 19 | `2024_FN_Q31` | Ch 06A / L06A.2 | Number of labelled spanning trees of $K_4$. | Cayley's formula: $4^{4-2} = 4^2 = 16$. | **CORRECT (16).** | Clean. |
| 20 | `2024_AN_Q18` | Ch 04 / L04.1 | Counting total orders on `{1,2,3,4}` extending `P = {1<2, 3<2, 3<4}`. | Case `1` first: `1324, 1342` (`2`); Case `3` first: `{1,2,4}` keeping `1<2` (`3` ways) -> `2 + 3 = 5`! | **CORRECT (5).** | Clean. |
| 21 | `2024_FN_Q59` | Ch 06B / L06B.1 | Necessary truths for any $n$-vertex graph with chromatic number $k$. | Pigeonhole on $k$ independent color classes gives max IS $\ge n/k$ (`B`), and every pair of colors needs $\ge 1$ edge (`\binom{k}{2} = k(k-1)/2`, `C`); clique $K_k$ (`A`) and deg $\ge k$ (`D`) fail (`C_5`, `K_k`)! | **CORRECT (B, C).** | Clean. |
| 22 | `2024_AN_Q37` | Ch 06A / L06A.2 | Parity property of edges in cycles when **every** spanning tree has even weight. | Swapping any two edges `e1, e2` on a cycle `C` between two STs forces `w(e1) \equiv w(e2) \pmod 2` -> every cycle has ALL even or ALL odd edges (`D`)! | **CORRECT (D).** | Clean. |
| 23 | `2024_FN_Q65` | Ch 05 / L05.1 | Associativity & Distributivity of custom operators `a ◇ b = a + 2b`, `a □ b = ab`. | `◇` is non-associative; `□` is associative (`B`) and distributes over `◇` (`a(b + 2c) = ab + 2ac`, `D`)! | **CORRECT (B, D).** | Clean. |
| 24 | `2024_AN_Q63` | Ch 06B / L06B.1 | Chromatic number of a given graph diagram. | Need graph figure `[IMAGE_Q_63_1]`. | **CANNOT VERIFY** (Key: 2). Figure `[IMAGE_Q_63_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_63_1]`). |
| 25 | `2024_AN_Q41` | Ch 05 / L05.2 | Counting self-inverse elements ($2x \equiv 0$) in $Z_2 \times Z_3 \times Z_4$. | Count coordinate-wise: `Z_2` has `{0, 1}` (`2`), `Z_3` has `{0}` (`1`), `Z_4` has `{0, 2}` (`2`) -> `2 × 1 × 2 = 4`! | **CORRECT (4).** | Clean. |
| 26 | `2023_FN_Q15` | Ch 08 / L08.1 | Closed form of Lucas sequence ($L_1=1, L_2=3, L_n = L_{n-1} + L_{n-2}$). | Characteristic roots $\frac{1 \pm \sqrt{5}}{2}$ with $c_1 = c_2 = 1$ give sum of $n$-th powers (`A`). | **CORRECT (A).** | Clean. |
| 27 | `2023_FN_Q26` | Ch 02 / L02.1 | Identifying FOL sentences that **imply** `∀x (P(x) => ∃y Q(x, y))`. | `∀x ∀y Q` (`B`) and `∃y ∀x (P -> Q)` (`C`) both strengthen to cover ALL `x`; `∃x` statements (`A, D`) don't! | **CORRECT (B, C).** | Clean. |
| 28 | `2023_FN_Q48` | Ch 07 / L07.1 | Permutations of `{1..n}` where all of `A` appear before all of `B` or vice versa (`|A|=|B|=k`). | Pick `2k` positions `\binom{n}{2k}`, choose `A`-first vs `B`-first (`2` ways!), permute `A` (`k!`), `B` (`k!`), rest (`(n-2k)!`)! | **CORRECT (D).** | Clean. |
| 29 | `2023_FN_Q49` | Ch 03 / L03.2 | Properties of induced Quotient Map `F([x]) = f(x)` for onto `f: A -> B`. | `a1 ~ a2 <=> f(a1) = f(a2)` makes `F` well-defined, injective, surjective, hence bijective (`B, C, D`). | **CORRECT (B, C, D).** | Clean. |
| 30 | `2023_FN_Q51` | Ch 05 / L05.1 | Group structure & inverses of `(2^X, Δ)` (symmetric difference). | Associative, identity = $\emptyset$, and $A \Delta A = \emptyset \implies A^{-1} = A$ (`A, D` true; NOT complement `C`)! | **CORRECT (A, D).** | Clean. |
| 31 | `2023_FN_Q55` | Ch 06B / L06B.1 | Greedy vertex coloring properties (`min available color` loop). | Always valid (`A`) and uses $\le \Delta(G) + 1$ (`B`), though can exceed $\Delta$ (`K_n`, odd cycles) and $\chi(G)$ (bad vertex ordering!). | **CORRECT (A, B).** | Clean. |
| 32 | `2023_FN_Q56` | Ch 06A / L06A.1 | Number of BFS traversal orderings starting from $\emptyset$ on subset-comparability graph of $2^{\{1,2,3\}}$. | Because $\emptyset \subset B$ for ALL other 7 subsets, $\emptyset$ has an edge to **every single other vertex**! Thus BFS visits $\emptyset$ then all `7! = 5040` orders! | **CORRECT (5040).** | Clean. |
| 33 | `2022_FN_Q27` | Ch 05 / L05.1, L05.2 | Conditions forcing a group `G` to be Abelian & subgroup commutativity. | `(xy)^2 = x^2 y^2` cancels to `yx = xy` (`A`); `x^2 = 1` gives `xy = yx` (`B`); order 2 is cyclic (`C`); subgroups of Abelian are always Abelian (`D` false). | **CORRECT (A, B, C).** | Clean. |
| 34 | `2022_FN_Q30` | Ch 06A / L06A.1 | Maximum edges in a disconnected simple undirected graph on `10` vertices. | Split into `K_9 + K_1`: $\binom{9}{2} = 9 × 8 / 2 = 36$ edges. | **CORRECT (36).** | Clean. |
| 35 | `2022_FN_Q32` | Ch 07 / L07.1 | Counting arrangements of `6` **identical** balls into `3` **identical** bins. | Integer partitions of `6` into $\le 3$ parts: `6, 5+1, 4+2, 4+1+1, 3+3, 3+2+1, 2+2+2` = `7`! (Trap: Stars & Bars `28` only applies to distinct bins!). | **CORRECT (7).** | Clean. |
| 36 | `2022_FN_Q36` | Ch 08 / L08.2 | Closed-form OGF for `a_n = n+1 (odd), 1 (even)`. | Split `1/(1-x)` + odd `n x^n`: $x \sum (2k+1)x^{2k} = \frac{x(1+x^2)}{(1-x^2)^2}$ (`A`). | **CORRECT (A).** | Clean. |
| 37 | `2022_FN_Q37` | Ch 06A / L06A.2 | Counting 3-cycles (triangles) from Adjacency Matrix $A^3$. | `tr(A^3)` counts every triangle `3` start vertices × `2` orientations = `6` times -> `tr(A^3) / 6` (`D`). | **CORRECT (D).** | Clean. |
| 38 | `2022_FN_Q50` | Ch 06B / L06B.1 | Properties of the **Petersen Graph** (coloring, Ham path, isomorphism, max IS). | `χ = 3` (`A`), has Hamiltonian path (`B`), max independent set = **`4`** (NOT `3`, `D` false!). Note `[IMAGE_Q_50_1]` & `[IMAGE_Q_50_C]` missing for C! | **A, B VERIFIED; C CANNOT VERIFY** (Official A, B, C). | **MISSING FIGURES** (`[IMAGE_Q_50_1]`, `[IMAGE_Q_50_C]`). |

---

`CONTINUE FROM PART 6 (PYQ #39)`
## PART 6 (Continued) · Batch 2: Questions #39 to #75

| # | PYQ ID | (a) Ch / Lesson | (b) Exact Concept Tested | (c) Trap / Finer Point | (d) Official Key Check & Working | (e) Transcription Check |
|---|---|---|---|---|---|---|
| 39 | `2022_FN_Q51` | Ch 08 / L08.1 | Binary / Josephus recurrence ($f(2n)=2f(n)-1$, $f(2n+1)=2f(n)+1$). | Compute small cases & induct: `f(2^n - 1) = 2^n - 1` (`A`), `f(2^n) = 1` (`B`), `f(5·2^n) = 2^{n+1} + 1` (`C`), while `f(2^n + 1) = 3` (`D` false!). | **CORRECT (A, B, C).** | Minor typo in Option C: `f(5.2^n)` looks like decimal `5.2`; should be `f(5 \cdot 2^n)`. |
| 40 | `2022_FN_Q52` | Ch 06A / L06A.2 | Properties of Adjacency Matrix powers $A, A^2, A^{n-1} + I$ on simple undirected graph. | `(A^2)_{ii} = deg(i)` (`A` true); `A^{n-1} + I` can STILL have `0` entries on connected bipartite graphs (`B` false!); `|E| <= n-1` allows `K_3 + isolated` (`C` false!); `K_2 + K_2` has 1 in every row/col (`D` false!). | **CORRECT (A).** | Clean. |
| 41 | `2022_FN_Q58` | Ch 06A / L06A.2 | Counting rooted directed spanning trees (`root = 5`) in a DAG (`j <= i` -> `i` points to smaller `j`). | Ignore self-loops `j=i`; every node $k \in \{1,2,3,4\}$ must pick 1 parent $p(k) > k$: `1 × 2 × 3 × 4 = 24`! | **CORRECT (24).** | Clean. |
| 42 | `2021_FN_Q27` | Ch 01 / L01.1 | Tautology checking via Falsification / equivalence (`S1` vs `S2`). | Watch `S1` conclusion carefully! Under printed text `-> p`, setting `p=F, q=T` gives `(T ∧ T) -> F = FALSE`! | **FACT-DOUBT (CRITICAL MIS-TRANSCRIPTION)!** Printed `S1: (¬p ∧ (p ∨ q)) -> p` is **NOT a tautology** (falsified at `p=F, q=T`), making **D (`Neither`)** true instead of official **B**! Actual GATE 2021 `S1` ended with **`-> q`**, which IS a tautology! | **MIS-TRANSCRIPTION:** Change `-> p` at end of `S1` to `-> q`! |
| 43 | `2021_AN_Q27` | Ch 03 / L03.1 | Bijection & Surjection between equal-size finite sets (`3^{n^2}` elements each). | Both `S1` (`n×n` matrices over `{a,b,c}`) and `S2` (`{0..n^2-1} -> {0,1,2}`) have exact cardinality $3^{n^2}$ -> bijection AND surjection exist! | **CORRECT (B, C).** | Clean. |
| 44 | `2021_AN_Q60` | Ch 01 / L01.1 | Propositional tautology & equivalence (`(P ∧ Q -> R)` vs `(P ∧ Q) -> (Q -> R)`). | Inside `P ∧ Q -> (Q -> R)`, `Q` appears twice (`(P ∧ Q ∧ Q) -> R ≡ (P ∧ Q) -> R`), so antecedent and consequent are logically equivalent (`D`) -> `S` is a tautology (`B`)! | **CORRECT (B, D).** | Clean. |
| 45 | `2021_FN_Q24` | Ch 06A / L06A.2 | Planar graph Euler formula (`V - E + F = 2`). | `8 - E + 5 = 2 => E = 11`. | **CORRECT (11).** | Clean. |
| 46 | `2021_FN_Q21` | Ch 07 / L07.1 | Constrained job assignment (`6` distinct jobs to `3` distinct computers, every computer $\ge 1$). | Hardest job forced on Fastest, easiest forced on Slowest -> remaining 4 jobs go freely to 3 computers (`3^4 = 81`) minus cases where Medium gets `0` (`2^4 = 16`) = `65`! | **CORRECT (65).** | Clean. |
| 47 | `2021_FN_Q52` | Ch 05 / L05.2 | Cyclicity of group `G` of order `6` vs its proper non-trivial subgroup `H`. | `S_3` has order `6` and is NOT cyclic; yet `1 < |H| < 6` forces `|H| \in {2, 3}` (prime!), so `H` is ALWAYS cyclic (`B`)! | **CORRECT (B).** | Clean. |
| 48 | `2021_FN_Q35` | Ch 06A / L06A.2 | Diameter of squared graph $G_2$ (`M + M^2`) vs original graph $G$. | Connecting distance-2 pairs cuts every shortest path length $d$ to $\lceil d/2 \rceil$, so `diam(G_2) <= ceil(diam(G)/2)` (`A`). | **CORRECT (A).** | Clean. |
| 49 | `2021_FN_Q29` | Ch 03 / L03.2 | Circular relations (`aRb ∧ bRc => cRa`) combined with Refl/Sym/Trans. | `Refl + Circ => Sym` (`aRa ∧ aRb => bRa`) and `=> Trans` (`aRb ∧ bRc => cRa => aRc`) (`C` true)! Isolated vertex breaks `Sym+Circ` (`B`) and `Trans+Circ` (`D`)! | **CORRECT (C).** | Clean. |
| 50 | `2021_AN_Q37` | Ch 07 / L07.1 | Counting pairs of subsets `(A, B)` of a `10`-element set with $A \subseteq B$. | Each element picks 1 of 3 roles (`in A&B`, `in B\A`, `in S\B`) -> $3^{10} = 59049$. | **CORRECT (59049).** | Clean. |
| 51 | `2020_FN_Q11` | Ch 03 / L03.2 | Probability that a random binary relation on `{1, 2, 3}` is reflexive. | Total relations = $2^9 = 512$; reflexive fixes 3 diagonal entries (`2^6 = 64`) -> `64 / 512 = 1/8 = 0.125`. | **CORRECT (0.125).** | Clean. |
| 52 | `2020_FN_Q32` | Ch 05 / L05.2 | Largest proper subgroup of a group of order `35` (Lagrange's Theorem). | `|H|` divides `35 = 5 × 7`, and `|H| < 35` -> max = `7`! | **CORRECT (7).** | Clean. |
| 53 | `2020_FN_Q46` | Ch 02 / L02.1 | Quantifier scope pulling rules with free formula `W` (asking **NOT valid**!). | `∀x (p(x) -> W)` equals `(∃x p(x)) -> W` (NOT `∀x p(x) -> W`), so `C` is NOT logically valid! (`D` IS valid!). | **CORRECT (C).** | Clean. |
| 54 | `2020_FN_Q52` | Ch 07 / L07.2 | Derangements of `LILAC` where the two `L`s are indistinguishable. | Don't use $D_5 / 2$! Both `L`s must go into `{2, 4, 5}` (`3` pairs), and for each choice the 3 remaining distinct letters have `4` valid deranged slots -> `3 × 4 = 12`! | **CORRECT (12).** | Clean. |
| 55 | `2020_FN_Q53` | Ch 06B / L06B.1 | Edge-chromatic number $\chi'(G)$ of `K_{3,4}` plus universal vertex `s`. | $\Delta(G) = \deg(s) = 7$; edge-coloring `K_{3,4}` using 7 colors avoiding `s`'s incident colors needs only `7` colors (`\chi'(G) = 7`). | **CORRECT (7).** | Clean. |
| 56 | `2019_FN_Q26` | Ch 07 / L07.1 | Combinatorial double-counting identity `|{(x, X) : x \in X \subseteq {1..n}}|`. | Choose `x` (`n`) then subset of rest (`2^{n-1}`) = $n 2^{n-1}$ (`I`), OR sum by subset size $k$: $\sum k \binom{n}{k}$ (`II`). | **CORRECT (C: Both I and II).** | Clean. |
| 57 | `2019_FN_Q35` | Ch 03, 05 / L03.2, L05.1 | Checking equivalence relations on an arbitrary group `G` (`conjugacy` vs `a = b^{-1}`). | Conjugacy (`a = g^{-1} b g`) is Refl (`g=e`), Sym (`g^{-1}`), Trans (`g_1 g_2`) (`R1` only!); `a = b^{-1}` fails reflexivity when `a != a^{-1}` (`R2` false!). | **CORRECT (B: R1 only).** | Clean. |
| 58 | `2019_FN_Q12` | Ch 06B / L06B.1 | Number of different Hamiltonian cycles in complete undirected graph `K_n` ($n > 2$). | Bank marks BOTH `C (1)` and `D ((n-1)!/2)`: `(n-1)!/2` counts distinct edge sets, while `1` reflects non-isomorphic cycles (GATE 2019 dual-key resolution!). | **CORRECT (Dual Key C & D — add clear explanation!).** | Clean (needs ambiguity note). |
| 59 | `2019_FN_Q21` | Ch 00 / L00.1 | Modular exponentiation `3^{51} mod 5`. | $3^4 \equiv 1 \pmod 5 \implies 3^{51} = (3^4)^{12} \cdot 3^3 \equiv 27 \equiv 2 \pmod 5$. | **CORRECT (2).** | Clean. |
| 60 | `2019_FN_Q54` | Ch 00, 02 / L00.1, L02.1 | Domain truth of `"every prime has a strictly larger prime"` over `{1..100}`, `Z^+`, `Z`. | Fails on `{1..100}` at `97` (`S1` false); holds over `Z^+` (`S2`) and `Z` (`S3`, negatives & `1` fail antecedent due to `-1` divisor so vacuously true, positives have larger primes!). | **CORRECT (C: S2 and S3).** | Clean. |
| 61 | `2018_FN_Q11` | Ch 08 / L08.2 | Closed-form OGF for `a_n = 2n + 3` (`n >= 0`). | $\frac{2x}{(1-x)^2} + \frac{3}{1-x} = \frac{2x + 3 - 3x}{(1-x)^2} = \frac{3 - x}{(1-x)^2}$ (`D`). | **CORRECT (D).** | Clean. |
| 62 | `2018_FN_Q28` | Ch 06B / L06B.1 | Chromatic number of a given graph diagram. | Need graph figure `[IMAGE_Q_28]`. | **CANNOT VERIFY** (Key: 3). Figure `[IMAGE_Q_28]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_28]`). |
| 63 | `2018_FN_Q29` | Ch 05 / L05.2 | Largest proper subgroup size of finite group of order `84`. | Lagrange: largest proper divisor of `84` = `84 / 2 = 42`. | **CORRECT (42).** | Clean. |
| 64 | `2018_FN_Q37` | Ch 03 / L03.1 | Identifying countable vs uncountable infinite sets (`Q`, `{0,1}->N`, `N->{0,1}`, finite subsets of `N`). | `P` (Rationals), `Q` (`N×N`), and `S` (finite subsets) are countable; `R` (`2^N`) is uncountable! | **CORRECT (D: P, Q, S only).** | Clean. |
| 65 | `2018_FN_Q38` | Ch 02 / L02.1 | Finite Model Property (`∃^3 ∀^4` sentence without function symbols). | Restrict any 7-element model to the subset of `<= 3` witnesses `{s, t, u}` -> universal `∀` quantifiers still hold on the subset -> model of size `<= 3` (`A`)! | **CORRECT (A).** | Clean. |
| 66 | `2018_FN_Q53` | Ch 06A / L06A.1 | Degree `y` & connected components `z` of adjacent-transposition graph on `S_{100}` (`y + 10z`). | Every permutation has `99` adjacent swap pairs (`y = 99`); Bubble Sort connects all permutations (`z = 1`) -> `99 + 10(1) = 109`! | **CORRECT (109).** | Clean. |
| 67 | `2017_FN_Q29` | Ch 01 / L01.1 | Equivalent expressions for `(¬p) => (¬q)`. | Contrapositive is `q => p` (`II`), which rewrites to `¬q ∨ p` (`III`). | **CORRECT (D: II and III).** | Clean. |
| 68 | `2017_FN_Q15` | Ch 02 / L02.1 | Quantifier implications of `∀x ∃y R(x, y)` on non-empty domain. | Non-empty domain ensures `∃x` (`I` true); `IV` (`¬∃x ∀y ¬R`) is exact logical negation equivalence (`IV` true); `II, III` swap quantifier roles (`false`). | **CORRECT (B: I and IV).** | Clean. |
| 69 | `2017_AN_Q31` | Ch 01 / L01.1 | Translating `"not p and r, and not r ONLY IF (p and q)"`. | `"not r only if (p and q)"` is `¬r -> (p ∧ q)` (`A`), NOT `(p ∧ q) -> ¬r` (`B`). | **CORRECT (A).** | Clean. |
| 70 | `2017_FN_Q19` | Ch 06A / L06A.1 | Sum of vertex degrees in a 10-vertex tree. | Tree has `9` edges; Handshaking gives `2 × 9 = 18`. | **CORRECT (18.0).** | Clean. |
| 71 | `2017_AN_Q28` | Ch 04 / L04.1 | Minimum pairs to add to `R` on `{a..e}` to form a Lattice. | From explicit `R`: `a` is least, `e` is greatest, `a < b < c < e` and `a < d < e` (`N_5` pentagon lattice!). Every pair already has unique LUB & GLB -> `0` pairs! | **CORRECT (`0`, inside `-0.01–0.01`).** Solvable directly from `R` even without `[IMAGE_Q_28]`. | **MISSING FIGURE** (`[IMAGE_Q_28]`, solvable from text). |
| 72 | `2017_AN_Q16` | Ch 06A / L06A.1 | Maximum vertices `n` in graph with `25` edges and `min_deg >= 3`. | `3n <= 2|E| = 50 => n <= floor(50/3) = 16`. | **CORRECT (16.0).** | Clean. |
| 73 | `2017_FN_Q55` | Ch 01 / L01.1 | Evaluating `(r -> p) -> q` when `(p -> q) -> r` evaluates to False. | `(p -> q) -> r` is FALSE iff `r = FALSE` (and `p -> q = TRUE`). With `r = F`, `(r -> p)` is TRUE, so `(r -> p) -> q` becomes `TRUE -> q ≡ q` (`D`!). | **CORRECT (D).** | Wording quirk: *"is a contradiction"* means *"is false under this assignment"*. |
| 74 | `2017_FN_Q41` | Ch 07 / L07.2 | Integers in `1..500` divisible by `3, 5, or 7` (3-set PIE). | `166 + 100 + 71 - 33 - 23 - 14 + 4 = 271`. | **CORRECT (271.0).** | Clean. |
| 75 | `2017_AN_Q48` | Ch 08 / L08.2 | Extracting `a_3 - a_0` from OGF `(1 + z) / (1 - z)^3`. | `[z^n] (1-z)^{-3} = \binom{n+2}{2}`. `a_0 = 1`; `a_3 = \binom{5}{2} + \binom{4}{2} = 10 + 6 = 16` -> `16 - 1 = 15`! | **CORRECT (15.0).** | Clean. |

---

## PART 7. MORE QUESTIONS NEEDED (3 New Ideas Per Lesson)

### Chapter 00 · Proof Techniques, Divisibility & Modular Arithmetic
- **Lesson 00.1 (`Proof Styles, Divisibility & Modular Powers`):**
  1. Compute $7^{102} \bmod 11$ using Fermat's Little Theorem (`NAT`).
  2. Identify which statements about integer divisibility over $\mathbb{Z}$ (`0 | 5`, `5 | 0`, `-3 | 12`, `gcd(0, 7)`) are TRUE (`MSQ`).
  3. Find the flaw in an inductive "proof" claiming all horses are the same color (base case `n=1` -> `n=2` fails to overlap!) (`MCQ`).

### Chapter 01 · Propositional Logic
- **Lesson 01.1 (`Connectives, Equivalences & Falsification`):**
  1. Check which of `(p -> q) -> ((p -> ¬q) -> ¬p)` and `(p ∨ q) ∧ (¬p ∨ r) -> (q ∨ r)` are tautologies (`MSQ`).
  2. Express `"You cannot board the flight unless you have a ticket and ID"` using propositional variables (`MCQ`).
  3. Which minimal subsets of `{∧, ∨, ¬, ->, ↔}` are functionally complete (`MSQ`)?

### Chapter 02 · First-Order Predicate Logic
- **Lesson 02.1 (`Quantifiers, Scope Pulling & Model Bounds`):**
  1. Negate `∀x ∃y ∀z (P(x, y) -> Q(y, z))` completely pushing `¬` inward (`MCQ`).
  2. For a sentence $\exists s \exists t \, \forall u \forall v \, \phi(s, t, u, v)$ with NO equality and NO function symbols, find the smallest guaranteed model size if a model of size `10` exists (`NAT`).
  3. Translate `"There is at most one student who solved all problems"` using predicates `Solved(s, p)` and `=` (`MCQ`).

### Chapter 03 · Sets, Relations, Functions & Countability
- **Lesson 03.1 (`Sets, Functions, Compositions & Countability`):**
  1. Count total surjective (onto) functions from a 5-element set to a 3-element set (`NAT`).
  2. Suppose `g: A -> B` and `f: B -> C` have `f ∘ g` **injective (1-1)**: which properties MUST hold for `g` vs `f` (`MSQ`)?
  3. Determine which sets among `{Irrationals}`, `{Finite strings over ASCII}`, `{Increasing sequences of naturals}`, `{Rationals in [0,1]}` are countable (`MSQ`).
- **Lesson 03.2 (`Relations, Matrix Counts, Circular & Quotient Maps`):**
  1. On a 4-element set, count total binary relations that are **Symmetric AND Reflexive** vs **Antisymmetric AND Reflexive** (`NAT`).
  2. Given relation $R$ on $\mathbb{Z}$ where $a R b \iff a + b$ is even vs $a R b \iff a - b \le 2$, classify across `Refl, Sym, Antisym, Trans` (`MSQ`).
  3. Show why a Symmetric + Transitive relation on `{1, 2, 3, 4}` with 1 isolated vertex fails to be an Equivalence relation (`MCQ`).

### Chapter 04 · Partial Orders and Lattices
- **Lesson 04.1 (`POSETs, Hasse Diagrams, Total Orders & Lattices`):**
  1. Draw the Hasse diagram of divisors of `36` (`{1,2,3,4,6,9,12,18,36}`) under divisibility and determine whether it is a Distributive Lattice & Boolean Algebra (`MSQ`).
  2. Count total linear extensions (topological sorts) of the 5-element POSET `{a < c, b < c, c < d, c < e}` (`NAT`).
  3. Which poset sizes (`4, 6, 8, 12`) can NEVER form a Boolean Algebra (`MSQ`)?

### Chapter 05 · Monoids and Groups
- **Lesson 05.1 (`Algebraic Hierarchy, Custom Ops & Group Laws`):**
  1. Check whether `(Z, *)` defined by `a * b = a + b - 5` forms an Abelian Group, and find its identity and inverse of `10` (`NAT`).
  2. Given a `4 × 4` Cayley table with 1 missing entry, complete it and verify Associativity/Abelian properties (`MCQ`).
  3. Identify which algebraic structures (`(Q^+, /)`, `(M_2(R), ×)`, `(Z_6, +_6)`, `(N, max)`) are Monoids vs Groups (`MSQ`).
- **Lesson 05.2 (`Subgroups, Lagrange, Cyclic Groups & Direct Products`):**
  1. Count the number of **generators** of cyclic group `(Z_{30}, +_{30})` (`NAT`).
  2. Find the maximum order of an element inside the non-cyclic group `Z_4 × Z_6` (`NAT`).
  3. If a group $G$ has prime order $17$, how many distinct subgroups does $G$ have (`NAT`)?

### Chapter 06A & 06B · Graph Theory
- **Lesson 06A.1 (`Degrees, Families, Connectivity & BFS Diameter`):**
  1. Test which degree sequences (`[4,4,4,4,2]`, `[5,3,3,2,1]`, `[4,4,3,3,2]`) can form a simple undirected graph (`MSQ`).
  2. Find the number of edges and chromatic number of the 4-dimensional Hypercube $Q_4$ (`NAT`).
  3. A forest on 24 vertices has 5 connected components; find total edges and sum of all vertex degrees (`NAT`).
- **Lesson 06A.2 (`Adjacency Matrix Powers, Spanning Trees & Planarity`):**
  1. A connected planar graph has `12` vertices, every vertex having degree `4`: compute total planar faces `F` (`NAT`).
  2. Using $A^2$, find how many length-2 walks exist between two vertices sharing 3 common neighbours in a simple graph (`NAT`).
  3. Can a planar **bipartite** graph have 8 vertices and 13 edges (`E <= 2V - 4`)? (`MCQ`).
- **Lesson 06B.1 (`Euler/Hamilton, Matching, VC & Coloring`):**
  1. Find minimum edges to add to $K_{4, 6}$? No — find minimum edges to add to a 6-vertex graph with 4 odd-degree vertices to make it Eulerian (`NAT`).
  2. Compute exact chromatic number $\chi$ and edge-chromatic number $\chi'$ of odd cycle $C_7$ and wheel $W_6$ (`MSQ`).
  3. Using Gallai's identity on a 12-vertex graph whose max independent set has size 5, find the size of its minimum vertex cover (`NAT`).

### Chapter 07 · Counting and Combinatorics
- **Lesson 07.1 (`Counting, Parity Grids & Twelvefold Way`):**
  1. Find number of non-negative integer solutions to $x_1 + x_2 + x_3 + x_4 \le 10$ using a slack variable (`NAT`).
  2. Count `5 × 5` `{0, 1}` matrices with **odd** row sums and **odd** column sums (`NAT` — `2^{16}`!).
  3. Contrast distributing `5` identical balls into `3` distinct boxes (none empty) vs `3` identical boxes (`NAT`).
- **Lesson 07.2 (`PIE, Pigeonhole & Derangements`):**
  1. Count permutations of `{1, 2, 3, 4, 5}` where at least ONE element stays in its original spot (`5! - D_5`) (`NAT`).
  2. Find the minimum number of students needed to guarantee at least `4` share the exact same birth month (`NAT`).
  3. Count binary strings of length 8 that neither start with `00` nor end with `11` nor contain all `0`s (`NAT`).

### Chapter 08 · Recurrences and Generating Functions
- **Lesson 08.1 (`Linear & Binary Recurrences`):**
  1. Solve $a_n = 4a_{n-1} - 4a_{n-2}$ (repeated root!) with $a_0 = 1, a_1 = 4$ and find $a_6$ (`NAT`).
  2. Solve $a_n = 2a_{n-1} + 3^n$ with $a_0 = 1$ using homogeneous + particular solution (`MCQ`).
  3. Given $g(1) = 1$, $g(2n) = 2g(n)$, $g(2n+1) = 2g(n) + 1$, identify what $g(n)$ equals (`g(n) = n`!) (`MCQ`).
- **Lesson 08.2 (`Ordinary Generating Functions`):**
  1. Find the closed-form OGF of the sequence `0, 1, 4, 9, 16, ...` ($n^2$) (`MCQ`).
  2. Extract the exact coefficient of $x^5$ in $(1 - 2x)^{-3}$ (`NAT`).
  3. Use OGFs to solve the recurrence $a_n = 3a_{n-1} - 2a_{n-2}$ ($a_0 = 2, a_1 = 5$) (`MCQ`).

---

## PART 8. WHAT IS MISSING FROM THE SUBJECT

Looking across the GATE CS Discrete Mathematics syllabus (`Part B.1`), `Part C` (75 PYQs), Rosen, Tremblay–Manohar, West, Made Easy, and GateWallah, these crucial topics are absent or unstated in `Part B.2`:

1. **Chapter 00: Proof Techniques (`Induction` `2025_AN_Q15`, `Contrapositive/Contradiction`), Divisibility over $\mathbb{Z}$ (`2019_FN_Q54`), Squarefree Factorization (`2026_AN_Q26`) & Modular Exponentiation (`2019_FN_Q21`).**
2. **Propositional & FOL Mastery:** English arrow traps (`only if`, `when`, `unless`, `2024_AN_Q26`, `2017_AN_Q31`), **Backward Falsification** (`2021_FN_Q27` — fix `-> p` bug!, `2017_FN_Q55`), `"Exact 1"` templates (`2025_FN_Q48`), **Free-variable LHS Scope Flip (`2020_FN_Q46`)**, Domain sensitivity (`2019_FN_Q54`), and **Bernays-Schönfinkel Finite Model Bounds (`2018_FN_Q38`)**.
3. **Sets, Relations & Functions Depth:** Surjection/Injection counts, **Composition Lemmas (`2025_FN_Q17`)**, Countability vs Uncountability (`2018_FN_Q37`), Relation counting matrices (`2020_FN_Q11`), **Circular Relations (`2021_FN_Q29`)**, Quotient Map bijection (`2023_FN_Q49`), Hasse diagram construction, **Linear Extension counting (`2024_AN_Q18`)**, Pointwise Function Lattices (`2025_AN_Q42`), $M_3/N_5$ & Boolean Algebra $2^k$ tests (`2017_AN_Q28`).
4. **Algebraic Structures Depth:** Custom operator distributivity/associativity (`2024_FN_Q65`), `(N^N, +)` Monoid (`2025_FN_Q49`), `(2^X, Δ)` Group (`2023_FN_Q51`), **Exponent-2 Abelian theorems (`2022_FN_Q27`)**, Lagrange's Theorem (`2020_FN_Q32`, `2018_FN_Q29`), Prime-order cyclicity (`2021_FN_Q52`), and **Direct Product self-inverses (`2024_AN_Q41`)**.
5. **Graph Theory Splitting & Theorems (`40` marks in bank!):** Splitting into `Ch 06A` (Structure, Handshake, Disconnected max edges `2022_FN_Q30`, BFS height `2025_FN_Q43`, **Matrix Powers $A^2, A^3, A^{-1}$ `2024_AN_Q15`, `2022_FN_Q37`, `2022_FN_Q52`, `2021_FN_Q35`**, **Cayley / Disjoint STs / DAG Arborescence / Cycle Parity `2026_AN_Q36`, `2024_FN_Q31`, `2024_AN_Q37`, `2022_FN_Q58`**, Permutation/Powerset Graphs `2018_FN_Q53`, `2023_FN_Q56`, Planar `3V-6` & `2V-4` `2021_FN_Q24`) and `Ch 06B` (Euler/Hamilton `2019_FN_Q12` dual-key, **Petersen Graph `2022_FN_Q50`**, **Vertex Cover `deg >= k+1` `2026_FN_Q47`**, **Path Matchings `2026_FN_Q57`**, 2-Coloring `2026_FN_Q55`, **Chromatic Bounds `n/\alpha, k(k-1)/2` `2024_FN_Q59`**, Greedy `<= \Delta+1` `2023_FN_Q55`, **Vizing's Edge Coloring `2020_FN_Q53`**).
6. **Combinatorics, Recurrences & OGFs:** Parity matrices (`2026_FN_Q12`), Per-element choice (`2021_AN_Q37`, `2019_FN_Q26`), Subset separation (`2023_FN_Q48`), Twelvefold Way (Stars & Bars, Partitions `2022_FN_Q32`, Constrained Onto `2021_FN_Q21`), PIE (`2017_FN_Q41`), **Repeated-Letter Derangements (`2020_FN_Q52`)**, Characteristic cancellation (`2024_AN_Q20`), Binary/Josephus recurrences (`2022_FN_Q51`), and **OGF identities & odd/binomial extraction (`2022_FN_Q36`, `2018_FN_Q11`, `2017_AN_Q48`)**.

---

## PART 9. WEIGHTS

### Chapter Weight Tags & Comparison with the Bank (`Part B.3`)

| Chapter | Proposed Weight Tag | Bank Stats (2017–2026, 15 CS Papers) | Does the Bank Weight Look Fair? |
|---|---|---|---|
| **Ch 00 · Proofs, Divisibility & Modular Math** *(New)* | **Foundation** (Mandatory before Ch 01) | Embedded (`2026_AN_Q26`, `2025_AN_Q15`, `2019_FN_Q54`, `2019_FN_Q21`) | **Under-isolated in bank.** Adding Ch 00 removes the math/proof panic that causes early back-bencher dropouts. |
| **Ch 01 · Propositional Logic** | **High** | Merged with Ch 02 (`14` Qs / `19` marks across 9/10 yrs) | **Fair (split Ch 01 & Ch 02 cleanly for pacing).** Propositional falsification & English translation give fast 1–2 mark points. |
| **Ch 02 · First-Order Predicate Logic** | **High** | Shared inside `14` Qs / `19` marks (`6` Hard Qs!) | **Fair — high conceptual trap density!** `∀ ->`, `"Exact 1"`, `W`-pulling, and Finite Model bounds separate top scorers. |
| **Ch 03 · Sets, Relations & Functions** | **High** | Merged with Ch 04 (`11` Qs / `15` marks across 8/10 yrs — `0` Easy!) | **Fair.** Zero Easy Qs in this bucket (`0/5/6`), so visual relation matrices, quotient maps, and countability checks are essential. |
| **Ch 04 · Partial Orders & Lattices** | **Medium** | Shared inside `11` Qs / `15` marks bucket | **Fair (once separated from Ch 03).** Clean visual Hasse & `N_5/M_3` rules turn Hard questions (`2025_AN_Q42`, `2024_AN_Q18`) into systematic traces. |
| **Ch 05 · Monoids and Groups** | **High** | 10 Qs / 15 marks (`1.00%`; asked 8/10 yrs — `2/6/2`) | **Fair — surprisingly consistent ROI!** Almost 1 guaranteed question per paper (`Monoid`, `Lagrange`, `x^2=1`, `Z_2×Z_3×Z_4`), mostly Medium! |
| **Ch 06A · Graph Theory A (Structure, Matrix, Trees, Planarity)** | **Very High** (#1 DM Weight!) | 17 Qs / 27 marks (`1.80%`; asked 9/10 yrs — `8` Hard!) | **Fair — massive pillar!** Splitting Graph Theory into `Ch 06A` and `Ch 06B` prevents cognitive overload across `40` combined marks (`35%` of DM!). |
| **Ch 06B · Graph Theory B (Euler/Hamilton, Matching, Cover, Coloring)** | **High** | 7 Qs / 13 marks (`0.87%`; asked 6/10 yrs — mostly 2-mark MSQ/NAT!) | **Fair.** Almost exclusively 2-mark theorem/counting questions (`VC deg>=k+1`, `Path matchings`, `Vizing`, `Chromatic bounds`). |
| **Ch 07 · Counting and Combinatorics** | **High** | 10 Qs / 15 marks (`1.00%`; asked 8/10 yrs — `0` Easy, `5` Med, `5` Hard!) | **Fair.** High NAT ROI once Twelvefold Way, Parity grids, PIE, and Derangements are mastered (exact topic split outside bank: **not sure**). |
| **Ch 08 · Recurrences and Generating Functions** | **Medium** | 6 Qs / 9 marks (`0.60%`; asked 5/10 yrs — `4` Hard!) | **Fair.** Lowest standalone share (`8%` of DM) and hardest algebra — master `Characteristic Roots` + `5 OGF Cards` without spending disproportionate 100-day hours here. |

### Overall Assessment of Bank Distribution (`7.5%` = ~7.5 marks/paper)
- Across the 15 CS papers (2017–2026) in `Part B.3`, **Graph Theory (`Ch 06A + 06B`: `40` marks = `35%` of DM!)**, **Logic (`Ch 01 + 02`: `19` marks = `17%`)**, **Sets/Relations/POSETs (`Ch 03 + 04`: `15` marks = `13%`)**, **Groups (`Ch 05`: `15` marks = `13%`)**, and **Combinatorics (`Ch 07`: `15` marks = `13%`)** show remarkably balanced weight across nearly every year (`8–9/10` years!), with only **Recurrences/OGF (`9` marks)** slightly lighter.
- **Crucial Warning for a 100-Day Dropper:** Look at the difficulty distribution — **`31` Hard, `34` Medium, and only `10` Easy** out of 75 questions (`41%` Hard — the highest Hard share of ANY subject reviewed so far!). That means passive reading fails in Discrete Math; every single chapter MUST teach visual counterexample hunting (`Falsification`, `3-dot graphs`, `Hasse diagrams`, `Cayley tables`, `K_5/C_5/Petersen`), and fix the **`2021_FN_Q27`** broken key right away! (Beyond the 2017–2026 bank provided, exact future paper weights: **not sure**.)