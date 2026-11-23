# Review input: Operating Systems, chapter 02: Processes and threads

**How to use:** paste everything under the line into ChatGPT, then again into Gemini (new chats). Save the replies as `chatgpt-02-processes-and-threads.md` and `gemini-02-processes-and-threads.md` in this folder.

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

This is **one chapter** (2 of 7) of the Operating Systems book. Review it **in depth**, as the back-bencher student, and give a deeper answer than a whole-subject review would: at least **40 rows** in the gap table, concentrating only on this chapter.

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

Existing chapter in the app: **Processes and threads**. Written lessons today: 7 topics ready.



## The PYQs for this chapter (12)

**2026_FN_Q63** · 2026-FN · NAT · 2 marks · Medium · bank topic: System Calls, Processes, Threads, InterProcess Communication

Consider the following program snippet. Assume that the program compiles and runs successfully. Further, assume that the `fork()` system call is always successful in creating a process.
```c
int main() {
    int i;
    for (i = 0; i < 3; i++){
        if (fork() == 0){
            continue;
        }
        break;
    }
    printf("Hello!");
    return 0;
}
```
The total number of times that the printf statement gets executed is ________. (answer in integer)

Official answer (numeric): 4 to 4

---

**2024_FN_Q12** · 2024-FN · MSQ · 1 mark · Medium · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which of the following statements about threads is/are TRUE?

- A) Threads can only be implemented in Kernel space
- B) Each thread has its own file descriptor table for open files
- C) All the threads belonging to a process share a common stack
- D) Threads belonging to a process are by default not protected from each other  ✔ official

---

**2024_FN_Q26** · 2024-FN · MSQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which of the following process state transitions is/are NOT possible?

- A) Running to Ready
- B) Waiting to Running  ✔ official
- C) Ready to Waiting  ✔ official
- D) Running to Terminated

---

**2024_AN_Q12** · 2024-AN · MSQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Consider a process P running on a CPU. Which one or more of the following events will always trigger a context switch by the OS that results in process P moving to a non-running state (e.g., ready, blocked)?

- A) P makes a blocking system call to read a block of data from the disk.  ✔ official
- B) P tries to access a page that is in the swap space, triggering a page fault.  ✔ official
- C) An interrupt is raised by the disk to deliver data requested by some other process.
- D) A timer interrupt is raised by the hardware.

---

**2024_FN_Q53** · 2024-FN · NAT · 2 marks · Hard · bank topic: System Calls, Processes, Threads, InterProcess Communication

Consider the following code snippet using the `fork()` and `wait()` system calls. Assume that the code compiles and runs correctly, and that the system calls run successfully without any errors.
```c
int x = 3;
while (x > 0) {
    fork( );
    printf("hello");
    wait(NULL);
    x--;
}
```
The total number of times the printf statement is executed is ________.

Official answer (numeric): 14 to 14

---

**2023_FN_Q22** · 2023-FN · MSQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which one or more of the following need to be saved on a context switch from one thread (T1) of a process to another thread (T2) of the same process?

- A) Page table base register
- B) Stack pointer  ✔ official
- C) Program counter  ✔ official
- D) General purpose registers  ✔ official

---

**2023_FN_Q23** · 2023-FN · MSQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which one or more of the following options guarantee that a computer system will transition from user mode to Kernel mode?

- A) Function call
- B) Malloc call
- C) Page fault  ✔ official
- D) System call  ✔ official

---

**2021_FN_Q60** · 2021-FN · MSQ · 1 mark · Medium · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which of the following standard C library functions will always invoke a system call when executed from a single-threaded process in a UNIX/Linux operating system?

- A) exit  ✔ official
- B) malloc
- C) sleep  ✔ official
- D) strlen

---

**2020_FN_Q18** · 2020-FN · MCQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Consider the following statements about process state transitions for a system using preemptive scheduling.
I. A running process can move to ready state.
II. A ready process can move to running state.
III. A blocked process can move to running state.
IV. A blocked process can move to ready state.
Which of the above statements are TRUE?

- A) I, II and III only
- B) II and III only
- C) I, II and IV only  ✔ official
- D) I, II, III and IV

---

**2019_FN_Q29** · 2019-FN · NAT · 1 mark · Medium · bank topic: System Calls, Processes, Threads, InterProcess Communication

Consider the following C program is executed on a Unix/Linux system:
```c
#include<unistd.h>
int main( )
{
    int i;
    for (i = 0; i < 10; i++)
        if (i % 2 == 0) fork( );
    return 0;
}
```
The total number of child processes created is ________.

Official answer (numeric): 31 to 31

---

**2017_AN_Q14** · 2017-AN · MCQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Which of the following is/are shared by all the threads in a process?
I. Program counter
II. Stack
III. Address space
IV. Registers

- A) I and II only
- B) III only  ✔ official
- C) IV only
- D) III and IV only

---

**2017_FN_Q25** · 2017-FN · MCQ · 1 mark · Easy · bank topic: System Calls, Processes, Threads, InterProcess Communication

Threads of a process share

- A) global variables but not heap
- B) heap but not global variables
- C) neither global variables nor heap
- D) both heap and global variables  ✔ official

