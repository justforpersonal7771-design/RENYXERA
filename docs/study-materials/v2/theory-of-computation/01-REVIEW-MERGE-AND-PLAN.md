# Theory of Computation: review merge and plan v1

Reviews merged: ChatGPT (`reviews-received/chatgpt-review-theory-of-computation.md`) and Gemini (`reviews-received/gemini.md`). Both wrote a plan of one foundation chapter plus six, with very similar lessons, so the merge was easy where they agree and careful where they differ.

## 1. How good were they
Both are strong and specific. ChatGPT separated what is official from what is its own enrichment and refused to invent GATE frequencies. Gemini mapped missing topics to the exact PYQs that test them. Both found real defects in our question bank (below). Neither was taken as final: items only one of them listed were checked against the syllabus and our PYQs.

## 2. Critical decision: do not shrink the subject to the PYQs
The bank has 77 TOC questions in four coarse labels. A book built only from what the bank tags would drop things GATE can ask (and that a student needs to understand the tagged ones). Rule used: **every item either reviewer listed that belongs to the official four syllabus lines is kept**, tagged by priority, and each item records whether a PYQ in our bank tests it. Items outside the four official lines (complexity classes, deep context-sensitive theory, Chomsky-hierarchy depth) are **kept as short [BEYOND] notes**, not removed and not made full chapters.

## 3. Defects found in our question bank
| Question | Problem | Status |
|---|---|---|
| 2026_FN_Q52 | Grammar printed `S → abaaBAbba`; the official page says `S → abaABAbba` | **Fixed** (checked on the official page text) |
| 2023_FN_Q19 | Range printed `[A – Za – a]`; official is `[A–Za–z]` | **Fixed** (checked on the official page text) |
| 2020_FN_Q22 | All four options carry "official"; both reviewers say the official key is **marks to all** because every printed expression is wrong (each fails on a short string such as `01`, `10` or `1111`) | **Open**: the 2020 key is not stored locally. Needs the official 2020 key; until then the lesson must not teach "all four are correct" |
| 2021_AN_Q18 option D | Printed `{w x x w^R w^R}` is not context-free, yet it is marked correct; Gemini says the paper has `{w x x^R w^R}` (which is context-free, and consistent with the key) | **Open, high confidence**: the 2021 paper is image-only; the page was not located this turn. To confirm from the page image before changing |
| All records | No official paper link, page or key status stored beside each question | Add a `source` field in the bank schema (planned) |
| Forge | 24 Forge TOC questions are counted but were not in the review file | Include them in the next review round |

## 4. The plan (chapters, lessons, tags)
Tags: [MUST] GATE-weighted or a prerequisite; [SHOULD] standard theory that supports questions; [LATER] enrichment. Hours are estimates. "Bank" = PYQs in our bank tagged to that family (coarse; chapter splits are by lesson tagging still to do).

**F0 · Symbols, strings, languages, proof language** [MUST] ~4 h. Alphabet, string, ε, length, concatenation, powers, reversal, Σ*, Σ+, language as a set; ε vs ∅ vs {ε}; quantifiers and who chooses what; direct proof, contradiction, induction, counterexample; countable vs uncountable (needed by 2019 style questions).

**1 · Regular expressions and finite automata** [MUST, High: bank 26 q, 40 marks] ~11 h
1.1 What a regular language is; 1.2 DFA from zero (tuple, extended δ, completeness, sink state); 1.3 NFA and ε-NFA (path acceptance, ε-closure); 1.4 NFA→DFA (subset construction, 2^n bound); 1.5 Regular expressions (precedence, identities, notation warning: union `+` vs positive closure), RE↔FA (Thompson, state elimination, Arden's lemma); 1.6 DFA minimisation (table filling, partition refinement); 1.7 Counting accepted strings by length (transition matrices); 1.8 Regular grammars (left/right linear), Mealy and Moore machines [SHOULD]. Diagrams: state diagrams as frames, subset-construction table, minimisation partition frames.

**2 · Regular languages: closure, decisions, pumping** [MUST, High; bank shares 25 q / 40 marks with chapter 4] ~8 h
2.1 Closure (union, intersection, complement, difference, concatenation, star, reversal, homomorphism); product construction; 2.2 Decision properties (membership, emptiness, finiteness, universality, equivalence, inclusion); 2.3 Pumping lemma with the **quantifier order printed in full** and the warning "necessary, not sufficient"; 2.4 Myhill–Nerode and state lower bounds [SHOULD]; pumping length need not be minimal.

**3 · Context-free grammars and pushdown automata** [MUST, Medium–High: bank 14 q, 22 marks] ~10 h
3.1 CFG tuple, derivations, sentential forms, leftmost/rightmost; 3.2 Parse trees and ambiguity (inherent ambiguity); 3.3 Reading a grammar as a language, count invariants (like 2026 Q52); 3.4 Simplification (ε, unit, useless) and CNF (a derivation of a w-length string takes 2n−1 steps), GNF [SHOULD], CYK [SHOULD]; 3.5 PDA (stack, ε moves, bottom marker, final-state vs empty-stack); 3.6 CFG↔PDA, DPDA vs NPDA, DCFL. LL(k) bridge to Compiler Design [LATER].

**4 · Context-free languages: closure, pumping, classes** [MUST, High; shared bucket with chapter 2] ~7 h
4.1 Closure (union, concatenation, star, reversal; **intersection with a regular language is CFL, intersection of two CFLs need not be**; complement and difference not closed; `aⁿbⁿcⁿ` as the counterexample); 4.2 CFL pumping lemma (five pieces, simultaneous pumping, how to defeat all splits); 4.3 Classifying regular / DCFL / CFL / recursive / RE with examples; 4.4 CFL decision facts (membership, emptiness, finiteness decidable; universality and equivalence undecidable). Chomsky hierarchy, context-sensitive languages and LBAs: short [BEYOND] note.

**5 · Turing machines and language classes** [MUST, Medium; bank shares 12 q / 19 marks with chapter 6] ~7 h
5.1 TM from zero, configurations, a move; 5.2 Accept / reject / loop, recogniser vs decider, recursive and RE; L and its complement both RE ⇔ L recursive; closure of recursive and RE classes; 5.3 Computable functions, graph languages, TM variants (multitape, nondeterministic) and enumerators [SHOULD]; co-RE and "neither" [SHOULD].

**6 · Decidability and undecidability** [MUST, Medium–High] ~8 h
6.1 Decidable problems for automata and grammars; 6.2 Halting problem and the diagonal argument; mapping reductions and **reduction direction**; 6.3 Rice's theorem (semantic vs syntactic properties) and its traps; bounded-step simulation is decidable; 6.4 Countability of machines vs uncountability of languages; PCP [SHOULD]; the decision map; 6.5 Mixed PYQ workshop.

**7 · Previous-year practice** [MUST] ~6 h. Every PYQ again, by pattern, MCQ / MSQ / NAT.

Out of the official lines, kept only as notes: P, NP, NP-completeness (belongs to Algorithms), Chomsky hierarchy depth, context-sensitive theory.

## 5. Other review points adopted
- Pumping lemma and Myhill–Nerode need their own proof templates, not one paragraph each.
- Every machine and grammar example is verified by a program run (automata simulators), like the C code.
- Do not assign the bank's combined bucket marks to single chapters until each of the 77 PYQs is tagged to a lesson (planned, same method as P&DS).
- Figure-dependent PYQs (14) keep their figure; the book states the key as a structured field (including "marks to all"), never as a tick beside an option.
- Statuses: "4 topics ready" in the app means a legacy draft exists, to be rewritten; it must not read as finished.

## 6. Next steps for this subject
1. Tag each of the 77 PYQs to a lesson (one chapter per question), as for P&DS.
2. Confirm 2021 AN Q18 (page image) and 2020 Q22 (official key), then fix the bank.
3. Build the automata labs (DFA/NFA, PDA, TM simulators) on the new figure engine.
4. Write the pilot lesson (1.2 DFA from zero) for you to read.
