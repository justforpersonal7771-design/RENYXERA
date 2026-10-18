---
name: project-ui-ux-pass-state
description: "GATE OS UI/UX animation pass progress — screens done, screens remaining, and a confirmed real bug found mid-audit (markdown tables render as raw pipe text)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0fbdddba-c181-434e-9c11-2c21a6006f9e
  modified: 2026-09-17T20:35:41.051Z
---

Ongoing task: systematic UI/UX animation/interaction pass across "all screens and modules and components and everything" in GATE OS (repo at D:\0-UI\r2ma-stable — see [[project_repo_location]]), per explicit user mandate. Module C (AI Mentor Engine) work is explicitly paused until the user says to resume it — do not start it unprompted.

**Committed this session (all local-only, not pushed — see [[project_zero_budget_constraint]] and the standing "commit locally only, no push unless explicitly requested" rule):**
1. AI Mentor Dashboard animation pass (header, gradient hero coach card, staggered metrics, diagnostics AnimatePresence, timeline stagger).
2. Exam Setup page animation pass (sliding tab-pill, staggered AI-question groups, height-animated question expand, blueprint panel crossfade).
3. Calendar/To-Do quick-panel headers upgraded to the gradient-hero language (indigo→purple + blur orb) matching Results/Dashboard/AI Mentor.
4. Fixed Review Navigator grid highlight clipping bug (scale-105 + ring was clipped by scroll container's missing vertical padding on row 1) — user reported this via screenshot, confirmed fixed.
5. Dashboard (`app/(dashboard)/page.tsx`) had ZERO motion usage despite being the landing screen — added staggered metric cards + AnimatePresence session banner. User was right that this page hadn't actually been touched.
6. `components/dashboard/github-heatmap.tsx` — found and fixed a missed instance of the `toISOString().split('T')[0]` UTC timezone-shift bug (same class of bug fixed elsewhere in streak-engine/snapshot-engine earlier this project); added motion.
7. Analytics page also had ZERO motion — added full stagger pass (header, HUD cards, insights feed, chart panels, weak/strong topic table rows).
8. `revision/session/page.tsx` — found and fixed a real bug: it never called `loadStudyData()`, so bookmarks/mistakes only populated when the user arrived via client-side nav from `/revision`; a direct link or refresh showed a false "No Questions Found" even with real data on disk. Reproduced 100% via direct Playwright navigation, fixed by adding the same mount-effect pattern used elsewhere. Also added the missing "Explain with AI Tutor" deep-link button to this screen (pattern: `router.push(\`/ai-tutor?qid=${id}\`)`, matches Mistakes/Bookmarks/Setup/Revision-list/Review).

**UNRESOLVED — found mid-audit, needs investigation next session:**
Markdown pipe-table syntax in question text (e.g. `GATE_CS_2025_AN_Q8` in the real dataset — search raw JSON for `/\|[-:\s]+\|/` to find the ~3 affected questions) renders as **raw literal pipe-character text** instead of an actual HTML table. Confirmed via screenshot at `/ai-tutor?qid=GATE_CS_2025_AN_Q8` — the question body shows literal `| Iteration ( i ) | 0 | 1 | 2 | 3 |` text instead of a table. This means the AST tokenizer/parser (the FSM pipeline that turns `question_text` into `contentAst` for `AstNodeRenderer`) does not recognize markdown table syntax as a `table` node type at all — it's not a rendering-layer bug, it's a parser-coverage gap. Needs: find the tokenizer/parser source (likely under `lib/` — search for the AST node "type" union e.g. in `types/question.types.ts` or wherever `AstNodeRenderer`'s switch statement is, to confirm whether a `table` node type even exists in the schema), then add table-syntax detection to the tokenizer if it's genuinely missing.

Initially I also suspected the 4 answer options on that same question were rendering completely blank (looked empty in a full-page screenshot) — investigated deeply with DOM/computed-style/font-loading checks and a `clip`-region zoomed screenshot, and this turned out to be a **false alarm**: a timing race in my own Playwright test script (full-page screenshot taken before MathJax's CHTML output finished, not a real user-facing bug — a clipped zoom screenshot taken with more wait time showed the LaTeX rendering perfectly). Do not re-flag the options as broken; only the table syntax is a confirmed real bug.

**Still pending from the broader mandate (not yet done):**
- Fix the markdown-table parser gap above.
- Exam Results Review page: already has decent motion from earlier work, lower priority for further polish.
- Rename `Aggregated_Output.json` to a more appropriate filename — user explicitly permitted this, requires updating `store/use-data-store.ts` default URL param and any manifest-generation scripts. Not started.
- Audit image/code rendering more broadly across Mistakes Bank/Bookmarks/Revision screens specifically (only spot-checked via AI Tutor page this session; image and code-block rendering both looked correct there).
- Hardcoded 3-hour exam timer fallback (`components/exam/exam-timer.tsx` line ~30, `if (!currentDraft) return 10800`) — known, unaddressed, low priority since it only triggers when no draft exists.
- `design-system/*.ts` dead code (zero imports) and `PersonalNotesDrawer` unused-component duplication — flagged in earlier audits, still not addressed, low priority.

**How to resume:** pick up at "find the tokenizer/parser source" above as the next concrete action, then continue the remaining UI/UX pass items. Keep holding off on Module C.
