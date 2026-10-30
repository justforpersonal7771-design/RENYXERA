# Release 19 — "Beat my score" battles with live status (bug list item 1, 26 Oct)

**Today:** the challenge link carries the question ids, score and name in the URL (`challengeUrl`); the friend's result is only shown to the friend. The sender never learns whether the friend opened, started, finished or won.

## Goal
The sender (and the friend) can see, live: link opened → test started → in progress (answered n/65, time left) → submitted → result and who won; a message to both at the end.

## Design
- **Migration `0043_battles.sql` (applied 30 Oct; 0041/0042 were taken):**
  - `battles` (id uuid, owner, question_ids text[], owner_attempt_id, owner_score, max_score, title, created_at, expires_at)
  - `battle_entries` (battle_id, user_id, status opened|started|submitted|abandoned, answered, attempt_id, score, started_at, submitted_at, last_seen_at)
  - RLS: owner and participants read their battle rows; writes only through security-definer RPCs: `create_battle(attempt_id)`, `join_battle(id)`, `battle_progress(id, answered)` (rate-limited, called every 30 s by the exam page), `finish_battle(id, attempt_id)` — **score taken from the server-graded attempt**, never from the client.
- **Link:** `/challenge/<battle id>` (short, no score in the URL). Guests can play but must sign in to appear on the battle board (nudge sign-in).
- **Live view:** battle card on the sender's dashboard and results page: avatars/names (display choice respected), status chips, progress bar, time left; updates every 15 s (polling; Supabase Realtime later).
- **Result:** at submit, both see "You won by 6.33 marks" / "Aarav beat you"; topic-by-topic comparison (where each lost marks); rematch button; share card (approved style) with consent.
- **Notifications:** Telegram bot message to the sender when a friend starts and finishes (if linked); in-app toast.
- **Anti-cheat:** the friend's attempt uses the normal integrity rules; a battle shows "integrity flags" if the attempt was disqualified.
- **Limits:** Free: 3 active battles; Plus/Pro: unlimited; battles expire after 7 days.

## Done when
Two real accounts: sender sees opened → started → progress → submitted with the right score and winner; Telegram message received; mobile/desktop × light/dark verified.

## Built 30 Oct 2026
Tables `battles`, `battle_entries`; API `POST/GET /api/battles`, `GET/POST /api/battles/[id]` (actions open, start, progress, finish); page `/challenge/<id>`; live board `/battles`. The score is always copied from the server-graded `exam_attempts` row; a friend's attempt must contain only the battle's questions, cover at least 80% of them and be submitted after joining. Not yet built: Telegram ping, topic-by-topic comparison, rematch, Supabase Realtime (polling for now).
