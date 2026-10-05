# Multi-Branch Design (Release 8A/8C), v2

**Status:** v2, 5 Oct 2026. It replaces v1 (free switching plus email subscription change) following the user's decision on simplicity.
**Goal:** RENYXERA serves every GATE paper we carry.
- **A signed-in account belongs to one branch.** The user picks it once and may make **one final change**. After that the branch is locked forever.
- **Guests may switch freely**, any number of times.
- A user sees and can open **only their branch**.

**First new branch:** ECE (paper EC), 390 questions 2021–2026, validated and tagged (`data/pyq/EC/gate_ec_pyqs.json`).

---

## 1. Requirements (user decisions, 5 Oct 2026)

| # | Requirement | Design |
|---|---|---|
| R1 | Users see only their own branch | All dashboard content is scoped to the account's branch (§5, §7) |
| R2 | Other branches are not accessible | Server APIs reject anything outside the account's branch (§6) |
| R3 | Signed-in user **picks one branch** and sticks to it | Mandatory branch pick at onboarding, with an explicit confirmation (§3.2) |
| R4 | **One final change** allowed, then locked forever | `profiles.branch_changes_used` (0 or 1), enforced by a DB trigger. Self-service in Profile with a typed confirmation (§3.3) |
| R5 | **Guests switch freely**, no restriction | Guest branch lives in a cookie + localStorage; progress is partitioned locally per branch (§3.4) |
| R6 | Plus and Pro are tied to the branch, confirmed by an explicit signal that cannot be reversed | Entitlements carry `branch_code` = the account's branch. Checkout shows a lock confirmation that is recorded immutably (§9) |
| R7 | No data loss | Progress records are stamped with their branch. After the one change, the old branch's data is kept (read-only, hidden) and included in export (§4) |

**What this removes from v1:**
- unlimited switching for accounts;
- per-branch subscriptions on one account;
- the email-based subscription change;
- "switch back and resume";
- leaderboard abuse by switching.

The one final change replaces the email process, and the subscription moves with it (§9.4).

---

## 2. Current state (audited 5 Oct 2026)

**Already branch-ready:**
- **Postgres:**
  - `branches` holds CSE, DA, ECE, EE, ME and CE, each `live` or `coming_soon`.
  - `questions`, `exam_attempts`, `mock_events` and `branch_waitlist` have `branch_code`.
  - `profiles.target_branch` defaults to `'CSE'` and references `branches`.
- **Question ids carry the paper** (`GATE_CS_2026_FN_Q1`, `GATE_EC_2024_Q7`). Every per-question record therefore belongs to exactly one branch: bookmarks, mistakes, `user_question_state`, AI cache and pregen, and question reports.
- **`lib/branches.ts`** has the catalogue (code, slug, paper, `live`) used by the landing pages and the waitlist.

**Single-branch today (must change):**

| Area | Where | Problem |
|---|---|---|
| Static bank | `scripts/copy-static-data.mjs` | One CS file `public/data/questions.json` |
| Images | `data/image-manifest.json`, `public/images/<shift>/NN.png` | Keys collide across branches. EC uses `07_1.png` / `07_A.png` names |
| Client repository | `store/use-data-store.ts`, `lib/repository/question-repository.ts` | Hard-coded `/data/questions.json` |
| Exam server | `app/api/exam/start/route.ts`, `app/api/exam/grade/route.ts` | `branch_code: "CSE"` hard-coded |
| Seeding / mocks | `scripts/seed-questions.mjs`, `scripts/schedule-mocks.mjs` | CSE only |
| Onboarding / profile | `components/auth/onboarding-gate.tsx`, `app/(dashboard)/profile/page.tsx` | Branch fixed to CSE |
| IndexedDB aggregates | `lib/repository/storage/idb-manager.ts` | Sessions, metrics, snapshots, templates and AI memory are not stamped with a branch |
| AI knowledge graph | `lib/ai/memory/KnowledgeGraph.ts` | CS taxonomy only |
| Calibration | `lib/calibration.ts` | CSE only |
| SEO / sitemap / Telegram | `lib/seo/pyq.ts`, `app/sitemap.ts`, `scripts/telegram-daily.mjs` | Single CS bank |
| Leaderboards | `practice_leaderboard()` etc. | Not filtered by branch |
| Billing | `entitlements` (one row per user), `is_pro(user)` | No branch |
| Naming | App `ECE` vs paper `EC` | `lib/branches.ts` `paper` is the single mapping |

---

## 3. Branch model

### 3.1 Codes
- **Branch code** is the app/DB code: `CSE`, `ECE`, `EE`, `ME`, `CE` or `DA`.
- **Paper code** is GATE's code (`CS`, `EC`, …). It is used in question ids and in `data/pyq/<PAPER>`.
- Only `lib/branches.ts` maps one to the other.

### 3.2 Signed-in: pick once
- **Onboarding** (required before the dashboard):
  - shows live branches as cards, with question count and paper code;
  - the user selects one;
  - a confirmation states: "Your account will be set to **GATE ECE (paper EC)**. You can change it **one time only**; after that it is permanent." The user ticks "I understand".
- **Writes:**
  - `profiles.target_branch = 'ECE'`
  - `branch_confirmed_at = now()`
  - `branch_changes_used = 0`
- **Existing users** (all on CSE before this release) are treated as confirmed on CSE, with `branch_changes_used = 0`. They see a one-time notice: "Your account is set to CSE. You have one change available in Profile."

### 3.3 Signed-in: the one final change
- **Profile → Exam branch** shows the current branch and "1 change left", or "Locked — no changes left".
- **Change flow:**
  1. Pick a live branch.
  2. A warning card states:
     - this is the **final** change and cannot be undone;
     - your previous branch's progress is **kept but hidden** (included in data export);
     - your Plus/Pro subscription, if any, **moves to the new branch** with the same expiry.
  3. The user must **type the new paper code** (for example `EC`) and tick "This is final".
  4. The server calls the `change_my_branch(p_to)` RPC (security definer). It checks:
     - the user is signed in;
     - `branch_changes_used = 0`;
     - the target is live;
     - the target differs from the current branch;
     - no live mock attempt is in progress.
  5. **It then:**
     - sets `target_branch`;
     - sets `branch_changes_used = 1` and `branch_changed_at`, and `branch_previous` to the old branch;
     - moves the entitlement's `branch_code` (§9.4);
     - writes an audit row to `branch_switches`.
  6. The client reloads into the new branch.
- **Database guard:** a `before update` trigger on `profiles` rejects any change to `target_branch` that does not come through `change_my_branch`, or that happens once `branch_changes_used = 1`.
  - It rejects any non-live target.
  - It forbids lowering `branch_changes_used`.
  - Admin service-role edits are allowed only through an `admin_set_branch` function, which writes an audit row. This is for exceptional support and is not offered publicly.

### 3.4 Guests: free switching
- **Storage:** the branch is held in the `renyxera_branch` cookie and in localStorage. It defaults to the branch of the landing page they came from, otherwise CSE.
- **Switching:** a branch chip in the header opens a switcher listing all live branches, with no limit and no confirmation.
- **Progress:**
  - Guest progress (IndexedDB) is stamped per branch.
  - Switching shows only that branch's data, so switching back shows the earlier guest progress intact.
  - Guest caps (sample size, "local only" warning) apply per branch, as today.
- **Sign-up:** the onboarding pick defaults to the guest's current branch. On confirm, guest data **for that branch** merges into the account. Guest data for other branches stays local and hidden, and is offered in export.

---

## 4. Data partitioning

### 4.1 Rule
- Every progress record carries its branch.
- Readers filter by the account's (or guest's) branch.
- Nothing is ever deleted by a pick, change or switch.

### 4.2 IndexedDB
- **Version bump.** Add a `branch` field and index to `ExamSessions`, `StudyMetrics`, `AnalyticsSnapshots`, `CustomTemplates`, `Mistakes`, `Bookmarks`, `AiMemory` and `UserMutations`.
- **Upgrade backfill:**
  - rows with a question id use its paper code (`GATE_EC_` → ECE);
  - everything else becomes `CSE`.
- **Reads** take the current branch. Keys do not change, so no row moves.
- **`lib/hard-reset.ts`:** "reset progress" resets the current branch only.
- **`scripts/check-isolation.mjs`:** add account and branch isolation tests.

### 4.3 Postgres — migration `0026_multi_branch.sql`
- **`profiles`:** add `branch_confirmed_at timestamptz`, `branch_changes_used smallint not null default 0 check (in 0,1)`, `branch_changed_at timestamptz`, `branch_previous text references branches`, and the trigger from §3.3.
- **`user_records` and `user_question_state`:**
  - add `branch_code`, backfilled from the key prefix (default `CSE`);
  - the `user_records` primary key becomes `(user_id, branch_code, kind, key)`;
  - the sync API pulls only the account's current branch.
- **`branch_switches`:** append-only audit with `user_id`, `from_branch`, `to_branch`, `at` and `via` (`onboarding`, `final_change` or `admin`).
- **`entitlements`:** add `branch_code` (backfill `CSE`) and the trigger that keeps it equal to the profile branch (§9).
- **`billing_orders`:** add `branch_code` and `lock_confirmation_id`.
- **`branch_lock_confirmations`:** append-only (§9.2).
- **New functions:**
  - `change_my_branch(p_to)`;
  - `set_initial_branch(p_code)`, which runs once and only while `branch_confirmed_at is null`;
  - `admin_set_branch(...)`;
  - `has_plan(p_user, p_tier)` (branch-aware, see §9);
  - leaderboard functions with a branch parameter, set from the caller's profile.

### 4.4 After the one change
- **The old branch's data stays in the DB and IndexedDB, untouched.** It is hidden because reads filter by the current branch.
- **Export (`/api/account/export`)** includes it, labelled "previous branch".
- **Account delete** removes everything.
- **Old graded attempts and leaderboard entries:** these stay on the old branch's boards for history. The account's display name shows only on its current branch board; the previous-branch rows are anonymised in public views.

---

## 5. Question bank per branch

- **Source of truth:**
  - CS: `data/Aggregated_Output.json` (unchanged).
  - Other branches: `data/pyq/<PAPER>/gate_<paper>_pyqs.json` plus `data/pyq/<PAPER>/images/<pid>/`.
- **`scripts/copy-static-data.mjs`** writes, for each branch with data:
  - `public/data/<CODE>/questions.json`, with answers stripped (the leak check runs per branch);
  - `public/data/<CODE>/image-manifest.json`;
  - copies of the images to `public/images/<CODE>/<year-shift>/…`.
  - It also keeps the legacy `public/data/questions.json` (CS) for old caches and SEO.
- **Images:**
  - The resolver is branch-aware and handles `[IMAGE_Q_07_1]`, `[IMAGE_Q_07_A]` and legacy CS `NN.png`.
  - The CS path stays `/images/<shift>/…`, so no move is needed.
  - Non-CS paths are `/images/<CODE>/<shift>/…`.
- **Client:** `use-data-store` loads `/data/<CODE>/questions.json` (CS keeps `/data/questions.json`). The compiled cache is keyed per branch.
- **Postgres seeding:** `seed-questions.mjs --branch ECE` loads `questions`, `question_options` and `question_answers` with `branch_code`, carrying MTA and provenance from the meta file.
- **Taxonomy:** subject and topic lists come from the bank itself (tagged against the official syllabus), so filters and analytics work for any branch with no per-branch code.

---

## 6. Server enforcement
- **Helper:** `lib/server/branch.ts` provides `getUserBranch(userId)`, which reads the profile, and `branchOfQuestion(qid)`, which uses the paper-code prefix.
- **Exam start/grade:** use the profile branch. Grading rejects question ids from another branch with 403 `branch_mismatch`.
- **Answers, AI, downloads, leaderboards, mocks:** the branch comes from the profile, never from the request. Guests take it from the cookie, validated against live branches.
- **Static `/data/<CODE>/questions.json`:** public, as CS is today. It has no answers, and answers stay server-gated.

---

## 7. Screens affected (each checked desktop + mobile × light + dark)

| Screen | Change |
|---|---|
| Onboarding | Branch cards + "change once only" confirmation (§3.2) |
| Header | Signed-in users see a static branch badge ("ECE · EC"). Guests see a branch switcher chip |
| Profile → Exam branch | Current branch, "1 change left / Locked", final-change flow with typed code (§3.3) |
| Profile → Subscription | Tier, expiry, branch, "Locked to ECE" |
| Dashboard home, practice/exam setup, exam runner | Use the branch bank; filters come from the bank's tagged subjects and topics |
| Review: bookmarks, mistakes, revision | Branch-filtered |
| Analytics | Branch subjects. The rank predictor shows "not yet available for ECE" without calibration |
| Calendar / goals | Branch goals |
| Mocks + leaderboards | Branch mocks and boards |
| AI tutor / mentor | Branch context |
| Downloads | Branch packs |
| Pro / checkout | Plans for the account's branch, plus the lock confirmation (§9.2) |
| Search | Branch-only |
| Marketing `[slug]` | Live branch → "Start practising" (guest lands in that branch); coming soon → waitlist |
| Sitemap / SEO / Telegram | Per live branch |
| Account export / delete | All branches |

---

## 8. Flows summary

| Who | Action | Limit | Data |
|---|---|---|---|
| Guest | Switch branch | Unlimited | Local, partitioned per branch |
| Signed-in, new | Pick at onboarding | Once (sets the branch) | — |
| Signed-in | Final change | Exactly once, then locked | Old branch kept, hidden; subscription moves |
| Admin | `admin_set_branch` | Exceptional, audited | As final change |

---

## 9. Plus / Pro tied to the branch

### 9.1 Rule
- The subscription is valid only for the account's branch.
- Since an account has one branch, the entitlement row gets `branch_code`, kept equal to `profiles.target_branch`.

### 9.2 Lock confirmation at checkout (the signal)
1. The checkout card states the branch and paper code, plus: "This subscription is for **GATE ECE**. It works only for this branch."
   - If no change has been used: "Your account can still change branch once; the subscription would move with it."
   - If locked: "Your branch is final."
2. **The signal:** the user types the paper code and ticks a confirmation box before Pay enables.
3. `/api/billing/order` records a `branch_lock_confirmations` row (append-only: user, branch, plan, typed code, time, hashed ip/ua, order id). It sets `billing_orders.branch_code` and adds the branch to the Razorpay `notes`.
4. The webhook and verify step grant for `billing_orders.branch_code`, never for anything the client sends.
5. Receipts and emails show "Branch: ECE (locked)".

### 9.3 Gating
- `has_plan(user, tier)` passes only when `entitlement.branch_code = profile.target_branch`, the tier is high enough, and the plan has not expired.
- The client `useEntitlements()` mirrors this.

### 9.4 With the final change
- `change_my_branch` moves the entitlement's `branch_code` to the new branch, keeping tier and expiry. This is the only time it can move.
- Afterwards both are locked.

### 9.5 Quotas, credits, referrals
- **AI quota and credit packs:** account-level (unchanged).
- **Referral days:** added to the account's subscription.
- **Promo codes:** may be branch-restricted.

### 9.6 Existing subscribers
- Backfilled to `CSE`, with expiry unchanged.
- The one-time notice explains the lock and the one change available.

---

## 10. Rollout (development order)

1. **Foundation:**
   - `lib/branches.ts` helpers;
   - `useBranchStore` (signed-in mirrors the profile; guests use the cookie);
   - `lib/server/branch.ts`;
   - remove the hard-coded `"CSE"`.
2. **Data build:** per-branch static data, images and manifest; branch-aware image resolver.
3. **Client data:** repository by branch; IndexedDB branch stamping and backfill.
4. **Migration `0026_multi_branch.sql`:** the user applies it; Claude holds until confirmed.
5. **APIs:** exam, answers, AI, downloads, leaderboards and sync use the profile branch; RPCs `set_initial_branch` and `change_my_branch`.
6. **Screens:**
   - onboarding pick;
   - header badge and guest switcher;
   - Profile → Exam branch (final change);
   - checkout lock;
   - Profile → Subscription.
7. **ECE content:** seed ECE into Postgres; landing page live; pregen; SEO.
8. **Launch gate:** ECE `live` in `branches`, set by the user via SQL.

---

## 11. Acceptance tests

1. A new user picks ECE and sees only ECE everywhere. The CS bank is never fetched.
2. **The one change:**
   - The final change ECE → CSE works once.
   - Profile then shows Locked.
   - A second attempt fails in the UI, the API and the DB trigger.
3. **Direct manipulation is blocked:** `update profiles set target_branch` through the REST API fails, as does lowering `branch_changes_used`.
4. **After the change:** old ECE bookmarks are hidden, export contains them, and nothing is deleted.
5. **Guest switching:** a guest switches CSE ↔ ECE ten times, and each branch's guest progress is intact.
6. **Guest sign-up:** a guest with ECE progress signs up and picks ECE. The progress merges, and their CSE guest data stays local.
7. **API tampering:** grading with another branch's question id returns 403, and so does unlocking another branch's answers.
8. **Checkout:** Pay is disabled until the code is typed and ticked. The lock row is written, and the grant follows the order's branch.
9. **Subscription moves with the final change:** expiry and tier are unchanged, and Pro is visible on the new branch only.
10. **Existing CS users:** the IndexedDB and cloud backfill keeps every count identical, and the notice shows once.
11. **Images:** every EC figure, including option images, renders, and CS images are unchanged.
12. **Visual:** all §7 screens at 390 and 1440 px, in light and dark.

---

## 12. Edge cases

| # | Situation | Behaviour |
|---|---|---|
| E1 | Final change attempted during a live mock | Blocked until the mock ends |
| E2 | Final change with an in-progress practice exam | Warning; the session stays in the old branch (hidden) |
| E3 | Two tabs / two devices after a change | `BroadcastChannel` reloads other tabs. Other devices pick up the new branch on next profile fetch (on focus); stale requests get 403 `branch_mismatch` and the client reloads |
| E4 | Change while offline | Not allowed (needs the server); the button is disabled offline |
| E5 | A branch is pulled back to `coming_soon` | Accounts on it are moved by an admin to their `branch_previous` or CSE, which does **not** consume their change, plus a notice. Subscriptions are extended by the downtime |
| E6 | Guest data for several branches at sign-up | Only the chosen branch merges; the rest stays local, and export offers it |
| E7 | Signed-in user signs out and browses as a guest | Guest mode can switch freely, but uses guest storage only and never touches account data |
| E8 | A crafted request picks a coming-soon branch | Rejected by RPC and trigger |
| E9 | User asks support for a second change | Refused by policy. Only `admin_set_branch` exists (audited) for platform faults such as E5 |
| E10 | Shared link to another branch's question | "This question is from GATE ECE"; the content is not shown in-app (public SEO pages unaffected) |
| E11 | Payment webhook delayed | "Activating…" as today, for the order's branch |
| E12 | Refund | Removes the entitlement; the lock record stays for audit |
| E13 | Same question id in two branches | Impossible: ids carry the paper code |
| E14 | Calibration missing for a branch | Predictor shows "not yet available"; everything else works |
| E15 | Service worker holds the old bank | Versioned cache names per branch; old caches deleted on activate |
| E16 | Small branch leaderboard | Hidden below 20 active users, with a message |
| E17 | Account delete | Deletes all branches' data |
| E18 | Previous-branch leaderboard rows | Anonymised in public views after a change |

## 13. Additional features in this release
1. Onboarding branch cards with question count, years covered and a syllabus preview.
2. Guest branch switcher with per-branch guest progress.
3. "Change left" indicator and a final-change flow with a typed confirmation.
4. Syllabus map per branch (topic tree from the tags, with the user's accuracy per topic).
5. Landing → app deep link with the branch pre-selected (guests land in it; sign-up pre-selects it).
6. Waitlist invite email when a branch goes live.
7. Admin counters: users per branch, final changes used, subscriptions per branch.
8. Subscription widget: "Pro · ECE · 214 days · Locked".

## 14. Open decisions (defaults chosen)
- **Previous-branch data after the final change:** kept and hidden (default). It could be offered for permanent delete in Settings.
- **Existing users:** get the one change, like everyone.
- **Admin override:** used only for platform faults (E5), never on request.
