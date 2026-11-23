# Review input: Theory of Computation, chapter 06: Decidability and undecidability

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-06-decidability-and-undecidability.md` and `gemini-06-decidability-and-undecidability.md` in this folder.

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

This is **one chapter** (6 of 6) of the Theory of Computation book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Decidability and undecidability**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (12)

**2026_AN_Q13** · 2026-AN · MCQ · 1 mark · Medium · bank topic: Turing Machines & Undecidability

Which one of the following statements is equivalent to the following assertion?
Turing machine \( M \) decides the language \( L \subseteq \{0, 1\}^* \).

- A) Turing machine \( M \) halts on all input strings in \( \{0, 1\}^* \)
- B) Turing machine \( M \) accepts all input strings in \( L \)
- C) Turing machine \( M \) rejects all input strings in \( \{0, 1\}^* - L \)
- D) Turing machine \( M \) accepts all input strings in \( L \) and rejects all input strings in \( \{0, 1\}^* - L \)  ✔ official

---

**2025_AN_Q25** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Turing Machines & Undecidability

Let \( G_1 \), \( G_2 \) be Context Free Grammars (CFGs) and \( R \) be a regular expression. For a grammar \( G \), let \( L(G) \) denote the language generated by \( G \).
Which ONE among the following questions is decidable?

- A) Is \( L(G_1) = L(G_2) \)?
- B) Is \( L(G_1) \cap L(G_2) = \emptyset \)?
- C) Is \( L(G_1) = L(R) \)?
- D) Is \( L(G_1) = \emptyset \)?  ✔ official

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

**2021_FN_Q37** · 2021-FN · MSQ · 1 mark · Medium · bank topic: Turing Machines & Undecidability

Let \(\langle M \rangle\) denote an encoding of an automaton \(M\). Suppose that \(\Sigma = \{0, 1\}\). Which of the following languages is/are NOT recursive?

- A) \(L = \{\langle M \rangle \mid M \text{ is a DFA such that } L(M) = \phi\}\)
- B) \(L = \{\langle M \rangle \mid M \text{ is a DFA such that } L(M) = \Sigma^*\}\)
- C) \(L = \{\langle M \rangle \mid M \text{ is a PDA such that } L(M) = \phi\}\)
- D) \(L = \{\langle M \rangle \mid M \text{ is a PDA such that } L(M) = \Sigma^*\}\)  ✔ official

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

**2018_FN_Q17** · 2018-FN · MCQ · 1 mark · Medium · bank topic: Turing Machines & Undecidability

The set of all recursively enumerable languages is

- A) closed under complementation.
- B) closed under intersection.  ✔ official
- C) a subset of the set of all recursive languages.
- D) an uncountable set.

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

**2017_FN_Q52** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Turing Machines & Undecidability

Let \(A\) and \(B\) be finite alphabets and let # be a symbol outside both \(A\) and \(B\). Let \(f\) be a total function from \(A^*\) to \(B^*\). We say \(f\) is computable if there exists a Turing machine \(M\) which given an input \(x\) in \(A^*\), always halts with \(f(x)\) on its tape. Let \(L_f\) denote the language \(\{x \# f(x) \mid x \in A^*\}\).
Which of the following statements is true:

- A) \(f\) is computable if and only if \(L_f\) is recursive.  ✔ official
- B) \(f\) is computable if and only if \(L_f\) is recursively enumerable.
- C) If \(f\) is computable then \(L_f\) is recursive, but not conversely.
- D) If \(f\) is computable then \(L_f\) is recursively enumerable, but not conversely.

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

