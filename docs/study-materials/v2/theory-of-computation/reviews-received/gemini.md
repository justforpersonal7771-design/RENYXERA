## PART 1. FEELINGS

1. Looking at Part B made me happy for one second because TOC is worth ~8.1 marks out of 100 and the book plans to throw out old summary notes and teach from zero.
2. Then I read the 6-chapter list and got a cold sweat: there are only 19 tiny topics here, zero details on what goes inside them, and NO Chapter 0 for basic words like *set*, *string*, *alphabet*, *$\epsilon$*, *$\emptyset$*, and *countability*.
3. When I tried reading the 77 PYQs in Part C, I felt completely lost and stupid by Question 5: they talk about *minimal DFA*, *distinguishable states*, *ambiguous rightmost derivation*, *CNF*, *Rice's theorem*, and *undecidability* with zero bridge from simple English.
4. Worse, Part C has 14 questions with `[IMAGE_...]` missing so I cannot even verify them, and `2020_FN_Q22` marks ALL FOUR options `✔ official` with zero note that it was a Marks-to-All blunder in the real exam!
5. I also caught nasty typos in the PYQs (`2021_AN_Q18` Option D and `2023_FN_Q19`) and compiler topics (`LL(k)` in `2020_FN_Q24`) sitting silently in TOC without any warning.
6. The existing 6 chapters don't say where *Myhill-Nerode*, *Mealy/Moore*, *Arden's theorem*, *Chomsky hierarchy*, *LBA*, *DCFL vs CFL*, or *PCP* go — how can a dropper with 100 days left trust an outline that hides half the exam?
7. With 100 days left and backlogs, I felt hopeful seeing real PYQs mapped to marks, yet tricked by how tiny and vague the "contents list" is compared to what GATE actually tests.
8. **Would I pay ₹149 for this? NO — not as it stands right now.**
9. Why? Because `Part B` right now is only a 19-line skeleton (even shorter than Made Easy's index!) and `Part C` has broken/missing-image keys that would confuse a beginner to death.
10. Build Chapter 0 first, split the 6 chapters into real step-by-step lessons with clear pictures, fix the PYQ key bugs, and tag `[MUST]` vs `[LATER]` for my 100-day panic — then I will happily pay ₹149.

---

## PART 2. GAP TABLE

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 1 | `Part B.2` (Missing Ch 00) | Jumps straight into "Regular expressions and finite automata" without teaching what an **alphabet ($\Sigma$)**, **string ($w$)**, **length ($|w|$)**, **language ($L$)**, **$\Sigma^*$**, and **$\Sigma^+$** are. | MISSING-PREREQUISITE | Add a full **Chapter 00: Mathematical & Language Foundations** before Ch 01. | HIGH |
| 2 | `Part B.2` (Missing Ch 00) | Never explains the #1 TOC trap for beginners: **$\emptyset$ (empty set) vs $\{\epsilon\}$ (set containing empty string) vs $\epsilon$ (empty string)**! | UNEXPLAINED-WORD | Add a visual box comparing `{}`, `{\epsilon}`, and `""` with concatenation rules (`L · \emptyset = \emptyset` vs `L · {\epsilon} = L`). | HIGH |
| 3 | `Part B.2` (Missing Ch 00) | PYQs (`2019_FN_Q50`, `2021_AN_Q23`) test **countable vs uncountable sets** (why $\Sigma^*$ is countable yet $2^{\Sigma^*}$ is uncountable), which is nowhere in the 6 chapters! | MISSING-GATE-CONCEPT | Teach infinite set sizes, bijection, and Cantor's diagonalization intuitively in Ch 00 (and link to Ch 06). | HIGH |
| 4 | `Part B.2` (Missing Ch 00) | Uses **equivalence relation / equivalence classes** (for DFA minimization / Myhill-Nerode) and **proof by contradiction** (for Pumping Lemma / Halting) with zero warm-up. | MISSING-PREREQUISITE | Add a plain-English lesson in Ch 00 on equivalence classes (sorting strings into buckets) and contradiction proofs. | HIGH |
| 5 | `Part B.2` (Whole plan) | Only gives 6 chapter titles with `"3 topics ready"` or `"4 topics ready"` — doesn't even list the topic names, subtopics, finer points, traces, or diagrams! | STEP-SKIPPED | Replace this v0 skeleton with a full lesson-by-lesson syllabus (as in Part 5). | HIGH |
| 6 | `Part B.2` & `Part B.3` (100-day roadmap) | Gives no reading time, no `[MUST]` / `[SHOULD]` / `[LATER]` priority tags, and no dependency order for someone with 100 days left. | TOO-LONG-BORING | Tag every lesson with time estimate and priority so a dropper knows what to lock down first. | HIGH |
| 7 | `Part B.1` (Syllabus check) | Lists the 4 official GATE lines correctly (matches GATE 2026/2027 CS syllabus), yet doesn't warn that GATE also tests **Discrete Math / Compiler overlap** (`S_5` group bijections in `2019_FN_Q59`, `LL(k)` in `2020_FN_Q24`). | MISSING-FINER-POINT | Add a note in Part B.1 marking where TOC pulls ideas from Discrete Math and Compilers. | MEDIUM |
| 8 | `Part B.3` (Bank stats vs `Part C`) | Bank table groups 77 PYQs under only 4 coarse buckets (merging Regular & CFL & Pumping Lemma into one 25-Q bucket), hiding which exact subtopics (e.g., DFA minimization vs Regex) carry the marks. | UNCLEAR-ENGLISH | Split bank stats to match the actual 6–7 chapters so chapter weights are honest. | MEDIUM |
| 9 | `Ch 01` (Order inside chapter) | Title puts **"Regular expressions"** BEFORE **"finite automata"**. A beginner understands machines (FA: boxes and arrows) WAY easier than weird symbols like `(0+1(01*0)*1)*`! | WRONG-ORDER | Teach **DFA first** (simple step-by-step game), then **NFA / $\epsilon$-NFA**, THEN **Regular Expressions**, then conversions between them. | HIGH |
| 10 | `Ch 01` (DFA intuition) | Doesn't explain **what a "state" actually means in real life** (it is the machine's tiny *memory* of what happened so far, e.g. remainder or last 2 chars). | NEEDS-DIAGRAM | Draw states labelled with their plain-English memory meaning (e.g. `rem=0`, `saw 01`). | HIGH |
| 11 | `Ch 01` (Missing `dead/trap` state) | Beginners build incomplete DFAs missing outgoing arrows on `0` or `1`, not knowing a DFA MUST have **exactly one arrow per alphabet symbol from every state** (dead/trap state!). | MISSING-FINER-POINT | Add explicit rule + diagram showing NFA missing arrow vs DFA mandatory trap state. | HIGH |
| 12 | `Ch 01` (DFA design patterns) | Misses systematic recipes for GATE's top DFA design questions: **divisibility mod $k$** (binary & unary & product `2025_AN_Q60`), **substring vs subsequence vs ends-with** (`2025_FN_Q50`, `2023_FN_Q63`), and **positional length** (`2017_AN_Q15`). | MISSING-GATE-CONCEPT | Dedicate a full lesson with step-by-step templates for all 5 DFA design families. | HIGH |
| 13 | `Ch 01` (Complementing a DFA) | Doesn't show why flipping final <-> non-final states ONLY works on a **complete DFA** (and FAILS on an NFA or incomplete DFA! — needed for `2021_AN_Q12`). | MISSING-FINER-POINT | Show a counterexample where flipping final states on an NFA gives the WRONG complement! | HIGH |
| 14 | `Ch 01` (Product DFA construction) | Doesn't teach building a combined DFA for $L_1 \cap L_2$, $L_1 \cup L_2$, $L_1 - L_2$ using state pairs `(p, q)` (tested in `2020_FN_Q41` and `2025_AN_Q52(C)`!). | MISSING-GATE-CONCEPT | Teach the Product Automaton grid `(q_i, p_j)` with a full trace for "divisible by 2 AND not by 3". | HIGH |
| 15 | `Ch 01` (NFA & $\epsilon$-NFA) | Doesn't explain **non-determinism** in plain English ("lucky guessing / parallel clones splitting at forks") or **$\epsilon$-closure** step by step (`2017_AN_Q40`). | UNEXPLAINED-WORD | Draw NFA execution as splitting clones (tree of active states) and trace $\epsilon$-closure $\hat{\delta}(q_2, aba)$. | HIGH |
| 16 | `Ch 01` (NFA to DFA & $2^n$ bound) | Doesn't warn that subset construction has max $2^n$ states, AND doesn't warn that **minimal DFA can have fewer, equal, or up to $2^n$ states** (`2026_FN_Q26`, `2025_FN_Q28`, `2018_FN_Q16`). | MISSING-GATE-CONCEPT | Trace Subset Construction with a table + show an example where NFA has $n$ states and minimal DFA needs $< n$, $= n$, and $2^n$ states. | HIGH |
| 17 | `Ch 01` (DFA Minimization) | Doesn't list **unreachable state removal**, **table-filling (0-equivalence, 1-equivalence, $k$-equivalence)** (`2024_FN_Q36` "distinguishable states"!), and **Myhill-Nerode theorem** (`2025_AN_Q60`, `2019_FN_Q59`). | MISSING-GATE-CONCEPT | Teach BOTH Myhill-Nerode equivalence classes AND table-filling minimization step by step, emphasizing removing unreachable states FIRST! | HIGH |
| 18 | `Ch 01` (Regex & Identities) | Doesn't teach **Regex precedence** (`*` > `.` > `+`), **algebraic identities** (`(a^*b^*)^* = (a+b)^*`, `R^*R^* = R^*`, `\emptyset^* = \epsilon`), or common traps like `((0+1)*1(0+1)*1)*` (`2020_FN_Q22`). | MISSING-FINER-POINT | Add a Regex Precedence & Trap table contrasting `(0+1)*` vs `(0*1*)*` vs `(0+1)`. | HIGH |
| 19 | `Ch 01` (Regex <-> FA conversions) | Misses **Thompson's construction** (Regex -> $\epsilon$-NFA, `2023_FN_Q19`), **State Elimination**, and **Arden's Theorem** (`R = Q + RP => R = QP^*` when $\epsilon \notin P$, used in `2021_AN_Q51`, `2024_AN_Q34`, `2022_FN_Q12`). | MISSING-GATE-CONCEPT | Draw step-by-step State Elimination and Arden's Theorem (with the $\epsilon \notin P$ warning!). | HIGH |
| 20 | `Ch 01` (Mealy & Moore machines) | Completely omits **Finite Automata with Output (Mealy & Moore machines)** — state conversion (`n` states vs `n×|O|` states) and output length (`n` vs `n+1`). | MISSING-GATE-CONCEPT | Add a dedicated lesson on Mealy & Moore machines with a trace table and conversion frames. | MEDIUM |
| 21 | `Ch 01` (Order of a language) | Misses **powers of a language $L^k$ and order of a language** ($L^k = L^{k+1}$ as in `2018_FN_Q62`). | MISSING-FINER-POINT | Add a small worked trace computing $L^0, L^1, L^2, \dots$ on a simple language until $L^k = L^{k+1}$. | MEDIUM |
| 22 | `Ch 02` (Closure properties) | Doesn't list the full **Regular Closure Matrix** — especially non-standard operations GATE tests: **Prefix(L), Suffix(L), Substring(L), Reversal $L^R$, Difference, Quotient, Homomorphism, Inverse Homomorphism** (`2019_FN_Q30`). | MISSING-GATE-CONCEPT | Teach closure proofs by picture/construction for ALL standard and extended operations, plus `Prefix`/`Suffix` DFA trick! | HIGH |
| 23 | `Ch 02` (Infinite Union trap) | Beginners assume "closed under union" means "closed under infinite union" (`2020_FN_Q19` Statement II)! | MISSING-FINER-POINT | Show the 2-line counterexample: any non-regular language $L = \bigcup_{w \in L} \{w\}$ is an infinite union of 1-word regular languages! | HIGH |
| 24 | `Ch 02` (Non-closure / Subset tricks) | Misses reverse-closure traps: if $L_1 \cup L_2$ or $L_1 \cap L_2$ is regular, $L_1$ can still be non-regular or even **undecidable** (`2026_FN_Q51`, `2024_FN_Q16`, `2021_AN_Q23`). | MISSING-GATE-CONCEPT | Teach the "Extreme Counterexample Toolkit" ($\emptyset$, $\Sigma^*$, Halting language $H$) for all true/false closure questions! | HIGH |
| 25 | `Ch 02` (Hidden Regular Languages!) | Students blindly assume anything with `w` and `w^R` or `\alpha\beta\alpha` is non-regular (`2022_FN_Q47`, `2020_FN_Q60`, `2025_FN_Q44`!). | MISSING-GATE-CONCEPT | Teach **"Smallest-Piece Collapse"**: test if `|w|=1` or `n=0` collapses `w x w^R` or `a^n w a^n` to a plain regular language! | HIGH |
| 26 | `Ch 02` (Pumping Lemma: Logic & Quantifiers) | Students NEVER understand the `∃p ∀w ∀xyz ∃i` quantifier order in Pumping Lemma! They think they get to pick `x, y, z` themselves, OR they think passing Pumping Lemma proves a language IS regular! | TOO-HARD-TOO-EARLY | Draw Pumping Lemma as an **Adversarial Two-Player Game** (You pick string $w$, Opponent picks $x,y,z$, You pump $i$ to break it) + warn it is only a *necessary* condition! | HIGH |
| 27 | `Ch 02` (Pumping Lemma: Pumping Length $p$) | Doesn't cover **"Which of the following can be a pumping length for $L$?"** (`2019_FN_Q28`) — a subtle GATE question where you test concrete small strings! | MISSING-GATE-CONCEPT | Add a worked example finding the minimum valid pumping length of finite and periodic regular languages. | MEDIUM |
| 28 | `Ch 02` (Myhill-Nerode for non-regularity) | Only lists "Pumping Lemma" in the chapter title (`Ch 02`), forgetting **Myhill-Nerode's infinitely many equivalence classes** — which is often 5x easier than Pumping Lemma (e.g. for `primes` or `2025_FN_Q44`)! | MISSING-GATE-CONCEPT | Teach Myhill-Nerode fooling sets (`a^i` vs `a^j` separated by `z`) as the fast alternative to Pumping Lemma. | HIGH |
| 29 | `Ch 02` (Decision properties of Regular Languages) | Doesn't list **Membership, Emptiness, Finiteness (cycle reachable from start & reaching final!), Equivalence, Subset, Universality** for DFAs/NFAs/Regex — and their time complexities (`2021_FN_Q37`, `2018_FN_Q46`). | MISSING-GATE-CONCEPT | Add a Decision Properties lesson with graph-reachability algorithms for Emptiness and Finiteness of a DFA. | HIGH |
| 30 | `Ch 03` (CFG Vocabulary & Derivations) | Doesn't explain **terminal vs non-terminal, sentential form, leftmost vs rightmost derivation, and parse tree** from zero. | UNEXPLAINED-WORD | Draw one sentence being derived step-by-step into a parse tree, comparing LMD vs RMD side by side. | HIGH |
| 31 | `Ch 03` (Ambiguity) | Doesn't distinguish **ambiguous grammar** (two parse trees for ONE string, `2026_FN_Q25`, `2026_AN_Q29`) from **inherently ambiguous language** (NO unambiguous grammar exists for that CFL!). | UNEXPLAINED-WORD | Show two parse trees for `id + id * id` and `abab`/`abb`, show dangling-else disambiguation, and name one inherently ambiguous language (`{a^i b^j c^k | i=j or j=k}`). | HIGH |
| 32 | `Ch 03` (Reading tricky CFGs / Invariants) | Doesn't teach how to read a grammar like `S -> aSbS | bS | \epsilon` (`2026_FN_Q25`), `S -> abaaBAbba` (`2026_FN_Q52`), `S -> aS | aSbS | c` (`2024_AN_Q42`), or `S -> SaS | ...` (`2017_FN_Q46`) using **symbol-count invariants**! | MISSING-GATE-CONCEPT | Teach the **"Rule Accounting Table"** (`Δn_a, Δn_b, Δn_c, Δnonterminals` per production) — solves all 4 of those PYQs effortlessly! | HIGH |
| 33 | `Ch 03` (Writing CFGs from scratch) | Doesn't give step-by-step patterns for designing CFGs: **equal counts (`n_a = n_b`), unequal (`n_a != n_b`), nested palindrome, crossing vs nested (`2026_AN_Q48`, `2019_FN_Q39`), union of pieces**. | NEEDS-EXAMPLE | Add a "CFG Design Pattern Cookbook" showing how `n_a != n_b` splits into `(n_a > n_b) U (n_a < n_b)`. | HIGH |
| 34 | `Ch 03` (CFG Simplification) | Doesn't mention **removing useless symbols (non-generating FIRST, non-reachable SECOND — order matters!)**, **removing $\epsilon$-productions (nullable variables)**, and **removing unit productions (`A -> B`)**. | MISSING-GATE-CONCEPT | Teach all 3 simplification steps in the exact legal order with a traced counterexample showing what breaks if you remove unreachable symbols first! | HIGH |
| 35 | `Ch 03` (Normal Forms: CNF & GNF) | Misses **Chomsky Normal Form (CNF)**, **Greibach Normal Form (GNF)**, and the exact GATE formula: **every CNF derivation of length $n \ge 1$ takes $2n - 1$ steps** (`2024_FN_Q48`)! | MISSING-GATE-CONCEPT | Show CNF & GNF conversion rules, plus the parse-tree proof of `2n - 1` steps (`n` lexical + `n - 1` binary steps). | HIGH |
| 36 | `Ch 03` (Left Recursion & Left Factoring) | Doesn't cover **eliminating left recursion** or **left factoring** (or link clearly to Compiler Design), needed when reading `LL(k)` / top-down parsing (`2020_FN_Q24`). | MISSING-FINER-POINT | Include left recursion elimination briefly or cross-reference Compiler Design clearly. | LOW |
| 37 | `Ch 03` (PDA Mechanics & Acceptance Modes) | Doesn't explain **stack alphabet ($\Gamma$), bottom-of-stack marker ($\perp / Z_0$), transition label `a, X / \gamma` (`2023_FN_Q40`), and Acceptance by Final State vs Acceptance by Empty Stack**! | MISSING-GATE-CONCEPT | Draw a PDA machine with tape + reading head + vertical stack, and trace both Final-State and Empty-Stack acceptance. | HIGH |
| 38 | `Ch 03` (Non-determinism in PDAs!) | Beginners assume PDAs are like DFAs — they don't see why a PDA for `{ww^R}` MUST **guess the midpoint** using $\epsilon$-transitions! | NEEDS-DIAGRAM | Trace a PDA on `0110` showing two parallel guessed clones (one guesses midpoint too early and dies; one guesses right and accepts). | HIGH |
| 39 | `Ch 03` (DCFL & DPDA vs NPDA) | Doesn't give a dedicated lesson to **Deterministic PDA (DPDA) & DCFLs**: `a^n \cup a^n b^n` (`2020_FN_Q24`), `wcw^R` vs `ww^R`, **complement closure of DCFL** (unlike CFL!), and **regular $\subset$ DCFL $\subset$ CFL** (`2025_AN_Q24`, `2017_AN_Q38`)! | MISSING-GATE-CONCEPT | Add a full lesson on DCFL vs CFL vs Regular, including the end-marker `$` intuition for why DPDA works on `a^n \cup a^n b^n` yet fails on `ww^R`. | HIGH |
| 40 | `Ch 03` (CFG <-> PDA Equivalence) | Doesn't explain how any CFG converts to a 1-state (or 3-state) PDA (top-down derivation simulation on stack) or vice versa. | STEP-SKIPPED | Show a small 3-rule CFG converted into a 1-state PDA accepting by empty stack. | LOW |
| 41 | `Ch 04` (CFL Closure Matrix) | Doesn't cover the full CFL vs DCFL closure matrix — especially **`CFL \cap Regular = CFL`** (`2017_AN_Q24`, `2021_AN_Q54`), **`CFL - Regular = CFL`**, **`Regular - CFL` NOT necessarily CFL (`2021_FN_Q19`)**, and **why `\overline{ww}` IS CFL (`2022_FN_Q48`)**! | MISSING-GATE-CONCEPT | Build a side-by-side `Regular vs DCFL vs CFL` closure table AND prove why `L1 \cap R` is CFL (product of PDA × DFA!) and why `\overline{ww}` is CFL! | HIGH |
| 42 | `Ch 04` (Counting / Multi-counter CFL traps) | Students get tricked by `a^i b^j c^k d^l` constraints (`2026_AN_Q48`, `2018_FN_Q45`, `2025_FN_Q45`, `2019_FN_Q39`) — they can't tell **nested/sum (`i+k=j+l`, `i=l & j=k`)** from **crossing/double-equality (`i=k & j=l`, `a^m b^m c^{m+n}`)**! | NEEDS-DIAGRAM | Draw the **"Nested Arcs vs Crossing Arcs"** stack rule showing which constraints a 1-stack machine can match without arcs crossing! | HIGH |
| 43 | `Ch 04` (CFL Pumping Lemma & Ogden's Lemma) | Doesn't explain the **5 conditions of CFL Pumping Lemma (`|vwx| <= p`, `|vx| >= 1`, `u v^i w x^i y`)**, why `v` and `x` pump **together**, or why `|vwx| <= p` restricts `v` and `x` to at most 2 adjacent symbol blocks (`a^p b^p c^p`)! | TOO-HARD-TOO-EARLY | Draw the parse-tree repeated-variable proof of CFL Pumping Lemma (`S -> u A y -> u v A x y -> u v w x y`) and trace `a^p b^p c^p` & `ww`. | HIGH |
| 44 | `Ch 04` (CFL Decision Properties & CYK) | Doesn't cover **CFL decidability**: Membership (**CYK DP $O(n^3)$**), Emptiness, Finiteness = **Decidable** (`2025_AN_Q25`); while Universality (`L(G) = \Sigma^*`), Equivalence (`L(G1)=L(G2)`), Intersection Emptiness, Disjointness, Regularity of CFL = **Undecidable** (`2021_FN_Q37`, `2017_AN_Q60`)! | MISSING-GATE-CONCEPT | Add a complete CFL Decision Table + trace a tiny $3 \times 3$ CYK pyramid + explain *why* `L(PDA) = \Sigma^*` is undecidable (valid TM computation history complement!). | HIGH |
| 45 | `Ch 04` (CSL, LBA & Chomsky Hierarchy) | Completely omits **Context-Sensitive Grammars (Type 1, $|\alpha| \le |\beta|$)**, **Linear Bounded Automata (LBA)**, and the **4-level Chomsky Hierarchy** (`2017_AN_Q38` `a^p` prime and `a^n b^n c^{2n}`)! | MISSING-GATE-CONCEPT | Add a Chomsky Hierarchy lesson (Type 3 -> Type 2 -> Type 1 -> Type 0) with machine, grammar rule, and closure summary for CSL/LBA. | MEDIUM |
| 46 | `Ch 05` (TM Tape, Transitions & Configurations) | Doesn't draw a **Turing Machine tape, read/write head, blank symbol `# / B`, infinite tape**, or show step-by-step **Instantaneous Descriptions (IDs)** like `q0 011 -> X q1 11`. | NEEDS-DIAGRAM | Draw a TM tape moving step by step on `a^n b^n c^n` (zig-zag marking `X, Y, Z`) with ID trace table! | HIGH |
| 47 | `Ch 05` (3 Possible Outcomes of a TM!) | Beginners think a TM only says Yes or No! They don't see the 3rd outcome (**Loop Forever**) — which separates **Decider (Recursive)** from **Recognizer (RE)** (`2026_AN_Q13`!). | MISSING-PREREQUISITE | Draw a 3-exit box (`Accept`, `Reject`, `Loop Forever`) for Recognizer vs 2-exit box (`Accept`, `Reject` — ALWAYS halts!) for Decider! | HIGH |
| 48 | `Ch 05` (TM Variants & Equivalence) | Misses **Multi-tape TM**, **Non-deterministic TM (NTM)**, **Stay-option**, **Semi-infinite tape**, and the key GATE insight: they add **NO extra power** (still RE), unlike Finite Automata -> NFA (equal) vs PDA -> NPDA (**strictly stronger!**)! | MISSING-GATE-CONCEPT | Add a "Does Non-Determinism Add Power?" comparison table across FA, PDA, LBA (open), and TM! | HIGH |
| 49 | `Ch 05` (Computable Functions vs Languages) | Doesn't teach **TM as a function computer** (starts with `x`, halts with `f(x)` on tape) or the theorem tested in `2017_FN_Q52`: **`f` total computable $\iff$ graph language `{x # f(x)}` is recursive**! | MISSING-GATE-CONCEPT | Add a short topic on TM-computable total functions and prove both directions of `L_f` recursive $\iff f$ computable. | MEDIUM |
| 50 | `Ch 05` (Recursive vs RE Closure & Complementation Theorem) | Doesn't prove **Post's Theorem ($L$ and $\overline{L}$ both RE $\iff$ $L$ is Recursive)** (`2022_FN_Q23`), or **why RE is NOT closed under complement** (`2018_FN_Q17`) while **RE IS closed under intersection** (run $M_1$ then $M_2$ sequentially; why does union need **parallel/dovetailing**?!). | MISSING-GATE-CONCEPT | Draw the **Parallel Dovetailing** runner (alternating 1 step of $M_1$, 1 step of $M_2$) for $L_1 \cup L_2$ in RE, and the dovetailing inverter for Post's Theorem! | HIGH |
| 51 | `Ch 05` (Non-RE Languages: $\overline{H_{TM}}$ / $L_d$) | Doesn't show what sits **OUTSIDE RE** (Co-RE vs Non-RE/Non-Co-RE like $L_{\text{eq}}$) or draw the **concentric onion map** of all language classes! | NEEDS-DIAGRAM | Draw the complete "Universe of Languages" concentric map (Regular -> DCFL -> CFL -> CSL -> Recursive -> RE / Co-RE -> Outside Both) with concrete examples in every ring! | HIGH |
| 52 | `Ch 06` (Encoding $\langle M \rangle$, Universal TM, Diagonalization) | Doesn't explain what **$\langle M \rangle$** means (turning a Turing machine's transition diagram into a binary string like a `.exe` file!) or **Universal TM** (a TM that runs other TMs like an interpreter!). | UNEXPLAINED-WORD | Explain $\langle M \rangle$ as saving a machine as a text/binary file, and UTM as "Python running a `.py` file". | HIGH |
| 53 | `Ch 06` (Halting Problem & Self-Reference Paradox) | Classic textbooks throw $D(\langle D \rangle)$ diagonalization in 5 dense lines, losing everyone. | TOO-HARD-TOO-EARLY | Explain Halting Problem using a friendly story ("The Liar / Perfect Bug-Checker Program `HaltChecker` feeding itself into itself!"). | HIGH |
| 54 | `Ch 06` (Mapping Reduction $A \le_m B$ Direction!) | Doesn't highlight the #1 mistake in GATE Undecidability: **reducing KNOWN undecidable $A$ TO unknown $B$ ($A \le_m B$), NOT $B \le_m A$**! | MISSING-GATE-CONCEPT | Draw the reduction arrow box (`A <=_m B`: "If $B$ were easy, $A$ would become easy — contradiction!") and trace reducing $A_{\text{TM}}$ to $H_{\text{TM}}$ and $E_{\text{TM}}$. | HIGH |
| 55 | `Ch 06` (Rice's Theorem — Exact Conditions & Traps!) | Beginners misuse Rice's theorem on **syntactic** properties (e.g., "Does TM $M$ have $\le 10$ states?" or "Does $M$ take $> 100$ steps?") which ARE **DECIDABLE** (`2022_FN_Q46(D)`, `2021_FN_Q23`, `2020_FN_Q44`)! | MISSING-GATE-CONCEPT | Teach Rice's 2-point checklist (**1. Property of $L(M)$ ONLY, not $M$'s code/steps/states! 2. Non-trivial: true for some RE, false for some RE**) with 6 trick examples! | HIGH |
| 56 | `Ch 06` (Bounded-Step & Finite-Length Decidability Trick) | GATE asked **3 times** (`2022_FN_Q46(D)`, `2021_FN_Q23`, `2020_FN_Q44(L2)`) about *"takes > k steps on all/some inputs"*! Beginners think anything mentioning a TM is undecidable! | MISSING-GATE-CONCEPT | Teach the **"Bounded Tape Horizon" trick**: in $k$ steps, a TM can only read at most $k+1$ tape cells, so testing all strings of length $\le k+1$ decides it in finite time! | HIGH |
| 57 | `Ch 06` (Post Correspondence Problem — PCP) | Completely omits **Post Correspondence Problem (PCP)** and **Modified PCP** (domino matching game!), even though it's a standard TOC syllabus subtopic in every GATE textbook! | MISSING-GATE-CONCEPT | Teach PCP visually as matching top/bottom dominoes, give 1 YES + 1 NO example, and state PCP undecidability (and decidability over unary alphabet!). | MEDIUM |
| 58 | `Ch 06` (Master Decidability Matrix) | Doesn't summarize **which problems (Membership, Emptiness, Finiteness, Universality, Equivalence, Ambiguity, Regularity)** are decidable across **DFA, CFG/PDA, CSG/LBA, TM** (`2025_AN_Q25`, `2021_FN_Q37`, `2018_FN_Q46`, `2017_AN_Q60`)! | NEEDS-DIAGRAM | Build ONE giant colour-coded Master Decidability Matrix (Green = Decidable, Red = Undecidable) with the reason for every tricky cell! | HIGH |
| 59 | `Part C` (`2020_FN_Q22` Key) | **CRITICAL KEY BUG!** All 4 options A, B, C, D are marked `✔ official` on a 1-mark MCQ! In reality ALL 4 options in GATE 2020 were mathematically wrong (`A` accepts `1111`, `B` misses `10`, `C` and `D` miss `01`), so GATE awarded **Marks to All (MTA)**! | FACT-DOUBT | Add an explicit `[OFFICIAL MTA: ALL 4 OPTIONS WERE BUGGY IN GATE 2020]` banner and prove why each of A, B, C, D fails! | HIGH |
| 60 | `Part C` (`2021_AN_Q18` Option D) | **MIS-TRANSCRIPTION / WRONG MATH!** Option D says `{w x x w^R w^R}` (`✔ official`), which is **NOT context-free**! In actual GATE 2021 CS Set 2, Option D was **`{w x x^R w^R}`** (which IS context-free)! | FACT-DOUBT | Fix Option D to `{w x x^R w^R | w, x \in \{0,1\}^*}` and warn why `{w x x w^R w^R}` is NOT CFL. | HIGH |
| 61 | `Part C` (`2023_FN_Q19` text) | **MIS-TRANSCRIPTION!** Line reads `letter -> [A – Za – a]`. That excludes `b`–`z`! Real question had `[A – Za – z]`. | FACT-DOUBT | Fix `[A – Za – a]` to `[A – Za – z]`. | HIGH |
| 62 | `Part C` (`2024_FN_Q63` text) | Minor typo: `"which are neither in r nor is s"` instead of `"neither in r nor in s"`. | UNCLEAR-ENGLISH | Fix `"nor is s"` -> `"nor in s"`. | LOW |
| 63 | `Part C` (14 Questions Missing Images!) | **14 PYQs** (`2026_AN_Q47`, `2025_FN_Q50`, `2024_AN_Q34`, `2024_AN_Q55`, `2024_FN_Q36`, `2023_FN_Q14`, `2023_FN_Q19`, `2023_FN_Q40`, `2022_FN_Q12`, `2021_AN_Q20`, `2021_FN_Q26`, `2021_FN_Q18`, `2018_FN_Q62`, `2017_AN_Q40`) say `[IMAGE_...]` not shown — making it impossible to verify 18% of the PYQ bank! | NEEDS-DIAGRAM | Export/describe every missing transition diagram or table as text/structured diagram data before finalizing the PYQ key audit. | HIGH |
| 64 | `Part C` (`2022_FN_Q47` subtlety) | Both `L_1 = {a^n w a^n}` (`n >= 0`!) and `L_2 = {w x w^R | |w|, |x| > 0}` look non-regular at first glance, yet BOTH collapse to regular! Beginners won't understand why A, B, AND C are all official keys without explaining `n=0` and `|w|=1`! | NEEDS-EXAMPLE | Add a highlighted "Beware Implicit `n >= 0` & Shortest `|w|=1` Collapse" solution note on `2022_FN_Q47`. | MEDIUM |
| 65 | `Part C` (`2020_FN_Q24` `LL(k)`) | Statement III asks `"L is not LL(k) for any k"` — `LL(k)` is a **Compiler Design** parsing concept never listed anywhere in the TOC chapters! | MISSING-PREREQUISITE | Explain `k`-symbol top-down lookahead intuitively in Ch 03 DCFL lesson (and cross-link Compiler Design!). | MEDIUM |
| 66 | `Part C` (`2017_FN_Q37` Grammar vs Example) | `stmt -> if expr then expr else expr; stmt | 0`, yet the example omits `; 0`, and the question is really control-flow path counting (Compiler/Program Analysis overlap). | UNCLEAR-ENGLISH | Clarify how `0` terminates `stmt` and why 10 sequential `if`s multiply `2^10 = 1024`. | LOW |
| 67 | `Part C` (`2019_FN_Q59` & `2025_AN_Q60`) | Both NAT questions combine **Discrete Math Group Theory ($S_5$ bijections & $(\mathbb{Z}/7\mathbb{Z})^*$ modular multiplication)** with **DFA Minimization**. A student who hasn't reviewed Groups in Discrete Math freezes immediately! | MISSING-PREREQUISITE | Add a self-contained "Group-like Modulo & Permutation DFAs" worked example in Ch 01 Minimization. | MEDIUM |
| 68 | `Part C` (`2025_AN_Q30`) | List-matching MSQ allows TWO valid matchings (B and C) because both Regular and Recursive are closed under both Union and Intersection! Beginners get confused seeing two matching options both right. | NEEDS-EXAMPLE | Explain why one-to-many properties create multiple valid MSQ matchings. | LOW |
| 69 | `Ch 01` (Regex to minimal DFA shortcut) | Students spend 10 minutes converting Regex -> $\epsilon$-NFA -> NFA -> DFA -> Minimize in exams, instead of using direct intuition/Myhill-Nerode. | MISSING-FINER-POINT | Teach both the formal pipeline AND the fast "State-Meaning + Merge Equivalent States" exam shortcut. | MEDIUM |
| 70 | `Ch 01` (Finite Languages & Pumping Length) | Beginners assume every finite language has no DFA or gets confused about `L = \emptyset` (1-state DFA, 0 final states) vs `L = {\epsilon}` (2-state DFA if complete! — trap: `q0` final on `a,b` goes to `q_dead`!). | NEEDS-EXAMPLE | Draw the minimal complete DFAs for `\emptyset` (1 state), `{\epsilon}` (2 states), and `\Sigma^*` (1 state)! | HIGH |
| 71 | `Ch 01` (Arden's theorem $\epsilon$-trap) | Doesn't warn that Arden's Theorem $R = Q + RP \implies R = QP^*$ gives **non-unique solutions** if $\epsilon \in P$! | MISSING-FINER-POINT | Show a 2-line counterexample with $R = a + R(\epsilon)$ having infinitely many solutions. | MEDIUM |
| 72 | `Ch 02` (Regular Expression vs Regular Grammar) | Doesn't teach **Right-Linear & Left-Linear Grammars (Type 3)** and why **mixing left-linear and right-linear rules (`S -> aS | Sb`) breaks regularity** (gives `{a^n b^m}` or `{a^n b^n}` if `S -> aSb`!)! | MISSING-GATE-CONCEPT | Add a lesson/section in Ch 01/02 on Regular Grammars (Right-Linear & Left-Linear -> NFA) and why mixed linearity becomes CFG! | HIGH |
| 73 | `Ch 03` (Leftmost vs Rightmost vs Ambiguity trap) | `2026_FN_Q25` proves an **ambiguous** grammar can STILL have **only ONE** rightmost derivation for a *specific* string (`abab`), even though another string (`abb`) has two! Students falsely think "ambiguous grammar = EVERY string has 2+ parse trees"! | MISSING-FINER-POINT | Highlight explicitly: "Ambiguous means AT LEAST ONE string has 2+ parse trees — NOT every string!" | HIGH |
| 74 | `Ch 03` (CNF conversion traps) | Students forget CNF allows `S -> \epsilon` ONLY if $S$ does NOT appear on any RHS, and forget binary-splitting long rules (`A -> BCDE` becomes 3 binary rules)! | STEP-SKIPPED | Trace a full 4-step CFG -> CNF conversion (`\epsilon`, unit, terminals in long rules, split >2 variables). | MEDIUM |
| 75 | `Ch 03` (Chomsky vs Greibach comparison) | Doesn't show what GNF (`A -> a \alpha`) is actually used for (eliminating left recursion & building an $\epsilon$-free PDA directly from a CFG!). | NEEDS-EXAMPLE | Show a side-by-side table comparing CNF (`A -> BC | a`) vs GNF (`A -> a\alpha`). | LOW |
| 76 | `Ch 04` (Why `L_1 \cap L_2` fails for CFLs) | Beginners memorize "CFL not closed under $\cap$" without seeing the exact reason (**a PDA only has ONE stack!**). | NEEDS-DIAGRAM | Draw `{a^n b^n c^m} \cap {a^m b^n c^n} = {a^n b^n c^n}` showing why matching `a=b` and `b=c` simultaneously would need TWO stacks. | HIGH |
| 77 | `Ch 04` (Closure of DCFL under $\cap$ Regular) | `2021_AN_Q54` and `2020_FN_Q24` rely on whether **DCFL is closed under complement (YES!), union (NO!), intersection (NO!), intersection with Regular (YES!)**. Missing completely! | MISSING-GATE-CONCEPT | Add a separate **DCFL** column to the Closure Table in Ch 04 and explain why reversing final/non-final in a DPDA needs an extra loop-avoidance check! | HIGH |
| 78 | `Ch 05` (Universal TM vs Specific TM) | Students confuse "decide if $M$ halts on $w$" (a question about ONE fixed $M, w$) with "a fixed language $L(M)$ is always recursive for one fixed finite $L$"! E.g. **"Is God's existence / 100 consecutive 7s in $\pi$ decidable?"** — classic constant-function decidability trick (`f() = true` or `f() = false`, one of them is a decidable TM even if we don't know which!)! | MISSING-GATE-CONCEPT | Add the "Single-bit Yes/No constant language is ALWAYS recursive!" finer point in Ch 05/06. | MEDIUM |
| 79 | `Ch 05` (TM Enumeration / Lexicographic Order) | Never introduces **Enumerators** or proves **$L$ is Recursive $\iff L$ can be enumerated in strictly increasing (canonical) length-lexicographic order**, while **$L$ is RE $\iff L$ can be enumerated in *some* order**! | MISSING-GATE-CONCEPT | Draw an Enumerator printer TM and trace both canonical-order (Recursive) and arbitrary-order (RE) printing. | HIGH |
| 80 | `Ch 06` (Co-RE vs RE vs Decidable) | Doesn't teach **Co-RE** ($\overline{L} \in \text{RE}$) clearly — e.g. why $\overline{A_{\text{TM}}}$ and $E_{\text{TM}}$ ("is $L(M)=\emptyset$?") are **Co-RE** (can semi-decide non-emptiness, CANNOT semi-decide emptiness!), whereas $EQ_{\text{TM}}$ ("is $L(M_1)=L(M_2)$?") is **NEITHER RE NOR Co-RE**! | MISSING-GATE-CONCEPT | Draw the 4-region diagram (**Recursive | RE \ Rec | Co-RE \ Rec | Neither**) placing $A_{\text{TM}}, H_{\text{TM}}, E_{\text{TM}}, \overline{E_{\text{TM}}}, ALL_{\text{TM}}, EQ_{\text{TM}}$ inside the exact right region! | HIGH |
| 81 | `Ch 06` (Decidability of Context-Free vs Regular traps) | `2018_FN_Q46(IV)` asks: *"Given an NFA $N$, is there a DPDA accepting $L(N)$?"* Students panic and guess Undecidable because it mentions "DPDA"! | MISSING-FINER-POINT | Teach the **"Read the Input Type First!"** rule: if input is an NFA/DFA, its language is ALREADY regular -> ALWAYS has a DPDA (Decidable, answer always YES!). | HIGH |
| 82 | `Ch 01–06` (Old written standard warning) | `Part B.2` admits the 19 existing lessons were written *"for people who already know the subject"*, yet gives no sample pilot rewrite or migration plan showing how Ch 01–06 will expand from 19 micro-topics to full beginner-first units. | UNCLEAR-ENGLISH | Map each of the 19 old topics explicitly to the new v1 multi-lesson structure (Part 5 below). | MEDIUM |
| 83 | `Part B.2` (Missing **Pigeonhole Principle** link in FA) | Beginners don't see *why* a DFA with $n$ states MUST repeat a state on any string of length $\ge n$ (which is literally the **Pigeonhole Principle**!). | MISSING-PREREQUISITE | Draw $n$ boxes and $n+1$ string prefixes landing in them so the Pumping Lemma loop feels completely obvious instead of memorized! | HIGH |
| 84 | `Part C` (Repeated-style `a^m b^n` language parsing traps) | Beginners confuse **ordered** (`a^n b^n`) with **unordered** (`#a(w) = #b(w)`), and confuse **prefix** (`w = a^n b^n`) with **substring**! | NEEDS-EXAMPLE | Compare `{a^n b^n}` vs `{w : #a(w)=#b(w)}` vs `{w : every prefix has #a >= #b}` side by side with DFAs/PDAs/CFGs! | HIGH |

---

## PART 3. WHAT A COMPLETE SUBJECT MUST HAVE

Below is every chapter, topic, and finer sub-topic a complete GATE CS Theory of Computation book must cover (beyond the 19-topic skeleton in `Part B.2`), checked against GATE PYQs (`Part C`), Made Easy, GateWallah, Unacademy, Sipser, Hopcroft–Ullman, and NPTEL:

1. **Chapter 00: Mathematical & Formal Language Foundations** *(completely missing!)*
   - **Sub-topics:** Alphabets ($\Sigma$), Strings ($w$), $|w|$, Reversal ($w^R$), Substring vs Prefix vs Suffix vs Subsequence; Languages ($L \subseteq \Sigma^*$); **$\epsilon$ vs $\{\epsilon\}$ vs $\emptyset$**; Language operations ($L_1 \cup L_2$, $L_1 \cdot L_2$, $L^0, L^k, L^*, L^+$, **Order of a language $L^k = L^{k+1}$**); Equivalence Relations & Equivalence Classes; **Pigeonhole Principle**; **Countable vs Uncountable sets (Cantor's diagonalization, $|\Sigma^*| = \aleph_0$ vs $|2^{\Sigma^*}| = 2^{\aleph_0}$)**; Proof by Contradiction.
   - **Syllabus line:** Foundation for all 4 lines of `Section 6: Theory of Computation` (and `Discrete Mathematics: Sets, relations`).
   - **How often GATE asks it:** Not sure of exact standalone count, though countability/uncountability and language algebra appear directly in `Part C` (`2019_FN_Q50`, `2021_AN_Q23`, `2018_FN_Q62`).
   - **Typical question type:** MCQ/MSQ (countability of language sets), NAT (order of a language $L^k = L^{k+1}$).
   - **Zero-level prerequisite:** High-school sets & powers of 2.

2. **Complete Finite Automata, Minimization, Grammar & Output Machines (`Ch 01` missing finer depth)**
   - **Sub-topics:** DFA complete vs incomplete (trap state); 5 DFA design families (mod-$k$ divisibility, last-$k$ / substring / avoid-substring, positional length, product DFA for $\cap / \cup / -$, group/permutation DFAs); NFA & $\epsilon$-NFA ($\epsilon$-closure, $\hat{\delta}$); Subset construction & minimal DFA bounds ($\le 2^n$); **Table-Filling DFA Minimization & Unreachable State Removal**; **Myhill-Nerode Theorem** (distinguishable pairs & exact state counting); **Thompson's Construction** (Regex -> $\epsilon$-NFA); **State Elimination & Arden's Theorem** (including the $\epsilon \notin P$ trap); **Regular Expression algebraic identities & precedence traps**; **Right-Linear & Left-Linear Grammars (Type 3)** vs mixed linearity; **Mealy & Moore Machines** (output traces & state-count conversion).
   - **Syllabus line:** `Regular expressions and finite automata`.
   - **How often GATE asks it:** Very frequently (Part B bank shows 26 questions / 40 marks across all 10 years in 2017–2026; exact sub-topic breakdown: not sure).
   - **Typical question type:** NAT (minimum DFA states), MCQ/MSQ (FA -> Regex, Regex -> NFA, distinguishable states, false statements about $2^n$ bound).
   - **Zero-level prerequisite:** Chapter 00 (strings, equivalence classes, Pigeonhole Principle).

3. **Complete Regular Closure, Myhill-Nerode & Pumping Lemma (`Ch 02` missing depth)**
   - **Sub-topics:** Full closure table including **Prefix, Suffix, Quotient, Substitution, Homomorphism, Inverse Homomorphism**; **Non-closure / Extreme Counterexample reasoning** ($L_1 \cup L_2$ regular $\not\Rightarrow L_1$ regular; infinite union trap; every infinite language contains undecidable subsets); **"Smallest-Piece Collapse" regular disguises** ($a^n w a^n$, $w x w^R$, $w x y x$); **Pumping Lemma as a two-player quantifier game** & finding valid pumping lengths; **Myhill-Nerode fooling sets** for proving non-regularity; **Decision Properties of Regular Languages** (Emptiness, Finiteness, Membership, Equivalence, Universality via reachability/product DFA).
   - **Syllabus line:** `Regular and context-free languages, pumping lemma`.
   - **How often GATE asks it:** Very frequently (part of the 25-Q / 40-mark bucket in Part B; exact split between Regular vs CFL: not sure).
   - **Typical question type:** MCQ/MSQ (closure true/false, classify language as regular/non-regular, valid pumping length).
   - **Zero-level prerequisite:** Ch 00 + Ch 01 (DFA, NFA, Product DFA, complementation).

4. **Complete CFG Design, Simplification, Normal Forms & DPDA/DCFL (`Ch 03` missing depth)**
   - **Sub-topics:** Parse trees, LMD, RMD; **Ambiguous grammar vs Inherently Ambiguous CFL** (and checking single-string unique derivations!); **Rule Accounting / Invariant method** for reading tricky CFGs; **CFG Simplification** (non-generating -> non-reachable -> $\epsilon$-removal -> unit-removal); **CNF (`2n - 1` steps!) & GNF**; Left-recursion & Left-factoring intuition; PDA formal model, **Final State vs Empty Stack acceptance**, guessing midpoint in NPDA; **DPDA & DCFL** (formal properties, `a^n \cup a^n b^n`, complement closure of DCFL, `LL(k)` lookahead intuition, `Regular ⊂ DCFL ⊂ CFL`).
   - **Syllabus line:** `Context-free grammars and push-down automata`.
   - **How often GATE asks it:** Regularly (Part B bank shows 14 questions / 22 marks in 6 of 10 years; exact subtopic split: not sure).
   - **Typical question type:** MCQ/MSQ (ambiguity, language generated by CFG, terminal count inequalities, DPDA acceptance), NAT (derivation steps in CNF, strings accepted by PDA of length $k$).
   - **Zero-level prerequisite:** Ch 00 + Ch 01 (regular sets, FA intuition) + basic recursion/trees.

5. **Complete CFL Closure, Pumping Lemma, Decision Matrix & Chomsky Hierarchy (`Ch 04` missing depth)**
   - **Sub-topics:** **3-Way Closure Table (Regular vs DCFL vs CFL)** including `CFL ∩ Regular = CFL`, `Regular - CFL` trap, `\overline{ww}` is CFL, `\overline{a^n b^n c^n}` is CFL; **Nested-Arc vs Crossing-Arc rule** for multi-counter languages (`a^i b^j c^k d^l`); **CFL Pumping Lemma** (5 exact conditions, `|vwx| <= p` block limit) & **Ogden's Lemma** (concept/awareness); **CYK Membership Algorithm ($O(n^3)$)** & full **CFL/DCFL Decision Matrix** (Emptiness/Finiteness decidable; Universality/Equivalence/Intersection/Regularity undecidable); **Context-Sensitive Languages (CSL), Linear Bounded Automata (LBA), and the Chomsky Hierarchy (Types 0–3)**.
   - **Syllabus line:** `Regular and context-free languages, pumping lemma` (and `Context-free grammars and push-down automata`).
   - **How often GATE asks it:** Very frequently (CFL closure + classifying languages as Reg/CFL/Non-CFL is a top-tier GATE staple; exact count: not sure).
   - **Typical question type:** MCQ/MSQ (classify $L_1, L_2$, closure under $\cap / \cup / -$ / complement).
   - **Zero-level prerequisite:** Ch 02 (closure logic, Pumping Lemma game) + Ch 03 (CFG, PDA, DCFL).

6. **Complete Turing Machines, Computability, Reductions, Rice's Theorem & PCP (`Ch 05 & 06` missing depth)**
   - **Sub-topics:** TM tape & Instantaneous Descriptions (IDs); **Decider (Recursive) vs Recognizer (RE)** (Accept / Reject / Loop); **TM Variants** (Multi-tape, Non-deterministic, Semi-infinite) & power-equivalence table across FA/PDA/LBA/TM; **TM-computable total functions ($f$ computable $\iff L_f$ recursive)**; **Enumerators** (canonical vs arbitrary order); **Post's Theorem ($L, \overline{L} \in \text{RE} \iff L \in \text{Recursive}$)** & **Parallel Dovetailing**; **Universe of Languages Onion Diagram** (with Co-RE & Neither-RE-nor-Co-RE); Encoding $\langle M \rangle$ & **Universal TM**; Halting Problem ($H_{\text{TM}}, A_{\text{TM}}$) diagonalization; **Mapping Reductions ($A \le_m B$) direction rules**; **Rice's Theorem (2-part semantic vs syntactic check)**; **Bounded-Step / Finite-Horizon Decidability trick**; **Post Correspondence Problem (PCP / MPCP)**; **Complete Master Decidability Matrix (DFA, CFG/PDA, LBA, TM)**.
   - **Syllabus line:** `Turing machines and undecidability`.
   - **How often GATE asks it:** Regularly (Part B bank shows 12 questions / 19 marks in 8 of 10 years; exact subtopic split: not sure).
   - **Typical question type:** MCQ/MSQ (decidable vs undecidable problems, recursive vs RE properties, bounded-step tricks).
   - **Zero-level prerequisite:** Ch 00 (countability/diagonalization) + Ch 01–04 (DFA/CFG decision results).

---

## PART 4. THE DIAGRAMS I NEED

### Ch 00 · Mathematical & Language Foundations
1. **The Empty Trio (`\emptyset` vs `{\epsilon}` vs `\epsilon`)**
   - *What to draw:* Three physical boxes: Box 1 (`\emptyset`) is completely empty (`0` items inside); Box 2 (`{\epsilon}`) has ONE invisible blank slip of paper (`1` item inside); beside it, a blank slip of paper (`\epsilon`) outside any box — plus showing `L · \emptyset = \emptyset` (multiplying by zero kills everything) vs `L · {\epsilon} = L` (multiplying by 1 leaves it unchanged).
   - *What to notice:* `\emptyset` has size 0, `{\epsilon}` has size 1, and `\epsilon` is a string, NOT a language!
   - *Format:* **Single picture**
2. **Countable Lists vs Uncountable Grid (Cantor's Diagonalization)**
   - *What to draw:* Left side: all finite binary strings in $\Sigma^*$ numbered `1, 2, 3, ...` (`\epsilon, 0, 1, 00, 01, ...`) proving $\Sigma^*$ is countable. Right side: an infinite table of infinite binary sequences (representing languages/subsets of $\Sigma^*$) with a diagonal line highlighted and flipped bit-by-bit (`0 -> 1, 1 -> 0`) to build a brand-new row missing from the list!
   - *What to notice:* Why you can list all C programs and all Turing machines (countable), yet CANNOT list all languages (uncountable) — proving non-RE languages MUST exist!
   - *Format:* **Step-by-step series of pictures**

### Ch 01 · Finite Automata & Regular Expressions
3. **DFA State-Memory Game & Trap State**
   - *What to draw:* A 3-state DFA for "ends in `01`" where each state is drawn BOTH as a circle (`q0, q1, q2`) AND with a thought-bubble ("I remember nothing useful", "Last char was `0`", "Last two chars were `01` — WIN!"), next to an incomplete machine vs a complete machine sending illegal inputs to a red Trash/Trap State.
   - *What to notice:* A state isn't random — it remembers just enough past characters; and a DFA MUST have outgoing arrows for EVERY symbol from EVERY state.
   - *Format:* **Single picture**
4. **Mod-$k$ Remainder Wheel & Product DFA Grid**
   - *What to draw:* A 3-spoke binary mod-3 clock (`0, 1, 2` with `2x + bit mod 3` arrows) next to a $2 \times 3$ checkerboard of paired states `(even/odd a's) × (a's mod 3)` (`2020_FN_Q41`), highlighting the accepting pairs `(0, 1)` and `(0, 2)`.
   - *What to notice:* Product DFA mechanically intersects or subtracts two simple DFAs without guessing!
   - *Format:* **Single picture**
5. **NFA "Parallel Clones" vs $\epsilon$-Closure Bubble & Subset Table**
   - *What to draw:* An NFA branching on `0` into two simultaneous ghost clones (`q0` and `q1`), plus $\epsilon$-closure bubbles drawn as dashed clouds gathering free jumps, followed by the step-by-step Subset Construction table collapsing sets `{q0, q1}` into single DFA super-states.
   - *What to notice:* Every subset-state is just a snapshot of "all places my clones could currently stand."
   - *Format:* **Step-by-step series of pictures** + **Trace table**
6. **Table-Filling DFA Minimization & Myhill-Nerode Buckets**
   - *What to draw:* Step 1: Cross out unreachable state (`X`). Step 2: Lower-triangular stair grid of pairs `(q_i, q_j)` marking X on `(Final, Non-Final)` at Round 0, then propagating X backwards across Round 1 and Round 2; next to it, infinite $\Sigma^*$ strings sorted into $k$ equivalence buckets.
   - *What to notice:* Remove unreachable states FIRST, and notice how unmarked cells at the end merge into one minimal state.
   - *Format:* **Step-by-step series of pictures**
7. **Thompson's Regex-to-NFA Blocks & State Elimination Frames**
   - *What to draw:* Lego building blocks for `a + b` (parallel fork), `ab` (series glue), `a*` ($\epsilon$-loop back and bypass), and frames showing one middle state `q_k` being deleted while replacing `p -> q_k -> r` with `p -> r` labelled `R_{pk} (R_{kk})^* R_{kr}`.
   - *What to notice:* Regex-to-NFA builds from small blocks; FA-to-Regex deletes one state at a time keeping all paths intact.
   - *Format:* **Step-by-step series of pictures**
8. **Mealy (Output on Arrows) vs Moore (Output Inside Circles)**
   - *What to draw:* Two small 2-state machines reading `011`, one printing output bits on transition arrows (Mealy: 3 output chars) and one printing output inside state circles (Moore: 4 output chars including initial output).
   - *What to notice:* Moore outputs 1 extra initial symbol (`n + 1` vs `n`) and splits states that receive different outputs on incoming arrows.
   - *Format:* **Single picture**

### Ch 02 · Regular Languages: Closure, Myhill-Nerode & Pumping Lemma
9. **Complement Flipping Trap (DFA vs NFA) & Prefix/Suffix Surgery**
   - *What to draw:* Left: complete DFA flipping final <-> non-final circles cleanly; Middle: NFA flipping final <-> non-final circles producing WRONG output on a multi-path string! Right: a DFA where any state that can reach a final state becomes final (`Prefix(L)`) vs making all states reachable from start also start states (`Suffix(L)`).
   - *What to notice:* You can NEVER complement an NFA by flipping accepting circles; you must convert to a complete DFA first!
   - *Format:* **Single picture**
10. **Pumping Lemma "Loop-on-a-Necklace" & Two-Player Game**
    - *What to draw:* An $n$-state DFA traversed by a long string of length $\ge n$: by Pigeonhole Principle, two checkpoints land on the SAME state `q`, forming a circular loop `y` in the middle (`x`, loop `y`, tail `z`), with arrows showing `i = 0` (skip the loop!) and `i = 2` (spin the loop twice!).
    - *What to notice:* `y` MUST sit inside the first `p` characters (`|xy| <= p`), and breaking EITHER `i = 0` OR `i >= 2` lets YOU defeat the opponent!
    - *Format:* **Step-by-step series of pictures**
11. **Myhill-Nerode Fooling-Set Pairs**
    - *What to draw:* Infinite list of prefixes `a^1, a^2, a^3, ...` trying to squeeze into a finite number of DFA boxes — two distinct prefixes `a^i` and `a^j` forced into the SAME box, then appending `b^i` sends one to Accept and the other to Reject (contradiction!).
    - *What to notice:* Two strings in the same DFA state MUST agree on EVERY possible future suffix!
    - *Format:* **Single picture**

### Ch 03 · Context-Free Grammars & Pushdown Automata
12. **Parse Tree vs Leftmost/Rightmost Derivations & Two-Tree Ambiguity**
    - *What to draw:* Two DIFFERENT parse trees for `id + id * id` (or `abb` in `S -> aSbS | bS | \epsilon`) showing different groupings/meanings, side by side with a step-by-step derivation trace.
    - *What to notice:* Ambiguity means two *shapes* of tree for the same string — NOT just two derivation orders producing the same tree!
    - *Format:* **Single picture** + **Trace table**
13. **Rule-Accounting Table for Grammar Invariants**
    - *What to draw:* A clean arithmetic table listing each grammar rule (`S -> aSbS`, `S -> bS`, `S -> \epsilon`), its net change `(Δa, Δb, ΔS)`, and final counts showing why $n_b \ge n_a$ or $n_c = n_b + 1$ holds for EVERY derived string.
    - *What to notice:* Counting variables + terminals per rule turns scary GATE grammar puzzles into simple 8th-grade algebra!
    - *Format:* **Trace table**
14. **CFG Simplification Pipeline & CNF Binary Parse Tree (`2n - 1` Steps)**
    - *What to draw:* 4-step pipeline showing *Non-generating first -> Unreachable second* (with a red warning showing why reversing the order leaves dead trash behind!), plus a CNF binary tree of 4 leaves showing `3` internal binary splits (`n - 1`) + `4` leaf rules (`n`) = `7` steps (`2n - 1`).
    - *What to notice:* Why removing non-generating variables BEFORE unreachable ones matters, and why EVERY binary tree with $n$ leaves has $n - 1$ internal nodes (`2n - 1` steps).
    - *Format:* **Step-by-step series of pictures**
15. **PDA Architecture & Non-Deterministic Midpoint Guessing (`ww^R`)**
    - *What to draw:* A finite control box with an input tape on top and a vertical stack cylinder (`A, B, ⊥`) at the bottom, tracing `{0110}` splitting into parallel guesses at index 1 (dies!), index 2 (pushes `0,1`, pops `1,0` -> accepts!), and index 3 (dies!).
    - *What to notice:* Unlike a DFA, an NPDA can blindly guess "now I reached the middle!" using $\epsilon$-transitions — which a DPDA CANNOT do!
    - *Format:* **Step-by-step series of pictures**

### Ch 04 · Context-Free Languages: Closure, Pumping Lemma & Chomsky Hierarchy
16. **Nested Arcs (CFL) vs Crossing Arcs (Non-CFL) for Counters**
    - *What to draw:* Strings `a^i b^j c^k d^l` with curved matching arcs drawn above the string: `i=l & j=k` has **nested arcs** (valid stack LIFO!), `i+j=k+l` has nested arcs (push `a,b`, pop `c,d`), while `i=k & j=l` has **crossing arcs** (`a-c` crosses `b-d` -> impossible on 1 stack!).
    - *What to notice:* A stack can ONLY match symbols in Last-In-First-Out nested arcs (or net sum `i - j + k - l = 0`), NEVER crossing matches!
    - *Format:* **Single picture**
17. **CFL Pumping Lemma Parse Tree (`u v^i w x^i y`)**
    - *What to draw:* A tall parse tree where path root -> leaf repeats variable `A` twice (`A` above `A`), splitting string into `u`, `v` (left wing), `w` (middle), `x` (right wing), `y`, then showing `i = 0` cutting out `v, x` and `i = 2` splicing an extra `v, x` copy — plus a sliding window of width `|vwx| <= p` failing to reach all 3 blocks of `a^p b^p c^p`!
    - *What to notice:* `v` and `x` pump *together* (`v^i` and `x^i`), and because `|vwx| <= p`, `vwx` can touch at most TWO adjacent letter groups (`a` and `b`, or `b` and `c`), never both `a` and `c`!
    - *Format:* **Step-by-step series of pictures**
18. **PDA × DFA Product Construction (`CFL ∩ Regular = CFL`) & CYK Pyramid**
    - *What to draw:* A PDA box wired to a DFA box advancing synchronously on each input letter (proving `CFL ∩ Regular` only needs ONE stack!), next to a $4 \times 4$ bottom-up triangular CYK table filling substrings of length 1, 2, 3, 4.
    - *What to notice:* Intersecting a PDA with a DFA still uses just ONE stack (so it stays CFL), whereas intersecting two PDAs needs TWO stacks (breaking out of CFL!).
    - *Format:* **Single picture** + **Trace table**
19. **The 4-Ring Chomsky Hierarchy & Closure Map**
    - *What to draw:* Four nested boxes (`Type 3 Regular / FA` $\subset$ `DCFL / DPDA` $\subset$ `Type 2 CFL / NPDA` $\subset$ `Type 1 CSL / LBA` $\subset$ `Type 0 RE / TM`), each labelled with grammar restriction, machine memory, and example language (`a^*b^*`, `a^n b^n`, `ww^R`, `a^n b^n c^n`, $H_{\text{TM}}$).
    - *What to notice:* Memory goes: none (FA) -> 1 stack (PDA) -> bounded tape (LBA) -> infinite tape (TM).
    - *Format:* **Single picture**

### Ch 05 · Turing Machines & Recursive vs RE
20. **TM Tape Mechanics & `a^n b^n c^n` Marking Frames**
    - *What to draw:* Infinite tape cells `[a][a][b][b][c][c][#][#]...` with movable R/W head arrow, traced across frames turning `a -> X`, sweeping right to turn `b -> Y`, sweeping right to turn `c -> Z`, and sweeping back left!
    - *What to notice:* Unlike a PDA (destroys stack on read, moves 1-way), a TM moves BOTH left and right and overwrites tape cells as permanent scratchpad.
    - *Format:* **Step-by-step series of pictures** + **Trace table**
21. **Decider (2 Exits) vs Recognizer (3 Exits) & Parallel Dovetailing**
    - *What to draw:* Left: Decider box always halting at `YES` or `NO` vs Recognizer box having a 3rd `SPIN FOREVER` trapdoor! Right: Dovetailing timeline alternating Step 1 of $M_1$, Step 1 of $M_2$, Step 2 of $M_1$, Step 2 of $M_2$ (showing why running $M_1$ completely before $M_2$ would hang forever if $M_1$ loops!).
    - *What to notice:* Why `L_1 U L_2` for RE MUST run $M_1$ and $M_2$ in parallel (dovetailing), and why Post's Theorem runs $M$ and $\overline{M}$ in parallel!
    - *Format:* **Single picture** + **Step-by-step series of pictures**
22. **Complete Universe of Languages Onion Map (Including Co-RE!)**
    - *What to draw:* Nested Venn diagram showing `Regular ⊂ DCFL ⊂ CFL ⊂ CSL ⊂ Recursive`, sitting inside the overlap of TWO overlapping ovals: `RE` (left) and `Co-RE` (right) — with `Recursive = RE ∩ Co-RE` in the intersection, $A_{\text{TM}}, H_{\text{TM}}$ inside `RE \ Rec`, $\overline{A_{\text{TM}}}, E_{\text{TM}}$ inside `Co-RE \ Rec`, and $EQ_{\text{TM}}, ALL_{\text{TM}}$ OUTSIDE both ovals!
    - *What to notice:* You immediately see why complement flips `RE \ Rec` into `Co-RE \ Rec` while leaving `Recursive` untouched!
    - *Format:* **Single picture**

### Ch 06 · Undecidability, Reductions, Rice's Theorem & PCP
23. **Universal TM & Self-Reference Paradox (`HaltChecker` Fails on Itself)**
    - *What to draw:* A black-box machine `H(<M>, w)` claiming to decide halting -> wrap it in a cheeky `Paradox(P)` box that asks `H(P, P)` and does the EXACT OPPOSITE (`if H says Halt -> loop forever; if H says Loop -> halt!`) -> feed `Paradox` its own code!
    - *What to notice:* No mysterious math — it is the exact "this sentence is a lie" contradiction on programs!
    - *Format:* **Step-by-step series of pictures**
24. **Mapping Reduction Direction (`Known Hard A <=_m Unknown B`)**
    - *What to draw:* An adapter/translator box taking instance `x` of known undecidable $A$ (e.g. $A_{\text{TM}}$) and converting it into a special TM $M'$ fed into imaginary decider $D_B$ for problem $B$: if $D_B$ existed, $D_B$ + translator would solve $A$ (IMPOSSIBLE!). Put a big red `X` over reducing the *wrong way* ($B \le_m A$).
    - *What to notice:* To prove $B$ is HARD, reduce FROM a known hard problem $A$ INTO $B$, never from $B$ into $A$!
    - *Format:* **Single picture**
25. **Rice's Theorem 2-Gate Flowchart & Bounded-Horizon Tape Picture**
    - *What to draw:* Left: 2-question flowchart: Q1 "Does property depend ONLY on language $L(M)$, NOT on states/steps/code?" (No -> Check directly, maybe decidable!) -> Q2 "Is it non-trivial (some RE yes, some RE no)?" (Yes -> UNDECIDABLE!). Right: A TM tape running 100 steps showing head NEVER reaches past cell 101, so all strings longer than 101 look identical for the first 100 steps!
    - *What to notice:* Why `L(M) = empty` is undecidable (about $L(M)$), while `M takes > 100 steps` is DECIDABLE (about $M$'s steps, bounded horizon!).
    - *Format:* **Single picture**
26. **PCP Dominoes & Master Decidability Cheat Matrix**
    - *What to draw:* Top/bottom string dominoes sliding together until concatenated top string matches bottom string (and a dead-end mismatch), followed by the master grid (`DFA | CFG/PDA | LBA | TM` vs `Membership | Emptiness | Finiteness | Universality | Equivalence | Regularity`).
    - *What to notice:* Notice the dramatic "Red Waterfall": almost everything is Green for DFAs, splits down the middle for CFGs, and turns almost entirely Red for TMs!
    - *Format:* **Single picture**

---

## PART 5. THE FULL PLAN, CHAPTER BY CHAPTER

*(Starting with Chapter 00 below; continuing from Chapter 01 on the next turn so every chapter gets full, un-shortened depth.)*

### Chapter 00 · Mathematical & Language Foundations *(New Chapter — Prerequisite for Entire Book)*

#### Lesson 00.1 · Alphabets, Strings, Languages, and the Empty Trio (`\epsilon`, `{\epsilon}`, `\emptyset`)
- **Tag:** `[MUST]` — Zero-level student gets stuck on almost every TOC question without knowing string vs set vs empty set rules.
- **Estimated reading time:** 45 minutes.
- **Prerequisites:** None (Class 8 sets).
- **Beginner must-see:** An alphabet $\Sigma$ is like a keyboard of allowed keys; a string $w$ is one typed word; a language $L$ is a *set* (box) of allowed words; `\epsilon` is a blank string (length 0), `{\epsilon}` is a box holding 1 blank string, and `\emptyset` is an empty box holding 0 strings!
- **Finer points:**
  - String concatenation, powers $w^k$, $w^0 = \epsilon$, reversal $(uv)^R = v^R u^R$.
  - Prefix, suffix, substring (proper vs improper; count of substrings of string of length $n$ with distinct chars = $\frac{n(n+1)}{2} + 1$).
  - Language operations: $L_1 \cdot L_2$, $L \cdot \emptyset = \emptyset$ vs $L \cdot \{\epsilon\} = L$, $\emptyset^* = \{\epsilon\}$ vs $\emptyset^+ = \emptyset$, $(L^*)^* = L^*$.
  - **Order of a language:** smallest $k$ such that $L^k = L^{k+1}$ (`2018_FN_Q62`), when $L$ has $\epsilon$ vs doesn't have $\epsilon$.
  - $\Sigma^*$ includes $\epsilon$; $\Sigma^+ = \Sigma^* - \{\epsilon\}$.
- **GATE-level items:** Simplifying expressions involving $\emptyset$, $\{\epsilon\}$, $L^*$; computing $L^0, L^1, L^2, \dots$ and order $k$ of a finite/infinite language.
- **Diagrams needed:** `COMPARE` / `MEMORY`-style box for the Empty Trio (`\emptyset` vs `{\epsilon}` vs `\epsilon`); `ARRAY`-style character tape showing prefixes, suffixes, substrings, and $w^R$.
- **Hand traces:** Computing $L_1 \cdot L_2$ for small sets (`{a, \epsilon} · {b, ab}`); computing $L^0, L^1, L^2, L^3$ for $L = \{00, 000\}$ to find order $k$.
- **Common mistakes:** Writing $L \cdot \emptyset = L$; assuming $\emptyset^* = \emptyset$; confusing `\epsilon` (element) with `{\epsilon}` (set); forgetting substrings include `\epsilon`.

#### Lesson 00.2 · Sets, Equivalence Classes, Pigeonhole Principle & Countability
- **Tag:** `[MUST]` — Directly unlocks DFA Minimization (`Ch 01`), Pumping Lemma (`Ch 02`), and why non-RE languages must exist (`Ch 06`, `2019_FN_Q50`, `2021_AN_Q23`).
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 00.1.
- **Beginner must-see:**
  - **Equivalence classes:** sorting an infinite pile of strings into a finite number of buckets based on a shared rule (like sorting all numbers by remainder mod 3 into 3 buckets!).
  - **Pigeonhole Principle:** if 6 pigeons sit in 5 holes, at least one hole has 2+ pigeons (why long walks on a small machine MUST revisit a state!).
  - **Countable vs Uncountable:** infinite sets are NOT all the same size — you can number all finite strings $1, 2, 3, \dots$ (`countable`), yet you can NEVER number all subsets/languages (`uncountable`!).
- **Finer points:**
  - Reflexive, symmetric, transitive relations partitioning $\Sigma^*$ into disjoint equivalence classes; finite index vs infinite index.
  - Countability of: $\mathbb{N}$, $\Sigma^*$ (canonical length-lexicographic enumeration!), set of all valid C programs, set of all DFAs, set of all CFGs, set of all TMs ($\aleph_0$).
  - Uncountability of: power set $2^{\Sigma^*}$ (all languages over $\{0,1\}$), set of all non-regular languages, set of all non-RE languages ($2^{\aleph_0}$).
  - Union of two countable sets is countable; removing a countable subset from an uncountable set leaves an uncountable set (`2019_FN_Q50`, `2021_AN_Q23`!).
- **GATE-level items:** Identifying countable vs uncountable collections of languages/programs; proving an infinite regular language always has an undecidable subset (`2021_AN_Q23`).
- **Diagrams needed:** `MEMORY`-bucket diagram sorting $\{0,1\}^*$ into mod-3 equivalence buckets; Pigeonhole boxes; `TRACE`/grid diagram of Cantor's diagonalization flipping diagonal bits.
- **Hand traces:** Listing first 10 strings of $\{0,1\}^*$ in canonical order; executing 4 steps of Cantor's diagonalization on a sample 4-row table; checking equivalence classes for `{ends in 0}`.
- **Common mistakes:** Thinking "infinite" always means "uncountable"; thinking the set of all TMs or C programs is uncountable because there are infinitely many; thinking a subset of a regular/RE language must be regular/RE (`2021_AN_Q23`, `2022_FN_Q23`).

---

`CONTINUE FROM CHAPTER 01`

## PART 5 (Continued) · Chapters 01 to 04

### Chapter 01 · Finite Automata & Regular Expressions

#### Lesson 01.1 · Deterministic Finite Automata (DFA): State-Memory Game & Core Design Patterns
- **Tag:** `[MUST]` — Foundation of TOC; appears in almost every single GATE paper (`2025_AN_Q60`, `2023_FN_Q63`, `2017_AN_Q15`, `2017_FN_Q23`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Chapter 00 (alphabets, strings, `\emptyset` vs `{\epsilon}`).
- **Beginner must-see:** A DFA is a simple board game with circles (states) and one-way arrows (transitions). A "state" is NOT magic — it is just the machine's tiny memory note of what happened so far (like "remainder is 2" or "last letter was `0`"). Every circle MUST have **exactly one outgoing arrow for every key on the keyboard** (missing arrows go to a red Dead/Trap state!).
- **Finer points:**
  - Formal 5-tuple $(Q, \Sigma, \delta, q_0, F)$ explained in plain English after drawing the game.
  - Extended transition function $\hat{\delta}(q, w)$.
  - Boundary DFAs: `L = \emptyset` (1 state, non-final), `L = \Sigma^*` (1 state, final), `L = {\epsilon}` (**2 states** in a complete DFA — start state is final, every symbol jumps to dead state!).
  - Complete vs incomplete DFA (why leaving out arrows breaks complementation later).
  - The 5 GATE DFA Design Families:
    1. Ends-with / Last-$k$ symbols (`2017_FN_Q23`).
    2. Contains substring vs Does NOT contain substring (`2023_FN_Q63`).
    3. Positional / Fixed-length (`2017_AN_Q15`: `|w1| = 2, |w2| >= 3`).
    4. Counting mod $k$ (count of `a` mod $k$).
    5. Binary/base-$b$ number divisibility mod $k$ (and product mod $7$, `2025_AN_Q60`, skipping zero/non-coprime traps!).
- **GATE-level items:** Exact minimum state count formulas for "starts with / ends with $k$ symbols", "divisible by $k$", "does not contain `111` (`k+1` states)" (`2023_FN_Q63`), and multiplicative mod-$p$ states (`2025_AN_Q60`).
- **Diagrams needed:** `GRAPHPIC` (DFA with thought-bubble labels inside states + Dead state highlighted in red); `FRAMES` (tracing input `01011` moving the token step-by-step); `GRAPHPIC` (mod-3 binary remainder wheel using `new = (2*old + bit) mod 3`).
- **Hand traces:** Tracing `0110` on "no `111`"; tracing `124` on `prod(x) mod 7` (`2025_AN_Q60`); building complete DFA for `{\epsilon}`.
- **Common mistakes:** Forgetting the dead/trap state (`{\epsilon}` takes 2 states, not 1!); thinking `starts with` needs fewer/same states as `ends with`; starting `prod(\epsilon)` at `0` instead of `1` (`2025_AN_Q60`).

#### Lesson 01.2 · Complementation & Product DFA Construction (`L1 ∩ L2`, `L1 ∪ L2`, `L1 - L2`)
- **Tag:** `[MUST]` — Turns multi-condition GATE DFA questions (`2020_FN_Q41`, `2025_AN_Q52`, `2021_AN_Q12`) into mechanical grid building.
- **Estimated reading time:** 50 minutes.
- **Prerequisites:** Lesson 01.1.
- **Beginner must-see:** To reject everything a DFA accepts (and accept what it rejects), you just swap double-circles and single-circles — **ONLY if the DFA is complete (has trap states drawn!)**. And to enforce TWO rules at once (like "even `a`s AND not divisible by 3 `a`s"), run two tiny machines side-by-side by gluing their states into pairs `(p, q)`.
- **Finer points:**
  - Why flipping final <-> non-final keeps exact same number of minimal DFA states (`2021_AN_Q12`: `|\Sigma^* - L| = |L|`).
  - Why flipping final states **FAILS on an incomplete DFA** and **FAILS completely on an NFA**.
  - Product DFA $(Q_1 \times Q_2, \Sigma, \delta, (q_{01}, q_{02}), F')$ where $F'$ picks:
    - Intersection: $p \in F_1 \text{ and } q \in F_2$
    - Union: $p \in F_1 \text{ or } q \in F_2$
    - Difference ($L_1 - L_2$): $p \in F_1 \text{ and } q \notin F_2$
    - Symmetric Difference: $p \in F_1 \oplus q \in F_2$
  - Reachability check: product DFA can have at most $|Q_1| \cdot |Q_2|$ states, sometimes fewer are reachable or distinguishable.
- **GATE-level items:** Minimal states for Boolean combinations (`divisible by 2 AND NOT by 3`, `2020_FN_Q41`; modular counts on multiple letters `#a mod 7` and `#b mod 9`, `2025_AN_Q52(C)`); why union/concatenation can shrink or blow up minimal state counts (`2021_AN_Q12`).
- **Diagrams needed:** `COMPARE` (flipping complete DFA vs failing on incomplete DFA/NFA); `GRAPHPIC` + `MATRIX` ($2 \times 3$ product grid for mod-2 × mod-3 with `(0,1)` and `(0,2)` highlighted).
- **Hand traces:** Constructing full 6-state product DFA for `2020_FN_Q41` and tracing `aaabaa`; testing `L = {01}` vs `L \cup {01}` showing state count changes while complement preserves state count (`2021_AN_Q12`).
- **Common mistakes:** Trying to complement an NFA by flipping accepting circles; assuming product DFA is always already minimal without checking unreachable or equivalent pairs; picking $F_1 \cap F_2$ when question says "NOT divisible by 3".

#### Lesson 01.3 · NFA, $\epsilon$-NFA, $\epsilon$-Closure & Subset Construction
- **Tag:** `[MUST]` — Tested directly (`2026_FN_Q26`, `2025_FN_Q28`, `2018_FN_Q16`, `2017_AN_Q40`) and required for Regex conversions.
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 01.1.
- **Beginner must-see:** An NFA is a machine that is allowed to **clone itself at a fork** (or vanish at a dead end!), and an $\epsilon$-NFA can even **teleport for free** without reading a letter! As long as *at least one* clone ends in a double-circle when the word finishes, the word is accepted.
- **Finer points:**
  - Formal NFA vs $\epsilon$-NFA ($\delta: Q \times (\Sigma \cup \{\epsilon\}) \to 2^Q$).
  - Step-by-step **$\epsilon$-closure$(S)$** and computing $\hat{\delta}(q, w)$ (`2017_AN_Q40`: compute $\epsilon$-closure *before* and *after* reading each symbol!).
  - Subset Construction (NFA -> DFA): each DFA state is a *set* of NFA states; empty set $\emptyset$ becomes the DFA dead state!
  - **The $2^n$ State Bound (`2026_FN_Q26`, `2025_FN_Q28`, `2018_FN_Q16`):** An $n$-state NFA always has an equivalent DFA with $\le 2^n$ states, so its minimal DFA MUST satisfy $1 \le k \le 2^n$ (never $2^n + 1$!).
  - Can a minimal DFA have FEWER states than an NFA? YES (a bloated NFA with redundant states can minimize to a 1-state DFA)! Can it reach $2^n$? YES ("$n$-th character from the end is `1`").
- **GATE-level items:** Exact $\hat{\delta}(q_2, aba)$ trace on an $\epsilon$-NFA transition table (`2017_AN_Q40`); distinguishing possible vs impossible minimal DFA sizes for an $n$-state NFA (`2026_FN_Q26`, `2025_FN_Q28`).
- **Diagrams needed:** `TREE`/`GRAPHPIC` (clone-splitting execution tree on string `011` + $\epsilon$-closure cloud circles); `TRACE` (subset construction table creating `{q0}`, `{q0,q1}`, ...).
- **Hand traces:** Computing $\hat{\delta}(q_2, aba)$ step by step; converting "ends in `01`" 3-state NFA to DFA via subset construction; building the $2^n$-state worst-case witness ("3rd from last is `1`").
- **Common mistakes:** Forgetting to apply $\epsilon$-closure *after* the transition (or *before* the first symbol); forgetting $\emptyset$ as a valid reachable DFA state; thinking minimal DFA ALWAYS has $\ge n$ states or ALWAYS has $2^n$ states (`2025_FN_Q28`).

#### Lesson 01.4 · DFA Minimization & Myhill-Nerode Theorem
- **Tag:** `[MUST]` — High-yield NAT/MSQ generator (`2025_AN_Q60`, `2024_FN_Q36`, `2020_FN_Q41`, `2019_FN_Q59`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 00.2 (equivalence classes), Lesson 01.1, Lesson 01.2.
- **Beginner must-see:** Two states are "twins" (indistinguishable) if NO future string can ever tell them apart (they either BOTH accept or BOTH reject every possible ending `z`). Merging all twins and throwing away unreachable garbage gives the one-and-only smallest DFA!
- **Finer points:**
  - **Step 0 (Mandatory!):** Remove all unreachable states from $q_0$ via BFS/DFS FIRST.
  - **Table-Filling / Partition Refinement ($0$-equiv, $1$-equiv, $k$-equiv):**
    - $p$ and $q$ are $0$-distinguishable if one is Final and one is Non-Final.
    - $p$ and $q$ are $(k+1)$-distinguishable if some single letter `a` sends them to $k$-distinguishable states ($\delta(p, a), \delta(q, a)$ marked!) (`2024_FN_Q36`).
  - **Myhill-Nerode Theorem:** $x \equiv_L y \iff \forall z \in \Sigma^* (xz \in L \leftrightarrow yz \in L)$. Number of minimal DFA states = exact number of equivalence classes of $\equiv_L$!
  - Uniqueness of minimal DFA up to state-renaming (isomorphism).
  - **Group / Permutation DFAs (`2019_FN_Q59`, `2025_AN_Q60`):** When transitions act like a group (bijections $S_5$ or multiplication mod prime 7), every reachable state behaves distinctly under composition (`id` separates any two distinct elements $g_1 \neq g_2$ via $g_1^{-1}$!).
- **GATE-level items:** Marking distinguishable vs equivalent state pairs (`2024_FN_Q36`); counting Myhill-Nerode classes for tricky languages (`2025_AN_Q60`, `2019_FN_Q59`).
- **Diagrams needed:** `FRAMES` + `MATRIX` (triangular distinguishability table filled Round 0, Round 1, Round 2 with red X marks); `COMPARE` (equivalence classes sorting strings into minimal DFA circles).
- **Hand traces:** Minimizing a 6-state DFA with 1 unreachable state + 2 equivalent states using both partition refinement and table-filling; proving 6 states are distinguishable in `2025_AN_Q60`.
- **Common mistakes:** Forgetting to remove unreachable states before counting minimal states; thinking two non-final states can never be distinguished; thinking a cyclic transition always uses all states without checking if two states have identical accept futures.

#### Lesson 01.5 · Regular Expressions, Identities & FA ↔ Regex Conversions
- **Tag:** `[MUST]` — Every year tests FA-to-Regex, Regex-to-NFA, or counting strings in a Regex (`2024_AN_Q34`, `2024_AN_Q55`, `2024_FN_Q63`, `2024_AN_Q38`, `2023_FN_Q14`, `2023_FN_Q19`, `2022_FN_Q12`, `2021_AN_Q51`, `2020_FN_Q22`).
- **Estimated reading time:** 90 minutes.
- **Prerequisites:** Lesson 00.1, Lesson 01.3.
- **Beginner must-see:** A Regular Expression is just a compact formula (using `+` for OR, `.` for THEN, `*` for 0-or-more-times) that builds the exact same languages as DFAs and NFAs!
- **Finer points:**
  - Precedence: Kleene Star `*` (highest) -> Concatenation `.` -> Union `+` (lowest).
  - Identities: `R + \emptyset = R`, `R \cdot \emptyset = \emptyset`, `R \cdot \epsilon = R`, `\emptyset^* = \epsilon`, `R^* R^* = R^*`, `(R^*)^* = R^*`, `(a + b)^* = (a^* b^*)^* = (a^* + b^*)^*`.
  - **Thompson's Construction (Regex -> $\epsilon$-NFA):** exact rules for `+`, `.`, `*` (`2023_FN_Q19`).
  - **FA -> Regex Method 1: State Elimination** (create fresh single start with $\epsilon$ and fresh single final with $\epsilon$, delete middle states updating $R_{ij} \leftarrow R_{ij} + R_{ik} (R_{kk})^* R_{kj}$).
  - **FA -> Regex Method 2: Arden's Theorem** ($R = Q + RP \implies R = QP^*$ ONLY IF $\epsilon \notin P$!).
  - **Exam Sanity-Check Method:** Testing shortest accepted & rejected edge-case strings (`\epsilon`, `0`, `1`, `01`, `10`, `1111` — catches bugs like the 4 wrong options in `2020_FN_Q22`!).
  - **Counting bounded-length strings (`|w| <= k`)** matching or avoiding a regex (`2024_FN_Q63`, `2024_AN_Q38`) using inclusion-exclusion or building the tiny DFA!
- **GATE-level items:** Solving 3-to-5-state DFAs by State Elimination / Arden (`2021_AN_Q51` binary div by 3, `2024_AN_Q34`, `2022_FN_Q12`); recognizing equivalent regexes; exact string counting up to length 4 or 5 (`2024_FN_Q63`, `2024_AN_Q38`).
- **Diagrams needed:** `FRAMES` (Thompson blocks snapping together for `a(a|b)*`); `FRAMES` (State Elimination removing state `q1` and `q2` step-by-step on binary divisibility by 3!); `FLOW` (regex equivalence & counterexample check).
- **Hand traces:** Converting binary mod-3 DFA into `(0 + 1(01*0)*1)*` (`2021_AN_Q51`) using State Elimination AND Arden's Theorem; counting `|w| <= 5` outside `0*+1*` and `01*+10*` (`2024_FN_Q63`).
- **Common mistakes:** Applying Arden's theorem when $\epsilon \in P$; forgetting `\epsilon` is matched by `R*`; forgetting `0^* + 1^*` shares `\epsilon` (double-counting `\epsilon` in inclusion-exclusion `2024_FN_Q63`!); missing strings like `01` when checking odd-1 regexes (`2020_FN_Q22`).

#### Lesson 01.6 · Regular Grammars (Right/Left-Linear) & Mealy/Moore Machines
- **Tag:** `[SHOULD]` — Completes Kleene's equivalence (FA $\equiv$ Regex $\equiv$ Regular Grammar) and standard FA-with-output syllabus topics.
- **Estimated reading time:** 55 minutes.
- **Prerequisites:** Lesson 01.3.
- **Beginner must-see:** Grammars can also generate regular languages if you only grow strings strictly from the right (`A -> aB`) OR strictly from the left (`A -> Ba`), never both! And Mealy/Moore machines are simple DFAs that print an output bit on every step (like a vending machine or serial adder!).
- **Finer points:**
  - Right-Linear (`A -> xB | x`) and Left-Linear (`A -> Bx | x`) grammars generate ONLY regular languages.
  - Why **mixing** left-linear and right-linear in one grammar (`S -> aA`, `A -> Sb | \epsilon` $\equiv S \to aSb \mid a\epsilon$) breaks regularity into CFL!
  - Converting Right-Linear Grammar <-> NFA directly (each non-terminal is a state; add one final state $Z$).
  - Moore Machine ($\delta: Q \times \Sigma \to Q$, $\lambda: Q \to \Delta$, output length $|w|+1$) vs Mealy Machine ($\lambda: Q \times \Sigma \to \Delta$, output length $|w|$).
  - Converting Moore -> Mealy (same number of states!) vs Mealy -> Moore (at most $|Q| \times |\Delta|$ states — split states that have incoming arrows with different outputs).
- **GATE-level items:** Classifying mixed linear grammars; tracing output string of Mealy vs Moore; max states when converting Mealy to Moore.
- **Diagrams needed:** `GRAPHPIC` (Right-Linear grammar side-by-side with its NFA); `COMPARE` (Mealy arrow-outputs vs Moore circle-outputs reading `0110`); `FRAMES` (splitting a state when converting Mealy to Moore).
- **Hand traces:** Converting `S -> aS | bA, A -> a | \epsilon` to NFA; tracing Mealy/Moore 2's-complementer on `0110`.
- **Common mistakes:** Calling ANY grammar with single non-terminal on RHS "regular" (forgetting `S -> aSb` or mixed `S -> aA, A -> Sb` is CFG, not regular!); forgetting Moore prints an extra symbol at start state (`n+1` length).

---

### Chapter 02 · Regular Languages: Closure, Non-Regularity & Decision Properties

#### Lesson 02.1 · Closure Properties, Extended Operations & Counterexample Traps
- **Tag:** `[MUST]` — Heavily tested every year (`2026_FN_Q51`, `2025_FN_Q44`, `2025_AN_Q30`, `2025_AN_Q52`, `2024_FN_Q16`, `2023_FN_Q24`, `2022_FN_Q47`, `2021_AN_Q23`, `2020_FN_Q19`, `2020_FN_Q60`, `2019_FN_Q30`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 00.2, Lesson 01.2, Lesson 01.5.
- **Beginner must-see:** "Closed under operation X" means: put regular languages into the blender, and a regular language ALWAYS comes out! Wait — going backwards doesn't work: if `L1 U L2` comes out regular, `L1` could STILL be nasty or even undecidable!
- **Finer points:**
  - Standard closures (ALL YES for Regular): Union, Intersection, Complement, Difference, Concatenation, Kleene Star, Reversal ($L^R$: reverse all NFA arrows, swap start & final!).
  - Extended closures (ALL YES for Regular): `Prefix(L)`, `Suffix(L)`, `Substring(L)`, Homomorphism $h(L)$, Inverse Homomorphism $h^{-1}(L)$, Quotient $L_1 / L_2$ (`2019_FN_Q30`!).
  - **Non-closures & Traps:**
    - **NOT closed under infinite union / infinite intersection** (`2020_FN_Q19`: $L = \bigcup_{w \in L} \{w\}$!).
    - **Subsets & Supersets:** Every finite language is regular (`2021_AN_Q23`), yet every infinite regular language contains non-regular and even **undecidable** subsets!
    - **Reverse-closure traps (`2026_FN_Q51`, `2024_FN_Q16`):** If $L_1 \cap L_2$ and $L_2$ are regular, take $L_2 = \emptyset$ and $L_1$ = anything nasty -> $L_1$ need NOT be regular or CFL! If $L_3$ is non-regular, $\overline{L_3}$ MUST be non-regular (since regular IS closed under complement!), whereas $L_1 \cup L_3$ CAN become regular if $L_1 = \Sigma^*$!
    - **Smallest-Piece Collapse Disguises (`2025_FN_Q44`, `2022_FN_Q47`, `2020_FN_Q60`):** Why `{w x w^R | |w|, |x| > 0}` collapses to strings starting & ending with the same char (`|w| = 1`), `{a^n w a^n | n >= 0}` collapses to `\Sigma^*` (`n = 0`!), and `{w x y x | w,x,y \in (0+1)^+}` collapses to `|x| = 1`, making ALL of them regular!
- **GATE-level items:** Rapidly classifying disguised regular sets via smallest-piece collapse; destroying false "always true" closure claims using $\emptyset$, $\Sigma^*$, or non-RE $L_1$.
- **Diagrams needed:** `GRAPHPIC` (DFA surgery for `Prefix(L)` and `Suffix(L)` and $L^R$); `COMPARE` (the Extreme Counterexample Cheat Box: testing `L = \emptyset`, `L = \Sigma^*`, `L = H_TM`).
- **Hand traces:** Testing every option of `2026_FN_Q51` and `2024_FN_Q16` against `L2 = \emptyset` and `L1 = \Sigma^*`; collapsing `2022_FN_Q47` and `2020_FN_Q60` at `|w|=1` / `|x|=1` / `n=0`.
- **Common mistakes:** Falling for `{w x w^R}` thinking palindrome = non-regular (`2022_FN_Q47`); forgetting $n \ge 0$ includes $n = 0$; forgetting `L_1 \cup L_3 = \Sigma^*` when $L_1 = \Sigma^*$; thinking `Prefix(L)` is non-regular.

#### Lesson 02.2 · Pumping Lemma & Myhill-Nerode for Proving Non-Regularity
- **Tag:** `[MUST]` — Needed to prove non-regularity cleanly and solve pumping-length questions (`2019_FN_Q28`, `2025_FN_Q44`, `2025_AN_Q52`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 00.2 (Pigeonhole Principle), Lesson 01.4.
- **Beginner must-see:** Because a DFA only has a finite number of states ($p$), any string longer than $p$ MUST walk around a loop at least once — so you can skip that loop (`i = 0`) or spin it again (`i = 2, 3, ...`) and stay inside the language! If you can find ONE long string where *every* possible loop breaks the rules, NO DFA can exist!
- **Finer points:**
  - The 3 conditions: $|xy| \le p$, $|y| \ge 1$, $\forall i \ge 0 (xy^i z \in L)$.
  - **The Adversarial Game (Quantifier Order):** Opponent chooses $p \implies$ You pick ONE string $w \in L$ with $|w| \ge p$ $\implies$ Opponent splits $w = xyz$ obeying $|xy| \le p, |y| \ge 1$ $\implies$ You pick ONE $i \in \{0, 2, ...\}$ to break $xy^i z \notin L$!
  - **Pumping Lemma is NECESSARY, NOT SUFFICIENT!** (There exist non-regular languages that satisfy the Pumping Lemma!).
  - **Valid Pumping Length questions (`2019_FN_Q28`):** Every finite language has pumping length $p > \text{max length}$ (vacuously true!); periodic regular languages need $p$ large enough to clear transient prefixes and hit the cycle!
  - **Myhill-Nerode Fooling Sets (The Faster Alternative):** Find an infinite list of prefixes $S = \{s_1, s_2, \dots\}$ where every distinct pair $(s_i, s_j)$ is separated by some suffix $z$ ($s_i z \in L, s_j z \notin L$). Works instantly on `{a^p \text{ prime}}` and `{\alpha\beta\alpha}` (`2025_FN_Q44`)!
- **GATE-level items:** Checking valid pumping lengths (`2019_FN_Q28`); spotting why `{a^m b^n c^{m-n}} \cap \{a,b\}^*` (`2025_AN_Q52(B)`) collapses to `{a^n b^n}` (non-regular!).
- **Diagrams needed:** `GRAPHPIC` (DFA loop-on-a-necklace with `i=0` bypass and `i=2` extra spin); `FLOW` (the 4-step Adversarial Game diagram); `MEMORY` (Myhill-Nerode infinite buckets for `a^i b^i`).
- **Hand traces:** Testing $p = 3, 5, 9, 24$ on `2019_FN_Q28` (`b^{10}` kills 3, 5, 9!); proving `{a^n b^n}` and `{a^p}` non-regular via both Pumping Lemma and Myhill-Nerode.
- **Common mistakes:** Picking your own split `x, y, z` instead of letting the adversary pick ANY split with `|xy| <= p`; forgetting to test `i = 0` (pumping down); thinking passing Pumping Lemma proves regularity; forgetting `{a^m b^n c^{m-n}} \cap \{a,b\}^*` forces $m - n = 0 \implies m = n$ (`2025_AN_Q52(B)`!).

#### Lesson 02.3 · Decision Properties of Regular Languages
- **Tag:** `[MUST]` — Core part of decidability questions (`2021_FN_Q37` A & B, `2018_FN_Q46`).
- **Estimated reading time:** 45 minutes.
- **Prerequisites:** Lesson 01.2, Lesson 01.4.
- **Beginner must-see:** Because a DFA is just a finite graph you can inspect with BFS/DFS, EVERY standard question about regular languages ("Does it accept anything?", "Does it accept infinitely many words?", "Do two DFAs accept the exact same language?") can be answered 100% automatically!
- **Finer points:**
  - **Membership ($w \in L$):** $O(|w|)$ on DFA, $O(|Q|^2 |w|)$ on NFA.
  - **Emptiness ($L = \emptyset$):** Graph reachability from $q_0$ to any $q \in F$ ($O(|Q| + |\delta|)$).
  - **Finiteness ($L$ is finite):** Prune dead/unreachable states (states unreachable from $q_0$ or unable to reach $F$), then check for a directed cycle!
  - **Universality ($L(M) = \Sigma^*$):** For a DFA, every reachable state is final (or complement $\overline{L} = \emptyset$); for an NFA/Regex, decidable (though PSPACE-complete, exponential in worst case!).
  - **Equivalence ($L_1 = L_2$) & Subset ($L_1 \subseteq L_2$):** Check emptiness of $(L_1 \oplus L_2)$ or $(L_1 \cap \overline{L_2})$ via Product DFA (or compare minimal DFAs!).
- **GATE-level items:** Knowing why `L(M) = \emptyset` and `L(M) = \Sigma^*` are decidable for BOTH DFAs and NFAs/Regexes (`2021_FN_Q37` A & B).
- **Diagrams needed:** `GRAPHPIC` (Emptiness reachability check + Finiteness cycle-between-$q_0$-and-$F$ check); `COMPARE` (DFA/NFA decision algorithms & time complexities).
- **Hand traces:** Checking finiteness of two DFAs (one with a useless cycle outside final path -> still finite!; one with a cycle on the path to final -> infinite!); checking equivalence of two small DFAs via symmetric difference.
- **Common mistakes:** Thinking ANY cycle anywhere in a DFA makes the language infinite (forgetting a cycle in the dead/trap state doesn't reach $F$!); confusing DFA universality (easy) with PDA universality (undecidable!).

---

### Chapter 03 · Context-Free Grammars & Pushdown Automata

#### Lesson 03.1 · CFGs, Derivations, Parse Trees, Ambiguity & Rule-Accounting Invariants
- **Tag:** `[MUST]` — Directly covers `2026_FN_Q25`, `2026_AN_Q29`, `2026_FN_Q52`, `2024_AN_Q42`, `2017_FN_Q46`.
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 00.1, Lesson 01.6.
- **Beginner must-see:** A Context-Free Grammar is a set of text-expansion rules where one uppercase Variable (`S`) can turn into a pattern containing lowercase letters and MORE variables (even wrapped around itself, like `S -> aSb`!). A Parse Tree draws that family-tree expansion; if ONE string can grow TWO different family-tree shapes, the grammar is **ambiguous**.
- **Finer points:**
  - Leftmost Derivation (LMD), Rightmost Derivation (RMD), Sentential form vs Sentence; **1-to-1 correspondence between LMD, RMD, and Parse Tree!**
  - **Ambiguous Grammar vs Inherently Ambiguous CFL:**
    - Grammar $G$ is ambiguous if $\exists w \in L(G)$ with $\ge 2$ parse trees (equivalently $\ge 2$ LMDs, or $\ge 2$ RMDs).
    - **Crucial trap (`2026_FN_Q25`):** An ambiguous grammar can STILL have strings with only ONE derivation (`abab` in `S -> aSbS | bS | \epsilon` has ONLY 1 RMD, while `abb` has 2!).
    - Classic ambiguous patterns: `E -> E + E | E * E | id`, `S -> aS | Sa | \epsilon`, `S -> SS | ...`, dangling `if-then-else`.
    - Inherently ambiguous language (NO unambiguous grammar exists): `{a^i b^j c^k | i=j or j=k}`.
  - **Rule-Accounting Invariant Method (`2026_FN_Q52`, `2024_AN_Q42`, `2017_FN_Q46`):**
    - Track how every production changes linear combinations like `n_a - n_b` or `n_c - n_b` or `2*n_b - n_a` per non-terminal!
- **GATE-level items:** Proving ambiguity via two distinct trees/LMDs; checking whether a specific string has 1 or 2 derivations inside an ambiguous grammar (`2026_FN_Q25`); deriving exact terminal inequalities (`n_a >= n_b`, `n_c = n_b + 1`, `n_a <= 2*n_b`) (`2026_FN_Q52`, `2024_AN_Q42`, `2017_FN_Q46`).
- **Diagrams needed:** `TREE` (two distinct parse trees for `abb` in `S -> aSbS | bS | \epsilon` + single unique tree for `abab`); `TRACE` (Rule-Accounting table showing `Δa, Δb, ΔA, ΔB` per rule).
- **Hand traces:** Finding ALL derivations of `abb` and `abab` in `2026_FN_Q25`; proving `n_b <= n_a <= 2n_b` in `2026_FN_Q52`; proving `n_c = n_b + 1` in `2024_AN_Q42`.
- **Common mistakes:** Thinking "having both LMD and RMD means ambiguous" (no — every string has one LMD and one RMD for the SAME parse tree!); thinking an ambiguous grammar makes every string ambiguous (`2026_FN_Q25`); guessing terminal counts from 2 test strings instead of checking invariants across ALL rules (`2026_FN_Q52`).

#### Lesson 03.2 · CFG Design, Simplification & Normal Forms (CNF / GNF)
- **Tag:** `[MUST]` — Needed for `2025_FN_Q19`, `2024_FN_Q48`, `2023_FN_Q39`, `2017_FN_Q22`, `2017_AN_Q11`, and CYK (`Ch 04`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 03.1.
- **Beginner must-see:** Messy CFGs can have dead rules (that never turn into lowercase letters, or can never be reached from `S`), empty `\epsilon` loops, and useless chains `A -> B`. Cleaning them up in the exact right order lets us turn ANY CFG into strict **Chomsky Normal Form (CNF)** where every parse tree is a clean binary tree!
- **Finer points:**
  - **CFG Design Patterns:** equal counts (`S -> aSbS | bSaS | \epsilon`), unequal (`n_a != n_b`), palindromes, concatenation (`S -> XY`, `2017_AN_Q11`), independent branches (`2017_FN_Q22`: why `cb^{m_1} cb^{m_2}...` has distinct `m_i` while `(cb^m)^n` would force equal exponents!).
  - **CFG Simplification (EXACT ORDER MATTERS!):**
    1. Remove **non-generating** symbols (can't derive any terminal string).
    2. Remove **non-reachable** symbols (can't be reached from `S`).
    3. Remove **$\epsilon$-productions** (find nullable set, expand subsets; keep `S -> \epsilon` only if `\epsilon \in L`).
    4. Remove **unit productions** (`A -> B`).
  - **Chomsky Normal Form (CNF):** `A -> BC` or `A -> a` (plus `S -> \epsilon` if `\epsilon \in L`, with `S` never on RHS).
    - **Key GATE Formula (`2024_FN_Q48`):** Every derivation of a string $w$ of length $n \ge 1$ in CNF takes **exact length $2n - 1$ steps** ($n - 1$ binary splits + $n$ terminal replacements)!
  - **Greibach Normal Form (GNF):** `A -> a \alpha` ($\alpha \in V^*$); relation to $\epsilon$-free PDA and derivation length $= n$ steps!
  - Left-recursion elimination (`[SHOULD]` quick bridge to Compiler Design).
- **GATE-level items:** Distinguishing independent vs equal exponents in `S -> abScT | abcT` (`2017_FN_Q22`); computing exact CNF derivation length $2n - 1$ (`2024_FN_Q48`); recognizing `a^m b^n (m > n)` (`2017_AN_Q11`) and `a^*(a+b)b^*` (`2023_FN_Q39`).
- **Diagrams needed:** `FRAMES` (4-step CFG cleanup showing why unreachable-before-non-generating leaves garbage!); `TREE` (CNF binary parse tree for length $n = 4$ showing `3` internal nodes + `4` leaves = `7` steps).
- **Hand traces:** Simplifying a 5-rule dirty CFG into CNF; deriving `a^{30} b^{30} c^{30}` (`n = 90` -> `179` steps, `2024_FN_Q48`); expanding 3 levels of `2017_FN_Q22`.
- **Common mistakes:** Removing unreachable symbols *before* non-generating ones; forgetting `S -> aS | bS | ...` or `cb^{m_i}` expands each `T` independently rather than copying one value of `m` (`2017_FN_Q22`); counting $n$ steps instead of $2n - 1$ for CNF (`2024_FN_Q48`).

#### Lesson 03.3 · Pushdown Automata (PDA): Stack Mechanics, Acceptance Modes & NPDA Guessing
- **Tag:** `[MUST]` — Covers `2023_FN_Q40`, `2021_FN_Q18`, and links CFGs to machines.
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 01.3, Lesson 03.1.
- **Beginner must-see:** A PDA is just an NFA given ONE vertical stack of plates! On each step it reads an input letter (or `\epsilon`), looks at AND pops the top plate `X`, and pushes a small pile `\gamma` back on top. Because it is non-deterministic, an NPDA can blindly guess where the middle of a palindrome is!
- **Finer points:**
  - Formal 7-tuple $(Q, \Sigma, \Gamma, \delta, q_0, Z_0 / \perp, F)$.
  - Reading edge label **`a, X / \gamma`** (read `a`, pop `X`, push `\gamma` — note leftmost symbol of `\gamma` ends up on **top** of stack! E.g. `a, \perp / A\perp` keeps `\perp` underneath and `A` on top; `a, X / \epsilon` = pure pop; `a, X / X` = read-only peek without changing stack!).
  - **Acceptance by Final State ($L(P)$) vs Acceptance by Empty Stack ($N(P)$):**
    - For NPDA, both have **exact same expressive power** (equal to CFLs!).
    - Wait: in Empty-Stack acceptance (`2023_FN_Q40`), the stack must become **completely empty** (`\perp` popped too!) right as the entire input finishes!
  - **NPDA guessing (`ww^R`):** $\epsilon$-transition branches at every letter; surviving clone succeeds iff midpoint guess was exact.
  - CFG -> 1-state PDA accepting by empty stack (`[SHOULD]` intuition).
- **GATE-level items:** Reading `c | X / \gamma` PDA diagrams carefully (`2023_FN_Q40`: checking strict `<` vs `<=`, whether `\perp` is popped or stays); counting strings of fixed length $n$ accepted by a PDA (`2021_FN_Q18`).
- **Diagrams needed:** `MEMORY`/`ARRAY` + `GRAPHPIC` (PDA machine diagram with vertical stack changing across transitions); `FRAMES` (NPDA cloning on `0110` guessing midpoint at index 1, 2, 3).
- **Hand traces:** Tracing `a, \perp / A\perp` -> `a, A / AA` -> `b, A / \epsilon` -> `\epsilon, \perp / \epsilon` on `aaabbb` vs `aaabb` vs `aabb`; tracing a DPDA vs NPDA on `{a^n b^n}` and `{ww^R}`.
- **Common mistakes:** Pushing `\gamma` upside-down (forgetting leftmost char of `\gamma` sits on top!); forgetting `\perp` must ALSO be popped for empty-stack acceptance; forgetting a PDA can take `\epsilon` moves even after input ends!

#### Lesson 03.4 · Deterministic PDA (DPDA), DCFLs & Lookahead (`LL(k)`) Intuition
- **Tag:** `[MUST]` — Directly solves `2025_AN_Q24`, `2020_FN_Q24`, `2017_AN_Q38`, and clarifies why DPDA $\neq$ NPDA!
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 03.3.
- **Beginner must-see:** Take away the PDA's "lucky guessing" power (force strictly ONE next move for any state + input/epsilon + stack-top), and you get a **DPDA**! Unlike DFAs (which equal NFAs), DPDAs are **strictly weaker** than NPDAs: they can recognize `wcw^R` (with a middle marker `c`) and `{a^n} \cup {a^n b^n}`, yet NEVER `ww^R` (no marker!).
- **Finer points:**
  - **Determinism Rules for DPDA:** $|\delta(q, a, X)| + |\delta(q, \epsilon, X)| \le 1$ (if an $\epsilon$-move exists for `(q, X)`, NO symbol move is allowed for `(q, X)`!).
  - **Final State vs Empty Stack for DPDA (BIG TRAP!):**
    - Acceptance by Final State gives **ALL DCFLs**.
    - Acceptance by Empty Stack is **strictly weaker** (only **prefix-free** DCFLs — e.g. `{a^n} \cup {a^n b^n}` CANNOT be accepted by empty stack without an end-marker `$`, because after `a^n` empties stack, `b^n` can follow!).
  - **Strictly nested hierarchy (`2025_AN_Q24`):** Regular $\subsetneq$ DCFL $\subsetneq$ CFL!
  - **Key DCFL property:** **Closed under Complement** (unlike CFLs! Careful: must handle infinite $\epsilon$-loops & dead states before flipping!).
  - **Bridge to Parsing (`2020_FN_Q24`):**
    - Why `{a^n \mid n \ge 0} \cup {a^n b^n \mid n \ge 0}` IS a DCFL (DPDA pushes `A` on `a`, accepts if input ends cleanly, else switches to popping on `b`!).
    - Why it is **NOT `LL(k)`** for ANY fixed $k$: a top-down `LL(k)` parser must choose `a^n` vs `a^n b^n` at the *start* seeing only $k$ upcoming `a`'s, which isn't enough when $n > k$! (LR($k$) bottom-up CAN handle ALL DCFLs!).
- **GATE-level items:** Classifying `{wcw^R}`, `{a^n b^n}`, `{a^n} \cup {a^n b^n}`, `{ww^R}`, `{a^n b^n} \cup {a^n b^{2n}}` into Regular / DCFL / Non-deterministic CFL; `LL(k)` vs DCFL (`2020_FN_Q24`).
- **Diagrams needed:** `COMPARE` (NFA == DFA vs NPDA > DPDA power comparison + DPDA Final State > DPDA Empty Stack); `FRAMES` (DPDA handling `{a^n} \cup {a^n b^n}` on `aaa` vs `aaabbb`, contrasting with `LL(2)` getting blindfolded past 2 `a`'s!).
- **Hand traces:** Tracing DPDA on `{a^n} \cup {a^n b^n}` for `aaa`, `aaabbb`, and `aaabb`; testing why `{a^n b^n} \cup {a^n b^{2n}}` fails DPDA (needs nondeterminism to pick 1-pop vs 2-pop!).
- **Common mistakes:** Thinking DPDA = NPDA (just like DFA = NFA); thinking `{a^n} \cup {a^n b^n}` is non-deterministic because it's a union (`2020_FN_Q24`!); assuming every DCFL has an `LL(k)` grammar (`2020_FN_Q24`).

---

### Chapter 04 · Context-Free Languages: Closure, Pumping Lemma & Chomsky Hierarchy

#### Lesson 04.1 · CFL & DCFL Closure Matrix and Multi-Counter Arc Rules
- **Tag:** `[MUST]` — One of the top 3 highest-frequency topics in the bank (`2026_AN_Q48`, `2025_FN_Q45`, `2025_AN_Q30`, `2025_AN_Q52`, `2024_AN_Q54`, `2023_FN_Q24`, `2022_FN_Q48`, `2021_FN_Q19`, `2021_AN_Q54`, `2021_AN_Q18`, `2019_FN_Q39`, `2018_FN_Q45`, `2017_AN_Q24`, `2017_FN_Q40`, `2017_FN_Q50`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 02.1, Lesson 03.4.
- **Beginner must-see:** A CFL machine only has ONE stack! So you can match nested brackets (`(())`) or compare ONE pair of counts at a time, never two independent pairs at once (`a^n b^n c^n`)! And while two CFLs cannot safely intersect (would need 2 stacks!), a **CFL intersected with a Regular language ALWAYS stays CFL** (1 stack + 0 stacks = 1 stack!).
- **Finer points:**
  - **Full Closure Table (Regular vs DCFL vs CFL):**
    - CFL closed under: Union, Concat, Kleene Star, Reversal, Homomorphism, Inverse Homomorphism, **Intersection with Regular**, **CFL $-$ Regular**.
    - CFL NOT closed under: Intersection (`2017_FN_Q50`), Complement (`2025_AN_Q30`), Set Difference, **`Regular - CFL`** (`2021_FN_Q19`: $\Sigma^* - L_2 = \overline{L_2}$!).
    - DCFL closed under: **Complement**, **Intersection with Regular** (`DCFL \cap Reg`), **DCFL $-$ Regular**; NOT closed under Union, Intersection, Concat, Star!
  - **The Nested-Arc vs Crossing-Arc Stack Rule (`2026_AN_Q48`, `2025_FN_Q45`, `2021_AN_Q18`, `2019_FN_Q39`, `2018_FN_Q45`):**
    - `a^i b^j c^k d^l`:
      - `i = l` and `j = k` (nested arcs!) -> Push `a`, push `b`, pop `b` on `c`, pop `a` on `d` -> **CFL**! (`2026_AN_Q48(C)`).
      - `i = k` and `j = l` (crossing arcs!) -> **NOT CFL**! (`2026_AN_Q48(B)`).
      - `i + j = k + l` -> push +1 for `a,b`, pop 1 for `c,d` -> **CFL**! (`2026_AN_Q48(D)`).
      - `i + k = j + l` -> push +1 on `a`, pop on `b` (or track net excess), push on `c`, pop on `d`! Wait: since net change can go negative before rising again (`b`'s before `c`'s), use a stack storing excess `A`s vs `B`s -> **CFL**! (`2026_AN_Q48(A)`, `2018_FN_Q45(I)`).
      - `a^m b^m c^{m+n}` (`2025_FN_Q45`): forces `a=b` AND `#c > #a` simultaneously -> **NOT CFL**! Whereas `a^m b^n c^{m+n}` (`a^m b^n c^n c^m` nested!) -> **CFL**!
  - **Why Complement of Non-CFL CAN Be CFL (`2022_FN_Q48`):**
    - `\overline{\{ww\}}` IS a CFL! (Odd length strings $\cup$ even length strings differing at position $i$ and $i + n$: write as $x a y z b w$ where $|x| = |w|$? Actually any mismatch `|u_1|=|u_2|` shifted around two unequal centers `A B` where `A` generates odd-length strings with char `a` at center and `B` generates odd-length strings with char `b` at center!).
    - `\overline{\{a^n b^n c^n\}}` IS a CFL!
- **GATE-level items:** Solving `a^i b^j c^k d^l` MSQs in 20 seconds using nested arcs & net-stack-counter balance; Boolean algebra expression tricks like `(L1 \cap L2) \cup (\overline{L1} \cap L2) = L2` (`2021_AN_Q54`!); checking `L(G1) \cap L(G2)` (`2017_FN_Q40`).
- **Diagrams needed:** `COMPARE` (Full Regular vs DCFL vs CFL Closure Matrix); `GRAPHPIC` (Nested Arcs vs Crossing Arcs over `a^i b^j c^k d^l`); `GRAPHPIC` (PDA × DFA product proving `CFL ∩ Reg = CFL` with 1 stack); `GRAPHPIC` (`\overline{ww}` split into two independent centered odd-length blocks).
- **Hand traces:** Tracing `a^i b^j c^k d^l` with `i + k = j + l` on an excess-tracking PDA (`aabbbcc -> a(+1),a(+1),b(-1),b(-1),b(-1 -> push B), c(pop B)...`); simplifying all 4 options of `2021_AN_Q54`; tracing `2017_FN_Q40` intersection.
- **Common mistakes:** Forgetting De Morgan's / Boolean simplification (`\overline{\overline{L1} \cup \overline{L2}} = L1 \cap L2`, `2021_AN_Q54(B)`!); thinking `\overline{\{ww\}}` is non-CFL because `{ww}` is non-CFL (`2022_FN_Q48(D)`!); thinking `L_2 \cup (L_2)'` depends on `L_2` being CFL (it's $\Sigma^*$, always regular and CFL! `2021_AN_Q54(C)`!).

#### Lesson 04.2 · CFL Pumping Lemma (and Ogden's Lemma Intuition)
- **Tag:** `[MUST]` — Teaches WHY languages like `{a^n b^n c^n}`, `{ww}`, `{a^{n^2}}`, and `{a^p \text{ prime}}` cannot have CFGs (`2017_AN_Q38`, `2022_FN_Q48`).
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 02.2, Lesson 03.2 (CNF binary tree height intuition).
- **Beginner must-see:** Just like a long string on a DFA repeats a state, a tall parse tree in CNF MUST repeat a variable `A` along a root-to-leaf path! That repeated `A` creates a pair of matching wings (`v` on the left, `x` on the right) that pump up or down **together** inside a narrow window of width `|vwx| <= p`!
- **Finer points:**
  - The 4 conditions: $|vwx| \le p$, $|vx| \ge 1$, $\forall i \ge 0 (u v^i w x^i y \in L)$.
  - Why `|vwx| <= p` is crucial: a window of length $p$ can straddle at most **2 adjacent symbol blocks** in `a^p b^p c^p` (`a` & `b`, or `b` & `c`), NEVER both `a` and `c`!
  - Classic non-CFL proofs: `{a^n b^n c^n}`, `{a^n b^n c^{2n}}` (`2017_AN_Q38`), `{a^{n^2}}`, `{a^p \text{ prime}}`, `{ww | w \in \{a,b\}^*}` (using `a^p b^p a^p b^p`!).
  - **`[LATER]` Note on Ogden's Lemma:** Mention briefly why some weird non-CFLs pass normal Pumping Lemma (`{a^i b^j c^k | i != j or ...}` variants) and how marking distinguished positions solves them.
- **GATE-level items:** Spotting non-CFLs instantly (`prime` lengths, `squares/cubes`, `a^n b^n c^{2n}`, `ww`, `m \cdot n = p + q` multiplication `2018_FN_Q45(IV)`).
- **Diagrams needed:** `TREE` (Parse tree with `S -> uAy -> uvAxy -> uvwxy` showing `i = 0` pruning `v,x` and `i = 2` splicing `v,x`); `ARRAY` (sliding window of length $p$ over `a^p b^p c^p`).
- **Hand traces:** Adversarial Pumping Lemma proof on `a^p b^p c^{2p}` (`2017_AN_Q38`) and on `a^p b^p a^p b^p` for `{ww}`.
- **Common mistakes:** Choosing `a^p b^p` as witness for `{ww}` (wait: `a^p b^p` isn't even in `{ww}`! And `a^p a^p` IS pumpable!); forgetting `v` or `x` alone can be `\epsilon` (`|vx| >= 1`, NOT `|v| >= 1 and |x| >= 1`!); forgetting `|vwx| <= p`!

#### Lesson 04.3 · CFL Decision Properties, CYK Algorithm & Chomsky Hierarchy (CSL / LBA)
- **Tag:** `[MUST]` — Tested repeatedly (`2025_AN_Q25`, `2021_FN_Q37`, `2018_FN_Q46`, `2017_AN_Q60`, `2017_AN_Q38`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 03.2 (CNF), Lesson 04.1.
- **Beginner must-see:** Once grammars gain a stack (CFG/PDA), we LOSE the power to answer "big-picture" questions automatically! We can still check if a CFG generates *any* word (Emptiness) or generates word `w` (CYK), yet checking if it generates **ALL words (`\Sigma^*`)** or if **two CFGs are equal** becomes **IMPOSSIBLE (Undecidable)**!
- **Finer points:**
  - **CYK Algorithm (Membership for CFG):** Requires CNF; bottom-up dynamic programming pyramid filling substrings of length $1..n$ in $O(n^3 |G|)$ time.
  - **CFL Decidable:** Membership ($O(n^3)$), Emptiness (`L(G) = \emptyset`: check if start `S` is generating!), Finiteness (prune useless symbols -> check cycle!).
  - **CFL Undecidable:** Universality (`L(G) = \Sigma^*`, `2021_FN_Q37(D)`, `2017_AN_Q60(III)`), Equivalence (`L(G1) = L(G2)`, `2025_AN_Q25(A)`), `L(G1) = L(R)` (Wait: `L(G1) = L(R)` for general regular `R` is ALSO **UNDECIDABLE** because setting $R = \Sigma^*$ reduces Universality to it! — `2025_AN_Q25(C)`!), Disjointness (`L(G1) \cap L(G2) = \emptyset`, `2025_AN_Q25(B)`), Ambiguity, Regularity of a CFL (`L(G)` regular?).
  - **DCFL Contrast (`[SHOULD]` note):** Equivalence `L(DPDA1) = L(DPDA2)` IS **Decidable** (Sénizergues' theorem), and `L(DPDA) = \Sigma^*` IS Decidable (complement `DPDA` and test emptiness!), and `L(G)` regular for a **DPDA** IS Decidable! (Never confuse general CFG/NPDA with DPDA!).
  - **Chomsky Hierarchy (Types 3 -> 2 -> 1 -> 0) & CSL / LBA:**
    - Type 1 Context-Sensitive Grammar: $|\alpha| \le |\beta|$ (non-contracting, except `S -> \epsilon`); machine = **Linear Bounded Automaton (LBA)** (TM restricted to input tape length!).
    - Classic CSLs (not CFL): `{a^n b^n c^n}`, `{ww}`, `{a^p \text{ prime}}` (`2017_AN_Q38`).
    - CSL Closure: Closed under Union, Intersection, **Complement** (Immerman–Szelepcsényi theorem!), Concat, Kleene Star; LBA Membership is **Decidable**, LBA Emptiness is **Undecidable**!
- **GATE-level items:** Spotting `L(G) = L(R)` as undecidable (`2025_AN_Q25(C)` — sneaky trap because `R` is regular!); distinguishing `L(PDA) = \emptyset` (decidable) from `L(PDA) = \Sigma^*` (undecidable) (`2021_FN_Q37`); classifying `a^p` and `a^n b^n c^{2n}` as recursive/CSL (`2017_AN_Q38`).
- **Diagrams needed:** `MATRIX` (Bottom-up $3 \times 3$ CYK DP table filling `w = aba`); `COMPARE` (4-level Chomsky Hierarchy table + CFL vs DCFL Decidability comparison).
- **Hand traces:** Testing Emptiness of a 4-rule CFG by finding generating variables; filling a 3-letter CYK pyramid; proving why `L(G) = L(R)` is undecidable by substituting `R = \Sigma^*`.
- **Common mistakes:** Thinking `L(G) = L(R)` is decidable because `R` is regular (`2025_AN_Q25(C)`!); mixing up `L(PDA) = \emptyset` (decidable) with `L(PDA) = \Sigma^*` (undecidable) (`2021_FN_Q37` C vs D!); thinking `L_1 \cap L_2 = \emptyset` is decidable when `L_1, L_2` are CFGs (`2025_AN_Q25(B)`!).

---

`CONTINUE FROM CHAPTER 05`

## PART 5 (Continued) · Chapters 05 and 06

### Chapter 05 · Turing Machines, Computability & Language Classes

#### Lesson 05.1 · Turing Machine Mechanics: Tape, Head Moves, IDs & Decider vs Recognizer
- **Tag:** `[MUST]` — Required for understanding `2026_AN_Q13` and every TM/undecidability question in Ch 06.
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Chapter 00, Chapter 03 (PDA concept).
- **Beginner must-see:** Give a finite-state machine an **infinite scratchpad paper tape** where it can walk BOTH left and right and erase/overwrite symbols (`a -> X`), and you get a **Turing Machine (TM)** — literally a tiny mathematical model of a real computer! There is ONE big catch: a TM can say **Yes (Accept)**, say **No (Reject)**, OR **spin in an infinite loop forever**!
- **Finer points:**
  - Formal 7-tuple $(Q, \Sigma, \Gamma, \delta, q_0, q_{\text{accept}}, q_{\text{reject}})$ with blank symbol $\sqcup / B \in \Gamma \setminus \Sigma$ (`q_accept != q_reject`).
  - Transition `(q, X) -> (p, Y, L/R)` and Instantaneous Descriptions (IDs) like `Xq1ab`.
  - **The 3-Outcome Distinction (`2026_AN_Q13`!):**
    - **TM Recognizer (Recursively Enumerable / RE):** Halts and accepts if $w \in L$; if $w \notin L$, may EITHER reject OR **loop forever**!
    - **TM Decider (Recursive):** **ALWAYS halts** on every $w \in \Sigma^*$ — accepts if $w \in L$, rejects if $w \notin L$!
  - Classic TM construction trace: `{a^n b^n c^n}` (zig-zag marking `X, Y, Z`) and `{ww}`.
- **GATE-level items:** Exact definition of "TM $M$ decides $L$" (`2026_AN_Q13`: why "accepts $L$ and rejects $\Sigma^* - L$" implies halting everywhere, whereas "halts on all $\Sigma^*$" alone does NOT mean it decides $L$!).
- **Diagrams needed:** `ARRAY` + `FRAMES` (tape cells `[a][a][b][b][c][c][B]...` with R/W head arrow marking `X, Y, Z` step-by-step); `FLOW` (Decider 2-exit box vs Recognizer 3-exit box with `SPIN FOREVER` trapdoor).
- **Hand traces:** Tracing `{a^n b^n c^n}` on `aabbcc` and invalid `aabbc` via ID sequence; testing all 4 options of `2026_AN_Q13` against a trivial TM that rejects everything.
- **Common mistakes:** Thinking "halts on all inputs" alone means it decides $L$ (`2026_AN_Q13(A)`); thinking a TM only checks input from left to right without going back; forgetting the blank symbol $\sqcup$ sits infinitely to the right (and left if two-way tape).

#### Lesson 05.2 · TM Variants, Computable Functions & Enumerators
- **Tag:** `[MUST]` — Directly solves `2017_FN_Q52` and underpins Church-Turing equivalence.
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 05.1.
- **Beginner must-see:** Giving a TM 2 tapes, 10 tapes, a two-way infinite tape, or non-deterministic cloning adds **ZERO extra power** — a single-tape deterministic TM can simulate all of them! And TMs don't just say Yes/No: they can also compute functions `f(x)` and print out entire infinite lists of words (**Enumerators**)!
- **Finer points:**
  - **TM Variants (ALL equivalent to standard 1-tape TM):** Multi-tape TM, Non-deterministic TM (NTM — simulated via BFS over computation tree so an infinite branch doesn't block an accepting branch!), Stay-option, Semi-infinite vs Doubly-infinite tape.
  - **Does Non-Determinism Add Power?** Compare table: FA (`DFA = NFA`), PDA (`DPDA < NPDA`), LBA (`DLBA ?= NLBA` open), TM (`DTM = NTM`).
  - **TM-Computable Total Functions (`2017_FN_Q52`):** $f: A^* \to B^*$ is computable iff $L_f = \{x \# f(x) \mid x \in A^*\}$ is **Recursive**! (Why? If $L_f$ is recursive, for total $f$, we can enumerate $y \in B^*$ in order and test `x # y \in L_f` until it hits Yes!).
  - **Enumerators:** $L$ is RE $\iff$ some enumerator prints $L$ (in any order, possibly with repeats); $L$ is Recursive $\iff$ some enumerator prints $L$ in **strictly increasing canonical (length-lexicographic) order**!
- **GATE-level items:** Equivalence of computable total function $f$ and recursive graph $L_f$ (`2017_FN_Q52`); power comparisons across DFA/NFA, DPDA/NPDA, DTM/NTM; enumerator characterization of Recursive vs RE.
- **Diagrams needed:** `COMPARE` (Multi-tape & NTM BFS tree simulated on 1-tape TM); `COMPARE` (Power of Non-determinism table across FA, PDA, LBA, TM); `FLOW` (Enumerator printer TM + deriving $f(x)$ from recursive $L_f$).
- **Hand traces:** Tracing how an NTM BFS simulator avoids an infinite left branch to find a shallow accept; checking `2017_FN_Q52` forward and backward directions (`L_f` recursive -> find `f(x)`).
- **Common mistakes:** Thinking NTM is strictly more powerful than DTM (confusing it with NPDA > DPDA!); thinking DFS works to simulate an NTM (DFS can loop forever on branch 1 and miss accepting branch 2!); forgetting `f` must be *total* in `2017_FN_Q52`.

#### Lesson 05.3 · Closure Properties of Recursive & RE Languages, Post's Theorem & The Language Onion Map
- **Tag:** `[MUST]` — High-yield GATE staple (`2023_FN_Q24`, `2022_FN_Q23`, `2018_FN_Q17`, `2017_AN_Q38`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 00.2 (countability), Lesson 05.1.
- **Beginner must-see:** Recursive languages behave nicely under ALL basic operations (including complement: just swap Accept and Reject!). RE languages are tricky: if $M_1$ loops forever, running $M_1$ and then $M_2$ breaks Union — so you have to **time-share (dovetail)** them step-by-step! And if BOTH $L$ and $\overline{L}$ are RE, running both recognizers side-by-side gives a Decider!
- **Finer points:**
  - **Recursive Closure (ALL YES):** Union, Intersection, Complement, Difference, Concat, Kleene Star, Reversal, Homomorphism? (**WAIT — TRAP!** Recursive is **NOT closed under arbitrary Homomorphism**, only under $\epsilon$-free homomorphism! Because erasing characters via $h(x) = \epsilon$ can encode an unbounded witness search — collapsing RE down into $h(\text{Recursive}) = \text{RE}$!!).
  - **RE Closure:** Closed under Union (dovetailing!), Intersection (`2023_FN_Q24(D)`, `2018_FN_Q17(B)` — run $M_1$ then $M_2$ sequentially!), Concat, Star, Reversal, Homomorphism, Inverse Homomorphism. **NOT closed under Complement or Difference**!
  - **Post's Theorem (`2022_FN_Q23(B)`):** $L$ is Recursive $\iff L \in \text{RE}$ AND $\overline{L} \in \text{RE}$! (Run $M_L$ and $M_{\overline{L}}$ via dovetailing: one of them MUST halt and accept!).
  - **Subsets of Recursive/RE (`2022_FN_Q23(A)`):** False! $\Sigma^*$ is regular (hence RE & Recursive), yet contains non-RE subsets!
  - **The Complete Universe of Languages Map:** Regular $\subset$ DCFL $\subset$ CFL $\subset$ CSL $\subset$ Recursive $= (\text{RE} \cap \text{Co-RE}) \subset \text{RE}$ (and $\text{Co-RE}$), surrounded by languages outside BOTH RE and Co-RE!
- **GATE-level items:** Recursive vs RE closure matrix (`2023_FN_Q24`, `2018_FN_Q17`); Post's theorem (`2022_FN_Q23`); why `h(Recursive)` can be non-recursive (`[GATE+]`).
- **Diagrams needed:** `TIMELINE` (Parallel Dovetailing alternating 1 step of $M_1$ and 1 step of $M_2$ for $L_1 \cup L_2$ and Post's Theorem); `COMPARE` (Recursive vs RE Closure Table); `CHEATPIC` (Full Onion Map placing `Regular, DCFL, CFL, CSL, Recursive, RE, Co-RE, Neither`).
- **Hand traces:** Tracing Post's Theorem dovetailing on $w \in L$ vs $w \notin L$; testing why sequential `$M_1$ then $M_2$` works for `L1 \cap L2` in RE yet fails for `L1 \cup L2`!
- **Common mistakes:** Thinking Recursive is closed under ALL homomorphisms (`\epsilon`-erasing breaks it!); thinking RE is NOT closed under intersection (`2018_FN_Q17`); thinking every subset of an RE language is recursive (`2022_FN_Q23(A)`).

---

### Chapter 06 · Decidability, Undecidability, Reductions & PCP

#### Lesson 06.1 · Universal TM, Encoding $\langle M \rangle$ & The Halting Problem (Diagonalization)
- **Tag:** `[MUST]` — Foundation of all undecidability (`2019_FN_Q50`, `2017_AN_Q60`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 00.2 (Cantor's diagonalization), Lesson 05.3.
- **Beginner must-see:** You can save ANY Turing Machine's diagram as a binary file $\langle M \rangle$, and build ONE master **Universal TM ($U$)** that acts like a Python interpreter: give it $(\langle M \rangle, w)$ and it simulates $M$ on $w$! That means programs can read OTHER programs — which lets us feed a fake "Halt-Checker" **its own source code** and watch it contradict itself!
- **Finer points:**
  - Encoding $\langle M \rangle$ as string; countability of TMs vs uncountability of languages (`2019_FN_Q50`).
  - $A_{\text{TM}} = \{\langle M, w \rangle \mid M \text{ accepts } w\}$ and $H_{\text{TM}} = \{\langle M, w \rangle \mid M \text{ halts on } w\}$.
  - Why $A_{\text{TM}}$ and $H_{\text{TM}}$ ARE **RE** (Universal TM simulates $M$ on $w$!) yet **NOT Recursive** (Diagonalization proof: construct $D(\langle M \rangle)$ that runs $H(\langle M, \langle M \rangle \rangle)$ and flips the answer -> $D(\langle D \rangle)$ contradicts itself!).
  - Therefore $\overline{A_{\text{TM}}}$ and $\overline{H_{\text{TM}}}$ are **Co-RE and NOT RE** (otherwise by Post's theorem, $A_{\text{TM}}$ would be recursive!).
- **GATE-level items:** Placing $A_{\text{TM}}, H_{\text{TM}}$ in `RE \ Recursive` (`2017_AN_Q60(IV)`) and $\overline{A_{\text{TM}}}, \overline{H_{\text{TM}}}$ in `Co-RE \ Recursive`; distinguishing decidable questions about a fixed finite constant (`2020_FN_Q44` style).
- **Diagrams needed:** `FRAMES` (Universal TM interpreter reading $\langle M \rangle$ and $w$ on tape); `FLOW` (The `Paradox(P)` self-reference contradiction diagram feeding `P` into `P`).
- **Hand traces:** Stepping through $D(\langle D \rangle)$ in both cases (`H` predicts accept -> `D` rejects; `H` predicts reject -> `D` accepts).
- **Common mistakes:** Thinking $A_{\text{TM}}$ is NOT even RE (`A_TM` IS RE; only its complement $\overline{A_{\text{TM}}}$ is non-RE!); confusing "deciding $A_{\text{TM}}$ for ALL inputs $\langle M, w \rangle$" with "checking a single fixed string on a single fixed DFA".

#### Lesson 06.2 · Mapping Reductions ($A \le_m B$) & Placing Problems into `RE` / `Co-RE` / `Neither`
- **Tag:** `[MUST]` — Explains *why* $E_{\text{TM}}$, $ALL_{\text{TM}}$, $EQ_{\text{TM}}$, and `L(G)=\Sigma^*` are undecidable (`2022_FN_Q46`, `2021_FN_Q37`, `2018_FN_Q46`, `2017_AN_Q60`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 05.3, Lesson 06.1.
- **Beginner must-see:** If you want to prove a new puzzle $B$ is impossible (undecidable), build a small adapter that transforms a KNOWN impossible puzzle $A$ (like $A_{\text{TM}}$) into $B$! Then if someone claimed they could solve $B$, you could plug in your adapter and solve $A$ — contradiction! **Always reduce KNOWN-HARD $\le_m$ UNKNOWN!**
- **Finer points:**
  - Formal computable reduction $f: \Sigma^* \to \Sigma^*$ where $w \in A \iff f(w) \in B$.
  - **The Golden Rules of Reduction Direction:**
    - If $A \le_m B$ and $B$ is Decidable $\implies A$ is Decidable.
    - Contrapositive: If $A \le_m B$ and $A$ is **Undecidable** $\implies B$ is **Undecidable**!
    - Also: If $A \le_m B$ and $A$ is **Not RE** (e.g. $\overline{A_{\text{TM}}}$) $\implies B$ is **Not RE**!
  - Classic Reductions:
    - $A_{\text{TM}} \le_m H_{\text{TM}}$ (Halting is undecidable).
    - $\overline{A_{\text{TM}}} \le_m E_{\text{TM}}$ (Emptiness $L(M) = \emptyset$ is **Co-RE**, NOT RE, Undecidable! `2020_FN_Q44(L1)`).
    - $A_{\text{TM}} \le_m REG_{\text{TM}}$ (`L(M)` regular is **Neither RE nor Co-RE**, Undecidable! `2022_FN_Q46(B)`, `2018_FN_Q46(II)`).
    - $E_{\text{TM}} \le_m EQ_{\text{TM}}$ (`L(M1) = L(M2)` is **Neither RE nor Co-RE**, Undecidable! `2022_FN_Q46(A)`).
    - How $\overline{A_{\text{TM}}} \le_m ALL_{\text{CFG}}$ (`L(G) = \Sigma^*` for CFG!) via invalid computation histories (`[SHOULD]` intuition explaining `2021_FN_Q37(D)`, `2017_AN_Q60(III)`!).
- **GATE-level items:** Knowing the exact class (`Recursive`, `RE \ Rec`, `Co-RE \ Rec`, `Neither`) of $A_{\text{TM}}, H_{\text{TM}}, E_{\text{TM}}, \overline{E_{\text{TM}}}, ALL_{\text{TM}}, EQ_{\text{TM}}, REG_{\text{TM}}$; spotting wrong-direction reduction traps in MSQs.
- **Diagrams needed:** `FLOW` (Reduction Adapter Box $A \le_m B$ with huge warning on direction); `CHEATPIC` (4-Quadrant Map: `Recursive` | `RE \ Rec` | `Co-RE \ Rec` | `Neither RE nor Co-RE` with all standard TM languages placed inside).
- **Hand traces:** Building the helper machine $M'$ that ignores its input $y$ (or accepts only when $M$ accepts $w$) to reduce $A_{\text{TM}}$ into $E_{\text{TM}}$ and $REG_{\text{TM}}$.
- **Common mistakes:** Reducing $B \le_m A$ instead of $A \le_m B$; assuming $E_{\text{TM}}$ ("is $L(M)=\emptyset$?") is RE (`\overline{E_{\text{TM}}}` is RE, whereas $E_{\text{TM}}$ is Co-RE!).

#### Lesson 06.3 · Rice's Theorem, Bounded-Step Tricks & Post Correspondence Problem (PCP)
- **Tag:** `[MUST]` — Solves 80%+ of GATE's TM undecidability MCQs/MSQs in under 30 seconds (`2022_FN_Q46`, `2021_FN_Q23`, `2020_FN_Q44`, `2018_FN_Q46`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 06.2.
- **Beginner must-see:** Rice's Theorem is a magic shortcut: **ANY interesting Yes/No question about *what language $L(M)$ a Turing Machine accepts* is AUTOMATICALLY UNDECIDABLE!** Wait — it does NOT apply to questions about *the machine's code/steps* (like "does $M$ have 5 states?" or "does $M$ run more than 100 steps?"), which are often **DECIDABLE**!
- **Finer points:**
  - **Rice's Theorem (2 Exact Checks):**
    1. **Semantic (Language-only):** If $L(M_1) = L(M_2)$, both must get the SAME Yes/No answer! (Fails for *"Does $M$ have $\le 10$ states?"*, *"Does $M$ take $> 100$ steps?"*, *"Does $M$ move left on `01`?"*!).
    2. **Non-trivial:** True for at least one RE language AND false for at least one RE language! (Fails for *"Is $L(M)$ context-sensitive or RE?"* — wait: *"Is $L(M)$ RE?"* is ALWAYS YES -> Trivial -> Decidable!).
  - **The Bounded-Step / Finite-Horizon Decidability Trick (`2022_FN_Q46(D)`, `2021_FN_Q23`, `2020_FN_Q44(L2)`):**
    - *"Does $M$ take $> k$ steps on input $w$?"* -> Simulate $M(w)$ for $k+1$ steps -> **Decidable**!
    - *"Does $M$ take $> k$ steps on **some** input?"* / *"on **all** inputs?"* -> In $k$ steps, $M$ can ONLY look at the first $k+1$ tape cells! So test $M$ for $k+1$ steps on ALL finite strings of length $\le k+1$ (finitely many!) -> **BOTH ARE DECIDABLE** (`2021_FN_Q23`!)!
  - **Constant-Language / Single-Answer Trick:** A language containing a fixed 1-bit mathematical truth (even unknown to humans, like "100 consecutive 7s in $\pi$") is finite/trivial -> **Recursive**!
  - **Post Correspondence Problem (PCP) & Modified PCP (`[SHOULD]`):**
    - Domino puzzle (`top / bottom` strings): match top concatenation to bottom concatenation.
    - General PCP over $|\Sigma| \ge 2$ is **Undecidable** (yet RE!); PCP over **unary** alphabet ($|\Sigma| = 1$) IS **Decidable**!
  - **The Complete Master Decidability Matrix:** `DFA/NFA` vs `CFG/PDA` vs `DPDA` vs `LBA` vs `TM` across Membership, Emptiness, Finiteness, Universality, Equivalence, Regularity, Ambiguity (`2025_AN_Q25`, `2021_FN_Q37`, `2018_FN_Q46`, `2017_AN_Q60`).
- **GATE-level items:** Spotting every Rice's Theorem non-example (`> k steps`, `reaches state q in 100 steps`, `has 5 states`, `NFA equivalent to DPDA` `2018_FN_Q46(IV)`); applying the Master Decidability Matrix cleanly.
- **Diagrams needed:** `FLOW` (Rice's Theorem 2-Gate Flowchart); `ARRAY` (Bounded-Horizon TM Tape showing head stops at cell $k+1$); `FRAMES` (PCP domino matching YES & NO examples); `CHEATPIC` (Full Master Decidability Matrix across DFA, CFG/PDA, DPDA, LBA, TM).
- **Hand traces:** Testing 8 properties through Rice's 2-Gate Flowchart (`L(M)=\emptyset`, `|L(M)|>=21`, `L(M) not recursive`, `L(M) is RE`, `M takes > 2021 steps on all/some inputs`, `M has 5 states`); solving a 3-domino PCP instance.
- **Common mistakes:** Applying Rice's theorem to step-count questions (`2022_FN_Q46(D)`, `2021_FN_Q23`, `2020_FN_Q44(L2)`!); thinking `"Is L(M) RE?"` is undecidable (it's trivial -> always TRUE -> decidable!); thinking `"Does M take > 2021 steps on SOME input?"` is undecidable because $\Sigma^*$ is infinite (forgetting bounded horizon!).

---

## PART 6. EVERY PYQ LISTED BELOW (Batch 1: Questions #1 to #39)

*(Re-solved and checked one by one. For the 14 questions where `[IMAGE_...]` is missing from the document, the missing diagram is explicitly flagged.)*

| # | PYQ ID | (a) Ch / Lesson | (b) Exact Concept Tested | (c) Trap / Finer Point | (d) Official Key Check & Working | (e) Transcription Check |
|---|---|---|---|---|---|---|
| 1 | `2026_AN_Q13` | Ch 05 / L05.1 | Definition of TM **deciding** a language $L$. | Option A ("halts on all strings") is necessary but NOT sufficient (could accept wrong strings!). D implies halting everywhere + exact membership. | **CORRECT (D).** Deciding $L$ requires $M$ to halt & accept every $w \in L$ and halt & reject every $w \in \{0,1\}^* - L$. | Clean. |
| 2 | `2026_FN_Q25` | Ch 03 / L03.1 | Grammar ambiguity & unique derivations inside an ambiguous grammar. | Ambiguous grammar doesn't make *every* string ambiguous! `abab` forces $S \to aSbS$ with first `b` as the separator because $S$ cannot derive `ba`. | **CORRECT (A, B, C).** `abb`: two trees ($a(b)b\epsilon$ via $S \to bS$ inside vs $a(\epsilon)b(b\epsilon)$) -> A, B true. `abab`: any string from $S$ must pair every `a` with a later `b`, so `ba` $\notin L(G)$, leaving only $S \Rightarrow a(\epsilon)b(a(\epsilon)b\epsilon)$ -> 1 RMD (C true). CFL membership/language isn't undecidable (D false). | Clean. |
| 3 | `2026_FN_Q26` | Ch 01 / L01.3 | Subset construction state upper bound ($2^n$) for NFA -> minimal DFA. | Minimal DFA of 6-state NFA has $1 \le k \le 2^6 = 64$ states (cannot exceed 64; CAN equal 1 or 32). | **CORRECT (B, D).** $65 > 64$ and $128 > 64$ are impossible; 32 and 1 are $\le 64$. | Clean. |
| 4 | `2026_AN_Q29` | Ch 03 / L03.1 | Identifying ambiguous vs unambiguous CFGs. | `S -> aS \| Sa \| \epsilon` derives `aa` both left-first and right-first; `E -> E+E\|E*E\|id` has 2 trees for `id+id*id`. | **CORRECT (B, C).** A is `{a^n b^n}` (unambiguous); D is `a^*` right-linear (unambiguous); B and C are classic ambiguous CFGs. | Clean. |
| 5 | `2026_AN_Q47` | Ch 01 / L01.1, L01.2 | Reading DFAs from diagram, language intersection & Kleene star. | Checking `D1 \cap D2` and `(D1 \cup D2)^*` edge cases like `\epsilon`. | **CANNOT VERIFY** (Key: C, D). Figure `[IMAGE_Q_47_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_47_1]`). |
| 6 | `2026_AN_Q48` | Ch 04 / L04.1 | Multi-counter CFL vs non-CFL constraints (`a^i b^j c^k d^l`). | Crossing equality `i=k & j=l` fails 1-stack LIFO, whereas `i+k = j+l` uses 1 net stack excess counter! | **CORRECT (A, C, D).** A: push/pop `a` vs `b`, `c` vs `d` via signed excess stack -> CFL. B: crossing -> not CFL. C: nested (`a^i (b^j c^j) d^i`) -> CFL. D: push `a,b`, pop `c,d` -> CFL. | Clean. |
| 7 | `2026_FN_Q51` | Ch 02 / L02.1 | Regular reverse-closure traps (`L_1 \cap L_2` & `L_2` regular). | Setting $L_2 = \emptyset$ makes $L_1 \cap L_2 = \emptyset$ regardless of how uncomputable $L_1$ is! And regular $\implies$ complement regular $\implies$ CFL. | **CORRECT (C).** Take $L_2 = \emptyset, L_1 = H_{\text{TM}}$: eliminates A, B, D. Since $L_2$ is regular, $\overline{L_2}$ is regular $\subset$ CFL (C true). | Clean. |
| 8 | `2026_FN_Q52` | Ch 03 / L03.1 | CFG terminal-count invariants via Rule Accounting. | Must account for fixed terminals in `S` AND `A` plus `>= 1` `(a,b)` pairs from every `B`. | **CORRECT (B, D).** $B \Rightarrow a^k b^k$ ($k \ge 1$). With $r \ge 0$ loops of $A \to aaBBAb$ and 1 exit $A \to bBabaa$, $n_a = K + 2r + 7$, $n_b = K + r + 5$ ($K \ge 2r+2$). Thus $n_a - n_b = r + 2 > 0$ (B true) and $2n_b - n_a = K + 3 \ge 2r + 5 > 0$ (D true). | Clean. |
| 9 | `2025_FN_Q19` | Ch 03 / L03.2 | Language generated by a simple CFG (union of two forms). | `aaB` gives `a^2 b^n`, `Abb` gives `a^n b^2`; NOT `a^n b^{2n}`! | **CORRECT (A).** $A \Rightarrow a^+$, $B \Rightarrow b^+$, $S \Rightarrow aa b^+ \mid a^+ bb$. | Clean. |
| 10 | `2025_AN_Q24` | Ch 03 / L03.4 | DPDA expressive power (`Regular \subset DCFL \subset CFL`). | Unlike DFA=NFA, DPDA < NPDA; every regular language has a DPDA. | **CORRECT (A).** Only Regular languages are guaranteed to be accepted by a DPDA (B, C, D fail on `{ww^R}` or `{a^n b^n c^n}`). | Clean. |
| 11 | `2025_AN_Q25` | Ch 04 / L04.3 | Decision properties of CFGs (`L(G)=L(R)` trap!). | Option C `L(G1) = L(R)` looks tempting because `R` is regular, yet setting $R = \Sigma^*$ reduces Universality (undecidable!) to it! | **CORRECT (D).** A (equivalence), B (disjointness), C (equality to regular) are ALL undecidable for CFGs; D (emptiness) is decidable. | Clean. |
| 12 | `2025_FN_Q28` | Ch 01 / L01.3 | NFA-to-DFA state bounds (asking for **FALSE** statement!). | Watch `"FALSE"` in prompt! Minimal DFA has $\le 2^n$ states, can be $< n$ (e.g. redundant NFA). | **CORRECT (D).** A, B, C are true; D ("Every DFA has $> 2^n$ states") is false. | Clean. |
| 13 | `2025_AN_Q30` | Ch 02, 04, 05 / L04.1, L05.3 | Closure properties matching across CFL, Recursive, Regular (MSQ!). | Both Regular and Recursive are closed under BOTH union and intersection, so two matchings (B and C) are valid! | **CORRECT (B, C).** (i) CFL matches only (b) not closed under complement; (ii) Recursive & (iii) Regular both match (a) and (c) in either assignment! | Clean. |
| 14 | `2025_FN_Q44` | Ch 02 / L02.1, L02.2 | Distinguishing fixed-alphabet $\alpha \in \{a\}^+$ collapse vs full-alphabet $\alpha \in \{a,b\}^+$. | `L2` collapses at `|\alpha|=1` (`a(a+b)^+a`, regular!), while `L1` contains `a b^i a a b^j` for $i \ge j$ (`|\alpha|` forced $> 1$ when ends differ!). | **CORRECT (C).** As shown in Part 2/C05 check: $L_1 \cap a b^+ a a b^+ = \{a b^i a a b^j \mid i \ge j \ge 1\}$ (not regular); $L_2 = a(a+b)^+a$ (regular). | Clean. |
| 15 | `2025_FN_Q45` | Ch 04 / L04.1, L04.2 | Simultaneous equality vs additive exponent CFL (`a^m b^m c^{m+n}` vs `a^m b^n c^{m+n}`). | `m=m` AND `c > m` needs 2 comparisons -> not CFL; `m+n` splits into `c^n c^m` nested inside `a^m b^n` -> CFL! | **CORRECT (C).** $L_1$ fails CFL Pumping Lemma on $a^p b^p c^{2p}$ (Wait: $a^p b^p c^{p+1}$ breaks since $m, n \ge 1$: pick $w = a^p b^p c^{p+1}$? Wait: if window `vwx` touches only `b,c`, pumping down breaks `a=b`; if only `a,b`, pumping up increases $a,b > p$ while $c$ stays $p+1$, breaking $m+n > m$ for $p \ge 1$! Actually $a^p b^p c^{p+1}$ pumped up gives $a^{p+k} b^{p+k} c^{p+1}$ with $p+k > p+1$, invalid!). $L_2$ is CFL (`S -> aSc | T, T -> bTc | bc`). | Clean. |
| 16 | `2025_FN_Q50` | Ch 01 / L01.1 | Interpreting language accepted by a given DFA diagram. | Must trace figure carefully across `bab` transitions. | **CANNOT VERIFY** (Key: C). Figure `[IMAGE_Q_50_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_50_1]`). |
| 17 | `2025_AN_Q52` | Ch 01, 02, 04 / L01.2, L02.2 | Product DFA modular counts & intersection collapse (`a^m b^n c^{m-n} \cap {a,b}^*`). | Option B hides `{a^n b^n}` by forcing `c^0` when intersected with `{a,b}^*`! Option C uses $7 \times 9 = 63$ DFA states. | **CORRECT (A, C).** A: $a^* b^*$ regular. B: equals $\{a^n b^n\}$ (not regular). C: finite product DFA (63 states, regular). D: `#a = #b` (not regular). | Clean. |
| 18 | `2025_AN_Q60` | Ch 01 / L01.1, L01.4 | Minimal DFA states for multiplicative group mod 7 (`prod(x) = 2 mod 7`). | Start state `\epsilon` has `prod = 1` (NOT 0!), residue `0` is unreachable (no `0` or `7` in $\Sigma$), all 6 non-zero states `{1..6}` are reachable & distinguishable! | **CORRECT (6).** States `{1,2,3,4,5,6}` are all reachable (`1,2,3,4, 2*3=6, 3*4=5`) and pairwise separated since $\Sigma^*$ generates every multiplier in $(\mathbb{Z}/7\mathbb{Z})^*$. | Clean. |
| 19 | `2024_AN_Q34` | Ch 01 / L01.5 | Converting a given DFA diagram to an equivalent Regular Expression. | Careful with loop order & empty string `\epsilon`. | **CANNOT VERIFY** (Key: A). Figure `[IMAGE_Q_34_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_34_1]`). |
| 20 | `2024_FN_Q16` | Ch 02 / L02.1 | Regular closure under complement & union with non-regular (`\Sigma^*` counterexample). | `L_1 \cup L_3` CAN be regular if $L_1 = \Sigma^*$; complement of non-regular MUST stay non-regular! | **CORRECT (C, D).** A fails ($L_1=L_2=\Sigma^*$); B fails ($L_1=\Sigma^*$); C true (complement of reg is reg); D true (De Morgan / closure). | Clean. |
| 21 | `2024_AN_Q55` | Ch 01 / L01.5 | Converting a 5-state $\epsilon$-NFA diagram to a Regular Expression. | Trace $\epsilon$-closure at start carefully. | **CANNOT VERIFY** (Key: B). Figure `[IMAGE_Q_55_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_55_1]`). |
| 22 | `2024_FN_Q36` | Ch 01 / L01.4 | Distinguishable state pairs in DFA minimization (asking for **FALSE** statements!). | Watch `"FALSE"`! Check table-filling rounds and `n0 = n1` acceptance. | **CANNOT VERIFY** (Key: B, C). Figure `[IMAGE_Q_36_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_36_1]`). |
| 23 | `2024_AN_Q42` | Ch 03 / L03.1 | CFG terminal-count relations via Rule Accounting. | Don't forget $x = 0$ (`c` has $n_a = 0, n_b = 0$) which breaks $n_a > n_b$! | **CORRECT (B, C).** With $x$ uses of `aS`, $y$ of `aSbS`, $z$ of `c`: $z = y + 1$, so $n_c = n_b + 1$ (C true) and $n_a = x + y \ge y = n_c - 1 > n_c - 2$ (B true). | Clean. |
| 24 | `2024_FN_Q48` | Ch 03 / L03.2 | Exact derivation length in Chomsky Normal Form (`2n - 1` steps). | `V` having 10 variables is irrelevant distractor! Only string length `n = 30+30+30 = 90` matters. | **CORRECT (179).** Any CNF derivation of string length $n \ge 1$ takes $2n - 1 = 2(90) - 1 = 179$ steps. | Clean. |
| 25 | `2024_FN_Q63` | Ch 01 / L01.5 | Counting strings of bounded length (`|w| <= 5`) matching/avoiding Regex. | `0^* + 1^*` shares `\epsilon` (avoid double count!), and for len 1, `0, 1` appear in BOTH `r` and `s`! | **CORRECT (44).** Total len $\le 5$ is $63$. $|(r \cup s)_{\le 5}| = 1(\text{len }0) + 2(\text{len }1) + 4(\text{len }2) + 4 + 4 + 4 = 19$. $63 - 19 = 44$. | Minor typo: `"nor is s"` -> `"nor in s"`. |
| 26 | `2024_AN_Q38` | Ch 01 / L01.5 | Decoding regex (`b^*ab^*(ab^*ab^*)^*` = odd `a`s) + counting strings of length `<= 4`. | `b^* a b^*` matches first `a`, then `(a b^* a b^*)^*` adds pairs of `a`s -> odd count of `a`s! | **CORRECT (15).** Odd-`a` strings for len 0..4: $0 + 1 + 2 + 4 + 8 = 15$. | Clean. |
| 27 | `2023_FN_Q14` | Ch 01 / L01.5 | Finding Regex equivalent to a 4-state DFA diagram. | Watch loop directions around `s, p, q, r`. | **CANNOT VERIFY** (Key: C). Figure `[IMAGE_Q_14_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_14_1]`). |
| 28 | `2023_FN_Q19` | Ch 01 / L01.5 | Thompson-style $\epsilon$-NFA matching `letter (letter \| digit)^*`. | Check empty-loop bypass vs non-empty first letter (`letter` must occur at least once!). | **CANNOT VERIFY** (Key: C). Figures `[IMAGE_Q_19_A..D]` are missing. | **MIS-TRANSCRIPTION:** `[A – Za – a]` should be `[A – Za – z]`. Also **MISSING FIGURES**. |
| 29 | `2023_FN_Q24` | Ch 02, 04, 05 / L02.1, L04.1, L05.3 | Intersection closure across Regular, CFL, Recursive, RE. | Only CFL is NOT closed under intersection; Regular, Recursive, and RE ALL ARE! | **CORRECT (A, C, D).** Standard closure theorem across Chomsky classes. | Clean. |
| 30 | `2023_FN_Q39` | Ch 03 / L03.2 | Language equivalence & recognizing hidden regular language from CFG. | `S -> aSb \| X` looks non-regular because of `aSb`, YET `X` already generates ALL of `a^*(a+b)b^*`, swallowing `aSb`! | **CORRECT (B).** $L(X) = a^*(a+b)b^*$; adding equal `a` on left and `b` on right stays inside $a^*(a+b)b^*$. | Clean. |
| 31 | `2023_FN_Q40` | Ch 03 / L03.3 | Reading PDA transitions `c \| X / \gamma` with empty-stack acceptance. | Check strict `n < m` vs `n <= m` and whether `\perp` is popped. | **CANNOT VERIFY** (Key: A). Figure `[IMAGE_Q_40_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_40_1]`). |
| 32 | `2023_FN_Q63` | Ch 01 / L01.1 | Minimum DFA states for "no `111` substring". | Need 4 states (`0, 1, 2` consecutive trailing 1s + 1 dead state for `3+` 1s), NOT 3! | **CORRECT (4).** Standard avoiding-`1^k` DFA requires $k+1 = 4$ states. | Clean. |
| 33 | `2022_FN_Q12` | Ch 01 / L01.5 | Converting a given FA diagram to Regex. | Handle symmetric `a`/`b` branches cleanly. | **CANNOT VERIFY** (Key: D). Figure `[IMAGE_Q_12]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_12]`). |
| 34 | `2022_FN_Q23` | Ch 04, 05 / L04.1, L05.3 | Post's theorem, subset of RE, CFL complement & DCFL containment. | Every regular language is DCFL (D true!); complement of CFL is recursive (C true!); subsets of RE needn't be recursive (A false). | **CORRECT (B, C, D).** B = Post's Theorem; C: CFL $\subset$ Recursive (closed under complement); D: Regular $\cap$ Regular = Regular $\subset$ DCFL. | Clean. |
| 35 | `2022_FN_Q46` | Ch 06 / L06.2, L06.3 | Undecidability (Rice's theorem vs Bounded-Step decidability). | Option D (`> 1073 steps on every string`) is **DECIDABLE** via bounded tape horizon (test all inputs of len $\le 1074$ for 1074 steps)! | **CORRECT (A, B, C).** A ($EQ_{\text{TM}}$), B ($REG_{\text{TM}}$), C ($ALL_{\text{TM}}$) are all undecidable by Rice/reduction; D is decidable. | Clean. |
| 36 | `2022_FN_Q47` | Ch 02 / L02.1 | Hidden regular languages (`n >= 0` & `|w| = 1` collapse!). | Look closely at $L_1$: $n \ge 0 \implies n = 0 \implies L_1 = \{a,b\}^*$! And $L_2$: $|w| = 1 \implies a(a+b)^+a + b(a+b)^+b$! And Regular $\implies$ CFL, so A, B, AND C are ALL true! | **CORRECT (A, B, C).** Both $L_1, L_2$ are regular, hence also CFL -> A, B, C true; D false. | Clean. |
| 37 | `2022_FN_Q48` | Ch 04 / L04.1, L04.2 | CFL/DCFL classification, non-closure under $\cap$, and `\overline{\{ww\}}` IS CFL! | Watch `"FALSE"`! `\overline{\{ww\}}` IS context-free (D is FALSE!), and `L_2 \cap L_3 = \{a^n b^n c^n\}` is NOT CFL (C is FALSE!). | **CORRECT (B, C, D).** A is true (`L2, L3` are DCFLs); B false (`L2` is CFL); C false (`a^n b^n c^n` not CFL); D false (`\overline{ww}` IS CFL). | Clean. |
| 38 | `2021_FN_Q19` | Ch 04 / L04.1 | `Regular - CFL` non-closure trap (`L_1 - L_2 = L_1 \cap \overline{L_2}`). | Students confuse `CFL - Regular` (ALWAYS CFL!) with `Regular - CFL` (can equal $\overline{L_2}$, NOT always CFL!). | **CORRECT (C).** A, B, D stay CFL; C fails when $L_1 = \Sigma^*$ and $L_2 = \overline{\{a^n b^n c^n\}}$ (wait: $L_2$ = complement of CFL? Take $L_2$ = `\overline{a^n b^n c^n}` which IS CFL, so $\Sigma^* - L_2 = \{a^n b^n c^n\}$ which is NOT CFL!). | Clean. |
| 39 | `2021_AN_Q12` | Ch 01 / L01.2, L01.4 | Operations preserving exact minimal DFA state count ($k$ states). | Complement preserves minimal state count $k$ ALWAYS; union/difference with `{01}` can merge/split classes and change $k$. | **CORRECT (C).** Complete minimal DFA has $k$ Myhill-Nerode classes; complementation keeps the exact same partition of $\Sigma^*$ -> $k$ states. | Clean. |

---

`CONTINUE FROM PART 6 (PYQ #40)`

## PART 6 (Continued) · Batch 2: Questions #40 to #77

| # | PYQ ID | (a) Ch / Lesson | (b) Exact Concept Tested | (c) Trap / Finer Point | (d) Official Key Check & Working | (e) Transcription Check |
|---|---|---|---|---|---|---|
| 40 | `2021_FN_Q37` | Ch 02, 04 / L02.3, L04.3 | Decidability (recursive vs non-recursive) across DFA & PDA emptiness and universality. | Students mix up `L(PDA) = \emptyset` (decidable!) with `L(PDA) = \Sigma^*` (undecidable!). | **CORRECT (D).** Emptiness & Universality of DFA (A, B) and Emptiness of PDA (C) are all recursive/decidable; Universality of PDA (D) is undecidable. | Clean. |
| 41 | `2021_AN_Q54` | Ch 04 / L04.1 | Boolean set expressions combining Regular $L_1$ and CFL $L_2$. | Must simplify De Morgan's & distributive laws BEFORE checking closure! | **CORRECT (B, C, D).** A: $L_1 \cap \overline{L_2}$ can equal $\overline{L_2}$ (non-CFL). B: $\overline{\overline{L_1} \cup \overline{L_2}} = L_1 \cap L_2$ (Reg $\cap$ CFL = CFL). C: $L_1 \cup \Sigma^* = \Sigma^*$ (CFL). D: $(L_1 \cup \overline{L_1}) \cap L_2 = L_2$ (CFL). | Clean. |
| 42 | `2021_AN_Q20` | Ch 01 / L01.1 | Counting accepted strings of fixed length 8 on a given DFA diagram. | Watch trap/self-loops and initial states. | **CANNOT VERIFY** (Key: 256). Figure `[IMAGE_Q_20_1]` is missing. (Note: 256 = $2^8$ implies all length-8 binary strings are accepted). | **MISSING FIGURE** (`[IMAGE_Q_20_1]`). |
| 43 | `2021_AN_Q23` | Ch 00, 02 / L00.2, L02.1 | Countability vs uncountability of subsets of infinite regular languages. | Beginners assume subsets of a regular language are at least decidable! Infinite regular $L$ has $2^{\aleph_0}$ subsets vs $\aleph_0$ deciders! | **CORRECT (C).** Both $S_1$ (infinite countable set has uncountably many subsets, so most are undecidable) and $S_2$ (every finite language is regular) are TRUE. | Clean. |
| 44 | `2021_FN_Q26` | Ch 01 / L01.1 | Identifying minimal DFA accepting strings ending with `011`. | Check self-loops on partial prefixes (`00` stays at saw-`0`, `011` on `0` resets to saw-`0`, not start!). | **CANNOT VERIFY** (Key: D). Figures `[IMAGE_Q_26_A..D]` are missing. | **MISSING FIGURES** (`[IMAGE_Q_26_A..D]`). |
| 45 | `2021_FN_Q23` | Ch 06 / L06.3 | Bounded-step decidability ("takes $> 2021$ steps on all / some inputs"). | Rice's theorem does NOT apply (step count is syntactic, not a property of $L(M)$)! Testing all strings of length $\le 2021$ for 2022 steps decides BOTH $L_1$ and $L_2$! | **CORRECT (A).** Because a TM reads at most 1 new cell per step, behaviour during the first 2022 steps depends only on finitely many prefixes of length $\le 2021$ -> both $L_1$ and $L_2$ are decidable! | Clean. |
| 46 | `2021_AN_Q18` | Ch 04 / L04.1, L04.2 | Classifying reversal-based languages (`ww^R`, `wxw^R`) as CFL vs non-CFL. | Crossing `wxw^R x^R` fails CFL; concatenation `ww^R xx^R` and centered `wxw^R` are CFLs! | **FACT-DOUBT on Option D!** A (`wxw^R x^R`) is NOT CFL; B (`ww^R xx^R`) IS CFL; C (`wxw^R`) IS CFL. **However, Option D as printed here says `{wxxw^Rw^R}`**, which is **NOT CFL** (intersecting with $0^+ 1^+ 0^+ 1^+ 0^+$ forces $x = 1^k$ or $\epsilon$, yielding three equal $0^i$ blocks $0^i 1^{\dots} 0^i 1^j 0^i$, failing CFL Pumping Lemma!). Actual GATE 2021 Option D was `{w x x^R w^R}` (CFL)! | **MIS-TRANSCRIPTION:** Option D printed as `wxxw^Rw^R`; should be `wxx^Rw^R`! |
| 47 | `2021_AN_Q51` | Ch 01 / L01.5 | Multiple equivalent Regular Expressions for binary numbers divisible by 3 (including `\epsilon`). | Don't stop after confirming Option A in an MSQ! State elimination in two different orders yields BOTH A (`= C`) and B! | **CORRECT (A, B, C).** Mod-3 DFA: eliminating $q_2$ then $q_1$ gives `(0 + 1(01*0)*1)*` (A, and C by `(A*B*)*=(A+B)*`); keeping $\{q_1,q_2\}$ cycle gives `(0 + 11 + 10(1+00)*01)*` (B). D fails on `1001` (= 9). | Clean. |
| 48 | `2021_FN_Q18` | Ch 03 / L03.3 | Counting strings of length 100 accepted by a given PDA diagram. | Check non-deterministic branches & exact stack balance condition. | **CANNOT VERIFY** (Key: 50). Figures `[IMAGE_Q_18_1]`, `[IMAGE_Q_18_2]` are missing. | **MISSING FIGURES** (`[IMAGE_Q_18_1]`, `[IMAGE_Q_18_2]`). |
| 49 | `2020_FN_Q22` | Ch 01 / L01.5 | Regular Expression for binary strings with odd number of `1`s (testing edge strings). | Test short edge cases `01`, `10`, and `1111`! Every printed regex either allows even `1`s or misses leading/trailing `0`s! | **FACT-DOUBT (ALL 4 OPTIONS WRONG / OFFICIAL MTA!).** Bank marks ALL 4 options A, B, C, D `✔ official` with zero note! Check: **A** accepts `1111` (4 ones, even!); **B** misses `10` (must end in `1`); **C** misses `01` (must start with `1`); **D** misses `01` (0 repeats starts with `1`; $\ge 1$ repeats gives $\ge 3$ ones!). GATE 2020 gave **Marks to All (MTA)**; bank must explain this! | **MISSING NOTE:** Add `[OFFICIAL MTA — ALL 4 OPTIONS FLAWED]` banner! |
| 50 | `2020_FN_Q19` | Ch 02 / L02.1 | Regular non-closure under infinite union and reverse-union trap. | Every language $L$ is an infinite union of 1-string regular languages $\{w\}$! And $L_1 \cup L_2 = \Sigma^*$ works with non-regular $L_1$. | **CORRECT (D).** Both I (`L_1 = H_TM, L_2 = \Sigma^*`) and II (infinite union of singletons `{w}`) are FALSE. | Clean. |
| 51 | `2020_FN_Q24` | Ch 03 / L03.4 | Separating **DCFL** from **LL($k$)** for `{a^n} \cup {a^n b^n}`. | Looks like union of regular + DCFL -> IS DCFL (push `a`, accept on EOF or pop on `b`!). Yet NOT `LL(k)` for any fixed $k$ because top-down parser can't look past $k$ `a`'s to see if `b` follows! | **CORRECT (C: I and III only).** Statement I is true (DPDA accepts by final state); II is false; III is true (cannot decide `a^n` vs `a^n b^n` with finite $k$-symbol lookahead). | Clean (note Compiler `LL(k)` overlap). |
| 52 | `2020_FN_Q44` | Ch 06 / L06.2, L06.3 | Rice's theorem vs fixed-step reachability (`100 steps`). | `L_2` runs $M$ on ONE given $w$ for **exactly 100 steps** -> simulate 100 steps and check if state = $q$ (Decidable!). `L_1, L_3, L_4` depend solely on $L(M)$ and are non-trivial -> Undecidable by Rice! | **CORRECT (A: L1, L3, L4 only).** $L_1$ ($E_{\text{TM}}$), $L_3$ (not recursive), $L_4$ ($|L(M)| \ge 21$) are all non-trivial properties of $L(M)$; $L_2$ is bounded-time decidable. | Clean. |
| 53 | `2020_FN_Q60` | Ch 02, 04 / L02.1, L04.1 | Collapsing `{w x y x}` (`|x|=1`) to Regular vs `{x y | |x|=|y|, x != y}` as CFL! | In `L_1 = {wxyx}`, because `w` sits in front, setting `|x| = 1` catches ALL cases (any string len $\ge 4$ whose last letter appeared between index `2` and `n-2` -> finite NFA -> Regular!). In `L_2`, two equal halves differing at $\ge 1$ position is the classic non-deterministic CFL! | **CORRECT (A).** $L_1$ is regular (`|x|=1` suffices; longer `x` still shares last letter of `x` earlier at index $\ge |w|+|x| \ge 2$); $L_2$ is CFL (not regular, since $\{w \mid |w|\text{ even}\} - L_2 = \{ww\}$). | Clean. |
| 54 | `2020_FN_Q41` | Ch 01 / L01.2, L01.4 | Minimal DFA states via Product Automaton (`#a` div by 2 AND NOT by 3). | Must check whether all $2 \times 3 = 6$ product states are reachable & pairwise distinguishable! | **CORRECT (6).** States `(r2, r3)` for `r2 \in {0,1}, r3 \in {0,1,2}` with accepting `{(0,1), (0,2)}` are all reachable via `a^0..a^5` and pairwise separated by appending `a^k`. | Clean. |
| 55 | `2019_FN_Q30` | Ch 02 / L02.1 | Regular closure under `L \cdot L^R`, `Prefix(L)`, `Suffix(L)` vs `{ww^R | w \in L}`. | Students know `L^R` is regular so assume `{ww^R | w \in L}` is too! Wait: `L \cdot L^R` pairs independent $x, y^R \in L$, whereas `{ww^R}` forces $x = y$! | **CORRECT (B).** Take $L = a^* b$: $\{w w^R \mid w \in L\} = \{a^n b b a^n\}$ (non-regular!). A, C, D are always regular. | Clean. |
| 56 | `2019_FN_Q28` | Ch 02 / L02.2 | Checking valid pumping length $p$ on a concrete regular language. | Test shortest string $b^{10}$! If $p \le 9$, opponent's split `|xy| <= p` gives $y = b^m$ ($1 \le m \le 9$), and pumping once gives $b^{10+m} \notin L$ ($10 < 10+m < 22$)! | **CORRECT (D: 24).** $p = 3, 5, 9$ fail on $w = b^{10}$; for $p = 24$, every string of len $\ge 24$ is either $a^{2+3k}$ ($y=a^3$) or $b^{10+12k}$ ($y=b^{12}$, $|xy| \le 12 \le 24$). | Clean. |
| 57 | `2019_FN_Q39` | Ch 04 / L04.1, L04.2 | Crossing vs nested dependencies (`w a^n b^n w^R` vs `w a^n w^R b^n`) & finite union of CFLs. | D (`i \in {n, 3n, 5n}`) is just union of 3 CFLs (`n`, `3n`, `5n`) -> CFL! B nests `a^n b^n` inside `w ... w^R` -> CFL! C crosses `w` with `a^n` -> NOT CFL! | **CORRECT (C).** `{w a^n w^R b^n}` fails CFL Pumping Lemma on $a^p b^p a^p b^p$? Take $w = a^p, n = p \implies a^p b^p a^p b^p$ (`w=a^p, a^n=b^p`? No: choose `w = 0^p`? Over `{a,b}`, pick $w = b^p \implies b^p a^p b^p b^p$? Better: pick $w = (ab)^p$ or $b^p a^p$ -> take $w = b^p$, wait $w a^n w^R b^n = b^p a^p b^p b^p$ where window `vwx` of size $p$ can't link first `b^p` with third `b^p` AND `a^p` with fourth `b^p`!). Wait: `b^p a^p b^p` merges with `b^n`! Pick $w = a^p$? No, $a^p a^p a^p b^p$ merges `a`s! Pick **$w = b^p$, $n = p$** in $\{b^p a^p b^p b^p\}$? Wait: `b^p b^p` blends! Pick **$w = a^p b^p$, then $w^R = b^p a^p$**, wait: $w = b^p$, $n = p$? No: pick $w = (ab)^p$? No, simpler: $w = b^p$ merges, so pick $w = a^p$? No: pick $w = b^p a^p$ -> $b^p a^p \cdot a^p \cdot a^p b^p \cdot b^p$ (`a` blends!). Pick **$w = b^p$**? Wait: why pick $w = a^p$ when $w = b^p$? Because $w = b^p$ ends in `b`, right before `a^n`! What if you pick **$w = (ab)^p$**? No, pick **$w = b^p$**, no — pick **$w = a^p b^p$**: then `w = a^p b^p`, `a^n = a^p`, `w^R = b^p a^p`, `b^n = b^p` -> **`a^p b^p a^p b^p a^p b^p`** (SIX distinct alternating blocks, all of size $p$!!)! Window $|vwx| \le p$ touches at most 2 adjacent blocks, breaking the symmetry -> crystal-clear proof! | Clean. |
| 58 | `2019_FN_Q50` | Ch 00, 05 / L00.2, L05.1 | Countable sets (RE languages, valid C programs) vs uncountable sets (all languages, all non-regular languages). | Countably many TMs $\implies$ RE is countable ($S_1$); removing countable Regular languages from uncountable $2^{\Sigma^*}$ ($S_3$) leaves uncountable $S_4$! | **CORRECT (B: S3 and S4).** $S_1, S_2$ are countable; $S_3, S_4$ have cardinality $2^{\aleph_0}$ (uncountable). | Clean. |
| 59 | `2019_FN_Q59` | Ch 01 / L01.1, L01.4 | Minimal DFA states for symmetric group $S_5$ composition reaching identity `id`. | Alphabet = all $5! = 120$ bijections; group structure means all 120 permutations are reachable and for any $g_1 \neq g_2$, appending $g_1^{-1}$ sends $g_1 \to \text{id}$ (accept) and $g_2 \to g_2 \circ g_1^{-1} \neq \text{id}$ (reject)! | **CORRECT (120).** Every element of $S_5$ forms its own Myhill-Nerode class -> $5! = 120$ states. | Clean. |
| 60 | `2018_FN_Q16` | Ch 01 / L01.3 | Subset construction upper bound $k \le 2^n$ on minimal DFA states. | `>= 2^n`, `>= n`, and `<= n^2` are all false in general. | **CORRECT (D).** $k \le 2^n$ always holds. | Clean. |
| 61 | `2018_FN_Q17` | Ch 05 / L05.3 | Properties of the set of all RE languages. | RE is countable (not uncountable D!), not closed under complement (A false), superset of Recursive (C false), IS closed under intersection (B true)! | **CORRECT (B).** Run $M_1(w)$, if accepts run $M_2(w)$ -> RE closed under $\cap$. | Clean. |
| 62 | `2018_FN_Q45` | Ch 04 / L04.1, L04.2 | Multi-counter CFL classification (`m+p = n+q`, `m=n & p=q`, `m=n=p`, `mn=p+q`). | `mn = p+q` (multiplication) and `m=n=p` (3-way equality) cannot be tracked by 1 stack; `m+p=n+q` is 1 net excess counter! | **CORRECT (B: I and II only).** I uses signed excess counter; II concatenates $\{a^m b^m\} \cdot \{c^p d^p\}$; III and IV are not CFL. | Clean. |
| 63 | `2018_FN_Q46` | Ch 04, 06 / L04.3, L06.2, L06.3 | Undecidability across unrestricted grammars, TMs, and NFA-vs-DPDA trick! | IV asks *"Given NFA $N$, is there a DPDA $P$ accepting $L(N)$?"* Since every NFA language is Regular $\subset$ DCFL, the answer is ALWAYS YES (trivial O(1) "Yes" -> **Decidable**!). Also III says "grammars" (even CFGs have undecidable equivalence!). | **CORRECT (D: I, II, III only).** I ($A_{\text{UG}} \equiv A_{\text{TM}}$), II ($REG_{\text{TM}}$), III ($EQ_{\text{G}}$) are undecidable; IV is trivially decidable ("Yes"). | Clean. |
| 64 | `2018_FN_Q62` | Ch 00, 01 / L00.1, L01.5 | Language powers $L^i$ and order of a language ($L^k = L^{k+1}$). | Must read exact accepted language $L_1$ from figure first. | **CANNOT VERIFY** (Key: 2). Figure `[IMAGE_Q_62]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_62]`). |
| 65 | `2017_AN_Q24` | Ch 04 / L04.1 | CFL closure under $\cup$, complement, $\cap$, and `CFL - Regular`. | `L_1 - R = L_1 \cap \overline{R}` = `CFL \cap Regular` = ALWAYS CFL (III true)! | **CORRECT (B: I and III only).** CFL closed under union (I) and difference with Regular (III), NOT under complement (II) or intersection (IV). | Clean. |
| 66 | `2017_FN_Q22` | Ch 03 / L03.2 | Reading recursive CFG expansion with independent inner variable `T`. | `T` expands independently on each occurrence ($m_1, m_2, \dots, m_n \ge 1$), NOT a single fixed `m` as in C (`(cb^m)^n`)! | **CORRECT (B).** Each of $n \ge 1$ recursive expansions produces `ab` on left and `c T` ($= c b^{m_i}, m_i \ge 1$) on right. | Clean. |
| 67 | `2017_AN_Q11` | Ch 03 / L03.2 | Concatenation grammar `S -> XY` (`X -> a^+`, `Y -> a^n b^n`). | Check strict `>` vs `>=` carefully! `X` adds at least ONE `a` (`k >= 1`), `Y` allows `n = 0` (`\epsilon`), so `m = k + n > n >= 0`! | **CORRECT (C: `m > n, n >= 0`).** Minimum `b` is 0; minimum `a` is $1 + 0 = 1$, always strictly greater than `b`. | Clean. |
| 68 | `2017_FN_Q23` | Ch 01 / L01.1 | Minimum DFA states for `(a+b)^* b (a+b)` (2nd-to-last symbol is `b`). | Remember last 2 symbols: `aa, ab, ba, bb` -> 4 distinct Myhill-Nerode classes (`aa/ba`? Wait: separated by `\epsilon`, `a`, `b`: `bb` accepts now, `ba` accepts now; `ab` accepts on `a` or `b` next, `aa` rejects on `a` or `b`? Wait: `b` after `ab` -> `bb` (accepts) while `b` after `aa` -> `ab` (rejects)! Wait: `bb` vs `ba`: `bb` accepts on `a` (`bb a` -> 2nd last `b`), `ba` rejects on `a` (`ba a` -> 2nd last `a`)!). | **CORRECT (4).** All 4 two-letter suffixes `{aa, ab, ba, bb}` are pairwise distinguishable -> $2^2 = 4$ minimal states. | Clean. |
| 69 | `2017_AN_Q15` | Ch 01 / L01.1 | Minimum DFA states for positional pattern (`|w_1| = 2`, 3rd char `a`, `|w_2| >= 3`). | Don't track the first 2 characters individually! First 2 steps only count length (`0, 1, 2`), then check 3rd char (`a` -> ok, `b` -> dead trap), then count 3 more chars (`3, 4, 5, 6+`)! | **CORRECT (8).** States: `len0`, `len1`, `len2`, `len3_ok`, `len4_ok`, `len5_ok`, `len>=6_accept`, `dead_trap` = 8 minimal states. | Clean. |
| 70 | `2017_FN_Q46` | Ch 03 / L03.1 | Terminal-count invariant for CFG (`S -> SaS \| aSb \| bSa \| SS \| \epsilon`). | Every rule adds either `+1a` (`SaS`) or `(+1a, +1b)` (`aSb, bSa`), so $n_a(w) \ge n_b(w)$ ALWAYS! | **CORRECT (D: `babba`).** A (`2a,2b`), B (`3a,1b`), C (`3a,2b`) all satisfy $n_a \ge n_b$ (easily derivable); D (`babba`) has `2a < 3b` -> impossible! | Clean. |
| 71 | `2017_FN_Q40` | Ch 04 / L04.1 | Intersection of two CFGs turning into an infinite **Regular** language! | $L(G_1) = \{a^n c^k b^n\}$ and $L(G_2) = \{b^m c^k a^m\}$. Matching prefix/suffix forces $n = m = 0$, leaving `c^*`! | **CORRECT (B: Not finite but regular).** $L(G_1) \cap L(G_2) = c^*$ (infinite and regular). | Clean. |
| 72 | `2017_FN_Q50` | Ch 04 / L04.1 | Classic CFL closure under $\cup$ vs non-closure under $\cap$. | $L_1 \cup L_2$ is always CFL; $L_1 \cap L_2 = \{a^n b^n c^n\}$ is NOT CFL. | **CORRECT (A: I only).** Standard textbook counterexample for CFL intersection. | Clean. |
| 73 | `2017_FN_Q52` | Ch 05 / L05.2 | Equivalence between total TM-computable function $f$ and Recursive graph language $L_f = \{x \# f(x)\}$. | Since $f$ is **total**, if $L_f$ is recursive, you can enumerate $y \in B^*$ until $x \# y \in L_f$ (guaranteed to terminate and output $f(x)$!). | **CORRECT (A).** ($\Rightarrow$) check format and compute $f(x)$ to decide $L_f$; ($\Leftarrow$) enumerate $y \in B^*$ testing $L_f$ decider to compute total $f(x)$. | Clean. |
| 74 | `2017_AN_Q40` | Ch 01 / L01.3 | Computing $\hat{\delta}(q_2, aba)$ on an $\epsilon$-NFA transition table. | Apply $\epsilon$-closure before AND after every symbol! | **CANNOT VERIFY** (Key: C). Table `[IMAGE_Q_40]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_40]`). |
| 75 | `2017_AN_Q38` | Ch 03, 04 / L03.4, L04.2, L04.3 | Classifying `{a^p prime}`, `{a^n b^m c^{2m}}`, `{a^n b^n c^{2n}}`, and `{a^n b^n}` (`n >= 1`). | `L_2 = a^* \{b^m c^{2m}\}` DOES NOT link `a` to `b,c` -> IS CFL (II false)! `a^p` prime is neither reg nor CFL (I false)! | **CORRECT (D: III and IV only).** $L_1$ not CFL; $L_2$ IS CFL; $L_3$ not CFL yet Recursive/CSL; $L_4$ is DCFL. | Clean. |
| 76 | `2017_AN_Q60` | Ch 02, 04, 06 / L02.3, L04.3, L06.1 | Comparing decidability across Regex membership, CFG emptiness, CFG universality, and TM membership ($A_{\text{TM}}$). | III (`L(G) = \Sigma^*`) and IV (`w \in L(M)`) are undecidable; I and II are decidable! | **CORRECT (D: III and IV only).** Classic cross-level decidability comparison. | Clean. |
| 77 | `2017_FN_Q37` | Ch 03 / L03.1 (Compiler overlap) | Counting independent control-flow paths in a grammar generating 10 sequential `if-then-else` statements. | Each `if expr then expr else expr; stmt` expands sequentially into 10 independent 2-way branches (`2^{10} = 1024`), ending at `0`. | **CORRECT (1024).** 10 independent binary choices yield $2^{10} = 1024$ paths. | Minor clarity note: example `if e1 then e2 else e3` drops trailing `; 0` from the grammar. |

---

## PART 7. MORE QUESTIONS NEEDED (3 New Ideas Per Lesson)

### Chapter 00 · Mathematical & Language Foundations
- **Lesson 00.1 (`Alphabets, Strings, Languages & Empty Trio`):**
  1. Simplify $((L \cdot \emptyset)^* \cup \{\epsilon\}) \cdot \{a, b\}$ for any language $L$ (`MCQ`).
  2. Find the order $k$ (smallest $k$ with $L^k = L^{k+1}$) for $L = \{a^2, a^3, a^5\}$ over $\Sigma = \{a\}$ (`NAT`).
  3. Which of the following equalities hold for ALL languages $L_1, L_2$: `$L_1 \cdot \emptyset = \emptyset$`, `$(L_1^*)^+ = L_1^*`, `$\emptyset^+ = \{\epsilon\}$`, `$(L_1 \cup \{\epsilon\})^* = L_1^*$`? (`MSQ`).
- **Lesson 00.2 (`Equivalence Classes, Pigeonhole & Countability`):**
  1. Given $L = \{w \in \{0,1\}^* \mid w \text{ ends in } 01\}$, which pairs of strings belong to the same Myhill-Nerode equivalence class? (`MSQ`).
  2. Which of the following sets of languages/automata over $\{0,1\}$ are countably infinite: all DFAs, all finite subsets of $\{0,1\}^*$, all complements of CFLs, all subsets of $\{0\}^*$? (`MSQ`).
  3. What is the maximum length of a string over $\{a,b\}$ that can have NO repeated prefix remainder modulo 5? (`NAT`).

### Chapter 01 · Finite Automata & Regular Expressions
- **Lesson 01.1 (`DFA State-Memory & Design Patterns`):**
  1. Minimum number of states in a complete DFA over $\{0,1\}$ accepting $\{w \mid |w| \ge 3 \text{ and 1st symbol} \neq \text{last symbol}\}$ (`NAT`).
  2. Minimum number of states in a complete DFA accepting binary strings whose decimal value is congruent to `3 (mod 5)` (`NAT`).
  3. Which of the following statements about complete DFAs for $L = \{\epsilon\}$ and $L = \emptyset$ over $\Sigma = \{a,b\}$ are true (state counts & trap states)? (`MSQ`).
- **Lesson 01.2 (`Complementation & Product DFA`):**
  1. Minimum DFA states for $\{w \in \{a,b\}^* \mid \#_a(w) \equiv 1 \pmod 3 \text{ OR } \#_b(w) \equiv 0 \pmod 2\}$ (`NAT`).
  2. Given minimal DFAs $M_1$ ($4$ states) and $M_2$ ($6$ states), which of the following can NEVER be the minimal DFA size of $L(M_1) \cap L(M_2)$? (`MSQ`).
  3. Show an example NFA where swapping accepting and non-accepting states fails to accept $\overline{L(N)}$ (`MCQ`).
- **Lesson 01.3 (`NFA, \epsilon-NFA & Subset Construction`):**
  1. Minimum states in an NFA (vs minimal DFA) accepting $\{w \in \{0,1\}^* \mid \text{4th symbol from right is } 1\}$ (`NAT`).
  2. Given an $\epsilon$-NFA table with an $\epsilon$-cycle $q_0 \leftrightarrow q_1$, compute $\hat{\delta}(q_0, 01)$ (`MCQ`).
  3. Which subset-construction statements are always true regarding unreachable subset states and the empty set $\emptyset$? (`MSQ`).
- **Lesson 01.4 (`DFA Minimization & Myhill-Nerode`):**
  1. Given a 7-state DFA transition table containing 2 unreachable states, find the minimal number of states after unreachable removal and table-filling (`NAT`).
  2. Using Myhill-Nerode, find minimum DFA states for $\{x \in \{a,b\}^* \mid x \text{ has length divisible by 3 or ends in } ab\}$ (`NAT`).
  3. Identify all pairs of states that become distinguishable at Round 1 vs Round 2 in a given 6-state DFA (`MSQ`).
- **Lesson 01.5 (`Regular Expressions & FA <-> Regex`):**
  1. Which regular expressions describe $\{w \in \{0,1\}^* \mid \text{every } 0 \text{ is immediately followed by at least two } 1\text{s}\}$? (`MSQ`).
  2. Count total strings of length $\le 6$ in $L((00 + 1)^*)$ (`NAT`).
  3. Given a 3-state DFA where a loop contains $\epsilon$, show why naive Arden's equation $R = Q + R(\epsilon + a)$ misleads unless simplified first (`MCQ`).
- **Lesson 01.6 (`Regular Grammars & Mealy/Moore Machines`):**
  1. Which of the following grammars generate ONLY regular languages (check mixed right/left-linear rules like $S \to aA, A \to Sb \mid \epsilon$ vs $S \to aA, A \to bA \mid \epsilon$)? (`MSQ`).
  2. For a 4-state Mealy machine over $\{0,1\}$ with output alphabet $\{x, y, z\}$, what is the maximum possible states in the equivalent Moore machine? (`NAT`).
  3. Given a Moore machine converting binary input + 1 (2's complement / incrementer), trace the output string length and exact bits for input `0101` (`MCQ`).

### Chapter 02 · Regular Languages: Closure, Non-Regularity & Decision Properties
- **Lesson 02.1 (`Closure & Counterexample Traps`):**
  1. Let $L_1$ be regular and $L_2$ be non-regular; which of $L_1 / L_2$ (right quotient), $L_2 / L_1$, $h^{-1}(L_1)$, and $h(L_2)$ MUST be regular? (`MSQ`).
  2. Given a 4-state DFA for $L$, how many states (minimal or unminimized) can accept `Prefix(L)` or `L^R`? (`MCQ`).
  3. Classify $\{x y z y \mid x, z \in \{a,b\}^*, y \in \{a,b\}^+\}$ vs $\{y x y \mid x \in \{a,b\}^*, y \in \{a,b\}^+\}$ (`MCQ`).
- **Lesson 02.2 (`Pumping Lemma & Myhill-Nerode Fooling Sets`):**
  1. Find the SMALLEST valid pumping length $p$ for the regular language $\{a^5 b^n \mid n \ge 0\} \cup \{c^3\}$ (`NAT`).
  2. Which of the following languages satisfy the Pumping Lemma conditions yet are STILL non-regular (e.g. `{a^i b^j c^k | i=0 -> j=k}` style union trap)? (`MSQ`).
  3. Identify a valid Myhill-Nerode fooling set separating infinitely many prefixes of $\{0^n 1^{n^2} \mid n \ge 1\}$ (`MCQ`).
- **Lesson 02.3 (`Decision Properties of Regular Languages`):**
  1. Given a DFA with 10 states where 2 cycles exist only inside unreachable or trap components, determine whether $L(M)$ is finite or infinite (`MCQ`).
  2. What is the worst-case time complexity (in terms of $n_1, n_2$) to decide if $L(D_1) \subseteq L(D_2)$ for two DFAs $D_1, D_2$? (`MCQ`).
  3. Which decision questions about two NFAs $N_1, N_2$ are decidable? (`MSQ`).

### Chapter 03 · Context-Free Grammars & Pushdown Automata
- **Lesson 03.1 (`CFGs, Ambiguity & Rule Accounting`):**
  1. Given $S \to aSb \mid bSa \mid SS \mid \epsilon$, determine which strings have unique parse trees vs multiple parse trees (`MSQ`).
  2. Given $S \to aaSb \mid aSb \mid c$, find the exact inequality relating $n_a(w)$, $n_b(w)$, and $n_c(w)$ (`MSQ`).
  3. Count the number of distinct parse trees for the string `a + a + a + a` under $E \to E + E \mid a$ (Catalan $C_3 = 5$!) (`NAT`).
- **Lesson 03.2 (`CFG Simplification & CNF/GNF`):**
  1. Given a 6-variable CFG, identify which variables survive after removing non-generating first vs wrongly removing unreachable first (`MSQ`).
  2. Convert $S \to aSb \mid ab$ into minimal-rule CNF and count total productions (`NAT`).
  3. What is the exact derivation length of a string of length 25 in a grammar already in Greibach Normal Form (GNF)? (`NAT`).
- **Lesson 03.3 (`PDA Mechanics & Acceptance Modes`):**
  1. Trace a 2-state PDA accepting by final state and determine how many strings of length $\le 6$ over $\{a,b\}$ are accepted (`NAT`).
  2. Convert a given 2-variable CFG into an equivalent 1-state PDA accepting by empty stack (`MCQ`).
  3. Which statements accurately compare Final-State acceptance vs Empty-Stack acceptance for NPDAs vs DPDAs? (`MSQ`).
- **Lesson 03.4 (`DPDA, DCFLs & LL(k) Intuition`):**
  1. Which of `{a^n b^n} \cup {a^n b^{2n}}`, `{a^n c b^n} \cup {a^n d b^{2n}}`, `{w c w^R}`, `{w w^R}` are DCFLs? (`MSQ`).
  2. Why is $\{a^n b^n \mid n \ge 1\} \cup \{a^n b^{2n} \mid n \ge 1\}$ not accepted by ANY DPDA, even though its complement $\{a^n b^n\}$ and $\{a^n b^{2n}\}$ individually are DCFLs? (`MCQ`).
  3. Identify which DCFLs are `LL(1)` vs `LR(1)` yet not `LL(k)` for any $k$ (`MSQ`).

### Chapter 04 · Context-Free Languages: Closure, Pumping Lemma & Chomsky Hierarchy
- **Lesson 04.1 (`CFL/DCFL Closure & Multi-Counter Arcs`):**
  1. Classify `{a^i b^j c^k d^l | i + j + k = l}` vs `{i * j = k + l}` vs `{i = j or k = l}` into DCFL / Ambiguous CFL / Non-CFL (`MSQ`).
  2. Let $L_1$ be DCFL and $L_2$ be Regular; which of $\overline{L_1} \cap L_2$, $L_1 \cup \overline{L_1}$, $\overline{L_1} \cup \overline{L_2}$ are guaranteed to be DCFL vs CFL? (`MSQ`).
  3. Simplify $(L_1 \cap R_1) - (L_2 \cap R_2)$ when $L_1$ is CFL, $L_2$ is Regular, and $R_1, R_2$ are Regular (`MCQ`).
- **Lesson 04.2 (`CFL Pumping Lemma`):**
  1. Given $L = \{a^i b^j c^k \mid i < j < k\}$, show how pumping up or down breaks EVERY split with $|vwx| \le p$ (`MCQ`).
  2. Identify which languages fail the CFL Pumping Lemma yet DO pass the Regular Pumping Lemma trick? Wait: rephrase cleanly — identify which languages satisfy CFL Pumping Lemma yet are NOT CFL (`[GATE+]` Ogden's test!) (`MSQ`).
  3. For $w = a^p b^p c^p$, if the adversary places `vwx` inside $b^p c^p$, which values of $i$ break `a^p b^p c^p` (`i = 0`, `i = 2`, both)? (`MSQ`).
- **Lesson 04.3 (`CFL Decisions, CYK & Chomsky Hierarchy`):**
  1. Run bottom-up CYK on `w = abba` for a 4-rule CNF grammar and find the set of variables in the top cell $T[1, 4]$ (`MCQ`).
  2. Which of the following problems are decidable for a **DPDA** $P$ yet undecidable for a general **NPDA/CFG** $G$? (`MSQ`).
  3. Classify $\{a^{2^n} \mid n \ge 0\}$ and $\{a^n b^n c^n d^n\}$ across Chomsky Type 3 / Type 2 / Type 1 (CSL) / Type 0 (`MSQ`).

### Chapter 05 · Turing Machines, Computability & Language Classes
- **Lesson 05.1 (`TM Tape, IDs & Decider vs Recognizer`):**
  1. Given a 3-state TM transition table, trace the final tape contents and halting state on input `0110` (`MCQ`).
  2. Which conditions distinguish a TM that *recognizes* $L$ from a TM that *decides* $L$ when given $w \notin L$? (`MSQ`).
  3. How many tape head moves does a single-tape TM take to reverse/shift or recognize $\{a^n b^n\}$ for $n = 4$ (`NAT` or `MCQ` trace)?
- **Lesson 05.2 (`TM Variants, Computable Functions & Enumerators`):**
  1. Let $L_f = \{x \# f(x)\}$ where $f$ is a **partial** computable function (may diverge on some inputs): is $L_f$ Recursive, RE, or neither? (`MCQ`).
  2. If an enumerator $E$ outputs strings in non-decreasing length order (allowing consecutive ties of same length in arbitrary order), what class MUST $L(E)$ belong to? (`MCQ`).
  3. Compare expressive power of 1-tape DTM, 2-tape NTM, semi-infinite TM, and 2-stack PDA (`MSQ`).
- **Lesson 05.3 (`Closure of Recursive/RE, Post's Theorem & Onion Map`):**
  1. Let $L_1$ be Recursive and $L_2$ be RE (not recursive); classify $L_1 \cup L_2$, $L_1 \cap L_2$, and $L_1 - L_2$ (`MSQ`).
  2. Why is Recursive closed under $\epsilon$-free homomorphism yet NOT closed under arbitrary erasing homomorphism? (`MCQ`).
  3. Identify which statements about Post's Theorem and Co-RE languages are always true (`MSQ`).

### Chapter 06 · Decidability, Undecidability, Reductions & PCP
- **Lesson 06.1 (`Universal TM & Halting Diagonalization`):**
  1. Place $A_{\text{TM}}$, $\overline{A_{\text{TM}}}$, $H_{\text{TM}}$, and `{\langle M, w \rangle \mid M halts on w within 50 steps}` into Recursive / RE \ Rec / Co-RE \ Rec (`MSQ`).
  2. Suppose $L$ is the set containing `"1"` iff Goldbach's conjecture is true, and empty otherwise: is $L$ Recursive? (`MCQ`).
  3. Spot the subtle flaw in a fake "decider" argument for $H_{\text{TM}}$ that confuses finite inputs with all $\langle M, w \rangle$ (`MCQ`).
- **Lesson 06.2 (`Mapping Reductions & RE/Co-RE/Neither`):**
  1. Given $A \le_m B$ where $A$ is **Co-RE complete** ($\overline{A_{\text{TM}}}$) and $B$ is **RE**, what can you conclude about $B$? (Contradiction — impossible unless $A$ were RE! Wait: great conceptual trap: *"If $A$ is undecidable and $A \le_m B$, what must hold for $B$?"*) (`MSQ`).
  2. Classify $E_{\text{TM}}$ (`L(M) = \emptyset`), $\overline{E_{\text{TM}}}$ (`L(M) != \emptyset`), $FIN_{\text{TM}}$ (`L(M)` finite), and $REG_{\text{TM}}$ (`L(M)` regular) into `RE \ Rec`, `Co-RE \ Rec`, or `Neither` (`MSQ`).
  3. Explain which reduction direction proves $L_1$ is non-RE given $\overline{H_{\text{TM}}}$ (`MCQ`).
- **Lesson 06.3 (`Rice's Theorem, Bounded-Step & PCP`):**
  1. Given 4 properties of TM $M$ — (i) $M$ has $\le 15$ states, (ii) $L(M)$ contains `01`, (iii) $M$ visits state $q_3$ on input `\epsilon`, (iv) $L(M)$ is context-free — which are decidable? (`MSQ`).
  2. Given a 3-domino PCP instance over $\{a, b\}$ (e.g. `(ab, a), (b, ba), (a, b)`), find the minimum number of dominoes needed for a valid match (`NAT`).
  3. Contrast decidability of PCP over $\Sigma = \{a, b\}$ vs $\Sigma = \{a\}$ (unary alphabet) (`MCQ`).

---

## PART 8. WHAT IS MISSING FROM THE SUBJECT

Looking across GATE CS official syllabus, previous papers (`Part C`), and standard GATE texts (Made Easy, GateWallah, Sipser, Hopcroft–Ullman, NPTEL), these topics are missing or hidden in `Part B.2`'s 6-chapter skeleton:

1. **Chapter 00 (Formal Mathematical & Language Prerequisites):** Alphabet/string/language algebra, $\epsilon$ vs $\{\epsilon\}$ vs $\emptyset$, order of a language ($L^k = L^{k+1}$), equivalence relations, Pigeonhole Principle, and **Countability vs Uncountability (Cantor's diagonalization)** (`2019_FN_Q50`, `2021_AN_Q23`, `2018_FN_Q62`).
2. **DFA Minimization & Myhill-Nerode Theorem + Group/Modulo DFAs:** Explicitly absent from `Part B.2`, yet heavily tested (`2025_AN_Q60`, `2024_FN_Q36`, `2020_FN_Q41`, `2019_FN_Q59`).
3. **FA ↔ Regex Algorithms (Thompson's, State Elimination, Arden's Theorem) & Bounded String Counting (`2024_FN_Q63`, `2024_AN_Q38`).**
4. **Regular Grammars (Right-Linear & Left-Linear) & Mealy/Moore Finite-State Transducers:** Standard syllabus/textbook FA topics completely unmentioned in `Part B.2`.
5. **Decision Properties of Regular Languages & CFGs (CYK Membership, Emptiness, Finiteness, Universality, Equivalence):** Not explicitly listed anywhere in Ch 02 or Ch 04 (`2025_AN_Q25`, `2021_FN_Q37`, `2017_AN_Q60`).
6. **CFG Simplification, Normal Forms (CNF `2n - 1` steps & GNF), Ambiguity vs Inherent Ambiguity, and Rule-Accounting Invariants:** Absent from Ch 03 (`2026_FN_Q25`, `2026_FN_Q52`, `2024_AN_Q42`, `2024_FN_Q48`, `2017_FN_Q46`).
7. **Deterministic PDA (DPDA) / DCFL vs NPDA / CFL & `LL(k)` Parsing Bridge:** Absent from Ch 03/04 (`2025_AN_Q24`, `2020_FN_Q24`, `2017_AN_Q38`).
8. **Chomsky Hierarchy, Context-Sensitive Languages (CSL) & Linear Bounded Automata (LBA):** Needed to classify non-CFL recursive languages like `{a^p}` and `{a^n b^n c^{2n}}` (`2017_AN_Q38`).
9. **TM Variants, Computable Functions (`L_f` recursive), Enumerators, Post's Theorem & Co-RE vs Neither-RE-nor-Co-RE:** Absent from Ch 05/06 (`2022_FN_Q23`, `2017_FN_Q52`).
10. **Mapping Reductions ($A \le_m B$), Rice's Theorem Traps, Bounded-Horizon Decidability, and Post Correspondence Problem (PCP):** Only vague chapter titles exist in Ch 05/06 (`2022_FN_Q46`, `2021_FN_Q23`, `2020_FN_Q44`, `2018_FN_Q46`).

---

## PART 9. WEIGHTS

### Chapter Weight Tags & Comparison with the Bank (`Part B.3`)

| Chapter | Proposed Weight Tag | Bank Stats (2017–2026, 15 CS Papers) | Does the Bank Weight Look Fair? |
|---|---|---|---|
| **Ch 00 · Math & Language Foundations** *(New)* | **Foundation** (Mandatory before Ch 01) | 0 direct label (yet tested directly in `2019_FN_Q50`, `2021_AN_Q23`, `2018_FN_Q62`) | **Under-counted in bank.** Giving Ch 00 zero weight hides the prerequisite reason beginners fail Ch 01, 02, and 06. |
| **Ch 01 · Finite Automata & Regular Expressions** | **High** | 26 Qs / 40 marks (2.67% of total GATE marks; asked 10/10 years) | **Fair.** Roughly ~1/3 of all TOC marks live here — especially DFA Minimization, State Counting, and FA <-> Regex. |
| **Ch 02 · Regular Languages: Closure, Pumping & Decisions** | **High** | Merged with Ch 04 in bank (25 Qs / 40 marks together; asked 10/10 years) | **Coarse / Partially fair.** Bank lumps Regular & CFL closure/pumping together into one 25-Q bucket. Both Ch 02 and Ch 04 individually carry High weight; splitting them in reporting makes study planning clearer. |
| **Ch 03 · CFGs & Pushdown Automata (incl. DPDA)** | **Medium-High** | 14 Qs / 22 marks (1.47%; asked 6/10 years) | **Slightly under-tagged by bank.** Several CFG invariant/derivation questions (`2026_FN_Q52`, `2024_AN_Q42`, `2024_FN_Q48`, `2017_FN_Q46`) sit here alongside PDA & DPDA, and CFG Ambiguity/CNF also boosts Compiler Design. |
| **Ch 04 · CFLs: Closure, Pumping, Decisions & Chomsky** | **High** | Merged with Ch 02 in bank (shared 25 Qs / 40 marks) | **Fair (once split from Ch 02).** CFL vs Non-CFL classification and closure MSQs appear constantly across the 10-year bank (exact standalone share of Ch 04 vs Ch 02: not sure without re-tagging all 25 Qs, though by count in Part C roughly half are Ch 04!). |
| **Ch 05 · Turing Machines & Language Classes** | **Medium** (Critical bridge to Ch 06) | Merged with Ch 06 in bank (12 Qs / 19 marks; asked 8/10 years) | **Fair.** Few pure TM-tape construction questions appear (`2026_AN_Q13`, `2017_FN_Q52`), yet Recursive vs RE properties from Ch 05 are tested constantly inside Ch 06 questions! |
| **Ch 06 · Undecidability, Reductions, Rice's & PCP** | **Medium-High** | Merged with Ch 05 in bank (shared 12 Qs / 19 marks; asked 8/10 years) | **Fair overall, though high ROI!** Only ~12 Qs in 15 papers, yet almost all are **Medium** 1-to-2-mark conceptual/MSQ wins once Rice's Theorem, Bounded-Horizon, and the Decidability Matrix are mastered. (Note: future frequency outside the 2017–2026 bank: not sure). |

### Overall Assessment of Bank Distribution (`8.1%` = ~8.1 marks/paper)
- Looking purely at the 2017–2026 bank in `Part B.3`, **Ch 01 (Finite Automata & Regex)** + **Ch 02/04 (Regular & CFL Classification/Closure)** account for **51 of 77 questions (80 of 121 marks = 66% of TOC!)**, while **Ch 03 (CFG/PDA)** and **Ch 05/06 (TM/Undecidability)** make up the remaining **34%**.
- Splitting the bank's 4 coarse buckets into the **7 actual chapters (Ch 00–06)** and tagging `Ch 01, 02, 04` as `[High]`, `Ch 03, 06` as `[Medium-High]`, `Ch 05` as `[Medium]`, and `Ch 00` as `[Foundation]` gives a 100-day dropper an honest, stress-free roadmap. (Beyond the 15-paper bank provided here, exact future paper weights: **not sure**.)
```