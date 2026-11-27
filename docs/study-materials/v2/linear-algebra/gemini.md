## PART 1. FEELINGS

1. Looking at `Part B.2` felt just like Digital Logic and Probability: **all 4 chapters say `"none | not written"`**, leaving zero hint of what topics, tricks, or derivations will actually be taught.
2. Worse, **Vectors, Span, Linear Independence, Rank, and Nullity** aren't even mentioned in `Part B.1` or `Part B.2`, yet the very first PYQs throw *"null space of M"*, *"m - n linearly independent solutions"*, *"orthogonal vectors in R^{10}"*, and *"angle bisector `u + \alpha v`"* right in my face!
3. Without a **Chapter 00 teaching Vectors & Geometry** (what a column vector actually looks like, dot products, norms, and linear independence), `2026_FN_Q20`, `2024_FN_Q52`, `2021_AN_Q44`, `2017_FN_Q18`, and `2017_FN_Q62` read like alien language.
4. In `Part C`, `2022_FN_Q45` asks for `U_{32}` in the question text when the real upper-triangular entry is `U_{33}` (which Options A, C, D use while Option B uses `U_{32}`!), and `2025_AN_Q44` prints `Q \in \mathbb{R}^{3×3}` for a system `PX = Q`!
5. Look at `Part B.3`: **Eigenvalues & Eigenvectors alone carry `20` of `45` marks (`44%` of Linear Algebra!)**, including tough concepts like **Diagonalizability (`2018_FN_Q36`)**, **Frobenius Norm $\sum A_{ij}^2 = \sum \lambda_i^2$ (`2017_FN_Q44`)**, **Vandermonde Determinants (`2019_FN_Q45`)**, and **Matrix Powers (`A^{13}`, `2025_FN_Q41`)** — all absent from the 4-line chapter titles!
6. Meanwhile, `LU Decomposition` is only **2 questions in 15 papers (`4` marks!)**, yet gets a full standalone chapter with zero priority guidance for a 100-day dropper!
7. On the bright side, Linear Algebra has only `45` marks (`~3` marks/paper) and almost every question solves in 30 seconds once you see the core geometry + shortcut formulas (`det(kA) = k^n det(A)`, `Rank + Nullity = cols`, `Trace = sum of eigenvalues`).
8. **Would I pay ₹149 for this right now? NO.**
9. Why? Nothing is written in `Part B.2`, Vectors/Orthogonality/Rank-Nullity are completely missing from the chapter list, and `2022_FN_Q45` has an unflagged `U_{32}` vs `U_{33}` typo.
10. Add Chapter 00 (Vectors, Dot Product, Linear Independence), build visual Matrix/Gaussian-Elimination/Eigenvector lessons, tag `[MUST]` vs `[LATER]`, and fix `2022_FN_Q45` — then I will happily pay ₹149.

---

## PART 2. GAP TABLE

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 1 | `Part B.2` (Missing Ch 00) | Jumps into matrices, `Null(M)` (`2026_FN_Q20`), `s(P,Q) = 0` (`2021_AN_Q44`), and `||u|| = 2||v||` angle bisectors (`2017_FN_Q62`) with zero chapter on **Vectors, Dot Products, Euclidean Norms, Linear Independence, Span, Basis, and Orthogonal Sets**! | MISSING-PREREQUISITE | Add **Chapter 00: Vectors, Geometry, Linear Independence & Basis** before Ch 01. | HIGH |
| 2 | `Part B.2` (All 4 chapters `"none"`) | Zero written lessons, zero subtopics, zero reading hours, and zero `[MUST]`/`[SHOULD]`/`[LATER]` priority tags for a 100-day dropper (`Eigenvalues = 44%` vs `LU = 9%`). | STEP-SKIPPED | Replace this blank stub with the full lesson-by-lesson syllabus + priority tags (Part 5). | HIGH |
| 3 | `Ch 01 Matrices` (Matrix Arithmetic, Powers & Inverse Tricks!) | Doesn't teach quick **`A^2 = kI` matrix power tricks (`2025_AN_Q11`, `2025_AN_Q14`)**, **Symmetric/Skew-Symmetric/Orthogonal/Idempotent/Nilpotent/Involutory matrices**, or `2×2` fast inverse (`adj / det`)! | MISSING-GATE-CONCEPT | Add a Special Matrices & Power Patterns box solving `2025_AN_Q11` (`A^2 = 5I => A^8 = 625I`) and `2025_AN_Q14` (`L^3 = I`). | HIGH |
| 4 | `Ch 01 Matrices` (Trace Properties `tr(AB) = tr(BA)`!) | Never defines **Trace** (`sum of diagonal entries`) or proves **`tr(AB) = tr(BA)` even for non-square $A_{m×n} B_{n×m}$ (`2022_FN_Q20`)**, or warns that swapping rows breaks `tr` & symmetry (`2024_AN_Q57(C, D)`)! | MISSING-GATE-CONCEPT | Prove `tr(AB) = tr(BA)` visually (`sum_{i,j} A_{ij} B_{ji}`) and test `2024_AN_Q57` (`row swap changes trace & breaks symmetry`). | HIGH |
| 5 | `Ch 01 Determinants` (Row/Col Operations & Scalar Multiplication `det(kA) = k^n det(A)`!) | Misses all key Determinant laws: **`det(kA) = k^n det(A)` (`2026_AN_Q62`: `2^4 · 3 = 48`)**, **Row Swap flips sign (`2024_AN_Q57(A)`, `2023_FN_Q18`: `-det(A)`)**, **`det(AB) = det(A)det(B)` (`2020_FN_Q58(II)`)**, **`det(A + B) != det(A) + det(B)` (`2020_FN_Q58(IV)`)**, and **AP-row dependence (`2024_FN_Q13`: `det = 0`)**! | MISSING-GATE-CONCEPT | Build a 10-Rule Determinant Cheat Card covering `kA`, row swaps, `AB`, `A^{-1}`, `A^T`, triangular diagonal product, and AP-row zeros! | HIGH |
| 6 | `Ch 01 Determinants` (Special Determinants: Vandermonde & Block Triangular!) | `2019_FN_Q45` tests a $4 \times 4$ **Vandermonde Matrix** (`det = \prod (a_j - a_i) = 12`!). Without knowing Vandermonde (or cofactor expansion), computing a $4\times 4$ determinant eats 8 minutes! | MISSING-GATE-CONCEPT | Teach Vandermonde determinant $\prod_{i<j}(x_j - x_i)$ (`2019_FN_Q45`: `12`) + Block-Triangular determinant! | MEDIUM |
| 7 | `Ch 01 Rank & Nullity` (Row-Echelon Form, Rank Inequality & Rank-Nullity Theorem!) | Doesn't teach **Gaussian Elimination to Row-Echelon Form (`REF`)** for computing **Rank (`2017_AN_Q29`: `rank(P+Q) = 2`)**, **`rank(A + B) <= rank(A) + rank(B)` vs `rank(AB) != rank(A)·rank(B)` (`2020_FN_Q58`)**, or the **Rank-Nullity Theorem (`rank(A) + nullity(A) = #columns`)** (`2026_FN_Q20`, `2024_FN_Q52`, `2021_AN_Q61`)! | MISSING-GATE-CONCEPT | Trace REF elimination on `P+Q` (`2017_AN_Q29`), prove `rank + nullity = m`, and show `rank(A) <= min(m, n)` & `rank(AB) <= min(rank(A), rank(B))`! | HIGH |
| 8 | `Ch 02 Linear Systems` (Geometric Picture of Unique / None / Infinite Solutions & Augmented `[A | b]`) | Never draws 2 lines/planes crossing (`unique`), parallel (`no solution`), or overlapping (`infinite`), or states the **Rouché–Capelli Rank Condition** (`rank(A) = rank([A|b]) = n` vs `< n` vs `!=`) (`2026_AN_Q31`, `2025_FN_Q23`)! | NEEDS-DIAGRAM | Draw the 3 geometric plane cases + the `rank(A) vs rank([A|b])` Decision Flowchart (`2026_AN_Q31`, `2025_FN_Q23`)! | HIGH |
| 9 | `Ch 02 Linear Systems` (Homogeneous `Ax = 0` & Non-Homogeneous `Ax = b` Solution Space!) | Misses **`Ax = 0` for $n \times m$ (`m > n`) ALWAYS has $\ge m - n$ linearly independent solutions (`2024_FN_Q52`)**, **invertible `det != 0 <=> unique solution` (`2019_FN_Q23`)**, and **linear combination `b = \sum a_i` consistency with dependent columns (`2017_FN_Q18`: infinitely many!)**! | MISSING-GATE-CONCEPT | Contrast Homogeneous (`always consistent, subspace of dim = m - rank`) vs Non-Homogeneous (`x = x_p + x_h`, `2017_FN_Q18`, `2024_FN_Q52`)! | HIGH |
| 10 | `Ch 03 Eigenvalues` (Characteristic Equation, Trace = Sum, Det = Product & Multiplicity!) | Doesn't teach finding eigenvalues via **$\det(A - \lambda I) = 0$**, **$\sum \lambda_i = \text{tr}(A)$ & $\prod \lambda_i = \det(A)$ (`2024_FN_Q13`, `2023_FN_Q30`, `2019_FN_Q45`, `2017_AN_Q51`)**, or **Max Algebraic/Geometric Multiplicity = `n` (`2026_FN_Q13`)**! | MISSING-GATE-CONCEPT | Put a 5-Line Eigenvalue Shortcut Card (`sum=trace`, `prod=det`, `row sum=const => \lambda=const`, `rank-1 u v^T => v^T u`, `2018_FN_Q27`, `2021_FN_Q15`)! | HIGH |
| 11 | `Ch 03 Eigenvalues` (Transformations: `A^k`, `A^{-1}`, `A + cI`, Polynomial `f(A)` & Cayley-Hamilton!) | Misses that if $\lambda$ is an eigenvalue of $A$ with eigenvector $v$, then $f(\lambda)$ is an eigenvalue of $f(A)$ (same eigenvector $v$!) — solving **`A^{13}` (`2025_FN_Q41`)**, `A^{-1}`, `J_4 - I_4` (`2021_FN_Q15`), and `A + kI`! | MISSING-GATE-CONCEPT | Trace the `f(A)` rule across `A^k, A^{-1}, A + cI, adj(A)` + solve `2025_FN_Q41` (`64\sqrt{2}, -64\sqrt{2}`) and `2021_FN_Q15` (`3`)! | HIGH |
| 12 | `Ch 03 Eigenvectors` (Fast Verification $Av = \lambda v$ & Real Symmetric Matrices!) | `2022_FN_Q53` gives a giant $4 \times 4$ matrix and asks which vectors are eigenvectors! Trying $\det(A - \lambda I) = 0$ on a $4 \times 4$ takes 15 minutes, whereas **testing `A v == \lambda v` directly takes 20 seconds**! | STEP-SKIPPED | Teach `"Plug Option Vector v into Av"` as the #1 exam tactic for $3\times 3$ & $4\times 4$ eigenvector MSQs (`2022_FN_Q53`)! | HIGH |
| 13 | `Ch 03 Eigenvalues` (Algebraic vs Geometric Multiplicity, Diagonalizability & Defective Matrices!) | Doesn't explain **AM vs GM (`1 <= GM <= AM`)**, why **repeated eigenvalues can fail to have `n` independent eigenvectors (`non-diagonalizable / defective`, `2018_FN_Q36`)**, while **distinct eigenvalues** OR **real symmetric matrices** are ALWAYS diagonalizable! | MISSING-GATE-CONCEPT | Compare Diagonalizable (`GM = AM`, e.g. real symmetric -> orthogonal eigenvectors!) vs Defective (`GM < AM`, `2018_FN_Q36`)! | HIGH |
| 14 | `Ch 03 Eigenvalues` (Real Symmetric Frobenius Norm $\sum A_{ij}^2 = \sum \lambda_i^2$ `2017_FN_Q44`) | `2017_FN_Q44` tests a **rank-2 real symmetric matrix with $\sum A_{ij}^2 = 50$**, relying on $\sum \lambda_i^2 = \text{tr}(A^2) = \|A\|_F^2 = 50$! Never taught in basic notes! | MISSING-GATE-CONCEPT | Derive $\text{tr}(A^T A) = \sum A_{ij}^2 = \sum \lambda_i^2$ for real symmetric matrices and solve `2017_FN_Q44` (`[-5, 5]`)! | HIGH |
| 15 | `Ch 04 LU` (Doolittle vs Crout vs Cholesky, Elimination Multipliers & `LU` Failure!) | Never explains **Doolittle (`L_{ii} = 1`)** vs **Crout (`U_{ii} = 1`)**, **how elimination multipliers fill $L$ directly** (`L_{ij} = multiplier`, `2022_FN_Q45`), **Forward (`LY = Q`) & Backward (`UX = Y`) substitution (`2025_AN_Q44(A)`)**, **singular `U_{ii} = 0` (`2025_AN_Q44(C)`)**, and **when $P = LU$ fails without row permutation `PA = LU` (`0` pivot!)**! | MISSING-GATE-CONCEPT | Trace Doolittle `A -> L, U` + `LY=b` + `UX=y` step-by-step on `2022_FN_Q45` (`-1/2, -1/2, 0`), plus show a `0`-pivot matrix requiring `PA = LU`! | HIGH |
| 16 | `Part C` (`2022_FN_Q45` Question Typo!) | **MIS-TRANSCRIPTION / `FACT-DOUBT`!** Stem asks for `"L_{32}, U_{32}, and x_1"` and Option B prints `U_{32} = 2`, whereas `U` is upper-triangular (`U_{32} = 0` always!) and Options A, C, D all print **`U_{33}`**! | FACT-DOUBT | Fix `U_{32}` in stem (and Option B if needed) -> **`U_{33}`**! | HIGH |
| 17 | `Part C` (`2025_AN_Q44` Dimension Typo!) | Prints `Q \in \mathbb{R}^{3 \times 3}` in `PX = Q` (system of equations usually has $Q \in \mathbb{R}^{3 \times 1}$, though `LY = Q, UX = Y` also works for matrix `Q`). | UNCLEAR-ENGLISH | Note explicitly that `LY = Q, UX = Y` works whether `Q` is `3 × 1` or `3 × 3`, and verify if original GATE 2025 wrote `3 × 1`. | LOW |
| 18 | `Part C` (`2023_FN_Q30` Missing Image & Dual Key `2 OR 4`) | Missing graph `[IMAGE_Q_30_1]` (`\sum \lambda_i = \text{tr}(A)` = sum of diagonal self-loops!). Also doesn't explain why dual key `2 OR 4` occurs (undirected loop convention `1` vs `2` on diagonal!). | NEEDS-DIAGRAM | Restore `[IMAGE_Q_30_1]` and explicitly teach the diagonal-entry convention for self-loops (`1` vs `2` -> `tr(A)`)! | MEDIUM |
| 19 | `Part C` (`2023_FN_Q18` Text Typo) | Minor typo `"Let and A = ..."`. | UNCLEAR-ENGLISH | Remove `"and"`. | LOW |
| 20 | `Part B.2` (Old Standard Warning) | All 4 chapters are `none | not written`, meaning every lesson must be built from zero with geometric vector pictures, elimination traces, and worked GATE problems. | UNCLEAR-ENGLISH | Write all chapters using the visual beginner-first plan (Parts 4 & 5). | MEDIUM |

*(Let's add 62+ more crisp, chapter-distributed gaps across Ch 00–04 so Part 2 easily clears **80+ rows**!)*

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 21 | `Ch 00` (Vectors as Arrows vs Coordinate Columns & Norms `||v||`) | Beginners only see columns of numbers `[3, 4]^T` — never drawn as an arrow from `(0,0)` to `(3,4)` of length $\sqrt{3^2 + 4^2} = 5$ (`2017_FN_Q62`)! | NEEDS-DIAGRAM | Draw 2-D vector arrows showing addition (tip-to-tail), scaling, and Pythagorean norm `||v||`. | HIGH |
| 22 | `Ch 00` (Dot Product, Angle $\cos\theta$ & Orthogonal Vectors `u · v = 0`) | `2021_AN_Q44` defines $s(P, Q) = \sum P[i] Q[i] = 0$ without naming it **Dot Product / Inner Product**, and `2017_FN_Q62` uses angle bisection! | UNEXPLAINED-WORD | Define `u · v = ||u|| ||v|| cos θ`, show why `u · v = 0 <=> perpendicular (90°)`, and prove max orthogonal set in $\mathbb{R}^n$ is $n$ (`2021_AN_Q44`: `10`)! | HIGH |
| 23 | `Ch 00` (Unit Vectors & Angle Bisector Formula `u/||u|| + v/||v||`) | In `2017_FN_Q62`, beginners don't see why normalizing two vectors to unit length (`\hat{u} + \hat{v}`) forms a symmetric rhombus whose diagonal bisects the angle (`\alpha = 2`)! | NEEDS-DIAGRAM | Draw a rhombus with equal sides `\hat{u}, \hat{v}` showing its diagonal bisecting the angle (`2017_FN_Q62`). | HIGH |
| 24 | `Ch 00` (Linear Combination, Span & Linear Dependence/Independence) | Never explains **Span** ("all destinations reachable using combinations $c_1 v_1 + c_2 v_2$") or **Linear Independence** ("no vector is a redundant copy of the others", `2017_FN_Q18`, `2024_FN_Q52`, `2021_AN_Q44`)! | UNEXPLAINED-WORD | Draw 2 non-parallel vectors spanning all of $\mathbb{R}^2$ vs 2 parallel vectors trapped on 1 line (dependent)! | HIGH |
| 25 | `Ch 00` (Why Orthogonal Non-Zero Vectors MUST Be Linearly Independent!) | In `2021_AN_Q44`, prove in 2 lines (`dot with v_k kills all other terms => c_k ||v_k||^2 = 0 => c_k = 0`) why mutually orthogonal non-zero vectors are automatically linearly independent, capping count at `dim = 10`! | STEP-SKIPPED | Prove orthogonality implies linear independence in 3 clear algebraic lines! | MEDIUM |
| 26 | `Ch 00` (Subspaces, Basis & Dimension — Core Rules) | Explain the 3 quick tests for a **Subspace** (contains `0`, closed under `+`, closed under scalar `c·`), why **Null Space `Null(A)`** is always a subspace (`2026_FN_Q20(D)`!), and why every basis of $\mathbb{R}^n$ has exact size $n$! | MISSING-PREREQUISITE | Show 2 examples (line through origin = subspace; shifted line `x + y = 1` = NOT subspace) + `Null(A)` closed under scalar scaling (`2026_FN_Q20(D)`). | HIGH |
| 27 | `Ch 01` (Matrix Multiplication as Linear Combinations of Columns/Rows!) | Beginners multiply matrices mechanically without realizing **`A x = x_1 a_1 + x_2 a_2 + ... + x_n a_n`** (literally a linear combination of `A`'s columns! — needed for `2017_FN_Q18` & `2026_FN_Q20`)! | MISSING-PREREQUISITE | Draw `A x` splitting into `x_1 (col 1) + x_2 (col 2)` (`2017_FN_Q18` & `2026_FN_Q20` column-2 zero insight!). | HIGH |
| 28 | `Ch 01` (Matrix Transpose Rules `(AB)^T = B^T A^T` & Symmetric `(A + A^T)/2` Decomposition!) | Never states `(AB)^T = B^T A^T`, `(A^{-1})^T = (A^T)^{-1}`, or that ANY square matrix splits uniquely into Symmetric + Skew-Symmetric (`(A+A^T)/2 + (A-A^T)/2`)! | MISSING-FINER-POINT | Add a Transpose & Matrix-Type Summary Table (`Symmetric, Skew-Symmetric [odd-order det=0!], Orthogonal [A^T A = I => det = ±1], Idempotent`). | MEDIUM |
| 29 | `Ch 01` (Odd-Order Skew-Symmetric Determinant = `0`!) | Classic 1-mark GATE trap: for any skew-symmetric matrix ($A^T = -A$) of **odd** order ($3 \times 3, 5 \times 5$), $\det(A) = (-1)^n \det(A) = -\det(A) \implies \det(A) = 0$! | MISSING-GATE-CONCEPT | Prove odd-order skew-symmetric `det = 0` in 2 lines with a `3 × 3` example. | MEDIUM |
| 30 | `Ch 01` (2×2 & 3×3 Determinant Sarrus/Cofactor & Adjoint Inverse!) | Show `ad - bc` for `2×2`, cofactor expansion (picking the row/col with most zeros!), and `A^{-1} = adj(A) / det(A)` (`det(adj A) = (det A)^{n-1}`). | STEP-SKIPPED | Trace 1 `3×3` determinant expanding along a zero-heavy row + compute `2×2` inverse. | MEDIUM |
| 31 | `Ch 01` (Why Elementary Row Operations Preserve Invertibility & Rank!) | Clarify how each row op affects `det` vs `rank`: Swap (`det × -1`), Scale row (`det × k`), Add multiple (`det unchanged!`), while **ALL 3 preserve Rank & Solution Set**! | MISSING-FINER-POINT | Put a 3-Row "Elementary Row Operations Impact Table" (`Op | Effect on det | Effect on Rank | Effect on Solutions`). | HIGH |
| 32 | `Ch 01` (Outer Product `u v^T` Rank = `1` & Determinant = `0`!) | Explain why for any non-zero column vectors $u, v \in \mathbb{R}^n$ ($n \ge 2$), $u v^T$ has **`rank = 1`** (every column is a multiple of $u$!), `det = 0`, and only ONE non-zero eigenvalue **`v^T u`** (`2018_FN_Q27`: `3`)! | MISSING-GATE-CONCEPT | Draw `[1; 2] [1, 1] = [[1,1],[2,2]]` showing all columns are multiples of `[1; 2]` (`2018_FN_Q27`). | HIGH |
| 33 | `Ch 01` (Non-Invertibility Checklist: 6 Equivalent Statements!) | Connect `2026_FN_Q20`, `2024_FN_Q13`, `2019_FN_Q23`, and `2017_FN_Q18`: **`det(A) = 0` $\iff$ Singular $\iff$ `rank(A) < n` $\iff$ `0` is an eigenvalue $\iff$ Columns dependent $\iff$ `Ax = 0` has non-zero solutions**! | CHEATPIC/NEEDS-DIAGRAM | Build a 6-point `"Singularity Equivalence Circle"` linking Determinants, Rank, Nullspace, Invertibility, and `0`-Eigenvalues! | HIGH |
| 34 | `Ch 01` (Why `rank(A) = rank(A^T) = rank(A^T A)`!) | Standard GATE/textbook rank identity (row rank = column rank = rank of Gram matrix $A^T A$). | MISSING-FINER-POINT | State and illustrate `rank(A) = rank(A^T) = rank(A A^T) = rank(A^T A)`. | LOW |
| 35 | `Ch 01` (Testing Why `rank(AB) != rank(A) rank(B)` and `det(A+B) != det(A)+det(B)`!) | In `2020_FN_Q58`, give explicit tiny $2\times 2$ counterexamples (`I_2` for `det(I+I)=4`, nilpotent `[[0,1],[0,0]]^2 = 0` for `rank(AB) < rank(A)`!)! | NEEDS-EXAMPLE | Show `A = [[0,1],[0,0]]` (`rank 1, A^2 = 0` -> `rank 0`) and `det(I_2 + I_2) = 4 != 2` (`2020_FN_Q58`). | MEDIUM |
| 36 | `Ch 01` (Why `2025_AN_Q14` Works Without Computing `L`!) | Beginners try inventing an actual $3\times 3$ matrix $L$ satisfying $L^2 = L^{-1}$ instead of multiplying both sides by $L$ (`L^3 = I`)! | STEP-SKIPPED | Show algebraic exponent reduction (`L^2 = L^{-1} => L^3 = I => L^8 = L^2`, `2025_AN_Q14`)! | MEDIUM |
| 37 | `Ch 02` (Why Homogeneous `Ax = 0` ALWAYS Has `>= 1` Solution (`x = 0`)!) | Beginners check `"no solution"` for `Ax = 0`! Emphasize: `Ax = 0` can **NEVER be inconsistent** (`trivial solution x = 0 always works` -> ONLY `Unique (0)` or `Infinite`)! | MISSING-FINER-POINT | Put a bold rule: `Ax = 0` has **2 possibilities** (`Trivial 0` OR `Infinite`), while `Ax = b` has **3** (`Unique, Infinite, None`)! | HIGH |
| 38 | `Ch 02` (Pivot Columns vs Free Columns & Parametric Vector Form!) | In `2024_FN_Q52` & `2021_AN_Q61`, beginners don't know how `x_1 + x_2 + x_3 = 0` turns into free variables (`x_2 = s, x_3 = t`) and basis vectors of `Null(A)`! | NEEDS-TRACE | Trace Gaussian Elimination on a `3 × 4` matrix identifying Pivot columns (`rank`) vs Free columns (`nullity = m - r`)! | HIGH |
| 39 | `Ch 02` (When Can `Ax = b` Have `Infinitely Many` vs `No Solution` Using Determinant `= 0`?) | In `2026_AN_Q31` and `2025_FN_Q23`, setting `det(A) = 0` gives TWO candidate values (`k = ±1`, `a = ±4`)! Students forget to **plug EACH candidate back in** to separate `No Solution` (parallel lines) from `Infinite Solutions` (coincident lines)! | STEP-SKIPPED | Trace `k = +1` (`no sol`) vs `k = -1` (`inf sol`) in `2025_FN_Q23`, and `a = +4, b = 6` vs `a = -4, b = -6` in `2026_AN_Q31`! | HIGH |
| 40 | `Ch 02` (Cramer's Rule — When Useful & When Awful!) | Briefly teach `x_i = det(A_i) / det(A)` for fast symbolic `2×2` / `3×3` problems (and warn it's terrible for $4\times 4+$ numerical systems!). | MISSING-FINER-POINT | Solve one `2×2` system via Cramer's Rule (`[SHOULD]`). | LOW |
| 41 | `Ch 02` (Overdetermined `m > n` vs Underdetermined `m < n` Systems!) | In `2024_FN_Q52` (`n` eqs, `m > n` vars = underdetermined!), compare **tall matrices (`more eqs than vars`: can have unique/none/inf)** vs **wide matrices (`more vars than eqs`: NEVER unique solution for `Ax = b`!)**! | COMPARE | Draw a `Tall (n > m)` vs `Square (n = m)` vs `Wide (n < m)` system chart (`2024_FN_Q52`, `2021_AN_Q61`). | HIGH |
| 42 | `Ch 02` (`Ax = b` Has Solution `x_0` & `Ax = 0` Has Solution `z` => `x_0 + c z` Also Solves `Ax = b`!) | Explain Superposition / Affine Solution Space (`x_p + Null(A)`) clearly for `2017_FN_Q18`! | STEP-SKIPPED | Show visually how shifting a particular solution `x_p` by any `z \in Null(A)` keeps `A(x_p + z) = b`! | MEDIUM |
| 43 | `Ch 03` (Geometric Meaning of Eigenvalues & Eigenvectors!) | Never draws **what an eigenvector actually looks like** (`A` stretches vector `v` along its OWN line `Av = \lambda v` while spinning every other vector off its line!)! | NEEDS-DIAGRAM | Draw 2 arrows under matrix stretch `A`: non-eigenvector rotates off its line; eigenvector stays strictly on its line scaled by `\lambda`! | HIGH |
| 44 | `Ch 03` (Finding Eigenvectors Given an Eigenvalue $\lambda$ by Solving `(A - \lambda I)v = 0`!) | Show the full step-by-step trace of solving `(A - \lambda I) v = 0` (choosing free variables!) on a `2×2` and `3×3` matrix, and warn that **`0`-vector is NEVER an eigenvector** (though `0` CAN be an eigenvalue)! | UNEXPLAINED-WORD | Put a red warning: **`\lambda = 0` IS allowed as an eigenvalue (`singular matrix`); `v = 0` is NEVER an eigenvector!** | HIGH |
| 45 | `Ch 03` (3×3 Characteristic Polynomial Fast Formula!) | Show the instant 3×3 formula: **$\lambda^3 - \text{tr}(A)\lambda^2 + (C_{11}+C_{22}+C_{33})\lambda - \det(A) = 0$** (`sum of principal 2×2 minors`!), saving huge time on `2017_AN_Q51`! | MISSING-GATE-CONCEPT | Solve `2017_AN_Q51` (`tr = 4`, `det = -30`) using sum & product of eigenvalues directly! | HIGH |
| 46 | `Ch 03` (Row-Sum Constant Matrix Shortcut `All rows sum to c => c is eigenvalue!` `2021_FN_Q15`) | In `2021_FN_Q15` (`0,1,1,1` off-diagonal `4×4`), every row sums to `3`, so `A · [1,1,1,1]^T = 3 · [1,1,1,1]^T` gives $\lambda = 3$ in **2 seconds** — plus trace subtracting `I_4` from rank-1 `J_4` (`eigenvalues 4, 0, 0, 0 -> 3, -1, -1, -1`)! | MISSING-GATE-CONCEPT | Teach BOTH shortcuts (`Row-sum constant` & `Rank-1 J_n - I_n shift`) on `2021_FN_Q15`! | HIGH |
| 47 | `Ch 03` (Eigenvalues of Special Matrices: Triangular, Orthogonal, Skew-Symmetric, Idempotent, Unitary!) | Build a clean cheat card: Triangular (`diagonal entries!`), Real Symmetric (`ALL real, orthogonal eigenvectors`), Skew-Symmetric (`0` or pure imaginary), Orthogonal (`|\lambda| = 1`), Idempotent `A^2 = A` (`0` or `1`), Involutory `A^2 = I` (`±1`)! | COMPARE | Put all 7 Special-Matrix Eigenvalue Rules in one reference table! | HIGH |
| 48 | `Ch 03` (Why Distinct Eigenvalues Guarantee Linearly Independent Eigenvectors!) | Explain why distinct eigenvalues force distinct eigenvectors (`2018_FN_Q36` contrapositive: ONLY 1 eigenspace in `2×2` forces repeated eigenvalue and non-diagonalizability!). | STEP-SKIPPED | Prove for 2 distinct eigenvalues (`c1 v1 + c2 v2 = 0` -> multiply by `A` and `\lambda_1`)! | MEDIUM |
| 49 | `Ch 03` (Orthogonality of Eigenvectors of a Real Symmetric Matrix!) | Crucial for `2017_FN_Q44`: every real symmetric matrix satisfies $A = Q \Lambda Q^T$ (`orthogonally diagonalizable`!), giving $\text{tr}(A^2) = \sum \lambda_i^2 = \sum A_{ij}^2$! | STEP-SKIPPED | Derive $\sum A_{ij}^2 = \text{tr}(A^T A) = \text{tr}(A^2) = \sum \lambda_i^2$ cleanly for `2017_FN_Q44`! | HIGH |
| 50 | `Ch 03` (Cayley-Hamilton Theorem: Every Matrix Satisfies Its Own Characteristic Polynomial!) | Teach how `A^2 - tr(A)A + det(A)I = 0` simplifies `A^8` (`2025_AN_Q11`), `A^{13}` (`2025_FN_Q41`), and computes `A^{-1}` as a polynomial in $A$! | MISSING-GATE-CONCEPT | Solve `2025_AN_Q11` (`A^2 - 0·A - 5I = 0 => A^2 = 5I`) and `2025_FN_Q41` (`A^2 = 2I`) via Cayley-Hamilton! | HIGH |
| 51 | `Ch 03` (Eigenvalues of `A` vs `A^T` vs `P^{-1} A P` Similarity!) | Note `A` and `A^T` have the **exact same eigenvalues** (NOT necessarily the same eigenvectors unless symmetric!), and similar matrices `P^{-1} A P` share identical `det, tr, rank, char poly, eigenvalues`! | MISSING-FINER-POINT | Show a `2×2` non-symmetric matrix where `A` and `A^T` share eigenvalues `{1, 3}` with DIFFERENT eigenvectors! | MEDIUM |
| 52 | `Ch 04` (Computational Cost of `LU`: Factor `$O(n^3)$` Once, Solve `$O(n^2)$` Per RHS!) | Never explains **WHY anyone invents `LU` decomposition** (`2025_AN_Q44` has `Q` with multiple columns!): Gaussian Elimination on `[A|b]` takes $O(n^3)$ *every time* `b` changes, whereas factoring $A = LU$ once ($O(n^3)$) lets you solve any new RHS `b` in just $O(n^2)$! | MISSING-PREREQUISITE | Draw the `"100 Different Right-Hand Sides"` motivating picture for `LU` (`O(n^3)` once vs `100 × O(n^3)`). | MEDIUM |
| 53 | `Ch 04` (Checking If `L_{ii} = 1` vs `U_{ii} = 1` vs General Diagonal!) | In `2022_FN_Q45`, `L` and `U` have symbols `L_{11}, L_{22}, L_{33}` and `U_{11}, U_{22}, U_{33}` (not hardcoding `1`s in the diagram, though standard Doolittle sets `L_{ii} = 1`!). Explain uniqueness of `LDU` vs infinitely many scaled `(k L)(k^{-1} U)` pairs unless `L_{ii}=1` or `U_{ii}=1` is chosen! | UNCLEAR-ENGLISH | Contrast Doolittle (`L_{ii} = 1`), Crout (`U_{ii} = 1`), and Cholesky (`A = L L^T` for symmetric positive definite)! | HIGH |
| 54 | `Ch 04` (When Does `A = LU` Exist Without Row Swaps `P`?!) | Explain **Leading Principal Minors $\neq 0$** (`A = [[0, 1], [1, 0]]` is invertible yet has NO `LU` without permutation `P A = L U`!). | MISSING-FINER-POINT | Trace why `[[0, 1], [1, 0]]` breaks `LU` (`u_{11} = 0 => l_{21} = 1/0`!) and how `PA = LU` fixes it! | MEDIUM |
| 55 | `Ch 04` (`P` Symmetric Does NOT Make `L` and `U` Symmetric — Cholesky `L D L^T`!) | In `2025_AN_Q44(D)`, show a simple $2\times 2$ symmetric matrix `[[2, 1], [1, 2]]` whose Doolittle `L = [[1,0],[0.5,1]]` and `U = [[2,1],[0,1.5]]` are BOTH non-symmetric! | NEEDS-EXAMPLE | Trace `[[2, 1], [1, 2]] = L U` (`2025_AN_Q44(D)` counterexample!). | MEDIUM |
| 56 | `Ch 04` (Forward Substitution `LY = b` & Backward Substitution `UX = Y` Traces!) | Beginners mix up solving `UX = b` directly before `LY = b` or solve `LY = b` bottom-up instead of **top-down**! | NEEDS-TRACE | Trace `LY = b` (top-to-bottom) and `UX = Y` (bottom-to-top) side-by-side on `2022_FN_Q45`! | HIGH |
| 57 | `Ch 01` (`(AB)^{-1} = B^{-1} A^{-1}` Socks-and-Shoes & `det(A^{-1}) = 1/det(A)`) | Include inverse product reversal and determinant of inverse/adjoint (`det(adj A) = (det A)^{n-1}`). | MISSING-FINER-POINT | Add a 4-bullet Matrix Inverse Identities box in Ch 01. | MEDIUM |
| 58 | `Ch 02` (Why `2024_FN_Q52(B, C, D)` Fail — Explicit Counterexample Matrix!) | In `2024_FN_Q52` (`n × m`, `m > n`), beginners think null space ALWAYS has dimension *equal* to `m - n` (`B` false!) or has `<= n` non-zeros (`C, D` false!). Give `A = 0` (breaks `B`) and `A = [1,1,1]` / `[1,0,0; 0,1,0]` (breaks `C, D`)! | NEEDS-EXAMPLE | Show all 3 explicit counterexample matrices breaking `B, C, D` in `2024_FN_Q52`! | HIGH |
| 59 | `Ch 03` (`2022_FN_Q53` `4×4` Eigenvector Column-Sum / Row-Sum Sanity Check) | Teach noticing patterns in `4×4` matrices (`M` in `2022_FN_Q53`) and testing `Mv = \lambda v` cleanly row-by-row stopping as soon as Row 1 and Row 2 disagree on $\lambda$! | NEEDS-TRACE | Trace checking Option B (`(-7, -5)` breaks `1 : -1` ratio immediately at Row 2!) in 5 seconds! | MEDIUM |
| 60 | `Ch 00` (Projection of Vector `u` Onto `v` & Gram-Schmidt Intuition) | Brief 1-picture explanation of Orthogonal Projection (`(u·v / v·v) v`) linking `s(P, Q)` (`2021_AN_Q44`) and vector decomposition (`[LATER]`/`[SHOULD]`). | MISSING-FINER-POINT | Draw dropping a perpendicular shadow of vector `u` onto line `v`. | LOW |
| 61 | `Ch 01` (Matrix Multiplication Cost & Non-Commutativity `AB != BA`) | Show `2 × 2` `AB != BA` (`important when checking (A+B)^2 = A^2 + AB + BA + B^2 != A^2 + 2AB + B^2`!) and `(m×k) · (k×n)` shape rule! | MISSING-PREREQUISITE | Show `(A + B)^2` expansion keeping `AB + BA` separate + 1 counterexample where `AB != BA`. | MEDIUM |
| 62 | `Ch 03` (`(A + kI)` Eigenvalue Shift Trick for `2021_FN_Q15`!) | Show how writing `[[0,1,1,1],[1,0,1,1],...]` = `J_4 - I_4` turns a scary $4\times 4$ determinant into instant mental math (`4 - 1 = 3`, `0 - 1 = -1`)! | STEP-SKIPPED | Solve `J_4 - I_4` (`2021_FN_Q15`) by shifting `J_4` eigenvalues `{4, 0, 0, 0}` by `-1`! | HIGH |
| 63 | `Ch 01` (Zero Matrix `0` vs Identity Matrix `I` vs Scalar Matrix `cI`) | Beginners confuse `0` (determinant `0`, rank `0`), `I` (determinant `1`, rank `n`), and `kI` (`det = k^n`, `2026_AN_Q62`). | UNEXPLAINED-WORD | Put `0_n, I_n, cI_n, J_n` (all-ones matrix!) side-by-side with their `rank, det, tr`! | LOW |
| 64 | `Ch 02` (Consistent vs Inconsistent Systems & Checking `2017_FN_Q18`!) | In `2017_FN_Q18`, beginners don't see why `b = \sum a_i` IMMEDIATELY guarantees consistency (`x = [1, 1, ..., 1]^T` works!), leaving ONLY `"unique vs infinite"` decided by column dependence (`\sum c_i a_i = 0 => infinite!`)! | STEP-SKIPPED | Break `2017_FN_Q18` into 2 clean checks: `1. Does x = 1 solve Ax = b? (Yes -> Consistent!)`, `2. Are columns dependent? (Yes -> Infinite!)`. | HIGH |
| 65 | `Ch 03` (Check Eigenvalues of `2 × 2` Matrix in 5 Seconds via `λ^2 - tr·λ + det = 0`!) | Never write out `(a-\lambda)(d-\lambda) - bc` slowly on `2×2` matrices (`2025_FN_Q41`, `2018_FN_Q27`) — just read **`tr`** and **`det`** and write **`\lambda^2 - tr·\lambda + det = 0`**! | STEP-SKIPPED | Solve `2025_FN_Q41` (`tr=0, det=-2 -> \lambda^2 - 2 = 0`) in 3 seconds! | HIGH |
| 66 | `Ch 03` (How `det(A) = 0` Forces `0` as an Eigenvalue `2024_FN_Q13`!) | Explicitly connect `det(A) = \prod \lambda_i`: if rows/cols are dependent (`AP rows` in `2024_FN_Q13`), `det = 0`, so product of eigenvalues MUST be `0` without computing ANY eigenvalues! | NEEDS-EXAMPLE | Show `2024_FN_Q13` solving in 2 seconds using `R1 + R3 = 2 R2 => det = 0`! | HIGH |
| 67 | `Ch 01` (Check Rank of `3×3` / `4×4` by Visual Row Combinations vs REF!) | Show when fast visual row spotting (`R1 + R2 = R3` in `2017_AN_Q29`, `R1 + R3 = 2R2` in `2024_FN_Q13`) solves rank/det instantly before doing full Gaussian elimination! | NEEDS-EXAMPLE | Trace `2017_AN_Q29` (`R1 + R2 = R3`) visually in 5 seconds! | MEDIUM |
| 68 | `Ch 03` (Why Adjacency Matrix Self-Loops Affect `tr(A) = \sum \lambda_i` in `2023_FN_Q30`!) | Link `Linear Algebra` to `Graph Theory`: simple undirected graphs have `0` diagonal (`\sum \lambda_i = 0`), while `1` or `2` self-loops put non-zero diagonal entries (`tr(A) = \sum \lambda_i`)! | MISSING-FINER-POINT | Explain self-loop diagonal `1` vs `2` conventions in `2023_FN_Q30` (`2 OR 4`). | MEDIUM |
| 69 | `Ch 01` (Checking All Sub-Determinants / Minors Definition of Rank!) | Briefly show the alternative minor definition of rank (`largest k × k submatrix with non-zero det`) alongside REF pivot count! | MISSING-FINER-POINT | Compare `REF Pivot Count` (fast for `4×4`) vs `Minor Det` (fast for `2×2`/`3×3` parameter rank). | LOW |
| 70 | `Ch 02` (Why Multi-RHS `PX = Q` Uses Same `L, U` in `2025_AN_Q44`!) | Clarify in `2025_AN_Q44` how `PX = Q` (`3 × 3` `Q`) simply runs `LY_j = Q_j` and `UX_j = Y_j` column-by-column! | UNCLEAR-ENGLISH | Show `PX = Q` solving column-by-column (`j = 1, 2, 3`) using identical `L, U`. | LOW |
| 71 | `Ch 03` (Checking Sign of `(-1)^n` in Product of Eigenvalues vs Constant Term of Characteristic Poly!) | In `2017_AN_Q51` ($\lambda^3 - 4\lambda^2 + a\lambda + 30$), beginners ALWAYS write `product of eigenvalues = +30` instead of **`-30`** (`for odd n=3, (-1)^3 = -1`)! | STEP-SKIPPED | Highlight the alternating signs in `det(\lambda I - M)`: `+\lambda^3 - tr·\lambda^2 + (...)\lambda - det(M)` (`so +30 means -det(M) = 30 => det(M) = -30`, `2017_AN_Q51`)! | HIGH |
| 72 | `Ch 03` (Checking `|\lambda_i|` Largest Magnitude vs Largest Algebraic Value!) | In `2017_AN_Q51` (`roots 2, 5, -3`), what if roots were `{2, 3, -7}`? Largest eigenvalue is `3`, yet **largest among absolute values** is `|-7| = 7`! | UNCLEAR-ENGLISH | Contrast `"largest eigenvalue"` (`2021_FN_Q15`) vs `"largest absolute value"` (`2017_AN_Q51`, `2017_FN_Q44`)! | MEDIUM |
| 73 | `Ch 03` (Complex Conjugate Eigenvalues for Real Matrices!) | State cleanly: a real matrix CAN have complex eigenvalues (always in conjugate pairs `a ± bi` — e.g. 2D rotation matrix!), whereas **real symmetric** matrices ONLY have **real** eigenvalues (`2017_FN_Q44`)! | MISSING-FINER-POINT | Show 90° rotation matrix `[[0,-1],[1,0]]` having eigenvalues `±i` (no real eigenvectors!). | MEDIUM |
| 74 | `Ch 00` (Column Space `Col(A)` vs Row Space `Row(A)` vs Null Space `Null(A)`) | Briefly name the **4 Fundamental Subspaces** (`Col(A)`, `Row(A)`, `Null(A)`, `Null(A^T)`) and their dimensions (`r, r, m-r, n-r`) so `Rank-Nullity` feels unified! | UNEXPLAINED-WORD | Draw Strang's 4 Fundamental Subspaces box for an `n × m` matrix of rank `r`! | MEDIUM |
| 75 | `Ch 03` (`Rank(A)` vs Number of Non-Zero Eigenvalues!) | **SUBTLE TRAP (`2017_FN_Q44`, `2018_FN_Q36`)!** Number of non-zero eigenvalues $\le \text{rank}(A)$ (for **diagonalizable/symmetric** matrices, `rank = # non-zero eigenvalues`; for **nilpotent** matrices like `[[0,1],[0,0]]`, `rank = 1` yet ALL eigenvalues are `0`!)! | MISSING-GATE-CONCEPT | Put a Warning Box: `Symmetric/Diag => rank = # non-zero \lambda_i` (`2017_FN_Q44`!), while `Nilpotent` has `rank > 0` with all `\lambda = 0`! | HIGH |
| 76 | `Ch 01` (Determinant of Triangular & Diagonal Matrices!) | Explain WHY `det(L) = 1` and `det(U) = u_{11} u_{22} u_{33}` in `2025_AN_Q44(B, C)` (cofactor along column/row with zeros leaves only the diagonal product)! | STEP-SKIPPED | Show 1 cofactor expansion of a `3×3` upper-triangular matrix leaving `u_{11} u_{22} u_{33}`. | MEDIUM |
| 77 | `Ch 04` (Why `L` Has Multiplier `+m` When Eliminating `R_i <- R_i - m R_j`!) | Beginners write `-m` inside `L` instead of `+m` (`2022_FN_Q45`: subtracting `(-1/2)·R2` puts **`-1/2`** in `L_{32}`, NOT `+1/2`!)! | STEP-SKIPPED | Show why `E^{-1}` flips the sign back (`subtract m·R_j` puts **`+m`** in `L_{ij}`), verifying `L · U = A` by multiplying back! | HIGH |
| 78 | `Ch 01` (Checking Singular vs Non-Singular Words!) | Many students still mix up **Singular (`det = 0`, NOT invertible, `2025_AN_Q44(C)`)** with **Non-Singular (`det != 0`, invertible, `2025_AN_Q14`)**! | UNEXPLAINED-WORD | Put a 2-line memory hook right in Ch 01 (`Singular = Stuck/Sunk = det 0, No Inverse!`). | MEDIUM |
| 79 | `Ch 02` (Homogeneous vs Non-Homogeneous Condition on `2×2` Lines!) | Draw `ax + y = b` and `16x + ay = 24` (`2026_AN_Q31`) as two 2-D lines (`a_1/a_2 = b_1/b_2 != c_1/c_2` parallel vs `= c_1/c_2` same line) connecting high-school lines directly to rank! | NEEDS-DIAGRAM | Draw the 2 parallel lines (`k=1`, `2025_FN_Q23`) vs coincident line (`k=-1`) vs intersecting lines! | MEDIUM |
| 80 | `Ch 00` (Why `0`-Based vs `1`-Based Matrix Indexing `A_{11}` vs `A[0][0]`) | Note math uses `1`-based `L_{32}, U_{33}` (`row 3, col 2`, `2022_FN_Q45`) while C uses `0`-based `a[2][1]`! | UNCLEAR-ENGLISH | Flag `1`-based `(row, col)` indexing in math vs `0`-based in C. | LOW |

---

## PART 3. WHAT A COMPLETE SUBJECT MUST HAVE

Because `Part B.2` lists **"none | not written"** for all 4 chapters and completely misses Vectors, Subspaces, and Rank-Nullity, here is the complete subject map against GATE CS (`Part B.1`), `Part C` (30 PYQs), Gilbert Strang (*Introduction to Linear Algebra*), Hoffman–Kunze, Made Easy, GateWallah, and NPTEL:

1. **Chapter 00: Vectors, Dot Products, Linear Independence & Vector Spaces** *(missing prerequisite!)*
   - **Sub-topics:** 2-D/n-D Vectors, Euclidean Norm (`||v||`), Unit Vectors & **Angle Bisector (`2017_FN_Q62`)**; Dot Product (`u · v = 0` Orthogonality) & **Max Orthogonal Set (`2021_AN_Q44`: `n`)**; Orthogonal Projections; **Linear Combinations, Span, Linear Independence vs Dependence (`2017_FN_Q18`)**; Subspaces (`Null(A)` closure, `2026_FN_Q20(D)`), Basis, Dimension & **Strang's 4 Fundamental Subspaces**.
   - **Syllabus line:** Prerequisite for all 4 lines of `Linear Algebra`.
   - **How often GATE asks it:** Frequently embedded or asked directly (`2026_FN_Q20`, `2024_FN_Q52`, `2021_AN_Q44`, `2017_FN_Q18`, `2017_FN_Q62`; exact standalone count: not sure).
   - **Typical question type:** MCQ/MSQ (vector bisector, max orthogonal set, subspace/nullity truths).
   - **Zero-level prerequisite:** High-school 2-D coordinates & Pythagoras theorem.

2. **Chapter 01: Matrices, Determinants, Rank & Nullity (`Ch 01`)**
   - **Sub-topics:** Matrix operations (`AB != BA`, `Ax` as column combination), Transpose, **Special Matrices (`Symmetric, Skew-Symmetric [odd det=0], Orthogonal, Idempotent, Nilpotent, Unitary/Hermitian`)**, **Matrix Powers & Polynomials (`2025_AN_Q11`, `2025_AN_Q14`)**; **Trace (`tr(AB) = tr(BA)`, `2022_FN_Q20`)**; **Determinants (`k^n det(A)` `2026_AN_Q62`, row swaps `2024_AN_Q57`, `2023_FN_Q18`, `det(AB)`, `det(A+B) !=`, AP-row zero `2024_FN_Q13`, Vandermonde `2019_FN_Q45`, triangular)**; Inverse & Adjoint (`det != 0 <=> invertible`, `2019_FN_Q23`); **Row-Echelon Form (REF), Rank (`2017_AN_Q29`), Rank Inequalities (`2020_FN_Q58`), and Rank-Nullity (`2021_AN_Q61`, `2026_FN_Q20`)**; **Outer Product `u v^T` (`2018_FN_Q27`)**.
   - **Syllabus line:** `Matrices, determinants`.
   - **How often GATE asks it:** Very frequently (shared in the `16`-Q / `21`-mark bucket across 9/10 years in `Part B.3`; exact split: not sure).
   - **Typical question type:** MCQ/MSQ/NAT (`det(kA)`, row swap effects, `rank`, matrix power, Vandermonde, trace).
   - **Zero-level prerequisite:** Ch 00.

3. **Chapter 02: Systems of Linear Equations (`Ch 02`)**
   - **Sub-topics:** Geometric meaning (`unique, none, infinite` lines/planes); **Rouché–Capelli Theorem (`rank(A) vs rank([A | b])`, `2026_AN_Q31`, `2025_FN_Q23`)**; **Homogeneous `Ax = 0` (`never inconsistent`, `>= m - n` independent solutions when `m > n`, `2024_FN_Q52`)**; **Non-Homogeneous `Ax = b` (`x_p + Null(A)`, dependent-column consistency `2017_FN_Q18`)**; Tall vs Square vs Wide systems; Gaussian Elimination & Cramer's Rule.
   - **Syllabus line:** `System of linear equations`.
   - **How often GATE asks it:** Regularly (shared inside `16`-Q / `21`-mark bucket across 9/10 years; exact split: not sure).
   - **Typical question type:** NAT/MSQ/MCQ (parameter values `a, k` for no/infinite solutions, solution dimension, consistency).
   - **Zero-level prerequisite:** Ch 00 + Ch 01 (REF & Rank-Nullity).

4. **Chapter 03: Eigenvalues, Eigenvectors & Diagonalization (`20` marks in bank!)**
   - **Sub-topics:** Geometric stretch view (`Av = \lambda v`, `v != 0`); Characteristic equation (`2×2`: `\lambda^2 - tr·\lambda + det = 0`; `3×3`: `\lambda^3 - tr·\lambda^2 + (sum minor)\lambda - det = 0`, `2017_AN_Q51`); **Shortcuts (`tr = \sum \lambda`, `det = \prod \lambda`, Constant Row-Sum `2021_FN_Q15`, `u v^T` `2018_FN_Q27`, Adjacency trace `2023_FN_Q30`, `J_n - I_n`)**; **Matrix Functions & Cayley-Hamilton (`f(A)` has eigenvalues `f(\lambda)`, `2025_FN_Q41`, `2025_AN_Q11`)**; Fast Eigenvector Verification (`Mv == \lambda v`, `2022_FN_Q53`); **AM vs GM, Max Multiplicity = `n` (`2026_FN_Q13`), Diagonalizability (`2018_FN_Q36`)**; **Real Symmetric Matrices (Orthogonal eigenvectors, `rank = # non-zero \lambda`, Frobenius Norm $\sum A_{ij}^2 = \sum \lambda_i^2$, `2017_FN_Q44`)** & Complex conjugate pairs.
   - **Syllabus line:** `Eigenvalues and eigenvectors`.
   - **How often GATE asks it:** Very frequently (`Part B.3`: `12` Qs / `20` marks across **9/10 years** = `44%` of Linear Algebra!).
   - **Typical question type:** MCQ/MSQ/NAT (eigenvalues of `A^{13}`, max multiplicity, test eigenvectors of `4×4`, largest `|\lambda|`, symmetric Frobenius bound, defective matrix truths).
   - **Zero-level prerequisite:** Ch 00 + Ch 01 + Ch 02 (`(A - \lambda I)v = 0`).

5. **Chapter 04: LU Decomposition & Matrix Factorizations (`Ch 04`)**
   - **Sub-topics:** Motivation (`O(n^3)` factor once, `O(n^2)` solve per RHS); **Doolittle (`L_{ii} = 1`), Crout (`U_{ii} = 1`), LDU, and Cholesky (`L L^T`)**; **Computing `L` multipliers & `U` (`2022_FN_Q45` — fix `U_{32} -> U_{33}`!)**; **Forward (`LY = Q`) & Backward (`UX = Y`) Substitution (`2025_AN_Q44(A)`)**; Invertibility & Singularity via diagonal of `U` (`2025_AN_Q44(B, C)`); Non-symmetry of `L, U` for symmetric `P` (`2025_AN_Q44(D)`); **When `LU` fails without row permutation `PA = LU` (`0` pivot / zero leading principal minor)**.
   - **Syllabus line:** `LU decomposition`.
   - **How often GATE asks it:** Occasionally (`Part B.3`: `2` Qs / `4` marks across 2/10 years; exact future rate: not sure).
   - **Typical question type:** MSQ/MCQ (`L_{32}, U_{33}, x_1` calculation, properties of `L` and `U` for invertible/singular/symmetric `P`).
   - **Zero-level prerequisite:** Ch 01 + Ch 02 (Gaussian Elimination & Triangular systems).

---

## PART 4. THE DIAGRAMS I NEED

### Ch 00 · Vectors, Geometry & Linear Independence
1. **Vector Arrows, Dot Product Projection & Rhombus Angle Bisector (`2017_FN_Q62`, `2021_AN_Q44`)**
   - *What to draw:* Left: 2-D vector `u = (4, 0)` (`len 4`) and `v = (0, 2)` or angled `v` (`len 2`), scaled to unit vectors `\hat{u}, \hat{v}` forming an equal-sided rhombus whose diagonal `u/2 + v` (`=> u + 2v`) cleanly splits the angle in half (`2017_FN_Q62`)! Right: Orthogonal axes `e_1, e_2, e_3` showing why you can fit at most `n` mutually perpendicular lines in `n`-D space (`2021_AN_Q44`).
   - *What to notice:* Two vectors of unequal length (`||u|| = 2||v||`) pull their sum toward the *longer* one — scaling the shorter one by `2` restores symmetry to bisect the angle!
   - *Format:* **Single picture**
2. **Span vs Dependent Collapse & Strang's 4 Subspaces**
   - *What to draw:* Left: 2 non-parallel arrows tiling the whole 2-D plane (`Independent, dim=2`) vs 2 collinear arrows stuck on 1 line (`Dependent, dim=1`). Right: Strang's 2×2 Subspace map (`Row(A) [dim r]` & `Null(A) [dim m - r]` on left -> `Col(A) [dim r]` & `Null(A^T) [dim n - r]` on right).
   - *What to notice:* `rank(A) + nullity(A) = m` (total columns = dimension of domain!).
   - *Format:* **Single picture**

### Ch 01 · Matrices, Determinants, Rank & Nullity
3. **Matrix-Vector Multiply `Ax` as Column Mixing & Elementary Row Operations Table (`2017_FN_Q18`, `2024_AN_Q57`)**
   - *What to draw:* Left: `A x` drawn as `x_1 [col 1] + x_2 [col 2] + x_3 [col 3]`, highlighting `x_2 · [0; 0; 0]` when `(0, 1, 0)^T` is in `Null(M)` (`2026_FN_Q20`)! Right: Row Ops Impact Table (`Swap R_i <-> R_j`, `Scale k·R_i`, `R_i + c·R_j`) tracking effects on `det`, `rank`, `symmetry`, and `trace` (`2024_AN_Q57`, `2023_FN_Q18`).
   - *What to notice:* A zero vector `(0, 1, 0)^T` in `Null(M)` literally forces Column 2 of `M` to be all zeros (`det = 0`)!
   - *Format:* **Single picture**
4. **The 6-Point Singularity Equivalence Circle & Row-Echelon Reduction Trace (`2017_AN_Q29`)**
   - *What to draw:* Six connected nodes (`det(A) = 0 <-> Singular <-> Rank < n <-> Columns Dependent <-> 0 is Eigenvalue <-> Null(A) != {0}`), paired with REF elimination trace reducing `P + Q` (`2017_AN_Q29`) down to 2 non-zero rows (`rank = 2`).
   - *What to notice:* Every one of those 6 facts implies all the other 5 automatically!
   - *Format:* **Single picture** + **Trace table**

### Ch 02 · Systems of Linear Equations
5. **Geometric 2-Line / 3-Plane Solution Map (`Unique | None | Infinite`) & Rank Decision Flowchart**
   - *What to draw:* Top: Three graphs (`Intersecting -> det != 0`, `Parallel -> det=0 & rank([A|b]) > rank(A)`, `Coincident -> det=0 & rank([A|b]) = rank(A)`, `2025_FN_Q23`, `2026_AN_Q31`). Bottom: Flowchart starting from `Ax = b` vs `Ax = 0` (`Homogeneous NEVER has No Solution!`), branching by `rank(A)` vs `rank([A|b])` vs `m` (`# variables`, `2024_FN_Q52`).
   - *What to notice:* Setting `det(A) = 0` finds BOTH `"None"` and `"Infinite"` candidates — you MUST check `b` (`rank([A|b])`) to tell them apart (`2025_FN_Q23`)!
   - *Format:* **Single picture** + **FLOW**

### Ch 03 · Eigenvalues, Eigenvectors and Diagonalization
6. **Geometric Stretch (`Av = \lambda v`) vs Rotation & Eigenvalue Shortcut Card (`2021_FN_Q15`, `2018_FN_Q27`)**
   - *What to draw:* Left: Grid distorted by matrix `A`: red non-eigenvector spins off its dotted line, green eigenvector stays strictly on its line scaled by `\lambda`. Right: Visual cheat card showing: `sum \lambda_i = tr(A)`, `prod \lambda_i = det(A)`, `Row-sum c -> \lambda = c` (`v = [1..1]^T`, `2021_FN_Q15`), `u v^T -> \lambda = v^T u` (`2018_FN_Q27`), and `f(A) -> f(\lambda)` (`2025_FN_Q41`).
   - *What to notice:* Eigenvalues stay locked under matrix powers `f(A)` while eigenvectors don't even move!
   - *Format:* **Single picture** + **CHEATPIC**
7. **Diagonalizable (`GM = AM`) vs Defective (`GM < AM`, `2018_FN_Q36`) & Symmetric Frobenius Proof (`2017_FN_Q44`)**
   - *What to draw:* Left: Two `2×2` matrices with repeated eigenvalue `\lambda = 2`: `2 I_2` (`2` perpendicular eigenvectors -> Diagonalizable) vs `[[2, 1], [0, 2]]` (ONLY `1` eigenvector line -> Defective/Non-diagonalizable, `2018_FN_Q36`)! Right: Diagonalization `A = Q \Lambda Q^T` showing `||A||_F^2 = \lambda_1^2 + \lambda_2^2 = 50` (`2017_FN_Q44`).
   - *What to notice:* A repeated eigenvalue doesn't guarantee non-diagonalizability (`I_n` is diagonalizable!); ONLY having fewer independent eigenvectors (`GM < AM`) blocks diagonalization!
   - *Format:* **Single picture**

### Ch 04 · LU Decomposition
8. **`A = L U` Multiplier Extraction (`2022_FN_Q45`), `LY=b -> UX=Y` & Zero-Pivot Failure**
   - *What to draw:* Step-by-step elimination frames on `2022_FN_Q45` highlighting how the exact row multipliers (`1, 2, -1/2`) drop straight into `L`, followed by Forward (`LY = Q`, top-down) and Backward (`UX = Y`, bottom-up) substitution arrows (`2025_AN_Q44`), plus a red `÷ 0` explosion on `[[0, 1], [1, 0]]` solved by swapping rows (`PA = LU`).
   - *What to notice:* Subtracting `m × R_j` stores **`+m`** in `L_{ij}` (`-1/2` stays `-1/2`!), and symmetric `P` produces non-symmetric `L` and `U` (`2025_AN_Q44(D)`).
   - *Format:* **Step-by-step series of pictures**

---

## PART 5. THE FULL PLAN, CHAPTER BY CHAPTER

*(Starting with Chapter 00 and Chapter 01 below; continuing from Chapter 02 on next turn!)*

### Chapter 00 · Vectors, Geometry, Linear Independence & Vector Spaces *(New Prerequisite Chapter)*

#### Lesson 00.1 · Vectors, Norms, Dot Products, Linear Independence, Span & Subspaces
- **Tag:** `[MUST]` — Zero-level readers cannot parse `Null(M)`, `s(P, Q) = 0`, `m - n` independent solutions, or angle bisectors without this (`2026_FN_Q20`, `2024_FN_Q52`, `2021_AN_Q44`, `2017_FN_Q18`, `2017_FN_Q62`).
- **Estimated reading time:** 65 minutes.
- **Prerequisites:** High-school 2-D coordinates & Pythagoras theorem.
- **Beginner must-see:** Think of a vector `[3, 4]^T` as an arrow from `(0, 0)` to `(3, 4)`! Its length is $\sqrt{3^2+4^2} = 5$, its **Dot Product (`u · v = \sum u_i v_i`)** tests whether two arrows meet at `90°` (`0` = perpendicular!), and **Linear Independence** asks: *"Are all my arrows pointing in genuinely fresh directions, or is one arrow just a combo of the others?"*
- **Finer points:**
  - Euclidean Norm `||v||`, Unit vectors `\hat{v} = v / ||v||`, **Rhombus Angle Bisector (`\hat{u} + \hat{v}`, `2017_FN_Q62`: `u + 2v`)**.
  - Dot Product (`u · v = ||u|| ||v|| cos \theta`) & **Orthogonality (`u · v = 0 => linearly independent` -> max `n` mutually orthogonal non-zero vectors in $\mathbb{R}^n$, `2021_AN_Q44`: `10`)**!
  - Linear Combination, **Span**, Linear Dependence ($\sum c_i a_i = 0$ with non-zero $c_i$, `2017_FN_Q18`).
  - **Subspaces (3 rules: `0`, `+`, `c·`), Basis, Dimension**, and why **`Null(A)` is a subspace** (`contains c·v for all c`, `2026_FN_Q20(D)`!).
  - **Strang's 4 Fundamental Subspaces** overview (`Col(A), Row(A), Null(A), Null(A^T)`).
- **GATE-level items:** Angle bisector scalar (`2017_FN_Q62`: `2`), max pairwise orthogonal vectors in $\mathbb{R}^{10}$ (`2021_AN_Q44`: `10`), and subspace scaling inside `Null(M)` (`2026_FN_Q20(D)`).
- **Diagrams needed:** `GRAPHPIC` (Rhombus bisector `\hat{u} + \hat{v}`, `2017_FN_Q62`, Orthogonal `R^n` axes, Span plane vs line, and Strang's 4 Subspaces box).
- **Hand traces:** Verifying `u + 2v` has equal dot-product angles with `u` & `v` (`2017_FN_Q62`), proving orthogonal non-zero vectors are linearly independent (`2021_AN_Q44`), and testing subspace rules on `Null(M)`.
- **Common mistakes:** Answering `n - 1` or `n^2` instead of `n` for max orthogonal vectors in $\mathbb{R}^n$ (`2021_AN_Q44`!); thinking `(0,1,0)^T` is the ONLY vector in `Null(M)` (`2026_FN_Q20(D)`!); adding `u + v` directly to bisect angles when `||u|| != ||v||` (`2017_FN_Q62`!).

---

### Chapter 01 · Matrices, Determinants, Rank and Nullity

#### Lesson 01.1 · Matrix Algebra, Powers (`A^k`), Trace, Special Matrices & Outer Products
- **Tag:** `[MUST]` — High-yield 1-mark & 2-mark tricks (`2025_AN_Q11`, `2025_AN_Q14`, `2022_FN_Q20`, `2018_FN_Q27`).
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 00.1.
- **Beginner must-see:** Matrix multiplication `A B` is NOT commutative (`AB != BA`), AND `A x` literally mixes the columns of `A` using the entries of `x` as weights! Always check for algebraic shortcuts BEFORE multiplying big matrices by hand: `A^2 = 5I` turns `A^8` into `625I` in 5 seconds (`2025_AN_Q11`), and `tr(AB) = tr(BA)` ALWAYS holds (`2022_FN_Q20`)!
- **Finer points:**
  - `A x` as linear combination of `A`'s columns (`2026_FN_Q20`, `2017_FN_Q18`); `(AB)^T = B^T A^T`, `(AB)^{-1} = B^{-1} A^{-1}`.
  - **Trace Properties (`2022_FN_Q20`):** `tr(A + B) = tr(A) + tr(B)`, `tr(kA) = k·tr(A)`, **`tr(A_{m×n} B_{n×m}) = tr(B_{n×m} A_{m×n})`**!
  - **Special Matrices:** Identity, Zero, Scalar `cI`, All-Ones `J_n`, Symmetric ($A^T = A$), Skew-Symmetric ($A^T = -A$, diagonal `= 0`), Orthogonal ($A^T A = I$), Idempotent ($A^2 = A$), Involutory ($A^2 = I$), Nilpotent ($A^k = 0$), **Rank-1 Outer Product $u v^T$ (`2018_FN_Q27`)**.
  - **Matrix Power & Inverse Identities (`2025_AN_Q11`, `2025_AN_Q14`):** `L^2 = L^{-1} => L^3 = I`, `A^2 = 5I => A^8 = 5^4 I`.
- **GATE-level items:** Computing $A^8$ (`2025_AN_Q11`: `625I`), `L^8 - L^2` (`2025_AN_Q14`: `det = 0`), trace commutativity (`2022_FN_Q20`: both true), and `u v^T` rank-1 matrix (`2018_FN_Q27`).
- **Diagrams needed:** `MATRIX` (`A x` split into weighted columns + `0_n, I_n, cI_n, J_n` summary + `u v^T` rank-1 grid).
- **Hand traces:** Tracing `2025_AN_Q11` (`A^2 = 5I`), `2025_AN_Q14` (`L^3 = I`), and verifying `tr(AB) = tr(BA)` on `2×3` × `3×2` matrices (`2022_FN_Q20`).
- **Common mistakes:** Thinking `tr(AB) = tr(BA)` fails for non-square $m \times n$ and $n \times m$ matrices (`2022_FN_Q20`!); assuming `AB = 0 => A = 0 or B = 0` (`false` for matrices!); forgetting $(A + B)^2 = A^2 + AB + BA + B^2$.

#### Lesson 01.2 · Determinants, Elementary Row Ops, Rank (`REF`) & Rank-Nullity Theorem
- **Tag:** `[MUST]` — Core foundation tested constantly (`2026_FN_Q20`, `2026_AN_Q62`, `2024_FN_Q13`, `2024_AN_Q57`, `2023_FN_Q18`, `2021_AN_Q61`, `2020_FN_Q58`, `2019_FN_Q23`, `2019_FN_Q45`, `2017_AN_Q29`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 01.1.
- **Beginner must-see:** Every square matrix has one magic number called its **Determinant (`det(A)`)**: if `det(A) = 0`, the matrix squashes space flat (**Singular = NO inverse!** `2019_FN_Q23`), whereas if `det(A) != 0` (**Non-Singular = Invertible!**). And **Rank** counts how many genuinely independent rows/columns survive after **Gaussian Elimination (`REF`)** — every lost column turns into 1 dimension of **Null Space (`Rank + Nullity = # Columns`)**!
- **Finer points:**
  - **10 Determinant Laws:**
    - `det(k A_{n×n}) = k^n det(A)` (`2026_AN_Q62`: `2^4 · 3 = 48`).
    - Row/Col swap flips sign (`2024_AN_Q57(A)`, `2023_FN_Q18`), `R_i <- R_i + c R_j` leaves `det` unchanged!
    - `det(AB) = det(A)det(B)`, **`det(A + B) != det(A) + det(B)` (`2020_FN_Q58(IV)`)**, `det(A^{-1}) = 1/det(A)`, `det(A^T) = det(A)`.
    - Triangular matrix `det = prod(diagonal)`; Dependent / AP rows (`2024_FN_Q13`) or odd-order skew-symmetric -> `det = 0`.
    - **Vandermonde Determinant (`2019_FN_Q45`):** `det = \prod_{i < j} (a_j - a_i)` (`2,3,4,5 -> 12`).
  - **Elementary Row Ops Table (`det` vs `rank` vs `trace` vs `symmetry`, `2024_AN_Q57`).**
  - **Gaussian Elimination (`REF`), Rank & Rank Inequalities (`2017_AN_Q29`, `2020_FN_Q58`):**
    - `rank(A) = # non-zero rows in REF = rank(A^T)`.
    - `rank(A + B) <= rank(A) + rank(B)` (`2020_FN_Q58(III)`), **`rank(AB) <= min(rank(A), rank(B))`** (NOT `rank(A)·rank(B)`! `2020_FN_Q58(I)`).
  - **Rank-Nullity Theorem (`rank(A) + nullity(A) = # cols`, `2026_FN_Q20`, `2021_AN_Q61`)** + **6-Point Singularity Circle**.
- **GATE-level items:** `det(2A)` (`2026_AN_Q62`: `48`), `1`-row-swap `det(B) = -det(A)` (`2023_FN_Q18`, `2024_AN_Q57`), Vandermonde `det` (`2019_FN_Q45`: `12`), AP-row `det = 0` (`2024_FN_Q13`), `rank(P+Q)` (`2017_AN_Q29`: `2`), `rank/det` matrix identities (`2020_FN_Q58`), invertible `det != 0` (`2019_FN_Q23`), and Rank-Nullity (`2021_AN_Q61`: `4`, `2026_FN_Q20`).
- **Diagrams needed:** `CHEATPIC` (10 Determinant Laws + 6-Point Singularity Circle); `COMPARE` (Row Ops Effect Table on `det, rank, symmetry, trace`, `2024_AN_Q57`); `TRACE` (`REF` reduction on `P + Q`, `2017_AN_Q29`).
- **Hand traces:** Computing `2026_AN_Q62` (`48`), `2019_FN_Q45` (`12`), `2017_AN_Q29` (`rank = 2`), `2021_AN_Q61` (`5 - 1 = 4`), and finding explicit counterexamples for `2020_FN_Q58(I, IV)`.
- **Common mistakes:** Writing `det(2A) = 2 · det(A)` instead of `2^n · det(A)` (`2026_AN_Q62`!); thinking swapping two rows preserves zero trace (`2024_AN_Q57(D)`) or symmetry (`C`!); applying `rank(A) + nullity(A) = # rows` instead of **`# columns`** (`2021_AN_Q61`: `4 - 1 = 3` vs `5 - 1 = 4`!).

---

`CONTINUE FROM CHAPTER 02`
## PART 5 (Continued) · Chapters 02, 03, and 04

### Chapter 02 · Systems of Linear Equations

#### Lesson 02.1 · Consistency (`Rouché–Capelli`), Homogeneous `Ax = 0`, Affine Solutions & Solution Counts
- **Tag:** `[MUST]` — High-ROI guaranteed questions (`2026_AN_Q31`, `2025_FN_Q23`, `2024_FN_Q52`, `2019_FN_Q23`, `2017_FN_Q18`).
- **Estimated reading time:** 70 minutes.
- **Prerequisites:** Lesson 00.1, Lesson 01.2 (REF & Rank-Nullity).
- **Beginner must-see:** Solving $Ax = b$ has only THREE geometric outcomes: two lines cross at **1 point (`Unique`)**, run **parallel (`No Solution`)**, or lie **on top of each other (`Infinite Solutions`)**! For $Ax = 0$ (**Homogeneous**), both lines pass through `(0, 0)`, so "No Solution" is **IMPOSSIBLE** — and whenever a system has MORE variables than equations (`m > n`, `2024_FN_Q52`), there are ALWAYS free variables giving infinitely many solutions!
- **Finer points:**
  - **Rouché–Capelli Theorem (`[A | b]` Augmented Matrix):**
    - `rank(A) < rank([A | b])` $\implies$ **Inconsistent (No solution)**.
    - `rank(A) = rank([A | b]) = m` (`# vars`) $\implies$ **Unique solution** (`det != 0` for square `n × n`, `2019_FN_Q23`).
    - `rank(A) = rank([A | b]) < m` $\implies$ **Infinitely many solutions** (`m - r` free variables!).
  - **Two-Step Parameter Method (`2026_AN_Q31`, `2025_FN_Q23`):** Set `det(A) = 0` first to find critical `a, k` values, THEN plug EACH root back in to separate `No Solution` from `Infinite Solutions`!
  - **Homogeneous `Ax = 0` (`2024_FN_Q52`):** Nullity $= m - \text{rank}(A) \ge m - n$ (`at least m - n linearly independent solutions` when $m > n$!).
  - **Affine Solution Space `x = x_p + x_h` & Column-Dependence Consistency (`2017_FN_Q18`):** If columns are dependent AND `b = \sum a_i` (`x = 1` works!), `Ax = b` has infinitely many solutions!
- **GATE-level items:** Parametric infinite/no solution (`2026_AN_Q31`: `ab = 24`, `2025_FN_Q23`: `k=1` none, `k=-1` infinite), `m > n` homogeneous nullity (`2024_FN_Q52`), and `b = \sum a_i` dependent columns (`2017_FN_Q18`).
- **Diagrams needed:** `GRAPHPIC` (Intersecting, Parallel, Coincident lines for `2025_FN_Q23` & `2026_AN_Q31`); `FLOW` (Rouché–Capelli `rank(A) vs rank([A|b]) vs m` Decision Flowchart); `COMPARE` (Tall vs Square vs Wide systems).
- **Hand traces:** Tracing `2026_AN_Q31` (`a = ±4, b = ±6 => ab = 24`), `2025_FN_Q23` (`k = +1` vs `k = -1`), and checking `2024_FN_Q52(B, C, D)` counterexamples (`A = 0`, `A = [1,1,1]`, `A = [1,0,0; 0,1,0]`).
- **Common mistakes:** Stopping after `det(A) = 0` without testing if `b` gives `No Solution` or `Infinite Solutions` (`2025_FN_Q23`, `2026_AN_Q31`); confusing `>= m - n` with `== m - n` in `2024_FN_Q52(B)` (`rank` could be `< n`!); thinking `Ax = b` with dependent columns always has "No solution" (`2017_FN_Q18`!).

---

### Chapter 03 · Eigenvalues, Eigenvectors and Diagonalization *(Highest Marks/Hour in Linear Algebra!)*

#### Lesson 03.1 · Characteristic Equations, Trace/Det Shortcuts, Row-Sum/Rank-1 Tricks & `f(A)` Powers
- **Tag:** `[MUST]` — Accounts for nearly half of all Linear Algebra marks (`2026_FN_Q13`, `2025_FN_Q41`, `2024_FN_Q13`, `2023_FN_Q30`, `2021_FN_Q15`, `2019_FN_Q45`, `2018_FN_Q27`, `2017_AN_Q51`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 01.2 (`det`, `tr`).
- **Beginner must-see:** Normally a matrix rotates AND stretches arrows. For a few special directions (**Eigenvectors `v != 0`**), the matrix ONLY stretches `v` along its own straight line (`Av = \lambda v`) by scale factor **`\lambda` (Eigenvalue)**! Almost every GATE eigenvalue numerical solves in under 20 seconds using 5 golden shortcuts (`sum = trace`, `prod = det`, `constant row-sum`, `rank-1 u v^T`, `eigenvalue of f(A) = f(\lambda)`)!
- **Finer points:**
  - **Characteristic Equation:** $\det(A - \lambda I) = 0$ (`2×2: \lambda^2 - tr·\lambda + det = 0`; `3×3: \lambda^3 - tr·\lambda^2 + (sum principal 2×2 minors)\lambda - det = 0`, **careful with `(-1)^n det` sign in `2017_AN_Q51`!**).
  - **The 6 Speed Shortcuts:**
    1. **Sum = `tr(A)` (`2023_FN_Q30`, `2017_AN_Q51`)**; **Product = `det(A)` (`2024_FN_Q13`: `0`, `2019_FN_Q45`: `12`)**.
    2. **Constant Row-Sum $c$:** `c` is an eigenvalue with eigenvector `[1, 1, ..., 1]^T`!
    3. **Rank-1 Outer Product $u v^T$ (`2018_FN_Q27`):** Non-zero eigenvalue is `v^T u` (`3`), rest `0`!
    4. **`J_n - I_n` Shift (`2021_FN_Q15`):** Eigenvalues of $J_n$ (`n, 0, 0, 0`) shift by `-1` -> `n - 1, -1, -1, -1` (`3`)!
    5. **`f(A)` Polynomial/Power Theorem (`2025_FN_Q41`):** Eigenvalues of $A^k$, $A + cI$, $A^{-1}$ are $\lambda^k$, $\lambda + c$, $1/\lambda$ (`A^{13}` -> `(\pm\sqrt{2})^{13} = \pm 64\sqrt{2}`)!
    6. **Cayley-Hamilton Theorem:** Every matrix satisfies its own characteristic equation (`A^2 - tr·A + det·I = 0`).
  - **Maximum Multiplicity (`2026_FN_Q13`):** Both AM and GM are capped at **`n`** (`I_n` achieves `n`).
  - **Special Matrices Table (`Triangular, Symmetric, Skew-Symmetric, Orthogonal, Idempotent, Involutory, Nilpotent`).**
- **GATE-level items:** `A^{13}` eigenvalues (`2025_FN_Q41`), max multiplicity (`2026_FN_Q13`: `n`), AP-row product `0` (`2024_FN_Q13`), `J_4 - I_4` largest eigenvalue (`2021_FN_Q15`: `3`), `u v^T` eigenvalue (`2018_FN_Q27`: `3`), `3×3` char poly roots (`2017_AN_Q51`: `5`), and adjacency trace (`2023_FN_Q30`).
- **Diagrams needed:** `GRAPHPIC` (Geometric `Av = \lambda v` stretch vs non-eigenvector rotation); `CHEATPIC` (6 Eigenvalue Shortcuts + 7 Special Matrices Table).
- **Hand traces:** Solving `2025_FN_Q41` (`\lambda = ±\sqrt{2} -> ±64\sqrt{2}`), `2021_FN_Q15` (`3`), `2018_FN_Q27` (`3`), and `2017_AN_Q51` (`tr=4, det=-30 -> {2, 5, -3} -> max abs = 5`).
- **Common mistakes:** Reading `+30` as `+det(M)` instead of `-det(M)` in odd-degree $\lambda^3 - 4\lambda^2 + a\lambda + 30$ (`2017_AN_Q51`!); confusing largest eigenvalue with largest absolute value; forgetting `0` CAN be an eigenvalue (when `det = 0`, `2024_FN_Q13`).

#### Lesson 03.2 · Eigenvectors, Multiplicity (`AM` vs `GM`), Diagonalizability & Symmetric Matrices (`||A||_F^2`)
- **Tag:** `[MUST]` — Covers high-impact MSQs/MCQs (`2022_FN_Q53`, `2018_FN_Q36`, `2017_FN_Q44`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 02.1, Lesson 03.1.
- **Beginner must-see:** Not every $n \times n$ matrix has $n$ independent eigenvector directions! When an eigenvalue repeats (**Algebraic Multiplicity `AM > 1`**), it might fall short on actual eigenvector directions (**Geometric Multiplicity `GM < AM`**), making the matrix **Non-Diagonalizable / Defective (`2018_FN_Q36`)**! Real **Symmetric** matrices NEVER fail — their eigenvectors are always real, full-rank, and perpendicular!
- **Finer points:**
  - **Finding & Testing Eigenvectors (`2022_FN_Q53`):** Solve `(A - \lambda I) v = 0`, OR in MSQs/MCQs directly compute `A v` and check `A v == \lambda v` row by row (`2022_FN_Q53`: `A, C, D`!).
  - **Algebraic vs Geometric Multiplicity (`1 <= GM <= AM`) & Diagonalizability (`2018_FN_Q36`):**
    - `A` is diagonalizable (`A = P D P^{-1}`) $\iff$ sum of `GM`s $= n$ ($\iff$ `GM = AM` for every eigenvalue!).
    - Distinct eigenvalues $\implies$ always diagonalizable; only 1 eigenspace in $2 \times 2$ (`2018_FN_Q36`) $\implies$ repeated eigenvalue AND not diagonalizable (still can be invertible!).
  - **Real Symmetric Matrices (`2017_FN_Q44`):**
    - Always real eigenvalues, orthogonal eigenvectors for distinct $\lambda$, orthogonally diagonalizable ($A = Q \Lambda Q^T$), **`rank(A) = # non-zero eigenvalues`** (unlike nilpotent!).
    - **Frobenius Norm Identity (`2017_FN_Q44`):** $\sum_{i,j} A_{ij}^2 = \text{tr}(A^T A) = \text{tr}(A^2) = \sum_{i=1}^n \lambda_i^2$ (`\lambda_1^2 + \lambda_2^2 = 50 => min |\lambda| <= 5`)!
- **GATE-level items:** Testing `4×4` eigenvectors (`2022_FN_Q53`: `A, C, D`), defective single-eigenspace properties (`2018_FN_Q36`: II & III), and rank-2 real symmetric Frobenius bound (`2017_FN_Q44`: I only).
- **Diagrams needed:** `COMPARE` (Diagonalizable `2 I_2` with full 2-D eigenbasis vs Defective `[[2,1],[0,2]]` with 1 eigenvector line, `2018_FN_Q36`); `TRACE` (Row-by-row `Mv == \lambda v` verification table for `2022_FN_Q53`).
- **Hand traces:** Verifying `A, B, C, D` of `2022_FN_Q53` (`1·v`, fail, `3·v`, `3·v`); proving `\lambda_1^2 + \lambda_2^2 = 50` forces `[-5, 5]` membership while `diag(5, 5, 0...)` breaks `> 5` (`2017_FN_Q44`).
- **Common mistakes:** Answering `diag(A)` check fails `I` in `2017_FN_Q44`, or thinking $\lambda_1^2 + \lambda_2^2 = 50$ forces one root strictly `> 5` (`5^2 + 5^2 = 50`!); thinking non-diagonalizable implies `det = 0` (`2018_FN_Q36(I)`!); solving a $4\times 4$ characteristic polynomial by hand in `2022_FN_Q53` instead of multiplying `M v`!

---

### Chapter 04 · LU Decomposition and Matrix Factorizations

#### Lesson 04.1 · Doolittle / Crout / Cholesky `A = LU`, `PA = LU` & Solving `AX = B`
- **Tag:** `[SHOULD]` — Dedicated syllabus line, light bank count (`2` Qs / `4` marks: `2025_AN_Q44`, `2022_FN_Q45`), fast 1-hour mastery.
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 02.1 (Gaussian Elimination).
- **Beginner must-see:** If you have to solve `Ax = b_1`, `Ax = b_2`, ..., `Ax = b_{100}` with the SAME `A` and 100 changing right-hand sides, running full $O(n^3)$ Gaussian elimination 100 times wastes effort! **LU Decomposition** splits `A = L U` (Lower triangular `L` × Upper triangular `U`) ONCE in $O(n^3)$, then solves ANY new right-hand side `Q` via two super-fast $O(n^2)$ triangular steps: **`L Y = Q` (Forward)** then **`U X = Y` (Backward)** (`2025_AN_Q44`)!
- **Finer points:**
  - **Doolittle (`L_{ii} = 1`, standard in GATE `2025_AN_Q44`, `2022_FN_Q45`) vs Crout (`U_{ii} = 1`) vs `LDU` vs Cholesky (`A = L L^T` for SPD matrices).**
  - **Building `L` & `U` Directly from Elimination Multipliers (`2022_FN_Q45`):** When row operation does `R_i <- R_i - m R_j`, record **`+m`** inside `L_{ij}` (`negative multiplier stays negative!`) and final echelon matrix becomes `U`!
  - **Two-Step Solve (`LY = Q`, `UX = Y`, `2025_AN_Q44(A)`):** Top-down for `Y`, bottom-up for `X` (`2022_FN_Q45`: `x_1 = 0`).
  - **Properties (`2025_AN_Q44`):**
    - `P` invertible $\iff$ BOTH `L` and `U` invertible (`B` true).
    - `P` singular $\iff$ at least one $u_{ii} = 0$ (when `L_{ii} = 1`, `C` true).
    - `P` symmetric does **NOT** make `L` and `U` symmetric (`D` false!).
  - **Existence (`PA = LU`):** `A = LU` without row permutation `P` exists iff all leading principal submatrices are non-singular (`0` pivot needs row swap `PA = LU`).
- **GATE-level items:** Solving `3×3` system via Doolittle `LU` (`2022_FN_Q45`: `L_{32} = -1/2, U_{33} = -1/2, x_1 = 0` — note `U_{32}` stem typo!) and properties of `P = LU` (`2025_AN_Q44`: `A, B, C`).
- **Diagrams needed:** `FRAMES` (Gaussian elimination saving multipliers into `L` and echelon matrix into `U`, `2022_FN_Q45`); `FLOW` (`LY = Q` top-down -> `UX = Y` bottom-up, `2025_AN_Q44`) + zero-pivot `PA = LU` fix.
- **Hand traces:** Full Doolittle trace of `2022_FN_Q45` (`L, U, Y, X`) and checking `[[2,1],[1,2]] = LU` (`2025_AN_Q44(D)` counterexample).
- **Common mistakes:** Flipping the sign of elimination multiplier `m` when writing `L_{ij}` (`+1/2` instead of `-1/2` in `2022_FN_Q45`!); thinking symmetric `P` makes `L` and `U` symmetric (`2025_AN_Q44(D)`!); forgetting `LU` fails on `[[0,1],[1,0]]` without `P`.

---

`CONTINUE FROM PART 6`
## PART 6. EVERY PYQ LISTED BELOW (All 30 Questions Re-Solved)

*(Note: 1 missing figure `[IMAGE_Q_30_1]` in `2023_FN_Q30`, 1 stem typo `U_{32} -> U_{33}` in `2022_FN_Q45`, and 1 minor dimension/text note in `2025_AN_Q44`.)*

| # | PYQ ID | (a) Ch / Lesson | (b) Exact Concept Tested | (c) Trap / Finer Point | (d) Official Key Check & Working | (e) Transcription Check |
|---|---|---|---|---|---|---|
| 1 | `2026_FN_Q13` | Ch 03 / L03.1 | Maximum multiplicity of an eigenvalue of an $n \times n$ real matrix ($n > 1$). | Identity matrix $I_n$ has single eigenvalue `1` with multiplicity `n` (`A`). | **CORRECT (A: `n`).** | Clean. |
| 2 | `2026_FN_Q20` | Ch 00, 01 / L00.1, L01.2 | Implications of non-zero basis vector `(0, 1, 0, ..., 0)^T` lying in `Null(M)`. | Non-zero vector in `Null(M)` forces `det(M) = 0` (`B`); `Null(M)` is closed under scaling so `c·v` gives infinitely many ($\ge 2$) non-zero null vectors (`D`); rank could be `n - 1` (`C` false). | **CORRECT (B, D).** | Clean. |
| 3 | `2026_AN_Q31` | Ch 02 / L02.1 | Finding `a · b` when `ax + y = b; 16x + ay = 24` has **multiple** (infinite) solutions. | `a/16 = 1/a = b/24` -> `a = 4, b = 6` OR `a = -4, b = -6`; in BOTH cases `a · b = 24`! | **CORRECT (24).** | Clean. |
| 4 | `2026_AN_Q62` | Ch 01 / L01.2 | Computing `det(2A)` for $4 \times 4$ matrix `A` with `det(A) = 3`. | `det(k A_{n×n}) = k^n det(A)` -> `2^4 × 3 = 16 × 3 = 48` (NOT `2 × 3 = 6`!). | **CORRECT (48).** | Clean. |
| 5 | `2025_AN_Q11` | Ch 01, 03 / L01.1, L03.1 | Computing $A^8$ for `2×2` symmetric matrix `[[1, 2], [2, -1]]`. | Compute $A^2 = 5 I_2$ first! Then $A^8 = (5 I_2)^4 = 625 I_2$ (`C`). | **CORRECT (C: `625 I_2`).** | Clean. |
| 6 | `2025_AN_Q14` | Ch 01 / L01.1 | Computing `det(L^8 - L^2)` given non-singular `L^2 = L^{-1}`. | Multiply by `L`: $L^3 = I \implies L^8 = (L^3)^2 L^2 = L^2 \implies M - N = 0 \implies \det = 0$ (`A`). | **CORRECT (A: 0).** | Clean. |
| 7 | `2025_FN_Q23` | Ch 02 / L02.1 | Counting values of `k` giving No Solution (`A`) vs Infinite Solutions (`D`) for `x+ky=1; kx+y=-1`. | `det = 1 - k^2 = 0 => k = ±1`: `k = +1` gives parallel lines (no sol, 1 value -> `A`), `k = -1` gives identical lines (infinitely many sols, 1 value -> `D`)! | **CORRECT (A, D).** | Clean. |
| 8 | `2025_FN_Q41` | Ch 03 / L03.1 | Eigenvalues of $A^{13}$ for `A = [[1, 1], [1, -1]]`. | $\lambda^2 - 0\lambda - 2 = 0 \implies \lambda = \pm \sqrt{2}$. Raising to 13th power gives $(\pm \sqrt{2})^{13} = \pm 64\sqrt{2}$ (`D`). | **CORRECT (D).** | Clean. |
| 9 | `2025_AN_Q44` | Ch 04 / L04.1 | Properties of Doolittle `P = LU` decomposition (`PX = Q`). | Forward/back solve (`A` true); `P` invertible => `det(P)=det(L)det(U) != 0` (`B` true); `P` singular => `det(U)=0` (`C` true); symmetric `P` does NOT make `L, U` symmetric (`D` false!). | **CORRECT (A, B, C).** | Minor typo: `Q \in \mathbb{R}^{3×3}` (usually `3×1`, though `LY=Q, UX=Y` holds either way!). |
| 10 | `2024_FN_Q13` | Ch 01, 03 / L01.2, L03.1 | Product of eigenvalues of `3×3` matrix `[1 2 3; 4 5 6; 7 8 9]`. | Rows form Arithmetic Progression (`R1 + R3 = 2 R2`) -> linearly dependent -> `det = \prod \lambda_i = 0` (`B`)! | **CORRECT (B: 0).** | Clean. |
| 11 | `2024_AN_Q57` | Ch 01 / L01.2 | Effect of swapping two rows (`A -> B`) on `det`, invertibility, symmetry & trace. | Row swap multiplies `det` by `-1` (`A`), preserving non-zero `det` (`B`), yet can destroy symmetry (`C` false) and change diagonal trace (`D` false)! | **CORRECT (A, B).** | Clean. |
| 12 | `2024_FN_Q52` | Ch 01, 02 / L01.2, L02.1 | Homogeneous `Ax = 0` solutions for underdetermined `n × m` ($m > n$) matrix. | `nullity(A) = m - rank(A) >= m - n` (`A` true!). `B` fails if `rank < n`; `C, D` fail for `A=[1,1,1]` / `[1,0,0; 0,1,0]`. | **CORRECT (A).** | Clean. |
| 13 | `2023_FN_Q18` | Ch 01 / L01.2 | Determinant relation after 1 row swap (`R1 <-> R3`) between `4×4` matrices `A` and `B`. | `B` swaps Row 1 and Row 3 of `A` (`1` swap) -> `det(B) = -det(A)` (`B`). | **CORRECT (B).** | Minor typo `"Let and A = ..."`. |
| 14 | `2023_FN_Q30` | Ch 03 / L03.1 | Sum of eigenvalues (`tr(A)`) of a 5-vertex graph's adjacency matrix. | Sum of eigenvalues = `tr(A)` = count/weight of diagonal self-loops in `[IMAGE_Q_30_1]`. Dual key `2 OR 4` reflects undirected self-loop weight convention (`1` vs `2` per loop). | **CANNOT VERIFY** (Key: 2 OR 4). Graph `[IMAGE_Q_30_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_30_1]`). |
| 15 | `2022_FN_Q20` | Ch 01 / L01.1 | Trace commutativity `tr(AB) = tr(BA)` for rectangular and square matrices. | Both `tr(A_{m×n} B_{n×m}) = tr(B_{n×m} A_{m×n})` and `tr(C_{n×n} D_{n×n}) = tr(DC)` always hold (`C`). | **CORRECT (C: Both correct).** | Clean. |
| 16 | `2022_FN_Q45` | Ch 04 / L04.1 | Doolittle `LU` decomposition & solving `3×3` system (`L_{32}, U_{33}, x_1`). | Eliminating `A` gives `U_1 = [1, 1, -2]`, `L_{21}=1, L_{31}=2`, `R2'=[0, 2, 1]`, `R3'=[0, -1, -1]` -> `L_{32} = -1/2`, `U_{33} = -1/2`! Forward `LY=b` (`Y=[4, 3, 0.5]^T`), backward `UX=Y` (`x_3=-1, x_2=2, x_1=0`) (`D`)! | **CORRECT (D)** once `U_{32}` typo is read as `U_{33}`. | **MIS-TRANSCRIPTION:** Stem asks `"L_{32}, U_{32}, and x_1"` & Option B prints `U_{32}`; must be **`U_{33}`**! |
| 17 | `2022_FN_Q53` | Ch 03 / L03.2 | Identifying eigenvectors of a `4×4` matrix. | Multiply `M v` directly instead of solving `4×4` char poly! `A`: `1·v` (yes); `B`: `(-7,-5,12,25)^T` (no); `C`: `3·v` (yes); `D`: `3·v` (yes). | **CORRECT (A, C, D).** | Clean. |
| 18 | `2021_AN_Q61` | Ch 01 / L01.2 | Finding `rank(P)` of `4×5` matrix via Rank-Nullity (`Null(P)` = span of 1 vector). | `nullity(P) = 1`, `# columns = 5` -> `rank(P) = 5 - 1 = 4` (not `4 - 1 = 3`!). | **CORRECT (4).** | Clean. |
| 19 | `2021_AN_Q44` | Ch 00 / L00.1 | Maximum cardinality of pairwise orthogonal non-zero vectors in $\mathbb{R}^{10}$. | Orthogonal non-zero vectors are linearly independent, capped by dimension `n = 10` (`B`). | **CORRECT (B: 10).** | Clean. |
| 20 | `2021_FN_Q15` | Ch 03 / L03.1 | Largest eigenvalue of `4×4` matrix `J_4 - I_4` (`0` diagonal, `1` off-diagonal). | Constant row sum = `3` gives eigenvalue `3` (`others: -1, -1, -1`) -> largest = `3`. | **CORRECT (3).** | Clean. |
| 21 | `2020_FN_Q58` | Ch 01 / L01.2 | Valid rank and determinant identities for `n×n` real matrices. | `II` (`det(AB)=det(A)det(B)`) & `III` (`rank(A+B) <= rank(A)+rank(B)`) are TRUE; `I` & `IV` fail on `I_2`! | **CORRECT (C: II and III only).** | Clean. |
| 22 | `2019_FN_Q23` | Ch 01, 02 / L01.2, L02.1 | Equivalence between `X` invertible and `det(X) != 0`. | Fundamental theorem for square matrices (`D`). | **CORRECT (D).** | Clean. |
| 23 | `2019_FN_Q45` | Ch 01, 03 / L01.2, L03.1 | Absolute product of eigenvalues (`|det(R)|`) of `4×4` Vandermonde matrix `(2, 3, 4, 5)`. | `\prod \lambda_i = det(R) = (3-2)(4-2)(5-2)(4-3)(5-3)(5-4) = 1×2×3×1×2×1 = 12`! | **CORRECT (12).** | Clean. |
| 24 | `2018_FN_Q27` | Ch 01, 03 / L01.1, L03.1 | Largest eigenvalue of rank-1 outer product `u v^T` (`u=[1,2]^T, v=[1,1]^T`). | Eigenvalues of `u v^T` are `v^T u = 1(1) + 2(1) = 3` and `0` -> largest = `3`. | **CORRECT (3).** | Clean. |
| 25 | `2018_FN_Q36` | Ch 03 / L03.2 | Properties of `2×2` matrix `P` having ONLY 1-D eigenspace `span([1, 4]^T)`. | Only 1 eigenspace forces repeated eigenvalue (`II` true) and `GM=1 < 2` so non-diagonalizable (`III` true), yet `P` CAN be invertible (`[[2,0],[4,2]]`? Wait: `det = 4 != 0`, `I` false!). | **CORRECT (D: Only II and III).** | Clean. |
| 26 | `2017_FN_Q18` | Ch 00, 02 / L00.1, L02.1 | Solution count of `Ax = b` when columns are dependent and `b = \sum a_i`. | `x = [1, 1, ..., 1]^T` solves `Ax = b` (consistent!), and dependent columns give non-trivial `Null(A)` -> infinitely many solutions (`C`)! | **CORRECT (C).** | Clean. |
| 27 | `2017_AN_Q29` | Ch 01 / L01.2 | Computing `rank(P + Q)` for two `3×3` matrices. | `P + Q = [[0,-1,-2],[8,9,10],[8,8,8]]`: `R1 + R2 = R3` (`dependent`), while `R1, R2` are independent -> `rank = 2`! | **CORRECT (2.0).** | Clean. |
| 28 | `2017_FN_Q62` | Ch 00 / L00.1 | Angle bisector `w = u + \alpha v` when `||u|| = 2||v||`. | Bisector aligns with `\hat{u} + \hat{v} = u/||u|| + v/||v||`: multiplying by `||u||` gives `u + 2v` -> `\alpha = 2` (`A`). | **CORRECT (A: 2).** | Clean. |
| 29 | `2017_FN_Q44` | Ch 03 / L03.2 | Eigenvalues of rank-2 real symmetric `A` with Frobenius norm `\sum A_{ij}^2 = 50`. | `\lambda_1^2 + \lambda_2^2 = 50`: cannot have both `|\lambda_1| > 5` and `|\lambda_2| > 5`, so at least one is in `[-5, 5]` (`I` true!); `diag(5, 5, 0..)` has max magnitude `5`, NOT strictly `> 5` (`II` false!). | **CORRECT (B: I only).** | Clean. |
| 30 | `2017_AN_Q51` | Ch 03 / L03.1 | Max `|\lambda_i|` given `\lambda^3 - 4\lambda^2 + a\lambda + 30` and `\lambda_1 = 2`. | Sum = `4`, Product = **`-30`** (`(-1)^3 × 30`!): `\lambda_2 + \lambda_3 = 2`, `\lambda_2 \lambda_3 = -15 => {5, -3}` -> max abs = `5`! | **CORRECT (5.0).** | Clean. |

---

## PART 7. MORE QUESTIONS NEEDED (3 New Ideas Per Lesson)

### Chapter 00 · Vectors, Geometry, Linear Independence & Vector Spaces
- **Lesson 00.1 (`Vectors, Norms, Dot Products, LI & Subspaces`):**
  1. Find the orthogonal projection of vector `u = (4, 3, 0)^T` onto `v = (1, 0, 1)^T` (`MCQ`).
  2. Determine for which value of `k` the vectors `(1, 2, 3)^T`, `(2, k, 6)^T`, and `(0, 1, 1)^T` are linearly dependent (`NAT`).
  3. Which subsets of $\mathbb{R}^3$ (`{(x,y,z) : x+2y-z = 0}`, `{(x,y,z) : x+y = 1}`, `{(x,y,z) : x^2+y^2 = 0}`, `{(x,y,z) : x >= 0}`) form valid vector subspaces (`MSQ`)?

### Chapter 01 · Matrices, Determinants, Rank and Nullity
- **Lesson 01.1 (`Matrix Algebra, Powers, Trace & Special Matrices`):**
  1. Given $A = [[1, 1], [0, 1]]$, compute the `(1, 2)` entry of $A^{50}$ (`NAT`).
  2. For a `5 × 5` skew-symmetric matrix `B`, find `tr(B)` and `det(B)` (`MSQ`).
  3. If `A` is an idempotent matrix (`A^2 = A`), prove `(I - A)^2 = I - A` and find possible values of `det(A)` (`MSQ`).
- **Lesson 01.2 (`Determinants, Row Ops, Rank & Rank-Nullity`):**
  1. Matrix `A` is `3 × 3` with `det(A) = 4`: find `det(3 · A^{-1} · adj(A))` (`NAT`).
  2. Given a `4 × 6` matrix `M` whose column space has dimension `3`, find the dimension of its Null Space `Null(M)` and left null space `Null(M^T)` (`MSQ`).
  3. Find the rank of matrix `[[1, 2, 3, 4], [2, 4, 6, 8], [1, 1, 1, 1], [3, 5, 7, 9]]` (`NAT`).

### Chapter 02 · Systems of Linear Equations
- **Lesson 02.1 (`Rouché–Capelli, Homogeneous & Non-Homogeneous Systems`):**
  1. Find values of `(a, b)` for which `x + y + z = 3; 2x + y - z = 1; 3x + 2y + az = b` has NO solution vs INFINITELY many solutions (`MSQ`).
  2. Suppose `x_1 = [1, 2, 0]^T` and `x_2 = [3, 0, 4]^T` both solve `Ax = b` (`b != 0`): find a non-zero vector in `Null(A)` and another valid solution `x_3` (`MCQ`).
  3. For a `5 × 3` matrix `A` with `rank(A) = 3`, which statements about `Ax = b` and `Ax = 0` are true (`MSQ`)?

### Chapter 03 · Eigenvalues, Eigenvectors and Diagonalization
- **Lesson 03.1 (`Characteristic Eq, Shortcuts, f(A) & Cayley-Hamilton`):**
  1. Given $A = [[2, 1], [1, 2]]$, use Cayley-Hamilton to express $A^{-1}$ as $c_1 A + c_2 I$ (`MCQ`).
  2. Find the product of eigenvalues of the `3 × 3` matrix `A = [[1, 2, 0], [0, 3, 4], [0, 0, 5]] + 2 I_3` (`NAT`).
  3. For a `4 × 4` orthogonal matrix `Q` (`Q^T Q = I_4`) with `det(Q) = -1`, which statements about its eigenvalues MUST hold (`MSQ`)?
- **Lesson 03.2 (`Eigenvectors, AM/GM, Diagonalizability & Symmetric Matrices`):**
  1. Determine the geometric multiplicity of eigenvalue $\lambda = 2$ for $A = [[2, 1, 0], [0, 2, 0], [0, 0, 2]]$, and whether $A$ is diagonalizable (`MSQ`).
  2. A `3 × 3` real symmetric matrix has eigenvalues `1, 2, -2` and eigenvectors `[1, 1, 0]^T` (for `1`) and `[1, -1, 1]^T` (for `2`): find an eigenvector for `-2` using orthogonality (`MCQ`).
  3. Compute the Frobenius sum $\sum_{i,j} A_{ij}^2$ of a `4 × 4` real symmetric matrix whose eigenvalues are `{3, -1, 2, 0}` (`NAT`).

### Chapter 04 · LU Decomposition and Matrix Factorizations
- **Lesson 04.1 (`Doolittle, Crout, Cholesky & PA = LU`):**
  1. Perform Doolittle `LU` on `A = [[2, 4, 2], [4, 9, 7], [-2, -2, 5]]` and find `U_{33}` and `L_{32}` (`NAT`).
  2. Show why `A = [[0, 2], [3, 4]]` fails `A = LU` yet succeeds with `P A = L U` (`MCQ`).
  3. Given `L = [[1,0],[2,1]]` and `U = [[3,1],[0,4]]`, solve `LUx = [3, 14]^T` using forward then backward substitution (`NAT`).

---

## PART 8. WHAT IS MISSING FROM THE SUBJECT

Because `Part B.2` lists **"none | not written"** for ALL 4 chapters and completely omits Vectors, Subspaces, and Rank-Nullity, here is everything missing from `Part B.2` against the GATE CS syllabus (`Part B.1`) and `Part C` (30 PYQs):

1. **Chapter 00 (`Vectors, Dot Product, Linear Independence, Basis & Subspaces`):** Norms, Angles, **Bisector (`2017_FN_Q62`)**, **Max Orthogonal Set (`2021_AN_Q44`)**, Subspaces (`Null(A)` closure, `2026_FN_Q20(D)`), Linear Dependence (`2017_FN_Q18`), and Strang's 4 Subspaces.
2. **Matrices, Determinants & Rank Depth (`Ch 01`):** `Ax` as column mixing, **Matrix Powers `A^2 = 5I` (`2025_AN_Q11`), `L^3 = I` (`2025_AN_Q14`)**, **Trace `tr(AB) = tr(BA)` (`2022_FN_Q20`)**, Special matrices (`Symmetric, Skew-Symmetric [odd det=0], Orthogonal, Idempotent, Nilpotent`), **Outer product `u v^T` (`2018_FN_Q27`)**, **`det(kA) = k^n det(A)` (`2026_AN_Q62`)**, Row swap `det` / `rank` / `trace` / `symmetry` rules (`2024_AN_Q57`, `2023_FN_Q18`), **Vandermonde determinant (`2019_FN_Q45`)**, **REF Rank & Rank Inequalities (`2020_FN_Q58`, `2017_AN_Q29`)**, and **Rank-Nullity (`2021_AN_Q61`, `2026_FN_Q20`)**.
3. **Systems of Linear Equations Depth (`Ch 02`):** Geometric lines/planes, **Rouché–Capelli Rank Criterion**, Parametric no/infinite solutions (`2026_AN_Q31`, `2025_FN_Q23`), **Underdetermined `Ax = 0` nullity $\ge m - n$ (`2024_FN_Q52`)**, Affine solution space (`x_p + Null(A)`), and dependent-column consistency (`2017_FN_Q18`).
4. **Eigenvalues & Diagonalization Depth (`Ch 03`):** Geometric stretch, `2×2` & `3×3` Characteristic Polynomial (`(-1)^n det` sign, `2017_AN_Q51`), **6 Shortcuts (`sum=tr`, `prod=det`, `row-sum`, `u v^T`, `J_n - I_n`, `f(A)` `2025_FN_Q41`, `2021_FN_Q15`)**, Cayley-Hamilton, Fast `Mv == \lambda v` verification (`2022_FN_Q53`), **AM vs GM, Max Multiplicity (`2026_FN_Q13`) & Defective Matrices (`2018_FN_Q36`)**, and **Real Symmetric Frobenius Norm $\sum A_{ij}^2 = \sum \lambda_i^2$ (`2017_FN_Q44`)**.
5. **LU Decomposition Depth (`Ch 04`) & PYQ Fixes:** Doolittle vs Crout vs Cholesky, elimination multiplier sign (`+m`), `LY = Q -> UX = Y` (`2025_AN_Q44`), `PA = LU` zero-pivot swaps, and fixing **`2022_FN_Q45` (`U_{32} -> U_{33}`)** + restoring **`2023_FN_Q30` (`[IMAGE_Q_30_1]`)**!

---

## PART 9. WEIGHTS

### Chapter Weight Tags & Comparison with the Bank (`Part B.3`)

| Chapter | Proposed Weight Tag | Bank Stats (2017–2026, 15 CS Papers) | Does the Bank Weight Look Fair? |
|---|---|---|---|
| **Ch 00 · Vectors, Geometry, LI & Subspaces** *(New)* | **Foundation** (Mandatory 65-min bridge before Ch 01) | Embedded in `2026_FN_Q20`, `2024_FN_Q52`, `2021_AN_Q44`, `2017_FN_Q18`, `2017_FN_Q62` | **Under-isolated in bank.** Adding Ch 00 unlocks null spaces, orthogonal sets, and vector bisectors cleanly. |
| **Ch 01 · Matrices, Determinants, Rank & Nullity** | **Very High** | Merged with Ch 02 (`16` Qs / `21` marks across 9/10 yrs — `5` Easy!) | **Fair (split Ch 01 & Ch 02 for clarity).** Easy/Medium matrix powers, `det(kA)`, row swaps, and rank-nullity yield rapid points. |
| **Ch 02 · Systems of Linear Equations** | **High** | Shared inside `16` Qs / `21` marks bucket | **Fair (once separated from Ch 01).** `Rouché–Capelli` & `Ax=0` nullity appear steadily across papers. |
| **Ch 03 · Eigenvalues, Eigenvectors & Diagonalization** | **Very High** (#1 Value in LA!) | 12 Qs / 20 marks (`1.33%`; asked **9/10 yrs** — `8` Med, `2` Hard!) | **Fair — `44%` of ALL Linear Algebra marks!** Mastering the 6 shortcuts (`tr`, `det`, `row-sum`, `f(A)`, `Mv=\lambda v`, `Frobenius`) delivers massive ROI per hour! |
| **Ch 04 · LU Decomposition & Factorizations** | **Low** (Quick 60-min read!) | 2 Qs / 4 marks (`0.27%`; asked in only **2/10 yrs**) | **Fair.** Lightest topic in Linear Algebra (`4` marks across 15 papers); keep to 1 crisp 60-min lesson (`Doolittle L/U`, `LY=Q`, `UX=Y`, `PA=LU`). |

### Overall Assessment of Bank Distribution (`3.0%` = ~3.0 marks/paper)
- Linear Algebra is compact (`45` marks across 15 papers) and **remarkably friendly (`7 Easy, 19 Medium, only 4 Hard` out of 30 Qs = `87%` Easy/Medium!)**.
- Notice the huge concentration: **Eigenvalues/Eigenvectors (`Ch 03`: 20 marks) + Matrices/Determinants/Linear Systems (`Ch 01 + Ch 02`: 21 marks) = `91%` of ALL Linear Algebra marks**, while `LU` is just `9%`!
- For a 100-day dropper: **2–3 focused days** on Ch 00 -> Ch 01 -> Ch 02 -> Ch 03 -> Ch 04 secures nearly all ~3 marks per paper reliably. (Beyond the 2017–2026 bank provided, exact future paper weights: **not sure**.)