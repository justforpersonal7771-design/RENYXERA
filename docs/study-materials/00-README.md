# Study Materials programme: master plan (index)

**Status:** planning, nothing built yet. Written 17 October 2026.
**One-line goal:** for every branch we serve, the best GATE study material a student can find in one place, written for understanding and for remembering, structured exactly like the official syllabus, rendered perfectly (equations, code, tables, diagrams, flowcharts), and available only inside the app.

This is a separate product. It is **not** part of Free, Plus or Pro. Plans and pricing are in `08-PRODUCT-AND-PRICING.md`.

## How to read this plan

| Doc | What it decides |
|---|---|
| `01-VISION-AND-PRINCIPLES.md` | What "great" means here, the promises we make to students, what we refuse to do |
| `02-SYLLABUS-AND-STRUCTURE.md` | The content tree (branch → section → subject → chapter → topic → lesson), IDs, ordering rules, per-branch coverage maps, how it follows the official GATE syllabus |
| `03-CONTENT-PIPELINE.md` | How a chapter is actually produced: sources, drafting, fact-checking, review gates, versioning, who does what |
| `04-CONTENT-FORMAT-AND-RENDERING.md` | The authoring format, every block type (equation, code, table, diagram, flow, example…), the renderer, and the exactness rules |
| `05-DIAGRAMS-TABLES-AND-FLOWS.md` | How diagrams, tables and flowcharts are authored so they are exact, accessible and impossible to copy as image files |
| `06-LEARNING-DESIGN.md` | The teaching method: how each topic is written so students understand and remember it |
| `07-PROTECTION-AND-SECURITY.md` | What "secured and protected" can honestly mean, the layers we build, and the limits |
| `08-PRODUCT-AND-PRICING.md` | Why it sits outside the plans, pricing options, launch order, how it is introduced |
| `09-ROADMAP-AND-PHASES.md` | Phases with exit gates, effort estimates, the CS pilot, branch order, March refresh cycle |
| `10-EDGE-CASES-AND-RISKS.md` | Every edge case and risk we could think of, with the planned handling |
| `11-QA-CHECKLISTS.md` | The per-topic, per-chapter and per-release checklists used as hard gates |
| `12-REFERENCE-LIBRARY-AND-DESIGN-RESEARCH.md` | Review of the reference notes and textbooks in `notes/`, what we adopt from them, suggested textbooks per subject, and the hard rules for using them |
| `templates/chapter-template.md` | The exact skeleton every chapter starts from |

## Decisions I need from you (before Phase 0 starts)

1. **Pricing model**: one-time pass per branch, subscription, or per-subject packs? (recommendation: one-time per-branch pass, see 08)
2. **Launch order after CS**: recommended EC → EE → ME → CE → DA (follows our bank sizes and audience); confirm or reorder.
3. **Sources rule**: confirm the originality rule in `03` and `12` (we learn from textbooks and may look at coaching notes for design and coverage only; we never copy wording, figures or examples; the `notes/` folder stays out of git).
4. **Human expert review**: confirm who reviews technical accuracy (you, a friend, a paid tutor per subject). This is the single biggest quality lever.
5. **Language**: English only at launch (recommended), Hindi later?
6. **Phase 0 sample**: approve building one complete reference chapter (CS: "Deadlock") end to end before committing to the whole programme.

## The honest summary (what makes this hard)

- Volume: CS alone is ~15 syllabus subjects, ~110 chapters, ~600 topic lessons. Eight more papers repeat that pattern. This is a multi-month content effort even with AI doing the drafting, because **review is the bottleneck, not writing**.
- Accuracy: a wrong formula in a paid study material is worse than no material. The whole pipeline is built around catching errors before students see them (see `03` and `11`).
- Protection: no web page can be made "impossible to obtain". What we can do is make casual copying useless, bulk copying hard and slow, and every leak traceable to an account (see `07`). Where a student's own screen is concerned, a camera always wins; we say that plainly.
