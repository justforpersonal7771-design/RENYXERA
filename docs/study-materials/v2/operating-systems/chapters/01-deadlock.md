# Review input: Operating Systems, chapter 01: Deadlock

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-01-deadlock.md` and `gemini-01-deadlock.md` in this folder.

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

This is **one chapter** (1 of 7) of the Operating Systems book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Deadlock**. Written lessons today: 6 topics ready, free.



## The PYQs for this chapter (9)

**2026_FN_Q29** · 2026-FN · MSQ · 1 mark · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

With respect to deadlocks in an operating system, which of the following statements is/are FALSE?

- A) Banker's algorithm is used to prevent deadlocks  ✔ official
- B) Deadlock formation can be prevented by ensuring that the hold and wait condition is not allowed
- C) An assignment edge in a resource allocation graph is marked from a process to a resource  ✔ official
- D) A safe state guarantees that all processes can finish without formation of a deadlock

---

**2026_FN_Q35** · 2026-FN · NAT · 1 mark · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

Consider a system consisting of \( k \) instances of a resource \( R \), being shared by 5 processes. Assume that each process requires a maximum of two instances of resource \( R \) and a process can request or release only one instance at a time. Further, a process can request the second instance of the resource only after acquiring the first instance.
The minimum value of \( K \) for the system to be deadlock-free is ________. (answer in integer)

Official answer (numeric): 6 to 6

---

**2025_AN_Q48** · 2025-AN · MSQ · 2 marks · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

\( P = \{P_1, P_2, P_3, P_4\} \) consists of all active processes in an operating system. \( R = \{R_1, R_2, R_3, R_4\} \) consists of single instances of distinct types of resources in the system.
The resource allocation graph has the following assignment and claim edges.
Assignment edges: \( R_1 \rightarrow P_1, R_2 \rightarrow P_2, R_3 \rightarrow P_3, R_4 \rightarrow P_4 \) (the assignment edge \( R_1 \rightarrow P_1 \) means resource \( R_1 \) is assigned to process \( P_1 \), and so on for others)
Claim edges: \( P_1 \rightarrow R_2, P_2 \rightarrow R_3, P_3 \rightarrow R_1, P_2 \rightarrow R_4, P_4 \rightarrow R_2 \) (the claim edge \( P_1 \rightarrow R_2 \) means process \( P_1 \) is waiting for resource \( R_2 \), and so on for others)
Which of the following statement(s) is/are CORRECT?

- A) Aborting \( P_1 \) makes the system deadlock free.
- B) Aborting \( P_3 \) makes the system deadlock free.
- C) Aborting \( P_2 \) makes the system deadlock free.  ✔ official
- D) Aborting \( P_1 \) and \( P_4 \) makes the system deadlock free.  ✔ official

---

**2022_FN_Q26** · 2022-FN · MSQ · 1 mark · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

Which of the following statements is/are TRUE with respect to deadlocks?

- A) Circular wait is a necessary condition for the formation of deadlock.  ✔ official
- B) In a system where each resource has more than one instance, a cycle in its wait-for graph indicates the presence of a deadlock.
- C) If the current allocation of resources to processes leads the system to unsafe state, then deadlock will necessarily occur.
- D) In the resource-allocation graph of a system, if every edge is an assignment edge, then the system is not in deadlock state.  ✔ official

---

**2021_AN_Q13** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

Consider a computer system with multiple shared resource types, with one instance per resource type. Each instance can be owned by only one process at a time. Owning and freeing of resources are done by holding a global lock (L). The following scheme is used to own a resource instance:
```
function OwnResource (Resource R)
    Acquire lock L // a global lock
    if R is available then
        Acquire R
        Release lock L
    else
        if R is owned by another process P then
            Terminate P, after releasing all resources owned by P
            Acquire R
            Restart P
            Release lock L
        end if
    end if
end function
```
Which of the following choice(s) about the above scheme is/are correct?

- A) The scheme ensures that deadlocks will not occur.  ✔ official
- B) The scheme may lead to live-lock.  ✔ official
- C) The scheme may lead to starvation.  ✔ official
- D) The scheme violates the mutual exclusion property.

---

**2019_FN_Q43** · 2019-FN · MCQ · 2 marks · Hard · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

Consider the following snapshot of a system running \( n \) concurrent processes. Process \( i \) is holding \( X_i \) instances of a resource R, \( 1 \le i \le n \). Assume that all instances of R are currently in use. Further, for all \( i \), process \( i \) can place a request for at most \( Y_i \) additional instances of R while holding the \( X_i \) instances it already has. Of the \( n \) processes, there are exactly two processes \( p \) and \( q \) such that \( Y_p = Y_q = 0 \). Which one of the following conditions guarantees that no other process apart from \( p \) and \( q \) can complete execution?

- A) \( X_p + X_q < \min \{Y_k \mid 1 \le k \le n, k \neq p, k \neq q\} \)  ✔ official
- B) \( X_p + X_q < \max \{Y_k \mid 1 \le k \le n, k \neq p, k \neq q\} \)
- C) \( \min (X_p, X_q) \ge \min \{Y_k \mid 1 \le k \le n, k \neq p, k \neq q\} \)
- D) \( \min (X_p, X_q) \le \max \{Y_k \mid 1 \le k \le n, k \neq p, k \neq q\} \)

---

**2018_FN_Q34** · 2018-FN · NAT · 1 mark · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

Consider a system with 3 processes that share 4 instances of the same resource type. Each process can request a maximum of \(K\) instances. Resource instances can be requested and released only one at a time. The largest value of \(K\) that will always avoid deadlock is ____.

Official answer (numeric): 2 to 2

---

**2018_FN_Q49** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery

In a system, there are three types of resources: \(E, F\) and \(G\). Four processes \(P_0, P_1, P_2\) and \(P_3\) execute concurrently. At the outset, the processes have declared their maximum resource requirements using a matrix named Max as given below. For example, Max[\(P_2,F\)] is the maximum number of instances of \(F\) that \(P_2\) would require. The number of instances of the resources allocated to the various processes at any given state is given by a matrix named Allocation.
Consider a state of the system with the Allocation matrix as shown below, and in which 3 instances of \(E\) and 3 instances of \(F\) are the only resources available.

Allocation
E F G
\(P_0\) 1 0 1
\(P_1\) 1 1 2
\(P_2\) 1 0 3
\(P_3\) 2 0 0

Max
E F G
\(P_0\) 4 3 1
\(P_1\) 2 1 4
\(P_2\) 1 3 3
\(P_3\) 5 4 1

From the perspective of deadlock avoidance, which one of the following is true?

- A) The system is in safe state.  ✔ official
- B) The system is not in safe state, but would be safe if one more instance of E were available
- C) The system is not in safe state, but would be safe if one more instance of F were available
- D) The system is not in safe state, but would be safe if one more instance of G were available

---

**2017_AN_Q42** · 2017-AN · MCQ · 2 marks · Medium · bank topic: Deadlock Prevention, Avoidance, Detection, Recovery · HAS A FIGURE (not shown here)

A system shares 9 tape drives. The current allocation and maximum requirement of tape drives for three processes are shown below:
[IMAGE_Q_42]
Which of the following best describes current state of the system?

- A) Safe, Deadlocked
- B) Safe, Not Deadlocked  ✔ official
- C) Not Safe, Deadlocked
- D) Not Safe, Not Deadlocked

