# R25b · Arena UX and visual design (the room, round by round)

[← Docs index](../README.md) · [Open items](../open-work/OPEN-ITEMS-2026-11-06.md)

*31 Oct 2026. Companion to [`R25-BATTLE-ARENA.md`](R25-BATTLE-ARENA.md) (rules and build plan). Owner decisions: the **Setter knows the key** and earns a bonus only when not everyone gets it right; **hints appear as the countdown closes** (the skribbl letter-reveal idea); **every player gets a turn to pick a question**; the screen must feel like a game, not a form. Built with the existing pastel system ([`docs/design/DESIGN-SYSTEM.md`](../design/DESIGN-SYSTEM.md)): thick ink outlines, offset shadows, sticker tilts, tint colours per role. Research notes at the end; items marked "verify" need a real-player test.*

## 1. Design idea in one line
**A game-show stage on a phone.** One question lives centre stage; the countdown is a physical object (a fuse that burns down); hints are the fuse's sparks; players are small characters on a rail that react in real time. Everything you do (answer, bluff, react) has a visible, instant consequence.

## 2. The hint ladder (the skribbl letter-reveal, for GATE)
skribbl shows the letter count first, then reveals letters as time passes; guessers who wait get easier clues but fewer points. Our equivalent is a **ladder of clues that unlock on the countdown**, each one cheaper to answer and worth fewer points:

| Time left | Clue unlocks | Points multiplier | Feel |
|---|---|---|---|
| 100 % to 66 % | None. Only the **shape** shows: type chip (MCQ / MSQ / NAT), marks, topic, and for NAT the number of digits as boxes (`_ . _ _`) | x1.00 | "Can you do it cold?" |
| 66 % | **Strike one**: one wrong option is crossed out (MCQ/MSQ). NAT: the unit and the sign are revealed | x0.85 | first spark |
| 40 % | **Topic nudge**: the exact subtopic and the formula family appear (for example "Master theorem, case 2") | x0.70 | the fuse hisses |
| 20 % | **Strike two**: a second wrong option goes; NAT shows the first digit and the range (`1_._`) | x0.55 | tension |
| 8 % | **First step**: the Setter's one-line first step appears (they write or pick it when posting) | x0.40 | last gasp |
| 0 | Reveal. Missed = 0 | | |

Rules: hints are **the same for everyone and server-timed** (nobody can unlock early); a hint **already used on screen cannot be taken back** (the multiplier is read from the server clock at the moment the answer arrives, so it is fair across devices). Hints are generated from data we already hold: wrong options from the key, subtopic from the tag, first step from the solution text (Forge items carry a worked solution). Setter sees "hints unlocked" counting on their side too, which feeds the Setter bonus below.

**Setter bonus (owner's variant):** the Setter knows the key. Their bonus is `120 x (1 - correct_share)` where `correct_share` is the fraction of players who got it right, **but zero if nobody got it right** (no reward for an unfair or broken question). So the best pick is hard but fair: about 30 to 60 % getting it right. After the reveal the Setter sees "Perfect pick" / "Too easy" / "Nobody got it, report?" with the number. This teaches question quality, which is useful for GATE itself.

## 3. Everyone gets to pick
- **Turn order** is a spinning rail of avatars; the next Setter is highlighted with a short "your pick" drumroll.
- **Pick screen (the Setter's stage, 20 s):** three **mystery cards** face down, each showing only topic, difficulty heat (1 to 3 flames), type and marks. The Setter can flip **one** card to peek (the same preview hint rule: a peek costs 1 of 3 "peeks" per game) and then **locks it in** by dragging it onto the stage. Auto-picks if time runs out.
- **Curveball (once per player per game):** after picking, the Setter may play a power card: **Double or nothing** (Setter bonus x2 but zero if more than 70 % are right), **Blackout** (no strike hints on this question), or **Slow burn** (the hint ladder shifts 10 % later). Power cards are visible to everyone on the card, so the table can react ("Blackout!").
- **Draft** (Boss mode): all players pick one card each and the table votes the final question (see ideas).

## 4. Screens, as a flow
```
Join link / code
   |
LOBBY ── avatars drop onto a bench as they join, host picks topics (chips), rounds, timer, mode; start ring fills when ready
   |
INTRO (3 s) ── "Round 1 of 8: Eli is setting" ── curtain wipe, topic stamp thumps in
   |
PICK (Setter only; others see the Setter's three face-down cards shake)
   |
STAGE ── question card, fuse timer, hint ladder, answer dock, player rail
   |
LOCK-IN (per player, instant) ── your avatar jumps onto the "answered" rail; order badge 1st / 2nd / 3rd appears
   |
REVEAL ── 1.6 s suspense beat, correct option lights up, wrong options fall away, points fly from each avatar to the scoreboard, the Setter's pick verdict stamps in
   |
LEADERBOARD ── rows slide into new ranks, risers spring, streak flames, 3 s
   |  (next round, rotate Setter)
PODIUM ── confetti, awards (Fastest finger, Best Setter, Comeback, Trap survivor), rematch, share card
```

### 4.1 Stage layout (phone, portrait, one screen, no page scroll)
```
+--------------------------------+
| [Round 3/8]  Trees   [x2 power]|  top strip: round, topic stamp (tilted sticker), active power card
|                                |
|   ((  FUSE TIMER  ))    00:23  |  big ring on phones; a burning rope across the top on desktop
|                                |
|  +--------------------------+  |
|  | Q  question text + math  |  |  question card, tinted by topic; wide formulas scroll inside
|  |  [hint chip] [hint chip] |  |  unlocked hints slide in as stickers beneath the question
|  +--------------------------+  |
|  (A)  (B)  (C)  (D)           |  answer tiles: 2x2 on phone, big thumb targets; struck options crack and drop
|                                |
| o  o  o  o  o  o  o            |  player rail: avatars; filled = answered; order badges 1 2 3
| [ react: 😮 🔥 💀 🤝 ]          |  4 preset reactions, no free chat in v1
+--------------------------------+
```
Desktop (one screen, no scroll): stage in the centre (about 60 %), player rail as a vertical "podium column" on the left (live rank), hint ladder and power cards on the right. Test sizes: 1920x912, 1440x900, 1366x768 and phone 390x844.

### 4.2 Visual language
- **Palette:** keep the unified pastels; assign each **role** a colour: Setter = butter (gold crown), correct = mint, wrong = rose, hints = sky, power cards = lilac, timer = a warm-to-hot ramp (mint to butter to peach to rose). Dark mode: same hues, soft slate edges (not white), glow instead of borders on the timer.
- **Type:** the app's display face for the question topic stamp and numbers; tabular numbers for scores and the timer so digits never jitter.
- **Timer = fuse:** a rope with a spark travelling along it, the rope thinning as time burns; the sparks throw tiny particles when a hint unlocks. In the last 5 s the whole stage edge pulses softly and a heartbeat tick plays (sound off by default, one tap to enable).
- **Hint unlock moment:** a short "ting", the fuse flashes, the new sticker slides in tilted and settles. Struck options crack along a line and fall (not a plain fade).
- **Avatars:** the users' existing avatars (premium avatar styles reward Pro), a small crown on the Setter, a flame when on a streak of 3.
- **Reveal choreography (the bit people remember):** 1) a hush: the timer fuse goes out; 2) answer tiles flip; 3) the correct tile glows and the table's choices appear as small avatars on the tiles they picked (so you see the crowd split); 4) points float from each avatar; 5) the Setter's verdict.
- **Reduced motion:** every animation has a still fallback (static fuse bar, instant tile state); sound and haptics are optional (a short haptic on lock-in on phones that support it).
- **Accessibility:** colour is never the only signal (icons and labels on correct/wrong); timers announced at 10 s and 3 s to screen readers; 44 px minimum targets.

## 5. Sound and feel (all free assets, or generated tones)
Soft tick on the fuse in the last 10 s, ting on hint unlock, thump on topic stamp, short fanfare on podium. Tones generated with the Web Audio API (no files, no cost). Master mute remembered per device.

## 6. Technical notes that shape the design
- **Everything time-based is driven by one server timestamp** (`round.started_at`, `round.ends_at`). Clients compute the fuse and the hint stage from the synced server offset, so the animation matches the server's scoring clock. Hint stage at answer time is **computed on the server** from the receipt time.
- Realtime: Supabase Realtime broadcast per room, with a 2 s polling fallback (verify the free-tier limits on the day). Keep payloads tiny: who answered (not what) until the reveal.
- Heavy visuals use CSS transforms and the existing Motion library (already installed); no new dependency needed for confetti (a 60-line canvas burst).
- Hints generator is a pure function of the question's key and solution; unit-test it so a hint never gives away the answer before its stage (for example never strike the correct option).

## 7. Build order for the Arena UI
1. Static stage with the fuse timer, ladder and answer tiles fed by a fake round (a design sandbox page, light and dark, phone and desktop) so the look is approved before any backend.
2. Reveal choreography and leaderboard motion on fake data.
3. Pick screen with flip, peek and power cards.
4. Lobby and podium.
5. Wire the server (rooms, rounds, answers) and the hint scheduler.
6. Sound, haptics, reactions.

## 8. Research notes
- skribbl.io: letter count is shown first and letters are revealed as time passes; earlier guesses score more ([overview](https://mechanicsofmagic.com/2022/04/20/critical-play-skribbl-io-4/)). Exact timings are not documented, so our ladder (section 2) is our own design; **tune it in real play**.
- Quiz-room games commonly use a server-authoritative synced timer, a 3 s start countdown, a circular timer, speed-bonus scoring, an animated leaderboard (scores count up, rows reorder, risers spring) and a podium with confetti (open-source examples: [instant-quiz-clash](https://github.com/SayedMajeedx/instant-quiz-clash), [Multiplayer-quiz-game](https://github.com/iitking/Multiplayer-quiz-game), [Nammes-Hub PR 52](https://github.com/AyeniTaiwoSPC270/Nammes-Hub/pull/52)). These show the pattern; the look is ours.
- **Jackbox** (researched 31 Oct): the phone is the controller and the input set is deliberately tiny (tap a choice, type text, draw), so almost anyone can play without instructions; designers call it "inclusivity through design"; non-players can join with the room code to vote or add prompts ([Built In Chicago](https://www.builtinchicago.org/articles/jackbox-games-design-party-pack), [Wikipedia](https://en.wikipedia.org/wiki/The_Jackbox_Party_Pack)). Lessons for us: **one input per screen** (the answer tiles, nothing else), a **spectator join** (friends can watch and use reactions without playing), and never require reading rules before the first round. Party games help friendships and get-togethers more than they test skill, so keep the social loop (reactions, rematch, awards) as important as the scoring.
- **Game feel** (researched 31 Oct): the standard references are Jonasson and Purho's "Juice it or lose it" and Nijman's "The Art of Screenshake" ([overview](https://roblog.co.uk/2024/03/juicy-games/)). Takeaways: exaggerated feedback on every action (particles, easing, hit-pause, sound) makes input feel responsive, **but juice thrown at everything backfires**, so we spend it on three moments only: the **hint unlock**, the **reveal** and the **podium**; keep lock-in, lobby and navigation quiet and fast ([restraint warning](https://www.wayline.io/blog/the-seductive-squeeze-when-juice-in-game-development-becomes-a-crutch)).
- **Still not covered by sources:** Gartic Phone presentation, anticipation frames and countdown-urgency patterns specific to mobile. Plan: study them hands-on in play sessions (the owner and 3 friends play Gartic Phone and skribbl for 30 minutes and note when attention drops and what makes them laugh), then record findings here. Run a short usability test with 4 to 6 real students on the sandbox page before wiring the backend.

## 9. Open questions
1. Should peeks and power cards be earned (streak) instead of given? (more depth, more rules)
2. Are 8 hint stages too many for a 30 s question? Test a 3-stage version for Blitz.
3. How are Free players treated in the pick screen? (suggestion: they can play every role, but the question pool for a Free-hosted room is the Forge taster plus PYQs)
