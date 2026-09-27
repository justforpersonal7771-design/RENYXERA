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

## Next up
1. ✅ Batch pushed (11a + 11b + docs) → auto-deploy.
2. Continue the checklist.
