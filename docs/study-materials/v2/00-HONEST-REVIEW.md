# 00 · An honest review of the books so far (read this first)

**Written from the seat of a dropper with almost zero knowledge, not from the seat of the author.**
Status: the plan below replaces the writing approach used for the six Computer Organisation chapters, the Programming in C chapter and the rest. Nothing new is written until you have reviewed the plan documents in this folder.

---

## 1. What it feels like to be that student

I picked the chapter *Programming in C*, topic *Pointers, arrays and strings*, because pointers are what everybody is afraid of. The very first thing on the page is this:

> "For `int a[3][4]` at address 1000, `a + 2`, `*(a + 2)` and `&a[2][0]` all print 1032, yet they have three different types, and adding 1 to each moves by 16, 4 and 4 bytes. Pointer arithmetic is type arithmetic."

A person with zero knowledge reads that and stops at the first line:

- *What is `int`?* (nobody told me)
- *What is `a[3][4]`?* (a table? how is it stored?)
- *What is an address?* (a house number? of what?)
- *What does "print 1032" mean? Print where?*
- *Three different types, what is a type of a pointer?*
- *"Pointer arithmetic is type arithmetic"*: I now feel stupid, and I have not learnt a single thing yet.

Then the page says "decays", "`int (*)[4]`", "dereference", "scaled by the pointed-to type" in the first three paragraphs. Every one of those words is a wall.

The one picture on the page is a **table of numbers** (`a + 2 = 1032`, `&a + 1 = 1048`). It is called a figure, but it is not a picture. Nothing shows me memory. Nothing shows me boxes, an arrow, or what "pointing" means.

The whole of C pointers, which is a **full subject by itself** in a classroom (arrays, pointer arithmetic, pointers to pointers, function pointers, strings, dynamic memory, dangling pointers, const pointers, complicated declarations), is **one topic of five minutes**.

How I would feel after 20 minutes: *confused, behind, and sure that I am not smart enough.* That is the opposite of what a paid book must do.

## 2. Would a student pay ₹149 for this? No.

A clear no, for these reasons (all true of what we have shipped):

| What the student needs | What the book does |
|---|---|
| Start from nothing and climb | Starts in the middle, assumes the basics |
| Words explained before they are used | Words used first, explained later or never |
| Pictures of memory, arrays, lists, trees, stacks, frames | Tables and strips of text; no real diagrams |
| Every step shown, slowly, with the values changing | The answer with two or three lines of "steps" |
| Many small examples, then harder ones | 3 examples per topic, usually GATE-hard |
| Every sub-idea covered (the "finer" level) | A summary of the main rule; edge cases in one line |
| Plenty of practice from easy to GATE and twisted | 5 check questions |
| One idea per section, simple English | Dense note style: formulas, abbreviations, jargon |
| Feeling of "I can do this" | Feeling of "this is for someone who already knows" |

A student can already get a *dense summary* from Made Easy notes, Unacademy PDFs or GateWallah books, and the student told us those are confusing. A summary is not our product. **Our product has to be the thing none of them is: a patient teacher who starts from zero, draws everything, and does not skip a step.** If it is, ₹149 is cheap. If it is not, it is worth nothing.

## 3. What went wrong in how we wrote

1. **Our own principle was wrong.** Document `01-VISION-AND-PRINCIPLES.md` says *"Out of scope: first-time learners of programming or school mathematics"* and *"a topic is 4 to 10 minutes"* and *"short and complete"*. That produced "briefing up". Those two lines are cancelled. The new rule: **complete beats short; a topic can take 30 to 60 minutes if every minute teaches something.**
2. **We wrote for a reader who already knows the subject** (someone who wants a revision sheet) instead of the reader who is buying: the one who is scared of the subject.
3. **We wrote text, then called some tables "figures".** A concept is understood when it is *seen*. We never built the drawing tools for memory, arrays, linked lists, trees, stack frames, call trees or step-by-step traces. The diagram engine only knows `graph`, `net`, `matrix`, `steps`, `strip`.
4. **We scoped by the syllabus line, not by the learning needed.** The GATE syllabus says "Programming in C" in a handful of words. To answer those questions a student must learn about 15 chapters of C. We wrote five topics.
5. **We checked numbers by script but never checked understanding.** Nobody who is lost read a page and told us where they got lost.

## 4. What changes (the new contract)

1. **Every subject is planned in a document first** (this folder), reviewed by you, then by ChatGPT and Gemini wearing the "back bencher with plenty of backlogs" hat, and only then written.
2. **A topic is taught on a ladder of 12 steps** (see the master prompt): why → words → see it → build it → do it by hand → exact rules → finer points → how GATE asks → mistakes → tricks → practice ladder → recap.
3. **At least eight diagrams in every topic**, of the right kind (memory boxes with addresses, arrows for pointers, step-by-step frames, trace tables, flow, trees, stack frames, timelines). Diagrams are *data* so they can be redrawn and animated; they are not screenshots.
4. **Every example is run**, not guessed. The output shown is the output the compiler printed. Traces are shown line by line with the variables changing.
5. **The finer level is mandatory.** For each topic a coverage checklist (every property, every edge case, every undefined behaviour, every comparison, every complexity, every GATE twist) must be ticked before the topic can ship.
6. **Simple English.** Short sentences. A new word is explained the moment it appears, with an everyday comparison. No sentence a Class 8 student could not read.
7. **Pilot before bulk.** Once you approve the plan, we write **one** topic completely (suggested: *C pointers, part 1: memory and addresses*) in the new style. You read it as the dropper. Only if it passes do we write the rest.

## 5. What I need from you

1. Read `03-PROGRAMMING-IN-C.md` and `04-DATA-STRUCTURES.md`. Mark anything missing or in the wrong order.
2. Give `01-MASTER-PROMPT.md` and one subject plan to ChatGPT and Gemini with `02-REVIEWER-PROMPT.md`. Bring their answers back.
3. Say yes or no to the pilot topic.

Other subjects (Algorithms, Discrete Mathematics, Digital Logic, Computer Organisation, Operating Systems, Databases, Networks, Compiler Design, Theory of Computation, Engineering Mathematics, General Aptitude) will get the same kind of plan document after these two are approved. Computer Organisation, Operating Systems, DBMS, TOC and the others already written will be **rewritten** to the new standard, in an order we agree.
