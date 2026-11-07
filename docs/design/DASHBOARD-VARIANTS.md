# Dashboard redesign: the top 10 variants

[← Docs index](../README.md) · [UI/UX plan](UIUX-OVERHAUL-PLAN.md) · [Logo map](LOGO-PLACEMENT-MAP.md)

Written 7 Nov 2026. Ten complete dashboard redesigns, each in four modes (desktop light, desktop dark, phone light, phone dark): **40 images**. They are design mockups with **example data** (labelled "Example data" in every image), not the running app. Pick one, or a mix, and only then does the build start.

**Where the images are:** `docs/design/dashboard-variants/` (kept on the owner's computer, not in git because they total 33 MB).

- `v01-focus-stream-desktop-light.png`, `…-desktop-dark.png`, `…-mobile-light.png`, `…-mobile-dark.png` (the same four names for every variant, `v01` to `v10`).
- `sheets/sheet-v01-….png` to `sheet-v10-….png`: one overview image per variant with all four modes side by side (open these first).
- `src/`: the generator. `node src/render.mjs 05 <folder>` re-renders one variant.

## What every variant keeps (your direction)

- **The original logo, top left.**
- **The small tools group, top right**, as one compact glass pill: search, planner, to-do, focus target, leaderboard, tools, theme, paper chip, profile. The icon under the pointer gets the gliding highlight.
- The page navigation is **not** in the left dock any more; each variant places it differently (centre pill, a few rail icons, a bottom dock, text links, a labelled sidebar).
- Palette only: Lavender ground, Powder Blue, Peach, Deep Navy, White. Text is always navy (or near-white in dark); peach and powder are fills.
- Phone: bottom floating pill of five (Home, Practice, Mentor, Review, More) and a short top bar (logo, search, planner, leaderboard, profile).

## How these were chosen

Research and skills used this turn, as you asked: dashboard-design guidance (one primary action per screen, progressive disclosure, hierarchy from type and space, decision loops instead of metric walls), Raycast's command-first home, Airbnb's tabs-and-primary-action structure, Notion/Datadog bento tile sizing, floating-dock components (Magic UI, Aceternity, 21st.dev), Rauno Freiberg's interaction craft, and the UI UX Pro Max data (anti-patterns: no emoji icons, no gray-on-gray, 44 px touch targets, bottom navigation of five or fewer). Skills applied: frontend-design, interface-design, design-critique, design-elevation, taste, hallmark. Their "no glass, no pills, no gradients" house rules were set aside where your brief asks for glass and pills; their other rules were kept (no label above every heading, no invented proof, full-ink text).

**Sixteen concepts were drawn up; six were discarded as too simple or wrong for the product:**

| Discarded | Why |
|---|---|
| Widget grid of equal cards | The current dashboard; flat hierarchy, nothing leads. |
| Big hero card plus tiles | You asked for no primary card. |
| Tabbed dashboard (Overview, Plan, Stats) | Hides information behind clicks (excise). |
| Neon "gaming HUD" | Breaks the palette and reads as AI-made. |
| Kanban board | A work-management posture, not exam practice. |
| Everything-in-glass | Costs frames on cheap phones and fails contrast. |

## The ten

| # | Name | The idea | Navigation | Best for |
|---|---|---|---|---|
| 01 | Focus Stream | Today as one timeline: one next step, then the evening in order; numbers sit quietly in one side panel. | Centre pill | The daily-use student; calm. |
| 02 | Bento Mosaic | Tile size equals priority; the navy tile is the one thing to do; every other tile answers one question. | Bottom dock | The most "premium" first impression. |
| 03 | Command Home | Say what you want to do. A command bar is the page; three plain lists below for people who click. | Centre pill | Fast, keyboard-first users. |
| 04 | Readiness Orbit | One three-ring dial answers "am I on track?"; four satellites orbit it; next steps beside. | Left rail of 6 icons | A single memorable focal point. |
| 05 | Week Strip | Exam prep is a schedule: the week is the header; tonight's agenda and the week's balance below. | Labelled left sidebar | Planners; shows load and the Sunday mock. |
| 06 | Shelves | Horizontal shelves of tall cards with one big number each (Continue, Fix next, Daily Forge). | One floating bar (logo, pages, tools) | Browsing; most Airbnb-like. |
| 07 | Mission Control | Every subject on one table, six KPIs on top, borders instead of decoration, tabular numbers. | Flush icon rail plus top bar | Power users and rank chasers. |
| 08 | Mentor First | The AI Mentor composer is the main surface; your evening is a checklist beside it. | Floating left dock of 6 | Leads with the product's differentiator and Pro value. |
| 09 | Countdown Road | The 91 days as a road: today, mocks, end of pass 1, GATE; four phase panels below. | Centre pill | Urgency and long-range planning. |
| 10 | Editorial Type | The countdown is set as a magazine figure; three numbered steps (a real sequence) and one small stats card. | Plain text links | The most distinctive look; least dense. |

## My ranking, and what I would build

1. **05 Week Strip**: a student's real question is "what do I do today and this week"; it shows both, and the mock date is in view.
2. **01 Focus Stream**: the calmest; one decision at a time; easiest to build on the existing data.
3. **08 Mentor First**: the strongest for upgrades (Plus and Pro value is visible on the home screen).
4. **02 Bento Mosaic**: the best first impression for the signed-out and new-user view.

A hybrid I would propose after you choose: **05's week strip on top, 01's timeline for tonight, 08's Mentor composer as a slim bar, 02's navy tile for the single next step.**

## Review passes (what I changed after looking)

- Phone layouts leaked desktop grids in five variants (05, 07, 08, 09, 04); fixed.
- Empty lower halves on 03, 04, 09, 10 filled with real content (more rows, weak-topic bars).
- Logo too small; enlarged. "Example data" collided with the phone pill; moved.
- A weekday error (Sunday was the 9th; 7 Nov 2026 is a Saturday so the mock is Sunday 8 Nov); fixed everywhere.

## Honest limits

- These are pictures of a design, not working screens. The numbers (rank, "up 96", "best 19", readiness 64%, "Syllabus pass 1: 54%") are **examples**. Some tiles need features that do not exist yet: a readiness score, "syllabus pass" progress, per-day plan blocks with times, Mentor prompts suggested from mistakes. Each would be built or dropped after you choose.
- Only the logo is the real asset; everything else is drawn for the mockup.
- 10 and 03 leave more empty space on purpose; 07 is the densest.
- Owner next step: open the `sheets/` images, name your top one or two (or the mix), and say what to add or remove. Nothing else is built until you confirm.

---

## Round 2 and 3 (7 Nov, night): owner feedback and ten new concepts

Owner feedback on round 1: liked **01, 02, 03** (03 is good for the AI Mentor); **04** was too thin (a ring and a chat bar) and the **chat must not be on the dashboard**; **05 to 10 not wanted** (05 reads as a planner). Owner also asked for the original logo with our own wordmark font.

- **Logo in every image now:** the original mark, "RENYX" in navy and "ERA" in the cyan-violet gradient, set live in **Bruno Ace SC**, with the gold PRO badge (as in the owner's screenshot).
- **No chat on the dashboard anywhere.** The Mentor appears only as an "Open Mentor" button with a line such as "3 explanations ready". Command Home (03) keeps its command bar because it is search and navigation, with "Ask the Mentor" as one of its shortcuts.
- **Liked set, updated:** `dashboard-variants-set1-liked/` holds 01 to 04 (16 images). 04 now has four detailed satellites (weak topics with bars, due mistakes by subject, streak with a week of dots, mock with rank and sparkline), a legend, and a minutes-studied chart.
- **Ten new concepts, none a planner, dense table, chat panel or editorial page:** `dashboard-variants-set2-new/` holds 11 to 20 (40 images). Open `sheets/` first.

Research this round: Whoop and Oura (one score as the product), Apple Fitness rings (glanceable daily goals), CRED and Credit Karma (gauge plus factors that move it), Monzo and Revolut home screens (little found), and 2026 dashboard layout roundups (progressive disclosure, decision loops). Sixteen further concepts were weighed; six were dropped (daily-brief text, garden or gamified, kanban, heatmap-first, iOS launcher grid, coverflow) as editorial-like, gamified, wrong posture or too close to Bento.

| # | Name | The idea | Nav |
|---|---|---|---|
| 11 | Score Gauge | One predicted-score gauge and the five factors that move it, each with its fix | Centre pill |
| 12 | Daily Rings | Three goals as concentric rings (practise, revise, Forge); a week of mini rings | Left rail |
| 13 | Card Stack | A wallet of cards; the next step in front, the rest peek with one number | Bottom dock |
| 14 | Split Spotlight | Dark half is only "now", light half is "where I stand" | Icons in the dark half |
| 15 | Marks Map | The syllabus as a treemap: size is weightage, colour is mastery | Text tabs |
| 16 | Subject Radar | Your shape against the 70% target; the dents are the plan | Left rail |
| 17 | Story Rail | A rail of six circles; tap one and its card fills the stage | Centre pill |
| 18 | Widget Desktop | Glass widgets on the wallpaper and a dock of app icons | App dock |
| 19 | Pulse Feed | A feed of plain sentences about what changed, each with one action | Text tabs |
| 20 | Focus Session | Pick a length and a mode, press play; stats at the edges | Centre pill |

Review fixes after looking: radar overflowed its column (16); option pills unstyled on phone (20); text invisible on the dark half in light mode and nav colliding with the tools (14); phone stack broken (13); ring labels clipped (12); muted text unreadable on the navy widget (18); lower right empty (11); PRO badge pushed the tools off the phone header (01 to 04).

Honest limits: several tiles need features that do not exist yet (predicted score, daily-goal rings, mastery-by-weightage map, "marks gained if you reach 70%", per-day plan blocks, focus sessions). All numbers are examples. Nothing here is committed or built.
