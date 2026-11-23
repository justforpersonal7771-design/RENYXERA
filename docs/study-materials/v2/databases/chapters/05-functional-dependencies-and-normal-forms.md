# Review input: Databases, chapter 05: Functional dependencies and normal forms

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-05-functional-dependencies-and-normal-forms.md` and `gemini-05-functional-dependencies-and-normal-forms.md` in this folder.

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

This is **one chapter** (5 of 8) of the Databases book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Functional dependencies and normal forms**. Written lessons today: 4 topics ready.



## The PYQs for this chapter (19)

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

**2026_FN_Q65** · 2026-FN · NAT · 2 marks · Medium · bank topic: Integrity Constraints & Functional Dependencies

Consider a relational database schema with a relation \( R(A, B, C, D) \). If \( \{A, B\} \) and \( \{A, C\} \) are the only two candidate keys of the relation \( R \), then the number of superkeys of relation \( R \) is ________. (answer in integer)

Official answer (numeric): 6 to 6

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

**2024_FN_Q25** · 2024-FN · MSQ · 1 mark · Easy · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

Which of the following statements about a relation R in first normal form (1NF) is/are TRUE?

- A) R can have a multi-attribute key  ✔ official
- B) R cannot have a foreign key
- C) R cannot have a composite attribute  ✔ official
- D) R cannot have more than one candidate key

---

**2024_FN_Q44** · 2024-FN · MSQ · 2 marks · Medium · bank topic: Integrity Constraints & Functional Dependencies

The symbol \( \rightarrow \) indicates functional dependency in the context of a relational database. Which of the following options is/are TRUE?

- A) \( (X, Y) \rightarrow (Z, W) \text{ implies } X \rightarrow (Z, W) \)
- B) \( (X, Y) \rightarrow (Z, W) \text{ implies } (X, Y) \rightarrow Z \)  ✔ official
- C) \( ((X, Y) \rightarrow Z \text{ and } W \rightarrow Y) \text{ implies } (X, W) \rightarrow Z \)  ✔ official
- D) \( (X \rightarrow Y \text{ and } Y \rightarrow Z) \text{ implies } X \rightarrow Z \)  ✔ official

---

**2024_AN_Q39** · 2024-AN · NAT · 2 marks · Hard · bank topic: Integrity Constraints & Functional Dependencies

A functional dependency \( F : X \rightarrow Y \) is termed as a useful functional dependency if and only if it satisfies all the following three conditions:
• \( X \) is not the empty set.
• \( Y \) is not the empty set.
• Intersection of \( X \) and \( Y \) is the empty set.
For a relation \( R \) with 4 attributes, the total number of possible useful functional dependencies is ________.

Official answer (numeric): 50 to 50

---

**2022_FN_Q14** · 2022-FN · MCQ · 1 mark · Easy · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

In a relational data model, which one of the following statements is TRUE?

- A) A relation with only two attributes is always in BCNF.  ✔ official
- B) If all attributes of a relation are prime attributes, then the relation is in BCNF.
- C) Every relation has at least one non-prime attribute.
- D) BCNF decompositions preserve functional dependencies.

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

**2020_FN_Q65** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Normalization Schemes (1NF, 2NF, 3NF, BCNF Boundaries)

Consider a relational table R that is in 3NF, but not in BCNF. Which one of the following statements is TRUE?

- A) R has a non-trivial functional dependency X \(\rightarrow\) A, where X is not a superkey and A is a prime attribute.  ✔ official
- B) R has a non-trivial functional dependency X \(\rightarrow\) A, where X is not a superkey and A is a non-prime attribute and X is not a proper subset of any key.
- C) R has a non-trivial functional dependency X \(\rightarrow\) A, where X is not a superkey and A is a non-prime attribute and X is a proper subset of some key.
- D) A cell in R holds a set instead of an atomic value.

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

**2017_AN_Q26** · 2017-AN · NAT · 1 mark · Medium · bank topic: Integrity Constraints & Functional Dependencies · HAS A FIGURE (not shown here)

Consider the following tables \(T_1\) and \(T_2\).
[IMAGE_Q_26]
In table \(T_1\), \(P\) is the primary key and \(Q\) is the foreign key referencing \(R\) in table \(T_2\) with on-delete cascade and on-update cascade. In table \(T_2\), \(R\) is the primary key and \(S\) is the foreign key referencing \(P\) in table \(T_1\) with on-delete set NULL and on-update cascade. In order to delete record (3,8) from table \(T_1\), the number of additional records that need to be deleted from table \(T_1\) is ________.

Official answer (numeric): 0.0 to 0.0

