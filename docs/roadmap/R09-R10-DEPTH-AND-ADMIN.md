# Releases 9 and 10 — Product depth, community, admin console

## Release 9 — Product depth and controlled community (P5)

### 9A · Spaced repetition and adaptive daily set
What: FSRS scheduling over mistakes, bookmarks, Forge items and (later) study flashcards; a daily adaptive set mixing due reviews, weak topics and new questions; per-topic mastery feeding the goals engine.
How: `lib/learning/fsrs.ts` (open algorithm, no cost), review states in IndexedDB + cloud sync, "Due today" card, Telegram reminder for due reviews (Plus/Pro).
Done when: due counts are correct across devices; retention measured (recall rate) in analytics.
Refs: `lib/learning/*`, `lib/goals/*`, `docs/AI_USAGE_STRATEGY.md`.

### 9B · Gamification depth
Streak freeze tokens (earned by mocks), XP and levels, daily goals, study-time boards; respects "no weekly league" decision.

### 9C · Moderated community
Doubt threads per question, reputation, toxicity scoring (free model or keyword + report flow), moderator tools in R10; opens only when moderation exists.

### 9D · App stores
Microsoft Store → **Release 17** (`R17-MICROSOFT-STORE.md`). Android TWA (Play Store 🟡).

### 9E · AI depth
AI study plan from the weakness profile, AI mocks assembled from weak topics (Forge items + PYQs), natural-language search ("show me 2-mark DBMS normalisation questions from 2020+"), voice revision (TTS). Readiness predictor reads calibration with data vintage.

### Other
Flashcards for questions; Telegram phone verification + weekly report; WhatsApp later (🟡).

## Release 10 — Admin console (P6, after stability)

| ID | What | Key acceptance |
|---|---|---|
| 10A | Separate `/admin` sign-in; admins only in `admin_users` seeded by SQL; TOTP 2FA; short sessions; IP allow-list option | No self-sign-up path; every action audited |
| 10B | Roles (owner, admin, moderator, content editor, support, analyst) with fine-grained permissions enforced in Postgres | RLS/security-definer tests per role |
| 10C | Mock management: calendar, papers from blueprint, timing, publish/withhold results, re-rank | A full mock run from the console |
| 10D | Integrity review queue with signals | Approve/exclude with notes |
| 10E | Question, Forge and study-material editing with versioning and second-person review | Diff view, rollback |
| 10F | User management (search, devices, attempts, suspend, quotas, DPDP export/delete) | No impersonation |
| 10G | Dashboards: sign-ups, DAU, retention, mock turnout, item stats, AI usage vs quota, free-tier usage, errors, web vitals | Charts load < 2 s |
| 10H | Money: tiers, coupons, refunds, reconciliation | Matches Razorpay |
| 10I | Communications: banners, announcements, reminders | Scheduled, targeted by branch/tier |
| 10J–10M | Audit log, settings + kill switches, AI pre-generation console, AI request logs with retention | Append-only log; kill switch tested |

**Admin-lite first (idea 36):** before full R10, a protected page for the owner with Forge review queue, reported questions, coupons and mock scheduling.
