# Multi-Branch Design (Release 8A/8C)

**Status:** design, 5 Oct 2026. Development starts next turn; this file is the build plan and the acceptance checklist.
**Goal:** one RENYXERA account can prepare for any GATE paper we carry. A user sees **only their active branch**. They can switch branches freely, back and forth, and **never lose progress** in any branch.
**First new branch:** ECE (paper EC), 390 questions 2021–2026, all validated and tagged (`data/pyq/EC/gate_ec_pyqs.json`).

---

## 1. Requirements (from the user)

| # | Requirement | How this design meets it |
|---|---|---|
| R1 | Users see only their own branch; other branches' content is not visible in the app | Everything in the dashboard is scoped to `activeBranch`; nav, search, practice, review, analytics, mocks, leaderboards, AI and downloads all filter by it (§5, §7) |
| R2 | Other branches are not *accessible* either | Server APIs (exam start/grade, answers, AI, downloads, leaderboards) reject question ids or requests outside the caller's active branch (§6) |
| R3 | Users may switch to another branch | Profile → "Exam branch" switcher, with confirmation (§8) |
| R4 | Switch back and forth, no data loss | No data is ever deleted or rewritten on a switch. All progress is stored per branch, and switching only changes which partition is shown (§4) |
| R5 | Continue from where they left off | Per-branch "last state" (last route, last practice filters, in-progress exam) is restored on switch-back (§4.4) |

Non-goals for this release:
- Taking two branches at once in one view.
- Combined cross-branch analytics.
- Per-branch pricing. Pro stays account-level (§9).

---

## 2. Current state (audited 5 Oct 2026)

**Already branch-ready:**
- **Postgres:**
  - The `public.branches` table holds rows CSE, DA, ECE, EE, ME and CE, with `status` set to `live` or `coming_soon`.
  - `questions`, `exam_attempts`, `mock_events` and `branch_waitlist` all have `branch_code`.
  - `profiles.target_branch` has default `'CSE'` and a foreign key to `branches`.
- **Question ids already carry the paper:** for example `GATE_CS_2026_FN_Q1` and `GATE_EC_2024_Q7`. Every per-question record therefore already belongs to exactly one branch:
  - bookmarks and mistakes (IndexedDB plus `user_records`);
  - `user_question_state`;
  - AI cache and pregen;
  - question reports.
- **`lib/branches.ts`** has the catalogue (code, slug, paper, `live`) used by the landing pages and the waitlist.

**Single-branch today (must change):**

| Area | Where | Problem |
|---|---|---|
| Static bank | `scripts/copy-static-data.mjs` | Builds one `public/data/questions.json` from `data/Aggregated_Output.json` (CS only) |
| Image manifest | `data/image-manifest.json`, `scripts/generate-manifest.ts`, `public/images/<shift>/NN.png` | Keys are shift folders such as `2024-FN`, so EC `2024` would collide with CS keys. EC files are named `07_1.png`/`07_A.png` (multi-image and option images) |
| Client repository | `store/use-data-store.ts`, `lib/repository/question-repository.ts` | Hard-coded `/data/questions.json` |
| Exam server | `app/api/exam/start/route.ts:72,84`, `app/api/exam/grade/route.ts:134` | `branch_code: "CSE"` hard-coded |
| Seeding | `scripts/seed-questions.mjs`, `scripts/schedule-mocks.mjs` | CSE only |
| Onboarding / profile | `components/auth/onboarding-gate.tsx:105,204`, `app/(dashboard)/profile/page.tsx:49,147` | Branch fixed to CSE ("more branches coming soon") |
| IndexedDB aggregates | `lib/repository/storage/idb-manager.ts`: `ExamSessions`, `StudyMetrics`, `AnalyticsSnapshots`, `CustomTemplates`, `AiMemory` | Not keyed by branch, so aggregates would mix CS and EC |
| AI knowledge graph | `lib/ai/memory/KnowledgeGraph.ts` | Topic keys are the CS taxonomy |
| Calibration | `lib/calibration.ts` imports `data/calibration/cse/*` | No EC marks↔rank data yet |
| SEO PYQ pages, sitemap, Telegram | `lib/seo/pyq.ts`, `app/sitemap.ts`, `scripts/telegram-daily.mjs` | Read the single CS bank |
| Leaderboards | `practice_leaderboard()` and others (0014/0016/0023) | Practice boards are not filtered by branch |
| Naming | App code `ECE` vs paper code `EC` (`GATE_EC_*`, `data/pyq/EC`) | Needs one mapping (`BranchInfo.paper` already holds it) |

---

## 3. Core model

- **Branch code** is the app/DB code (`CSE`, `ECE`, `EE`, `ME`, `CE`, `DA`). **Paper code** is GATE's code (`CS`, `EC`, …) and is used in question ids and in the `data/pyq/<PAPER>` folder. `lib/branches.ts` is the single mapping (`code` ↔ `paper`), and nothing else may hard-code either.
- **Active branch** has two copies:
  - **Server truth:** `profiles.target_branch`, which RLS and the APIs read.
  - **Client mirror:** `useBranchStore` (zustand, persisted). It is initialised from the profile at sign-in, or from `localStorage` for guests (`renyxera_branch`), and defaults to `CSE`.
- **Selectable branches** are `branches.status = 'live'` **or** a user override flag (`profiles.beta_branches`) for internal testing before launch. A `coming_soon` branch is visible only on marketing pages (landing and waitlist).
- **Partition key:** every stored progress record gets `branch` (the app code). Per-question records also keep their question id, which is unique across branches.

---

## 4. Data partitioning: "no data loss" in detail

### 4.1 Rule
**A branch switch writes exactly one thing:** the new active branch. Nothing is deleted, migrated or recomputed. Every reader filters by the active branch, and every writer stamps the active branch.

### 4.2 IndexedDB (browser, offline-first)
- Bump the DB version in `idb-manager.ts` and add a `branch` index to `ExamSessions`, `StudyMetrics`, `AnalyticsSnapshots`, `CustomTemplates`, `Mistakes`, `Bookmarks`, `AiMemory` and `UserMutations`.
- **Upgrade migration:** existing rows get `branch: "CSE"`, because everything before this release is CS. Rows whose `questionId` starts `GATE_EC_` get `"ECE"`, and so on for each paper code.
- `QuestionCache` stays keyed by `question_id`. Cache entries for other branches are harmless and evicted normally.
- Every repository read gains a `branch` argument, taken from `useBranchStore`. **Store keys do not change**, so no row moves.
- `AiResponses` (keyed by prompt hash) and `AiGeneratedQuestions` (keyed by id) get the `branch` field for filtering only.
- `lib/hard-reset.ts`: "reset progress" becomes **per branch** by default, with an explicit "all branches" option.
- `scripts/check-isolation.mjs` is extended: the account and branch isolation tests must both pass.

### 4.3 Postgres (cloud copy)
New migration `0026_multi_branch.sql`:
- **`user_records`:**
  - Add `branch_code text not null default 'CSE' references branches(code)`.
  - Backfill from the key prefix (`GATE_EC_` → ECE).
  - Change the primary key to `(user_id, branch_code, kind, key)`.
  - The sync API sends and receives `branch_code`, and a pull fetches **all** branches, so a switch works offline.
- **`user_question_state`:** add `branch_code`, backfilled the same way, and index `(user_id, branch_code)`.
- **`exam_attempts` / `exam_responses`:** already have `branch_code`. The grade route stops hard-coding it.
- **`user_branch_state`** (new): `(user_id, branch_code)` primary key, with these columns:
  - `last_route`, `last_filters jsonb`, `in_progress_attempt uuid null`;
  - `started_at`, `last_active_at`;
  - `goal jsonb` — target rank, target score and daily hours become per branch;
  - `streak_days`, `last_study_date`.
  - RLS: owner only.
- **`branch_switches`** (new, append-only audit):
  - `(user_id, from_branch, to_branch, switched_at)`, RLS insert or select by the owner.
  - Used for support and abuse review, never for blocking.
- **`profiles`:**
  - `target_branch` stays and remains the active branch.
  - Add `beta_branches text[] default '{}'`.
  - The update policy from 0007 allows changing `target_branch` only to a `live` branch, or to one in `beta_branches`. Enforce this in a `before update` trigger, so the client cannot select a `coming_soon` branch.
- **Leaderboard functions** (`practice_leaderboard`, tiers and the rest) gain a `p_branch text` parameter, and every board is per branch. Mock leaderboards are already per mock, and mocks are per branch.

### 4.4 Continue where you left off
- On switch **away**, write `user_branch_state` (cloud) and `renyxera_branch_state:<code>` (local):
  - current route;
  - practice filters;
  - any in-progress exam session id. The session stays in IndexedDB, tagged with the branch, and its timer is paused if it is a practice session.
- On switch **back**, restore the saved route and filters. If there is an in-progress session, show the existing resume banner.
- Graded mocks keep the server timer, so a switch does not pause an official mock. The switcher warns about this and is blocked during a live All-India mock attempt.

### 4.5 What is account-level (shared across branches)
- Identity, username, avatar, college, phone and preferences such as theme.
- Pro entitlement and AI credits (§9).
- Referrals.
- Device sessions.
- The protected-downloads vault key. Packs inside the vault are tagged with a branch and listed per branch.

---

## 5. Question bank per branch

- **Source of truth per branch:**
  - CS: `data/Aggregated_Output.json` (unchanged).
  - Other branches: `data/pyq/<PAPER>/gate_<paper>_pyqs.json` plus `data/pyq/<PAPER>/images/<paper_id>/*`.
- **`scripts/copy-static-data.mjs`** loops over every branch with data. For each, it writes:
  - `public/data/<CODE>/questions.json` (answers stripped; the build fails on any leak, as today);
  - `public/data/<CODE>/image-manifest.json`;
  - images copied to `public/images/<CODE>/<year-shift>/…`.
  - For backward compatibility it also keeps writing `public/data/questions.json` for CS, until all readers move over.
- **Images:**
  - The manifest becomes `{ "<year-shift>": ["07_1.png", "07_A.png", …] }` per branch.
  - The `ImageResolver` gets `branch` and resolves `[IMAGE_Q_07_1]`, `[IMAGE_Q_07_A]` and the legacy CS `NN.png` names.
  - The image path is `/images/<CODE>/<shift>/<file>`.
  - CS images move to `public/images/CSE/…`, with a redirect from the old path so offline caches and SEO keep working.
- **Client repository:**
  - `use-data-store` loads `/data/${activeBranch}/questions.json`.
  - Each branch's compiled AST is cached under its own key.
  - On a switch, the old branch's data is dropped from memory. The service worker keeps it, so switching back is instant offline.
- **Postgres seeding:**
  - `seed-questions.mjs --branch ECE` reads the branch bank and writes `questions`, `question_options` and `question_answers` with `branch_code`, then updates `branches.question_count`.
  - It must also carry the per-question metadata from `gate_ec_pyqs.meta.json`: MTA status and review provenance.
- **Bank shape:** the EC bank already uses the CS shape (`exam_metadata.year-shift`, `section`, `subject`, `topic`, `difficulty`, `options[].is_correct`, `nat_answer_range`). The normaliser needs no change; `render-check.ts` proves it, with 390/390 clean.
- **Syllabus / taxonomy:**
  - `lib/syllabus/<CODE>.ts` is generated from `data/pyq/<PAPER>/syllabus.json`. For CS it comes from the existing topic list.
  - It drives subject and topic filters, analytics groupings and the AI knowledge graph.
  - `BranchInfo.subjects` (marketing) stays hand-written.

---

## 6. Server enforcement (R2)

- **Helper:** `lib/server/branch.ts` provides `getActiveBranch(userId)`, which reads `profiles.target_branch` with a 60-second in-memory cache per isolate, and `assertQuestionInBranch(qid, branch)`, which checks the paper-code prefix against `lib/branches.ts`.
- **Routes:**
  - **`/api/exam/start`:** builds the paper from `questions.branch_code = active` and stores `branch_code` on the attempt.
  - **`/api/exam/grade`:** reads `attempt.branch_code` (never the client), and rejects responses whose question id is outside it.
  - **`/api/answers`:** rejects unlock requests for question ids outside the caller's active branch, returning 403 `branch_mismatch`.
  - **AI routes** (`/api/ai/*`): the question context must be in the active branch. Quota and credits stay account-level.
  - **Downloads** (pack creation): limited to the active branch.
  - **Leaderboards and mocks APIs:** branch from the profile, never from the query string.
  - **Guests:** branch from the `renyxera_branch` cookie, validated against `live` branches.
- **Middleware:** if the profile branch is not `live` (for example after a branch is pulled back), redirect to the switcher. Routes are not prefixed by branch (no `/ece/...`), so URLs stay stable and other branches stay invisible.
- **Static JSON** under `/data/<CODE>/` remains technically fetchable, which is the same as today's CS public bank. It has no answers, and answers stay server-gated. This is acceptable and documented. The bank-protection measures from 5D apply per branch.

---

## 7. Screens affected (every one must be checked desktop + mobile × light + dark)

| Screen / component | Change |
|---|---|
| **Onboarding** (`components/auth/onboarding-gate.tsx`) | Branch picker of live branches with name and paper code. Remove "more branches coming soon" text when more than one is live. Writes `target_branch` and creates `user_branch_state` |
| **Header / sidebar** (dashboard layout) | Small active-branch chip, such as "ECE · EC", which links to the switcher. No list of other branches |
| **Profile → Exam branch** (`app/(dashboard)/profile/page.tsx`) | Switcher with a confirmation sheet: "Your CSE progress is kept. You can switch back any time." Blocked during a live mock. Goals section becomes per branch |
| **Dashboard home** (`app/(dashboard)/page.tsx`) | Stats, streak, "continue" card and recommendations for the active branch |
| **Setup / practice and exam builder** (`setup`, `exam`) | Year/shift, subject and topic filters from the branch syllabus. Custom templates filtered by branch |
| **Exam runner** | Branch name in the header. Starts carry the branch. Calculator and instructions are identical for every paper |
| **Review: bookmarks, mistakes, revision** (`(review)/*`) | Filtered by branch, and empty states mention the branch |
| **Analytics** (`analytics`) | Subject and topic breakdowns from the branch syllabus. The rank predictor uses branch calibration, or shows "Rank prediction for ECE arrives after official data" when none exists |
| **Calendar / goals** (`calendar`) | Per-branch goals and plan |
| **Mocks + leaderboards** (`mocks`) | Mock events listed by branch. Every leaderboard tab is per branch |
| **AI tutor / mentor** (`ai-tutor`, `ai-mentor`) | Knowledge graph and memory per branch. Prompts carry branch and subject names |
| **Downloads** (`downloads`) | Packs listed and created per branch |
| **Pro page** (`pro`) | Copy: "Pro covers every branch". No per-branch price |
| **Search / command palette** | Searches the active branch only. Recent searches keyed per branch (`gateos_recent_searches:<code>`) |
| **Marketing landing** (`app/(marketing)/[slug]`) | `live` flag drives "Start practising" vs "Notify me". The ECE page goes live with real counts |
| **About stats, sitemap, SEO PYQ pages** (`lib/seo/pyq.ts`, `app/sitemap.ts`) | Generated per live branch (`/pyq/gate-ece/2024/q7` style) |
| **Admin / scripts** | `seed-questions`, `schedule-mocks`, `telegram-daily`, pregen: all take `--branch` and loop over live branches in CI |
| **Account export / delete** (`/api/account/*`) | Export includes every branch, labelled. Delete removes every branch |

---

## 8. Branch switch flow

1. The user opens Profile → Exam branch, or the header chip. The list shows live branches only, with question counts.
2. They pick a branch. A confirmation sheet states that no progress is lost and offers Cancel / Switch. It is blocked if an official mock is in progress.
3. **On Switch:**
   1. Save the current branch's `user_branch_state` (local first, then cloud).
   2. `update profiles set target_branch` — the trigger validates a live or beta branch.
   3. Insert into `branch_switches`.
   4. `useBranchStore.set(code)`.
   5. Load `/data/<code>/questions.json`. It comes from the service-worker cache if seen before; otherwise a progress toast shows.
   6. Restore the saved route and filters for the new branch, or go to the dashboard home on first visit.
4. **Offline:** steps 3.1 and 3.4–3.6 work locally, and steps 3.2–3.3 queue in `UserMutations` and sync later.
5. **Rate:** there is no hard limit, as the user asked. `branch_switches` gives visibility, and leaderboards are per branch, so switching cannot inflate a rank.

---

## 9. Monetisation, quotas, AI

- **Pro (`entitlements`) is account-level** and covers all branches.
- **AI daily quota and credits** are account-level, so switching does not reset them.
- **The AI pregen cache** is keyed by question id, so the nightly pregen loops over live branches in a fixed order.

---

## 10. Rollout plan (development order, next turns)

Each step is a commit. The batch is pushed when the whole block passes build + Playwright on desktop and mobile, in light and dark.

1. **Foundation:**
   - `lib/branches.ts` — single code↔paper map, `isLive`, helpers.
   - `useBranchStore`.
   - `lib/server/branch.ts`.
   - Remove every hard-coded `"CSE"` (the list in §2).
2. **Data build:**
   - `copy-static-data.mjs` per branch;
   - image namespace + manifest v2;
   - `ImageResolver` multi-image + option images;
   - CS images moved, with redirects.
3. **Client data:**
   - `use-data-store` and repository by branch;
   - IndexedDB version bump + backfill;
   - per-branch reads in all stores;
   - `check-isolation.mjs` extended.
4. **DB migration `0026_multi_branch.sql`:**
   - `user_records` / `user_question_state` partition;
   - `user_branch_state`, `branch_switches`, `beta_branches`;
   - profile trigger;
   - branch-parameterised leaderboard functions.
   - Applied by the user in the Supabase SQL editor (steps given then).
5. **APIs:** exam start/grade, answers, AI, downloads, leaderboards and sync use the active branch, with branch-mismatch tests.
6. **Screens:** §7, one group per commit (onboarding + profile switcher, then dashboard and practice, then review, analytics and calendar, then mocks and leaderboards, then AI, downloads and search).
7. **ECE content:**
   - `seed-questions --branch ECE`;
   - generated `lib/syllabus/ECE.ts`;
   - ECE landing page live;
   - pregen enabled for ECE;
   - SEO pages.
8. **Launch gate (checklist 8C):**
   - ECE flips to `live` in `branches`, via SQL by the user.
   - Before that it runs as `beta_branches` for the owner's account only.

---

## 11. Acceptance tests (must all pass before ECE goes live)

1. **New user picks ECE at onboarding:** sees only ECE questions, filters, analytics and leaderboards. The CS bank is never requested (network log).
2. **Practise in CSE, switch, switch back:**
   1. Do 5 questions in CSE, bookmark 2 and get 1 wrong, then switch to ECE.
   2. ECE shows zero bookmarks and mistakes.
   3. Do 3 in ECE, then switch back: CSE shows exactly 2 bookmarks and 1 mistake, and the stats are unchanged.
   4. Repeat 5 times, then check the counts on a second device after sync.
3. **Mid-exam switch:**
   - Start a practice exam in CSE and switch. Switching back offers resume, with timer and answers intact.
   - During a live mock, the switch is blocked.
4. **Offline switch:** switch while offline, practise, reconnect. Both branches sync correctly and nothing is lost or duplicated.
5. **API tampering:**
   - Grading an ECE attempt with a CS question id returns 403.
   - Answer unlock for another branch returns 403.
   - Setting `target_branch` to a `coming_soon` code via the API is rejected.
6. **Leaderboards:** an ECE practice score never appears on the CSE board.
7. **Account export** contains both branches. **Account delete** removes both.
8. **Upgrade path:** an existing CS-only user's IndexedDB and cloud records are backfilled as CSE, and every pre-release count is identical after the upgrade.
9. **Images:** every EC figure, including option images, renders; CS images still render from the old URLs.
10. **Visual:** every screen in §7 at 390px and 1440px, in light and dark.

---

## 12. Open decisions (defaults chosen; change if you disagree)

- **Streak:** **per branch** (default), so each branch has its own study rhythm. The alternative is account-level.
- **Guests:** can pick any live branch (cookie). Their local progress is partitioned the same way and merges into the account on sign-up.
- **The CS bank file** stays at `data/Aggregated_Output.json`. It is not moved into `data/pyq/CS/`, to avoid churn. The loader handles both locations.
