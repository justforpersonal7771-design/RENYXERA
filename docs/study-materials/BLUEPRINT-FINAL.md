# Study materials: final build blueprint

18 Nov 2026. Merged from the owner's two ChatGPT deep-research reports (`deep-research-report.md` = R1, `deep-research-report (1).md` = R2) and our plan files `01` to `14`. Where the reports disagree, the stricter / more detailed option wins, because the owner's rule is "no chapter may be blank, thin or brief". Claude Code writes every chapter from this blueprint; ChatGPT writes nothing that ships.

## 1. Chapter structure (fixed order)

**Chapter start**
1. Chapter map: a real diagram of the topics and their prerequisites (R1, R2).
2. Prerequisite check: 3 to 5 quick questions on what the chapter assumes, each linking to the earlier chapter (R2).
3. Notation table when the chapter uses symbols (R1, R2).

**Every topic, in this order**
| # | Block | Size | Source |
|---|---|---|---|
| 1 | Hook: why it matters, a real situation | 1–3 sentences | R1, R2 |
| 2 | What you will learn | 2–3 bullets | R2 |
| 3 | Intuition with an analogy (say where the analogy breaks) and a first figure | 150–300 words | R1, R2 |
| 4 | Definition / theorem / formula, symbol table for formulas | 50–120 words | R1, R2 |
| 5 | Walkthrough, step by step, with self-explanation prompts ("why is step 3 needed?") | 150–300 words | R2 |
| 6 | Figures: at least **two true figures** per topic; dynamic processes get a **step-sequence figure** built from the example's own data | — | R2 (owner: real diagrams, not flows/tables) |
| 7 | Worked examples: **at least 2** (one GATE-level, one edge case), every step shown and verified by script | 250–600 words each | R1 + R2, raised |
| 8 | Faded example: same shape, some steps left for the student | short | R1 rule 6 |
| 9 | Traps: **2–4**, each wrong belief → why tempting → why wrong → rule | 30–60 words each | R1, R2 |
| 10 | Shortcut (only if real), with its validity condition | optional | R1, R2 |
| 11 | GATE note: how GATE asks it; years only from **our own bank** (never from memory) | 1–3 sentences | R1, R2 + honesty rule |
| 12 | Recall cards: 1–3, feed the app's flashcards | — | R1, R2 |
| 13 | Check questions: **4–5**, at least one MCQ, one MSQ or NAT, one 2-mark, full solutions, wrong options explained | — | R1, R2, raised |
| 14 | PYQ links: generated from our bank by topic tag | — | R1, R2 |
| 15 | Links: prerequisites, used later in, cross-subject | — | R1 rule 15 |

**Topic length: 900–1,500 words** plus figures and questions (R1 700–1,000, R2 300–1,000; raised for the owner's no-thin rule). One figure per 300–400 words as a floor (R2).

**Chapter end**: summary (per topic) · formula sheet · mistake list (all traps) · mixed practice **8–12** questions with solutions · revision sheet (one line per topic + the chapter map) · references (title, author, chapter only).

## 2. GATE-level rubric (reviewer scores 0–5; pass = **4 or more on every line**)
1. Syllabus coverage (every GATE 2027 line for the chapter).
2. Question-pattern coverage (every pattern in our 2017–2026 bank has a worked method).
3. Question formats (MCQ, MSQ, NAT each solved in full at least once).
4. Edge cases and counter-examples.
5. Worked-solution correctness and depth (every step justified, numbers verified by script).
6. Self-contained (no step a student cannot rebuild).
R1 set pass at 4, R2 at 3; we use 4. Any line at 2 or below blocks publishing.

## 3. Writing rules (merged top 20, condensed)
Intuition before formalism · short active sentences (15–20 words, one idea each) · define every term at first use · plain words (use, not utilise) · dual coding: every figure explained in the text, no idea without a figure where one helps · concrete numbers before symbols · full worked example then a faded one · traps stated as misconceptions · self-explanation prompts inside the walkthrough · retrieval: check questions and recall cards every topic · consistent notation across the chapter · every syllabus keyword appears as a heading · past-question patterns by year from our bank only, never copied text · every number checked by code · every answer explained · source any research or standard claim · no copied sentences from any book or site.

## 4. Figures (engine, not images)
Figures are data rendered to SVG by our diagram engine, theme-aware (light/dark), readable at 360 px. Types needed first (OS): resource-allocation graph, wait-for graph, Banker's matrices with highlighted rows, safe-sequence step strip, process state diagram, Gantt chart, memory/page-table layout, frame-by-frame page replacement. Other subjects' figure lists are in R1 §4.5 and R2 §4.5 and are adopted as the backlog.

## 5. Product features, phased (from R1 + R2 feature lists)
- **Phase 0 (with the first chapter):** chapter map, resume where you left off, recall cards into flashcards, formula sheet view, check-question results stored per topic, "Ask the Mentor about this step" (existing AI Mentor, our content as context), dark mode (exists), highlights and notes (exist).
- **Phase 1:** prerequisite repair (low score suggests the prerequisite topic), weak-topic view from check results, offline chapters (existing encrypted vault), search inside lessons.
- **Phase 2:** step-through algorithm simulators (Banker's, scheduling, page replacement first), audio narration, PYQ concept graph.
- **Not planned:** public forum (moderation), location-based examples, shared notes (privacy), YouTube playlists (off-brand dependency).

## 6. Build order
1. Lesson schema + validator (`lib/study/schema.ts`), block renderer (`components/study/*`), diagram engine (graph, matrix, gantt, step strip, state diagram first).
2. Reference chapter **Operating System → Deadlock**, written by Claude to this blueprint, every number verified by script, PYQs linked from the bank.
3. Owner review on phone and desktop (light + dark) against the rubric.
4. Rest of Operating System, then Databases and Algorithms (highest weight), then the remaining subjects.

## 7. Sources
R1 and R2 cite the learning-science and benchmark sources (worked examples, retrieval practice, spacing, dual coding, misconception-first teaching, NPTEL, Brilliant, Khan Academy, OpenDSA and others). Their reference lists stay in the two report files.
