# Phase 0 audit: Battles/Arena (and the advice doc), As-Is vs To-Be

14 Nov 2026. Read-only audit requested by both ChatGPT handoffs in `chatgpt/` (Battles Complete Design Specification PDF, `RENYXERA_Battles_Claude_Handoff.md`, `RENYXERA-ADVICE.md`). No code was changed for this audit. Evidence is file paths in the repo.

## 1. Repository and deployment inventory
- Repo `D:\0-UI\r2ma-stable`, branch `main`; push to `main` runs CI (type check, lint, build, security/grading/RLS checks) and deploys to Cloudflare Workers via OpenNext. Live: https://gate.renyxera.workers.dev
- Stack: Next.js 16 App Router (Turbopack), React 19, TypeScript strict, Tailwind v4, motion/react, Zustand, IndexedDB; Supabase Postgres + Auth + RLS (Realtime not used); Gemini/OpenRouter free models server-side.
- Migrations hand-applied by the owner: `supabase/migrations/0001` to `0062`.

## 2. Battles feature map (routes and files)
| Area | Route / file | Notes |
|---|---|---|
| Battles page (lobby) | `app/(dashboard)/battles/page.tsx`, `components/battles/battle-lobby.tsx` | Game-style lobby card inside the normal site shell (navbar + dock visible). Owner rejected it. |
| Battle landing / lobby / result | `app/(dashboard)/challenge/[id]/page.tsx`, `components/friends/live-lobby.tsx`, `components/battles/battle-live.tsx` (`BattleResultBoard`) | Ready-up, shared countdown, live result board. |
| Create battle from a test | `app/(dashboard)/setup/page.tsx` (challenge=1 flow), `app/(dashboard)/exam/results/page.tsx` (battleLink) | Battles are built from any test (3 to 200 questions). |
| In-exam VS strip | `app/(dashboard)/exam/session/page.tsx` + `BattleLiveStrip` | Progress sent every 5 s; strip polls `/live` every 4 s. Repositioned 13 Nov (not re-checked in browser). |
| APIs | `app/api/battles/route.ts` (list/create), `[id]/route.ts` (GET landing; POST open/start/progress/finish), `[id]/lobby` (ready/unready/mode), `[id]/live`, `[id]/invite`, `[id]/compare`, `[id]/rematch`, `app/api/friends/route.ts`, `app/api/arena/leaderboard/route.ts`, `app/api/coins/route.ts`, `app/api/coins/shop/route.ts`, `app/api/clubs/route.ts` | All go through `battleCtx` (origin check, rate limit, verified JWT) in `lib/server/battles.ts`, then the service role. |
| Settlement | `lib/server/arena.ts` (`settleBattle`, `award`, seasons by date) | Points 30/15/8, Elo K=24, 10/day cap, coins 20/10/5. |
| Challenge pop-up / DnD | `components/battles/challenge-prompt.tsx`, `lib/battles/pending.ts`, `components/battles/vs-screen.tsx` | Polls every 20 s while visible; held during tests. |
| Shell | `components/layout/client-layout.tsx` | Hides chrome only for exam session/review routes (line ~182); Battles routes inherit navbar, dock, banners. |

## 3. Architecture (as is)
```
Browser (Next.js client) --fetch every 2-5 s--> Worker /api/battles/* (service role, Zod, rate limit)
                                                   |
                                                   v
                                    Postgres: battles, battle_entries, battle_invites,
                                    friendships, points_ledger, ratings, coins_ledger,
                                    clubs, club_members, user_unlocks, exam_attempts/exam_responses
Exam session -> /api/exam/grade (server grading, private keys) -> exam_attempts.server_score
finish -> score copied from the graded attempt -> settleBattle()
```
No Supabase Realtime; "live" is short-interval polling with server timestamps.

## 4. Database objects relevant to Battles
| Table | Migration | Key facts | RLS |
|---|---|---|---|
| battles | 0043, 0046 (owner_score nullable), 0050 (mode async/live, live_start_at, owner_ready_at), 0060 (owner_answered/total/seen) | question_ids text[] frozen at creation; owner_score/max_score copied from server grading | select for owner or joined entrants; insert/update/delete revoked (API only) |
| battle_entries | 0043 | status opened/started/submitted/abandoned; answered, total, score (from graded attempt), attempt_id | select own or owner's battle; writes API only |
| battle_invites | 0048, 0058 (play_now, scheduled_at) | invited_by not null | select policy; writes API only |
| friendships | 0047 | | select policy; writes API only |
| points_ledger, ratings | 0049, 0054 (season awards) | unique (user, battle, opponent) | read own; writes API only |
| coins_ledger | 0061, 0062 | unique (user, kind, ref); `spend_coins()` with advisory lock | read own |
| clubs, club_members, user_unlocks | 0061, 0062 | | unlocks read own; others API only |
Static question bank `public/data/*/questions.json` contains no answer fields (checked keys: question_no, id, type, marks, section, subject, topic, difficulty, text, images, options). Answer keys stay server-side.

## 5. Match lifecycle and rewards (as is)
- Implicit state, no explicit state machine column: async = owner plays (owner_score set) and friends play later; live = lobby ready-up -> server sets `live_start_at` 6 s ahead -> both play -> finish.
- Entry status only moves forward (opened -> started -> submitted). Finish validates the attempt belongs to the user, contains only battle questions, covers >= 80% of them, and was submitted after joining.
- Winner rule today: higher percentage (score/max); equal = draw. (Spec proposes marks -> correct count -> time -> draw.)
- Rewards: ledger upsert idempotent; ratings updated only when both ledger rows are newly inserted, but as a separate write (not one transaction). Coins upsert idempotent.

## 6. As-Is vs To-Be matrix
| To-Be item (spec) | As-Is | Gap |
|---|---|---|
| Full-screen game shell, no site chrome, Exit to study | Battles inside site shell | Missing: route group + layout that hides navbar/dock/banners; exit confirmation |
| Midnight Circuit / Circuit Afterhours art direction, mobile + desktop layouts | Lobby card with ad-hoc arena gradient | Missing |
| Game home, mode select, Arena screen, leaderboard, friends, clubs, shop, profile, settings as game screens | Pieces exist as cards/panels (FriendsPanel, ArenaLeaderboard, ClubPanel, CoinShop, DailyReward) | Re-layout needed; data/APIs exist |
| Live Friend Duel with VS intro + countdown + live progress + result + rewards | Exists (lobby, 6 s start, strip, result board, VsScreen component) | Polish + wire VS into the live path; rewards screen missing |
| Async and Scheduled duels | Exist | UI only |
| Ranked Arena matchmaking (real opponents, widening range, honest empty state) | Missing | New queue table/API, fixed server-selected 10-question set |
| Quick Clash, Daily Challenge, Subject/Topic duel | Missing | New modes (V2 per both specs) |
| Tiers, XP/levels, badges, missions, season track | Seasons by date + top-10 awards (0054); rest missing | New, needs owner approval |
| GATE-marks tie-break (marks -> correct -> time) | Percentage, then draw | Scoring change, owner decision |
| Match state machine (CREATED -> ... -> COMPLETED) | Implicit | Optional: explicit status column |
| Realtime channel per match | Polling | Optional; polling works within free tier |
| Integrity events table | Exam integrity signals recorded with attempts | Battles-specific table missing |
| Emotes, share card, spectating | Missing (spectating deferred by both) | V2/V3 |

## 7. Security and scoring risks found
1. Rating update is not in the same transaction as the ledger insert (low risk: guarded by "both rows new").
2. `/api/battles/[id]` GET returns `questionIds` to anyone with the link (ids only, no answers) - acceptable, but ranked mode must not reveal the set before start.
3. Live start relies on clients polling; no server-side deadline enforcement per battle (time limit comes from the exam session config).
4. Repeat-opponent farming: capped only by the 10/day points cap; coins have no daily battle cap.
5. Owner progress columns (0060) are written without validation against the owner's actual attempt (presentation only; scores still server-graded).

## 8. Proposed file-level plan (V1, needs approval)
1. `app/(game)/play/layout.tsx` + route group for game screens (no navbar/dock/footer), `components/game/*` shell with mobile bottom nav and desktop left rail, Exit-to-study dialog; Battles nav item opens `/play`.
2. Game tokens (separate from app tokens) in `app/game.css`; one art direction chosen by the owner.
3. Screens reusing existing APIs: home/lobby, mode select (Live duel, Async, Scheduled; Ranked shown as "coming soon" until the queue exists), Arena (rating, tier, season countdown, leaderboard), friends, clubs, shop/locker, profile card, settings (sound/haptics/motion).
4. Live match path: existing lobby -> VsScreen -> countdown -> exam session with game wrapper -> result -> rewards screen (reads ledger/coins written by the server).
5. QA: phone + desktop, light + dark irrelevant inside the game (own theme), reduced motion, keyboard; build and browser checks.
6. V2 only after approval: ranked queue, Quick Clash, tiers/XP/missions, tie-break change, share card.

## 9. Owner decisions needed (merged from both specs and the advice doc)
1. Game shell route `/play` (full screen) - approve.
2. Art direction: "Midnight Circuit" (spec 1) vs "Circuit Afterhours" (handoff) - pick one (I will show both on one screen).
3. Ranked matchmaking in V1 or V2 (advice doc D07/D08 says defer until queue and empty states are ready).
4. Ranked format 10 Q / 10 min; Quick Clash 5 x 60 s.
5. Tie-break change to marks -> correct -> time.
6. Practice bots (labelled, never rated): yes/no.
7. Tier names; XP/levels/missions/badges now or later; soft season reset.
8. Battle coin cap (100/day) and repeat-opponent limit.
9. Mentor boosts inside the game shop or only in the app.
10. Dark mode for the main app: the advice doc recommends "Quiet graphite, lifted surfaces" with NO coloured top stripe on every panel - this contradicts the current "Edge" default; choose.

## 10. Not verified
- Live two-player answering end to end (test account reached the exam together and saw each other at 0/5; answering automation did not click options).
- Mobile reconnect after network loss.
- Supabase Realtime limits on the free tier for this project.
- The `.claude/skills` and `.claude/agents` pack mentioned in `chatgpt/README_INSTALL.md` is not in the folder (only CLAUDE.md and README were uploaded); nothing was installed. Third-party skills should be reviewed before installing.
