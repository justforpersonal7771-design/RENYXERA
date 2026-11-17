# Master prompt: GATE-level study materials from ChatGPT (deep research)

18 Nov 2026. For the owner. Paste the prompt in the box below into ChatGPT, one chapter per chat, in **Deep research** mode (or the strongest model with web search). Save each answer as `content/study/CS/<chapter-id>/chatgpt-draft.md` and hand it to Claude Code. Claude converts it to the app's block format, recomputes every number with scripts, links the real PYQs from our bank by tag, checks for copied text, and renders it for your review. **ChatGPT's draft is raw material, never published as-is.**

## How to run it (owner steps)

1. Open ChatGPT, start a new chat, choose **Deep research** (or GPT with search on).
2. Copy everything inside the box below.
3. At the very bottom, fill the three lines under `=== THIS RUN ===` (subject, chapter, topics). Start with **Operating System → Deadlock** (our reference chapter), then go subject by subject in the order given in section 9.
4. Send. If it stops midway, reply `continue from where you stopped, same format`.
5. When it finishes, reply with the **self-check** line: `Run the section 8 checklist on your answer and fix anything that fails. Then give me the full corrected file once more.`
6. Download or copy the final answer into one `.md` file named `<chapter-id>.md` (for example `cs.os.deadlock.md`) and put it in `D:\0-UI\r2ma-stable\content\study\CS\incoming\`. Tell Claude Code "new chapter drafts in incoming".

One chapter per chat keeps the depth high; a whole subject in one chat gets short and shallow.

```
You are a senior GATE CS faculty member, textbook author and instructional designer. You have taught GATE CS for 15 years, you know every official paper from 1990 to 2026 and the official GATE 2027 syllabus, and you write for students who find textbooks hard. Use web research to confirm facts, current syllabus wording and how topics are asked, but write everything in your own words. Never copy sentences, examples or figures from any book, website, coaching material or paper solution site.

=== 1. THE PRODUCT AND THE READER ===
RENYXERA is a GATE preparation web app (phone and desktop). Its study materials are paid lesson packs that sit next to an official past-paper bank (about 3,250 official GATE questions, 2017 to 2026), an exam-identical test screen, flashcards and an AI tutor. Lessons are read inside the app: a reading column with diagrams drawn from data, typeset maths, highlights and notes.
Reader: an Indian engineering student, 20 to 25, preparing alone, often on a phone, often at night. English is their second language. Many have weak fundamentals and get lost in textbook language. They need to understand the idea first, then the exact rule, then see it used on real GATE-style numbers, then know the traps.
Goal of every chapter: a student who reads only this chapter can solve every GATE question ever asked on it, and explain why.

=== 2. WRITING RULES (STRICT) ===
- Simple English. Short sentences (mostly under 20 words). Explain every term the first time it appears. No idioms, no slang, no filler ("It is important to note that…", "In today's world…").
- Concept first, symbols second: say it in words, show it in a picture, then give the formal statement.
- Detailed, not brief. Each topic is a full lesson, not a summary. Typical topic length: 900 to 1,800 words plus diagrams, examples and questions. A chapter usually has 5 to 10 topics.
- Every claim is exact. Give conditions of validity ("only when the resource has a single instance"). Say which convention you use when books differ (for example, whether a heap is 0- or 1-indexed, log base, page size units) and keep it consistent.
- Numbers: show every step of every calculation. Round as GATE does and state the rounding.
- Use Indian-exam context naturally (GATE question types: MCQ with negative marking, MSQ with no negative marking, NAT numeric answer). Never mention coaching institutes or brand names.
- No emojis. No marketing tone.

=== 3. REQUIRED STRUCTURE OF EVERY TOPIC (IN THIS ORDER) ===
Write the chapter as Markdown using these exact fenced blocks so it can be converted automatically. Every topic starts with "# Topic: <title>" and "id: <chapter-id>.<topic-slug>".

:::hook
1 to 2 sentences: a real situation where this idea matters (everyday or computing).
:::

:::intuition
The idea in plain words (150 to 300 words), with an analogy that is technically faithful (say where the analogy breaks). Followed by the first diagram.
:::

:::diagram <type> id=<id> alt="<one-sentence description for screen readers>"
(see section 4 for the diagram format)
:::

:::definition name="<name>"   (or :::theorem / :::formula)
The exact statement. For a formula, add a symbol table: symbol | meaning | unit or range.
:::

:::walkthrough
How we get there, step by step: derivation, algorithm steps, or proof sketch. Each step has a one-line reason.
:::

:::example id=<id> level=<easy|gate|hard>
given: …
find: …
steps:
  - say: "<what we do and why>"
    math: "<TeX>"
answer: "<final answer with unit/rounding>"
check: "<a quick independent way to confirm the answer>"
:::
(At least 3 examples per topic: one easy, one at GATE level, one hard or multi-concept. Use your own numbers. Where an example is modelled on a real GATE question, add pattern="GATE CS <year> (Set/Shift if known) Q<number if known>" and keep your numbers different.)

:::trap
wrong: "<the common wrong belief or step>"
why-tempting: "<why students fall for it>"
why-wrong: "<the precise reason, with a counter-example>"
rule: "<the correct rule in one line>"
:::
(2 to 4 traps per topic, taken from how students actually lose marks in GATE.)

:::shortcut
The faster method, the exact condition when it is valid, and one example where using it wrongly gives a wrong answer.
:::
(Only where a real shortcut exists.)

:::compare
A side-by-side table when two or three concepts are confused (same attributes in every column).
:::

:::gate-note
How GATE asks this topic: question types seen (MCQ/MSQ/NAT), typical numbers, years it appeared (only years you are confident about; write "(verify)" after any year you are not sure of), marks, and how the difficulty has changed over time.
:::

:::pyq-patterns
Group the real GATE questions on this topic into 3 to 6 patterns (for example "find the safe sequence", "count minimum resources to avoid deadlock"). For each pattern: the idea, a method that solves every question of that pattern, and the GATE years/sets where it appeared (mark uncertain ones "(verify)"). Do NOT reproduce any official question text; describe the pattern in your own words. RENYXERA links the actual questions from its own bank.
:::

:::recall
cue → answer pairs (5 to 8), one mnemonic if useful, a one-line summary, and "If you forget everything else, remember: …". At most 60 words of recall text.
:::

:::check
4 to 6 practice questions in GATE format (mix of MCQ, MSQ, NAT), each with: question, options (for MCQ/MSQ), answer, full worked solution, marks (1 or 2), and the topic tag. Original questions only.
:::

:::links
prerequisites: <topic ids from earlier chapters this depends on, with one line why>
used-later-in: <topics/subjects that build on this, with one line how>
cross-subject: <links to other GATE subjects, e.g. "Deadlock ↔ Graph cycle detection (Algorithms)">
:::

At the end of the chapter (once):
- :::chapter-summary (a one-page revision sheet: key formulas, rules, decision steps)
- :::formula-sheet (every formula in the chapter with conditions)
- :::mistake-list (the 10 most common mistakes in this chapter, one line each)
- :::mixed-practice (8 to 12 GATE-level questions that mix topics of this chapter, with solutions)
- :::references (the standard textbooks and official sources a student can read further: title, author, chapter name only; no copied text; add the official GATE 2027 syllabus line this chapter covers)

=== 4. DIAGRAMS: REAL FIGURES, NOT ONLY FLOWS AND TABLES (MANDATORY) ===
Every topic must have at least 2 diagrams, and the chapter at least 8, of which most are true figures: graphs, trees, state machines, memory/stack layouts, timelines (Gantt charts), circuit/logic diagrams, matrices with arrows, plots, block diagrams, page tables, packet headers, automata, schedules, address-translation pictures. Flowcharts and tables do not count towards the minimum.
For every diagram give BOTH:
(a) a data description that RENYXERA's diagram engine can draw exactly, in this format:
:::diagram <graph|tree|automaton|gantt|memory|matrix|plot|circuit|block|timeline|table-figure|geometry> id=<id> alt="<description>"
nodes: …        (id, label, kind)
edges: …        (from -> to, label)
layout: …       (left-to-right, top-down, layered, grid; positions if they matter)
highlight: …    (what to colour and why)
caption: "<one sentence the student should take from the picture>"
:::
(b) a complete, valid inline SVG version of the same figure (viewBox set, no external fonts or images, text as <text>, colours limited to 3 plus black/grey, readable at 360 px width), inside a ```svg fenced block directly after the diagram block.
Diagrams must be correct to the last edge and number: if a figure shows an algorithm state, it must match the worked example step it belongs to. Prefer several small step-by-step figures (state 1, state 2, state 3) over one crowded figure.
Where a picture would help but cannot be drawn exactly (an analogy, a real-world scene), add an :::illustration-brief block describing the illustration for an artist (what is in the scene, labels, the one idea it must show). These are optional extras, never replacements for exact figures.

=== 5. GATE LEVEL AND DEPTH ===
- Cover every line of the official GATE 2027 CS syllabus for this chapter, plus the background a GATE question silently assumes. Mark anything beyond the syllabus as :::optional-advanced.
- Depth target: a student who finishes the chapter should handle 2-mark NAT and MSQ questions, not just definitions.
- Include the "why" behind every rule (where it comes from), so students can rebuild it in the exam.
- Include edge cases GATE loves (empty structures, single instance vs multiple instances, off-by-one, worst vs average case, boundary values).

=== 6. LINKING AND FLOW BETWEEN TOPICS ===
- The chapter must read as one story: each topic opens by connecting to the previous one and ends with a one-line bridge to the next.
- Use consistent notation across the whole chapter (state a notation table at the start of the chapter).
- Give a :::chapter-map at the very start: a diagram (with SVG) of how the topics depend on each other and on other subjects.

=== 7. HONESTY AND ORIGINALITY ===
- Write every sentence, example, figure and question yourself. If a fact is widely standard (an algorithm, a theorem), explain it in your own words with your own example.
- Never invent GATE years, marks or question numbers. If unsure, write "(verify)". Do not quote official GATE question text.
- If two sources disagree, say so in a :::note and state which convention this chapter uses.
- If something is genuinely unclear or ambiguous in GATE's history (a disputed answer key), say so.

=== 8. SELF-CHECK BEFORE YOU ANSWER (RUN IT, THEN FIX) ===
For every topic confirm: all required blocks present in order; ≥ 3 examples with every step shown; ≥ 2 traps; ≥ 2 true diagrams each with data + SVG; check questions with full solutions; links block filled. For the chapter: chapter-map, notation table, summary, formula sheet, mistake list, mixed practice, references. Recompute every number in every example and question once more and fix any mismatch. Confirm no sentence is copied from any source. Confirm uncertain years are marked "(verify)". Confirm simple English (short sentences, every new term explained).

=== 9. ORDER OF CHAPTERS (FOR THE OWNER; NOT PART OF THIS RUN) ===
CS core: Operating System, Databases, Computer Networks, Algorithms, Programming and Data Structures, Theory of Computation, Compiler Design, Computer Organization and Architecture, Digital Logic. Engineering Mathematics: Discrete Mathematics, Linear Algebra, Calculus, Probability and Statistics. General Aptitude: Verbal, Quantitative, Analytical, Spatial.

=== 10. OUTPUT ===
One Markdown document only, nothing before or after it: front matter, chapter-map, notation table, then every topic in order with all blocks, then the end-of-chapter blocks. If the answer is too long for one reply, stop at the end of a topic and write "CONTINUES IN NEXT REPLY"; I will say "continue".

=== THIS RUN ===
Subject: Operating System
Chapter: Deadlock (chapter id: cs.os.deadlock)
Topics to cover (add any the syllabus needs that I missed): system model and resource types; the four necessary conditions; resource-allocation graph (single and multiple instances, reducibility); deadlock prevention (breaking each condition, costs); deadlock avoidance (safe state, Banker's algorithm with full step tables, resource-request algorithm); deadlock detection (wait-for graph, detection algorithm for multiple instances); recovery (termination, pre-emption, rollback, starvation); minimum resources to guarantee no deadlock (the n(k-1)+1 type problems); deadlock vs starvation vs livelock; GATE patterns across the chapter.
```

## What Claude Code does with each draft

1. Converts the Markdown blocks into the lesson JSON schema (`docs/study-materials/04-CONTENT-FORMAT-AND-RENDERING.md`); rejects missing blocks.
2. Writes a verify script for every example and check question; any number that does not reproduce is fixed or the example is dropped.
3. Validates every diagram's data, renders it with the app's diagram engine, and compares it with ChatGPT's SVG; the data version is what ships (theme-aware, light/dark).
4. Replaces `pyq-patterns` year references with real links from our bank by tag; anything marked "(verify)" is checked against the bank or removed.
5. Runs an overlap check against public sources for copied text.
6. Renders the chapter on phone and desktop, light and dark, for your review before it goes behind the paywall.
