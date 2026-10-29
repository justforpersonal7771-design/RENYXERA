# Release 22: Arena, one place for Mocks and the Exam engine

*Owner document, 29 Oct 2026. Written for Adil. Status: plan only. Starts after the AI Mentor release (R21). Nothing here is built.*

## 1. Why merge

Today the same job (take a timed test) is split across two navbar items and several routes, and the student has to know which door to use:

| Today | What it is | Routes |
|---|---|---|
| Exam Setup | Build your own test: source (PYQs, Forge, Spark, Blend), type, subjects, flashcards | `/setup`, `/exam/session`, `/exam/results`, `/exam/results/review` |
| Mocks | Scheduled All-India mocks and full-length papers | `/mocks`, `/mocks/results`, `/fresh-mock` |
| Side doors | Challenge a friend, checkpoint, revision, mistakes tests | `/challenge`, `/checkpoint`, `/revision` |

The sessions, timer, palette, results and review are already shared code. Only the front doors and the naming differ. One section removes a decision the student should not have to make and makes room for the Forge and Spark sources to sit next to mocks.

## 2. Name

Recommended: **Arena**. Short, fits the Battles and leaderboard idea, and covers "where you are tested". Alternatives: **Test Centre** (clear, plain), **Trials**. The label is set in one place (`lib/arena/brand.ts`, to be created) so it can change in a minute.

## 3. The new section (one navbar item, one hub screen)

```
Arena
 +- Start      what to do now (rule-based, shared with the Mentor's next actions)
 +- Build      custom test: source, type, subjects, length (today's Exam Setup)
 +- Mocks      All-India mocks, full-length papers, Forge Mocks (today's Mocks + fresh mock)
 +- Practice   topic drills, mistakes test, revision, flashcards
 +- History    every attempt, results, review, retry, share
```
Hub screen: a bento of five doors with live state ("All-India mock in 2 days", "10 mistakes due", "last test 62%"), one primary button for the best next test, and a recent-attempts strip. Mobile: the five doors become a segmented control under the title; the bottom bar keeps "Practice" pointing here.

Routes (old ones redirect, so links, bookmarks and Telegram messages keep working):

| New | Replaces |
|---|---|
| `/arena` | `/setup` landing, `/mocks` landing |
| `/arena/build` | `/setup` |
| `/arena/mocks`, `/arena/mocks/[id]` | `/mocks`, `/fresh-mock` |
| `/arena/practice` | `/revision`, `/checkpoint`, topic drills |
| `/arena/history`, `/arena/history/[id]` | `/exam/results`, `/mocks/results`, `/exam/results/review` |
| `/arena/run` | `/exam/session` (one runner for every test kind) |

## 4. Code reorganisation

One feature folder instead of pieces spread across `app/(dashboard)/exam`, `setup`, `mocks`, `components/exam`:

```
features/arena/
  model/        types: TestKind (custom | mock | forge-mock | revision | challenge | checkpoint), TestConfig, Attempt, Result
  engine/       session store, timer, grading client, palette state (today's use-exam stores and lib/exam)
  build/        source mixer, subject picker, blueprint, flashcards (today's setup components)
  mocks/        schedule, countdown, embargo and result release rules
  run/          question screen, palette, calculator, submit dialog, tab-switch guard
  results/      score, analysis, review, share card
  hub/          the Arena screen
```
Type cleanup that this enables:
- One `TestKind` and one `TestConfig` instead of separate shapes for custom tests, mocks, challenges and checkpoints.
- One `Attempt` record (IndexedDB and `exam_attempts` already mirror each other), with `kind` and optional `mockId`.
- Source (PYQ, Forge, Spark, Blend) stays a property of the question list, not of the screen.
- Server routes keep their paths (`/api/exam/start`, `/api/exam/grade`, `/api/answers`); only the client moves. No migration is needed for the rename.

## 5. Experience upgrades that come with the merge

- A single "Start" button that picks the right test (due mock, else mistakes, else a weak-topic drill) and explains why.
- Mock countdown and reminders on the hub, not hidden on a separate page.
- One history with filters (kind, source, subject, date) replacing the three result lists.
- Results screen identical for every kind, plus kind-specific extras (rank for mocks, friend score for challenges).
- Everything on the shared pastel system, desktop and phone, light and dark.

## 6. Phases

| Phase | Deliverable | Risk |
|---|---|---|
| A1 | Rename and hub: `/arena` landing with redirects from old routes; navbar and bottom bar updated | Low: no logic moves |
| A2 | `features/arena` skeleton; move the runner (`/exam/session`) and stores with imports updated | Medium: largest diff; guarded by the existing smoke test |
| A3 | Merge Build and Mocks screens; one `TestConfig` | Medium |
| A4 | History: one list, one result and review route | Medium |
| A5 | Practice door (revision, checkpoint, drills) and the Start button | Low |
| A6 | Delete the old routes and dead code; update docs, sitemap, Telegram deep links, SEO redirects | Low, but check every external link |

Done when: the old URLs all redirect, the CI smoke test (guest exam flow on phone and desktop, light and dark) passes unchanged, `check:grading` and `check:mock-order` pass, no screen is reachable only through an old route, and the audit script shows no new contrast or overflow findings.

## 7. Open choices for the owner

1. The name (Arena, Test Centre or Trials).
2. Keep "Exam Setup" wording anywhere (SEO pages use it) or rename everywhere?
3. Should Battles live inside Arena later, or stay its own item? (Recommended: stay separate until Battles is live.)
