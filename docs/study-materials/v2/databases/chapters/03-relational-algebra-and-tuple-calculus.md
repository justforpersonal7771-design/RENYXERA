# Review input: Databases, chapter 03: Relational algebra and tuple calculus

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-03-relational-algebra-and-tuple-calculus.md` and `gemini-03-relational-algebra-and-tuple-calculus.md` in this folder.

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

This is **one chapter** (3 of 8) of the Databases book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Relational algebra and tuple calculus**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (13)

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

**2026_FN_Q43** · 2026-FN · MCQ · 2 marks · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus

Consider a relational database schema with two relations \( R(P, Q) \) and \( S(X, Y) \). Let \( E = \{\langle u \rangle \mid \exists v \exists w (\langle u, v \rangle \in R \land \langle v, w \rangle \in S)\} \) be a tuple relational calculus expression. Which one of the following relational algebraic expressions is equivalent to \( E \)?

- A) \( \Pi_P(R \bowtie_{P=S.X} S) \)
- B) \( \Pi_P(S \bowtie_{S.X=R.Q} R) \)  ✔ official
- C) \( \Pi_P(R \bowtie_{R.P=S.Y} S) \)
- D) \( \Pi_P(S \bowtie_{S.Y=R.Q} R) \)

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

**2024_FN_Q35** · 2024-FN · NAT · 1 mark · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus · HAS A FIGURE (not shown here)

Consider the following two relations, \( R(A, B) \) and \( S(A, C) \):
[IMAGE_Q_35_1][IMAGE_Q_35_2]
The total number of tuples obtained by evaluating the following expression
\[ \sigma_{B < C}(R \bowtie_{R.A = S.A} S) \]
is ________.

Official answer (numeric): 2 to 2

---

**2024_AN_Q59** · 2024-AN · MCQ · 2 marks · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus

The relation schema, Person (pid, city), describes the city of residence for every person uniquely identified by pid. The following relational algebra operators are available: selection, projection, cross product, and rename.
To find the list of cities where at least 3 persons reside, using the above operators, the minimum number of cross product operations that must be used is

- A) 1
- B) 2  ✔ official
- C) 3
- D) 4

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

**2019_FN_Q47** · 2019-FN · NAT · 2 marks · Medium · bank topic: Relational Models, Relational Algebra, Tuple Calculus · HAS A FIGURE (not shown here)

Consider the following relations P(X, Y, Z), Q(X, Y, T) and R(Y, V).
[IMAGE_Q_47]
How many tuples will be returned by the following relational algebra query?
\( \Pi_x (\sigma_{(P.Y = R.Y \land R.V = V2)} (P \times R)) - \Pi_x (\sigma_{(Q.Y = R.Y \land Q.T > 2)} (Q \times R)) \)

Official answer (numeric): 1 to 1

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

