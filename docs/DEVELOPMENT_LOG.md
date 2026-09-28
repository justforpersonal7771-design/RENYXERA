# RENYXERA — Development Log

*Informal, running record of what was built, why, and what's pending. Newest entries at the
bottom. Updated after every step. The formal reference is `docs/TECHNICAL_REFERENCE.md`.*

Legend: ✅ done and verified · 🟡 done, waiting on something · ⏳ in progress

---

## Phase history (from git)

| When | Phase | Highlights |
|---|---|---|
| before Sep 2026 | Release 1 foundation | Data layer, AST question pipeline (Markdown + TeX + images), exam engine |
| ~Sep 2026 (early) | Releases 2–3 | Analytics, mistakes, bookmarks, revision, AI Mentor/Tutor, calendar/to-do, offline PWA |
| 25 Sep 2026 | Brand & shell | Auth modal, OAuth fixes, scrollbar, fonts/type system, /about, legal, guest walkthrough (4D), Worker CPU fix (static dataset) |
| 26 Sep 2026 | Release 4 core | Goals engine (4E), profile stats/achievements, premium exam & review screens, AI quota + cache (4G), Turnstile, middleware, questions seeded to Postgres (4B), server grading + withheld keys, protected Downloads, account settings + devices, waitlist + branch pages, legal/monitoring, onboarding + student IDs |
| 27 Sep 2026 | Release 4 finish | Exam UX batch, calibration data (step 10), profile polish, CI auto-deploy, attempt tokens + integrity (11a), All-India mocks (11b) |

---

## Detailed entries

### 27 Sep 2026 — Step 10: calibration ✅
- Real GATE CS 2023–2026 marks↔rank data with cited sources; blended median curve with a band; official GATE score formula; qualifying marks.
- Goal plan shows a range, GATE score, qualifying mark and data vintage. `check:calibration` in CI.

### 27 Sep 2026 — CI auto-deploy ✅
- Push to `main` → checks → deploy to Cloudflare → live smoke test. Old unchecked deploy workflow removed. User added GitHub secrets; first automatic deploy succeeded.

### 27 Sep 2026 — Step 11a: attempt tokens + integrity 🟡 (committed, not pushed)
- `/api/exam/start` records the server start time, question set and time limit.
- Tab switches, fullscreen exits and pauses are counted and stored as **flags** (never change the score). Disclosure shown before graded papers.

### 27 Sep 2026 — Step 11b: All-India mocks ⏳
- Migration 0009 (user ran it ✅): `mock_events`, one attempt per mock, leaderboard function.
- Scheduler builds GATE-pattern 65-question papers for upcoming Sundays.
- Mocks page (live / upcoming / past) and results page (rank, percentile, top 50).

### 27 Sep 2026 — Mock timing like the real exam + leaderboard privacy 🟡
- **Decision (user):** paper 10:00–13:00 IST, exactly 180 minutes, 20–30 min buffer for server/network trouble.
- **Built:** entry open 10:00–10:30; everyone gets the full 180 min from their own server start (hard close 13:30); no pause; results 13:45. Wall-clock timer so a reload/sleep can't gain time.
- **Peak-load hardening:** start and submit retry with backoff + jitter; one attempt id reused (retry = resume); grading idempotent; mock submit timeout raised to 90 s; questions served from CDN.
- **Privacy (user):** leaderboard display choice — anonymous / username / username + student ID. Display only; no route accepts a username or student ID for sign-in, lookup or changes.
- Migration **0010** run by the user ✅. Next 4 Sunday mocks scheduled (4, 11, 18, 25 Oct).
- **Tested end-to-end (27 Sep)** with 4 temporary accounts: early start refused; entry closed after 30 min; wrong paper refused; late start in grace still gets 180 min; same-id retry resumes; second attempt refused (409); duplicate submit safe; tab-switch flag stored; leaderboard hidden until results; flagged attempt unranked; all three display options; no emails exposed; other profiles unreadable; student ID not editable. Mocks page checked on desktop/mobile × light/dark — no overflow, no errors.

### 27 Sep 2026 — Official documentation ✅
- `docs/TECHNICAL_REFERENCE.md` — architecture, stack, data, full schema explanation, security/privacy, API, every module, flows, CI/CD, config, runbook, capacity.
- `supabase/SCHEMA.sql` — the complete schema in one script; regenerate with `npm run schema:build`.
- This log.

---

### 27 Sep 2026 — Shuffled mock order + test mock ✅
- **Decision (user):** same questions for everyone, different order per person, GA first then Maths + Core mixed; results must stay exact.
- Built `lib/exam/mock-order.ts` (seeded by user + mock → stable on reload/other device). Grading was already keyed by question id; found that float sums of −⅓ differ in the 15th digit by order — the server already rounds to 2 decimals, so stored scores/ranks are order-independent. New CI check `check:mock-order`.
- Scheduler gained `--at` / `--title` for one-off mocks. **Test Mock scheduled today 1:00 PM IST** (entry until 1:30, 180 min, hard close 4:30, results 4:45).
- **Decision (user):** Admin Console added to the checklist as Release 10 (strict login, roles/privileges, mock scheduling, integrity review, content, users, dashboards, audit log) — deferred until every other release is done and the app is stable.

### 27 Sep 2026 — GATE-accurate results 🟡
- **Decision (user):** ranking must replicate GATE; collect whatever is essential (category, age/DOB if needed).
- **Finding:** GATE has no tie-breaker — equal marks share the AIR — so DOB/age are *not* needed and not collected. Category and PwD matter only for the qualifying mark (General max(25, μ+σ); OBC-NCL/EWS 90%; SC/ST/PwD ⅔) and a category rank (GATE itself doesn't issue one).
- Built: private category + PwD in Profile → Personal info; migration 0011 with `mock_my_result` (marks, AIR, percentile, qualifying marks, qualified, GATE score 350 + 550×(M−Mq)/(Mt−Mq), category rank); tie-correct leaderboard percentile; scorecard on the results page.
- Browser test of the per-person order: 2 accounts, desktop light + mobile dark, both mobile modes — same 65, GA first, different order.
- **Waiting:** user to run migration 0011, then push.

### 27 Sep 2026 — GATE results verified + mobile pass ✅
- Migrations 0011 + 0012 run by the user. 12-account test: equal marks share AIR (1, 2, 2, 4), qualifying marks per category, GATE score, category/PwD rank, flagged excluded, category private — all pass. 0012 fixed an undefined GATE score in small mocks (top-10 mean ≤ qualifying mark → use topper's marks).
- **Mobile (user report: couldn't deploy a test on phone).** Root causes: tool pages were pinned to one screen height and the Setup card clipped the Deploy Session button; `100vh` hid the exam's bottom bar under the phone browser's toolbar; the question text and options scrolled separately, leaving one visible line of question.
- Fixes: one-screen layout only from 1024px (chat/lock screens opt in with `data-fill-height="always"`); `h-dvh` for the app shell and exam; question + options scroll together below 1024px; "Starting…" state on Deploy; compact Submit on narrow phones; Escape closes the question grid; Mistakes/Bookmarks become list → detail with Back on phones; blueprint duration uses the timer's rule (180 min / 100 marks, was 2.5 min/question); difficulty bar order matches its labels; "Penalty"/"Marks" labels no longer wrap.
- Tested: full flow (setup → deploy → answer → grid → submit → results → review → mistakes → revision) on iPhone-size light + dark and desktop light + dark; all pages without horizontal scroll or errors.

### 27 Sep 2026 — Mock results released only at results time 🟡
- **User report:** a mock's full result (score + right/wrong grid) showed right after submitting.
- **Found a bigger hole:** mock papers are past-year questions, so during a live mock anyone could get the keys via `/api/answers` or by "practice-grading" the same ids, and `mock_events.question_ids` was public before the start.
- **Built:** server embargo (`lib/security/mock-embargo.ts`): from start to results time, `/api/answers` returns no keys for the paper's questions and `/api/exam/grade` stores + grades the attempt but returns `withheld` (no score, results or keys). Results and review pages show a locked countdown and open themselves at release (then fetch score + keys and record mistakes). Mocks page: an always-visible Leaderboard card (latest released mock, refreshes at release); past scores hidden until release. Migration 0013 hides question ids until the start (`mock_paper()` RPC, `question_count` column).
- Tested (dev server): answers locked for users and guests, practice-grading locked, submit stored + withheld, server score recorded, everything opens after release.
- **Waiting:** user to run migration 0013, then push.

### 28 Sep 2026 — Practice never locked, fullscreen everywhere, Leaderboard panel, Mocks redesign 🟡
- **Bug (user):** an Exam Setup test showed "18 answers can't be scored — checking with the server". Cause: the answer lock from the mock work applied to anyone asking for questions that were also in the live test mock. **Fix (pushed at once):** only an All-India mock attempt's own result waits for its results time; every other test is graded immediately; `/api/answers` never locks. (Trade-off, accepted: mock papers are public past questions, so a determined mock-taker could look answers up elsewhere.)
- **Fullscreen:** `lib/fullscreen.ts` — standard + webkit API, and a pinned "pseudo full screen" fallback where there's no API (iPhone Safari); one shared state/event. The exam now enlarges the whole exam screen (timer, grid, Save & next, Submit stay usable); viewers still enlarge just the question; themed background; tab-switch/fullscreen-exit tracking uses the shared event.
- **Leaderboard (navbar, beside Focus Target):** animated trophy (glint on hover, wiggle + pulsing dot + one-time toast when new mock results are published). Panel with All-India Mock and weekly Practice boards; rows start in last period's order and slide into the new order, ▲/▼/New badges; your rank pinned on top. Migration 0014: `practice_leaderboard`, `mock_leaderboard_moves`, shared `display_label`.
- **Mocks page redesign:** animated hero (live state or a rolling countdown), Leaderboard button, your mock stats, an exam-day timeline that fills on the day, date-badge upcoming cards, past mocks with score bars.

### 28 Sep 2026 — Fair integrity, fullscreen arrows, mock status everywhere 🟡
- **Fullscreen (user):** the question fullscreen dropped out on ‹ › because each question is re-keyed for its slide animation and the fullscreen element left the page. Now a stable `exam-question-stage` is enlarged (question + options + arrows); tested on desktop and mobile (native and the iPhone fallback).
- **Cheating (user):** every test (mock and practice): leaving the exam window shows *Warning n of 4*; the 5th time auto-submits and disqualifies with the reason shown; stored as a `disqualified` flag. Only disqualifying flags remove an attempt from ranking (`lib/exam/integrity-rules.ts` + `attempt_disqualified()` in migration 0015); answering fast / leaving full screen are informational, so honest users aren't dropped. Disqualified practice tests don't count on the practice board. A lone ranked candidate is now at the 100th percentile.
- **Mock status:** dashboard card (continue / countdown to results / results late — retries every 30 s / AIR · percentile · marks · GATE score / next mock) and an Analytics section (history with bars; empty state). Results and review pages show *Results are on their way* if they're late.
- Leaderboard: dot no longer clipped; readable *New entry / ▲▼* chip in the header.
- Tested (production build): 25 checks pass on desktop light + mobile dark. **Waiting:** migration 0015.

### 28 Sep 2026 — Score regression, shortcuts ≠ bookmarks, stale-copy guard ✅
- Migration 0015 verified live: fast answers no longer disqualify; disqualified / over-time still excluded; lone candidate → 100th percentile.
- **5B regression suite:** `npm run check:score` — 100 random attempts (right / wrong / skipped, NAT edges, partial MSQ) graded by the live server vs the client: all agree exactly. (A first run "disagreed" only because the harness skipped the app's NAT-key normalisation — fixed in the script, not the app.)
- **Bug (user):** Save Shortcut also marked the question Bookmarked (and could overwrite a real bookmark's notes). Shortcut-only records are no longer bookmarks anywhere (AI Tutor button, Bookmarks page, dashboard count); saving a shortcut adds to an existing bookmark; un-bookmarking keeps a saved shortcut.
- **Bug (user):** Leaderboard icon and mock cards "disappeared" — the live build had them; the tab had fallen back to an older cached copy. New `VersionWatch` + `/api/version`: on focus, every 5 min and on navigation the tab compares builds and reloads quietly (never during a test; at most once a minute).

### 28 Sep 2026 — Release 4 hardening batch ✅ (backups 🔶)
- **Spending rule (user):** anything costing money beyond a one-time ₹100 total goes to the backlog until income. Moved: Cloudflare R2 (card on file), custom domain, phone OTP (Firebase Blaze), hotlink protection.
- Password change signs out every other device; 30-day idle devices sign themselves out.
- Username blocklist (English + Hindi/Hinglish, no false hits on names like "grapefruit").
- Graded / Practice badge in the exam header.
- `/api/health` + `keepalive.yml` (every 3 days) so the free Supabase project never pauses.
- `backup.yml`: weekly encrypted `pg_dump` artifact (90 days); restore steps in the runbook. Needs 2 secrets.
- **CI end-to-end smoke** on every push: 11 pages × phone/desktop × light/dark + a guest exam (44 + 1 checks, passing locally on a prod build).
- `scripts/check-isolation.mjs`: two accounts on one browser — B sees nothing of A's (passes).
- Rollback runbook (`wrangler rollback`), listing verified; live drill awaits the user's go-ahead.

### 28 Sep 2026 — Backups live, rollback drilled, Release 5 leftovers 🟡
- First backup run succeeded (21 s, encrypted artifact). **Rollback drill** (user OK'd): `wrangler rollback` to the previous build (live site served `fd502ce`, new health route gone) and back (`35cf9f4`, healthy) — seconds each.
- **Leaderboards:** one `board()` function — Practice overall / by subject / my college, and a **Weekly Challenge** (10 past-GATE questions per IST week, same for everyone; the server rejects a challenge-titled test with any other set; only server-started attempts rank). Panel gets Mock · Practice · Challenge tabs with Overall / By subject / My college; Mocks page gets a Challenge card. Marks per question now stored (`exam_responses.awarded`).
- **Per-account daily cap** on answer-key lookups (800/day, Postgres counter, logged when hit).
- Verified: client and server compute the identical challenge set (975 = 975 ids).
- **Waiting:** migration 0016 before pushing (the grader writes the new column).

## Next up
1. ✅ Batch pushed (11a + 11b + docs) → auto-deploy.
2. Continue the checklist.
