# In-depth review input: Probability and Statistics

**One file, one review.** Paste everything below the line into ChatGPT (new chat), and again into Gemini (new chat). If the chat refuses the length, attach this file and write: "Follow the instructions inside the file."

Save the replies in this folder as `chatgpt-review-probability-and-statistics.md` and `gemini-review-probability-and-statistics.md`, then tell me.

Contains: reviewer instructions (A), the subject's contents with the PYQ statistics (B), and all 31 PYQs with full text and the official key (C).

---

## PART A. REVIEWER INSTRUCTIONS

```
YOU ARE NOT AN EXPERT. YOU ARE THIS STUDENT:
You are 25 years old. You sat at the back of the class. You failed GATE twice and have plenty of backlogs. You studied
Programming and Data Structures (and the other subjects) in college only to pass, copied the assignments, and
remember almost nothing. You are ashamed of that, you do not want to ask, and you are now preparing again with
about 100 days left. You have read Made Easy notes, Unacademy PDFs and GateWallah books and they left you confused:
they use words they never explain, jump steps and show few pictures. You will only believe a book that is teaching
you from the very beginning.

I will give you a document. Read it as this student. Do NOT be polite and do NOT be an expert reviewer who nods.
Stop at every place where this student would get stuck. Then answer in the four parts below.

PART 1. FEELINGS (10 lines)
 How did you feel reading it? Where did you feel lost, bored, scared, or tricked? Where did you feel "I can do this"?
 Would you pay Rs 149 per subject book for this? Yes or no, and the real reason.

PART 2. GAP TABLE (the main part; at least 40 rows if the document is a plan, 15 if it is one topic)
 | # | Where (chapter/topic/line) | What I could not understand or what is missing | Type | What to add or change | Priority |
 Type is one of: MISSING-PREREQUISITE, UNEXPLAINED-WORD, STEP-SKIPPED, NEEDS-DIAGRAM, NEEDS-EXAMPLE, NEEDS-TRACE,
 MISSING-GATE-CONCEPT, MISSING-FINER-POINT, WRONG-ORDER, TOO-HARD-TOO-EARLY, TOO-LONG-BORING, UNCLEAR-ENGLISH, FACT-DOUBT.
 Priority is HIGH / MEDIUM / LOW.

PART 3. WHAT A COMPLETE SUBJECT MUST HAVE
 From your knowledge of GATE (previous-year papers, Made Easy, Unacademy, GateWallah, standard university textbooks,
 NPTEL), list every chapter, topic and finer sub-topic that this subject has but the document does NOT cover, with:
 the syllabus line it serves, how often GATE asks it (if you really know; otherwise say "not sure"), the typical
 question type, and the prerequisite a zero-level student needs first.

PART 4. THE DIAGRAMS I NEED
 List every diagram this student needs to SEE in order to understand each chapter. For each: what to draw, what the
 student should notice, and whether it should be a single picture, a step-by-step series of pictures, or a trace table.

RULES FOR YOU
 - Do not invent GATE years, question numbers or statistics. If you are not sure, write "not sure".
 - Do not just praise. If you find fewer than 40 problems in a long plan, you read too fast; read again.
 - Say it in simple English.
 - If a fact in the document looks wrong, say exactly which and why (FACT-DOUBT).

This is the **in-depth review of the whole Probability and Statistics book**. Take your time. Go chapter by chapter, and give a much deeper answer than a quick review: at least **80 rows** in the gap table in Part 2 (spread across every chapter).

If your reply gets too long, **stop at the end of a chapter** and write "CONTINUE FROM CHAPTER <number>". I will answer "continue" and you carry on. Do not shorten later chapters to fit; every chapter gets the same depth.

In addition to Parts 1 to 4 above, answer these parts:

PART 5. THE FULL PLAN, CHAPTER BY CHAPTER
 For every chapter (the ones given below, plus any you think are missing), list the lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with the reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind and what it shows); hand traces; common mistakes.

PART 6. EVERY PYQ LISTED BELOW
 For EACH previous-year question: (a) the chapter and lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree show the working and write FACT-DOUBT), (e) whether the question text looks mis-transcribed (say exactly what).

PART 7. MORE QUESTIONS NEEDED
 For each lesson, three question ideas GATE could ask that the PYQs do not cover (one line each, with the type MCQ / MSQ / NAT).

PART 8. WHAT IS MISSING FROM THE SUBJECT
 Topics GATE has asked, or could ask, that no chapter below covers.

PART 9. WEIGHTS
 Give each chapter a weight tag (High / Medium / Low / Foundation) and say whether the one derived from the bank (below) looks fair. Do not invent frequencies; write "not sure".
```

---

## PART B. THE CONTENTS TO REVIEW


Generated 24 Nov 2026. **Status: v0.** This is a contents list, not yet a full plan. Reviewers: your job is to turn it into a complete, beginner-first plan (see the prompt at the top of `00-REVIEW-INPUT.md`).

## 1. GATE syllabus lines for this subject
*(written from memory of the GATE CS syllabus; please check them against the official GATE 2027 document and say if anything is missing or wrong)*

- Random variables.
- Mean, median, mode and standard deviation.
- Conditional probability and Bayes theorem.
- Uniform, normal, exponential, Poisson and binomial distributions.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Probability, conditional probability and Bayes | none | not written |
| 02 | Random variables | none | not written |
| 03 | Distributions: uniform, normal, exponential, Poisson, binomial | none | not written |
| 04 | Mean, median, mode and standard deviation | none | not written |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **31**; marks: **51** = **3.4%** of all 1500 marks (about 3.4 marks a paper).
- Forge (our own) questions for this subject: **13**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Random Variables & Sampling Rules | 11 | 19 | 1.27% | 7 | 1/4/6 | NAT2×4, MCQ1×2, MCQ2×4, NAT1×1 |
| Conditional Probability & Bayes Theorem | 11 | 18 | 1.20% | 7 | 0/10/1 | MCQ1×1, NAT2×4, NAT1×2, MSQ1×1, MSQ2×1, MCQ2×2 |
| Continuous/Discrete Distributions (Uniform, Normal, Exponential) | 6 | 9 | 0.60% | 5 | 1/3/2 | MCQ1×1, NAT2×3, NAT1×2 |
| Standard Distributions (Poisson, Binomial) | 3 | 5 | 0.33% | 3 | 2/1/0 | NAT2×2, NAT1×1 |


---

## PART C. ALL 31 PREVIOUS-YEAR QUESTIONS (Probability and Statistics)

Official key marked "✔ official". Figures are not shown; the question says so.

**2026_FN_Q11** · 2026-FN · MCQ · 1 mark · Medium · bank topic: Conditional Probability & Bayes Theorem

An urn contains one red ball and one blue ball. At each step, a ball is picked uniformly at random from the urn, and this ball together with another ball of the same color is put back in the urn. The probability that there are equal number of red and blue balls after two steps is

- A) \( \frac{1}{4} \)
- B) \( \frac{1}{3} \)  ✔ official
- C) \( \frac{1}{2} \)
- D) \( \frac{2}{3} \)

---

**2026_AN_Q14** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

The probability density function \( f(x) \) of a random variable \( X \) which takes real values is
$$ f(x) = \frac{1}{3\sqrt{2\pi}} \exp\left(-\frac{x^2}{18}\right), \; x \in (-\infty, +\infty) $$
Which one of the following statements is correct about the random variable .. ?

- A) \( X \) is an exponential random variable
- B) \( X \) is a normal random variable  ✔ official
- C) \( X \) is a Poisson random variable
- D) \( X \) is a uniform random variable

---

**2026_FN_Q58** · 2026-FN · NAT · 2 marks · Easy · bank topic: Random Variables & Sampling Rules

Let \( X \) be a random variable which takes values in the set \( \{1, 2, 3, 4, 5, 6, 7, 8\} \).
Further, \( \Pr(X = 1) = \Pr(X = 2) = \Pr(X = 5) = \Pr(X = 7) = \frac{1}{6} \) and \( \Pr(X = 3) = \Pr(X = 4) = \Pr(X = 6) = \Pr(X = 8) = \frac{1}{12} \).
The expected value of \( X \), denoted by \( E[X] \), is equal to ________. (rounded off to two decimal places)

Official answer (numeric): 4.24 to 4.26

---

**2026_AN_Q63** · 2026-AN · NAT · 2 marks · Hard · bank topic: Conditional Probability & Bayes Theorem

Suppose an unbiased coin is tossed 6 times. Each coin toss is independent of all previous coin tosses. Let \( E_1 \) be the event that among the second, fourth, and sixth coin tosses, there are at least two heads. Let \( E_2 \) be the event that among the first, second, third, and fifth coin tosses, there are equal number of heads and tails.
The conditional probability \( P(E_1 \mid E_2) \) is equal to ________. (rounded off to one decimal place)

Official answer (numeric): 0.5 to 0.5

---

**2025_FN_Q32** · 2025-FN · NAT · 1 mark · Medium · bank topic: Conditional Probability & Bayes Theorem

A box contains 5 coins: 4 regular coins and 1 fake coin. When a regular coin is tossed, the probability \( P(\text{head}) = 0.5 \) and for a fake coin, \( P(\text{head}) = 1 \). You pick a coin at random and toss it twice, and get two heads. The probability that the coin you have chosen is the fake coin is ________. (Rounded off to two decimal places)

Official answer (numeric): 0.49 to 0.51

---

**2025_FN_Q56** · 2025-FN · NAT · 2 marks · Easy · bank topic: Standard Distributions (Poisson, Binomial)

Suppose a 5-bit message is transmitted from a source to a destination through a noisy channel. The probability that a bit of the message gets flipped during transmission is 0.01. Flipping of each bit is independent of one another. The probability that the message is delivered error-free to the destination is ________. (Rounded off to three decimal places)

Official answer (numeric): 0.949 to 0.952

---

**2025_FN_Q58** · 2025-FN · NAT · 2 marks · Medium · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

Consider a probability distribution given by the density function \( P(x) \).
$$ P(x) = \begin{cases} Cx^2, & \text{for } 1 \le x \le 4 \\ 0, & \text{for } x < 1 \text{ or } x > 4 \end{cases} $$
The probability that \( x \) lies between 2 and 3, i.e., \( P(2 \le x \le 3) \) is ________. (Rounded off to three decimal places)

Official answer (numeric): 0.300 to 0.302

---

**2025_AN_Q64** · 2025-AN · NAT · 2 marks · Hard · bank topic: Random Variables & Sampling Rules

A quadratic polynomial \( (x - \alpha)(x - \beta) \) over complex numbers is said to be square invariant if \( (x - \alpha)(x - \beta) = (x - \alpha^2)(x - \beta^2) \). Suppose from the set of all square invariant quadratic polynomials we choose one at random.
The probability that the roots of the chosen polynomial are equal is (rounded off to one decimal place)

Official answer (numeric): 0.5 to 0.5

---

**2025_AN_Q65** · 2025-AN · NAT · 2 marks · Hard · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

The unit interval (0,1) is divided at a point chosen uniformly distributed over (0,1) in R into two disjoint subintervals.
The expected length of the subinterval that contains 0.4 is ________.
(rounded off to two decimal places)

Official answer (numeric): 0.70 to 0.80

---

**2024_FN_Q34** · 2024-FN · MCQ · 1 mark · Hard · bank topic: Random Variables & Sampling Rules

Consider a permutation sampled uniformly at random from the set of all permutations of \( \{1, 2, 3, \dots, n\} \) for some \( n \ge 4 \). Let \( X \) be the event that 1 occurs before 2 in the permutation, and \( Y \) the event that 3 occurs before 4. Which one of the following statements is TRUE?

- A) The events \( X \) and \( Y \) are mutually exclusive
- B) The events \( X \) and \( Y \) are independent  ✔ official
- C) Either event \( X \) or \( Y \) must occur
- D) Event \( X \) is more likely than event \( Y \)

---

**2024_AN_Q33** · 2024-AN · MCQ · 1 mark · Medium · bank topic: Random Variables & Sampling Rules

When six unbiased dice are rolled simultaneously, the probability of getting all distinct numbers (i.e. 1, 2, 3, 4, 5 and 6) is

- A) \( \frac{1}{324} \)
- B) \( \frac{5}{324} \)  ✔ official
- C) \( \frac{7}{324} \)
- D) \( \frac{11}{324} \)

---

**2024_FN_Q14** · 2024-FN · MSQ · 1 mark · Medium · bank topic: Conditional Probability & Bayes Theorem

Let \( A \) and \( B \) be two events in a probability space with \( P(A) = 0.3 \), \( P(B) = 0.5 \), and \( P(A \cap B) = 0.1 \). Which of the following statements is/are TRUE?

- A) The two events \( A \) and \( B \) are independent
- B) \( P(A \cup B) = 0.7 \)  ✔ official
- C) \( P(A \cap B^c) = 0.2 \), where \( B^c \) is the complement of the event \( B \)  ✔ official
- D) \( P(A^c \cap B^c) = 0.4 \), where \( A^c \) and \( B^c \) are the complements of the events \( A \) and \( B \), respectively

---

**2024_AN_Q52** · 2024-AN · MCQ · 2 marks · Hard · bank topic: Random Variables & Sampling Rules

Let \( x \) and \( y \) be random variables, not necessarily independent, that take real values in the interval [0,1]. Let \( z = xy \) and let the mean values of \( x, y, z \) be \( \overline{x}, \overline{y}, \overline{z} \) respectively. Which one of the following statements is TRUE?

- A) \( \overline{z} = \overline{x} \overline{y} \)
- B) \( \overline{z} \le \overline{x} \overline{y} \)
- C) \( \overline{z} \ge \overline{x} \overline{y} \)
- D) \( \overline{z} \le \overline{x} \)  ✔ official

---

**2024_FN_Q46** · 2024-FN · NAT · 2 marks · Medium · bank topic: Conditional Probability & Bayes Theorem

A bag contains 10 red balls and 15 blue balls. Two balls are drawn randomly without replacement. Given that the first ball drawn is red, the probability (rounded off to 3 decimal places) that both balls drawn are red is ________.

Official answer (numeric): 0.370 to 0.380

---

**2023_FN_Q53** · 2023-FN · MSQ · 2 marks · Medium · bank topic: Conditional Probability & Bayes Theorem

Consider a random experiment where two fair coins are tossed. Let \(A\) be the event that denotes HEAD on both the throws, \(B\) be the event that denotes HEAD on the first throw, and \(C\) be the event that denotes HEAD on the second throw. Which of the following statements is/are TRUE?

- A) \(A\) and \(B\) are independent.
- B) \(A\) and \(C\) are independent.
- C) \(B\) and \(C\) are independent.  ✔ official
- D) \(\text{Prob}(B \mid C) = \text{Prob}(B)\)  ✔ official

---

**2021_FN_Q32** · 2021-FN · NAT · 1 mark · Medium · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

The lifetime of a component of a certain type is a random variable whose probability density function is exponentially distributed with parameter 2. For a randomly picked component of this type, the probability that its lifetime exceeds the expected lifetime (rounded to 2 decimal places) is _________.

Official answer (numeric): 0.35 to 0.39

---

**2021_AN_Q15** · 2021-AN · NAT · 1 mark · Easy · bank topic: Standard Distributions (Poisson, Binomial)

For a given biased coin, the probability that the outcome of a toss is a head is 0.4. This coin is tossed 1,000 times. Let \(X\) denote the random variable whose value is the number of times that head appeared in these 1,000 tosses. The standard deviation of \(X\) (rounded to 2 decimal places) is _________.

Official answer (numeric): 15.00 to 16.00

---

**2021_AN_Q24** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Random Variables & Sampling Rules

In an examination, a student can choose the order in which two questions (QuesA and QuesB) must be attempted.
• If the first question is answered wrong, the student gets zero marks.
• If the first questions is answered correctly and the second question is not answered correctly, the student gets the marks only for the first question.
• If both the questions are answered correctly, the student gets the sum of the marks of the two questions.
The following table shows the probability of correctly answering a question and the marks of the question respectively.

| Question | Probability of answering correctly | Marks |
|---|---|---|
| QuesA | 0.8 | 10 |
| QuesB | 0.5 | 20 |

Assuming that the student always wants to maximize her expected marks in the examination, in which order should she attempt the questions and what is the expected marks for that order (assume that the questions are independent)?

- A) First QuesA and then QuesB. Expected marks 14.
- B) First QuesB and then QuesA. Expected marks 14.
- C) First QuesB and then QuesA. Expected marks 22.
- D) First QuesA and then QuesB. Expected marks 16.  ✔ official

---

**2021_AN_Q40** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Conditional Probability & Bayes Theorem

A bag has \(r\) red balls and \(b\) black balls. All balls are identical except for their colours. In a trial, a ball is randomly drawn from the bag, its colour is noted and the ball is placed back into the bag along with another ball of the same colour. Note that the number of balls in the bag will increase by one, after the trial. A sequence of four such trials is conducted. Which one of the following choices gives the probability of drawing a red ball in the fourth trial?

- A) \(\frac{r}{r+b}\)  ✔ official
- B) \(\frac{r}{r+b+3}\)
- C) \(\frac{r+3}{r+b+3}\)
- D) \(\left(\frac{r}{r+b}\right)\left(\frac{r+1}{r+b+1}\right)\left(\frac{r+2}{r+b+2}\right)\left(\frac{r+3}{r+b+3}\right)\)

---

**2021_FN_Q12** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Random Variables & Sampling Rules

Consider the two statements:
\(S_1\) : There exist random variables X and Y such that
\((E[(X - E(X))(Y - E(Y))])^2 > \text{Var}[X]\,\text{Var}[Y]\)
\(S_2\) : For all random variables X and Y
\(\text{Cov}[X, Y] = E[|X - E[X]| |Y - E[Y]|]\)
Which one of the following choices is correct?

- A) Both \(S_1\) and \(S_2\) are true.
- B) \(S_1\) is true, but \(S_2\) is false.
- C) \(S_1\) is false, but \(S_2\) is true.
- D) Both \(S_1\) and \(S_2\) are false.  ✔ official

---

**2021_FN_Q57** · 2021-FN · NAT · 2 marks · Medium · bank topic: Conditional Probability & Bayes Theorem · HAS A FIGURE (not shown here)

A sender (S) transmits a signal, which can be one of the two kinds: \(H\) and \(L\) with probabilities 0.1 and 0.9 respectively, to a receiver (R).
In the graph below, the weight of edge \((u, v)\) is the probability of receiving \(v\) when \(u\) is transmitted, where \(u, v \in \{H, L\}\). For example, the probability that the received signal is \(L\) given the transmitted signal was \(H\), is 0.7.

[IMAGE_Q_57_1]

If the received signal is \(H\), the probability that the transmitted signal was \(H\) (rounded to 2 decimal places) is _________.

Official answer (numeric): 0.04 to 0.04

---

**2020_FN_Q50** · 2020-FN · NAT · 2 marks · Medium · bank topic: Random Variables & Sampling Rules

For \( n > 2 \), let \( a \in \{0,1\}^n \) be a non-zero vector. Suppose that \( x \) is chosen uniformly at random from \( \{0, 1\}^n \). Then, the probability that \( \sum_{i=1}^n a_i x_i \) is an odd number is ________.

Official answer (numeric): 0.5 to 0.5

---

**2019_FN_Q16** · 2019-FN · NAT · 1 mark · Hard · bank topic: Random Variables & Sampling Rules

Two numbers are chosen independently and uniformly at random from the set {1, 2, ...,13}. The probability (rounded off to 3 decimal places) that their 4-bit (unsigned) binary representations have the same most significant bit is ________.

Official answer (numeric): 0.502 to 0.504

---

**2019_FN_Q53** · 2019-FN · NAT · 2 marks · Hard · bank topic: Random Variables & Sampling Rules

Let T be a full binary tree with 8 leaves. (A full binary tree has every level full.) Suppose two leaves \( a \) and \( b \) of T are chosen uniformly and independently at random. The expected value of the distance between \( a \) and \( b \) in T (i.e., the number of edges in the unique path between \( a \) and \( b \)) is (rounded off to 2 decimal places) ________.

Official answer (numeric): 4.25 to 4.25

---

**2019_FN_Q55** · 2019-FN · NAT · 2 marks · Hard · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

Suppose \( Y \) is distributed uniformly in the open interval (1,6). The probability that the polynomial \( 3x^2 + 6xY + 3Y + 6 \) has only real roots is (rounded off to 1 decimal place) ________.

Official answer (numeric): 0.8 to 0.8

---

**2018_FN_Q25** · 2018-FN · NAT · 1 mark · Medium · bank topic: Conditional Probability & Bayes Theorem

Two people, P and Q, decide to independently roll two identical dice, each with 6 faces, numbered 1 to 6. The person with the lower number wins. In case of a tie, they roll the dice repeatedly until there is no tie. Define a trial as a throw of the dice by P and Q. Assume that all 6 numbers on each dice are equi-probable and that all trials are independent. The probability (rounded to 3 decimal places) that one of them wins on the third trial is _____.

Official answer (numeric): 0.021 to 0.024

---

**2018_FN_Q54** · 2018-FN · NAT · 2 marks · Medium · bank topic: Conditional Probability & Bayes Theorem

Consider Guwahati (G) and Delhi (D) whose temperatures can be classified as high (\(H\)), medium (\(M\)) and low (\(L\)). Let \(P(H_G)\) denote the probability that Guwahati has high temperature. Similarly, \(P(M_G)\) and \(P(L_G)\) denotes the probability of Guwahati having medium and low temperatures respectively. Similarly, we use \(P(H_D), P(M_D)\) and \(P(L_D)\) for Delhi.
The following table gives the conditional probabilities for Delhi’s temperature given Guwahati’s temperature.
             \(H_D\)    \(M_D\)    \(L_D\)
\(H_G\)      0.40   0.48   0.12
\(M_G\)      0.10   0.65   0.25
\(L_G\)      0.01   0.50   0.49
Consider the first row in the table above. The first entry denotes that if Guwahati has high temperature (\(H_G\)) then the probability of Delhi also having a high temperature (\(H_D\)) is 0.40; i.e., \(P(H_D | H_G) = 0.40\). Similarly, the next two entries are \(P(M_D | H_G) = 0.48\) and \(P(L_D | H_G) = 0.12\). Similarly for the other rows.
If it is known that \(P(H_G) = 0.2\), \(P(M_G) = 0.5\), and \(P(L_G) = 0.3\), then the probability (correct to two decimal places) that Guwahati has high temperature given that Delhi has high temperature is _______.

Official answer (numeric): 0.60 to 0.62

---

**2017_FN_Q14** · 2017-FN · NAT · 1 mark · Medium · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

Let \(X\) be a Gaussian random variable with mean 0 and variance \(\sigma^2\). Let \(Y = \max(X, 0)\) where \(\max(a, b)\) is the maximum of \(a\) and \(b\). The median of \(Y\) is ________.

Official answer (numeric): 0.0 to 0.0

---

**2017_AN_Q37** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Conditional Probability & Bayes Theorem

P and Q are considering to apply for a job. The probability that P applies for the job is \(\frac{1}{4}\), the probability that P applies for the job given that Q applies for the job is \(\frac{1}{2}\), and the probability that Q applies for the job given that P applies for the job is \(\frac{1}{3}\). Then the probability that P does not apply for the job given that Q does not apply for the job is

- A) \(\frac{4}{5}\)  ✔ official
- B) \(\frac{5}{6}\)
- C) \(\frac{7}{8}\)
- D) \(\frac{11}{12}\)

---

**2017_AN_Q44** · 2017-AN · MCQ · 2 marks · Hard · bank topic: Random Variables & Sampling Rules

For any discrete random variable X, with probability mass function \(P(X = j) = p_j, p_j \geq 0, j \in \{0 \dots N\}\), and \(\sum_{j=0}^{N} p_j = 1\), define the polynomial function \(g_X(z) = \sum_{j=0}^{N} p_j z^j\). For a certain discrete random variable Y, there exists a scalar \(\beta \in [0, 1]\) such that \(g_Y(z) = (1 - \beta + \beta z)^N\). The expectation of Y is

- A) \(N\beta(1 - \beta)\)
- B) \(N\beta\)  ✔ official
- C) \(N(1 - \beta)\)
- D) Not expressible in terms of \(N\) and \(\beta\) alone

---

**2017_AN_Q52** · 2017-AN · NAT · 2 marks · Medium · bank topic: Standard Distributions (Poisson, Binomial)

If a random variable X has a Poisson distribution with mean 5, then the expectation \(E[(X + 2)^2]\) equals ________.

Official answer (numeric): 54.0 to 54.0

