# RENYXERA: **CITADEL ARENA** — Competitive Mode Game Design Document (GDD)

**Document Version:** 1.0 (Production Blueprint)  
**Target Product:** `https://gate.renyxera.workers.dev/` (Competitive World `/battles` & `/citadel`)  
**Target Audience:** Indian GATE CS aspirants (20–25 years old), solo late-night phone learners, price-sensitive (Free / Plus ₹29/mo / Pro ₹99/mo).  
**Infrastructure Budget:** ₹0 (Next.js 16 / React 19, Tailwind v4, `motion/react`, HTML5 Canvas + SVG, Cloudflare Workers Free, Supabase Free).

---

## Executive Summary & Scope Alignment

This document specifies **Citadel Arena**, the full-screen competitive game world nested inside RENYXERA. Once entered through the **GATE Sanctum Doors**, every training session, PvP raid, live duel, clan war, shop unlock, inbox claim, and settings adjustment stays inside the game shell; the only exit back to the study dashboard is the physical **Sanctum Exit Door**. Every level, defense rating, and reward originates strictly from server-verified GATE CS question performance (~3,250 official PYQs from 2017–2026 across 11 subject domains), adhering to official GATE marking (+1/+2, −1/3 and −2/3 for wrong MCQs; 0 negative for MSQ and NAT).

Where exact existing Supabase table schemas or live player counts of RENYXERA are not exposed publicly, this document marks assumptions explicitly and never fabricates product metrics.

---

## 4.1 Vision and Pillars

### Vision Statement (One Paragraph)
**Citadel Arena** transforms solitary late-night GATE preparation into a living, sunlit-to-dusk isometric island fortress where every solved past-year question literally builds masonry, stations defenders, and strengthens shields across 11 subject monuments—so a 22-year-old student opens the game at 11:30 PM because they *want* to defend their Kernel Keep, raid a friend's Query Vault, and advance their Clan Caravan toward the next weekly tier, while every single tap executes scientifically grounded retrieval practice under real GATE marking.

### Five Design Pillars

1. **Knowledge Is Architecture (Zero Fake Grind):** Unlike *Clash of Clans*, where resource collectors tick passively over real-world hours, nothing in the Citadel upgrades from idle timers or coin spending. Buildings level up strictly from server-verified question volume, weighted accuracy, difficulty, and recency.
2. **Desirable Difficulty Dressed as Play:** Training and battle modes operationalize cognitive science—retrieval practice (testing effect, which outperformed restudying 61% vs. 40% after 1 week in Roediger & Karpicke's experiments), spacing, interleaving, and calibrated challenge—disguised as speed rushes, boss sieges, and tower raids.
3. **Informative Mastery Over Controlling Bribes:** Deci, Koestner & Ryan's meta-analysis of 128 studies demonstrated that controlling, expected tangible rewards undermine intrinsic motivation ($d = -0.28$ to $-0.40$), whereas informative positive feedback enhances both free-choice engagement ($d = 0.33$) and interest ($d = 0.31$). Economy rewards stay strictly cosmetic and diagnostic, never selling power or loot boxes (mirroring *Brawl Stars*' December 2022 shift from random boxes to deterministic Starr Road unlocks).
4. **Every Pixel Reacts (Tactile Toy World):** Inspired by *Township*'s bustling townspeople and *Clash of Clans*' interactive base objects, every building, lantern, scholar, boat, notice board, and seasonal tree responds to taps with animation, Hindustani acoustic audio, and clear next-action affordances.
5. **Radical Honesty on ₹0 Infrastructure:** No simulated players, no inflated "online now" counters, no disguised bots. When real-time queues are thin at 2:30 AM IST, the game explicitly offers asynchronous raids against real recorded player performances or clearly labeled official past-paper Sentinel Benchmarks.

### Core Gameplay Loop

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                        1. SOLVE & TRAIN                             │
  │  Rush / Topic Drill / Past-Paper Boss / Daily Challenge / Study App │
  │         (Real GATE PYQs · Server-graded · Official Marking)         │
  └───────────────────────────────┬─────────────────────────────────────┘
                                  │ Mastery XP + Accuracy + Recency Update
                                  ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                       2. BUILD & FORTIFY                            │
  │   11 Subject Buildings level 0→5 · Town Hall rises · Defense Ledger │
  │    records your actual solve traces · Scholars & Traps activate     │
  └───────────────────────────────┬─────────────────────────────────────┘
                                  │ Base Ready · Daily Shield / War Ticket
                                  ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                      3. ATTACK, DUEL & DEFEND                       │
  │  Async Raids (vs friend/matched defense trace) · Live 1v1 Duels ·   │
  │   Clan War Boss Operations · Revenge Strikes from Battle Ledger     │
  └───────────────────────────────┬─────────────────────────────────────┘
                                  │ Stars (1–3) · Elo Δ · Coins & Seals
                                  ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                   4. REWARD & COSMETIC EXPRESSION                   │
  │  Free Season Track · League Badges · Island Themes & Building Skins │
  │    Clan Perks · Trophy Room Monuments · Diagnostic Error Review     │
  └───────────────────────────────┬─────────────────────────────────────┘
                                  │ Weak-Topic Nudge ("Compiler Works
                                  │ under attack!") + Daily Streak Buffer
                                  ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                        5. RETURN TOMORROW                           │
  │  IST Day-Night Citadel Shift · Fresh Daily 10-Q Seed · Revenge Ping │
  └─────────────────────────────────────────────────────────────────────┘
```

---

## 4.2 The World: The Citadel

### Concept & Geography
The Citadel is a floating, cliff-ringed sandstone and terraced-meadow island surrounded by calm dusk waters, inspired spatially by *Boom Beach*'s island clarity and *Clash of Clans*' radial village hierarchy, grounded in Indian stone-and-terracotta stepwell/observatory architecture (sandstone courtyards, terracotta tiled roofs, brass astrolabes, copper piping, carved *jharokha* arches).

### Rendering Architecture Comparison & Recommendation

| Approach | Bundle Cost (Min+Gzip) | Frame Budget (Mid-Range Android, 60 fps = 16.67 ms) | Pros | Cons | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Option A: Hybrid HTML5 Canvas 2D + Thin SVG Hit/Label Overlay + `motion/react` (`LazyMotion`)** | **~5 kB** (`LazyMotion` + `m`) + **0 kB** renderer | **~2.0–3.5 ms** CPU/frame using cached offscreen static island layer | Instant load on Indian 4G; zero WebGL context-loss crashes; crisp DOM/SVG accessibility & tooltips; low battery drain | No arbitrary 3D camera tilt; custom depth-sorting needed | **RECOMMENDED (V1–V2)** |
| **Option B: PixiJS v8 (2D WebGL/WebGPU)** | **~126.1 kB** (`pixi.js`) | **~1.5–2.5 ms** GPU batched sprites | Handles 500+ particles/units effortlessly; built-in shaders | +126 kB JS parse/compile tax on mid-range Android; WebGL context handling | **Upgrade path for V3** if particle/crowd density exceeds 150 active sprites |
| **Option C: Full SVG DOM** | **0 kB** | **~9–18+ ms** (layout/paint thrash >300 animated nodes) | Native DOM hit-testing | Drops below 60 fps on mid-range Android during pan/zoom + idle animations | **Rejected** |
| **Option D: Three.js (3D)** | **~153.9–181.3 kB** (`three-js`/`three`) | **~6–14 ms** + shader/GC pressure | True camera orbit | Heavy bundle, thermal throttling at night, high risk of looking generic | **Rejected** |

**Why Option A Wins:** Mid-range Android browsers spend ~4 ms per 16.67 ms frame on browser compositor housekeeping, leaving ~12 ms for our code. By baking terrain, cliffs, paths, and static trees into an offscreen `HTMLCanvasElement` (re-rendered only on resize, pan/zoom settle, building upgrade, or IST time-of-day transition) and drawing only 12 depth-sorted buildings, 8–14 strolling scholars, water shimmer tiles, smoke puffs, and birds per `requestAnimationFrame`, CPU time stays under ~3.5 ms.

### Making the Citadel Feel Alive (100% Interactive World)

1. **IST Clock-Synced Atmosphere (4 Natural Phases, No Sudden Flash):**
   - *Pratah / Dawn (05:30–09:00 IST):* Pale peach sky (`#F3C69F`), cool dew mist across grass, morning lanterns fading out, scholars sweeping courtyards.
   - *Madhyahna / Day (09:00–16:30 IST):* Warm parchment-ochre daylight (`#EDE0C8`), crisp building drop shadows, birds circling the Signal Tower.
   - *Sandhya / Dusk (16:30–20:00 IST — Signature Palette):* Amber-apricot horizon (`#E09153`), warm terracotta highlights, brass lamps flickering on along cobblestone paths.
   - *Ratri / Night (20:00–05:30 IST — Built for Night Owls):* Deep espresso-umber sky (`#231B16`, never purple/blue!), glowing warm amber windows (`#F5B841`) inside every building, fireflies over lotus ponds, study-lamp glow at Town Hall—low eye-strain luminance tailored to students studying after 10 PM! Players can also pin a preferred time-of-day override in Settings.
2. **Ambient Weather & Life (Respecting Reduced Motion & Battery):**
   - **Gentle Monsoon Drizzle / Floating Petals / Autumn Leaves:** Deterministic lightweight weather tied to IST seasons or player-selected Island Theme (up to 24 active canvas particles max).
   - **12–16 Autonomous Chibi/Stylized "Scholars & Artisans":** Walk along cobblestone A* waypoints between your highest-level buildings carrying scrolls, brass gears, or tea cups. **Interactive:** Tapping any strolling Scholar pops a 1-word speech bubble with a real micro-tip from your Mistakes Bank (e.g., *"Revise Belady's Anomaly!"*) and grants +1 Brass Coin (up to 3/day) for checking in!
   - **Water & Harbor:** Olive-jade/burnished-slate coastal waters (`#3D5A52` / `#526C60` reflecting dusk gold) with subtle horizontal wave strokes and a wooden **Trade Boat / Clan Ferry** gently bobbing at the southern pier. **Interactive:** Tapping the Ferry opens Clan Home / Clan War!
   - **Flags, Smoke & Birds:** Pennants on Level 3+ buildings flutter at 12 fps sprite-step; Forge chimneys emit faint cream smoke wisps; tiny silhouettes of swallows circle every 25 seconds.
   - **Construction / Upgrade Animation:** When a building earns enough Mastery to level up, **you don't wait passively**—scaffold planks appear immediately with a golden hammer badge (`Tap to Complete Upgrade!`). Tapping plays a 1.4-second scaffolding-drop, dust-puff, and brass-chime reveal!
   - **Battery & Background Discipline:** An `IntersectionObserver` monitors the canvas viewport and `Page Visibility API` (`document.visibilityState === 'hidden'`) immediately cancels `requestAnimationFrame` and suspends audio/particle ticks whenever the user minimizes the PWA, locks the phone, or switches to a modal screen.

### Interactive World Props (Beyond the 12 Core Buildings)

| Interactive World Object | Location | Interaction Result |
| :--- | :--- | :--- |
| **Sanctum Exit Door (Stone Archway)** | North-West cliff bridge | Plays "GATE Doors Close" outro & returns to Study App |
| **Clan Ferry & Pier** | South cove water | Opens Clan Home (or Clan Finder if clanless) |
| **Wandering Courier Camel / Cart** | Eastern bridge gate | Collects Daily Login Reward (10 coins; 60 on Day 7) & Friend Gifts |
| **Battle Ledger Obelisk** | Town Hall plaza | Opens Inbox / Defense Log / Revenge Targets |
| **Trophy Gazebo** | West overlook | Opens Profile & Trophy Room |
| **Merchant Bazaar Tent** | South-East path | Opens Cosmetic Shop |
| **Banyan Notice Board** | Near Town Hall | Opens Daily Challenge & Weekly Events |

### Building Visual Progression (Levels 0–5 Across All 12 Structures)
Every building starts at **Level 0 (Ancient Foundation / Unlit Ruins)** with a stone plinth and carved subject emblem so the island never looks empty—players restore an ancient engineering citadel rather than staring at blank grass.

| Building (Subject) | L0 (Ruins) | L1 (Timber Outpost) | L2 (Stone Masonry) | L3 (Reinforced Bastion) | L4 (Brass Citadel Wing) | L5 (Grand Monument) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Town Hall (Overall Citadel)** | Cracked courtyard plinth + small brass brazier | Single-story sandstone hall, clay tile awning | Two-story hall with arched veranda & courtyard fountain | Terraced keep, twin watch-turrets, saffron banner | Domed sandstone palace, brass astrolabe spire, stone moat | Gilded multi-tier stepwell citadel with rotating sun-dial crown & warm beacon |
| **Kernel Keep (OS)** | Broken stone gear-pit | Wooden guard shack + schedule slate | Guard tower with semaphore levers | Fortified keep with dual rotating clockwork gears | Multi-gate fortress with copper pressure pipes | Towering clockwork bastion with animated interlocking brass flywheels |
| **Query Vault (DBMS)** | Sunken stone cellar steps | Timber archive shed + ledger shelf | Vaulted stone archive with iron-banded oak door | Columned treasury with sliding index drawers | Brass-ribbed subterranean rotunda & seal lock | Grand sunlit archival dome with rotating brass index rings |
| **Signal Tower (Networks)** | Fallen stone tripod | Wooden lookout scaffold + cloth flag | Tall stone signal lighthouse with mirror | Brass-framed relay mast with copper coils | Twin parabolic brass reflectors + lantern beacon | Sky-piercing heliograph spire sending rhythmic amber light pulses |
| **Algorithm Forge (Algorithms)** | Cold hearth stone circle | Open-air canvas bellows & anvil | Brick smithy with glowing amber furnace | Dual-chimney forge with waterwheel drive | Automated trip-hammer foundry & brass calipers | Master furnace hall with molten gold-amber crucible glow & rhythmic sparks |
| **Automata Observatory (TOC)** | Weathered sundial slab | Timber tripod & brass telescope | Round stone drum with rotating slit roof | Copper-clad dome with mechanical state dial | Twin-turret astrolabe observatory & star-chart deck | Grand brass armillary sphere rotating slowly atop a marble drum |
| **Compiler Works (Compiler Design)** | Scattered stone tablets | Canvas workbench & ink-press awning | Three-bay sandstone workshop (Lex/Parse/Gen) | Chimneyed printing mill with conveyor chutes | Multi-stage brass gearworks & bronze type-towers | Grand clockwork synthesis mill with three glowing amber prism lanterns |
| **Engine House (COA)** | Rusted bronze axle mound | Timber shed + wooden hand-crank | Brick engine hall with copper exhaust stack | Flywheel powerhouse with bus-bars & pipeline | Twin-cylinder brass turbine hall with steam vents | Monumental kinetic powerhouse with visible brass piston beam motion |
| **Logic Gatehouse (Digital Logic)** | Mossy carved gateposts | Timber boom-barrier & twin torches | Arched sandstone gate with iron portcullis | Dual-valve switchhouse with glowing amber/sage lamps | Brass flip-flop bastion with synchronized shutter slats | Grand citadel gatehouse with shifting mosaic truth-table inlays |
| **Code Workshop (Prog & DS)** | Chalkboard easel on rubble | Thatched timber cabin + scroll rack | Sandstone guildhall with stacked book-towers | Bay-windowed hall with hanging tree-shaped lantern | Two-wing timber-and-brass scriptorium & courtyard | Ornate Master Scriptorium with rooftop wind-vane & brass punch-card spire |
| **Maths Library (Engg Math)** | Stone pillar fragment | Open-air pergola + geometry slates | Domed reading room with stepped sandstone arch | Twin-towered library with engraved golden ratio frieze | Octagonal sandstone rotunda with stained amber glass | Grand stepped stepwell-library capped with an ivory-and-brass polyhedron |
| **Aptitude Grounds (GA)** | Dusty chalk arena circle | Timber hurdles & sand-pit ring | Walled stone training yard + target dummies | Colonnaded sparring pavilion + hourglass pillar | Brass-trimmed amphitheatre with dual scoreboards | Grand ceremonial arena with fluttering tri-pennants & warm braziers |

### Placeable Decorations & Island Expansion
- **Island Growth by Town Hall Level:**
  - *TH 0–1:* Inner Central Plateau (`7×7` isometric plot grid active; outer shores rocky/misty).
  - *TH 2:* East Bridge unlocks (`9×9` usable terrace; +4 decoration plots).
  - *TH 3:* South Harbor Cove & Wooden Ferry Dock restore (`11×11`; +6 decoration plots).
  - *TH 4:* Western Bamboo Grove & Lotus Stepwell terrace open (`13×13`; +8 decoration plots).
  - *TH 5:* Full Grand Archipelago Citadel (`15×15` walkable plateau + outer stone seawall & lighthouse rocks).
- **Placeable Decorations (Purchased with Earned Brass Coins / Mastery Seals — Zero Stats, Pure Craft):**
  - Terracotta Pot Clusters, Banyan Sapling, Stone Stepwell Bench, Brass Oil Lamp (*Diya* Post), Sundial Statue, Lotus Pond Tile, Victory Archway, Clan Banner Pole, Paper-Lantern String, Subject Monument Plaques. Tapping placed decorations triggers tiny animations (e.g., ripples in lotus pond, lantern flicker).

---

## 4.3 Progression System & Anti-Farming Math

### Master Rule: Real Learning = Real Power
Every building level `0–5` comes **only** from server-verified attempts and accuracy on real GATE CS questions in that subject [Prompt §2]. Whether answered inside the **Study App** (Test Centre, Practice, Mocks, Mistakes Review) or inside **Citadel Arena** (Training, Async Raids, Live Duels, Clan Wars), attempts flow into one unified server ledger (`user_question_history`).

### Exact Formulas (Anti-Farming & Learning-Science Aligned)

#### 1. Anti-Farm Effective Attempt Weight ($w_q$)
To stop players from repeating one easy 1-mark question 50 times to inflate levels:
$$w_q = m_q \cdot d_q \cdot r_q \cdot f_{\text{repeat}}$$
- $m_q \in \{1.0, 1.4\}$: Mark weight (`1.0` for 1-mark GATE questions, `1.4` for 2-mark GATE questions, reflecting GATE's 70/100 mark weighting on 2-markers).
- $d_q \in \{0.85, 1.0, 1.25\}$: Difficulty factor computed dynamically from global student pass rate on that question (`Easy >70% -> 0.85`, `Medium 40–70% -> 1.0`, `Hard <40% -> 1.25`).
- $r_q = \max\left(0.35,\; e^{-\text{age\_days} / 45}\right)$: Exponential recency weighting (half-life $\approx 31$ days; floors at `0.35` so hard work from 6 months ago is respected while rewarding fresh revision).
- $f_{\text{repeat}}$: Repeat damping per `(user_id, question_id)`. First valid attempt = `1.0`. Re-attempting the **exact same question** within 7 days = `0.0` for Mastery (still allowed for Mistakes review!); spaced re-attempt after 7+ days on a previously missed question = `0.65` (rewarding spaced retrieval!); spaced re-attempt on an already-mastered question = `0.15`.

#### 2. Subject Mastery Score ($M_s \in [0, 100]$)
Let $N_{\text{eff}} = \sum w_q$ and $C_{\text{eff}} = \sum w_q \cdot \mathbb{I}(\text{correct})$. Using a Bayesian accuracy prior ($P = 0.45$ over $\alpha = 3.0$ virtual weight so getting 2/2 early doesn't fake 100% mastery):
$$\text{Acc}_{\text{bayes}} = \frac{C_{\text{eff}} + 3.0 \times 0.45}{N_{\text{eff}} + 3.0}$$
$$M_s = 100 \times \text{Acc}_{\text{bayes}} \times \left(1 - e^{-N_{\text{eff}} / K_s}\right)$$
where $K_s = \max(22,\; 0.14 \times \text{BankSize}_s)$ (e.g., if OS has 300 questions, $K_s = 42$; if Compiler Design has 140 questions, $K_s = 22$).

#### 3. Building Level Thresholds (`0–5`) & Anti-Rushing Gates
A building unlocks level $L$ when **all** criteria for $L$ are satisfied simultaneously:

| Building Level | Min Unique PYQs ($U_s$) | Min Mastery Score ($M_s$) | Min Raw Recency Acc (Last 30 attempts) | Special Gate |
| :--- | :--- | :--- | :--- | :--- |
| **Level 0 (Ruins)** | `< 6` | `< 10` | — | Starting state |
| **Level 1 (Outpost)** | `>= 6` | `>= 10` | `>= 35%` | — |
| **Level 2 (Masonry)** | `>= 18` | `>= 25` | `>= 48%` | At least 3 topics touched |
| **Level 3 (Bastion)** | `>= 38` | `>= 44` | `>= 58%` | At least 50% of subject's topics touched |
| **Level 4 (Citadel Wing)** | `>= 65` | `>= 62` | `>= 68%` | Includes `>= 15` 2-mark / NAT / MSQ solves |
| **Level 5 (Monument)** | `>= 95` | `>= 78` | `>= 78%` | Includes `>= 25` Hard / 2-mark solves across `>= 80%` topics |

- **Rusty / Overgrown State (Gentle Recency Feedback):** A building **never permanently loses its level** (preventing punitive frustration). However, if $M_s$ dips $> 6$ points below the current level's threshold due to $> 30$ days of zero practice in that subject, the building visually grows moss/dust (`Rusty` badge, −10% defense flag glow). Solving **one 5-question Refresher Drill** at $\ge 60\%$ accuracy restores full polish immediately.

#### 4. Town Hall Level (`0–5`)
Prompt Rule: *"Town Hall level is the average."*
$$\text{TH}_{\text{exact}} = \frac{1}{11} \sum_{s=1}^{11} L_s \qquad \text{TH}_{\text{level}} = \lfloor \text{TH}_{\text{exact}} + 0.0001 \rfloor$$
- Every increment of `0.25` in $\text{TH}_{\text{exact}}$ fills one quadrant of the Town Hall Courtyard Compass (visual micro-progress even between integer Town Hall levels!).
- Because all 11 subjects contribute equally, a player cannot hit TH 4 by grinding only General Aptitude and Digital Logic.

#### 5. Player Level & Citadel XP
- **XP Formula:** Every unique/spaced question attempt grants `XP = round(10 * w_q * (1.2 if correct else 0.4))`. Daily Challenge completion = `+60 XP`; 3-Star Raid = `+50 XP`; Live Duel = `+40/+20 XP`.
- **Level Curve:** $\text{XP}_{\text{needed}}(Lv) = 100 + 35 \cdot (Lv - 1)^{1.35}$. Unlocks portrait borders, Scholar costumes, and Profile Milestones (never battle stats).

#### 6. Topic Mastery Stars (1–3 Stars Per Sub-Topic Inside Each Building)
Inside each subject (e.g., OS $\rightarrow$ *Scheduling, Deadlocks, Virtual Memory, File Systems*), every sub-topic has 0–3 Mastery Stars:
- **1 Star:** $\ge 5$ unique PYQs, $\ge 50\%$ accuracy.
- **2 Stars:** $\ge 12$ unique PYQs, $\ge 68\%$ accuracy.
- **3 Stars:** $\ge 20$ unique PYQs, $\ge 82\%$ accuracy including 2-markers.
- Tapping a Building reveals its Topic Star Matrix so the student immediately sees *which* sub-topic needs work before defending!

#### 7. Trophies, Arena Rating & Leagues
- **Existing Arena Rating:** Elo starting at `1000`, $K = 24$ [Prompt §2].
- **Season Trophies (4-Week Competitive Track):** In addition to persistent Arena Elo, each 4-week season awards **Season Trophies** (`Win Async/Live = +18 to +32` scaled by target Elo gap; `Loss = -8` in lower leagues, `-16` in Topper/Legend).
- **League Tiers (Mapped to Arena Rating + Trophy Floor Guard):**
  1. **Aspirant** (`< 1050` — III: `<950`, II: `950–999`, I: `1000–1049`)
  2. **Qualifier** (`1050–1199` — III: `1050–1099`, II: `1100–1149`, I: `1150–1199`)
  3. **Ranker** (`1200–1399` — III: `1200–1265`, II: `1266–1332`, I: `1333–1399`)
  4. **Topper** (`1400–1599` — III: `1400–1465`, II: `1466–1532`, I: `1533–1599`)
  5. **Legend** (`1600+` — Seasonal Hall of Fame & Top-10 Badges)
- **Promotion Buffer (Anti-Ladder-Anxiety):** Entering a new major League grants a **3-Match Demotion Shield** (your badge stays promoted even if Elo dips slightly for 3 matches, borrowing Clash Royale's Trophy Gate anti-frustration benefit while preserving true underlying Elo math for matchmaking).

#### 8. Free 4-Week Season Track ("Path of the Citadel")
- **100% Free for All Plans (Free / Plus / Pro)** — zero paywalled tier or stat boosts (inspired by *Pass Royale*'s clear milestone rhythm, minus paid gameplay advantages).
- **24 Milestones** over 28 days (`600 Crown Seals` to complete; daily play easily clears it by Day 20–24). Crown Seals are earned by earning **Stars** in Training Bosses, Async Attacks, Live Duels, and Daily Challenges (e.g., 15–35 Seals/day).
- **End-of-Track Bonus Loop:** After Milestone 24, every extra 40 Crown Seals awards a **Scholar's Cache** (`+25 Brass Coins` + `+1 Mastery Seal`, capped at 10 loops/season to match *Pass Royale*'s Lucky Loop concept without endless grinding).
- **Sample Season Rewards:** M1 (`+20 Coins`), M4 (`Terracotta Lantern Deco`), M8 (`+1 Streak Shield`), M12 (`1 Mastery Seal`), M16 (`Banner Border`), M20 (`Seasonal Avatar Frame`), M24 (`Season Island Theme Variant` + `3 Mastery Seals`).

#### 9. Achievements & Titles
- **Tiered Achievements (Bronze / Silver / Gold, paying Coins + 1–2 Mastery Seals):**
  - *Architect of All Trades:* Reach Level 2 in all 11 buildings.
  - *Zero-Negative Tactician:* Win 10 Battles/Drills with 0 wrong MCQ deductions.
  - *NAT Marksman:* Solve 50 Numerical Answer Type questions accurately.
  - *MSQ Purist:* Solve 40 Multiple Select Questions with exact match.
  - *Shield-Breaker:* 3-Star 15 Async Raids against higher-TH Citadels.
  - *Clan Pillar:* Contribute 1,000+ Clan Points across a 4-week season.
- **Equippable Titles** (appear under name in Duels & Clan Roster, inspired by *Brawl Stars*' Mastery/Trophy titles): *"Compiler Tamer"*, *"Zero-Penalty Sage"*, *"Night-Watch Sentinel"*, *"100-Mark Aspirant"*, *"Grand Architect"*.

### 30-Day Progression Simulation

**Assumptions:** Starting from fresh Citadel (`TH 0`, `Elo 1000`, `Coins 0`). Assume average subject bank size gives $K_s \approx 30$, average question weight $w_q \approx 1.15$, and player spreads practice across subjects reasonably.

#### Profile A: Casual Student (Final-Year Undergrad, Busy Weekdays)
- **Habit:** 5 days/week, ~18 mins/night inside Citadel + 2 weekend review quizzes = **12 questions/day avg** ($\sim 300$ unique PYQs over 30 days, ~58% accuracy), 1 Async Raid/day, 2 Live Duels/week.
- **Day 7:** ~75 unique Qs (~25 Qs in 3 favorite subjects, rest light). 3 buildings at **Level 1**, others Level 0. `TH 0` (`0.27` exact). `Elo ~1018` (Aspirant I). `XP ~920` (Player Lv 5). `Coins ~280` (includes Day-7 60-coin streak).
- **Day 14:** ~150 unique Qs across 7 subjects. 5 buildings at **Level 1**, 2 buildings at **Level 2**. `TH 0` (`0.82` exact — nearly TH 1!). `Elo ~1056` (**Promoted to Qualifier III!**). `Player Lv 8`. Season Track Milestone 9.
- **Day 30:** ~300 unique Qs (~27 per subject avg, focused on 6 core CS subjects at 35–45 Qs each, ~60% acc). **6 buildings at Level 2, 5 buildings at Level 1** $\rightarrow$ sum = 17 $\rightarrow$ `TH_exact = 1.54` (**Town Hall Level 1**, half-way to TH 2, East Bridge nearly unlocked if focused slightly broader, or **TH 2** if they push 5 remaining subjects past 18 Qs!). `Elo ~1115` (Qualifier II). `Player Lv 12`. Season Track Milestone 17/24.

#### Profile B: Serious Aspirant (Dropper / Dedicated GATE Prepper)
- **Habit:** 6.5 days/week, Study App + 30 mins Citadel Arena/night = **32 questions/day avg** ($\sim 900$ unique PYQs over 30 days across all 11 subjects, rising from 62% to 74% accuracy), 2 Async Raids/day, 1 Live Duel/day, Daily Challenge + Weekly Clan War.
- **Day 7:** ~210 unique Qs distributed across 8 subjects. 6 buildings **Level 1**, 3 buildings **Level 2** $\rightarrow$ sum = 12 $\rightarrow$ **Town Hall Level 1** (`1.09` exact, East Bridge unlocked!). `Elo ~1085` (Qualifier III). `Player Lv 9`.
- **Day 14:** ~430 unique Qs across all 11 subjects. 5 buildings **Level 2**, 4 buildings **Level 3**, 2 buildings **Level 1** $\rightarrow$ sum = 24 $\rightarrow$ **Town Hall Level 2** (`2.18` exact, Harbor Ferry unlocked!). `Elo ~1178` (Qualifier I). `Player Lv 14`. Season Track Milestone 15/24.
- **Day 30:** ~900 unique Qs (~80/subject avg, ~72% recent accuracy). **4 buildings Level 4, 5 buildings Level 3, 2 buildings Level 2** $\rightarrow$ sum = 35 $\rightarrow$ **Town Hall Level 3** (`3.18` exact, Clan War Banner & Lotus Terrace active!). `Elo ~1310` (**Ranker II!**). `Player Lv 20`. **Completed Season Track 24/24** + 3 Bonus Loops.

*(Note: Notice how Profile B hits TH 3 in Month 1, TH 4 around Month 2.5–3, and TH 5 around Month 5–6 of serious 6-month GATE prep—a healthy, non-exhaustible 6-month arc aligned to the February exam cycle!)*

---

## 4.4 Training (Solo Modes Inside the Game)

Every solo mode stays 100% inside the Citadel, uses real GATE questions graded on the server, applies GATE marking, and feeds the exact same Building Mastery engine.

| Mode | Format & Rules | Scoring (GATE Marking) | Rewards & Building Impact | Learning Science Basis |
| :--- | :--- | :--- | :--- | :--- |
| **1. Blitz Rush** *(inspired by Lichess Puzzle Storm)* | **5 minutes OR 3 wrong MCQ strikes** (whichever ends first). Questions start as fast 1-mark conceptual PYQs from mixed subjects and ramp difficulty every 3 solves. 1 tactical "Skip" per run (preserving combo). | Official GATE marks accumulated (`+1/+2` per solve, `-1/3` or `-2/3` wrong MCQ, `0` MSQ/NAT). High-score badge at $\ge 10$ marks. | Full Mastery XP on all questions (`1.1x` interleaved bonus); `12–25 Coins` (max 3 paid runs/day). Trains rapid triage & mental calculation. | **Interleaving + Retrieval Fluency**: forces rapid discrimination between subject schemas. |
| **2. Siege Drill** *(Targeted Topic Construction)* | Pick any Building $\rightarrow$ pick any weak **Sub-Topic** $\rightarrow$ **10 curated questions** (mixed MCQ/MSQ/NAT, unhurried **15-min soft timer**). Includes post-question 1-line diagnostic cue *after* locking answer. | Official GATE marks out of ~14–16. `>= 75%` score awards **3 Blueprint Stars** for that building. | Highest **Building Upgrade efficiency** (+15% topic-repair bonus on Mastery score; clears any `Rusty` state). `15 Coins` first clear/day. | **Targeted Retrieval & Delayed/Explanatory Feedback**: repairs exact weak sub-topics without penalty overwhelm. |
| **3. Archive Boss** *(Past-Paper Section Siege)* | Fight a **"Keeper of GATE [Year]"** (e.g., *2023 CS Section Boss*): **15 authentic questions** from one official past paper's subject block in **35 minutes** (no mid-run solution peeks). Must defeat HP bar ($\ge 55\%$ of max GATE marks = 1 Star; $\ge 75\%$ = 2 Stars; $\ge 90\%$ = 3 Stars). | Strict GATE marking, zero mercy on blind MCQ guesses. | **First-time clear per Boss:** `+40 Coins`, **+1 Mastery Seal** (at 3 Stars), Boss Trophy Plaque for Trophy Room. | **Authentic Exam Transfer & Desirable Difficulty**: simulates genuine IIT paper phrasing & negative-marking risk judgment. |
| **4. Daily Scroll** *(Global Seeded 10-Q Challenge)* | **Same 10 questions for every player worldwide** each IST calendar day (`00:00 IST` reset): 2 GA + 2 Engg Math + 6 Core CS (mix of 1M/2M, MCQ/MSQ/NAT). **15-minute window.** One attempt per day. | Ranked by: (1) Net GATE Marks, tiebreak (2) Total solve time. | Completing earns `+20 Coins` + `+15 Season Crown Seals` + refreshes Daily Streak. Top 20% daily finish earns **+1 Mastery Seal**. Friends-only Daily Leaderboard shows peer ranks! | **Spaced Mixed Retrieval + Social Proof**: creates shared watercooler discussion among friends ("Q7 NAT caught everyone!"). |
| **5. Mistake Exorcism** *(Bonus Mode — Inside Game)* | Pulls 8 questions directly from the user's server **Mistakes Bank** (spaced $\ge 3$ days after error). No timer pressure. | Official GATE marking; overcoming an old error flips status to **"Exorcised"** on server. | Restores `+2x` spaced-recovery Mastery weight (`0.65` repeat multiplier) + `+12 Coins` (1/day). | **Spaced Retrieval on Error Traces**: targets the highest-leverage score leaks. |

---

## 4.5 Attack and Defend (Async, Clash-Style)

### How Async Raids Work (Using Real Recorded Defense Performances)
A player **never** fights a fake AI bot pretending to be a user. When you scout and attack another player's Citadel:
1. **Choosing a Target Wing (Building):** On the enemy island, up to 3 unlocked subject buildings display **"Ready to Raid"** pennants (based on the defender's subject history). You pick which subject wing to breach (e.g., *Query Vault Lv 3*), OR launch a **Full Citadel Raid** targeting their Town Hall (mixed across their strongest 3 buildings + Aptitude Grounds).
2. **The Defender's "Garrison" = Their Real Performance Ledger:**
   - The server selects **6 real GATE questions** from that building's subject (matching the defender's building tier: e.g., Level 1–2 = 1M/Easy-Med heavy; Level 4–5 = 2M/MSQ/NAT heavy) where the defender has **already recorded an authentic attempt & solve time**.
   - **Defender's Score Baseline ($D_{\text{score}}$) & Time ($D_{\text{time}}$):** The defender's real historical answers on those 6 questions act as the fortress's turrets! For each question where the defender answered correctly, that turret fires back (you see a live ghost marker: *"@Arjun solved Q2 in 44s"*). Where the defender got it wrong or skipped, the wall has a visible crack—if you solve it right, you breach their weakness!
   - *(Cold-start safeguard: If a player reached Building Level 1 solely via Mocks/Practice and lacks 6 clean defense-logged questions in that sub-bracket, the server fills remaining slots from anonymized verified Citadel peers of identical building level and clearly labels them "Allied Garrison Record".)*

### Battle Resolution & 1–3 Star Rules (Echoing *Clash of Clans*)
Match runs on a crisp **8-minute battle clock** (6 questions, GATE marking; max ~9–10 marks possible).
- **1 Star (Outer Wall Breached):** Attacker achieves **Net GATE Score $> 0$** AND reaches **$\ge 50\%$** of max possible marks for the set (analogous to 50% destruction).
- **2 Stars (Town Hall / Monument Captured):** Attacker **beats the Defender's Net Score ($A_{\text{score}} > D_{\text{score}}$)** (or ties $A_{\text{score}} = D_{\text{score}}$ with faster time $A_{\text{time}} < D_{\text{time}}$) AND scores $\ge 50\%$ marks.
- **3 Stars (Total Citadel Conquest):** Attacker beats the Defender's score **AND** achieves **$\ge 85\%$** of max possible marks with **zero negative MCQ penalties**.

### Trophies, Coins, Revenge & Shields

| Outcome | Attacker Arena Elo Δ (Base $K=24$) | Attacker Loot | Defender Impact |
| :--- | :--- | :--- | :--- |
| **3 Stars** | Full Elo Win (`+12` to `+24` depending on Elo diff) | `20 Coins` + `+30 Arena Pts` + `+10 Season Seals` | Loses `0.5x` Elo (`-4` to `-10`) — softened so offline defenders never tilt! |
| **2 Stars** | Full Elo Win (`+10` to `+20`) | `15 Coins` + `+30 Arena Pts` + `+7 Season Seals` | Loses `0.5x` Elo (`-3` to `-8`) |
| **1 Star** | Half Elo Win (`+4` to `+8`, or `0` if defender much lower) | `10 Coins` + `+15 Arena Pts` + `+4 Season Seals` | **Defender Holds! (`0` Elo lost, `+5 Coins` Defense Bonus)** |
| **0 Stars (Repelled)** | Elo Loss (`-8` to `-18`) | `5 Coins` (Finish Pt `8`) | **Successful Defense! `+10 Coins` + `+15 Arena Pts` + `+4 Elo`!** |

*Note on Point Caps:* Strictly honors the existing server rule: **max 10 point-earning battles/day** (`30` win / `15` draw / `8` finish; coins `20/10/5`) [Prompt §2]. After 10 battles, players can still train/raid for mastery & Elo, with an honest notice: *"Daily Coin/Arena-Point cap reached (10/10) — great study momentum, Mastery XP still active!"*

- **Shields & Village Guard (Clash-inspired):**
  - When a defender suffers a **2-Star or 3-Star Raid**, their Citadel receives an automatic **12-hour Raid Shield** (cannot be randomly matched by strangers) so nobody gets raided five times overnight.
  - **Crucial Anti-Turtling Twist:** Attacking in PvP reduces active Shield by **4 hours** (not instant full deletion on first tap, avoiding Clash's harsh all-or-nothing break while still discouraging shield hoarding); **Training, Friend Challenges, Daily Scroll, and Clan Wars NEVER touch your Shield**.
- **Revenge & Replays:**
  - Every incoming raid appears in your **Battle Ledger Obelisk** (`Inbox / Defense Log`), showing which subject wing fell, the 6 questions' topics, and a **"Revenge" flaming-sword button**.
  - Tapping **Revenge** lets you raid the attacker back on the **subject wing of YOUR choice** (with a `+20% Coin Revenge Bonus`!). If the attacker is currently under Shield, the button honestly displays `"Shielded for 4h 12m — Try again later"` (never silently bypassing shields).
  - **Summary "Replay":** Shows a 6-step turn-by-turn timeline scrubber comparing Question Type, Your Answer vs. Opponent Answer, Marks Delta, and Time Taken per question—plus a 1-tap **"Add My Errors to Mistakes Bank"** inside the game!

### Fairness Across Different Levels
1. **Matchmaking Bands:** Async search matches within **$\pm 1$ Town Hall level** AND **$\pm 150$ Elo** first, expanding slightly only if pool < 5 eligible defenders.
2. **Level-Gap Scaling (inspired by CoC TH loot scaling):** Attacking a Citadel 2+ Town Hall levels *below* you cuts Coins/Arena Points by `50%` and caps Elo gain at `+4`. Attacking a higher-TH Citadel yields a `+25% Giant-Slayer Coin Bonus`.
3. **Friend Challenges (Zero-Stake / Equalized):** Challenging a friend directly uses the **existing Async / Scheduled / Live Battle engine** [Prompt §2] where both answer the **exact same fresh 8-question set** (ignoring defense history asymmetries completely!).

---

## 4.6 Live Duels and Events

### 1. Live 1v1 Duels (Real-Time)
Builds directly on RENYXERA's existing live battle backend (`both ready up -> server sets shared 6-second countdown -> live progress -> server-graded`) [Prompt §2]:
- **Format:** **7 questions, 8 minutes** (fixed shared set across selected mode: *All-GATE Mixed*, *CS Core Only*, or *Speed Math + GA*).
- **Live Tension Without Clutter:** During battle, you see the opponent's compact **Progress Banner** (`Q4/7 • 2 Correct • Live`), *without* seeing which option they clicked, preventing copy-guessing. Finishing early locks your time-bonus tiebreaker.
- **Lichess Puzzle-Racer Mechanic:** Every 3 consecutive correct answers ignites a subtle **Scholar's Focus Multiplier** (purely visual/audio brass chime & +2 Season Crown Seals on win—never distorts official GATE marks!).

### 2. Friend Challenges & Scheduled Duels
- **Instant Friend Invite:** Pick online/recent friend from Friends Tray $\rightarrow$ pick Subject or Full Mock-Mini (5, 10, or 15 Qs) $\rightarrow$ choose **Live Now** or **Async (up to 7 days)** [Prompt §2].
- **Scheduled Duels:** Propose an IST time slot (e.g., *"Tonight 10:30 PM IST · OS vs DBMS 10-Q Showdown"*). Sends PWA notification / in-game Inbox bell. Room stays open $\pm 10$ minutes around kickoff; if one misses it, auto-converts cleanly into a 7-day Async Battle rather than hanging!

### 3. Weekly Club Wars & Weekend Mini-Tournaments
- **Weekly Club Clash (Friday 18:00 IST – Sunday 22:00 IST):** Clubs opt in (minimum 3 active members). Matched against another Club of similar size & average Elo (see §4.7).
- **Sunday Night "Sankalp Showdown" (20:00–21:30 IST):** Weekly open 90-minute Arena Sprint (inspired by Lichess Arena tournaments): play up to 5 Live/Ghost Duels on a curated GATE theme (e.g., *Pointers & Dynamic Programming Night*); top 10% earn a weekend crest & `+1 Mastery Seal`.

### 4. Honest Fallbacks When Few Players Are Online (CRITICAL RULE)
Because competitive exams have spiky traffic (crowded 9 PM–1 AM IST, quiet at 6 AM or 3 PM), matchmaking NEVER fakes a human opponent:
- **0–20s Search:** Matches real human within `±120 Elo`. Real UI reads: *"Searching Arena (±120 Elo)..."* with real online duelist count badge (if `<5` in queue, honestly show `"Quiet hours in Arena"`).
- **20–40s Search:** Widens to `±280 Elo`.
- **40s Timeout — Explicit Choice Card (Never a Bot Trap):**
  1. **"Duel a Recorded Ghost" (Instant Play):** Matched against a *verified recorded live run* by a real student at your Elo on an unseen question set. Header clearly states: **`RECORDED GHOST · @rohan_cs (1140 Elo) · Recorded Nov 12`**. Rewards full Coins, Mastery XP, and `0.5x` Elo (`K=12`, capped at $\pm 8$ Elo so ghost farming is bounded).
  2. **"Post Open Challenge" (Async):** Play the set right now and pin it to the **Arena Tavern Board** for up to 7 days; any matching student who picks it up later completes the duel and settles `K=24` Elo asynchronously!
  3. **"Switch to Blitz Rush":** 1-tap transition to solo timed training.

---

## 4.7 Clans ("Sabha" / Study Guilds)

Built atop existing `clubs` (`create/join with a code, up to 30 members, weekly club points board`) [Prompt §2].

### Clan Structure & Roles
- **Up to 30 members.**
- **Roles:**
  - **Acharya (Leader, 1):** Transfers leadership, edits Clan Banner/Motto, starts Wars, promotes Elders/Co-Leaders, kicks inactive members.
  - **Upacharya (Co-Leader, up to 3):** Starts Wars, manages War roster, accepts/rejects join requests.
  - **Senapati (Elder, up to 6):** Invites friends, pins Weekly Focus Subject.
  - **Sadasya (Member):** Participates in Wars, donates Reinforcements, earns Weekly Club Points.

### Moderation-Free Social Layer (Zero Toxicity, Zero Moderation Cost)
Indian student forums can quickly turn noisy or toxic. In V1–V2, Clan communication stays **100% moderation-free**:
- **Structured Status Feed + Emote Wheel + Preset Study Ping Templates:**
  - Preset Pings: *"Need 1 more for War Attack!"*, *"OS Deadlocks giving trouble — anyone up for a Friendly 1v1?"*, *"GG on that 3-Star!"*, *"Target Compiler Works next!"*, *"Good night & sleep well!"*
  - **12 Illustrated Brass/Parchment Emotes** (Salute, Namaste, Sharpen Sword, Lightbulb Eureka, Coffee/Chai Cup, GG Scroll, Shield Up).
  - **Zero free-text global chat** in V1/V2 (eliminates spam, coaching-ad bots, slur moderation burden, and legal liability on ₹0 budget). Clan Names & 60-char Mottos pass a strict ASCII/alphanumeric profanity filter on the Worker.

### Clan Citadel ("Sabha Hall" & "Caravan Outpost")
A shared miniature island viewable right from the Clan tab! Every member's weekly points build **Clan Level (1–10)** and visually upgrade the shared Sabha Hall (lanterns, courtyard library, war drums).

### Clan Donations (100% Non-Paid, Pedagogical!)
Instead of donating paid troops, members donate **"Scholar Reinforcements" (Hint Scrolls & Shield Charges)**:
- **Request Reinforcements (4-hour cooldown):** Tap `"Request Clan Backup"`.
- **Donating:** Any clanmate can spend **10 Earned Coins** (or complete a quick **2-Question Mentor Check**) to send **1 "Hint Lantern"** OR **1 "Extra Time Ward (+20s)"** into the requester's Clan Castle slot (max 2 stored).
- **Usage:** Usable **only** in Async Raids or Clan War Boss attacks (never in Live 1v1 ranked duels or Archive Bosses, keeping pure competitive Elo fair!). *Hint Lantern* highlights the sub-topic formula/concept tag without revealing the answer!

### Clan Wars (Two Modes: PvP Clan War & PvE Past-Paper Leviathan)

1. **Clan War (Clan vs. Clan — Weekend 48-Hour Cycle, Fri–Sun):**
   - **Prep Window (12h Fri 06:00–18:00 IST):** Leaders pick active roster (`5v5`, `10v10`, or `15v15`, auto-scaled like CoC war sizes). Every participant's best subject bases populate the **War Map**.
   - **War Battle Day (36h):** Each rostered member gets **2 Attacks** against enemy war bases (no shield lost, separate War Map).
   - **Scoring:** Most total **Stars** wins; tiebreaker = **Average Net GATE Score %** across best attacks (analogous to CoC destruction %).
   - **War Loot:** Winners earn full War Chest (`+80 Coins`, `+2 Mastery Seals`, `+150 Clan XP`); runners-up who used both attacks still keep `40%` (`+32 Coins`, `+60 Clan XP`) so participation always feels worthwhile!

2. **Clan Operation: "The Past-Paper Leviathan" (Mon–Thu Cooperative Boss — Boom Beach Task Force style):**
   - Always available even when matchmaking another clan is hard!
   - A massive Fortress (e.g., *"The 2016–2025 Compiler & TOC Gauntlet — 250 HP"*) sits on the Clan Map with **6 Subject Nodes**.
   - Every clanmate gets **1 daily Operation Attack** (8 real GATE questions; every net mark deals 1–2 HP damage to the Node). Clearing all Nodes before Thursday midnight unlocks a **Clan Treasury Crate** for everyone who landed at least 1 hit!

### Clan Leagues & Non-Power Perks
- **Clan War Leagues (Bronze $\rightarrow$ Silver $\rightarrow$ Gold $\rightarrow$ Ivory $\rightarrow$ Imperial):** Weekly 4-clan mini-brackets (adapted from CoC CWL). Top clan promotes; bottom clan demotes.
- **Clan Perks (Zero Combat Power Inflation!):** Unlock at Clan Levels 2, 4, 6, 8, 10:
  - *Lv 2:* +10% Coins on Clan War payouts.
  - *Lv 4:* Donate 2 Hint Lanterns per request.
  - *Lv 6:* Custom Clan Crest patterns & War Banner border.
  - *Lv 8:* +15% Season Crown Seals from Clan Operations.
  - *Lv 10:* Golden Sabha Courtyard aura + Clan Hall Monument.

---

## 4.8 Economy & Shop

### Currencies (Strictly 2, Transparent & Fair)
1. **Brass Coins (`coins` — Existing Currency):** Everyday engagement & effort currency.
   - **Sources:**
     - Daily Caravan Check-in: `10/day` (`60` on Day-7 streak [Prompt §2]).
     - Battles / Async Raids: `20` win / `10` draw / `5` finish (max 10 point-earning battles/day [Prompt §2]).
     - Daily Scroll: `20` completion.
     - Siege Drill / Blitz Rush: `12–15` (max 3/day).
     - Successful Offline Defense: `10` (max 3/day).
     - Scholar Island Taps: `1` x 3/day.
     - Clan War / Operation payouts: `32–80`.
     - **Realistic Daily Earnings:** Casual `~50–70/day` (~1,800/mo); Serious `~130–200/day` (~4,500/mo).
   - **Sinks:**
     - **AI Mentor Token Boosts** (existing shop link — e.g., `150 Coins` = +5 Mentor Explanations, keeping study & game seamlessly synergistic without buying battle strength!).
     - **Avatar Frames, Clan Donation Scrolls (`10 Coins`), Island Decorations (`80–400 Coins`), Building Classic Skins (`300–650 Coins`), Victory Animations (`250 Coins`), Emotes (`120 Coins`), Streak Freeze (`180 Coins`, max 1 held — prevents streak anxiety!).**
2. **Mastery Seals (`seals` — New Prestige Skill Currency):**
   - **Why Justified:** Coins measure time/habit; **Mastery Seals** measure *un-grindable excellence* (preventing coin inflation from cheapening elite Citadel skins).
   - **Sources (Hard-Capped by Skill):**
     - Building reaches Level 3 (`1 Seal`), Level 4 (`2 Seals`), Level 5 (`3 Seals`).
     - 3-Star an Archive Past-Paper Boss (`1 Seal` per unique paper).
     - Top 20% in Daily Scroll (`1 Seal`, max 2/week).
     - Free Season Track milestones (`6 Seals` total/season).
     - Clan War Victory (`2 Seals`/week).
     - League Promotion Milestone (`1–4 Seals` once/season).
   - **Sinks (Prestige Cosmetics Only):**
     - Alternate Island Themes (*Stepwell Twilight, Himalayan Monastery Courtyard, Nalanda Terracotta Dusk*: `8–12 Seals`).
     - Grand Monument Skins for Level 5 Buildings (`5 Seals`).
     - Prestigious Animated Titles & Trophy Room Pedestals (`3–6 Seals`).

### Anti-Farming & Ethics Guardrails
- **Zero Loot Boxes / Gacha:** Every shop item shows its exact Coin or Seal cost upfront.
- **Zero Pay-to-Win:** Plus (₹29/mo) and Pro (₹99/mo) plans unlock study-side features (e.g., unlimited AI Mentor / deep analytics) and **NEVER** grant extra Elo, harder shields, stronger hints, or faster building levels inside Citadel Arena! (Optional harmless cosmetic thank-you badge *"Patron Crest"* for Plus/Pro subscribers.)
- **30-Day Economy Balance Target:**
  - *Casual (30d):* Earns ~1,750 Coins, ~8 Mastery Seals. Buys 2 Decorations (`240`), 1 Avatar Frame (`200`), 1 Building Skin (`350`), 2 Mentor Boosts (`300`), 1 Emote (`120`), 1 Island Theme (`8 Seals`), ending Day 30 with ~540 Coins buffer (healthy, aspirational, never starved or bloated).
  - *Serious (30d):* Earns ~4,600 Coins, ~26 Mastery Seals. Unlocks 2 Island Themes (`18 Seals`), 1 Monument Skin (`5 Seals`), 4 Building Skins (`1,600`), 5 Decorations (`750`), 4 Mentor Boosts (`600`), Victory FX (`300`), Streak Freeze (`180`), Emote Pack (`360`), ending with ~810 Coins & 3 Seals.

---

## 4.9 Screens (All 17 Screens: Purpose, Phone/Desktop Layouts, States, Wireframes)

Design rule across **all** screens:
- **Phone (`390×844`):** Critical primary actions sit in the **bottom 35% thumb zone**; top bar holds compact status pills only; minimum `44×44 px` touch targets.
- **Desktop (`1440×900`):** True two- or three-column spatial workspace (never a stretched 600 px mobile column floating in empty background!).

---

### Screen 1: Entry Transition ("GATE Sanctum Doors")
- **Purpose:** Clean psychological threshold separating study utility from play space.
- **Phone (390 px):** Full-bleed sandstone carved double-doors sliding apart (`520 ms`) revealing warm dusk Citadel; audio toggle pill unobtrusively visible on threshold (`Audio: Muted [Tap to Enable]`).
- **Desktop (1440 px):** Wide monumental archway doors parting across full viewport with subtle parallax reveal of the island behind.
- **States:** *Loading:* Engraved brass compass slowly fills as sprite/chunk preloads (`<1.2 s`). *Reduced Motion:* Cross-fade (`200 ms`) with static door emblem. *Error:* Fallback retry button + "Return to Study".
```
PHONE (390px)                     DESKTOP (1440px)
+-----------------------+         +-------------------------------------------------+
|                       |         |             \                     /             |
|     \           /     |         |              \    [ SANCTUM ]    /              |
|      |  GATE   |      |         |      CARVED   |                 |   CARVED      |
|      | SANCTUM |      |         |    SANDSTONE  |  <--  [o]  -->  |  SANDSTONE    |
|      |  DOORS  |      |         |      DOOR     |    WARM DUSK    |    DOOR       |
|     /     |     \     |         |              /   ISLAND REVEAL   \              |
|    [Sound: Off/On]    |         |             /   [Sound: Off/On]   \             |
+-----------------------+         +-------------------------------------------------+
```

### Screen 2: Citadel Home (The Living Island)
- **Purpose:** Spatial command center. Every building, prop, and scholar is tappable.
- **Phone (390 px):** Top HUD (2 compact rows: Town Hall Lv + Player XP | Coins + Seals + League badge + Inbox/Settings gear). Center 72% = touch pan/pinch-zoom Canvas Citadel. Bottom persistent **4-Dock + Hero Battle CTA** (`Train`, `Clans`, **[RAID / DUEL]**, `Leagues`, `Shop`). Floating contextual pills when tapping a building.
- **Desktop (1440 px):** Full-bleed Citadel Canvas (`~72%` width) flanked by a collapsible **Right Inspector / Quick-Feed Dock (`340 px`)** showing Today's Scroll, Active Clan Operation, and Online Friends, plus compact top-left Citadel Header and bottom-center **Action Ribbon** (`Train`, `Attack`, `Live Duel`, `Clan`, `Shop`, `Exit Door`). Zero empty space!
- **States:** *Loading:* Parchment map outline skeleton with Town Hall compass spinner. *Empty (Day 1):* All 11 ruins pulsing softly with glowing brass pointer on **Code Workshop**; Daily Caravan waiting. *Offline:* "Offline Training Ready" banner; PvP buttons disabled with clear badge. *Locked:* Outer island plots shaded behind mist with `"Unlocks at Town Hall Lv X"`.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +------------------------------------------------------+
| [TH2] 1042 Elo  [C:240] |                  | [Exit] [TH2] Citadel  [Elo 1042] [C:240 S:4] [Set]  |
| [Lv8] Qualifier [S: 4 ] |                  +------------------------------------+-----------------+
+-------------------------+                  |                                    | DAILY SCROLL    |
|       ~ Dusk Sky ~      |                  |        ~ Warm Dusk Sky ~           | [10Q · 15m]     |
|   [Obs]  [TH]   [Sig]   |                  |    [Maths]  [Automata]  [Sig]      | [Play Today ->] |
|  [Keep]  * *   [Vault]  |                  |   [Code]   [TOWN HALL]  [Vault]    +-----------------+
|   [Eng] [Gate]  [Forge] |                  |    [Eng]    [Keep]     [Forge]     | ACTIVE CLAN     |
| [Boat/Clan] [Exit Door] |                  |   [Logic]  [Compiler]  [Apt]       | Op HP: 142/250  |
|   [Scholar: "Check OS!"]|                  | [Pier/Clan] [Caravan]  [Exit Arch] | [1 Attack Left] |
+-------------------------+                  +------------------------------------+-----------------+
| [Trn][Cln][BATTLE!][Shp]|                  | [Train] [Raid Base] [Live 1v1] [Leagues] [Shop]    |
+-------------------------+                  +------------------------------------------------------+
```

### Screen 3: Building Panel (Slide-Up Sheet / Right Drawer)
- **Purpose:** Inspect subject mastery, sub-topic stars, defense garrison log, and launch subject training or upgrade.
- **Phone (390 px):** Bottom sheet (`75%` height, swipe-down dismiss) revealing Building sprite stage (`L0–L5` preview carousel), Mastery bar formula breakdown (`Unique Qs`, `Accuracy`, `Recency`), **Topic Star Grid**, and primary thumb CTA (`Train [Subject]` / `Complete Upgrade!` / `Skin`).
- **Desktop (1440 px):** Anchored right-hand walnut-and-parchment inspector drawer (`420 px` wide) keeping the selected building centered and highlighted on the island canvas to the left.
- **States:** *Loading:* Shimmering brass frame skeleton. *Empty (L0 Ruins):* `"Solve 6 unique questions to restore Timber Outpost"` CTA. *Locked (Next Level):* Exact missing requirement checklist (`Needs 7 more unique Qs & +4% recent accuracy`). *Rusty State:* Amber moss indicator + `"1 Refresher Drill clears dust"`.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +--------------------------+---------------------------+
|   (Dimmed Citadel Top)  |                  |                          | KERNEL KEEP · LV 3  [X]   |
+-------------------------+                  |   [Focused Building      | Mastery: 51/100 (to Lv4:62|
| KERNEL KEEP · LV 3 [X]  |                  |    Highlighted on        | Acc: 66% | Qs: 44 | Fresh  |
| [Sprite] Mastery: 51/62 |                  |    Citadel Canvas]       |---------------------------|
| Qs:44/65 | Acc:66%      |                  |                          | TOPICS:                   |
|-------------------------|                  |                          | Scheduling    [***] 86%   |
| TOPICS (Tap to Drill):  |                  |                          | Deadlocks     [** ] 68%   |
| • Scheduling  [***] 86% |                  |                          | Virtual Mem   [*  ] 49% ! |
| • Deadlocks   [** ] 68% |                  |                          | File Systems  [   ] 20% ! |
| • Virtual Mem [*  ] 49% |                  |                          |---------------------------|
| • File Sys    [   ] 20% |                  |                          | Defense: Won 4 / Lost 2   |
|-------------------------|                  |                          | [DRILL WEAK] [SKIN] [BOSS]|
| [ DRILL WEAKEST TOPIC ] |                  +--------------------------+---------------------------+
+-------------------------+
```

### Screen 4: Training Select
- **Purpose:** Choose solo training mode inside the game (Blitz Rush, Siege Drill, Archive Boss, Daily Scroll, Mistake Exorcism).
- **Phone (390 px):** Vertical scrollable stack of 5 tactile mode cards; **Daily Scroll** pinned at top with countdown to `00:00 IST`; bottom thumb bar for `"Quick Launch Recommended Weak Drill"`.
- **Desktop (1440 px):** `2×3` balanced grid of engraved brass mode cards (`Daily Scroll` featured wide top-left; side card showing weekly training XP & building upgrade projections).
- **States:** *Loading:* Card frame skeletons. *Empty (Mistake Exorcism):* `"Zero pending mistakes — clean slate! Try Archive Boss."` *Locked (Archive Boss):* Shows `"Unlocks at Town Hall Lv 1"` for higher-year hard bosses. *Error:* Cached offline notice allowing queued solo drills where pre-fetched.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +------------------------------------------------------+
| <- CITADEL   TRAINING   |                  | <- CITADEL       TRAINING GROUNDS         [Coins]    |
+-------------------------+                  +-----------------------------------+------------------+
| [DAILY SCROLL]  11h 42m |                  | [DAILY SCROLL · 10 Qs · 15m]      | WEEKLY MOMENTUM  |
| Same 10 Qs · 1.2x XP    |                  | Global IST Seed · [PLAY NOW ->]   | +340 XP | 4/7d   |
|        [PLAY DAILY]     |                  +-----------------+-----------------+------------------+
|-------------------------|                  | BLITZ RUSH      | SIEGE DRILL     | ARCHIVE BOSS     |
| [BLITZ RUSH] 5m · 3 X   |                  | 5m · 3 Strikes  | Pick 10Q Topic  | Past-Paper 15 Qs |
| Speed + Interleaving    |                  | [START RUSH]    | [PICK TOPIC]    | [2024 SET ->]    |
|-------------------------|                  +-----------------+-----------------+------------------+
| [SIEGE DRILL] 10Q Topic |                  | MISTAKE EXORCISM (14 queued)      | SMART SUGGESTION |
| [ARCHIVE BOSS] 2024 CS  |                  | Spaced Recovery · [START ->]      | Kernel Keep near |
| [MISTAKE EXORCISM (14)] |                  |                                   | Lv 4! [Drill OS] |
+-------------------------+                  +------------------------------------------------------+
```

### Screen 5: The Question Battle Screen
- **Purpose:** High-clarity, low-friction competitive combat interface—distinct from the sterile exam simulator while preserving exact GATE question fidelity (MCQ/MSQ/NAT, clean math/code blocks, zero distraction during thought).
- **How It Differs From the Study Exam Screen:**
  - **Exam Screen:** Clinical white/grey CBT palette, 65-Q side palette, static 180-min clock, "Mark for Review", zero animations or sounds.
  - **Battle Screen:** Warm parchment-stone card (`#FAF4E8` high contrast for night/day legibility), **Top Combat HUD** (Opponent/Boss HP or Live Progress Track + **Combo Focus Flame** + **3-Strike Hearts** in Rush or **Shields**), **Virtual GATE Scientific Keypad** drawer for NAT, crisp **Post-Lock Tactile Feedback** (amber gold stamp + subtle harmonic pluck on submit; immediate 1-line check in Drills/Rush, withheld until finish in Live 1v1/Boss for fairness), and optional **Clan Hint Lantern** button in async raids!
- **Phone (390 px):** Top combat strip (`12%`). Scrollable question prompt (`48%`). Bottom sticky answer options A/B/C/D or NAT keypad + **LOCK ANSWER** full-width thumb button (`40%`).
- **Desktop (1440 px):** Split arena: Top full-width Duel/Boss Health Header; Left `58%` = spacious readable Question & Diagram Canvas (diagrams zoomable on click); Right `42%` = Tactile Stone Option Tiles, NAT Keypad, Question Jump Pips, and Live Opponent Pulse / Clan Lantern slot.
- **States:** *Loading:* Waiting for server question seed / 6-second shared countdown (`3... 2... 1... ENGAGE!`). *Disconnected (Live Duel):* Non-blocking top amber pill `"Reconnecting... timer paused 15s grace"`. *Locked:* Already answered questions show locked wax-seal badge.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +------------------------------------------------------+
| YOU: 3/6 [2.6m] | VS    |                  | [YOU: Q3/6 · 3.67 Marks] ====[VS]==== [@arjun: Q4/6] |
| @arjun: Q4/6 · Combo x2 |                  | 05:42 Left · 2-Mark MCQ (-2/3)         [Clan Hint]   |
+-------------------------+                  +--------------------------------+---------------------+
| Q3 (2-Mark MCQ · -2/3)  |                  | QUESTION 3 · OPERATING SYSTEMS | CHOOSE OPTION:      |
| Consider a 4-page frame |                  |                                | [A] 7 page faults   |
| memory with Belady's... |                  | Consider a 4-page frame memory | [B] 9 page faults   |
|   [Diagram / Code]      |                  | using FIFO replacement on the  | [C] 10 page faults  |
|-------------------------|                  | reference string: 1,2,3,4...   | [D] 11 page faults  |
| (A) 7   (B) 9           |                  |                                |---------------------|
| (C) 10  (D) 11          |                  | [Click Diagram to Enlarge]     | [  LOCK ANSWER -> ] |
|-------------------------|                  |                                | Qs: [✓][✓][•][ ][ ] |
| [Lantern] [LOCK ANSWER] |                  +--------------------------------+---------------------+
+-------------------------+
```

### Screen 6: Result and Rewards
- **Purpose:** Celebratory payoff + honest learning diagnosis (never hiding mistakes behind confetti!).
- **Phone (390 px):** Top Star Banner (1–3 Stars slamming in sequentially), Scoreboard Duel Comparison, Coin/Elo/XP/Building Mastery animated counters, and expandable **Question-by-Question Review List** with `"Save Errors to Mistakes Bank"` + `[Rematch]` / `[Next]` / `[Citadel]` thumb buttons.
- **Desktop (1440 px):** Two-column layout: Left `45%` = Star Crest, Trophy/Elo Delta, Building Progress Ring, Coins/Seals loot tray, and action buttons; Right `55%` = Full 6–15 Question Diagnostic Table showing Your Time vs. Opponent Time, GATE Marks earned, Official Solution summary, and 1-tap Mistake-Bank toggle.
- **States:** *Loading:* `"Server grading answers..."` wax seal animation. *Empty (0 Stars):* Encouraging banner `"Repelled! +5 Effort Coins — 2 concepts flagged for Drill"`. *Error:* Retry receipt fetch without losing graded attempt.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +--------------------------+---------------------------+
|   [★]   [★]   [☆]       |                  |    VICTORY · 2 STARS!    | QUESTION BREAKDOWN        |
|   VICTORY! (+16 Elo)    |                  |  YOU: 6.33m | OPP: 5.00m | Q1 [1M MCQ] ✓ +1.0  32s   |
+-------------------------+                  |  +16 Elo (1058 Qualifier)| Q2 [2M NAT] ✓ +2.0  58s   |
| YOU: 6.33m | OPP: 5.00m |                  |  +15 Coins | +120 OS XP  | Q3 [2M MCQ] ✗ -0.67 41s   |
| +15 Coins | +7 Seals    |                  |  Kernel Keep: 48 -> 55!  |   -> See Solution / Pin   |
| Kernel Keep: 48 -> 55   |                  |                          | Q4 [2M MSQ] ✓ +2.0  74s   |
|-------------------------|                  | [Save 1 Mistake to Bank] | Q5 [1M MCQ] ✓ +1.0  29s   |
| REVIEW (Tap Q for Sol): |                  |                          | Q6 [2M NAT] ✓ +1.0  64s   |
| Q3 ✗ -0.67 [Add Mistake]|                  | [REMATCH] [TO CITADEL]   | [Pin All Wrong to Bank]   |
|-------------------------|                  +--------------------------+---------------------------+
| [REMATCH]   [CITADEL]   |
+-------------------------+
```

### Screen 7: Attack Target Select
- **Purpose:** Scout real opponents for Async Raids or trigger Live 1v1 matchmaking with honest pool visibility.
- **Phone (390 px):** Top Tabs (`Raid Targets`, `Live 1v1`, `Friends`, `Tavern Open Board`). Shows 3 scoutable opponent Citadel cards (TH Lv, Elo, Vulnerable Subject Wings, Loot/Elo preview) + `"Scout Next (Free)"` button (`1s` cooldown anti-spam).
- **Desktop (1440 px):** Top Mode Switcher + Left `60%` interactive 3-card Target Carousel / Live Queue Radar; Right `40%` Detailed Scouting Brief (Target's TH level, recent defense rate, available wings, expected Elo win/loss).
- **States:** *Loading:* Brass spyglass sweep. *Empty (Friends offline):* `"No friends online right now — send an Async Raid or Duel a Ghost!"` *Locked:* Opponent under Raid Shield shows exact timer.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +------------------------------------------------------+
| <- CITADEL   BATTLE HUB |                  | <- CITADEL   [ASYNC RAIDS] [LIVE 1v1] [FRIENDS]      |
+-------------------------+                  +----------------------------------+-------------------+
| [Raids] [Live] [Friends]|                  | SCOUTED CITADELS (3 Matched):    | SELECTED TARGET   |
|-------------------------|                  | +------------------------------+ | @priya_gate (TH2) |
| 1. @priya_gate · TH 2   |                  | | @priya_gate · TH 2 · 1084 Elo| | Weakest Wing:     |
|    Wings: [OS] [DBMS]   |                  | | Bounty: +20C | +18/-9 Elo    | | Compiler Works L1 |
|    [SCOUT CITADEL ->]   |                  | | Wings: [OS Lv2] [Comp Lv1]   | | Strongest Wing:   |
|-------------------------|                  | +------------------------------+ | Query Vault Lv3   |
| 2. @vikram99 · TH 3     |                  | | @vikram99   · TH 3 · 1120 Elo| |                   |
|    Giant-Slayer +25% C  |                  | | Giant-Slayer (+25% Coins!)   | | Est Win: +18 Elo  |
|-------------------------|                  | +------------------------------+ | Est Loss: -9 Elo  |
| [Next Target] [LIVE 1v1]|                  | [Refresh Scouts]                 | [VIEW ENEMY BASE] |
+-------------------------+                  +----------------------------------+-------------------+
```

### Screen 8: Enemy Base View (Scouting Before Attack)
- **Purpose:** Inspect an opponent's island visually, pick which subject wing to raid, and see your prep checklist before committing.
- **Phone (390 px):** Full island canvas of enemy base (`65%`) with pulsing target markers on 3 attackable subject buildings; tapping a building updates bottom Raid Drawer (`Wing Name`, `Building Lv`, `Marks/Duration`, `[LAUNCH RAID]`).
- **Desktop (1440 px):** Enemy Citadel canvas (`65%`) + Right Tactical Briefing Panel (`35%`) comparing your building level vs. theirs per raidable wing + Clan Hint Lantern toggle.
- **States:** *Locked:* Target shielded while you were scouting (`"Shield just activated — Next Target"`). *Error:* Network check prevents stale attack start.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +-----------------------------------+------------------+
| <- BACK    @priya_gate  |                  | <- SCOUTING: @priya_gate (TH 2)   | TARGET BRIEFING  |
+-------------------------+                  +-----------------------------------+------------------+
|   [Enemy Island View]   |                  |                                   | Selected Wing:   |
|      [TH2]              |                  |     [Enemy Isometric Island]      | QUERY VAULT LV 2 |
|   [!] Vault   [!] OS    |                  |                                   | Your Lv: 3 (+Adv)|
|       [!] Comp          |                  |     [!] Query Vault Lv 2 (*)      | 6 Qs · 8 Mins    |
|-------------------------|                  |     [!] Kernel Keep Lv 2          | Max Bounty:      |
| Selected: QUERY VAULT 2 |                  |     [!] Compiler Works Lv 1       | +20C | +18 Elo   |
| 6 Qs · 8m · +20 Coins   |                  |     [ ] Town Hall (Full Raid)     | [x] Use Lantern  |
| [Lantern] [LAUNCH RAID] |                  |                                   | [LAUNCH RAID ->] |
+-------------------------+                  +-----------------------------------+------------------+
```

### Screen 9: Clan Home ("Sabha Hall")
- **Purpose:** Manage clan community, donate Hint Lanterns, launch Operations/Wars, inspect weekly Club Points board.
- **Phone (390 px):** Top Clan Crest/Level + Weekly Points progress; Middle mini-canvas of shared Sabha Hall (`30%` height); Bottom scrollable Tabs (`Roster (24/30)`, `Donate & Pings`, `Clan War / Op`). Fixed bottom `"Donate / Request Backup"` button.
- **Desktop (1440 px):** Left `38%` Sabha Hall diorama + Clan Stats + Quick Emote/Ping Bar; Center `32%` Active Member Roster & Weekly Points Board (30 max); Right `30%` Donation Feed & War/Operation Shortcut Card.
- **States:** *Empty (No Clan):* Shows `"Join with Code"` input + `"Browse Open Clans"` list (filtering by active members & target study intensity) + `"Found a New Clan (50 Coins)"`. *Error:* Join limit `30/30` clearly communicated.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +------------------+-------------------+---------------+
| <-   IIT-ASPIRANTS Lv4  |                  | SABHA HALL Lv 4  | ROSTER (24/30)    | CLAN FEED     |
| Code: GATE42 · 24/30    |                  | [Shared Courtyard| 1. @neha   420 pt | @raj requested|
+-------------------------+                  |  Diorama Canvas] | 2. @you    390 pt | Hint Lantern  |
| [Shared Sabha Diorama]  |                  |                  | 3. @amit   310 pt | [Donate 10C]  |
+-------------------------+                  | Weekly: 4,280 pt | ...               |---------------|
| [Roster] [Feed] [Wars]  |                  | [Send Study Ping]|                   | [PINGS/EMOTES]|
| • @raj needs Lantern!   |                  | [Go to Clan War] |                   | "War soon!"   |
|   [Donate 10 Coins ->]  |                  +------------------+-------------------+---------------+
| • @neha: "GG 3-Star!"   |
+-------------------------+
| [REQ BACKUP] [CLAN WAR] |
+-------------------------+
```

### Screen 10: Clan War / Past-Paper Leviathan
- **Purpose:** Show either the live Fri–Sun Clan vs. Clan War Map OR the Mon–Thu Cooperative Boss Operation.
- **Phone (390 px):** Top Scoreboard (`Our Stars vs Enemy Stars` or `Leviathan HP 142/250`); Vertical stepped War Path showing Enemy Bases / Boss Nodes (`1–6`); Bottom bar showing `Attacks Remaining: 2/2` and `[Attack Selected Node]`.
- **Desktop (1440 px):** Full War Battlefield Map (`65%` width — two facing island camps or 6-node Leviathan Fortress) + Right `35%` War Log, Star/Damage Breakdown, and Attacks Remaining action drawer.
- **States:** *Empty / Off-Cycle:* `"Weekend Clan War starts Friday 18:00 IST — Leviathan Operation active now!"` *Locked (Spectator):* Clan members outside active 10v10 roster see `"Cheer Clanmates"` (send free morale emote).
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +----------------------------------+-------------------+
| <-   WAR DAY (14h left) |                  | <- CLAN WAR: US 28★ vs THEM 26★  | NODE #2 · @kiran  |
| US: 28★ (71%) | THEM:26★|                  +----------------------------------+-------------------+
+-------------------------+                  |  OUR BASES        ENEMY BASES    | Status: 1★ (54%)  |
| #1 @arjun_th3  [★★★]    |                  |  [1] TH3 (3★) --- [1] TH3 (3★)   | Best Attacker:    |
| #2 @kiran_th2  [★☆☆]    |                  |  [2] TH2 (1★) --- [2] TH2 (1★)<- | @dev (5.1/8m)     |
| #3 @mira_th2   [☆☆☆]    |                  |  [3] TH2 (0★) --- [3] TH2 (2★)   | Your Attack can   |
| ...                     |                  |  [4] TH1 (3★) --- [4] TH1 (3★)   | earn +2 Stars!    |
+-------------------------+                  |                                  |                   |
| Attacks Left: 1/2       |                  | War Tiebreak: Us 71% vs Them 68% | Attacks Left: 1/2 |
| [ATTACK #2 FOR +2 STARS]|                  |                                  | [ATTACK NODE #2]  |
+-------------------------+                  +----------------------------------+-------------------+
```

### Screen 11: Leagues & Ranking
- **Purpose:** View 5-tier League ladder, 4-week Season progress track, weekly/all-time leaderboards (Friends / Everyone / Club), and Season Badges.
- **Phone (390 px):** Top League Crest Card (`Qualifier II · 1115 Elo`); Segmented Tabs (`Season Track`, `Friends`, `Global`, `Weekly`); Scrollable list with your row pinned sticky at bottom if scrolled out of view.
- **Desktop (1440 px):** Left `42%` = Horizontal/Vertical "Path of the Citadel" Free Season Track (24 nodes) + Current League Tier Breakdown; Right `58%` = Tabbed Leaderboards (`Friends`, `Everyone`, `Clubs`) + Past Season Top-10 Badges.
- **States:** *Empty (No Friends):* Prompts `"Add a friend by username to compare Daily Scroll & Elo"` with copy-username button. *Loading:* Table row shimmer.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +-------------------------+----------------------------+
| <-   QUALIFIER II (1115)|                  | SEASON 4 TRACK (17/24)  | LEADERBOARDS               |
| Next: Qualifier I (1150)|                  | [M16 Frame] ✓ Claimed   | [Friends] [Global] [Clubs] |
+-------------------------+                  | [M17 50C  ] (312/340)   |----------------------------|
| [Season][Friends][All]  |                  | [M18 Seals] Locked      | #1 @ananya    1422 Topper  |
|-------------------------|                  |-------------------------| #2 @rohit     1289 Ranker  |
| #1 @ananya   1422 [Top] |                  | LEAGUE LADDER:          | #3 @you       1115 Qual II |
| #2 @rohit    1289 [Rnk] |                  | Legend     1600+        | #4 @sana      1048 Aspir I |
| #3 @you      1115 [Qu2] |                  | Topper     1400-1599    |----------------------------|
| #4 @sana     1048 [As1] |                  | Ranker     1200-1399    | Top-10 Badges: [S3 #8]     |
+-------------------------+                  | >Qualifier 1050-1199    | Resets in: 11d 06h IST     |
| [CLAIM M16 REWARD]      |                  +-------------------------+----------------------------+
```

### Screen 12: Profile & Trophy Room
- **Purpose:** Showcase hard-earned academic mastery as museum trophies—titles, subject monument badges, past-paper boss plaques, and lifetime GATE stats.
- **Phone (390 px):** Player Banner (Avatar, Frame, Title, Clan Crest, TH Level); 3-column Trophy Shelf (Boss Plaques, Season Badges, Subject Lv5 Medals); Bottom Career Summary (`Total PYQs`, `MCQ vs MSQ vs NAT Accuracy`, `3-Star Raids`) + `[Equip Title/Frame]`.
- **Desktop (1440 px):** Top Identity Banner (`100%`); Left `45%` = Interactive 11-Subject Mastery Radar + Question-Type Breakdown (MCQ/MSQ/NAT); Right `55%` = Physical Wooden Trophy Cabinet displaying unlockable Boss Plaques, Season Ribbons, and Achievement Medals with tooltip lore.
- **States:** *Empty (New Player):* Display empty velvet slots in Trophy Cabinet with clear unlock hints (`"Defeat 2024 Boss to mount plaque"`).
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +------------------------------------------------------+
| <-  [Frame] @you  [Edit]|                  | [Avatar+Frame] @you · "Night-Watch Sentinel" · TH 2  |
| "Night-Watch Sentinel"  |                  +------------------------+-----------------------------+
+-------------------------+                  | QUESTION ACCURACY      | TROPHY CABINET              |
| TROPHY CABINET          |                  | MCQ: 71%  MSQ: 64%     | [2024 Boss] [S3 Badge] [ ]  |
| [2024 Boss][S3 #8][Lv5] |                  | NAT: 59%  Best: OS 82% | [3-Star x15][NAT x50]  [ ]  |
| [  Empty  ][Empty][   ] |                  |                        |                             |
|-------------------------|                  | 11-BUILDING LEVELS:    | EQUIPPED:                   |
| CAREER STATS            |                  | OS:3 DB:3 Alg:3 Net:2  | Title: Night-Watch Sentinel |
| Unique PYQs: 412        |                  | TOC:2 Cmp:1 COA:2 ...  | Frame: Brass Astrolabe      |
| Wins: 28 | Best Elo:1130|                  | [Compare With Friend]  | [Change Cosmetics]          |
+-------------------------+                  +------------------------+-----------------------------+
```

### Screen 13: Shop (Cosmetics & Study Synergy Only)
- **Purpose:** Spend Coins and Mastery Seals on Citadel visuals, decorations, emotes, Streak Freeze, and Study App AI Mentor boosts.
- **Phone (390 px):** Currency Header (`Coins` + `Seals`); Horizontal Category Pills (`Themes`, `Skins`, `Deco`, `Mentor Boosts`, `Frames/Emotes`); 2-column crisp item cards with live preview thumbnail and exact price tag.
- **Desktop (1440 px):** Left `62%` = Categorized 3-column Cosmetic Storefront; Right `38%` = **Live Interactive Preview Window** rendering your selected Theme/Building Skin/Frame right onto a mini Citadel vignette before buying!
- **States:** *Locked:* Items gated by Mastery Seals show `"Costs 8 Mastery Seals — Earn from Bosses & Season Track"`. *Owned:* Clear `"EQUIPPED"` / `"EQUIP"` toggle.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +-----------------------------------+------------------+
| <- SHOP   [C:420] [S:6] |                  | <- SHOP  [Themes][Skins][Deco][AI]| LIVE PREVIEW     |
+-------------------------+                  +-----------------------------------+------------------+
| [Themes][Skins][Deco]   |                  | +--------+ +--------+ +--------+  | [Mini Citadel    |
|-------------------------|                  | |Nalanda | |Carved  | |Banyan  |  |  showing         |
| +---------+ +---------+ |                  | |Dusk    | |Lotus   | |Sapling |  |  selected skin   |
| |Nalanda  | |Mentor   | |                  | |8 Seals | |180 C   | |90 C    |  |  in dusk light]  |
| |Theme    | |Boost x5 | |                  | +--------+ +--------+ +--------+  |                  |
| |[8 Seals]| |[150 C]  | |                  | +--------+ +--------+ +--------+  | Owned? No        |
| +---------+ +---------+ |                  | |Streak  | |Brass   | |Chai    |  | [BUY FOR 8 SEALS]|
| |Lotus    | |Chai     | |                  | |Freeze  | |Frame   | |Emote   |  |                  |
| |Pond     | |Emote    | |                  | |180 C   | |250 C   | |120 C   |  |                  |
| |[180 C]  | |[120 C]  | |                  | +--------+ +--------+ +--------+  +------------------+
+-------------------------+
```

### Screen 14: Settings
- **Purpose:** Complete sensory, performance, study-health, and accessibility controls inside the game.
- **Phone (390 px):** Single-column grouped cards (`Audio`, `Motion & Graphics`, `Accessibility`, `Notifications`, `Night Study Guard`); generous `48 px` slider/toggle rows.
- **Desktop (1440 px):** Left `30%` Category Rail + Right `70%` Two-Column Clean Control Sheet with live `"Test Sound"` and `"Test Haptic"` buttons.
- **States:** *iOS Note:* Haptics row honestly detects browser capability and notes `"System vibration unavailable on iOS Safari; visual micro-pulse used"`.
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +-------------------+----------------------------------+
| <-       SETTINGS       |                  | AUDIO             | AUDIO CONTROLS                   |
+-------------------------+                  | GRAPHICS          | Master Sound     [  ON  ]        |
| AUDIO                   |                  | ACCESSIBILITY     | Music Volume     [====---] 55%   |
| Music Volume  [===--]   |                  | NIGHT GUARD       | SFX Volume       [======-] 80%   |
| SFX Volume    [====-]   |                  |                   | Raag Ambience    (Sync IST / Pin)|
| Raag Mood     [Auto IST]|                  |                   |----------------------------------|
|-------------------------|                  |                   | GRAPHICS & ACCESSIBILITY         |
| GRAPHICS & COMFORT      |                  |                   | Reduced Motion   [Auto OS / On]  |
| Reduced Motion  [Auto]  |                  |                   | Low-Power Mode   [ OFF ] (30fps) |
| Low-Power 30fps [Off]   |                  |                   | High-Contrast    [ OFF ]         |
| Haptics         [On]    |                  |                   | Number Style     [Tab / Western] |
| Night Wind-Down [01:00] |                  |                   | Night Reminder   [01:00 IST]     |
+-------------------------+                  +-------------------+----------------------------------+
```

### Screen 15: Inbox & Notifications ("Battle Ledger")
- **Purpose:** Central hub for Incoming Raids + Revenge buttons, Friend Duel Challenges, Clan Invites, Daily Caravan notices, and Server Maintenance updates.
- **Phone (390 px):** Tabs (`Attacks`, `Challenges`, `System`); chronological cards with direct inline actions (`[Revenge]`, `[Accept Duel]`, `[Claim]`).
- **Desktop (1440 px):** Left `45%` Filterable Message List; Right `55%` Full Event / Battle Trace Preview with immediate Revenge Scout or Replay view.
- **States:** *Empty:* `"Your walls stood untouched today — no unread alerts."`
```
PHONE (390px)                                DESKTOP (1440px)
+-------------------------+                  +-------------------------+----------------------------+
| <-   BATTLE LEDGER      |                  | INBOX [Attacks][Duels]  | RAID REPORT · 3h AGO       |
+-------------------------+                  +-------------------------+----------------------------+
| [Raids (2)] [Duels (1)] |                  | • @rohan raided Kernel  | @rohan scored 2★ (5.67m)   |
|-------------------------|                  |   2★ · -6 Elo [Revenge] | vs your defense (4.33m)    |
| • @rohan raided Kernel  |                  | • @sneha challenged you | Topics Hit: Virtual Mem    |
|   2★ · -6 Elo · 3h ago  |                  |   Live/Async [Accept]   |                            |
|   [Replay] [REVENGE!]   |                  | • Daily Reward Claimed  | [VIEW 6-Q REPLAY]          |
|-------------------------|                  |   +10 Coins             | [LAUNCH REVENGE (+20% C)]  |
| • @sneha sent 10Q Duel  |                  +-------------------------+----------------------------+
|   Expires in 6d [Play]  |
+-------------------------+
```

### Screen 16: Exit Transition ("Sanctum Exit Door")
- **Purpose:** Respectful closure back to the study app without guilt-tripping.
- **Phone & Desktop:** Confirmation popover if exiting mid-unclaimed reward (`"Exit to Study App?"` — optional 1-line summary: `"Today: 14 Qs solved · Kernel Keep +6%"`), then `450 ms` warm sandstone door closing wipe leading seamlessly into `/dashboard` or `/test-centre` (with a button `"Review Today's Mistakes"` if user opts right into study).
```
+-------------------------------------------------------------------+
|                     LEAVING CITADEL ARENA                         |
|           "Today's Mastery: 14 Qs · Kernel Keep +6%"              |
|     [ Doors sliding shut smoothly -> Redirect to Study App ]      |
+-------------------------------------------------------------------+
```

### Screen 17: First-Time Tutorial (90-Second Guided Restoration)
- **Purpose:** Teach by *playing*—zero 12-slide wall of text!
- **Phone & Desktop:**
  - *Step 1 (0–15s):* Land on ruins. Old Architect Scholar points at **Code Workshop (Ruins)**: *"Start here—solve 3 quick real GATE questions to raise the timber frame!"*
  - *Step 2 (15–60s):* Solve 3 fast, gentle 1-mark PYQs right inside the Battle Screen.
  - *Step 3 (60–75s):* Return to Citadel—Code Workshop rises from Ruins $\rightarrow$ Timber Outpost! `+25 Coins` + `+100 XP`.
  - *Step 4 (75–90s):* Arrow points to **Daily Scroll** or **First Scout Raid**: *"Your island is alive! Ready to raid or train on your own?"* (Skip button discreetly available after Step 1 for returning test-centre veterans who already have Lv 2+ buildings auto-calculated on entry!).
```
+-------------------------------------------------------------------+
|  [Architect] "Your Code Workshop lies in ruins. Solve 3 quick     |
|               Programming questions to raise its roof!"           |
|              ==> [RESTORE CODE WORKSHOP (3 Qs)] <==  (Skip ->)    |
+-------------------------------------------------------------------+
```

---

## 4.10 Visual Direction

### Color Rule Compliance
**Zero purple (`#4f46e5`, `#7c3aed`) and zero electric/neon blue (`#3b82f6`, `#06b6d4`) anywhere in the game UI or world.** (Note: The study app's root theme metadata uses `#4f46e5`, so Citadel Arena overrides theme-color and CSS tokens entirely inside `/battles`.)

### Two Visual Directions (With Recommendation)

#### Direction A: **"Sandstone & Terracotta Dusk" (RECOMMENDED — Matches Existing Palette)**
Inspired by Jaipur sandstone stepwells, Nalanda terracotta brick, and carved walnut-and-brass instruments.
- **Sky / Backdrop:** Layered warm dusk ochre-to-apricot wash (`#2A1E17` night -> `#8C4B2D` horizon -> `#E09658` sunlit cloud edge -> `#F3CA99` upper glow — rendered as crisp painterly stepped bands, NOT blurry radial CSS glow soup).
- **Terrain & Water:** Sun-warmed meadow sage (`#6E8547`, `#586E38`), sandstone plateau cliffs (`#C99A6B`, shadow `#8B6242`), burnished olive-jade sea (`#3D5A52`, dusk reflection `#C98A4B`).
- **UI Panels & Frames:** Dark walnut wood (`#2D1E16`, border `#5A3E2B`), aged parchment cards (`#FAF3E3` text background for ultra-sharp question legibility!), burnished brass accents (`#C8963E`, highlight `#E8C16F`), primary text charcoal-espresso (`#1E1510`), semantic states: **Correct = Sage Leaf (`#2E7D4F`)**, **Warning/Negative = Terracotta Vermilion (`#B83B28`)**, **Bonus/Gold = Saffron (`#D9821E`)**.
- **Contrast:** `#1E1510` on `#FAF3E3` exceeds **13:1**; `#FAF3E3` on `#2D1E16` exceeds **12:1**—well above WCAG 2.1 AA requirements (`4.5:1` text, `3:1` UI components).

#### Direction B: **"Ivory Stepwell & Copper Dawn"**
Brighter architectural drafting aesthetic—sun-bleached limestone (`#EFE5D1`), oxidised verdigris copper roofs (`#3F7865`), umber ink outlines (`#241C16`), and saffron ribbons (`#D87A24`). Great as an unlockable Island Theme (*"Dawn Stepwell"*), whereas Direction A wins as the default because its darker walnut-and-dusk tones protect late-night mobile eyes!

### Lighting, Linework, Frames & Materials
- **Lighting:** Consistent top-left `35°` golden dusk sun angle across every isometric building (`2:1` dimetric projection, `26.57°`). Top planes catch warm apricot (`#F1C994`), right faces fall into warm umber shadow (`#7B5238`).
- **Linework:** Crisp `1.5 px` warm espresso ink outlines (`#2A1C15`) on buildings and UI badges—gives handcrafted boardgame/diorama charm instead of blurry soft-3D blobs.
- **UI Frames:** Beveled brass corner rivets on walnut plaques (`2 px` inner highlight top edge `#6E4E37`, `3 px` solid tactile bottom lip simulating physical press travel!).

### Typography (100% Free Google Fonts)
- **Display / Titles / Building Plaques:** `Fraunces` (warm, subtly engraved soft-serif) or `Newsreader` (authoritative editorial serif).
- **UI Body & Question Stem:** `Plus Jakarta Sans` (clean geometric legibility at `14–16 px` on small Android screens, high x-height).
- **Numbers, Timers, Code Snippets, NAT Answers:** `JetBrains Mono` with `font-variant-numeric: tabular-nums` so countdown timers and Elo numbers never jitter horizontally!

### Iconography & Signature Detail
- **Iconography:** Custom monochrome/two-tone engraved SVG line-and-fill icons (`20×20` / `24×24`, `1.75 px` stroke, rounded caps): brass compass, crossed calipers, parchment scroll, wax seal, gear shield. **Zero system emoji icons anywhere.**
- **The One Signature Detail:** **The Town Hall Courtyard Astrolabe & Clockwork Gears**—an animated brass astrolabe ring set into the central plaza stone that physically gains one inlaid golden tooth for each of the 11 subjects reaching Level 3+, glowing softly at night in sync with your overall GATE readiness!

### Explicit "Anti-AI-Slop" Blacklist (What We NEVER Ship)
1. **NO** frosted glassmorphism blur (`backdrop-filter: blur(...)`) smeared over dark rainbow blobs.
2. **NO** neon outer-glows (`box-shadow: 0 0 25px rgba(...)`) on buttons or cards.
3. **NO** multi-stop purple/magenta/cyan gradients.
4. **NO** system emojis (`🔥`, `⚔️`, `🏆`, `💎`) as UI icons.
5. **NO** floating AI-generated raster icons with mismatched lighting angles.
6. **NO** generic "Inter + rounded-2xl dark slate card" SaaS dashboards pretending to be a game.

---

## 4.11 Motion and Game Feel

Powered by `motion/react` (`LazyMotion` + `m` features, keeping motion bundle near **~5 kB** instead of ~34–43 kB) wrapped globally in `<MotionConfig reducedMotion="user">` so OS accessibility settings and our in-game toggle automatically simplify every transform to fast `opacity` fades.

### 18 Core Animations Specification

| # | Event | Duration & Easing | Choreographed Motion | Reduced-Motion Version |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Primary Button Tap** | `90 ms` press / `140 ms` release, `cubic-bezier(0.2, 0.8, 0.2, 1)` | Translates `Y +3px` compressing bottom lip shadow; crisp scale `0.985` | Instant color darken (`80 ms` opacity swap) |
| 2 | **Building Tap (Citadel)** | `240 ms`, spring `stiffness: 420, damping: 24` | Quick squash (`scaleY: 0.94, scaleX: 1.04`) $\rightarrow$ bounce up `1.03` $\rightarrow$ settle `1.0`; dust ring puff | Subtle brass highlight border (`150 ms`) |
| 3 | **Sanctum Doors Open (Entry)** | `520 ms`, `cubic-bezier(0.22, 1, 0.36, 1)` | Carved stone halves slide `-52% / +52%` X while Citadel scales `0.96 -> 1.0` | `200 ms` warm parchment crossfade |
| 4 | **Sanctum Doors Close (Exit)** | `440 ms`, `cubic-bezier(0.4, 0, 0.2, 1)` | Doors slide shut meeting at center with slight `15 ms` seam impact tremor (`±2px`) | `180 ms` crossfade to exit card |
| 5 | **Scaffold Construction Start** | `380 ms`, `ease-out` | Timber posts drop down `Y: -18px -> 0` sequentially (`40 ms` stagger) + dust puff | Scaffolding appears immediately (`120 ms` fade) |
| 6 | **Building Level Up Reveal** | `1100 ms` total | Canvas zooms gently to building (`300 ms`) $\rightarrow$ scaffold drops away $\rightarrow$ new tier pops (`0.88 -> 1.06 -> 1.0`) $\rightarrow$ 12 brass spark particles & banner ribbon | Banner toast + crisp crossfade to new building sprite (`220 ms`) |
| 7 | **Town Hall & Island Expansion** | `1400 ms` | Camera centers on island; mist clouds drift outward horizontally revealing new terrain terrace; astrolabe ring clicks one notch | Static reveal toast + mist toggle (`250 ms`) |
| 8 | **Attack Start ("Engage")** | `650 ms` | Crossed brass swords lock at top center $\rightarrow$ radial split wipe unveils Battle Screen | `180 ms` clean fade into Q1 |
| 9 | **Lock Answer Button** | `160 ms`, `ease-out` | Selected stone tile depresses; wax seal badge stamps down (`scale 1.3 -> 1.0`) | Immediate locked border highlight |
| 10 | **Correct Answer Feedback** | `320 ms` | Sage border flash + subtle upward green "+1.0 / +2.0" floating chip (`Y: 0 -> -14px`, fade out) + Combo Pip ignites | Instant static "+1.0" badge + sage check |
| 11 | **Wrong MCQ Penalty Feedback** | `340 ms` | Horizontal micro-shake (`±4px`, 2 cycles — never violent, WCAG safe!) + vermilion "-0.33/-0.67" badge + gentle error note | Vermilion outline + static "-0.33" badge (zero shake) |
| 12 | **3-Streak Focus Combo** | `360 ms` | Combo crest rotates `15° -> 0°` with warm amber pulse ring (1 cycle, never looping >3 flashes/sec per WCAG SC 2.3.1!) | Static `"3x Focus"` pill highlight |
| 13 | **Opponent Progress Tick (Live)** | `260 ms`, `ease-in-out` | Opponent track pip advances smoothly along progress bar with subtle dot ripple | Instant pip step update |
| 14 | **Star Reveal (Result Screen)** | `280 ms` each (`180 ms` stagger) | Stars `1 -> 2 -> 3` stamp from `scale 2.1, opacity 0` down to `1.0` with micro-thud | Sequential `120 ms` opacity fade-in |
| 15 | **Coin / Seal Arc Flight** | `480 ms`, quadratic Bezier | Up to 6 coin sprites arc from Reward Chest to Top Coin Counter, incrementing counter ticks via RAF | Counter counts smoothly or snaps (`200 ms`) |
| 16 | **Elo & League Promotion** | `950 ms` | Old Crest cracks/dissolves into brass filings $\rightarrow$ New League Crest scales in (`0.7 -> 1.08 -> 1.0`) with ribbon unfurl | Crest swaps via crisp fade (`250 ms`) |
| 17 | **Drawer / Sheet Slide** | `240 ms` open / `190 ms` close | Phone bottom sheet slides with spring (`damping: 30, stiffness: 360`); desktop right inspector slides `X: 32px -> 0` | `150 ms` opacity fade |
| 18 | **Scholar Tip Bubble** | `220 ms` in, `2.5s` hold | Speech bubble springs up above tapped Scholar's head (`scale 0.6 -> 1.0`) | Immediate crisp tooltip |

### Camera & Island Feel + Haptics
- **Island Camera Pan/Zoom:** Smooth inertia (`velocity * 0.92` per frame) clamped strictly inside island bounding box so the user can never lose the island off-screen! Tapping a building on Phone gently pans the camera (`300 ms`) so the building sits cleanly in the upper `40%` above the `Building Panel` bottom sheet. Double-tap resets zoom to `1.0x`.
- **Haptic Patterns (`navigator.vibrate`, guarded & graceful):**
  - *Note on platform support:* `navigator.vibrate()` works on Android Chrome/Edge/Samsung Internet (~77.6% global mobile coverage) and is **unsupported on iOS Safari**—our wrapper silently no-ops when `typeof navigator?.vibrate !== 'function'` and pairs every tactile moment with visual compression + optional click SFX.
  - *Tap UI / Building:* `12 ms`
  - *Lock Answer:* `18 ms`
  - *Correct / Star Slam:* `[20, 30, 35]`
  - *Wrong Penalty:* `[45, 35, 25]`
  - *Building Level Up / League Promotion:* `[30, 40, 25, 40, 60]`

---

## 4.12 Sound and Music (Original ₹0 Hindustani Acoustic Identity)

### Sound Identity: **"Dusk Sanctum Acoustic"**
Instead of hollow plastic synth bloops found in generic quiz apps, Citadel Arena speaks in warm, tactile Indian classical acoustics—**Tanpura drone**, **Santoor/Sitar-like Karplus-Strong plucks**, **Tabla/Pakhawaj modal drum taps**, **Bansuri breath-flute phrases**, and **bronze Ghanti chimes**—anchored to genuine Hindustani Raags matched to IST time-of-day!
- **Autoplay & Default Policy:** Audio starts **MUTED by default** on first visit (honoring Web Audio autoplay restrictions across Chrome/Safari and respecting late-night hostel roommates!). Tapping `"Enable Sound"` on the Entry Doors or the Citadel top bar immediately unlocks `AudioContext.resume()` and persists preference per device (`localStorage`) + account (`settings`).

### Mastering Chain & Loudness Targets
- **Targets (Portable / Mobile Game Standard):** **-18 LUFS (±2 LU) integrated loudness**, **-1.0 dBTP True Peak limit** (conforming to Sony ASWG-R001 Portable / ITU-R BS.1770 practice so phone speakers never distort and headphones at midnight never blast).
- **Web Audio Master Bus:**
  `[Music Bus] + [SFX Bus] -> BiquadFilterNode (High-pass 55 Hz cleanup) -> DynamicsCompressorNode (threshold -14 dB, ratio 4:1, attack 4 ms, release 120 ms, makeup +2 dB) -> Master Gain -> destination`
- **Acoustic Space:** Pre-generated `1.4 s` impulse response loaded into a shared `ConvolverNode` (synthesized exponentially decaying pink-filtered noise representing a sandstone courtyard) blended subtly at `14%` wet send!
- **Auto-Ducking:** Whenever a major fanfare (`Star Reveal`, `Level Up`, `Victory`) plays, the Music Bus smoothly ramps gain `-6 dB` for `1.2 s` (`linearRampToValueAtTime`) and recovers gently.

### 5 Original Music States (100% Browser-Synthesized + Zero-Cost Algorithmic Scheduling)

| Track | Raag & Scale (`Sa = D3 / 146.83 Hz` or `C#3`) | Mood & Instrumentation | How Scheduled in Browser |
| :--- | :--- | :--- | :--- |
| **1. Citadel Home (Dusk / Day)** | **Raag Yaman** (Kalyan Thaat: `S R G M# P D N S'`; Vadi `G`, Samvadi `N` — traditional evening/dusk raag!) | Gentle **Tanpura drone** (`Pa – Sa – Sa – Kharaj`, string ratios `0.75, 1.0, 1.0, 0.5`) + sparse generative **Santoor** plucks (`56–64 BPM` relaxed pulse) + rare **Bansuri** 3-note motifs | Procedural Web Audio sequencer scheduling phrases every 4–8 bars so it **never** sounds like an annoying 8-second loop! |
| **2. Citadel Home (Night / Dawn)** | **Night (20–05h): Raag Bhupali** (`S R G P D`, soothing 5-note pentatonic). **Dawn (05–09h): Raag Bhairav** (`S r G M P d N`) | Soft low-passed Tanpura (`cutoff 1400 Hz`) + muted warm **Santoor** arpeggios; ultra-calm concentration drone | Adapts automatically to IST clock (or user override) |
| **3. Battle / Raid Tension** | **Raag Bhimpalasi / Dorian pulse** (`108 BPM`) | Rhythmic **Tabla *Theka*** groove (sampled/synthesized *Na*, *Tin*, *Ge* bass modulation) + muted plucked ostinato; **shifts tempo subtly up `+8%` in final 60 seconds** | Tight Web Audio `AudioContext.currentTime` lookahead scheduler (`100 ms` lookahead, `25 ms` interval) |
| **4. Clan War / Boss Siege** | **Raag Darbari / Heroic Low Drone** (`92 BPM`) | Deep **Pakhawaj** two-headed drum pulse + low fifth drone + brass temple bell accents |Triggered seamlessly on War Map & Boss Screens |
| **5. Victory / Defeat Stings** | **Victory:** Ascending *Yaman* `G-M#-P-N-S'` phrase. **Defeat:** Descending thoughtful `P-M-G-R-S` sigh | 4-second resolution phrase over fading tanpura resonance (no harsh buzzer on loss!) | Fires once on Result Screen, crossfading back to soft drone |

### Complete Sound Effects Library (22 Original Recipes — 100% Free Web Audio Synthesis)
*(Plus optional tiny `<40 kB` CC0 stone/wood clicks from Freesound in V2 if desired; never CC BY-NC because Plus/Pro plans exist!)*

1. **UI Wood Click (Stone/Walnut Tap):** Short noise burst (`8 ms`) through `BiquadFilter` (`bandpass`, `f=1350 Hz, Q=4.5`) + `triangle` oscillator pitch drop (`280 -> 95 Hz` over `22 ms`).
2. **UI Scroll / Tab Switch:** Soft parchment rustle — `highpass` (`2200 Hz`) + `bandpass` (`4100 Hz, Q=1.2`) filtered pink noise, exponential envelope `0 -> 0.14 -> 0` in `45 ms`.
3. **Sanctum Doors Open (Entry):** Layered low `bandpass` stone scrape (`110 -> 180 Hz` over `420 ms`, noisy filtered sawtooth) ending in warm `Sa-Pa` Santoor chord strum (`146.8 Hz + 220 Hz`).
4. **Sanctum Doors Close (Exit):** Reverse stone slide (`160 -> 85 Hz` over `360 ms`) + heavy walnut latch thud (`sine 110 -> 45 Hz` in `55 ms` + bandpass click).
5. **Building Tap (Subject-Flavored):** Base resonant sandstone tap + subject harmonic pitch from Yaman scale (e.g., Kernel Keep plays `Sa`, Query Vault plays `Ga`, Signal Tower plays `Pa`).
6. **Scaffold Place (Wood Knock):** Dual `35 ms`-spaced woody knocks (`bandpass 620 Hz, Q=7` impulse into short resonant cavity).
7. **Building Level Up (Bronze Ghanti + Chord):** Inharmonic FM Brass Bell (`carrier = 440 Hz`, `modulator = 618 Hz`, mod index `2.8 -> 0.2` over `1.6 s` with ratios `[1, 2.0, 2.76, 4.07]`) + triumphant Santoor cascade (`S-G-P-N-S'`).
8. **Town Hall Upgrade Fanfare:** Deep **Shankh/Brass swell** (`triangle + sawtooth` through sweeping `lowpass 260 -> 1400 Hz` over `800 ms` with slow vibrato `5 Hz`) + dual temple bell strike.
9. **Scholar Tap ("Eureka Ping"):** High delicate *Jal Tarang* ceramic water-bowl chime (`sine` at `1174 Hz + 2352 Hz` subtle partial, `180 ms` decay).
10. **Answer Option Select:** Crisp dry slate tick (`sine 880 -> 520 Hz` over `14 ms`).
11. **Lock Answer (Wax Seal Stamp):** Soft felt impact (`lowpass 320 Hz` `sine 140 -> 60 Hz` `40 ms`) + crisp snap (`18 ms` later).
12. **Correct Answer (Tabla *Na* + Pluck):** Modal *Tabla Na* (`sine 293 Hz` + `440 Hz` overtone ring `180 ms` + `6 ms` slap transient) paired with bright **Karplus-Strong Santoor pluck** (white noise burst `12 ms` into delay line `1/f` damped by `2-tap` averaging `lowpass` filter).
13. **Combo Focus Escalation (x2, x3, x4):** Rising Karplus-Strong Santoor note stepping up the Raag (`Sa -> Re -> Ga -> Tivra Ma -> Pa -> Dha -> Ni -> Sa'`).
14. **Wrong MCQ Penalty (Soft Muted *Kinar* Thud):** Intentionally non-punitive muffled drum tap (`sine 135 -> 82 Hz`, `lowpass 450 Hz`, `90 ms` — firm error cue without grating buzzer anxiety!).
15. **Blitz Strike Lost (Crack):** Sharp wooden stick snap (`bandpass 1900 Hz` noise `25 ms` + `310 -> 140 Hz` body drop).
16. **Last 10 Seconds Heartbeat Pulse:** Subtle warm *Duggi* (bass tabla) double-tap (`75 -> 58 Hz` `80 ms` each) at `-16 dB` once per second.
17. **Star 1 / 2 / 3 Reveal:** Ascending Tabla + Ghanti hits pitched `Sa` (`293 Hz`), `Ga` (`367 Hz`), `Pa` (`440 Hz`), each preceded by `45 ms` swoop noise.
18. **Brass Coin Clink (Counter Increment):** Metallic FM ping (`carrier 2480 Hz`, `modulator 3710 Hz`, decay `55 ms`, tiny pitch randomization `±4%` per coin so rapid counting sounds organic!).
19. **Mastery Seal Awarded:** Deep resonant bronze gong shimmer (`220 Hz + 311 Hz + 493 Hz` FM swell, `1.1 s` decay).
20. **Clan Backup Requested / Donated:** Warm *Bansuri* 2-note call (`P -> S'` `sine + filtered white breath noise` `3%`, `350 ms`).
21. **Match Found / Countdown Tick (3-2-1-Go):** Three crisp *Manjira* finger-cymbal clicks (`bandpass 4800 Hz + 7200 Hz`, `90 ms`) followed by resonant *Dha* downbeat on `Go!`.
22. **Error / Locked Action:** Gentle double muted woodblock knock (`380 Hz -> 320 Hz`, `45 ms` apart).

### Exact Code Pattern for Karplus-Strong Pluck + Tabla Hit (Browser-Ready)
```ts
// Pre-baked at first unmute into OfflineAudioContext buffers (< 2 ms CPU!)
function synthesizeSantoorPluck(ctx: BaseAudioContext, freq: number, dur = 1.4): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * dur);
  const buf = ctx.createBuffer(1, len, sr);
  const out = buf.getChannelData(0);
  const N = Math.max(2, Math.round(sr / freq));
  const ring = new Float32Array(N);
  for (let i = 0; i < N; i++) ring[i] = (Math.random() * 2 - 1) * 0.7;
  let idx = 0;
  for (let i = 0; i < len; i++) {
    const next = (idx + 1) % N;
    const filtered = 0.496 * (ring[idx] + ring[next]); // 2-point lowpass damping
    ring[idx] = filtered;
    out[i] = filtered * Math.min(1, i / 64); // 1.5ms soft attack
    idx = next;
  }
  return buf;
}
```

---

## 4.13 Settings and Accessibility

### Complete In-Game Settings List
1. **Audio:** Master Toggle (Default: **Muted** on Day 1), Music Volume (`0–100%`), SFX Volume (`0–100%`), Ambience Mode (`Sync to IST Clock` / `Pin Dusk` / `Pin Night` / `Pin Dawn`).
2. **Motion & Performance:** Reduced Motion (`System Default` / `Always On` / `Off`), **Low-Power 30 fps Mode** (cuts canvas animation ticks to `30 fps`, disables birds/petals/smoke for older Android phones or `<20%` battery), **High-Contrast Outlines** (thickens stone/UI outlines + boosts text contrast).
3. **Tactile & Input:** Haptics (`On` / `Off` — auto-detects `navigator.vibrate`, displays honest note on iOS Safari), **Number Format** (`Western 1,234` vs. `Indian 1,23,456` for scores/coins while keeping standard decimals in NAT math answers), **Question Font Size** (`Normal 15 px` / `Large 17 px` / `XL 19 px`).
4. **Study Health & Late-Night Guard:**
   - **Night Wind-Down Reminder** (`Off` / `00:30 IST` / `01:00 IST` / `02:00 IST`) — grounded in sleep research showing sleep deprivation impairs working memory & memory consolidation (Hedges' $g = 0.621$ before learning, $g = 0.277$ after learning)! Shows a gentle non-blocking lantern banner: *"1:00 AM IST — Consolidation happens during sleep. Rest now to retain today's gains."*
   - **Notification Preferences:** Daily Scroll reminder, Incoming Raid alert, Clan War start (opt-in only, max 1/day).

### Accessibility & Offline Behavior
- **Color-Blind Safe Signals (Zero Color-Only Meaning):**
  - Correct = **Checkmark (`✓`) + Sage Green (`#2E7D4F`) + Solid Pill**.
  - Wrong = **Cross (`✗`) + Vermilion (`#B83B28`) + Dashed Border**.
  - Unattempted/Marked = **Circle / Hollow Pin**.
  - Building Upgrade Ready = **Hammer Icon + Animated Bounce (or Static Badge in Reduced Motion)**, never green-dot alone.
- **Keyboard & Screen Reader Navigation:** Every interactive building on the Canvas mirrors an invisible accessible `<button>` layer in the SVG/DOM hit-overlay with `aria-label="Kernel Keep, Operating Systems, Level 3, Mastery 51 of 100"` and arrow-key tab order.
- **Offline Behavior:**
  - PWA caches Citadel UI shell, static assets, and **1 pre-fetched 10-question Offline Drill Set** in IndexedDB when online.
  - If offline: PvP/Clans show clean `"Offline — Training Cache Ready"` chips; player can complete the cached offline drill and sync signed results upon reconnection (validated server-side with timestamp sanity checks).

---

## 4.14 Technical Design (₹0 Budget: Next.js 16 + Supabase Free + Cloudflare Workers Free)

### Free-Tier Resource Guardrails (Explicit Limits)
- **Supabase Free Plan:** `500 MB` database, `5 GB` egress, `200` concurrent Realtime connections, `2 million` Realtime messages/month, `5` Presence updates per client/30s. *Note: Supabase free projects pause after 7 days of zero DB activity* — a lightweight Cloudflare Worker Cron keeps an automated health ping active!
- **Cloudflare Workers Free Plan:** `100,000` requests/day, `10 ms` CPU time per invocation, unlimited free static asset requests (`<=20,000` files, `<=25 MiB` each), `3` Cron triggers/Worker.

### Additions to Existing Database Schema (PostgreSQL / Supabase)
Assuming existing tables cover `users/profiles`, `questions`, `attempts/analytics`, `battles`, `friends`, `clubs`, and `shop_items`. We add strictly lean, indexed tables staying well inside `500 MB`:

1. `citadel_buildings` (`user_id`, `subject_code`, `level SMALLINT`, `mastery_score NUMERIC(5,2)`, `unique_attempted INT`, `recent_accuracy NUMERIC(5,2)`, `rusty BOOLEAN`, `equipped_skin TEXT`, `updated_at`) — PK `(user_id, subject_code)`.
2. `citadel_state` (`user_id PK`, `town_hall_level SMALLINT`, `town_hall_exact NUMERIC(4,2)`, `xp INT`, `player_level SMALLINT`, `mastery_seals INT`, `island_theme TEXT`, `equipped_title TEXT`, `decorations JSONB`, `shield_until TIMESTAMPTZ`, `streak_freezes SMALLINT`, `night_guard_hour SMALLINT`, `settings JSONB`).
3. `defense_ledgers` (`id UUID PK`, `defender_id`, `subject_code`, `question_ids UUID[]`, `defender_answers JSONB`, `defender_times_ms INT[]`, `defender_net_score NUMERIC(5,2)`, `tier SMALLINT`, `created_at`) — Stores pre-compiled 6-question defense snapshots generated from the defender's real past attempts (`<=150 KB` across 1,000 users!).
4. `async_raids` (`id UUID PK`, `attacker_id`, `defender_id`, `subject_code`, `ledger_id UUID`, `attacker_answers JSONB`, `attacker_score NUMERIC(5,2)`, `stars SMALLINT`, `elo_delta_att INT`, `elo_delta_def INT`, `coins_awarded INT`, `seals_awarded INT`, `is_revenge BOOLEAN`, `revenge_used BOOLEAN`, `created_at`, `settled_at`).
5. `training_runs` (`id UUID PK`, `user_id`, `mode TEXT` [`rush` | `drill` | `boss` | `daily` | `exorcism`], `seed_date DATE`, `question_ids UUID[]`, `answers JSONB`, `net_score NUMERIC(5,2)`, `duration_ms INT`, `stars SMALLINT`, `created_at`).
6. `season_progress` (`user_id`, `season_id INT`, `crown_seals INT`, `claimed_milestones INT[]`, `loop_count INT`, `peak_league TEXT`, `demotion_buffer SMALLINT`, PK `(user_id, season_id)`).
7. `clan_wars` (`id UUID PK`, `clan_a_id`, `clan_b_id`, `mode TEXT` [`war` | `leviathan`], `status TEXT`, `starts_at`, `ends_at`, `clan_a_stars INT`, `clan_b_stars INT`, `boss_hp INT`, `state_json JSONB`).
8. `clan_reinforcements` (`id UUID PK`, `clan_id`, `requester_id`, `donor_id`, `item_type TEXT` [`lantern` | `time_ward`], `consumed BOOLEAN`, `created_at`).
9. `user_achievements` (`user_id`, `achievement_id`, `tier SMALLINT`, `unlocked_at`, PK `(user_id, achievement_id, tier)`).

**Row-Level Security (RLS):** Clients have `SELECT` only on public profiles, sanitized leaderboards, and their own rows; **ZERO direct `INSERT/UPDATE` permissions** on `coins`, `seals`, `elo`, `citadel_buildings`, or `async_raids`. All mutations route through Cloudflare Worker / Postgres RPC with JWT verification!

### Strict Server Authority (Browser Never Decides)
The browser **NEVER** computes or submits final scores, answers, Elo deltas, coin awards, shield timers, or building level thresholds:
- **Question Delivery:** Worker strips `correct_option`, `numerical_answer`, and `explanation` completely before sending question JSON to the browser!
- **Grading & Timing:** Worker records `started_at` on server upon battle/training start, accepts `{ question_id, answer, client_elapsed_ms }` submissions, verifies elapsed duration against `now() - started_at`, grades using official GATE marking (`+1/+2`, `-1/3`, `-2/3`), updates `user_question_history`, recomputes `Subject Mastery Score` in Postgres, updates `citadel_buildings`, and returns exact results + solutions.
- **Daily Caps & Idempotency:** Every reward request carries an idempotency key (`run_id` / `raid_id`), enforced atomically inside Postgres transactions.

### Scaling Supabase Realtime Within Free Limits (`200` Concurrent / `2M` Messages/Mo)
200 concurrent Realtime WebSocket connections is the tightest free-tier bottleneck! We preserve it ruthlessly:
1. **Do NOT open a Realtime channel on the Citadel Home screen!** Home updates (`Inbox`, `Clan Feed`, `Coins`) fetch once on entry + light `60s` visibility-aware polling (or `ETag` HTTP cache on Cloudflare Worker, keeping DB hits minimal).
2. **Open Supabase Realtime channels ONLY during:**
   - **Active Live 1v1 Duel (`live-battle:{id}`)** — Broadcast channel (`<=12` tiny `{qIndex, scoreCount}` messages per 8-min match; zero DB writes per tick!). Automatically `.unsubscribe()` the instant the result screen loads!
   - **Active Live Matchmaking Lobby** — Subscribe only while actively searching (`<=40s`), unsubscribing immediately upon match or Ghost fallback!
   - **Active Clan Home screen (optional)** — Only while viewing the Clan tab; disconnect on leaving tab.
3. **Why this stays safe:** Even with `1,500` Daily Active Users, if ~8% are in Live 1v1 simultaneously, concurrent Realtime sockets peak well under `120` (inside `200`), and monthly Realtime messages stay under `400k` (well under `2M`). Should concurrency pass 170, the Worker temporarily shifts Live Matchmaking pings to 2-second HTTP short-polling gracefully!

### Asset Pipeline & Mid-Range Android Performance Budgets
- **Sprites & Static Assets Hosted on Cloudflare Workers Static Assets (FREE, Unlimited Requests!):**
  - Building levels (`12 × 6 = 72` base sprites) authored cleanly as **modular vector SVG layers** or compiled **WebP sprite atlases (`2×` retina, ~450 kB total gzipped across 3 atlases)** cached aggressively via `Cache-Control: public, max-age=31536000, immutable`.
- **Performance Budgets (Mid-Range Snapdragon 680 / Helio G85 Phone on 4G):**
  - **Initial `/battles` JS Payload:** `<= 160 kB` gzipped (Next.js route-split, lazy-load Shop & Clan War maps).
  - **LCP:** `<= 2.2 s` (CWV Good `<= 2.5 s`).
  - **INP (Tap to Visual Feedback):** `<= 120 ms` (CWV Good `<= 200 ms`).
  - **CLS:** `0.00` (fixed canvas & HUD slots).
  - **Frame Budget:** `<= 4.5 ms` JS+Canvas draw per frame (leaving massive safety margin inside `16.67 ms` for 60 fps).
  - **Memory Ceiling:** `< 90 MB` JS heap + textures (dispose offscreen canvases cleanly on unmount).

---

## 4.15 Onboarding and Retention

### First 5 Minutes (Zero Friction, Instant Meaning)
- **0:00–0:20 (Threshold):** Click "Battles / Enter Citadel" in Study App $\rightarrow$ Sanctum Doors glide open $\rightarrow$ **Returning Study Users** see their existing solved PYQs *already raising buildings live in front of them!* ("Because you solved 34 OS questions in Test Centre, Kernel Keep starts at Level 2!"). **Brand-New Users** see the 11 ancient stone foundations.
- **0:20–1:30 (Interactive Restoration):** Architect Scholar taps **Code Workshop**. Player solves 3 quick 1-mark PYQs $\rightarrow$ Workshop builds visibly from Ruins $\rightarrow$ Outpost! (`+25 Coins`, `+100 XP`).
- **1:30–3:30 (First Taste of Competition):** Prompted gently to try either **Today's Daily Scroll (10 Qs)** OR **Scout a Beginner Citadel Raid (6 Qs)** against a matched Aspirant's real recorded defense.
- **3:30–5:00 (Social Hook):** Claim Day-1 Caravan Reward (`10 Coins`), optionally join a starter Study Clan via 1-tap Open Clans list, and see tomorrow's goal clearly (*"Solve 10 DBMS questions tonight to raise Query Vault to Lv 1"*).

### First Week Retention Arc (Without Exploitative Dark Patterns)
- **Day 1:** Restore 1st Building + Win 1st Raid + Join a Clan.
- **Day 2:** Unlock **Daily Caravan Streak** (`+10C`) + Try **Blitz Rush** (3 strikes).
- **Day 3:** First **Revenge Notification** (someone raided your Citadel—win it back for `+20%` Coins!).
- **Day 4:** Unlock 1st **League Promotion** (Aspirant $\rightarrow$ Qualifier at 1050 Elo) or **Town Hall Lv 1**.
- **Day 5:** First **Clan Operation ("Leviathan")** hit with teammates.
- **Day 6:** Buy 1st **Decoration or Building Skin** from earned Coins (`~150C`) or claim **Mentor Boost** for Study App!
- **Day 7:** **Day-7 Caravan Jackpot (`+60 Coins`)** + Week-1 Mastery Summary comparing Monday vs. Sunday across all 11 subjects!

### Notifications (Useful, Never Nagging)
- **Strict Cap:** Max **1 proactive push/day**, user-configurable, **quiet hours `00:30–07:30 IST` enforced**.
- **Useful Triggers Only:**
  1. `"@kiran challenged you to an OS Live/Async Duel (Expires 6d)"`
  2. `"Your Query Vault was raided (1★) — Revenge window open for +20% Coins!"`
  3. `"Weekend Clan War Battle Day began — 2 attacks ready."`
  4. `"Streak Guard: 10 mins left before midnight? Solve 1 quick Daily Scroll or use your Streak Freeze."`
- **Pushing Back to Real Learning (Seamless Synergy):**
  - Every Mistake in Citadel drops right into the Study App's **Mistakes Bank**.
  - When a player fails 2+ questions in a topic (e.g., *B-Trees*), the Building Panel displays a direct `"Study Note & Flashcard Needed?"` summary chip AND lets them buy **AI Mentor Tokens** with earned Coins right inside the Shop!

---

## 4.16 Metrics to Measure & Early Product Targets

Because RENYXERA is an early-stage product and we never invent current live baseline numbers, these are **instrumented post-launch target benchmarks** to track once Citadel V1–V2 ships:

| Category | Metric | Formula / Definition | Target Range (Early Product) |
| :--- | :--- | :--- | :--- |
| **Activation** | **Tutorial Completion Rate** | % entering `/battles` first time who complete the 3-Q restoration | `>= 72%` |
| **Core Learning** | **Questions Solved / DAU (In-Game)** | Mean server-graded PYQs per active Citadel player/day | `12 – 22 Qs/day` |
| **Learning Quality** | **Accuracy Progression (D1 vs D14)** | Mean accuracy delta on repeated weak sub-topics after Siege Drills | `+8% to +14%` |
| **Retention** | **D1 / D7 / D30 Citadel Return** | Cohort % returning to `/battles` on Day 1, 7, 30 | D1 `>= 45%`, D7 `>= 22%`, D30 `>= 11%` |
| **Social / Clans** | **Clan Attach Rate & Co-op Activity** | % of D7 retained players inside a `>= 5`-member active Clan | `>= 55%` |
| **Multiplayer Health** | **Async Raid Completion & Revenge Rate** | % of started raids finished / % raided players launching Revenge | Finish `>= 88%`, Revenge `>= 25%` |
| **Honesty / Queue** | **Live Match Human Connect Rate** | % of Live 1v1 queue attempts matching a live human within 40s (peak 7 PM–1 AM IST) | `>= 60%` peak (rest honestly routed to Ghost/Open) |
| **Study Synergy** | **Mistakes Bank Sync & Study App Cross-Session** | % of Citadel players who also open Test Centre or Review within 48h | `>= 65%` |
| **Technical** | **Mobile Frame Stability & LCP** | 75th-percentile Android LCP & 60 fps canvas stability | LCP `<= 2.3s`, `< 2%` dropped-frame sessions |

---

## 4.17 Risks and Architectural Mitigations

| Risk | Why It Happens | Concrete Prevention in Citadel Arena |
| :--- | :--- | :--- |
| **1. Addiction Displacing Deep Study ("Streak Creep")** | Duolingo researchers and critics note that streak obsession can make learners game the streak with trivial tasks instead of studying hard material. | **Daily Cap on Coin/Point Battles (`10/day`)**, **Streak Freeze purchasable with Coins**, **Night Wind-Down Alert** at `01:00 IST`, and **Zero building upgrade from easy repeat questions** ($f_{\text{repeat}} = 0$ within 7 days). To level buildings, you *must* solve tough, varied PYQs! |
| **2. Gambling Feel / Loot-Box Anxiety** | Random chests & opaque odds trigger variable-ratio compulsion. | **Zero loot boxes, zero gacha, zero cash-to-coin purchases.** Shop prices are 100% fixed & transparent. Progression rewards are deterministic (inspired by Brawl Stars replacing boxes with Starr Road). |
| **3. Empty Lobbies & Dead Multiplayer** | Indian study traffic concentrates around 8 PM–1 AM; afternoon queues can be sparse. | **Async Clash Raids work 24/7** using real recorded human defense ledgers. **Mon–Thu Clan Leviathan Boss** requires zero opponent clan matching. **40s Live Queue Fallback** offers explicitly labeled **Recorded Ghost Duels** or **Open Tavern Board**—never fake bots. |
| **4. Cheating (Alt Accounts, Question Leaks, Answer Timing Exploits)** | Students boosting Elo via burner accounts or looking up PYQs on Google mid-duel. | **Strict Anti-Boost:** Friends/same-IP/same-device matches capped at `0` public Elo after 2 matches/week; matchmaking never pairs you with the same defender twice in 48h. **Tight Timed Clocks** (45–80s/Q pace in Blitz & Live 1v1 makes external Googling lose on time tiebreak). **Server-only grading** + `started_at` server validation stops client tampering. |
| **5. Toxic Chat & Coaching Spam** | Unmoderated global/clan chat on free student apps rapidly fills with coaching spam and slurs. | **No free-text chat in V1–V2.** Rich **Preset Study Pings + 12 Illustrated Emotes** + sanitized Clan Name/Motto filter. |
| **6. Burnout / Ladder Fear** | Losing 30 Elo at midnight causes students to abandon competitive modes permanently. | **3-Match League Demotion Shield** upon promotion, **0.5x softened Elo penalty when raided offline**, and **12-hour Raid Shields** after 2–3★ defeats. |

---

## 4.18 Phased Roadmap

### Phase 1: V1 — "The Living Citadel" (2 Weeks · 1 Developer + AI Coding Agent)
*Goal: Transform the existing empty Citadel + live Battles backend into a cohesive, tactile, sound-rich single-loop game you never leave.*
- **Infrastructure & Visuals:**
  - Hybrid Canvas 2D + SVG overlay Citadel renderer (all 11 buildings + Town Hall rendered across Levels `0–5` with Sandstone Dusk palette, IST Day/Night shift, `8` strolling scholars, smoke/water shimmer, `Visibility API` pause).
  - Sanctum Entry & Exit Door transitions (`Screen 1` & `Screen 16`).
  - **22 synthesized Web Audio SFX + Raag Yaman/Bhupali Tanpura & Santoor generative music** (muted default + Settings screen).
- **Gameplay & Screens Included:**
  - `Screen 2` (Citadel Home), `Screen 3` (Building Panel with real `Mastery_Score` formula + Topic Stars), `Screen 4` (Training Select: **Daily Scroll**, **Siege Drill**, **Blitz Rush**), `Screen 5` (Combat Question Screen), `Screen 6` (Result + Diagnostic Replay + Save to Mistakes Bank), `Screen 14` (Settings), `Screen 17` (90-sec First-Time Tutorial).
  - Connect existing **Live 1v1, Async Friend Battles, Daily Caravan, Leaderboards (`Screen 11`), & Basic Shop (`Screen 13`)** seamlessly inside the full-screen game shell!

### Phase 2: V2 — "Raids, Clans & Seasons" (Weeks 3–6)
*Goal: Deliver Clash-style async raiding, cooperative Clan identity, and 4-week Season motivation.*
- **Async Raid Loop:** Pre-compiled `defense_ledgers`, `Screen 7` (Target Scout), `Screen 8` (Enemy Base View), 1–3 Star resolution, 12h Raid Shields, Battle Ledger `Screen 15` with **Revenge** button & 6-Q visual replay.
- **Clans 2.0 (`Screen 9` & `Screen 10`):** Sabha Hall shared mini-diorama, Clan Roles, Emotes & Preset Pings, Hint Lantern Donations, **Mon–Thu Past-Paper Leviathan Boss Operation**, and **Fri–Sun Clan Wars (`5v5 / 10v10`)**.
- **Progression Depth:** **Free 24-Milestone Season Track**, **Mastery Seals** currency, **Archive Past-Paper Bosses** (2017–2026), **Mistake Exorcism** mode, **Profile & Trophy Room (`Screen 12`)**, and **Live 1v1 40s Ghost Fallback**.
- **Cosmetics:** 3 Unlockable Island Themes, 10 Placeable Island Decorations, Equippable Titles & Avatar Frames.

### Phase 3: V3 — "Grand Championship & Scale" (Months 3–4+)
*Goal: Deepen social prestige and expand across GATE branches.*
- **Sunday Night "Sankalp Showdown" Weekly Live Tournaments** & **Clan War Leagues** (4-clan weekly brackets).
- **Custom Courtyard Editor:** Drag-and-drop relocation of decorations and monument plaques on the island grid.
- **Multi-Branch Support (GATE DA / ECE / ME):** Dynamically re-skin the 11 buildings & emblems when a student switches GATE paper branch!
- **Optional PixiJS Upgrade:** Only if telemetry shows animated entities exceeding 150 active sprites/particles.

---

## 4.19 Decisions for the Owner (Approval Checklist)

Before sprint kickoff, please confirm or adjust these **9 key product decisions**:

1. **Building Level Source vs. Recency Formula (§4.3):** Confirm adding **anti-repeat damping** ($f_{\text{repeat}} = 0$ within 7 days) and gentle **"Rusty/Needs Refresher"** visual state after 30 idle days (never permanently removing earned building levels), keeping `building_level = f(attempted, accuracy, difficulty, recency)` immune to 1-question farming.
2. **Dual Currency (`Coins` + `Mastery Seals`, §4.8):** Approve introducing **Mastery Seals** (non-farmable, skill-only currency for prestigious Themes & Monument Skins) alongside existing Brass Coins. *(Alternative: Keep Coins only and gate Themes behind Building/Elo milestones directly.)*
3. **No Free-Text Chat in Clans (§4.7):** Approve **Preset Study Pings + 12 Illustrated Emotes** only for V1–V2 to eliminate moderation/spam risk on ₹0 budget. *(Alternative: Enable Clan text chat with profanity filter + report button, accepting moderation overhead.)*
4. **Live Queue 40-Second Honest Fallback (§4.6):** Approve explicitly labeled **Recorded Ghost Duels** (`0.5x` Elo) + **Open Tavern Board** after 40s wait when live matchmaking pool is thin.
5. **Rendering Engine (§4.2):** Approve **Hybrid HTML5 Canvas 2D + SVG Overlay + `motion/react` (`LazyMotion`)** for V1–V2 (`0 kB` extra graphics library, `<3.5 ms` frame budget) over Three.js/PixiJS.
6. **Audio Identity & Default Mute (§4.12):** Approve **synthesized Raag Yaman/Bhupali/Bhairav Web Audio engine** starting **muted by default** on first visit (persisted per device) with a clear sound button on the Sanctum Entry Door.
7. **3-Match League Demotion Buffer (§4.3):** Approve preserving exact `K=24` Elo math while adding a **3-Match Grace Shield** when entering Qualifier/Ranker/Topper/Legend to reduce rank-loss churn.
8. **Target CS Citadel First (§4.2):** Confirm launching the 11 CS+Math+GA buildings first (matching the existing ~3,250 CS-tagged PYQ bank), deferring GATE DA/ECE building skins to V3.
9. **Plus/Pro Separation (§4.8):** Confirm strictly **zero competitive advantages or coin/Elo multipliers** for ₹29/₹99 paid tiers inside Citadel Arena (allowing at most a tiny cosmetic *"Patron Crest"* emblem).

---

## Sources & References

1. **Renyxera Live Product & Existing Feature Set:** Renyxera GATE Prep Web App (`https://gate.renyxera.workers.dev/`) — accessed Nov 2026 [1.1], and prompt specification (§1–§2).
2. **Official GATE Exam Structure & Marking:** IIT GATE CS Official Examination Pattern (65 questions, 100 marks, 3 hours; 10 GA + 55 Subject; 30×1-mark + 35×2-mark; MCQ −1/3 and −2/3 negative marking; MSQ and NAT zero negative marking) [5.4.1, 5.4.2, 5.4.3, 5.4.5, 5.4.9].
3. **Retrieval Practice & Testing Effect:** Roediger, H. L., & Karpicke, J. D. (2006), *Psychological Science* — repeated retrieval practice produced 61% vs. 40% retention after 1 week compared to repeated study [3.1.1, 3.1.2, 3.1.7].
4. **Intrinsic Motivation & Reward Design:** Deci, E. L., Koestner, R., & Ryan, R. M. (1999), *Psychological Bulletin* (meta-analysis of 128 studies) — expected/tangible rewards undermine intrinsic motivation ($d = -0.28$ to $-0.40$), whereas positive informative feedback enhances free-choice behavior ($d = 0.33$) and self-reported interest ($d = 0.31$) [3.2.1, 3.2.3].
5. **Desirable Difficulties:** Bjork, R. A. (1994) & Bjork, E. L., & Bjork, R. A. (2011) — spacing, interleaving, generation, varied conditions, and retrieval practice improve long-term transfer provided learners possess cues to succeed [3.3.3, 3.3.4, 3.3.5, 3.3.7].
6. **Sleep Deprivation & Memory Consolidation:** Meta-analytic findings showing sleep loss impairs working memory and memory consolidation (Hedges' $g = 0.621$ pre-learning, $g = 0.277$ post-learning) [7.4.1, 7.4.7, 7.4.9].
7. **Game Design Benchmarks:**
   - *Clash of Clans* (Supercell): 1–3 star 50%/Town Hall/100% destruction rules, Raid Shields & Village Guard, Battle Log Revenge, Clan Wars (Prep/War Day, 2 attacks, % tiebreaker), Clan War Leagues [2.3.1, 2.3.3, 2.3.4, 2.3.5, 2.3.8, 8.4.1].
   - *Clash Royale* & *Brawl Stars* (Supercell): Trophy Gates / floors preventing demotion, Free Season Pass track & bonus end-of-pass loops, Starr Road replacing random loot boxes (Dec 2022) [6.3.1, 6.3.5, 6.3.8].
   - *Boom Beach* (Supercell): Island archipelago & Task Force cooperative boss Operations [9.3.3, 9.3.6].
   - *Township* (Playrix): Animated citizen activity creating ambient town life [9.2.2].
   - *Lichess*: Puzzle Storm (timed / 3 strikes), Puzzle Racer (live shared sequence, combo streak, 1 skip) [4.4.4, 4.4.6].
   - *Duolingo*: Streak Freeze mechanics reducing churn & "streak creep" critique where streaks risk displacing core learning [4.3.1, 4.3.7, 4.3.8].
8. **Indian Classical Raag & Synthesis Engineering:**
   - Raag Yaman (evening/dusk, Kalyan Thaat, *tivra Ma*, Vadi *Ga*, Samvadi *Ni*), Raag Bhupali (audav evening/early night), Raag Bhairav (dawn) [5.2.1, 5.2.2, 5.2.3].
   - Tanpura 4-string tuning ratios (`Pa – Sa – Sa – Kharaj`: 0.75 / 1.0 / 1.0 / 0.5) & *jeeva* overtone behavior [7.1.1, 7.1.3, 7.1.7].
   - Karplus-Strong plucked-string physical modeling algorithm [5.3.1, 5.3.6].
   - Audio Loudness & Web Audio API: ITU-R BS.1770 / EBU R128 / Sony ASWG-R001 Portable (`-18 LUFS`, `-1 dBTP`) [8.1.1, 8.1.2, 8.1.9]; Web Audio `DynamicsCompressorNode`, `BiquadFilterNode`, `ConvolverNode`, and Autoplay Policies [3.4.3, 3.4.5, 8.3.1, 8.3.2, 8.3.4]; Freesound CC0 vs. CC BY-NC licensing restrictions [7.3.3, 7.3.8].
9. **Web Platform, Bundle, Performance & Accessibility Standards:**
   - Bundle sizes & Web APIs: `three` (~181 kB min+gzip) [4.1.3], `pixi.js` (~126 kB min+gzip) [4.1.5], `motion/react` `LazyMotion` (~5 kB vs ~34–43 kB) + `MotionConfig reducedMotion="user"` [9.1.1, 9.1.7, 9.1.9]; Core Web Vitals (`LCP <= 2.5s`, `INP <= 200ms`, `CLS <= 0.1`) & 60 fps (`16.67 ms`) budget [4.2.6, 7.2.2, 7.2.3, 7.2.6]; `Page Visibility API` & `IntersectionObserver` [8.2.2, 8.2.9]; `navigator.vibrate()` Android support (~77.6% global) vs. no iOS Safari support [3.4.1, 3.4.4, 3.4.8]; WCAG 2.1 AA contrast (`4.5:1` / `3:1`) & SC 2.3.1 (`<=3` flashes/sec) [6.2.1, 6.2.2, 6.2.8]; Google Fonts (`Fraunces`, `Newsreader`, `Plus Jakarta Sans`, `JetBrains Mono`) [6.4.1, 6.4.2, 6.4.6, 6.4.7, 6.4.8].
10. **Free-Tier Infrastructure Quotas:**
    - Supabase Free Plan (`500 MB` DB, `5 GB` egress, `200` concurrent Realtime connections, `2M` Realtime msgs/month, `5` Presence calls/30s, `7-day` inactivity pause) [2.1.1, 2.1.2, 2.1.3, 2.1.4, 2.1.7].
    - Cloudflare Workers Free Plan (`100,000` req/day, `10 ms` CPU/invocation, `128 MB` RAM, free unlimited static assets `<=20,000` files, `3` Cron Triggers) [2.2.1, 2.2.2, 2.2.5, 2.2.9].