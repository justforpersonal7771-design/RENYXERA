# 03 · Content pipeline: how a chapter is actually made

This is the accuracy engine. The rule: **nothing reaches a student that has not passed machine checks and a human review.** Writing is cheap; being wrong is expensive.

## 1. Roles

| Role | Who | Does |
|---|---|---|
| **Drafter** | Claude | Reads the sources for the topic, writes the lesson in the chapter format, generates diagrams/tables/flows as data, computes every number in examples by script |
| **Checker (machine)** | scripts | Schema validation, coverage, notation lint, TeX compile, code execution, diagram validation, link check, plagiarism-style overlap check |
| **Second pass** | Claude, fresh context | Independent re-derivation: re-solves every worked example and every check question from scratch without seeing the first solution, then diffs |
| **Expert reviewer** | a human (you, a subject tutor, a toppers' panel) | Technical accuracy, pedagogy, tone; signs the review record |
| **Release owner** | you | Approves publication and pricing |

The expert reviewer is the biggest quality lever. Recommendation: you review the CS pilot; for each later branch, one paid subject reviewer per 2 to 3 subjects (budget item, see 09).

## 2. Per-chapter production line (stages with exit gates)

| # | Stage | Output | Gate to pass |
|---|---|---|---|
| 0 | **Brief** | Chapter brief: syllabus refs, prereqs, PYQ tags and the actual PYQs (from our bank), weightage, depth, source list | You approve the brief (or I do for low-risk chapters, listed to you) |
| 1 | **Source study** | Notes of the standard textbook treatments (what each says, where they disagree), the official syllabus wording, and every PYQ on the topic | Every PYQ concept is accounted for |
| 2 | **Concept map** | The teaching order, the 3 to 5 key ideas per topic, the misconceptions to prevent | Order respects prerequisites |
| 3 | **Draft** | The chapter file in the format of `04` | Schema valid |
| 4 | **Computation pass** | Every example's numbers produced by a script that is stored next to the chapter (so anyone can rerun it) | Script output equals text |
| 5 | **Machine checks** | See §4 | All green |
| 6 | **Independent re-solve** | Second pass answers every example and check question blind | No disagreement (disagreements go back to 3) |
| 7 | **Expert review** | Review record with line-level comments | Zero open technical comments |
| 8 | **Student-view pass** | Read as a student on phone and laptop, light and dark; check layout, equation breaks, table overflow, diagram legibility | Looks right in the full test matrix |
| 9 | **Release** | Content hash and version stamped; goes live behind the paywall | You approve |
| 10 | **Watch** | First 30 days: error reports, drop-off by block, check-question accuracy | Fix or rewrite hot spots |

## 3. Sources (what we learn from, and the originality rule)

**Learn from** (cited in each chapter's *References*): the standard textbooks of each paper (for example for CS: Silberschatz for OS, Cormen/Sedgewick for algorithms, Korth for DBMS, Tanenbaum/Kurose for networks, Hennessy-Patterson for architecture, Ullman for TOC and compilers, Rosen for discrete maths; for the other branches the equivalents listed in the branch's source list), official syllabus PDFs, official GATE papers (ours: the question bank), standards documents where relevant (RFCs for protocols, IS codes for civil).

**Originality rule (non-negotiable):**
1. We re-explain ideas in our own words and our own structure. We never paste or lightly rephrase paragraphs.
2. Examples are **our own** numbers and scenarios. Where an example is a past GATE question, it is cited as that question (the paper is public, and our bank already shows it with attribution).
3. Figures are redrawn from scratch as data (SVG/flow definitions). We never trace or screenshot a textbook figure.
4. Definitions and theorems are facts and may be stated precisely, but with our wording where there is freedom; where an exact standard wording is the point (for example a protocol field name or an IS-code clause), we quote briefly and cite.
5. An automated **overlap check** compares each chapter's text against the source texts we hold notes for and against the web for long shared runs of words; any run over a small threshold is rewritten.
6. No content is taken from coaching-institute notes or paid course material, ever.

This protects us legally and, more importantly, produces a better explanation: the point of the product is to *redefine* the material for understanding.

## 4. Machine checks (all automatic, all must pass)

| Check | What it catches |
|---|---|
| **Schema** | Missing blocks (no intuition, no example, no recall), wrong block order, empty fields, bad IDs |
| **TeX compile** | Every equation compiled with the same engine as the app (KaTeX/MathJax); no render errors, no overflow beyond the column at 360 px |
| **Notation lint** | Banned variants, inconsistent symbols, unit missing on a physical quantity, "log" base ambiguity unflagged |
| **Code execution** | Every code block is run (C, C++, Python, SQL, Java as needed) in a sandbox; stated output must equal real output; every pseudo-code block is parsed by a small pseudo-code checker or explicitly marked `illustrative` |
| **Numeric verification** | Every worked example has a `verify` script that recomputes the final answer and the key intermediate values |
| **Diagram validation** | Node/edge lists parse; no dangling edges; labels exist; accessibility text present; contrast passes; no text smaller than the minimum |
| **Table validation** | Rectangular, headers present, units consistent, sums and totals recomputed |
| **Link check** | Every `prereq`, `see_also`, PYQ reference and syllabus ref resolves |
| **PYQ cross-check** | Every PYQ listed under the topic exists in the bank and carries that topic's tag |
| **Overlap check** | Long runs shared with source texts |
| **Reading-level and length** | Sentence length, jargon density, reading time within range |
| **Accessibility** | Every diagram has alt text and a text equivalent; headings are in order |

## 5. Versioning, review records and change control

- Content lives in git as structured files (`content/study/<branch>/<chapter>.json` plus `figures/` data and `verify/` scripts). Every published chapter has a **content hash**; the app serves a specific version and records which version a student read.
- A **review record** per chapter: reviewer, date, version hash, comments, resolution. No record, no release.
- **Hotfix path:** a student-reported error is triaged within 24 hours; a confirmed technical error is fixed and re-released within 48 hours, with a visible "corrected on <date>" note on the topic (we do not silently edit).
- **Reports** use the same "Report an issue" mechanism the questions have (`question_reports`), extended to topics.
- **Rollback:** a bad release is reverted by switching the served version pointer (no deploy needed).

## 6. Throughput and cost (honest estimate)

Per topic lesson (drafting + computation + checks): roughly 20 to 40 minutes of my time, plus the reviewer's time (10 to 15 minutes per topic for a fast, competent reviewer). For CS (~330 lessons) that is on the order of **150 to 250 hours of drafting/checking and 60 to 80 hours of expert review**, spread over many sessions. The plan therefore ships **chapter by chapter** (see `09`), not as one big release.

## 7. Where the content lives and how it is built

```
content/study/
  style-guide.md            notation, terminology, tone, examples naming
  <branch>/tree.json        the approved tree (see 02)
  <branch>/<chapter>/
     chapter.json           the lessons in the format of 04
     figures/*.json         diagram/flow/table data
     verify/*.py|.mjs       scripts that recompute examples
     review.json            review records
```

Build steps (`npm run study:build`): validate → compile TeX → run code/verify scripts → render figures to SVG → compute content hash → produce the **protected bundle** (see `07`). The raw files stay in the private repo; only the encrypted bundle is ever deployed.
