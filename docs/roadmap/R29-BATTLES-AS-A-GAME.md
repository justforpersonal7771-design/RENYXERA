# R29: Battles as a game (friends, presence, two modes, points)

[← Docs index](../README.md) · [Open items](../open-work/OPEN-ITEMS-2026-11-06.md)

*2 Nov 2026. Extends [`R25-BATTLE-ARENA.md`](R25-BATTLE-ARENA.md) and [`R25-ARENA-UX-DESIGN.md`](R25-ARENA-UX-DESIGN.md). Owner brief: treat Battles and Arena like a game (8-ball-pool feel): friends with active or inactive status, friend requests inside RENYXERA, leaderboard, points, a combined end result, and two modes: concurrent, and asynchronous (one submits, the other submits later, then the result is evaluated).*

## 1. What the game loop is
Invite a friend (or a stranger from the leaderboard) → pick the paper (topic, count, time) → play → see ONE combined result screen → points move → rematch in one tap. Same loop as pool apps: a friends list with a green dot, a "Play" button on each friend, a lobby, a result with both players side by side, a rematch button, a ladder.

## 2. Two modes
| | Concurrent ("Live") | Asynchronous ("Pass the paper") |
|---|---|---|
| How | Both players start together on the same questions, timer shared | Player A plays any time and submits; B gets a notification and plays within 24 h |
| Result | Combined result as soon as both finish (or the timer ends) | Combined result the moment B submits; A is notified |
| Needs | Presence plus Supabase Realtime channel for the lobby and "opponent finished" | Only the database and a notification (bell, Telegram when linked) |
| Free-tier fit | Realtime free limit is 200 concurrent connections: fine for launch, polling every 5 s as fallback | Fully free, works today with `battles` plus `battle_entries` |
| Expiry | Opponent absent 2 minutes after start: play on alone, result waits (turns into async) | Unanswered for 24 h: A's score stands, challenge closes with "no reply" |

Async mode is what challenge-first (migration 0046) already does: the owner finishes first and the friend answers later. So **async is mostly built**; live mode is the new work.

## 3. Friends and presence
- **Friend request inside the app:** search by username (the unique username already exists) or from a result card link. Send, accept, decline, remove, block. Rate limit 20 requests a day.
- **Presence:** "Active now" (seen in the last 2 minutes), "Studying" (inside a session, only if the student allows it), "Away" (under 1 hour), "Offline". Shown as a dot on the friend row. A privacy switch in Profile: "Show when I'm online" (default on for friends only).
- **Cheap presence on the free tier:** a `last_seen_at` column updated at most once a minute while the app is open (one tiny write); live mode adds a Realtime presence channel only inside the lobby. No always-on socket for everyone.

## 4. Points, levels and leaderboard
- **Arena Points (AP)** ledger: win +30, draw +15, loss +8 (so trying always pays), +5 first battle of the day, +10 win streak of 3, bonus for beating a higher-ranked friend. Cap 10 battles a day for points so farming does not pay.
- **Rating:** Elo-style number (start 1000, K=24) used for matching and the ladder; AP is the visible "XP".
- **Leaderboards:** Friends (weekly), Everyone (weekly and all-time), Branch. Weekly resets Monday 00:00 IST. Top three get a badge on their avatar for the week.
- **Seasons:** 4-week seasons with a themed reward (a Look trial, a card frame). Rewards are cosmetic, never exam content.
- **Anti-cheat basics:** same questions in the same order for both; answer time recorded; a battle is void if either player's session was opened in two tabs; only graded server-side.

## 5. Combined result screen
Header "You beat Riya 18 to 15" or "Draw". Two columns (You | Friend): score, accuracy, time, per-subject bars, question-by-question strip (who got each right, who was faster). Buttons: Rematch (same or new paper), Review answers (solutions), Share card, Add friend (if a stranger). Shows points earned and rating change. Same on desktop and phone, full width.

## 6. Data model (new migration 0047, to be written with the build)
```
friendships(user_a, user_b, status pending|accepted|blocked, requested_by, created_at)  -- one row per pair, a<b
profiles.last_seen_at timestamptz, profiles.show_presence boolean default true
battle_mode on battles: 'async' | 'live'
points_ledger(id, user_id, kind, amount, battle_id, created_at)
ratings(user_id, rating, season, updated_at)
```
RLS: a user reads only their own friendships, ledger and the ratings of friends or the public weekly top 100. Results are computed by a SECURITY DEFINER function `finish_battle(battle_id)` called when the second entry lands, so points cannot be forged from the client.

## 7. Build order (each step ships on its own)
1. **Friends** (requests, accept, list, remove, block, presence dot) and "Challenge" button on each friend. *Free, no realtime.*
2. **Async polish:** notification when a friend finishes, 24 h expiry, combined result screen, rematch.
3. **Points and weekly leaderboard** (ledger, Elo, Friends and Everyone tabs).
4. **Live mode:** lobby, ready check, shared start, "opponent finished" via Realtime with polling fallback.
5. **Seasons, badges, per-question speed scoring, hints** (R25).

## 8. Tease, don't block
Free: 3 active battles, friends list, async mode, weekly leaderboard view. Plus and Pro: live mode, unlimited battles, season rewards, rematch history, private rooms of up to 4.

## 9. Open decisions for the owner
- Show real names or usernames only to non-friends? (Recommend usernames only.)
- Should strangers be matchable ("Quick match") at launch, or friends only first? (Recommend friends only first: no moderation burden.)
- Telegram notification when a friend challenges: on by default for linked users?

## Decision (3 Nov 2026): async battles keep the 7-day expiry
The owner left the 24 h question to me, to be revisited later. Kept at 7 days: friends study on different schedules, a 24 h window would turn many challenges into "expired" before the friend opens them, and live battles are already time-boxed by the lobby. Free accounts' active-challenge cap still limits slot hogging. To change later: the `expires_at` default in migration 0044 and the "7 days" text in [`app/api/battles/route.ts`](../../app/api/battles/route.ts) and `[id]/rematch/route.ts`.

## Chunk audit (3 Nov 2026)
The four biggest JS chunks are DiceBear avatar style JSON (two, loaded on demand), recharts (deferred) and Sentry (deferred). Nothing to fix.
