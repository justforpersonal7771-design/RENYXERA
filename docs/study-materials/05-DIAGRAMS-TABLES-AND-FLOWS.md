# 05 · Diagrams, tables and flows

Diagrams are where most study materials are weakest (blurry, copied, inconsistent). Ours are generated from data, so they are exact, consistent, theme-aware, accessible and not downloadable as image files.

## 1. Principle

**A diagram is data plus a layout engine, never a drawing.** The author writes *what is connected to what, with which labels and values*; the engine lays it out and renders SVG. That gives us:
- exactness (a label cannot disagree with the text because both come from the same data);
- consistency (every graph looks like every other graph);
- accessibility (alt text and a text equivalent are generated from the same data);
- protection (there is no image file to save; the SVG is built in memory from the decrypted bundle, see `07`).

## 2. Diagram types we will support (by priority)

| Family | Types | Used in |
|---|---|---|
| **Graph and tree** | Graph (directed/weighted), tree (binary, B/B+, trie, heap), DAG, resource-allocation graph, spanning-tree steps, DFS/BFS trees | Algorithms, DS, OS (RAG), Networks, DBMS (B+ tree) |
| **Automata and grammar** | DFA, NFA, PDA, Turing machine, parse tree, derivation tree, state-transition diagram | TOC, Compiler |
| **Memory and layout** | Stack frame, heap/segments, page table walk, cache set/line layout, TLB flow, array layout, linked-list pointers | COP, OS, C programming |
| **Timing and schedule** | Gantt chart (CPU scheduling), pipeline diagram (stages × cycles), timing diagram, sequence diagram (protocols), time-line | OS, COA, Networks, Signals |
| **Flow** | Flowchart, algorithm flow, decision tree, protocol state machine | everywhere |
| **Circuit and logic** | Logic gates, K-map, combinational/sequential circuits, flip-flops, MUX/decoder, adders | Digital logic |
| **Block and system** | Block diagrams (CPU datapath, control systems, communication chain, DBMS architecture, compiler phases), signal flow | COA, Control, Communication, DBMS |
| **Mathematics** | Function plots, number lines, Venn/set diagrams, Hasse diagrams, lattices, probability trees, geometry figures, vector diagrams | Discrete, Calculus, Probability, Mechanics |
| **Engineering mechanics and civil/mechanical** | Free-body diagrams, shear-force and bending-moment diagrams, Mohr's circle, truss, beam loading, stress-strain curve, P-v/T-s diagrams, psychrometric chart parts, flow nets, hydrographs, soil-phase diagram | ME, CE |
| **Electrical and electronics** | Circuit schematics (R, L, C, sources, op-amp, transistor), phasor diagrams, Bode/Nyquist/root-locus plots, waveform sketches, power-system single-line diagrams | EC, EE |
| **Charts** | Bar, line, pie from data | General Aptitude, data interpretation |

Each family has a **typed schema** (nodes, edges, regions, values, annotations) and a **layout engine** (for example a layered DAG layout, tidy-tree layout, force-free manual coordinates for hand-tuned figures). Where automatic layout looks poor (some circuits, free-body diagrams), the author supplies coordinates in the data; the engine still renders and validates.

## 3. Exactness gates for a diagram

1. **Structure valid:** references resolve, no orphan nodes, flowcharts have one entry and every path ends.
2. **Values from code:** weights, schedules, trace cells come from the verify script (a Gantt chart's bars are computed by the scheduling simulation, not typed).
3. **Label audit:** every label in the figure is mentioned or defined in the text, and every symbol in the text that points at the figure exists in it.
4. **Legibility:** minimum font size equivalent to 12 px at a 360 px column; contrast ≥ 4.5:1 in light and dark; minimum 8 px gaps; no label overlap (collision detection).
5. **Accessibility:** alt text (what it shows), long description for complex figures, a text-equivalent table for graphs and automata (transition table), keyboard-focusable steps for animated diagrams.
6. **Step diagrams:** a diagram that builds in steps (for example Dijkstra) has a step list; the final step equals the text's answer.
7. **Visual regression:** every figure has a stored golden rendering; a changed figure must be reviewed.

## 4. Animation (used sparingly and only to teach)

- **Step-through diagrams** (Dijkstra, tree rotations, pipeline hazards, TCP handshake) with previous/next, driven by the same data as the static final figure, respecting reduced motion (static steps only).
- **Interactive widgets (later phase):** sliders for a formula (beam deflection versus load), "what if" toggles; computed with the same formula as the text.
- No decorative animation. If a motion does not teach, it is removed.

## 5. Tables

- **Types:** definition tables, comparison tables (`compare`), truth/state/transition tables, trace tables, formula tables, constants tables, decision tables, schedule tables.
- **Authoring:** columns are typed (text / number / unit / TeX / code); the table is data, so totals, sorting and consistency are checked by script.
- **Rendering:** semantic HTML table with sticky header and first column, responsive modes (scroll, card, rotate) chosen per table, theme-aware zebra rows, tabular numerals for alignment.
- **Source line:** a table of facts (for example protocol header sizes) carries its source.

## 6. Flows ("flows" in your brief)

Three kinds, all as data:
1. **Algorithm and process flowcharts:** boxes, decisions, loops.
2. **Learning flows:** "if you see X in a question, do Y" decision trees (the exam-technique flows), which are some of the most valuable memory aids; each is checked by the verify script against sample questions.
3. **Concept flows:** how a concept builds on prerequisites (generated from the prerequisite graph and shown at the top of each chapter).

## 7. The diagram engine (implementation outline)

- Implementation: a small TypeScript module (`lib/study/diagram/*`) with one schema and one renderer per family. Layout via a lightweight layered-graph algorithm and manual coordinates; text measurement is done with a fixed metrics table for our fonts so layout is identical on every device and at build time.
- Output: SVG strings built in memory (no DOM images). The SVG is inserted by React, so it can be themed through CSS variables and kept off the network as a separate file.
- Build-time rendering is used to compute golden images for tests and the PNG poster of the free-preview topics only.
- Phase order: start with the families that unlock the most CS topics (graph/tree, automata, Gantt/pipeline, memory layout, flow, logic circuits), then maths plots, then the engineering families when their branches begin.

## 8. What we will not do

- Embed raster figures from books, other sites or AI image generators for technical content (inexact, uncheckable, copyright-risky).
- Use hand-drawn images for anything numeric.
- Leave a diagram without a text equivalent.
