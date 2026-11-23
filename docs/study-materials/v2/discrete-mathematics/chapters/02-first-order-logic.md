# Review input: Discrete Mathematics, chapter 02: First-order logic

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-02-first-order-logic.md` and `gemini-02-first-order-logic.md` in this folder.

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

This is **one chapter** (2 of 8) of the Discrete Mathematics book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **First-order logic**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (14)

**2026_AN_Q11** · 2026-AN · MCQ · 1 mark · Medium · bank topic: Propositional and First-Order Quantifier Logic

For two different persons \( x \) and \( y \), the predicate \( M(x, y) \) denotes that \( x \) knows \( y \). Consider the following statement.
There is a person who does not know anyone else, but that person is known by everyone else.
Which one of the following expressions represents the above statement?

- A) \( (\exists y) (\forall x) ((x \neq y) \rightarrow (M(x, y) \land \neg M(y, x))) \)  ✔ official
- B) \( (\forall y) (\exists x) ((x \neq y) \rightarrow (M(x, y) \land \neg M(y, x))) \)
- C) \( (\exists y) (\exists x) ((x \neq y) \rightarrow (M(x, y) \land \neg M(y, x))) \)
- D) \( (\forall y) (\forall x) ((x \neq y) \rightarrow (M(x, y) \land \neg M(y, x))) \)

---

**2025_AN_Q15** · 2025-AN · MCQ · 1 mark · Hard · bank topic: Propositional and First-Order Quantifier Logic

Let \( P(x) \) be an arbitrary predicate over the domain of natural numbers.
Which ONE of the following statements is TRUE?

- A) \( (P(0) \land (\forall x [P(x) \Rightarrow P(x + 1)])) \Rightarrow (\forall x P(x)) \)  ✔ official
- B) \( (P(0) \land (\forall x [P(x) \Rightarrow P(x - 1)])) \Rightarrow (\forall x P(x)) \)
- C) \( (P(1000) \land (\forall x [P(x) \Rightarrow P(x - 1)])) \Rightarrow (\forall x P(x)) \)
- D) \( (P(1000) \land (\forall x [P(x) \Rightarrow P(x + 1)])) \Rightarrow (\forall x P(x)) \)

---

**2025_FN_Q48** · 2025-FN · MSQ · 2 marks · Hard · bank topic: Propositional and First-Order Quantifier Logic

Which of the following predicate logic formulae/formula is/are CORRECT representation(s) of the statement: “Everyone has exactly one mother”?
The meanings of the predicates used are:
• \( \text{mother}(y, x) \): \( y \) is the mother of \( x \)
• \( \text{noteq}(x, y) \): \( x \) and \( y \) are not equal

- A) \( \forall x \exists y \exists z (\text{mother}(y, x) \land \neg\text{mother}(z, x)) \)
- B) \( \forall x \exists y [\text{mother}(y, x) \land \forall z (\text{noteq}(z, y) \rightarrow \neg\text{mother}(z, x))] \)  ✔ official
- C) \( \forall x \forall y [\text{mother}(y, x) \rightarrow \exists z (\text{mother}(z, x) \land \neg\text{noteq}(z, y))] \)
- D) \( \forall x \exists y [\text{mother}(y, x) \land \neg\exists z (\text{noteq}(z, y) \land \text{mother}(z, x))] \)  ✔ official

---

**2024_AN_Q26** · 2024-AN · MCQ · 1 mark · Easy · bank topic: Propositional and First-Order Quantifier Logic

Let \( p \) and \( q \) be the following propositions:
\( p \) : Fail grade can be given.
\( q \) : Student scores more than 50% marks.
Consider the statement: “*Fail grade cannot be given when student scores more than 50%marks.*”
Which one of the following is the CORRECT representation of the above statement in propositional logic?

- A) \( p \rightarrow \neg q \)  ✔ official
- B) \( q \rightarrow p \)
- C) \( p \rightarrow q \)
- D) \( \neg p \rightarrow q \)

---

**2023_FN_Q26** · 2023-FN · MSQ · 1 mark · Hard · bank topic: Propositional and First-Order Quantifier Logic

Geetha has a conjecture about integers, which is of the form \( \forall x (P(x) \Rightarrow \exists y Q(x, y)) \), where \( P \) is a statement about integers, and \( Q \) is a statement about pairs of integers.
Which of the following (one or more) option(s) would imply Geetha's conjecture?

- A) \( \exists x (P(x) \land \forall y Q(x, y)) \)
- B) \( \forall x \forall y Q(x, y) \)  ✔ official
- C) \( \exists y \forall x (P(x) \Rightarrow Q(x, y)) \)  ✔ official
- D) \( \exists x (P(x) \land \exists y Q(x, y)) \)

---

**2021_FN_Q27** · 2021-FN · MCQ · 1 mark · Medium · bank topic: Propositional and First-Order Quantifier Logic

Let \(p\) and \(q\) be two propositions. Consider the following two formulae in propositional logic.
\(S_1 : (\neg p \land (p \lor q)) \rightarrow p\)
\(S_2 : q \rightarrow (\neg p \land (p \lor q))\)
Which one of the following choices is correct?

- A) Both \(S_1\) and \(S_2\) are tautologies.
- B) \(S_1\) is a tautology but \(S_2\) is not a tautology.  ✔ official
- C) \(S_1\) is not a tautology but \(S_2\) is a tautology.
- D) Neither \(S_1\) nor \(S_2\) is a tautology.

---

**2021_AN_Q60** · 2021-AN · MSQ · 1 mark · Medium · bank topic: Propositional and First-Order Quantifier Logic

Choose the correct choice(s) regarding the following propositional logic assertion \(S\):
$$ S : ((P \land Q) \rightarrow R) \rightarrow ((P \land Q) \rightarrow (Q \rightarrow R)) $$

- A) \(S\) is neither a tautology nor a contradiction.
- B) \(S\) is a tautology.  ✔ official
- C) \(S\) is a contradiction.
- D) The antecedent of \(S\) is logically equivalent to the consequent of \(S\).  ✔ official

---

**2020_FN_Q46** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Propositional and First-Order Quantifier Logic

Which one of the following predicate formulae is NOT logically valid?
Note that \( W \) is a predicate formula without any free occurrence of \( x \).

- A) \( \forall x(p(x) \lor W) \equiv \forall x p(x) \lor W \)
- B) \( \exists x(p(x) \land W) \equiv \exists x p(x) \land W \)
- C) \( \forall x(p(x) \rightarrow W) \equiv \forall x p(x) \rightarrow W \)  ✔ official
- D) \( \exists x(p(x) \rightarrow W) \equiv \forall x p(x) \rightarrow W \)

---

**2019_FN_Q54** · 2019-FN · MCQ · 2 marks · Hard · bank topic: Propositional and First-Order Quantifier Logic

Consider the first order predicate formula:
\( \forall x[(\forall z \; z|x \Rightarrow ((z = x) \lor (z = 1))) \Rightarrow \exists w (w > x) \land (\forall z \; z|w \Rightarrow ((w = z) \lor (z = 1)))] \)
Here ‘\( a|b \)’ denotes that ‘\( a \) divides \( b \)’, where \( a \) and \( b \) are integers. Consider the following sets:
\( S_1 \): \( \{1, 2, 3, ..., 100\} \)
\( S_2 \): Set of all positive integers
\( S_3 \): Set of all integers
Which of the above sets satisfy \( \phi \)?

- A) \( S_1 \) and \( S_2 \)
- B) \( S_1 \) and \( S_3 \)
- C) \( S_2 \) and \( S_3 \)  ✔ official
- D) \( S_1 \), \( S_2 \) and \( S_3 \)

---

**2018_FN_Q38** · 2018-FN · MCQ · 2 marks · Hard · bank topic: Propositional and First-Order Quantifier Logic

Consider the first-order logic sentence
\(\varphi \equiv \exists s \exists t \exists u \forall v \forall w \forall x \forall y \psi(s, t, u, v, w, x, y)\)
where \(\psi(s, t, u, v, w, x, y)\) is a quantifier-free first-order logic formula using only predicate symbols, and possibly equality, but no function symbols. Suppose \(\varphi\) has a model with a universe containing 7 elements.
Which one of the following statements is necessarily true?

- A) There exists at least one model of \(\varphi\) with universe of size less than or equal to 3.  ✔ official
- B) There exists no model of \(\varphi\) with universe of size less than or equal to 3.
- C) There exists no model of \(\varphi\) with universe of size greater than 7.
- D) Every model of \(\varphi\) has a universe of size equal to 7.

---

**2017_FN_Q29** · 2017-FN · MCQ · 1 mark · Easy · bank topic: Propositional and First-Order Quantifier Logic

The statement \((\neg p) \Rightarrow (\neg q)\) is logically equivalent to which of the statements below?
I. \(p \Rightarrow q\)
II. \(q \Rightarrow p\)
III. \((\neg q) \vee p\)
IV. \((\neg p) \vee q\)

- A) I only
- B) I and IV only
- C) II only
- D) II and III only  ✔ official

---

**2017_FN_Q15** · 2017-FN · MCQ · 1 mark · Hard · bank topic: Propositional and First-Order Quantifier Logic

Consider the first-order logic sentence \(F : \forall x(\exists y R(x, y))\). Assuming non-empty logical domains, which of the sentences below are implied by \(F\)?
I. \(\exists y(\exists x R(x, y))\)
II. \(\exists y(\forall x R(x, y))\)
III. \(\forall y(\exists x R(x, y))\)
IV. \(\neg \exists x(\forall y \neg R(x, y))\)

- A) IV only
- B) I and IV only  ✔ official
- C) II only
- D) II and III only

---

**2017_AN_Q31** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Propositional and First-Order Quantifier Logic

Let p, q, r denote the statements "\textit{It is raining}", "\textit{It is cold}", and "\textit{It is pleasant}", respectively. Then the statement "\textit{It is not raining and it is pleasant, and it is not pleasant only if it is raining and it is cold}" is represented by

- A) \((\neg p \wedge r) \wedge (\neg r \rightarrow (p \wedge q))\)  ✔ official
- B) \((\neg p \wedge r) \wedge ((p \wedge q) \rightarrow \neg r)\)
- C) \((\neg p \wedge r) \vee ((p \wedge q) \rightarrow \neg r)\)
- D) \((\neg p \wedge r) \vee (r \rightarrow (p \wedge q))\)

---

**2017_FN_Q55** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Propositional and First-Order Quantifier Logic

Let \(p\), \(q\) and \(r\) be propositions and the expression \((p \rightarrow q) \rightarrow r\) be a contradiction. Then, the expression \((r \rightarrow p) \rightarrow q\) is

- A) a tautology
- B) a contradiction
- C) always TRUE when \(p\) is FALSE
- D) always TRUE when \(q\) is TRUE  ✔ official

