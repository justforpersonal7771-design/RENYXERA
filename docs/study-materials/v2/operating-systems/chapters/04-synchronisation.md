# Review input: Operating Systems, chapter 04: Synchronisation

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-04-synchronisation.md` and `gemini-04-synchronisation.md` in this folder.

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

This is **one chapter** (4 of 7) of the Operating Systems book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Synchronisation**. Written lessons today: 7 topics ready.



## The PYQs for this chapter (11)

**2026_AN_Q51** · 2026-AN · MSQ · 2 marks · Hard · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider three processes P1, P2, and P3 running identical code, as shown in the pseudocode below. A and B are two binary semaphores initialized to 1 and 0, respectively. X is a shared variable initialized to 0. Each line in the pseudocode is executed atomically.
Pseudocode of P1, P2, and P3
```
Wait(A);
Print(*);
X = X+1;
If (X == 2)
{
    Print($);
    Signal(B);
}
Signal(A);
Wait(B);
Print(#);
Signal(B);
```
Assume that any of the three processes can start to execute first and context switching can happen between these processes at any arbitrary time and in any arbitrary order.
Which of the following patterns is/are possible to be generated as an outcome of the execution of these three processes?

- A) **$*###  ✔ official
- B) **$#*##  ✔ official
- C) **$*##*#  ✔ official
- D) ***$###

---

**2024_FN_Q64** · 2024-FN · MCQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the following two threads T1 and T2 that update two shared variables \( a \) and \( b \). Assume that initially \( a = b = 1 \). Though context switching between threads can happen at any time, each statement of T1 or T2 is executed atomically without interruption.
**T1**
\( a = a + 1; \)
\( b = b + 1; \)
**T2**
\( b = 2 * b; \)
\( a = 2 + a; \)
Which one of the following options lists all the possible combinations of values of \( a \) and \( b \) after both T1 and T2 finish execution?

- A) \( (a = 4, b = 4); (a = 3, b = 3); (a = 4, b = 3) \)  ✔ official
- B) \( (a = 3, b = 4); (a = 4, b = 3); (a = 3, b = 3) \)
- C) \( (a = 4, b = 4); (a = 4, b = 3); (a = 3, b = 4) \)
- D) \( (a = 2, b = 2); (a = 2, b = 3); (a = 3, b = 4) \)

---

**2024_AN_Q44** · 2024-AN · MSQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider a multi-threaded program with two threads T1 and T2. The threads share two semaphores: s1 (initialized to 1) and s2 (initialized to 0). The threads also share a global variable \( x \) (initialized to 0). The threads execute the code shown below.
```c
// code of T1
wait (s1);
x = x + 1;
print(x);
wait(s2);
signal(s1);

// code of T2
wait (s1);
x = x + 1;
print(x);
signal(s2);
signal(s1);
```
Which of the following outcomes is/are possible when threads T1 and T2 execute concurrently?

- A) T1 runs first and prints 1, T2 runs next and prints 2
- B) T2 runs first and prints 1, T1 runs next and prints 2  ✔ official
- C) T1 runs first and prints 1, T2 does not print anything (deadlock)  ✔ official
- D) T2 runs first and prints 1, T1 does not print anything (deadlock)

---

**2023_FN_Q38** · 2023-FN · MCQ · 2 marks · Hard · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the two functions incr and decr shown below:
```c
incr( ) {
    wait(s);
    X = X + 1;
    signal(s);
}
decr( ) {
    wait(s);
    X = X - 1;
    signal(s);
}
```
There are 5 threads each invoking incr once, and 3 threads each invoking decr once, on the same shared variable X. The initial value of X is 10.
Suppose there are two implementations of the semaphore s, as follows:
I-1: s is a binary semaphore initialized to 1.
I-2: s is a counting semaphore initialized to 2.
Let V1, V2 be the values of X at the end of execution of all the threads with implementations I-1, I-2, respectively.
Which one of the following choices corresponds to the minimum possible values of V1, V2, respectively?

- A) 15, 7
- B) 7, 7
- C) 12, 7  ✔ official
- D) 12, 8

---

**2022_FN_Q19** · 2022-FN · MCQ · 1 mark · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the following threads, \(T_1\), \(T_2\) and \(T_3\) executing on a single processor, synchronized using three binary semaphore variables, \(S_1\), \(S_2\) and \(S_3\), operated upon using standard wait( ) and signal( ). The threads can be context switched in any order and at any time.

```c
// T1
while (true) {
  wait (S_3);
  print ("C");
  signal (S_2);
}

// T2
while (true) {
  wait (S_1);
  print ("B");
  signal (S_3);
}

// T3
while (true) {
  wait (S_2);
  print ("A");
  signal (S_1);
}
```
Which initialization of the semaphores would print the sequence BCABCABCA.....?

- A) \(S_1 = 1; S_2 = 1; S_3 = 1\)
- B) \(S_1 = 1; S_2 = 1; S_3 = 0\)
- C) \(S_1 = 1; S_2 = 0; S_3 = 0\)  ✔ official
- D) \(S_1 = 0; S_2 = 1; S_3 = 1\)

---

**2021_AN_Q41** · 2021-AN · MSQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the following multi-threaded code segment (in a mix of C and pseudo-code), invoked by two processes \(P_1\) and \(P_2\), and each of the processes spawns two threads \(T_1\) and \(T_2\):
```c
int x = 0;    // global
Lock L1;      // global
main( ) {
    create a thread to execute foo( ); // Thread T1
    create a thread to execute foo( ); // Thread T2
    wait for the two threads to finish execution;
    print (x);
}
foo( ) {
    int y = 0;
    Acquire L1;
    x = x + 1;
    y = y + 1;
    Release L1;
    print (y);
}
```
Which of the following statement(s) is/are correct?

- A) Both \(P_1\) and \(P_2\) will print the value of \(x\) as 2.  ✔ official
- B) At least one of \(P_1\) and \(P_2\) will print the value of \(x\) as 4.
- C) At least one of the threads will print the value of \(y\) as 2.
- D) Both \(T_1\) and \(T_2\), in both the processes, will print the value of \(y\) as 1.  ✔ official

---

**2021_FN_Q59** · 2021-FN · MSQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the following pseudocode, where S is a semaphore initialized to 5 in line#2 and counter is a shared variable initialized to 0 in line#1. Assume that the increment operation in line#7 is not atomic.
```c
1. int counter = 0;
2. Semaphore S = init(5);
3. void parop(void)
4. {
5.     wait(S);
6.     wait(S);
7.     counter++;
8.     signal(S);
9.     signal(S);
10. }
```
If five threads execute the function parop concurrently, which of the following program behavior(s) is/are possible?

- A) The value of counter is 5 after all the threads successfully complete the execution of parop.  ✔ official
- B) The value of counter is 1 after all the threads successfully complete the execution of parop.  ✔ official
- C) The value of counter is 0 after all the threads successfully complete the execution of parop.
- D) There is a deadlock involving all the threads.  ✔ official

---

**2020_FN_Q38** · 2020-FN · MCQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Each of a set of \( n \) processes executes the following code using two semaphores \( a \) and \( b \) initialized to 1 and 0, respectively. Assume that count is a shared variable initialized to 0 and not used in CODE SECTION P.
```c
/* CODE SECTION P */
wait(a); count=count+1;
if (count==n) signal(b);
signal(a); wait(b); signal(b);
/* CODE SECTION Q */
```
What does the code achieve?

- A) It ensures that no process executes CODE SECTION Q before every process has finished CODE SECTION P.  ✔ official
- B) It ensures that at most two processes are in CODE SECTION Q at any time.
- C) It ensures that all processes execute CODE SECTION P mutually exclusively.
- D) It ensures that at most \( n - 1 \) processes are in CODE SECTION P at any time.

---

**2019_FN_Q32** · 2019-FN · NAT · 1 mark · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks) · HAS A FIGURE (not shown here)

Consider three concurrent processes P1, P2 and P3 as shown below, which access a shared variable D that has been initialized to 100.
[IMAGE_Q_32]
The processes are executed on a uniprocessor system running a time-shared operating system. If the minimum and maximum possible values of D after the three processes have completed executed are X and Y respectively, then the value of Y – X is ________.

Official answer (numeric): 80 to 80

---

**2018_FN_Q50** · 2018-FN · MCQ · 2 marks · Medium · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

Consider the following solution to the producer-consumer synchronization problem. The shared buffer size is \(N\). Three semaphores empty, full and mutex are defined with respective initial values of 0, \(N\) and 1. Semaphore empty denotes the number of available slots in the buffer, for the consumer to read from. Semaphore full denotes the number of available slots in the buffer, for the producer to write to. The placeholder variables, denoted by P, Q, R, and S, in the code below can be assigned either empty or full. The valid semaphore operations are: wait() and signal().
Producer:
```c
do{
    wait(P);
    wait(mutex);
    //Add item to buffer
    signal(mutex);
    signal(Q);
}while(1);
```
Consumer:
```c
do{
    wait(R);
    wait(mutex);
    //Consume item from buffer
    signal(mutex);
    signal(S);
}while(1);
```
Which one of the following assignments to P, Q, R and S will yield the correct solution?

- A) P: full, Q: full, R: empty, S: empty
- B) P: empty, Q: empty, R: full, S: full
- C) P: full, Q: empty, R: empty, S: full  ✔ official
- D) P: empty, Q: full, R: full, S: empty

---

**2017_FN_Q61** · 2017-FN · MCQ · 2 marks · Easy · bank topic: Concurrency & Synchronization (Semaphores, Mutex, Monitors, Locks)

A multithreaded program P executes with \(x\) number of threads and uses \(y\) number of locks for ensuring mutual exclusion while operating on shared memory locations. All locks in the program are non-reentrant, i.e., if a thread holds a lock \(l\), then it cannot re-acquire lock \(l\) without releasing it. If a thread is unable to acquire a lock, it blocks until the lock becomes available. The minimum value of \(x\) and the minimum value of \(y\) together for which execution of P can result in a deadlock are:

- A) \(x = 1\), \(y = 2\)
- B) \(x = 2\), \(y = 1\)
- C) \(x = 2\), \(y = 2\)
- D) \(x = 1\), \(y = 1\)  ✔ official

