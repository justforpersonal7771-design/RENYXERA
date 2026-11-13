# Review of design spec 1 (ChatGPT, "RENYXERA Battles Complete Design Specification", 35 pages)

Reviewed 14 Nov 2026 against the codebase. Second spec still to come; this file keeps the findings so the two can be merged.

## What the spec proposes (short)
- A full-screen game shell (own layout, no site navbar/dock/footer, "Exit to study"), art direction "Midnight Circuit": #111827 base, #1C2740 panels, #283653 raised, #8585E8 primary, #8DB9F0 secondary, #E6C58C rewards, #F2F3FA text; Sora/Manrope kept.
- Arena central: tiers Circuit Initiate <1100, Logic Runner 1100, Signal Specialist 1250, Core Engineer 1400, Vector Master 1550, Quantum Elite 1750, Apex Engineer 2000+.
- Modes: Live Friend Duel, Async, Scheduled (existing); Ranked Arena with real matchmaking (+/-100 -> 150 -> 200, stop at 45 s, never fake); Quick Clash (5 Q x 60 s); later Subject/Topic Duel, Daily Challenge, Club Wars, tournaments.
- Scoring: real GATE marks; tie-break marks -> correct count -> time -> draw.
- XP and levels (100 + 50(L-1) per level), badges, missions (3 daily, 4 weekly), free season track, soft rating reset 1000 + 0.75(R-1000), battle-coin cap 100/day, repeat-opponent limit, emotes only (no chat), result share card (V2), no spectating.
- Tech: one private Supabase Realtime channel per match (presence + broadcast), DB as truth, match state machine, reconnect rules, integrity signals.
- V1 (2 weeks): shell, mobile + desktop home, mode select, Arena, VS intro/countdown, in-match wrapper, results, rewards, friends/clubs, shop/profile, a11y/perf, QA.

## Answers to its audit questions (section 14.6), from the code
| # | Question | Answer today |
|---|---|---|
| 19 | Own layout for Battles without breaking auth? | Yes. A route group with its own layout can hide the site chrome; client-layout already hides chrome on some routes (exam). |
| 20 | Exam screen supports a competitive wrapper? | Yes, already: the live battle strip sits on top of the exam screen (repositioned 13 Nov, not yet re-checked in a browser). |
| 21 | Question set frozen server-side? | Yes: `battles.question_ids` fixed at creation; scores copied from server-graded `exam_attempts`. |
| 22 | Realtime channel private and authorised? | No Realtime used yet: live state is polled through authenticated API routes (lobby 2 s, progress 5 s, live room 4 s). |
| 23 | Elo and points transactional? | Partly: ledger upsert is idempotent (unique user/battle/opponent) and ratings only move when both rows are new, but the rating update is a separate write, not one transaction. |
| 24 | Coin rewards idempotent? | Yes: `coins_ledger` unique (user, kind, ref); spending is one locked SQL function. |
| 25 | Opponent answers protected? | Answers are read only by service-role APIs; the subject comparison opens only after both submitted. Needs a check that no route returns answers early. |
| 26 | Scheduled time zones? | Stored as ISO with +05:30 from IST pickers; shown in IST. |
| 27 | Records distinguish ranked/async/scheduled/practice? | Only `mode` async/live, plus `scheduled_at`/`play_now` on invites. No ranked or practice yet. |
| 28 | Mobile reconnect after refresh? | Exam session survives refresh (local store); live strip resumes polling. Not tested on a network drop. |

## Gaps between the spec and what exists
- Ranked random matchmaking does not exist (all battles are friend-based). With few players, an honest "no opponent" state will be common; the spec handles this.
- No XP/levels, tiers, missions, badges, season track, emotes, Quick Clash, share card yet.
- Battle question count is chosen in the test builder (3 to 200); the spec's fixed 10-question ranked set and per-match timer are new.
- Tie-break by correct count and time is new (today: higher percentage wins, equal is a draw).

## Decisions it asks the owner for (section 14)
Ranked length 10 Q / 10 min; Quick Clash 5 x 60 s; tie-break order; practice bots yes/no; repeat-opponent limit; 60 s lobby timeout; tier names; soft reset; coin cap 100/day; 3 daily + 4 weekly missions; Mentor boosts in the Battles shop or not.
