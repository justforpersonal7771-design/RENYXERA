# ChatGPT in-depth review: Discrete Mathematics

**Review basis:** the uploaded `Pasted text(3).txt` (contents v0, PYQ statistics, and 75 question statements with marked official answers).  
**Review stance:** a 25-year-old GATE repeater who has weak foundations and needs every word, symbol and step explained.  
**Scope warning:** the upload contains a contents list, not the actual 27 existing lesson texts. Therefore I can review the proposed chapter map, the PYQ bank, the syllabus match, and the plan needed to rewrite it. I cannot honestly grade the clarity, length or correctness of lessons I was not given.

---

## PART 1. FEELINGS — ten honest lines

1. I feel relieved that the subject is divided into eight chapters and that the chapter names broadly match the things I have heard in GATE coaching.
2. I do not yet feel that I can study from this book: “partial orders”, “lattices”, “monoids”, “generating functions” and “matching” are names, not explanations.
3. I would get scared if a chapter began with symbols such as \(\forall\), \(\exists\), \(\preceq\), \(\Delta\), or \(A^3\) without first telling me what each symbol means in ordinary language.
4. The contents do not tell me what I must learn first, what I can postpone, or how one lesson prepares me for the next.
5. The PYQ bank helps because I can see the subject is not imaginary theory: the questions use small examples, tables, graphs and calculations.
6. It also scares me: many questions are labelled medium or hard, and the draft gives no promise that a beginner can reach that level through worked steps.
7. I need pictures badly for Hasse diagrams, graph traversal, matchings, colourings, recurrence trees and the construction of generating functions.
8. I like that the bank includes full question wording and answer markers, but missing figures and at least one altered formula make me worry about the reliability of the source.
9. I cannot tell whether the existing lessons are actually good because their text is not in this upload; “4 topics ready” is not evidence that those topics teach me properly.
10. **Would I pay ₹149 now? No.** I would pay only after seeing a sample lesson that starts from zero, solves one easy example slowly, shows a diagram, then builds up to a GATE question without skipping steps.

---

## PART 2. GAP TABLE — 80 problems to fix

The gaps below are gaps in the *contents/plan supplied*, not claims that every absent item is missing from the unseen lesson text. The current file itself says the written lessons use the old, short standard and will be rewritten.

| # | Where | What I could not understand or what is missing | Type | What to add or change | Priority |
|---:|---|---|---|---|---|
| 1 | Ch. 1 Propositional logic | No first lesson says what a proposition is, and what is not a proposition. | MISSING-PREREQUISITE | Start with ordinary true/false statements, questions, commands and open sentences. | HIGH |
| 2 | Ch. 1 | AND, OR, NOT, implication and biconditional are not listed separately. | UNEXPLAINED-WORD | Define each connective in plain English before using symbols. | HIGH |
| 3 | Ch. 1 | There is no listed truth-table lesson. | MISSING-GATE-CONCEPT | Add truth tables for all basic connectives and compound statements. | HIGH |
| 4 | Ch. 1 | I do not know the priority of operators or how brackets change meaning. | STEP-SKIPPED | Teach precedence, brackets and one expression at a time. | HIGH |
| 5 | Ch. 1 | “Only if”, “if”, “unless”, “necessary” and “sufficient” can easily be confused. | NEEDS-EXAMPLE | Make a translation table with everyday statements and counterexamples. | HIGH |
| 6 | Ch. 1 | Tautology, contradiction and contingency are not named in the contents. | MISSING-GATE-CONCEPT | Explain them using complete truth tables and one-line tests. | HIGH |
| 7 | Ch. 1 | Logical equivalence is not identified as a separate skill. | MISSING-GATE-CONCEPT | Teach equivalence, implication equivalences, De Morgan’s laws and contraposition. | HIGH |
| 8 | Ch. 1 | CNF, DNF and rewriting expressions are not mentioned. | MISSING-GATE-CONCEPT | Include basic normal forms and show each conversion step. | MEDIUM |
| 9 | Ch. 1 | The bank tests logical arguments, but rules of inference are not in the contents. | MISSING-GATE-CONCEPT | Add modus ponens, modus tollens, hypothetical syllogism and invalid-reasoning traps. | MEDIUM |
| 10 | Ch. 1 | Mathematical induction is needed by a supplied PYQ but has no named home. | MISSING-GATE-CONCEPT | Add a short proof-by-induction lesson or explicitly cross-link it from logic. | HIGH |
| 11 | Ch. 2 First-order logic | No prerequisite lesson introduces predicates, variables and a domain. | MISSING-PREREQUISITE | Begin with “P(x) means…” and use tiny finite domains. | HIGH |
| 12 | Ch. 2 | Free and bound variables are not listed. | UNEXPLAINED-WORD | Show variable scope with coloured brackets and examples. | HIGH |
| 13 | Ch. 2 | The difference between \(\forall x\exists y\) and \(\exists y\forall x\) is not called out. | NEEDS-EXAMPLE | Use “everyone knows someone” versus “someone is known by everyone”. | HIGH |
| 14 | Ch. 2 | Negating a quantified statement is a common trap but not named. | MISSING-GATE-CONCEPT | Teach quantifier negation with several plain-English examples. | HIGH |
| 15 | Ch. 2 | “Exactly one” is not listed. | MISSING-GATE-CONCEPT | Teach existence plus uniqueness, including the “no second different witness” condition. | HIGH |
| 16 | Ch. 2 | The contents do not say how to translate “everyone has exactly one…” or “there exists a person…”. | NEEDS-EXAMPLE | Build the formula in stages and explain each bracket. | HIGH |
| 17 | Ch. 2 | Domain restrictions (integers, positive integers, non-empty sets) are not emphasised. | FACT-DOUBT | Put the domain above every predicate question and state it explicitly. | HIGH |
| 18 | Ch. 2 | Logical validity and countermodels are not named. | MISSING-GATE-CONCEPT | Teach how one counterexample assignment disproves a formula. | MEDIUM |
| 19 | Ch. 2 | The PYQ bank includes a small-model question with no functions, but model language is absent. | MISSING-FINER-POINT | Explain relational vocabulary, witnesses and restricting a model to those witnesses at the required level. | LOW |
| 20 | Ch. 2 | Divisibility predicates over positive integers versus all integers are easy to misread. | NEEDS-EXAMPLE | Add a careful domain-and-divisor example; state whether divisors may be negative. | MEDIUM |
| 21 | Ch. 3 Sets, relations, functions | The set chapter does not name membership, subset and proper subset separately. | MISSING-PREREQUISITE | Start with element-versus-set examples and Venn diagrams. | HIGH |
| 22 | Ch. 3 | Union, intersection, difference, complement and symmetric difference are not listed. | MISSING-GATE-CONCEPT | Teach each operation with shaded diagrams and small sets. | HIGH |
| 23 | Ch. 3 | Cartesian product and ordered pairs are not listed. | MISSING-GATE-CONCEPT | Explain why \((a,b)\neq(b,a)\) in general and count products. | HIGH |
| 24 | Ch. 3 | Power sets and their cardinality are not listed. | MISSING-GATE-CONCEPT | Show every subset of a 2- or 3-element set, then derive \(2^n\). | HIGH |
| 25 | Ch. 3 | Relations are named, but no definition as a subset of \(A\times A\) is stated. | MISSING-PREREQUISITE | Draw relation arrows and ordered-pair lists before teaching properties. | HIGH |
| 26 | Ch. 3 | Reflexive, irreflexive, symmetric, antisymmetric and transitive are not enumerated. | UNEXPLAINED-WORD | Give one true and one false example for every property. | HIGH |
| 27 | Ch. 3 | The difference between symmetric and antisymmetric is a major trap. | NEEDS-EXAMPLE | Put them side by side with a two-element relation. | HIGH |
| 28 | Ch. 3 | Equivalence relations, equivalence classes and partitions are not named. | MISSING-GATE-CONCEPT | Teach how classes are formed and why they partition a set. | HIGH |
| 29 | Ch. 3 | Relation composition, inverse relations and closures are not listed. | MISSING-FINER-POINT | Add at least composition and transitive/reflexive closure if time permits. | MEDIUM |
| 30 | Ch. 3 | Injective, surjective and bijective functions are not broken into separate tests. | MISSING-GATE-CONCEPT | Use arrow diagrams and counterexamples for each property. | HIGH |
| 31 | Ch. 4 Partial orders and lattices | The contents do not first explain a partial order as reflexive, antisymmetric and transitive. | MISSING-PREREQUISITE | Teach the three rules using divisibility and subset examples. | HIGH |
| 32 | Ch. 4 | Comparable and incomparable elements are not listed. | UNEXPLAINED-WORD | Use a small poset and ask which pairs can be compared. | HIGH |
| 33 | Ch. 4 | Hasse diagram construction is not named as a skill. | NEEDS-DIAGRAM | Show removal of reflexive and transitive edges, then arrange levels. | HIGH |
| 34 | Ch. 4 | Minimum/maximum and least/greatest are often confused. | NEEDS-EXAMPLE | Teach the difference with a poset having two minimal elements. | HIGH |
| 35 | Ch. 4 | Minimal/maximal versus minimum/maximum are not distinguished. | UNEXPLAINED-WORD | Put all four definitions on one diagram. | HIGH |
| 36 | Ch. 4 | Upper bounds, lower bounds, LUB and GLB are not listed. | MISSING-GATE-CONCEPT | Mark all bounds on a small Hasse diagram before naming join and meet. | HIGH |
| 37 | Ch. 4 | The word “lattice” is introduced without stating the pairwise join/meet test. | UNEXPLAINED-WORD | Explain that every pair needs a least upper bound and greatest lower bound. | HIGH |
| 38 | Ch. 4 | Linear extensions / total orders consistent with a poset are not named. | MISSING-GATE-CONCEPT | Add topological-order counting with a step-by-step ordering tree. | HIGH |
| 39 | Ch. 4 | Boolean lattices and the subset order are not identified. | MISSING-GATE-CONCEPT | Connect subsets, bit strings and pointwise order. | MEDIUM |
| 40 | Ch. 4 | It is unclear whether distributive, complemented or complete lattices are in scope. | FACT-DOUBT | State the level required; teach basic distributive/complemented examples only if supported by PYQs or syllabus interpretation. | LOW |
| 41 | Ch. 5 Monoids and groups | No lesson introduces a binary operation as a rule taking two elements and returning one. | MISSING-PREREQUISITE | Start with addition, multiplication, maximum and string concatenation. | HIGH |
| 42 | Ch. 5 | Closure is not in the contents. | MISSING-GATE-CONCEPT | Check whether the result stays inside the set. | HIGH |
| 43 | Ch. 5 | Associativity and commutativity are not separately listed. | UNEXPLAINED-WORD | Use number examples and a deliberately non-associative operation. | HIGH |
| 44 | Ch. 5 | Identity element and inverse are not listed as separate tests. | MISSING-GATE-CONCEPT | Teach the equations \(e*a=a\) and \(a*a^{-1}=e\). | HIGH |
| 45 | Ch. 5 | Semigroup and monoid are missing from the listed chapter name. | MISSING-GATE-CONCEPT | Add semigroup → monoid → group as a ladder of conditions. | HIGH |
| 46 | Ch. 5 | Abelian/non-Abelian is not listed. | UNEXPLAINED-WORD | Explain it as whether order of operation inputs can be swapped. | HIGH |
| 47 | Ch. 5 | The contents do not mention that an inverse may not exist inside the set. | NEEDS-EXAMPLE | Compare integers under addition with non-negative integers under addition. | HIGH |
| 48 | Ch. 5 | Subgroups and Lagrange’s theorem are not named. | MISSING-GATE-CONCEPT | Add subgroup examples, order divisibility and limits of the theorem. | HIGH |
| 49 | Ch. 5 | Cyclic groups, element order and \(\mathbb Z_n\) are not listed. | MISSING-GATE-CONCEPT | Use modular addition tables and repeated addition. | HIGH |
| 50 | Ch. 5 | Direct products and self-inverse elements are not identified. | MISSING-FINER-POINT | Add coordinate-wise operations and solve \(x=x^{-1}\) one coordinate at a time. | MEDIUM |
| 51 | Ch. 6 Graph theory | No prerequisite defines vertices, edges, simple graph, directed graph or weighted graph. | MISSING-PREREQUISITE | Begin with drawings and a matching edge list. | HIGH |
| 52 | Ch. 6 | Degree, in-degree, out-degree and the handshaking lemma are not listed. | MISSING-GATE-CONCEPT | Teach degree counting and the sum-of-degrees formula. | HIGH |
| 53 | Ch. 6 | Walk, trail, path, circuit and cycle are not distinguished. | UNEXPLAINED-WORD | Give tiny examples where one condition fails. | HIGH |
| 54 | Ch. 6 | Connected components, cut vertices and bridges are not named. | MISSING-GATE-CONCEPT | Add removal-of-vertex/edge diagrams. | MEDIUM |
| 55 | Ch. 6 | Trees, leaves, spanning trees and tree edge-count properties are not listed. | MISSING-GATE-CONCEPT | Teach \(n-1\) edges, unique paths and spanning-tree construction. | HIGH |
| 56 | Ch. 6 | BFS/DFS tree, levels, diameter and graph powers are not named. | MISSING-GATE-CONCEPT | Add queue-based BFS traces and shortest-distance layers. | HIGH |
| 57 | Ch. 6 | Adjacency matrices and powers of adjacency matrices are not listed. | MISSING-GATE-CONCEPT | Explain that \(A^k\) counts length-\(k\) walks; include trace of \(A^3\). | HIGH |
| 58 | Ch. 6 | Bipartite graphs and the odd-cycle test are not explicitly listed. | MISSING-GATE-CONCEPT | Teach 2-colouring by BFS and why odd cycles fail. | HIGH |
| 59 | Ch. 6 | Matching, maximum/perfect matching, vertex cover and independent set are not broken into lessons. | MISSING-GATE-CONCEPT | Define each, draw examples and show complement relationships. | HIGH |
| 60 | Ch. 6 | Vertex colouring, chromatic number, edge colouring and upper bounds are not separated. | MISSING-GATE-CONCEPT | Add greedy colouring, \(\Delta+1\), edge-colouring examples and Petersen graph. | HIGH |
| 61 | Ch. 7 Counting and combinatorics | Sum rule and product rule are not named. | MISSING-PREREQUISITE | Start with disjoint choices and sequential choices. | HIGH |
| 62 | Ch. 7 | Permutations and combinations are not separated. | MISSING-GATE-CONCEPT | Explain whether order matters before choosing a formula. | HIGH |
| 63 | Ch. 7 | Repetition, identical objects and arrangements with restrictions are not named. | MISSING-GATE-CONCEPT | Include repeated symbols, identical balls and distinct bins. | HIGH |
| 64 | Ch. 7 | Stars and bars / distributing identical objects are not listed. | MISSING-GATE-CONCEPT | Cover empty bins versus non-empty bins with diagrams. | MEDIUM |
| 65 | Ch. 7 | Inclusion-exclusion is not named. | MISSING-GATE-CONCEPT | Work through multiples of 3, 5 and 7 using a Venn diagram. | HIGH |
| 66 | Ch. 7 | Pigeonhole principle is not named. | MISSING-GATE-CONCEPT | Show the “more objects than boxes” argument and its stronger form. | MEDIUM |
| 67 | Ch. 7 | Derangements are not listed. | MISSING-GATE-CONCEPT | Explain fixed positions and use inclusion-exclusion for a small case. | MEDIUM |
| 68 | Ch. 7 | Counting functions, onto maps and subset pairs are not listed. | MISSING-FINER-POINT | Add small-domain arrow diagrams and independent choices per element. | MEDIUM |
| 69 | Ch. 7 | Counting matchings in paths / parity-constrained binary matrices is missing from the plan. | NEEDS-TRACE | Show a recurrence or free-cell construction rather than a memorised result. | MEDIUM |
| 70 | Ch. 7 | The bank includes strings with forbidden/required adjacent patterns. | NEEDS-EXAMPLE | Teach complement counting and a short state-based count. | MEDIUM |
| 71 | Ch. 8 Recurrences and generating functions | A recurrence is not introduced in ordinary language. | MISSING-PREREQUISITE | Define a sequence, an index and initial values using the Fibonacci pattern. | HIGH |
| 72 | Ch. 8 | No lesson distinguishes recurrence from closed form. | UNEXPLAINED-WORD | Compute early terms, then compare recursive and direct descriptions. | HIGH |
| 73 | Ch. 8 | Characteristic equations and roots are not listed. | MISSING-GATE-CONCEPT | Teach second-order linear homogeneous recurrences step by step. | HIGH |
| 74 | Ch. 8 | Repeated roots, non-homogeneous terms and initial-condition constants are not listed. | MISSING-FINER-POINT | Include the standard root cases and substitute initial conditions visibly. | MEDIUM |
| 75 | Ch. 8 | Ordinary generating functions are not explained from the sequence itself. | MISSING-PREREQUISITE | Build \(A(x)=a_0+a_1x+\cdots\) from a short sequence. | HIGH |
| 76 | Ch. 8 | No table links common sequences to their generating functions. | NEEDS-EXAMPLE | Include constant, \(n\), \(n+1\), geometric and parity-based sequences. | HIGH |
| 77 | Ch. 8 | Coefficient extraction and shifting are not listed. | STEP-SKIPPED | Show how multiplying by \(x\), differentiating and combining series shifts coefficients. | HIGH |
| 78 | Ch. 8 | The relation between a recurrence and its generating function is not listed. | MISSING-GATE-CONCEPT | Derive one recurrence’s generating function without skipping initial terms. | MEDIUM |
| 79 | Ch. 8 | Binary-index recurrences (such as \(f(2n)\), \(f(2n+1)\)) are in the bank but not identified. | MISSING-GATE-CONCEPT | Teach repeated halving and a trace table of indices. | MEDIUM |
| 80 | All chapters | “4 topics ready” or “6 topics ready” does not say what a topic contains or what the learner can do after it. | UNCLEAR-ENGLISH | For every lesson, publish outcomes, prerequisites, worked examples, diagrams, hand traces and a short test. | HIGH |

---

## PART 3. WHAT A COMPLETE GATE DISCRETE MATHEMATICS SUBJECT MUST HAVE

### First: syllabus check

The five top-level lines in the uploaded file match the **official GATE 2027 CS syllabus**. The official wording is:

- Propositional and first order logic.
- Sets, relations, functions, partial orders and lattices.
- Monoids, Groups.
- Graphs: connectivity, matching, colouring.
- Combinatorics: counting, recurrence relations, generating functions.

I found no missing top-level Discrete Mathematics syllabus line in Part B. The problem is that the contents list does not yet show the finer skills that a beginner needs under those lines. The official syllabus does not prescribe a detailed subtopic list or chapter weightage, so the finer items below are a coverage recommendation based on the supplied PYQs and standard discrete-mathematics scope, not a claim that IIT Madras explicitly lists every subtopic.

| Syllabus line / chapter | Finer coverage that must be visible in the final book | How often in this supplied bank | Typical GATE question | What I need before it |
|---|---|---:|---|---|
| Propositional logic | Propositions; connectives; truth tables; precedence; implication and biconditional; necessary/sufficient; tautology, contradiction, contingency; logical equivalence; De Morgan; contrapositive; CNF/DNF; inference rules; satisfiability; induction as a proof technique used by the bank. | Propositional and first-order logic together: 14 questions, 19 marks. A separate propositional-only count is not supplied. | MCQ/MSQ truth tables, tautology checks, translation, equivalence and inference. | True/false statements, brackets, basic arithmetic with 0/1. |
| First-order logic | Predicates; domains; variables and scope; free/bound variables; \(\forall,\exists\); quantifier order; negation; “there exists exactly one”; implication under quantifiers; validity/countermodels; divisibility predicates; basic relational models. | Included in the same combined 14-question/19-mark bank category; separate frequency is not supplied. | Translate English, decide implication/validity, find a counterexample or small model. | Propositional connectives and reading a set/domain. |
| Sets, relations and functions | Membership/subset; set operations; Cartesian product; power set; cardinality; ordered pairs; relation as subset of a product; reflexive/symmetric/antisymmetric/transitive; equivalence classes/partitions; relation composition and inverse; injective/surjective/bijective; composition; countable sets and finite-set cardinality arguments. | 11 questions, 15 marks under the bank’s combined category. | MCQ/MSQ properties, NAT cardinality/probability, function composition and countability. | Integers, pairs, simple diagrams and exponents. |
| Partial orders and lattices | Posets; comparability; Hasse diagrams; minimal/maximal versus least/greatest; upper/lower bounds; join/meet; lattice test; Boolean lattice; linear extensions/total orders consistent with a poset. | Combined with sets/relations/functions: 11 questions, 15 marks. No separate split is available. | Count linear extensions, decide whether a relation is a poset/lattice, calculate number of pairs to add. | Relations and set inclusion. |
| Monoids and groups | Binary operation; closure; associativity; identity; inverse; semigroup/monoid/group; Abelian group; cancellation; subgroups; finite group order; Lagrange; cyclic groups; order of an element; \(\mathbb Z_n\); direct products; self-inverse elements; symmetric difference as a group operation. | 10 questions, 15 marks. | MCQ/MSQ property checks, NAT group-order or modular arithmetic. | Basic set notation, multiplication/addition, divisibility and modular arithmetic. |
| Graph theory | Graph vocabulary; directed/undirected/simple/weighted graphs; degree; handshaking lemma; walks/paths/cycles; connected components; cut vertices/bridges; trees and spanning trees; BFS/DFS; shortest paths/distances/diameter; graph powers; adjacency matrices and \(A^k\); bipartite graphs; matching; vertex cover; independent set; vertex colouring/chromatic number; edge colouring; Hamiltonian cycles/paths; planar graphs and Euler’s formula. | Basic graph category: 17 questions/27 marks; advanced graph bounds: 7 questions/13 marks. Combined: 24 questions/40 marks. | Graph-property MCQ/MSQ; NAT edge counts, tree counts, colouring, matching, BFS orders and matrix traces. | Counting, simple set language and reading an edge drawing. |
| Combinatorics | Sum/product rules; permutations/combinations; repetitions; identical objects; stars and bars; binomial coefficients; inclusion-exclusion; pigeonhole; derangements; counting functions/subsets; constrained strings; matchings in paths; parity-constrained matrices. | 10 questions, 15 marks. | NAT counting; MCQ/MSQ on arrangements, subset counts and inclusion-exclusion. | Multiplication tables, factorials, basic powers and set notation. |
| Recurrences and generating functions | Sequence notation; recurrence and initial values; iteration; linear homogeneous recurrence with constant coefficients; characteristic polynomial; distinct/repeated roots; non-homogeneous recurrence at the needed level; ordinary generating functions; standard series; shifts; coefficient extraction; recurrence-to-generating-function derivation; binary-index recurrences. | 6 questions, 9 marks. | MCQ closed form / growth form; NAT coefficients; MSQ properties of a recurrence. | Algebra, powers, finite sums and sequence notation. |

### What appears most under-covered

The chapter titles cover the syllabus headings, but the following named items must be added to the *visible plan* because the supplied bank directly tests them or they are basic prerequisites for those questions:

1. Logic: truth tables, translation of “only if”, quantifier order, negation, exactly-one statements, validity and induction.
2. Sets/relations/functions: power sets, cardinality, equivalence classes, function composition, countability and relation-property counterexamples.
3. Posets/lattices: Hasse diagrams, minimal versus least, join/meet and counting linear extensions.
4. Algebra: closure/associativity/identity/inverses, subgroup order, Lagrange’s theorem, cyclic groups and product groups.
5. Graphs: tree properties, BFS layers, adjacency matrices, matchings, vertex covers, independent sets, graph colouring, edge colouring, planar Euler formula and Hamiltonian cycles.
6. Counting: inclusion-exclusion, derangements, identical objects, constrained strings and subset/function counting.
7. Recurrences: characteristic roots, initial values, standard generating functions, coefficient extraction and binary-index recurrences.

Frequency wording: the counts above are **only the counts in the uploaded 75-question bank**, not a promise of future marks. Do not write “this will come every year” from this sample.

---

## PART 4. THE DIAGRAMS I NEED

| Chapter | Diagram / visual | What I should notice | Best format |
|---|---|---|---|
| 1. Propositional logic | Truth-table columns for \(p,q\), then a compound formula. | Each row is one possible truth assignment; the final column decides tautology/contradiction. | Step-by-step table. |
| 1 | Implication arrow with the one false case highlighted. | \(p\to q\) is false only when \(p\) is true and \(q\) is false. | Single picture plus truth table. |
| 1 | Equivalent formulas side by side. | Same final truth column means logical equivalence. | Table. |
| 1 | Induction dominoes / staircase. | Base case starts the proof; induction step carries it to the next integer. | Step-by-step series. |
| 2. First-order logic | People-and-knowledge arrow diagram. | Direction of \(M(x,y)\), who is the witness, and who is universally quantified. | Single picture plus quantifier-scope annotation. |
| 2 | Nested quantifier scope brackets. | The order of \(\forall\) and \(\exists\) changes who may depend on whom. | Step-by-step formula construction. |
| 2 | “Exactly one” witness with all other candidates crossed out. | Existence and uniqueness are two separate requirements. | Single picture. |
| 2 | Tiny domain with all predicate pairs marked. | A formula is false if one counterexample row fails. | Truth table / relation table. |
| 3. Sets/relations/functions | Venn diagrams for union, intersection, difference, complement and symmetric difference. | Shaded region matches the set expression. | Single picture per operation. |
| 3 | Cartesian product grid. | Rows and columns form ordered pairs; swapping coordinates changes the pair. | Single picture. |
| 3 | Power set of a 3-element set. | Every subset appears exactly once; total is \(2^n\). | Tree/list. |
| 3 | Relation arrows between two or three elements. | Reflexive loops, symmetry reverse arrows, transitivity missing shortcut arrows. | Step-by-step graph. |
| 3 | Function arrow diagrams. | Injective: no two arrows land at one target; onto: every target is hit. | Side-by-side single pictures. |
| 3 | Equivalence classes as separated groups. | Every element belongs to exactly one class. | Single picture. |
| 4. Posets/lattices | Relation digraph reduced to a Hasse diagram. | Remove loops and implied transitive edges; lower elements go below higher elements. | Step-by-step series. |
| 4 | Poset with two minimal elements but no least element. | “Minimal” does not mean “less than every element”. | Single picture. |
| 4 | Upper/lower bounds with join and meet highlighted. | Join is the least upper bound; meet is the greatest lower bound. | Step-by-step Hasse diagram. |
| 4 | Boolean lattice for subsets of \(\{a,b,c\}\). | Levels correspond to subset size; inclusion gives the order. | Single picture. |
| 4 | Branching tree of valid total orders. | At each step choose an element whose prerequisites are already placed. | Trace tree/table. |
| 5. Monoids/groups | Operation table for a small set. | Closure, identity, inverses and commutativity can be checked from entries. | Table. |
| 5 | Associativity comparison with three inputs. | Change brackets, not the order of inputs. | Two expression panels. |
| 5 | Group ladder: semigroup → monoid → group → Abelian group. | Each next structure adds one condition. | Single diagram. |
| 5 | Modular addition clock for \(\mathbb Z_4\) or \(\mathbb Z_6\). | Repeated addition wraps around; identity and inverse are visible. | Single picture plus operation table. |
| 5 | Product-group coordinates. | Operation is performed independently in each coordinate. | Table / coordinate grid. |
| 6. Graphs | Same graph as drawing, edge list and adjacency matrix. | These are three ways to represent the same object. | Side-by-side panels. |
| 6 | Degree labels and handshaking count. | Every undirected edge contributes 2 to the sum of degrees. | Single picture. |
| 6 | Examples of walk, trail, path, cycle and circuit. | Which vertices/edges may repeat in each definition. | Single picture set. |
| 6 | Connected components before and after deleting a bridge/cut vertex. | One edge or vertex can split the graph. | Before/after series. |
| 6 | Tree and spanning tree of the same graph. | A tree on \(n\) vertices has \(n-1\) edges; a spanning tree touches every vertex. | Step-by-step construction. |
| 6 | BFS queue and level table. | Vertices are discovered in nondecreasing distance from the start. | Trace table. |
| 6 | \(A^2\), \(A^3\) and triangle count. | Entry \((i,j)\) counts walks of the corresponding length; \(\operatorname{trace}(A^3)/6\) counts triangles in a simple undirected graph. | Matrix calculation table. |
| 6 | Bipartite 2-colouring and an odd cycle. | Even cycles can be coloured with two colours; an odd cycle cannot. | Single picture pair. |
| 6 | Matching, maximum matching, perfect matching, vertex cover and independent set on one graph. | Matched edges do not share endpoints; every edge must touch a vertex cover; independent vertices have no edge between them. | Multiple highlighted copies. |
| 6 | Greedy vertex colouring in vertex order. | Used colours at already-coloured neighbours restrict the next choice. | Step-by-step series. |
| 6 | Petersen graph with a Hamiltonian path and an independent set. | A graph may have a Hamiltonian path but no Hamiltonian cycle; independent-set size is not the same as chromatic number. | Annotated single picture. |
| 6 | Planar graph with faces and Euler relation. | Count vertices, edges and faces; for a connected planar embedding \(V-E+F=2\). | Single picture. |
| 7. Counting | Sum-rule and product-rule branching tree. | Count mutually exclusive cases by addition and consecutive choices by multiplication. | Tree. |
| 7 | Permutation versus combination of the same objects. | Changing order creates a new permutation but not a new combination. | Side-by-side list. |
| 7 | Identical balls in identical bins. | Reordering equal objects or bins does not create a new arrangement. | Partition diagrams. |
| 7 | Inclusion-exclusion Venn diagram for three sets. | Add single sets, subtract pair overlaps, add triple overlap. | Single picture. |
| 7 | Derangement positions with forbidden fixed points. | A character must not remain in its original position. | Table / branching. |
| 7 | Subset pair \(A\subseteq B\). | Every element has three possible states: outside \(B\), in \(B\setminus A\), or in both. | Three-state table. |
| 7 | Ternary strings with equal neighbours. | Count all strings minus strings where each next symbol differs. | State/trace table. |
| 8. Recurrences/GF | First few terms from initial conditions. | The recurrence uses earlier terms; do not confuse the index \(n\) with a value. | Trace table. |
| 8 | Characteristic equation and root cases. | Distinct roots give two powers; repeated roots introduce an \(n\) multiplier. | Worked algebra series. |
| 8 | Recurrence tree for a binary-index recurrence. | Each step halves an index until the base case. | Tree plus trace table. |
| 8 | Generating-function coefficient table. | Coefficient of \(x^n\) is \(a_n\). | Table. |
| 8 | Shift by multiplying a series by \(x\). | Multiplication by \(x\) moves coefficients one place to the right. | Step-by-step series. |
| 8 | Derivative of \(1/(1-x)\). | It produces the series \(1+2x+3x^2+\cdots\) after the right algebra. | Algebra steps and coefficient table. |
| 8 | Build a rational generating function from even/odd subsequences. | Separate parity patterns first, then combine them. | Two series + combined table. |

---

## PART 5. THE FULL PLAN, CHAPTER BY CHAPTER

**Reading-time rule:** each lesson below is designed for roughly 45–90 minutes including worked examples. A [MUST] lesson is directly needed for the syllabus or several supplied PYQs. [SHOULD] develops a useful finer point. [LATER] is lower priority or more abstract; it should not block a beginner from completing the core.

### Chapter 1 — Propositional logic

| Lesson | Priority | Prerequisites | Beginner must-see | Finer points / GATE level | Diagrams | Hand trace | Common mistakes |
|---|---|---|---|---|---|---|---|
| P1. Statements, connectives and truth tables | [MUST] Foundation for every logic question. | True/false statements and basic arithmetic. | Proposition vs non-proposition; NOT, AND, OR, implication, biconditional. | Precedence, parentheses, translating English. | Truth-table layout. | Fill all four rows for two variables. | Treating \(p\to q\) as symmetric; forgetting the false case. |
| P2. Implication, equivalence and rewriting | [MUST] Many MCQ/MSQ traps. | P1. | \(p\to q\equiv\neg p\lor q\); converse/inverse/contrapositive. | De Morgan, double negation, distributive laws, CNF/DNF basics. | Equivalent expressions side by side. | Prove an equivalence by truth table and by algebraic rewriting. | Confusing converse with contrapositive. |
| P3. Tautology, contradiction, satisfiability and inference | [MUST] Directly appears in the bank. | P1–P2. | Tautology vs contradiction vs contingent formula. | Counterexample assignment, modus ponens/tollens and valid inference. | Truth-table final-column examples. | Test one compound formula row by row. | Calling “true in one row” a tautology. |
| P4. Proof patterns and mathematical induction | [SHOULD] Needed for induction-style GATE statements such as the supplied 2025 question. | Basic algebra, P1. | Base case and induction step. | Strong induction as a short extension; distinguish proving a statement for all \(n\) from checking a few values. | Domino/staircase. | Verify a simple sum identity by induction. | Proving only the base case; assuming the conclusion in the induction step. |

### Chapter 2 — First-order logic

| Lesson | Priority | Prerequisites | Beginner must-see | Finer points / GATE level | Diagrams | Hand trace | Common mistakes |
|---|---|---|---|---|---|---|---|
| F1. Predicates, variables and domains | [MUST] Necessary for every quantifier question. | P1–P3; sets. | \(P(x)\), domain, variable, free/bound occurrence. | Predicate with two variables \(R(x,y)\); relation to arrow diagrams. | Tiny domain with truth marks. | Evaluate \(P(x)\) for every member of a finite domain. | Treating \(P(x)\) as a proposition before assigning \(x\). |
| F2. Quantifiers and translating English | [MUST] Several bank questions test exact wording. | F1. | \(\forall\) means every; \(\exists\) means at least one. | Order of quantifiers; witness dependency; “everyone knows someone” vs “someone knows everyone”. | Quantifier-scope brackets and people arrows. | Translate English to symbols and back. | Swapping \(\forall\exists\) and \(\exists\forall\). |
| F3. Negation, uniqueness, validity and models | [MUST] Needed for exactly-one, implication and domain traps. | F1–F2 and propositional logic. | Negate a quantified statement; exactly one = exists and no different second witness. | Logical validity, countermodels, divisibility predicates, small models without functions. | One-witness / all-other-candidates-crossed-out picture. | Build a counterexample domain with 2–3 elements. | Forgetting the domain; putting \(\neg\) in the wrong scope. |

### Chapter 3 — Sets, relations and functions

| Lesson | Priority | Prerequisites | Beginner must-see | Finer points / GATE level | Diagrams | Hand trace | Common mistakes |
|---|---|---|---|---|---|---|---|
| S1. Set language and set operations | [MUST] Foundation. | Number sets and basic notation. | Element, subset, empty set, union, intersection, difference, complement, symmetric difference. | Set identities and ordered pairs. | Venn diagrams. | Compute operations on 2- and 3-element sets. | Confusing \(x\in A\) with \(A\subseteq B\). |
| S2. Cartesian products and relations | [MUST] Needed to understand relation definitions. | S1. | \(A\times B\), ordered pairs, relation as a subset. | Reflexive, irreflexive, symmetric, antisymmetric, transitive. | Arrow diagrams and relation tables. | Test each property on a 3-element set. | Thinking symmetric means antisymmetric. |
| S3. Equivalence relations and classes | [MUST] Direct GATE concept. | S2. | Reflexive + symmetric + transitive. | Equivalence classes, partitions, relation induced by a function. | Group elements into classes. | List classes for congruence modulo 2 or 3. | Checking only one property; overlapping classes. |
| S4. Functions and composition | [MUST] Directly appears in the bank. | S1–S2. | Domain, codomain, image, injective, surjective, bijective. | Composition, inverse when bijective; what onto composition implies and does not imply about its factors. | Arrow diagrams. | Build a small function table and test all three properties. | Assuming onto \(f\circ g\) forces \(g\) onto when \(f\) is onto. |
| S5. Cardinality and countability | [SHOULD] Several bank questions use counting of sets/functions. | S1, S4; powers and combinations. | Finite-set size, one-to-one correspondence, countable vs uncountable. | Counting functions, finite subsets of \(\mathbb N\), cardinality equations. | Pairing/listing examples. | Count functions from a 2-element domain to a 3-element codomain. | Treating “infinite” as one size; confusing \(A\times A\) with \(A\cup B\). |

### Chapter 4 — Partial orders and lattices

| Lesson | Priority | Prerequisites | Beginner must-see | Finer points / GATE level | Diagrams | Hand trace | Common mistakes |
|---|---|---|---|---|---|---|---|
| O1. Partial orders and Hasse diagrams | [MUST] Foundation for the chapter. | S2. | Reflexive, antisymmetric, transitive; comparable/incomparable. | Divisibility and subset examples. | Relation digraph reduced to Hasse diagram. | Remove loops and transitive edges from a relation list. | Drawing every relation arrow in a Hasse diagram. |
| O2. Minimal/maximal elements and linear extensions | [MUST] Direct bank coverage. | O1. | Minimal vs minimum; maximal vs maximum. | Counting total orders consistent with a partial order. | Hasse diagram plus order-tree. | Count all topological orders of a 4-element poset. | Treating “minimal” as “least”; choosing an element before its prerequisite. |
| O3. Bounds, join, meet and lattices | [MUST] Direct bank coverage. | O1–O2. | Upper/lower bounds; least upper bound; greatest lower bound. | Pairwise join/meet test; Boolean lattice; basic lattice identities if needed. | Mark all bounds on Hasse diagram. | Test every incomparable pair for join and meet. | Picking any upper bound instead of the least one. |

### Chapter 5 — Monoids and groups

| Lesson | Priority | Prerequisites | Beginner must-see | Finer points / GATE level | Diagrams | Hand trace | Common mistakes |
|---|---|---|---|---|---|---|---|
| A1. Binary operations, semigroups and monoids | [MUST] Needed before group definitions. | Sets and arithmetic. | Binary operation, closure, associativity, identity. | Commutativity; operation tables; pointwise operations on functions. | Operation tables and structure ladder. | Test an operation on 2–3 inputs. | Checking commutativity instead of associativity; assuming identity exists. |
| A2. Groups and Abelian groups | [MUST] Direct bank coverage. | A1. | Identity and inverse; group axioms; Abelian means commutative. | Inverse uniqueness, cancellation, every element self-inverse implies Abelian. | Modular clock and operation table. | Check a small group table. | Assuming every monoid is a group; searching for inverses outside the set. |
| A3. Subgroups, finite groups and Lagrange | [MUST] Several supplied PYQs. | A2; divisibility. | Subgroup, order of group, order of subgroup. | Lagrange’s theorem, cyclic groups, possible subgroup sizes, \(\mathbb Z_n\). | Subgroup sets inside a group. | List subgroups of \(\mathbb Z_6\). | Treating divisibility as a guarantee that every divisor occurs in every group. |
| A4. Product groups and modular calculations | [SHOULD] Directly needed by a supplied PYQ. | A2–A3. | Coordinate-wise operation; inverse in each coordinate. | Self-inverse elements in direct products; powers modulo \(n\). | Coordinate table. | Solve \(2x=0\) in each \(\mathbb Z_n\). | Counting product elements without checking each coordinate. |

### Chapter 6 — Graph theory: connectivity, matching and colouring

| Lesson | Priority | Prerequisites | Beginner must-see | Finer points / GATE level | Diagrams | Hand trace | Common mistakes |
|---|---|---|---|---|---|---|---|
| G1. Graph basics, degrees and components | [MUST] Foundation for every graph question. | Set notation and counting. | Vertex, edge, simple, directed, undirected, degree. | Handshaking lemma; degree bounds; adjacency list/matrix. | Graph + degree labels + matrix. | Count degrees and edges independently. | Counting an undirected edge once in degree sum. |
| G2. Walks, paths, BFS, distances and graph powers | [MUST] Direct bank coverage. | G1. | Walk/path/cycle; connectedness; distance. | BFS tree height, eccentricity, radius, diameter, graph square. | BFS queue and distance levels. | Trace queue contents and all possible BFS orders. | Thinking BFS tree height is always the graph diameter. |
| G3. Trees and spanning trees | [MUST] Several bank questions. | G1–G2. | Tree, leaf, spanning tree, unique path. | \(n-1\) edges; degree sum; Cayley’s formula; directed out-arborescence; edge exchange in cycles. | Tree construction and spanning-tree overlays. | Count parent choices in a directed rooted tree. | Confusing number of edges in a tree with number of spanning trees. |
| G4. Adjacency matrices and matrix powers | [MUST] Direct bank coverage. | G1; basic matrix multiplication. | Adjacency matrix. | Diagonal of \(A^2\), trace of \(A^3\), walks of length \(k\), connectivity caveats. | Matrix and graph side by side. | Multiply a small adjacency matrix by itself. | Calling walks paths; forgetting each triangle contributes six closed walks. |
| G5. Bipartite graphs and vertex colouring | [MUST] Direct bank coverage. | G1–G2. | 2-colouring; chromatic number. | Odd-cycle test; greedy colouring; \(\Delta+1\) bound; independent-set and edge lower bounds. | Two-colouring and greedy colour sequence. | Colour a graph in a fixed vertex order. | Thinking every 2-colourable graph has an odd cycle. |
| G6. Matching, vertex cover and independent set | [MUST] Explicit syllabus line and bank coverage. | G1. | Matching; maximum/perfect matching; vertex cover; independent set. | Complement relation between vertex cover and independent set; degree forcing in minimum covers; Hall/König theorem at a suitable depth. | Same graph with separate overlays. | Find a maximum matching and a minimum vertex cover on small bipartite graphs. | Letting matching edges share endpoints; missing an uncovered edge. |
| G7. Planar graphs and Euler’s formula | [SHOULD] Supplied PYQ tests it although it is not a named syllabus word. | G1 and basic geometry. | Planar drawing, face, connected planar graph. | \(V-E+F=2\); simple bounds only if relevant. | Planar embedding with faces numbered. | Solve for the missing one of \(V,E,F\). | Counting the outside face as zero. |
| G8. Hamiltonian/edge colouring and named examples | [SHOULD] Several finer graph PYQs. | G1, G5. | Hamiltonian path/cycle; edge colouring. | Complete-graph Hamiltonian cycle count; Vizing bound; Petersen graph properties. | Annotated Hamiltonian path, Petersen graph. | Count cycle representations and colour edges. | Counting rotations/reversals as different cycles; confusing vertex and edge colouring. |

### Chapter 7 — Counting and combinatorics

| Lesson | Priority | Prerequisites | Beginner must-see | Finer points / GATE level | Diagrams | Hand trace | Common mistakes |
|---|---|---|---|---|---|---|---|
| C1. Sum rule and product rule | [MUST] Foundation. | Basic arithmetic and set language. | Mutually exclusive cases vs consecutive choices. | Counting functions and assignments with restrictions. | Branching tree. | Count a short code/password. | Adding where choices should be multiplied. |
| C2. Permutations, combinations and derangements | [MUST] Direct bank coverage. | C1 and factorials. | Order matters vs order does not. | Repeated objects, identical symbols, fixed positions, derangements. | Position slots and forbidden-position table. | Count LILAC-type arrangements for a small word. | Treating identical objects as distinct; counting a rotation twice. |
| C3. Combinations, partitions and distributions | [MUST] Direct bank coverage. | C1–C2. | Choosing subsets; identical balls/bins. | Binomial coefficients, stars and bars, positive versus non-negative solutions, set partitions. | Partition drawings and stars/bars. | List partitions of a small integer. | Forgetting empty bins or double-counting reorderings. |
| C4. Inclusion-exclusion and structured counting | [MUST] Multiple supplied PYQs. | C1–C3. | Count all minus forbidden cases. | Three-set inclusion-exclusion, pigeonhole, constrained strings, subset pairs, parity matrices and matchings-in-path recurrences. | Venn diagram / state table. | Count numbers divisible by 3 or 5; count strings with no equal neighbours. | Forgetting to add back triple intersections; counting only one forbidden pattern. |

### Chapter 8 — Recurrence relations and generating functions

| Lesson | Priority | Prerequisites | Beginner must-see | Finer points / GATE level | Diagrams | Hand trace | Common mistakes |
|---|---|---|---|---|---|---|---|
| R1. Sequences and recurrences from zero | [MUST] Foundation. | Algebra and index notation. | Initial values and a rule for later terms. | Iteration, identifying linear recurrences, checking candidate formulas. | Term table. | Calculate first six terms. | Starting at \(n=0\) when recurrence starts at \(n=2\). |
| R2. Linear recurrences and characteristic roots | [MUST] Supplied recurrence questions. | R1; quadratic equations. | Guess \(r^n\), form characteristic equation. | Distinct roots, repeated roots, constants from initial conditions, growth class. | Root-case flowchart. | Solve a second-order recurrence and check \(a_0,a_1\). | Forgetting the repeated-root \(n\) factor. |
| R3. Ordinary generating functions | [MUST] Supplied generating-function questions. | R1; geometric series and algebra. | \(A(x)=\sum a_nx^n\). | Standard series; shifts; coefficient extraction; splitting even/odd terms. | Coefficient table and shifted series. | Expand a rational function to four terms. | Off-by-one errors after multiplying by \(x\). |
| R4. More difficult recurrences and binary-index rules | [SHOULD] Directly in the supplied bank, but after R1–R3. | R1–R2 and powers of two. | Recurrences with \(2n\) and \(2n+1\). | Repeated halving, induction on index length, simple non-homogeneous cases. | Recursion tree and index table. | Trace \(f(2^k)\), \(f(2^k\pm1)\), and \(f(5\cdot2^k)\). | Treating \(5\cdot2^k\) as decimal notation or skipping base cases. |

---

## PART 6. EVERY PYQ IN THE UPLOADED BANK — 75-question audit

**Key-verdict labels:**  
- **Correct:** the marked answer agrees with the supplied wording.  
- **Correct after transcription fix:** the bank wording differs from the official question text.  
- **Cannot fully verify:** a required figure is missing.  
- **Ambiguous wording:** more than one interpretation is possible.  

The “lesson” code refers to Part 5.

| PYQ | Lesson | Exact concept tested and trap | Official key check / transcription note |
|---|---|---|---|
| 2026_AN_Q11 | F2 | Translate “there is one person who knows nobody else but is known by everyone else”; keep the witness \(y\) fixed while \(x\) varies. | **Correct: A.** \(M(x,y)\) says \(x\) knows \(y\); the formula also excludes the self-case. |
| 2026_FN_Q12 | C4 | Count \(4\times4\) binary matrices with even parity in every row and column. | **Correct: 512.** The upper-left \(3\times3\) entries can be chosen freely; the last entry in each of the first three rows/columns is forced, and the final corner is consistent. \(2^9=512\). |
| 2026_AN_Q26 | S2 | Test reflexive, symmetric, transitive and antisymmetric for \(xy\) being a perfect square. | **Correct: A, B, C.** Reflexivity uses \(x^2\); symmetry is immediate; transitivity follows from prime-exponent parity. Antisymmetry fails, e.g. \(1R4\) and \(4R1\) with \(1\ne4\). |
| 2026_AN_Q36 | G3 | Minimise Jaccard overlap between edge sets of two spanning trees of \(K_n\). | **Correct: C (0).** For \(n\ge5\), \(K_n\) has enough edges to contain two edge-disjoint spanning trees; intersection is empty. |
| 2026_FN_Q47 | G6 | A minimum vertex cover has size \(k\); degree \(k+1\) forces a vertex into every such cover. | **Correct: A.** If \(v\notin S\), all its \(k+1\) neighbours must be in \(S\), impossible for \(|S|=k\). |
| 2026_FN_Q55 | G5 | 2-colourability, even/odd cycles and linear-time bipartite testing. | **Correct: B, C.** Odd cycles cannot be 2-coloured; even cycles can. BFS/DFS checks a graph in \(\Theta(|V|+|E|)\) with adjacency lists. |
| 2026_FN_Q57 | G6 | Count all matchings in path \(P_8\). | **Correct: 34.** \(\sum_{k=0}^{4}\binom{8-k}{k}=1+7+15+10+1=34\). |
| 2025_AN_Q15 | P4 | Mathematical induction on natural numbers, including the base case \(P(0)\). | **Correct: A.** Base \(P(0)\) plus \(P(x)\Rightarrow P(x+1)\) establishes all non-negative integers. A base at 1000 cannot prove values below 1000. |
| 2025_FN_Q17 | S4 | If \(f\) and \(f\circ g\) are onto, what must be true of \(g\)? | **Correct: D.** \(g(A)\) only needs to contain a set of preimages sufficient for \(f\) to cover \(C\); it need not be injective or onto \(B\). |
| 2025_FN_Q30 | C4 | Count ternary strings of length 5 with at least one equal adjacent pair. | **Correct: 195.** Total \(3^5=243\); no equal adjacent symbols gives \(3\cdot2^4=48\); subtract: \(243-48=195\). |
| 2025_AN_Q42 | O3 | Pointwise order on Boolean-valued functions; identify a partial order and lattice. | **Correct: B, C.** This is the Boolean lattice \(\{0,1\}^n\) with coordinatewise order; meet is coordinatewise AND and join is OR. |
| 2025_FN_Q43 | G2 | Minimum possible BFS-tree height given graph diameter 30. | **Correct: C.** From any source, eccentricity is at least the radius, which is at least \(\lceil30/2\rceil=15\); it need not equal 30. |
| 2025_FN_Q48 | F3 | Encode “everyone has exactly one mother”. | **Correct: B, D.** Both express existence of a mother and absence of a different mother. C can be vacuously true when nobody has a mother, so it does not enforce existence. |
| 2025_FN_Q49 | A1 | Pointwise addition on all functions \(\mathbb N_0\to\mathbb N_0\). | **Correct: B.** It is closed, associative, commutative and has the zero function as identity; non-zero functions generally have no additive inverse in \(\mathbb N_0\). |
| 2024_AN_Q26 | P2 | Translate “fail grade cannot be given when score is above 50%”. | **Correct: A.** \(q\to\neg p\) is equivalent to \(p\to\neg q\). |
| 2024_AN_Q20 | R2 | Solve \(T(n)=5T(n-1)-6T(n-2)\) with initial values. | **Correct: A.** Characteristic roots are 2 and 3; initial values give \(T(n)=2^n\), hence \(\Theta(2^n)\). |
| 2024_AN_Q15 | G4 | A simple undirected graph adjacency matrix satisfies \(A=A^{-1}\), so \(A^2=I\). | **Correct: B.** Diagonal entries of \(A^2\) are degrees; all degrees must be 1, so the graph is a perfect matching. |
| 2024_FN_Q28 | S5 | Cardinalities from bijections \(A\leftrightarrow B\) and \(A\times A\leftrightarrow A\cup B\). | **Correct: 2.** If \(|A|=|B|=n\), then \(n^2=|A\cup B|\) and \(n\le |A\cup B|\le2n\), so \(n=1\) or \(2\). |
| 2024_FN_Q31 | G3 | Number of spanning trees in \(K_4\). | **Correct: 16.** Cayley’s formula gives \(4^{4-2}=16\). |
| 2024_AN_Q18 | O2 | Count linear extensions of the given four-element partial order. | **Correct: 5.** First place 3 or 1; if 3 is first there are 3 continuations, and if 1 is first then 3 must be next and there are 2 continuations. |
| 2024_FN_Q59 | G5 | General bounds for graph chromatic number \(k\). | **Correct: B, C.** One colour class has at least \(n/k\) vertices; a \(k\)-chromatic graph needs at least \(\binom{k}{2}\) edges. It need not contain a \(K_k\), nor have degree at least \(k\). |
| 2024_AN_Q37 | G3 | Parity of edge weights when every spanning tree has even total weight. | **Correct: D.** Exchanging two edges on a cycle between spanning trees shows their weights have the same parity; thus every cycle is all-even or all-odd. |
| 2024_FN_Q65 | A1 | Associativity and distributivity of \(a\lozenge b=a+2b\), \(a\square b=ab\). | **Correct: B, D.** Multiplication is associative and distributes over \(\lozenge\); \(\lozenge\) is not associative. |
| 2024_AN_Q63 | G5 | Find the chromatic number of a pictured graph. | **Cannot fully verify: answer 2 cannot be checked because `[IMAGE_Q_63_1]` is absent.** Restore the original figure before using this as a key-validated lesson example. |
| 2024_AN_Q41 | A4 | Count self-inverse elements in \(\mathbb Z_2\times\mathbb Z_3\times\mathbb Z_4\). | **Correct: 4.** Solve \(2x=0\) in each coordinate: 2 choices in \(\mathbb Z_2\), 1 in \(\mathbb Z_3\), 2 in \(\mathbb Z_4\); total \(2\cdot1\cdot2=4\). |
| 2023_FN_Q15 | R2 | Closed form for Lucas sequence with \(L_1=1,L_2=3\). | **Correct: A.** \(\phi^n+\psi^n\) gives 1 and 3 at the first two indices and satisfies the recurrence. |
| 2023_FN_Q26 | F2 | Decide which statements imply \(\forall x(P(x)\Rightarrow\exists yQ(x,y))\). | **Correct: B, C.** B supplies \(Q\) for all pairs; C supplies one common witness \(y\) for every \(x\) satisfying \(P\). |
| 2023_FN_Q48 | C2 | Count permutations where all \(A\)-elements occur before all \(B\)-elements, or vice versa. | **Correct: D.** Choose the \(2k\) positions, arrange the other elements, arrange A and B internally, and multiply by 2 for the two block orders. |
| 2023_FN_Q49 | S3/S4 | Quotient a set by equality of function values and define \(F([x])=f(x)\). | **Correct: B, C, D.** It is well-defined, onto because \(f\) is onto, and one-to-one because equal outputs define the same class. |
| 2023_FN_Q51 | A2 | Symmetric difference on a power set. | **Correct: A, D.** Symmetric difference is an Abelian group operation with \(\varnothing\) as identity; every set is its own inverse. |
| 2023_FN_Q55 | G5 | Greedy vertex-colouring algorithm. | **Correct: A, B.** It is proper and uses at most \(\Delta(G)+1\) colours, but is not always optimal. |
| 2023_FN_Q56 | G2 | Count BFS vertex orderings in the strict-inclusion graph of \(2^{\{1,2,3\}}\), starting at \(\varnothing\). | **Correct: 5040.** The empty set is adjacent to all other 7 subsets, so any ordering of those 7 vertices is a valid BFS order: \(7!\). |
| 2022_FN_Q27 | A2 | Group conditions that force commutativity. | **Correct: A, B, C.** Each condition forces \(xy=yx\); a subgroup of an Abelian group is also Abelian, so D is false. |
| 2022_FN_Q30 | G1 | Maximum edges in a disconnected simple graph on 10 vertices. | **Correct: 36.** Make one component \(K_9\) and leave one vertex isolated. |
| 2022_FN_Q32 | C3 | Six identical balls in three identical bins. | **Correct: 7.** These are the integer partitions of 6 into at most three parts: \(6,5+1,4+2,4+1+1,3+3,3+2+1,2+2+2\). |
| 2022_FN_Q36 | R3 | Ordinary generating function for \(a_n=n+1\) when \(n\) is odd and 1 otherwise. | **Correct: A.** Separate even and odd indices; the series is \(1/(1-x^2)+2x/(1-x^2)^2\), equal to option A. |
| 2022_FN_Q37 | G4 | Count triangles using adjacency matrix powers. | **Correct: D.** Each triangle contributes six closed walks of length 3, so use \(\operatorname{trace}(A^3)/6\). |
| 2022_FN_Q50 | G5/G8 | Petersen graph chromatic number, Hamiltonian path, isomorphism and independence number. | **Partly verifiable.** A (chromatic number 3) and B (Hamiltonian path) are correct for the Petersen graph; D is false because its maximum independent-set size is 4, not 3. **C cannot be checked because the comparison image `[IMAGE_Q_50_C]` is missing.** The accepted key’s C marker therefore remains unverified. Also spell the standard name **Petersen graph**, not “Peterson graph”. |
| 2022_FN_Q51 | R4 | Recurrence on even and odd indices. | **Correct: A, B, C.** Direct induction/halving verifies these; D fails, for example \(f(5)=3\ne5\). The notation `5.2^n` should be written `5·2^n` to avoid looking like a decimal. |
| 2022_FN_Q52 | G4 | Properties of powers of an adjacency matrix. | **Correct: A only.** The diagonal of \(A^2\) gives degrees. B confuses walks of exactly \(n-1\) with paths of at most \(n-1\); C can be a disconnected triangle plus isolates; D can be several disjoint cycles. |
| 2022_FN_Q58 | G3 | Count directed spanning trees rooted at 5 in the lower-triangular adjacency graph. | **Correct: 24.** Parent choices for vertices 4, 3, 2, 1 are 1, 2, 3, 4 respectively, giving \(1\cdot2\cdot3\cdot4=24\). |
| 2021_FN_Q27 | P2 | Truth of two propositional implications. | **Correct after transcription fix.** The uploaded text says \(S_1:(\neg p\land(p\lor q))\to p\), but the official GATE 2021 paper prints the consequent as **\(q\)**. With \(q\), \(S_1\) is a tautology and \(S_2\) is not, so B is correct. **As pasted with \(p\), both are not tautologies**, so the pasted version would give D. Restore \(q\). |
| 2021_AN_Q27 | S5 | Compare number of \(n\times n\) ternary matrices with functions from an \(n^2\)-element set to a 3-element set. | **Correct: B, C.** Both sets have \(3^{n^2}\) elements, so a bijection and a surjection exist. |
| 2021_AN_Q60 | P2 | Check a nested implication and equivalence of antecedent/consequent. | **Correct: B, D.** The antecedent and consequent simplify to the same expression; the outer implication is a tautology. |
| 2021_FN_Q24 | G7 | Euler’s formula for a connected planar graph. | **Correct: 11.** \(V-E+F=2\), so \(E=8+5-2=11\). |
| 2021_FN_Q21 | C1 | Assign six ordered jobs to three ordered computers with extreme jobs fixed and every computer nonempty. | **Correct: 65.** The toughest/easiest jobs are fixed; the four remaining jobs each choose among 3 computers, but the middle computer must receive at least one: \(3^4-2^4=65\). |
| 2021_FN_Q52 | A3 | Group of order 6 and nontrivial proper subgroup. | **Correct: B.** A proper nontrivial subgroup has order 2 or 3 and is cyclic; the group of order 6 need not be cyclic (e.g. \(S_3\)). |
| 2021_FN_Q35 | G2 | Diameter of graph obtained by adding edges between vertices at distance 1 or 2. | **Correct: A.** Each step in the original graph can be compressed into at most two-edge segments in the square graph, giving diameter at most \(\lceil d/2\rceil\). |
| 2021_FN_Q29 | S2 | “Circular” relation plus other relation properties. | **Correct: C.** Reflexive + circular implies symmetry (use \(bRb\)) and transitivity (combine circularity and symmetry). |
| 2021_AN_Q37 | C3 | Count pairs of subsets with \(A\subseteq B\). | **Correct: 59049.** Each element has 3 choices: outside B, in B only, or in both; \(3^{10}=59049\). |
| 2020_FN_Q11 | S2 | Probability that a random relation on a 3-element set is reflexive. | **Correct: 0.125.** There are \(2^9\) relations and \(2^6\) with all three diagonal pairs included; probability \(2^6/2^9=1/8\). |
| 2020_FN_Q32 | A3 | Largest possible proper subgroup of a group of order 35. | **Correct: 7.** Proper subgroup orders divide 35; the largest proper divisor is 7, and a cyclic group of order 35 attains it. |
| 2020_FN_Q46 | F3 | Distribution of a predicate-free formula \(W\) across quantifiers. | **Correct: C is the non-valid equivalence.** \( \forall x(p(x)\to W)\) is not generally equivalent to \((\forall x p(x))\to W\); a mixed true/false predicate gives a counterexample when \(W\) is false. |
| 2020_FN_Q52 | C2 | Multiset derangement count for LILAC with identical Ls. | **Correct: 12** under the natural position interpretation: neither L may occupy either original L-position, and I/A/C may not occupy their own original positions. The statement should make that interpretation explicit because identical Ls have no individual identity. |
| 2020_FN_Q53 | G8 | Edge-chromatic number of \(K_{3,4}\) plus a universal vertex. | **Correct: 7.** The universal vertex has degree 7, so at least 7 colours are needed; 7 suffice. |
| 2019_FN_Q26 | C3 | Count pairs \((x,X)\) with \(x\in X\subseteq U\). | **Correct: C (both).** For each of \(n\) elements, half the subsets contain it; equivalently \(\sum k\binom nk=n2^{n-1}\). |
| 2019_FN_Q35 | A2 | Conjugacy relation and inverse relation on an arbitrary group. | **Correct: B.** Conjugacy is an equivalence relation; \(a=b^{-1}\) is not reflexive for a general group. |
| 2019_FN_Q12 | G8 | Count Hamiltonian cycles in an undirected complete graph. | **Correct key accepts C and D.** D is the standard count of labelled cycles, \((n-1)!/2\). C can be defended if “different” means only up to isomorphism (all are the same cycle shape); the official final key accepted both. The source’s two checkmarks are therefore not necessarily a typo, but the question is ambiguous. |
| 2019_FN_Q21 | A3 | Compute \(3^{51}\bmod5\). | **Correct: 2.** Powers of 3 modulo 5 repeat \(3,4,2,1\); \(51\equiv3\pmod4\). |
| 2019_FN_Q54 | F3 | Interpret a first-order formula about numbers with only trivial divisors. | **Correct under the usual positive-divisor convention: C (S2 and S3).** S1 fails at 97 because there is no larger prime at most 100; positive integers and all integers have arbitrarily large primes above any prime. **Text caveat:** the question should explicitly say whether \(z\) is restricted to positive divisors; if negative divisors are allowed, the “only 1 and itself” predicate changes meaning. |
| 2018_FN_Q11 | R3 | Generating function for \(a_n=2n+3\). | **Correct: D.** \(3/(1-x)+2x/(1-x)^2=(3-x)/(1-x)^2\). |
| 2018_FN_Q28 | G5 | Find chromatic number of a pictured graph. | **Cannot verify: the graph image `[IMAGE_Q_28]` is missing.** Restore the figure to validate the numeric key 3. |
| 2018_FN_Q29 | A3 | Largest possible proper subgroup of a group of order 84. | **Correct if “largest possible” means maximum over groups of order 84: 42**, attained by a cyclic group with an index-2 subgroup. **Wording caveat:** this is not guaranteed for every group of order 84; say “maximum possible over all groups of order 84” explicitly. |
| 2018_FN_Q37 | S5 | Countability of rationals, finite-domain function set, binary sequences and finite subsets. | **Correct: D.** Rationals, functions from a finite 2-element domain to \(\mathbb N\), and finite subsets of \(\mathbb N\) are countable; all infinite binary sequences are uncountable. |
| 2018_FN_Q38 | F3 | Small-model argument for an existential-universal sentence with no function symbols. | **Correct: A.** Keep the at most three existential witnesses; the induced relational substructure on them still satisfies the universal part. |
| 2018_FN_Q53 | G2 | Degree and connectedness of the graph of all permutations under adjacent swaps. | **Correct: 109.** Each permutation has 99 adjacent-swap neighbours; the graph is connected because adjacent transpositions generate all permutations, so \(z=1\) and \(y+10z=99+10=109\). |
| 2017_FN_Q29 | P2 | Contrapositive and equivalent form of \(\neg p\to\neg q\). | **Correct: D (II and III).** Both \(q\to p\) and \(\neg q\lor p\) are equivalent to the original statement. |
| 2017_FN_Q15 | F2 | Consequences of \(\forall x\exists yR(x,y)\) over a non-empty domain. | **Correct: B (I and IV).** A witness exists for at least one pair; IV is just another form of the premise. |
| 2017_AN_Q31 | P2 | Translate “not pleasant only if raining and cold”. | **Correct: A.** “A only if B” means \(A\to B\); join this with \(\neg p\land r\). |
| 2017_FN_Q19 | G1 | Sum of degrees in a 10-vertex tree. | **Correct: 18.** A tree has 9 edges, and the degree sum is \(2E=18\). |
| 2017_AN_Q28 | O3 | Decide how many ordered pairs to add to make the given poset a lattice. | **Correct: 0.** The relation itself is enough to determine the order; each pair has a meet and join. The absent Hasse picture is redundant because the full relation is provided. |
| 2017_AN_Q16 | G1 | Bound vertex count from 25 edges and minimum degree 3. | **Correct: 16.** \(3n\le2E=50\), hence \(n\le16\) for integer \(n\); a graph attaining 16 is possible. |
| 2017_FN_Q55 | P3 | Consequence of an implication being false for the given proposition values. | **Correct: D under the intended fixed-truth-value reading.** If \(q\) is true, \((r\to p)\to q\) is automatically true. **Wording caveat:** calling a formula “a contradiction” usually means false under every valuation; the stem appears to mean the given propositions make it false. Make that distinction explicit. |
| 2017_FN_Q41 | C4 | Count integers 1–500 divisible by 3 or 5 or 7. | **Correct: 271.** Inclusion-exclusion: \(166+100+71-33-23-14+4=271\). |
| 2017_AN_Q48 | R3 | Extract \(a_3-a_0\) from \((1+z)/(1-z)^3\). | **Correct: 15.** \(a_0=1\); \(a_3=\binom52+\binom42=16\); difference is 15. |

### PYQ bank integrity summary

- The upload contains **75** question entries, and the bank-topic counts sum to 75.
- The topic mark totals sum to **113 marks**, matching Part B. \(113/1500\approx7.53\%\), so “about 7.5%” is correct.
- Easy/Medium/Hard counts also sum correctly within every bank category.
- The 2021 propositional question is a **confirmed transcription error**: replace the final \(p\) in \(S_1\) with \(q\). The official paper shows \(S_1:(\neg p\land(p\lor q))\to q\). With the text as pasted, the marked answer B is false.
- Three question entries genuinely need missing images before their full keys can be certified: 2024_AN_Q63, 2022_FN_Q50 (especially option C), and 2018_FN_Q28. The 2017_AN_Q28 Hasse picture is missing too, but its full relation is supplied, so the answer can still be checked.
- 2019_FN_Q12 accepts both C and D under the final key because “different cycles” is ambiguous between labelled cycles and cycle shapes up to isomorphism.
- The 2018_FN_Q29 wording should say “maximum possible over all groups of order 84”; order 84 alone does not guarantee every group has a subgroup of order 42.
- 2019_FN_Q54 should state whether divisors are positive; otherwise the integer-domain wording is not fully precise.
- 2020_FN_Q52 should explain what “identical Ls” means for original-position restrictions.
- 2022_FN_Q51 should print \(5\cdot2^n\), not `5.2^n`.

---

## PART 7. THREE MORE QUESTION IDEAS FOR EVERY LESSON

These are new practice ideas, not claims about actual GATE questions. The tags show the likely format.

| Lesson | Three additional GATE-style question ideas |
|---|---|
| P1 | **MCQ:** Evaluate a 3-variable formula using a truth table. **MSQ:** Select statements that are propositions. **NAT:** Number of truth assignments making a given conjunction true. |
| P2 | **MCQ:** Find the contrapositive of a nested implication. **MSQ:** Select all formulas equivalent to \((p\to q)\land(r\to p)\). **NAT:** Count rows where two formulas differ. |
| P3 | **MCQ:** Identify a tautology from a formula with three variables. **MSQ:** Select valid inference steps. **NAT:** Number of satisfying assignments of a simple formula. |
| P4 | **MCQ:** Identify a valid induction hypothesis. **MSQ:** Select sums that can be proved by induction with the supplied base case. **NAT:** Find the smallest base index needed for a recurrence-defined identity. |
| F1 | **MCQ:** Identify which expressions are predicates over a stated domain. **MSQ:** Select formulas with no free variables. **NAT:** Count true predicate instances on a finite domain. |
| F2 | **MCQ:** Translate “every student solved at least one problem”. **MSQ:** Select formulas equivalent to “there is one person everyone knows”. **NAT:** Count witnesses in a supplied finite relation table. |
| F3 | **MCQ:** Negate a statement containing two quantifiers. **MSQ:** Select all correct exactly-one formulations. **NAT:** Find the smallest domain size satisfying a given formula. |
| S1 | **MCQ:** Simplify a set expression using identities. **MSQ:** Select correct subset relations from a Venn diagram. **NAT:** Find the size of a symmetric difference. |
| S2 | **MCQ:** Find whether a relation is antisymmetric. **MSQ:** Select all relations with stated properties from an ordered-pair list. **NAT:** Count reflexive relations on a 4-element set. |
| S3 | **MCQ:** Find the equivalence class of an element under congruence modulo \(m\). **MSQ:** Select partitions induced by a relation. **NAT:** Count equivalence classes on a finite set. |
| S4 | **MCQ:** Decide whether a composition is injective or onto. **MSQ:** Select all valid implications between properties of \(f\), \(g\) and \(f\circ g\). **NAT:** Count onto maps from a 3-element set to a 2-element set. |
| S5 | **MCQ:** Identify which of four sets are countable. **MSQ:** Compare cardinalities of two finite function sets. **NAT:** Find the size of a power set of a Cartesian product. |
| O1 | **MCQ:** Identify whether a relation diagram is a partial order. **MSQ:** Select all valid Hasse diagrams for a relation. **NAT:** Count comparable pairs in a given poset. |
| O2 | **MCQ:** Distinguish minimal elements from the least element. **MSQ:** Select valid total orders extending a poset. **NAT:** Count linear extensions of a five-element poset with two independent chains. |
| O3 | **MCQ:** Decide whether a poset is a lattice. **MSQ:** Identify all pairs whose join or meet does not exist. **NAT:** Count missing joins in a small Hasse diagram. |
| A1 | **MCQ:** Test closure and associativity for a defined operation. **MSQ:** Select all monoid properties of an operation table. **NAT:** Find the identity element, if it exists. |
| A2 | **MCQ:** Find the inverse of an element from a group table. **MSQ:** Select conditions that force a group to be Abelian. **NAT:** Count self-inverse elements in a small group. |
| A3 | **MCQ:** Determine possible subgroup orders using Lagrange’s theorem. **MSQ:** Select true statements about cyclic groups. **NAT:** Find the order of an element in \(\mathbb Z_{18}\). |
| A4 | **MCQ:** Find the identity of a product group. **MSQ:** Select coordinates that are self-inverse. **NAT:** Count self-inverse elements in \(\mathbb Z_6\times\mathbb Z_8\). |
| G1 | **MCQ:** Identify a graph from its degree sequence. **MSQ:** Select statements forced by the handshaking lemma. **NAT:** Find the maximum vertex count for a given edge count and minimum degree. |
| G2 | **MCQ:** Find BFS tree height from a chosen source. **MSQ:** Select valid BFS orders from a graph. **NAT:** Count possible BFS orders when the root is adjacent to all remaining vertices. |
| G3 | **MCQ:** Identify which edge set is a spanning tree. **MSQ:** Select correct statements about tree edge counts and cycles. **NAT:** Count spanning trees of \(K_5\). |
| G4 | **MCQ:** Interpret one entry of \(A^2\). **MSQ:** Select true statements about adjacency-matrix powers. **NAT:** Count triangles from a small adjacency matrix. |
| G5 | **MCQ:** Decide whether a graph is bipartite. **MSQ:** Select all valid upper/lower bounds on chromatic number. **NAT:** Find the chromatic number of a cycle \(C_n\). |
| G6 | **MCQ:** Find a maximum matching in a small bipartite graph. **MSQ:** Identify minimum vertex covers and maximum independent sets. **NAT:** Count matchings of a path on 10 vertices. |
| G7 | **MCQ:** Identify the number of faces in a planar embedding. **MSQ:** Select graphs that can be planar under given constraints. **NAT:** Find edges using Euler’s formula for a connected planar graph. |
| G8 | **MCQ:** Count Hamiltonian cycles in a complete graph under a stated convention. **MSQ:** Select true Petersen-graph properties. **NAT:** Find the minimum edge-colouring count for a graph with a specified maximum degree and construction. |
| C1 | **MCQ:** Choose sum rule or product rule for a two-stage choice. **MSQ:** Select valid counting decompositions. **NAT:** Count assignments with one required nonempty category. |
| C2 | **MCQ:** Count arrangements with repeated letters. **MSQ:** Select correct derangement descriptions. **NAT:** Find the number of derangements of 4 distinct objects. |
| C3 | **MCQ:** Choose the correct stars-and-bars formula. **MSQ:** Select partitions satisfying bounds on bin occupancy. **NAT:** Count non-negative integer solutions of \(x_1+x_2+x_3=9\). |
| C4 | **MCQ:** Apply inclusion-exclusion to four divisibility conditions. **MSQ:** Select valid pigeonhole conclusions. **NAT:** Count binary strings of length \(n\) with no consecutive 1s for a small fixed \(n\). |
| R1 | **MCQ:** Find the next term from a recurrence and initial conditions. **MSQ:** Identify which sequence satisfies a recurrence. **NAT:** Compute a specified term by iteration. |
| R2 | **MCQ:** Solve a recurrence with repeated characteristic roots. **MSQ:** Select correct closed forms from initial conditions. **NAT:** Find a coefficient in a recurrence-defined sequence. |
| R3 | **MCQ:** Identify the generating function of \(a_n=n^2\). **MSQ:** Select valid coefficient-shift identities. **NAT:** Find \(a_4-a_1\) from a rational generating function. |
| R4 | **MCQ:** Evaluate a binary-index recurrence using repeated halving. **MSQ:** Select identities true for \(f(2^k)\) and \(f(2^k\pm1)\). **NAT:** Compute a large-index value from a parity recurrence. |

---

## PART 8. WHAT IS MISSING FROM THE SUBJECT MAP

The eight chapter headings are sensible and the top-level syllabus is present. The items below must nevertheless be made explicit before this is a complete beginner-first subject plan.

### Must add visibly

- **Logic:** truth tables; equivalence and implication rules; quantifier negation; exactly-one translation; inference/counterexample method; induction.
- **Sets and relations:** Cartesian products; power sets; relation properties and counterexamples; equivalence classes; function composition; countability.
- **Partial orders:** Hasse-diagram construction; minimal/maximal versus least/greatest; bounds, join and meet; linear extensions.
- **Algebra:** binary operation and closure; associativity; identity/inverse; subgroup and Lagrange; cyclic groups and element orders; product groups.
- **Graphs:** degree/handshaking; walks/paths/cycles; tree and spanning-tree properties; BFS/DFS and graph distances; adjacency-matrix powers; bipartite tests; matching/vertex cover/independent set; greedy colouring; Hamiltonian concepts; edge colouring; planar Euler formula.
- **Counting:** sum/product rules; permutations/combinations; identical objects; stars and bars; inclusion-exclusion; pigeonhole; derangements; constrained strings and subset/function counting.
- **Recurrences:** characteristic-root cases; initial values; standard generating functions; shifts and coefficient extraction; binary-index recurrences.

### Add only after the essentials

- More advanced lattice properties (distributive, complemented, complete lattices) if they can be explained without overwhelming the learner.
- Deeper matching theory (Hall’s theorem and König’s theorem) with clear statements and small examples.
- More advanced graph bounds and proofs. Do not begin with theorem-heavy statements before the student can identify a matching, vertex cover or independent set.
- General recurrence-solving techniques beyond the linear cases actually supported by the supplied bank.

### Do not silently over-expand

Planar graphs, Hamiltonian cycles, edge colouring, countability and induction appear in the supplied questions, but the official GATE 2027 syllabus lists broad headings rather than all of these finer items. Include them at a useful GATE level because the bank tests them; label any extra theoretical depth as [LATER] rather than presenting every theorem as equally essential.

---

## PART 9. CHAPTER WEIGHTS

### Weights from the supplied bank

| Chapter | Weight | What the uploaded bank supports | Is the current apparent weight fair? |
|---|---|---|---|
| 1. Propositional logic | **Medium** | Combined “Propositional and First-Order Quantifier Logic” category has 14 questions/19 marks. Separate split is not available. | The chapter deserves a solid foundation, but the bank cannot justify a separate numerical weight for propositional logic alone. |
| 2. First-order logic | **Medium** | Same combined 14 questions/19 marks; several questions clearly need quantifier translation and scope. | Fair to keep it substantial. Do not divide the 14 questions arbitrarily between Chapters 1 and 2. |
| 3. Sets, relations and functions | **High** | Combined sets/relations/functions/partial-orders/lattices category has 11 questions/15 marks. | Fair as a high-priority chapter because it also supports logic, lattices and algebra. |
| 4. Partial orders and lattices | **High** | It shares the same 11 questions/15 marks with Chapter 3; the bank does not split them. | Fair as a core chapter, but its exact independent weight is **not sure**. |
| 5. Monoids and groups | **High** | 10 questions/15 marks, appearing in 8 of the 10 year labels in the bank. | Fair. It has a compact set of reusable definitions and properties. |
| 6. Graph theory | **High** | 17 basic graph questions/27 marks plus 7 advanced graph-bound questions/13 marks = 24 questions/40 marks. | Definitely the heaviest area in this particular bank. Keep matching and colouring visible, not buried as one subtopic. |
| 7. Counting and combinatorics | **High** | 10 questions/15 marks, appearing in 8 of 10 year labels. | Fair. It also supports graph counting, strings, subsets and group questions. |
| 8. Recurrences and generating functions | **Medium** | 6 questions/9 marks, appearing in 5 of 10 year labels. | Fair as a medium-weight chapter. It is narrower but can be difficult; do not leave it to the final day. |

### How I would order the study

1. P1–P3 and F1–F3: logic and quantifier language.
2. S1–S4: sets, relations and functions.
3. O1–O3: partial orders and lattices.
4. C1–C3: counting foundations.
5. A1–A4: algebraic structures.
6. G1–G8: graph theory, with the foundation lessons before matching and bounds.
7. C4: structured counting and inclusion-exclusion.
8. R1–R4: recurrences and generating functions.

This is a learning order, not a claim about the exact order in the exam. Counting can be interleaved earlier; the important point is that graphs should not start before basic set language and counting are comfortable.

---

## FINAL VERDICT

**Do not publish this contents v0 as a paid subject book yet.** It is a reasonable chapter skeleton and its headline topics match the GATE 2027 Discrete Mathematics syllabus. But it is not yet a learner-facing plan: it does not show the prerequisites, lesson sequence, finer concepts, worked examples, diagrams, practice steps or chapter weight decisions.

The PYQ bank is valuable, but it needs a clean-up pass before it becomes the source of truth:
1. Correct the 2021 propositional formula from `→ p` to the official `→ q`.
2. Restore the missing graph figures for 2024_AN_Q63, 2022_FN_Q50 and 2018_FN_Q28.
3. Clarify the wording of 2018_FN_Q29, 2019_FN_Q54, 2020_FN_Q52 and 2017_FN_Q55.
4. Keep both accepted answers for 2019_FN_Q12, with a note about the interpretation.
5. Replace `5.2^n` with `5·2^n` in 2022_FN_Q51.

**The right promise for ₹149 is not “75 PYQs included”.** It is: “I can start with almost no memory, understand each symbol and definition, see the idea in a picture, solve a small example with every step shown, and then solve the GATE pattern myself.” The contents need to prove that promise lesson by lesson.

---

## Sources checked

1. **Official GATE 2027 CS syllabus, IIT Madras** — Discrete Mathematics appears under Section 1: Engineering Mathematics. The five top-level lines in the uploaded file match the official text.  
   https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf

2. **Official GATE 2021 CS Set-1 question paper and answer key** — Q.7 prints \(S_1:(\neg p\land(p\lor q))\to q\), and the official answer key lists option B, confirming the altered final \(p\) in the uploaded bank is a transcription error.  
   Question paper: https://gate2026.iitg.ac.in/doc/download/2021/cs_2021.pdf  
   Answer key: https://gate2026.iitg.ac.in/doc/download/Answer_keys2021/cs_merged_2021.pdf

3. **GATE 2019 Hamiltonian-cycle question and final-key discussion** — the standard labelled count is \((n-1)!/2\), while the final key accepted option 1 as well under the unlabelled-shape interpretation.  
   https://static.gatecsmastery.com/pyq/gate-cs-2019/q-22/
