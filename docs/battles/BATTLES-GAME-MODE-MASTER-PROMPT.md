# Master prompt: design RENYXERA Battles as a real game

Written 13 Nov 2026. Paste everything inside the box into another model (ChatGPT, Gemini, Claude on the web, DeepSeek). It works best with a model that can also look at images: attach screenshots of the current Battles page and of 8 Ball Pool's menus if you have them. Save each model's answer as `docs/battles/game-design-<model>.md` and give them back to Claude Code to compare and build.

```
You are a senior game designer and game UI/UX lead who has shipped casual competitive mobile games (in the spirit of 8 Ball Pool, Clash Royale, Trivia Crack 2, QuizUp, Duolingo Leagues, Chess.com). I need a complete, buildable design for the competitive mode of an exam-prep web app. It must feel like entering a game, not like visiting another page of a website. Read all the context first. Where something is not stated, decide and explain; where you want to claim something about the product that is not stated here, list it under "Needs owner confirmation" instead of inventing it.

=== 1. THE PRODUCT ===
RENYXERA is a web app (installable PWA, phone and desktop) for Indian engineering students preparing for GATE, a national computer-based exam: 65 questions, 100 marks, 3 hours. Question types: MCQ (single answer, negative marking: -1/3 for a wrong 1-mark, -2/3 for a wrong 2-mark question), MSQ (multiple correct, no negative), NAT (type a number, no negative). Papers per branch: CS, EC, EE, ME, CE, DA. Users are 20 to 26 years old, study alone, often at night, mostly on phones, cost-sensitive. The app has an official past-paper bank (about 3,250 questions, 2017 to 2026), an exam-identical test screen, an AI Mentor, analytics, a test builder, flashcards. Look: pastel cards in light mode; a dark mode. Fonts: Sora (display), Manrope (body), wordmark Bruno Ace SC. Brand colours: violet/blue logo gradient.

=== 2. WHAT THE COMPETITIVE MODE IS TODAY (all built and live) ===
Name in the app: "Battles". There is also "Arena", the ranked side (rating and leaderboard), which the owner says is not visible enough and must become a real part of the game.
- Friends: add by username, presence (online now), challenge a friend.
- A battle = a fixed set of questions (3 to 200) that both players answer in the real exam screen. Scores are graded on the server (never trusted from the browser).
- Async mode: the challenger plays, sends it; the friend plays later (up to 7 days). Notifications in-app and on Telegram.
- Live mode: both open a lobby, both press Ready, the server fixes a start moment 6 seconds ahead, both see the same countdown, both play at once; each player's answered count is sent every 5 s and shown to the other in a small "live battle" strip; a result board shows both scores, the winner and points.
- Scheduled: challenge a friend for a set time (within 7 days); a pop-up appears for the friend when it is time (not during a test: "do not disturb", shown after).
- Rematch, and "where the marks went" per subject between two players.
- Arena: Elo-style rating (start 1000, K=24); points per battle: win 30, draw 15, loss 8; at most 10 point-earning battles a day; weekly and all-time leaderboards (friends / everyone); 4-week seasons (first season ends 30 Nov 2026) with top-10 badges.
- Coins: daily reward (10 a day, 60 on day 7 of a streak); battles pay win 20, draw 10, play 5. Coins cannot be bought or cashed out.
- Coin shop: Mentor token boosts (150 and 350 coins), avatar frames (200 to 400 coins) worn around the avatar.
- Clubs: create or join with a 6-character code, up to 30 members, weekly club points board and club rank.
- Avatars: generated avatar styles (some for Plus/Pro); a Pro/Plus crown.
- Plans: Free (3 active battles at a time), Plus Rs 29/month, Pro Rs 99/month (unlimited battles). No auto-renewal.

=== 3. WHAT THE OWNER WANTS (his words, condensed) ===
- "Completely like a game." Clicking Battles must ENTER A GAME MODE: a full-screen experience where the website's navbar, menus, dock, banners and footers are hidden. It should feel like launching a game, with its own home screen, transitions, sounds (optional, muted by default), and its own way out ("Exit to study").
- Reference: 8 Ball Pool (friends, leaderboards, clubs, coins, rewards, how a challenge happens, the match intro, the result). Not just "cards on a page": the current version was rejected as looking like a dashboard.
- Arena must be clearly visible and central: ranks, tiers, seasons, leagues.
- Live 1-v-1 should feel like a real match (match-found screen, VS intro, countdown, live opponent progress, tension, a satisfying result screen with rewards, rematch).
- Async challenges (friend plays later) must still feel like a game (tickets, timers, notifications).
- It must stay a study tool: questions are real GATE questions, scoring follows GATE rules, nothing should push gambling or pay-to-win.

=== 4. HARD CONSTRAINTS ===
- Two first-class modes: MOBILE (phones, portrait, touch, installed PWA, often on mobile data) and DESKTOP (laptops and monitors, landscape, mouse and keyboard). Both must feel like a game, each designed for its device, not one stretched or squeezed into the other.
- Budget is Rs 0: free tiers only. Stack: Next.js 16 (React 19, Tailwind v4, motion/react for animation), Supabase (Postgres, auth, row-level security; Supabase Realtime channels are available on the free tier), Cloudflare Workers hosting. No paid game engine, no paid assets, no paid servers. Animations in CSS/SVG/canvas/Lottie (free) are fine; 3D (three.js) only if light enough for a mid-range Android phone.
- Must run well on a mid-range Android phone at 60 fps; respect reduced motion; keyboard and screen-reader accessible for menus and the question screen.
- Dates and times in IST. No native date/time pickers or native dropdowns (custom components).
- Honesty: never show fake players, fake counts or fake online numbers. If there are not enough players for random matchmaking, say so and offer friends/bots clearly labelled as practice bots (the owner has not decided on bots: list it as a decision).
- No real-money stakes, no buying coins, no loot boxes. Coins are earned only.
- Scores stay server-graded; the question screen must remain fair (both players get the same questions; integrity signals like tab switches are recorded).

=== 5. WHAT I NEED FROM YOU (answer in these sections, with this numbering) ===
1. The core loop in one diagram (text/ASCII): enter game -> home -> choose mode -> match -> play -> result -> rewards -> progression -> back to home. Say what makes a student come back tomorrow.
2. Game modes: list each mode with rules, length (number of questions, time per question or total time), scoring (how GATE negative marking maps to a match score), tie-breaks (time? accuracy?), and who it is for. Must include: Live 1-v-1 with a friend, Async challenge, Scheduled match, Ranked Arena (random opponent when available), and at least one short "quick" format (for example 5 questions, 60 seconds each). Propose any others that fit GATE (subject duels, topic tournaments, club wars, daily challenge).
3. Arena and progression: tiers/leagues (names that fit engineering/GATE, not generic Bronze/Silver/Gold unless you justify it), how rating maps to tiers, season rewards and resets, promotion/demotion, XP or levels separate from rating, badges. Keep the existing Elo and points unless you argue for a change.
4. Economy: how coins are earned and spent, daily/weekly missions, streaks, the shop (cosmetics only: avatar frames, question-screen themes, victory animations, emotes, titles), anti-abuse (daily caps, no farming with a friend), and balance numbers for the first 30 days.
5. Social: friends, presence, invites, clubs (club wars, club chat or emotes only?), spectating, sharing a result card to WhatsApp/Instagram.
6. Screen-by-screen UX, as a list with a short wireframe (ASCII) for each: Game launch transition, Game home (lobby), Mode select, Matchmaking/waiting, Match found + VS intro, Countdown, In-match question screen (how it differs from the exam screen: opponent progress, timer, streak flame, reactions?), Between-question feedback (if any), Result screen (win/lose/draw variants), Rewards and level-up, Arena/leagues, Season pass or season track, Leaderboard, Clubs, Friends, Shop/locker, Profile card, Settings/sound, Exit. Give TWO layouts for every screen: a MOBILE mode (portrait phone, 390 px wide, thumb reach, bottom-anchored primary action, works inside the installed PWA) and a DESKTOP mode (landscape 1440 px and wider, full width with no centred narrow column, mouse and keyboard shortcuts, hover states). Say what changes between them, not just the size: what moves, what collapses, what appears only on one.
7. Visual direction: a name for the art direction, palette (5 to 7 hex values), typography roles, materials and lighting (felt table? stadium? circuit board? exam hall at night?), iconography, how it relates to the app's pastel brand while clearly being a separate game world. Avoid generic "dark neon gamer" unless justified.
8. Motion and sound: the 8 to 12 key animations (what moves, duration, easing), screen transitions, the VS intro choreography, result celebration, button press feel, haptics on phones (Vibration API), and a sound list (with free sources or synthesis notes). All must have a reduced-motion version.
9. Live tech design (free tier): how to run real-time 1-v-1 on Supabase Realtime (channels, presence, broadcast vs database writes), what is authoritative on the server, how to handle disconnects, reconnects, late joins, cheating (answer timing, tab switching), and how async/scheduled matches reuse the same pieces. Give the tables/columns you would add and the events.
10. Onboarding: the first-time flow (first match against a practice bot or a friend?), tutorial in 3 steps or fewer.
11. What to cut for version 1: a phased plan (V1 in 2 weeks for one developer with an AI assistant, V2, V3), each with the exact screens and features.
12. Metrics: what to measure to know the game works (D1/D7 return, matches per user, completion rate, share rate), with target numbers for an early-stage product.
13. Risks and how to avoid them: making it feel like gambling, distracting from study, toxic behaviour, empty lobbies.
14. Needs owner confirmation: every decision you made that the owner should approve.

Be concrete: numbers, names, durations, hex values, wireframes. No marketing language. If two good options exist, give both with a recommendation.
```

## Notes for Claude Code when the answers come back
- Compare the answers on: game feel, honesty (no fake players), fit with the existing tables (battles, battle_entries, battle_invites, points_ledger, ratings, coins_ledger, clubs, club_members, user_unlocks), free-tier realism, and phone performance.
- Merge into one design doc, show the owner the choices that differ, then build V1 as a full-screen route (for example `/play`) that hides the site chrome.

## Research used for the context above
- Trivia Crack 2 built its ranked mode on real-time matches with Elo matchmaking (Etermax engineering blog).
- Trivia Royale (from QuizUp's founder) used labelled bots to fill matches when there were not enough players, and chose intrinsic rewards over money (TechCrunch, The Next Web, GamesBeat).
- 8 Ball Pool: level and league gating of higher-stakes tables, soft currency earned through wins, collection meta (cues) and social challenges as the main motivators; a satisfying core loop comes first (GameAnalytics; Miniclip support).
