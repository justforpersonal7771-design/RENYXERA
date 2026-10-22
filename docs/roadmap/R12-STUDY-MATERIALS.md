# Release 12 — Study materials (separate paid product, P2)

*Detailed task plan. Full programme: `../study-materials/00-README.md` … `12-REFERENCE-LIBRARY-AND-DESIGN-RESEARCH.md`. Blocking owner decisions: S1 (pricing), S4 (reviewer). Others have defaults (`../OPEN_DECISIONS_FOR_YOU.md`).*

## R12-A · Phase 0 — foundations and one reference chapter

### A1 · Coverage matrix (CS)
What: one table per subject: syllabus topic × PYQ weight (marks, frequency, trend) × reference coverage (which textbook chapters cover it).
How: `scripts/study/coverage.py` reads `data/pyq/CS/syllabus.json`, CS tags and a hand-made reference map (`data/study/CS/references.json`, chapter titles only, no copied text).
Done when: CSV + markdown report; topics with high PYQ weight and thin coverage flagged.
Refs: `../study-materials/02-SYLLABUS-AND-STRUCTURE.md`, `12-…`.

### A2 · Content format
What: lessons as structured JSON/MDX blocks: heading, paragraph, definition, theorem, equation (TeX), code (language), table, diagram (data → SVG), flow (steps), callout (trap/tip), worked example (steps), check-yourself (question + answer), linked PYQs (ids), go-deeper (reference).
Done when: JSON schema in `lib/study/schema.ts`; validator script; sample lesson passes.
Refs: `04-CONTENT-FORMAT-AND-RENDERING.md`, `05-DIAGRAMS-TABLES-AND-FLOWS.md`, `templates/chapter-template.md`.

### A3 · Renderer
What: `components/study/lesson-renderer.tsx` rendering every block in the app's design (light/dark, mobile), MathJax, light highlighter (R15-A2), SVG diagrams from data.
Done when: the sample lesson renders identically to the design review on desktop/mobile × light/dark.

### A4 · Protection
What: deter copying without hurting reading.
How: content delivered from `/api/study/lesson` only to entitled users, per-lesson encryption with a per-session key (reuse the Downloads vault pattern), visible + invisible per-account watermark, copy/print/save-page produce blank or watermark-only output, rate limit per account per day, no static files of lesson content.
Done when: copying text, printing, "save page" and view-source show no usable lesson text; normal reading unaffected; limits logged.
Refs: `07-PROTECTION-AND-SECURITY.md`, `lib/vault/`.

### A5 · Reference chapter "Deadlock" (CS · Operating Systems)
Lesson skeleton per topic: why it matters (GATE weight) → intuition → exact statement → worked example (our numbers) → common traps → check yourself (3–5) → linked PYQs → go deeper. Topics: conditions, resource-allocation graph, prevention, avoidance (Banker's with step tables), detection, recovery, GATE patterns.
Done when: S4 reviewer signs off; every number recomputed by script; no text overlap with references (overlap check).
Refs: `06-LEARNING-DESIGN.md`, `03-CONTENT-PIPELINE.md`, `11-QA-CHECKLISTS.md`.

### A6 · Entitlement and checkout
What: `study_pass_<branch>` entitlement (S1 model), Razorpay order + verify + receipt (reuse billing code), refund text in `/refunds`.
Done when: test purchase in Razorpay test mode unlocks lessons; receipt shows the product.

### A7 · Go/no-go review with the owner
Show the sample on phone and laptop; decide Phase 1.

## R12-B · Phase 1 — CS pilot (three subjects)
Subjects chosen by coverage matrix (suggest OS, DBMS, Algorithms). For each: lessons for every syllabus topic, cheat-sheet per chapter, flashcards per lesson, topic page links ("Study this topic" on `/topics/*` and in mistakes).
Done when: three subjects complete, reviewed, live behind the pass; analytics of reading time and check-yourself scores.

## R12-C · Phase 2 — complete CS and launch
All CS subjects; launch campaign (R14); pass on the Plans page and inside topic pages; free preview of the first lesson of each subject (SEO + conversion).

## R12-D · Phase 3 — other branches (S2 order) and yearly March review.

## Business notes
Pricing options and introduction sequence: `08-PRODUCT-AND-PRICING.md`. Risks and edge cases: `10-EDGE-CASES-AND-RISKS.md`. Timeline: `09-ROADMAP-AND-PHASES.md`.
