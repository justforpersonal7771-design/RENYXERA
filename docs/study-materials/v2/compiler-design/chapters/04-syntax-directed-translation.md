# Review input: Compiler Design, chapter 04: Syntax-directed translation

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-04-syntax-directed-translation.md` and `gemini-04-syntax-directed-translation.md` in this folder.

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

This is **one chapter** (4 of 8) of the Compiler Design book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Syntax-directed translation**. Not written yet.



## The PYQs for this chapter (11)

**2026_FN_Q53** · 2026-FN · MSQ · 2 marks · Medium · bank topic: Syntax-Directed Translation & Runtime Environments · HAS A FIGURE (not shown here)

Consider the following two syntax-directed definitions SDD1 and SDD2 for type declarations.
[IMAGE_Q_53_1]
\( D \) is the start symbol, and int, float and id are the three terminals. The non-terminal \( V_1 \) is the same as \( V \) and the non-terminal \( D_1 \) is the same as \( D \). Here, the subscript is used to differentiate the grammar symbols on the two sides of a production. The function put updates the symbol table with the type information for an identifier.
Let \( P \) and \( Q \) be the languages specified by grammars G1 and G2, respectively.
Which of the following statements is/are true?

- A) The languages \( P \) and \( Q \) are the same  ✔ official
- B) SDD2 is S-attributed and contains only synthesized attributes  ✔ official
- C) SDD1 is L-attributed and contains only inherited attributes
- D) The specifications of SDD1 and SDD2 are such that the same entries get added to the symbol table  ✔ official

---

**2025_FN_Q12** · 2025-FN · MCQ · 1 mark · Easy · bank topic: Syntax-Directed Translation & Runtime Environments

Which ONE of the following statements is FALSE regarding the symbol table?

- A) Symbol table is responsible for keeping track of the scope of variables.
- B) Symbol table can be implemented using a binary search tree.
- C) Symbol table is not required after the parsing phase.  ✔ official
- D) Symbol table is created during the lexical analysis phase.

---

**2025_AN_Q22** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Syntax-Directed Translation & Runtime Environments

Given the following syntax directed translation rules:
Rule 1: \( R \rightarrow AB \{B.i = R.i - 1; A.i = B.i; R.i = A.i + 1;\} \)
Rule 2: \( P \rightarrow CD \{P.i = C.i + D.i; D.i = C.i + 2\} \)
Rule 3: \( Q \rightarrow EF \{Q.i = E.i + F.i;\} \)
Which ONE is the CORRECT option among the following?

- A) Rule 1 is S-attributed and L-attributed; Rule 2 is S-attributed and not L-attributed; Rule 3 is neither S-attributed nor L-attributed
- B) Rule 1 is neither S-attributed nor L-attributed; Rule 2 is S-attributed and L-attributed; Rule 3 is S-attributed and L-attributed
- C) Rule 1 is neither S-attributed nor L-attributed; Rule 2 is not S-attributed and is L-attributed; Rule 3 is S-attributed and L-attributed  ✔ official
- D) Rule 1 is S-attributed and not L-attributed; Rule 2 is not S-attributed and is L-attributed; Rule 3 is S-attributed and L-attributed

---

**2024_AN_Q27** · 2024-AN · MSQ · 1 mark · Medium · bank topic: Syntax-Directed Translation & Runtime Environments

Which of the following statements is/are FALSE?

- A) An attribute grammar is a syntax-directed definition (SDD) in which the functions in the semantic rules have no side effects.
- B) The attributes in a L-attributed definition cannot always be evaluated in a depth first order.  ✔ official
- C) Synthesized attributes can be evaluated by a bottom-up parser as the input is parsed.
- D) All L-attributed definitions based on LR(1) grammar can be evaluated using a bottom-up parsing strategy.  ✔ official

---

**2024_FN_Q38** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Syntax-Directed Translation & Runtime Environments · HAS A FIGURE (not shown here)

Consider the following syntax-directed definition (SDD).
[IMAGE_Q_38_1]
Given “MMLK” as the input, which one of the following options is the CORRECT value computed by the SDD (in the attribute S.val)?

- A) 45  ✔ official
- B) 50
- C) 55
- D) 65

---

**2023_FN_Q60** · 2023-FN · NAT · 2 marks · Hard · bank topic: Syntax-Directed Translation & Runtime Environments

Consider the syntax directed translation given by the following grammar and semantic rules. Here N, I, F and B are non-terminals. N is the starting non-terminal, and #, 0 and 1 are lexical tokens corresponding to input letters "#", "0" and "1", respectively. X.val denotes the synthesized attribute (a numeric value) associated with a non-terminal X. \(\text{I}_1\) and \(\text{F}_1\) denote occurrences of I and F on the right hand side of a production, respectively. For the tokens 0 and 1, \(0\text{.val} = 0\) and \(1\text{.val} = 1\).

\(\text{N} \rightarrow \text{I} \# \text{F}\) 	 \(\text{N.val} = \text{I.val} + \text{F.val}\)
\(\text{I} \rightarrow \text{I}_1 \text{B}\) 	 \(\text{I.val} = (2 \text{I}_1\text{.val}) + \text{B.val}\)
\(\text{I} \rightarrow \text{B}\) 	 \(\text{I.val} = \text{B.val}\)
\(\text{F} \rightarrow \text{B} \text{F}_1\) 	 \(\text{F.val} = \frac{1}{2}(\text{B.val} + \text{F}_1\text{.val})\)
\(\text{F} \rightarrow \text{B}\) 	 \(\text{F.val} = \frac{1}{2}\text{B.val}\)
\(\text{B} \rightarrow 0\) 	 \(\text{B.val} = 0\text{.val}\)
\(\text{B} \rightarrow 1\) 	 \(\text{B.val} = 1\text{.val}\)

The value computed by the translation scheme for the input string 10#011 is ________. (Rounded off to three decimal places)

Official answer (numeric): 2.374 to 2.376

---

**2022_FN_Q65** · 2022-FN · NAT · 2 marks · Hard · bank topic: Syntax-Directed Translation & Runtime Environments

Consider the following grammar along with translation rules.
\(S \rightarrow S_1 \# T\) \{S.val = S_1.val * T.val\}
\(S \rightarrow T\) \{S.val = T.val\}
\(T \rightarrow T_1 \% R\) \{T.val = T_1.val \div R.val\}
\(T \rightarrow R\) \{T.val = R.val\}
\(R \rightarrow \text{id}\) \{R.val = id.val\}
Here \# and \% are operators and id is a token that represents an integer and id.val represents the corresponding integer value. The set of non-terminals is \(\{S, T, R, P\}\) and a subscripted non-terminal indicates an instance of the non-terminal.
Using this translation scheme, the computed value of S.val for root of the parse tree for the expression 20#10%5#8%2%2 is __________.

Official answer (numeric): 80 to 80

---

**2021_FN_Q16** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Syntax-Directed Translation & Runtime Environments

Consider the following grammar (that admits a series of declarations, followed by expressions) and the associated syntax directed translation (SDT) actions, given as pseudo-code:
\(P \rightarrow D^* E^*\)
\(D \rightarrow \text{int ID } \{\text{record that ID.lexeme is of type int}\}\)
\(D \rightarrow \text{bool ID } \{\text{record that ID.lexeme is of type bool}\}\)
\(E \rightarrow E_1 + E_2 \text{ } \{\text{check that } E_1.\text{type} = E_2.\text{type} = \text{int; set } E.\text{type} := \text{int}\}\)
\(E \rightarrow !E_1 \text{ } \{\text{check that } E_1.\text{type} = \text{bool; set } E.\text{type} := \text{bool}\}\)
\(E \rightarrow \text{ID } \{\text{set } E.\text{type} := \text{int}\}\)
With respect to the above grammar, which one of the following choices is correct?

- A) The actions can be used to correctly type-check any syntactically correct program.
- B) The actions can be used to type-check syntactically correct integer variable declarations and integer expressions.  ✔ official
- C) The actions can be used to type-check syntactically correct boolean variable declarations and boolean expressions.
- D) The actions will lead to an infinite loop.

---

**2020_FN_Q35** · 2020-FN · MCQ · 1 mark · Medium · bank topic: Syntax-Directed Translation & Runtime Environments

Consider the following statements:
I. Symbol table is accessed only during lexical analysis and syntax analysis.
II. Compilers for programming languages that support recursion necessarily need heap storage for memory allocation in the run-time environment.
III. Errors violating the condition 'any variable must be declared before its use' are detected during syntax analysis.
Which of the above statements is/are TRUE?

- A) I only
- B) I and III only
- C) I only
- D) None of I, II, and III  ✔ official

---

**2020_FN_Q49** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Syntax-Directed Translation & Runtime Environments

Consider the productions \( A \rightarrow PQ \) and \( A \rightarrow XY \). Each of the five non-terminals A, P, Q, X and Y has two attributes: \( s \) is a synthesized attribute, and \( i \) is an inherited attribute. Consider the following rules.
Rule 1: \( P.i = A.i + 2 \), \( Q.i = P.i + A.i \) and \( A.s = P.s + Q.s \)
Rule 2: \( X.i = A.i + Y.s \) and \( Y.i = X.s + A.i \)
Which one of the following is TRUE?

- A) Both Rule 1 and Rule 2 are L-attributed.
- B) Only Rule 1 is L-attributed.  ✔ official
- C) Only Rule 2 is L-attributed.
- D) Neither Rule 1 nor Rule 2 is L-attributed.

---

**2019_FN_Q57** · 2019-FN · MCQ · 2 marks · Hard · bank topic: Syntax-Directed Translation & Runtime Environments · HAS A FIGURE (not shown here)

Consider the following grammar and the semantic actions to support the inherited type declaration attributes. Let \( X_1, X_2, X_3, X_4, X_5 \) and \( X_6 \) be the place holders for the non-terminals D, T, L or \( L_1 \) in the following table:
[IMAGE_Q_57]
Which one of the following are the appropriate choices for \( X_1, X_2, X_3 \) and \( X_4 \)?

- A) \( X_1 = L, X_2 = T, X_3 = L_1, X_4 = L \)  ✔ official
- B) \( X_1 = T, X_2 = L, X_3 = L_1, X_4 = T \)
- C) \( X_1 = L, X_2 = L, X_3 = L_1, X_4 = T \)
- D) \( X_1 = T, X_2 = L, X_3 = T, X_4 = L_1 \)

