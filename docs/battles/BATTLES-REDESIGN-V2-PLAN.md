# Battles redesign v2: reorganising the whole experience

18 Nov 2026. Owner: "I didn't like anything from Battles; redesign means reorganising everything, not reskinning components." This plan changes the structure, the flows and what each screen is for. The Duel Table look (baize, walnut, brass chess clock) is the material; this document is the architecture.

## 1. What is wrong today (structure, not looks)

| Today | Why it does not feel like a game |
|---|---|
| Starting a battle sends you out of the game into the study app's test builder ("Configuration Engine") | A game never makes you fill a form in another app to start a match |
| The match is played in the normal exam screen with a small strip on top | The most important moment (the duel itself) has no game feel at all |
| Lobby shows stats cards, menu buttons, tickets, daily reward all at once | No single focus; reads like a dashboard |
| Eight screens of equal weight (Play, Arena, Matches, Friends, Clubs, Shop, Me, Lobby) | Games have one home and a few doors, not a sitemap |
| Results land on the study results page; rewards are text | No payoff moment, no reward animation, no "play again" |
| Challenges, daily reward and coins live in panels | Games put these in the HUD (inbox, chest, currency) |

## 2. New structure (what lives where)

```
LOBBY (the table)  ── the only home
 ├─ HUD top:  [avatar + rating]            [coins] [inbox ✉ count] [exit]
 ├─ Table:    the chess clock = your next match
 │            PLAY (brass) ── opens MATCH SETUP as a sheet on the table
 ├─ Table edge: daily chest (claim on the table), season plaque
 └─ Dock (4): Play · Ranks · Friends · Profile
      Ranks    = ladder + season + tier track (Arena merged here)
      Friends  = friends + requests + clubs (club is a tab here)
      Profile  = player card + match history + locker (frames) + shop
```

Removed as separate screens: Matches (moves into Profile > History), Shop (Profile > Locker & shop), Clubs (Friends > Club), Arena (Ranks), Me (Profile). Challenges move to the HUD inbox.

## 3. New match flow (all inside the game, never the study app)

1. **PLAY** → match setup sheet slides up on the table (one screen, three choices, big tap targets):
   - **Who:** a friend (online first, live) · send to a friend to play later · scheduled.
   - **What:** subject chips from the learner's branch (or "Mixed GATE"), optional topic.
   - **Length:** Quick 5 · Standard 10 · Long 15 questions (time per question shown).
   The server-side battle is created from these choices (question ids picked from the official PYQ bank by subject/topic; existing `POST /api/battles { question_ids }` already accepts this). No test builder.
2. **Lobby room:** both chairs at the table, ready buttons, the clock shows both names (existing ready-up + 6 s server start).
3. **VS:** the clock turns to face the camera, both faces light, 3-2-1 from the server timestamp.
4. **In-match screen (new, game-styled, not the exam screen):** question card on the table, options as large tiles, the chess clock at the top showing both players' progress and time; your answers are saved and graded by the same server grading. MCQ/MSQ/NAT supported with GATE marking.
5. **Result:** the clock stops, flag falls for the slower player, scores flip in, winner plaque, points and coins fly into the HUD, rating change; **Rematch** and **Back to table**. "Where the marks went" per subject below.
6. Async/scheduled reuse steps 1, 4 and 5; the friend gets an inbox ticket.

## 4. Features to add (in order)

1. In-game match setup (no test builder).
2. Game-styled in-match screen (reuses server grading and anti-cheat signals).
3. Result + reward screen with rematch.
4. HUD inbox for challenges; daily chest on the table.
5. Ranks: tier track along the rating (names need your approval, D12), season countdown, weekly ladder.
6. Profile: player card, match history, locker (frames), shop.
7. Sound (muted by default) and haptics toggle.
8. Later, after approval: ranked queue (D08), quick duel timer (D10), missions (D14).

## 5. Build order (each step shippable)

A. Lobby + HUD + dock reorganised (4 doors; inbox; chest).
B. Match setup sheet + battle creation from subject/length.
C. In-match game screen.
D. Result/reward screen + rematch.
E. Ranks / Friends+Club / Profile screens.
F. Polish: sound, haptics, reduced motion, phone + desktop checks.

Skills on every step: ui-ux-pro-max, impeccable, hallmark, unslop, emil-animate / emil-choreograph, lottie motion-design, interaction-design, design-critique, accessibility-review.
