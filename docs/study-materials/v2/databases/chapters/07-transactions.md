# Review input: Databases, chapter 07: Transactions

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-07-transactions.md` and `gemini-07-transactions.md` in this folder.

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

This is **one chapter** (7 of 8) of the Databases book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Transactions**. Written lessons today: 3 topics ready.



## The PYQs for this chapter (15)

**2026_AN_Q20** · 2026-AN · MCQ · 1 mark · Easy · bank topic: Transactions, Concurrency Control, Conflict Serializability

Consider concurrent execution of two transactions \( T1 \) and \( T2 \) in a DBMS, both of which access a data object \( A \). For these two transactions to not conflict on \( A \), which one of the following statements must be true?

- A) Both \( T1 \) and \( T2 \) only read \( A \)  ✔ official
- B) \( T1 \) reads \( A \) and \( T2 \) writes \( A \)
- C) \( T1 \) writes \( A \) and \( T2 \) reads \( A \)
- D) Both \( T1 \) and \( T2 \) write \( A \)

---

**2025_FN_Q15** · 2025-FN · MCQ · 1 mark · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

A schedule of three database transactions \( T_1 \), \( T_2 \), and \( T_3 \) is shown. \( R_i(A) \) and \( W_i(A) \) denote read and write of data item \( A \) by transaction \( T_i \), \( i = 1, 2, 3 \). The transaction \( T_1 \) aborts at the end. Which other transaction(s) will be required to be rolled back?
\( R_1(X) \; W_1(Y) \; R_2(X) \; R_2(Y) \; R_3(Y) \; ABORT(T_1) \)

- A) Only \( T_2 \)
- B) Only \( T_3 \)
- C) Both \( T_2 \) and \( T_3 \)  ✔ official
- D) Neither \( T_2 \) nor \( T_3 \)

---

**2025_AN_Q27** · 2025-AN · MSQ · 1 mark · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

An audit of a banking transactions system has found that on an earlier occasion, two joint holders of account \( A \) attempted simultaneous transfers of Rs. 10000 each from account \( A \) to account \( B \). Both transactions read the same value, Rs. 11000, as the initial balance in \( A \) and were allowed to go through. \( B \) was credited Rs. 10000 twice. \( A \) was debited only once and ended up with a balance of Rs. 1000.
Which of the following properties is/are certain to have been violated by the system?

- A) Atomicity
- B) Consistency  ✔ official
- C) Isolation  ✔ official
- D) Durability

---

**2025_AN_Q53** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability · HAS A FIGURE (not shown here)

Consider the database transactions T1 and T2, and data items X and Y. Which of the schedule(s) is/are conflict serializable?
[IMAGE_Q_53_1][IMAGE_Q_53_2]

- A) R1(X), W2(X), W1(Y), W2(Y), R1(X), W1(X), COMMIT(T2), COMMIT(T1)
- B) W2(X), R1(X), W2(Y), W1(Y), R1(X), COMMIT(T2), W1(X), COMMIT(T1)  ✔ official
- C) R1(X), W1(Y), W2(X), W2(Y), R1(X), W1(X), COMMIT(T1), COMMIT(T2)
- D) W2(X), R1(X), W1(Y), W2(Y), R1(X), COMMIT(T2), W1(X), COMMIT(T1)

---

**2024_AN_Q13** · 2024-AN · MCQ · 1 mark · Easy · bank topic: Transactions, Concurrency Control, Conflict Serializability

Once the DBMS informs the user that a transaction has been successfully completed, its effect should persist even if the system crashes before all its changes are reflected on disk. This property is called

- A) durability  ✔ official
- B) atomicity
- C) consistency
- D) isolation

---

**2024_AN_Q31** · 2024-AN · MSQ · 1 mark · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

Which of the following statements about the Two Phase Locking (2PL) protocol is/are TRUE?

- A) 2PL permits only serializable schedules  ✔ official
- B) With 2PL, a transaction always locks the data item being read or written just before every operation and always releases the lock just after the operation.
- C) With 2PL, once a lock is released on any data item inside a transaction, no more locks on any data item can be obtained inside that transaction.  ✔ official
- D) A deadlock is possible with 2PL.  ✔ official

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

**2022_FN_Q39** · 2022-FN · MCQ · 2 marks · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

Let \(R_i(z)\) and \(W_i(z)\) denote read and write operations on a data element \(z\) by a transaction \(T_i\), respectively. Consider the schedule \(S\) with four transactions.
$$ S : R_4(x), R_2(x), R_3(x), R_1(y), W_1(y), W_2(x), W_3(y), R_4(y) $$
Which one of the following serial schedules is conflict equivalent to \(S\)?

- A) \(T_1 \to T_3 \to T_4 \to T_2\)  ✔ official
- B) \(T_1 \to T_4 \to T_3 \to T_2\)
- C) \(T_4 \to T_1 \to T_3 \to T_2\)
- D) \(T_3 \to T_1 \to T_4 \to T_2\)

---

**2021_FN_Q28** · 2021-FN · MSQ · 1 mark · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability

Suppose a database system crashes again while recovering from a previous crash. Assume checkpointing is not done by the database either during the transactions or during recovery.
Which of the following statements is/are correct?

- A) The same undo and redo list will be used while recovering again.  ✔ official
- B) The system cannot recover any further.
- C) All the transactions that are already undone and redone will not be recovered again.
- D) The database will become inconsistent.

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

**2020_FN_Q45** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Transactions, Concurrency Control, Conflict Serializability · HAS A FIGURE (not shown here)

Consider a schedule of transactions \( T_1 \) and \( T_2 \):
[IMAGE_Q_45]
Here, RX stands for "Read(X)" and WX stands for "Write(X)". Which one of the following schedules is conflict equivalent to the above schedule?

- A) [IMAGE_Q_45_A]  ✔ official
- B) [IMAGE_Q_45_B]
- C) [IMAGE_Q_45_C]
- D) [IMAGE_Q_45_D]

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

