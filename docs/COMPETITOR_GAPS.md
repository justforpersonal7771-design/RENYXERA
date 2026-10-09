# Competitor gap list (updated 10 Oct 2026)

Compared with **Project Forge** (projectforgeapp.in), **The GATE Grind** (thegategrind.online) and **PadhaiShuru**
(padhaishuru.com). Each was opened in a real browser on desktop and phone, **both logged out and logged in** (free
accounts made with a throwaway inbox, no payments, nothing posted). Their "virtual library" game is excluded, as asked.
Tick items as they ship. Sorted by priority, then usefulness to a GATE student, then effort (S/M/L).

## What each site does behind the login

**Project Forge** (daily revision app; live branches CS, ME, CH, Banking, CE — *EE and EC are "coming soon"*)
- **Bottom tab bar on phones**: Home · Revision · Tests · Battles · Leaders · Profile (the only one of the three that has it).
- Onboarding: branch → exam (GATE; ESE/PSU/University "coming soon") → target year, weekly goal (3/5/7 days), target AIR → **20-question diagnostic**; the profile then shows strongest subject and "needs work".
- Home: "Today's revision (N questions, ~M min)", daily missions (a flashcard deck, win a battle, 30 questions), streak, XP and level, league standing, install-to-home-screen push reminders.
- Revision session builder (all subjects / subject / topic, spaced-repetition "smart order"); randomised mock "100 difficulty levels"; GATE 2027 mock free; past papers premium.
- 10-question real-time ELO 1v1 battles; weekly league with the top 10 promoted.
- Money: **15-day full-Premium free trial**, then ₹699 lifetime Premium (October offer 60% off, ₹279.60).

**The GATE Grind** (free; 4,485 PYQs, 69 papers, 2015–2026)
- Key-based accounts (display ID + two security questions + generated key, no email); pick up to 2 papers.
- Syllabus pages with **per-topic progress** (Not started / Solid 40%+ / Cleared), weightage per topic, and a **Checkpoint** (short warm-up-to-stretch quiz per topic with last-minute notes).
- History (questions tried, attempts, accuracy, "wrong now" to revise), bookmarks, General Aptitude lessons ranked by frequency plus a daily 6-question test, mocks with time-split tips, avatar and "Aura" points. No bottom tab bar.

**PadhaiShuru** (20 branches, but thin: 1,646 PYQs, 2021–2025, CS 846, EC 340, EE 80, ME 40)
- Dashboard: **focus study timer**, daily goal (120 min), streak, week/month/all-time, **weekly benchmark vs peers in your branch**, shareable "revision week" card (PNG, no name by default), study reminders (saved, delivery "coming soon").
- AI doubt engine (5 free a day), private study rooms (room key, chat, shared files), leaderboard by verified study time, 5 MB personal PDF notes.
- AIR predictor and cut-off tracker for 20 branches; trend-based mock papers (4 per branch, PDF download); a "GATE 2027 changes" page; PYQ heatmap, trend analysis and mistake bank are premium.
- Observed problems at test time: mock "Start Exam" showed "Paper not found", the Daily PYQ page was a 404, and the weekly benchmark and reminders failed to load. No bottom tab bar.

## Gaps in our app, in priority order

### P0

- [x] **#1** Bottom tab bar on phones (Home · Practice · Review · AI · More). Ours is a top header of small icons plus a hamburger. *(shipped 10 Oct: Home · Practice · Review · AI Mentor · More; "More" opens the existing menu)* — Forge; Thumb reach; the app-like feel students expect; effort S–M
- [x] **#2** Diagnostic onboarding: target year, weekly goal, target AIR, then a 20-question diagnostic that fills the dashboard (weak topics, plan) from minute five — Forge; Biggest lever for activation and day-1 return; effort M–L *(shipped 10 Oct as a dashboard "Start here" card; goals saved on this device until a profile column exists)*
- [x] **#3** Landing for signed-out visitors with a proof line (2,470 PYQs · 5 papers · 2017–2026) and what signing in unlocks *(shipped 10 Oct as a sign-in-led welcome on the dashboard; guests keep today's limits, nothing is advertised as "no login")* — Grind; Our signed-out home is a dashboard of zeros; effort S
- [x] **#4** "Today" card: today's N questions (spaced repetition from mistakes) plus 3 small daily missions *(shipped 10 Oct: built from the revision queue and streak; daily missions with done-ticks still to do)* — Forge; A daily reason to open the app; we already have Mistakes/Revision and streaks; effort M
- [x] **#5** Personal progress on syllabus pages per topic (Not started / Solid / Cleared) with a show/hide toggle — Grind; Turns our weightage pages into the study map; effort M

### P1

- [x] **#6** Topic Checkpoint (short ladder quiz + notes on what you missed) — Grind; Cheap to build from the tagged bank; closes the learn-then-test loop; effort M
- [ ] **#7** One-time "GATE 2027 pass" (valid to March 2027) next to monthly plans, plus a 7–15 day trial — Forge; Their lifetime offer undercuts our monthly price for exam-season buyers; effort S (config)
- [ ] **#8** Weekly benchmark vs peers in your branch and a shareable weekly card — PadhaiShuru; Motivation and free sharing (links to our on-hold Share result); effort M
- [x] **#9** Study timer with daily goal (verified study minutes, week/month totals) — PadhaiShuru; Habit tracking; we show study hours but have no live timer (verify); effort M
- [ ] **#10** "Beat my score" friend challenge, then ELO 1v1 — Forge; Viral loop plus retention; effort M–L
- [ ] **#11** Weekly league with promotion (top 10 move up) — Forge; Turns the leaderboard into a weekly goal; effort M
- [x] **#12** Fresh randomised full mock each attempt with difficulty control — Forge; Unlimited practice; verify what our custom/AI test already covers; effort S–M
- [ ] **#13** General Aptitude lessons + daily 6-question test — Grind; GA is 15 marks for every branch; effort L
- [ ] **#14** "GATE 2027 changes" page — PadhaiShuru; Cheap, search-friendly, builds trust; effort S

### P2

- [x] **#15** Install as app + push reminders (PWA) — Forge; Better than waiting for the Telegram bot; effort M
- [ ] **#16** Flashcard decks (formulas, definitions) — Forge; Fast revision; needs content; effort L
- [ ] **#17** Predictor and cut-offs for EC/EE/ME/DA (we have CS only) — PadhaiShuru; Search traffic; needs verified official data (task S-5); effort M
- [ ] **#18** Subject/topic browser with counts and search — Grind; Discovery on public pages (verify our header search); effort M
- [ ] **#19** Mock time-split tips; 90-second demo video — Grind; Small trust builders; effort S

### P3

- [ ] **#20** Older papers: CS 2015–16, EC/EE/ME 2017–20; CE — Grind; Content depth; large but known work; effort L
- [ ] **#21** Personal PDF notes storage — PadhaiShuru; Nice to have; effort M
- [ ] **#22** Private study rooms (chat, shared files, timers) — PadhaiShuru; High effort plus moderation; defer; effort L

## Where we are ahead (promote, don't copy)
Real exam interface with official-style timer, sections, palette and now a calculator · official answer keys for 2017–2026 · AI Mentor and Tutor ·
analytics and Mistakes/Revision loops · study planner and calendar · All-India mocks · cloud sync · syllabus weightage for five papers · EE and EC
coverage (Project Forge has neither yet) · a daily Telegram question with yesterday's answer.

## Done from earlier reviews (10 Oct)
- [x] Virtual calculator in the exam screen (compact; hold anywhere outside to hide it, tap outside to close)
- [x] Telegram join cards on public pages and dashboard (no raw links)
- [x] Syllabus pages use the full page width; same content width and top spacing on every page

## Product rule (10 Oct)
Do not advertise "no login". Show what an account adds and guide visitors to sign in; do not widen free access for signed-out users.
