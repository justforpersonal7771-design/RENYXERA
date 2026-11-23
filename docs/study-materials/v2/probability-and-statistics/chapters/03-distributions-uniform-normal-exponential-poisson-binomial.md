# Review input: Probability and Statistics, chapter 03: Distributions: uniform, normal, exponential, Poisson, binomial

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-03-distributions-uniform-normal-exponential-poisson-binomial.md` and `gemini-03-distributions-uniform-normal-exponential-poisson-binomial.md` in this folder.

*Note: chapters are matched to PYQs by the words in their titles, so a question can appear in more than one chapter. Say which chapter it really belongs to.*

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

This is **one chapter** (3 of 4) of the Probability and Statistics book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

In addition to Parts 1 to 4 of the instructions above, answer these chapter-specific parts:

PART 5. THE FULL LESSON PLAN FOR THIS CHAPTER
 Propose the complete list of lessons (each = 45 to 90 minutes of reading). For each lesson give: title; tag [MUST]/[SHOULD]/[LATER] with a reason; prerequisites; beginner must-see; finer points; GATE-level items; diagrams needed (kind + what it shows); hand traces; common mistakes.

PART 6. THE PYQs BELOW
 For EACH previous-year question listed below: (a) which lesson of your plan it belongs to, (b) the exact concept it tests, (c) the trap or finer point, (d) whether the official answer is correct (re-solve it; if you disagree, show the working and say "FACT-DOUBT"), (e) whether the question text looks mis-transcribed.

PART 7. MORE QUESTIONS
 For each lesson, list the question types GATE could ask that are NOT covered by the PYQs below (give 3 ideas each, one line each).

PART 8. WHAT IS MISSING FROM THIS CHAPTER'S SCOPE
 Topics GATE has asked (or could ask) about this chapter that the draft chapter list does not cover.
```

---

## PART B. THE CHAPTER

## Chapter details

Existing chapter in the app: **Distributions: uniform, normal, exponential, Poisson, binomial**. Not written yet.



## The PYQs for this chapter (9)

**2026_AN_Q14** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

The probability density function \( f(x) \) of a random variable \( X \) which takes real values is
$$ f(x) = \frac{1}{3\sqrt{2\pi}} \exp\left(-\frac{x^2}{18}\right), \; x \in (-\infty, +\infty) $$
Which one of the following statements is correct about the random variable .. ?

- A) \( X \) is an exponential random variable
- B) \( X \) is a normal random variable  ✔ official
- C) \( X \) is a Poisson random variable
- D) \( X \) is a uniform random variable

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

**2025_AN_Q65** · 2025-AN · NAT · 2 marks · Hard · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

The unit interval (0,1) is divided at a point chosen uniformly distributed over (0,1) in R into two disjoint subintervals.
The expected length of the subinterval that contains 0.4 is ________.
(rounded off to two decimal places)

Official answer (numeric): 0.70 to 0.80

---

**2021_FN_Q32** · 2021-FN · NAT · 1 mark · Medium · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

The lifetime of a component of a certain type is a random variable whose probability density function is exponentially distributed with parameter 2. For a randomly picked component of this type, the probability that its lifetime exceeds the expected lifetime (rounded to 2 decimal places) is _________.

Official answer (numeric): 0.35 to 0.39

---

**2021_AN_Q15** · 2021-AN · NAT · 1 mark · Easy · bank topic: Standard Distributions (Poisson, Binomial)

For a given biased coin, the probability that the outcome of a toss is a head is 0.4. This coin is tossed 1,000 times. Let \(X\) denote the random variable whose value is the number of times that head appeared in these 1,000 tosses. The standard deviation of \(X\) (rounded to 2 decimal places) is _________.

Official answer (numeric): 15.00 to 16.00

---

**2019_FN_Q55** · 2019-FN · NAT · 2 marks · Hard · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

Suppose \( Y \) is distributed uniformly in the open interval (1,6). The probability that the polynomial \( 3x^2 + 6xY + 3Y + 6 \) has only real roots is (rounded off to 1 decimal place) ________.

Official answer (numeric): 0.8 to 0.8

---

**2017_FN_Q14** · 2017-FN · NAT · 1 mark · Medium · bank topic: Continuous/Discrete Distributions (Uniform, Normal, Exponential)

Let \(X\) be a Gaussian random variable with mean 0 and variance \(\sigma^2\). Let \(Y = \max(X, 0)\) where \(\max(a, b)\) is the maximum of \(a\) and \(b\). The median of \(Y\) is ________.

Official answer (numeric): 0.0 to 0.0

---

**2017_AN_Q52** · 2017-AN · NAT · 2 marks · Medium · bank topic: Standard Distributions (Poisson, Binomial)

If a random variable X has a Poisson distribution with mean 5, then the expectation \(E[(X + 2)^2]\) equals ________.

Official answer (numeric): 54.0 to 54.0

