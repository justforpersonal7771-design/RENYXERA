# 11 · QA checklists (hard gates)

A box that is not ticked means the item does not ship. Scripts tick what they can; humans tick the rest and sign the review record.

## 1. Topic checklist (every lesson)

**Structure**
- [ ] Has hook, intuition, exact statement, at least one worked example, at least one trap, gate-note, recall card, 3 to 5 check questions, references
- [ ] Reading time 4 to 10 minutes (auto-calculated); if longer, split
- [ ] Syllabus citation present; prerequisites listed and resolvable
- [ ] Difficulty tier set (foundation / core / advanced)

**Accuracy**
- [ ] Every equation compiles; every symbol is defined in the symbol table; units present
- [ ] Every worked example has a `verify` script and the script output equals the text
- [ ] Every code block ran; shown output equals real output; platform assumptions stated
- [ ] Every table recomputes (totals, units consistent)
- [ ] Every diagram validated (structure, labels, text equivalent, contrast)
- [ ] Every standards-based fact (RFC, IS code, constants) has a citation
- [ ] Independent re-solve of examples and check questions agrees
- [ ] Notation and terminology follow the style guide (lint green)

**Teaching quality**
- [ ] The intuition makes sense to a student who has only the prerequisites
- [ ] Analogies have their limits stated
- [ ] The trap shows the wrong answer, why it tempts, why it fails, and the protecting rule
- [ ] The shortcut states its validity condition
- [ ] The recall card is under 60 words, correct and reversible
- [ ] Check questions include recall, apply, trap-aware and a GATE-style item; each explanation says why wrong options are wrong

**Exam link**
- [ ] The PYQs of this topic are linked (auto from tags) and at least one worked example is a real GATE question (cited) where one exists
- [ ] The gate-note frequency matches the bank (auto-check)

**Originality**
- [ ] Overlap check passed; examples are ours; figures drawn from data

## 2. Chapter checklist

- [ ] All topics pass §1
- [ ] Chapter overview, concept-flow (prerequisite) picture and summary exist
- [ ] Chapter recall sheet generated; chapter-end mixed check (interleaved) present
- [ ] Topic order respects prerequisites; no forward reference without a link
- [ ] No two topics duplicate each other; cross-links resolve
- [ ] Review record complete: reviewer, date, version hash, all technical comments closed
- [ ] Student-view pass done: desktop and mobile, light and dark, no overflow, diagrams legible
- [ ] Protected-bundle build succeeds; the DOM contains no protected words (canary test)

## 3. Subject checklist

- [ ] Every official syllabus item of the subject maps to at least one published topic
- [ ] Every PYQ tag of the subject maps to at least one topic
- [ ] Subject cheat sheet generated and reviewed
- [ ] Notation consistent across chapters; glossary entries complete
- [ ] Block analytics baseline captured; the first-week watch plan is set

## 4. Release checklist (per release)

**Content**
- [ ] Coverage reports: 100 % syllabus, 100 % PYQ tags for what is being released
- [ ] Defect log: no open P0/P1 items
- [ ] Version and content hash recorded; changelog entry written

**Protection** (red-team suite in CI and on production)
- [ ] `curl`/scrape of every protected URL returns only ciphertext or the app shell
- [ ] Zero protected words in the DOM (canary phrase search)
- [ ] Copy, select, context menu, drag inert
- [ ] Print and "Save as PDF" blank
- [ ] Focus loss blanks the lesson
- [ ] Watermark decoder recovers the account ID from a screenshot
- [ ] Rate caps and dwell limits enforced for a scripted account
- [ ] Key endpoint refuses non-entitled accounts and expired access
- [ ] Offline vault works and expires correctly

**Commerce**
- [ ] Purchase → webhook → access → read works in test mode and in live mode
- [ ] Refund drill revokes access and keys
- [ ] Receipt, coupon, bundle discount behave
- [ ] Pricing, refund and terms pages updated

**Platform**
- [ ] Typecheck, lint, build green; e2e smoke green; the Playwright matrix (desktop + mobile, light + dark) green
- [ ] Core Web Vitals within the existing budget for the study pages
- [ ] Service worker does not cache protected content in plain form
- [ ] Accessibility: keyboard navigation, focus, contrast, reduced motion, assistive mode works

**Operations**
- [ ] Support runbook and hotfix path rehearsed
- [ ] Monitoring: reads per account, flags, key failures visible
- [ ] Rollback pointer tested

## 5. After release (first 30 days)

- [ ] Daily: new error reports triaged within 24 h; confirmed errors fixed within 48 h
- [ ] Weekly: block analytics review; the three worst topics get rewrite tickets
- [ ] Day 30: report to you: errors per 50 topics, completion, conversion, leak flags, support load, review throughput, next-release estimate

## 6. The "no known issue" rule

If any item above is unticked and the reason is "we'll fix it later", the release does not go out. The checklists are the definition of done.
