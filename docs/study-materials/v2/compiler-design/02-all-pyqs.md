# Compiler Design: every PYQ in the bank (55 questions)

Full text with options. "✔ official" marks the official key. Figures are not included (the question says so).

---

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

**2025_FN_Q13** · 2025-FN · MCQ · 1 mark · Easy · bank topic: Data Flow Analysis: Constant Propagation, Liveliness Analysis, Common Subexpression Elimination

Which ONE of the following techniques used in compiler code optimization uses live variable analysis?

- A) Run-time function call management
- B) Register assignment to variables  ✔ official
- C) Strength reduction
- D) Constant folding

---

**2025_AN_Q21** · 2025-AN · MCQ · 1 mark · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the following statements about the use of backpatching in a compiler for intermediate code generation:
(I) Backpatching can be used to generate code for Boolean expression in one pass.
(II) Backpatching can be used to generate code for flow-of-control statements in one pass.
Which ONE of the following options is CORRECT?

- A) Only (I) is correct.
- B) Only (II) is correct.
- C) Both (I) and (II) are correct.  ✔ official
- D) Neither (I) nor (II) is correct.

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

**2025_FN_Q52** · 2025-FN · NAT · 2 marks · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Refer to the given 3-address code sequence. This code sequence is split into basic blocks. The number of basic blocks is ________. (Answer in integer)
1001: i = 1
1002: j = 1
1003: t1 = 10 * i
1004: t2 = t1 + j
1005: t3 = 8 * t2
1006: t4 = t3 - 88
1007: a[t4] = 0.0
1008: j = j + 1
1009: if j <= 10 goto 1003
1010: i = i + 1
1011: if i <= 10 goto 1002
1012: i = 1
1013: t5 = i - 1
1014: t6 = 88 * t5
1015: a[t6] = 1.0
1016: i = i + 1
1017: if i <= 10 goto 1013

Official answer (numeric): 6 to 6

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

**2024_FN_Q51** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the following pseudo-code.
\( L1: \quad t1 = -1 \)
\( L2: \quad t2 = 0 \)
\( L3: \quad t3 = 0 \)
\( L4: \quad t4 = 4 * t3 \)
\( L5: \quad t5 = 4 * t2 \)
\( L6: \quad t6 = t5 * M \)
\( L7: \quad t7 = t4 + t6 \)
\( L8: \quad t8 = a[t7] \)
\( L9: \quad \text{if } t8 <= \max \text{ goto } L11 \)
\( L10: \quad t1 = t8 \)
\( L11: \quad t3 = t3 + 1 \)
\( L12: \quad \text{if } t3 < M \text{ goto } L4 \)
\( L13: \quad t2 = t2 + 1 \)
\( L14: \quad \text{if } t2 < N \text{ goto } L3 \)
\( L15: \quad \max = t1 \)
Which one of the following options CORRECTLY specifies the number of basic blocks and the number of instructions in the largest basic block, respectively?

- A) 6 and 6
- B) 6 and 7
- C) 7 and 7
- D) 7 and 6  ✔ official

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

**2024_AN_Q48** · 2024-AN · MCQ · 2 marks · Medium · bank topic: Intermediate Code Generation & Local Code Optimization · HAS A FIGURE (not shown here)

Consider the following expression: \( x[i] = (p + r)* - s[i] + u/w \). The following sequence shows the list of triples representing the given expression, with entries missing for triples (1), (3), and (6).
[IMAGE_Q_48_1]
Which of the following options fill in the missing entries CORRECTLY?

- A) (1) = [ ] s i, (3) *(0) (2), (6) [ ] = x i  ✔ official
- B) (1) [ ] = s i, (3) - (0) (2), (6) = [ ] x (5)
- C) (1) = [ ] s i, (3) *(0) (2), (6) [ ] = x (5)
- D) (1) [ ] = s i, (3) - (0) (2), (6) = [ ] x i

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

**2021_AN_Q22** · 2021-AN · MSQ · 1 mark · Easy · bank topic: Intermediate Code Generation & Local Code Optimization

In the context of compilers, which of the following is/are NOT an intermediate representation of the source program?

- A) Three address code
- B) Abstract Syntax Tree (AST)
- C) Control Flow Graph (CFG)
- D) Symbol table  ✔ official

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

**2021_AN_Q43** · 2021-AN · MCQ · 2 marks · Hard · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the following ANSI C code segment:
```c
z = x + 3 + y -> f1 + y -> f2;
for (i = 0; i < 200; i = i + 2) {
    if (z > i) {
        p = p + x + 3;
        q = q + y -> f1;
    } else {
        p = p + y -> f2;
        q = q + x + 3;
    }
}
```
Assume that the variable \(y\) points to a struct (allocated on the heap) containing two fields \(f1\) and \(f2\), and the local variables \(x\), \(y\), \(z\), \(p\), \(q\), and \(i\) are allotted registers. Common sub-expression elimination (CSE) optimization is applied on the code. The number of addition and dereference operations (of the form \(y \rightarrow f1\) or \(y \rightarrow f2\)) in the optimized code, respectively, are :

- A) 403 and 102
- B) 203 and 2
- C) 303 and 102
- D) 303 and 2  ✔ official

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

**2021_FN_Q11** · 2021-FN · NAT · 2 marks · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the following C code segment:
```c
a = b + c;
e = a + 1;
d = b + c;
f = d + 1;
g = e + f;
```
In a compiler, this code segment is represented internally as a directed acyclic graph (DAG). The number of nodes in the DAG is _________.

Official answer (numeric): 6 to 6

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

**2020_FN_Q21** · 2020-FN · NAT · 1 mark · Medium · bank topic: Lexical Analysis & Parsing Architectures (LL(1), LR(1), LALR)

Consider the following grammar:
\( S \rightarrow aSB \mid d \)
\( B \rightarrow b \)
The number of reduction steps taken by a bottom-up parser while accepting the string aaadbbb is ________.

Official answer (numeric): 7 to 7

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

**2019_FN_Q57** · 2019-FN · MCQ · 2 marks · Hard · bank topic: Syntax-Directed Translation & Runtime Environments · HAS A FIGURE (not shown here)

Consider the following grammar and the semantic actions to support the inherited type declaration attributes. Let \( X_1, X_2, X_3, X_4, X_5 \) and \( X_6 \) be the place holders for the non-terminals D, T, L or \( L_1 \) in the following table:
[IMAGE_Q_57]
Which one of the following are the appropriate choices for \( X_1, X_2, X_3 \) and \( X_4 \)?

- A) \( X_1 = L, X_2 = T, X_3 = L_1, X_4 = L \)  ✔ official
- B) \( X_1 = T, X_2 = L, X_3 = L_1, X_4 = T \)
- C) \( X_1 = L, X_2 = L, X_3 = L_1, X_4 = T \)
- D) \( X_1 = T, X_2 = L, X_3 = T, X_4 = L_1 \)

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

**2017_FN_Q16** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the following intermediate program in three address code
```
p = a - b
q = p * c
p = u * v
q = p + q
```
Which one of the following corresponds to a static single assignment form of the above code?

- A) ``` p_1 = a - b q_1 = p_1 * c p_1 = u * v q_1 = p_1 + q_1 ```
- B) ``` p_3 = a - b q_4 = p_3 * c p_4 = u * v q_5 = p_4 + q_4 ```  ✔ official
- C) ``` p_1 = a - b q_1 = p_2 * c p_3 = u * v q_2 = p_4 + q_3 ```
- D) ``` p_1 = a - b q_1 = p * c q_2 = u * v q_2 = p + q ```

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

---

**2017_FN_Q54** · 2017-FN · NAT · 2 marks · Medium · bank topic: Intermediate Code Generation & Local Code Optimization

Consider the expression \((a - 1) * (((b + c)/3) + d)\). Let \(X\) be the minimum number of registers required by an optimal code generation (without any register spill) algorithm for a load/store architecture, in which (i) only load and store instructions can have memory operands and (ii) arithmetic instructions can have only register or immediate operands. The value of \(X\) is ________.

Official answer (numeric): 2.0 to 2.0

---

