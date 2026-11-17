# Master prompt: research how RENYXERA should build its GATE study materials

18 Nov 2026, rewritten after owner feedback: ChatGPT is asked for **research and a build blueprint**, not to write the chapters. Claude Code authors every chapter from this blueprint.

## How to run it (owner steps)

1. Open ChatGPT, new chat, choose **Deep research**.
2. Copy everything inside the box below and send it.
3. When it finishes, send: `Run the section 9 self-check on your answer, fix what fails, and give me the complete corrected document once more.`
4. Save the final answer as `D:\0-UI\r2ma-stable\docs\study-materials\chatgpt-blueprint.md` and tell Claude Code "blueprint saved". Claude compares it with our plan (files 01 to 14 in this folder), shows you what differs, and then builds.

```
You are a team of four working together: (1) a learning scientist who knows the research on how students learn technical subjects, (2) a GATE CS subject expert who has taught GATE for 15 years and knows every official paper from 1990 to 2026 and the GATE 2027 syllabus, (3) a textbook and instructional designer who has shipped digital textbooks, and (4) a product researcher who studies the best study apps and digital books. Do real web research. Cite sources for every claim about research, competitors or exam facts. Where you are unsure, say so.

I am NOT asking you to write study material. I am asking you to research and design HOW our study materials must be built so that our writer (an AI author working inside our codebase) can produce GATE-level chapters that are complete, accurate, easy to understand, and better than anything students can get today.

=== 1. THE PRODUCT ===
RENYXERA is a GATE preparation web app (installable, phone and desktop) for Indian engineering students: official past-paper bank (about 3,250 official questions, 2017 to 2026, CS verified), exam-identical test screen, AI tutor, analytics, flashcards, mistakes bank. Study materials are a planned paid product: lesson packs per subject (₹99 to ₹149, one-time), read inside the app. Free sample: Operating Systems → Deadlock. Budget for tools is zero: everything must be free or built in-house. Branches: CS first, then DA, EC, EE, ME, CE.
How lessons are shown today (planned): one reading column; content stored as structured blocks (hook, intuition, definition/theorem/formula, walkthrough, worked example, trap, shortcut, gate-note, recall card, check questions, PYQ links, references); maths typeset; diagrams drawn from data as SVG (graphs, trees, automata, Gantt charts, memory layouts, circuits, plots); highlights in four colours and typed notes that sync; copy protection.

=== 2. THE READER ===
20 to 25 years old, preparing alone, mostly on a phone, often at night. English is a second language. Many have weak fundamentals and get lost in textbook language. Many have watched long video lectures and still cannot solve 2-mark GATE questions. They need: the idea first, then the exact rule, then real GATE-style use, then the traps, then practice.

=== 3. THE OWNER'S REQUIREMENTS (NON-NEGOTIABLE) ===
- No chapter may be blank, thin or a summary. Each must be detailed, at full GATE depth.
- Real diagrams and images in every topic (not only flowcharts and tables): figures that show the concept (graphs, trees, memory, timelines, circuits, state machines, plots, step-by-step algorithm states).
- Simple English, easy to understand.
- Past GATE questions, worked examples, practice, traps, and links between topics and subjects.
- Everything a top-quality GATE study material should have.

=== 4. WHAT I NEED FROM YOU (USE THESE SECTION NUMBERS) ===

4.1 Learning science: what research says works for technical self-study and exam preparation (worked examples and fading, retrieval practice, spacing, interleaving, dual coding, concrete-to-abstract, cognitive load, misconception-first teaching, self-explanation prompts, signalling). For each: the finding, the source, and exactly how it should appear on a lesson page (a concrete rule our writer can follow).

4.2 Benchmark: study the best references and products and say what to copy (as patterns, not content): leading GATE books and notes, classic textbooks (Cormen, Silberschatz, Tanenbaum, Hopcroft-Ullman, Morris Mano, Hamacher/Patterson, Korth, etc.), NPTEL courses, Brilliant, Khan Academy, Better Explained, 3Blue1Brown style visual explanation, interactive textbooks (e.g. Open DSA, MIT OCW notes), and any strong Indian GATE platforms. For each: what it does best, what it does badly, and the pattern we should adopt. A comparison table at the end.

4.3 The ideal chapter blueprint: the exact structure of a GATE-level chapter and of each topic inside it, block by block, with the purpose of each block, minimum and maximum lengths, how many examples/traps/diagrams/questions, and the order. Explain why this order. Include chapter-level pieces (chapter map, notation table, summary, formula sheet, mistake list, mixed practice, revision sheet) and say which are essential vs optional.

4.4 Depth standard: a measurable definition of "GATE level" for a chapter (for example: every syllabus line covered; every question pattern from 1990 to 2026 has a worked method; 2-mark NAT/MSQ handled; edge cases listed). Give a scoring rubric (0 to 5 per criterion) our reviewer can apply to each chapter.

4.5 Diagrams and images: which figure types each CS subject needs (OS, DBMS, CN, Algorithms, Programming and DS, TOC, Compiler Design, COA, Digital Logic, Discrete Maths, Linear Algebra, Calculus, Probability, General Aptitude), with 5 to 10 concrete figure ideas per subject (for example "page-table walk with TLB hit and miss paths", "B+ tree insertion split, three states"). Rules for good technical figures (one idea per figure, step sequences, labelling, colour use, accessibility, phone width). How to keep figures exactly correct (generated from data, checked against the worked example). When an illustration (not a precise figure) helps, and how to brief it.

4.6 Simple English: a style guide for second-language readers (sentence length, vocabulary list to avoid, how to introduce a term, how to write a definition, how to phrase a trap), with before/after examples of a hard textbook sentence rewritten.

4.7 PYQ integration: how to use past questions inside lessons without copying question text (patterns, methods, year references, linking to the app's question bank by topic tag), how many to show per topic, where they go in the lesson, and how to show frequency/trend of a topic in GATE.

4.8 Linking: how to connect topics within a chapter, across chapters, and across subjects (prerequisite maps, "used later in", cross-subject bridges), and how to show this to students (maps, links, recaps).

4.9 Practice and revision inside lessons: check questions per topic (types, difficulty mix, solutions), mixed practice per chapter, recall cards, spaced revision hooks into the app's flashcards and mistakes bank.

4.10 Accuracy and quality pipeline: how a small team (one owner plus an AI author) can guarantee correctness: verify every number by script, run every code sample, check diagrams against data, plagiarism/overlap checks, expert review checklist, error reports from students, versioning. Give the checklists.

4.11 Per-subject plan for CS: for each subject, the chapter list in teaching order mapped to the GATE 2027 syllabus lines, estimated topics per chapter, the hardest concepts students struggle with, and the top question patterns from past papers (years where you are confident; mark uncertain ones "(verify)").

4.12 One fully worked sample of the blueprint applied to ONE topic: "Banker's algorithm" (OS → Deadlock), showing every block with real content, including at least two figures described precisely (data for an SVG engine) so our writer sees the standard. This is the only content I want you to write.

4.13 Mobile reading experience: what makes long technical lessons readable on a phone (chunking, sticky context, progress, diagram zoom, tables on narrow screens, dark mode), with sources.

4.14 Pricing and packaging signals: what students value enough to pay for in study material versus free YouTube/notes, and what would make RENYXERA's material clearly better (with evidence where available).

4.15 Risks: copyright, accuracy, AI-written content looking generic, outdated syllabus, too long to finish. How to prevent each.

4.16 A build plan: the order to produce materials (which subject first and why), how long a chapter takes with an AI author plus review, and what to measure after launch (completion, check-question scores, return rate).

=== 5. RULES ===
- Cite sources (title, author/organisation, link) for research findings, competitor observations and exam facts.
- No invented statistics. Say "no reliable data found" when that is the case.
- Concrete over general: every recommendation must be something our writer can apply on a page.
- Do not copy any book or website text.

=== 6. OUTPUT ===
One Markdown document with the section numbers above, tables where useful, and a final "Top 20 rules for the writer" list that condenses everything into rules an AI author can follow while writing a chapter.

=== 9. SELF-CHECK ===
Before answering, check: every section 4.1 to 4.16 is answered; every research claim has a source; the rubric is measurable; the Banker's sample includes all blocks and two precise figures; the figure lists cover every CS subject; nothing is copied.
```

## What Claude Code does with the blueprint
1. Compares it with our existing plan (`01` to `14` in this folder) and lists what changes.
2. Updates the chapter template, block schema and reviewer rubric.
3. Builds the lesson renderer and diagram engine to the blueprint.
4. Writes the Deadlock reference chapter itself (all topics, figures from data, every number verified by script, PYQs linked from our bank) and shows it to you on phone and desktop before writing more.
