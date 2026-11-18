# RENYXERA CITADEL ("Battles") — Competitive Game Design Document

**Product:** RENYXERA (`https://gate.renyxera.workers.dev/`) — Competitive Mode  
**Target Platform:** Mobile-first Installable PWA (`390×844` portrait) & Desktop (`1440×900` landscape)  
**Target Audience:** Indian GATE CS aspirants (ages 20–25, studying solo, heavy late-night mobile usage, cost-sensitive)  
**Infrastructure Budget:** ₹0 (Next.js 16 / React 19, Tailwind v4, `motion/react`, Cloudflare Workers Free, Supabase Free)

---

## 4.1 Vision and Pillars

### Vision
**The Citadel** transforms isolated GATE preparation into a living, sandstone-and-brass fortress island where every stone, defense, and trophy is forged exclusively from solving real GATE problems. Rather than bolting points onto a study dashboard, the player commands an autonomous isometric scholar-citadel: training drills erect and fortify 11 Computer Science subject monuments, recorded subject mastery becomes the living garrison that defends against friends and rivals, and cooperative Clan Archive Sieges unite solo night-owls against real past papers—all without ever leaving the game world or compromising exam rigor.

### Five Design Pillars
1. **Earned Strength Only (Zero Pay-to-Win, Zero Grinding Loops):** Every building level, star, and defense rating comes strictly from unique question coverage, weighted GATE accuracy, and recency—never from coins, subscription tiers (Plus/Pro), or mindless repetition.
2. **Desirable Difficulty Over Frictionless Dopamine:** Gameplay mechanics intentionally embed retrieval practice, spaced intervals, and topic interleaving so winning inside the Citadel measurably improves 180-minute exam readiness.
3. **Warm Tactile Craft, Never Neon Slop:** Sun-baked sandstone, terracotta tiles, antique walnut, and brushed brass replace sterile SaaS dashboards and glow-heavy AI clichés, creating a calm, nocturnal-friendly world.
4. **Honest Competition & Zero Fake Players:** Live queue counts, ghost defenses, and matchmaking brackets are always labeled truthfully. When live players are scarce, the game pivots cleanly to recorded human runs rather than fabricating bots.
5. **Contained World, Respectful Exit:** All training, question solving, mistake repair, scouting, clan wars, and settings occur inside the full-screen Citadel. When daily battle caps or fatigue hit, the game points gracefully back to the Study Exit Door for deep long-form mocks.

### Core Gameplay Loop
```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                         THE CITADEL CORE LOOP                       │
  └─────────────────────────────────────────────────────────────────────┘

   [1. SCOUT & TRAIN]                                [2. BUILD & FORTIFY]
   Run Solo Drills / Rush /                          Unlock 11 Subject Buildings
   Daily Trial / Mistake Repair  ──────────────────▶ (Lv 0→5) + Repair Rust
   inside Citadel                                    from real GATE Mastery
          ▲                                                   │
          │                                                   ▼
   [5. RETURN TOMORROW]                              [3. ATTACK & DEFEND]
   IST Day/Night Cycle +                             Raid Rivals (Async Ghost),
   Daily Trial + Clan Siege +    ◀────────────────── Live 1v1 Duels, Clan
   Recency Rust Alerts                               Archive & War Weekends
          ▲                                                   │
          │                                                   ▼
          └──────────────  [4. EARN & CUSTOMIZE]  ◀───────────┘
                           Elo Trophies, Arena Pts, Coins,
                           Mastery Seals → Island Props,
                           Building Skins, Titles & Frames
```

---

## 4.2 The World: The Citadel

### World Concept & Interactive Architecture
The Citadel is a terraced, sandstone-and-terracotta island citadel rising from a calm **celadon-jade canal moat**, inspired by Indian hill forts (*garhs*), stepwells (*baoris*), and Jantar Mantar masonry astrolabes. **Every object in the world is interactive—not passive wallpaper:**
* **11 Subject Monuments + Central Town Hall (*Sabha Keep*):** Tapping any structure smoothly eases the camera to focus it, plays a tactile bounce and harmonic chime, and opens its Building Panel.
* **East Terrace — Clan Pavilion (*Sabha Mandap*):** Shows live Clan Banner/Crest; tap to open Clan Home & War Room.
* **South Canal Jetty — War Boat & Beacon:** Wooden dhow moored at stone steps; tap to open Attack Target Select or Live Duel Lobby.
* **North Plaza — Brass Merchant Cart:** Canopy wagon displaying today's featured cosmetic; tap to open the Cosmetic Shop.
* **West Archway — Dak Post (Notice Pillar):** Brass lantern + scroll box that glows warm amber when inbox challenges/revenge alerts wait.
* **North-West Gate — The Study Exit Door:** Twin carved walnut-and-brass gates; tapping initiates the Gate-Close outro back to the study app.
* **Interactive Ambient Details:** Tapping stone oil lamps (*diyas*) ignites brief warm sparks; tapping the Observatory's brass armillary ring spins it 360°; tapping patrolling **Scholar Sprites** (tiny cloaked engineers walking along paved stone paths carrying scrolls from high-level buildings toward "rusted" ones) reveals a 1-line status bubble (*"Carrying Paging notes to Kernel Keep"*) and drops **+1 Bonus Coin** (max 3/day, anti-farm capped).

### Rendering Technology Comparison & Recommendation

| Dimension | Option A: Interactive SVG World + Canvas 2D FX *(Recommended)* | Option B: PixiJS v8 (`pixi.js`) | Option C: Three.js + React Three Fiber |
| :--- | :--- | :--- | :--- |
| **Added JS Bundle (gzip)** | **0 KB** engine overhead (native React + SVG + Canvas 2D) | **~225 KB** gzipped full (`~819 KB` min); smaller if custom tree-shaken | **~181–186 KB** (`three`) + **~56 KB** (`@react-three/fiber`) = **~240 KB+** |
| **Mid-Range Android FPS** | **60 fps** steady with CSS `transform` pan/zoom + `< 40` Canvas particles | **60 fps** up to 10,000+ sprites; needs `resolution: Math.min(dpr, 2)` | **35–55 fps** on budget Mali/Adreno GPUs; heavy shader/battery draw |
| **Touch & Accessibility** | Native DOM `<button>`/`<g>` hit targets, screen-reader labels, instant CSS `:active` | Requires invisible DOM overlay or manual coordinate picking | Requires 3D raycasting + separate a11y layer |
| **Art Fit &Crispness** | Razor-sharp vector masonry/brass lines at any zoom on 3x DPR screens | Raster texture atlases blur slightly on deep zoom unless multi-res | Low-poly 3D often looks blocky or sterile without heavy lighting |

**Recommendation:** Use **Option A (Isometric Layered SVG World + Single Overlaid Canvas 2D Particle/Water Layer)** for V1–V2. Revisit PixiJS v8 in V3 only if active simultaneous characters/effects exceed 150 moving nodes.

### Living World Systems & Battery Discipline
* **IST Time-of-Day Cycle (Computed locally from `Asia/Kolkata`):**
  * **Dawn (`05:00–08:00`):** Pale saffron mist, long warm shadows, *Raag Bhairav* ambience.
  * **Day (`08:00–17:00`):** Sun-washed limestone, crisp shadow contrast, gentle wind sway on foliage.
  * **Dusk (`17:00–20:30`):** Terracotta-amber sky, oil lamps ignite sequentially across terraces, *Raag Yaman* ambience.
  * **Night (`20:30–05:00`):** Warm soot-slate sky (`#1D1816`), flickering amber window slits and diyas, drifting golden fireflies, quiet *Raag Bhupali* ambience—specifically tuned so 11 PM Indian night-owls experience low eye strain.
* **Diagnostic Weather (Meaningful Feedback, Not Random Noise):**
  * **Clear & Breezy:** Active streak, all practiced buildings healthy.
  * **Rust Mist / Cracked Masonry Overlay:** Appears *only* over a building whose Recency Factor $R_s < 0.85$ (unpracticed $>17$ days). Tapping the cloud offers 1-tap *Breach Repair*.
  * **Monsoon Drizzle (Optional/Weekend Event):** Gentle diagonal rain lines on the Canvas layer during Weekend Raid events.
* **World Life Animations (Strictly Paused When Hidden):**
  * 2–5 **Walking Scholars** traversing isometric path nodes, **chimney smoke puffs** from *Compiler Works* and *Algorithm Forge*, **water ripple rings** in the moat, **fluttering silk pennants** on Town Hall, **distant birds** gliding every 25–40s, **scaffolding & tiny mason hammers** during a building's level-up celebration.
  * **Visibility Guard:** When `document.hidden === true`, a fullscreen modal/battle is open, or **Low-Power Mode** is enabled, the `requestAnimationFrame` Canvas FX loop cancels completely and SVG CSS keyframe animations switch to `animation-play-state: paused`.

### The 12 Structures: Visual Progression (Levels 0 to 5)

| Building (Subject) | Lv 0 (Ruin) | Lv 1 (Outpost) | Lv 2 (Sandstone Hall) | Lv 3 (Terracotta Bastion) | Lv 4 (Gilded Citadel) | Lv 5 (Grand Monument + Animated Signature) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Town Hall — Sabha Keep** *(Average)* | Cracked plinth + flag pole stump | Mudbrick pavilion, cloth awning | Two-story sandstone gatehouse | Terracotta dome, twin turrets | Four-pillar *chhatri* cupola, brass dial | Crowned Step-Citadel with **rotating giant brass astrolabe** |
| **1. Kernel Keep** *(OS)* | Broken gear stone | Timber sentry post | Square keep + iron gate | Battlements + dual watchtowers | Brass lockwork vault + banner | Vaulted Fortress with **sliding brass semaphore gates** |
| **2. Query Vault** *(DBMS)* | Empty cellar pit | Wooden scroll rack | Stone archive shed | Indexed pillared treasury | Twin-vault sandstone repository | Rotunda Treasury with **glowing scroll-ledger shelves & oil lamp** |
| **3. Signal Tower** *(CN)* | Fallen wooden mast | Bamboo lookout scaffold | Stone signal pillar | Terracotta beacon tower | Brass parabolic mirror turret | Tall Lighthouse Spire with **pulsing amber heliograph beam** |
| **4. Algorithm Forge** *(Algorithms)* | Cold charcoal hearth | Brick bellows shed | Stone smithy + chimney | Twin-furnace terracotta forge | Hammer-clockwork foundry | Grand Foundry with **rising ember wisps & rhythmic piston hammer** |
| **5. Automata Observatory** *(TOC)* | Shattered dial base | Chalk slate pedestal | Octagonal stone room | Copper-ringed dome | Brass gear-driven planetarium | Twin-Dome Observatory with **orbiting brass transition rings** |
| **6. Compiler Works** *(Compiler)* | Scattered type blocks | Timber workshop bench | Layered stone mill | Three-stage terraced kiln | Brass pipework & furnace stack | Stepped Refinery with **3 sequential steam/smoke puffs (Lex→Parse→Emit)** |
| **7. Engine House** *(COA)* | Rusty axle frame | Wooden waterwheel frame | Brick pump house | Terracotta flywheel hall | Twin-cylinder brass engine hall | Monumental Clockwork Hall with **spinning exterior brass flywheel** |
| **8. Logic Gatehouse** *(Digital Logic)* | Twin stone blocks | Wooden toll gate | Arched stone portal | Portcullis gatehouse | Brass-inlaid double arch | Illuminated Tri-Arch Gate with **alternating lantern signal lamps (0/1)** |
| **9. Code Workshop** *(Prog & DS)* | Mossy workbench | Canvas tent & slate | Brick scriptorium | Terracotta guildhall | Multi-wing courtyard studio | Grand Guildhouse with **hanging woven data-tree banners** |
| **10. Maths Library** *(Engg & Discrete Maths)* | Scattered stone tablets | Stone reading bench | Pillar-front library | Stepped sandstone mandapa | Brass sundial courtyard | Grand Stepwell Library with **cascading water channel & astrolabe** |
| **11. Aptitude Grounds** *(General Aptitude)* | Chalk arena circle | Dirt courtyard + posts | Sandpit & stone ring | Terracotta amphitheater | Pillar-colonnade stadium | Marble-Sandstone Arena with **fluttering festival pennants** |

### Placeable Decorations & Island Expansion
* **Placeable Decorations (Socket-based grid around paths/terraces, zero stat boosts):** Banyan Sapling, Stepwell Lotus Pool, Brass Astrolabe, Stone *Yali* Pillar, Oil Diya Post, Sundial Plinth, Victory Obelisk (shows max Elo), Clan Crest Flagstaff, Terracotta Planter, Monsoon Wind Chime.
* **Island Growth by Town Hall Level:**
  * **TH Lv 0–1:** Single central plateau (12 building pads + 4 decoration sockets), crude timber pier.
  * **TH Lv 2:** Southern stone stairs + paved limestone promenade + 8 deco sockets.
  * **TH Lv 3:** Western *stepwell* water terrace + Clan Pavilion wing + 14 deco sockets.
  * **TH Lv 4:** Outer crenellated sandstone parapet wall + corner watch-lanterns + 20 deco sockets.
  * **TH Lv 5:** Three-tier floating-cliff citadel with stone canal bridge, waterfall spillway, and 28 deco sockets.

---

## 4.3 Progression and Anti-Farming Formulas

Learning science demonstrates that effortless repetition produces fluency illusions without durable recall (`Bjork, 1994`), while extrinsic point systems invite speed-running easy tasks. Every progression tier below is mathematically anchored to genuine GATE competence.

### 1. Subject Building Level (0–5)
For each subject $s \in \{1..11\}$, the server computes a **Mastery Power Score $M_s \in [0, 100]$**:

$$M_s = 100 \times \left(0.40 \cdot C_s + 0.40 \cdot A_s + 0.20 \cdot D_s\right) \times R_s$$

* **Topic Coverage ($C_s$):** Let $T_s$ be the number of distinct syllabus topics tagged in subject $s$, and $n_{s,t}$ the count of **unique** questions attempted in topic $t$ (ignoring same-question repeats within 14 days unless fixed via Mistakes Bank):
  $$C_s = \frac{1}{T_s} \sum_{t=1}^{T_s} \min\left(1,\; \frac{n_{s,t}}{12}\right)$$
  *(Anti-farming: solving 200 questions from Topic 1 alone caps $C_s$ at $1/T_s$.)*
* **Bayesian Difficulty-Weighted Accuracy ($A_s$):** Each unique question $q$ uses its **latest** valid attempt (weighted $w_q = 1.0$ for 1-mark, $w_q = 1.5$ for 2-mark), normalized via official GATE marking (`score_norm`: $+1.0$ correct, $0$ skipped, $-0.33$ wrong MCQ, $0$ wrong MSQ/NAT):
  $$A_s = \max\left(0,\; \frac{\sum_{q \in Q_s} w_q \cdot \text{score\_norm}(q)}{\sum_{q \in Q_s} w_q + 65}\right)$$
  *(Anti-farming: the $+65$ Bayesian denominator means 5 lucky answers yield only $\approx 0.09$, requiring sustained accuracy across volume.)*
* **Hard-Question Depth ($D_s$):** Mastery of 2-mark, MSQ, and NAT questions (`correct_hard_s` = count of unique 2-mark, MSQ, or NAT questions answered accurately):
  $$D_s = \min\left(1,\; \frac{\text{correct\_hard}_s}{45}\right)$$
* **Recency Integrity Multiplier ($R_s \in [0.70, 1.00]$):** Grounded in spacing research (`Cepeda et al., 2006`):
  $$R_s = \max\left(0.70,\; 1.00 - 0.015 \times \max(0,\; \text{days\_since\_practice}_s - 7)\right)$$
  * **Crucial Design Rule (Non-Punitive Decay):** Earned Building Levels (`0–5`) are evaluated on **Peak Integrity ($R_s = 1.0$)** so a student never loses a hard-won Level 3 monument because of mid-semester exams. However, when $R_s < 0.85$, the building develops visual **rust/cracks** and defends at $R_s$ strength until **1 Quick Drill or 5-question Breach Repair** restores $R_s \to 1.00$.

**Building Level Thresholds:**
* **Lv 0:** $M_s < 8.0$ | **Lv 1:** $8.0–23.9$ | **Lv 2:** $24.0–42.9$ | **Lv 3:** $43.0–61.9$ | **Lv 4:** $62.0–79.9$ | **Lv 5:** $80.0–100.0$

**Town Hall Level:**
$$\text{Town Hall Level} = \left\lfloor \frac{\sum_{s=1}^{11} \text{Level}_s}{11} \right\rfloor$$
*(UI also displays exact fractional progress bar, e.g., `TH 2 • 7/11 upgrades toward TH 3`.)*

### 2. Player Level & XP
* **XP Formula per Session:** $\text{XP} = \text{round}\left((4 \times \text{correct} + 1 \times \text{attempted}) \times \text{mode\_mult} \times \text{fatigue\_mult}\right)$.
  * `mode_mult`: Solo Topic Siege = `1.0`, Daily Trial = `1.5`, Ranked Attack / Live Duel = `1.4`, Blitz Rush = `0.9`, Archive Boss Win = `1.8`.
  * `fatigue_mult` (anti-farming): `1.0` for sessions 1–10/day, `0.5` for 11–15/day, `0.1` beyond 15/day.
* **Level Curve:** $\text{XP\_to\_next}(L) = 100 + 35 \cdot (L - 1)$. Player Level unlocks cosmetic frames, island theme options, and profile titles—**never** gameplay power.

### 3. Topic Mastery Stars (Per Sub-Topic inside each Building)
* **1★ Apprentice:** $\ge 6$ unique questions solved, $\ge 50\%$ net accuracy.
* **2★ Practitioner:** $\ge 12$ unique questions solved, $\ge 68\%$ accuracy, includes $\ge 3$ MSQ/NAT.
* **3★ Grand Master:** $\ge 20$ unique questions solved, $\ge 82\%$ accuracy, plus $\ge 1$ zero-blunder Topic Siege run.

### 4. Trophies, Leagues & 4-Week Seasons
* **Rating Engine Options:**
  * *Option A (Current Live Elo, K=24, Start=1000):* Simple, transparent, already live in production (`+12` for equal win, up to `+24` upset).
  * *Option B (Glicko-2 — used by Lichess):* Adds Rating Deviation (RD) and volatility so inactive players calibrate quickly, but harder for students to mentally predict.
  * **Recommendation:** Keep **live Elo (Start 1000)** for database compatibility, adding **Provisional $K=36$ for first 10 matches** (fast placement) and **3★ Victory Bonus (+3 trophies)** on Ranked Async Raids.
* **Five Leagues & Sub-Tiers:**
  1. **Aspirant** (`0–949`: III `<850`, II `850–899`, I `900–949`)
  2. **Qualifier** (`950–1149`: III `950–999`, II `1000–1074` *[Start]*, I `1075–1149`)
  3. **Ranker** (`1150–1399`: III `1150–1224`, II `1225–1299`, I `1300–1399`)
  4. **Topper** (`1400–1699`: III `1400–1499`, II `1500–1599`, I `1600–1699`)
  5. **Legend** (`1700+`)
* **4-Week Season & Free Season Track (*Scholar's Folio*):**
  * Matches existing 4-week seasons (Top-10 badges live). At season end, players $\ge 1200$ Elo soft-reset 35% of the gap back toward `1150`: $\text{Elo}_{\text{new}} = 1150 + 0.65(\text{Elo}_{\text{old}} - 1150)$ *(never dropping below 1150)*.
  * **Free Season Track (20 Tiers, 100% Free for All Plans):** Fueled by **Arena Points** (existing: Win `30`, Draw `15`, Finish `8`, max `10` battle credits/day) + Solo Daily Trial (`+25` pts/day). Tier 5 = +40 Coins, Tier 10 = Seasonal Banner Crest, Tier 15 = **1 Mastery Seal + Seasonal Stone Trim**, Tier 20 = **3 Mastery Seals + Exclusive Season Title**.

### 5. Achievements & Titles
Examples (15 total at V1–V2, unlocking Titles + 10–30 Coins):
* **Precision & Learning:** *Zero-Penalty Precision* (Win 10-question Siege/Duel with 0 negative marks → Title: *"The Exact"*), *Mistake Alchemist* (Repair 50 past mistakes at $\ge 80\%$ accuracy → Title: *"Alchemist"*), *NAT Sniper* (Solve 25 NATs correctly without hints → Title: *"Calculator"*).
* **Mastery & Consistency:** *Architect* (Reach TH Lv 3 → *"Architect"*), *Polymath* (All 11 buildings $\ge$ Lv 2 → *"Polymath"*), *Night Watchman* (Complete 7 sessions between `21:00–03:00 IST` → *"Night Owl"*).
* **Combat & Clan:** *Giant Slayer* (Beat opponent $+150$ Elo higher → *"Giant Slayer"*), *Iron Bastion* (Defend base 5 times with 0★ loss → *"The Unbreached"*), *Archive Conqueror* (Participate in 3 Clan Archive Boss clears → *"Titanbane"*).

### 6. 30-Day Progression Simulation (Calculated Directly from Formulas)

| Profile | Play Pattern (30 Days) | Unique Qs & Spread | Accuracy & Hard Qs | End-of-Month Building & TH State | Rating & League |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Casual Student** | 20 min/day, 4 days/wk (`17` active days). ~12 Q/day (`~204` Q total). Mostly Solo Drills + Daily Trials + ~18 battles. | `~40 Q` in 5 favorite subjects (`C_s ≈ 0.42`); `10 Q` in 1 subject; `0` in 5 subjects. | `62%` net score; `~8` hard Qs/subject (`D_s ≈ 0.18`); `R_s = 0.95`. | **5× Lv 2** ($M_s \approx 30.1$), **1× Lv 1** ($M_s \approx 10.5$), **5× Lv 0**. Sum `= 11`. **Town Hall Level 1** (exact avg `1.0`). | `~1055 Elo` (**Qualifier II**), 6–8 Topic 1★, ~1,120 Coins earned. |
| **Serious Student** | 50 min/day, 6 days/wk (`26` active days). ~30 Q/day (`~780` Q total). Mix of Topic Sieges, Rush, Archive Boss, ~55 battles. | `~71 Q` across all 11 subjects (`C_s ≈ 0.74`). | `76%` net score; `~18` hard Qs/subject (`D_s ≈ 0.40`); `R_s = 1.00`. | **7× Lv 3** ($M_s \approx 55.0$), **4× Lv 2** ($M_s \approx 39–42$). Sum `= 29`. **Town Hall Level 2** (`2.64`, 64% to TH 3). | `~1265 Elo` (**Ranker II**), 18+ Topic Stars (1★–2★), ~2,950 Coins + 4 Mastery Seals. |

---

## 4.4 Solo Training Modes (100% Inside the Citadel)

All solo modes use official GATE marking (`+1/+2` right, `−1/3 / −2/3` wrong MCQ, `0` wrong MSQ/NAT, `0` skipped) graded server-side, never redirecting to the study app.

| Mode | Format & Rules | Learning Science Basis | Scoring & Rewards | Building Upgrade Impact |
| :--- | :--- | :--- | :--- | :--- |
| **1. Blitz Rush** *(Lightning Trial)* | **5:00 timer, 3 Strikes.** Interleaved rapid-fire 1-mark & concise 2-mark PYQs across unlocked subjects. Wrong answer = `-1 Strike`. Up to **2 Free Skips**; 3rd skip = `-1 Strike`. Streak of 4 right adds **+10s** (`Lichess Puzzle Storm`). | **Interleaved Retrieval** (`Kornell & Bjork, 2008`) forces fast topic discrimination. | Real GATE score + Streak bonus (for Rush personal best only). **+8 to +15 Coins** (first 3 runs/day), XP. | Refreshes **Recency $R_s$** on touched subjects; updates $A_s, C_s$ for each unique question solved. |
| **2. Topic Siege** *(Focused Drill)* | Pick any Subject Building → pick 1 syllabus topic → **10 questions** (MCQ + MSQ + NAT). **Untimed** (shows soft `2:30/q` GATE pace badge). Full solution explanation shown inline per question after submit. | **Mastery & Immediate Explanatory Feedback** (`Roediger & Karpicke, 2006`). | Strict GATE marks out of `15–17`. **+10 Coins** ($\ge 50\%$ marks), **+15 Coins** ($\ge 75\%$). | Primary driver of **Topic Coverage ($C_s$)**, **Topic Mastery Stars (1★–3★)**, and Building upgrades. |
| **3. Archive Boss** *(Past Paper Gauntlet)* | Challenge an actual **15-question historical GATE subject/year block** (e.g., *GATE 2024 Algorithms + OS*). **40-minute timer**. "Boss HP" = total paper marks; must score $\ge 55\%$ marks to defeat Boss. | **Transfer-Appropriate Processing** in authentic exam phrasing and difficulty (`Bjork, 1994`). | Strict GATE marks. **+25 Coins + 1 Mastery Seal** on first clear of that paper block + Boss Stamp. | Major boost to **Hard-Question Depth ($D_s$)** and Building Lv 3→5 push. |
| **4. Surya Daily Trial** *(Global Daily Seed)* | **Same 10 questions globally** every day (`00:00 IST` reset): 2 Aptitude, 2 Math, 6 Core CS. **15-minute timer, 1 attempt/day.** Ranked on Daily Friends & Everyone board (Score → Accuracy → Time). | **Distributed Daily Habit** (`Cepeda et al., 2006`). | Strict GATE marks. **+25 Coins**, counts toward 7-day Streak & Season Track (+25 pts). | Updates $C_s, A_s$ across multiple buildings simultaneously. |
| **5. Breach Repair** *(Mistake Alchemist)* | Unlocked automatically on any "Rusted" building or after a battle loss. Serves **5 questions drawn from your live Mistakes Bank** in that subject (spaced $\ge 24$h after initial miss). Pass = $\ge 4/5$ right. | **Spaced Mistake Correction** (`Cepeda et al., 2006`). | Score recorded; **+8 Coins** per repaired building (max 2/day). | Immediately restores **Recency $R_s \to 1.00$** (clears rust visuals) and recovers lost accuracy in $A_s$. |

---

## 4.5 Attack and Defend (Async Clash-Style)

### Matchmaking, Scouting & Target Choice
1. Tapping **Raid (Async Attack)** from the War Boat searches real players within **$\pm 150$ Elo** and **$\pm 1$ Town Hall level** (widening to $\pm 300$ Elo if needed, never fabricating opponents). You can also pick any **Friend** (Friendly/Unranked or Rival Challenge) or hit **Revenge** from your Inbox.
2. **Scouting Enemy Base:** You view the defender's real isometric Citadel, seeing all 11 Building Levels (`0–5`), any active "Rust" indicators, and **which 3 buildings are eligible for attack** (or pick **Single-Building Siege: 8 questions** from 1 subject vs **Grand Raid: 9 questions across 3 subjects**).

### How Defense Works (100% Real Performance, Zero AI Bots)
* **Defense Blueprints (Ghost Replay):** Whenever a player completes a Ranked Defense Calibration or Training/Battle set of 8 questions in a subject, the server archives a **Defense Blueprint** (`question_ids`, `defender_answers`, `defender_time_per_q`, `defender_marks`, `building_level_at_record`).
* When you attack @arjun's *Query Vault (Lv 3)*, you answer **that exact 8-question set** (or matched-difficulty recorded set if you already saw those IDs recently—see Anti-Cheat). Your opponent's progress bar replays their **actual per-question timestamps and score**.
* **Honest Unfortified Fallback:** If the defender has **not** recorded a Defense Blueprint for that building (e.g., Lv 0–1 newcomers), the scouting screen explicitly states: **"Unfortified Garrison (No Defender Replay — Benchmark Par: 50% GATE Marks)"**. The attacker still practices and earns coins/1–3★ vs Par, while the defender loses **0 Elo** on uncalibrated buildings.

### Victory Stars (1★ – 3★), Trophies & Fairness
Modeled on *Clash of Clans'* dual destruction/Town Hall star clarity:
* **Defeat (0★):** Attacker fails to beat defender's score AND scores $< 50\%$ max marks. *Defense Held!* Defender earns `+Elo` & `+10 Defense Coins`.
* **1★ (Breach):** Attacker scores $\ge 50\%$ of max marks **OR** beats defender's recorded GATE score (by $< 1.5$ marks if $< 50\%$). Attacker wins **50% of Elo win delta** (or `Draw` if below 50% and tied).
* **2★ (Conquest):** Attacker beats defender's recorded GATE score **AND** scores $\ge 65\%$ of max marks. Attacker wins **100% Elo win delta** + full Arena Points (`30`).
* **3★ (Total Mastery):** Attacker beats defender's score **AND** scores $\ge 85\%$ of max marks **AND** commits **0 wrong MCQs** (zero negative-marking blunders). Attacker wins **100% Elo win delta + `+3` Bonus Trophies + `1 Mastery Seal`**.

**Fairness Across Different Building Levels:**
* Questions are drawn from the **mid-difficulty band between attacker and defender's subject levels** (never giving an L5 player L1 softball questions).
* Elo (`K=24`) automatically protects lower-rated players: an Elo 1350 Ranker beating an Elo 1020 Qualifier gains only `+3` Elo (and loses `-21` on a 0★ fail!).
* **Replays & Summaries:** Post-attack shows side-by-side Q1–Q8 timeline (`Your answer vs Defender's recorded answer`, time deltas, marks breakdown) + 1-tap **"Repair My Misses"** inside the Citadel.
* **Revenge:** Incoming 1★–3★ attacks create a 48-hour **Revenge** button (1 attempt, bypasses matchmaking randomness, still respects Defender Shield!).
* **Shields & Scholar's Guard** (adapted from *Clash of Clans*):
  * Taking a **2★ attack grants a 12-hour Shield**; taking a **3★ attack grants a 16-hour Shield** (prevents overnight pile-ons while studying/sleeping).
  * Launching a Ranked Async Attack while shielded **deducts 4 hours** from your Shield.
  * When Shield expires, a **1-hour Scholar's Guard** activates automatically (attack freely without losing protection). Shields never block Solo Training, Live Duels, or Clan Wars.

---

## 4.6 Live Duels and Events (with Honest Fallbacks)

### Real-Time Modes (Built on Live Backend Infrastructure)
1. **Live 1v1 Sprint Duel:** Both ready up → shared 6-second server countdown → **7 questions (10:00 total)**. Uses Supabase Realtime Broadcast to show **neutral progress pips** (*"Opponent locked Q3 in 41s"*)—never revealing right/wrong mid-duel to stop early rage-quits.
2. **Friend Challenges & Scheduled Duels:** Challenge any online/offline friend by username or shareable invite code (`/battles?invite=XYZ`) for live or 7-day async play, plus one-tap **Rematch**.
3. **Weekend Arena Hour (Sat & Sun, `20:00–21:00 IST`):** 60-minute open lobby (inspired by *Lichess Arena*). Play rapid 5-question micro-duels; continuous pairing against whoever is free in the pool, ranked by cumulative Arena Points during that 60-minute window.

### Honest Low-Population Fallbacks (Zero Fake Players)
* **Live Queue Counter:** Matchmaking screen always displays the true live state: *"Searching Qualifier–Ranker (`±150 Elo`) • 3 players currently in queue"* or *"0 players currently in queue"*.
* **Graceful Escalation Timeline:**
  * `0–15s`: Strict bracket (`±150 Elo`).
  * `15–25s`: Prompt widens to `±300 Elo` (*"Widening bracket..."*).
  * **At `25s` if unmatched:** **Never auto-insert a bot.** Present two honest instant buttons:
    1. **[Battle Recorded Rival Now (Async)]** — Loads a real matched player's Defense Blueprint clearly labeled `ASYNC • RECORDED RUN OF @sneha_gate`.
    2. **[Keep Lobby Open & Run Solo Drill]** — Leaves your live invite pinned on the Citadel Duel Board for 10 minutes while you play a Topic Siege; a subtle brass bell toast rings if someone accepts.
* **Small Tournament Fallback:** If a Weekend Arena bracket has $< 6$ players at `T−5 min`, automatically merge brackets with a clear notice (*"Combined Arena Pool: 9 Challengers"*) or convert to a **Global Fixed-Set Time Trial** if $< 2$ players join.

---

## 4.7 Clans (Extended from Live Clubs: Up to 30 Members)

### Structure & Moderation-Free Social Feed
* **Roles:** **Acharya** (Leader, 1), **Senapati** (Co-Leader, up to 3 — launch wars, promote Elders), **Dhwaja** (Elder, up to 6 — accept members, trigger Daily Trial nudge), **Sadhak** (Member).
* **Zero-Moderation Communication:** No free-text chat box (eliminates toxicity, spam, exam leaks, and moderation burden at ₹0). Instead, Clan Home features:
  1. **Chronicle Feed:** Automatic cards (*"Karan 3★ @dev's Signal Tower"*, *"Ananya reached Algo Forge Lv 4"*).
  2. **Structured Study Signals (1-tap presets):** *"Open for Live Duel!"*, *"Need 2 more attacks on Archive DBMS!"*, *"Good luck tonight, scholars"*.
  3. **5 Custom Brass Emotes:** Applause (*Tali*), Warm Lamp (*Diya*), Salute (*Namaste*), Wise Owl, Bullseye.

### Clan Citadel & Two Weekly Clan Wars
Combining *Clash Royale* Clan Wars week cadence and *Clash of Clans* Raid Weekend persistent damage—validated by Sailer & Homner's finding that **combining competition with collaboration** maximizes behavioral engagement (`Sailer & Homner, 2020`):
1. **Clan vs Past-Paper Titan (*Archive Siege*, Tue `06:00` – Thu `22:00 IST`):**
   * Cooperative PvE! A full **65-question, 100-mark official GATE paper** is split into 11 Subject Bastions on a Clan War Map.
   * Each member gets **3 Siege Attacks** over 56 hours, choosing any unsolved Bastion. Marks earned chip away at the Bastion's remaining HP across all clanmates until all 100 marks fall! Clearing the Titan upgrades the shared **Clan Monument** on every member's island.
2. **Clan vs Clan (*Weekend Citadel Raid*, Fri `18:00` – Sun `22:00 IST`):**
   * Two clans matched by active member count and average Town Hall level.
   * Each member gets **2 War Attacks** against enemy members' Subject Buildings (max 3★ stored per enemy building; higher stars overwrite lower). Winner decided by **Total War Stars → Avg GATE Accuracy %**.

### Non-Paid Donations & Clan Perks (Zero Power Creep)
* **Allowed Donations:**
  * **Focus Lantern (Solo-Only Hint):** Donate `10 Coins` once every 8h to grant a clanmate `1 Focus Lantern` usable **strictly in Solo Topic Siege or Archive Boss** (eliminates 1 wrong MCQ distractor or highlights the sub-topic formula tag—**disabled in all PvP/Ranked/Daily Trial modes**).
  * **Sparring Challenge:** Share a 5-question mistake set you conquered so clanmates can try it for `+10 XP`.
* **Clan Leagues & Perks:** Bronze Folio → Silver Seal → Gold Astrolabe → Obsidian Mandala → Imperial Sabha. Higher leagues award **+5% to +20% Solo Coin Bonus**, custom **Island Flag Emblems**, and **Clan Crest Frames**—never extra marks or timers.

---

## 4.8 Economy

### Currency Design: Two-Currency Comparison
* **Option A (Coins Only):** Already live. Easy to grasp, but late-game coins pile up from logins/losses, letting low-accuracy grinders buy prestige items.
* **Option B (Coins + Mastery Seals — *Recommended*):** Keep **Brass Coins** for everyday rewards and standard items, and introduce **1 non-purchasable prestige currency: Mastery Seals** earned *only* by demonstrated skill (3★ attacks, Topic 3★, Archive Boss victories, Season Tiers 15 & 20). Mastery Seals guarantee top Citadel skins signify real GATE readiness.

### Sources, Sinks & Caps

| Currency | Sources | Daily / Weekly Caps | Sinks (100% Non-Power / Cosmetics + Study Boost) |
| :--- | :--- | :--- | :--- |
| **Brass Coins** | • Daily Login: `10` (Day-7 streak: `60`) *(live)*<br>• Battles: Win `20`, Draw `10`, Loss `5` *(live)*<br>• Solo Training: `8–15` / clear; Boss: `25`<br>• Daily Trial: `25`; Mistake Repair: `8`<br>• Scholar Island Tap: `1` (max 3/day) | • Max **10** point/coin-earning battles/day *(live)*<br>• Solo Training coin cap: **60/day**<br>• Repair coin cap: **16/day**<br>• **Realistic Max Daily:** `~220–260 Coins` | • **Mentor Token Boosts & Avatar Frames** *(live)*<br>• **Building Architectural Skins** (`350–900` Coins)<br>• **Island Themes** (`800–1,400` Coins)<br>• **Decorations** (`80–300` Coins)<br>• **Emotes & Victory VFX** (`200–500` Coins)<br>• **Solo Focus Lantern Donation** (`10` Coins/8h) |
| **Mastery Seals** | • First-time 3★ Topic Mastery: `1 Seal`<br>• 3★ Ranked Async Attack: `1 Seal` (max 3/wk)<br>• Archive Boss First Clear: `1 Seal`<br>• Season Track Tier 15 (`1`) & Tier 20 (`3`) | • Max **~6–8 Seals/week** for active top performers (cannot be bought or farmed via losses) | • **Prestige Citadel Sets** (e.g., *Chola Granite*, *Jaisalmer Gilt*: `8–15 Seals`)<br>• **Animated Victory Stamps** (`5 Seals`)<br>• **Grand Titles & Monument Plaques** (`4–10 Seals`) |

### Anti-Farming & 30-Day Balance Table
* **Anti-Farming Guards:** Abandoning a battle (`< 50%` questions answered) pays **0 Coins, 0 XP**. Repeating the same Topic Siege immediately pays `0` coins on the 2nd run unless accuracy improves by $\ge 15\%$.
* **30-Day Economy Projection:**
  * **Casual Student (`17` active days):** Earns ~`1,120 Coins` + `1–2 Mastery Seals` → buys 1 Island Theme or 1 Building Skin + 2 Decorations + 1 Avatar Frame, finishing Month 1 with ~`150 Coins` buffer.
  * **Serious Student (`26` active days):** Earns ~`2,950 Coins` + `8–12 Mastery Seals` → buys 2 Building Skins, 1 Island Theme, 4 Decorations, 1 Victory VFX, plus 1 Prestige Seal Set by Day 30.

---

## 4.9 Screens: Purpose, Layouts, States & Wireframes

*Ergonomic Baseline:* Every Phone (`390×844`) screen places primary interactive actions inside the lower 45% thumb zone with $\ge 48\text{×}48\text{px}$ tap targets (`Material Design 3`) and $\ge 8\text{px}$ spacing. Every Desktop (`1440×900`) screen eliminates dead whitespace using purposeful split panes and side inspectors.

---

### Screen 1: Entry Transition (`GATE Doors Open`)
* **Purpose:** Psychological threshold separating study dashboard from the competitive Citadel; initializes Web Audio context cleanly on first gesture if unmuted.
* **Phone (`390×844`):** Fullscreen twin carved sandstone/brass doors swing outward (`650ms`) revealing blurred-to-sharp Citadel island + floating Crest badge.
* **Desktop (`1440×900`):** Wide monumental archway sliding open laterally (`650ms`) with subtle parallax camera push-in onto Town Hall.
* **States:** *Loading* (slow 3G asset prefetch spinner inside brass keyhole); *Reduced Motion* (`200ms` crossfade instead of sliding doors).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +--------------------------------------------------------------------+
|                                  |      |                                                                    |
|        /=====|    |=====\        |      |            /===================|    |===================\            |
|       |  [o] |    | [o]  |       |      |           |       RENYXERA     |    |    CITADEL        |           |
|       |      | << | >>   |       |      |           |         [ ۞ ]      | << | >>   [ ۞ ]        |           |
|       |      |    |      |       |      |           |     "Enter Arena"  |    |   Qualifier II    |           |
|        \=====|    |=====/        |      |            \===================|    |===================/            |
|         Entering Citadel...      |      |                        Preparing Island State...                   |
+----------------------------------+      +--------------------------------------------------------------------+
```

---

### Screen 2: Citadel Home (`/battles`)
* **Purpose:** Living isometric home base, ambient navigation hub, instant access to every mode without leaving the game.
* **Phone (`390×844`):** Full-bleed pannable/pinchable isometric island (`75%` height). Compact top pill bar (`TH Lv`, `Elo + League`, `Coins`, `Mute/Settings`). Right edge vertical icon rail (`Inbox`, `Shop`, `Profile`). Bottom thumb dock: `[TRAIN]` `[⚔ ATTACK]` `[CLAN]` + subtle top-left `[EXIT DOOR]`.
* **Desktop (`1440×900`):** Centered/left-weighted interactive Citadel (`72%` width) + persistent right **Commander's Ledger Rail (`360px`)** showing quick Daily Trial status, Active Shield/Guard timer, 3 Weakest/Rusted Buildings shortcut, and Friend/Clan quick duel list.
* **States:** *Loading* (stone-etched island skeleton); *Empty* (new player sees Level 0 ruins + pulsing arrow on *Code Workshop*); *Error* (offline banner: *"Cached View — Reconnect for PvP"*); *Locked* (War Boat locked until 1st Solo Drill completed).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +---------------------------------------------------+----------------+
| [Exit] TH2 | 1055 | 240c | [♪][⚙]|      | [Exit] RENYXERA CITADEL    TH2 | Ranker | 240c | 2۞ | DAILY TRIAL    |
+----------------------------------+      +---------------------------------------------------+ [10 Qs • Play] |
|                        [Inbox(2)]|      |                                                   |----------------|
|        /\    [Sabha Keep]  [Shop]|      |            (Clouds / Swallows / IST Dusk)         | ACTIVE SHIELD  |
|   [OS]    [Algo]  [DBMS]   [Prof]|      |       [Logic]        [Town Hall]      [Compiler]  | 11h 42m left   |
|     (Walking Scholar)  [CN]      |      |          \     [OS]     (Astrolabe)   /           |----------------|
|    [Maths]!   [Compiler]         |      |    [Aptitude] ── [Algo] ── [DBMS] ── [CN]         | RUSTED (FIX!)  |
|  (! = Rusted Building / Repair)  |      |          /    [Code]    [Maths!]     \            | • Maths (18d)  |
|          ~~ [War Boat] ~~        |      |       ~~~~~~~~~~~~~~~~ [War Boat] ~~~~~~~~~~~~~~~ |   [Repair 5Q]  |
+----------------------------------+      +---------------------------------------------------+----------------|
|  [TRAIN]   [ ⚔ ATTACK ]  [CLAN]  |      | [TRAIN]  [ ⚔ ATTACK ]  [CLAN]  [SHOP]  [LEAGUES]  | ONLINE FRIENDS |
+----------------------------------+      +---------------------------------------------------+ @priya [Duel]  |
```

---

### Screen 3: Building Panel (Modal Drawer / Side Inspector)
* **Purpose:** Inspect real mastery metrics for a subject, track Topic Stars, repair decay, or launch targeted drills without leaving the island.
* **Phone (`390×844`):** Bottom sheet (`75%` height, swipe-down dismiss) revealing zoomed building thumbnail above. Large `[TRAIN TOPIC]` and `[REPAIR RUST]` (if needed) buttons at bottom.
* **Desktop (`1440×900`):** Island zooms smoothly to center the building on the left; `460px` brass-framed panel slides in from right.
* **States:** *Loading* (topic skeleton bars); *Empty* (Lv 0 ruin shows `"0/10 Qs to construct Lv 1"`); *Error* (retry fetch); *Locked* (Lv 5 shows *"Grand Master Achieved — Keep Recency ≥85%"*).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +-------------------------------+------------------------------------+
|       (Zoomed Kernel Keep)       |      |                               | [X] KERNEL KEEP (OS)      [Lv 3]   |
+==================================+      |                               | Mastery: 54.2 / 100   Recency: 92% |
| KERNEL KEEP (OS)          [Lv 3] |      |     (Camera Centered on       | Coverage: 68%  Weighted Acc: 74%   |
| Mastery: 54.2/100   Next: 62.0   |      |      Kernel Keep Lv 3,        |------------------------------------|
| [|||||||||||||.....]  Recency 92%|      |      Surrounding Buildings    | TOPIC MASTERY:                     |
|----------------------------------|      |      Softly Dimmed)           | • Processes & Threads   ★★★ (24 Q) |
| TOPICS:                          |      |                               | • CPU Scheduling        ★★☆ (14 Q) |
| • Processes & Threads  ★★★ (24Q) |      |                               | • Deadlocks             ★☆☆ (7 Q)  |
| • Virtual Memory       ★★☆ (14Q) |      |                               | • Virtual Memory        ☆☆☆ (2 Q)  |
| • Deadlocks            ★☆☆ ( 7Q) |      |                               |------------------------------------|
|----------------------------------|      |                               | DEFENSE BLUEPRINT: 6.5/8 pts       |
| [DEFENSE TEST]  [ TRAIN TOPIC ]  |      |                               | [REPAIR MISTAKES] [ TRAIN TOPIC ]  |
+----------------------------------+      +-------------------------------+------------------------------------+
```

---

### Screen 4: Training Select
* **Purpose:** Choose from the 5 solo training formats inside the Citadel with clear rewards and time expectations.
* **Phone (`390×844`):** Vertically stacked tactile stone-and-brass mode cards (`100%` width), Daily Trial pinned at top with countdown to `00:00 IST`.
* **Desktop (`1440×900`):** 2×2 + Full-width Hero Banner grid (Daily Trial top banner; Rush, Topic Siege, Archive Boss, Breach Repair in 2×2 below) + left filter rail for Subject/Topic when Siege is selected.
* **States:** *Loading* (mode cards shimmer); *Empty* (Breach Repair shows *"Zero Pending Mistakes — Garrison Spotless!"*); *Locked* (Archive Boss unlocks at TH Lv 1 or 25 solved Qs); *Error* (network banner).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +--------------------------------------------------------------------+
| [<] TRAINING GROUNDS    60c cap  |      | [<] TRAINING GROUNDS              Daily Solo Cap: 18 / 60 Coins      |
+----------------------------------+      +--------------------------------------------------------------------+
| * SURYA DAILY TRIAL   [15m|10 Q] |      | * SURYA DAILY TRIAL • Same 10 Qs Globally • Resets in 06h 14m [PLAY] |
|   Same 10 Qs globally • +25c     |      +---------------------------------+----------------------------------+
|   [ PLAY DAILY TRIAL ]           |      | 1. BLITZ RUSH (5m • 3 Strikes)  | 2. TOPIC SIEGE (10 Q • Untimed)  |
+----------------------------------+      |    Interleaved speed retrieval   |    Target 1 building & topic     |
| 1. BLITZ RUSH       [5m | 3 ❤]  |      |    Best: 19 Qs   [ START RUSH ] |    [ SELECT SUBJECT & TOPIC ]    |
| 2. TOPIC SIEGE      [10 Q|Pick]  |      +---------------------------------+----------------------------------+
| 3. ARCHIVE BOSS     [15 Q|40m ]  |      | 3. ARCHIVE BOSS (15 Q • 40m)    | 4. BREACH REPAIR (5 Mistakes)    |
| 4. BREACH REPAIR    [5 Mistakes] |      |    GATE 2024 Set-1 • +1 Seal    |    2 Rusted Buildings need fix   |
+----------------------------------+      +---------------------------------+----------------------------------+
```

---

### Screen 5: The Question Battle Screen
* **Purpose:** High-clarity GATE solving surface that preserves exam rigor (authentic MCQ/MSQ/NAT + virtual calculator toggle) while delivering unmistakable **game tension**.
* **How It Differs from the Study Exam Screen:**
  1. **Tactical HUD Header (Not Institutional Blue Bar):** Warm walnut/slate header with **Combo Flame/Seal Meter (`x1`→`x4`)**, **Strikes (`♦ ♦ ♦` in Rush)**, **Live/Ghost Opponent Tug-of-War Bar** showing opponent's neutral lock-in speed (`Q4 • 01:42`), and **Countdown Ring**.
  2. **Power & Impact Feedback:** Selecting & locking an answer triggers a subtle brass lock click + instant visual confirmation in Training/Rush (`+2.0` emerald-moss seal stamp vs `−0.67` vermilion crack shake) or neutral *"Locked In"* seal in Timed PvP until round end (or instant in Sprint Duel depending on mode).
  3. **Ergonomic Action Footer:** Single thumb-reachable `[LOCK ANSWER]` / `[SKIP]` bar; NAT custom numeric keypad slides cleanly over bottom half on mobile so OS keyboard doesn't crush the stem!
* **Phone (`390×844`):** Top HUD (`56px`) → Scrollable Question Stem & Code/Diagram (`45%`) → Large `52px`-tall MCQ/MSQ cards or slide-up NAT pad → Fixed bottom `[SKIP] [LOCK ANSWER]` (`64px`).
* **Desktop (`1440×900`):** Top HUD (`60px`) → 2-column split: Left (`55%`) Question Stem + Code/Diagram + Calculator drawer; Right (`45%`) Option Cards / NAT Pad + Opponent Progress & Question Navigator Pips (`Q1–Q8`).
* **States:** *Loading* (server-signed question payload spinner); *Locked* (answer locked during 6s duel countdown); *Error* (network drop saves answer timestamps locally & shows `Reconnecting...`).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +--------------------------------------------------------------------+
| 06:42  Q3/8 [+2m MCQ]   Combo x2 |      | ⚔ LIVE DUEL vs @vikram | 06:42 | Q3/8 [+2 Marks MCQ] | Combo x2 | [⚙]  |
| You [■■■.....] vs @vikram [■■..] |      | You: [●][●][▶][ ][ ][ ][ ][ ]   @vikram: [●][●][●][▶][ ][ ][ ][ ]    |
+----------------------------------+      +----------------------------------+---------------------------------+
| Consider a 4-stage pipeline with |      | QUESTION 3 (GATE CS 2022)        | SELECT ONE OPTION (-2/3 wrong): |
| stage delays 2, 4, 3, 5 ns and   |      | Consider a 4-stage pipeline with |  [A] 200 MHz                    |
| latch delay 1 ns. Max freq is?   |      | stage delays 2, 4, 3, 5 ns and   |  [B] 166.7 MHz   (Selected)     |
|                                  |      | latch delay 1 ns. What is the    |  [C] 142.8 MHz                  |
| [A] 200 MHz                      |      | maximum clock frequency?         |  [D] 125 MHz                    |
| [B] 166.7 MHz      [Selected]    |      |                                  |---------------------------------|
| [C] 142.8 MHz                    |      | [Calculator]  [Rough Pad]        | Pace: 00:48  | Par: 01:30       |
| [D] 125 MHz                      |      |                                  |                                 |
+----------------------------------+      +----------------------------------+---------------------------------+
|   [ SKIP ]     [ LOCK ANSWER ]   |      | [ < PREV ]  [ CLEAR ]            |          [ SKIP ]  [ LOCK ANSWER ]|
+----------------------------------+      +----------------------------------+---------------------------------+
```

---

### Screen 6: Result and Rewards
* **Purpose:** Celebrate mastery, visualize Building/Elo impact, audit every question mistake inline, and funnel weak topics directly into Breach Repair inside the Citadel.
* **Phone (`390×844`):** Sequential Star Stamp reveal (`★ ★ ☆`) → Score & Elo/Coin delta card → Building Progress Bar fill → Scrollable Q1–Q8 Comparison Pills (tap any pill for inline Solution & Explanation!) → Bottom `[REPAIR MISSES]` `[REMATCH]` `[CITADEL]`.
* **Desktop (`1440×900`):** Left column (`440px`) Stars, Elo/Building animation, Coins/Seals loot chest; Right column (`remaining`) full Question-by-Question Comparison Table (`Your Choice | Defender | Time | Marks | Expand Solution`).
* **States:** *Loading* (server grading `"Tallying Seals..."`); *Error* (retry submission receipt); *Empty* (abandoned `<50%` shows *"Battle Forfeited — 0 Rewards"*).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +-----------------------------+--------------------------------------+
|       ★   ★   ☆   CONQUEST!      |      |    ★   ★   ☆   CONQUEST!    | QUESTION BREAKDOWN (Tap to inspect)  |
|   You 11.33  vs  @arjun 8.67     |      |  You 11.33 vs @arjun 8.67   |--------------------------------------|
|----------------------------------|      |-----------------------------| Q1 [1m MCQ]  You:+1 (22s) Opp:+1 (31)|
| Elo: 1055 → 1068 (+13)           |      | Elo: 1055 -> 1068 (+13)     | Q2 [2m NAT]  You:+2 (55s) Opp: 0 (70)|
| Kernel Keep: 54.2 → 57.8 (+3.6)  |      | Kernel Keep: 54.2 -> 57.8   | Q3 [2m MCQ]  You:-0.67 [Expand Soln] |
| +20 Coins   +30 Arena Pts        |      | +20 Coins  +30 Arena Pts    |   ↳ "Latch delay adds to EACH stage" |
|----------------------------------|      |-----------------------------| Q4 [2m MSQ]  You:+2 (48s) Opp:+2 (61)|
| [Q1✓][Q2✓][Q3✗][Q4✓][Q5✓]...     |      | [REPAIR 2 MISSES IN CITADEL]| ...                                  |
|  Q3: Latch delay missed (-0.67)  |      | [ REMATCH ]  [ TO CITADEL ] | [ Add Q3 to Clan Sparring Deck ]     |
+----------------------------------+      +-----------------------------+--------------------------------------+
| [REPAIR MISSES]     [ CITADEL ]  |
+----------------------------------+
```

---

### Screen 7: Attack Target Select
* **Purpose:** Honest matchmaking hub splitting **Async Raids**, **Live 1v1 Duels**, and **Friend/Revenge Challenges**.
* **Phone (`390×844`):** 3 segmented top tabs (`ASYNC RAID` | `LIVE DUEL` | `FRIENDS`). Displays Shield deduction warning if active (`−4h Shield`), daily point-earning cap (`4/10`), and real online queue status.
* **Desktop (`1440×900`):** 3 side-by-side War Cartography Cards (`Async Matchmaking`, `Live 1v1 Queue with real live count`, `Friends & Pending Challenges/Revenge`).
* **States:** *Loading* (`Searching real challengers ±150 Elo...`); *Empty* (no friends challenged yet); *Locked* (Daily 10-battle coin/point limit reached — can still play Unranked/Friendly).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +--------------------------------------------------------------------+
| [<] WAR DOCK     Points: 4/10    |      | [<] WAR DOCK & MATCHMAKING   Active Shield: 11h | Battles: 4 / 10    |
| [ ASYNC ]  [ LIVE ]  [ FRIENDS ] |      +----------------------+----------------------+----------------------+
+----------------------------------+      | ASYNC BASE RAID      | LIVE 1v1 DUEL        | FRIENDS & REVENGE    |
| ⚠ Attacking trims 4h from Shield |      | Target: ±150 Elo     | Queue Right Now:     | • @priya [Online]    |
|                                  |      | Uses Defender's real | "2 players searching"|   [Live] [Async]     |
| MODE:                            |      | recorded Blueprints. |  7 Qs • 10:00 timer  | • REVENGE (24h left) |
| (●) Single Building (8 Qs)       |      |  (●) Single (8 Qs)   |  [ JOIN LIVE QUEUE ] |   @kabir raided your |
| ( ) 3-Building Raid (9 Qs)       |      |  ( ) 3-Bldg (9 Qs)   |  (At 25s -> honest   |   Maths Lib [REVENGE]|
|                                  |      |  [ FIND RIVAL BASE ] |   Async/Open Lobby)  | • Invite Link [Copy] |
|  [ SCOUT RIVAL CITADEL ]         |      +----------------------+----------------------+----------------------+
+----------------------------------+
```

---

### Screen 8: Enemy Base View (Scouting)
* **Purpose:** Clash-style scouting of an opponent's island before committing to attack, letting you pick your tactical subject target.
* **Phone (`390×844`):** Opponent's isometric island (`62%` top) with pulsing brass targets on eligible buildings; bottom scouting dock shows Selected Building Lv, Blueprint status (*Recorded Run* vs *Unfortified Par*), and `[ATTACK THIS BUILDING]` / `[NEXT RIVAL (-5 Coins skip? No, free 15s cooldown!)]`.
* **Desktop (`1440×900`):** Opponent island left (`65%`); Right Scout Dossier (`35%`) listing opponent TH, Elo delta (`+14 win / -10 loss`), Blueprint strength, and Attack button.
* **States:** *Loading* (island blueprints); *Locked* (shielded enemy only reachable if Revenge); *Empty* (unfortified buildings clearly marked `"No Replay • Par 50%"`).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +---------------------------------------------+----------------------+
| [<] SCOUTING: @meera_cs (1092)   |      | [<] SCOUTING: @meera_cs • Qualifier I (1092) | TARGET BUILDING      |
| Win: +14 Elo | Lose: -10 Elo     |      |---------------------------------------------| [Signal Tower Lv 2]  |
+----------------------------------+      |                                             | Defense: Recorded    |
|       [Town Hall Lv 2]           |      |     (Opponent's Interactive Isometric       |  Blueprint (8 Qs)    |
|  [OS Lv3]  [Algo Lv2] [DBMS Lv1] |      |      Citadel — Tap Any Pulsing Building)    |                      |
|      [CN Lv2 ◀ SELECTED]         |      |                                             | Reward Potential:    |
|                                  |      |       [Signal Tower Lv 2 ◀ SELECTED]        | +14 Elo | +20 Coins  |
+----------------------------------+      |                                             | 3★ = +1 Mastery Seal |
| TARGET: Signal Tower (CN) Lv 2   |      +---------------------------------------------+----------------------+
| Status: Recorded Blueprint (8 Q) |      | [ NEXT RIVAL (Free) ]                       | [ LAUNCH SIEGE (8Q) ]|
| [ NEXT RIVAL ]  [ LAUNCH SIEGE ] |      +---------------------------------------------+----------------------+
+----------------------------------+
```

---

### Screen 9: Clan Home (`Sabha Mandap`)
* **Purpose:** Hub for up to 30 members: Clan Monument level, structured study/signal feed, weekly board, member roster, and donations.
* **Phone (`390×844`):** Header crest & Clan League → Tabs (`FEED` | `MEMBERS` | `WAR`). Sticky bottom bar for `[SEND SIGNAL]` + `[DONATE LANTERN]` + `[ENTER CLAN WAR]`.
* **Desktop (`1440×900`):** Left column (`320px`) Clan Crest, Monument visual, Weekly Points & Perks; Center (`460px`) Chronicle Feed + Study Signals + Focus Lantern Requests; Right (`rest`) 30-Member Roster table.
* **States:** *Empty/No Clan* (Browse Open Clans + Create Clan `[50 Coins]` + Enter Join Code); *Loading*; *Error*.
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +-----------------------+--------------------------+-----------------+
| [<] TURING GARH (24/30) Gold II  |      | TURING GARH           | CHRONICLE & SIGNALS      | ROSTER (24/30)  |
| [ FEED ]  [ MEMBERS ]  [ WAR ]   |      | Clan Monument: Lv 3   | • @rohan 3★ Algo Forge   | 1. @ananya 420p |
+----------------------------------+      | Weekly Pts: 4,820     |   [👏] [🪔] [🙏]         |    Acharya      |
| • @rohan 3★ @dev's Algo Forge    |      | Perk: +10% Solo Coins | • @kavya asks for        | 2. @rohan  390p |
|   [👏 4] [🪔 2]                  |      | Code: #TG26-CS        |   Focus Lantern [Send 10c|    Senapati     |
| • @kavya needs Focus Lantern     |      |-----------------------|--------------------------| 3. @kavya  310p |
|   (Solo Hint)  [ SEND 10c ]      |      | [ ENTER ARCHIVE WAR ] | PRESET SIGNALS:          | ...             |
+----------------------------------+      |                       | [Need Duel?] [Good Luck!]| [Invite Friend] |
| [SIGNAL] [EMOTE] [ CLAN WAR ⚔ ]  |      +-----------------------+--------------------------+-----------------+
```

---

### Screen 10: Clan War (`Archive Siege` & `Raid Weekend`)
* **Purpose:** Unified visual war map for Tuesday–Thursday PvE Past-Paper Titan OR Friday–Sunday Clan vs Clan Citadel Raid.
* **Phone (`390×844`):** War Countdown Header + Total Score Progress Bar → Scrollable 11 Subject Bastions (Archive Siege) or Enemy Member Cards (Raid Weekend) → Tap any Bastion to `[ATTACK (3/3 left)]`.
* **Desktop (`1440×900`):** Top War Banner (Clan A vs Clan B OR Clan vs *GATE 2021 Titan*); Center visual Island/Bastion War Map; Right Sidebar Battle Log & Remaining Attacks tally.
* **States:** *Preparation/Idle* (Monday rest day shows Countdown to Tue `06:00 IST` Archive Siege + last war results); *Locked* (joined mid-war must wait for next war).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +--------------------------------------------------------------------+
| [<] ARCHIVE SIEGE: GATE 2021     |      | ARCHIVE SIEGE: GATE 2021 IIT-B • 18h 22m left • Titan HP: 24/100m  |
| Titan HP: 24 / 100 marks left    |      +------------------------------------------------+-------------------+
| Your Attacks: 2 / 3 remaining    |      | BASTION WAR MAP (11 Subject Nodes):            | WAR FEED:         |
+----------------------------------+      |  [OS: Cleared ✓]  [DBMS: 4/9m]  [CN: 6/8m]     | • @ananya dealt   |
| [✓] OS Bastion       (Cleared!)  |      |  [Algo: 8/12m ◀]  [TOC: Cleared ✓]             |   11/12m on Maths!|
| [⚔] Algo Bastion     (8/12 marks)|      |  [Compiler: 6/6m] [COA: Cleared ✓]             | • @rohan cleared  |
| [⚔] DBMS Bastion     (4/9 marks) |      |  --------------------------------------------- |   OS Bastion!     |
| [⚔] Compiler Bastion (6/6 marks) |      |  SELECTED: Algorithm Bastion (8/12m left)      |-------------------|
+----------------------------------+      |  6 Questions • Max 12 marks    [ ATTACK BASTION ]| Attacks Left: 2/3 |
|     [ ATTACK ALGO BASTION ]      |      +------------------------------------------------+-------------------+
```

---

### Screen 11: Leagues / Ranking & Season Track
* **Purpose:** Competitive ladder clarity across Weekly, All-Time, Friends, Clubs, plus the 20-Tier Free Season Track (*Scholar's Folio*).
* **Phone (`390×844`):** Top tabs (`SEASON TRACK` | `LADDER` | `CLANS`). Season Track shows vertical/horizontal stepped milestones with Claim buttons; Ladder toggles `FRIENDS` / `GLOBAL` + `WEEKLY` / `ALL-TIME`.
* **Desktop (`1440×900`):** Left half = 20-Tier Free Season Folio; Right half = Live Leaderboard with player's pinned rank row at bottom.
* **States:** *Loading*; *Empty* (Friends board with 0 friends shows `Invite Link` card).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +---------------------------------+----------------------------------+
| [<] LEAGUES & SEASON 4 (12d left)|      | SCHOLAR'S FOLIO (SEASON 4 • FREE| RANKINGS [Friends|Global][Wk|All] |
| [ SEASON ]  [ LADDER ]  [ CLUBS ]|      |---------------------------------|----------------------------------+
+----------------------------------+      | Tier 12 • 360 / 400 Arena Pts   | #1  @aditya_cs  Topper II  1512  |
| Your Tier: 12 (360/400 Pts)      |      | [T11: +30c ✓] -> [T12: Crest ★] | #2  @meera_cs   Ranker I   1340  |
| • T12: Brass Crest     [CLAIM!]  |      | [T13: +40c]   -> [T14: Emote]   | #3  @vikram_g   Ranker II  1278  |
| • T15: 1 Seal + Trim  (40 pts)   |      | [T15: 1 Mastery Seal + Trim]    | ...                              |
|----------------------------------|      | [T20: 3 Seals + "S4 Sovereign"] |----------------------------------|
| League Ladder: Ranker II (1265)  |      | Today's Battle Cap: 4 / 10      | YOU: #48 @you   Qualifier II 1068|
+----------------------------------+      +---------------------------------+----------------------------------+
```

---

### Screen 12: Profile & Trophy Room
* **Purpose:** Permanent showcase of player identity, GATE readiness balance across 11 subjects, Titles, Achievements, and Battle History.
* **Phone (`390×844`):** Avatar + Frame + Selected Title + Elo League Badge → Radar/Bar Breakdown of 11 Subjects → Horizontal Trophy Case (Achievements + Season Top-10 Badges).
* **Desktop (`1440×900`):** Top Profile Banner (`1440px` wide) → 3-column showcase: Left = 11-Subject Readiness Bars; Center = Interactive Trophy Alcove & Season Badges; Right = Recent 10 Battles & Win/Accuracy split.
* **States:** *Empty* (new player shows unfilled shadowed badge silhouettes showing exact unlock rule on tap).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +--------------------------------------------------------------------+
| [<] @aravind_cs  "The Exact"     |      | [Frame] @aravind_cs • Title: "The Exact" [Edit] • Ranker II (1265)  |
| Ranker II (1265 Elo) • TH Lv 2   |      +----------------------+----------------------+----------------------+
+----------------------------------+      | 11-SUBJECT MASTERY   | TROPHY ALCOVE        | RECENT BATTLES       |
| SUBJECTS:  OS ███░  Algo ████    |      | • Algo Forge   Lv 3  | [★ Zero-Penalty ✓]   | W vs @priya  +13 Elo |
|            DBMS ██░ CN ███░      |      | • Kernel Keep  Lv 3  | [★ Night Owl    ✓]   | L vs @kabir  -11 Elo |
|----------------------------------|      | • Query Vault  Lv 2  | [☆ Polymath 7/11 ]   | 3★ Raid @dev +15 Elo |
| TROPHY ALCOVE (6 / 15 Unlocked)  |      | • Maths Lib    Lv 2  | [Season 3 Top-10]    | ...                  |
| [Zero-Penalty] [Night Owl] [Lock]|      +----------------------+----------------------+----------------------+
+----------------------------------+
```

---

### Screen 13: Cosmetic Shop (`Brass Merchant`)
* **Purpose:** Spend Brass Coins and Mastery Seals on Citadel aesthetics and Mentor Token boosts—zero pay-to-win.
* **Phone (`390×844`):** Currency header (`Coins` + `Seals`) → Category Pills (`SKINS` | `THEMES` | `PROPS` | `FRAMES` | `MENTOR`) → 2-column preview cards with 1-tap `[PREVIEW ON ISLAND]` before buying.
* **Desktop (`1440×900`):** Left (`62%`) Live Interactive Preview Canvas (swap skin/theme on your actual Citadel before paying!); Right (`38%`) Catalog Grid & Purchase Confirmation.
* **States:** *Locked* (Seal-only items show exact Seal count needed); *Error* (insufficient balance disables buy cleanly).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +---------------------------------------------+----------------------+
| [<] MERCHANT CART   240c | 3 ۞   |      | LIVE PREVIEW: "Jaisalmer Sandstone Theme"   | CATALOG [Themes|Skins|
| [SKINS][THEMES][PROPS][MENTOR]   |      |                                             |----------------------|
+----------------------------------+      |      (Your Actual Citadel Rendered With     | Jaisalmer Golden     |
| +--------------+ +--------------+|      |       Preview Theme / Building Skin)        | Theme    800c [BUY]  |
| | Chola Stone  | | Stepwell Pool||      |                                             | Chola Granite Set    |
| | Skin (OS)    | | Decoration   ||      |                                             |           8 ۞ [BUY]  |
| | 450 Coins    | | 120 Coins    ||      |                                             | +5 Mentor Tokens     |
| | [Preview]    | | [Buy 120c]   ||      +---------------------------------------------+          150c [BUY]  |
+----------------------------------+
```

---

### Screen 14: Settings
* **Purpose:** Full control over sound, music, haptics, accessibility, power consumption, time-of-day visuals, and number formatting without leaving the game.
* **Phone (`390×844`):** Single scrollable ledger with grouped brass-bordered sections and large `48px` toggle switches/sliders.
* **Desktop (`1440×900`):** Two-column balanced card grid (Left: Audio & Haptics + Visual/Power; Right: Accessibility, Numerals & Privacy) + live `[TEST SFX]` and `[AUDIO PREVIEW]` buttons.
* **States:** *Saved instantaneously* per device in `localStorage` + synced profile prefs where applicable.
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +---------------------------------+----------------------------------+
| [<] CITADEL SETTINGS             |      | AUDIO & HAPTICS                 | ACCESSIBILITY & DISPLAY          |
+----------------------------------+      | Master Mute       [OFF / ON]    | Reduced Motion          [OFF/ON] |
| AUDIO (Muted on 1st visit)       |      | Music (Raag)   [====|---] 60%   | Low-Power Mode (30fps)  [OFF/ON] |
| • Music Volume    [====|---] 60% |      | Sound Effects  [======|-] 80%   | Colour-Blind Safe Shapes[OFF/ON] |
| • SFX Volume      [======|-] 80% |      | Haptics (Android)   [ON]      | Text Scale      [S][M][L][XL]    |
| • Haptics (Android)     [ ON ]   |      |---------------------------------| Numerals   [1,00,000 | 100,000]  |
| VISUAL & ACCESSIBILITY           |      | SKY CYCLE: [Auto IST|Dusk|Night]| Digit Script   [0-9 | Devanagari]|
| • Sky: [Auto IST] [Dusk] [Night] |      |---------------------------------+----------------------------------+
| • Reduced Motion       [ OFF ]   |      | PRIVACY: Allow Friend Challenges [ON]   Clan Invites [ON]          |
+----------------------------------+      +--------------------------------------------------------------------+
```

---

### Screen 15: Inbox & Dak Post
* **Purpose:** Central feed for incoming friend challenges, scheduled duel reminders, Revenge targets, and season rewards.
* **Phone (`390×844`):** Single list grouped by `ACTION NEEDED` (challenges/revenge with inline `[ACCEPT]`/`[REVENGE]`) and `HISTORY`.
* **Desktop (`1440×900`):** Left list (`420px`) of notifications; Right detail preview showing challenger's Citadel card, battle mode, expiry countdown, and 1-tap launch.
* **States:** *Empty* (`"Your Dak Post is quiet — challenge a friend from the War Dock!"`).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +------------------------------+-------------------------------------+
| [<] DAK POST (2 Actions)         |      | INBOX (2)                    | SELECTED: DEFENSE LOG               |
+----------------------------------+      | [⚔] @kabir 2★ Maths Library  | @kabir attacked Maths Library       |
| ⚔ @kabir 2★ your Maths Library   |      |     14h ago • Revenge open   | Score: You 9.33 vs Kabir 10.67      |
|   Shield activated (12h)         |      | [✉] @priya Live Duel Invite  | Shield Activated: 12 Hours          |
|   [ VIEW REPLAY ]  [ REVENGE ]   |      |     Expires in 22m           |-------------------------------------|
|----------------------------------|      | [★] Season 3 Badge Awarded   | You may launch 1 Revenge siege      |
| ✉ @priya challenged you (Live)   |      |     Claimed ✓                | against @kabir within 34 hours.     |
|   [ DECLINE ]      [ ACCEPT ]    |      |                              | [ VIEW REPLAY ]  [ LAUNCH REVENGE ] |
+----------------------------------+      +------------------------------+-------------------------------------+
```

---

### Screen 16: Exit Transition
* **Purpose:** Respectful closure returning cleanly to RENYXERA study app when the player taps the Study Gate Door.
* **Phone (`390×844`) & Desktop (`1440×900`):** Ambient Raag music fades out smoothly (`450ms`), twin walnut-brass doors slide shut with soft stone thud, displaying a quick 1-line summary (*"Session saved • +38 Mastery XP • Focus well!"*) before routing back to `/`.
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +--------------------------------------------------------------------+
|       \======|    |======/       |      |            \===================|    |===================/            |
|        |  >> |    | <<  |        |      |             |     SESSION SAVED| >> | << +38 Mastery XP |            |
|        |   Returning to Study    |      |             |    Returning to RENYXERA Study Hall...    |            |
|       /======|    |======\       |      |            /===================|    |===================/            |
+----------------------------------+      +--------------------------------------------------------------------+
```

---

### Screen 17: First-Time Tutorial (Interactive Guided Sequence)
* **Purpose:** Hook a brand-new player inside 3 minutes by turning a ruined Lv 0 building into an operational Lv 1 structure using real GATE questions—zero walls of text.
* **Phone (`390×844`) & Desktop (`1440×900`):** Semi-transparent warm vignette masks everything except the highlighted building (`Code Workshop`) and a concise 2-line speech plaque from the *Citadel Chronicler* at the top (so bottom tap targets remain unobstructed).
* **States:** Skippable only after seeing the Core Action (`"Skip tour"` available after Q1).
```
PHONE (390px)                             DESKTOP (1440px)
+----------------------------------+      +--------------------------------------------------------------------+
|  +----------------------------+  |      |  +--------------------------------------------------------------+  |
|  | CHRONICLER: "Your Citadel  |  |      |  | CHRONICLER: "Every brick here is built from real GATE work.  |  |
|  | begins in ruins. Clear 3   |  |      |  |  Tap Code Workshop to solve 3 starter questions & raise Lv1!"|  |
|  | starter Qs to raise Lv 1!" |  |      |  +--------------------------------------------------------------+  |
|  +----------------------------+  |      |                                                                    |
|           (Dimmed Sky)           |      |               (Dimmed Island)      ┌──────────────────┐            |
|       ┌────────────────┐         |      |                                    │ [Code Workshop]  │ ◀ Tap!     |
|       │ [Code Workshop]│ ◀ Tap!  |      |                                    │  Ruins (Lv 0)    │            |
|       │  Ruins (Lv 0)  │         |      |                                    └──────────────────┘            |
|       └────────────────┘         |      |                                                                    |
+----------------------------------+      +--------------------------------------------------------------------+
```

---

## 4.10 Visual Direction

### Three Candidate Art Directions (Zero Purple/Blue Primary Palette)

1. **Direction A *(Recommended)*: "Nalanda Terracotta & Jaisalmer Brass"**
   * **Feel:** Warm, timeless Indian architectural miniature meets crisp strategy diorama. Feels equally inviting in afternoon sun and at 1:00 AM under low-glare lantern light.
   * **Day Tokens:** Sky Parchment `#F3E9D8`, Grass Terrace `#6E8759`, Canal Jade-Sage `#3D6155`, Sandstone `#D9B382`, Burnt Terracotta `#B84A32`, Antique Walnut `#3D261D`, Brushed Brass `#C8963E`, Ink Primary `#231812`, Ink Secondary `#5C4738`.
   * **Night Tokens (`20:30–05:00 IST`):** Warm Soot Backdrop `#1A1512`, Card Surface `#27201B`, Elevated Panel `#342A23`, Brass Accent `#DFAA4F`, Warm Amber Lamp `#E8A849`, Cream Ink `#F2E7D5`, Muted Sandstone Ink `#B8A590`, Moss Success `#5E8F5B`, Vermilion Error `#D4553B`.
2. **Direction B: "Kalamkari Manuscript & Ironwood"**
   * High-contrast woodcut ink outlines (`#1E1510`) over raw vellum (`#EADBC3`), madder crimson (`#9E2F26`), turmeric ochre (`#D49B27`), and pine olive (`#465C3E`). Strong heritage feel, though dense cross-hatching can look noisy on `390px` screens.
3. **Direction C: "Deccan Basalt & Oxidized Copper"**
   * Warm basalt stone (`#403B36`), verdigris copper roofs (`#4B786B`), marigold plaster (`#D6A868`), vermilion seals (`#C4452B`). Sleek, slightly cooler mood, though basalt grays can feel somber compared to terracotta warmth.

### WCAG 2.2 Accessibility Verification (Direction A)
WCAG 2.2 AA requires `4.5:1` for normal text and `3.0:1` for UI graphics (`W3C WCAG 2.2`):
* **Day Ink (`#231812`) on Parchment (`#F3E9D8`):** Contrast `~14.2:1` (AAA pass).
* **Night Cream (`#F2E7D5`) on Card (`#27201B`):** Contrast `~12.6:1` (AAA pass).
* **Brass CTA Text (`#231812`) on Brass Button (`#C8963E`):** Contrast `~6.4:1` (AA pass). *Never put white text on brass/ochre buttons!*
* **Success Moss (`#2F6B3B` day / `#6BA368` night)** & **Error Vermilion (`#B33620` day / `#E26B52` night)** always pair with distinct geometric icons (`✓` circle vs `✕` diamond) for color-blind safety.

### Typography & Iconography
* **Fonts (Open-Source SIL OFL 1.1 via `next/font/google`):**
  * **Display / Citadel Headers:** `Fraunces` (warm, subtly incised serif character echoing carved stone plaques).
  * **UI & Question Stems:** `Plus Jakarta Sans` (clean geometric readability for dense technical CS statements).
  * **Timers, Code Snippets, Elo, NAT Inputs:** `JetBrains Mono` with `font-variant-numeric: tabular-nums` so ticking timers never jitter horizontally.
* **Iconography:** Hand-crafted `24×24` SVG icons (`1.75px` rounded stroke, walnut/brass fills). **Zero OS emojis (`🔥⚔️🏆`) anywhere in the UI.**

### The One Signature Visual Detail
**"The Brass Astrolabe & Wax-Seal Stamp":** Every major victory, level-up, and correct answer locks into place via a mechanical brass gear rotation and a physical **terracotta/brass seal stamp** impression—unifying the astronomy-observatory masonry of the Citadel with the finality of locking an exam answer.

### Explicit "Anti-AI-Slop" Do-Not-Ship Rules
1. **No purple, indigo, or electric-blue** anywhere in CSS tokens, backgrounds, borders, or particles.
2. **No "glow soup":** Zero multi-layered neon `box-shadow` halos (`0 0 25px rgba(...)`). Elevation comes strictly from crisp `1px–2px` walnut/brass borders and hard-edge `3px` directional architectural drop shadows (`0 3px 0 #231812`).
3. **No glassmorphism blur soup:** Avoid translucent frosted cards floating over cluttered backgrounds (`backdrop-filter: blur` causes mobile GPU overdraw and washed-out text). Use tactile solid paper/walnut panels.
4. **No rainbow linear gradients** on text, buttons, or progress bars. Use matte solid surfaces or subtle 2-stop warm lighting (`#D9B382` → `#C69D6B`).
5. **No emojis as icons.**

---

## 4.11 Motion and Game Feel

### 18 Key Animations (Exact Timings, Easing & Reduced-Motion Fallbacks)

| # | Interaction / Event | Standard Animation | Duration & Easing | `prefers-reduced-motion` Version |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Button / Building Tap** | Scale `1.0 → 0.94 → 1.02 → 1.0`, inner shadow compresses `3px → 0px` | `160ms` `cubic-bezier(0.22, 1, 0.36, 1)` | Instant opacity shift `0.85` (`80ms` linear) |
| 2 | **Entry Doors Open** | Left/Right carved doors slide `-100% / +100%` X, island scales `0.94 → 1.0` | `620ms` `cubic-bezier(0.16, 1, 0.3, 1)` | Crossfade opacity `0 → 1` (`220ms` ease) |
| 3 | **Exit Doors Close** | Twin doors slide inward `±100% → 0%`, subtle camera zoom-out | `480ms` `cubic-bezier(0.7, 0, 0.84, 0)` | Crossfade to black-walnut (`200ms` ease) |
| 4 | **Building Construct / Lv Up** | Bamboo scaffolding rises, dust puffs (`12` particles), building drops `-18px → 0` bounce, golden ring expands | `1,100ms` spring (`stiffness: 260, damping: 18`) | Instant sprite swap + soft highlight ring (`250ms`) |
| 5 | **Rust Cleared (Repair)** | Cracks/mist dissolve upward into golden dust motes; masonry brightens | `550ms` `ease-out` | Instant overlay fade-out (`150ms`) |
| 6 | **Star Reveal (1★–3★)** | Sequential stamp from scale `2.2 → 1.0` + `12° → 0°` tilt, staggered `220ms` apart | `340ms` each (`cubic-bezier(0.34, 1.56, 0.64, 1)`) | Sequential opacity fade-in (`150ms` stagger) |
| 7 | **Coin / Seal Flight** | `4–8` brass coins arc along quadratic Bézier curve into top HUD counter; counter scales `1.15 → 1.0` | `580ms` stagger `45ms`, `ease-in-out` | Counter increments smoothly via number roll (`250ms`) |
| 8 | **Attack Start Banner** | Rolled parchment/brass crest unfurls horizontally across screen center | `450ms` `cubic-bezier(0.22, 1, 0.36, 1)` | Static banner fade-in (`180ms`) |
| 9 | **Answer Lock-In** | Selected option shifts rightward `4px`, brass pin rotates `90°` into place | `140ms` `ease-out` | Border color transition (`80ms`) |
| 10 | **Correct Answer Feedback** | Card flashes moss-green border, `+2.0` seal pops upward `-14px` and fades | `380ms` `ease-out` | Badge text fade-in (`120ms`) |
| 11 | **Wrong Answer Feedback** | Card horizontal micro-shake (`-5px, +5px, -3px, 0`), vermilion border flash | `280ms` linear | Static vermilion border + icon (`80ms`) |
| 12 | **Combo Multiplier Up** | Astrolabe ring rotates `+45°`; combo pill pops `1.0 → 1.25 → 1.0` | `260ms` spring | Counter text updates (`100ms`) |
| 13 | **League Promotion** | Old emblem fractures/slides down, new League Crest descends & stamps wax ring | `900ms` `cubic-bezier(0.22, 1, 0.36, 1)` | Crest crossfade (`250ms`) |
| 14 | **Shield Deployed** | Translucent amber-brass dome rises from moat perimeter upward over island | `650ms` `ease-out` | Shield icon badge appears (`150ms`) |
| 15 | **Bottom Sheet / Drawer** | Slides `translateY(100%) → 0` with slight resistance drag tracking | `280ms` `cubic-bezier(0.2, 0.9, 0.3, 1)` | Opacity fade (`150ms`) |
| 16 | **Trophy / Elo Tick** | Number rolls smoothly with `tabular-nums` + progress bar spring fill | `500ms` `ease-out` | Instant final number (`100ms`) |
| 17 | **Scholar Tap Easter Egg** | Tiny sprite hops `-8px`, speech bubble pops `scale(0.6 → 1)`, `+1 Coin` floats | `400ms` spring | Speech bubble fade-in (`120ms`) |
| 18 | **Diya / Lamp Tap** | Flame radius pulses `1.0 → 1.4 → 1.0`, `5` warm ember sparks drift up | `450ms` `ease-out` | Glow opacity boost (`150ms`) |

### Island Camera Moves
* **Pan & Inertia:** Pointer drag translates CSS/SVG viewport transform (`translate3d`) with `0.92` friction decay per `16ms` tick, clamped to island boundaries so players never lose the island off-screen.
* **Pinch / Scroll Zoom:** Bounded strictly to `[0.75×, 1.85×]` around cursor/pinch midpoint.
* **Auto-Focus on Building Tap:** Smooth `420ms` cubic-ease glide centers the tapped building (`scale: 1.35×`, offset slightly up/left so the bottom sheet or right drawer never hides it!). Closing the panel glides back to saved camera state.

### Haptics Patterns (`navigator.vibrate`)
Note: `navigator.vibrate` is supported on Chrome/Android (~77% global browsers) but **is not supported on iOS Safari / WebKit** (`MDN`; `TestMu AI, 2026`). Wrap all calls in `if (settings.haptics && typeof navigator !== 'undefined' && 'vibrate' in navigator)` and ensure visual/audio cues always carry full feedback on iOS.
* **Soft UI / Option Tap:** `navigator.vibrate(10)`
* **Answer Locked:** `navigator.vibrate(18)`
* **Correct / Seal Stamp:** `navigator.vibrate([12, 30, 22])`
* **Wrong / Negative Marking:** `navigator.vibrate([35, 25, 35])`
* **Star Earned / Level Up:** `navigator.vibrate([18, 40, 25, 40, 45])`

---

## 4.12 Sound and Music

### Sound Identity: "Acoustic Courtyard & Astrolabe"
Instead of generic cartoon *blips* or EDM loops, the Citadel uses an **acoustic Indian courtyard & mechanical brass instrumentarium** generated in real time via the browser's **Web Audio API** (`0 KB` network bloat for SFX, instant trigger), optionally layered with lightweight `CC0` foley (`Kenney.nl` RPG/Impact packs for stone/wood accents).
* **Raag Foundation (Just/12-TET mapped around `Sa = C4 = 261.63 Hz`, drone `Sa2 = 130.81 Hz` & `Pa2 = 196.00 Hz`):**
  * **Dawn (`05:00–08:00`):** **Raag Bhairav** (`Sa r Ga Ma Pa d Ni`) — solemn, focused sunrise gravity using `Komal Re` (`277.18 Hz`) and `Komal Dha` (`415.30 Hz`).
  * **Day / Dusk (`08:00–20:30`):** **Raag Yaman** (`Ṇi Re Ga Ma' Dha Ni Sa`) — majestic dusk serenity using `Tivra Ma` (`369.99 Hz`).
  * **Night (`20:30–05:00`):** **Raag Bhupali** (`Sa Re Ga Pa Dha`) — warm pentatonic lull (`261.63, 293.66, 329.63, 392.00, 440.00 Hz`), zero jarring dissonances for late-night focus.

### Music Architecture (5 Procedural / Hybrid Tracks)

| Track | Musical Mode & Tempo | Synthesis Architecture | Dynamic Behavior |
| :--- | :--- | :--- | :--- |
| **1. Citadel Home (Time-Adaptive)** | Bhairav / Yaman / Bhupali (`64 BPM`) | Soft tanpura drone (`Sawtooth` 130.8Hz + 196Hz through `Lowpass 480Hz Q=1.2` + slow `0.15Hz` LFO) + sparse Markov-chain **Karplus-Strong plucked sitar/santoor notes** + occasional wind chime. | Pauses gently after 90s idle or when battle opens; crossfades by IST hour. |
| **2. Battle Tension** | Bhairav / Yaman faster motif (`108 BPM`) | Muted tabla *theka* pulse (low `Ge` pitch-swept sine + crisp `Na` modal burst) + rhythmic *santoor* arpeggio. | **Dynamic Stress Layer:** When timer `< 60s` or opponent hits Q6/8, increases BPM feel via 8th-note shaker/ghungroo pulse. |
| **3. Victory Fanfare** | Yaman upward *aroha* (`120 BPM`, `4s` sting) | Plucked string ascending `Sa–Ga–Ma'–Pa–Ni–Ṡa` + warm brass FM temple bell (`C5`) sustain. | One-shot sting decaying cleanly back to ambient silence. |
| **4. Defeat / Defense Held** | Bhairav descending *avaroha* (`72 BPM`, `3s` sting) | Gentle `d–Pa–Ma–Ga–r–Sa` flute-like sine+triangle with subtle breath noise (`Bandpass 900Hz`). | Never harsh or mocking—respectful solemnity. |
| **5. Clan War / Raid** | Heroic Yaman/Kedar percussive groove (`116 BPM`) | Double-headed *dholak/pakhawaj* low bass groove + brass horn fifths (`130.8Hz + 196Hz`, `Sawtooth` filtered `750Hz`). | Plays only in Clan War Map / Raid Duel screens. |

### 22 Sound Effects — Exact Web Audio Synthesis Recipes

| # | Event | Concrete Web Audio API Recipe |
| :--- | :--- | :--- |
| 1 | **UI Soft Tap** | `Triangle` `480→240Hz` over `35ms`, `Gain` peak `0.12` exp decay `35ms`, `Bandpass 900Hz Q=1.5` (warm wood block click). |
| 2 | **Building Focus Select** | 2-voice chord (`Sa 261.6Hz` + `Pa 392Hz`), `Sine` + subtle `Triangle` (`-9dB`), attack `8ms`, exp decay `280ms`, `Lowpass 1800Hz`. |
| 3 | **Door Open (Entry)** | Filtered brown noise (`Lowpass` sweeping `180→620Hz` over `450ms`) + sub-bass `Sine` thud `110→45Hz` (`180ms`) + brass bell ping (`523.25Hz` FM ratio `1:2.76`, `I=1.5→0.1`). |
| 4 | **Door Close (Exit)** | Reverse sweep `Lowpass 550→140Hz` (`350ms`) + heavy walnut latch thud (`95→38Hz` `Sine`, `120ms`). |
| 5 | **Answer Select (Radio)** | Short damped `Sine` `660Hz` (`22ms`, `0.08` gain) — crisp, non-distracting brass pin click. |
| 6 | **Answer Lock-In** | Mechanical latch: `8ms` white noise burst (`Bandpass 2200Hz Q=3`) + `Triangle 330Hz` (`45ms`). |
| 7 | **Correct Answer** | **Karplus-Strong** plucked *santoor* on `Ga (329.63Hz)` then `+45ms` `Pa (392.0Hz)`: `3ms` noise burst into delay buffer `1/f`, feedback lowpass `0.992`. |
| 8 | **Wrong Answer / Strike** | Soft wooden thud: `Triangle 145→88Hz` (`140ms`) + `Lowpass 400Hz` (distinct, never shrill buzzer). |
| 9 | **Combo Level Up (x2–x4)** | Pitch scales by combo step along Raag Yaman (`329.6, 369.99, 440, 523.25 Hz`): FM bell (`carrier = f`, `mod = 2*f`, `I = 2.0→0.2` over `240ms`). |
| 10 | **Star Stamp (1★/2★/3★)** | Paper/stone stamp impact (`Noise Bandpass 350Hz 40ms` + `Sine 120→50Hz`) + rising triad `C5→E5→G5` harmonic shimmer. |
| 11 | **Coin Flight / Collect** | High metallic clink: Chowning FM (`carrier 1318.5Hz`, `mod 3560Hz` [inharmonic `2.7:1`], `I=3.0→0.1` over `110ms`). |
| 12 | **Mastery Seal Awarded** | Deep resonant temple *ghanta* (gong): FM `220Hz` + `440Hz` (`mod 311Hz` [`√2` ratio], `I=4.0→0.2` over `1.4s`). |
| 13 | **Building Level Up** | Ascending *sarangi/sitar* arpeggio (`Sa-Re-Ga-Pa-Dha-Ṡa` at `70ms` steps) + stone settle thud + 3 cascading coin chimes. |
| 14 | **Rust / Breach Repaired** | High-pass noise breeze sweep (`600→2800Hz`, `320ms`) resolving into pure `Pa+Ṡa` harmonic pad (`500ms`). |
| 15 | **Tabla "Na" (Tick/Notify)** | Modal dual-sine (`540Hz` `70ms` + `810Hz` `35ms`) + `6ms` `Bandpass 2400Hz` skin slap. |
| 16 | **Tabla "Ge" (Bass Pulse)** | Resonant `Sine 115→145→92Hz` pitch bend (`190ms`, `Lowpass 380Hz`) — authentic *bayan* wrist slide. |
| 17 | **Timer Warning (<15s)** | Soft wooden *tabla Na* tick every `1000ms` (low `0.09` gain so it cues without inducing panic). |
| 18 | **Opponent Progress Ping** | Quiet water-drop sine (`784→987Hz` in `45ms`, gain `0.06`). |
| 19 | **Shield Deploy** | Resonant `Bandpass` noise swell (`220→980Hz Q=4` over `480ms`) + `Sine 261.6Hz` hum (`600ms`). |
| 20 | **Diya / Lamp Ignite** | Gentle `30ms` soft crackle (`Highpass 3200Hz` noise bursts) + tiny `Sine 880Hz` spark (`90ms`). |
| 21 | **Scholar Tap Chirp** | Quick warm `Triangle 523→659Hz` (`80ms`) + single coin clink. |
| 22 | **League Promotion** | Full *shehnai*-inspired brass fifth (`Sawtooth 261.6Hz` + `392Hz` via vibrato `5Hz` + `Lowpass 1400Hz`) over `1.2s` + gong sustain. |

### Loudness Targets, Mastering Chain & First-Visit Autoplay Compliance
* **Master Bus Topology:** `[Music Gain] + [SFX Gain] → DynamicsCompressorNode (threshold -12 dB, knee 6, ratio 4, attack 3ms, release 150ms) → Master Gain → AudioContext.destination`. Prevents phone speaker clipping when coins + fanfare stack.
* **Loudness Standards:** Target **`-18 LUFS` integrated** for music (`-1.0 dBTP` ceiling) per AES TD1008 mobile game mixing guidelines (`AES TD1008`), keeping SFX peaks `3–6 dB` above the music bed so UI feedback stays crisp at low night volume.
* **Strict Default-Mute & Autoplay Compliance:** Browsers block unmuted `AudioContext` prior to user interaction (`Chrome Autoplay Policy`; `MDN Web Audio Best Practices`). **First visit starts Muted (`audioEnabled = false` in `localStorage`)** with a clear `♪ Sound Off (Tap to Enable)` pill in the Citadel top bar. Tapping Unmute calls `audioCtx.resume()` inside the click handler and remembers the choice per device.

---

## 4.13 Settings and Accessibility

### Complete Settings Matrix
1. **Audio & Haptics:** Master Audio (`Off by default`), Music Volume (`0–100%`), SFX Volume (`0–100%`), Audio Theme (`Auto IST Raag / Quiet Drone Only`), Haptics (`On/Off`, hidden cleanly with note *"Not supported on iOS Safari"* when `'vibrate' in navigator === false`).
2. **Visual & Performance:** Time-of-Day Sky (`Auto IST / Always Dusk / Always Night`), Island Weather FX (`On/Off`), **Reduced Motion** (auto-respects OS `prefers-reduced-motion`, toggleable), **Low-Power Mode** (caps Canvas FX at `30 fps`, turns off floating particles/water ripples/chimney smoke for battery conservation).
3. **Readability & Accessibility:**
   * **Text Scale:** `S (14px)` / `M (16px default)` / `L (18px)` / `XL (20px)` on all question stems & cards.
   * **Colour-Blind Safe Mode:** Replaces green/red reliance with high-contrast **Sage-Teal (`#2E6F64`) vs Burnt Ochre-Vermilion (`#C84B24`)** plus mandatory **geometric icon badges** (`▲` High, `●` Pass, `✕` Miss, `◆` Pending).
   * **Number Formatting & Script:** Digit Grouping (`Indian 1,00,000` default vs `International 100,000`) & Numeral Display (`Western 0–9` default vs `Devanagari ०–९` for Citadel decoration/HUD counts; exam inputs always accept standard `0–9`!).
   * **High-Contrast HUD:** Adds solid `2px` walnut/cream borders around floating HUD pills.
4. **Social & Privacy:** Accept Random Async Raids (`On` — disabling pauses trophy climbing), Accept Friend Live Invites (`Everyone Friends / Clan Only`), Show Online Presence (`On/Off`).

### Offline PWA Behavior
* **What Works Offline:** App shell loads instantaneously via Service Worker cache; player can pan their cached Citadel island, inspect Building Mastery stats, browse Trophy Room, adjust Settings, and review **cached past battle summaries/solutions**.
* **What Requires Network (Honest State):** All question grading, PvP attacks, live duels, and Coin transactions require server verification (`"Offline — Reconnect to launch graded battles or training"`). Never allow unverified client-side grading.

---

## 4.14 Technical Design (₹0 Budget, Existing Stack)

### Supabase Free-Tier & Cloudflare Workers Budget Engineering
Let's design explicitly within the verified 2026 free limits:
* **Supabase Free Tier:** `500 MB` Postgres DB, `5 GB` egress, `200` concurrent Realtime connections, `2M` Realtime messages/month (`Supabase Pricing, 2026`). **Critical Free-Tier Rule:** Supabase pauses free projects after **7 days of inactivity**. **Mitigation:** Configure a free Cloudflare Worker Cron Trigger hitting a lightweight `/api/health` endpoint (`SELECT 1`) every 24 hours so the project stays warm year-round (`Cloudflare Workers Docs`).
* **Cloudflare Workers Free Tier:** `100,000` requests/day, **`10 ms` CPU time per request** (`Cloudflare Workers Docs`). Crucially, waiting on network I/O (`fetch` to Supabase) does **not** burn Worker CPU time (`Activepieces / Workers CPU guide`)—still, keep JSON serialization tiny and push all multi-table aggregation (building $M_s$ calculations, leaderboard rankings) into **Postgres RPC functions**!
* **Realtime Connection Hygiene (Staying Under `200` Concurrent Connections):**
  * **Never** open a Supabase Realtime WebSocket when sitting idle on Citadel Home or Clan Home! Use standard HTTP `fetch` (`SWR` / `60s` refresh on focus) for Citadel state and Inbox.
  * **Open a Realtime Broadcast/Presence channel ONLY during:** (a) active Live Matchmaking queue, and (b) active Live 1v1 Duel (`~10–15 min`), disconnecting cleanly in `useEffect` cleanup on finish. Presence calls are rate-limited to max 1 update per 10 seconds (well inside Supabase's 5 calls/30s ceiling).

### Postgres Schema Additions (Linked to Live Tables)
*(Assumes existing `users`, `questions`, `battles`, `clubs`, `user_question_attempts` / analytics tables.)*

```sql
-- 1. Cached Subject Building Mastery (recomputed by Postgres RPC on question submit)
CREATE TABLE citadel_buildings (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL, -- 'os','dbms','cn','algo','toc','cd','coa','dl','pds','math','ga'
  mastery_score NUMERIC(5,2) NOT NULL DEFAULT 0,   -- Peak M_s (0..100)
  level SMALLINT NOT NULL DEFAULT 0,               -- 0..5
  coverage_ratio NUMERIC(4,3) NOT NULL DEFAULT 0,
  weighted_acc NUMERIC(4,3) NOT NULL DEFAULT 0,
  hard_correct INT NOT NULL DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, subject_slug)
);

-- 2. Player Citadel State (Town Hall, Shields, Seals, Cosmetics Equipped)
CREATE TABLE citadel_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  town_hall_level SMALLINT NOT NULL DEFAULT 0,
  mastery_seals INT NOT NULL DEFAULT 0,
  xp INT NOT NULL DEFAULT 0,
  player_level SMALLINT NOT NULL DEFAULT 1,
  equipped_title TEXT,
  equipped_theme TEXT NOT NULL DEFAULT 'nalanda_default',
  equipped_building_skins JSONB NOT NULL DEFAULT '{}'::jsonb,
  shield_until TIMESTAMPTZ,
  guard_until TIMESTAMPTZ,
  tutorial_step SMALLINT NOT NULL DEFAULT 0, -- 99 = complete
  daily_solo_coins INT NOT NULL DEFAULT 0,
  daily_solo_reset_date DATE DEFAULT CURRENT_DATE
);

-- 3. Placeable Island Decorations
CREATE TABLE citadel_decorations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_slug TEXT NOT NULL,
  socket_index SMALLINT NOT NULL, -- 0..27 validated vs Town Hall level
  UNIQUE (user_id, socket_index)
);

-- 4. Honest Async Ghost Defense Blueprints (Real Recorded Runs)
CREATE TABLE defense_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL,
  question_ids UUID[] NOT NULL,         -- exact 8 questions
  defender_answers JSONB NOT NULL,      -- per-q selected answer & time_ms
  defender_marks NUMERIC(5,2) NOT NULL,
  max_marks NUMERIC(5,2) NOT NULL,
  building_level SMALLINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_blueprints_user_subj ON defense_blueprints(user_id, subject_slug, created_at DESC);

-- 5. Async & Live Battle Replays + Revenge Tracking
CREATE TABLE battle_summaries (
  battle_id UUID PRIMARY KEY,
  attacker_id UUID REFERENCES auth.users(id),
  defender_id UUID REFERENCES auth.users(id),
  mode TEXT NOT NULL, -- 'async_raid','live_duel','solo_siege','blitz_rush','daily_trial','archive_boss','breach_repair'
  subject_slug TEXT,
  stars SMALLINT NOT NULL DEFAULT 0, -- 0..3
  attacker_marks NUMERIC(5,2),
  defender_marks NUMERIC(5,2),
  elo_delta SMALLINT DEFAULT 0,
  revenge_used BOOLEAN DEFAULT FALSE,
  revenge_expires_at TIMESTAMPTZ,
  timeline JSONB NOT NULL, -- per-question timing & correctness for Replay screen
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Clan Wars (Weekly Archive Siege + Weekend Citadel Raid)
CREATE TABLE clan_wars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  war_type TEXT NOT NULL, -- 'archive_siege' | 'clan_raid'
  clan_a_id UUID NOT NULL,
  clan_b_id UUID,         -- NULL for PvE Archive Siege
  paper_ref TEXT,         -- e.g. 'GATE_2021_CS'
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE clan_war_progress (
  war_id UUID REFERENCES clan_wars(id) ON DELETE CASCADE,
  target_key TEXT NOT NULL, -- 'os' for Archive Siege OR 'enemyUserId:subject'
  best_stars SMALLINT DEFAULT 0,
  marks_cleared NUMERIC(5,2) DEFAULT 0,
  max_marks NUMERIC(5,2) NOT NULL,
  contributors JSONB NOT NULL DEFAULT '[]'::jsonb,
  PRIMARY KEY (war_id, target_key)
);

-- 7. Free Season Track, Cosmetics & Achievements
CREATE TABLE season_claims (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  season_id INT NOT NULL,
  tier SMALLINT NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, season_id, tier)
);

CREATE TABLE user_cosmetics (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_slug TEXT NOT NULL,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, item_slug)
);
```

### Server Authority Matrix (What the Browser Must NEVER Decide)
* **Client Only Owns:** Camera pan/zoom coordinates, local audio synthesis & mute preferences, visual animations/confetti, current draft selection before clicking `[LOCK]`.
* **Server (Cloudflare Worker + Postgres RPC) Owns 100%:**
  1. Selecting/shuffling question IDs and **never sending correct answer keys** to the client during an active match!
  2. Official GATE score calculation (`MCQ/MSQ/NAT` grading), combo bonus verification, and **server clock validation** (`started_at + duration_limit + 5s grace`).
  3. Recalculating $M_s$, Building Levels (`0–5`), Topic Stars, Elo rating, Shield durations, and Coin/Seal wallets inside atomic Postgres transactions (`BEGIN ... COMMIT`).
  4. Anti-cheat plausibility check (flagging any completed 8-question set solved in `< 20 seconds` total with `> 75%` accuracy as unranked/audit-flagged).

### Mobile Performance Budgets (Target: ₹12,000 Android Phone on 4G)
* **Route JS Payload (`/battles`):** `< 140 KB` gzipped (using `LazyMotion` + `m` from `motion/react` cuts motion bundle from `~34 KB` to `~5 KB` gzipped!).
* **First Meaningful Citadel Paint:** `< 1.2s` on cached PWA launch; `< 2.0s` cold 4G.
* **Frame Budget:** `< 16.6 ms` (`60 fps` pan/zoom/idle); `0` layout thrashing (`transform` + `opacity` animations only).
* **Asset Pipeline:** Build modular SVG sprite components (`SVGO`-compressed) with CSS variable theming so a single building SVG renders all architectural skins (Jaisalmer/Chola/Default) via `data-theme` color swaps—**zero duplicate image downloads!**

---

## 4.15 Onboarding and Retention

### The First 5 Minutes (Minute-by-Minute Choreography)
* **`0:00–0:20` (Arrival & Ownership):** Player taps *Enter Arena* → Gate Doors open → Citadel reveals with existing study progress *already converted into real buildings* if they practiced in RENYXERA before! (If brand new, 11 stone ruins stand ready under warm dusk lamps.)
* **`0:20–2:30` (The First Spark Siege):** Chronicler highlights *Code Workshop* → player runs a curated **3-question Starter Siege** (1 easy MCQ, 1 medium NAT, 1 conceptual MSQ—only ~2 minutes). Completing it triggers the **Level 0 → Level 1 Construction Animation**, brass fanfare, `+30 Coins`, and `+15 XP`.
* **`2:30–4:30` (First Skirmish Choice):** Chronicler unlocks the War Boat and offers a clear fork: *"Challenge a Rival's Recorded Garrison (Async)"* OR *"Try Today's Daily Trial"*.
* **`4:30–5:00` (Habit Anchor):** Prompt to place their free starter *Banyan Sapling* decoration on an empty terrace socket, cementing spatial ownership (`Ryan & Deci, 2000`: Autonomy + Competence).

### First-Week Retention Cadence
* **Day 1:** Construct Lv 1 building + try 1 Async Raid.
* **Day 2:** Morning/Evening Daily Trial (`+25 Coins`) + notice your first Defense Replay in Dak Post.
* **Day 3:** Unlock **Archive Boss** & join a Clan (`+20 Coins` welcome quest).
* **Day 5:** First **Rusted Building** reminder (if an untouched subject dipped) introduces Breach Repair.
* **Day 7:** Hit live **Day-7 Streak (`+60 Coins`)** + first full Week Leaderboard & Clan Archive Siege payout.

### Respectful Notifications (In-App Dak Post + Optional Web Push)
* **Hard Rules:** Max **1 push/day**, strict quiet hours **`23:30–08:00 IST`** (never wake a sleeping student), actionable facts only (never manipulative guilt trips).
* **Examples:** *"Revenge Window Open: @rahul 2-starred your Query Vault (Shield active 12h)"*, *"Clan Archive Siege: 9 marks left on TOC Bastion — 2 hours remaining!"*, *"Daily Citadel Trial refreshed (10 new GATE Qs)"*.

### How the Game Continuously Drives Real Learning
1. **Diagnostic Rust:** Unpracticed subjects visibly turn dusty/cracked after 7+ days, nudging spaced review (`Cepeda et al., 2006`) without deleting progress.
2. **Post-Battle Repair Loop:** Every wrong battle answer automatically queues into that building's **Breach Repair** Mistake queue inside the Citadel.
3. **Cap-Triggered Mock Nudge:** Hitting the `10` point-earning battle cap displays: *"Garrison Maxed Today! Ready for a full 180-minute GATE Mock or AI Mentor review?"* and gently highlights the Study Exit Door.

---

## 4.16 Metrics (Design Targets — Not Invented Current Product Stats)

*(Note: RENYXERA has not provided baseline Citadel telemetry; the table below defines instrumentation events and early-product **target benchmarks** to validate post-launch.)*

| Category | Exact Metric to Instrument | Early Target Benchmark | Why It Matters |
| :--- | :--- | :--- | :--- |
| **Activation** | % of `/battles` entrants completing the 3-Q Tutorial & hitting Lv 1 in first visit | **`≥ 70%`** | Proves entry transition + first battle loop isn't overwhelming. |
| **Learning Integrity** | **7-Day Mistake Recovery Rate:** accuracy on Breach Repair Qs previously missed in battles | **`≥ 68%`** | Proves the game actually cures misconceptions (`Roediger & Karpicke, 2006`). |
| **Anti-Cheat / Quality** | Median time-per-question in Solo Siege & Async Raids (`s/question`) | **`45s – 110s`** | Catches blind speed-clicking (`< 12s`) vs healthy cognitive effort. |
| **Engagement** | Daily Battles + Solo Modes completed per DAU; Weekly Active Clan Participation | **`2.5+ modes / DAU`**; **`≥ 45%`** in Clans | Validates multi-mode depth beyond 1-and-done duels. |
| **Retention** | Game-user **D1 / D7 / D30 Retention** & Study-Session Lift vs non-game users | **`D1 ≥ 45%`, `D7 ≥ 22%`, `D30 ≥ 10%`** | Measures durable habit without burnout. |
| **Technical** | Mobile P95 frame time (`ms`), Worker CPU/req (`ms`), Peak Realtime concurrents | **`< 16.6 ms`**, **`< 4 ms`**, **`< 150`** | Protects budget Android battery & ₹0 free-tier limits. |

---

## 4.17 Risks and Structural Mitigations

| Risk | How It Could Harm Players / Product | Concrete Architectural Prevention |
| :--- | :--- | :--- |
| **1. Gambling / Skinner-Box Feel** | Variable drop rates or loot crates trigger compulsion (`Deci, Koestner & Ryan, 1999`). | **Zero random loot boxes.** All Coin/Seal payouts, building levels, and shop prices are 100% deterministic and visible upfront. |
| **2. Burnout / Replacing 3-Hr Study** | Students burn 2 hours chasing quick duels instead of full-length 180-min mocks. | **Hard daily cap (`10` point-earning battles/day + `60` Solo Coins/day)**; after cap, UI celebrates resting and nudges toward the Study Exit Door. |
| **3. Toxic Harassment / Leaks** | Free-text clan chat invites bullying, spam, or pasting leaked mock keys. | **Zero free-text chat.** Structured study signals, activity cards, and 5 respectful brass emotes eliminate moderation liability at ₹0 cost. |
| **4. Empty Lobbies & Ghost Towns** | Small early userbase hits dead matchmaking and assumes the app is broken. | **Honest live queue counters + 25s graceful pivot** to real recorded Async Defense Blueprints or open lobby pinning while running Solo Drills. |
| **5. Cheating & Win-Trading** | Browser dev-tools tampering, dual-account Elo boosting, or rapid AI lookup mid-duel. | Server-only grading, option-order randomization per attempt, strict `duration` bounds, `< 20s` blitz anomaly flagging, and **diminishing Elo gain (`0` after 3 wins/week)** against the exact same friend. |

---

## 4.18 Phased Roadmap

### V1 — The Living Core (2 Weeks: 1 Developer + AI Coding Agent)
*Goal: Ship an atmospheric, 60 fps responsive Citadel where everything is interactive inside the game shell.*
* **World & Art:** Interactive SVG Citadel + Canvas 2D water/firefly/dust FX, IST Day/Dusk/Night cycle, 11 Buildings + TH across Levels `0–5` (shared skin), Walking Scholars + interactive lamps, Entry/Exit Doors.
* **Progression & Core Modes:** Server RPC computing exact $M_s$ & Building Lv `0–5`, **Tutorial (3-Q Spark Siege)**, **Topic Siege**, **Blitz Rush**, **Daily Surya Trial**, **Breach Repair (Mistakes Bank)**.
* **PvP:** **Async Building Attack** using Defense Blueprints (+ honest Par fallback) with 1–3★, Shields & Revenge; **Polished Live 1v1 Duel** (25s honest queue fallback); **Question Battle Screen** (Phone + Desktop); **Result & Inline Solution Review**.
* **Audio & Settings:** Complete Web Audio API SFX (`22` recipes, default muted) + Settings screen (Volume, Haptics, Reduced Motion, Low-Power, Color-Blind Safe).

### V2 — Clan Wars, Seasons & Customization (Weeks 3–5)
*Goal: Deepen social collaboration, long-term personalization, and musical identity.*
* **Clans 2.0:** Structured Chronicle Feed, 5 Brass Emotes, Focus Lantern (Solo-only) donations, **Tue–Thu PvE Archive Siege**, **Fri–Sun Clan Raid Weekend**.
* **Economy & World Depth:** **Mastery Seals**, **20-Tier Free Season Track (*Scholar's Folio*)**, **Placeable Island Decorations + TH Island Growth**, **Cosmetic Shop** with live Citadel preview (Building Skins + Island Themes + Titles + Trophy Alcove).
* **Adaptive Audio:** Full procedural **IST Raag Ambient & Battle Music Engine** (Bhairav / Yaman / Bhupali).

### V3 — Scale, Tournaments & Multi-Branch Expansion (Weeks 6–10)
* **Weekend Arena Hour** live Swiss/Arena tournaments (`Sat/Sun 20:00–21:00 IST`).
* **Replay Scrubbing & Duel Spectating** (shareable replay links inside Citadel).
* **Multi-Branch Citadels:** Swap the 11 subject buildings seamlessly for RENYXERA's other branches (ECE, EE, ME, CE, DA) using the same modular SVG architecture.
* **Optional PixiJS v8 Renderer Upgrade** only if active sprite density exceeds V1–V2 SVG budgets.

---

## 4.19 Decisions Required from the Owner

Please confirm the following 7 design calls before V1 code sprint begins:

1. **Second Prestige Currency (`Mastery Seals`):** Approve adding **Mastery Seals** (non-purchasable, earned only from 3★ mastery/Archive Bosses/Season Tiers) alongside **Brass Coins**, OR keep strictly **Coins-only** in V1? *(Recommended: Approve Mastery Seals for V2, start Coins-only in V1.)*
2. **Clan Communication Policy:** Approve **zero free-text chat** (structured study signals + 5 emotes only) to keep moderation overhead at ₹0 and prevent toxicity, OR require moderated text chat? *(Recommended: Structured signals + emotes only.)*
3. **Async Defense Blueprint Fallback:** Approve labeling uncalibrated Lv 0–1 enemy buildings transparently as **"Unfortified Garrison (Benchmark Par 50%)"** with `0` Elo lost by the uncalibrated defender? *(Recommended: Yes.)*
4. **Decay Visualization Rule:** Confirm **non-punitive decay**—where Building Level (`0–5`) stays permanently earned on peak score, while Recency drop triggers visual **Rust/Cracks** (70% defense strength) cleared instantly by a 5-question Breach Repair? *(Recommended: Yes.)*
5. **Elo Calibration:** Keep existing `K=24` for all matches, OR add provisional `K=36` for a player's first 10 matches? *(Recommended: Provisional `K=36` for first 10 matches.)*
6. **Color Palette Shift inside `/battles`:** Confirm overriding RENYXERA Study App's `#4f46e5` indigo theme-color completely inside the `/battles` route to **Sandstone, Terracotta, Walnut, Brass, and Jade-Sage**? *(Recommended: Yes — mandatory per Rule 3.)*
7. **25-Second Live Queue Pivot:** Confirm automatically presenting the **"Battle Recorded Async Rival" vs "Pin Open Lobby & Play Drill"** choice at 25 seconds when live queue is empty? *(Recommended: Yes.)*

---

## Section 12 Self-Check Verification
* **Sections 4.1–4.19 complete?** Yes, all 19 sections addressed in full concrete detail.
* **Player never sent out of the game?** Verified across all 17 screens; Training, Question Picking, Mistake Repair (`Breach Repair`), Solution Review, Shop (including Mentor token purchase), Clan, and Settings execute inside `/battles`. Only the Study Exit Door leaves to `/`.
* **Every level & reward tied to real performance?** Verified via closed-form $M_s$ formula (Topic Coverage + Bayesian Weighted Accuracy + Hard-Question Depth + Recency), anti-farming session caps, and Mastery Seals.
* **Honest fallbacks for low player counts?** Verified: live queue count shown truthfully, 25s pivot to clearly labeled Recorded Async Defenses or open lobby pinning, no synthetic bots.
* **No purple/blue main palette & anti-AI-slop rules?** Verified: strict sandstone/terracotta/walnut/brass/jade-sage palette, matte finishes, custom SVGs, zero emojis, zero glow soup.
* **Concrete sound recipes?** Verified: 22 Web Audio synthesis recipes with oscillator waveforms, exact Hz frequencies, filters, ADSR envelopes, Karplus-Strong and Chowning FM topology, `-18 LUFS` target, and default mute on first visit.
* **Phone & Desktop layouts + ASCII wireframes for all screens?** Verified for all 17 screens (`390px` portrait & `1440px` landscape).

---

### References & Research Citations
* **Game Design & Mechanics:** Clash of Clans 1–3 Star Victory Rules (`CoC Wiki`, [2.1.7]); Shields & Village Guard mechanics (`Supercell Support`, [2.1.6], [2.1.8]); Clash Royale River Race 4-week cadence (`Supercell Support`, [6.3.4]); Clash of Clans Clan Capital persistent Raid damage (`Supercell Support`, [6.3.5]); Lichess Puzzle Storm combo/time penalties & Puzzle Racer live pacing (`Lichess`, [6.4.2], [6.4.7]).
* **Learning Science & Motivation:** Testing Effect / Retrieval Practice (`Roediger & Karpicke, 2006` — 61% vs 40% 1-week retention, [2.2.1], [2.2.3]); Distributed Practice meta-analysis of 317 experiments (`Cepeda et al., 2006`, [2.4.1]); Desirable Difficulties (`Bjork, 1994`, [5.2.1]); Interleaved Practice (`Kornell & Bjork, 2008`, [8.4.3]); Gamification meta-analysis showing game fiction + competition/collaboration boosts (`Sailer & Homner, 2020`, [2.3.3]); Self-Determination Theory (`Ryan & Deci, 2000`, [8.3.1]) & tangible reward undermining meta-analysis (`Deci, Koestner & Ryan, 1999`, [5.1.1]).
* **GATE Exam Rules & Product:** Official GATE CS 65-question / 100-mark / 180-min pattern and `-1/3` / `-2/3` MCQ negative marking (`Made Easy`, [1.3.1]; `PrepMatic AI`, [1.3.8]); RENYXERA live product reference (`gate.renyxera.workers.dev`, [4.1]).
* **Web Engineering, Infrastructure & Accessibility:** Supabase Free Tier limits — 500 MB DB, 200 Realtime connections, 2M messages/mo, 7-day pause rule (`Supabase Pricing/Docs, 2026`, [1.1.2], [1.1.5]); Cloudflare Workers Free Tier — 100k req/day, 10 ms CPU budget excluding I/O (`Cloudflare Docs`, [1.2.1], [1.2.5]); Motion for React `LazyMotion` ~5 KB vs 34 KB (`Motion Docs`, [11.3.1]); PixiJS v8 ~225 KB gzip & mobile `devicePixelRatio` guidance (`AppScale` [1.4.1]; `PixiJS Docs` [1.4.2]; [11.2.7]); Three.js ~181–186 KB gzip (`Bundlephobia, Nov 2026`, [10.1.4], [10.1.5]); Material 3 `48×48dp` targets ([3.4.1]); WCAG 2.2 `4.5:1` / `3:1` contrast ([7.3.1]); Vibration API iOS Safari absence (`MDN`, [6.1.2]; `TestMu AI, 2026`, [6.1.9]).
* **Audio Synthesis & Indian Classical Music:** Raag Bhupali (`Sangat`, [3.1.5]), Raag Yaman (`Sangat`, [5.3.1]), Raag Bhairav (`Web Harmonium`, [8.2.6]); Karplus-Strong plucked string (`Wikipedia`, [3.2.6]); Chowning FM metallic bell synthesis (`Chowning, 1973`, [7.2.5]); AES TD1008 mobile loudness guidelines ([3.3.3], [3.3.8]); Chrome/MDN Web Audio autoplay policy ([5.4.4], [5.4.7]); CC0 SFX fallback packs (`Kenney.nl`, [7.1.3]).