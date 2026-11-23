# Review input: Theory of Computation, chapter 01: Regular expressions and finite automata

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-01-regular-expressions-and-finite-automata.md` and `gemini-01-regular-expressions-and-finite-automata.md` in this folder.

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

This is **one chapter** (1 of 6) of the Theory of Computation book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Regular expressions and finite automata**. Written lessons today: 4 topics ready.



## The PYQs for this chapter (26)

**2026_FN_Q26** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Let \( M \) be a non-deterministic finite automaton (NFA) with 6 states over a finite alphabet. Which of the following options CANNOT be the number of states in the minimal deterministic finite automaton (DFA) that is equivalent to \( M \)?

- A) 32
- B) 65  ✔ official
- C) 1
- D) 128  ✔ official

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

**2025_FN_Q28** · 2025-FN · MSQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

A regular language \( L \) is accepted by a non-deterministic finite automaton (NFA) with \( n \) states. Which of the following statement(s) is/are FALSE?

- A) \( L \) may have an accepting NFA with \( < n \) states.
- B) \( L \) may have an accepting DFA with \( < n \) states.
- C) There exists a DFA with \( \le 2^n \) states that accepts \( L \).
- D) Every DFA that accepts \( L \) has \( > 2^n \) states.  ✔ official

---

**2025_FN_Q50** · 2025-FN · MSQ · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Consider the following deterministic finite automaton (DFA) defined over the alphabet, \( \Sigma = \{a, b\} \). Identify which of the following language(s) is/are accepted by the given DFA.
[IMAGE_Q_50_1]

- A) The set of all strings containing an even number of \( b \)'s.
- B) The set of all strings containing the pattern \( bab \).
- C) The set of all strings ending with the pattern \( bab \).  ✔ official
- D) The set of all strings not containing the pattern \( aba \).

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

**2021_AN_Q12** · 2021-AN · MCQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Let \(L \subseteq \{0, 1\}^*\) be an arbitrary regular language accepted by a minimal DFA with \(k\) states. Which one of the following languages must necessarily be accepted by a minimal DFA with \(k\) states?

- A) \(L - \{01\}\)
- B) \(L \cup \{01\}\)
- C) \(\{0, 1\}^* - L\)  ✔ official
- D) \(L.L\)

---

**2021_AN_Q20** · 2021-AN · NAT · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Consider the following deterministic finite automation (DFA).

[IMAGE_Q_20_1]

The number of strings of length 8 accepted by the above automation is _________.

Official answer (numeric): 256 to 256

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

**2021_AN_Q51** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Which of the following regular expressions represent(s) the set of all binary numbers that are divisible by three? Assume that the string \(\epsilon\) is divisible by three.

- A) \((0 + 1(01^*0)^*1)^*\)  ✔ official
- B) \((0 + 11 + 10(1 + 00)^*01)^*\)  ✔ official
- C) \((0^*(1(01^*0)^*1)^*)^*\)  ✔ official
- D) \((0 + 11 + 11(1 + 00)^*00)^*\)

---

**2020_FN_Q22** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Which one of the following regular expressions represents the set of all binary strings with an odd number of 1's?

- A) \( ((0 + 1)^* 1(0 + 1)^*1)^*10^* \)  ✔ official
- B) \( (0^*10^*10^*)^*0^*1 \)  ✔ official
- C) \( 10^* (0^*10^*10^*)^* \)  ✔ official
- D) \( (0^*10^*10^*)^*10^* \)  ✔ official

---

**2020_FN_Q41** · 2020-FN · NAT · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Consider the following language:
\( L = \{x \in \{a, b\}^* \mid \text{number of a's in } x \text{ is divisible by 2 but not divisible by 3}\} \)
The minimum number of states in a DFA that accepts \( L \) is ________.

Official answer (numeric): 6 to 6

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

**2017_FN_Q23** · 2017-FN · NAT · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

Consider the language \(L\) given by the regular expression \((a + b)^* b (a + b)\) over the alphabet \(\{a, b\}\). The smallest number of states needed in a deterministic finite-state automaton (DFA) accepting \(L\) is________.

Official answer (numeric): 4.0 to 4.0

---

**2017_AN_Q15** · 2017-AN · NAT · 1 mark · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min)

The minimum possible number of states of a deterministic finite automaton that accepts the regular language \(L = \{w_1 a w_2 \mid w_1, w_2 \in \{a, b\}^*, |w_1| = 2, |w_2| \geq 3\}\) is________.

Official answer (numeric): 8.0 to 8.0

---

**2017_AN_Q40** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Regular Expressions & Finite Automata (DFA/NFA Min) · HAS A FIGURE (not shown here)

Let \(\delta\) denote the transition function and \(\hat{\delta}\) denote the extended transition function of the \(\epsilon\)-NFA whose transition table is given below:
[IMAGE_Q_40]
The \(\hat{\delta}(q_2, aba)\) is

- A) \(\phi\)
- B) \(\{q_0, q_1, q_3\}\)
- C) \(\{q_0, q_1, q_2\}\)  ✔ official
- D) \(\{q_0, q_2, q_3\}\)

