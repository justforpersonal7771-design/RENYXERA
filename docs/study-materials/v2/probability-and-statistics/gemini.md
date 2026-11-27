## PART 1. FEELINGS

1. Looking at `Part B` felt alarming right away: every chapter says **`"none | not written"`**, so there isn't even a topic outline yet — and **Mean, Median, Mode, and Standard Deviation sit at Chapter 04**, AFTER Random Variables and Distributions!
2. How am I supposed to understand a Normal distribution's $\mu, \sigma$ or an Exponential distribution's `1/\lambda` in Chapter 03 BEFORE learning what Mean and Standard Deviation even are?!
3. Then I opened `Part C` and got hit by **integrals ($\int_1^4 Cx^2 dx$)**, **discriminant intervals**, **PGFs $g_Y(z) = (1-\beta+\beta z)^N$**, **Cauchy-Schwarz covariance (`Cov^2 <= Var·Var`)**, and **Gaussian `max(X, 0)` median** — with zero calculus or algebra warm-up!
4. Notice how `Part B.3` has **ZERO Easy questions in Conditional Probability & Bayes (`0/10/1`)** and **`6` Hard questions in Random Variables** — this 51-mark mini-subject has some of the trickiest conceptual traps in GATE!
5. Also, `Part B.2` completely skips **Geometric Distribution** (tested in `2018_FN_Q25`), **Total Probability & Polya's Urn symmetry (`2026_FN_Q11`, `2021_AN_Q40`)**, **Covariance/Correlation**, and **Basic Integration for Continuous PDFs**!
6. On the bright side, unlike TOC, Digital Logic, or Compiler Design, **all 31 PYQ keys here check out clean** (only 1 missing diagram `[IMAGE_Q_57_1]` in `2021_FN_Q57`!).
7. Still, `Probability` is only 3.4% of GATE (`~3.4` marks/paper), and without `[MUST]` vs `[LATER]` priority tags or visual tree/area pictures, a 100-day dropper gets stuck on hard integrals and loses easy marks.
8. **Would I pay ₹149 for this right now? NO.**
9. Why? Nothing is written in `Part B.2`, Chapter 04 (`Mean, Median, Mode, SD`) is sitting behind Chapters 02–03 (`WRONG-ORDER`), and there is zero Chapter 00 refreshing counting & basic integration.
10. Add Chapter 00 (set probability + basic definite integrals), move Mean/SD concepts BEFORE Distributions (`Ch 03/04`), draw Venn/Probability-Tree/Area-under-Curve visuals for every topic — then I will happily pay ₹149.

---

## PART 2. GAP TABLE

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 1 | `Part B.2` (Chapter 04 placement) | Puts **`04 Mean, median, mode and standard deviation`** LAST, *after* `02 Random variables` and `03 Distributions`! You can't understand `N(\mu, \sigma^2)`, `Exp(\lambda)` mean `1/\lambda`, or `Bin(n,p)` std dev (`2021_AN_Q15`) before learning Mean & Standard Deviation! | WRONG-ORDER | Teach **Expectation, Variance & Mean/Median/Mode/SD** BEFORE (or right at the start of) Standard Distributions! | HIGH |
| 2 | `Part B.2` (Missing Ch 00) | Jumps straight into conditional probability & continuous PDFs without refreshing **Sample Spaces, Combinatorial Probability (`# favourable / # total`, `2024_AN_Q33`)**, **Set Laws (`De Morgan's, A ∩ B^c`)**, and **Basic Definite Integrals (`\int x^n dx`, `2025_FN_Q58`, `2025_AN_Q65`)**! | MISSING-PREREQUISITE | Add **Chapter 00: Counting Probability, Set Laws & Calculus Warm-Up for PDFs** before Ch 01. | HIGH |
| 3 | `Part B.2` (All 4 chapters `"none"`) | Zero written lessons, zero subtopics, zero reading hours, and zero `[MUST]` / `[SHOULD]` / `[LATER]` guidance for a 100-day dropper. | STEP-SKIPPED | Replace this blank stub with the full lesson-by-lesson syllabus + priority tags (Part 5). | HIGH |
| 4 | `Ch 01 Probability` (Axioms & Set Venn Formulas) | Never teaches Kolmogorov's 3 Axioms, Inclusion-Exclusion (`P(A ∪ B)`), `P(A ∩ B^c) = P(A) - P(A ∩ B)`, or De Morgan `P(A^c ∩ B^c) = 1 - P(A ∪ B)` (`2024_FN_Q14`)! | MISSING-GATE-CONCEPT | Draw a 2-circle Venn Diagram showing all 4 disjoint regions (`A∩B`, `A∩B^c`, `A^c∩B`, `(A∪B)^c`, `2024_FN_Q14`). | HIGH |
| 5 | `Ch 01 Conditional` (Independent vs Mutually Exclusive!) | Beginners ALWAYS think *"Mutually Exclusive = Independent"* (`2024_FN_Q34`, `2023_FN_Q53`)! Never proves why positive-probability disjoint events are **Maximally Dependent** (`P(A ∩ B) = 0 != P(A)P(B)`)! | MISSING-GATE-CONCEPT | Put a giant Red Comparison Box: **`Mutually Exclusive (can't happen together -> disjoint Venn!)` vs `Independent (knowing B doesn't change P(A) -> P(A∩B)=P(A)P(B))`**! | HIGH |
| 6 | `Ch 01 Conditional` (Pairwise vs Mutual Independence & Subset Conditional Traps) | `2023_FN_Q53` tests why `HH` (`A`) is NOT independent of `1st H` (`B`), while `1st H` (`B`) and `2nd H` (`C`) ARE; and `2026_AN_Q63` tests overlapping coin subsets (`P(E_1 | E_2)` across 6 tosses)! | NEEDS-EXAMPLE | Trace `2023_FN_Q53` (`A, B, C`) and `2026_AN_Q63` (`6`-toss overlap conditioning on toss #2!) step by step! | HIGH |
| 7 | `Ch 01 Probability` (Sampling With vs Without Replacement & Polya's Urn!) | Never contrasts **With Replacement** vs **Without Replacement (`2024_FN_Q46`)** vs **Polya's Urn (`put back + add 1 same color`, `2026_FN_Q11`, `2021_AN_Q40`)** — including the symmetry rule that `P(Red at step k) = r / (r + b)` ALWAYS (`2021_AN_Q40`)! | MISSING-GATE-CONCEPT | Draw Probability Trees for 2 steps of Polya's Urn (`2026_FN_Q11`: `1/3`, `2021_AN_Q40`: `r/(r+b)`) and Without Replacement (`2024_FN_Q46`: `9/24`). | HIGH |
| 8 | `Ch 01 Bayes` (Law of Total Probability & Bayes' Tree Diagrams!) | Jumps to Bayes' Theorem formula `P(H|E)` without drawing **Probability Branching Trees** (`Coins/Urns/Senders -> Observation`, `2025_FN_Q32`, `2021_FN_Q57`, `2018_FN_Q54`)! | NEEDS-DIAGRAM | Draw Probability Trees for `2025_FN_Q32` (`4` fair + `1` fake coin), `2021_FN_Q57` (`H/L` binary channel), and `2018_FN_Q54` (`Guwahati/Delhi` table)! | HIGH |
| 9 | `Ch 01 Conditional` (Infinite Geometric Waiting Trials!) | `2018_FN_Q25` asks *"probability one of them wins on the **3rd** trial"* (`(1/6)^2 (5/6)`), and infinite `"first win on odd trial"` puzzles are classic GATE staples! | MISSING-GATE-CONCEPT | Teach repeated independent trials & infinite geometric series `P(win first on trial k) = (1-p)^{k-1} p`! | HIGH |
| 10 | `Ch 02 Random Vars` (Discrete PMF vs Continuous PDF vs CDF `F(x)`!) | Beginners think `f(x)` for a continuous RV IS a probability (`f(x)` can exceed `1`!! Only the **area** $\int f(x)\,dx$ is a probability, and **$P(X = c) = 0$** for any single continuous point, `2025_FN_Q58`!)! | UNEXPLAINED-WORD | Contrast Discrete Bar Chart (`PMF`, heights sum to `1`) vs Continuous Curve (`PDF`, total AREA = `1`, single-point prob = `0`) + `CDF F(x)`! | HIGH |
| 11 | `Ch 02 Random Vars` (Normalizing Constant `C` & Truncated Intervals `2025_FN_Q58`) | Never teaches the 2-step Continuous PDF workflow (`Step 1: \int_{-∞}^{+∞} f(x) dx = 1 to find C`; `Step 2: P(a <= X <= b) = \int_a^b f(x) dx`, `2025_FN_Q58`)! | STEP-SKIPPED | Trace `2025_FN_Q58` (`C = 1/21`, `P(2 <= X <= 3) = 19/63`) and piecewise CDFs step by step! | HIGH |
| 12 | `Ch 02 Random Vars` (Expectation $E[X]$, Law of Unconscious Statistician $E[g(X)]$ & Linearity!) | Misses **Linearity of Expectation $E[aX + bY] = aE[X] + bE[Y]$ (holds EVEN WHEN `X, Y` ARE DEPENDENT!)** vs **$E[XY] = E[X]E[Y]$ (ONLY when independent!)** (`2024_AN_Q52`, `2019_FN_Q53`, `2017_AN_Q52`)! | MISSING-GATE-CONCEPT | Put a bold side-by-side table: `E[X + Y]` (ALWAYS linear!) vs `E[XY]` (needs independence!) + `2024_AN_Q52` (`xy <= x => E[xy] <= E[x]`)! | HIGH |
| 13 | `Ch 02 Random Vars` (Variance $\text{Var}(X) = E[X^2] - (E[X])^2$, Scaling & Sums!) | Misses **`E[X^2] = Var(X) + (E[X])^2` (`2017_AN_Q52`)**, **`Var(aX + b) = a^2 Var(X)`**, **`Var(X ± Y) = Var(X) + Var(Y)` (when independent; `+ 2 Cov(X,Y)` when dependent!)**! | MISSING-GATE-CONCEPT | Trace `2017_AN_Q52` (`E[(X+2)^2] = 54`) and prove `Var(aX + b) = a^2 Var(X)` & `Var(X - Y) = Var(X) + Var(Y)`! | HIGH |
| 14 | `Ch 02 Random Vars` (Covariance, Correlation `|\rho| <= 1` & Cauchy-Schwarz `2021_FN_Q12`!) | `2021_FN_Q12` directly tests **$\text{Cov}(X, Y) = E[(X - \mu_X)(Y - \mu_Y)]$** and **Cauchy-Schwarz Inequality $(\text{Cov}(X,Y))^2 \le \text{Var}(X)\text{Var}(Y)$** (`|\rho| <= 1`), which aren't mentioned anywhere in `Part B.2`! | MISSING-GATE-CONCEPT | Explain Covariance sign (`+, -, 0`) visually with scatter plots + state Cauchy-Schwarz `|\rho| <= 1` (`2021_FN_Q12`)! | HIGH |
| 15 | `Ch 02 Random Vars` (Indicator Random Variables & Tree Distance `2019_FN_Q53`) | Misses **Indicator Random Variables** (`E[I_A] = P(A)`) & counting symmetric pairs (`2020_FN_Q50` odd dot-product = `0.5`, `2019_FN_Q53` tree distance = `4.25`)! | MISSING-GATE-CONCEPT | Solve `2019_FN_Q53` (`4.25`), `2020_FN_Q50` (`0.5`), and `expected fixed points = 1` via indicator/symmetry! | MEDIUM |
| 16 | `Ch 02 Random Vars` (Probability Generating Functions `PGF` `2017_AN_Q44`!) | `2017_AN_Q44` uses **$g_X(z) = E[z^X] = \sum p_j z^j$ (`PGF`)** where **$E[X] = g_X'(1)$**! Nowhere does `Part B.2` mention PGFs! | MISSING-GATE-CONCEPT | Teach PGF basics (`g(1)=1`, `g'(1)=E[X]`, `g_Y(z) = (1-\beta+\beta z)^N` = Binomial(`N, \beta`), `2017_AN_Q44`)! | MEDIUM |
| 17 | `Ch 02 Random Vars` (Sequential Conditional Expectation & Optimal Strategy `2021_AN_Q24`, `2025_AN_Q65`) | Misses **Conditional Expectation / Law of Total Expectation (`E[X] = \sum P(A_i) E[X | A_i]`)** (`2025_AN_Q65`: `0.74` split stick!) and Expected-Payoff Decision Trees (`2021_AN_Q24`: `16`)! | MISSING-GATE-CONCEPT | Draw decision trees for `2021_AN_Q24` and integral-split expectation for `2025_AN_Q65`! | HIGH |
| 18 | `Ch 03 Distributions` (Bernoulli & Binomial: Parameters, `E`, `Var`, `SD` & `0`-Error Message `2025_FN_Q56`, `2021_AN_Q15`) | Misses **Bernoulli -> Binomial `P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}`**, Mean `np`, Variance `npq`, SD `\sqrt{npq}` (`2021_AN_Q15`: `15.49`), and **Sum of Independent Binomials (`Bin(n_1, p) + Bin(n_2, p) = Bin(n_1+n_2, p)`)**! | MISSING-GATE-CONCEPT | Trace Binomial PMF bar chart + solve `2025_FN_Q56` (`0.951`) and `2021_AN_Q15` (`15.49`)! | HIGH |
| 19 | `Ch 03 Distributions` (Poisson Distribution: PMF, `E = Var = \lambda`, `Bin -> Poisson` & Sum!) | Misses **Poisson PMF $e^{-\lambda}\lambda^k/k!$**, Mean = Variance = $\lambda$ (`2017_AN_Q52`: `54`), Poisson approximation (`n` large, `p` small, `\lambda = np`), and **Sum of Independent Poissons (`Pois(\lambda_1+\lambda_2)`)**! | MISSING-GATE-CONCEPT | Plot Poisson right-skewed bar chart + solve `2017_AN_Q52` (`E[(X+2)^2] = 54`)! | HIGH |
| 20 | `Ch 03 Distributions` (Geometric Distribution — Missing From Syllabus Line Yet Tested in `2018_FN_Q25`!) | `Part B.1` lists only Uniform, Normal, Exponential, Poisson, Binomial, YET **`2018_FN_Q25` tests Geometric waiting trials** (`(1-p)^{k-1} p`, Mean `1/p`, Memoryless property!)! | MISSING-GATE-CONCEPT | Add **Geometric Distribution** right alongside Binomial/Exponential as the discrete cousin of Exponential! | HIGH |
| 21 | `Ch 03 Distributions` (Continuous Uniform `U(a, b)`: PDF, Mean, Var & Mapping Algebraic Intervals!) | Misses **`U(a, b)` PDF `1/(b-a)`**, `E = (a+b)/2`, `Var = (b-a)^2/12`, AND **converting algebraic conditions like real roots (`\Delta >= 0`, `2019_FN_Q55`) into sub-interval lengths**! | MISSING-GATE-CONCEPT | Draw the `U(a, b)` rectangle + trace `2019_FN_Q55` (`[2, 6)` inside `(1, 6)` -> `4/5 = 0.8`) and `2025_AN_Q65` (`0.74`)! | HIGH |
| 22 | `Ch 03 Distributions` (Exponential Distribution: `f(x) = \lambda e^{-\lambda x}`, CDF `1 - e^{-\lambda x}`, `P(X > 1/\lambda) = e^{-1}` & Memoryless!) | Students forget whether parameter $\lambda$ is **rate (`E = 1/\lambda`)** or scale (`E = \lambda`) (`2021_FN_Q32`: `P(X > E[X]) = e^{-1} = 0.368`, **independent of $\lambda$!**), AND miss the **Memoryless Property (`P(X > s + t | X > s) = P(X > t)`)**! | MISSING-GATE-CONCEPT | Draw the Exponential curve marking `1/\lambda` (`e^{-1} \approx 0.368` area to the right!) and illustrate Memoryless waiting! | HIGH |
| 23 | `Ch 03 Distributions` (Normal / Gaussian: Pattern-Matching PDF `2026_AN_Q14`, `68-95-99.7`, Standard `Z`, Linear Combos & `max(X, 0)` Median!) | Misses **identifying $\mu$ and $\sigma$ directly from `exp(-(x-\mu)^2 / (2\sigma^2))` (`2026_AN_Q14`: `1/(3\sqrt{2\pi}) e^{-x^2/18}` -> `\sigma=3`)**, **Standard Normal $Z = (X-\mu)/\sigma$**, **Empirical `68%-95%-99.7%` symmetry**, and **Mixed/Clipped Gaussian `Y = max(X, 0)` median (`2017_FN_Q14`: `0.0`)**! | MISSING-GATE-CONCEPT | Draw the Bell Curve with `±1\sigma (68%), ±2\sigma (95%), ±3\sigma (99.7%)` + draw `Y = max(X, 0)` piling 50% probability mass at `0` (`2017_FN_Q14`)! | HIGH |
| 24 | `Ch 04 Descriptive Stats` (Mean, Median, Mode, Variance & SD on Raw & Grouped Data!) | `Part B.1` explicitly lists **Mean, median, mode and standard deviation**, yet `Part B.2` doesn't cover raw/grouped formulas, **odd vs even median**, **Empirical relation `Mode = 3·Median - 2·Mean`**, or **Change of Origin & Scale** (`Mean` shifts & scales; `SD/Range` ONLY scales `|a|·SD`, invariant to shift `+b`!)! | MISSING-GATE-CONCEPT | Teach raw & grouped Mean/Median/Mode/SD, Skewness (`Mean > Median > Mode`), and Change of Origin & Scale rules! | HIGH |
| 25 | `Part C` (`2021_FN_Q57` Missing Figure & `2026_AN_Q14` Minor Truncation) | `2021_FN_Q57` misses binary channel diagram `[IMAGE_Q_57_1]` (needed to read `P(H|L)` directly instead of reverse-solving from `0.04`); `2026_AN_Q14` prints `"about the random variable .. ?"` (missing `X`). | NEEDS-DIAGRAM | Restore `[IMAGE_Q_57_1]` in `2021_FN_Q57` and fix `"random variable .. ?"` -> `"random variable X?"` in `2026_AN_Q14`. | MEDIUM |
| 26 | `Part B.2` (Old Standard Warning) | All 4 chapters are `none | not written`, so every chapter needs beginner-first lessons, concrete examples, Venn/Tree/PDF-area diagrams, and step-by-step traces. | UNCLEAR-ENGLISH | Write all chapters following the restructured plan (Parts 4 & 5). | MEDIUM |

*(Let's continue adding 55+ ultra-specific, beginner-catching gaps across Ch 00–04 so Part 2 clears **80+ rows** with zero fluff!)*

| # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
|---|---|---|---|---|---|
| 27 | `Ch 00` (Sample Space, Outcomes vs Events, Elementary Events) | Beginners confuse **Outcome** (one leaf of a tree, e.g. `(H, T)`) with **Event** (a subset of outcomes, e.g. `at least 1 H`) and **Sample Space $\Omega$**! | UNEXPLAINED-WORD | Draw a coin-toss sample space `{(H,H), (H,T), (T,H), (T,T)}` circling subset Events inside it. | MEDIUM |
| 28 | `Ch 00` (Basic Combinatorial Probability Pitfall: Distinguishable vs Identical Dice!) | In `2018_FN_Q25` and `2024_AN_Q33`, beginners think `(1, 2)` and `(2, 1)` on two identical dice count as 1 outcome (`21` outcomes instead of `36` equally likely pairs!)! | MISSING-PREREQUISITE | Draw the `6 × 6 = 36` equally likely dice grid showing why `P(1 & 2) = 2/36`, NOT `1/21`! | HIGH |
| 29 | `Ch 00` (Unsigned Binary MSB Probability Counting `2019_FN_Q16`) | In `2019_FN_Q16` (`{1..13}` 4-bit binary MSB match), beginners blindly assume `0.5` without checking exact counts (`7` numbers `1..7` have `MSB=0` vs `6` numbers `8..13` have `MSB=1` -> `85/169 = 0.503`!)! | NEEDS-EXAMPLE | Trace `2019_FN_Q16` (`{1..7}` vs `{8..13}`) showing why `0.500` fails rounding (`0.502–0.504`)! | MEDIUM |
| 30 | `Ch 00` (Basic Definite Integrals & Polynomial Roots for GATE Probability) | Students forgot `∫_a^b x^k dx`, `∫ e^{-λx} dx`, and solving quadratic inequalities `Y^2 - Y - 2 >= 0` (`2019_FN_Q55`)! | MISSING-PREREQUISITE | Add a 1-page `"6 Integrals & Inequality Sign-Chart"` cheat box in Ch 00 (`2025_FN_Q58`, `2025_AN_Q65`, `2019_FN_Q55`). | HIGH |
| 31 | `Ch 01` (Conditional Probability Intuitive Meaning: Shrinking the Sample Space!) | Never shows `P(A | B) = P(A ∩ B) / P(B)` visually as **"Zooming into circle `B` as your brand-new 100% universe"**! (`2026_AN_Q63`, `2024_FN_Q46`). | NEEDS-DIAGRAM | Draw Venn diagram crossing out everything outside `B` so `P(A | B)` becomes obvious fraction `area(A∩B) / area(B)`! | HIGH |
| 32 | `Ch 01` (Bayes' Theorem Intuition: Updating Prior Beliefs with Evidence!) | Beginners memorize the giant Bayes sum formula instead of thinking **"Slice of True-Positive inside ALL Positives (`Hit / (Hit + False Alarm)`)!"** (`2025_FN_Q32`, `2021_FN_Q57`, `2018_FN_Q54`)! | STEP-SKIPPED | Solve `2025_FN_Q32` (`Fake coin`) and `2018_FN_Q54` (`Guwahati/Delhi`) using a 2-step Tree + `"Wanted Branch / Sum of All Matching Branches"`! | HIGH |
| 33 | `Ch 01` (3-Event Mutual Independence vs Pairwise Independence!) | Standard GATE/textbook trap (`2023_FN_Q53` extension): 3 events can be **pairwise independent** yet **NOT mutually independent** (classic 2-fair-coin parity triple: `A = 1st H`, `B = 2nd H`, `C = same face`!)! | MISSING-GATE-CONCEPT | Show the 2-coin counterexample (`A, B, C`) where `P(AB)=P(A)P(B), P(BC)=P(B)P(C), P(AC)=P(A)P(C)` yet `P(ABC) = 1/4 != 1/8`! | HIGH |
| 34 | `Ch 01` (`P(A | B) = P(A)` Equivalence & `A, B` Independent => `A^c, B^c` Independent!) | In `2023_FN_Q53(D)` (`P(B | C) = P(B)`), show ALL 4 equivalent independence statements (`A, B` ind `<=>` `A, B^c` ind `<=>` `A^c, B` ind `<=>` `A^c, B^c` ind)! | MISSING-FINER-POINT | Add a 4-bullet "Independence Flip Properties" box (`2023_FN_Q53`). | MEDIUM |
| 35 | `Ch 01` (Monty Hall / Two-Child Boy-Girl Paradoxes — Intuition Check!) | Quick 1-example illustration showing how conditional wording (`"older child is a boy"` vs `"at least one child is a boy"`) changes `1/2` to `1/3`! | NEEDS-EXAMPLE | Contrast `"First ball is Red"` (`2024_FN_Q46`) vs `"At least one ball is Red"` (`hypergeometric`!). | LOW |
| 36 | `Ch 01` (Chain Rule of Probability `P(A ∩ B ∩ C) = P(A) P(B|A) P(C|A∩B)`) | Show multiplying branch probabilities cleanly along a 3-step without-replacement tree (`2026_FN_Q11`, `2018_FN_Q25`). | STEP-SKIPPED | Trace a 3-step Chain Rule tree for drawing 3 balls without replacement. | MEDIUM |
| 37 | `Ch 02` (Expectation of Non-Negative Integer RV: Tail Sum Formula `E[X] = \sum_{k=1}^\infty P(X >= k)`!) | Useful GATE shortcut for geometric/uniform-max/min expectations (`min` of 2 uniform dice or coin flips)! | MISSING-FINER-POINT | Show `E[X] = P(X>=1) + P(X>=2) + ...` on a 6-sided die (`(6+5+4+3+2+1)/6 = 3.5`). | LOW |
| 38 | `Ch 02` (Why Does `2025_AN_Q64` Count Only `4` Square-Invariant Quadratics?) | In `2025_AN_Q64`, beginners try solving `\alpha = \alpha^2, \beta = \beta^2` as *ordered* pairs `(0,1)` and `(1,0)` separately (`6` tuples instead of `4` distinct polynomials!) — forgetting `(x-0)(x-1)` IS THE EXACT SAME POLYNOMIAL as `(x-1)(x-0)`! | NEEDS-TRACE | List all `4` distinct unordered root-sets (`{0,0}, {1,1}, {0,1}, {\omega, \omega^2}`) vs `5` ordered tuples! | HIGH |
| 39 | `Ch 02` (`2024_AN_Q52` Dependent RV Counterexamples!) | For $x, y \in [0, 1]$, `z = xy`: students guess `E[xy] = E[x]E[y]` (`A`) or `>=` (`C`) or `<=` (`B`)! Give explicit 2-point counterexamples breaking `B` (`y = x`) and `C` (`y = 1 - x`)! | NEEDS-EXAMPLE | Show `y = x` (`E[x^2] > (E[x])^2` breaks B) and `y = 1 - x` (`E[x(1-x)] < E[x](1-E[x])` breaks C) proving ONLY `D` (`\overline{z} <= \overline{x}`) holds! | HIGH |
| 40 | `Ch 02` (`2021_AN_Q24` Expected Marks Tree — Why Order `A -> B` Beats `B -> A`!) | Beginners think you should ALWAYS try the higher-marks question (`B = 20`) first! Prove why sorting by `P(pass) × Marks / (1 - P(pass))` (`Bang-for-Failure-Risk`: `A = 0.8×10/0.2 = 40` vs `B = 0.5×20/0.5 = 20`!) wins (`16 > 14`)! | NEEDS-TRACE | Draw the 2 decision trees (`A->B` vs `B->A`) showing why high-probability `A` first protects `B`'s `20`-mark bonus! | HIGH |
| 41 | `Ch 02` (Joint PMF / Joint PDF & Marginal / Independence Test!) | Standard syllabus/Made Easy/GateWallah subtopic: 2-variable tables $p_{XY}(x,y)$, computing Marginals $p_X(x) = \sum_y p(x,y)$, and testing $p_{XY}(x,y) = p_X(x) p_Y(y)$! | MISSING-GATE-CONCEPT | Trace a 2×3 Joint PMF table computing Marginals, $P(X+Y \le 2)$, $E[XY]$, and testing independence! | HIGH |
| 42 | `Ch 02` (Chebyshev's Inequality & Markov's Inequality — Light Awareness) | Briefly show `P(X >= a) <= E[X]/a` and `P(|X - \mu| >= k\sigma) <= 1/k^2` (`[LATER]` conceptual completeness for GATE Engg Math). | MISSING-FINER-POINT | Add a 1-box summary of Markov & Chebyshev bounds. | LOW |
| 43 | `Ch 02` (Variance of Linear Combinations: `Var(2X - 3Y + 5)`!) | Students accidentally keep `+ 5` or put `-3` instead of `(-3)^2 = +9` (`Var(2X - 3Y + 5) = 4 Var(X) + 9 Var(Y)` when independent)! | STEP-SKIPPED | Work 2 quick drills showing `+5` vanishes (`shift = 0 spread change`) and `-3` squares to `+9`! | HIGH |
| 44 | `Ch 02` (Functions of a Random Variable & Mixed Continuous/Discrete CDF `2017_FN_Q14`) | When `Y = max(X, 0)` for `X ~ N(0, \sigma^2)`, `Y` is NEITHER purely discrete NOR purely continuous (`point mass 0.5 at 0 + continuous tail for y > 0`)! Show its **step-plus-smooth CDF**! | NEEDS-DIAGRAM | Plot the CDF `F_Y(y)` jumping from `0` to `0.5` at `y = 0` then rising smoothly to `1` (`Median = 0.0`, `2017_FN_Q14`)! | HIGH |
| 45 | `Ch 03 Distributions` (When Does Binomial Approximate to Poisson vs Normal?) | State exact thresholds: `n` large, `p` small (`np = \lambda` finite -> **Poisson**); `np >= 5` & `n(1-p) >= 5` -> **Normal** (`N(np, npq)`)! | MISSING-FINER-POINT | Draw a 3-way flow (`Small n -> exact Binomial`, `Large n & tiny p -> Poisson`, `Large n & moderate p -> Normal`). | MEDIUM |
| 46 | `Ch 03 Distributions` (Continuous Uniform `U(a, b)` CDF Ramp & Sub-Interval Probability) | Beginners integrate `1/(b-a)` slowly every time instead of just taking **`(overlap length) / (b - a)`** (`2019_FN_Q55`: `4 / 5 = 0.8`)! | NEEDS-EXAMPLE | Draw the `U(1, 6)` box with interval `[2, 6)` shaded showing instant ratio `(6-2)/(6-1) = 4/5`! | MEDIUM |
| 47 | `Ch 03 Distributions` (Poisson `0`, `1`, `>= 1` & Conditional Poisson Tricks) | Show the fast `P(X >= 1) = 1 - e^{-\lambda}` complement trick and why `Poisson` models random arrivals per unit time (`with exponential inter-arrival times!`). | MISSING-FINER-POINT | Link **Poisson count in `[0, t]`** to **Exponential time between arrivals** in one crisp box! | MEDIUM |
| 48 | `Ch 03 Distributions` (Exponential `P(X > s + t | X > s) = P(X > t)` Memoryless Trap!) | Beginners try integrating conditional limits for Exponential waiting instead of simply dropping the already-waited time `s`! | NEEDS-EXAMPLE | Solve `"component already lasted 3 hours, prob it lasts 2 more"` in 1 line (`e^{-2\lambda}`)! | MEDIUM |
| 49 | `Ch 03 Distributions` (Why Normal PDF Has No Elementary Antiderivative — Using `Z`, Symmetry & `Φ` Table!) | Beginners try to integrate $e^{-x^2/2}$ by hand! Tell them right away: **NEVER integrate the Normal curve by hand** — convert to $Z = (X - \mu)/\sigma$ and use symmetry (`0.5`), `68-95-99.7%`, or given $\Phi(z)$ values! | MISSING-PREREQUISITE | Put a bold warning: *"Normal PDF has no closed-form integral — always use `Z`-symmetry or given table values!"* | HIGH |
| 50 | `Ch 03 Distributions` (Linear Combinations of Independent Normals: `2X - Y`!) | If $X \sim N(\mu_1, \sigma_1^2)$ and $Y \sim N(\mu_2, \sigma_2^2)$ independent, then $aX \pm bY \sim N(a\mu_1 \pm b\mu_2,\ a^2\sigma_1^2 + b^2\sigma_2^2)$ (variances ALWAYS ADD even when subtracting `X - Y`!!). | MISSING-GATE-CONCEPT | Work 1 example finding $P(X > Y)$ by forming $D = X - Y \sim N(\mu_1-\mu_2, \sigma_1^2+\sigma_2^2)$! | HIGH |
| 51 | `Ch 04 Descriptive Stats` (Median for Odd `n`, Even `n`, & Grouped Frequency Data!) | Teach sorted-array middle `(n+1)/2` vs average of `n/2` & `n/2 + 1`, AND the **Grouped Median interpolation formula** (`L + ((N/2 - cf)/f) × h`) + **Mode formula**! | STEP-SKIPPED | Trace Median & Mode on both a 6-number list and a 4-bin grouped frequency table! | MEDIUM |
| 52 | `Ch 04 Descriptive Stats` (Sample Variance `n - 1` vs Population Variance `n`!) | Clarify when books divide by `n` (population $\sigma^2$, standard for probability/raw population) vs `n - 1` (unbiased sample variance $s^2$). | MISSING-FINER-POINT | Put a clear 2-line note distinguishing Population $\sigma^2$ (`÷ n`) vs Unbiased Sample $s^2$ (`÷ (n-1)`). | LOW |
| 53 | `Ch 04 Descriptive Stats` (Mean vs Median vs Mode Under Skewness & Outliers!) | Show how 1 billionaire walking into a room destroys **Mean**, while **Median** and **Mode** barely budge — plus **`Mean - Mode = 3(Mean - Median)`** for moderately skewed data! | NEEDS-DIAGRAM | Draw Symmetric (`Mean = Median = Mode`), Right-Skewed (`Mean > Median > Mode`), and Left-Skewed (`Mean < Median < Mode`) curves! | MEDIUM |
| 54 | `Ch 04 Descriptive Stats` (Combined Mean & Combined Variance of Two Groups!) | Classic GATE/aptitude statistics formula: given $(n_1, \mu_1, \sigma_1)$ and $(n_2, \mu_2, \sigma_2)$, compute combined Mean AND combined Variance ($\sigma^2 = \frac{n_1(\sigma_1^2 + d_1^2) + n_2(\sigma_2^2 + d_2^2)}{n_1 + n_2}$)! | MISSING-GATE-CONCEPT | Derive and solve 1 combined-class Mean & SD problem (`d_i = \mu_i - \mu`). | MEDIUM |
| 55 | `Ch 01` (Order-Independence / Symmetry Trick in `"Before"` Permutations `2024_FN_Q34`) | In `2024_FN_Q34` (`1` before `2` AND `3` before `4` in random permutation), students try counting `n!` cases instead of seeing that `{1,2}` and `{3,4}` occupy independent relative positions (`1/2 × 1/2 = 1/4`)! | NEEDS-EXAMPLE | Draw a 6-slot permutation picking 2 spots for `{1, 2}` and 2 spots for `{3, 4}` (`2024_FN_Q34`). | MEDIUM |
| 56 | `Ch 01` (Bayes Tabular Grid Method vs Formula!) | Students make arithmetic errors substituting `P(A|B)` backwards into Bayes' formula! Show the **Joint-Probability Box (`2×2` or `3×3` Table, e.g. `2018_FN_Q54`)**: multiply each prior row by conditional probs to get real `P(row ∩ col)`, then divide cell by column total! | NEEDS-TRACE | Convert `2018_FN_Q54` conditional table into a Joint Probability Table (`0.08, 0.05, 0.003` -> sum `0.133` -> `0.08 / 0.133 = 0.6015`)! | HIGH |
| 57 | `Ch 01` (Conditioning on Subset Overlap `P(E1 | E2)` `2026_AN_Q63`) | In `2026_AN_Q63`, `E_1` uses `{2, 4, 6}` and `E_2` uses `{1, 2, 3, 5}`: teach the **Overlap Conditioning Method** (`split on shared coin #2 using Law of Total Probability given E_2`)! | NEEDS-TRACE | Draw the 6 coin slots `[1][2][3][4][5][6]` circling `[2]` as the ONLY bridge between `E_1` and `E_2` (`2026_AN_Q63`: `0.5`)! | HIGH |
| 58 | `Ch 02` (`2020_FN_Q50` Random Binary Dot-Product Parity Trick) | For non-zero $a \in \{0,1\}^n$ and uniform $x \in \{0,1\}^n$, isolate ONE index $k$ where $a_k = 1$ ("Pivot Bit"): pairing every $x$ with $x$ having bit $k$ flipped pairs odd & even sums `1-to-1`, giving `0.5` ALWAYS! | NEEDS-EXAMPLE | Trace `a = (1, 0, 1)` across all `8` vectors `x \in {0,1}^3` pairing bit-0 flips (`4` odd, `4` even -> `0.5`)! | MEDIUM |
| 59 | `Ch 02` (Why `Cov(X, Y) = 0` Does NOT Imply Independence!) | Students know `Independent => Cov = 0`, yet falsely assume the converse! Show standard counterexample: $X \in \{-1, 0, +1\}$ uniform, $Y = X^2$ (`Cov = 0`, yet `Y` completely depends on `X`!)! | MISSING-GATE-CONCEPT | Plot `(-1,1), (0,0), (1,1)` showing horizontal symmetry (`Cov = 0`) despite exact curve `Y = X^2`! | HIGH |
| 60 | `Ch 03` (Exponential Parameter Convention Warning: Rate `\lambda` vs Mean `\theta`!) | In `2021_FN_Q32` (`parameter 2` -> `E[X] = 1/2`), warn that GATE almost always uses rate parameter $\lambda$ (`f(x) = \lambda e^{-\lambda x}`), AND note that **`P(X > E[X]) = e^{-1} \approx 0.368` holds for BOTH rate and mean conventions**! | UNCLEAR-ENGLISH | Highlight `f(x) = \lambda e^{-\lambda x}` -> `E[X] = 1/\lambda` AND prove `P(X > E[X]) = e^{-1}` regardless of $\lambda$ (`2021_FN_Q32`)! | MEDIUM |
| 61 | `Ch 01` (At Least One / Birthday Paradox Complement Trick `1 - P(none)`!) | In `2025_FN_Q56` (`0` errors = `0.99^5`) vs *"at least 1 bit flipped"* (`1 - 0.99^5`), highlight the **`P(at least one) = 1 - P(none)`** rule! | STEP-SKIPPED | Contrast `0` errors (`0.99^5`) vs `>= 1` error (`1 - 0.99^5`). | LOW |
| 62 | `Ch 02` (Joint Probability: Finding `P(X < Y)` on `[0, 1] × [0, 1]` Geometric Square!) | Standard GATE/aptitude 2-variable uniform continuous trick: shade region `x < y` or `|x - y| <= 0.5` inside the `1 × 1` unit square (`Area = Probability`!)! | NEEDS-DIAGRAM | Draw the `1 × 1` square shading `|x - y| <= 1/2` (`1 - 2(1/8) = 3/4`) without double integrals! | HIGH |
| 63 | `Ch 02` (Moment Generating Functions / PGF Summary Table Across Distributions) | Link `2017_AN_Q44` (`g_Y(z) = (1 - \beta + \beta z)^N`) to PGFs of Bernoulli, Binomial, Geometric, and Poisson! | MISSING-FINER-POINT | Add a 4-row PGF Cheat Box (`Bernoulli`, `Binomial`, `Poisson`, `Geometric`) in Ch 02/03. | LOW |
| 64 | `Ch 03` (Why `f(x) = 1/(3\sqrt{2\pi}) exp(-x^2/18)` Gives `\mu=0, \sigma=3` in `2026_AN_Q14`) | Show step-by-step matching against $\frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$ (`2\sigma^2 = 18 => \sigma = 3`, confirming denominator `3\sqrt{2\pi}` matches!). | NEEDS-TRACE | Align the general Normal PDF right over `2026_AN_Q14` with matching circles on `3`, `0`, and `18`! | MEDIUM |
| 65 | `Ch 01` (Conditional Probability Multiplication vs Addition Mistakes) | Beginners add probabilities where they should multiply (`AND`), and multiply where they should add (`OR` mutually exclusive)! | MISSING-PREREQUISITE | Put `"Branching Along One Path = MULTIPLY (AND) | Combining Separate Paths = ADD (OR)"` directly on every Probability Tree! | HIGH |
| 66 | `Ch 04` (Weighted Mean & Harmonic/Geometric Mean — Quick Bridge) | Briefly contrast Arithmetic Mean (`AM`), Geometric Mean (`GM` for growth rates), and Harmonic Mean (`HM` for average speed over equal distances) (`[LATER]` aptitude/stats crossover). | MISSING-FINER-POINT | Add a 3-line AM >= GM >= HM comparison box. | LOW |
| 67 | `Ch 02` (Why Continuous Uniform `(0, 1)` Has `P(X = 0.4) = 0` in `2025_AN_Q65`) | In `2025_AN_Q65`, beginners ask *"What if the cut lands AT `0.4` itself?"* Explain why single-point probability `P(U = 0.4) = 0` lets us safely ignore the boundary `U = 0.4` in integrals! | UNEXPLAINED-WORD | Clarify `P(U < 0.4) = P(U <= 0.4) = 0.4` for continuous RVs (unlike discrete RVs!). | MEDIUM |
| 68 | `Ch 02` (Expectation of Uniform Broken Stick `2025_AN_Q65` Intuition Check!) | Why is the expected length `0.74 > 0.5` in `2025_AN_Q65`? Because cutting closer to either end gives a LONG piece and a SHORT piece — and `0.4` is MORE LIKELY to sit inside the longer piece (**Inspection Paradox**)! | MISSING-FINER-POINT | Add a 2-line physical "Inspection Paradox" intuition explaining why `0.74 > 0.50` makes total sense! | LOW |
| 69 | `Ch 01` (Drawing Without Replacement Symmetric Positions!) | Just like Polya's Urn (`2021_AN_Q40`), drawing 10 balls without replacement gives `P(4th ball is Red) = r / (r + b)` unconditionally too! | MISSING-FINER-POINT | Show why unconditional draw `k` without replacement equals `r / (r + b)` by permutation symmetry. | MEDIUM |
| 70 | `Ch 03` (Standard Normal `Z`-Transform Scaling: `P(2 <= X <= 8)` When `X ~ N(5, 9)`) | Beginners divide by **variance (`9`)** instead of **standard deviation (`\sigma = \sqrt{9} = 3`)** inside `Z = (X - \mu) / \sigma`!! | MISSING-FINER-POINT | Put a giant warning box: **`N(\mu, \sigma^2)` gives VARIANCE $\sigma^2$ — ALWAYS take $\sqrt{\sigma^2} = \sigma$ before computing $Z$!** | HIGH |
| 71 | `Ch 02` (Why `Var(X) >= 0` Forces `E[X^2] >= (E[X])^2`!) | Connect `Var(X) = E[X^2] - (E[X])^2 >= 0` directly to `E[X^2] >= (E[X])^2` (`equality holds iff X is constant!`). | MISSING-FINER-POINT | Show `Var(X) = 0 <=> X is constant with prob 1`. | LOW |
| 72 | `Ch 00` (Permutations vs Combinations Quick Refresher Inside Probability) | Show `n!`, `\binom{n}{k}` (unordered subsets like cards/balls), and `P(n, k)` (ordered sequences) on 3 quick probability denominators! | MISSING-PREREQUISITE | Add a 3-row `"Ordered vs Unordered Denominator"` check (`2024_AN_Q33`, `2024_FN_Q46`). | MEDIUM |
| 73 | `Ch 02` (Indicator Shortcut vs Brute-Force Counting for `2019_FN_Q53`!) | In `2019_FN_Q53` (`expected distance between 2 random leaves in 8-leaf binary tree`), show BOTH the direct Fix-`a` distance count (`(0+2+8+24)/8 = 4.25`) AND how symmetry avoids summing all 64 pairs! | NEEDS-TRACE | Trace all distances from leaf `a = 1` (`0, 2, 4, 4, 6, 6, 6, 6`) visually on the 8-leaf binary tree! | HIGH |
| 74 | `Ch 01` (De Mere / Rolling Dice Ties in Infinite Games `2018_FN_Q25`!) | In `2018_FN_Q25`, contrast `"win ON 3rd trial"` (`(1/6)^2 (5/6)`) vs `"win WITHIN 3 trials"` (`5/6 + (1/6)(5/6) + (1/6)^2(5/6)`) vs `"P wins eventually"` (`1/2`)! | NEEDS-EXAMPLE | Solve all 3 wording variants of the same repeated-dice game (`2018_FN_Q25`)! | HIGH |
| 75 | `Ch 01` (Checking All Rows/Columns Sum to 1 in Conditional Tables `2018_FN_Q54`) | In `2018_FN_Q54`, show beginners how to verify which axis is conditioned (`each ROW sums to 1.00 = P(Delhi | Guwahati)`!), preventing inverted `P(G | D)` confusion! | STEP-SKIPPED | Highlight row-sums = `1.00` in `2018_FN_Q54` proving rows are conditions (`| G`). | MEDIUM |
| 76 | `Ch 02` (Discrete PMF Missing Probability `k` Calculation) | Before computing `E[X]` (`2026_FN_Q58`), always verify probabilities sum to `1` (`4×(1/6) + 4×(1/12) = 2/3 + 1/3 = 1`) — and solve classic `"find missing k"` PMF questions! | NEEDS-EXAMPLE | Add a 1-example `"Verify Sum = 1"` sanity check before `E[X]` (`2026_FN_Q58`). | LOW |
| 77 | `Ch 03` (Exponential CDF `1 - e^{-\lambda x}` vs Survival Function `e^{-\lambda x}`!) | Beginners always plug `1 - e^{-\lambda x}` when asked **`P(X > t)`** (`exceeds lifetime`, `2021_FN_Q32`)! | MISSING-FINER-POINT | Put `P(X <= t) = 1 - e^{-\lambda t}` vs `P(X > t) = e^{-\lambda t}` side-by-side (`2021_FN_Q32`). | HIGH |
| 78 | `Ch 04` (Median of Continuous PDF via `F(m) = 0.5` Integral!) | Show finding the median `m` of a general continuous PDF by solving $\int_{-\infty}^m f(x)\,dx = 0.5$ (`connects Ch 02/03 PDFs directly to Ch 04 Median, 2017_FN_Q14`!). | NEEDS-EXAMPLE | Compute Mean, Median, and Mode on a simple triangular PDF `f(x) = 2x` on `[0, 1]`! | MEDIUM |
| 79 | `Ch 04` (Mode of Continuous vs Discrete Distributions!) | Define **Mode** for discrete (highest PMF $p_k$), continuous (global peak $\arg\max f(x)$ — e.g. Mode of Exponential is `0`!), and raw lists (most frequent)! | UNEXPLAINED-WORD | Compare Mean, Median, and Mode across `Uniform`, `Normal`, `Exponential (Mode=0)`, and `Poisson`! | MEDIUM |
| 80 | `Ch 00` (Handling Percentages vs Decimals vs Fractions in NAT Rounding!) | Warn students about GATE NAT wording (`"probability"` -> `0.375`, NOT `37.5%`!, and watch `"rounded to 2 vs 3 decimal places"` in `2026_FN_Q58`, `2025_FN_Q56`, `2025_FN_Q58`, `2019_FN_Q16`)! | UNCLEAR-ENGLISH | Put a 1-line NAT rounding rule ("keep 5 digits during intermediate steps, round ONLY at the end!"). | MEDIUM |

---

## PART 3. WHAT A COMPLETE SUBJECT MUST HAVE

Because `Part B.2` lists **"none | not written"** for all 4 chapters and misplaces `04 Mean, median, mode and standard deviation` at the end, here is the complete subject structure mapped against the GATE CS syllabus (`Part B.1`), `Part C` (31 PYQs), Ross (*A First Course in Probability*), Blitzstein–Hwang, Made Easy, GateWallah, and NPTEL:

1. **Chapter 00: Counting Probability, Set Algebra & Calculus Warm-Up** *(missing prerequisite!)*
   - **Sub-topics:** Outcomes, Events, Equally likely `36`-pair dice grids (`2024_AN_Q33`, `2018_FN_Q25`), Ordered/Unordered counts (`2019_FN_Q16`), De Morgan's & Event Venn Algebra (`2024_FN_Q14`), Definite Integrals (`\int x^n dx`, `\int e^{-ax} dx`, `2025_FN_Q58`, `2025_AN_Q65`) & Quadratic Inequalities (`2019_FN_Q55`).
   - **Syllabus line:** Prerequisite for all 4 lines of `Probability and Statistics`.
   - **How often GATE asks it:** Used across almost every PYQ (`2025_FN_Q58`, `2024_AN_Q33`, `2019_FN_Q16`, `2019_FN_Q55`; exact standalone count: not sure).
   - **Typical question type:** MCQ/NAT (integrals on PDFs, counting probabilities).
   - **Zero-level prerequisite:** Basic arithmetic & high-school polynomials.

2. **Chapter 01: Probability, Conditional Probability, Independence & Bayes (`18` marks in bank!)**
   - **Sub-topics:** Kolmogorov Axioms, Inclusion-Exclusion, `P(A ∩ B^c)` (`2024_FN_Q14`); Conditional Probability (`shrinking sample space`, `2026_AN_Q63`, `2024_FN_Q46`, `2017_AN_Q37`), Chain Rule; **Mutually Exclusive vs Independent**, Pairwise vs Mutual Independence (`2024_FN_Q34`, `2023_FN_Q53`); **Sampling With/Without Replacement & Polya's Urn Symmetry (`2026_FN_Q11`, `2021_AN_Q40`)**; Repeated Infinite Waiting Trials (`2018_FN_Q25`); **Law of Total Probability & Bayes' Joint-Table/Tree Method (`2025_FN_Q32`, `2021_FN_Q57`, `2018_FN_Q54`)**.
   - **Syllabus line:** `Conditional probability and Bayes theorem`.
   - **How often GATE asks it:** Very frequently (`Part B.3`: `11` Qs / `18` marks across 7/10 years; exact future rate: not sure).
   - **Typical question type:** NAT/MCQ/MSQ (Bayes updating, coin/urn conditional probabilities, independence truths, `k`-th trial win).
   - **Zero-level prerequisite:** Ch 00.

3. **Chapter 02: Random Variables, Expectation, Variance & Covariance (`19` marks in bank!)**
   - **Sub-topics:** Discrete (`PMF`) vs Continuous (`PDF` normalization & interval area, `2025_FN_Q58`, `P(X=c)=0`) vs Mixed (`max(X, 0)` CDF, `2017_FN_Q14`); **Joint PMF/PDF, Marginals & Independence**; Geometric `1×1` square probabilities; **Expectation $E[X]$ (`2026_FN_Q58`), Linearity $E[X+Y]$ vs $E[XY]$ (`2024_AN_Q52`), Tail-Sum, Indicators & Symmetry (`2020_FN_Q50`, `2019_FN_Q53`)**; **Conditional Expectation & Optimal Strategy (`2025_AN_Q65`, `2021_AN_Q24`)**; **Variance `E[X^2]-(E[X])^2`, `Var(aX+b)`, `Var(X±Y)` (`2017_AN_Q52`)**; **Covariance, Correlation (`|\rho| <= 1` Cauchy-Schwarz, `Cov=0 != Indep`, `2021_FN_Q12`)**; **PGFs (`g'(1) = E[X]`, `2017_AN_Q44`)**; Markov/Chebyshev (`[LATER]`).
   - **Syllabus line:** `Random variables` & `Mean, median, mode and standard deviation`.
   - **How often GATE asks it:** Highest weight in Probability (`Part B.3`: `11` Qs / `19` marks across 7/10 years — `6` Hard Qs!); exact subtopic split: not sure.
   - **Typical question type:** NAT/MCQ (expectation, variance, covariance/Cauchy-Schwarz, tree/stick/polynomial expectations, PGF).
   - **Zero-level prerequisite:** Ch 00 + Ch 01.

4. **Chapter 03: Mean, Median, Mode, Standard Deviation & Descriptive Statistics** *(Moved BEFORE Distributions!)*
   - **Sub-topics:** Raw & Grouped **Mean, Median (`F(m) = 0.5`), Mode (`\arg\max f(x)`)**; Sample (`n-1`) vs Population (`n`) Variance/SD; **Skewness (`Mean - Mode = 3(Mean - Median)`)**; **Change of Origin & Scale**; Combined Mean & Variance of 2 groups; Median of Clipped/Mixed distributions (`2017_FN_Q14`).
   - **Syllabus line:** `Mean, median, mode and standard deviation`.
   - **How often GATE asks it:** Tested inside RV/Distribution questions (`2026_FN_Q58`, `2021_AN_Q15`, `2017_FN_Q14`) and General Aptitude overlap (exact standalone CS count: not sure).
   - **Typical question type:** NAT/MCQ (median of `max(X, 0)`, SD, skewness relation, combined mean/SD).
   - **Zero-level prerequisite:** Ch 02 (Expectation & Variance).

5. **Chapter 04: Standard Discrete & Continuous Distributions (`14` marks in bank!)**
   - **Sub-topics:**
     - **Discrete:** **Bernoulli & Binomial (`np`, `npq`, `\sqrt{npq}`, `2025_FN_Q56`, `2021_AN_Q15`, `2017_AN_Q44`)**; **Poisson (`e^{-\lambda}\lambda^k/k!`, `Mean = Var = \lambda`, `Bin->Pois`, `2017_AN_Q52`)**; **Geometric (`(1-p)^{k-1} p`, `1/p`, memoryless, `2018_FN_Q25`)**; Additive closure of independent Binomials & Poissons.
     - **Continuous:** **Uniform `U(a, b)` (`1/(b-a)`, interval ratio `2025_AN_Q65`, `2019_FN_Q55`)**; **Exponential (`\lambda e^{-\lambda x}`, `1/\lambda`, `P(X > 1/\lambda) = e^{-1}`, Memoryless, `2021_FN_Q32`)**; **Normal / Gaussian (`N(\mu, \sigma^2)`, PDF matching `2026_AN_Q14`, `Z = (X-\mu)/\sigma`, `68-95-99.7%` symmetry, sums `aX ± bY`, `2017_FN_Q14`)**.
   - **Syllabus line:** `Uniform, normal, exponential, Poisson and binomial distributions`.
   - **How often GATE asks it:** Regularly (`Part B.3`: `6 + 3 = 9` Qs / `14` marks across 8 years; exact per-distribution count: not sure).
   - **Typical question type:** NAT/MCQ (identify Normal PDF, binomial/Poisson E/SD, uniform quadratic/interval prob, exponential survival, clipped normal median).
   - **Zero-level prerequisite:** Ch 02 & Ch 03.

---

## PART 4. THE DIAGRAMS I NEED

*(Ordered logically: Ch 00 Basics -> Ch 01 Conditional & Bayes -> Ch 02 Random Variables -> Ch 03 Mean, Median, Mode & SD -> Ch 04 Standard Distributions!)*

### Ch 00 · Counting Probability, Set Algebra & Calculus Warm-Up
1. **`6 × 6` Two-Dice Grid (`36` Equal Pairs) & Integration Area Picture**
   - *What to draw:* Left: `6 × 6` square of ordered pairs `(1,1)..(6,6)` highlighting ties `(1,1)..(6,6)` (`6/36 = 1/6`) vs non-ties (`30/36 = 5/6`, `2018_FN_Q25`). Right: Parabola `y = C x^2` from `1` to `4` with region `[2, 3]` shaded as probability (`2025_FN_Q58`).
   - *What to notice:* Two dice ALWAYS have `36` equally likely pairs (even if identical-looking!), and for continuous RVs, **Area = Probability**!
   - *Format:* **Single picture**

### Ch 01 · Probability, Conditional Probability & Bayes
2. **2-Circle Venn Diagram (`A∩B`, `A∩B^c`, `A^c∩B^c`) & Mutually Exclusive vs Independent Contrast (`2024_FN_Q14`, `2023_FN_Q53`)**
   - *What to draw:* Top: Venn diagram of `P(A)=0.3, P(B)=0.5, P(A∩B)=0.1` labelling all 4 exact disjoint pieces (`0.2, 0.1, 0.4, 0.3`, `2024_FN_Q14`). Bottom: Two disjoint circles (`Mutually Exclusive -> P(A∩B)=0`) next to two overlapping circles whose ratio inside `B` matches the whole box (`Independent -> P(A|B) = P(A)`!).
   - *What to notice:* Why two non-empty disjoint events can NEVER be independent (`knowing B happened drops A's chance to 0%`)!
   - *Format:* **Single picture**
3. **Polya's Urn Branching Tree (`2026_FN_Q11`, `2021_AN_Q40`) & Overlap-Coin Bridge (`2026_AN_Q63`)**
   - *What to draw:* Left: 2-step tree starting `(1R, 1B)` -> `(2R, 1B)` / `(1R, 2B)` -> `2R, 2B` highlighting `1/2 × 1/3 + 1/2 × 1/3 = 1/3` (`2026_FN_Q11`). Right: 6 coin slots `[1][2][3][4][5][6]` with green bracket `E2` (`{1,2,3,5}`) and blue bracket `E1` (`{2,4,6}`) overlapping ONLY at slot `[2]` (`2026_AN_Q63`)!
   - *What to notice:* Multiply along one branch (`AND`), add separate branches (`OR`), and isolate overlapping trials when computing `P(E1 | E2)`!
   - *Format:* **Step-by-step series of pictures**
4. **Bayes Joint-Probability Table & Channel Graph (`2025_FN_Q32`, `2021_FN_Q57`, `2018_FN_Q54`)**
   - *What to draw:* Probability Tree (`G -> D`, `Fair/Fake -> HH`, `Sender H/L -> Rec H/L`) transformed straight into a clean Joint Table (`0.08, 0.05, 0.003 -> col sum 0.133`), circling the wanted cell divided by the column sum!
   - *What to notice:* Turning conditional percentages into a Joint Probability Table makes Bayes' formula effortless (`cell / row-or-col total`)!
   - *Format:* **Trace table** + **Single picture**

### Ch 02 · Random Variables, Expectation, Variance & Covariance
5. **Discrete PMF Bars vs Continuous PDF Curve vs Mixed CDF Jump (`2025_FN_Q58`, `2017_FN_Q14`)**
   - *What to draw:* Three graphs side-by-side: (1) Discrete PMF spikes summing to `1` (`2026_FN_Q58`); (2) Continuous PDF curve whose *total area* = `1` (`single point P(X=2) = 0`); (3) Mixed `Y = max(X, 0)` CDF jumping from `0 -> 0.5` at `y = 0` then climbing smoothly (`2017_FN_Q14`).
   - *What to notice:* Continuous `f(x)` is height density (not probability!), and point-mass discontinuities show up as vertical steps in `F(y)`!
   - *Format:* **Single picture**
6. **1×1 Unit Square (`Joint Uniform`) & Uniform Stick-Cut Expectation (`2025_AN_Q65`)**
   - *What to draw:* Left: `1×1` square shading `x < y` or `|x - y| <= 0.5`. Right: `[0, 1]` stick marked at `0.4` showing two cases: `U < 0.4` (`0.4` sits in `(U, 1)` of length `1 - U`) vs `U > 0.4` (`0.4` sits in `(0, U)` of length `U`)!
   - *What to notice:* Why `0.4` usually lands in the *longer* piece (expected length `0.74 > 0.5`, `2025_AN_Q65`)!
   - *Format:* **Single picture**
7. **Binary Tree Distance Map (`2019_FN_Q53`) & Covariance Scatter Plots (`2021_FN_Q12`)**
   - *What to draw:* Left: 8-leaf full binary tree with distances from leaf `a = 1` stamped right onto all 8 leaves (`0, 2, 4, 4, 6, 6, 6, 6` -> avg `4.25`, `2019_FN_Q53`). Right: 4 tiny scatter plots (`+` Cov, `-` Cov, `0` Cov Independent, and `Y = X^2` `0` Cov Dependent!) + Cauchy-Schwarz angle bar `|\rho| <= 1` (`2021_FN_Q12`)!
   - *What to notice:* Tree symmetry cuts 64 pairs down to 8 numbers, and `Cov = 0` does NOT imply independence!
   - *Format:* **Single picture**

### Ch 03 · Mean, Median, Mode & Standard Deviation
8. **Symmetric vs Right/Left Skewed Curves & Origin/Scale Shift Picture**
   - *What to draw:* Three bell/skewed curves placing `Mean`, `Median` (`50%-50%` area divider!), and `Mode` (`highest peak!`), plus a number-line box shifting `[2, 4, 6]` by `+10` (`Mean + 10, SD unchanged!`) and scaling by `× 3` (`Mean × 3, SD × 3!`).
   - *What to notice:* Shifting data moves Mean/Median/Mode yet leaves SD untouched; scaling multiplies SD by `|a|` (`and Variance by a^2`)!
   - *Format:* **Single picture**

### Ch 04 · Standard Distributions (`Binomial, Poisson, Geometric, Uniform, Exponential, Normal`)
9. **The 6 Distribution Cards (`PMF/PDF Shape, Mean, Variance, Memoryless/Key Fact`)**
   - *What to draw:* Six compact visual cards:
     - `Binomial(n, p)`: Bell-ish bars (`np`, `npq`, `2021_AN_Q15`).
     - `Poisson(\lambda)`: Skewed count bars (`\lambda`, `\lambda`, `2017_AN_Q52`).
     - `Geometric(p)`: Decaying staircase (`1/p`, memoryless, `2018_FN_Q25`).
     - `Uniform(a, b)`: Flat rectangle (`1/(b-a)`, `(a+b)/2`, `2019_FN_Q55`).
     - `Exponential(\lambda)`: Decaying curve marking `1/\lambda` with **`e^{-1} \approx 0.368` area to the right** (`2021_FN_Q32`)!
     - `Normal(\mu, \sigma^2)`: Bell curve with `68% / 95% / 99.7%` zones + `2026_AN_Q14` PDF matching overlay (`\sigma = 3`)!
   - *What to notice:* Seeing the 6 shapes side-by-side makes parameters, variances, and `P(X > 1/\lambda) = e^{-1}` unforgettable!
   - *Format:* **CHEATPIC**

---

## PART 5. THE FULL PLAN, CHAPTER BY CHAPTER

*(Reordered logically for a zero-level student: Ch 00 Basics & Calculus -> Ch 01 Conditional Probability & Bayes -> Ch 02 Random Variables, Expectation, Variance & Covariance -> Ch 03 Mean, Median, Mode & Data Statistics -> Ch 04 Standard Distributions. Starting with Chapters 00 and 01 below!)*

### Chapter 00 · Counting Probability, Set Algebra & Calculus Warm-Up *(New Prerequisite Chapter)*

#### Lesson 00.1 · Sample Spaces, Counting Probability, Set Algebra & Basic PDF Calculus
- **Tag:** `[MUST]` — Zero-level readers get stuck immediately on `36`-dice grids (`2018_FN_Q25`, `2024_AN_Q33`), Venn sets (`2024_FN_Q14`), and basic PDF integrals (`2025_FN_Q58`, `2025_AN_Q65`) without this warm-up.
- **Estimated reading time:** 55 minutes.
- **Prerequisites:** Basic arithmetic & DM Ch 07 (`n!`, `\binom{n}{k}`).
- **Beginner must-see:** Probability is just **"Desired Count ÷ Total Equally-Likely Count"** (for finite games) or **"Desired Area ÷ Total Area"** (for continuous intervals)! Two things trip beginners every time: (1) Two identical dice STILL have **`36` equally likely pairs** (never `21`!), and (2) Integrating $x^2$ or $e^{-\lambda x}$ over `[a, b]` is literally measuring that shaded area!
- **Finer points:**
  - Sample spaces, Events, Equally likely `36`-pair dice table (`2018_FN_Q25`), 6 distinct dice $6!/6^6$ (`2024_AN_Q33`), unsigned 4-bit MSB `{1..7}` vs `{8..13}` (`2019_FN_Q16`).
  - Event Set Algebra: `A ∪ B`, `A ∩ B^c = A - (A ∩ B)`, De Morgan `(A ∪ B)^c = A^c ∩ B^c` (`2024_FN_Q14`).
  - **PDF Calculus Refresher (`2025_FN_Q58`, `2025_AN_Q65`, `2021_FN_Q32`):** $\int_a^b x^k dx = \frac{b^{k+1}-a^{k+1}}{k+1}$, $\int_a^\infty \lambda e^{-\lambda x} dx = e^{-\lambda a}$, quadratic inequalities `Y^2 - Y - 2 >= 0` (`2019_FN_Q55`).
  - NAT formatting & intermediate precision rule.
- **GATE-level items:** Rolling 6 distinct dice (`2024_AN_Q33`: `5/324`), binary MSB match (`2019_FN_Q16`: `85/169`), and basic polynomial PDF integration (`2025_FN_Q58`).
- **Diagrams needed:** `MATRIX` (`6 × 6` two-dice equally likely grid); `GRAPHPIC` (Shaded `Cx^2` curve `[1, 4]` & `[2, 3]`, `2025_FN_Q58`).
- **Hand traces:** Computing `6! / 6^6` (`2024_AN_Q33`), `85 / 169` (`2019_FN_Q16`), and `\int_1^4 Cx^2 dx = 1` (`2025_FN_Q58`).
- **Common mistakes:** Using `21` unordered outcomes for two identical dice (`2018_FN_Q25`); forgetting `4/6` vs `6/13` counts in `2019_FN_Q16`; rounding too early in multi-step NATs.

---

### Chapter 01 · Probability, Conditional Probability and Bayes

#### Lesson 01.1 · Axioms, Conditional Probability, Independence & Repeated Trials (`Polya's Urn`)
- **Tag:** `[MUST]` — Core of `18`-mark Conditional Probability bucket (`2026_FN_Q11`, `2026_AN_Q63`, `2024_FN_Q34`, `2024_FN_Q14`, `2024_FN_Q46`, `2023_FN_Q53`, `2021_AN_Q40`, `2018_FN_Q25`, `2017_AN_Q37`).
- **Estimated reading time:** 85 minutes.
- **Prerequisites:** Lesson 00.1.
- **Beginner must-see:** **Conditional Probability `P(A | B)`** just shrinks your universe down to circle `B` (`"given B happened, what fraction of B is also inside A?"`)! Never confuse **Mutually Exclusive** (A and B *cannot* coexist -> disjoint circles!) with **Independent** (knowing B gives *zero* hint about A -> `P(A | B) = P(A)`, `2023_FN_Q53`)!
- **Finer points:**
  - Kolmogorov Axioms, Inclusion-Exclusion, `P(A ∩ B^c)`, `P(A^c ∩ B^c)` (`2024_FN_Q14`), `P(A^c | B^c)` (`2017_AN_Q37`).
  - **Independence vs Mutually Exclusive (`2024_FN_Q34`, `2023_FN_Q53`):** Pairwise vs Mutual independence; why positive disjoint events are ALWAYS dependent; flipping to complements (`A, B` ind => `A^c, B^c` ind).
  - **Overlapping Trial Sets (`2026_AN_Q63`):** Conditioning on shared toss #2 using Total Probability (`1/2 · 3/4 + 1/2 · 1/4 = 0.5`).
  - **Without Replacement (`2024_FN_Q46`) & Polya's Urn Symmetry (`2026_FN_Q11`, `2021_AN_Q40`):** Unconditional `k`-th draw = `r / (r + b)` ALWAYS (`2021_AN_Q40`)!
  - **Infinite Repeated Trials (`2018_FN_Q25`):** `(tie)^(k-1) × (win)` = `(1/6)^2 (5/6)` on 3rd trial!
- **GATE-level items:** Venn set MSQs (`2024_FN_Q14`), conditional `P(P^c | Q^c)` (`2017_AN_Q37`: `4/5`), coin-toss overlap (`2026_AN_Q63`: `0.5`), permutation independence (`2024_FN_Q34`), Polya's Urn (`2026_FN_Q11`: `1/3`, `2021_AN_Q40`: `r/(r+b)`), and 3rd-trial dice win (`2018_FN_Q25`).
- **Diagrams needed:** `GRAPHPIC` (Venn `2024_FN_Q14` + Mutually Exclusive vs Independent visual + zoomed-in `P(A | B)` universe); `TREE` (Polya's Urn 2-step tree, `2026_FN_Q11`); `ARRAY` (6 coin slots isolating overlap at `[2]`, `2026_AN_Q63`).
- **Hand traces:** Tracing `2026_FN_Q11` (`1/3`), `2026_AN_Q63` (`0.5`), `2017_AN_Q37` (`4/5`), `2021_AN_Q40` (induction at trial 2 & 3 -> `r/(r+b)`), and `2018_FN_Q25` (`5/216 = 0.023`).
- **Common mistakes:** Equating Mutually Exclusive with Independent (`2024_FN_Q34(A)`!); dividing `P(A ∩ B)` by `P(A)` instead of `P(B)` in `P(A | B)`; assuming Polya's Urn changes unconditional odds at draw 4 (`2021_AN_Q40(B, C)`!).

#### Lesson 01.2 · Law of Total Probability & Bayes' Theorem (Tree & Joint-Table Method)
- **Tag:** `[MUST]` — Very consistent 1–2 mark score (`2025_FN_Q32`, `2021_FN_Q57`, `2018_FN_Q54`).
- **Estimated reading time:** 60 minutes.
- **Prerequisites:** Lesson 01.1.
- **Beginner must-see:** **Bayes' Theorem** simply reverses cause and effect: *"I already know how likely a fake coin is to show Heads (`Forward`), so if I just saw TWO Heads, how likely is it that the coin was fake (`Backward`)?"* Instead of memorizing symbols, turn the problem into a **2-Step Tree or Joint Table** and compute **`Wanted Branch ÷ Sum of ALL Branches matching the evidence`**!
- **Finer points:**
  - **Partition & Law of Total Probability:** $P(E) = \sum P(H_i) P(E \mid H_i)$.
  - **Bayes via Probability Tree (`2025_FN_Q32`, `2021_FN_Q57`) & Joint Probability Grid (`2018_FN_Q54`):** Verifying row-sums = `1` in conditional tables so `P(D | G)` isn't confused with `P(G | D)`!
  - Posterior updating across 2 independent tosses (`P(HH | Fair) = 1/4`, `P(HH | Fake) = 1`, `2025_FN_Q32`).
- **GATE-level items:** Fake coin Bayes (`2025_FN_Q32`: `0.50`), binary noisy channel Bayes (`2021_FN_Q57`: `0.04`), and multi-row weather table Bayes (`2018_FN_Q54`: `0.60`).
- **Diagrams needed:** `TREE` (Branching tree for `2025_FN_Q32` & `2021_FN_Q57`); `MATRIX` (`3 × 3` Conditional Table converted to Joint Probabilities `0.08, 0.05, 0.003` for `2018_FN_Q54`).
- **Hand traces:** Tracing `2025_FN_Q32` (`(1/5)/(2/5) = 0.50`), `2018_FN_Q54` (`0.08 / 0.133 = 0.6015`), and `2021_FN_Q57`.
- **Common mistakes:** Using `P(H | Fair) = 0.5` instead of `P(HH | Fair) = 0.25` for TWO tosses in `2025_FN_Q32`!; forgetting to multiply by the prior (`0.2, 0.5, 0.3` in `2018_FN_Q54`!); reversing `P(D | G)` and `P(G | D)`!

---

`CONTINUE FROM CHAPTER 02`
## PART 5 (Continued) · Chapters 02, 03, and 04

### Chapter 02 · Random Variables, Expectation, Variance and Covariance

#### Lesson 02.1 · Discrete (`PMF`), Continuous (`PDF`), Mixed (`CDF`) & Joint Random Variables
- **Tag:** `[MUST]` — Foundation for `11`-Q RV bucket (`2025_FN_Q58`, `2017_FN_Q14` CDF).
- **Estimated reading time:** 70 minutes.
- **Prerequisites:** Lesson 00.1 (Integration), Lesson 01.1.
- **Beginner must-see:** A **Random Variable (`X`)** just turns messy outcomes (like `"Head, Tail, Head"`) into plain numbers (`"# of Heads = 2"`)! For **Discrete** `X`, probabilities are bar heights adding to `1`; for **Continuous** `X`, probabilities are **areas under a curve** adding to `1` (meaning the probability at any ONE exact dot `X = 2.0` is `0`!)!
- **Finer points:**
  - **PMF ($\sum p(x) = 1$) vs PDF ($\int f(x)\,dx = 1$, $f(x) \ge 0$ — `f(x)` CAN exceed `1`!) vs CDF ($F(x) = P(X \le x)$ non-decreasing, right-continuous, `0 -> 1`).**
  - **Normalization & Interval Integration (`2025_FN_Q58`):** Solving $\int C x^2 dx = 1 \implies C = 1/21$, then $P(2 \le X \le 3) = 19/63$.
  - **Mixed Continuous + Point Mass (`2017_FN_Q14`):** `Y = max(X, 0)` puts `0.5` discrete jump at `0` plus continuous half-normal tail -> reading `F_Y(y)` jump!
  - **Joint PMF/PDF, Marginals & Testing Independence ($f_{XY}(x,y) = f_X(x) f_Y(y)$) + `1×1` Square Geometric Probabilities.**
- **GATE-level items:** Finding constant `C` and interval prob (`2025_FN_Q58`: `0.302`), mixed CDF of `max(X, 0)` (`2017_FN_Q14`), and 2-D joint probabilities.
- **Diagrams needed:** `COMPARE` (Discrete PMF Bars vs Continuous PDF Curve vs Mixed `max(X,0)` Jump CDF `2017_FN_Q14`); `MATRIX` (`2×3` Joint PMF table + `1×1` square region).
- **Hand traces:** Tracing `2025_FN_Q58` (`C = 1/21 -> 19/63`), sketching `F_Y(y)` of `2017_FN_Q14`, and testing independence on a `2×2` Joint PMF.
- **Common mistakes:** Thinking `f(x) <= 1` must hold for a continuous PDF (`U(0, 0.5)` has `f(x) = 2`!); treating `P(X <= 3)` differently from `P(X < 3)` for a purely continuous RV (they are equal; ONLY discrete/mixed differ!).

#### Lesson 02.2 · Expectation, Conditional Expectation, Variance, Covariance & PGFs
- **Tag:** `[MUST]` — Highest 2-mark Hard/Med concentration in Probability (`2026_FN_Q58`, `2025_AN_Q64`, `2025_AN_Q65`, `2024_AN_Q52`, `2021_AN_Q24`, `2021_FN_Q12`, `2020_FN_Q50`, `2019_FN_Q53`, `2017_AN_Q44`, `2017_AN_Q52`).
- **Estimated reading time:** 90 minutes.
- **Prerequisites:** Lesson 02.1.
- **Beginner must-see:** **Expectation (`E[X]`)** is the long-run average balance point of a distribution; **Variance (`Var(X)`)** measures how wildly values scatter around that balance point (`E[X^2] - (E[X])^2`)! Remember TWO iron laws: **`E[X + Y] = E[X] + E[Y]` ALWAYS holds (even for dependent variables!)**, whereas **`E[XY] = E[X]E[Y]` requires Independence** (`2024_AN_Q52`)!
- **Finer points:**
  - **Expectation (`E[X]` & `E[g(X)]`, `2026_FN_Q58`):** Discrete $\sum x p(x)$ vs Continuous $\int x f(x)\,dx$; Tail-Sum formula; Indicator RVs & Symmetry (`2019_FN_Q53`: `4.25`, `2020_FN_Q50`: `0.5`).
  - **Linearity vs Product Traps (`2024_AN_Q52`):** For $x, y \in [0, 1]$, `xy <= x => E[xy] <= E[x]` (`2024_AN_Q52(D)`), while `E[xy]` vs `E[x]E[y]` can go either way!
  - **Conditional Expectation & Expected-Payoff Decision Trees (`2025_AN_Q65`, `2021_AN_Q24`):** Law of Total Expectation (`\int_0^{0.4}(1-u)du + \int_{0.4}^1 u\,du = 0.74`, `2025_AN_Q65`); `A -> B` (`16`) vs `B -> A` (`14`) (`2021_AN_Q24`).
  - **Variance (`Var(X) = E[X^2] - (E[X])^2`, `2017_AN_Q52`):** `E[X^2] = Var + E^2`; `Var(aX + b) = a^2 Var(X)`; `Var(X ± Y) = Var(X) + Var(Y) ± 2 Cov(X, Y)`.
  - **Covariance, Correlation & Cauchy-Schwarz (`2021_FN_Q12`):** `Cov(X, Y) = E[XY] - E[X]E[Y]`, `|\rho| <= 1` => `(Cov(X,Y))^2 <= Var(X)Var(Y)`, `Cov = 0` ≠ Independent!
  - **Probability Generating Functions (`PGF`, `2017_AN_Q44`):** $g_X(z) = E[z^X]$, **$E[X] = g_X'(1)$** (`(1-\beta+\beta z)^N` -> `N\beta`); Chebyshev/Markov (`[LATER]`).
- **GATE-level items:** Discrete `E[X]` (`2026_FN_Q58`: `4.25`), `xy <= x` expectation (`2024_AN_Q52`), broken stick expectation (`2025_AN_Q65`: `0.74`), optimal attempt order (`2021_AN_Q24`: `16`), Cauchy-Schwarz covariance (`2021_FN_Q12`), tree leaf distance (`2019_FN_Q53`: `4.25`), PGF mean (`2017_AN_Q44`: `N\beta`), and `E[(X+2)^2]` (`2017_AN_Q52`: `54`).
- **Diagrams needed:** `TREE` (Decision trees for `2021_AN_Q24` & 8-leaf distances `2019_FN_Q53`); `ARRAY` (`[0, 1]` stick cut at `U < 0.4` vs `U > 0.4`, `2025_AN_Q65`); `GRAPHPIC` (Covariance sign scatter plots + `Y = X^2` `Cov=0` dependent trap, `2021_FN_Q12`).
- **Hand traces:** Tracing `2026_FN_Q58` (`4.25`), `2025_AN_Q65` (`0.74`), `2021_AN_Q24` (`16 vs 14`), `2019_FN_Q53` (`34/8 = 4.25`), `2017_AN_Q44` (`g'(1)`), and `2017_AN_Q52` (`54`).
- **Common mistakes:** Using `E[XY] = E[X]E[Y]` when variables aren't independent (`2024_AN_Q52(A)`!); computing `E[X^2] = (E[X])^2` (forgetting `+ Var(X)` in `2017_AN_Q52` gives `49` instead of `54`!); forgetting `E[(X - \mu_X)(Y - \mu_Y)]` keeps signs (no absolute values, `2021_FN_Q12(S2)`!).

---

### Chapter 03 · Mean, Median, Mode and Standard Deviation *(Moved Before Distributions!)*

#### Lesson 03.1 · Descriptive Statistics: Mean, Median, Mode, Variance/SD, Skewness & Transformations
- **Tag:** `[MUST]` — Direct GATE syllabus line, required right before Normal/Exponential/Binomial parameters (`2017_FN_Q14` median + standard data stats).
- **Estimated reading time:** 55 minutes.
- **Prerequisites:** Lesson 02.2.
- **Beginner must-see:** When someone hands you a raw list of marks (or a probability curve), **Mean** is the center of gravity, **Median** is the exact `50%-50%` middle cut (`F(m) = 0.5`), **Mode** is the tallest peak (`most popular`), and **Standard Deviation (`\sigma`)** is the average distance from the Mean! Shifting every student's marks by `+5` shifts Mean/Median/Mode by `+5`, yet changes Spread (`SD`) by **`0`**!
- **Finer points:**
  - **Raw & Grouped Data Formulas:** Arithmetic Mean, Odd/Even Median, Grouped Median interpolation, Mode (`Mode ≈ 3·Median - 2·Mean`), Population (`÷ n`) vs Sample (`÷ (n-1)`) Variance.
  - **Continuous & Mixed Distribution Medians/Modes (`2017_FN_Q14`):** Median solves $P(X \le m) \ge 0.5$ and $P(X \ge m) \ge 0.5$ (`Y = max(X, 0)` -> `m = 0.0`!); Mode maximizes `f(x)` (`Mode of Exp(\lambda)` is `0`!).
  - **Change of Origin & Scale:** $Y = aX + b \implies \mu_Y = a\mu_X + b$, $\text{SD}(Y) = |a|\,\text{SD}(X)$!
  - **Skewness & Combined 2-Group Mean/Variance.**
- **GATE-level items:** Median of `max(X, 0)` (`2017_FN_Q14`: `0.0`), origin/scale effects on SD vs Mean, empirical `Mode = 3·Median - 2·Mean`, and combined Mean/Variance.
- **Diagrams needed:** `COMPARE` (Symmetric vs Right-Skewed `Mean > Median > Mode` vs Left-Skewed `Mean < Median < Mode` + Origin Shift `+10` vs Scale `×3` visual).
- **Hand traces:** Computing Mean, Median, Mode, and SD on `[2, 4, 4, 6, 14]`; solving `F(m) = 0.5` on `f(x) = 2x` (`[0, 1]`) and `Y = max(X, 0)` (`2017_FN_Q14`).
- **Common mistakes:** Changing SD when a constant `+b` is added to every data point; forgetting `|a|` (writing negative SD when `a < 0`); computing median of `max(X, 0)` as `E[Y] = \sigma/\sqrt{2\pi}` instead of `0.0` (`2017_FN_Q14`!).

---

### Chapter 04 · Standard Distributions (`Uniform, Normal, Exponential, Poisson, Binomial, Geometric`)

#### Lesson 04.1 · Discrete Distributions (`Bernoulli`, `Binomial`, `Poisson`, `Geometric`)
- **Tag:** `[MUST]` — High-ROI formulas (`2025_FN_Q56`, `2021_AN_Q15`, `2018_FN_Q25`, `2017_AN_Q44`, `2017_AN_Q52`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 02.2, Lesson 03.1.
- **Beginner must-see:** Don't reinvent formulas for every coin/bit problem! Three discrete templates cover almost everything: **Binomial (`n` fixed trials, count successes)**, **Geometric (keep trying until FIRST success, `2018_FN_Q25`)**, and **Poisson (count random events arriving in a fixed hour, where `Mean = Variance = \lambda`, `2017_AN_Q52`)**!
- **Finer points:**
  - **Bernoulli($p$) & Binomial($n, p$):** PMF $\binom{n}{k} p^k q^{n-k}$, Mean $np$, Var $npq$, **SD $\sqrt{npq}$** (`2021_AN_Q15`: `15.49`), PGF `(q + pz)^n` (`2017_AN_Q44`), `0`-error transmission `0.99^5` (`2025_FN_Q56`), sum of independent `Bin(n_1, p) + Bin(n_2, p)`.
  - **Poisson($\lambda$):** PMF $e^{-\lambda}\lambda^k / k!$, **Mean = Variance = $\lambda$** (`2017_AN_Q52`: `54`), Poisson approximation (`np = \lambda` when `n` huge, `p` tiny), sum of independent `Pois(\lambda_1 + \lambda_2)`.
  - **Geometric($p$):** `P(X = k) = (1-p)^{k-1} p` (`1st` success on trial `k`, `2018_FN_Q25`), Mean `1/p`, Var `(1-p)/p^2`, **Memoryless Property**.
- **GATE-level items:** Binomial error-free bits (`2025_FN_Q56`: `0.951`), Binomial SD (`2021_AN_Q15`: `15.49`), Binomial PGF (`2017_AN_Q44`: `N\beta`), Poisson `E[(X+2)^2]` (`2017_AN_Q52`: `54`), and Geometric 3rd-trial win (`2018_FN_Q25`: `0.023`).
- **Diagrams needed:** `CHEATPIC` (3 Discrete Distribution Cards: `Binomial`, `Poisson`, `Geometric` showing PMF bar shapes, Mean, Variance, SD, PGF).
- **Hand traces:** Tracing `2025_FN_Q56` (`0.99^5`), `2021_AN_Q15` (`\sqrt{240}`), `2017_AN_Q52` (`30 + 20 + 4`), and `2018_FN_Q25` (`5/216`).
- **Common mistakes:** Giving SD = `npq = 240` instead of `\sqrt{npq} = 15.49` (`2021_AN_Q15`!); mixing up Binomial (`fixed n trials`) with Geometric (`trials until 1st win`, `2018_FN_Q25`).

#### Lesson 04.2 · Continuous Distributions (`Uniform`, `Exponential`, `Normal / Gaussian`)
- **Tag:** `[MUST]` — Core continuous distributions (`2026_AN_Q14`, `2025_AN_Q65`, `2021_FN_Q32`, `2019_FN_Q55`, `2017_FN_Q14`).
- **Estimated reading time:** 75 minutes.
- **Prerequisites:** Lesson 02.2, Lesson 03.1.
- **Beginner must-see:** Three continuous curves run the real world: **Uniform `U(a, b)`** (every spot equally likely — probability is just sub-interval length ÷ total length, `2019_FN_Q55`!), **Exponential($\lambda$)** (waiting time until next arrival — forgets how long you already waited, and `P(X > Mean) = e^{-1} = 0.368` ALWAYS! `2021_FN_Q32`), and **Normal / Gaussian** (the symmetric Bell Curve where matching `exp(-(x-\mu)^2 / (2\sigma^2))` reveals $\mu$ and $\sigma$ immediately, `2026_AN_Q14`)!
- **Finer points:**
  - **Continuous Uniform $U(a, b)$:** `f(x) = 1/(b-a)`, `E = (a+b)/2`, `Var = (b-a)^2/12`, algebraic interval mapping (`2019_FN_Q55`: `[2, 6)` inside `(1, 6)` = `0.8`; `2025_AN_Q65`: `0.74`).
  - **Exponential($\lambda$):** `f(x) = \lambda e^{-\lambda x}`, `P(X > t) = e^{-\lambda t}`, `E[X] = 1/\lambda`, `Var = 1/\lambda^2`, **`P(X > 1/\lambda) = e^{-1} \approx 0.368`** (`2021_FN_Q32`), Memoryless property, link to Poisson arrivals.
  - **Normal / Gaussian $N(\mu, \sigma^2)$:**
    - Pattern-matching PDF (`2026_AN_Q14`: `1/(3\sqrt{2\pi}) e^{-x^2/18}` -> `\mu=0, \sigma=3`).
    - Standard Normal $Z = (X - \mu)/\sigma$ (`ALWAYS divide by \sigma, NOT \sigma^2`!), `68-95-99.7%` symmetry, `P(X > \mu) = 0.5` (`2017_FN_Q14`), independent sum $aX \pm bY \sim N(a\mu_1 \pm b\mu_2, a^2\sigma_1^2 + b^2\sigma_2^2)$.
- **GATE-level items:** Identifying Normal PDF (`2026_AN_Q14`), Exponential `P(X > E[X])` (`2021_FN_Q32`: `0.37`), Uniform quadratic real-root probability (`2019_FN_Q55`: `0.8`), Uniform cut stick (`2025_AN_Q65`: `0.74`), and Gaussian `max(X, 0)` median (`2017_FN_Q14`: `0.0`).
- **Diagrams needed:** `CHEATPIC` (3 Continuous Cards: `Uniform` rectangle, `Exponential` decay marking `1/\lambda` & `0.368`, `Normal` bell with `68-95-99.7%` + `2026_AN_Q14` parameter match overlay).
- **Hand traces:** Tracing `2026_AN_Q14` (`\sigma=3`), `2021_FN_Q32` (`e^{-1} = 0.368`), `2019_FN_Q55` (`4/5 = 0.8`), and `2017_FN_Q14` (`0.0`).
- **Common mistakes:** Using `1 - e^{-1} = 0.632` instead of `e^{-1} = 0.368` when asked *"exceeds expected lifetime"* (`2021_FN_Q32`!); dividing by variance $\sigma^2$ instead of $\sigma$ when standardizing `Z`; including `(1, 2)` when solving `(Y-2)(Y+1) >= 0` (`2019_FN_Q55`!).

---

## PART 6. EVERY PYQ LISTED BELOW (All 31 Questions Re-Solved)

*(Note: All 31 official keys are mathematically accurate; only 1 figure `[IMAGE_Q_57_1]` is missing!)*

| # | PYQ ID | (a) Ch / Lesson | (b) Exact Concept Tested | (c) Trap / Finer Point | (d) Official Key Check & Working | (e) Transcription Check |
|---|---|---|---|---|---|---|
| 1 | `2026_FN_Q11` | Ch 01 / L01.1 | 2-step Polya's Urn (`pick + add 1 same color`) ending with equal `2R, 2B`. | Total balls become `2 -> 3 -> 4`: `(1/2)(1/3) + (1/2)(1/3) = 1/3` (NOT `1/2`!). | **CORRECT (B: `1/3`).** | Clean. |
| 2 | `2026_AN_Q14` | Ch 04 / L04.2 | Identifying Normal PDF directly from formula `1/(3\sqrt{2\pi}) exp(-x^2/18)`. | Support is `(-\infty, +\infty)` with `exp(-x^2/(2·9))` -> Normal with `\mu=0, \sigma=3` (`B`). | **CORRECT (B: Normal).** | Minor typo: `"random variable .. ?"` -> `"random variable X?"`. |
| 3 | `2026_FN_Q58` | Ch 02 / L02.2 | Expectation `E[X]` of 8-value discrete PMF. | Check weights sum to `1` (`4/6 + 4/12 = 1`), then `E[X] = (1+2+5+7)/6 + (3+4+6+8)/12 = 2.5 + 1.75 = 4.25`. | **CORRECT (4.25, inside `4.24–4.26`).** | Clean. |
| 4 | `2026_AN_Q63` | Ch 01 / L01.1 | Conditional probability `P(E_1 | E_2)` across overlapping subsets of 6 independent tosses. | Only toss `#2` overlaps between `{2,4,6}` (`E_1`) and `{1,2,3,5}` (`E_2`). By symmetry `P(toss#2 = H | E_2) = 1/2` -> `(1/2)(3/4) + (1/2)(1/4) = 0.5`! | **CORRECT (0.5).** | Clean. |
| 5 | `2025_FN_Q32` | Ch 01 / L01.2 | Bayes' Theorem over 2 coin tosses (`4` fair, `1` double-headed fake). | Condition on TWO heads (`P(HH|Fair) = 1/4`, `P(HH|Fake) = 1`): `(1/5·1) / (1/5·1 + 4/5·1/4) = 0.50`! | **CORRECT (0.50, inside `0.49–0.51`).** | Clean. |
| 6 | `2025_FN_Q56` | Ch 04 / L04.1 | Binomial 0-error 5-bit message (`p_flip = 0.01`). | `(1 - 0.01)^5 = 0.99^5 = 0.95099 ≈ 0.951`. | **CORRECT (0.951, inside `0.949–0.952`).** | Clean. |
| 7 | `2025_FN_Q58` | Ch 00, 02 / L00.1, L02.1 | Normalizing continuous PDF `Cx^2` on `[1, 4]` and integrating `[2, 3]`. | `C(64 - 1)/3 = 1 => C = 1/21`. `P(2<=X<=3) = (27 - 8)/(3·21) = 19/63 = 0.3016`. | **CORRECT (0.302, inside `0.300–0.302`).** | Clean. |
| 8 | `2025_AN_Q64` | Ch 00, 02 / L00.1, L02.2 | Probability that random square-invariant quadratic `(x-\alpha)(x-\beta)` has equal roots. | Set of distinct polynomials = **unordered** pairs `{\alpha, \beta} = {\alpha^2, \beta^2}`: `{0,0}, {1,1}, {0,1}, {\omega, \omega^2}` (`4` total, `2` equal!) -> `2 / 4 = 0.5`! | **CORRECT (0.5).** | Clean. |
| 9 | `2025_AN_Q65` | Ch 02, 04 / L02.2, L04.2 | Expected length of uniform `(0, 1)` subinterval containing `0.4` (Inspection Paradox). | If `U < 0.4`, length = `1 - U`; if `U > 0.4`, length = `U` -> `\int_0^{0.4} (1-u) du + \int_{0.4}^1 u du = 0.32 + 0.42 = 0.74`! | **CORRECT (0.74, inside `0.70–0.80`).** | Clean. |
| 10 | `2024_FN_Q34` | Ch 01 / L01.1 | Independence of relative order events (`1` before `2` and `3` before `4`) in random permutation. | Order of `{1,2}` and `{3,4}` decouple cleanly (`1/2 × 1/2 = 1/4 = P(X)P(Y)`) -> **Independent** (`B`)! | **CORRECT (B).** | Clean. |
| 11 | `2024_AN_Q33` | Ch 00 / L00.1 | Probability of all 6 faces distinct in 6 fair dice rolls. | `6! / 6^6 = 720 / 46656 = 5 / 324` (`B`). | **CORRECT (B: `5/324`).** | Clean. |
| 12 | `2024_FN_Q14` | Ch 00, 01 / L00.1, L01.1 | Set algebra & independence check (`P(A)=0.3, P(B)=0.5, P(A∩B)=0.1`). | `0.3×0.5 != 0.1` (`A` false); `P(A∪B) = 0.7` (`B`); `P(A∩B^c) = 0.3 - 0.1 = 0.2` (`C`); `P(A^c∩B^c) = 0.3 != 0.4` (`D` false). | **CORRECT (B, C).** | Clean. |
| 13 | `2024_AN_Q52` | Ch 02 / L02.2 | Expectation inequality for `z = xy` when `x, y \in [0, 1]` are NOT necessarily independent. | Since `0 <= y <= 1` and `x >= 0`, `xy <= x` pointwise -> `E[xy] <= E[x]` (`D`)! Counterexamples `y=x` and `y=1-x` break `A, B, C`. | **CORRECT (D: `\overline{z} <= \overline{x}`).** | Clean. |
| 14 | `2024_FN_Q46` | Ch 01 / L01.1 | Conditional drawing without replacement (`10R, 15B`). | Given 1st is Red, `9R, 15B` (`24` total) remain -> `9 / 24 = 3 / 8 = 0.375`! | **CORRECT (0.375, inside `0.370–0.380`).** | Clean. |
| 15 | `2023_FN_Q53` | Ch 01 / L01.1 | Independence across `{A=HH, B=1st H, C=2nd H}` in 2 fair coin tosses. | `P(A∩B) = 1/4 != 1/8` (`A, B` false); `B, C` are independent (`C, D` true). | **CORRECT (C, D).** | Clean. |
| 16 | `2021_FN_Q32` | Ch 04 / L04.2 | Survival `P(X > E[X])` for Exponential (`\lambda = 2`). | `E[X] = 1/2`; `P(X > 1/2) = e^{-2(1/2)} = e^{-1} = 0.3679` (independent of `\lambda`!). | **CORRECT (0.37, inside `0.35–0.39`).** | Clean. |
| 17 | `2021_AN_Q15` | Ch 03, 04 / L03.1, L04.1 | Standard deviation of Binomial(`1000, 0.4`). | `SD = \sqrt{1000 × 0.4 × 0.6} = \sqrt{240} = 15.49` (not `npq = 240`!). | **CORRECT (15.49, inside `15.00–16.00`).** | Clean. |
| 18 | `2021_AN_Q24` | Ch 02 / L02.2 | Maximizing expected score across sequential dependent attempts (`A` then `B` vs `B` then `A`). | `A->B`: `0.8×10 + (0.8×0.5)×20 = 16`; `B->A`: `0.5×20 + (0.5×0.8)×10 = 14`. | **CORRECT (D: A then B, 16).** | Clean. |
| 19 | `2021_AN_Q40` | Ch 01 / L01.1 | Unconditional probability of Red on 4th trial in Polya's Urn (`r` red, `b` black). | By symmetry / martingale property, `P(R_k) = r / (r + b)` for EVERY trial `k >= 1` (`A`)! | **CORRECT (A: `r / (r + b)`).** | Clean. |
| 20 | `2021_FN_Q12` | Ch 02 / L02.2 | Covariance Cauchy-Schwarz inequality (`S1`) & false absolute-value Covariance formula (`S2`). | Cauchy-Schwarz forces `(Cov(X,Y))^2 <= Var(X)Var(Y)` (`S1` false); Covariance preserves sign (`S2` false when negatively correlated). | **CORRECT (D: Both false).** | Clean. |
| 21 | `2021_FN_Q57` | Ch 01 / L01.2 | Binary noisy channel Bayes `P(Sent=H | Rec=H)` (`P(H)=0.1, P(L)=0.9`). | Need transition graph `[IMAGE_Q_57_1]` to confirm `P(H|L)` directly (key `0.04` implies `P(H|L) = 0.8`: `0.03 / (0.03 + 0.72) = 0.04`). | **CANNOT VERIFY** (Key: 0.04). Graph `[IMAGE_Q_57_1]` is missing. | **MISSING FIGURE** (`[IMAGE_Q_57_1]`). |
| 22 | `2020_FN_Q50` | Ch 02 / L02.2 | Parity probability of random binary dot product `\sum a_i x_i` (`a != 0`). | Fix one index `k` with `a_k = 1`: flipping `x_k` maps every even sum bijectively to an odd sum -> `0.5`. | **CORRECT (0.5).** | Clean. |
| 23 | `2019_FN_Q16` | Ch 00 / L00.1 | Probability two uniform numbers from `{1..13}` share 4-bit unsigned MSB. | `1..7` have MSB `0` (`7/13`); `8..13` have MSB `1` (`6/13`) -> `(7/13)^2 + (6/13)^2 = 85 / 169 = 0.5030`. | **CORRECT (0.503, inside `0.502–0.504`).** | Clean. |
| 24 | `2019_FN_Q53` | Ch 02 / L02.2 | Expected path distance between two independent random leaves in an 8-leaf full binary tree. | Fix leaf `a`: distances to the 8 leaves `{0, 2, 4, 4, 6, 6, 6, 6}` average to `34 / 8 = 4.25`! | **CORRECT (4.25).** | Clean. |
| 25 | `2019_FN_Q55` | Ch 00, 04 / L00.1, L04.2 | Uniform `(1, 6)` probability that `3x^2 + 6Yx + (3Y + 6)` has real roots. | Discriminant `\Delta >= 0 <=> Y^2 - Y - 2 >= 0 <=> (Y-2)(Y+1) >= 0` -> `[2, 6)` inside `(1, 6)` has prob `4 / 5 = 0.8`! | **CORRECT (0.8).** | Clean. |
| 26 | `2018_FN_Q25` | Ch 01, 04 / L01.1, L04.1 | Geometric 3rd-trial win when ties repeat on 2 fair dice (`P(tie) = 1/6`). | `Tie, Tie, Non-Tie` = `(1/6)(1/6)(5/6) = 5 / 216 = 0.02315`. | **CORRECT (0.023, inside `0.021–0.024`).** | Clean. |
| 27 | `2018_FN_Q54` | Ch 01 / L01.2 | Bayes' Theorem on `3 × 3` weather conditional table (`P(H_G | H_D)`). | `0.2(0.40) / [0.2(0.40) + 0.5(0.10) + 0.3(0.01)] = 0.08 / 0.133 = 0.6015`. | **CORRECT (0.60, inside `0.60–0.62`).** | Clean. |
| 28 | `2017_FN_Q14` | Ch 02, 03, 04 / L03.1, L04.2 | Median of clipped Normal `Y = max(X, 0)` where `X ~ N(0, \sigma^2)`. | `P(Y <= 0) = P(X <= 0) = 0.5` AND `P(Y >= 0) = 1 >= 0.5` -> median is `0.0`! | **CORRECT (0.0).** | Clean. |
| 29 | `2017_AN_Q37` | Ch 01 / L01.1 | Computing `P(P^c | Q^c)` from `P(P), P(P|Q), P(Q|P)`. | `P(P∩Q) = (1/4)(1/3) = 1/12` -> `P(Q) = (1/12)/(1/2) = 1/6` -> `P(P∪Q) = 1/4 + 1/6 - 1/12 = 1/3` -> `P(P^c∩Q^c)/P(Q^c) = (2/3)/(5/6) = 4/5`! | **CORRECT (A: `4/5`).** | Clean. |
| 30 | `2017_AN_Q44` | Ch 02, 04 / L02.2, L04.1 | Expected value `E[Y]` from Probability Generating Function `(1 - \beta + \beta z)^N`. | Either take `g_Y'(1) = N \beta`, OR recognize Binomial(`N, \beta`) PGF! | **CORRECT (B: `N \beta`).** | Clean. |
| 31 | `2017_AN_Q52` | Ch 02, 04 / L02.2, L04.1 | Computing `E[(X + 2)^2]` for Poisson(`mean = 5`). | `E[X] = 5, Var(X) = 5 => E[X^2] = 5 + 25 = 30`. `E[X^2 + 4X + 4] = 30 + 20 + 4 = 54`! | **CORRECT (54.0).** | Clean. |

---

## PART 7. MORE QUESTIONS NEEDED (3 New Ideas Per Lesson)

### Chapter 00 · Counting Probability, Set Algebra & Calculus Warm-Up
- **Lesson 00.1 (`Sample Spaces, Counting, Set Algebra & PDF Calculus`):**
  1. Two fair dice are rolled simultaneously: find the probability that their sum is strictly greater than `8` (`MCQ`).
  2. A continuous density is $f(x) = k (3 - x)$ on $[0, 3]$ and `0` elsewhere: find `k` and $P(1 \le X \le 2)$ (`NAT`).
  3. Which events among `{A ∩ B^c, A^c ∩ B, A ∩ B, (A ∪ B)^c}` partition the entire sample space $\Omega$ (`MSQ`)?

### Chapter 01 · Probability, Conditional Probability and Bayes
- **Lesson 01.1 (`Axioms, Conditional, Independence & Repeated Trials`):**
  1. Three fair coins are tossed: let `A` = 1st Head, `B` = 2nd Head, `C` = odd number of Heads — verify whether `A, B, C` are pairwise independent vs mutually independent (`MSQ`).
  2. A box has `4` white and `6` black balls; drawing without replacement, find the probability the `3rd` ball is white (`MCQ`).
  3. Alice and Bob take turns rolling a fair die (`Alice first`); Alice wins on `6`, Bob wins on `1` or `2`: find the probability Alice wins eventually (`NAT`).
- **Lesson 01.2 (`Total Probability & Bayes' Theorem`):**
  1. A medical test for a rare `1%` disease has `95%` sensitivity (True Positive) and `5%` false-positive rate: given a positive test, find the probability the patient actually has the disease (`NAT`).
  2. Box 1 has `(2R, 3B)`, Box 2 has `(4R, 1B)`; a random box is picked and a Red ball drawn -> what is the probability a SECOND ball drawn (without replacement) from that SAME box is also Red (`NAT`)?
  3. Explain why ignoring base rates (priors) in Bayes' Theorem causes false-positive diagnostic traps (`MCQ`).

### Chapter 02 · Random Variables, Expectation, Variance & Covariance
- **Lesson 02.1 (`PMF, PDF, Mixed CDF & Joint Variables`):**
  1. A random variable has CDF $F(x) = 0$ ($x < 0$), $x/2$ ($0 \le x < 1$), $1$ ($x \ge 1$): compute $P(X = 1)$ and $P(0.5 \le X \le 1)$ (`MSQ`).
  2. Two points $X, Y$ are picked independently and uniformly on $[0, 1]$: find $P(|X - Y| \le 0.5)$ using the `1×1` square (`NAT`).
  3. Given a `2×2` Joint PMF table $p(x, y)$, verify whether $X$ and $Y$ are independent and compute $P(X + Y = 2)$ (`MSQ`).
- **Lesson 02.2 (`Expectation, Conditional Expectation, Variance, Covariance & PGFs`):**
  1. Let $X \in \{-1, 0, +1\}$ uniformly and $Y = X^2$: compute $\text{Cov}(X, Y)$ and verify why $X, Y$ are still dependent (`MCQ`).
  2. A server crashes after `X ~ Uniform(0, 10)` hours, losing `X` hours of work: find $E[\text{Var}]$? Better: find $E[X^2]$ and $\text{Var}(3X - 4)$ (`NAT`).
  3. Given $n$ letters placed randomly into $n$ addressed envelopes, use Indicator Random Variables to find expected number of letters in their correct envelopes (`NAT`).

### Chapter 03 · Mean, Median, Mode & Standard Deviation
- **Lesson 03.1 (`Descriptive Stats, Skewness & Origin/Scale`):**
  1. Data set $S$ has `Mean = 20`, `Median = 18`, and `SD = 4`; every element is transformed via $y_i = -2x_i + 10$: find new Mean, Median, and SD (`MSQ`).
  2. Two batches of size `20` (`Mean 60, SD 5`) and `30` (`Mean 70, SD 5`) are merged: find the combined Mean and combined Variance (`NAT`).
  3. Find the Median of the continuous distribution $f(x) = 3x^2$ on $[0, 1]$ (`NAT`).

### Chapter 04 · Standard Distributions
- **Lesson 04.1 (`Discrete: Binomial, Poisson, Geometric`):**
  1. Independent Poisson requests arrive at Server A (`\lambda_1 = 3/min`) and Server B (`\lambda_2 = 2/min`): find $P(\text{total requests in 1 min} = 0)$ (`NAT`).
  2. Suppose `n = 10` bits flip independently with `p = 0.2`; compute $E[X^2]$ where $X$ is number of flipped bits (`NAT`).
  3. A fair coin is tossed until the **1st Head** appears: find the expected number of tosses and the variance (`MCQ`).
- **Lesson 04.2 (`Continuous: Uniform, Exponential, Normal`):**
  1. An Exponential component (`mean = 4` hours) has already survived `5` hours without failing: find the probability it survives at least `4` MORE hours (`NAT`).
  2. Let $X \sim N(10, 4)$ and $Y \sim N(6, 5)$ be independent: find $P(X > Y)$? Better: find mean and variance of $D = X - Y$ (`MSQ`).
  3. Using the `68-95-99.7%` rule for $X \sim N(50, 100)$, estimate $P(30 \le X \le 60)$ (`NAT`).

---

## PART 8. WHAT IS MISSING FROM THE SUBJECT

Because `Part B.2` lists **"none | not written"** for ALL 4 chapters and places `04 Mean, median, mode and standard deviation` at the very end, here is everything missing from `Part B.2` against the GATE CS syllabus (`Part B.1`) and `Part C` (31 PYQs):

1. **Logical Chapter Order:** Moving **Mean, Median, Mode & Standard Deviation** (`and Expectation/Variance`) BEFORE Standard Distributions (`Binomial, Poisson, Exponential, Normal`)!
2. **Chapter 00 (`Counting, Set Algebra & PDF Calculus`):** Equally-likely `36`-dice pairs (`2024_AN_Q33`, `2018_FN_Q25`), unsigned binary counting (`2019_FN_Q16`), Event Venn algebra (`2024_FN_Q14`), and definite integrals + quadratic inequality intervals (`2025_FN_Q58`, `2025_AN_Q65`, `2019_FN_Q55`).
3. **Conditional Probability & Bayes Depth:** Shrinking sample space, **Mutually Exclusive vs Independent** (`2024_FN_Q34`, `2023_FN_Q53`), Pairwise vs Mutual independence, **Overlapping trial sets (`2026_AN_Q63`)**, **Polya's Urn & Without-Replacement Symmetry (`2026_FN_Q11`, `2021_AN_Q40`, `2024_FN_Q46`)**, Bayes Tree & Joint-Table method (`2025_FN_Q32`, `2021_FN_Q57` — restore missing `[IMAGE_Q_57_1]`!, `2018_FN_Q54`), and Infinite waiting trials (`2018_FN_Q25`).
4. **Random Variables & Expectation Depth:** Discrete PMF vs Continuous PDF vs **Mixed jump CDF (`max(X,0)` `2017_FN_Q14`)**, Joint PMF/PDF & `1×1` square areas, **Linearity vs Product `E[XY]` (`2024_AN_Q52`)**, Indicators & Symmetry (`2020_FN_Q50`, `2019_FN_Q53`, `2025_AN_Q64`), **Conditional Expectation & Expected-Score Decision Trees (`2025_AN_Q65`, `2021_AN_Q24`)**, **`E[X^2] = Var + E^2` (`2017_AN_Q52`)**, **Covariance & Cauchy-Schwarz (`2021_FN_Q12`)**, and **Probability Generating Functions (`2017_AN_Q44`)**.
5. **Descriptive Statistics Depth (`Mean, Median, Mode, SD`):** Raw & grouped formulas, `F(m) = 0.5` median (`2017_FN_Q14`), Change of Origin & Scale (`SD` shift invariance!), Skewness (`Mean - Mode = 3(Mean - Median)`), and Combined Mean/Variance.
6. **Distributions Depth:** Adding **Geometric Distribution (`2018_FN_Q25`)** alongside Binomial (`2025_FN_Q56`, `2021_AN_Q15`, `2017_AN_Q44`), Poisson (`2017_AN_Q52`), Uniform (`2025_AN_Q65`, `2019_FN_Q55`), Exponential (`2021_FN_Q32` + Memoryless!), and Normal (PDF matching `2026_AN_Q14`, `Z`-standardization, `68-95-99.7%`, sums `aX ± bY`).

---

## PART 9. WEIGHTS

### Chapter Weight Tags & Comparison with the Bank (`Part B.3`)

| Chapter (Reordered Logical Plan) | Proposed Weight Tag | Bank Stats (2017–2026, 15 CS Papers) | Does the Bank Weight Look Fair? |
|---|---|---|---|
| **Ch 00 · Counting, Set Algebra & PDF Calculus** *(New)* | **Foundation** (Mandatory 55-min warm-up before Ch 01) | Embedded in `2025_FN_Q58`, `2024_AN_Q33`, `2019_FN_Q16`, `2019_FN_Q55` | **Under-isolated in bank.** Fixes the two #1 dropout causes (missing basic calculus & `21`-vs-`36` dice errors). |
| **Ch 01 · Probability, Conditional Probability & Bayes** | **Very High** | 11 Qs / 18 marks (`1.20%`; asked 7/10 yrs — `0` Easy, `10` Med, `1` Hard!) | **Fair — `35%` of Probability marks!** Extremely consistent Medium 2-markers (`Bayes`, `Polya's Urn`, `Independence`) once drawn as Probability Trees / Joint Tables! |
| **Ch 02 · Random Variables, Expectation, Variance & Covariance** | **Very High** (#1 Bucket!) | 11 Qs / 19 marks (`1.27%`; asked 7/10 yrs — `6` Hard!) | **Fair — hardest yet highest mark share (`37%` of Prob!)** Covers subtle expectation inequalities, tree distances, broken sticks, Cauchy-Schwarz, and PGFs. |
| **Ch 03 · Mean, Median, Mode & Standard Deviation** *(Moved BEFORE Distributions!)* | **Low-Medium** (Essential bridge!) | 0 standalone bucket in `Part B.3` (embedded inside `Ch 02` & `Ch 04`: `2026_FN_Q58`, `2021_AN_Q15`, `2017_FN_Q14`) | **Bank hides it inside RV & Distributions.** Keeping it short (`1` crisp lesson) right before Ch 04 avoids duplicating `E[X]/SD` while satisfying the verbatim syllabus line. |
| **Ch 04 · Standard Distributions (`Bin, Pois, Geom, Unif, Exp, Norm`)** | **High** (Fastest Easy/Med ROI!) | `6 + 3 = 9` Qs / `14` marks (`0.93%`; asked 8 yrs — `3` Easy!) | **Fair — cleanest formula ROI!** Memorizing the 6 Distribution Cards (`especially Normal PDF`, `Exp 1/\lambda`, `Binomial np/npq`, `Poisson \lambda`) converts straight into fast NAT points! |

### Overall Assessment of Bank Distribution (`3.4%` = ~3.4 marks/paper)
- Probability and Statistics carries the lightest mark share among the core technical books reviewed so far (`51` marks across 15 papers = `~3.4` marks/paper), yet has **high score variance**: **`13` of `31` questions (`42%`) are Hard** (concentrated in `Random Variables`), while **`18` are Easy/Medium** (`Conditional/Bayes` and `Standard Distributions`)!
- For a 100-day dropper: spend **3–4 focused days** locking **Ch 00 -> Ch 01 (Bayes Tables & Independence) -> Ch 02 (Expectation/Variance/PDF Integrals) -> Ch 03–04 (the 6 Distribution Cards)** — and skip obsessing over olympiad-style puzzles (`2025_AN_Q64`) until core GATE CS subjects are secure! (Beyond the 2017–2026 bank provided, exact future paper weights: **not sure**.)