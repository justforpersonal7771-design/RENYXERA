# R25 · Battle Arena (live rooms, "scribbl for GATE")

*Living document. Started 31 Oct 2026 from the owner's idea; add every new idea at the bottom under "Idea log". Builds on R19 (async battles, shipped). Rules: zero budget (free tiers only), real server-side grading (the browser never sees the answer key), plan taster for Free ("tease, don't block"), works on phones first, every UI checked desktop + mobile x light + dark.*

## 1. The owner's idea, restated
A group joins a room and picks one topic (or a few). Each round one player is the **Setter**: they choose a question from the bank on that topic and post it. Everyone else answers against the clock. Points depend on **how fast** and **in what order** correct answers come in. The Setter also earns when others get it right (as in skribbl.io, where the drawer is paid for guessers) so setting good questions is rewarded. Players rotate as Setter.

## 2. Research notes (what makes this kind of game work)
- skribbl.io: guessers earn more the faster they guess and the first correct guess is worth most; the drawer earns when others guess, but never more than the last guesser, so nobody wins by only setting. Sources are blogs, not the developer, so **our numbers below are our own design, not a copy** ([overview](https://mechanicsofmagic.com/2022/04/20/critical-play-skribbl-io-4/)).
- Quiz-room games (Kahoot style) keep everyone on the same question at once, show a live answered count, and reveal a leaderboard after each question. This keeps attention and makes short sessions.
- What keeps people coming back: a visible streak, a rematch in one tap, a shareable result, and rooms friends can join from a link.
- Verify on the day: Supabase free-tier Realtime limits (concurrent connections and messages per second) before launch.

## 3. How a round works
1. **Lobby** (host picks topics, rounds 5/8/12, answer time 30/45/60 s, who can join: link or code). 2 to 8 players.
2. **Setter turn:** the Setter sees 3 candidate questions on the chosen topics (from Forge and PYQs) and picks one, or taps "surprise me". The server stores the key; the Setter does **not** see the key beyond what they would see as a normal player unless they choose to (see "Setter knows the answer" in the idea log).
3. **Answer window:** question appears for all; a ring counts down; MCQ/MSQ/NAT supported. Live strip shows who has answered (not what).
4. **Reveal:** correct answer plus the short solution, who was right, points earned, running leaderboard, a one-line "trap" note when most players missed it.
5. **Rotate Setter**, repeat. End: podium, personal best, "your weak topic in this room", rematch, share card.

## 4. Scoring (our own formula, server-computed only)
- Guesser, correct: `base 500 + speed bonus up to 500` where the speed bonus falls linearly with time used, **plus an order bonus**: first correct +150, second +100, third +50.
- Guesser, wrong: 0. MSQ: all-or-nothing as in the exam (no partial in rooms, keeps it simple). NAT: within the question's tolerance.
- Setter: `60 per correct guesser`, capped below the **lowest** guesser score of the round so setting never beats answering.
- Streak: +10% per consecutive correct answer (max +40%).
- Ties break on total time. All timing uses **server timestamps** (the moment the server received the answer), never the browser clock.

## 5. Anti-cheat and fairness
- The answer key and solution never leave the server before the reveal (same pattern as the Forge key loader).
- A player cannot answer twice; answers after the deadline are ignored.
- Setter cannot pick a question they answered in the last 24 h (they would know it) and cannot see others' answers until reveal.
- Tab switching is logged for the room owner but never changes the score (same policy as graded mocks).
- Report a bad question: one tap, removes it from the pool for that room.

## 6. Build plan (zero budget)
| Step | What | Tech |
|---|---|---|
| A | Tables: `arena_rooms`, `arena_players`, `arena_rounds`, `arena_answers` (RLS, no client writes; all writes through API routes) | Supabase |
| B | API: create/join/start, pick question, submit answer, advance round (server clock, idempotent) | Next.js routes |
| C | Live updates: Supabase Realtime broadcast channel per room, with 2 s polling fallback if the socket drops | Supabase free tier |
| D | UI: lobby, setter picker, question + ring, reveal + leaderboard, podium, rematch; works at one screen on phone and desktop | existing design system |
| E | Telegram ping "your friend opened a room" with join link; share card of the podium | existing notify + card pipeline |
| F | Free taster: Free players can join any room and play 3 rooms a week; hosting more than that is Plus ("tease, don't block") | `consume_taster` pattern |

First playable (A to D) is about one working session; E and F follow.

## 7. Out-of-the-box ideas (to evaluate, not yet promised)
See the idea log. Short list: **Trap Room** (every question is a known PYQ trap), **Blitz** (10 s questions), **Team vs team** (branches or friends groups), **Spectator mode**, **Boss round** (everyone vs one very hard question, pooled points), **Setter bluff** (setter also posts a fake wrong option that tempts), **Wager** (stake points before seeing the options), **Last stand** (wrong answer = out until one remains), **Daily room** (a public room at 9 pm with the day's topic), **Leagues** (weekly ladder across rooms), **Study-buddy mode** (collaborative, shared score vs the clock), **Mistake replay** (a room built from the players' own recent mistakes).

## 7b. Decisions made (31 Oct, owner)
- **Setter knows the key** and earns a bonus only when not everyone gets it right (zero if nobody does). Replaces the earlier "60 per correct guesser" rule; the detailed rule is in `R25-ARENA-UX-DESIGN.md` section 2.
- **Hints unlock as the countdown closes** (skribbl-style), each worth fewer points; see the hint ladder in the UX doc.
- **Every player gets to pick** a question in turn, from three face-down cards.
- Visuals and flow are specified in `R25-ARENA-UX-DESIGN.md`. App-wide ideas live in `docs/FEATURE-IDEAS.md`.

## 8. Idea log (add below, newest last)
- 31 Oct: owner idea, rotating Setter with speed and order scoring (this document).
- 31 Oct: Setter earns from correct guesses but capped below the weakest guesser, so answering still matters.
- 31 Oct: "Setter knows the answer" variant: the Setter sees the key and gets a bonus only if **not everyone** gets it right (rewards a hard-but-fair pick). Needs a fairness test with real players.
- 31 Oct: reactions (emoji during reveal) are free to build and add warmth; no free chat in v1 (moderation cost), only preset reactions.
- 31 Oct: seasons: a monthly arena league with a badge, aligned with the Telegram channel's weekly post.
