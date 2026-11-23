# In-depth review input: Databases

**One file, one review.** Paste everything below the line into ChatGPT (new chat), and again into Gemini (new chat). If the chat refuses the length, attach this file and write: "Follow the instructions inside the file."

Save the replies in this folder as `chatgpt-review-databases.md` and `gemini-review-databases.md`, then tell me.

Contains: reviewer instructions (A), the subject's contents with the PYQ statistics (B), and all 72 PYQs with full text and the official key (C).

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

This is the **in-depth review of the whole Databases book**. Take your time. Go chapter by chapter, and give a much deeper answer than a quick review: at least **80 rows** in the gap table in Part 2 (spread across every chapter).

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

- ER-model.
- Relational model: relational algebra, tuple calculus, SQL.
- Integrity constraints, normal forms.
- File organization, indexing (e.g., B and B+ trees).
- Transactions and concurrency control.

## 2. What the app has today: chapters in the book

| # | Chapter | Written lessons in the app | Status |
|---|---|---|---|
| 01 | ER model | 3 topics ready | written (old standard; to be rewritten) |
| 02 | Relational model and integrity constraints | 2 topics ready | written (old standard; to be rewritten) |
| 03 | Relational algebra and tuple calculus | 3 topics ready | written (old standard; to be rewritten) |
| 04 | SQL | 4 topics ready | written (old standard; to be rewritten) |
| 05 | Functional dependencies and normal forms | 4 topics ready | written (old standard; to be rewritten) |
| 06 | File organisation and indexing (B and B+ trees) | 3 topics ready | written (old standard; to be rewritten) |
| 07 | Transactions | 3 topics ready | written (old standard; to be rewritten) |
| 08 | Concurrency control | 4 topics ready | written (old standard; to be rewritten) |

*All existing lessons were written under the old rules (short, for people who already know the subject). They will be rewritten to the new beginner-first standard (`01-MASTER-PROMPT.md`).*

## 3. What the PYQ bank says (15 CS papers, 2017 to 2026)

- Questions: **72**; marks: **111** = **7.4%** of all 1500 marks (about 7.4 marks a paper).
- Forge (our own) questions for this subject: **30**.

The bank's own topic labels are coarse; they are shown as they are.

| Bank topic label | Questions | Marks | % of all marks | Years asked (of 10) | Easy / Medium / Hard | Types |
|---|---|---|---|---|---|---|
| Transactions, Concurrency Control, Conflict Serializability | 15 | 23 | 1.53% | 8 | 2/12/1 | MCQ1×4, MSQ1×3, MSQ2×2, MCQ2×5, NAT2×1 |
| Relational Models, Relational Algebra, Tuple Calculus | 13 | 21 | 1.40% | 9 | 1/11/1 | MCQ2×6, MCQ1×2, NAT1×2, MSQ1×1, NAT2×2 |
| SQL Queries (DDL/DML, Joins, Aggregations) | 10 | 17 | 1.13% | 8 | 2/8/0 | NAT2×5, MSQ2×1, MCQ2×1, MCQ1×2, NAT1×1 |
| Integrity Constraints & Functional Dependencies | 10 | 15 | 1.00% | 5 | 1/8/1 | MSQ1×1, NAT2×2, MCQ2×1, MSQ2×2, NAT1×2, MCQ1×2 |
| Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries) | 9 | 15 | 1.00% | 8 | 3/6/0 | MSQ1×2, MSQ2×2, MCQ1×1, MCQ2×4 |
| File Organization & Indexing (e.g., B and B+ Trees) | 10 | 15 | 1.00% | 8 | 3/4/3 | MCQ2×1, MSQ1×2, NAT2×4, MCQ1×2, NAT1×1 |
| ER-Model | 5 | 5 | 0.33% | 4 | 3/2/0 | MCQ1×5 |


---

## PART C. ALL 72 PREVIOUS-YEAR QUESTIONS (Databases)

Official key marked "✔ official". Figures are not shown; the question says so.

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

**2026_AN_Q20** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Transactions, Concurrency Control, Conflict Serializability

Consider concurrent execution of two transactions \( T1 \) and \( T2 \) in a DBMS, both of which access a data object \( A \). For these two transactions to not conflict on \( A \), which one of the following statements must be true?

- A) Both \( T1 \) and \( T2 \) only read \( A \)  ✔ official
- B) \( T1 \) reads \( A \) and \( T2 \) writes \( A \)
- C) \( T1 \) writes \( A \) and \( T2 \) reads \( A \)
- D) Both \( T1 \) and \( T2 \) write \( A \)

---

**2026_FN_Q30** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Integrity Constraints & Functional Dependencies

Let \( P, Q, R \) and \( S \) be the attributes of a relation in a relational schema. Let \( X \rightarrow Y \) indicate functional dependency in the context of a relational database, where \( X, Y \subseteq \{P, Q, R, S\} \).
Which of the following options is/are always true?

- A) If \( \{P, Q\} \rightarrow \{R\} \) and \( \{P\} \rightarrow \{R\} \), then \( \{Q\} \rightarrow \{R\} \)
- B) If \( \{P, Q\} \rightarrow \{R\} \), then (\( \{P\} \rightarrow \{R\} \) or \( \{Q\} \rightarrow \{R\} \))
- C) If (\( \{P\} \rightarrow \{R\} \) and \( \{Q\} \rightarrow \{S\} \)), then \( \{P, Q\} \rightarrow \{R, S\} \)  ✔ official
- D) If \( \{P\} \rightarrow \{R\} \), then \( \{P, Q\} \rightarrow \{R\} \)  ✔ official

---

**2026_FN_Q31** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

In the context of relational database normalization, which of the following statements is/are true?

- A) It is always possible to obtain a dependency-preserving 3NF decomposition of a relation  ✔ official
- B) It is always possible to obtain a dependency-preserving 1NF decomposition of a relation  ✔ official
- C) It is not always possible to obtain a dependency-preserving BCNF decomposition of a relation  ✔ official
- D) It is not always possible to obtain a dependency-preserving 2NF decomposition of a relation

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

**2026_AN_Q46** · 2026-AN · MCQ · 2 marks · Medium · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

An index in a DBMS is said to be dense if an index entry appears for every search-key value in the indexed file. Otherwise it is called a sparse index. Consider the following two statements.
S1: A hash index must be a dense index
S2: A B+ tree index can be a sparse index
Which one of the following options is correct?

- A) Both S1 and S2 are true  ✔ official
- B) Both S1 and S2 are false
- C) S1 is true and S2 is false
- D) S1 is false and S2 is true

---

**2026_FN_Q65** · 2026-FN · NAT · 2 marks · Medium · bank topic: Integrity Constraints & Functional Dependencies

Consider a relational database schema with a relation \( R(A, B, C, D) \). If \( \{A, B\} \) and \( \{A, C\} \) are the only two candidate keys of the relation \( R \), then the number of superkeys of relation \( R \) is ________. (answer in integer)

Official answer (numeric): 6 to 6

---

**2025_FN_Q15** · 2025-FN · MCQ · 1 mark · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

A schedule of three database transactions \( T_1 \), \( T_2 \), and \( T_3 \) is shown. \( R_i(A) \) and \( W_i(A) \) denote read and write of data item \( A \) by transaction \( T_i \), \( i = 1, 2, 3 \). The transaction \( T_1 \) aborts at the end. Which other transaction(s) will be required to be rolled back?
\( R_1(X) \; W_1(Y) \; R_2(X) \; R_2(Y) \; R_3(Y) \; ABORT(T_1) \)

- A) Only \( T_2 \)
- B) Only \( T_3 \)
- C) Both \( T_2 \) and \( T_3 \)  ✔ official
- D) Neither \( T_2 \) nor \( T_3 \)

---

**2025_FN_Q21** · 2025-FN · MSQ · 1 mark · Medium · bank topic: File Organization & Indexing (e.g., B and B+ Trees) · HAS A FIGURE (not shown here)

Consider the following \( B^+ \) tree with 5 nodes, in which a node can store at most 3 key values. The value 23 is now inserted in the \( B^+ \) tree. Which of the following options(s) is/are CORRECT?
[IMAGE_Q_21_1]

- A) None of the nodes will split.
- B) At least one node will split and redistribute.  ✔ official
- C) The total number of nodes will remain same.
- D) The height of the tree will increase.  ✔ official

---

**2025_AN_Q27** · 2025-AN · MSQ · 1 mark · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

An audit of a banking transactions system has found that on an earlier occasion, two joint holders of account \( A \) attempted simultaneous transfers of Rs. 10000 each from account \( A \) to account \( B \). Both transactions read the same value, Rs. 11000, as the initial balance in \( A \) and were allowed to go through. \( B \) was credited Rs. 10000 twice. \( A \) was debited only once and ended up with a balance of Rs. 1000.
Which of the following properties is/are certain to have been violated by the system?

- A) Atomicity
- B) Consistency  ✔ official
- C) Isolation  ✔ official
- D) Durability

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

**2025_AN_Q46** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

Consider the following relational schema along with all the functional dependencies that hold on them.
\( R1(A, B, C, D, E) \): \( \{D \rightarrow E, EA \rightarrow B, EB \rightarrow C\} \)
\( R2(A, B, C, D) \): \( \{A \rightarrow D, A \rightarrow B, C \rightarrow A\} \)
Which of the following statement(s) is/are TRUE?

- A) \( R1 \) is in 3NF
- B) \( R2 \) is in 3NF
- C) \( R1 \) is NOT in 3NF  ✔ official
- D) \( R2 \) is NOT in 3NF  ✔ official

---

**2025_FN_Q47** · 2025-FN · MSQ · 2 marks · Easy · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

Consider a relational schema team(name, city, owner), with functional dependencies \( \{\text{name} \rightarrow \text{city}, \text{name} \rightarrow \text{owner}\} \).
The relation team is decomposed into two relations, t1(name, city) and t2(name, owner).
Which of the following statement(s) is/are TRUE?

- A) The relation team is NOT in BCNF.
- B) The relations t1 and t2 are in BCNF.  ✔ official
- C) The decomposition constitutes a lossless join.  ✔ official
- D) The relation team is NOT in 3NF.

---

**2025_AN_Q53** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability · HAS A FIGURE (not shown here)

Consider the database transactions T1 and T2, and data items X and Y. Which of the schedule(s) is/are conflict serializable?
[IMAGE_Q_53_1][IMAGE_Q_53_2]

- A) R1(X), W2(X), W1(Y), W2(Y), R1(X), W1(X), COMMIT(T2), COMMIT(T1)
- B) W2(X), R1(X), W2(Y), W1(Y), R1(X), COMMIT(T2), W1(X), COMMIT(T1)  ✔ official
- C) R1(X), W1(Y), W2(X), W2(Y), R1(X), W1(X), COMMIT(T1), COMMIT(T2)
- D) W2(X), R1(X), W1(Y), W2(Y), R1(X), COMMIT(T2), W1(X), COMMIT(T1)

---

**2025_AN_Q54** · 2025-AN · MSQ · 2 marks · Medium · bank topic: SQL Queries (DDL/DML, Joins, Aggregations)

Consider the following relational schema:
Students (rollno: integer, name: string, age: integer, cgpa: real)
Courses (courseno: integer, cname: string, credits: integer)
Enrolled (rollno: integer, courseno: integer, grade: string)
Which of the following options is/are correct SQL query/queries to retrieve the names of the students enrolled in course number (i.e., courseno) 1470?

- A) SELECT S.name FROM Students S WHERE EXISTS (SELECT * FROM Enrolled E WHERE E.courseno = 1470 AND E.rollno = S.rollno);  ✔ official
- B) SELECT S.name FROM Students S WHERE SIZEOF (SELECT * FROM Enrolled E WHERE E.courseno = 1470 AND E.rollno = S.rollno) > 0;
- C) SELECT S.name FROM Students S WHERE 0 < (SELECT COUNT(*) FROM Enrolled E WHERE E.courseno = 1470 AND E.rollno = S.rollno);  ✔ official
- D) SELECT S.name FROM Students S NATURAL JOIN Enrolled E WHERE E.courseno = 1470;  ✔ official

---

**2025_FN_Q55** · 2025-FN · NAT · 2 marks · Medium · bank topic: SQL Queries (DDL/DML, Joins, Aggregations) · HAS A FIGURE (not shown here)

Consider the following database tables of a sports league.
player(pid, pname, age)                team(tid, tname, city, cid)
coach(cid, cname)                      members(pid, tid)
An instance of the table and an SQL query are given.
[IMAGE_Q_55_1]
```sql
SELECT MIN(P.age)
FROM player P
WHERE P.pid IN (
    SELECT M.pid
    FROM team T, coach C, members M
    WHERE C.cname = 'Mark'
        AND T.cid = C.cid
        AND M.tid = T.tid
)
```
The value returned by the given SQL query is ________. (Answer in integer)

Official answer (numeric): 26 to 26

---

**2025_AN_Q57** · 2025-AN · NAT · 2 marks · Hard · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

In a B+ - tree where each node can hold at most four key values, a root to leaf path consists of the following nodes:
A = (49, 77, 83, –), B = (7, 19, 33, 44), C = (20*, 22*, 25*, 26*)
The *-marked keys signify that these are data entries in a leaf.
Assume that a pointer between keys \( k_1 \) and \( k_2 \) points to a subtree containing keys in \( [k_1, k_2) \), and that when a leaf is created, the smallest key in it is copied up into its parent.
A record with key value 23 is inserted into the B+ - tree.
The smallest key value in the parent of the leaf that contains 25* is ________.
(Answer in integer)

Official answer (numeric): 33 to 33

---

**2024_AN_Q13** · 2024-AN · MCQ · 1 mark · Easy · bank topic: Transactions, Concurrency Control, Conflict Serializability

Once the DBMS informs the user that a transaction has been successfully completed, its effect should persist even if the system crashes before all its changes are reflected on disk. This property is called

- A) durability  ✔ official
- B) atomicity
- C) consistency
- D) isolation

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

**2024_FN_Q11** · 2024-FN · MCQ · 1 mark · Easy · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

In a B+ tree, the requirement of at least half-full (50%) node occupancy is relaxed for which one of the following cases?

- A) Only the root node  ✔ official
- B) All leaf nodes
- C) All internal nodes
- D) Only the leftmost leaf node

---

**2024_FN_Q25** · 2024-FN · MSQ · 1 mark · Easy · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

Which of the following statements about a relation R in first normal form (1NF) is/are TRUE?

- A) R can have a multi-attribute key  ✔ official
- B) R cannot have a foreign key
- C) R cannot have a composite attribute  ✔ official
- D) R cannot have more than one candidate key

---

**2024_AN_Q16** · 2024-AN · MSQ · 1 mark · Easy · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

Which of the following file organizations is/are I/O efficient for the scan operation in DBMS?

- A) Sorted  ✔ official
- B) Heap  ✔ official
- C) Unclustered tree index
- D) Unclustered hash index

---

**2024_AN_Q31** · 2024-AN · MSQ · 1 mark · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

Which of the following statements about the Two Phase Locking (2PL) protocol is/are TRUE?

- A) 2PL permits only serializable schedules  ✔ official
- B) With 2PL, a transaction always locks the data item being read or written just before every operation and always releases the lock just after the operation.
- C) With 2PL, once a lock is released on any data item inside a transaction, no more locks on any data item can be obtained inside that transaction.  ✔ official
- D) A deadlock is possible with 2PL.  ✔ official

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

**2024_FN_Q45** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

Consider the following read-write schedule \( S \) over three transactions \( T_1 \), \( T_2 \) and \( T_3 \), where the subscripts in the schedule indicate transaction IDs:
\[ S : r_1(z); \; w_1(z); \; r_2(x); \; r_3(y); \; w_3(y); \; r_2(y); \; w_2(x); \; w_2(y); \]
Which of the following transaction schedules is/are conflict equivalent to \( S \)?

- A) \( T_1 \; T_2 \; T_3 \)
- B) \( T_1 \; T_3 \; T_2 \)  ✔ official
- C) \( T_3 \; T_2 \; T_1 \)  ✔ official
- D) \( T_3 \; T_1 \; T_2 \)  ✔ official

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

**2023_FN_Q61** · 2023-FN · NAT · 2 marks · Easy · bank topic: SQL Queries (DDL/DML, Joins, Aggregations) · HAS A FIGURE (not shown here)

Consider the following table named Student in a relational database. The primary key of this table is rollNum.
[IMAGE_Q_61]
The SQL query below is executed on this database.
```sql
SELECT *
FROM Student
WHERE gender = 'F' AND
      marks > 65;
```
The number of rows returned by the query is ________.

Official answer (numeric): 2 to 2

---

**2023_FN_Q62** · 2023-FN · NAT · 2 marks · Hard · bank topic: File Organization & Indexing (e.g., B and B+ Trees) · HAS A FIGURE (not shown here)

Consider a database of fixed-length records, stored as an ordered file. The database has 25,000 records, with each record being 100 bytes, of which the primary key occupies 15 bytes. The data file is block-aligned in that each data record is fully contained within a block. The database is indexed by a primary index file, which is also stored as a block-aligned ordered file. The figure below depicts this indexing scheme.
[IMAGE_Q_62]
Suppose the block size of the file system is 1024 bytes, and a pointer to a block occupies 5 bytes. The system uses binary search on the index file to search for a record with a given key. You may assume that a binary search on an index file of b blocks takes \(\lceil \log_2 b \rceil\) block accesses in the worst case. Given a key, the number of block accesses required to identify the block in the data file that may contain a record with the key, in the worst case, is________.

Official answer (numeric): 6 to 6

---

**2022_FN_Q14** · 2022-FN · MCQ · 1 mark · Easy · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

In a relational data model, which one of the following statements is TRUE?

- A) A relation with only two attributes is always in BCNF.  ✔ official
- B) If all attributes of a relation are prime attributes, then the relation is in BCNF.
- C) Every relation has at least one non-prime attribute.
- D) BCNF decompositions preserve functional dependencies.

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

**2022_FN_Q39** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

Let \(R_i(z)\) and \(W_i(z)\) denote read and write operations on a data element \(z\) by a transaction \(T_i\), respectively. Consider the schedule \(S\) with four transactions.
$$ S : R_4(x), R_2(x), R_3(x), R_1(y), W_1(y), W_2(x), W_3(y), R_4(y) $$
Which one of the following serial schedules is conflict equivalent to \(S\)?

- A) \(T_1 \to T_3 \to T_4 \to T_2\)  ✔ official
- B) \(T_1 \to T_4 \to T_3 \to T_2\)
- C) \(T_4 \to T_1 \to T_3 \to T_2\)
- D) \(T_3 \to T_1 \to T_4 \to T_2\)

---

**2022_FN_Q56** · 2022-FN · NAT · 2 marks · Medium · bank topic: SQL Queries (DDL/DML, Joins, Aggregations) · HAS A FIGURE (not shown here)

Consider the relational database with the following four schemas and their respective instances.
Student(sNo, sName, dNo)
Dept(dNo, dName)
Course(cNo, cName, dNo)
Register(sNo, cNo)

[IMAGE_Q_56]

SQL Query:
```sql
SELECT * FROM Student AS S WHERE NOT EXIST
    (SELECT cNo FROM Course WHERE dNo = "D01"
     EXCEPT
     SELECT cNo FROM Register WHERE sNo = S.sNo)
```
The number of rows returned by the above SQL query is ___________.

Official answer (numeric): 2 to 2

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

**2021_FN_Q28** · 2021-FN · MSQ · 1 mark · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

Suppose a database system crashes again while recovering from a previous crash. Assume checkpointing is not done by the database either during the transactions or during recovery.
Which of the following statements is/are correct?

- A) The same undo and redo list will be used while recovering again.  ✔ official
- B) The system cannot recover any further.
- C) All the transactions that are already undone and redone will not be recovered again.
- D) The database will become inconsistent.

---

**2021_AN_Q26** · 2021-AN · NAT · 1 mark · Medium · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

A data file consisting of 1,50,000 student-records is stored on a hard disk with block size of 4096 bytes. The data file is sorted on the primary key RollNo. The size of a record pointer for this disk is 7 bytes. Each student-record has a candidate key attributed called ANum of size 12 bytes. Suppose an index file with records consisting of two fields, ANum value and the record pointer to the corresponding student record, is built and stored on the same disk. Assume that the records of data file and index file are not split across disk blocks. The number of blocks in the index file is _________.

Official answer (numeric): 698 to 698

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

**2021_AN_Q45** · 2021-AN · MCQ · 2 marks · Medium · bank topic: SQL Queries (DDL/DML, Joins, Aggregations)

The relation scheme given below is used to store information about the employees of a company, where empId is the key and deptId indicates the department to which the employee is assigned. Each employee is assigned to exactly one department.
emp(\underline{empId}, name, gender, salary, deptId)
Consider the following SQL query:
```sql
select deptId, count(*)
from emp
where gender = "female" and salary > (select avg(salary) from emp)
group by deptId;
```
The above query gives, for each department in the company, the number of female employees whose salary is greater than the average salary of

- A) employees in the department.
- B) employees in the company.  ✔ official
- C) female employees in the department.
- D) female employees in the company.

---

**2021_FN_Q47** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

Let \(r_i(z)\) and \(w_i(z)\) denote read and write operations respectively on a data item \(z\) by a transaction \(T_i\). Consider the following two schedules:
\(S_1 : r_1(x), r_1(y), r_2(x), r_2(y), w_2(y), w_1(x)\)
\(S_2 : r_1(x), r_2(x), r_2(y), w_2(y), r_1(y), w_1(x)\)
Which one of the following options is correct?

- A) \(S_1\) is conflict serializable, and \(S_2\) is not conflict serializable.
- B) \(S_1\) is not conflict serializable, and \(S_2\) is conflict serializable.  ✔ official
- C) Both \(S_1\) and \(S_2\) are conflict serializable.
- D) Neither \(S_1\) nor \(S_2\) is conflict serializable.

---

**2021_AN_Q34** · 2021-AN · MCQ · 2 marks · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

Let \(S\) be the following schedule of operations of three transactions \(T_1\), \(T_2\) and \(T_3\) in a relational database system:
\(R_2(Y), R_1(X), R_3(Z), R_1(Y), W_1(X), R_2(Z), W_2(Y), R_3(X), W_3(Z)\)
Consider the statements \(P\) and \(Q\) below:
\(P\) : \(S\) is conflict-serializable.
\(Q\) : If \(T_3\) commits before \(T_1\) finishes, then \(S\) is recoverable.
Which one of the following choices is correct?

- A) Both \(P\) and \(Q\) are true.
- B) \(P\) is true and \(Q\) is false.  ✔ official
- C) \(P\) is false and \(Q\) is true.
- D) Both \(P\) and \(Q\) are false.

---

**2021_FN_Q40** · 2021-FN · MCQ · 2 marks · Medium · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

Consider the relation \(R(P, Q, S, T, X, Y, Z, W)\) with the following functional dependencies
\(PQ \rightarrow X; P \rightarrow YX; Q \rightarrow Y; Y \rightarrow ZW\)
Consider the decomposition of the relation \(R\) into the constituent relations according to the following two decomposition schemes.
\(D_1 : R = [\{P, Q, S, T\}; \{P, T, X\}; \{Q, Y\}; \{Y, Z, W\}]\)
\(D_2 : R = [\{P, Q, S\}; \{T, X\}; \{Q, Y\}; \{Y, Z, W\}]\)
Which one of the following options is correct?

- A) \(D_1\) is a lossless decomposition, but \(D_2\) is a lossy decomposition.  ✔ official
- B) \(D_1\) is a lossy decomposition, but \(D_2\) is a lossless decomposition.
- C) Both \(D_1\) and \(D_2\) are lossless decompositions.
- D) Both \(D_1\) and \(D_2\) are lossy decompositions.

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

**2020_FN_Q12** · 2020-FN · MCQ · 1 mark · Medium · bank topic: SQL Queries (DDL/DML, Joins, Aggregations) · HAS A FIGURE (not shown here)

Consider a relational database containing the following schemas.
[IMAGE_Q_12]
The primary key of each table is indicated by underlining the constituent fields.
```sql
SELECT s.sno, s.sname
FROM Suppliers s, Catalogue c
WHERE s.sno = c.sno AND
      cost > (SELECT AVG (cost)
              FROM Catalogue
              WHERE pno = 'P4'
              GROUP BY pno);
```
The number of rows returned by the above SQL query is

- A) 4  ✔ official
- B) 5
- C) 0
- D) 2

---

**2020_FN_Q13** · 2020-FN · MCQ · 1 mark · Easy · bank topic: ER-Model

Which one of the following is used to represent the supporting many-one relationships of a weak entity set in an entity-relationship diagram?

- A) Diamonds with double/bold border  ✔ official
- B) Rectangles with double/bold border
- C) Ovals with double/bold border
- D) Ovals that contain underlined identifiers

---

**2020_FN_Q65** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

Consider a relational table R that is in 3NF, but not in BCNF. Which one of the following statements is TRUE?

- A) R has a non-trivial functional dependency X \(\rightarrow\) A, where X is not a superkey and A is a prime attribute.  ✔ official
- B) R has a non-trivial functional dependency X \(\rightarrow\) A, where X is not a superkey and A is a non-prime attribute and X is not a proper subset of any key.
- C) R has a non-trivial functional dependency X \(\rightarrow\) A, where X is not a superkey and A is a non-prime attribute and X is a proper subset of some key.
- D) A cell in R holds a set instead of an atomic value.

---

**2020_FN_Q45** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability · HAS A FIGURE (not shown here)

Consider a schedule of transactions \( T_1 \) and \( T_2 \):
[IMAGE_Q_45]
Here, RX stands for "Read(X)" and WX stands for "Write(X)". Which one of the following schedules is conflict equivalent to the above schedule?

- A) [IMAGE_Q_45_A]  ✔ official
- B) [IMAGE_Q_45_B]
- C) [IMAGE_Q_45_C]
- D) [IMAGE_Q_45_D]

---

**2020_FN_Q51** · 2020-FN · NAT · 2 marks · Hard · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

Consider a database implemented using B+ tree for file indexing and installed on a disk drive with block size of 4 KB. The size of search key is 12 bytes and the size of tree/disk pointer is 8 bytes. Assume that the database has one million records. Also assume that no node of the B+ tree and no records are present initially in main memory. Consider that each record fits into one disk block. The minimum number of disk accesses required to retrieve any record in the database is ________.

Official answer (numeric): 4 to 4

---

**2019_FN_Q27** · 2019-FN · MCQ · 1 mark · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

Consider the following two statements about database transaction schedules:
I. Strict two-phase locking protocol generates conflict serializable schedules that are also recoverable.
II. Timestamp-ordering concurrency control protocol with Thomas’ Write Rule can generate view serializable schedules that are not conflict serializable.
Which of the above statements is/are TRUE?

- A) I only
- B) II only
- C) Both I and II  ✔ official
- D) Neither I nor II

---

**2019_FN_Q20** · 2019-FN · MCQ · 1 mark · Easy · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

Which one of the following statements is NOT correct about the B+ tree data structure used for creating an index of a relational database table?

- A) B+ tree is a height balanced tree
- B) Non-leaf nodes have pointers to data records  ✔ official
- C) Key values in each node are kept in sorted order
- D) Each leaf node has a pointer to the next leaf node

---

**2019_FN_Q37** · 2019-FN · MCQ · 2 marks · Medium · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

Let the set of functional dependencies \( F = \{QR \rightarrow S, R \rightarrow P, S \rightarrow Q\} \) hold on a relation schema \( X = (PQRS) \). \( X \) is not in BCNF. Suppose \( X \) is decomposed into two schemas \( Y \) and \( Z \) where \( Y = (PR) \) and \( Z = (QRS) \).
Consider the two statements given below:
I. Both \( Y \) and \( Z \) are in BCNF
II. Decomposition of \( X \) into \( Y \) and \( Z \) is dependency preserving and lossless
Which of the above statements is/are correct?

- A) Both I and II
- B) I only
- C) II only  ✔ official
- D) Neither I nor II

---

**2019_FN_Q41** · 2019-FN · NAT · 2 marks · Medium · bank topic: SQL Queries (DDL/DML, Joins, Aggregations) · HAS A FIGURE (not shown here)

A relational database contains two tables Student and Performance as shown below:
[IMAGE_Q_41]
The primary key of the Student table is Roll_no. For the Performance table, the columns Roll_no. and Subject_code together form the primary key. Consider the SQL query given below:
```sql
SELECT S.Student_name, sum(P.Marks)
FROM Student S, Performance P
WHERE P.Marks > 84
GROUP BY S.Student_name;
```
The number of rows returned by the above SQL query is ________.

Official answer (numeric): 5 to 5

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

**2018_FN_Q22** · 2018-FN · MCQ · 1 mark · Easy · bank topic: SQL Queries (DDL/DML, Joins, Aggregations)

Consider the following two tables and four queries in SQL.
Book (isbn, bname), Stock (isbn, copies)
Query 1: SELECT B.isbn, S.copies
 FROM Book B INNER JOIN Stock S
 ON B.isbn = S.isbn;
Query 2: SELECT B.isbn, S.copies
 FROM Book B LEFT OUTER JOIN Stock S
 ON B.isbn = S.isbn;
Query 3: SELECT B.isbn, S.copies
 FROM Book B RIGHT OUTER JOIN Stock S
 ON B.isbn = S.isbn;
Query 4: SELECT B.isbn, S.copies
 FROM Book B FULL OUTER JOIN Stock S
 ON B.isbn = S.isbn;
Which one of the queries above is certain to have an output that is a superset of the outputs of the other three queries?

- A) Query 1
- B) Query 2
- C) Query 3
- D) Query 4  ✔ official

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

**2018_FN_Q52** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

Consider the following four relational schemas. For each schema, all non-trivial functional dependencies are listed. The underlined attributes are the respective primary keys.
Schema I: Registration (rollno, courses)
Field ‘courses’ is a set-valued attribute containing the set of courses a student has registered for.
Non-trivial functional dependency:
rollno \(\rightarrow\) courses

Schema II: Registration (rollno, courseid, email)
Non-trivial functional dependencies:
rollno, courseid \(\rightarrow\) email
email \(\rightarrow\) rollno

Schema III: Registration (rollno, courseid, marks, grade)
Non-trivial functional dependencies:
rollno, courseid \(\rightarrow\) marks, grade
marks \(\rightarrow\) grade

Schema IV: Registration (rollno, courseid, credit)
Non-trivial functional dependencies:
rollno, courseid \(\rightarrow\) credit
courseid \(\rightarrow\) credit

Which one of the relational schemas above is in 3NF but not in BCNF?

- A) Schema I
- B) Schema II  ✔ official
- C) Schema III
- D) Schema IV

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

**2017_FN_Q31** · 2017-FN · NAT · 1 mark · Medium · bank topic: SQL Queries (DDL/DML, Joins, Aggregations) · HAS A FIGURE (not shown here)

Consider a database that has the relation schema EMP (EmpId, EmpName, and DeptName). An instance of the schema EMP and a SQL query on it are given below:

EMP
[IMAGE_Q_31]

```sql
SELECT AVG(EC.Num)
FROM EC
WHERE (DeptName, Num) IN
    (SELECT DeptName, COUNT(EmpId) AS
                EC( DeptName, Num)
    FROM EMP
    GROUP BY DeptName)
```
The output of executing the SQL query is

Official answer (numeric): 2.6 to 2.6

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

**2017_FN_Q51** · 2017-FN · MCQ · 2 marks · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

In a database system, unique timestamps are assigned to each transaction using Lamport's logical clock. Let \(TS(T_1)\) and \(TS(T_2)\) be the timestamps of transactions \(T_1\) and \(T_2\) respectively. Besides, \(T_1\) holds a lock on the resource \(R\), and \(T_2\) has requested a conflicting lock on the same resource \(R\). The following algorithm is used to prevent deadlocks in the database system assuming that a killed transaction is restarted with the same timestamp.
```
if TS(T_2) < TS(T_1) then
    T_1 is killed
else T_2 waits
```
Assume any transaction that is not killed terminates eventually. Which of the following is TRUE about the database system that uses the above algorithm to prevent deadlocks?

- A) The database system is both deadlock-free and starvation-free.  ✔ official
- B) The database system is deadlock-free, but not starvation-free.
- C) The database system is starvation-free, but not deadlock-free.
- D) The database system is neither deadlock-free nor starvation-free.

---

**2017_AN_Q62** · 2017-AN · NAT · 2 marks · Hard · bank topic: Transactions, Concurrency Control, Conflict Serializability

Two transactions \(T_1\) and \(T_2\) are given as
\(T_1: r_1(X) \ w_1(X) \ r_1(Y) \ w_1(Y)\)
\(T_2: r_2(Y) \ w_2(Y) \ r_2(Z) \ w_2(Z)\)
where \(r_i(V)\) denotes a read operation by transaction \(T_i\) on a variable V and \(w_i(V)\) denotes a write operation by transaction \(T_i\) on a variable V. The total number of conflict serializable schedules that can be formed by \(T_1\) and \(T_2\) is ________.

Official answer (numeric): 54.0 to 54.0

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

---

**2017_AN_Q55** · 2017-AN · NAT · 2 marks · Medium · bank topic: SQL Queries (DDL/DML, Joins, Aggregations) · HAS A FIGURE (not shown here)

Consider the following database table named \textit{top\_scorer}.
[IMAGE_Q_55]
Consider the following SQL query:
```sql
SELECT ta.player FROM top_scorer as ta
WHERE ta.goals > ALL (SELECT tb.goals
                      FROM top_scorer as tb
                      WHERE tb.country = 'Spain')
AND ta.goals > ANY (SELECT tc.goals
                    FROM top_scorer as tc
                    WHERE tc.country = 'Germany')
```
The number of tuples returned by the above SQL query is ________.

Official answer (numeric): 7.0 to 7.0

---

**2017_AN_Q54** · 2017-AN · NAT · 2 marks · Medium · bank topic: File Organization & Indexing (e.g., B and B+ Trees)

In a B\(^+\) tree, if the search-key value is 8 bytes long, the block size is 512 bytes and the block pointer size is 2 bytes, then the maximum order of the B\(^+\) tree is________.

Official answer (numeric): 52.0 to 52.0

