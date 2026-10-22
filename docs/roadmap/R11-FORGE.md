# Release 11 — Forge: original GATE-level questions and mocks (P1)

*Detailed task plan. Product design: `../FORGE_DESIGN.md`. Access rules: `../FORGE_ENTITLEMENTS_AND_SETUP.md` (wins on conflicts). Owner decisions F1–F6: `../OPEN_DECISIONS_FOR_YOU.md`.*

**Access (decided 18 Oct):** Forge questions — Plus and Pro only (Plus limit = F1; Pro adds archive and "X" items). Free — Forge Mocks only. AI practice sets (already live) stay as they are.

## R11-A · Foundation (no content needed; can start before F1)

### A1 · Database migration `supabase/migrations/0040_forge.sql`
What: tables for Forge items, private answers, stats.
How:
- `forge_items` (id `FORGE_<BR>_000123`, branch, subject, topic, syllabus_code, kind, difficulty E/M/H/X, question_type MCQ/MSQ/NAT, marks, question_text, options jsonb (no correctness), has_image, images, `release_at`, `status` draft/approved/retired, `mock_only` bool, `version`, `created_at`).
- `forge_answers` (item id, correct_option_ids, nat_min, nat_max, nat_ranges, solution jsonb {steps, shortcut}, `verify` jsonb) — RLS on, **no policies**.
- `forge_item_stats` (item id, attempts, correct, p_value, discrimination, avg_time_ms, reports).
- RLS: `forge_items` readable by authenticated users only where `release_at <= now()` and `status = 'approved'` and not `mock_only`; mock items only through mock endpoints.
- Indexes: (branch, status, release_at), (branch, topic).
Done when: migration runs clean on a copy; `scripts/check-security.mjs` proves anon and authenticated users cannot read `forge_answers` or unreleased items.
Depends on: owner runs the migration.

### A2 · Entitlement in `lib/billing/plans.ts`
How: `FORGE` constants per tier (`free: { questions: false, mocks: true }`, `plus: { questions: true, dailyLimit: F1, archive: false, x: false }`, `pro: { questions: true, archive: true, x: true }`) and `canUseForgeQuestions(tier)`; Plans page/feature list reads these.
Done when: one place controls Forge access; unit check script covers all tiers.

### A3 · APIs
- `GET /api/forge/items?branch&set=daily|practice&filters` — JWT, tier check (Free → 403 `{reason:"plan"}`), branch check, rate limit, returns public halves.
- `/api/answers` gains a Forge branch (unlock after submit; same caps).
- `/api/exam/grade` grades Forge items from `forge_answers`.
- `POST /api/forge/report` — report an issue (rate-limited, Turnstile).
Done when: Postman-style script tests for Free/Plus/Pro/guest pass; answers never appear before submit.

### A4 · UI (locked for Free)
- Dashboard **Daily Forge** card: today's 10 questions, streak, time left; Free sees a blurred preview + upgrade sheet.
- Exam setup: source switch **Past papers / Forge / Mixed**; Forge filters (kind, difficulty); disabled for Free with an explanation.
- Question view: "Forge" badge, worked solution after submit, "Report an issue".
- Analytics: split PYQ vs Forge; accuracy per archetype.
Done when: desktop/mobile × light/dark screenshots approved; Free/Plus/Pro flows verified with real accounts.

### A5 · Beta flag
How: `NEXT_PUBLIC_FORGE_BETA` + an allow-list of user ids (owner) checked server-side.
Done when: only the owner sees Forge until launch.

## R11-B · Authoring pipeline (Claude in work sessions; ₹0)

### B1 · `scripts/forge/profile.py <BRANCH>`
Reads tagged PYQs; outputs per-topic counts, marks share, type mix, difficulty mix, 3-year trend weights → `data/forge/<BR>/profile.json`.

### B2 · `scripts/forge/plan.py <BRANCH> --batch 60`
Blueprint: topics weighted by trend, archetypes (multi-concept, application, trap-aware, numeric-chain, conceptual-MSQ, …), difficulty mix (≈ 30 % M, 50 % H, 20 % hard-H), type mix like recent papers → `data/forge/<BR>/plans/<batch>.json`.

### B3 · Drafting format
One JSON per batch `data/forge/<BR>/batches/<batch>.json` with the item schema of `FORGE_DESIGN.md` §5, including a `verify` block (Python code that recomputes the answer and every numeric option).

### B4 · `scripts/forge/validate.py`
Checks: schema; `verify` code runs and matches the key (NAT range ±tolerance); MCQ has exactly one correct, MSQ ≥ 1; distractors are distinct and plausible (each tied to a named misconception); no near-duplicate of any PYQ (text similarity threshold); LaTeX renders (MathJax check script); difficulty label present.
Done when: a batch fails loudly on any error; report saved to `data/forge/<BR>/reports/`.

### B5 · `scripts/forge/seed.mjs`
Loads approved items into `forge_items`/`forge_answers`; writes answer-free `public/data/<CODE>/forge.json` for released practice items.

### B6 · First CS batch (60) + human check
Owner spot-checks 10 (random); every item reviewed by Claude against its verify code; checklist tuned from errors found.
Done when: 0 wrong keys in the spot check; batch approved.

### B7 · CS buffer
300 practice + 300 Daily Forge (30 days) + 195 mock items (3 mocks). About 14 batches.

## R11-C · Launch

- **C1 Daily Forge (CS):** release 06:00 IST via `release_at`; streak + per-branch board (`board()` scope `forge_daily`); CI check fails if fewer than 14 days are queued.
- **C2 Forge Mocks (all tiers):** `scripts/forge/build-mock.mjs --branch CS --date …` freezes 65 items (GA + subject, official pattern) into `mock_events`; Sunday 10:00 IST (cadence F4); results/ranks; Free sees solutions per F2; after the mock items join the Plus/Pro pool.
- **C3 Calibration:** after 50 attempts, flag items with p < 0.05, p > 0.95 or discrimination < 0.1; hide from new mocks; review queue.
- **C4 Telegram:** branch channels post one Daily Forge teaser with spoiler answer (F3); hub announces Forge Mocks (`scripts/telegram-hub.mjs`).
- **C5 Marketing:** launch post, film cut, Plans page section "Forge", email-less announcement in app (What's new).
- **C6 Roll-out:** EC next, then EE, ME, CE, DA (F5) — each needs B1–B7 for that branch.

## Done when (release)
CS Daily Forge runs 30 days without a gap; 3 Forge Mocks held; item error reports < 1 %; Free→Plus conversion from Forge locks measured.
