# RENYXERA Forge — original GATE-level questions and mocks (design)

**Status:** design, 6 Oct 2026. Build starts after each branch's past papers (PYQs) are transcribed and tagged. The order is set by the user: PYQs first, then Forge.
**Name:** **Forge**. Questions are "Forge questions"; the daily set is the "Daily Forge"; mocks are "Forge Mocks". The name is a working title and can be changed in one place, `lib/forge/brand.ts`.

---

## 1. Goal

Original questions for every branch that:
- are at GATE level or harder;
- test application, multiple concepts and current trends, not recall;
- cover the whole official syllabus, weighted the way GATE actually weights it;
- each has one verified answer.

They feed three things:
1. **Daily Forge:** a fresh set every day, per branch.
2. **Forge practice:** a pool you can filter by subject, topic, difficulty and question kind.
3. **Forge Mocks (All-India):** full 65-question, 100-mark papers built only from fresh Forge questions, with no PYQs.

Not a goal: AI questions generated live at runtime in the app. Forge questions are authored, verified and versioned ahead of time, so the app only ever serves checked items.

---

## 2. Principles (the quality bar)

| # | Rule | Why |
|---|---|---|
| P1 | **One correct answer, proven.** Every answer is independently re-solved, and numerical answers are computed by a script | A wrong key destroys trust faster than anything |
| P2 | **Original.** No paraphrase of a PYQ; the numbers, setting and reasoning path all differ. A similarity check runs against the whole PYQ corpus | Legal safety and real practice value |
| P3 | **GATE-shaped.** Same question types (MCQ / MSQ / NAT), marks (1 / 2), negative marking, notation and NAT answer ranges | The exam feel is the product |
| P4 | **Grounded in the syllabus.** Every item is tagged to the official syllabus with the same codes as PYQs (`tags/*.tsv`) | Coverage and analytics work the same for both |
| P5 | **Trend-aware.** Topic and question-type mix follows recent papers (weighted towards the last 3 years) | Mocks should feel like next year's paper, not 2017's |
| P6 | **Harder by design, not by obscurity.** Difficulty comes from combining concepts, multiple steps and close distractors; never from trick wording or out-of-syllabus facts | Fair and teachable |
| P7 | **Measured after release.** Real attempt data recalibrates difficulty. Bad items (low discrimination, reports) are pulled automatically | Quality improves over time |

---

## 3. Inputs (why the PYQs come first)

For each branch:
- **PYQ corpus:** `data/pyq/<PAPER>/gate_<paper>_pyqs.json`, all questions with answers and figures.
- **Tags:** `data/pyq/<PAPER>/tags/*.tsv`, giving subject, topic and difficulty per PYQ.
- **Syllabus:** `data/pyq/<PAPER>/syllabus.json`, the closed topic list.
- **Derived statistics** from `scripts/forge/profile.py`, saved as `data/forge/<BR>/profile.json`:
  - marks per subject and per topic, per year, with a weighted trend slope;
  - question-type mix per subject (MCQ/MSQ/NAT) and per marks value;
  - difficulty spread per subject;
  - **coverage gaps**: syllabus topics with no PYQ in 6 years. These are prime candidates for Forge, because GATE eventually asks them;
  - **archetype mining**: recurring reasoning patterns per topic (for example "find the transfer function from a pole-zero plot and evaluate at a point"). These are recorded as short abstract templates, never as copied text.

So the generator works with the complete context of the past papers, but writes new questions.

---

## 4. Question kinds (archetypes)

Every item has one primary kind, which is used for the mix and for analytics:

| Kind | Description |
|---|---|
| `application` | A real engineering setting needs the concept applied (circuit, protocol, structure, dataset) |
| `multi_concept` | Two or more syllabus topics must combine to solve it |
| `trend` | Built on a pattern rising in recent papers (profile slope above 0) |
| `gap` | Tests a syllabus topic GATE hasn't asked recently (coverage gap) |
| `numerical_chain` | A NAT with 3 or more dependent steps, checked by script, with a tolerance range |
| `msq_discriminator` | An MSQ whose options separate partial from full understanding |
| `data_interpretation` | Reading tables, plots or waveforms (GA and core) |
| `conceptual_trap` | Distractors built from the 2–3 most common misconceptions (from our mistake analytics once enough data exists) |

Difficulty is set on GATE's scale: **M** (typical GATE), **H** (top-10% GATE question) and **X** (harder than GATE, for Pro "challenge" sets). Easy questions are not generated; PYQs cover that level.

---

## 5. Authoring pipeline (per batch)

Each batch is authored by Claude in work sessions, like the PYQ pipeline, and runs on $0.

```
blueprint → brief → draft → blind re-solve → compute → review → dedupe → render → approve → queue
```

1. **Blueprint:** `scripts/forge/plan.py <BR> --n 60` picks (topic, kind, difficulty, type, marks) slots from the profile, weighted by trend plus a gap bonus, balanced against what's already in the pool.
2. **Brief:** each slot becomes a short spec: topic, kind, the concepts it must combine, the misconception distractors, and type and marks.
3. **Draft:** written in the same JSON schema as PYQs, with TeX math. Figures are drawn as SVG (circuits, plots, graphs), never copied.
4. **Blind re-solve:** a separate pass solves the question without seeing the key. A disagreement sends it to fix or discard.
5. **Compute:** every NAT and every numeric MCQ gets a small `verify` Python snippet stored with the item; `forge_validate.py` runs it and checks it falls inside the key's range. Ranges follow GATE's rounding conventions.
6. **Review:** checks for:
   - more than one correct option;
   - unstated assumptions;
   - unit or notation slips;
   - anything outside the syllabus;
   - an MSQ whose answer is obvious from the option wording.
7. **Dedupe:**
   - text and number similarity against all PYQs and all existing Forge items, using shingles plus number fingerprints;
   - fails above the threshold, so the item is rewritten.
8. **Render:** `render-check.ts` (the existing PYQ checker) with MathJax and SVG, on desktop and mobile, in light and dark.
9. **Approve:** written to `data/forge/<BR>/items/<batch>.json`, with tags in `data/forge/<BR>/tags/<batch>.tsv` (same format as PYQ tags).
10. **Queue:** given a `release_at` slot (§7).

**Item schema:** the PYQ schema plus these fields:
```json
{ "question_id": "FORGE_EC_000123", "source": "forge", "kind": "multi_concept", "difficulty": "H",
  "syllabus": { "code": "CS.3" }, "inspired_by": ["GATE_EC_2024_Q41"],
  "verify": { "lang": "python", "code": "…", "expect": [12.4, 12.6] },
  "solution": { "steps": ["…"], "shortcut": "…" },
  "version": 1, "status": "approved", "created": "2026-10-20" }
```
- `inspired_by` is internal only, for audit. It never shows to users.
- Every item ships with a **full worked solution**, so Forge questions need no AI call to explain.

---

## 6. Storage and serving

- **Postgres** (migration `00xx_forge.sql`):
  - `forge_items`: public half (text, options, tags, kind, difficulty, branch, `release_at`, `status`).
  - `forge_answers`: private half (key, ranges, solution). RLS has no policies; it is unlocked only through `/api/answers`, as PYQs are today.
  - `forge_item_stats`: attempts, p-value, discrimination, average time, report count.
- **Unreleased items are invisible.** The public select policy is `release_at <= now()`, so future Daily Forge and mock questions cannot be scraped early.
- **Mock items** are not in the static bank. They are served from the DB at mock time with the existing embargo (`0013_mock_paper_embargo`).
- **Static bank:** released practice items go into `public/data/<CODE>/forge.json`, without answers, so offline practice works like PYQs.
- **Seeding:** `scripts/forge/seed.mjs --branch ECE` loads approved items into the DB.

---

## 7. Daily Forge

- **Size:** 10 questions per branch per day: 3 × 1-mark and 7 × 2-mark, mixed types, covering at least 4 subjects.
- **Release:** at 06:00 IST. Today's set is visible to everyone; answers unlock after you submit.
- **Streak and points** feed a Daily Forge leaderboard per branch, which reuses `board()` with scope `forge_daily`.
- **Free vs paid:** free users get today's set; Plus/Pro get the archive of every past day plus Forge practice filters.
- **Buffer rule:** at least **30 days** of approved items must be queued per live branch. A CI check fails if the queue is shorter than 14 days. Authoring sessions keep it topped up, so "daily" never depends on someone being online.

---

## 8. Forge Mocks (All-India)

- **Pattern:** exactly GATE's.
  - 65 questions, 100 marks, 180 minutes.
  - GA 10 questions (15 marks).
  - Engineering maths about 13 marks, core the rest.
  - The MCQ/MSQ/NAT mix follows the branch's last 3 papers.
- **Composition:**
  - only **fresh, never-released** Forge items;
  - difficulty band of about 30% M, 55% H, 15% X;
  - subject marks within ±2 of the trend profile;
  - no two items from the same archetype on the same topic.
- **Builder:** `scripts/forge/build-mock.mjs --branch ECE --date 2026-11-08` picks items, freezes them into `mock_events` with a fixed `release_at`, and marks them `reserved`.
- **After the mock:** items become part of the practice pool and the archive.
- **Scoring:**
  - same grading as today;
  - ranks per branch;
  - a predicted GATE-score band once enough candidates exist, calibrated against the branch's PYQ-based score tables.
- **Schedule:** weekly per live branch (Sunday 10:00 IST), plus subject mocks (25–30 marks) mid-week. Scheduling starts only once a branch has 3 mocks' worth of reserved items.

---

## 9. Calibration loop (after release)

- `forge_item_stats` is updated nightly from graded attempts.
- An item with **p-value** below 0.05 (almost nobody gets it right) or above 0.95, or **discrimination** below 0.1, after 50 or more attempts, is auto-flagged for review and hidden from new mocks.
- **Reports:** 3 or more "wrong answer" reports hide an item until it is reviewed. Re-verification runs the stored `verify` code again.
- The difficulty label is replaced by measured difficulty once enough attempts exist.
- Measured data feeds back into the planner. Topics where users are weak get more items, and that is reflected in the next blueprint.

---

## 10. App surfaces

| Screen | Change |
|---|---|
| Dashboard | **Daily Forge** card: today's 10 questions, streak, time left |
| Exam setup | Source switch: **Past papers / Forge / Mixed**; Forge filters by kind and difficulty |
| Question view | "Forge" badge, worked solution after submit, "Report an issue" |
| Mocks | Forge Mocks list per branch, registration, countdown, results and ranks |
| Analytics | Split by source (PYQ vs Forge); per-kind accuracy ("you lose marks on multi-concept questions") |
| Leaderboards | Daily Forge board per branch; mock boards as today |
| Pro page | Forge archive, challenge (X) sets and subject mocks listed as paid benefits |

---

## 11. Throughput and cost ($0)

- **Authoring:** Claude in work sessions, about 60 verified items per batch. There is no paid API.
- **Targets per branch before Forge launches there:** 300 practice items, 30 days of Daily Forge (300 items), and 3 mocks (195 items), about **800 items**. After launch, roughly 70 items a week keep Daily Forge plus one weekly mock running.
- **Order:** EC first, since its PYQs are done. Then each branch as its PYQs are finished; CS can start in parallel because its PYQs exist.

---

## 12. Rollout

1. `profile.py`, `plan.py`, `forge_validate.py`, the schema and the migration.
2. First EC batch of 60. Hand-check the whole batch, and tune the review checklist from what slips through.
3. Seed. Add Forge practice and the Daily Forge card, private to the owner only (beta flag).
4. Build up a 30-day buffer plus 3 mocks. Launch Daily Forge, then weekly Forge Mocks for EC.
5. CS next, then each new branch once its PYQs are tagged.

---

## 13. Open decisions (defaults chosen)

- **Name:** Forge (alternatives: Apex Set, Crucible).
- **X (harder than GATE)** items are for Pro only, and never more than 15% of a mock.
- **Daily Forge time:** 06:00 IST.
- **Mock day:** Sunday 10:00 IST, the same slot as before.
