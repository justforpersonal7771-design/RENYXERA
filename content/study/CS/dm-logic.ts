import type { Chapter, Topic } from "@/lib/study/schema";

/**
 * Discrete Mathematics → Propositional logic and First-order logic. Results from lib/study/dm.ts, checked by script:
 * ((p→q)∧(q→r))→(p→r) tautology; (p→q)→p contingency, true rows m(2, 3); p→(q∧r) ≡ (p→q)∧(p→r); (p∨q)→r ≡ (p→r)∧(q→r);
 * (p→q)→r ≢ p→(q→r) (counterexample all false); p→q ≢ q→p (p F, q T). FOL: ∀x(P∨Q)→(∀xP∨∀xQ) invalid; (∃xP∧∃xQ)→∃x(P∧Q) invalid;
 * (∀xP→∀xQ)→∀x(P→Q) invalid; the other six forms in the lab are valid.
 */

const connectives: Topic = {
  id: "cs.dm.logic.prop",
  title: "Propositions, connectives and truth tables",
  blocks: [
    { type: "hook", text: "\"If it rains, the match is cancelled.\" It did not rain. Was the match played? Logic says: you cannot tell. Half of GATE's logic questions turn on exactly this kind of trap, and a truth table settles every one of them mechanically." },
    { type: "objectives", items: ["Evaluate compound propositions with ¬, ∧, ∨, →, ↔ and ⊕.", "Classify a formula as a tautology, contradiction or contingency.", "Translate English sentences, including 'only if' and 'unless', into logic."] },
    { type: "intuition", paras: ["A proposition is a statement that is either true or false. Connectives build bigger statements from smaller ones, and a truth table lists the value for every combination of the parts: 2ⁿ rows for n variables.", "The implication p → q is false in exactly one case: p true and q false. When p is false the implication is 'vacuously' true, which is why the rain example tells you nothing.", "A tautology is true on every row; a contradiction on none; anything else is a contingency. Checking validity of an argument means checking that (premises) → (conclusion) is a tautology."], analogyLimit: "Everyday 'if' often means 'if and only if' (\"if you finish, you can go\"). In logic, p → q says nothing about what happens when p is false." },
    { type: "definition", name: "Connectives", text: "For propositions p and q:", items: ["¬p is true when p is false. p ∧ q is true when both are; p ∨ q when at least one is.", "p → q is false only when p is true and q false. p ↔ q is true when p and q agree. p ⊕ q when they differ.", "Converse q → p, inverse ¬p → ¬q, contrapositive ¬q → ¬p. Only the contrapositive is equivalent to p → q.", "Precedence: ¬, then ∧, then ∨, then →, then ↔; → groups to the right."] },
    { type: "deep", sections: [
      { h: "Reading English", points: ["'p only if q' means p → q (q is necessary for p).", "'p if q' means q → p. 'p if and only if q' is p ↔ q.", "'p unless q' means ¬q → p, which is p ∨ q.", "'Necessary' points backwards, 'sufficient' points forwards: p is sufficient for q means p → q."], paras: [] },
      { h: "Satisfiable and valid", paras: ["A formula is satisfiable if at least one row makes it true, and valid (a tautology) if every row does. So F is valid exactly when ¬F is unsatisfiable. That link is how SAT solvers check validity, and it is the reason the satisfiability problem is central to complexity theory (it was the first NP-complete problem)."] },
      { h: "Functional completeness", paras: ["Every truth table can be written with ¬, ∧ and ∨ alone (sum of minterms). In fact {¬, ∧}, {¬, ∨} and {→, ¬} each suffice, and so does NAND alone or NOR alone. {∧, ∨} does not: without negation you can never get a formula that is true when all inputs are false and false otherwise... more precisely, any formula built only from ∧ and ∨ is true when all its variables are true."] },
      { h: "Counting truth functions", paras: ["With n variables there are 2ⁿ rows and each row can be T or F, so there are 2^(2ⁿ) distinct truth functions: 4 of one variable, 16 of two, 256 of three. Many different-looking formulas therefore share one truth table."] },
    ] },
    { type: "walkthrough", steps: ["List the variables and write all 2ⁿ rows (FF…F at the top).", "Add a column for each subformula, innermost first.", "Fill the final column.", "All T: tautology. All F: contradiction. Mixed: contingency."], prompt: { q: "Is 'p → q' true when both p and q are false?", a: "Yes. An implication is false only when its hypothesis is true and its conclusion false." } },
    { type: "figure", id: "tt-imp", caption: "Truth table of the main connectives.", alt: "Rows FF, FT, TF, TT for and, or, implies, iff, xor.", fig: { kind: "matrix", title: "p, q", cols: ["p ∧ q", "p ∨ q", "p → q", "p ↔ q", "p ⊕ q"], rows: [{ label: "F F", cells: ["F", "F", "T", "T", "F"] }, { label: "F T", cells: ["F", "T", "T", "F", "T"] }, { label: "T F", cells: ["F", "T", "F", "F", "T"], hl: true }, { label: "T T", cells: ["T", "T", "T", "T", "F"] }] } },
    { type: "example", id: "lx1", level: "gate", title: "Is it a tautology?", given: "F = ((p → q) ∧ (q → r)) → (p → r).", find: "Classify F.",
      steps: [
        { say: "F can be false only if p → r is false, so p = T and r = F." },
        { say: "Then p → q forces q = T, and q → r with r = F forces q = F. Contradiction." },
        { say: "So no row makes F false.", result: "tautology" },
      ],
      answer: "A tautology (the transitivity of implication, hypothetical syllogism).",
      check: "Trying to falsify is faster than an 8-row table: assume the conclusion false and look for a consistent row." },
    { type: "figure", id: "tt-peirce", for: "lx2", caption: "(p → q) → p is true on rows 2 and 3 only.", alt: "Rows FF F, FT F, TF T, TT T.", fig: { kind: "matrix", title: "(p → q) → p", cols: ["p → q", "result"], rows: [{ label: "F F", cells: ["T", "F"] }, { label: "F T", cells: ["T", "F"] }, { label: "T F", cells: ["F", "T"], hl: true }, { label: "T T", cells: ["T", "T"], hl: true }] } },
    { type: "example", id: "lx2", level: "gate", title: "A contingency", given: "G = (p → q) → p.", find: "Its truth table and classification.",
      steps: [
        { say: "Rows FF and FT: p → q is T, and T → F is F." },
        { say: "Row TF: p → q is F, so F → T is T. Row TT: T → T is T.", result: "F, F, T, T" },
      ],
      answer: "A contingency, true exactly when p is true (minterms 2 and 3).",
      check: "Adding '→ p' once more gives ((p → q) → p) → p, Peirce's law, which is a tautology." },
    { type: "example", id: "lx3", level: "edge", title: "Translating 'only if' and 'unless'", given: "s: you can submit. f: you have paid the fee. a: an extension is granted.", find: "Translate 'You can submit only if you have paid the fee, unless an extension is granted.'",
      steps: [
        { say: "'s only if f' is s → f." },
        { say: "'X unless a' is ¬a → X.", result: "¬a → (s → f)" },
      ],
      answer: "¬a → (s → f), equivalently a ∨ ¬s ∨ f.",
      check: "With an extension (a true) the sentence makes no demand: the formula is true whatever s and f are." },
    { type: "lab", lab: "truth" },
    { type: "faded", title: "Your turn", given: "H = (p ∨ q) ∧ (¬p ∨ r) → (q ∨ r).",
      steps: [{ say: "Try to make H false. What must hold?", blank: true, answer: "q = F and r = F; then p ∨ q needs p = T, and ¬p ∨ r needs p = F. Impossible, so H is a tautology (resolution)." }] },
    { type: "trap", wrong: "p → q is false when p is false.", tempting: "'If it rains, the match is cancelled' seems broken when it does not rain.", whyWrong: "The promise is broken only if it rains and the match goes ahead. With p false, the implication holds.", rule: "→ is false only on T → F." },
    { type: "trap", wrong: "'p only if q' means q → p.", tempting: "The word 'if' sits next to q.", whyWrong: "'Only if' marks a necessary condition: p cannot happen without q, so p → q.", rule: "p only if q ≡ p → q." },
    { type: "gate", text: "GATE asks which formulas are tautologies, translation of English sentences (only if, unless, necessary, sufficient), and counting satisfying assignments. Falsify instead of tabulating whenever the main connective is →." },
    { type: "recall", cards: [{ q: "p → q false when", a: "p true, q false" }, { q: "p unless q", a: "p ∨ q" }, { q: "Truth functions of n variables", a: "2^(2ⁿ)" }] },
    { type: "check", questions: [
      { id: "pl1", kind: "MSQ", marks: 2, q: "Which are tautologies?", options: ["((p → q) ∧ (q → r)) → (p → r)", "(p → q) → p", "p → (q → p)", "(p ∨ q) ∧ (¬p ∨ r) → (q ∨ r)"], answer: "A, C, D", solution: "(p → q) → p is false when p is false." },
      { id: "pl2", kind: "NAT", marks: 1, q: "How many rows of the truth table of (p → q) → p are true?", answer: "2", solution: "Rows TF and TT." },
      { id: "pl3", kind: "NAT", marks: 1, q: "How many distinct truth functions of 3 variables exist?", answer: "256", solution: "2^(2³)." },
      { id: "pl4", kind: "MCQ", marks: 2, q: "'You get a refund only if you return the item within 7 days' (r: refund, w: return within 7 days) is", options: ["w → r", "r → w", "r ↔ w", "¬r → ¬w"], answer: "B", solution: "Only if: r → w." },
      { id: "pl5", kind: "MCQ", marks: 1, q: "Which is equivalent to p → q?", options: ["q → p", "¬p → ¬q", "¬q → ¬p", "p ∧ ¬q"], answer: "C", solution: "The contrapositive." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Discrete Mathematics", sub: "Propositional logic", href: "/topics/discrete-mathematics" },
      { label: "Topic 2: equivalences", sub: "Laws and normal forms", href: "/study/logic" },
      { label: "Digital Logic", sub: "The same algebra as circuits", href: "/topics/digital-logic" },
    ] },
    { type: "links", prereq: ["None"], usedIn: ["First-order logic", "Digital Logic: Boolean algebra"], cross: ["Theory of Computation: SAT"] },
  ],
};

const equivalence: Topic = {
  id: "cs.dm.logic.equiv",
  title: "Equivalences, normal forms and inference",
  blocks: [
    { type: "hook", text: "Two formulas can look nothing alike and still say the same thing. Recognising that quickly, with a handful of laws, is faster than any truth table and is what GATE's 'which of these is equivalent' questions reward." },
    { type: "objectives", items: ["Use the standard laws to prove or disprove equivalences.", "Write a formula in DNF and CNF from its truth table.", "Check an argument's validity with rules of inference."] },
    { type: "intuition", paras: ["Two formulas are equivalent (≡) when they have the same truth table, that is when A ↔ B is a tautology.", "Most simplifications use a dozen laws: De Morgan, distributivity, absorption, and p → q ≡ ¬p ∨ q. Rewriting every arrow as ¬p ∨ q turns most questions into algebra.", "Every formula has a disjunctive normal form (an OR of ANDs, one per true row) and a conjunctive normal form (an AND of ORs, one per false row)."], analogyLimit: "Like simplifying algebra; but in logic ∧ distributes over ∨ and ∨ distributes over ∧, which ordinary + and × do not both do." },
    { type: "definition", name: "Key laws", text: "Equivalences used constantly:", items: ["De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q; ¬(p ∨ q) ≡ ¬p ∧ ¬q.", "Implication: p → q ≡ ¬p ∨ q ≡ ¬q → ¬p; ¬(p → q) ≡ p ∧ ¬q.", "p → (q ∧ r) ≡ (p → q) ∧ (p → r); (p ∨ q) → r ≡ (p → r) ∧ (q → r).", "But (p ∧ q) → r ≡ (p → r) ∨ (q → r), and p → (q → r) ≡ (p ∧ q) → r (exportation).", "Absorption: p ∨ (p ∧ q) ≡ p; p ∧ (p ∨ q) ≡ p."] },
    { type: "deep", sections: [
      { h: "Rules of inference", points: ["Modus ponens: p, p → q ⊢ q. Modus tollens: ¬q, p → q ⊢ ¬p.", "Hypothetical syllogism: p → q, q → r ⊢ p → r. Disjunctive syllogism: p ∨ q, ¬p ⊢ q.", "Resolution: p ∨ q, ¬p ∨ r ⊢ q ∨ r (the basis of automated proving).", "Fallacies: affirming the consequent (q, p → q ⊢ p) and denying the antecedent (¬p, p → q ⊢ ¬q) are invalid."], paras: [] },
      { h: "Normal forms from a truth table", paras: ["DNF: for each true row, AND the literals (variable if T, negated if F), then OR the terms together: the sum of minterms Σm. CNF: for each false row, OR the opposite literals, then AND the clauses: the product of maxterms ΠM. The minterm numbers of a formula and of its negation together cover every row exactly once."] },
      { h: "Implication is not associative", paras: ["(p → q) → r and p → (q → r) differ: with p, q, r all false, the first is (T) → F = F while the second is T. The arrow groups to the right by convention, so p → q → r means p → (q → r)."] },
      { h: "Duality", paras: ["Swapping ∧ with ∨ and T with F in an equivalence that uses only ¬, ∧, ∨ gives another valid equivalence (its dual). De Morgan's two laws are duals of each other, as are the two absorption laws."] },
    ] },
    { type: "walkthrough", steps: ["Rewrite → as ¬ ∨ and ↔ as (¬p ∨ q) ∧ (p ∨ ¬q).", "Push negations inward with De Morgan.", "Distribute and absorb until both sides match, or", "Find one row where they differ: that disproves equivalence."], prompt: { q: "To disprove an equivalence, how many rows do you need?", a: "One row where the two formulas differ." } },
    { type: "figure", id: "eq-laws", caption: "Splitting implications: which way each law goes.", alt: "Conjunction in the conclusion splits into an AND; disjunction in the hypothesis splits into an AND; conjunction in the hypothesis gives an OR.", fig: { kind: "matrix", title: "Equivalent to", cols: ["Rewritten"], rows: [{ label: "p → (q ∧ r)", cells: ["(p → q) ∧ (p → r)"] }, { label: "p → (q ∨ r)", cells: ["(p → q) ∨ (p → r)"] }, { label: "(p ∨ q) → r", cells: ["(p → r) ∧ (q → r)"], hl: true }, { label: "(p ∧ q) → r", cells: ["(p → r) ∨ (q → r)"] }] } },
    { type: "example", id: "ex1", level: "gate", title: "Proving an equivalence with laws", given: "Show (p ∨ q) → r ≡ (p → r) ∧ (q → r).",
      find: "A chain of laws.",
      steps: [
        { say: "(p ∨ q) → r ≡ ¬(p ∨ q) ∨ r." },
        { say: "De Morgan: (¬p ∧ ¬q) ∨ r." },
        { say: "Distribute: (¬p ∨ r) ∧ (¬q ∨ r) ≡ (p → r) ∧ (q → r).", result: "equivalent" },
      ],
      answer: "Equivalent: a disjunction in the hypothesis splits into a conjunction of implications.",
      check: "The lab confirms both have minterms Σm(0, 1, 3, 5, 7)." },
    { type: "figure", id: "eq-dnf", for: "ex2", caption: "p → q from its truth table.", alt: "True rows 0, 1, 3 give the DNF; false row 2 gives the CNF.", fig: { kind: "strip", items: [{ label: "True rows", sub: "m0, m1, m3", state: "done" }, { label: "DNF", sub: "¬p¬q ∨ ¬pq ∨ pq", state: "done" }, { label: "False row", sub: "M2 (p = T, q = F)", state: "now" }, { label: "CNF", sub: "(¬p ∨ q)", state: "done" }] } },
    { type: "example", id: "ex2", level: "gate", title: "Normal forms", given: "F = p → q.", find: "Its canonical DNF and CNF.",
      steps: [
        { say: "True rows: 00, 01, 11 (minterms 0, 1, 3).", result: "DNF: (¬p ∧ ¬q) ∨ (¬p ∧ q) ∨ (p ∧ q)" },
        { say: "False row: 10 (maxterm 2). Clause: ¬p ∨ q.", result: "CNF: ¬p ∨ q" },
      ],
      answer: "DNF Σm(0, 1, 3); CNF ΠM(2) = (¬p ∨ q).",
      check: "The DNF simplifies to ¬p ∨ q too: both forms describe the same function." },
    { type: "example", id: "ex3", level: "edge", title: "Valid or fallacy?", given: "Premises: 'If the server is down, the site fails' and 'The site failed.' Conclusion: 'The server is down.'", find: "Is the argument valid?",
      steps: [
        { say: "Form: p → q, q ⊢ p." },
        { say: "Row p = F, q = T makes both premises true and the conclusion false.", result: "invalid" },
      ],
      answer: "Invalid: affirming the consequent. The site could fail for another reason.",
      check: "The valid version is modus tollens: p → q and ¬q give ¬p." },
    { type: "lab", lab: "equiv" },
    { type: "faded", title: "Your turn", given: "Is (p → q) → r equivalent to p → (q → r)?",
      steps: [{ say: "Find a row where they differ.", blank: true, answer: "p = q = r = F: left is T → F = F, right is T. Not equivalent." }] },
    { type: "trap", wrong: "(p ∧ q) → r ≡ (p → r) ∧ (q → r).", tempting: "It mirrors the rule for ∨ in the hypothesis.", whyWrong: "With p = T, q = F, r = F the left side is T but the right side is F. The correct split uses ∨.", rule: "(p ∧ q) → r ≡ (p → r) ∨ (q → r)." },
    { type: "trap", wrong: "The converse of a true implication is true.", tempting: "It feels symmetric.", whyWrong: "p → q and q → p differ on the rows TF and FT.", rule: "Only the contrapositive is equivalent." },
    { type: "gate", text: "Expect 'which is equivalent to' MCQs and MSQs, normal-form or minterm counting, and validity of arguments. Rewrite arrows as ¬ ∨ first, then use De Morgan." },
    { type: "recall", cards: [{ q: "¬(p → q)", a: "p ∧ ¬q" }, { q: "(p ∨ q) → r", a: "(p → r) ∧ (q → r)" }, { q: "Affirming the consequent", a: "Invalid: q, p → q ⊬ p" }] },
    { type: "check", questions: [
      { id: "eq1", kind: "MSQ", marks: 2, q: "Which are equivalent to p → (q ∧ r)?", options: ["(p → q) ∧ (p → r)", "¬p ∨ (q ∧ r)", "(p → q) ∨ (p → r)", "(¬p ∨ q) ∧ (¬p ∨ r)"], answer: "A, B, D", solution: "The ∨ version is weaker." },
      { id: "eq2", kind: "MCQ", marks: 1, q: "¬(p → q) is equivalent to", options: ["¬p → ¬q", "p ∧ ¬q", "¬p ∨ q", "¬p ∧ q"], answer: "B", solution: "¬(¬p ∨ q)." },
      { id: "eq3", kind: "NAT", marks: 2, q: "How many minterms does (p → q) ∧ (p → r) have?", answer: "5", solution: "True whenever p is false (4 rows) plus p = q = r = T." },
      { id: "eq4", kind: "MCQ", marks: 2, q: "Premises ¬q and p → q give, by modus tollens,", options: ["p", "¬p", "q", "nothing"], answer: "B", solution: "Modus tollens." },
      { id: "eq5", kind: "MCQ", marks: 1, q: "p → (q → r) is equivalent to", options: ["(p → q) → r", "(p ∧ q) → r", "(p ∨ q) → r", "p ∧ q ∧ r"], answer: "B", solution: "Exportation." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Discrete Mathematics", sub: "Logic", href: "/topics/discrete-mathematics" },
      { label: "Topic 1: truth tables", sub: "The basics", href: "/study/logic" },
      { label: "Digital Logic: minimisation", sub: "Minterms and maxterms in circuits", href: "/topics/digital-logic" },
    ] },
    { type: "links", prereq: ["Truth tables"], usedIn: ["First-order logic", "Boolean algebra"], cross: ["Digital Logic: K-maps"] },
  ],
};

const quantifiersT: Topic = {
  id: "cs.dm.fol.quant",
  title: "Predicates and quantifiers",
  blocks: [
    { type: "hook", text: "\"Everyone loves someone\" and \"someone is loved by everyone\" use the same words in a different order and mean completely different things. Quantifier order is where most first-order logic marks are won or lost." },
    { type: "objectives", items: ["Read and write statements with ∀ and ∃, including nested ones.", "Negate quantified statements correctly.", "Translate English into first-order logic with the right connective under each quantifier."] },
    { type: "intuition", paras: ["A predicate P(x) becomes true or false once x is chosen from a domain. ∀x P(x) says it holds for every x; ∃x P(x) for at least one.", "On a finite domain, ∀ is a big AND and ∃ is a big OR. That is why negation flips them: ¬∀x P(x) ≡ ∃x ¬P(x), just as De Morgan flips ∧ and ∨.", "With a relation R(x, y), think of a grid. ∀x ∃y R(x, y): every row has a tick. ∃y ∀x R(x, y): some column is full. A full column puts a tick in every row, so the second implies the first, never the reverse."], analogyLimit: "Everyday English hides quantifiers ('a student failed' means some; 'a student must register' means every)." },
    { type: "definition", name: "Quantifiers", text: "Over a domain D:", items: ["∀x P(x): P holds for every x in D. ∃x P(x): for at least one.", "¬∀x P(x) ≡ ∃x ¬P(x); ¬∃x P(x) ≡ ∀x ¬P(x).", "Same quantifiers commute: ∀x∀y ≡ ∀y∀x, ∃x∃y ≡ ∃y∃x. Mixed ones do not.", "'All A are B': ∀x (A(x) → B(x)). 'Some A is B': ∃x (A(x) ∧ B(x))."] },
    { type: "deep", sections: [
      { h: "Why → under ∀ and ∧ under ∃", paras: ["∀x (A(x) ∧ B(x)) would claim everything in the domain is an A, far too strong. ∃x (A(x) → B(x)) is true as soon as anything is not an A, far too weak. So: ∀ pairs with →, ∃ pairs with ∧."] },
      { h: "Free and bound variables", paras: ["In ∀x P(x, y), x is bound and y is free; the formula's truth depends on y. A sentence has no free variables. Renaming a bound variable consistently (∀x P(x) to ∀z P(z)) changes nothing."] },
      { h: "Uniqueness", paras: ["'Exactly one x has P' is ∃x (P(x) ∧ ∀y (P(y) → y = x)). 'At most one' drops the existence part: ∀x ∀y (P(x) ∧ P(y) → x = y)."] },
      { h: "Negating nested statements", paras: ["Push ¬ inward one quantifier at a time, flipping each: ¬∀x ∃y R(x, y) ≡ ∃x ∀y ¬R(x, y). In words: 'not everyone loves someone' means 'someone loves nobody'."] },
    ] },
    { type: "walkthrough", steps: ["Identify the domain and the predicates.", "Find each quantifier in the English and its scope.", "Under ∀ use →; under ∃ use ∧.", "To negate, flip each quantifier and negate the innermost formula."], prompt: { q: "Does ∀x ∃y R(x, y) imply ∃y ∀x R(x, y)?", a: "No. Every row having a tick does not mean one column is full." } },
    { type: "figure", id: "q-grid", caption: "A cyclic relation on {1, 2, 3, 4}: R(x, y) when y = x + 1 (and 4 → 1).", alt: "Every row and column has exactly one tick; no row or column is full.", fig: { kind: "matrix", title: "R(x, y)", cols: ["y=1", "y=2", "y=3", "y=4"], rows: [{ label: "x=1", cells: ["", "✓", "", ""] }, { label: "x=2", cells: ["", "", "✓", ""] }, { label: "x=3", cells: ["", "", "", "✓"] }, { label: "x=4", cells: ["✓", "", "", ""], hl: true }] } },
    { type: "example", id: "qx1", level: "gate", title: "Order matters", given: "Domain {1, 2, 3, 4}, R(x, y) true exactly when y is the next number around the cycle (1→2→3→4→1).", find: "Truth values of ∀x ∃y R(x, y) and ∃y ∀x R(x, y).",
      steps: [
        { say: "Every x has a successor, so every row has a tick.", result: "∀x ∃y R: true" },
        { say: "No y is the successor of every x; no column is full.", result: "∃y ∀x R: false" },
      ],
      answer: "∀x ∃y R(x, y) is true; ∃y ∀x R(x, y) is false.",
      check: "Make column 1 full in the lab and both become true." },
    { type: "figure", id: "q-neg", for: "qx2", caption: "Negation flips every quantifier on the way in.", alt: "Not for all x exists y R becomes exists x for all y not R.", fig: { kind: "strip", items: [{ label: "¬∀x ∃y R(x, y)", sub: "start", state: "done" }, { label: "∃x ¬∃y R(x, y)", sub: "flip ∀", state: "done" }, { label: "∃x ∀y ¬R(x, y)", sub: "flip ∃", state: "now" }] } },
    { type: "example", id: "qx2", level: "gate", title: "Negating a nested statement", given: "'Every student has solved some problem': ∀s ∃p Solved(s, p).", find: "Its negation, in logic and in English.",
      steps: [
        { say: "¬∀s ∃p Solved(s, p) ≡ ∃s ¬∃p Solved(s, p)." },
        { say: "≡ ∃s ∀p ¬Solved(s, p).", result: "some student solved no problem" },
      ],
      answer: "∃s ∀p ¬Solved(s, p): some student has solved no problem.",
      check: "Not 'no student solved any problem', which would be ∀s ∀p ¬Solved(s, p)." },
    { type: "example", id: "qx3", level: "edge", title: "Choosing the connective", given: "Domain: all people. C(x): x is a coder. L(x): x knows logic.", find: "Translate 'All coders know logic' and 'Some coder knows logic'.",
      steps: [
        { say: "Universal: ∀x (C(x) → L(x))." },
        { say: "Existential: ∃x (C(x) ∧ L(x)).", result: "→ with ∀, ∧ with ∃" },
      ],
      answer: "∀x (C(x) → L(x)) and ∃x (C(x) ∧ L(x)).",
      check: "∃x (C(x) → L(x)) would be true just because some non-coder exists." },
    { type: "lab", lab: "quant" },
    { type: "faded", title: "Your turn", given: "'No coder is bored': with B(x) for bored.",
      steps: [{ say: "Write it two ways.", blank: true, answer: "∀x (C(x) → ¬B(x)), equivalently ¬∃x (C(x) ∧ B(x))." }] },
    { type: "trap", wrong: "'All A are B' is ∀x (A(x) ∧ B(x)).", tempting: "Both properties must hold.", whyWrong: "That says every object in the domain is both an A and a B.", rule: "∀ goes with →." },
    { type: "trap", wrong: "¬∀x P(x) ≡ ∀x ¬P(x).", tempting: "Just negate the inside.", whyWrong: "'Not all are P' means at least one is not P, not that none are.", rule: "Flip the quantifier when negating." },
    { type: "gate", text: "GATE gives English sentences and asks the right formula (often with 'only', 'no', 'not every'), asks which nested statements imply others, and asks negations. Check ∀ with → and ∃ with ∧ first; it eliminates most wrong options." },
    { type: "recall", cards: [{ q: "¬∃x P(x)", a: "∀x ¬P(x)" }, { q: "All A are B", a: "∀x (A(x) → B(x))" }, { q: "∃y∀x R implies", a: "∀x∃y R (not conversely)" }] },
    { type: "check", questions: [
      { id: "fq1", kind: "MCQ", marks: 2, q: "'Not every student passed' (S: student, P: passed) is", options: ["∀x (S(x) → ¬P(x))", "∃x (S(x) ∧ ¬P(x))", "¬∃x (S(x) ∧ P(x))", "∃x (S(x) → ¬P(x))"], answer: "B", solution: "¬∀x (S → P) ≡ ∃x (S ∧ ¬P)." },
      { id: "fq2", kind: "MSQ", marks: 2, q: "Which are always true?", options: ["∃y ∀x R(x, y) → ∀x ∃y R(x, y)", "∀x ∃y R(x, y) → ∃y ∀x R(x, y)", "∀x ∀y R(x, y) → ∀y ∀x R(x, y)", "∃x ∃y R(x, y) → ∃y ∃x R(x, y)"], answer: "A, C, D", solution: "B fails on the cyclic relation." },
      { id: "fq3", kind: "MCQ", marks: 1, q: "The negation of ∀x ∃y R(x, y) is", options: ["∃x ∀y ¬R(x, y)", "∀x ∀y ¬R(x, y)", "∃x ∃y ¬R(x, y)", "∀x ∃y ¬R(x, y)"], answer: "A", solution: "Flip both quantifiers." },
      { id: "fq4", kind: "MCQ", marks: 1, q: "'Some coder knows logic' is", options: ["∃x (C(x) → L(x))", "∃x (C(x) ∧ L(x))", "∀x (C(x) ∧ L(x))", "∀x (C(x) → L(x))"], answer: "B", solution: "∃ goes with ∧." },
      { id: "fq5", kind: "NAT", marks: 2, q: "Domain {1, 2, 3, 4}, R(x, y) is the cycle 1→2→3→4→1. How many of ∀x∃y R, ∃y∀x R, ∀y∃x R, ∃x∀y R are true?", answer: "2", solution: "Every row and every column has a tick; none is full." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Discrete Mathematics", sub: "First-order logic", href: "/topics/discrete-mathematics" },
      { label: "Topic 2: validity", sub: "Which quantified statements always hold", href: "/study/first-order-logic" },
      { label: "Databases: tuple calculus", sub: "Quantifiers as queries", href: "/topics/database-management-systems-dbms" },
    ] },
    { type: "links", prereq: ["Propositional logic"], usedIn: ["Relational calculus", "Program verification"], cross: ["Databases: tuple relational calculus"] },
  ],
};

const validity: Topic = {
  id: "cs.dm.fol.valid",
  title: "Valid statements and quantifier laws",
  blocks: [
    { type: "hook", text: "∀ distributes over ∧, ∃ over ∨, and that is where it ends. GATE loves offering the other two as options, and the quickest way to reject them is a two-object counterexample." },
    { type: "objectives", items: ["Decide which quantifier laws are valid.", "Build small counterexamples for invalid ones.", "Apply universal and existential instantiation in arguments."] },
    { type: "intuition", paras: ["A first-order formula is valid if it is true in every interpretation: every non-empty domain and every meaning of its predicates. To refute validity you need just one interpretation where it fails.", "For statements about one-place predicates P and Q, tiny domains are enough. Take two objects: one that is P but not Q, one that is Q but not P. That model breaks most of the tempting 'laws'.", "The safe directions: ∀x (P ∧ Q) ≡ ∀x P ∧ ∀x Q, ∃x (P ∨ Q) ≡ ∃x P ∨ ∃x Q. The one-way ones: ∀x P ∨ ∀x Q → ∀x (P ∨ Q), and ∃x (P ∧ Q) → ∃x P ∧ ∃x Q."], analogyLimit: "Like checking a formula on a few test cases; but a passing test proves nothing about validity, only a failing one is decisive (unless, as here, small models are known to suffice)." },
    { type: "definition", name: "Quantifier laws", text: "Valid in every interpretation:", items: ["∀x (P(x) ∧ Q(x)) ↔ ∀x P(x) ∧ ∀x Q(x).", "∃x (P(x) ∨ Q(x)) ↔ ∃x P(x) ∨ ∃x Q(x).", "∀x P(x) ∨ ∀x Q(x) → ∀x (P(x) ∨ Q(x)) (one way only).", "∃x (P(x) ∧ Q(x)) → ∃x P(x) ∧ ∃x Q(x) (one way only).", "∀x (P(x) → Q(x)) → (∀x P(x) → ∀x Q(x)) (not conversely)."] },
    { type: "deep", sections: [
      { h: "Inference rules", points: ["Universal instantiation: from ∀x P(x), conclude P(c) for any c.", "Universal generalisation: from P(c) for an arbitrary c, conclude ∀x P(x).", "Existential instantiation: from ∃x P(x), conclude P(c) for a new name c.", "Existential generalisation: from P(c), conclude ∃x P(x)."], paras: [] },
      { h: "Moving quantifiers past a formula without x", paras: ["If x does not occur in A: ∀x (A ∧ P(x)) ≡ A ∧ ∀x P(x), and ∀x (A → P(x)) ≡ A → ∀x P(x). But ∀x (P(x) → A) ≡ ∃x P(x) → A: the quantifier flips when it moves out of the hypothesis of an implication."] },
      { h: "Why domains are non-empty", paras: ["Standard first-order logic assumes at least one object. That makes ∀x P(x) → ∃x P(x) valid. On an empty domain every ∀ is vacuously true and every ∃ false, and the implication would fail."] },
      { h: "Validity is undecidable in general", paras: ["For formulas with two-place predicates, no algorithm decides validity (Church and Turing). For one-place predicates only, a model with at most 2^k objects (k predicates) always suffices, which is why our lab's small search is complete for its forms."] },
    ] },
    { type: "walkthrough", steps: ["Read the claimed law and its direction.", "Try the two-object model: object 1 is P only, object 2 is Q only.", "If both sides differ, the law is invalid in that direction.", "If no small model breaks it, prove it with the laws or instantiation rules."], prompt: { q: "Why does ∀x (P ∨ Q) not give ∀x P ∨ ∀x Q?", a: "Each object may satisfy a different one; neither P nor Q needs to hold for everything." } },
    { type: "figure", id: "v-laws", caption: "Which directions are valid.", alt: "Forall distributes over and, exists over or; the mixed ones hold one way.", fig: { kind: "matrix", title: "Valid?", cols: ["→", "←"], rows: [{ label: "∀x(P∧Q) vs ∀xP ∧ ∀xQ", cells: ["yes", "yes"] }, { label: "∃x(P∨Q) vs ∃xP ∨ ∃xQ", cells: ["yes", "yes"] }, { label: "∀x(P∨Q) vs ∀xP ∨ ∀xQ", cells: ["no", "yes"], hl: true }, { label: "∃x(P∧Q) vs ∃xP ∧ ∃xQ", cells: ["yes", "no"], hl: true }] } },
    { type: "example", id: "vx1", level: "gate", title: "Refuting with two objects", given: "Claim: (∃x P(x) ∧ ∃x Q(x)) → ∃x (P(x) ∧ Q(x)).", find: "Is it valid?",
      steps: [
        { say: "Domain {a, b}: P(a) true, Q(a) false; P(b) false, Q(b) true." },
        { say: "∃x P and ∃x Q are both true; no object has both.", result: "premise true, conclusion false" },
      ],
      answer: "Not valid. 'Someone is tall and someone is short' does not mean someone is both.",
      check: "The converse, ∃x (P ∧ Q) → ∃x P ∧ ∃x Q, is valid." },
    { type: "figure", id: "v-model", for: "vx2", caption: "The two-object counterexample.", alt: "Object 1: P false, Q true. Object 2: P true, Q false.", fig: { kind: "matrix", title: "Model", cols: ["P", "Q", "P ∨ Q"], rows: [{ label: "object 1", cells: ["F", "T", "T"] }, { label: "object 2", cells: ["T", "F", "T"] }] } },
    { type: "example", id: "vx2", level: "gate", title: "The other tempting law", given: "Claim: ∀x (P(x) ∨ Q(x)) → (∀x P(x) ∨ ∀x Q(x)).", find: "Valid?",
      steps: [
        { say: "Same model: every object has P or Q, so ∀x (P ∨ Q) is true." },
        { say: "Neither P nor Q holds for both objects.", result: "conclusion false" },
      ],
      answer: "Not valid. 'Every number is even or odd' does not mean all are even or all are odd.",
      check: "The reverse direction is valid." },
    { type: "example", id: "vx3", level: "edge", title: "A one-way implication law", given: "(∀x P(x) → ∀x Q(x)) → ∀x (P(x) → Q(x)).", find: "Valid?",
      steps: [
        { say: "Domain {a, b}: P(a) true, P(b) false; Q false for both." },
        { say: "∀x P is false, so the premise ∀x P → ∀x Q is true." },
        { say: "But P(a) → Q(a) is false, so ∀x (P → Q) is false.", result: "invalid" },
      ],
      answer: "Not valid. The forward version, ∀x (P → Q) → (∀x P → ∀x Q), is valid.",
      check: "The lab finds exactly this counterexample." },
    { type: "lab", lab: "fol" },
    { type: "faded", title: "Your turn", given: "Is ∀x P(x) → ∃x P(x) valid?",
      steps: [{ say: "Decide and justify.", blank: true, answer: "Valid, because domains are non-empty: some object exists and it has P." }] },
    { type: "trap", wrong: "∃x distributes over ∧.", tempting: "∀ distributes over ∧, so ∃ should too.", whyWrong: "The P-object and the Q-object can be different. ∃ distributes over ∨, not ∧.", rule: "∀ with ∧, ∃ with ∨." },
    { type: "trap", wrong: "One model that satisfies a formula shows it is valid.", tempting: "It worked in the example.", whyWrong: "Validity needs every interpretation. One model only shows satisfiability.", rule: "One counterexample refutes; one example proves nothing." },
    { type: "gate", text: "A standard GATE MSQ lists four quantified statements and asks which are valid. Use the two-object model (P-only, Q-only) on each; it settles nearly every option in seconds." },
    { type: "recall", cards: [{ q: "∀x(P∧Q) ≡", a: "∀xP ∧ ∀xQ" }, { q: "∃x(P∨Q) ≡", a: "∃xP ∨ ∃xQ" }, { q: "Refute validity with", a: "One counterexample model" }] },
    { type: "check", questions: [
      { id: "fv1", kind: "MSQ", marks: 2, q: "Which are valid?", options: ["∀x (P(x) ∧ Q(x)) ↔ ∀x P(x) ∧ ∀x Q(x)", "(∃x P(x) ∧ ∃x Q(x)) → ∃x (P(x) ∧ Q(x))", "∃x (P(x) ∨ Q(x)) ↔ ∃x P(x) ∨ ∃x Q(x)", "∀x (P(x) ∨ Q(x)) → ∀x P(x) ∨ ∀x Q(x)"], answer: "A, C", solution: "B and D fail on the two-object model." },
      { id: "fv2", kind: "MCQ", marks: 2, q: "Which is valid?", options: ["(∀x P → ∀x Q) → ∀x (P → Q)", "∀x (P → Q) → (∀x P → ∀x Q)", "∃x P → ∀x P", "∀x (P ∨ Q) → ∀x P"], answer: "B", solution: "Only the forward implication law." },
      { id: "fv3", kind: "NAT", marks: 1, q: "Fewest objects in a counterexample to (∃x P ∧ ∃x Q) → ∃x (P ∧ Q)?", answer: "2", solution: "One P-object and one Q-object." },
      { id: "fv4", kind: "MCQ", marks: 1, q: "From ∀x P(x), universal instantiation gives", options: ["∃x P(x) only", "P(c) for any c", "P(c) for a new name only", "¬P(c)"], answer: "B", solution: "Any element." },
      { id: "fv5", kind: "MCQ", marks: 2, q: "If x does not occur in A, ∀x (P(x) → A) is equivalent to", options: ["∀x P(x) → A", "∃x P(x) → A", "A → ∀x P(x)", "∃x (A → P(x))"], answer: "B", solution: "The quantifier flips out of the hypothesis." },
    ] },
    { type: "practice", links: [
      { label: "Real GATE questions on Discrete Mathematics", sub: "Valid FOL statements", href: "/topics/discrete-mathematics" },
      { label: "Topic 1: quantifiers", sub: "Reading and negating", href: "/study/first-order-logic" },
      { label: "Theory of Computation", sub: "Undecidability of validity", href: "/topics/theory-of-computation-toc" },
    ] },
    { type: "links", prereq: ["Quantifiers"], usedIn: ["Proofs", "Program verification"], cross: ["TOC: undecidability"] },
  ],
};

export const DM_LOGIC: Chapter = {
  id: "cs.dm.logic", subject: "Discrete Mathematics", title: "Propositional logic",
  syllabus: ["CS · Discrete Mathematics: Propositional logic"], pyqTopic: /propositional|logic/i,
  map: { kind: "strip", items: [{ label: "1. Connectives", sub: "truth tables", state: "done" }, { label: "2. Equivalences", sub: "laws, normal forms, inference", state: "done" }] },
  topics: [connectives, equivalence],
};
export const DM_FOL: Chapter = {
  id: "cs.dm.fol", subject: "Discrete Mathematics", title: "First-order logic",
  syllabus: ["CS · Discrete Mathematics: First order logic"], pyqTopic: /first order|predicate|quantif/i,
  map: { kind: "strip", items: [{ label: "1. Quantifiers", sub: "reading, negating", state: "done" }, { label: "2. Validity", sub: "laws and counterexamples", state: "done" }] },
  topics: [quantifiersT, validity],
};
