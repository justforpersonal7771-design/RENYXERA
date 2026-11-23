# Review input: Databases, chapter 02: Relational model and integrity constraints

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-02-relational-model-and-integrity-constraints.md` and `gemini-02-relational-model-and-integrity-constraints.md` in this folder.

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

This is **one chapter** (2 of 8) of the Databases book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Relational model and integrity constraints**. Written lessons today: 2 topics ready.



## The PYQs for this chapter (28)

**2026_AN_Q15** · 2026-AN · MCQ · 1 mark · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus

In the context of DBMS, consider the two sets **T** and **S** given below.
**T**
I: Logical schema
II: Physical schema
III: External schema
**S**
L: Views
M: File organization and indexes
N: Relations
Which one of the following is the correct match from T to S?

- A) I – L, II – M, III – N
- B) I – M, II – L, III – N
- C) I – N, II – M, III – L  ✔ official
- D) I – N, II – L, III – M

---

**2026_FN_Q30** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Integrity Constraints & Functional Dependencies

Let \( P, Q, R \) and \( S \) be the attributes of a relation in a relational schema. Let \( X \rightarrow Y \) indicate functional dependency in the context of a relational database, where \( X, Y \subseteq \{P, Q, R, S\} \).
Which of the following options is/are always true?

- A) If \( \{P, Q\} \rightarrow \{R\} \) and \( \{P\} \rightarrow \{R\} \), then \( \{Q\} \rightarrow \{R\} \)
- B) If \( \{P, Q\} \rightarrow \{R\} \), then (\( \{P\} \rightarrow \{R\} \) or \( \{Q\} \rightarrow \{R\} \))
- C) If (\( \{P\} \rightarrow \{R\} \) and \( \{Q\} \rightarrow \{S\} \)), then \( \{P, Q\} \rightarrow \{R, S\} \)  ✔ official
- D) If \( \{P\} \rightarrow \{R\} \), then \( \{P, Q\} \rightarrow \{R\} \)  ✔ official

---

**2026_AN_Q42** · 2026-AN · MCQ · 2 marks · Medium · bank topic: Integrity Constraints & Functional Dependencies

In the context of schema normalization in relational DBMS, consider a set \( F \) of functional dependencies. The set of all functional dependencies implied by \( F \) is called the closure of \( F \). To compute the closure of \( F \), Armstrong's Axioms can be applied. Consider \( X, Y, \) and \( Z \) as sets of attributes over a relational schema. The three rules of Armstrong's Axioms are described as follows.
Reflexivity: If \( Y \subseteq X \), then \( X \rightarrow Y \)
Augmentation: If \( X \rightarrow Y \), then \( XZ \rightarrow YZ \) for any \( Z \)
Transitivity: If \( X \rightarrow Y \) and \( Y \rightarrow Z \), then \( X \rightarrow Z \)
The additional rule of Union is defined as follows.
Union: If \( X \rightarrow Y \) and \( X \rightarrow Z \), then \( X \rightarrow YZ \)
It can be proved that the additional rule of Union is also implied by the three rules of Armstrong's Axioms. Listed below are four combinations of these three rules. Which one of these combinations is both necessary and sufficient for the proof?

- A) Reflexivity, Augmentation, and Transitivity
- B) Reflexivity and Augmentation
- C) Transitivity
- D) Augmentation and Transitivity  ✔ official

---

**2026_FN_Q43** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus

Consider a relational database schema with two relations \( R(P, Q) \) and \( S(X, Y) \). Let \( E = \{\langle u \rangle \mid \exists v \exists w (\langle u, v \rangle \in R \land \langle v, w \rangle \in S)\} \) be a tuple relational calculus expression. Which one of the following relational algebraic expressions is equivalent to \( E \)?

- A) \( \Pi_P(R \bowtie_{P=S.X} S) \)
- B) \( \Pi_P(S \bowtie_{S.X=R.Q} R) \)  ✔ official
- C) \( \Pi_P(R \bowtie_{R.P=S.Y} S) \)
- D) \( \Pi_P(S \bowtie_{S.Y=R.Q} R) \)

---

**2026_FN_Q65** · 2026-FN · NAT · 2 marks · Medium · bank topic: Integrity Constraints & Functional Dependencies

Consider a relational database schema with a relation \( R(A, B, C, D) \). If \( \{A, B\} \) and \( \{A, C\} \) are the only two candidate keys of the relation \( R \), then the number of superkeys of relation \( R \) is ________. (answer in integer)

Official answer (numeric): 6 to 6

---

**2025_FN_Q39** · 2025-FN · MCQ · 2 marks · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus

Consider two relations describing teams and players in a sports league:
• teams(tid, tname): tid, tname are team-id and team-name, respectively.
• players(pid, pname, tid): pid, pname, and tid denote player-id, player-name and the team-id of the player, respectively.
Which ONE of the following tuple relational calculus queries returns the name of the players who play for the team having tname as 'MI'?

- A) \( \{p.\text{pname} \mid p \in \text{players} \land \exists t (t \in \text{teams} \land p.\text{tid} = t.\text{tid} \land t.\text{tname} = \text{'MI'})\} \)  ✔ official
- B) \( \{p.\text{pname} \mid p \in \text{teams} \land \exists t (t \in \text{players} \land p.\text{tid} = t.\text{tid} \land t.\text{tname} = \text{'MI'})\} \)
- C) \( \{p.\text{pname} \mid p \in \text{players} \land \exists t (t \in \text{teams} \land t.\text{tname} = \text{'MI'})\} \)
- D) \( \{p.\text{pname} \mid p \in \text{teams} \land \exists t (t \in \text{players} \land t.\text{tname} = \text{'MI'})\} \)

---

**2024_FN_Q24** · 2024-FN · MCQ · 1 mark · Medium · bank topic: ER-Model · HAS A FIGURE (not shown here)

Let S be the specification: “Instructors teach courses. Students register for courses. Courses are allocated classrooms. Instructors guide students.” Which one of the following ER diagrams CORRECTLY represents S?
[IMAGE_Q_24_1]

- A) (i)
- B) (ii)
- C) (iii)
- D) (iv)  ✔ official

---

**2024_AN_Q22** · 2024-AN · MCQ · 1 mark · Easy · bank topic: ER-Model

In the context of owner and weak entity sets in the ER (Entity-Relationship) data model, which one of the following statements is TRUE?

- A) The weak entity set MUST have total participation in the identifying relationship.  ✔ official
- B) The owner entity set MUST have total participation in the identifying relationship.
- C) Both weak and owner entity sets MUST have total participation in the identifying relationship.
- D) Neither weak entity set nor owner entity set MUST have total participation in the identifying relationship.

---

**2024_FN_Q35** · 2024-FN · NAT · 1 mark · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus · HAS A FIGURE (not shown here)

Consider the following two relations, \( R(A, B) \) and \( S(A, C) \):
[IMAGE_Q_35_1][IMAGE_Q_35_2]
The total number of tuples obtained by evaluating the following expression
\[ \sigma_{B < C}(R \bowtie_{R.A = S.A} S) \]
is ________.

Official answer (numeric): 2 to 2

---

**2024_FN_Q44** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Integrity Constraints & Functional Dependencies

The symbol \( \rightarrow \) indicates functional dependency in the context of a relational database. Which of the following options is/are TRUE?

- A) \( (X, Y) \rightarrow (Z, W) \text{ implies } X \rightarrow (Z, W) \)
- B) \( (X, Y) \rightarrow (Z, W) \text{ implies } (X, Y) \rightarrow Z \)  ✔ official
- C) \( ((X, Y) \rightarrow Z \text{ and } W \rightarrow Y) \text{ implies } (X, W) \rightarrow Z \)  ✔ official
- D) \( (X \rightarrow Y \text{ and } Y \rightarrow Z) \text{ implies } X \rightarrow Z \)  ✔ official

---

**2024_AN_Q59** · 2024-AN · MCQ · 2 marks · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus

The relation schema, Person (pid, city), describes the city of residence for every person uniquely identified by pid. The following relational algebra operators are available: selection, projection, cross product, and rename.
To find the list of cities where at least 3 persons reside, using the above operators, the minimum number of cross product operations that must be used is

- A) 1
- B) 2  ✔ official
- C) 3
- D) 4

---

**2024_AN_Q39** · 2024-AN · NAT · 2 marks · Hard · bank topic: Integrity Constraints & Functional Dependencies

A functional dependency \( F : X \rightarrow Y \) is termed as a useful functional dependency if and only if it satisfies all the following three conditions:
• \( X \) is not the empty set.
• \( Y \) is not the empty set.
• Intersection of \( X \) and \( Y \) is the empty set.
For a relation \( R \) with 4 attributes, the total number of possible useful functional dependencies is ________.

Official answer (numeric): 50 to 50

---

**2023_FN_Q16** · 2023-FN · MCQ · 1 mark · Easy · bank topic: Relational Models, Relational Algebra, Tuple Calculus

Which one of the options given below refers to the degree (or arity) of a relation in relational database systems?

- A) Number of attributes of its relation schema.  ✔ official
- B) Number of tuples stored in the relation.
- C) Number of entries in the relation.
- D) Number of distinct domains of its relation schema.

---

**2022_FN_Q25** · 2022-FN · MSQ · 1 mark · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus

Consider the following three relations in a relational database.
Employee (\underline{eId}, Name), Brand (\underline{bId}, bName), Own(\underline{eId, bId})
Which of the following relational algebra expressions return the set of eIds who own all the brands?

- A) \(\pi_{eId} (\pi_{eId, bId} (\text{Own}) / \pi_{bId} (\text{Brand}))\)  ✔ official
- B) \(\pi_{eId} (\text{Own}) - \pi_{eId} ((\pi_{eId} (\text{Own}) \times \pi_{bId} (\text{Brand})) - \pi_{eId, bId} (\text{Own}))\)  ✔ official
- C) \(\pi_{eId} (\pi_{eId, bId} (\text{Own}) / \pi_{bId} (\text{Own}))\)
- D) \(\pi_{eId} ((\pi_{eId} (\text{Own}) \times \pi_{bId} (\text{Own}) / \pi_{bId} (\text{Brand}))\)

---

**2022_FN_Q31** · 2022-FN · NAT · 1 mark · Medium · bank topic: Integrity Constraints & Functional Dependencies

Consider a relation \(R(A, B, C, D, E)\) with the following three functional dependencies.
$$ AB \rightarrow C; BC \rightarrow D; C \rightarrow E; $$
The number of superkeys in the relation \(R\) is __________.

Official answer (numeric): 8 to 8

---

**2021_AN_Q16** · 2021-AN · MCQ · 1 mark · Easy · bank topic: Integrity Constraints & Functional Dependencies

Consider the following statements \(S_1\) and \(S_2\) about the relational data model :
\(S_1\) : A relation scheme can have at most one foreign key.
\(S_2\) : A foreign key in a relation scheme \(R\) cannot be used to refer to tuples of \(R\).
Which one of the following choices is correct?

- A) Both \(S_1\) and \(S_2\) are true.
- B) \(S_1\) is true and \(S_2\) is false.
- C) \(S_1\) is false and \(S_2\) is true.
- D) Both \(S_1\) and \(S_2\) are false.  ✔ official

---

**2021_FN_Q45** · 2021-FN · NAT · 1 mark · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus

A relation \(r(A, B)\) in a relational database has 1200 tuples. The attribute \(A\) has integer values ranging from 6 to 20, and the attribute \(B\) has integer values ranging from 1 to 20. Assume that the attributes \(A\) and \(B\) are independently distributed.
The estimated number of tuples in the output of \(\sigma_{(A > 10) \lor (B = 18)}(r)\) is _________.

Official answer (numeric): 819 to 820 OR 205 to 205

---

**2021_FN_Q53** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus

The following relation records the age of 500 employees of a company, where empNo (indicating the employee number) is the key:
empAge(\underline{empNo}, age)
Consider the following relational algebra expression:
\(\Pi_{\text{empNo}} (\text{empAge} \bowtie_{(\text{age} > \text{age1})} \rho_{\text{empNo1, age1}} (\text{empAge}))\)
What does the above expression generate?

- A) Employee numbers of only those employees whose age is the maximum.
- B) Employee numbers of only those employees whose age is more than the age of exactly one other employee.
- C) Employee numbers of all employees whose age is not the minimum.  ✔ official
- D) Employee numbers of all employees whose age is the minimum.

---

**2021_AN_Q28** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Integrity Constraints & Functional Dependencies

Suppose the following functional dependencies hold on a relation \(U\) with attributes \(P\), \(Q\), \(R\), \(S\) and \(T\):
\(P \rightarrow QR\)
\(RS \rightarrow T\)
Which of the following functional dependencies can be inferred from the above functional dependencies?

- A) \(PS \rightarrow T\)  ✔ official
- B) \(R \rightarrow T\)
- C) \(P \rightarrow R\)  ✔ official
- D) \(PS \rightarrow Q\)  ✔ official

---

**2020_FN_Q13** · 2020-FN · MCQ · 1 mark · Easy · bank topic: ER-Model

Which one of the following is used to represent the supporting many-one relationships of a weak entity set in an entity-relationship diagram?

- A) Diamonds with double/bold border  ✔ official
- B) Rectangles with double/bold border
- C) Ovals with double/bold border
- D) Ovals that contain underlined identifiers

---

**2019_FN_Q47** · 2019-FN · NAT · 2 marks · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus · HAS A FIGURE (not shown here)

Consider the following relations P(X, Y, Z), Q(X, Y, T) and R(Y, V).
[IMAGE_Q_47]
How many tuples will be returned by the following relational algebra query?
\( \Pi_x (\sigma_{(P.Y = R.Y \land R.V = V2)} (P \times R)) - \Pi_x (\sigma_{(Q.Y = R.Y \land Q.T > 2)} (Q \times R)) \)

Official answer (numeric): 1 to 1

---

**2018_FN_Q21** · 2018-FN · MCQ · 1 mark · Easy · bank topic: ER-Model

In an Entity-Relationship (ER) model, suppose \(R\) is a many-to-one relationship from entity set E1 to entity set E2. Assume that E1 and E2 participate totally in \(R\) and that the cardinality of E1 is greater than the cardinality of E2.
Which one of the following is true about \(R\)?

- A) Every entity in E1 is associated with exactly one entity in E2.  ✔ official
- B) Some entity in E1 is associated with more than one entity in E2.
- C) Every entity in E2 is associated with exactly one entity in E1.
- D) Every entity in E2 is associated with at most one entity in E1.

---

**2018_FN_Q51** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus

Consider the relations \(r(A, B)\) and \(s(B, C)\), where \(s.B\) is a primary key and \(r.B\) is a foreign key referencing \(s.B\). Consider the query
\(Q: r \bowtie (\sigma_{B<5}(s))\)
Let \(LOJ\) denote the natural left outer-join operation. Assume that \(r\) and \(s\) contain no null values.
Which one of the following queries is NOT equivalent to \(Q\)?

- A) \(\sigma_{B<5}(r \bowtie s)\)
- B) \(\sigma_{B<5}(r \ LOJ \ s)\)
- C) \(r \ LOJ \ (\sigma_{B<5}(s))\)  ✔ official
- D) \(\sigma_{B<5}(r) \ LOJ \ s\)

---

**2017_FN_Q17** · 2017-FN · MCQ · 1 mark · Medium · bank topic: Integrity Constraints & Functional Dependencies

The following functional dependencies hold true for the relational schema R{V, W, X, Y, Z}:
\(V \rightarrow W\)
\(VW \rightarrow X\)
\(Y \rightarrow VX\)
\(Y \rightarrow Z\)
Which of the following is irreducible equivalent for this set of functional dependencies?

- A) \(V \rightarrow W\) \(V \rightarrow X\) \(Y \rightarrow V\) \(Y \rightarrow Z\)  ✔ official
- B) \(V \rightarrow W\) \(W \rightarrow X\) \(Y \rightarrow V\) \(Y \rightarrow Z\)
- C) \(V \rightarrow W\) \(V \rightarrow X\) \(Y \rightarrow V\) \(Y \rightarrow X\) \(Y \rightarrow Z\)
- D) \(V \rightarrow W\) \(W \rightarrow X\) \(Y \rightarrow V\) \(Y \rightarrow X\) \(Y \rightarrow Z\)

---

**2017_AN_Q22** · 2017-AN · MCQ · 1 mark · Medium · bank topic: ER-Model

An ER model of a database consists of entity types A and B. These are connected by a relationship R which does not have its own attribute. Under which one of the following conditions, can the relational table for R be merged with that of A?

- A) Relationship R is one-to-many and the participation of A in R is total.
- B) Relationship R is one-to-many and the participation of A in R is partial.
- C) Relationship R is many-to-one and the participation of A in R is total.  ✔ official
- D) Relationship R is many-to-one and the participation of A in R is partial.

---

**2017_AN_Q26** · 2017-AN · NAT · 1 mark · Medium · bank topic: Integrity Constraints & Functional Dependencies · HAS A FIGURE (not shown here)

Consider the following tables \(T_1\) and \(T_2\).
[IMAGE_Q_26]
In table \(T_1\), \(P\) is the primary key and \(Q\) is the foreign key referencing \(R\) in table \(T_2\) with on-delete cascade and on-update cascade. In table \(T_2\), \(R\) is the primary key and \(S\) is the foreign key referencing \(P\) in table \(T_1\) with on-delete set NULL and on-update cascade. In order to delete record (3,8) from table \(T_1\), the number of additional records that need to be deleted from table \(T_1\) is ________.

Official answer (numeric): 0.0 to 0.0

---

**2017_FN_Q39** · 2017-FN · MCQ · 2 marks · Hard · bank topic: Relational Models, Relational Algebra, Tuple Calculus

Consider a database that has the relation schemas EMP(EmpId, EmpName, DeptId) and DEPT(DeptName, DeptId). Note that the DeptId can be permitted to be NULL in the relation EMP. Consider the following queries on the database expressed in tuple relational calculus.
I. \(\{t \mid \exists u \in \text{EMP} (t[\text{EmpName}] = u[\text{EmpName}] \wedge \forall v \in \text{DEPT} (t[\text{DeptId}] \neq v[\text{DeptId}]))\}\)
II. \(\{t \mid \exists u \in \text{EMP} (t[\text{EmpName}] = u[\text{EmpName}] \wedge \exists v \in \text{DEPT} (t[\text{DeptId}] \neq v[\text{DeptId}]))\}\)
III. \(\{t \mid \exists u \in \text{EMP} (t[\text{EmpName}] = u[\text{EmpName}] \wedge \exists v \in \text{DEPT} (t[\text{DeptId}] = v[\text{DeptId}]))\}\)
Which of the above queries are safe?

- A) I and II only
- B) I and III only
- C) II and III only
- D) I, II and III  ✔ official

---

**2017_FN_Q38** · 2017-FN · NAT · 2 marks · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus · HAS A FIGURE (not shown here)

Consider a database that has the relation schema CR( StudentName, CourseName).
An instance of the schema CR is as given below:
[IMAGE_Q_38]
The following query is made on the database.
\(T_1 \leftarrow \pi_{\text{CourseName}} (\sigma_{\text{StudentName} = \text{'SA'}} (\text{CR}))\)
\(T_2 \leftarrow \text{CR} \div T_1\)
The number of rows in \(T_2\) is ________.

Official answer (numeric): 4.0 to 4.0

