# Master prompt: complete game design for RENYXERA Battles (for Gemini)

18 Nov 2026. Paste the box into Gemini (Deep Research, or the strongest model with search; image generation helps for concept art). Ask it to return one long document. Save it as `docs/battles/game-design-gemini.md` and tell Claude Code "game design report saved". You can run the same prompt in ChatGPT for a second opinion and save `game-design-chatgpt.md`.

## How to run it
1. New chat, Deep Research on. Attach screenshots of the current Citadel (`/battles`) and the entry doors if you can.
2. Paste the box and send.
3. When it finishes: `Run the section 12 self-check, fix what fails, then give me the complete corrected document. If you can generate images, add concept art for the Citadel, a building at levels 1, 3 and 5, the battle screen and the result screen.`
4. Save the answer as above.

```
You are a team: a senior game director who has shipped mobile base-building and competitive games (Clash of Clans, Clash Royale, Brawl Stars, Boom Beach, Township, chess and trivia apps), a game economy designer, a UI/UX and motion lead for mobile games, a game audio designer, a learning scientist, and a web engineer who builds games in the browser. Research thoroughly and cite sources for every factual claim about other games, research or technology. Where you are unsure, say so. Never invent statistics about our product.

I want a complete, buildable GAME DESIGN DOCUMENT for the competitive mode of an exam-prep web app. It must feel like a real game a player would choose to open, not a study app with points.

=== 1. THE PRODUCT ===
RENYXERA is a web app (installable PWA; phone and desktop) for Indian engineering students preparing for GATE, a national exam: 65 questions, 100 marks, 3 hours; MCQ with negative marking (−1/3 for 1-mark, −2/3 for 2-mark), MSQ (no negative), NAT (numeric). The app has an official past-question bank (about 3,250 questions, 2017–2026, every CS question tagged by subject and topic, answers graded on the server), an exam-identical test screen, an AI Mentor, analytics with per-subject attempts and accuracy, flashcards, a Mistakes Bank. Users: 20 to 25 years old, study alone, mostly on phones, often at night, cost-sensitive. Plans: Free, Plus ₹29/month, Pro ₹99/month.

=== 2. WHAT ALREADY EXISTS IN THE GAME ("Battles") ===
Server and data (live): friends by username with presence; battles = a fixed question set that two or more players answer, scores graded by the server; async battles (friend plays later, up to 7 days), live battles (both ready up, server sets a shared 6-second countdown, live progress), scheduled battles; rematch; per-subject comparison after a battle; Arena rating (Elo, start 1000, K=24); Arena points (win 30, draw 15, finish 8; max 10 point-earning battles a day); weekly and all-time leaderboards (friends / everyone); 4-week seasons with top-10 badges; coins (daily reward 10, day-7 streak 60; battles pay 20/10/5); a coin shop (Mentor token boosts, avatar frames); clubs (create/join with a code, up to 30 members, weekly club points board).
Front end (just built, needs your design): the game opens full screen with its own navigation and an "Exit to study" door; entering plays a "GATE doors open" transition. Home is "the Citadel": an isometric island with a Town Hall in the centre and 11 subject buildings around it (Kernel Keep = Operating Systems, Query Vault = Databases, Signal Tower = Networks, Algorithm Forge, Automata Observatory = TOC, Compiler Works, Engine House = Computer Organisation, Logic Gatehouse = Digital Logic, Code Workshop = Programming and Data Structures, Maths Library, Aptitude Grounds). Each building's level (0–5) comes ONLY from the player's real questions attempted and accuracy in that subject; Town Hall level is the average. Leagues by rating (proposed names: Aspirant, Qualifier, Ranker, Topper, Legend). Palette so far: warm dusk sky, grass island, sandstone, terracotta roofs, walnut and brass UI.
The owner says the Citadel looks empty and needs far more life, depth and features.

=== 3. THE OWNER'S RULES (NON-NEGOTIABLE) ===
- Once inside the game, the player never gets sent to the study app. Everything (training, attacks, picking questions, results, clan, shop, settings) happens in the game. The only way out is the Exit door, with an outro transition.
- It must feel like a complete game: animations, effects, transitions, characters or life in the world, sounds, music, a settings screen (music, sound effects, haptics, reduced motion, language of numbers etc.).
- Music and sound must be original and distinctive, not the generic stock sounds every app uses. Propose a sound identity (for example Indian instruments or a raag-based ambience) and how to make it in the browser for free (Web Audio synthesis, free licensed samples, or tools) with exact recipes.
- No purple or blue as main colours; nothing that looks AI-generated (no glow soup, gradients everywhere, generic neon, emoji icons).
- Multiplayer and social at the core: friends, clans, leaderboards, levelling up, mastery, seasons. Clash of Clans is a reference for ideas, not a template.
- Honesty: never fake players, online counts, opponents or rewards. If there are not enough players for something, say what happens instead. No real-money stakes, no loot boxes, no buying power. Levels must reflect real learning.
- Questions are always real GATE questions or verified original ones; scoring follows GATE marking; scores are graded on the server.
- Budget is ₹0: free tiers only. Stack: Next.js 16 (React 19), Tailwind v4, motion/react, SVG/Canvas (three.js or PixiJS only if light enough for a mid-range Android phone at 60 fps), Supabase (Postgres, auth, row-level security, Realtime channels on the free tier), Cloudflare Workers.

=== 4. WHAT I NEED (use these section numbers) ===
4.1 Vision and pillars: the game in one paragraph, 4–5 design pillars, and the core loop as a diagram (study → build → attack/defend → reward → progress → return tomorrow).
4.2 The world: what the Citadel is, how it is drawn (isometric SVG/canvas vs 2.5D vs light 3D: compare with performance numbers), what makes it feel alive (weather, day/night by IST time, characters walking, smoke, flags, water, birds, construction animation, idle animations that stop when not visible), how a building looks at each level 0–5 (describe all 11 + Town Hall), decorations the player can place, and how the island grows as the Town Hall levels up.
4.3 Progression: buildings, Town Hall, player level/XP, mastery stars per topic, trophies, leagues and promotion, seasons and a free season track, achievements and titles. Exact formulas that tie every level to real performance (questions, accuracy, difficulty, recency) so levels cannot be farmed. Include a 30-day progression simulation for a casual and a serious student.
4.4 Training (solo modes inside the game): at least four formats (for example Rush: 5 minutes, 3 strikes; Drill: one topic, 10 questions; Boss: a real past paper section; Daily challenge: same 10 questions for everyone), their rules, scoring with GATE marking, rewards, and how they upgrade buildings.
4.5 Attack and defend (async, Clash-style): how a player attacks a friend's or clan mate's or a matched player's building using that subject's questions, how the defence is the defender's own recorded performance, stars (1–3) rules, trophies won/lost, replays or summaries, revenge, shields, and fairness when players are at different levels.
4.6 Live duels and events: real-time 1v1 (we have live battles), friend challenges, scheduled duels, weekly club wars, tournaments, and what happens when not enough players are online (honest fallbacks).
4.7 Clans: roles, chat or emotes only (moderation-free), clan castle/base, clan wars against a past paper boss or against another clan, donations of something non-paid, clan leagues and perks.
4.8 Economy: currencies (we have coins; propose at most one more if justified), sources and sinks, the shop (cosmetics only: building skins, island themes, avatar frames, emotes, victory animations, titles), daily/weekly caps, anti-farming, and balance numbers for the first 30 days.
4.9 Screens: for every screen give purpose, layout for PHONE (390 px, portrait, thumb reach) and DESKTOP (1440 px, landscape, full width, no empty space), states (loading, empty, error, locked), and an ASCII wireframe: entry transition, Citadel home, building panel, training select, the question battle screen (how it differs from the exam screen: timer, strikes, opponent progress, combo, power feedback), result and rewards, attack target select, enemy base view, clan home, clan war, leagues/ranking, profile and trophy room, shop, settings, inbox/notifications, exit transition, first-time tutorial.
4.10 Visual direction: two or three art directions that fit the Citadel (palette hex values, materials, lighting, building style, UI frames, typography roles with free fonts, iconography), how dark mode or night works, and the one signature detail. Explicitly list what to avoid so it never looks AI-generated.
4.11 Motion and game feel: the 15–20 key animations (tap, build, level up, star reveal, coin flight, door open/close, attack start, correct/wrong answer, combo, promotion), each with duration, easing and a reduced-motion version; screen transitions; camera moves on the island; haptics patterns.
4.12 Sound and music: the sound identity, a full list of sound effects (20+) and music tracks (home, battle, victory, defeat, clan war), how each is produced originally for free (Web Audio synthesis recipes with oscillator types, envelopes, filters; or free licensed sources), loudness targets, and the settings for music, effects and haptics. Muted by default on first visit, remembered per device.
4.13 Settings and accessibility: the full settings list, colour-blind safe signals, text size, reduced motion, low-power mode, offline behaviour.
4.14 Technical design: data model (tables and columns to add to what exists), server authority (what the browser must never decide), Supabase Realtime use within free limits, asset pipeline (SVG sprites, canvas, sprite sheets), performance budgets for a mid-range Android phone, and how to build it in phases.
4.15 Onboarding and retention: the first 5 minutes, the first week, notifications that are useful not nagging, and how the game always pushes the player back to real learning.
4.16 Metrics: what to measure and target numbers for an early product.
4.17 Risks: gambling feel, addiction versus study time, toxic behaviour, empty lobbies, cheating, and how the design prevents each.
4.18 Phased roadmap: V1 (2 weeks for one developer with an AI coding agent), V2, V3, with the exact screens and features in each.
4.19 Decisions for the owner: every choice you made that he should approve.

=== 5. RULES ===
Concrete over general: numbers, names, durations, hex values, wireframes, formulas. Cite sources for claims about other games and research. If two options are good, give both and recommend one. No marketing language.

=== 12. SELF-CHECK ===
Before answering confirm: every section 4.1–4.19 is answered; nothing sends the player out of the game; every level and reward ties to real performance; honest fallbacks exist for low player counts; no purple/blue main palette; sound recipes are concrete; every screen has phone and desktop layouts; sources are cited.
```

## What Claude Code does with the report
Compares Gemini's (and ChatGPT's, if you run it) design with what is built and with docs/battles/BATTLES-RESEARCH-AND-CONCEPTS-V3.md, lists the differences and the decisions for you, then builds in the order agreed.
