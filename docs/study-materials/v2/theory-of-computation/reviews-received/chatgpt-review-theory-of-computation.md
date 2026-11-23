# ChatGPT Review — GATE CS Theory of Computation

**Source reviewed:** `Pasted markdown.md` (generated 24 November 2026; contents v0; 2,207 lines).  
**Review stance:** a 25-year-old beginner who has failed GATE twice, has weak foundations, and has about 100 days left.  
**Scope:** the six-chapter contents list, the PYQ statistics, and all 77 question records embedded in the file. This is a review of the *plan and supplied question bank*, not a review of the full old lessons inside the app. Those lesson texts, the 24 Forge questions, the missing question figures, and the master prompt referenced by the file were not attached here.

---

## Executive verdict

**Do not approve bulk writing yet. Approve a corrected plan and one tightly controlled pilot chapter.**

The six chapter headings cover the four official GATE 2027 Theory of Computation syllabus bullets at a high level. However, this file is explicitly a v0 contents list, not a teaching plan. It does not yet tell Claude what a beginner will read, what definitions will be introduced, which examples will be solved, how misconceptions will be handled, or how each lesson will be checked. From the student's point of view, it is a list of destinations without the road between them.

The historical bank summary is arithmetically consistent: **77 questions, 121 marks, 15 papers, 2017–2026**. The reported 8.1% is 121/1,500 total paper marks, not a guaranteed future weightage. The four category totals add up correctly. But the question bank needs a source audit, missing diagrams restored, and at least two transcription/key-record corrections before it is used to decide what to teach.

**Would I pay ₹149 now? No.** I would pay only after reading a complete pilot chapter that proves I can start from zero, follow every step, and solve fresh questions without watching a teacher explain the missing parts.

### What is from the attached source, what is independently checked, and what remains unknown

| Label | Meaning in this review |
|---|---|
| **Source says** | Directly stated in the attached `Pasted markdown.md`. |
| **Verified** | Checked against an official GATE page/paper or independently reasoned from the exact text available. |
| **Inference/recommendation** | My proposed improvement to make the book beginner-safe. |
| **Cannot verify** | The file omits a diagram, original source, complete lesson, or other material needed to check the claim. |

The GATE 2027 official syllabus page says the syllabus has been revised and links the CS syllabus. Its Theory of Computation section has the same four lines reproduced in the source: regular expressions and finite automata; context-free grammars and push-down automata; regular and context-free languages, pumping lemma; Turing machines and undecidability. See the [official GATE 2027 Test Papers & Syllabus page](https://gate2027.iitm.ac.in/exam_papers_and_syllabus). The direct CS PDF link shown on that official page is [CS_GATE2027_Syllabus.pdf](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf).

---

# PART 1. FEELINGS — 10 lines

1. I liked seeing six chapters in a sensible order, but I did not feel taught by this document; it only tells me what the book might contain.
2. I felt lost immediately at words such as *finite automaton, closure, pumping lemma, push-down automaton, recursive,* and *undecidable* because none is explained here.
3. I felt anxious when I saw the list jump from regular expressions to pumping lemmas without first showing me what an alphabet, string, language, or machine is.
4. I felt tricked by the phrase “4 topics ready” because the file also says the old lessons are written for people who already know the subject and must be rewritten.
5. The PYQ counts made the subject look manageable, but I would not trust them as a study plan until I can see the exact source paper, answer key, and missing figures for every question.
6. I felt most scared by Turing machines and undecidability because the plan gives no picture of a tape, a configuration, a machine that loops, or the difference between accepting and deciding.
7. I felt that CFGs and PDAs could become understandable if every derivation and every stack move were drawn one step at a time.
8. I felt “I can do this” when I saw that the plan separates regular languages, context-free languages, and Turing machines instead of mixing all the words together.
9. I would not pay ₹149 for this plan or for a rewrite promise; I need to see the actual beginner lesson, worked traces, diagrams, and fresh solved questions first.
10. **Would I pay ₹149 now? No.** I might pay after a tested pilot proves I can understand it alone, because that is exactly what my previous notes did not do.

---

# PART 2. GAP TABLE — 100 problems to fix

Priority means: **HIGH** = blocks a zero-level student or risks teaching a wrong idea; **MEDIUM** = important for completeness, accuracy, or exam readiness; **LOW** = enrichment or presentation polish.

| # | Where | What I could not understand or what is missing | Type | What to add or change | Priority |
|---:|---|---|---|---|---|
| 1 | Whole file, status | It says “contents list, not yet a full plan.” I cannot study from a list of six chapter names. | MISSING-PREREQUISITE | Keep this as a map, but create a lesson-level teaching plan before asking Claude to write chapters. | HIGH |
| 2 | Whole file, reader profile | The reader is called a dropper who will finish or first finish the C plan. It does not say what maths or discrete-maths knowledge is assumed. | MISSING-PREREQUISITE | State the exact starting level: arithmetic, sets, logic, functions, basic proof language, and reading notation. Teach any required piece before use. | HIGH |
| 3 | Whole file, notation | No lesson begins with alphabet, symbol, string, empty string, language, or machine. | MISSING-PREREQUISITE | Add a short “language and notation zero lesson” before Chapter 1. | HIGH |
| 4 | Whole file, symbols | I do not know the difference between `ε`, `∅`, `{ε}`, and `Σ*`. | UNEXPLAINED-WORD | Give four separate boxes with examples and non-examples; never use them interchangeably. | HIGH |
| 5 | Whole file, vocabulary | “Closure” appears as a chapter title with no plain-English explanation. | UNEXPLAINED-WORD | Explain “closed under an operation” using small sets/languages first, then formal notation. | HIGH |
| 6 | Whole file, proof method | The plan does not teach how to prove a statement or disprove it with a counterexample. | MISSING-PREREQUISITE | Add a proof toolkit: direct proof, contradiction, set inclusion, counterexample, induction, and “one counterexample is enough.” | HIGH |
| 7 | Whole file, question practice | There are no sample solved questions in the plan. | NEEDS-EXAMPLE | Add one fully worked easy question at the start of each new concept, then one GATE-level question. | HIGH |
| 8 | Whole file, learning sequence | It does not state which new words may be used only after they have been taught. | WRONG-ORDER | Add a glossary/first-use rule: define every term before using it in a question or solution. | HIGH |
| 9 | Whole file, 100-day reader | No lesson duration, revision plan, or priority system is provided. | WRONG-ORDER | Split into 45–90-minute lessons and mark [MUST], [SHOULD], [LATER] with a reason. | MEDIUM |
| 10 | Whole file, “4 topics ready” | “Ready” sounds finished, but the file says those old lessons need a complete rewrite. | FACT-DOUBT | Change status to “legacy draft exists; beginner rewrite not approved.” | HIGH |
| 11 | Chapter 1, title | “Regular expressions and finite automata” assumes I know what both parts mean. | MISSING-PREREQUISITE | Start with finite alphabets, strings, languages, and pattern recognition before the formal machines. | HIGH |
| 12 | Chapter 1, regex | No definition of a regular expression or the language it denotes. | UNEXPLAINED-WORD | Show symbol, union, concatenation, and Kleene star one at a time with tiny examples. | HIGH |
| 13 | Chapter 1, regex | The precedence of `*`, concatenation, and `+` is not specified. | MISSING-FINER-POINT | Teach precedence and parentheses; show two expressions that look similar but mean different languages. | HIGH |
| 14 | Chapter 1, regex | No explanation of `+` as union versus `+` as “one or more” in other notations. | FACT-DOUBT | Declare the notation used throughout the book and explicitly distinguish union `+` from positive closure `+` if that notation is used. | HIGH |
| 15 | Chapter 1, regex | I cannot tell what `ε` means inside a regular expression. | UNEXPLAINED-WORD | Explain that `ε` denotes the empty string and show how it differs from the empty language `∅`. | HIGH |
| 16 | Chapter 1, regex | No beginner examples for `a*`, `(ab)*`, `a+b`, or `Σ*`. | NEEDS-EXAMPLE | Show the first 5–8 strings generated by each expression and say why the next string is or is not included. | HIGH |
| 17 | Chapter 1, regex | No conversion process from a word description to a regular expression. | STEP-SKIPPED | Teach language descriptions such as “ends in 01,” “odd number of a's,” and “contains 101” before difficult expressions. | HIGH |
| 18 | Chapter 1, DFA | There is no definition of a DFA as states, alphabet, transition function, start state, and final states. | MISSING-PREREQUISITE | Define the five parts in plain English and show how one input symbol moves the machine. | HIGH |
| 19 | Chapter 1, DFA | No distinction between a state and an input symbol. | UNEXPLAINED-WORD | Use a small state diagram and a separate alphabet box. | HIGH |
| 20 | Chapter 1, DFA | No complete transition table or trace of a string. | NEEDS-TRACE | For each DFA example include input, current state, symbol read, next state, and final accept/reject result. | HIGH |
| 21 | Chapter 1, DFA | The plan does not say whether all DFA transition tables must be complete. | MISSING-FINER-POINT | Teach dead/sink states and explain that a complete DFA has exactly one transition per state-symbol pair. | MEDIUM |
| 22 | Chapter 1, NFA | No explanation of nondeterminism or why several next states can be possible. | UNEXPLAINED-WORD | Use a branching picture and explain acceptance as “at least one successful path.” | HIGH |
| 23 | Chapter 1, ε-NFA | No explicit epsilon-closure lesson. | MISSING-GATE-CONCEPT | Teach ε-closure by listing reachable states without consuming an input symbol. | HIGH |
| 24 | Chapter 1, NFA→DFA | No subset construction or the `2^n` upper bound appears in the contents. | MISSING-GATE-CONCEPT | Add a full subset-construction lesson with a 2- or 3-state example and an unreachable-subset note. | HIGH |
| 25 | Chapter 1, equivalence | No explanation that DFA, NFA, ε-NFA, and regular expressions describe the same class of languages. | MISSING-GATE-CONCEPT | Add a conversion/equivalence map, then teach each direction separately. | HIGH |
| 26 | Chapter 1, minimization | No DFA minimization, distinguishability, or minimal-state counting is named. | MISSING-GATE-CONCEPT | Add partition refinement/table-filling and distinguishability by suffix. | HIGH |
| 27 | Chapter 1, regex conversion | No Thompson construction, state elimination, or Arden-style method is named. | MISSING-GATE-CONCEPT | Include the methods at a GATE-appropriate level and mark which one is the primary hand-solving method. | MEDIUM |
| 28 | Chapter 1, diagrams | There is no statement that all automata diagrams must include start arrows, accepting double circles, and transition labels. | NEEDS-DIAGRAM | Set a consistent diagram convention and use it in every chapter. | HIGH |
| 29 | Chapter 2, closure | Closure properties are a title, not an explanation or a list of operations. | MISSING-PREREQUISITE | Teach union, intersection, complement, difference, concatenation, star, reversal, and homomorphism with explicit scope. | HIGH |
| 30 | Chapter 2, closure | It does not distinguish “closed under intersection” from “closed under intersection with a regular language.” | FACT-DOUBT | Put these in separate rows; regular ∩ CFL is CFL, but CFL ∩ CFL need not be CFL. | HIGH |
| 31 | Chapter 2, closure | No product-automaton construction is listed. | MISSING-GATE-CONCEPT | Show how paired states implement union/intersection and why the final-state rule changes. | HIGH |
| 32 | Chapter 2, decision properties | Emptiness, universality, finiteness, equivalence, and inclusion are absent. | MISSING-GATE-CONCEPT | Add a decision-properties table for regular languages and show the graph/search test behind each. | HIGH |
| 33 | Chapter 2, pumping lemma | The plan gives no quantifiers. I could easily think I choose the split myself. | FACT-DOUBT | Print the full quantifier order and explain who chooses the pumping length, word, split, and exponent. | HIGH |
| 34 | Chapter 2, pumping lemma | No proof idea for why a DFA with p states repeats a state after p symbols. | STEP-SKIPPED | Draw the p+1 visited states and the repeated-state loop. | HIGH |
| 35 | Chapter 2, pumping lemma | No instruction to handle every legal split. | MISSING-FINER-POINT | Add a “you must defeat every legal split” checklist and one complete proof. | HIGH |
| 36 | Chapter 2, pumping lemma | No warning that satisfying the pumping lemma does not prove a language regular. | FACT-DOUBT | Add a “necessary, not sufficient” warning with a counterexample reference. | HIGH |
| 37 | Chapter 2, non-regular proofs | No Myhill–Nerode theorem or distinguishable suffix method. | MISSING-GATE-CONCEPT | Add a practical distinguishability lesson for minimal-DFA lower bounds. | HIGH |
| 38 | Chapter 2, pumping length | No distinction between “a pumping length” and “the smallest pumping length.” | MISSING-FINER-POINT | Use the 2019 pumping-length question to teach that any valid sufficiently large p works. | MEDIUM |
| 39 | Chapter 2, examples | The plan does not promise worked examples of regularity and non-regularity. | NEEDS-EXAMPLE | Include `a^n`, `a^n b^n`, parity, modular counts, suffixes, and bounded-length examples. | HIGH |
| 40 | Chapter 2, proofs | No template for writing a non-regularity proof in exam time. | NEEDS-TRACE | Provide a five-step proof template and annotate a model answer. | MEDIUM |
| 41 | Chapter 2, counting | State counts for remainders, substrings, parity, and product states are not named. | MISSING-GATE-CONCEPT | Add state-design patterns and prove minimality rather than guessing state counts. | HIGH |
| 42 | Chapter 3, CFG | No formal definition of variables, terminals, start variable, and productions. | UNEXPLAINED-WORD | Introduce CFG components using one very small grammar. | HIGH |
| 43 | Chapter 3, derivation | No distinction between a derivation, sentential form, and generated string. | UNEXPLAINED-WORD | Define each with a three-step derivation and color non-terminals versus terminals. | HIGH |
| 44 | Chapter 3, parse trees | The contents do not mention parse trees or how to read leaves. | NEEDS-DIAGRAM | Include parse trees for every first grammar example. | HIGH |
| 45 | Chapter 3, leftmost/rightmost | No distinction between leftmost and rightmost derivations. | MISSING-GATE-CONCEPT | Show both derivations for one grammar/string and identify when two derivations are genuinely different. | HIGH |
| 46 | Chapter 3, ambiguity | The chapter name does not mention ambiguity or ambiguous grammars. | MISSING-GATE-CONCEPT | Add definition, two parse trees for one string, and the distinction between ambiguous grammar and inherently ambiguous language. | HIGH |
| 47 | Chapter 3, grammar language | No method for converting productions into a set-builder language description. | STEP-SKIPPED | Teach “what each recursive rule adds” using symbol counts and block order. | HIGH |
| 48 | Chapter 3, CFG cleanup | Useless, unit, and epsilon productions are not listed. | MISSING-GATE-CONCEPT | Include null/epsilon removal, unit removal, useless-symbol removal, and the correct order with examples. | MEDIUM |
| 49 | Chapter 3, normal forms | Chomsky Normal Form is not mentioned, despite a 2024 question on derivation steps in CNF. | MISSING-GATE-CONCEPT | Add CNF conversion and the `2n−1` derivation-step fact for nonempty strings under standard CNF. | HIGH |
| 50 | Chapter 3, normal forms | Greibach Normal Form is not mentioned. | MISSING-GATE-CONCEPT | Include its definition and basic use, but mark depth according to the question-bank evidence. | MEDIUM |
| 51 | Chapter 3, CYK | The membership algorithm for a CNF grammar is not mentioned. | MISSING-GATE-CONCEPT | Include one small CYK table and clearly mark whether it is a core or extension item. | MEDIUM |
| 52 | Chapter 3, PDA | No definition of PDA states, input, stack alphabet, transition, start state, and acceptance rule. | MISSING-PREREQUISITE | Define the machine and stack before showing any PDA diagram. | HIGH |
| 53 | Chapter 3, PDA notation | PDA edge labels such as `a, X → γ` are not explained. | UNEXPLAINED-WORD | Explain read/pop/push separately and then trace one transition. | HIGH |
| 54 | Chapter 3, stack | No picture of the stack top, bottom marker, push, pop, or empty stack. | NEEDS-DIAGRAM | Make every PDA solution show the whole stack after each input symbol. | HIGH |
| 55 | Chapter 3, PDA acceptance | Acceptance by final state versus empty stack is not distinguished. | MISSING-FINER-POINT | Teach both definitions and when equivalent constructions apply. | HIGH |
| 56 | Chapter 3, PDA↔CFG | The equivalence between CFGs and NPDAs is not named. | MISSING-GATE-CONCEPT | Add a concept map and one small conversion intuition in each direction. | HIGH |
| 57 | Chapter 3, DPDA/NPDA | Deterministic PDA and nondeterministic PDA are absent. | MISSING-GATE-CONCEPT | Add DPDA vs NPDA, DCFL subset of CFL, and the fact that not every CFL is deterministic. | HIGH |
| 58 | Chapter 3, grammar questions | No repeatable method for checking ambiguity or counting derivations. | NEEDS-TRACE | Use parse-tree counts and explicit leftmost/rightmost derivations; never assert “ambiguous” without a witness. | HIGH |
| 59 | Chapter 3, expression language | No expression grammar, precedence, or associativity example. | NEEDS-EXAMPLE | Include arithmetic-expression grammar as a familiar ambiguity example. | MEDIUM |
| 60 | Chapter 4, CFL closure | No list of CFL closure properties or counterexamples is given. | MISSING-GATE-CONCEPT | Teach union, concatenation, star, reversal, homomorphism, inverse homomorphism, and intersection with regular languages. | HIGH |
| 61 | Chapter 4, CFL non-closure | It does not explicitly say CFLs are not closed under intersection or complement. | FACT-DOUBT | Add standard counterexample pairs and derive `a^n b^n c^n` as an intersection example. | HIGH |
| 62 | Chapter 4, difference | No explanation of why CFL minus regular is CFL, but CFL minus CFL need not be. | MISSING-FINER-POINT | Add the identity `L1−R = L1 ∩ complement(R)` and explain the closure used. | HIGH |
| 63 | Chapter 4, CFL pumping lemma | No full five-piece pumping lemma is stated. | MISSING-GATE-CONCEPT | Give `w=uvxyz`, the length constraints, and the simultaneous pumping rule in full. | HIGH |
| 64 | Chapter 4, CFL pumping proof | No parse-tree reason for the lemma or explanation of the short middle window. | STEP-SKIPPED | Draw repeated variables on one root-to-leaf path and identify the pumped pieces. | HIGH |
| 65 | Chapter 4, CFL pumping proof | No warning that both pumped pieces use the same exponent. | MISSING-FINER-POINT | Show `uv^i x y^i z`, including the case where one pumped piece is empty. | HIGH |
| 66 | Chapter 4, non-CFL proofs | No examples or full proof strategy for three dependent blocks. | NEEDS-EXAMPLE | Work through `a^n b^n c^n` and one variation with every legal split addressed. | HIGH |
| 67 | Chapter 4, classification | The relationship among regular, CFL, DCFL, recursive, and RE languages is not shown. | NEEDS-DIAGRAM | Use a carefully qualified hierarchy diagram; explain that recursive and RE are different dimensions from the grammar classes. | MEDIUM |
| 68 | Chapter 4, decision problems | No decision facts for CFG/CFL membership, emptiness, finiteness, equivalence, or universality. | MISSING-GATE-CONCEPT | Add a yes/no decision table and identify which problems are decidable or undecidable. | HIGH |
| 69 | Chapter 4, deterministic CFL | The plan does not say how DCFL differs from CFL or what is not closed for DCFL. | MISSING-FINER-POINT | Include core examples and a closure caveat; avoid overloading a beginner with every advanced theorem. | MEDIUM |
| 70 | Chapter 4, proofs | No comparison of regular pumping and CFL pumping is promised. | WRONG-ORDER | Teach the regular lemma first, then explicitly compare the number of pieces and quantifiers. | HIGH |
| 71 | Chapter 4, grammar-language examples | No guided practice to identify a CFL from a complicated set-builder definition. | NEEDS-TRACE | Use block-order, symbol-count, and nested-dependency sketches before choosing the language class. | HIGH |
| 72 | Chapter 4, closure examples | No small counterexample library is specified. | NEEDS-EXAMPLE | Build a one-page “closed / not closed” reference with a worked witness for each non-closure claim. | MEDIUM |
| 73 | Chapter 5, Turing machine | There is no plain-English model of a tape, head, state, and transition. | MISSING-PREREQUISITE | Start with the machine as a reader/writer moving over tape cells; label every part. | HIGH |
| 74 | Chapter 5, configuration | No configuration notation or one-step transition trace is listed. | NEEDS-TRACE | Show state, tape contents, head position, and next configuration after each move. | HIGH |
| 75 | Chapter 5, outcomes | Accept, reject, halt, and loop are not distinguished. | UNEXPLAINED-WORD | Use four separate execution examples; a loop is not the same as rejection. | HIGH |
| 76 | Chapter 5, recognizer/decider | No clear distinction between a recognizer (may loop on nonmembers) and a decider (halts on every input). | MISSING-GATE-CONCEPT | Add a two-column run-outcome table for members and nonmembers. | HIGH |
| 77 | Chapter 5, recursive/RE | “Recursive” and “recursively enumerable” appear only as technical words in PYQs. | UNEXPLAINED-WORD | Explain decidable/recursive and recognizable/RE, plus the complement theorem. | HIGH |
| 78 | Chapter 5, TM variants | No treatment of nondeterministic TMs, multi-tape TMs, or equivalent variants. | MISSING-FINER-POINT | Explain equivalence in computability power without implying equal running time. | MEDIUM |
| 79 | Chapter 5, computable functions | The function-computability model in the 2017 PYQ is not named in the chapter contents. | MISSING-GATE-CONCEPT | Add total computable functions, output-on-tape, and graph language `{x#f(x)}`. | MEDIUM |
| 80 | Chapter 5, closure | No closure properties of recursive and RE languages are mentioned. | MISSING-GATE-CONCEPT | Add union/intersection/complement distinctions, with a proof idea or counterexample for each. | HIGH |
| 81 | Chapter 5, examples | No Turing-machine construction examples are promised. | NEEDS-EXAMPLE | Include simple unary counter, copy, compare, and scan-to-end examples at GATE level. | MEDIUM |
| 82 | Chapter 5, trace diagrams | No tape snapshot series is required. | NEEDS-DIAGRAM | For each TM trace show tape cells, head, state, and transition. | HIGH |
| 83 | Chapter 6, undecidability | “Undecidability” is named but no definition of a decision problem is given. | UNEXPLAINED-WORD | Begin with yes/no questions about encoded machines and what an algorithm must guarantee. | HIGH |
| 84 | Chapter 6, reductions | No mapping reduction or reduction direction appears. | MISSING-GATE-CONCEPT | Teach reductions as a translation from a known hard problem and draw the direction carefully. | HIGH |
| 85 | Chapter 6, halting | The halting problem and its proof are not named. | MISSING-GATE-CONCEPT | Include the diagonal contradiction with a runnable “assume a perfect predictor” story. | HIGH |
| 86 | Chapter 6, Rice theorem | Rice’s theorem is not named, yet several supplied PYQs require semantic properties of TM languages. | MISSING-GATE-CONCEPT | Teach nontrivial semantic properties, then explain what Rice does and does not cover. | HIGH |
| 87 | Chapter 6, Rice theorem | No distinction between semantic properties of accepted languages and syntactic properties of machine descriptions. | MISSING-FINER-POINT | Give one example of each; do not apply Rice theorem to syntax-only or bounded-step properties. | HIGH |
| 88 | Chapter 6, CFG decision problems | Equivalence/intersection emptiness/universality questions for CFGs are not organized. | MISSING-GATE-CONCEPT | Include a decision table: CFG emptiness and membership are decidable; several comparison/universality problems are undecidable. | HIGH |
| 89 | Chapter 6, TM decision problems | Emptiness, universality, equivalence, regularity of a TM language, and finite-cardinality properties are not listed. | MISSING-GATE-CONCEPT | Add a problem-by-problem table and the correct theorem/reduction used for each. | HIGH |
| 90 | Chapter 6, PCP | Post Correspondence Problem is not mentioned. | MISSING-GATE-CONCEPT | Include PCP as a standard undecidability example; mark exact depth as an exam-oriented extension if not evidenced by this bank. | MEDIUM |
| 91 | Chapter 6, countability | Countable versus uncountable sets of languages/programs are not mentioned, despite a supplied PYQ. | MISSING-GATE-CONCEPT | Explain finite strings/programs are countable but the power set of an infinite countable set is uncountable. | HIGH |
| 92 | Chapter 6, bounded computation | No distinction between a bounded number of steps and unrestricted halting is explained. | MISSING-FINER-POINT | Use the 2021 bounded-2021-step question as a counterexample to overusing Rice/halting claims. | HIGH |
| 93 | Chapter 6, proof method | No decision tree exists for deciding whether a problem is decidable. | NEEDS-TRACE | Use: finite search? known algorithm? Rice property? reduce from a known undecidable problem? | MEDIUM |
| 94 | Chapter 6, language classes | The relation between recursive languages and RE languages is not stated. | NEEDS-DIAGRAM | Show recursive ⊂ RE and explain that a language and its complement both RE iff it is recursive. | HIGH |
| 95 | PYQ bank, 2026_FN_Q52 | The source writes `S → abaaBAbba`; the official GATE 2026 CS1 paper has `S → abaABAbba`. | FACT-DOUBT | Correct the production from the official PDF before using the answer or deriving the count invariant. | HIGH |
| 96 | PYQ bank, 2020_FN_Q22 | All four options carry “✔ official” in the source. This MCQ had no valid option and the official key awarded Marks To All. | FACT-DOUBT | Record `MTA` as the official scoring result; do not teach that all four expressions are correct. | HIGH |
| 97 | PYQ bank, figure questions | Fourteen question records contain `[IMAGE...]` placeholders; the diagrams themselves are absent. | NEEDS-DIAGRAM | Attach the original figure for each one and keep it with the exact official question ID. | HIGH |
| 98 | PYQ bank, source audit | No official paper URL or official key URL is stored beside each question. | FACT-DOUBT | Add source paper, source page, official key, and final key status to every record. | HIGH |
| 99 | PYQ bank, Forge questions | “24 Forge questions” are counted but not listed in this file. | FACT-DOUBT | Attach the 24 generated questions with solutions and provenance so they can be checked for duplication and correctness. | MEDIUM |
| 100 | PYQ bank, difficulty | Easy/Medium/Hard labels have no rubric. | FACT-DOUBT | Define difficulty by prerequisite load, number of reasoning steps, and likely solving time; then have two reviewers calibrate labels. | MEDIUM |

---

# PART 3. WHAT A COMPLETE SUBJECT MUST HAVE

## Official syllabus boundary

The official GATE 2027 CS syllabus page links a revised syllabus. The Theory of Computation wording is four broad lines. The attached file reproduces those four lines correctly at the broad-topic level. Those lines do **not** spell out every theorem or construction, so a textbook needs a carefully designed supporting scope without pretending every enrichment item is explicitly named in the syllabus.

| Official syllabus line | What the book should teach under it | Frequency from this file | Typical question style | Zero-level prerequisite |
|---|---|---|---|---|
| Regular expressions and finite automata | RE syntax/semantics; DFA; NFA; ε-NFA; subset construction; equivalence; DFA minimization; state counting; conversions. | Bank: 26 questions, 40 marks. Exact all-GATE frequency: **not sure**. | Build/trace DFA; identify language; convert RE↔FA; count/minimize states; compare automata. | Sets, symbols, strings, reading tables, simple patterns. |
| Context-free grammars and push-down automata | CFG rules; derivations; parse trees; ambiguity; grammar-language descriptions; PDA stack and transitions; CFG-PDA relation; DPDA/NPDA. | Bank: 14 questions, 22 marks. Exact all-GATE frequency: **not sure**. | Derive a string; identify a language; ambiguity; count symbols; trace PDA stack; recognize DPDA/CFL facts. | Sets/strings, recursion-like rules, trees, stack idea. |
| Regular and context-free languages, pumping lemma | Closure properties; decision properties; regular pumping lemma; CFL pumping lemma; Myhill–Nerode; counterexamples and class relationships. | Bank: 25 questions, 40 marks. Exact all-GATE frequency: **not sure**. | Decide regular/CFL status; identify closure; construct counterexample; prove non-regular/non-CFL; distinguish states. | Set operations, implication, quantifiers, proof by contradiction. |
| Turing machines and undecidability | TM configurations and traces; recognizers/deciders; recursive/RE; computable functions; decidability; reductions; halting; Rice; standard undecidable languages. | Bank: 12 questions, 19 marks. Exact all-GATE frequency: **not sure**. | Classify a decision problem; apply Rice; distinguish bounded from unbounded simulation; reason about recursive/RE; prove via reduction. | Algorithms as procedures, binary strings/encodings, quantifiers, proof by contradiction. |

**Important interpretation:** the attached file labels topic categories coarsely. It groups regular-language closure and pumping questions into one bucket, and it groups both Turing machines and undecidability into one bucket. Do not assign those aggregate marks to individual chapters without recategorising the original questions.

## Detailed coverage checklist — items not actually specified in the v0 contents

Because the attached file lists only chapter titles, every item below is **not specified in this plan**. That does not prove the old app lessons omit it; the app lessons were not attached for inspection.

| Area | Required topic / finer sub-topic | Syllabus line served | Bank evidence / frequency | Typical question | Beginner prerequisite |
|---|---|---|---|---|---|
| Foundations | Alphabet, symbol, string, empty string, string length, concatenation, powers, reversal | All four | Foundation; frequency not sure | Interpret formal language notation | Counting, basic sets |
| Foundations | Language as a set of strings; subset, equality, union, intersection, complement | Regular/CFL languages | Closure questions throughout | Decide inclusion/equality or closure | Set notation |
| Foundations | `ε`, `∅`, `{ε}`, `Σ`, `Σ*` | Regular expressions and FA | Foundation; frequency not sure | Interpret regex, grammar and machine language | Symbols and sets |
| Foundations | Quantifiers: “for all”, “there exists”; order of choices | Pumping lemma; undecidability | Pumping/proof questions | Check whether a proposed proof is valid | Basic logic |
| Foundations | Direct proof, contradiction, induction, counterexample | All | Used repeatedly; frequency not separate | Disprove a claim / prove invariant | Propositions and algebra |
| Regular expressions | Literal symbols, union, concatenation, Kleene star, parentheses | Regular expressions and FA | 26 questions / 40 marks in bank | Generate or identify a language | Strings and concatenation |
| Regular expressions | Precedence, associativity, language identities, `ε` and `∅` | Same | Within 26-question bucket | Simplify/compare expressions | Algebra of sets |
| Regular expressions | Describing “starts/ends/contains/avoids/parity/modular count” | Same | Repeated in bank | Construct regular expression or DFA | Counting and patterns |
| Finite automata | Formal DFA tuple, transition function, accepting state | Same | Within 26-question bucket | Trace input / build machine | Tables and state ideas |
| Finite automata | Extended transition function and multiple-symbol input | Same | 2017 ε-NFA-style question; exact count in bank | Compute state set after a word | Single-step transition |
| Finite automata | DFA completeness and sink state | Same | Frequency not sure | Complete/minimize a table | DFA traces |
| Finite automata | NFA semantics and path-based acceptance | Same | Multiple bank entries | Decide whether any path accepts | Branching diagrams |
| Finite automata | ε-closure and ε-NFA trace | Same | Figure questions include ε-NFAs | Compute reachable state set | NFA transitions |
| Finite automata | Subset construction NFA→DFA; `2^n` bound | Same | 2025/2026 bank examples; overall 26 bucket | Bound possible DFA states | Set of states |
| Finite automata | DFA/NFA/ε-NFA/RE equivalence | Same | Multiple conversion items | Convert/compare representations | DFA and regex basics |
| Finite automata | Thompson construction and state elimination | Same | Exact frequency not sure | Build automaton from expression / expression from diagram | Regex operations |
| Finite automata | Arden’s lemma (if used) | Same | Frequency not sure | Solve state equations | Algebraic manipulation |
| Finite automata | Product construction for union/intersection/difference | Regular languages | Closure bucket; exact count not separated | Construct product DFA | Pair of states |
| Finite automata | DFA minimization via table filling/partition refinement | Same | Bank label explicitly includes minimization | Minimal state count | Distinguish final/non-final |
| Finite automata | Distinguishable strings/suffixes; Myhill–Nerode theorem | Regular languages | 2024 bank question on distinguishability | Prove lower bound on states | Equivalence of states |
| Finite automata | Counting accepted strings of exact length via transitions/matrices | Regular languages | 2021 figure NAT | Count paths/strings | Transition graph, counting |
| Regular languages | Closure under union, intersection, complement, difference | Regular languages, pumping lemma | Bank closure questions | Choose always-true statement | Set operations |
| Regular languages | Closure under concatenation, Kleene star, reversal, homomorphism | Same | Exact per-operation count not given | Decide whether a constructed language remains regular | Regex operations |
| Regular languages | Membership, emptiness, universality, finiteness, equivalence, inclusion | Same | Several decision-style items | Decide a property of DFA/RE | Graph reachability |
| Regular languages | Pumping lemma statement with correct quantifiers | Pumping lemma | Bank topic bucket 25 includes pumping; frequency not split | Choose pumping length / prove nonregular | Quantifiers and strings |
| Regular languages | Standard nonregular examples and split handling | Same | Bank examples include `a^n b^n`-style arguments | Prove nonregularity | Pumping lemma |
| Regular languages | Pumping length need not be minimum | Same | 2019 question | Choose a valid pumping length | Lemma quantifiers |
| CFG | Formal tuple, variables/nonterminals, terminals, productions, start symbol | CFG and PDA | Bank: 14 questions | Interpret a grammar | Strings and rewriting |
| CFG | Derivation, sentential form, leftmost/rightmost derivation | Same | Multiple ambiguity/grammar items | Derive a string | Rule application |
| CFG | Parse tree, yield, grammar-language description | Same | Multiple bank items | Determine generated language | Trees and derivation |
| CFG | Ambiguity and inherently ambiguous languages | Same | 2026/2023 style items | Find two parse trees/derivations | Parse trees |
| CFG | Grammar for a block language; symbol-count invariants | Same | Repeated bank patterns | Identify language or prove count relation | Arithmetic and induction |
| CFG | Epsilon/null, unit and useless production removal | Supporting technique for CFG/PDA | Frequency not sure | Simplify grammar | Derivation |
| CFG | CNF conversion and exceptional start-symbol handling | Supporting technique for CFG/PDA | 2024 CNF derivation-step item | Count derivation steps / normalize | Production rules |
| CFG | GNF definition/conversion | Supporting technique | Frequency not sure | Identify normal form | CFG basics |
| CFG | CYK membership algorithm | Supporting technique | Frequency not sure | Fill triangular table | CNF and dynamic table reading |
| PDA | Formal definition and transition semantics | CFG and PDA | Bank: 14 questions | Trace PDA / describe language | Stack operations |
| PDA | Stack alphabet, bottom marker, push/pop, ε moves | Same | Figure PDA questions | Trace configurations | Stack basics |
| PDA | Final-state versus empty-stack acceptance | Same | Standard PDA concept; bank frequency not split | Compare machine descriptions | PDA basics |
| PDA | Equivalence of NPDA and CFG | Same | Standard core theory | Recognize same CFL class | CFG + PDA |
| PDA | DPDA, NPDA, DCFL and examples | Same | 2025 DPDA question | Classify deterministic acceptance | PDA nondeterminism |
| CFL | Closure under union, concatenation, star, reversal | Regular/CFL languages | Bank closure items | Mark closure statements | Set operations |
| CFL | Closed under intersection with a regular language | Same | 2021-style item | Simplify expressions using closure | Regular closure + CFL |
| CFL | Not closed under intersection/complement/difference (general case) | Same | 2017/2022/2023/2025 style | Choose non-closure fact | Counterexample method |
| CFL | Pumping lemma with five pieces and simultaneous pumping | Pumping lemma | In 25-question bank bucket, exact split not stated | Prove a language non-CFL | Parse tree and quantifiers |
| CFL | Standard non-CFL examples and how to defeat all splits | Same | Several bank questions compare languages | Classify tricky block-count languages | CFL pumping lemma |
| CFL | Decision properties: membership, emptiness, finiteness decidable; universality/equivalence generally undecidable | CFG/PDA; undecidability | Multiple questions | Decide a problem | Algorithms and reductions |
| CFL | Recursive languages vs CFLs; DCFL relationship | Regular/CFL languages | Mixed with TM bucket | Class inclusion/closure | Language hierarchy |
| Turing machines | Formal machine model, tape, head, state, transition function | Turing machines | Bank: 12 questions combined | Trace a computation | Finite-state machine intuition |
| Turing machines | Configuration/instantaneous description and one-step move | Same | Frequency not separately stated | Trace a machine | Tape notation |
| Turing machines | Halting, accepting, rejecting, looping | Same | Q about “decides” | Distinguish outcomes | TM run |
| Turing machines | Recognizer vs decider | Same | 2026/2021 style questions | Classify a language | Accept/reject/loop |
| Turing machines | Recursive (decidable) and RE (recognizable) languages | Same | Repeated bank topic | Class inclusion/complement claims | Logic and machine outcome |
| Turing machines | `L` and complement both RE iff L recursive | Same | 2022 style item | Apply theorem | RE/recursive definitions |
| Turing machines | Closure properties of recursive and RE classes | Same | Repeated bank items | Determine whether union/intersection/complement remains in class | Closure table |
| Turing machines | Computable total functions and graph languages | Same | 2017 question | Decide relation between function and graph | Function, encodings |
| Turing machines | Multitape/nondeterministic variants and equivalent power | Same (supporting detail) | Frequency not sure | Compare machine models | TM definition |
| Undecidability | Decision problem, encoding of machine/input | Undecidability | Repeated | Classify a yes/no problem | Strings and encoding |
| Undecidability | Halting problem and diagonal argument | Same | Core theorem; count not split | Show no universal decider | Contradiction |
| Undecidability | Mapping reductions and reduction direction | Same | Core proof tool | Reduce known problem to target | Halting problem |
| Undecidability | Rice’s theorem and semantic vs syntactic properties | Same | Several bank questions | Identify undecidable language properties | TM language semantics |
| Undecidability | Emptiness, universality, equivalence, regularity of TM languages | Same | Explicit 2018/2020/2022/2025-style items | Classify decision problems | Rice + reductions |
| Undecidability | Bounded-step simulation is decidable | Same | 2021 question | Distinguish bounded from unbounded runtime | Finite simulation |
| Undecidability | Countability of TMs/programs vs uncountability of all languages | Same / supporting concept | 2019 question | Countability statement | Countable sets |
| Undecidability | Post Correspondence Problem | Beyond named wording, standard ToC supporting topic | Exact frequency in this bank: not sure | Recognize a standard undecidable problem | Strings and reductions |
| Scope control | Context-sensitive grammars, LBA, full Chomsky hierarchy | Not explicitly named in GATE line | Exact frequency in this bank: not sure | Usually supporting classification | CFG and TM basics |
| Scope control | Complexity classes P, NP, NP-completeness | Not in the four supplied ToC syllabus lines | Not part of this ToC plan | Do not quietly add a full complexity chapter | Algorithms/complexity foundations |

### Subject completeness verdict

The current six headings are a reasonable skeleton, but they are not a complete subject specification. In particular, the plan does not name **minimization/Myhill–Nerode, automata conversions, CFG derivations and ambiguity, CNF, PDA acceptance conventions, DPDA/DCFL, the CFL pumping lemma, recognizer-vs-decider, reductions, Rice’s theorem, and computable functions**. These should be visible in the contents and lesson map before writing starts.

Do not turn every topic from a full university Theory of Computation course into an equal-priority GATE chapter. The GATE line is broad; enrich where it helps solve GATE questions, but mark context-sensitive languages, deep PCP proofs, advanced hierarchy theorems, and complexity classes appropriately rather than making the book endless.

---

# PART 4. THE DIAGRAMS I NEED

The book should not use pictures as decoration. Every diagram must answer a question a beginner would otherwise struggle to imagine. Use the same notation throughout: start arrow, double-circle accepting states, labelled transitions, `ε` for empty input, and a clearly marked stack top/tape head.

## Before Chapter 1 — language notation

| Diagram | What to draw | What I should notice | Format |
|---|---|---|---|
| Alphabet vs string vs language | A symbol set `{a,b}`, example strings `ε, a, ab, bba`, and a set of strings as one language | A language is a *set of strings*, not a single string | Single picture |
| `ε` vs `∅` vs `{ε}` | Three separate boxes, showing membership and number of strings | Empty string is one string; empty language has no strings | Single picture |
| String concatenation | `ab` joined with `ba` to make `abba`; a length label | Concatenation joins; it does not add a separator | Step-by-step series |
| Set operations | Two overlapping circles for union/intersection/difference | Membership depends on which set contains the string | Single picture |
| Quantifier order | “I choose p, you choose w, you choose split” timeline | In pumping proofs, the order of choices matters | Single picture |

## Chapter 1 — regular expressions and finite automata

| Diagram | What to draw | What I should notice | Format |
|---|---|---|---|
| DFA anatomy | Start arrow, states, final double circle, labelled arrows | A state is the machine’s memory; input changes the state | Single picture |
| DFA run | A DFA for strings ending in `01`, with each consumed symbol highlighted | The same machine can accept one string and reject another | Step-by-step series + trace table |
| Transition table | Rows as states, columns as symbols | Every state-symbol pair has one next state in a complete DFA | Single picture |
| Dead/sink state | An explicit sink state with self-loops | Once entered, the string cannot be accepted | Single picture |
| NFA branching | One input symbol with two possible next states | NFA accepts if at least one path finishes in a final state | Step-by-step series |
| ε-closure | Arrows labelled ε, with reachable states circled | ε moves consume no input symbol | Step-by-step series |
| NFA subset construction | NFA state subsets on the left, DFA subset states on the right | A DFA state represents a *set* of NFA states | Step-by-step series + table |
| Regex operator meaning | Small examples of union, concatenation, star | `*` means zero or more repetitions; `ε` is allowed | Single picture + example string lists |
| Thompson fragments | Tiny NFA for a symbol, union, concatenation, star | Complex regular expressions are built from smaller fragments | Step-by-step series |
| DFA/regex conversion | A small DFA and its expression equations / eliminated state | Removing a state adds paths rather than deleting behaviour | Step-by-step series |
| DFA minimization | Initial final/nonfinal partition, split partitions, final blocks | States merge only when no suffix can distinguish them | Step-by-step series + table |
| Distinguishing suffix | Two states and one suffix that causes different accept/reject outcomes | One suffix proves the states are different | Single picture + trace |
| Product DFA | Grid of state pairs with accepting pair rules | Union/intersection use the same product states but different final-state tests | Single picture |

## Chapter 2 — regular languages, closure, and pumping lemma

| Diagram | What to draw | What I should notice | Format |
|---|---|---|---|
| Closure operation map | Two input language boxes and the resulting language under each operation | Closure is a guarantee about every pair of languages in the class | Single picture |
| Product construction for intersection | Pair states and mark only pairs where both components accept | Both machines must accept | Step-by-step series |
| Product construction for union | Same pair graph but mark pairs where at least one accepts | One accepting component is enough | Step-by-step series |
| Pumping loop in DFA | First `p+1` visited states and repeated state | A loop must appear among p+1 states; the loop is the pumpable part | Single picture |
| Pumping split | `w=xyz` with `|xy|≤p`, `|y|≥1` highlighted | The pumped section lies early in the string | Single picture |
| Quantifier order | A sequence: adversary picks p → student picks w → adversary picks split → student picks i | I must handle every legal split | Step-by-step series |
| Pumping proof example | `a^p b^p` with all allowed positions of `y` grouped | The argument must cover every legal location of the loop | Step-by-step series + trace table |
| Myhill–Nerode distinguishability | Two prefixes followed by the same suffix producing different acceptance | A machine must remember the distinction | Single picture |
| State-counting residues | A cycle of remainder states for counting symbols modulo k | Each state represents a different remainder | Single picture + trace table |

## Chapter 3 — CFGs and PDAs

| Diagram | What to draw | What I should notice | Format |
|---|---|---|---|
| Grammar anatomy | Terminals, variables, start variable, production arrows | Only variables can be expanded; terminals remain in the final string | Single picture |
| Derivation | A sequence from start symbol to a terminal string | Each step replaces one selected variable | Step-by-step series |
| Parse tree | Root start variable, production children, terminal leaves | Reading leaves left to right gives the generated string | Single picture |
| Leftmost vs rightmost | Two derivation columns for one string | Different derivation order may still describe the same parse tree | Side-by-side trace |
| Ambiguity | Two distinct parse trees with identical leaf string | Two parse trees for one string prove grammar ambiguity | Side-by-side pictures |
| Language from grammar | Rule additions highlighted; counts for `a` and `b` updated | Recursive rules change counts in predictable ways | Trace table |
| CFG simplification | Before/after grammar for ε-, unit-, and useless-rule removal | Each cleanup step changes the grammar carefully; it must preserve the language (with the standard start-symbol exception) | Step-by-step series |
| CNF shape | `A→BC` or `A→a` and a parse tree for a length-n string | Binary internal nodes and terminal leaves explain `2n−1` steps | Single picture + derivation trace |
| CYK table | Triangular substring table | Each cell answers whether a variable generates that substring | Trace table |
| PDA anatomy | Input tape, finite control, stack, bottom symbol | The stack gives unbounded last-in-first-out memory | Single picture |
| PDA transition | Read symbol / pop top / push replacement | A transition can do all three in one move | Step-by-step series |
| PDA stack trace | Stack contents after each input symbol | Mark the stack top consistently | Trace table |
| Empty-stack vs final-state acceptance | Same run shown with two different acceptance conventions | A machine can accept under one convention; the definition matters | Side-by-side pictures |
| CFG↔PDA intuition | Parse tree growth versus stack expansion | The stack can store unfinished grammar obligations | Single picture |
| DPDA vs NPDA | A deterministic single next move versus branching alternatives | Deterministic choice is a stronger restriction | Side-by-side picture |

## Chapter 4 — CFL properties and pumping lemma

| Diagram | What to draw | What I should notice | Format |
|---|---|---|---|
| Regular/CFL relationship | Regular languages inside CFLs; separate recursive/RE overlay kept distinct | These are different classification axes; do not draw misleading single nested circles | Single picture with labels |
| CFL closure table | Each operation and a check mark or cross with an example | CFLs are closed under union/concatenation/star but not general intersection/complement | Single picture/table |
| Intersection counterexample | Two CFLs whose intersection is `a^n b^n c^n` | The intersection can impose three linked counts | Step-by-step series |
| CFL pumping lemma | Parse tree with repeated variable on one root-to-leaf path | The repeated variable creates two pumped sections | Single picture |
| Five-piece split | `u v x y z`, with the short middle window `vxy` highlighted | `v` and `y` are pumped together with the same exponent | Single picture |
| Three-block non-CFL proof | `a^p b^p c^p` with a window too short to reach all three blocks | Some block count must break under pumping | Step-by-step series |
| Closure proof by regular intersection | CFL machine intersected with a DFA constraint | A regular condition can filter a CFL without leaving CFL | Single picture |

## Chapter 5 — Turing machines

| Diagram | What to draw | What I should notice | Format |
|---|---|---|---|
| TM anatomy | Tape cells, read/write head, current state, transition rule | The tape is not a stack; the head moves left/right and can rewrite | Single picture |
| Configuration | Tape contents, head position, state in one snapshot | A configuration records the entire current computation state | Step-by-step series |
| TM trace | One move per row with old/new symbol and head movement | Never skip a transition | Trace table |
| Accept/reject/loop | Three short machine runs | Looping is not rejecting; a recognizer may never halt on a nonmember | Side-by-side series |
| Recognizer vs decider | Two-column outcomes for members and nonmembers | A decider halts on every input; a recognizer need not | Single picture |
| Multi-tape simulation idea | Two/three tapes represented by tracks on one tape | Variants may change efficiency but not computability power | Single picture |

## Chapter 6 — undecidability

| Diagram | What to draw | What I should notice | Format |
|---|---|---|---|
| Decision problem | Encoded input → yes/no algorithm → guaranteed halt | Decidable means the algorithm always finishes with the right yes/no answer | Single picture |
| Recursive vs RE | Decider and recognizer flowcharts | RE may loop on nonmembers; recursive always halts | Side-by-side picture |
| Complement theorem | Two recognizers for L and complement running in dovetailing steps | If both sides are RE, one must eventually accept, giving a decider | Step-by-step series |
| Bounded simulation | A finite horizon of 100/2021 steps | A fixed time bound is fundamentally different from unrestricted halting | Timeline |
| Halting diagonal argument | Assume a halting decider, then build a program that contradicts its answer on its own code | The contradiction comes from self-reference | Step-by-step series |
| Mapping reduction | Source instance → computable transformation → target instance | A solver for the target would solve the source | Single picture |
| Rice theorem | Semantic property of `L(M)` versus syntactic property of code/description | Rice applies to nontrivial semantic properties, not every question about a TM | Comparison table |
| Countability | List all programs versus all subsets of strings | There are countably many finite descriptions but uncountably many languages | Single picture |
| PCP | Domino tiles with top and bottom strings; matching sequence | A finite sequence of choices can encode an undecidable problem | Step-by-step series |

---

# PART 5. THE FULL PLAN, CHAPTER BY CHAPTER

These are proposed lesson units, not claims about what the old app lessons already contain. Each lesson should take 45–90 minutes of reading and should end with a short self-check. The first time a term appears, define it in ordinary English before giving the formal definition.

## Foundation lesson — before Chapter 1

### F0. Symbols, strings, languages, and proof language — 60 minutes — [MUST]
- **Why:** Without this, every later chapter feels like a foreign language.
- **Prerequisites:** Basic counting and set notation; teach these from scratch if needed.
- **Beginner must see:** alphabet vs string vs language; empty string vs empty set; concatenation; `Σ*`; membership and subset.
- **Finer points:** `ε`, `∅`, `{ε}`, `Σ+`; string powers; complement depends on the chosen alphabet.
- **GATE-level items:** parse set-builder notation; identify valid strings; simple set operations.
- **Diagrams:** the four foundation diagrams in Part 4.
- **Hand traces:** build strings from `Σ={a,b}`; decide whether `ε`, `a`, `ab`, and `ba` belong to a sample language.
- **Common mistakes:** mixing `ε` and `∅`; treating a language as a grammar; forgetting the alphabet when taking a complement.

## Chapter 1 — Regular expressions and finite automata

### 1.1. What is a regular language? — 60 minutes — [MUST]
- **Prerequisites:** F0.
- **Beginner must see:** a language as a set of strings; patterns such as “ends in 01.”
- **Finer points:** finite vs infinite languages; the machine is a finite-memory recognizer.
- **GATE items:** membership and simple language recognition.
- **Diagrams:** alphabet/string/language picture; pattern-to-string examples.
- **Hand traces:** test 8 sample strings against two simple pattern descriptions.
- **Common mistakes:** assuming every language described by a short sentence is regular.

### 1.2. DFA from zero — 75 minutes — [MUST]
- **Prerequisites:** 1.1 and tables.
- **Beginner must see:** state, transition, start state, final state; read one symbol at a time.
- **Finer points:** complete transition function, dead state, `δ*` / extended transition function.
- **GATE items:** construct and trace DFAs for suffix, substring, parity, and remainder conditions.
- **Diagrams:** DFA anatomy, table, and run series.
- **Hand traces:** manually run at least three accepted and three rejected strings.
- **Common mistakes:** treating a state as an input symbol; forgetting the start state; accepting before all input is consumed.

### 1.3. NFA and ε-NFA — 75 minutes — [MUST]
- **Prerequisites:** 1.2.
- **Beginner must see:** multiple possible next states; ε-moves consume no symbol; one accepting path is enough.
- **Finer points:** ε-closure before and after consuming each input character.
- **GATE items:** compute state sets reached after an input; identify accepted language.
- **Diagrams:** branching NFA and ε-closure frames.
- **Hand traces:** trace a short word and list the active-state set at every step.
- **Common mistakes:** treating NFA paths as simultaneous machine runs; consuming input during an ε-move.

### 1.4. NFA to DFA — 60 minutes — [MUST]
- **Prerequisites:** 1.3 and finite sets.
- **Beginner must see:** one DFA state represents a subset of NFA states.
- **Finer points:** empty subset, unreachable subsets, upper bound `2^n` not necessarily attained.
- **GATE items:** state-count bounds and subset construction.
- **Diagrams:** subset-construction table and paired state graph.
- **Hand traces:** complete one 2-state and one 3-state example.
- **Common mistakes:** counting all `2^n` subsets as necessarily reachable or minimal.

### 1.5. Regular expressions and conversions — 75 minutes — [MUST]
- **Prerequisites:** F0, 1.2, 1.3.
- **Beginner must see:** union, concatenation, star; meaning of `ε` and `∅`; precedence.
- **Finer points:** equivalence identities, regex to ε-NFA, state elimination; introduce Arden’s lemma if the chosen GATE scope needs it.
- **GATE items:** identify the language of an expression and convert automata to expressions.
- **Diagrams:** regex fragments and conversion frames.
- **Hand traces:** list strings for expressions; build one ε-NFA; eliminate one state.
- **Common mistakes:** reading `*` as “one or more”; confusing `+` notation; dropping parentheses.

### 1.6. DFA minimization and Myhill–Nerode — 75 minutes — [MUST]
- **Prerequisites:** 1.2 and 1.4.
- **Beginner must see:** two states are equivalent only if every future suffix gives the same result.
- **Finer points:** table-filling, partition refinement, unreachable states first; distinguishable suffixes.
- **GATE items:** minimal-state count, distinguishability, NFA-to-minimal-DFA bounds.
- **Diagrams:** partition frames and suffix witness.
- **Hand traces:** minimize a 4–5 state DFA and justify each merge.
- **Common mistakes:** merging states because their outgoing arrows look similar; forgetting reachability.

## Chapter 2 — Regular languages, closure, and pumping lemma

### 2.1. Closure properties of regular languages — 60 minutes — [MUST]
- **Prerequisites:** 1.1–1.5 and set operations.
- **Beginner must see:** “closed under” means applying an operation to members of the class always stays in the class.
- **Finer points:** union, intersection, complement, difference, concatenation, star, reversal, homomorphism.
- **GATE items:** choose statements that are always true; build product DFA.
- **Diagrams:** closure map and product automata.
- **Hand traces:** create union and intersection product states.
- **Common mistakes:** believing closure of a class under an operation means every language has that property.

### 2.2. Decision properties of regular languages — 60 minutes — [MUST]
- **Prerequisites:** 1.2 and 1.6.
- **Beginner must see:** membership, emptiness, universality, finiteness, equivalence, inclusion.
- **Finer points:** reachability of final states; reachable cycles; product with complement; equivalence via symmetric difference emptiness.
- **GATE items:** decide which regular-language questions are algorithmically solvable.
- **Diagrams:** graph reachability and product graph.
- **Hand traces:** mark reachable states and cycles.
- **Common mistakes:** mixing “the language is empty” with “the machine has no accepting state” without checking reachability.

### 2.3. Pumping lemma for regular languages — 75 minutes — [MUST]
- **Prerequisites:** F0, 1.2, 2.1.
- **Beginner must see:** repeated state creates a loop in a long enough string.
- **Finer points:** exact quantifier order, `|xy|≤p`, `|y|≥1`, all exponents `i≥0`; lemma is necessary, not sufficient.
- **GATE items:** valid pumping length and non-regularity proof.
- **Diagrams:** repeated-state loop and `xyz` split.
- **Hand traces:** solve one proof with every legal split handled.
- **Common mistakes:** choosing the split yourself; pumping the wrong part; claiming regularity because a language passes one test.

### 2.4. Myhill–Nerode and state lower bounds — 75 minutes — [SHOULD]
- **Prerequisites:** 1.6, 2.3.
- **Beginner must see:** each distinguishable prefix needs its own DFA state.
- **Finer points:** equivalence relation and residual languages.
- **GATE items:** minimal state lower-bound questions.
- **Diagrams:** prefixes paired with distinguishing suffixes.
- **Hand traces:** prove 4 or 6 states are needed for a modular counting language.
- **Common mistakes:** listing sample strings without showing a distinguishing suffix.

## Chapter 3 — Context-free grammars and push-down automata

### 3.1. CFGs and derivations — 60 minutes — [MUST]
- **Prerequisites:** F0.
- **Beginner must see:** terminals, variables, start variable, productions, derivation.
- **Finer points:** sentential form vs terminal string; leftmost/rightmost derivation.
- **GATE items:** generate strings and describe the grammar language.
- **Diagrams:** grammar anatomy and derivation frames.
- **Hand traces:** derive 3 strings and reject one impossible string.
- **Common mistakes:** expanding a terminal; treating a production arrow as an implication.

### 3.2. Parse trees and ambiguity — 60 minutes — [MUST]
- **Prerequisites:** 3.1.
- **Beginner must see:** parse tree leaves form the generated string.
- **Finer points:** two derivation orders can produce the same parse tree; ambiguity requires two different parse trees for one string.
- **GATE items:** ambiguous grammar, derivation count, precedence.
- **Diagrams:** two derivations and two trees side by side.
- **Hand traces:** prove one grammar ambiguous using one witness string.
- **Common mistakes:** calling a grammar ambiguous just because it has multiple derivation orders.

### 3.3. Reading a grammar as a language — 60 minutes — [MUST]
- **Prerequisites:** 3.1 and basic counting.
- **Beginner must see:** how each recursive rule changes symbol counts and order.
- **Finer points:** invariants, induction on derivation length, concatenated subgrammars.
- **GATE items:** count `a`/`b`/`c`, derive set-builder form, test a candidate string.
- **Diagrams:** recursive production tree plus count table.
- **Hand traces:** build shortest strings and a few longer strings.
- **Common mistakes:** assuming equal symbols just because one production adds a matching pair.

### 3.4. CFG simplification and normal forms — 75 minutes — [MUST]
- **Prerequisites:** 3.1.
- **Beginner must see:** null/ε production, unit production, useless symbol, CNF.
- **Finer points:** preserve language while removing rules; start symbol handling; CNF derivation step count `2n−1` for a nonempty length-n string under standard CNF.
- **GATE items:** identify CNF; count derivation steps; perform small conversion.
- **Diagrams:** before/after grammar and binary parse tree.
- **Hand traces:** simplify a tiny grammar and count steps for a short word.
- **Common mistakes:** removing a rule without adding required alternatives; forgetting the standard start-symbol exception.

### 3.5. Push-down automata — 75 minutes — [MUST]
- **Prerequisites:** 3.1 and stack basics.
- **Beginner must see:** finite control + input + stack; read/pop/push transition.
- **Finer points:** ε-input transitions, bottom marker, final-state vs empty-stack acceptance.
- **GATE items:** trace PDA and identify the accepted language.
- **Diagrams:** PDA anatomy and stack snapshots.
- **Hand traces:** run one accepting and one rejecting input completely.
- **Common mistakes:** reading the stack label in the wrong order; popping a symbol that is not on top.

### 3.6. CFG–PDA relation and deterministic PDA — 75 minutes — [MUST]
- **Prerequisites:** 3.2–3.5.
- **Beginner must see:** NPDAs and CFGs describe the context-free languages.
- **Finer points:** DPDA is a restricted model; every regular language is accepted by a DPDA; not every CFL is deterministic.
- **GATE items:** DPDA membership, deterministic vs nondeterministic language statements.
- **Diagrams:** grammar stack simulation and branch comparison.
- **Hand traces:** trace a simple PDA and identify a point where a nondeterministic guess is needed.
- **Common mistakes:** assuming every CFL can be handled deterministically.

## Chapter 4 — Context-free languages, closure, and pumping lemma

### 4.1. Closure properties of CFLs — 60 minutes — [MUST]
- **Prerequisites:** 2.1 and 3.1.
- **Beginner must see:** union, concatenation, star, reversal, intersection with regular language.
- **Finer points:** not closed under general intersection/complement/difference.
- **GATE items:** match language classes with closure properties.
- **Diagrams:** closure table and intersection counterexample.
- **Hand traces:** use De Morgan identities carefully and reduce an expression.
- **Common mistakes:** extending regular-language closure facts to CFLs without proof.

### 4.2. Pumping lemma for CFLs — 75 minutes — [MUST]
- **Prerequisites:** 2.3, 3.2, 3.4.
- **Beginner must see:** five pieces `u v x y z`; `v` and `y` pumped together.
- **Finer points:** `|vxy|≤p`, `|vy|≥1`, same exponent, short middle window.
- **GATE items:** prove non-context-freeness for multiple dependent blocks.
- **Diagrams:** parse tree repeated-variable path and five-piece split.
- **Hand traces:** show why every possible legal split fails for one language.
- **Common mistakes:** using the regular pumping lemma for CFLs; pumping only one of `v`,`y`.

### 4.3. Classifying regular, CFL, DCFL, recursive, and RE — 60 minutes — [SHOULD]
- **Prerequisites:** 2.1, 3.6, 4.1, 5.2.
- **Beginner must see:** regular ⊂ CFL; recursive and RE are computability classes, not just “higher grammar types.”
- **Finer points:** intersection counterexamples; complement relations; DCFL distinction.
- **GATE items:** compare multiple language properties in one MSQ.
- **Diagrams:** two carefully separated classification views.
- **Hand traces:** classify a list of examples and justify each answer.
- **Common mistakes:** drawing recursive/RE as if they are simply the next nested grammar level.

### 4.4. CFL decision problems and mixed proofs — 60 minutes — [MUST]
- **Prerequisites:** 3.4 and 4.1.
- **Beginner must see:** membership and emptiness are decidable; some universality/equivalence/intersection questions are not.
- **Finer points:** always specify the input representation (CFG, PDA, TM) and the property being asked.
- **GATE items:** decide whether a problem is decidable; closure-based counterexamples.
- **Diagrams:** yes/no decision table and proof checklist.
- **Hand traces:** solve three mixed language-classification problems.
- **Common mistakes:** assuming a property is undecidable just because the input is a grammar.

## Chapter 5 — Turing machines

### 5.1. Turing machine from zero and configurations — 75 minutes — [MUST]
- **Prerequisites:** 1.2 plus tape/string basics.
- **Beginner must see:** tape cells, head, state, transition, one step.
- **Finer points:** blank symbol, end conventions, configuration representation.
- **GATE items:** trace a small TM or understand a machine description.
- **Diagrams:** TM anatomy and configuration sequence.
- **Hand traces:** write the tape after every move.
- **Common mistakes:** confusing tape head position with current state; skipping writes.

### 5.2. Accepting, deciding, recursive, and RE — 75 minutes — [MUST]
- **Prerequisites:** 5.1.
- **Beginner must see:** recognizer may loop on a nonmember; decider always halts.
- **Finer points:** recursive implies RE; complement of recursive is recursive; L and complement L both RE iff L recursive.
- **GATE items:** classify languages and closure statements.
- **Diagrams:** accept/reject/loop flows and recursive/RE comparison.
- **Hand traces:** classify outcomes on member and nonmember inputs.
- **Common mistakes:** saying a machine rejects when it simply has not halted yet.

### 5.3. Computable functions and closure properties — 60 minutes — [SHOULD]
- **Prerequisites:** 5.1 and function notation.
- **Beginner must see:** a total computable function is produced by a machine that halts with its output.
- **Finer points:** graph language `x#f(x)` and closure under union/intersection for RE; complement distinction.
- **GATE items:** link computability of a function to recursiveness of its graph language.
- **Diagrams:** function machine and graph membership.
- **Hand traces:** simulate output for small inputs.
- **Common mistakes:** confusing “function can be computed” with “graph is only RE.”

## Chapter 6 — Decidability and undecidability

### 6.1. Decidable problems for automata and grammars — 75 minutes — [MUST]
- **Prerequisites:** 2.2, 3.4, 4.4.
- **Beginner must see:** the problem input, yes/no property, and whether a guaranteed algorithm exists.
- **Finer points:** distinguish membership, emptiness, universality, equivalence, intersection-emptiness.
- **GATE items:** classify each question by model and property.
- **Diagrams:** decision-problem matrix.
- **Hand traces:** solve a table of DFA/CFG/TM questions.
- **Common mistakes:** treating all questions about a grammar as the same decision problem.

### 6.2. Halting problem and reductions — 75 minutes — [MUST]
- **Prerequisites:** 5.2 and proof by contradiction.
- **Beginner must see:** why no one algorithm decides whether every arbitrary TM halts on an arbitrary input.
- **Finer points:** computable mapping, reduction direction, source problem vs target problem.
- **GATE items:** prove undecidability by reduction.
- **Diagrams:** diagonal argument and reduction pipeline.
- **Hand traces:** trace a small diagonal-style contradiction and one reduction outline.
- **Common mistakes:** reversing the reduction arrow; using “hard” without showing the transformation.

### 6.3. Rice’s theorem and TM language properties — 75 minutes — [MUST]
- **Prerequisites:** 5.2 and 6.2.
- **Beginner must see:** nontrivial semantic property of the language recognized by a TM is undecidable.
- **Finer points:** properties of descriptions vs properties of recognized languages; bounded-step exceptions.
- **GATE items:** emptiness, universality, equivalence, regularity, cardinality of TM languages.
- **Diagrams:** Rice applicability decision tree and semantic/syntactic examples.
- **Hand traces:** test each problem statement against the rule.
- **Common mistakes:** applying Rice’s theorem to any statement that mentions a TM.

### 6.4. Countability, PCP, and final decision map — 60 minutes — [SHOULD]
- **Prerequisites:** 6.1–6.3 and basic set theory.
- **Beginner must see:** finite machine descriptions are countable; all languages over an infinite string universe are uncountable.
- **Finer points:** PCP and context-sensitive/LBA awareness are supporting scope, not a new full subject.
- **GATE items:** countability and standard undecidability facts.
- **Diagrams:** countable list vs power set; PCP tiles.
- **Hand traces:** classify 4 countability statements and one PCP instance.
- **Common mistakes:** assuming an uncountable set can be listed by finite program descriptions.

### 6.5. Mixed PYQ workshop — 90 minutes — [MUST]
- **Prerequisites:** all previous lessons.
- **Beginner must see:** how to identify whether a question is about automata, grammar, closure, pumping, or computability before solving.
- **Finer points:** MCQ vs MSQ selection; NAT state counts; source/key checking; time management.
- **GATE items:** mixed bank questions and fresh variants.
- **Diagrams:** one-page concept map and error log.
- **Hand traces:** 8 mixed questions with complete written reasoning.
- **Common mistakes:** choosing an answer from a memorized phrase without matching the exact machine/property.

---

# PART 6. EVERY PYQ IN THE SUPPLIED BANK — 77 records

**How to read the verdict:** “Consistent” means the marked key is consistent with an independent reasoning check on the text supplied. “Cannot verify” means the question depends on a missing figure or another omitted artifact. It does not mean the official key is wrong. For figure questions, restore the original diagram before using the answer in the book. Question IDs below are retained exactly as in the uploaded bank; do not assume every suffix is the official paper question number until reconciled with the original paper.

| # | Bank ID | Chapter / lesson | Exact concept tested | Trap / finer point | Key review | Text / source issue |
|---:|---|---|---|---|---|---|
| 1 | 2026_AN_Q13 | Ch. 5.2 | Definition of a TM deciding L | A decider accepts exactly members, rejects nonmembers, and halts on every input | D consistent | Text is sufficient. |
| 2 | 2026_FN_Q25 | Ch. 3.2 | Ambiguity of `S→aSbS | bS | ε`; derivations of `abb` and `abab` | Two derivations for `abb` witness ambiguity; `abab` has one rightmost derivation in the supplied grammar | A, B, C consistent | Grammar text appears complete. |
| 3 | 2026_FN_Q26 | Ch. 1.4 | NFA with six states and upper bound on equivalent DFA | At most `2^6=64` subset states; minimal DFA cannot exceed this | B, D consistent | No figure needed. |
| 4 | 2026_AN_Q29 | Ch. 3.2 | Ambiguity in three grammars | Expression grammar without precedence is ambiguous; `aS|Sa|ε` has multiple parse structures | B, C consistent | No figure needed. |
| 5 | 2026_AN_Q47 | Ch. 1.6 / 2.1 | Compare languages accepted by two automata; intersection and star of union | Must inspect both automata and reason about accepted strings | C, D marked | **Cannot verify:** both automata diagrams are absent. |
| 6 | 2026_AN_Q48 | Ch. 4.1 | Conditions on `a^i b^j c^k d^l` that yield CFLs | Nested matching vs crossing matching; one-counter balance across blocks | A, C, D consistent | No figure needed. Include a proof, not just a memorized pattern. |
| 7 | 2026_FN_Q51 | Ch. 2.1 / 4.1 | Closure inference from `L1∩L2` and `L2` regular | `L2` may be empty; nothing about all of `L1` follows; complement of regular is regular | C consistent | No figure needed. |
| 8 | 2026_FN_Q52 | Ch. 3.3 | Count invariant for symbols in a CFG | Prove invariant for B, then A, then S; do not guess from sample strings | B, D are the official answer for the official grammar | **FACT-DOUBT:** uploaded text says `S→abaaBAbba`; official GATE 2026 CS1 paper says `S→abaABAbba`. Correct the production before using the answer. |
| 9 | 2025_FN_Q19 | Ch. 3.3 | Language generated by `S→aaB | Abb` | `A` generates one or more a's; `B` one or more b's | A consistent | No figure needed. |
| 10 | 2025_AN_Q24 | Ch. 3.6 | Which languages are accepted by a DPDA | Every regular language can be handled by a DPDA; not every CFL is deterministic | A consistent | No figure needed. |
| 11 | 2025_AN_Q25 | Ch. 6.1 | Decidability of CFG equivalence, intersection emptiness, equality with RE, emptiness | CFG emptiness is decidable; several comparison/universality questions are not | D consistent | Distinguish each input/problem pair. |
| 12 | 2025_FN_Q28 | Ch. 1.4 | NFA-to-DFA state bound | `≤2^n` is guaranteed; a smaller DFA may exist; “every DFA >2^n” is false | D consistent | No figure needed. |
| 13 | 2025_AN_Q30 | Ch. 2.1 / 4.1 / 5.3 | Closure properties of CFL, recursive, regular | CFL not closed under complement; recursive and regular are closed under union/intersection | B, C consistent | The option matching format is easy to misread; show the matching explicitly. |
| 14 | 2025_FN_Q44 | Ch. 2.1 / 2.3 | Regularity of `{αβα}` vs `{a^k β a^k}` | L1 can require matching an arbitrary nonempty prefix/suffix; L2 can shrink to `aΣ+a` because extra a's move into β | C consistent | No text error identified. The L1 pumping proof must handle all legal splits. |
| 15 | 2025_FN_Q45 | Ch. 4.2 | CFL status of two block-count languages | One dependency can be pushed; two coupled independent equalities may exceed one stack | C consistent | Include the formal proof; “two counts” alone is not a proof. |
| 16 | 2025_FN_Q50 | Ch. 1.2 / 1.6 | Identify the language of a DFA | Need follow states after prefixes and check the ending pattern | C marked | **Cannot verify:** DFA image absent. |
| 17 | 2025_AN_Q52 | Ch. 1.2 / 1.6 | Regularity of languages with modular symbol counts | Finite remainders can be stored as DFA state; equality of unbounded counts is different | A, C consistent | No figure needed. |
| 18 | 2025_AN_Q60 | Ch. 1.6 | Minimum DFA state count for product modulo 7 | The reachable products form the six nonzero residues mod 7; each group element is distinguishable | 6 consistent | No figure needed. Explain why the states are minimal. |
| 19 | 2024_AN_Q34 | Ch. 1.5 | Convert DFA to equivalent regular expression | Track transitions and language accepted from each state | A marked | **Cannot verify:** DFA figure absent. |
| 20 | 2024_FN_Q16 | Ch. 2.1 | Closure facts for regular and nonregular languages | Complement of nonregular is nonregular; regular union/complement remain regular | C, D consistent | No figure needed. |
| 21 | 2024_AN_Q55 | Ch. 1.3 / 1.5 | Regex for an ε-NFA | Must calculate ε-closures and trace cycles carefully | B marked | **Cannot verify:** NFA figure absent. |
| 22 | 2024_FN_Q36 | Ch. 1.6 | Distinguishability/minimization of a five-state DFA | Distinguishable states require a suffix that separates their acceptance behaviour | B, C marked | **Cannot verify:** DFA figure absent. |
| 23 | 2024_AN_Q42 | Ch. 3.3 | Symbol-count invariants from CFG productions | Each `aSbS` creates a matched b and two S subproblems; base case supplies one c | B, C consistent | No figure needed. Show induction on derivation. |
| 24 | 2024_FN_Q48 | Ch. 3.4 | Derivation steps for a length-90 string in CNF | In standard CNF, n leaves require n−1 binary internal productions; total `2n−1` | 179 consistent | State the convention and why the number of variables is a distractor. |
| 25 | 2024_FN_Q63 | Ch. 1.5 / 2.1 | Count short strings in two regular languages | `r` is all-zero or all-one strings; `s` has the two specified patterns; use inclusion–exclusion | 44 consistent | The expression text has formatting artifacts in some copies; compare with official paper. |
| 26 | 2024_AN_Q38 | Ch. 1.5 / 2.1 | Count strings of length ≤4 with an odd number of a's | Regex denotes odd a-count; per length n≥1, half of the 2^n strings qualify | 15 consistent | **ID mismatch risk:** the same question text appears as GATE 2024 CS2 Q62 in the official paper; normalize this bank ID against the official question number. |
| 27 | 2023_FN_Q14 | Ch. 1.5 | Convert a DFA to a regular expression | Follow cycles and initial/final-state structure | C marked | **Cannot verify:** DFA diagram absent. |
| 28 | 2023_FN_Q19 | Ch. 1.3 | NFA for identifier regex `letter(letter|digit)*` | First symbol must be a letter; later symbols may be letters or digits | C marked | **Transcription issue:** source shows `[A – Za – a]`; use a clean verified character class such as `[A-Za-z]` and restore the original option diagrams. |
| 29 | 2023_FN_Q24 | Ch. 2.1 / 4.1 / 5.3 | Closure of regular, CFL, recursive, and RE languages | CFLs are not closed under intersection; recursive and RE languages are closed under intersection | A, C, D consistent | No figure needed. |
| 30 | 2023_FN_Q39 | Ch. 3.3 | Determine language of a CFG | `X` generates nonempty `a* b*`; outer `aSb` does not change the overall nonempty `a* b*` language | B consistent | No figure needed. |
| 31 | 2023_FN_Q40 | Ch. 3.5 | Language accepted by a PDA | Follow stack changes and acceptance by empty stack | A marked | **Cannot verify:** PDA diagram absent. |
| 32 | 2023_FN_Q63 | Ch. 1.2 / 1.6 | Minimum DFA for strings with no three consecutive 1s | States represent trailing runs of 0, 1, 2 ones and a dead state | 4 consistent | No figure needed. |
| 33 | 2022_FN_Q12 | Ch. 1.5 | Regex equivalent to an automaton | Need read all loops/accepting states and construct the language | D marked | **Cannot verify:** automaton diagram absent. |
| 34 | 2022_FN_Q23 | Ch. 5.3 | Recursive/RE closure and regular subclass facts | If L and its complement are RE, L is recursive; CFLs are decidable | B, C, D consistent | No figure needed. |
| 35 | 2022_FN_Q46 | Ch. 6.3 | Undecidable semantic properties of TM languages | Equality, regularity, and universality are semantic language properties; fixed bounded-step tests can be decidable | A, B, C consistent | Explain why the fixed 1073-step condition differs from unrestricted halting. |
| 36 | 2022_FN_Q47 | Ch. 4.1 | Regular/CFL status of two languages with mirrored pieces | A language containing a regular subset may be CFL; a mirrored pattern may need stack memory | A, B, C consistent | Keep the definitions of `w`, `x`, and reversal explicit. |
| 37 | 2022_FN_Q48 | Ch. 4.1 | CFL status and intersection of three languages | `{ww}` is not CFL; `a^n b^n c^m` and `a^m b^n c^n` are CFL, but their intersection is `a^n b^n c^n` | B, C consistent | No figure needed. Show the intersection explicitly. |
| 38 | 2021_FN_Q19 | Ch. 4.1 | Regular language combined with CFL | CFL closed under intersection with regular, concatenation with regular, and union; not necessarily difference by CFL | C consistent | No figure needed. |
| 39 | 2021_AN_Q12 | Ch. 1.6 | Minimal DFA for complement of a regular language | Complement swaps final/nonfinal states in a complete minimal DFA without changing state count | C consistent | Mention completeness requirement. |
| 40 | 2021_FN_Q37 | Ch. 6.1 | Emptiness/universality for DFA/PDA | DFA emptiness/universality decidable; PDA universality is undecidable | D consistent | No figure needed. |
| 41 | 2021_AN_Q54 | Ch. 4.1 | Algebraic expressions involving regular and CFLs | Simplify with De Morgan; `L1∩L2`, `L2`, and `Σ*` are CFL in the marked expressions | B, C, D consistent | Show each expression simplification step. |
| 42 | 2021_AN_Q20 | Ch. 1.2 / 1.6 | Count strings of length eight accepted by a DFA | Count paths by transition structure, not merely number of states | 256 marked | **Cannot verify:** DFA figure absent. |
| 43 | 2021_AN_Q23 | Ch. 6.4 | Countability of subsets of an infinite regular language; finite languages | An infinite countable language has uncountably many subsets but only countably many decidable languages; every finite language is regular | C consistent | No figure needed. |
| 44 | 2021_FN_Q26 | Ch. 1.2 | DFA for strings ending with `011` | State records the longest suffix that is also a prefix of the target pattern | D marked | **Cannot verify:** four DFA option diagrams absent. |
| 45 | 2021_FN_Q23 | Ch. 5.1 / 6.1 | TM runtime bounded by 2021 steps on all/some inputs | A fixed number of simulation steps can be checked by a finite bounded analysis; not the unrestricted halting problem | A consistent | Text is enough; explicitly teach bounded vs unbounded. |
| 46 | 2021_AN_Q18 | Ch. 4.1 | Context-freeness of languages with reversals and repeated blocks | Stack can match nested/reversed portions; multiple crossing dependencies may fail | B, C, D marked | No diagram, but definitions are sufficient; include proof sketches for each option. |
| 47 | 2021_AN_Q51 | Ch. 1.5 | Regular expressions for binary numbers divisible by 3 | Remainder automaton and expression equivalence; convention about ε is explicitly set | A, B, C marked | **Encoding artifacts:** `&#x31;`/`&#x30;` appear in expressions; restore the exact symbols from the source paper before publishing. |
| 48 | 2021_FN_Q18 | Ch. 3.5 | Count strings accepted by a PDA of length 100 | Need trace the automaton's accepted-length pattern | 50 marked | **Cannot verify:** PDA diagrams are absent. |
| 49 | 2020_FN_Q22 | Ch. 1.5 | Regular expression for odd number of 1s | Test each expression against short counterexamples such as `01`, `10`, `1110`; not all printed choices work | **Official result: MTA (Marks To All)** | **Key-record error:** the source marks all four options with checks. This must not be taught as “all four are correct.” Official GATE 2020 key records MTA for the relevant CS question. |
| 50 | 2020_FN_Q19 | Ch. 2.1 | Closure of regular languages under union/infinite union | A regular union does not force both components regular; regular languages are not closed under arbitrary infinite union | D consistent | No figure needed. |
| 51 | 2020_FN_Q24 | Ch. 3.6 / 4.3 | DCFL and LL(k) status of `a* ∪ {a^n b^n}` | A deterministic PDA can push a's, then switch to popping when b begins; language need not be LL(k) | C consistent | Explain why I and III can both hold. |
| 52 | 2020_FN_Q44 | Ch. 6.3 | Rice’s theorem and a bounded 100-step property | Emptiness, non-recursiveness and at-least-21 accepted strings are nontrivial semantic properties; exactly-100-step reachability is bounded | A consistent | Do not apply Rice to L2. |
| 53 | 2020_FN_Q60 | Ch. 4.1 | Regularity/CFL status of two languages | `L1` has a short repeated-substring condition; `L2` is equal-length unequal halves and can be checked with a stack | A consistent | Give the full proof for both classifications. |
| 54 | 2020_FN_Q41 | Ch. 1.2 / 1.6 | Minimum DFA for number of a's divisible by 2 but not 3 | Track number of a's modulo 6; b leaves state unchanged | 6 consistent | No figure needed. |
| 55 | 2019_FN_Q30 | Ch. 2.1 / 4.1 | Closure constructions involving reversal and palindromes | Regular languages remain regular under reversal/concatenation; `{ww^R}` can be nonregular | B consistent | Clarify that `{ww^R | w∈L}` is not generally regular. |
| 56 | 2019_FN_Q28 | Ch. 2.3 | Valid pumping length for a union of unary periodic languages | Pumping length need not be least; it must be large enough for every qualifying word | 24 consistent | Show why smaller candidates fail and why 24 works. |
| 57 | 2019_FN_Q39 | Ch. 4.2 | Identify a language that is not CFL | Crossing equalities in option C cannot be maintained by one stack; prove, do not rely on shape alone | C consistent | Include a proof or known theorem. |
| 58 | 2019_FN_Q50 | Ch. 6.4 | Countability of RE languages, C programs, all languages, nonregular languages | Finite machine/program descriptions are countable; all subsets of an infinite countable string set are uncountable | B consistent | No figure needed. |
| 59 | 2019_FN_Q59 | Ch. 1.6 | Minimal DFA for products of permutations in S5 | State tracks the accumulated permutation; there are 5! distinct group elements | 120 consistent | Explain distinguishability of different group elements. |
| 60 | 2018_FN_Q16 | Ch. 1.4 | Upper bound on equivalent DFA size for n-state NFA | Subset construction gives `k≤2^n`; no lower bound of `2^n` is guaranteed | D consistent | No figure needed. |
| 61 | 2018_FN_Q17 | Ch. 5.3 | Closure of recursively enumerable languages | RE languages are closed under intersection but not complement in general | B consistent | No figure needed. |
| 62 | 2018_FN_Q45 | Ch. 4.1 / 4.2 | Which of four block-count languages are CFL | Compare stack-compatible nested/one-counter constraints to simultaneous independent equalities | B consistent | Add the proof behind each candidate classification. |
| 63 | 2018_FN_Q46 | Ch. 6.1 / 6.2 | Decidability of unrestricted grammar membership, TM regularity, grammar equivalence, NFA equivalence to DPDA | Type-0 membership, Rice property, and grammar equivalence are undecidable; any NFA language is regular and therefore accepted by a DPDA | D consistent | No figure needed. |
| 64 | 2018_FN_Q62 | Ch. 1.2 / 2.1 | Order of a regular language accepted by an automaton | Need see the actual automaton and compute successive language powers | 2 marked | **Cannot verify:** automaton figure absent. |
| 65 | 2017_AN_Q24 | Ch. 4.1 | CFL closure under union, complement, difference with regular, intersection | CFL union is CFL; CFL minus regular is CFL; complement/intersection general CFL claims fail | B consistent | No figure needed. |
| 66 | 2017_FN_Q22 | Ch. 3.3 | Language generated by recursive CFG with `T→bT|b` | Each recursive layer adds `ab` and a later `c` followed by a nonempty b-block | B consistent | No figure needed. |
| 67 | 2017_AN_Q11 | Ch. 3.3 | Language generated by `S→XY`, `X→aX|a`, `Y→aYb|ε` | Total a-count is strictly greater than b-count | C consistent | No figure needed. |
| 68 | 2017_FN_Q23 | Ch. 1.2 / 1.6 | Minimum DFA for strings whose penultimate symbol is b | Need remember whether last symbol was b and whether a following symbol completed the required suffix | 4 consistent | Show the four equivalence classes. |
| 69 | 2017_AN_Q15 | Ch. 1.2 / 1.6 | Minimum DFA for third symbol a and at least three trailing symbols | Count positions before the required symbol and remaining length after it; include dead state | 8 consistent | No figure needed. |
| 70 | 2017_FN_Q46 | Ch. 3.3 | Determine which string is not generated by a CFG | Use production invariants such as symbol counts; show a valid derivation for the other options | D consistent | No figure needed. |
| 71 | 2017_FN_Q40 | Ch. 4.1 | Intersection of two CFLs | Their common strings are `c*`, an infinite regular language | B consistent | Prove the first-symbol conflict for positive n. |
| 72 | 2017_FN_Q50 | Ch. 4.1 | Union and intersection of two CFLs | Union is CFL; intersection can become `a^n b^n c^n`, not CFL | A consistent | No figure needed. |
| 73 | 2017_FN_Q52 | Ch. 5.3 | Computability of f and recursiveness of graph language `L_f` | If graph membership is decidable, enumerate candidate outputs and test; totality ensures the correct output is found | A consistent | No figure needed. |
| 74 | 2017_AN_Q40 | Ch. 1.3 | Extended transition function of ε-NFA | Apply ε-closure before/after consuming each input symbol | C marked | **Cannot verify:** transition table is an image and is absent. |
| 75 | 2017_AN_Q38 | Ch. 4.1 / 4.2 | CFL/regular/recursive status of unary and block languages | Every unary CFL is regular; prime-length unary language is not CFL; `a^n b^n c^{2n}` is recursive but not CFL | D consistent | No figure needed. |
| 76 | 2017_AN_Q60 | Ch. 6.1 | Decidability of regex membership, CFG emptiness/universality, TM acceptance | Regex membership and CFG emptiness decidable; CFG universality and TM acceptance undecidable | D consistent | No figure needed. |
| 77 | 2017_FN_Q37 | Ch. 3.2 / 3.3 | Count control-flow paths induced by nested if-statements | Each independent if doubles the path count in the described grammar; `2^10=1024` | 1024 consistent | Keep the “empty statement” and path definition exact. |

### PYQ-bank data audit

- **77 records** are present in the attachment; the four bank topic counts add to 77.
- **121 marks** are present; the topic mark subtotals add to 121.
- There are **15 paper labels** across the years 2017–2026.
- **14 records are figure-dependent** but the original figures are represented only by placeholders. These cannot be re-solved from this file alone.
- The bank says “24 Forge questions,” but those 24 questions are not included here; no quality or overlap audit is possible.
- The 2026 Q52 grammar is materially mistranscribed.
- The 2020 odd-1s question is incorrectly represented as four check-marked answers; the official key result is MTA.
- The bank IDs should be reconciled with official paper question numbers. For example, the 2024 regex/count question labelled `2024_AN_Q38` in the bank matches official GATE 2024 CS2 Q62. Preserve an internal ID if needed, but store the official session and question number in separate fields.

---

# PART 7. THREE MORE QUESTION IDEAS FOR EACH LESSON

These are new question *ideas*, not statements about actual GATE questions. Every idea is intended to cover something the supplied 77-question bank does not exercise in exactly the same way. The bank labels are broad, so “not covered” means “not clearly represented in the supplied list,” not “never asked in GATE.”

| Lesson | Three additional question ideas (type) |
|---|---|
| F0 | (1) Choose which of `ε`, `∅`, `{ε}`, `Σ*` has exactly one string (MCQ). (2) Given two finite sets of strings, compute union/intersection/difference (NAT). (3) Find the first invalid step in a proof that confuses `ε` with `∅` (MSQ). |
| 1.1 | (1) Classify a language as finite/infinite from a set-builder description (MCQ). (2) Write the first six strings of a language defined by a simple pattern (NAT). (3) Identify whether a claimed string belongs to a language (MSQ). |
| 1.2 | (1) Build a DFA for strings containing `00` but not ending in `1` (MCQ). (2) Trace a DFA on a 12-symbol input and report final state (NAT). (3) Identify which transition table is a valid complete DFA (MSQ). |
| 1.3 | (1) Compute ε-closure of every state in an ε-NFA (NAT). (2) Determine accepted strings of length at most 3 (MSQ). (3) Identify a word accepted by one NFA path but not all paths (MCQ). |
| 1.4 | (1) Complete reachable subset states for a 3-state NFA (NAT). (2) Give the maximum possible DFA size and an example where not all subsets are reachable (MSQ). (3) Determine whether a proposed subset-construction transition is correct (MCQ). |
| 1.5 | (1) Find the shortest string in the language of a regex (MCQ). (2) Convert a regex with nested stars into an ε-NFA (MSQ). (3) Count strings of length ≤5 described by a regex using a recurrence (NAT). |
| 1.6 | (1) Minimize a DFA with unreachable states and equivalent states (NAT). (2) Give a distinguishing suffix for each pair of states (MSQ). (3) Prove a DFA needs at least k states using k distinguishable prefixes (MCQ). |
| 2.1 | (1) Use product DFA to construct symmetric difference (MSQ). (2) Choose the smallest operation sequence proving a derived language regular (MCQ). (3) Give a counterexample showing why a non-closure claim fails (NAT/short answer). |
| 2.2 | (1) Decide if a DFA language is finite by examining reachable cycles (MCQ). (2) Test equivalence of two DFAs using symmetric difference emptiness (NAT). (3) Decide universality of a given DFA (MSQ). |
| 2.3 | (1) For a fixed pumping length p, list all legal y positions for a sample word (MSQ). (2) Identify why an invalid pumping proof fails (MCQ). (3) Determine a valid pumping length for a union of periodic languages (NAT). |
| 2.4 | (1) Show at least five distinguishable prefixes for a modular language (NAT). (2) Determine the number of equivalence classes for strings with a suffix constraint (MCQ). (3) Decide if two states have a distinguishing suffix of length at most 2 (MSQ). |
| 3.1 | (1) Count the number of derivation steps for a given CFG string (NAT). (2) Identify a sentential form that cannot arise from a grammar (MCQ). (3) Give both leftmost and rightmost derivations for one string (MSQ). |
| 3.2 | (1) Identify an ambiguous grammar by finding a witness string (MCQ). (2) Count distinct parse trees for a short string (NAT). (3) Distinguish ambiguity from multiple derivation orders (MSQ). |
| 3.3 | (1) Prove an invariant relating counts of three terminals (MSQ). (2) Derive a set-builder language from recursive productions (MCQ). (3) Find the shortest string satisfying a given count condition (NAT). |
| 3.4 | (1) Convert a grammar with nullable and unit productions into CNF (MCQ). (2) Count derivation steps for a word of length n in CNF (NAT). (3) Identify which production violates CNF (MSQ). |
| 3.5 | (1) Trace a PDA with both ε and input transitions (NAT). (2) Identify whether it accepts by final state or empty stack (MCQ). (3) Find the stack after a specified prefix (MSQ). |
| 3.6 | (1) Decide whether a language is DCFL using determinism of the required stack actions (MCQ). (2) Convert a simple CFG into an NPDA transition outline (MSQ). (3) Give a regular language accepted by a DPDA with no stack use (MCQ). |
| 4.1 | (1) Simplify a language expression using CFL∩regular closure (MCQ). (2) Construct two CFLs whose intersection is non-CFL (MSQ). (3) Identify which of union/concatenation/star/reversal preserve CFLs (MSQ). |
| 4.2 | (1) Apply the CFL pumping lemma to a language with four blocks (MCQ). (2) Identify the legal `vxy` window for a selected word (NAT). (3) Find the gap in a proof that pumps only one segment (MSQ). |
| 4.3 | (1) Place given example languages in the correct class relationships (MSQ). (2) Determine whether a language being recursive implies it is regular/CFL (MCQ). (3) Give a counterexample to a false containment statement (NAT/short answer). |
| 4.4 | (1) Classify membership, emptiness, finiteness, equivalence and universality for CFGs (MSQ). (2) Reduce a CFL expression to a known non-CFL intersection (MCQ). (3) Identify the exact model and property in an undecidability claim (MCQ). |
| 5.1 | (1) Trace a TM that marks the leftmost unprocessed symbol (NAT). (2) Identify the next configuration after a write-and-move transition (MCQ). (3) Distinguish a halting state from a state with a self-loop (MSQ). |
| 5.2 | (1) Classify four machine behaviours as decider/recognizer/neither (MSQ). (2) Use the complement theorem to infer recursiveness (MCQ). (3) Determine whether an RE language can have a non-RE complement (MCQ). |
| 5.3 | (1) Given a total function, construct its graph language (MCQ). (2) Given a graph-language decider, outline a search procedure for f(x) (MSQ). (3) Decide whether a proposed closure statement for RE/recursive languages is true (MSQ). |
| 6.1 | (1) Classify a new CFG emptiness/membership/universality problem (MSQ). (2) Decide whether a regular-expression membership question is decidable (MCQ). (3) Distinguish a decision problem about a DFA from one about a TM (MCQ). |
| 6.2 | (1) Identify the correct direction of a reduction diagram (MCQ). (2) Complete the missing contradiction in a halting-problem proof (MSQ). (3) Decide whether a proposed transformation is computable (NAT/short answer). |
| 6.3 | (1) Decide whether a property is semantic and nontrivial for Rice’s theorem (MSQ). (2) Identify a syntactic property not covered by Rice (MCQ). (3) Classify “halts within 50 steps” versus “halts eventually” (MSQ). |
| 6.4 | (1) Count the set of finite machine descriptions (MCQ). (2) Explain why all languages over an infinite alphabet-string universe are uncountable (MSQ). (3) Match a PCP instance and a candidate tile sequence (NAT). |
| 6.5 | (1) Solve a mixed automata/CFG/TM MSQ with a written elimination table (MSQ). (2) Find the earliest invalid assumption in a proof (MCQ). (3) Solve a fresh NAT state-count question and justify minimality (NAT). |

---

# PART 8. WHAT IS MISSING FROM THE SUBJECT

These are the items I would add to the *subject specification* before calling the book complete. They overlap Part 3, but this list is the release checklist rather than the detailed mapping.

1. **Formal-language foundations:** alphabet, strings, ε, language, concatenation, string powers, `Σ*`, `Σ+`, set-builder notation, and quantifiers.
2. **Proof foundations:** direct proof, contradiction, induction, counterexample, invariants, and careful quantifier order.
3. **Regex foundations:** precedence, identities, regex semantics, and regular-language examples.
4. **Finite automata:** DFA completeness, sink states, NFA/ε-NFA semantics, extended transition function, ε-closure, subset construction, equivalence, and conversions.
5. **Minimal automata:** table filling/partition refinement, distinguishable states, Myhill–Nerode and lower bounds.
6. **Regular-language properties:** closure and decision procedures for membership, emptiness, finiteness, universality, equivalence, and inclusion.
7. **Both pumping lemmas:** the regular and context-free versions, quantifier order, and full proof templates.
8. **CFG skills:** derivations, sentential forms, parse trees, leftmost/rightmost derivations, ambiguity, grammar-to-language reasoning, and invariants.
9. **CFG normal forms:** remove ε/null, unit, and useless productions; CNF; GNF at an appropriate depth; CYK as supporting technique.
10. **PDA foundations:** formal notation, transition semantics, ε-moves, bottom marker, acceptance by empty stack/final state, and stack traces.
11. **Determinism:** DPDA, NPDA, DCFL, and the difference between deterministic and nondeterministic context-free languages.
12. **CFL closure and non-closure:** union, concatenation, star, reversal, intersection with regular, and counterexamples for intersection/complement/difference.
13. **CFL decision facts:** membership/emptiness/finiteness versus undecidable universality/equivalence-style problems.
14. **Turing-machine model:** tape, head, state, configurations, transitions, halting, rejecting, accepting, and looping.
15. **Computability classes:** recursive/decidable, RE/recognizable, complement relation, closure rules, and computable functions.
16. **Undecidability methods:** halting problem, diagonal argument, mapping reductions, Rice’s theorem, bounded-time counterexamples, and standard examples such as PCP.
17. **Countability:** countable machine descriptions versus uncountably many languages; this is directly needed for the 2019 item.
18. **Question-source handling:** official paper links, final answer key, question ID crosswalk, and diagram images must accompany every PYQ.

**What not to add as a full mandatory chapter:** P, NP, NP-completeness, advanced complexity theory, and deep context-sensitive-language theory are not named in the four supplied official ToC syllabus lines. Mention supporting context only where useful and label it [LATER]/[BEYOND].

---

# PART 9. WEIGHTS AND PRIORITY

These weights are **derived only from the supplied bank's aggregate labels**, not a promise of future GATE weightage. “High” means the bank gives substantial marks or the concept is a prerequisite for many other lessons. Where the bank combines chapters, I do not pretend to know the split.

| Chapter / foundation | Proposed weight | Evidence in supplied bank | Does the bank-derived weight look fair? | Recommendation |
|---|---|---|---|---|
| F0: symbols, strings, languages, proof basics | Foundation | Not counted as a separate label | Yes; without this, the student cannot begin | Teach first; do not count it as a low-value optional topic. |
| 1. Regular expressions and finite automata | High | 26 questions, 40 marks, 10/10 years in the bank summary | Yes | Highest priority; give the most worked examples, diagrams, and trace practice. |
| 2. Regular languages, closure, pumping lemma | High | The bank's combined “Regular and Context-Free Languages & Pumping Lemma” bucket has 25 questions, 40 marks. This cannot be split cleanly between Ch. 2 and Ch. 4. | Yes as a combined family; separate chapter-level weight is not sure | Teach regular closure/pumping before CFL pumping; do not double-count the same 25-question aggregate. |
| 3. CFGs and PDAs | Medium–High | 14 questions, 22 marks, 6/10 years in the bank summary | Yes | Core chapter; ambiguity, grammar-language reasoning, PDA stack traces and CNF need explicit lessons. |
| 4. CFL properties and pumping lemma | High (shared bucket with Ch. 2) | Included in the same 25-question/40-mark aggregate as regular-language properties | The aggregate is high; Chapter 4’s separate share is not sure | Do not reduce CFL pumping to a short afterthought; it needs its own lesson and diagrams. |
| 5–6. Turing machines and undecidability | Medium | Combined bank bucket: 12 questions, 19 marks, 8/10 years | Yes as a combined bucket; split between Ch. 5 and Ch. 6 is not sure | Keep both chapters; teach recognizer/decider before Rice and reductions. |
| PCP, LBA, context-sensitive hierarchy, GNF/CYK depth | Low / Later unless evidence emerges | Not clearly counted separately in this bank | Not sure | Include only what supports official scope and recurring question patterns; label enrichment. |

### Weighting correction

The source's topic table totals 77 questions and 121 marks:

- Regular Expressions & Finite Automata: 26 questions / 40 marks / 2.67% of 1,500 paper marks.
- Regular and Context-Free Languages & Pumping Lemma: 25 / 40 / 2.67%.
- Context-Free Grammars & Push-Down Automata: 14 / 22 / 1.47%.
- Turing Machines & Undecidability: 12 / 19 / 1.27%.

These sum to 77 questions, 121 marks, and 8.08% of 1,500 paper marks. The bank's “about 8.1 marks a paper” follows from 121/15 ≈ 8.07. It is a valid descriptive statistic for this bank **if its classification is complete and correct**. It is not a statistical forecast, and “years asked” does not tell the student which subtopic will appear next.

---

# Production workflow for Claude — required before writing the books

This section turns the review into instructions for the actual writing process. It is a recommendation, not a claim about what the missing `01-MASTER-PROMPT.md` currently says.

## 1. Freeze the scope map

- Use the official GATE 2027 syllabus lines as the outer boundary.
- Add the detailed topic checklist in Part 3 under the six chapter headings.
- Mark each finer item `[MUST]`, `[SHOULD]`, or `[LATER]` before chapter drafting.
- Never use a PYQ count as a reason to omit a prerequisite.

## 2. Make each lesson beginner-safe

Every lesson must follow this fixed sequence:

1. **Why this idea exists** — everyday explanation in 2–4 sentences.
2. **Words I need first** — define every new term before using it.
3. **One tiny example** — the smallest case that demonstrates the rule.
4. **Picture/model** — a diagram that teaches one specific idea.
5. **Formal definition** — now introduce the notation.
6. **Worked example** — show every intermediate step.
7. **GATE pattern** — explain how the same concept appears in an exam question.
8. **Common trap** — show one believable wrong approach and why it fails.
9. **Practice** — six warm-up, ten core, and a small number of GATE-level questions, all with worked solutions.
10. **Recall check** — five quick questions the student should answer without looking.
11. **Prerequisite links** — say exactly which earlier lesson to revisit if the learner gets stuck.

Do not start a lesson with a theorem, a large expression, or an unexplained acronym.

## 3. Claude master prompt — add this instruction block

> You are writing a beginner-first GATE CS Theory of Computation book for a 25-year-old repeat aspirant who remembers almost nothing from college and is embarrassed to ask questions. Do not write for a student who already knows automata theory. Teach every word and notation before using it. Start from examples that fit on one screen, then show the formal definition. Never skip a derivation, transition, stack change, pumping split, or Turing-machine move. Every new concept must have a diagram or trace when a picture would reduce confusion. For every formula, state what each symbol means and why the formula applies. For every proof, state who chooses each object and preserve the quantifier order. For every solved GATE question, identify the exact concept, show the complete reasoning, explain why the tempting wrong options fail, and cite the original paper and final official key. If the source question has a figure, reproduce the figure faithfully; do not invent a replacement or solve from a missing placeholder. Clearly label official syllabus items, supporting theory, and beyond-syllabus enrichment. Do not invent year, question number, frequency, or weightage. When unsure, write “not sure” and request a source check. Keep sentences short, define technical words in plain English, and assume the reader is studying alone.

## 4. Question-bank quality gate

Every PYQ record must contain:

- Internal ID and official GATE year/session/question number as separate fields.
- Exact original question wording and every option, preserving mathematical symbols.
- Original figure, if any, plus image source/page.
- Official question-paper PDF URL and page number.
- Official final answer-key URL and key value, including MTA/withdrawn/marks-to-all status.
- Independent solution with all steps.
- Reviewer verdict: verified / corrected / cannot verify.
- Transcription notes and source version.

Do not store “✔ official” directly beside an option as the only key record. Store a structured key field. This avoids the 2020 MTA problem.

## 5. Code and symbolic verification

TOC has less executable code than C/DS, but it still needs reproducible checks:

- For regex questions, use a small brute-force enumerator for short strings to check examples; this does not replace a proof of equivalence.
- For DFA/NFA conversions, implement or hand-check transition tables and reachable subsets.
- For minimization, independently validate equivalence classes and distinguishing suffixes.
- For CFG examples, enumerate all strings up to a modest length to catch typos; enumeration cannot prove ambiguity or non-CFL.
- For PDA traces, check every transition against the stated stack-top convention.
- For TM examples, trace configurations one step at a time and state what happens on inputs outside the intended language.
- For pumping and undecidability proofs, use a second reviewer; automated sampling cannot prove an all-strings claim.

## 6. Pilot before bulk writing

Write only these pilot lessons first:

1. F0 — symbols, strings, languages, `ε` vs `∅`.
2. 1.2 — build and trace a DFA.
3. 1.4 — NFA-to-DFA subset construction.
4. 2.3 — regular pumping lemma.
5. 3.2 — ambiguity with two parse trees.
6. 3.5 — PDA stack trace.
7. 5.2 — recognizer vs decider.
8. 6.3 — Rice’s theorem and a bounded-time exception.

These test whether Claude can teach notation, a state machine, a proof, a grammar, a stack, and computability from zero. If these fail, bulk writing will multiply the same problem.

## 7. Beginner acceptance test

Recruit five learners who have not studied ToC recently. Give them the lesson without a teacher or video. After reading, ask them to:

- Explain `ε`, `∅`, and `Σ*` in their own words.
- Trace a DFA on a new input string and explain accept/reject.
- Convert a tiny NFA to a DFA.
- Explain the quantifier order in the regular pumping lemma.
- Produce two parse trees for one ambiguous grammar string.
- Trace a PDA stack without skipping a move.
- Distinguish “rejects” from “loops.”
- Explain why Rice’s theorem does not automatically settle a fixed 100-step property.

**Pass condition:** at least 4 of 5 can complete each core task without an instructor filling in missing steps; every learner must be able to explain their reasoning, not just select the answer. Log every point where a learner asks “what does this word mean?” and fix that lesson.

## 8. 100-day use plan

This is a study-use schedule for the book, not a promise that a learner can master all GATE CS in 100 days from zero.

- **Days 1–7:** F0, DFA, NFA, ε-closure, subset construction.
- **Days 8–16:** regex, conversions, minimization, Myhill–Nerode.
- **Days 17–25:** regular closure, decision properties, regular pumping lemma.
- **Days 26–40:** CFG definitions, derivations, parse trees, ambiguity, grammar-language reasoning, CNF.
- **Days 41–49:** PDA, stack traces, CFG-PDA, DPDA/NPDA.
- **Days 50–59:** CFL closure, CFL pumping, decision-property comparison.
- **Days 60–70:** Turing machines, configurations, accept/reject/loop, recursive/RE, computable functions.
- **Days 71–80:** decidability, reductions, halting, Rice’s theorem, countability, selected PCP/LBA enrichment.
- **Days 81–90:** all 77 bank questions, after restoring figures and correcting transcriptions; categorize each error by concept.
- **Days 91–100:** timed mixed practice, spaced revision of definitions/closure tables, and re-solving every wrong question without notes.

If the learner has serious backlogs in other GATE subjects, this schedule must be integrated with the full exam timetable; ToC alone cannot consume all 100 days.

---

# Final decision

| Decision | Verdict | Reason |
|---|---|---|
| Approve current v0 contents as a final plan | **No** | Six headings are too broad; key prerequisites and core ToC subtopics are not specified. |
| Approve a corrected syllabus/lesson map | **Yes, after patching** | The six-chapter structure is workable if the Part 3 coverage is added. |
| Approve Claude to write every chapter now | **No** | The master prompt, lesson template, source bank, diagrams, and review rules need to be verified first. |
| Approve a pilot chapter | **Yes** | A small pilot can test whether Claude can teach true beginners. |
| Approve ₹149 sale now | **No** | There is no beginner-tested lesson evidence in this attachment. |

**The one thing I need the team to prove:** a learner who remembers almost nothing can read the first lesson alone, understand every word, follow every diagram and trace, and solve a new question. Until that is demonstrated, the plan is not ready to become a paid book.

---

# Sources and verification links

## Official GATE sources

1. **GATE 2027, IIT Madras — Test Papers & Syllabus.** Official CS syllabus landing page; notes that 2027 syllabi were revised and links the CS syllabus.  
   https://gate2027.iitm.ac.in/exam_papers_and_syllabus
2. **GATE 2027 CS syllabus PDF (linked from the official page).**  
   https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf
3. **GATE 2026, IIT Guwahati — Master Question Papers and Answer Keys.** Official question paper/key archive.  
   https://gate2026.iitg.ac.in/QPs-answer-keys.html
4. **GATE 2026 CS1 official question paper.** Used to verify that the correct 2026 CFG production in Q52 is `S → abaABAbba`, not `S → abaaBAbba`.  
   https://gate2026.iitg.ac.in/doc/download/2026/QPs/CS1.pdf
5. **GATE 2025 CS1 official question paper.** Includes the `αβα` language question.  
   https://gate2026.iitg.ac.in/doc/download/2025/CS12025.pdf
6. **GATE 2024 CS2 official question paper (IISc).** Confirms the regex `b*ab*(ab*ab*)*` and the short-string count of 15; the same text is Q62 in that official paper.  
   https://gate2024.iisc.ac.in/wp-content/uploads/2024/CS224S6.pdf
7. **GATE 2020 official answer-key archive.** Use the CS key’s MTA entry for the odd-number-of-1s regex question.  
   https://gate2026.iitg.ac.in/doc/download/2020/cs_2020.pdf

## Authoritative university course outlines used for coverage cross-check

8. **NPTEL — Theory of Computation (IIT course).** Covers finite automata, regular-language closure, pumping lemma, NFA/ε-NFA, regex, CFG, parse trees, ambiguity, normal forms, CFL pumping, PDA, closure, DCFL, TM, and undecidability.  
   https://www.nptel.ac.in/courses/106104028
9. **NPTEL — Theory of Computation course.** Course sequence includes equivalence of NFA/DFA, regex conversions, minimization, Myhill–Nerode, CNF, CYK, PDA/CFG equivalence, CFL closure, and deterministic CFLs.  
   https://nptel.ac.in/courses/106104148
10. **NPTEL — Theory of Automata and Formal Languages, IIT Guwahati.** Lists regular expressions, DFA minimization, CFG simplification, PDA, DCFL, recursive/RE languages, PCP, and Chomsky hierarchy.  
    https://nptel.ac.in/courses/106103070
11. **MIT OpenCourseWare — Theory of Computation syllabus.** Lists automata, regular and context-free languages, pumping lemmas, Turing machines, decidability, reductions, and related computability material. This is a university-level reference, not a GATE syllabus.  
    https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/pages/syllabus/

## Specific cross-checks for data corrections

12. **GATE 2026 official CS1 paper** — Q52 grammar exact text.  
    https://gate2026.iitg.ac.in/doc/download/2026/QPs/CS1.pdf
13. **GATE 2020 CS answer-key page/reference** — records the odd-1s regex question as “Marks to all.”  
    https://lemyte.com/gate/papers/gate-2020-cs/questions
14. **GATE 2024 CS2 official paper** — official question number Q62 for the `b*ab*(ab*ab*)*` language-count problem.  
    https://gate2024.iisc.ac.in/wp-content/uploads/2024/CS224S6.pdf

---

**Review status:** Complete for the contents and text of the supplied 77-question bank; incomplete only where the attachment itself omits diagrams, Forge questions, old lesson text, or the referenced Claude master prompt. Those items must be supplied before they can be reviewed honestly.
