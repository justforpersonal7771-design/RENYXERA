# Review input: Compiler Design, chapter 01: Lexical analysis

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-01-lexical-analysis.md` and `gemini-01-lexical-analysis.md` in this folder.

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

This is **one chapter** (1 of 8) of the Compiler Design book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Lexical analysis**. Not written yet.



## The PYQs for this chapter (35)

**2026_FN_Q27** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following C statements:
```c
char *str1 = "Hello;  /* Statement S1 */
char *str2 = "Hello;"; /* Statement S2 */
int *str3 = "Hello";   /* Statement S3 */
```
Which of the following options is/are correct?

- A) S1 and S2 have syntactic errors
- B) S2 has a lexical error and S3 has a syntactic error
- C) S1 has a lexical error and S3 has a semantic error  ✔ official
- D) S1 has a syntactic error and S3 has a semantic error

---

**2026_FN_Q28** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Which of the following statements is/are true?

- A) LL(1) parser uses backtracking
- B) For a grammar to be LL(1), it must be left-recursive
- C) For a grammar to be LL(1), it must be left-factored  ✔ official
- D) The LL(1) parsers are more powerful than the SLR parsers

---

**2026_AN_Q35** · 2026-AN · NAT · 1 mark · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

A lexical analyzer uses the following token definitions
• letter \(\rightarrow\) [A - Za - z]
• digit \(\rightarrow\) [0 - 9]
• id \(\rightarrow\) letter (letter \(|\) digit)\(*\)
• number \(\rightarrow\) digit\(^+\)
• ws \(\rightarrow\) (blank \(|\) tab \(|\) newline)\(^+\)
For the string given below,
x1 23 mm 78 y 7z zz5 14A 8H AaYcD
the number of tokens (excluding ws) that will be produced by the lexical analyzer is ________. (answer in integer)

Official answer (numeric): 13 to 13

---

**2026_AN_Q41** · 2026-AN · MCQ · 2 marks · Hard · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the canonical \( LR(0) \) parsing of the grammar below using terminals \( \{a, b, c\} \) and non-terminals \( \{A, B, C, S\} \) with \( S \) as the start symbol.
\( S \rightarrow ACB \)
\( A \rightarrow \alpha A \mid \epsilon \)
\( C \rightarrow cC \mid \epsilon \)
\( B \rightarrow bB \mid b \)
Which one of the following options gives the number of shift-reduce conflicts that will occur in the \( LR(0) \) ACTION table?

- A) 2
- B) 3
- C) 4
- D) 5  ✔ official

---

**2026_FN_Q42** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Data Flow Analysis: Constant Propagation, Liveliness Analysis, Common Subexpression Elimination · HAS A FIGURE (not shown here)

Consider the control flow graph shown in the figure.
[IMAGE_Q_42_1]
Which one of the following options correctly lists the set of redundant expressions (common sub-expressions) in the basic blocks B4 and B5?
**Note:** All the variables are integers.

- A) B4: \( \{b + i\} \) B5: \( \{c + m\} \)
- B) B4: \( \{g * k\} \) B5: \( \{c + m\} \)
- C) B4: \( \{g * k, b + i\} \) B5: \( \{\} \)
- D) B4: \( \{g * k\} \) B5: \( \{\} \)  ✔ official

---

**2026_AN_Q45** · 2026-AN · MCQ · 2 marks · Hard · bank topic: Data Flow Analysis: Constant Propagation, Liveliness Analysis, Common Subexpression Elimination · HAS A FIGURE (not shown here)

Consider the control flow graph given below.
[IMAGE_Q_45_1]
Which one of the following options is the set of live variables at the exit point of each basic block?

- A) B1: \( \{a, b, c, e, f\} \), B2: \( \{d, e\} \), B3: \( \{b, c, e, f\} \), B4: \( \phi \)  ✔ official
- B) B1: \( \phi \), B2: \( \{d, e\} \), B3: \( \{a, c, f\} \), B4: \( \phi \)
- C) B1: \( \{a, b, c, e, f\} \), B2: \( \{d, e\} \), B3: \( \{c, e, f\} \), B4: \( \phi \)
- D) B1: \( \phi \), B2: \( \{d, e, f\} \), B3: \( \{a, b, c, e, f\} \), B4: \( \phi \)

---

**2025_FN_Q13** · 2025-FN · MCQ · 1 mark · Easy · bank topic: Data Flow Analysis: Constant Propagation, Liveliness Analysis, Common Subexpression Elimination

Which ONE of the following techniques used in compiler code optimization uses live variable analysis?

- A) Run-time function call management
- B) Register assignment to variables  ✔ official
- C) Strength reduction
- D) Constant folding

---

**2025_AN_Q40** · 2025-AN · MCQ · 2 marks · Hard · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Given a Context-Free Grammar G as follows:
\( S \rightarrow Aa \mid bac \mid dc \mid bda \)
\( A \rightarrow d \)
Which ONE of the following statements is TRUE?

- A) \( G \) is neither LALR(1) nor SLR(1)
- B) \( G \) is CLR(1), not LALR(1)
- C) \( G \) is LALR(1), not SLR(1)  ✔ official
- D) \( G \) is LALR(1), also SLR(1)

---

**2025_FN_Q46** · 2025-FN · MSQ · 2 marks · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Which of the following statement(s) is/are TRUE while computing First and Follow during top down parsing by a compiler?

- A) For a production \( A \rightarrow \epsilon \), \( \epsilon \) will be added to First(A).  ✔ official
- B) If there is any input right end marker, it will be added to First(S), where S is the start symbol.
- C) For a production \( A \rightarrow \epsilon \), \( \epsilon \) will be added to Follow(A).
- D) If there is any input right end marker, it will be added to Follow(S), where S is the start symbol.  ✔ official

---

**2025_AN_Q51** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider two grammars \( G_1 \) and \( G_2 \) with the production rules given below:
\( G_1 : S \rightarrow \text{if } E \text{ then } S \mid \text{if } E \text{ then } S \text{ else } S \mid a \)
\( E \rightarrow b \)
\( G_2 : S \rightarrow \text{if } E \text{ then } S \mid M \)
\( M \rightarrow \text{if } E \text{ then } M \text{ else } S \mid c \)
\( E \rightarrow b \)
where if, then, else, a, b, c are the terminals.
Which of the following option(s) is/are CORRECT?

- A) \( G_1 \) is not \( LL(1) \) and \( G_2 \) is \( LL(1) \).
- B) \( G_1 \) is \( LL(1) \) and \( G_2 \) is not \( LL(1) \).
- C) \( G_1 \) and \( G_2 \) are not \( LL(1) \).  ✔ official
- D) \( G_1 \) and \( G_2 \) are ambiguous.  ✔ official

---

**2024_AN_Q17** · 2024-AN · MCQ · 1 mark · Easy · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following two sets:
**Set X**
P. Lexical Analyzer
Q. Syntax Analyzer
R. Intermediate Code Generator
S. Code Optimizer
**Set Y**
1. Abstract Syntax Tree
2. Token
3. Parse Tree
4. Constant Folding
Which one of the following options is the CORRECT match from **Set X** to **Set Y**?

- A) P - 4; Q - 1; R - 3; S - 2
- B) P - 2; Q - 3; R - 1; S - 4  ✔ official
- C) P - 2; Q - 1; R - 3; S - 4
- D) P - 4; Q - 3; R - 2; S - 1

---

**2024_FN_Q32** · 2024-FN · MSQ · 1 mark · Easy · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Which of the following is/are Bottom-Up Parser(s)?

- A) Shift-reduce Parser  ✔ official
- B) Predictive Parser
- C) LL(1) Parser
- D) LR Parser  ✔ official

---

**2024_FN_Q61** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following grammar \( G \), with \( S \) as the start symbol. The grammar \( G \) has three incomplete productions denoted by (1), (2), and (3).
\( S \rightarrow daT \mid \) (1)
\( T \rightarrow aS \mid bT \mid \) (2)
\( R \rightarrow \) (3) \( \mid \epsilon \)
The set of terminals is \( \{a, b, c, d, f\} \). The FIRST and FOLLOW sets of the different non-terminals are as follows.
FIRST(\( S \)) = \( \{c, d, f\} \), FIRST(\( T \)) = \( \{a, b, \epsilon\} \), FIRST(\( R \)) = \( \{c, \epsilon\} \)
FOLLOW(\( S \)) = FOLLOW(\( T \)) = \( \{c, f, \$\} \), FOLLOW(\( R \)) = \( \{f\} \)
Which one of the following options CORRECTLY fills in the incomplete productions?

- A) (1) \( S \rightarrow Rf \), (2) \( T \rightarrow \epsilon \), (3) \( R \rightarrow cTR \)  ✔ official
- B) (1) \( S \rightarrow fR \), (2) \( T \rightarrow \epsilon \), (3) \( R \rightarrow cTR \)
- C) (1) \( S \rightarrow fR \), (2) \( T \rightarrow cT \), (3) \( R \rightarrow cR \)
- D) (1) \( S \rightarrow Rf \), (2) \( T \rightarrow cT \), (3) \( R \rightarrow cR \)

---

**2024_AN_Q51** · 2024-AN · MCQ · 2 marks · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR) · HAS A FIGURE (not shown here)

Consider the following context-free grammar where the start symbol is S and the set of terminals is \( \{a, b, c, d\} \).
\( S \rightarrow AaAb \mid BbBa \)
\( A \rightarrow cS \mid \epsilon \)
\( B \rightarrow dS \mid \epsilon \)
The following is a partially-filled LL(1) parsing table.
[IMAGE_Q_51_1]
Which one of the following options represents the CORRECT combination for the numbered cells in the parsing table?
Note: In the options, “blank” denotes that the corresponding cell is empty.

- A) (1) \( S \rightarrow AaAb \) (2) \( S \rightarrow BbBa \) (3) \( A \rightarrow \epsilon \) (4) \( B \rightarrow \epsilon \)  ✔ official
- B) (1) \( S \rightarrow BbBa \) (2) \( S \rightarrow AaAb \) (3) \( A \rightarrow \epsilon \) (4) \( B \rightarrow \epsilon \)
- C) (1) \( S \rightarrow AaAb \) (2) \( S \rightarrow BbBa \) (3) blank (4) blank
- D) (1) \( S \rightarrow BbBa \) (2) \( S \rightarrow AaAb \) (3) blank (4) blank

---

**2024_AN_Q64** · 2024-AN · NAT · 2 marks · Hard · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following augmented grammar, which is to be parsed with a SLR parser. The set of terminals is \( \{a, b, c, d, \#, @\} \)
\( S' \rightarrow S \)
\( S \rightarrow SS \mid Aa \mid bac \mid Bc \mid bBa \)
\( A \rightarrow d\# \)
\( B \rightarrow @ \)
Let \( I_0 = \text{CLOSURE} (\{S' \rightarrow \bullet S\}) \). The number of items in the set \( \text{GOTO}(I_0, S) \) is ________.

Official answer (numeric): 9 to 9

---

**2023_FN_Q11** · 2023-FN · MCQ · 1 mark · Easy · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following statements regarding the front-end and back-end of a compiler.
S1: The front-end includes phases that are independent of the target hardware.
S2: The back-end includes phases that are specific to the target hardware.
S3: The back-end includes phases that are specific to the programming language used in the source code.
Identify the CORRECT option.

- A) Only S1 is TRUE.
- B) Only S1 and S2 are TRUE.  ✔ official
- C) S1, S2, and S3 are all TRUE.
- D) Only S1 and S3 are TRUE.

---

**2023_FN_Q37** · 2023-FN · MCQ · 2 marks · Hard · bank topic: Data Flow Analysis: Constant Propagation, Liveliness Analysis, Common Subexpression Elimination · HAS A FIGURE (not shown here)

Consider the control flow graph shown:
[IMAGE_Q_37_1]
Which one of the following choices correctly lists the set of live variables at the exit point of each basic block?

- A) B1: { }, B2: {a}, B3: {a}, B4: {a}
- B) B1: {i, j}, B2: {a}, B3: {a}, B4: {i}
- C) B1: {a, i, j}, B2: {a, i, j}, B3: {a, i}, B4: {a}
- D) B1: {a, i, j}, B2: {a, i, j}, B3: {a, j}, B4: {a, i, j}  ✔ official

---

**2022_FN_Q13** · 2022-FN · MCQ · 1 mark · Easy · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Which one of the following statements is TRUE?

- A) The LALR(1) parser for a grammar G cannot have reduce-reduce conflict if the LR(1) parser for G does not have reduce-reduce conflict.
- B) Symbol table is accessed only during the lexical analysis phase.
- C) Data flow analysis is necessary for run-time memory management.
- D) LR(1) parsing is sufficient for deterministic context-free languages.  ✔ official

---

**2022_FN_Q29** · 2022-FN · NAT · 1 mark · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the augmented grammar with {+, *, (, ), id} as the set of terminals.
$$ S' \rightarrow S $$
$$ S \rightarrow S + R \mid R $$
$$ R \rightarrow R * P \mid P $$
$$ P \rightarrow (S) \mid id $$
If \(I_0\) is the set of two LR(0) items \(\{[S' \rightarrow S.], [S \rightarrow S. + R]\}\), then goto(closure(\(I_0\)), +) contains exactly ________ items.

Official answer (numeric): 5 to 5

---

**2021_AN_Q38** · 2021-AN · MCQ · 1 mark · Easy · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following ANSI C program:
```c
int main( ) {
    Integer x;
    return 0;
}
```
Which one of the following phases in a seven-phase C compiler will throw an error?

- A) Lexical analyzer
- B) Syntax analyzer
- C) Semantic analyzer  ✔ official
- D) Machine dependent optimizer

---

**2021_FN_Q56** · 2021-FN · MCQ · 1 mark · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following statements:
\(S_1\) : Every SLR(1) grammar is unambiguous but there are certain unambiguous grammars that are not SLR(1).
\(S_2\) : For any context-free grammar, there is a parser that takes at most \(O(n^3)\) time to parse a string of length \(n\).
Which one of the following options is correct?

- A) \(S_1\) is true and \(S_2\) is false
- B) \(S_1\) is false and \(S_2\) is true
- C) \(S_1\) is true and \(S_2\) is true  ✔ official
- D) \(S_1\) is false and \(S_2\) is false

---

**2021_FN_Q36** · 2021-FN · MCQ · 2 marks · Hard · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR) · HAS A FIGURE (not shown here)

Consider the following context-free grammar where the set of terminals is \(\{a, b, c, d, f\}\)
\(S \rightarrow daT \mid Rf\)
\(T \rightarrow aS \mid baT \mid \epsilon\)
\(R \rightarrow caTR \mid \epsilon\)
The following is a partially-filled LL(1) parsing table.

[IMAGE_Q_36_1]

Which one of the following choices represents the correct combination for the numbered cells in the parsing table (“blank” denotes that the corresponding cell is empty)?

- A) 1 \(S \rightarrow Rf\) 2 \(S \rightarrow Rf\) 3 \(T \rightarrow \epsilon\) 4 \(T \rightarrow \epsilon\)  ✔ official
- B) 1 blank 2 \(S \rightarrow Rf\) 3 \(T \rightarrow \epsilon\) 4 \(T \rightarrow \epsilon\)
- C) 1 \(S \rightarrow Rf\) 2 blank 3 blank 4 \(T \rightarrow \epsilon\)
- D) 1 blank 2 \(S \rightarrow Rf\) 3 blank 4 blank

---

**2021_AN_Q33** · 2021-AN · MCQ · 2 marks · Easy · bank topic: Data Flow Analysis: Constant Propagation, Liveliness Analysis, Common Subexpression Elimination

For a statement \(S\) in a program, in the context of liveness analysis, the following sets are defined :
\(USE(S)\) : the set of variables used in \(S\)
\(IN(S)\) : the set of variables that are live at the entry of \(S\)
\(OUT(S)\) : the set of variables that are live at the exit of \(S\)
Consider a basic block that consists of two statements, \(S_1\) followed by \(S_2\).
Which one of the following statements is correct?

- A) \(OUT(S_1) = IN(S_2)\)  ✔ official
- B) \(OUT(S_1) = IN(S_1) \cup USE(S_1)\)
- C) \(OUT(S_1) = IN(S_2) \cup OUT(S_2)\)
- D) \(OUT(S_1) = USE(S_1) \cup IN(S_2)\)

---

**2021_AN_Q46** · 2021-AN · NAT · 2 marks · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following augmented grammar with {\#, @, <, >, a, b, c} as the set of terminals.
\(S' \rightarrow S\)
\(S \rightarrow S \# cS\)
\(S \rightarrow SS\)
\(S \rightarrow S@\)
\(S \rightarrow <S>\)
\(S \rightarrow a\)
\(S \rightarrow b\)
\(S \rightarrow c\)
Let \(I_0 = \text{CLOSURE}(\{S' \rightarrow \bullet S\})\). The number of items in the set \(\text{GOTO}(\text{GOTO}(I_0, <), <)\) is _________.

Official answer (numeric): 8 to 8

---

**2020_FN_Q21** · 2020-FN · NAT · 1 mark · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following grammar:
\( S \rightarrow aSB \mid d \)
\( B \rightarrow b \)
The number of reduction steps taken by a bottom-up parser while accepting the string aaadbbb is ________.

Official answer (numeric): 7 to 7

---

**2019_FN_Q19** · 2019-FN · MCQ · 1 mark · Easy · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Which one of the following kinds of derivation is used by LR parsers?

- A) Leftmost
- B) Leftmost in reverse
- C) Rightmost
- D) Rightmost in reverse  ✔ official

---

**2019_FN_Q13** · 2019-FN · NAT · 1 mark · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR) · HAS A FIGURE (not shown here)

Consider the grammar given below:
S \(\rightarrow\) Aa
A \(\rightarrow\) BD
B \(\rightarrow\) b | \(\epsilon\)
D \(\rightarrow\) d | \(\epsilon\)
Let a, b, d and $ be indexed as follows:
[IMAGE_Q_13]
Compute the FOLLOW set of the non-terminal B and write the index values for the symbols in the FOLLOW set in the descending order. (For example, if the FOLLOW set is {a, b, d, $}, then the answer should be 3210)

Official answer (numeric): 31 to 31

---

**2019_FN_Q36** · 2019-FN · NAT · 2 marks · Hard · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the augmented grammar given below:
S' \(\rightarrow\) S
S \(\rightarrow\) (L) | id
L \(\rightarrow\) L, S | S
Let \( I_0 = \text{CLOSURE} (\{[S' \rightarrow S]\}) \). The number of items in the set GOTO (\( I_0 \), ( ) is ________.

Official answer (numeric): 5 to 5

---

**2018_FN_Q18** · 2018-FN · MCQ · 1 mark · Easy · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Which one of the following statements is FALSE?

- A) Context-free grammar can be used to specify both lexical and syntax rules.
- B) Type checking is done before parsing.  ✔ official
- C) High-level language programs can be translated to different Intermediate Representations.
- D) Arguments to a function can be passed using the program stack.

---

**2018_FN_Q47** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

A lexical analyzer uses the following patterns to recognize three tokens \(T_1, T_2\), and \(T_3\) over the alphabet \(\{a,b,c\}\).
\(T_1: a? (b|c)^* a\)
\(T_2: b? (a|c)^* b\)
\(T_3: c? (b|a)^* c\)
Note that ‘x?’ means 0 or 1 occurrence of the symbol x. Note also that the analyzer outputs the token that matches the longest possible prefix.
If the string \(bbaacabc\) is processed by the analyzer, which one of the following is the sequence of tokens it outputs?

- A) \(T_1 T_2 T_3\)
- B) \(T_1 T_1 T_3\)
- C) \(T_2 T_1 T_3\)
- D) \(T_3 T_3\)  ✔ official

---

**2018_FN_Q48** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR) · HAS A FIGURE (not shown here)

Consider the following parse tree for the expression a#b$c$d#e#f, involving two binary operators $ and #.
[IMAGE_Q_48]
Which one of the following is correct for the given parse tree?

- A) $ has higher precedence and is left associative; # is right associative  ✔ official
- B) # has higher precedence and is left associative; $ is right associative
- C) $ has higher precedence and is left associative; # is left associative
- D) # has higher precedence and is right associative; $ is left associative

---

**2017_AN_Q30** · 2017-AN · MCQ · 1 mark · Easy · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Match the following according to input (from the left column) to the compiler phase (in the right column) that processes it:
List-I
(P) Syntax tree
(Q) Character stream
(R) Intermediate representation
(S) Token stream
List-II
(i) Code generator
(ii) Syntax analyzer
(iii) Semantic analyzer
(iv) Lexical analyzer

- A) P \(\rightarrow\) (ii), Q \(\rightarrow\) (iii), R \(\rightarrow\) (iv), S \(\rightarrow\) (i)
- B) P \(\rightarrow\) (ii), Q \(\rightarrow\) (i), R \(\rightarrow\) (iii), S \(\rightarrow\) (iv)
- C) P \(\rightarrow\) (iii), Q \(\rightarrow\) (iv), R \(\rightarrow\) (i), S \(\rightarrow\) (ii)  ✔ official
- D) P \(\rightarrow\) (i), Q \(\rightarrow\) (iv), R \(\rightarrow\) (ii), S \(\rightarrow\) (iii)

---

**2017_AN_Q35** · 2017-AN · MCQ · 1 mark · Easy · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Which of the following statements about parser is/are CORRECT?
I. Canonical LR is more powerful than SLR.
II. SLR is more powerful than LALR.
III. SLR is more powerful than Canonical LR.

- A) I only  ✔ official
- B) II only
- C) III only
- D) II and III only

---

**2017_FN_Q13** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following grammar:
\(P \rightarrow xQRS\)
\(Q \rightarrow yz \mid z\)
\(R \rightarrow w \mid \epsilon\)
\(S \rightarrow y\)
What is FOLLOW \((Q)\)?

- A) \(\{R\}\)
- B) \(\{w\}\)
- C) \(\{w, y\}\)  ✔ official
- D) \(\{w, \$\}\)

---

**2017_AN_Q46** · 2017-AN · MCQ · 2 marks · Hard · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following expression grammar G :
\(E \rightarrow E - T \mid T\)
\(T \rightarrow T + F \mid F\)
\(F \rightarrow (E) \mid \text{id}\)
Which of the following grammars is not left recursive, but is equivalent to G?

- A) \(E \rightarrow E - T \mid T\) \(T \rightarrow T + F \mid F\) \(F \rightarrow (E) \mid \text{id}\)
- B) \(E \rightarrow TE'\) \(E' \rightarrow -TE' \mid \epsilon\) \(T \rightarrow T + F \mid F\) \(F \rightarrow (E) \mid \text{id}\)
- C) \(E \rightarrow TX\) \(X \rightarrow -TX \mid \epsilon\) \(T \rightarrow FY\) \(Y \rightarrow +FY \mid \epsilon\) \(F \rightarrow (E) \mid \text{id}\)  ✔ official
- D) \(E \rightarrow TX \mid (TX)\) \(X \rightarrow -TX \mid +TX \mid \epsilon\) \(T \rightarrow \text{id}\)

