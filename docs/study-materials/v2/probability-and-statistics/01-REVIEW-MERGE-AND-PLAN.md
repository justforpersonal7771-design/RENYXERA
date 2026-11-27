# Probability and Statistics: review merge and plan v1

Source: Gemini only (`gemini.md`). Everything marked "verified" was recomputed on 28 Nov 2026.

## 1. How good was it
Good plan and a correct chapter order (mean, median, mode and standard deviation moved before the distributions). **One factual error:** it says 13 of 31 questions (42%) are Hard and 18 Easy or Medium. The bank has **4 Easy / 18 Medium / 9 Hard**, so 9 are Hard (29%) and 22 are Easy or Medium. Its other numbers are right: 31 questions, 51 marks (3.4% of 1500), 19 NAT / 10 MCQ / 2 MSQ, one figure placeholder; random variables 11 q / 19 marks (37%), conditional probability and Bayes 11 / 18 (35%), distributions 9 / 14.

## 2. Data defects and checks (verified)
| Question | Problem | Status |
|---|---|---|
| 2026_AN_Q14 | Stem prints "random variable .. ?" for "random variable X?" | Fix |
| 2021_FN_Q57 | The picture exists in the app (H→H 0.3, H→L 0.7, L→H 0.8, L→L 0.2). P(R = H) = 0.1 × 0.3 + 0.9 × 0.8 = 0.75; P(S = H given R = H) = 0.03 / 0.75 = **0.04**, the key | **Verified** |
| 17 of the 19 NAT questions | Re-solved (2021_FN_Q57 needs its figure; 2018_FN_Q54 was not re-solved): 2026_FN_Q58 = 4.25, 2026_AN_Q63 = 1/2 (enumeration of 64 outcomes), 2025_FN_Q32 = 0.50, 2025_FN_Q56 = 0.951, 2025_FN_Q58 = 19/63 = 0.3016, 2025_AN_Q64 = 0.5 (four square-invariant polynomials, two with equal roots), 2025_AN_Q65 = 0.74, 2024_FN_Q46 = 0.375, 2021_FN_Q32 = 0.368, 2021_AN_Q15 = 15.49, 2020_FN_Q50 = 0.5, 2019_FN_Q16 = 85/169 = 0.503, 2019_FN_Q53 = 4.25, 2019_FN_Q55 = 0.8, 2018_FN_Q25 = 0.0231, 2017_FN_Q14 = 0, 2017_AN_Q52 = 54 | All correct |
| MCQ and MSQ keys | Gemini says CORRECT for all; not re-solved | Keep |

## 3. Syllabus check
Official line: *Random variables. Uniform, normal, exponential, Poisson and binomial distributions. Mean, median, mode and standard deviation. Conditional probability and Bayes theorem.* The geometric distribution, covariance, Cauchy–Schwarz and generating functions in Gemini's plan are not named: tag [LEGACY-ASKED] where a PYQ asks them, otherwise [BEYOND]. Chapter 0 (counting, set algebra, density calculus) is a Foundation bridge.

## 4. The plan
**0 · Counting, set algebra, calculus warm-up** [Foundation]. **1 · Probability, conditional probability, Bayes** [Very High, 0 Easy]. **2 · Random variables, expectation, variance** [Very High, 6 Hard]. **3 · Mean, median, mode, standard deviation** [short, before the distributions]. **4 · Standard distributions: uniform, normal, exponential, Poisson, binomial** [High, fastest marks]. **5 · Previous-year practice**.

## 5. Next steps
Fix the 2026_AN_Q14 stem; restore the 2021_FN_Q57 graph (owner); do not reuse Gemini's Hard count; tag the 31 PYQs to lessons.
