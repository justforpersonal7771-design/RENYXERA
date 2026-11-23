# In-depth review input: Theory of Computation

**One file, one review.** Paste everything below the line into ChatGPT (new chat), and again into Gemini (new chat). If the chat refuses the length, attach this file and write: "Follow the instructions inside the file."

Save the replies in this folder as `chatgpt-review-theory-of-computation.md` and `gemini-review-theory-of-computation.md`, then tell me.

Contains: reviewer instructions (A), the subject's contents with the PYQ statistics (B), and all 77 PYQs with full text and the official key (C).

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

This is the **in-depth review of the whole Theory of Computation book**. Take your time. Go chapter by chapter, and give a much deeper answer than a quick review: at least **80 rows** in the gap table in Part 2 (spread across every chapter).

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

- Regular expressions and finite automata.
- Context-free grammars and push-down automata.
- Regular and context-free languages, pumping lemma.
- Turing machines and undecidability.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | Regular expressions and finite automata | 4 topics ready | written (old standard; to be rewritten) |
| 02 | Regular languages: closure and pumping lemma | 3 topics ready | written (old standard; to be rewritten) |
| 03 | Context-free grammars and PDAs | 3 topics ready | written (old standard; to be rewritten) |
| 04 | Context-free languages: closure and pumping lemma | 3 topics ready | written (old standard; to be rewritten) |
| 05 | Turing machines | 3 topics ready | written (old standard; to be rewritten) |
| 06 | Decidability and undecidability | 3 topics ready | written (old standard; to be rewritten) |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **77**; marks: **121** = **8.1%** of all 1500 marks (about 8.1 marks a paper).
- Forge (our own) questions for this subject: **24**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Regular Expressions & Finite Automata (DFA/NFA Min) | 26 | 40 | 2.67% | 10 | 1/20/5 | MSQ1×2, MSQ2×4, NAT2×7, MCQ1×7, MCQ2×3, NAT1×3 |
| Regular and Context-Free Languages & Pumping Lemma | 25 | 40 | 2.67% | 10 | 2/22/1 | MSQ2×6, MCQ2×9, MSQ1×4, MCQ1×6 |
| Context-Free Grammars & Push-Down Automata | 14 | 22 | 1.47% | 6 | 1/9/4 | MSQ1×2, MSQ2×2, MCQ1×4, NAT2×3, MCQ2×3 |
| Turing Machines & Undecidability | 12 | 19 | 1.27% | 8 | 0/12/0 | MCQ1×3, MSQ1×2, MSQ2×1, MCQ2×6 |


---

## PART C. ALL 77 PREVIOUS-YEAR QUESTIONS (Theory of Computation)

Official key marked "✔ official". Figures are not shown; the question says so.

**2026_AN_Q13** · 2026-AN · MCQ · 1 mark · Medium · bank topic: Turing Machines & Undecidability

Which one of the following statements is equivalent to the following assertion?
Turing machine \( M \) decides the language \( L \subseteq \{0, 1\}^* \).

- A) Turing machine \( M \) halts on all input strings in \( \{0, 1\}^* \)
- B) Turing machine \( M \) accepts all input strings in \( L \)
- C) Turing machine \( M \) rejects all input strings in \( \{0, 1\}^* - L \)
- D) Turing machine \( M \) accepts all input strings in \( L \) and rejects all input strings in \( \{0, 1\}^* - L \)  ✔ official

---

**2026_FN_Q25** · 2026-FN · MSQ · 1 mark · Hard · bank topic: Context-Free Grammars & Push-Down Automata

Consider the following grammar where \( S \) is the start symbol, and \( a \) and \( b \) are terminal symbols.
\( S \rightarrow aSbS \mid bS \mid \epsilon \)
Which of the following statements is/are true?

- A) The grammar is ambiguous.  ✔ official
- B) The string \( abb \) has two distinct derivations in this grammar.  ✔ official
- C) The string \( abab \) has only one rightmost derivation.  ✔ official
- D) The language generated by the grammar is undecidable.

---

**2026_FN_Q26** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Let \( M \) be a non-deterministic finite automaton (NFA) with 6 states over a finite alphabet. Which of the following options CANNOT be the number of states in the minimal deterministic finite automaton (DFA) that is equivalent to \( M \)?

- A) 32
- B) 65  ✔ official
- C) 1
- D) 128  ✔ official

---

**2026_AN_Q29** · 2026-AN · MSQ · 1 mark · Medium · bank topic: Context-Free Grammars & Push-Down Automata

Which of the following grammars is/are ambiguous?

- A) \( S \rightarrow aSb \mid \epsilon \)
- B) \( E \rightarrow E + E \mid E * E \mid \text{id} \)  ✔ official
- C) \( S \rightarrow aS \mid Sa \mid \epsilon \)  ✔ official
- D) \( S \rightarrow aS \mid \epsilon \)

---

**2026_AN_Q47** · 2026-AN · MSQ · 2 marks · Hard · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Consider the following two finite automata \( D_1 \) and \( D_2 \).
[IMAGE_Q_47_1]
Which of the following statements is/are true?

- A) \( L(D_1) = L(D_2) \)
- B) \( L(D_1) \) is a proper subset of \( L(D_2) \)
- C) \( L(D_1) \cap L(D_2) = \{\epsilon\} \)  ✔ official
- D) \( (L(D_1) \cup L(D_2))^* \) consists of all strings in \( \{0, 1\}^* \) whose length is divisible by 3.  ✔ official

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

**2025_AN_Q25** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Turing Machines & Undecidability

Let \( G_1 \), \( G_2 \) be Context Free Grammars (CFGs) and \( R \) be a regular expression. For a grammar \( G \), let \( L(G) \) denote the language generated by \( G \).
Which ONE among the following questions is decidable?

- A) Is \( L(G_1) = L(G_2) \)?
- B) Is \( L(G_1) \cap L(G_2) = \emptyset \)?
- C) Is \( L(G_1) = L(R) \)?
- D) Is \( L(G_1) = \emptyset \)?  ✔ official

---

**2025_FN_Q28** · 2025-FN · MSQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

A regular language \( L \) is accepted by a non-deterministic finite automaton (NFA) with \( n \) states. Which of the following statement(s) is/are FALSE?

- A) \( L \) may have an accepting NFA with \( < n \) states.
- B) \( L \) may have an accepting DFA with \( < n \) states.
- C) There exists a DFA with \( \le 2^n \) states that accepts \( L \).
- D) Every DFA that accepts \( L \) has \( > 2^n \) states.  ✔ official

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

**2025_FN_Q50** · 2025-FN · MSQ · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Consider the following deterministic finite automaton (DFA) defined over the alphabet, \( \Sigma = \{a, b\} \). Identify which of the following language(s) is/are accepted by the given DFA.
[IMAGE_Q_50_1]

- A) The set of all strings containing an even number of \( b \)'s.
- B) The set of all strings containing the pattern \( bab \).
- C) The set of all strings ending with the pattern \( bab \).  ✔ official
- D) The set of all strings not containing the pattern \( aba \).

---

**2025_AN_Q52** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Let \( \Sigma = \{a, b, c\} \). For \( x \in \Sigma^* \), and \( \alpha \in \Sigma \), let \( \#_\alpha(x) \) denote the number of occurrences of \( \alpha \) in \( x \). Which one or more of the following option(s) define(s) regular language(s)?

- A) \( \{a^m b^n \mid m, n \ge 0\} \)  ✔ official
- B) \( \{a, b\}^* \cap \{a^m b^n c^{m - n} \mid m \ge n \ge 0\} \)
- C) \( \{w \mid w \in \{a, b\}^*, \#_a(w) = 2 \pmod 7, \text{ and } \#_b(w) = 3 \pmod 9\} \)  ✔ official
- D) \( \{w \mid w \in \{a, b\}^*, \#_a(w) = 2 \pmod 7, \text{ and } \#_a(w) = \#_b(w)\} \)

---

**2025_AN_Q60** · 2025-AN · NAT · 2 marks · Hard · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Let \( \Sigma = \{1, 2, 3, 4\} \). For \( x \in \Sigma^* \), let \( \text{prod}(x) \) be the product of symbols in \( x \) modulo 7. We take \( \text{prod}(\epsilon) = 1 \), where \( \epsilon \) is the null string.
For example, \( \text{prod}(124) = (1 \times 2 \times 4) \bmod 7 = 1 \).
Define \( L = \{x \in \Sigma^* \mid \text{prod}(x) = 2\} \).
The number of states in a minimum state DFA for \( L \) is ________. (Answer in integer)

Official answer (numeric): 6 to 6

---

**2024_AN_Q34** · 2024-AN · MCQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Which one of the following regular expressions is equivalent to the language accepted by the DFA given below?
[IMAGE_Q_34_1]

- A) \( 0^* 1(0 + 10^* 1)^* \)  ✔ official
- B) \( 0^* (10^* 11)^* 0^* \)
- C) \( 0^* 1(010^* 1)^* 0^* \)
- D) \( 0(1 + 0^* 10^* 1)^* 0^* \)

---

**2024_FN_Q16** · 2024-FN · MSQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Let \( L_1, L_2 \) be two regular languages and \( L_3 \) a language which is not regular. Which of the following statements is/are always TRUE?

- A) \( L_1 = L_2 \) if and only if \( L_1 \cap \overline{L_3} = \phi \)
- B) \( L_1 \cup L_3 \) is not regular
- C) \( \overline{L_3} \) is not regular  ✔ official
- D) \( \overline{L_1 \cup L_2} \) is regular  ✔ official

---

**2024_AN_Q55** · 2024-AN · MCQ · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Let \( M \) be the 5-state NFA with \( \epsilon \)-transitions shown in the diagram below.
[IMAGE_Q_55_1]
Which one of the following regular expressions represents the language accepted by \( M \)?

- A) \( (00)^* + 1(11)^* \)
- B) \( 0^* + (1 + 0(00)^* )(11)^* \)  ✔ official
- C) \( (00)^* + (1 + (00)^*)(11)^* \)
- D) \( 0^* + 1(11)^* + 0(11)^* \)

---

**2024_FN_Q36** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Consider the 5-state DFA \( M \) accepting the language \( L(M) \subset (0 + 1)^* \) shown below. For any string \( w \in (0 + 1)^* \) let \( n_0(w) \) be the number of 0's in \( w \) and \( n_1(w) \) be the number of 1's in \( w \).
[IMAGE_Q_36_1]
Which of the following statements is/are FALSE?

- A) States 2 and 4 are distinguishable in \( M \)
- B) States 3 and 4 are distinguishable in \( M \)  ✔ official
- C) States 2 and 5 are distinguishable in \( M \)  ✔ official
- D) Any string \( w \) with \( n_0(w) = n_1(w) \) is in \( L(M) \)

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

**2024_FN_Q63** · 2024-FN · NAT · 2 marks · Hard · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Consider the following two regular expressions over the alphabet \( \{0, 1\} \):
\( r = 0^* + 1^* \)
\( s = 01^* + 10^* \)
The total number of strings of length less than or equal to 5, which are neither in \( r \) nor is \( s \), is ________.

Official answer (numeric): 44 to 44

---

**2024_AN_Q38** · 2024-AN · NAT · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Let \( L_1 \) be the language represented by the regular expression \( b^* ab^* (ab^* ab^*)^* \) and \( L_2 = \{w \in (a + b)^* \mid |w| \le 4\} \), where \( |w| \) denotes the length of string \( w \). The number of strings in \( L_2 \) which are also in \( L_1 \) is ________.

Official answer (numeric): 15 to 15

---

**2023_FN_Q14** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Consider the Deterministic Finite-state Automaton (DFA) \( A \) shown below. The DFA runs on the alphabet \( \{0, 1\} \), and has the set of states \( \{s, p, q, r\} \), with \( s \) being the start state and \( p \) being the only final state.
[IMAGE_Q_14_1]
Which one of the following regular expressions correctly describes the language accepted by \( A \)?

- A) \( 1(0^*11)^* \)
- B) \( 0(0 + 1)^* \)
- C) \( 1(0 + 11)^* \)  ✔ official
- D) \( 1(110)^* \)

---

**2023_FN_Q19** · 2023-FN · MCQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Consider the following definition of a lexical token id for an identifier in a programming language, using extended regular expressions:
\( \text{letter} \rightarrow \text{[A – Za – a]} \)
\( \text{digit} \rightarrow \text{[0 – 9]} \)
\( \text{id} \rightarrow \text{letter (letter} \mid \text{digit)}^* \)
Which one of the following Non-deterministic Finite-state Automata with \( \epsilon \)-transitions accepts the set of valid identifiers? (A double-circle denotes a final state)

- A) [IMAGE_Q_19_A]
- B) [IMAGE_Q_19_B]
- C) [IMAGE_Q_19_C]  ✔ official
- D) [IMAGE_Q_19_D]

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

**2023_FN_Q63** · 2023-FN · NAT · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Consider the language \(L\) over the alphabet \(\{0, 1\}\), given below:
\(L = \{w \in \{0, 1\}^* \mid w \text{ does not contain three or more consecutive 1's}\}\).
The minimum number of states in a Deterministic Finite-State Automaton (DFA) for \(L\) is ________.

Official answer (numeric): 4 to 4

---

**2022_FN_Q12** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Which one of the following regular expressions correctly represents the language of the finite automaton given below?

[IMAGE_Q_12]

- A) \(ab^*bab^* + ba^*aba^*\)
- B) \((ab^*b)^* ab^* + (ba^*a)^*ba^*\)
- C) \((ab^*b + ba^*a)^* (a^* + b^*)\)
- D) \((ba^*a + ab^*b)^* (ab^* + ba^*)\)  ✔ official

---

**2022_FN_Q23** · 2022-FN · MSQ · 1 mark · Medium · bank topic: Turing Machines & Undecidability

Which of the following statements is/are TRUE?

- A) Every subset of a recursively enumerable language is recursive.
- B) If a language \(L\) and its complement \(\overline{L}\) are both recursively enumerable, then \(L\) must be recursive.  ✔ official
- C) Complement of a context-free language must be recursive.  ✔ official
- D) If \(L_1\) and \(L_2\) are regular, then \(L_1 \cap L_2\) must be deterministic context-free.  ✔ official

---

**2022_FN_Q46** · 2022-FN · MSQ · 2 marks · Medium · bank topic: Turing Machines & Undecidability

Which of the following is/are undecidable?

- A) Given two Turing machines \(M_1\) and \(M_2\), decide if \(L(M_1) = L(M_2)\).  ✔ official
- B) Given a Turing machine \(M\), decide if \(L(M)\) is regular.  ✔ official
- C) Given a Turing machine \(M\), decide if \(M\) accepts all strings.  ✔ official
- D) Given a Turing machine \(M\), decide if \(M\) takes more than 1073 steps on every string.

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

**2021_AN_Q12** · 2021-AN · MCQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Let \(L \subseteq \{0, 1\}^*\) be an arbitrary regular language accepted by a minimal DFA with \(k\) states. Which one of the following languages must necessarily be accepted by a minimal DFA with \(k\) states?

- A) \(L - \{01\}\)
- B) \(L \cup \{01\}\)
- C) \(\{0, 1\}^* - L\)  ✔ official
- D) \(L.L\)

---

**2021_FN_Q37** · 2021-FN · MSQ · 1 mark · Medium · bank topic: Turing Machines & Undecidability

Let \(\langle M \rangle\) denote an encoding of an automaton \(M\). Suppose that \(\Sigma = \{0, 1\}\). Which of the following languages is/are NOT recursive?

- A) \(L = \{\langle M \rangle \mid M \text{ is a DFA such that } L(M) = \phi\}\)
- B) \(L = \{\langle M \rangle \mid M \text{ is a DFA such that } L(M) = \Sigma^*\}\)
- C) \(L = \{\langle M \rangle \mid M \text{ is a PDA such that } L(M) = \phi\}\)
- D) \(L = \{\langle M \rangle \mid M \text{ is a PDA such that } L(M) = \Sigma^*\}\)  ✔ official

---

**2021_AN_Q54** · 2021-AN · MSQ · 1 mark · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

Let \(L_1\) be a regular language and \(L_2\) be a context-free language. Which of the following languages is/are context-free?

- A) \(L_1 \cap \overline{L_2}\)
- B) \(\overline{\overline{L_1} \cup \overline{L_2}}\)  ✔ official
- C) \(L_1 \cup (L_2 \cup \overline{L_2})\)  ✔ official
- D) \((L_1 \cap L_2) \cup (\overline{L_1} \cap L_2)\)  ✔ official

---

**2021_AN_Q20** · 2021-AN · NAT · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Consider the following deterministic finite automation (DFA).

[IMAGE_Q_20_1]

The number of strings of length 8 accepted by the above automation is _________.

Official answer (numeric): 256 to 256

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

**2021_FN_Q26** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Consider the following language:
\(L = \{w \in \{0,1\}^* \mid w \text{ ends with the substring 011}\}\)
Which one of the following deterministic finite automata accepts \(L\)?

- A) [IMAGE_Q_26_A]
- B) [IMAGE_Q_26_B]
- C) [IMAGE_Q_26_C]
- D) [IMAGE_Q_26_D]  ✔ official

---

**2021_FN_Q23** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Turing Machines & Undecidability

For a Turing machine \(M\), \(\langle M \rangle\) denotes an encoding of \(M\). Consider the following two languages:
\(L_1 = \{\langle M \rangle \mid M \text{ takes more than 2021 steps on all inputs}\}\)
\(L_2 = \{\langle M \rangle \mid M \text{ takes more than 2021 steps on some input}\}\)
Which one of the following options is correct?

- A) Both \(L_1\) and \(L_2\) are decidable.  ✔ official
- B) \(L_1\) is decidable and \(L_2\) is undecidable.
- C) \(L_1\) is undecidable and \(L_2\) is decidable.
- D) Both \(L_1\) and \(L_2\) are undecidable.

---

**2021_AN_Q18** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Regular and Context-Free Languages & Pumping Lemma

For a string \(w\), we define \(w^R\) to be the reverse of \(w\). For example, if \(w = 01101\) then \(w^R = 10110\). Which of the following languages is/are context-free?

- A) \(\{wxw^R x^R \mid w, x \in \{0, 1\}^*\}\)
- B) \(\{ww^R xx^R \mid w, x \in \{0, 1\}^*\}\)  ✔ official
- C) \(\{wxw^R \mid w, x \in \{0, 1\}^*\}\)  ✔ official
- D) \(\{wxxw^R w^R \mid w, x \in \{0, 1\}^*\}\)  ✔ official

---

**2021_AN_Q51** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Which of the following regular expressions represent(s) the set of all binary numbers that are divisible by three? Assume that the string \(\epsilon\) is divisible by three.

- A) \((0 + 1(01^*0)^*1)^*\)  ✔ official
- B) \((0 + 11 + 10(1 + 00)^*01)^*\)  ✔ official
- C) \((0^*(1(01^*0)^*1)^*)^*\)  ✔ official
- D) \((0 + 11 + 11(1 + 00)^*00)^*\)

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

**2020_FN_Q22** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Which one of the following regular expressions represents the set of all binary strings with an odd number of 1's?

- A) \( ((0 + 1)^* 1(0 + 1)^*1)^*10^* \)  ✔ official
- B) \( (0^*10^*10^*)^*0^*1 \)  ✔ official
- C) \( 10^* (0^*10^*10^*)^* \)  ✔ official
- D) \( (0^*10^*10^*)^*10^* \)  ✔ official

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

**2020_FN_Q44** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Turing Machines & Undecidability

Which of the following languages are undecidable? Note that \( \langle M \rangle \) indicates encoding of the Turing machine M.
\( L_1 = \{\langle M \rangle \mid L(M) = \phi\} \)
\( L_2 = \{\langle M, w, q \rangle \mid M \text{ on input } w \text{ reaches state } q \text{ in exactly 100 steps}\} \)
\( L_3 = \{\langle M \rangle \mid L(M) \text{ is not recursive}\} \)
\( L_4 = \{\langle M \rangle \mid L(M) \text{ contains at least 21 members}\} \)

- A) \( L_1, L_3 \) and \( L_4 \) only  ✔ official
- B) \( L_1 \) and \( L_3 \) only
- C) \( L_2 \) and \( L_3 \) only
- D) \( L_2, L_3 \) and \( L_4 \) only

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

**2020_FN_Q41** · 2020-FN · NAT · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Consider the following language:
\( L = \{x \in \{a, b\}^* \mid \text{number of a's in } x \text{ is divisible by 2 but not divisible by 3}\} \)
The minimum number of states in a DFA that accepts \( L \) is ________.

Official answer (numeric): 6 to 6

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

**2019_FN_Q50** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Turing Machines & Undecidability

Consider the following sets:
\( S_1 \): Set of all recursively enumerable languages over the alphabet \( \{0, 1\} \).
\( S_2 \): Set of all syntactically valid C programs.
\( S_3 \): Set of all languages over the alphabet \( \{0, 1\} \).
\( S_4 \): Set of all non-regular languages over the alphabet \( \{0, 1\} \).
Which of the above sets are uncountable?

- A) \( S_1 \) and \( S_2 \)
- B) \( S_3 \) and \( S_4 \)  ✔ official
- C) \( S_2 \) and \( S_3 \)
- D) \( S_1 \) and \( S_4 \)

---

**2019_FN_Q59** · 2019-FN · NAT · 2 marks · Hard · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Let \( \Sigma \) be the set of all bijections from \( \{1, ..., 5\} \) to \( \{1, ..., 5\} \), where id denotes the identity function, i.e. \( id(j) = j, \forall j \). Let \( \circ \) denote composition on functions.
For a string \( x = x_1 x_2 ... x_n \in \Sigma^n, n \ge 0 \), let \( \pi(x) = x_1 \circ x_2 \circ ... \circ x_n \).
Consider the language \( L = \{x \in \Sigma^* \mid \pi(x) = id\} \). The minimum number of states in any DFA accepting \( L \) is ________.

Official answer (numeric): 120 to 120

---

**2018_FN_Q16** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Let \(N\) be an NFA with \(n\) states. Let \(k\) be the number of states of a minimal DFA which is equivalent to \(N\). Which one of the following is necessarily true?

- A) \(k \geq 2^n\)
- B) \(k \geq n\)
- C) \(k \leq n^2\)
- D) \(k \leq 2^n\)  ✔ official

---

**2018_FN_Q17** · 2018-FN · MCQ · 1 mark · Medium · bank topic: Turing Machines & Undecidability

The set of all recursively enumerable languages is

- A) closed under complementation.
- B) closed under intersection.  ✔ official
- C) a subset of the set of all recursive languages.
- D) an uncountable set.

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

**2018_FN_Q46** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Turing Machines & Undecidability

Consider the following problems. \(L(G)\) denotes the language generated by a grammar \(G\). \(L(M)\) denotes the language accepted by a machine \(M\).
(I) For an unrestricted grammar \(G\) and a string \(w\), whether \(w \in L(G)\)
(II) Given a Turing machine \(M\), whether \(L(M)\) is regular
(III) Given two grammars \(G_1\) and \(G_2\), whether \(L(G_1) = L(G_2)\)
(IV) Given an NFA \(N\), whether there is a deterministic PDA \(P\) such that \(N\) and \(P\) accept the same language.
Which one of the following statements is correct?

- A) Only I and II are undecidable
- B) Only III is undecidable
- C) Only II and IV are undecidable
- D) Only I, II and III are undecidable  ✔ official

---

**2018_FN_Q62** · 2018-FN · NAT · 2 marks · Hard · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Given a language \(L\), define \(L^i\) as follows:
\(L^0 = \{\epsilon\}\)
\(L^i = L^{i-1} \cdot L\) for all \(i > 0\)
The order of a language \(L\) is defined as the smallest \(k\) such that \(L^k = L^{k+1}\).
Consider the language \(L_1\) (over alphabet 0) accepted by the following automaton.
[IMAGE_Q_62]
The order of \(L_1\) is _____.

Official answer (numeric): 2 to 2

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

**2017_FN_Q23** · 2017-FN · NAT · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Consider the language \(L\) given by the regular expression \((a + b)^* b (a + b)\) over the alphabet \(\{a, b\}\). The smallest number of states needed in a deterministic finite-state automaton (DFA) accepting \(L\) is________.

Official answer (numeric): 4.0 to 4.0

---

**2017_AN_Q15** · 2017-AN · NAT · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

The minimum possible number of states of a deterministic finite automaton that accepts the regular language \(L = \{w_1 a w_2 \mid w_1, w_2 \in \{a, b\}^*, |w_1| = 2, |w_2| \geq 3\}\) is________.

Official answer (numeric): 8.0 to 8.0

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

**2017_FN_Q52** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Turing Machines & Undecidability

Let \(A\) and \(B\) be finite alphabets and let # be a symbol outside both \(A\) and \(B\). Let \(f\) be a total function from \(A^*\) to \(B^*\). We say \(f\) is computable if there exists a Turing machine \(M\) which given an input \(x\) in \(A^*\), always halts with \(f(x)\) on its tape. Let \(L_f\) denote the language \(\{x \# f(x) \mid x \in A^*\}\).
Which of the following statements is true:

- A) \(f\) is computable if and only if \(L_f\) is recursive.  ✔ official
- B) \(f\) is computable if and only if \(L_f\) is recursively enumerable.
- C) If \(f\) is computable then \(L_f\) is recursive, but not conversely.
- D) If \(f\) is computable then \(L_f\) is recursively enumerable, but not conversely.

---

**2017_AN_Q40** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Let \(\delta\) denote the transition function and \(\hat{\delta}\) denote the extended transition function of the \(\epsilon\)-NFA whose transition table is given below:
[IMAGE_Q_40]
The \(\hat{\delta}(q_2, aba)\) is

- A) \(\phi\)
- B) \(\{q_0, q_1, q_3\}\)
- C) \(\{q_0, q_1, q_2\}\)  ✔ official
- D) \(\{q_0, q_2, q_3\}\)

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

**2017_AN_Q60** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Turing Machines & Undecidability

Let L(R) be the language represented by regular expression R. Let L(G) be the language generated by a context free grammar G. Let L(M) be the language accepted by a Turing machine M.
Which of the following decision problems are undecidable?
I. Given a regular expression R and a string w, is \(w \in L(R)\)?
II. Given a context-free grammar G, is \(L(G) = \Phi\)?
III. Given a context-free grammar G, is \(L(G) = \Sigma^*\) for some alphabet \(\Sigma\)?
IV. Given a Turing machine M and a string w, is \(w \in L(M)\)?

- A) I and IV only
- B) II and III only
- C) II, III and IV only
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

