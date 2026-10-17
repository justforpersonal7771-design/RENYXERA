# 09 · Roadmap and phases

Principle: **depth before breadth, and a hard gate between phases.** We ship one subject-quality pilot, learn from it, then scale. Each phase has exit criteria; failing one means we fix the pipeline, not push on.

Estimates are for planning only and assume work in focused sessions plus reviewer turnaround; the *review* step is the long pole.

## Phase 0 · Foundations and the reference chapter

**Goal:** prove the whole pipeline on one chapter, end to end, including protection.

Deliverables
1. Decisions (see `00-README`): pricing, launch order, reviewer, sources rule.
2. `content/study/style-guide.md` (notation, terminology, tone, units, rounding, example naming).
3. `scripts/study/build-skeleton.mjs`: builds the approved tree for CS from the syllabus data; coverage and PYQ-tag reports.
4. Authoring dialect and compiler to the JSON schema, with error messages and the validators (schema, TeX, code run, notation lint, links).
5. Renderer MVP: text, equations (SVG), code, tables, callouts, recall card, check questions; light/dark; phone/desktop.
6. Diagram engine v0: graph/tree, automaton, flow, Gantt, memory layout (enough for the pilot chapters).
7. Protection MVP: encrypted bundle, key endpoint, non-extractable key, no-text DOM rendering, blank-on-blur and print, watermark (visible + invisible), per-day cap, red-team script v0.
8. Data model and RLS: `study_access`, `study_progress`, `study_reports`; `getStudyAccess`.
9. The **reference chapter: CS · Operating System · Deadlocks** (6 to 7 topics), fully through stages 0 to 9 of the pipeline.
10. A Phase 0 report: what took long, defect log, reviewer feedback, revised estimates.

**Exit gate:** you read the reference chapter as a student and say "this is the standard"; the protection red-team passes (zero protected words in DOM, blank on print, ciphertext only over the wire); the pipeline produced the chapter with every check green; the reviewer's technical comments are closed.

Estimate: 4 to 6 working weeks (most is the renderer, diagram engine and protection).

## Phase 1 · CS pilot (three subjects)

**Goal:** a believable, complete slice with a diversity of content types.

Subjects (chosen to exercise every block and diagram family and to be high weightage):
- **Operating System** (diagrams: RAG, Gantt, page tables; trace tables; calculations)
- **Algorithms and Data Structures** (trees, graphs, traces, code, recurrences)
- **Digital Logic** or **Theory of Computation** (circuits and K-maps, or automata) as the third

Deliverables: ~110 to 130 topic lessons, all reviewed; the subject cheat sheets; the Study tab, map, path, progress; waitlist-to-pilot invite flow; error reporting for topics; block analytics; 50 to 100 volunteer readers.

**Exit gate:** reviewer sign-off rate on first draft improving over the last chapters; volunteer-reported accuracy errors < 1 per 50 topics; completion > 60 %; no protection test regressions; pipeline throughput known (hours per topic).

Estimate: 8 to 12 weeks.

## Phase 2 · Complete CS and launch

Deliverables: all remaining CS subjects (Discrete Mathematics, Linear Algebra, Calculus, Probability, COA, Compiler Design, Databases, Computer Networks, C programming, GA); the coverage gate at 100 %; the pricing page, checkout and receipts; refund and terms updates; the SEO previews; the launch campaign; the March-refresh tooling.

**Exit gate (launch gate):** 100 % syllabus coverage and 100 % PYQ-tag coverage; all chapters reviewed; red-team green on production; purchase → access → refund drill works end to end; Terms and refunds updated; support runbook ready.

Estimate: 12 to 18 weeks after Phase 1 (the bulk of CS writing).

## Phase 3 · Branch roll-out (one at a time)

Order (default, confirm with you): **EC → EE → ME → CE → DA**. The shared General Aptitude and the maths library are already done, which shortens each branch. For each branch:
1. Source list and style annex for that discipline (units, standards, notation).
2. Approved tree from the branch syllabus (`data/pyq/<BR>/syllabus.json`).
3. Diagram families the branch needs (circuits, free-body, P-v, etc.) added to the engine first.
4. Content in subject-sized releases with reviewer sign-off.
5. Launch gate as in Phase 2.

Estimate per branch: 10 to 16 weeks, decreasing as snippets and shared content accumulate. Each branch is funded by the previous branch's revenue (see `08`).

## Phase 4 · Depth and options (only with data)

- Interactive widgets (formula sliders), animated step diagrams for more topics.
- Hindi layer for text blocks.
- Native wrapper with OS-level screenshot blocking if leaks are material.
- Subject packs, institution licences.
- AI "ask about this paragraph" inside a topic (in Pro, quota-checked, using only the paid-for text as context).
- Printable sheets only if a protected, watermarked, per-account PDF route is judged safe.

## Yearly cycle (every March, from the first launch)

1. Re-pull the official syllabus; diff against the tree.
2. Add the new GATE paper to the bank; recompute weightage and high-yield flags.
3. Review last year's error reports and block analytics; rewrite the worst topics.
4. Publish "What changed" inside the app; renewal offers.
5. Run the full red-team and golden-render tests again.

## Dependencies on the rest of the roadmap

- Needs the **billing and entitlement** system (live) and the **protected vault pattern** (live) for offline reading.
- Reuses **Checkpoint**, **Planner**, **mistakes/revision**, **syllabus map** and **PYQ tags** (all live).
- Does **not** depend on the admin console, but a small content-review dashboard (status per chapter, open comments) is a Phase 1 tooling item; the full admin console (Release 10) can later absorb it.

## Risks to the schedule

- **Reviewer availability** (mitigation: a named reviewer per subject before drafting starts; chapters queue while waiting; we never publish unreviewed text).
- **Renderer/diagram scope creep** (mitigation: build only the families the next chapters need).
- **Content volume** (mitigation: ship by subject, price founding, reuse snippets).
- **Protection false positives annoying legitimate readers** (mitigation: thresholds are configuration; start soft; monitor).
