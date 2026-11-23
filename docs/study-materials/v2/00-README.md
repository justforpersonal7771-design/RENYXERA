# Study materials v2: the rewrite plan (start here)

| # | File | What it is | Who reads it |
|---|---|---|---|
| 00 | `00-HONEST-REVIEW.md` | An honest review of the current books, from a dropper's seat, and what changes | You |
| 01 | `01-MASTER-PROMPT.md` | The prompt that makes any topic be written in the new style (ladder, diagrams, coverage list) | You, then ChatGPT / Gemini / Claude as the writer |
| 02 | `02-REVIEWER-PROMPT.md` | The prompt for ChatGPT and Gemini to review a plan or a topic as a back bencher | ChatGPT, Gemini |
| 03 | `03-PROGRAMMING-IN-C.md` | Subject plan: Programming in C (20 chapters, every topic, finer points, diagrams, traces) | You, then reviewers |
| 04 | `04-DATA-STRUCTURES.md` | Subject plan: Data Structures (16 chapters, same detail) | You, then reviewers |

## The process

1. **You review** 03 and 04 (mark anything missing, in the wrong order, or too big).
2. **ChatGPT and Gemini review** with prompt 02 (paste 02, then the plan). Merge their replies; both-agree items are accepted.
3. **We update the plans** (v2).
4. **Pilot:** one topic is written completely with prompt 01 (suggested: *C9.1–C9.6 Pointers I: memory and addresses*). You read it as the dropper and approve or reject the style.
5. **Build the diagram engine** (the new figure kinds listed at the end of 01).
6. **Bulk writing** subject by subject, with every code sample run by script and every diagram drawn from data.
7. **Plans for the other subjects** (Algorithms, Discrete Mathematics, Digital Logic, Computer Organisation, Operating Systems, Databases, Computer Networks, Compiler Design, Theory of Computation, Engineering Mathematics, General Aptitude) follow the same documents, after the two pilots work. The chapters already written will be rewritten to the new standard.

## What this replaces

Two lines of `docs/study-materials/01-VISION-AND-PRINCIPLES.md` are cancelled: *"first-time learners are out of scope"* and *"a topic is 4 to 10 minutes; short and complete"*. They caused the "briefing up". The new rule is **complete beats short, and the reader may start from zero**.
