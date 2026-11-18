# Citadel game design: merged from the two Gemini reports (18 Nov 2026)

Sources: `report-gemini.md` (130 KB) and `report-gemini-2.md` (111 KB), both answering `MASTER-PROMPT-GEMINI-GAME-DESIGN.md`.
They agree on nearly everything. This file records what we adopt, where they differ, what is built first, and what the owner decides.
A third report can be merged into this file later without changing the structure.

## 1. What both reports agree on (adopted)

| Area | Decision |
|---|---|
| World | One isometric island citadel. Town Hall in the middle, 11 subject buildings, levels 0 to 5. Same building names we already use (Kernel Keep, Query Vault, Signal Tower, Algorithm Forge, Automata Observatory, Compiler Works, Engine House, Logic Gatehouse, Code Workshop, Maths Library, Aptitude Grounds). |
| Rendering | Layered SVG world plus one Canvas 2D layer for small effects (water, fireflies, dust). No PixiJS or Three.js now (0 KB engine, sharp at any zoom, real buttons for screen readers). |
| Never leave the game | Training, question solving, mistake repair, results, clan, shop and settings all happen inside `/battles`. Only the Exit door leaves. |
| Honesty | No bots, no fake players, no fake queue counts. When no one is online, offer a recorded run of a real player (clearly labelled) or a solo drill. |
| Levels from learning only | Building level comes from real answers, never coins or plan. Anti-farming: unique questions, coverage across topics, accuracy that needs volume. |
| Non-punitive decay | A level once earned is kept. A building not practised for about 17 days shows rust and defends weaker until a 5-question repair. |
| Solo modes | Blitz Rush (5 min, 3 strikes, mixed subjects), Topic Siege (10 questions, one topic, untimed, explanation after each), Daily Trial (same 10 questions for everyone, IST midnight reset), Breach Repair (5 from your mistakes), Archive Boss (a real past-paper block, later). |
| Attack and defend | Async, Clash-style. You attack a real player's building and answer the set they recorded; their timings replay beside you. 1 to 3 stars (50% marks, beat their score at 65%, beat it at 85% with no wrong MCQ). Shields after 2 or 3 star losses. Revenge for 48 hours. An unrecorded building is shown as "Unfortified (par 50%)" and its owner loses nothing. |
| Rating | Keep the live Elo (start 1000, K 24). Five leagues: Aspirant, Qualifier, Ranker, Topper, Legend. 4-week seasons. |
| Clans | Up to 30 members, Indian role names (Acharya, Senapati, Dhwaja, Sadhak). No free-text chat: automatic chronicle, one-tap study signals, a few emotes. Weekly co-op war against a real past paper split into 11 bastions; weekend clan-vs-clan raid. |
| Economy | Coins as today. A second prestige currency (Mastery Seals) that cannot be bought, earned only by 3-star mastery. Shop sells looks only. |
| Look | Warm sandstone, terracotta, walnut, brass, jade-sage water. No purple or blue anywhere. No glow, no glass blur, no rainbow gradients, no emoji icons. Hard 2 to 3 px walnut shadows. |
| Time of day | Dawn, day, dusk and night from IST, changing sky and lamps. Night is low-glare for late study. |
| Motion | 18 named animations with exact timings and reduced-motion versions (button press 160 ms, doors 620/480 ms, star stamps 340 ms staggered 220 ms, coin flight 580 ms, sheet 280 ms). Camera pans with inertia, zoom 0.75 to 1.85, tapping a building glides to it. |
| Sound | Original, synthesised in the browser with Web Audio (0 KB downloads): tanpura drone, plucked santoor (Karplus-Strong), tabla hits, brass bells. Raag by time of day (Bhairav dawn, Yaman day and dusk, Bhupali night). 22 effects with exact recipes. Muted on first visit, with a clear "Sound off, tap to turn on" control. Compressor on the master bus. |
| Settings | Master sound, music, effects, haptics (hidden on iPhone, where vibration is not supported), reduced motion, low-power mode, colour-blind safe colours with shape icons, text size. |
| Server authority | The browser never decides a score, a star, a level or a reward. |

## 2. Where they differ, and what we pick

| Topic | Report 1 | Report 2 | Pick |
|---|---|---|---|
| Building level formula | Coverage + accuracy + recency (similar) | `M = 100 x (0.40 coverage + 0.40 Bayesian accuracy + 0.20 hard-question depth) x recency`, thresholds 8 / 24 / 43 / 62 / 80 | Report 2's formula, server-side, in V2. V1 keeps today's simple shown rule (attempted and accuracy per level) because it already works on real data and the student can read it. |
| Town Hall | Average level | Floor of average level (TH 0 to 5) | Keep ours (average + 1, so a new player starts at TH 1). |
| League bands | 0 / 1050 / 1150 / 1300 / 1500 | 950 / 1150 / 1400 / 1700 with sub-tiers | Owner decision D5. |
| Fonts | Fraunces or Newsreader, Plus Jakarta Sans, JetBrains Mono | Same | Owner decision D6 (we use Russo One + Chakra Petch now). |
| Signature detail | Courtyard astrolabe gaining a gold tooth for each subject at level 3+ | Brass astrolabe and wax-seal stamp on every win | Both: astrolabe on the Town Hall (report 1), seal stamp on results (report 2). |

## 3. Built first (this pass), because the owner already asked for it

1. **In-game training.** Tapping a building and choosing Train opens a full-screen round inside the game. Blitz Rush for one building's subjects: 5 minutes, 3 strikes, answer checked by the server after each question. The round is saved as a normal submitted test and graded by `/api/exam/grade`, so the building level moves from real data. No redirect.
2. **Results inside the game.** Correct, wrong and skipped, marks, and what changed on the building.
3. **Data timing fix.** The citadel waits for the question bank before working out levels, so buildings no longer show level 0 while data loads.
4. **Doors.** The RENYXERA mark no longer sits over the door handles; Exit now closes the doors (480 ms), then leaves.
5. **One menu.** The orbs that repeated the dock are gone. The dock has Citadel, Train, Attack, Clan, Leagues; Friends, Inbox and Daily sit as small badges on the citadel top bar.
6. **Sound and Settings.** Web Audio engine with the first effects (tap, door, correct, wrong, star, coin) and a quiet tanpura drone; muted by default; Settings panel (sound on/off, music and effects volume, haptics, reduced motion, low power).

## 4. Next (V1 remainder), in order

1. Topic Siege and Breach Repair (needs topic list per building and the mistakes bank inside the game).
2. Async attack with recorded defence sets (needs a `defense_blueprints` table: owner-run migration).
3. Stars, trophies, shields, revenge on the server.
4. Daily Trial (global seed per IST day).
5. Clan and Leagues screens redrawn to match the Citadel.
6. Living world: IST sky cycle, walking scholars, lamps, water, rust.
7. Tutorial (Code Workshop, 3 starter questions).

## 5. Owner decisions

| # | Decision | Recommended |
|---|---|---|
| D1 | Add Mastery Seals (cannot be bought) in V2, coins only in V1 | Yes |
| D2 | Clan talk: no free-text chat, only automatic chronicle, study signals and emotes | Yes |
| D3 | Unrecorded buildings shown as "Unfortified (par 50%)", owner loses no rating | Yes |
| D4 | Non-punitive decay: level kept, rust shown, 5-question repair | Yes |
| D5 | League bands: keep ours (1050/1150/1300/1500) or report 2's (950/1150/1400/1700 with sub-tiers) | Report 2's, with provisional K 36 for the first 10 matches |
| D6 | Game fonts: keep Russo One + Chakra Petch, or move to Fraunces + Plus Jakarta Sans + JetBrains Mono | Move to report fonts for headings and numbers; keep the app font for question text |
| D7 | Live queue: at 25 seconds with no one found, offer a recorded rival or keep the lobby open while you drill | Yes |
