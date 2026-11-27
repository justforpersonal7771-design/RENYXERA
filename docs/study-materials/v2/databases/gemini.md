## PART 1. FEELINGS

1. Looking at Part B made me feel hopeful at first because Databases has 8 well-ordered chapters and is worth ~7.4% of the paper (`21` Easy Qs in the bank — way kinder than Algorithms!).
2. Then I noticed **there is no Chapter 0** explaining why we even throw away Excel/text files for a DBMS, or what **3-Schema Architecture (External / Logical / Physical)** and **Data Independence** mean — and `2026_AN_Q15` tests that exact thing!
3. When I tried reading Part C, I got hit immediately by weird math notation: `∀v ∈ DEPT`, `Π_P (R ⋈ S)`, `R ÷ T_1`, `X^+`, `(AB)^+`, conflict graphs, `2PL`, `B+ tree split [k1, k2)`, and `1024 B` block-aligned records — none of which Part B's `"3 topics ready"` labels explain!
4. Worse, **16 out of 72 PYQs** in Part C have `[IMAGE_...]` missing so I can't see the SQL tables, ER diagrams, or B+ trees!
5. Even worse, `2017_FN_Q39` marks **ALL 3 Tuple Calculus queries safe (`D`)** when `t[DeptId]` in `I` and `II` isn't even bound (`u[DeptId]` missing!) — without a warning note, a student learning textbook safety rules will think they forgot everything!
6. And look at SQL syntax errors in Part C (`WHERE NOT EXIST` in `2022_FN_Q56` and `FROM EC` in `2017_FN_Q31`) plus dual tolerance keys (`819 to 820 OR 205` in `2021_FN_Q45`) with zero explanation!
7. Part B also splits Relational Model, Relational Algebra/TRC, SQL, FDs, Normalization, Indexing, Transactions, and Concurrency without study hours or `[MUST]` / `[LATER]` priority guidance for my 100 days left.
8. **Would I pay ₹149 for this right now? NO — not while it is just an 8-line stub missing Chapter 0 and hiding 16 PYQ images.**
9. Why? Databases is the easiest high-scoring subject to learn from zero if someone draws tables, ER-to-table arrows, FD closures, B+ tree splits, and conflict graphs step-by-step — right now `Part B` only has `"3 topics ready"` placeholders.
10. Add Chapter 0 for 3-schema/data independence, restore the 16 missing PYQ tables/diagrams, flag the `2017_FN_Q39` official-key quirk, and map out every lesson visually — then I will happily pay ₹149.

---

## PART 2. GAP TABLE

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 1 | `Part B.2` (Missing Ch 00) | Jumps directly into `01 ER model` without introducing **what a DBMS is vs flat files**, **3-Schema Architecture (`External / Logical / Physical`)**, and **Logical vs Physical Data Independence** (`2026_AN_Q15`!). | MISSING-PREREQUISITE | Add **Chapter 00: DBMS Foundations & 3-Schema Architecture** before Ch 01. | HIGH |
| 2 | `Part B.2` (Whole outline) | Only shows `"2 topics ready"`..`"4 topics ready"` with zero subtopic names, finer points, hand traces, or diagrams. | STEP-SKIPPED | Replace this v0 stub with the complete lesson-by-lesson plan (Part 5). | HIGH |
| 3 | `Part B.2` & `Part B.3` (100-day plan) | No reading hours, no `[MUST]` / `[SHOULD]` / `[LATER]` priority tags, and no advice on which topics yield guaranteed marks (`SQL, Normalization, Concurrency, Indexing`) vs low-weight (`ER Model = 5 marks in 15 papers`). | TOO-LONG-BORING | Tag every lesson with time estimate and priority for a 100-day dropper. | HIGH |
| 4 | `Ch 01 ER Model` (Symbols & Notation) | Doesn't introduce all ER shapes first: **Entity (Rectangle)**, **Weak Entity (Double Rectangle)**, **Attribute types (Oval, Double-oval multivalued, Dashed derived, Underlined key, Dashed-underlined discriminator)**, **Relationship (Diamond)**, **Identifying Relationship (Double Diamond, `2020_FN_Q13`)**. | NEEDS-DIAGRAM | Draw a single 1-page ER Symbol Cheat Sheet (`2020_FN_Q13`). | HIGH |
| 5 | `Ch 01 ER Model` (Participation & Cardinality Ratios) | Beginners constantly mix up **Total vs Partial Participation** (double line vs single line) and **1:1, 1:N, M:1, M:N** (`2018_FN_Q21`, `2024_AN_Q22`), AND **Min-Max `(min, max)` notation**! | UNEXPLAINED-WORD | Draw concrete arrows between 4 Student dots and 2 Dept dots showing exact `(min, max)`, Total vs Partial, and `|E1| > |E2|` (`2018_FN_Q21`). | HIGH |
| 6 | `Ch 01 ER Model` (Weak Entity Total Participation Rule) | Doesn't explain WHY a weak entity MUST have **total participation** in its identifying relationship (`2024_AN_Q22`: cannot exist without owner!) while the owner can have partial participation! | MISSING-GATE-CONCEPT | Draw `Employee -> Dependent` showing why every Dependent needs an Employee (total) while an Employee need not have Dependents (partial). | HIGH |
| 7 | `Ch 01 ER Model` (ER-to-Relational Table Reduction & Minimum Tables!) | Misses the core GATE skill of turning an ER diagram into **minimum relational tables**: when can Relationship `R` merge into Entity `A` (`Many-to-One` from `A` + **Total participation of `A`**, `2017_AN_Q22`!), `1:1`, `M:N` (needs 3rd table!), Multivalued attribute (separate table!), and Generalization/ISA! | MISSING-GATE-CONCEPT | Trace ER-to-Table conversion across `1:1`, `1:N`, `M:1` (total vs partial `2017_AN_Q22`), `M:N`, Weak Entity, and ISA hierarchies! | HIGH |
| 8 | `Ch 02 Relational Model` (Vocabulary: Schema, Instance, Degree, Cardinality, Domain) | Doesn't define **Relation vs Table**, **Tuple**, **Attribute**, **Domain**, **Degree/Arity (`# of columns`, `2023_FN_Q16`)**, **Cardinality (`# of rows`)**, **NULL (`unknown` vs `0`)**! | UNEXPLAINED-WORD | Draw one sample table labelling Schema, Instance, Tuple, Attribute, Degree, and Cardinality (`2023_FN_Q16`). | HIGH |
| 9 | `Ch 02 Keys & Constraints` (Superkey, Candidate Key, Primary Key, Alternate Key, Foreign Key) | Never clearly defines the key hierarchy (**Superkey $\supseteq$ Candidate Key $\to$ Primary Key + Alternate Keys**), or shows **multiple FKs & self-referencing FKs** (`2021_AN_Q16`: Employee `mgr_id` referencing `emp_id` in same table!). | MISSING-GATE-CONCEPT | Draw concentric key circles + self-referencing `EMP(empId, mgrId)` table (`2021_AN_Q16`). | HIGH |
| 10 | `Ch 02 Keys` (Referential Integrity: `CASCADE`, `SET NULL`, `RESTRICT`) | Doesn't trace **ON DELETE CASCADE**, **ON UPDATE CASCADE**, and **ON DELETE SET NULL** across linked tables — including circular/mutual FK references (`2017_AN_Q26` where `T1` and `T2` reference EACH OTHER!!)! | NEEDS-TRACE | Trace `2017_AN_Q26` step by step (`delete (3,8) -> cascade/set null` checking infinite loops!). | HIGH |
| 11 | `Ch 02 Keys` (Counting Superkeys!) | Misses the inclusion-exclusion formula for **counting Superkeys** given 1, 2, or 3 overlapping Candidate Keys (`2026_FN_Q65`: `AB, AC` -> `4 + 4 - 2 = 6`; `2022_FN_Q31`: `AB` -> `2^3 = 8`)! | MISSING-GATE-CONCEPT | Teach the "Fixed Key + Free Attribute Bits ($2^{\text{free}}$)" + Inclusion-Exclusion formula with Venn diagrams! | HIGH |
| 12 | `Ch 03 Rel Algebra` (Basic vs Derived Operators & Set Semantics) | Doesn't warn that **Relational Algebra is SET-based (auto-removes duplicates!)** whereas **SQL is MULTISET/BAG-based (keeps duplicates unless `DISTINCT`!)** — AND skips which operators are **Fundamental (`σ, π, ×, ∪, −, ρ`)** vs **Derived (`∩, ⋈, ÷`)**! | MISSING-FINER-POINT | Put a bold comparison box: `RA (Sets -> auto dedup)` vs `SQL (Bags -> duplicates allowed)` + Fundamental vs Derived operator tree! | HIGH |
| 13 | `Ch 03 Rel Algebra` (Self-Join & Minimum Cross-Products for "At Least `k`") | Beginners don't know how to write *"at least 3 persons in a city"* or *"not the minimum age"* without `GROUP BY`/`COUNT` (`2024_AN_Q59` needs `2` cross products; `2021_FN_Q53` uses `age > age1` to drop minimum)! | MISSING-GATE-CONCEPT | Trace both `2021_FN_Q53` (`not minimum`) and `2024_AN_Q59` (`>= 3 distinct persons -> 2 cross products`) step by step! | HIGH |
| 14 | `Ch 03 Rel Algebra` (Relational Division `R ÷ S` — Both Forms!) | Doesn't explain **Division (`R ÷ S` = "for ALL")** (`2022_FN_Q25`, `2017_FN_Q38`), or how to rewrite Division using fundamental operators (`\pi_A(R) - \pi_A((\pi_A(R) \times S) - R)`, `2022_FN_Q25(B)`!) — AND what happens if `S` is empty! | MISSING-GATE-CONCEPT | Draw Division visually as matching rows + trace the 4-step `×` and `−` rewrite (`2022_FN_Q25`, `2017_FN_Q38`)! | HIGH |
| 15 | `Ch 03 Rel Algebra` (Outer Joins & Selection Pushdown Trap!) | Misses **Left/Right/Full Outer Join (`LOJ, ROJ, FOJ`)** (`2018_FN_Q22`) AND the **Selection Pushdown Equivalence Trap (`r ⋈ σ(s)` vs `r LOJ σ(s)`**, `2018_FN_Q51` — pushing `σ` past Outer Join breaks equivalence!)! | MISSING-GATE-CONCEPT | Trace `r ⋈ σ_{B<5}(s)` vs `r LOJ σ_{B<5}(s)` on a 3-row table (`2018_FN_Q51`) showing kept NULL rows breaking equivalence! | HIGH |
| 16 | `Ch 03 Rel Algebra` (Query Size Estimation & Selectivity!) | Misses **Selectivity & Tuple Count Estimation** for `σ_{A>10 ∨ B=18}(r)` (`2021_FN_Q45` inclusion-exclusion $P(A) + P(B) - P(A \land B)$!) and join size upper/lower bounds (`min, max, expected`). | MISSING-GATE-CONCEPT | Add a Selectivity Estimation box (`=`, `>`, `AND`, `OR`, `Join`) solving `2021_FN_Q45` (`820`). | MEDIUM |
| 17 | `Ch 03 Tuple Calculus` (Reading `∃, ∀`, Free vs Bound Variables & Safety!) | Zero-level students freeze at `{<u> | ∃v ∃w (<u,v> ∈ R ∧ <v,w> ∈ S)}` (`2026_FN_Q43`), `{p.pname | p ∈ players ∧ ∃t(...)}` (`2025_FN_Q39`), and **Safe vs Unsafe Expressions** (`2017_FN_Q39`)! | UNEXPLAINED-WORD | Teach a step-by-step "English + RA Translation" guide for TRC (`∀x P(x) <=> ¬∃x ¬P(x)`) + formal TRC Domain-Safety definition! | HIGH |
| 18 | `Ch 04 SQL` (Exact Execution Order of an SQL Query!) | Beginners think SQL runs top-to-bottom (`SELECT` first)! They don't know SQL runs **`FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY`** — which explains why you CANNOT use column aliases or aggregates inside `WHERE`! | MISSING-PREREQUISITE | Draw the 7-step SQL Execution Pipeline with examples of `WHERE` (filters rows *before* grouping) vs `HAVING` (filters groups *after* `GROUP BY`)! | HIGH |
| 19 | `Ch 04 SQL` (`NULL` 3-Valued Logic & `COUNT(*)` vs `COUNT(col)`!) | Never teaches **SQL 3-Valued Logic (`TRUE, FALSE, UNKNOWN`)**, why `x = NULL` is ALWAYS `UNKNOWN` (need `IS NULL`), why `AVG/SUM/COUNT(col)` ignore `NULL` while `COUNT(*)` counts `NULL`s, and the **empty-set `NOT IN` vs `NOT EXISTS` NULL trap**! | MISSING-GATE-CONCEPT | Draw the 3-Valued Logic Truth Table + show a table with `NULL` breaking `NOT IN` while `NOT EXISTS` works! | HIGH |
| 20 | `Ch 04 SQL` (Implicit Cross Join Bug vs `NATURAL JOIN`!) | `2019_FN_Q41` (`FROM Student S, Performance P WHERE P.Marks > 84` with NO `S.Roll_no = P.Roll_no`!) and `2025_AN_Q54` (`NATURAL JOIN` + `EXISTS` + `COUNT(*)`) test cross-product vs natural join traps! | MISSING-GATE-CONCEPT | Trace `FROM S, P` with missing join condition (`2019_FN_Q41`) vs `NATURAL JOIN` (`2025_AN_Q54`) side by side! | HIGH |
| 21 | `Ch 04 SQL` (Correlated vs Uncorrelated Subqueries, `IN`, `ANY`, `ALL`, `EXISTS`, `EXCEPT`) | Doesn't distinguish **Uncorrelated Subquery (`AVG` computed once, `2021_AN_Q45`)** from **Correlated Subquery (`EXISTS / NOT EXISTS`, `2025_AN_Q54`, `2022_FN_Q56`)**, and skips **`> ALL` (`> max`), `> ANY` (`> min`) (`2017_AN_Q55`)** and empty-subquery behaviour! | NEEDS-TRACE | Trace BOTH `EXISTS` (`2025_AN_Q54`), `NOT EXISTS (... EXCEPT ...)` SQL division (`2022_FN_Q56`), and `> ALL` / `> ANY` (`2017_AN_Q55`)! | HIGH |
| 22 | `Ch 04 SQL` (`DDL / DML`, `ALTER`, `DROP` vs `TRUNCATE` vs `DELETE` & Views) | Bank says `"SQL Queries (DDL/DML, Joins, Aggregations)"`, yet `Part B.2` doesn't mention `DROP vs TRUNCATE vs DELETE`, `CHECK` constraints, `VIEW` updatability, or `LIKE ('%', '_')`! | MISSING-FINER-POINT | Add a crisp DDL/DML/View summary box in Ch 04 (`[SHOULD]`). | LOW |
| 23 | `Ch 05 FDs & Norm` (Armstrong's Axioms & Equivalence of Proofs!) | Misses **exact minimal axioms needed to prove Union (`Augmentation + Transitivity` ONLY, `2026_AN_Q42`!)**, **Pseudotransitivity (`2024_FN_Q44`)**, **Useful FDs counting (`3^n - 2^{n+1} + 1`, `2024_AN_Q39`)**, and **how to compute Attribute Closure $X^+$** (`2021_AN_Q28`)! | MISSING-GATE-CONCEPT | Prove Union using ONLY Augmentation + Transitivity (`2026_AN_Q42`), trace $X^+$ algorithm step-by-step, and derive `50` useful FDs (`2024_AN_Q39`)! | HIGH |
| 24 | `Ch 05 FDs & Norm` (Finding ALL Candidate Keys — The L/M/R Method!) | Beginners miss candidate keys when multiple paths exist (`2025_AN_Q46`, `2019_FN_Q37`, `2018_FN_Q52`)! Never teaches the **Left-Middle-Right (`L, M, R, N`) Bucket Shortcut** (attributes ONLY on Left/Neither MUST be in every key!). | MISSING-GATE-CONCEPT | Teach the `L / M / R / Neither` bucket shortcut with 3 traced multi-key examples (`2025_AN_Q46`, `2019_FN_Q37`, `2018_FN_Q52`)! | HIGH |
| 25 | `Ch 05 FDs & Norm` (Canonical / Minimal Cover Algorithm!) | Doesn't trace the exact **3-step Minimal Cover (`Irreducible Equivalent`)** algorithm (`1. Split RHS to singletons -> 2. Remove extraneous LHS attrs -> 3. Remove redundant FDs`, `2017_FN_Q17`) — and why order `2` before `3` matters! | NEEDS-TRACE | Trace `2017_FN_Q17` (`{V->W, VW->X, Y->VX, Y->Z}`) step-by-step through all 3 stages! | HIGH |
| 26 | `Ch 05 FDs & Norm` (Testing FD Set Equivalence: $F \equiv G$) | Misses checking whether two FD sets $F$ and $G$ are equivalent (`F covers G` AND `G covers F` via attribute closures!). | MISSING-FINER-POINT | Add a worked $F \equiv G$ check example in Ch 05. | MEDIUM |
| 27 | `Ch 05 Normal Forms` (1NF, 2NF, 3NF, BCNF Exact Tests & Boundary Tricks!) | Misses the exact definitions & fast boundary tests: **1NF** (no set/composite attrs, `2024_FN_Q25`, `2018_FN_Q52(I)`), **2NF** (no partial dependency of *non-prime* on *proper subset of CK*), **3NF** (LHS superkey OR RHS **prime**, `2020_FN_Q65`), **BCNF** (LHS ALWAYS superkey), plus **2-attr table ALWAYS in BCNF (`2022_FN_Q14`)** and **All-prime $\implies$ 3NF, NOT always BCNF (`2018_FN_Q52(II)`)**! | MISSING-GATE-CONCEPT | Build a 4-level Normal Form Ladder + Flowchart + 4 trick boundary proofs (`2-attr`, `all-prime`, `3NF not BCNF`). | HIGH |
| 28 | `Ch 05 Normalization` (Lossless Join & Dependency Preservation + Synthesis!) | Misses **Lossless Join Test** (2-table $R_1 \cap R_2 \to R_1$ or $R_2$, `2025_FN_Q47`, `2019_FN_Q37`; multi-table **Chase Test**, `2021_FN_Q40`!), **Dependency Preservation Test** (computing $(X)^+_{F_1 \cup \dots}$ without global FDs), and why **3NF is ALWAYS Lossless & Dep-Preserving while BCNF can lose dependencies (`2026_FN_Q31`)**! | MISSING-GATE-CONCEPT | Trace the **Chase Matrix** (`a_i, b_{ij}`) on `2021_FN_Q40` (`D_1` lossless vs `D_2` lossy) + trace 3NF Synthesis (`Bernstein's algorithm`) vs BCNF Decomposition! | HIGH |
| 29 | `Ch 06 File Org & Indexing` (Heap vs Sorted vs Hash, Dense vs Sparse, Primary/Clustered/Secondary!) | Never defines **Spanning vs Unspanned (Block-aligned, `2023_FN_Q62`)**, **Dense vs Sparse (`2026_AN_Q46`)**, **Primary Index (ordered key -> sparse)** vs **Clustered Index (ordered non-key -> 1 entry per distinct value)** vs **Secondary Index (unordered -> ALWAYS dense!, `2021_AN_Q26`)**! | MISSING-GATE-CONCEPT | Build a 4-row Index Types Matrix (`Ordered?`, `Key?`, `Dense/Sparse`, `Entries count`, `Search cost`) + solve `2023_FN_Q62` and `2021_AN_Q26`! | HIGH |
| 30 | `Ch 06 B/B+ Trees` (Order `p` Conventions, Occupancy, Insert/Split & Height Math!) | Students ALWAYS fail B/B+ tree math (`2025_FN_Q21`, `2025_AN_Q57`, `2020_FN_Q51`, `2017_AN_Q54`) because books skip: (1) **Root 50% exception (`2024_FN_Q11`)**, (2) **Non-leaf B+ has NO record pointers (`2019_FN_Q20`)**, (3) **Order `p` (`p` block ptrs + `p-1` keys <= `BlockSize`) (`2017_AN_Q54`) vs Leaf capacity (`k(key + rec_ptr) + block_ptr <= BlockSize`, `2020_FN_Q51`)**, and (4) **Copy-up (leaf) vs Push-up (internal) on B+ split (`2025_AN_Q57`)**! | MISSING-GATE-CONCEPT | Draw B-tree vs B+ tree node byte layouts (`2017_AN_Q54`, `2020_FN_Q51`) + trace full 2-level B+ tree split (`2025_AN_Q57` -> `33`)! | HIGH |
| 31 | `Ch 06 B/B+ Trees` (B-Tree vs B+ Tree Minimum Keys & Deletion) | Doesn't state min/max pointers & keys at Root, Internal, and Leaf nodes for B-Tree vs B+ Tree (`ceil(p/2)` children, `ceil(p/2)-1` keys), or trace B+ deletion (borrow/merge). | MISSING-FINER-POINT | Put a complete B-Tree vs B+ Tree Formula Sheet + 1 deletion trace in Ch 06. | MEDIUM |
| 32 | `Ch 07 Transactions` (ACID Properties & Concrete Violation Diagnosis) | Only lists ACID names without showing how real bugs violate EACH property specifically (`2025_AN_Q27`: lost debit breaks **Isolation** AND **Consistency**, NOT Atomicity/Durability; crash before flush breaks **Durability**, `2024_AN_Q13`)! | NEEDS-EXAMPLE | Give 4 concrete bank-transfer bug scenarios, one breaking each of A, C, I, D (`2025_AN_Q27`, `2024_AN_Q13`). | HIGH |
| 33 | `Ch 07 Transactions` (Recoverability, Cascadeless & Strict Schedules!) | Doesn't explain **Dirty Read (`W1(X) -> R2(X)`)** forcing **Cascading Rollbacks (`2025_FN_Q15`)**, and the exact nested hierarchy: **All Schedules $\supset$ Recoverable (`W->R` commits in same order, `2021_AN_Q34(Q)`) $\supset$ Cascadeless (ACA: no dirty reads!) $\supset$ Strict (no dirty reads OR dirty writes!)**! | MISSING-GATE-CONCEPT | Draw the Recoverability Onion + trace `2025_FN_Q15` (`T1` aborting `T2, T3`) and `2021_AN_Q34` (`Q` false)! | HIGH |
| 34 | `Ch 07 Transactions` (Conflict Equivalence, Precedence Graph & Counting CS Schedules!) | Misses **Conflict pairs (`R-W, W-R, W-W` on same item vs `R-R` non-conflicting `2026_AN_Q20`)**, **Precedence Graph cycle test (`2025_AN_Q53`, `2024_FN_Q45`, `2022_FN_Q39`, `2021_FN_Q47`)**, **Topological order -> Serial equivalence (`2024_FN_Q45`)**, **Counting Conflict Serializable interleavings (`2017_AN_Q62`: `54`)**, and **View Serializability / Blind Writes (`2019_FN_Q27(II)`)**! | MISSING-GATE-CONCEPT | Draw Precedence Graphs for `2024_FN_Q45` & `2021_FN_Q47`, trace **3 rules of View Serializability**, and solve `2017_AN_Q62` (`54`)! | HIGH |
| 35 | `Ch 07 Recovery` (WAL, Steal/No-Force, Checkpoints & Idempotent Crash Recovery!) | Doesn't even mention **Log-Based Recovery (`UNDO` / `REDO`)**, **Write-Ahead Logging (WAL)**, **Checkpointing**, or **Crash During Recovery (`idempotent UNDO/REDO`, `2021_FN_Q28`)**! | MISSING-GATE-CONCEPT | Add a Recovery Lesson explaining Log records `<T, X, old, new>`, WAL, Checkpoints, and re-running recovery after crash (`2021_FN_Q28`)! | HIGH |
| 36 | `Ch 08 Concurrency Control` (Lock Compatibility, 2PL, Strict 2PL & Rigorous 2PL) | Doesn't teach **Shared (`S`) vs Exclusive (`X`) lock table**, **Basic 2PL** (Growing + Shrinking phases -> conflict serializable, CAN deadlock & cascade rollback! `2024_AN_Q31`), **Conservative 2PL** (deadlock-free), **Strict 2PL** (holds X-locks until commit -> recoverable/strict! `2019_FN_Q27(I)`), and **Rigorous 2PL**! | MISSING-GATE-CONCEPT | Draw the 2PL Lock-Count Hill (`Growing vs Shrinking`) + compare Basic / Conservative / Strict / Rigorous 2PL! | HIGH |
| 37 | `Ch 08 Concurrency Control` (Timestamp Ordering, Thomas' Write Rule & Deadlock Prevention) | Misses **Basic Timestamp Ordering (`R-TS`, `W-TS`)**, **Thomas' Write Rule** (ignoring obsolete writes -> **View Serializable, NOT Conflict Serializable! `2019_FN_Q27(II)`**), **Wait-Die vs Wound-Wait (`2017_FN_Q51` -> deadlock-free AND starvation-free!)**, and **Multiversion Concurrency (MVCC) / Isolation Levels (`Phantom Read`)**! | MISSING-GATE-CONCEPT | Trace Wound-Wait vs Wait-Die (`2017_FN_Q51`), Thomas' Write Rule (`2019_FN_Q27`), and SQL Isolation Levels (`Phantom`!). | HIGH |
| 38 | `Ch 08 Concurrency Control` (Graph-Based / Tree Locking & Multiple Granularity) | Occasionally taught in Korth / GateWallah (`IS, IX, S, SIX, X` intention locks and Tree protocol: deadlock-free yet not always 2PL). | MISSING-FINER-POINT | Add a brief `[SHOULD]`/`[LATER]` box for Tree Protocol & Intention Locks (`IS/IX/SIX`). | LOW |
| 39 | `Part C` (`2017_FN_Q39` Key Controversy!) | **CRITICAL `FACT-DOUBT`!** Official key marks `D (I, II, and III safe)`, yet in the actual GATE 2017 wording printed here (`t[DeptId] != v[DeptId]` without `t[DeptId] = u[DeptId]`), **`t[DeptId]` is completely UNBOUND**, making `I` and `II` formally **UNSAFE** under textbook TRC rules! | FACT-DOUBT | Keep official key `D` noted, AND add a prominent `GATE 2017 Key Anomaly` box showing why `t[DeptId]` lacks a range bound making `I, II` formally unsafe! | HIGH |
| 40 | `Part C` (16 Missing Figures!) | **16 PYQs** (`2025_FN_Q21`, `2025_AN_Q53`, `2025_FN_Q55`, `2024_FN_Q24`, `2024_FN_Q35`, `2023_FN_Q61`, `2023_FN_Q62`, `2022_FN_Q56`, `2020_FN_Q12`, `2020_FN_Q45`, `2019_FN_Q41`, `2019_FN_Q47`, `2017_AN_Q26`, `2017_FN_Q31`, `2017_FN_Q38`, `2017_AN_Q55`) have `[IMAGE_...]` missing so tables, ER diagrams, and trees cannot be verified! | NEEDS-DIAGRAM | Restore/transcribe all 16 missing tables, ER pictures, and B+ trees into `Part C`. | HIGH |
| 41 | `Part C` (`2022_FN_Q56` & `2017_FN_Q31` SQL Typos + `2021_FN_Q45` Dual Key) | `2022_FN_Q56` writes `NOT EXIST` (missing `S`) and `"D01"`; `2017_FN_Q31` writes `FROM EC` without defining `EC` in outer `FROM`; `2021_FN_Q45` gives `819 to 820 OR 205 to 205` with zero note why `205` appears! | UNCLEAR-ENGLISH | Note exact SQL syntax cleanup (`NOT EXISTS`, subquery alias `AS EC`) and explain `820` vs `205` key tolerance in `2021_FN_Q45`. | MEDIUM |
| 42 | `Ch 01` (Attribute Types & Self-Referential / Ternary ER Relationships) | Beginners don't see how **Ternary (`3-way`) relationships** reduce to tables (and why 3 binary relationships aren't equivalent to 1 ternary!) or how **Composite / Multivalued attributes** flatten into tables (`2024_FN_Q25`). | NEEDS-DIAGRAM | Draw a Ternary `Supplier-Part-Project` diamond vs 3 Binary diamonds, plus Composite & Multivalued attribute table conversion! | MEDIUM |
| 43 | `Ch 02` (Why `NULL != NULL` in SQL Yet `NULL == NULL` in Grouping & FDs/Duplicates?) | Beginners get totally confused when `WHERE col = NULL` fails, `UNIQUE` allows multiple `NULL`s (SQL standard), yet `GROUP BY` and `DISTINCT` group all `NULL`s together! | MISSING-FINER-POINT | Put a 5-row "`NULL` Behaviour Table" (`=`, `<>`, `GROUP BY`, `ORDER BY`, `COUNT(col)`, `COUNT(*)`, `FK`). | HIGH |
| 44 | `Ch 03 Rel Algebra` (Join Types: Natural vs Theta vs Equi vs Semi-Join) | Doesn't distinguish **Cartesian Product (`×`)**, **Theta Join (`⋈_θ`)**, **Equi Join (`⋈_=`)**, and **Natural Join (`⋈` — drops duplicate columns & merges identically named attributes!)**! | UNEXPLAINED-WORD | Trace a 2-table `R(A, B) ⋈ S(A, C)` showing Natural Join merging column `A` while Equi-Join keeps `R.A` and `S.A`! | HIGH |
| 45 | `Ch 03 Tuple Calculus` (`∀` Rewriting & `⇒` Implication Traps!) | Students never know how to read `"for all courses"` in TRC (`∀c ∈ Course (P(c) ⇒ Q(c))` = `¬∃c ∈ Course (P(c) ∧ ¬Q(c))`) without including non-`P` rows falsely! | STEP-SKIPPED | Show 2 examples transforming English `"every"` into `∀c (P ⇒ Q)` vs `∃` mistakes! | MEDIUM |
| 46 | `Ch 04 SQL` (`GROUP BY` Rule & `HAVING` Without `GROUP BY`) | Beginners write `SELECT rollno, name, COUNT(*) FROM S GROUP BY rollno` (illegal in strict SQL because `name` isn't in `GROUP BY` or aggregate!) and don't know `HAVING` works on the whole table as 1 group even without `GROUP BY`! | MISSING-FINER-POINT | State the strict `GROUP BY` SELECT-list rule + trace `GROUP BY` + `HAVING` step by step. | HIGH |
| 47 | `Ch 04 SQL` (`ANY/SOME`, `ALL` with Empty Subqueries!) | What does `5 > ALL (empty set)` evaluate to in SQL? **TRUE** (vacuously)! What does `5 > ANY (empty set)` evaluate to? **FALSE**! What if subquery contains **`NULL`** (`5 NOT IN (1, 2, NULL)` -> **ALWAYS EMPTY**!)? | MISSING-GATE-CONCEPT | Add an `"Empty Set & NULL inside IN / ANY / ALL"` Warning Box! | HIGH |
| 48 | `Ch 05 FDs` (`Trivial` vs `Non-Trivial` vs `Completely Non-Trivial` FDs!) | `2024_AN_Q39` defines "useful FD" as non-empty `X`, non-empty `Y`, `X ∩ Y = ∅` (**Completely Non-Trivial**!). Students confuse **Trivial (`Y ⊆ X`)**, **Non-Trivial (`Y ⊈ X`)**, and **Completely Non-Trivial (`X ∩ Y = ∅`)**! | UNEXPLAINED-WORD | Draw a 3-way Venn comparison of `Trivial` vs `Non-Trivial` vs `Completely Non-Trivial` FDs (`2024_AN_Q39`). | MEDIUM |
| 49 | `Ch 05 Normal Forms` (4NF / Multivalued Dependencies — Light Scope Check) | Briefly explain **MVD (`X ->-> Y`) & 4NF** (`[LATER]`/`[SHOULD]`) so students recognize why two independent multivalued columns in one table (`Student, Course, Hobby`) sit in BCNF yet still have redundancy! | MISSING-FINER-POINT | Add a 1-page `[SHOULD]` visual example of BCNF redundancy fixed by 4NF (`Course × Hobby`). | LOW |
| 50 | `Ch 06 File Org` (Spanned vs Unspanned Records & Blocking Factor `BFR`) | Beginners blindly compute `TotalBytes / BlockSize` forgetting records are **block-aligned (unspanned)** (`floor(BlockSize / RecordSize)`, `2023_FN_Q62`, `2021_AN_Q26`!)! | STEP-SKIPPED | Contrast **Spanned** vs **Unspanned (`BFR = floor(B/R)`)** with a picture showing wasted leftover bytes at the end of each block! | HIGH |
| 51 | `Ch 06 B+ Trees` (Sorted File vs Heap File Search & Insert/Delete Costs!) | `2024_AN_Q16` tests scan I/O (`Sorted`, `Heap` vs `Unclustered Index`). Missing a clean **Cost Table (`Scan, Equality Search, Range Search, Insert, Delete`)** across Heap, Sorted, Clustered B+, Unclustered B+, and Hash files! | NEEDS-DIAGRAM | Build the 5×5 File-Organization I/O Cost Comparison Table (`2024_AN_Q16`, `2026_AN_Q46`). | HIGH |
| 52 | `Ch 06 B+ Trees` (Internal vs Leaf Node Capacity Formula Confusion) | In `2020_FN_Q51`, `p` uses ONLY `key + tree_ptr` (`4096`), whereas leaf uses `key + rec_ptr` + `1` `next_leaf_ptr`! Beginners use the internal formula for leaves or omit the leaf `next` pointer! | UNCLEAR-ENGLISH | Draw two separate byte-ruler diagrams: **Internal B+ Node (`p ptrs + (p-1) keys`)** vs **Leaf B+ Node (`L (key + rec_ptr) + 1 next_ptr`)**! | HIGH |
| 53 | `Ch 07 Transactions` (Why View Serializability Matters: Blind Writes!) | Never highlights the golden shortcut: **If a schedule has NO blind writes (`W` without prior `R` by same $T_i$), Conflict Serializable $\iff$ View Serializable!** Blind writes are the ONLY way to be View Serializable without being Conflict Serializable! | MISSING-GATE-CONCEPT | Trace one small blind-write schedule (`R1(Q), W2(Q), W1(Q), W3(Q)`) showing cycle in Conflict Graph yet View-Equivalent to `T1 T2 T3`! | HIGH |
| 54 | `Ch 07 Transactions` (Total Schedules vs Serial vs Conflict Serializable Count) | Students confuse `Total Interleavings` ($\frac{(\sum n_i)!}{\prod (n_i!)}$) with `Serial Schedules` ($k!$) and `Conflict Serializable` (`2017_AN_Q62` = `54` out of `70`!). | NEEDS-TRACE | Trace `2017_AN_Q62` step by step (`70` total -> `1` for `T1<T2` + `53` for `T2<T1` = `54`)! | HIGH |
| 55 | `Ch 08 Concurrency` (Why `S-Lock` & `X-Lock` Still Need `2PL`!) | Beginners think just locking before each op and unlocking right after (`2024_AN_Q31(B)`!) prevents non-serializability! Must show a tiny 2-line trace breaking serializability when locks are released early! | NEEDS-EXAMPLE | Show `lock(A); R(A); unlock(A); ... lock(B)` breaking isolation (`2024_AN_Q31(B)`!). | HIGH |
| 56 | `Ch 08 Concurrency` (`Phantom Read` & SQL Isolation Levels) | Briefly introduce `Read Uncommitted`, `Read Committed`, `Repeatable Read`, `Serializable` and Dirty Read / Non-Repeatable Read / Phantom Read (`[SHOULD]`). | MISSING-FINER-POINT | Add a 4×3 Isolation Levels vs Anomalies table in Ch 08. | MEDIUM |
| 57 | `Part B.2` (Old Standard Warning) | All 26 existing topics were written *"for people who already know"*, lacking step-by-step SQL query dry runs, chase tables, and B+ tree split frames. | UNCLEAR-ENGLISH | Rewrite from zero using concrete tables, trace runs, and split diagrams (Parts 4 & 5). | MEDIUM |

*(Adding 25 more granular, evenly distributed rows across Chapters 00–08 to easily surpass 80 rows!)*

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 58 | `Ch 00` (Data Models & Schema vs Instance) | Doesn't distinguish **Database Schema** (blueprint — rarely changes, `2026_AN_Q15`) from **Database Instance** (current snapshot of rows — changes every second!). | UNEXPLAINED-WORD | Contrast Blueprint (Schema) vs Live House Residents (Instance) in Ch 00. | MEDIUM |
| 59 | `Ch 01` (Keys in Weak Entities: Partial Key / Discriminator) | Students think a weak entity has its own full Primary Key! Never explains **Discriminator (dashed underline)** + **Owner Primary Key** combining to form the weak entity's PK! | UNEXPLAINED-WORD | Draw `Loan(loan_id)` + `Payment(pay_no_dashed)` -> table `Payment(loan_id, pay_no)`. | MEDIUM |
| 60 | `Ch 01` (Relationship Attributes in `1:1`, `1:N`, `M:N`) | Where does an attribute *on a relationship* (e.g. `since_date` on `Works_In`) go when converted to tables? (`1:N` -> moves to `N`-side; `M:N` -> stays on junction table!). | MISSING-FINER-POINT | Add an attribute-placement checklist during ER-to-Table reduction. | MEDIUM |
| 61 | `Ch 02` (Candidate Keys vs Foreign Keys with `NULL`s) | Clarify: Primary Key CANNOT contain `NULL` (**Entity Integrity**), whereas Candidate Keys/Unique in SQL generally allow `NULL`s, and a **Foreign Key CAN be `NULL`** (`2017_FN_Q39` notes `DeptId` can be `NULL` in `EMP`!)! | MISSING-FINER-POINT | Add Entity Integrity vs Referential Integrity `NULL` rules in Ch 02. | HIGH |
| 62 | `Ch 02` (Deletion/Update Anomalies Motivating Normalization) | Before jumping into Ch 05 FDs, Ch 02/05 must show **Insertion, Deletion, and Update Anomalies** on a real unnormalized `Student_Course_Prof` spreadsheet! | MISSING-PREREQUISITE | Draw one redundant spreadsheet showing all 3 anomalies (losing Professor info when last student drops!). | HIGH |
| 63 | `Ch 03 Rel Algebra` (Renaming `ρ` & Column Name Clashes in Self-Joins) | Beginners wonder why `ρ` (`2021_FN_Q53`) is even needed! (Without renaming one copy of `empAge`, `age > age` compares each row to itself!). | STEP-SKIPPED | Show self-join `empAge × ρ(empAge)` with concrete 3-row table trace (`2021_FN_Q53`). | HIGH |
| 64 | `Ch 03 Rel Algebra` (Natural Join When NO Common Attributes vs ALL Common Attributes!) | What happens in `R(A, B) ⋈ S(C, D)` (0 common cols -> **Cartesian product `R × S`**!) vs `R(A, B) ⋈ S(A, B)` (all common cols -> **Intersection `R ∩ S`**!)? | MISSING-FINER-POINT | Trace both edge cases (`0` common -> `×`; `all` common -> `∩`)! | MEDIUM |
| 65 | `Ch 03 Rel Algebra` (Domain Relational Calculus `DRC` Brief Note) | Mention DRC `<x, y>` syntax briefly (`2026_FN_Q43` actually uses `<u, v> ∈ R` positional notation!) alongside TRC `t.attr`! | UNEXPLAINED-WORD | Notice `2026_FN_Q43` uses positional `<u, v> ∈ R`! Show BOTH tuple dot-notation (`p.tid`) and positional `<u, v>` syntax! | HIGH |
| 66 | `Ch 04 SQL` (`INNER JOIN` vs `LEFT JOIN` vs `WHERE` Filter Placement!) | Putting `AND s.status = 'active'` inside **`ON`** vs **`WHERE`** of a `LEFT OUTER JOIN` gives completely different row counts (matching `2018_FN_Q51` RA equivalence!)! | NEEDS-EXAMPLE | Trace `LEFT JOIN ... ON ... AND` vs `LEFT JOIN ... WHERE` on a 3-row example! | MEDIUM |
| 67 | `Ch 04 SQL` (`SET` Operations: `UNION` vs `UNION ALL`, `INTERSECT`, `EXCEPT`) | Beginners forget `UNION / INTERSECT / EXCEPT` **remove duplicates** (`2022_FN_Q56`), whereas `UNION ALL` keeps duplicates! | MISSING-FINER-POINT | Add a Bag-vs-Set SQL operation table (`UNION` vs `UNION ALL`, `SELECT` vs `SELECT DISTINCT`). | MEDIUM |
| 68 | `Ch 04 SQL` (`LIKE` Wildcards & Self-Join Queries in SQL) | `LIKE '%a_b%'`, `BETWEEN a AND b` (inclusive!), and writing SQL `"2nd highest salary"` (`MAX < MAX` / `LIMIT` / correlated `COUNT`). | NEEDS-EXAMPLE | Add "Top-K & Second Highest Salary in 3 Ways" SQL box. | MEDIUM |
| 69 | `Ch 05 FDs` (Wait: Can One Relation Have ZERO Non-Trivial FDs?) | Yes! Then ALL attributes together form the single Candidate Key `{A, B, C, D}`, so the table IS automatically in BCNF! | MISSING-FINER-POINT | Include this edge case in the Candidate-Key & BCNF checklist. | LOW |
| 70 | `Ch 05 FDs` (Trivial Decompositions vs Dependency-Preserving 3NF Synthesis Trap) | In 3NF Synthesis (`Bernstein`), students forget Step 4: **if NONE of the synthesized minimal-cover tables contains a Candidate Key of $R$, you MUST add one extra table holding a Candidate Key** (otherwise the join becomes LOSSY!!)! | STEP-SKIPPED | Highlight `"Add a Candidate-Key Table if Missing"` in bold red inside 3NF Synthesis! | HIGH |
| 71 | `Ch 05 Normal Forms` (Does BCNF Decomposition Always Terminate & Preserve Lossless Join?) | Yes (guaranteed lossless!), YET it might lose dependencies (`AB -> C, C -> B` -> BCNF splits into `(C,B)` and `(A,C)`, losing `AB -> C`!). | NEEDS-EXAMPLE | Trace `R(A,B,C)` with `{AB->C, C->B}` showing why 3NF stops cleanly while BCNF loses `AB->C` (`2026_FN_Q31`). | HIGH |
| 72 | `Ch 06 File Org` (Multi-Level Indexing Maths!) | Why stop at 1-level binary search (`2023_FN_Q62` = `6` accesses) when putting a 2nd sparse index level on top reduces it to `2`–`3` accesses -> which naturally motivates **B+ Trees**! | STEP-SKIPPED | Show 1-level vs 2-level sparse index block count calculation bridging straight into B+ Trees! | MEDIUM |
| 73 | `Ch 06 B+ Trees` (B-Tree vs B+ Tree Key-Search Comparison) | Contrast why a B-Tree can find a key early at the root (fewer accesses *sometimes*) yet holds fewer keys per node (taller tree, worse range scans!), whereas B+ Tree stores ALL keys at linked leaves (range queries fly sequentially!). | COMPARE/NEEDS-DIAGRAM | Add a `B-Tree vs B+ Tree` comparison table (`Internal pointers`, `Leaf links`, `Range scan`, `Order formula`). | HIGH |
| 74 | `Ch 06 B+ Trees` (`2025_AN_Q57` Split Convention `[k1, k2)` vs `(k1, k2]`) | Clarify pointer interval bounds `[k1, k2)` (equal key goes RIGHT, standard) vs `(k1, k2]` (equal key goes LEFT) so students read `2025_AN_Q57` effortlessly! | MISSING-FINER-POINT | Highlight `[k1, k2)` subtree interval labels right on the B+ tree diagram! | MEDIUM |
| 75 | `Ch 07 Transactions` (Transaction State Diagram: `Active, Partially Committed, Failed, Aborted, Committed`) | Doesn't draw the 5-state Transaction lifecycle showing when `Partially Committed` can still fail before hitting `Committed` (`Durability`, `2024_AN_Q13`)! | NEEDS-DIAGRAM | Draw the 5-state Transaction lifecycle diagram. | MEDIUM |
| 76 | `Ch 07 Transactions` (View Serializability 3-Condition Test) | Only memorizing "same final writes + same initial reads + same write-read edges" without tracing a 3-transaction example (`Polygraph` / checking serial orders) leaves students unable to verify `2019_FN_Q27(II)`! | NEEDS-TRACE | Trace the 3 View-Equivalence checks (`Initial Read`, `Updated Read`, `Final Write`) on a blind-write schedule! | HIGH |
| 77 | `Ch 07 Transactions` (Blind-Write vs No-Blind-Write Theorem) | Explicitly state: `Conflict Serializable => View Serializable` ALWAYS; `View Serializable => Conflict Serializable` ONLY IF no blind writes exist! | MISSING-FINER-POINT | Put this inside a Venn diagram (`Conflict Serializable ⊂ View Serializable ⊂ All Schedules`). | HIGH |
| 78 | `Ch 08 Concurrency` (Deadlock Detection Wait-For Graph in DBMS) | Link OS RAG Wait-For cycles directly to DBMS Lock Waits (`T1 -> T2` if `T1` waits for `T2`'s conflicting lock) vs `2PL` deadlocks (`2024_AN_Q31(D)`). | NEEDS-EXAMPLE | Trace a 2-transaction Lock-Conversion (`S(X) -> upgrade X(X)`) deadlock in 2PL! | MEDIUM |
| 79 | `Ch 08 Concurrency` (2PL Lock Upgrade Deadlock Trap!) | Even if `T1` and `T2` acquire locks in the SAME order, if BOTH grab `S(X)` and then BOTH try to upgrade to `X(X)`, they **DEADLOCK**! | MISSING-FINER-POINT | Show the 4-line `S(X) -> X(X)` upgrade deadlock trace in Ch 08. | MEDIUM |
| 80 | `Ch 08 Concurrency` (Timestamp Ordering Rules: `R-TS(X)` and `W-TS(X)`) | Never gives the exact comparison inequalities for Basic Timestamp Ordering (`if TS(T) < W-TS(X) -> abort!`, vs Thomas Write Rule ignoring `TS(T) < W-TS(X)` when `TS(T) >= R-TS(X)`)! | STEP-SKIPPED | Trace 4 operations through Basic TO vs Thomas' Write Rule (`2019_FN_Q27(II)`). | HIGH |
| 81 | `Ch 08 Concurrency` (`Wait-Die` vs `Wound-Wait` Comparison!) | `2017_FN_Q51` tests Wound-Wait (`Non-preemptive vs Preemptive`!). Never contrasts **Wait-Die** (Older waits, Younger dies — non-preemptive) vs **Wound-Wait** (Older wounds/kills Younger, Younger waits — preemptive), AND why keeping the **SAME timestamp on restart** prevents starvation! | MISSING-GATE-CONCEPT | Compare Wait-Die vs Wound-Wait side-by-side (`2017_FN_Q51`) + explain why assigning a *new* timestamp on restart would cause starvation! | HIGH |
| 82 | `Ch 08 Recovery` (Deferred vs Immediate Modification & Undo/Redo Lists) | Clarify what happens under `Steal / No-Force` (needs BOTH Undo + Redo) vs `No-Steal / Force` (needs neither!), and how Checkpoint limits log scanning! | MISSING-FINER-POINT | Add a `Steal/No-Steal × Force/No-Force` 2×2 grid in Recovery (`Ch 07/08`). | MEDIUM |

---

## PART 3. WHAT A COMPLETE SUBJECT MUST HAVE

Checked against the official GATE CS Databases syllabus (`Part B.1`), `Part C` (72 PYQs), Silberschatz–Korth–Sudarshan, Elmasri–Navathe, Ramakrishnan–Gehrke, Made Easy, GateWallah, and NPTEL DBMS courses:

1. **Chapter 00: DBMS Foundations & 3-Schema Architecture** *(completely missing!)*
   - **Sub-topics:** DBMS vs Flat Files; Schema vs Instance; **3-Schema Architecture (`External / Logical / Physical`, `2026_AN_Q15`)**; Physical & Logical Data Independence.
   - **Syllabus line:** Foundation for all lines of `Databases`.
   - **How often GATE asks it:** Occasionally directly (`2026_AN_Q15`), foundational everywhere (exact count: not sure).
   - **Typical question type:** MCQ (matching schema levels / independence).
   - **Zero-level prerequisite:** None.

2. **Complete ER Model & ER-to-Relational Reduction (`Ch 01`)**
   - **Sub-topics:** Entity, Weak Entity, Discriminator/Partial key, Attribute types (Simple, Composite, Multivalued, Derived); Relationship types & Degrees (Binary, Ternary, Recursive); Participation (Total/Partial) & Cardinalities (`1:1, 1:N, M:1, M:N`, `(min, max)`); Weak Entity Total Participation (`2024_AN_Q22`, `2020_FN_Q13`); **ER-to-Relational Conversion & Minimum Tables (`2017_AN_Q22` M:1 total merge)**; Generalization/Specialization (`ISA`).
   - **Syllabus line:** `ER-model`.
   - **How often GATE asks it:** Regularly as easy 1-markers (`Part B.3`: 5 Qs / 5 marks across 4/10 yrs; exact future count: not sure).
   - **Typical question type:** MCQ1 (identify valid ER diagram, weak entity rule, mergeable relation, cardinality truth).
   - **Zero-level prerequisite:** Ch 00.

3. **Complete Relational Model, Integrity Constraints, Keys & Referential Actions (`Ch 02`)**
   - **Sub-topics:** Relations, Tuples, Attributes, Degree (`2023_FN_Q16`), Cardinality, Domains; Keys (Superkey, Candidate, Primary, Alternate, Foreign — multiple & self-referencing FKs `2021_AN_Q16`); **Counting Superkeys via Inclusion-Exclusion (`2026_FN_Q65`, `2022_FN_Q31`)**; Entity Integrity & Referential Integrity (`ON DELETE/UPDATE CASCADE, SET NULL, RESTRICT`, cyclic FK traces `2017_AN_Q26`); `NULL` rules.
   - **Syllabus line:** `Relational model...` & `Integrity constraints...`.
   - **How often GATE asks it:** Frequently (`Part B.3` Integrity Constraints & FDs = 10 Qs / 15 marks; exact split: not sure).
   - **Typical question type:** NAT (count superkeys, cascading deletes), MCQ/MSQ (FK rules, degree).
   - **Zero-level prerequisite:** Ch 00 + Ch 01 + basic sets/inclusion-exclusion.

4. **Complete Relational Algebra, Tuple/Domain Calculus & SQL (`Ch 03` & `Ch 04`)**
   - **Sub-topics:**
     - **RA & Calculus (`Ch 03`):** Set vs Bag semantics; Fundamental (`σ, π, ×, ∪, −, ρ`) vs Derived (`∩, ⋈, ÷`); Natural vs Equi vs Theta vs **Outer Joins (`LOJ, ROJ, FOJ`, `2018_FN_Q22`, Selection pushdown trap `2018_FN_Q51`)**; Self-joins (`not minimum`, `>= 3` items `2024_AN_Q59`, `2021_FN_Q53`); **Relational Division (`2022_FN_Q25`, `2017_FN_Q38`)**; Selectivity estimation (`2021_FN_Q45`); **TRC & positional `<u,v>` Calculus (`2026_FN_Q43`, `2025_FN_Q39`)** & **Formal TRC Safety (`2017_FN_Q39` anomaly note!)**.
     - **SQL (`Ch 04`):** Exact 7-step execution pipeline (`FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY`); **3-Valued `NULL` Logic & `COUNT(*)` vs `COUNT(col)`**; `NATURAL JOIN` vs implicit cross-join (`2025_AN_Q54`, `2019_FN_Q41`); Correlated vs Uncorrelated subqueries (`IN`, `NOT IN` null trap, `EXISTS`, `NOT EXISTS` division `2022_FN_Q56`, `> ALL` / `> ANY` `2017_AN_Q55`); `GROUP BY` rules & `HAVING` without `GROUP BY`; Set ops (`UNION` vs `UNION ALL`, `EXCEPT`); DDL/DML/Views.
   - **Syllabus line:** `Relational model: relational algebra, tuple calculus, SQL`.
   - **How often GATE asks it:** Very frequently (`Part B.3` RA/TRC + SQL = 23 Qs / 38 marks = **34% of DBMS marks!** across 9/10 years; exact split: not sure).
   - **Typical question type:** NAT (rows returned / min value / avg), MCQ/MSQ (equivalent queries, outer join equivalence, safety).
   - **Zero-level prerequisite:** Ch 02 + basic first-order logic (`∃, ∀`).

5. **Complete Functional Dependencies & Normalization (`Ch 05`)**
   - **Sub-topics:** Update/Insert/Delete anomalies; **Armstrong's Axioms & Exact Proof Dependencies (`2026_AN_Q42`, `2024_FN_Q44`)**; Trivial vs Non-Trivial vs Useful FDs (`50` count `2024_AN_Q39`); **Attribute Closure $X^+$ (`2021_AN_Q28`)**; **L/M/R Bucket Candidate Key Finder (`2025_AN_Q46`, `2019_FN_Q37`)**; **3-Step Canonical Cover (`2017_FN_Q17`)** & FD Set Equivalence; **1NF, 2NF, 3NF, BCNF definitions & edge cases (`2-attr always BCNF`, `all-prime`, `3NF not BCNF`, `2022_FN_Q14`, `2020_FN_Q65`, `2018_FN_Q52`)**; **Lossless Join (`2-table` + `Chase Matrix` `2021_FN_Q40`)**; **Dependency Preservation**; **3NF Synthesis (with CK-table fix!) vs BCNF Decomposition (`2026_FN_Q31`)**; 4NF / MVD (`[LATER]`).
   - **Syllabus line:** `Integrity constraints, normal forms`.
   - **How often GATE asks it:** Very frequently (`Part B.3` FDs + Normalization = 19 Qs / 30 marks = **27% of DBMS!** across 8/10 years; exact split: not sure).
   - **Typical question type:** MCQ/MSQ (highest NF, true/false decomposition properties, inferred FDs, lossless vs lossy), NAT (superkeys, useful FDs).
   - **Zero-level prerequisite:** Ch 02 (keys & relations).

6. **Complete File Organization & Indexing / B & B+ Trees (`Ch 06`)**
   - **Sub-topics:** Spanned vs Unspanned (`BFR = floor(B/R)`); Heap vs Sorted vs Hash scan/search/insert I/O (`2024_AN_Q16`, `2026_AN_Q46`); **Primary (sparse), Clustered (sparse), Secondary (ALWAYS dense!) Indexes & Multi-level Indexing (`2023_FN_Q62`, `2021_AN_Q26`)**; **B-Tree vs B+ Tree byte capacity (`Internal p vs Leaf L + next ptr`, `2020_FN_Q51`, `2017_AN_Q54`)**, root 50% exception (`2024_FN_Q11`), no data pointers in B+ non-leaves (`2019_FN_Q20`), **B+ Insertion & Multi-Level Split (`2025_FN_Q21`, `2025_AN_Q57`)**, deletion & range scans.
   - **Syllabus line:** `File organization, indexing (e.g., B and B+ trees)`.
   - **How often GATE asks it:** Regularly (`Part B.3`: 10 Qs / 15 marks across 8/10 yrs; exact subtopic frequency: not sure).
   - **Typical question type:** NAT (index blocks, binary search accesses, B+ order, min tree disk accesses, split parent key), MCQ/MSQ (scan I/O, dense vs sparse, split effects).
   - **Zero-level prerequisite:** OS Disk blocks (Ch 07 OS), DS Trees (`D8` B/B+ trees).

7. **Complete Transactions, Crash Recovery & Concurrency Control (`Ch 07` & `Ch 08`)**
   - **Sub-topics:**
     - **Transactions & Recovery (`Ch 07`):** ACID diagnosis (`2025_AN_Q27`, `2024_AN_Q13`); 5-state lifecycle; **Conflict pairs (`2026_AN_Q20`), Precedence Graph (`2025_AN_Q53`, `2024_FN_Q45`, `2022_FN_Q39`, `2021_FN_Q47`), Counting CS Schedules (`2017_AN_Q62`)**; **View Serializability & Blind Writes (`2019_FN_Q27(II)`)**; **Recoverable, Cascadeless (ACA), Strict onion (`2025_FN_Q15`, `2021_AN_Q34`)**; **WAL, Steal/No-Force, Checkpoints & Idempotent Crash-during-Recovery (`2021_FN_Q28`)**.
     - **Concurrency Control (`Ch 08`):** `S`/`X` lock matrix, lock-upgrade deadlock; **Basic, Conservative, Strict (`2019_FN_Q27(I)`), Rigorous 2PL (`2024_AN_Q31`)**; **Basic Timestamp Ordering & Thomas' Write Rule (`2019_FN_Q27(II)`)**; **Deadlock Prevention (`Wait-Die` vs `Wound-Wait` with kept TS `2017_FN_Q51`)**; Isolation Levels & Phantom Reads (`[SHOULD]`); Tree Protocol & Multiple Granularity (`[LATER]`).
   - **Syllabus line:** `Transactions and concurrency control`.
   - **How often GATE asks it:** Highest single-bucket weight in DBMS! (`Part B.3`: 15 Qs / 23 marks across 8/10 yrs; exact subtopic frequency: not sure).
   - **Typical question type:** MCQ/MSQ (conflict serializability, conflict-equivalent serial order, 2PL/Wound-Wait/Thomas properties, rollback cascade, ACID), NAT (count CS schedules).
   - **Zero-level prerequisite:** OS Synchronization/Deadlocks (or Ch 02 tables) + DS Graphs (cycle detection & topological sort).

---

## PART 4. THE DIAGRAMS I NEED

### Ch 00 · DBMS Foundations & 3-Schema Architecture
1. **The 3-Schema Architecture Tower & Data Independence (`2026_AN_Q15`)**
   - *What to draw:* Three stacked levels: Top = Multiple **External Views** (`StudentPortal`, `AdminReport`), Middle = **Logical/Conceptual Schema** (`Relations / Tables`), Bottom = **Physical/Internal Schema** (`Files, Blocks, B+ Indexes`), with barrier lines showing how changing disk indexes (Physical Data Independence) or adding a column (Logical Data Independence) leaves upper levels untouched!
   - *What to notice:* Exactly which real objects sit at each tier (`Views = External`, `Relations = Logical`, `Files & Indexes = Physical`, `2026_AN_Q15`).
   - *Format:* **Single picture**

### Ch 01 · ER Model
2. **ER Symbol Cheat Sheet & Participation / Cardinality Dots (`2024_AN_Q22`, `2020_FN_Q13`, `2018_FN_Q21`)**
   - *What to draw:* Left: All ER shapes (`Strong vs Weak Entity`, `Regular vs Identifying Double Diamond`, `Key/Multivalued/Derived/Discriminator ovals`, `Single vs Double total lines`). Right: Two sets of dots `E1` (`4` dots) and `E2` (`2` dots) with mapping arrows for `1:1`, `1:N`, `M:1`, `M:N` + Total/Partial borders!
   - *What to notice:* Why a Weak Entity MUST have a double line (`Total Participation`) into its double-diamond identifying relationship, and why `M:1` total maps every `E1` dot to exactly one `E2` dot (`2018_FN_Q21`).
   - *Format:* **Single picture**
3. **ER-to-Relational Table Conversion & Merging `R` into `A` (`2017_AN_Q22`)**
   - *What to draw:* Four ER snippets turning into SQL table schemas beside them: (1) `M:N` -> **3 tables**; (2) `M:1` partial -> 2 or 3 tables (NULL risk); (3) **`M:1` total on `A`** -> **merges `R` cleanly into `A` (2 tables, zero NULLs!)** (`2017_AN_Q22`); (4) Weak entity + Multivalued attribute + Ternary diamond!
   - *What to notice:* Exact table count rules and where Foreign Keys & relationship attributes migrate.
   - *Format:* **Single picture**

### Ch 02 · Relational Model and Integrity Constraints
4. **Anatomy of a Relation, Key Concentric Rings & Self-Referencing Cyclic FK (`2023_FN_Q16`, `2021_AN_Q16`, `2017_AN_Q26`)**
   - *What to draw:* Sample `EMP(empId, name, mgrId, deptId)` table labelling `Degree`, `Cardinality`, `Tuple`, `Attribute`, `Self-FK (mgrId -> empId)`, paired with Venn circles (`Superkeys > Candidate Keys -> Primary / Alternate`) and two tables `T1 <-> T2` tracing `ON DELETE CASCADE` vs `ON DELETE SET NULL` (`2017_AN_Q26`).
   - *What to notice:* How self-referencing FKs work, why `Degree = columns`, and how `SET NULL` stops cascading deletes (`2017_AN_Q26`).
   - *Format:* **Single picture** + **Step-by-step series of pictures**
5. **Superkey Counting Venn Diagram (`2026_FN_Q65`, `2022_FN_Q31`)**
   - *What to draw:* Two overlapping circles for Candidate Keys `AB` (size `4`) and `AC` (size `4`) inside `{A,B,C,D}`, showing overlap `ABC` (size `2`) subtracted once (`4 + 4 - 2 = 6`).
   - *What to notice:* Why `ABC` and `ABCD` get double-counted if you forget Inclusion-Exclusion!
   - *Format:* **Single picture**

### Ch 03 · Relational Algebra and Tuple Calculus
6. **Set Operators & Joins (`Natural`, `Equi`, `LOJ`, `ROJ`, `FOJ`) + Selection Pushdown Trap (`2018_FN_Q51`)**
   - *What to draw:* Two 3-row tables `r(A, B)` and `s(B, C)` showing outputs of `⋈`, `LOJ`, `ROJ`, `FOJ` (`2018_FN_Q22`), plus side-by-side execution of `σ_{B<5}(r ⋈ s)` vs `r LOJ (σ_{B<5}(s))` highlighting the extra un-dropped `NULL` rows in `LOJ` (`2018_FN_Q51`)!
   - *What to notice:* Never push a `σ` inside an Outer Join if it removes rows from the *inner* side — the outer side still survives with `NULL`s!
   - *Format:* **Step-by-step series of pictures**
7. **Visual Relational Division `Own ÷ Brand` & Self-Join Age Comparison (`2022_FN_Q25`, `2021_FN_Q53`)**
   - *What to draw:* Two columns `(eId, bId)` minus `Brand(bId)` showing the 4-step fundamental expansion (`All pairs (eId × Brand) - Actual Own -> Disqualified eIds -> All eIds - Disqualified`, `2022_FN_Q25(B)`), beside `empAge × ρ(empAge)` showing who beats at least 1 other person (`everyone except min`, `2021_FN_Q53`)!
   - *What to notice:* Why subtracting `(All_Pairs - Actual)` finds everyone missing at least ONE brand, so subtracting *them* leaves people owning ALL brands!
   - *Format:* **Step-by-step series of pictures**
8. **TRC Safe vs Unsafe Domain Fence (`2017_FN_Q39` Anomaly)**
   - *What to draw:* Two pools: finite DB constants (`EMP ∪ DEPT`) inside a fence vs infinite external integers (`999, 1000, ...`) outside the fence, showing `t[DeptId] != v[DeptId]` escaping outside when `t[DeptId]` isn't bound to `u[DeptId]`!
   - *What to notice:* Why formal TRC safety demands every returned field `t[attr]` be bounded by a positive DB membership condition.
   - *Format:* **Single picture**

### Ch 04 · SQL
9. **7-Step SQL Query Execution Pipeline & 3-Valued `NULL` Truth Table**
   - *What to draw:* A top-to-bottom factory assembly line (`1. FROM/JOIN -> 2. WHERE (row filter) -> 3. GROUP BY (buckets!) -> 4. HAVING (bucket filter) -> 5. SELECT (compute/agg) -> 6. DISTINCT -> 7. ORDER BY`), next to the `TRUE / FALSE / UNKNOWN` table showing `NULL = NULL -> UNKNOWN`, `5 NOT IN (1, NULL) -> UNKNOWN (empty!)`, and `COUNT(*)` vs `COUNT(col)`.
   - *What to notice:* Why `WHERE` cannot use `AVG(sal)` or `SELECT` aliases, and how `GROUP BY` collapses each bucket into 1 summary row!
   - *Format:* **Single picture**
10. **Uncorrelated vs Correlated Subquery (`EXISTS` / `NOT EXISTS` Division, `2025_AN_Q54`, `2022_FN_Q56`, `2021_AN_Q45`)**
    - *What to draw:* Left: Uncorrelated `(SELECT AVG(salary) FROM emp)` computing ONE global scalar `65,000` once before scanning `emp` (`2021_AN_Q45`). Right: Correlated outer row `S` passing its `S.sNo` down into the inner `EXCEPT` / `EXISTS` check row-by-row (`2022_FN_Q56`, `2025_AN_Q54`)!
    - *What to notice:* How `S` inside the inner query connects each outer student to their personal registered courses.
    - *Format:* **Step-by-step series of pictures**

### Ch 05 · Functional Dependencies and Normal Forms
11. **Armstrong's Axioms Map & `L / M / R / Neither` Candidate Key Buckets**
    - *What to draw:* Proof diagram of `Union` using ONLY Augmentation + Transitivity (`2026_AN_Q42`), beside the 4-bucket attribute sorter (`Only-LHS & Neither` [MUST be in every CK] -> `Both` [maybe] -> `Only-RHS` [never in minimal CK]) tracing `2025_AN_Q46` and `2019_FN_Q37`!
    - *What to notice:* If `L ∪ N`'s closure already reaches ALL attributes, it is the ONE AND ONLY Candidate Key!
    - *Format:* **Single picture** + **Trace table**
12. **3-Step Canonical Cover Trace (`2017_FN_Q17`) & Normal Form Staircase (`1NF -> 2NF -> 3NF -> BCNF`)**
    - *What to draw:* Trace of `2017_FN_Q17` (`Split RHS -> Drop Extraneous LHS -> Drop Redundant FD`) alongside a 4-step staircase comparing exact violation examples (`1NF` set attr, `2NF` partial dep on non-prime, `3NF` transitive dep on non-prime, `BCNF` non-superkey -> prime, `2018_FN_Q52`, `2020_FN_Q65`)!
    - *What to notice:* Notice BCNF simply says *"Every arrow's left side MUST be a superkey"* — while 3NF gives a single loophole (*"OR right side is prime"*).
    - *Format:* **Trace table** + **Single picture**
13. **Multi-Table Chase Matrix (`a_i, b_{ij}`, `2021_FN_Q40`)**
    - *What to draw:* Grid of sub-relations × attributes initialized with `a_j` (present) and `b_{i,j}` (absent), applying FDs row-by-row until one full `a_1 a_2 ... a_n` row appears (`D_1` Lossless!) vs gets stuck (`D_2` Lossy!).
    - *What to notice:* When decomposing into 3+ tables (`2021_FN_Q40`), checking pairwise joins isn't enough if you join in the wrong order — the Chase test handles ANY number of tables deterministically!
    - *Format:* **Trace table**

### Ch 06 · File Organization and Indexing (B and B+ Trees)
14. **Primary (Sparse) vs Clustered vs Secondary (Dense) Index Layouts (`2026_AN_Q46`, `2023_FN_Q62`, `2021_AN_Q26`)**
    - *What to draw:* Three pairs of `Index File -> Data Blocks`: (1) Primary Sparse (ordered PK, 1 entry per data block, `2023_FN_Q62`), (2) Clustered (ordered non-key, 1 entry per distinct value), (3) Secondary Dense (unordered data -> 1 entry per EVERY record!, `2021_AN_Q26`) + Unspanned `BFR = floor(B/R)` block-waste illustration!
    - *What to notice:* Why an index on a non-ordering column (even a Candidate Key like `ANum`, `2021_AN_Q26`) MUST be Dense!
    - *Format:* **Single picture**
15. **B-Tree vs B+ Tree Node Byte Rulers (`2020_FN_Q51`, `2017_AN_Q54`) & Multi-Level Split Frames (`2025_AN_Q57`)**
    - *What to draw:* Top: Zoomed byte layouts of Internal B-Tree node (`p*Bptr + (p-1)*(Key + Rptr)`), Internal B+ node (`p*Bptr + (p-1)*Key`, NO record pointers!, `2019_FN_Q20`), and Leaf B+ node (`L*(Key + Rptr) + 1*NextLeafPtr`). Bottom: Step-by-step frames inserting `23` into `C = (20*,22*,25*,26*)`, splitting `C`, copying up to full `B = (7,19,33,44)`, pushing `25` up to `A`, and checking parent `(33, 44)` (`2025_AN_Q57`)!
    - *What to notice:* B+ internal nodes pack way more fanout because they omit record pointers, AND leaf splits **copy** up while internal splits **push** up!
    - *Format:* **Single picture** + **Step-by-step series of pictures**

### Ch 07 · Transactions and Recovery
16. **Recoverability Onion (`Strict ⊂ Cascadeless ⊂ Recoverable ⊂ All`) & Precedence Graph (`2025_AN_Q53`, `2021_AN_Q34`)**
    - *What to draw:* Four nested ovals showing exact `W->R` / `W->W` commit rules with concrete counterexamples sitting inside each gap (`2025_FN_Q15`, `2021_AN_Q34`), paired with Precedence Graph construction (`R-W`, `W-R`, `W-W` edges -> Cycle = Not CS; Acyclic = Topological Serial Order, `2022_FN_Q39`, `2024_FN_Q45`)!
    - *What to notice:* Conflict graphs draw `T_i -> T_j` whenever ANY conflicting pair on the SAME item orders `T_i` before `T_j` (never for `R-R`, `2026_AN_Q20`!).
    - *Format:* **Single picture** + **Step-by-step series of pictures**
17. **Conflict vs View Serializability Venn & `54`-Schedule Counting Tree (`2017_AN_Q62`)**
    - *What to draw:* Nested ovals (`Conflict CS ⊂ View CS`) with a 3-transaction blind-write witness (`R1(Q), W2(Q), W1(Q), W3(Q)`), plus the split-at-`w2(Y)` counting breakdown (`1` for `T1 < T2` + `15 + 20 + 18 = 53` for `T2 < T1` = `54`, `2017_AN_Q62`).
    - *What to notice:* Without blind writes, View Serializability and Conflict Serializability are identical!
    - *Format:* **Single picture** + **Trace table**
18. **WAL Log + Crash-During-Recovery Idempotency (`2021_FN_Q28`)**
    - *What to draw:* Log stream `<T1, start>, <T1, X, 10, 20>, <T1, commit>, <T2, start>, <T2, Y, 5, 9> [CRASH]` -> Recovery builds `UNDO={T2}, REDO={T1}` -> Crash mid-recovery -> Reboot reads same WAL log -> repeats exact same `UNDO={T2}, REDO={T1}` cleanly!
    - *What to notice:* Repeating `X = 20` (REDO) or `Y = 5` (UNDO) twice produces the exact same safe final value (idempotent!).
    - *Format:* **Step-by-step series of pictures**

### Ch 08 · Concurrency Control
19. **2PL Lock-Count Curve (`Growing vs Shrinking`), Lock Upgrade Deadlock & Strict 2PL (`2024_AN_Q31`)**
    - *What to draw:* Graph of `# locks held` rising smoothly in Phase 1 (Growing) and dropping in Phase 2 (Shrinking), contrasted with Strict 2PL holding X-locks flat until `COMMIT` (`2019_FN_Q27`), plus a 2-thread `S(X) -> upgrade X(X)` deadlock diagram!
    - *What to notice:* Once a transaction releases ONE lock in Basic 2PL, it can NEVER acquire any lock again (`2024_AN_Q31(C)`), which forces serializability yet still permits deadlocks (`2024_AN_Q31(D)`).
    - *Format:* **Single picture** + **Step-by-step series of pictures**
20. **Wound-Wait vs Wait-Die Timelines (`2017_FN_Q51`) & Thomas' Write Rule (`2019_FN_Q27`)**
    - *What to draw:* Left: Older `T1` (`TS=5`) vs Younger `T2` (`TS=10`) under Wait-Die (Younger dies!) and Wound-Wait (Older wounds Younger; Younger waits -> `2017_FN_Q51`), keeping original `TS` on restart. Right: Timestamp timeline showing `T_old` writing `X` after `T_new` already wrote `X` -> Basic TO aborts `T_old`, while Thomas' Write Rule silently ignores the obsolete write (`View Serializable`!)!
    - *What to notice:* Why arrows in Wait-For Graph point strictly along timestamps (no cycles = deadlock-free!) and why keeping original `TS` guarantees starvation-freedom (`2017_FN_Q51`)!
    - *Format:* **Step-by-step series of pictures**

---

## PART 5. THE FULL PLAN, CHAPTER BY CHAPTER

*(Starting with Chapter 00 and Chapter 01 below; continuing from Chapter 02 on next turn!)*

### Chapter 00 · DBMS Foundations & 3-Schema Architecture *(New Prerequisite Chapter)*

#### Lesson 00.1 · Why DBMS? 3-Schema Architecture, Data Independence & Abstraction
- **Tag:** `[MUST]` — Zero-level intro unlocking `2026_AN_Q15` and motivating Normalization, Indexes, and Transactions.
- **Estimated reading time:** 45 minutes.
- **Prerequisites:** None (familiarity with folders/spreadsheets).
- **Beginner must-see:** Storing college records in plain Excel/text files causes 4 disasters: duplicate inconsistent files, zero crash recovery, one user blocking another, and rewriting Python code every time you move a file! A **DBMS** solves all 4 behind a 3-layer wall: **External Schemas** (what each user sees: Views!), **Logical Schema** (the relational tables!), and **Physical Schema** (how files & B+ indexes actually sit on disk blocks, `2026_AN_Q15`)!
- **Finer points:**
  - **Schema** (design blueprint) vs **Instance** (live rows at time $t$).
  - **3-Schema Architecture (`2026_AN_Q15`):** External (`Views`) <-> Conceptual/Logical (`Relations`) <-> Physical/Internal (`File organization & Indexes`).
  - **Physical Data Independence** (change B+ tree / disk layout without breaking table definitions or SQL!) vs **Logical Data Independence** (split/add table columns without breaking user Views!).
  - Brief preview roadmap linking the 3 pillars of GATE DBMS: **Design (`Ch 01, 02, 05`)**, **Querying (`Ch 03, 04`)**, and **Storage + Concurrency (`Ch 06, 07, 08`)**.
- **GATE-level items:** Exact mapping of Logical/Physical/External schemas to Relations/Files-Indexes/Views (`2026_AN_Q15`).
- **Diagrams needed:** `MEMORY` / `COMPARE` (3-Schema Architecture Tower + Data Independence barriers, `2026_AN_Q15`).
- **Hand traces:** Tracing two real changes (adding a B+ tree index vs splitting a `Name` column) to classify Physical vs Logical Data Independence.
- **Common mistakes:** Swapping Logical (`Relations`) and External (`Views`) schemas (`2026_AN_Q15`); confusing Schema (structure) with Instance (snapshot).

---

### Chapter 01 · Entity-Relationship (ER) Model

#### Lesson 01.1 · ER Building Blocks: Entities, Attributes, Weak Entities & Cardinality Constraints
- **Tag:** `[MUST]` — Directly covers `2024_FN_Q24`, `2024_AN_Q22`, `2020_FN_Q13`, `2018_FN_Q21`.
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 00.1.
- **Beginner must-see:** Before writing SQL `CREATE TABLE`, engineers draw a simple map on paper using **Rectangles (Things/Entities)**, **Ovals (Properties/Attributes)**, and **Diamonds (Connections/Relationships)**! Some entities cannot stand alone (like a Bank Loan's `Installment` without its `Loan` — a **Weak Entity** drawn with double borders!), so it MUST connect completely (**Total Participation**) to its owner (`2024_AN_Q22`, `2020_FN_Q13`)!
- **Finer points:**
  - **Entity Sets vs Relationships:** Identifying entities & relationships from English problem text (`2024_FN_Q24`: *"Instructors teach courses..."*).
  - **Attributes:** Simple vs Composite (`Name -> First, Last`), Single-valued vs Multivalued (double oval), Stored vs Derived (dashed oval), Key (solid underline) vs Discriminator (dashed underline).
  - **Cardinality Ratios (`1:1, 1:N, M:1, M:N`) & Participation (`Total` double line vs `Partial` single line):**
    - Reading `M:1` total from `E1` to `E2` (`2018_FN_Q21`: every entity in `E1` associates with **exact 1** in `E2`; every `E2` associates with $\ge 1$ in `E1` since both total!).
    - Min-Max `(min, max)` notation (`(1, 1)` = total & many-to-one!).
  - **Weak Entities (`2024_AN_Q22`, `2020_FN_Q13`):** Double rectangle, Double diamond for identifying relationship, **MUST have total participation** on weak side (`2024_AN_Q22`), partial allowed on owner!
- **GATE-level items:** Matching English specs to ER diagrams (`2024_FN_Q24`), Weak entity double-diamond symbol (`2020_FN_Q13`), Weak entity total participation (`2024_AN_Q22`), and `M:1` total mapping truths (`2018_FN_Q21`).
- **Diagrams needed:** `CHEATPIC` (Full ER Symbol Glossary + Cardinality/Participation dot-mapping diagrams `1:1, 1:N, M:1, M:N`); `GRAPHPIC` (Owner `Loan` + Weak Entity `Payment` with double rectangle, double diamond, double line).
- **Hand traces:** Mapping 4 entities of `E1` onto 2 entities of `E2` under total `M:1` (`2018_FN_Q21`); translating `2024_FN_Q24`'s 4 sentences step by step into ER edges.
- **Common mistakes:** Putting double border on the owner instead of the weak entity, or forgetting weak entity participation is ALWAYS total (`2024_AN_Q22`); flipping `M:1` vs `1:M` arrow direction (`2018_FN_Q21`: arrow `->` usually marks the `"1"` side in Korth/Silberschatz!).

#### Lesson 01.2 · Converting ER Diagrams to Relational Tables (Minimum Tables & Generalization)
- **Tag:** `[MUST]` — High-yield design rule (`2017_AN_Q22` + classic min-table GATE problems).
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 01.1.
- **Beginner must-see:** Databases store **Tables**, not diamonds! Converting an ER map into tables follows clean rules — and you don't always need a separate table for every diamond! Whenever `A` participates **totally** in a **Many-to-One** relationship `R` to `B`, you can fold `R` straight into `A`'s table as a Foreign Key column with zero NULLs (`2017_AN_Q22`)!
- **Finer points:**
  - **Strong Entity -> Table:** Flatten composite attributes into columns; create a **separate table** `(Entity_PK, multivalued_attr)` for each multivalued attribute (`2018_FN_Q52(I)`).
  - **Relationship Reduction Rules (`2017_AN_Q22`):**
    - `M:N`: MUST create a separate junction table `(A_PK, B_PK, R_attrs)` (key = `A_PK + B_PK`).
    - `M:1` (from `A` to `B`): Merge `R` into `A` (add `B_PK` + `R_attrs` to `A`); **no separate table needed, AND zero NULLs if `A` is total (`2017_AN_Q22(C)`!)**! (Note why `1:N` from `A` to `B` merges into `B`, NOT `A` -> `2017_AN_Q22(A)` fails!).
    - `1:1`: Merge into either total-participation side (or both if both total -> 1 single table!).
    - **Weak Entity:** Table `(Owner_PK, Weak_Discriminator, other_attrs)` — no separate table for identifying diamond!
  - **Ternary Relationships & Self-Relationships (`Recursive`):** Ternary `R(A, B, C)` becomes 1 junction table; why 3 binary diamonds cannot replace 1 ternary diamond!
  - **ISA / Generalization (`[SHOULD]`):** Overlap/Disjoint + Total/Partial mapping strategies (`3 tables` vs `2 subclass tables` vs `1 wide table with NULLs`).
- **GATE-level items:** Exact condition to merge relationship table `R` with `A` (`2017_AN_Q22`: many-to-one + total participation of `A`); finding minimum relational tables for a full ER diagram with weak entities, multivalued attributes, and `1:N`/`M:N` links.
- **Diagrams needed:** `FRAMES` (ER diagram -> Relational Tables side-by-side across `1:1`, `1:N`, `M:1 total [merged!]`, `M:N`, Weak Entity, Multivalued, Ternary).
- **Hand traces:** Converting a 4-entity University ER diagram (`Student, Course, Dept, Dependent`) into minimum relational tables and identifying all Primary + Foreign Keys.
- **Common mistakes:** Merging `1:N` (from `A` to `B`) into `A` instead of `B` (`2017_AN_Q22(A)` trap — `A` can link to multiple `B`'s, violating 1NF!); forgetting multivalued attributes spawn an extra table; merging `M:N` relationships!

---

`CONTINUE FROM CHAPTER 02`
## PART 5 (Continued) · Chapters 02 to 05

### Chapter 02 · Relational Model and Integrity Constraints

#### Lesson 02.1 · Relations, Keys, Superkey Counting & Referential Integrity (`CASCADE`, `SET NULL`)
- **Tag:** `[MUST]` — Essential vocabulary and guaranteed NAT/MCQ points (`2026_FN_Q65`, `2023_FN_Q16`, `2022_FN_Q31`, `2021_AN_Q16`, `2017_AN_Q26`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 01.2 (tables from ER), basic set inclusion-exclusion.
- **Beginner must-see:** A **Relation** is just a strict spreadsheet table where EVERY row (**Tuple**) is unique and EVERY cell holds ONE single value! To guarantee no duplicate rows and link tables safely, databases use **Keys** (from bloated **Superkeys** down to minimal **Candidate Keys** and one chosen **Primary Key**) plus **Foreign Keys** acting like strict pointers to another table (or even to the *same* table! `2021_AN_Q16`).
- **Finer points:**
  - **Terminology (`2023_FN_Q16`):** Relation Schema vs Instance, **Degree/Arity** = number of attributes (columns), Cardinality = number of tuples (rows), Domain = allowed values, `NULL` (missing/unknown).
  - **Key Hierarchy & Rules (`2021_AN_Q16`):**
    - Superkey $\supseteq$ Candidate Key (minimal superkey — removing any attribute breaks uniqueness!).
    - Primary Key (no `NULL`s allowed — **Entity Integrity**) vs Alternate Keys.
    - Foreign Key (**Referential Integrity**): matches Primary/Candidate key of referenced table OR is `NULL` (if allowed, `2017_FN_Q39`); a table can have **multiple FKs** AND **self-referencing FKs** (`2021_AN_Q16`!).
  - **Counting Superkeys (`2026_FN_Q65`, `2022_FN_Q31`):**
    - 1 Candidate Key of size $k$ in $n$-attr relation $\implies 2^{n-k}$ superkeys (`2022_FN_Q31`: `8`).
    - 2+ Candidate Keys $K_1, K_2$: Inclusion-Exclusion $2^{n-|K_1|} + 2^{n-|K_2|} - 2^{n-|K_1 \cup K_2|}$ (`2026_FN_Q65`: `4 + 4 - 2 = 6`!).
  - **Referential Integrity Actions (`2017_AN_Q26`):** `RESTRICT/NO ACTION`, `ON DELETE/UPDATE CASCADE`, `ON DELETE/UPDATE SET NULL` — tracing mutual/cyclic foreign keys between `T1` and `T2` (`2017_AN_Q26`)!
- **GATE-level items:** Degree definition (`2023_FN_Q16`), multiple & self-referencing FKs (`2021_AN_Q16`), superkey counting (`2026_FN_Q65`, `2022_FN_Q31`), and cyclic `CASCADE` vs `SET NULL` delete traces (`2017_AN_Q26`).
- **Diagrams needed:** `MEMORY` (Sample `EMP` table labelling Schema, Degree, Cardinality, Tuple, Self-FK `mgrId -> empId`); `CHEATPIC` (Venn diagram for Superkey counting `AB ∪ AC`, `2026_FN_Q65`); `FRAMES` (Cyclic `T1 <-> T2` deletion tracing `CASCADE` vs `SET NULL`, `2017_AN_Q26`).
- **Hand traces:** Computing superkeys for `2026_FN_Q65` (`6`) and `2022_FN_Q31` (`8`), and tracing a 2-table `ON DELETE CASCADE` vs `ON DELETE SET NULL` chain (`2017_AN_Q26`).
- **Common mistakes:** Forgetting to subtract intersection $|SK(K_1) \cap SK(K_2)|$ when counting superkeys (`4 + 4 = 8` instead of `6` in `2026_FN_Q65`!); thinking a relation can only have 1 FK or cannot self-reference (`2021_AN_Q16`); deleting the `SET NULL` target's rows when action is `SET NULL` (`2017_AN_Q26`!).

---

### Chapter 03 · Relational Algebra and Tuple Calculus

#### Lesson 03.1 · Relational Algebra: Operators, Joins, Outer Joins, Division & Selectivity
- **Tag:** `[MUST]` — High-yield 2-mark question generator (`2024_FN_Q35`, `2024_AN_Q59`, `2022_FN_Q25`, `2021_FN_Q45`, `2021_FN_Q53`, `2019_FN_Q47`, `2018_FN_Q51`, `2017_FN_Q38`).
- **Estimated reading time:** 90 minutes.
- **Prerequisites:** Lesson 02.1.
- **Beginner must-see:** **Relational Algebra (RA)** is a pipeline of table-crunching machines (`σ` filters rows, `π` picks columns and **auto-deletes duplicates!**, `×` pairs every row with every row, `⋈` pairs matching rows, `÷` finds *"who did ALL of them!"*). Unlike SQL, RA works purely on mathematical **Sets** — zero duplicate rows survive!
- **Finer points:**
  - **Fundamental Operators (`σ, π, ×, ∪, −, ρ`):** Union/Intersection/Difference require **Union Compatibility** (same arity + compatible domains).
  - **Join Varieties & Edge Cases:**
    - Cartesian `×` -> Theta Join `⋈_θ` -> Equi Join -> **Natural Join (`⋈`):** merges identical column names (if 0 common cols = `×`; if all common cols = `∩`!).
    - **Self-Join Tricks:** `"Not the minimum"` via `age > age1` (`2021_FN_Q53`), and `"At least k = 3 distinct items"` needing **`k - 1 = 2` cross-products (`2024_AN_Q59`)**!
    - **Outer Joins (`LOJ, ROJ, FOJ`) & Selection Pushdown Trap (`2018_FN_Q51`):** Why `r ⋈ σ_{B<5}(s)` does NOT equal `r LOJ σ_{B<5}(s)` (because `LOJ` keeps unmatched `r` rows with `B >= 5` padded with `NULL`s!).
  - **Relational Division (`R ÷ S`) (`2022_FN_Q25`, `2017_FN_Q38`):**
    - Expressing `"for ALL"` using `×` and `−`: $\pi_A(R) - \pi_A((\pi_A(R) \times S) - R)$ (`2022_FN_Q25(B)`!).
    - Careful: Divide by `Brand`, NOT by `\pi_{bId}(Own)` (`2022_FN_Q25(C)` trap)!
  - **Selectivity & Output Size Estimation (`2021_FN_Q45`):** Independence rule $P(A \lor B) = P(A) + P(B) - P(A)P(B)$, and Join min/max bounds (`0` to `|R|·|S|`, or `|R|` when FK->PK without NULLs!).
- **GATE-level items:** Self-join minimum cross products (`2024_AN_Q59`: `2`), `not minimum` self-join (`2021_FN_Q53`), Division & algebraic rewrite (`2022_FN_Q25`, `2017_FN_Q38`), `LOJ` equivalence trap (`2018_FN_Q51`), and selectivity `OR` estimate (`2021_FN_Q45`: `820`).
- **Diagrams needed:** `FRAMES` (4-step visual trace of `Own ÷ Brand` via `×` and `−`, `2022_FN_Q25`); `COMPARE` (`r ⋈ σ(s)` vs `r LOJ σ(s)` on a 3-row table, `2018_FN_Q51`); `TRACE` (`empAge` self-join `age > age1`, `2021_FN_Q53`).
- **Hand traces:** Tracing `2021_FN_Q53`, `2024_AN_Q59`, `2022_FN_Q25`, `2018_FN_Q51`, and computing `2021_FN_Q45` (`1200 × (2/3 + 1/20 - 1/30) = 820`).
- **Common mistakes:** Forgetting `π` drops duplicate rows automatically; pushing `σ` onto the right table of a `LOJ` (`2018_FN_Q51`!); dividing by `\pi_{bId}(Own)` instead of `Brand` (`2022_FN_Q25(C)`!); counting `3` cross products for 3 tables (`3` tables use only **`2`** `×` operators, `2024_AN_Q59`!).

#### Lesson 03.2 · Tuple & Domain Relational Calculus (`TRC`, `DRC`) & Query Safety
- **Tag:** `[MUST]` — Regularly tested (`2026_FN_Q43`, `2025_FN_Q39`, `2017_FN_Q39`).
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 03.1, basic predicate logic (`∃, ∀, ⇒`).
- **Beginner must-see:** Instead of telling the database *how* to join tables (RA), **Tuple Relational Calculus (TRC)** just describes *what properties the answer rows must satisfy* (`{p.pname | p ∈ players ∧ ...}`, `2025_FN_Q39`), like set-builder notation in math! Watch out: careless formulas like `{t | t ∉ R}` ask for infinitely many imaginary strings in the universe (**Unsafe Query**)!
- **Finer points:**
  - **Two Syntax Styles (`2025_FN_Q39` vs `2026_FN_Q43`):**
    - Tuple dot-notation: `{p.pname | p ∈ players ∧ ∃t (t ∈ teams ∧ p.tid = t.tid ∧ ...)}` (`2025_FN_Q39`).
    - Positional tuple/DRC-like notation: `{<u> | ∃v ∃w (<u, v> ∈ R ∧ <v, w> ∈ S)}` -> join `R.Q = S.X`, project `R.P` (`2026_FN_Q43`)!
  - **Free vs Bound Variables & Quantifier Traps:** `∃` (there exists at least one), `∀x (P(x) ⇒ Q(x))` ("for all" implication, NOT `∧`!).
  - **Domain & Query Safety (`2017_FN_Q39`):**
    - A TRC query is **Safe** iff all values appearing in every returned tuple MUST come from the **active domain `dom(I)`** (constants in query + values actually stored in DB relations!).
    - **Explicit GATE 2017 Anomaly Warning (`2017_FN_Q39`):** Explain why under strict textbook rules `t[DeptId]` in `I` & `II` is unbound (making only `III` formally safe!), while IIT Roorkee's official key marked `D (I, II, and III)`!
- **GATE-level items:** Translating TRC/positional queries to RA (`2026_FN_Q43`: `S.X = R.Q`), spotting missing join links in TRC (`2025_FN_Q39(C)`), and identifying Safe vs Unsafe queries (`2017_FN_Q39`).
- **Diagrams needed:** `COMPARE` (TRC `{p.pname | ...}` mapped color-by-color to RA `π(σ(⋈))` and SQL); `MEMORY` (Active DB Finite Pool vs Infinite Outside Domain Fence for Safety, `2017_FN_Q39`).
- **Hand traces:** Translating `2026_FN_Q43` (`<u>, <u,v>, <v,w>`) into columns `(R.P, R.Q, S.X, S.Y)`; testing `2025_FN_Q39` options `A..D` on sample 2-row `teams` & `players`; testing `2017_FN_Q39` safety.
- **Common mistakes:** Dropping the join condition `p.tid = t.tid` inside `∃t` (`2025_FN_Q39(C)` returns EVERY player if ANY team `'MI'` exists!); matching wrong column order `<u, v> ∈ R` (`R.P` vs `R.Q`, `2026_FN_Q43`); using `∧` instead of `⇒` inside `∀`.

---

### Chapter 04 · SQL

#### Lesson 04.1 · SQL Execution Order, `NULL` 3-Valued Logic, Joins & `GROUP BY` / `HAVING`
- **Tag:** `[MUST]` — Highest Easy/Medium scoring chapter in DBMS (`2025_AN_Q54(D)`, `2023_FN_Q61`, `2021_AN_Q45`, `2019_FN_Q41`, `2018_FN_Q22`, `2017_FN_Q31`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 03.1.
- **Beginner must-see:** SQL writes `SELECT` at the very top, yet the database executes **`FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY`**! And whenever `NULL` shows up in a row, comparisons like `marks > 65` or `x = NULL` don't return False — they return **`UNKNOWN`**, which `WHERE` quietly throws away!
- **Finer points:**
  - **Bag Semantics:** `SELECT` keeps duplicate rows unless `DISTINCT` is written (whereas `UNION/INTERSECT/EXCEPT` drop duplicates unless `ALL` is written!).
  - **3-Valued `NULL` Logic & Aggregates:**
    - `TRUE, FALSE, UNKNOWN`; `IS NULL` / `IS NOT NULL`.
    - `COUNT(*)` counts ALL rows (including `NULL`s!); `COUNT(col)`, `SUM`, `AVG`, `MIN`, `MAX` ignore `NULL`s! (And `SUM`/`AVG` on 0 matching rows return `NULL`, while `COUNT` returns `0`!).
  - **Join Varieties & Traps:**
    - `INNER`, `LEFT`, `RIGHT`, **`FULL OUTER JOIN`** (superset of all three, `2018_FN_Q22`!).
    - `NATURAL JOIN` (`2025_AN_Q54(D)`): joins on ALL identically named columns!
    - **Missing Join Condition Cross-Join Bug (`2019_FN_Q41`):** `FROM Student S, Performance P WHERE P.Marks > 84` (NO `S.Roll_no = P.Roll_no`!) multiplies every Student with every passing Performance row!
  - **`GROUP BY` & `HAVING`:**
    - Strict rule: every non-aggregated column in `SELECT` MUST appear in `GROUP BY`.
    - `WHERE` filters *before* grouping; `HAVING` filters *groups* after `GROUP BY` (and works on 1 global group if `GROUP BY` is omitted!).
- **GATE-level items:** Computing exact row counts / aggregates on sample tables (`2023_FN_Q61`, `2019_FN_Q41` cross-join trap, `2017_FN_Q31`), `FULL OUTER JOIN` superset (`2018_FN_Q22`), and `NATURAL JOIN` (`2025_AN_Q54(D)`).
- **Diagrams needed:** `FLOW` (7-step SQL Execution Pipeline showing row snapshots shrinking & grouping at each stage); `MATRIX` (3-Valued Logic Table + `NULL` behavior across `WHERE`, `COUNT`, `GROUP BY`).
- **Hand traces:** Tracing `2019_FN_Q41` with and without `S.Roll_no = P.Roll_no`; tracing `GROUP BY` + `HAVING` + `NULL`s on a 6-row table.
- **Common mistakes:** Blindly assuming `FROM S, P` joins on `Roll_no` without a `WHERE`/`ON` clause (`2019_FN_Q41`!); writing `COUNT(col)` when rows contain `NULL`s; filtering aggregates inside `WHERE`.

#### Lesson 04.2 · Nested & Correlated Subqueries (`IN`, `EXISTS`, `EXCEPT`, `ANY`/`ALL`), Set Ops & DDL/Views
- **Tag:** `[MUST]` — Core 2-mark NAT/MSQ staple (`2025_AN_Q54`, `2025_FN_Q55`, `2022_FN_Q56`, `2020_FN_Q12`, `2017_AN_Q55`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 04.1, Lesson 03.1 (Division).
- **Beginner must-see:** An SQL query can hold *another* `SELECT` query inside its `WHERE`! Either the inner query runs **ONCE** upfront like a fixed number/list (**Uncorrelated**, `2025_FN_Q55`, `2021_AN_Q45`), OR it re-runs **separately for every outer row** using the outer row's columns (**Correlated**, `2025_AN_Q54`, `2022_FN_Q56`)!
- **Finer points:**
  - **Uncorrelated vs Correlated:**
    - `2021_AN_Q45`: `(select avg(salary) from emp)` computes global company average once!
    - `2025_AN_Q54`: `EXISTS (SELECT * FROM Enrolled E WHERE E.rollno = S.rollno ...)` checks per outer student `S` (and `SIZEOF(...)` is invalid SQL!).
  - **`> ALL`, `> ANY`, `IN`, `NOT IN` Traps (`2017_AN_Q55`):**
    - `x > ALL (sub)` means `x > MAX(sub)` (TRUE if `sub` is empty!); `x > ANY (sub)` means `x > MIN(sub)` (FALSE if `sub` is empty!).
    - **The `NOT IN` NULL Poison Pill:** `x NOT IN (1, 2, NULL)` becomes `x != 1 AND x != 2 AND x != NULL` (`UNKNOWN`) -> returns **ZERO rows**!! Use `NOT EXISTS` instead!
  - **SQL Division via `NOT EXISTS (... EXCEPT ...)` (`2022_FN_Q56`):** Exact equivalence to `R ÷ S` ("no required course of D01 is missing from student S's registrations").
  - **Set Operations & String/Range Helpers:** `UNION / INTERSECT / EXCEPT` (+ `ALL`), `BETWEEN` (inclusive!), `LIKE` (`%`, `_`), Top-$k$ / Nth highest salary patterns.
  - **DDL/DML/Views (`[SHOULD]`):** `DROP` vs `TRUNCATE` vs `DELETE`, `CHECK` constraints, `VIEW` updatability (`no aggregates/distinct/joins`).
- **GATE-level items:** Tracing `EXISTS` vs `COUNT(*) > 0` (`2025_AN_Q54`), nested `IN` (`2025_FN_Q55`), `NOT EXISTS (... EXCEPT ...)` SQL division (`2022_FN_Q56`), `> ALL` & `> ANY` (`2017_AN_Q55`), and global `AVG` subquery (`2021_AN_Q45`).
- **Diagrams needed:** `FRAMES` (Correlated loop running inner query once per outer tuple `S` in `2022_FN_Q56` & `2025_AN_Q54`); `COMPARE` (`IN` / `NOT IN` with `NULL` vs `EXISTS` / `NOT EXISTS`, and `> ALL` vs `> ANY`).
- **Hand traces:** Tracing `2022_FN_Q56` row by row for 4 students & 2 `D01` courses; evaluating `2017_AN_Q55` (`> ALL` Spain vs `> ANY` Germany); testing `5 NOT IN (1, NULL)`.
- **Common mistakes:** Using `NOT IN` when subquery can return `NULL`; thinking `EXISTS` fails when inner `SELECT *` returns duplicates (`EXISTS` only checks non-emptiness!); forgetting `GROUP BY pno` inside `2020_FN_Q12` still returns 1 scalar for `'P4'`.

---

### Chapter 05 · Functional Dependencies and Normal Forms

#### Lesson 05.1 · Functional Dependencies, Armstrong's Axioms, Attribute Closure & Minimal Cover
- **Tag:** `[MUST]` — Algebra engine behind all normalization questions (`2026_FN_Q30`, `2026_AN_Q42`, `2024_FN_Q44`, `2024_AN_Q39`, `2021_AN_Q28`, `2017_FN_Q17`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 02.1 (Keys).
- **Beginner must-see:** A **Functional Dependency (`X -> Y`)** is simply a strict promise: *"Whenever two rows agree on column(s) `X`, they MUST match on column(s) `Y`!"* (Like `RollNo -> Name`). Given a handful of FDs, computing **Attribute Closure `X^+`** lets us discover ALL hidden promises, ALL **Candidate Keys**, and clean up redundant clutter (**Canonical Cover**)!
- **Finer points:**
  - **Trivial (`Y ⊆ X`), Non-Trivial (`Y ⊈ X`), Completely Non-Trivial / Useful (`X ∩ Y = ∅`, `X, Y != ∅`)** -> count of useful FDs on $n$ attributes = **$3^n - 2^{n+1} + 1$** (`2024_AN_Q39`: `81 - 32 + 1 = 50`!).
  - **Armstrong's 3 Axioms & Proof Dependencies (`2026_AN_Q42`, `2026_FN_Q30`, `2024_FN_Q44`):**
    - Reflexivity, Augmentation, Transitivity -> Union (**needs Augmentation + Transitivity ONLY!** `2026_AN_Q42`), Decomposition, Pseudotransitivity (`2024_FN_Q44(C)`), Composition (`2026_FN_Q30(C)`).
    - Fallacies: `PQ -> R` does NOT mean `P -> R` or `Q -> R`! (`2026_FN_Q30(A,B)`, `2024_FN_Q44(A)`).
  - **Attribute Closure `X^+` (`2021_AN_Q28`) & Equivalence of FD Sets ($F \equiv G$).**
  - **L / M / R / Neither Candidate Key Method (`2025_AN_Q46`, `2019_FN_Q37`):** Attributes NEVER on RHS (`L` + `N`) MUST belong to EVERY candidate key!
  - **3-Step Canonical / Minimal Cover (`2017_FN_Q17`):** (1) Split RHS to singletons, (2) Remove extraneous LHS attributes (`V -> W` + `VW -> X` drops `W` -> `V -> X`!), (3) Remove redundant FDs (`Y -> VX` + `V -> X` drops `Y -> X`!).
- **GATE-level items:** Proving Union without Reflexivity (`2026_AN_Q42`), FD implication MSQs (`2026_FN_Q30`, `2024_FN_Q44`, `2021_AN_Q28`), counting useful FDs (`2024_AN_Q39`: `50`), and finding irreducible canonical cover (`2017_FN_Q17`).
- **Diagrams needed:** `TRACE` (4-bucket `L/M/R/N` key-finder + iterative `X^+` loop); `FRAMES` (3-step Canonical Cover reduction on `2017_FN_Q17`); `GRAPHPIC` (3-subset partition proof of `3^n - 2^{n+1} + 1`, `2024_AN_Q39`).
- **Hand traces:** Proving `Union` from `Augmentation + Transitivity` (`2026_AN_Q42`: `X->Y => X->XY` via `Z=X`, `X->Z => XY->YZ` via `Y`, Transitivity `X->YZ`!); computing `2017_FN_Q17` minimal cover; deriving `50` in `2024_AN_Q39`.
- **Common mistakes:** Splitting the LEFT side of `PQ -> R` into `P -> R` (`2026_FN_Q30(B)`, `2024_FN_Q44(A)`!); omitting Reflexivity is valid in `Union` proof (`2026_AN_Q42`: you don't need Reflexivity!); removing redundant FDs *before* removing extraneous LHS attributes (`2017_FN_Q17`!).

#### Lesson 05.2 · Normal Forms (`1NF, 2NF, 3NF, BCNF`), Lossless Join (`Chase`), Dependency Preservation & Synthesis
- **Tag:** `[MUST]` — Guaranteed 1–2 questions per paper (`2026_FN_Q31`, `2025_AN_Q46`, `2025_FN_Q47`, `2024_FN_Q25`, `2022_FN_Q14`, `2021_FN_Q40`, `2020_FN_Q65`, `2019_FN_Q37`, `2018_FN_Q52`).
- **Estimated reading time:** 90 minutes.
- **Prerequisites:** Lesson 05.1.
- **Beginner must-see:** Why split one huge table into smaller tables? Because cramming Student + Course + Department into one sheet causes **Update/Insert/Delete Anomalies**! Normal Forms (`1NF -> 2NF -> 3NF -> BCNF`) are stricter cleanliness levels — yet splitting carelessly loses data (**Lossy Join**) or loses promises (**Lost FDs**)!
- **Finer points:**
  - **The 4 Normal Forms & Exact Boundary Tricks:**
    - **1NF (`2024_FN_Q25`, `2018_FN_Q52(I)`):** Atomic cells (no set/composite attrs); can still have multi-attr keys & multiple CKs!
    - **2NF:** 1NF + NO partial dependency (`proper subset of CK -> non-prime`).
    - **3NF (`2025_AN_Q46`, `2020_FN_Q65`):** Every non-trivial FD $X \to A$ has **`X` superkey OR `A` prime attribute**!
    - **BCNF (`2022_FN_Q14`, `2018_FN_Q52`):** Every non-trivial FD $X \to A$ has **`X` superkey**!
    - **Boundary Theorems:** Any 2-attribute table is ALWAYS in BCNF (`2022_FN_Q14`); All-prime table is ALWAYS in 3NF, yet NOT always BCNF (`2018_FN_Q52(II)`); `3NF` NOT in `BCNF` MUST have `X -> A` where `X` isn't superkey and `A` is prime (`2020_FN_Q65`).
  - **Lossless Join Test:**
    - 2-table shortcut (`2025_FN_Q47`, `2019_FN_Q37`): $(R_1 \cap R_2)^+$ contains $R_1$ OR $R_2$.
    - Multi-table **Chase Algorithm (`2021_FN_Q40`):** Build matrix (`a_j` / `b_{ij}`), apply FDs to equate symbols, succeed iff some row turns into all `a_1..a_n`!
  - **Dependency Preservation & Decomposition Algorithms (`2026_FN_Q31`):**
    - Always possible: **Lossless + Dep-Preserving 3NF Synthesis** (remember Step 4: add a Candidate Key table if missing!) & 1NF/2NF (`2026_FN_Q31(A, B)`).
    - NOT always possible: **Dep-Preserving BCNF** (`2026_FN_Q31(C)`, e.g. `AB->C, C->B` -> BCNF splits into `(CB)` & `(AC)`, losing `AB->C`!).
  - **4NF & Multivalued Dependencies (`[LATER]`):** Eliminating independent `M × N` cross-product redundancy (`Course ->-> Hobby`) inside BCNF tables.
- **GATE-level items:** Classifying highest NF (`2025_AN_Q46`, `2018_FN_Q52`), multi-table Chase lossless check (`2021_FN_Q40`), BCNF/3NF decomposition properties (`2026_FN_Q31`, `2025_FN_Q47`, `2019_FN_Q37`), and 3NF-not-BCNF characterization (`2020_FN_Q65`).
- **Diagrams needed:** `FLOW` (4-step Normal Form decision tree `1NF -> 2NF -> 3NF -> BCNF`); `MATRIX` (Chase Algorithm table tracing `D_1` lossless vs `D_2` lossy in `2021_FN_Q40`); `COMPARE` (`3NF Synthesis` vs `BCNF Decomposition` on `AB->C, C->B`).
- **Hand traces:** Testing `R1` (`CK = AD`, `D->E` breaks 2NF/3NF!) and `R2` (`CK = C`, `A->D` breaks 2NF/3NF!) in `2025_AN_Q46`; running Chase Matrix on `2021_FN_Q40`; testing `Y=(PR), Z=(QRS)` in `2019_FN_Q37` (`Z` fails BCNF because `S->Q`!).
- **Common mistakes:** Checking only 1st candidate key (`{rollno, courseid}`) and forgetting `{email, courseid}` is ALSO a CK in `2018_FN_Q52(II)` (`rollno` is prime!); checking pairwise common attributes in `2021_FN_Q40` without full Chase propagation; forgetting a 2-attribute table can never violate BCNF (`2022_FN_Q14`).

---

`CONTINUE FROM CHAPTER 06`
## PART 5 (Continued) · Chapters 06 to 08

### Chapter 06 · File Organization, Indexing and B / B+ Trees

#### Lesson 06.1 · File Organization, Unspanned Storage & Index Types (`Primary`, `Clustered`, `Secondary`, `Hash`)
- **Tag:** `[MUST]` — Core disk block math (`2026_AN_Q46`, `2024_AN_Q16`, `2023_FN_Q62`, `2021_AN_Q26`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 02.1, OS Ch 07 (disk blocks).
- **Beginner must-see:** Scanning 150,000 unordered database rows on disk one block at a time takes forever! An **Index** is just a thin sorted lookup book (`key + pointer`) sitting in front of the giant data file: if the data itself is sorted on that key, we only need **1 pointer per page (Sparse Primary Index)**; if the data isn't sorted on that column (like a phone book sorted by RollNo while you search by Aadhaar), we need **1 pointer for EVERY single row (Dense Secondary Index)**!
- **Finer points:**
  - **Heap vs Sorted vs Hash Files (`2024_AN_Q16`):** Heap & Sorted files are I/O-efficient for full table scans (sequential block reads!); Unclustered tree/hash indexes bounce randomly across disk blocks per record!
  - **Spanned vs Unspanned (Block-Aligned, `2023_FN_Q62`, `2021_AN_Q26`):** Blocking Factor `BFR = floor(BlockSize / RecordSize)` (`leftover bytes` wasted per block!).
  - **4 Index Categories (`2026_AN_Q46`):**
    1. **Primary Index:** Ordered file + Key field -> **Sparse** (`1` anchor entry per data block, `2023_FN_Q62`).
    2. **Clustering Index:** Ordered file + Non-key field -> **Sparse** (`1` entry per distinct search-key value).
    3. **Secondary Index:** Unordered (or ordered on *another* column!) -> **ALWAYS Dense** (`1` entry per record, even if key is a Candidate Key like `ANum`! `2021_AN_Q26`).
    4. **Hash Index (`2026_AN_Q46(S1)`):** Buckets aren't ordered globally -> **MUST be Dense**!
  - **Binary Search on Index (`2023_FN_Q62`):** `ceil(log_2(b))` block accesses for `b`-block ordered index file.
- **GATE-level items:** Dense hash vs sparse B+ (`2026_AN_Q46`), full-scan file organization efficiency (`2024_AN_Q16`), primary index binary search block accesses (`2023_FN_Q62`: `6`), and secondary dense index block count (`2021_AN_Q26`: `698`).
- **Diagrams needed:** `MEMORY` (Unspanned `BFR = floor(B/R)` block alignment showing leftover slack bytes); `COMPARE` (Primary Sparse vs Clustered Sparse vs Secondary Dense vs Hash Index layouts + 5×5 Scan/Search/Insert I/O matrix).
- **Hand traces:** Computing `2023_FN_Q62` (`10 rec/blk -> 2500 blocks -> 51 entries/idx blk -> 50 idx blks -> ceil(log2 50) = 6`) and `2021_AN_Q26` (`floor(4096/19) = 215 -> ceil(150000/215) = 698`).
- **Common mistakes:** Dividing `TotalDataBytes / BlockSize` instead of using integer `floor(B / R)` (`2023_FN_Q62` gives `25000*100/1024 = 2442` wrong instead of `2500`!); treating an index on Candidate Key `ANum` as sparse when the file is sorted on `RollNo` (`2021_AN_Q26`!).

#### Lesson 06.2 · B-Trees and B+ Trees: Order, Byte Capacity, Height & Multi-Level Splits
- **Tag:** `[MUST]` — Regular 2-mark NAT/MSQ staple (`2025_FN_Q21`, `2025_AN_Q57`, `2024_FN_Q11`, `2020_FN_Q51`, `2019_FN_Q20`, `2017_AN_Q54`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 06.1, DS `D8` (B/B+ trees).
- **Beginner must-see:** Why does a 20-level Binary Search Tree fail on a hard disk? Because 20 pointer hops mean 20 slow mechanical disk reads! A **B+ Tree** packs **hundreds of keys inside ONE 4 KB disk-block node** (`fanout = 200+`) so even 1 million records fit in just **3 tree levels** (`2020_FN_Q51`) — and links all leaves left-to-right like a chain for instant range queries!
- **Finer points:**
  - **B-Tree vs B+ Tree Structural Differences (`2019_FN_Q20`, `2024_FN_Q11`):**
    - B-Tree: Every node (internal AND leaf) holds `record pointers` + keys.
    - **B+ Tree (`2019_FN_Q20`):** Internal (non-leaf) nodes hold ONLY `keys + block pointers` (**NO record pointers!**); ALL data/record pointers live exclusively at the **leaf level**, linked sequentially!
    - **50% Occupancy Rule (`2024_FN_Q11`):** Every node except **Root** must stay at least half-full (`ceil(p/2)` pointers / `floor(max_keys/2)` or `ceil((p-1)/2)` keys).
  - **Order `p` & Capacity Equations (`2017_AN_Q54`, `2020_FN_Q51`):**
    - **B+ Internal Node (Order `p` = max children/block ptrs):** $p \cdot B_{\text{ptr}} + (p - 1) \cdot K \le \text{BlockSize}$ (`2017_AN_Q54`: $2p + 8(p-1) \le 512 \implies p = 52$!).
    - **B+ Leaf Node (`L` entries):** $L \cdot (K + R_{\text{ptr}}) + B_{\text{ptr}} \le \text{BlockSize}$ (`2020_FN_Q51`: $20L + 8 \le 4096 \implies L = 204$).
    - **B-Tree Internal Node:** $p \cdot B_{\text{ptr}} + (p - 1) \cdot (K + R_{\text{ptr}}) \le \text{BlockSize}$.
  - **B+ Tree Insertion & Split Mechanics (`2025_FN_Q21`, `2025_AN_Q57`):**
    - Pointer intervals `[k_1, k_2)` vs `(k_1, k_2]`.
    - **Leaf split COPIES** smallest key of right leaf up to parent; **Internal split PUSHES** middle key up to parent (removing it from the split children)!
    - Cascading splits up to root increase tree height (`2025_FN_Q21(D)`).
  - **Minimum Disk Accesses vs Maximum Height (`2020_FN_Q51`):** Max packing (`p^2 · L` etc.) minimizes tree height for `N` records (`3` index levels + `1` data read = `4`, `2020_FN_Q51`).
- **GATE-level items:** Maximum order `p` (`2017_AN_Q54`: `52`), min disk accesses for 1M records (`2020_FN_Q51`: `4`), multi-level B+ tree insertion split (`2025_AN_Q57`: `33`, `2025_FN_Q21`), root occupancy exception (`2024_FN_Q11`), and non-leaf pointer absence (`2019_FN_Q20`).
- **Diagrams needed:** `MEMORY` (Byte-ruler layouts of B-tree node vs B+ internal node vs B+ leaf node, `2017_AN_Q54`, `2020_FN_Q51`); `FRAMES` (Multi-level split inserting `23` into `C=(20*,22*,25*,26*)`, cascading into `B` and `A`, `2025_AN_Q57`).
- **Hand traces:** Solving `2017_AN_Q54` (`p = 52`), `2020_FN_Q51` (`205^2 × 204 >= 10^6 -> 3 + 1 = 4`), and tracing `2025_AN_Q57` under BOTH 2+3 and 3+2 leaf splits (both yielding `33`).
- **Common mistakes:** Putting record pointers inside B+ internal nodes (`2019_FN_Q20`!); confusing `order p` (`max block pointers = 52`) with `max keys = 51` (`2017_AN_Q54`); forgetting `+ 1` final data-block access after reaching B+ leaf (`3 + 1 = 4` in `2020_FN_Q51`!); pushing instead of copying up on a leaf split (`2025_AN_Q57`).

---

### Chapter 07 · Transactions, Serializability and Recovery

#### Lesson 07.1 · ACID Properties, Recoverability Onion (`Strict / ACA`) & WAL Crash Recovery
- **Tag:** `[MUST]` — Core conceptual & MSQ unit (`2025_FN_Q15`, `2025_AN_Q27`, `2024_AN_Q13`, `2021_FN_Q28`, `2021_AN_Q34(Q)`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 00.1.
- **Beginner must-see:** If a bank transfer crashes right after deducting ₹500 from Alice and BEFORE adding ₹500 to Bob, the ₹500 would vanish into thin air! Databases group steps into all-or-nothing **Transactions** governed by **ACID**, write every edit to a safe **Log (`WAL`)** before touching data pages, and guard against reading uncommitted trash (**Dirty Reads**) so one abort doesn't trigger a domino collapse (**Cascading Rollback**, `2025_FN_Q15`)!
- **Finer points:**
  - **ACID Diagnosed (`2025_AN_Q27`, `2024_AN_Q13`):**
    - **Atomicity:** All-or-nothing (`Undo` logs).
    - **Consistency:** Preserves invariants like `A + B = const` (`2025_AN_Q27`).
    - **Isolation:** Concurrent runs hide partial updates (`2025_AN_Q27`: two concurrent transfers reading stale balance break Isolation + Consistency!).
    - **Durability:** Once committed & acknowledged, survives power loss before dirty buffer flush (`2024_AN_Q13`).
  - **5 Transaction States:** `Active -> Partially Committed -> Committed` (or `Failed -> Aborted`).
  - **Recoverability Hierarchy (`2025_FN_Q15`, `2021_AN_Q34(Q)`):**
    - **Recoverable:** If $T_j$ reads $X$ written by $T_i$, then **$T_i$ MUST commit before $T_j$ commits** (`2021_AN_Q34(Q)` fails when $T_3$ reads from $T_1$? Wait: check `R3(X)` after `W1(X)` in `2021_AN_Q34`: $T_3$ reads uncommitted `X` from $T_1$ and commits BEFORE $T_1$ -> Irrecoverable!).
    - **Cascadeless (ACA):** No uncommitted reads (`W_i(X)` must commit/abort before `R_j(X)` — avoids cascading rollback `2025_FN_Q15`!).
    - **Strict:** No uncommitted reads OR writes (`W_i(X)` must commit/abort before `R_j(X)` OR `W_j(X)`).
  - **Crash Recovery (`WAL`, `Steal/No-Force`, `Checkpoints`, `2021_FN_Q28`):**
    - Log records `<T_i, start>`, `<T_i, X, old, new>`, `<T_i, commit>`.
    - Write-Ahead Logging: flush log before dirty data page (`Undo` + `Redo`).
    - **Idempotency (`2021_FN_Q28`):** Crashing *during* recovery simply restarts recovery from the same log using the **exact same Undo and Redo lists** cleanly!
- **GATE-level items:** Pinpointing ACID violations (`2025_AN_Q27`, `2024_AN_Q13`), tracing cascading aborts (`2025_FN_Q15`), checking recoverability (`2021_AN_Q34`), and crash-during-recovery (`2021_FN_Q28`).
- **Diagrams needed:** `TIMELINE` + `GRAPHPIC` (Recoverability Onion `Strict ⊂ Cascadeless ⊂ Recoverable` with `W1->R2->C2` & `2025_FN_Q15` traces); `FRAMES` (WAL Log + Crash during Recovery re-running identical Undo/Redo lists, `2021_FN_Q28`).
- **Hand traces:** Tracing `2025_FN_Q15` (`T1` abort rolling back `T2` & `T3`), `2021_AN_Q34(Q)` (`W1(X)->R3(X)`), and `2021_FN_Q28` double crash.
- **Common mistakes:** Saying `2025_AN_Q27` broke Atomicity (both transactions completed all their own ops — they broke Isolation & Consistency!); thinking a crash *during* recovery permanently corrupts the DB (`2021_FN_Q28(B,D)`!); mixing up Recoverable (`commit order`) with Cascadeless (`read after commit`).

#### Lesson 07.2 · Conflict Serializability, Precedence Graphs, Counting CS Schedules & View Serializability
- **Tag:** `[MUST]` — Highest-scoring transaction skill (`2026_AN_Q20`, `2025_AN_Q53`, `2024_FN_Q45`, `2022_FN_Q39`, `2021_FN_Q47`, `2021_AN_Q34(P)`, `2020_FN_Q45`, `2019_FN_Q27(II)`, `2017_AN_Q62`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 07.1, DS Graphs (cycle check & topological sort).
- **Beginner must-see:** Swapping two non-clashing actions (like two Reads `R1(A), R2(A)`, `2026_AN_Q20`! Or actions on *different* variables `X` and `Y`) changes NOTHING! If you can keep swapping safe neighbours until all `T1` steps sit together, then `T2`, then `T3` — the schedule is **Conflict Serializable**! Instead of guessing swaps, draw arrows `T_i -> T_j` for every clashing pair (`R-W, W-R, W-W`) and just check for cycles!
- **Finer points:**
  - **Conflict Rules (`2026_AN_Q20`):** Two ops conflict iff (1) Different transactions, (2) Same item `A`, (3) **At least one is Write (`W`)** (`R-R` never conflicts!).
  - **Precedence (Conflict) Graph (`2025_AN_Q53`, `2024_FN_Q45`, `2022_FN_Q39`, `2021_FN_Q47`, `2021_AN_Q34`):**
    - Schedule is **Conflict Serializable $\iff$ Conflict Graph is Acyclic**.
    - **Conflict-Equivalent Serial Schedules (`2024_FN_Q45`, `2022_FN_Q39`, `2020_FN_Q45`):** Every valid **Topological Sort** of the Conflict Graph is a conflict-equivalent serial order!
  - **Counting Conflict Serializable Schedules (`2017_AN_Q62`):** Split into serial order constraints (`T1 < T2` vs `T2 < T1`) on the shared items (`Y`), and count valid combinations cleanly (`1 + 53 = 54`)!
  - **View Serializability & Blind Writes (`2019_FN_Q27(II)`):**
    - 3 conditions: Initial Reads match, Read-From (`W -> R`) edges match, Final Writes match.
    - **Golden Rule:** `Conflict Serializable => View Serializable`; converse holds EXCEPT when **Blind Writes (`W` without prior `R`)** exist! (Testing View Serializability in general is NP-complete, though small GATE graphs check Polygraph/serial orders!).
- **GATE-level items:** Non-conflict condition (`2026_AN_Q20`: both read), Conflict Graph & valid topological serial equivalents (`2025_AN_Q53`, `2024_FN_Q45`, `2022_FN_Q39`, `2021_FN_Q47`), counting exact CS schedules (`2017_AN_Q62`: `54`), and blind-write View Serializability (`2019_FN_Q27`).
- **Diagrams needed:** `GRAPHPIC` (Precedence graphs for `2024_FN_Q45`, `2022_FN_Q39`, `2021_FN_Q47` + all topological orders); `COMPARE` (`Conflict CS ⊂ View CS` Venn diagram with Blind-Write counterexample); `TRACE` (Counting `1 + 53 = 54` interleavings in `2017_AN_Q62`).
- **Hand traces:** Tracing `2025_AN_Q53` (A, B, C, D), `2024_FN_Q45` (`T3 -> T2` allows `B, C, D`), `2021_FN_Q47` (`S1` cycle vs `S2` acyclic), and `2017_AN_Q62` (`54`).
- **Common mistakes:** Drawing conflict edges for `R-R` pairs (`2026_AN_Q20`!); thinking topological order must follow transaction ID numbers (`T1, T2, T3` vs `T3, T2, T1` in `2024_FN_Q45`!); missing a backward edge on a 3rd appearance of `X` (`R1(X) ... W2(X) ... W1(X)` in `2025_AN_Q53`!).

---

### Chapter 08 · Concurrency Control

#### Lesson 08.1 · Locking Protocols: `S/X` Compatibility, Basic `2PL`, Strict `2PL` & Upgrade Deadlocks
- **Tag:** `[MUST]` — High-frequency MSQ/MCQ topic (`2024_AN_Q31`, `2019_FN_Q27(I)`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 07.2, OS Ch 04 (Deadlocks).
- **Beginner must-see:** You can't run a Precedence Graph after a disaster already happened — you need live traffic rules (**Concurrency Control**)! Giving Shared (`S`) locks to readers and Exclusive (`X`) locks to writers isn't enough if transactions unlock early (**non-2PL**, `2024_AN_Q31(B)`). **Two-Phase Locking (`2PL`)** enforces ONE simple traffic law: **Grab all locks you want in Phase 1 (Growing), and the instant you release even ONE lock (Shrinking), you are banned from ever grabbing another lock (`2024_AN_Q31(C)`)!**
- **Finer points:**
  - **Lock Compatibility Matrix (`S-S = OK`, `S-X / X-S / X-X = Wait`)** + Lock Conversion (`S -> X` upgrade deadlock!).
  - **4 Flavours of 2PL (`2024_AN_Q31`, `2019_FN_Q27(I)`):**
    1. **Basic 2PL:** Guarantees **Conflict Serializability** (`2024_AN_Q31(A)`), **CAN Deadlock (`D`)** and CAN cause cascading rollbacks!
    2. **Conservative (Static) 2PL:** Pre-declares & grabs ALL locks before starting -> **Deadlock-Free**!
    3. **Strict 2PL (`2019_FN_Q27(I)`):** Holds ALL **Exclusive (`X`) locks** until `COMMIT/ABORT` -> **Conflict Serializable + Strict (Cascadeless & Recoverable!)**, still CAN deadlock!
    4. **Rigorous 2PL:** Holds BOTH `S` and `X` locks until `COMMIT/ABORT` (serial order = commit order!).
  - **Graph/Tree Locking Protocol & Intention Locks (`IS, IX, SIX`) (`[LATER]`):** Tree protocol is deadlock-free yet NOT always 2PL.
- **GATE-level items:** Exact 2PL properties (`2024_AN_Q31`: guarantees serializability, forbids locking after unlock, still allows deadlocks) and Strict 2PL guarantees (`2019_FN_Q27(I)`).
- **Diagrams needed:** `TIMELINE` (2PL Lock-Count Hill `Growing | Lock Point | Shrinking` vs Strict 2PL plateau); `FRAMES` (Early-unlock breaking serializability `2024_AN_Q31(B)` + `S->X` upgrade deadlock `2024_AN_Q31(D)`); `COMPARE` (Basic vs Conservative vs Strict vs Rigorous 2PL matrix).
- **Hand traces:** Tracing `2024_AN_Q31(B)` non-2PL anomaly; tracing Lock-Point serializability order of two concurrent 2PL transactions.
- **Common mistakes:** Thinking "lock before op, unlock right after op" is 2PL (`2024_AN_Q31(B)`!); thinking 2PL prevents deadlocks (`2024_AN_Q31(D)`!); confusing Strict 2PL (holds `X` locks to end) with Conservative 2PL (grabs all locks upfront).

#### Lesson 08.2 · Timestamp Ordering, Thomas' Write Rule, `Wait-Die` / `Wound-Wait` & Isolation Levels
- **Tag:** `[MUST]` — Directly solves `2019_FN_Q27(II)`, `2017_FN_Q51`, and SQL isolation traps.
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** Lesson 07.2, Lesson 08.1.
- **Beginner must-see:** Instead of using locks (which can freeze in deadlocks!), **Timestamp Ordering** stamps every transaction with its birth time `TS(T)` and forces results to match birth-order (`Older -> Younger`). **Thomas' Write Rule** goes one clever step further: if an old transaction tries to overwrite data that a younger transaction ALREADY updated (`obsolete write`), we don't abort — we just quietly skip the stale write (`View Serializable`, NOT Conflict Serializable! `2019_FN_Q27(II)`)!
- **Finer points:**
  - **Basic Timestamp Ordering (`R-TS(X)`, `W-TS(X)`):**
    - `R(X)` by $T$: abort if $TS(T) < W\text{-TS}(X)$, else update $R\text{-TS}(X) = \max(R\text{-TS}(X), TS(T))$.
    - `W(X)` by $T$: abort if $TS(T) < R\text{-TS}(X)$ OR $TS(T) < W\text{-TS}(X)$, else execute & update $W\text{-TS}(X) = TS(T)$.
    - Deadlock-free (`no waiting`), Conflict Serializable, NOT starvation-free if restarted with new TS!
  - **Thomas' Write Rule (`2019_FN_Q27(II)`):** If $TS(T) \ge R\text{-TS}(X)$ AND $TS(T) < W\text{-TS}(X)$, simply **ignore the write** (don't abort!) -> generates **View Serializable** schedules that may NOT be Conflict Serializable!
  - **Deadlock Prevention in Lock Managers (`Wait-Die` vs `Wound-Wait`, `2017_FN_Q51`):**
    - `Wait-Die` (non-preemptive): Older waits for Younger; Younger dies.
    - **`Wound-Wait` (`2017_FN_Q51`, preemptive):** Older kills/wounds Younger (`if TS(T_2) < TS(T_1) then T_1 is killed`); Younger waits for Older (`else T_2 waits`).
    - Why **restarting with the SAME original timestamp** guarantees BOTH **Deadlock-Freedom** AND **Starvation-Freedom** (`2017_FN_Q51`)!
  - **SQL Isolation Levels & MVCC (`[SHOULD]`):** `Read Uncommitted`, `Read Committed`, `Repeatable Read`, `Serializable` vs Dirty Read, Non-Repeatable Read, and **Phantom Read**.
- **GATE-level items:** Wound-Wait deadlock & starvation freedom (`2017_FN_Q51`), Thomas' Write Rule producing View-but-not-Conflict serializability (`2019_FN_Q27(II)`), and Basic TO abort checks.
- **Diagrams needed:** `TIMELINE` (Basic TO vs Thomas' Write Rule ignoring stale `W_old(X)`); `COMPARE` (`Wait-Die` vs `Wound-Wait` with kept `TS`, `2017_FN_Q51`); `MATRIX` (4 SQL Isolation Levels vs 3 Read Anomalies including Phantom Read).
- **Hand traces:** Tracing `T_1(TS=10), T_2(TS=20)` through Basic TO vs Thomas' Write Rule; tracing `2017_FN_Q51` showing oldest `TS` always winning.
- **Common mistakes:** Mixing up `Wait-Die` (`Younger dies`) and `Wound-Wait` (`Younger killed by Older`, `2017_FN_Q51`!); forgetting that assigning a *fresh* timestamp on abort would cause starvation; thinking Thomas' Write Rule preserves Conflict Serializability (`2019_FN_Q27(II)`!).

---

## PART 6. EVERY PYQ LISTED BELOW (Batch 1: Questions #1 to #36)

*(Re-solved and checked one by one. Missing figures from the 16 diagram/table questions are explicitly flagged.)*

| # | PYQ ID | (a) Ch / Lesson | (b) Exact Concept Tested | (c) Trap / Finer Point | (d) Official Key Check & Working | (e) Transcription Check |
|---|---|---|---|---|---|---|
| 1 | `2026_AN_Q15` | Ch 00 / L00.1 | Matching 3-Schema levels (`Logical, Physical, External`) to DBMS concepts. | Don't swap External (`Views`) and Logical (`Relations`)! Physical = `File organization & indexes`. | **CORRECT (C: I-N, II-M, III-L).** | Clean. |
| 2 | `2026_AN_Q20` | Ch 07 / L07.2 | Condition for two concurrent transactions NOT to conflict on object `A`. | Conflicts require at least ONE Write (`R-W, W-R, W-W`); `R-R` never conflicts! | **CORRECT (A: Both T1 and T2 only read A).** | Clean. |
| 3 | `2026_FN_Q30` | Ch 05 / L05.1 | Valid vs Fallacious FD inference rules (`Union`, `Augmentation`, `LHS-split`). | `PQ -> R` NEVER implies `P -> R` or `Q -> R` (`B` false); `PQ -> R & P -> R` tells nothing about `Q -> R` (`A` false)! | **CORRECT (C, D).** C = Composition (`P->R, Q->S => PQ->RS`); D = Augmentation (`P->R => PQ->R`). | Clean. |
| 4 | `2026_FN_Q31` | Ch 05 / L05.2 | Existence of dependency-preserving decompositions across `1NF, 2NF, 3NF, BCNF`. | Always watch positive/negative phrasing! `3NF` and `1NF` (and `2NF`!) are ALWAYS possible (`A, B` true; `D` false!); `BCNF` is NOT always possible (`C` true!). | **CORRECT (A, B, C).** Standard decomposition theorems. | Clean. |
| 5 | `2026_AN_Q42` | Ch 05 / L05.1 | Minimal subset of Armstrong's Axioms (`Refl, Aug, Trans`) needed to prove `Union`. | Reflexivity is NOT needed! `Aug` (`X->Y => XX->XY`, i.e. `X->XY`; and `X->Z => XY->YZ`) + `Trans` (`X->XY, XY->YZ => X->YZ`) suffice! | **CORRECT (D: Augmentation and Transitivity).** Both are necessary and sufficient. | Clean. |
| 6 | `2026_FN_Q43` | Ch 03 / L03.2 | Translating existential positional tuple calculus (`<u,v> \in R \land <v,w> \in S`) to RA. | `<u, v>` matches positional attributes `(P, Q)` of `R`, and `<v, w>` matches `(X, Y)` of `S`, so `v` equates `R.Q = S.X` and projects `u = P`! | **CORRECT (B: `\Pi_P(S \bowtie_{S.X = R.Q} R)`).** | Clean. |
| 7 | `2026_AN_Q46` | Ch 06 / L06.1 | Dense vs Sparse properties of Hash indexes and B+ tree indexes. | Hash indexes cannot rely on global sorted order -> MUST be Dense (`S1` true); B+ trees on ordered files can be Sparse (`S2` true)! | **CORRECT (A: Both S1 and S2 true).** | Clean. |
| 8 | `2026_FN_Q65` | Ch 02 / L02.1 | Counting total Superkeys on `R(A,B,C,D)` with CKs `{AB}` and `{AC}`. | Inclusion-Exclusion: `|SK(AB)| = 2^2 = 4`, `|SK(AC)| = 2^2 = 4`, overlap `|SK(ABC)| = 2^1 = 2` -> `4 + 4 - 2 = 6`! | **CORRECT (6).** `{AB, ABD, ABC, ABCD, AC, ACD}`. | Clean. |
| 9 | `2025_FN_Q15` | Ch 07 / L07.1 | Cascading rollbacks when `T1` aborts after `W1(Y)` is read by `T2` and `T3`. | Both `R2(Y)` and `R3(Y)` read `T1`'s dirty uncommitted write `W1(Y)` -> BOTH must roll back! (`R2(X)` is harmless read-read). | **CORRECT (C: Both T2 and T3).** | Clean. |
| 10 | `2025_FN_Q21` | Ch 06 / L06.2 | Effect of inserting `23` into a 5-node B+ tree (max 3 keys/node). | Need diagram `[IMAGE_Q_21_1]` to confirm full leaves & root split. | **CANNOT VERIFY** (Key: B, D). Figure `[IMAGE_Q_21_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_21_1]`). |
| 11 | `2025_AN_Q27` | Ch 07 / L07.1 | Pinpointing exact ACID properties violated by concurrent lost-debit banking transfer. | Both read stale `11,000` simultaneously (**Isolation** broken!) and total money `A + B` jumped by ₹10,000 (**Consistency** broken!). Individual txns didn't partially fail/lose committed state. | **CORRECT (B, C: Consistency & Isolation).** | Clean. |
| 12 | `2025_FN_Q39` | Ch 03 / L03.2 | TRC query for names of players playing for team `'MI'`. | Check range variable `p \in players` (`B, D` range `p` over `teams`!) AND explicit join `p.tid = t.tid` (`C` drops join!). | **CORRECT (A).** | Clean. |
| 13 | `2025_AN_Q46` | Ch 05 / L05.2 | Testing 3NF for `R1(A..E)` and `R2(A..D)` using Candidate Keys. | `R1`: only CK = `AD` (`D->E` non-superkey -> non-prime fails 3NF!). `R2`: only CK = `C` (`A->D, A->B` non-superkey -> non-prime fail 3NF!). | **CORRECT (C, D).** Neither is in 3NF. | Clean. |
| 14 | `2025_FN_Q47` | Ch 05 / L05.2 | Normal forms & lossless decomposition of `team(name, city, owner)`. | `name` is the sole CK of `team` -> `team` IS already in BCNF & 3NF (`A, D` false)! `t1, t2` are in BCNF and join on `name` losslessly (`B, C` true). | **CORRECT (B, C).** | Clean. |
| 15 | `2025_AN_Q53` | Ch 07 / L07.2 | Identifying Conflict Serializable schedule among 4 interleavings of `T1, T2`. | Note: `[IMAGE_Q_53_1..2]` tags appear, yet ALL 4 schedules are printed in full in A–D! Only B keeps all conflicts `T2 -> T1` acyclic (`A, C` cycle on `X`; `D` cycles `T2->T1` on `X` & `T1->T2` on `Y`). | **CORRECT (B).** Verified directly from printed schedules. | **MISSING FIGURE TAGS** (`[IMAGE_Q_53_1..2]`, though schedules are in text!). |
| 16 | `2025_AN_Q54` | Ch 04 / L04.1, L04.2 | Valid SQL queries retrieving student names enrolled in course `1470`. | `SIZEOF` (`B`) is NOT SQL! `EXISTS` (`A`), `0 < COUNT(*)` (`C`), and `NATURAL JOIN` (`D`, joins on shared `rollno`) are all valid! | **CORRECT (A, C, D).** | Clean. |
| 17 | `2025_FN_Q55` | Ch 04 / L04.2 | Correlated/nested `IN` SQL query computing `MIN(P.age)`. | Need table instance `[IMAGE_Q_55_1]` to evaluate rows. | **CANNOT VERIFY** (Key: 26). Table `[IMAGE_Q_55_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_55_1]`). |
| 18 | `2025_AN_Q57` | Ch 06 / L06.2 | Cascading 2-level B+ tree split (`max 4 keys/node`) after inserting `23`. | `C=(20*,22*,25*,26*)` splits (`23` or `25` copied up) -> overflows `B=(7,19,33,44)` -> pushes `23` (or `25`) to `A`, leaving `B_right = (33, 44)` as parent of `25*`! Smallest key = `33` under BOTH split conventions! | **CORRECT (33).** | Clean. |
| 19 | `2024_AN_Q13` | Ch 07 / L07.1 | Definition of **Durability** in ACID (`survives crash after commit`). | Students confuse Durability (persisting committed work after crash) with Atomicity (all-or-nothing rollback). | **CORRECT (A: durability).** | Clean. |
| 20 | `2024_FN_Q24` | Ch 01 / L01.1 | Matching 4 English statements to the right ER diagram. | Need 4 ER figures `[IMAGE_Q_24_1]`. | **CANNOT VERIFY** (Key: D). Figure `[IMAGE_Q_24_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_24_1]`). |
| 21 | `2024_AN_Q22` | Ch 01 / L01.1 | Participation constraint of Weak Entity vs Owner Entity in identifying relationship. | Weak entity cannot exist without owner -> MUST have Total participation (`A`); owner can be partial! | **CORRECT (A).** | Clean. |
| 22 | `2024_FN_Q11` | Ch 06 / L06.2 | Which node in a B+ tree is exempted from the 50% minimum occupancy rule? | Root node needs only $\ge 2$ children (or $\ge 1$ key if leaf). | **CORRECT (A: Only the root node).** | Clean. |
| 23 | `2024_FN_Q25` | Ch 05 / L05.2 | Properties of a relation in First Normal Form (`1NF`). | 1NF forbids composite/multivalued attributes (`C` true), while allowing multi-attribute keys (`A` true), FKs (`B` false), and multiple CKs (`D` false). | **CORRECT (A, C).** | Clean. |
| 24 | `2024_AN_Q16` | Ch 06 / L06.1 | I/O-efficient file organizations for sequential **scan** operation. | `Sorted` and `Heap` files scan contiguous data pages once; unclustered indexes bounce randomly across data blocks! | **CORRECT (A, B: Sorted & Heap).** | Clean. |
| 25 | `2024_AN_Q31` | Ch 08 / L08.1 | Core properties & deadlock behaviour of Basic Two-Phase Locking (`2PL`). | 2PL enforces serializability (`A`), forbids acquiring any lock after releasing one (`C`), yet still allows deadlocks (`D`); `B` describes early unlock (NOT 2PL)! | **CORRECT (A, C, D).** | Clean. |
| 26 | `2024_FN_Q35` | Ch 03 / L03.1 | Tuple count of `σ_{B<C}(R ⋈_{R.A = S.A} S)`. | Need table instances `[IMAGE_Q_35_1..2]`. | **CANNOT VERIFY** (Key: 2). Figures `[IMAGE_Q_35_1..2]` are missing. | **MISSING FIGURES** (`[IMAGE_Q_35_1..2]`). |
| 27 | `2024_FN_Q44` | Ch 05 / L05.1 | Valid FD rules: Decomposition (`B`), Pseudotransitivity (`C`), Transitivity (`D`). | `A` falsely splits the LHS of `(X, Y) -> (Z, W)`. | **CORRECT (B, C, D).** | Clean. |
| 28 | `2024_AN_Q59` | Ch 03 / L03.1 | Minimum cross products (`×`) to find cities with `>= 3` distinct persons. | Need 3 copies of `Person` (`P1 × P2 × P3` with `P1.city=P2.city=P3.city` & distinct `pid`s) -> `2` cross products! | **CORRECT (B: 2).** | Clean. |
| 29 | `2024_FN_Q45` | Ch 07 / L07.2 | Identifying all serial schedules conflict-equivalent to `S`. | Only conflicts in `S` are on `y` (`r3, w3` before `r2, w2`), giving single precedence edge `T3 -> T2`! Any topological order putting `T3` before `T2` is conflict-equivalent! | **CORRECT (B, C, D).** `A (T1 T2 T3)` violates `T3 -> T2`. | Clean. |
| 30 | `2024_AN_Q39` | Ch 05 / L05.1 | Counting "useful" (completely non-trivial, non-empty `X, Y`, `X ∩ Y = \emptyset`) FDs on 4 attrs. | $3^4 - 2^4 - 2^4 + 1 = 81 - 16 - 16 + 1 = 50$. | **CORRECT (50).** | Clean. |
| 31 | `2023_FN_Q16` | Ch 02 / L02.1 | Definition of **Degree (Arity)** of a relation. | Degree = # of attributes (columns); Cardinality = # of tuples (rows). | **CORRECT (A).** | Clean. |
| 32 | `2023_FN_Q61` | Ch 04 / L04.1 | Counting rows matching `gender='F' AND marks > 65` (likely `NULL` / strict `>` trap!). | Need `Student` table `[IMAGE_Q_61]`. | **CANNOT VERIFY** (Key: 2). Table `[IMAGE_Q_61]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_61]`). |
| 33 | `2023_FN_Q62` | Ch 06 / L06.1 | Worst-case binary search block accesses on a sparse Primary Index file. | `floor(1024/100) = 10` rec/blk -> `2500` data blocks = `2500` sparse index entries (`20 B` each). `floor(1024/20) = 51` entries/blk -> `ceil(2500/51) = 50` index blocks -> `ceil(log_2 50) = 6` accesses! | **CORRECT (6).** Completely solvable from text even though `[IMAGE_Q_62]` is omitted. | **MISSING FIGURE** (`[IMAGE_Q_62]`, solvable from text). |
| 34 | `2022_FN_Q14` | Ch 05 / L05.2 | Boundary truths for BCNF (2-attr relations, all-prime relations, dependency preservation). | Any 2-attribute table is ALWAYS in BCNF (`A` true: only FDs are `A->B`, `B->A`, or none — LHS is always superkey or trivial!). All-prime can violate BCNF (`B` false). | **CORRECT (A).** | Clean. |
| 35 | `2022_FN_Q25` | Ch 03 / L03.1 | Relational Algebra division (`Own ÷ Brand`) & fundamental `×, −` expansion. | `A` uses direct division against `\pi_{bId}(Brand)`; `B` expands division accurately using `×` and `−`; `C` wrongly divides by `\pi_{bId}(Own)`! | **CORRECT (A, B).** | Clean. |
| 36 | `2022_FN_Q31` | Ch 02, 05 / L02.1, L05.1 | Counting total Superkeys of `R(A..E)` given `{AB->C, BC->D, C->E}`. | `A, B` never appear on RHS -> `(AB)^+ = {A,B,C,D,E}`! Sole CK = `AB` (size 2) -> $2^{5-2} = 8$ superkeys! | **CORRECT (8).** | Clean. |

---

`CONTINUE FROM PART 6 (PYQ #37)`

## PART 6 (Continued) · Batch 2: Questions #37 to #72

| # | PYQ ID | (a) Ch / Lesson | (b) Exact Concept Tested | (c) Trap / Finer Point | (d) Official Key Check & Working | (e) Transcription Check |
|---|---|---|---|---|---|---|
| 37 | `2022_FN_Q39` | Ch 07 / L07.2 | Conflict graph & unique topological serial order across `T1..T4`. | Check ALL edges carefully (`W1(y)->W3(y)->R4(y)` gives `T1->T3->T4`, and `R3(x), R4(x)->W2(x)` pushes `T2` strictly last!). | **CORRECT (A: `T1 -> T3 -> T4 -> T2`).** Unique topological sort of the conflict graph. | Clean. |
| 38 | `2022_FN_Q56` | Ch 04 / L04.2 | Correlated SQL division (`WHERE NOT EXISTS (... EXCEPT ...)`). | Need table rows `[IMAGE_Q_56]`. Also note minor SQL syntax typo (`NOT EXIST` instead of `NOT EXISTS`, `"D01"` quotes). | **CANNOT VERIFY** (Key: 2). Tables `[IMAGE_Q_56]` are missing. | **MISSING FIGURE** + minor typo `NOT EXIST`. |
| 39 | `2021_AN_Q16` | Ch 02 / L02.1 | Multiple foreign keys & self-referencing foreign keys on a relation. | One table CAN have multiple FKs (e.g. `Enrolled`), AND a FK CAN reference its own primary key (`mgrId -> empId`), so BOTH `S1, S2` are false! | **CORRECT (D: Both false).** | Clean. |
| 40 | `2021_FN_Q28` | Ch 07 / L07.1 | Crash during crash recovery without checkpoints (`WAL` idempotency). | Without new checkpoints, the WAL log still holds the exact same committed vs uncommitted records -> recovery simply re-runs the SAME undo & redo lists cleanly! | **CORRECT (A).** B, C, D falsely assume recovery isn't idempotent. | Clean. |
| 41 | `2021_AN_Q26` | Ch 06 / L06.1 | Block count of Secondary Dense Index on non-ordering candidate key `ANum`. | File is sorted on `RollNo`, NOT `ANum` — so `ANum` index MUST be **Dense** (`150,000` entries, NOT 1 per data block)! | **CORRECT (698).** `floor(4096 / (12+7)) = 215` entries/blk -> `ceil(150,000 / 215) = 698` blocks. | Clean. |
| 42 | `2021_FN_Q45` | Ch 03 / L03.1 | Selectivity estimation for `σ_{(A > 10) ∨ (B = 18)}(r)` under independence. | `A ∈ {6..20}` (`15` ints, `10` > 10 -> `2/3`), `B ∈ {1..20}` (`1/20`). `P(A ∨ B) = 2/3 + 1/20 - 1/30 = 41/60` -> `1200 × 41/60 = 820`. | **CORRECT (`820`, inside `819–820`).** (Note: official key also lists `OR 205` legacy tolerance; `820` is exact integer-domain probability). | Clean. |
| 43 | `2021_FN_Q53` | Ch 03 / L03.1 | Self-join `empAge ⋈_{age > age1} ρ(empAge)` meaning. | Any row strictly older than *at least one* other row survives — ONLY the global minimum age(s) fail! | **CORRECT (C: all employees whose age is not minimum).** | Clean. |
| 44 | `2021_AN_Q45` | Ch 04 / L04.1, L04.2 | Uncorrelated inner `AVG(salary)` subquery inside `WHERE ... GROUP BY deptId`. | Inner `(select avg(salary) from emp)` has NO outer reference `e.deptId`, so it computes the **whole company's** average salary! | **CORRECT (B: employees in the company).** | Clean. |
| 45 | `2021_FN_Q47` | Ch 07 / L07.2 | Testing conflict serializability of `S1` and `S2` via precedence graphs. | `S1`: `r1(y)->w2(y)` (`T1->T2`) and `r2(x)->w1(x)` (`T2->T1`) -> Cycle! `S2`: `r2(x)->w1(x)` and `w2(y)->r1(y)` -> `T2->T1` only (Acyclic!). | **CORRECT (B: `S1` not CS, `S2` CS).** | Clean. |
| 46 | `2021_AN_Q34` | Ch 07 / L07.1, L07.2 | Conflict serializability (`P`) vs Recoverability (`Q`) on a 3-txn schedule. | Precedence graph is `T1 -> T2 -> T3` (`P` true!). Yet `W1(X) -> R3(X)` means `T3` read uncommitted `X` from `T1` — if `T3` commits before `T1`, it's **irrecoverable** (`Q` false!)! | **CORRECT (B: P true, Q false).** | Clean. |
| 47 | `2021_FN_Q40` | Ch 05 / L05.2 | Multi-table Lossless Join test via Chase Algorithm (`D1` vs `D2`). | In `D1`, Row 1 `{PQST}` gets `YX` via `P->YX` and `ZW` via `Y->ZW` (full `a`-row -> Lossless!). In `D2`, `T` sits isolated in `{TX}` and never joins back into `{PQS}` -> Lossy! | **CORRECT (A: `D1` lossless, `D2` lossy).** | Clean. |
| 48 | `2021_AN_Q28` | Ch 05 / L05.1 | Computing FD closure deductions (`P->QR, RS->T`). | `P->R` (`C`), `PS->Q` (`D`), `PS -> QRS -> T` (`A`); `R->T` misses `S` (`B` false). | **CORRECT (A, C, D).** | Clean. |
| 49 | `2020_FN_Q12` | Ch 04 / L04.2 | Uncorrelated aggregate `> (SELECT AVG(cost) ... WHERE pno='P4')` row count. | Need `Suppliers` & `Catalogue` instances `[IMAGE_Q_12]`. | **CANNOT VERIFY** (Key: A: 4). Figure `[IMAGE_Q_12]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_12]`). |
| 50 | `2020_FN_Q13` | Ch 01 / L01.1 | ER symbol for Weak Entity's identifying (many-one) relationship. | Double rectangle = Weak entity; Double/bold diamond = Identifying relationship; Double oval = Multivalued attr. | **CORRECT (A: Diamonds with double/bold border).** | Clean. |
| 51 | `2020_FN_Q65` | Ch 05 / L05.2 | Exact definition separating `3NF` from `BCNF` (`3NF` but not `BCNF`). | `3NF` allows `X -> A` with non-superkey `X` ONLY when `A` is a **prime** attribute (which fails `BCNF`)! | **CORRECT (A).** | Clean. |
| 52 | `2020_FN_Q45` | Ch 07 / L07.2 | Identifying conflict-equivalent schedule from diagrams. | Need schedule figures `[IMAGE_Q_45]`, `[IMAGE_Q_45_A..D]`. | **CANNOT VERIFY** (Key: A). All schedule images are missing. | **MISSING FIGURES** (`[IMAGE_Q_45]`, `[IMAGE_Q_45_A..D]`). |
| 53 | `2020_FN_Q51` | Ch 06 / L06.2 | Minimum disk accesses to retrieve a record from a 1M-record B+ tree (`4 KB` block, `12 B` key, `8 B` ptr). | Internal fanout `20p - 12 <= 4096 => p = 205`; leaf `20L + 8 <= 4096 => L = 204`. `205^2 × 204 = 8.57M >= 1M` -> `3` B+ levels + `1` data block read = `4` accesses! | **CORRECT (4).** | Clean. |
| 54 | `2019_FN_Q27` | Ch 07, 08 / L07.2, L08.1, L08.2 | Strict 2PL guarantees (I) & Thomas' Write Rule View-vs-Conflict Serializability (II). | Strict 2PL gives CS + Recoverable (`I` true); Thomas Write Rule skips stale blind overwrites, producing View-Serializable schedules that aren't CS (`II` true). | **CORRECT (C: Both I and II).** | Clean. |
| 55 | `2019_FN_Q20` | Ch 06 / L06.2 | Structural properties of B+ trees (asking **NOT correct**!). | Watch `"NOT correct"`! Only leaf nodes in a B+ tree point to data records; internal nodes hold keys + tree pointers only (`B` is false!). | **CORRECT (B).** | Clean. |
| 56 | `2019_FN_Q37` | Ch 05 / L05.2 | Testing BCNF, Losslessness & Dependency Preservation on `Y=(PR), Z=(QRS)`. | `Z` has CKs `QR, SR`, yet `S -> Q` violates BCNF (`I` false!). `Y ∩ Z = R -> P` gives Lossless, and all 3 FDs stay inside `Y` or `Z` (`II` true!). | **CORRECT (C: II only).** | Clean. |
| 57 | `2019_FN_Q41` | Ch 04 / L04.1 | SQL implicit Cross Join (`FROM Student S, Performance P` with NO `Roll_no` join!) + `GROUP BY`. | Without `S.Roll_no = P.Roll_no`, every distinct `Student_name` gets paired with every `Marks > 84` row (`5` names -> `5` rows!). Need `[IMAGE_Q_41]` to verify distinct student names. | **CANNOT VERIFY** (Key: 5). Table `[IMAGE_Q_41]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_41]`). |
| 58 | `2019_FN_Q47` | Ch 03 / L03.1 | Relational Algebra set difference of two cross-product projections. | Need relations `P, Q, R` `[IMAGE_Q_47]`. | **CANNOT VERIFY** (Key: 1). Figure `[IMAGE_Q_47]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_47]`). |
| 59 | `2018_FN_Q21` | Ch 01 / L01.1 | Many-to-One (`E1 -> E2`) with Total participation on both & `|E1| > |E2|`. | Many-to-one total from `E1` maps EVERY `e1 \in E1` to **exact 1** `e2 \in E2` (`A` true); since `|E1| > |E2|`, Pigeonhole guarantees at least one `e2` gets $\ge 2$ (`C, D` false!). | **CORRECT (A).** | Clean. |
| 60 | `2018_FN_Q22` | Ch 04 / L04.1 | Superset relationship among `INNER`, `LEFT`, `RIGHT`, and `FULL OUTER JOIN`. | `FULL OUTER JOIN` (`Query 4`) keeps all matched rows + all unmatched left rows + all unmatched right rows! | **CORRECT (D: Query 4).** | Clean. |
| 61 | `2018_FN_Q51` | Ch 03 / L03.1 | Selection pushdown failing on Left Outer Join (`r LOJ σ_{B<5}(s)`). | In `C`, `r` tuples with `B >= 5` don't match filtered `s` and survive with `NULL`s, whereas `Q` (`r ⋈ σ_{B<5}(s)`) removes them! | **CORRECT (C).** | Clean. |
| 62 | `2018_FN_Q52` | Ch 05 / L05.2 | Classifying 4 schemas to find which is **in 3NF but NOT in BCNF**. | `Schema I` fails 1NF (set-valued); `Schema III` fails 3NF (`marks->grade` non-prime); `Schema IV` fails 2NF; `Schema II` has CKs `{rollno,courseid}` & `{email,courseid}` (all prime -> 3NF!) while `email -> rollno` breaks BCNF! | **CORRECT (B: Schema II).** | Clean. |
| 63 | `2017_FN_Q17` | Ch 05 / L05.1 | Computing Irreducible / Canonical Cover of FD set. | Drop extraneous `W` from `VW -> X` (`V -> W` already gives `W`), then drop redundant `Y -> X` (`Y -> V -> X`) -> `{V->W, V->X, Y->V, Y->Z}`! | **CORRECT (A).** | Clean. |
| 64 | `2017_AN_Q22` | Ch 01 / L01.2 | Exact condition allowing Relationship `R` table to merge into Entity `A` table. | `A` side needs **Many-to-One** (`A` has at most 1 partner in `B`) AND **Total** participation (no NULL FK!). (`1:N` merges into `B`, not `A`!). | **CORRECT (C: many-to-one and total on A).** | Clean. |
| 65 | `2017_AN_Q26` | Ch 02 / L02.1 | Cyclic FK deletion (`ON DELETE CASCADE` vs `ON DELETE SET NULL`) count. | Need tables `T1, T2` `[IMAGE_Q_26]`. | **CANNOT VERIFY** (Key: 0.0). Figure `[IMAGE_Q_26]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_26]`). |
| 66 | `2017_FN_Q31` | Ch 04 / L04.1, L04.2 | `GROUP BY` department count + outer `AVG(EC.Num)`. | Need `EMP` table `[IMAGE_Q_31]`. Also note minor SQL syntax typo (`FROM EC` without subquery alias). | **CANNOT VERIFY** (Key: 2.6). Table `[IMAGE_Q_31]` is missing. | **MISSING FIGURE** + SQL syntax omits `EC` definition in `FROM`. |
| 67 | `2017_FN_Q39` | Ch 03 / L03.2 | Domain Safety of 3 Tuple Relational Calculus expressions (`EMP`, `DEPT`). | By formal TRC domain-safety, `t[DeptId]` in `I` & `II` is NEVER equated to `u[DeptId]` (`t[DeptId] != v[DeptId]` permits infinitely many external domain values!), making ONLY `III` formally safe! | **FACT-DOUBT (OFFICIAL KEY ANOMALY)!** Official GATE 2017 key is **D (`I, II, and III`)**, assuming `t` stays bounded by `EMP`, yet strict textbook TRC safety makes **only `III`** safe because `t[DeptId]` is unbound in `I` & `II`! Book MUST explain this exact discrepancy! | Cleanly transcribed from GATE 2017 (key anomaly belongs to original exam). |
| 68 | `2017_FN_Q51` | Ch 08 / L08.2 | Wound-Wait deadlock prevention (`TS(T2) < TS(T1)` kills `T1`, keeps original TS on restart). | Wait edges always follow strictly increasing timestamps (acyclic = deadlock-free), and keeping same TS guarantees restarted transaction becomes oldest and finishes (starvation-free!). | **CORRECT (A: Both deadlock-free and starvation-free).** | Clean. |
| 69 | `2017_AN_Q62` | Ch 07 / L07.2 | Counting total Conflict Serializable schedules formed by `T1` (4 ops) and `T2` (4 ops). | Only `Y` conflicts (`r1(Y)w1(Y)` vs `r2(Y)w2(Y)`): `T1` before `T2` forces `w1(Y) < r2(Y)` (`1` schedule); `T2` before `T1` forces `w2(Y) < r1(Y)` (`15 + 20 + 18 = 53` schedules) -> `1 + 53 = 54`! | **CORRECT (54.0).** | Clean. |
| 70 | `2017_FN_Q38` | Ch 03 / L03.1 | Relational Division `CR ÷ T1` row count. | Need `CR` table `[IMAGE_Q_38]`. | **CANNOT VERIFY** (Key: 4.0). Figure `[IMAGE_Q_38]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_38]`). |
| 71 | `2017_AN_Q55` | Ch 04 / L04.2 | Quantified SQL comparisons (`> ALL` Spain AND `> ANY` Germany). | Need `top_scorer` table `[IMAGE_Q_55]`. | **CANNOT VERIFY** (Key: 7.0). Figure `[IMAGE_Q_55]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_55]`). |
| 72 | `2017_AN_Q54` | Ch 06 / L06.2 | Maximum order `p` (max pointers) of B+ tree (`8 B` key, `512 B` block, `2 B` block ptr). | Solve `p × 2 + (p - 1) × 8 <= 512 => 10p <= 520 => p = 52`. | **CORRECT (52.0).** | Clean. |

---

## PART 7. MORE QUESTIONS NEEDED (3 New Ideas Per Lesson)

### Chapter 00 · DBMS Foundations
- **Lesson 00.1 (`Why DBMS? 3-Schema & Data Independence`):**
  1. Adding an index or switching a file from Heap to B+ Tree without modifying SQL queries illustrates which property (`Physical Data Independence`)? (`MCQ`).
  2. Splitting `Employee(id, fullName)` into `Employee(id, firstName, lastName)` while keeping an `EmployeeView(id, fullName)` intact demonstrates which concept? (`MCQ`).
  3. Distinguish Database Schema, Database Instance, External View, and Logical Schema (`MSQ`).

### Chapter 01 · Entity-Relationship (ER) Model
- **Lesson 01.1 (`ER Building Blocks, Weak Entities & Cardinalities`):**
  1. An ER diagram has a `1:N` relationship from `Dept` (`total`) to `Employee` (`partial`): which cardinality truths hold if `|Dept| = 5` and `|Employee| = 20`? (`MSQ`).
  2. Identify all valid ER notation shapes for a Derived Attribute, Multivalued Attribute, Discriminator, and Total Participation (`MCQ`).
  3. Why can a Weak Entity have a partial participation *only* in a second non-identifying relationship while keeping total participation in its identifying relationship? (`MCQ`).
- **Lesson 01.2 (`ER-to-Relational Table Conversion`):**
  1. Given an ER diagram with `3` Strong entities, `1` Weak entity, `1` M:N relationship, `2` 1:N relationships, and `1` multivalued attribute, find minimum relational tables needed (`NAT`).
  2. A ternary relationship `Supply(S, P, J)` with attribute `qty` converts into how many tables and with what minimal candidate key? (`MCQ`).
  3. Contrast converting a `Disjoint, Total` ISA hierarchy (`Employee -> Engineer | Manager`) using 2 subclass tables vs 3 tables (`MSQ`).

### Chapter 02 · Relational Model and Integrity Constraints
- **Lesson 02.1 (`Relations, Keys, Superkey Counting & Referential Integrity`):**
  1. Relation `R(A, B, C, D, E)` has Candidate Keys `{A}`, `{B, C}`, and `{C, D}`: find exact number of Superkeys (`NAT`).
  2. Table `Emp(id, mgr_id)` has self-referencing FK `mgr_id -> id` with `ON DELETE CASCADE`; deleting the CEO `(1, NULL)` removes how many cascading rows in a 5-row chain? (`NAT`).
  3. Which integrity constraints permit `NULL` values under standard SQL (`Primary Key, Unique/Candidate Key, Foreign Key, CHECK`)? (`MSQ`).

### Chapter 03 · Relational Algebra and Tuple Calculus
- **Lesson 03.1 (`Relational Algebra: Joins, Division & Selectivity`):**
  1. Compute exact number of rows returned by `R(A, B) ⋈ S(A, C)`, `R LOJ S`, `R ROJ S`, and `R FOJ S` for two 4-row sample tables containing unmatched values (`NAT`).
  2. Given `R(A, B)` and empty relation `S(B) = \emptyset`, what does `R ÷ S` evaluate to under fundamental `×` and `−` division? (`MCQ`).
  3. Find tightest minimum and maximum output tuple counts for `R(A, B) ⋈ S(B, C)` where `|R| = 100`, `|S| = 50`, and `R.B` is a non-NULL FK referencing PK `S.B` (`MSQ`).
- **Lesson 03.2 (`Tuple & Domain Relational Calculus & Safety`):**
  1. Translate `"Find names of students enrolled in EVERY course offered by CS dept"` into valid TRC using `∀c (c.dept = 'CS' ⇒ ∃e ...)` (`MCQ`).
  2. Which TRC expressions among 4 given formulas are **domain-safe** (`t ∈ R`, negation `¬∃`, unbound `t.x != v.x`)? (`MSQ`).
  3. Convert `{<x> | ∃y (<x, y> ∈ P ∧ ¬∃z (<y, z> ∈ Q))}` into Relational Algebra (`MCQ`).

### Chapter 04 · SQL
- **Lesson 04.1 (`SQL Execution Order, NULL 3-Valued Logic & GROUP BY`):**
  1. A 6-row table `Marks(id, score)` contains `{10, 20, NULL, NULL, 30, 20}`: evaluate `COUNT(*)`, `COUNT(score)`, `COUNT(DISTINCT score)`, and `AVG(score)` (`MSQ`).
  2. Contrast `SELECT dept, COUNT(*) FROM E WHERE sal > 50 GROUP BY dept` vs putting `sal > 50` inside `HAVING` (`MCQ`).
  3. Compare rows returned by `LEFT OUTER JOIN` when filter `S.status = 'Active'` sits inside `ON` vs `WHERE` (`NAT`).
- **Lesson 04.2 (`Nested & Correlated Subqueries, NULL Traps & DDL/Views`):**
  1. Table `T1(x)` has `{1, 2, 3}` and `T2(x)` has `{2, NULL}`: count rows returned by `SELECT x FROM T1 WHERE x NOT IN (SELECT x FROM T2)` vs `NOT EXISTS` (`NAT`).
  2. Compare results of `x > ALL (SELECT y FROM EmptyTable)` vs `x > ANY (SELECT y FROM EmptyTable)` (`MCQ`).
  3. Write and trace an SQL query finding the **3rd highest distinct salary** without using `LIMIT`/`TOP` (`MCQ`).

### Chapter 05 · Functional Dependencies and Normal Forms
- **Lesson 05.1 (`FDs, Armstrong's Axioms, Closure & Minimal Cover`):**
  1. Given $F = \{A \to BC, B \to C, A \to B, AB \to C\}$ and $G = \{A \to B, B \to C\}$, prove whether $F \equiv G$ (`MCQ`).
  2. Find all Candidate Keys of $R(A, B, C, D, E, F)$ under $\{AB \to C, C \to D, D \to A, E \to F\}$ using the `L/M/R/N` bucket trick (`NAT`).
  3. Compute the exact count of **non-trivial** FDs (vs **useful** FDs) possible on a 3-attribute relation (`NAT`).
- **Lesson 05.2 (`Normal Forms, Chase Lossless Test & 3NF Synthesis`):**
  1. Using 3NF Synthesis (Bernstein) on $R(A, B, C, D)$ with $\{A \to B, C \to D\}$, why does Step 4 force adding extra table `{A, C}`? (`MCQ`).
  2. Determine the **highest** normal form (`1NF / 2NF / 3NF / BCNF`) of `R(A, B, C, D)` with $\{AB \to CD, C \to A, D \to B\}$ (`MCQ`).
  3. Given a 3-table decomposition of `R(A, B, C, D, E)`, run the Chase test to determine if it is lossless (`MCQ`).

### Chapter 06 · File Organization, Indexing and B / B+ Trees
- **Lesson 06.1 (`File Org, Unspanned Storage & Index Types`):**
  1. An ordered data file of `100,000` `128-B` records uses `4096-B` blocks (`unspanned`) and a **Clustering Index** on a non-key column taking `5,000` distinct values (`12 B` key + `4 B` blk ptr): find clustering index blocks (`NAT`).
  2. Build a 2-level Sparse Primary Index (`1st` level `200` blocks, `2nd` level fits in `2` blocks) and count total disk reads to locate a record (`NAT`).
  3. Which statements compare Clustered vs Secondary B+ indexes on range queries and full scans? (`MSQ`).
- **Lesson 06.2 (`B-Trees & B+ Trees`):**
  1. For a B+ tree with `4 KB` block, `10 B` key, `6 B` block ptr, and `8 B` record ptr, compare max internal order `p` against a **B-tree's** internal order (`NAT`).
  2. Insert keys `{10, 20, 30, 40, 50, 25}` into an initially empty B+ tree of max 3 keys/node (`order 4`) and find the root keys (`MCQ`).
  3. Find the **minimum** number of keys (maximum height!) in a 4-level B+ tree of internal order `p = 10` (`leaf max = 9` keys) (`NAT`).

### Chapter 07 · Transactions, Serializability and Recovery
- **Lesson 07.1 (`ACID, Recoverability Onion & WAL Crash Recovery`):**
  1. Classify a 2-transaction schedule containing `W1(X) -> W2(X) -> C2 -> C1` across `Recoverable, Cascadeless, Strict` (`MSQ`).
  2. Given a WAL log with 1 checkpoint and 4 transactions (`T1` committed before checkpoint, `T2` committed after, `T3` uncommitted at crash, `T4` aborted before crash), identify exact `UNDO` and `REDO` lists (`MSQ`).
  3. Which ACID property guarantees that a failed transaction's partial balance deduction disappears completely? (`MCQ`).
- **Lesson 07.2 (`Conflict & View Serializability, Counting CS Schedules`):**
  1. Given `R1(A), W2(A), W1(A), W3(A)`, prove via the 3 conditions why it IS View Serializable yet NOT Conflict Serializable (`MCQ`).
  2. Given two transactions `T1: r1(X) w1(X)` and `T2: r2(X) w2(X)` (both touch same `X`!), count total Conflict Serializable schedules out of $\binom{4}{2} = 6$ (`NAT`).
  3. Determine ALL valid conflict-equivalent serial schedules for a 4-transaction schedule whose precedence graph has edges `T1 -> T2`, `T1 -> T3`, `T2 -> T4` (`MSQ`).

### Chapter 08 · Concurrency Control
- **Lesson 08.1 (`Locking: S/X, 2PL, Strict 2PL & Deadlocks`):**
  1. Show a 6-step schedule allowed under Basic 2PL that triggers a **Cascading Rollback** (proving Basic 2PL is NOT always Cascadeless!) (`MCQ`).
  2. Trace two transactions acquiring `S(A)` and then both requesting upgrade `X(A)` under `2PL` to demonstrate why upgrade causes deadlock (`MCQ`).
  3. Which locking protocols (`Basic 2PL, Conservative 2PL, Strict 2PL, Tree Protocol`) guarantee Conflict Serializability AND Deadlock-Freedom? (`MSQ`).
- **Lesson 08.2 (`Timestamp Ordering, Thomas Write, Wait-Die/Wound-Wait & Isolation`):**
  1. Trace `T1(TS=10)` and `T2(TS=20)` executing `R2(X), W2(X), W1(X)` under **Basic TO** vs **Thomas' Write Rule** (`MCQ`).
  2. Under **Wait-Die** (older waits, younger dies, kept TS), trace `T1(TS=5)` requesting a lock held by `T2(TS=12)` vs `T2` requesting a lock held by `T1` (`MCQ`).
  3. Identify which anomalies (`Dirty Read, Non-Repeatable Read, Phantom Read`) can occur under SQL `REPEATABLE READ` (in standard SQL-92 definition) (`MSQ`).

---

## PART 8. WHAT IS MISSING FROM THE SUBJECT

Looking across the GATE CS Databases syllabus (`Part B.1`), `Part C` (72 PYQs), Korth/Navathe, Made Easy, and GateWallah, these critical topics are omitted or unstated inside `Part B.2`'s 8-chapter outline:

1. **Chapter 00: DBMS Foundations & 3-Schema Architecture (`External / Logical / Physical` & Data Independence)** (`2026_AN_Q15`).
2. **ER-to-Relational Table Conversion & Participation Rules:** Weak entity total participation (`2024_AN_Q22`), double-diamond symbol (`2020_FN_Q13`), merging `M:1` total relationship into entity table (`2017_AN_Q22`), Ternary & ISA mappings.
3. **Relational Model Keys & Referential Actions:** Degree (`2023_FN_Q16`), Superkey inclusion-exclusion counting (`2026_FN_Q65`, `2022_FN_Q31`), multiple & self-referencing FKs (`2021_AN_Q16`), cyclic `ON DELETE CASCADE` vs `SET NULL` (`2017_AN_Q26`).
4. **Relational Algebra & TRC Subtleties:** Set vs Bag semantics, Self-join `k - 1` cross products (`2024_AN_Q59`, `2021_FN_Q53`), Relational Division + rewrite (`2022_FN_Q25`, `2017_FN_Q38`), Outer Join `σ`-pushdown failure (`2018_FN_Q51`), Selectivity estimation (`2021_FN_Q45`), positional `<u,v>` calculus (`2026_FN_Q43`), and **TRC Safety (`2017_FN_Q39` official-key anomaly warning!)**.
5. **SQL Execution & Traps:** 7-step query order (`FROM -> WHERE -> GROUP BY -> HAVING -> SELECT`), 3-valued `NULL` logic (`NOT IN` null poison!), missing-join implicit cross joins (`2019_FN_Q41`), correlated `EXISTS / EXCEPT` division (`2025_AN_Q54`, `2022_FN_Q56`), `> ALL / > ANY` (`2017_AN_Q55`).
6. **FD Algebra & Normalization Proofs:** Minimal axioms for Union (`Aug + Trans`, `2026_AN_Q42`), useful FD formula (`2024_AN_Q39`), `L/M/R/N` Candidate Key finder (`2025_AN_Q46`), 3-step Canonical Cover (`2017_FN_Q17`), multi-table **Chase Test** (`2021_FN_Q40`), `2-attr`/`all-prime`/`3NF-not-BCNF` edge cases (`2022_FN_Q14`, `2020_FN_Q65`, `2018_FN_Q52`), and `3NF Synthesis` vs BCNF dependency loss (`2026_FN_Q31`).
7. **File Organization & B/B+ Tree Byte Calculus:** Unspanned `BFR`, Scan I/O (`2024_AN_Q16`), Dense Hash vs Sparse B+ (`2026_AN_Q46`), Secondary dense index blocks (`2021_AN_Q26`), Primary binary search (`2023_FN_Q62`), B+ non-leaf pointer absence (`2019_FN_Q20`), root occupancy exception (`2024_FN_Q11`), internal `p` vs leaf `L` byte formulas (`2020_FN_Q51`, `2017_AN_Q54`), and cascading copy-up/push-up splits (`2025_AN_Q57`).
8. **Transactions, WAL Recovery & Concurrency Protocols:** Concrete ACID failure diagnosis (`2025_AN_Q27`, `2024_AN_Q13`), Recoverable/Cascadeless/Strict onion (`2025_FN_Q15`), Idempotent crash-during-recovery (`2021_FN_Q28`), Precedence Graphs & counting CS schedules (`2017_AN_Q62`), Blind writes & View Serializability (`2019_FN_Q27`), `2PL / Strict 2PL` (`2024_AN_Q31`), `Thomas' Write Rule` (`2019_FN_Q27`), `Wait-Die / Wound-Wait` (`2017_FN_Q51`), and SQL Isolation Levels (`Phantom Read`).

---

## PART 9. WEIGHTS

### Chapter Weight Tags & Comparison with the Bank (`Part B.3`)

| Chapter | Proposed Weight Tag | Bank Stats (2017–2026, 15 CS Papers) | Does the Bank Weight Look Fair? |
|---|---|---|---|
| **Ch 00 · DBMS Foundations & 3-Schema** *(New)* | **Foundation** (Short intro before Ch 01) | Embedded (`2026_AN_Q15`) | **Fair as short 45-min bridge.** Prevents schema/independence mix-ups right at the start. |
| **Ch 01 · ER Model & ER-to-Relational** | **Low-Medium** (Easy guaranteed marks) | 5 Qs / 5 marks (`0.33%`; asked 4/10 yrs — all 1-markers!) | **Fair.** Light mark share in 2017–2026 (`5` marks in 15 papers!), yet super easy ROI (`MCQ1×5`) once Weak Entity & `M:1` total merge rules are known. |
| **Ch 02 · Relational Model & Integrity Constraints** | **Medium** (Core foundation for Ch 03–05) | Shared in `Integrity Constraints & FDs` (`10` Qs / `15` marks across 5/10 yrs) | **Fair (split Keys/FKs cleanly from FDs for pacing).** Counting superkeys & `CASCADE` traces are fast wins. |
| **Ch 03 · Relational Algebra & Tuple Calculus** | **High** | 13 Qs / 21 marks (`1.40%`; asked 9/10 yrs — `8` two-markers!) | **Fair.** Appears in 9/10 years; Division, Outer Join pushdown, Self-joins, and TRC translation carry steady 2-mark value. |
| **Ch 04 · SQL** | **Very High** (Top practical ROI!) | 10 Qs / 17 marks (`1.13%`; asked 8/10 yrs — `6` NATs!) | **Fair — super predictable NAT ROI!** Once `GROUP BY`, `NULL` 3-valued logic, and `EXISTS/EXCEPT` are mastered, SQL yields clean 2-mark points. |
| **Ch 05 · Functional Dependencies & Normal Forms** | **Very High** (#1 Design Weight!) | FDs (`10` Qs / `15` marks) + Norm (`9` Qs / `15` marks) = **19 Qs / 30 marks (`27%` of DBMS!)** | **Fair — massive scoring pillar!** Almost every year tests Closure, Candidate Keys, 3NF/BCNF boundaries, or Lossless/Dep-Preservation (`8/10` yrs). |
| **Ch 06 · File Organization & Indexing (B/B+ Trees)** | **High** | 10 Qs / 15 marks (`1.00%`; asked 8/10 yrs — `5` NATs, `3` Hard!) | **Fair.** Slightly harder numericals (`BFR`, B+ internal vs leaf bytes, splits), yet uses only 4 repeating formulas! |
| **Ch 07 · Transactions, Serializability & Recovery** | **Very High** | Merged with Ch 08 (`15` Qs / `23` marks = `1.53%` across 8/10 yrs) | **Fair — #1 single bank bucket!** Conflict Precedence Graphs & Recoverability appear almost every year with very high accuracy once drawn properly. |
| **Ch 08 · Concurrency Control (`2PL`, `TO`, `Wound-Wait`)** | **High** | Merged with Ch 07 (`15` Qs / `23` marks total) | **Fair (once split cleanly from Ch 07).** Exact Ch 07 vs Ch 08 split outside this bank: **not sure**, though 2PL/Strict-2PL/Thomas/Wound-Wait concepts appear repeatedly across `Part C`. |

### Overall Assessment of Bank Distribution (`7.4%` = ~7.4 marks/paper)
- Unlike Algorithms (only 7 Easy Qs out of 73), Databases in `Part B.3` has **15 Easy, 51 Medium, and only 6 Hard** questions out of 72 (`92%` Easy or Medium!) — making it one of the **safest, highest-scoring 7.4 marks** in GATE CS for a 100-day dropper!
- Splitting marks cleanly across the 3 pillars: **FDs & Normalization (`Ch 05`: 30 marks)**, **RA/TRC + SQL (`Ch 03+04`: 38 marks)**, **Transactions/Concurrency (`Ch 07+08`: 23 marks)**, and **Indexing/B+ (`Ch 06`: 15 marks)** gives a very fair, well-balanced blueprint. (Exact future paper frequencies beyond the 2017–2026 bank: **not sure**.)