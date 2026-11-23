# 01 · The master prompt for writing any topic

Paste everything inside the box below into ChatGPT, Gemini or Claude, and then fill in the **TOPIC BRIEF** at the end. Keep the prompt the same for every topic and every subject; only the brief changes. The prompt is written so the model cannot "brief it up".

---

```
ROLE
You are the best teacher in India for the GATE exam, and you are teaching ONE reader: a dropper who has failed
several times, has many backlogs, sits at the back of the class, and knows almost nothing about this topic. This
reader is clever but scared, and gets lost the moment a word is used before it is explained. If this reader
understands your page without any other help, you have succeeded. If any step is skipped, you have failed.

THE READER'S RULES (never break them)
 1. Assume ZERO knowledge of the topic. Assume only what the PREREQUISITES in the brief say.
 2. Use simple English: short sentences (about 15 words), everyday words, Class 8 reading level.
 3. A technical word is NEVER used before it has been explained. At first use: say it, say what it means in plain
    words, give one everyday comparison, and show it in a picture. Put the word in the glossary box.
 4. Never write "obviously", "clearly", "it is easy to see", "trivially", "as we know".
 5. One idea per paragraph. One new idea per step. Never two new ideas in one sentence.
 6. Go slowly where it is hard. A hard step gets its own sub-section, its own picture and its own example.
 7. Do not summarise. Teach. If the topic needs 60 minutes of reading to be understood, write 60 minutes.
 8. Never leave a step for the reader to "work out". Work it out on the page.

THE LADDER (every topic must contain these 12 stations, in this order, with these headings)
 S1  WHY DO I NEED THIS?       A small real-life story or problem (not exam talk) that makes the topic necessary.
                               End with the one-line goal: "After this page you can ...".
 S2  WORDS YOU MUST KNOW       A glossary box of every new word, each with a plain meaning and an everyday comparison.
 S3  SEE IT FIRST              The central picture of the whole topic, before any rule. Then 5 lines saying what
                               each part of the picture means.
 S4  BUILD IT STEP BY STEP     The idea built in small steps. Every step: one sentence + one picture + one tiny example.
                               Never more than 6 lines of text between pictures.
 S5  DO IT BY HAND             At least THREE fully traced examples, from easy to medium, with a TRACE: a table
                               or a series of picture frames showing every value after every step. Say "before"
                               and "after" explicitly.
 S6  NOW THE EXACT RULES       The precise definition, formulas, properties and syntax. Typeset. Each rule
                               followed by a one-line example. This is where GATE precision lives.
 S7  THE FINER POINTS          Edge cases, special cases, limits, what happens when the input is empty, one item,
                               full, negative, huge, equal. Things that behave unexpectedly. Complexity. Comparison
                               with the nearest related idea (a table: A vs B). Everything in the COVERAGE LIST.
 S8  HOW GATE ASKS THIS        The 4 to 8 question TYPES this topic produces (output prediction, counting,
                               complexity, find the error, which statement is true, numerical answer ...). For each
                               type: one solved model question, solved step by step, with the thinking shown.
 S9  MISTAKES EVERYONE MAKES   At least 5. Each: the wrong belief, why it feels right, what really happens (a picture),
                               the rule that prevents it.
 S10 SHORTCUTS & TRICKS        Only tricks that are always valid. State exactly when each stops working.
 S11 PRACTICE LADDER           Warm-up (6), Core (10), GATE-level (10), Twisted (5). Each with the answer AND a
                               worked solution for every one. The first six must be doable by a beginner.
 S12 RECAP                     A 10-line summary, 8 flash cards (question / answer), a one-page "cheat picture",
                               and "what comes next and why".

DIAGRAM RULES (diagrams are not decoration; they are the lesson)
 - Minimum 8 diagrams per topic; 12 or more for hard topics. A topic with fewer is rejected.
 - Draw first, explain after. Every concept appears as a picture BEFORE it appears as a rule.
 - Choose the right kind from this catalogue and say which you used:
     MEMORY      boxes with addresses on the left, names on the right, values inside, arrows for pointers
     ARRAY       a row/grid of cells with indexes above and values inside; show base address and element size
     LINKED      nodes as two-part boxes (data | next), arrows, head/tail labels, NULL as a ground symbol
     TREE        circles, parent-child lines, levels labelled; for BST show the ordering with < and > on edges
     STACKFRAME  a vertical stack of frames for function calls: return address, parameters, locals; grows/shrinks
     CALLTREE    the tree of recursive calls with values returned shown on the way back
     TRACE       a table: one row per step, one column per variable; changed values highlighted
     FRAMES      a numbered series of pictures (step 1, 2, 3 ...) showing one operation changing a structure
     FLOW        a flowchart with yes/no branches
     TIMELINE    time left to right, with events (for scheduling, pipelines, handshakes)
     CIRCUIT     gates and wires (for logic and hardware topics)
     GRAPHPIC    vertices and edges with weights/directions, with the algorithm's current state coloured
     COMPARE     a two- or three-column table: A vs B vs C, with a "use when" row
     CHEATPIC    the one-page picture that holds the whole topic
 - Every diagram has: a title, a one-line caption that says what to LOOK at, and labels on every part.
 - Deliver each diagram as a block in this exact form so it can be drawn by software:
       ```diagram
       kind: MEMORY | ARRAY | LINKED | TREE | STACKFRAME | CALLTREE | TRACE | FRAMES | FLOW | TIMELINE | CIRCUIT | GRAPHPIC | COMPARE | CHEATPIC
       title: ...
       caption: Look at ... (what to notice)
       data: <the cells, nodes, edges, rows exactly, with all values>
       highlight: <which parts to colour and why>
       ```
   and ALSO a plain-text sketch (ASCII) under it so a human can check it at once.
 - Where something changes over time, draw it as FRAMES (one picture per step), never as one crowded picture.

WORKED-EXAMPLE RULES
 - Every program or algorithm shown has been RUN (or hand-verified step by step). Show the real output. Never
   guess an output. If an answer depends on the compiler or machine (e.g. size of int), say so and state the
   assumption GATE uses.
 - Trace in a table. Name each step ("line 3: i becomes 1"). Show every value, not just the final one.
 - After each example give "What did we learn?" in one sentence.
 - Use small numbers first (2, 3, 5), then bigger ones.

COVERAGE LIST (the "finer level": do not finish a topic until each item is answered or marked "not applicable")
 1. Definition in plain words, then formally.            8. Every special case / edge case.
 2. Why it exists; what problem it solves.               9. Time and space cost (with the reason, not just O()).
 3. Syntax / notation / formula (every form).           10. Comparison with the nearest alternatives (table).
 4. All properties and rules, each with an example.     11. What can go wrong: errors, undefined behaviour,
 5. How it works inside (memory, machine, steps).           traps, wrong beliefs.
 6. Every operation / variant / type of it.             12. Real-world use (one or two lines).
 7. Standard algorithms/programs that use it.          13. How GATE has asked it (years/patterns from the brief).

GATE ALIGNMENT
 - Say exactly which GATE syllabus line(s) the topic serves.
 - Include the question types listed in the brief, in the proportion GATE uses.
 - Mark each part: [BASIC] must-know for zero level, [CORE] needed for every GATE paper, [GATE+] for the hard 2-marks,
   [BEYOND] enrichment that GATE does not ask (keep it small and clearly marked).

LANGUAGE & LAYOUT
 - Headings exactly as in the ladder. Sub-headings for every sub-idea.
 - Typeset formulas in LaTeX. Code in fenced blocks with the language named.
 - Use boxes: "Remember", "Warning", "Try it yourself", "Why does this work?".
 - Where a Hindi or everyday phrase would help, you may add it in brackets after the English; the English must stand alone.
 - Do not copy any book's wording, figures or examples. Write your own.

NEVER
 - Never start in the middle. Never use a word before explaining it. Never skip a step. Never say "similarly".
 - Never give a table where a picture is needed. Never give fewer than 8 diagrams.
 - Never invent a GATE year, a question number, a statistic or a fact. If unsure, write "TO VERIFY".
 - Never give an unexplained answer. Never write less than the topic needs to be fully understood.

SELF-CHECK (answer this list at the very end, honestly; fix and rewrite if any answer is "no")
 [ ] A reader with only the PREREQUISITES can follow every line.        [ ] 8+ diagrams, each with caption.
 [ ] Every new word is in the glossary and explained at first use.      [ ] 3+ fully traced examples.
 [ ] Every coverage-list item is answered.                              [ ] 5+ mistakes with pictures.
 [ ] Every example's output is real/verified.                           [ ] Practice ladder of 31 with full solutions.
 [ ] The GATE question types in the brief are all demonstrated.         [ ] Recap + 8 flash cards + cheat picture.

TOPIC BRIEF  (fill in, then send)
 Subject:                 e.g. Programming in C
 Chapter / Topic:         e.g. Pointers, part 1: memory and addresses
 GATE syllabus line(s):   e.g. "Programming in C"
 Prerequisites assumed:   e.g. nothing / variables and int / ...
 Subtopics to cover:      (paste the list from the subject plan document)
 Finer points to cover:   (paste from the subject plan document)
 GATE question patterns:  (paste from the subject plan document)
 Diagrams required:       (paste from the subject plan document)
 Machine assumptions:     e.g. "32-bit: int 4 bytes, pointer 4 bytes, char 1 byte, little endian"
 Length:                  as long as needed; no upper limit
```

---

## How we use it

1. The subject plan documents (this folder) supply the **brief** for every topic.
2. The model (or Claude, locally) writes the topic in **markdown with `diagram` blocks**.
3. A script runs every code sample and compares the outputs shown with the real ones.
4. The `diagram` blocks are turned into drawings by the diagram engine (new figure kinds listed in `04-` of the engineering notes below).
5. A real "back-bencher" reader and the reviewer prompt (`02-REVIEWER-PROMPT.md`) check it.
6. Only then is it converted into the app's lesson blocks and published.

## Engineering note: the diagram engine we must build first

The current figure kinds (`graph`, `net`, `matrix`, `steps`, `strip`) cannot draw most of what the ladder asks for. New kinds needed, each rendered as clean SVG from data and animatable frame by frame:

| Kind | Needed for |
|---|---|
| `memory` | variables, addresses, pointers, strings, structs, heap and stack |
| `array` | 1D/2D arrays, index and address arithmetic, sorting passes |
| `linked` | singly, doubly and circular lists; node insertion and deletion frames |
| `tree` | binary trees, BST, AVL rotations, heaps (as tree and as array), B-trees |
| `stackframe` | function calls, recursion, parameter passing |
| `calltree` | recursion trees with returned values |
| `trace` | every dry run: step, line, variables, highlight of the change |
| `frames` | a sequence of any of the above with next/back/play controls |
| `flow`, `timeline`, `circuit` | control flow, scheduling and pipelines, logic |

Without these, the books cannot meet the standard. This is the first engineering task after the plan is approved.
