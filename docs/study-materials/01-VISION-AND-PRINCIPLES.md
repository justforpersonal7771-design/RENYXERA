# 01 · Vision and principles

## The product in one paragraph

A student opens a topic, for example *Deadlock* in Operating Systems, and finds one page that starts from why the topic exists, builds the idea in small steps with a picture for every step, shows the formal definition, walks through two or three exactly solved examples (one from a real GATE question), lists the traps, ends with a one-screen recall sheet and a short check, and links straight to the past-paper questions on that topic. It reads like a great teacher's explanation, not a textbook summary, and it is exact where exactness matters: every equation, line of code and table cell is checked.

## What "better than the textbook" means (our design promises)

1. **Syllabus-true.** The structure follows the official GATE syllabus for that paper. If the syllabus lists it, we teach it; if it does not, we do not pad. Weightage from our own question bank (we already have 15 papers for CS, 6 more branches) decides depth and order inside a subject.
2. **Understand first, then memorise.** Every topic has an *intuition layer* (why, picture, analogy) before the *formal layer* (definition, theorem, formula). Memory aids come after understanding, never instead of it (see `06`).
3. **Exact.** Equations are typeset (TeX), code is real and tested, tables and flows are generated from data, not drawn by hand. If a number appears in an example, it was computed by script, not by eye.
4. **Exam-aware.** Every topic carries: how it is asked (MCQ/MSQ/NAT patterns), typical traps, a time-saving shortcut when one exists, and links to the real PYQs.
5. **Short and complete.** A topic lesson is 4 to 10 minutes of reading. Anything longer is split. "Complete" is defined by a coverage checklist per subject, not by length.
6. **One voice, one notation.** A single style guide fixes notation (for example always `T(n)` for time functions, `O(n log n)` typeset the same way), terminology, and examples' names. Contradicting notation between chapters is a defect.
7. **Honest.** We mark what is out of syllabus, what is advanced-optional, and what changed in the latest syllabus. We never invent a source and never claim a fact we have not verified.

## What we refuse to do

- Copy a textbook's wording, figures, examples or question-answer pairs (copyright and, honestly, also worse teaching).
- Publish unreviewed AI output. Draft by AI, check by script, review by a human expert, then publish: always in that order.
- Ship a chapter with a known open error "to fix later".
- Use stock images or screenshots of other people's diagrams.
- Promise results ("guaranteed rank"). We promise clarity and coverage.

## Who it is for

- **Primary:** a GATE aspirant, final-year or working, studying 2 to 6 hours a day, who needs a trustworthy single source and a fast revision path.
- **Secondary:** a student who has done the course once and wants gaps closed and revision sheets.
- **Out of scope:** first-time learners of programming or school mathematics (we state prerequisites at the top of each chapter and link to the prerequisite topic inside the app instead of teaching it again).

## Success measures (how we will know it works)

| Measure | Target for the CS pilot |
|---|---|
| Accuracy defects found by students after launch | < 1 per 50 topics, each fixed within 24 h |
| Students who finish a chapter and then solve its PYQs with a higher score than before (A/B on the checkpoint) | measurable lift, reported honestly |
| Completion of started chapters | > 60 % |
| Refund/complaint rate for "content wrong or unclear" | < 2 % |
| Reviewer sign-off rate on first draft | rising chapter by chapter (a quality signal for the pipeline) |

## Non-goals for v1

Video lessons, live classes, a community forum, printable PDFs (these conflict with protection and cost), and adaptive AI rewriting of chapters. Some can come later; none block v1.
