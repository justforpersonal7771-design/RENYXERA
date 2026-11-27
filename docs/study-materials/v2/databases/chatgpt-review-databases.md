# GATE CS — Databases
## In-depth beginner review, 72-PYQ audit, syllabus check and complete rewrite plan

**Review date:** 24 November 2026  
**Input reviewed:** Databases v0 text supplied in this conversation (Parts A, B and C).  
**Target:** GATE CS 2027.  
**Decision:** The five syllabus bullets are correct. The eight chapter titles are a sensible skeleton, but the lesson plan must be expanded and the question bank needs figure restoration and a few transcription/assumption notes before release.

---

## 0. What was actually reviewed

The input contains the student-review instructions, five syllabus bullets written from memory, eight chapter titles with counts of ready-made topics, summary statistics for 72 questions, and the 72 question statements with the marked official answers/ranges.

It does **not** include the actual lesson text in the app, the complete 30 Forge questions, the master writing prompt, or all original source-paper images. Therefore:

- I can review the scope, order, beginner prerequisites, the supplied question text, calculations that are fully visible, and the marked keys.
- I cannot claim that the unseen lessons already teach (or fail to teach) a particular explanation.
- I cannot fully re-solve image-dependent questions when the required table, ER diagram, B+ tree or transaction schedule figure is absent.
- A question marked “key supported” below has been re-solved from the supplied text or checked against an exact, visible derivation. It does not mean that every historical master paper has been independently re-keyed.

The official GATE 2027 CS syllabus uses the same Databases wording as the five bullets in the supplied input:

> **Databases:** ER-model. Relational model: relational algebra, tuple calculus, SQL. Integrity constraints, normal forms. File organization, indexing (e.g. B and B+ trees). Transactions and concurrency control.

So the submitted high-level syllabus is **correct and complete at headline level**. The difficulty is that those five lines hide many small skills that a weak student must learn. The official GATE 2027 syllabus page says that the syllabi have been revised and directs candidates to the updated documents. See the [official GATE 2027 syllabus page](https://gate2027.iitm.ac.in/exam_papers_and_syllabus) and the [official CS syllabus PDF, Section 9: Databases](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf). [IIT Madras press release, 20 July 2026](https://www.iitm.ac.in/happenings/press-releases-and-coverages/iit-madras-announces-dates-syllabus-revision-new-paper-introduction).

---

# PART 1 — FEELINGS (10 lines)

1. The eight chapter names make the subject look organised, and I can see that the main GATE areas are at least present.
2. But “ER model” does not tell me what an entity is, how a relationship works, or why a weak entity needs a double diamond.
3. “Relational algebra and tuple calculus” sounds frightening because I do not yet know what a relation, tuple, projection or quantifier is.
4. SQL looks more familiar, but joins, correlated subqueries, `EXISTS`, `ALL`, `ANY`, grouping and `NULL` can change an answer in ways I would not notice.
5. Functional dependencies and normal forms feel like the biggest danger: I need candidate keys, attribute closure and every decomposition step shown slowly.
6. B+ trees feel possible only if each node split, separator copy-up and root change are drawn one at a time.
7. Transactions and concurrency are confusing because “serial”, “serializable”, “recoverable”, “strict” and “conflict” sound almost like the same word.
8. The question bank gives me some hope because many questions use small tables and rules, but sixteen questions rely on figures that are not included here.
9. I cannot tell what “2 topics ready” or “4 topics ready” means; a count is not a lesson plan or proof of understanding.
10. **Would I pay ₹149 now? No.** I see a contents list and answer ticks, not a patient book with diagrams, complete worked solutions and enough beginner practice.

---

# PART 2 — GAP TABLE (100 findings)

The input explicitly says that v0 is a contents list, not a full plan. “Not shown” below means that the contents page gives no evidence that the skill is taught; it does not prove that an unseen lesson omits it.

| # | Where | What I could not understand or what is missing | Type | What to add or change | Priority |
|---:|---|---|---|---|---|
| 1 | Whole book, before Chapter 1 | I do not know what problem a DBMS solves or why a database is different from a spreadsheet or file. | MISSING-PREREQUISITE | Add a zero-level introduction using a small college database and show duplicate, update and search problems. | HIGH |
| 2 | Whole book | “Relation”, “tuple”, “attribute”, “domain” and “schema” are not listed as first-use words. | UNEXPLAINED-WORD | Define each word with one tiny table before using relational algebra or SQL. | HIGH |
| 3 | Whole book | The plan does not say whether a table is treated as a set or a bag of rows. | MISSING-FINER-POINT | Explain relational set semantics versus SQL bag/multiset behaviour and why duplicates matter. | HIGH |
| 4 | Whole book | I do not know what NULL means or how it differs from zero, empty text or a missing row. | MISSING-PREREQUISITE | Add NULL, unknown information and three-valued logic before advanced SQL. | HIGH |
| 5 | Whole book | No prerequisite link to set theory, logic, functions or basic counting is shown. | MISSING-PREREQUISITE | Add a short bridge: sets, subsets, Cartesian product, implication, quantifiers and counting. | HIGH |
| 6 | Whole book | SQL examples need a database instance, but the plan does not say how tables are read row by row. | NEEDS-EXAMPLE | Start every SQL topic with a visible sample database and show intermediate result tables. | HIGH |
| 7 | Whole book | The lesson counts (3, 2, 3, 4...) do not tell me the lesson titles or outcomes. | UNCLEAR-ENGLISH | Publish all lesson titles, 45–90 minute targets, and “after this lesson you can…” outcomes. | HIGH |
| 8 | Whole book | There is no stated path from an everyday idea to notation to a GATE question. | WRONG-ORDER | Use: story → glossary → picture → tiny example → hand trace → exact rule → GATE example → practice. | HIGH |
| 9 | Whole book | No consistent distinction is made between a definition, an assumption and a theorem. | MISSING-FINER-POINT | Label these three separately and state the assumptions before each proof or calculation. | MEDIUM |
| 10 | Whole book | I cannot tell how I should check an answer when the official key gives a range. | MISSING-FINER-POINT | Explain accepted NAT ranges, units, rounding and alternative set/bag interpretations. | MEDIUM |
| 11 | Chapter 1: ER model | “Entity” and “entity set” are not separated. | UNEXPLAINED-WORD | Use one student/person example to distinguish one entity from a collection of entities. | HIGH |
| 12 | Chapter 1: ER model | Attribute types are not listed. | MISSING-GATE-CONCEPT | Teach simple/composite, single/multivalued and stored/derived attributes with symbols. | HIGH |
| 13 | Chapter 1: ER model | Key attributes and candidate identifiers are not explicitly named. | MISSING-GATE-CONCEPT | Explain key attributes, composite keys and how a key identifies one entity. | HIGH |
| 14 | Chapter 1: ER model | Relationship degree (unary, binary, ternary) is not listed. | MISSING-FINER-POINT | Draw relationships with two and three entity sets and explain what each connection means. | MEDIUM |
| 15 | Chapter 1: ER model | Cardinality ratio (1:1, 1:N, N:1, M:N) is easy to misread. | NEEDS-DIAGRAM | Show both directions on each relationship and label “at most” separately from “at least”. | HIGH |
| 16 | Chapter 1: ER model | Total and partial participation are not mentioned. | MISSING-GATE-CONCEPT | Teach double-line versus single-line participation and include counterexamples. | HIGH |
| 17 | Chapter 1: ER model | Weak entity and owner entity are not broken down. | MISSING-GATE-CONCEPT | Explain partial key, identifying relationship, owner key and total participation of the weak entity. | HIGH |
| 18 | Chapter 1: ER model | The identifying relationship symbol is not shown. | NEEDS-DIAGRAM | Draw double rectangle for weak entity and double diamond for identifying relationship. | HIGH |
| 19 | Chapter 1: ER model | Mapping an ER model to relations is not listed. | MISSING-GATE-CONCEPT | Add rules for strong entity, weak entity, 1:1, 1:N and M:N relationship mapping. | HIGH |
| 20 | Chapter 1: ER model | When a relationship table can be merged into an entity table is not taught. | MISSING-FINER-POINT | Explain when a foreign key can be placed on the many side and how total participation affects constraints. | MEDIUM |
| 21 | Chapter 2: Relational model and constraints | Relation schema versus relation instance is not explicit. | UNEXPLAINED-WORD | Explain column structure versus current rows, using one table through several insertions. | HIGH |
| 22 | Chapter 2: Relational model and constraints | Degree/arity and cardinality are easy to confuse. | UNEXPLAINED-WORD | State degree = number of attributes; cardinality = number of tuples, with two contrasting tables. | HIGH |
| 23 | Chapter 2: Relational model and constraints | Superkey, candidate key, primary key and alternate key are not listed separately. | MISSING-GATE-CONCEPT | Define the four terms and use attribute closures to find every candidate key. | HIGH |
| 24 | Chapter 2: Relational model and constraints | Foreign keys are not broken down into self-reference and multiple references. | MISSING-FINER-POINT | Teach multiple foreign keys, self-referencing keys, composite foreign keys and matching referenced keys. | HIGH |
| 25 | Chapter 2: Relational model and constraints | Entity integrity and referential integrity are not named. | MISSING-GATE-CONCEPT | Explain primary-key NULL/uniqueness rules and foreign-key matching rules. | HIGH |
| 26 | Chapter 2: Relational model and constraints | `ON DELETE` and `ON UPDATE` actions are not listed. | MISSING-GATE-CONCEPT | Teach CASCADE, SET NULL, RESTRICT/NO ACTION with a parent-child table trace. | HIGH |
| 27 | Chapter 2: Relational model and constraints | SQL NULL and comparison behaviour is not listed. | MISSING-GATE-CONCEPT | Explain UNKNOWN, `IS NULL`, and how WHERE keeps only TRUE rows. | HIGH |
| 28 | Chapter 3: Relational algebra and tuple calculus | Each algebra operator is not listed in the contents. | MISSING-GATE-CONCEPT | Add selection, projection, union, difference, Cartesian product, rename and joins. | HIGH |
| 29 | Chapter 3: Relational algebra | Selection versus projection can be confused. | UNEXPLAINED-WORD | Show selection as choosing rows and projection as choosing columns; include duplicate elimination. | HIGH |
| 30 | Chapter 3: Relational algebra | Union compatibility is not mentioned. | MISSING-FINER-POINT | Show the required same number and compatible domains of attributes. | MEDIUM |
| 31 | Chapter 3: Relational algebra | Rename is needed for self-joins but may be skipped. | MISSING-FINER-POINT | Teach ρ with two copies of the same relation and clearly labelled aliases. | HIGH |
| 32 | Chapter 3: Relational algebra | Theta, equi and natural joins are not distinguished. | MISSING-GATE-CONCEPT | Use the same tiny relations and compare the join condition and output columns. | HIGH |
| 33 | Chapter 3: Relational algebra | Join order and intermediate result sizes are not traced. | NEEDS-TRACE | Show the Cartesian product, filter and projection at every stage for small relations. | HIGH |
| 34 | Chapter 3: Relational algebra | Division is difficult and appears in a PYQ without a listed lesson. | MISSING-GATE-CONCEPT | Teach “for all” queries using a student-course example, then show division and an equivalent difference expression. | HIGH |
| 35 | Chapter 3: Relational algebra | Outer joins are absent from the topic list. | MISSING-FINER-POINT | Add left/right/full outer joins as SQL and extended-algebra context; show NULL-extended rows. | MEDIUM |
| 36 | Chapter 3: Tuple calculus | Tuple variable, bound variable and free variable are not defined. | UNEXPLAINED-WORD | Introduce tuple variables using one employee row and explain quantifier scope. | HIGH |
| 37 | Chapter 3: Tuple calculus | Existential and universal quantifiers are not taught from plain English. | MISSING-PREREQUISITE | Translate “there exists” and “for every” with finite examples before writing TRC. | HIGH |
| 38 | Chapter 3: Tuple calculus | Safe versus unsafe expressions are not listed. | MISSING-GATE-CONCEPT | Teach active-domain/range-restriction reasoning and show why an unbounded output can be infinite. | HIGH |
| 39 | Chapter 3: Relational algebra/TRC | Equivalence between algebra and tuple calculus is not demonstrated. | NEEDS-EXAMPLE | Translate one query both ways, with each relation variable and join condition explained. | HIGH |
| 40 | Chapter 4: SQL | DDL, DML and query statements are not separated. | UNEXPLAINED-WORD | Explain CREATE/ALTER/DROP versus INSERT/UPDATE/DELETE and SELECT. | HIGH |
| 41 | Chapter 4: SQL | Data types and table constraints are not listed. | MISSING-GATE-CONCEPT | Add basic types, PRIMARY KEY, UNIQUE, NOT NULL, CHECK and FOREIGN KEY. | MEDIUM |
| 42 | Chapter 4: SQL | Basic SELECT evaluation order is not taught. | MISSING-PREREQUISITE | Explain FROM/JOIN, WHERE, GROUP BY, HAVING, SELECT and ORDER BY through a staged example. | HIGH |
| 43 | Chapter 4: SQL | Inner, left, right and full joins need visible row outputs. | NEEDS-DIAGRAM | Draw matching keys and unmatched rows, including the NULLs created by outer joins. | HIGH |
| 44 | Chapter 4: SQL | NATURAL JOIN may silently match every same-named column. | MISSING-FINER-POINT | Explain why explicit ON conditions are safer and show a same-name-column trap. | HIGH |
| 45 | Chapter 4: SQL | `EXISTS` and correlated subqueries are not named. | MISSING-GATE-CONCEPT | Trace an outer row and show how the inner query runs using that row's value. | HIGH |
| 46 | Chapter 4: SQL | `IN`, `NOT IN`, `ANY`, `ALL` and NULL interactions are not listed. | MISSING-GATE-CONCEPT | Add a truth-table style lesson; especially warn that `NOT IN` can behave unexpectedly with NULL. | HIGH |
| 47 | Chapter 4: SQL | `COUNT(*)`, `COUNT(column)`, SUM, AVG, MIN and MAX are not enumerated. | MISSING-GATE-CONCEPT | Show how NULL rows affect aggregate results and group counts. | HIGH |
| 48 | Chapter 4: SQL | GROUP BY and HAVING may be mixed up with WHERE. | UNEXPLAINED-WORD | Explain row filtering before grouping versus group filtering after aggregation. | HIGH |
| 49 | Chapter 4: SQL | Duplicate rows and `DISTINCT` are missing. | MISSING-FINER-POINT | Contrast SQL bag semantics with relational-algebra set semantics. | HIGH |
| 50 | Chapter 4: SQL | Set operations UNION, INTERSECT and EXCEPT are not listed. | MISSING-GATE-CONCEPT | Teach compatibility requirements and duplicates/ALL variants where relevant. | MEDIUM |
| 51 | Chapter 5: Functional dependencies | Functional dependency notation is not defined in simple language. | UNEXPLAINED-WORD | Explain “same X values must force same Y values” using sample rows. | HIGH |
| 52 | Chapter 5: Functional dependencies | Trivial, non-trivial and completely non-trivial FDs are not listed. | MISSING-FINER-POINT | Add definitions and examples before Armstrong axioms. | HIGH |
| 53 | Chapter 5: Functional dependencies | Armstrong's reflexivity, augmentation and transitivity need derivations. | NEEDS-EXAMPLE | Prove each rule with small attribute sets; then derive union, decomposition and pseudotransitivity. | HIGH |
| 54 | Chapter 5: Functional dependencies | Attribute closure is not shown as a repeatable method. | NEEDS-TRACE | Add a closure table: start with X, scan FDs, add RHS attributes until nothing changes. | HIGH |
| 55 | Chapter 5: Functional dependencies | Candidate-key finding may be taught by guessing. | STEP-SKIPPED | Teach attributes not on any RHS, closure checks, minimality and all candidate keys. | HIGH |
| 56 | Chapter 5: Functional dependencies | Minimal/canonical cover is not listed. | MISSING-GATE-CONCEPT | Teach singleton RHS, extraneous attributes and redundant dependencies, one deletion at a time. | HIGH |
| 57 | Chapter 5: Functional dependencies | Superkey counting is not connected to candidate keys. | NEEDS-EXAMPLE | Show all supersets of candidate keys and remove duplicate overlaps. | HIGH |
| 58 | Chapter 5: Functional dependencies | FD implications may be answered by intuition only. | NEEDS-TRACE | Use closure/Armstrong derivation for every “always true” statement. | HIGH |
| 59 | Chapter 6: Normal forms | 1NF is often reduced to “atomic” without explaining what the model counts as a value. | UNEXPLAINED-WORD | Use composite/set-valued examples and distinguish a string containing commas from a true set-valued attribute. | HIGH |
| 60 | Chapter 6: Normal forms | Prime and non-prime attributes are not introduced before 2NF/3NF. | UNEXPLAINED-WORD | Define them from the complete set of candidate keys. | HIGH |
| 61 | Chapter 6: Normal forms | 2NF depends on partial dependency on a proper subset of a candidate key. | MISSING-GATE-CONCEPT | Teach composite-key examples and show why a single-attribute key has no partial dependency. | HIGH |
| 62 | Chapter 6: Normal forms | 3NF and BCNF conditions are easy to memorise incorrectly. | MISSING-GATE-CONCEPT | Put both exact conditions side by side and test each FD separately. | HIGH |
| 63 | Chapter 6: Normal forms | 3NF-but-not-BCNF examples need candidate keys fully calculated. | NEEDS-TRACE | Show closure, prime attributes, each FD and the exact failing condition. | HIGH |
| 64 | Chapter 6: Normal forms | Lossless-join decomposition is not listed. | MISSING-GATE-CONCEPT | Teach the binary decomposition test and the chase/table method for larger decompositions. | HIGH |
| 65 | Chapter 6: Normal forms | Dependency preservation is not separated from losslessness. | UNEXPLAINED-WORD | Explain that one protects reconstruction and the other protects local FD checking; give examples of each. | HIGH |
| 66 | Chapter 6: Normal forms | 3NF synthesis and BCNF decomposition procedures are not in the outline. | MISSING-GATE-CONCEPT | Add step-by-step algorithms, including when BCNF loses dependency preservation. | HIGH |
| 67 | Chapter 6: Normal forms | 4NF and multivalued dependencies are not shown. | MISSING-FINER-POINT | Add a clearly labelled [LATER] section only if retained as enrichment; do not imply it is explicitly named in the syllabus. | LOW |
| 68 | Chapter 7: File organization and indexing | A record, field, block and disk I/O are not defined. | MISSING-PREREQUISITE | Explain why a disk moves blocks rather than individual attributes and how records fit into blocks. | HIGH |
| 69 | Chapter 7: File organization | Heap, sorted and hashed file organizations are not named. | MISSING-GATE-CONCEPT | Compare insertion, search, range search and full scan costs. | HIGH |
| 70 | Chapter 7: File organization | Blocking factor and unspanned record packing are not listed. | MISSING-GATE-CONCEPT | Teach floor(block size / record size), records per block and ceiling for total blocks. | HIGH |
| 71 | Chapter 7: Indexing | Primary, clustering and secondary indexes are not distinguished. | MISSING-GATE-CONCEPT | Define the index key's relation to the physical file order with examples. | HIGH |
| 72 | Chapter 7: Indexing | Dense and sparse index are not explained with pictures. | NEEDS-DIAGRAM | Draw one index entry per record versus one entry per block and explain why sparse needs ordered data. | HIGH |
| 73 | Chapter 7: Indexing | Multilevel index and binary search over index blocks are not listed. | MISSING-GATE-CONCEPT | Trace index levels and count block accesses, not just comparisons. | HIGH |
| 74 | Chapter 7: B/B+ trees | Order/fanout calculation is not listed. | MISSING-GATE-CONCEPT | Derive pointer/key-size inequalities from the block-size limit. | HIGH |
| 75 | Chapter 7: B/B+ trees | B-tree and B+ tree storage differences are not contrasted. | UNEXPLAINED-WORD | Show where records/data pointers live, separator keys, and linked leaves. | HIGH |
| 76 | Chapter 7: B/B+ trees | Insertion split and separator copy-up need frames. | NEEDS-TRACE | Trace leaf overflow, split, parent insertion and root split using one fixed occupancy convention. | HIGH |
| 77 | Chapter 7: B/B+ trees | Deletion, borrowing and merging are not listed. | MISSING-FINER-POINT | Add deletion rules and root shrink as a [SHOULD] lesson after insertion. | MEDIUM |
| 78 | Chapter 7: Indexing | Hash index versus B+ tree index use is not compared. | MISSING-FINER-POINT | Compare point lookup, range query, ordering and density. | MEDIUM |
| 79 | Chapter 8: Transactions | Transaction and schedule are not defined from an everyday example. | MISSING-PREREQUISITE | Use a bank transfer to define read, write, commit and abort. | HIGH |
| 80 | Chapter 8: Transactions | ACID is listed nowhere in the chapter title. | MISSING-GATE-CONCEPT | Add atomicity, consistency, isolation and durability with one failure example each. | HIGH |
| 81 | Chapter 8: Transactions | Serial schedule and serializable schedule sound almost identical. | UNEXPLAINED-WORD | Show a serial schedule and a non-serial schedule with the same effect. | HIGH |
| 82 | Chapter 8: Transactions | Conflict and conflict equivalence are not defined. | UNEXPLAINED-WORD | Teach read/write pairs on the same item and show exactly when order matters. | HIGH |
| 83 | Chapter 8: Transactions | Precedence graph procedure is not visible. | NEEDS-TRACE | Add one edge per conflicting ordered pair; test for a cycle. | HIGH |
| 84 | Chapter 8: Transactions | View serializability is not distinguished from conflict serializability. | MISSING-FINER-POINT | Add blind writes, read-from relations and final writer as a later comparison. | MEDIUM |
| 85 | Chapter 8: Transactions | Recoverable, cascadeless and strict schedules are not listed. | MISSING-GATE-CONCEPT | Show dirty reads, commit ordering and cascading rollback on a schedule timeline. | HIGH |
| 86 | Chapter 8: Recovery | Undo, redo, log records and checkpoints are not in the plan. | MISSING-GATE-CONCEPT | Add crash recovery with a small log and repeat-crash recovery trace. | HIGH |
| 87 | Chapter 9: Concurrency control | Shared and exclusive locks and compatibility are not listed. | MISSING-GATE-CONCEPT | Draw the lock compatibility matrix and trace requests. | HIGH |
| 88 | Chapter 9: Concurrency control | Two-phase locking (2PL) is not split into growing and shrinking phases. | MISSING-GATE-CONCEPT | Show the lock timeline; once a transaction releases its first lock it cannot acquire another under 2PL. | HIGH |
| 89 | Chapter 9: Concurrency control | Strict 2PL and rigorous 2PL may be confused. | MISSING-FINER-POINT | Compare when shared and exclusive locks are released. | MEDIUM |
| 90 | Chapter 9: Concurrency control | Deadlocks, wait-for graphs and prevention are not mentioned. | MISSING-GATE-CONCEPT | Add wait-for graph cycle detection, timeout caveat and prevention schemes. | HIGH |
| 91 | Chapter 9: Concurrency control | Timestamp ordering and Thomas write rule appear in PYQs but not in the title. | MISSING-GATE-CONCEPT | Add read_TS/write_TS rules and show when an obsolete write is ignored. | HIGH |
| 92 | Chapter 9: Concurrency control | Wait-die and wound-wait are not listed. | MISSING-GATE-CONCEPT | Teach age ordering, who waits/who aborts and why it prevents cycles. | HIGH |
| 93 | Chapter 9: Concurrency control | Starvation and restart timestamp assumptions are not stated. | MISSING-FINER-POINT | Explain why keeping the same timestamp after restart affects starvation. | MEDIUM |
| 94 | Whole book: SQL/RA | Query result size and selectivity estimation appear in a PYQ but are not listed. | MISSING-FINER-POINT | Add a small estimation lesson: uniformity, independence and inclusion-exclusion; label bag/set assumptions. | MEDIUM |
| 95 | Whole book: constraints | Referential-action cycles (two tables referencing each other) are not covered. | NEEDS-TRACE | Use a two-table example to trace cascade, set-null and the records affected. | MEDIUM |
| 96 | Whole book: SQL | `NOT EXISTS` versus `NOT IN` when NULL is present is absent. | MISSING-FINER-POINT | Add a correlated anti-join example and a NULL counterexample. | HIGH |
| 97 | Whole book: SQL | `ALL` and `ANY` are not translated into greatest/least comparisons. | MISSING-FINER-POINT | Teach the empty-set case, duplicates and NULL caveats using small value lists. | MEDIUM |
| 98 | Whole book: indexing | Index access calculations need both index blocks and data blocks distinguished. | NEEDS-TRACE | State whether the question asks to locate a data block or actually read the record; count the final data I/O only when asked. | HIGH |
| 99 | PYQ bank | Sixteen questions have missing figures or data tables. | NEEDS-DIAGRAM | Restore every original ER diagram, relation instance, B+ tree, schedule and data table before publication. | HIGH |
| 100 | PYQ bank | The official answer mark is not the same thing as a worked solution. | NEEDS-TRACE | For all 72 questions, include the query/FD/schedule/table trace, assumptions, units and why distractors fail. | HIGH |

---

# PART 3 — WHAT A COMPLETE GATE DATABASES SUBJECT MUST HAVE

The five official syllabus bullets are correct. The following expansion is what the book must cover to teach those lines at GATE level. Frequency is taken from the supplied sample only when it is clearly attributable; it is not a forecast.

| Syllabus line | Topic and finer points to teach | Frequency from supplied bank / wider GATE | Typical question type | Zero-level prerequisite |
|---|---|---|---|---|
| ER-model | Entity, entity set, attribute, relationship, relationship set | Bank: 5 ER questions / 5 marks in the supplied 15-paper set; wider frequency: not sure | Identify correct ER diagram or interpret a specification | Sets, real-world objects and properties |
| ER-model | Simple, composite, multivalued, derived and key attributes | not sure | Identify valid attribute type / ER symbol | Attribute and domain |
| ER-model | 1:1, 1:N, N:1, M:N cardinality | not sure | Count/interpret associations; choose relationship mapping | Functions and ordered pairs |
| ER-model | Total versus partial participation | not sure | Interpret single/double lines | Minimum/maximum participation |
| ER-model | Weak entity, owner entity, partial key, identifying relationship | Several supplied questions concern weak entities; exact frequency beyond this bank: not sure | Identify identifying relationship symbol and participation | Entity keys |
| ER-model | Unary, binary and ternary relationships | not sure | Determine correct relationship arity | Entity sets |
| ER-model | Mapping ER to relations | not sure | Place foreign key or create relationship table | Keys and foreign keys |
| Relational model | Relation schema versus instance, tuple, attribute, domain, degree and cardinality | Bank: 13 relational-model/RA/TRC questions / 21 marks, but mixed topics | Identify degree/cardinality; schema matching | Table, row, column |
| Relational model | Set semantics, no duplicate tuples, unordered relation | not sure | Explain result cardinality or projection duplicate removal | Sets |
| Relational model | Superkey, candidate key, primary key, alternate key, composite key | FD/key bank has many questions; separate rate: not sure | Find all keys or count superkeys | Subsets and attribute sets |
| Relational model | Foreign key, self-reference, multiple FKs, composite FK | Bank contains direct FK questions; frequency: not sure | Judge allowed references and referential constraints | Primary/candidate keys |
| Integrity constraints | Entity integrity, referential integrity, unique/not-null/check constraints | not sure | Determine legal insert/delete/update | Keys and NULL |
| Integrity constraints | ON DELETE/UPDATE CASCADE, SET NULL, RESTRICT | Supplied bank includes a cross-referencing-table deletion question | Count affected/deleted rows | Foreign keys |
| Relational algebra | Selection, projection, union, difference, Cartesian product, rename | Bank's relational bucket has 13 questions, including RA/TRC | Evaluate expression on small relations | Sets and predicates |
| Relational algebra | Union compatibility and duplicate elimination | not sure | Decide whether expressions are valid / count result tuples | Domains and sets |
| Relational algebra | Theta join, equijoin, natural join, outer join | Multiple supplied items test joins/outer join; exact split frequency: not sure | Count output rows or choose equivalent expression | Cartesian product and selection |
| Relational algebra | Division and “for all” queries | Supplied bank includes brand-ownership and course-enrolment division | Find entities related to every value in a second relation | Cartesian product, difference |
| Relational algebra | Expression rewriting / equivalence and safe use of rename | not sure | Choose equivalent query or minimise operators | Basic RA |
| Tuple calculus | Tuple variables, free/bound variables, quantifiers | Supplied bank includes TRC queries; frequency outside sample: not sure | Translate a natural-language request into TRC | Predicate logic |
| Tuple calculus | ∃, ∀, negation, safe expressions and active domain | Supplied bank contains a safe-query question | Identify safe/unsafe expression | Quantifiers and finite relations |
| SQL | CREATE TABLE, types, constraints, INSERT, UPDATE, DELETE | not separately counted; not sure | Identify legal DDL/DML or constraint result | Table and key concepts |
| SQL | SELECT, WHERE, ORDER BY, DISTINCT | Several bank SQL items | Evaluate query output | Boolean conditions |
| SQL | INNER/LEFT/RIGHT/FULL joins, NATURAL JOIN and ON | Several bank items; not sure exact frequency | Determine which rows survive and NULL extension | Join keys |
| SQL | GROUP BY, HAVING and aggregates COUNT/SUM/AVG/MIN/MAX | Bank: 10 SQL questions / 17 marks | Evaluate grouped query or aggregate result | Rows, groups and arithmetic |
| SQL | Correlated subqueries and EXISTS/NOT EXISTS | Bank includes EXISTS and nested subqueries | Count selected rows or identify correct query | Scope and nested query |
| SQL | IN, NOT IN, ANY, ALL, scalar and row subqueries | Bank contains row-valued IN and ALL/ANY questions | Evaluate subquery predicates | Set membership |
| SQL | NULL and three-valued logic | not sure | Determine rows satisfying a condition with NULL | TRUE/FALSE/UNKNOWN |
| SQL | UNION/INTERSECT/EXCEPT and set difference | Bank contains EXCEPT usage | Evaluate set query and duplicates | Relational set operations |
| SQL / query processing | Basic selectivity estimates under uniform/independent assumptions | One supplied PYQ directly tests this; broader frequency: not sure | NAT estimate using probabilities and inclusion-exclusion | Probability and set union |
| Integrity constraints / FDs | FD meaning; trivial, non-trivial and completely non-trivial FDs | Bank: 10 integrity/FD questions / 15 marks | Judge implications | Functional relationship |
| Integrity constraints / FDs | Armstrong axioms: reflexivity, augmentation, transitivity; union/decomposition/pseudotransitivity | Supplied bank includes proof of union | Which axioms are sufficient / derive FD | Sets and logic |
| Integrity constraints / FDs | Attribute closure X⁺ | not sure separate count; essential prerequisite | Compute closure or decide superkey | Repeated FD application |
| Integrity constraints / FDs | Candidate keys and superkey counting | Several supplied NAT/MSQ items | Count keys/superkeys | Attribute closure |
| Integrity constraints / FDs | Minimal/canonical cover | Supplied bank includes irreducible equivalent FD set | Remove extraneous attributes and redundant FDs | Armstrong axioms |
| Normal forms | 1NF and atomic values; composite/set-valued attributes | Bank: 9 normalisation questions / 15 marks | Identify 1NF violation | Relational values |
| Normal forms | Prime/non-prime attributes and 2NF | not sure separate frequency | Identify partial dependency | Candidate keys |
| Normal forms | 3NF and BCNF definitions and boundaries | Bank contains multiple 3NF/BCNF examples; 2027 frequency: not sure | Decide highest normal form | FD closure, prime attributes |
| Normal forms | Lossless join decomposition | Supplied bank includes decomposition questions | Test whether spurious tuples can occur | Functional dependencies |
| Normal forms | Dependency-preserving decomposition | Supplied bank includes 3NF/BCNF preservation question | Test whether FDs can be checked locally | Projection of FDs |
| Normal forms | 3NF synthesis and BCNF decomposition | not sure | Construct decomposition | Minimal cover and violating FD |
| Normal forms | 4NF/MVD and 5NF/join dependencies | not explicitly in syllabus wording; not sure whether needed for this target | Identify multivalued dependency / decomposition | FDs and decompositions |
| File organization | Record, field, block, blocking factor, spanned/unspanned records | Bank contains block-counting/indexing questions | Compute data-file blocks | Bytes and division |
| File organization | Heap, sorted and hashed files | One supplied question compares scan I/O cost | Select file organisation for scans / point lookups | Sequential storage |
| Indexing | Primary, clustering and secondary indexes | Bank: 10 index/file questions / 15 marks | Calculate index entries and blocks | File ordering and keys |
| Indexing | Dense and sparse indexes | Supplied bank directly asks dense/sparse properties | Classify index and count entries | Ordered file |
| Indexing | Single-level and multilevel indexes, binary search on index blocks | Supplied bank includes primary-index and I/O calculation | Count block accesses | Blocking factor |
| Indexing | B-tree versus B+ tree; leaf links and data-pointer locations | Bank includes B+ tree properties and insertion | Identify correct property | Multiway tree |
| Indexing | B/B+ order, fanout and node capacity | Supplied bank includes order NAT | Compute maximum pointers/key capacity | Block, key and pointer sizes |
| Indexing | B+ insertion: leaf split, copy-up, internal split, root growth | Supplied bank includes insertion and parent-key values | Trace tree after insertion | Multiway search tree |
| Indexing | B+ deletion, redistribution, merge and root shrink | not sure in supplied bank; useful finer point | Trace underflow repair | Insertion split |
| Indexing | Hash index and range-index trade-off | Supplied bank includes hash-index density | Select index for equality/range | Hashing and sorted order |
| Transactions | Transaction, read/write, commit, abort; ACID | Bank: 15 transaction/concurrency questions / 23 marks | Identify ACID property or abort impact | Basic database operations |
| Transactions | Serial schedule, conflict, conflict equivalence, precedence graph | Many supplied questions test conflict serializability | Build graph and check cycle | Directed graphs |
| Transactions | View serializability and blind writes | Bank includes Thomas write rule question | Distinguish view serializable from conflict serializable | Read-from and final-writer relation |
| Transactions | Recoverable, cascadeless and strict schedules | Supplied bank includes dirty-read rollback and recoverability | Determine rollback/commit order | Read-from relationships |
| Transactions | Cascading rollback and dirty reads | Supplied bank includes a rollback-chain question | Find all dependent transactions | Schedule timeline |
| Transactions / recovery | Log, undo, redo, checkpoint and restart recovery | Supplied bank includes crash during recovery | Construct undo/redo lists | Transaction log |
| Concurrency control | Shared/exclusive locks and compatibility | not sure separate frequency | Determine whether lock can be granted | Read/write operations |
| Concurrency control | 2PL, strict 2PL and rigorous 2PL | Supplied bank includes 2PL MSQ and strict-2PL question | Check serializability/recoverability | Lock timelines |
| Concurrency control | Deadlock, wait-for graph and prevention | Relevant under concurrency control; exact supplied-bank count: not sure | Detect cycle / identify prevention method | Directed graph |
| Concurrency control | Timestamp ordering and Thomas Write Rule | Supplied bank includes timestamp/Thomas question | Judge view/conflict serializability | Timestamps |
| Concurrency control | Wait-die and wound-wait | Supplied bank includes a deadlock prevention algorithm | Identify who waits or aborts; prove starvation condition | Timestamp age ordering |

---

# PART 4 — THE DIAGRAMS I NEED

The student should see the picture **before** receiving the rule. Each diagram needs labels, a caption, and one “what should I notice?” sentence. For changing structures or schedules, use a series of frames or a trace table.

| Chapter / topic | What to draw | What I should notice | Best format |
|---|---|---|---|
| Database basics | Spreadsheet/file versus DBMS with multiple users and constraints | A DBMS manages shared data and protects rules | Single picture |
| Three-schema architecture | External views → logical schema → physical storage | Views, relations and file/index structures are different levels | Single layered diagram |
| ER model | Entity sets Student, Course, Instructor and relationships | Rectangles are entities; diamonds are relationships | Single ER diagram |
| ER attributes | Simple, composite, multivalued and derived attributes | Attribute shape and structure carry meaning | Single diagram |
| ER cardinality | 1:1, 1:N, N:1 and M:N examples | Maximum participation is different from minimum participation | Four side-by-side diagrams |
| ER participation | Single-line versus double-line connection | Partial versus total participation | Side-by-side diagram |
| Weak entity | Owner, weak entity, partial key, double diamond | Weak entity needs the owner key to be identified | Single ER diagram |
| ER-to-relational mapping | Convert Student, Course, Enrolment ER model into tables | M:N becomes a separate relation; N:1 can put FK on many side | Step-by-step series |
| Relation structure | Table with schema above and rows below | Attributes define columns; tuples are rows | Single picture |
| Keys | One relation where AB and AC are candidate keys | A superkey contains a candidate key; a candidate key is minimal | Highlighted table |
| Foreign key | Two linked tables and parent/child rows | Referential integrity prevents dangling references | Single picture |
| Referential actions | Delete a parent row with CASCADE and SET NULL children | Only the specified action occurs along the FK direction | Step-by-step series |
| Relational algebra | Selection choosing rows and projection choosing columns | σ filters rows; π keeps columns and removes duplicates | Side-by-side pictures |
| Cartesian product | R rows paired with all S rows | Result size multiplies before selection | Result table |
| Join | Two tables with matching keys, unmatched rows and output | Join is a filtered pairing; natural join removes duplicate join columns | Step-by-step series |
| Rename/self-join | Two renamed copies of Employee | Aliases let us compare rows from the same relation | Single picture |
| Division | Students × courses, then remove missing pairs | “Own all brands” means no required brand is missing | Step-by-step table |
| Tuple calculus | Tuple variable with bound/free variable labels | Quantifiers limit variables; free variable is the output | Annotated expression |
| ∃ and ∀ | A finite set with “at least one” and “every” examples | Existence and universal conditions have different failure cases | Single picture |
| Safe calculus | Active-domain values versus arbitrary values | A safe query returns only finitely many values from the database domain | Single comparison |
| SQL query evaluation | FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT | Rows are filtered before groups are filtered | Flowchart |
| SQL joins | Inner/left/right/full join outputs | Outer joins keep unmatched rows with NULLs | Four output tables |
| EXISTS | Outer Students row and correlated inner Enrolled check | Inner query is tested using each outer row | Step-by-step series |
| ANY/ALL | One value compared with a set of values | ANY needs one success; ALL needs every comparison to succeed | Value number line |
| NULL | TRUE/FALSE/UNKNOWN truth table | `NULL = value` is not TRUE or FALSE; it is UNKNOWN | Truth table |
| GROUP BY | Rows sorted/partitioned into department groups | Aggregates are computed separately per group | Frames / grouped table |
| Set versus bag SQL | Duplicate rows before and after DISTINCT/UNION | SQL may preserve duplicates; relational algebra uses sets | Side-by-side tables |
| Functional dependency | Two rows with same X values and same Y values | X determines Y when equal X cannot disagree on Y | Table example |
| Armstrong axioms | X→Y with augmented sets and transitive chain | Each rule creates a new valid dependency | Step-by-step proof |
| Attribute closure | Start with X and add FD right sides | Closure stops when no new attribute can be added | Trace table |
| Candidate keys | Closure of several attribute sets | Key must determine all attributes and be minimal | Trace table |
| Minimal cover | Split RHS, remove LHS attributes, remove redundant FDs | Each simplification must preserve the same closure | Step-by-step series |
| Superkey counting | Candidate-key subsets and their supersets | Count union of supersets without double counting | Set diagram |
| 1NF | Set-valued cell versus atomic cells | One cell represents one value under the relational model | Before/after tables |
| 2NF | Composite key with a partial dependency | Non-prime attribute must depend on the whole candidate key | Dependency diagram |
| 3NF / BCNF | FD arrows with determinant and RHS prime status | 3NF permits a prime RHS exception; BCNF requires every determinant to be a superkey | Side-by-side table |
| Lossless decomposition | Original table split into two tables and rejoined | A lossless join returns exactly original tuples | Before/after relation |
| Dependency preservation | FD arrows that can/cannot be checked in separate pieces | Lossless and dependency preserving are separate properties | Dependency diagram |
| File blocks | Records packed into fixed-size blocks | Blocking factor is a floor; last block may be partly empty | Block picture |
| Heap/sorted/hash file | Same records in three physical layouts | Layout changes insertion, equality search, range scan and full scan | Three-column comparison |
| Dense/sparse index | One entry per record versus one per data block | Sparse index relies on ordered data and locates a range/block | Side-by-side diagram |
| Multilevel index | Root/index/leaf/data pages | Each level reduces the number of pages searched | Tree plus block labels |
| B-tree and B+ tree | Internal keys, record pointers and leaf links | B+ data entries are in leaves; leaf chain supports range scans | Side-by-side diagram |
| B+ insertion | Leaf overflow, split, separator copy-up, parent overflow | A split can propagate upward and may increase height | Step-by-step series |
| B+ deletion | Underflow, borrow, merge and root contraction | Repair may move keys or merge siblings | Step-by-step series |
| Transaction | Bank account debit and credit | Transaction is a unit that should satisfy ACID | Timeline |
| ACID | Atomicity, consistency, isolation, durability failures | Each property prevents a different failure | Four-panel diagram |
| Schedule | Interleaved read/write events by transaction | Time order and transaction order are not the same thing | Timeline |
| Conflict graph | One node per transaction and directed edges from conflicts | A directed cycle means not conflict-serializable | Graph + trace table |
| Cascading rollback | T2/T3 read an uncommitted value written by T1 | Aborting T1 forces dependent readers to roll back | Timeline |
| Recovery log | BEGIN, WRITE, COMMIT, ABORT, checkpoint records | Recovery uses durable log records to undo/redo | Timeline / table |
| Lock compatibility | S/X compatibility matrix | S-S can coexist; any X conflicts with another lock | Matrix |
| 2PL | Growing phase then shrinking phase | Once the first lock is released, no new lock can be acquired | Timeline |
| Deadlock | Wait-for graph cycle | Circular waiting prevents progress | Graph |
| Timestamp ordering | Older/younger transactions with read_TS/write_TS | Each read/write is checked against timestamp rules | Decision flowchart |
| Wait-die/wound-wait | Two transactions ordered by age | The older/younger rule determines wait or abort | Side-by-side flowchart |

---

# PART 5 — THE FULL BEGINNER-FIRST PLAN, CHAPTER BY CHAPTER

**Lesson length:** 45–90 minutes each.  
**Priority tags:** `[MUST]` = direct syllabus skill or essential prerequisite; `[SHOULD]` = recurring GATE pattern/supporting concept; `[LATER]` = useful extension that must not delay the core.

Every lesson should follow the universal 12-station lesson structure: why, glossary, see it, build it, do it by hand, exact rules, finer points, GATE patterns, mistakes, valid shortcuts, practice ladder and recap. Every example must show the intermediate table or diagram, not only the final answer.

## Chapter 0 — Database foundations

### DB0.1 — Why do we need a DBMS? [MUST]
- **Prerequisites:** none.
- **Beginner must-see:** data, database, DBMS, table, record and field.
- **Finer points:** shared data, redundancy, inconsistency, integrity rules and concurrent users.
- **GATE level:** identify the purpose of a DBMS and the three-schema idea.
- **Diagrams:** file-versus-DBMS picture; three-schema architecture.
- **Hand traces:** update a student's department in two duplicate files and compare with one central database.
- **Common mistakes:** treating a DBMS as only a program for storing tables.

### DB0.2 — Set theory, logic and table vocabulary [MUST]
- **Prerequisites:** basic arithmetic.
- **Beginner must-see:** set, subset, Cartesian product, row/tuple, column/attribute and domain.
- **Finer points:** ordered versus unordered collections, duplicate elements and Boolean conditions.
- **GATE level:** understand relational operators and tuple calculus expressions.
- **Diagrams:** two sets with product pairs; labelled relation.
- **Hand traces:** form R×S for two tiny tables.
- **Common mistakes:** mixing up degree and cardinality.

## Chapter 1 — ER model

### DB1.1 — Entities, attributes and keys [MUST]
- **Prerequisites:** DB0.1–DB0.2.
- **Beginner must-see:** entity is one thing; entity set is a collection; attributes describe it.
- **Finer points:** simple/composite, single/multivalued, derived and key attributes.
- **GATE level:** choose valid ER symbols and identify keys.
- **Diagrams:** Student entity with composite Name, multivalued Phone and key RollNo.
- **Hand traces:** identify entity, attribute and key from a small college description.
- **Common mistakes:** calling a property an entity; confusing a candidate key with an ordinary attribute.

### DB1.2 — Relationships, cardinality and participation [MUST]
- **Prerequisites:** DB1.1.
- **Beginner must-see:** relationships connect entities; cardinality tells how many partners may be related.
- **Finer points:** 1:1, 1:N, N:1, M:N; total and partial participation; relationship degree.
- **GATE level:** read natural-language relationship statements and choose the correct ER diagram.
- **Diagrams:** four cardinality examples and single/double participation lines.
- **Hand traces:** read “each student belongs to exactly one department” and mark constraints.
- **Common mistakes:** assuming total participation from a one-to-many arrow.

### DB1.3 — Weak entities and identifying relationships [MUST]
- **Prerequisites:** DB1.1–DB1.2.
- **Beginner must-see:** weak entity cannot be uniquely identified by its own attributes alone.
- **Finer points:** owner, partial key, identifying relationship and total participation of weak entity.
- **GATE level:** identify the identifying relationship symbol and required participation.
- **Diagrams:** Employee–Dependent or Order–OrderItem with double rectangle/double diamond.
- **Hand traces:** determine the full key of a weak entity.
- **Common mistakes:** assuming the owner must also have total participation.

### DB1.4 — Convert ER diagrams into tables [SHOULD]
- **Prerequisites:** DB1.1–DB1.3 and keys.
- **Beginner must-see:** strong entities become tables; relationship cardinality decides where a foreign key goes.
- **Finer points:** weak entity table includes owner key; M:N relationship becomes a separate table; relationship attributes.
- **GATE level:** identify whether a relationship table can be merged with an entity table.
- **Diagrams:** ER diagram transformed into relational schemas.
- **Hand traces:** convert Student–Course M:N and Employee–Department N:1.
- **Common mistakes:** storing an M:N relationship in only one side without a mapping table.

## Chapter 2 — Relational model and integrity constraints

### DB2.1 — Relations, schemas and instances [MUST]
- **Prerequisites:** DB0.2.
- **Beginner must-see:** schema is the design; instance is the current set of rows.
- **Finer points:** degree, cardinality, domains, no duplicate tuples in the relational model.
- **GATE level:** schema classification and degree questions.
- **Diagrams:** one schema with several instance snapshots.
- **Hand traces:** count columns and rows after inserting/deleting tuples.
- **Common mistakes:** calling row count the degree.

### DB2.2 — Keys and superkeys [MUST]
- **Prerequisites:** sets and attributes.
- **Beginner must-see:** superkey identifies rows; candidate key is a minimal superkey.
- **Finer points:** primary, alternate and composite keys; prime/non-prime attributes.
- **GATE level:** identify all candidate keys and count superkeys.
- **Diagrams:** attribute-set containment picture.
- **Hand traces:** calculate closures for all possible minimal determinant sets on a 4-attribute relation.
- **Common mistakes:** counting every superset as a separate candidate key.

### DB2.3 — Integrity constraints and foreign keys [MUST]
- **Prerequisites:** DB2.1–DB2.2.
- **Beginner must-see:** constraints stop invalid database states.
- **Finer points:** entity integrity, referential integrity, self-referencing and multiple FKs, composite FKs, CASCADE and SET NULL.
- **GATE level:** determine legal updates/deletes and count cascade effects.
- **Diagrams:** parent-child tables with FK arrows.
- **Hand traces:** delete a referenced row under each referential action.
- **Common mistakes:** assuming a table can have only one foreign key or cannot refer to itself.

### DB2.4 — NULL and three-valued logic [SHOULD]
- **Prerequisites:** Boolean logic.
- **Beginner must-see:** NULL means unknown/missing, not zero or an empty value.
- **Finer points:** TRUE/FALSE/UNKNOWN, IS NULL, comparisons, NOT IN trap.
- **GATE level:** identify rows returned by a condition involving NULL.
- **Diagrams:** truth tables and row filtering.
- **Hand traces:** evaluate `x=5`, `x<>5`, `x IS NULL`, `NOT IN`.
- **Common mistakes:** treating `NULL = NULL` as TRUE.

## Chapter 3 — Relational algebra and tuple calculus

### DB3.1 — The first relational algebra operators [MUST]
- **Prerequisites:** DB2.1 and set operations.
- **Beginner must-see:** selection chooses rows; projection chooses columns.
- **Finer points:** σ, π, union, difference, rename and union compatibility.
- **GATE level:** evaluate expressions on small tables.
- **Diagrams:** input table and output table after each operator.
- **Hand traces:** select one department, then project employee names.
- **Common mistakes:** forgetting projection removes duplicate tuples.

### DB3.2 — Cartesian product and joins [MUST]
- **Prerequisites:** DB3.1.
- **Beginner must-see:** product pairs every row; join keeps pairs that satisfy a condition.
- **Finer points:** theta/equi/natural joins, self-join, duplicate join columns and outer joins.
- **GATE level:** count tuples and identify equivalent expressions.
- **Diagrams:** product grid, join-match lines and outer-join NULL rows.
- **Hand traces:** join two 3-row tables and mark each candidate pair.
- **Common mistakes:** forgetting a join condition and accidentally producing a Cartesian product.

### DB3.3 — Division and “for all” queries [SHOULD]
- **Prerequisites:** product, projection and difference.
- **Beginner must-see:** division finds entities related to every value in another set.
- **Finer points:** division equivalence using product/difference and empty divisor caveat.
- **GATE level:** find students who completed all required courses or owners of all brands.
- **Diagrams:** all required pairs versus missing pairs.
- **Hand traces:** eliminate any student with one missing course.
- **Common mistakes:** reading “at least one” when the query says “all”.

### DB3.4 — Tuple relational calculus [MUST]
- **Prerequisites:** DB0.2, predicate logic and DB3.1.
- **Beginner must-see:** output tuples satisfying a logical condition.
- **Finer points:** tuple variables, attributes, bound/free variables, ∃, ∀, negation and safe expressions.
- **GATE level:** translate natural language into TRC and compare with relational algebra.
- **Diagrams:** variable scope and finite active domain.
- **Hand traces:** express “players on team MI” and “employee with no matching department”.
- **Common mistakes:** confusing variable names with attribute names or omitting a relation-range condition.

## Chapter 4 — SQL

### DB4.1 — Tables, DDL and basic SELECT [MUST]
- **Prerequisites:** DB2.1–DB2.3.
- **Beginner must-see:** CREATE defines structure; INSERT adds rows; SELECT reads rows.
- **Finer points:** column types, primary/foreign key, UNIQUE, NOT NULL, CHECK, UPDATE and DELETE.
- **GATE level:** read and evaluate a simple SELECT/WHERE query.
- **Diagrams:** schema followed by table instance and query result.
- **Hand traces:** create Student and Enrolled, insert rows and filter by course.
- **Common mistakes:** treating SQL keywords as a fixed execution order.

### DB4.2 — Joins and subqueries [MUST]
- **Prerequisites:** DB3.2 and DB4.1.
- **Beginner must-see:** join combines related rows; subquery computes a result used by an outer query.
- **Finer points:** inner/outer/natural joins, EXISTS, IN, scalar subqueries and correlation.
- **GATE level:** choose correct SQL queries and count returned rows.
- **Diagrams:** join matches and correlated outer/inner query loop.
- **Hand traces:** find all players in a team named MI; use EXISTS for course enrolment.
- **Common mistakes:** forgetting the correlation condition or accidentally matching wrong same-named columns.

### DB4.3 — Aggregates, grouping and set operations [MUST]
- **Prerequisites:** DB4.1–DB4.2.
- **Beginner must-see:** aggregates summarise rows; GROUP BY creates separate groups.
- **Finer points:** COUNT(*), COUNT(column), NULL handling, WHERE versus HAVING, DISTINCT, UNION/INTERSECT/EXCEPT.
- **GATE level:** compute averages, grouped counts and set-difference queries.
- **Diagrams:** grouping of rows by department and aggregate outputs.
- **Hand traces:** compute number of students in each course; filter groups with HAVING.
- **Common mistakes:** applying HAVING before grouping or counting NULL as a normal value.

### DB4.4 — ANY, ALL, NOT EXISTS and query edge cases [SHOULD]
- **Prerequisites:** DB4.2–DB4.3, Boolean logic.
- **Beginner must-see:** ANY means at least one comparison succeeds; ALL means every comparison succeeds.
- **Finer points:** empty subquery, NULL in NOT IN, tuple-valued IN and duplicate behaviour.
- **GATE level:** evaluate queries involving `> ALL`, `> ANY`, `NOT EXISTS`, `EXCEPT`.
- **Diagrams:** comparison against a list of values.
- **Hand traces:** evaluate one query with Spain/Germany goal lists.
- **Common mistakes:** treating ANY as “any value is larger” rather than “the comparison is true for at least one row”.

## Chapter 5 — Functional dependencies

### DB5.1 — Functional dependencies from data [MUST]
- **Prerequisites:** DB2.1–DB2.2.
- **Beginner must-see:** X→Y means equal X values force equal Y values.
- **Finer points:** trivial/non-trivial FD, determinant and dependent attributes.
- **GATE level:** decide which FDs are implied by a table/statement.
- **Diagrams:** row pairs with equal X and Y highlighted.
- **Hand traces:** test A→B and AB→C on a small relation instance.
- **Common mistakes:** thinking an FD means X and Y are unique individually.

### DB5.2 — Armstrong axioms and derived rules [MUST]
- **Prerequisites:** sets and implication.
- **Beginner must-see:** reflexivity, augmentation and transitivity.
- **Finer points:** union, decomposition, pseudotransitivity; show which rules are derivable.
- **GATE level:** select a minimal sufficient axiom set or derive an FD.
- **Diagrams:** dependency arrows and augmented attribute sets.
- **Hand traces:** prove X→YZ from X→Y and X→Z.
- **Common mistakes:** using the name of a rule without showing how it follows.

### DB5.3 — Attribute closure, candidate keys and superkeys [MUST]
- **Prerequisites:** DB5.1–DB5.2.
- **Beginner must-see:** X+ is everything X can determine.
- **Finer points:** attributes absent from RHS, minimality, multiple candidate keys, counting superkeys.
- **GATE level:** find keys and answer “how many superkeys?” NATs.
- **Diagrams:** closure-growing set and key/superset lattice.
- **Hand traces:** find keys for a 4-attribute and a 5-attribute relation.
- **Common mistakes:** stopping closure too early or calling a non-minimal superkey a candidate key.

### DB5.4 — Minimal/canonical cover [SHOULD]
- **Prerequisites:** DB5.2–DB5.3.
- **Beginner must-see:** equivalent FD set with no unnecessary attributes or dependencies.
- **Finer points:** singleton RHS, extraneous LHS attribute and redundant FD removal.
- **GATE level:** choose irreducible equivalent FD set.
- **Diagrams:** original dependency set transformed one step at a time.
- **Hand traces:** reduce a set with three or four dependencies.
- **Common mistakes:** deleting an FD before checking whether the remaining set still implies it.

## Chapter 6 — Normal forms and decomposition

### DB6.1 — 1NF and 2NF [MUST]
- **Prerequisites:** DB5.1–DB5.3.
- **Beginner must-see:** 1NF values are atomic in the relational model; 2NF removes partial dependency of non-prime attributes on candidate-key parts.
- **Finer points:** composite key, prime attribute, non-prime attribute and no partial dependency for a single-attribute key.
- **GATE level:** decide if relation is in 1NF/2NF.
- **Diagrams:** set-valued cell and partial dependency arrow.
- **Hand traces:** decompose a relation with composite key AB and A→C.
- **Common mistakes:** assuming any composite key automatically violates 2NF.

### DB6.2 — 3NF and BCNF [MUST]
- **Prerequisites:** DB6.1 and attribute closure.
- **Beginner must-see:** 3NF allows a non-superkey determinant if RHS is prime; BCNF does not.
- **Finer points:** every FD must be checked, not only the one shown first.
- **GATE level:** classify relation and identify BCNF violation.
- **Diagrams:** determinant, candidate key and prime-attribute map.
- **Hand traces:** derive keys, prime attributes, then test each FD.
- **Common mistakes:** saying 3NF and BCNF are the same because every key determines all attributes.

### DB6.3 — Lossless join and dependency preservation [MUST]
- **Prerequisites:** DB6.2.
- **Beginner must-see:** lossless means joining pieces reconstructs exactly the original; dependency-preserving means FDs can be checked without joining.
- **Finer points:** binary decomposition test, chase/table method and 3NF/BCNF trade-off.
- **GATE level:** judge a decomposition and identify possible spurious tuples.
- **Diagrams:** original relation split and recombined.
- **Hand traces:** test a two-way decomposition and a multi-relation decomposition.
- **Common mistakes:** assuming a lossless decomposition must preserve every FD.

### DB6.4 — 3NF synthesis and BCNF decomposition [SHOULD]
- **Prerequisites:** DB5.4 and DB6.3.
- **Beginner must-see:** 3NF synthesis creates relations from a minimal cover; BCNF decomposition splits on violating FDs.
- **Finer points:** adding a key relation when needed and checking preservation.
- **GATE level:** determine which properties are guaranteed.
- **Diagrams:** decomposition tree.
- **Hand traces:** apply both algorithms to one relation.
- **Common mistakes:** expecting BCNF to always preserve dependencies.

### DB6.5 — Multivalued dependencies and higher normal forms [LATER]
- **Prerequisites:** DB6.1–DB6.3.
- **Beginner must-see:** independent multi-valued facts can create redundancy beyond FD problems.
- **Finer points:** MVD, 4NF and join dependency/5NF at overview level.
- **GATE level:** only if required by the chosen bank or extended course.
- **Diagrams:** independent multi-valued facts in one relation.
- **Hand traces:** split a relation with two independent multi-valued attributes.
- **Common mistakes:** confusing a multivalued attribute in an ER diagram with an MVD in a relation.

## Chapter 7 — File organization and indexing

### DB7.1 — Records, blocks and file organizations [MUST]
- **Prerequisites:** bytes, division and relational rows.
- **Beginner must-see:** disk I/O moves blocks; a file stores records in blocks.
- **Finer points:** record size, block size, blocking factor, spanned/unspanned records, heap/sorted/hash files.
- **GATE level:** calculate data blocks and compare scan efficiency.
- **Diagrams:** records packed into blocks and three file layouts.
- **Hand traces:** 25,000 records of 100 bytes in 1024-byte blocks.
- **Common mistakes:** rounding records-per-block upward.

### DB7.2 — Indexes: dense, sparse, primary, secondary [MUST]
- **Prerequisites:** DB7.1 and key concepts.
- **Beginner must-see:** index stores search-key values with pointers to data or blocks.
- **Finer points:** primary/clustering/secondary index, dense/sparse index, ordered file requirement.
- **GATE level:** count index entries and I/O operations; judge hash/B+ density.
- **Diagrams:** dense versus sparse index and index-to-data pointer.
- **Hand traces:** build a sparse primary index over data blocks.
- **Common mistakes:** assuming a sparse index can be used over arbitrary unordered data.

### DB7.3 — Multilevel indexes and I/O cost [MUST]
- **Prerequisites:** DB7.2 and logarithms.
- **Beginner must-see:** an index can itself need an index.
- **Finer points:** entries per block, number of index blocks, binary search block accesses and final data-block access.
- **GATE level:** calculate worst-case block I/Os.
- **Diagrams:** index levels from root to data.
- **Hand traces:** compute primary-index blocks and the number of accesses.
- **Common mistakes:** adding a data-block read when the question only asks to identify its address, or omitting it when the record must actually be fetched.

### DB7.4 — B-tree and B+ tree basics [MUST]
- **Prerequisites:** multiway search tree and DB7.1.
- **Beginner must-see:** a node stores multiple sorted keys and child pointers.
- **Finer points:** order/fanout, max keys, min occupancy, root exception, B-tree versus B+ tree, leaf links.
- **GATE level:** calculate order and identify index properties.
- **Diagrams:** B-tree and B+ tree nodes, internal and leaf pages.
- **Hand traces:** search a key and count page accesses.
- **Common mistakes:** confusing number of keys with number of child pointers.

### DB7.5 — B+ tree insertion and deletion [MUST]
- **Prerequisites:** DB7.4.
- **Beginner must-see:** overflow splits a node; the separator is copied/promoted as specified.
- **Finer points:** leaf split, internal split, propagation, root split, deletion redistribution/merge.
- **GATE level:** draw the tree after inserting/deleting one key.
- **Diagrams:** numbered frames after each split and parent update.
- **Hand traces:** one leaf split that propagates to parent; one root growth.
- **Common mistakes:** promoting the wrong key or forgetting the exact split convention in the question.

## Chapter 8 — Transactions and recovery

### DB8.1 — Transactions and ACID [MUST]
- **Prerequisites:** DB0.1 and SQL updates.
- **Beginner must-see:** transaction groups operations into one logical job.
- **Finer points:** read/write, commit/abort, atomicity, consistency, isolation and durability.
- **GATE level:** identify the ACID property violated by a scenario.
- **Diagrams:** bank transfer with failure at each step.
- **Hand traces:** debit/credit with a crash before and after commit.
- **Common mistakes:** confusing isolation with atomicity.

### DB8.2 — Schedules and conflict serializability [MUST]
- **Prerequisites:** transaction operations and graph basics.
- **Beginner must-see:** a schedule is one interleaving that preserves each transaction's own order.
- **Finer points:** conflicting read/write pairs, conflict equivalence, precedence graph and acyclicity.
- **GATE level:** decide conflict serializability and identify equivalent serial orders.
- **Diagrams:** timeline and precedence graph.
- **Hand traces:** build graph edge by edge for 2- and 3-transaction schedules.
- **Common mistakes:** adding an edge for read-read or for operations on different data items.

### DB8.3 — View serializability [SHOULD]
- **Prerequisites:** DB8.2.
- **Beginner must-see:** read-from relationships and final writes matter.
- **Finer points:** blind writes and a view-serializable schedule that is not conflict-serializable.
- **GATE level:** compare conflict and view serializability.
- **Diagrams:** read-from arrows and final-write marker.
- **Hand traces:** test a small blind-write schedule.
- **Common mistakes:** assuming every view-serializable schedule is conflict-serializable.

### DB8.4 — Recoverability and cascading rollback [MUST]
- **Prerequisites:** DB8.2.
- **Beginner must-see:** if T2 reads a value from T1, T2 must not commit before T1 commits in a recoverable schedule.
- **Finer points:** recoverable, cascadeless, strict schedules and rollback chains.
- **GATE level:** find all transactions to roll back after an abort.
- **Diagrams:** transaction timeline with dirty reads.
- **Hand traces:** T1 writes Y, T2 reads Y, T3 reads Y, then T1 aborts.
- **Common mistakes:** treating a read of an uncommitted write as harmless.

### DB8.5 — Logging, undo/redo and crash recovery [SHOULD]
- **Prerequisites:** DB8.1 and DB8.4.
- **Beginner must-see:** log records let the system reconstruct or reverse changes after a crash.
- **Finer points:** undo list, redo list, checkpoint and crash during recovery.
- **GATE level:** identify redo/undo actions and recovery properties.
- **Diagrams:** log timeline and recovery passes.
- **Hand traces:** recover a short log, then crash recovery again.
- **Common mistakes:** assuming a second crash makes recovery impossible.

## Chapter 9 — Concurrency control

### DB9.1 — Locks and compatibility [MUST]
- **Prerequisites:** transactions and read/write operations.
- **Beginner must-see:** shared lock is for reading; exclusive lock is for writing.
- **Finer points:** compatibility matrix, lock conversion and lock queues.
- **GATE level:** decide whether lock requests are compatible.
- **Diagrams:** S/X compatibility matrix and lock timeline.
- **Hand traces:** two readers, reader plus writer, two writers.
- **Common mistakes:** assuming two shared locks conflict.

### DB9.2 — Two-phase locking [MUST]
- **Prerequisites:** DB9.1.
- **Beginner must-see:** growing phase obtains locks; shrinking phase releases them.
- **Finer points:** conflict serializability, strict 2PL, rigorous 2PL and deadlock possibility.
- **GATE level:** identify valid 2PL traces and properties.
- **Diagrams:** growing/shrinking timeline.
- **Hand traces:** mark the lock point and first unlock.
- **Common mistakes:** acquiring a new lock after the first unlock.

### DB9.3 — Deadlocks and prevention [SHOULD]
- **Prerequisites:** locks and directed graphs.
- **Beginner must-see:** transactions can wait in a cycle.
- **Finer points:** wait-for graph, detection, rollback, wait-die and wound-wait.
- **GATE level:** identify deadlock-free strategy and starvation assumptions.
- **Diagrams:** wait-for cycle and age-order decision chart.
- **Hand traces:** decide which transaction waits or aborts based on timestamp.
- **Common mistakes:** confusing deadlock freedom with starvation freedom.

### DB9.4 — Timestamp ordering and Thomas Write Rule [SHOULD]
- **Prerequisites:** timestamps and read/write operations.
- **Beginner must-see:** a transaction's timestamp gives its logical order.
- **Finer points:** read_TS, write_TS, rejection rules and obsolete-write suppression.
- **GATE level:** check allowed reads/writes and view versus conflict serializability.
- **Diagrams:** per-item read/write timestamp table.
- **Hand traces:** apply each operation in schedule order.
- **Common mistakes:** aborting a transaction when Thomas Write Rule says to ignore an obsolete write.

---

# PART 6 — AUDIT OF ALL 72 SUPPLIED PYQs

**Labels used**
- **Key supported:** the supplied answer matches a direct re-solve from the visible text.
- **Key supported with caveat:** answer is correct under the standard or official intended interpretation; the lesson must state that interpretation.
- **Cannot verify — figure missing:** essential data is absent from the input.
- **FACT-DOUBT:** the transcription or wording is ambiguous/invalid and must be checked against the original paper.

The official GATE 2027 syllabus is the scope authority. The question audit below is a text-based re-solve; for missing diagrams, original paper figures must be restored before publishing a worked solution.

| # | PYQ ID | Revised lesson | Exact concept tested | Trap / finer point | Official key and transcription audit |
|---:|---|---|---|---|---|
| 1 | 2026_AN_Q15 | DB0.1 | Three-schema architecture mapping | Logical schema describes relations; physical schema concerns file organization/indexes; external schema is user views. | **C supported.** No apparent transcription issue. |
| 2 | 2026_AN_Q20 | DB8.2 | Conflict between two operations on same item | Read-read does not conflict; any pair involving a write can conflict when ordered differently. | **A supported.** No apparent transcription issue. |
| 3 | 2026_FN_Q30 | DB5.2 | FD inference rules | From P→R, augmentation gives PQ→R; from P→R and PQ→R one cannot infer Q→R. P→R and Q→S imply PQ→RS. | **C and D supported.** A and B are not always true. |
| 4 | 2026_FN_Q31 | DB6.3 | Dependency preservation of normal-form decompositions | A dependency-preserving 3NF decomposition is always possible; a dependency-preserving BCNF decomposition is not always possible. In the relational model, 1NF is the base relation form. | **A, B and C supported.** D is false. Explain that 3NF synthesis preserves dependencies; BCNF can lose them. |
| 5 | 2026_AN_Q42 | DB5.2 | Prove Union from Armstrong axioms | From X→Y, augment by X to get X→XY; from X→Z, augment by Y to get XY→YZ; transitivity gives X→YZ. | **D supported.** Augmentation and transitivity are sufficient; reflexivity is not needed in this proof. No apparent transcription issue. |
| 6 | 2026_FN_Q43 | DB3.2–DB3.4 | Translate TRC into relational algebra | Need join R.Q with S.X and project R.P. | **B supported.** No apparent transcription issue. |
| 7 | 2026_AN_Q46 | DB7.2 | Dense hash index and sparse B+ index | Hash indexes need direct search-key entries; ordered B+ tree over ordered data can be sparse in the stated indexing model. | **A supported.** State the assumption that the B+ index is on an ordered data file. |
| 8 | 2026_FN_Q65 | DB2.2 / DB5.3 | Count superkeys from two candidate keys | Supersets of AB: 4; supersets of AC: 4; overlap ABC and ABCD counted twice; total 4+4−2=6. | **6 supported.** No apparent transcription issue. |
| 9 | 2025_FN_Q15 | DB8.4 | Cascading rollback after dirty reads | T2 reads Y written by T1; T3 also reads Y written by T1; aborting T1 forces both readers to roll back. | **C supported.** No apparent transcription issue. |
| 10 | 2025_FN_Q21 | DB7.5 | B+ tree insertion and split | The existing tree figure is required to see where 23 enters, which node overflows and whether the root grows. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_21_1]`; do not independently certify B and D from text alone. |
| 11 | 2025_AN_Q27 | DB8.1 / DB9.1 | Lost update and isolation failure in bank transfers | Both transactions read the same old balance; one debit is lost while both credits occur. Total money is not conserved. | **B and C supported.** Consistency and isolation are violated; no evidence that atomicity or durability is necessarily violated. |
| 12 | 2025_FN_Q39 | DB3.4 | Tuple relational calculus with an existential team match | The output tuple must range over players; an existential team must match tid and tname='MI'. | **A supported.** No apparent transcription issue. |
| 13 | 2025_AN_Q46 | DB6.2 | Test 3NF using candidate keys and prime attributes | R1 has key AD; D→E has a non-superkey determinant and non-prime RHS. R2 has key C; A→D and A→B violate 3NF. | **C and D supported.** Both relations are not in 3NF. |
| 14 | 2025_FN_Q47 | DB6.2–DB6.3 | BCNF and lossless decomposition | name is a key for team; both projections keep name as key, and common attribute name determines the original relation. | **B and C supported.** A and D are false because the original team relation is already BCNF/3NF. |
| 15 | 2025_AN_Q53 | DB8.2 | Conflict serializability of supplied schedules | The exact read/write transaction definitions appear in the missing images; those are needed to form precedence edges for each option. | **Cannot verify — figures missing.** Restore `[IMAGE_Q_53_1]` and `[IMAGE_Q_53_2]`; do not independently confirm B. |
| 16 | 2025_AN_Q54 | DB4.2 | Equivalent SQL forms for testing enrolment in one course | EXISTS and COUNT>0 are valid; `SIZEOF` is not standard SQL; NATURAL JOIN works under the relation/schema assumptions. | **A, C and D supported with caveat.** For D, the question relies on relation/set semantics or uniqueness of (rollno,courseno); under SQL bag semantics duplicate Enrolled rows could duplicate names. State that assumption. |
| 17 | 2025_FN_Q55 | DB4.3 | MIN age after joining team/coach/members data | The instance tables are only in the missing figure. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_55_1]`; do not certify 26 without the data. |
| 18 | 2025_AN_Q57 | DB7.5 | B+ tree split propagation after inserting 23 | Leaf overflows, splits, separator copied up; parent overflows and splits; the leaf containing 25* ends up under a parent whose smallest key is 33 under the stated split convention. | **33 supported under the stated smallest-key-copy-up convention.** The supplied node path is enough to follow the intended split, but the original figure/tree context should still be restored before teaching. |
| 19 | 2024_AN_Q13 | DB8.1 | ACID durability | Once success is reported, committed effects must survive crash even if not yet copied to data pages. | **A supported.** No apparent transcription issue. |
| 20 | 2024_FN_Q24 | DB1.2 | Choose ER diagram matching four relationship statements | The four candidate ER diagrams are absent. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_24_1]`; cannot confirm option D from text alone. |
| 21 | 2024_AN_Q22 | DB1.3 | Weak entity participation in identifying relationship | Weak entity must participate totally in its identifying relationship; owner participation need not be total. | **A supported.** No apparent transcription issue. |
| 22 | 2024_FN_Q11 | DB7.4 | B+ tree occupancy exception | Root may have fewer than half-full occupancy; non-root nodes must satisfy the minimum. | **A supported.** No apparent transcription issue. |
| 23 | 2024_FN_Q25 | DB6.1 | 1NF properties | Multi-attribute keys are allowed; relational values are atomic, so a composite attribute is not stored as one indivisible attribute in 1NF. | **A and C supported.** Foreign keys and multiple candidate keys are allowed. |
| 24 | 2024_AN_Q16 | DB7.1 | I/O-efficient full scans | Heap and sorted files can be scanned sequentially; an unclustered index may require scattered record accesses. | **A and B supported.** No apparent transcription issue. |
| 25 | 2024_AN_Q31 | DB9.2 | Two-phase locking properties | 2PL guarantees conflict serializability; after first unlock no further lock may be acquired; deadlock can still occur. | **A, C and D supported.** No apparent transcription issue. |
| 26 | 2024_FN_Q35 | DB3.2 | Join, selection and tuple count | Both relation instances are in missing figures; values are needed to perform join and B<C. | **Cannot verify — figures missing.** Restore `[IMAGE_Q_35_1]` and `[IMAGE_Q_35_2]`; do not confirm 2 independently. |
| 27 | 2024_FN_Q44 | DB5.2 | FD decomposition, pseudotransitivity and transitivity | XY→ZW implies XY→Z; W→Y plus XY→Z allows XW→Z; X→Y and Y→Z gives X→Z. | **B, C and D supported.** A is false. |
| 28 | 2024_AN_Q59 | DB3.2 | Minimum Cartesian products to find cities with at least three residents | Need three renamed copies of Person; two Cartesian products form the triple product, then select equal city and distinct person IDs. | **2 supported.** No apparent transcription issue. |
| 29 | 2024_FN_Q45 | DB8.2 | Conflict-equivalent serial schedules | Conflicts on Y force T3 before T2; T1 touches only z, so it can be placed anywhere consistent with that order. | **B, C and D supported.** A has T2 before T3 and is not equivalent. |
| 30 | 2024_AN_Q39 | DB5.1 | Count useful FDs on four attributes | Each attribute can be in X, in Y or neither: 3⁴ possibilities; subtract cases with X empty or Y empty and add back double-subtracted case: 81−16−16+1=50. | **50 supported.** No apparent transcription issue. |
| 31 | 2023_FN_Q16 | DB2.1 | Degree/arity of a relation | Degree is number of attributes; number of tuples is cardinality. | **A supported.** No apparent transcription issue. |
| 32 | 2023_FN_Q61 | DB4.1 | SQL WHERE selection on table instance | Student table values are in the missing image. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_61]`; cannot confirm 2 rows. |
| 33 | 2023_FN_Q62 | DB7.2–DB7.3 | Primary index blocks and binary search I/O | Data records/block = floor(1024/100)=10; 25,000 records need 2,500 data blocks. Index entry =15+5=20 bytes; 51 entries/block; 2,500 entries need 50 index blocks; ceil(log₂50)=6 index-block accesses. | **6 supported for the task as worded: identify the candidate data block.** If asked to fetch the record itself, one additional data-block I/O would be needed. The missing figure should still be restored to preserve the full setup. |
| 34 | 2022_FN_Q14 | DB6.2 | Any two-attribute relation is BCNF | A non-trivial FD between the two attributes makes the determinant a key; trivial FDs do not violate BCNF. | **A supported.** No apparent transcription issue. |
| 35 | 2022_FN_Q25 | DB3.3 | Relational division and set-difference formulation of “owns all brands” | A uses division by all brands; B finds owners with no missing brand. C divides by owned brands, not all brands; D forms the wrong product/divisor relationship. | **A and B supported.** No apparent transcription issue. |
| 36 | 2022_FN_Q31 | DB5.3 | Count superkeys from FD-derived candidate key | AB⁺=ABCDE; A and B are not on any RHS so both are required; all supersets of AB are superkeys: 2³=8. | **8 supported.** No apparent transcription issue. |
| 37 | 2022_FN_Q39 | DB8.2 | Precedence graph and serial order | Conflicts give T1→T3, T1→T4, T3→T4 and T4→T2 (also T3→T2); unique compatible order is T1,T3,T4,T2. | **A supported.** No apparent transcription issue. |
| 38 | 2022_FN_Q56 | DB4.4 | SQL NOT EXISTS with EXCEPT: students registered for every D01 course | The instances for Student, Course, Dept and Register are absent. Also the pasted text says `NOT EXIST`; standard SQL spelling is `NOT EXISTS`. | **Cannot verify — figure missing. FACT-DOUBT:** correct `NOT EXIST` to `NOT EXISTS` only after checking the original paper; result 2 needs the data. |
| 39 | 2021_AN_Q16 | DB2.3 | Multiple foreign keys and self-referencing foreign key | A relation can have several FKs and an FK may reference the same relation. | **D supported.** Both statements are false. |
| 40 | 2021_FN_Q28 | DB8.5 | Recovery after a second crash during recovery | Without a checkpoint during recovery, the durable log is analysed again and the same undo/redo sets can be reconstructed. | **A supported under the stated recovery model.** No apparent transcription issue. |
| 41 | 2021_AN_Q26 | DB7.2–DB7.3 | Secondary dense index block count | Entry size=12+7=19 bytes; 4096-byte block holds floor(4096/19)=215 entries; ceil(150000/215)=698 index blocks. | **698 supported.** No apparent transcription issue. |
| 42 | 2021_FN_Q45 | DB3.1 / DB4.3 | Selectivity estimate for A>10 OR B=18 | P(A>10)=10/15=2/3; P(B=18)=1/20; independent intersection=1/30; union=41/60. ×1200=820. If estimating distinct possible (A,B) value pairs, there are 15×20=300, and (41/60)×300=205. | **Both 819–820 and 205 are accepted in the supplied answer range. Key supported with interpretation caveat.** 820 estimates qualifying tuples from 1,200 under selectivity; 205 estimates qualifying distinct value pairs under strict set-domain counting. Teach both interpretations rather than silently choosing one. |
| 43 | 2021_FN_Q53 | DB3.2 | Self-join and comparison of employee ages | For each employee, pair with another employee whose age is smaller; projection returns employees for whom at least one younger employee exists, i.e. everyone not at the minimum age. | **C supported.** No apparent transcription issue. |
| 44 | 2021_AN_Q45 | DB4.3 | Uncorrelated scalar subquery average | The inner AVG has no correlation to the outer row or department, so it is the average salary of the whole company. | **B supported.** No apparent transcription issue. |
| 45 | 2021_FN_Q47 | DB8.2 | Compare conflict serializability of two schedules | S1 has T2→T1 on x and T1→T2 on y, forming a cycle. S2 has only T2→T1. | **B supported.** No apparent transcription issue. |
| 46 | 2021_AN_Q34 | DB8.2 / DB8.4 | Conflict serializability and recoverability | Conflict graph is acyclic (T1→T2, T1→T3, T2→T3); T3 reads X written by T1, so T3 committing before T1 finishes violates recoverability. | **B supported.** No apparent transcription issue. |
| 47 | 2021_FN_Q40 | DB6.3 | Lossless versus lossy decomposition | D1 first joins PT with PTX where PT→PTX; then Q→Y and Y→ZW allow lossless joins. D2 has disjoint fragments {P,Q,S} and {T,X}, creating a Cartesian combination and loss. | **A supported.** No apparent transcription issue. |
| 48 | 2021_AN_Q28 | DB5.2 | Infer FDs from P→QR and RS→T | P→R and P→Q; therefore PS determines R,S and hence T; PS also determines Q. R alone does not determine S or T. | **A, C and D supported.** No apparent transcription issue. |
| 49 | 2020_FN_Q12 | DB4.3 | SQL subquery over Suppliers/Catalogue instances | Schema and data needed to evaluate supplier rows are missing in the figure. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_12]`; cannot independently confirm 4. |
| 50 | 2020_FN_Q13 | DB1.3 | Identifying relationship of a weak entity | The identifying relationship is shown by a double/bold diamond. | **A supported.** No apparent transcription issue. |
| 51 | 2020_FN_Q65 | DB6.2 | Relation in 3NF but not BCNF | A non-superkey determinant may determine a prime attribute under 3NF, while BCNF would reject that determinant. | **A supported.** No apparent transcription issue. |
| 52 | 2020_FN_Q45 | DB8.2 | Conflict-equivalent schedule | Original schedule and all four candidate schedules are embedded in missing figures. | **Cannot verify — figures missing.** Restore `[IMAGE_Q_45]` and `[IMAGE_Q_45_A]` through `[IMAGE_Q_45_D]`; cannot compare conflicts from the text alone. |
| 53 | 2020_FN_Q51 | DB7.4–DB7.5 | Minimum B+ tree disk accesses | Leaf entries ≈ floor(4096/(12+8))=204; around 4,902 leaf pages; internal fanout is about 205; next level has 24 pages; root→internal→leaf is 3 index-page reads, plus one data page = 4. | **4 supported under the conventional node layout and one data-block fetch.** Show the pointer/key capacity equation explicitly in the lesson. |
| 54 | 2019_FN_Q27 | DB8.3–DB9.2 | Strict 2PL and Thomas Write Rule | Strict 2PL produces conflict-serializable, recoverable schedules. Thomas Write Rule may allow view-serializable schedules that are not conflict-serializable. | **C supported.** No apparent transcription issue. |
| 55 | 2019_FN_Q20 | DB7.4 | B+ tree internal-node pointers | Internal nodes point to child nodes; leaf nodes contain data entries/record pointers and next-leaf links. | **B is the NOT-correct statement.** No apparent transcription issue. |
| 56 | 2019_FN_Q37 | DB6.2–DB6.3 | BCNF and dependency-preserving lossless decomposition | PR: R→P makes R a key, so BCNF. QRS: S→Q has non-superkey determinant and Q is prime, so 3NF but not BCNF. Intersection R determines PR, so join is lossless; all FDs are preserved across the components. | **C supported: statement II only.** No apparent transcription issue. |
| 57 | 2019_FN_Q41 | DB4.3 | SQL join/filter/group-by count | Student and Performance table instances are missing. Also the query selects `Student_name` and `SUM(Marks)` but only groups by Student_name; answer count depends on the rows and possible duplicate names. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_41]`; do not confirm 5 from the text. |
| 58 | 2019_FN_Q47 | DB3.2–DB3.3 | Relational algebra product, selection, projection and difference | The P, Q and R relation instances are in the missing figure; both projected sets are needed before taking the difference. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_47]`; cannot confirm 1. |
| 59 | 2018_FN_Q21 | DB1.2 | Many-to-one relationship and total participation | Every E1 entity participates and the relationship is many-to-one from E1 to E2, so each E1 maps to exactly one E2. | **A supported.** No apparent transcription issue. |
| 60 | 2018_FN_Q22 | DB4.2 | SQL outer joins and output superset | Full outer join retains matched rows and unmatched rows from both sides; it contains the information from the inner, left and right join results. | **D supported.** No apparent transcription issue. |
| 61 | 2018_FN_Q51 | DB3.2 | Left outer join equivalence after selection | Because r.B is a non-NULL FK to s.B, r⋈s has a match for every r row. But `r LOJ (σ B<5(s))` preserves r rows whose B≥5 with NULL-extended s columns; it is not equivalent. | **C supported.** No apparent transcription issue. |
| 62 | 2018_FN_Q52 | DB6.2 | 3NF but not BCNF | Schema II has candidate keys (rollno,courseid) and (email,courseid); email→rollno has non-superkey determinant but prime RHS, satisfying 3NF but violating BCNF. | **B supported.** No apparent transcription issue. |
| 63 | 2017_FN_Q17 | DB5.4 | Minimal cover | From V→W and VW→X, V→X follows; Y→X is implied by Y→V→X and is redundant. | **A supported.** No apparent transcription issue. |
| 64 | 2017_AN_Q22 | DB1.4 | When an ER relationship can be merged into entity A | For many-to-one from A to B with total A participation, B's key can be placed in A and the relationship table can be avoided. | **C supported.** No apparent transcription issue. |
| 65 | 2017_AN_Q26 | DB2.3 | Referential actions with cascade/set-null across two tables | The current table instances are shown only in the missing figure; cascading deletes depend on exact key values. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_26]`; cannot confirm zero additional deletions. |
| 66 | 2017_FN_Q31 | DB4.3 | Average of department employee counts | The table is included in the source image in the original paper; group counts are AA=4, AB=3, AC=3, AD=2, AE=1; average=(4+3+3+2+1)/5=2.6. | **2.6 supported under the intended derived-table interpretation. FACT-DOUBT:** the pasted SQL is not standard SQL as written: `EC(DeptName, Num)` is placed after the SELECT expression as though it were a derived-table alias, while the outer `FROM EC` is not defined. Preserve the paper's intended notation but add a corrected equivalent SQL form and label the original syntax. |
| 67 | 2017_FN_Q39 | DB3.4 | Safe tuple relational calculus expressions | All three are keyed safe under the paper's intended range-restriction/active-domain convention because EmpName is bound to EMP and DeptId is tested against the finite DEPT relation; the question's definition of safety should be made explicit. | **D supported as the official key, with a teaching caveat.** A strict syntactic range-restriction reading can challenge I/II because `t[DeptId]` is only compared by inequality; explain the intended finite active-domain convention instead of hiding the ambiguity. |
| 68 | 2017_FN_Q51 | DB9.3 | Wound-wait deadlock prevention and starvation | If requester T2 is older than lock-holder T1, T1 is wounded; otherwise requester waits. Same timestamp on restart prevents repeated loss to younger transactions. | **A supported under stated eventual-termination assumption.** No apparent transcription issue. |
| 69 | 2017_AN_Q62 | DB8.2 | Count conflict-serializable interleavings | There are C(8,4)=70 legal interleavings preserving each transaction's internal order. Only the shared Y operations can conflict; 16 interleavings create edges in both directions, leaving 54 conflict-serializable schedules. | **54 supported.** No apparent transcription issue. |
| 70 | 2017_FN_Q38 | DB3.3 | Relational division on CourseName | CR instance is in the missing figure; division returns students/names associated with every course in T1. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_38]`; cannot confirm 4 rows. |
| 71 | 2017_AN_Q55 | DB4.4 | SQL `> ALL` and `> ANY` | The top_scorer table is in the missing figure; the answer depends on its goal values by country. | **Cannot verify — figure missing.** Restore `[IMAGE_Q_55]`; cannot confirm 7 tuples. |
| 72 | 2017_AN_Q54 | DB7.4 | Maximum order of B+ tree | For order p: p block pointers + (p−1) keys; 2p+8(p−1)≤512 ⇒10p≤520 ⇒ p≤52. | **52 supported.** This assumes the usual internal-node layout described by the question. |

## 6.1 Missing figures and tables — 16 questions

These cannot be fully checked from the text supplied:

1. **2025_FN_Q21** — initial B+ tree structure.
2. **2025_AN_Q53** — transaction definitions/schedules supplied as figures.
3. **2025_FN_Q55** — player/team/coach/members table instance.
4. **2024_FN_Q24** — four ER diagram choices.
5. **2024_FN_Q35** — relation instances R and S.
6. **2023_FN_Q61** — Student table instance.
7. **2023_FN_Q62** — indexing layout illustration.
8. **2022_FN_Q56** — Student/Dept/Course/Register instances.
9. **2020_FN_Q12** — Suppliers/Catalogue schema and data.
10. **2020_FN_Q45** — original schedule and the four candidate schedules.
11. **2019_FN_Q41** — Student and Performance instances.
12. **2019_FN_Q47** — P, Q and R relation instances.
13. **2017_AN_Q26** — T1 and T2 instances.
14. **2017_FN_Q31** — EMP instance and original SQL rendering (the text version is visible, but the figure should be restored).
15. **2017_FN_Q38** — CR instance.
16. **2017_AN_Q55** — top_scorer instance.

The original input says “Figures are not shown”. That is a real release defect for a PYQ bank. A student cannot solve a table/diagram question from an answer key alone.

## 6.2 Facts and wording that need explicit correction or qualification

- **2021_FN_Q45 — selectivity result 819–820 or 205:** both results have a defensible interpretation. Selectivity is 41/60. Applying it to 1,200 tuples gives 820; applying it to 300 possible distinct (A,B) value pairs gives 205. The question/key accepts both. Teach both interpretations and state whether tuple multiplicities or distinct value pairs are being estimated. [GateOverflow discussion and derivation](https://gateoverflow.in/357428/gate-cse-2021-set-1-question-23).
- **2017_FN_Q31 — SQL syntax:** the pasted query defines `EC(DeptName, Num)` in a position that is not standard SQL derived-table alias syntax, while `FROM EC` refers to a relation not defined outside. The intended calculation is clear: department counts are 4, 3, 3, 2, 1; average 2.6. Add a valid equivalent query in the book rather than pretending the printed syntax is portable SQL. [Question text and intended derivation](https://questions.examside.com/past-years/gate/question/pconsider-a-database-that-has-the-relation-schema-emp-emp-gate-cse-database-management-system-33qx1fppwfzfa0pv).
- **2017_FN_Q39 — safe TRC:** preserve official answer D, but add a note explaining the intended active-domain/range-restriction interpretation. A student should not be told that a free tuple attribute can range over arbitrary values without qualification. [Official GATE 2017 master paper, question and key](https://gate.iitk.ac.in/GATE2023/doc/papers/2017/cs_2017.pdf).
- **2025_AN_Q54 — NATURAL JOIN:** the marked D is valid in relational/set semantics and under the implied uniqueness of one enrolment row per student/course. If the physical SQL table permits duplicate rows for the same rollno/courseno, SQL bag semantics can duplicate a name. The lesson should state the assumption.
- **2023_FN_Q62 — I/O count:** six accesses are the binary-search index-block accesses needed to identify a data block. If the operation were “read the record”, one extra data-block access would be counted. The question wording asks to identify the candidate data block.
- **2025_AN_Q57 — B+ insertion:** keep the exact convention that the smallest key in a newly created leaf is copied to the parent. Different textbooks may describe separator handling differently; the worked trace must use the convention in this question.
- **2022_FN_Q56 — `NOT EXIST`:** the supplied transcription uses `NOT EXIST`; standard SQL keyword is `NOT EXISTS`. Check the original source before silently editing.

---

# PART 7 — THREE NEW QUESTION IDEAS FOR EVERY LESSON

These are newly suggested practice questions, not claims about past GATE papers. Each lesson gets one MCQ, one MSQ and one NAT idea.

| Lesson | MCQ idea | MSQ idea | NAT idea |
|---|---|---|---|
| DB0.1 | Identify which problem is solved by a DBMS rather than a separate file. | Select benefits of central constraints and shared data. | Count how many copies of one student record need an update in a badly duplicated file system. |
| DB0.2 | Identify relation degree versus cardinality. | Select valid subsets and Cartesian products. | Find the size of R×S for two small relations. |
| DB1.1 | Identify a derived versus multivalued attribute. | Select valid key attributes in an ER model. | Count attributes in a composite-key entity. |
| DB1.2 | Choose the correct ER cardinality for an English statement. | Select all relationship diagrams satisfying total/partial participation. | Count maximum relationships in a 1:N example with given entity counts. |
| DB1.3 | Identify the identifying relationship symbol. | Select statements that must hold for a weak entity. | Find the full key length when owner key and partial key are given. |
| DB1.4 | Decide where the foreign key goes for a 1:N relationship. | Select ER mappings that need a separate relation. | Count relations created from a small ER diagram. |
| DB2.1 | Distinguish relation schema and relation instance. | Select statements true of degree/cardinality/set semantics. | Count degree and cardinality of a supplied instance. |
| DB2.2 | Identify a candidate key from closures. | Select all superkeys of a relation. | Count superkeys given three candidate keys with overlaps. |
| DB2.3 | Determine the effect of ON DELETE CASCADE. | Select all legal FK designs, including self-references. | Count rows deleted after a chain of FK actions. |
| DB2.4 | Choose the result of `NULL = 5`. | Select expressions that can return UNKNOWN. | Count rows returned by a WHERE predicate containing NULL. |
| DB3.1 | Choose the result of selection followed by projection. | Select equivalent expressions under union compatibility. | Count tuples after projection duplicate removal. |
| DB3.2 | Identify a natural join's join attributes. | Select correct outer-join statements. | Count rows in a 3×4 join instance. |
| DB3.3 | Choose the correct divisor for an “all” query. | Select equivalent division and difference expressions. | Count students who completed every required course in a new sample. |
| DB3.4 | Identify free and bound tuple variables. | Select safe TRC expressions under a stated active-domain rule. | Count output tuples for a small quantified query. |
| DB4.1 | Identify which SQL statement is DDL. | Select all valid constraints on a schema. | Count rows left by a SELECT WHERE condition. |
| DB4.2 | Choose the correct correlated EXISTS query. | Select queries equivalent to a join under stated keys. | Count matching rows after a three-table join. |
| DB4.3 | Distinguish WHERE from HAVING. | Select aggregate results when one column contains NULL. | Compute AVG of grouped department counts. |
| DB4.4 | Evaluate `x > ALL(subquery)` for a finite list. | Select correct NOT EXISTS/NOT IN statements with NULL caveats. | Count rows satisfying ANY and ALL conditions in a supplied table. |
| DB5.1 | Identify a functional dependency from sample tuples. | Select trivial and non-trivial FDs. | Count violations of X→Y in a small relation instance. |
| DB5.2 | Identify which Armstrong axiom applies. | Select all FDs derivable from a given set. | Derive the closure of X by applying FDs. |
| DB5.3 | Identify a candidate key from attribute closure. | Select every minimal key and superkey. | Count superkeys for a five-attribute schema with two candidate keys. |
| DB5.4 | Identify an extraneous attribute on an FD left side. | Select all equivalent minimal covers. | Find number of dependencies left after minimising a given set. |
| DB6.1 | Identify a 2NF violation. | Select all relations in 1NF/2NF. | Find minimum decomposed relations after one partial dependency. |
| DB6.2 | Choose if a relation is 3NF but not BCNF. | Select all FD violations of BCNF. | Count prime attributes after finding candidate keys. |
| DB6.3 | Identify whether a decomposition is lossless. | Select decompositions that preserve dependencies. | Find number of spurious tuples after a lossy split. |
| DB6.4 | Choose the next step of 3NF synthesis. | Select guarantees made by 3NF and BCNF decomposition. | Count relations produced from a minimal cover. |
| DB6.5 | Identify an MVD. | Select 4NF decompositions. | Count tuples after decomposing two independent multivalued facts. |
| DB7.1 | Choose the file organisation best for a full scan. | Select effects of record blocking and file order. | Calculate number of blocks for a new record/file size. |
| DB7.2 | Identify a dense versus sparse index. | Select index types suitable for equality and range searches. | Calculate number of index entries for a secondary index. |
| DB7.3 | Choose the number of index block accesses. | Select correct I/O count under “locate” versus “fetch” wording. | Calculate index levels for a supplied fanout and record count. |
| DB7.4 | Identify where data entries live in a B+ tree. | Select valid occupancy/order statements. | Calculate maximum order from new key and pointer sizes. |
| DB7.5 | Choose the node that splits after insertion. | Select all split/redistribution consequences. | Find smallest separator copied to a parent after two cascading splits. |
| DB8.1 | Identify which ACID property is threatened. | Select true properties of a transaction after crash. | Count how many account updates must be undone after abort. |
| DB8.2 | Choose the precedence graph for a schedule. | Select all conflict-equivalent serial orders. | Count conflict-serializable interleavings for a two-transaction schedule. |
| DB8.3 | Identify a blind-write schedule that is view but not conflict serializable. | Select read-from/final-writer equivalences. | Find number of reads-from relationships in a given schedule. |
| DB8.4 | Choose which transactions must roll back after an abort. | Select recoverable/cascadeless/strict schedules. | Count dependent transactions in a dirty-read chain. |
| DB8.5 | Identify the undo and redo set after a crash. | Select correct recovery actions after a second crash. | Count log records revisited during a simplified recovery pass. |
| DB9.1 | Determine whether S/S, S/X or X/X lock requests conflict. | Select compatible lock combinations. | Count lock waits in a short request sequence. |
| DB9.2 | Identify whether a sequence obeys 2PL. | Select true properties of strict and rigorous 2PL. | Find the lock point of a transaction. |
| DB9.3 | Choose whether wait-for graph contains a deadlock. | Select correct wait-die/wound-wait actions. | Count aborts before a system becomes deadlock-free under a fixed age order. |
| DB9.4 | Decide whether a read/write passes timestamp ordering. | Select operations ignored by Thomas Write Rule. | Compute final read_TS/write_TS after a sequence. |

---

# PART 8 — WHAT IS MISSING FROM THE SUBJECT

The headline syllabus is correct. The missing work is the finer content and supporting methods needed to answer its broad terms.

1. **Database foundation:** DBMS purpose, three-schema architecture, logical/physical data independence, relation schema versus instance, domains, tuples, degree and cardinality.
2. **ER modelling:** attribute classes, composite keys, relationship degree, cardinality, participation, weak entities, identifying relationships and ER-to-relational mapping.
3. **Relational model:** candidate/super/primary keys, alternate keys, composite keys, referential integrity, entity integrity, multiple/self-referencing foreign keys and referential actions.
4. **Relational algebra:** selection, projection, union, difference, product, rename, theta/equi/natural joins, outer joins, division, duplicate removal and equivalence.
5. **Tuple calculus:** tuple variables, free/bound variables, quantifiers, safe expressions and active-domain restrictions.
6. **SQL:** DDL/DML, data types, constraints, joins, outer joins, correlated subqueries, EXISTS/NOT EXISTS, IN/NOT IN, ANY/ALL, grouping, HAVING, aggregates, NULL, set operations and bag semantics.
7. **Query evaluation:** selectivity estimates, independence/uniformity assumptions, inclusion-exclusion and intermediate result sizes.
8. **Functional dependencies:** trivial/non-trivial FD, Armstrong axioms, derived rules, attribute closure, candidate keys, superkey counting and minimal cover.
9. **Normalisation:** 1NF, 2NF, 3NF, BCNF, prime attributes, partial/transitive dependencies, lossless join, dependency preservation, 3NF synthesis and BCNF decomposition.
10. **Higher normal forms:** MVD/4NF and join dependencies/5NF can be kept as short enrichment if the project wants comprehensive DBMS coverage; their priority for this GATE target is not sure.
11. **File organisation:** heap, sorted and hashed files, record/block layout, blocking factor and scan/search costs.
12. **Indexing:** primary/secondary/clustering, dense/sparse, multilevel, index I/O calculation, B-tree/B+ tree structure, order/fanout, insertion split, deletion redistribution and merge.
13. **Transactions:** ACID, serial and serializable schedules, conflict equivalence, precedence graphs, view serializability and blind writes.
14. **Recoverability:** recoverable, cascadeless and strict schedules, cascading rollback, logs, undo/redo, checkpoints and crash during recovery.
15. **Concurrency control:** S/X locks, lock compatibility, 2PL, strict/rigorous 2PL, deadlock detection, wait-for graph, timestamp ordering, Thomas Write Rule, wait-die and wound-wait.
16. **Question-bank completeness:** restore the sixteen missing figures, add exact source-paper references, and include independent step-by-step solutions for all 72 questions.
17. **Project-specific practice:** the 30 Forge questions are not attached to this input, so their originality, coverage and correctness cannot be checked here.

---

# PART 9 — WEIGHTS AND FINAL DECISION

## 9.1 Revised chapter weights

These are study priorities, not a prediction of exact marks in GATE 2027.

| Revised chapter | Weight | Reason |
|---|---|---|
| Foundations / relational model | **Foundation** | Every later chapter uses relation, tuple, attribute, sets and keys. |
| ER model | **Medium** | Direct syllabus line; the supplied bank has 5 questions / 5 marks in this 15-paper sample. |
| Relational algebra and tuple calculus | **High** | Direct syllabus line; the supplied combined bucket has 13 questions / 21 marks, including division, joins and TRC. |
| SQL | **High** | Direct syllabus line; 10 questions / 17 marks in the supplied sample; lots of row-by-row query reasoning. |
| Functional dependencies | **High** | Directly supports keys and normal forms; 10 integrity/FD questions / 15 marks in the supplied buckets. |
| Normal forms and decomposition | **High** | Nine questions / 15 marks; requires careful key/FD reasoning. |
| File organisation and indexing | **High** | Ten questions / 15 marks; numerical block and B+ tree traces need practice. |
| Transactions and recovery | **High** | Part of the explicit transactions line and needed to reason about aborts/recoverability. |
| Concurrency control | **High** | The combined transactions/concurrency bucket has 15 questions / 23 marks; precedence graphs and lock protocols are central. |

## 9.2 Does the bank-derived weight look fair?

The supplied summary is internally consistent:

- Questions: 15 + 13 + 10 + 10 + 9 + 10 + 5 = **72**.
- Marks: 23 + 21 + 17 + 15 + 15 + 15 + 5 = **111**.
- 111 / 1500 = **7.4%**.
- 111 / 15 papers = **7.4 marks per paper**.

But the topic buckets still need care:
- “Transactions, Concurrency Control, Conflict Serializability” combines transaction properties, recovery, schedule theory and lock/timestamp protocols.
- “Relational Models, Relational Algebra, Tuple Calculus” combines three different skill sets.
- “Integrity Constraints & Functional Dependencies” and “Normalisation Schemes” overlap because normalisation depends on FDs and keys.
- The bank's “Easy/Medium/Hard” categories are subjective unless the author records the rubric.
- “Years asked (of 10)” should state whether it counts calendar years or sessions/papers.
- The 72 questions are said to come from 15 CS papers, but the input does not list those papers or prove that all qualifying questions were included.

**Verdict:** the topic statistics are useful as an inventory of this supplied bank, but they should not determine lesson length. A topic with fewer PYQs can still need substantial teaching because it is a prerequisite for several other topics.

## 9.3 Release decision

**Approve:** the five syllabus headings and the eight broad chapter areas.

**Approve only after revision:** the detailed lesson map in Part 5, the PYQ source table and the diagrams.

**Do not approve yet:** bulk-writing all chapters, publishing the book, or charging ₹149.

### Six-lesson pilot

Write and test these six lessons first:

1. **DB1.2 — Relationships, cardinality and participation.** Tests whether the book can explain ER diagrams with clear pictures.
2. **DB3.2 — Cartesian product and joins.** Tests whether a student can follow intermediate tables.
3. **DB4.2 — Joins and subqueries.** Tests whether SQL is taught as row-by-row logic rather than syntax memorisation.
4. **DB5.3 — Attribute closure, candidate keys and superkeys.** Tests a core abstract calculation.
5. **DB6.2 — 3NF and BCNF.** Tests whether the book can explain the prime-attribute exception correctly.
6. **DB7.5 — B+ tree insertion and deletion.** Tests step-by-step structural diagrams.

### Pilot acceptance criteria

- Five genuinely weak students read the lesson without a teacher explaining missing steps.
- At least four of five can complete the basic learning objective without help.
- Every new word is explained before it is used in a solution.
- Every RA/SQL query shows intermediate tables.
- Every FD/normalisation solution shows closures, keys, prime attributes and each FD check.
- Every B+ tree operation is shown in separate frames using the question's exact capacity and separator convention.
- Every transaction schedule has a timeline and precedence/recovery graph where needed.
- Every numeric answer is independently reproduced.
- When two readers get stuck at the same line, rewrite that line rather than adding a shortcut note.
- Only after the pilot passes should the remaining lessons be written in bulk.

---

# CLAUDE MASTER-PROMPT PATCH — DATABASES

Use this as the Databases-specific addition to the universal master prompt.

```text
ROLE AND READER
Write a beginner-first GATE CS 2027 Databases textbook for a repeat aspirant
who has forgotten the subject. Assume the reader knows basic arithmetic and
can read simple tables, but does not remember DBMS vocabulary.

SYLLABUS AUTHORITY
Use the official GATE 2027 Databases wording:
- ER-model.
- Relational model: relational algebra, tuple calculus, SQL.
- Integrity constraints, normal forms.
- File organization, indexing (e.g. B and B+ trees).
- Transactions and concurrency control.

TEACHING RULES
1. Explain entity, relation, tuple, attribute, domain, key and schema before
   using them in a question.
2. Always distinguish relation set semantics from SQL bag semantics.
3. Explain NULL and UNKNOWN before advanced SQL conditions.
4. For every ER model, draw the cardinality and participation constraints.
5. For relational algebra, show every intermediate relation after each operator.
6. For tuple calculus, label bound/free variables and explain each quantifier.
7. For SQL, show the sample database, the rows after each join/filter/group step,
   and the final result. State assumptions about keys and duplicates.
8. For FDs, show attribute closure one pass at a time; never guess a candidate key.
9. For normal forms, find every candidate key first, then prime attributes, then
   test each FD. Keep 3NF and BCNF definitions side by side.
10. Treat lossless join and dependency preservation as two separate properties.
11. For file/index calculations, show bytes per record/entry, blocking factor,
    number of blocks and exact I/O count.
12. For B+ trees, show each insertion/deletion frame and follow the question's
    stated split, minimum occupancy and separator-copy convention.
13. For transaction schedules, mark read/write conflicts, draw precedence graphs,
    and show the exact read-from relation for recoverability questions.
14. For locks, show S/X compatibility and the growing/shrinking phases of 2PL.
15. For deadlock prevention, state the timestamp ordering and who waits or aborts.
16. Do not claim a topic is frequent unless the verified bank supports the claim.

MANDATORY LESSON STRUCTURE
Use the universal 12-station ladder: why, glossary, see it, build it, hand traces,
exact rules, finer points, GATE patterns, mistakes, valid shortcuts, practice ladder,
recap.

DIAGRAM RULES
Use ER diagrams, relation instances, RA intermediate tables, SQL evaluation tables,
FD arrows, attribute-closure traces, normalisation decomposition trees, disk blocks,
dense/sparse indexes, B/B+ tree frames, transaction timelines, precedence graphs,
lock compatibility matrices, wait-for graphs and timestamp tables.

PYQ RULES
- Keep the exact question ID and source-paper reference.
- Restore every missing figure/table before claiming the question is ready.
- Re-solve every answer and preserve the official NAT range.
- State every assumption about set/bag semantics, NULL, duplicate rows, block I/O,
  B+ tree fanout and transaction schedule.
- Mark uncertain/transcribed SQL syntax as NEEDS-SOURCE-CHECK.
- Do not silently repair a question. Show original and corrected/standard form.

RELEASE GATE
Do not write all eight chapters in one batch.
Write the six pilot lessons in the review, test them with weak learners,
revise them, then write the remaining lessons using the approved style.
```

---

# SOURCES AND VERIFICATION NOTES

1. **Official GATE 2027 syllabus page — IIT Madras:**  
   https://gate2027.iitm.ac.in/exam_papers_and_syllabus  
   The page states that GATE 2027 syllabi have been revised and links the updated paper syllabi. [Official page](https://gate2027.iitm.ac.in/exam_papers_and_syllabus).

2. **Official GATE 2027 CS syllabus PDF — IIT Madras, Section 9: Databases:**  
   https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf  
   Confirms the five supplied DBMS syllabus bullets. [Official CS syllabus](https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf).

3. **IIT Madras press release, 20 July 2026:**  
   https://www.iitm.ac.in/happenings/press-releases-and-coverages/iit-madras-announces-dates-syllabus-revision-new-paper-introduction  
   Confirms IIT Madras as organising institute and the GATE 2027 update. [IIT Madras release](https://www.iitm.ac.in/happenings/press-releases-and-coverages/iit-madras-announces-dates-syllabus-revision-new-paper-introduction).

4. **GATE 2021 relational-algebra selectivity question discussion:**  
   https://gateoverflow.in/357428/gate-cse-2021-set-1-question-23  
   Shows the two accepted counting interpretations, 820 based on 1,200 tuples and 205 based on 300 possible distinct value pairs. This is a community explanation, not the syllabus authority. [Question discussion](https://gateoverflow.in/357428/gate-cse-2021-set-1-question-23).

5. **GATE 2017 official master question paper — IIT Kanpur archive:**  
   https://gate.iitk.ac.in/GATE2023/doc/papers/2017/cs_2017.pdf  
   Includes the TRC safe-query question (paper question 41), with the answer marker. [Official paper PDF](https://gate.iitk.ac.in/GATE2023/doc/papers/2017/cs_2017.pdf).

6. **GATE 2017 SQL department-count question transcription and solution:**  
   https://questions.examside.com/past-years/gate/question/pconsider-a-database-that-has-the-relation-schema-emp-emp-gate-cse-database-management-system-33qx1fppwfzfa0pv  
   Useful for the intended group counts (4, 3, 3, 2, 1) and answer 2.6; the printed alias syntax should still be treated carefully. [Secondary explanation](https://questions.examside.com/past-years/gate/question/pconsider-a-database-that-has-the-relation-schema-emp-emp-gate-cse-database-management-system-33qx1fppwfzfa0pv).

---

## Final student verdict

I would not pay ₹149 for this v0. The five syllabus lines are correct and the eight chapter names are a reasonable start, but they do not show me how I will learn the actual subject.

I need to see rows being joined, closures growing, candidate keys being proved, decompositions being checked, blocks being counted, B+ tree nodes splitting, and transactions waiting or rolling back. I also need all sixteen missing figures restored and the SQL/relational-algebra assumptions made clear.

**Fix the lesson sequence, restore the figures, and test six lessons on weak students before writing the rest.**
