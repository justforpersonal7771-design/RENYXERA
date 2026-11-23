# Review input: Theory of Computation, chapter 04: Context-free languages: closure and pumping lemma

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-04-context-free-languages-closure-and-pumping-lemma.md` and `gemini-04-context-free-languages-closure-and-pumping-lemma.md` in this folder.

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

This is **one chapter** (4 of 6) of the Theory of Computation book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Context-free languages: closure and pumping lemma**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (39)

**2026_FN_Q25** · 2026-FN · MSQ · 1 mark · Hard · bank topic: Context-Free Grammars & Push-Down Automata

Consider the following grammar where \( S \) is the start symbol, and \( a \) and \( b \) are terminal symbols.
\( S \rightarrow aSbS \mid bS \mid \epsilon \)
Which of the following statements is/are true?

- A) The grammar is ambiguous.  ✔ official
- B) The string \( abb \) has two distinct derivations in this grammar.  ✔ official
- C) The string \( abab \) has only one rightmost derivation.  ✔ official
- D) The language generated by the grammar is undecidable.

---

**2026_AN_Q29** · 2026-AN · MSQ · 1 mark · Medium · bank topic: Context-Free Grammars & Push-Down Automata

Which of the following grammars is/are ambiguous?

- A) \( S \rightarrow aSb \mid \epsilon \)
- B) \( E \rightarrow E + E \mid E * E \mid \text{id} \)  ✔ official
- C) \( S \rightarrow aS \mid Sa \mid \epsilon \)  ✔ official
- D) \( S \rightarrow aS \mid \epsilon \)

---

**2026_AN_Q48** · 2026-AN · MSQ · 2 marks · Hard · bank topic: Regular and Context-Free Languages & Pumping Lemma

Let \( \Sigma = \{a, b, c, d\} \) and let \( L = \{a^i b^j c^k d^l \mid i, j, k, l \ge 0\} \).
Which of the following constraints ensure(s) that the language \( L \) is context-free?

- A) \( i + k = j + l \)  ✔ official
- B) \( i = k \) and \( j = l \)
- C) \( i = l \) and \( j = k \)  ✔ official
- D) \( i + j = k + l \)  ✔ official

---

**2026_FN_Q51** · 2026-FN · MSQ · 2 marks · Easy · bank topic: Regular and Context-Free Languages & Pumping Lemma

Let \( L_1 \) and \( L_2 \) be two languages over a finite alphabet, such that \( L_1 \cap L_2 \) and \( L_2 \) are regular languages.
Which of the following statements is/are always true?

- A) \( L_1 \) is regular
- B) \( L_1 \cup L_2 \) is regular
- C) \( \overline{L_2} \) is context free  ✔ official
- D) \( L_1 \) is context free

---

**2026_FN_Q52** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Context-Free Grammars & Push-Down Automata

Consider the following context-free grammar \( G \):
\( S \rightarrow abaaBAbba \)
\( A \rightarrow aaBBAb \mid bBabaa \)
\( B \rightarrow aBb \mid ab \)
In the above grammar, \( S \) is the start symbol, \( a \) and \( b \) are terminal symbols, and \( A \) and \( B \) are non-terminal symbols.
Let \( L(G) \) be the language generated by the grammar \( G \). For a string \( s \in L(G) \), let \( n_1(s) \) be the number of a's in \( s \) and \( n_2(s) \) be the number of b's in \( s \).
Which of the following statements is/are true?

- A) There is a string \( s \in L(G) \) such that \( n_1(s) < n_2(s) \)
- B) For every string \( s \in L(G) \), \( n_1(s) \ge n_2(s) \)  ✔ official
- C) There is a string \( s \in L(G) \) such that \( n_1(s) > 2n_2(s) \)
- D) For every string \( s \in L(G) \), \( n_1(s) \le 2n_2(s) \)  ✔ official

---

**2025_FN_Q19** · 2025-FN · MCQ · 1 mark · Medium · bank topic: Context-Free Grammars & Push-Down Automata

Consider the following context-free grammar \( G \), where \( S, A, \) and \( B \) are the variables (non-terminals), \( a \) and \( b \) are the terminal symbols, \( S \) is the start variable, and the rules of \( G \) are described as:
\( S \rightarrow aaB \mid Abb \)
\( A \rightarrow a \mid aA \)
\( B \rightarrow b \mid bB \)
Which ONE of the languages \( L(G) \) is accepted by \( G \)?

- A) \( L(G) = \{a^2 b^n \mid n \ge 1\} \cup \{a^n b^2 \mid n \ge 1\} \)  ✔ official
- B) \( L(G) = \{a^n b^{2n} \mid n \ge 1\} \cup \{a^{2n} b^n \mid n \ge 1\} \)
- C) \( L(G) = \{a^n b^n \mid n \ge 1\} \)
- D) \( L(G) = \{a^{2n} b^{2n} \mid n \ge 1\} \)

---

**2025_AN_Q24** · 2025-AN · MCQ · 1 mark · Easy · bank topic: Context-Free Grammars & Push-Down Automata

Which ONE of the following languages is accepted by a deterministic pushdown automaton?

- A) Any regular language.  ✔ official
- B) Any context-free language.
- C) Any language accepted by a non-deterministic pushdown automaton.
- D) Any decidable language.

---

**2025_AN_Q30** · 2025-AN · MSQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the two lists List-I and List-II given below:
List-I
(i) Context free languages
(ii) Recursive languages
(iii) Regular languages
List-II
(a) Closed under union
(b) Not closed under complementation
(c) Closed under intersection
For matching of items in List-I with those in List-II, which of the following option(s) is/are CORRECT?

- A) (i) - (a), (ii) - (b), and (iii) - (c)
- B) (i) - (b), (ii) - (a), and (iii) - (c)  ✔ official
- C) (i) - (b), (ii) - (c), and (iii) - (a)  ✔ official
- D) (i) - (a), (ii) - (c), and (iii) - (b)

---

**2025_FN_Q44** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the following two languages over the alphabet \( \{a, b\} \):
\( L_1 = \{\alpha\beta\alpha \mid \alpha \in \{a, b\}^+ \text{ AND } \beta \in \{a, b\}^+\} \)
\( L_2 = \{\alpha\beta\alpha \mid \alpha \in \{a\}^+ \text{ AND } \beta \in \{a, b\}^+\} \)
Which ONE of the following statements is CORRECT?

- A) Both \( L_1 \) and \( L_2 \) are regular languages.
- B) \( L_1 \) is a regular language but \( L_2 \) is not a regular language.
- C) \( L_1 \) is not a regular language but \( L_2 \) is a regular language.  ✔ official
- D) Neither \( L_1 \) nor \( L_2 \) is a regular language.

---

**2025_FN_Q45** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the following two languages over the alphabet \( \{a, b, c\} \), where \( m \) and \( n \) are natural numbers.
\( L_1 = \{a^m b^m c^{m + n} \mid m, n \ge 1\} \)
\( L_2 = \{a^m b^n c^{m + n} \mid m, n \ge 1\} \)
Which ONE of the following statements is CORRECT?

- A) Both \( L_1 \) and \( L_2 \) are context-free languages.
- B) \( L_1 \) is a context-free language but \( L_2 \) is not a context-free language.
- C) \( L_1 \) is not a context-free language but \( L_2 \) is a context-free language.  ✔ official
- D) Neither \( L_1 \) nor \( L_2 \) are context-free languages.

---

**2025_AN_Q52** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Let \( \Sigma = \{a, b, c\} \). For \( x \in \Sigma^* \), and \( \alpha \in \Sigma \), let \( \#_\alpha(x) \) denote the number of occurrences of \( \alpha \) in \( x \). Which one or more of the following option(s) define(s) regular language(s)?

- A) \( \{a^m b^n \mid m, n \ge 0\} \)  ✔ official
- B) \( \{a, b\}^* \cap \{a^m b^n c^{m - n} \mid m \ge n \ge 0\} \)
- C) \( \{w \mid w \in \{a, b\}^*, \#_a(w) = 2 \pmod 7, \text{ and } \#_b(w) = 3 \pmod 9\} \)  ✔ official
- D) \( \{w \mid w \in \{a, b\}^*, \#_a(w) = 2 \pmod 7, \text{ and } \#_a(w) = \#_b(w)\} \)

---

**2024_FN_Q16** · 2024-FN · MSQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Let \( L_1, L_2 \) be two regular languages and \( L_3 \) a language which is not regular. Which of the following statements is/are always TRUE?

- A) \( L_1 = L_2 \) if and only if \( L_1 \cap \overline{L_3} = \phi \)
- B) \( L_1 \cup L_3 \) is not regular
- C) \( \overline{L_3} \) is not regular  ✔ official
- D) \( \overline{L_1 \cup L_2} \) is regular  ✔ official

---

**2024_AN_Q42** · 2024-AN · MSQ · 2 marks · Medium · bank topic: Context-Free Grammars & Push-Down Automata

Consider a context-free grammar \( G \) with the following 3 rules.
\( S \rightarrow aS \)
\( S \rightarrow aSbS \)
\( S \rightarrow c \)
Let \( w \in L(G) \). Let \( n_a(w), n_b(w), n_c(w) \) denote the number of times \( a, b, c \) occur in \( w \), respectively. Which of the following statements is/are TRUE?

- A) \( n_a(w) > n_b(w) \)
- B) \( n_a(w) > n_c(w) - 2 \)  ✔ official
- C) \( n_c(w) = n_b(w) + 1 \)  ✔ official
- D) \( n_c(w) = n_b(w) * 2 \)

---

**2024_FN_Q48** · 2024-FN · NAT · 2 marks · Medium · bank topic: Context-Free Grammars & Push-Down Automata

Let \( G = (V, \Sigma, S, P) \) be a context-free grammar in Chomsky Normal Form with \( \Sigma = \{a, b, c\} \) and \( V \) containing 10 variable symbols including the start symbol \( S \). The string \( w = a^{30} b^{30} c^{30} \) is derivable from \( S \). The number of steps (application of rules) in the derivation \( S \rightarrow^* w \) is ________.

Official answer (numeric): 179 to 179

---

**2023_FN_Q24** · 2023-FN · MSQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Which of the following statements is/are CORRECT?

- A) The intersection of two regular languages is regular.  ✔ official
- B) The intersection of two context-free languages is context-free.
- C) The intersection of two recursive languages is recursive.  ✔ official
- D) The intersection of two recursively enumerable languages is recursively enumerable.  ✔ official

---

**2023_FN_Q39** · 2023-FN · MCQ · 2 marks · Medium · bank topic: Context-Free Grammars & Push-Down Automata

Consider the context-free grammar \( G \) below:
\( S \rightarrow aSb \mid X \)
\( X \rightarrow aX \mid Xb \mid a \mid b \)
where \( S \) and \( X \) are non-terminals, and \( a \) and \( b \) are terminal symbols. The starting non-terminal is \( S \).
Which one of the following statements is CORRECT?

- A) The language generated by \( G \) is \( (a + b)^* \)
- B) The language generated by \( G \) is \( a^*(a + b)b^* \)  ✔ official
- C) The language generated by \( G \) is \( a^*b^*(a + b) \)
- D) The language generated by \( G \) is not a regular language

---

**2023_FN_Q40** · 2023-FN · MCQ · 2 marks · Hard · bank topic: Context-Free Grammars & Push-Down Automata · HAS A FIGURE (not shown here)

Consider the pushdown automaton (PDA) \( P \) below, which runs on the input alphabet \( \{a, b\} \), has stack alphabet \( \{\perp, A\} \), and has three states \( \{s, p, q\} \), with \( s \) being the start state. A transition from state \( u \) to state \( v \), labelled \( c \mid X / \gamma \), where \( c \) is an input symbol or \( \epsilon \), \( X \) is a stack symbol, and \( \gamma \) is a string of stack symbols, represents the fact that in state \( u \), the PDA can read \( c \) from the input, with \( X \) on the top of its stack, pop \( X \) from the stack, push in the string \( \gamma \) on the stack, and go to state \( v \). In the initial configuration, the stack has only the symbol \( \perp \) in it. The PDA accepts by empty stack.
[IMAGE_Q_40_1]
Which one of the following options correctly describes the language accepted by \( P \)?

- A) \( \{a^m b^n \mid 1 \le m \text{ and } n < m\} \)  ✔ official
- B) \( \{a^m b^n \mid 0 \le n \le m\} \)
- C) \( \{a^m b^n \mid 0 \le m \text{ and } 0 \le n\} \)
- D) \( \{a^m \mid 0 \le m\} \cup \{b^n \mid 0 \le n\} \)

---

**2022_FN_Q47** · 2022-FN · MSQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the following languages:
\(L_1 = \{a^n wa^n \mid w \in \{a, b\}^*\}\)
\(L_2 = \{wxw^R \mid w, x \in \{a, b\}^*, |w|, |x| > 0\}\)
Note that \(w^R\) is the reversal of the string \(w\). Which of the following is/are TRUE?

- A) \(L_1\) and \(L_2\) are regular.  ✔ official
- B) \(L_1\) and \(L_2\) are context-free.  ✔ official
- C) \(L_1\) is regular and \(L_2\) is context-free.  ✔ official
- D) \(L_1\) and \(L_2\) are context-free but not regular.

---

**2022_FN_Q48** · 2022-FN · MSQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the following languages:
\(L_1 = \{ww \mid w \in \{a, b\}^*\}\)
\(L_2 = \{a^n b^n c^m \mid m, n \geq 0\}\)
\(L_3 = \{a^m b^n c^n \mid m, n \geq 0\}\)
Which of the following statements is/are FALSE?

- A) \(L_1\) is not context-free but \(L_2\) and \(L_3\) are deterministic context-free.
- B) Neither \(L_1\) nor \(L_2\) is context-free.  ✔ official
- C) \(L_2\), \(L_3\) and \(L_2 \cap L_3\) all are context-free.  ✔ official
- D) Neither \(L_1\) nor its complement is context-free.  ✔ official

---

**2021_FN_Q19** · 2021-FN · MCQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Suppose that \(L_1\) is a regular language and \(L_2\) is a context-free language. Which one of the following languages is NOT necessarily context-free?

- A) \(L_1 \cap L_2\)
- B) \(L_1 \cdot L_2\)
- C) \(L_1 - L_2\)  ✔ official
- D) \(L_1 \cup L_2\)

---

**2021_AN_Q54** · 2021-AN · MSQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Let \(L_1\) be a regular language and \(L_2\) be a context-free language. Which of the following languages is/are context-free?

- A) \(L_1 \cap \overline{L_2}\)
- B) \(\overline{\overline{L_1} \cup \overline{L_2}}\)  ✔ official
- C) \(L_1 \cup (L_2 \cup \overline{L_2})\)  ✔ official
- D) \((L_1 \cap L_2) \cup (\overline{L_1} \cap L_2)\)  ✔ official

---

**2021_AN_Q23** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the following two statements about regular languages:
\(S_1\) : Every infinite regular language contains an undecidable language as a subset.
\(S_2\) : Every finite language is regular.
Which one of the following choices is correct?

- A) Only \(S_1\) is true.
- B) Only \(S_2\) is true.
- C) Both \(S_1\) and \(S_2\) are true.  ✔ official
- D) Neither \(S_1\) nor \(S_2\) is true.

---

**2021_AN_Q18** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

For a string \(w\), we define \(w^R\) to be the reverse of \(w\). For example, if \(w = 01101\) then \(w^R = 10110\). Which of the following languages is/are context-free?

- A) \(\{wxw^R x^R \mid w, x \in \{0, 1\}^*\}\)
- B) \(\{ww^R xx^R \mid w, x \in \{0, 1\}^*\}\)  ✔ official
- C) \(\{wxw^R \mid w, x \in \{0, 1\}^*\}\)  ✔ official
- D) \(\{wxxw^R w^R \mid w, x \in \{0, 1\}^*\}\)  ✔ official

---

**2021_FN_Q18** · 2021-FN · NAT · 2 marks · Hard · bank topic: Context-Free Grammars & Push-Down Automata · HAS A FIGURE (not shown here)

In a pushdown automaton \(P = (Q, \Sigma, \Gamma, \delta, q_0, F)\), a transition of the form,

[IMAGE_Q_18_1]

where \(p, q \in Q\), \(a \in \Sigma \cup \{\epsilon\}\), and \(X, Y \in \Gamma \cup \{\epsilon\}\), represents \((q, Y) \in \delta(p, a, X)\)
Consider the following pushdown automaton over the input alphabet \(\Sigma \{a, b\}\) and stack alphabet \(\Gamma = \{\#, A\}\).

[IMAGE_Q_18_2]

The number of strings of length 100 accepted by the above pushdown automaton is _________.

Official answer (numeric): 50 to 50

---

**2020_FN_Q19** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the following statements:
I. If \( L_1 \cup L_2 \) is regular, then both \( L_1 \) and \( L_2 \) must be regular.
II. The class of regular languages is closed under infinite union.
Which of the above statements is/are TRUE?

- A) I only
- B) II only
- C) Both I and II
- D) Neither I nor II  ✔ official

---

**2020_FN_Q24** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the language \( L = \{a^n \mid n \ge 0\} \cup \{a^nb^n \mid n \ge 0\} \) and the following statements.
I. \( L \) is deterministic context-free.
II. \( L \) is context-free but not deterministic context-free.
III. \( L \) is not LL(\( k \)) for any \( k \).
Which of the above statements is/are TRUE?

- A) I only
- B) II only
- C) I and III only  ✔ official
- D) III only

---

**2020_FN_Q60** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the following languages.
\( L_1 = \{wxyx \mid w, x, y \in (0 + 1)^+\} \)
\( L_2 = \{xy \mid x, y \in (a + b)^*, |x| = |y|, x \neq y\} \)
Which one of the following is TRUE?

- A) \( L_1 \) is regular and \( L_2 \) is context-free.  ✔ official
- B) \( L_1 \) is context-free but not regular and \( L_2 \) is context-free.
- C) Neither \( L_1 \) nor \( L_2 \) is context-free.
- D) \( L_1 \) is context-free but \( L_2 \) is not context-free.

---

**2019_FN_Q30** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

If \( L \) is a regular language over \( \Sigma = \{a, b\} \), which one of the following languages is NOT regular?

- A) \( L \cdot L^R = \{xy \mid x \in L, y^R \in L\} \)
- B) \( \{ww^R \mid w \in L\} \)  ✔ official
- C) Prefix \( (L) = \{x \in \Sigma^* \mid \exists y \in \Sigma^* \text{ such that } xy \in L\} \)
- D) Suffix \( (L) = \{y \in \Sigma^* \mid \exists x \in \Sigma^* \text{ such that } xy \in L\} \)

---

**2019_FN_Q28** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

For \( \Sigma = \{a, b\} \), let us consider the regular language \( L = \{x \mid x = a^{2+3k} \text{ or } x = b^{10+12k}, k \ge 0\} \). Which one of the following can be a pumping length (the constant guaranteed by the pumping lemma) for \( L \)?

- A) 3
- B) 5
- C) 9
- D) 24  ✔ official

---

**2019_FN_Q39** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Which one of the following languages over \( \Sigma = \{a, b\} \) is NOT context-free?

- A) \( \{ww^R \mid w \in \{a, b\}^*\} \)
- B) \( \{wa^nb^nw^R \mid w \in \{a, b\}^*, n \ge 0\} \)
- C) \( \{wa^nw^Rb^n \mid w \in \{a, b\}^*, n \ge 0\} \)  ✔ official
- D) \( \{a^nb^i \mid i \in \{n, 3n, 5n\}, n \ge 0\} \)

---

**2018_FN_Q45** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the following languages:
I. \(\{a^m b^n c^p d^q \mid m + p = n + q, \text{ where } m, n, p, q \geq 0\}\)
II. \(\{a^m b^n c^p d^q \mid m = n \text{ and } p = q, \text{ where } m, n, p, q \geq 0\}\)
III. \(\{a^m b^n c^p d^q \mid m = n = p \text{ and } p \neq q, \text{ where } m, n, p, q \geq 0\}\)
IV. \(\{a^m b^n c^p d^q \mid mn = p + q, \text{ where } m, n, p, q \geq 0\}\)
Which of the languages above are context-free?

- A) I and IV only
- B) I and II only  ✔ official
- C) II and III only
- D) II and IV only

---

**2017_AN_Q24** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Let \(L_1, L_2\) be any two context-free languages and \(R\) be any regular language. Then which of the following is/are CORRECT?
I. \(L_1 \cup L_2\) is context-free.
II. \(\overline{L}_1\) is context-free.
III. \(L_1 - R\) is context-free.
IV. \(L_1 \cap L_2\) is context-free.

- A) I, II and IV only
- B) I and III only  ✔ official
- C) II and IV only
- D) I only

---

**2017_FN_Q22** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Context-Free Grammars & Push-Down Automata

Consider the following context-free grammar over the alphabet \(\Sigma = \{a, b, c\}\) with \(S\) as the start symbol:
\(S \rightarrow abScT \mid abcT\)
\(T \rightarrow bT \mid b\)
Which one of the following represents the language generated by the above grammar?

- A) \(\{(ab)^n (cb)^n \mid n \geq 1\}\)
- B) \(\{(ab)^n cb^{m_1} cb^{m_2} \dots cb^{m_n} \mid n, m_1, m_2, \dots, m_n \geq 1\}\)  ✔ official
- C) \(\{(ab)^n (cb^m)^n \mid m, n \geq 1\}\)
- D) \(\{(ab)^n (cb^n)^m \mid m, n \geq 1\}\)

---

**2017_AN_Q11** · 2017-AN · MCQ · 1 mark · Medium · bank topic: Context-Free Grammars & Push-Down Automata

Identify the language generated by the following grammar, where \(S\) is the start variable.
\(S \rightarrow XY\)
\(X \rightarrow aX \mid a\)
\(Y \rightarrow aYb \mid \epsilon\)

- A) \(\{a^m b^n \mid m \geq n, n > 0\}\)
- B) \(\{a^m b^n \mid m \geq n, n \geq 0\}\)
- C) \(\{a^m b^n \mid m > n, n \geq 0\}\)  ✔ official
- D) \(\{a^m b^n \mid m > n, n > 0\}\)

---

**2017_FN_Q46** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Context-Free Grammars & Push-Down Automata

If \(G\) is a grammar with productions
\(S \rightarrow SaS \mid aSb \mid bSa \mid SS \mid \epsilon\)
where \(S\) is the start variable, then which one of the following strings is not generated by \(G\)?

- A) \(abab\)
- B) \(aaab\)
- C) \(abbaa\)
- D) \(babba\)  ✔ official

---

**2017_FN_Q40** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the context-free grammars over the alphabet \(\{a, b, c\}\) given below. \(S\) and \(T\) are non-terminals.
\(G_1 : S \rightarrow aSb \mid T, T \rightarrow cT \mid \epsilon\)
\(G_2 : S \rightarrow bSa \mid T, T \rightarrow cT \mid \epsilon\)
The language \(L(G_1) \cap L(G_2)\) is

- A) Finite
- B) Not finite but regular  ✔ official
- C) Context-Free but not regular
- D) Recursive but not context-free

---

**2017_FN_Q50** · 2017-FN · MCQ · 2 marks · Easy · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the following languages over the alphabet \(\Sigma = \{a, b, c\}\).
Let \(L_1 = \{a^n b^n c^m \mid m, n \geq 0\}\) and \(L_2 = \{a^m b^n c^n \mid m, n \geq 0\}\).
Which of the following are context-free languages?
I. \(L_1 \cup L_2\)
II. \(L_1 \cap L_2\)

- A) I only  ✔ official
- B) II only
- C) I and II
- D) Neither I nor II

---

**2017_AN_Q38** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Consider the following languages.
\(L_1 = \{a^p \mid p \text{ is a prime number}\}\)
\(L_2 = \{a^n b^m c^{2m} \mid n \geq 0, m \geq 0\}\)
\(L_3 = \{a^n b^n c^{2n} \mid n \geq 0\}\)
\(L_4 = \{a^n b^n \mid n \geq 1\}\)
Which of the following are CORRECT?
I. \(L_1\) is context-free but not regular.
II. \(L_2\) is not context-free.
III. \(L_3\) is not context-free but recursive.
IV. \(L_4\) is deterministic context-free.

- A) I, II and IV only
- B) II and III only
- C) I and IV only
- D) III and IV only  ✔ official

---

**2017_FN_Q37** · 2017-FN · NAT · 2 marks · Hard · bank topic: Context-Free Grammars & Push-Down Automata

Consider the following grammar:
\(\text{stmt} \rightarrow \textbf{if } \text{expr} \textbf{ then } \text{expr} \textbf{ else } \text{expr}; \text{stmt} \mid 0\)
\(\text{expr} \rightarrow \text{term } \textbf{relop} \text{ term} \mid \text{term}\)
\(\text{term} \rightarrow \textbf{id} \mid \textbf{number}\)
\(\textbf{id} \rightarrow a \mid b \mid c\)
\(\textbf{number} \rightarrow [0-9]\)
where \(\textbf{relop}\) is a relational operator (e.g., <, >, ...), 0 refers to the empty statement, and \(\textbf{if, then, else}\) are terminals.
Consider a program \(P\) following the above grammar containing ten \(\textbf{if}\) terminals. The number of control flow paths in \(P\) is ________. For example, the program
\(\textbf{if } e_1 \textbf{ then } e_2 \textbf{ else } e_3\)
has 2 control flow paths, \(e_1 \rightarrow e_2\) and \(e_1 \rightarrow e_3\).

Official answer (numeric): 1024.0 to 1024.0

